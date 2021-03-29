'use strict';


// Ruler and Compass
const version = require('../built/version');


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


    /**
    * Value used to determine equality between two numeric values. Used for
    * values that tend to be integers, like screen coordinates. Used by
    * `{@link Rac#equals}`.
    *
    * When checking for equality `x` is equal to non-inclusive
    * `(x-equalityThreshold, x+equalityThreshold)`:
    * + `x` is **not equal** to `x ± equalityThreshold`
    * + `x` is **equal** to `x ± equalityThreshold/2`
    *
    * Due to floating point precision some opertation like intersections
    * can return odd or oscilating values. This threshold is used to snap
    * values too close to a limit, as to prevent oscilating efects in
    * user interaction.
    *
    * Value is based on 1/1000 of a point, the minimal perceptible distance
    * the user can see.
    */
    this.equalityThreshold = 0.001;



    /**
    * Value used to determine equality between two unitary numeric values.
    * Used for values that tend to exist in the `[0, 1]` range, like
    * `{@link Rac.Angle#turn}`. Used by `{@link Rac#unitaryEquals}`.
    *
    * Equality logic is the same as `{@link Rac#equalityThreshold}`.
    *
    * Value is based on 1/000 of the turn of an arc of radius 500 and
    * lenght of 1: `1/(500*6.28)/1000`
    */
    this.unitaryEqualityThreshold = 0.0000003;

    // TODO: will become unnecesary with Ray
    // Length for elements that need an arbitrary value.
    this.arbitraryLength = 100;

    // Drawer for the instance. This object handles the drawing of any
    // visual object.
    this.drawer = null;

    require('./style/rac.Color')(this);
    require('./style/rac.Fill')(this);
    require('./drawable/rac.Angle')(this);
    require('./drawable/rac.Point')(this);

    // Depends on rac.Point and rac.Angle being already setup
    require('./drawable/rac.Text')(this);
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


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#equalityThreshold}`.
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  * @returns {boolean}
  */
  equals(a, b) {
    let diff = Math.abs(a-b);
    return diff < this.equalityThreshold;
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#unitaryEqualityThreshold}`.
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  * @returns {boolean}
  */
  unitaryEquals(a, b) {
    let diff = Math.abs(a-b);
    return diff < this.unitaryEqualityThreshold;
  }


  /**
  * Convenience function that creates a new `Color` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Color}`.
  *
  * @returns {Rac.Color}
  */
  Color(r, g, b, alpha = 1) {
    return new Rac.Color(this, r, g, b, alpha);
  }


  /**
  * Convenience function that creates a new `Stroke` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Stroke}`.
  *
  * @returns {Rac.Stroke}
  */
  Stroke(color = null, weight = 1) {
    return new Rac.Color(this, color, weight);
  }


  /**
  * Convenience function that creates a new `Fill` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Fill}`.
  *
  * @returns {Rac.Fill}
  */
  Fill(color = null) {
    return new Rac.Fill(this, color);
  }


  /**
  * Convenience function that creates a new `Style` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Style}`.
  *
  * @returns {Rac.Style}
  */
  Style(stroke = null, fill = null) {
    return new Rac.Style(this, stroke, fill);
  }


  /**
  * Convenience function that creates a new `Text` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Text}`.
  *
  * @returns {Rac.Text}
  */
  Text(string, format, point) {
    return new Rac.Text(this, string, format, point);
  }


  /**
  * Convenience function that creates a new `Angle` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Angle}`.
  *
  * @returns {Rac.Angle}
  */
  Angle(turn) {
    return new Rac.Angle(this, turn);
  }


  /**
  * Convenience function that creates a new `Point` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Point}`.
  *
  * @returns {Rac.Point}
  */
  Point(x, y) {
    return new Rac.Point(this, x, y);
  }


  /**
  * Convenience function that creates a new `Ray` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Ray}`.
  *
  * @returns {Rac.Ray}
  */
  Ray(start, angle) {
    return new Rac.Ray(this, start, angle);
  }


  /**
  * The `rac.Segment` function-container holds several convenience methods
  * and properties for creating `{@link Rac.Segment}` objects.
  * @namespace rac.Segment
  */

  /**
  * Convenience function that creates a new `Segment` using `this`.
  *
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Segment}`.
  *
  * @returns {Rac.Segment}
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
  * This function also contains more convenience methods and properties
  * listed in `{@link rac.Arc}`.
  *
  * @returns {Rac.Arc}
  */
  Arc(center, radius, start = this.Arc.zero, end = start, clockwise = true) {
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  }

} // class Rac


module.exports = Rac;


// All class (static) properties should be defined outside of the class
// as to prevent cyclic dependency with Rac.


const utils = require(`./util/utils`);
/**
* Container of utility functions. See `{@link utils}` for the available
* members.
*/
Rac.utils = utils;


/**
* Version of the class.
* @name version
* @memberof Rac
*/
utils.addConstant(Rac, 'version', version);


/**
* Tau, equal to `Math.PI * 2`.
* https://tauday.com/tau-manifesto
* @name TAU
* @memberof Rac
*/
utils.addConstant(Rac, 'TAU', Math.PI * 2);


// Exception
Rac.Exception = require('./util/Exception');


// Prototype functions
require('./attachProtoFunctions')(Rac);


// P5Drawer
Rac.P5Drawer = require('./p5Drawer/P5Drawer');


// Color
Rac.Color = require('./style/Color');


// Stroke
Rac.Stroke = require('./style/Stroke');
Rac.setupStyleProtoFunctions(Rac.Stroke);


// Fill
Rac.Fill = require('./style/Fill');
Rac.setupStyleProtoFunctions(Rac.Fill);


// Style
Rac.Style = require('./style/Style');
Rac.setupStyleProtoFunctions(Rac.Style);


// Text
Rac.Text = require('./drawable/Text');
Rac.setupDrawableProtoFunctions(Rac.Text);


// Angle
Rac.Angle = require('./drawable/Angle');


// Point
Rac.Point = require('./drawable/Point');
Rac.setupDrawableProtoFunctions(Rac.Point);


// Ray
Rac.Ray = require('./drawable/Ray');
Rac.setupDrawableProtoFunctions(Rac.Ray);


// Segment
Rac.Segment = require('./drawable/Segment');
Rac.setupDrawableProtoFunctions(Rac.Segment);


// Arc
Rac.Arc = require('./drawable/Arc');
Rac.setupDrawableProtoFunctions(Rac.Arc);


// Bezier
Rac.Bezier = require('./drawable/Bezier');
Rac.setupDrawableProtoFunctions(Rac.Bezier);


// Composite
Rac.Composite = require('./drawable/Composite');
Rac.setupDrawableProtoFunctions(Rac.Composite);


// Shape
Rac.Shape = require('./drawable/Shape');
Rac.setupDrawableProtoFunctions(Rac.Shape);


// EaseFunction
Rac.EaseFunction = require('./util/EaseFunction');


// Control
Rac.Control = require('./control/Control');


// SegmentControl
Rac.SegmentControl = require('./control/SegmentControl');


// ArcControl
Rac.ArcControl = require('./control/ArcControl');

