'use strict';


// Ruler and Compass
const version = require('../built/version');


// Adds an enumerable constant to the given object.
function addEnumConstant(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: value
  });
}


class Rac {

  constructor () {
    addEnumConstant(this, 'version', version);
    // https://tauday.com/tau-manifesto
    addEnumConstant(this, 'TAU', Math.PI * 2);

    // Used to determine equality between measures for some operations, like
    // calculating the slope of a segment. Values too close can result in odd
    // calculations.
    // When checking for equality x is equal to non-inclusive
    // (x-equalityThreshold, x+equalityThreshold):
    // + x is not equal to x±equalityThreshold
    // + x is equal to x±equalityThreshold/2
    this.equalityThreshold = 0.001;

    // Length for elements that need an arbitrary value.
    this.arbitraryLength = 100;

    // Drawer for the instance. This object handles the drawing of any
    // visual object.
    this.drawer = null;

    // Error identifiers
    this.Error = {
      abstractFunctionCalled: 'Abstract function called',
      invalidParameterCombination: 'Invalid parameter combination',
      invalidObjectConfiguration: 'Invalid object configuration',
      invalidObjectToConvert: 'Invalid object to convert',
      invalidObjectToDraw: 'Invalid object to draw',
      invalidObjectToApply: 'Invalid object to apply',
      drawerNotSetup: 'Drawer not setup'}
  }

  // Sets the drawer for the instance. Currently only a p5.js instance
  // is supported.
  // The drawer will also populate some classes with prototype functions
  // relevant to the drawer. For p5.js this include `apply` functions for
  // colors and style object, and `vertex` functions for drawable objects.
  setupDrawer(p5Instance) {
    this.drawer = new this.P5Drawer(this, p5Instance)
  }

}

// Makes a new RAC object populated with all RAC classes and features.
//
// The RAC object is initialized without a `drawer`. Call `setupDrawer`
// to enable drawing  functionality, otherwise an error will be thrown if
// any drawing is attempted.
let makeRac = function makeRac() {

  let rac = new Rac();


  // Convenience function for logging, returns the constructor name of
  // `obj`, or its type name.
  rac.typeName = function(obj) {
    return obj.constructor.name ?? typeof obj
  };


  // Prototype functions
  require('./attachProtoFunction')(rac);


  // P5Drawer
  rac.P5Drawer = require('./p5Drawer/makeP5Drawer')(rac);


  // Color
  rac.Color = require('./style/makeColor')(rac);


  // Stroke
  rac.Stroke = require('./style/makeStroke')(rac);
  rac.setupStyleProtoFunctions(rac.Stroke);


  // Fill
  rac.Fill = require('./style/makeFill')(rac);
  rac.setupStyleProtoFunctions(rac.Fill);


  // Style
  rac.Style = require('./style/makeStyle')(rac);
  rac.setupStyleProtoFunctions(rac.Style);


  // Text
  rac.Text = require('./drawable/makeText.js')(rac);
  rac.setupDrawableProtoFunctions(rac.Text);


  // Angle
  rac.Angle = require('./drawable/makeAngle')(rac);


  // Point
  rac.Point = require('./drawable/makePoint')(rac);
  rac.setupDrawableProtoFunctions(rac.Point);


  // Ray
  rac.Ray = require('./drawable/makeRay')(rac);
  rac.setupDrawableProtoFunctions(rac.Ray);


  // Segment
  rac.Segment = require('./drawable/makeSegment')(rac);
  rac.setupDrawableProtoFunctions(rac.Segment);


  // Arc
  rac.Arc = require('./drawable/makeArc')(rac);
  rac.setupDrawableProtoFunctions(rac.Arc);


  // Bezier
  rac.Bezier = require('./drawable/makeBezier')(rac);
  rac.setupDrawableProtoFunctions(rac.Bezier);


  // Composite
  rac.Composite = require('./drawable/makeComposite')(rac);
  rac.setupDrawableProtoFunctions(rac.Composite);


  // Shape
  rac.Shape = require('./drawable/makeShape')(rac);
  rac.setupDrawableProtoFunctions(rac.Shape);


  // EaseFunction
  rac.EaseFunction = require('./util/makeEaseFunction')(rac);


  // Control
  rac.Control = require('./control/makeControl')(rac);


  // SegmentControl
  rac.SegmentControl = require('./control/makeSegmentControl')(rac);


  // ArcControl
  rac.ArcControl = require('./control/makeArcControl')(rac);


  return rac;

}; // makeRac


addEnumConstant(makeRac, 'version', version);
module.exports = makeRac;

