"use strict";

(class SimThing extends Base {

  initPrototype () {
    this.newSlot("demo", null)

    // sim
    this.newSlot("bodyDef", null)
    //this.newSlot("shapeClass", null)
    this.newSlot("shape", null)
    this.newSlot("shapeDensity", 0) // 0 for static fixtures
    this.newSlot("body", null)
    this.newSlot("fixture", null)
    this.newSlot("isStatic", false)

    // view
    this.newSlot("material", null)
    this.newSlot("texturePath", null)
    this.newSlot("textureScale", 2)
    this.newSlot("mesh", null)
    this.newSlot("sceneObject", null)
  }

  // ---

  scene () {
    return this.demo().scene()
  }

  world () {
    return this.demo().world()
  }

  things () {
    return this.demo().things()
  }

  // ----

  init () {
    super.init()
  }

  setup () {
    this.setupSimBody()
    this.setupView()
  }

  // --- sim ---

  setupSimBody () {
    this.setupShape()
    this.setupBodyDef()
    this.setupBody()
    this.setupFixture()
  }

  setupShape () {
    // subclasses should override
    /*
    const shapeClass = this.shapeClass()
    const shape = new shapeClass();
    this.setShape(shape)
    */
  }

  setupBodyDef () {
    const bd = new Box2D.b2BodyDef();

    if (this.isStatic()) {
      bd.set_type(Box2D.b2_staticBody);
    } else {
      bd.set_type(Box2D.b2_dynamicBody);
    }

    bd.set_position(this.ZERO());
    this.setBodyDef(bd)
  }

  setupBody () {
    const body = this.world().CreateBody(this.bodyDef());
    this.setBody(body)
  }

  setupFixture () {
    const fixture = this.body().CreateFixture(this.shape(), this.shapeDensity());
    this.setFixture(fixture)
    fixture.SetRestitution(1)
  }
  
  awaken () {
    this.body().SetAwake(1);
    this.body().SetActive(1);
  }

  // --- view ---

  setupView () {
    this.setupMaterial()
    this.setupMesh()
    this.setupSceneObject()
  }

  setupMaterial () {
    const material = new CubicVR.Material({
      textures: {
        color: new CubicVR.Texture(this.texturePath())
      }
    });
    this.setMaterial(material)
  }

  uvMapper () {
    const s = this.textureScale()
    const uv = {
      projectionMode: CubicVR.enums.uv.projection.CUBIC,
      scale: [s, s, s]
    }
    return uv
  }

  setupMesh () {
    // subclasses should override
  }

  setupSceneObject () {
    const sceneObj = new CubicVR.SceneObject({ 
      mesh: this.mesh(), 
      position: [0, -10000, 0] 
    });
    this.setSceneObject(sceneObj)
  }

  ZERO () {
    return new Box2D.b2Vec2(0.0, 0.0)
  }

  randomVec2 (s = 10) {
    const vx = s*(Math.random() - 0.5)*2
    const vy = s*(Math.random() - 0.5)*2
    return new Box2D.b2Vec2(vx, vy)
  }

  // --- create & destroy ---

  create () {
    // sim
    this.awaken();
    // view
    this.scene().bindSceneObject(this.sceneObject(), true);
    this.things().push(this);
  }

  destroy () {
    const body = this.body()
    this.scene().removeSceneObject(this.sceneObject())
    this.world().DestroyBody(body);
    this.things().remove(this)
  }

  // --- update ---

  syncViewFromSim () {
    const body = this.body()
    const view = this.sceneObject();
    const p = body.GetPosition();
    view.position[0] = p.get_x();
    view.position[1] = p.get_y();
    view.position[2] = 0;
    view.rotation = [0, 0, body.GetAngle() * 180 / Math.PI];
  }

  isAwake () {
    return this.body().IsAwake()
  }

  setPos (x, y) {
    const p = new Box2D.b2Vec2(x, y)
    const r = this.body().GetAngle()
    this.body().SetTransform(p, r)
  }

  setAngle (a) {
    const r = a * Math.PI / 180
    const p = this.body().GetPosition();
    this.body().SetTransform(p, r)
    const r2 = this.body().GetAngle()
  }

}.initThisClass());

