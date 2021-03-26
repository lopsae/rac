'use strict';


// Ruler and Compass
const version = require('../built/version');


const utils = require(`./util/utils`);


/**
* This namespace contains functions attached to an instance of
* `{@link Rac}` that in turn contain convenience methods and properties.
*
* Drawable and related objects require a reference to a `rac` instance in
* order to perform drawing operations. These functions contain convenience
* methods and properties that provide objects already setup with a `rac`
* instance.
* @namespace rac
*/


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*/
class Rac {

  /**
  * Builds a new instance of Rac. The new instance will not contain a `drawer`.
  * In order to enable drawing operations call `setupDrawer` with a valid
  * object.
  */
  constructor () {

    /**
    * Version of the instance, same as `{@link Rac.version}`.
    * @name version
    * @memberof Rac#
    */
    utils.addConstant(this, 'version', version);

    // TODO: remove, leave only static one when Angle is migrated
    utils.addConstant(this, 'TAU', Math.PI * 2);

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
      drawerNotSetup: 'Drawer not setup'};

    require('./drawable/racPoint')(this);
    require('./drawable/racAngle')(this);
  }

  /**
  * Sets the drawer for the instance. Currently only a p5.js instance is
  * supported.
  *
  * The drawer will also populate some classes with prototype functions
  * relevant to the drawer. For p5.js this include `apply` functions for
  * colors and style object, and `vertex` functions for drawable objects.
  */
  setupDrawer(p5Instance) {
    this.drawer = new Rac.P5Drawer(this, p5Instance)
  }


  equals(value, expected) {
    let diff = Math.abs(value-expected);
    return diff < this.equalityThreshold;
  }


  /**
  * Convenience function that creates a new `Angle` using `this`.
  *
  * This function is also the container of other convenience methods and
  * properties listed in `{@link rac.Angle}`.
  */
  Angle(turn) {
    return new Rac.Angle(this, turn);
  }


  /**
  * Convenience function that creates a new `Point` using `this`.
  *
  * This function is also the container of other convenience methods and
  * properties listed in `{@link rac.Point}`.
  */
  Point(x, y) {
    return new Rac.Point(this, x, y);
  }


  /**
  * The `rac.Segment` function-container holds several convenience methods
  * and properties for creating `{@link Rac.Segment}` objects.
  * @namespace rac.Segment
  */

  /**
  * Convenience function that creates a new `Segment` using `this`.
  *
  * This function is also the container of other convenience methods and
  * properties listed in `{@link rac.Segment}`.
  */
  Segment(start, end) {
    return new Rac.Segment(this, start, end);
  }


  /**
  * The `rac.Arc` function-container holds several convenience methods
  * and properties for creating `{@link Rac.Arc}` objects.
  * @namespace rac.Arc
  */

  /**
  * Convenience function that creates a new `Arc` using `this`.
  *
  * This function is also the container of other convenience methods and
  * properties listed in `{@link rac.Arc}`.
  */
  Arc(center, radius, start = this.Arc.zero, end = start, clockwise = true) {
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  }


} // class Rac


module.exports = Rac;


/**
* Version of the class.
* @name version
* @memberof Rac
*/
utils.addConstant(Rac, 'version', version);

// https://tauday.com/tau-manifesto
utils.addConstant(Rac, 'TAU', Math.PI * 2);


/**
* Container of utility functions. See `{@link utils}` for the available
* members.
*/
Rac.utils = utils;


// Replace with utils
Rac.typeName = function(obj) {
  return obj.constructor.name ?? typeof obj
};


// Prototype functions
require('./attachProtoFunction')(Rac);


// P5Drawer
Rac.P5Drawer = require('./p5Drawer/P5Drawer');


// Color
Rac.Color = require('./style/Color');


// Stroke
Rac.Stroke = require('./style/makeStroke');
Rac.setupStyleProtoFunctions(Rac.Stroke);


// Fill
Rac.Fill = require('./style/makeFill');
Rac.setupStyleProtoFunctions(Rac.Fill);


// Style
Rac.Style = require('./style/makeStyle')(Rac);
Rac.setupStyleProtoFunctions(Rac.Style);


// Text
Rac.Text = require('./drawable/makeText.js')(Rac);
Rac.setupDrawableProtoFunctions(Rac.Text);


// Angle
Rac.Angle = require('./drawable/Angle');


// Point
Rac.Point = require('./drawable/Point');
Rac.setupDrawableProtoFunctions(Rac.Point);


// Ray
Rac.Ray = require('./drawable/makeRay')(Rac);
Rac.setupDrawableProtoFunctions(Rac.Ray);


// Segment
Rac.Segment = require('./drawable/Segment');
Rac.setupDrawableProtoFunctions(Rac.Segment);


// Arc
Rac.Arc = require('./drawable/Arc');
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
Rac.Control = require('./control/Control');


// SegmentControl
Rac.SegmentControl = require('./control/SegmentControl');


// ArcControl
Rac.ArcControl = require('./control/ArcControl');

