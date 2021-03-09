'use strict';


module.exports = function attachProtoFunctions(rac) {

  function checkDrawer(rac) {
    if (rac.drawer === null) {
      console.trace(`Drawer is not setup`);
      throw rac.Error.drawerNotSetup;
    }
  }


  // Container of prototype functions for drawable classes.
  rac.drawableProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `rac.drawableProtoFunctions`. These are functions shared by all
  // drawable objects (E.g. `draw()` and `debug()`).
  rac.setupDrawableProtoFunctions = function(classObj) {
    Object.keys(rac.drawableProtoFunctions).forEach(name => {
      classObj.prototype[name] = rac.drawableProtoFunctions[name];
    });
  }


  rac.drawableProtoFunctions.draw = function(style = null){
    checkDrawer(rac);

    rac.drawer.drawObject(this, style);
    return this;
  };

  rac.drawableProtoFunctions.debug = function(){
    checkDrawer(rac);

    rac.drawer.debugObject(this);
    return this;
  };


  rac.stack = [];

  rac.stack.peek = function() {
    return rac.stack[rac.stack.length - 1];
  }

  rac.drawableProtoFunctions.push = function() {
    rac.stack.push(this);
    return this;
  }

  rac.drawableProtoFunctions.pop = function() {
    return rac.stack.pop();
  }

  rac.drawableProtoFunctions.peek = function() {
    return rac.stack.peek();
  }

  // TODO: shape and composite should be stacks, so that several can be
  // started in different contexts
  rac.currentShape = null;
  rac.currentComposite = null;

  rac.popShape = function() {
    let shape = rac.currentShape;
    rac.currentShape = null;
    return shape;
  }

  rac.popComposite = function() {
    let composite = rac.currentComposite;
    rac.currentComposite = null;
    return composite;
  }

  rac.drawableProtoFunctions.attachToShape = function() {
    if (rac.currentShape === null) {
      rac.currentShape = new rac.Shape();
    }

    this.attachTo(rac.currentShape);
    return this;
  }

  rac.drawableProtoFunctions.popShape = function() {
    return rac.popShape();
  }

  rac.drawableProtoFunctions.popShapeToComposite = function() {
    let shape = rac.popShape();
    shape.attachToComposite();
    return this;
  }

  rac.drawableProtoFunctions.attachToComposite = function() {
    if (rac.currentComposite === null) {
      rac.currentComposite = new rac.Composite();
    }

    this.attachTo(rac.currentComposite);
    return this;
  }

  rac.drawableProtoFunctions.popComposite = function() {
    return rac.popComposite();
  }

  rac.drawableProtoFunctions.attachTo = function(someComposite) {
    if (someComposite instanceof rac.Composite) {
      someComposite.add(this);
      return this;
    }

    if (someComposite instanceof rac.Shape) {
      someComposite.addOutline(this);
      return this;
    }

    console.trace(`Cannot attachTo composite - someComposite-type:${rac.typeName(someComposite)}`);
    throw rac.Error.invalidObjectToConvert;
  };


  // Container of prototype functions for style classes.
  rac.styleProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `rac.styleProtoFunctions`. These are functions shared by all
  // style objects (E.g. `apply()`).
  rac.setupStyleProtoFunctions = function(classObj) {
    Object.keys(rac.styleProtoFunctions).forEach(name => {
      classObj.prototype[name] = rac.styleProtoFunctions[name];
    });
  }


  rac.styleProtoFunctions.apply = function(){
    checkDrawer(rac);
    rac.drawer.applyObject(this);
  };

} // attachProtoFunctions