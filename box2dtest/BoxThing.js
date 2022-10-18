"use strict";

(class BoxThing extends SimThing {

  initPrototype () {
    this.newSlot("demo", null)
    this.newSlot("width", 2)
    this.newSlot("height", 1)
    this.newSlot("depth", 1)
  }

  init () {
    super.init()
    //this.setShapeClass(Box2D.b2BodyDef)
    this.setTexturePath("images/cube1.jpg")
    this.setShapeDensity(5)
  }

  // --- setup ---

  setupSimBody () {
    this.setupShape()
    this.setupBodyDef()
    this.setupBody()
    this.setupFixture()
  }

  // --- setup sim ---

  setupShape () {
    const shape = new Box2D.b2PolygonShape();
    shape.SetAsBox(this.width()/2, this.height()/2);
    this.setShape(shape)
  }
  
  // --- setup view ---

  setupMesh () {
    const s = this.textureScale()
    const mesh = new CubicVR.primitives.box({
      size: [this.width(), this.height(), this.depth()],
      material: this.material(),
      uvmapper: this.uvMapper()
    }).calcNormals().triangulateQuads().compile().clean();
    this.setMesh(mesh)
  }

}.initThisClass());

