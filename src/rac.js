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

  static TAU = Math.PI * 2;

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


  equals(value, expected) {
    let diff = Math.abs(value-expected);
    return diff < this.equalityThreshold;
  }

} // class Rac


module.exports = Rac;

// Makes a new RAC object populated with all RAC classes and features.
//
// The RAC object is initialized without a `drawer`. Call `setupDrawer`
// to enable drawing  functionality, otherwise an error will be thrown if
// any drawing is attempted.
// let makeRac = function makeRac() {

//   let rac = new Rac();


  // Convenience function for logging, returns the constructor name of
  // `obj`, or its type name.
  Rac.typeName = function(obj) {
    return obj.constructor.name ?? typeof obj
  };


  // Prototype functions
  require('./attachProtoFunction')(Rac);


  // P5Drawer
  Rac.P5Drawer = require('./p5Drawer/makeP5Drawer')(Rac);


  // Color
  Rac.Color = require('./style/makeColor')(Rac);


  // Stroke
  Rac.Stroke = require('./style/makeStroke')(Rac);
  Rac.setupStyleProtoFunctions(Rac.Stroke);


  // Fill
  Rac.Fill = require('./style/makeFill')(Rac);
  Rac.setupStyleProtoFunctions(Rac.Fill);


  // Style
  Rac.Style = require('./style/makeStyle')(Rac);
  Rac.setupStyleProtoFunctions(Rac.Style);


  // Text
  Rac.Text = require('./drawable/makeText.js')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Text);


  // Angle
  Rac.Angle = require('./drawable/makeAngle')(Rac);


  // Point
  Rac.Point = require('./drawable/makePoint');
  Rac.setupDrawableProtoFunctions(Rac.Point);


  // Ray
  Rac.Ray = require('./drawable/makeRay')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Ray);


  // Segment
  Rac.Segment = require('./drawable/makeSegment')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Segment);


  // Arc
  Rac.Arc = require('./drawable/makeArc')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Arc);


  // Bezier
  Rac.Bezier = require('./drawable/makeBezier')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Bezier);


  // Composite
  Rac.Composite = require('./drawable/makeComposite')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Composite);


  // Shape
  Rac.Shape = require('./drawable/makeShape')(Rac);
  Rac.setupDrawableProtoFunctions(Rac.Shape);


  // EaseFunction
  Rac.EaseFunction = require('./util/makeEaseFunction')(Rac);


  // Control
  Rac.Control = require('./control/makeControl')(Rac);


  // SegmentControl
  Rac.SegmentControl = require('./control/makeSegmentControl')(Rac);


  // ArcControl
  Rac.ArcControl = require('./control/makeArcControl')(Rac);


  // console.log('rac.js finished');


  // return rac;

// }; // makeRac


// addEnumConstant(makeRac, 'version', version);
// module.exports = makeRac;

