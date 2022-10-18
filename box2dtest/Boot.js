"use strict";

class Boot extends Object {

  cubicFiles () {
    const files = [
      "CubicVR.COLLADA.js",
      "CubicVR.CVRXML.js",
      "CubicVR.Camera.js",
      "CubicVR.CollisionMap.js",
      "CubicVR.Event.js",
      "CubicVR.GML.js",
      "CubicVR.IFC.js",
      "CubicVR.Landscape.js",
      "CubicVR.Layout.js",
      "CubicVR.Light.js",
      "CubicVR.MainLoop.js",
      "CubicVR.Material.js",
      "CubicVR.Math.js",
      "CubicVR.Mesh.js",
      "CubicVR.Motion.js",
      "CubicVR.Octree.js",
      "CubicVR.PDF.js",
      "CubicVR.Particles.js",
      "CubicVR.Polygon.js",
      "CubicVR.PostProcess.js",
      "CubicVR.Primitives.js",
      "CubicVR.Renderer.js",
      "CubicVR.RigidVehicle.js",
      "CubicVR.Scene.js",
      "CubicVR.ScenePhysics.js",
      "CubicVR.Shader.js",
      "CubicVR.Texture.js",
      "CubicVR.UVMapper.js",
      "CubicVR.Utility.js",
      "CubicVR.Worker.js",
      "collada.js"
    ]

    const out = files.map(file => "../shared/CubicVR.js-master/source/" + file)
    const base = ["../shared/CubicVR.js-master/CubicVR.js"]
    return base.concat(out)
    //return out.concat(base)
  }

  files () {
    document.write = () => {
      console.log("attempt to write to document")
    }
    
    return [
      "../shared/libs/CubicVR.min.js",
      //"../shared/CubicVR.js-master/dist/CubicVR.min.js",
      "../shared/libs/Box2D_v2.2.1_min.js",

      "../shared/Base/getGlobalThis.js",
      "../shared/Base/Base.js",
      "../shared/Base/Type.js",

      "./SimThing.js",
      "./BoxThing.js",
      "./CircleThing.js",
      "./WebApp.js",
    ]
  }

  allFiles () {
    return this.files()
//    return this.cubicFiles().concat(this.files())
  }

  start () {
    this._queue = this.allFiles().slice()
    this.loadNext()
  }

  loadNext () {
    if (this._queue.length) {
      const file = this._queue.shift()
      this.loadScript(file, () => this.loadNext())
    } else {
      this.didFinish()
    }
  }

  loadScript (url, callback) {
    //console.log("load url '" + url + "'")
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = (event) => {
      callback();
    }
    script.onload = callback;
    script.onerror = (error) => {
      console.log(error)
    }
    head.appendChild(script);
  }

  didFinish () {
    WebApp.launch();
  }
};

window.addEventListener("load", () => {
  new Boot().start()
});
