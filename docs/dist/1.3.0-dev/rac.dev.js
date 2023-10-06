// RAC - ruler-and-compass - 1.3.0-dev localBuild-1282-a402ef7 2023-10-06T07:29:51.563Z
// Development distribution with sourcemaps 
// DIRTY BUILD - DO NOT COMMIT
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version and build
/**
* Container of the versioning data for the package.
* @namespace versioning
*/
module.exports = {

  /**
  * Version of the package. Exposed through
  * [`Rac.version`]{@link Rac.version}.
  * @constant {String} version
  * @memberof versioning#
  */
  version: '1.3.0-dev',

  /**
  * Build of the package. Exposed through
  * [`Rac.build`]{@link Rac.build}.
  * @constant {String} build
  * @memberof versioning#
  */
  build: 'localBuild-1282-a402ef7',

  /**
  * Date of build of the package. Exposed through
  * [`Rac.dated`]{@link Rac.dated}.
  * @constant {String} dated
  * @memberof versioning#
  */
  dated: '2023-10-06T07:29:51.563Z'
};


},{}],2:[function(require,module,exports){
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
    * Version of the instance, same as `{@link Rac.version}`.
    *
    * @example
    * rac.version // example return: '1.2.1'
    *
    * @constant {String} version
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'version', version);


    /**
    * Build of the instance, same as `{@link Rac.build}`.
    *
    * @example
    * rac.build // example return: '1057-94b059d'
    *
    * @constant {String} build
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'build', build);


    /**
    * Date of the build of the instance, same as `{@link Rac.dated}`.
    *
    * @example
    * rac.dated // example return: '2022-10-13T23:06:12.500Z'
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
    require('./drawable/instance.Text')(this);


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
* Version of the class. Same as the version used for the npm package.
*
* @example
* Rac.version // example return: '1.2.1'
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
* Rac.build // example return: '1057-94b059d'
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
* Rac.dated // example return: '2022-10-13T23:06:12.500Z'
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


},{"../built/versioning":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/Controller":7,"./control/RayControl":8,"./drawable/Angle":9,"./drawable/Arc":10,"./drawable/Bezier":11,"./drawable/Composite":12,"./drawable/Point":13,"./drawable/Ray":14,"./drawable/Segment":15,"./drawable/Shape":16,"./drawable/Text":18,"./drawable/instance.Angle":19,"./drawable/instance.Arc":20,"./drawable/instance.Bezier":21,"./drawable/instance.Point":22,"./drawable/instance.Ray":23,"./drawable/instance.Segment":24,"./drawable/instance.Text":25,"./p5Drawer/P5Drawer":27,"./style/Color":33,"./style/Fill":34,"./style/Stroke":35,"./style/StyleContainer":36,"./style/instance.Color":37,"./style/instance.Fill":38,"./style/instance.Stroke":39,"./util/EaseFunction":40,"./util/Exception":41,"./util/utils":42}],3:[function(require,module,exports){
'use strict';


const Rac = require('./Rac');


/**
* This namespace lists utility functions attached to an instance of
* `{@link Rac}` during initialization. Each drawable and style class gets
* a corresponding function like [`rac.Point`]{@link instance.Point} or
* [`rac.Color`]{@link instance.Color}.
*
* Drawable and style objects require for construction a reference to a
* `Rac` instance in order to perform drawing operations. The attached
* functions build new objects using the owning `Rac` instance.
*
* These functions are also setup with ready-made convenience objects for
* many usual values like [`rac.Angle.north`]{@link instance.Angle#north} or
* [`rac.Point.zero`]{@link instance.Point#zero}.
*
* @namespace instance
*/


// Attaches convenience functions to create objects with this instance of
// Rac. E.g. `rac.Color(...)`, `rac.Point(...)`.
//
// These functions are attached as properties (instead of into the
// prototype) because these are later populated with more properties and
// methods, and thus need to be independent for each instance.
//
// Ready made objects attached to these functions (E.g. `rac.Point.zero`)
// are defined in the `instance.Point.js` and equivalent files.
//
// Intended to receive the a Rac instance as parameter.
module.exports = function attachInstanceFunctions(rac) {

  /**
  * Convenience function to create a new `Color`. The created `color.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Color}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * color.rac === rac // true
  *
  * @param {Number} r
  * @param {Number} g
  * @param {Number} b
  * @param {Number} [a=1]
  *
  * @returns {Rac.Color}
  *
  * @see instance.Color
  *
  * @function Color
  * @memberof Rac#
  */
  rac.Color = function makeColor(r, g, b, a = 1) {
    return new Rac.Color(this, r, g, b, a);
  };


  /**
  * Convenience function to create a new `Stroke`. The created `stroke.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Stroke}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * let stroke = rac.Stroke(2, color)
  * stroke.rac === rac // true
  *
  * @param {?Number} weight
  * @param {Rac.Color} [color=null]
  *
  * @returns {Rac.Stroke}
  *
  * @see instance.Stroke
  *
  * @function Stroke
  * @memberof Rac#
  */
  rac.Stroke = function makeStroke(weight, color = null) {
    return new Rac.Stroke(this, weight, color);
  };


  /**
  * Convenience function to create a new `Fill`. The created `fill.rac` is
  * setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Fill}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * let fill = rac.Fill(color)
  * fill.rac === rac // true
  *
  * @param {Rac.Color} [color=null]
  * @returns {Rac.Fill}
  *
  * @see instance.Fill
  *
  * @function Fill
  * @memberof Rac#
  */
  rac.Fill = function makeFill(color = null) {
    return new Rac.Fill(this, color);
  };


  /**
  * Convenience function to create a new `Style`. The created `style.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Style}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * let style = rac.Style(rac.Stroke(2, color), rac.Fill(color))
  * style.rac === rac // true
  *
  * @param {Rac.Stroke} [stroke=null]
  * @param {Rac.Fill} [fill=null]
  *
  * @returns {Rac.Style}
  *
  * @see instance.Style
  *
  * @function Style
  * @memberof Rac#
  */
  rac.Style = function makeStyle(stroke = null, fill = null) {
    return new Rac.Style(this, stroke, fill);
  };


  /**
  * Convenience function to create a new `Angle`. The created `angle.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Angle}`.
  *
  * @example
  * let rac = new Rac()
  * let angle = rac.Angle(1/2)
  * angle.rac === rac // true
  *
  * @param {Number} turn - The turn value of the angle, in the range `[O,1)`
  * @returns {Rac.Angle}
  *
  * @see instance.Angle
  *
  * @function Angle
  * @memberof Rac#
  */
  rac.Angle = function makeAngle(turn) {
    return new Rac.Angle(this, turn);
  };


  /**
  * Convenience function to create a new `Point`. The created `point.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Point}`.
  *
  * @example
  * let rac = new Rac()
  * let point = rac.Point(55, 77)
  * point.rac === rac // true
  *
  * @param {Number} x - The x coordinate
  * @param {Number} y - The y coordinate
  *
  * @returns {Rac.Point}
  *
  * @see instance.Point
  *
  * @function Point
  * @memberof Rac#
  */
  rac.Point = function makePoint(x, y) {
    return new Rac.Point(this, x, y);
  };


  /**
  * Convenience function to create a new `Ray` with the given primitive
  * values. The created `ray.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Ray}`.
  *
  * @example
  * let rac = new Rac()
  * let ray = rac.Ray(55, 77, 1/2)
  * ray.rac === rac // true
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Rac.Angle|Number} angle
  *
  * @returns {Rac.Ray}
  *
  * @see instance.Ray
  *
  * @function Ray
  * @memberof Rac#
  */
  rac.Ray = function makeRay(x, y, angle) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    return new Rac.Ray(this, start, angle);
  };


  /**
  * Convenience function to create a new `Segment` with the given primitive
  * values. The created `segment.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Segment}`.
  *
  * @example
  * let rac = new Rac()
  * let segment = rac.Segment(55, 77, 1/2, 100)
  * segment.rac === rac // true
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Rac.Angle|Number} angle
  * @param {Number} length
  *
  * @returns {Rac.Segment}
  *
  * @see instance.Segment
  *
  * @function Segment
  * @memberof Rac#
  */
  rac.Segment = function makeSegment(x, y, angle, length) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    const ray = new Rac.Ray(this, start, angle);
    return new Rac.Segment(this, ray, length);
  };


  /**
  * Convenience function to create a new `Arc` with the given primitive
  * values. The created `arc.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Arc}`.
  *
  * @example
  * let rac = new Rac()
  * let arc = rac.Arc(55, 77, 1/4)
  * arc.rac === rac // true
  *
  * @param {Number} x - The _x_ coordinate for the arc center
  * @param {Number} y - The _y_ coordinate for the arc center
  * @param {Rac.Angle|Number} start - The start of the arc
  * @param {?Rac.Angle|Number} [end=null] - The end of the arc; when
  *   ommited or set to `null`, `start` is used instead
  * @param {Boolean} [clockwise=true] The orientation of the arc
  *
  * @returns {Rac.Arc}
  *
  * @see instance.Arc
  *
  * @function Arc
  * @memberof Rac#
  */
  rac.Arc = function makeArc(x, y, radius, start = this.Angle.zero, end = null, clockwise = true) {
    const center = new Rac.Point(this, x, y);
    start = Rac.Angle.from(this, start);
    end = end === null
      ? start
      : Rac.Angle.from(this, end);
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  };


  /**
  * Convenience function to create a new `Text`. The created `text.rac` is
  * setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text}`.
  *
  * @example
  * let rac = new Rac()
  * let text = rac.Text(55, 77, "black quartz")
  * text.rac === rac // true
  *
  * @param {Number} x - The x coordinate location for the drawn text
  * @param {Number} y - The y coordinate location for the drawn text
  * @param {String} string - The string to draw
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format for the drawn text
  *
  * @returns {Rac.Text}
  *
  * @see instance.Text
  *
  * @function Text
  * @memberof Rac#
  */
  rac.Text = function makeText(x, y, string, format = this.Text.Format.topLeft) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
  };



  // RELEASE-TODO: document padding parameters
  /**
  * Convenience function to create a new `Text.Format`. The created
  * `format.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text.Format}`.
  *
  * [`rac.Text.Format`]{@link instance.Text#Format} is an alias of this
  * function.
  *
  * @example
  * let rac = new Rac()
  * let format = rac.Text.Format('left', 'baseline', 1/8)
  * format.rac === rac // true
  *
  * @param {String} hAlign - The horizontal alignment, left-to-right; one
  *   of the values from [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {String} vAlign - The vertical alignment, top-to-bottom; one of
  *   the values from [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {String} [font=null] - The font name
  * @param {Number} [size=null] - The font size
  *
  * @returns {Rac.Text.Format}
  *
  * @see instance.Text.Format
  *
  * @function TextFormat
  * @memberof Rac#
  */
  // RELEASE-TODO: update function with paddings
  rac.TextFormat = function makeTextFormat(
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    // This functions uses `rac` instead of `this`, since `this` may point
    // to different objects:
    // + `rac` in this function body
    // + `rac.Text` in the `Text.Format` alias bellow
    angle = Rac.Angle.from(rac, angle);
    return new Rac.Text.Format(
      rac,
      hAlign, vAlign,
      angle, font, size);
  };


  /**
  * Convenience function to create a new `Text.Format`. Alias of
  * [`rac.TextFormat`]{@link Rac#TextFormat}.
  *
  * @param {String} hAlign - The horizontal alignment, left-to-right; one
  *   of the values from [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {String} vAlign - The vertical alignment, top-to-bottom; one of
  *   the values from [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {String} [font=null] - The font name
  * @param {Number} [size=null] - The font size
  *
  * @function Format
  * @memberof instance.Text#
  */
  rac.Text.Format = rac.TextFormat;


  /**
  * Convenience function that creates a new `Bezier` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Bezier}`.
  *
  * @param {Number} startX
  * @param {Number} startY
  * @param {Number} startAnchorX
  * @param {Number} startAnchorY
  * @param {Number} endAnchorX
  * @param {Number} endAnchorY
  * @param {Number} endX
  * @param {Number} endY
  *
  * @returns {Rac.Bezier}
  *
  * @see instance.Bezier
  *
  * @function Bezier
  * @memberof Rac#
  */
  rac.Bezier = function makeBezier(
    startX, startY, startAnchorX, startAnchorY,
    endAnchorX, endAnchorY, endX, endY)
  {
    const start = new Rac.Point(this, startX, startY);
    const startAnchor = new Rac.Point(this, startAnchorX, startAnchorY);
    const endAnchor = new Rac.Point(this, endAnchorX, endAnchorY);
    const end = new Rac.Point(this, endX, endY);
    return new Rac.Bezier(this, start, startAnchor, endAnchor, end);
  };

}; // attachInstanceFunctions


},{"./Rac":2}],4:[function(require,module,exports){
'use strict';


const utils = require('./util/utils');


// Attaches utility functions to a Rac instance that add functions to all
// drawable and style class prototypes.
//
// Intended to receive the Rac class as parameter.
module.exports = function attachProtoFunctions(Rac) {

  function assertDrawer(drawable) {
    if (drawable.rac == null || drawable.rac.drawer == null) {
      throw Rac.Exception.drawerNotSetup(
        `drawable-type:${utils.typeName(drawable)}`);
    }
  }


  // Container of prototype functions for drawable classes.
  Rac.drawableProtoFunctions = {};


  /**
  * Adds to `drawableClass.prototype` all the functions contained in
  * `Rac.drawableProtoFunctions`. These are the functions shared by all
  * drawable objects, for example `draw()` and `debug()`.
  *
  * @param {class} drawableClass - Class to setup with drawable functions
  */
  Rac.setupDrawableProtoFunctions = function(drawableClass) {
    Object.keys(Rac.drawableProtoFunctions).forEach(name => {
      drawableClass.prototype[name] = Rac.drawableProtoFunctions[name];
    });
  }


  Rac.drawableProtoFunctions.draw = function(style = null){
    assertDrawer(this);
    this.rac.drawer.drawObject(this, style);
    return this;
  };


  Rac.drawableProtoFunctions.debug = function(drawsText = false){
    assertDrawer(this);
    this.rac.drawer.debugObject(this, drawsText);
    return this;
  };


  Rac.drawableProtoFunctions.log = function(message = null){
    let coalescedMessage = message ?? '%o';
    console.log(coalescedMessage, this);
    return this;
  };


  Rac.drawableProtoFunctions.push = function() {
    this.rac.pushStack(this);
    return this;
  }


  Rac.drawableProtoFunctions.pop = function() {
    return this.rac.popStack();
  }


  Rac.drawableProtoFunctions.peek = function() {
    return this.rac.peekStack();
  }


  Rac.drawableProtoFunctions.attachToShape = function() {
    this.rac.peekShape().addOutline(this);
    return this;
  }


  Rac.drawableProtoFunctions.popShape = function() {
    return this.rac.popShape();
  }


  Rac.drawableProtoFunctions.popShapeToComposite = function() {
    let shape = this.rac.popShape();
    this.rac.peekComposite().add(shape);
    return this;
  }


  Rac.drawableProtoFunctions.attachToComposite = function() {
    this.rac.peekComposite().add(this);
    return this;
  }


  Rac.drawableProtoFunctions.popComposite = function() {
    return this.rac.popComposite();
  }


  Rac.drawableProtoFunctions.attachTo = function(someComposite) {
    if (someComposite instanceof Rac.Composite) {
      someComposite.add(this);
      return this;
    }

    if (someComposite instanceof Rac.Shape) {
      someComposite.addOutline(this);
      return this;
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot attachTo composite - someComposite-type:${utils.typeName(someComposite)}`);
  };


  // Container of prototype functions for style classes.
  Rac.styleProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `Rac.styleProtoFunctions`. These are functions shared by all
  // style objects (E.g. `apply()`).
  Rac.setupStyleProtoFunctions = function(classObj) {
    Object.keys(Rac.styleProtoFunctions).forEach(name => {
      classObj.prototype[name] = Rac.styleProtoFunctions[name];
    });
  }


  Rac.styleProtoFunctions.apply = function(){
    assertDrawer(this);
    this.rac.drawer.applyObject(this);
  };


  Rac.styleProtoFunctions.log = Rac.drawableProtoFunctions.log;


  Rac.styleProtoFunctions.applyToClass = function(classObj) {
    assertDrawer(this);
    this.rac.drawer.setClassDrawStyle(classObj, this);
  };

}; // attachProtoFunctions


},{"./util/utils":42}],5:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Control that allows the selection of a value with a knob that slides
* through the section of an `Arc`.
*
* Uses an `Arc` as `[anchor]{@link Rac.ArcControl#anchor}`, which defines
* the position where the control is drawn.
*
* `[angleDistance]{@link Rac.ArcControl#angleDistance}` defines the
* section of the `anchor` arc which is available for user interaction.
* Within this section the user can slide the control knob to select a
* value.
*
* @alias Rac.ArcControl
* @extends Rac.Control
*/
class ArcControl extends Rac.Control {

  /**
  * Creates a new `ArcControl` instance with the starting `value` and the
  * interactive `angleDistance`.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Number} value - The initial value of the control, in the
  *   *[0,1]* range
  * @param {Rac.Angle} angleDistance - The angleDistance of the `anchor`
  *   arc available for user interaction
  */
  constructor(rac, value, angleDistance) {
    utils.assertExists(rac);
    utils.assertNumber(value);
    utils.assertType(Rac.Angle, angleDistance);

    super(rac, value);

    /**
    * Angle distance of the `anchor` arc available for user interaction.
    * @type {Rac.Angle}
    */
    this.angleDistance = Rac.Angle.from(rac, angleDistance);

    /**
    * `Arc` to which the control will be anchored. Defines the location
    * where the control is drawn.
    *
    * Along with `[angleDistance]{@link Rac.ArcControl#angleDistance}`
    * defines the section available for user interaction.
    *
    * The control cannot be drawn or selected until this property is set.
    *
    * @type {?Rac.Arc}
    * @default null
    */
    this.anchor = null;

    if (rac.controller.autoAddControls) {
      rac.controller.add(this);
    }
  }


  /**
  * Sets `value` using the projection of `valueAngleDistance.turn` in the
  * `[0,angleLength.turn]` range.
  *
  * @param {Rac.Angle|Number} valueAngleDistance - The angle distance at
  *   which to set the current value
  */
  setValueWithAngleDistance(valueAngleDistance) {
    valueAngleDistance = Rac.Angle.from(this.rac, valueAngleDistance)
    let distanceRatio = valueAngleDistance.turn / this.angleDistance.turnOne();
    this.value = distanceRatio;
  }


  // TODO: this example/code may not be working or be innacurrate
  // check RayControl:setLimitsWithLengthInsets for a better example
  /**
  * Sets both `startLimit` and `endLimit` with the given insets from `0`
  * and `angleDistance.turn`, correspondingly, both projected in the
  * `[0, angleDistance.turn]` range.
  *
  * @example
  * <caption>For an ArcControl with angleDistance of 0.5 turn</caption>
  * let control = new Rac.ArcControl(rac, 0, rac.Angle(0.5))
  * // sets startLimit as 0.1, since   0 + 0.2 * 0.5 = 0.1
  * // sets endLimit   as 0.3, since 0.5 - 0.4 * 0.5 = 0.3
  * control.setLimitsWithAngleDistanceInsets(0.2, 0.4)
  *
  * @param {Rac.Angle|Number} startInset - The inset from `0` in the range
  *   `[0,angleDistance.turn]` to use for `startLimit`
  * @param {Rac.Angle|Number} endInset - The inset from `angleDistance.turn`
  *   in the range `[0,angleDistance.turn]` to use for `endLimit`
  */
  setLimitsWithAngleDistanceInsets(startInset, endInset) {
    startInset = Rac.Angle.from(this.rac, startInset);
    endInset = Rac.Angle.from(this.rac, endInset);
    this.startLimit = startInset.turn / this.angleDistance.turnOne();
    this.endLimit = (this.angleDistance.turnOne() - endInset.turn) / this.angleDistance.turnOne();
  }


  /**
  * Returns the  [angle `distance`]{@link Rac.Angle#distance} between the
  * `anchor` arc `start` and the control knob.
  *
  * The `turn` of the returned `Angle` is equivalent to the control `value`
  * projected to the range `[0,angleDistance.turn]`.
  *
  * @returns {Rac.Angle}
  */
  distance() {
    return this.angleDistance.multOne(this.value);
  }


  /**
  * Returns a `Point` at the center of the control knob.
  *
  * When `anchor` is not set, returns `null` instead.
  *
  * @return {?Rac.Point}
  */
  knob() {
    if (this.anchor === null) {
      // Not posible to calculate knob
      return null;
    }
    return this.anchor.pointAtAngleDistance(this.distance());
  }


  /**
  * Returns a new `Arc` produced with the `anchor` arc with
  * `angleDistance`, to be persisted during user interaction.
  *
  * An error is thrown if `anchor` is not set.
  *
  * @returns {Rac.Arc}
  */
  affixAnchor() {
    if (this.anchor === null) {
      throw Rac.Exception.invalidObjectConfiguration(
        `Expected anchor to be set, null found instead`);
    }
    return this.anchor.withAngleDistance(this.angleDistance);
  }


  /**
  * Draws the current state.
  */
  draw() {
    if (this.anchor === null) {
      // Unable to draw without anchor
      return;
    }

    let fixedAnchor = this.affixAnchor();

    let controllerStyle = this.rac.controller.controlStyle;
    let controlStyle = controllerStyle !== null
      ? controllerStyle.appendStyle(this.style)
      : this.style;

    // Arc anchor is always drawn without fill
    let anchorStyle = controlStyle !== null
      ? controlStyle.appendStyle(this.rac.Fill.none)
      : this.rac.Fill.none;

    fixedAnchor.draw(anchorStyle);

    let knob = this.knob();
    let angle = fixedAnchor.center.angleToPoint(knob);

    this.rac.pushComposite();

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerAngleDistance = this.angleDistance.multOne(item);
      let markerAngle = fixedAnchor.shiftAngle(markerAngleDistance);
      let point = fixedAnchor.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, point, markerAngle.perpendicular(!fixedAnchor.clockwise))
        .attachToComposite();
    }, this);

    // Control knob
    knob.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    let isCircleControl = this.angleDistance.equals(this.rac.Angle.zero)
      && this.startLimit == 0
      && this.endLimit == 1
    let hasNegativeRange = isCircleControl
      || this.value >= this.startLimit + this.rac.unitaryEqualityThreshold
    let hasPositiveRange = isCircleControl
      || this.value <= this.endLimit - this.rac.unitaryEqualityThreshold

    // Negative arrow
    if (hasNegativeRange) {
      let negAngle = angle.perpendicular(fixedAnchor.clockwise).inverse();
      Rac.Control.makeArrowShape(this.rac, knob, negAngle)
        .attachToComposite();
    }

    // Positive arrow
    if (hasPositiveRange) {
      let posAngle = angle.perpendicular(fixedAnchor.clockwise);
      Rac.Control.makeArrowShape(this.rac, knob, posAngle)
        .attachToComposite();
    }

    this.rac.popComposite().draw(controlStyle);

    // Selection
    if (this.isSelected()) {
      let pointerStyle = this.rac.controller.pointerStyle;
      if (pointerStyle !== null) {
        knob.arc(this.rac.controller.knobRadius * 1.5).draw(pointerStyle);
      }
    }
  }


  /**
  * Updates `value` using `pointerKnobCenter` in relation to `fixedAnchor`.
  *
  * `value` is always updated by this method to be within *[0,1]* and
  * `[startLimit,endLimit]`.
  *
  * @param {Rac.Point} pointerKnobCenter - The position of the knob center
  *   as interacted by the user pointer
  * @param {Rac.Arc} fixedAnchor - Anchor produced with `affixAnchor` when
  *   user interaction started
  */
  updateWithPointer(pointerKnobCenter, fixedAnchor) {
    let angleDistance = fixedAnchor.angleDistance();
    let startInset = angleDistance.multOne(this.startLimit);
    let endInset = angleDistance.multOne(1 - this.endLimit);

    let selectionAngle = fixedAnchor.center
      .angleToPoint(pointerKnobCenter);
    selectionAngle = fixedAnchor.clampToAngles(selectionAngle,
      startInset, endInset);
    let newDistance = fixedAnchor.distanceFromStart(selectionAngle);

    // Update control with new distance
    let distanceRatio = newDistance.turn / this.angleDistance.turnOne();
    this.value = distanceRatio;
  }


  /**
  * Draws the selection state along with pointer interaction visuals.
  *
  * @param {Rac.Point} pointerCenter - The position of the user pointer
  * @param {Rac.Arc} fixedAnchor - `Arc` produced with `affixAnchor` when
  *   user interaction started
  * @param {Rac.Segment} pointerToKnobOffset - A `Segment` that represents
  *   the offset from `pointerCenter` to the control knob when user
  *   interaction started.
  */
  drawSelection(pointerCenter, fixedAnchor, pointerToKnobOffset) {
    let pointerStyle = this.rac.controller.pointerStyle;
    if (pointerStyle === null) { return; }

    // Arc anchor is always drawn without fill
    let anchorStyle = pointerStyle.appendStyle(this.rac.Fill.none);
    fixedAnchor.draw(anchorStyle);

    let angleDistance = fixedAnchor.angleDistance();

    this.rac.pushComposite();

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerAngle = fixedAnchor.shiftAngle(angleDistance.multOne(item));
      let markerPoint = fixedAnchor.pointAtAngle(markerAngle);
      Rac.Control.makeValueMarker(this.rac, markerPoint, markerAngle.perpendicular(!fixedAnchor.clockwise))
        .attachToComposite();
    });

    // Limit markers
    if (this.startLimit > 0) {
      let minAngle = fixedAnchor.shiftAngle(angleDistance.multOne(this.startLimit));
      let minPoint = fixedAnchor.pointAtAngle(minAngle);
      let markerAngle = minAngle.perpendicular(fixedAnchor.clockwise);
      Rac.Control.makeLimitMarker(this.rac, minPoint, markerAngle)
        .attachToComposite();
    }

    if (this.endLimit < 1) {
      let maxAngle = fixedAnchor.shiftAngle(angleDistance.multOne(this.endLimit));
      let maxPoint = fixedAnchor.pointAtAngle(maxAngle);
      let markerAngle = maxAngle.perpendicular(!fixedAnchor.clockwise);
      Rac.Control.makeLimitMarker(this.rac, maxPoint, markerAngle)
        .attachToComposite();
    }

    // Segment from pointer to control dragged center
    let draggedCenter = pointerToKnobOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    // Control dragged center, attached to pointer
    draggedCenter.arc(2)
      .attachToComposite();

    this.rac.popComposite().draw(pointerStyle);

    // TODO: implement arc control dragging visuals!
  }

} // class ArcControl


module.exports = ArcControl;


},{"../Rac":2,"../util/utils":42}],6:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Abstract class for controls that select a value within a range.
*
* Controls may use an `anchor` object to determine the visual position of
* the control's interactive elements. Each implementation determines the
* class used for this `anchor`, for example
* `[ArcControl]{@link Rac.ArcControl}` uses an `[Arc]{@link Rac.Arc}` as
* anchor, which defines where the control is drawn, what orientation it
* uses, and the position of the control knob through the range of possible
* values.
*
* A control keeps a `value` property in the range *[0,1]* for the currently
* selected value.
*
* The `projectionStart` and `projectionEnd` properties can be used to
* project `value` into the range `[projectionStart,projectionEnd]` by using
* the `projectedValue()` method. By default set to *[0,1]*.
*
* The `startLimit` and `endLimit` can be used to restrain the allowable
* values that can be selected through user interaction. By default set to
* *[0,1]*.
*
* @alias Rac.Control
*/
class Control {

  /**
  * Creates a new `Control` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Number} value - The initial value of the control, in the
  *   *[0,1]* range
  */
  constructor(rac, value) {
    utils.assertExists(rac);
    utils.assertNumber(value);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Current selected value, in the range *[0,1]*.
    *
    * May be further constrained to `[startLimit,endLimit]`.
    *
    * @type {Number}
    */
    this.value = value;

    /**
    * [Projected value]{@link Rac.Control#projectedValue} to use when
    * `value` is `0`.
    *
    * @type {Number}
    * @default 0
    */
    this.projectionStart = 0;

    /**
    * [Projected value]{@link Rac.Control#projectedValue} to use when
    * `value` is `1`.
    *
    * @type {Number}
    * @default 1
    */
    this.projectionEnd = 1;

    /**
    * Minimum `value` that can be selected through user interaction.
    *
    * @type {Number}
    * @default 0
    */
    this.startLimit = 0;

    /**
    * Maximum `value` that can be selected through user interaction.
    *
    * @type {Number}
    * @default 1
    */
    this.endLimit = 1;

    /**
    * Collection of values at which visual markers are drawn.
    *
    * @type {number[]}
    * @default []
    */
    this.markers = [];

    /**
    * Style to apply when drawing. This style gets applied after
    * `[rac.controller.controlStyle]{@link Rac.Controller#controlStyle}`.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer}
    * @default null
    */
    this.style = null;
  }


  /**
  * Returns `value` projected into the range
  * `[projectionStart,projectionEnd]`.
  *
  * By default the projection range is *[0,1]*, in which case `value` and
  * `projectedValue()` are equal.
  *
  * Projection ranges with a negative direction (E.g. *[50,30]*, when
  * `projectionStart` is greater that `projectionEnd`) are supported. As
  * `value` increases, the projection returned decreases from
  * `projectionStart` until reaching `projectionEnd`.
  *
  * @example
  * <caption>For a control with a projection range of [100,200]</caption>
  * control.setProjectionRange(100, 200)
  * control.value = 0;   control.projectionValue() // returns 100
  * control.value = 0.5; control.projectionValue() // returns 150
  * control.value = 1;   control.projectionValue() // returns 200
  *
  * @example
  * <caption>For a control with a projection range of [50,30]</caption>
  * control.setProjectionRange(30, 50)
  * control.value = 0;   control.projectionValue() // returns 50
  * control.value = 0.5; control.projectionValue() // returns 40
  * control.value = 1;   control.projectionValue() // returns 30
  *
  * @returns {Number}
  */
  projectedValue() {
    let projectionRange = this.projectionEnd - this.projectionStart;
    return (this.value * projectionRange) + this.projectionStart;
  }

  // TODO: reintroduce when tested
  // Returns the corresponding value in the range *[0,1]* for the
  // `projectedValue` in the range `[projectionStart,projectionEnd]`.
  // valueOfProjected(projectedValue) {
  //   let projectionRange = this.projectionEnd - this.projectionStart;
  //   return (projectedValue - this.projectionStart) / projectionRange;
  // }


  // TODO: document, test
  setProjectionRange(start, end) {
    this.projectionStart = start;
    this.projectionEnd = end;
  }


  /**
  * Sets both `startLimit` and `endLimit` with the given insets from `0`
  * and `1`, correspondingly.
  *
  * @example
  * control.setLimitsWithInsets(0.1, 0.2)
  * // returns 0.1, since 0 + 0.1 = 0.1
  * control.startLimit
  * // returns 0.8, since 1 - 0.2 = 0.8
  * control.endLimit
  *
  * @param {Number} startInset - The inset from `0` to use for `startLimit`
  * @param {Number} endInset - The inset from `1` to use for `endLimit`
  */
  setLimitsWithInsets(startInset, endInset) {
    this.startLimit = startInset;
    this.endLimit = 1 - endInset;
  }


  // TODO: reintroduce when tested
  // Sets `startLimit` and `endLimit` with two inset values relative to the
  // [0,1] range.
  // setLimitsWithProjectionInsets(startInset, endInset) {
  //   this.startLimit = this.valueOf(startInset);
  //   this.endLimit = this.valueOf(1 - endInset);
  // }


  /**
  * Adds a marker at the current `value`.
  */
  addMarkerAtCurrentValue() {
    this.markers.push(this.value);
  }

  /**
  * Returns `true` when this control is the currently selected control.
  *
  * @returns {Boolean}
  */
  isSelected() {
    if (this.rac.controller.selection === null) {
      return false;
    }
    return this.rac.controller.selection.control === this;
  }


  /**
  * Returns a `Point` at the center of the control knob.
  *
  * > ⚠️ This method must be overriden by an extending class. Calling this
  * > implementation throws an error.
  *
  * @abstract
  * @return {Rac.Point}
  */
  knob() {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }


  /**
  * Returns a copy of the anchor to be persited during user interaction.
  *
  * Each implementation determines the type used for `anchor` and
  * `affixAnchor()`.
  *
  * This fixed anchor is passed back to the control through
  * `[updateWithPointer]{@link Rac.Control#updateWithPointer}` and
  * `[drawSelection]{@link Rac.Control#drawSelection}` during user
  * interaction.
  *
  * > ⚠️ This method must be overriden by an extending class. Calling this
  * > implementation throws an error.
  *
  * @abstract
  * @return {Object}
  */
  affixAnchor() {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }


  /**
  * Draws the current state.
  *
  * > ⚠️ This method must be overriden by an extending class. Calling this
  * > implementation throws an error.
  *
  * @abstract
  */
  draw() {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }

  /**
  * Updates `value` using `pointerKnobCenter` in relation to `fixedAnchor`.
  * Called by `[rac.controller.pointerDragged]{@link Rac.Controller#pointerDragged}`
  * as the user interacts with the control.
  *
  * Each implementation interprets `pointerKnobCenter` against `fixedAnchor`
  * to update its own value. The current `anchor` is not used for this
  * update since `anchor` could change during redraw in response to updates
  * in `value`.
  *
  * Each implementation is also responsible of keeping the updated `value`
  * within the range `[startLimit,endLimit]`. This method is the only path
  * for updating the control through user interaction, and thus the only
  * place where each implementation must enforce a valid `value` within
  * *[0,1]* and `[startLimit,endLimit]`.
  *
  * > ⚠️ This method must be overriden by an extending class. Calling this
  * > implementation throws an error.
  *
  * @abstract
  * @param {Rac.Point} pointerKnobCenter - The position of the knob center
  *   as interacted by the user pointer
  * @param {Object} fixedAnchor - Anchor produced when user interaction
  *   started
  */
  updateWithPointer(pointerKnobCenter, fixedAnchor) {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }

  /**
  * Draws the selection state along with pointer interaction visuals.
  * Called by `[rac.controller.drawControls]{@link Rac.Controller#drawControls}`
  * only for the selected control.
  *
  * > ⚠️ This method must be overriden by an extending class. Calling this
  * > implementation throws an error.
  *
  * @abstract
  * @param {Rac.Point} pointerCenter - The position of the user pointer
  * @param {Object} fixedAnchor - Anchor of the control produced when user
  *   interaction started
  * @param {Rac.Segment} pointerToKnobOffset - A `Segment` that represents
  *   the offset from `pointerCenter` to the control knob when user
  *   interaction started.
  */
  drawSelection(pointerCenter, fixedAnchor, pointerToKnobOffset) {
    throw Rac.Exception.abstractFunctionCalled(
      `this-type:${utils.typeName(this)}`);
  }

} // class Control


module.exports = Control;


// Controls shared drawing elements

Control.makeArrowShape = function(rac, center, angle) {
  // Arc
  let angleDistance = rac.Angle.from(1/22);
  let arc = center.arc(rac.controller.knobRadius * 1.5,
    angle.subtract(angleDistance), angle.add(angleDistance));

  // Arrow walls
  let pointAngle = rac.Angle.from(1/8);
  let rightWall = arc.startPoint().ray(angle.add(pointAngle));
  let leftWall = arc.endPoint().ray(angle.subtract(pointAngle));

  // Arrow point
  let point = rightWall.pointAtIntersection(leftWall);

  // Shape
  rac.pushShape();
  point.segmentToPoint(arc.startPoint())
    .attachToShape();
  arc.attachToShape();
  arc.endPoint().segmentToPoint(point)
    .attachToShape();

  return rac.popShape();
};

Control.makeLimitMarker = function(rac, point, angle) {
  angle = rac.Angle.from(angle);
  let perpendicular = angle.perpendicular(false);
  let composite = new Rac.Composite(rac);

  point.segmentToAngle(perpendicular, 4)
    .withStartExtension(4)
    .attachTo(composite);
  point.pointToAngle(perpendicular, 8).arc(3)
    .attachTo(composite);

  return composite;
};

Control.makeValueMarker = function(rac, point, angle) {
  angle = rac.Angle.from(angle);
  return point.segmentToAngle(angle.perpendicular(), 3)
    .withStartExtension(3);
};


},{"../Rac":2,"../util/utils":42}],7:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Information regarding the currently selected
* `[Control]{@link Rac.Control}`.
*
* Created and kept by `[Controller]{@link Rac.Controller}` when a control
* becomes selected.
*
* @alias Rac.Controller.Selection
*/
class ControlSelection{

  /**
  * Builds a new `Selection` with the given `control` and pointer located
  * at `pointerCenter`.
  *
  * @param {Rac.Control} control - The selected control
  * @param {Rac.Point} pointerCenter - The location of the pointer when
  *   the selection started
  */
  constructor(control, pointerCenter) {

    /**
    * The selected control.
    * @type {Rac.Control}
    */
    this.control = control;

    /**
    * Anchor produced by
    * `[control.affixAnchor]{@link Rac.Control#affixAnchor}` when the
    * selection began.
    *
    * This anchor is persisted during user interaction as to allow the user
    * to interact with the selected control in a fixed location, even if
    * the control moves during the interaction.
    *
    * @type {Object}
    */
    this.fixedAnchor = control.affixAnchor();

    /**
    * `Segment` that represents the offset from the pointer position to the
    * control knob center.
    *
    * Used to interact with the control knob at a constant offset position
    * during user interaction.
    *
    * The pointer starting location is equal to `segment.startPoint()`,
    * the control knob center starting position is equal to
    * `segment.endPoint()`.
    *
    * @type {Rac.Segment}
    */
    this.pointerToKnobOffset = pointerCenter.segmentToPoint(control.knob());
  }

  drawSelection(pointerCenter) {
    this.control.drawSelection(pointerCenter, this.fixedAnchor, this.pointerToKnobOffset);
  }
}


/**
* Manager of interactive `[Control]{@link Rac.Control}`s for an instance
* of `Rac`.
*
* Contains a list of all managed controls and coordinates drawing and user
* interaction between them.
*
* For controls to be functional the `pointerPressed`, `pointerReleased`,
* and `pointerDragged` methods have to be called as pointer interactions
* happen. The `drawControls` method handles the drawing of all controls
* and the currently selected control, it is usually called at the very end
* of drawing.
*
* Also contains settings shared between all controls and used for user
* interaction, like `pointerStyle` to draw the pointer, `controlStyle` as
* a default style for drawing controls, and `knobRadius` that defines the
* size of the interactive element of most controls.
*
* @alias Rac.Controller
*/
class Controller {

  static Selection = ControlSelection;


  /**
  * Builds a new `Controller` with the given `Rac` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  */
  constructor(rac) {

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Distance at which the pointer is considered to interact with a
    * control knob. Also used by controls for drawing.
    *
    * @type {Number}
    */
    this.knobRadius = 22;

    /**
    * Collection of all controlls managed by the instance. Controls in this
    * list are considered for pointer hit testing and for drawing.
    *
    * @type {Rac.Control[]}
    * @default []
    */
    this.controls = [];

    /**
    * Indicates controls to add themselves into `this.controls` when
    * created.
    *
    * This property is a shared configuration. The behaviour is implemented
    * independently by each control constructor.
    *
    * @type {Boolean}
    * @default true
    */
    this.autoAddControls = true;

    // TODO: separate lastControl from lastPointer

    // Last `Point` of the position when the pointer was pressed, or last
    // Control interacted with. Set to `null` when there has been no
    // interaction yet and while there is a selected control.
    this.lastPointer = null;

    /**
    * Style object used for the visual elements related to pointer
    * interaction and control selection. When `null` no pointer or
    * selection visuals are drawn.
    *
    * By default contains a style that uses the current stroke
    * configuration with no-fill.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer}
    * @default {@link instance.Fill#none}
    */
    this.pointerStyle = rac.Fill.none;

    /**
    * Default style to apply for all controls. When set it is applied
    * before control drawing. The individual control style in
    * `[control.style]{@link Rac.Control#style}` is applied afterwards.
    *
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer}
    * @default null
    */
    this.controlStyle = null

    /**
    * Selection information for the currently selected control, or `null`
    * when there is no selection.
    *
    * @type {?Rac.Controller.Selection}
    */
    this.selection = null;

  } // constructor


  /**
  * Pushes `control` into `this.controls`, allowing the instance to handle
  * pointer interaction and drawing of `control`.
  *
  * @param {Rac.Control} control - A `Control` to add into `controls`
  */
  add(control) {
    this.controls.push(control);
  }


  /**
  * Notifies the instance that the pointer has been pressed at the
  * `pointerCenter` location. All controls are hit tested and the first
  * control to be hit is marked as selected.
  *
  * This function must be called along pointer press interaction for all
  * managed controls to properly work.
  *
  * @param {Rac.Point} pointerCenter - The location where the pointer was
  *   pressed
  */
  pointerPressed(pointerCenter) {
    this.lastPointer = null;

    // Test pointer hit
    const selected = this.controls.find( item => {
      const controlKnob = item.knob();
      if (controlKnob === null) { return false; }
      if (controlKnob.distanceToPoint(pointerCenter) <= this.knobRadius) {
        return true;
      }
      return false;
    });

    if (selected === undefined) {
      return;
    }

    this.selection = new Controller.Selection(selected, pointerCenter);
  }


  /**
  * Notifies the instance that the pointer has been dragged to the
  * `pointerCenter` location. When there is a selected control, user
  * interaction is performed and the control value is updated.
  *
  * This function must be called along pointer drag interaction for all
  * managed controls to properly work.
  *
  * @param {Rac.Point} pointerCenter - The location where the pointer was
  *   dragged
  */
  pointerDragged(pointerCenter){
    if (this.selection === null) {
      return;
    }

    let control = this.selection.control;
    let fixedAnchor = this.selection.fixedAnchor;

    // Offset center of dragged control knob from the pointer position
    let pointerKnobCenter = this.selection.pointerToKnobOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    control.updateWithPointer(pointerKnobCenter, fixedAnchor);
  }


  /**
  * Notifies the instance that the pointer has been released at the
  * `pointerCenter` location. When there is a selected control, user
  * interaction is finalized and the control selection is cleared.
  *
  * This function must be called along pointer drag interaction for all
  * managed controls to properly work.
  *
  * @param {Rac.Point} pointerCenter - The location where the pointer was
  *   released
  */
  pointerReleased(pointerCenter) {
    if (this.selection === null) {
      this.lastPointer = pointerCenter;
      return;
    }

    this.lastPointer = this.selection.control;
    this.selection = null;
  }


  /**
  * Draws all controls contained in
  * `[controls]{@link Rac.Controller#controls}` along the visual elements
  * for pointer and control selection.
  *
  * Usually called at the end of drawing, as to draw controls on top of
  * other graphics.
  */
  drawControls() {
    let pointerCenter = this.rac.Point.pointer();
    this.drawPointer(pointerCenter);

    // All controls in display
    this.controls.forEach(item => item.draw());

    if (this.selection !== null) {
      this.selection.drawSelection(pointerCenter);
    }
  }


  drawPointer(pointerCenter) {
    let pointerStyle = this.pointerStyle;
    if (pointerStyle === null) {
      return;
    }

    // Last pointer or control
    if (this.lastPointer instanceof Rac.Point) {
      this.lastPointer.arc(12).draw(pointerStyle);
    }
    if (this.lastPointer instanceof Rac.Control) {
      // TODO: implement last selected control state
    }

    // Pointer pressed
    if (this.rac.drawer.p5.mouseIsPressed) {
      if (this.selection === null) {
        pointerCenter.arc(10).draw(pointerStyle);
      } else {
        pointerCenter.arc(5).draw(pointerStyle);
      }
    }
  }


} // class Controller


module.exports = Controller;


},{"../Rac":2,"../util/utils":42}],8:[function(require,module,exports){
'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Control that allows the selection of a value with a knob that slides
* through the segment of a `Ray`.
*
* Uses a `Ray` as `[anchor]{@link Rac.RayControl#anchor}`, which defines
* the position where the control is drawn.
*
* `[length]{@link Rac.RayControl#length}` defines the length of the
* segment in the `anchor` ray which is available for user interaction.
* Within this segment the user can slide the control knob to select a
* value.
*
* @alias Rac.RayControl
* @extends Rac.Control
*/
class RayControl extends Rac.Control {

  /**
  * Creates a new `RayControl` instance with the starting `value` and the
  * interactive `length`.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Number} value - The initial value of the control, in the
  *   *[0,1]* range
  * @param {Number} length - The length of the `anchor` ray available for
  *   user interaction
  */
  constructor(rac, value, length) {
    utils.assertExists(rac, value, length);
    utils.assertNumber(value, length);

    super(rac, value);

    /**
    * Length of the `anchor` ray available for user interaction.
    * @type {Number}
    */
    this.length = length;

    /**
    * `Ray` to which the control will be anchored. Defines the location
    * where the control is drawn.
    *
    * Along with `[length]{@link Rac.RayControl#length}` defines the
    * segment available for user interaction.
    *
    * The control cannot be drawn or selected until this property is set.
    *
    * @type {?Rac.Ray}
    * @default null
    */
    this.anchor = null;

    if (rac.controller.autoAddControls) {
      rac.controller.add(this);
    }
  }


  // TODO: document, test
  startLimitLength() {
    return this.startLimit * this.length;
  }

  // TODO: document, test
  endLimitLength() {
    return this.endLimit * this.length;
  }


  /**
  * Sets `value` using the projection of `lengthValue` in the `[0,length]`
  * range.
  *
  * @param {Number} lengthValue - The length at which to set the current
  *   value
  */
  setValueWithLength(lengthValue) {
    let lengthRatio = lengthValue / this.length;
    this.value = lengthRatio;
  }


  /**
  * Sets both `startLimit` and `endLimit` with the given insets from `0`
  * and `length`, correspondingly, both projected in the `[0,length]`
  * range.
  *
  * @example
  * <caption>For a RayControl with length of 200</caption>
  * let control = new Rac.RayControl(rac, 0.5, 200);
  * control.setLimitsWithLengthInsets(10, 20);
  * // returns 10, since 0 + 10 = 10
  * control.startLimitLength()
  * // returns 0.05, since 0 + (10 / 200) = 0.05
  * control.startLimit
  * // returns 180, since 200 - 20 = 180
  * control.endLimitLength()
  * // returns 0.9, since 1 - (20 / 200) = 0.9
  * control.endLimit
  *
  * @param {Number} startInset - The inset from `0` in the range
  *   `[0,length]` to use for `startLimit`
  * @param {Number} endInset - The inset from `length` in the range
  *   `[0,length]` to use for `endLimit`
  */
  setLimitsWithLengthInsets(startInset, endInset) {
    this.startLimit = startInset / this.length;
    this.endLimit = (this.length - endInset) / this.length;
  }


  /**
  * Returns the distance between the `anchor` ray `start` and the control
  * knob.
  *
  * Equivalent to the control `value` projected to the range `[0,length]`.
  *
  * @returns {Number}
  */
  distance() {
    return this.length * this.value;
  }


  /**
  * Returns a `Point` at the center of the control knob.
  *
  * When `anchor` is not set, returns `null` instead.
  *
  * @return {?Rac.Point}
  */
  knob() {
    if (this.anchor === null) {
      // Not posible to calculate the knob
      return null;
    }
    return this.anchor.pointAtDistance(this.distance());
  }


  /**
  * Returns a new `Segment` produced with the `anchor` ray with `length`,
  * to be persisted during user interaction.
  *
  * An error is thrown if `anchor` is not set.
  *
  * @returns {Rac.Segment}
  */
  affixAnchor() {
    if (this.anchor === null) {
      throw Rac.Exception.invalidObjectConfiguration(
        `Expected anchor to be set, null found instead`);
    }
    return this.anchor.segment(this.length);
  }


  /**
  * Draws the current state.
  */
  draw() {
    if (this.anchor === null) {
      // Unable to draw without anchor
      return;
    }

    let fixedAnchor = this.affixAnchor();

    let controllerStyle = this.rac.controller.controlStyle;
    let controlStyle = controllerStyle !== null
      ? controllerStyle.appendStyle(this.style)
      : this.style;

    fixedAnchor.draw(controlStyle);

    let knob = this.knob();
    let angle = fixedAnchor.angle();

    this.rac.pushComposite();

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let point = fixedAnchor.startPoint().pointToAngle(angle, this.length * item);
      Rac.Control.makeValueMarker(this.rac, point, angle)
        .attachToComposite();
    }, this);

    // Control knob
    knob.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Negative arrow
    if (this.value >= this.startLimit + this.rac.unitaryEqualityThreshold) {
      Rac.Control.makeArrowShape(this.rac, knob, angle.inverse())
        .attachToComposite();
    }

    // Positive arrow
    if (this.value <= this.endLimit - this.rac.unitaryEqualityThreshold) {
      Rac.Control.makeArrowShape(this.rac, knob, angle)
        .attachToComposite();
    }

    this.rac.popComposite().draw(controlStyle);

    // Selection
    if (this.isSelected()) {
      let pointerStyle = this.rac.controller.pointerStyle;
      if (pointerStyle !== null) {
        knob.arc(this.rac.controller.knobRadius * 1.5).draw(pointerStyle);
      }
    }
  }


  /**
  * Updates `value` using `pointerKnobCenter` in relation to `fixedAnchor`.
  *
  * `value` is always updated by this method to be within *[0,1]* and
  * `[startLimit,endLimit]`.
  *
  * @param {Rac.Point} pointerKnobCenter - The position of the knob center
  *   as interacted by the user pointer
  * @param {Rac.Segment} fixedAnchor - `Segment` produced with `affixAnchor`
  *   when user interaction started
  */
  updateWithPointer(pointerKnobCenter, fixedAnchor) {
    let length = fixedAnchor.length;
    let startInset = length * this.startLimit;
    let endInset = length * (1 - this.endLimit);

    // New value from the current pointer position, relative to fixedAnchor
    let newDistance = fixedAnchor
      .ray.distanceToProjectedPoint(pointerKnobCenter);
    // Clamping value (javascript has no Math.clamp)
    newDistance = fixedAnchor.clampToLength(newDistance,
      startInset, endInset);

    // Update control with new distance
    let lengthRatio = newDistance / length;
    this.value = lengthRatio;
  }


  /**
  * Draws the selection state along with pointer interaction visuals.
  *
  * @param {Rac.Point} pointerCenter - The position of the user pointer
  * @param {Rac.Segment} fixedAnchor - `Segment` produced with `affixAnchor`
  *   when user interaction started
  * @param {Rac.Segment} pointerToKnobOffset - A `Segment` that represents
  *   the offset from `pointerCenter` to the control knob when user
  *   interaction started.
  */
  drawSelection(pointerCenter, fixedAnchor, pointerToKnobOffset) {
    let pointerStyle = this.rac.controller.pointerStyle;
    if (pointerStyle === null) { return; }

    this.rac.pushComposite();
    fixedAnchor.attachToComposite();

    let angle = fixedAnchor.angle();
    let length = fixedAnchor.length;

    // Value markers
    this.markers.forEach(item => {
      if (item < 0 || item > 1) { return }
      let markerPoint = fixedAnchor.startPoint().pointToAngle(angle, length * item);
      Rac.Control.makeValueMarker(this.rac, markerPoint, angle)
        .attachToComposite();
    });

    // Limit markers
    if (this.startLimit > 0) {
      let minPoint = fixedAnchor.startPoint().pointToAngle(angle, length * this.startLimit);
      Rac.Control.makeLimitMarker(this.rac, minPoint, angle)
        .attachToComposite();
    }

    if (this.endLimit < 1) {
      let maxPoint = fixedAnchor.startPoint().pointToAngle(angle, length * this.endLimit);
      Rac.Control.makeLimitMarker(this.rac, maxPoint, angle.inverse())
        .attachToComposite();
    }

    // Segment from pointer to control dragged center
    let draggedCenter = pointerToKnobOffset
      .withStartPoint(pointerCenter)
      .endPoint();

    // Control dragged center, attached to pointer
    draggedCenter.arc(2)
      .attachToComposite();

    // Constrained length clamped to limits
    let constrainedLength = fixedAnchor
      .ray.distanceToProjectedPoint(draggedCenter);
    let startInset = length * this.startLimit;
    let endInset = length * (1 - this.endLimit);
    constrainedLength = fixedAnchor.clampToLength(constrainedLength,
      startInset, endInset);

    let constrainedAnchorCenter = fixedAnchor
      .withLength(constrainedLength)
      .endPoint();

    // Control center constrained to anchor
    constrainedAnchorCenter.arc(this.rac.controller.knobRadius)
      .attachToComposite();

    // Dragged shadow center, semi attached to pointer
    // always perpendicular to anchor
    let draggedShadowCenter = draggedCenter
      .segmentToProjectionInRay(fixedAnchor.ray)
      // reverse and translated to constraint to anchor
      .reverse()
      .withStartPoint(constrainedAnchorCenter)
      // Segment from constrained center to shadow center
      .attachToComposite()
      .endPoint();

    // Control shadow center
    draggedShadowCenter.arc(this.rac.controller.knobRadius / 2)
      .attachToComposite();

    // Ease for segment to dragged shadow center
    let easeOut = Rac.EaseFunction.makeEaseOut();
    easeOut.postBehavior = Rac.EaseFunction.Behavior.clamp;

    // Tail will stop stretching at 2x the max tail length
    let maxDraggedTailLength = this.rac.controller.knobRadius * 5;
    easeOut.inRange = maxDraggedTailLength * 2;
    easeOut.outRange = maxDraggedTailLength;

    // Segment to dragged shadow center
    let draggedTail = draggedShadowCenter
      .segmentToPoint(draggedCenter);

    let easedLength = easeOut.easeValue(draggedTail.length);
    draggedTail.withLength(easedLength).attachToComposite();

    // Draw all!
    this.rac.popComposite().draw(pointerStyle);
  }

} // class RayControl


module.exports = RayControl;


},{"../Rac":2,"../util/utils":42}],9:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Angle measured with a `turn` value in the range *[0,1)* that represents
* the amount of turn in a full circle.
*
* Most functions through RAC that can receive an `Angle` parameter can
* also receive a `number` value that will be used as `turn` to instantiate
* a new `Angle`. The main exception to this behaviour are constructors,
* which always expect to receive `Angle` objects.
*
* For drawing operations the turn value of `0` points right, with the
* direction rotating clockwise:
* ```
* rac.Angle(0/4) // points right
* rac.Angle(1/4) // points downwards
* rac.Angle(2/4) // points left
* rac.Angle(3/4) // points upwards
* ```
*
* ### `instance.Angle`
*
* Instances of `Rac` contain a convenience
* [`rac.Angle` function]{@link Rac#Angle} to create `Angle` objects with
* fewer parameters. This function also contains ready-made convenience
* objects, like [`rac.Angle.quarter`]{@link instance.Angle#quarter}, listed under
* [`instance.Angle`]{@link instance.Angle}.
*
* @example
* let rac = new Rac()
* // new instance with constructor
* let angle = new Rac.Angle(rac, 3/8)
* // or convenience function
* let otherAngle = rac.Angle(3/8)
*
* @see [`rac.Angle`]{@link Rac#Angle}
* @see [`instance.Angle`]{@link instance.Angle}
*
* @alias Rac.Angle
*/
class Angle {

  /**
  * Creates a new `Angle` instance.
  *
  * The `turn` value is constrained to the range *[0,1)*, any value
  * outside is reduced into range using a modulo operation:
  * ```
  * (new Rac.Angle(rac, 1/4)) .turn // returns 1/4
  * (new Rac.Angle(rac, 5/4)) .turn // returns 1/4
  * (new Rac.Angle(rac, -1/4)).turn // returns 3/4
  * (new Rac.Angle(rac, 1))   .turn // returns 0
  * (new Rac.Angle(rac, 4))   .turn // returns 0
  * ```
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Number} turn - The turn value
  */
  constructor(rac, turn) {
    // TODO: changed to assertType, add tests
    utils.assertType(Rac, rac);
    utils.assertNumber(turn);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    turn = turn % 1;
    if (turn < 0) {
      turn = (turn + 1) % 1;
    }

    /**
    * Turn value of the angle, constrained to the range *[0,1)*.
    * @type {Number}
    */
    this.turn = turn;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * rac.Angle(0.2)).toString()
  * // returns: 'Angle(0.2)'
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const turnStr = utils.cutDigits(this.turn, digits);
    return `Angle(${turnStr})`;
  }


  /**
  * Returns `true` when the difference with the `turn` value of the angle
  * derived [from]{@link Rac.Angle.from} `angle` is under
  * [`rac.unitaryEqualityThreshold`]{@link Rac#unitaryEqualityThreshold};
  * otherwise returns `false`.
  *
  * The `otherAngle` parameter can only be `Angle` or `number`, any other
  * type returns `false`.
  *
  * This method will consider turn values in the oposite ends of the range
  * *[0,1)* as equals. E.g. `Angle` objects with `turn` values of `0` and
  * `1 - rac.unitaryEqualityThreshold/2` will be considered equal.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to compare
  * @returns {Boolean}
  *
  * @see [`rac.Angle.from`]{@link Rac.Angle.from}
  */
  equals(otherAngle) {
    if (otherAngle instanceof Rac.Angle) {
      // all good!
    } else if (typeof otherAngle === 'number') {
      otherAngle = Angle.from(this.rac, otherAngle);
    } else {
      return false;
    }

    const diff = Math.abs(this.turn - otherAngle.turn);
    return diff < this.rac.unitaryEqualityThreshold
      // For close values that loop around
      || (1 - diff) < this.rac.unitaryEqualityThreshold;
  }


  /**
  * Returns an `Angle` derived from `something`.
  *
  * + When `something` is an instance of `Angle`, returns that same object.
  * + When `something` is a `number`, returns a new `Angle` with
  *   `something` as `turn`.
  * + When `something` is a `{@link Rac.Ray}`, returns its angle.
  * + When `something` is a `{@link Rac.Segment}`, returns its angle.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Rac.Angle|Rac.Ray|Rac.Segment|Number} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  */
  static from(rac, something) {
    if (something instanceof Rac.Angle) {
      return something;
    }
    if (typeof something === 'number') {
      return new Angle(rac, something);
    }
    if (something instanceof Rac.Ray) {
      return something.angle;
    }
    if (something instanceof Rac.Segment) {
      return something.ray.angle;
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Angle - something-type:${utils.typeName(something)}`);
  }


  /**
  * Returns an `Angle` derived from `radians`.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  */
  static fromRadians(rac, radians) {
    return new Angle(rac, radians / Rac.TAU);
  }


  /**
  * Returns an `Angle` derived from `degrees`.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Number} degrees - The measure of the angle, in degrees
  * @returns {Rac.Angle}
  */
  static fromDegrees(rac, degrees) {
    return new Angle(rac, degrees / 360);
  }


  /**
  * Returns a new `Angle` pointing in the opposite direction to `this`.
  *
  * @example
  * // returns 3/8, since 1/8 + 1/2 = 5/8
  * rac.Angle(1/8).inverse().turn
  * // returns 3/8, since 7/8 + 1/2 = 3/8
  * rac.Angle(7/8).inverse().turn
  *
  * @returns {Rac.Angle}
  */
  inverse() {
    return this.add(this.rac.Angle.inverse);
  }


  /**
  * Returns a new `Angle` with a turn value equivalent to `-turn`.
  *
  * @example
  * // returns 3/4, since 1 - 1/4 = 3/4
  * rac.Angle(1/4).negative().turn
  * // returns 5/8, since 1 - 3/8 = 5/8
  * rac.Angle(3/8).negative().turn
  *
  * @returns {Rac.Angle}
  */
  negative() {
    return new Angle(this.rac, -this.turn);
  }


  /**
  * Returns a new `Angle` which is perpendicular to `this` in the
  * `clockwise` orientation.
  *
  * @example
  * // returns 3/8, since 1/8 + 1/4 = 3/8
  * rac.Angle(1/8).perpendicular(true).turn
  * // returns 7/8, since 1/8 - 1/4 = 7/8
  * rac.Angle(1/8).perpendicular(false).turn
  *
  * @returns {Rac.Angle}
  */
  perpendicular(clockwise = true) {
    return this.shift(this.rac.Angle.square, clockwise);
  }


  /**
  * Returns the measure of the angle in radians.
  *
  * @returns {Number}
  */
  radians() {
    return this.turn * Rac.TAU;
  }


  /**
  * Returns the measure of the angle in degrees.
  *
  * @returns {Number}
  */
  degrees() {
    return this.turn * 360;
  }


  /**
  * Returns the sine of `this`.
  *
  * @returns {Number}
  */
  sin() {
    return Math.sin(this.radians())
  }


  /**
  * Returns the cosine of `this`.
  *
  * @returns {Number}
  */
  cos() {
    return Math.cos(this.radians())
  }


  /**
  * Returns the tangent of `this`.
  *
  * @returns {Number}
  */
  tan() {
    return Math.tan(this.radians())
  }


  /**
  * Returns the `turn` value in the range `(0, 1]`. When `turn` is equal to
  * `0` returns `1` instead.
  *
  * @returns {Number}
  */
  turnOne() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }


  /**
  * Returns a new `Angle` with the sum of `this` and the angle derived from
  * `angle`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to add
  * @returns {Rac.Angle}
  */
  add(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn + angle.turn);
  }


  /**
  * Returns a new `Angle` with the angle derived from `angle`
  * subtracted to `this`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to subtract
  * @returns {Rac.Angle}
  */
  subtract(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn - angle.turn);
  }


  /**
  * Returns a new `Angle` with `turn` set to `this.turn * factor`.
  *
  * @param {Number} factor - The factor to multiply `turn` by
  * @returns {Rac.Angle}
  */
  mult(factor) {
    return new Angle(this.rac, this.turn * factor);
  }


  /**
  * Returns a new `Angle` with `turn` set to
  * `{@link Rac.Angle#turnOne this.turnOne()} * factor`.
  *
  * Useful when doing ratio calculations where a zero angle corresponds to
  * a complete-circle.
  *
  * @example
  * rac.Angle(0).mult(0.5).turn    // returns 0
  * // whereas
  * rac.Angle(0).multOne(0.5).turn // returns 0.5
  *
  * @param {Number} factor - The factor to multiply `turn` by
  * @returns {Number}
  */
  multOne(factor) {
    return new Angle(this.rac, this.turnOne() * factor);
  }


  /**
  * Returns a new `Angle` that represents the distance from `this` to the
  * angle derived from `angle`.
  *
  * @example
  * // returns 1/2, since 1/2 - 1/4 = 1/4
  * rac.Angle(1/4).distance(1/2, true).turn
  * // returns 3/4, since 1 - (1/2 - 1/4) = 3/4
  * rac.Angle(1/4).distance(1/2, false).turn
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to measure the distance to
  * @param {Boolean} [clockwise=true] - The orientation of the measurement
  * @returns {Rac.Angle}
  */
  distance(angle, clockwise = true) {
    angle = this.rac.Angle.from(angle);
    const distance = angle.subtract(this);
    return clockwise
      ? distance
      : distance.negative();
  }

  /**
  * Returns a new `Angle` result of shifting the angle derived from
  * `angle` to have `this` as its origin.
  *
  * This operation is the equivalent to
  * + `this.add(angle)` when clockwise
  * + `this.subtract(angle)` when counter-clockwise
  *
  * @example
  * // returns 0.4, since 0.1 + 0.3 = 0.4
  * rac.Angle(0.1).shift(0.3, true).turn
  * // returns 0.8, since 0.1 - 0.3 = 0.8
  * rac.Angle(0.1).shift(0.3, false).turn
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to be shifted
  * @param {Boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Angle}
  */
  shift(angle, clockwise = true) {
    angle = this.rac.Angle.from(angle);
    return clockwise
      ? this.add(angle)
      : this.subtract(angle);
  }


  /**
  * Returns a new `Angle` result of shifting `this` to have the angle
  * derived from `origin` as its origin.
  *
  * The result of `angle.shiftToOrigin(origin)` is equivalent to
  * `origin.shift(angle)`.
  *
  * This operation is the equivalent to
  * + `origin.add(this)` when clockwise
  * + `origin.subtract(this)` when counter-clockwise
  *
  * @example
  * // returns 0.4, since 0.3 + 0.1 = 0.4
  * rac.Angle(0.1).shiftToOrigin(0.3, true).turn
  * // returns 0.2, since 0.3 - 0.1 = 0.2
  * rac.Angle(0.1).shiftToOrigin(0.3, false).turn
  *
  * @param {Rac.Angle|Number} origin - An `Angle` to use as origin
  * @param {Boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Angle}
  */
  shiftToOrigin(origin, clockwise) {
    origin = this.rac.Angle.from(origin);
    return origin.shift(this, clockwise);
  }

} // class Angle


module.exports = Angle;


},{"../Rac":2,"../util/utils":42}],10:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');



/**
* Arc of a circle from a `start` to an `end` [angle]{@link Rac.Angle}.
*
* Arcs that have [equal]{@link Rac.Angle#equals} `start` and `end` angles
* are considered a complete circle.
*
* ### `instance.Arc`
*
* Instances of `Rac` contain a convenience
* [`rac.Arc` function]{@link Rac#Arc} to create `Arc` objects from
* primitive values. This function also contains ready-made convenience
* objects, like [`rac.Arc.zero`]{@link instance.Arc#zero}, listed
* under [`instance.Arc`]{@link instance.Arc}.
*
* @example
* let rac = new Rac()
* let center = rac.Point(55, 77)
* let start = rac.Angle(1/8)
* let end = rac.Angle(3/8)
* // new instance with constructor
* let arc = new Rac.Arc(rac, center, 100, start, end, true)
* // or convenience function
* let otherArc = rac.Arc(55, 77, 1/8, 3/8)
*
* @see [`angle.equals`]{@link Rac.Angle#equals}
* @see [`rac.Arc`]{@link Rac#Arc}
* @see [`instance.Arc`]{@link instance.Arc}
*
* @alias Rac.Arc
*/
class Arc{

  /**
  * Creates a new `Arc` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Point} center - The center of the arc
  * @param {Number} radius - The radius of the arc
  * @param {Rac.Angle} start - An `Angle` where the arc starts
  * @param {Rac.Angle} end - Ang `Angle` where the arc ends
  * @param {Boolean} clockwise - The orientation of the arc
  */
  constructor(rac,
    center, radius,
    start, end,
    clockwise)
  {
    utils.assertExists(rac, center, radius, start, end, clockwise);
    utils.assertType(Rac.Point, center);
    utils.assertNumber(radius);
    utils.assertType(Rac.Angle, start, end);
    utils.assertBoolean(clockwise);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The center `Point` of the arc.
    * @type {Rac.Point}
    */
    this.center = center;

    /**
    * The radius of the arc.
    * @type {Number}
    */
    this.radius = radius;

    /**
    * The start `Angle` of the arc. The arc is draw from this angle towards
    * `end` in the `clockwise` orientation.
    *
    * When `start` and `end` are [equal angles]{@link Rac.Angle#equals}
    * the arc is considered a complete circle.
    *
    * @type {Rac.Angle}
    * @see [`angle.equals`]{@link Rac.Angle#equals}
    */
    this.start = start

    /**
    * The end `Angle` of the arc. The arc is draw from `start` to this
    * angle in the `clockwise` orientation.
    *
    * When `start` and `end` are [equal angles]{@link Rac.Angle#equals}
    * the arc is considered a complete circle.
    *
    * @type {Rac.Angle}
    * @see [`angle.equals`]{@link Rac.Angle#equals}
    */
    this.end = end;

    /**
    * The orientiation of the arc.
    * @type {Boolean}
    */
    this.clockwise = clockwise;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const xStr      = utils.cutDigits(this.center.x,   digits);
    const yStr      = utils.cutDigits(this.center.y,   digits);
    const radiusStr = utils.cutDigits(this.radius,     digits);
    const startStr  = utils.cutDigits(this.start.turn, digits);
    const endStr    = utils.cutDigits(this.end.turn,   digits);
    return `Arc((${xStr},${yStr}) r:${radiusStr} s:${startStr} e:${endStr} c:${this.clockwise}})`;
  }


  /**
  * Returns `true` when all members, except `rac`, of both arcs are equal;
  * otherwise returns `false`.
  *
  * When `otherArc` is any class other that `Rac.Arc`, returns `false`.
  *
  * Arcs' `radius` are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Segment} otherSegment - A `Segment` to compare
  * @returns {Boolean}
  * @see [`point.equals`]{@link Rac.Point#equals}
  * @see [`angle.equals`]{@link Rac.Angle#equals}
  * @see [`rac.equals`]{@link Rac#equals}
  */
  equals(otherArc) {
    return otherArc instanceof Arc
      && this.rac.equals(this.radius, otherArc.radius)
      && this.clockwise === otherArc.clockwise
      && this.center.equals(otherArc.center)
      && this.start.equals(otherArc.start)
      && this.end.equals(otherArc.end);
  }


  /**
  * Returns the length of the arc: the part of the circumference the arc
  * represents.
  * @returns {Number}
  */
  length() {
    return this.angleDistance().turnOne() * this.radius * Rac.TAU;
  }


  /**
  * Returns the length of circumference of the arc considered as a complete
  * circle.
  * @returns {Number}
  */
  circumference() {
    return this.radius * Rac.TAU;
  }


  /**
  * Returns a new `Angle` that represents the distance between `start` and
  * `end`, in the orientation of the arc.
  * @returns {Rac.Angle}
  */
  angleDistance() {
    return this.start.distance(this.end, this.clockwise);
  }


  /**
  * Returns a new `Point` located where the arc starts.
  * @returns {Rac.Point}
  */
  startPoint() {
    return this.pointAtAngle(this.start);
  }


  /**
  * Returns a new `Point` located where the arc ends.
  * @returns {Rac.Point}
  */
  endPoint() {
    return this.pointAtAngle(this.end);
  }


  /**
  * Returns a new `Ray` from `center` towars `start`.
  * @returns {Rac.Ray}
  */
  startRay() {
    return new Rac.Ray(this.rac, this.center, this.start);
  }


  /**
  * Returns a new `Ray` from `center` towars `end`.
  * @returns {Rac.Ray}
  */
  endRay() {
    return new Rac.Ray(this.rac, this.center, this.end);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Ray` tangent to the arc starting at `startPoint()` and
  * towards the arc's orientation.
  */
  startTangentRay() {
    let tangentAngle = this.start.perpendicular(this.clockwise);
    return this.startPoint().ray(tangentAngle);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Ray` tangent to the arc starting at `endPoint()` and
  * against the arc's orientation.
  */
  endTangentRay() {
    let tangentAngle = this.end.perpendicular(!this.clockwise);
    return this.endPoint().ray(tangentAngle);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Segment` representing the radius of the arc at `start`.
  * The segment starts starts at `center` and ends at `startPoint()`.
  * @returns {Rac.Segment}
  */
  startRadiusSegment() {
    return new Rac.Segment(this.rac, this.startRay(), this.radius);
  }


  /**
  * Returns a new `Segment` representing the radius of the arc at `start`.
  * The segment starts starts at `center` and ends at `startPoint()`.
  *
  * Equivalent to [`startRadiusSegment`]{@link Rac.Arc#startRadiusSegment}.
  * @returns {Rac.Segment}
  */
  startSegment() {
    return this.startRadiusSegment()
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Segment` representing the radius of the arc at `end`.
  * The segment starts starts at `center` and ends at `endPoint()`.
  * @returns {Rac.Segment}
  */
  endRadiusSegment() {
    return new Rac.Segment(this.rac, this.endRay(), this.radius);
  }


  /**
  * Returns a new `Segment` representing the radius of the arc at `end`.
  * The segment starts starts at `center` and ends at `endPoint()`.
  *
  * Equivalent to [`endRadiusSegment`]{@link Rac.Arc#endRadiusSegment}.
  *
  * @returns {Rac.Segment}
  */
  endSegment() {
    return this.endRadiusSegment();
  }


  /**
  * Returns a new `Segment` from `startPoint()` to `endPoint()`.
  *
  * Note that for complete circle arcs this segment will have a length of
  * zero and be pointed towards the perpendicular of `start` in the arc's
  * orientation.
  *
  * @returns {Rac.Segment}
  */
  chordSegment() {
    const perpendicular = this.start.perpendicular(this.clockwise);
    return this.startPoint().segmentToPoint(this.endPoint(), perpendicular);
  }


  /**
  * Returns `true` if the arc is a complete circle, which is when `start`
  * and `end` are [equal angles]{@link Rac.Angle#equals}.
  *
  * @returns {Boolean}
  * @see [`angle.equals`]{@link Rac.Angle#equals}
  */
  isCircle() {
    return this.start.equals(this.end);
  }


  /**
  * Returns a new `Arc` with center set to `newCenter`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newCenter - The center for the new `Arc`
  * @returns {Rac.Arc}
  */
  withCenter(newCenter) {
    return new Arc(this.rac,
      newCenter, this.radius,
      this.start, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with start set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} newStart - The start for the new `Arc`
  * @returns {Rac.Arc}
  */
  withStart(newStart) {
    const newStartAngle = Rac.Angle.from(this.rac, newStart);
    return new Arc(this.rac,
      this.center, this.radius,
      newStartAngle, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with end set to `newEnd`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} newEnd - The end for the new `Arc`
  * @returns {Rac.Arc}
  */
  withEnd(newEnd) {
    const newEndAngle = Rac.Angle.from(this.rac, newEnd);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEndAngle,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with radius set to `newRadius`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} newRadius - The radius for the new `Arc`
  * @returns {Rac.Arc}
  */
  withRadius(newRadius) {
    return new Arc(this.rac,
      this.center, newRadius,
      this.start, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with its orientation set to `newClockwise`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Boolean} newClockwise - The orientation for the new `Arc`
  * @returns {Rac.Arc}
  */
  withClockwise(newClockwise) {
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, this.end,
      newClockwise);
  }


  /**
  * Returns a new `Arc` with the given `angleDistance` as the distance
  * between `start` and `end` in the arc's orientation. This changes `end`
  * for the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angleDistance - The angle distance of the
  * new `Arc`
  * @returns {Rac.Arc}
  * @see [`arc.angleDistance`]{@link Rac.Arc#angleDistance}
  */
  withAngleDistance(angleDistance) {
    const newEnd = this.shiftAngle(angleDistance);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with the given `length` as the length of the
  * part of the circumference it represents. This changes `end` for the
  * new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the given `length` is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {Number} length - The length of the new `Arc`
  * @returns {Rac.Arc}
  * @see [`length`]{@link Rac.Arc#length}
  */
  withLength(length) {
    const newAngleDistance = length / this.circumference();
    return this.withAngleDistance(newAngleDistance);
  }


  /**
  * Returns a new `Arc` with `length` added to the part of the
  * circumference `this` represents. This changes `end` for the
  * new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the resulting `length` is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {Number} length - The length to add
  * @returns {Rac.Arc}
  * @see [`length`]{@link Rac.Arc#length}
  */
  withLengthAdd(length) {
    const newAngleDistance = (this.length() + length) / this.circumference();
    return this.withAngleDistance(newAngleDistance);
  }


  /**
  * Returns a new `Arc` with a `length()` of `this.length() * ratio`. This
  * changes `end` for the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range *[0,radius*TAU)*. When the calculated length is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be cut back into range through a modulo operation.
  *
  * @param {Number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Arc}
  *
  * @see [`length`]{@link Rac.Arc#length}
  */
  withLengthRatio(ratio) {
    const newLength = this.length() * ratio;
    return this.withLength(newLength);
  }


  /**
  * Returns a new `Arc` with `startPoint()` located at `point`. This
  * changes `start` and `radius` for the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.start`.
  *
  * @param {Rac.Point} point - A `Point` at the `startPoint() of the new `Arc`
  * @returns {Rac.Arc}
  *
  * @see [`point.equals`]{@link Rac.Point#equals}
  */
  withStartPoint(point) {
    const newStart = this.center.angleToPoint(point, this.start);
    const newRadius = this.center.distanceToPoint(point);
    return new Arc(this.rac,
      this.center, newRadius,
      newStart, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `endPoint()` located at `point`. This changes
  * `end` and `radius` in the new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.end`.
  *
  * @param {Rac.Point} point - A `Point` at the `endPoint() of the new `Arc`
  * @returns {Rac.Arc}
  *
  * @see [`point.equals`]{@link Rac.Point#equals}
  */
  withEndPoint(point) {
    const newEnd = this.center.angleToPoint(point, this.end);
    const newRadius = this.center.distanceToPoint(point);
    return new Arc(this.rac,
      this.center, newRadius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `start` pointing towards `point` from
  * `center`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.start`.
  *
  * @param {Rac.Point} point - A `Point` to point `start` towards
  * @returns {Rac.Arc}
  *
  * @see [`point.equals`]{@link Rac.Point#equals}
  */
  withStartTowardsPoint(point) {
    const newStart = this.center.angleToPoint(point, this.start);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `end` pointing towards `point` from `center`.
  *
  * All other properties are copied from `this`.
  *
  * When `center` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Arc` will use `this.end`.
  *
  * @param {Rac.Point} point - A `Point` to point `end` towards
  * @returns {Rac.Arc}
  * @see [`point.equals`]{@link Rac.Point#equals}
  */
  withEndTowardsPoint(point) {
    const newEnd = this.center.angleToPoint(point, this.end);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `start` pointing towards `startPoint` and
  * `end` pointing towards `endPoint`, both from `center`.
  *
  * All other properties are copied from `this`.
  *
  * * When `center` is considered [equal]{@link Rac.Point#equals} to
  * either `startPoint` or `endPoint`, the new `Arc` will use `this.start`
  * or `this.end` respectively.
  *
  * @param {Rac.Point} startPoint - A `Point` to point `start` towards
  * @param {?Rac.Point} [endPoint=null] - A `Point` to point `end` towards;
  * when ommited or `null`, `startPoint` is used instead
  * @returns {Rac.Arc}
  * @see [`point.equals`]{@link Rac.Point#equals}
  */
  withAnglesTowardsPoint(startPoint, endPoint = null) {
    const newStart = this.center.angleToPoint(startPoint, this.start);
    const newEnd = endPoint === null
      ? newStart
      : this.center.angleToPoint(endPoint, this.end);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `start` shifted by the given `angle` in the
  * arc's opposite orientation.
  *
  * All other properties are copied from `this`.
  *
  * Notice that this method shifts `start` to the arc's *opposite*
  * orientation, intending to result in a new `Arc` with an increase to
  * `angleDistance()`.
  *
  * @param {Rac.Angle} angle - An `Angle` to shift `start` against
  * @returns {Rac.Arc}
  */
  withStartExtension(angle) {
    let newStart = this.start.shift(angle, !this.clockwise);
    return new Arc(this.rac,
      this.center, this.radius,
      newStart, this.end,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with `end` shifted by the given `angle` in the
  * arc's orientation.
  *
  * All other properties are copied from `this`.
  *
  * Notice that this method shifts `end` towards the arc's orientation,
  * intending to result in a new `Arc` with an increase to
  * `angleDistance()`.
  *
  * @param {Rac.Angle} angle - An `Angle` to shift `start` against
  * @returns {Rac.Arc}
  */
  withEndExtension(angle) {
    let newEnd = this.end.shift(angle, this.clockwise);
    return new Arc(this.rac,
      this.center, this.radius,
      this.start, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Arc` with its `start` and `end` exchanged, and the
  * opposite clockwise orientation. The center and radius remain the
  * same as `this`.
  *
  * @returns {Rac.Arc}
  */
  reverse() {
    return new Arc(this.rac,
      this.center, this.radius,
      this.end, this.start,
      !this.clockwise);
  }


  /**
  * Returns the given `angle` clamped to the range:
  * ```
  * [start + startInset, end - endInset]
  * ```
  * where the addition happens towards the arc's orientation, and the
  * subtraction against.
  *
  * When `angle` is outside the range, returns whichever range limit is
  * closer.
  *
  * When the sum of the given insets is larger that `this.arcDistance()`
  * the range for the clamp is imposible to fulfill. In this case the
  * returned value will be the centered between the range limits and still
  * clampled to `[start, end]`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to clamp
  * @param {Rac.Angle|Number} [startInset={@link instance.Angle#zero rac.Angle.zero}] -
  *   The inset for the lower limit of the clamping range
  * @param {Rac.Angle|Number} [endInset={@link instance.Angle#zero rac.Angle.zero}] -
  *   The inset for the higher limit of the clamping range
  * @returns {Rac.Angle}
  */
  clampToAngles(angle, startInset = this.rac.Angle.zero, endInset = this.rac.Angle.zero) {
    angle = Rac.Angle.from(this.rac, angle);
    startInset = Rac.Angle.from(this.rac, startInset);
    endInset = Rac.Angle.from(this.rac, endInset);

    if (this.isCircle() && startInset.turn == 0 && endInset.turn == 0) {
      // Complete circle
      return angle;
    }

    // Angle in arc, with arc as origin
    // All comparisons are made in a clockwise orientation
    const shiftedAngle = this.distanceFromStart(angle);
    const angleDistance = this.angleDistance();
    const shiftedStartClamp = startInset;
    const shiftedEndClamp = angleDistance.subtract(endInset);
    const totalInsetTurn = startInset.turn + endInset.turn;

    if (totalInsetTurn >= angleDistance.turnOne()) {
      // Invalid range
      const rangeDistance = shiftedEndClamp.distance(shiftedStartClamp);
      let halfRange;
      if (this.isCircle()) {
        halfRange = rangeDistance.mult(1/2);
      } else {
        halfRange = totalInsetTurn >= 1
          ? rangeDistance.multOne(1/2)
          : rangeDistance.mult(1/2);
      }

      const middleRange = shiftedEndClamp.add(halfRange);
      const middle = this.start.shift(middleRange, this.clockwise);

      return this.clampToAngles(middle);
    }

    if (shiftedAngle.turn >= shiftedStartClamp.turn && shiftedAngle.turn <= shiftedEndClamp.turn) {
      // Inside clamp range
      return angle;
    }

    // Outside range, figure out closest limit
    let distanceToStartClamp = shiftedStartClamp.distance(shiftedAngle, false);
    let distanceToEndClamp = shiftedEndClamp.distance(shiftedAngle);
    if (distanceToStartClamp.turn <= distanceToEndClamp.turn) {
      return this.start.shift(startInset, this.clockwise);
    } else {
      return this.end.shift(endInset, !this.clockwise);
    }
  }


  /**
  * Returns `true` when `angle` is between `start` and `end` in the arc's
  * orientation.
  *
  * When the arc represents a complete circle, `true` is always returned.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to evaluate
  * @returns {Boolean}
  */
  containsAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    if (this.isCircle()) { return true; }

    if (this.clockwise) {
      let offset = angle.subtract(this.start);
      let endOffset = this.end.subtract(this.start);
      return offset.turn <= endOffset.turn;
    } else {
      let offset = angle.subtract(this.end);
      let startOffset = this.start.subtract(this.end);
      return offset.turn <= startOffset.turn;
    }
  }

  /**
  * Returns `true` when the projection of `point` in the arc is positioned
  * between `start` and `end` in the arc's orientation.
  *
  * When the arc represents a complete circle, `true` is always returned.
  *
  * @param {Rac.Point} point - A `Point` to evaluate
  * @returns {Boolean}
  */
  containsProjectedPoint(point) {
    if (this.isCircle()) { return true; }
    return this.containsAngle(this.center.angleToPoint(point));
  }


  /**
  * Returns a new `Angle` with `angle` [shifted by]{@link Rac.Angle#shift}
  * `start` in the arc's orientation.
  *
  * @example
  * <caption>For a clockwise arc starting at <code>0.5</code></caption>
  * let arc = rac.Arc(0, 0, 0.5, null, true)
  * // returns 0.6, since 0.5 + 0.1 = 0.6
  * arc.shiftAngle(0.1)
  *
  * @example
  * <caption>For a counter-clockwise arc starting at <code>0.5</code></caption>
  * let arc = rac.Arc(0, 0, 0.5, null, false)
  * // returns 0.3, since 0.5 - 0.2 = 0.3
  * arc.shiftAngle(0.2)
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to shift
  * @returns {Rac.Angle}
  * @see [`angle.shift`]{@link Rac.Angle#shift}
  */
  shiftAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.start.shift(angle, this.clockwise);
  }


  /**
  * Returns a new `Angle` that represents the angle distance from `start`
  * to `angle` in the arc's orientation.
  *
  * Can be used to determine, for a given angle, where it sits inside the
  * arc if the arc `start` was the origin angle.
  *
  * @example
  * <caption>For a clockwise arc starting at <code>0.5</code></caption>
  * let arc = rac.Arc(55, 77, 0.5, null, true)
  * // returns 0.2, since 0.7 - 0.5 = 0.2
  * arc.distanceFromStart(0.7)
  *
  * @example
  * <caption>For a counter-clockwise arc starting at <code>0.5</code></caption>
  * let arc = rac.Arc(55, 77, 0.5, null, false)
  * // returns 0.8, since 1 - (0.7 - 0.5) = 0.8
  * arc.distanceFromStart(0.7)
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to measure the distance to
  * @returns {Rac.Angle}
  */
  distanceFromStart(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.start.distance(angle, this.clockwise);
  }


  /**
  * Returns a new `Point` located in the arc at the given `angle`. This
  * method does not consider the `start` nor `end` of the arc.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` towards the new `Point`
  * @returns {Rac.Point}
  */
  pointAtAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.center.pointToAngle(angle, this.radius);
  }


  /**
  * Returns a new `Point` located in the arc at the given `angle`
  * [shifted by]{@link Rac.Angle#shift} `start` in arc's orientation.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.Angle} angle - An `Angle` to be shifted by `start`
  * @returns {Rac.Point}
  */
  pointAtAngleDistance(angle) {
    let shiftedAngle = this.shiftAngle(angle);
    return this.pointAtAngle(shiftedAngle);
  }


  /**
  * Returns a new `Point` located in the arc at the given `length` from
  * `startPoint()` in arc's orientation.
  *
  * The arc is considered a complete circle.
  *
  * @param {Number} length - The length from `startPoint()` to the new `Point`
  * @returns {Rac.Point}
  */
  pointAtLength(length) {
    const angleDistance = length / this.circumference();
    return this.pointAtAngleDistance(angleDistance);
  }


  /**
  * Returns a new `Point` located in the arc at `length() * ratio` from
  * `startPoint()` in the arc's orientation.
  *
  * The arc is considered a complete circle.
  *
  * @param {Number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Point}
  */
  pointAtLengthRatio(ratio) {
    let newAngleDistance = this.angleDistance().multOne(ratio);
    let shiftedAngle = this.shiftAngle(newAngleDistance);
    return this.pointAtAngle(shiftedAngle);
  }


  /**
  * Returns a new `Segment` representing the radius of the arc at the
  * given `angle`. This method does not consider the `start` nor `end` of
  * the arc.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.Angle|Number} angle - The direction of the radius to return
  * @returns {Rac.Segment}
  */
  radiusSegmentAtAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    const newRay = new Rac.Ray(this.rac, this.center, angle);
    return new Rac.Segment(this.rac, newRay, this.radius);
  }


  /**
  * Returns a new `Segment` representing the radius of the arc in the
  * direction towards the given `point`. This method does not consider the
  * `start` nor `end` of the arc.
  *
  * The arc is considered a complete circle.
  *
  * @param {Rac.point} point - A `Point` in the direction of the radius to return
  * @returns {Rac.Segment}
  */
  radiusSegmentTowardsPoint(point) {
    const angle = this.center.angleToPoint(point);
    const newRay = new Rac.Ray(this.rac, this.center, angle);
    return new Rac.Segment(this.rac, newRay, this.radius);
  }


  /**
  * Returns a new `Segment` for the chord formed by the intersection of
  * `this` and `otherArc`, or `null` when there is no intersection.
  *
  * The returned `Segment` will point towards the `this` orientation.
  *
  * Both arcs are considered complete circles for the calculation of the
  * chord, thus the endpoints of the returned segment may not lay inside
  * the actual arcs.
  *
  * @param {Rac.Arc} otherArc - description
  * @returns {?Rac.Segment}
  */
  intersectionChord(otherArc) {
    // https://mathworld.wolfram.com/Circle-CircleIntersection.html
    // R=this, r=otherArc

    if (this.center.equals(otherArc.center)) {
      return null;
    }

    const distance = this.center.distanceToPoint(otherArc.center);

    if (distance > this.radius + otherArc.radius) {
      return null;
    }

    // distanceToChord = (d^2 - r^2 + R^2) / (d*2)
    const distanceToChord = (
        Math.pow(distance, 2)
      - Math.pow(otherArc.radius, 2)
      + Math.pow(this.radius, 2)
      ) / (distance * 2);

    // a = 1/d sqrt|(-d+r-R)(-d-r+R)(-d+r+R)(d+r+R)
    const chordLength = (1 / distance) * Math.sqrt(
        (-distance + otherArc.radius - this.radius)
      * (-distance - otherArc.radius + this.radius)
      * (-distance + otherArc.radius + this.radius)
      * (distance + otherArc.radius + this.radius));

    const segmentToChord = this.center.rayToPoint(otherArc.center)
      .segment(distanceToChord);
    return segmentToChord.nextSegmentPerpendicular(this.clockwise, chordLength/2)
      .reverse()
      .withLengthRatio(2);
  }


  // TODO: consider if intersectingPointsWithArc is necessary
  /**
  * Returns an array containing the intersecting points of `this` with
  * `otherArc`.
  *
  * When there are no intersecting points, returns an empty array.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to calculate intersection points with
  * @returns {Rac.Arc}
  *
  * @ignore
  */
  // intersectingPointsWithArc(otherArc) {
  //   let chord = this.intersectionChord(otherArc);
  //   if (chord === null) { return []; }

  //   let intersections = [chord.startPoint(), chord.endPoint()].filter(function(item) {
  //     return this.containsAngle(this.center.segmentToPoint(item))
  //       && otherArc.containsAngle(otherArc.center.segmentToPoint(item));
  //   }, this);

  //   return intersections;
  // }


  /**
  * Returns a new `Segment` representing the chord formed by the
  * intersection of the arc and 'ray', or `null` when no chord is possible.
  *
  * The returned `Segment` will always have the same angle as `ray`.
  *
  * The arc is considered a complete circle and `ray` is considered an
  * unbounded line.
  *
  * @param {Rac.Ray} ray - A `Ray` to calculate the intersection with
  * @returns {?Rac.Segment}
  */
  intersectionChordWithRay(ray) {
    // First check intersection
    const bisector = this.center.segmentToProjectionInRay(ray);
    const distance = bisector.length;

    // Segment too close to center, cosine calculations may be incorrect
    // Calculate segment through center
    if (this.rac.equals(0, distance)) {
      const start = this.pointAtAngle(ray.angle.inverse());
      const newRay = new Rac.Ray(this.rac, start, ray.angle);
      return new Rac.Segment(this.rac, newRay, this.radius*2);
    }

    // Ray is tangent, return zero-length segment at contact point
    if (this.rac.equals(distance, this.radius)) {
      const start = this.pointAtAngle(bisector.ray.angle);
      const newRay = new Rac.Ray(this.rac, start, ray.angle);
      return new Rac.Segment(this.rac, newRay, 0);
    }

    // Ray does not touch arc
    if (distance > this.radius) {
      return null;
    }

    const radians = Math.acos(distance/this.radius);
    const angle = Rac.Angle.fromRadians(this.rac, radians);

    const centerOrientation = ray.pointOrientation(this.center);
    const start = this.pointAtAngle(bisector.angle().shift(angle, !centerOrientation));
    const end = this.pointAtAngle(bisector.angle().shift(angle, centerOrientation));
    return start.segmentToPoint(end, ray.angle);
  }


  /**
  * Returns a new `Point` representing the end of the chord formed by the
  * intersection of the arc and 'ray', or `null` when no chord is possible.
  *
  * When `useProjection` is `true` the method will always return a `Point`
  * even when there is no contact between the arc and `ray`. In this case
  * the point in the arc closest to `ray` is returned.
  *
  * The arc is considered a complete circle and `ray` is considered an
  * unbounded line.
  *
  * @param {Rac.Ray} ray - A `Ray` to calculate the intersection with
  * @returns {?Rac.Point}
  */
  intersectionChordEndWithRay(ray, useProjection = false) {
    const chord = this.intersectionChordWithRay(ray);
    if (chord !== null) {
      return chord.endPoint();
    }

    if (useProjection) {
      const centerOrientation = ray.pointOrientation(this.center);
      const perpendicular = ray.angle.perpendicular(!centerOrientation);
      return this.pointAtAngle(perpendicular);
    }

    return null;
  }


  /**
  * Returns a new `Arc` representing the section of `this` that is inside
  * `otherArc`, or `null` when there is no intersection. The returned arc
  * will have the same center, radius, and orientation as `this`.
  *
  * Both arcs are considered complete circles for the calculation of the
  * intersection, thus the endpoints of the returned arc may not lay inside
  * `this`.
  *
  * An edge case of this method is that when the distance between `this`
  * and `otherArc` is the sum of their radius, meaning the arcs touch at a
  * single point, the resulting arc may have a angle-distance of zero,
  * which is interpreted as a complete-circle arc.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to intersect with
  * @returns {?Rac.Arc}
  */
  intersectionArc(otherArc) {
    const chord = this.intersectionChord(otherArc);
    if (chord === null) { return null; }

    return this.withAnglesTowardsPoint(chord.startPoint(), chord.endPoint());
  }


  // TODO: implement intersectionArcNoCircle?


  // TODO: finish boundedIntersectionArc
  /**
  * Returns a new `Arc` representing the section of `this` that is inside
  * `otherArc` and bounded by `this.start` and `this.end`, or `null` when
  * there is no intersection. The returned arc will have the same center,
  * radius, and orientation as `this`.
  *
  * `otherArc` is considered a complete circle, while the start and end of
  * `this` are considered for the resulting `Arc`.
  *
  * When there exist two separate arc sections that intersect with
  * `otherArc`: only the section of `this` closest to `start` is returned.
  * This can happen when `this` starts inside `otherArc`, then exits, and
  * then ends inside `otherArc`, regardless if `this` is a complete circle
  * or not.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to intersect with
  * @returns {?Rac.Arc}
  *
  * @ignore
  */
  // boundedIntersectionArc(otherArc) {
  //   let chord = this.intersectionChord(otherArc);
  //   if (chord === null) { return null; }

  //   let chordStartAngle = this.center.angleToPoint(chord.startPoint());
  //   let chordEndAngle = this.center.angleToPoint(chord.endPoint());

  //   // get all distances from this.start
  //   // if closest is chordEndAngle, only start may be inside arc
  //   // if closest is this.end, whole arc is inside or outside
  //   // if closest is chordStartAngle, only end may be inside arc
  //   const interStartDistance = this.start.distance(chordStartAngle, this.clockwise);
  //   const interEndDistance = this.start.distance(chordEndAngle, this.clockwise);
  //   const endDistance = this.start.distance(this.end, this.clockwise);


  //   // if closest is chordStartAngle, normal rules
  //   // if closest is end not zero, if following is chordStart, return null
  //   // if closest is end not zero, if following is chordend, return self
  //   // if closest is end zero, if following is chordStart, normal rules
  //   // if closest is end zero, if following is chordend, return start to chordend
  //   // if closest is chordEndAngle, return start to chordEnd


  //   if (!this.containsAngle(chordStartAngle)) {
  //     chordStartAngle = this.start;
  //   }
  //   if (!this.containsAngle(chordEndAngle)) {
  //     chordEndAngle = this.end;
  //   }

  //   return new Arc(this.rac,
  //     this.center, this.radius,
  //     chordStartAngle,
  //     chordEndAngle,
  //     this.clockwise);
  // }


  /**
  * Returns a new `Segment` that is tangent to both `this` and `otherArc`,
  * or `null` when no tangent segment is possible. The new `Segment` starts
  * at the contact point with `this` and ends at the contact point with
  * `otherArc`.
  *
  * Considering _center axis_ a ray from `this.center` towards
  * `otherArc.center`, `startClockwise` determines the side of the start
  * point of the returned segment in relation to _center axis_, and
  * `endClockwise` the side of the end point.
  *
  * Both `this` and `otherArc` are considered complete circles.
  *
  * @param {Rac.Arc} otherArc - An `Arc` to calculate a tangent segment towards
  * @param {Boolean} startClockwise - The orientation of the new `Segment`
  * start point in relation to the _center axis_
  * @param {Boolean} endClockwise - The orientation of the new `Segment`
  * end point in relation to the _center axis_
  * @returns {?Rac.Segment}
  */
  tangentSegment(otherArc, startClockwise = true, endClockwise = true) {
    if (this.center.equals(otherArc.center)) {
      return null;
    }

    // Hypothenuse of the triangle used to calculate the tangent
    // main angle is at `this.center`
    const hypSegment = this.center.segmentToPoint(otherArc.center);
    const ops = startClockwise === endClockwise
      ? otherArc.radius - this.radius
      : otherArc.radius + this.radius;

    // When ops and hyp are close, snap to 1
    const angleSine = this.rac.equals(Math.abs(ops), hypSegment.length)
      ? (ops > 0 ? 1 : -1)
      : ops / hypSegment.length;
    if (Math.abs(angleSine) > 1) {
      return null;
    }

    const angleRadians = Math.asin(angleSine);
    const opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);

    const adjOrientation = startClockwise === endClockwise
      ? startClockwise
      : !startClockwise;
    const shiftedOpsAngle = hypSegment.ray.angle.shift(opsAngle, adjOrientation);
    const shiftedAdjAngle = shiftedOpsAngle.perpendicular(adjOrientation);

    const startAngle = startClockwise === endClockwise
      ? shiftedAdjAngle
      : shiftedAdjAngle.inverse()
    const start = this.pointAtAngle(startAngle);
    const end = otherArc.pointAtAngle(shiftedAdjAngle);
    const defaultAngle = startAngle.perpendicular(!startClockwise);
    return start.segmentToPoint(end, defaultAngle);
  }


  /**
  * Returns an array containing new `Arc` objects representing `this`
  * divided into `count` arcs, all with the same
  * [angle distance]{@link Rac.Arc#angleDistance}.
  *
  * When `count` is zero or lower, returns an empty array. When `count` is
  * `1` returns an arc equivalent to `this`.
  *
  * @param {Number} count - Number of arcs to divide `this` into
  * @returns {Rac.Arc[]}
  */
  divideToArcs(count) {
    if (count <= 0) { return []; }

    const angleDistance = this.angleDistance();
    const partTurn = angleDistance.turnOne() / count;

    const arcs = [];
    for (let index = 0; index < count; index += 1) {
      const start = this.start.shift(partTurn * index, this.clockwise);
      const end = this.start.shift(partTurn * (index+1), this.clockwise);
      const arc = new Arc(this.rac, this.center, this.radius, start, end, this.clockwise);
      arcs.push(arc);
    }

    return arcs;
  }


  /**
  * Returns an array containing new `Segment` objects representing `this`
  * divided into `count` chords, all with the same length.
  *
  * When `count` is zero or lower, returns an empty array. When `count` is
  * `1` returns an arc equivalent to
  * `[this.chordSegment()]{@link Rac.Arc#chordSegment}`.
  *
  * @param {Number} count - Number of segments to divide `this` into
  * @returns {Rac.Segment[]}
  */
  divideToSegments(count) {
    if (count <= 0) { return []; }

    const angleDistance = this.angleDistance();
    const partTurn = angleDistance.turnOne() / count;

    const segments = [];
    for (let index = 0; index < count; index += 1) {
      const startAngle = this.start.shift(partTurn * index, this.clockwise);
      const endAngle = this.start.shift(partTurn * (index+1), this.clockwise);
      const startPoint = this.pointAtAngle(startAngle);
      const endPoint = this.pointAtAngle(endAngle);
      const segment = startPoint.segmentToPoint(endPoint);
      segments.push(segment);
    }

    return segments;
  }


  /**
  * Returns a new `Composite` that contains `Bezier` objects representing
  * the arc divided into `count` beziers that approximate the shape of the
  * arc.
  *
  * When `count` is zero or lower, returns an empty `Composite`.
  *
  * @param {Number} count - Number of beziers to divide `this` into
  * @returns {Rac.Composite}
  *
  * @see [`Rac.Bezier`]{@link Rac.Bezier}
  */
  divideToBeziers(count) {
    if (count <= 0) { return new Rac.Composite(this.rac, []); }

    const angleDistance = this.angleDistance();
    const partTurn = angleDistance.turnOne() / count;

    // length of tangent:
    // https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    const parsPerTurn = 1 / partTurn;
    const tangent = this.radius * (4/3) * Math.tan(Rac.TAU/(parsPerTurn*4));

    const beziers = [];
    const segments = this.divideToSegments(count);
    segments.forEach(item => {
      const startArcRadius = this.center.segmentToPoint(item.startPoint());
      const endArcRadius = this.center.segmentToPoint(item.endPoint());

      let startAnchor = startArcRadius
        .nextSegmentToAngleDistance(this.rac.Angle.square, !this.clockwise, tangent)
        .endPoint();
      let endAnchor = endArcRadius
        .nextSegmentToAngleDistance(this.rac.Angle.square, this.clockwise, tangent)
        .endPoint();

      const newBezier = new Rac.Bezier(this.rac,
        startArcRadius.endPoint(), startAnchor,
        endAnchor, endArcRadius.endPoint())

      beziers.push(newBezier);
    });

    return new Rac.Composite(this.rac, beziers);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` located and oriented towards `startTangentRay()`
  * with the given `string` and `format`.
  *
  * When `format` is ommited or `null`, the format used for the returned
  * text will be:
  * + [`rac.Text.Format.bottomLeft`]{@link instance.Text.Format#bottomLeft}
  * format for arcs with `clockwise` orientation set to `true`
  * + [`rac.Text.Format.topLeft`]{@link instance.Text.Format#topLeft}
  * format for arcs with `clockwise` orientation set to `false`
  *
  * When `format` is provided, the angle for the returned text will still
  * be set to `startTangentRay().angle`.
  *
  * @param {String} string - The string of the new `Text`
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format of the new `Text`; when ommited or `null`, a default
  *   format is used instead
  * @returns {Rac.Text}
  */
  text(string, format = null) {
    if (format === null) {
      format = this.clockwise
        ? this.rac.Text.Format.bottomLeft
        : this.rac.Text.Format.topLeft;
    }
    return this.startTangentRay().text(string, format);
  }

} // class Arc


module.exports = Arc;


},{"../Rac":2,"../util/utils":42}],11:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Bezier curve with start, end, and two anchor [points]{@link Rac.Point}.
* @alias Rac.Bezier
*/
class Bezier {

  constructor(rac, start, startAnchor, endAnchor, end) {
    utils.assertExists(rac, start, startAnchor, endAnchor, end);
    utils.assertType(Rac.Point, start, startAnchor, endAnchor, end);

    this.rac = rac;
    this.start = start;
    this.startAnchor = startAnchor;
    this.endAnchor = endAnchor;
    this.end = end;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const startXStr       = utils.cutDigits(this.start.x,       digits);
    const startYStr       = utils.cutDigits(this.start.y,       digits);
    const startAnchorXStr = utils.cutDigits(this.startAnchor.x, digits);
    const startAnchorYStr = utils.cutDigits(this.startAnchor.y, digits);
    const endAnchorXStr   = utils.cutDigits(this.endAnchor.x,   digits);
    const endAnchorYStr   = utils.cutDigits(this.endAnchor.y,   digits);
    const endXStr         = utils.cutDigits(this.end.x,         digits);
    const endYStr         = utils.cutDigits(this.end.y,         digits);

    return `Bezier(s:(${startXStr},${startYStr}) sa:(${startAnchorXStr},${startAnchorYStr}) ea:(${endAnchorXStr},${endAnchorYStr}) e:(${endXStr},${endYStr}))`;
  }


  /**
  * Returns `true` when all members, except `rac`, of both beziers are
  * [considered equal]{@link Rac.Point#equals}; otherwise returns `false`.
  *
  * When `otherBezier` is any class other that `Rac.Bezier`, returns
  * `false`.
  *
  * @param {Rac.Bezier} otherBezier - A `Bezier` to compare
  * @returns {Boolean}
  *
  * @see Rac.Point#equals
  */
  equals(otherBezier) {
    return otherBezier instanceof Bezier
      && this.start      .equals(otherBezier.start)
      && this.startAnchor.equals(otherBezier.startAnchor)
      && this.endAnchor  .equals(otherBezier.endAnchor)
      && this.end        .equals(otherBezier.end);
  }

}


module.exports = Bezier;


Bezier.prototype.drawAnchors = function(style = undefined) {
  push();
  if (style !== undefined) {
    style.apply();
  }
  this.start.segmentToPoint(this.startAnchor).draw();
  this.end.segmentToPoint(this.endAnchor).draw();
  pop();
};

Bezier.prototype.reverse = function() {
  return new Bezier(this.rac,
    this.end, this.endAnchor,
    this.startAnchor, this.start);
};


},{"../Rac":2,"../util/utils":42}],12:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of a sequence of drawable objects that can be drawn together.
*
* Used by `[P5Drawer]{@link Rac.P5Drawer}` to perform specific vertex
* operations with drawables to draw complex shapes.
*
* @class
* @alias Rac.Composite
*/
function Composite(rac, sequence = []) {
  utils.assertExists(rac, sequence);

  this.rac = rac;
  this.sequence = sequence;
};


module.exports = Composite;


Composite.prototype.isNotEmpty = function() {
  return this.sequence.length != 0;
};

Composite.prototype.add = function(element) {
  if (element instanceof Array) {
    element.forEach(item => this.sequence.push(item));
    return
  }
  this.sequence.push(element);
};

Composite.prototype.reverse = function() {
  let reversed = this.sequence.map(item => item.reverse())
    .reverse();
  return new Composite(this.rac, reversed);
};


},{"../Rac":2,"../util/utils":42}],13:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
*
* Several methods will return an adjusted value or perform adjustments in
* their operation when two points are close enough as to be considered
* equal. When the the difference of each coordinate of two points
* is under the [`equalityThreshold`]{@link Rac#equalityThreshold} the
* points are considered equal. The [`equals`]{@link Rac.Point#equals}
* method performs this check.
*
* ### `instance.Point`
*
* Instances of `Rac` contain a convenience
* [`rac.Point` function]{@link Rac#Point} to create `Point` objects with
* fewer parameters. This function also contains ready-made convenience
* objects, like [`rac.Point.origin`]{@link instance.Point#origin}, listed under
* [`instance.Point`]{@link instance.Point}.
*
* @example
* let rac = new Rac()
* // new instance with constructor
* let point = new Rac.Point(rac, 55, 77)
* // or convenience function
* let otherPoint = rac.Point(55, 77)
*
* @see [`rac.Point`]{@link Rac#Point}
* @see [`instance.Point`]{@link instance.Point}
*
* @alias Rac.Point
*/
class Point{


  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {Number} x
  *   The x coordinate
  * @param {Number} y
  *   The y coordinate
  */
  constructor(rac, x, y) {
    utils.assertExists(rac, x, y);
    utils.assertNumber(x, y);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * X coordinate of the point.
    * @type {Number}
    */
    this.x = x;

    /**
    * Y coordinate of the point.
    * @type {Number}
    */
    this.y = y;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * rac.Point(55, 77).toString()
  * // returns: 'Point(55,77)'
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.x, digits);
    const yStr = utils.cutDigits(this.y, digits);
    return `Point(${xStr},${yStr})`;
  }


  /**
  * Returns `true` when the difference with `otherPoint` for each
  * coordinate is under [`rac.equalityThreshold`]{@link Rac#equalityThreshold};
  * otherwise returns `false`.
  *
  * When `otherPoint` is any class other that `Rac.Point`, returns `false`.
  *
  * Values are compared using [`rac.equals`]{@link Rac#equals}.
  *
  * @param {Rac.Point} otherPoint - A `Point` to compare
  * @returns {Boolean}
  * @see [`rac.equals`]{@link Rac#equals}
  */
  equals(otherPoint) {
    return otherPoint instanceof Point
      && this.rac.equals(this.x, otherPoint.x)
      && this.rac.equals(this.y, otherPoint.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  * @param {Number} newX - The x coordinate for the new `Point`
  * @returns {Rac.Point}
  */
  withX(newX) {
    return new Point(this.rac, newX, this.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  * @param {Number} newY - The y coordinate for the new `Point`
  * @returns {Rac.Point}
  */
  withY(newY) {
    return new Point(this.rac, this.x, newY);
  }


  /**
  * Returns a new `Point` with `x` added to `this.x`.
  * @param {Number} x - The x coordinate to add
  * @returns {Rac.Point}
  */
  addX(x) {
    return new Point(this.rac,
      this.x + x, this.y);
  }


  /**
  * Returns a new `Point` with `y` added to `this.y`.
  * @param {Number} y - The y coordinate to add
  * @returns {Rac.Point}
  */
  addY(y) {
    return new Point(this.rac,
      this.x, this.y + y);
  }


  /**
  * Returns a new `Point` by adding the components of `point` to `this`.
  * @param {Rac.Point} point - A `Point` to add
  * @returns {Rac.Point}
  */
  addPoint(point) {
    return new Point(
      this.rac,
      this.x + point.x,
      this.y + point.y);
  }


  /**
  * Returns a new `Point` by adding the `x` and `y` components to `this`.
  * @param {Number} x - The x coodinate to add
  * @param {Number} y - The y coodinate to add
  * @returns {Rac.Point}
  */
  add(x, y) {
    return new Point(this.rac,
      this.x + x, this.y + y);
  }


  /**
  * Returns a new `Point` by subtracting the components of `point`.
  * @param {Rac.Point} point - A `Point` to subtract
  * @returns {Rac.Point}
  */
  subtractPoint(point) {
    return new Point(
      this.rac,
      this.x - point.x,
      this.y - point.y);
  }


  /**
  * Returns a new `Point` by subtracting the `x` and `y` components.
  * @param {Number} x - The x coodinate to subtract
  * @param {Number} y - The y coodinate to subtract
  * @returns {Rac.Point}
  */
  subtract(x, y) {
    return new Point(
      this.rac,
      this.x - x,
      this.y - y);
  }


  /**
  * Returns a new `Point` with the negative coordinate values of `this`.
  * @returns {Rac.Point}
  */
  negative() {
    return new Point(this.rac, -this.x, -this.y);
  }


  /**
  * Returns the distance from `this` to `point`.
  *
  * When `this` and `point` are [considered equal]{@link Rac.Point#equals},
  * returns the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to measure the distance to
  * @returns {Number}
  * @see [`equals`]{@link Rac.Point#equals}
  */
  distanceToPoint(point) {
    if (this.equals(point)) {
      return 0;
    }
    const x = Math.pow((point.x - this.x), 2);
    const y = Math.pow((point.y - this.y), 2);
    return Math.sqrt(x+y);
  }


  /**
  * Returns the angle from `this` to `point`.
  *
  * When `this` and `point` are [considered equal]{@link Rac.Point#equals},
  * returns the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to measure the angle to
  * @param {Rac.Angle|Number}
  *   [defaultAngle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   An `Angle` to return when `this` and `point` are equal
  * @returns {Rac.Angle}
  * @see [`equals`]{@link Rac.Point#equals}
  */
  angleToPoint(point, defaultAngle = this.rac.Angle.zero) {
    if (this.equals(point)) {
      defaultAngle = this.rac.Angle.from(defaultAngle);
      return defaultAngle;
    }
    const offset = point.subtractPoint(this);
    const radians = Math.atan2(offset.y, offset.x);
    return Rac.Angle.fromRadians(this.rac, radians);
  }


  /**
  * Returns a new `Point` at a `distance` from `this` in the direction of
  * `angle`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` towars the new `Point`
  * @param {Number} distance - The distance to the new `Point`
  * @returns {Rac.Point}
  */
  pointToAngle(angle, distance) {
    angle = this.rac.Angle.from(angle);
    const distanceX = distance * Math.cos(angle.radians());
    const distanceY = distance * Math.sin(angle.radians());
    return new Point(this.rac, this.x + distanceX, this.y + distanceY);
  }


  /**
  * Returns a new `Point` located in the middle between `this` and `point`.
  * @param {Rac.Point} point - A `Point` to calculate a bisector to
  * @returns {Rac.Point}
  */
  pointAtBisector(point) {
    const xOffset = (point.x - this.x) / 2;
    const yOffset = (point.y - this.y) / 2;
    return new Point(this.rac, this.x + xOffset, this.y + yOffset);
  }


  /**
  * Returns a new `Ray` from `this` towards `angle`.
  * @param {Rac.Angle|Number} angle - The `Angle` of the new `Ray`
  * @returns {Rac.Ray}
  */
  ray(angle) {
    angle = this.rac.Angle.from(angle);
    return new Rac.Ray(this.rac, this, angle);
  }


  /**
  * Returns a new `Ray` from `this` towards `point`.
  *
  * When `this` and `point` are [considered equal]{@link Rac.Point#equals},
  * the new `Ray` will use the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Ray` towards
  * @param {Rac.Angle|Number}
  *   [defaultAngle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   An `Angle` to use when `this` and `point` are equal
  * @returns {Rac.Ray}
  */
  rayToPoint(point, defaultAngle = this.rac.Angle.zero) {
    defaultAngle = this.angleToPoint(point, defaultAngle);
    return new Rac.Ray(this.rac, this, defaultAngle);
  }


  /**
  * Returns a new `Ray` from `this` to the projection of `this` in `ray`.
  *
  * When the projected point and `this` are
  * [considered equal]{@link Rac.Point#equals} the produced ray will have
  * an angle perpendicular to `ray` in the clockwise direction.
  *
  * @param {Rac.Ray} ray - A `Ray` to project `this` onto
  * @returns {Rac.Ray}
  */
  rayToProjectionInRay(ray) {
    const projected = ray.pointProjection(this);
    const perpendicular = ray.angle.perpendicular();
    return this.rayToPoint(projected, perpendicular);
  }


  /**
  * @summary
  * Returns a new `Ray` that starts at `this` and is tangent to `arc`, when
  * no tangent is possible returns `null`.
  *
  * @description
  * The new `Ray` will be in the `clockwise` side of the ray formed
  * from `this` towards `arc.center`. `arc` is considered a complete
  * circle.
  *
  * When `this` is inside `arc` no tangent segment is possible and `null`
  * is returned.
  *
  * A special case is considered when `arc.radius` is considered to be `0`
  * and `this` is equal to `arc.center`. In this case the angle between
  * `this` and `arc.center` is assumed to be the inverse of `arc.start`,
  * thus the new `Ray` will have an angle perpendicular to
  * `arc.start.inverse()`, in the `clockwise` orientation.
  *
  * @param {Rac.Arc} arc - An `Arc` to calculate a tangent to, considered
  * as a complete circle
  * @param {Boolean} [clockwise=true] - the orientation of the new `Ray`
  * @return {?Rac.Ray}
  */
  rayTangentToArc(arc, clockwise = true) {
    // A default angle is given for the edge case of a zero-radius arc
    let hypotenuse = this.segmentToPoint(arc.center, arc.start.inverse());
    let ops = arc.radius;

    if (this.rac.equals(hypotenuse.length, arc.radius)) {
      // Point in arc
      const perpendicular = hypotenuse.ray.angle.perpendicular(clockwise);
      return new Rac.Ray(this.rac, this, perpendicular);
    }

    if (this.rac.equals(hypotenuse.length, 0)) {
      return null;
    }

    let angleSine = ops / hypotenuse.length;
    if (angleSine > 1) {
      // Point inside arc
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = Rac.Angle.fromRadians(this.rac, angleRadians);
    let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

    return new Rac.Ray(this.rac, this, shiftedOpsAngle);
  }


  /**
  * Returns a new `Segment` from `this` towards `angle` with the given
  * `length`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to point the segment
  * towards
  * @param {Number} length - The length of the new `Segment`
  * @returns {Rac.Segment}
  */
  segmentToAngle(angle, length) {
    angle = this.rac.Angle.from(angle);
    const ray = new Rac.Ray(this.rac, this, angle);
    return new Rac.Segment(this.rac, ray, length);
  }


  /**
  * Returns a new `Segment` from `this` to `point`.
  *
  * When `this` and `point` are [considered equal]{@link Rac.Point#equals},
  * the new `Segment` will use the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Segment` towards
  * @param {Rac.Angle|Number}
  *   [defaultAngle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   An `Angle` to use when `this` and `point` are equal
  * @returns {Rac.Segment}
  * @see [`equals`]{@link Rac.Point#equals}
  */
  segmentToPoint(point, defaultAngle = this.rac.Angle.zero) {
    defaultAngle = this.angleToPoint(point, defaultAngle);
    const length = this.distanceToPoint(point);
    const ray = new Rac.Ray(this.rac, this, defaultAngle);
    return new Rac.Segment(this.rac, ray, length);
  }


  /**
  * Returns a new `Segment` from `this` to the projection of `this` in
  * `ray`.
  *
  * When the projected point is equal to `this`, the new `Segment` will
  * have an angle perpendicular to `ray` in the clockwise direction.
  *
  * @param {Rac.Ray} ray - A `Ray` to project `this` onto
  * @returns {Rac.Segment}
  */
  segmentToProjectionInRay(ray) {
    const projected = ray.pointProjection(this);
    const perpendicular = ray.angle.perpendicular();
    return this.segmentToPoint(projected, perpendicular);
  }


  /**
  * @summary
  * Returns a new `Segment` that starts at `this` and is tangent to `arc`,
  * when no tangent is possible returns `null`.
  *
  * @description
  * The new `Segment` will be in the `clockwise` side of the ray formed
  * from `this` towards `arc.center`, and its end point will be at the
  * contact point with `arc` which is considered as a complete circle.
  *
  * When `this` is inside `arc` no tangent segment is possible and `null`
  * is returned.
  *
  * A special case is considered when `arc.radius` is considered to be `0`
  * and `this` is equal to `arc.center`. In this case the angle between
  * `this` and `arc.center` is assumed to be the inverse of `arc.start`,
  * thus the new `Segment` will have an angle perpendicular to
  * `arc.start.inverse()`, in the `clockwise` orientation.
  *
  * @param {Rac.Arc} arc - An `Arc` to calculate a tangent to, considered
  * as a complete circle
  * @param {Boolean} [clockwise=true] - the orientation of the new `Segment`
  * @return {?Rac.Segment}
  */
  segmentTangentToArc(arc, clockwise = true) {
    const tangentRay = this.rayTangentToArc(arc, clockwise);
    if (tangentRay === null) {
      return null;
    }

    const tangentPerp = tangentRay.angle.perpendicular(clockwise);
    const radiusRay = arc.center.ray(tangentPerp);

    return tangentRay.segmentToIntersection(radiusRay);
  }


  /**
  * Returns a new `Arc` with center at `this` and the given arc properties.
  *
  * @param {Number} radius - The radius of the new `Arc`
  * @param {Rac.Angle|Number}
  *   [start=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The start `Angle` of the new `Arc`
  * @param {Rac.Angle|Number} [end=null] - The end `Angle` of the new
  *   `Arc`; when `null` or ommited, `start` is used instead
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(
    radius,
    start = this.rac.Angle.zero,
    end = null,
    clockwise = true)
  {
    start = this.rac.Angle.from(start);
    end = end === null
      ? start
      : this.rac.Angle.from(end);
    return new Rac.Arc(this.rac, this, radius, start, end, clockwise);
  }


  /**
  * Returns a new `Text` located at `this` with the given `string` and
  * `format`.
  *
  * @param {String} string - The string of the new `Text`
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format of the new `Text`
  * @returns {Rac.Text}
  */
  text(string, format = this.rac.Text.Format.topLeft) {
    return new Rac.Text(this.rac, this, string, format);
  }

} // class Point


module.exports = Point;


},{"../Rac":2,"../util/utils":42}],14:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Unbounded ray from a `[Point]{@link Rac.Point}` in direction of an
* `[Angle]{@link Rac.Angle}`.
*
* ### `instance.Ray`
*
* Instances of `Rac` contain a convenience
* [`rac.Ray` function]{@link Rac#Ray} to create `Ray` objects from
* primitive values. This function also contains ready-made convenience
* objects, like [`rac.Ray.xAxis`]{@link instance.Ray#xAxis}, listed under
* [`instance.Ray`]{@link instance.Ray}.
*
* @example
* let rac = new Rac()
* let point = rac.Point(55, 77)
* let angle = rac.Angle(1/4)
* // new instance with constructor
* let ray = new Rac.Ray(rac, point, angle)
* // or convenience function
* let otherRay = rac.Ray(55, 77, 1/4)
*
* @see [`rac.Ray`]{@link Rac#Ray}
* @see [`instance.Ray`]{@link instance.Ray}
*
* @alias Rac.Ray
*/
class Ray {

  /**
  * Creates a new `Ray` instance.
  * @param {Rac} rac Instance to use for drawing and creating other objects
  * @param {Rac.Point} start - A `Point` where the ray starts
  * @param {Rac.Angle} angle - An `Angle` the ray is directed to
  */
  constructor(rac, start, angle) {
    utils.assertExists(rac, start, angle);
    utils.assertType(Rac.Point, start);
    utils.assertType(Rac.Angle, angle);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The start point of the ray.
    * @type {Rac.Point}
    */
    this.start = start;

    /**
    * The angle towards which the ray extends.
    * @type {Rac.Angle}
    */
    this.angle = angle;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.start.x, digits);
    const yStr = utils.cutDigits(this.start.y, digits);
    const turnStr = utils.cutDigits(this.angle.turn, digits);
    return `Ray((${xStr},${yStr}) a:${turnStr})`;
  }


  /**
  * Returns `true` when `start` and `angle` in both rays are equal;
  * otherwise returns `false`.
  *
  * When `otherRay` is any class other that `Rac.Ray`, returns `false`.
  *
  * @param {Rac.Ray} otherRay - A `Ray` to compare
  * @returns {Boolean}
  * @see Rac.Point#equals
  * @see Rac.Angle#equals
  */
  equals(otherRay) {
    return otherRay instanceof Ray
      && this.start.equals(otherRay.start)
      && this.angle.equals(otherRay.angle);
  }


  /**
  * Returns the slope of the ray, or `null` if the ray is vertical.
  *
  * In the line formula `y = mx + b` the slope is `m`.
  *
  * @returns {?Number}
  */
  slope() {
    let isVertical =
         this.rac.unitaryEquals(this.angle.turn, this.rac.Angle.down.turn)
      || this.rac.unitaryEquals(this.angle.turn, this.rac.Angle.up.turn);
    if (isVertical) {
      return null;
    }

    return Math.tan(this.angle.radians());
  }


  /**
  * Returns the y-intercept: the point at which the ray, extended in both
  * directions, intercepts with the y-axis; or `null` if the ray is
  * vertical.
  *
  * In the line formula `y = mx + b` the y-intercept is `b`.
  *
  * @returns {?Number}
  */
  yIntercept() {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }
    // y = mx + b
    // y - mx = b
    return this.start.y - slope * this.start.x;
  }


  /**
  * Returns a new `Ray` with `start` set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newStart - The start for the new `Ray`
  * @returns {Rac.Ray}
  */
  withStart(newStart) {
    return new Ray(this.rac, newStart, this.angle);
  }


  /**
  * Returns a new `Ray` with `start.x` set to `newX`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} newX - The x coordinate for the new `Ray`
  * @returns {Rac.Ray}
  */
  withX(newX) {
    return new Ray(this.rac, this.start.withX(newX), this.angle);
  }


  /**
  * Returns a new `Ray` with `start.y` set to `newY`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} newY - The y coordinate for the new `Ray`
  * @returns {Rac.Ray}
  */
  withY(newY) {
    return new Ray(this.rac, this.start.withY(newY), this.angle);
  }


  /**
  * Returns a new `Ray` with `angle` set to `newAngle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} newAngle - The angle for the new `Ray`
  * @returns {Rac.Ray}
  */
  withAngle(newAngle) {
    newAngle = this.rac.Angle.from(newAngle);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Ray` with `angle` added to `this.angle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - The angle to add
  * @returns {Rac.Ray}
  */
  withAngleAdd(angle) {
    let newAngle = this.angle.add(angle);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Ray` with `angle` set to
  * `this.{@link Rac.Angle#shift angle.shift}(angle, clockwise)`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - The angle to be shifted by
  * @param {Boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Ray}
  */
  withAngleShift(angle, clockwise = true) {
    let newAngle = this.angle.shift(angle, clockwise);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Ray` pointing towards
  * `{@link Rac.Angle#inverse angle.inverse()}`.
  * @returns {Rac.Ray}
  */
  inverse() {
    const inverseAngle = this.angle.inverse();
    return new Ray(this.rac, this.start, inverseAngle);
  }


  /**
  * Returns a new `Ray` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `angle` in the `clockwise` orientation.
  *
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Ray}
  * @see Rac.Angle#perpendicular
  */
  perpendicular(clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return new Ray(this.rac, this.start, perpendicular);
  }


  /**
  * Returns a new `Ray` with `start` moved along the ray by the given
  * `distance`. All other properties are copied from `this`.
  *
  * When `distance` is negative, `start` is moved in
  * the inverse direction of `angle`.
  *
  * @param {Number} distance - The distance to move `start` by
  * @returns {Rac.Ray}
  */
  translateToDistance(distance) {
    const newStart = this.start.pointToAngle(this.angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }


  /**
  * Returns a new `Ray` with `start` moved towards `angle` by the given
  * `distance`. All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to move `start` towards
  * @param {Number} distance - The distance to move `start` by
  * @returns {Rac.Ray}
  */
  translateToAngle(angle, distance) {
    const newStart = this.start.pointToAngle(angle, distance);
    return new Ray(this.rac, newStart, this.angle);
  }


  /**
  * Returns a new `Ray` with `start` moved by the given distance toward the
  * `angle.perpendicular()`. All other properties are copied from `this`.
  *
  * @param {Number} distance - The distance to move `start` by
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Ray}
  */
  translatePerpendicular(distance, clockwise = true) {
    let perpendicular = this.angle.perpendicular(clockwise);
    return this.translateToAngle(perpendicular, distance);
  }


  /**
  * Returns the angle from `this.start` to `point`.
  *
  * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals}, returns `this.angle`.
  *
  * @param {Rac.Point} point - A `Point` to measure the angle to
  * @returns {Rac.Angle}
  * @see Rac.Point#equals
  */
  angleToPoint(point) {
    return this.start.angleToPoint(point, this.angle);
  }


  /**
  * Returns a new `Point` located in the ray where the x coordinate is `x`.
  * When the ray is vertical, returns `null` since no single point with x
  * coordinate at `x` is possible.
  *
  * The ray is considered a unbounded line.
  *
  * @param {Number} x - The x coordinate to calculate a point in the ray
  * @returns {Rac.Point}
  */
  pointAtX(x) {
    const slope = this.slope();
    if (slope === null) {
      // Vertical ray
      return null;
    }

    if (this.rac.unitaryEquals(slope, 0)) {
      // Horizontal ray
      return this.start.withX(x);
    }

    // y = mx + b
    const y = slope * x + this.yIntercept();
    return new Rac.Point(this.rac, x, y);
  }


  /**
  * Returns a new `Point` located in the ray where the y coordinate is `y`.
  * When the ray is horizontal, returns `null` since no single point with y
  * coordinate at `y` is possible.
  *
  * The ray is considered an unbounded line.
  *
  * @param {Number} y - The y coordinate to calculate a point in the ray
  * @returns {Rac.Point}
  */
  pointAtY(y) {
    const slope = this.slope();
    if (slope === null) {
      // Vertical ray
      return this.start.withY(y);
    }

    if (this.rac.unitaryEquals(slope, 0)) {
      // Horizontal ray
      return null;
    }

    // mx + b = y
    // x = (y - b)/m
    const x = (y - this.yIntercept()) / slope;
    return new Rac.Point(this.rac, x, y);
  }


  /**
  * Returns a new `Point` in the ray at the given `distance` from
  * `this.start`. When `distance` is negative, the new `Point` is calculated
  * in the inverse direction of `angle`.
  *
  * @param {Number} distance - The distance from `this.start`
  * @returns {Rac.Point}
  */
  pointAtDistance(distance) {
    return this.start.pointToAngle(this.angle, distance);
  }


  /**
  * Returns a new `Point` at the intersection of `this` and `otherRay`.
  *
  * When the rays are parallel, returns `null` since no intersection is
  * possible.
  *
  * Both rays are considered unbounded lines.
  *
  * @param {Rac.Ray} otherRay - A `Ray` to calculate the intersection with
  * @returns {Rac.Point}
  */
  pointAtIntersection(otherRay) {
    const a = this.slope();
    const b = otherRay.slope();
    // Parallel lines, no intersection
    if (a === null && b === null) { return null; }
    if (this.rac.unitaryEquals(a, b)) { return null; }

    // Any vertical ray
    if (a === null) { return otherRay.pointAtX(this.start.x); }
    if (b === null) { return this.pointAtX(otherRay.start.x); }

    const c = this.yIntercept();
    const d = otherRay.yIntercept();

    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const x = (d - c) / (a - b);
    const y = a * x + c;
    return new Rac.Point(this.rac, x, y);
  }


  /**
  * Returns a new `Point` at the projection of `point` onto the ray. The
  * projected point is the closest possible point to `point`.
  *
  * The ray is considered an unbounded line.
  *
  * @param {Rac.Point} point - A `Point` to project onto the ray
  * @returns {Rac.Point}
  */
  pointProjection(point) {
    const perpendicular = this.angle.perpendicular();
    return point.ray(perpendicular)
      .pointAtIntersection(this);
  }


  /**
  * Returns the distance from `this.start` to the projection of `point`
  * onto the ray.
  *
  * The returned distance is positive when the projected point is towards
  * the direction of the ray, and negative when it is behind.
  *
  * @param {Rac.Point} point - A `Point` to project and measure the
  * distance to
  * @returns {Number}
  */
  distanceToProjectedPoint(point) {
    const projected = this.pointProjection(point);
    const distance = this.start.distanceToPoint(projected);

    if (this.rac.equals(distance, 0)) {
      return 0;
    }

    const angleToProjected = this.start.angleToPoint(projected);
    const angleDiff = this.angle.subtract(angleToProjected);
    if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
      return distance;
    } else {
      return -distance;
    }
  }


  /**
  * Returns `true` when the angle to the given `point` is located clockwise
  * of the ray or `false` when located counter-clockwise.
  *
  * * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals} or `point` lands on the ray, it is
  * considered clockwise. When `point` lands on the
  * [inverse]{@link Rac.Ray#inverse} of the ray, it is considered
  * counter-clockwise.
  *
  * @param {Rac.Point} point - A `Point` to measure the orientation to
  * @returns {Boolean}
  *
  * @see Rac.Point#equals
  * @see Rac.Ray#inverse
  */
  pointOrientation(point) {
    const pointAngle = this.start.angleToPoint(point, this.angle);
    if (this.angle.equals(pointAngle)) {
      return true;
    }

    const angleDistance = pointAngle.subtract(this.angle);
    // [0 to 0.5) is considered clockwise
    // [0.5, 1) is considered counter-clockwise
    return angleDistance.turn < 0.5;
  }


  /**
  * Returns a new `Ray` from `this.start` to `point`.
  *
  * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Ray` will use `this.angle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Ray` towards
  * @returns {Rac.Ray}
  * @see Rac.Point#equals
  */
  rayToPoint(point) {
    let newAngle = this.start.angleToPoint(point, this.angle);
    return new Ray(this.rac, this.start, newAngle);
  }


  /**
  * Returns a new `Segment` using `this` and the given `length`.
  * @param {Number} length - The length of the new `Segment`
  * @returns {Rac.Segment}
  */
  segment(length) {
    return new Rac.Segment(this.rac, this, length);
  }


  /**
  * Returns a new `Segment` from `this.start` to `point`.
  *
  * When `this.start` and `point` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Segment` towards
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
  */
  segmentToPoint(point) {
    return this.start.segmentToPoint(point, this.angle);
  }


  /**
  * Returns a new `Segment` starting at `this.start` and ending at the
  * intersection of `this` and `otherRay`.
  *
  * When the rays are parallel, returns `null` since no intersection is
  * possible.
  *
  * When `this.start` and the intersection point are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle`.
  *
  * Both rays are considered unbounded lines.
  *
  * @param {Rac.Ray} otherRay - A `Ray` to calculate the intersection with
  * @returns {Rac.Segment}
  */
  segmentToIntersection(otherRay) {
    const intersection = this.pointAtIntersection(otherRay);
    if (intersection === null) {
      return null;
    }
    return this.segmentToPoint(intersection);
  }


  /**
  * Returns a new `Arc` with center at `this.start`, start at `this.angle`
  * and the given arc properties.
  *
  * @param {Number} radius - The radius of the new `Arc`
  * @param {?Rac.Angle|Number} [endAngle=null] - The end `Angle` of the new
  * `Arc`; when `null` or ommited, `this.angle` is used instead
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(radius, endAngle = null, clockwise = true) {
    endAngle = endAngle === null
      ? this.angle
      : this.rac.Angle.from(endAngle);
    return new Rac.Arc(this.rac,
      this.start, radius,
      this.angle, endAngle,
      clockwise);
  }


  /**
  * Returns a new `Arc` with center at `this.start`, start at `this.angle`,
  * and end at the given `angleDistance` from `this.start` in the
  * `clockwise` orientation.
  *
  * @param {Number} radius - The radius of the new `Arc`
  * @param {Rac.Angle|Number} angleDistance - The angle distance from
  * `this.start` to the new `Arc` end
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arcToAngleDistance(radius, angleDistance, clockwise = true) {
    let endAngle = this.angle.shift(angleDistance, clockwise);
    return new Rac.Arc(this.rac,
      this.start, radius,
      this.angle, endAngle,
      clockwise);
  }


  // TODO: Leaving undocumented for now, until better use/explanation is found
  // based on https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
  /* istanbul ignore next */
  bezierArc(otherRay) {
    if (this.start.equals(otherRay.start)) {
      // When both rays have the same start, returns a point bezier.
      return new Rac.Bezier(this.rac,
        this.start, this.start,
        this.start, this.start);
    }

    let intersection = this.perpendicular()
      .pointAtIntersection(otherRay.perpendicular());

    let orientation = null;
    let radiusA = null;
    let radiusB = null;

    // Check for parallel rays
    if (intersection !== null) {
      // Normal intersection case
      orientation = this.pointOrientation(intersection);
      radiusA = intersection.segmentToPoint(this.start);
      radiusB = intersection.segmentToPoint(otherRay.start);

    } else {
      // In case of parallel rays, otherRay gets shifted to be
      // perpendicular to this.
      let shiftedIntersection = this.perpendicular()
        .pointAtIntersection(otherRay);
      if (shiftedIntersection === null || this.start.equals(shiftedIntersection)) {
        // When both rays lay on top of each other, the shifting produces
        // rays with the same start; function returns a linear bezier.
        return new Rac.Bezier(this.rac,
          this.start, this.start,
          otherRay.start, otherRay.start);
      }
      intersection = this.start.pointAtBisector(shiftedIntersection);

      // Case for shifted intersection between two rays
      orientation = this.pointOrientation(intersection);
      radiusA = intersection.segmentToPoint(this.start);
      radiusB = radiusA.inverse();
    }

    const angleDistance = radiusA.angle().distance(radiusB.angle(), orientation);
    const quarterAngle = angleDistance.mult(1/4);
    // TODO: what happens with square angles? is this covered by intersection logic?
    const quarterTan = quarterAngle.tan();

    const tangentA = quarterTan * radiusA.length * 4/3;
    const anchorA = this.pointAtDistance(tangentA);

    const tangentB = quarterTan * radiusB.length * 4/3;
    const anchorB = otherRay.pointAtDistance(tangentB);

    return new Rac.Bezier(this.rac,
        this.start, anchorA,
        anchorB, otherRay.start);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` located at `start` and oriented towards `angle`
  * with the given `string` and `format`.
  *
  * When `format` is provided, the angle for the returned text will still
  * be set to `angle`.
  *
  * @param {String} string - The string of the new `Text`
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format of the new `Text`
  * @returns {Rac.Text}
  */
  text(string, format = this.rac.Text.Format.topLeft) {
    format = format.withAngle(this.angle);
    return new Rac.Text(this.rac, this.start, string, format);
  }


} // class Ray


module.exports = Ray;


},{"../Rac":2,"../util/utils":42}],15:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Segment of a `[Ray]{@link Rac.Ray}` with a given length.
*
* ### `instance.Segment`
*
* Instances of `Rac` contain a convenience
* [`rac.Segment` function]{@link Rac#Segment} to create `Segment` objects
* from primitive values. This function also contains ready-made convenience
* objects, like [`rac.Segment.zero`]{@link instance.Segment#zero}, listed
* under [`instance.Segment`]{@link instance.Segment}.
*
* @example
* let rac = new Rac()
* let ray = rac.Ray(55, 77, 1/4)
* // new instance with constructor
* let segment = new Rac.Segment(rac, ray, 100)
* // or convenience function
* let otherSegment = rac.Segment(55, 77, 1/4, 100)
*
* @see [`rac.Segment`]{@link Rac#Segment}
* @see [`instance.Segment`]{@link instance.Segment}
*
* @alias Rac.Segment
*/
class Segment {

  /**
  * Creates a new `Segment` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Ray} ray - A `Ray` the segment will be based of
  * @param {Number} length - The length of the segment
  */
  constructor(rac, ray, length) {
    // TODO: different approach to error throwing?
    // assert || throw new Error(err.missingParameters)
    // or
    // checker(msg => { throw Rac.Exception.failedAssert(msg));
    //   .exists(rac)
    //   .isType(Rac.Ray, ray)
    //   .isNumber(length)

    utils.assertExists(rac, ray, length);
    utils.assertType(Rac.Ray, ray);
    utils.assertNumber(length);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The `Ray` the segment is based of.
    * @type {Rac.Ray}
    */
    this.ray = ray;

    /**
    * The length of the segment.
    * @type {Number}
    */
    this.length = length;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.ray.start.x, digits);
    const yStr = utils.cutDigits(this.ray.start.y, digits);
    const turnStr = utils.cutDigits(this.ray.angle.turn, digits);
    const lengthStr = utils.cutDigits(this.length, digits);
    return `Segment((${xStr},${yStr}) a:${turnStr} l:${lengthStr})`;
  }


  /**
  * Returns `true` when `ray` and `length` in both segments are equal;
  * otherwise returns `false`.
  *
  * When `otherSegment` is any class other that `Rac.Segment`, returns `false`.
  *
  * Segments' `length` are compared using `{@link Rac#equals}`.
  *
  * @param {Rac.Segment} otherSegment - A `Segment` to compare
  * @returns {Boolean}
  *
  * @see [`ray.equals`]{@link Rac.Ray#equals}
  * @see [`rac.equals`]{@link Rac#equals}
  */
  equals(otherSegment) {
    return otherSegment instanceof Segment
      && this.ray.equals(otherSegment.ray)
      && this.rac.equals(this.length, otherSegment.length);
  }


  /**
  * Returns the `[angle]{@link Rac.Ray#angle}` of the segment's `ray`.
  * @returns {Rac.Angle}
  */
  angle() {
    return this.ray.angle;
  }


  /**
  * Returns the `[start]{@link Rac.Ray#start}` of the segment's `ray`.
  * @returns {Rac.Point}
  */
  startPoint() {
    return this.ray.start;
  }


  /**
  * Returns a new `Point` where the segment ends.
  * @returns {Rac.Point}
  */
  endPoint() {
    return this.ray.pointAtDistance(this.length);
  }


  /**
  * Returns a new `Segment` with angle set to `newAngle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} newAngle - The angle for the new `Segment`
  * @returns {Rac.Segment}
  */
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    const newRay = new Rac.Ray(this.rac, this.ray.start, newAngle);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `ray` set to `newRay`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Ray} newRay - The ray for the new `Segment`
  * @returns {Rac.Segment}
  */
  withRay(newRay) {
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with start point set to `newStart`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Point} newStartPoint - The start point for the new
  * `Segment`
  * @returns {Rac.Segment}
  */
  withStartPoint(newStartPoint) {
    const newRay = this.ray.withStart(newStartPoint);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `length` set to `newLength`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} newLength - The length for the new `Segment`
  * @returns {Rac.Segment}
  */
  withLength(newLength) {
    return new Segment(this.rac, this.ray, newLength);
  }


  /**
  * Returns a new `Segment` with `length` added to `this.length`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} length - The length to add
  * @returns {Rac.Segment}
  */
  withLengthAdd(length) {
    return new Segment(this.rac, this.ray, this.length + length);
  }


  /**
  * Returns a new `Segment` with `length` set to `this.length * ratio`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Segment}
  */
  withLengthRatio(ratio) {
    return new Segment(this.rac, this.ray, this.length * ratio);
  }


  /**
  * Returns a new `Segment` with `angle` added to `this.angle()`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - The angle to add
  * @returns {Rac.Segment}
  */
  withAngleAdd(angle) {
    const newRay = this.ray.withAngleAdd(angle);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `angle` set to
  * `this.ray.{@link Rac.Angle#shift angle.shift}(angle, clockwise)`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - The angle to be shifted by
  * @param {Boolean} [clockwise=true] - The orientation of the shift
  * @returns {Rac.Segment}
  */
  withAngleShift(angle, clockwise = true) {
    const newRay = this.ray.withAngleShift(angle, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved in the inverse
  * direction of the segment's ray by the given `distance`. The resulting
  * `Segment` will have the same `endPoint()` and `angle()` as `this`.
  *
  * Using a positive `distance` results in a longer segment, using a
  * negative `distance` results in a shorter one.
  *
  * @param {Number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  withStartExtension(distance) {
    const newRay = this.ray.translateToDistance(-distance);
    return new Segment(this.rac, newRay, this.length + distance);
  }


  /**
  * Returns a new `Segment` with `distance` added to `this.length`, which
  * results in `endPoint()` for the resulting `Segment` moving in the
  * direction of the segment's ray by the given `distance`.
  *
  * All other properties are copied from `this`.
  *
  * Using a positive `distance` results in a longer segment, using a
  * negative `distance` results in a shorter one.
  *
  * This method performs the same operation as
  * `[withLengthAdd]{@link Rac.Segment#withLengthAdd}`.
  *
  * @param {Number} distance - The distance to add to `length`
  * @returns {Rac.Segment}
  */
  withEndExtension(distance) {
    return this.withLengthAdd(distance);
  }


  /**
  * Returns a new `Segment` poiting towards the
  * [inverse angle]{@link Rac.Angle#inverse} of `this.angle()`.
  *
  * The resulting `Segment` will have the same `startPoint()` and `length`
  * as `this`.
  *
  * @returns {Rac.Segment}
  *
  * @see [`angle.inverse`]{@link Rac.Angle#inverse}
  */
  inverse() {
    const newRay = this.ray.inverse();
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `this.angle()` in the `clockwise` orientation.
  *
  * The resulting `Segment` will have the same `startPoint()` and `length`
  * as `this`.
  *
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  *
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  */
  perpendicular(clockwise = true) {
    const newRay = this.ray.perpendicular(clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with its start point set at
  * `[this.endPoint()]{@link Rac.Segment#endPoint}`,
  * angle set to `this.angle().[inverse()]{@link Rac.Angle#inverse}`, and
  * same length as `this`.
  *
  * @returns {Rac.Segment}
  * @see [`angle.inverse`]{@link Rac.Angle#inverse}
  */
  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved towards `angle` by
  * the given `distance`. All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to move the start point
    towards
  * @param {Number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  translateToAngle(angle, distance) {
    const newRay = this.ray.translateToAngle(angle, distance);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved along the segment's
  * ray by the given `length`. All other properties are copied from `this`.
  *
  * When `length` is negative, `start` is moved in the inverse direction of
  * `angle`.
  *
  * @param {Number} length - The length to move the start point by
  * @returns {Rac.Segment}
  */
  translateToLength(length) {
    const newRay = this.ray.translateToDistance(length);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point moved the given `distance`
  * towards the perpendicular angle to `this.angle()` in the `clockwise`
  * orientaton. All other properties are copied from `this`.
  *
  * @param {Number} distance - The distance to move the start point by
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  translatePerpendicular(distance, clockwise = true) {
    const newRay = this.ray.translatePerpendicular(distance, clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns the given `value` clamped to [startInset, length-endInset].
  *
  * When `startInset` is greater that `length-endInset` the range for the
  * clamp becomes imposible to fulfill. In this case the returned value
  * will be the centered between the range limits and still clampled to
  * `[0, length]`.
  *
  * @param {Number} value - A value to clamp
  * @param {Number} [startInset=0] - The inset for the lower limit of the
  * clamping range
  * @param {endInset} [endInset=0] - The inset for the higher limit of the
  * clamping range
  * @returns {Number}
  */
  clampToLength(value, startInset = 0, endInset = 0) {
    const endLimit = this.length - endInset;
    if (startInset >= endLimit) {
      // imposible range, return middle point
      const rangeMiddle = (startInset - endLimit) / 2;
      const middle = startInset - rangeMiddle;
      // Still clamp to the segment itself
      let clamped = middle;
      clamped = Math.min(clamped, this.length);
      clamped = Math.max(clamped, 0);
      return clamped;
    }
    let clamped = value;
    clamped = Math.min(clamped, this.length - endInset);
    clamped = Math.max(clamped, startInset);
    return clamped;
  }


  /**
  * Returns a new `Point` in the segment's ray at the given `length` from
  * `this.startPoint()`. When `length` is negative, the new `Point` is
  * calculated in the inverse direction of `this.angle()`.
  *
  * @param {Number} length - The distance from `this.startPoint()`
  * @returns {Rac.Point}
  *
  * @see [`ray.pointAtDistance`]{@link Rac.Ray#pointAtDistance}
  */
  pointAtLength(length) {
    return this.ray.pointAtDistance(length);
  }


  /**
  * Returns a new `Point` in the segment's ray at a distance of
  * `this.length * ratio` from `this.startPoint()`. When `ratio` is
  * negative, the new `Point` is calculated in the inverse direction of
  * `this.angle()`.
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Point}
  *
  * @see [`ray.pointAtDistance`]{@link Rac.Ray#pointAtDistance}
  */
  pointAtLengthRatio(ratio) {
    return this.ray.pointAtDistance(this.length * ratio);
  }


  /**
  * Returns a new `Point` at the middle point the segment.
  * @returns {Rac.Point}
  */
  pointAtBisector() {
    return this.ray.pointAtDistance(this.length/2);
  }


  /**
  * Returns a new `Segment` starting at `newStartPoint` and ending at
  * `this.endPoint()`.
  *
  * When `newStartPoint` and `this.endPoint()` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle()`.
  *
  * @param {Rac.Point} newStartPoint - The start point of the new `Segment`
  * @returns {Rac.Segment}
  *
  * @see [`rac.equals`]{@link Rac.Point#equals}
  */
  moveStartPoint(newStartPoint) {
    const endPoint = this.endPoint();
    return newStartPoint.segmentToPoint(endPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting at `this.startPoint()` and ending at
  * `newEndPoint`.
  *
  * When `this.startPoint()` and `newEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle()`.
  *
  * @param {Rac.Point} newEndPoint - The end point of the new `Segment`
  * @returns {Rac.Segment}
  *
  * @see [`rac.equals`]{@link Rac.Point#equals}
  */
  moveEndPoint(newEndPoint) {
    return this.ray.segmentToPoint(newEndPoint);
  }


  /**
  * Returns a new `Segment` from the starting point to the segment's middle
  * point.
  *
  * @returns {Rac.Segment}
  * @see [`pointAtBisector`]{@link Rac.Segment#pointAtBisector}
  */
  segmentToBisector() {
    return new Segment(this.rac, this.ray, this.length/2);
  }


  /**
  * Returns a new `Segment` from the segment's middle point towards the
  * perpendicular angle in the `clockwise` orientation.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * @param {?Number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  * @see [`pointAtBisector`]{@link Rac.Segment#pointAtBisector}
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  */
  segmentBisector(length = null, clockwise = true) {
    const newStart = this.pointAtBisector();
    const newAngle = this.ray.angle.perpendicular(clockwise);
    const newRay = new Rac.Ray(this.rac, newStart, newAngle);
    const newLength = length === null
      ? this.length
      : length;
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` with the given
  * `length` and the same angle as `this`.
  *
  * @param {Number} length - The length of the next `Segment`
  * @returns {Rac.Segment}
  */
  nextSegmentWithLength(length) {
    const newStart = this.endPoint();
    const newRay = this.ray.withStart(newStart);
    return new Segment(this.rac, newRay, length);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and up to the given
  * `nextEndPoint`.
  *
  * When `endPoint()` and `nextEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the new `Segment` will use
  * `this.angle()`.
  *
  * @param {Rac.Point} nextEndPoint - The end point of the next `Segment`
  * @returns {Rac.Segment}
  * @see [`rac.equals`]{@link Rac.Point#equals}
  */
  nextSegmentToPoint(nextEndPoint) {
    const newStart = this.endPoint();
    return newStart.segmentToPoint(nextEndPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards `angle`
  * with the given `length`.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * @param {Rac.Angle|Number} angle - The angle of the new `Segment`
  * @param {?Number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  */
  nextSegmentToAngle(angle, length = null) {
    angle = Rac.Angle.from(this.rac, angle);
    const newLength = length === null
      ? this.length
      : length;
    const newStart = this.endPoint();
    const newRay = new Rac.Ray(this.rac, newStart, angle);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards the given
  * `angleDistance` from `this.angle().inverse()` in the `clockwise`
  * orientation.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * Notice that the `angleDistance` is applied to the inverse of the
  * segment's angle. E.g. with an `angleDistance` of `0` the resulting
  * `Segment` will be directly over and pointing in the inverse angle of
  * `this`. As the `angleDistance` increases the two segments separate with
  * the pivot at `endPoint()`.
  *
  * @param {Rac.Angle|Number} angleDistance - An angle distance to apply to
  * the segment's angle inverse
  * @param {Boolean} [clockwise=true] - The orientation of the angle shift
  * from `endPoint()`
  * @param {?Number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  * @see [`angle.inverse`]{@link Rac.Angle#inverse}
  */
  nextSegmentToAngleDistance(angleDistance, clockwise = true, length = null) {
    angleDistance = this.rac.Angle.from(angleDistance);
    const newLength = length === null ? this.length : length;
    const newRay = this.ray
      .translateToDistance(this.length)
      .inverse()
      .withAngleShift(angleDistance, clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards the
  * `[perpendicular angle]{@link Rac.Angle#perpendicular}` of
  * `this.angle().inverse()` in the `clockwise` orientation.
  *
  * The new `Segment` will have the given `length`, or when ommited or
  * `null` will use `this.length` instead.
  *
  * Notice that the perpendicular is calculated from the inverse of the
  * segment's angle. E.g. with `clockwise` as `true`, the resulting
  * `Segment` will be pointing towards `this.angle().perpendicular(false)`.
  *
  * @param {Boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @param {?Number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  */
  nextSegmentPerpendicular(clockwise = true, length = null) {
    const newLength = length === null
      ? this.length
      : length;
    const newRay = this.ray
      .translateToDistance(this.length)
      .perpendicular(!clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` which corresponds
  * to the leg of a right triangle where `this` is the other cathetus and
  * the hypotenuse is of length `hypotenuse`.
  *
  * The new `Segment` will point towards the perpendicular angle of
  * `[this.angle().[inverse()]{@link Rac.Angle#inverse}` in the `clockwise`
  * orientation.
  *
  * When `hypotenuse` is smaller that the segment's `length`, returns
  * `null` since no right triangle is possible.
  *
  * @param {Number} hypotenuse - The length of the hypotenuse side of the
  * right triangle formed with `this` and the new `Segment`
  * @param {Boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @returns {Rac.Segment}
  * @see [`angle.inverse`]{@link Rac.Angle#inverse}
  */
  nextSegmentLegWithHyp(hypotenuse, clockwise = true) {
    if (hypotenuse < this.length) {
      return null;
    }

    // cos = ady / hyp
    const radians = Math.acos(this.length / hypotenuse);
    // tan = ops / adj
    // tan * adj = ops
    const ops = Math.tan(radians) * this.length;
    return this.nextSegmentPerpendicular(clockwise, ops);
  }


  /**
  * Returns a new `Arc` based on this segment, with the given `endAngle`
  * and `clockwise` orientation.
  *
  * The returned `Arc` will use this segment's start as `center`, its angle
  * as `start`, and its length as `radius`.
  *
  * When `endAngle` is ommited or `null`, the segment's angle is used
  * instead resulting in a complete-circle arc.
  *
  * @param {?Rac.Angle} [endAngle=null] - An `Angle` to use as end for the
  * new `Arc`, or `null` to use `this.angle()`
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arc(endAngle = null, clockwise = true) {
    endAngle = endAngle === null
      ? this.ray.angle
      : Rac.Angle.from(this.rac, endAngle);
    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      this.ray.angle, endAngle,
      clockwise);
  }


  /**
  * Returns a new `Arc` based on this segment, with the arc's end at
  * `angleDistance` from the segment's angle in the `clockwise`
  * orientation.
  *
  * The returned `Arc` will use this segment's start as `center`, its angle
  * as `start`, and its length as `radius`.
  *
  * @param {Rac.Angle|Number} angleDistance - The angle distance from the
  * segment's start to the new `Arc` end
  * @param {Boolean} [clockwise=true] - The orientation of the new `Arc`
  * @returns {Rac.Arc}
  */
  arcWithAngleDistance(angleDistance, clockwise = true) {
    angleDistance = this.rac.Angle.from(angleDistance);
    const stargAngle = this.ray.angle;
    const endAngle = stargAngle.shift(angleDistance, clockwise);

    return new Rac.Arc(this.rac,
      this.ray.start, this.length,
      stargAngle, endAngle,
      clockwise);
  }


  // TODO: uncomment once beziers are tested again
  // bezierCentralAnchor(distance, clockwise = true) {
  //   let bisector = this.segmentBisector(distance, clockwise);
  //   return new Rac.Bezier(this.rac,
  //     this.start, bisector.end,
  //     bisector.end, this.end);
  // }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` located at `start` and oriented towards `ray.angle`
  * with the given `string` and `format`.
  *
  * When `format` is provided, the angle for the returned text will still
  * be set to `ray.angle`.
  *
  * @param {String} string - The string of the new `Text`
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format of the new `Text`
  * @returns {Rac.Text}
  */
  text(string, format = this.rac.Text.Format.topLeft) {
    format = format.withAngle(this.ray.angle);
    return new Rac.Text(this.rac, this.ray.start, string, format);
  }


} // Segment


module.exports = Segment;


},{"../Rac":2,"../util/utils":42}],16:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Contains two `[Composite]{@link Rac.Composite}` objects: `outline` and
* `contour`.
*
* Used by `[P5Drawer]{@link Rac.P5Drawer}` to draw the composites as a
* complex shape (`outline`) with an negative space shape inside (`contour`).
*
* ⚠️ The API for Shape is **planned to change** in a future release. ⚠️
*
* @class
* @alias Rac.Shape
*/
function Shape(rac) {
  utils.assertExists(rac);

  this.rac = rac;
  this.outline = new Rac.Composite(rac);
  this.contour = new Rac.Composite(rac);
}


module.exports = Shape;


Shape.prototype.addOutline = function(element) {
  this.outline.add(element);
};

Shape.prototype.addContour = function(element) {
  this.contour.add(element);
};


},{"../Rac":2,"../util/utils":42}],17:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Determines the alignment, angle, font, size, and padding for drawing a
* [`Text`]{@link Rac.Text} object.
*
* ### `instance.Text.Format`
*
* Instances of `Rac` contain a convenience
* [`rac.Text.Format` function]{@link Rac#TextFormat} to create
* `Text.Format` objects from primitive values. This function also contains
* ready-made convenience objects, like
* [`rac.Text.Format.topLeft`]{@link instance.Text.Format#topLeft}, listed
* under [`instance.Text.Format`]{@link instance.Text.Format}.
*
* @example
* let rac = new Rac()
* let angle = rac.Angle(1/8)
* // new instance with constructor
* let format = new Rac.Text.Format(rac, 'left', 'baseline', angle)
* // or convenience function
* let otherFormat = rac.Text.Format('left', 'baseline', 1/8)
*
* @see [`rac.Text.Format`]{@link Rac#TextFormat}
* @see [`instance.Text.Format`]{@link instance.Text.Format}
*
* @alias Rac.Text.Format
*/
class TextFormat {

  /**
  * Supported values for [`hAlign`]{@link Rac.Text.Format#hAlign} which
  * dermines the left-to-right alignment of the drawn `Text` in relation
  * to its [`text.point`]{@link Rac.Text#point}.
  *
  * @property {String} left
  *   aligns `text.point` at the left edge of the drawn text
  * @property {String} center
  *   aligns `text.point` at the center, from side to side, of the drawn text
  * @property {String} right
  *   aligns `text.point` at the right edge of the drawn text
  *
  * @type {Object}
  * @memberof Rac.Text.Format
  */
  static horizontalAlign = {
    left:   "left",
    center: "horizontalCenter",
    right:  "right"
  };

  /**
  * Supported values for [`vAlign`]{@link Rac.Text.Format#vAlign} which
  * dermines the top-to-bottom alignment of the drawn `Text` in relation
  * to its [`text.point`]{@link Rac.Text#point}.
  *
  * @property {String} top
  *   aligns `text.point` at the top edge of the drawn text
  * @property {String} center
  *   aligns `text.point` at the center, from top to bottom, of the drawn text
  * @property {String} baseline
  *   aligns `text.point` at the baseline of the drawn text
  * @property {String} bottom
  *   aligns `text.point` at the bottom edge of the drawn text
  *
  * @type {Object}
  * @memberof Rac.Text.Format
  */
  static verticalAlign = {
    top:      "top",
    center:   "verticalCenter",
    baseline: "baseline",
    bottom:   "bottom"
  };


  /**
  * Creates a new `Text.Format` instance.
  *
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {String} hAlign
  *   The horizontal alignment, left-to-right; one of the values from
  *   [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {String} vAlign
  *   The vertical alignment, top-to-bottom; one of the values from
  *   [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {String} [font=null]
  *   The font name
  * @param {Number} [size=null]
  *   The font size
  * @param {Number} [hPadding=0]
  *   The horizontal padding, left-to-right
  * @param {Number} [vPadding=0]
  *   The vertical padding, top-to-bottom
  */
  constructor(
    rac,
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null,
    hPadding = 0,
    vPadding = 0)
  {
    utils.assertType(Rac, rac);
    utils.assertString(hAlign, vAlign);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);
    utils.assertNumber(hPadding, vPadding);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The horizontal alignment, left-to-right, to position a `Text`
    * relative to its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign} object.
    *
    * @type {String}
    */
    this.hAlign = hAlign;

    /**
    * The vertical alignment, top-to-bottom, to position a `Text` relative
    * to its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`verticalAlign`]{@link Rac.Text.Format.verticalAlign} object.
    *
    * @type {String}
    */
    this.vAlign = vAlign;

    /**
    * The angle towards which the text is drawn.
    *
    * An angle of [`zero`]{@link instance.Angle#zero} wil draw the text
    * towards the right of the screen.
    *
    * @type {Rac.Angle}
    */
    this.angle = angle;

    /**
    * The font name of the text to draw.
    *
    * When set to `null` the font defined in
    * [`rac.textFormatDefaults.font`]{@link Rac#textFormatDefaults} is
    * used instead upon drawing.
    *
    * @type {?String}
    */
    this.font = font;

    /**
    * The font size of the text to draw.
    *
    * When set to `null` the size defined in
    * [`rac.textFormatDefaults.size`]{@link Rac#textFormatDefaults} is
    * used instead upon drawing.
    *
    * @type {?Number}
    */
    this.size = size;

    /**
    * The horizontal padding, left-to-right, to distance a `Text`
    * relative to its [`point`]{@link Rac.Text#point}.
    *
    * @type {Number}
    */
    this.hPadding = hPadding;

    /**
    * The vertical padding, top-to-bottom, to distance a `Text` relative
    * to its [`point`]{@link Rac.Text#point}.
    * @type {String}
    */
    this.vPadding = vPadding;
  } // constructor


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * // returns: 'Text.Format(ha:left va:top a:0.5 f:"sans" s:14)'
  * rac.Text.Format('left', 'top', 0.5, 'sans', 14)).toString()
  *
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const angleStr = utils.cutDigits(this.angle.turn, digits);
    const sizeStr = this.size === null
      ? 'null'
      : utils.cutDigits(this.size, digits);
    const fontStr = this.font === null
      ? 'null'
      : `"${this.font}"`;
    const paddingStr =
      `(${utils.cutDigits(this.hPadding, digits)},${utils.cutDigits(this.vPadding, digits)})`
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${fontStr} s:${sizeStr} p:${paddingStr})`;
  }


  /**
  * Returns `true` when all members, except `rac`, of both formats are
  * equal, otherwise returns `false`.
  *
  * When `otherFormat` is any class other that `Rac.Text.Format`, returns
  * `false`.
  *
  * @param {Rac.Text.Format} otherFormat - A `Text.Format` to compare
  * @returns {Boolean}
  * @see [`angle.equals`]{@link Rac.Angle#equals}
  */
  equals(otherFormat) {
    return otherFormat instanceof TextFormat
      && this.hAlign   === otherFormat.hAlign
      && this.vAlign   === otherFormat.vAlign
      && this.font     === otherFormat.font
      && this.size     === otherFormat.size
      && this.hPadding === otherFormat.hPadding
      && this.vPadding === otherFormat.vPadding
      && this.angle.equals(otherFormat.angle);
  }


  /**
  * Returns a new `Text.Format` with `angle` set to the `Angle` derived
  * from `newAngle`.
  * @param {Rac.Angle|Number} newAngle - The angle for the new `Text.Format`
  * @returns {Rac.Text.Format}
  */
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      newAngle,
      this.font, this.size,
      this.hPadding, this.vPadding);
  }


  /**
  * Returns a new `Text.Format` with `font` set to `newFont`.
  * @param {?String} newFont - The font name for the new `Text.Format`;
  *   can be set to `null`.
  * @returns {Rac.Text.Format}
  */
  withFont(newFont) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      newFont, this.size,
      this.hPadding, this.vPadding);
  }


  /**
  * Returns a new `Text.Format` with `size` set to `newSize`.
  * @param {?Number} newSize - The font size for the new `Text.Format`;
  *   can be set to `null`.
  * @returns {Rac.Text.Format}
  */
  withSize(newSize) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      this.font, newSize,
      this.hPadding, this.vPadding);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text.Format` with paddings set to the given values.
  *
  * @param {Number} hPadding - The horizontal padding for the new `Text.Format`
  * @param {Number} vPadding - The vertical padding for the new `Text.Format`
  *
  * @returns {Rac.Text.Format}
  */
  withPaddings(hPadding, vPadding) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle, this.font, this.size,
      hPadding, vPadding);
  }


  /**
  * Returns a new `Text.Format` that formats a text reversed, upside-down,
  * generally in the same position as `this`.
  *
  * The returned format will be oriented towards the
  * [inverse]{@link Rac.Angle#inverse} of `angle`; alignments for `left`
  * becomes `right` and viceversa; `top` becomes `bottom` and viceversa;
  * `center` and `baseline` remain the same.
  *
  * @returns {Rac.Text.Format}
  */
  reverse() {
    let hEnum = TextFormat.horizontalAlign;
    let vEnum = TextFormat.verticalAlign;
    let hAlign, vAlign;
    switch (this.hAlign) {
      case hEnum.left:  hAlign = hEnum.right; break;
      case hEnum.right: hAlign = hEnum.left; break;
      default:          hAlign = this.hAlign; break;
    }
    switch (this.vAlign) {
      case vEnum.top:    vAlign = vEnum.bottom; break;
      case vEnum.bottom: vAlign = vEnum.top; break;
      default:           vAlign = this.vAlign; break;
    }

    return new TextFormat(
      this.rac,
      hAlign, vAlign,
      this.angle.inverse(),
      this.font, this.size,
      this.hPadding, this.vPadding);
  }

} // class TextFormat


module.exports = TextFormat;


},{"../Rac":2,"../util/utils":42}],18:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


const TextFormat = require('./Text.Format')

// Not used, Seems like uglify minification needs a reference here;
// otherwise TextFormat is not correctly required.
var minifyHelper = TextFormat

/**
* String, position and [format]{@link Rac.Text.Format} to draw a text.
*
* An instance of this object contains the string and a `Point` used to
* determine the location of the drawn text. The
* [`Text.Format`]{@link Rac.Text.Format} object determines the font, size,
* orientation angle, and the alignment relative to
* [`point`]{@link Rac.Text#point} to draw the text.
*
* ### `instance.Text`
*
* Instances of `Rac` contain a convenience
* [`rac.Text` function]{@link Rac#Text} to create `Text` objects with fewer
* parameters. This function also contains ready-made convenience
* objects, like [`rac.Text.hello`]{@link instance.Text#hello}, listed under
* [`instance.Text`]{@link instance.Text}.
*
* @example
* let rac = new Rac()
* let point = rac.Point(55, 77)
* let format = rac.Text.Format('left', 'baseline')
* // new instance with constructor
* let text = new Rac.Text(rac, point, 'black quartz', format)
* // or convenience function
* let otherText = rac.Text(55, 77, 'black quartz', format)
*
* @see [`rac.Text`]{@link Rac#Text}
* @see [`instance.Text`]{@link instance.Text}
*
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

  /**
  * Creates a new `Text` instance.
  *
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {Rac.Point} point
  *   The location for the drawn text
  * @param {String} string
  *   The string to draw
  * @param {Rac.Text.Format} format
  *   The format for the drawn text
  */
  constructor(rac, point, string, format) {
    utils.assertType(Rac, rac);
    utils.assertType(Rac.Point, point);
    utils.assertString(string);
    utils.assertType(Text.Format, format);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The location where the text will be drawn.
    *
    * The text will be drawn relative to this point based on the
    * alignment and angle configuration of
    * [`format`]{@link Rac.Text#format}.
    *
    * @type {Rac.Point}
    */
    this.point = point;

    /**
    * The string to draw.
    * @type {String}
    */
    this.string = string;

    /**
    * The alignment, angle, font, and size to use to draw the text.
    * @type {Rac.Text.Format}
    */
    this.format = format;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * // returns 'Text((55,77) "sphinx of black quartz")'
  * rac.Text(55, 77, 'sphinx of black quartz').toString()
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.point.x, digits);
    const yStr = utils.cutDigits(this.point.y, digits);
    return `Text((${xStr},${yStr}) "${this.string}")`;
  }


  /**
  * Returns `true` when the `string` and `point` of both texts are equal;
  * otherwise returns `false`.
  *
  * When `otherText` is any class other that `Rac.Text`, returns `false`.
  *
  * `point`s are compared using [`point.equals`]{@link Rac.Point#equals}.
  *
  * The `format` objects are ignored in this comparison.
  *
  * @param {Rac.Text} otherText - A `Text` to compare
  * @returns {Boolean}
  * @see [`point.equals`]{@link Rac.Point#equals}
  */
  equals(otherText) {
    return otherText instanceof Text
      && this.string === otherText.string
      && this.point.equals(otherText.point);
  }


  /**
  * Returns a new `Text` and `Format` with `format.angle` set to the
  * `Angle` derived from `newAngle`.
  * @param {Rac.Angle|Number} newAngle - The angle for the new `Text` and
  *   `Text.Format`
  * @returns {Rac.Text}
  */
  withAngle(newAngle) {
    const newFormat = this.format.withAngle(newAngle);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  /**
  * Returns a new `Text` and `Format` with `format.font` set to `newFont`.
  * @param {?String} newFont - The font name for the new `Text` and
  *   `Text.Format`; can be set to `null`.
  * @returns {Rac.Text}
  */
  withFont(newFont) {
    const newFormat = this.format.withFont(newFont);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  /**
  * Returns a new `Text` and `Format` with `format.size` set to `newSize`.
  * @param {?Number} newSize - The font size for the new `Text` and
  *   `Text.Format`; can be set to `null`.
  * @returns {Rac.Text}
  */
  withSize(newSize) {
    const newFormat = this.format.withSize(newSize);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` and `Format` with paddings set to the given values.
  *
  * @param {Number} hPadding - The horizontal padding for the new `Text`
  *   and `Text.Format`
  * @param {Number} vPadding - The vertical padding for the new `Text` and
  *   `Text.Format`
  *
  * @returns {Rac.Text.Format}
  */
  withPaddings(hPadding, vPadding) {
    const newFormat = this.format.withPaddings(hPadding, vPadding);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` which is an upside-down equivalent of `this`
  * and generally in the same location.
  *
  * The returned text is at the same location as `this`, using a
  * [reversed]{@link Rac.Text.Format#reverse} format and oriented
  * towards the [inverse]{@link Rac.Angle#inverse} of `format.angle`.
  *
  * @returns {Rac.Text}
  */
  reverse() {
    let reverseFormat = this.format.reverse();
    return new Text(this.rac, this.point, this.string, reverseFormat);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns `this` or a new `Text` and `Format` that will always be
  * oriented to be upright and readable.
  *
  * Returns `this` when [`format.angle`]{@link Rac.Text.Format#angle} turn
  * value is between _[3/4, 1/4)_, since `this` is an upright text already;
  * otheriwse [`this.reverse()`]}{@link Rac.Text#reverse} is returned.
  *
  * @returns {Rac.Text}
  */
  upright() {
    if (utils.isUprightText(this.format.angle.turn)) {
      return this;
    } else {
      return this.reverse();
    }
  }


} // class Text


module.exports = Text;


},{"../Rac":2,"../util/utils":42,"./Text.Format":17}],19:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* Members and methods attached to the
* [`rac.Angle` function]{@link Rac#Angle}.
*
* The function contains ready-made convenience
* [`Angle`]{@link Rac.Angle} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Angle.quarter // ready-made quarter angle
* rac.Angle.quarter.rac === rac // true
*
* @namespace instance.Angle
*/
module.exports = function attachRacAngle(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Angle` is attached in `attachInstanceFunctions.js`.

  /**
  * Returns an `Angle` derived from `something`.
  *
  * Calls`{@link Rac.Angle.from}` using `this`.
  *
  * @see Rac.Angle.from
  *
  * @param {number|Rac.Angle|Rac.Ray|Rac.Segment} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  *
  * @function from
  * @memberof instance.Angle#
  */
  rac.Angle.from = function(something) {
    return Rac.Angle.from(rac, something);
  };


  /**
  * Returns an `Angle` derived from `radians`.
  *
  * Calls `{@link Rac.Angle.fromRadians}` using `this`.
  *
  * @see Rac.Angle.fromRadians
  *
  * @param {Number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  *
  * @function fromRadians
  * @memberof instance.Angle#
  */
  rac.Angle.fromRadians = function(radians) {
    return Rac.Angle.fromRadians(rac, radians);
  };


  /**
  * Returns an `Angle` derived from `degrees`.
  *
  * Calls `{@link Rac.Angle.fromDegrees}` using `this`.
  *
  * @see Rac.Angle.fromDegrees
  *
  * @param {Number} degrees - The measure of the angle, in degrees
  * @returns {Rac.Angle}
  *
  * @function fromDegrees
  * @memberof instance.Angle#
  */
  rac.Angle.fromDegrees = function(degrees) {
    return Rac.Angle.fromDegrees(rac, degrees);
  };


  /**
  * An `Angle` with turn `0`.
  *
  * Also available as: `right`, `r`, `east`, `e`.
  *
  * @name zero
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.zero = rac.Angle(0.0);

  /**
  * An `Angle` with turn `1/2`.
  *
  * Also available as: `left`, `l`, `west`, `w`, `inverse`.
  *
  * @name half
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.half = rac.Angle(1/2);
  rac.Angle.inverse = rac.Angle.half;

  /**
  * An `Angle` with turn `1/4`.
  *
  * Also available as: `down`, `d`, `bottom`, `b`, `south`, `s`, `square`.
  *
  * @name quarter
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.quarter = rac.Angle(1/4);
  rac.Angle.square =  rac.Angle.quarter;

  /**
  * An `Angle` with turn `1/8`.
  *
  * Also available as: `bottomRight`, `br`, `se`.
  *
  * @name eighth
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.eighth =  rac.Angle(1/8);

  /**
  * An `Angle` with turn `7/8`, negative angle of
  * [`eighth`]{@link instance.Angle#eighth}.
  *
  * Also available as: `topRight`, `tr`, `ne`.
  *
  * @name neighth
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.neighth =  rac.Angle(-1/8);


  /**
  * An `Angle` with turn `1/16`.
  *
  * @name sixteenth
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.sixteenth = rac.Angle(1/16);

  /**
  * An `Angle` with turn `3/4`.
  *
  * Also available as: `up`, `u`, `top`, `t`.
  *
  * @name north
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.north = rac.Angle(3/4);
  rac.Angle.east  = rac.Angle(0/4);
  rac.Angle.south = rac.Angle(1/4);
  rac.Angle.west  = rac.Angle(2/4);

  rac.Angle.e = rac.Angle.east;
  rac.Angle.s = rac.Angle.south;
  rac.Angle.w = rac.Angle.west;
  rac.Angle.n = rac.Angle.north;

  rac.Angle.ne = rac.Angle.n.add(1/8);
  rac.Angle.se = rac.Angle.e.add(1/8);
  rac.Angle.sw = rac.Angle.s.add(1/8);
  rac.Angle.nw = rac.Angle.w.add(1/8);

  // North north-east
  rac.Angle.nne = rac.Angle.ne.add(-1/16);
  // East north-east
  rac.Angle.ene = rac.Angle.ne.add(+1/16);
  // North-east north
  rac.Angle.nen = rac.Angle.nne;
  // North-east east
  rac.Angle.nee = rac.Angle.ene;

  // East south-east
  rac.Angle.ese = rac.Angle.se.add(-1/16);
  // South south-east
  rac.Angle.sse = rac.Angle.se.add(+1/16);
  // South-east east
  rac.Angle.see = rac.Angle.ese;
  // South-east south
  rac.Angle.ses = rac.Angle.sse;

  // South south-west
  rac.Angle.ssw = rac.Angle.sw.add(-1/16);
  // West south-west
  rac.Angle.wsw = rac.Angle.sw.add(+1/16);
  // South-west south
  rac.Angle.sws = rac.Angle.ssw;
  // South-west west
  rac.Angle.sww = rac.Angle.wsw;

  // West north-west
  rac.Angle.wnw = rac.Angle.nw.add(-1/16);
  // North north-west
  rac.Angle.nnw = rac.Angle.nw.add(+1/16);
  // Nort-hwest west
  rac.Angle.nww = rac.Angle.wnw;
  // North-west north
  rac.Angle.nwn = rac.Angle.nnw;

  rac.Angle.right = rac.Angle.e;
  rac.Angle.down  = rac.Angle.s;
  rac.Angle.left  = rac.Angle.w;
  rac.Angle.up    = rac.Angle.n;

  rac.Angle.r = rac.Angle.right;
  rac.Angle.d = rac.Angle.down;
  rac.Angle.l = rac.Angle.left;
  rac.Angle.u = rac.Angle.up;

  rac.Angle.top    = rac.Angle.up;
  rac.Angle.bottom = rac.Angle.down;
  rac.Angle.t      = rac.Angle.top;
  rac.Angle.b      = rac.Angle.bottom;

  rac.Angle.topRight    = rac.Angle.ne;
  rac.Angle.tr          = rac.Angle.ne;
  rac.Angle.topLeft     = rac.Angle.nw;
  rac.Angle.tl          = rac.Angle.nw;
  rac.Angle.bottomRight = rac.Angle.se;
  rac.Angle.br          = rac.Angle.se;
  rac.Angle.bottomLeft  = rac.Angle.sw;
  rac.Angle.bl          = rac.Angle.sw;

} // attachRacAngle


},{"../Rac":2}],20:[function(require,module,exports){
'use strict';


/**
* Members and methods attached to the
* [`rac.Arc` function]{@link Rac#Arc}.
*
* The function contains ready-made convenience
* [`Arc` objects]{@link Rac.Arc} for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Arc.zero // ready-made zero arc
* rac.Arc.zero.rac === rac // true
*
* @namespace instance.Arc
*/
module.exports = function attachRacArc(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Arc` is attached in `attachInstanceFunctions.js`.

  /**
  * A clockwise `Arc` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Arc}
  * @memberof instance.Arc#
  */
  rac.Arc.zero = rac.Arc(0, 0, 0, 0, 0, true);

} // attachRacArc


},{}],21:[function(require,module,exports){
'use strict';


/**
* The `instance.Bezier` function contains convenience methods and members
* for `{@link Rac.Bezier}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Bezier
*/
module.exports = function attachInstanceBezier(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Bezier` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Bezier` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Bezier}
  * @memberof instance.Bezier#
  */
  rac.Bezier.zero = rac.Bezier(
    0, 0, 0, 0,
    0, 0, 0, 0);

} // attachInstanceBezier


},{}],22:[function(require,module,exports){
'use strict';


/**
* Members and methods attached to the
* [`rac.Point` function]{@link Rac#Point}.
*
* The function contains ready-made convenience
* [`Point`]{@link Rac.Point} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Point.origin // ready-made origin point
* rac.Point.origin.rac === rac // true
*
* @namespace instance.Point
*/
module.exports = function attachRacPoint(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Point` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Point` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.zero = rac.Point(0, 0);

  /**
  * A `Point` at `(0, 0)`.
  *
  * Equal to [`rac.Point.zero`]{@link instance.Point#zero}.
  *
  * @name origin
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.origin = rac.Point.zero;


} // attachRacPoint


},{}],23:[function(require,module,exports){
'use strict';


/**
* Members and methods attached to the
* [`rac.Ray` function]{@link Rac#Ray}.
*
* The function contains ready-made convenience
* [`Ray`]{@link Rac.Ray} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Ray.xAxis // ready-made x-axis ray
* rac.Ray.xAxis.rac === rac // true
*
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Ray` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Ray` with all values set to zero, starts at
  * [`rac.Point.zero`]{@link instance.Point#zero} and points to
  * [`rac.Angle.zero`]{@link instance.Angle#zero}.
  *
  * @name zero
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  */
  rac.Ray.zero = rac.Ray(0, 0, rac.Angle.zero);


  /**
  * A `Ray` over the x-axis, starts at
  * [`rac.Point.origin`]{@link instance.Point#origin} and points to
  * [`rac.Angle.zero`]{@link instance.Angle#zero}.
  *
  * Equal to [`rac.Ray.zero`]{@link instance.Ray#zero}.
  *
  * @name xAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  */
  rac.Ray.xAxis = rac.Ray.zero;


  /**
  * A `Ray` over the y-axis, starts at
  * [`rac.Point.origin`]{@link instance.Point#origin} and points to
  * [`rac.Angle.quarter`]{@link instance.Angle#quarter}.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay


},{}],24:[function(require,module,exports){
'use strict';


/**
* Members and methods attached to the
* [`rac.Segment` function]{@link Rac#Segment}.
*
* The function contains ready-made convenience
* [`Segment`]{@link Rac.Segment} objects for usual values, all setup with
* the owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Segment.zero // ready-made zero segment
* rac.Segment.zero.rac === rac // true
*
* @namespace instance.Segment
*/
module.exports = function attachRacSegment(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Segment` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Segment` with all values set to zero, starts at
  * [`rac.Point.zero`]{@link instance.Point#zero}, points to
  * [`rac.Angle.zero`]{@link instance.Angle#zero}, and has a length of
  * zero.
  *
  * @name zero
  * @type {Rac.Segment}
  * @memberof instance.Segment#
  */
  rac.Segment.zero = rac.Segment(0, 0, 0, 0);

} // attachRacSegment


},{}],25:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* Members and methods attached to the
* [`rac.Text` function]{@link Rac#Text}.
*
* The function contains ready-made convenience
* [`Text`]{@link Rac.Text} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Text.hello // ready-made hello-world text
* rac.Text.hello.rac === rac // true
*
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Text` is attached in `attachInstanceFunctions.js`.

// RELEASE-TODO: separate to its own file?
  /**
  * Members and methods attached to the
  * [`rac.Text.Format` function]{@link Rac#TextFormat}.
  *
  * The function contains ready-made convenience
  * [`Text.Format`]{@link Rac.Text.Format} objects for usual values, all
  * setup with the owning `Rac` instance.
  *
  * @example
  * let rac = new Rac()
  * rac.Text.Format.topLeft // ready-made top-left text format
  * rac.Text.Format.topLeft.rac === rac // true
  *
  * @namespace instance.Text.Format
  */


  // ======================================================================
  // Tops =================================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to the
  * top-left edge of the drawn text.
  *
  * Also available as: `tl`.
  *
  * @name topLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top);
  rac.Text.Format.tl = rac.Text.Format.topLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-left edge of the drawn text.
  *
  * Also available as: `tc`.
  *
  * @name topCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.top);
  rac.Text.Format.tc = rac.Text.Format.topCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-right edge of the drawn text.
  *
  * Also available as: `tr`.
  *
  * @name topRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.top);
  rac.Text.Format.tr = rac.Text.Format.topRight;


  // ======================================================================
  // Centers ==============================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-left edge of the drawn text.
  *
  * Also available as: `cl`.
  *
  * @name centerLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.cl = rac.Text.Format.centerLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center of the drawn text.
  *
  * Also available as: `cc`, `centered`.
  *
  * @name centerCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.centered = rac.Text.Format.centerCenter;
  rac.Text.Format.cc       = rac.Text.Format.centerCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the center-right of the drawn text.
  *
  * Also available as: `cr`.
  *
  * @name centerRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.cr = rac.Text.Format.centerRight;


  // ======================================================================
  // Bottoms ==============================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the bottom-left of the drawn text.
  *
  * Also available as: `bl`.
  *
  * @name bottomLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom);
  rac.Text.Format.bl = rac.Text.Format.bottomLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the bottom-center of the drawn text.
  *
  * Also available as: `bc`.
  *
  * @name bottomCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.bottom);
  rac.Text.Format.bc = rac.Text.Format.bottomCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the bottom-right of the drawn text.
  *
  * Also available as: `br`.
  *
  * @name bottomRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.bottom);
  rac.Text.Format.br = rac.Text.Format.bottomRight;


  // ======================================================================
  // Baselines ============================================================
  // ======================================================================

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the baseline and left of the drawn text.
  *
  * Also available as: `bll`.
  *
  * @name baselineLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.baselineLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.baseline);
  rac.Text.Format.bll = rac.Text.Format.baselineLeft;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the baseline and center of the drawn text.
  *
  * Also available as: `blc`.
  *
  * @name baselineCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.baselineCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.baseline);
  rac.Text.Format.blc = rac.Text.Format.baselineCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} to
  * the baseline and right of the drawn text.
  *
  * Also available as: `blr`.
  *
  * @name baselineRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.baselineRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.baseline);
  rac.Text.Format.blr = rac.Text.Format.baselineRight;


  /**
  * A `Text` for drawing `hello world` with `topLeft` format at
  * `Point.zero`.
  * @name hello
  * @type {Rac.Text}
  * @memberof instance.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!');

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @type {Rac.Text}
  * @memberof instance.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow');

} // attachRacText


},{"../Rac":2}],26:[function(require,module,exports){


// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // https://github.com/amdjs/amdjs-api/blob/master/AMD.md
    // https://requirejs.org/docs/whyamd.html
    // AMD. Register as an anonymous module.

    // console.log(`Loading RAC for AMD - define:${typeof define}`);
    define([], factory);
    return;
  }

  if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.

    // console.log(`Loading RAC for Node - module:${typeof module}`);
    module.exports = factory();
    return;
  }

  // Browser globals (root is window)

  // console.log(`Loading RAC into self - root:${typeof root}`);
  root.Rac = factory();

}(typeof self !== 'undefined' ? self : this, function () {

  return require('./Rac');

}));


},{"./Rac":2}],27:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Drawer that uses a [P5](https://p5js.org/) instance for all drawing
* operations.
*
* @alias Rac.P5Drawer
*/
class P5Drawer {

  constructor(rac, p5){
    this.rac = rac;
    this.p5 = p5;
    this.drawRoutines = [];
    this.debugRoutines = [];
    this.applyRoutines = [];

    /**
    * Style used for debug drawing, when `null` the style already applied
    * is used.
    *
    * @type {Object}
    * @default null
    */
    this.debugStyle = null;

    /**
    * Style used for text for debug drawing, when `null` the style already
    * applied is used.
    *
    * @type {Object}
    * @default null
    */
    this.debugTextStyle = null;

    /**
    * Settings used by the default implementation of `drawable.debug()`.
    *
    * @property {String} font='monospace'
    *   Font to use when drawing with `debug()`
    * @property {Number} [size=[rac.textFormatDefaults.size]{@link Rac#textFormatDefaults}]
    *   Font size to use when drawing with `debug()`
    * @property {Number} fixedDigits=2
    *   Number of decimal digits to print when drawing with `debug()`
    *
    * @type {Object}
    */
    this.debugTextOptions = {
      font: 'monospace',
      // TODO: documentation displays this as being optional
      // in order to make the link work it has to be wrapped in [],
      // which makes it an optional
      size: rac.textFormatDefaults.size,
      fixedDigits: 2
    };

    /**
    * Radius of point markers for debug drawing.
    * @type {Number}
    * @default 22
    */
    this.debugPointRadius = 5;

    /**
    * Radius of the main visual elements for debug drawing.
    * @type {Number}
    * @default 22
    */
    this.debugMarkerRadius = 22;

    /**
    * Factor applied to stroke weight setting. Stroke weight is set to
    * `stroke.weight * strokeWeightFactor` when applicable.
    *
    * @type {Number}
    * @default 1
    */
    this.strokeWeightFactor = 1;

    this.setupAllDrawFunctions();
    this.setupAllDebugFunctions();
    this.setupAllApplyFunctions();
    // TODO: add a customized function for new classes!
  }


  /**
  * Sets the given `drawFunction` to perform the drawing for instances of
  * class `drawableClass`.
  *
  * `drawFunction` is expected to have the signature:
  * ```
  * drawFunction(drawer, objectOfClass)
  * ```
  * + `drawer: P5Drawer` - Instance to use for drawing
  * + `objectOfClass: drawableClass` - Instance of `drawableClass` to draw
  *
  * @param {class} drawableClass - Class of the instances to draw
  * @param {function} drawFunction - Function that performs drawing
  */
  setDrawFunction(drawableClass, drawFunction) {
    let index = this.drawRoutines
      .findIndex(routine => routine.classObj === drawableClass);

    let routine;
    if (index === -1) {
      routine = new DrawRoutine(drawableClass, drawFunction);
    } else {
      routine = this.drawRoutines[index];
      routine.drawFunction = drawFunction;
      // Delete routine
      this.drawRoutines.splice(index, 1);
    }

    this.drawRoutines.push(routine);
  }


  setDrawOptions(classObj, options) {
    let routine = this.drawRoutines
      .find(routine => routine.classObj === classObj);
    if (routine === undefined) {
      console.log(`Cannot find routine for class - className:${classObj.name}`);
      throw Rac.Error.invalidObjectConfiguration
    }

    if (options.requiresPushPop !== undefined) {
      routine.requiresPushPop = options.requiresPushPop;
    }
  }


  setClassDrawStyle(classObj, style) {
    let routine = this.drawRoutines
      .find(routine => routine.classObj === classObj);
    if (routine === undefined) {
      console.log(`Cannot find routine for class - className:${classObj.name}`);
      throw Rac.Error.invalidObjectConfiguration
    }

    routine.style = style;
  }


  /**
  * Sets the given `debugFunction` to perform the debug-drawing for
  * instances of class `drawableClass`.
  *
  * When a drawable class does not have a `debugFunction` setup, calling
  * `drawable.debug()` simply calls `draw()` with
  * `[debugStyle]{@link Rac.P5Drawer#debugStyle}` applied.
  *
  * `debugFunction` is expected to have the signature:
  * ```
  * debugFunction(drawer, objectOfClass, drawsText)
  * ```
  * + `drawer: P5Drawer` - Instance to use for drawing
  * + `objectOfClass: drawableClass` - Instance of `drawableClass` to draw
  * + `drawsText: bool` - When `true` text should be drawn with
  *    additional information.
  *
  * @param {class} drawableClass - Class of the instances to draw
  * @param {function} debugFunction - Function that performs debug-drawing
  */
  setDebugFunction(drawableClass, debugFunction) {
    let index = this.debugRoutines
      .findIndex(routine => routine.classObj === drawableClass);

    let routine;
    if (index === -1) {
      routine = new DebugRoutine(drawableClass, debugFunction);
    } else {
      routine = this.debugRoutines[index];
      routine.debugFunction = debugFunction;
      // Delete routine
      this.debugRoutines.splice(index, 1);
    }

    this.debugRoutines.push(routine);
  }


  // Adds a ApplyRoutine for the given class.
  setApplyFunction(classObj, applyFunction) {
    let index = this.applyRoutines
      .findIndex(routine => routine.classObj === classObj);

    let routine;
    if (index === -1) {
      routine = new ApplyRoutine(classObj, applyFunction);
    } else {
      routine = this.applyRoutines[index];
      routine.drawFunction = drawFunction;
      // Delete routine
      this.applyRoutines.splice(index, 1);
    }

    this.applyRoutines.push(routine);
  }


  drawObject(object, style = null) {
    let routine = this.drawRoutines
      .find(routine => object instanceof routine.classObj);
    if (routine === undefined) {
      console.trace(`Cannot draw object - object-type:${utils.typeName(object)}`);
      throw Rac.Error.invalidObjectToDraw;
    }

    if (routine.requiresPushPop === true
      || style !== null
      || routine.style !== null)
    {
      this.p5.push();
      if (routine.style !== null) {
        routine.style.apply();
      }
      if (style !== null) {
        style.apply();
      }
      routine.drawFunction(this, object);
      this.p5.pop();
    } else {
      // No push-pull
      routine.drawFunction(this, object);
    }
  }


  debugObject(object, drawsText) {
    let routine = this.debugRoutines
      .find(routine => object instanceof routine.classObj);
    if (routine === undefined) {
      // No routine, just draw object with debug style
      this.drawObject(object, this.debugStyle);
      return;
    }

    if (this.debugStyle !== null) {
      this.p5.push();
      this.debugStyle.apply();
      routine.debugFunction(this, object, drawsText);
      this.p5.pop();
    } else {
      routine.debugFunction(this, object, drawsText);
    }
  }


  applyObject(object) {
    let routine = this.applyRoutines
      .find(routine => object instanceof routine.classObj);
    if (routine === undefined) {
      console.trace(`Cannot apply object - object-type:${utils.typeName(object)}`);
      throw Rac.Error.invalidObjectToApply;
    }

    routine.applyFunction(this, object);
  }


  // Sets up all drawing routines for rac drawable clases.
  // Also attaches additional prototype and static functions in relevant
  // classes.
  setupAllDrawFunctions() {
    let functions = require('./draw.functions');

    // Point
    this.setDrawFunction(Rac.Point, functions.drawPoint);
    require('./Point.functions')(this.rac);

    // Ray
    this.setDrawFunction(Rac.Ray, functions.drawRay);
    require('./Ray.functions')(this.rac);

    // Segment
    this.setDrawFunction(Rac.Segment, functions.drawSegment);
    require('./Segment.functions')(this.rac);

    // Arc
    this.setDrawFunction(Rac.Arc, functions.drawArc);

    Rac.Arc.prototype.vertex = function() {
      let angleDistance = this.angleDistance();
      let beziersPerTurn = 5;
      let divisions = Math.ceil(angleDistance.turnOne() * beziersPerTurn);
      this.divideToBeziers(divisions).vertex();
    };

    // Text
    this.setDrawFunction(Rac.Text, functions.drawText);
    // Text drawing uses `text.format.apply`, which translate and rotation
    // modifications to the drawing matrix
    // this requires a push-pop on every draw
    this.setDrawOptions(Rac.Text, {requiresPushPop: true});

    // Bezier
    this.setDrawFunction(Rac.Bezier, (drawer, bezier) => {
      drawer.p5.bezier(
        bezier.start.x, bezier.start.y,
        bezier.startAnchor.x, bezier.startAnchor.y,
        bezier.endAnchor.x, bezier.endAnchor.y,
        bezier.end.x, bezier.end.y);
    });

    Rac.Bezier.prototype.vertex = function() {
      this.start.vertex()
      this.rac.drawer.p5.bezierVertex(
        this.startAnchor.x, this.startAnchor.y,
        this.endAnchor.x, this.endAnchor.y,
        this.end.x, this.end.y);
    };

    // Composite
    this.setDrawFunction(Rac.Composite, (drawer, composite) => {
      composite.sequence.forEach(item => item.draw());
    });

    Rac.Composite.prototype.vertex = function() {
      this.sequence.forEach(item => item.vertex());
    };

    // Shape
    this.setDrawFunction(Rac.Shape, (drawer, shape) => {
      drawer.p5.beginShape();
      shape.outline.vertex();

      if (shape.contour.isNotEmpty()) {
        drawer.p5.beginContour();
        shape.contour.vertex();
        drawer.p5.endContour();
      }
      drawer.p5.endShape();
    });

    Rac.Shape.prototype.vertex = function() {
      this.outline.vertex();
      this.contour.vertex();
    };
  } // setupAllDrawFunctions


  // Sets up all debug routines for rac drawable clases.
  setupAllDebugFunctions() {
    let functions = require('./debug.functions');
    this.setDebugFunction(Rac.Point, functions.debugPoint);
    this.setDebugFunction(Rac.Ray, functions.debugRay);
    this.setDebugFunction(Rac.Segment, functions.debugSegment);
    this.setDebugFunction(Rac.Arc, functions.debugArc);
    this.setDebugFunction(Rac.Text, functions.debugText);

    Rac.Angle.prototype.debug = function(point, drawsText = false) {
      const drawer = this.rac.drawer;
      if (drawer.debugStyle !== null) {
        drawer.p5.push();
        drawer.debugStyle.apply();
        // TODO: could this be a good option to implement splatting arguments
        // into the debugFunction?
        functions.debugAngle(drawer, this, point, drawsText);
        drawer.p5.pop();
      } else {
        functions.debugAngle(drawer, this, point, drawsText);
      }
      return this;
    };

    Rac.Point.prototype.debugAngle = function(angle, drawsText = false) {
      angle = this.rac.Angle.from(angle);
      angle.debug(this, drawsText);
      return this;
    };
  } // setupAllDebugFunctions


  // Sets up all applying routines for rac style clases.
  // Also attaches additional prototype functions in relevant classes.
  setupAllApplyFunctions() {
    // Color prototype functions
    Rac.Color.prototype.applyBackground = function() {
      this.rac.drawer.p5.background(this.r * 255, this.g * 255, this.b * 255);
    };

    Rac.Color.prototype.applyFill = function() {
      this.rac.drawer.p5.fill(this.r * 255, this.g * 255, this.b * 255, this.a * 255);
    };

    Rac.Color.prototype.applyStroke = function() {
      this.rac.drawer.p5.stroke(this.r * 255, this.g * 255, this.b * 255, this.a * 255);
    };

    // Stroke
    this.setApplyFunction(Rac.Stroke, (drawer, stroke) => {
      if (stroke.weight === null && stroke.color === null) {
        drawer.p5.noStroke();
        return;
      }

      if (stroke.color !== null) {
        stroke.color.applyStroke();
      }

      if (stroke.weight !== null) {
        drawer.p5.strokeWeight(stroke.weight * drawer.strokeWeightFactor);
      }
    });

    // Fill
    this.setApplyFunction(Rac.Fill, (drawer, fill) => {
      if (fill.color === null) {
        drawer.p5.noFill();
        return;
      }

      fill.color.applyFill();
    });

    // StyleContainer
    this.setApplyFunction(Rac.StyleContainer, (drawer, container) => {
      container.styles.forEach(item => {
        item.apply();
      });
    });

    // Text.Format
    // Applies all text properties and translates to the given `point`.
    // After the format is applied the text should be drawn at the origin.
    //
    // Calling this function requires a push-pop to the drawing style
    // settings since translate and rotation modifications are made to the
    // drawing matrix. Otherwise all other subsequent drawing will be
    // impacted.
    Rac.Text.Format.prototype.apply = function(point) {
      let hAlign;
      let hEnum = Rac.Text.Format.horizontalAlign;
      switch (this.hAlign) {
        case hEnum.left:   hAlign = this.rac.drawer.p5.LEFT;   break;
        case hEnum.center: hAlign = this.rac.drawer.p5.CENTER; break;
        case hEnum.right:  hAlign = this.rac.drawer.p5.RIGHT;  break;
        default:
          console.trace(`Invalid hAlign configuration - hAlign:${this.hAlign}`);
          throw Rac.Error.invalidObjectConfiguration;
      }

      let vAlign;
      let vEnum = Rac.Text.Format.verticalAlign;
      switch (this.vAlign) {
        case vEnum.top:      vAlign = this.rac.drawer.p5.TOP;      break;
        case vEnum.bottom:   vAlign = this.rac.drawer.p5.BOTTOM;   break;
        case vEnum.center:   vAlign = this.rac.drawer.p5.CENTER;   break;
        case vEnum.baseline: vAlign = this.rac.drawer.p5.BASELINE; break;
        default:
          console.trace(`Invalid vAlign configuration - vAlign:${this.vAlign}`);
          throw Rac.Error.invalidObjectConfiguration;
      }

      // Align
      this.rac.drawer.p5.textAlign(hAlign, vAlign);

      // Size
      const textSize = this.size ?? this.rac.textFormatDefaults.size;
      this.rac.drawer.p5.textSize(textSize);

      // Font
      const textFont = this.font ?? this.rac.textFormatDefaults.font;
      if (textFont !== null) {
        this.rac.drawer.p5.textFont(textFont);
      }

      // Positioning
      this.rac.drawer.p5.translate(point.x, point.y);

      // Rotation
      if (this.angle.turn !== 0) {
        this.rac.drawer.p5.rotate(this.angle.radians());
      }

      // Padding
      let xPad = 0;
      let yPad = 0;

      switch (this.hAlign) {
        case hEnum.left:   xPad += this.hPadding; break;
        case hEnum.center: xPad += this.hPadding; break;
        case hEnum.right:  xPad -= this.hPadding; break;
      }
      switch (this.vAlign) {
        case vEnum.top:      yPad += this.vPadding; break;
        case vEnum.center:   yPad += this.vPadding; break;
        case vEnum.baseline: yPad += this.vPadding; break;
        case vEnum.bottom:   yPad -= this.vPadding; break;
      }

      if (xPad !== 0 || yPad !== 0) {
        this.rac.drawer.p5.translate(xPad, yPad);
      }
    } // Rac.Text.Format.prototype.apply

  } // setupAllApplyFunctions

} // class P5Drawer

module.exports = P5Drawer;


// Contains the drawing function and options for drawing objects of a
// specific class.
//
// An instance is created for each drawable class that the drawer can
// support, which contains all the settings needed for drawing.
class DrawRoutine {

  // TODO: Rename to drawableClass
  constructor (classObj, drawFunction) {
    // Class associated with the contained settings.
    this.classObj = classObj;

    // Drawing function for objects of type `classObj` with the signature:
    // `drawFunction(drawer, objectOfClass)`
    // + `drawer: P5Drawer` - Instance to use for drawing
    // + `objectOfClass: classObj` - Instance of `classObj` to draw
    //
    // The function is intended to perform drawing using `drawer.p5`
    // functions or calling `draw()` in other drawable objects. All styles
    // are pushed beforehand and popped afterwards.
    //
    // In general it is expected that the `drawFunction` peforms no changes
    // to the drawing settings in order for each drawing call to use only a
    // single `push/pop` when necessary. For classes that require
    // modifications to the drawing settings the `requiresPushPop`
    // property can be set to force a `push/pop` with each drawing call
    // regardless if styles are applied.
    this.drawFunction = drawFunction;

    // When set, this style is always applied before each drawing call to
    // objects of type `classObj`. This `style` is applied before the
    // `style` provided to the drawing call.
    this.style = null;

    // When set to `true`, a `push/pop` is always peformed before and after
    // all the style are applied and drawing is performed. This is intended
    // for objects which drawing operations may need to perform
    // transformations to the drawing settings.
    this.requiresPushPop = false;
  } // constructor

} // DrawRoutine


// Contains the debug-drawing function and options for debug-drawing
// objects of a specific class.
//
// An instance is created for each drawable class that the drawer can
// support, which contains all the settings needed for debug-drawing.
//
// When a drawable object does not have a `DebugRoutine` setup, calling
// `debug()` simply calls `draw()` with the debug style applied.
class DebugRoutine {

  constructor (classObj, debugFunction) {
    // Class associated with the contained settings.
    this.classObj = classObj;

    // Debug function for objects of type `classObj` with the signature:
    // `debugFunction(drawer, objectOfClass, drawsText)`
    // + `drawer: P5Drawer` - Instance to use for drawing
    // + `objectOfClass: classObj` - Instance of `classObj` to debug
    // + `drawsText: bool` - When `true` text should be drawn with
    //   additional information.
    //
    // The function is intended to perform debug-drawing using `drawer.p5`
    // functions or calling `draw()` in other drawable objects. The debug
    // style is pushed beforehand and popped afterwards.
    //
    // In general it is expected that the `drawFunction` peforms no changes
    // to the drawing settings in order for each drawing call to use only a
    // single `push/pop` when necessary.
    //
    this.debugFunction = debugFunction;
  } // constructor

}


class ApplyRoutine {
  constructor (classObj, applyFunction) {
    this.classObj = classObj;
    this.applyFunction = applyFunction;
  }
}


},{"../Rac":2,"../util/utils":42,"./Point.functions":28,"./Ray.functions":29,"./Segment.functions":30,"./debug.functions":31,"./draw.functions":32}],28:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachPointFunctions(rac) {

  /**
  * Calls `p5.vertex` to represent this `Point`.
  *
  * Added  to `Rac.Point.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  */
  Rac.Point.prototype.vertex = function() {
    this.rac.drawer.p5.vertex(this.x, this.y);
  };

  /**
  * Returns a `Point` at the current position of the pointer.
  *
  * Added to `rac.Point` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Point}
  *
  * @function pointer
  * @memberof instance.Point#
  */
  rac.Point.pointer = function() {
    return rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
  };

  /**
  * Returns a `Point` at the center of the canvas.
  *
  * Added to `rac.Point` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Point}
  *
  * @function canvasCenter
  * @memberof instance.Point#
  */
  rac.Point.canvasCenter = function() {
    return rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
  };

  /**
  * Returns a `Point` at the end of the canvas, that is, at the position
  * `(width,height)`.
  *
  * Added to `rac.Point` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Point}
  *
  * @function canvasEnd
  * @memberof instance.Point#
  */
  rac.Point.canvasEnd = function() {
    return rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
  };

} // attachPointFunctions


},{"../Rac":2,"../util/utils":42}],29:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachRayFunctions(rac) {

  /**
  * Returns a new `Point` located where the ray touches the canvas edge.
  *
  * When the ray is outside the canvas and pointing away, `null` is
  * returned.
  *
  * Added  to `Rac.Ray.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  * @returns {?Rac.Point}
  */
  Rac.Ray.prototype.pointAtCanvasEdge = function(margin = 0) {
    let edgeRay = this.rayAtCanvasEdge(margin);
    if (edgeRay == null) {
      return null;
    }

    return edgeRay.start;
  };


  /**
  * Returns a new `Ray` that starts at the point where the `this` touches
  * the canvas edge and pointed towards the inside of the canvas.
  *
  * When the ray is outside the canvas and pointing away, `null` is
  * returned.
  *
  * Added  to `Rac.Ray.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {?Rac.Ray}
  */
  Rac.Ray.prototype.rayAtCanvasEdge = function(margin = 0) {
    const turn = this.angle.turn;
    const p5 = this.rac.drawer.p5;

    const downEdge  = p5.height - margin;
    const leftEdge  = margin;
    const upEdge    = margin;
    const rightEdge = p5.width - margin;

    // pointing down
    if (turn >= 1/8 && turn < 3/8) {
      let edgeRay = null;
      if (this.start.y < downEdge) {
        edgeRay = this.pointAtY(downEdge).ray(this.rac.Angle.up);
        if (edgeRay.start.x > rightEdge) {
          edgeRay = this.pointAtX(rightEdge).ray(this.rac.Angle.left);
        } else if (edgeRay.start.x < leftEdge) {
          edgeRay = this.pointAtX(leftEdge).ray(this.rac.Angle.right);
        }
      }
      return edgeRay;
    }

    // pointing left
    if (turn >= 3/8 && turn < 5/8) {
      let edgeRay = null;
      if (this.start.x >= leftEdge) {
        edgeRay = this.pointAtX(leftEdge).ray(this.rac.Angle.right);
        if (edgeRay.start.y > downEdge) {
          edgeRay = this.pointAtY(downEdge).ray(this.rac.Angle.up);
        } else if (edgeRay.start.y < upEdge) {
          edgeRay = this.pointAtY(upEdge).ray(this.rac.Angle.down);
        }
      }
      return edgeRay;
    }

    // pointing up
    if (turn >= 5/8 && turn < 7/8) {
      let edgeRay = null;
      if (this.start.y >= upEdge) {
        edgeRay = this.pointAtY(upEdge).ray(this.rac.Angle.down);
        if (edgeRay.start.x > rightEdge) {
          edgeRay = this.pointAtX(rightEdge).ray(this.rac.Angle.left);
        } else if (edgeRay.start.x < leftEdge) {
          edgeRay = this.pointAtX(leftEdge).ray(this.rac.Angle.right);
        }
      }
      return edgeRay;
    }

    // pointing right
    let edgeRay = null;
    if (this.start.x < rightEdge) {
      edgeRay = this.pointAtX(rightEdge).ray(this.rac.Angle.left);
      if (edgeRay.start.y > downEdge) {
          edgeRay = this.pointAtY(downEdge).ray(this.rac.Angle.up);
        } else if (edgeRay.start.y < upEdge) {
          edgeRay = this.pointAtY(upEdge).ray(this.rac.Angle.down);
        }
    }
    return edgeRay;
  };

} // attachRayFunctions


},{"../Rac":2,"../util/utils":42}],30:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachSegmentFunctions(rac) {

  /**
  * Calls `p5.vertex` to represent this `Segment`.
  *
  * Added  to `Rac.Segment.prototype` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  */
  Rac.Segment.prototype.vertex = function() {
    this.startPoint().vertex();
    this.endPoint().vertex();
  };


  /**
  * Returns a `Segment` that covers the top of the canvas, from top-left to
  * top-right.
  *
  * Added  to `rac.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasTop
  * @memberof instance.Segment#
  */
  rac.Segment.canvasTop = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };


  /**
  * Returns a `Segment` that covers the left of the canvas, from top-left
  * to bottom-left.
  *
  * Added  to `rac.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasLeft
  * @memberof instance.Segment#
  */
  rac.Segment.canvasLeft = function() {
    return rac.Point.zero
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the right of the canvas, from top-right
  * to bottom-right.
  *
  * Added  to `rac.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasRight
  * @memberof instance.Segment#
  */
  rac.Segment.canvasRight = function() {
    const topRight = rac.Point(rac.drawer.p5.width, 0);
    return topRight
      .segmentToAngle(rac.Angle.down, rac.drawer.p5.height);
  };


  /**
  * Returns a `Segment` that covers the bottom of the canvas, from
  * bottom-left to bottom-right.
  *
  * Added  to `rac.Segment` when `{@link Rac.P5Drawer}` is setup as
  * `[rac.drawer]{@link Rac#drawer}`.
  *
  * @returns {Rac.Segment}
  *
  * @function canvasBottom
  * @memberof instance.Segment#
  */
  rac.Segment.canvasBottom = function() {
    let bottomLeft = rac.Point(0, rac.drawer.p5.height);
    return bottomLeft
      .segmentToAngle(rac.Angle.right, rac.drawer.p5.width);
  };



} // attachSegmentFunctions


},{"../Rac":2,"../util/utils":42}],31:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');

// RELEASE-TODO: update debug texts to use paddings instead of pointToAngle

// RELEASE-TODO: use uprightText for these cases
function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
}


function dashedDraw(drawer, segment, closure) {
  const context = drawer.p5.drawingContext;
  context.save();
  context.lineCap = 'butt';
  context.setLineDash(segment);
  closure();
  context.restore();
}


exports.debugAngle = function(drawer, angle, point, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  // Zero segment
  point
    .segmentToAngle(rac.Angle.zero, markerRadius)
    .draw();

  // Angle segment
  let angleSegment = point
    .segmentToAngle(angle, markerRadius * 1.5);
  angleSegment.endPoint()
    .arc(pointRadius, angle, angle.inverse(), false)
    .draw();
  angleSegment
    .withLengthAdd(pointRadius)
    .draw();

  // Mini angle arc markers
  let angleArc = point.arc(markerRadius, rac.Angle.zero, angle);
  dashedDraw(drawer, [6, 4], ()=>{ angleArc.draw(); });

  // Outside angle arc
  if (!angleArc.isCircle()) {
    let outsideAngleArc = angleArc
      .withRadius(markerRadius*3/4)
      .withClockwise(false);
    dashedDraw(drawer, [2, 4], ()=>{ outsideAngleArc.draw(); });
  }

  // Debug Text
  if (drawsText !== true) { return; }

  // Normal orientation
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    format = format.reverse();
  }

  // Turn text
  let turnString = `turn:${angle.turn.toFixed(digits)}`;
  point
    .pointToAngle(angle, markerRadius*2)
    .text(turnString, format)
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  point.draw();

  // Point marker
  point.arc(pointRadius).draw();

  // Point reticule marker
  let arc = point
    .arc(markerRadius, rac.Angle.s, rac.Angle.e)
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(1/2)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(1/2)
    .draw();

  // Debug Text
  if (drawsText !== true) { return; }

  let string = `x:${point.x.toFixed(digits)}\ny:${point.y.toFixed(digits)}`;
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top,
    rac.Angle.e,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, pointRadius*2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


exports.debugRay = function(drawer, ray, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  ray.draw();

  // Little circle at start marker
  ray.start.arc(pointRadius).draw();

  // Half circle at start
  const perpAngle = ray.angle.perpendicular();
  const startArc = ray.start
    .arc(markerRadius, perpAngle, perpAngle.inverse())
    .draw();
  startArc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  startArc.endSegment().reverse()
    .withLengthRatio(0.5)
    .draw();

  // Edge end half circle
  const edgeRay = ray.rayAtCanvasEdge();
  if (edgeRay != null) {
    const edgeArc = edgeRay
      .translateToDistance(pointRadius)
      .perpendicular(false)
      .arcToAngleDistance(markerRadius/2, 0.5)
      .draw();
    edgeArc.startSegment()
      .reverse()
      .withLength(pointRadius)
      .draw();
    edgeArc.endSegment()
      .reverse()
      .withLength(pointRadius)
      .draw();
    edgeArc.radiusSegmentAtAngle(edgeRay.angle)
      .reverse()
      .withLength(pointRadius)
      .draw();
  }

  // Debug Text
  if (drawsText !== true) { return; }

  const angle  = ray.angle;
  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;
  const font   = drawer.debugTextOptions.font;
  const size   = drawer.debugTextOptions.size;
  const digits = drawer.debugTextOptions.fixedDigits;

  // Normal orientation
  let startFormat = new Rac.Text.Format(rac,
    hEnum.left, vEnum.bottom,
    angle, font, size);
  let angleFormat = new Rac.Text.Format(rac,
    hEnum.left, vEnum.top,
    angle, font, size);
  if (reversesText(angle)) {
    // Reverse orientation
    startFormat = startFormat.reverse();
    angleFormat = angleFormat.reverse();
  }

  // Start text
  const startString = `start:(${ray.start.x.toFixed(digits)},${ray.start.y.toFixed(digits)})`;
  ray.start
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(startString, startFormat)
    .draw(drawer.debugTextStyle);

  // Angle text
  const angleString = `angle:${angle.turn.toFixed(digits)}`;
  ray.start
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugRay


exports.debugSegment = function(drawer, segment, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  segment.draw();

  // Little circle at start marker
  segment.withLength(pointRadius)
    .arc()
    .draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.startPoint()
    .arc(markerRadius, perpAngle, perpAngle.inverse())
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(0.5)
    .draw();

  // Perpendicular end marker
  let endMarkerStart = segment
    .nextSegmentPerpendicular()
    .withLength(markerRadius/2)
    .withStartExtension(-pointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(markerRadius/2)
    .withStartExtension(-pointRadius)
    .draw();
  // Little end half circle
  segment.endPoint()
    .arc(pointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
    .draw();

  // Forming end arrow
  let arrowAngleShift = rac.Angle.from(1/7);
  let endArrowStart = endMarkerStart
    .reverse()
    .ray.withAngleShift(arrowAngleShift, false);
  let endArrowEnd = endMarkerEnd
    .reverse()
    .ray.withAngleShift(arrowAngleShift, true);
  let endArrowPoint = endArrowStart
    .pointAtIntersection(endArrowEnd);
  // End arrow
  endMarkerStart
    .nextSegmentToPoint(endArrowPoint)
    .draw()
    .nextSegmentToPoint(endMarkerEnd.endPoint())
    .draw();


  // Debug Text
  if (drawsText !== true) { return; }

  let angle = segment.angle();
  // Normal orientation
  let lengthFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  let angleFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    lengthFormat = lengthFormat.reverse();
    angleFormat = angleFormat.reverse();
  }

  // Length
  let lengthString = `length:${segment.length.toFixed(digits)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${angle.turn.toFixed(digits)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  arc.draw();

  // Center markers
  let centerArcRadius = markerRadius * 2/3;
  if (arc.radius > markerRadius/3 && arc.radius < markerRadius) {
    // If radius is too close to the center-arc markers
    // Make the center-arc be outside of the arc
    centerArcRadius = arc.radius + markerRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Radius
  let radiusMarkerLength = arc.radius
    - centerArcRadius
    - markerRadius/2
    - pointRadius*2;
  if (radiusMarkerLength > 0) {
    arc.startSegment()
      .withLength(radiusMarkerLength)
      .translateToLength(centerArcRadius + pointRadius*2)
      .draw();
  }

  // Inside angle arc - big dashes
  dashedDraw(drawer, [6, 4], ()=>{ centerArc.draw(); });

  // Outside angle arc - small dashes
  if (!centerArc.isCircle()) {
    let outsideAngleArc = centerArc
      .withClockwise(!centerArc.clockwise);
    dashedDraw(drawer, [2, 4], ()=>{ outsideAngleArc.draw(); });
  }

  // Center end segment
  if (!arc.isCircle()) {
    centerArc.endSegment().reverse().withLengthRatio(1/2).draw();
  }

  // Start point marker
  let startPoint = arc.startPoint();
  startPoint
    .arc(pointRadius).draw();
  startPoint
    .segmentToAngle(arc.start, markerRadius)
    .withStartExtension(-markerRadius/2)
    .draw();

  // Orientation marker
  let orientationLength = markerRadius*2;
  let orientationArc = arc
    .startSegment()
    .withLengthAdd(markerRadius)
    .arc(null, arc.clockwise)
    .withLength(orientationLength)
    .draw();
  let arrowCenter = orientationArc
    .reverse()
    .withLength(markerRadius/2)
    .chordSegment();
  let arrowAngle = 3/32;
  arrowCenter.withAngleShift(-arrowAngle).draw();
  arrowCenter.withAngleShift(arrowAngle).draw();

  // Internal end point marker
  let endPoint = arc.endPoint();
  let internalLength = Math.min(markerRadius/2, arc.radius);
  internalLength -= pointRadius;
  if (internalLength > rac.equalityThreshold) {
    endPoint
      .segmentToAngle(arc.end.inverse(), internalLength)
      .translateToLength(pointRadius)
      .draw();
  }

  // External end point marker
  let textJoinThreshold = markerRadius*3;
  let lengthAtOrientationArc = orientationArc
    .withEnd(arc.end)
    .length();
  let externalLength = lengthAtOrientationArc > textJoinThreshold && drawsText === true
    ? markerRadius - pointRadius
    : markerRadius/2 - pointRadius;

  endPoint
    .segmentToAngle(arc.end, externalLength)
    .translateToLength(pointRadius)
    .draw();

  // End point little arc
  if (!arc.isCircle()) {
    endPoint
      .arc(pointRadius, arc.end, arc.end.inverse(), arc.clockwise)
      .draw();
  }

  // Debug Text
  if (drawsText !== true) { return; }

  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;

  let headVertical = arc.clockwise
    ? vEnum.top
    : vEnum.bottom;
  let tailVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;
  let radiusVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;

  // Normal orientation
  let headFormat = new Rac.Text.Format(
    rac,
    hEnum.left,
    headVertical,
    arc.start,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  let tailFormat = new Rac.Text.Format(
    rac,
    hEnum.left,
    tailVertical,
    arc.end,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  let radiusFormat = new Rac.Text.Format(
    rac,
    hEnum.left,
    radiusVertical,
    arc.start,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);

  // Reverse orientation
  if (reversesText(arc.start)) {
    headFormat = headFormat.reverse();
    radiusFormat = radiusFormat.reverse();
  }
  if (reversesText(arc.end)) {
    tailFormat = tailFormat.reverse();
  }

  let startString = `start:${arc.start.turn.toFixed(digits)}`;
  let radiusString = `radius:${arc.radius.toFixed(digits)}`;
  let endString = `end:${arc.end.turn.toFixed(digits)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${angleDistance.turn.toFixed(digits)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  if (angleDistance.turn <= 3/4 && !arc.isCircle()) {
    // Radius drawn separately
    let perpAngle = arc.start.perpendicular(!arc.clockwise);
    arc.center
      .pointToAngle(arc.start, markerRadius)
      .pointToAngle(perpAngle, pointRadius*2)
      .text(radiusString, radiusFormat)
      .draw(drawer.debugTextStyle);
    headString = startString;
  } else {
    // Radius joined to head
    headString = `${startString}\n${radiusString}`;
  }

  if (lengthAtOrientationArc > textJoinThreshold) {
    // Draw strings separately
    orientationArc.startPoint()
      .pointToAngle(arc.start, markerRadius/2)
      .text(headString, headFormat)
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .pointToAngle(arc.end, markerRadius/2)
      .text(tailString, tailFormat)
      .draw(drawer.debugTextStyle);
  } else {
    // Draw strings together
    let allStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .pointToAngle(arc.start, markerRadius/2)
      .text(allStrings, headFormat)
      .draw(drawer.debugTextStyle);
  }
}; // debugArc


exports.debugText = function(drawer, text, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;

  const format = text.format;

  // Point marker
  text.point.arc(pointRadius).draw();

  const cornerReticule = function(angle, padding, perpPadding, rotation) {
    rac.Point.zero
      .segmentToAngle(angle, markerRadius)
      .reverse().withLength(markerRadius-pointRadius*2).draw() // line at text edge
      .nextSegmentPerpendicular(rotation, padding).push() // elbow turn
      .nextSegmentPerpendicular(!rotation, perpPadding).draw() // line at origin
      .nextSegmentWithLength(pointRadius*4)
      .nextSegmentWithLength(markerRadius-pointRadius*2).draw(); // opposite side line
      // Dashed elbow turn
      dashedDraw(drawer, [5, 2], ()=>{ rac.popStack().draw(); });
  };

  const centerReticule = function(angle, padding, perpPadding, rotation) {
    angle = rac.Angle.from(angle);
    // lines at edge of text
    rac.Point.zero
      .ray(angle.perpendicular(rotation))
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();
    let reticuleCenter = rac.Point.zero
      .segmentToAngle(angle.inverse(), padding)
      .push() // dashed line to elbow
      .nextSegmentPerpendicular(rotation, pointRadius)
      .reverse().draw() // elbow mark
      .nextSegmentPerpendicular(rotation, pointRadius)
      .reverse().draw() // elbow mark
      .nextSegmentPerpendicular(rotation, perpPadding)
      .push() // dashed line to center
      .endPoint();
    dashedDraw(drawer, [5, 2], ()=>{
      rac.popStack().draw();
      rac.popStack().draw();
    });

    // lines around reticule center
    reticuleCenter.ray(angle.inverse())
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();
    reticuleCenter.ray(angle.perpendicular(!rotation))
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();
    let lastCenterLine =
      reticuleCenter.ray(angle)
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();

    if (Math.abs(perpPadding) <= 2) return;

    // short dashed lines back to text edge
    lastCenterLine
      .nextSegmentWithLength(padding - markerRadius)
      .push()
      .nextSegmentPerpendicular(!rotation, format.hPadding)
      .push();
    dashedDraw(drawer, [2, 3], ()=>{
      rac.popStack().draw();
      rac.popStack().draw();
    });
  };

  drawer.p5.push();
    format.apply(text.point);
    switch (format.hAlign) {
      case hEnum.left:
        switch (format.vAlign) {
          case vEnum.top:
            cornerReticule(0/4, format.vPadding, format.hPadding, false);
            cornerReticule(1/4, format.hPadding, format.vPadding, true);
            break;
          case vEnum.center:
            centerReticule(0/4, format.hPadding, format.vPadding, true);
            break;
          case vEnum.baseline:
            centerReticule(0/4, format.hPadding, format.vPadding, true);
            break;
          case vEnum.bottom:
            cornerReticule(0/4, format.vPadding, format.hPadding, true);
            cornerReticule(3/4, format.hPadding, format.vPadding, false);
            break;
        }
        break;

      case hEnum.center:
        switch (format.vAlign) {
          case vEnum.top:
            centerReticule(1/4, format.vPadding, format.hPadding, false);
            break;
          case vEnum.center:
            centerReticule(1/4, format.vPadding, format.hPadding, false);
            break;
          case vEnum.baseline:
            centerReticule(1/4, format.vPadding, format.hPadding, false);
            break;
          case vEnum.bottom:
            centerReticule(3/4, format.vPadding, format.hPadding, true);
            break;
        }
        break;

      case hEnum.right:
        switch (format.vAlign) {
          case vEnum.top:
            cornerReticule(2/4, format.vPadding, format.hPadding, true);
            cornerReticule(1/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.center:
            centerReticule(2/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.baseline:
            centerReticule(2/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.bottom:
            cornerReticule(2/4, format.vPadding, format.hPadding, false);
            cornerReticule(3/4, format.hPadding, format.vPadding, true);
            break;
        }
        break;
    }
  drawer.p5.pop();

  // Text object
  text.draw(drawer.debugTextStyle);

  // Debug Text
  if (drawsText !== true) { return; }

  const fix = function(number) {
    return number.toFixed(digits);
  };

  let stringPa = `p:(${fix(text.point.x)},${fix(text.point.y)}) a:${fix(format.angle.turn)}`;
  let stringAl = `al:${format.hAlign},${format.vAlign}`;
  let stringPad = `pa:${fix(format.hPadding)},${fix(format.vPadding)}`;
  let debugString = `${stringPa}\n${stringAl}\n${stringPad}`;

  let debugFormat = new Rac.Text.Format(
    rac,
    hEnum.right, vEnum.bottom,
    rac.Angle.zero,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size,
    pointRadius, pointRadius);
  text.point.text(`${debugString}`, debugFormat)
    .draw(drawer.debugTextStyle);
}; // debugText


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape


},{"../Rac":2}],32:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


exports.drawPoint = function(drawer, point) {
  drawer.p5.point(point.x, point.y);
}; // drawPoint


exports.drawRay = function(drawer, ray) {
  let edgePoint = ray.pointAtCanvasEdge();

  if (edgePoint === null) {
    // Ray is outside canvas
    return;
  }

  drawer.p5.line(
    ray.start.x, ray.start.y,
    edgePoint.x, edgePoint.y);
}; // drawRay


exports.drawSegment = function(drawer, segment) {
  const start = segment.ray.start;
  const end = segment.endPoint();
  drawer.p5.line(
    start.x, start.y,
    end.x,   end.y);
}; // drawSegment


exports.drawArc = function(drawer, arc) {
  if (arc.isCircle()) {
    let startRad = arc.start.radians();
    let endRad = startRad + Rac.TAU;
    drawer.p5.arc(
      arc.center.x, arc.center.y,
      arc.radius * 2, arc.radius * 2,
      startRad, endRad);
    return;
  }

  let start = arc.start;
  let end = arc.end;
  if (!arc.clockwise) {
    start = arc.end;
    end = arc.start;
  }

  drawer.p5.arc(
    arc.center.x, arc.center.y,
    arc.radius * 2, arc.radius * 2,
    start.radians(), end.radians());
}; // drawArc


exports.drawText = function(drawer, text) {
  // Text drawRoutine is sets `requiresPushPop`
  // This `apply` gets reverted at `p5Drawer.drawObject`
  text.format.apply(text.point);
  drawer.p5.text(text.string, 0, 0);
}; // drawText


},{"../Rac":2}],33:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Color with RBGA values, each one in the *[0,1]* range.
*
* ### `instance.Color`
*
* Instances of `Rac` contain a convenience
* [`rac.Color` function]{@link Rac#Color} to create `Color` objects with
* fewer parameters. This function also contains ready-made convenience
* objects, like [`rac.Color.red`]{@link instance.Color#red}, listed
* under [`instance.Color`]{@link instance.Color}.
*
* @example
* let rac = new Rac()
* // new instance with constructor
* let color = new Rac.Color(rac, 0.2, 0.4, 0.6)
* // or convenience function
* let otherColor = rac.Color(0.2, 0.4, 0.6)
*
* @see [`rac.Color`]{@link Rac#Color}
* @see [`instance.Color`]{@link instance.Color}
*
* @alias Rac.Color
*/
class Color {

  /**
  * Creates a new `Color` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Number} r - The red channel value, in the *[0,1]* range
  * @param {Number} g - The green channel value, in the *[0,1]* range
  * @param {Number} b - The blue channel value, in the *[0,1]* range
  * @param {Number} [a=1] - The alpha channel value, in the *[0,1]* range
  */
  constructor(rac, r, g, b, a = 1) {
    utils.assertExists(rac, r, g, b, a);
    utils.assertNumber(r, g, b, a);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The red channel of the color, in the *[0,1]* range.
    * @type {Number}
    */
    this.r = r;

    /**
    * The green channel of the color, in the *[0,1]* range.
    * @type {Number}
    */
    this.g = g;

    /**
    * The blue channel of the color, in the *[0,1]* range.
    * @type {Number}
    */
    this.b = b;

    /**
    * The alpha channel of the color, in the *[0,1]* range.
    * @type {Number}
    */
    this.a = a;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * rac.Color(0.1, 0.2, 0.3, 0.4).toString()
  * // returns: 'Color(0.1,0.2,0.3,0.4)'
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const rStr = utils.cutDigits(this.r, digits);
    const gStr = utils.cutDigits(this.g, digits);
    const bStr = utils.cutDigits(this.b, digits);
    const aStr = utils.cutDigits(this.a, digits);
    return `Color(${rStr},${gStr},${bStr},${aStr})`;
  }


  /**
  * Returns `true` when the difference with `otherColor` for each channel
  * is under [`rac.equalityThreshold`]{@link Rac#equalityThreshold};
  * otherwise returns `false`.
  *
  * When `otherColor` is any class other that `Rac.Color`, returns `false`.
  *
  * Values are compared using [`rac.unitaryEquals`]{@link Rac#unitaryEquals}.
  *
  * @param {Rac.Color} otherColor - A `Color` to compare
  * @returns {Boolean}
  * @see [`rac.unitaryEquals`]{@link Rac#unitaryEquals}
  */
  equals(otherColor) {
    return otherColor instanceof Color
      && this.rac.unitaryEquals(this.r, otherColor.r)
      && this.rac.unitaryEquals(this.g, otherColor.g)
      && this.rac.unitaryEquals(this.b, otherColor.b)
      && this.rac.unitaryEquals(this.a, otherColor.a);
  }


  /**
  * Creates a new `Color` instance with each channel received in the
  * *[0,255]* range
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Number} r - The red channel value, in the *[0,255]* range
  * @param {Number} g - The green channel value, in the *[0,255]* range
  * @param {Number} b - The blue channel value, in the *[0,255]* range
  * @param {Number} [a=255] - The alpha channel value, in the *[0,255]* range
  *
  * @returns {Rac.Color}
  */
  static fromRgba(rac, r, g, b, a = 255) {
    return new Color(rac, r/255, g/255, b/255, a/255);
  }


// RELEASE-TODO: update docs here and in instance.fromHex
  /**
  * Creates a new `Color` instance from a hexadecimal triplet string.
  *
  * The `hexString` is expected to have 6 digits and can optionally start
  * with `#`. `AABBCC` and `#DDEEFF` are both valid inputs, the three digit
  * shorthand is not yet supported.
  *
  * An error is thrown if `hexString` is misformatted or cannot be parsed.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {String} hexString - The RGB hex triplet to interpret
  *
  * @returns {Rac.Color}
  */
  static fromHex(rac, hexString) {
    if (hexString.charAt(0) == '#') {
      hexString = hexString.substring(1);
    }

    if (![6, 8].includes(hexString.length)) {
      throw Rac.Exception.failedAssert(
        `Unexpected length for hex triplet string: ${hexString}`);
    }

    let rStr = hexString.substring(0, 2);
    let gStr = hexString.substring(2, 4);
    let bStr = hexString.substring(4, 6);
    let aStr = 'ff';
    if (hexString.length == 8) {
      aStr = hexString.substring(6, 8);
    }

    let newR = parseInt(rStr, 16);
    let newG = parseInt(gStr, 16);
    let newB = parseInt(bStr, 16);
    let newA = parseInt(aStr, 16);

    if (isNaN(newR) || isNaN(newG) || isNaN(newB) || isNaN(newA)) {
      throw Rac.Exception.failedAssert(
        `Could not parse hex triplet string: ${hexString}`);
    }

    return new Color(rac, newR/255, newG/255, newB/255, newA/255);
  }


  /**
  * Returns a new `Fill` that uses `this` as `color`.
  *
  * @returns {Rac.Fill}
  */
  fill() {
    return new Rac.Fill(this.rac, this);
  }


  /**
  * Returns a new `Stroke` that uses `this` as `color`.
  *
  * @param {?Number} weight - The weight of the new `Stroke`
  * @returns {Rac.Stroke}
  */
  stroke(weight = null) {
    return new Rac.Stroke(this.rac, weight, this);
  }


  /**
  * Returns a new `Color` with `a` set to `newAlpha`.
  *
  * @param {Number} newAlpha - The alpha channel for the new `Color`, in the
  *   *[0,1]* range
  * @returns {Rac.Color}
  */
  withAlpha(newAlpha) {
    return new Color(this.rac, this.r, this.g, this.b, newAlpha);
  }


  /**
  * Returns a new `Color` with `a` set to `this.a * ratio`.
  *
  * @param {Number} ratio - The factor to multiply `a` by
  * @returns {Rac.Color}
  */
  withAlphaRatio(ratio) {
    return new Color(this.rac, this.r, this.g, this.b, this.a * ratio);
  }


  /**
  * Returns a new `Color` in the linear transition between `this` and
  * `target` at a `ratio` in the range *[0,1]*.
  *
  * When `ratio` is `0` or less the new `Color` is equivalent to `this`,
  * when `ratio` is `1` or larger the new `Color` is equivalent to
  * `target`.
  *
  * @param {Number} ratio - The transition ratio for the new `Color`
  * @param {Rac.Color} target - The transition target `Color`
  * @returns {Rac.Color}
  */
  linearTransition(ratio, target) {
    ratio = Math.max(ratio, 0);
    ratio = Math.min(ratio, 1);

    let newR = this.r + (target.r - this.r) * ratio;
    let newG = this.g + (target.g - this.g) * ratio;
    let newB = this.b + (target.b - this.b) * ratio;
    let newA = this.a + (target.a - this.a) * ratio;

    return new Color(this.rac, newR, newG, newB, newA);
  }

} // class Color


module.exports = Color;


},{"../Rac":2,"../util/utils":42}],34:[function(require,module,exports){
  'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Fill [color]{@link Rac.Color} for drawing.
*
* Can be used as `fill.apply()` to apply the fill settings globally, or as
* the parameter of `drawable.draw(fill)` to apply the fill only for that
* call.
*
* When `color` is `null` a *no-fill* setting is applied.
*
* ### `instance.Fill`
*
* Instances of `Rac` contain a convenience
* [`rac.Fill` function]{@link Rac#Fill} to create `Fill` objects with
* fewer parameters. This function also contains ready-made convenience
* objects, like [`rac.Fill.none`]{@link instance.Fill#none}, listed
* under [`instance.Fill`]{@link instance.Fill}.
*
* @example
* let rac = new Rac()
* let color = rac.Color(0.2, 0.4, 0.6)
* // new instance with constructor
* let fill = new Rac.Fill(rac, color)
* // or convenience function
* let otherFill = rac.Fill(color)
*
* @see [`rac.Fill`]{@link Rac#Fill}
* @see [`instance.Fill`]{@link instance.Fill}
*
* @alias Rac.Fill
*/
class Fill {

  /**
  * Creates a new `Fill` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {?Rac.Color} color - A `Color` for the fill setting, or `null`
  *   to apply a *no-fill* setting
  */
  constructor(rac, color) {
    utils.assertExists(rac);
    color !== null && utils.assertType(Rac.Color, color);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    // RELEASE-TODO: document
    this.color = color;
  }


  /**
  * Returns a `Fill` derived from `something`.
  *
  * + When `something` is an instance of `Fill`, returns that same object.
  * + When `something` is an instance of `Color`, returns a new `Fill`
  *   using `something` as `color`.
  * + When `something` is an instance of `Stroke`, returns a new `Fill`
  *   using `stroke.color`.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Rac.Fill|Rac.Color|Rac.Stroke} something - An object to
  * derive a `Fill` from
  * @returns {Rac.Fill}
  */
  static from(rac, something) {
    if (something instanceof Fill) {
      return something;
    }
    if (something instanceof Rac.Color) {
      return new Fill(rac, something);
    }
    if (something instanceof Rac.Stroke) {
      return new Fill(rac, something.color);
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Fill - something-type:${utils.typeName(something)}`);
  }


  /**
  * Returns a new `StyleContainer` containing only `this`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, [this]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and `style`. When
  * `style` is `null`, returns `this` instead.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to contain along `this`
  * @returns {Rac.StyleContainer|Rac.Fill}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }
    return new Rac.StyleContainer(this.rac, [this, style]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and the `Stroke`
  * derived [from]{@link Rac.Stroke.from} `someStroke`.
  *
  * @param {Rac.Stroke|Rac.Color|Rac.Fill} someStroke - An object to derive
  *   a `Stroke` from
  * @returns {Rac.StyleContainer}
  *
  * @see [`rac.Stroke.from`]{@link Rac.Stroke.from}
  */
  appendStroke(someStroke) {
    let stroke = Rac.Stroke.from(this.rac, someStroke);
    return new Rac.StyleContainer(this.rac, [this, stroke]);
  }

} // class Fill


module.exports = Fill;


},{"../Rac":2,"../util/utils":42}],35:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Stroke weight and [color]{@link Rac.Color} for drawing.
*
* Can be used as `stroke.apply()` to apply the stroke settings globally, or
* as the parameter of `drawable.draw(stroke)` to apply the stroke only for
* that `draw`.
*
* Applying the instance can have the following behaviours:
* + Applies a **no-stroke** setting; when `color = null` and `weight = null`
* + Applies **only stroke color**, leaving weight unchanged; when `color`
*   is set and `weight = null`
* + Applies **only stroke weight**, leaving color unchanged; when `weight`
*   is set and `color = null`
* + Applies **both weight and color**; when both `color` and `weight` are set
*
* ### `instance.Stroke`
*
* Instances of `Rac` contain a convenience
* [`rac.Stroke` function]{@link Rac#Stroke} to create `Stroke` objects with
* fewer parameters. This function also contains ready-made convenience
* objects, like [`rac.Stroke.none`]{@link instance.Stroke#none}, listed
* under [`instance.Stroke`]{@link instance.Stroke}.
*
* @example
* let rac = new Rac()
* let color = rac.Color(0.2, 0.4, 0.6)
* // new instance with constructor
* let stroke = new Rac.Stroke(rac, 2, color)
* // or convenience function
* let otherStroke = rac.Stroke(2, color)
*
* @see [`rac.Stroke`]{@link Rac#Stroke}
* @see [`instance.Stroke`]{@link instance.Stroke}
*
* @alias Rac.Stroke
*/
class Stroke {

  /**
  * Creates a new `Stroke` instance.
  *
  * @param {Rac} rac -  Instance to use for drawing and creating other objects
  * @param {?Number} weight - The weight of the stroke, or `null` to skip weight
  * @param {?Rac.Color} [color=null] - A `Color` for the stroke, or `null`
  *   to skip color
  */
  constructor(rac, weight, color = null) {
    utils.assertExists(rac);
    weight !== null && utils.assertNumber(weight);
    color !== null && utils.assertType(Rac.Color, color);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac
    this.color = color;
    this.weight = weight;
  }


  /**
  * Returns a `Stroke` derived from `something`.
  *
  * + When `something` is an instance of `Stroke`, returns that same object.
  * + When `something` is an instance of `Color`, returns a new `Stroke`
  *   using `something` as `color` and a `null` stroke weight.
  * + When `something` is an instance of `Fill`, returns a new `Stroke`
  *   using `fill.color` and a `null` stroke weight.
  * + Otherwise an error is thrown.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {Rac.Stroke|Rac.Color|Rac.Fill} something - An object to
  *   derive a `Stroke` from
  * @returns {Rac.Stroke}
  */
  static from(rac, something) {
    if (something instanceof Stroke) {
      return something;
    }
    if (something instanceof Rac.Color) {
      return new Stroke(rac, null, something);
    }
    if (something instanceof Rac.Fill) {
      return new Stroke(rac, null, something.color);
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Stroke - something-type:${utils.typeName(something)}`);
  }


  /**
  * Returns a new `Stroke` with `weight` set to `newWeight`.
  *
  * @param {?Number} newWeight - The weight of the stroke, or `null` to skip
  *   weight
  * @returns {Rac.Stroke}
  */
  withWeight(newWeight) {
    return new Stroke(this.rac, newWeight, this.color,);
  }


  /**
  * Returns a new `Stroke` with a copy of `color` setup with `newAlpha`,
  * and the same `stroke` as `this`.
  *
  * When `this.color` is set to `null`, returns a new `Stroke` that is a
  * copy of `this`.
  *
  * @param {Number} newAlpha - The alpha channel of the `color` of the new
  *   `Stroke`
  * @returns {Rac.Stroke}
  */
  withAlpha(newAlpha) {
    if (this.color === null) {
      return new Stroke(this.rac, this.weight, null);
    }

    let newColor = this.color.withAlpha(newAlpha);
    return new Stroke(this.rac, this.weight, newColor);
  }


  /**
  * Returns a new `StyleContainer` containing only `this`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, [this]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and `style`. When
  * `style` is `null`, returns `this` instead.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to contain along `this`
  * @returns {Rac.StyleContainer|Rac.Stroke}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }
    return new Rac.StyleContainer(this.rac, [this, style]);
  }


  /**
  * Returns a new `StyleContainer` containing `this` and the `Fill`
  * derived [from]{@link Rac.Fill.from} `someFill`.
  *
  * @param {Rac.Fill|Rac.Color|Rac.Stroke} someFill - An object to derive
  *   a `Fill` from
  * @returns {Rac.StyleContainer}
  *
  * @see [`rac.Fill.from`]{@link Rac.Fill.from}
  */
  appendFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.StyleContainer(this.rac, [this, fill]);
  }

} // class Stroke


module.exports = Stroke;


},{"../Rac":2,"../util/utils":42}],36:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of `[Stroke]{@link Rac.Stroke}` and `[Fill]{@link Rac.Fill}`
* objects which get applied sequentially when drawing.
*
* Can be used as `container.apply()` to apply the contained styles
* globally, or as the parameter of `drawable.draw(container)` to apply the
* style settings only for that `draw`.
*
* @alias Rac.StyleContainer
*/
class StyleContainer {

  constructor(rac, styles = []) {
    utils.assertExists(rac);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Container of style objects to apply.
    *
    * Can be manipulated directly to add or remove styles from `this`.
    * Most of the implemented methods like
    * `[add]{@link Rac.StyleContainer#add}` return a new `StyleContainer`
    * with an copy of `this.styles`.
    *
    * @type {Array}
    */
    this.styles = styles;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @returns {String}
  */
  toString() {
    let contents = this.styles.join(' ');
    return `StyleContainer(${contents})`;
  }


  /**
  * Returns a new `StyleContainer` containing a copy of `this.styles`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, this.styles.slice());
  }


  /**
  * Returns a new `StyleContainer` with `style` appended at the end of
  * `styles`. When `style` is `null`, returns `this` instead.
  *
  * `this` is not modified by this method, the new `StyleContainer` is
  * created with a copy of `this.styles`.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to append to `styles`
  * @returns {Rac.StyleContainer}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }

    let stylesCopy = this.styles.slice();
    stylesCopy.push(style);
    return new Rac.StyleContainer(this.rac, stylesCopy);
  }

} // class StyleContainer


module.exports = StyleContainer;


},{"../Rac":2,"../util/utils":42}],37:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* Members and methods attached to the
* [`rac.Color` function]{@link Rac#Color}.
*
* The function contains ready-made convenience
* [`Color`]{@link Rac.Color} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Color.red // ready-made red color
* rac.Color.red.rac === rac // true
*
* @namespace instance.Color
*/
module.exports = function attachRacColor(rac) {
  // Intended to receive a Rac instance as parameter


  /**
  * Returns a new `Color` with each channel received in the *[0,255]* range.
  *
  * @param {Number} r - The red channel value, in the *[0,255]* range
  * @param {Number} g - The green channel value, in the *[0,255]* range
  * @param {Number} b - The blue channel value, in the *[0,255]* range
  * @param {Number} [a=255] - The alpha channel value, in the *[0,255]* range
  *
  * @returns {Rac.Color}
  *
  * @function fromRgba
  * @memberof instance.Color#
  */
  rac.Color.fromRgba = function(r, g, b, a = 255) {
    return Rac.Color.fromRgba(rac, r, g, b, a);
  };


  /**
  * Returns a new `Color` instance from a hexadecimal triplet string.
  *
  * The `hexString` is expected to have 6 digits and can optionally start
  * with `#`. `AABBCC` and `#DDEEFF` are both valid inputs, the three digit
  * shorthand is not yet supported.
  *
  * An error is thrown if `hexString` is misformatted or cannot be parsed.
  *
  * @param {String} hexString - The RGB hex triplet to interpret
  * @returns {Rac.Color}
  *
  * @function fromHex
  * @memberof instance.Color#
  */
  rac.Color.fromHex = function(hexString) {
    return Rac.Color.fromHex(rac, hexString);
  }


  /**
  * A `Color` with all channels set to `0`.
  *
  * @name zero
  * @memberof instance.Color#
  */
  rac.Color.zero = rac.Color(0, 0, 0, 0);


  /**
  * A black `Color`.
  *
  * @name black
  * @memberof instance.Color#
  */
  rac.Color.black   = rac.Color(0, 0, 0);

  /**
  * A white `Color`, with all channels set to `1`.
  *
  * Also available as `one`.
  *
  * @name white
  * @memberof instance.Color#
  */
  rac.Color.white   = rac.Color(1, 1, 1);
  rac.Color.one = rac.Color.white;

  /**
  * A red `Color`.
  *
  * @name red
  * @memberof instance.Color#
  */
  rac.Color.red     = rac.Color(1, 0, 0);

  rac.Color.green   = rac.Color(0, 1, 0);
  rac.Color.blue    = rac.Color(0, 0, 1);
  rac.Color.yellow  = rac.Color(1, 1, 0);
  rac.Color.magenta = rac.Color(1, 0, 1);
  rac.Color.cyan    = rac.Color(0, 1, 1);

} // attachRacColor


},{"../Rac":2}],38:[function(require,module,exports){
'use strict';


/**
* Members and methods attached to the
* [`rac.Fill` function]{@link Rac#Fill}.
*
* The function contains ready-made convenience
* [`Fill`]{@link Rac.Fill} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Fill.none // ready-made none fill
* rac.Fill.none.rac === rac // true
*
* @namespace instance.Fill
*/
module.exports = function attachRacFill(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Fill` without color. Removes the fill color when applied.
  * @name none
  * @memberof instance.Fill#
  */
  rac.Fill.none = rac.Fill(null);

} // attachRacFill


},{}],39:[function(require,module,exports){
'use strict';


/**
* Members and methods attached to the
* [`rac.Stroke` function]{@link Rac#Stroke}.
*
* The function contains ready-made convenience
* [`Stroke`]{@link Rac.Stroke} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Stroke.none // ready-made none stroke
* rac.Stroke.none.rac === rac // true
*
* @namespace instance.Stroke
*/
module.exports = function attachRacStroke(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Stroke` with no weight and no color. Using or applying this stroke
  * will disable stroke drawing.
  *
  * @name none
  * @memberof instance.Stroke#
  */
  rac.Stroke.none = rac.Stroke(null);


  /**
  * A `Stroke` with `weight = 1` and no color. Using or applying this
  * stroke will only set the stroke weight to `1` leaving stroke color
  * unchanged.
  *
  * @name one
  * @memberof instance.Stroke#
  */
  rac.Stroke.one = rac.Stroke(1);

} // attachRacStroke


},{}],40:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


// Implementation of an ease function with several options to tailor its
// behaviour. The calculation takes the following steps:
// Value is received, prefix is removed
//   Value -> easeValue(value)
//     value = value - prefix
// Ratio is calculated
//   ratio = value / inRange
// Ratio is adjusted
//   ratio -> easeRatio(ratio)
//     adjustedRatio = (ratio + ratioOfset) * ratioFactor
// Ease is calculated
//   easedRatio = easeUnit(adjustedRatio)
// EasedRatio is adjusted and returned
//   easedRatio = (easedRatio + easeOfset) * easeFactor
//   easeRatio(ratio) -> easedRatio
// Value is projected
//   easedValue = value * easedRatio
// Value is adjusted and returned
//   easedValue = prefix + (easedValue * outRange)
//   easeValue(value) -> easedValue
class EaseFunction {

  // Behaviors for the `easeValue` function when `value` falls before the
  // `prefix` and after `inRange`.
  static Behavior = {
    // `value` is returned without any easing transformation. `preFactor`
    // and `postFactor` are applied. This is the default configuration.
    pass: "pass",
    // Clamps the returned value to `prefix` or `prefix+inRange`;
    clamp: "clamp",
    // Returns the applied easing transformation to `value` for values
    // before `prefix` and after `inRange`.
    continue: "continue"
  };

  constructor() {
    this.a = 2;

    // Applied to ratio before easing.
    this.ratioOffset = 0
    this.ratioFactor = 1;

    // Applied to easedRatio.
    this.easeOffset = 0
    this.easeFactor = 1;

    // Defines the lower limit of `value`` to apply easing.
    this.prefix = 0;

    // `value` is received in `inRange` and output in `outRange`.
    this.inRange = 1;
    this.outRange = 1;

    // Behavior for values before `prefix`.
    this.preBehavior = EaseFunction.Behavior.pass;
    // Behavior for values after `prefix+inRange`.
    this.postBehavior = EaseFunction.Behavior.pass;

    // For a `preBehavior` of `pass`, the factor applied to values before
    // `prefix`.
    this.preFactor = 1;
    // For a `postBehavior` of `pass`, the factor applied to the values
    // after `prefix+inRange`.
    this.postFactor = 1;
  }

  // Returns the corresponding eased value for `unit`. Both the given
  // `unit` and the returned value are in the [0,1] range. If `unit` is
  // outside the [0,1] the returned value follows the curve of the easing
  // function, which may be invalid for some values of `a`.
  //
  // This function is the base easing function, it does not apply any
  // offsets or factors.
  easeUnit(unit) {
    // Source:
    // https://math.stackexchange.com/questions/121720/ease-in-out-function/121755#121755
    // f(t) = (t^a)/(t^a+(1-t)^a)
    let ra = Math.pow(unit, this.a);
    let ira = Math.pow(1-unit, this.a);
    return ra / (ra + ira);
  }

  // Returns the ease function applied to the given ratio. `ratioOffset`
  // and `ratioFactor` are applied to the input, `easeOffset` and
  // `easeFactor` are applied to the output.
  easeRatio(ratio) {
    let adjustedRatio = (ratio + this.ratioOffset) * this.ratioFactor;
    let easedRatio = this.easeUnit(adjustedRatio);
    return (easedRatio + this.easeOffset) * this.easeFactor;
  }

  // Applies the easing function to `value` considering the configuration
  // of the whole instance.
  easeValue(value) {
    let behavior = EaseFunction.Behavior;

    let shiftedValue = value - this.prefix;
    let ratio = shiftedValue / this.inRange;

    // Before prefix
    if (value < this.prefix) {
      if (this.preBehavior === behavior.pass) {
        let distancetoPrefix = value - this.prefix;
        // With a preFactor of 1 this is equivalent to `return range`
        return this.prefix + (distancetoPrefix * this.preFactor);
      }
      if (this.preBehavior === behavior.clamp) {
        return this.prefix;
      }
      if (this.preBehavior === behavior.continue) {
        let easedRatio = this.easeRatio(ratio);
        return this.prefix + easedRatio * this.outRange;
      }

      console.trace(`Invalid preBehavior configuration - preBehavior:${this.postBehavior}`);
      throw rac.Error.invalidObjectConfiguration;
    }

    // After prefix
    if (ratio <= 1 || this.postBehavior === behavior.continue) {
      // Ease function applied within range (or after)
      let easedRatio = this.easeRatio(ratio);
      return this.prefix + easedRatio * this.outRange;
    }
    if (this.postBehavior === behavior.pass) {
      // Shifted to have inRange as origin
      let shiftedPost = shiftedValue - this.inRange;
      return this.prefix + this.outRange + shiftedPost * this.postFactor;
    }
    if (this.postBehavior === behavior.clamp) {
      return this.prefix + this.outRange;
    }

    console.trace(`Invalid postBehavior configuration - postBehavior:${this.postBehavior}`);
    throw rac.Error.invalidObjectConfiguration;
  }


  // Preconfigured functions

  // Makes an easeFunction preconfigured to an ease out motion.
  //
  // The `outRange` value should be `inRange*2` in order for the ease
  // motion to connect with the external motion at the correct velocity.
  static makeEaseOut() {
    let easeOut = new EaseFunction()
    easeOut.ratioOffset = 1;
    easeOut.ratioFactor = .5;
    easeOut.easeOffset = -.5;
    easeOut.easeFactor = 2;
    return easeOut;
  }

} // class EaseFunction


module.exports = EaseFunction;


},{"../Rac":2,"../util/utils":42}],41:[function(require,module,exports){
'use strict';


/**
* Throwable object to report errors, and container of convenience functions
* to create these.
*
* The static functions create either `Exception` or `Error` instances,
* since different environments respond differentely to these throws. For
* more details see [`buildsErrors`]{@link Rac.Exception.buildsErrors}.
*
* @alias Rac.Exception
*/
class Exception {

  /**
  * Creates a new `Exception` instance.
  * @param {String} name
  *   The name of the exception
  * @param {String} message
  *   The message of the exception
  */
  constructor(name, message) {
    this.name = name;
    this.message = message;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * (new Rac.Exception('NotAPangram', 'Waltz, bad nymph')).toString()
  * // Returns: 'Exception:NotAPangram - Waltz, bad nymph'
  *
  * @returns {String}
  */
  toString() {
    return `Exception:${this.name} - ${this.message}`;
  }


  /**
  * When `true` the convenience static functions of this class will
  * build `Error` objects, otherwise `Exception` objects are built.
  *
  * Defaults to `false` for browser use: throwing an `Exception` in chrome
  * displays the error stack using source-maps when available. In contrast
  * throwing an `Error` object displays the error stack relative to the
  * bundled file, which is harder to read.
  *
  * Used as `true` for test runs in Jest: throwing an `Error` will be
  * reported in the test report, while throwing a custom object (like
  * `Exception`) within a matcher results in the expectation hanging
  * indefinitely.
  *
  * @type {Boolean}
  * @default false
  *
  * @memberof Rac.Exception
  */
  static buildsErrors = false;


  /**
  * Returns a factory function that builds throwable objects with the given
  * `name`.
  *
  * @example
  * let factory = Rac.Exception.named('NotAPangram')
  * factory.exceptionName // returns 'NotAPangram'
  * factory('Waltz, bad nymph').toString()
  * // returns: 'Exception:NotAPangram - Waltz, bad nymph'
  *
  * @param {String} name - The name for the produced throwable objects
  * @return {Rac.Exception~namedFactory}
  */
  static named(name) {
    /**
    * Factory function that returns a throwable object with the given
    * `message`.
    *
    * @callback Rac.Exception~namedFactory
    *
    * @property {String} exceptionName
    *   The name for the produced throwable objects
    * @param {String} message
    *   The message for the produced throwable object.
    *
    * @return {Exception|Error}
    */
    let func = (message) => {
      if (Exception.buildsErrors) {
        const error = new Error(message);
        error.name = name;
        return error;
      }

      return new Exception(name, message);
    };

    func.exceptionName = name;
    return func;
  }

  static drawerNotSetup             = Exception.named('DrawerNotSetup');
  static failedAssert               = Exception.named('FailedAssert');
  static invalidObjectType          = Exception.named('InvalidObjectType');
  static abstractFunctionCalled     = Exception.named('AbstractFunctionCalled');
  // TODO: migrate rest of invalidObjectConfiguration
  static invalidObjectConfiguration = Exception.named('InvalidObjectConfiguration');

  // invalidParameterCombination: 'Invalid parameter combination',

  // invalidObjectToDraw: 'Invalid object to draw',
  // invalidObjectToApply: 'Invalid object to apply',

} // class Exception


module.exports = Exception;


},{}],42:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* Internal utilities.
*
* Available through `{@link Rac.utils}` or [`rac.utils`]{@link Rac#utils}.
*
* @namespace utils
*/


/**
* Asserts that all passed parameters are objects or primitives. If any
* parameter is `null` or `undefined` a `{@link Rac.Exception.failedAssert}`
* is thrown.
*
* @param {...(Object|primitive)} parameters
* @returns {Boolean}
*
* @function assertExists
* @memberof utils#
*/
exports.assertExists = function(...parameters) {
  parameters.forEach((item, index) => {
    if (item === null) {
      throw Rac.Exception.failedAssert(
        `Found null, expecting element to exist at index ${index}`);
    }
    if (item === undefined) {
      throw Rac.Exception.failedAssert(
        `Found undefined, expecting element to exist at index ${index}`);
    }
  });
}


/**
* Asserts that all `elements` are objects or the given `type`, otherwise a
* `{@link Rac.Exception.failedAssert}` is thrown.
*
* When any member of `elements` is `null` or `undefined`, the exception is
* also thrown.
*
* @param {function} type
* @param {...Object} elements
*
* @returns {Boolean}
*
* @function assertType
* @memberof utils#
*/
exports.assertType = function(type, ...elements) {
  elements.forEach(item => {
    if (!(item instanceof type)) {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type - element-type:${typeName(item)} expected-type-name:${type.name} element:${item}`);
    }
  });
}


/**
* Asserts that all `elements` are number primitives and not NaN, otherwise
* a `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {...Number} elements
* @returns {Boolean}
*
* @function assertNumber
* @memberof utils#
*/
exports.assertNumber = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'number' || isNaN(item)) {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type, expecting number primitive - element-type:${typeName(item)} element:${item}`);
    }
  });
}


/**
* Asserts that all `elements` are string primitives, otherwise
* a `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {...String} elements
* @returns {Boolean}
*
* @function assertString
* @memberof utils#
*/
exports.assertString = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'string') {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type, expecting string primitive - element-type:${typeName(item)} element:${item}`);
    }
  });
}


/**
* Asserts that all `elements` are boolean primitives, otherwise a
* `{@link Rac.Exception.failedAssert}` is thrown.
*
* @param {...Boolean} elements
* @returns {Boolean}
*
* @function assertBoolean
* @memberof utils#
*/
exports.assertBoolean = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'boolean') {
      throw Rac.Exception.failedAssert(
        `Element is unexpected type, expecting boolean primitive - element-type:${typeName(item)} element:${item}`);
    }
  });
}


/**
* Returns the constructor name of `obj`, or its type name.
* Convenience function for debugging and errors.
*
* @param {Object} obj - An `Object` to get its type name
* @returns {String}
*
* @function typeName
* @memberof utils#
*/
function typeName(obj) {
  if (obj === undefined) { return 'undefined'; }
  if (obj === null) { return 'null'; }

  if (typeof obj === 'function' && obj.name != null) {
    return obj.name == ''
      ? `function`
      : `function:${obj.name}`;
  }
  return obj.constructor.name ?? typeof obj;
}
exports.typeName = typeName;


/**
* Adds a constant to the given object, the constant is not enumerable and
* not configurable.
*
* @function addConstantTo
* @memberof utils#
*/
exports.addConstantTo = function(obj, propName, value) {
  Object.defineProperty(obj, propName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });
}


/**
* Returns a string representation of `number` displaying all available
* digits, or formmatted used fixed-point notation limited to `digits`.
*
* @param {Number} number - The number to format
* @param {?Number} [digits] - The amount of digits to print, or `null` to
* print all digits
*
* @returns {String}
*
* @function cutDigits
* @memberof utils#
*/
exports.cutDigits = function(number, digits = null) {
  return digits === null
    ? number.toString()
    : number.toFixed(digits);
}


/**
* Returns `true` if text oriented with the given `angleTurn` would be
* printed upright.
*
* Angle turn values in the range _[3/4, 1/4)_ are considered upright.
*
* @param {Number} angleTurn - The turn value of the angle to check
* @returns {Boolean}
*
* @function isUprightText
* @memberof utils#
*/
exports.isUprightText = function(angleTurn) {
  return angleTurn >= 3/4 || angleTurn < 1/4;
}


},{"../Rac":2}]},{},[26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uaW5nLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5Gb3JtYXQuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2MUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNubEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZVN0cmljdCc7XG5cbi8vIFJ1bGVyIGFuZCBDb21wYXNzIC0gdmVyc2lvbiBhbmQgYnVpbGRcbi8qKlxuKiBDb250YWluZXIgb2YgdGhlIHZlcnNpb25pbmcgZGF0YSBmb3IgdGhlIHBhY2thZ2UuXG4qIEBuYW1lc3BhY2UgdmVyc2lvbmluZ1xuKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAqIFZlcnNpb24gb2YgdGhlIHBhY2thZ2UuIEV4cG9zZWQgdGhyb3VnaFxuICAqIFtgUmFjLnZlcnNpb25gXXtAbGluayBSYWMudmVyc2lvbn0uXG4gICogQGNvbnN0YW50IHtTdHJpbmd9IHZlcnNpb25cbiAgKiBAbWVtYmVyb2YgdmVyc2lvbmluZyNcbiAgKi9cbiAgdmVyc2lvbjogJzEuMy4wLWRldicsXG5cbiAgLyoqXG4gICogQnVpbGQgb2YgdGhlIHBhY2thZ2UuIEV4cG9zZWQgdGhyb3VnaFxuICAqIFtgUmFjLmJ1aWxkYF17QGxpbmsgUmFjLmJ1aWxkfS5cbiAgKiBAY29uc3RhbnQge1N0cmluZ30gYnVpbGRcbiAgKiBAbWVtYmVyb2YgdmVyc2lvbmluZyNcbiAgKi9cbiAgYnVpbGQ6ICdsb2NhbEJ1aWxkLTEyODItYTQwMmVmNycsXG5cbiAgLyoqXG4gICogRGF0ZSBvZiBidWlsZCBvZiB0aGUgcGFja2FnZS4gRXhwb3NlZCB0aHJvdWdoXG4gICogW2BSYWMuZGF0ZWRgXXtAbGluayBSYWMuZGF0ZWR9LlxuICAqIEBjb25zdGFudCB7U3RyaW5nfSBkYXRlZFxuICAqIEBtZW1iZXJvZiB2ZXJzaW9uaW5nI1xuICAqL1xuICBkYXRlZDogJzIwMjMtMTAtMDZUMDc6Mjk6NTEuNTYzWidcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vLyBSdWxlciBhbmQgQ29tcGFzc1xuY29uc3QgdmVyc2lvbmluZyA9IHJlcXVpcmUoJy4uL2J1aWx0L3ZlcnNpb25pbmcnKVxuY29uc3QgdmVyc2lvbiA9IHZlcnNpb25pbmcudmVyc2lvbjtcbmNvbnN0IGJ1aWxkICAgPSB2ZXJzaW9uaW5nLmJ1aWxkO1xuY29uc3QgZGF0ZWQgICA9IHZlcnNpb25pbmcuZGF0ZWQ7XG5cblxuLyoqXG4qIFJvb3QgY2xhc3Mgb2YgUkFDLiBBbGwgZHJhd2FibGUsIHN0eWxlLCBjb250cm9sLCBhbmQgZHJhd2VyIGNsYXNzZXMgYXJlXG4qIGNvbnRhaW5lZCBpbiB0aGlzIGNsYXNzLlxuKlxuKiBBbiBpbnN0YW5jZSBtdXN0IGJlIGNyZWF0ZWQgd2l0aCBgbmV3IFJhYygpYCBpbiBvcmRlciB0b1xuKiBidWlsZCBkcmF3YWJsZSwgc3R5bGUsIGFuZCBvdGhlciBvYmplY3RzLlxuKlxuKiBUbyBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucywgYSBkcmF3ZXIgbXVzdCBiZSBzZXR1cCB3aXRoXG4qIFtgc2V0dXBEcmF3ZXJgXXtAbGluayBSYWMjc2V0dXBEcmF3ZXJ9LiBDdXJyZW50bHkgdGhlIG9ubHkgYXZhaWxhYmxlXG4qIGltcGxlbWVudGF0aW9uIGlzIFtgUDVEcmF3ZXJgXXtAbGluayBSYWMuUDVEcmF3ZXJ9LlxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMudmVyc2lvbiAvLyBleGFtcGxlIHJldHVybjogJzEuMi4xJ1xuICAgICpcbiAgICAqIEBjb25zdGFudCB7U3RyaW5nfSB2ZXJzaW9uXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAndmVyc2lvbicsIHZlcnNpb24pO1xuXG5cbiAgICAvKipcbiAgICAqIEJ1aWxkIG9mIHRoZSBpbnN0YW5jZSwgc2FtZSBhcyBge0BsaW5rIFJhYy5idWlsZH1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMuYnVpbGQgLy8gZXhhbXBsZSByZXR1cm46ICcxMDU3LTk0YjA1OWQnXG4gICAgKlxuICAgICogQGNvbnN0YW50IHtTdHJpbmd9IGJ1aWxkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuICAgIC8qKlxuICAgICogRGF0ZSBvZiB0aGUgYnVpbGQgb2YgdGhlIGluc3RhbmNlLCBzYW1lIGFzIGB7QGxpbmsgUmFjLmRhdGVkfWAuXG4gICAgKlxuICAgICogQGV4YW1wbGVcbiAgICAqIHJhYy5kYXRlZCAvLyBleGFtcGxlIHJldHVybjogJzIwMjItMTAtMTNUMjM6MDY6MTIuNTAwWidcbiAgICAqXG4gICAgKiBAY29uc3RhbnQge1N0cmluZ30gZGF0ZWRcbiAgICAqIEBtZW1iZXJvZiBSYWMjXG4gICAgKi9cbiAgICB1dGlscy5hZGRDb25zdGFudFRvKHRoaXMsICdkYXRlZCcsIGRhdGVkKTtcblxuXG4gICAgLyoqXG4gICAgKiBWYWx1ZSB1c2VkIHRvIGRldGVybWluZSBlcXVhbGl0eSBiZXR3ZWVuIHR3byBudW1lcmljIHZhbHVlcy4gVXNlZCBmb3JcbiAgICAqIHZhbHVlcyB0aGF0IHRlbmQgdG8gYmUgaW50ZWdlcnMsIGxpa2Ugc2NyZWVuIGNvb3JkaW5hdGVzLiBVc2VkIGJ5XG4gICAgKiBbYGVxdWFsc2Bde0BsaW5rIFJhYyNlcXVhbHN9LlxuICAgICpcbiAgICAqIFdoZW4gY2hlY2tpbmcgZm9yIGVxdWFsaXR5IGB4YCBpcyBlcXVhbCB0byBub24taW5jbHVzaXZlXG4gICAgKiBgKHgtZXF1YWxpdHlUaHJlc2hvbGQsIHgrZXF1YWxpdHlUaHJlc2hvbGQpYDpcbiAgICAqICsgYHhgIGlzICoqbm90IGVxdWFsKiogdG8gYHggwrEgZXF1YWxpdHlUaHJlc2hvbGRgXG4gICAgKiArIGB4YCBpcyAqKmVxdWFsKiogdG8gYHggwrEgZXF1YWxpdHlUaHJlc2hvbGQvMmBcbiAgICAqXG4gICAgKiBEdWUgdG8gZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIHNvbWUgb3BlcnRhdGlvbiBsaWtlIGludGVyc2VjdGlvbnNcbiAgICAqIGNhbiByZXR1cm4gb2RkIG9yIG9zY2lsYXRpbmcgdmFsdWVzLiBUaGlzIHRocmVzaG9sZCBpcyB1c2VkIHRvIHNuYXBcbiAgICAqIHZhbHVlcyB0b28gY2xvc2UgdG8gYSBsaW1pdCwgYXMgdG8gcHJldmVudCBvc2NpbGF0aW5nIGVmZWN0cyBpblxuICAgICogdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBiYXNlZCBvbiBgMS8xMDAwYCBvZiBhIHBvaW50LlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwLjAwMVxuICAgICovXG4gICAgdGhpcy5lcXVhbGl0eVRocmVzaG9sZCA9IDAuMDAxO1xuXG5cbiAgICAvKipcbiAgICAqIFZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5IGJldHdlZW4gdHdvIHVuaXRhcnkgbnVtZXJpYyB2YWx1ZXMuXG4gICAgKiBVc2VkIGZvciB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGV4aXN0IGluIHRoZSBgWzAsIDFdYCByYW5nZSwgbGlrZVxuICAgICogW2BhbmdsZS50dXJuYF17QGxpbmsgUmFjLkFuZ2xlI3R1cm59LiBVc2VkIGJ5XG4gICAgKiBbYHVuaXRhcnlFcXVhbHNgXXtAbGluayBSYWMjdW5pdGFyeUVxdWFsc30uXG4gICAgKlxuICAgICogRXF1YWxpdHkgbG9naWMgaXMgdGhlIHNhbWUgYXNcbiAgICAqIFtgZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9LlxuICAgICpcbiAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIGJhc2VkIG9uIDEvMTAwMCBvZiB0aGUgdHVybiBvZiBhbiBjb21wbGV0ZVxuICAgICogY2lyY2xlIGFyYyBvZiByYWRpdXMgNTAwOlxuICAgICogYGBgXG4gICAgKiAxLyg1MDAqNi4yOCkvMTAwMCA9IDAuMDAwXzAwMF8zMTg0NzEzMzhcbiAgICAqIGBgYFxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwLjAwMF8wMDBfM1xuICAgICovXG4gICAgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMDAwMDM7XG5cblxuICAgIC8qKlxuICAgICogQ29udGFpbmVyIG9mIHV0aWxpdHkgZnVuY3Rpb25zLiBTZWUgdGhlXG4gICAgKiBbYHV0aWxzYCBuYW1lc3BhY2Vde0BsaW5rIHV0aWxzfSBmb3IgdGhlIGF2YWlsYWJsZSBtZW1iZXJzLlxuICAgICpcbiAgICAqIEFsc28gYXZhaWxhYmxlIHRocm91Z2ggYHtAbGluayBSYWMudXRpbHN9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7dXRpbHN9XG4gICAgKi9cbiAgICB0aGlzLnV0aWxzID0gdXRpbHNcblxuICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICB0aGlzLnNoYXBlU3RhY2sgPSBbXTtcbiAgICB0aGlzLmNvbXBvc2l0ZVN0YWNrID0gW107XG5cblxuICAgIC8qKlxuICAgICogRGVmYXVsdHMgZm9yIHRoZSBvcHRpb25hbCBwcm9wZXJ0aWVzIG9mXG4gICAgKiBbYFRleHQuRm9ybWF0YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0fS5cbiAgICAqXG4gICAgKiBXaGVuIGEgW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IGlzIGRyYXcgd2hpY2hcbiAgICAqIFtgZm9ybWF0LmZvbnRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjZm9udH0gb3JcbiAgICAqIFtgZm9ybWF0LnNpemVgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjc2l6ZX0gYXJlIHNldCB0byBgbnVsbGAsIHRoZVxuICAgICogdmFsdWVzIHNldCBoZXJlIGFyZSB1c2VkIGluc3RlYWQuXG4gICAgKlxuICAgICogQHByb3BlcnR5IHs/U3RyaW5nfSBmb250PW51bGxcbiAgICAqICAgRGVmYXVsdCBmb250LCB1c2VkIHdoZW4gZHJhd2luZyBhIGBUZXh0YCB3aGljaFxuICAgICogICBbYGZvcm1hdC5mb250YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2ZvbnR9IGlzIHNldCB0byBgbnVsbGA7IHdoZW5cbiAgICAqICAgc2V0IHRvIGBudWxsYCB0aGUgZm9udCBpcyBub3Qgc2V0IHVwb24gZHJhd2luZ1xuICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNpemU9MTVcbiAgICAqICAgRGVmYXVsdCBzaXplLCB1c2VkIHdoZW4gZHJhd2luZyBhIGBUZXh0YCB3aGljaFxuICAgICogICBbYGZvcm1hdC5zaXplYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3NpemV9IGlzIHNldCB0byBgbnVsbGBcbiAgICAqXG4gICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICovXG4gICAgdGhpcy50ZXh0Rm9ybWF0RGVmYXVsdHMgPSB7XG4gICAgICBmb250OiBudWxsLFxuICAgICAgc2l6ZTogMTVcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAqIERyYXdlciBvZiB0aGUgaW5zdGFuY2UuIFRoaXMgb2JqZWN0IGhhbmRsZXMgdGhlIGRyYXdpbmcgZm9yIGFsbFxuICAgICogZHJhd2FibGUgb2JqZWN0IGNyZWF0ZWQgdXNpbmcgYHRoaXNgLlxuICAgICogQHR5cGUgez9PYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRyYXdlciA9IG51bGw7XG5cbiAgICByZXF1aXJlKCcuL2F0dGFjaEluc3RhbmNlRnVuY3Rpb25zJykodGhpcyk7XG5cbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkNvbG9yJykgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLlN0cm9rZScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkZpbGwnKSAgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFuZ2xlJykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50JykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlJheScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlNlZ21lbnQnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFyYycpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkJlemllcicpICh0aGlzKTtcblxuICAgIC8vIERlcGVuZHMgb24gaW5zdGFuY2UuUG9pbnQgYW5kIGluc3RhbmNlLkFuZ2xlIGJlaW5nIGFscmVhZHkgc2V0dXBcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlRleHQnKSh0aGlzKTtcblxuXG4gICAgLyoqXG4gICAgKiBDb250cm9sbGVyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3MgaGFuZGxlcyBhbGwgb2YgdGhlIGNvbnRyb2xzXG4gICAgKiBhbmQgcG9pbnRlciBldmVudHMgcmVsYXRlZCB0byB0aGlzIGluc3RhbmNlIG9mIGBSYWNgLlxuICAgICovXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFJhYy5Db250cm9sbGVyKHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIHRoZSBkcmF3ZXIgZm9yIHRoZSBpbnN0YW5jZS4gQ3VycmVudGx5IG9ubHkgYSBwNS5qcyBpbnN0YW5jZSBpc1xuICAqIHN1cHBvcnRlZC5cbiAgKlxuICAqIFRoZSBkcmF3ZXIgd2lsbCBhbHNvIHBvcHVsYXRlIHNvbWUgY2xhc3NlcyB3aXRoIHByb3RvdHlwZSBmdW5jdGlvbnNcbiAgKiByZWxldmFudCB0byB0aGUgZHJhd2VyLiBGb3IgcDUuanMgdGhpcyBpbmNsdWRlIGBhcHBseWAgZnVuY3Rpb25zIGZvclxuICAqIGNvbG9ycyBhbmQgc3R5bGUgb2JqZWN0LCBhbmQgYHZlcnRleGAgZnVuY3Rpb25zIGZvciBkcmF3YWJsZSBvYmplY3RzLlxuICAqXG4gICogQHBhcmFtIHtQNX0gcDVJbnN0YW5jZVxuICAqL1xuICBzZXR1cERyYXdlcihwNUluc3RhbmNlKSB7XG4gICAgdGhpcy5kcmF3ZXIgPSBuZXcgUmFjLlA1RHJhd2VyKHRoaXMsIHA1SW5zdGFuY2UpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIGBhYCBhbmQgYGJgIGlzXG4gICogdW5kZXIgW2BlcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH0uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gYSAtIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBlcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5lcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBbYHVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9LlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge051bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICB1bml0YXJ5RXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIHB1c2hTdGFjayhvYmopIHtcbiAgICB0aGlzLnN0YWNrLnB1c2gob2JqKTtcbiAgfVxuXG5cbiAgcGVla1N0YWNrKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wU3RhY2soKSB7XG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGFjay5wb3AoKTtcbiAgfVxuXG5cbiAgcHVzaFNoYXBlKHNoYXBlID0gbnVsbCkge1xuICAgIHNoYXBlID0gc2hhcGUgPz8gbmV3IFJhYy5TaGFwZSh0aGlzKTtcbiAgICB0aGlzLnNoYXBlU3RhY2sucHVzaChzaGFwZSk7XG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cblxuICBwZWVrU2hhcGUoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNoYXBlU3RhY2tbdGhpcy5zaGFwZVN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BTaGFwZSgpIHtcbiAgICBpZiAodGhpcy5zaGFwZVN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2hhcGVTdGFjay5wb3AoKTtcbiAgfVxuXG5cbiAgcHVzaENvbXBvc2l0ZShjb21wb3NpdGUpIHtcbiAgICBjb21wb3NpdGUgPSBjb21wb3NpdGUgPz8gbmV3IFJhYy5Db21wb3NpdGUodGhpcyk7XG4gICAgdGhpcy5jb21wb3NpdGVTdGFjay5wdXNoKGNvbXBvc2l0ZSk7XG4gICAgcmV0dXJuIGNvbXBvc2l0ZTtcbiAgfVxuXG5cbiAgcGVla0NvbXBvc2l0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZVN0YWNrW3RoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcENvbXBvc2l0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZVN0YWNrLnBvcCgpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmFjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYWM7XG5cblxuLy8gQWxsIGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgc2hvdWxkIGJlIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgY2xhc3Ncbi8vIGFzIHRvIHByZXZlbnQgY3ljbGljIGRlcGVuZGVuY3kgd2l0aCBSYWMuXG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiB1dGlsaXR5IGZ1bmN0aW9ucy4gU2VlIHRoZSBbYHV0aWxzYCBuYW1lc3BhY2Vde0BsaW5rIHV0aWxzfVxuKiBmb3IgdGhlIGF2YWlsYWJsZSBtZW1iZXJzLlxuKlxuKiBBbHNvIGF2YWlsYWJsZSB0aHJvdWdoIFtgcmFjLnV0aWxzYF17QGxpbmsgUmFjI3V0aWxzfS5cbipcbiogQHZhciB7dXRpbHN9XG4qIEBtZW1iZXJvZiBSYWNcbiovXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoYC4vdXRpbC91dGlsc2ApO1xuUmFjLnV0aWxzID0gdXRpbHM7XG5cblxuLyoqXG4qIFZlcnNpb24gb2YgdGhlIGNsYXNzLiBTYW1lIGFzIHRoZSB2ZXJzaW9uIHVzZWQgZm9yIHRoZSBucG0gcGFja2FnZS5cbipcbiogQGV4YW1wbGVcbiogUmFjLnZlcnNpb24gLy8gZXhhbXBsZSByZXR1cm46ICcxLjIuMSdcbipcbiogQGNvbnN0YW50IHtTdHJpbmd9IHZlcnNpb25cbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAndmVyc2lvbicsIHZlcnNpb24pO1xuXG5cbi8qKlxuKiBCdWlsZCBvZiB0aGUgY2xhc3MuIEludGVuZGVkIGZvciBkZWJ1Z2dpbmcgcHVycG91c2VzLlxuKlxuKiBDb250YWlucyBhIGNvbW1pdC1jb3VudCBhbmQgc2hvcnQtaGFzaCBvZiB0aGUgcmVwb3NpdG9yeSB3aGVuIHRoZSBidWlsZFxuKiB3YXMgZG9uZS5cbipcbiogQGV4YW1wbGVcbiogUmFjLmJ1aWxkIC8vIGV4YW1wbGUgcmV0dXJuOiAnMTA1Ny05NGIwNTlkJ1xuKlxuKiBAY29uc3RhbnQge1N0cmluZ30gYnVpbGRcbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuXG4vKipcbiogRGF0ZSBvZiB0aGUgYnVpbGQgb2YgdGhlIGNsYXNzLiBJbnRlbmRlZCBmb3IgZGVidWdnaW5nIHB1cnBvdXNlcy5cbipcbiogQ29udGFpbnMgYSBbSVNPLTg2MDEgc3RhbmRhcmRdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT184NjAxKVxuKiBkYXRlIHdoZW4gdGhlIGJ1aWxkIHdhcyBkb25lLlxuKlxuKiBAZXhhbXBsZVxuKiBSYWMuZGF0ZWQgLy8gZXhhbXBsZSByZXR1cm46ICcyMDIyLTEwLTEzVDIzOjA2OjEyLjUwMFonXG4qXG4qIEBjb25zdGFudCB7U3RyaW5nfSBkYXRlZFxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdkYXRlZCcsIGRhdGVkKTtcblxuXG4vKipcbiogVGF1LCBlcXVhbCB0byBgTWF0aC5QSSAqIDJgLlxuKlxuKiBTZWUgW1RhdSBNYW5pZmVzdG9dKGh0dHBzOi8vdGF1ZGF5LmNvbS90YXUtbWFuaWZlc3RvKS5cbipcbiogQGNvbnN0YW50IHtOdW1iZXJ9IFRBVVxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdUQVUnLCBNYXRoLlBJICogMik7XG5cblxuLy8gRXhjZXB0aW9uXG5SYWMuRXhjZXB0aW9uID0gcmVxdWlyZSgnLi91dGlsL0V4Y2VwdGlvbicpO1xuXG5cbi8vIFByb3RvdHlwZSBmdW5jdGlvbnNcbnJlcXVpcmUoJy4vYXR0YWNoUHJvdG9GdW5jdGlvbnMnKShSYWMpO1xuXG5cbi8vIFA1RHJhd2VyXG5SYWMuUDVEcmF3ZXIgPSByZXF1aXJlKCcuL3A1RHJhd2VyL1A1RHJhd2VyJyk7XG5cblxuLy8gQ29sb3JcblJhYy5Db2xvciA9IHJlcXVpcmUoJy4vc3R5bGUvQ29sb3InKTtcblxuXG4vLyBTdHJva2VcblJhYy5TdHJva2UgPSByZXF1aXJlKCcuL3N0eWxlL1N0cm9rZScpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3Ryb2tlKTtcblxuXG4vLyBGaWxsXG5SYWMuRmlsbCA9IHJlcXVpcmUoJy4vc3R5bGUvRmlsbCcpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuRmlsbCk7XG5cblxuLy8gU3R5bGVDb250YWluZXJcblJhYy5TdHlsZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vc3R5bGUvU3R5bGVDb250YWluZXInKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0eWxlQ29udGFpbmVyKTtcblxuXG4vLyBBbmdsZVxuUmFjLkFuZ2xlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BbmdsZScpO1xuUmFjLkFuZ2xlLnByb3RvdHlwZS5sb2cgPSBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5sb2c7XG5cblxuLy8gUG9pbnRcblJhYy5Qb2ludCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvUG9pbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlBvaW50KTtcblxuXG4vLyBSYXlcblJhYy5SYXkgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1JheScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuUmF5KTtcblxuXG4vLyBTZWdtZW50XG5SYWMuU2VnbWVudCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvU2VnbWVudCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2VnbWVudCk7XG5cblxuLy8gQXJjXG5SYWMuQXJjID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BcmMnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkFyYyk7XG5cblxuLy8gVGV4dFxuUmFjLlRleHQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1RleHQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlRleHQpO1xuXG5cbi8vIEJlemllclxuUmFjLkJlemllciA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQmV6aWVyJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5CZXppZXIpO1xuXG5cbi8vIENvbXBvc2l0ZVxuUmFjLkNvbXBvc2l0ZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQ29tcG9zaXRlJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Db21wb3NpdGUpO1xuXG5cbi8vIFNoYXBlXG5SYWMuU2hhcGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NoYXBlJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5TaGFwZSk7XG5cblxuLy8gRWFzZUZ1bmN0aW9uXG5SYWMuRWFzZUZ1bmN0aW9uID0gcmVxdWlyZSgnLi91dGlsL0Vhc2VGdW5jdGlvbicpO1xuXG5cbi8vIENvbnRyb2xsZXJcblJhYy5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sL0NvbnRyb2xsZXInKTtcblxuXG4vLyBDb250cm9sXG5SYWMuQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sJyk7XG5cblxuLy8gUmF5Q29udHJvbFxuUmFjLlJheUNvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvUmF5Q29udHJvbCcpO1xuXG5cbi8vIEFyY0NvbnRyb2xcblJhYy5BcmNDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL0FyY0NvbnRyb2wnKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4vUmFjJyk7XG5cblxuLyoqXG4qIFRoaXMgbmFtZXNwYWNlIGxpc3RzIHV0aWxpdHkgZnVuY3Rpb25zIGF0dGFjaGVkIHRvIGFuIGluc3RhbmNlIG9mXG4qIGB7QGxpbmsgUmFjfWAgZHVyaW5nIGluaXRpYWxpemF0aW9uLiBFYWNoIGRyYXdhYmxlIGFuZCBzdHlsZSBjbGFzcyBnZXRzXG4qIGEgY29ycmVzcG9uZGluZyBmdW5jdGlvbiBsaWtlIFtgcmFjLlBvaW50YF17QGxpbmsgaW5zdGFuY2UuUG9pbnR9IG9yXG4qIFtgcmFjLkNvbG9yYF17QGxpbmsgaW5zdGFuY2UuQ29sb3J9LlxuKlxuKiBEcmF3YWJsZSBhbmQgc3R5bGUgb2JqZWN0cyByZXF1aXJlIGZvciBjb25zdHJ1Y3Rpb24gYSByZWZlcmVuY2UgdG8gYVxuKiBgUmFjYCBpbnN0YW5jZSBpbiBvcmRlciB0byBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucy4gVGhlIGF0dGFjaGVkXG4qIGZ1bmN0aW9ucyBidWlsZCBuZXcgb2JqZWN0cyB1c2luZyB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBUaGVzZSBmdW5jdGlvbnMgYXJlIGFsc28gc2V0dXAgd2l0aCByZWFkeS1tYWRlIGNvbnZlbmllbmNlIG9iamVjdHMgZm9yXG4qIG1hbnkgdXN1YWwgdmFsdWVzIGxpa2UgW2ByYWMuQW5nbGUubm9ydGhgXXtAbGluayBpbnN0YW5jZS5BbmdsZSNub3J0aH0gb3JcbiogW2ByYWMuUG9pbnQuemVyb2Bde0BsaW5rIGluc3RhbmNlLlBvaW50I3plcm99LlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlXG4qL1xuXG5cbi8vIEF0dGFjaGVzIGNvbnZlbmllbmNlIGZ1bmN0aW9ucyB0byBjcmVhdGUgb2JqZWN0cyB3aXRoIHRoaXMgaW5zdGFuY2Ugb2Zcbi8vIFJhYy4gRS5nLiBgcmFjLkNvbG9yKC4uLilgLCBgcmFjLlBvaW50KC4uLilgLlxuLy9cbi8vIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYXR0YWNoZWQgYXMgcHJvcGVydGllcyAoaW5zdGVhZCBvZiBpbnRvIHRoZVxuLy8gcHJvdG90eXBlKSBiZWNhdXNlIHRoZXNlIGFyZSBsYXRlciBwb3B1bGF0ZWQgd2l0aCBtb3JlIHByb3BlcnRpZXMgYW5kXG4vLyBtZXRob2RzLCBhbmQgdGh1cyBuZWVkIHRvIGJlIGluZGVwZW5kZW50IGZvciBlYWNoIGluc3RhbmNlLlxuLy9cbi8vIFJlYWR5IG1hZGUgb2JqZWN0cyBhdHRhY2hlZCB0byB0aGVzZSBmdW5jdGlvbnMgKEUuZy4gYHJhYy5Qb2ludC56ZXJvYClcbi8vIGFyZSBkZWZpbmVkIGluIHRoZSBgaW5zdGFuY2UuUG9pbnQuanNgIGFuZCBlcXVpdmFsZW50IGZpbGVzLlxuLy9cbi8vIEludGVuZGVkIHRvIHJlY2VpdmUgdGhlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBDb2xvcmAuIFRoZSBjcmVhdGVkIGBjb2xvci5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Db2xvcn1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4gICogY29sb3IucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJcbiAgKiBAcGFyYW0ge051bWJlcn0gZ1xuICAqIEBwYXJhbSB7TnVtYmVyfSBiXG4gICogQHBhcmFtIHtOdW1iZXJ9IFthPTFdXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5Db2xvclxuICAqXG4gICogQGZ1bmN0aW9uIENvbG9yXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkNvbG9yID0gZnVuY3Rpb24gbWFrZUNvbG9yKHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQ29sb3IodGhpcywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFN0cm9rZWAuIFRoZSBjcmVhdGVkIGBzdHJva2UucmFjYFxuICAqIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3Ryb2tlfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBsZXQgc3Ryb2tlID0gcmFjLlN0cm9rZSgyLCBjb2xvcilcbiAgKiBzdHJva2UucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHs/TnVtYmVyfSB3ZWlnaHRcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcn0gW2NvbG9yPW51bGxdXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuU3Ryb2tlXG4gICpcbiAgKiBAZnVuY3Rpb24gU3Ryb2tlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlN0cm9rZSA9IGZ1bmN0aW9uIG1ha2VTdHJva2Uod2VpZ2h0LCBjb2xvciA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHJva2UodGhpcywgd2VpZ2h0LCBjb2xvcik7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYEZpbGxgLiBUaGUgY3JlYXRlZCBgZmlsbC5yYWNgIGlzXG4gICogc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5GaWxsfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBsZXQgZmlsbCA9IHJhYy5GaWxsKGNvbG9yKVxuICAqIGZpbGwucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IFtjb2xvcj1udWxsXVxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuRmlsbFxuICAqXG4gICogQGZ1bmN0aW9uIEZpbGxcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuRmlsbCA9IGZ1bmN0aW9uIG1ha2VGaWxsKGNvbG9yID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLkZpbGwodGhpcywgY29sb3IpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBTdHlsZWAuIFRoZSBjcmVhdGVkIGBzdHlsZS5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TdHlsZX1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4gICogbGV0IHN0eWxlID0gcmFjLlN0eWxlKHJhYy5TdHJva2UoMiwgY29sb3IpLCByYWMuRmlsbChjb2xvcikpXG4gICogc3R5bGUucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfSBbc3Ryb2tlPW51bGxdXG4gICogQHBhcmFtIHtSYWMuRmlsbH0gW2ZpbGw9bnVsbF1cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGV9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlN0eWxlXG4gICpcbiAgKiBAZnVuY3Rpb24gU3R5bGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuU3R5bGUgPSBmdW5jdGlvbiBtYWtlU3R5bGUoc3Ryb2tlID0gbnVsbCwgZmlsbCA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZSh0aGlzLCBzdHJva2UsIGZpbGwpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBBbmdsZWAuIFRoZSBjcmVhdGVkIGBhbmdsZS5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BbmdsZX1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGFuZ2xlID0gcmFjLkFuZ2xlKDEvMilcbiAgKiBhbmdsZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gdHVybiAtIFRoZSB0dXJuIHZhbHVlIG9mIHRoZSBhbmdsZSwgaW4gdGhlIHJhbmdlIGBbTywxKWBcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5BbmdsZVxuICAqXG4gICogQGZ1bmN0aW9uIEFuZ2xlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkFuZ2xlID0gZnVuY3Rpb24gbWFrZUFuZ2xlKHR1cm4pIHtcbiAgICByZXR1cm4gbmV3IFJhYy5BbmdsZSh0aGlzLCB0dXJuKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgUG9pbnRgLiBUaGUgY3JlYXRlZCBgcG9pbnQucmFjYFxuICAqIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnR9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBwb2ludCA9IHJhYy5Qb2ludCg1NSwgNzcpXG4gICogcG9pbnQucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlXG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5Qb2ludFxuICAqXG4gICogQGZ1bmN0aW9uIFBvaW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlBvaW50ID0gZnVuY3Rpb24gbWFrZVBvaW50KHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgUmF5YCB3aXRoIHRoZSBnaXZlbiBwcmltaXRpdmVcbiAgKiB2YWx1ZXMuIFRoZSBjcmVhdGVkIGByYXkucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlJheX1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IHJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzIpXG4gICogcmF5LnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUmF5XG4gICpcbiAgKiBAZnVuY3Rpb24gUmF5XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlJheSA9IGZ1bmN0aW9uIG1ha2VSYXkoeCwgeSwgYW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIGdpdmVuIHByaW1pdGl2ZVxuICAqIHZhbHVlcy4gVGhlIGNyZWF0ZWQgYHNlZ21lbnQucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlNlZ21lbnR9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBzZWdtZW50ID0gcmFjLlNlZ21lbnQoNTUsIDc3LCAxLzIsIDEwMClcbiAgKiBzZWdtZW50LnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TZWdtZW50XG4gICpcbiAgKiBAZnVuY3Rpb24gU2VnbWVudFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TZWdtZW50ID0gZnVuY3Rpb24gbWFrZVNlZ21lbnQoeCwgeSwgYW5nbGUsIGxlbmd0aCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIGFuZ2xlKTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLCBzdGFydCwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcywgcmF5LCBsZW5ndGgpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBBcmNgIHdpdGggdGhlIGdpdmVuIHByaW1pdGl2ZVxuICAqIHZhbHVlcy4gVGhlIGNyZWF0ZWQgYGFyYy5yYWNgIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQXJjfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgYXJjID0gcmFjLkFyYyg1NSwgNzcsIDEvNClcbiAgKiBhcmMucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgX3hfIGNvb3JkaW5hdGUgZm9yIHRoZSBhcmMgY2VudGVyXG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgX3lfIGNvb3JkaW5hdGUgZm9yIHRoZSBhcmMgY2VudGVyXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBzdGFydCAtIFRoZSBzdGFydCBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfE51bWJlcn0gW2VuZD1udWxsXSAtIFRoZSBlbmQgb2YgdGhlIGFyYzsgd2hlblxuICAqICAgb21taXRlZCBvciBzZXQgdG8gYG51bGxgLCBgc3RhcnRgIGlzIHVzZWQgaW5zdGVhZFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIGFyY1xuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFyY1xuICAqXG4gICogQGZ1bmN0aW9uIEFyY1xuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5BcmMgPSBmdW5jdGlvbiBtYWtlQXJjKHgsIHksIHJhZGl1cywgc3RhcnQgPSB0aGlzLkFuZ2xlLnplcm8sIGVuZCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHN0YXJ0ID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc3RhcnQpO1xuICAgIGVuZCA9IGVuZCA9PT0gbnVsbFxuICAgICAgPyBzdGFydFxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLCBlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgVGV4dGAuIFRoZSBjcmVhdGVkIGB0ZXh0LnJhY2AgaXNcbiAgKiBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlRleHR9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCB0ZXh0ID0gcmFjLlRleHQoNTUsIDc3LCBcImJsYWNrIHF1YXJ0elwiKVxuICAqIHRleHQucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBsb2NhdGlvbiBmb3IgdGhlIGRyYXduIHRleHRcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byBkcmF3XG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgZm9yIHRoZSBkcmF3biB0ZXh0XG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlRleHRcbiAgKlxuICAqIEBmdW5jdGlvbiBUZXh0XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlRleHQgPSBmdW5jdGlvbiBtYWtlVGV4dCh4LCB5LCBzdHJpbmcsIGZvcm1hdCA9IHRoaXMuVGV4dC5Gb3JtYXQudG9wTGVmdCkge1xuICAgIGNvbnN0IHBvaW50ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMsIHBvaW50LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH07XG5cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgcGFkZGluZyBwYXJhbWV0ZXJzXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgVGV4dC5Gb3JtYXRgLiBUaGUgY3JlYXRlZFxuICAqIGBmb3JtYXQucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fWAuXG4gICpcbiAgKiBbYHJhYy5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQjRm9ybWF0fSBpcyBhbiBhbGlhcyBvZiB0aGlzXG4gICogZnVuY3Rpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgZm9ybWF0ID0gcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ2Jhc2VsaW5lJywgMS84KVxuICAqIGZvcm1hdC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gaEFsaWduIC0gVGhlIGhvcml6b250YWwgYWxpZ25tZW50LCBsZWZ0LXRvLXJpZ2h0OyBvbmVcbiAgKiAgIG9mIHRoZSB2YWx1ZXMgZnJvbSBbYGhvcml6b250YWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ259XG4gICogQHBhcmFtIHtTdHJpbmd9IHZBbGlnbiAtIFRoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQsIHRvcC10by1ib3R0b207IG9uZSBvZlxuICAqICAgdGhlIHZhbHVlcyBmcm9tIFtgdmVydGljYWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWdufVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBbYW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduXG4gICogQHBhcmFtIHtTdHJpbmd9IFtmb250PW51bGxdIC0gVGhlIGZvbnQgbmFtZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbc2l6ZT1udWxsXSAtIFRoZSBmb250IHNpemVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlRleHQuRm9ybWF0XG4gICpcbiAgKiBAZnVuY3Rpb24gVGV4dEZvcm1hdFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIC8vIFJFTEVBU0UtVE9ETzogdXBkYXRlIGZ1bmN0aW9uIHdpdGggcGFkZGluZ3NcbiAgcmFjLlRleHRGb3JtYXQgPSBmdW5jdGlvbiBtYWtlVGV4dEZvcm1hdChcbiAgICBoQWxpZ24sXG4gICAgdkFsaWduLFxuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLnplcm8sXG4gICAgZm9udCA9IG51bGwsXG4gICAgc2l6ZSA9IG51bGwpXG4gIHtcbiAgICAvLyBUaGlzIGZ1bmN0aW9ucyB1c2VzIGByYWNgIGluc3RlYWQgb2YgYHRoaXNgLCBzaW5jZSBgdGhpc2AgbWF5IHBvaW50XG4gICAgLy8gdG8gZGlmZmVyZW50IG9iamVjdHM6XG4gICAgLy8gKyBgcmFjYCBpbiB0aGlzIGZ1bmN0aW9uIGJvZHlcbiAgICAvLyArIGByYWMuVGV4dGAgaW4gdGhlIGBUZXh0LkZvcm1hdGAgYWxpYXMgYmVsbG93XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbShyYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICAgIHJhYyxcbiAgICAgIGhBbGlnbiwgdkFsaWduLFxuICAgICAgYW5nbGUsIGZvbnQsIHNpemUpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBUZXh0LkZvcm1hdGAuIEFsaWFzIG9mXG4gICogW2ByYWMuVGV4dEZvcm1hdGBde0BsaW5rIFJhYyNUZXh0Rm9ybWF0fS5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBoQWxpZ24gLSBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQsIGxlZnQtdG8tcmlnaHQ7IG9uZVxuICAqICAgb2YgdGhlIHZhbHVlcyBmcm9tIFtgaG9yaXpvbnRhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbn1cbiAgKiBAcGFyYW0ge1N0cmluZ30gdkFsaWduIC0gVGhlIHZlcnRpY2FsIGFsaWdubWVudCwgdG9wLXRvLWJvdHRvbTsgb25lIG9mXG4gICogICB0aGUgdmFsdWVzIGZyb20gW2B2ZXJ0aWNhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ259XG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IFthbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd25cbiAgKiBAcGFyYW0ge1N0cmluZ30gW2ZvbnQ9bnVsbF0gLSBUaGUgZm9udCBuYW1lXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtzaXplPW51bGxdIC0gVGhlIGZvbnQgc2l6ZVxuICAqXG4gICogQGZ1bmN0aW9uIEZvcm1hdFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQgPSByYWMuVGV4dEZvcm1hdDtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQmV6aWVyYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkJlemllcn1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0WFxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFlcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRBbmNob3JYXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0QW5jaG9yWVxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRBbmNob3JYXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEFuY2hvcllcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kWFxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRZXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkJlemllcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQmV6aWVyXG4gICpcbiAgKiBAZnVuY3Rpb24gQmV6aWVyXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgdXRpbGl0eSBmdW5jdGlvbnMgdG8gYSBSYWMgaW5zdGFuY2UgdGhhdCBhZGQgZnVuY3Rpb25zIHRvIGFsbFxuLy8gZHJhd2FibGUgYW5kIHN0eWxlIGNsYXNzIHByb3RvdHlwZXMuXG4vL1xuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuXG4gIC8qKlxuICAqIEFkZHMgdG8gYGRyYXdhYmxlQ2xhc3MucHJvdG90eXBlYCBhbGwgdGhlIGZ1bmN0aW9ucyBjb250YWluZWQgaW5cbiAgKiBgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgdGhlIGZ1bmN0aW9ucyBzaGFyZWQgYnkgYWxsXG4gICogZHJhd2FibGUgb2JqZWN0cywgZm9yIGV4YW1wbGUgYGRyYXcoKWAgYW5kIGBkZWJ1ZygpYC5cbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyB0byBzZXR1cCB3aXRoIGRyYXdhYmxlIGZ1bmN0aW9uc1xuICAqL1xuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oZHJhd2FibGVDbGFzcykge1xuICAgIE9iamVjdC5rZXlzKFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgZHJhd2FibGVDbGFzcy5wcm90b3R5cGVbbmFtZV0gPSBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc1tuYW1lXTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZHJhdyA9IGZ1bmN0aW9uKHN0eWxlID0gbnVsbCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kcmF3T2JqZWN0KHRoaXMsIHN0eWxlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmRlYnVnID0gZnVuY3Rpb24oZHJhd3NUZXh0ID0gZmFsc2Upe1xuICAgIGFzc2VydERyYXdlcih0aGlzKTtcbiAgICB0aGlzLnJhYy5kcmF3ZXIuZGVidWdPYmplY3QodGhpcywgZHJhd3NUZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UgPSBudWxsKXtcbiAgICBsZXQgY29hbGVzY2VkTWVzc2FnZSA9IG1lc3NhZ2UgPz8gJyVvJztcbiAgICBjb25zb2xlLmxvZyhjb2FsZXNjZWRNZXNzYWdlLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnB1c2ggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wdXNoU3RhY2sodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTdGFjaygpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBlZWtTdGFjaygpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUb1NoYXBlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMucGVla1NoYXBlKCkuYWRkT3V0bGluZSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGVUb0NvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzaGFwZSA9IHRoaXMucmFjLnBvcFNoYXBlKCk7XG4gICAgdGhpcy5yYWMucGVla0NvbXBvc2l0ZSgpLmFkZChzaGFwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMucGVla0NvbXBvc2l0ZSgpLmFkZCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUbyA9IGZ1bmN0aW9uKHNvbWVDb21wb3NpdGUpIHtcbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5Db21wb3NpdGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHNvbWVDb21wb3NpdGUgaW5zdGFuY2VvZiBSYWMuU2hhcGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkT3V0bGluZSh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGF0dGFjaFRvIGNvbXBvc2l0ZSAtIHNvbWVDb21wb3NpdGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWVDb21wb3NpdGUpfWApO1xuICB9O1xuXG5cbiAgLy8gQ29udGFpbmVyIG9mIHByb3RvdHlwZSBmdW5jdGlvbnMgZm9yIHN0eWxlIGNsYXNzZXMuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zID0ge307XG5cbiAgLy8gQWRkcyB0byB0aGUgZ2l2ZW4gY2xhc3MgcHJvdG90eXBlIGFsbCB0aGUgZnVuY3Rpb25zIGNvbnRhaW5lZCBpblxuICAvLyBgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgZnVuY3Rpb25zIHNoYXJlZCBieSBhbGxcbiAgLy8gc3R5bGUgb2JqZWN0cyAoRS5nLiBgYXBwbHkoKWApLlxuICBSYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucy5hcHBseSA9IGZ1bmN0aW9uKCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5hcHBseU9iamVjdCh0aGlzKTtcbiAgfTtcblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmxvZyA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZztcblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5VG9DbGFzcyA9IGZ1bmN0aW9uKGNsYXNzT2JqKSB7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5zZXRDbGFzc0RyYXdTdHlsZShjbGFzc09iaiwgdGhpcyk7XG4gIH07XG5cbn07IC8vIGF0dGFjaFByb3RvRnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCBhbGxvd3MgdGhlIHNlbGVjdGlvbiBvZiBhIHZhbHVlIHdpdGggYSBrbm9iIHRoYXQgc2xpZGVzXG4qIHRocm91Z2ggdGhlIHNlY3Rpb24gb2YgYW4gYEFyY2AuXG4qXG4qIFVzZXMgYW4gYEFyY2AgYXMgYFthbmNob3Jde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuY2hvcn1gLCB3aGljaCBkZWZpbmVzXG4qIHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbipcbiogYFthbmdsZURpc3RhbmNlXXtAbGluayBSYWMuQXJjQ29udHJvbCNhbmdsZURpc3RhbmNlfWAgZGVmaW5lcyB0aGVcbiogc2VjdGlvbiBvZiB0aGUgYGFuY2hvcmAgYXJjIHdoaWNoIGlzIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiogV2l0aGluIHRoaXMgc2VjdGlvbiB0aGUgdXNlciBjYW4gc2xpZGUgdGhlIGNvbnRyb2wga25vYiB0byBzZWxlY3QgYVxuKiB2YWx1ZS5cbipcbiogQGFsaWFzIFJhYy5BcmNDb250cm9sXG4qIEBleHRlbmRzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgQXJjQ29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBcmNDb250cm9sYCBpbnN0YW5jZSB3aXRoIHRoZSBzdGFydGluZyBgdmFsdWVgIGFuZCB0aGVcbiAgKiBpbnRlcmFjdGl2ZSBgYW5nbGVEaXN0YW5jZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGNvbnRyb2wsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlRGlzdGFuY2Ugb2YgdGhlIGBhbmNob3JgXG4gICogICBhcmMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGFuZ2xlRGlzdGFuY2UpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBhbmdsZURpc3RhbmNlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBBbmdsZSBkaXN0YW5jZSBvZiB0aGUgYGFuY2hvcmAgYXJjIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbShyYWMsIGFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgLyoqXG4gICAgKiBgQXJjYCB0byB3aGljaCB0aGUgY29udHJvbCB3aWxsIGJlIGFuY2hvcmVkLiBEZWZpbmVzIHRoZSBsb2NhdGlvblxuICAgICogd2hlcmUgdGhlIGNvbnRyb2wgaXMgZHJhd24uXG4gICAgKlxuICAgICogQWxvbmcgd2l0aCBgW2FuZ2xlRGlzdGFuY2Vde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuZ2xlRGlzdGFuY2V9YFxuICAgICogZGVmaW5lcyB0aGUgc2VjdGlvbiBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGNvbnRyb2wgY2Fubm90IGJlIGRyYXduIG9yIHNlbGVjdGVkIHVudGlsIHRoaXMgcHJvcGVydHkgaXMgc2V0LlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLkFyY31cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyYWMuY29udHJvbGxlci5hdXRvQWRkQ29udHJvbHMpIHtcbiAgICAgIHJhYy5jb250cm9sbGVyLmFkZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYHZhbHVlYCB1c2luZyB0aGUgcHJvamVjdGlvbiBvZiBgdmFsdWVBbmdsZURpc3RhbmNlLnR1cm5gIGluIHRoZVxuICAqIGBbMCxhbmdsZUxlbmd0aC50dXJuXWAgcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IHZhbHVlQW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBhdFxuICAqICAgd2hpY2ggdG8gc2V0IHRoZSBjdXJyZW50IHZhbHVlXG4gICovXG4gIHNldFZhbHVlV2l0aEFuZ2xlRGlzdGFuY2UodmFsdWVBbmdsZURpc3RhbmNlKSB7XG4gICAgdmFsdWVBbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHZhbHVlQW5nbGVEaXN0YW5jZSlcbiAgICBsZXQgZGlzdGFuY2VSYXRpbyA9IHZhbHVlQW5nbGVEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG5cbiAgLy8gVE9ETzogdGhpcyBleGFtcGxlL2NvZGUgbWF5IG5vdCBiZSB3b3JraW5nIG9yIGJlIGlubmFjdXJyYXRlXG4gIC8vIGNoZWNrIFJheUNvbnRyb2w6c2V0TGltaXRzV2l0aExlbmd0aEluc2V0cyBmb3IgYSBiZXR0ZXIgZXhhbXBsZVxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgYW5nbGVEaXN0YW5jZS50dXJuYCwgY29ycmVzcG9uZGluZ2x5LCBib3RoIHByb2plY3RlZCBpbiB0aGVcbiAgKiBgWzAsIGFuZ2xlRGlzdGFuY2UudHVybl1gIHJhbmdlLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYW4gQXJjQ29udHJvbCB3aXRoIGFuZ2xlRGlzdGFuY2Ugb2YgMC41IHR1cm48L2NhcHRpb24+XG4gICogbGV0IGNvbnRyb2wgPSBuZXcgUmFjLkFyY0NvbnRyb2wocmFjLCAwLCByYWMuQW5nbGUoMC41KSlcbiAgKiAvLyBzZXRzIHN0YXJ0TGltaXQgYXMgMC4xLCBzaW5jZSAgIDAgKyAwLjIgKiAwLjUgPSAwLjFcbiAgKiAvLyBzZXRzIGVuZExpbWl0ICAgYXMgMC4zLCBzaW5jZSAwLjUgLSAwLjQgKiAwLjUgPSAwLjNcbiAgKiBjb250cm9sLnNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKDAuMiwgMC40KVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIGluIHRoZSByYW5nZVxuICAqICAgYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBlbmRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGBhbmdsZURpc3RhbmNlLnR1cm5gXG4gICogICBpbiB0aGUgcmFuZ2UgYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHRvIHVzZSBmb3IgYGVuZExpbWl0YFxuICAqL1xuICBzZXRMaW1pdHNXaXRoQW5nbGVEaXN0YW5jZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC0gZW5kSW5zZXQudHVybikgLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSAgW2FuZ2xlIGBkaXN0YW5jZWBde0BsaW5rIFJhYy5BbmdsZSNkaXN0YW5jZX0gYmV0d2VlbiB0aGVcbiAgKiBgYW5jaG9yYCBhcmMgYHN0YXJ0YCBhbmQgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqIFRoZSBgdHVybmAgb2YgdGhlIHJldHVybmVkIGBBbmdsZWAgaXMgZXF1aXZhbGVudCB0byB0aGUgY29udHJvbCBgdmFsdWVgXG4gICogcHJvamVjdGVkIHRvIHRoZSByYW5nZSBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy52YWx1ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqIFdoZW4gYGFuY2hvcmAgaXMgbm90IHNldCwgcmV0dXJucyBgbnVsbGAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm4gez9SYWMuUG9pbnR9XG4gICovXG4gIGtub2IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBOb3QgcG9zaWJsZSB0byBjYWxjdWxhdGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0QW5nbGVEaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHByb2R1Y2VkIHdpdGggdGhlIGBhbmNob3JgIGFyYyB3aXRoXG4gICogYGFuZ2xlRGlzdGFuY2VgLCB0byBiZSBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGFuY2hvcmAgaXMgbm90IHNldC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhZmZpeEFuY2hvcigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24oXG4gICAgICAgIGBFeHBlY3RlZCBhbmNob3IgdG8gYmUgc2V0LCBudWxsIGZvdW5kIGluc3RlYWRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLndpdGhBbmdsZURpc3RhbmNlKHRoaXMuYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqL1xuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IGNvbnRyb2xTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKVxuICAgICAgOiB0aGlzLnJhYy5GaWxsLm5vbmU7XG5cbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuY2VudGVyLmFuZ2xlVG9Qb2ludChrbm9iKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUobWFya2VyQW5nbGVEaXN0YW5jZSk7XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvLyBDb250cm9sIGtub2JcbiAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCBpc0NpcmNsZUNvbnRyb2wgPSB0aGlzLmFuZ2xlRGlzdGFuY2UuZXF1YWxzKHRoaXMucmFjLkFuZ2xlLnplcm8pXG4gICAgICAmJiB0aGlzLnN0YXJ0TGltaXQgPT0gMFxuICAgICAgJiYgdGhpcy5lbmRMaW1pdCA9PSAxXG4gICAgbGV0IGhhc05lZ2F0aXZlUmFuZ2UgPSBpc0NpcmNsZUNvbnRyb2xcbiAgICAgIHx8IHRoaXMudmFsdWUgPj0gdGhpcy5zdGFydExpbWl0ICsgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG4gICAgbGV0IGhhc1Bvc2l0aXZlUmFuZ2UgPSBpc0NpcmNsZUNvbnRyb2xcbiAgICAgIHx8IHRoaXMudmFsdWUgPD0gdGhpcy5lbmRMaW1pdCAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZFxuXG4gICAgLy8gTmVnYXRpdmUgYXJyb3dcbiAgICBpZiAoaGFzTmVnYXRpdmVSYW5nZSkge1xuICAgICAgbGV0IG5lZ0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpLmludmVyc2UoKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBuZWdBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAoaGFzUG9zaXRpdmVSYW5nZSkge1xuICAgICAgbGV0IHBvc0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIHBvc0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KGNvbnRyb2xTdHlsZSk7XG5cbiAgICAvLyBTZWxlY3Rpb25cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICAgIGlmIChwb2ludGVyU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqXG4gICogYHZhbHVlYCBpcyBhbHdheXMgdXBkYXRlZCBieSB0aGlzIG1ldGhvZCB0byBiZSB3aXRoaW4gKlswLDFdKiBhbmRcbiAgKiBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLkFyY30gZml4ZWRBbmNob3IgLSBBbmNob3IgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgIHdoZW5cbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnN0YXJ0TGltaXQpO1xuICAgIGxldCBlbmRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICBsZXQgc2VsZWN0aW9uQW5nbGUgPSBmaXhlZEFuY2hvci5jZW50ZXJcbiAgICAgIC5hbmdsZVRvUG9pbnQocG9pbnRlcktub2JDZW50ZXIpO1xuICAgIHNlbGVjdGlvbkFuZ2xlID0gZml4ZWRBbmNob3IuY2xhbXBUb0FuZ2xlcyhzZWxlY3Rpb25BbmdsZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5kaXN0YW5jZUZyb21TdGFydChzZWxlY3Rpb25BbmdsZSk7XG5cbiAgICAvLyBVcGRhdGUgY29udHJvbCB3aXRoIG5ldyBkaXN0YW5jZVxuICAgIGxldCBkaXN0YW5jZVJhdGlvID0gbmV3RGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IGRpc3RhbmNlUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuQXJjfSBmaXhlZEFuY2hvciAtIGBBcmNgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYCB3aGVuXG4gICogICB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBBcmMgYW5jaG9yIGlzIGFsd2F5cyBkcmF3biB3aXRob3V0IGZpbGxcbiAgICBsZXQgYW5jaG9yU3R5bGUgPSBwb2ludGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKTtcbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBhbmdsZURpc3RhbmNlID0gZml4ZWRBbmNob3IuYW5nbGVEaXN0YW5jZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBmaXhlZEFuY2hvci5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKSk7XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBtYXJrZXJQb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5BbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuc3RhcnRMaW1pdCkpO1xuICAgICAgbGV0IG1pblBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1pbkFuZ2xlKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IG1pbkFuZ2xlLnBlcnBlbmRpY3VsYXIoZml4ZWRBbmNob3IuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmRMaW1pdCA8IDEpIHtcbiAgICAgIGxldCBtYXhBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuZW5kTGltaXQpKTtcbiAgICAgIGxldCBtYXhQb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXhBbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtYXhBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgbWFya2VyQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFNlZ21lbnQgZnJvbSBwb2ludGVyIHRvIGNvbnRyb2wgZHJhZ2dlZCBjZW50ZXJcbiAgICBsZXQgZHJhZ2dlZENlbnRlciA9IHBvaW50ZXJUb0tub2JPZmZzZXRcbiAgICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIGRyYWdnZWQgY2VudGVyLCBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgZHJhZ2dlZENlbnRlci5hcmMoMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuXG4gICAgLy8gVE9ETzogaW1wbGVtZW50IGFyYyBjb250cm9sIGRyYWdnaW5nIHZpc3VhbHMhXG4gIH1cblxufSAvLyBjbGFzcyBBcmNDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmNDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBYnN0cmFjdCBjbGFzcyBmb3IgY29udHJvbHMgdGhhdCBzZWxlY3QgYSB2YWx1ZSB3aXRoaW4gYSByYW5nZS5cbipcbiogQ29udHJvbHMgbWF5IHVzZSBhbiBgYW5jaG9yYCBvYmplY3QgdG8gZGV0ZXJtaW5lIHRoZSB2aXN1YWwgcG9zaXRpb24gb2ZcbiogdGhlIGNvbnRyb2wncyBpbnRlcmFjdGl2ZSBlbGVtZW50cy4gRWFjaCBpbXBsZW1lbnRhdGlvbiBkZXRlcm1pbmVzIHRoZVxuKiBjbGFzcyB1c2VkIGZvciB0aGlzIGBhbmNob3JgLCBmb3IgZXhhbXBsZVxuKiBgW0FyY0NvbnRyb2xde0BsaW5rIFJhYy5BcmNDb250cm9sfWAgdXNlcyBhbiBgW0FyY117QGxpbmsgUmFjLkFyY31gIGFzXG4qIGFuY2hvciwgd2hpY2ggZGVmaW5lcyB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3biwgd2hhdCBvcmllbnRhdGlvbiBpdFxuKiB1c2VzLCBhbmQgdGhlIHBvc2l0aW9uIG9mIHRoZSBjb250cm9sIGtub2IgdGhyb3VnaCB0aGUgcmFuZ2Ugb2YgcG9zc2libGVcbiogdmFsdWVzLlxuKlxuKiBBIGNvbnRyb2wga2VlcHMgYSBgdmFsdWVgIHByb3BlcnR5IGluIHRoZSByYW5nZSAqWzAsMV0qIGZvciB0aGUgY3VycmVudGx5XG4qIHNlbGVjdGVkIHZhbHVlLlxuKlxuKiBUaGUgYHByb2plY3Rpb25TdGFydGAgYW5kIGBwcm9qZWN0aW9uRW5kYCBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvXG4qIHByb2plY3QgYHZhbHVlYCBpbnRvIHRoZSByYW5nZSBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAgYnkgdXNpbmdcbiogdGhlIGBwcm9qZWN0ZWRWYWx1ZSgpYCBtZXRob2QuIEJ5IGRlZmF1bHQgc2V0IHRvICpbMCwxXSouXG4qXG4qIFRoZSBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgY2FuIGJlIHVzZWQgdG8gcmVzdHJhaW4gdGhlIGFsbG93YWJsZVxuKiB2YWx1ZXMgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLiBCeSBkZWZhdWx0IHNldCB0b1xuKiAqWzAsMV0qLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBDb250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb250cm9sYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIEN1cnJlbnQgc2VsZWN0ZWQgdmFsdWUsIGluIHRoZSByYW5nZSAqWzAsMV0qLlxuICAgICpcbiAgICAqIE1heSBiZSBmdXJ0aGVyIGNvbnN0cmFpbmVkIHRvIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvKipcbiAgICAqIFtQcm9qZWN0ZWQgdmFsdWVde0BsaW5rIFJhYy5Db250cm9sI3Byb2plY3RlZFZhbHVlfSB0byB1c2Ugd2hlblxuICAgICogYHZhbHVlYCBpcyBgMGAuXG4gICAgKlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqIEBkZWZhdWx0IDBcbiAgICAqL1xuICAgIHRoaXMucHJvamVjdGlvblN0YXJ0ID0gMDtcblxuICAgIC8qKlxuICAgICogW1Byb2plY3RlZCB2YWx1ZV17QGxpbmsgUmFjLkNvbnRyb2wjcHJvamVjdGVkVmFsdWV9IHRvIHVzZSB3aGVuXG4gICAgKiBgdmFsdWVgIGlzIGAxYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5wcm9qZWN0aW9uRW5kID0gMTtcblxuICAgIC8qKlxuICAgICogTWluaW11bSBgdmFsdWVgIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMFxuICAgICovXG4gICAgdGhpcy5zdGFydExpbWl0ID0gMDtcblxuICAgIC8qKlxuICAgICogTWF4aW11bSBgdmFsdWVgIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5lbmRMaW1pdCA9IDE7XG5cbiAgICAvKipcbiAgICAqIENvbGxlY3Rpb24gb2YgdmFsdWVzIGF0IHdoaWNoIHZpc3VhbCBtYXJrZXJzIGFyZSBkcmF3bi5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgKiBAZGVmYXVsdCBbXVxuICAgICovXG4gICAgdGhpcy5tYXJrZXJzID0gW107XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHRvIGFwcGx5IHdoZW4gZHJhd2luZy4gVGhpcyBzdHlsZSBnZXRzIGFwcGxpZWQgYWZ0ZXJcbiAgICAqIGBbcmFjLmNvbnRyb2xsZXIuY29udHJvbFN0eWxlXXtAbGluayBSYWMuQ29udHJvbGxlciNjb250cm9sU3R5bGV9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5zdHlsZSA9IG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHZhbHVlYCBwcm9qZWN0ZWQgaW50byB0aGUgcmFuZ2VcbiAgKiBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAuXG4gICpcbiAgKiBCeSBkZWZhdWx0IHRoZSBwcm9qZWN0aW9uIHJhbmdlIGlzICpbMCwxXSosIGluIHdoaWNoIGNhc2UgYHZhbHVlYCBhbmRcbiAgKiBgcHJvamVjdGVkVmFsdWUoKWAgYXJlIGVxdWFsLlxuICAqXG4gICogUHJvamVjdGlvbiByYW5nZXMgd2l0aCBhIG5lZ2F0aXZlIGRpcmVjdGlvbiAoRS5nLiAqWzUwLDMwXSosIHdoZW5cbiAgKiBgcHJvamVjdGlvblN0YXJ0YCBpcyBncmVhdGVyIHRoYXQgYHByb2plY3Rpb25FbmRgKSBhcmUgc3VwcG9ydGVkLiBBc1xuICAqIGB2YWx1ZWAgaW5jcmVhc2VzLCB0aGUgcHJvamVjdGlvbiByZXR1cm5lZCBkZWNyZWFzZXMgZnJvbVxuICAqIGBwcm9qZWN0aW9uU3RhcnRgIHVudGlsIHJlYWNoaW5nIGBwcm9qZWN0aW9uRW5kYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbMTAwLDIwMF08L2NhcHRpb24+XG4gICogY29udHJvbC5zZXRQcm9qZWN0aW9uUmFuZ2UoMTAwLCAyMDApXG4gICogY29udHJvbC52YWx1ZSA9IDA7ICAgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDEwMFxuICAqIGNvbnRyb2wudmFsdWUgPSAwLjU7IGNvbnRyb2wucHJvamVjdGlvblZhbHVlKCkgLy8gcmV0dXJucyAxNTBcbiAgKiBjb250cm9sLnZhbHVlID0gMTsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgMjAwXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNvbnRyb2wgd2l0aCBhIHByb2plY3Rpb24gcmFuZ2Ugb2YgWzUwLDMwXTwvY2FwdGlvbj5cbiAgKiBjb250cm9sLnNldFByb2plY3Rpb25SYW5nZSgzMCwgNTApXG4gICogY29udHJvbC52YWx1ZSA9IDA7ICAgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDUwXG4gICogY29udHJvbC52YWx1ZSA9IDAuNTsgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDQwXG4gICogY29udHJvbC52YWx1ZSA9IDE7ICAgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDMwXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBwcm9qZWN0ZWRWYWx1ZSgpIHtcbiAgICBsZXQgcHJvamVjdGlvblJhbmdlID0gdGhpcy5wcm9qZWN0aW9uRW5kIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gICAgcmV0dXJuICh0aGlzLnZhbHVlICogcHJvamVjdGlvblJhbmdlKSArIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICB9XG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBpbiB0aGUgcmFuZ2UgKlswLDFdKiBmb3IgdGhlXG4gIC8vIGBwcm9qZWN0ZWRWYWx1ZWAgaW4gdGhlIHJhbmdlIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYC5cbiAgLy8gdmFsdWVPZlByb2plY3RlZChwcm9qZWN0ZWRWYWx1ZSkge1xuICAvLyAgIGxldCBwcm9qZWN0aW9uUmFuZ2UgPSB0aGlzLnByb2plY3Rpb25FbmQgLSB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgLy8gICByZXR1cm4gKHByb2plY3RlZFZhbHVlIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQpIC8gcHJvamVjdGlvblJhbmdlO1xuICAvLyB9XG5cblxuICAvLyBUT0RPOiBkb2N1bWVudCwgdGVzdFxuICBzZXRQcm9qZWN0aW9uUmFuZ2Uoc3RhcnQsIGVuZCkge1xuICAgIHRoaXMucHJvamVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5wcm9qZWN0aW9uRW5kID0gZW5kO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgMWAsIGNvcnJlc3BvbmRpbmdseS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogY29udHJvbC5zZXRMaW1pdHNXaXRoSW5zZXRzKDAuMSwgMC4yKVxuICAqIC8vIHJldHVybnMgMC4xLCBzaW5jZSAwICsgMC4xID0gMC4xXG4gICogY29udHJvbC5zdGFydExpbWl0XG4gICogLy8gcmV0dXJucyAwLjgsIHNpbmNlIDEgLSAwLjIgPSAwLjhcbiAgKiBjb250cm9sLmVuZExpbWl0XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGAwYCB0byB1c2UgZm9yIGBzdGFydExpbWl0YFxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGAxYCB0byB1c2UgZm9yIGBlbmRMaW1pdGBcbiAgKi9cbiAgc2V0TGltaXRzV2l0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQ7XG4gICAgdGhpcy5lbmRMaW1pdCA9IDEgLSBlbmRJbnNldDtcbiAgfVxuXG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gU2V0cyBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0d28gaW5zZXQgdmFsdWVzIHJlbGF0aXZlIHRvIHRoZVxuICAvLyBbMCwxXSByYW5nZS5cbiAgLy8gc2V0TGltaXRzV2l0aFByb2plY3Rpb25JbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgLy8gICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCk7XG4gIC8vICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMudmFsdWVPZigxIC0gZW5kSW5zZXQpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBBZGRzIGEgbWFya2VyIGF0IHRoZSBjdXJyZW50IGB2YWx1ZWAuXG4gICovXG4gIGFkZE1hcmtlckF0Q3VycmVudFZhbHVlKCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGlzIGNvbnRyb2wgaXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLlxuICAqXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICovXG4gIGlzU2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJhYy5jb250cm9sbGVyLnNlbGVjdGlvbi5jb250cm9sID09PSB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHJldHVybiB7UmFjLlBvaW50fVxuICAqL1xuICBrbm9iKCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIGFuY2hvciB0byBiZSBwZXJzaXRlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gZGV0ZXJtaW5lcyB0aGUgdHlwZSB1c2VkIGZvciBgYW5jaG9yYCBhbmRcbiAgKiBgYWZmaXhBbmNob3IoKWAuXG4gICpcbiAgKiBUaGlzIGZpeGVkIGFuY2hvciBpcyBwYXNzZWQgYmFjayB0byB0aGUgY29udHJvbCB0aHJvdWdoXG4gICogYFt1cGRhdGVXaXRoUG9pbnRlcl17QGxpbmsgUmFjLkNvbnRyb2wjdXBkYXRlV2l0aFBvaW50ZXJ9YCBhbmRcbiAgKiBgW2RyYXdTZWxlY3Rpb25de0BsaW5rIFJhYy5Db250cm9sI2RyYXdTZWxlY3Rpb259YCBkdXJpbmcgdXNlclxuICAqIGludGVyYWN0aW9uLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKi9cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKi9cbiAgZHJhdygpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqIENhbGxlZCBieSBgW3JhYy5jb250cm9sbGVyLnBvaW50ZXJEcmFnZ2VkXXtAbGluayBSYWMuQ29udHJvbGxlciNwb2ludGVyRHJhZ2dlZH1gXG4gICogYXMgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGggdGhlIGNvbnRyb2wuXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGludGVycHJldHMgYHBvaW50ZXJLbm9iQ2VudGVyYCBhZ2FpbnN0IGBmaXhlZEFuY2hvcmBcbiAgKiB0byB1cGRhdGUgaXRzIG93biB2YWx1ZS4gVGhlIGN1cnJlbnQgYGFuY2hvcmAgaXMgbm90IHVzZWQgZm9yIHRoaXNcbiAgKiB1cGRhdGUgc2luY2UgYGFuY2hvcmAgY291bGQgY2hhbmdlIGR1cmluZyByZWRyYXcgaW4gcmVzcG9uc2UgdG8gdXBkYXRlc1xuICAqIGluIGB2YWx1ZWAuXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGlzIGFsc28gcmVzcG9uc2libGUgb2Yga2VlcGluZyB0aGUgdXBkYXRlZCBgdmFsdWVgXG4gICogd2l0aGluIHRoZSByYW5nZSBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC4gVGhpcyBtZXRob2QgaXMgdGhlIG9ubHkgcGF0aFxuICAqIGZvciB1cGRhdGluZyB0aGUgY29udHJvbCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24sIGFuZCB0aHVzIHRoZSBvbmx5XG4gICogcGxhY2Ugd2hlcmUgZWFjaCBpbXBsZW1lbnRhdGlvbiBtdXN0IGVuZm9yY2UgYSB2YWxpZCBgdmFsdWVgIHdpdGhpblxuICAqICpbMCwxXSogYW5kIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7T2JqZWN0fSBmaXhlZEFuY2hvciAtIEFuY2hvciBwcm9kdWNlZCB3aGVuIHVzZXIgaW50ZXJhY3Rpb25cbiAgKiAgIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIHNlbGVjdGlvbiBzdGF0ZSBhbG9uZyB3aXRoIHBvaW50ZXIgaW50ZXJhY3Rpb24gdmlzdWFscy5cbiAgKiBDYWxsZWQgYnkgYFtyYWMuY29udHJvbGxlci5kcmF3Q29udHJvbHNde0BsaW5rIFJhYy5Db250cm9sbGVyI2RyYXdDb250cm9sc31gXG4gICogb25seSBmb3IgdGhlIHNlbGVjdGVkIGNvbnRyb2wuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7T2JqZWN0fSBmaXhlZEFuY2hvciAtIEFuY2hvciBvZiB0aGUgY29udHJvbCBwcm9kdWNlZCB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbDtcblxuXG4vLyBDb250cm9scyBzaGFyZWQgZHJhd2luZyBlbGVtZW50c1xuXG5Db250cm9sLm1ha2VBcnJvd1NoYXBlID0gZnVuY3Rpb24ocmFjLCBjZW50ZXIsIGFuZ2xlKSB7XG4gIC8vIEFyY1xuICBsZXQgYW5nbGVEaXN0YW5jZSA9IHJhYy5BbmdsZS5mcm9tKDEvMjIpO1xuICBsZXQgYXJjID0gY2VudGVyLmFyYyhyYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41LFxuICAgIGFuZ2xlLnN1YnRyYWN0KGFuZ2xlRGlzdGFuY2UpLCBhbmdsZS5hZGQoYW5nbGVEaXN0YW5jZSkpO1xuXG4gIC8vIEFycm93IHdhbGxzXG4gIGxldCBwb2ludEFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oMS84KTtcbiAgbGV0IHJpZ2h0V2FsbCA9IGFyYy5zdGFydFBvaW50KCkucmF5KGFuZ2xlLmFkZChwb2ludEFuZ2xlKSk7XG4gIGxldCBsZWZ0V2FsbCA9IGFyYy5lbmRQb2ludCgpLnJheShhbmdsZS5zdWJ0cmFjdChwb2ludEFuZ2xlKSk7XG5cbiAgLy8gQXJyb3cgcG9pbnRcbiAgbGV0IHBvaW50ID0gcmlnaHRXYWxsLnBvaW50QXRJbnRlcnNlY3Rpb24obGVmdFdhbGwpO1xuXG4gIC8vIFNoYXBlXG4gIHJhYy5wdXNoU2hhcGUoKTtcbiAgcG9pbnQuc2VnbWVudFRvUG9pbnQoYXJjLnN0YXJ0UG9pbnQoKSlcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuZW5kUG9pbnQoKS5zZWdtZW50VG9Qb2ludChwb2ludClcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuXG4gIHJldHVybiByYWMucG9wU2hhcGUoKTtcbn07XG5cbkNvbnRyb2wubWFrZUxpbWl0TWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIGxldCBwZXJwZW5kaWN1bGFyID0gYW5nbGUucGVycGVuZGljdWxhcihmYWxzZSk7XG4gIGxldCBjb21wb3NpdGUgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xuXG4gIHBvaW50LnNlZ21lbnRUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIDQpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbig0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigzKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEluZm9ybWF0aW9uIHJlZ2FyZGluZyB0aGUgY3VycmVudGx5IHNlbGVjdGVkXG4qIGBbQ29udHJvbF17QGxpbmsgUmFjLkNvbnRyb2x9YC5cbipcbiogQ3JlYXRlZCBhbmQga2VwdCBieSBgW0NvbnRyb2xsZXJde0BsaW5rIFJhYy5Db250cm9sbGVyfWAgd2hlbiBhIGNvbnRyb2xcbiogYmVjb21lcyBzZWxlY3RlZC5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sbGVyLlNlbGVjdGlvblxuKi9cbmNsYXNzIENvbnRyb2xTZWxlY3Rpb257XG5cbiAgLyoqXG4gICogQnVpbGRzIGEgbmV3IGBTZWxlY3Rpb25gIHdpdGggdGhlIGdpdmVuIGBjb250cm9sYCBhbmQgcG9pbnRlciBsb2NhdGVkXG4gICogYXQgYHBvaW50ZXJDZW50ZXJgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29udHJvbH0gY29udHJvbCAtIFRoZSBzZWxlY3RlZCBjb250cm9sXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gb2YgdGhlIHBvaW50ZXIgd2hlblxuICAqICAgdGhlIHNlbGVjdGlvbiBzdGFydGVkXG4gICovXG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHBvaW50ZXJDZW50ZXIpIHtcblxuICAgIC8qKlxuICAgICogVGhlIHNlbGVjdGVkIGNvbnRyb2wuXG4gICAgKiBAdHlwZSB7UmFjLkNvbnRyb2x9XG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuXG4gICAgLyoqXG4gICAgKiBBbmNob3IgcHJvZHVjZWQgYnlcbiAgICAqIGBbY29udHJvbC5hZmZpeEFuY2hvcl17QGxpbmsgUmFjLkNvbnRyb2wjYWZmaXhBbmNob3J9YCB3aGVuIHRoZVxuICAgICogc2VsZWN0aW9uIGJlZ2FuLlxuICAgICpcbiAgICAqIFRoaXMgYW5jaG9yIGlzIHBlcnNpc3RlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbiBhcyB0byBhbGxvdyB0aGUgdXNlclxuICAgICogdG8gaW50ZXJhY3Qgd2l0aCB0aGUgc2VsZWN0ZWQgY29udHJvbCBpbiBhIGZpeGVkIGxvY2F0aW9uLCBldmVuIGlmXG4gICAgKiB0aGUgY29udHJvbCBtb3ZlcyBkdXJpbmcgdGhlIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmZpeGVkQW5jaG9yID0gY29udHJvbC5hZmZpeEFuY2hvcigpO1xuXG4gICAgLyoqXG4gICAgKiBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzIHRoZSBvZmZzZXQgZnJvbSB0aGUgcG9pbnRlciBwb3NpdGlvbiB0byB0aGVcbiAgICAqIGNvbnRyb2wga25vYiBjZW50ZXIuXG4gICAgKlxuICAgICogVXNlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBjb250cm9sIGtub2IgYXQgYSBjb25zdGFudCBvZmZzZXQgcG9zaXRpb25cbiAgICAqIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIFRoZSBwb2ludGVyIHN0YXJ0aW5nIGxvY2F0aW9uIGlzIGVxdWFsIHRvIGBzZWdtZW50LnN0YXJ0UG9pbnQoKWAsXG4gICAgKiB0aGUgY29udHJvbCBrbm9iIGNlbnRlciBzdGFydGluZyBwb3NpdGlvbiBpcyBlcXVhbCB0b1xuICAgICogYHNlZ21lbnQuZW5kUG9pbnQoKWAuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAgICovXG4gICAgdGhpcy5wb2ludGVyVG9Lbm9iT2Zmc2V0ID0gcG9pbnRlckNlbnRlci5zZWdtZW50VG9Qb2ludChjb250cm9sLmtub2IoKSk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmNvbnRyb2wuZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCB0aGlzLmZpeGVkQW5jaG9yLCB0aGlzLnBvaW50ZXJUb0tub2JPZmZzZXQpO1xuICB9XG59XG5cblxuLyoqXG4qIE1hbmFnZXIgb2YgaW50ZXJhY3RpdmUgYFtDb250cm9sXXtAbGluayBSYWMuQ29udHJvbH1gcyBmb3IgYW4gaW5zdGFuY2Vcbiogb2YgYFJhY2AuXG4qXG4qIENvbnRhaW5zIGEgbGlzdCBvZiBhbGwgbWFuYWdlZCBjb250cm9scyBhbmQgY29vcmRpbmF0ZXMgZHJhd2luZyBhbmQgdXNlclxuKiBpbnRlcmFjdGlvbiBiZXR3ZWVuIHRoZW0uXG4qXG4qIEZvciBjb250cm9scyB0byBiZSBmdW5jdGlvbmFsIHRoZSBgcG9pbnRlclByZXNzZWRgLCBgcG9pbnRlclJlbGVhc2VkYCxcbiogYW5kIGBwb2ludGVyRHJhZ2dlZGAgbWV0aG9kcyBoYXZlIHRvIGJlIGNhbGxlZCBhcyBwb2ludGVyIGludGVyYWN0aW9uc1xuKiBoYXBwZW4uIFRoZSBgZHJhd0NvbnRyb2xzYCBtZXRob2QgaGFuZGxlcyB0aGUgZHJhd2luZyBvZiBhbGwgY29udHJvbHNcbiogYW5kIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbCwgaXQgaXMgdXN1YWxseSBjYWxsZWQgYXQgdGhlIHZlcnkgZW5kXG4qIG9mIGRyYXdpbmcuXG4qXG4qIEFsc28gY29udGFpbnMgc2V0dGluZ3Mgc2hhcmVkIGJldHdlZW4gYWxsIGNvbnRyb2xzIGFuZCB1c2VkIGZvciB1c2VyXG4qIGludGVyYWN0aW9uLCBsaWtlIGBwb2ludGVyU3R5bGVgIHRvIGRyYXcgdGhlIHBvaW50ZXIsIGBjb250cm9sU3R5bGVgIGFzXG4qIGEgZGVmYXVsdCBzdHlsZSBmb3IgZHJhd2luZyBjb250cm9scywgYW5kIGBrbm9iUmFkaXVzYCB0aGF0IGRlZmluZXMgdGhlXG4qIHNpemUgb2YgdGhlIGludGVyYWN0aXZlIGVsZW1lbnQgb2YgbW9zdCBjb250cm9scy5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sbGVyXG4qL1xuY2xhc3MgQ29udHJvbGxlciB7XG5cbiAgc3RhdGljIFNlbGVjdGlvbiA9IENvbnRyb2xTZWxlY3Rpb247XG5cblxuICAvKipcbiAgKiBCdWlsZHMgYSBuZXcgYENvbnRyb2xsZXJgIHdpdGggdGhlIGdpdmVuIGBSYWNgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMpIHtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBEaXN0YW5jZSBhdCB3aGljaCB0aGUgcG9pbnRlciBpcyBjb25zaWRlcmVkIHRvIGludGVyYWN0IHdpdGggYVxuICAgICogY29udHJvbCBrbm9iLiBBbHNvIHVzZWQgYnkgY29udHJvbHMgZm9yIGRyYXdpbmcuXG4gICAgKlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMua25vYlJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBDb2xsZWN0aW9uIG9mIGFsbCBjb250cm9sbHMgbWFuYWdlZCBieSB0aGUgaW5zdGFuY2UuIENvbnRyb2xzIGluIHRoaXNcbiAgICAqIGxpc3QgYXJlIGNvbnNpZGVyZWQgZm9yIHBvaW50ZXIgaGl0IHRlc3RpbmcgYW5kIGZvciBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQ29udHJvbFtdfVxuICAgICogQGRlZmF1bHQgW11cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbHMgPSBbXTtcblxuICAgIC8qKlxuICAgICogSW5kaWNhdGVzIGNvbnRyb2xzIHRvIGFkZCB0aGVtc2VsdmVzIGludG8gYHRoaXMuY29udHJvbHNgIHdoZW5cbiAgICAqIGNyZWF0ZWQuXG4gICAgKlxuICAgICogVGhpcyBwcm9wZXJ0eSBpcyBhIHNoYXJlZCBjb25maWd1cmF0aW9uLiBUaGUgYmVoYXZpb3VyIGlzIGltcGxlbWVudGVkXG4gICAgKiBpbmRlcGVuZGVudGx5IGJ5IGVhY2ggY29udHJvbCBjb25zdHJ1Y3Rvci5cbiAgICAqXG4gICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAqL1xuICAgIHRoaXMuYXV0b0FkZENvbnRyb2xzID0gdHJ1ZTtcblxuICAgIC8vIFRPRE86IHNlcGFyYXRlIGxhc3RDb250cm9sIGZyb20gbGFzdFBvaW50ZXJcblxuICAgIC8vIExhc3QgYFBvaW50YCBvZiB0aGUgcG9zaXRpb24gd2hlbiB0aGUgcG9pbnRlciB3YXMgcHJlc3NlZCwgb3IgbGFzdFxuICAgIC8vIENvbnRyb2wgaW50ZXJhY3RlZCB3aXRoLiBTZXQgdG8gYG51bGxgIHdoZW4gdGhlcmUgaGFzIGJlZW4gbm9cbiAgICAvLyBpbnRlcmFjdGlvbiB5ZXQgYW5kIHdoaWxlIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbC5cbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU3R5bGUgb2JqZWN0IHVzZWQgZm9yIHRoZSB2aXN1YWwgZWxlbWVudHMgcmVsYXRlZCB0byBwb2ludGVyXG4gICAgKiBpbnRlcmFjdGlvbiBhbmQgY29udHJvbCBzZWxlY3Rpb24uIFdoZW4gYG51bGxgIG5vIHBvaW50ZXIgb3JcbiAgICAqIHNlbGVjdGlvbiB2aXN1YWxzIGFyZSBkcmF3bi5cbiAgICAqXG4gICAgKiBCeSBkZWZhdWx0IGNvbnRhaW5zIGEgc3R5bGUgdGhhdCB1c2VzIHRoZSBjdXJyZW50IHN0cm9rZVxuICAgICogY29uZmlndXJhdGlvbiB3aXRoIG5vLWZpbGwuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn1cbiAgICAqIEBkZWZhdWx0IHtAbGluayBpbnN0YW5jZS5GaWxsI25vbmV9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ZXJTdHlsZSA9IHJhYy5GaWxsLm5vbmU7XG5cbiAgICAvKipcbiAgICAqIERlZmF1bHQgc3R5bGUgdG8gYXBwbHkgZm9yIGFsbCBjb250cm9scy4gV2hlbiBzZXQgaXQgaXMgYXBwbGllZFxuICAgICogYmVmb3JlIGNvbnRyb2wgZHJhd2luZy4gVGhlIGluZGl2aWR1YWwgY29udHJvbCBzdHlsZSBpblxuICAgICogYFtjb250cm9sLnN0eWxlXXtAbGluayBSYWMuQ29udHJvbCNzdHlsZX1gIGlzIGFwcGxpZWQgYWZ0ZXJ3YXJkcy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5jb250cm9sU3R5bGUgPSBudWxsXG5cbiAgICAvKipcbiAgICAqIFNlbGVjdGlvbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBvciBgbnVsbGBcbiAgICAqIHdoZW4gdGhlcmUgaXMgbm8gc2VsZWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9ufVxuICAgICovXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuXG4gIH0gLy8gY29uc3RydWN0b3JcblxuXG4gIC8qKlxuICAqIFB1c2hlcyBgY29udHJvbGAgaW50byBgdGhpcy5jb250cm9sc2AsIGFsbG93aW5nIHRoZSBpbnN0YW5jZSB0byBoYW5kbGVcbiAgKiBwb2ludGVyIGludGVyYWN0aW9uIGFuZCBkcmF3aW5nIG9mIGBjb250cm9sYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbnRyb2x9IGNvbnRyb2wgLSBBIGBDb250cm9sYCB0byBhZGQgaW50byBgY29udHJvbHNgXG4gICovXG4gIGFkZChjb250cm9sKSB7XG4gICAgdGhpcy5jb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICB9XG5cblxuICAvKipcbiAgKiBOb3RpZmllcyB0aGUgaW5zdGFuY2UgdGhhdCB0aGUgcG9pbnRlciBoYXMgYmVlbiBwcmVzc2VkIGF0IHRoZVxuICAqIGBwb2ludGVyQ2VudGVyYCBsb2NhdGlvbi4gQWxsIGNvbnRyb2xzIGFyZSBoaXQgdGVzdGVkIGFuZCB0aGUgZmlyc3RcbiAgKiBjb250cm9sIHRvIGJlIGhpdCBpcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgcHJlc3MgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgcHJlc3NlZFxuICAqL1xuICBwb2ludGVyUHJlc3NlZChwb2ludGVyQ2VudGVyKSB7XG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IG51bGw7XG5cbiAgICAvLyBUZXN0IHBvaW50ZXIgaGl0XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmNvbnRyb2xzLmZpbmQoIGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29udHJvbEtub2IgPSBpdGVtLmtub2IoKTtcbiAgICAgIGlmIChjb250cm9sS25vYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGlmIChjb250cm9sS25vYi5kaXN0YW5jZVRvUG9pbnQocG9pbnRlckNlbnRlcikgPD0gdGhpcy5rbm9iUmFkaXVzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvbiA9IG5ldyBDb250cm9sbGVyLlNlbGVjdGlvbihzZWxlY3RlZCwgcG9pbnRlckNlbnRlcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIGRyYWdnZWQgdG8gdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBXaGVuIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbCwgdXNlclxuICAqIGludGVyYWN0aW9uIGlzIHBlcmZvcm1lZCBhbmQgdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBkcmFnIGludGVyYWN0aW9uIGZvciBhbGxcbiAgKiBtYW5hZ2VkIGNvbnRyb2xzIHRvIHByb3Blcmx5IHdvcmsuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgcG9pbnRlciB3YXNcbiAgKiAgIGRyYWdnZWRcbiAgKi9cbiAgcG9pbnRlckRyYWdnZWQocG9pbnRlckNlbnRlcil7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLnNlbGVjdGlvbi5jb250cm9sO1xuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuc2VsZWN0aW9uLmZpeGVkQW5jaG9yO1xuXG4gICAgLy8gT2Zmc2V0IGNlbnRlciBvZiBkcmFnZ2VkIGNvbnRyb2wga25vYiBmcm9tIHRoZSBwb2ludGVyIHBvc2l0aW9uXG4gICAgbGV0IHBvaW50ZXJLbm9iQ2VudGVyID0gdGhpcy5zZWxlY3Rpb24ucG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIGNvbnRyb2wudXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gcmVsZWFzZWQgYXQgdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBXaGVuIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbCwgdXNlclxuICAqIGludGVyYWN0aW9uIGlzIGZpbmFsaXplZCBhbmQgdGhlIGNvbnRyb2wgc2VsZWN0aW9uIGlzIGNsZWFyZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgZHJhZyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICByZWxlYXNlZFxuICAqL1xuICBwb2ludGVyUmVsZWFzZWQocG9pbnRlckNlbnRlcikge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5sYXN0UG9pbnRlciA9IHBvaW50ZXJDZW50ZXI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IHRoaXMuc2VsZWN0aW9uLmNvbnRyb2w7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyBhbGwgY29udHJvbHMgY29udGFpbmVkIGluXG4gICogYFtjb250cm9sc117QGxpbmsgUmFjLkNvbnRyb2xsZXIjY29udHJvbHN9YCBhbG9uZyB0aGUgdmlzdWFsIGVsZW1lbnRzXG4gICogZm9yIHBvaW50ZXIgYW5kIGNvbnRyb2wgc2VsZWN0aW9uLlxuICAqXG4gICogVXN1YWxseSBjYWxsZWQgYXQgdGhlIGVuZCBvZiBkcmF3aW5nLCBhcyB0byBkcmF3IGNvbnRyb2xzIG9uIHRvcCBvZlxuICAqIG90aGVyIGdyYXBoaWNzLlxuICAqL1xuICBkcmF3Q29udHJvbHMoKSB7XG4gICAgbGV0IHBvaW50ZXJDZW50ZXIgPSB0aGlzLnJhYy5Qb2ludC5wb2ludGVyKCk7XG4gICAgdGhpcy5kcmF3UG9pbnRlcihwb2ludGVyQ2VudGVyKTtcblxuICAgIC8vIEFsbCBjb250cm9scyBpbiBkaXNwbGF5XG4gICAgdGhpcy5jb250cm9scy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpO1xuICAgIH1cbiAgfVxuXG5cbiAgZHJhd1BvaW50ZXIocG9pbnRlckNlbnRlcikge1xuICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnBvaW50ZXJTdHlsZTtcbiAgICBpZiAocG9pbnRlclN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGFzdCBwb2ludGVyIG9yIGNvbnRyb2xcbiAgICBpZiAodGhpcy5sYXN0UG9pbnRlciBpbnN0YW5jZW9mIFJhYy5Qb2ludCkge1xuICAgICAgdGhpcy5sYXN0UG9pbnRlci5hcmMoMTIpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuQ29udHJvbCkge1xuICAgICAgLy8gVE9ETzogaW1wbGVtZW50IGxhc3Qgc2VsZWN0ZWQgY29udHJvbCBzdGF0ZVxuICAgIH1cblxuICAgIC8vIFBvaW50ZXIgcHJlc3NlZFxuICAgIGlmICh0aGlzLnJhYy5kcmF3ZXIucDUubW91c2VJc1ByZXNzZWQpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICBwb2ludGVyQ2VudGVyLmFyYygxMCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9pbnRlckNlbnRlci5hcmMoNSkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbn0gLy8gY2xhc3MgQ29udHJvbGxlclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IGFsbG93cyB0aGUgc2VsZWN0aW9uIG9mIGEgdmFsdWUgd2l0aCBhIGtub2IgdGhhdCBzbGlkZXNcbiogdGhyb3VnaCB0aGUgc2VnbWVudCBvZiBhIGBSYXlgLlxuKlxuKiBVc2VzIGEgYFJheWAgYXMgYFthbmNob3Jde0BsaW5rIFJhYy5SYXlDb250cm9sI2FuY2hvcn1gLCB3aGljaCBkZWZpbmVzXG4qIHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbipcbiogYFtsZW5ndGhde0BsaW5rIFJhYy5SYXlDb250cm9sI2xlbmd0aH1gIGRlZmluZXMgdGhlIGxlbmd0aCBvZiB0aGVcbiogc2VnbWVudCBpbiB0aGUgYGFuY2hvcmAgcmF5IHdoaWNoIGlzIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiogV2l0aGluIHRoaXMgc2VnbWVudCB0aGUgdXNlciBjYW4gc2xpZGUgdGhlIGNvbnRyb2wga25vYiB0byBzZWxlY3QgYVxuKiB2YWx1ZS5cbipcbiogQGFsaWFzIFJhYy5SYXlDb250cm9sXG4qIEBleHRlbmRzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgUmF5Q29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBSYXlDb250cm9sYCBpbnN0YW5jZSB3aXRoIHRoZSBzdGFydGluZyBgdmFsdWVgIGFuZCB0aGVcbiAgKiBpbnRlcmFjdGl2ZSBgbGVuZ3RoYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGBhbmNob3JgIHJheSBhdmFpbGFibGUgZm9yXG4gICogICB1c2VyIGludGVyYWN0aW9uXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSwgbGVuZ3RoKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBMZW5ndGggb2YgdGhlIGBhbmNob3JgIHJheSBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAvKipcbiAgICAqIGBSYXlgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIERlZmluZXMgdGhlIGxvY2F0aW9uXG4gICAgKiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbiAgICAqXG4gICAgKiBBbG9uZyB3aXRoIGBbbGVuZ3RoXXtAbGluayBSYWMuUmF5Q29udHJvbCNsZW5ndGh9YCBkZWZpbmVzIHRoZVxuICAgICogc2VnbWVudCBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGNvbnRyb2wgY2Fubm90IGJlIGRyYXduIG9yIHNlbGVjdGVkIHVudGlsIHRoaXMgcHJvcGVydHkgaXMgc2V0LlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlJheX1cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyYWMuY29udHJvbGxlci5hdXRvQWRkQ29udHJvbHMpIHtcbiAgICAgIHJhYy5jb250cm9sbGVyLmFkZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIFRPRE86IGRvY3VtZW50LCB0ZXN0XG4gIHN0YXJ0TGltaXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRMaW1pdCAqIHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgLy8gVE9ETzogZG9jdW1lbnQsIHRlc3RcbiAgZW5kTGltaXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kTGltaXQgKiB0aGlzLmxlbmd0aDtcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBgdmFsdWVgIHVzaW5nIHRoZSBwcm9qZWN0aW9uIG9mIGBsZW5ndGhWYWx1ZWAgaW4gdGhlIGBbMCxsZW5ndGhdYFxuICAqIHJhbmdlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFZhbHVlIC0gVGhlIGxlbmd0aCBhdCB3aGljaCB0byBzZXQgdGhlIGN1cnJlbnRcbiAgKiAgIHZhbHVlXG4gICovXG4gIHNldFZhbHVlV2l0aExlbmd0aChsZW5ndGhWYWx1ZSkge1xuICAgIGxldCBsZW5ndGhSYXRpbyA9IGxlbmd0aFZhbHVlIC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IGxlbmd0aFJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgbGVuZ3RoYCwgY29ycmVzcG9uZGluZ2x5LCBib3RoIHByb2plY3RlZCBpbiB0aGUgYFswLGxlbmd0aF1gXG4gICogcmFuZ2UuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIFJheUNvbnRyb2wgd2l0aCBsZW5ndGggb2YgMjAwPC9jYXB0aW9uPlxuICAqIGxldCBjb250cm9sID0gbmV3IFJhYy5SYXlDb250cm9sKHJhYywgMC41LCAyMDApO1xuICAqIGNvbnRyb2wuc2V0TGltaXRzV2l0aExlbmd0aEluc2V0cygxMCwgMjApO1xuICAqIC8vIHJldHVybnMgMTAsIHNpbmNlIDAgKyAxMCA9IDEwXG4gICogY29udHJvbC5zdGFydExpbWl0TGVuZ3RoKClcbiAgKiAvLyByZXR1cm5zIDAuMDUsIHNpbmNlIDAgKyAoMTAgLyAyMDApID0gMC4wNVxuICAqIGNvbnRyb2wuc3RhcnRMaW1pdFxuICAqIC8vIHJldHVybnMgMTgwLCBzaW5jZSAyMDAgLSAyMCA9IDE4MFxuICAqIGNvbnRyb2wuZW5kTGltaXRMZW5ndGgoKVxuICAqIC8vIHJldHVybnMgMC45LCBzaW5jZSAxIC0gKDIwIC8gMjAwKSA9IDAuOVxuICAqIGNvbnRyb2wuZW5kTGltaXRcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIGluIHRoZSByYW5nZVxuICAqICAgYFswLGxlbmd0aF1gIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYGxlbmd0aGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsbGVuZ3RoXWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSBzdGFydEluc2V0IC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBgYW5jaG9yYCByYXkgYHN0YXJ0YCBhbmQgdGhlIGNvbnRyb2xcbiAgKiBrbm9iLlxuICAqXG4gICogRXF1aXZhbGVudCB0byB0aGUgY29udHJvbCBgdmFsdWVgIHByb2plY3RlZCB0byB0aGUgcmFuZ2UgYFswLGxlbmd0aF1gLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgZGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoICogdGhpcy52YWx1ZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogV2hlbiBgYW5jaG9yYCBpcyBub3Qgc2V0LCByZXR1cm5zIGBudWxsYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybiB7P1JhYy5Qb2ludH1cbiAgKi9cbiAga25vYigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSB0aGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0RGlzdGFuY2UodGhpcy5kaXN0YW5jZSgpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCB0aGUgYGFuY2hvcmAgcmF5IHdpdGggYGxlbmd0aGAsXG4gICogdG8gYmUgcGVyc2lzdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBhbmNob3JgIGlzIG5vdCBzZXQuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbihcbiAgICAgICAgYEV4cGVjdGVkIGFuY2hvciB0byBiZSBzZXQsIG51bGwgZm91bmQgaW5zdGVhZGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iuc2VnbWVudCh0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqL1xuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIGZpeGVkQW5jaG9yLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuYW5nbGUoKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IHBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5sZW5ndGggKiBpdGVtKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgcG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wga25vYlxuICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gTmVnYXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA+PSB0aGlzLnN0YXJ0TGltaXQgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBhbmdsZS5pbnZlcnNlKCkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aXZlIGFycm93XG4gICAgaWYgKHRoaXMudmFsdWUgPD0gdGhpcy5lbmRMaW1pdCAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KGNvbnRyb2xTdHlsZSk7XG5cbiAgICAvLyBTZWxlY3Rpb25cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICAgIGlmIChwb2ludGVyU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqXG4gICogYHZhbHVlYCBpcyBhbHdheXMgdXBkYXRlZCBieSB0aGlzIG1ldGhvZCB0byBiZSB3aXRoaW4gKlswLDFdKiBhbmRcbiAgKiBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IGZpeGVkQW5jaG9yIC0gYFNlZ21lbnRgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYFxuICAqICAgd2hlbiB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdDtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMuZW5kTGltaXQpO1xuXG4gICAgLy8gTmV3IHZhbHVlIGZyb20gdGhlIGN1cnJlbnQgcG9pbnRlciBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gZml4ZWRBbmNob3JcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnRlcktub2JDZW50ZXIpO1xuICAgIC8vIENsYW1waW5nIHZhbHVlIChqYXZhc2NyaXB0IGhhcyBubyBNYXRoLmNsYW1wKVxuICAgIG5ld0Rpc3RhbmNlID0gZml4ZWRBbmNob3IuY2xhbXBUb0xlbmd0aChuZXdEaXN0YW5jZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UgLyBsZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IGxlbmd0aFJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGFsb25nIHdpdGggcG9pbnRlciBpbnRlcmFjdGlvbiB2aXN1YWxzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IGZpeGVkQW5jaG9yIC0gYFNlZ21lbnRgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYFxuICAqICAgd2hlbiB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG4gICAgZml4ZWRBbmNob3IuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCBhbmdsZSA9IGZpeGVkQW5jaG9yLmFuZ2xlKCk7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlclBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogaXRlbSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5Qb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1pblBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5kTGltaXQgPCAxKSB7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiB0aGlzLmVuZExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWF4UG9pbnQsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBDb25zdHJhaW5lZCBsZW5ndGggY2xhbXBlZCB0byBsaW1pdHNcbiAgICBsZXQgY29uc3RyYWluZWRMZW5ndGggPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQoZHJhZ2dlZENlbnRlcik7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBsZW5ndGggKiB0aGlzLnN0YXJ0TGltaXQ7XG4gICAgbGV0IGVuZEluc2V0ID0gbGVuZ3RoICogKDEgLSB0aGlzLmVuZExpbWl0KTtcbiAgICBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yLmNsYW1wVG9MZW5ndGgoY29uc3RyYWluZWRMZW5ndGgsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICBsZXQgY29uc3RyYWluZWRBbmNob3JDZW50ZXIgPSBmaXhlZEFuY2hvclxuICAgICAgLndpdGhMZW5ndGgoY29uc3RyYWluZWRMZW5ndGgpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgY2VudGVyIGNvbnN0cmFpbmVkIHRvIGFuY2hvclxuICAgIGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYWdnZWQgc2hhZG93IGNlbnRlciwgc2VtaSBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgLy8gYWx3YXlzIHBlcnBlbmRpY3VsYXIgdG8gYW5jaG9yXG4gICAgbGV0IGRyYWdnZWRTaGFkb3dDZW50ZXIgPSBkcmFnZ2VkQ2VudGVyXG4gICAgICAuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KGZpeGVkQW5jaG9yLnJheSlcbiAgICAgIC8vIHJldmVyc2UgYW5kIHRyYW5zbGF0ZWQgdG8gY29uc3RyYWludCB0byBhbmNob3JcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoU3RhcnRQb2ludChjb25zdHJhaW5lZEFuY2hvckNlbnRlcilcbiAgICAgIC8vIFNlZ21lbnQgZnJvbSBjb25zdHJhaW5lZCBjZW50ZXIgdG8gc2hhZG93IGNlbnRlclxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBzaGFkb3cgY2VudGVyXG4gICAgZHJhZ2dlZFNoYWRvd0NlbnRlci5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzIC8gMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRWFzZSBmb3Igc2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZWFzZU91dCA9IFJhYy5FYXNlRnVuY3Rpb24ubWFrZUVhc2VPdXQoKTtcbiAgICBlYXNlT3V0LnBvc3RCZWhhdmlvciA9IFJhYy5FYXNlRnVuY3Rpb24uQmVoYXZpb3IuY2xhbXA7XG5cbiAgICAvLyBUYWlsIHdpbGwgc3RvcCBzdHJldGNoaW5nIGF0IDJ4IHRoZSBtYXggdGFpbCBsZW5ndGhcbiAgICBsZXQgbWF4RHJhZ2dlZFRhaWxMZW5ndGggPSB0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiA1O1xuICAgIGVhc2VPdXQuaW5SYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoICogMjtcbiAgICBlYXNlT3V0Lm91dFJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBkcmFnZ2VkVGFpbCA9IGRyYWdnZWRTaGFkb3dDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qb2ludChkcmFnZ2VkQ2VudGVyKTtcblxuICAgIGxldCBlYXNlZExlbmd0aCA9IGVhc2VPdXQuZWFzZVZhbHVlKGRyYWdnZWRUYWlsLmxlbmd0aCk7XG4gICAgZHJhZ2dlZFRhaWwud2l0aExlbmd0aChlYXNlZExlbmd0aCkuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYXcgYWxsIVxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJheUNvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheUNvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBbmdsZSBtZWFzdXJlZCB3aXRoIGEgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMSkqIHRoYXQgcmVwcmVzZW50c1xuKiB0aGUgYW1vdW50IG9mIHR1cm4gaW4gYSBmdWxsIGNpcmNsZS5cbipcbiogTW9zdCBmdW5jdGlvbnMgdGhyb3VnaCBSQUMgdGhhdCBjYW4gcmVjZWl2ZSBhbiBgQW5nbGVgIHBhcmFtZXRlciBjYW5cbiogYWxzbyByZWNlaXZlIGEgYG51bWJlcmAgdmFsdWUgdGhhdCB3aWxsIGJlIHVzZWQgYXMgYHR1cm5gIHRvIGluc3RhbnRpYXRlXG4qIGEgbmV3IGBBbmdsZWAuIFRoZSBtYWluIGV4Y2VwdGlvbiB0byB0aGlzIGJlaGF2aW91ciBhcmUgY29uc3RydWN0b3JzLFxuKiB3aGljaCBhbHdheXMgZXhwZWN0IHRvIHJlY2VpdmUgYEFuZ2xlYCBvYmplY3RzLlxuKlxuKiBGb3IgZHJhd2luZyBvcGVyYXRpb25zIHRoZSB0dXJuIHZhbHVlIG9mIGAwYCBwb2ludHMgcmlnaHQsIHdpdGggdGhlXG4qIGRpcmVjdGlvbiByb3RhdGluZyBjbG9ja3dpc2U6XG4qIGBgYFxuKiByYWMuQW5nbGUoMC80KSAvLyBwb2ludHMgcmlnaHRcbiogcmFjLkFuZ2xlKDEvNCkgLy8gcG9pbnRzIGRvd253YXJkc1xuKiByYWMuQW5nbGUoMi80KSAvLyBwb2ludHMgbGVmdFxuKiByYWMuQW5nbGUoMy80KSAvLyBwb2ludHMgdXB3YXJkc1xuKiBgYGBcbipcbiogIyMjIGBpbnN0YW5jZS5BbmdsZWBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5BbmdsZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNBbmdsZX0gdG8gY3JlYXRlIGBBbmdsZWAgb2JqZWN0cyB3aXRoXG4qIGZld2VyIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuQW5nbGUucXVhcnRlcmBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9LCBsaXN0ZWQgdW5kZXJcbiogW2BpbnN0YW5jZS5BbmdsZWBde0BsaW5rIGluc3RhbmNlLkFuZ2xlfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgYW5nbGUgPSBuZXcgUmFjLkFuZ2xlKHJhYywgMy84KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJBbmdsZSA9IHJhYy5BbmdsZSgzLzgpXG4qXG4qIEBzZWUgW2ByYWMuQW5nbGVgXXtAbGluayBSYWMjQW5nbGV9XG4qIEBzZWUgW2BpbnN0YW5jZS5BbmdsZWBde0BsaW5rIGluc3RhbmNlLkFuZ2xlfVxuKlxuKiBAYWxpYXMgUmFjLkFuZ2xlXG4qL1xuY2xhc3MgQW5nbGUge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFuZ2xlYCBpbnN0YW5jZS5cbiAgKlxuICAqIFRoZSBgdHVybmAgdmFsdWUgaXMgY29uc3RyYWluZWQgdG8gdGhlIHJhbmdlICpbMCwxKSosIGFueSB2YWx1ZVxuICAqIG91dHNpZGUgaXMgcmVkdWNlZCBpbnRvIHJhbmdlIHVzaW5nIGEgbW9kdWxvIG9wZXJhdGlvbjpcbiAgKiBgYGBcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIDEvNCkpIC50dXJuIC8vIHJldHVybnMgMS80XG4gICogKG5ldyBSYWMuQW5nbGUocmFjLCA1LzQpKSAudHVybiAvLyByZXR1cm5zIDEvNFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgLTEvNCkpLnR1cm4gLy8gcmV0dXJucyAzLzRcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIDEpKSAgIC50dXJuIC8vIHJldHVybnMgMFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgNCkpICAgLnR1cm4gLy8gcmV0dXJucyAwXG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHR1cm4gLSBUaGUgdHVybiB2YWx1ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHR1cm4pIHtcbiAgICAvLyBUT0RPOiBjaGFuZ2VkIHRvIGFzc2VydFR5cGUsIGFkZCB0ZXN0c1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLCByYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih0dXJuKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgdHVybiA9IHR1cm4gJSAxO1xuICAgIGlmICh0dXJuIDwgMCkge1xuICAgICAgdHVybiA9ICh0dXJuICsgMSkgJSAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogVHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5nZSAqWzAsMSkqLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudHVybiA9IHR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuQW5nbGUoMC4yKSkudG9TdHJpbmcoKVxuICAqIC8vIHJldHVybnM6ICdBbmdsZSgwLjIpJ1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBbmdsZSgke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCB0aGUgYHR1cm5gIHZhbHVlIG9mIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5BbmdsZS5mcm9tfSBgYW5nbGVgIGlzIHVuZGVyXG4gICogW2ByYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI3VuaXRhcnlFcXVhbGl0eVRocmVzaG9sZH07XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFRoZSBgb3RoZXJBbmdsZWAgcGFyYW1ldGVyIGNhbiBvbmx5IGJlIGBBbmdsZWAgb3IgYG51bWJlcmAsIGFueSBvdGhlclxuICAqIHR5cGUgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVGhpcyBtZXRob2Qgd2lsbCBjb25zaWRlciB0dXJuIHZhbHVlcyBpbiB0aGUgb3Bvc2l0ZSBlbmRzIG9mIHRoZSByYW5nZVxuICAqICpbMCwxKSogYXMgZXF1YWxzLiBFLmcuIGBBbmdsZWAgb2JqZWN0cyB3aXRoIGB0dXJuYCB2YWx1ZXMgb2YgYDBgIGFuZFxuICAqIGAxIC0gcmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZC8yYCB3aWxsIGJlIGNvbnNpZGVyZWQgZXF1YWwuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFtgcmFjLkFuZ2xlLmZyb21gXXtAbGluayBSYWMuQW5nbGUuZnJvbX1cbiAgKi9cbiAgZXF1YWxzKG90aGVyQW5nbGUpIHtcbiAgICBpZiAob3RoZXJBbmdsZSBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgLy8gYWxsIGdvb2QhXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3RoZXJBbmdsZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIG90aGVyQW5nbGUgPSBBbmdsZS5mcm9tKHRoaXMucmFjLCBvdGhlckFuZ2xlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyh0aGlzLnR1cm4gLSBvdGhlckFuZ2xlLnR1cm4pO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG4gICAgICAvLyBGb3IgY2xvc2UgdmFsdWVzIHRoYXQgbG9vcCBhcm91bmRcbiAgICAgIHx8ICgxIC0gZGlmZikgPCB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEFuZ2xlYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGBudW1iZXJgLCByZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aFxuICAqICAgYHNvbWV0aGluZ2AgYXMgYHR1cm5gLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGB7QGxpbmsgUmFjLlJheX1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5TZWdtZW50fWAsIHJldHVybnMgaXRzIGFuZ2xlLlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR8TnVtYmVyfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYW4gYEFuZ2xlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkFuZ2xlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvbWV0aGluZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlJheSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5hbmdsZTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TZWdtZW50KSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nLnJheS5hbmdsZTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkFuZ2xlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGByYWRpYW5zYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5zIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiByYWRpYW5zXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21SYWRpYW5zKHJhYywgcmFkaWFucykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCByYWRpYW5zIC8gUmFjLlRBVSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYGRlZ3JlZXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRlZ3JlZXMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIGRlZ3JlZXNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdGF0aWMgZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIGRlZ3JlZXMgLyAzNjApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcG9pbnRpbmcgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiB0byBgdGhpc2AuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnMgMy84LCBzaW5jZSAxLzggKyAxLzIgPSA1LzhcbiAgKiByYWMuQW5nbGUoMS84KS5pbnZlcnNlKCkudHVyblxuICAqIC8vIHJldHVybnMgMy84LCBzaW5jZSA3LzggKyAxLzIgPSAzLzhcbiAgKiByYWMuQW5nbGUoNy84KS5pbnZlcnNlKCkudHVyblxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgaW52ZXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGQodGhpcy5yYWMuQW5nbGUuaW52ZXJzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGEgdHVybiB2YWx1ZSBlcXVpdmFsZW50IHRvIGAtdHVybmAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnMgMy80LCBzaW5jZSAxIC0gMS80ID0gMy80XG4gICogcmFjLkFuZ2xlKDEvNCkubmVnYXRpdmUoKS50dXJuXG4gICogLy8gcmV0dXJucyA1LzgsIHNpbmNlIDEgLSAzLzggPSA1LzhcbiAgKiByYWMuQW5nbGUoMy84KS5uZWdhdGl2ZSgpLnR1cm5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIG5lZ2F0aXZlKCkge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIC10aGlzLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2hpY2ggaXMgcGVycGVuZGljdWxhciB0byBgdGhpc2AgaW4gdGhlXG4gICogYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnMgMy84LCBzaW5jZSAxLzggKyAxLzQgPSAzLzhcbiAgKiByYWMuQW5nbGUoMS84KS5wZXJwZW5kaWN1bGFyKHRydWUpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDcvOCwgc2luY2UgMS84IC0gMS80ID0gNy84XG4gICogcmFjLkFuZ2xlKDEvOCkucGVycGVuZGljdWxhcihmYWxzZSkudHVyblxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpZnQodGhpcy5yYWMuQW5nbGUuc3F1YXJlLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSBpbiByYWRpYW5zLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgcmFkaWFucygpIHtcbiAgICByZXR1cm4gdGhpcy50dXJuICogUmFjLlRBVTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gZGVncmVlcy5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGRlZ3JlZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudHVybiAqIDM2MDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgc2luZSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBzaW4oKSB7XG4gICAgcmV0dXJuIE1hdGguc2luKHRoaXMucmFkaWFucygpKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBjb3NpbmUgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgY29zKCkge1xuICAgIHJldHVybiBNYXRoLmNvcyh0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgdGFuZ2VudCBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICB0YW4oKSB7XG4gICAgcmV0dXJuIE1hdGgudGFuKHRoaXMucmFkaWFucygpKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgdHVybmAgdmFsdWUgaW4gdGhlIHJhbmdlIGAoMCwgMV1gLiBXaGVuIGB0dXJuYCBpcyBlcXVhbCB0b1xuICAqIGAwYCByZXR1cm5zIGAxYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgdHVybk9uZSgpIHtcbiAgICBpZiAodGhpcy50dXJuID09PSAwKSB7IHJldHVybiAxOyB9XG4gICAgcmV0dXJuIHRoaXMudHVybjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggdGhlIHN1bSBvZiBgdGhpc2AgYW5kIHRoZSBhbmdsZSBkZXJpdmVkIGZyb21cbiAgKiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYWRkKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gKyBhbmdsZS50dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbSBgYW5nbGVgXG4gICogc3VidHJhY3RlZCB0byBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzdWJ0cmFjdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN1YnRyYWN0KGFuZ2xlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gLSBhbmdsZS50dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYHR1cm5gIHNldCB0byBgdGhpcy50dXJuICogZmFjdG9yYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBmYWN0b3IgLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGB0dXJuYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIG11bHQoZmFjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICogZmFjdG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYHR1cm5gIHNldCB0b1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI3R1cm5PbmUgdGhpcy50dXJuT25lKCl9ICogZmFjdG9yYC5cbiAgKlxuICAqIFVzZWZ1bCB3aGVuIGRvaW5nIHJhdGlvIGNhbGN1bGF0aW9ucyB3aGVyZSBhIHplcm8gYW5nbGUgY29ycmVzcG9uZHMgdG9cbiAgKiBhIGNvbXBsZXRlLWNpcmNsZS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLkFuZ2xlKDApLm11bHQoMC41KS50dXJuICAgIC8vIHJldHVybnMgMFxuICAqIC8vIHdoZXJlYXNcbiAgKiByYWMuQW5nbGUoMCkubXVsdE9uZSgwLjUpLnR1cm4gLy8gcmV0dXJucyAwLjVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBmYWN0b3IgLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGB0dXJuYCBieVxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIG11bHRPbmUoZmFjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuT25lKCkgKiBmYWN0b3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzYCB0byB0aGVcbiAgKiBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAxLzIsIHNpbmNlIDEvMiAtIDEvNCA9IDEvNFxuICAqIHJhYy5BbmdsZSgxLzQpLmRpc3RhbmNlKDEvMiwgdHJ1ZSkudHVyblxuICAqIC8vIHJldHVybnMgMy80LCBzaW5jZSAxIC0gKDEvMiAtIDEvNCkgPSAzLzRcbiAgKiByYWMuQW5nbGUoMS80KS5kaXN0YW5jZSgxLzIsIGZhbHNlKS50dXJuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtZWFzdXJlIHRoZSBkaXN0YW5jZSB0b1xuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbWVhc3VyZW1lbnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZShhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzKTtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IGRpc3RhbmNlXG4gICAgICA6IGRpc3RhbmNlLm5lZ2F0aXZlKCk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcmVzdWx0IG9mIHNoaWZ0aW5nIHRoZSBhbmdsZSBkZXJpdmVkIGZyb21cbiAgKiBgYW5nbGVgIHRvIGhhdmUgYHRoaXNgIGFzIGl0cyBvcmlnaW4uXG4gICpcbiAgKiBUaGlzIG9wZXJhdGlvbiBpcyB0aGUgZXF1aXZhbGVudCB0b1xuICAqICsgYHRoaXMuYWRkKGFuZ2xlKWAgd2hlbiBjbG9ja3dpc2VcbiAgKiArIGB0aGlzLnN1YnRyYWN0KGFuZ2xlKWAgd2hlbiBjb3VudGVyLWNsb2Nrd2lzZVxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDAuNCwgc2luY2UgMC4xICsgMC4zID0gMC40XG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnQoMC4zLCB0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjgsIHNpbmNlIDAuMSAtIDAuMyA9IDAuOFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuMywgZmFsc2UpLnR1cm5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gdGhpcy5hZGQoYW5nbGUpXG4gICAgICA6IHRoaXMuc3VidHJhY3QoYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcmVzdWx0IG9mIHNoaWZ0aW5nIGB0aGlzYCB0byBoYXZlIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgZnJvbSBgb3JpZ2luYCBhcyBpdHMgb3JpZ2luLlxuICAqXG4gICogVGhlIHJlc3VsdCBvZiBgYW5nbGUuc2hpZnRUb09yaWdpbihvcmlnaW4pYCBpcyBlcXVpdmFsZW50IHRvXG4gICogYG9yaWdpbi5zaGlmdChhbmdsZSlgLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgdGhlIGVxdWl2YWxlbnQgdG9cbiAgKiArIGBvcmlnaW4uYWRkKHRoaXMpYCB3aGVuIGNsb2Nrd2lzZVxuICAqICsgYG9yaWdpbi5zdWJ0cmFjdCh0aGlzKWAgd2hlbiBjb3VudGVyLWNsb2Nrd2lzZVxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDAuNCwgc2luY2UgMC4zICsgMC4xID0gMC40XG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjMsIHRydWUpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDAuMiwgc2luY2UgMC4zIC0gMC4xID0gMC4yXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjMsIGZhbHNlKS50dXJuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG9yaWdpbiAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIG9yaWdpblxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzaGlmdFRvT3JpZ2luKG9yaWdpbiwgY2xvY2t3aXNlKSB7XG4gICAgb3JpZ2luID0gdGhpcy5yYWMuQW5nbGUuZnJvbShvcmlnaW4pO1xuICAgIHJldHVybiBvcmlnaW4uc2hpZnQodGhpcywgY2xvY2t3aXNlKTtcbiAgfVxuXG59IC8vIGNsYXNzIEFuZ2xlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbmdsZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuXG4vKipcbiogQXJjIG9mIGEgY2lyY2xlIGZyb20gYSBgc3RhcnRgIHRvIGFuIGBlbmRgIFthbmdsZV17QGxpbmsgUmFjLkFuZ2xlfS5cbipcbiogQXJjcyB0aGF0IGhhdmUgW2VxdWFsXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfSBgc3RhcnRgIGFuZCBgZW5kYCBhbmdsZXNcbiogYXJlIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4qXG4qICMjIyBgaW5zdGFuY2UuQXJjYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkFyY2AgZnVuY3Rpb25de0BsaW5rIFJhYyNBcmN9IHRvIGNyZWF0ZSBgQXJjYCBvYmplY3RzIGZyb21cbiogcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5BcmMuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFyYyN6ZXJvfSwgbGlzdGVkXG4qIHVuZGVyIFtgaW5zdGFuY2UuQXJjYF17QGxpbmsgaW5zdGFuY2UuQXJjfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgY2VudGVyID0gcmFjLlBvaW50KDU1LCA3NylcbiogbGV0IHN0YXJ0ID0gcmFjLkFuZ2xlKDEvOClcbiogbGV0IGVuZCA9IHJhYy5BbmdsZSgzLzgpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBhcmMgPSBuZXcgUmFjLkFyYyhyYWMsIGNlbnRlciwgMTAwLCBzdGFydCwgZW5kLCB0cnVlKVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJBcmMgPSByYWMuQXJjKDU1LCA3NywgMS84LCAzLzgpXG4qXG4qIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuKiBAc2VlIFtgcmFjLkFyY2Bde0BsaW5rIFJhYyNBcmN9XG4qIEBzZWUgW2BpbnN0YW5jZS5BcmNgXXtAbGluayBpbnN0YW5jZS5BcmN9XG4qXG4qIEBhbGlhcyBSYWMuQXJjXG4qL1xuY2xhc3MgQXJje1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IGNlbnRlciAtIFRoZSBjZW50ZXIgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gc3RhcnQgLSBBbiBgQW5nbGVgIHdoZXJlIHRoZSBhcmMgc3RhcnRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGVuZCAtIEFuZyBgQW5nbGVgIHdoZXJlIHRoZSBhcmMgZW5kc1xuICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmNcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLFxuICAgIGNlbnRlciwgcmFkaXVzLFxuICAgIHN0YXJ0LCBlbmQsXG4gICAgY2xvY2t3aXNlKVxuICB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQsIGNsb2Nrd2lzZSk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIGNlbnRlcik7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHJhZGl1cyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIHN0YXJ0LCBlbmQpO1xuICAgIHV0aWxzLmFzc2VydEJvb2xlYW4oY2xvY2t3aXNlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgY2VudGVyIGBQb2ludGAgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIC8qKlxuICAgICogVGhlIHJhZGl1cyBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgYEFuZ2xlYCBvZiB0aGUgYXJjLiBUaGUgYXJjIGlzIGRyYXcgZnJvbSB0aGlzIGFuZ2xlIHRvd2FyZHNcbiAgICAqIGBlbmRgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgICAqXG4gICAgKiBXaGVuIGBzdGFydGAgYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICogdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqL1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuXG4gICAgLyoqXG4gICAgKiBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gYHN0YXJ0YCB0byB0aGlzXG4gICAgKiBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKi9cbiAgICB0aGlzLmVuZCA9IGVuZDtcblxuICAgIC8qKlxuICAgICogVGhlIG9yaWVudGlhdGlvbiBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgKi9cbiAgICB0aGlzLmNsb2Nrd2lzZSA9IGNsb2Nrd2lzZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmNlbnRlci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgcmFkaXVzU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmFkaXVzLCAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFN0ciAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFN0ciAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC50dXJuLCAgIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBcmMoKCR7eFN0cn0sJHt5U3RyfSkgcjoke3JhZGl1c1N0cn0gczoke3N0YXJ0U3RyfSBlOiR7ZW5kU3RyfSBjOiR7dGhpcy5jbG9ja3dpc2V9fSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzLCBleGNlcHQgYHJhY2AsIG9mIGJvdGggYXJjcyBhcmUgZXF1YWw7XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyQXJjYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkFyY2AsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEFyY3MnIGByYWRpdXNgIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IG90aGVyU2VnbWVudCAtIEEgYFNlZ21lbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgKiBAc2VlIFtgcmFjLmVxdWFsc2Bde0BsaW5rIFJhYyNlcXVhbHN9XG4gICovXG4gIGVxdWFscyhvdGhlckFyYykge1xuICAgIHJldHVybiBvdGhlckFyYyBpbnN0YW5jZW9mIEFyY1xuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMucmFkaXVzLCBvdGhlckFyYy5yYWRpdXMpXG4gICAgICAmJiB0aGlzLmNsb2Nrd2lzZSA9PT0gb3RoZXJBcmMuY2xvY2t3aXNlXG4gICAgICAmJiB0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJBcmMuc3RhcnQpXG4gICAgICAmJiB0aGlzLmVuZC5lcXVhbHMob3RoZXJBcmMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmM6IHRoZSBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIHRoZSBhcmNcbiAgKiByZXByZXNlbnRzLlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlKCkudHVybk9uZSgpICogdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBjaXJjdW1mZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cyAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGJldHdlZW4gYHN0YXJ0YCBhbmRcbiAgKiBgZW5kYCwgaW4gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmMuXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYW5nbGVEaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCB3aGVyZSB0aGUgYXJjIHN0YXJ0cy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdGFydFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZSh0aGlzLnN0YXJ0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZSh0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgY2VudGVyYCB0b3dhcnMgYHN0YXJ0YC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgc3RhcnRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgY2VudGVyYCB0b3dhcnMgYGVuZGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGVuZFJheSgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRhbmdlbnQgdG8gdGhlIGFyYyBzdGFydGluZyBhdCBgc3RhcnRQb2ludCgpYCBhbmRcbiAgKiB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKi9cbiAgc3RhcnRUYW5nZW50UmF5KCkge1xuICAgIGxldCB0YW5nZW50QW5nbGUgPSB0aGlzLnN0YXJ0LnBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0UG9pbnQoKS5yYXkodGFuZ2VudEFuZ2xlKTtcbiAgfVxuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBVbml0IFRlc3QgYW5kIFZpc3VhbCBUZXN0XG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGFuZ2VudCB0byB0aGUgYXJjIHN0YXJ0aW5nIGF0IGBlbmRQb2ludCgpYCBhbmRcbiAgKiBhZ2FpbnN0IHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKi9cbiAgZW5kVGFuZ2VudFJheSgpIHtcbiAgICBsZXQgdGFuZ2VudEFuZ2xlID0gdGhpcy5lbmQucGVycGVuZGljdWxhcighdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLmVuZFBvaW50KCkucmF5KHRhbmdlbnRBbmdsZSk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGF0IGBzdGFydGAuXG4gICogVGhlIHNlZ21lbnQgc3RhcnRzIHN0YXJ0cyBhdCBgY2VudGVyYCBhbmQgZW5kcyBhdCBgc3RhcnRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHN0YXJ0UmFkaXVzU2VnbWVudCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLnN0YXJ0UmF5KCksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCBgc3RhcnRgLlxuICAqIFRoZSBzZWdtZW50IHN0YXJ0cyBzdGFydHMgYXQgYGNlbnRlcmAgYW5kIGVuZHMgYXQgYHN0YXJ0UG9pbnQoKWAuXG4gICpcbiAgKiBFcXVpdmFsZW50IHRvIFtgc3RhcnRSYWRpdXNTZWdtZW50YF17QGxpbmsgUmFjLkFyYyNzdGFydFJhZGl1c1NlZ21lbnR9LlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc3RhcnRTZWdtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0UmFkaXVzU2VnbWVudCgpXG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGF0IGBlbmRgLlxuICAqIFRoZSBzZWdtZW50IHN0YXJ0cyBzdGFydHMgYXQgYGNlbnRlcmAgYW5kIGVuZHMgYXQgYGVuZFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgZW5kUmFkaXVzU2VnbWVudCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLmVuZFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgYGVuZGAuXG4gICogVGhlIHNlZ21lbnQgc3RhcnRzIHN0YXJ0cyBhdCBgY2VudGVyYCBhbmQgZW5kcyBhdCBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBFcXVpdmFsZW50IHRvIFtgZW5kUmFkaXVzU2VnbWVudGBde0BsaW5rIFJhYy5BcmMjZW5kUmFkaXVzU2VnbWVudH0uXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGVuZFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kUmFkaXVzU2VnbWVudCgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBzdGFydFBvaW50KClgIHRvIGBlbmRQb2ludCgpYC5cbiAgKlxuICAqIE5vdGUgdGhhdCBmb3IgY29tcGxldGUgY2lyY2xlIGFyY3MgdGhpcyBzZWdtZW50IHdpbGwgaGF2ZSBhIGxlbmd0aCBvZlxuICAqIHplcm8gYW5kIGJlIHBvaW50ZWQgdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBvZiBgc3RhcnRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBjaG9yZFNlZ21lbnQoKSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuc3RhcnQucGVycGVuZGljdWxhcih0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHRoaXMuZW5kUG9pbnQoKSwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmMgaXMgYSBjb21wbGV0ZSBjaXJjbGUsIHdoaWNoIGlzIHdoZW4gYHN0YXJ0YFxuICAqIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30uXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgKi9cbiAgaXNDaXJjbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZXF1YWxzKHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBzZXQgdG8gYG5ld0NlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0NlbnRlciAtIFRoZSBjZW50ZXIgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENlbnRlcihuZXdDZW50ZXIpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIG5ld0NlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHN0YXJ0IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgY29uc3QgbmV3U3RhcnRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydEFuZ2xlLCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGVuZCBzZXQgdG8gYG5ld0VuZGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdFbmQgLSBUaGUgZW5kIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhFbmQobmV3RW5kKSB7XG4gICAgY29uc3QgbmV3RW5kQW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3RW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZEFuZ2xlLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggcmFkaXVzIHNldCB0byBgbmV3UmFkaXVzYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3UmFkaXVzIC0gVGhlIHJhZGl1cyBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoUmFkaXVzKG5ld1JhZGl1cykge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIG5ld1JhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIG9yaWVudGF0aW9uIHNldCB0byBgbmV3Q2xvY2t3aXNlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IG5ld0Nsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoQ2xvY2t3aXNlKG5ld0Nsb2Nrd2lzZSkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICBuZXdDbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBhcyB0aGUgZGlzdGFuY2VcbiAgKiBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi4gVGhpcyBjaGFuZ2VzIGBlbmRgXG4gICogZm9yIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIG9mIHRoZVxuICAqIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgW2BhcmMuYW5nbGVEaXN0YW5jZWBde0BsaW5rIFJhYy5BcmMjYW5nbGVEaXN0YW5jZX1cbiAgKi9cbiAgd2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYCBhcyB0aGUgbGVuZ3RoIG9mIHRoZVxuICAqIHBhcnQgb2YgdGhlIGNpcmN1bWZlcmVuY2UgaXQgcmVwcmVzZW50cy4gVGhpcyBjaGFuZ2VzIGBlbmRgIGZvciB0aGVcbiAgKiBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgYFswLHJhZGl1cypUQVUpYC4gV2hlbiB0aGUgZ2l2ZW4gYGxlbmd0aGAgaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBbYGxlbmd0aGBde0BsaW5rIFJhYy5BcmMjbGVuZ3RofVxuICAqL1xuICB3aXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBsZW5ndGhgIGFkZGVkIHRvIHRoZSBwYXJ0IG9mIHRoZVxuICAqIGNpcmN1bWZlcmVuY2UgYHRoaXNgIHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIHJlc3VsdGluZyBgbGVuZ3RoYCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgW2BsZW5ndGhgXXtAbGluayBSYWMuQXJjI2xlbmd0aH1cbiAgKi9cbiAgd2l0aExlbmd0aEFkZChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdBbmdsZURpc3RhbmNlID0gKHRoaXMubGVuZ3RoKCkgKyBsZW5ndGgpIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlRGlzdGFuY2UobmV3QW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBhIGBsZW5ndGgoKWAgb2YgYHRoaXMubGVuZ3RoKCkgKiByYXRpb2AuIFRoaXNcbiAgKiBjaGFuZ2VzIGBlbmRgIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlICpbMCxyYWRpdXMqVEFVKSouIFdoZW4gdGhlIGNhbGN1bGF0ZWQgbGVuZ3RoIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSBjdXQgYmFjayBpbnRvIHJhbmdlIHRocm91Z2ggYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoKClgIGJ5XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFtgbGVuZ3RoYF17QGxpbmsgUmFjLkFyYyNsZW5ndGh9XG4gICovXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IHRoaXMubGVuZ3RoKCkgKiByYXRpbztcbiAgICByZXR1cm4gdGhpcy53aXRoTGVuZ3RoKG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRQb2ludCgpYCBsb2NhdGVkIGF0IGBwb2ludGAuIFRoaXNcbiAgKiBjaGFuZ2VzIGBzdGFydGAgYW5kIGByYWRpdXNgIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYHN0YXJ0UG9pbnQoKSBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aFN0YXJ0UG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3UmFkaXVzID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kUG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzIGNoYW5nZXNcbiAgKiBgZW5kYCBhbmQgYHJhZGl1c2AgaW4gdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGF0IHRoZSBgZW5kUG9pbnQoKSBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aEVuZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmVuZCk7XG4gICAgY29uc3QgbmV3UmFkaXVzID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tXG4gICogYGNlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBzdGFydGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhTdGFydFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLnN0YXJ0KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBlbmRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLmVuZGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICB3aXRoRW5kVG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHN0YXJ0UG9pbnRgIGFuZFxuICAqIGBlbmRgIHBvaW50aW5nIHRvd2FyZHMgYGVuZFBvaW50YCwgYm90aCBmcm9tIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqICogV2hlbiBgY2VudGVyYCBpcyBjb25zaWRlcmVkIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gdG9cbiAgKiBlaXRoZXIgYHN0YXJ0UG9pbnRgIG9yIGBlbmRQb2ludGAsIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgXG4gICogb3IgYHRoaXMuZW5kYCByZXNwZWN0aXZlbHkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnRQb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0gez9SYWMuUG9pbnR9IFtlbmRQb2ludD1udWxsXSAtIEEgYFBvaW50YCB0byBwb2ludCBgZW5kYCB0b3dhcmRzO1xuICAqIHdoZW4gb21taXRlZCBvciBgbnVsbGAsIGBzdGFydFBvaW50YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aEFuZ2xlc1Rvd2FyZHNQb2ludChzdGFydFBvaW50LCBlbmRQb2ludCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChzdGFydFBvaW50LCB0aGlzLnN0YXJ0KTtcbiAgICBjb25zdCBuZXdFbmQgPSBlbmRQb2ludCA9PT0gbnVsbFxuICAgICAgPyBuZXdTdGFydFxuICAgICAgOiB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoZW5kUG9pbnQsIHRoaXMuZW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIGBhbmdsZWAgaW4gdGhlXG4gICogYXJjJ3Mgb3Bwb3NpdGUgb3JpZW50YXRpb24uXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGBzdGFydGAgdG8gdGhlIGFyYydzICpvcHBvc2l0ZSpcbiAgKiBvcmllbnRhdGlvbiwgaW50ZW5kaW5nIHRvIHJlc3VsdCBpbiBhIG5ldyBgQXJjYCB3aXRoIGFuIGluY3JlYXNlIHRvXG4gICogYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IGBzdGFydGAgYWdhaW5zdFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoU3RhcnRFeHRlbnNpb24oYW5nbGUpIHtcbiAgICBsZXQgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCAhdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZGAgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gYGFuZ2xlYCBpbiB0aGVcbiAgKiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGlzIG1ldGhvZCBzaGlmdHMgYGVuZGAgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24sXG4gICogaW50ZW5kaW5nIHRvIHJlc3VsdCBpbiBhIG5ldyBgQXJjYCB3aXRoIGFuIGluY3JlYXNlIHRvXG4gICogYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IGBzdGFydGAgYWdhaW5zdFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoRW5kRXh0ZW5zaW9uKGFuZ2xlKSB7XG4gICAgbGV0IG5ld0VuZCA9IHRoaXMuZW5kLnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBpdHMgYHN0YXJ0YCBhbmQgYGVuZGAgZXhjaGFuZ2VkLCBhbmQgdGhlXG4gICogb3Bwb3NpdGUgY2xvY2t3aXNlIG9yaWVudGF0aW9uLiBUaGUgY2VudGVyIGFuZCByYWRpdXMgcmVtYWluIHRoZVxuICAqIHNhbWUgYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLmVuZCwgdGhpcy5zdGFydCxcbiAgICAgICF0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGBhbmdsZWAgY2xhbXBlZCB0byB0aGUgcmFuZ2U6XG4gICogYGBgXG4gICogW3N0YXJ0ICsgc3RhcnRJbnNldCwgZW5kIC0gZW5kSW5zZXRdXG4gICogYGBgXG4gICogd2hlcmUgdGhlIGFkZGl0aW9uIGhhcHBlbnMgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24sIGFuZCB0aGVcbiAgKiBzdWJ0cmFjdGlvbiBhZ2FpbnN0LlxuICAqXG4gICogV2hlbiBgYW5nbGVgIGlzIG91dHNpZGUgdGhlIHJhbmdlLCByZXR1cm5zIHdoaWNoZXZlciByYW5nZSBsaW1pdCBpc1xuICAqIGNsb3Nlci5cbiAgKlxuICAqIFdoZW4gdGhlIHN1bSBvZiB0aGUgZ2l2ZW4gaW5zZXRzIGlzIGxhcmdlciB0aGF0IGB0aGlzLmFyY0Rpc3RhbmNlKClgXG4gICogdGhlIHJhbmdlIGZvciB0aGUgY2xhbXAgaXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGVcbiAgKiByZXR1cm5lZCB2YWx1ZSB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsXG4gICogY2xhbXBsZWQgdG8gYFtzdGFydCwgZW5kXWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBjbGFtcFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gW3N0YXJ0SW5zZXQ9e0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm8gcmFjLkFuZ2xlLnplcm99XSAtXG4gICogICBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmRJbnNldD17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVybyByYWMuQW5nbGUuemVyb31dIC1cbiAgKiAgIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBjbGFtcFRvQW5nbGVzKGFuZ2xlLCBzdGFydEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybywgZW5kSW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuXG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSAmJiBzdGFydEluc2V0LnR1cm4gPT0gMCAmJiBlbmRJbnNldC50dXJuID09IDApIHtcbiAgICAgIC8vIENvbXBsZXRlIGNpcmNsZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIEFuZ2xlIGluIGFyYywgd2l0aCBhcmMgYXMgb3JpZ2luXG4gICAgLy8gQWxsIGNvbXBhcmlzb25zIGFyZSBtYWRlIGluIGEgY2xvY2t3aXNlIG9yaWVudGF0aW9uXG4gICAgY29uc3Qgc2hpZnRlZEFuZ2xlID0gdGhpcy5kaXN0YW5jZUZyb21TdGFydChhbmdsZSk7XG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHNoaWZ0ZWRTdGFydENsYW1wID0gc3RhcnRJbnNldDtcbiAgICBjb25zdCBzaGlmdGVkRW5kQ2xhbXAgPSBhbmdsZURpc3RhbmNlLnN1YnRyYWN0KGVuZEluc2V0KTtcbiAgICBjb25zdCB0b3RhbEluc2V0VHVybiA9IHN0YXJ0SW5zZXQudHVybiArIGVuZEluc2V0LnR1cm47XG5cbiAgICBpZiAodG90YWxJbnNldFR1cm4gPj0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkpIHtcbiAgICAgIC8vIEludmFsaWQgcmFuZ2VcbiAgICAgIGNvbnN0IHJhbmdlRGlzdGFuY2UgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZFN0YXJ0Q2xhbXApO1xuICAgICAgbGV0IGhhbGZSYW5nZTtcbiAgICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHtcbiAgICAgICAgaGFsZlJhbmdlID0gcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYWxmUmFuZ2UgPSB0b3RhbEluc2V0VHVybiA+PSAxXG4gICAgICAgICAgPyByYW5nZURpc3RhbmNlLm11bHRPbmUoMS8yKVxuICAgICAgICAgIDogcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pZGRsZVJhbmdlID0gc2hpZnRlZEVuZENsYW1wLmFkZChoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgbWlkZGxlID0gdGhpcy5zdGFydC5zaGlmdChtaWRkbGVSYW5nZSwgdGhpcy5jbG9ja3dpc2UpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jbGFtcFRvQW5nbGVzKG1pZGRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHNoaWZ0ZWRBbmdsZS50dXJuID49IHNoaWZ0ZWRTdGFydENsYW1wLnR1cm4gJiYgc2hpZnRlZEFuZ2xlLnR1cm4gPD0gc2hpZnRlZEVuZENsYW1wLnR1cm4pIHtcbiAgICAgIC8vIEluc2lkZSBjbGFtcCByYW5nZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIE91dHNpZGUgcmFuZ2UsIGZpZ3VyZSBvdXQgY2xvc2VzdCBsaW1pdFxuICAgIGxldCBkaXN0YW5jZVRvU3RhcnRDbGFtcCA9IHNoaWZ0ZWRTdGFydENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSwgZmFsc2UpO1xuICAgIGxldCBkaXN0YW5jZVRvRW5kQ2xhbXAgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlKTtcbiAgICBpZiAoZGlzdGFuY2VUb1N0YXJ0Q2xhbXAudHVybiA8PSBkaXN0YW5jZVRvRW5kQ2xhbXAudHVybikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQuc2hpZnQoc3RhcnRJbnNldCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQuc2hpZnQoZW5kSW5zZXQsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBhbmdsZWAgaXMgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gdGhlIGFyYyByZXByZXNlbnRzIGEgY29tcGxldGUgY2lyY2xlLCBgdHJ1ZWAgaXMgYWx3YXlzIHJldHVybmVkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBpZiAodGhpcy5jbG9ja3dpc2UpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIGxldCBlbmRPZmZzZXQgPSB0aGlzLmVuZC5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybiBvZmZzZXQudHVybiA8PSBlbmRPZmZzZXQudHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMuc3RhcnQuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IHN0YXJ0T2Zmc2V0LnR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIGluIHRoZSBhcmMgaXMgcG9zaXRpb25lZFxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNQcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgYW5nbGVgIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICogYHN0YXJ0YCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYygwLCAwLCAwLjUsIG51bGwsIHRydWUpXG4gICogLy8gcmV0dXJucyAwLjYsIHNpbmNlIDAuNSArIDAuMSA9IDAuNlxuICAqIGFyYy5zaGlmdEFuZ2xlKDAuMSlcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IDxjb2RlPjAuNTwvY29kZT48L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoMCwgMCwgMC41LCBudWxsLCBmYWxzZSlcbiAgKiAvLyByZXR1cm5zIDAuMywgc2luY2UgMC41IC0gMC4yID0gMC4zXG4gICogYXJjLnNoaWZ0QW5nbGUoMC4yKVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKi9cbiAgc2hpZnRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBzdGFydGBcbiAgKiB0byBgYW5nbGVgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIENhbiBiZSB1c2VkIHRvIGRldGVybWluZSwgZm9yIGEgZ2l2ZW4gYW5nbGUsIHdoZXJlIGl0IHNpdHMgaW5zaWRlIHRoZVxuICAqIGFyYyBpZiB0aGUgYXJjIGBzdGFydGAgd2FzIHRoZSBvcmlnaW4gYW5nbGUuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYyg1NSwgNzcsIDAuNSwgbnVsbCwgdHJ1ZSlcbiAgKiAvLyByZXR1cm5zIDAuMiwgc2luY2UgMC43IC0gMC41ID0gMC4yXG4gICogYXJjLmRpc3RhbmNlRnJvbVN0YXJ0KDAuNylcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IDxjb2RlPjAuNTwvY29kZT48L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoNTUsIDc3LCAwLjUsIG51bGwsIGZhbHNlKVxuICAqIC8vIHJldHVybnMgMC44LCBzaW5jZSAxIC0gKDAuNyAtIDAuNSkgPSAwLjhcbiAgKiBhcmMuZGlzdGFuY2VGcm9tU3RhcnQoMC43KVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZUZyb21TdGFydChhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZShhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgLiBUaGlzXG4gICogbWV0aG9kIGRvZXMgbm90IGNvbnNpZGVyIHRoZSBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG93YXJkcyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuY2VudGVyLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgXG4gICogW3NoaWZ0ZWQgYnlde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH0gYHN0YXJ0YCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYmUgc2hpZnRlZCBieSBgc3RhcnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGUpIHtcbiAgICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5zaGlmdEFuZ2xlKGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggZnJvbSBgc3RhcnRQb2ludCgpYCB0byB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCBgbGVuZ3RoKCkgKiByYXRpb2AgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGxldCBuZXdBbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCkubXVsdE9uZShyYXRpbyk7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCB0aGVcbiAgKiBnaXZlbiBgYW5nbGVgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2ZcbiAgKiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGluIHRoZVxuICAqIGRpcmVjdGlvbiB0b3dhcmRzIHRoZSBnaXZlbiBgcG9pbnRgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGVcbiAgKiBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMucG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGluIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBhbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZvciB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZSBpbnRlcnNlY3Rpb24gb2ZcbiAgKiBgdGhpc2AgYW5kIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgU2VnbWVudGAgd2lsbCBwb2ludCB0b3dhcmRzIHRoZSBgdGhpc2Agb3JpZW50YXRpb24uXG4gICpcbiAgKiBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuICAqIGNob3JkLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgbWF5IG5vdCBsYXkgaW5zaWRlXG4gICogdGhlIGFjdHVhbCBhcmNzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIGRlc2NyaXB0aW9uXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpIHtcbiAgICAvLyBodHRwczovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9DaXJjbGUtQ2lyY2xlSW50ZXJzZWN0aW9uLmh0bWxcbiAgICAvLyBSPXRoaXMsIHI9b3RoZXJBcmNcblxuICAgIGlmICh0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLmNlbnRlci5kaXN0YW5jZVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcblxuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzICsgb3RoZXJBcmMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBkaXN0YW5jZVRvQ2hvcmQgPSAoZF4yIC0gcl4yICsgUl4yKSAvIChkKjIpXG4gICAgY29uc3QgZGlzdGFuY2VUb0Nob3JkID0gKFxuICAgICAgICBNYXRoLnBvdyhkaXN0YW5jZSwgMilcbiAgICAgIC0gTWF0aC5wb3cob3RoZXJBcmMucmFkaXVzLCAyKVxuICAgICAgKyBNYXRoLnBvdyh0aGlzLnJhZGl1cywgMilcbiAgICAgICkgLyAoZGlzdGFuY2UgKiAyKTtcblxuICAgIC8vIGEgPSAxL2Qgc3FydHwoLWQrci1SKSgtZC1yK1IpKC1kK3IrUikoZCtyK1IpXG4gICAgY29uc3QgY2hvcmRMZW5ndGggPSAoMSAvIGRpc3RhbmNlKSAqIE1hdGguc3FydChcbiAgICAgICAgKC1kaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlIC0gb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAgICogKGRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpKTtcblxuICAgIGNvbnN0IHNlZ21lbnRUb0Nob3JkID0gdGhpcy5jZW50ZXIucmF5VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpXG4gICAgICAuc2VnbWVudChkaXN0YW5jZVRvQ2hvcmQpO1xuICAgIHJldHVybiBzZWdtZW50VG9DaG9yZC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UsIGNob3JkTGVuZ3RoLzIpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aFJhdGlvKDIpO1xuICB9XG5cblxuICAvLyBUT0RPOiBjb25zaWRlciBpZiBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjIGlzIG5lY2Vzc2FyeVxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGludGVyc2VjdGluZyBwb2ludHMgb2YgYHRoaXNgIHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogV2hlbiB0aGVyZSBhcmUgbm8gaW50ZXJzZWN0aW5nIHBvaW50cywgcmV0dXJucyBhbiBlbXB0eSBhcnJheS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgaW50ZXJzZWN0aW9uIHBvaW50cyB3aXRoXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGludGVyc2VjdGluZ1BvaW50c1dpdGhBcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cbiAgLy8gICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCldLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gIC8vICAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0pKVxuICAvLyAgICAgICAmJiBvdGhlckFyYy5jb250YWluc0FuZ2xlKG90aGVyQXJjLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSk7XG4gIC8vICAgfSwgdGhpcyk7XG5cbiAgLy8gICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgU2VnbWVudGAgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSBhbmdsZSBhcyBgcmF5YC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZFdpdGhSYXkocmF5KSB7XG4gICAgLy8gRmlyc3QgY2hlY2sgaW50ZXJzZWN0aW9uXG4gICAgY29uc3QgYmlzZWN0b3IgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkocmF5KTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IGJpc2VjdG9yLmxlbmd0aDtcblxuICAgIC8vIFNlZ21lbnQgdG9vIGNsb3NlIHRvIGNlbnRlciwgY29zaW5lIGNhbGN1bGF0aW9ucyBtYXkgYmUgaW5jb3JyZWN0XG4gICAgLy8gQ2FsY3VsYXRlIHNlZ21lbnQgdGhyb3VnaCBjZW50ZXJcbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKDAsIGRpc3RhbmNlKSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShyYXkuYW5nbGUuaW52ZXJzZSgpKTtcbiAgICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBzdGFydCwgcmF5LmFuZ2xlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMqMik7XG4gICAgfVxuXG4gICAgLy8gUmF5IGlzIHRhbmdlbnQsIHJldHVybiB6ZXJvLWxlbmd0aCBzZWdtZW50IGF0IGNvbnRhY3QgcG9pbnRcbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGRpc3RhbmNlLCB0aGlzLnJhZGl1cykpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IucmF5LmFuZ2xlKTtcbiAgICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBzdGFydCwgcmF5LmFuZ2xlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgMCk7XG4gICAgfVxuXG4gICAgLy8gUmF5IGRvZXMgbm90IHRvdWNoIGFyY1xuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKGRpc3RhbmNlL3RoaXMucmFkaXVzKTtcbiAgICBjb25zdCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG5cbiAgICBjb25zdCBjZW50ZXJPcmllbnRhdGlvbiA9IHJheS5wb2ludE9yaWVudGF0aW9uKHRoaXMuY2VudGVyKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsICFjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsIGNlbnRlck9yaWVudGF0aW9uKSk7XG4gICAgcmV0dXJuIHN0YXJ0LnNlZ21lbnRUb1BvaW50KGVuZCwgcmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHJlcHJlc2VudGluZyB0aGUgZW5kIG9mIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFdoZW4gYHVzZVByb2plY3Rpb25gIGlzIGB0cnVlYCB0aGUgbWV0aG9kIHdpbGwgYWx3YXlzIHJldHVybiBhIGBQb2ludGBcbiAgKiBldmVuIHdoZW4gdGhlcmUgaXMgbm8gY29udGFjdCBiZXR3ZWVuIHRoZSBhcmMgYW5kIGByYXlgLiBJbiB0aGlzIGNhc2VcbiAgKiB0aGUgcG9pbnQgaW4gdGhlIGFyYyBjbG9zZXN0IHRvIGByYXlgIGlzIHJldHVybmVkLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlIGFuZCBgcmF5YCBpcyBjb25zaWRlcmVkIGFuXG4gICogdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZEVuZFdpdGhSYXkocmF5LCB1c2VQcm9qZWN0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSk7XG4gICAgaWYgKGNob3JkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY2hvcmQuZW5kUG9pbnQoKTtcbiAgICB9XG5cbiAgICBpZiAodXNlUHJvamVjdGlvbikge1xuICAgICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoIWNlbnRlck9yaWVudGF0aW9uKTtcbiAgICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShwZXJwZW5kaWN1bGFyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCByZXByZXNlbnRpbmcgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIHRoYXQgaXMgaW5zaWRlXG4gICogYG90aGVyQXJjYCwgb3IgYG51bGxgIHdoZW4gdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLiBUaGUgcmV0dXJuZWQgYXJjXG4gICogd2lsbCBoYXZlIHRoZSBzYW1lIGNlbnRlciwgcmFkaXVzLCBhbmQgb3JpZW50YXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBpbnRlcnNlY3Rpb24sIHRodXMgdGhlIGVuZHBvaW50cyBvZiB0aGUgcmV0dXJuZWQgYXJjIG1heSBub3QgbGF5IGluc2lkZVxuICAqIGB0aGlzYC5cbiAgKlxuICAqIEFuIGVkZ2UgY2FzZSBvZiB0aGlzIG1ldGhvZCBpcyB0aGF0IHdoZW4gdGhlIGRpc3RhbmNlIGJldHdlZW4gYHRoaXNgXG4gICogYW5kIGBvdGhlckFyY2AgaXMgdGhlIHN1bSBvZiB0aGVpciByYWRpdXMsIG1lYW5pbmcgdGhlIGFyY3MgdG91Y2ggYXQgYVxuICAqIHNpbmdsZSBwb2ludCwgdGhlIHJlc3VsdGluZyBhcmMgbWF5IGhhdmUgYSBhbmdsZS1kaXN0YW5jZSBvZiB6ZXJvLFxuICAqIHdoaWNoIGlzIGludGVycHJldGVkIGFzIGEgY29tcGxldGUtY2lyY2xlIGFyYy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBpbnRlcnNlY3Qgd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLkFyY31cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHJldHVybiB0aGlzLndpdGhBbmdsZXNUb3dhcmRzUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogaW1wbGVtZW50IGludGVyc2VjdGlvbkFyY05vQ2lyY2xlP1xuXG5cbiAgLy8gVE9ETzogZmluaXNoIGJvdW5kZWRJbnRlcnNlY3Rpb25BcmNcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCByZXByZXNlbnRpbmcgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIHRoYXQgaXMgaW5zaWRlXG4gICogYG90aGVyQXJjYCBhbmQgYm91bmRlZCBieSBgdGhpcy5zdGFydGAgYW5kIGB0aGlzLmVuZGAsIG9yIGBudWxsYCB3aGVuXG4gICogdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLiBUaGUgcmV0dXJuZWQgYXJjIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsXG4gICogcmFkaXVzLCBhbmQgb3JpZW50YXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogYG90aGVyQXJjYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLCB3aGlsZSB0aGUgc3RhcnQgYW5kIGVuZCBvZlxuICAqIGB0aGlzYCBhcmUgY29uc2lkZXJlZCBmb3IgdGhlIHJlc3VsdGluZyBgQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgZXhpc3QgdHdvIHNlcGFyYXRlIGFyYyBzZWN0aW9ucyB0aGF0IGludGVyc2VjdCB3aXRoXG4gICogYG90aGVyQXJjYDogb25seSB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgY2xvc2VzdCB0byBgc3RhcnRgIGlzIHJldHVybmVkLlxuICAqIFRoaXMgY2FuIGhhcHBlbiB3aGVuIGB0aGlzYCBzdGFydHMgaW5zaWRlIGBvdGhlckFyY2AsIHRoZW4gZXhpdHMsIGFuZFxuICAqIHRoZW4gZW5kcyBpbnNpZGUgYG90aGVyQXJjYCwgcmVnYXJkbGVzcyBpZiBgdGhpc2AgaXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBvciBub3QuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGJvdW5kZWRJbnRlcnNlY3Rpb25BcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAvLyAgIGxldCBjaG9yZFN0YXJ0QW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpKTtcbiAgLy8gICBsZXQgY2hvcmRFbmRBbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChjaG9yZC5lbmRQb2ludCgpKTtcblxuICAvLyAgIC8vIGdldCBhbGwgZGlzdGFuY2VzIGZyb20gdGhpcy5zdGFydFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgb25seSBzdGFydCBtYXkgYmUgaW5zaWRlIGFyY1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgdGhpcy5lbmQsIHdob2xlIGFyYyBpcyBpbnNpZGUgb3Igb3V0c2lkZVxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRTdGFydEFuZ2xlLCBvbmx5IGVuZCBtYXkgYmUgaW5zaWRlIGFyY1xuICAvLyAgIGNvbnN0IGludGVyU3RhcnREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UoY2hvcmRTdGFydEFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vICAgY29uc3QgaW50ZXJFbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UoY2hvcmRFbmRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGVuZERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuXG5cbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgbm9ybWFsIHJ1bGVzXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgbm90IHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCByZXR1cm4gbnVsbFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzZWxmXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkU3RhcnQsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZGVuZCwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkZW5kXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZEVuZEFuZ2xlLCByZXR1cm4gc3RhcnQgdG8gY2hvcmRFbmRcblxuXG4gIC8vICAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoY2hvcmRTdGFydEFuZ2xlKSkge1xuICAvLyAgICAgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5zdGFydDtcbiAgLy8gICB9XG4gIC8vICAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoY2hvcmRFbmRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkRW5kQW5nbGUgPSB0aGlzLmVuZDtcbiAgLy8gICB9XG5cbiAgLy8gICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgLy8gICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSxcbiAgLy8gICAgIGNob3JkRW5kQW5nbGUsXG4gIC8vICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHRoYXQgaXMgdGFuZ2VudCB0byBib3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCxcbiAgKiBvciBgbnVsbGAgd2hlbiBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUuIFRoZSBuZXcgYFNlZ21lbnRgIHN0YXJ0c1xuICAqIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGggYHRoaXNgIGFuZCBlbmRzIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogQ29uc2lkZXJpbmcgX2NlbnRlciBheGlzXyBhIHJheSBmcm9tIGB0aGlzLmNlbnRlcmAgdG93YXJkc1xuICAqIGBvdGhlckFyYy5jZW50ZXJgLCBgc3RhcnRDbG9ja3dpc2VgIGRldGVybWluZXMgdGhlIHNpZGUgb2YgdGhlIHN0YXJ0XG4gICogcG9pbnQgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgaW4gcmVsYXRpb24gdG8gX2NlbnRlciBheGlzXywgYW5kXG4gICogYGVuZENsb2Nrd2lzZWAgdGhlIHNpZGUgb2YgdGhlIGVuZCBwb2ludC5cbiAgKlxuICAqIEJvdGggYHRoaXNgIGFuZCBgb3RoZXJBcmNgIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCBzZWdtZW50IHRvd2FyZHNcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IHN0YXJ0Q2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogc3RhcnQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuZENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIGVuZCBwb2ludCBpbiByZWxhdGlvbiB0byB0aGUgX2NlbnRlciBheGlzX1xuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIHRhbmdlbnRTZWdtZW50KG90aGVyQXJjLCBzdGFydENsb2Nrd2lzZSA9IHRydWUsIGVuZENsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEh5cG90aGVudXNlIG9mIHRoZSB0cmlhbmdsZSB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgdGFuZ2VudFxuICAgIC8vIG1haW4gYW5nbGUgaXMgYXQgYHRoaXMuY2VudGVyYFxuICAgIGNvbnN0IGh5cFNlZ21lbnQgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpO1xuICAgIGNvbnN0IG9wcyA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gb3RoZXJBcmMucmFkaXVzIC0gdGhpcy5yYWRpdXNcbiAgICAgIDogb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXM7XG5cbiAgICAvLyBXaGVuIG9wcyBhbmQgaHlwIGFyZSBjbG9zZSwgc25hcCB0byAxXG4gICAgY29uc3QgYW5nbGVTaW5lID0gdGhpcy5yYWMuZXF1YWxzKE1hdGguYWJzKG9wcyksIGh5cFNlZ21lbnQubGVuZ3RoKVxuICAgICAgPyAob3BzID4gMCA/IDEgOiAtMSlcbiAgICAgIDogb3BzIC8gaHlwU2VnbWVudC5sZW5ndGg7XG4gICAgaWYgKE1hdGguYWJzKGFuZ2xlU2luZSkgPiAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBjb25zdCBvcHNBbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgYW5nbGVSYWRpYW5zKTtcblxuICAgIGNvbnN0IGFkak9yaWVudGF0aW9uID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBzdGFydENsb2Nrd2lzZVxuICAgICAgOiAhc3RhcnRDbG9ja3dpc2U7XG4gICAgY29uc3Qgc2hpZnRlZE9wc0FuZ2xlID0gaHlwU2VnbWVudC5yYXkuYW5nbGUuc2hpZnQob3BzQW5nbGUsIGFkak9yaWVudGF0aW9uKTtcbiAgICBjb25zdCBzaGlmdGVkQWRqQW5nbGUgPSBzaGlmdGVkT3BzQW5nbGUucGVycGVuZGljdWxhcihhZGpPcmllbnRhdGlvbik7XG5cbiAgICBjb25zdCBzdGFydEFuZ2xlID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBzaGlmdGVkQWRqQW5nbGVcbiAgICAgIDogc2hpZnRlZEFkakFuZ2xlLmludmVyc2UoKVxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoc3RhcnRBbmdsZSk7XG4gICAgY29uc3QgZW5kID0gb3RoZXJBcmMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBZGpBbmdsZSk7XG4gICAgY29uc3QgZGVmYXVsdEFuZ2xlID0gc3RhcnRBbmdsZS5wZXJwZW5kaWN1bGFyKCFzdGFydENsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHN0YXJ0LnNlZ21lbnRUb1BvaW50KGVuZCwgZGVmYXVsdEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG5ldyBgQXJjYCBvYmplY3RzIHJlcHJlc2VudGluZyBgdGhpc2BcbiAgKiBkaXZpZGVkIGludG8gYGNvdW50YCBhcmNzLCBhbGwgd2l0aCB0aGUgc2FtZVxuICAqIFthbmdsZSBkaXN0YW5jZV17QGxpbmsgUmFjLkFyYyNhbmdsZURpc3RhbmNlfS5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGFycmF5LiBXaGVuIGBjb3VudGAgaXNcbiAgKiBgMWAgcmV0dXJucyBhbiBhcmMgZXF1aXZhbGVudCB0byBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgLSBOdW1iZXIgb2YgYXJjcyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLkFyY1tdfVxuICAqL1xuICBkaXZpZGVUb0FyY3MoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gW107IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICBjb25zdCBhcmNzID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvdW50OyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgZW5kID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgYXJjID0gbmV3IEFyYyh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLCBzdGFydCwgZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBhcmNzLnB1c2goYXJjKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJjcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG5ldyBgU2VnbWVudGAgb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgY2hvcmRzLCBhbGwgd2l0aCB0aGUgc2FtZSBsZW5ndGguXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG9cbiAgKiBgW3RoaXMuY2hvcmRTZWdtZW50KClde0BsaW5rIFJhYy5BcmMjY2hvcmRTZWdtZW50fWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgLSBOdW1iZXIgb2Ygc2VnbWVudHMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50W119XG4gICovXG4gIGRpdmlkZVRvU2VnbWVudHMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gW107IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgZW5kQW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogKGluZGV4KzEpLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBzdGFydFBvaW50ID0gdGhpcy5wb2ludEF0QW5nbGUoc3RhcnRBbmdsZSk7XG4gICAgICBjb25zdCBlbmRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKGVuZEFuZ2xlKTtcbiAgICAgIGNvbnN0IHNlZ21lbnQgPSBzdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50KTtcbiAgICAgIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb21wb3NpdGVgIHRoYXQgY29udGFpbnMgYEJlemllcmAgb2JqZWN0cyByZXByZXNlbnRpbmdcbiAgKiB0aGUgYXJjIGRpdmlkZWQgaW50byBgY291bnRgIGJlemllcnMgdGhhdCBhcHByb3hpbWF0ZSB0aGUgc2hhcGUgb2YgdGhlXG4gICogYXJjLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYENvbXBvc2l0ZWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgLSBOdW1iZXIgb2YgYmV6aWVycyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLkNvbXBvc2l0ZX1cbiAgKlxuICAqIEBzZWUgW2BSYWMuQmV6aWVyYF17QGxpbmsgUmFjLkJlemllcn1cbiAgKi9cbiAgZGl2aWRlVG9CZXppZXJzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBbXSk7IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICAvLyBsZW5ndGggb2YgdGFuZ2VudDpcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gICAgY29uc3QgcGFyc1BlclR1cm4gPSAxIC8gcGFydFR1cm47XG4gICAgY29uc3QgdGFuZ2VudCA9IHRoaXMucmFkaXVzICogKDQvMykgKiBNYXRoLnRhbihSYWMuVEFVLyhwYXJzUGVyVHVybio0KSk7XG5cbiAgICBjb25zdCBiZXppZXJzID0gW107XG4gICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLmRpdmlkZVRvU2VnbWVudHMoY291bnQpO1xuICAgIHNlZ21lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBzdGFydEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uc3RhcnRQb2ludCgpKTtcbiAgICAgIGNvbnN0IGVuZEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uZW5kUG9pbnQoKSk7XG5cbiAgICAgIGxldCBzdGFydEFuY2hvciA9IHN0YXJ0QXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsICF0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgICAgLmVuZFBvaW50KCk7XG4gICAgICBsZXQgZW5kQW5jaG9yID0gZW5kQXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIHRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcblxuICAgICAgY29uc3QgbmV3QmV6aWVyID0gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHN0YXJ0QXJjUmFkaXVzLmVuZFBvaW50KCksIHN0YXJ0QW5jaG9yLFxuICAgICAgICBlbmRBbmNob3IsIGVuZEFyY1JhZGl1cy5lbmRQb2ludCgpKVxuXG4gICAgICBiZXppZXJzLnB1c2gobmV3QmV6aWVyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYywgYmV6aWVycyk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBsb2NhdGVkIGFuZCBvcmllbnRlZCB0b3dhcmRzIGBzdGFydFRhbmdlbnRSYXkoKWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmQgYGZvcm1hdGAuXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIG9tbWl0ZWQgb3IgYG51bGxgLCB0aGUgZm9ybWF0IHVzZWQgZm9yIHRoZSByZXR1cm5lZFxuICAqIHRleHQgd2lsbCBiZTpcbiAgKiArIFtgcmFjLlRleHQuRm9ybWF0LmJvdHRvbUxlZnRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCNib3R0b21MZWZ0fVxuICAqIGZvcm1hdCBmb3IgYXJjcyB3aXRoIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uIHNldCB0byBgdHJ1ZWBcbiAgKiArIFtgcmFjLlRleHQuRm9ybWF0LnRvcExlZnRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fVxuICAqIGZvcm1hdCBmb3IgYXJjcyB3aXRoIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uIHNldCB0byBgZmFsc2VgXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIHByb3ZpZGVkLCB0aGUgYW5nbGUgZm9yIHRoZSByZXR1cm5lZCB0ZXh0IHdpbGwgc3RpbGxcbiAgKiBiZSBzZXQgdG8gYHN0YXJ0VGFuZ2VudFJheSgpLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGA7IHdoZW4gb21taXRlZCBvciBgbnVsbGAsIGEgZGVmYXVsdFxuICAqICAgZm9ybWF0IGlzIHVzZWQgaW5zdGVhZFxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgdGV4dChzdHJpbmcsIGZvcm1hdCA9IG51bGwpIHtcbiAgICBpZiAoZm9ybWF0ID09PSBudWxsKSB7XG4gICAgICBmb3JtYXQgPSB0aGlzLmNsb2Nrd2lzZVxuICAgICAgICA/IHRoaXMucmFjLlRleHQuRm9ybWF0LmJvdHRvbUxlZnRcbiAgICAgICAgOiB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGFydFRhbmdlbnRSYXkoKS50ZXh0KHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIEFyY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXJjO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQmV6aWVyIGN1cnZlIHdpdGggc3RhcnQsIGVuZCwgYW5kIHR3byBhbmNob3IgW3BvaW50c117QGxpbmsgUmFjLlBvaW50fS5cbiogQGFsaWFzIFJhYy5CZXppZXJcbiovXG5jbGFzcyBCZXppZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcblxuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLnN0YXJ0QW5jaG9yID0gc3RhcnRBbmNob3I7XG4gICAgdGhpcy5lbmRBbmNob3IgPSBlbmRBbmNob3I7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnRYU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueCwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFlTdHIgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC55LCAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLngsIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRBbmNob3JZU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnRBbmNob3IueSwgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JYU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZEFuY2hvcllTdHIgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZEFuY2hvci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWFN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLngsICAgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRZU3RyICAgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQueSwgICAgICAgICBkaWdpdHMpO1xuXG4gICAgcmV0dXJuIGBCZXppZXIoczooJHtzdGFydFhTdHJ9LCR7c3RhcnRZU3RyfSkgc2E6KCR7c3RhcnRBbmNob3JYU3RyfSwke3N0YXJ0QW5jaG9yWVN0cn0pIGVhOigke2VuZEFuY2hvclhTdHJ9LCR7ZW5kQW5jaG9yWVN0cn0pIGU6KCR7ZW5kWFN0cn0sJHtlbmRZU3RyfSkpYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBhbGwgbWVtYmVycywgZXhjZXB0IGByYWNgLCBvZiBib3RoIGJlemllcnMgYXJlXG4gICogW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9OyBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJCZXppZXJgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQmV6aWVyYCwgcmV0dXJuc1xuICAqIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5CZXppZXJ9IG90aGVyQmV6aWVyIC0gQSBgQmV6aWVyYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyQmV6aWVyKSB7XG4gICAgcmV0dXJuIG90aGVyQmV6aWVyIGluc3RhbmNlb2YgQmV6aWVyXG4gICAgICAmJiB0aGlzLnN0YXJ0ICAgICAgLmVxdWFscyhvdGhlckJlemllci5zdGFydClcbiAgICAgICYmIHRoaXMuc3RhcnRBbmNob3IuZXF1YWxzKG90aGVyQmV6aWVyLnN0YXJ0QW5jaG9yKVxuICAgICAgJiYgdGhpcy5lbmRBbmNob3IgIC5lcXVhbHMob3RoZXJCZXppZXIuZW5kQW5jaG9yKVxuICAgICAgJiYgdGhpcy5lbmQgICAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuZW5kKTtcbiAgfVxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBCZXppZXI7XG5cblxuQmV6aWVyLnByb3RvdHlwZS5kcmF3QW5jaG9ycyA9IGZ1bmN0aW9uKHN0eWxlID0gdW5kZWZpbmVkKSB7XG4gIHB1c2goKTtcbiAgaWYgKHN0eWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdHlsZS5hcHBseSgpO1xuICB9XG4gIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQodGhpcy5zdGFydEFuY2hvcikuZHJhdygpO1xuICB0aGlzLmVuZC5zZWdtZW50VG9Qb2ludCh0aGlzLmVuZEFuY2hvcikuZHJhdygpO1xuICBwb3AoKTtcbn07XG5cbkJlemllci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEJlemllcih0aGlzLnJhYyxcbiAgICB0aGlzLmVuZCwgdGhpcy5lbmRBbmNob3IsXG4gICAgdGhpcy5zdGFydEFuY2hvciwgdGhpcy5zdGFydCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udGFpbmVyIG9mIGEgc2VxdWVuY2Ugb2YgZHJhd2FibGUgb2JqZWN0cyB0aGF0IGNhbiBiZSBkcmF3biB0b2dldGhlci5cbipcbiogVXNlZCBieSBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YCB0byBwZXJmb3JtIHNwZWNpZmljIHZlcnRleFxuKiBvcGVyYXRpb25zIHdpdGggZHJhd2FibGVzIHRvIGRyYXcgY29tcGxleCBzaGFwZXMuXG4qXG4qIEBjbGFzc1xuKiBAYWxpYXMgUmFjLkNvbXBvc2l0ZVxuKi9cbmZ1bmN0aW9uIENvbXBvc2l0ZShyYWMsIHNlcXVlbmNlID0gW10pIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc2VxdWVuY2UpO1xuXG4gIHRoaXMucmFjID0gcmFjO1xuICB0aGlzLnNlcXVlbmNlID0gc2VxdWVuY2U7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRlO1xuXG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuaXNOb3RFbXB0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zZXF1ZW5jZS5sZW5ndGggIT0gMDtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgZWxlbWVudC5mb3JFYWNoKGl0ZW0gPT4gdGhpcy5zZXF1ZW5jZS5wdXNoKGl0ZW0pKTtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLnNlcXVlbmNlLnB1c2goZWxlbWVudCk7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHJldmVyc2VkID0gdGhpcy5zZXF1ZW5jZS5tYXAoaXRlbSA9PiBpdGVtLnJldmVyc2UoKSlcbiAgICAucmV2ZXJzZSgpO1xuICByZXR1cm4gbmV3IENvbXBvc2l0ZSh0aGlzLnJhYywgcmV2ZXJzZWQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFBvaW50IGluIGEgdHdvIGRpbWVudGlvbmFsIGNvb3JkaW5hdGUgc3lzdGVtLlxuKlxuKiBTZXZlcmFsIG1ldGhvZHMgd2lsbCByZXR1cm4gYW4gYWRqdXN0ZWQgdmFsdWUgb3IgcGVyZm9ybSBhZGp1c3RtZW50cyBpblxuKiB0aGVpciBvcGVyYXRpb24gd2hlbiB0d28gcG9pbnRzIGFyZSBjbG9zZSBlbm91Z2ggYXMgdG8gYmUgY29uc2lkZXJlZFxuKiBlcXVhbC4gV2hlbiB0aGUgdGhlIGRpZmZlcmVuY2Ugb2YgZWFjaCBjb29yZGluYXRlIG9mIHR3byBwb2ludHNcbiogaXMgdW5kZXIgdGhlIFtgZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9IHRoZVxuKiBwb2ludHMgYXJlIGNvbnNpZGVyZWQgZXF1YWwuIFRoZSBbYGVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4qIG1ldGhvZCBwZXJmb3JtcyB0aGlzIGNoZWNrLlxuKlxuKiAjIyMgYGluc3RhbmNlLlBvaW50YFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlBvaW50YCBmdW5jdGlvbl17QGxpbmsgUmFjI1BvaW50fSB0byBjcmVhdGUgYFBvaW50YCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5Qb2ludC5vcmlnaW5gXXtAbGluayBpbnN0YW5jZS5Qb2ludCNvcmlnaW59LCBsaXN0ZWQgdW5kZXJcbiogW2BpbnN0YW5jZS5Qb2ludGBde0BsaW5rIGluc3RhbmNlLlBvaW50fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHJhYywgNTUsIDc3KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJQb2ludCA9IHJhYy5Qb2ludCg1NSwgNzcpXG4qXG4qIEBzZWUgW2ByYWMuUG9pbnRgXXtAbGluayBSYWMjUG9pbnR9XG4qIEBzZWUgW2BpbnN0YW5jZS5Qb2ludGBde0BsaW5rIGluc3RhbmNlLlBvaW50fVxuKlxuKiBAYWxpYXMgUmFjLlBvaW50XG4qL1xuY2xhc3MgUG9pbnR7XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBQb2ludGAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhY1xuICAqICAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgKiAgIFRoZSB4IGNvb3JkaW5hdGVcbiAgKiBAcGFyYW0ge051bWJlcn0geVxuICAqICAgVGhlIHkgY29vcmRpbmF0ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHgsIHkpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB4LCB5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoeCwgeSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnggPSB4O1xuXG4gICAgLyoqXG4gICAgKiBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuUG9pbnQoNTUsIDc3KS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ1BvaW50KDU1LDc3KSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgUG9pbnQoJHt4U3RyfSwke3lTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJQb2ludGAgZm9yIGVhY2hcbiAgKiBjb29yZGluYXRlIGlzIHVuZGVyIFtgcmFjLmVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfTtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJQb2ludGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5Qb2ludGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFZhbHVlcyBhcmUgY29tcGFyZWQgdXNpbmcgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc30uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gb3RoZXJQb2ludCAtIEEgYFBvaW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJQb2ludCkge1xuICAgIHJldHVybiBvdGhlclBvaW50IGluc3RhbmNlb2YgUG9pbnRcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLngsIG90aGVyUG9pbnQueClcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnksIG90aGVyUG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIG5ld1gsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdZIC0gVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCwgbmV3WSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBhZGRlZCB0byBgdGhpcy54YC5cbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWCh4KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHgsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB5YCBhZGRlZCB0byBgdGhpcy55YC5cbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWSh5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBhZGRpbmcgdGhlIGNvbXBvbmVudHMgb2YgYHBvaW50YCB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgcG9pbnQueCxcbiAgICAgIHRoaXMueSArIHBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzIHRvIGB0aGlzYC5cbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGQoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3RQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHBvaW50LngsXG4gICAgICB0aGlzLnkgLSBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzLlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdWJ0cmFjdCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54IC0geCxcbiAgICAgIHRoaXMueSAtIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCB0aGUgbmVnYXRpdmUgY29vcmRpbmF0ZSB2YWx1ZXMgb2YgYHRoaXNgLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIG5lZ2F0aXZlKCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIC10aGlzLngsIC10aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiByZXR1cm5zIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKiBAc2VlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgZGlzdGFuY2VUb1BvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHggPSBNYXRoLnBvdygocG9pbnQueCAtIHRoaXMueCksIDIpO1xuICAgIGNvbnN0IHkgPSBNYXRoLnBvdygocG9pbnQueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gcmV0dXJuIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBbYGVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGlmICh0aGlzLmVxdWFscyhwb2ludCkpIHtcbiAgICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oZGVmYXVsdEFuZ2xlKTtcbiAgICAgIHJldHVybiBkZWZhdWx0QW5nbGU7XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHBvaW50LnN1YnRyYWN0UG9pbnQodGhpcyk7XG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYXRhbjIob2Zmc2V0LnksIG9mZnNldC54KTtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IGEgYGRpc3RhbmNlYCBmcm9tIGB0aGlzYCBpbiB0aGUgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FycyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgZGlzdGFuY2VYID0gZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZS5yYWRpYW5zKCkpO1xuICAgIGNvbnN0IGRpc3RhbmNlWSA9IGRpc3RhbmNlICogTWF0aC5zaW4oYW5nbGUucmFkaWFucygpKTtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLnggKyBkaXN0YW5jZVgsIHRoaXMueSArIGRpc3RhbmNlWSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBtaWRkbGUgYmV0d2VlbiBgdGhpc2AgYW5kIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGNhbGN1bGF0ZSBhIGJpc2VjdG9yIHRvXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEJpc2VjdG9yKHBvaW50KSB7XG4gICAgY29uc3QgeE9mZnNldCA9IChwb2ludC54IC0gdGhpcy54KSAvIDI7XG4gICAgY29uc3QgeU9mZnNldCA9IChwb2ludC55IC0gdGhpcy55KSAvIDI7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgeE9mZnNldCwgdGhpcy55ICsgeU9mZnNldCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYEFuZ2xlYCBvZiB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheShhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgUmF5YCB0b3dhcmRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfVxuICAqICAgW2RlZmF1bHRBbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgQW4gYEFuZ2xlYCB0byB1c2Ugd2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGVxdWFsXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLmFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluIGByYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGFuZCBgdGhpc2AgYXJlXG4gICogW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRoZSBwcm9kdWNlZCByYXkgd2lsbCBoYXZlXG4gICogYW4gYW5nbGUgcGVycGVuZGljdWxhciB0byBgcmF5YCBpbiB0aGUgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBwcm9qZWN0IGB0aGlzYCBvbnRvXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMucmF5VG9Qb2ludChwcm9qZWN0ZWQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLCB3aGVuXG4gICogbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSBuZXcgYFJheWAgd2lsbCBiZSBpbiB0aGUgYGNsb2Nrd2lzZWAgc2lkZSBvZiB0aGUgcmF5IGZvcm1lZFxuICAqIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFyYy5jZW50ZXJgLiBgYXJjYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGVcbiAgKiBjaXJjbGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBpcyBpbnNpZGUgYGFyY2Agbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlIGFuZCBgbnVsbGBcbiAgKiBpcyByZXR1cm5lZC5cbiAgKlxuICAqIEEgc3BlY2lhbCBjYXNlIGlzIGNvbnNpZGVyZWQgd2hlbiBgYXJjLnJhZGl1c2AgaXMgY29uc2lkZXJlZCB0byBiZSBgMGBcbiAgKiBhbmQgYHRoaXNgIGlzIGVxdWFsIHRvIGBhcmMuY2VudGVyYC4gSW4gdGhpcyBjYXNlIHRoZSBhbmdsZSBiZXR3ZWVuXG4gICogYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAgaXMgYXNzdW1lZCB0byBiZSB0aGUgaW52ZXJzZSBvZiBgYXJjLnN0YXJ0YCxcbiAgKiB0aHVzIHRoZSBuZXcgYFJheWAgd2lsbCBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJuIHs/UmFjLlJheX1cbiAgKi9cbiAgcmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIC8vIEEgZGVmYXVsdCBhbmdsZSBpcyBnaXZlbiBmb3IgdGhlIGVkZ2UgY2FzZSBvZiBhIHplcm8tcmFkaXVzIGFyY1xuICAgIGxldCBoeXBvdGVudXNlID0gdGhpcy5zZWdtZW50VG9Qb2ludChhcmMuY2VudGVyLCBhcmMuc3RhcnQuaW52ZXJzZSgpKTtcbiAgICBsZXQgb3BzID0gYXJjLnJhZGl1cztcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIGFyYy5yYWRpdXMpKSB7XG4gICAgICAvLyBQb2ludCBpbiBhcmNcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSBoeXBvdGVudXNlLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIHBlcnBlbmRpY3VsYXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIDApKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVTaW5lID0gb3BzIC8gaHlwb3RlbnVzZS5sZW5ndGg7XG4gICAgaWYgKGFuZ2xlU2luZSA+IDEpIHtcbiAgICAgIC8vIFBvaW50IGluc2lkZSBhcmNcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBsZXQgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG4gICAgbGV0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cG90ZW51c2UuYW5nbGUoKS5zaGlmdChvcHNBbmdsZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgc2hpZnRlZE9wc0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgIHdpdGggdGhlIGdpdmVuXG4gICogYGxlbmd0aGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBwb2ludCB0aGUgc2VnbWVudFxuICAqIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLmFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlKTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0byB0aGUgcHJvamVjdGlvbiBvZiBgdGhpc2AgaW5cbiAgKiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBpcyBlcXVhbCB0byBgdGhpc2AsIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGxcbiAgKiBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudFRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGlzIHRhbmdlbnQgdG8gYGFyY2AsXG4gICogd2hlbiBubyB0YW5nZW50IGlzIHBvc3NpYmxlIHJldHVybnMgYG51bGxgLlxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBiZSBpbiB0aGUgYGNsb2Nrd2lzZWAgc2lkZSBvZiB0aGUgcmF5IGZvcm1lZFxuICAqIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFyYy5jZW50ZXJgLCBhbmQgaXRzIGVuZCBwb2ludCB3aWxsIGJlIGF0IHRoZVxuICAqIGNvbnRhY3QgcG9pbnQgd2l0aCBgYXJjYCB3aGljaCBpcyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZSBhbmQgYG51bGxgXG4gICogaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBBIHNwZWNpYWwgY2FzZSBpcyBjb25zaWRlcmVkIHdoZW4gYGFyYy5yYWRpdXNgIGlzIGNvbnNpZGVyZWQgdG8gYmUgYDBgXG4gICogYW5kIGB0aGlzYCBpcyBlcXVhbCB0byBgYXJjLmNlbnRlcmAuIEluIHRoaXMgY2FzZSB0aGUgYW5nbGUgYmV0d2VlblxuICAqIGB0aGlzYCBhbmQgYGFyYy5jZW50ZXJgIGlzIGFzc3VtZWQgdG8gYmUgdGhlIGludmVyc2Ugb2YgYGFyYy5zdGFydGAsXG4gICogdGh1cyB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJuIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgdGFuZ2VudFJheSA9IHRoaXMucmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlKTtcbiAgICBpZiAodGFuZ2VudFJheSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdGFuZ2VudFBlcnAgPSB0YW5nZW50UmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCByYWRpdXNSYXkgPSBhcmMuY2VudGVyLnJheSh0YW5nZW50UGVycCk7XG5cbiAgICByZXR1cm4gdGFuZ2VudFJheS5zZWdtZW50VG9JbnRlcnNlY3Rpb24ocmFkaXVzUmF5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBhdCBgdGhpc2AgYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9XG4gICogICBbc3RhcnQ9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBzdGFydCBgQW5nbGVgIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmQ9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqICAgYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGBzdGFydGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKFxuICAgIHJhZGl1cyxcbiAgICBzdGFydCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sXG4gICAgZW5kID0gbnVsbCxcbiAgICBjbG9ja3dpc2UgPSB0cnVlKVxuICB7XG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYywgdGhpcywgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBsb2NhdGVkIGF0IGB0aGlzYCB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmRcbiAgKiBgZm9ybWF0YC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuVGV4dCh0aGlzLnJhYywgdGhpcywgc3RyaW5nLCBmb3JtYXQpO1xuICB9XG5cbn0gLy8gY2xhc3MgUG9pbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogVW5ib3VuZGVkIHJheSBmcm9tIGEgYFtQb2ludF17QGxpbmsgUmFjLlBvaW50fWAgaW4gZGlyZWN0aW9uIG9mIGFuXG4qIGBbQW5nbGVde0BsaW5rIFJhYy5BbmdsZX1gLlxuKlxuKiAjIyMgYGluc3RhbmNlLlJheWBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5SYXlgIGZ1bmN0aW9uXXtAbGluayBSYWMjUmF5fSB0byBjcmVhdGUgYFJheWAgb2JqZWN0cyBmcm9tXG4qIHByaW1pdGl2ZSB2YWx1ZXMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuUmF5LnhBeGlzYF17QGxpbmsgaW5zdGFuY2UuUmF5I3hBeGlzfSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuUmF5YF17QGxpbmsgaW5zdGFuY2UuUmF5fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgcG9pbnQgPSByYWMuUG9pbnQoNTUsIDc3KVxuKiBsZXQgYW5nbGUgPSByYWMuQW5nbGUoMS80KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgcmF5ID0gbmV3IFJhYy5SYXkocmFjLCBwb2ludCwgYW5nbGUpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzQpXG4qXG4qIEBzZWUgW2ByYWMuUmF5YF17QGxpbmsgUmFjI1JheX1cbiogQHNlZSBbYGluc3RhbmNlLlJheWBde0BsaW5rIGluc3RhbmNlLlJheX1cbipcbiogQGFsaWFzIFJhYy5SYXlcbiovXG5jbGFzcyBSYXkge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheWAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnQgLSBBIGBQb2ludGAgd2hlcmUgdGhlIHJheSBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRoZSByYXkgaXMgZGlyZWN0ZWQgdG9cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIHJheS5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSByYXkgZXh0ZW5kcy5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBSYXkoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHN0YXJ0YCBhbmQgYGFuZ2xlYCBpbiBib3RoIHJheXMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclJheWAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5SYXlgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclJheSkge1xuICAgIHJldHVybiBvdGhlclJheSBpbnN0YW5jZW9mIFJheVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJSYXkuc3RhcnQpXG4gICAgICAmJiB0aGlzLmFuZ2xlLmVxdWFscyhvdGhlclJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNsb3BlIG9mIHRoZSByYXksIG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzIHZlcnRpY2FsLlxuICAqXG4gICogSW4gdGhlIGxpbmUgZm9ybXVsYSBgeSA9IG14ICsgYmAgdGhlIHNsb3BlIGlzIGBtYC5cbiAgKlxuICAqIEByZXR1cm5zIHs/TnVtYmVyfVxuICAqL1xuICBzbG9wZSgpIHtcbiAgICBsZXQgaXNWZXJ0aWNhbCA9XG4gICAgICAgICB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUuZG93bi50dXJuKVxuICAgICAgfHwgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLnVwLnR1cm4pO1xuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB5LWludGVyY2VwdDogdGhlIHBvaW50IGF0IHdoaWNoIHRoZSByYXksIGV4dGVuZGVkIGluIGJvdGhcbiAgKiBkaXJlY3Rpb25zLCBpbnRlcmNlcHRzIHdpdGggdGhlIHktYXhpczsgb3IgYG51bGxgIGlmIHRoZSByYXkgaXNcbiAgKiB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSB5LWludGVyY2VwdCBpcyBgYmAuXG4gICpcbiAgKiBAcmV0dXJucyB7P051bWJlcn1cbiAgKi9cbiAgeUludGVyY2VwdCgpIHtcbiAgICBsZXQgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8geSA9IG14ICsgYlxuICAgIC8vIHkgLSBteCA9IGJcbiAgICByZXR1cm4gdGhpcy5zdGFydC55IC0gc2xvcGUgKiB0aGlzLnN0YXJ0Lng7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydCAtIFRoZSBzdGFydCBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnhgIHNldCB0byBgbmV3WGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1ggLSBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWChuZXdYKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnQueWAgc2V0IHRvIGBuZXdZYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LndpdGhZKG5ld1kpLCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20obmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoYW5nbGUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLmFkZChhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkc1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2UgYW5nbGUuaW52ZXJzZSgpfWAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgaW52ZXJzZUFuZ2xlID0gdGhpcy5hbmdsZS5pbnZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIGludmVyc2VBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYGFuZ2xlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBhbG9uZyB0aGUgcmF5IGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW5cbiAgKiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGJ5IHRoZSBnaXZlbiBkaXN0YW5jZSB0b3dhcmQgdGhlXG4gICogYGFuZ2xlLnBlcnBlbmRpY3VsYXIoKWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVRvQW5nbGUocGVycGVuZGljdWxhciwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCByZXR1cm5zIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHggY29vcmRpbmF0ZSBpcyBgeGAuXG4gICogV2hlbiB0aGUgcmF5IGlzIHZlcnRpY2FsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB4XG4gICogY29vcmRpbmF0ZSBhdCBgeGAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYSB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFgoeCkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWCh4KTtcbiAgICB9XG5cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgY29uc3QgeSA9IHNsb3BlICogeCArIHRoaXMueUludGVyY2VwdCgpO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeSBjb29yZGluYXRlIGlzIGB5YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgaG9yaXpvbnRhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeVxuICAqIGNvb3JkaW5hdGUgYXQgYHlgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WSh5KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhZKHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIG14ICsgYiA9IHlcbiAgICAvLyB4ID0gKHkgLSBiKS9tXG4gICAgY29uc3QgeCA9ICh5IC0gdGhpcy55SW50ZXJjZXB0KCkpIC8gc2xvcGU7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHJheSBhdCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCBmcm9tXG4gICogYHRoaXMuc3RhcnRgLiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkXG4gICogaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBCb3RoIHJheXMgYXJlIGNvbnNpZGVyZWQgdW5ib3VuZGVkIGxpbmVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBhID0gdGhpcy5zbG9wZSgpO1xuICAgIGNvbnN0IGIgPSBvdGhlclJheS5zbG9wZSgpO1xuICAgIC8vIFBhcmFsbGVsIGxpbmVzLCBubyBpbnRlcnNlY3Rpb25cbiAgICBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoYSwgYikpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIC8vIEFueSB2ZXJ0aWNhbCByYXlcbiAgICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gb3RoZXJSYXkucG9pbnRBdFgodGhpcy5zdGFydC54KTsgfVxuICAgIGlmIChiID09PSBudWxsKSB7IHJldHVybiB0aGlzLnBvaW50QXRYKG90aGVyUmF5LnN0YXJ0LngpOyB9XG5cbiAgICBjb25zdCBjID0gdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgY29uc3QgZCA9IG90aGVyUmF5LnlJbnRlcmNlcHQoKTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpbmUlRTIlODAlOTNsaW5lX2ludGVyc2VjdGlvblxuICAgIGNvbnN0IHggPSAoZCAtIGMpIC8gKGEgLSBiKTtcbiAgICBjb25zdCB5ID0gYSAqIHggKyBjO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgb250byB0aGUgcmF5LiBUaGVcbiAgKiBwcm9qZWN0ZWQgcG9pbnQgaXMgdGhlIGNsb3Nlc3QgcG9zc2libGUgcG9pbnQgdG8gYHBvaW50YC5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IG9udG8gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50UHJvamVjdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gcG9pbnQucmF5KHBlcnBlbmRpY3VsYXIpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbih0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG8gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YFxuICAqIG9udG8gdGhlIHJheS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBkaXN0YW5jZSBpcyBwb3NpdGl2ZSB3aGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgdG93YXJkc1xuICAqIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJheSwgYW5kIG5lZ2F0aXZlIHdoZW4gaXQgaXMgYmVoaW5kLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3QgYW5kIG1lYXN1cmUgdGhlXG4gICogZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSB0aGlzLnBvaW50UHJvamVjdGlvbihwb2ludCk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlVG9Qb2ludChwcm9qZWN0ZWQpO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgMCkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlVG9Qcm9qZWN0ZWQgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwcm9qZWN0ZWQpO1xuICAgIGNvbnN0IGFuZ2xlRGlmZiA9IHRoaXMuYW5nbGUuc3VidHJhY3QoYW5nbGVUb1Byb2plY3RlZCk7XG4gICAgaWYgKGFuZ2xlRGlmZi50dXJuIDw9IDEvNCB8fCBhbmdsZURpZmYudHVybiA+IDMvNCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLWRpc3RhbmNlO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgYW5nbGUgdG8gdGhlIGdpdmVuIGBwb2ludGAgaXMgbG9jYXRlZCBjbG9ja3dpc2VcbiAgKiBvZiB0aGUgcmF5IG9yIGBmYWxzZWAgd2hlbiBsb2NhdGVkIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gb3IgYHBvaW50YCBsYW5kcyBvbiB0aGUgcmF5LCBpdCBpc1xuICAqIGNvbnNpZGVyZWQgY2xvY2t3aXNlLiBXaGVuIGBwb2ludGAgbGFuZHMgb24gdGhlXG4gICogW2ludmVyc2Vde0BsaW5rIFJhYy5SYXkjaW52ZXJzZX0gb2YgdGhlIHJheSwgaXQgaXMgY29uc2lkZXJlZFxuICAqIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIG9yaWVudGF0aW9uIHRvXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5SYXkjaW52ZXJzZVxuICAqL1xuICBwb2ludE9yaWVudGF0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcG9pbnRBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICBpZiAodGhpcy5hbmdsZS5lcXVhbHMocG9pbnRBbmdsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBwb2ludEFuZ2xlLnN1YnRyYWN0KHRoaXMuYW5nbGUpO1xuICAgIC8vIFswIHRvIDAuNSkgaXMgY29uc2lkZXJlZCBjbG9ja3dpc2VcbiAgICAvLyBbMC41LCAxKSBpcyBjb25zaWRlcmVkIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcmV0dXJuIGFuZ2xlRGlzdGFuY2UudHVybiA8IDAuNTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICByYXlUb1BvaW50KHBvaW50KSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHVzaW5nIGB0aGlzYCBhbmQgdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50KGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMsIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zZWdtZW50VG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0YCBhbmQgZW5kaW5nIGF0IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgdGhlIGludGVyc2VjdGlvbiBwb2ludCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0ludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSk7XG4gICAgaWYgKGludGVyc2VjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KGludGVyc2VjdGlvbik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWBcbiAgKiBhbmQgdGhlIGdpdmVuIGFyYyBwcm9wZXJ0aWVzLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmRBbmdsZT1udWxsXSAtIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgbmV3XG4gICogYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGB0aGlzLmFuZ2xlYCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMocmFkaXVzLCBlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMuYW5nbGVcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgLFxuICAqIGFuZCBlbmQgYXQgdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLnN0YXJ0YCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1RvQW5nbGVEaXN0YW5jZShyYWRpdXMsIGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgZW5kQW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvLyBUT0RPOiBMZWF2aW5nIHVuZG9jdW1lbnRlZCBmb3Igbm93LCB1bnRpbCBiZXR0ZXIgdXNlL2V4cGxhbmF0aW9uIGlzIGZvdW5kXG4gIC8vIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3MzQ3NDUvaG93LXRvLWNyZWF0ZS1jaXJjbGUtd2l0aC1iJUMzJUE5emllci1jdXJ2ZXNcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgYmV6aWVyQXJjKG90aGVyUmF5KSB7XG4gICAgaWYgKHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyUmF5LnN0YXJ0KSkge1xuICAgICAgLy8gV2hlbiBib3RoIHJheXMgaGF2ZSB0aGUgc2FtZSBzdGFydCwgcmV0dXJucyBhIHBvaW50IGJlemllci5cbiAgICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCxcbiAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgbGV0IGludGVyc2VjdGlvbiA9IHRoaXMucGVycGVuZGljdWxhcigpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheS5wZXJwZW5kaWN1bGFyKCkpO1xuXG4gICAgbGV0IG9yaWVudGF0aW9uID0gbnVsbDtcbiAgICBsZXQgcmFkaXVzQSA9IG51bGw7XG4gICAgbGV0IHJhZGl1c0IgPSBudWxsO1xuXG4gICAgLy8gQ2hlY2sgZm9yIHBhcmFsbGVsIHJheXNcbiAgICBpZiAoaW50ZXJzZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAvLyBOb3JtYWwgaW50ZXJzZWN0aW9uIGNhc2VcbiAgICAgIG9yaWVudGF0aW9uID0gdGhpcy5wb2ludE9yaWVudGF0aW9uKGludGVyc2VjdGlvbik7XG4gICAgICByYWRpdXNBID0gaW50ZXJzZWN0aW9uLnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnQpO1xuICAgICAgcmFkaXVzQiA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludChvdGhlclJheS5zdGFydCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gY2FzZSBvZiBwYXJhbGxlbCByYXlzLCBvdGhlclJheSBnZXRzIHNoaWZ0ZWQgdG8gYmVcbiAgICAgIC8vIHBlcnBlbmRpY3VsYXIgdG8gdGhpcy5cbiAgICAgIGxldCBzaGlmdGVkSW50ZXJzZWN0aW9uID0gdGhpcy5wZXJwZW5kaWN1bGFyKClcbiAgICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgICAgaWYgKHNoaWZ0ZWRJbnRlcnNlY3Rpb24gPT09IG51bGwgfHwgdGhpcy5zdGFydC5lcXVhbHMoc2hpZnRlZEludGVyc2VjdGlvbikpIHtcbiAgICAgICAgLy8gV2hlbiBib3RoIHJheXMgbGF5IG9uIHRvcCBvZiBlYWNoIG90aGVyLCB0aGUgc2hpZnRpbmcgcHJvZHVjZXNcbiAgICAgICAgLy8gcmF5cyB3aXRoIHRoZSBzYW1lIHN0YXJ0OyBmdW5jdGlvbiByZXR1cm5zIGEgbGluZWFyIGJlemllci5cbiAgICAgICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQsXG4gICAgICAgICAgb3RoZXJSYXkuc3RhcnQsIG90aGVyUmF5LnN0YXJ0KTtcbiAgICAgIH1cbiAgICAgIGludGVyc2VjdGlvbiA9IHRoaXMuc3RhcnQucG9pbnRBdEJpc2VjdG9yKHNoaWZ0ZWRJbnRlcnNlY3Rpb24pO1xuXG4gICAgICAvLyBDYXNlIGZvciBzaGlmdGVkIGludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byByYXlzXG4gICAgICBvcmllbnRhdGlvbiA9IHRoaXMucG9pbnRPcmllbnRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgcmFkaXVzQSA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJhZGl1c0IgPSByYWRpdXNBLmludmVyc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcmFkaXVzQS5hbmdsZSgpLmRpc3RhbmNlKHJhZGl1c0IuYW5nbGUoKSwgb3JpZW50YXRpb24pO1xuICAgIGNvbnN0IHF1YXJ0ZXJBbmdsZSA9IGFuZ2xlRGlzdGFuY2UubXVsdCgxLzQpO1xuICAgIC8vIFRPRE86IHdoYXQgaGFwcGVucyB3aXRoIHNxdWFyZSBhbmdsZXM/IGlzIHRoaXMgY292ZXJlZCBieSBpbnRlcnNlY3Rpb24gbG9naWM/XG4gICAgY29uc3QgcXVhcnRlclRhbiA9IHF1YXJ0ZXJBbmdsZS50YW4oKTtcblxuICAgIGNvbnN0IHRhbmdlbnRBID0gcXVhcnRlclRhbiAqIHJhZGl1c0EubGVuZ3RoICogNC8zO1xuICAgIGNvbnN0IGFuY2hvckEgPSB0aGlzLnBvaW50QXREaXN0YW5jZSh0YW5nZW50QSk7XG5cbiAgICBjb25zdCB0YW5nZW50QiA9IHF1YXJ0ZXJUYW4gKiByYWRpdXNCLmxlbmd0aCAqIDQvMztcbiAgICBjb25zdCBhbmNob3JCID0gb3RoZXJSYXkucG9pbnRBdERpc3RhbmNlKHRhbmdlbnRCKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgYW5jaG9yQSxcbiAgICAgICAgYW5jaG9yQiwgb3RoZXJSYXkuc3RhcnQpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgc3RhcnRgIGFuZCBvcmllbnRlZCB0b3dhcmRzIGBhbmdsZWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmQgYGZvcm1hdGAuXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIHByb3ZpZGVkLCB0aGUgYW5nbGUgZm9yIHRoZSByZXR1cm5lZCB0ZXh0IHdpbGwgc3RpbGxcbiAgKiBiZSBzZXQgdG8gYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgZm9ybWF0ID0gZm9ybWF0LndpdGhBbmdsZSh0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH1cblxuXG59IC8vIGNsYXNzIFJheVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU2VnbWVudCBvZiBhIGBbUmF5XXtAbGluayBSYWMuUmF5fWAgd2l0aCBhIGdpdmVuIGxlbmd0aC5cbipcbiogIyMjIGBpbnN0YW5jZS5TZWdtZW50YFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlNlZ21lbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjU2VnbWVudH0gdG8gY3JlYXRlIGBTZWdtZW50YCBvYmplY3RzXG4qIGZyb20gcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5TZWdtZW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5TZWdtZW50I3plcm99LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5TZWdtZW50YF17QGxpbmsgaW5zdGFuY2UuU2VnbWVudH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IHJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzQpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBzZWdtZW50ID0gbmV3IFJhYy5TZWdtZW50KHJhYywgcmF5LCAxMDApXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclNlZ21lbnQgPSByYWMuU2VnbWVudCg1NSwgNzcsIDEvNCwgMTAwKVxuKlxuKiBAc2VlIFtgcmFjLlNlZ21lbnRgXXtAbGluayBSYWMjU2VnbWVudH1cbiogQHNlZSBbYGluc3RhbmNlLlNlZ21lbnRgXXtAbGluayBpbnN0YW5jZS5TZWdtZW50fVxuKlxuKiBAYWxpYXMgUmFjLlNlZ21lbnRcbiovXG5jbGFzcyBTZWdtZW50IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTZWdtZW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRoZSBzZWdtZW50IHdpbGwgYmUgYmFzZWQgb2ZcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudFxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHJheSwgbGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogZGlmZmVyZW50IGFwcHJvYWNoIHRvIGVycm9yIHRocm93aW5nP1xuICAgIC8vIGFzc2VydCB8fCB0aHJvdyBuZXcgRXJyb3IoZXJyLm1pc3NpbmdQYXJhbWV0ZXJzKVxuICAgIC8vIG9yXG4gICAgLy8gY2hlY2tlcihtc2cgPT4geyB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChtc2cpKTtcbiAgICAvLyAgIC5leGlzdHMocmFjKVxuICAgIC8vICAgLmlzVHlwZShSYWMuUmF5LCByYXkpXG4gICAgLy8gICAuaXNOdW1iZXIobGVuZ3RoKVxuXG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgcmF5LCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlJheSwgcmF5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIobGVuZ3RoKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYFJheWAgdGhlIHNlZ21lbnQgaXMgYmFzZWQgb2YuXG4gICAgKiBAdHlwZSB7UmFjLlJheX1cbiAgICAqL1xuICAgIHRoaXMucmF5ID0gcmF5O1xuXG4gICAgLyoqXG4gICAgKiBUaGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50LlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGxlbmd0aFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmxlbmd0aCwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFNlZ21lbnQoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9IGw6JHtsZW5ndGhTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHJheWAgYW5kIGBsZW5ndGhgIGluIGJvdGggc2VnbWVudHMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclNlZ21lbnRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuU2VnbWVudGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFNlZ21lbnRzJyBgbGVuZ3RoYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFtgcmF5LmVxdWFsc2Bde0BsaW5rIFJhYy5SYXkjZXF1YWxzfVxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyU2VnbWVudCkge1xuICAgIHJldHVybiBvdGhlclNlZ21lbnQgaW5zdGFuY2VvZiBTZWdtZW50XG4gICAgICAmJiB0aGlzLnJheS5lcXVhbHMob3RoZXJTZWdtZW50LnJheSlcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLmxlbmd0aCwgb3RoZXJTZWdtZW50Lmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGBbYW5nbGVde0BsaW5rIFJhYy5SYXkjYW5nbGV9YCBvZiB0aGUgc2VnbWVudCdzIGByYXlgLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5hbmdsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFtzdGFydF17QGxpbmsgUmFjLlJheSNzdGFydH1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc3RhcnQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aGVyZSB0aGUgc2VnbWVudCBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGFuZ2xlIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdBbmdsZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMucmF5LnN0YXJ0LCBuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgcmF5YCBzZXQgdG8gYG5ld1JheWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBuZXdSYXkgLSBUaGUgcmF5IGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFJheShuZXdSYXkpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHN0YXJ0IHBvaW50IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydFBvaW50IC0gVGhlIHN0YXJ0IHBvaW50IGZvciB0aGUgbmV3XG4gICogYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoU3RhcnRQb2ludChuZXdTdGFydFBvaW50KSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0KG5ld1N0YXJ0UG9pbnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgc2V0IHRvIGBuZXdMZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdMZW5ndGggLSBUaGUgbGVuZ3RoIGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aChuZXdMZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIGFkZGVkIHRvIGB0aGlzLmxlbmd0aGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoQWRkKGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoICsgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBzZXQgdG8gYHRoaXMubGVuZ3RoICogcmF0aW9gLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgYWRkZWQgdG8gYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZUFkZChhbmdsZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhBbmdsZUFkZChhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgYW5nbGVgIHNldCB0b1xuICAqIGB0aGlzLnJheS57QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0IGFuZ2xlLnNoaWZ0fShhbmdsZSwgY2xvY2t3aXNlKWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBiZSBzaGlmdGVkIGJ5XG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCBpbiB0aGUgaW52ZXJzZVxuICAqIGRpcmVjdGlvbiBvZiB0aGUgc2VnbWVudCdzIHJheSBieSB0aGUgZ2l2ZW4gYGRpc3RhbmNlYC4gVGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIHNhbWUgYGVuZFBvaW50KClgIGFuZCBgYW5nbGUoKWAgYXMgYHRoaXNgLlxuICAqXG4gICogVXNpbmcgYSBwb3NpdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBsb25nZXIgc2VnbWVudCwgdXNpbmcgYVxuICAqIG5lZ2F0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIHNob3J0ZXIgb25lLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoU3RhcnRFeHRlbnNpb24oZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0Rpc3RhbmNlKC1kaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoICsgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBkaXN0YW5jZWAgYWRkZWQgdG8gYHRoaXMubGVuZ3RoYCwgd2hpY2hcbiAgKiByZXN1bHRzIGluIGBlbmRQb2ludCgpYCBmb3IgdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgbW92aW5nIGluIHRoZVxuICAqIGRpcmVjdGlvbiBvZiB0aGUgc2VnbWVudCdzIHJheSBieSB0aGUgZ2l2ZW4gYGRpc3RhbmNlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBVc2luZyBhIHBvc2l0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIGxvbmdlciBzZWdtZW50LCB1c2luZyBhXG4gICogbmVnYXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgc2hvcnRlciBvbmUuXG4gICpcbiAgKiBUaGlzIG1ldGhvZCBwZXJmb3JtcyB0aGUgc2FtZSBvcGVyYXRpb24gYXNcbiAgKiBgW3dpdGhMZW5ndGhBZGRde0BsaW5rIFJhYy5TZWdtZW50I3dpdGhMZW5ndGhBZGR9YC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBhZGQgdG8gYGxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhFbmRFeHRlbnNpb24oZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy53aXRoTGVuZ3RoQWRkKGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcG9pdGluZyB0b3dhcmRzIHRoZVxuICAqIFtpbnZlcnNlIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX0gb2YgYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIHNhbWUgYHN0YXJ0UG9pbnQoKWAgYW5kIGBsZW5ndGhgXG4gICogYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQHNlZSBbYGFuZ2xlLmludmVyc2VgXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1cbiAgKi9cbiAgaW52ZXJzZSgpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS5pbnZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYHRoaXMuYW5nbGUoKWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBzYW1lIGBzdGFydFBvaW50KClgIGFuZCBgbGVuZ3RoYFxuICAqIGFzIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5wZXJwZW5kaWN1bGFyYF17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9XG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGl0cyBzdGFydCBwb2ludCBzZXQgYXRcbiAgKiBgW3RoaXMuZW5kUG9pbnQoKV17QGxpbmsgUmFjLlNlZ21lbnQjZW5kUG9pbnR9YCxcbiAgKiBhbmdsZSBzZXQgdG8gYHRoaXMuYW5nbGUoKS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gLCBhbmRcbiAgKiBzYW1lIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYGFuZ2xlLmludmVyc2VgXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1cbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgaW52ZXJzZVJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBlbmQsIHRoaXMucmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBpbnZlcnNlUmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieVxuICAqIHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnRcbiAgICB0b3dhcmRzXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCBhbG9uZyB0aGUgc2VnbWVudCdzXG4gICogcmF5IGJ5IHRoZSBnaXZlbiBgbGVuZ3RoYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0xlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0Rpc3RhbmNlKGxlbmd0aCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgdGhlIGdpdmVuIGBkaXN0YW5jZWBcbiAgKiB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIGFuZ2xlIHRvIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0b24uIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGB2YWx1ZWAgY2xhbXBlZCB0byBbc3RhcnRJbnNldCwgbGVuZ3RoLWVuZEluc2V0XS5cbiAgKlxuICAqIFdoZW4gYHN0YXJ0SW5zZXRgIGlzIGdyZWF0ZXIgdGhhdCBgbGVuZ3RoLWVuZEluc2V0YCB0aGUgcmFuZ2UgZm9yIHRoZVxuICAqIGNsYW1wIGJlY29tZXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGUgcmV0dXJuZWQgdmFsdWVcbiAgKiB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsIGNsYW1wbGVkIHRvXG4gICogYFswLCBsZW5ndGhdYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEEgdmFsdWUgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0SW5zZXQ9MF0gLSBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7ZW5kSW5zZXR9IFtlbmRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGNsYW1wVG9MZW5ndGgodmFsdWUsIHN0YXJ0SW5zZXQgPSAwLCBlbmRJbnNldCA9IDApIHtcbiAgICBjb25zdCBlbmRMaW1pdCA9IHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQ7XG4gICAgaWYgKHN0YXJ0SW5zZXQgPj0gZW5kTGltaXQpIHtcbiAgICAgIC8vIGltcG9zaWJsZSByYW5nZSwgcmV0dXJuIG1pZGRsZSBwb2ludFxuICAgICAgY29uc3QgcmFuZ2VNaWRkbGUgPSAoc3RhcnRJbnNldCAtIGVuZExpbWl0KSAvIDI7XG4gICAgICBjb25zdCBtaWRkbGUgPSBzdGFydEluc2V0IC0gcmFuZ2VNaWRkbGU7XG4gICAgICAvLyBTdGlsbCBjbGFtcCB0byB0aGUgc2VnbWVudCBpdHNlbGZcbiAgICAgIGxldCBjbGFtcGVkID0gbWlkZGxlO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoKTtcbiAgICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCAwKTtcbiAgICAgIHJldHVybiBjbGFtcGVkO1xuICAgIH1cbiAgICBsZXQgY2xhbXBlZCA9IHZhbHVlO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1pbihjbGFtcGVkLCB0aGlzLmxlbmd0aCAtIGVuZEluc2V0KTtcbiAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgc3RhcnRJbnNldCk7XG4gICAgcmV0dXJuIGNsYW1wZWQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGB0aGlzLnN0YXJ0UG9pbnQoKWAuIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpc1xuICAqIGNhbGN1bGF0ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0UG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQHNlZSBbYHJheS5wb2ludEF0RGlzdGFuY2VgXXtAbGluayBSYWMuUmF5I3BvaW50QXREaXN0YW5jZX1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCBhIGRpc3RhbmNlIG9mXG4gICogYHRoaXMubGVuZ3RoICogcmF0aW9gIGZyb20gYHRoaXMuc3RhcnRQb2ludCgpYC4gV2hlbiBgcmF0aW9gIGlzXG4gICogbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZlxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAc2VlIFtgcmF5LnBvaW50QXREaXN0YW5jZWBde0BsaW5rIFJhYy5SYXkjcG9pbnRBdERpc3RhbmNlfVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIG1pZGRsZSBwb2ludCB0aGUgc2VnbWVudC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QmlzZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgYXQgYG5ld1N0YXJ0UG9pbnRgIGFuZCBlbmRpbmcgYXRcbiAgKiBgdGhpcy5lbmRQb2ludCgpYC5cbiAgKlxuICAqIFdoZW4gYG5ld1N0YXJ0UG9pbnRgIGFuZCBgdGhpcy5lbmRQb2ludCgpYCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgbW92ZVN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGVuZGluZyBhdFxuICAqIGBuZXdFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGBuZXdFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0VuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgbW92ZUVuZFBvaW50KG5ld0VuZFBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnNlZ21lbnRUb1BvaW50KG5ld0VuZFBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc3RhcnRpbmcgcG9pbnQgdG8gdGhlIHNlZ21lbnQncyBtaWRkbGVcbiAgKiBwb2ludC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFtgcG9pbnRBdEJpc2VjdG9yYF17QGxpbmsgUmFjLlNlZ21lbnQjcG9pbnRBdEJpc2VjdG9yfVxuICAqL1xuICBzZWdtZW50VG9CaXNlY3RvcigpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc2VnbWVudCdzIG1pZGRsZSBwb2ludCB0b3dhcmRzIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2Bwb2ludEF0QmlzZWN0b3JgXXtAbGluayBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3J9XG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKi9cbiAgc2VnbWVudEJpc2VjdG9yKGxlbmd0aCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMucG9pbnRBdEJpc2VjdG9yKCk7XG4gICAgY29uc3QgbmV3QW5nbGUgPSB0aGlzLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCBuZXdBbmdsZSk7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IGxlbmd0aDtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgd2l0aCB0aGUgZ2l2ZW5cbiAgKiBgbGVuZ3RoYCBhbmQgdGhlIHNhbWUgYW5nbGUgYXMgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG5leHQgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFdpdGhMZW5ndGgobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0KG5ld1N0YXJ0KTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgYW5kIHVwIHRvIHRoZSBnaXZlblxuICAqIGBuZXh0RW5kUG9pbnRgLlxuICAqXG4gICogV2hlbiBgZW5kUG9pbnQoKWAgYW5kIGBuZXh0RW5kUG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2VcbiAgKiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXh0RW5kUG9pbnQgLSBUaGUgZW5kIHBvaW50IG9mIHRoZSBuZXh0IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFtgcmFjLmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIG5leHRTZWdtZW50VG9Qb2ludChuZXh0RW5kUG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICByZXR1cm4gbmV3U3RhcnQuc2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHRvd2FyZHMgYGFuZ2xlYFxuICAqIHdpdGggdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IFtsZW5ndGg9bnVsbF0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgLCBvclxuICAqIGBudWxsYCB0byB1c2UgYHRoaXMubGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbFxuICAgICAgPyB0aGlzLmxlbmd0aFxuICAgICAgOiBsZW5ndGg7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHRvd2FyZHMgdGhlIGdpdmVuXG4gICogYGFuZ2xlRGlzdGFuY2VgIGZyb20gYHRoaXMuYW5nbGUoKS5pbnZlcnNlKClgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoZSBgYW5nbGVEaXN0YW5jZWAgaXMgYXBwbGllZCB0byB0aGUgaW52ZXJzZSBvZiB0aGVcbiAgKiBzZWdtZW50J3MgYW5nbGUuIEUuZy4gd2l0aCBhbiBgYW5nbGVEaXN0YW5jZWAgb2YgYDBgIHRoZSByZXN1bHRpbmdcbiAgKiBgU2VnbWVudGAgd2lsbCBiZSBkaXJlY3RseSBvdmVyIGFuZCBwb2ludGluZyBpbiB0aGUgaW52ZXJzZSBhbmdsZSBvZlxuICAqIGB0aGlzYC4gQXMgdGhlIGBhbmdsZURpc3RhbmNlYCBpbmNyZWFzZXMgdGhlIHR3byBzZWdtZW50cyBzZXBhcmF0ZSB3aXRoXG4gICogdGhlIHBpdm90IGF0IGBlbmRQb2ludCgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIEFuIGFuZ2xlIGRpc3RhbmNlIHRvIGFwcGx5IHRvXG4gICogdGhlIHNlZ21lbnQncyBhbmdsZSBpbnZlcnNlXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhbmdsZSBzaGlmdFxuICAqIGZyb20gYGVuZFBvaW50KClgXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYGFuZ2xlLmludmVyc2VgXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1cbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5pbnZlcnNlKClcbiAgICAgIC53aXRoQW5nbGVTaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZVxuICAqIGBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9YCBvZlxuICAqIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAqIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoIGBjbG9ja3dpc2VgIGFzIGB0cnVlYCwgdGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGJlIHBvaW50aW5nIHRvd2FyZHMgYHRoaXMuYW5nbGUoKS5wZXJwZW5kaWN1bGFyKGZhbHNlKWAuXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P051bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2BhbmdsZS5wZXJwZW5kaWN1bGFyYF17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9XG4gICovXG4gIG5leHRTZWdtZW50UGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IGxlbmd0aDtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UodGhpcy5sZW5ndGgpXG4gICAgICAucGVycGVuZGljdWxhcighY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgd2hpY2ggY29ycmVzcG9uZHNcbiAgKiB0byB0aGUgbGVnIG9mIGEgcmlnaHQgdHJpYW5nbGUgd2hlcmUgYHRoaXNgIGlzIHRoZSBvdGhlciBjYXRoZXR1cyBhbmRcbiAgKiB0aGUgaHlwb3RlbnVzZSBpcyBvZiBsZW5ndGggYGh5cG90ZW51c2VgLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBwb2ludCB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIGFuZ2xlIG9mXG4gICogYFt0aGlzLmFuZ2xlKCkuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gYGh5cG90ZW51c2VgIGlzIHNtYWxsZXIgdGhhdCB0aGUgc2VnbWVudCdzIGBsZW5ndGhgLCByZXR1cm5zXG4gICogYG51bGxgIHNpbmNlIG5vIHJpZ2h0IHRyaWFuZ2xlIGlzIHBvc3NpYmxlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGh5cG90ZW51c2UgLSBUaGUgbGVuZ3RoIG9mIHRoZSBoeXBvdGVudXNlIHNpZGUgb2YgdGhlXG4gICogcmlnaHQgdHJpYW5nbGUgZm9ybWVkIHdpdGggYHRoaXNgIGFuZCB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGZyb20gYGVuZFBvaW50KClgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2BhbmdsZS5pbnZlcnNlYF17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9XG4gICovXG4gIG5leHRTZWdtZW50TGVnV2l0aEh5cChoeXBvdGVudXNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgaWYgKGh5cG90ZW51c2UgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gY29zID0gYWR5IC8gaHlwXG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYWNvcyh0aGlzLmxlbmd0aCAvIGh5cG90ZW51c2UpO1xuICAgIC8vIHRhbiA9IG9wcyAvIGFkalxuICAgIC8vIHRhbiAqIGFkaiA9IG9wc1xuICAgIGNvbnN0IG9wcyA9IE1hdGgudGFuKHJhZGlhbnMpICogdGhpcy5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXMubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSwgb3BzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCBiYXNlZCBvbiB0aGlzIHNlZ21lbnQsIHdpdGggdGhlIGdpdmVuIGBlbmRBbmdsZWBcbiAgKiBhbmQgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYEFyY2Agd2lsbCB1c2UgdGhpcyBzZWdtZW50J3Mgc3RhcnQgYXMgYGNlbnRlcmAsIGl0cyBhbmdsZVxuICAqIGFzIGBzdGFydGAsIGFuZCBpdHMgbGVuZ3RoIGFzIGByYWRpdXNgLlxuICAqXG4gICogV2hlbiBgZW5kQW5nbGVgIGlzIG9tbWl0ZWQgb3IgYG51bGxgLCB0aGUgc2VnbWVudCdzIGFuZ2xlIGlzIHVzZWRcbiAgKiBpbnN0ZWFkIHJlc3VsdGluZyBpbiBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV9IFtlbmRBbmdsZT1udWxsXSAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIGVuZCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLCBvciBgbnVsbGAgdG8gdXNlIGB0aGlzLmFuZ2xlKClgXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKGVuZEFuZ2xlID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGVuZEFuZ2xlID0gZW5kQW5nbGUgPT09IG51bGxcbiAgICAgID8gdGhpcy5yYXkuYW5nbGVcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGVuZEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICB0aGlzLnJheS5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgYXJjJ3MgZW5kIGF0XG4gICogYGFuZ2xlRGlzdGFuY2VgIGZyb20gdGhlIHNlZ21lbnQncyBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgQXJjYCB3aWxsIHVzZSB0aGlzIHNlZ21lbnQncyBzdGFydCBhcyBgY2VudGVyYCwgaXRzIGFuZ2xlXG4gICogYXMgYHN0YXJ0YCwgYW5kIGl0cyBsZW5ndGggYXMgYHJhZGl1c2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbSB0aGVcbiAgKiBzZWdtZW50J3Mgc3RhcnQgdG8gdGhlIG5ldyBgQXJjYCBlbmRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmNXaXRoQW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGVEaXN0YW5jZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGVEaXN0YW5jZSk7XG4gICAgY29uc3Qgc3RhcmdBbmdsZSA9IHRoaXMucmF5LmFuZ2xlO1xuICAgIGNvbnN0IGVuZEFuZ2xlID0gc3RhcmdBbmdsZS5zaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5yYXkuc3RhcnQsIHRoaXMubGVuZ3RoLFxuICAgICAgc3RhcmdBbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvLyBUT0RPOiB1bmNvbW1lbnQgb25jZSBiZXppZXJzIGFyZSB0ZXN0ZWQgYWdhaW5cbiAgLy8gYmV6aWVyQ2VudHJhbEFuY2hvcihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAvLyAgIGxldCBiaXNlY3RvciA9IHRoaXMuc2VnbWVudEJpc2VjdG9yKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAvLyAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgLy8gICAgIHRoaXMuc3RhcnQsIGJpc2VjdG9yLmVuZCxcbiAgLy8gICAgIGJpc2VjdG9yLmVuZCwgdGhpcy5lbmQpO1xuICAvLyB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgc3RhcnRgIGFuZCBvcmllbnRlZCB0b3dhcmRzIGByYXkuYW5nbGVgXG4gICogd2l0aCB0aGUgZ2l2ZW4gYHN0cmluZ2AgYW5kIGBmb3JtYXRgLlxuICAqXG4gICogV2hlbiBgZm9ybWF0YCBpcyBwcm92aWRlZCwgdGhlIGFuZ2xlIGZvciB0aGUgcmV0dXJuZWQgdGV4dCB3aWxsIHN0aWxsXG4gICogYmUgc2V0IHRvIGByYXkuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gW2Zvcm1hdD1bcmFjLlRleHQuRm9ybWF0LnRvcExlZnRde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I3RvcExlZnR9XVxuICAqICAgVGhlIGZvcm1hdCBvZiB0aGUgbmV3IGBUZXh0YFxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgdGV4dChzdHJpbmcsIGZvcm1hdCA9IHRoaXMucmFjLlRleHQuRm9ybWF0LnRvcExlZnQpIHtcbiAgICBmb3JtYXQgPSBmb3JtYXQud2l0aEFuZ2xlKHRoaXMucmF5LmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMucmFjLCB0aGlzLnJheS5zdGFydCwgc3RyaW5nLCBmb3JtYXQpO1xuICB9XG5cblxufSAvLyBTZWdtZW50XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTZWdtZW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udGFpbnMgdHdvIGBbQ29tcG9zaXRlXXtAbGluayBSYWMuQ29tcG9zaXRlfWAgb2JqZWN0czogYG91dGxpbmVgIGFuZFxuKiBgY29udG91cmAuXG4qXG4qIFVzZWQgYnkgYFtQNURyYXdlcl17QGxpbmsgUmFjLlA1RHJhd2VyfWAgdG8gZHJhdyB0aGUgY29tcG9zaXRlcyBhcyBhXG4qIGNvbXBsZXggc2hhcGUgKGBvdXRsaW5lYCkgd2l0aCBhbiBuZWdhdGl2ZSBzcGFjZSBzaGFwZSBpbnNpZGUgKGBjb250b3VyYCkuXG4qXG4qIOKaoO+4jyBUaGUgQVBJIGZvciBTaGFwZSBpcyAqKnBsYW5uZWQgdG8gY2hhbmdlKiogaW4gYSBmdXR1cmUgcmVsZWFzZS4g4pqg77iPXG4qXG4qIEBjbGFzc1xuKiBAYWxpYXMgUmFjLlNoYXBlXG4qL1xuZnVuY3Rpb24gU2hhcGUocmFjKSB7XG4gIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuXG4gIHRoaXMucmFjID0gcmFjO1xuICB0aGlzLm91dGxpbmUgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xuICB0aGlzLmNvbnRvdXIgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcGU7XG5cblxuU2hhcGUucHJvdG90eXBlLmFkZE91dGxpbmUgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHRoaXMub3V0bGluZS5hZGQoZWxlbWVudCk7XG59O1xuXG5TaGFwZS5wcm90b3R5cGUuYWRkQ29udG91ciA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdGhpcy5jb250b3VyLmFkZChlbGVtZW50KTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBEZXRlcm1pbmVzIHRoZSBhbGlnbm1lbnQsIGFuZ2xlLCBmb250LCBzaXplLCBhbmQgcGFkZGluZyBmb3IgZHJhd2luZyBhXG4qIFtgVGV4dGBde0BsaW5rIFJhYy5UZXh0fSBvYmplY3QuXG4qXG4qICMjIyBgaW5zdGFuY2UuVGV4dC5Gb3JtYXRgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuVGV4dC5Gb3JtYXRgIGZ1bmN0aW9uXXtAbGluayBSYWMjVGV4dEZvcm1hdH0gdG8gY3JlYXRlXG4qIGBUZXh0LkZvcm1hdGAgb2JqZWN0cyBmcm9tIHByaW1pdGl2ZSB2YWx1ZXMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWluc1xuKiByZWFkeS1tYWRlIGNvbnZlbmllbmNlIG9iamVjdHMsIGxpa2VcbiogW2ByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdGBde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I3RvcExlZnR9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgYW5nbGUgPSByYWMuQW5nbGUoMS84KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChyYWMsICdsZWZ0JywgJ2Jhc2VsaW5lJywgYW5nbGUpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlckZvcm1hdCA9IHJhYy5UZXh0LkZvcm1hdCgnbGVmdCcsICdiYXNlbGluZScsIDEvOClcbipcbiogQHNlZSBbYHJhYy5UZXh0LkZvcm1hdGBde0BsaW5rIFJhYyNUZXh0Rm9ybWF0fVxuKiBAc2VlIFtgaW5zdGFuY2UuVGV4dC5Gb3JtYXRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdH1cbipcbiogQGFsaWFzIFJhYy5UZXh0LkZvcm1hdFxuKi9cbmNsYXNzIFRleHRGb3JtYXQge1xuXG4gIC8qKlxuICAqIFN1cHBvcnRlZCB2YWx1ZXMgZm9yIFtgaEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2hBbGlnbn0gd2hpY2hcbiAgKiBkZXJtaW5lcyB0aGUgbGVmdC10by1yaWdodCBhbGlnbm1lbnQgb2YgdGhlIGRyYXduIGBUZXh0YCBpbiByZWxhdGlvblxuICAqIHRvIGl0cyBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICpcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gbGVmdFxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgbGVmdCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGNlbnRlclxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgY2VudGVyLCBmcm9tIHNpZGUgdG8gc2lkZSwgb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gcmlnaHRcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHRcbiAgKlxuICAqIEB0eXBlIHtPYmplY3R9XG4gICogQG1lbWJlcm9mIFJhYy5UZXh0LkZvcm1hdFxuICAqL1xuICBzdGF0aWMgaG9yaXpvbnRhbEFsaWduID0ge1xuICAgIGxlZnQ6ICAgXCJsZWZ0XCIsXG4gICAgY2VudGVyOiBcImhvcml6b250YWxDZW50ZXJcIixcbiAgICByaWdodDogIFwicmlnaHRcIlxuICB9O1xuXG4gIC8qKlxuICAqIFN1cHBvcnRlZCB2YWx1ZXMgZm9yIFtgdkFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3ZBbGlnbn0gd2hpY2hcbiAgKiBkZXJtaW5lcyB0aGUgdG9wLXRvLWJvdHRvbSBhbGlnbm1lbnQgb2YgdGhlIGRyYXduIGBUZXh0YCBpbiByZWxhdGlvblxuICAqIHRvIGl0cyBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICpcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gdG9wXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSB0b3AgZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBjZW50ZXJcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIGNlbnRlciwgZnJvbSB0b3AgdG8gYm90dG9tLCBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBiYXNlbGluZVxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgYmFzZWxpbmUgb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gYm90dG9tXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSBib3R0b20gZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqXG4gICogQHR5cGUge09iamVjdH1cbiAgKiBAbWVtYmVyb2YgUmFjLlRleHQuRm9ybWF0XG4gICovXG4gIHN0YXRpYyB2ZXJ0aWNhbEFsaWduID0ge1xuICAgIHRvcDogICAgICBcInRvcFwiLFxuICAgIGNlbnRlcjogICBcInZlcnRpY2FsQ2VudGVyXCIsXG4gICAgYmFzZWxpbmU6IFwiYmFzZWxpbmVcIixcbiAgICBib3R0b206ICAgXCJib3R0b21cIlxuICB9O1xuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgVGV4dC5Gb3JtYXRgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhY1xuICAqICAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtTdHJpbmd9IGhBbGlnblxuICAqICAgVGhlIGhvcml6b250YWwgYWxpZ25tZW50LCBsZWZ0LXRvLXJpZ2h0OyBvbmUgb2YgdGhlIHZhbHVlcyBmcm9tXG4gICogICBbYGhvcml6b250YWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ259XG4gICogQHBhcmFtIHtTdHJpbmd9IHZBbGlnblxuICAqICAgVGhlIHZlcnRpY2FsIGFsaWdubWVudCwgdG9wLXRvLWJvdHRvbTsgb25lIG9mIHRoZSB2YWx1ZXMgZnJvbVxuICAqICAgW2B2ZXJ0aWNhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ259XG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IFthbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd25cbiAgKiBAcGFyYW0ge1N0cmluZ30gW2ZvbnQ9bnVsbF1cbiAgKiAgIFRoZSBmb250IG5hbWVcbiAgKiBAcGFyYW0ge051bWJlcn0gW3NpemU9bnVsbF1cbiAgKiAgIFRoZSBmb250IHNpemVcbiAgKiBAcGFyYW0ge051bWJlcn0gW2hQYWRkaW5nPTBdXG4gICogICBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nLCBsZWZ0LXRvLXJpZ2h0XG4gICogQHBhcmFtIHtOdW1iZXJ9IFt2UGFkZGluZz0wXVxuICAqICAgVGhlIHZlcnRpY2FsIHBhZGRpbmcsIHRvcC10by1ib3R0b21cbiAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmFjLFxuICAgIGhBbGlnbixcbiAgICB2QWxpZ24sXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBmb250ID0gbnVsbCxcbiAgICBzaXplID0gbnVsbCxcbiAgICBoUGFkZGluZyA9IDAsXG4gICAgdlBhZGRpbmcgPSAwKVxuICB7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0U3RyaW5nKGhBbGlnbiwgdkFsaWduKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5BbmdsZSwgYW5nbGUpO1xuICAgIGZvbnQgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0U3RyaW5nKGZvbnQpO1xuICAgIHNpemUgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0TnVtYmVyKHNpemUpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihoUGFkZGluZywgdlBhZGRpbmcpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodCwgdG8gcG9zaXRpb24gYSBgVGV4dGBcbiAgICAqIHJlbGF0aXZlIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIFN1cHBvcnRlZCB2YWx1ZXMgYXJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZVxuICAgICogW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufSBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuaEFsaWduID0gaEFsaWduO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tLCB0byBwb3NpdGlvbiBhIGBUZXh0YCByZWxhdGl2ZVxuICAgICogdG8gaXRzIFtgcG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICAgKlxuICAgICogU3VwcG9ydGVkIHZhbHVlcyBhcmUgYXZhaWxhYmxlIHRocm91Z2ggdGhlXG4gICAgKiBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn0gb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnZBbGlnbiA9IHZBbGlnbjtcblxuICAgIC8qKlxuICAgICogVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd24uXG4gICAgKlxuICAgICogQW4gYW5nbGUgb2YgW2B6ZXJvYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb30gd2lsIGRyYXcgdGhlIHRleHRcbiAgICAqIHRvd2FyZHMgdGhlIHJpZ2h0IG9mIHRoZSBzY3JlZW4uXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgIC8qKlxuICAgICogVGhlIGZvbnQgbmFtZSBvZiB0aGUgdGV4dCB0byBkcmF3LlxuICAgICpcbiAgICAqIFdoZW4gc2V0IHRvIGBudWxsYCB0aGUgZm9udCBkZWZpbmVkIGluXG4gICAgKiBbYHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuZm9udGBde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9IGlzXG4gICAgKiB1c2VkIGluc3RlYWQgdXBvbiBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHs/U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy5mb250ID0gZm9udDtcblxuICAgIC8qKlxuICAgICogVGhlIGZvbnQgc2l6ZSBvZiB0aGUgdGV4dCB0byBkcmF3LlxuICAgICpcbiAgICAqIFdoZW4gc2V0IHRvIGBudWxsYCB0aGUgc2l6ZSBkZWZpbmVkIGluXG4gICAgKiBbYHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZWBde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9IGlzXG4gICAgKiB1c2VkIGluc3RlYWQgdXBvbiBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHs/TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcblxuICAgIC8qKlxuICAgICogVGhlIGhvcml6b250YWwgcGFkZGluZywgbGVmdC10by1yaWdodCwgdG8gZGlzdGFuY2UgYSBgVGV4dGBcbiAgICAqIHJlbGF0aXZlIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmhQYWRkaW5nID0gaFBhZGRpbmc7XG5cbiAgICAvKipcbiAgICAqIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nLCB0b3AtdG8tYm90dG9tLCB0byBkaXN0YW5jZSBhIGBUZXh0YCByZWxhdGl2ZVxuICAgICogdG8gaXRzIFtgcG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy52UGFkZGluZyA9IHZQYWRkaW5nO1xuICB9IC8vIGNvbnN0cnVjdG9yXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJuczogJ1RleHQuRm9ybWF0KGhhOmxlZnQgdmE6dG9wIGE6MC41IGY6XCJzYW5zXCIgczoxNCknXG4gICogcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ3RvcCcsIDAuNSwgJ3NhbnMnLCAxNCkpLnRvU3RyaW5nKClcbiAgKlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgYW5nbGVTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IHNpemVTdHIgPSB0aGlzLnNpemUgPT09IG51bGxcbiAgICAgID8gJ251bGwnXG4gICAgICA6IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnNpemUsIGRpZ2l0cyk7XG4gICAgY29uc3QgZm9udFN0ciA9IHRoaXMuZm9udCA9PT0gbnVsbFxuICAgICAgPyAnbnVsbCdcbiAgICAgIDogYFwiJHt0aGlzLmZvbnR9XCJgO1xuICAgIGNvbnN0IHBhZGRpbmdTdHIgPVxuICAgICAgYCgke3V0aWxzLmN1dERpZ2l0cyh0aGlzLmhQYWRkaW5nLCBkaWdpdHMpfSwke3V0aWxzLmN1dERpZ2l0cyh0aGlzLnZQYWRkaW5nLCBkaWdpdHMpfSlgXG4gICAgcmV0dXJuIGBUZXh0LkZvcm1hdChoYToke3RoaXMuaEFsaWdufSB2YToke3RoaXMudkFsaWdufSBhOiR7YW5nbGVTdHJ9IGY6JHtmb250U3RyfSBzOiR7c2l6ZVN0cn0gcDoke3BhZGRpbmdTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMsIGV4Y2VwdCBgcmFjYCwgb2YgYm90aCBmb3JtYXRzIGFyZVxuICAqIGVxdWFsLCBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJGb3JtYXRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuVGV4dC5Gb3JtYXRgLCByZXR1cm5zXG4gICogYGZhbHNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBvdGhlckZvcm1hdCAtIEEgYFRleHQuRm9ybWF0YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICovXG4gIGVxdWFscyhvdGhlckZvcm1hdCkge1xuICAgIHJldHVybiBvdGhlckZvcm1hdCBpbnN0YW5jZW9mIFRleHRGb3JtYXRcbiAgICAgICYmIHRoaXMuaEFsaWduICAgPT09IG90aGVyRm9ybWF0LmhBbGlnblxuICAgICAgJiYgdGhpcy52QWxpZ24gICA9PT0gb3RoZXJGb3JtYXQudkFsaWduXG4gICAgICAmJiB0aGlzLmZvbnQgICAgID09PSBvdGhlckZvcm1hdC5mb250XG4gICAgICAmJiB0aGlzLnNpemUgICAgID09PSBvdGhlckZvcm1hdC5zaXplXG4gICAgICAmJiB0aGlzLmhQYWRkaW5nID09PSBvdGhlckZvcm1hdC5oUGFkZGluZ1xuICAgICAgJiYgdGhpcy52UGFkZGluZyA9PT0gb3RoZXJGb3JtYXQudlBhZGRpbmdcbiAgICAgICYmIHRoaXMuYW5nbGUuZXF1YWxzKG90aGVyRm9ybWF0LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggYGFuZ2xlYCBzZXQgdG8gdGhlIGBBbmdsZWAgZGVyaXZlZFxuICAqIGZyb20gYG5ld0FuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgbmV3QW5nbGUsXG4gICAgICB0aGlzLmZvbnQsIHRoaXMuc2l6ZSxcbiAgICAgIHRoaXMuaFBhZGRpbmcsIHRoaXMudlBhZGRpbmcpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgd2l0aCBgZm9udGAgc2V0IHRvIGBuZXdGb250YC5cbiAgKiBAcGFyYW0gez9TdHJpbmd9IG5ld0ZvbnQgLSBUaGUgZm9udCBuYW1lIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGA7XG4gICogICBjYW4gYmUgc2V0IHRvIGBudWxsYC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoRm9udChuZXdGb250KSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgdGhpcy5hbmdsZSxcbiAgICAgIG5ld0ZvbnQsIHRoaXMuc2l6ZSxcbiAgICAgIHRoaXMuaFBhZGRpbmcsIHRoaXMudlBhZGRpbmcpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgd2l0aCBgc2l6ZWAgc2V0IHRvIGBuZXdTaXplYC5cbiAgKiBAcGFyYW0gez9OdW1iZXJ9IG5ld1NpemUgLSBUaGUgZm9udCBzaXplIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGA7XG4gICogICBjYW4gYmUgc2V0IHRvIGBudWxsYC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoU2l6ZShuZXdTaXplKSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgdGhpcy5hbmdsZSxcbiAgICAgIHRoaXMuZm9udCwgbmV3U2l6ZSxcbiAgICAgIHRoaXMuaFBhZGRpbmcsIHRoaXMudlBhZGRpbmcpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggcGFkZGluZ3Mgc2V0IHRvIHRoZSBnaXZlbiB2YWx1ZXMuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gaFBhZGRpbmcgLSBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGBcbiAgKiBAcGFyYW0ge051bWJlcn0gdlBhZGRpbmcgLSBUaGUgdmVydGljYWwgcGFkZGluZyBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoUGFkZGluZ3MoaFBhZGRpbmcsIHZQYWRkaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgdGhpcy5hbmdsZSwgdGhpcy5mb250LCB0aGlzLnNpemUsXG4gICAgICBoUGFkZGluZywgdlBhZGRpbmcpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgdGhhdCBmb3JtYXRzIGEgdGV4dCByZXZlcnNlZCwgdXBzaWRlLWRvd24sXG4gICogZ2VuZXJhbGx5IGluIHRoZSBzYW1lIHBvc2l0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBmb3JtYXQgd2lsbCBiZSBvcmllbnRlZCB0b3dhcmRzIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX0gb2YgYGFuZ2xlYDsgYWxpZ25tZW50cyBmb3IgYGxlZnRgXG4gICogYmVjb21lcyBgcmlnaHRgIGFuZCB2aWNldmVyc2E7IGB0b3BgIGJlY29tZXMgYGJvdHRvbWAgYW5kIHZpY2V2ZXJzYTtcbiAgKiBgY2VudGVyYCBhbmQgYGJhc2VsaW5lYCByZW1haW4gdGhlIHNhbWUuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIGxldCBoRW51bSA9IFRleHRGb3JtYXQuaG9yaXpvbnRhbEFsaWduO1xuICAgIGxldCB2RW51bSA9IFRleHRGb3JtYXQudmVydGljYWxBbGlnbjtcbiAgICBsZXQgaEFsaWduLCB2QWxpZ247XG4gICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgY2FzZSBoRW51bS5sZWZ0OiAgaEFsaWduID0gaEVudW0ucmlnaHQ7IGJyZWFrO1xuICAgICAgY2FzZSBoRW51bS5yaWdodDogaEFsaWduID0gaEVudW0ubGVmdDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAgICAgICAgICBoQWxpZ24gPSB0aGlzLmhBbGlnbjsgYnJlYWs7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy52QWxpZ24pIHtcbiAgICAgIGNhc2UgdkVudW0udG9wOiAgICB2QWxpZ24gPSB2RW51bS5ib3R0b207IGJyZWFrO1xuICAgICAgY2FzZSB2RW51bS5ib3R0b206IHZBbGlnbiA9IHZFbnVtLnRvcDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAgICAgICAgICAgdkFsaWduID0gdGhpcy52QWxpZ247IGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgaEFsaWduLCB2QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLmludmVyc2UoKSxcbiAgICAgIHRoaXMuZm9udCwgdGhpcy5zaXplLFxuICAgICAgdGhpcy5oUGFkZGluZywgdGhpcy52UGFkZGluZyk7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0Rm9ybWF0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0Rm9ybWF0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5jb25zdCBUZXh0Rm9ybWF0ID0gcmVxdWlyZSgnLi9UZXh0LkZvcm1hdCcpXG5cbi8vIE5vdCB1c2VkLCBTZWVtcyBsaWtlIHVnbGlmeSBtaW5pZmljYXRpb24gbmVlZHMgYSByZWZlcmVuY2UgaGVyZTtcbi8vIG90aGVyd2lzZSBUZXh0Rm9ybWF0IGlzIG5vdCBjb3JyZWN0bHkgcmVxdWlyZWQuXG52YXIgbWluaWZ5SGVscGVyID0gVGV4dEZvcm1hdFxuXG4vKipcbiogU3RyaW5nLCBwb3NpdGlvbiBhbmQgW2Zvcm1hdF17QGxpbmsgUmFjLlRleHQuRm9ybWF0fSB0byBkcmF3IGEgdGV4dC5cbipcbiogQW4gaW5zdGFuY2Ugb2YgdGhpcyBvYmplY3QgY29udGFpbnMgdGhlIHN0cmluZyBhbmQgYSBgUG9pbnRgIHVzZWQgdG9cbiogZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiB0aGUgZHJhd24gdGV4dC4gVGhlXG4qIFtgVGV4dC5Gb3JtYXRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9IG9iamVjdCBkZXRlcm1pbmVzIHRoZSBmb250LCBzaXplLFxuKiBvcmllbnRhdGlvbiBhbmdsZSwgYW5kIHRoZSBhbGlnbm1lbnQgcmVsYXRpdmUgdG9cbiogW2Bwb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0byBkcmF3IHRoZSB0ZXh0LlxuKlxuKiAjIyMgYGluc3RhbmNlLlRleHRgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuVGV4dGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0fSB0byBjcmVhdGUgYFRleHRgIG9iamVjdHMgd2l0aCBmZXdlclxuKiBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlRleHQuaGVsbG9gXXtAbGluayBpbnN0YW5jZS5UZXh0I2hlbGxvfSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuVGV4dGBde0BsaW5rIGluc3RhbmNlLlRleHR9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBwb2ludCA9IHJhYy5Qb2ludCg1NSwgNzcpXG4qIGxldCBmb3JtYXQgPSByYWMuVGV4dC5Gb3JtYXQoJ2xlZnQnLCAnYmFzZWxpbmUnKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgdGV4dCA9IG5ldyBSYWMuVGV4dChyYWMsIHBvaW50LCAnYmxhY2sgcXVhcnR6JywgZm9ybWF0KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJUZXh0ID0gcmFjLlRleHQoNTUsIDc3LCAnYmxhY2sgcXVhcnR6JywgZm9ybWF0KVxuKlxuKiBAc2VlIFtgcmFjLlRleHRgXXtAbGluayBSYWMjVGV4dH1cbiogQHNlZSBbYGluc3RhbmNlLlRleHRgXXtAbGluayBpbnN0YW5jZS5UZXh0fVxuKlxuKiBAYWxpYXMgUmFjLlRleHRcbiovXG5jbGFzcyBUZXh0IHtcblxuICBzdGF0aWMgRm9ybWF0ID0gVGV4dEZvcm1hdDtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBUZXh0YCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWNcbiAgKiAgIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludFxuICAqICAgVGhlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAgKiAgIFRoZSBzdHJpbmcgdG8gZHJhd1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKiAgIFRoZSBmb3JtYXQgZm9yIHRoZSBkcmF3biB0ZXh0XG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgcG9pbnQsIHN0cmluZywgZm9ybWF0KSB7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIHBvaW50KTtcbiAgICB1dGlscy5hc3NlcnRTdHJpbmcoc3RyaW5nKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFRleHQuRm9ybWF0LCBmb3JtYXQpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgdGV4dCB3aWxsIGJlIGRyYXduLlxuICAgICpcbiAgICAqIFRoZSB0ZXh0IHdpbGwgYmUgZHJhd24gcmVsYXRpdmUgdG8gdGhpcyBwb2ludCBiYXNlZCBvbiB0aGVcbiAgICAqIGFsaWdubWVudCBhbmQgYW5nbGUgY29uZmlndXJhdGlvbiBvZlxuICAgICogW2Bmb3JtYXRgXXtAbGluayBSYWMuVGV4dCNmb3JtYXR9LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzdHJpbmcgdG8gZHJhdy5cbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcblxuICAgIC8qKlxuICAgICogVGhlIGFsaWdubWVudCwgYW5nbGUsIGZvbnQsIGFuZCBzaXplIHRvIHVzZSB0byBkcmF3IHRoZSB0ZXh0LlxuICAgICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgICAqL1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAnVGV4dCgoNTUsNzcpIFwic3BoaW54IG9mIGJsYWNrIHF1YXJ0elwiKSdcbiAgKiByYWMuVGV4dCg1NSwgNzcsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6JykudG9TdHJpbmcoKVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnBvaW50LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnBvaW50LnksIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBUZXh0KCgke3hTdHJ9LCR7eVN0cn0pIFwiJHt0aGlzLnN0cmluZ31cIilgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBgc3RyaW5nYCBhbmQgYHBvaW50YCBvZiBib3RoIHRleHRzIGFyZSBlcXVhbDtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJUZXh0YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlRleHRgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBgcG9pbnRgcyBhcmUgY29tcGFyZWQgdXNpbmcgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfS5cbiAgKlxuICAqIFRoZSBgZm9ybWF0YCBvYmplY3RzIGFyZSBpZ25vcmVkIGluIHRoaXMgY29tcGFyaXNvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlRleHR9IG90aGVyVGV4dCAtIEEgYFRleHRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyVGV4dCkge1xuICAgIHJldHVybiBvdGhlclRleHQgaW5zdGFuY2VvZiBUZXh0XG4gICAgICAmJiB0aGlzLnN0cmluZyA9PT0gb3RoZXJUZXh0LnN0cmluZ1xuICAgICAgJiYgdGhpcy5wb2ludC5lcXVhbHMob3RoZXJUZXh0LnBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggYGZvcm1hdC5hbmdsZWAgc2V0IHRvIHRoZVxuICAqIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBuZXdBbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgVGV4dGAgYW5kXG4gICogICBgVGV4dC5Gb3JtYXRgXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoQW5nbGUobmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGFuZCBgRm9ybWF0YCB3aXRoIGBmb3JtYXQuZm9udGAgc2V0IHRvIGBuZXdGb250YC5cbiAgKiBAcGFyYW0gez9TdHJpbmd9IG5ld0ZvbnQgLSBUaGUgZm9udCBuYW1lIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGA7IGNhbiBiZSBzZXQgdG8gYG51bGxgLlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgd2l0aEZvbnQobmV3Rm9udCkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhGb250KG5ld0ZvbnQpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGFuZCBgRm9ybWF0YCB3aXRoIGBmb3JtYXQuc2l6ZWAgc2V0IHRvIGBuZXdTaXplYC5cbiAgKiBAcGFyYW0gez9OdW1iZXJ9IG5ld1NpemUgLSBUaGUgZm9udCBzaXplIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGA7IGNhbiBiZSBzZXQgdG8gYG51bGxgLlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgd2l0aFNpemUobmV3U2l6ZSkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhTaXplKG5ld1NpemUpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgd2l0aCBwYWRkaW5ncyBzZXQgdG8gdGhlIGdpdmVuIHZhbHVlcy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBoUGFkZGluZyAtIFRoZSBob3Jpem9udGFsIHBhZGRpbmcgZm9yIHRoZSBuZXcgYFRleHRgXG4gICogICBhbmQgYFRleHQuRm9ybWF0YFxuICAqIEBwYXJhbSB7TnVtYmVyfSB2UGFkZGluZyAtIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGBcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICovXG4gIHdpdGhQYWRkaW5ncyhoUGFkZGluZywgdlBhZGRpbmcpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoUGFkZGluZ3MoaFBhZGRpbmcsIHZQYWRkaW5nKTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCBuZXdGb3JtYXQpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgd2hpY2ggaXMgYW4gdXBzaWRlLWRvd24gZXF1aXZhbGVudCBvZiBgdGhpc2BcbiAgKiBhbmQgZ2VuZXJhbGx5IGluIHRoZSBzYW1lIGxvY2F0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIHRleHQgaXMgYXQgdGhlIHNhbWUgbG9jYXRpb24gYXMgYHRoaXNgLCB1c2luZyBhXG4gICogW3JldmVyc2VkXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjcmV2ZXJzZX0gZm9ybWF0IGFuZCBvcmllbnRlZFxuICAqIHRvd2FyZHMgdGhlIFtpbnZlcnNlXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX0gb2YgYGZvcm1hdC5hbmdsZWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgbGV0IHJldmVyc2VGb3JtYXQgPSB0aGlzLmZvcm1hdC5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgcmV2ZXJzZUZvcm1hdCk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGB0aGlzYCBvciBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHRoYXQgd2lsbCBhbHdheXMgYmVcbiAgKiBvcmllbnRlZCB0byBiZSB1cHJpZ2h0IGFuZCByZWFkYWJsZS5cbiAgKlxuICAqIFJldHVybnMgYHRoaXNgIHdoZW4gW2Bmb3JtYXQuYW5nbGVgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjYW5nbGV9IHR1cm5cbiAgKiB2YWx1ZSBpcyBiZXR3ZWVuIF9bMy80LCAxLzQpXywgc2luY2UgYHRoaXNgIGlzIGFuIHVwcmlnaHQgdGV4dCBhbHJlYWR5O1xuICAqIG90aGVyaXdzZSBbYHRoaXMucmV2ZXJzZSgpYF19e0BsaW5rIFJhYy5UZXh0I3JldmVyc2V9IGlzIHJldHVybmVkLlxuICAqXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB1cHJpZ2h0KCkge1xuICAgIGlmICh1dGlscy5pc1VwcmlnaHRUZXh0KHRoaXMuZm9ybWF0LmFuZ2xlLnR1cm4pKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpO1xuICAgIH1cbiAgfVxuXG5cbn0gLy8gY2xhc3MgVGV4dFxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5BbmdsZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNBbmdsZX0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgQW5nbGVgXXtAbGluayBSYWMuQW5nbGV9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuQW5nbGUucXVhcnRlciAvLyByZWFkeS1tYWRlIHF1YXJ0ZXIgYW5nbGVcbiogcmFjLkFuZ2xlLnF1YXJ0ZXIucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkFuZ2xlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBbmdsZShyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG4gIC8vXG4gIC8vIFRoZSBmdW5jdGlvbiBgcmFjLkFuZ2xlYCBpcyBhdHRhY2hlZCBpbiBgYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMuanNgLlxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiBDYWxsc2B7QGxpbmsgUmFjLkFuZ2xlLmZyb219YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcnxSYWMuQW5nbGV8UmFjLlJheXxSYWMuU2VnbWVudH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb20gPSBmdW5jdGlvbihzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21ldGhpbmcpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tUmFkaWFuc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21SYWRpYW5zXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJhZGlhbnNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tUmFkaWFucyA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHJhYywgcmFkaWFucyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIENhbGxzIGB7QGxpbmsgUmFjLkFuZ2xlLmZyb21EZWdyZWVzfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbURlZ3JlZXNcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tRGVncmVlc1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb21EZWdyZWVzID0gZnVuY3Rpb24oZGVncmVlcykge1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAwYC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgcmlnaHRgLCBgcmAsIGBlYXN0YCwgYGVgLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuemVybyA9IHJhYy5BbmdsZSgwLjApO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzJgLlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBsZWZ0YCwgYGxgLCBgd2VzdGAsIGB3YCwgYGludmVyc2VgLlxuICAqXG4gICogQG5hbWUgaGFsZlxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuaGFsZiA9IHJhYy5BbmdsZSgxLzIpO1xuICByYWMuQW5nbGUuaW52ZXJzZSA9IHJhYy5BbmdsZS5oYWxmO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzRgLlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBkb3duYCwgYGRgLCBgYm90dG9tYCwgYGJgLCBgc291dGhgLCBgc2AsIGBzcXVhcmVgLlxuICAqXG4gICogQG5hbWUgcXVhcnRlclxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUucXVhcnRlciA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUuc3F1YXJlID0gIHJhYy5BbmdsZS5xdWFydGVyO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzhgLlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBib3R0b21SaWdodGAsIGBicmAsIGBzZWAuXG4gICpcbiAgKiBAbmFtZSBlaWdodGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmVpZ2h0aCA9ICByYWMuQW5nbGUoMS84KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgNy84YCwgbmVnYXRpdmUgYW5nbGUgb2ZcbiAgKiBbYGVpZ2h0aGBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI2VpZ2h0aH0uXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHRvcFJpZ2h0YCwgYHRyYCwgYG5lYC5cbiAgKlxuICAqIEBuYW1lIG5laWdodGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5laWdodGggPSAgcmFjLkFuZ2xlKC0xLzgpO1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMTZgLlxuICAqXG4gICogQG5hbWUgc2l4dGVlbnRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5zaXh0ZWVudGggPSByYWMuQW5nbGUoMS8xNik7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDMvNGAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHVwYCwgYHVgLCBgdG9wYCwgYHRgLlxuICAqXG4gICogQG5hbWUgbm9ydGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5vcnRoID0gcmFjLkFuZ2xlKDMvNCk7XG4gIHJhYy5BbmdsZS5lYXN0ICA9IHJhYy5BbmdsZSgwLzQpO1xuICByYWMuQW5nbGUuc291dGggPSByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLndlc3QgID0gcmFjLkFuZ2xlKDIvNCk7XG5cbiAgcmFjLkFuZ2xlLmUgPSByYWMuQW5nbGUuZWFzdDtcbiAgcmFjLkFuZ2xlLnMgPSByYWMuQW5nbGUuc291dGg7XG4gIHJhYy5BbmdsZS53ID0gcmFjLkFuZ2xlLndlc3Q7XG4gIHJhYy5BbmdsZS5uID0gcmFjLkFuZ2xlLm5vcnRoO1xuXG4gIHJhYy5BbmdsZS5uZSA9IHJhYy5BbmdsZS5uLmFkZCgxLzgpO1xuICByYWMuQW5nbGUuc2UgPSByYWMuQW5nbGUuZS5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLnN3ID0gcmFjLkFuZ2xlLnMuYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5udyA9IHJhYy5BbmdsZS53LmFkZCgxLzgpO1xuXG4gIC8vIE5vcnRoIG5vcnRoLWVhc3RcbiAgcmFjLkFuZ2xlLm5uZSA9IHJhYy5BbmdsZS5uZS5hZGQoLTEvMTYpO1xuICAvLyBFYXN0IG5vcnRoLWVhc3RcbiAgcmFjLkFuZ2xlLmVuZSA9IHJhYy5BbmdsZS5uZS5hZGQoKzEvMTYpO1xuICAvLyBOb3J0aC1lYXN0IG5vcnRoXG4gIHJhYy5BbmdsZS5uZW4gPSByYWMuQW5nbGUubm5lO1xuICAvLyBOb3J0aC1lYXN0IGVhc3RcbiAgcmFjLkFuZ2xlLm5lZSA9IHJhYy5BbmdsZS5lbmU7XG5cbiAgLy8gRWFzdCBzb3V0aC1lYXN0XG4gIHJhYy5BbmdsZS5lc2UgPSByYWMuQW5nbGUuc2UuYWRkKC0xLzE2KTtcbiAgLy8gU291dGggc291dGgtZWFzdFxuICByYWMuQW5nbGUuc3NlID0gcmFjLkFuZ2xlLnNlLmFkZCgrMS8xNik7XG4gIC8vIFNvdXRoLWVhc3QgZWFzdFxuICByYWMuQW5nbGUuc2VlID0gcmFjLkFuZ2xlLmVzZTtcbiAgLy8gU291dGgtZWFzdCBzb3V0aFxuICByYWMuQW5nbGUuc2VzID0gcmFjLkFuZ2xlLnNzZTtcblxuICAvLyBTb3V0aCBzb3V0aC13ZXN0XG4gIHJhYy5BbmdsZS5zc3cgPSByYWMuQW5nbGUuc3cuYWRkKC0xLzE2KTtcbiAgLy8gV2VzdCBzb3V0aC13ZXN0XG4gIHJhYy5BbmdsZS53c3cgPSByYWMuQW5nbGUuc3cuYWRkKCsxLzE2KTtcbiAgLy8gU291dGgtd2VzdCBzb3V0aFxuICByYWMuQW5nbGUuc3dzID0gcmFjLkFuZ2xlLnNzdztcbiAgLy8gU291dGgtd2VzdCB3ZXN0XG4gIHJhYy5BbmdsZS5zd3cgPSByYWMuQW5nbGUud3N3O1xuXG4gIC8vIFdlc3Qgbm9ydGgtd2VzdFxuICByYWMuQW5nbGUud253ID0gcmFjLkFuZ2xlLm53LmFkZCgtMS8xNik7XG4gIC8vIE5vcnRoIG5vcnRoLXdlc3RcbiAgcmFjLkFuZ2xlLm5udyA9IHJhYy5BbmdsZS5udy5hZGQoKzEvMTYpO1xuICAvLyBOb3J0LWh3ZXN0IHdlc3RcbiAgcmFjLkFuZ2xlLm53dyA9IHJhYy5BbmdsZS53bnc7XG4gIC8vIE5vcnRoLXdlc3Qgbm9ydGhcbiAgcmFjLkFuZ2xlLm53biA9IHJhYy5BbmdsZS5ubnc7XG5cbiAgcmFjLkFuZ2xlLnJpZ2h0ID0gcmFjLkFuZ2xlLmU7XG4gIHJhYy5BbmdsZS5kb3duICA9IHJhYy5BbmdsZS5zO1xuICByYWMuQW5nbGUubGVmdCAgPSByYWMuQW5nbGUudztcbiAgcmFjLkFuZ2xlLnVwICAgID0gcmFjLkFuZ2xlLm47XG5cbiAgcmFjLkFuZ2xlLnIgPSByYWMuQW5nbGUucmlnaHQ7XG4gIHJhYy5BbmdsZS5kID0gcmFjLkFuZ2xlLmRvd247XG4gIHJhYy5BbmdsZS5sID0gcmFjLkFuZ2xlLmxlZnQ7XG4gIHJhYy5BbmdsZS51ID0gcmFjLkFuZ2xlLnVwO1xuXG4gIHJhYy5BbmdsZS50b3AgICAgPSByYWMuQW5nbGUudXA7XG4gIHJhYy5BbmdsZS5ib3R0b20gPSByYWMuQW5nbGUuZG93bjtcbiAgcmFjLkFuZ2xlLnQgICAgICA9IHJhYy5BbmdsZS50b3A7XG4gIHJhYy5BbmdsZS5iICAgICAgPSByYWMuQW5nbGUuYm90dG9tO1xuXG4gIHJhYy5BbmdsZS50b3BSaWdodCAgICA9IHJhYy5BbmdsZS5uZTtcbiAgcmFjLkFuZ2xlLnRyICAgICAgICAgID0gcmFjLkFuZ2xlLm5lO1xuICByYWMuQW5nbGUudG9wTGVmdCAgICAgPSByYWMuQW5nbGUubnc7XG4gIHJhYy5BbmdsZS50bCAgICAgICAgICA9IHJhYy5BbmdsZS5udztcbiAgcmFjLkFuZ2xlLmJvdHRvbVJpZ2h0ID0gcmFjLkFuZ2xlLnNlO1xuICByYWMuQW5nbGUuYnIgICAgICAgICAgPSByYWMuQW5nbGUuc2U7XG4gIHJhYy5BbmdsZS5ib3R0b21MZWZ0ICA9IHJhYy5BbmdsZS5zdztcbiAgcmFjLkFuZ2xlLmJsICAgICAgICAgID0gcmFjLkFuZ2xlLnN3O1xuXG59IC8vIGF0dGFjaFJhY0FuZ2xlXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuQXJjYCBmdW5jdGlvbl17QGxpbmsgUmFjI0FyY30uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgQXJjYCBvYmplY3RzXXtAbGluayBSYWMuQXJjfSBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5BcmMuemVybyAvLyByZWFkeS1tYWRlIHplcm8gYXJjXG4qIHJhYy5BcmMuemVyby5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQXJjXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBcmMocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5BcmNgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogQSBjbG9ja3dpc2UgYEFyY2Agd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQXJjfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BcmMjXG4gICovXG4gIHJhYy5BcmMuemVybyA9IHJhYy5BcmMoMCwgMCwgMCwgMCwgMCwgdHJ1ZSk7XG5cbn0gLy8gYXR0YWNoUmFjQXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5CZXppZXJgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkJlemllcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkJlemllclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VCZXppZXIocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5CZXppZXJgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogQSBgQmV6aWVyYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5CZXppZXJ9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkJlemllciNcbiAgKi9cbiAgcmFjLkJlemllci56ZXJvID0gcmFjLkJlemllcihcbiAgICAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDApO1xuXG59IC8vIGF0dGFjaEluc3RhbmNlQmV6aWVyXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuUG9pbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjUG9pbnR9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYFBvaW50YF17QGxpbmsgUmFjLlBvaW50fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlBvaW50Lm9yaWdpbiAvLyByZWFkeS1tYWRlIG9yaWdpbiBwb2ludFxuKiByYWMuUG9pbnQub3JpZ2luLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Qb2ludFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5Qb2ludGAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGBQb2ludGAgd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuemVybyA9IHJhYy5Qb2ludCgwLCAwKTtcblxuICAvKipcbiAgKiBBIGBQb2ludGAgYXQgYCgwLCAwKWAuXG4gICpcbiAgKiBFcXVhbCB0byBbYHJhYy5Qb2ludC56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb30uXG4gICpcbiAgKiBAbmFtZSBvcmlnaW5cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lm9yaWdpbiA9IHJhYy5Qb2ludC56ZXJvO1xuXG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5SYXlgIGZ1bmN0aW9uXXtAbGluayBSYWMjUmF5fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BSYXlgXXtAbGluayBSYWMuUmF5fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlJheS54QXhpcyAvLyByZWFkeS1tYWRlIHgtYXhpcyByYXlcbiogcmFjLlJheS54QXhpcy5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUmF5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNSYXkocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5SYXlgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogQSBgUmF5YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfSBhbmQgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99LlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICovXG4gIHJhYy5SYXkuemVybyA9IHJhYy5SYXkoMCwgMCwgcmFjLkFuZ2xlLnplcm8pO1xuXG5cbiAgLyoqXG4gICogQSBgUmF5YCBvdmVyIHRoZSB4LWF4aXMsIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lm9yaWdpbmBde0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn0gYW5kIHBvaW50cyB0b1xuICAqIFtgcmFjLkFuZ2xlLnplcm9gXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfS5cbiAgKlxuICAqIEVxdWFsIHRvIFtgcmFjLlJheS56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUmF5I3plcm99LlxuICAqXG4gICogQG5hbWUgeEF4aXNcbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqL1xuICByYWMuUmF5LnhBeGlzID0gcmFjLlJheS56ZXJvO1xuXG5cbiAgLyoqXG4gICogQSBgUmF5YCBvdmVyIHRoZSB5LWF4aXMsIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lm9yaWdpbmBde0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn0gYW5kIHBvaW50cyB0b1xuICAqIFtgcmFjLkFuZ2xlLnF1YXJ0ZXJgXXtAbGluayBpbnN0YW5jZS5BbmdsZSNxdWFydGVyfS5cbiAgKlxuICAqIEBuYW1lIHlBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKi9cbiAgcmFjLlJheS55QXhpcyA9IHJhYy5SYXkoMCwgMCwgcmFjLkFuZ2xlLnF1YXJ0ZXIpO1xuXG59IC8vIGF0dGFjaFJhY1JheVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlNlZ21lbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjU2VnbWVudH0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgU2VnbWVudGBde0BsaW5rIFJhYy5TZWdtZW50fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoXG4qIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlNlZ21lbnQuemVybyAvLyByZWFkeS1tYWRlIHplcm8gc2VnbWVudFxuKiByYWMuU2VnbWVudC56ZXJvLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5TZWdtZW50XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNTZWdtZW50KHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbiAgLy9cbiAgLy8gVGhlIGZ1bmN0aW9uIGByYWMuU2VnbWVudGAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGBTZWdtZW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfSwgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99LCBhbmQgaGFzIGEgbGVuZ3RoIG9mXG4gICogemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlNlZ21lbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50Lnplcm8gPSByYWMuU2VnbWVudCgwLCAwLCAwLCAwKTtcblxufSAvLyBhdHRhY2hSYWNTZWdtZW50XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuVGV4dGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuVGV4dC5oZWxsbyAvLyByZWFkeS1tYWRlIGhlbGxvLXdvcmxkIHRleHRcbiogcmFjLlRleHQuaGVsbG8ucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5UZXh0YCBpcyBhdHRhY2hlZCBpbiBgYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMuanNgLlxuXG4vLyBSRUxFQVNFLVRPRE86IHNlcGFyYXRlIHRvIGl0cyBvd24gZmlsZT9cbiAgLyoqXG4gICogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiAgKiBbYHJhYy5UZXh0LkZvcm1hdGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0Rm9ybWF0fS5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4gICogW2BUZXh0LkZvcm1hdGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdH0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGxcbiAgKiBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCAvLyByZWFkeS1tYWRlIHRvcC1sZWZ0IHRleHQgZm9ybWF0XG4gICogcmFjLlRleHQuRm9ybWF0LnRvcExlZnQucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQG5hbWVzcGFjZSBpbnN0YW5jZS5UZXh0LkZvcm1hdFxuICAqL1xuXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBUb3BzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0byB0aGVcbiAgKiB0b3AtbGVmdCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGB0bGAuXG4gICpcbiAgKiBAbmFtZSB0b3BMZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3ApO1xuICByYWMuVGV4dC5Gb3JtYXQudGwgPSByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdDtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBjZW50ZXItbGVmdCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGB0Y2AuXG4gICpcbiAgKiBAbmFtZSB0b3BDZW50ZXJcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LnRvcENlbnRlciA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmNlbnRlcixcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3ApO1xuICByYWMuVGV4dC5Gb3JtYXQudGMgPSByYWMuVGV4dC5Gb3JtYXQudG9wQ2VudGVyO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGNlbnRlci1yaWdodCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGB0cmAuXG4gICpcbiAgKiBAbmFtZSB0b3BSaWdodFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQudG9wUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3ApO1xuICByYWMuVGV4dC5Gb3JtYXQudHIgPSByYWMuVGV4dC5Gb3JtYXQudG9wUmlnaHQ7XG5cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENlbnRlcnMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGNlbnRlci1sZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGNsYC5cbiAgKlxuICAqIEBuYW1lIGNlbnRlckxlZnRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmNlbnRlckxlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcik7XG4gIHJhYy5UZXh0LkZvcm1hdC5jbCA9IHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJMZWZ0O1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGNlbnRlciBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgY2NgLCBgY2VudGVyZWRgLlxuICAqXG4gICogQG5hbWUgY2VudGVyQ2VudGVyXG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJDZW50ZXIgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5jZW50ZXIsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcbiAgcmFjLlRleHQuRm9ybWF0LmNlbnRlcmVkID0gcmFjLlRleHQuRm9ybWF0LmNlbnRlckNlbnRlcjtcbiAgcmFjLlRleHQuRm9ybWF0LmNjICAgICAgID0gcmFjLlRleHQuRm9ybWF0LmNlbnRlckNlbnRlcjtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBjZW50ZXItcmlnaHQgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGNyYC5cbiAgKlxuICAqIEBuYW1lIGNlbnRlclJpZ2h0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJSaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcik7XG4gIHJhYy5UZXh0LkZvcm1hdC5jciA9IHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJSaWdodDtcblxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQm90dG9tcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgYm90dG9tLWxlZnQgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJsYC5cbiAgKlxuICAqIEBuYW1lIGJvdHRvbUxlZnRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJvdHRvbUxlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJvdHRvbSk7XG4gIHJhYy5UZXh0LkZvcm1hdC5ibCA9IHJhYy5UZXh0LkZvcm1hdC5ib3R0b21MZWZ0O1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGJvdHRvbS1jZW50ZXIgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJjYC5cbiAgKlxuICAqIEBuYW1lIGJvdHRvbUNlbnRlclxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYm90dG9tQ2VudGVyID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24uY2VudGVyLFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJvdHRvbSk7XG4gIHJhYy5UZXh0LkZvcm1hdC5iYyA9IHJhYy5UZXh0LkZvcm1hdC5ib3R0b21DZW50ZXI7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgYm90dG9tLXJpZ2h0IG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBicmAuXG4gICpcbiAgKiBAbmFtZSBib3R0b21SaWdodFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYm90dG9tUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20pO1xuICByYWMuVGV4dC5Gb3JtYXQuYnIgPSByYWMuVGV4dC5Gb3JtYXQuYm90dG9tUmlnaHQ7XG5cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEJhc2VsaW5lcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGJhc2VsaW5lIGFuZCBsZWZ0IG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBibGxgLlxuICAqXG4gICogQG5hbWUgYmFzZWxpbmVMZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5iYXNlbGluZUxlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJhc2VsaW5lKTtcbiAgcmFjLlRleHQuRm9ybWF0LmJsbCA9IHJhYy5UZXh0LkZvcm1hdC5iYXNlbGluZUxlZnQ7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgYmFzZWxpbmUgYW5kIGNlbnRlciBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYmxjYC5cbiAgKlxuICAqIEBuYW1lIGJhc2VsaW5lQ2VudGVyXG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5iYXNlbGluZUNlbnRlciA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmNlbnRlcixcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5iYXNlbGluZSk7XG4gIHJhYy5UZXh0LkZvcm1hdC5ibGMgPSByYWMuVGV4dC5Gb3JtYXQuYmFzZWxpbmVDZW50ZXI7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgYmFzZWxpbmUgYW5kIHJpZ2h0IG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBibHJgLlxuICAqXG4gICogQG5hbWUgYmFzZWxpbmVSaWdodFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYmFzZWxpbmVSaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJhc2VsaW5lKTtcbiAgcmFjLlRleHQuRm9ybWF0LmJsciA9IHJhYy5UZXh0LkZvcm1hdC5iYXNlbGluZVJpZ2h0O1xuXG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgYGhlbGxvIHdvcmxkYCB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXRcbiAgKiBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgaGVsbG9cbiAgKiBAdHlwZSB7UmFjLlRleHR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LmhlbGxvID0gcmFjLlRleHQoMCwgMCwgJ2hlbGxvIHdvcmxkIScpO1xuXG4gIC8qKlxuICAqIEEgYFRleHRgIGZvciBkcmF3aW5nIHRoZSBwYW5ncmFtIGBzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3dgXG4gICogd2l0aCBgdG9wTGVmdGAgZm9ybWF0IGF0IGBQb2ludC56ZXJvYC5cbiAgKiBAbmFtZSBzcGhpbnhcbiAgKiBAdHlwZSB7UmFjLlRleHR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LnNwaGlueCA9IHJhYy5UZXh0KDAsIDAsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3cnKTtcblxufSAvLyBhdHRhY2hSYWNUZXh0XG5cbiIsIlxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3RlbXBsYXRlcy9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbWRqcy9hbWRqcy1hcGkvYmxvYi9tYXN0ZXIvQU1ELm1kXG4gICAgLy8gaHR0cHM6Ly9yZXF1aXJlanMub3JnL2RvY3Mvd2h5YW1kLmh0bWxcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIEFNRCAtIGRlZmluZToke3R5cGVvZiBkZWZpbmV9YCk7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIE5vZGUgLSBtb2R1bGU6JHt0eXBlb2YgbW9kdWxlfWApO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG5cbiAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGludG8gc2VsZiAtIHJvb3Q6JHt0eXBlb2Ygcm9vdH1gKTtcbiAgcm9vdC5SYWMgPSBmYWN0b3J5KCk7XG5cbn0odHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4gcmVxdWlyZSgnLi9SYWMnKTtcblxufSkpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRHJhd2VyIHRoYXQgdXNlcyBhIFtQNV0oaHR0cHM6Ly9wNWpzLm9yZy8pIGluc3RhbmNlIGZvciBhbGwgZHJhd2luZ1xuKiBvcGVyYXRpb25zLlxuKlxuKiBAYWxpYXMgUmFjLlA1RHJhd2VyXG4qL1xuY2xhc3MgUDVEcmF3ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgcDUpe1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMucDUgPSBwNTtcbiAgICB0aGlzLmRyYXdSb3V0aW5lcyA9IFtdO1xuICAgIHRoaXMuZGVidWdSb3V0aW5lcyA9IFtdO1xuICAgIHRoaXMuYXBwbHlSb3V0aW5lcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB1c2VkIGZvciBkZWJ1ZyBkcmF3aW5nLCB3aGVuIGBudWxsYCB0aGUgc3R5bGUgYWxyZWFkeSBhcHBsaWVkXG4gICAgKiBpcyB1c2VkLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRlYnVnU3R5bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB1c2VkIGZvciB0ZXh0IGZvciBkZWJ1ZyBkcmF3aW5nLCB3aGVuIGBudWxsYCB0aGUgc3R5bGUgYWxyZWFkeVxuICAgICogYXBwbGllZCBpcyB1c2VkLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRlYnVnVGV4dFN0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU2V0dGluZ3MgdXNlZCBieSB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgZHJhd2FibGUuZGVidWcoKWAuXG4gICAgKlxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZvbnQ9J21vbm9zcGFjZSdcbiAgICAqICAgRm9udCB0byB1c2Ugd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gW3NpemU9W3JhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZV17QGxpbmsgUmFjI3RleHRGb3JtYXREZWZhdWx0c31dXG4gICAgKiAgIEZvbnQgc2l6ZSB0byB1c2Ugd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gZml4ZWREaWdpdHM9MlxuICAgICogICBOdW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gcHJpbnQgd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKlxuICAgICogQHR5cGUge09iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdUZXh0T3B0aW9ucyA9IHtcbiAgICAgIGZvbnQ6ICdtb25vc3BhY2UnLFxuICAgICAgLy8gVE9ETzogZG9jdW1lbnRhdGlvbiBkaXNwbGF5cyB0aGlzIGFzIGJlaW5nIG9wdGlvbmFsXG4gICAgICAvLyBpbiBvcmRlciB0byBtYWtlIHRoZSBsaW5rIHdvcmsgaXQgaGFzIHRvIGJlIHdyYXBwZWQgaW4gW10sXG4gICAgICAvLyB3aGljaCBtYWtlcyBpdCBhbiBvcHRpb25hbFxuICAgICAgc2l6ZTogcmFjLnRleHRGb3JtYXREZWZhdWx0cy5zaXplLFxuICAgICAgZml4ZWREaWdpdHM6IDJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKiBSYWRpdXMgb2YgcG9pbnQgbWFya2VycyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAyMlxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1BvaW50UmFkaXVzID0gNTtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHRoZSBtYWluIHZpc3VhbCBlbGVtZW50cyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAyMlxuICAgICovXG4gICAgdGhpcy5kZWJ1Z01hcmtlclJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBGYWN0b3IgYXBwbGllZCB0byBzdHJva2Ugd2VpZ2h0IHNldHRpbmcuIFN0cm9rZSB3ZWlnaHQgaXMgc2V0IHRvXG4gICAgKiBgc3Ryb2tlLndlaWdodCAqIHN0cm9rZVdlaWdodEZhY3RvcmAgd2hlbiBhcHBsaWNhYmxlLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnN0cm9rZVdlaWdodEZhY3RvciA9IDE7XG5cbiAgICB0aGlzLnNldHVwQWxsRHJhd0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxBcHBseUZ1bmN0aW9ucygpO1xuICAgIC8vIFRPRE86IGFkZCBhIGN1c3RvbWl6ZWQgZnVuY3Rpb24gZm9yIG5ldyBjbGFzc2VzIVxuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIHRoZSBnaXZlbiBgZHJhd0Z1bmN0aW9uYCB0byBwZXJmb3JtIHRoZSBkcmF3aW5nIGZvciBpbnN0YW5jZXMgb2ZcbiAgKiBjbGFzcyBgZHJhd2FibGVDbGFzc2AuXG4gICpcbiAgKiBgZHJhd0Z1bmN0aW9uYCBpcyBleHBlY3RlZCB0byBoYXZlIHRoZSBzaWduYXR1cmU6XG4gICogYGBgXG4gICogZHJhd0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcylcbiAgKiBgYGBcbiAgKiArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAqICsgYG9iamVjdE9mQ2xhc3M6IGRyYXdhYmxlQ2xhc3NgIC0gSW5zdGFuY2Ugb2YgYGRyYXdhYmxlQ2xhc3NgIHRvIGRyYXdcbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyBvZiB0aGUgaW5zdGFuY2VzIHRvIGRyYXdcbiAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkcmF3RnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGRyYXdpbmdcbiAgKi9cbiAgc2V0RHJhd0Z1bmN0aW9uKGRyYXdhYmxlQ2xhc3MsIGRyYXdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gZHJhd2FibGVDbGFzcyk7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERyYXdSb3V0aW5lKGRyYXdhYmxlQ2xhc3MsIGRyYXdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRyYXdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIHNldERyYXdPcHRpb25zKGNsYXNzT2JqLCBvcHRpb25zKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlcXVpcmVzUHVzaFBvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9IG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wO1xuICAgIH1cbiAgfVxuXG5cbiAgc2V0Q2xhc3NEcmF3U3R5bGUoY2xhc3NPYmosIHN0eWxlKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIHJvdXRpbmUuc3R5bGUgPSBzdHlsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZ2l2ZW4gYGRlYnVnRnVuY3Rpb25gIHRvIHBlcmZvcm0gdGhlIGRlYnVnLWRyYXdpbmcgZm9yXG4gICogaW5zdGFuY2VzIG9mIGNsYXNzIGBkcmF3YWJsZUNsYXNzYC5cbiAgKlxuICAqIFdoZW4gYSBkcmF3YWJsZSBjbGFzcyBkb2VzIG5vdCBoYXZlIGEgYGRlYnVnRnVuY3Rpb25gIHNldHVwLCBjYWxsaW5nXG4gICogYGRyYXdhYmxlLmRlYnVnKClgIHNpbXBseSBjYWxscyBgZHJhdygpYCB3aXRoXG4gICogYFtkZWJ1Z1N0eWxlXXtAbGluayBSYWMuUDVEcmF3ZXIjZGVidWdTdHlsZX1gIGFwcGxpZWQuXG4gICpcbiAgKiBgZGVidWdGdW5jdGlvbmAgaXMgZXhwZWN0ZWQgdG8gaGF2ZSB0aGUgc2lnbmF0dXJlOlxuICAqIGBgYFxuICAqIGRlYnVnRnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzLCBkcmF3c1RleHQpXG4gICogYGBgXG4gICogKyBgZHJhd2VyOiBQNURyYXdlcmAgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmdcbiAgKiArIGBvYmplY3RPZkNsYXNzOiBkcmF3YWJsZUNsYXNzYCAtIEluc3RhbmNlIG9mIGBkcmF3YWJsZUNsYXNzYCB0byBkcmF3XG4gICogKyBgZHJhd3NUZXh0OiBib29sYCAtIFdoZW4gYHRydWVgIHRleHQgc2hvdWxkIGJlIGRyYXduIHdpdGhcbiAgKiAgICBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtjbGFzc30gZHJhd2FibGVDbGFzcyAtIENsYXNzIG9mIHRoZSBpbnN0YW5jZXMgdG8gZHJhd1xuICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlYnVnRnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGRlYnVnLWRyYXdpbmdcbiAgKi9cbiAgc2V0RGVidWdGdW5jdGlvbihkcmF3YWJsZUNsYXNzLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gZHJhd2FibGVDbGFzcyk7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERlYnVnUm91dGluZShkcmF3YWJsZUNsYXNzLCBkZWJ1Z0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZGVidWdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cblxuICAvLyBBZGRzIGEgQXBwbHlSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldEFwcGx5RnVuY3Rpb24oY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IEFwcGx5Um91dGluZShjbGFzc09iaiwgYXBwbHlGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5hcHBseVJvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVJvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIGRyYXdPYmplY3Qob2JqZWN0LCBzdHlsZSA9IG51bGwpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBkcmF3IG9iamVjdCAtIG9iamVjdC10eXBlOiR7dXRpbHMudHlwZU5hbWUob2JqZWN0KX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0VG9EcmF3O1xuICAgIH1cblxuICAgIGlmIChyb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9PT0gdHJ1ZVxuICAgICAgfHwgc3R5bGUgIT09IG51bGxcbiAgICAgIHx8IHJvdXRpbmUuc3R5bGUgIT09IG51bGwpXG4gICAge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICBpZiAocm91dGluZS5zdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICByb3V0aW5lLnN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwdXNoLXB1bGxcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgfVxuICB9XG5cblxuICBkZWJ1Z09iamVjdChvYmplY3QsIGRyYXdzVGV4dCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHJvdXRpbmUsIGp1c3QgZHJhdyBvYmplY3Qgd2l0aCBkZWJ1ZyBzdHlsZVxuICAgICAgdGhpcy5kcmF3T2JqZWN0KG9iamVjdCwgdGhpcy5kZWJ1Z1N0eWxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIHRoaXMuZGVidWdTdHlsZS5hcHBseSgpO1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uKHRoaXMsIG9iamVjdCwgZHJhd3NUZXh0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgfVxuICB9XG5cblxuICBhcHBseU9iamVjdChvYmplY3QpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuYXBwbHlSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgYXBwbHkgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0FwcGx5O1xuICAgIH1cblxuICAgIHJvdXRpbmUuYXBwbHlGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICB9XG5cblxuICAvLyBTZXRzIHVwIGFsbCBkcmF3aW5nIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGFuZCBzdGF0aWMgZnVuY3Rpb25zIGluIHJlbGV2YW50XG4gIC8vIGNsYXNzZXMuXG4gIHNldHVwQWxsRHJhd0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kcmF3LmZ1bmN0aW9ucycpO1xuXG4gICAgLy8gUG9pbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kcmF3UG9pbnQpO1xuICAgIHJlcXVpcmUoJy4vUG9pbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gUmF5XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRyYXdSYXkpO1xuICAgIHJlcXVpcmUoJy4vUmF5LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFNlZ21lbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRyYXdTZWdtZW50KTtcbiAgICByZXF1aXJlKCcuL1NlZ21lbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gQXJjXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRyYXdBcmMpO1xuXG4gICAgUmFjLkFyYy5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgICAgbGV0IGJlemllcnNQZXJUdXJuID0gNTtcbiAgICAgIGxldCBkaXZpc2lvbnMgPSBNYXRoLmNlaWwoYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgKiBiZXppZXJzUGVyVHVybik7XG4gICAgICB0aGlzLmRpdmlkZVRvQmV6aWVycyhkaXZpc2lvbnMpLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBUZXh0XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlRleHQsIGZ1bmN0aW9ucy5kcmF3VGV4dCk7XG4gICAgLy8gVGV4dCBkcmF3aW5nIHVzZXMgYHRleHQuZm9ybWF0LmFwcGx5YCwgd2hpY2ggdHJhbnNsYXRlIGFuZCByb3RhdGlvblxuICAgIC8vIG1vZGlmaWNhdGlvbnMgdG8gdGhlIGRyYXdpbmcgbWF0cml4XG4gICAgLy8gdGhpcyByZXF1aXJlcyBhIHB1c2gtcG9wIG9uIGV2ZXJ5IGRyYXdcbiAgICB0aGlzLnNldERyYXdPcHRpb25zKFJhYy5UZXh0LCB7cmVxdWlyZXNQdXNoUG9wOiB0cnVlfSk7XG5cbiAgICAvLyBCZXppZXJcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQmV6aWVyLCAoZHJhd2VyLCBiZXppZXIpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZXppZXIoXG4gICAgICAgIGJlemllci5zdGFydC54LCBiZXppZXIuc3RhcnQueSxcbiAgICAgICAgYmV6aWVyLnN0YXJ0QW5jaG9yLngsIGJlemllci5zdGFydEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kQW5jaG9yLngsIGJlemllci5lbmRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZC54LCBiZXppZXIuZW5kLnkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkJlemllci5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0YXJ0LnZlcnRleCgpXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuYmV6aWVyVmVydGV4KFxuICAgICAgICB0aGlzLnN0YXJ0QW5jaG9yLngsIHRoaXMuc3RhcnRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmRBbmNob3IueCwgdGhpcy5lbmRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmQueCwgdGhpcy5lbmQueSk7XG4gICAgfTtcblxuICAgIC8vIENvbXBvc2l0ZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Db21wb3NpdGUsIChkcmF3ZXIsIGNvbXBvc2l0ZSkgPT4ge1xuICAgICAgY29tcG9zaXRlLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG4gICAgfSk7XG5cbiAgICBSYWMuQ29tcG9zaXRlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0udmVydGV4KCkpO1xuICAgIH07XG5cbiAgICAvLyBTaGFwZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TaGFwZSwgKGRyYXdlciwgc2hhcGUpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZWdpblNoYXBlKCk7XG4gICAgICBzaGFwZS5vdXRsaW5lLnZlcnRleCgpO1xuXG4gICAgICBpZiAoc2hhcGUuY29udG91ci5pc05vdEVtcHR5KCkpIHtcbiAgICAgICAgZHJhd2VyLnA1LmJlZ2luQ29udG91cigpO1xuICAgICAgICBzaGFwZS5jb250b3VyLnZlcnRleCgpO1xuICAgICAgICBkcmF3ZXIucDUuZW5kQ29udG91cigpO1xuICAgICAgfVxuICAgICAgZHJhd2VyLnA1LmVuZFNoYXBlKCk7XG4gICAgfSk7XG5cbiAgICBSYWMuU2hhcGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vdXRsaW5lLnZlcnRleCgpO1xuICAgICAgdGhpcy5jb250b3VyLnZlcnRleCgpO1xuICAgIH07XG4gIH0gLy8gc2V0dXBBbGxEcmF3RnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBkZWJ1ZyByb3V0aW5lcyBmb3IgcmFjIGRyYXdhYmxlIGNsYXNlcy5cbiAgc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kZWJ1Zy5mdW5jdGlvbnMnKTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlBvaW50LCBmdW5jdGlvbnMuZGVidWdQb2ludCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5SYXksIGZ1bmN0aW9ucy5kZWJ1Z1JheSk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5TZWdtZW50LCBmdW5jdGlvbnMuZGVidWdTZWdtZW50KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRlYnVnQXJjKTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlRleHQsIGZ1bmN0aW9ucy5kZWJ1Z1RleHQpO1xuXG4gICAgUmFjLkFuZ2xlLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKHBvaW50LCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgY29uc3QgZHJhd2VyID0gdGhpcy5yYWMuZHJhd2VyO1xuICAgICAgaWYgKGRyYXdlci5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5wdXNoKCk7XG4gICAgICAgIGRyYXdlci5kZWJ1Z1N0eWxlLmFwcGx5KCk7XG4gICAgICAgIC8vIFRPRE86IGNvdWxkIHRoaXMgYmUgYSBnb29kIG9wdGlvbiB0byBpbXBsZW1lbnQgc3BsYXR0aW5nIGFyZ3VtZW50c1xuICAgICAgICAvLyBpbnRvIHRoZSBkZWJ1Z0Z1bmN0aW9uP1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgICBkcmF3ZXIucDUucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFJhYy5Qb2ludC5wcm90b3R5cGUuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICAgIGFuZ2xlLmRlYnVnKHRoaXMsIGRyYXdzVGV4dCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9IC8vIHNldHVwQWxsRGVidWdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGFwcGx5aW5nIHJvdXRpbmVzIGZvciByYWMgc3R5bGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGZ1bmN0aW9ucyBpbiByZWxldmFudCBjbGFzc2VzLlxuICBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCkge1xuICAgIC8vIENvbG9yIHByb3RvdHlwZSBmdW5jdGlvbnNcbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5QmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJhY2tncm91bmQodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuZmlsbCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5U3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuc3Ryb2tlKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIC8vIFN0cm9rZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3Ryb2tlLCAoZHJhd2VyLCBzdHJva2UpID0+IHtcbiAgICAgIGlmIChzdHJva2Uud2VpZ2h0ID09PSBudWxsICYmIHN0cm9rZS5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9TdHJva2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLmNvbG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0cm9rZS5jb2xvci5hcHBseVN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUuc3Ryb2tlV2VpZ2h0KHN0cm9rZS53ZWlnaHQgKiBkcmF3ZXIuc3Ryb2tlV2VpZ2h0RmFjdG9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZpbGxcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLkZpbGwsIChkcmF3ZXIsIGZpbGwpID0+IHtcbiAgICAgIGlmIChmaWxsLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5ub0ZpbGwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaWxsLmNvbG9yLmFwcGx5RmlsbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3R5bGVDb250YWluZXJcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0eWxlQ29udGFpbmVyLCAoZHJhd2VyLCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5hcHBseSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBUZXh0LkZvcm1hdFxuICAgIC8vIEFwcGxpZXMgYWxsIHRleHQgcHJvcGVydGllcyBhbmQgdHJhbnNsYXRlcyB0byB0aGUgZ2l2ZW4gYHBvaW50YC5cbiAgICAvLyBBZnRlciB0aGUgZm9ybWF0IGlzIGFwcGxpZWQgdGhlIHRleHQgc2hvdWxkIGJlIGRyYXduIGF0IHRoZSBvcmlnaW4uXG4gICAgLy9cbiAgICAvLyBDYWxsaW5nIHRoaXMgZnVuY3Rpb24gcmVxdWlyZXMgYSBwdXNoLXBvcCB0byB0aGUgZHJhd2luZyBzdHlsZVxuICAgIC8vIHNldHRpbmdzIHNpbmNlIHRyYW5zbGF0ZSBhbmQgcm90YXRpb24gbW9kaWZpY2F0aW9ucyBhcmUgbWFkZSB0byB0aGVcbiAgICAvLyBkcmF3aW5nIG1hdHJpeC4gT3RoZXJ3aXNlIGFsbCBvdGhlciBzdWJzZXF1ZW50IGRyYXdpbmcgd2lsbCBiZVxuICAgIC8vIGltcGFjdGVkLlxuICAgIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbihwb2ludCkge1xuICAgICAgbGV0IGhBbGlnbjtcbiAgICAgIGxldCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gICAgICBzd2l0Y2ggKHRoaXMuaEFsaWduKSB7XG4gICAgICAgIGNhc2UgaEVudW0ubGVmdDogICBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuTEVGVDsgICBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5jZW50ZXI6IGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5DRU5URVI7IGJyZWFrO1xuICAgICAgICBjYXNlIGhFbnVtLnJpZ2h0OiAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlJJR0hUOyAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBoQWxpZ24gY29uZmlndXJhdGlvbiAtIGhBbGlnbjoke3RoaXMuaEFsaWdufWApO1xuICAgICAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICAgIH1cblxuICAgICAgbGV0IHZBbGlnbjtcbiAgICAgIGxldCB2RW51bSA9IFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduO1xuICAgICAgc3dpdGNoICh0aGlzLnZBbGlnbikge1xuICAgICAgICBjYXNlIHZFbnVtLnRvcDogICAgICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuVE9QOyAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTogICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQk9UVE9NOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjogICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOiB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQkFTRUxJTkU7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgdkFsaWduIGNvbmZpZ3VyYXRpb24gLSB2QWxpZ246JHt0aGlzLnZBbGlnbn1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIC8vIEFsaWduXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dEFsaWduKGhBbGlnbiwgdkFsaWduKTtcblxuICAgICAgLy8gU2l6ZVxuICAgICAgY29uc3QgdGV4dFNpemUgPSB0aGlzLnNpemUgPz8gdGhpcy5yYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemU7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dFNpemUodGV4dFNpemUpO1xuXG4gICAgICAvLyBGb250XG4gICAgICBjb25zdCB0ZXh0Rm9udCA9IHRoaXMuZm9udCA/PyB0aGlzLnJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuZm9udDtcbiAgICAgIGlmICh0ZXh0Rm9udCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dEZvbnQodGV4dEZvbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbmluZ1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRyYW5zbGF0ZShwb2ludC54LCBwb2ludC55KTtcblxuICAgICAgLy8gUm90YXRpb25cbiAgICAgIGlmICh0aGlzLmFuZ2xlLnR1cm4gIT09IDApIHtcbiAgICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnJvdGF0ZSh0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBhZGRpbmdcbiAgICAgIGxldCB4UGFkID0gMDtcbiAgICAgIGxldCB5UGFkID0gMDtcblxuICAgICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgICBjYXNlIGhFbnVtLmxlZnQ6ICAgeFBhZCArPSB0aGlzLmhQYWRkaW5nOyBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5jZW50ZXI6IHhQYWQgKz0gdGhpcy5oUGFkZGluZzsgYnJlYWs7XG4gICAgICAgIGNhc2UgaEVudW0ucmlnaHQ6ICB4UGFkIC09IHRoaXMuaFBhZGRpbmc7IGJyZWFrO1xuICAgICAgfVxuICAgICAgc3dpdGNoICh0aGlzLnZBbGlnbikge1xuICAgICAgICBjYXNlIHZFbnVtLnRvcDogICAgICB5UGFkICs9IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjogICB5UGFkICs9IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOiB5UGFkICs9IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTogICB5UGFkIC09IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoeFBhZCAhPT0gMCB8fCB5UGFkICE9PSAwKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50cmFuc2xhdGUoeFBhZCwgeVBhZCk7XG4gICAgICB9XG4gICAgfSAvLyBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5XG5cbiAgfSAvLyBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zXG5cbn0gLy8gY2xhc3MgUDVEcmF3ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBQNURyYXdlcjtcblxuXG4vLyBDb250YWlucyB0aGUgZHJhd2luZyBmdW5jdGlvbiBhbmQgb3B0aW9ucyBmb3IgZHJhd2luZyBvYmplY3RzIG9mIGFcbi8vIHNwZWNpZmljIGNsYXNzLlxuLy9cbi8vIEFuIGluc3RhbmNlIGlzIGNyZWF0ZWQgZm9yIGVhY2ggZHJhd2FibGUgY2xhc3MgdGhhdCB0aGUgZHJhd2VyIGNhblxuLy8gc3VwcG9ydCwgd2hpY2ggY29udGFpbnMgYWxsIHRoZSBzZXR0aW5ncyBuZWVkZWQgZm9yIGRyYXdpbmcuXG5jbGFzcyBEcmF3Um91dGluZSB7XG5cbiAgLy8gVE9ETzogUmVuYW1lIHRvIGRyYXdhYmxlQ2xhc3NcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkcmF3RnVuY3Rpb24pIHtcbiAgICAvLyBDbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbnRhaW5lZCBzZXR0aW5ncy5cbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG5cbiAgICAvLyBEcmF3aW5nIGZ1bmN0aW9uIGZvciBvYmplY3RzIG9mIHR5cGUgYGNsYXNzT2JqYCB3aXRoIHRoZSBzaWduYXR1cmU6XG4gICAgLy8gYGRyYXdGdW5jdGlvbihkcmF3ZXIsIG9iamVjdE9mQ2xhc3MpYFxuICAgIC8vICsgYGRyYXdlcjogUDVEcmF3ZXJgIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nXG4gICAgLy8gKyBgb2JqZWN0T2ZDbGFzczogY2xhc3NPYmpgIC0gSW5zdGFuY2Ugb2YgYGNsYXNzT2JqYCB0byBkcmF3XG4gICAgLy9cbiAgICAvLyBUaGUgZnVuY3Rpb24gaXMgaW50ZW5kZWQgdG8gcGVyZm9ybSBkcmF3aW5nIHVzaW5nIGBkcmF3ZXIucDVgXG4gICAgLy8gZnVuY3Rpb25zIG9yIGNhbGxpbmcgYGRyYXcoKWAgaW4gb3RoZXIgZHJhd2FibGUgb2JqZWN0cy4gQWxsIHN0eWxlc1xuICAgIC8vIGFyZSBwdXNoZWQgYmVmb3JlaGFuZCBhbmQgcG9wcGVkIGFmdGVyd2FyZHMuXG4gICAgLy9cbiAgICAvLyBJbiBnZW5lcmFsIGl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlIGBkcmF3RnVuY3Rpb25gIHBlZm9ybXMgbm8gY2hhbmdlc1xuICAgIC8vIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzIGluIG9yZGVyIGZvciBlYWNoIGRyYXdpbmcgY2FsbCB0byB1c2Ugb25seSBhXG4gICAgLy8gc2luZ2xlIGBwdXNoL3BvcGAgd2hlbiBuZWNlc3NhcnkuIEZvciBjbGFzc2VzIHRoYXQgcmVxdWlyZVxuICAgIC8vIG1vZGlmaWNhdGlvbnMgdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MgdGhlIGByZXF1aXJlc1B1c2hQb3BgXG4gICAgLy8gcHJvcGVydHkgY2FuIGJlIHNldCB0byBmb3JjZSBhIGBwdXNoL3BvcGAgd2l0aCBlYWNoIGRyYXdpbmcgY2FsbFxuICAgIC8vIHJlZ2FyZGxlc3MgaWYgc3R5bGVzIGFyZSBhcHBsaWVkLlxuICAgIHRoaXMuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuXG4gICAgLy8gV2hlbiBzZXQsIHRoaXMgc3R5bGUgaXMgYWx3YXlzIGFwcGxpZWQgYmVmb3JlIGVhY2ggZHJhd2luZyBjYWxsIHRvXG4gICAgLy8gb2JqZWN0cyBvZiB0eXBlIGBjbGFzc09iamAuIFRoaXMgYHN0eWxlYCBpcyBhcHBsaWVkIGJlZm9yZSB0aGVcbiAgICAvLyBgc3R5bGVgIHByb3ZpZGVkIHRvIHRoZSBkcmF3aW5nIGNhbGwuXG4gICAgdGhpcy5zdHlsZSA9IG51bGw7XG5cbiAgICAvLyBXaGVuIHNldCB0byBgdHJ1ZWAsIGEgYHB1c2gvcG9wYCBpcyBhbHdheXMgcGVmb3JtZWQgYmVmb3JlIGFuZCBhZnRlclxuICAgIC8vIGFsbCB0aGUgc3R5bGUgYXJlIGFwcGxpZWQgYW5kIGRyYXdpbmcgaXMgcGVyZm9ybWVkLiBUaGlzIGlzIGludGVuZGVkXG4gICAgLy8gZm9yIG9iamVjdHMgd2hpY2ggZHJhd2luZyBvcGVyYXRpb25zIG1heSBuZWVkIHRvIHBlcmZvcm1cbiAgICAvLyB0cmFuc2Zvcm1hdGlvbnMgdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MuXG4gICAgdGhpcy5yZXF1aXJlc1B1c2hQb3AgPSBmYWxzZTtcbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG59IC8vIERyYXdSb3V0aW5lXG5cblxuLy8gQ29udGFpbnMgdGhlIGRlYnVnLWRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGRlYnVnLWRyYXdpbmdcbi8vIG9iamVjdHMgb2YgYSBzcGVjaWZpYyBjbGFzcy5cbi8vXG4vLyBBbiBpbnN0YW5jZSBpcyBjcmVhdGVkIGZvciBlYWNoIGRyYXdhYmxlIGNsYXNzIHRoYXQgdGhlIGRyYXdlciBjYW5cbi8vIHN1cHBvcnQsIHdoaWNoIGNvbnRhaW5zIGFsbCB0aGUgc2V0dGluZ3MgbmVlZGVkIGZvciBkZWJ1Zy1kcmF3aW5nLlxuLy9cbi8vIFdoZW4gYSBkcmF3YWJsZSBvYmplY3QgZG9lcyBub3QgaGF2ZSBhIGBEZWJ1Z1JvdXRpbmVgIHNldHVwLCBjYWxsaW5nXG4vLyBgZGVidWcoKWAgc2ltcGx5IGNhbGxzIGBkcmF3KClgIHdpdGggdGhlIGRlYnVnIHN0eWxlIGFwcGxpZWQuXG5jbGFzcyBEZWJ1Z1JvdXRpbmUge1xuXG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgZGVidWdGdW5jdGlvbikge1xuICAgIC8vIENsYXNzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29udGFpbmVkIHNldHRpbmdzLlxuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcblxuICAgIC8vIERlYnVnIGZ1bmN0aW9uIGZvciBvYmplY3RzIG9mIHR5cGUgYGNsYXNzT2JqYCB3aXRoIHRoZSBzaWduYXR1cmU6XG4gICAgLy8gYGRlYnVnRnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzLCBkcmF3c1RleHQpYFxuICAgIC8vICsgYGRyYXdlcjogUDVEcmF3ZXJgIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nXG4gICAgLy8gKyBgb2JqZWN0T2ZDbGFzczogY2xhc3NPYmpgIC0gSW5zdGFuY2Ugb2YgYGNsYXNzT2JqYCB0byBkZWJ1Z1xuICAgIC8vICsgYGRyYXdzVGV4dDogYm9vbGAgLSBXaGVuIGB0cnVlYCB0ZXh0IHNob3VsZCBiZSBkcmF3biB3aXRoXG4gICAgLy8gICBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgIC8vXG4gICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGludGVuZGVkIHRvIHBlcmZvcm0gZGVidWctZHJhd2luZyB1c2luZyBgZHJhd2VyLnA1YFxuICAgIC8vIGZ1bmN0aW9ucyBvciBjYWxsaW5nIGBkcmF3KClgIGluIG90aGVyIGRyYXdhYmxlIG9iamVjdHMuIFRoZSBkZWJ1Z1xuICAgIC8vIHN0eWxlIGlzIHB1c2hlZCBiZWZvcmVoYW5kIGFuZCBwb3BwZWQgYWZ0ZXJ3YXJkcy5cbiAgICAvL1xuICAgIC8vIEluIGdlbmVyYWwgaXQgaXMgZXhwZWN0ZWQgdGhhdCB0aGUgYGRyYXdGdW5jdGlvbmAgcGVmb3JtcyBubyBjaGFuZ2VzXG4gICAgLy8gdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MgaW4gb3JkZXIgZm9yIGVhY2ggZHJhd2luZyBjYWxsIHRvIHVzZSBvbmx5IGFcbiAgICAvLyBzaW5nbGUgYHB1c2gvcG9wYCB3aGVuIG5lY2Vzc2FyeS5cbiAgICAvL1xuICAgIHRoaXMuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gIH0gLy8gY29uc3RydWN0b3JcblxufVxuXG5cbmNsYXNzIEFwcGx5Um91dGluZSB7XG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgYXBwbHlGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmFwcGx5RnVuY3Rpb24gPSBhcHBseUZ1bmN0aW9uO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUG9pbnRGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ2FsbHMgYHA1LnZlcnRleGAgdG8gcmVwcmVzZW50IHRoaXMgYFBvaW50YC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlBvaW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5Qb2ludC5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMuZHJhd2VyLnA1LnZlcnRleCh0aGlzLngsIHRoaXMueSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIuXG4gICpcbiAgKiBBZGRlZCB0byBgcmFjLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gcG9pbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LnBvaW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUubW91c2VYLCByYWMuZHJhd2VyLnA1Lm1vdXNlWSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogQWRkZWQgdG8gYHJhYy5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0NlbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0NlbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aC8yLCByYWMuZHJhd2VyLnA1LmhlaWdodC8yKTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgZW5kIG9mIHRoZSBjYW52YXMsIHRoYXQgaXMsIGF0IHRoZSBwb3NpdGlvblxuICAqIGAod2lkdGgsaGVpZ2h0KWAuXG4gICpcbiAgKiBBZGRlZCB0byBgcmFjLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzRW5kXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUG9pbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYXlGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIHJheSB0b3VjaGVzIHRoZSBjYW52YXMgZWRnZS5cbiAgKlxuICAqIFdoZW4gdGhlIHJheSBpcyBvdXRzaWRlIHRoZSBjYW52YXMgYW5kIHBvaW50aW5nIGF3YXksIGBudWxsYCBpc1xuICAqIHJldHVybmVkLlxuICAqXG4gICogQWRkZWQgIHRvIGBSYWMuUmF5LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICogQHJldHVybnMgez9SYWMuUG9pbnR9XG4gICovXG4gIFJhYy5SYXkucHJvdG90eXBlLnBvaW50QXRDYW52YXNFZGdlID0gZnVuY3Rpb24obWFyZ2luID0gMCkge1xuICAgIGxldCBlZGdlUmF5ID0gdGhpcy5yYXlBdENhbnZhc0VkZ2UobWFyZ2luKTtcbiAgICBpZiAoZWRnZVJheSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRnZVJheS5zdGFydDtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGhhdCBzdGFydHMgYXQgdGhlIHBvaW50IHdoZXJlIHRoZSBgdGhpc2AgdG91Y2hlc1xuICAqIHRoZSBjYW52YXMgZWRnZSBhbmQgcG9pbnRlZCB0b3dhcmRzIHRoZSBpbnNpZGUgb2YgdGhlIGNhbnZhcy5cbiAgKlxuICAqIFdoZW4gdGhlIHJheSBpcyBvdXRzaWRlIHRoZSBjYW52YXMgYW5kIHBvaW50aW5nIGF3YXksIGBudWxsYCBpc1xuICAqIHJldHVybmVkLlxuICAqXG4gICogQWRkZWQgIHRvIGBSYWMuUmF5LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7P1JhYy5SYXl9XG4gICovXG4gIFJhYy5SYXkucHJvdG90eXBlLnJheUF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBjb25zdCB0dXJuID0gdGhpcy5hbmdsZS50dXJuO1xuICAgIGNvbnN0IHA1ID0gdGhpcy5yYWMuZHJhd2VyLnA1O1xuXG4gICAgY29uc3QgZG93bkVkZ2UgID0gcDUuaGVpZ2h0IC0gbWFyZ2luO1xuICAgIGNvbnN0IGxlZnRFZGdlICA9IG1hcmdpbjtcbiAgICBjb25zdCB1cEVkZ2UgICAgPSBtYXJnaW47XG4gICAgY29uc3QgcmlnaHRFZGdlID0gcDUud2lkdGggLSBtYXJnaW47XG5cbiAgICAvLyBwb2ludGluZyBkb3duXG4gICAgaWYgKHR1cm4gPj0gMS84ICYmIHR1cm4gPCAzLzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnkgPCBkb3duRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WShkb3duRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnVwKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIGxlZnRcbiAgICBpZiAodHVybiA+PSAzLzggJiYgdHVybiA8IDUvOCkge1xuICAgICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuc3RhcnQueCA+PSBsZWZ0RWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChsZWZ0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnJpZ2h0KTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHVwXG4gICAgaWYgKHR1cm4gPj0gNS84ICYmIHR1cm4gPCA3LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnkgPj0gdXBFZGdlKSB7XG4gICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICBpZiAoZWRnZVJheS5zdGFydC54ID4gcmlnaHRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgocmlnaHRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUubGVmdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC54IDwgbGVmdEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChsZWZ0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVkZ2VSYXk7XG4gICAgfVxuXG4gICAgLy8gcG9pbnRpbmcgcmlnaHRcbiAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgaWYgKHRoaXMuc3RhcnQueCA8IHJpZ2h0RWRnZSkge1xuICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgocmlnaHRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUubGVmdCk7XG4gICAgICBpZiAoZWRnZVJheS5zdGFydC55ID4gZG93bkVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WShkb3duRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnVwKTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnkgPCB1cEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWRnZVJheTtcbiAgfTtcblxufSAvLyBhdHRhY2hSYXlGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hTZWdtZW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBTZWdtZW50YC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlNlZ21lbnQucHJvdG90eXBlYCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKi9cbiAgUmFjLlNlZ21lbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RhcnRQb2ludCgpLnZlcnRleCgpO1xuICAgIHRoaXMuZW5kUG9pbnQoKS52ZXJ0ZXgoKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHRvcCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1sZWZ0IHRvXG4gICogdG9wLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGByYWMuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzVG9wXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkICB0byBgcmFjLlNlZ21lbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0xlZnRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU2VnbWVudCNcbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzTGVmdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSByaWdodCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1yaWdodFxuICAqIHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgcmFjLlNlZ21lbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc1JpZ2h0XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdG9wUmlnaHQgPSByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgMCk7XG4gICAgcmV0dXJuIHRvcFJpZ2h0XG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzLCBmcm9tXG4gICogYm90dG9tLWxlZnQgdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGByYWMuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQm90dG9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG4vLyBSRUxFQVNFLVRPRE86IHVwZGF0ZSBkZWJ1ZyB0ZXh0cyB0byB1c2UgcGFkZGluZ3MgaW5zdGVhZCBvZiBwb2ludFRvQW5nbGVcblxuLy8gUkVMRUFTRS1UT0RPOiB1c2UgdXByaWdodFRleHQgZm9yIHRoZXNlIGNhc2VzXG5mdW5jdGlvbiByZXZlcnNlc1RleHQoYW5nbGUpIHtcbiAgcmV0dXJuIGFuZ2xlLnR1cm4gPCAzLzQgJiYgYW5nbGUudHVybiA+PSAxLzQ7XG59XG5cblxuZnVuY3Rpb24gZGFzaGVkRHJhdyhkcmF3ZXIsIHNlZ21lbnQsIGNsb3N1cmUpIHtcbiAgY29uc3QgY29udGV4dCA9IGRyYXdlci5wNS5kcmF3aW5nQ29udGV4dDtcbiAgY29udGV4dC5zYXZlKCk7XG4gIGNvbnRleHQubGluZUNhcCA9ICdidXR0JztcbiAgY29udGV4dC5zZXRMaW5lRGFzaChzZWdtZW50KTtcbiAgY2xvc3VyZSgpO1xuICBjb250ZXh0LnJlc3RvcmUoKTtcbn1cblxuXG5leHBvcnRzLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihkcmF3ZXIsIGFuZ2xlLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIFplcm8gc2VnbWVudFxuICBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuemVybywgbWFya2VyUmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gQW5nbGUgc2VnbWVudFxuICBsZXQgYW5nbGVTZWdtZW50ID0gcG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyAqIDEuNSk7XG4gIGFuZ2xlU2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgYW5nbGUsIGFuZ2xlLmludmVyc2UoKSwgZmFsc2UpXG4gICAgLmRyYXcoKTtcbiAgYW5nbGVTZWdtZW50XG4gICAgLndpdGhMZW5ndGhBZGQocG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBNaW5pIGFuZ2xlIGFyYyBtYXJrZXJzXG4gIGxldCBhbmdsZUFyYyA9IHBvaW50LmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS56ZXJvLCBhbmdsZSk7XG4gIGRhc2hlZERyYXcoZHJhd2VyLCBbNiwgNF0sICgpPT57IGFuZ2xlQXJjLmRyYXcoKTsgfSk7XG5cbiAgLy8gT3V0c2lkZSBhbmdsZSBhcmNcbiAgaWYgKCFhbmdsZUFyYy5pc0NpcmNsZSgpKSB7XG4gICAgbGV0IG91dHNpZGVBbmdsZUFyYyA9IGFuZ2xlQXJjXG4gICAgICAud2l0aFJhZGl1cyhtYXJrZXJSYWRpdXMqMy80KVxuICAgICAgLndpdGhDbG9ja3dpc2UoZmFsc2UpO1xuICAgIGRhc2hlZERyYXcoZHJhd2VyLCBbMiwgNF0sICgpPT57IG91dHNpZGVBbmdsZUFyYy5kcmF3KCk7IH0pO1xuICB9XG5cbiAgLy8gRGVidWcgVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcixcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBmb3JtYXQgPSBmb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gVHVybiB0ZXh0XG4gIGxldCB0dXJuU3RyaW5nID0gYHR1cm46JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBwb2ludFxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyoyKVxuICAgIC50ZXh0KHR1cm5TdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdBbmdsZVxuXG5cbmV4cG9ydHMuZGVidWdQb2ludCA9IGZ1bmN0aW9uKGRyYXdlciwgcG9pbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBwb2ludC5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgbWFya2VyXG4gIHBvaW50LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIFBvaW50IHJldGljdWxlIG1hcmtlclxuICBsZXQgYXJjID0gcG9pbnRcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcmFjLkFuZ2xlLnMsIHJhYy5BbmdsZS5lKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRGVidWcgVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBzdHJpbmcgPSBgeDoke3BvaW50LngudG9GaXhlZChkaWdpdHMpfVxcbnk6JHtwb2ludC55LnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCxcbiAgICByYWMuQW5nbGUuZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBwb2ludFxuICAgIC5wb2ludFRvQW5nbGUocmFjLkFuZ2xlLnNlLCBwb2ludFJhZGl1cyoyKVxuICAgIC50ZXh0KHN0cmluZywgZm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1BvaW50XG5cblxuZXhwb3J0cy5kZWJ1Z1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuXG4gIHJheS5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgcmF5LnN0YXJ0LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIEhhbGYgY2lyY2xlIGF0IHN0YXJ0XG4gIGNvbnN0IHBlcnBBbmdsZSA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gIGNvbnN0IHN0YXJ0QXJjID0gcmF5LnN0YXJ0XG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBzdGFydEFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBzdGFydEFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcblxuICAvLyBFZGdlIGVuZCBoYWxmIGNpcmNsZVxuICBjb25zdCBlZGdlUmF5ID0gcmF5LnJheUF0Q2FudmFzRWRnZSgpO1xuICBpZiAoZWRnZVJheSAhPSBudWxsKSB7XG4gICAgY29uc3QgZWRnZUFyYyA9IGVkZ2VSYXlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKVxuICAgICAgLnBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgICAuYXJjVG9BbmdsZURpc3RhbmNlKG1hcmtlclJhZGl1cy8yLCAwLjUpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMuc3RhcnRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLmVuZFNlZ21lbnQoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMucmFkaXVzU2VnbWVudEF0QW5nbGUoZWRnZVJheS5hbmdsZSlcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBjb25zdCBhbmdsZSAgPSByYXkuYW5nbGU7XG4gIGNvbnN0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgY29uc3QgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcbiAgY29uc3QgZm9udCAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udDtcbiAgY29uc3Qgc2l6ZSAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZTtcbiAgY29uc3QgZGlnaXRzID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBzdGFydEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhFbnVtLmxlZnQsIHZFbnVtLmJvdHRvbSxcbiAgICBhbmdsZSwgZm9udCwgc2l6ZSk7XG4gIGxldCBhbmdsZUZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhFbnVtLmxlZnQsIHZFbnVtLnRvcCxcbiAgICBhbmdsZSwgZm9udCwgc2l6ZSk7XG4gIGlmIChyZXZlcnNlc1RleHQoYW5nbGUpKSB7XG4gICAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICAgIHN0YXJ0Rm9ybWF0ID0gc3RhcnRGb3JtYXQucmV2ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgdGV4dFxuICBjb25zdCBzdGFydFN0cmluZyA9IGBzdGFydDooJHtyYXkuc3RhcnQueC50b0ZpeGVkKGRpZ2l0cyl9LCR7cmF5LnN0YXJ0LnkudG9GaXhlZChkaWdpdHMpfSlgO1xuICByYXkuc3RhcnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLnN1YnRyYWN0KDEvNCksIG1hcmtlclJhZGl1cy8yKVxuICAgIC50ZXh0KHN0YXJ0U3RyaW5nLCBzdGFydEZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gIC8vIEFuZ2xlIHRleHRcbiAgY29uc3QgYW5nbGVTdHJpbmcgPSBgYW5nbGU6JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICByYXkuc3RhcnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLmFkZCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChhbmdsZVN0cmluZywgYW5nbGVGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnUmF5XG5cblxuZXhwb3J0cy5kZWJ1Z1NlZ21lbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHNlZ21lbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBzZWdtZW50LmRyYXcoKTtcblxuICAvLyBMaXR0bGUgY2lyY2xlIGF0IHN0YXJ0IG1hcmtlclxuICBzZWdtZW50LndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgLmFyYygpXG4gICAgLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBzdGFydCBzZWdtZW50XG4gIGxldCBwZXJwQW5nbGUgPSBzZWdtZW50LmFuZ2xlKCkucGVycGVuZGljdWxhcigpO1xuICBsZXQgYXJjID0gc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcGVycEFuZ2xlLCBwZXJwQW5nbGUuaW52ZXJzZSgpKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gUGVycGVuZGljdWxhciBlbmQgbWFya2VyXG4gIGxldCBlbmRNYXJrZXJTdGFydCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKClcbiAgICAud2l0aExlbmd0aChtYXJrZXJSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKC1wb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuICBsZXQgZW5kTWFya2VyRW5kID0gc2VnbWVudFxuICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgLy8gTGl0dGxlIGVuZCBoYWxmIGNpcmNsZVxuICBzZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKHBvaW50UmFkaXVzLCBlbmRNYXJrZXJTdGFydC5hbmdsZSgpLCBlbmRNYXJrZXJFbmQuYW5nbGUoKSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIEZvcm1pbmcgZW5kIGFycm93XG4gIGxldCBhcnJvd0FuZ2xlU2hpZnQgPSByYWMuQW5nbGUuZnJvbSgxLzcpO1xuICBsZXQgZW5kQXJyb3dTdGFydCA9IGVuZE1hcmtlclN0YXJ0XG4gICAgLnJldmVyc2UoKVxuICAgIC5yYXkud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZVNoaWZ0LCBmYWxzZSk7XG4gIGxldCBlbmRBcnJvd0VuZCA9IGVuZE1hcmtlckVuZFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgdHJ1ZSk7XG4gIGxldCBlbmRBcnJvd1BvaW50ID0gZW5kQXJyb3dTdGFydFxuICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKGVuZEFycm93RW5kKTtcbiAgLy8gRW5kIGFycm93XG4gIGVuZE1hcmtlclN0YXJ0XG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRBcnJvd1BvaW50KVxuICAgIC5kcmF3KClcbiAgICAubmV4dFNlZ21lbnRUb1BvaW50KGVuZE1hcmtlckVuZC5lbmRQb2ludCgpKVxuICAgIC5kcmF3KCk7XG5cblxuICAvLyBEZWJ1ZyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IGFuZ2xlID0gc2VnbWVudC5hbmdsZSgpO1xuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGxlbmd0aEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20sXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IGFuZ2xlRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCxcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBsZW5ndGhGb3JtYXQgPSBsZW5ndGhGb3JtYXQucmV2ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gTGVuZ3RoXG4gIGxldCBsZW5ndGhTdHJpbmcgPSBgbGVuZ3RoOiR7c2VnbWVudC5sZW5ndGgudG9GaXhlZChkaWdpdHMpfWA7XG4gIHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5zdWJ0cmFjdCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChsZW5ndGhTdHJpbmcsIGxlbmd0aEZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gICAgLy8gQW5nbGVcbiAgbGV0IGFuZ2xlU3RyaW5nID0gYGFuZ2xlOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLmFkZCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChhbmdsZVN0cmluZywgYW5nbGVGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnU2VnbWVudFxuXG5cbmV4cG9ydHMuZGVidWdBcmMgPSBmdW5jdGlvbihkcmF3ZXIsIGFyYywgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIGFyYy5kcmF3KCk7XG5cbiAgLy8gQ2VudGVyIG1hcmtlcnNcbiAgbGV0IGNlbnRlckFyY1JhZGl1cyA9IG1hcmtlclJhZGl1cyAqIDIvMztcbiAgaWYgKGFyYy5yYWRpdXMgPiBtYXJrZXJSYWRpdXMvMyAmJiBhcmMucmFkaXVzIDwgbWFya2VyUmFkaXVzKSB7XG4gICAgLy8gSWYgcmFkaXVzIGlzIHRvbyBjbG9zZSB0byB0aGUgY2VudGVyLWFyYyBtYXJrZXJzXG4gICAgLy8gTWFrZSB0aGUgY2VudGVyLWFyYyBiZSBvdXRzaWRlIG9mIHRoZSBhcmNcbiAgICBjZW50ZXJBcmNSYWRpdXMgPSBhcmMucmFkaXVzICsgbWFya2VyUmFkaXVzLzM7XG4gIH1cblxuICAvLyBDZW50ZXIgc3RhcnQgc2VnbWVudFxuICBsZXQgY2VudGVyQXJjID0gYXJjLndpdGhSYWRpdXMoY2VudGVyQXJjUmFkaXVzKTtcbiAgY2VudGVyQXJjLnN0YXJ0U2VnbWVudCgpLmRyYXcoKTtcblxuICAvLyBSYWRpdXNcbiAgbGV0IHJhZGl1c01hcmtlckxlbmd0aCA9IGFyYy5yYWRpdXNcbiAgICAtIGNlbnRlckFyY1JhZGl1c1xuICAgIC0gbWFya2VyUmFkaXVzLzJcbiAgICAtIHBvaW50UmFkaXVzKjI7XG4gIGlmIChyYWRpdXNNYXJrZXJMZW5ndGggPiAwKSB7XG4gICAgYXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAud2l0aExlbmd0aChyYWRpdXNNYXJrZXJMZW5ndGgpXG4gICAgICAudHJhbnNsYXRlVG9MZW5ndGgoY2VudGVyQXJjUmFkaXVzICsgcG9pbnRSYWRpdXMqMilcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBJbnNpZGUgYW5nbGUgYXJjIC0gYmlnIGRhc2hlc1xuICBkYXNoZWREcmF3KGRyYXdlciwgWzYsIDRdLCAoKT0+eyBjZW50ZXJBcmMuZHJhdygpOyB9KTtcblxuICAvLyBPdXRzaWRlIGFuZ2xlIGFyYyAtIHNtYWxsIGRhc2hlc1xuICBpZiAoIWNlbnRlckFyYy5pc0NpcmNsZSgpKSB7XG4gICAgbGV0IG91dHNpZGVBbmdsZUFyYyA9IGNlbnRlckFyY1xuICAgICAgLndpdGhDbG9ja3dpc2UoIWNlbnRlckFyYy5jbG9ja3dpc2UpO1xuICAgIGRhc2hlZERyYXcoZHJhd2VyLCBbMiwgNF0sICgpPT57IG91dHNpZGVBbmdsZUFyYy5kcmF3KCk7IH0pO1xuICB9XG5cbiAgLy8gQ2VudGVyIGVuZCBzZWdtZW50XG4gIGlmICghYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBjZW50ZXJBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKS53aXRoTGVuZ3RoUmF0aW8oMS8yKS5kcmF3KCk7XG4gIH1cblxuICAvLyBTdGFydCBwb2ludCBtYXJrZXJcbiAgbGV0IHN0YXJ0UG9pbnQgPSBhcmMuc3RhcnRQb2ludCgpO1xuICBzdGFydFBvaW50XG4gICAgLmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuICBzdGFydFBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oLW1hcmtlclJhZGl1cy8yKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gT3JpZW50YXRpb24gbWFya2VyXG4gIGxldCBvcmllbnRhdGlvbkxlbmd0aCA9IG1hcmtlclJhZGl1cyoyO1xuICBsZXQgb3JpZW50YXRpb25BcmMgPSBhcmNcbiAgICAuc3RhcnRTZWdtZW50KClcbiAgICAud2l0aExlbmd0aEFkZChtYXJrZXJSYWRpdXMpXG4gICAgLmFyYyhudWxsLCBhcmMuY2xvY2t3aXNlKVxuICAgIC53aXRoTGVuZ3RoKG9yaWVudGF0aW9uTGVuZ3RoKVxuICAgIC5kcmF3KCk7XG4gIGxldCBhcnJvd0NlbnRlciA9IG9yaWVudGF0aW9uQXJjXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy8yKVxuICAgIC5jaG9yZFNlZ21lbnQoKTtcbiAgbGV0IGFycm93QW5nbGUgPSAzLzMyO1xuICBhcnJvd0NlbnRlci53aXRoQW5nbGVTaGlmdCgtYXJyb3dBbmdsZSkuZHJhdygpO1xuICBhcnJvd0NlbnRlci53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlKS5kcmF3KCk7XG5cbiAgLy8gSW50ZXJuYWwgZW5kIHBvaW50IG1hcmtlclxuICBsZXQgZW5kUG9pbnQgPSBhcmMuZW5kUG9pbnQoKTtcbiAgbGV0IGludGVybmFsTGVuZ3RoID0gTWF0aC5taW4obWFya2VyUmFkaXVzLzIsIGFyYy5yYWRpdXMpO1xuICBpbnRlcm5hbExlbmd0aCAtPSBwb2ludFJhZGl1cztcbiAgaWYgKGludGVybmFsTGVuZ3RoID4gcmFjLmVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgZW5kUG9pbnRcbiAgICAgIC5zZWdtZW50VG9BbmdsZShhcmMuZW5kLmludmVyc2UoKSwgaW50ZXJuYWxMZW5ndGgpXG4gICAgICAudHJhbnNsYXRlVG9MZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gRXh0ZXJuYWwgZW5kIHBvaW50IG1hcmtlclxuICBsZXQgdGV4dEpvaW5UaHJlc2hvbGQgPSBtYXJrZXJSYWRpdXMqMztcbiAgbGV0IGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPSBvcmllbnRhdGlvbkFyY1xuICAgIC53aXRoRW5kKGFyYy5lbmQpXG4gICAgLmxlbmd0aCgpO1xuICBsZXQgZXh0ZXJuYWxMZW5ndGggPSBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID4gdGV4dEpvaW5UaHJlc2hvbGQgJiYgZHJhd3NUZXh0ID09PSB0cnVlXG4gICAgPyBtYXJrZXJSYWRpdXMgLSBwb2ludFJhZGl1c1xuICAgIDogbWFya2VyUmFkaXVzLzIgLSBwb2ludFJhZGl1cztcblxuICBlbmRQb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhcmMuZW5kLCBleHRlcm5hbExlbmd0aClcbiAgICAudHJhbnNsYXRlVG9MZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBFbmQgcG9pbnQgbGl0dGxlIGFyY1xuICBpZiAoIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgZW5kUG9pbnRcbiAgICAgIC5hcmMocG9pbnRSYWRpdXMsIGFyYy5lbmQsIGFyYy5lbmQuaW52ZXJzZSgpLCBhcmMuY2xvY2t3aXNlKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBjb25zdCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGNvbnN0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG5cbiAgbGV0IGhlYWRWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLnRvcFxuICAgIDogdkVudW0uYm90dG9tO1xuICBsZXQgdGFpbFZlcnRpY2FsID0gYXJjLmNsb2Nrd2lzZVxuICAgID8gdkVudW0uYm90dG9tXG4gICAgOiB2RW51bS50b3A7XG4gIGxldCByYWRpdXNWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLmJvdHRvbVxuICAgIDogdkVudW0udG9wO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgaGVhZEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgaGVhZFZlcnRpY2FsLFxuICAgIGFyYy5zdGFydCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgdGFpbEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgdGFpbFZlcnRpY2FsLFxuICAgIGFyYy5lbmQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IHJhZGl1c0Zvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgcmFkaXVzVmVydGljYWwsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG5cbiAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5zdGFydCkpIHtcbiAgICBoZWFkRm9ybWF0ID0gaGVhZEZvcm1hdC5yZXZlcnNlKCk7XG4gICAgcmFkaXVzRm9ybWF0ID0gcmFkaXVzRm9ybWF0LnJldmVyc2UoKTtcbiAgfVxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5lbmQpKSB7XG4gICAgdGFpbEZvcm1hdCA9IHRhaWxGb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgbGV0IHN0YXJ0U3RyaW5nID0gYHN0YXJ0OiR7YXJjLnN0YXJ0LnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCByYWRpdXNTdHJpbmcgPSBgcmFkaXVzOiR7YXJjLnJhZGl1cy50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IGVuZFN0cmluZyA9IGBlbmQ6JHthcmMuZW5kLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhcmMuYW5nbGVEaXN0YW5jZSgpO1xuICBsZXQgZGlzdGFuY2VTdHJpbmcgPSBgZGlzdGFuY2U6JHthbmdsZURpc3RhbmNlLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IHRhaWxTdHJpbmcgPSBgJHtkaXN0YW5jZVN0cmluZ31cXG4ke2VuZFN0cmluZ31gO1xuICBsZXQgaGVhZFN0cmluZztcblxuICAvLyBSYWRpdXMgbGFiZWxcbiAgaWYgKGFuZ2xlRGlzdGFuY2UudHVybiA8PSAzLzQgJiYgIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgLy8gUmFkaXVzIGRyYXduIHNlcGFyYXRlbHlcbiAgICBsZXQgcGVycEFuZ2xlID0gYXJjLnN0YXJ0LnBlcnBlbmRpY3VsYXIoIWFyYy5jbG9ja3dpc2UpO1xuICAgIGFyYy5jZW50ZXJcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMpXG4gICAgICAucG9pbnRUb0FuZ2xlKHBlcnBBbmdsZSwgcG9pbnRSYWRpdXMqMilcbiAgICAgIC50ZXh0KHJhZGl1c1N0cmluZywgcmFkaXVzRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBoZWFkU3RyaW5nID0gc3RhcnRTdHJpbmc7XG4gIH0gZWxzZSB7XG4gICAgLy8gUmFkaXVzIGpvaW5lZCB0byBoZWFkXG4gICAgaGVhZFN0cmluZyA9IGAke3N0YXJ0U3RyaW5nfVxcbiR7cmFkaXVzU3RyaW5nfWA7XG4gIH1cblxuICBpZiAobGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkKSB7XG4gICAgLy8gRHJhdyBzdHJpbmdzIHNlcGFyYXRlbHlcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KGhlYWRTdHJpbmcsIGhlYWRGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICAgIG9yaWVudGF0aW9uQXJjLnBvaW50QXRBbmdsZShhcmMuZW5kKVxuICAgICAgLnBvaW50VG9BbmdsZShhcmMuZW5kLCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KHRhaWxTdHJpbmcsIHRhaWxGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIERyYXcgc3RyaW5ncyB0b2dldGhlclxuICAgIGxldCBhbGxTdHJpbmdzID0gYCR7aGVhZFN0cmluZ31cXG4ke3RhaWxTdHJpbmd9YDtcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KGFsbFN0cmluZ3MsIGhlYWRGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9XG59OyAvLyBkZWJ1Z0FyY1xuXG5cbmV4cG9ydHMuZGVidWdUZXh0ID0gZnVuY3Rpb24oZHJhd2VyLCB0ZXh0LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgY29uc3QgaEVudW0gPSBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduO1xuICBjb25zdCB2RW51bSA9IFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduO1xuXG4gIGNvbnN0IGZvcm1hdCA9IHRleHQuZm9ybWF0O1xuXG4gIC8vIFBvaW50IG1hcmtlclxuICB0ZXh0LnBvaW50LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIGNvbnN0IGNvcm5lclJldGljdWxlID0gZnVuY3Rpb24oYW5nbGUsIHBhZGRpbmcsIHBlcnBQYWRkaW5nLCByb3RhdGlvbikge1xuICAgIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cylcbiAgICAgIC5yZXZlcnNlKCkud2l0aExlbmd0aChtYXJrZXJSYWRpdXMtcG9pbnRSYWRpdXMqMikuZHJhdygpIC8vIGxpbmUgYXQgdGV4dCBlZGdlXG4gICAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHJvdGF0aW9uLCBwYWRkaW5nKS5wdXNoKCkgLy8gZWxib3cgdHVyblxuICAgICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcighcm90YXRpb24sIHBlcnBQYWRkaW5nKS5kcmF3KCkgLy8gbGluZSBhdCBvcmlnaW5cbiAgICAgIC5uZXh0U2VnbWVudFdpdGhMZW5ndGgocG9pbnRSYWRpdXMqNClcbiAgICAgIC5uZXh0U2VnbWVudFdpdGhMZW5ndGgobWFya2VyUmFkaXVzLXBvaW50UmFkaXVzKjIpLmRyYXcoKTsgLy8gb3Bwb3NpdGUgc2lkZSBsaW5lXG4gICAgICAvLyBEYXNoZWQgZWxib3cgdHVyblxuICAgICAgZGFzaGVkRHJhdyhkcmF3ZXIsIFs1LCAyXSwgKCk9PnsgcmFjLnBvcFN0YWNrKCkuZHJhdygpOyB9KTtcbiAgfTtcblxuICBjb25zdCBjZW50ZXJSZXRpY3VsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBwYWRkaW5nLCBwZXJwUGFkZGluZywgcm90YXRpb24pIHtcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICAvLyBsaW5lcyBhdCBlZGdlIG9mIHRleHRcbiAgICByYWMuUG9pbnQuemVyb1xuICAgICAgLnJheShhbmdsZS5wZXJwZW5kaWN1bGFyKHJvdGF0aW9uKSlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKjIpXG4gICAgICAuc2VnbWVudChtYXJrZXJSYWRpdXMgLSBwb2ludFJhZGl1cyoyKS5kcmF3KCk7XG4gICAgbGV0IHJldGljdWxlQ2VudGVyID0gcmFjLlBvaW50Lnplcm9cbiAgICAgIC5zZWdtZW50VG9BbmdsZShhbmdsZS5pbnZlcnNlKCksIHBhZGRpbmcpXG4gICAgICAucHVzaCgpIC8vIGRhc2hlZCBsaW5lIHRvIGVsYm93XG4gICAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHJvdGF0aW9uLCBwb2ludFJhZGl1cylcbiAgICAgIC5yZXZlcnNlKCkuZHJhdygpIC8vIGVsYm93IG1hcmtcbiAgICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIocm90YXRpb24sIHBvaW50UmFkaXVzKVxuICAgICAgLnJldmVyc2UoKS5kcmF3KCkgLy8gZWxib3cgbWFya1xuICAgICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihyb3RhdGlvbiwgcGVycFBhZGRpbmcpXG4gICAgICAucHVzaCgpIC8vIGRhc2hlZCBsaW5lIHRvIGNlbnRlclxuICAgICAgLmVuZFBvaW50KCk7XG4gICAgZGFzaGVkRHJhdyhkcmF3ZXIsIFs1LCAyXSwgKCk9PntcbiAgICAgIHJhYy5wb3BTdGFjaygpLmRyYXcoKTtcbiAgICAgIHJhYy5wb3BTdGFjaygpLmRyYXcoKTtcbiAgICB9KTtcblxuICAgIC8vIGxpbmVzIGFyb3VuZCByZXRpY3VsZSBjZW50ZXJcbiAgICByZXRpY3VsZUNlbnRlci5yYXkoYW5nbGUuaW52ZXJzZSgpKVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UocG9pbnRSYWRpdXMqMilcbiAgICAgIC5zZWdtZW50KG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzKjIpLmRyYXcoKTtcbiAgICByZXRpY3VsZUNlbnRlci5yYXkoYW5nbGUucGVycGVuZGljdWxhcighcm90YXRpb24pKVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UocG9pbnRSYWRpdXMqMilcbiAgICAgIC5zZWdtZW50KG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzKjIpLmRyYXcoKTtcbiAgICBsZXQgbGFzdENlbnRlckxpbmUgPVxuICAgICAgcmV0aWN1bGVDZW50ZXIucmF5KGFuZ2xlKVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UocG9pbnRSYWRpdXMqMilcbiAgICAgIC5zZWdtZW50KG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzKjIpLmRyYXcoKTtcblxuICAgIGlmIChNYXRoLmFicyhwZXJwUGFkZGluZykgPD0gMikgcmV0dXJuO1xuXG4gICAgLy8gc2hvcnQgZGFzaGVkIGxpbmVzIGJhY2sgdG8gdGV4dCBlZGdlXG4gICAgbGFzdENlbnRlckxpbmVcbiAgICAgIC5uZXh0U2VnbWVudFdpdGhMZW5ndGgocGFkZGluZyAtIG1hcmtlclJhZGl1cylcbiAgICAgIC5wdXNoKClcbiAgICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoIXJvdGF0aW9uLCBmb3JtYXQuaFBhZGRpbmcpXG4gICAgICAucHVzaCgpO1xuICAgIGRhc2hlZERyYXcoZHJhd2VyLCBbMiwgM10sICgpPT57XG4gICAgICByYWMucG9wU3RhY2soKS5kcmF3KCk7XG4gICAgICByYWMucG9wU3RhY2soKS5kcmF3KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZHJhd2VyLnA1LnB1c2goKTtcbiAgICBmb3JtYXQuYXBwbHkodGV4dC5wb2ludCk7XG4gICAgc3dpdGNoIChmb3JtYXQuaEFsaWduKSB7XG4gICAgICBjYXNlIGhFbnVtLmxlZnQ6XG4gICAgICAgIHN3aXRjaCAoZm9ybWF0LnZBbGlnbikge1xuICAgICAgICAgIGNhc2UgdkVudW0udG9wOlxuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMC80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMS80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDAvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5iYXNlbGluZTpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDAvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5ib3R0b206XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgwLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDMvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGhFbnVtLmNlbnRlcjpcbiAgICAgICAgc3dpdGNoIChmb3JtYXQudkFsaWduKSB7XG4gICAgICAgICAgY2FzZSB2RW51bS50b3A6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgxLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDEvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uYmFzZWxpbmU6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgxLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDMvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgaEVudW0ucmlnaHQ6XG4gICAgICAgIHN3aXRjaCAoZm9ybWF0LnZBbGlnbikge1xuICAgICAgICAgIGNhc2UgdkVudW0udG9wOlxuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMi80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgxLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDIvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uYmFzZWxpbmU6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgyLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTpcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDIvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDMvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICBkcmF3ZXIucDUucG9wKCk7XG5cbiAgLy8gVGV4dCBvYmplY3RcbiAgdGV4dC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG5cbiAgLy8gRGVidWcgVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGNvbnN0IGZpeCA9IGZ1bmN0aW9uKG51bWJlcikge1xuICAgIHJldHVybiBudW1iZXIudG9GaXhlZChkaWdpdHMpO1xuICB9O1xuXG4gIGxldCBzdHJpbmdQYSA9IGBwOigke2ZpeCh0ZXh0LnBvaW50LngpfSwke2ZpeCh0ZXh0LnBvaW50LnkpfSkgYToke2ZpeChmb3JtYXQuYW5nbGUudHVybil9YDtcbiAgbGV0IHN0cmluZ0FsID0gYGFsOiR7Zm9ybWF0LmhBbGlnbn0sJHtmb3JtYXQudkFsaWdufWA7XG4gIGxldCBzdHJpbmdQYWQgPSBgcGE6JHtmaXgoZm9ybWF0LmhQYWRkaW5nKX0sJHtmaXgoZm9ybWF0LnZQYWRkaW5nKX1gO1xuICBsZXQgZGVidWdTdHJpbmcgPSBgJHtzdHJpbmdQYX1cXG4ke3N0cmluZ0FsfVxcbiR7c3RyaW5nUGFkfWA7XG5cbiAgbGV0IGRlYnVnRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgaEVudW0ucmlnaHQsIHZFbnVtLmJvdHRvbSxcbiAgICByYWMuQW5nbGUuemVybyxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUsXG4gICAgcG9pbnRSYWRpdXMsIHBvaW50UmFkaXVzKTtcbiAgdGV4dC5wb2ludC50ZXh0KGAke2RlYnVnU3RyaW5nfWAsIGRlYnVnRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1RleHRcblxuXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIEJlemllclxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBDb21wb3NpdGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgU2hhcGVcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbmV4cG9ydHMuZHJhd1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCkge1xuICBkcmF3ZXIucDUucG9pbnQocG9pbnQueCwgcG9pbnQueSk7XG59OyAvLyBkcmF3UG9pbnRcblxuXG5leHBvcnRzLmRyYXdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSkge1xuICBsZXQgZWRnZVBvaW50ID0gcmF5LnBvaW50QXRDYW52YXNFZGdlKCk7XG5cbiAgaWYgKGVkZ2VQb2ludCA9PT0gbnVsbCkge1xuICAgIC8vIFJheSBpcyBvdXRzaWRlIGNhbnZhc1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHJheS5zdGFydC54LCByYXkuc3RhcnQueSxcbiAgICBlZGdlUG9pbnQueCwgZWRnZVBvaW50LnkpO1xufTsgLy8gZHJhd1JheVxuXG5cbmV4cG9ydHMuZHJhd1NlZ21lbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHNlZ21lbnQpIHtcbiAgY29uc3Qgc3RhcnQgPSBzZWdtZW50LnJheS5zdGFydDtcbiAgY29uc3QgZW5kID0gc2VnbWVudC5lbmRQb2ludCgpO1xuICBkcmF3ZXIucDUubGluZShcbiAgICBzdGFydC54LCBzdGFydC55LFxuICAgIGVuZC54LCAgIGVuZC55KTtcbn07IC8vIGRyYXdTZWdtZW50XG5cblxuZXhwb3J0cy5kcmF3QXJjID0gZnVuY3Rpb24oZHJhd2VyLCBhcmMpIHtcbiAgaWYgKGFyYy5pc0NpcmNsZSgpKSB7XG4gICAgbGV0IHN0YXJ0UmFkID0gYXJjLnN0YXJ0LnJhZGlhbnMoKTtcbiAgICBsZXQgZW5kUmFkID0gc3RhcnRSYWQgKyBSYWMuVEFVO1xuICAgIGRyYXdlci5wNS5hcmMoXG4gICAgICBhcmMuY2VudGVyLngsIGFyYy5jZW50ZXIueSxcbiAgICAgIGFyYy5yYWRpdXMgKiAyLCBhcmMucmFkaXVzICogMixcbiAgICAgIHN0YXJ0UmFkLCBlbmRSYWQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBzdGFydCA9IGFyYy5zdGFydDtcbiAgbGV0IGVuZCA9IGFyYy5lbmQ7XG4gIGlmICghYXJjLmNsb2Nrd2lzZSkge1xuICAgIHN0YXJ0ID0gYXJjLmVuZDtcbiAgICBlbmQgPSBhcmMuc3RhcnQ7XG4gIH1cblxuICBkcmF3ZXIucDUuYXJjKFxuICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgIGFyYy5yYWRpdXMgKiAyLCBhcmMucmFkaXVzICogMixcbiAgICBzdGFydC5yYWRpYW5zKCksIGVuZC5yYWRpYW5zKCkpO1xufTsgLy8gZHJhd0FyY1xuXG5cbmV4cG9ydHMuZHJhd1RleHQgPSBmdW5jdGlvbihkcmF3ZXIsIHRleHQpIHtcbiAgLy8gVGV4dCBkcmF3Um91dGluZSBpcyBzZXRzIGByZXF1aXJlc1B1c2hQb3BgXG4gIC8vIFRoaXMgYGFwcGx5YCBnZXRzIHJldmVydGVkIGF0IGBwNURyYXdlci5kcmF3T2JqZWN0YFxuICB0ZXh0LmZvcm1hdC5hcHBseSh0ZXh0LnBvaW50KTtcbiAgZHJhd2VyLnA1LnRleHQodGV4dC5zdHJpbmcsIDAsIDApO1xufTsgLy8gZHJhd1RleHRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbG9yIHdpdGggUkJHQSB2YWx1ZXMsIGVhY2ggb25lIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuKlxuKiAjIyMgYGluc3RhbmNlLkNvbG9yYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkNvbG9yYCBmdW5jdGlvbl17QGxpbmsgUmFjI0NvbG9yfSB0byBjcmVhdGUgYENvbG9yYCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5Db2xvci5yZWRgXXtAbGluayBpbnN0YW5jZS5Db2xvciNyZWR9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5Db2xvcmBde0BsaW5rIGluc3RhbmNlLkNvbG9yfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgY29sb3IgPSBuZXcgUmFjLkNvbG9yKHJhYywgMC4yLCAwLjQsIDAuNilcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyQ29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbipcbiogQHNlZSBbYHJhYy5Db2xvcmBde0BsaW5rIFJhYyNDb2xvcn1cbiogQHNlZSBbYGluc3RhbmNlLkNvbG9yYF17QGxpbmsgaW5zdGFuY2UuQ29sb3J9XG4qXG4qIEBhbGlhcyBSYWMuQ29sb3JcbiovXG5jbGFzcyBDb2xvciB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbYT0xXSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgciwgZywgYiwgYSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHIsIGcsIGIsIGEpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSByZWQgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuciA9IHI7XG5cbiAgICAvKipcbiAgICAqIFRoZSBncmVlbiBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5nID0gZztcblxuICAgIC8qKlxuICAgICogVGhlIGJsdWUgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYiA9IGI7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbHBoYSBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5hID0gYTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5Db2xvcigwLjEsIDAuMiwgMC4zLCAwLjQpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnQ29sb3IoMC4xLDAuMiwwLjMsMC40KSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHJTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yLCBkaWdpdHMpO1xuICAgIGNvbnN0IGdTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5nLCBkaWdpdHMpO1xuICAgIGNvbnN0IGJTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5iLCBkaWdpdHMpO1xuICAgIGNvbnN0IGFTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hLCBkaWdpdHMpO1xuICAgIHJldHVybiBgQ29sb3IoJHtyU3RyfSwke2dTdHJ9LCR7YlN0cn0sJHthU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBkaWZmZXJlbmNlIHdpdGggYG90aGVyQ29sb3JgIGZvciBlYWNoIGNoYW5uZWxcbiAgKiBpcyB1bmRlciBbYHJhYy5lcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH07XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyQ29sb3JgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQ29sb3JgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBWYWx1ZXMgYXJlIGNvbXBhcmVkIHVzaW5nIFtgcmFjLnVuaXRhcnlFcXVhbHNgXXtAbGluayBSYWMjdW5pdGFyeUVxdWFsc30uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcn0gb3RoZXJDb2xvciAtIEEgYENvbG9yYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYHJhYy51bml0YXJ5RXF1YWxzYF17QGxpbmsgUmFjI3VuaXRhcnlFcXVhbHN9XG4gICovXG4gIGVxdWFscyhvdGhlckNvbG9yKSB7XG4gICAgcmV0dXJuIG90aGVyQ29sb3IgaW5zdGFuY2VvZiBDb2xvclxuICAgICAgJiYgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLnIsIG90aGVyQ29sb3IucilcbiAgICAgICYmIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5nLCBvdGhlckNvbG9yLmcpXG4gICAgICAmJiB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYiwgb3RoZXJDb2xvci5iKVxuICAgICAgJiYgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmEsIG90aGVyQ29sb3IuYSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSB3aXRoIGVhY2ggY2hhbm5lbCByZWNlaXZlZCBpbiB0aGVcbiAgKiAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gW2E9MjU1XSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBzdGF0aWMgZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcihyYWMsIHIvMjU1LCBnLzI1NSwgYi8yNTUsIGEvMjU1KTtcbiAgfVxuXG5cbi8vIFJFTEVBU0UtVE9ETzogdXBkYXRlIGRvY3MgaGVyZSBhbmQgaW4gaW5zdGFuY2UuZnJvbUhleFxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UgZnJvbSBhIGhleGFkZWNpbWFsIHRyaXBsZXQgc3RyaW5nLlxuICAqXG4gICogVGhlIGBoZXhTdHJpbmdgIGlzIGV4cGVjdGVkIHRvIGhhdmUgNiBkaWdpdHMgYW5kIGNhbiBvcHRpb25hbGx5IHN0YXJ0XG4gICogd2l0aCBgI2AuIGBBQUJCQ0NgIGFuZCBgI0RERUVGRmAgYXJlIGJvdGggdmFsaWQgaW5wdXRzLCB0aGUgdGhyZWUgZGlnaXRcbiAgKiBzaG9ydGhhbmQgaXMgbm90IHlldCBzdXBwb3J0ZWQuXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGhleFN0cmluZ2AgaXMgbWlzZm9ybWF0dGVkIG9yIGNhbm5vdCBiZSBwYXJzZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtTdHJpbmd9IGhleFN0cmluZyAtIFRoZSBSR0IgaGV4IHRyaXBsZXQgdG8gaW50ZXJwcmV0XG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBzdGF0aWMgZnJvbUhleChyYWMsIGhleFN0cmluZykge1xuICAgIGlmIChoZXhTdHJpbmcuY2hhckF0KDApID09ICcjJykge1xuICAgICAgaGV4U3RyaW5nID0gaGV4U3RyaW5nLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBpZiAoIVs2LCA4XS5pbmNsdWRlcyhoZXhTdHJpbmcubGVuZ3RoKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBVbmV4cGVjdGVkIGxlbmd0aCBmb3IgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICBsZXQgclN0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoMCwgMik7XG4gICAgbGV0IGdTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDIsIDQpO1xuICAgIGxldCBiU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZyg0LCA2KTtcbiAgICBsZXQgYVN0ciA9ICdmZic7XG4gICAgaWYgKGhleFN0cmluZy5sZW5ndGggPT0gOCkge1xuICAgICAgYVN0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoNiwgOCk7XG4gICAgfVxuXG4gICAgbGV0IG5ld1IgPSBwYXJzZUludChyU3RyLCAxNik7XG4gICAgbGV0IG5ld0cgPSBwYXJzZUludChnU3RyLCAxNik7XG4gICAgbGV0IG5ld0IgPSBwYXJzZUludChiU3RyLCAxNik7XG4gICAgbGV0IG5ld0EgPSBwYXJzZUludChhU3RyLCAxNik7XG5cbiAgICBpZiAoaXNOYU4obmV3UikgfHwgaXNOYU4obmV3RykgfHwgaXNOYU4obmV3QikgfHwgaXNOYU4obmV3QSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgQ291bGQgbm90IHBhcnNlIGhleCB0cmlwbGV0IHN0cmluZzogJHtoZXhTdHJpbmd9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDb2xvcihyYWMsIG5ld1IvMjU1LCBuZXdHLzI1NSwgbmV3Qi8yNTUsIG5ld0EvMjU1KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgRmlsbGAgdGhhdCB1c2VzIGB0aGlzYCBhcyBgY29sb3JgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBmaWxsKCkge1xuICAgIHJldHVybiBuZXcgUmFjLkZpbGwodGhpcy5yYWMsIHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgdXNlcyBgdGhpc2AgYXMgYGNvbG9yYC5cbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gd2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgbmV3IGBTdHJva2VgXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0cm9rZSh3ZWlnaHQgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMucmFjLCB3ZWlnaHQsIHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBgYWAgc2V0IHRvIGBuZXdBbHBoYWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3QWxwaGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBmb3IgdGhlIG5ldyBgQ29sb3JgLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICB3aXRoQWxwaGEobmV3QWxwaGEpIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCBuZXdBbHBoYSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGBhYCBzZXQgdG8gYHRoaXMuYSAqIHJhdGlvYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGFgIGJ5XG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgd2l0aEFscGhhUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmEgKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCBpbiB0aGUgbGluZWFyIHRyYW5zaXRpb24gYmV0d2VlbiBgdGhpc2AgYW5kXG4gICogYHRhcmdldGAgYXQgYSBgcmF0aW9gIGluIHRoZSByYW5nZSAqWzAsMV0qLlxuICAqXG4gICogV2hlbiBgcmF0aW9gIGlzIGAwYCBvciBsZXNzIHRoZSBuZXcgYENvbG9yYCBpcyBlcXVpdmFsZW50IHRvIGB0aGlzYCxcbiAgKiB3aGVuIGByYXRpb2AgaXMgYDFgIG9yIGxhcmdlciB0aGUgbmV3IGBDb2xvcmAgaXMgZXF1aXZhbGVudCB0b1xuICAqIGB0YXJnZXRgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIHRyYW5zaXRpb24gcmF0aW8gZm9yIHRoZSBuZXcgYENvbG9yYFxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSB0YXJnZXQgLSBUaGUgdHJhbnNpdGlvbiB0YXJnZXQgYENvbG9yYFxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIGxpbmVhclRyYW5zaXRpb24ocmF0aW8sIHRhcmdldCkge1xuICAgIHJhdGlvID0gTWF0aC5tYXgocmF0aW8sIDApO1xuICAgIHJhdGlvID0gTWF0aC5taW4ocmF0aW8sIDEpO1xuXG4gICAgbGV0IG5ld1IgPSB0aGlzLnIgKyAodGFyZ2V0LnIgLSB0aGlzLnIpICogcmF0aW87XG4gICAgbGV0IG5ld0cgPSB0aGlzLmcgKyAodGFyZ2V0LmcgLSB0aGlzLmcpICogcmF0aW87XG4gICAgbGV0IG5ld0IgPSB0aGlzLmIgKyAodGFyZ2V0LmIgLSB0aGlzLmIpICogcmF0aW87XG4gICAgbGV0IG5ld0EgPSB0aGlzLmEgKyAodGFyZ2V0LmEgLSB0aGlzLmEpICogcmF0aW87XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCBuZXdSLCBuZXdHLCBuZXdCLCBuZXdBKTtcbiAgfVxuXG59IC8vIGNsYXNzIENvbG9yXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcblxuIiwiICAndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRmlsbCBbY29sb3Jde0BsaW5rIFJhYy5Db2xvcn0gZm9yIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBmaWxsLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBmaWxsIHNldHRpbmdzIGdsb2JhbGx5LCBvciBhc1xuKiB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KGZpbGwpYCB0byBhcHBseSB0aGUgZmlsbCBvbmx5IGZvciB0aGF0XG4qIGNhbGwuXG4qXG4qIFdoZW4gYGNvbG9yYCBpcyBgbnVsbGAgYSAqbm8tZmlsbCogc2V0dGluZyBpcyBhcHBsaWVkLlxuKlxuKiAjIyMgYGluc3RhbmNlLkZpbGxgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuRmlsbGAgZnVuY3Rpb25de0BsaW5rIFJhYyNGaWxsfSB0byBjcmVhdGUgYEZpbGxgIG9iamVjdHMgd2l0aFxuKiBmZXdlciBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLkZpbGwubm9uZWBde0BsaW5rIGluc3RhbmNlLkZpbGwjbm9uZX0sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLkZpbGxgXXtAbGluayBpbnN0YW5jZS5GaWxsfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IGZpbGwgPSBuZXcgUmFjLkZpbGwocmFjLCBjb2xvcilcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyRmlsbCA9IHJhYy5GaWxsKGNvbG9yKVxuKlxuKiBAc2VlIFtgcmFjLkZpbGxgXXtAbGluayBSYWMjRmlsbH1cbiogQHNlZSBbYGluc3RhbmNlLkZpbGxgXXtAbGluayBpbnN0YW5jZS5GaWxsfVxuKlxuKiBAYWxpYXMgUmFjLkZpbGxcbiovXG5jbGFzcyBGaWxsIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBGaWxsYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0gez9SYWMuQ29sb3J9IGNvbG9yIC0gQSBgQ29sb3JgIGZvciB0aGUgZmlsbCBzZXR0aW5nLCBvciBgbnVsbGBcbiAgKiAgIHRvIGFwcGx5IGEgKm5vLWZpbGwqIHNldHRpbmdcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBjb2xvcikge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIGNvbG9yICE9PSBudWxsICYmIHV0aWxzLmFzc2VydFR5cGUoUmFjLkNvbG9yLCBjb2xvcik7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnRcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgRmlsbGAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBGaWxsYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgQ29sb3JgLCByZXR1cm5zIGEgbmV3IGBGaWxsYFxuICAqICAgdXNpbmcgYHNvbWV0aGluZ2AgYXMgYGNvbG9yYC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYFN0cm9rZWAsIHJldHVybnMgYSBuZXcgYEZpbGxgXG4gICogICB1c2luZyBgc3Ryb2tlLmNvbG9yYC5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5GaWxsfFJhYy5Db2xvcnxSYWMuU3Ryb2tlfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYSBgRmlsbGAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgRmlsbCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TdHJva2UpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZy5jb2xvcik7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5GaWxsIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBvbmx5IGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXNdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCBgc3R5bGVgLiBXaGVuXG4gICogYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gY29udGFpbiBhbG9uZyBgdGhpc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfFJhYy5GaWxsfVxuICAqL1xuICBhcHBlbmRTdHlsZShzdHlsZSkge1xuICAgIGlmIChzdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgc3R5bGVdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCB0aGUgYFN0cm9rZWBcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuU3Ryb2tlLmZyb219IGBzb21lU3Ryb2tlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlN0cm9rZXxSYWMuQ29sb3J8UmFjLkZpbGx9IHNvbWVTdHJva2UgLSBBbiBvYmplY3QgdG8gZGVyaXZlXG4gICogICBhIGBTdHJva2VgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqXG4gICogQHNlZSBbYHJhYy5TdHJva2UuZnJvbWBde0BsaW5rIFJhYy5TdHJva2UuZnJvbX1cbiAgKi9cbiAgYXBwZW5kU3Ryb2tlKHNvbWVTdHJva2UpIHtcbiAgICBsZXQgc3Ryb2tlID0gUmFjLlN0cm9rZS5mcm9tKHRoaXMucmFjLCBzb21lU3Ryb2tlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIHN0cm9rZV0pO1xuICB9XG5cbn0gLy8gY2xhc3MgRmlsbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmlsbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFN0cm9rZSB3ZWlnaHQgYW5kIFtjb2xvcl17QGxpbmsgUmFjLkNvbG9yfSBmb3IgZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgYXMgYHN0cm9rZS5hcHBseSgpYCB0byBhcHBseSB0aGUgc3Ryb2tlIHNldHRpbmdzIGdsb2JhbGx5LCBvclxuKiBhcyB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KHN0cm9rZSlgIHRvIGFwcGx5IHRoZSBzdHJva2Ugb25seSBmb3JcbiogdGhhdCBgZHJhd2AuXG4qXG4qIEFwcGx5aW5nIHRoZSBpbnN0YW5jZSBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIGJlaGF2aW91cnM6XG4qICsgQXBwbGllcyBhICoqbm8tc3Ryb2tlKiogc2V0dGluZzsgd2hlbiBgY29sb3IgPSBudWxsYCBhbmQgYHdlaWdodCA9IG51bGxgXG4qICsgQXBwbGllcyAqKm9ubHkgc3Ryb2tlIGNvbG9yKiosIGxlYXZpbmcgd2VpZ2h0IHVuY2hhbmdlZDsgd2hlbiBgY29sb3JgXG4qICAgaXMgc2V0IGFuZCBgd2VpZ2h0ID0gbnVsbGBcbiogKyBBcHBsaWVzICoqb25seSBzdHJva2Ugd2VpZ2h0KiosIGxlYXZpbmcgY29sb3IgdW5jaGFuZ2VkOyB3aGVuIGB3ZWlnaHRgXG4qICAgaXMgc2V0IGFuZCBgY29sb3IgPSBudWxsYFxuKiArIEFwcGxpZXMgKipib3RoIHdlaWdodCBhbmQgY29sb3IqKjsgd2hlbiBib3RoIGBjb2xvcmAgYW5kIGB3ZWlnaHRgIGFyZSBzZXRcbipcbiogIyMjIGBpbnN0YW5jZS5TdHJva2VgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuU3Ryb2tlYCBmdW5jdGlvbl17QGxpbmsgUmFjI1N0cm9rZX0gdG8gY3JlYXRlIGBTdHJva2VgIG9iamVjdHMgd2l0aFxuKiBmZXdlciBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlN0cm9rZS5ub25lYF17QGxpbmsgaW5zdGFuY2UuU3Ryb2tlI25vbmV9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5TdHJva2VgXXtAbGluayBpbnN0YW5jZS5TdHJva2V9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgc3Ryb2tlID0gbmV3IFJhYy5TdHJva2UocmFjLCAyLCBjb2xvcilcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyU3Ryb2tlID0gcmFjLlN0cm9rZSgyLCBjb2xvcilcbipcbiogQHNlZSBbYHJhYy5TdHJva2VgXXtAbGluayBSYWMjU3Ryb2tlfVxuKiBAc2VlIFtgaW5zdGFuY2UuU3Ryb2tlYF17QGxpbmsgaW5zdGFuY2UuU3Ryb2tlfVxuKlxuKiBAYWxpYXMgUmFjLlN0cm9rZVxuKi9cbmNsYXNzIFN0cm9rZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU3Ryb2tlYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/TnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwIHdlaWdodFxuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gW2NvbG9yPW51bGxdIC0gQSBgQ29sb3JgIGZvciB0aGUgc3Ryb2tlLCBvciBgbnVsbGBcbiAgKiAgIHRvIHNraXAgY29sb3JcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB3ZWlnaHQsIGNvbG9yID0gbnVsbCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHdlaWdodCAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnROdW1iZXIod2VpZ2h0KTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWNcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU3Ryb2tlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYFN0cm9rZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYFxuICAqICAgdXNpbmcgYHNvbWV0aGluZ2AgYXMgYGNvbG9yYCBhbmQgYSBgbnVsbGAgc3Ryb2tlIHdlaWdodC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgXG4gICogICB1c2luZyBgZmlsbC5jb2xvcmAgYW5kIGEgYG51bGxgIHN0cm9rZSB3ZWlnaHQuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogICBkZXJpdmUgYSBgU3Ryb2tlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFN0cm9rZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkZpbGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHJhYywgbnVsbCwgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLlN0cm9rZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHRgIHNldCB0byBgbmV3V2VpZ2h0YC5cbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gbmV3V2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgc3Ryb2tlLCBvciBgbnVsbGAgdG8gc2tpcFxuICAqICAgd2VpZ2h0XG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHdpdGhXZWlnaHQobmV3V2VpZ2h0KSB7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIG5ld1dlaWdodCwgdGhpcy5jb2xvciwpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYSBjb3B5IG9mIGBjb2xvcmAgc2V0dXAgd2l0aCBgbmV3QWxwaGFgLFxuICAqIGFuZCB0aGUgc2FtZSBgc3Ryb2tlYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGB0aGlzLmNvbG9yYCBpcyBzZXQgdG8gYG51bGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgaXMgYVxuICAqIGNvcHkgb2YgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld0FscGhhIC0gVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGBjb2xvcmAgb2YgdGhlIG5ld1xuICAqICAgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgaWYgKHRoaXMuY29sb3IgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbnVsbCk7XG4gICAgfVxuXG4gICAgbGV0IG5ld0NvbG9yID0gdGhpcy5jb2xvci53aXRoQWxwaGEobmV3QWxwaGEpO1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbmV3Q29sb3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBvbmx5IGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXNdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCBgc3R5bGVgLiBXaGVuXG4gICogYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gY29udGFpbiBhbG9uZyBgdGhpc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfFJhYy5TdHJva2V9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgRmlsbGBcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuRmlsbC5mcm9tfSBgc29tZUZpbGxgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZUZpbGwgLSBBbiBvYmplY3QgdG8gZGVyaXZlXG4gICogICBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKlxuICAqIEBzZWUgW2ByYWMuRmlsbC5mcm9tYF17QGxpbmsgUmFjLkZpbGwuZnJvbX1cbiAgKi9cbiAgYXBwZW5kRmlsbChzb21lRmlsbCkge1xuICAgIGxldCBmaWxsID0gUmFjLkZpbGwuZnJvbSh0aGlzLnJhYywgc29tZUZpbGwpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgZmlsbF0pO1xuICB9XG5cbn0gLy8gY2xhc3MgU3Ryb2tlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJva2U7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250YWluZXIgb2YgYFtTdHJva2Vde0BsaW5rIFJhYy5TdHJva2V9YCBhbmQgYFtGaWxsXXtAbGluayBSYWMuRmlsbH1gXG4qIG9iamVjdHMgd2hpY2ggZ2V0IGFwcGxpZWQgc2VxdWVudGlhbGx5IHdoZW4gZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgYXMgYGNvbnRhaW5lci5hcHBseSgpYCB0byBhcHBseSB0aGUgY29udGFpbmVkIHN0eWxlc1xuKiBnbG9iYWxseSwgb3IgYXMgdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhjb250YWluZXIpYCB0byBhcHBseSB0aGVcbiogc3R5bGUgc2V0dGluZ3Mgb25seSBmb3IgdGhhdCBgZHJhd2AuXG4qXG4qIEBhbGlhcyBSYWMuU3R5bGVDb250YWluZXJcbiovXG5jbGFzcyBTdHlsZUNvbnRhaW5lciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBzdHlsZXMgPSBbXSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIENvbnRhaW5lciBvZiBzdHlsZSBvYmplY3RzIHRvIGFwcGx5LlxuICAgICpcbiAgICAqIENhbiBiZSBtYW5pcHVsYXRlZCBkaXJlY3RseSB0byBhZGQgb3IgcmVtb3ZlIHN0eWxlcyBmcm9tIGB0aGlzYC5cbiAgICAqIE1vc3Qgb2YgdGhlIGltcGxlbWVudGVkIG1ldGhvZHMgbGlrZVxuICAgICogYFthZGRde0BsaW5rIFJhYy5TdHlsZUNvbnRhaW5lciNhZGR9YCByZXR1cm4gYSBuZXcgYFN0eWxlQ29udGFpbmVyYFxuICAgICogd2l0aCBhbiBjb3B5IG9mIGB0aGlzLnN0eWxlc2AuXG4gICAgKlxuICAgICogQHR5cGUge0FycmF5fVxuICAgICovXG4gICAgdGhpcy5zdHlsZXMgPSBzdHlsZXM7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IGNvbnRlbnRzID0gdGhpcy5zdHlsZXMuam9pbignICcpO1xuICAgIHJldHVybiBgU3R5bGVDb250YWluZXIoJHtjb250ZW50c30pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYSBjb3B5IG9mIGB0aGlzLnN0eWxlc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIHRoaXMuc3R5bGVzLnNsaWNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgd2l0aCBgc3R5bGVgIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2ZcbiAgKiBgc3R5bGVzYC4gV2hlbiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIGB0aGlzYCBpcyBub3QgbW9kaWZpZWQgYnkgdGhpcyBtZXRob2QsIHRoZSBuZXcgYFN0eWxlQ29udGFpbmVyYCBpc1xuICAqIGNyZWF0ZWQgd2l0aCBhIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBhcHBlbmQgdG8gYHN0eWxlc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBhcHBlbmRTdHlsZShzdHlsZSkge1xuICAgIGlmIChzdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHN0eWxlc0NvcHkgPSB0aGlzLnN0eWxlcy5zbGljZSgpO1xuICAgIHN0eWxlc0NvcHkucHVzaChzdHlsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIHN0eWxlc0NvcHkpO1xuICB9XG5cbn0gLy8gY2xhc3MgU3R5bGVDb250YWluZXJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0eWxlQ29udGFpbmVyO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLkNvbG9yYCBmdW5jdGlvbl17QGxpbmsgUmFjI0NvbG9yfS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BDb2xvcmBde0BsaW5rIFJhYy5Db2xvcn0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5Db2xvci5yZWQgLy8gcmVhZHktbWFkZSByZWQgY29sb3JcbiogcmFjLkNvbG9yLnJlZC5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQ29sb3JcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0NvbG9yKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggZWFjaCBjaGFubmVsIHJlY2VpdmVkIGluIHRoZSAqWzAsMjU1XSogcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gW2E9MjU1XSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21SZ2JhXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuZnJvbVJnYmEgPSBmdW5jdGlvbihyLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tUmdiYShyYWMsIHIsIGcsIGIsIGEpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlIGZyb20gYSBoZXhhZGVjaW1hbCB0cmlwbGV0IHN0cmluZy5cbiAgKlxuICAqIFRoZSBgaGV4U3RyaW5nYCBpcyBleHBlY3RlZCB0byBoYXZlIDYgZGlnaXRzIGFuZCBjYW4gb3B0aW9uYWxseSBzdGFydFxuICAqIHdpdGggYCNgLiBgQUFCQkNDYCBhbmQgYCNEREVFRkZgIGFyZSBib3RoIHZhbGlkIGlucHV0cywgdGhlIHRocmVlIGRpZ2l0XG4gICogc2hvcnRoYW5kIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBoZXhTdHJpbmdgIGlzIG1pc2Zvcm1hdHRlZCBvciBjYW5ub3QgYmUgcGFyc2VkLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGhleFN0cmluZyAtIFRoZSBSR0IgaGV4IHRyaXBsZXQgdG8gaW50ZXJwcmV0XG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tSGV4XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuZnJvbUhleCA9IGZ1bmN0aW9uKGhleFN0cmluZykge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbUhleChyYWMsIGhleFN0cmluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIEEgYENvbG9yYCB3aXRoIGFsbCBjaGFubmVscyBzZXQgdG8gYDBgLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLnplcm8gPSByYWMuQ29sb3IoMCwgMCwgMCwgMCk7XG5cblxuICAvKipcbiAgKiBBIGJsYWNrIGBDb2xvcmAuXG4gICpcbiAgKiBAbmFtZSBibGFja1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLmJsYWNrICAgPSByYWMuQ29sb3IoMCwgMCwgMCk7XG5cbiAgLyoqXG4gICogQSB3aGl0ZSBgQ29sb3JgLCB3aXRoIGFsbCBjaGFubmVscyBzZXQgdG8gYDFgLlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXMgYG9uZWAuXG4gICpcbiAgKiBAbmFtZSB3aGl0ZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLndoaXRlICAgPSByYWMuQ29sb3IoMSwgMSwgMSk7XG4gIHJhYy5Db2xvci5vbmUgPSByYWMuQ29sb3Iud2hpdGU7XG5cbiAgLyoqXG4gICogQSByZWQgYENvbG9yYC5cbiAgKlxuICAqIEBuYW1lIHJlZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLnJlZCAgICAgPSByYWMuQ29sb3IoMSwgMCwgMCk7XG5cbiAgcmFjLkNvbG9yLmdyZWVuICAgPSByYWMuQ29sb3IoMCwgMSwgMCk7XG4gIHJhYy5Db2xvci5ibHVlICAgID0gcmFjLkNvbG9yKDAsIDAsIDEpO1xuICByYWMuQ29sb3IueWVsbG93ICA9IHJhYy5Db2xvcigxLCAxLCAwKTtcbiAgcmFjLkNvbG9yLm1hZ2VudGEgPSByYWMuQ29sb3IoMSwgMCwgMSk7XG4gIHJhYy5Db2xvci5jeWFuICAgID0gcmFjLkNvbG9yKDAsIDEsIDEpO1xuXG59IC8vIGF0dGFjaFJhY0NvbG9yXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuRmlsbGAgZnVuY3Rpb25de0BsaW5rIFJhYyNGaWxsfS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BGaWxsYF17QGxpbmsgUmFjLkZpbGx9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuRmlsbC5ub25lIC8vIHJlYWR5LW1hZGUgbm9uZSBmaWxsXG4qIHJhYy5GaWxsLm5vbmUucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkZpbGxcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0ZpbGwocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgRmlsbGAgd2l0aG91dCBjb2xvci4gUmVtb3ZlcyB0aGUgZmlsbCBjb2xvciB3aGVuIGFwcGxpZWQuXG4gICogQG5hbWUgbm9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5GaWxsI1xuICAqL1xuICByYWMuRmlsbC5ub25lID0gcmFjLkZpbGwobnVsbCk7XG5cbn0gLy8gYXR0YWNoUmFjRmlsbFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlN0cm9rZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNTdHJva2V9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYFN0cm9rZWBde0BsaW5rIFJhYy5TdHJva2V9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuU3Ryb2tlLm5vbmUgLy8gcmVhZHktbWFkZSBub25lIHN0cm9rZVxuKiByYWMuU3Ryb2tlLm5vbmUucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlN0cm9rZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU3Ryb2tlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYFN0cm9rZWAgd2l0aCBubyB3ZWlnaHQgYW5kIG5vIGNvbG9yLiBVc2luZyBvciBhcHBseWluZyB0aGlzIHN0cm9rZVxuICAqIHdpbGwgZGlzYWJsZSBzdHJva2UgZHJhd2luZy5cbiAgKlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU3Ryb2tlI1xuICAqL1xuICByYWMuU3Ryb2tlLm5vbmUgPSByYWMuU3Ryb2tlKG51bGwpO1xuXG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHQgPSAxYCBhbmQgbm8gY29sb3IuIFVzaW5nIG9yIGFwcGx5aW5nIHRoaXNcbiAgKiBzdHJva2Ugd2lsbCBvbmx5IHNldCB0aGUgc3Ryb2tlIHdlaWdodCB0byBgMWAgbGVhdmluZyBzdHJva2UgY29sb3JcbiAgKiB1bmNoYW5nZWQuXG4gICpcbiAgKiBAbmFtZSBvbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU3Ryb2tlI1xuICAqL1xuICByYWMuU3Ryb2tlLm9uZSA9IHJhYy5TdHJva2UoMSk7XG5cbn0gLy8gYXR0YWNoUmFjU3Ryb2tlXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8vIEltcGxlbWVudGF0aW9uIG9mIGFuIGVhc2UgZnVuY3Rpb24gd2l0aCBzZXZlcmFsIG9wdGlvbnMgdG8gdGFpbG9yIGl0c1xuLy8gYmVoYXZpb3VyLiBUaGUgY2FsY3VsYXRpb24gdGFrZXMgdGhlIGZvbGxvd2luZyBzdGVwczpcbi8vIFZhbHVlIGlzIHJlY2VpdmVkLCBwcmVmaXggaXMgcmVtb3ZlZFxuLy8gICBWYWx1ZSAtPiBlYXNlVmFsdWUodmFsdWUpXG4vLyAgICAgdmFsdWUgPSB2YWx1ZSAtIHByZWZpeFxuLy8gUmF0aW8gaXMgY2FsY3VsYXRlZFxuLy8gICByYXRpbyA9IHZhbHVlIC8gaW5SYW5nZVxuLy8gUmF0aW8gaXMgYWRqdXN0ZWRcbi8vICAgcmF0aW8gLT4gZWFzZVJhdGlvKHJhdGlvKVxuLy8gICAgIGFkanVzdGVkUmF0aW8gPSAocmF0aW8gKyByYXRpb09mc2V0KSAqIHJhdGlvRmFjdG9yXG4vLyBFYXNlIGlzIGNhbGN1bGF0ZWRcbi8vICAgZWFzZWRSYXRpbyA9IGVhc2VVbml0KGFkanVzdGVkUmF0aW8pXG4vLyBFYXNlZFJhdGlvIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFJhdGlvID0gKGVhc2VkUmF0aW8gKyBlYXNlT2ZzZXQpICogZWFzZUZhY3RvclxuLy8gICBlYXNlUmF0aW8ocmF0aW8pIC0+IGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIHByb2plY3RlZFxuLy8gICBlYXNlZFZhbHVlID0gdmFsdWUgKiBlYXNlZFJhdGlvXG4vLyBWYWx1ZSBpcyBhZGp1c3RlZCBhbmQgcmV0dXJuZWRcbi8vICAgZWFzZWRWYWx1ZSA9IHByZWZpeCArIChlYXNlZFZhbHVlICogb3V0UmFuZ2UpXG4vLyAgIGVhc2VWYWx1ZSh2YWx1ZSkgLT4gZWFzZWRWYWx1ZVxuY2xhc3MgRWFzZUZ1bmN0aW9uIHtcblxuICAvLyBCZWhhdmlvcnMgZm9yIHRoZSBgZWFzZVZhbHVlYCBmdW5jdGlvbiB3aGVuIGB2YWx1ZWAgZmFsbHMgYmVmb3JlIHRoZVxuICAvLyBgcHJlZml4YCBhbmQgYWZ0ZXIgYGluUmFuZ2VgLlxuICBzdGF0aWMgQmVoYXZpb3IgPSB7XG4gICAgLy8gYHZhbHVlYCBpcyByZXR1cm5lZCB3aXRob3V0IGFueSBlYXNpbmcgdHJhbnNmb3JtYXRpb24uIGBwcmVGYWN0b3JgXG4gICAgLy8gYW5kIGBwb3N0RmFjdG9yYCBhcmUgYXBwbGllZC4gVGhpcyBpcyB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICAgIHBhc3M6IFwicGFzc1wiLFxuICAgIC8vIENsYW1wcyB0aGUgcmV0dXJuZWQgdmFsdWUgdG8gYHByZWZpeGAgb3IgYHByZWZpeCtpblJhbmdlYDtcbiAgICBjbGFtcDogXCJjbGFtcFwiLFxuICAgIC8vIFJldHVybnMgdGhlIGFwcGxpZWQgZWFzaW5nIHRyYW5zZm9ybWF0aW9uIHRvIGB2YWx1ZWAgZm9yIHZhbHVlc1xuICAgIC8vIGJlZm9yZSBgcHJlZml4YCBhbmQgYWZ0ZXIgYGluUmFuZ2VgLlxuICAgIGNvbnRpbnVlOiBcImNvbnRpbnVlXCJcbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmEgPSAyO1xuXG4gICAgLy8gQXBwbGllZCB0byByYXRpbyBiZWZvcmUgZWFzaW5nLlxuICAgIHRoaXMucmF0aW9PZmZzZXQgPSAwXG4gICAgdGhpcy5yYXRpb0ZhY3RvciA9IDE7XG5cbiAgICAvLyBBcHBsaWVkIHRvIGVhc2VkUmF0aW8uXG4gICAgdGhpcy5lYXNlT2Zmc2V0ID0gMFxuICAgIHRoaXMuZWFzZUZhY3RvciA9IDE7XG5cbiAgICAvLyBEZWZpbmVzIHRoZSBsb3dlciBsaW1pdCBvZiBgdmFsdWVgYCB0byBhcHBseSBlYXNpbmcuXG4gICAgdGhpcy5wcmVmaXggPSAwO1xuXG4gICAgLy8gYHZhbHVlYCBpcyByZWNlaXZlZCBpbiBgaW5SYW5nZWAgYW5kIG91dHB1dCBpbiBgb3V0UmFuZ2VgLlxuICAgIHRoaXMuaW5SYW5nZSA9IDE7XG4gICAgdGhpcy5vdXRSYW5nZSA9IDE7XG5cbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGJlZm9yZSBgcHJlZml4YC5cbiAgICB0aGlzLnByZUJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLnBhc3M7XG4gICAgLy8gQmVoYXZpb3IgZm9yIHZhbHVlcyBhZnRlciBgcHJlZml4K2luUmFuZ2VgLlxuICAgIHRoaXMucG9zdEJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLnBhc3M7XG5cbiAgICAvLyBGb3IgYSBgcHJlQmVoYXZpb3JgIG9mIGBwYXNzYCwgdGhlIGZhY3RvciBhcHBsaWVkIHRvIHZhbHVlcyBiZWZvcmVcbiAgICAvLyBgcHJlZml4YC5cbiAgICB0aGlzLnByZUZhY3RvciA9IDE7XG4gICAgLy8gRm9yIGEgYHBvc3RCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdGhlIHZhbHVlc1xuICAgIC8vIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0RmFjdG9yID0gMTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgZWFzZWQgdmFsdWUgZm9yIGB1bml0YC4gQm90aCB0aGUgZ2l2ZW5cbiAgLy8gYHVuaXRgIGFuZCB0aGUgcmV0dXJuZWQgdmFsdWUgYXJlIGluIHRoZSBbMCwxXSByYW5nZS4gSWYgYHVuaXRgIGlzXG4gIC8vIG91dHNpZGUgdGhlIFswLDFdIHRoZSByZXR1cm5lZCB2YWx1ZSBmb2xsb3dzIHRoZSBjdXJ2ZSBvZiB0aGUgZWFzaW5nXG4gIC8vIGZ1bmN0aW9uLCB3aGljaCBtYXkgYmUgaW52YWxpZCBmb3Igc29tZSB2YWx1ZXMgb2YgYGFgLlxuICAvL1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHRoZSBiYXNlIGVhc2luZyBmdW5jdGlvbiwgaXQgZG9lcyBub3QgYXBwbHkgYW55XG4gIC8vIG9mZnNldHMgb3IgZmFjdG9ycy5cbiAgZWFzZVVuaXQodW5pdCkge1xuICAgIC8vIFNvdXJjZTpcbiAgICAvLyBodHRwczovL21hdGguc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzEyMTcyMC9lYXNlLWluLW91dC1mdW5jdGlvbi8xMjE3NTUjMTIxNzU1XG4gICAgLy8gZih0KSA9ICh0XmEpLyh0XmErKDEtdCleYSlcbiAgICBsZXQgcmEgPSBNYXRoLnBvdyh1bml0LCB0aGlzLmEpO1xuICAgIGxldCBpcmEgPSBNYXRoLnBvdygxLXVuaXQsIHRoaXMuYSk7XG4gICAgcmV0dXJuIHJhIC8gKHJhICsgaXJhKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGVhc2UgZnVuY3Rpb24gYXBwbGllZCB0byB0aGUgZ2l2ZW4gcmF0aW8uIGByYXRpb09mZnNldGBcbiAgLy8gYW5kIGByYXRpb0ZhY3RvcmAgYXJlIGFwcGxpZWQgdG8gdGhlIGlucHV0LCBgZWFzZU9mZnNldGAgYW5kXG4gIC8vIGBlYXNlRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgb3V0cHV0LlxuICBlYXNlUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHRoaXMucmF0aW9PZmZzZXQpICogdGhpcy5yYXRpb0ZhY3RvcjtcbiAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbyk7XG4gICAgcmV0dXJuIChlYXNlZFJhdGlvICsgdGhpcy5lYXNlT2Zmc2V0KSAqIHRoaXMuZWFzZUZhY3RvcjtcbiAgfVxuXG4gIC8vIEFwcGxpZXMgdGhlIGVhc2luZyBmdW5jdGlvbiB0byBgdmFsdWVgIGNvbnNpZGVyaW5nIHRoZSBjb25maWd1cmF0aW9uXG4gIC8vIG9mIHRoZSB3aG9sZSBpbnN0YW5jZS5cbiAgZWFzZVZhbHVlKHZhbHVlKSB7XG4gICAgbGV0IGJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yO1xuXG4gICAgbGV0IHNoaWZ0ZWRWYWx1ZSA9IHZhbHVlIC0gdGhpcy5wcmVmaXg7XG4gICAgbGV0IHJhdGlvID0gc2hpZnRlZFZhbHVlIC8gdGhpcy5pblJhbmdlO1xuXG4gICAgLy8gQmVmb3JlIHByZWZpeFxuICAgIGlmICh2YWx1ZSA8IHRoaXMucHJlZml4KSB7XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IucGFzcykge1xuICAgICAgICBsZXQgZGlzdGFuY2V0b1ByZWZpeCA9IHZhbHVlIC0gdGhpcy5wcmVmaXg7XG4gICAgICAgIC8vIFdpdGggYSBwcmVGYWN0b3Igb2YgMSB0aGlzIGlzIGVxdWl2YWxlbnQgdG8gYHJldHVybiByYW5nZWBcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgKGRpc3RhbmNldG9QcmVmaXggKiB0aGlzLnByZUZhY3Rvcik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY2xhbXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLmNvbnRpbnVlKSB7XG4gICAgICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlUmF0aW8ocmF0aW8pO1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBlYXNlZFJhdGlvICogdGhpcy5vdXRSYW5nZTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBwcmVCZWhhdmlvciBjb25maWd1cmF0aW9uIC0gcHJlQmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICAgIHRocm93IHJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICAvLyBBZnRlciBwcmVmaXhcbiAgICBpZiAocmF0aW8gPD0gMSB8fCB0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgIC8vIEVhc2UgZnVuY3Rpb24gYXBwbGllZCB3aXRoaW4gcmFuZ2UgKG9yIGFmdGVyKVxuICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBlYXNlZFJhdGlvICogdGhpcy5vdXRSYW5nZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAvLyBTaGlmdGVkIHRvIGhhdmUgaW5SYW5nZSBhcyBvcmlnaW5cbiAgICAgIGxldCBzaGlmdGVkUG9zdCA9IHNoaWZ0ZWRWYWx1ZSAtIHRoaXMuaW5SYW5nZTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMub3V0UmFuZ2UgKyBzaGlmdGVkUG9zdCAqIHRoaXMucG9zdEZhY3RvcjtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZTtcbiAgICB9XG5cbiAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHBvc3RCZWhhdmlvciBjb25maWd1cmF0aW9uIC0gcG9zdEJlaGF2aW9yOiR7dGhpcy5wb3N0QmVoYXZpb3J9YCk7XG4gICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICB9XG5cblxuICAvLyBQcmVjb25maWd1cmVkIGZ1bmN0aW9uc1xuXG4gIC8vIE1ha2VzIGFuIGVhc2VGdW5jdGlvbiBwcmVjb25maWd1cmVkIHRvIGFuIGVhc2Ugb3V0IG1vdGlvbi5cbiAgLy9cbiAgLy8gVGhlIGBvdXRSYW5nZWAgdmFsdWUgc2hvdWxkIGJlIGBpblJhbmdlKjJgIGluIG9yZGVyIGZvciB0aGUgZWFzZVxuICAvLyBtb3Rpb24gdG8gY29ubmVjdCB3aXRoIHRoZSBleHRlcm5hbCBtb3Rpb24gYXQgdGhlIGNvcnJlY3QgdmVsb2NpdHkuXG4gIHN0YXRpYyBtYWtlRWFzZU91dCgpIHtcbiAgICBsZXQgZWFzZU91dCA9IG5ldyBFYXNlRnVuY3Rpb24oKVxuICAgIGVhc2VPdXQucmF0aW9PZmZzZXQgPSAxO1xuICAgIGVhc2VPdXQucmF0aW9GYWN0b3IgPSAuNTtcbiAgICBlYXNlT3V0LmVhc2VPZmZzZXQgPSAtLjU7XG4gICAgZWFzZU91dC5lYXNlRmFjdG9yID0gMjtcbiAgICByZXR1cm4gZWFzZU91dDtcbiAgfVxuXG59IC8vIGNsYXNzIEVhc2VGdW5jdGlvblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRWFzZUZ1bmN0aW9uO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRocm93YWJsZSBvYmplY3QgdG8gcmVwb3J0IGVycm9ycywgYW5kIGNvbnRhaW5lciBvZiBjb252ZW5pZW5jZSBmdW5jdGlvbnNcbiogdG8gY3JlYXRlIHRoZXNlLlxuKlxuKiBUaGUgc3RhdGljIGZ1bmN0aW9ucyBjcmVhdGUgZWl0aGVyIGBFeGNlcHRpb25gIG9yIGBFcnJvcmAgaW5zdGFuY2VzLFxuKiBzaW5jZSBkaWZmZXJlbnQgZW52aXJvbm1lbnRzIHJlc3BvbmQgZGlmZmVyZW50ZWx5IHRvIHRoZXNlIHRocm93cy4gRm9yXG4qIG1vcmUgZGV0YWlscyBzZWUgW2BidWlsZHNFcnJvcnNgXXtAbGluayBSYWMuRXhjZXB0aW9uLmJ1aWxkc0Vycm9yc30uXG4qXG4qIEBhbGlhcyBSYWMuRXhjZXB0aW9uXG4qL1xuY2xhc3MgRXhjZXB0aW9uIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBFeGNlcHRpb25gIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICogICBUaGUgbmFtZSBvZiB0aGUgZXhjZXB0aW9uXG4gICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgKiAgIFRoZSBtZXNzYWdlIG9mIHRoZSBleGNlcHRpb25cbiAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgbWVzc2FnZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIChuZXcgUmFjLkV4Y2VwdGlvbignTm90QVBhbmdyYW0nLCAnV2FsdHosIGJhZCBueW1waCcpKS50b1N0cmluZygpXG4gICogLy8gUmV0dXJuczogJ0V4Y2VwdGlvbjpOb3RBUGFuZ3JhbSAtIFdhbHR6LCBiYWQgbnltcGgnXG4gICpcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEV4Y2VwdGlvbjoke3RoaXMubmFtZX0gLSAke3RoaXMubWVzc2FnZX1gO1xuICB9XG5cblxuICAvKipcbiAgKiBXaGVuIGB0cnVlYCB0aGUgY29udmVuaWVuY2Ugc3RhdGljIGZ1bmN0aW9ucyBvZiB0aGlzIGNsYXNzIHdpbGxcbiAgKiBidWlsZCBgRXJyb3JgIG9iamVjdHMsIG90aGVyd2lzZSBgRXhjZXB0aW9uYCBvYmplY3RzIGFyZSBidWlsdC5cbiAgKlxuICAqIERlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIGJyb3dzZXIgdXNlOiB0aHJvd2luZyBhbiBgRXhjZXB0aW9uYCBpbiBjaHJvbWVcbiAgKiBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgdXNpbmcgc291cmNlLW1hcHMgd2hlbiBhdmFpbGFibGUuIEluIGNvbnRyYXN0XG4gICogdGhyb3dpbmcgYW4gYEVycm9yYCBvYmplY3QgZGlzcGxheXMgdGhlIGVycm9yIHN0YWNrIHJlbGF0aXZlIHRvIHRoZVxuICAqIGJ1bmRsZWQgZmlsZSwgd2hpY2ggaXMgaGFyZGVyIHRvIHJlYWQuXG4gICpcbiAgKiBVc2VkIGFzIGB0cnVlYCBmb3IgdGVzdCBydW5zIGluIEplc3Q6IHRocm93aW5nIGFuIGBFcnJvcmAgd2lsbCBiZVxuICAqIHJlcG9ydGVkIGluIHRoZSB0ZXN0IHJlcG9ydCwgd2hpbGUgdGhyb3dpbmcgYSBjdXN0b20gb2JqZWN0IChsaWtlXG4gICogYEV4Y2VwdGlvbmApIHdpdGhpbiBhIG1hdGNoZXIgcmVzdWx0cyBpbiB0aGUgZXhwZWN0YXRpb24gaGFuZ2luZ1xuICAqIGluZGVmaW5pdGVseS5cbiAgKlxuICAqIEB0eXBlIHtCb29sZWFufVxuICAqIEBkZWZhdWx0IGZhbHNlXG4gICpcbiAgKiBAbWVtYmVyb2YgUmFjLkV4Y2VwdGlvblxuICAqL1xuICBzdGF0aWMgYnVpbGRzRXJyb3JzID0gZmFsc2U7XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGJ1aWxkcyB0aHJvd2FibGUgb2JqZWN0cyB3aXRoIHRoZSBnaXZlblxuICAqIGBuYW1lYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IGZhY3RvcnkgPSBSYWMuRXhjZXB0aW9uLm5hbWVkKCdOb3RBUGFuZ3JhbScpXG4gICogZmFjdG9yeS5leGNlcHRpb25OYW1lIC8vIHJldHVybnMgJ05vdEFQYW5ncmFtJ1xuICAqIGZhY3RvcnkoJ1dhbHR6LCBiYWQgbnltcGgnKS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ0V4Y2VwdGlvbjpOb3RBUGFuZ3JhbSAtIFdhbHR6LCBiYWQgbnltcGgnXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIGZvciB0aGUgcHJvZHVjZWQgdGhyb3dhYmxlIG9iamVjdHNcbiAgKiBAcmV0dXJuIHtSYWMuRXhjZXB0aW9ufm5hbWVkRmFjdG9yeX1cbiAgKi9cbiAgc3RhdGljIG5hbWVkKG5hbWUpIHtcbiAgICAvKipcbiAgICAqIEZhY3RvcnkgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgdGhyb3dhYmxlIG9iamVjdCB3aXRoIHRoZSBnaXZlblxuICAgICogYG1lc3NhZ2VgLlxuICAgICpcbiAgICAqIEBjYWxsYmFjayBSYWMuRXhjZXB0aW9ufm5hbWVkRmFjdG9yeVxuICAgICpcbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBleGNlcHRpb25OYW1lXG4gICAgKiAgIFRoZSBuYW1lIGZvciB0aGUgcHJvZHVjZWQgdGhyb3dhYmxlIG9iamVjdHNcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgKiAgIFRoZSBtZXNzYWdlIGZvciB0aGUgcHJvZHVjZWQgdGhyb3dhYmxlIG9iamVjdC5cbiAgICAqXG4gICAgKiBAcmV0dXJuIHtFeGNlcHRpb258RXJyb3J9XG4gICAgKi9cbiAgICBsZXQgZnVuYyA9IChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoRXhjZXB0aW9uLmJ1aWxkc0Vycm9ycykge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgZXJyb3IubmFtZSA9IG5hbWU7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBFeGNlcHRpb24obmFtZSwgbWVzc2FnZSk7XG4gICAgfTtcblxuICAgIGZ1bmMuZXhjZXB0aW9uTmFtZSA9IG5hbWU7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICBzdGF0aWMgZHJhd2VyTm90U2V0dXAgICAgICAgICAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0RyYXdlck5vdFNldHVwJyk7XG4gIHN0YXRpYyBmYWlsZWRBc3NlcnQgICAgICAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnRmFpbGVkQXNzZXJ0Jyk7XG4gIHN0YXRpYyBpbnZhbGlkT2JqZWN0VHlwZSAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnSW52YWxpZE9iamVjdFR5cGUnKTtcbiAgc3RhdGljIGFic3RyYWN0RnVuY3Rpb25DYWxsZWQgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdBYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkJyk7XG4gIC8vIFRPRE86IG1pZ3JhdGUgcmVzdCBvZiBpbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICBzdGF0aWMgaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24gPSBFeGNlcHRpb24ubmFtZWQoJ0ludmFsaWRPYmplY3RDb25maWd1cmF0aW9uJyk7XG5cbiAgLy8gaW52YWxpZFBhcmFtZXRlckNvbWJpbmF0aW9uOiAnSW52YWxpZCBwYXJhbWV0ZXIgY29tYmluYXRpb24nLFxuXG4gIC8vIGludmFsaWRPYmplY3RUb0RyYXc6ICdJbnZhbGlkIG9iamVjdCB0byBkcmF3JyxcbiAgLy8gaW52YWxpZE9iamVjdFRvQXBwbHk6ICdJbnZhbGlkIG9iamVjdCB0byBhcHBseScsXG5cbn0gLy8gY2xhc3MgRXhjZXB0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFeGNlcHRpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogSW50ZXJuYWwgdXRpbGl0aWVzLlxuKlxuKiBBdmFpbGFibGUgdGhyb3VnaCBge0BsaW5rIFJhYy51dGlsc31gIG9yIFtgcmFjLnV0aWxzYF17QGxpbmsgUmFjI3V0aWxzfS5cbipcbiogQG5hbWVzcGFjZSB1dGlsc1xuKi9cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBwYXNzZWQgcGFyYW1ldGVycyBhcmUgb2JqZWN0cyBvciBwcmltaXRpdmVzLiBJZiBhbnlcbiogcGFyYW1ldGVyIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCBhIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YFxuKiBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uKE9iamVjdHxwcmltaXRpdmUpfSBwYXJhbWV0ZXJzXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0RXhpc3RzXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydEV4aXN0cyA9IGZ1bmN0aW9uKC4uLnBhcmFtZXRlcnMpIHtcbiAgcGFyYW1ldGVycy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEZvdW5kIG51bGwsIGV4cGVjdGluZyBlbGVtZW50IHRvIGV4aXN0IGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRm91bmQgdW5kZWZpbmVkLCBleHBlY3RpbmcgZWxlbWVudCB0byBleGlzdCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgb2JqZWN0cyBvciB0aGUgZ2l2ZW4gYHR5cGVgLCBvdGhlcndpc2UgYVxuKiBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBXaGVuIGFueSBtZW1iZXIgb2YgYGVsZW1lbnRzYCBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIHRoZSBleGNlcHRpb24gaXNcbiogYWxzbyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHR5cGVcbiogQHBhcmFtIHsuLi5PYmplY3R9IGVsZW1lbnRzXG4qXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0VHlwZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRUeXBlID0gZnVuY3Rpb24odHlwZSwgLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUgLSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZXhwZWN0ZWQtdHlwZS1uYW1lOiR7dHlwZS5uYW1lfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG51bWJlciBwcmltaXRpdmVzIGFuZCBub3QgTmFOLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLk51bWJlcn0gZWxlbWVudHNcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnROdW1iZXJcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0TnVtYmVyID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdudW1iZXInIHx8IGlzTmFOKGl0ZW0pKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgbnVtYmVyIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIHN0cmluZyBwcmltaXRpdmVzLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLlN0cmluZ30gZWxlbWVudHNcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRTdHJpbmdcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0U3RyaW5nID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3Rpbmcgc3RyaW5nIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIGJvb2xlYW4gcHJpbWl0aXZlcywgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5Cb29sZWFufSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydEJvb2xlYW5cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0Qm9vbGVhbiA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBib29sZWFuIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3RvciBuYW1lIG9mIGBvYmpgLCBvciBpdHMgdHlwZSBuYW1lLlxuKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgZGVidWdnaW5nIGFuZCBlcnJvcnMuXG4qXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBBbiBgT2JqZWN0YCB0byBnZXQgaXRzIHR5cGUgbmFtZVxuKiBAcmV0dXJucyB7U3RyaW5nfVxuKlxuKiBAZnVuY3Rpb24gdHlwZU5hbWVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKG9iaikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuICd1bmRlZmluZWQnOyB9XG4gIGlmIChvYmogPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5uYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gb2JqLm5hbWUgPT0gJydcbiAgICAgID8gYGZ1bmN0aW9uYFxuICAgICAgOiBgZnVuY3Rpb246JHtvYmoubmFtZX1gO1xuICB9XG4gIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA/PyB0eXBlb2Ygb2JqO1xufVxuZXhwb3J0cy50eXBlTmFtZSA9IHR5cGVOYW1lO1xuXG5cbi8qKlxuKiBBZGRzIGEgY29uc3RhbnQgdG8gdGhlIGdpdmVuIG9iamVjdCwgdGhlIGNvbnN0YW50IGlzIG5vdCBlbnVtZXJhYmxlIGFuZFxuKiBub3QgY29uZmlndXJhYmxlLlxuKlxuKiBAZnVuY3Rpb24gYWRkQ29uc3RhbnRUb1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hZGRDb25zdGFudFRvID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgdmFsdWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfSk7XG59XG5cblxuLyoqXG4qIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYG51bWJlcmAgZGlzcGxheWluZyBhbGwgYXZhaWxhYmxlXG4qIGRpZ2l0cywgb3IgZm9ybW1hdHRlZCB1c2VkIGZpeGVkLXBvaW50IG5vdGF0aW9uIGxpbWl0ZWQgdG8gYGRpZ2l0c2AuXG4qXG4qIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgLSBUaGUgbnVtYmVyIHRvIGZvcm1hdFxuKiBAcGFyYW0gez9OdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIGFtb3VudCBvZiBkaWdpdHMgdG8gcHJpbnQsIG9yIGBudWxsYCB0b1xuKiBwcmludCBhbGwgZGlnaXRzXG4qXG4qIEByZXR1cm5zIHtTdHJpbmd9XG4qXG4qIEBmdW5jdGlvbiBjdXREaWdpdHNcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuY3V0RGlnaXRzID0gZnVuY3Rpb24obnVtYmVyLCBkaWdpdHMgPSBudWxsKSB7XG4gIHJldHVybiBkaWdpdHMgPT09IG51bGxcbiAgICA/IG51bWJlci50b1N0cmluZygpXG4gICAgOiBudW1iZXIudG9GaXhlZChkaWdpdHMpO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIGB0cnVlYCBpZiB0ZXh0IG9yaWVudGVkIHdpdGggdGhlIGdpdmVuIGBhbmdsZVR1cm5gIHdvdWxkIGJlXG4qIHByaW50ZWQgdXByaWdodC5cbipcbiogQW5nbGUgdHVybiB2YWx1ZXMgaW4gdGhlIHJhbmdlIF9bMy80LCAxLzQpXyBhcmUgY29uc2lkZXJlZCB1cHJpZ2h0LlxuKlxuKiBAcGFyYW0ge051bWJlcn0gYW5nbGVUdXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlIHRvIGNoZWNrXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gaXNVcHJpZ2h0VGV4dFxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5pc1VwcmlnaHRUZXh0ID0gZnVuY3Rpb24oYW5nbGVUdXJuKSB7XG4gIHJldHVybiBhbmdsZVR1cm4gPj0gMy80IHx8IGFuZ2xlVHVybiA8IDEvNDtcbn1cblxuIl19
