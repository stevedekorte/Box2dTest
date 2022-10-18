"use strict";

(class WebApp extends Base {
  static launch () {
    getGlobalThis().app = WebApp.clone()
    app.loadBox2D()
  }

  initPrototype () {
    // simulation
    this.newSlot("things", [])
    this.newSlot("bodies", [])
    this.newSlot("world", null)
    this.newSlot("totalTime", 0)

    this.newSlot("floor", 0)

    // views
    this.newSlot("canvas", null)
    this.newSlot("scene", null)

    // input
    this.newSlot("mouseDownCallback", null)
    this.newSlot("windowResizeCallback", null)
  }

  init () {
    super.init()
    this.setBodies([])
  }

  // --- init Box2D ---

  loadBox2D () {
    Box2D().then((Box2D) => {
      getGlobalThis().Box2D = Box2D
      this.onLoadBox2D()
    })
  }

  onLoadBox2D () {
    this.setup()
    this.run()
  }

  // --- setup ---

  setup () {
    this.setupViews()
    this.setupWorld()

    this.setupGround()
    this.setupLight()

    this.setupMouseController()

    this.startListeningForMouseDown()
    this.startListeningForWindowResize()
  }

  setupViews () {
    this.setupCanvas()
    this.setupScene()    
  }

  // --- simulation ---

  setupWorld () {
    //const gravity = new Box2D.b2Vec2(0.0, -10.0); 
    const gravity = new Box2D.b2Vec2(0.0, 0.0); 
    const world = new Box2D.b2World(gravity)
    this.setWorld(world);
  }

  setupGround () {
    /*
    const floor = Floor.clone()
    floor.setDemo(this)
    floor.setup()
    //floor.create()
    this.setFloor(floor)
    */
    
    this.newBox(0, -10, 21, 1)
    this.newBox(-10, 0, 1, 21)
    this.newBox(10, 0, 1, 21)
    this.newBox(0, 10, 21, 1)
  }

  newBox (x, y, w, h) {
    const box = BoxThing.clone()
    box.setTexturePath("images/cube6.jpg")

    box.setDemo(this)
    box.setIsStatic(true)
    box.setShapeDensity(0)
    box.setWidth(w)
    box.setHeight(h)
    box.setup()
    box.setPos(x, y)
    box.setAngle(0)
    box.create()
  }

  destroyInactive () {
    const inactiveThings = this.things().filter(thing => !thing.isAwake() && !thing.isStatic())
    inactiveThings.forEach(thing => thing.destroy())
  }

  simulate (dt) {
    this.world().Step(dt, 2, 2); 
    this.things().forEach(thing => thing.syncViewFromSim())
    this.setTotalTime(this.totalTime() + dt);
  }
  
  // --- views ---

  setupMouseController () {
    const mvc = new CubicVR.MouseViewController(this.canvas(), this.scene().camera);
  }

  setupCanvas () {
    CubicVR.GLCore.fixed_size = null
    const gl = CubicVR.GLCore.init(); // creates a canvas and adds to body?
    this.setCanvas(CubicVR.GLCore.canvas)
  
    if (!gl) {
      alert("Sorry, no WebGL support :(");
      return;
    };
  }

  setupCanvasSize () {
    const canvas = this.canvas()
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setupScene () {
    const canvas = this.canvas()
    const scene = new CubicVR.Scene(canvas.width, canvas.height, 70);
    this.setScene(scene)
    scene.camera.position = [0, 0, 17];
    scene.camera.target = [0, 0, 0];
  }

  setupLight () {
    const light = new CubicVR.Light({
      type:CubicVR.enums.light.type.POINT,
      position: [0, 0, 5],
      intensity: 0.9,
      areaCeiling: 80,
      areaFloor: 0,
      areaAxis: [15, 10],
      distance: 60,
      mapRes: 1024
    });
    this.scene().bindLight(light);
  }

  // --- run ---------------------------

  run () {  
      CubicVR.MainLoop((timer, gl) => {
        this.timeStep(timer, gl);
      });
  }

  timeStep (timer, gl) {
    const dt = timer.getLastUpdateSeconds();
    this.simulate(dt);
    this.scene().updateShadows();
    this.scene().render();
    this.destroyInactive()
  }

  element () {
    return document.body
  }

  // --- mouse ---

  startListeningForMouseDown () {
    if (!this.mouseDownCallback()) {
        this.setMouseDownCallback((event) => this.onMouseDown(event))
        this.element().addEventListener("mousedown", this.mouseDownCallback())
    }
  }

  onMouseDown (event) {
    const p = this.positionForEvent(event)
    this.addOneBoxBody(p)
  }

  addOneBoxBody (point) {
    let x = point.x
    let y = point.y
    const w = this.element().clientWidth
    const h = this.element().clientHeight

    const r = 1/30
    x = (x - w/2) * r
    y = -(y - h/2) * r
    //console.log("point: ", x, y)

    const aClass = (Math.random() > 0.5) ? CircleThing : BoxThing;
    //const aClass = CircleThing;
    const thing = aClass.clone()
    thing.setDemo(this)
    if (aClass === CircleThing) {
      if (Math.random() < 0.5) {
        thing.setTexturePath("images/cube2.jpg")
      } else {
        thing.setTexturePath("images/cube5.jpg")
      }
      thing.setRadius(1)
    } else {
      thing.setWidth(Math.random()*2 + 1)
      thing.setHeight(thing.width() * 1.618)

      if (Math.random() < 0.5) {
        thing.setTexturePath("images/cube4.jpg")
      } else {
        thing.setTexturePath("images/cube7.jpg")
      }
    }


    thing.setup()
    thing.setPos(x, y)
    thing.create()
    thing.body().SetLinearVelocity(thing.randomVec2(20));
  }

  positionForEvent (e) {
    const rect = this.element().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x: x, y: y }
  }

  // --- window resize ---

  startListeningForWindowResize () {
    if (!this.windowResizeCallback()) {
        this.setWindowResizeCallback((event) => this.onWindowResize(event))
        window.addEventListener("resize", this.windowResizeCallback())
    }
  }

  onWindowResize (event) {
    this.setupCanvasSize()
  }

}.initThisClass());

