'use strict';



module.exports = function attachProtoFunctions(rac) {

  // Container for prototype functions
  rac.protoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `rac.protoFunctions`. These are functions shared by all visual
  // objects like `draw()` and `debug()`.
  rac.setupProtoFunctions = function(classObj) {
    Object.keys(rac.protoFunctions).forEach(name => {
      classObj.prototype[name] = rac.protoFunctions[name];
    });
  }


  rac.protoFunctions.draw = function(style = null){
    // TODO: add error if drawer has not been set
    rac.drawer.drawElement(this, style);
    return this;
  };

  rac.protoFunctions.debug = function(){
    rac.drawer.debugElement(this);
    return this;
  };


  rac.stack = [];

  rac.stack.peek = function() {
    return rac.stack[rac.stack.length - 1];
  }

  rac.protoFunctions.push = function() {
    rac.stack.push(this);
    return this;
  }

  rac.protoFunctions.pop = function() {
    return rac.stack.pop();
  }

  rac.protoFunctions.peek = function() {
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

  rac.protoFunctions.attachToShape = function() {
    if (rac.currentShape === null) {
      rac.currentShape = new rac.Shape();
    }

    this.attachTo(rac.currentShape);
    return this;
  }

  rac.protoFunctions.popShape = function() {
    return rac.popShape();
  }

  rac.protoFunctions.popShapeToComposite = function() {
    let shape = rac.popShape();
    shape.attachToComposite();
    return this;
  }

  rac.protoFunctions.attachToComposite = function() {
    if (rac.currentComposite === null) {
      rac.currentComposite = new rac.Composite();
    }

    this.attachTo(rac.currentComposite);
    return this;
  }

  rac.protoFunctions.popComposite = function() {
    return rac.popComposite();
  }

  rac.protoFunctions.attachTo = function(someComposite) {
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

}
