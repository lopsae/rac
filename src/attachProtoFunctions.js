'use strict';


const Rac = require('./Rac');
const utils = require('./util/utils');


module.exports = function attachProtoFunctions(rac) {

  function assertDrawer(drawable) {
    if (drawable.rac == null || drawable.rac.drawer == null) {
      throw Rac.Exception.drawerNotSetup.make(
        `drawable-type:${utils.typeName(drawable)}`);
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
    assertDrawer(this);
    this.rac.drawer.drawObject(this, style);
    return this;
  };

  rac.drawableProtoFunctions.debug = function(drawsText = false){
    assertDrawer(this);

    this.rac.drawer.debugObject(this, drawsText);
    return this;
  };


  // TODO: has to be moved to rac instance
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
  // TODO: has to be moved to rac instance
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
      rac.currentComposite = new rac.Composite(this.rac);
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

    throw Rac.Exception.invalidObjectType.make(
      `Cannot attachTo composite - someComposite-type:${utils.typeName(someComposite)}`);
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
    assertDrawer(this);
    this.rac.drawer.applyObject(this);
  };

} // attachProtoFunctions
