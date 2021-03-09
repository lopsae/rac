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
    addEnumConstant(this, `TAU`, Math.PI * 2);

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
  // TODO: This function will also populate some of the clases with
  // prototype functions specific to the drawer. For p5.js this include
  // `apply` functions for colors and style elements, and `vertex`
  // functions for
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


// TODO: rename to attachProtoFunction
  // Prototype functions
  require('./protoFunctions')(rac);


  // P5Drawer
  rac.P5Drawer = require('./makeP5Drawer')(rac);


  // Color
  rac.Color = require('./visual/makeColor')(rac);


  // Stroke
  rac.Stroke = require('./visual/makeStroke')(rac);
  rac.setupStyleProtoFunctions(rac.Stroke);


  // Fill
  rac.Fill = require('./visual/makeFill')(rac);
  rac.setupStyleProtoFunctions(rac.Fill);


  // Style
  rac.Style = require('./visual/makeStyle')(rac);
  rac.setupStyleProtoFunctions(rac.Style);


  // Text
  rac.Text = require('./visual/makeText.js')(rac);
  rac.setupDrawableProtoFunctions(rac.Text);

  // TODO: should be added by drawerp5
  rac.Text.Format.prototype.apply = function(point) {
    let hAlign;
    let hOptions = rac.Text.Format.horizontal;
    switch (this.horizontal) {
      case hOptions.left:   hAlign = rac.drawer.p5.LEFT;   break;
      case hOptions.center: hAlign = rac.drawer.p5.CENTER; break;
      case hOptions.right:  hAlign = rac.drawer.p5.RIGHT;  break;
      default:
        console.trace(`Invalid horizontal configuration - horizontal:${this.horizontal}`);
        throw rac.Error.invalidObjectConfiguration;
    }

    let vAlign;
    let vOptions = rac.Text.Format.vertical;
    switch (this.vertical) {
      case vOptions.top:      vAlign = rac.drawer.p5.TOP;      break;
      case vOptions.bottom:   vAlign = rac.drawer.p5.BOTTOM;   break;
      case vOptions.center:   vAlign = rac.drawer.p5.CENTER;   break;
      case vOptions.baseline: vAlign = rac.drawer.p5.BASELINE; break;
      default:
        console.trace(`Invalid vertical configuration - vertical:${this.vertical}`);
        throw rac.Error.invalidObjectConfiguration;
    }

    // Text properties
    rac.drawer.p5.textAlign(hAlign, vAlign);
    rac.drawer.p5.textSize(this.size);
    if (this.font !== null) {
      rac.drawer.p5.textFont(this.font);
    }

    // Positioning
    rac.drawer.p5.translate(point.x, point.y);
    if (this.rotation.turn != 0) {
      rac.drawer.p5.rotate(this.rotation.radians());
    }
  }


  // Angle
  rac.Angle = require('./geometry/makeAngle')(rac);


  // Point
  rac.Point = require('./geometry/makePoint')(rac);
  rac.setupDrawableProtoFunctions(rac.Point);

  // TODO: functions should be added by P5 drawer
  // TODO: implemenent drawingAreaCenter, rename to pointer
  rac.Point.mouse = function() {
    return new rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
  }

  rac.Point.center = function() {
    return new rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
  }

  rac.Point.prototype.vertex = function() {
    rac.drawer.p5.vertex(this.x, this.y);
    return this;
  }


  // Segment
  rac.Segment = require('./geometry/makeSegment')(rac);
  rac.setupDrawableProtoFunctions(rac.Segment);

  // TODO: should be added by p5drawer
  rac.Segment.prototype.vertex = function() {
    this.start.vertex();
    this.end.vertex();
    return this;
  }


  rac.Arc = require('./geometry/makeArc')(rac);
  rac.setupDrawableProtoFunctions(rac.Arc);

  // TODO: should be added by p5drawer
  rac.Arc.prototype.vertex = function() {
    let arcLength = this.arcLength();
    let beziersPerTurn = 5;
    let divisions = arcLength.turn == 0
      ? beziersPerTurn
      // TODO: use turnOne? when possible to test
      : Math.ceil(arcLength.turn * beziersPerTurn);

    this.divideToBeziers(divisions).vertex();
    return this;
  }


  // Bezier
  rac.Bezier = require('./geometry/makeBezier')(rac);
  rac.setupDrawableProtoFunctions(rac.Bezier);

  rac.Bezier.prototype.vertex = function() {
    this.start.vertex()
    rac.drawer.p5.bezierVertex(
      this.startAnchor.x, this.startAnchor.y,
      this.endAnchor.x, this.endAnchor.y,
      this.end.x, this.end.y);
  };


  // Composite
  rac.Composite = require('./geometry/makeComposite')(rac);
  rac.setupDrawableProtoFunctions(rac.Composite);

  // TODO: should be added by drawerp5
  rac.Composite.prototype.vertex = function() {
    this.sequence.forEach(item => item.vertex());
  };


  // Shape
  rac.Shape = require('./geometry/makeShape')(rac);
  rac.setupDrawableProtoFunctions(rac.Shape);

  // TODO: should be added by drawerp5
  rac.Shape.prototype.vertex = function() {
    this.outline.vertex();
    this.contour.vertex();
  };


  // EaseFunction
  rac.EaseFunction = require('./visual/makeEaseFunction')(rac);


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

