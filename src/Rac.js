'use strict';


// Ruler and Compass
const versioning = require('../built/versioning')
const version = versioning.version;
const build   = versioning.build;
const dated   = versioning.dated;


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*
* An instance must be created with `new Rac()` in order to
* build drawable, style, and other objects.
*
* To perform drawing operations, a drawer must be setup with
* [`setupDrawer`]{@link Rac#setupDrawer}. Currently the only available
* implementation is [`P5Drawer`]{@link Rac.P5Drawer}.
*/
class Rac {

  /**
  * Creates a new instance of Rac. The new instance has no `drawer` setup.
  */
  constructor() {

    /**
    * Version of the instance, equivalent to `{@link Rac.version}`.
    *
    * @example
    * rac.version // returns E.g. '1.2.1'
    *
    * @constant {String} version
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'version', version);


    /**
    * Build of the instance, equivalent to `{@link Rac.build}`.
    *
    * @example
    * rac.build // returns E.g. '1057-94b059d'
    *
    * @constant {String} build
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'build', build);


    /**
    * Date of the build of the instance, equivalent to `{@link Rac.dated}`.
    *
    * @example
    * rac.dated // returns E.g. '2022-10-13T23:06:12.500Z'
    *
    * @constant {String} dated
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'dated', dated);


    /**
    * Value used to determine equality between two numeric values. Used for
    * values that tend to be integers, like screen coordinates. Used by
    * [`equals`]{@link Rac#equals}.
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
    * The default value is based on `1/1000` of a point.
    *
    * @type {Number}
    * @default 0.001
    */
    this.equalityThreshold = 0.001;


    /**
    * Value used to determine equality between two unitary numeric values.
    * Used for values that tend to exist in the `[0, 1]` range, like
    * [`angle.turn`]{@link Rac.Angle#turn}. Used by
    * [`unitaryEquals`]{@link Rac#unitaryEquals}.
    *
    * Equality logic is the same as
    * [`equalityThreshold`]{@link Rac#equalityThreshold}.
    *
    * The default value is based on 1/1000 of the turn of an complete
    * circle arc of radius 500:
    * ```
    * 1/(500*6.28)/1000 = 0.000_000_318471338
    * ```
    *
    * @type {Number}
    * @default 0.000_000_3
    */
    this.unitaryEqualityThreshold = 0.0000003;


    /**
    * Container of utility functions. See the
    * [`utils` namespace]{@link utils} for the available members.
    *
    * Also available through `{@link Rac.utils}`.
    *
    * @type {utils}
    */
    this.utils = utils

    this.stack = [];
    this.shapeStack = [];
    this.compositeStack = [];


    /**
    * Defaults for the optional properties of
    * [`Text.Format`]{@link Rac.Text.Format}.
    *
    * When a [`Text`]{@link Rac.Text} is draw which
    * [`format.font`]{@link Rac.Text.Format#font} or
    * [`format.size`]{@link Rac.Text.Format#size} are set to `null`, the
    * values set here are used instead.
    *
    * @property {?String} font=null
    *   Default font, used when drawing a `Text` which
    *   [`format.font`]{@link Rac.Text.Format#font} is set to `null`; when
    *   set to `null` the font is not set upon drawing
    * @property {Number} size=15
    *   Default size, used when drawing a `Text` which
    *   [`format.size`]{@link Rac.Text.Format#size} is set to `null`
    *
    * @type {Object}
    */
    this.textFormatDefaults = {
      font: null,
      size: 15
    };


    /**
    * Drawer of the instance. This object handles the drawing for all
    * drawable object created using `this`.
    * @type {?Object}
    * @default null
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
    require('./drawable/instance.Text.Format')(this);
    require('./drawable/instance.Text')       (this);



    /**
    * Controller of the instance. This objecs handles all of the controls
    * and pointer events related to this instance of `Rac`.
    */
    this.controller = new Rac.Controller(this);
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
  * under [`equalityThreshold`]{@link Rac#equalityThreshold}.
  *
  * @param {Number} a - First number to compare
  * @param {Number} b - Second number to compare
  *
  * @returns {Boolean}
  */
  equals(a, b) {
    if (a === null || b === null) { return false; }
    let diff = Math.abs(a-b);
    return diff < this.equalityThreshold;
  }


  /**
  * Returns `true` if the absolute distance between `a` and `b` is
  * under [`unitaryEqualityThreshold`]{@link Rac#unitaryEqualityThreshold}.
  *
  * @param {Number} a First number to compare
  * @param {Number} b Second number to compare
  *
  * @returns {Boolean}
  */
  unitaryEquals(a, b) {
    if (a === null || b === null) { return false; }
    const diff = Math.abs(a-b);
    return diff < this.unitaryEqualityThreshold;
  }


  pushStack(obj) {
    this.stack.push(obj);
  }


  peekStack() {
    if (this.stack.length <= 0) {
      return null;
    }
    return this.stack[this.stack.length - 1];
  }


  popStack() {
    if (this.stack.length <= 0) {
      return null;
    }
    return this.stack.pop();
  }


  pushShape(shape = null) {
    shape = shape ?? new Rac.Shape(this);
    this.shapeStack.push(shape);
    return shape;
  }


  peekShape() {
    if (this.shapeStack.length <= 0) {
      return null;
    }
    return this.shapeStack[this.shapeStack.length - 1];
  }


  popShape() {
    if (this.shapeStack.length <= 0) {
      return null;
    }
    return this.shapeStack.pop();
  }


  pushComposite(composite) {
    composite = composite ?? new Rac.Composite(this);
    this.compositeStack.push(composite);
    return composite;
  }


  peekComposite() {
    if (this.compositeStack.length <= 0) {
      return null;
    }
    return this.compositeStack[this.compositeStack.length - 1];
  }


  popComposite() {
    if (this.compositeStack.length <= 0) {
      return null;
    }
    return this.compositeStack.pop();
  }

} // class Rac


module.exports = Rac;


// All class (static) properties should be defined outside of the class
// as to prevent cyclic dependency with Rac.


/**
* Container of utility functions. See the [`utils` namespace]{@link utils}
* for the available members.
*
* Also available through [`rac.utils`]{@link Rac#utils}.
*
* @var {utils}
* @memberof Rac
*/
const utils = require(`./util/utils`);
Rac.utils = utils;


/**
* Version of the class. Equivalent to the version used for the npm package.
*
* @example
* Rac.version // returns E.g. '1.2.1'
*
* @constant {String} version
* @memberof Rac
*/
utils.addConstantTo(Rac, 'version', version);


/**
* Build of the class. Intended for debugging purpouses.
*
* Contains a commit-count and short-hash of the repository when the build
* was done.
*
* @example
* Rac.build // returns E.g. '1057-94b059d'
*
* @constant {String} build
* @memberof Rac
*/
utils.addConstantTo(Rac, 'build', build);



/**
* Date of the build of the class. Intended for debugging purpouses.
*
* Contains a [ISO-8601 standard](https://en.wikipedia.org/wiki/ISO_8601)
* date when the build was done.
*
* @example
* Rac.dated // returns E.g. '2022-10-13T23:06:12.500Z'
*
* @constant {String} dated
* @memberof Rac
*/
utils.addConstantTo(Rac, 'dated', dated);


/**
* Tau, equal to `Math.PI * 2`.
*
* See [Tau Manifesto](https://tauday.com/tau-manifesto).
*
* @constant {Number} TAU
* @memberof Rac
*/
utils.addConstantTo(Rac, 'TAU', Math.PI * 2);


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


// StyleContainer
Rac.StyleContainer = require('./style/StyleContainer');
Rac.setupStyleProtoFunctions(Rac.StyleContainer);


// Angle
Rac.Angle = require('./drawable/Angle');
Rac.Angle.prototype.log = Rac.drawableProtoFunctions.log;


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


// Controller
Rac.Controller = require('./control/Controller');


// Control
Rac.Control = require('./control/Control');


// RayControl
Rac.RayControl = require('./control/RayControl');


// ArcControl
Rac.ArcControl = require('./control/ArcControl');

