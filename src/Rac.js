'use strict';


// Ruler and Compass
const version = require('../built/version');


/**
* This namespace lists utility functions attached to an instance of
* `{@link Rac}` used produce drawable and other objects, and to access
* ready-build convenience objects like {@link instance.Angle.north} or
* `{@link instance.Point.zero}`.
*
* Drawable and related objects require a reference to a `rac` instance in
* order to perform drawing operations. These functions build new objects
* using the calling `Rac` instance, and contain ready-made convenience
* objects that are also setup with the same `Rac` instance.
*
* @namespace instance
*/


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*
* An instance must be created with `new Rac()` in order to
* build drawable and most other objects.
*
* To perform drawing operations, a drawer must be setup with
* `{@link Rac#setupDrawer}.`
*/
class Rac {

  /**
  * Creates a new instance of Rac. The new instance has no `drawer` setup.
  */
  constructor() {

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

    /**
    * Drawer of the instance. This object handles the drawing of all
    * drawable object using to this instance of `Rac`.
    */
    this.drawer = null;

    require('./attachInstanceFunctions')(this);

    require('./style/instance.Color')     (this);
    require('./style/instance.Stroke')    (this);
    require('./style/instance.Fill')      (this);
    require('./drawable/instance.Angle')  (this);
    require('./drawable/instance.Point')  (this);
    require('./drawable/instance.Ray')    (this);
    require('./drawable/instance.Segment')(this);
    require('./drawable/instance.Arc')    (this);
    require('./drawable/instance.Bezier') (this);

    // Depends on instance.Point and instance.Angle being already setup
    require('./drawable/instance.Text')(this);
  }

  /**
  * Sets the drawer for the instance. Currently only a p5.js instance is
  * supported.
  *
  * The drawer will also populate some classes with prototype functions
  * relevant to the drawer. For p5.js this include `apply` functions for
  * colors and style object, and `vertex` functions for drawable objects.
  *
  * @param {P5} p5Instance
  */
  setupDrawer(p5Instance) {
    this.drawer = new Rac.P5Drawer(this, p5Instance)
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#equalityThreshold}`.
  *
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  *
  * @returns {boolean}
  */
  equals(a, b) {
    if (a === null || b === null) { return false; }
    let diff = Math.abs(a-b);
    return diff < this.equalityThreshold;
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under `{@link Rac#unitaryEqualityThreshold}`.
  *
  * @param {number} a First number to compare
  * @param {number} b Second number to compare
  *
  * @returns {boolean}
  */
  unitaryEquals(a, b) {
    if (a === null || b === null) { return false; }
    const diff = Math.abs(a-b);
    return diff < this.unitaryEqualityThreshold;
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


// Text
Rac.Text = require('./drawable/Text');
Rac.setupDrawableProtoFunctions(Rac.Text);


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

