// RAC - ruler-and-compass - 1.3.0-dev 1350-535b27d 2023-10-13T06:12:05.522Z
// Development distribution with sourcemaps
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
  build: '1350-535b27d',

  /**
  * Date of build of the package. Exposed through
  * [`Rac.dated`]{@link Rac.dated}.
  * @constant {String} dated
  * @memberof versioning#
  */
  dated: '2023-10-13T06:12:05.522Z'
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


},{"../built/versioning":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/Controller":7,"./control/RayControl":8,"./drawable/Angle":9,"./drawable/Arc":10,"./drawable/Bezier":11,"./drawable/Composite":12,"./drawable/Point":13,"./drawable/Ray":14,"./drawable/Segment":15,"./drawable/Shape":16,"./drawable/Text":18,"./drawable/instance.Angle":19,"./drawable/instance.Arc":20,"./drawable/instance.Bezier":21,"./drawable/instance.Point":22,"./drawable/instance.Ray":23,"./drawable/instance.Segment":24,"./drawable/instance.Text":26,"./drawable/instance.Text.Format":25,"./p5Drawer/P5Drawer":28,"./style/Color":34,"./style/Fill":35,"./style/Stroke":36,"./style/StyleContainer":37,"./style/instance.Color":38,"./style/instance.Fill":39,"./style/instance.Stroke":40,"./util/EaseFunction":41,"./util/Exception":42,"./util/utils":43}],3:[function(require,module,exports){
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
  * let angle = rac.Angle(0.2)
  * angle.rac === rac // true
  *
  * @param {Number} turn - The turn value of the angle, in the range `[O,1)`
  * @returns {Rac.Angle}
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
  * let ray = rac.Ray(55, 77, 0.2)
  * ray.rac === rac // true
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Rac.Angle|Number} angle
  *
  * @returns {Rac.Ray}
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
  * let segment = rac.Segment(55, 77, 0.2, 100)
  * segment.rac === rac // true
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Rac.Angle|Number} angle
  * @param {Number} length
  *
  * @returns {Rac.Segment}
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
  * let arc = rac.Arc(55, 77, 0.2)
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
  * let text = rac.Text(55, 77, 'black quartz')
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
  * @function Text
  * @memberof Rac#
  */
  rac.Text = function makeText(x, y, string, format = this.Text.Format.topLeft) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
  };


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
  * let format = rac.Text.Format('left', 'baseline', 0.2)
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
  * @param {Number} [hPadding=0] - The horizontal padding, left-to-right
  * @param {Number} [vPadding=0] - The vertical padding, top-to-bottom
  *
  * @returns {Rac.Text.Format}
  *
  * @function TextFormat
  * @memberof Rac#
  */
  rac.TextFormat = function makeTextFormat(
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null,
    hPadding = 0,
    vPadding = 0)
  {
    // This functions uses `rac` instead of `this`, since `this` may point
    // to different objects:
    // + `rac` in this function body
    // + `rac.Text` in the `Text.Format` alias bellow
    angle = Rac.Angle.from(rac, angle);
    return new Rac.Text.Format(
      rac,
      hAlign, vAlign,
      angle, font, size,
      hPadding, vPadding);
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
  * @param {Number} [hPadding=0] - The horizontal padding, left-to-right
  * @param {Number} [vPadding=0] - The vertical padding, top-to-bottom
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


  /**
  * Convenience function to create a new `Composite`. The created
  * `composite.rac` is setup with `this`.
  *
  * @example
  * let rac = new Rac()
  * let composite = rac.Composite()
  * composite.rac === rac // true
  *
  * @param {Array} sequence - An array of drawable objects to contain
  *
  * @returns {Rac.Composite}
  *
  * @function Composite
  * @memberof Rac#
  */
  rac.Composite = function makeComposite(sequence = []) {
    return new Rac.Composite(this, sequence);
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


},{"./util/utils":43}],5:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],6:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],7:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],8:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],9:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Angle measured through a `turn` value in the range *[0,1)* that
* represents the amount of turn in a full circle.
*
* Most functions through RAC that can receive an `Angle` parameter can
* also receive a `number` value that is used as `turn` to instantiate a new
* `Angle`. The main exception to this behaviour are constructors,
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
  * This method considers turn values in the oposite ends of the range
  * *[0,1)* as equals. E.g. `Angle` objects with `turn` values of `0` and
  * `1 - rac.unitaryEqualityThreshold/2` are considered equal.
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
  * Returns a new `Angle` result of adding `angle` to `this`, in the
  * given `clockwise` orientation.
  *
  * This operation is equivalent to shifting `angle` where `this` is
  * considered the angle of origin.
  *
  * The return is equivalent to:
  * + `this.add(angle)` when clockwise
  * + `this.subtract(angle)` when counter-clockwise
  *
  * @example
  * rac.Angle(0.1).shift(0.5, true).turn
  * // returns 0.6, since 0.5 + 0.1 = 0.6
  *
  * rac.Angle(0.1).shift(0.5, false).turn
  * // returns 0.4, since 0.5 - 0.1 = 0.4
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
  * Returns a new `Angle` result of adding `this` to `origin`, in the given
  * `clockwise` orientation.
  *
  * This operation is equivalent to shifting `this` where `origin` is
  * considered the angle of origin.
  *
  * The return is equivalent to:
  * + `origin.add(this)` when clockwise
  * + `origin.subtract(this)` when counter-clockwise
  *
  * @example
  * rac.Angle(0.1).shiftToOrigin(0.5, true).turn
  * // returns 0.6, since 0.5 + 0.1 = 0.6
  *
  * rac.Angle(0.1).shiftToOrigin(0.5, false).turn
  * // returns 0.4, since 0.5 - 0.1 = 0.4
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


},{"../Rac":2,"../util/utils":43}],10:[function(require,module,exports){
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
  * @example
  * rac.Arc(55, 77, 0.2, 0.4, 100).toString()
  * // returns: 'Arc((55,77) r:100 s:0.2 e:0.4 c:true)'
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
    return `Arc((${xStr},${yStr}) r:${radiusStr} s:${startStr} e:${endStr} c:${this.clockwise})`;
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


  // TODO: replace `in the orientation` to `towards the arc's orientation`?
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
  * will be reduced into range through a modulo operation.
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
  * Returns a new `Arc` with `increment` added to the part of the
  * circumference `this` represents. This changes `end` for the
  * new `Arc`.
  *
  * All other properties are copied from `this`.
  *
  * The actual `length()` of the resulting `Arc` will always be in the
  * range `[0,radius*TAU)`. When the resulting length is larger that the
  * circumference of the arc as a complete circle, the resulting arc length
  * will be reduced into range through a modulo operation.
  *
  * @see [`length`]{@link Rac.Arc#length}
  *
  * @param {Number} increment - The length to add
  * @returns {Rac.Arc}
  */
  withLengthAdd(increment) {
    const newAngleDistance = (this.length() + increment) / this.circumference();
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
  * will be reduced into range through a modulo operation.
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
  * Returns a new `Arc` with `start` [shifted by]{@link Rac.Angle#shift}
  * the given `angle` towards the arc's opposite orientation.
  *
  * All other properties are copied from `this`.
  *
  * Notice that this method shifts `start` towards the arc's *opposite*
  * orientation, resulting in a new `Arc` with an increase to
  * `angleDistance()`.
  *
  * @see [`angle.shift`]{@link Rac.Angle#shift}
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
  * Returns a new `Arc` with `end` [shifted by]{@link Rac.Angle#shift} the
  * given `angle` towards the arc's orientation.
  *
  * All other properties are copied from `this`.
  *
  * Notice that this method shifts `end` towards the arc's orientation,
  * resulting in a new `Arc` with an increase to `angleDistance()`.
  *
  * @see [`angle.shift`]{@link Rac.Angle#shift}
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


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Arc` with `start` and `end` [shifted by]{@link Rac.Angle#shift}
  * the given `angle` towards the arc's orientation.
  *
  * Notice that this method shifts both `start` and `end` towards the arc's
  * orientation, resulting in a new `Arc` with the same `angleDistance()`.
  *
  * @see [`angle.shift`]{@link Rac.Angle#shift}
  *
  * @example
  * <caption>For a clockwise arc</caption>
  * let arc = rac.Arc(0, 0, 0.4, 0.6, true)
  * let shiftedArc = arc.shift(0.1)
  * shiftedArc.start.turn // returns 0.5
  * shiftedArc.end.turn   // returns 0.7
  *
  * @example
  * <caption>For a counter-clockwise arc</caption>
  * let arc = rac.Arc(0, 0, 0.4, 0.6, false)
  * let shiftedArc = arc.shift(0.1)
  * shiftedArc.start.turn // returns 0.3
  * shiftedArc.end.turn   // returns 0.5
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to shift the arc by
  * @returns {Rac.Arc}
  */
  shift(angle) {
    const newStart = this.start.shift(angle, this.clockwise);
    const newEnd = this.end.shift(angle, this.clockwise);

    return new Arc(this.rac,
      this.center, this.radius,
      newStart, newEnd,
      this.clockwise);
  }


  /**
  * Returns a new `Angle` with `angle` [shifted by]{@link Rac.Angle#shift}
  * `start` towards the arc's orientation.
  *
  * @see [`angle.shift`]{@link Rac.Angle#shift}
  *
  * @example
  * <caption>For a clockwise arc starting at <code>0.5</code></caption>
  * let arc = rac.Arc(0, 0, 0.5, null, true)
  * arc.shiftAngle(0.1).turn
  * // returns 0.6, since 0.5 + 0.1 = 0.6
  *
  * @example
  * <caption>For a counter-clockwise arc starting at <code>0.5</code></caption>
  * let arc = rac.Arc(0, 0, 0.5, null, false)
  * arc.shiftAngle(0.1).turn
  * // returns 0.4, since 0.5 - 0.1 = 0.4
  *
  * @param {Rac.Angle|Number} angle - An `Angle` to shift
  * @returns {Rac.Angle}
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


  // TODO: check other instances of `arc is considered` and add note of
  // the possible impact, using this as example
  /**
  * Returns a new `Point` located in the arc at the given `angle`
  * [shifted by]{@link Rac.Angle#shift} `start` towards the arc's
  * orientation.
  *
  * For this operation the arc is considered a complete circle, the
  * returned `Point` may be outside the arc's bounds.
  *
  * @see [`angle.shift`]{@link Rac.Angle#shift}
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
  * The resulting `Segment` will point towards `this` orientation.
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
  * The resulting `Segment` will always have the same angle as `ray`.
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
  * there is no intersection. The resulting `Arc` will have the same center,
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
  * When `format` is ommited or `null`, the format used for the resulting
  * `Text` will be:
  * + [`rac.Text.Format.bottomLeft`]{@link instance.Text.Format#bottomLeft}
  * format for arcs with `clockwise` orientation set to `true`
  * + [`rac.Text.Format.topLeft`]{@link instance.Text.Format#topLeft}
  * format for arcs with `clockwise` orientation set to `false`
  *
  * When `format` is provided, the angle for the resulting `Text` will
  * still be set to `startTangentRay().angle`.
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


},{"../Rac":2,"../util/utils":43}],11:[function(require,module,exports){
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

} // class Bezier


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


},{"../Rac":2,"../util/utils":43}],12:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of a sequence of drawable objects that can be drawn together.
*
* Used by `[P5Drawer]{@link Rac.P5Drawer}` to perform specific vertex
* operations with drawables to draw complex shapes.
*
* @alias Rac.Composite
*/
class Composite {

  /**
  * Creates a new `Composite` instance.
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {Array} [sequence]
  *   An array of drawable objects to contain
  */
  constructor(rac, sequence = []) {
    utils.assertExists(rac, sequence);

    this.rac = rac;
    this.sequence = sequence;
  }

} // class Composite


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


},{"../Rac":2,"../util/utils":43}],13:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
*
* Several methods return an adjusted value or perform adjustments in their
* operation when two points are close enough as to be considered equal.
* When the the difference of each coordinate of two points is under the
* [`equalityThreshold`]{@link Rac#equalityThreshold} the points are
* considered equal. The [`equals`]{@link Rac.Point#equals} method performs
* this check.
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
  * the resulting `Ray` uses the angle produced with `defaultAngle`.
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
  * [considered equal]{@link Rac.Point#equals} the resulting `Ray` defaults
  * to an angle perpendicular to `ray` in the clockwise direction.
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
  * The resulting `Ray` is in the `clockwise` side of the ray formed
  * from `this` towards `arc.center`. `arc` is considered a complete
  * circle.
  *
  * When `this` is inside `arc`, returns `null` since no tangent segment is
  * possible.
  *
  * A special case is considered when `arc.radius` is considered to be `0`
  * and `this` is equal to `arc.center`. In this case the angle between
  * `this` and `arc.center` is assumed to be the inverse of `arc.start`,
  * thus the resulting `Ray` defaults to an angle perpendicular to
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
  * the resulting `Segment` defaults to the angle produced with
  * `defaultAngle`.
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
  * When the projected point is equal to `this`, the resulting `Segment`
  * defaults to an angle perpendicular to `ray` in the clockwise direction.
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
  * The resulting `Segment` is in the `clockwise` side of the ray formed
  * from `this` towards `arc.center`, and ends at the contact point with
  * `arc` which is considered as a complete circle.
  *
  * When `this` is inside `arc`, returns `null` since no tangent segment is
  * possible.
  *
  * A special case is considered when `arc.radius` is considered to be `0`
  * and `this` is equal to `arc.center`. In this case the angle between
  * `this` and `arc.center` is assumed to be the inverse of `arc.start`,
  * thus the resulting `Segment` defaults to an angle perpendicular to
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


},{"../Rac":2,"../util/utils":43}],14:[function(require,module,exports){
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
  * @example
  * rac.Ray(55, 77, 0.2).toString()
  * // returns: 'Ray((55,77) a:0.2)'
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
  * Returns a new `Ray` with `increment` added to `this.angle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} increment - The angle to add
  * @returns {Rac.Ray}
  */
  withAngleAdd(increment) {
    let newAngle = this.angle.add(increment);
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
  * The resulting distance is positive when the projected point is towards
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
  * When `format` is provided, the angle for the resulting `Text` will
  * still be set to `angle`.
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


},{"../Rac":2,"../util/utils":43}],15:[function(require,module,exports){
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
  * @param {Rac.Ray} ray - A `Ray` the segment is based of
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
  * @example
  * rac.Segment(55, 77, 0.2, 100).toString()
  * // returns: 'Segment((55,77) a:0.2 l:100)'
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
  * Returns a new `Segment` with `increment` added to `length`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Number} increment - The length to add
  * @returns {Rac.Segment}
  */
  withLengthAdd(increment) {
    return new Segment(this.rac, this.ray, this.length + increment);
  }


  /**
  * Returns a new `Segment` with a length of `length * ratio`.
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
  * Returns a new `Segment` with `increment` added to `ray.angle`.
  *
  * All other properties are copied from `this`.
  *
  * @param {Rac.Angle|Number} increment - The angle to add
  * @returns {Rac.Segment}
  */
  withAngleAdd(increment) {
    const newRay = this.ray.withAngleAdd(increment);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with `angle` set to
  * `ray.[angle.shift]{@link Rac.Angle#shift}(angle, clockwise)`.
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
  * Returns a new `Segment` with the start point translated against the
  * segment's ray by the given `distance`, while keeping the same
  * `endPoint()`. The resulting segment keeps the same angle as `this`.
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
  * Returns a new `Segment` with `distance` added to `length`, which
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
  * Returns a new `Segment` pointing towards
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}`.
  *
  * The resulting `Segment` keeps the same start and length as `this`.
  *
  * @returns {Rac.Segment}
  */
  inverse() {
    const newRay = this.ray.inverse();
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` pointing towards the
  * [perpendicular angle]{@link Rac.Angle#perpendicular} of
  * `ray.angle` in the `clockwise` orientation.
  *
  * The resulting `Segment` keeps the same start and length as `this`.
  *
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  *
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  perpendicular(clockwise = true) {
    const newRay = this.ray.perpendicular(clockwise);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` starting at `endPoint()` and ending at
  * `startPoint()`.
  *
  * The resulting `Segment` uses the [inverse]{@link Rac.Angle#inverse}
  * angle to `ray.angle` and keeps the same length as `this`.
  *
  * @returns {Rac.Segment}
  */
  reverse() {
    const end = this.endPoint();
    const inverseRay = new Rac.Ray(this.rac, end, this.ray.angle.inverse());
    return new Segment(this.rac, inverseRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point translated by `distance`
  * towards the given `angle`, and keeping the same angle and length as
  * `this`.
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
  * Returns a new `Segment` with the start point translated by `distance`
  * along the segment's ray, and keeping the same angle and length as
  * `this`.
  *
  * When `distance` is negative, the resulting `Segment` is translated in
  * the opposite direction of the segment's ray.
  *
  * @see [`ray.translateToDistance`]{@link Rac.Ray#translateToDistance}
  *
  * @param {Number} distance - The distance to move the start point by
  * @returns {Rac.Segment}
  */
  translateToLength(distance) {
    const newRay = this.ray.translateToDistance(distance);
    return new Segment(this.rac, newRay, this.length);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Segment` with the start point translated along the
  * segment's ray by a distance of `length * ratio`. The resulting segment
  * keeps the same angle and length as `this`.
  *
  * When `ratio` is negative, the resulting `Segment` is translated in the
  * opposite direction of the segment's ray.
  *
  * @see [`ray.translateToDistance`]{@link Rac.Ray#translateToDistance}
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Segment}
  */
  translateToLengthRatio(ratio) {
    const newRay = this.ray.translateToDistance(this.length * ratio);
    return new Segment(this.rac, newRay, this.length);
  }


  /**
  * Returns a new `Segment` with the start point translated by `distance`
  * towards the perpendicular of `ray.angle` in the `clockwise` orientaton.
  * The resulting segment keeps the same angle and length as `this`.
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
  * is centered between the range limits and still clampled to `[0, length]`.
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
  * Returns a new `Point` along the segment's ray at the given `distance`
  * from `ray.start`.
  *
  * When `distance` is negative, the resulting `Point` is located in the
  * opposite direction of the segment's ray.
  *
  * @see [`ray.pointAtDistance`]{@link Rac.Ray#pointAtDistance}
  *
  * @param {Number} distance - The distance from `startPoint()`
  * @returns {Rac.Point}
  */
  pointAtLength(distance) {
    return this.ray.pointAtDistance(distance);
  }


  /**
  * Returns a new `Point` along the segment's ray at a distance of
  * `length * ratio` from `ray.start`. When `ratio` is negative, the
  * resulting `Point` is located in the opposite direction of the
  * segment's ray.
  *
  * @see [`ray.pointAtDistance`]{@link Rac.Ray#pointAtDistance}
  *
  * @param {Number} ratio - The factor to multiply `length` by
  * @returns {Rac.Point}
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
  * `endPoint()`.
  *
  * When `newStartPoint` and `endPoint()` are considered
  * [equal]{@link Rac.Point#equals}, the resulting `Segment` defaults
  * to `ray.angle`.
  *
  * @param {Rac.Point} newStartPoint - The start point of the new `Segment`
  * @returns {Rac.Segment}
  */
  moveStartPoint(newStartPoint) {
    const endPoint = this.endPoint();
    return newStartPoint.segmentToPoint(endPoint, this.ray.angle);
  }


  /**
  * Returns a new `Segment` starting at `startPoint()` and ending at
  * `newEndPoint`.
  *
  * When `startPoint()` and `newEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the resulting `Segment` defaults to
  * `ray.angle`.
  *
  * @param {Rac.Point} newEndPoint - The end point of the new `Segment`
  * @returns {Rac.Segment}
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
  * The resulting `Segment` uses `newLength`, or when ommited or `null`
  * defaults to `length` instead.
  *
  * @see [`pointAtBisector`]{@link Rac.Segment#pointAtBisector}
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  *
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @param {Boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  */
  segmentBisector(newLength = null, clockwise = true) {
    const newStart = this.pointAtBisector();
    const newAngle = this.ray.angle.perpendicular(clockwise);
    const newRay = new Rac.Ray(this.rac, newStart, newAngle);
    newLength = newLength === null
      ? this.length
      : newLength;
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()`, with the given
  * `newLength`, and keeping the same angle as `this`.
  *
  * @param {Number} newLength - The length of the next `Segment`
  * @returns {Rac.Segment}
  */
  nextSegmentWithLength(newLength) {
    const newStart = this.endPoint();
    const newRay = this.ray.withStart(newStart);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and ending at
  * `nextEndPoint`.
  *
  * When `endPoint()` and `nextEndPoint` are considered
  * [equal]{@link Rac.Point#equals}, the resulting `Segment` defaults
  * to `ray.angle`.
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
  * Returns a new `Segment` starting from `endPoint()` and towards `angle`.
  *
  * The resulting `Segment` uses `newLength`, or when ommited or `null`
  * defaults to `length` instead.
  *
  * @param {Rac.Angle|Number} angle - The angle of the new `Segment`
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @returns {Rac.Segment}
  */
  nextSegmentToAngle(angle, newLength = null) {
    angle = Rac.Angle.from(this.rac, angle);
    newLength = newLength === null
      ? this.length
      : newLength;
    const newStart = this.endPoint();
    const newRay = new Rac.Ray(this.rac, newStart, angle);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` and pointing towards
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}` shifted by
  * `angleDistance` in the `clockwise` orientation.
  *
  * The resulting `Segment` uses `newLength`, when ommited or
  * `null` defaults to `length` instead.
  *
  * Notice that the `angleDistance` is applied to the
  * [inverse]{@link Rac.Angle#inverse} of the segment's angle. E.g. with
  * an `angleDistance` of `0` the resulting `Segment` is directly over and
  * pointing in the inverse angle of `this`. As the `angleDistance`
  * increases the two segments separate with the pivot at `endPoint()`.
  *
  * @param {Rac.Angle|Number} angleDistance - An angle distance to apply to
  * the segment's angle inverse
  * @param {Boolean} [clockwise=true] - The orientation of the angle shift
  * from `endPoint()`
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @returns {Rac.Segment}
  */
  nextSegmentToAngleDistance(angleDistance, clockwise = true, newLength = null) {
    angleDistance = this.rac.Angle.from(angleDistance);
    newLength = newLength === null ? this.length : newLength;
    const newRay = this.ray
      .translateToDistance(this.length)
      .inverse()
      .withAngleShift(angleDistance, clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` starting from `endPoint()` towards the
  * `[perpendicular angle]{@link Rac.Angle#perpendicular}` of
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}` in the `clockwise`
  * orientation.
  *
  * The resulting `Segment` uses `newLength`, when ommited or `null`
  * defaults to `length` instead.
  *
  * Notice that the perpendicular is calculated from the
  * [inverse]{@link Rac.Angle#inverse} of the segment's angle. E.g. with
  * `clockwise` as `true`, the resulting `Segment` points towards
  * `ray.angle.perpendicular(false)`.
  *
  * @see [`angle.perpendicular`]{@link Rac.Angle#perpendicular}
  *
  * @param {Boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @param {?Number} [newLength=null] - The length of the new `Segment`, or
  * `null` to use `length`
  * @returns {Rac.Segment}
  */
  nextSegmentPerpendicular(clockwise = true, newLength = null) {
    newLength = newLength === null ? this.length : newLength;
    const newRay = this.ray
      .translateToDistance(this.length)
      .perpendicular(!clockwise);
    return new Segment(this.rac, newRay, newLength);
  }


  /**
  * Returns a new `Segment` that starts from `endPoint()` and corresponds
  * to the leg of a right triangle where `this` is the other cathetus and
  * the hypotenuse is of length `hypotenuse`.
  *
  * The resulting `Segment` points towards the perpendicular angle of
  * `ray.angle.[inverse()]{@link Rac.Angle#inverse}` in the `clockwise`
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
  * The resulting `Arc` is centered at `ray.start`, starting at
  * `ray.angle`, and with a radius of `length`.
  *
  * When `endAngle` is ommited or `null`, the segment's angle is used
  * instead resulting in a complete-circle arc.
  *
  * @param {?Rac.Angle} [endAngle=null] - An `Angle` to use as end for the
  * new `Arc`, or `null` to use `ray.angle`
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
  * The resulting `Arc` is centered at `ray.start`, starting at
  * `ray.angle`, and with a radius of `length`.
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
  * When `format` is provided, the angle for the resulting `Text` is still
  * set to `ray.angle`.
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


},{"../Rac":2,"../util/utils":43}],16:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],17:[function(require,module,exports){
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
  * @param {?String} [font=null]
  *   The font name
  * @param {?Number} [size=null]
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
  * rac.Text.Format('left', 'top', 0.2, 'sans', 14, 7, 5)).toString()
  * // returns: 'Text.Format(ha:left va:top a:0.2 f:"sans" s:14 p:(7,5))'
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
    const hPaddingStr = utils.cutDigits(this.hPadding, digits);
    const vPaddingStr = utils.cutDigits(this.vPadding, digits);
    const paddingsStr = `${hPaddingStr},${vPaddingStr}`
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${fontStr} s:${sizeStr} p:(${paddingsStr}))`;
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


  /**
  * Returns a new `Text.Format` with paddings set to the given values.
  *
  * When only `hPadding` is provided, that value is used for both
  * horizontal and vertical padding.
  *
  * @param {Number} hPadding - The horizontal padding for the new `Text.Format`
  * @param {Number} [vPadding] - The vertical padding for the new `Text.Format`;
  *   when ommited, `hPadding` is used instead
  *
  * @returns {Rac.Text.Format}
  */
  withPaddings(hPadding, vPadding = null) {
    if (vPadding === null) {
      vPadding = hPadding;
    }
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle, this.font, this.size,
      hPadding, vPadding);
  }


  /**
  * Returns a new `Text.Format` that formats a text reversed, upside-down,
  * generally in the same position as `this`.
  *
  * The resulting `Format` will be oriented towards the
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


},{"../Rac":2,"../util/utils":43}],18:[function(require,module,exports){
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
  * rac.Text(55, 77, 'sphinx of black quartz').toString()
  * // returns 'Text((55,77) "sphinx of black quartz")'
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
  * When only `hPadding` is provided, that value is used for both
  * horizontal and vertical padding.
  *
  * @param {Number} hPadding - The horizontal padding for the new `Text`
  *   and `Text.Format`
  * @param {Number} [vPadding] - The vertical padding for the new `Text`
  *   and `Text.Format`; when ommited, `hPadding` is used instead
  *
  * @returns {Rac.Text.Format}
  */
  withPaddings(hPadding, vPadding = null) {
    const newFormat = this.format.withPaddings(hPadding, vPadding);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: Unit Test and Visual Test
  /**
  * Returns a new `Text` which is an upside-down equivalent of `this`
  * and generally in the same location.
  *
  * The resulting `Text` is at the same location as `this`, using a
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


},{"../Rac":2,"../util/utils":43,"./Text.Format":17}],19:[function(require,module,exports){
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
  rac.Angle.eighth = rac.Angle(1/8);

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
  rac.Angle.neighth = rac.Angle(-1/8);


  /**
  * An `Angle` with turn `1/16`.
  *
  * @name sixteenth
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.sixteenth = rac.Angle(1/16);


  /**
  * An `Angle` with turn `1/10`.
  *
  * @name tenth
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.tenth = rac.Angle(1/10);

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
module.exports = function attachRacTextFormat(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.TextFormat` and `rac.Text.Format` are attached in
  // `attachInstanceFunctions.js`.


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

} // attachRacTextFormat


},{"../Rac":2}],26:[function(require,module,exports){
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


},{"../Rac":2}],27:[function(require,module,exports){


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


},{"./Rac":2}],28:[function(require,module,exports){
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

    // Returns calling angle
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

    // Returns calling point
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


},{"../Rac":2,"../util/utils":43,"./Point.functions":29,"./Ray.functions":30,"./Segment.functions":31,"./debug.functions":32,"./draw.functions":33}],29:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],30:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function attachRayFunctions(rac) {

  /**
  * Returns a new `Point` located where the ray touches the canvas edge.
  *
  * When the ray is outside the canvas and pointing away, returns `null`
  * since no point in the canvas is possible.
  *
  * Added to `Rac.Ray.prototype` when `{@link Rac.P5Drawer}` is setup as
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
  * When the ray is outside the canvas and pointing away, returns `null`
  * since no point in the canvas is possible.
  *
  * Added to `Rac.Ray.prototype` when `{@link Rac.P5Drawer}` is setup as
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


},{"../Rac":2,"../util/utils":43}],31:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],32:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


// Creates and restores the drawing context for a dashed stroke while
// `closure` is called.
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
  if (drawsText !== true) return;

  let format = new Rac.Text.Format(rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size,
    markerRadius*2, 0);

  // Turn text
  let turnString = `turn:${angle.turn.toFixed(digits)}`;
  point.text(turnString, format)
    .upright()
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
  if (drawsText !== true) return;

  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top,
    rac.Angle.e,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size,
    pointRadius, pointRadius);

  let string = `x:${point.x.toFixed(digits)}\ny:${point.y.toFixed(digits)}`;
  point.text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


// Shared text drawing for ray and segment
function drawRayTexts(drawer, ray, topString, bottomString) {
  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;
  const font        = drawer.debugTextOptions.font;
  const size        = drawer.debugTextOptions.size;
  const pointRadius = drawer.debugPointRadius;

  let topFormat = new Rac.Text.Format(
    drawer.rac,
    hEnum.left, vEnum.bottom,
    ray.angle, font, size,
    pointRadius, pointRadius);
  let bottomFormat = new Rac.Text.Format(
    drawer.rac,
    hEnum.left, vEnum.top,
    ray.angle, font, size,
    pointRadius, pointRadius);

  // Texts
  ray.text(topString, topFormat)
    .upright()
    .draw(drawer.debugTextStyle);
  ray.text(bottomString, bottomFormat)
    .upright()
    .draw(drawer.debugTextStyle);
};


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
  if (drawsText !== true) return;

  const digits = drawer.debugTextOptions.fixedDigits;
  const startString = `start:(${ray.start.x.toFixed(digits)},${ray.start.y.toFixed(digits)})`;
  const angleString = `angle:${ray.angle.turn.toFixed(digits)}`;
  drawRayTexts(drawer, ray, startString, angleString);
}; // debugRay


exports.debugSegment = function(drawer, segment, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

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
  if (drawsText !== true) return;

  const digits = drawer.debugTextOptions.fixedDigits;
  let lengthString = `length:${segment.length.toFixed(digits)}`;
  let angleString  = `angle:${segment.ray.angle.turn.toFixed(digits)}`;
  drawRayTexts(drawer, segment.ray, lengthString, angleString);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

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
  if (drawsText !== true) return;

  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;
  const font   = drawer.debugTextOptions.font;
  const size   = drawer.debugTextOptions.size;
  const digits = drawer.debugTextOptions.fixedDigits;

  let headVertical = arc.clockwise
    ? vEnum.top
    : vEnum.bottom;
  let tailVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;
  let radiusVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;

  let headFormat = new Rac.Text.Format(rac,
    hEnum.left, headVertical,
    arc.start,
    font, size,
    pointRadius, 0);
  let tailFormat = new Rac.Text.Format(rac,
    hEnum.left, tailVertical,
    arc.end,
    font, size,
    pointRadius, 0);
  let radiusFormat = new Rac.Text.Format(rac,
    hEnum.left, radiusVertical,
    arc.start,
    font, size,
    markerRadius, pointRadius);

  let startString  = `start:${arc.start.turn.toFixed(digits)}`;
  let radiusString = `radius:${arc.radius.toFixed(digits)}`;
  let endString    = `end:${arc.end.turn.toFixed(digits)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${angleDistance.turn.toFixed(digits)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  const endIsAway = angleDistance.turn <= 3/4 || angleDistance.equals(3/4);
  if (endIsAway && !arc.isCircle()) {
    // Radius drawn separately
    headString = startString;
    arc.center
      .text(radiusString, radiusFormat)
      .upright()
      .draw(drawer.debugTextStyle);

  } else {
    // Radius joined to head
    headString = `${startString}\n${radiusString}`;
  }

  if (lengthAtOrientationArc > textJoinThreshold) {
    // Draw head and tail separately
    orientationArc.startPoint()
      .text(headString, headFormat)
      .upright()
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .text(tailString, tailFormat)
      .upright()
      .draw(drawer.debugTextStyle);
  } else {
    // Draw head and tail together
    let bothStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .text(bothStrings, headFormat)
      .upright()
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


},{"../Rac":2}],33:[function(require,module,exports){
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


},{"../Rac":2}],34:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],35:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],36:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],37:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],38:[function(require,module,exports){
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


},{"../Rac":2}],39:[function(require,module,exports){
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


},{}],40:[function(require,module,exports){
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


},{}],41:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":43}],42:[function(require,module,exports){
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


},{}],43:[function(require,module,exports){
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


},{"../Rac":2}]},{},[27])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uaW5nLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5Gb3JtYXQuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuRm9ybWF0LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3NENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Z4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNybEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlU3RyaWN0JztcblxuLy8gUnVsZXIgYW5kIENvbXBhc3MgLSB2ZXJzaW9uIGFuZCBidWlsZFxuLyoqXG4qIENvbnRhaW5lciBvZiB0aGUgdmVyc2lvbmluZyBkYXRhIGZvciB0aGUgcGFja2FnZS5cbiogQG5hbWVzcGFjZSB2ZXJzaW9uaW5nXG4qL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICogVmVyc2lvbiBvZiB0aGUgcGFja2FnZS4gRXhwb3NlZCB0aHJvdWdoXG4gICogW2BSYWMudmVyc2lvbmBde0BsaW5rIFJhYy52ZXJzaW9ufS5cbiAgKiBAY29uc3RhbnQge1N0cmluZ30gdmVyc2lvblxuICAqIEBtZW1iZXJvZiB2ZXJzaW9uaW5nI1xuICAqL1xuICB2ZXJzaW9uOiAnMS4zLjAtZGV2JyxcblxuICAvKipcbiAgKiBCdWlsZCBvZiB0aGUgcGFja2FnZS4gRXhwb3NlZCB0aHJvdWdoXG4gICogW2BSYWMuYnVpbGRgXXtAbGluayBSYWMuYnVpbGR9LlxuICAqIEBjb25zdGFudCB7U3RyaW5nfSBidWlsZFxuICAqIEBtZW1iZXJvZiB2ZXJzaW9uaW5nI1xuICAqL1xuICBidWlsZDogJzEzNTAtNTM1YjI3ZCcsXG5cbiAgLyoqXG4gICogRGF0ZSBvZiBidWlsZCBvZiB0aGUgcGFja2FnZS4gRXhwb3NlZCB0aHJvdWdoXG4gICogW2BSYWMuZGF0ZWRgXXtAbGluayBSYWMuZGF0ZWR9LlxuICAqIEBjb25zdGFudCB7U3RyaW5nfSBkYXRlZFxuICAqIEBtZW1iZXJvZiB2ZXJzaW9uaW5nI1xuICAqL1xuICBkYXRlZDogJzIwMjMtMTAtMTNUMDY6MTI6MDUuNTIyWidcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vLyBSdWxlciBhbmQgQ29tcGFzc1xuY29uc3QgdmVyc2lvbmluZyA9IHJlcXVpcmUoJy4uL2J1aWx0L3ZlcnNpb25pbmcnKVxuY29uc3QgdmVyc2lvbiA9IHZlcnNpb25pbmcudmVyc2lvbjtcbmNvbnN0IGJ1aWxkICAgPSB2ZXJzaW9uaW5nLmJ1aWxkO1xuY29uc3QgZGF0ZWQgICA9IHZlcnNpb25pbmcuZGF0ZWQ7XG5cblxuLyoqXG4qIFJvb3QgY2xhc3Mgb2YgUkFDLiBBbGwgZHJhd2FibGUsIHN0eWxlLCBjb250cm9sLCBhbmQgZHJhd2VyIGNsYXNzZXMgYXJlXG4qIGNvbnRhaW5lZCBpbiB0aGlzIGNsYXNzLlxuKlxuKiBBbiBpbnN0YW5jZSBtdXN0IGJlIGNyZWF0ZWQgd2l0aCBgbmV3IFJhYygpYCBpbiBvcmRlciB0b1xuKiBidWlsZCBkcmF3YWJsZSwgc3R5bGUsIGFuZCBvdGhlciBvYmplY3RzLlxuKlxuKiBUbyBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucywgYSBkcmF3ZXIgbXVzdCBiZSBzZXR1cCB3aXRoXG4qIFtgc2V0dXBEcmF3ZXJgXXtAbGluayBSYWMjc2V0dXBEcmF3ZXJ9LiBDdXJyZW50bHkgdGhlIG9ubHkgYXZhaWxhYmxlXG4qIGltcGxlbWVudGF0aW9uIGlzIFtgUDVEcmF3ZXJgXXtAbGluayBSYWMuUDVEcmF3ZXJ9LlxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIGVxdWl2YWxlbnQgdG8gYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMudmVyc2lvbiAvLyByZXR1cm5zIEUuZy4gJzEuMi4xJ1xuICAgICpcbiAgICAqIEBjb25zdGFudCB7U3RyaW5nfSB2ZXJzaW9uXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAndmVyc2lvbicsIHZlcnNpb24pO1xuXG5cbiAgICAvKipcbiAgICAqIEJ1aWxkIG9mIHRoZSBpbnN0YW5jZSwgZXF1aXZhbGVudCB0byBge0BsaW5rIFJhYy5idWlsZH1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMuYnVpbGQgLy8gcmV0dXJucyBFLmcuICcxMDU3LTk0YjA1OWQnXG4gICAgKlxuICAgICogQGNvbnN0YW50IHtTdHJpbmd9IGJ1aWxkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuICAgIC8qKlxuICAgICogRGF0ZSBvZiB0aGUgYnVpbGQgb2YgdGhlIGluc3RhbmNlLCBlcXVpdmFsZW50IHRvIGB7QGxpbmsgUmFjLmRhdGVkfWAuXG4gICAgKlxuICAgICogQGV4YW1wbGVcbiAgICAqIHJhYy5kYXRlZCAvLyByZXR1cm5zIEUuZy4gJzIwMjItMTAtMTNUMjM6MDY6MTIuNTAwWidcbiAgICAqXG4gICAgKiBAY29uc3RhbnQge1N0cmluZ30gZGF0ZWRcbiAgICAqIEBtZW1iZXJvZiBSYWMjXG4gICAgKi9cbiAgICB1dGlscy5hZGRDb25zdGFudFRvKHRoaXMsICdkYXRlZCcsIGRhdGVkKTtcblxuXG4gICAgLyoqXG4gICAgKiBWYWx1ZSB1c2VkIHRvIGRldGVybWluZSBlcXVhbGl0eSBiZXR3ZWVuIHR3byBudW1lcmljIHZhbHVlcy4gVXNlZCBmb3JcbiAgICAqIHZhbHVlcyB0aGF0IHRlbmQgdG8gYmUgaW50ZWdlcnMsIGxpa2Ugc2NyZWVuIGNvb3JkaW5hdGVzLiBVc2VkIGJ5XG4gICAgKiBbYGVxdWFsc2Bde0BsaW5rIFJhYyNlcXVhbHN9LlxuICAgICpcbiAgICAqIFdoZW4gY2hlY2tpbmcgZm9yIGVxdWFsaXR5IGB4YCBpcyBlcXVhbCB0byBub24taW5jbHVzaXZlXG4gICAgKiBgKHgtZXF1YWxpdHlUaHJlc2hvbGQsIHgrZXF1YWxpdHlUaHJlc2hvbGQpYDpcbiAgICAqICsgYHhgIGlzICoqbm90IGVxdWFsKiogdG8gYHggwrEgZXF1YWxpdHlUaHJlc2hvbGRgXG4gICAgKiArIGB4YCBpcyAqKmVxdWFsKiogdG8gYHggwrEgZXF1YWxpdHlUaHJlc2hvbGQvMmBcbiAgICAqXG4gICAgKiBEdWUgdG8gZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIHNvbWUgb3BlcnRhdGlvbiBsaWtlIGludGVyc2VjdGlvbnNcbiAgICAqIGNhbiByZXR1cm4gb2RkIG9yIG9zY2lsYXRpbmcgdmFsdWVzLiBUaGlzIHRocmVzaG9sZCBpcyB1c2VkIHRvIHNuYXBcbiAgICAqIHZhbHVlcyB0b28gY2xvc2UgdG8gYSBsaW1pdCwgYXMgdG8gcHJldmVudCBvc2NpbGF0aW5nIGVmZWN0cyBpblxuICAgICogdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBiYXNlZCBvbiBgMS8xMDAwYCBvZiBhIHBvaW50LlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwLjAwMVxuICAgICovXG4gICAgdGhpcy5lcXVhbGl0eVRocmVzaG9sZCA9IDAuMDAxO1xuXG5cbiAgICAvKipcbiAgICAqIFZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5IGJldHdlZW4gdHdvIHVuaXRhcnkgbnVtZXJpYyB2YWx1ZXMuXG4gICAgKiBVc2VkIGZvciB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGV4aXN0IGluIHRoZSBgWzAsIDFdYCByYW5nZSwgbGlrZVxuICAgICogW2BhbmdsZS50dXJuYF17QGxpbmsgUmFjLkFuZ2xlI3R1cm59LiBVc2VkIGJ5XG4gICAgKiBbYHVuaXRhcnlFcXVhbHNgXXtAbGluayBSYWMjdW5pdGFyeUVxdWFsc30uXG4gICAgKlxuICAgICogRXF1YWxpdHkgbG9naWMgaXMgdGhlIHNhbWUgYXNcbiAgICAqIFtgZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9LlxuICAgICpcbiAgICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzIGJhc2VkIG9uIDEvMTAwMCBvZiB0aGUgdHVybiBvZiBhbiBjb21wbGV0ZVxuICAgICogY2lyY2xlIGFyYyBvZiByYWRpdXMgNTAwOlxuICAgICogYGBgXG4gICAgKiAxLyg1MDAqNi4yOCkvMTAwMCA9IDAuMDAwXzAwMF8zMTg0NzEzMzhcbiAgICAqIGBgYFxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwLjAwMF8wMDBfM1xuICAgICovXG4gICAgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMDAwMDM7XG5cblxuICAgIC8qKlxuICAgICogQ29udGFpbmVyIG9mIHV0aWxpdHkgZnVuY3Rpb25zLiBTZWUgdGhlXG4gICAgKiBbYHV0aWxzYCBuYW1lc3BhY2Vde0BsaW5rIHV0aWxzfSBmb3IgdGhlIGF2YWlsYWJsZSBtZW1iZXJzLlxuICAgICpcbiAgICAqIEFsc28gYXZhaWxhYmxlIHRocm91Z2ggYHtAbGluayBSYWMudXRpbHN9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7dXRpbHN9XG4gICAgKi9cbiAgICB0aGlzLnV0aWxzID0gdXRpbHNcblxuICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICB0aGlzLnNoYXBlU3RhY2sgPSBbXTtcbiAgICB0aGlzLmNvbXBvc2l0ZVN0YWNrID0gW107XG5cblxuICAgIC8qKlxuICAgICogRGVmYXVsdHMgZm9yIHRoZSBvcHRpb25hbCBwcm9wZXJ0aWVzIG9mXG4gICAgKiBbYFRleHQuRm9ybWF0YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0fS5cbiAgICAqXG4gICAgKiBXaGVuIGEgW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IGlzIGRyYXcgd2hpY2hcbiAgICAqIFtgZm9ybWF0LmZvbnRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjZm9udH0gb3JcbiAgICAqIFtgZm9ybWF0LnNpemVgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjc2l6ZX0gYXJlIHNldCB0byBgbnVsbGAsIHRoZVxuICAgICogdmFsdWVzIHNldCBoZXJlIGFyZSB1c2VkIGluc3RlYWQuXG4gICAgKlxuICAgICogQHByb3BlcnR5IHs/U3RyaW5nfSBmb250PW51bGxcbiAgICAqICAgRGVmYXVsdCBmb250LCB1c2VkIHdoZW4gZHJhd2luZyBhIGBUZXh0YCB3aGljaFxuICAgICogICBbYGZvcm1hdC5mb250YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2ZvbnR9IGlzIHNldCB0byBgbnVsbGA7IHdoZW5cbiAgICAqICAgc2V0IHRvIGBudWxsYCB0aGUgZm9udCBpcyBub3Qgc2V0IHVwb24gZHJhd2luZ1xuICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNpemU9MTVcbiAgICAqICAgRGVmYXVsdCBzaXplLCB1c2VkIHdoZW4gZHJhd2luZyBhIGBUZXh0YCB3aGljaFxuICAgICogICBbYGZvcm1hdC5zaXplYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3NpemV9IGlzIHNldCB0byBgbnVsbGBcbiAgICAqXG4gICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICovXG4gICAgdGhpcy50ZXh0Rm9ybWF0RGVmYXVsdHMgPSB7XG4gICAgICBmb250OiBudWxsLFxuICAgICAgc2l6ZTogMTVcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAqIERyYXdlciBvZiB0aGUgaW5zdGFuY2UuIFRoaXMgb2JqZWN0IGhhbmRsZXMgdGhlIGRyYXdpbmcgZm9yIGFsbFxuICAgICogZHJhd2FibGUgb2JqZWN0IGNyZWF0ZWQgdXNpbmcgYHRoaXNgLlxuICAgICogQHR5cGUgez9PYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRyYXdlciA9IG51bGw7XG5cbiAgICByZXF1aXJlKCcuL2F0dGFjaEluc3RhbmNlRnVuY3Rpb25zJykodGhpcyk7XG5cbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkNvbG9yJykgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLlN0cm9rZScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkZpbGwnKSAgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFuZ2xlJykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50JykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlJheScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlNlZ21lbnQnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFyYycpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkJlemllcicpICh0aGlzKTtcblxuICAgIC8vIERlcGVuZHMgb24gaW5zdGFuY2UuUG9pbnQgYW5kIGluc3RhbmNlLkFuZ2xlIGJlaW5nIGFscmVhZHkgc2V0dXBcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuRm9ybWF0JykodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5UZXh0JykgICAgICAgKHRoaXMpO1xuXG5cblxuICAgIC8qKlxuICAgICogQ29udHJvbGxlciBvZiB0aGUgaW5zdGFuY2UuIFRoaXMgb2JqZWNzIGhhbmRsZXMgYWxsIG9mIHRoZSBjb250cm9sc1xuICAgICogYW5kIHBvaW50ZXIgZXZlbnRzIHJlbGF0ZWQgdG8gdGhpcyBpbnN0YW5jZSBvZiBgUmFjYC5cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBSYWMuQ29udHJvbGxlcih0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZHJhd2VyIGZvciB0aGUgaW5zdGFuY2UuIEN1cnJlbnRseSBvbmx5IGEgcDUuanMgaW5zdGFuY2UgaXNcbiAgKiBzdXBwb3J0ZWQuXG4gICpcbiAgKiBUaGUgZHJhd2VyIHdpbGwgYWxzbyBwb3B1bGF0ZSBzb21lIGNsYXNzZXMgd2l0aCBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICogcmVsZXZhbnQgdG8gdGhlIGRyYXdlci4gRm9yIHA1LmpzIHRoaXMgaW5jbHVkZSBgYXBwbHlgIGZ1bmN0aW9ucyBmb3JcbiAgKiBjb2xvcnMgYW5kIHN0eWxlIG9iamVjdCwgYW5kIGB2ZXJ0ZXhgIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgb2JqZWN0cy5cbiAgKlxuICAqIEBwYXJhbSB7UDV9IHA1SW5zdGFuY2VcbiAgKi9cbiAgc2V0dXBEcmF3ZXIocDVJbnN0YW5jZSkge1xuICAgIHRoaXMuZHJhd2VyID0gbmV3IFJhYy5QNURyYXdlcih0aGlzLCBwNUluc3RhbmNlKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIFtgZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9LlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGEgLSBGaXJzdCBudW1iZXIgdG8gY29tcGFyZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBiIC0gU2Vjb25kIG51bWJlciB0byBjb21wYXJlXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgZXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGxldCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIGBhYCBhbmQgYGJgIGlzXG4gICogdW5kZXIgW2B1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjdW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkfS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBhIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgU2Vjb25kIG51bWJlciB0byBjb21wYXJlXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgdW5pdGFyeUVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICBwdXNoU3RhY2sob2JqKSB7XG4gICAgdGhpcy5zdGFjay5wdXNoKG9iaik7XG4gIH1cblxuXG4gIHBlZWtTdGFjaygpIHtcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcFN0YWNrKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XG4gIH1cblxuXG4gIHB1c2hTaGFwZShzaGFwZSA9IG51bGwpIHtcbiAgICBzaGFwZSA9IHNoYXBlID8/IG5ldyBSYWMuU2hhcGUodGhpcyk7XG4gICAgdGhpcy5zaGFwZVN0YWNrLnB1c2goc2hhcGUpO1xuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG5cbiAgcGVla1NoYXBlKCkge1xuICAgIGlmICh0aGlzLnNoYXBlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaGFwZVN0YWNrW3RoaXMuc2hhcGVTdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wU2hhcGUoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNoYXBlU3RhY2sucG9wKCk7XG4gIH1cblxuXG4gIHB1c2hDb21wb3NpdGUoY29tcG9zaXRlKSB7XG4gICAgY29tcG9zaXRlID0gY29tcG9zaXRlID8/IG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMpO1xuICAgIHRoaXMuY29tcG9zaXRlU3RhY2sucHVzaChjb21wb3NpdGUpO1xuICAgIHJldHVybiBjb21wb3NpdGU7XG4gIH1cblxuXG4gIHBlZWtDb21wb3NpdGUoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3NpdGVTdGFja1t0aGlzLmNvbXBvc2l0ZVN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BDb21wb3NpdGUoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3NpdGVTdGFjay5wb3AoKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJhY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFjO1xuXG5cbi8vIEFsbCBjbGFzcyAoc3RhdGljKSBwcm9wZXJ0aWVzIHNob3VsZCBiZSBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIGNsYXNzXG4vLyBhcyB0byBwcmV2ZW50IGN5Y2xpYyBkZXBlbmRlbmN5IHdpdGggUmFjLlxuXG5cbi8qKlxuKiBDb250YWluZXIgb2YgdXRpbGl0eSBmdW5jdGlvbnMuIFNlZSB0aGUgW2B1dGlsc2AgbmFtZXNwYWNlXXtAbGluayB1dGlsc31cbiogZm9yIHRoZSBhdmFpbGFibGUgbWVtYmVycy5cbipcbiogQWxzbyBhdmFpbGFibGUgdGhyb3VnaCBbYHJhYy51dGlsc2Bde0BsaW5rIFJhYyN1dGlsc30uXG4qXG4qIEB2YXIge3V0aWxzfVxuKiBAbWVtYmVyb2YgUmFjXG4qL1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKGAuL3V0aWwvdXRpbHNgKTtcblJhYy51dGlscyA9IHV0aWxzO1xuXG5cbi8qKlxuKiBWZXJzaW9uIG9mIHRoZSBjbGFzcy4gRXF1aXZhbGVudCB0byB0aGUgdmVyc2lvbiB1c2VkIGZvciB0aGUgbnBtIHBhY2thZ2UuXG4qXG4qIEBleGFtcGxlXG4qIFJhYy52ZXJzaW9uIC8vIHJldHVybnMgRS5nLiAnMS4yLjEnXG4qXG4qIEBjb25zdGFudCB7U3RyaW5nfSB2ZXJzaW9uXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4vKipcbiogQnVpbGQgb2YgdGhlIGNsYXNzLiBJbnRlbmRlZCBmb3IgZGVidWdnaW5nIHB1cnBvdXNlcy5cbipcbiogQ29udGFpbnMgYSBjb21taXQtY291bnQgYW5kIHNob3J0LWhhc2ggb2YgdGhlIHJlcG9zaXRvcnkgd2hlbiB0aGUgYnVpbGRcbiogd2FzIGRvbmUuXG4qXG4qIEBleGFtcGxlXG4qIFJhYy5idWlsZCAvLyByZXR1cm5zIEUuZy4gJzEwNTctOTRiMDU5ZCdcbipcbiogQGNvbnN0YW50IHtTdHJpbmd9IGJ1aWxkXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ2J1aWxkJywgYnVpbGQpO1xuXG5cblxuLyoqXG4qIERhdGUgb2YgdGhlIGJ1aWxkIG9mIHRoZSBjbGFzcy4gSW50ZW5kZWQgZm9yIGRlYnVnZ2luZyBwdXJwb3VzZXMuXG4qXG4qIENvbnRhaW5zIGEgW0lTTy04NjAxIHN0YW5kYXJkXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fODYwMSlcbiogZGF0ZSB3aGVuIHRoZSBidWlsZCB3YXMgZG9uZS5cbipcbiogQGV4YW1wbGVcbiogUmFjLmRhdGVkIC8vIHJldHVybnMgRS5nLiAnMjAyMi0xMC0xM1QyMzowNjoxMi41MDBaJ1xuKlxuKiBAY29uc3RhbnQge1N0cmluZ30gZGF0ZWRcbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAnZGF0ZWQnLCBkYXRlZCk7XG5cblxuLyoqXG4qIFRhdSwgZXF1YWwgdG8gYE1hdGguUEkgKiAyYC5cbipcbiogU2VlIFtUYXUgTWFuaWZlc3RvXShodHRwczovL3RhdWRheS5jb20vdGF1LW1hbmlmZXN0bykuXG4qXG4qIEBjb25zdGFudCB7TnVtYmVyfSBUQVVcbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAnVEFVJywgTWF0aC5QSSAqIDIpO1xuXG5cbi8vIEV4Y2VwdGlvblxuUmFjLkV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FeGNlcHRpb24nKTtcblxuXG4vLyBQcm90b3R5cGUgZnVuY3Rpb25zXG5yZXF1aXJlKCcuL2F0dGFjaFByb3RvRnVuY3Rpb25zJykoUmFjKTtcblxuXG4vLyBQNURyYXdlclxuUmFjLlA1RHJhd2VyID0gcmVxdWlyZSgnLi9wNURyYXdlci9QNURyYXdlcicpO1xuXG5cbi8vIENvbG9yXG5SYWMuQ29sb3IgPSByZXF1aXJlKCcuL3N0eWxlL0NvbG9yJyk7XG5cblxuLy8gU3Ryb2tlXG5SYWMuU3Ryb2tlID0gcmVxdWlyZSgnLi9zdHlsZS9TdHJva2UnKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0cm9rZSk7XG5cblxuLy8gRmlsbFxuUmFjLkZpbGwgPSByZXF1aXJlKCcuL3N0eWxlL0ZpbGwnKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLkZpbGwpO1xuXG5cbi8vIFN0eWxlQ29udGFpbmVyXG5SYWMuU3R5bGVDb250YWluZXIgPSByZXF1aXJlKCcuL3N0eWxlL1N0eWxlQ29udGFpbmVyJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5TdHlsZUNvbnRhaW5lcik7XG5cblxuLy8gQW5nbGVcblJhYy5BbmdsZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQW5nbGUnKTtcblJhYy5BbmdsZS5wcm90b3R5cGUubG9nID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nO1xuXG5cbi8vIFBvaW50XG5SYWMuUG9pbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1BvaW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Qb2ludCk7XG5cblxuLy8gUmF5XG5SYWMuUmF5ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9SYXknKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlJheSk7XG5cblxuLy8gU2VnbWVudFxuUmFjLlNlZ21lbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NlZ21lbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNlZ21lbnQpO1xuXG5cbi8vIEFyY1xuUmFjLkFyYyA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQXJjJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5BcmMpO1xuXG5cbi8vIFRleHRcblJhYy5UZXh0ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9UZXh0Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5UZXh0KTtcblxuXG4vLyBCZXppZXJcblJhYy5CZXppZXIgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0JlemllcicpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQmV6aWVyKTtcblxuXG4vLyBDb21wb3NpdGVcblJhYy5Db21wb3NpdGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0NvbXBvc2l0ZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQ29tcG9zaXRlKTtcblxuXG4vLyBTaGFwZVxuUmFjLlNoYXBlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TaGFwZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2hhcGUpO1xuXG5cbi8vIEVhc2VGdW5jdGlvblxuUmFjLkVhc2VGdW5jdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FYXNlRnVuY3Rpb24nKTtcblxuXG4vLyBDb250cm9sbGVyXG5SYWMuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sbGVyJyk7XG5cblxuLy8gQ29udHJvbFxuUmFjLkNvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQ29udHJvbCcpO1xuXG5cbi8vIFJheUNvbnRyb2xcblJhYy5SYXlDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL1JheUNvbnRyb2wnKTtcblxuXG4vLyBBcmNDb250cm9sXG5SYWMuQXJjQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmNDb250cm9sJyk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuL1JhYycpO1xuXG5cbi8qKlxuKiBUaGlzIG5hbWVzcGFjZSBsaXN0cyB1dGlsaXR5IGZ1bmN0aW9ucyBhdHRhY2hlZCB0byBhbiBpbnN0YW5jZSBvZlxuKiBge0BsaW5rIFJhY31gIGR1cmluZyBpbml0aWFsaXphdGlvbi4gRWFjaCBkcmF3YWJsZSBhbmQgc3R5bGUgY2xhc3MgZ2V0c1xuKiBhIGNvcnJlc3BvbmRpbmcgZnVuY3Rpb24gbGlrZSBbYHJhYy5Qb2ludGBde0BsaW5rIGluc3RhbmNlLlBvaW50fSBvclxuKiBbYHJhYy5Db2xvcmBde0BsaW5rIGluc3RhbmNlLkNvbG9yfS5cbipcbiogRHJhd2FibGUgYW5kIHN0eWxlIG9iamVjdHMgcmVxdWlyZSBmb3IgY29uc3RydWN0aW9uIGEgcmVmZXJlbmNlIHRvIGFcbiogYFJhY2AgaW5zdGFuY2UgaW4gb3JkZXIgdG8gcGVyZm9ybSBkcmF3aW5nIG9wZXJhdGlvbnMuIFRoZSBhdHRhY2hlZFxuKiBmdW5jdGlvbnMgYnVpbGQgbmV3IG9iamVjdHMgdXNpbmcgdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogVGhlc2UgZnVuY3Rpb25zIGFyZSBhbHNvIHNldHVwIHdpdGggcmVhZHktbWFkZSBjb252ZW5pZW5jZSBvYmplY3RzIGZvclxuKiBtYW55IHVzdWFsIHZhbHVlcyBsaWtlIFtgcmFjLkFuZ2xlLm5vcnRoYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjbm9ydGh9IG9yXG4qIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZVxuKi9cblxuXG4vLyBBdHRhY2hlcyBjb252ZW5pZW5jZSBmdW5jdGlvbnMgdG8gY3JlYXRlIG9iamVjdHMgd2l0aCB0aGlzIGluc3RhbmNlIG9mXG4vLyBSYWMuIEUuZy4gYHJhYy5Db2xvciguLi4pYCwgYHJhYy5Qb2ludCguLi4pYC5cbi8vXG4vLyBUaGVzZSBmdW5jdGlvbnMgYXJlIGF0dGFjaGVkIGFzIHByb3BlcnRpZXMgKGluc3RlYWQgb2YgaW50byB0aGVcbi8vIHByb3RvdHlwZSkgYmVjYXVzZSB0aGVzZSBhcmUgbGF0ZXIgcG9wdWxhdGVkIHdpdGggbW9yZSBwcm9wZXJ0aWVzIGFuZFxuLy8gbWV0aG9kcywgYW5kIHRodXMgbmVlZCB0byBiZSBpbmRlcGVuZGVudCBmb3IgZWFjaCBpbnN0YW5jZS5cbi8vXG4vLyBSZWFkeSBtYWRlIG9iamVjdHMgYXR0YWNoZWQgdG8gdGhlc2UgZnVuY3Rpb25zIChFLmcuIGByYWMuUG9pbnQuemVyb2ApXG4vLyBhcmUgZGVmaW5lZCBpbiB0aGUgYGluc3RhbmNlLlBvaW50LmpzYCBhbmQgZXF1aXZhbGVudCBmaWxlcy5cbi8vXG4vLyBJbnRlbmRlZCB0byByZWNlaXZlIHRoZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgQ29sb3JgLiBUaGUgY3JlYXRlZCBgY29sb3IucmFjYFxuICAqIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQ29sb3J9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuICAqIGNvbG9yLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByXG4gICogQHBhcmFtIHtOdW1iZXJ9IGdcbiAgKiBAcGFyYW0ge051bWJlcn0gYlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbYT0xXVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBmdW5jdGlvbiBDb2xvclxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Db2xvciA9IGZ1bmN0aW9uIG1ha2VDb2xvcihyLCBnLCBiLCBhID0gMSkge1xuICAgIHJldHVybiBuZXcgUmFjLkNvbG9yKHRoaXMsIHIsIGcsIGIsIGEpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBTdHJva2VgLiBUaGUgY3JlYXRlZCBgc3Ryb2tlLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlN0cm9rZX1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4gICogbGV0IHN0cm9rZSA9IHJhYy5TdHJva2UoMiwgY29sb3IpXG4gICogc3Ryb2tlLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gd2VpZ2h0XG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IFtjb2xvcj1udWxsXVxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICpcbiAgKiBAZnVuY3Rpb24gU3Ryb2tlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlN0cm9rZSA9IGZ1bmN0aW9uIG1ha2VTdHJva2Uod2VpZ2h0LCBjb2xvciA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHJva2UodGhpcywgd2VpZ2h0LCBjb2xvcik7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYEZpbGxgLiBUaGUgY3JlYXRlZCBgZmlsbC5yYWNgIGlzXG4gICogc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5GaWxsfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBsZXQgZmlsbCA9IHJhYy5GaWxsKGNvbG9yKVxuICAqIGZpbGwucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IFtjb2xvcj1udWxsXVxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKlxuICAqIEBmdW5jdGlvbiBGaWxsXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkZpbGwgPSBmdW5jdGlvbiBtYWtlRmlsbChjb2xvciA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMsIGNvbG9yKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgU3R5bGVgLiBUaGUgY3JlYXRlZCBgc3R5bGUucmFjYFxuICAqIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3R5bGV9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuICAqIGxldCBzdHlsZSA9IHJhYy5TdHlsZShyYWMuU3Ryb2tlKDIsIGNvbG9yKSwgcmFjLkZpbGwoY29sb3IpKVxuICAqIHN0eWxlLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7UmFjLlN0cm9rZX0gW3N0cm9rZT1udWxsXVxuICAqIEBwYXJhbSB7UmFjLkZpbGx9IFtmaWxsPW51bGxdXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlfVxuICAqXG4gICogQGZ1bmN0aW9uIFN0eWxlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlN0eWxlID0gZnVuY3Rpb24gbWFrZVN0eWxlKHN0cm9rZSA9IG51bGwsIGZpbGwgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcywgc3Ryb2tlLCBmaWxsKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgQW5nbGVgLiBUaGUgY3JlYXRlZCBgYW5nbGUucmFjYFxuICAqIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGV9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBhbmdsZSA9IHJhYy5BbmdsZSgwLjIpXG4gICogYW5nbGUucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHR1cm4gLSBUaGUgdHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGluIHRoZSByYW5nZSBgW08sMSlgXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBBbmdsZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5BbmdsZSA9IGZ1bmN0aW9uIG1ha2VBbmdsZSh0dXJuKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQW5nbGUodGhpcywgdHVybik7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFBvaW50YC4gVGhlIGNyZWF0ZWQgYHBvaW50LnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlBvaW50fWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgcG9pbnQgPSByYWMuUG9pbnQoNTUsIDc3KVxuICAqIHBvaW50LnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBmdW5jdGlvbiBQb2ludFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Qb2ludCA9IGZ1bmN0aW9uIG1ha2VQb2ludCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFJheWAgd2l0aCB0aGUgZ2l2ZW4gcHJpbWl0aXZlXG4gICogdmFsdWVzLiBUaGUgY3JlYXRlZCBgcmF5LnJhY2AgaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5SYXl9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCByYXkgPSByYWMuUmF5KDU1LCA3NywgMC4yKVxuICAqIHJheS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geFxuICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZVxuICAqXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICpcbiAgKiBAZnVuY3Rpb24gUmF5XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlJheSA9IGZ1bmN0aW9uIG1ha2VSYXkoeCwgeSwgYW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIGdpdmVuIHByaW1pdGl2ZVxuICAqIHZhbHVlcy4gVGhlIGNyZWF0ZWQgYHNlZ21lbnQucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlNlZ21lbnR9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBzZWdtZW50ID0gcmFjLlNlZ21lbnQoNTUsIDc3LCAwLjIsIDEwMClcbiAgKiBzZWdtZW50LnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIFNlZ21lbnRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuU2VnbWVudCA9IGZ1bmN0aW9uIG1ha2VTZWdtZW50KHgsIHksIGFuZ2xlLCBsZW5ndGgpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcywgc3RhcnQsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMsIHJheSwgbGVuZ3RoKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBwcmltaXRpdmVcbiAgKiB2YWx1ZXMuIFRoZSBjcmVhdGVkIGBhcmMucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFyY31gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGFyYyA9IHJhYy5BcmMoNTUsIDc3LCAwLjIpXG4gICogYXJjLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIF94XyBjb29yZGluYXRlIGZvciB0aGUgYXJjIGNlbnRlclxuICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIF95XyBjb29yZGluYXRlIGZvciB0aGUgYXJjIGNlbnRlclxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gc3RhcnQgLSBUaGUgc3RhcnQgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmQ9bnVsbF0gLSBUaGUgZW5kIG9mIHRoZSBhcmM7IHdoZW5cbiAgKiAgIG9tbWl0ZWQgb3Igc2V0IHRvIGBudWxsYCwgYHN0YXJ0YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmNcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQGZ1bmN0aW9uIEFyY1xuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5BcmMgPSBmdW5jdGlvbiBtYWtlQXJjKHgsIHksIHJhZGl1cywgc3RhcnQgPSB0aGlzLkFuZ2xlLnplcm8sIGVuZCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHN0YXJ0ID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc3RhcnQpO1xuICAgIGVuZCA9IGVuZCA9PT0gbnVsbFxuICAgICAgPyBzdGFydFxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLCBlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgVGV4dGAuIFRoZSBjcmVhdGVkIGB0ZXh0LnJhY2AgaXNcbiAgKiBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlRleHR9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCB0ZXh0ID0gcmFjLlRleHQoNTUsIDc3LCAnYmxhY2sgcXVhcnR6JylcbiAgKiB0ZXh0LnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBsb2NhdGlvbiBmb3IgdGhlIGRyYXduIHRleHRcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgbG9jYXRpb24gZm9yIHRoZSBkcmF3biB0ZXh0XG4gICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgdG8gZHJhd1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBbZm9ybWF0PVtyYWMuVGV4dC5Gb3JtYXQudG9wTGVmdF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjdG9wTGVmdH1dXG4gICogICBUaGUgZm9ybWF0IGZvciB0aGUgZHJhd24gdGV4dFxuICAqXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqXG4gICogQGZ1bmN0aW9uIFRleHRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuVGV4dCA9IGZ1bmN0aW9uIG1ha2VUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0ID0gdGhpcy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgVGV4dC5Gb3JtYXRgLiBUaGUgY3JlYXRlZFxuICAqIGBmb3JtYXQucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fWAuXG4gICpcbiAgKiBbYHJhYy5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQjRm9ybWF0fSBpcyBhbiBhbGlhcyBvZiB0aGlzXG4gICogZnVuY3Rpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgZm9ybWF0ID0gcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ2Jhc2VsaW5lJywgMC4yKVxuICAqIGZvcm1hdC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gaEFsaWduIC0gVGhlIGhvcml6b250YWwgYWxpZ25tZW50LCBsZWZ0LXRvLXJpZ2h0OyBvbmVcbiAgKiAgIG9mIHRoZSB2YWx1ZXMgZnJvbSBbYGhvcml6b250YWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ259XG4gICogQHBhcmFtIHtTdHJpbmd9IHZBbGlnbiAtIFRoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQsIHRvcC10by1ib3R0b207IG9uZSBvZlxuICAqICAgdGhlIHZhbHVlcyBmcm9tIFtgdmVydGljYWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWdufVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBbYW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduXG4gICogQHBhcmFtIHtTdHJpbmd9IFtmb250PW51bGxdIC0gVGhlIGZvbnQgbmFtZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbc2l6ZT1udWxsXSAtIFRoZSBmb250IHNpemVcbiAgKiBAcGFyYW0ge051bWJlcn0gW2hQYWRkaW5nPTBdIC0gVGhlIGhvcml6b250YWwgcGFkZGluZywgbGVmdC10by1yaWdodFxuICAqIEBwYXJhbSB7TnVtYmVyfSBbdlBhZGRpbmc9MF0gLSBUaGUgdmVydGljYWwgcGFkZGluZywgdG9wLXRvLWJvdHRvbVxuICAqXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKlxuICAqIEBmdW5jdGlvbiBUZXh0Rm9ybWF0XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlRleHRGb3JtYXQgPSBmdW5jdGlvbiBtYWtlVGV4dEZvcm1hdChcbiAgICBoQWxpZ24sXG4gICAgdkFsaWduLFxuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLnplcm8sXG4gICAgZm9udCA9IG51bGwsXG4gICAgc2l6ZSA9IG51bGwsXG4gICAgaFBhZGRpbmcgPSAwLFxuICAgIHZQYWRkaW5nID0gMClcbiAge1xuICAgIC8vIFRoaXMgZnVuY3Rpb25zIHVzZXMgYHJhY2AgaW5zdGVhZCBvZiBgdGhpc2AsIHNpbmNlIGB0aGlzYCBtYXkgcG9pbnRcbiAgICAvLyB0byBkaWZmZXJlbnQgb2JqZWN0czpcbiAgICAvLyArIGByYWNgIGluIHRoaXMgZnVuY3Rpb24gYm9keVxuICAgIC8vICsgYHJhYy5UZXh0YCBpbiB0aGUgYFRleHQuRm9ybWF0YCBhbGlhcyBiZWxsb3dcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgICAgcmFjLFxuICAgICAgaEFsaWduLCB2QWxpZ24sXG4gICAgICBhbmdsZSwgZm9udCwgc2l6ZSxcbiAgICAgIGhQYWRkaW5nLCB2UGFkZGluZyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFRleHQuRm9ybWF0YC4gQWxpYXMgb2ZcbiAgKiBbYHJhYy5UZXh0Rm9ybWF0YF17QGxpbmsgUmFjI1RleHRGb3JtYXR9LlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGhBbGlnbiAtIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodDsgb25lXG4gICogICBvZiB0aGUgdmFsdWVzIGZyb20gW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufVxuICAqIEBwYXJhbSB7U3RyaW5nfSB2QWxpZ24gLSBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tOyBvbmUgb2ZcbiAgKiAgIHRoZSB2YWx1ZXMgZnJvbSBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn1cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gW2FuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgdGV4dCBpcyBkcmF3blxuICAqIEBwYXJhbSB7U3RyaW5nfSBbZm9udD1udWxsXSAtIFRoZSBmb250IG5hbWVcbiAgKiBAcGFyYW0ge051bWJlcn0gW3NpemU9bnVsbF0gLSBUaGUgZm9udCBzaXplXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtoUGFkZGluZz0wXSAtIFRoZSBob3Jpem9udGFsIHBhZGRpbmcsIGxlZnQtdG8tcmlnaHRcbiAgKiBAcGFyYW0ge051bWJlcn0gW3ZQYWRkaW5nPTBdIC0gVGhlIHZlcnRpY2FsIHBhZGRpbmcsIHRvcC10by1ib3R0b21cbiAgKlxuICAqIEBmdW5jdGlvbiBGb3JtYXRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0ID0gcmFjLlRleHRGb3JtYXQ7XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEJlemllcmAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5CZXppZXJ9YC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFhcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRZXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0QW5jaG9yWFxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEFuY2hvcllcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kQW5jaG9yWFxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRBbmNob3JZXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZFhcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kWVxuICAqXG4gICogQHJldHVybnMge1JhYy5CZXppZXJ9XG4gICpcbiAgKiBAZnVuY3Rpb24gQmV6aWVyXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgQ29tcG9zaXRlYC4gVGhlIGNyZWF0ZWRcbiAgKiBgY29tcG9zaXRlLnJhY2AgaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29tcG9zaXRlID0gcmFjLkNvbXBvc2l0ZSgpXG4gICogY29tcG9zaXRlLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7QXJyYXl9IHNlcXVlbmNlIC0gQW4gYXJyYXkgb2YgZHJhd2FibGUgb2JqZWN0cyB0byBjb250YWluXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbXBvc2l0ZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBDb21wb3NpdGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQ29tcG9zaXRlID0gZnVuY3Rpb24gbWFrZUNvbXBvc2l0ZShzZXF1ZW5jZSA9IFtdKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMsIHNlcXVlbmNlKTtcbiAgfTtcblxuXG59OyAvLyBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBBdHRhY2hlcyB1dGlsaXR5IGZ1bmN0aW9ucyB0byBhIFJhYyBpbnN0YW5jZSB0aGF0IGFkZCBmdW5jdGlvbnMgdG8gYWxsXG4vLyBkcmF3YWJsZSBhbmQgc3R5bGUgY2xhc3MgcHJvdG90eXBlcy5cbi8vXG4vLyBJbnRlbmRlZCB0byByZWNlaXZlIHRoZSBSYWMgY2xhc3MgYXMgcGFyYW1ldGVyLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hQcm90b0Z1bmN0aW9ucyhSYWMpIHtcblxuICBmdW5jdGlvbiBhc3NlcnREcmF3ZXIoZHJhd2FibGUpIHtcbiAgICBpZiAoZHJhd2FibGUucmFjID09IG51bGwgfHwgZHJhd2FibGUucmFjLmRyYXdlciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmRyYXdlck5vdFNldHVwKFxuICAgICAgICBgZHJhd2FibGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKGRyYXdhYmxlKX1gKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIENvbnRhaW5lciBvZiBwcm90b3R5cGUgZnVuY3Rpb25zIGZvciBkcmF3YWJsZSBjbGFzc2VzLlxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucyA9IHt9O1xuXG5cbiAgLyoqXG4gICogQWRkcyB0byBgZHJhd2FibGVDbGFzcy5wcm90b3R5cGVgIGFsbCB0aGUgZnVuY3Rpb25zIGNvbnRhaW5lZCBpblxuICAqIGBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSB0aGUgZnVuY3Rpb25zIHNoYXJlZCBieSBhbGxcbiAgKiBkcmF3YWJsZSBvYmplY3RzLCBmb3IgZXhhbXBsZSBgZHJhdygpYCBhbmQgYGRlYnVnKClgLlxuICAqXG4gICogQHBhcmFtIHtjbGFzc30gZHJhd2FibGVDbGFzcyAtIENsYXNzIHRvIHNldHVwIHdpdGggZHJhd2FibGUgZnVuY3Rpb25zXG4gICovXG4gIFJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihkcmF3YWJsZUNsYXNzKSB7XG4gICAgT2JqZWN0LmtleXMoUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBkcmF3YWJsZUNsYXNzLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kcmF3ID0gZnVuY3Rpb24oc3R5bGUgPSBudWxsKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmRyYXdPYmplY3QodGhpcywgc3R5bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZGVidWcgPSBmdW5jdGlvbihkcmF3c1RleHQgPSBmYWxzZSl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kZWJ1Z09iamVjdCh0aGlzLCBkcmF3c1RleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nID0gZnVuY3Rpb24obWVzc2FnZSA9IG51bGwpe1xuICAgIGxldCBjb2FsZXNjZWRNZXNzYWdlID0gbWVzc2FnZSA/PyAnJW8nO1xuICAgIGNvbnNvbGUubG9nKGNvYWxlc2NlZE1lc3NhZ2UsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLnB1c2hTdGFjayh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcFN0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucGVla1N0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrU2hhcGUoKS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTaGFwZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZVRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNoYXBlID0gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHNoYXBlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG9Db21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BDb21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wQ29tcG9zaXRlKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvID0gZnVuY3Rpb24oc29tZUNvbXBvc2l0ZSkge1xuICAgIGlmIChzb21lQ29tcG9zaXRlIGluc3RhbmNlb2YgUmFjLkNvbXBvc2l0ZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5TaGFwZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgYXR0YWNoVG8gY29tcG9zaXRlIC0gc29tZUNvbXBvc2l0ZS10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZUNvbXBvc2l0ZSl9YCk7XG4gIH07XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3Igc3R5bGUgY2xhc3Nlcy5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuc3R5bGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBzdHlsZSBvYmplY3RzIChFLmcuIGBhcHBseSgpYCkuXG4gIFJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgIE9iamVjdC5rZXlzKFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY2xhc3NPYmoucHJvdG90eXBlW25hbWVdID0gUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5ID0gZnVuY3Rpb24oKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmFwcGx5T2JqZWN0KHRoaXMpO1xuICB9O1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMubG9nID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nO1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMuYXBwbHlUb0NsYXNzID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLnNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCB0aGlzKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoUHJvdG9GdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IGFsbG93cyB0aGUgc2VsZWN0aW9uIG9mIGEgdmFsdWUgd2l0aCBhIGtub2IgdGhhdCBzbGlkZXNcbiogdGhyb3VnaCB0aGUgc2VjdGlvbiBvZiBhbiBgQXJjYC5cbipcbiogVXNlcyBhbiBgQXJjYCBhcyBgW2FuY2hvcl17QGxpbmsgUmFjLkFyY0NvbnRyb2wjYW5jaG9yfWAsIHdoaWNoIGRlZmluZXNcbiogdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuKlxuKiBgW2FuZ2xlRGlzdGFuY2Vde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuZ2xlRGlzdGFuY2V9YCBkZWZpbmVzIHRoZVxuKiBzZWN0aW9uIG9mIHRoZSBgYW5jaG9yYCBhcmMgd2hpY2ggaXMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuKiBXaXRoaW4gdGhpcyBzZWN0aW9uIHRoZSB1c2VyIGNhbiBzbGlkZSB0aGUgY29udHJvbCBrbm9iIHRvIHNlbGVjdCBhXG4qIHZhbHVlLlxuKlxuKiBAYWxpYXMgUmFjLkFyY0NvbnRyb2xcbiogQGV4dGVuZHMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBBcmNDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY0NvbnRyb2xgIGluc3RhbmNlIHdpdGggdGhlIHN0YXJ0aW5nIGB2YWx1ZWAgYW5kIHRoZVxuICAqIGludGVyYWN0aXZlIGBhbmdsZURpc3RhbmNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGVEaXN0YW5jZSBvZiB0aGUgYGFuY2hvcmBcbiAgKiAgIGFyYyBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb25cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgYW5nbGVEaXN0YW5jZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgc3VwZXIocmFjLCB2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIEFuZ2xlIGRpc3RhbmNlIG9mIHRoZSBgYW5jaG9yYCBhcmMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGVEaXN0YW5jZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgYW5nbGVEaXN0YW5jZSk7XG5cbiAgICAvKipcbiAgICAqIGBBcmNgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIERlZmluZXMgdGhlIGxvY2F0aW9uXG4gICAgKiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbiAgICAqXG4gICAgKiBBbG9uZyB3aXRoIGBbYW5nbGVEaXN0YW5jZV17QGxpbmsgUmFjLkFyY0NvbnRyb2wjYW5nbGVEaXN0YW5jZX1gXG4gICAgKiBkZWZpbmVzIHRoZSBzZWN0aW9uIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgY29udHJvbCBjYW5ub3QgYmUgZHJhd24gb3Igc2VsZWN0ZWQgdW50aWwgdGhpcyBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuQXJjfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJhYy5jb250cm9sbGVyLmF1dG9BZGRDb250cm9scykge1xuICAgICAgcmFjLmNvbnRyb2xsZXIuYWRkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBgdmFsdWVgIHVzaW5nIHRoZSBwcm9qZWN0aW9uIG9mIGB2YWx1ZUFuZ2xlRGlzdGFuY2UudHVybmAgaW4gdGhlXG4gICogYFswLGFuZ2xlTGVuZ3RoLnR1cm5dYCByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gdmFsdWVBbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGF0XG4gICogICB3aGljaCB0byBzZXQgdGhlIGN1cnJlbnQgdmFsdWVcbiAgKi9cbiAgc2V0VmFsdWVXaXRoQW5nbGVEaXN0YW5jZSh2YWx1ZUFuZ2xlRGlzdGFuY2UpIHtcbiAgICB2YWx1ZUFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgdmFsdWVBbmdsZURpc3RhbmNlKVxuICAgIGxldCBkaXN0YW5jZVJhdGlvID0gdmFsdWVBbmdsZURpc3RhbmNlLnR1cm4gLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICAgIHRoaXMudmFsdWUgPSBkaXN0YW5jZVJhdGlvO1xuICB9XG5cblxuICAvLyBUT0RPOiB0aGlzIGV4YW1wbGUvY29kZSBtYXkgbm90IGJlIHdvcmtpbmcgb3IgYmUgaW5uYWN1cnJhdGVcbiAgLy8gY2hlY2sgUmF5Q29udHJvbDpzZXRMaW1pdHNXaXRoTGVuZ3RoSW5zZXRzIGZvciBhIGJldHRlciBleGFtcGxlXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGBhbmdsZURpc3RhbmNlLnR1cm5gLCBjb3JyZXNwb25kaW5nbHksIGJvdGggcHJvamVjdGVkIGluIHRoZVxuICAqIGBbMCwgYW5nbGVEaXN0YW5jZS50dXJuXWAgcmFuZ2UuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhbiBBcmNDb250cm9sIHdpdGggYW5nbGVEaXN0YW5jZSBvZiAwLjUgdHVybjwvY2FwdGlvbj5cbiAgKiBsZXQgY29udHJvbCA9IG5ldyBSYWMuQXJjQ29udHJvbChyYWMsIDAsIHJhYy5BbmdsZSgwLjUpKVxuICAqIC8vIHNldHMgc3RhcnRMaW1pdCBhcyAwLjEsIHNpbmNlICAgMCArIDAuMiAqIDAuNSA9IDAuMVxuICAqIC8vIHNldHMgZW5kTGltaXQgICBhcyAwLjMsIHNpbmNlIDAuNSAtIDAuNCAqIDAuNSA9IDAuM1xuICAqIGNvbnRyb2wuc2V0TGltaXRzV2l0aEFuZ2xlRGlzdGFuY2VJbnNldHMoMC4yLCAwLjQpXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYGFuZ2xlRGlzdGFuY2UudHVybmBcbiAgKiAgIGluIHRoZSByYW5nZSBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG4gICAgdGhpcy5zdGFydExpbWl0ID0gc3RhcnRJbnNldC50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLSBlbmRJbnNldC50dXJuKSAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlICBbYW5nbGUgYGRpc3RhbmNlYF17QGxpbmsgUmFjLkFuZ2xlI2Rpc3RhbmNlfSBiZXR3ZWVuIHRoZVxuICAqIGBhbmNob3JgIGFyYyBgc3RhcnRgIGFuZCB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogVGhlIGB0dXJuYCBvZiB0aGUgcmV0dXJuZWQgYEFuZ2xlYCBpcyBlcXVpdmFsZW50IHRvIHRoZSBjb250cm9sIGB2YWx1ZWBcbiAgKiBwcm9qZWN0ZWQgdG8gdGhlIHJhbmdlIGBbMCxhbmdsZURpc3RhbmNlLnR1cm5dYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogV2hlbiBgYW5jaG9yYCBpcyBub3Qgc2V0LCByZXR1cm5zIGBudWxsYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybiB7P1JhYy5Qb2ludH1cbiAgKi9cbiAga25vYigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXRBbmdsZURpc3RhbmNlKHRoaXMuZGlzdGFuY2UoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcHJvZHVjZWQgd2l0aCB0aGUgYGFuY2hvcmAgYXJjIHdpdGhcbiAgKiBgYW5nbGVEaXN0YW5jZWAsIHRvIGJlIHBlcnNpc3RlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgYW5jaG9yYCBpcyBub3Qgc2V0LlxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbihcbiAgICAgICAgYEV4cGVjdGVkIGFuY2hvciB0byBiZSBzZXQsIG51bGwgZm91bmQgaW5zdGVhZGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aEFuZ2xlRGlzdGFuY2UodGhpcy5hbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgLy8gQXJjIGFuY2hvciBpcyBhbHdheXMgZHJhd24gd2l0aG91dCBmaWxsXG4gICAgbGV0IGFuY2hvclN0eWxlID0gY29udHJvbFN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnJhYy5GaWxsLm5vbmUpXG4gICAgICA6IHRoaXMucmFjLkZpbGwubm9uZTtcblxuICAgIGZpeGVkQW5jaG9yLmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5jZW50ZXIuYW5nbGVUb1BvaW50KGtub2IpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyQW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZS5tdWx0T25lKGl0ZW0pO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShtYXJrZXJBbmdsZURpc3RhbmNlKTtcbiAgICAgIGxldCBwb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIHBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wga25vYlxuICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGlzQ2lyY2xlQ29udHJvbCA9IHRoaXMuYW5nbGVEaXN0YW5jZS5lcXVhbHModGhpcy5yYWMuQW5nbGUuemVybylcbiAgICAgICYmIHRoaXMuc3RhcnRMaW1pdCA9PSAwXG4gICAgICAmJiB0aGlzLmVuZExpbWl0ID09IDFcbiAgICBsZXQgaGFzTmVnYXRpdmVSYW5nZSA9IGlzQ2lyY2xlQ29udHJvbFxuICAgICAgfHwgdGhpcy52YWx1ZSA+PSB0aGlzLnN0YXJ0TGltaXQgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGRcbiAgICBsZXQgaGFzUG9zaXRpdmVSYW5nZSA9IGlzQ2lyY2xlQ29udHJvbFxuICAgICAgfHwgdGhpcy52YWx1ZSA8PSB0aGlzLmVuZExpbWl0IC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmIChoYXNOZWdhdGl2ZVJhbmdlKSB7XG4gICAgICBsZXQgbmVnQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSkuaW52ZXJzZSgpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIG5lZ0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGl2ZSBhcnJvd1xuICAgIGlmIChoYXNQb3NpdGl2ZVJhbmdlKSB7XG4gICAgICBsZXQgcG9zQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgcG9zQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgICAgaWYgKHBvaW50ZXJTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICpcbiAgKiBgdmFsdWVgIGlzIGFsd2F5cyB1cGRhdGVkIGJ5IHRoaXMgbWV0aG9kIHRvIGJlIHdpdGhpbiAqWzAsMV0qIGFuZFxuICAqIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuQXJjfSBmaXhlZEFuY2hvciAtIEFuY2hvciBwcm9kdWNlZCB3aXRoIGBhZmZpeEFuY2hvcmAgd2hlblxuICAqICAgdXNlciBpbnRlcmFjdGlvbiBzdGFydGVkXG4gICovXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJLbm9iQ2VudGVyLCBmaXhlZEFuY2hvcikge1xuICAgIGxldCBhbmdsZURpc3RhbmNlID0gZml4ZWRBbmNob3IuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGxldCBzdGFydEluc2V0ID0gYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgbGV0IGVuZEluc2V0ID0gYW5nbGVEaXN0YW5jZS5tdWx0T25lKDEgLSB0aGlzLmVuZExpbWl0KTtcblxuICAgIGxldCBzZWxlY3Rpb25BbmdsZSA9IGZpeGVkQW5jaG9yLmNlbnRlclxuICAgICAgLmFuZ2xlVG9Qb2ludChwb2ludGVyS25vYkNlbnRlcik7XG4gICAgc2VsZWN0aW9uQW5nbGUgPSBmaXhlZEFuY2hvci5jbGFtcFRvQW5nbGVzKHNlbGVjdGlvbkFuZ2xlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmRpc3RhbmNlRnJvbVN0YXJ0KHNlbGVjdGlvbkFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGRpc3RhbmNlUmF0aW8gPSBuZXdEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIHNlbGVjdGlvbiBzdGF0ZSBhbG9uZyB3aXRoIHBvaW50ZXIgaW50ZXJhY3Rpb24gdmlzdWFscy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSB1c2VyIHBvaW50ZXJcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGZpeGVkQW5jaG9yIC0gYEFyY2AgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgIHdoZW5cbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IHBvaW50ZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnJhYy5GaWxsLm5vbmUpO1xuICAgIGZpeGVkQW5jaG9yLmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBmaXhlZEFuY2hvci5hbmdsZURpc3RhbmNlKCk7XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBWYWx1ZSBtYXJrZXJzXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbSA8IDAgfHwgaXRlbSA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKGl0ZW0pKTtcbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIExpbWl0IG1hcmtlcnNcbiAgICBpZiAodGhpcy5zdGFydExpbWl0ID4gMCkge1xuICAgICAgbGV0IG1pbkFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5zdGFydExpbWl0KSk7XG4gICAgICBsZXQgbWluUG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWluQW5nbGUpO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gbWluQW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtaW5Qb2ludCwgbWFya2VyQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heEFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5lbmRMaW1pdCkpO1xuICAgICAgbGV0IG1heFBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1heEFuZ2xlKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IG1heEFuZ2xlLnBlcnBlbmRpY3VsYXIoIWZpeGVkQW5jaG9yLmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgYXJjIGNvbnRyb2wgZHJhZ2dpbmcgdmlzdWFscyFcbiAgfVxuXG59IC8vIGNsYXNzIEFyY0NvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyY0NvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFic3RyYWN0IGNsYXNzIGZvciBjb250cm9scyB0aGF0IHNlbGVjdCBhIHZhbHVlIHdpdGhpbiBhIHJhbmdlLlxuKlxuKiBDb250cm9scyBtYXkgdXNlIGFuIGBhbmNob3JgIG9iamVjdCB0byBkZXRlcm1pbmUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZlxuKiB0aGUgY29udHJvbCdzIGludGVyYWN0aXZlIGVsZW1lbnRzLiBFYWNoIGltcGxlbWVudGF0aW9uIGRldGVybWluZXMgdGhlXG4qIGNsYXNzIHVzZWQgZm9yIHRoaXMgYGFuY2hvcmAsIGZvciBleGFtcGxlXG4qIGBbQXJjQ29udHJvbF17QGxpbmsgUmFjLkFyY0NvbnRyb2x9YCB1c2VzIGFuIGBbQXJjXXtAbGluayBSYWMuQXJjfWAgYXNcbiogYW5jaG9yLCB3aGljaCBkZWZpbmVzIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLCB3aGF0IG9yaWVudGF0aW9uIGl0XG4qIHVzZXMsIGFuZCB0aGUgcG9zaXRpb24gb2YgdGhlIGNvbnRyb2wga25vYiB0aHJvdWdoIHRoZSByYW5nZSBvZiBwb3NzaWJsZVxuKiB2YWx1ZXMuXG4qXG4qIEEgY29udHJvbCBrZWVwcyBhIGB2YWx1ZWAgcHJvcGVydHkgaW4gdGhlIHJhbmdlICpbMCwxXSogZm9yIHRoZSBjdXJyZW50bHlcbiogc2VsZWN0ZWQgdmFsdWUuXG4qXG4qIFRoZSBgcHJvamVjdGlvblN0YXJ0YCBhbmQgYHByb2plY3Rpb25FbmRgIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgdG9cbiogcHJvamVjdCBgdmFsdWVgIGludG8gdGhlIHJhbmdlIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYCBieSB1c2luZ1xuKiB0aGUgYHByb2plY3RlZFZhbHVlKClgIG1ldGhvZC4gQnkgZGVmYXVsdCBzZXQgdG8gKlswLDFdKi5cbipcbiogVGhlIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCBjYW4gYmUgdXNlZCB0byByZXN0cmFpbiB0aGUgYWxsb3dhYmxlXG4qIHZhbHVlcyB0aGF0IGNhbiBiZSBzZWxlY3RlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uIEJ5IGRlZmF1bHQgc2V0IHRvXG4qICpbMCwxXSouXG4qXG4qIEBhbGlhcyBSYWMuQ29udHJvbFxuKi9cbmNsYXNzIENvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbnRyb2xgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBjb250cm9sLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogQ3VycmVudCBzZWxlY3RlZCB2YWx1ZSwgaW4gdGhlIHJhbmdlICpbMCwxXSouXG4gICAgKlxuICAgICogTWF5IGJlIGZ1cnRoZXIgY29uc3RyYWluZWQgdG8gYFtzdGFydExpbWl0LGVuZExpbWl0XWAuXG4gICAgKlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIC8qKlxuICAgICogW1Byb2plY3RlZCB2YWx1ZV17QGxpbmsgUmFjLkNvbnRyb2wjcHJvamVjdGVkVmFsdWV9IHRvIHVzZSB3aGVuXG4gICAgKiBgdmFsdWVgIGlzIGAwYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMFxuICAgICovXG4gICAgdGhpcy5wcm9qZWN0aW9uU3RhcnQgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBbUHJvamVjdGVkIHZhbHVlXXtAbGluayBSYWMuQ29udHJvbCNwcm9qZWN0ZWRWYWx1ZX0gdG8gdXNlIHdoZW5cbiAgICAqIGB2YWx1ZWAgaXMgYDFgLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnByb2plY3Rpb25FbmQgPSAxO1xuXG4gICAgLyoqXG4gICAgKiBNaW5pbXVtIGB2YWx1ZWAgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwXG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0TGltaXQgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBNYXhpbXVtIGB2YWx1ZWAgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLmVuZExpbWl0ID0gMTtcblxuICAgIC8qKlxuICAgICogQ29sbGVjdGlvbiBvZiB2YWx1ZXMgYXQgd2hpY2ggdmlzdWFsIG1hcmtlcnMgYXJlIGRyYXduLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAqIEBkZWZhdWx0IFtdXG4gICAgKi9cbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdG8gYXBwbHkgd2hlbiBkcmF3aW5nLiBUaGlzIHN0eWxlIGdldHMgYXBwbGllZCBhZnRlclxuICAgICogYFtyYWMuY29udHJvbGxlci5jb250cm9sU3R5bGVde0BsaW5rIFJhYy5Db250cm9sbGVyI2NvbnRyb2xTdHlsZX1gLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdmFsdWVgIHByb2plY3RlZCBpbnRvIHRoZSByYW5nZVxuICAqIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYC5cbiAgKlxuICAqIEJ5IGRlZmF1bHQgdGhlIHByb2plY3Rpb24gcmFuZ2UgaXMgKlswLDFdKiwgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIGFuZFxuICAqIGBwcm9qZWN0ZWRWYWx1ZSgpYCBhcmUgZXF1YWwuXG4gICpcbiAgKiBQcm9qZWN0aW9uIHJhbmdlcyB3aXRoIGEgbmVnYXRpdmUgZGlyZWN0aW9uIChFLmcuICpbNTAsMzBdKiwgd2hlblxuICAqIGBwcm9qZWN0aW9uU3RhcnRgIGlzIGdyZWF0ZXIgdGhhdCBgcHJvamVjdGlvbkVuZGApIGFyZSBzdXBwb3J0ZWQuIEFzXG4gICogYHZhbHVlYCBpbmNyZWFzZXMsIHRoZSBwcm9qZWN0aW9uIHJldHVybmVkIGRlY3JlYXNlcyBmcm9tXG4gICogYHByb2plY3Rpb25TdGFydGAgdW50aWwgcmVhY2hpbmcgYHByb2plY3Rpb25FbmRgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYSBjb250cm9sIHdpdGggYSBwcm9qZWN0aW9uIHJhbmdlIG9mIFsxMDAsMjAwXTwvY2FwdGlvbj5cbiAgKiBjb250cm9sLnNldFByb2plY3Rpb25SYW5nZSgxMDAsIDIwMClcbiAgKiBjb250cm9sLnZhbHVlID0gMDsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgMTAwXG4gICogY29udHJvbC52YWx1ZSA9IDAuNTsgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDE1MFxuICAqIGNvbnRyb2wudmFsdWUgPSAxOyAgIGNvbnRyb2wucHJvamVjdGlvblZhbHVlKCkgLy8gcmV0dXJucyAyMDBcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbNTAsMzBdPC9jYXB0aW9uPlxuICAqIGNvbnRyb2wuc2V0UHJvamVjdGlvblJhbmdlKDMwLCA1MClcbiAgKiBjb250cm9sLnZhbHVlID0gMDsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgNTBcbiAgKiBjb250cm9sLnZhbHVlID0gMC41OyBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgNDBcbiAgKiBjb250cm9sLnZhbHVlID0gMTsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgMzBcbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHByb2plY3RlZFZhbHVlKCkge1xuICAgIGxldCBwcm9qZWN0aW9uUmFuZ2UgPSB0aGlzLnByb2plY3Rpb25FbmQgLSB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgICByZXR1cm4gKHRoaXMudmFsdWUgKiBwcm9qZWN0aW9uUmFuZ2UpICsgdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gIH1cblxuICAvLyBUT0RPOiByZWludHJvZHVjZSB3aGVuIHRlc3RlZFxuICAvLyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMV0qIGZvciB0aGVcbiAgLy8gYHByb2plY3RlZFZhbHVlYCBpbiB0aGUgcmFuZ2UgYFtwcm9qZWN0aW9uU3RhcnQscHJvamVjdGlvbkVuZF1gLlxuICAvLyB2YWx1ZU9mUHJvamVjdGVkKHByb2plY3RlZFZhbHVlKSB7XG4gIC8vICAgbGV0IHByb2plY3Rpb25SYW5nZSA9IHRoaXMucHJvamVjdGlvbkVuZCAtIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICAvLyAgIHJldHVybiAocHJvamVjdGVkVmFsdWUgLSB0aGlzLnByb2plY3Rpb25TdGFydCkgLyBwcm9qZWN0aW9uUmFuZ2U7XG4gIC8vIH1cblxuXG4gIC8vIFRPRE86IGRvY3VtZW50LCB0ZXN0XG4gIHNldFByb2plY3Rpb25SYW5nZShzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5wcm9qZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLnByb2plY3Rpb25FbmQgPSBlbmQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGAxYCwgY29ycmVzcG9uZGluZ2x5LlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBjb250cm9sLnNldExpbWl0c1dpdGhJbnNldHMoMC4xLCAwLjIpXG4gICogLy8gcmV0dXJucyAwLjEsIHNpbmNlIDAgKyAwLjEgPSAwLjFcbiAgKiBjb250cm9sLnN0YXJ0TGltaXRcbiAgKiAvLyByZXR1cm5zIDAuOCwgc2luY2UgMSAtIDAuMiA9IDAuOFxuICAqIGNvbnRyb2wuZW5kTGltaXRcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDFgIHRvIHVzZSBmb3IgYGVuZExpbWl0YFxuICAqL1xuICBzZXRMaW1pdHNXaXRoSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gICAgdGhpcy5zdGFydExpbWl0ID0gc3RhcnRJbnNldDtcbiAgICB0aGlzLmVuZExpbWl0ID0gMSAtIGVuZEluc2V0O1xuICB9XG5cblxuICAvLyBUT0RPOiByZWludHJvZHVjZSB3aGVuIHRlc3RlZFxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG8gdGhlXG4gIC8vIFswLDFdIHJhbmdlLlxuICAvLyBzZXRMaW1pdHNXaXRoUHJvamVjdGlvbkluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAvLyAgIHRoaXMuc3RhcnRMaW1pdCA9IHRoaXMudmFsdWVPZihzdGFydEluc2V0KTtcbiAgLy8gICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKDEgLSBlbmRJbnNldCk7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIEFkZHMgYSBtYXJrZXIgYXQgdGhlIGN1cnJlbnQgYHZhbHVlYC5cbiAgKi9cbiAgYWRkTWFya2VyQXRDdXJyZW50VmFsdWUoKSB7XG4gICAgdGhpcy5tYXJrZXJzLnB1c2godGhpcy52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoaXMgY29udHJvbCBpcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wuXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgaXNTZWxlY3RlZCgpIHtcbiAgICBpZiAodGhpcy5yYWMuY29udHJvbGxlci5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmNvbnRyb2wgPT09IHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcmV0dXJuIHtSYWMuUG9pbnR9XG4gICovXG4gIGtub2IoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgYW5jaG9yIHRvIGJlIHBlcnNpdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAqXG4gICogRWFjaCBpbXBsZW1lbnRhdGlvbiBkZXRlcm1pbmVzIHRoZSB0eXBlIHVzZWQgZm9yIGBhbmNob3JgIGFuZFxuICAqIGBhZmZpeEFuY2hvcigpYC5cbiAgKlxuICAqIFRoaXMgZml4ZWQgYW5jaG9yIGlzIHBhc3NlZCBiYWNrIHRvIHRoZSBjb250cm9sIHRocm91Z2hcbiAgKiBgW3VwZGF0ZVdpdGhQb2ludGVyXXtAbGluayBSYWMuQ29udHJvbCN1cGRhdGVXaXRoUG9pbnRlcn1gIGFuZFxuICAqIGBbZHJhd1NlbGVjdGlvbl17QGxpbmsgUmFjLkNvbnRyb2wjZHJhd1NlbGVjdGlvbn1gIGR1cmluZyB1c2VyXG4gICogaW50ZXJhY3Rpb24uXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqL1xuICBhZmZpeEFuY2hvcigpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqL1xuICBkcmF3KCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICogQ2FsbGVkIGJ5IGBbcmFjLmNvbnRyb2xsZXIucG9pbnRlckRyYWdnZWRde0BsaW5rIFJhYy5Db250cm9sbGVyI3BvaW50ZXJEcmFnZ2VkfWBcbiAgKiBhcyB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aCB0aGUgY29udHJvbC5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gaW50ZXJwcmV0cyBgcG9pbnRlcktub2JDZW50ZXJgIGFnYWluc3QgYGZpeGVkQW5jaG9yYFxuICAqIHRvIHVwZGF0ZSBpdHMgb3duIHZhbHVlLiBUaGUgY3VycmVudCBgYW5jaG9yYCBpcyBub3QgdXNlZCBmb3IgdGhpc1xuICAqIHVwZGF0ZSBzaW5jZSBgYW5jaG9yYCBjb3VsZCBjaGFuZ2UgZHVyaW5nIHJlZHJhdyBpbiByZXNwb25zZSB0byB1cGRhdGVzXG4gICogaW4gYHZhbHVlYC5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gaXMgYWxzbyByZXNwb25zaWJsZSBvZiBrZWVwaW5nIHRoZSB1cGRhdGVkIGB2YWx1ZWBcbiAgKiB3aXRoaW4gdGhlIHJhbmdlIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLiBUaGlzIG1ldGhvZCBpcyB0aGUgb25seSBwYXRoXG4gICogZm9yIHVwZGF0aW5nIHRoZSBjb250cm9sIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbiwgYW5kIHRodXMgdGhlIG9ubHlcbiAgKiBwbGFjZSB3aGVyZSBlYWNoIGltcGxlbWVudGF0aW9uIG11c3QgZW5mb3JjZSBhIHZhbGlkIGB2YWx1ZWAgd2l0aGluXG4gICogKlswLDFdKiBhbmQgYFtzdGFydExpbWl0LGVuZExpbWl0XWAuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtPYmplY3R9IGZpeGVkQW5jaG9yIC0gQW5jaG9yIHByb2R1Y2VkIHdoZW4gdXNlciBpbnRlcmFjdGlvblxuICAqICAgc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGFsb25nIHdpdGggcG9pbnRlciBpbnRlcmFjdGlvbiB2aXN1YWxzLlxuICAqIENhbGxlZCBieSBgW3JhYy5jb250cm9sbGVyLmRyYXdDb250cm9sc117QGxpbmsgUmFjLkNvbnRyb2xsZXIjZHJhd0NvbnRyb2xzfWBcbiAgKiBvbmx5IGZvciB0aGUgc2VsZWN0ZWQgY29udHJvbC5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtPYmplY3R9IGZpeGVkQW5jaG9yIC0gQW5jaG9yIG9mIHRoZSBjb250cm9sIHByb2R1Y2VkIHdoZW4gdXNlclxuICAqICAgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxufSAvLyBjbGFzcyBDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sO1xuXG5cbi8vIENvbnRyb2xzIHNoYXJlZCBkcmF3aW5nIGVsZW1lbnRzXG5cbkNvbnRyb2wubWFrZUFycm93U2hhcGUgPSBmdW5jdGlvbihyYWMsIGNlbnRlciwgYW5nbGUpIHtcbiAgLy8gQXJjXG4gIGxldCBhbmdsZURpc3RhbmNlID0gcmFjLkFuZ2xlLmZyb20oMS8yMik7XG4gIGxldCBhcmMgPSBjZW50ZXIuYXJjKHJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUsXG4gICAgYW5nbGUuc3VidHJhY3QoYW5nbGVEaXN0YW5jZSksIGFuZ2xlLmFkZChhbmdsZURpc3RhbmNlKSk7XG5cbiAgLy8gQXJyb3cgd2FsbHNcbiAgbGV0IHBvaW50QW5nbGUgPSByYWMuQW5nbGUuZnJvbSgxLzgpO1xuICBsZXQgcmlnaHRXYWxsID0gYXJjLnN0YXJ0UG9pbnQoKS5yYXkoYW5nbGUuYWRkKHBvaW50QW5nbGUpKTtcbiAgbGV0IGxlZnRXYWxsID0gYXJjLmVuZFBvaW50KCkucmF5KGFuZ2xlLnN1YnRyYWN0KHBvaW50QW5nbGUpKTtcblxuICAvLyBBcnJvdyBwb2ludFxuICBsZXQgcG9pbnQgPSByaWdodFdhbGwucG9pbnRBdEludGVyc2VjdGlvbihsZWZ0V2FsbCk7XG5cbiAgLy8gU2hhcGVcbiAgcmFjLnB1c2hTaGFwZSgpO1xuICBwb2ludC5zZWdtZW50VG9Qb2ludChhcmMuc3RhcnRQb2ludCgpKVxuICAgIC5hdHRhY2hUb1NoYXBlKCk7XG4gIGFyYy5hdHRhY2hUb1NoYXBlKCk7XG4gIGFyYy5lbmRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHBvaW50KVxuICAgIC5hdHRhY2hUb1NoYXBlKCk7XG5cbiAgcmV0dXJuIHJhYy5wb3BTaGFwZSgpO1xufTtcblxuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIgPSBmdW5jdGlvbihyYWMsIHBvaW50LCBhbmdsZSkge1xuICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgbGV0IHBlcnBlbmRpY3VsYXIgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZhbHNlKTtcbiAgbGV0IGNvbXBvc2l0ZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG5cbiAgcG9pbnQuc2VnbWVudFRvQW5nbGUocGVycGVuZGljdWxhciwgNClcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKDQpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG4gIHBvaW50LnBvaW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCA4KS5hcmMoMylcbiAgICAuYXR0YWNoVG8oY29tcG9zaXRlKTtcblxuICByZXR1cm4gY29tcG9zaXRlO1xufTtcblxuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIgPSBmdW5jdGlvbihyYWMsIHBvaW50LCBhbmdsZSkge1xuICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgcmV0dXJuIHBvaW50LnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLnBlcnBlbmRpY3VsYXIoKSwgMylcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKDMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogSW5mb3JtYXRpb24gcmVnYXJkaW5nIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWRcbiogYFtDb250cm9sXXtAbGluayBSYWMuQ29udHJvbH1gLlxuKlxuKiBDcmVhdGVkIGFuZCBrZXB0IGJ5IGBbQ29udHJvbGxlcl17QGxpbmsgUmFjLkNvbnRyb2xsZXJ9YCB3aGVuIGEgY29udHJvbFxuKiBiZWNvbWVzIHNlbGVjdGVkLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9uXG4qL1xuY2xhc3MgQ29udHJvbFNlbGVjdGlvbntcblxuICAvKipcbiAgKiBCdWlsZHMgYSBuZXcgYFNlbGVjdGlvbmAgd2l0aCB0aGUgZ2l2ZW4gYGNvbnRyb2xgIGFuZCBwb2ludGVyIGxvY2F0ZWRcbiAgKiBhdCBgcG9pbnRlckNlbnRlcmAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db250cm9sfSBjb250cm9sIC0gVGhlIHNlbGVjdGVkIGNvbnRyb2xcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgcG9pbnRlciB3aGVuXG4gICogICB0aGUgc2VsZWN0aW9uIHN0YXJ0ZWRcbiAgKi9cbiAgY29uc3RydWN0b3IoY29udHJvbCwgcG9pbnRlckNlbnRlcikge1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc2VsZWN0ZWQgY29udHJvbC5cbiAgICAqIEB0eXBlIHtSYWMuQ29udHJvbH1cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG5cbiAgICAvKipcbiAgICAqIEFuY2hvciBwcm9kdWNlZCBieVxuICAgICogYFtjb250cm9sLmFmZml4QW5jaG9yXXtAbGluayBSYWMuQ29udHJvbCNhZmZpeEFuY2hvcn1gIHdoZW4gdGhlXG4gICAgKiBzZWxlY3Rpb24gYmVnYW4uXG4gICAgKlxuICAgICogVGhpcyBhbmNob3IgaXMgcGVyc2lzdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uIGFzIHRvIGFsbG93IHRoZSB1c2VyXG4gICAgKiB0byBpbnRlcmFjdCB3aXRoIHRoZSBzZWxlY3RlZCBjb250cm9sIGluIGEgZml4ZWQgbG9jYXRpb24sIGV2ZW4gaWZcbiAgICAqIHRoZSBjb250cm9sIG1vdmVzIGR1cmluZyB0aGUgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUge09iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZml4ZWRBbmNob3IgPSBjb250cm9sLmFmZml4QW5jaG9yKCk7XG5cbiAgICAvKipcbiAgICAqIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHMgdGhlIG9mZnNldCBmcm9tIHRoZSBwb2ludGVyIHBvc2l0aW9uIHRvIHRoZVxuICAgICogY29udHJvbCBrbm9iIGNlbnRlci5cbiAgICAqXG4gICAgKiBVc2VkIHRvIGludGVyYWN0IHdpdGggdGhlIGNvbnRyb2wga25vYiBhdCBhIGNvbnN0YW50IG9mZnNldCBwb3NpdGlvblxuICAgICogZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIHBvaW50ZXIgc3RhcnRpbmcgbG9jYXRpb24gaXMgZXF1YWwgdG8gYHNlZ21lbnQuc3RhcnRQb2ludCgpYCxcbiAgICAqIHRoZSBjb250cm9sIGtub2IgY2VudGVyIHN0YXJ0aW5nIHBvc2l0aW9uIGlzIGVxdWFsIHRvXG4gICAgKiBgc2VnbWVudC5lbmRQb2ludCgpYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLlNlZ21lbnR9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ZXJUb0tub2JPZmZzZXQgPSBwb2ludGVyQ2VudGVyLnNlZ21lbnRUb1BvaW50KGNvbnRyb2wua25vYigpKTtcbiAgfVxuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlcikge1xuICAgIHRoaXMuY29udHJvbC5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIHRoaXMuZml4ZWRBbmNob3IsIHRoaXMucG9pbnRlclRvS25vYk9mZnNldCk7XG4gIH1cbn1cblxuXG4vKipcbiogTWFuYWdlciBvZiBpbnRlcmFjdGl2ZSBgW0NvbnRyb2xde0BsaW5rIFJhYy5Db250cm9sfWBzIGZvciBhbiBpbnN0YW5jZVxuKiBvZiBgUmFjYC5cbipcbiogQ29udGFpbnMgYSBsaXN0IG9mIGFsbCBtYW5hZ2VkIGNvbnRyb2xzIGFuZCBjb29yZGluYXRlcyBkcmF3aW5nIGFuZCB1c2VyXG4qIGludGVyYWN0aW9uIGJldHdlZW4gdGhlbS5cbipcbiogRm9yIGNvbnRyb2xzIHRvIGJlIGZ1bmN0aW9uYWwgdGhlIGBwb2ludGVyUHJlc3NlZGAsIGBwb2ludGVyUmVsZWFzZWRgLFxuKiBhbmQgYHBvaW50ZXJEcmFnZ2VkYCBtZXRob2RzIGhhdmUgdG8gYmUgY2FsbGVkIGFzIHBvaW50ZXIgaW50ZXJhY3Rpb25zXG4qIGhhcHBlbi4gVGhlIGBkcmF3Q29udHJvbHNgIG1ldGhvZCBoYW5kbGVzIHRoZSBkcmF3aW5nIG9mIGFsbCBjb250cm9sc1xuKiBhbmQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBpdCBpcyB1c3VhbGx5IGNhbGxlZCBhdCB0aGUgdmVyeSBlbmRcbiogb2YgZHJhd2luZy5cbipcbiogQWxzbyBjb250YWlucyBzZXR0aW5ncyBzaGFyZWQgYmV0d2VlbiBhbGwgY29udHJvbHMgYW5kIHVzZWQgZm9yIHVzZXJcbiogaW50ZXJhY3Rpb24sIGxpa2UgYHBvaW50ZXJTdHlsZWAgdG8gZHJhdyB0aGUgcG9pbnRlciwgYGNvbnRyb2xTdHlsZWAgYXNcbiogYSBkZWZhdWx0IHN0eWxlIGZvciBkcmF3aW5nIGNvbnRyb2xzLCBhbmQgYGtub2JSYWRpdXNgIHRoYXQgZGVmaW5lcyB0aGVcbiogc2l6ZSBvZiB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudCBvZiBtb3N0IGNvbnRyb2xzLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXJcbiovXG5jbGFzcyBDb250cm9sbGVyIHtcblxuICBzdGF0aWMgU2VsZWN0aW9uID0gQ29udHJvbFNlbGVjdGlvbjtcblxuXG4gIC8qKlxuICAqIEJ1aWxkcyBhIG5ldyBgQ29udHJvbGxlcmAgd2l0aCB0aGUgZ2l2ZW4gYFJhY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYykge1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIERpc3RhbmNlIGF0IHdoaWNoIHRoZSBwb2ludGVyIGlzIGNvbnNpZGVyZWQgdG8gaW50ZXJhY3Qgd2l0aCBhXG4gICAgKiBjb250cm9sIGtub2IuIEFsc28gdXNlZCBieSBjb250cm9scyBmb3IgZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5rbm9iUmFkaXVzID0gMjI7XG5cbiAgICAvKipcbiAgICAqIENvbGxlY3Rpb24gb2YgYWxsIGNvbnRyb2xscyBtYW5hZ2VkIGJ5IHRoZSBpbnN0YW5jZS4gQ29udHJvbHMgaW4gdGhpc1xuICAgICogbGlzdCBhcmUgY29uc2lkZXJlZCBmb3IgcG9pbnRlciBoaXQgdGVzdGluZyBhbmQgZm9yIGRyYXdpbmcuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5Db250cm9sW119XG4gICAgKiBAZGVmYXVsdCBbXVxuICAgICovXG4gICAgdGhpcy5jb250cm9scyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBJbmRpY2F0ZXMgY29udHJvbHMgdG8gYWRkIHRoZW1zZWx2ZXMgaW50byBgdGhpcy5jb250cm9sc2Agd2hlblxuICAgICogY3JlYXRlZC5cbiAgICAqXG4gICAgKiBUaGlzIHByb3BlcnR5IGlzIGEgc2hhcmVkIGNvbmZpZ3VyYXRpb24uIFRoZSBiZWhhdmlvdXIgaXMgaW1wbGVtZW50ZWRcbiAgICAqIGluZGVwZW5kZW50bHkgYnkgZWFjaCBjb250cm9sIGNvbnN0cnVjdG9yLlxuICAgICpcbiAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICovXG4gICAgdGhpcy5hdXRvQWRkQ29udHJvbHMgPSB0cnVlO1xuXG4gICAgLy8gVE9ETzogc2VwYXJhdGUgbGFzdENvbnRyb2wgZnJvbSBsYXN0UG9pbnRlclxuXG4gICAgLy8gTGFzdCBgUG9pbnRgIG9mIHRoZSBwb3NpdGlvbiB3aGVuIHRoZSBwb2ludGVyIHdhcyBwcmVzc2VkLCBvciBsYXN0XG4gICAgLy8gQ29udHJvbCBpbnRlcmFjdGVkIHdpdGguIFNldCB0byBgbnVsbGAgd2hlbiB0aGVyZSBoYXMgYmVlbiBub1xuICAgIC8vIGludGVyYWN0aW9uIHlldCBhbmQgd2hpbGUgdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLlxuICAgIHRoaXMubGFzdFBvaW50ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBlbGVtZW50cyByZWxhdGVkIHRvIHBvaW50ZXJcbiAgICAqIGludGVyYWN0aW9uIGFuZCBjb250cm9sIHNlbGVjdGlvbi4gV2hlbiBgbnVsbGAgbm8gcG9pbnRlciBvclxuICAgICogc2VsZWN0aW9uIHZpc3VhbHMgYXJlIGRyYXduLlxuICAgICpcbiAgICAqIEJ5IGRlZmF1bHQgY29udGFpbnMgYSBzdHlsZSB0aGF0IHVzZXMgdGhlIGN1cnJlbnQgc3Ryb2tlXG4gICAgKiBjb25maWd1cmF0aW9uIHdpdGggbm8tZmlsbC5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQge0BsaW5rIGluc3RhbmNlLkZpbGwjbm9uZX1cbiAgICAqL1xuICAgIHRoaXMucG9pbnRlclN0eWxlID0gcmFjLkZpbGwubm9uZTtcblxuICAgIC8qKlxuICAgICogRGVmYXVsdCBzdHlsZSB0byBhcHBseSBmb3IgYWxsIGNvbnRyb2xzLiBXaGVuIHNldCBpdCBpcyBhcHBsaWVkXG4gICAgKiBiZWZvcmUgY29udHJvbCBkcmF3aW5nLiBUaGUgaW5kaXZpZHVhbCBjb250cm9sIHN0eWxlIGluXG4gICAgKiBgW2NvbnRyb2wuc3R5bGVde0BsaW5rIFJhYy5Db250cm9sI3N0eWxlfWAgaXMgYXBwbGllZCBhZnRlcndhcmRzLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2xTdHlsZSA9IG51bGxcblxuICAgIC8qKlxuICAgICogU2VsZWN0aW9uIGluZm9ybWF0aW9uIGZvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wsIG9yIGBudWxsYFxuICAgICogd2hlbiB0aGVyZSBpcyBubyBzZWxlY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuQ29udHJvbGxlci5TZWxlY3Rpb259XG4gICAgKi9cbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG5cbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG5cbiAgLyoqXG4gICogUHVzaGVzIGBjb250cm9sYCBpbnRvIGB0aGlzLmNvbnRyb2xzYCwgYWxsb3dpbmcgdGhlIGluc3RhbmNlIHRvIGhhbmRsZVxuICAqIHBvaW50ZXIgaW50ZXJhY3Rpb24gYW5kIGRyYXdpbmcgb2YgYGNvbnRyb2xgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29udHJvbH0gY29udHJvbCAtIEEgYENvbnRyb2xgIHRvIGFkZCBpbnRvIGBjb250cm9sc2BcbiAgKi9cbiAgYWRkKGNvbnRyb2wpIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIHByZXNzZWQgYXQgdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBBbGwgY29udHJvbHMgYXJlIGhpdCB0ZXN0ZWQgYW5kIHRoZSBmaXJzdFxuICAqIGNvbnRyb2wgdG8gYmUgaGl0IGlzIG1hcmtlZCBhcyBzZWxlY3RlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBwcmVzcyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICBwcmVzc2VkXG4gICovXG4gIHBvaW50ZXJQcmVzc2VkKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8vIFRlc3QgcG9pbnRlciBoaXRcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuY29udHJvbHMuZmluZCggaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sS25vYiA9IGl0ZW0ua25vYigpO1xuICAgICAgaWYgKGNvbnRyb2xLbm9iID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGNvbnRyb2xLbm9iLmRpc3RhbmNlVG9Qb2ludChwb2ludGVyQ2VudGVyKSA8PSB0aGlzLmtub2JSYWRpdXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoc2VsZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IENvbnRyb2xsZXIuU2VsZWN0aW9uKHNlbGVjdGVkLCBwb2ludGVyQ2VudGVyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gZHJhZ2dlZCB0byB0aGVcbiAgKiBgcG9pbnRlckNlbnRlcmAgbG9jYXRpb24uIFdoZW4gdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLCB1c2VyXG4gICogaW50ZXJhY3Rpb24gaXMgcGVyZm9ybWVkIGFuZCB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBhbG9uZyBwb2ludGVyIGRyYWcgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgZHJhZ2dlZFxuICAqL1xuICBwb2ludGVyRHJhZ2dlZChwb2ludGVyQ2VudGVyKXtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY29udHJvbCA9IHRoaXMuc2VsZWN0aW9uLmNvbnRyb2w7XG4gICAgbGV0IGZpeGVkQW5jaG9yID0gdGhpcy5zZWxlY3Rpb24uZml4ZWRBbmNob3I7XG5cbiAgICAvLyBPZmZzZXQgY2VudGVyIG9mIGRyYWdnZWQgY29udHJvbCBrbm9iIGZyb20gdGhlIHBvaW50ZXIgcG9zaXRpb25cbiAgICBsZXQgcG9pbnRlcktub2JDZW50ZXIgPSB0aGlzLnNlbGVjdGlvbi5wb2ludGVyVG9Lbm9iT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgY29udHJvbC51cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBOb3RpZmllcyB0aGUgaW5zdGFuY2UgdGhhdCB0aGUgcG9pbnRlciBoYXMgYmVlbiByZWxlYXNlZCBhdCB0aGVcbiAgKiBgcG9pbnRlckNlbnRlcmAgbG9jYXRpb24uIFdoZW4gdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLCB1c2VyXG4gICogaW50ZXJhY3Rpb24gaXMgZmluYWxpemVkIGFuZCB0aGUgY29udHJvbCBzZWxlY3Rpb24gaXMgY2xlYXJlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBkcmFnIGludGVyYWN0aW9uIGZvciBhbGxcbiAgKiBtYW5hZ2VkIGNvbnRyb2xzIHRvIHByb3Blcmx5IHdvcmsuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgcG9pbnRlciB3YXNcbiAgKiAgIHJlbGVhc2VkXG4gICovXG4gIHBvaW50ZXJSZWxlYXNlZChwb2ludGVyQ2VudGVyKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICB0aGlzLmxhc3RQb2ludGVyID0gcG9pbnRlckNlbnRlcjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RQb2ludGVyID0gdGhpcy5zZWxlY3Rpb24uY29udHJvbDtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIGFsbCBjb250cm9scyBjb250YWluZWQgaW5cbiAgKiBgW2NvbnRyb2xzXXtAbGluayBSYWMuQ29udHJvbGxlciNjb250cm9sc31gIGFsb25nIHRoZSB2aXN1YWwgZWxlbWVudHNcbiAgKiBmb3IgcG9pbnRlciBhbmQgY29udHJvbCBzZWxlY3Rpb24uXG4gICpcbiAgKiBVc3VhbGx5IGNhbGxlZCBhdCB0aGUgZW5kIG9mIGRyYXdpbmcsIGFzIHRvIGRyYXcgY29udHJvbHMgb24gdG9wIG9mXG4gICogb3RoZXIgZ3JhcGhpY3MuXG4gICovXG4gIGRyYXdDb250cm9scygpIHtcbiAgICBsZXQgcG9pbnRlckNlbnRlciA9IHRoaXMucmFjLlBvaW50LnBvaW50ZXIoKTtcbiAgICB0aGlzLmRyYXdQb2ludGVyKHBvaW50ZXJDZW50ZXIpO1xuXG4gICAgLy8gQWxsIGNvbnRyb2xzIGluIGRpc3BsYXlcbiAgICB0aGlzLmNvbnRyb2xzLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlcik7XG4gICAgfVxuICB9XG5cblxuICBkcmF3UG9pbnRlcihwb2ludGVyQ2VudGVyKSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMYXN0IHBvaW50ZXIgb3IgY29udHJvbFxuICAgIGlmICh0aGlzLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgUmFjLlBvaW50KSB7XG4gICAgICB0aGlzLmxhc3RQb2ludGVyLmFyYygxMikuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0UG9pbnRlciBpbnN0YW5jZW9mIFJhYy5Db250cm9sKSB7XG4gICAgICAvLyBUT0RPOiBpbXBsZW1lbnQgbGFzdCBzZWxlY3RlZCBjb250cm9sIHN0YXRlXG4gICAgfVxuXG4gICAgLy8gUG9pbnRlciBwcmVzc2VkXG4gICAgaWYgKHRoaXMucmFjLmRyYXdlci5wNS5tb3VzZUlzUHJlc3NlZCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgIHBvaW50ZXJDZW50ZXIuYXJjKDEwKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb2ludGVyQ2VudGVyLmFyYyg1KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxufSAvLyBjbGFzcyBDb250cm9sbGVyXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250cm9sIHRoYXQgYWxsb3dzIHRoZSBzZWxlY3Rpb24gb2YgYSB2YWx1ZSB3aXRoIGEga25vYiB0aGF0IHNsaWRlc1xuKiB0aHJvdWdoIHRoZSBzZWdtZW50IG9mIGEgYFJheWAuXG4qXG4qIFVzZXMgYSBgUmF5YCBhcyBgW2FuY2hvcl17QGxpbmsgUmFjLlJheUNvbnRyb2wjYW5jaG9yfWAsIHdoaWNoIGRlZmluZXNcbiogdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuKlxuKiBgW2xlbmd0aF17QGxpbmsgUmFjLlJheUNvbnRyb2wjbGVuZ3RofWAgZGVmaW5lcyB0aGUgbGVuZ3RoIG9mIHRoZVxuKiBzZWdtZW50IGluIHRoZSBgYW5jaG9yYCByYXkgd2hpY2ggaXMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuKiBXaXRoaW4gdGhpcyBzZWdtZW50IHRoZSB1c2VyIGNhbiBzbGlkZSB0aGUgY29udHJvbCBrbm9iIHRvIHNlbGVjdCBhXG4qIHZhbHVlLlxuKlxuKiBAYWxpYXMgUmFjLlJheUNvbnRyb2xcbiogQGV4dGVuZHMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBSYXlDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheUNvbnRyb2xgIGluc3RhbmNlIHdpdGggdGhlIHN0YXJ0aW5nIGB2YWx1ZWAgYW5kIHRoZVxuICAqIGludGVyYWN0aXZlIGBsZW5ndGhgLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBjb250cm9sLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYGFuY2hvcmAgcmF5IGF2YWlsYWJsZSBmb3JcbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb25cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgdmFsdWUsIGxlbmd0aCk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHZhbHVlLCBsZW5ndGgpO1xuXG4gICAgc3VwZXIocmFjLCB2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIExlbmd0aCBvZiB0aGUgYGFuY2hvcmAgcmF5IGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblxuICAgIC8qKlxuICAgICogYFJheWAgdG8gd2hpY2ggdGhlIGNvbnRyb2wgd2lsbCBiZSBhbmNob3JlZC4gRGVmaW5lcyB0aGUgbG9jYXRpb25cbiAgICAqIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuICAgICpcbiAgICAqIEFsb25nIHdpdGggYFtsZW5ndGhde0BsaW5rIFJhYy5SYXlDb250cm9sI2xlbmd0aH1gIGRlZmluZXMgdGhlXG4gICAgKiBzZWdtZW50IGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgY29udHJvbCBjYW5ub3QgYmUgZHJhd24gb3Igc2VsZWN0ZWQgdW50aWwgdGhpcyBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuUmF5fVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJhYy5jb250cm9sbGVyLmF1dG9BZGRDb250cm9scykge1xuICAgICAgcmFjLmNvbnRyb2xsZXIuYWRkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gVE9ETzogZG9jdW1lbnQsIHRlc3RcbiAgc3RhcnRMaW1pdExlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydExpbWl0ICogdGhpcy5sZW5ndGg7XG4gIH1cblxuICAvLyBUT0RPOiBkb2N1bWVudCwgdGVzdFxuICBlbmRMaW1pdExlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmRMaW1pdCAqIHRoaXMubGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGB2YWx1ZWAgdXNpbmcgdGhlIHByb2plY3Rpb24gb2YgYGxlbmd0aFZhbHVlYCBpbiB0aGUgYFswLGxlbmd0aF1gXG4gICogcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoVmFsdWUgLSBUaGUgbGVuZ3RoIGF0IHdoaWNoIHRvIHNldCB0aGUgY3VycmVudFxuICAqICAgdmFsdWVcbiAgKi9cbiAgc2V0VmFsdWVXaXRoTGVuZ3RoKGxlbmd0aFZhbHVlKSB7XG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbGVuZ3RoVmFsdWUgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGBsZW5ndGhgLCBjb3JyZXNwb25kaW5nbHksIGJvdGggcHJvamVjdGVkIGluIHRoZSBgWzAsbGVuZ3RoXWBcbiAgKiByYW5nZS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgUmF5Q29udHJvbCB3aXRoIGxlbmd0aCBvZiAyMDA8L2NhcHRpb24+XG4gICogbGV0IGNvbnRyb2wgPSBuZXcgUmFjLlJheUNvbnRyb2wocmFjLCAwLjUsIDIwMCk7XG4gICogY29udHJvbC5zZXRMaW1pdHNXaXRoTGVuZ3RoSW5zZXRzKDEwLCAyMCk7XG4gICogLy8gcmV0dXJucyAxMCwgc2luY2UgMCArIDEwID0gMTBcbiAgKiBjb250cm9sLnN0YXJ0TGltaXRMZW5ndGgoKVxuICAqIC8vIHJldHVybnMgMC4wNSwgc2luY2UgMCArICgxMCAvIDIwMCkgPSAwLjA1XG4gICogY29udHJvbC5zdGFydExpbWl0XG4gICogLy8gcmV0dXJucyAxODAsIHNpbmNlIDIwMCAtIDIwID0gMTgwXG4gICogY29udHJvbC5lbmRMaW1pdExlbmd0aCgpXG4gICogLy8gcmV0dXJucyAwLjksIHNpbmNlIDEgLSAoMjAgLyAyMDApID0gMC45XG4gICogY29udHJvbC5lbmRMaW1pdFxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsbGVuZ3RoXWAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kSW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgbGVuZ3RoYCBpbiB0aGUgcmFuZ2VcbiAgKiAgIGBbMCxsZW5ndGhdYCB0byB1c2UgZm9yIGBlbmRMaW1pdGBcbiAgKi9cbiAgc2V0TGltaXRzV2l0aExlbmd0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpIC8gdGhpcy5sZW5ndGg7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGBhbmNob3JgIHJheSBgc3RhcnRgIGFuZCB0aGUgY29udHJvbFxuICAqIGtub2IuXG4gICpcbiAgKiBFcXVpdmFsZW50IHRvIHRoZSBjb250cm9sIGB2YWx1ZWAgcHJvamVjdGVkIHRvIHRoZSByYW5nZSBgWzAsbGVuZ3RoXWAuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggKiB0aGlzLnZhbHVlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiBXaGVuIGBhbmNob3JgIGlzIG5vdCBzZXQsIHJldHVybnMgYG51bGxgIGluc3RlYWQuXG4gICpcbiAgKiBAcmV0dXJuIHs/UmFjLlBvaW50fVxuICAqL1xuICBrbm9iKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gTm90IHBvc2libGUgdG8gY2FsY3VsYXRlIHRoZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXREaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwcm9kdWNlZCB3aXRoIHRoZSBgYW5jaG9yYCByYXkgd2l0aCBgbGVuZ3RoYCxcbiAgKiB0byBiZSBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGFuY2hvcmAgaXMgbm90IHNldC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uKFxuICAgICAgICBgRXhwZWN0ZWQgYW5jaG9yIHRvIGJlIHNldCwgbnVsbCBmb3VuZCBpbnN0ZWFkYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5zZWdtZW50KHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgZml4ZWRBbmNob3IuZHJhdyhjb250cm9sU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5hbmdsZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIGl0ZW0pO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gQ29udHJvbCBrbm9iXG4gICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmICh0aGlzLnZhbHVlID49IHRoaXMuc3RhcnRMaW1pdCArIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA8PSB0aGlzLmVuZExpbWl0IC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgICAgaWYgKHBvaW50ZXJTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICpcbiAgKiBgdmFsdWVgIGlzIGFsd2F5cyB1cGRhdGVkIGJ5IHRoaXMgbWV0aG9kIHRvIGJlIHdpdGhpbiAqWzAsMV0qIGFuZFxuICAqIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gZml4ZWRBbmNob3IgLSBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgXG4gICogICB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogdGhpcy5zdGFydExpbWl0O1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICAvLyBOZXcgdmFsdWUgZnJvbSB0aGUgY3VycmVudCBwb2ludGVyIHBvc2l0aW9uLCByZWxhdGl2ZSB0byBmaXhlZEFuY2hvclxuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludGVyS25vYkNlbnRlcik7XG4gICAgLy8gQ2xhbXBpbmcgdmFsdWUgKGphdmFzY3JpcHQgaGFzIG5vIE1hdGguY2xhbXApXG4gICAgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5jbGFtcFRvTGVuZ3RoKG5ld0Rpc3RhbmNlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuXG4gICAgLy8gVXBkYXRlIGNvbnRyb2wgd2l0aCBuZXcgZGlzdGFuY2VcbiAgICBsZXQgbGVuZ3RoUmF0aW8gPSBuZXdEaXN0YW5jZSAvIGxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gZml4ZWRBbmNob3IgLSBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgXG4gICogICB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcbiAgICBmaXhlZEFuY2hvci5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuYW5nbGUoKTtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiBpdGVtKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIExpbWl0IG1hcmtlcnNcbiAgICBpZiAodGhpcy5zdGFydExpbWl0ID4gMCkge1xuICAgICAgbGV0IG1pblBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogdGhpcy5zdGFydExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmRMaW1pdCA8IDEpIHtcbiAgICAgIGxldCBtYXhQb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuZW5kTGltaXQpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgYW5nbGUuaW52ZXJzZSgpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWdtZW50IGZyb20gcG9pbnRlciB0byBjb250cm9sIGRyYWdnZWQgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRDZW50ZXIgPSBwb2ludGVyVG9Lbm9iT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBkcmFnZ2VkIGNlbnRlciwgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIGRyYWdnZWRDZW50ZXIuYXJjKDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIENvbnN0cmFpbmVkIGxlbmd0aCBjbGFtcGVkIHRvIGxpbWl0c1xuICAgIGxldCBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChkcmFnZ2VkQ2VudGVyKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdDtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMuZW5kTGltaXQpO1xuICAgIGNvbnN0cmFpbmVkTGVuZ3RoID0gZml4ZWRBbmNob3IuY2xhbXBUb0xlbmd0aChjb25zdHJhaW5lZExlbmd0aCxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIGxldCBjb25zdHJhaW5lZEFuY2hvckNlbnRlciA9IGZpeGVkQW5jaG9yXG4gICAgICAud2l0aExlbmd0aChjb25zdHJhaW5lZExlbmd0aClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBjZW50ZXIgY29uc3RyYWluZWQgdG8gYW5jaG9yXG4gICAgY29uc3RyYWluZWRBbmNob3JDZW50ZXIuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhZ2dlZCBzaGFkb3cgY2VudGVyLCBzZW1pIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICAvLyBhbHdheXMgcGVycGVuZGljdWxhciB0byBhbmNob3JcbiAgICBsZXQgZHJhZ2dlZFNoYWRvd0NlbnRlciA9IGRyYWdnZWRDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkoZml4ZWRBbmNob3IucmF5KVxuICAgICAgLy8gcmV2ZXJzZSBhbmQgdHJhbnNsYXRlZCB0byBjb25zdHJhaW50IHRvIGFuY2hvclxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhTdGFydFBvaW50KGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyKVxuICAgICAgLy8gU2VnbWVudCBmcm9tIGNvbnN0cmFpbmVkIGNlbnRlciB0byBzaGFkb3cgY2VudGVyXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIHNoYWRvdyBjZW50ZXJcbiAgICBkcmFnZ2VkU2hhZG93Q2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgLyAyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBFYXNlIGZvciBzZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBlYXNlT3V0ID0gUmFjLkVhc2VGdW5jdGlvbi5tYWtlRWFzZU91dCgpO1xuICAgIGVhc2VPdXQucG9zdEJlaGF2aW9yID0gUmFjLkVhc2VGdW5jdGlvbi5CZWhhdmlvci5jbGFtcDtcblxuICAgIC8vIFRhaWwgd2lsbCBzdG9wIHN0cmV0Y2hpbmcgYXQgMnggdGhlIG1heCB0YWlsIGxlbmd0aFxuICAgIGxldCBtYXhEcmFnZ2VkVGFpbExlbmd0aCA9IHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDU7XG4gICAgZWFzZU91dC5pblJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGggKiAyO1xuICAgIGVhc2VPdXQub3V0UmFuZ2UgPSBtYXhEcmFnZ2VkVGFpbExlbmd0aDtcblxuICAgIC8vIFNlZ21lbnQgdG8gZHJhZ2dlZCBzaGFkb3cgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRUYWlsID0gZHJhZ2dlZFNoYWRvd0NlbnRlclxuICAgICAgLnNlZ21lbnRUb1BvaW50KGRyYWdnZWRDZW50ZXIpO1xuXG4gICAgbGV0IGVhc2VkTGVuZ3RoID0gZWFzZU91dC5lYXNlVmFsdWUoZHJhZ2dlZFRhaWwubGVuZ3RoKTtcbiAgICBkcmFnZ2VkVGFpbC53aXRoTGVuZ3RoKGVhc2VkTGVuZ3RoKS5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhdyBhbGwhXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5Q29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5Q29udHJvbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFuZ2xlIG1lYXN1cmVkIHRocm91Z2ggYSBgdHVybmAgdmFsdWUgaW4gdGhlIHJhbmdlICpbMCwxKSogdGhhdFxuKiByZXByZXNlbnRzIHRoZSBhbW91bnQgb2YgdHVybiBpbiBhIGZ1bGwgY2lyY2xlLlxuKlxuKiBNb3N0IGZ1bmN0aW9ucyB0aHJvdWdoIFJBQyB0aGF0IGNhbiByZWNlaXZlIGFuIGBBbmdsZWAgcGFyYW1ldGVyIGNhblxuKiBhbHNvIHJlY2VpdmUgYSBgbnVtYmVyYCB2YWx1ZSB0aGF0IGlzIHVzZWQgYXMgYHR1cm5gIHRvIGluc3RhbnRpYXRlIGEgbmV3XG4qIGBBbmdsZWAuIFRoZSBtYWluIGV4Y2VwdGlvbiB0byB0aGlzIGJlaGF2aW91ciBhcmUgY29uc3RydWN0b3JzLFxuKiB3aGljaCBhbHdheXMgZXhwZWN0IHRvIHJlY2VpdmUgYEFuZ2xlYCBvYmplY3RzLlxuKlxuKiBGb3IgZHJhd2luZyBvcGVyYXRpb25zIHRoZSB0dXJuIHZhbHVlIG9mIGAwYCBwb2ludHMgcmlnaHQsIHdpdGggdGhlXG4qIGRpcmVjdGlvbiByb3RhdGluZyBjbG9ja3dpc2U6XG4qIGBgYFxuKiByYWMuQW5nbGUoMC80KSAvLyBwb2ludHMgcmlnaHRcbiogcmFjLkFuZ2xlKDEvNCkgLy8gcG9pbnRzIGRvd253YXJkc1xuKiByYWMuQW5nbGUoMi80KSAvLyBwb2ludHMgbGVmdFxuKiByYWMuQW5nbGUoMy80KSAvLyBwb2ludHMgdXB3YXJkc1xuKiBgYGBcbipcbiogIyMjIGBpbnN0YW5jZS5BbmdsZWBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5BbmdsZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNBbmdsZX0gdG8gY3JlYXRlIGBBbmdsZWAgb2JqZWN0cyB3aXRoXG4qIGZld2VyIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuQW5nbGUucXVhcnRlcmBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9LCBsaXN0ZWQgdW5kZXJcbiogW2BpbnN0YW5jZS5BbmdsZWBde0BsaW5rIGluc3RhbmNlLkFuZ2xlfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgYW5nbGUgPSBuZXcgUmFjLkFuZ2xlKHJhYywgMy84KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJBbmdsZSA9IHJhYy5BbmdsZSgzLzgpXG4qXG4qIEBzZWUgW2ByYWMuQW5nbGVgXXtAbGluayBSYWMjQW5nbGV9XG4qIEBzZWUgW2BpbnN0YW5jZS5BbmdsZWBde0BsaW5rIGluc3RhbmNlLkFuZ2xlfVxuKlxuKiBAYWxpYXMgUmFjLkFuZ2xlXG4qL1xuY2xhc3MgQW5nbGUge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFuZ2xlYCBpbnN0YW5jZS5cbiAgKlxuICAqIFRoZSBgdHVybmAgdmFsdWUgaXMgY29uc3RyYWluZWQgdG8gdGhlIHJhbmdlICpbMCwxKSosIGFueSB2YWx1ZVxuICAqIG91dHNpZGUgaXMgcmVkdWNlZCBpbnRvIHJhbmdlIHVzaW5nIGEgbW9kdWxvIG9wZXJhdGlvbjpcbiAgKiBgYGBcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIDEvNCkpIC50dXJuIC8vIHJldHVybnMgMS80XG4gICogKG5ldyBSYWMuQW5nbGUocmFjLCA1LzQpKSAudHVybiAvLyByZXR1cm5zIDEvNFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgLTEvNCkpLnR1cm4gLy8gcmV0dXJucyAzLzRcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIDEpKSAgIC50dXJuIC8vIHJldHVybnMgMFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgNCkpICAgLnR1cm4gLy8gcmV0dXJucyAwXG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHR1cm4gLSBUaGUgdHVybiB2YWx1ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHR1cm4pIHtcbiAgICAvLyBUT0RPOiBjaGFuZ2VkIHRvIGFzc2VydFR5cGUsIGFkZCB0ZXN0c1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLCByYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih0dXJuKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgdHVybiA9IHR1cm4gJSAxO1xuICAgIGlmICh0dXJuIDwgMCkge1xuICAgICAgdHVybiA9ICh0dXJuICsgMSkgJSAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogVHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5nZSAqWzAsMSkqLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudHVybiA9IHR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuQW5nbGUoMC4yKSkudG9TdHJpbmcoKVxuICAqIC8vIHJldHVybnM6ICdBbmdsZSgwLjIpJ1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBbmdsZSgke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCB0aGUgYHR1cm5gIHZhbHVlIG9mIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5BbmdsZS5mcm9tfSBgYW5nbGVgIGlzIHVuZGVyXG4gICogW2ByYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI3VuaXRhcnlFcXVhbGl0eVRocmVzaG9sZH07XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFRoZSBgb3RoZXJBbmdsZWAgcGFyYW1ldGVyIGNhbiBvbmx5IGJlIGBBbmdsZWAgb3IgYG51bWJlcmAsIGFueSBvdGhlclxuICAqIHR5cGUgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHR1cm4gdmFsdWVzIGluIHRoZSBvcG9zaXRlIGVuZHMgb2YgdGhlIHJhbmdlXG4gICogKlswLDEpKiBhcyBlcXVhbHMuIEUuZy4gYEFuZ2xlYCBvYmplY3RzIHdpdGggYHR1cm5gIHZhbHVlcyBvZiBgMGAgYW5kXG4gICogYDEgLSByYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkLzJgIGFyZSBjb25zaWRlcmVkIGVxdWFsLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqXG4gICogQHNlZSBbYHJhYy5BbmdsZS5mcm9tYF17QGxpbmsgUmFjLkFuZ2xlLmZyb219XG4gICovXG4gIGVxdWFscyhvdGhlckFuZ2xlKSB7XG4gICAgaWYgKG90aGVyQW5nbGUgaW5zdGFuY2VvZiBSYWMuQW5nbGUpIHtcbiAgICAgIC8vIGFsbCBnb29kIVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG90aGVyQW5nbGUgPT09ICdudW1iZXInKSB7XG4gICAgICBvdGhlckFuZ2xlID0gQW5nbGUuZnJvbSh0aGlzLnJhYywgb3RoZXJBbmdsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnModGhpcy50dXJuIC0gb3RoZXJBbmdsZS50dXJuKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZFxuICAgICAgLy8gRm9yIGNsb3NlIHZhbHVlcyB0aGF0IGxvb3AgYXJvdW5kXG4gICAgICB8fCAoMSAtIGRpZmYpIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBBbmdsZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBgbnVtYmVyYCwgcmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGhcbiAgKiAgIGBzb21ldGhpbmdgIGFzIGB0dXJuYC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5SYXl9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYHtAbGluayBSYWMuU2VnbWVudH1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxSYWMuUmF5fFJhYy5TZWdtZW50fE51bWJlcn0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzb21ldGhpbmcgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5SYXkpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmcuYW5nbGU7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU2VnbWVudCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5yYXkuYW5nbGU7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5BbmdsZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgcmFkaWFucyAvIFJhYy5UQVUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21EZWdyZWVzKHJhYywgZGVncmVlcykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBkZWdyZWVzIC8gMzYwKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHBvaW50aW5nIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gdG8gYHRoaXNgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDMvOCwgc2luY2UgMS84ICsgMS8yID0gNS84XG4gICogcmFjLkFuZ2xlKDEvOCkuaW52ZXJzZSgpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDMvOCwgc2luY2UgNy84ICsgMS8yID0gMy84XG4gICogcmFjLkFuZ2xlKDcvOCkuaW52ZXJzZSgpLnR1cm5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkKHRoaXMucmFjLkFuZ2xlLmludmVyc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBhIHR1cm4gdmFsdWUgZXF1aXZhbGVudCB0byBgLXR1cm5gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDMvNCwgc2luY2UgMSAtIDEvNCA9IDMvNFxuICAqIHJhYy5BbmdsZSgxLzQpLm5lZ2F0aXZlKCkudHVyblxuICAqIC8vIHJldHVybnMgNS84LCBzaW5jZSAxIC0gMy84ID0gNS84XG4gICogcmFjLkFuZ2xlKDMvOCkubmVnYXRpdmUoKS50dXJuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCAtdGhpcy50dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdoaWNoIGlzIHBlcnBlbmRpY3VsYXIgdG8gYHRoaXNgIGluIHRoZVxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDMvOCwgc2luY2UgMS84ICsgMS80ID0gMy84XG4gICogcmFjLkFuZ2xlKDEvOCkucGVycGVuZGljdWxhcih0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyA3LzgsIHNpbmNlIDEvOCAtIDEvNCA9IDcvOFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIoZmFsc2UpLnR1cm5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHJhZGlhbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudHVybiAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkZWdyZWVzKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiAzNjA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNpbmUgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgc2luKCkge1xuICAgIHJldHVybiBNYXRoLnNpbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgY29zaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGNvcygpIHtcbiAgICByZXR1cm4gTWF0aC5jb3ModGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHRhbmdlbnQgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgdGFuKCkge1xuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSBgKDAsIDFdYC4gV2hlbiBgdHVybmAgaXMgZXF1YWwgdG9cbiAgKiBgMGAgcmV0dXJucyBgMWAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHR1cm5PbmUoKSB7XG4gICAgaWYgKHRoaXMudHVybiA9PT0gMCkgeyByZXR1cm4gMTsgfVxuICAgIHJldHVybiB0aGlzLnR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBzdW0gb2YgYHRoaXNgIGFuZCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFkZChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICsgYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYFxuICAqIHN1YnRyYWN0ZWQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdWJ0cmFjdChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuIC0gYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYCBzZXQgdG8gYHRoaXMudHVybiAqIGZhY3RvcmAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBtdWx0KGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAqIGZhY3Rvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYCBzZXQgdG9cbiAgKiBge0BsaW5rIFJhYy5BbmdsZSN0dXJuT25lIHRoaXMudHVybk9uZSgpfSAqIGZhY3RvcmAuXG4gICpcbiAgKiBVc2VmdWwgd2hlbiBkb2luZyByYXRpbyBjYWxjdWxhdGlvbnMgd2hlcmUgYSB6ZXJvIGFuZ2xlIGNvcnJlc3BvbmRzIHRvXG4gICogYSBjb21wbGV0ZS1jaXJjbGUuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5BbmdsZSgwKS5tdWx0KDAuNSkudHVybiAgICAvLyByZXR1cm5zIDBcbiAgKiAvLyB3aGVyZWFzXG4gICogcmFjLkFuZ2xlKDApLm11bHRPbmUoMC41KS50dXJuIC8vIHJldHVybnMgMC41XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBtdWx0T25lKGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybk9uZSgpICogZmFjdG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gdGhlXG4gICogYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnMgMS8yLCBzaW5jZSAxLzIgLSAxLzQgPSAxLzRcbiAgKiByYWMuQW5nbGUoMS80KS5kaXN0YW5jZSgxLzIsIHRydWUpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDMvNCwgc2luY2UgMSAtICgxLzIgLSAxLzQpID0gMy80XG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCBmYWxzZSkudHVyblxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG1lYXN1cmVtZW50XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2UoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gYW5nbGUuc3VidHJhY3QodGhpcyk7XG4gICAgcmV0dXJuIGNsb2Nrd2lzZVxuICAgICAgPyBkaXN0YW5jZVxuICAgICAgOiBkaXN0YW5jZS5uZWdhdGl2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBhZGRpbmcgYGFuZ2xlYCB0byBgdGhpc2AsIGluIHRoZVxuICAqIGdpdmVuIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgZXF1aXZhbGVudCB0byBzaGlmdGluZyBgYW5nbGVgIHdoZXJlIGB0aGlzYCBpc1xuICAqIGNvbnNpZGVyZWQgdGhlIGFuZ2xlIG9mIG9yaWdpbi5cbiAgKlxuICAqIFRoZSByZXR1cm4gaXMgZXF1aXZhbGVudCB0bzpcbiAgKiArIGB0aGlzLmFkZChhbmdsZSlgIHdoZW4gY2xvY2t3aXNlXG4gICogKyBgdGhpcy5zdWJ0cmFjdChhbmdsZSlgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnQoMC41LCB0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjYsIHNpbmNlIDAuNSArIDAuMSA9IDAuNlxuICAqXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnQoMC41LCBmYWxzZSkudHVyblxuICAqIC8vIHJldHVybnMgMC40LCBzaW5jZSAwLjUgLSAwLjEgPSAwLjRcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gdGhpcy5hZGQoYW5nbGUpXG4gICAgICA6IHRoaXMuc3VidHJhY3QoYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcmVzdWx0IG9mIGFkZGluZyBgdGhpc2AgdG8gYG9yaWdpbmAsIGluIHRoZSBnaXZlblxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgZXF1aXZhbGVudCB0byBzaGlmdGluZyBgdGhpc2Agd2hlcmUgYG9yaWdpbmAgaXNcbiAgKiBjb25zaWRlcmVkIHRoZSBhbmdsZSBvZiBvcmlnaW4uXG4gICpcbiAgKiBUaGUgcmV0dXJuIGlzIGVxdWl2YWxlbnQgdG86XG4gICogKyBgb3JpZ2luLmFkZCh0aGlzKWAgd2hlbiBjbG9ja3dpc2VcbiAgKiArIGBvcmlnaW4uc3VidHJhY3QodGhpcylgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjUsIHRydWUpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDAuNiwgc2luY2UgMC41ICsgMC4xID0gMC42XG4gICpcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdFRvT3JpZ2luKDAuNSwgZmFsc2UpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDAuNCwgc2luY2UgMC41IC0gMC4xID0gMC40XG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG9yaWdpbiAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIG9yaWdpblxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzaGlmdFRvT3JpZ2luKG9yaWdpbiwgY2xvY2t3aXNlKSB7XG4gICAgb3JpZ2luID0gdGhpcy5yYWMuQW5nbGUuZnJvbShvcmlnaW4pO1xuICAgIHJldHVybiBvcmlnaW4uc2hpZnQodGhpcywgY2xvY2t3aXNlKTtcbiAgfVxuXG59IC8vIGNsYXNzIEFuZ2xlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbmdsZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuXG4vKipcbiogQXJjIG9mIGEgY2lyY2xlIGZyb20gYSBgc3RhcnRgIHRvIGFuIGBlbmRgIFthbmdsZV17QGxpbmsgUmFjLkFuZ2xlfS5cbipcbiogQXJjcyB0aGF0IGhhdmUgW2VxdWFsXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfSBgc3RhcnRgIGFuZCBgZW5kYCBhbmdsZXNcbiogYXJlIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4qXG4qICMjIyBgaW5zdGFuY2UuQXJjYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkFyY2AgZnVuY3Rpb25de0BsaW5rIFJhYyNBcmN9IHRvIGNyZWF0ZSBgQXJjYCBvYmplY3RzIGZyb21cbiogcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5BcmMuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFyYyN6ZXJvfSwgbGlzdGVkXG4qIHVuZGVyIFtgaW5zdGFuY2UuQXJjYF17QGxpbmsgaW5zdGFuY2UuQXJjfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgY2VudGVyID0gcmFjLlBvaW50KDU1LCA3NylcbiogbGV0IHN0YXJ0ID0gcmFjLkFuZ2xlKDEvOClcbiogbGV0IGVuZCA9IHJhYy5BbmdsZSgzLzgpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBhcmMgPSBuZXcgUmFjLkFyYyhyYWMsIGNlbnRlciwgMTAwLCBzdGFydCwgZW5kLCB0cnVlKVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJBcmMgPSByYWMuQXJjKDU1LCA3NywgMS84LCAzLzgpXG4qXG4qIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuKiBAc2VlIFtgcmFjLkFyY2Bde0BsaW5rIFJhYyNBcmN9XG4qIEBzZWUgW2BpbnN0YW5jZS5BcmNgXXtAbGluayBpbnN0YW5jZS5BcmN9XG4qXG4qIEBhbGlhcyBSYWMuQXJjXG4qL1xuY2xhc3MgQXJje1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IGNlbnRlciAtIFRoZSBjZW50ZXIgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gc3RhcnQgLSBBbiBgQW5nbGVgIHdoZXJlIHRoZSBhcmMgc3RhcnRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGVuZCAtIEFuZyBgQW5nbGVgIHdoZXJlIHRoZSBhcmMgZW5kc1xuICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmNcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLFxuICAgIGNlbnRlciwgcmFkaXVzLFxuICAgIHN0YXJ0LCBlbmQsXG4gICAgY2xvY2t3aXNlKVxuICB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQsIGNsb2Nrd2lzZSk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIGNlbnRlcik7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHJhZGl1cyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIHN0YXJ0LCBlbmQpO1xuICAgIHV0aWxzLmFzc2VydEJvb2xlYW4oY2xvY2t3aXNlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgY2VudGVyIGBQb2ludGAgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcblxuICAgIC8qKlxuICAgICogVGhlIHJhZGl1cyBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgYEFuZ2xlYCBvZiB0aGUgYXJjLiBUaGUgYXJjIGlzIGRyYXcgZnJvbSB0aGlzIGFuZ2xlIHRvd2FyZHNcbiAgICAqIGBlbmRgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgICAqXG4gICAgKiBXaGVuIGBzdGFydGAgYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICogdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqL1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydFxuXG4gICAgLyoqXG4gICAgKiBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gYHN0YXJ0YCB0byB0aGlzXG4gICAgKiBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKi9cbiAgICB0aGlzLmVuZCA9IGVuZDtcblxuICAgIC8qKlxuICAgICogVGhlIG9yaWVudGlhdGlvbiBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgKi9cbiAgICB0aGlzLmNsb2Nrd2lzZSA9IGNsb2Nrd2lzZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5BcmMoNTUsIDc3LCAwLjIsIDAuNCwgMTAwKS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ0FyYygoNTUsNzcpIHI6MTAwIHM6MC4yIGU6MC40IGM6dHJ1ZSknXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmNlbnRlci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgcmFkaXVzU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmFkaXVzLCAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFN0ciAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFN0ciAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC50dXJuLCAgIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBcmMoKCR7eFN0cn0sJHt5U3RyfSkgcjoke3JhZGl1c1N0cn0gczoke3N0YXJ0U3RyfSBlOiR7ZW5kU3RyfSBjOiR7dGhpcy5jbG9ja3dpc2V9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMsIGV4Y2VwdCBgcmFjYCwgb2YgYm90aCBhcmNzIGFyZSBlcXVhbDtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJBcmNgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQXJjYCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogQXJjcycgYHJhZGl1c2AgYXJlIGNvbXBhcmVkIHVzaW5nIGB7QGxpbmsgUmFjI2VxdWFsc31gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gb3RoZXJTZWdtZW50IC0gQSBgU2VnbWVudGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyQXJjKSB7XG4gICAgcmV0dXJuIG90aGVyQXJjIGluc3RhbmNlb2YgQXJjXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy5yYWRpdXMsIG90aGVyQXJjLnJhZGl1cylcbiAgICAgICYmIHRoaXMuY2xvY2t3aXNlID09PSBvdGhlckFyYy5jbG9ja3dpc2VcbiAgICAgICYmIHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpXG4gICAgICAmJiB0aGlzLnN0YXJ0LmVxdWFscyhvdGhlckFyYy5zdGFydClcbiAgICAgICYmIHRoaXMuZW5kLmVxdWFscyhvdGhlckFyYy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGFyYzogdGhlIHBhcnQgb2YgdGhlIGNpcmN1bWZlcmVuY2UgdGhlIGFyY1xuICAqIHJlcHJlc2VudHMuXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlRGlzdGFuY2UoKS50dXJuT25lKCkgKiB0aGlzLnJhZGl1cyAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgY29uc2lkZXJlZCBhcyBhIGNvbXBsZXRlXG4gICogY2lyY2xlLlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGNpcmN1bWZlcmVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMucmFkaXVzICogUmFjLlRBVTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogcmVwbGFjZSBgaW4gdGhlIG9yaWVudGF0aW9uYCB0byBgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb25gP1xuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gICogYGVuZGAsIGluIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlRGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBzdGFydHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSBhcmMgZW5kcy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBzdGFydGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHN0YXJ0UmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuc3RhcnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBlbmRgLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBlbmRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5lbmQpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB0YW5nZW50IHRvIHRoZSBhcmMgc3RhcnRpbmcgYXQgYHN0YXJ0UG9pbnQoKWAgYW5kXG4gICogdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICovXG4gIHN0YXJ0VGFuZ2VudFJheSgpIHtcbiAgICBsZXQgdGFuZ2VudEFuZ2xlID0gdGhpcy5zdGFydC5wZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydFBvaW50KCkucmF5KHRhbmdlbnRBbmdsZSk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRhbmdlbnQgdG8gdGhlIGFyYyBzdGFydGluZyBhdCBgZW5kUG9pbnQoKWAgYW5kXG4gICogYWdhaW5zdCB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICovXG4gIGVuZFRhbmdlbnRSYXkoKSB7XG4gICAgbGV0IHRhbmdlbnRBbmdsZSA9IHRoaXMuZW5kLnBlcnBlbmRpY3VsYXIoIXRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy5lbmRQb2ludCgpLnJheSh0YW5nZW50QW5nbGUpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCBgc3RhcnRgLlxuICAqIFRoZSBzZWdtZW50IHN0YXJ0cyBzdGFydHMgYXQgYGNlbnRlcmAgYW5kIGVuZHMgYXQgYHN0YXJ0UG9pbnQoKWAuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzdGFydFJhZGl1c1NlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5zdGFydFJheSgpLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgYHN0YXJ0YC5cbiAgKiBUaGUgc2VnbWVudCBzdGFydHMgc3RhcnRzIGF0IGBjZW50ZXJgIGFuZCBlbmRzIGF0IGBzdGFydFBvaW50KClgLlxuICAqXG4gICogRXF1aXZhbGVudCB0byBbYHN0YXJ0UmFkaXVzU2VnbWVudGBde0BsaW5rIFJhYy5BcmMjc3RhcnRSYWRpdXNTZWdtZW50fS5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHN0YXJ0U2VnbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydFJhZGl1c1NlZ21lbnQoKVxuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCBgZW5kYC5cbiAgKiBUaGUgc2VnbWVudCBzdGFydHMgc3RhcnRzIGF0IGBjZW50ZXJgIGFuZCBlbmRzIGF0IGBlbmRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGVuZFJhZGl1c1NlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5lbmRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGF0IGBlbmRgLlxuICAqIFRoZSBzZWdtZW50IHN0YXJ0cyBzdGFydHMgYXQgYGNlbnRlcmAgYW5kIGVuZHMgYXQgYGVuZFBvaW50KClgLlxuICAqXG4gICogRXF1aXZhbGVudCB0byBbYGVuZFJhZGl1c1NlZ21lbnRgXXtAbGluayBSYWMuQXJjI2VuZFJhZGl1c1NlZ21lbnR9LlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBlbmRTZWdtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVuZFJhZGl1c1NlZ21lbnQoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgc3RhcnRQb2ludCgpYCB0byBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBOb3RlIHRoYXQgZm9yIGNvbXBsZXRlIGNpcmNsZSBhcmNzIHRoaXMgc2VnbWVudCB3aWxsIGhhdmUgYSBsZW5ndGggb2ZcbiAgKiB6ZXJvIGFuZCBiZSBwb2ludGVkIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgb2YgYHN0YXJ0YCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgY2hvcmRTZWdtZW50KCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLnN0YXJ0LnBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0UG9pbnQoKS5zZWdtZW50VG9Qb2ludCh0aGlzLmVuZFBvaW50KCksIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJjIGlzIGEgY29tcGxldGUgY2lyY2xlLCB3aGljaCBpcyB3aGVuIGBzdGFydGBcbiAgKiBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9LlxuICAqXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICovXG4gIGlzQ2lyY2xlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmVxdWFscyh0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgc2V0IHRvIGBuZXdDZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdDZW50ZXIgLSBUaGUgY2VudGVyIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhDZW50ZXIobmV3Q2VudGVyKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICBuZXdDZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBzdGFydCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld1N0YXJ0IC0gVGhlIHN0YXJ0IGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhTdGFydChuZXdTdGFydCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnRBbmdsZSwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBlbmQgc2V0IHRvIGBuZXdFbmRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3RW5kIC0gVGhlIGVuZCBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoRW5kKG5ld0VuZCkge1xuICAgIGNvbnN0IG5ld0VuZEFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0VuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmRBbmdsZSxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHJhZGl1cyBzZXQgdG8gYG5ld1JhZGl1c2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1JhZGl1cyAtIFRoZSByYWRpdXMgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFJhZGl1cyhuZXdSYWRpdXMpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGl0cyBvcmllbnRhdGlvbiBzZXQgdG8gYG5ld0Nsb2Nrd2lzZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtCb29sZWFufSBuZXdDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENsb2Nrd2lzZShuZXdDbG9ja3dpc2UpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgbmV3Q2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgYW5nbGVEaXN0YW5jZWAgYXMgdGhlIGRpc3RhbmNlXG4gICogYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uIFRoaXMgY2hhbmdlcyBgZW5kYFxuICAqIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBvZiB0aGVcbiAgKiBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFtgYXJjLmFuZ2xlRGlzdGFuY2VgXXtAbGluayBSYWMuQXJjI2FuZ2xlRGlzdGFuY2V9XG4gICovXG4gIHdpdGhBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdFbmQgPSB0aGlzLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAgYXMgdGhlIGxlbmd0aCBvZiB0aGVcbiAgKiBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIGl0IHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIGdpdmVuIGBsZW5ndGhgIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSByZWR1Y2VkIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBbYGxlbmd0aGBde0BsaW5rIFJhYy5BcmMjbGVuZ3RofVxuICAqL1xuICB3aXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBpbmNyZW1lbnRgIGFkZGVkIHRvIHRoZSBwYXJ0IG9mIHRoZVxuICAqIGNpcmN1bWZlcmVuY2UgYHRoaXNgIHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIHJlc3VsdGluZyBsZW5ndGggaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIHJlZHVjZWQgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBzZWUgW2BsZW5ndGhgXXtAbGluayBSYWMuQXJjI2xlbmd0aH1cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBpbmNyZW1lbnQgLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoTGVuZ3RoQWRkKGluY3JlbWVudCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSAodGhpcy5sZW5ndGgoKSArIGluY3JlbWVudCkgLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGEgYGxlbmd0aCgpYCBvZiBgdGhpcy5sZW5ndGgoKSAqIHJhdGlvYC4gVGhpc1xuICAqIGNoYW5nZXMgYGVuZGAgZm9yIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgKlswLHJhZGl1cypUQVUpKi4gV2hlbiB0aGUgY2FsY3VsYXRlZCBsZW5ndGggaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIHJlZHVjZWQgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYGxlbmd0aGBde0BsaW5rIFJhYy5BcmMjbGVuZ3RofVxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aCgpICogcmF0aW87XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aChuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0UG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzXG4gICogY2hhbmdlcyBgc3RhcnRgIGFuZCBgcmFkaXVzYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5zdGFydGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgYXQgdGhlIGBzdGFydFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhTdGFydFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZFBvaW50KClgIGxvY2F0ZWQgYXQgYHBvaW50YC4gVGhpcyBjaGFuZ2VzXG4gICogYGVuZGAgYW5kIGByYWRpdXNgIGluIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuZW5kYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYGVuZFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhFbmRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbVxuICAqIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICB3aXRoU3RhcnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBlbmRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aEVuZFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBzdGFydFBvaW50YCBhbmRcbiAgKiBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBlbmRQb2ludGAsIGJvdGggZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiAqIFdoZW4gYGNlbnRlcmAgaXMgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRvXG4gICogZWl0aGVyIGBzdGFydFBvaW50YCBvciBgZW5kUG9pbnRgLCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YFxuICAqIG9yIGB0aGlzLmVuZGAgcmVzcGVjdGl2ZWx5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0UG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHs/UmFjLlBvaW50fSBbZW5kUG9pbnQ9bnVsbF0gLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkcztcbiAgKiB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgLCBgc3RhcnRQb2ludGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhBbmdsZXNUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3RW5kID0gZW5kUG9pbnQgPT09IG51bGxcbiAgICAgID8gbmV3U3RhcnRcbiAgICAgIDogdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGVuZFBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fVxuICAqIHRoZSBnaXZlbiBgYW5nbGVgIHRvd2FyZHMgdGhlIGFyYydzIG9wcG9zaXRlIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgc3RhcnRgIHRvd2FyZHMgdGhlIGFyYydzICpvcHBvc2l0ZSpcbiAgKiBvcmllbnRhdGlvbiwgcmVzdWx0aW5nIGluIGEgbmV3IGBBcmNgIHdpdGggYW4gaW5jcmVhc2UgdG9cbiAgKiBgYW5nbGVEaXN0YW5jZSgpYC5cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnQgYHN0YXJ0YCBhZ2FpbnN0XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhTdGFydEV4dGVuc2lvbihhbmdsZSkge1xuICAgIGxldCBuZXdTdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQoYW5nbGUsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fSB0aGVcbiAgKiBnaXZlbiBgYW5nbGVgIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgZW5kYCB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbixcbiAgKiByZXN1bHRpbmcgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0byBgYW5nbGVEaXN0YW5jZSgpYC5cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnQgYHN0YXJ0YCBhZ2FpbnN0XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhFbmRFeHRlbnNpb24oYW5nbGUpIHtcbiAgICBsZXQgbmV3RW5kID0gdGhpcy5lbmQuc2hpZnQoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGl0cyBgc3RhcnRgIGFuZCBgZW5kYCBleGNoYW5nZWQsIGFuZCB0aGVcbiAgKiBvcHBvc2l0ZSBjbG9ja3dpc2Ugb3JpZW50YXRpb24uIFRoZSBjZW50ZXIgYW5kIHJhZGl1cyByZW1haW4gdGhlXG4gICogc2FtZSBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuZW5kLCB0aGlzLnN0YXJ0LFxuICAgICAgIXRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZ2l2ZW4gYGFuZ2xlYCBjbGFtcGVkIHRvIHRoZSByYW5nZTpcbiAgKiBgYGBcbiAgKiBbc3RhcnQgKyBzdGFydEluc2V0LCBlbmQgLSBlbmRJbnNldF1cbiAgKiBgYGBcbiAgKiB3aGVyZSB0aGUgYWRkaXRpb24gaGFwcGVucyB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbiwgYW5kIHRoZVxuICAqIHN1YnRyYWN0aW9uIGFnYWluc3QuXG4gICpcbiAgKiBXaGVuIGBhbmdsZWAgaXMgb3V0c2lkZSB0aGUgcmFuZ2UsIHJldHVybnMgd2hpY2hldmVyIHJhbmdlIGxpbWl0IGlzXG4gICogY2xvc2VyLlxuICAqXG4gICogV2hlbiB0aGUgc3VtIG9mIHRoZSBnaXZlbiBpbnNldHMgaXMgbGFyZ2VyIHRoYXQgYHRoaXMuYXJjRGlzdGFuY2UoKWBcbiAgKiB0aGUgcmFuZ2UgZm9yIHRoZSBjbGFtcCBpcyBpbXBvc2libGUgdG8gZnVsZmlsbC4gSW4gdGhpcyBjYXNlIHRoZVxuICAqIHJldHVybmVkIHZhbHVlIHdpbGwgYmUgdGhlIGNlbnRlcmVkIGJldHdlZW4gdGhlIHJhbmdlIGxpbWl0cyBhbmQgc3RpbGxcbiAgKiBjbGFtcGxlZCB0byBgW3N0YXJ0LCBlbmRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGNsYW1wXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBbc3RhcnRJbnNldD17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVybyByYWMuQW5nbGUuemVyb31dIC1cbiAgKiAgIFRoZSBpbnNldCBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gW2VuZEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvIHJhYy5BbmdsZS56ZXJvfV0gLVxuICAqICAgVGhlIGluc2V0IGZvciB0aGUgaGlnaGVyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGNsYW1wVG9BbmdsZXMoYW5nbGUsIHN0YXJ0SW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLCBlbmRJbnNldCA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG5cbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpICYmIHN0YXJ0SW5zZXQudHVybiA9PSAwICYmIGVuZEluc2V0LnR1cm4gPT0gMCkge1xuICAgICAgLy8gQ29tcGxldGUgY2lyY2xlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gQW5nbGUgaW4gYXJjLCB3aXRoIGFyYyBhcyBvcmlnaW5cbiAgICAvLyBBbGwgY29tcGFyaXNvbnMgYXJlIG1hZGUgaW4gYSBjbG9ja3dpc2Ugb3JpZW50YXRpb25cbiAgICBjb25zdCBzaGlmdGVkQW5nbGUgPSB0aGlzLmRpc3RhbmNlRnJvbVN0YXJ0KGFuZ2xlKTtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3Qgc2hpZnRlZFN0YXJ0Q2xhbXAgPSBzdGFydEluc2V0O1xuICAgIGNvbnN0IHNoaWZ0ZWRFbmRDbGFtcCA9IGFuZ2xlRGlzdGFuY2Uuc3VidHJhY3QoZW5kSW5zZXQpO1xuICAgIGNvbnN0IHRvdGFsSW5zZXRUdXJuID0gc3RhcnRJbnNldC50dXJuICsgZW5kSW5zZXQudHVybjtcblxuICAgIGlmICh0b3RhbEluc2V0VHVybiA+PSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSkge1xuICAgICAgLy8gSW52YWxpZCByYW5nZVxuICAgICAgY29uc3QgcmFuZ2VEaXN0YW5jZSA9IHNoaWZ0ZWRFbmRDbGFtcC5kaXN0YW5jZShzaGlmdGVkU3RhcnRDbGFtcCk7XG4gICAgICBsZXQgaGFsZlJhbmdlO1xuICAgICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkge1xuICAgICAgICBoYWxmUmFuZ2UgPSByYW5nZURpc3RhbmNlLm11bHQoMS8yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhhbGZSYW5nZSA9IHRvdGFsSW5zZXRUdXJuID49IDFcbiAgICAgICAgICA/IHJhbmdlRGlzdGFuY2UubXVsdE9uZSgxLzIpXG4gICAgICAgICAgOiByYW5nZURpc3RhbmNlLm11bHQoMS8yKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWlkZGxlUmFuZ2UgPSBzaGlmdGVkRW5kQ2xhbXAuYWRkKGhhbGZSYW5nZSk7XG4gICAgICBjb25zdCBtaWRkbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KG1pZGRsZVJhbmdlLCB0aGlzLmNsb2Nrd2lzZSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmNsYW1wVG9BbmdsZXMobWlkZGxlKTtcbiAgICB9XG5cbiAgICBpZiAoc2hpZnRlZEFuZ2xlLnR1cm4gPj0gc2hpZnRlZFN0YXJ0Q2xhbXAudHVybiAmJiBzaGlmdGVkQW5nbGUudHVybiA8PSBzaGlmdGVkRW5kQ2xhbXAudHVybikge1xuICAgICAgLy8gSW5zaWRlIGNsYW1wIHJhbmdlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gT3V0c2lkZSByYW5nZSwgZmlndXJlIG91dCBjbG9zZXN0IGxpbWl0XG4gICAgbGV0IGRpc3RhbmNlVG9TdGFydENsYW1wID0gc2hpZnRlZFN0YXJ0Q2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlLCBmYWxzZSk7XG4gICAgbGV0IGRpc3RhbmNlVG9FbmRDbGFtcCA9IHNoaWZ0ZWRFbmRDbGFtcC5kaXN0YW5jZShzaGlmdGVkQW5nbGUpO1xuICAgIGlmIChkaXN0YW5jZVRvU3RhcnRDbGFtcC50dXJuIDw9IGRpc3RhbmNlVG9FbmRDbGFtcC50dXJuKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChzdGFydEluc2V0LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZC5zaGlmdChlbmRJbnNldCwgIXRoaXMuY2xvY2t3aXNlKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYGFuZ2xlYCBpcyBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBldmFsdWF0ZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBjb250YWluc0FuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIGlmICh0aGlzLmNsb2Nrd2lzZSkge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgICAgbGV0IGVuZE9mZnNldCA9IHRoaXMuZW5kLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IGVuZE9mZnNldC50dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gYW5nbGUuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgbGV0IHN0YXJ0T2Zmc2V0ID0gdGhpcy5zdGFydC5zdWJ0cmFjdCh0aGlzLmVuZCk7XG4gICAgICByZXR1cm4gb2Zmc2V0LnR1cm4gPD0gc3RhcnRPZmZzZXQudHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgaW4gdGhlIGFyYyBpcyBwb3NpdGlvbmVkXG4gICogYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIHRoZSBhcmMgcmVwcmVzZW50cyBhIGNvbXBsZXRlIGNpcmNsZSwgYHRydWVgIGlzIGFsd2F5cyByZXR1cm5lZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBldmFsdWF0ZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBjb250YWluc1Byb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zQW5nbGUodGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50KSk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBhbmQgYGVuZGAgW3NoaWZ0ZWQgYnlde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKiB0aGUgZ2l2ZW4gYGFuZ2xlYCB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBib3RoIGBzdGFydGAgYW5kIGBlbmRgIHRvd2FyZHMgdGhlIGFyYydzXG4gICogb3JpZW50YXRpb24sIHJlc3VsdGluZyBpbiBhIG5ldyBgQXJjYCB3aXRoIHRoZSBzYW1lIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHNlZSBbYGFuZ2xlLnNoaWZ0YF17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fVxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYSBjbG9ja3dpc2UgYXJjPC9jYXB0aW9uPlxuICAqIGxldCBhcmMgPSByYWMuQXJjKDAsIDAsIDAuNCwgMC42LCB0cnVlKVxuICAqIGxldCBzaGlmdGVkQXJjID0gYXJjLnNoaWZ0KDAuMSlcbiAgKiBzaGlmdGVkQXJjLnN0YXJ0LnR1cm4gLy8gcmV0dXJucyAwLjVcbiAgKiBzaGlmdGVkQXJjLmVuZC50dXJuICAgLy8gcmV0dXJucyAwLjdcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjPC9jYXB0aW9uPlxuICAqIGxldCBhcmMgPSByYWMuQXJjKDAsIDAsIDAuNCwgMC42LCBmYWxzZSlcbiAgKiBsZXQgc2hpZnRlZEFyYyA9IGFyYy5zaGlmdCgwLjEpXG4gICogc2hpZnRlZEFyYy5zdGFydC50dXJuIC8vIHJldHVybnMgMC4zXG4gICogc2hpZnRlZEFyYy5lbmQudHVybiAgIC8vIHJldHVybnMgMC41XG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCB0aGUgYXJjIGJ5XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHNoaWZ0KGFuZ2xlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5lbmQuc2hpZnQoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYGFuZ2xlYCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fVxuICAqIGBzdGFydGAgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAc2VlIFtgYW5nbGUuc2hpZnRgXXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYygwLCAwLCAwLjUsIG51bGwsIHRydWUpXG4gICogYXJjLnNoaWZ0QW5nbGUoMC4xKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjYsIHNpbmNlIDAuNSArIDAuMSA9IDAuNlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYygwLCAwLCAwLjUsIG51bGwsIGZhbHNlKVxuICAqIGFyYy5zaGlmdEFuZ2xlKDAuMSkudHVyblxuICAqIC8vIHJldHVybnMgMC40LCBzaW5jZSAwLjUgLSAwLjEgPSAwLjRcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBzdGFydGBcbiAgKiB0byBgYW5nbGVgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIENhbiBiZSB1c2VkIHRvIGRldGVybWluZSwgZm9yIGEgZ2l2ZW4gYW5nbGUsIHdoZXJlIGl0IHNpdHMgaW5zaWRlIHRoZVxuICAqIGFyYyBpZiB0aGUgYXJjIGBzdGFydGAgd2FzIHRoZSBvcmlnaW4gYW5nbGUuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYyg1NSwgNzcsIDAuNSwgbnVsbCwgdHJ1ZSlcbiAgKiAvLyByZXR1cm5zIDAuMiwgc2luY2UgMC43IC0gMC41ID0gMC4yXG4gICogYXJjLmRpc3RhbmNlRnJvbVN0YXJ0KDAuNylcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IDxjb2RlPjAuNTwvY29kZT48L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoNTUsIDc3LCAwLjUsIG51bGwsIGZhbHNlKVxuICAqIC8vIHJldHVybnMgMC44LCBzaW5jZSAxIC0gKDAuNyAtIDAuNSkgPSAwLjhcbiAgKiBhcmMuZGlzdGFuY2VGcm9tU3RhcnQoMC43KVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZUZyb21TdGFydChhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZShhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgLiBUaGlzXG4gICogbWV0aG9kIGRvZXMgbm90IGNvbnNpZGVyIHRoZSBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG93YXJkcyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuY2VudGVyLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvLyBUT0RPOiBjaGVjayBvdGhlciBpbnN0YW5jZXMgb2YgYGFyYyBpcyBjb25zaWRlcmVkYCBhbmQgYWRkIG5vdGUgb2ZcbiAgLy8gdGhlIHBvc3NpYmxlIGltcGFjdCwgdXNpbmcgdGhpcyBhcyBleGFtcGxlXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBhbmdsZWBcbiAgKiBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fSBgc3RhcnRgIHRvd2FyZHMgdGhlIGFyYydzXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBGb3IgdGhpcyBvcGVyYXRpb24gdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLCB0aGVcbiAgKiByZXR1cm5lZCBgUG9pbnRgIG1heSBiZSBvdXRzaWRlIHRoZSBhcmMncyBib3VuZHMuXG4gICpcbiAgKiBAc2VlIFtgYW5nbGUuc2hpZnRgXXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWQgYnkgYHN0YXJ0YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRBbmdsZURpc3RhbmNlKGFuZ2xlKSB7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBsZW5ndGhgIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gbGVuZ3RoIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgYGxlbmd0aCgpICogcmF0aW9gIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGgoKWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgbmV3QW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpLm11bHRPbmUocmF0aW8pO1xuICAgIGxldCBzaGlmdGVkQW5nbGUgPSB0aGlzLnNoaWZ0QW5nbGUobmV3QW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgdGhlXG4gICogZ2l2ZW4gYGFuZ2xlYC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlIGBzdGFydGAgbm9yIGBlbmRgIG9mXG4gICogdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50QXRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBpbiB0aGVcbiAgKiBkaXJlY3Rpb24gdG93YXJkcyB0aGUgZ2l2ZW4gYHBvaW50YC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlXG4gICogYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLnBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBpbiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50VG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmb3IgdGhlIGNob3JkIGZvcm1lZCBieSB0aGUgaW50ZXJzZWN0aW9uIG9mXG4gICogYHRoaXNgIGFuZCBgb3RoZXJBcmNgLCBvciBgbnVsbGAgd2hlbiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB3aWxsIHBvaW50IHRvd2FyZHMgYHRoaXNgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBjaG9yZCwgdGh1cyB0aGUgZW5kcG9pbnRzIG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IG1heSBub3QgbGF5IGluc2lkZVxuICAqIHRoZSBhY3R1YWwgYXJjcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBkZXNjcmlwdGlvblxuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKSB7XG4gICAgLy8gaHR0cHM6Ly9tYXRod29ybGQud29sZnJhbS5jb20vQ2lyY2xlLUNpcmNsZUludGVyc2VjdGlvbi5odG1sXG4gICAgLy8gUj10aGlzLCByPW90aGVyQXJjXG5cbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KG90aGVyQXJjLmNlbnRlcik7XG5cbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cyArIG90aGVyQXJjLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gZGlzdGFuY2VUb0Nob3JkID0gKGReMiAtIHJeMiArIFJeMikgLyAoZCoyKVxuICAgIGNvbnN0IGRpc3RhbmNlVG9DaG9yZCA9IChcbiAgICAgICAgTWF0aC5wb3coZGlzdGFuY2UsIDIpXG4gICAgICAtIE1hdGgucG93KG90aGVyQXJjLnJhZGl1cywgMilcbiAgICAgICsgTWF0aC5wb3codGhpcy5yYWRpdXMsIDIpXG4gICAgICApIC8gKGRpc3RhbmNlICogMik7XG5cbiAgICAvLyBhID0gMS9kIHNxcnR8KC1kK3ItUikoLWQtcitSKSgtZCtyK1IpKGQrcitSKVxuICAgIGNvbnN0IGNob3JkTGVuZ3RoID0gKDEgLyBkaXN0YW5jZSkgKiBNYXRoLnNxcnQoXG4gICAgICAgICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgLSB0aGlzLnJhZGl1cylcbiAgICAgICogKC1kaXN0YW5jZSAtIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqIChkaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKSk7XG5cbiAgICBjb25zdCBzZWdtZW50VG9DaG9yZCA9IHRoaXMuY2VudGVyLnJheVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKVxuICAgICAgLnNlZ21lbnQoZGlzdGFuY2VUb0Nob3JkKTtcbiAgICByZXR1cm4gc2VnbWVudFRvQ2hvcmQubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlLCBjaG9yZExlbmd0aC8yKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGhSYXRpbygyKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgaWYgaW50ZXJzZWN0aW5nUG9pbnRzV2l0aEFyYyBpcyBuZWNlc3NhcnlcbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpbnRlcnNlY3RpbmcgcG9pbnRzIG9mIGB0aGlzYCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgYXJlIG5vIGludGVyc2VjdGluZyBwb2ludHMsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGludGVyc2VjdGlvbiBwb2ludHMgd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQGlnbm9yZVxuICAqL1xuICAvLyBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBbXTsgfVxuXG4gIC8vICAgbGV0IGludGVyc2VjdGlvbnMgPSBbY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpXS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAvLyAgICAgcmV0dXJuIHRoaXMuY29udGFpbnNBbmdsZSh0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSlcbiAgLy8gICAgICAgJiYgb3RoZXJBcmMuY29udGFpbnNBbmdsZShvdGhlckFyYy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbSkpO1xuICAvLyAgIH0sIHRoaXMpO1xuXG4gIC8vICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB3aWxsIGFsd2F5cyBoYXZlIHRoZSBzYW1lIGFuZ2xlIGFzIGByYXlgLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlIGFuZCBgcmF5YCBpcyBjb25zaWRlcmVkIGFuXG4gICogdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkV2l0aFJheShyYXkpIHtcbiAgICAvLyBGaXJzdCBjaGVjayBpbnRlcnNlY3Rpb25cbiAgICBjb25zdCBiaXNlY3RvciA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gYmlzZWN0b3IubGVuZ3RoO1xuXG4gICAgLy8gU2VnbWVudCB0b28gY2xvc2UgdG8gY2VudGVyLCBjb3NpbmUgY2FsY3VsYXRpb25zIG1heSBiZSBpbmNvcnJlY3RcbiAgICAvLyBDYWxjdWxhdGUgc2VnbWVudCB0aHJvdWdoIGNlbnRlclxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoMCwgZGlzdGFuY2UpKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHJheS5hbmdsZS5pbnZlcnNlKCkpO1xuICAgICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHN0YXJ0LCByYXkuYW5nbGUpO1xuICAgICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyoyKTtcbiAgICB9XG5cbiAgICAvLyBSYXkgaXMgdGFuZ2VudCwgcmV0dXJuIHplcm8tbGVuZ3RoIHNlZ21lbnQgYXQgY29udGFjdCBwb2ludFxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoZGlzdGFuY2UsIHRoaXMucmFkaXVzKSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5yYXkuYW5nbGUpO1xuICAgICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHN0YXJ0LCByYXkuYW5nbGUpO1xuICAgICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCAwKTtcbiAgICB9XG5cbiAgICAvLyBSYXkgZG9lcyBub3QgdG91Y2ggYXJjXG4gICAgaWYgKGRpc3RhbmNlID4gdGhpcy5yYWRpdXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmFjb3MoZGlzdGFuY2UvdGhpcy5yYWRpdXMpO1xuICAgIGNvbnN0IGFuZ2xlID0gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcblxuICAgIGNvbnN0IGNlbnRlck9yaWVudGF0aW9uID0gcmF5LnBvaW50T3JpZW50YXRpb24odGhpcy5jZW50ZXIpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IuYW5nbGUoKS5zaGlmdChhbmdsZSwgIWNlbnRlck9yaWVudGF0aW9uKSk7XG4gICAgY29uc3QgZW5kID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IuYW5nbGUoKS5zaGlmdChhbmdsZSwgY2VudGVyT3JpZW50YXRpb24pKTtcbiAgICByZXR1cm4gc3RhcnQuc2VnbWVudFRvUG9pbnQoZW5kLCByYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgcmVwcmVzZW50aW5nIHRoZSBlbmQgb2YgdGhlIGNob3JkIGZvcm1lZCBieSB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgdGhlIGFyYyBhbmQgJ3JheScsIG9yIGBudWxsYCB3aGVuIG5vIGNob3JkIGlzIHBvc3NpYmxlLlxuICAqXG4gICogV2hlbiBgdXNlUHJvamVjdGlvbmAgaXMgYHRydWVgIHRoZSBtZXRob2Qgd2lsbCBhbHdheXMgcmV0dXJuIGEgYFBvaW50YFxuICAqIGV2ZW4gd2hlbiB0aGVyZSBpcyBubyBjb250YWN0IGJldHdlZW4gdGhlIGFyYyBhbmQgYHJheWAuIEluIHRoaXMgY2FzZVxuICAqIHRoZSBwb2ludCBpbiB0aGUgYXJjIGNsb3Nlc3QgdG8gYHJheWAgaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUgYW5kIGByYXlgIGlzIGNvbnNpZGVyZWQgYW5cbiAgKiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMgez9SYWMuUG9pbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkRW5kV2l0aFJheShyYXksIHVzZVByb2plY3Rpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZFdpdGhSYXkocmF5KTtcbiAgICBpZiAoY2hvcmQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBjaG9yZC5lbmRQb2ludCgpO1xuICAgIH1cblxuICAgIGlmICh1c2VQcm9qZWN0aW9uKSB7XG4gICAgICBjb25zdCBjZW50ZXJPcmllbnRhdGlvbiA9IHJheS5wb2ludE9yaWVudGF0aW9uKHRoaXMuY2VudGVyKTtcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcighY2VudGVyT3JpZW50YXRpb24pO1xuICAgICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHBlcnBlbmRpY3VsYXIpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHJlcHJlc2VudGluZyB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgdGhhdCBpcyBpbnNpZGVcbiAgKiBgb3RoZXJBcmNgLCBvciBgbnVsbGAgd2hlbiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uIFRoZSByZXR1cm5lZCBhcmNcbiAgKiB3aWxsIGhhdmUgdGhlIHNhbWUgY2VudGVyLCByYWRpdXMsIGFuZCBvcmllbnRhdGlvbiBhcyBgdGhpc2AuXG4gICpcbiAgKiBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuICAqIGludGVyc2VjdGlvbiwgdGh1cyB0aGUgZW5kcG9pbnRzIG9mIHRoZSByZXR1cm5lZCBhcmMgbWF5IG5vdCBsYXkgaW5zaWRlXG4gICogYHRoaXNgLlxuICAqXG4gICogQW4gZWRnZSBjYXNlIG9mIHRoaXMgbWV0aG9kIGlzIHRoYXQgd2hlbiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBgdGhpc2BcbiAgKiBhbmQgYG90aGVyQXJjYCBpcyB0aGUgc3VtIG9mIHRoZWlyIHJhZGl1cywgbWVhbmluZyB0aGUgYXJjcyB0b3VjaCBhdCBhXG4gICogc2luZ2xlIHBvaW50LCB0aGUgcmVzdWx0aW5nIGFyYyBtYXkgaGF2ZSBhIGFuZ2xlLWRpc3RhbmNlIG9mIHplcm8sXG4gICogd2hpY2ggaXMgaW50ZXJwcmV0ZWQgYXMgYSBjb21wbGV0ZS1jaXJjbGUgYXJjLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGludGVyc2VjdCB3aXRoXG4gICogQHJldHVybnMgez9SYWMuQXJjfVxuICAqL1xuICBpbnRlcnNlY3Rpb25BcmMob3RoZXJBcmMpIHtcbiAgICBjb25zdCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpO1xuICAgIGlmIChjaG9yZCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlc1Rvd2FyZHNQb2ludChjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCkpO1xuICB9XG5cblxuICAvLyBUT0RPOiBpbXBsZW1lbnQgaW50ZXJzZWN0aW9uQXJjTm9DaXJjbGU/XG5cblxuICAvLyBUT0RPOiBmaW5pc2ggYm91bmRlZEludGVyc2VjdGlvbkFyY1xuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHJlcHJlc2VudGluZyB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgdGhhdCBpcyBpbnNpZGVcbiAgKiBgb3RoZXJBcmNgIGFuZCBib3VuZGVkIGJ5IGB0aGlzLnN0YXJ0YCBhbmQgYHRoaXMuZW5kYCwgb3IgYG51bGxgIHdoZW5cbiAgKiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uIFRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBoYXZlIHRoZSBzYW1lIGNlbnRlcixcbiAgKiByYWRpdXMsIGFuZCBvcmllbnRhdGlvbiBhcyBgdGhpc2AuXG4gICpcbiAgKiBgb3RoZXJBcmNgIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUsIHdoaWxlIHRoZSBzdGFydCBhbmQgZW5kIG9mXG4gICogYHRoaXNgIGFyZSBjb25zaWRlcmVkIGZvciB0aGUgcmVzdWx0aW5nIGBBcmNgLlxuICAqXG4gICogV2hlbiB0aGVyZSBleGlzdCB0d28gc2VwYXJhdGUgYXJjIHNlY3Rpb25zIHRoYXQgaW50ZXJzZWN0IHdpdGhcbiAgKiBgb3RoZXJBcmNgOiBvbmx5IHRoZSBzZWN0aW9uIG9mIGB0aGlzYCBjbG9zZXN0IHRvIGBzdGFydGAgaXMgcmV0dXJuZWQuXG4gICogVGhpcyBjYW4gaGFwcGVuIHdoZW4gYHRoaXNgIHN0YXJ0cyBpbnNpZGUgYG90aGVyQXJjYCwgdGhlbiBleGl0cywgYW5kXG4gICogdGhlbiBlbmRzIGluc2lkZSBgb3RoZXJBcmNgLCByZWdhcmRsZXNzIGlmIGB0aGlzYCBpcyBhIGNvbXBsZXRlIGNpcmNsZVxuICAqIG9yIG5vdC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBpbnRlcnNlY3Qgd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLkFyY31cbiAgKlxuICAqIEBpZ25vcmVcbiAgKi9cbiAgLy8gYm91bmRlZEludGVyc2VjdGlvbkFyYyhvdGhlckFyYykge1xuICAvLyAgIGxldCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpO1xuICAvLyAgIGlmIChjaG9yZCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8vICAgbGV0IGNob3JkU3RhcnRBbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChjaG9yZC5zdGFydFBvaW50KCkpO1xuICAvLyAgIGxldCBjaG9yZEVuZEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLmVuZFBvaW50KCkpO1xuXG4gIC8vICAgLy8gZ2V0IGFsbCBkaXN0YW5jZXMgZnJvbSB0aGlzLnN0YXJ0XG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZEVuZEFuZ2xlLCBvbmx5IHN0YXJ0IG1heSBiZSBpbnNpZGUgYXJjXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyB0aGlzLmVuZCwgd2hvbGUgYXJjIGlzIGluc2lkZSBvciBvdXRzaWRlXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZFN0YXJ0QW5nbGUsIG9ubHkgZW5kIG1heSBiZSBpbnNpZGUgYXJjXG4gIC8vICAgY29uc3QgaW50ZXJTdGFydERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZShjaG9yZFN0YXJ0QW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gICBjb25zdCBpbnRlckVuZERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZShjaG9yZEVuZEFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vICAgY29uc3QgZW5kRGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKHRoaXMuZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG5cblxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRTdGFydEFuZ2xlLCBub3JtYWwgcnVsZXNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCBub3QgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkU3RhcnQsIHJldHVybiBudWxsXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgbm90IHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZGVuZCwgcmV0dXJuIHNlbGZcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRTdGFydCwgbm9ybWFsIHJ1bGVzXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkZW5kLCByZXR1cm4gc3RhcnQgdG8gY2hvcmRlbmRcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkRW5kQW5nbGUsIHJldHVybiBzdGFydCB0byBjaG9yZEVuZFxuXG5cbiAgLy8gICBpZiAoIXRoaXMuY29udGFpbnNBbmdsZShjaG9yZFN0YXJ0QW5nbGUpKSB7XG4gIC8vICAgICBjaG9yZFN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0O1xuICAvLyAgIH1cbiAgLy8gICBpZiAoIXRoaXMuY29udGFpbnNBbmdsZShjaG9yZEVuZEFuZ2xlKSkge1xuICAvLyAgICAgY2hvcmRFbmRBbmdsZSA9IHRoaXMuZW5kO1xuICAvLyAgIH1cblxuICAvLyAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAvLyAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAvLyAgICAgY2hvcmRTdGFydEFuZ2xlLFxuICAvLyAgICAgY2hvcmRFbmRBbmdsZSxcbiAgLy8gICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBpcyB0YW5nZW50IHRvIGJvdGggYHRoaXNgIGFuZCBgb3RoZXJBcmNgLFxuICAqIG9yIGBudWxsYCB3aGVuIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZS4gVGhlIG5ldyBgU2VnbWVudGAgc3RhcnRzXG4gICogYXQgdGhlIGNvbnRhY3QgcG9pbnQgd2l0aCBgdGhpc2AgYW5kIGVuZHMgYXQgdGhlIGNvbnRhY3QgcG9pbnQgd2l0aFxuICAqIGBvdGhlckFyY2AuXG4gICpcbiAgKiBDb25zaWRlcmluZyBfY2VudGVyIGF4aXNfIGEgcmF5IGZyb20gYHRoaXMuY2VudGVyYCB0b3dhcmRzXG4gICogYG90aGVyQXJjLmNlbnRlcmAsIGBzdGFydENsb2Nrd2lzZWAgZGV0ZXJtaW5lcyB0aGUgc2lkZSBvZiB0aGUgc3RhcnRcbiAgKiBwb2ludCBvZiB0aGUgcmV0dXJuZWQgc2VnbWVudCBpbiByZWxhdGlvbiB0byBfY2VudGVyIGF4aXNfLCBhbmRcbiAgKiBgZW5kQ2xvY2t3aXNlYCB0aGUgc2lkZSBvZiB0aGUgZW5kIHBvaW50LlxuICAqXG4gICogQm90aCBgdGhpc2AgYW5kIGBvdGhlckFyY2AgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHNlZ21lbnQgdG93YXJkc1xuICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RhcnRDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBzdGFydCBwb2ludCBpbiByZWxhdGlvbiB0byB0aGUgX2NlbnRlciBheGlzX1xuICAqIEBwYXJhbSB7Qm9vbGVhbn0gZW5kQ2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogZW5kIHBvaW50IGluIHJlbGF0aW9uIHRvIHRoZSBfY2VudGVyIGF4aXNfXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgdGFuZ2VudFNlZ21lbnQob3RoZXJBcmMsIHN0YXJ0Q2xvY2t3aXNlID0gdHJ1ZSwgZW5kQ2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gSHlwb3RoZW51c2Ugb2YgdGhlIHRyaWFuZ2xlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSB0YW5nZW50XG4gICAgLy8gbWFpbiBhbmdsZSBpcyBhdCBgdGhpcy5jZW50ZXJgXG4gICAgY29uc3QgaHlwU2VnbWVudCA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KG90aGVyQXJjLmNlbnRlcik7XG4gICAgY29uc3Qgb3BzID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBvdGhlckFyYy5yYWRpdXMgLSB0aGlzLnJhZGl1c1xuICAgICAgOiBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cztcblxuICAgIC8vIFdoZW4gb3BzIGFuZCBoeXAgYXJlIGNsb3NlLCBzbmFwIHRvIDFcbiAgICBjb25zdCBhbmdsZVNpbmUgPSB0aGlzLnJhYy5lcXVhbHMoTWF0aC5hYnMob3BzKSwgaHlwU2VnbWVudC5sZW5ndGgpXG4gICAgICA/IChvcHMgPiAwID8gMSA6IC0xKVxuICAgICAgOiBvcHMgLyBoeXBTZWdtZW50Lmxlbmd0aDtcbiAgICBpZiAoTWF0aC5hYnMoYW5nbGVTaW5lKSA+IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlUmFkaWFucyA9IE1hdGguYXNpbihhbmdsZVNpbmUpO1xuICAgIGNvbnN0IG9wc0FuZ2xlID0gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCBhbmdsZVJhZGlhbnMpO1xuXG4gICAgY29uc3QgYWRqT3JpZW50YXRpb24gPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IHN0YXJ0Q2xvY2t3aXNlXG4gICAgICA6ICFzdGFydENsb2Nrd2lzZTtcbiAgICBjb25zdCBzaGlmdGVkT3BzQW5nbGUgPSBoeXBTZWdtZW50LnJheS5hbmdsZS5zaGlmdChvcHNBbmdsZSwgYWRqT3JpZW50YXRpb24pO1xuICAgIGNvbnN0IHNoaWZ0ZWRBZGpBbmdsZSA9IHNoaWZ0ZWRPcHNBbmdsZS5wZXJwZW5kaWN1bGFyKGFkak9yaWVudGF0aW9uKTtcblxuICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IHNoaWZ0ZWRBZGpBbmdsZVxuICAgICAgOiBzaGlmdGVkQWRqQW5nbGUuaW52ZXJzZSgpXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShzdGFydEFuZ2xlKTtcbiAgICBjb25zdCBlbmQgPSBvdGhlckFyYy5wb2ludEF0QW5nbGUoc2hpZnRlZEFkakFuZ2xlKTtcbiAgICBjb25zdCBkZWZhdWx0QW5nbGUgPSBzdGFydEFuZ2xlLnBlcnBlbmRpY3VsYXIoIXN0YXJ0Q2xvY2t3aXNlKTtcbiAgICByZXR1cm4gc3RhcnQuc2VnbWVudFRvUG9pbnQoZW5kLCBkZWZhdWx0QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgbmV3IGBBcmNgIG9iamVjdHMgcmVwcmVzZW50aW5nIGB0aGlzYFxuICAqIGRpdmlkZWQgaW50byBgY291bnRgIGFyY3MsIGFsbCB3aXRoIHRoZSBzYW1lXG4gICogW2FuZ2xlIGRpc3RhbmNlXXtAbGluayBSYWMuQXJjI2FuZ2xlRGlzdGFuY2V9LlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuIFdoZW4gYGNvdW50YCBpc1xuICAqIGAxYCByZXR1cm5zIGFuIGFyYyBlcXVpdmFsZW50IHRvIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiBhcmNzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuQXJjW119XG4gICovXG4gIGRpdmlkZVRvQXJjcyhjb3VudCkge1xuICAgIGlmIChjb3VudCA8PSAwKSB7IHJldHVybiBbXTsgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBjb3VudDtcblxuICAgIGNvbnN0IGFyY3MgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIGluZGV4LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBlbmQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogKGluZGV4KzEpLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBhcmMgPSBuZXcgQXJjKHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsIHN0YXJ0LCBlbmQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGFyY3MucHVzaChhcmMpO1xuICAgIH1cblxuICAgIHJldHVybiBhcmNzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgbmV3IGBTZWdtZW50YCBvYmplY3RzIHJlcHJlc2VudGluZyBgdGhpc2BcbiAgKiBkaXZpZGVkIGludG8gYGNvdW50YCBjaG9yZHMsIGFsbCB3aXRoIHRoZSBzYW1lIGxlbmd0aC5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGFycmF5LiBXaGVuIGBjb3VudGAgaXNcbiAgKiBgMWAgcmV0dXJucyBhbiBhcmMgZXF1aXZhbGVudCB0b1xuICAqIGBbdGhpcy5jaG9yZFNlZ21lbnQoKV17QGxpbmsgUmFjLkFyYyNjaG9yZFNlZ21lbnR9YC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiBzZWdtZW50cyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnRbXX1cbiAgKi9cbiAgZGl2aWRlVG9TZWdtZW50cyhjb3VudCkge1xuICAgIGlmIChjb3VudCA8PSAwKSB7IHJldHVybiBbXTsgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBjb3VudDtcblxuICAgIGNvbnN0IHNlZ21lbnRzID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvdW50OyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBzdGFydEFuZ2xlID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIGluZGV4LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBlbmRBbmdsZSA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiAoaW5kZXgrMSksIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSB0aGlzLnBvaW50QXRBbmdsZShzdGFydEFuZ2xlKTtcbiAgICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5wb2ludEF0QW5nbGUoZW5kQW5nbGUpO1xuICAgICAgY29uc3Qgc2VnbWVudCA9IHN0YXJ0UG9pbnQuc2VnbWVudFRvUG9pbnQoZW5kUG9pbnQpO1xuICAgICAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudHM7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbXBvc2l0ZWAgdGhhdCBjb250YWlucyBgQmV6aWVyYCBvYmplY3RzIHJlcHJlc2VudGluZ1xuICAqIHRoZSBhcmMgZGl2aWRlZCBpbnRvIGBjb3VudGAgYmV6aWVycyB0aGF0IGFwcHJveGltYXRlIHRoZSBzaGFwZSBvZiB0aGVcbiAgKiBhcmMuXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBgQ29tcG9zaXRlYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiBiZXppZXJzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuQ29tcG9zaXRlfVxuICAqXG4gICogQHNlZSBbYFJhYy5CZXppZXJgXXtAbGluayBSYWMuQmV6aWVyfVxuICAqL1xuICBkaXZpZGVUb0JlemllcnMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gbmV3IFJhYy5Db21wb3NpdGUodGhpcy5yYWMsIFtdKTsgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBjb3VudDtcblxuICAgIC8vIGxlbmd0aCBvZiB0YW5nZW50OlxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3MzQ3NDUvaG93LXRvLWNyZWF0ZS1jaXJjbGUtd2l0aC1iJUMzJUE5emllci1jdXJ2ZXNcbiAgICBjb25zdCBwYXJzUGVyVHVybiA9IDEgLyBwYXJ0VHVybjtcbiAgICBjb25zdCB0YW5nZW50ID0gdGhpcy5yYWRpdXMgKiAoNC8zKSAqIE1hdGgudGFuKFJhYy5UQVUvKHBhcnNQZXJUdXJuKjQpKTtcblxuICAgIGNvbnN0IGJlemllcnMgPSBbXTtcbiAgICBjb25zdCBzZWdtZW50cyA9IHRoaXMuZGl2aWRlVG9TZWdtZW50cyhjb3VudCk7XG4gICAgc2VnbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IHN0YXJ0QXJjUmFkaXVzID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5zdGFydFBvaW50KCkpO1xuICAgICAgY29uc3QgZW5kQXJjUmFkaXVzID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbS5lbmRQb2ludCgpKTtcblxuICAgICAgbGV0IHN0YXJ0QW5jaG9yID0gc3RhcnRBcmNSYWRpdXNcbiAgICAgICAgLm5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgIXRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcbiAgICAgIGxldCBlbmRBbmNob3IgPSBlbmRBcmNSYWRpdXNcbiAgICAgICAgLm5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgdGhpcy5jbG9ja3dpc2UsIHRhbmdlbnQpXG4gICAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgICBjb25zdCBuZXdCZXppZXIgPSBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgc3RhcnRBcmNSYWRpdXMuZW5kUG9pbnQoKSwgc3RhcnRBbmNob3IsXG4gICAgICAgIGVuZEFuY2hvciwgZW5kQXJjUmFkaXVzLmVuZFBvaW50KCkpXG5cbiAgICAgIGJlemllcnMucHVzaChuZXdCZXppZXIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBiZXppZXJzKTtcbiAgfVxuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBVbml0IFRlc3QgYW5kIFZpc3VhbCBUZXN0XG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGxvY2F0ZWQgYW5kIG9yaWVudGVkIHRvd2FyZHMgYHN0YXJ0VGFuZ2VudFJheSgpYFxuICAqIHdpdGggdGhlIGdpdmVuIGBzdHJpbmdgIGFuZCBgZm9ybWF0YC5cbiAgKlxuICAqIFdoZW4gYGZvcm1hdGAgaXMgb21taXRlZCBvciBgbnVsbGAsIHRoZSBmb3JtYXQgdXNlZCBmb3IgdGhlIHJlc3VsdGluZ1xuICAqIGBUZXh0YCB3aWxsIGJlOlxuICAqICsgW2ByYWMuVGV4dC5Gb3JtYXQuYm90dG9tTGVmdGBde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I2JvdHRvbUxlZnR9XG4gICogZm9ybWF0IGZvciBhcmNzIHdpdGggYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24gc2V0IHRvIGB0cnVlYFxuICAqICsgW2ByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdGBde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I3RvcExlZnR9XG4gICogZm9ybWF0IGZvciBhcmNzIHdpdGggYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24gc2V0IHRvIGBmYWxzZWBcbiAgKlxuICAqIFdoZW4gYGZvcm1hdGAgaXMgcHJvdmlkZWQsIHRoZSBhbmdsZSBmb3IgdGhlIHJlc3VsdGluZyBgVGV4dGAgd2lsbFxuICAqIHN0aWxsIGJlIHNldCB0byBgc3RhcnRUYW5nZW50UmF5KCkuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyAtIFRoZSBzdHJpbmcgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gW2Zvcm1hdD1bcmFjLlRleHQuRm9ybWF0LnRvcExlZnRde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I3RvcExlZnR9XVxuICAqICAgVGhlIGZvcm1hdCBvZiB0aGUgbmV3IGBUZXh0YDsgd2hlbiBvbW1pdGVkIG9yIGBudWxsYCwgYSBkZWZhdWx0XG4gICogICBmb3JtYXQgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB0ZXh0KHN0cmluZywgZm9ybWF0ID0gbnVsbCkge1xuICAgIGlmIChmb3JtYXQgPT09IG51bGwpIHtcbiAgICAgIGZvcm1hdCA9IHRoaXMuY2xvY2t3aXNlXG4gICAgICAgID8gdGhpcy5yYWMuVGV4dC5Gb3JtYXQuYm90dG9tTGVmdFxuICAgICAgICA6IHRoaXMucmFjLlRleHQuRm9ybWF0LnRvcExlZnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YXJ0VGFuZ2VudFJheSgpLnRleHQoc3RyaW5nLCBmb3JtYXQpO1xuICB9XG5cbn0gLy8gY2xhc3MgQXJjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmM7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBCZXppZXIgY3VydmUgd2l0aCBzdGFydCwgZW5kLCBhbmQgdHdvIGFuY2hvciBbcG9pbnRzXXtAbGluayBSYWMuUG9pbnR9LlxuKiBAYWxpYXMgUmFjLkJlemllclxuKi9cbmNsYXNzIEJlemllciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpO1xuXG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuc3RhcnRBbmNob3IgPSBzdGFydEFuY2hvcjtcbiAgICB0aGlzLmVuZEFuY2hvciA9IGVuZEFuY2hvcjtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCBzdGFydFhTdHIgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC54LCAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0WVN0ciAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRBbmNob3JYU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnRBbmNob3IueCwgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydEFuY2hvcllTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydEFuY2hvci55LCBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZEFuY2hvclhTdHIgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZEFuY2hvci54LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kQW5jaG9yWVN0ciAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kQW5jaG9yLnksICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRYU3RyICAgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQueCwgICAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFlTdHIgICAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC55LCAgICAgICAgIGRpZ2l0cyk7XG5cbiAgICByZXR1cm4gYEJlemllcihzOigke3N0YXJ0WFN0cn0sJHtzdGFydFlTdHJ9KSBzYTooJHtzdGFydEFuY2hvclhTdHJ9LCR7c3RhcnRBbmNob3JZU3RyfSkgZWE6KCR7ZW5kQW5jaG9yWFN0cn0sJHtlbmRBbmNob3JZU3RyfSkgZTooJHtlbmRYU3RyfSwke2VuZFlTdHJ9KSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzLCBleGNlcHQgYHJhY2AsIG9mIGJvdGggYmV6aWVycyBhcmVcbiAgKiBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc307IG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlckJlemllcmAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5CZXppZXJgLCByZXR1cm5zXG4gICogYGZhbHNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkJlemllcn0gb3RoZXJCZXppZXIgLSBBIGBCZXppZXJgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKlxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJCZXppZXIpIHtcbiAgICByZXR1cm4gb3RoZXJCZXppZXIgaW5zdGFuY2VvZiBCZXppZXJcbiAgICAgICYmIHRoaXMuc3RhcnQgICAgICAuZXF1YWxzKG90aGVyQmV6aWVyLnN0YXJ0KVxuICAgICAgJiYgdGhpcy5zdGFydEFuY2hvci5lcXVhbHMob3RoZXJCZXppZXIuc3RhcnRBbmNob3IpXG4gICAgICAmJiB0aGlzLmVuZEFuY2hvciAgLmVxdWFscyhvdGhlckJlemllci5lbmRBbmNob3IpXG4gICAgICAmJiB0aGlzLmVuZCAgICAgICAgLmVxdWFscyhvdGhlckJlemllci5lbmQpO1xuICB9XG5cbn0gLy8gY2xhc3MgQmV6aWVyXG5cblxubW9kdWxlLmV4cG9ydHMgPSBCZXppZXI7XG5cblxuQmV6aWVyLnByb3RvdHlwZS5kcmF3QW5jaG9ycyA9IGZ1bmN0aW9uKHN0eWxlID0gdW5kZWZpbmVkKSB7XG4gIHB1c2goKTtcbiAgaWYgKHN0eWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBzdHlsZS5hcHBseSgpO1xuICB9XG4gIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQodGhpcy5zdGFydEFuY2hvcikuZHJhdygpO1xuICB0aGlzLmVuZC5zZWdtZW50VG9Qb2ludCh0aGlzLmVuZEFuY2hvcikuZHJhdygpO1xuICBwb3AoKTtcbn07XG5cbkJlemllci5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEJlemllcih0aGlzLnJhYyxcbiAgICB0aGlzLmVuZCwgdGhpcy5lbmRBbmNob3IsXG4gICAgdGhpcy5zdGFydEFuY2hvciwgdGhpcy5zdGFydCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udGFpbmVyIG9mIGEgc2VxdWVuY2Ugb2YgZHJhd2FibGUgb2JqZWN0cyB0aGF0IGNhbiBiZSBkcmF3biB0b2dldGhlci5cbipcbiogVXNlZCBieSBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YCB0byBwZXJmb3JtIHNwZWNpZmljIHZlcnRleFxuKiBvcGVyYXRpb25zIHdpdGggZHJhd2FibGVzIHRvIGRyYXcgY29tcGxleCBzaGFwZXMuXG4qXG4qIEBhbGlhcyBSYWMuQ29tcG9zaXRlXG4qL1xuY2xhc3MgQ29tcG9zaXRlIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb21wb3NpdGVgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWNcbiAgKiAgIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7QXJyYXl9IFtzZXF1ZW5jZV1cbiAgKiAgIEFuIGFycmF5IG9mIGRyYXdhYmxlIG9iamVjdHMgdG8gY29udGFpblxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHNlcXVlbmNlID0gW10pIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzZXF1ZW5jZSk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnNlcXVlbmNlID0gc2VxdWVuY2U7XG4gIH1cblxufSAvLyBjbGFzcyBDb21wb3NpdGVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0ZTtcblxuXG5Db21wb3NpdGUucHJvdG90eXBlLmlzTm90RW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc2VxdWVuY2UubGVuZ3RoICE9IDA7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGVsZW1lbnQuZm9yRWFjaChpdGVtID0+IHRoaXMuc2VxdWVuY2UucHVzaChpdGVtKSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5zZXF1ZW5jZS5wdXNoKGVsZW1lbnQpO1xufTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gIGxldCByZXZlcnNlZCA9IHRoaXMuc2VxdWVuY2UubWFwKGl0ZW0gPT4gaXRlbS5yZXZlcnNlKCkpXG4gICAgLnJldmVyc2UoKTtcbiAgcmV0dXJuIG5ldyBDb21wb3NpdGUodGhpcy5yYWMsIHJldmVyc2VkKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBQb2ludCBpbiBhIHR3byBkaW1lbnRpb25hbCBjb29yZGluYXRlIHN5c3RlbS5cbipcbiogU2V2ZXJhbCBtZXRob2RzIHJldHVybiBhbiBhZGp1c3RlZCB2YWx1ZSBvciBwZXJmb3JtIGFkanVzdG1lbnRzIGluIHRoZWlyXG4qIG9wZXJhdGlvbiB3aGVuIHR3byBwb2ludHMgYXJlIGNsb3NlIGVub3VnaCBhcyB0byBiZSBjb25zaWRlcmVkIGVxdWFsLlxuKiBXaGVuIHRoZSB0aGUgZGlmZmVyZW5jZSBvZiBlYWNoIGNvb3JkaW5hdGUgb2YgdHdvIHBvaW50cyBpcyB1bmRlciB0aGVcbiogW2BlcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH0gdGhlIHBvaW50cyBhcmVcbiogY29uc2lkZXJlZCBlcXVhbC4gVGhlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gbWV0aG9kIHBlcmZvcm1zXG4qIHRoaXMgY2hlY2suXG4qXG4qICMjIyBgaW5zdGFuY2UuUG9pbnRgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuUG9pbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjUG9pbnR9IHRvIGNyZWF0ZSBgUG9pbnRgIG9iamVjdHMgd2l0aFxuKiBmZXdlciBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlBvaW50Lm9yaWdpbmBde0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn0sIGxpc3RlZCB1bmRlclxuKiBbYGluc3RhbmNlLlBvaW50YF17QGxpbmsgaW5zdGFuY2UuUG9pbnR9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBwb2ludCA9IG5ldyBSYWMuUG9pbnQocmFjLCA1NSwgNzcpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclBvaW50ID0gcmFjLlBvaW50KDU1LCA3NylcbipcbiogQHNlZSBbYHJhYy5Qb2ludGBde0BsaW5rIFJhYyNQb2ludH1cbiogQHNlZSBbYGluc3RhbmNlLlBvaW50YF17QGxpbmsgaW5zdGFuY2UuUG9pbnR9XG4qXG4qIEBhbGlhcyBSYWMuUG9pbnRcbiovXG5jbGFzcyBQb2ludHtcblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFBvaW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjXG4gICogICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0geFxuICAqICAgVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICogICBUaGUgeSBjb29yZGluYXRlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgeCwgeSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHgsIHkpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih4LCB5KTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMueCA9IHg7XG5cbiAgICAvKipcbiAgICAqIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5Qb2ludCg1NSwgNzcpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnUG9pbnQoNTUsNzcpJ1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnksIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBQb2ludCgke3hTdHJ9LCR7eVN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgZGlmZmVyZW5jZSB3aXRoIGBvdGhlclBvaW50YCBmb3IgZWFjaFxuICAqIGNvb3JkaW5hdGUgaXMgdW5kZXIgW2ByYWMuZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9O1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclBvaW50YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlBvaW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVmFsdWVzIGFyZSBjb21wYXJlZCB1c2luZyBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBvdGhlclBvaW50IC0gQSBgUG9pbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgcmFjLmVxdWFsc2Bde0BsaW5rIFJhYyNlcXVhbHN9XG4gICovXG4gIGVxdWFscyhvdGhlclBvaW50KSB7XG4gICAgcmV0dXJuIG90aGVyUG9pbnQgaW5zdGFuY2VvZiBQb2ludFxuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMueCwgb3RoZXJQb2ludC54KVxuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMueSwgb3RoZXJQb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggYHhgIHNldCB0byBgbmV3WGAuXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1ggLSBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICB3aXRoWChuZXdYKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgbmV3WCwgdGhpcy55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggYHhgIHNldCB0byBgbmV3WGAuXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1kgLSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICB3aXRoWShuZXdZKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54LCBuZXdZKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggYHhgIGFkZGVkIHRvIGB0aGlzLnhgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGRYKHgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgeCwgdGhpcy55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggYHlgIGFkZGVkIHRvIGB0aGlzLnlgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGRZKHkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54LCB0aGlzLnkgKyB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IGFkZGluZyB0aGUgY29tcG9uZW50cyBvZiBgcG9pbnRgIHRvIGB0aGlzYC5cbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyBwb2ludC54LFxuICAgICAgdGhpcy55ICsgcG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBhZGRpbmcgdGhlIGB4YCBhbmQgYHlgIGNvbXBvbmVudHMgdG8gYHRoaXNgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vZGluYXRlIHRvIGFkZFxuICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVGhlIHkgY29vZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHgsIHRoaXMueSArIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgc3VidHJhY3RpbmcgdGhlIGNvbXBvbmVudHMgb2YgYHBvaW50YC5cbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdWJ0cmFjdFBvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54IC0gcG9pbnQueCxcbiAgICAgIHRoaXMueSAtIHBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgc3VidHJhY3RpbmcgdGhlIGB4YCBhbmQgYHlgIGNvbXBvbmVudHMuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgeCBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb2RpbmF0ZSB0byBzdWJ0cmFjdFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN1YnRyYWN0KHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggLSB4LFxuICAgICAgdGhpcy55IC0geSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIHRoZSBuZWdhdGl2ZSBjb29yZGluYXRlIHZhbHVlcyBvZiBgdGhpc2AuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgbmVnYXRpdmUoKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgLXRoaXMueCwgLXRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXNgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHJldHVybnMgdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqIEBzZWUgW2BlcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBkaXN0YW5jZVRvUG9pbnQocG9pbnQpIHtcbiAgICBpZiAodGhpcy5lcXVhbHMocG9pbnQpKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgY29uc3QgeCA9IE1hdGgucG93KChwb2ludC54IC0gdGhpcy54KSwgMik7XG4gICAgY29uc3QgeSA9IE1hdGgucG93KChwb2ludC55IC0gdGhpcy55KSwgMik7XG4gICAgcmV0dXJuIE1hdGguc3FydCh4K3kpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiByZXR1cm5zIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIHRvXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfVxuICAqICAgW2RlZmF1bHRBbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgQW4gYEFuZ2xlYCB0byByZXR1cm4gd2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGVxdWFsXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKiBAc2VlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgYW5nbGVUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShkZWZhdWx0QW5nbGUpO1xuICAgICAgcmV0dXJuIGRlZmF1bHRBbmdsZTtcbiAgICB9XG4gICAgY29uc3Qgb2Zmc2V0ID0gcG9pbnQuc3VidHJhY3RQb2ludCh0aGlzKTtcbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hdGFuMihvZmZzZXQueSwgb2Zmc2V0LngpO1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIHJhZGlhbnMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgYSBgZGlzdGFuY2VgIGZyb20gYHRoaXNgIGluIHRoZSBkaXJlY3Rpb24gb2ZcbiAgKiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG93YXJzIHRoZSBuZXcgYFBvaW50YFxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludFRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCBkaXN0YW5jZVggPSBkaXN0YW5jZSAqIE1hdGguY29zKGFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgY29uc3QgZGlzdGFuY2VZID0gZGlzdGFuY2UgKiBNYXRoLnNpbihhbmdsZS5yYWRpYW5zKCkpO1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCArIGRpc3RhbmNlWCwgdGhpcy55ICsgZGlzdGFuY2VZKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIG1pZGRsZSBiZXR3ZWVuIGB0aGlzYCBhbmQgYHBvaW50YC5cbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gY2FsY3VsYXRlIGEgYmlzZWN0b3IgdG9cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QmlzZWN0b3IocG9pbnQpIHtcbiAgICBjb25zdCB4T2Zmc2V0ID0gKHBvaW50LnggLSB0aGlzLngpIC8gMjtcbiAgICBjb25zdCB5T2Zmc2V0ID0gKHBvaW50LnkgLSB0aGlzLnkpIC8gMjtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLnggKyB4T2Zmc2V0LCB0aGlzLnkgKyB5T2Zmc2V0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBgQW5nbGVgIG9mIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgcmF5KGFuZ2xlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHRoZSByZXN1bHRpbmcgYFJheWAgdXNlcyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGB0aGlzYCBpbiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBhbmQgYHRoaXNgIGFyZVxuICAqIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSB0aGUgcmVzdWx0aW5nIGBSYXlgIGRlZmF1bHRzXG4gICogdG8gYW4gYW5nbGUgcGVycGVuZGljdWxhciB0byBgcmF5YCBpbiB0aGUgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBwcm9qZWN0IGB0aGlzYCBvbnRvXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMucmF5VG9Qb2ludChwcm9qZWN0ZWQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLCB3aGVuXG4gICogbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSByZXN1bHRpbmcgYFJheWAgaXMgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYC4gYGFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlXG4gICogY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyB0YW5nZW50IHNlZ21lbnQgaXNcbiAgKiBwb3NzaWJsZS5cbiAgKlxuICAqIEEgc3BlY2lhbCBjYXNlIGlzIGNvbnNpZGVyZWQgd2hlbiBgYXJjLnJhZGl1c2AgaXMgY29uc2lkZXJlZCB0byBiZSBgMGBcbiAgKiBhbmQgYHRoaXNgIGlzIGVxdWFsIHRvIGBhcmMuY2VudGVyYC4gSW4gdGhpcyBjYXNlIHRoZSBhbmdsZSBiZXR3ZWVuXG4gICogYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAgaXMgYXNzdW1lZCB0byBiZSB0aGUgaW52ZXJzZSBvZiBgYXJjLnN0YXJ0YCxcbiAgKiB0aHVzIHRoZSByZXN1bHRpbmcgYFJheWAgZGVmYXVsdHMgdG8gYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm4gez9SYWMuUmF5fVxuICAqL1xuICByYXlUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgLy8gQSBkZWZhdWx0IGFuZ2xlIGlzIGdpdmVuIGZvciB0aGUgZWRnZSBjYXNlIG9mIGEgemVyby1yYWRpdXMgYXJjXG4gICAgbGV0IGh5cG90ZW51c2UgPSB0aGlzLnNlZ21lbnRUb1BvaW50KGFyYy5jZW50ZXIsIGFyYy5zdGFydC5pbnZlcnNlKCkpO1xuICAgIGxldCBvcHMgPSBhcmMucmFkaXVzO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhoeXBvdGVudXNlLmxlbmd0aCwgYXJjLnJhZGl1cykpIHtcbiAgICAgIC8vIFBvaW50IGluIGFyY1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IGh5cG90ZW51c2UucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgcGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhoeXBvdGVudXNlLmxlbmd0aCwgMCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVNpbmUgPSBvcHMgLyBoeXBvdGVudXNlLmxlbmd0aDtcbiAgICBpZiAoYW5nbGVTaW5lID4gMSkge1xuICAgICAgLy8gUG9pbnQgaW5zaWRlIGFyY1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFuZ2xlUmFkaWFucyA9IE1hdGguYXNpbihhbmdsZVNpbmUpO1xuICAgIGxldCBvcHNBbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgYW5nbGVSYWRpYW5zKTtcbiAgICBsZXQgc2hpZnRlZE9wc0FuZ2xlID0gaHlwb3RlbnVzZS5hbmdsZSgpLnNoaWZ0KG9wc0FuZ2xlLCBjbG9ja3dpc2UpO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBzaGlmdGVkT3BzQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhbmdsZWAgd2l0aCB0aGUgZ2l2ZW5cbiAgKiBgbGVuZ3RoYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHBvaW50IHRoZSBzZWdtZW50XG4gICogdG93YXJkc1xuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgZGVmYXVsdHMgdG8gdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGhcbiAgKiBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9XG4gICogICBbZGVmYXVsdEFuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBBbiBgQW5nbGVgIHRvIHVzZSB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYGVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluXG4gICogYHJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgZXF1YWwgdG8gYHRoaXNgLCB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YFxuICAqIGRlZmF1bHRzIHRvIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudFRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGlzIHRhbmdlbnQgdG8gYGFyY2AsXG4gICogd2hlbiBubyB0YW5nZW50IGlzIHBvc3NpYmxlIHJldHVybnMgYG51bGxgLlxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgaXMgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYCwgYW5kIGVuZHMgYXQgdGhlIGNvbnRhY3QgcG9pbnQgd2l0aFxuICAqIGBhcmNgIHdoaWNoIGlzIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBpcyBpbnNpZGUgYGFyY2AsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIHRhbmdlbnQgc2VnbWVudCBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogQSBzcGVjaWFsIGNhc2UgaXMgY29uc2lkZXJlZCB3aGVuIGBhcmMucmFkaXVzYCBpcyBjb25zaWRlcmVkIHRvIGJlIGAwYFxuICAqIGFuZCBgdGhpc2AgaXMgZXF1YWwgdG8gYGFyYy5jZW50ZXJgLiBJbiB0aGlzIGNhc2UgdGhlIGFuZ2xlIGJldHdlZW5cbiAgKiBgdGhpc2AgYW5kIGBhcmMuY2VudGVyYCBpcyBhc3N1bWVkIHRvIGJlIHRoZSBpbnZlcnNlIG9mIGBhcmMuc3RhcnRgLFxuICAqIHRodXMgdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgZGVmYXVsdHMgdG8gYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJuIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgdGFuZ2VudFJheSA9IHRoaXMucmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlKTtcbiAgICBpZiAodGFuZ2VudFJheSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdGFuZ2VudFBlcnAgPSB0YW5nZW50UmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCByYWRpdXNSYXkgPSBhcmMuY2VudGVyLnJheSh0YW5nZW50UGVycCk7XG5cbiAgICByZXR1cm4gdGFuZ2VudFJheS5zZWdtZW50VG9JbnRlcnNlY3Rpb24ocmFkaXVzUmF5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBhdCBgdGhpc2AgYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9XG4gICogICBbc3RhcnQ9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBzdGFydCBgQW5nbGVgIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmQ9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqICAgYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGBzdGFydGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKFxuICAgIHJhZGl1cyxcbiAgICBzdGFydCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sXG4gICAgZW5kID0gbnVsbCxcbiAgICBjbG9ja3dpc2UgPSB0cnVlKVxuICB7XG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYywgdGhpcywgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBsb2NhdGVkIGF0IGB0aGlzYCB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmRcbiAgKiBgZm9ybWF0YC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuVGV4dCh0aGlzLnJhYywgdGhpcywgc3RyaW5nLCBmb3JtYXQpO1xuICB9XG5cbn0gLy8gY2xhc3MgUG9pbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogVW5ib3VuZGVkIHJheSBmcm9tIGEgYFtQb2ludF17QGxpbmsgUmFjLlBvaW50fWAgaW4gZGlyZWN0aW9uIG9mIGFuXG4qIGBbQW5nbGVde0BsaW5rIFJhYy5BbmdsZX1gLlxuKlxuKiAjIyMgYGluc3RhbmNlLlJheWBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5SYXlgIGZ1bmN0aW9uXXtAbGluayBSYWMjUmF5fSB0byBjcmVhdGUgYFJheWAgb2JqZWN0cyBmcm9tXG4qIHByaW1pdGl2ZSB2YWx1ZXMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuUmF5LnhBeGlzYF17QGxpbmsgaW5zdGFuY2UuUmF5I3hBeGlzfSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuUmF5YF17QGxpbmsgaW5zdGFuY2UuUmF5fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgcG9pbnQgPSByYWMuUG9pbnQoNTUsIDc3KVxuKiBsZXQgYW5nbGUgPSByYWMuQW5nbGUoMS80KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgcmF5ID0gbmV3IFJhYy5SYXkocmFjLCBwb2ludCwgYW5nbGUpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzQpXG4qXG4qIEBzZWUgW2ByYWMuUmF5YF17QGxpbmsgUmFjI1JheX1cbiogQHNlZSBbYGluc3RhbmNlLlJheWBde0BsaW5rIGluc3RhbmNlLlJheX1cbipcbiogQGFsaWFzIFJhYy5SYXlcbiovXG5jbGFzcyBSYXkge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheWAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnQgLSBBIGBQb2ludGAgd2hlcmUgdGhlIHJheSBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRoZSByYXkgaXMgZGlyZWN0ZWQgdG9cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIHJheS5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSByYXkgZXh0ZW5kcy5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuUmF5KDU1LCA3NywgMC4yKS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ1JheSgoNTUsNzcpIGE6MC4yKSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC55LCBkaWdpdHMpO1xuICAgIGNvbnN0IHR1cm5TdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIHJldHVybiBgUmF5KCgke3hTdHJ9LCR7eVN0cn0pIGE6JHt0dXJuU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBzdGFydGAgYW5kIGBhbmdsZWAgaW4gYm90aCByYXlzIGFyZSBlcXVhbDtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJSYXlgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuUmF5YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJSYXkpIHtcbiAgICByZXR1cm4gb3RoZXJSYXkgaW5zdGFuY2VvZiBSYXlcbiAgICAgICYmIHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyUmF5LnN0YXJ0KVxuICAgICAgJiYgdGhpcy5hbmdsZS5lcXVhbHMob3RoZXJSYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBzbG9wZSBvZiB0aGUgcmF5LCBvciBgbnVsbGAgaWYgdGhlIHJheSBpcyB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSBzbG9wZSBpcyBgbWAuXG4gICpcbiAgKiBAcmV0dXJucyB7P051bWJlcn1cbiAgKi9cbiAgc2xvcGUoKSB7XG4gICAgbGV0IGlzVmVydGljYWwgPVxuICAgICAgICAgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLmRvd24udHVybilcbiAgICAgIHx8IHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hbmdsZS50dXJuLCB0aGlzLnJhYy5BbmdsZS51cC50dXJuKTtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgudGFuKHRoaXMuYW5nbGUucmFkaWFucygpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgeS1pbnRlcmNlcHQ6IHRoZSBwb2ludCBhdCB3aGljaCB0aGUgcmF5LCBleHRlbmRlZCBpbiBib3RoXG4gICogZGlyZWN0aW9ucywgaW50ZXJjZXB0cyB3aXRoIHRoZSB5LWF4aXM7IG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzXG4gICogdmVydGljYWwuXG4gICpcbiAgKiBJbiB0aGUgbGluZSBmb3JtdWxhIGB5ID0gbXggKyBiYCB0aGUgeS1pbnRlcmNlcHQgaXMgYGJgLlxuICAqXG4gICogQHJldHVybnMgez9OdW1iZXJ9XG4gICovXG4gIHlJbnRlcmNlcHQoKSB7XG4gICAgbGV0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIHkgPSBteCArIGJcbiAgICAvLyB5IC0gbXggPSBiXG4gICAgcmV0dXJuIHRoaXMuc3RhcnQueSAtIHNsb3BlICogdGhpcy5zdGFydC54O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydC54YCBzZXQgdG8gYG5ld1hgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoWChuZXdYKSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQud2l0aFgobmV3WCksIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnlgIHNldCB0byBgbmV3WWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1kgLSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWShuZXdZKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGluY3JlbWVudGAgYWRkZWQgdG8gYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gaW5jcmVtZW50IC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoaW5jcmVtZW50KSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5hZGQoaW5jcmVtZW50KTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGFuZ2xlYCBzZXQgdG9cbiAgKiBgdGhpcy57QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0IGFuZ2xlLnNoaWZ0fShhbmdsZSwgY2xvY2t3aXNlKWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBiZSBzaGlmdGVkIGJ5XG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuYW5nbGUuc2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBwb2ludGluZyB0b3dhcmRzXG4gICogYHtAbGluayBSYWMuQW5nbGUjaW52ZXJzZSBhbmdsZS5pbnZlcnNlKCl9YC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgaW52ZXJzZSgpIHtcbiAgICBjb25zdCBpbnZlcnNlQW5nbGUgPSB0aGlzLmFuZ2xlLmludmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgaW52ZXJzZUFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBwb2ludGluZyB0b3dhcmRzIHRoZVxuICAqIFtwZXJwZW5kaWN1bGFyIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn0gb2ZcbiAgKiBgYW5nbGVgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGFsb25nIHRoZSByYXkgYnkgdGhlIGdpdmVuXG4gICogYGRpc3RhbmNlYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgYHN0YXJ0YCBpcyBtb3ZlZCBpblxuICAqIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgYHN0YXJ0YCBieVxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB0cmFuc2xhdGVUb0Rpc3RhbmNlKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZSh0aGlzLmFuZ2xlLCBkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgbW92ZWQgdG93YXJkcyBgYW5nbGVgIGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtb3ZlIGBzdGFydGAgdG93YXJkc1xuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgbW92ZWQgYnkgdGhlIGdpdmVuIGRpc3RhbmNlIHRvd2FyZCB0aGVcbiAgKiBgYW5nbGUucGVycGVuZGljdWxhcigpYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlUGVycGVuZGljdWxhcihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlVG9BbmdsZShwZXJwZW5kaWN1bGFyLCBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGFuZ2xlIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHJldHVybnMgYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIHRvXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgYW5nbGVUb1BvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeCBjb29yZGluYXRlIGlzIGB4YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgdmVydGljYWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIHNpbmdsZSBwb2ludCB3aXRoIHhcbiAgKiBjb29yZGluYXRlIGF0IGB4YCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WCh4KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhYKHgpO1xuICAgIH1cblxuICAgIC8vIHkgPSBteCArIGJcbiAgICBjb25zdCB5ID0gc2xvcGUgKiB4ICsgdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgcmF5IHdoZXJlIHRoZSB5IGNvb3JkaW5hdGUgaXMgYHlgLlxuICAqIFdoZW4gdGhlIHJheSBpcyBob3Jpem9udGFsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB5XG4gICogY29vcmRpbmF0ZSBhdCBgeWAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYW4gdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gY2FsY3VsYXRlIGEgcG9pbnQgaW4gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRZKHkpIHtcbiAgICBjb25zdCBzbG9wZSA9IHRoaXMuc2xvcGUoKTtcbiAgICBpZiAoc2xvcGUgPT09IG51bGwpIHtcbiAgICAgIC8vIFZlcnRpY2FsIHJheVxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQud2l0aFkoeSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoc2xvcGUsIDApKSB7XG4gICAgICAvLyBIb3Jpem9udGFsIHJheVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gbXggKyBiID0geVxuICAgIC8vIHggPSAoeSAtIGIpL21cbiAgICBjb25zdCB4ID0gKHkgLSB0aGlzLnlJbnRlcmNlcHQoKSkgLyBzbG9wZTtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgcmF5IGF0IHRoZSBnaXZlbiBgZGlzdGFuY2VgIGZyb21cbiAgKiBgdGhpcy5zdGFydGAuIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgdGhlIG5ldyBgUG9pbnRgIGlzIGNhbGN1bGF0ZWRcbiAgKiBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXREaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZSh0aGlzLmFuZ2xlLCBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCB0aGUgaW50ZXJzZWN0aW9uIG9mIGB0aGlzYCBhbmQgYG90aGVyUmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHJheXMgYXJlIHBhcmFsbGVsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBpbnRlcnNlY3Rpb24gaXNcbiAgKiBwb3NzaWJsZS5cbiAgKlxuICAqIEJvdGggcmF5cyBhcmUgY29uc2lkZXJlZCB1bmJvdW5kZWQgbGluZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGEgPSB0aGlzLnNsb3BlKCk7XG4gICAgY29uc3QgYiA9IG90aGVyUmF5LnNsb3BlKCk7XG4gICAgLy8gUGFyYWxsZWwgbGluZXMsIG5vIGludGVyc2VjdGlvblxuICAgIGlmIChhID09PSBudWxsICYmIGIgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhhLCBiKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgLy8gQW55IHZlcnRpY2FsIHJheVxuICAgIGlmIChhID09PSBudWxsKSB7IHJldHVybiBvdGhlclJheS5wb2ludEF0WCh0aGlzLnN0YXJ0LngpOyB9XG4gICAgaWYgKGIgPT09IG51bGwpIHsgcmV0dXJuIHRoaXMucG9pbnRBdFgob3RoZXJSYXkuc3RhcnQueCk7IH1cblxuICAgIGNvbnN0IGMgPSB0aGlzLnlJbnRlcmNlcHQoKTtcbiAgICBjb25zdCBkID0gb3RoZXJSYXkueUludGVyY2VwdCgpO1xuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGluZSVFMiU4MCU5M2xpbmVfaW50ZXJzZWN0aW9uXG4gICAgY29uc3QgeCA9IChkIC0gYykgLyAoYSAtIGIpO1xuICAgIGNvbnN0IHkgPSBhICogeCArIGM7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YCBvbnRvIHRoZSByYXkuIFRoZVxuICAqIHByb2plY3RlZCBwb2ludCBpcyB0aGUgY2xvc2VzdCBwb3NzaWJsZSBwb2ludCB0byBgcG9pbnRgLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3Qgb250byB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRQcm9qZWN0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiBwb2ludC5yYXkocGVycGVuZGljdWxhcilcbiAgICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgXG4gICogb250byB0aGUgcmF5LlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBkaXN0YW5jZSBpcyBwb3NpdGl2ZSB3aGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgdG93YXJkc1xuICAqIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJheSwgYW5kIG5lZ2F0aXZlIHdoZW4gaXQgaXMgYmVoaW5kLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3QgYW5kIG1lYXN1cmUgdGhlXG4gICogZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSB0aGlzLnBvaW50UHJvamVjdGlvbihwb2ludCk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlVG9Qb2ludChwcm9qZWN0ZWQpO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgMCkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlVG9Qcm9qZWN0ZWQgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwcm9qZWN0ZWQpO1xuICAgIGNvbnN0IGFuZ2xlRGlmZiA9IHRoaXMuYW5nbGUuc3VidHJhY3QoYW5nbGVUb1Byb2plY3RlZCk7XG4gICAgaWYgKGFuZ2xlRGlmZi50dXJuIDw9IDEvNCB8fCBhbmdsZURpZmYudHVybiA+IDMvNCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLWRpc3RhbmNlO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgYW5nbGUgdG8gdGhlIGdpdmVuIGBwb2ludGAgaXMgbG9jYXRlZCBjbG9ja3dpc2VcbiAgKiBvZiB0aGUgcmF5IG9yIGBmYWxzZWAgd2hlbiBsb2NhdGVkIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gb3IgYHBvaW50YCBsYW5kcyBvbiB0aGUgcmF5LCBpdCBpc1xuICAqIGNvbnNpZGVyZWQgY2xvY2t3aXNlLiBXaGVuIGBwb2ludGAgbGFuZHMgb24gdGhlXG4gICogW2ludmVyc2Vde0BsaW5rIFJhYy5SYXkjaW52ZXJzZX0gb2YgdGhlIHJheSwgaXQgaXMgY29uc2lkZXJlZFxuICAqIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIG9yaWVudGF0aW9uIHRvXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5SYXkjaW52ZXJzZVxuICAqL1xuICBwb2ludE9yaWVudGF0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcG9pbnRBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICBpZiAodGhpcy5hbmdsZS5lcXVhbHMocG9pbnRBbmdsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBwb2ludEFuZ2xlLnN1YnRyYWN0KHRoaXMuYW5nbGUpO1xuICAgIC8vIFswIHRvIDAuNSkgaXMgY29uc2lkZXJlZCBjbG9ja3dpc2VcbiAgICAvLyBbMC41LCAxKSBpcyBjb25zaWRlcmVkIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcmV0dXJuIGFuZ2xlRGlzdGFuY2UudHVybiA8IDAuNTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICByYXlUb1BvaW50KHBvaW50KSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHVzaW5nIGB0aGlzYCBhbmQgdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50KGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMsIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zZWdtZW50VG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0YCBhbmQgZW5kaW5nIGF0IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgdGhlIGludGVyc2VjdGlvbiBwb2ludCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0ludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSk7XG4gICAgaWYgKGludGVyc2VjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KGludGVyc2VjdGlvbik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWBcbiAgKiBhbmQgdGhlIGdpdmVuIGFyYyBwcm9wZXJ0aWVzLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmRBbmdsZT1udWxsXSAtIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgbmV3XG4gICogYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGB0aGlzLmFuZ2xlYCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMocmFkaXVzLCBlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMuYW5nbGVcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgLFxuICAqIGFuZCBlbmQgYXQgdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLnN0YXJ0YCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1RvQW5nbGVEaXN0YW5jZShyYWRpdXMsIGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgZW5kQW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvLyBUT0RPOiBMZWF2aW5nIHVuZG9jdW1lbnRlZCBmb3Igbm93LCB1bnRpbCBiZXR0ZXIgdXNlL2V4cGxhbmF0aW9uIGlzIGZvdW5kXG4gIC8vIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3MzQ3NDUvaG93LXRvLWNyZWF0ZS1jaXJjbGUtd2l0aC1iJUMzJUE5emllci1jdXJ2ZXNcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgYmV6aWVyQXJjKG90aGVyUmF5KSB7XG4gICAgaWYgKHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyUmF5LnN0YXJ0KSkge1xuICAgICAgLy8gV2hlbiBib3RoIHJheXMgaGF2ZSB0aGUgc2FtZSBzdGFydCwgcmV0dXJucyBhIHBvaW50IGJlemllci5cbiAgICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCxcbiAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgbGV0IGludGVyc2VjdGlvbiA9IHRoaXMucGVycGVuZGljdWxhcigpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheS5wZXJwZW5kaWN1bGFyKCkpO1xuXG4gICAgbGV0IG9yaWVudGF0aW9uID0gbnVsbDtcbiAgICBsZXQgcmFkaXVzQSA9IG51bGw7XG4gICAgbGV0IHJhZGl1c0IgPSBudWxsO1xuXG4gICAgLy8gQ2hlY2sgZm9yIHBhcmFsbGVsIHJheXNcbiAgICBpZiAoaW50ZXJzZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAvLyBOb3JtYWwgaW50ZXJzZWN0aW9uIGNhc2VcbiAgICAgIG9yaWVudGF0aW9uID0gdGhpcy5wb2ludE9yaWVudGF0aW9uKGludGVyc2VjdGlvbik7XG4gICAgICByYWRpdXNBID0gaW50ZXJzZWN0aW9uLnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnQpO1xuICAgICAgcmFkaXVzQiA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludChvdGhlclJheS5zdGFydCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gY2FzZSBvZiBwYXJhbGxlbCByYXlzLCBvdGhlclJheSBnZXRzIHNoaWZ0ZWQgdG8gYmVcbiAgICAgIC8vIHBlcnBlbmRpY3VsYXIgdG8gdGhpcy5cbiAgICAgIGxldCBzaGlmdGVkSW50ZXJzZWN0aW9uID0gdGhpcy5wZXJwZW5kaWN1bGFyKClcbiAgICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgICAgaWYgKHNoaWZ0ZWRJbnRlcnNlY3Rpb24gPT09IG51bGwgfHwgdGhpcy5zdGFydC5lcXVhbHMoc2hpZnRlZEludGVyc2VjdGlvbikpIHtcbiAgICAgICAgLy8gV2hlbiBib3RoIHJheXMgbGF5IG9uIHRvcCBvZiBlYWNoIG90aGVyLCB0aGUgc2hpZnRpbmcgcHJvZHVjZXNcbiAgICAgICAgLy8gcmF5cyB3aXRoIHRoZSBzYW1lIHN0YXJ0OyBmdW5jdGlvbiByZXR1cm5zIGEgbGluZWFyIGJlemllci5cbiAgICAgICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQsXG4gICAgICAgICAgb3RoZXJSYXkuc3RhcnQsIG90aGVyUmF5LnN0YXJ0KTtcbiAgICAgIH1cbiAgICAgIGludGVyc2VjdGlvbiA9IHRoaXMuc3RhcnQucG9pbnRBdEJpc2VjdG9yKHNoaWZ0ZWRJbnRlcnNlY3Rpb24pO1xuXG4gICAgICAvLyBDYXNlIGZvciBzaGlmdGVkIGludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byByYXlzXG4gICAgICBvcmllbnRhdGlvbiA9IHRoaXMucG9pbnRPcmllbnRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgcmFkaXVzQSA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJhZGl1c0IgPSByYWRpdXNBLmludmVyc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcmFkaXVzQS5hbmdsZSgpLmRpc3RhbmNlKHJhZGl1c0IuYW5nbGUoKSwgb3JpZW50YXRpb24pO1xuICAgIGNvbnN0IHF1YXJ0ZXJBbmdsZSA9IGFuZ2xlRGlzdGFuY2UubXVsdCgxLzQpO1xuICAgIC8vIFRPRE86IHdoYXQgaGFwcGVucyB3aXRoIHNxdWFyZSBhbmdsZXM/IGlzIHRoaXMgY292ZXJlZCBieSBpbnRlcnNlY3Rpb24gbG9naWM/XG4gICAgY29uc3QgcXVhcnRlclRhbiA9IHF1YXJ0ZXJBbmdsZS50YW4oKTtcblxuICAgIGNvbnN0IHRhbmdlbnRBID0gcXVhcnRlclRhbiAqIHJhZGl1c0EubGVuZ3RoICogNC8zO1xuICAgIGNvbnN0IGFuY2hvckEgPSB0aGlzLnBvaW50QXREaXN0YW5jZSh0YW5nZW50QSk7XG5cbiAgICBjb25zdCB0YW5nZW50QiA9IHF1YXJ0ZXJUYW4gKiByYWRpdXNCLmxlbmd0aCAqIDQvMztcbiAgICBjb25zdCBhbmNob3JCID0gb3RoZXJSYXkucG9pbnRBdERpc3RhbmNlKHRhbmdlbnRCKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgYW5jaG9yQSxcbiAgICAgICAgYW5jaG9yQiwgb3RoZXJSYXkuc3RhcnQpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IFVuaXQgVGVzdCBhbmQgVmlzdWFsIFRlc3RcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgc3RhcnRgIGFuZCBvcmllbnRlZCB0b3dhcmRzIGBhbmdsZWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmQgYGZvcm1hdGAuXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIHByb3ZpZGVkLCB0aGUgYW5nbGUgZm9yIHRoZSByZXN1bHRpbmcgYFRleHRgIHdpbGxcbiAgKiBzdGlsbCBiZSBzZXQgdG8gYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgZm9ybWF0ID0gZm9ybWF0LndpdGhBbmdsZSh0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH1cblxuXG59IC8vIGNsYXNzIFJheVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU2VnbWVudCBvZiBhIGBbUmF5XXtAbGluayBSYWMuUmF5fWAgd2l0aCBhIGdpdmVuIGxlbmd0aC5cbipcbiogIyMjIGBpbnN0YW5jZS5TZWdtZW50YFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlNlZ21lbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjU2VnbWVudH0gdG8gY3JlYXRlIGBTZWdtZW50YCBvYmplY3RzXG4qIGZyb20gcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5TZWdtZW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5TZWdtZW50I3plcm99LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5TZWdtZW50YF17QGxpbmsgaW5zdGFuY2UuU2VnbWVudH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IHJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzQpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBzZWdtZW50ID0gbmV3IFJhYy5TZWdtZW50KHJhYywgcmF5LCAxMDApXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclNlZ21lbnQgPSByYWMuU2VnbWVudCg1NSwgNzcsIDEvNCwgMTAwKVxuKlxuKiBAc2VlIFtgcmFjLlNlZ21lbnRgXXtAbGluayBSYWMjU2VnbWVudH1cbiogQHNlZSBbYGluc3RhbmNlLlNlZ21lbnRgXXtAbGluayBpbnN0YW5jZS5TZWdtZW50fVxuKlxuKiBAYWxpYXMgUmFjLlNlZ21lbnRcbiovXG5jbGFzcyBTZWdtZW50IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTZWdtZW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRoZSBzZWdtZW50IGlzIGJhc2VkIG9mXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByYXksIGxlbmd0aCkge1xuICAgIC8vIFRPRE86IGRpZmZlcmVudCBhcHByb2FjaCB0byBlcnJvciB0aHJvd2luZz9cbiAgICAvLyBhc3NlcnQgfHwgdGhyb3cgbmV3IEVycm9yKGVyci5taXNzaW5nUGFyYW1ldGVycylcbiAgICAvLyBvclxuICAgIC8vIGNoZWNrZXIobXNnID0+IHsgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQobXNnKSk7XG4gICAgLy8gICAuZXhpc3RzKHJhYylcbiAgICAvLyAgIC5pc1R5cGUoUmFjLlJheSwgcmF5KVxuICAgIC8vICAgLmlzTnVtYmVyKGxlbmd0aClcblxuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHJheSwgbGVuZ3RoKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5SYXksIHJheSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKGxlbmd0aCk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGBSYXlgIHRoZSBzZWdtZW50IGlzIGJhc2VkIG9mLlxuICAgICogQHR5cGUge1JhYy5SYXl9XG4gICAgKi9cbiAgICB0aGlzLnJheSA9IHJheTtcblxuICAgIC8qKlxuICAgICogVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudC5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5TZWdtZW50KDU1LCA3NywgMC4yLCAxMDApLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnU2VnbWVudCgoNTUsNzcpIGE6MC4yIGw6MTAwKSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGxlbmd0aFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmxlbmd0aCwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFNlZ21lbnQoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9IGw6JHtsZW5ndGhTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHJheWAgYW5kIGBsZW5ndGhgIGluIGJvdGggc2VnbWVudHMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclNlZ21lbnRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuU2VnbWVudGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFNlZ21lbnRzJyBgbGVuZ3RoYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFtgcmF5LmVxdWFsc2Bde0BsaW5rIFJhYy5SYXkjZXF1YWxzfVxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyU2VnbWVudCkge1xuICAgIHJldHVybiBvdGhlclNlZ21lbnQgaW5zdGFuY2VvZiBTZWdtZW50XG4gICAgICAmJiB0aGlzLnJheS5lcXVhbHMob3RoZXJTZWdtZW50LnJheSlcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLmxlbmd0aCwgb3RoZXJTZWdtZW50Lmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGBbYW5nbGVde0BsaW5rIFJhYy5SYXkjYW5nbGV9YCBvZiB0aGUgc2VnbWVudCdzIGByYXlgLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5hbmdsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFtzdGFydF17QGxpbmsgUmFjLlJheSNzdGFydH1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc3RhcnQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aGVyZSB0aGUgc2VnbWVudCBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGFuZ2xlIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdBbmdsZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMucmF5LnN0YXJ0LCBuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgcmF5YCBzZXQgdG8gYG5ld1JheWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBuZXdSYXkgLSBUaGUgcmF5IGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFJheShuZXdSYXkpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHN0YXJ0IHBvaW50IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydFBvaW50IC0gVGhlIHN0YXJ0IHBvaW50IGZvciB0aGUgbmV3XG4gICogYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoU3RhcnRQb2ludChuZXdTdGFydFBvaW50KSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0KG5ld1N0YXJ0UG9pbnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgc2V0IHRvIGBuZXdMZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdMZW5ndGggLSBUaGUgbGVuZ3RoIGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aChuZXdMZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBpbmNyZW1lbnRgIGFkZGVkIHRvIGBsZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBpbmNyZW1lbnQgLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aEFkZChpbmNyZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCArIGluY3JlbWVudCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYSBsZW5ndGggb2YgYGxlbmd0aCAqIHJhdGlvYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgaW5jcmVtZW50YCBhZGRlZCB0byBgcmF5LmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGluY3JlbWVudCAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZUFkZChpbmNyZW1lbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVBZGQoaW5jcmVtZW50KTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHJheS5bYW5nbGUuc2hpZnRde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCB0cmFuc2xhdGVkIGFnYWluc3QgdGhlXG4gICogc2VnbWVudCdzIHJheSBieSB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCwgd2hpbGUga2VlcGluZyB0aGUgc2FtZVxuICAqIGBlbmRQb2ludCgpYC4gVGhlIHJlc3VsdGluZyBzZWdtZW50IGtlZXBzIHRoZSBzYW1lIGFuZ2xlIGFzIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZSgtZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCArIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgZGlzdGFuY2VgIGFkZGVkIHRvIGBsZW5ndGhgLCB3aGljaFxuICAqIHJlc3VsdHMgaW4gYGVuZFBvaW50KClgIGZvciB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBtb3ZpbmcgaW4gdGhlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHRoZSBzYW1lIG9wZXJhdGlvbiBhc1xuICAqIGBbd2l0aExlbmd0aEFkZF17QGxpbmsgUmFjLlNlZ21lbnQjd2l0aExlbmd0aEFkZH1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIGFkZCB0byBgbGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLndpdGhMZW5ndGhBZGQoZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwb2ludGluZyB0b3dhcmRzXG4gICogYHJheS5hbmdsZS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAga2VlcHMgdGhlIHNhbWUgc3RhcnQgYW5kIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkuaW52ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGByYXkuYW5nbGVgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGtlZXBzIHRoZSBzYW1lIHN0YXJ0IGFuZCBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBlbmRQb2ludCgpYCBhbmQgZW5kaW5nIGF0XG4gICogYHN0YXJ0UG9pbnQoKWAuXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB1c2VzIHRoZSBbaW52ZXJzZV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9XG4gICogYW5nbGUgdG8gYHJheS5hbmdsZWAgYW5kIGtlZXBzIHRoZSBzYW1lIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgY29uc3QgZW5kID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IGludmVyc2VSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgZW5kLCB0aGlzLnJheS5hbmdsZS5pbnZlcnNlKCkpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgaW52ZXJzZVJheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCB0cmFuc2xhdGVkIGJ5IGBkaXN0YW5jZWBcbiAgKiB0b3dhcmRzIHRoZSBnaXZlbiBgYW5nbGVgLCBhbmQga2VlcGluZyB0aGUgc2FtZSBhbmdsZSBhbmQgbGVuZ3RoIGFzXG4gICogYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnRcbiAgICB0b3dhcmRzXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCB0cmFuc2xhdGVkIGJ5IGBkaXN0YW5jZWBcbiAgKiBhbG9uZyB0aGUgc2VnbWVudCdzIHJheSwgYW5kIGtlZXBpbmcgdGhlIHNhbWUgYW5nbGUgYW5kIGxlbmd0aCBhc1xuICAqIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgaXMgdHJhbnNsYXRlZCBpblxuICAqIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlIHNlZ21lbnQncyByYXkuXG4gICpcbiAgKiBAc2VlIFtgcmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2VgXXtAbGluayBSYWMuUmF5I3RyYW5zbGF0ZVRvRGlzdGFuY2V9XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvTGVuZ3RoKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBVbml0IFRlc3QgYW5kIFZpc3VhbCBUZXN0XG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IHRyYW5zbGF0ZWQgYWxvbmcgdGhlXG4gICogc2VnbWVudCdzIHJheSBieSBhIGRpc3RhbmNlIG9mIGBsZW5ndGggKiByYXRpb2AuIFRoZSByZXN1bHRpbmcgc2VnbWVudFxuICAqIGtlZXBzIHRoZSBzYW1lIGFuZ2xlIGFuZCBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogV2hlbiBgcmF0aW9gIGlzIG5lZ2F0aXZlLCB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBpcyB0cmFuc2xhdGVkIGluIHRoZVxuICAqIG9wcG9zaXRlIGRpcmVjdGlvbiBvZiB0aGUgc2VnbWVudCdzIHJheS5cbiAgKlxuICAqIEBzZWUgW2ByYXkudHJhbnNsYXRlVG9EaXN0YW5jZWBde0BsaW5rIFJhYy5SYXkjdHJhbnNsYXRlVG9EaXN0YW5jZX1cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0Rpc3RhbmNlKHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IHRyYW5zbGF0ZWQgYnkgYGRpc3RhbmNlYFxuICAqIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgb2YgYHJheS5hbmdsZWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0b24uXG4gICogVGhlIHJlc3VsdGluZyBzZWdtZW50IGtlZXBzIHRoZSBzYW1lIGFuZ2xlIGFuZCBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlUGVycGVuZGljdWxhcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBnaXZlbiBgdmFsdWVgIGNsYW1wZWQgdG8gW3N0YXJ0SW5zZXQsIGxlbmd0aC1lbmRJbnNldF0uXG4gICpcbiAgKiBXaGVuIGBzdGFydEluc2V0YCBpcyBncmVhdGVyIHRoYXQgYGxlbmd0aC1lbmRJbnNldGAgdGhlIHJhbmdlIGZvciB0aGVcbiAgKiBjbGFtcCBiZWNvbWVzIGltcG9zaWJsZSB0byBmdWxmaWxsLiBJbiB0aGlzIGNhc2UgdGhlIHJldHVybmVkIHZhbHVlXG4gICogaXMgY2VudGVyZWQgYmV0d2VlbiB0aGUgcmFuZ2UgbGltaXRzIGFuZCBzdGlsbCBjbGFtcGxlZCB0byBgWzAsIGxlbmd0aF1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gQSB2YWx1ZSB0byBjbGFtcFxuICAqIEBwYXJhbSB7TnVtYmVyfSBbc3RhcnRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZVxuICAqIGNsYW1waW5nIHJhbmdlXG4gICogQHBhcmFtIHtlbmRJbnNldH0gW2VuZEluc2V0PTBdIC0gVGhlIGluc2V0IGZvciB0aGUgaGlnaGVyIGxpbWl0IG9mIHRoZVxuICAqIGNsYW1waW5nIHJhbmdlXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgY2xhbXBUb0xlbmd0aCh2YWx1ZSwgc3RhcnRJbnNldCA9IDAsIGVuZEluc2V0ID0gMCkge1xuICAgIGNvbnN0IGVuZExpbWl0ID0gdGhpcy5sZW5ndGggLSBlbmRJbnNldDtcbiAgICBpZiAoc3RhcnRJbnNldCA+PSBlbmRMaW1pdCkge1xuICAgICAgLy8gaW1wb3NpYmxlIHJhbmdlLCByZXR1cm4gbWlkZGxlIHBvaW50XG4gICAgICBjb25zdCByYW5nZU1pZGRsZSA9IChzdGFydEluc2V0IC0gZW5kTGltaXQpIC8gMjtcbiAgICAgIGNvbnN0IG1pZGRsZSA9IHN0YXJ0SW5zZXQgLSByYW5nZU1pZGRsZTtcbiAgICAgIC8vIFN0aWxsIGNsYW1wIHRvIHRoZSBzZWdtZW50IGl0c2VsZlxuICAgICAgbGV0IGNsYW1wZWQgPSBtaWRkbGU7XG4gICAgICBjbGFtcGVkID0gTWF0aC5taW4oY2xhbXBlZCwgdGhpcy5sZW5ndGgpO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWF4KGNsYW1wZWQsIDApO1xuICAgICAgcmV0dXJuIGNsYW1wZWQ7XG4gICAgfVxuICAgIGxldCBjbGFtcGVkID0gdmFsdWU7XG4gICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCBzdGFydEluc2V0KTtcbiAgICByZXR1cm4gY2xhbXBlZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGFsb25nIHRoZSBzZWdtZW50J3MgcmF5IGF0IHRoZSBnaXZlbiBgZGlzdGFuY2VgXG4gICogZnJvbSBgcmF5LnN0YXJ0YC5cbiAgKlxuICAqIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgdGhlIHJlc3VsdGluZyBgUG9pbnRgIGlzIGxvY2F0ZWQgaW4gdGhlXG4gICogb3Bwb3NpdGUgZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5LlxuICAqXG4gICogQHNlZSBbYHJheS5wb2ludEF0RGlzdGFuY2VgXXtAbGluayBSYWMuUmF5I3BvaW50QXREaXN0YW5jZX1cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSBmcm9tIGBzdGFydFBvaW50KClgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aChkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYWxvbmcgdGhlIHNlZ21lbnQncyByYXkgYXQgYSBkaXN0YW5jZSBvZlxuICAqIGBsZW5ndGggKiByYXRpb2AgZnJvbSBgcmF5LnN0YXJ0YC4gV2hlbiBgcmF0aW9gIGlzIG5lZ2F0aXZlLCB0aGVcbiAgKiByZXN1bHRpbmcgYFBvaW50YCBpcyBsb2NhdGVkIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlXG4gICogc2VnbWVudCdzIHJheS5cbiAgKlxuICAqIEBzZWUgW2ByYXkucG9pbnRBdERpc3RhbmNlYF17QGxpbmsgUmFjLlJheSNwb2ludEF0RGlzdGFuY2V9XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBtaWRkbGUgcG9pbnQgdGhlIHNlZ21lbnQuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEJpc2VjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgvMik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBuZXdTdGFydFBvaW50YCBhbmQgZW5kaW5nIGF0XG4gICogYGVuZFBvaW50KClgLlxuICAqXG4gICogV2hlbiBgbmV3U3RhcnRQb2ludGAgYW5kIGBlbmRQb2ludCgpYCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzXG4gICogdG8gYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbW92ZVN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBzdGFydFBvaW50KClgIGFuZCBlbmRpbmcgYXRcbiAgKiBgbmV3RW5kUG9pbnRgLlxuICAqXG4gICogV2hlbiBgc3RhcnRQb2ludCgpYCBhbmQgYG5ld0VuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzIHRvXG4gICogYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3RW5kUG9pbnQgLSBUaGUgZW5kIHBvaW50IG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBtb3ZlRW5kUG9pbnQobmV3RW5kUG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc2VnbWVudFRvUG9pbnQobmV3RW5kUG9pbnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzdGFydGluZyBwb2ludCB0byB0aGUgc2VnbWVudCdzIG1pZGRsZVxuICAqIHBvaW50LlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2Bwb2ludEF0QmlzZWN0b3JgXXtAbGluayBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3J9XG4gICovXG4gIHNlZ21lbnRUb0Jpc2VjdG9yKCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzZWdtZW50J3MgbWlkZGxlIHBvaW50IHRvd2FyZHMgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB1c2VzIGBuZXdMZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgXG4gICogZGVmYXVsdHMgdG8gYGxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBzZWUgW2Bwb2ludEF0QmlzZWN0b3JgXXtAbGluayBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3J9XG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gW25ld0xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgbGVuZ3RoYFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudEJpc2VjdG9yKG5ld0xlbmd0aCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMucG9pbnRBdEJpc2VjdG9yKCk7XG4gICAgY29uc3QgbmV3QW5nbGUgPSB0aGlzLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCBuZXdBbmdsZSk7XG4gICAgbmV3TGVuZ3RoID0gbmV3TGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IG5ld0xlbmd0aDtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAsIHdpdGggdGhlIGdpdmVuXG4gICogYG5ld0xlbmd0aGAsIGFuZCBrZWVwaW5nIHRoZSBzYW1lIGFuZ2xlIGFzIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdMZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXh0IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRXaXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhTdGFydChuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIGFuZCBlbmRpbmcgYXRcbiAgKiBgbmV4dEVuZFBvaW50YC5cbiAgKlxuICAqIFdoZW4gYGVuZFBvaW50KClgIGFuZCBgbmV4dEVuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzXG4gICogdG8gYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV4dEVuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBuZXh0U2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0LnNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCwgdGhpcy5yYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgdG93YXJkcyBgYW5nbGVgLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgdXNlcyBgbmV3TGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yIGBudWxsYFxuICAqIGRlZmF1bHRzIHRvIGBsZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbmV3TGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGBsZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFRvQW5nbGUoYW5nbGUsIG5ld0xlbmd0aCA9IG51bGwpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgbmV3TGVuZ3RoID0gbmV3TGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IG5ld0xlbmd0aDtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgYW5kIHBvaW50aW5nIHRvd2FyZHNcbiAgKiBgcmF5LmFuZ2xlLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAgc2hpZnRlZCBieVxuICAqIGBhbmdsZURpc3RhbmNlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB1c2VzIGBuZXdMZW5ndGhgLCB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgZGVmYXVsdHMgdG8gYGxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoZSBgYW5nbGVEaXN0YW5jZWAgaXMgYXBwbGllZCB0byB0aGVcbiAgKiBbaW52ZXJzZV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9IG9mIHRoZSBzZWdtZW50J3MgYW5nbGUuIEUuZy4gd2l0aFxuICAqIGFuIGBhbmdsZURpc3RhbmNlYCBvZiBgMGAgdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgaXMgZGlyZWN0bHkgb3ZlciBhbmRcbiAgKiBwb2ludGluZyBpbiB0aGUgaW52ZXJzZSBhbmdsZSBvZiBgdGhpc2AuIEFzIHRoZSBgYW5nbGVEaXN0YW5jZWBcbiAgKiBpbmNyZWFzZXMgdGhlIHR3byBzZWdtZW50cyBzZXBhcmF0ZSB3aXRoIHRoZSBwaXZvdCBhdCBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBBbiBhbmdsZSBkaXN0YW5jZSB0byBhcHBseSB0b1xuICAqIHRoZSBzZWdtZW50J3MgYW5nbGUgaW52ZXJzZVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYW5nbGUgc2hpZnRcbiAgKiBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P051bWJlcn0gW25ld0xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgbGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSwgbmV3TGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIG5ld0xlbmd0aCA9IG5ld0xlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbmV3TGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5pbnZlcnNlKClcbiAgICAgIC53aXRoQW5nbGVTaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZVxuICAqIGBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9YCBvZlxuICAqIGByYXkuYW5nbGUuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHVzZXMgYG5ld0xlbmd0aGAsIHdoZW4gb21taXRlZCBvciBgbnVsbGBcbiAgKiBkZWZhdWx0cyB0byBgbGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX0gb2YgdGhlIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoXG4gICogYGNsb2Nrd2lzZWAgYXMgYHRydWVgLCB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBwb2ludHMgdG93YXJkc1xuICAqIGByYXkuYW5nbGUucGVycGVuZGljdWxhcihmYWxzZSlgLlxuICAqXG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGZyb20gYGVuZFBvaW50KClgXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbmV3TGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGBsZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSwgbmV3TGVuZ3RoID0gbnVsbCkge1xuICAgIG5ld0xlbmd0aCA9IG5ld0xlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbmV3TGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IHN0YXJ0cyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgY29ycmVzcG9uZHNcbiAgKiB0byB0aGUgbGVnIG9mIGEgcmlnaHQgdHJpYW5nbGUgd2hlcmUgYHRoaXNgIGlzIHRoZSBvdGhlciBjYXRoZXR1cyBhbmRcbiAgKiB0aGUgaHlwb3RlbnVzZSBpcyBvZiBsZW5ndGggYGh5cG90ZW51c2VgLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgcG9pbnRzIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgb2ZcbiAgKiBgcmF5LmFuZ2xlLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIGBoeXBvdGVudXNlYCBpcyBzbWFsbGVyIHRoYXQgdGhlIHNlZ21lbnQncyBgbGVuZ3RoYCwgcmV0dXJuc1xuICAqIGBudWxsYCBzaW5jZSBubyByaWdodCB0cmlhbmdsZSBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBoeXBvdGVudXNlIC0gVGhlIGxlbmd0aCBvZiB0aGUgaHlwb3RlbnVzZSBzaWRlIG9mIHRoZVxuICAqIHJpZ2h0IHRyaWFuZ2xlIGZvcm1lZCB3aXRoIGB0aGlzYCBhbmQgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRMZWdXaXRoSHlwKGh5cG90ZW51c2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAoaHlwb3RlbnVzZSA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBjb3MgPSBhZHkgLyBoeXBcbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKHRoaXMubGVuZ3RoIC8gaHlwb3RlbnVzZSk7XG4gICAgLy8gdGFuID0gb3BzIC8gYWRqXG4gICAgLy8gdGFuICogYWRqID0gb3BzXG4gICAgY29uc3Qgb3BzID0gTWF0aC50YW4ocmFkaWFucykgKiB0aGlzLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlLCBvcHMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgZ2l2ZW4gYGVuZEFuZ2xlYFxuICAqIGFuZCBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYEFyY2AgaXMgY2VudGVyZWQgYXQgYHJheS5zdGFydGAsIHN0YXJ0aW5nIGF0XG4gICogYHJheS5hbmdsZWAsIGFuZCB3aXRoIGEgcmFkaXVzIG9mIGBsZW5ndGhgLlxuICAqXG4gICogV2hlbiBgZW5kQW5nbGVgIGlzIG9tbWl0ZWQgb3IgYG51bGxgLCB0aGUgc2VnbWVudCdzIGFuZ2xlIGlzIHVzZWRcbiAgKiBpbnN0ZWFkIHJlc3VsdGluZyBpbiBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV9IFtlbmRBbmdsZT1udWxsXSAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIGVuZCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLCBvciBgbnVsbGAgdG8gdXNlIGByYXkuYW5nbGVgXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKGVuZEFuZ2xlID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGVuZEFuZ2xlID0gZW5kQW5nbGUgPT09IG51bGxcbiAgICAgID8gdGhpcy5yYXkuYW5nbGVcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGVuZEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICB0aGlzLnJheS5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgYXJjJ3MgZW5kIGF0XG4gICogYGFuZ2xlRGlzdGFuY2VgIGZyb20gdGhlIHNlZ21lbnQncyBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYEFyY2AgaXMgY2VudGVyZWQgYXQgYHJheS5zdGFydGAsIHN0YXJ0aW5nIGF0XG4gICogYHJheS5hbmdsZWAsIGFuZCB3aXRoIGEgcmFkaXVzIG9mIGBsZW5ndGhgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gdGhlXG4gICogc2VnbWVudCdzIHN0YXJ0IHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjV2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IHN0YXJnQW5nbGUgPSB0aGlzLnJheS5hbmdsZTtcbiAgICBjb25zdCBlbmRBbmdsZSA9IHN0YXJnQW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHN0YXJnQW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogdW5jb21tZW50IG9uY2UgYmV6aWVycyBhcmUgdGVzdGVkIGFnYWluXG4gIC8vIGJlemllckNlbnRyYWxBbmNob3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgLy8gICBsZXQgYmlzZWN0b3IgPSB0aGlzLnNlZ21lbnRCaXNlY3RvcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgLy8gICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLnN0YXJ0LCBiaXNlY3Rvci5lbmQsXG4gIC8vICAgICBiaXNlY3Rvci5lbmQsIHRoaXMuZW5kKTtcbiAgLy8gfVxuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBVbml0IFRlc3QgYW5kIFZpc3VhbCBUZXN0XG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGxvY2F0ZWQgYXQgYHN0YXJ0YCBhbmQgb3JpZW50ZWQgdG93YXJkcyBgcmF5LmFuZ2xlYFxuICAqIHdpdGggdGhlIGdpdmVuIGBzdHJpbmdgIGFuZCBgZm9ybWF0YC5cbiAgKlxuICAqIFdoZW4gYGZvcm1hdGAgaXMgcHJvdmlkZWQsIHRoZSBhbmdsZSBmb3IgdGhlIHJlc3VsdGluZyBgVGV4dGAgaXMgc3RpbGxcbiAgKiBzZXQgdG8gYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyBvZiB0aGUgbmV3IGBUZXh0YFxuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBbZm9ybWF0PVtyYWMuVGV4dC5Gb3JtYXQudG9wTGVmdF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjdG9wTGVmdH1dXG4gICogICBUaGUgZm9ybWF0IG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB0ZXh0KHN0cmluZywgZm9ybWF0ID0gdGhpcy5yYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCkge1xuICAgIGZvcm1hdCA9IGZvcm1hdC53aXRoQW5nbGUodGhpcy5yYXkuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcy5yYWMsIHRoaXMucmF5LnN0YXJ0LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH1cblxuXG59IC8vIFNlZ21lbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZ21lbnQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250YWlucyB0d28gYFtDb21wb3NpdGVde0BsaW5rIFJhYy5Db21wb3NpdGV9YCBvYmplY3RzOiBgb3V0bGluZWAgYW5kXG4qIGBjb250b3VyYC5cbipcbiogVXNlZCBieSBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YCB0byBkcmF3IHRoZSBjb21wb3NpdGVzIGFzIGFcbiogY29tcGxleCBzaGFwZSAoYG91dGxpbmVgKSB3aXRoIGFuIG5lZ2F0aXZlIHNwYWNlIHNoYXBlIGluc2lkZSAoYGNvbnRvdXJgKS5cbipcbiog4pqg77iPIFRoZSBBUEkgZm9yIFNoYXBlIGlzICoqcGxhbm5lZCB0byBjaGFuZ2UqKiBpbiBhIGZ1dHVyZSByZWxlYXNlLiDimqDvuI9cbipcbiogQGNsYXNzXG4qIEBhbGlhcyBSYWMuU2hhcGVcbiovXG5mdW5jdGlvbiBTaGFwZShyYWMpIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgdGhpcy5yYWMgPSByYWM7XG4gIHRoaXMub3V0bGluZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG4gIHRoaXMuY29udG91ciA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTtcblxuXG5TaGFwZS5wcm90b3R5cGUuYWRkT3V0bGluZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdGhpcy5vdXRsaW5lLmFkZChlbGVtZW50KTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5hZGRDb250b3VyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLmNvbnRvdXIuYWRkKGVsZW1lbnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERldGVybWluZXMgdGhlIGFsaWdubWVudCwgYW5nbGUsIGZvbnQsIHNpemUsIGFuZCBwYWRkaW5nIGZvciBkcmF3aW5nIGFcbiogW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IG9iamVjdC5cbipcbiogIyMjIGBpbnN0YW5jZS5UZXh0LkZvcm1hdGBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5UZXh0LkZvcm1hdGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0Rm9ybWF0fSB0byBjcmVhdGVcbiogYFRleHQuRm9ybWF0YCBvYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zXG4qIHJlYWR5LW1hZGUgY29udmVuaWVuY2Ugb2JqZWN0cywgbGlrZVxuKiBbYHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0YF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjdG9wTGVmdH0sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLlRleHQuRm9ybWF0YF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXR9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBhbmdsZSA9IHJhYy5BbmdsZSgxLzgpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBmb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYywgJ2xlZnQnLCAnYmFzZWxpbmUnLCBhbmdsZSlcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyRm9ybWF0ID0gcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ2Jhc2VsaW5lJywgMS84KVxuKlxuKiBAc2VlIFtgcmFjLlRleHQuRm9ybWF0YF17QGxpbmsgUmFjI1RleHRGb3JtYXR9XG4qIEBzZWUgW2BpbnN0YW5jZS5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fVxuKlxuKiBAYWxpYXMgUmFjLlRleHQuRm9ybWF0XG4qL1xuY2xhc3MgVGV4dEZvcm1hdCB7XG5cbiAgLyoqXG4gICogU3VwcG9ydGVkIHZhbHVlcyBmb3IgW2BoQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjaEFsaWdufSB3aGljaFxuICAqIGRlcm1pbmVzIHRoZSBsZWZ0LXRvLXJpZ2h0IGFsaWdubWVudCBvZiB0aGUgZHJhd24gYFRleHRgIGluIHJlbGF0aW9uXG4gICogdG8gaXRzIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsZWZ0XG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gY2VudGVyXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSBjZW50ZXIsIGZyb20gc2lkZSB0byBzaWRlLCBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSByaWdodFxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqXG4gICogQHR5cGUge09iamVjdH1cbiAgKiBAbWVtYmVyb2YgUmFjLlRleHQuRm9ybWF0XG4gICovXG4gIHN0YXRpYyBob3Jpem9udGFsQWxpZ24gPSB7XG4gICAgbGVmdDogICBcImxlZnRcIixcbiAgICBjZW50ZXI6IFwiaG9yaXpvbnRhbENlbnRlclwiLFxuICAgIHJpZ2h0OiAgXCJyaWdodFwiXG4gIH07XG5cbiAgLyoqXG4gICogU3VwcG9ydGVkIHZhbHVlcyBmb3IgW2B2QWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjdkFsaWdufSB3aGljaFxuICAqIGRlcm1pbmVzIHRoZSB0b3AtdG8tYm90dG9tIGFsaWdubWVudCBvZiB0aGUgZHJhd24gYFRleHRgIGluIHJlbGF0aW9uXG4gICogdG8gaXRzIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0b3BcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIHRvcCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGNlbnRlclxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgY2VudGVyLCBmcm9tIHRvcCB0byBib3R0b20sIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGJhc2VsaW5lXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSBiYXNlbGluZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBib3R0b21cbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIGJvdHRvbSBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICpcbiAgKiBAdHlwZSB7T2JqZWN0fVxuICAqIEBtZW1iZXJvZiBSYWMuVGV4dC5Gb3JtYXRcbiAgKi9cbiAgc3RhdGljIHZlcnRpY2FsQWxpZ24gPSB7XG4gICAgdG9wOiAgICAgIFwidG9wXCIsXG4gICAgY2VudGVyOiAgIFwidmVydGljYWxDZW50ZXJcIixcbiAgICBiYXNlbGluZTogXCJiYXNlbGluZVwiLFxuICAgIGJvdHRvbTogICBcImJvdHRvbVwiXG4gIH07XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBUZXh0LkZvcm1hdGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjXG4gICogICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1N0cmluZ30gaEFsaWduXG4gICogICBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQsIGxlZnQtdG8tcmlnaHQ7IG9uZSBvZiB0aGUgdmFsdWVzIGZyb21cbiAgKiAgIFtgaG9yaXpvbnRhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbn1cbiAgKiBAcGFyYW0ge1N0cmluZ30gdkFsaWduXG4gICogICBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tOyBvbmUgb2YgdGhlIHZhbHVlcyBmcm9tXG4gICogICBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn1cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gW2FuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgdGV4dCBpcyBkcmF3blxuICAqIEBwYXJhbSB7P1N0cmluZ30gW2ZvbnQ9bnVsbF1cbiAgKiAgIFRoZSBmb250IG5hbWVcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IFtzaXplPW51bGxdXG4gICogICBUaGUgZm9udCBzaXplXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtoUGFkZGluZz0wXVxuICAqICAgVGhlIGhvcml6b250YWwgcGFkZGluZywgbGVmdC10by1yaWdodFxuICAqIEBwYXJhbSB7TnVtYmVyfSBbdlBhZGRpbmc9MF1cbiAgKiAgIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nLCB0b3AtdG8tYm90dG9tXG4gICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHJhYyxcbiAgICBoQWxpZ24sXG4gICAgdkFsaWduLFxuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLnplcm8sXG4gICAgZm9udCA9IG51bGwsXG4gICAgc2l6ZSA9IG51bGwsXG4gICAgaFBhZGRpbmcgPSAwLFxuICAgIHZQYWRkaW5nID0gMClcbiAge1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLCByYWMpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhoQWxpZ24sIHZBbGlnbik7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcbiAgICBmb250ICE9PSBudWxsICYmIHV0aWxzLmFzc2VydFN0cmluZyhmb250KTtcbiAgICBzaXplICE9PSBudWxsICYmIHV0aWxzLmFzc2VydE51bWJlcihzaXplKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoaFBhZGRpbmcsIHZQYWRkaW5nKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQsIGxlZnQtdG8tcmlnaHQsIHRvIHBvc2l0aW9uIGEgYFRleHRgXG4gICAgKiByZWxhdGl2ZSB0byBpdHMgW2Bwb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgICAqXG4gICAgKiBTdXBwb3J0ZWQgdmFsdWVzIGFyZSBhdmFpbGFibGUgdGhyb3VnaCB0aGVcbiAgICAqIFtgaG9yaXpvbnRhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbn0gb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLmhBbGlnbiA9IGhBbGlnbjtcblxuICAgIC8qKlxuICAgICogVGhlIHZlcnRpY2FsIGFsaWdubWVudCwgdG9wLXRvLWJvdHRvbSwgdG8gcG9zaXRpb24gYSBgVGV4dGAgcmVsYXRpdmVcbiAgICAqIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIFN1cHBvcnRlZCB2YWx1ZXMgYXJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZVxuICAgICogW2B2ZXJ0aWNhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ259IG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy52QWxpZ24gPSB2QWxpZ247XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduLlxuICAgICpcbiAgICAqIEFuIGFuZ2xlIG9mIFtgemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99IHdpbCBkcmF3IHRoZSB0ZXh0XG4gICAgKiB0b3dhcmRzIHRoZSByaWdodCBvZiB0aGUgc2NyZWVuLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG5cbiAgICAvKipcbiAgICAqIFRoZSBmb250IG5hbWUgb2YgdGhlIHRleHQgdG8gZHJhdy5cbiAgICAqXG4gICAgKiBXaGVuIHNldCB0byBgbnVsbGAgdGhlIGZvbnQgZGVmaW5lZCBpblxuICAgICogW2ByYWMudGV4dEZvcm1hdERlZmF1bHRzLmZvbnRgXXtAbGluayBSYWMjdGV4dEZvcm1hdERlZmF1bHRzfSBpc1xuICAgICogdXNlZCBpbnN0ZWFkIHVwb24gZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuZm9udCA9IGZvbnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBmb250IHNpemUgb2YgdGhlIHRleHQgdG8gZHJhdy5cbiAgICAqXG4gICAgKiBXaGVuIHNldCB0byBgbnVsbGAgdGhlIHNpemUgZGVmaW5lZCBpblxuICAgICogW2ByYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemVgXXtAbGluayBSYWMjdGV4dEZvcm1hdERlZmF1bHRzfSBpc1xuICAgICogdXNlZCBpbnN0ZWFkIHVwb24gZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG5cbiAgICAvKipcbiAgICAqIFRoZSBob3Jpem9udGFsIHBhZGRpbmcsIGxlZnQtdG8tcmlnaHQsIHRvIGRpc3RhbmNlIGEgYFRleHRgXG4gICAgKiByZWxhdGl2ZSB0byBpdHMgW2Bwb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5oUGFkZGluZyA9IGhQYWRkaW5nO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgdmVydGljYWwgcGFkZGluZywgdG9wLXRvLWJvdHRvbSwgdG8gZGlzdGFuY2UgYSBgVGV4dGAgcmVsYXRpdmVcbiAgICAqIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMudlBhZGRpbmcgPSB2UGFkZGluZztcbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5UZXh0LkZvcm1hdCgnbGVmdCcsICd0b3AnLCAwLjIsICdzYW5zJywgMTQsIDcsIDUpKS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ1RleHQuRm9ybWF0KGhhOmxlZnQgdmE6dG9wIGE6MC4yIGY6XCJzYW5zXCIgczoxNCBwOig3LDUpKSdcbiAgKlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgYW5nbGVTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IHNpemVTdHIgPSB0aGlzLnNpemUgPT09IG51bGxcbiAgICAgID8gJ251bGwnXG4gICAgICA6IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnNpemUsIGRpZ2l0cyk7XG4gICAgY29uc3QgZm9udFN0ciA9IHRoaXMuZm9udCA9PT0gbnVsbFxuICAgICAgPyAnbnVsbCdcbiAgICAgIDogYFwiJHt0aGlzLmZvbnR9XCJgO1xuICAgIGNvbnN0IGhQYWRkaW5nU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuaFBhZGRpbmcsIGRpZ2l0cyk7XG4gICAgY29uc3QgdlBhZGRpbmdTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy52UGFkZGluZywgZGlnaXRzKTtcbiAgICBjb25zdCBwYWRkaW5nc1N0ciA9IGAke2hQYWRkaW5nU3RyfSwke3ZQYWRkaW5nU3RyfWBcbiAgICByZXR1cm4gYFRleHQuRm9ybWF0KGhhOiR7dGhpcy5oQWxpZ259IHZhOiR7dGhpcy52QWxpZ259IGE6JHthbmdsZVN0cn0gZjoke2ZvbnRTdHJ9IHM6JHtzaXplU3RyfSBwOigke3BhZGRpbmdzU3RyfSkpYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBhbGwgbWVtYmVycywgZXhjZXB0IGByYWNgLCBvZiBib3RoIGZvcm1hdHMgYXJlXG4gICogZXF1YWwsIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlckZvcm1hdGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5UZXh0LkZvcm1hdGAsIHJldHVybnNcbiAgKiBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IG90aGVyRm9ybWF0IC0gQSBgVGV4dC5Gb3JtYXRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyRm9ybWF0KSB7XG4gICAgcmV0dXJuIG90aGVyRm9ybWF0IGluc3RhbmNlb2YgVGV4dEZvcm1hdFxuICAgICAgJiYgdGhpcy5oQWxpZ24gICA9PT0gb3RoZXJGb3JtYXQuaEFsaWduXG4gICAgICAmJiB0aGlzLnZBbGlnbiAgID09PSBvdGhlckZvcm1hdC52QWxpZ25cbiAgICAgICYmIHRoaXMuZm9udCAgICAgPT09IG90aGVyRm9ybWF0LmZvbnRcbiAgICAgICYmIHRoaXMuc2l6ZSAgICAgPT09IG90aGVyRm9ybWF0LnNpemVcbiAgICAgICYmIHRoaXMuaFBhZGRpbmcgPT09IG90aGVyRm9ybWF0LmhQYWRkaW5nXG4gICAgICAmJiB0aGlzLnZQYWRkaW5nID09PSBvdGhlckZvcm1hdC52UGFkZGluZ1xuICAgICAgJiYgdGhpcy5hbmdsZS5lcXVhbHMob3RoZXJGb3JtYXQuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgd2l0aCBgYW5nbGVgIHNldCB0byB0aGUgYEFuZ2xlYCBkZXJpdmVkXG4gICogZnJvbSBgbmV3QW5nbGVgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFRleHQuRm9ybWF0YFxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICBuZXdBbmdsZSxcbiAgICAgIHRoaXMuZm9udCwgdGhpcy5zaXplLFxuICAgICAgdGhpcy5oUGFkZGluZywgdGhpcy52UGFkZGluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHQuRm9ybWF0YCB3aXRoIGBmb250YCBzZXQgdG8gYG5ld0ZvbnRgLlxuICAqIEBwYXJhbSB7P1N0cmluZ30gbmV3Rm9udCAtIFRoZSBmb250IG5hbWUgZm9yIHRoZSBuZXcgYFRleHQuRm9ybWF0YDtcbiAgKiAgIGNhbiBiZSBzZXQgdG8gYG51bGxgLlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICovXG4gIHdpdGhGb250KG5ld0ZvbnQpIHtcbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLFxuICAgICAgbmV3Rm9udCwgdGhpcy5zaXplLFxuICAgICAgdGhpcy5oUGFkZGluZywgdGhpcy52UGFkZGluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHQuRm9ybWF0YCB3aXRoIGBzaXplYCBzZXQgdG8gYG5ld1NpemVgLlxuICAqIEBwYXJhbSB7P051bWJlcn0gbmV3U2l6ZSAtIFRoZSBmb250IHNpemUgZm9yIHRoZSBuZXcgYFRleHQuRm9ybWF0YDtcbiAgKiAgIGNhbiBiZSBzZXQgdG8gYG51bGxgLlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICovXG4gIHdpdGhTaXplKG5ld1NpemUpIHtcbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLFxuICAgICAgdGhpcy5mb250LCBuZXdTaXplLFxuICAgICAgdGhpcy5oUGFkZGluZywgdGhpcy52UGFkZGluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHQuRm9ybWF0YCB3aXRoIHBhZGRpbmdzIHNldCB0byB0aGUgZ2l2ZW4gdmFsdWVzLlxuICAqXG4gICogV2hlbiBvbmx5IGBoUGFkZGluZ2AgaXMgcHJvdmlkZWQsIHRoYXQgdmFsdWUgaXMgdXNlZCBmb3IgYm90aFxuICAqIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhZGRpbmcuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gaFBhZGRpbmcgLSBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGBcbiAgKiBAcGFyYW0ge051bWJlcn0gW3ZQYWRkaW5nXSAtIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGA7XG4gICogICB3aGVuIG9tbWl0ZWQsIGBoUGFkZGluZ2AgaXMgdXNlZCBpbnN0ZWFkXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoUGFkZGluZ3MoaFBhZGRpbmcsIHZQYWRkaW5nID0gbnVsbCkge1xuICAgIGlmICh2UGFkZGluZyA9PT0gbnVsbCkge1xuICAgICAgdlBhZGRpbmcgPSBoUGFkZGluZztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgdGhpcy5hbmdsZSwgdGhpcy5mb250LCB0aGlzLnNpemUsXG4gICAgICBoUGFkZGluZywgdlBhZGRpbmcpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgdGhhdCBmb3JtYXRzIGEgdGV4dCByZXZlcnNlZCwgdXBzaWRlLWRvd24sXG4gICogZ2VuZXJhbGx5IGluIHRoZSBzYW1lIHBvc2l0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYEZvcm1hdGAgd2lsbCBiZSBvcmllbnRlZCB0b3dhcmRzIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX0gb2YgYGFuZ2xlYDsgYWxpZ25tZW50cyBmb3IgYGxlZnRgXG4gICogYmVjb21lcyBgcmlnaHRgIGFuZCB2aWNldmVyc2E7IGB0b3BgIGJlY29tZXMgYGJvdHRvbWAgYW5kIHZpY2V2ZXJzYTtcbiAgKiBgY2VudGVyYCBhbmQgYGJhc2VsaW5lYCByZW1haW4gdGhlIHNhbWUuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIGxldCBoRW51bSA9IFRleHRGb3JtYXQuaG9yaXpvbnRhbEFsaWduO1xuICAgIGxldCB2RW51bSA9IFRleHRGb3JtYXQudmVydGljYWxBbGlnbjtcbiAgICBsZXQgaEFsaWduLCB2QWxpZ247XG4gICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgY2FzZSBoRW51bS5sZWZ0OiAgaEFsaWduID0gaEVudW0ucmlnaHQ7IGJyZWFrO1xuICAgICAgY2FzZSBoRW51bS5yaWdodDogaEFsaWduID0gaEVudW0ubGVmdDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAgICAgICAgICBoQWxpZ24gPSB0aGlzLmhBbGlnbjsgYnJlYWs7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy52QWxpZ24pIHtcbiAgICAgIGNhc2UgdkVudW0udG9wOiAgICB2QWxpZ24gPSB2RW51bS5ib3R0b207IGJyZWFrO1xuICAgICAgY2FzZSB2RW51bS5ib3R0b206IHZBbGlnbiA9IHZFbnVtLnRvcDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAgICAgICAgICAgdkFsaWduID0gdGhpcy52QWxpZ247IGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgaEFsaWduLCB2QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLmludmVyc2UoKSxcbiAgICAgIHRoaXMuZm9udCwgdGhpcy5zaXplLFxuICAgICAgdGhpcy5oUGFkZGluZywgdGhpcy52UGFkZGluZyk7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0Rm9ybWF0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0Rm9ybWF0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5jb25zdCBUZXh0Rm9ybWF0ID0gcmVxdWlyZSgnLi9UZXh0LkZvcm1hdCcpXG5cbi8vIE5vdCB1c2VkLCBTZWVtcyBsaWtlIHVnbGlmeSBtaW5pZmljYXRpb24gbmVlZHMgYSByZWZlcmVuY2UgaGVyZTtcbi8vIG90aGVyd2lzZSBUZXh0Rm9ybWF0IGlzIG5vdCBjb3JyZWN0bHkgcmVxdWlyZWQuXG52YXIgbWluaWZ5SGVscGVyID0gVGV4dEZvcm1hdFxuXG4vKipcbiogU3RyaW5nLCBwb3NpdGlvbiBhbmQgW2Zvcm1hdF17QGxpbmsgUmFjLlRleHQuRm9ybWF0fSB0byBkcmF3IGEgdGV4dC5cbipcbiogQW4gaW5zdGFuY2Ugb2YgdGhpcyBvYmplY3QgY29udGFpbnMgdGhlIHN0cmluZyBhbmQgYSBgUG9pbnRgIHVzZWQgdG9cbiogZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiB0aGUgZHJhd24gdGV4dC4gVGhlXG4qIFtgVGV4dC5Gb3JtYXRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9IG9iamVjdCBkZXRlcm1pbmVzIHRoZSBmb250LCBzaXplLFxuKiBvcmllbnRhdGlvbiBhbmdsZSwgYW5kIHRoZSBhbGlnbm1lbnQgcmVsYXRpdmUgdG9cbiogW2Bwb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0byBkcmF3IHRoZSB0ZXh0LlxuKlxuKiAjIyMgYGluc3RhbmNlLlRleHRgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuVGV4dGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0fSB0byBjcmVhdGUgYFRleHRgIG9iamVjdHMgd2l0aCBmZXdlclxuKiBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlRleHQuaGVsbG9gXXtAbGluayBpbnN0YW5jZS5UZXh0I2hlbGxvfSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuVGV4dGBde0BsaW5rIGluc3RhbmNlLlRleHR9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBwb2ludCA9IHJhYy5Qb2ludCg1NSwgNzcpXG4qIGxldCBmb3JtYXQgPSByYWMuVGV4dC5Gb3JtYXQoJ2xlZnQnLCAnYmFzZWxpbmUnKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgdGV4dCA9IG5ldyBSYWMuVGV4dChyYWMsIHBvaW50LCAnYmxhY2sgcXVhcnR6JywgZm9ybWF0KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJUZXh0ID0gcmFjLlRleHQoNTUsIDc3LCAnYmxhY2sgcXVhcnR6JywgZm9ybWF0KVxuKlxuKiBAc2VlIFtgcmFjLlRleHRgXXtAbGluayBSYWMjVGV4dH1cbiogQHNlZSBbYGluc3RhbmNlLlRleHRgXXtAbGluayBpbnN0YW5jZS5UZXh0fVxuKlxuKiBAYWxpYXMgUmFjLlRleHRcbiovXG5jbGFzcyBUZXh0IHtcblxuICBzdGF0aWMgRm9ybWF0ID0gVGV4dEZvcm1hdDtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBUZXh0YCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWNcbiAgKiAgIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludFxuICAqICAgVGhlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcbiAgKiAgIFRoZSBzdHJpbmcgdG8gZHJhd1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKiAgIFRoZSBmb3JtYXQgZm9yIHRoZSBkcmF3biB0ZXh0XG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgcG9pbnQsIHN0cmluZywgZm9ybWF0KSB7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIHBvaW50KTtcbiAgICB1dGlscy5hc3NlcnRTdHJpbmcoc3RyaW5nKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFRleHQuRm9ybWF0LCBmb3JtYXQpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgdGV4dCB3aWxsIGJlIGRyYXduLlxuICAgICpcbiAgICAqIFRoZSB0ZXh0IHdpbGwgYmUgZHJhd24gcmVsYXRpdmUgdG8gdGhpcyBwb2ludCBiYXNlZCBvbiB0aGVcbiAgICAqIGFsaWdubWVudCBhbmQgYW5nbGUgY29uZmlndXJhdGlvbiBvZlxuICAgICogW2Bmb3JtYXRgXXtAbGluayBSYWMuVGV4dCNmb3JtYXR9LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzdHJpbmcgdG8gZHJhdy5cbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcblxuICAgIC8qKlxuICAgICogVGhlIGFsaWdubWVudCwgYW5nbGUsIGZvbnQsIGFuZCBzaXplIHRvIHVzZSB0byBkcmF3IHRoZSB0ZXh0LlxuICAgICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgICAqL1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLlRleHQoNTUsIDc3LCAnc3BoaW54IG9mIGJsYWNrIHF1YXJ0eicpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zICdUZXh0KCg1NSw3NykgXCJzcGhpbnggb2YgYmxhY2sgcXVhcnR6XCIpJ1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnBvaW50LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnBvaW50LnksIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBUZXh0KCgke3hTdHJ9LCR7eVN0cn0pIFwiJHt0aGlzLnN0cmluZ31cIilgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBgc3RyaW5nYCBhbmQgYHBvaW50YCBvZiBib3RoIHRleHRzIGFyZSBlcXVhbDtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJUZXh0YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlRleHRgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBgcG9pbnRgcyBhcmUgY29tcGFyZWQgdXNpbmcgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfS5cbiAgKlxuICAqIFRoZSBgZm9ybWF0YCBvYmplY3RzIGFyZSBpZ25vcmVkIGluIHRoaXMgY29tcGFyaXNvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlRleHR9IG90aGVyVGV4dCAtIEEgYFRleHRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyVGV4dCkge1xuICAgIHJldHVybiBvdGhlclRleHQgaW5zdGFuY2VvZiBUZXh0XG4gICAgICAmJiB0aGlzLnN0cmluZyA9PT0gb3RoZXJUZXh0LnN0cmluZ1xuICAgICAgJiYgdGhpcy5wb2ludC5lcXVhbHMob3RoZXJUZXh0LnBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggYGZvcm1hdC5hbmdsZWAgc2V0IHRvIHRoZVxuICAqIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBuZXdBbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgVGV4dGAgYW5kXG4gICogICBgVGV4dC5Gb3JtYXRgXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoQW5nbGUobmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGFuZCBgRm9ybWF0YCB3aXRoIGBmb3JtYXQuZm9udGAgc2V0IHRvIGBuZXdGb250YC5cbiAgKiBAcGFyYW0gez9TdHJpbmd9IG5ld0ZvbnQgLSBUaGUgZm9udCBuYW1lIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGA7IGNhbiBiZSBzZXQgdG8gYG51bGxgLlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgd2l0aEZvbnQobmV3Rm9udCkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhGb250KG5ld0ZvbnQpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGFuZCBgRm9ybWF0YCB3aXRoIGBmb3JtYXQuc2l6ZWAgc2V0IHRvIGBuZXdTaXplYC5cbiAgKiBAcGFyYW0gez9OdW1iZXJ9IG5ld1NpemUgLSBUaGUgZm9udCBzaXplIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGA7IGNhbiBiZSBzZXQgdG8gYG51bGxgLlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgd2l0aFNpemUobmV3U2l6ZSkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhTaXplKG5ld1NpemUpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgd2l0aCBwYWRkaW5ncyBzZXQgdG8gdGhlIGdpdmVuIHZhbHVlcy5cbiAgKlxuICAqIFdoZW4gb25seSBgaFBhZGRpbmdgIGlzIHByb3ZpZGVkLCB0aGF0IHZhbHVlIGlzIHVzZWQgZm9yIGJvdGhcbiAgKiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYWRkaW5nLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGhQYWRkaW5nIC0gVGhlIGhvcml6b250YWwgcGFkZGluZyBmb3IgdGhlIG5ldyBgVGV4dGBcbiAgKiAgIGFuZCBgVGV4dC5Gb3JtYXRgXG4gICogQHBhcmFtIHtOdW1iZXJ9IFt2UGFkZGluZ10gLSBUaGUgdmVydGljYWwgcGFkZGluZyBmb3IgdGhlIG5ldyBgVGV4dGBcbiAgKiAgIGFuZCBgVGV4dC5Gb3JtYXRgOyB3aGVuIG9tbWl0ZWQsIGBoUGFkZGluZ2AgaXMgdXNlZCBpbnN0ZWFkXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoUGFkZGluZ3MoaFBhZGRpbmcsIHZQYWRkaW5nID0gbnVsbCkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhQYWRkaW5ncyhoUGFkZGluZywgdlBhZGRpbmcpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogVW5pdCBUZXN0IGFuZCBWaXN1YWwgVGVzdFxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCB3aGljaCBpcyBhbiB1cHNpZGUtZG93biBlcXVpdmFsZW50IG9mIGB0aGlzYFxuICAqIGFuZCBnZW5lcmFsbHkgaW4gdGhlIHNhbWUgbG9jYXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBUZXh0YCBpcyBhdCB0aGUgc2FtZSBsb2NhdGlvbiBhcyBgdGhpc2AsIHVzaW5nIGFcbiAgKiBbcmV2ZXJzZWRde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNyZXZlcnNlfSBmb3JtYXQgYW5kIG9yaWVudGVkXG4gICogdG93YXJkcyB0aGUgW2ludmVyc2Vde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfSBvZiBgZm9ybWF0LmFuZ2xlYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBsZXQgcmV2ZXJzZUZvcm1hdCA9IHRoaXMuZm9ybWF0LnJldmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCByZXZlcnNlRm9ybWF0KTtcbiAgfVxuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBVbml0IFRlc3QgYW5kIFZpc3VhbCBUZXN0XG4gIC8qKlxuICAqIFJldHVybnMgYHRoaXNgIG9yIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgdGhhdCB3aWxsIGFsd2F5cyBiZVxuICAqIG9yaWVudGVkIHRvIGJlIHVwcmlnaHQgYW5kIHJlYWRhYmxlLlxuICAqXG4gICogUmV0dXJucyBgdGhpc2Agd2hlbiBbYGZvcm1hdC5hbmdsZWBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNhbmdsZX0gdHVyblxuICAqIHZhbHVlIGlzIGJldHdlZW4gX1szLzQsIDEvNClfLCBzaW5jZSBgdGhpc2AgaXMgYW4gdXByaWdodCB0ZXh0IGFscmVhZHk7XG4gICogb3RoZXJpd3NlIFtgdGhpcy5yZXZlcnNlKClgXX17QGxpbmsgUmFjLlRleHQjcmV2ZXJzZX0gaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHVwcmlnaHQoKSB7XG4gICAgaWYgKHV0aWxzLmlzVXByaWdodFRleHQodGhpcy5mb3JtYXQuYW5nbGUudHVybikpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCk7XG4gICAgfVxuICB9XG5cblxufSAvLyBjbGFzcyBUZXh0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLkFuZ2xlYCBmdW5jdGlvbl17QGxpbmsgUmFjI0FuZ2xlfS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BBbmdsZWBde0BsaW5rIFJhYy5BbmdsZX0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5BbmdsZS5xdWFydGVyIC8vIHJlYWR5LW1hZGUgcXVhcnRlciBhbmdsZVxuKiByYWMuQW5nbGUucXVhcnRlci5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQW5nbGVcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FuZ2xlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbiAgLy9cbiAgLy8gVGhlIGZ1bmN0aW9uIGByYWMuQW5nbGVgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqIENhbGxzYHtAbGluayBSYWMuQW5nbGUuZnJvbX1gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfFJhYy5BbmdsZXxSYWMuUmF5fFJhYy5TZWdtZW50fSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYW4gYEFuZ2xlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZnJvbSA9IGZ1bmN0aW9uKHNvbWV0aGluZykge1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbShyYWMsIHNvbWV0aGluZyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGByYWRpYW5zYC5cbiAgKlxuICAqIENhbGxzIGB7QGxpbmsgUmFjLkFuZ2xlLmZyb21SYWRpYW5zfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbVJhZGlhbnNcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5zIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiByYWRpYW5zXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tUmFkaWFuc1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb21SYWRpYW5zID0gZnVuY3Rpb24ocmFkaWFucykge1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbVJhZGlhbnMocmFjLCByYWRpYW5zKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYGRlZ3JlZXNgLlxuICAqXG4gICogQ2FsbHMgYHtAbGluayBSYWMuQW5nbGUuZnJvbURlZ3JlZXN9YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tRGVncmVlc1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRlZ3JlZXMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIGRlZ3JlZXNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21EZWdyZWVzXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZnJvbURlZ3JlZXMgPSBmdW5jdGlvbihkZWdyZWVzKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tRGVncmVlcyhyYWMsIGRlZ3JlZXMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDBgLlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGByaWdodGAsIGByYCwgYGVhc3RgLCBgZWAuXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS56ZXJvID0gcmFjLkFuZ2xlKDAuMCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMmAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGxlZnRgLCBgbGAsIGB3ZXN0YCwgYHdgLCBgaW52ZXJzZWAuXG4gICpcbiAgKiBAbmFtZSBoYWxmXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5oYWxmID0gcmFjLkFuZ2xlKDEvMik7XG4gIHJhYy5BbmdsZS5pbnZlcnNlID0gcmFjLkFuZ2xlLmhhbGY7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvNGAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGRvd25gLCBgZGAsIGBib3R0b21gLCBgYmAsIGBzb3V0aGAsIGBzYCwgYHNxdWFyZWAuXG4gICpcbiAgKiBAbmFtZSBxdWFydGVyXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5xdWFydGVyID0gcmFjLkFuZ2xlKDEvNCk7XG4gIHJhYy5BbmdsZS5zcXVhcmUgPSAgcmFjLkFuZ2xlLnF1YXJ0ZXI7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvOGAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJvdHRvbVJpZ2h0YCwgYGJyYCwgYHNlYC5cbiAgKlxuICAqIEBuYW1lIGVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZWlnaHRoID0gcmFjLkFuZ2xlKDEvOCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDcvOGAsIG5lZ2F0aXZlIGFuZ2xlIG9mXG4gICogW2BlaWdodGhgXXtAbGluayBpbnN0YW5jZS5BbmdsZSNlaWdodGh9LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGB0b3BSaWdodGAsIGB0cmAsIGBuZWAuXG4gICpcbiAgKiBAbmFtZSBuZWlnaHRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5uZWlnaHRoID0gcmFjLkFuZ2xlKC0xLzgpO1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMTZgLlxuICAqXG4gICogQG5hbWUgc2l4dGVlbnRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5zaXh0ZWVudGggPSByYWMuQW5nbGUoMS8xNik7XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8xMGAuXG4gICpcbiAgKiBAbmFtZSB0ZW50aFxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUudGVudGggPSByYWMuQW5nbGUoMS8xMCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDMvNGAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHVwYCwgYHVgLCBgdG9wYCwgYHRgLlxuICAqXG4gICogQG5hbWUgbm9ydGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5vcnRoID0gcmFjLkFuZ2xlKDMvNCk7XG4gIHJhYy5BbmdsZS5lYXN0ICA9IHJhYy5BbmdsZSgwLzQpO1xuICByYWMuQW5nbGUuc291dGggPSByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLndlc3QgID0gcmFjLkFuZ2xlKDIvNCk7XG5cbiAgcmFjLkFuZ2xlLmUgPSByYWMuQW5nbGUuZWFzdDtcbiAgcmFjLkFuZ2xlLnMgPSByYWMuQW5nbGUuc291dGg7XG4gIHJhYy5BbmdsZS53ID0gcmFjLkFuZ2xlLndlc3Q7XG4gIHJhYy5BbmdsZS5uID0gcmFjLkFuZ2xlLm5vcnRoO1xuXG4gIHJhYy5BbmdsZS5uZSA9IHJhYy5BbmdsZS5uLmFkZCgxLzgpO1xuICByYWMuQW5nbGUuc2UgPSByYWMuQW5nbGUuZS5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLnN3ID0gcmFjLkFuZ2xlLnMuYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5udyA9IHJhYy5BbmdsZS53LmFkZCgxLzgpO1xuXG4gIC8vIE5vcnRoIG5vcnRoLWVhc3RcbiAgcmFjLkFuZ2xlLm5uZSA9IHJhYy5BbmdsZS5uZS5hZGQoLTEvMTYpO1xuICAvLyBFYXN0IG5vcnRoLWVhc3RcbiAgcmFjLkFuZ2xlLmVuZSA9IHJhYy5BbmdsZS5uZS5hZGQoKzEvMTYpO1xuICAvLyBOb3J0aC1lYXN0IG5vcnRoXG4gIHJhYy5BbmdsZS5uZW4gPSByYWMuQW5nbGUubm5lO1xuICAvLyBOb3J0aC1lYXN0IGVhc3RcbiAgcmFjLkFuZ2xlLm5lZSA9IHJhYy5BbmdsZS5lbmU7XG5cbiAgLy8gRWFzdCBzb3V0aC1lYXN0XG4gIHJhYy5BbmdsZS5lc2UgPSByYWMuQW5nbGUuc2UuYWRkKC0xLzE2KTtcbiAgLy8gU291dGggc291dGgtZWFzdFxuICByYWMuQW5nbGUuc3NlID0gcmFjLkFuZ2xlLnNlLmFkZCgrMS8xNik7XG4gIC8vIFNvdXRoLWVhc3QgZWFzdFxuICByYWMuQW5nbGUuc2VlID0gcmFjLkFuZ2xlLmVzZTtcbiAgLy8gU291dGgtZWFzdCBzb3V0aFxuICByYWMuQW5nbGUuc2VzID0gcmFjLkFuZ2xlLnNzZTtcblxuICAvLyBTb3V0aCBzb3V0aC13ZXN0XG4gIHJhYy5BbmdsZS5zc3cgPSByYWMuQW5nbGUuc3cuYWRkKC0xLzE2KTtcbiAgLy8gV2VzdCBzb3V0aC13ZXN0XG4gIHJhYy5BbmdsZS53c3cgPSByYWMuQW5nbGUuc3cuYWRkKCsxLzE2KTtcbiAgLy8gU291dGgtd2VzdCBzb3V0aFxuICByYWMuQW5nbGUuc3dzID0gcmFjLkFuZ2xlLnNzdztcbiAgLy8gU291dGgtd2VzdCB3ZXN0XG4gIHJhYy5BbmdsZS5zd3cgPSByYWMuQW5nbGUud3N3O1xuXG4gIC8vIFdlc3Qgbm9ydGgtd2VzdFxuICByYWMuQW5nbGUud253ID0gcmFjLkFuZ2xlLm53LmFkZCgtMS8xNik7XG4gIC8vIE5vcnRoIG5vcnRoLXdlc3RcbiAgcmFjLkFuZ2xlLm5udyA9IHJhYy5BbmdsZS5udy5hZGQoKzEvMTYpO1xuICAvLyBOb3J0LWh3ZXN0IHdlc3RcbiAgcmFjLkFuZ2xlLm53dyA9IHJhYy5BbmdsZS53bnc7XG4gIC8vIE5vcnRoLXdlc3Qgbm9ydGhcbiAgcmFjLkFuZ2xlLm53biA9IHJhYy5BbmdsZS5ubnc7XG5cbiAgcmFjLkFuZ2xlLnJpZ2h0ID0gcmFjLkFuZ2xlLmU7XG4gIHJhYy5BbmdsZS5kb3duICA9IHJhYy5BbmdsZS5zO1xuICByYWMuQW5nbGUubGVmdCAgPSByYWMuQW5nbGUudztcbiAgcmFjLkFuZ2xlLnVwICAgID0gcmFjLkFuZ2xlLm47XG5cbiAgcmFjLkFuZ2xlLnIgPSByYWMuQW5nbGUucmlnaHQ7XG4gIHJhYy5BbmdsZS5kID0gcmFjLkFuZ2xlLmRvd247XG4gIHJhYy5BbmdsZS5sID0gcmFjLkFuZ2xlLmxlZnQ7XG4gIHJhYy5BbmdsZS51ID0gcmFjLkFuZ2xlLnVwO1xuXG4gIHJhYy5BbmdsZS50b3AgICAgPSByYWMuQW5nbGUudXA7XG4gIHJhYy5BbmdsZS5ib3R0b20gPSByYWMuQW5nbGUuZG93bjtcbiAgcmFjLkFuZ2xlLnQgICAgICA9IHJhYy5BbmdsZS50b3A7XG4gIHJhYy5BbmdsZS5iICAgICAgPSByYWMuQW5nbGUuYm90dG9tO1xuXG4gIHJhYy5BbmdsZS50b3BSaWdodCAgICA9IHJhYy5BbmdsZS5uZTtcbiAgcmFjLkFuZ2xlLnRyICAgICAgICAgID0gcmFjLkFuZ2xlLm5lO1xuICByYWMuQW5nbGUudG9wTGVmdCAgICAgPSByYWMuQW5nbGUubnc7XG4gIHJhYy5BbmdsZS50bCAgICAgICAgICA9IHJhYy5BbmdsZS5udztcbiAgcmFjLkFuZ2xlLmJvdHRvbVJpZ2h0ID0gcmFjLkFuZ2xlLnNlO1xuICByYWMuQW5nbGUuYnIgICAgICAgICAgPSByYWMuQW5nbGUuc2U7XG4gIHJhYy5BbmdsZS5ib3R0b21MZWZ0ICA9IHJhYy5BbmdsZS5zdztcbiAgcmFjLkFuZ2xlLmJsICAgICAgICAgID0gcmFjLkFuZ2xlLnN3O1xuXG59IC8vIGF0dGFjaFJhY0FuZ2xlXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuQXJjYCBmdW5jdGlvbl17QGxpbmsgUmFjI0FyY30uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgQXJjYCBvYmplY3RzXXtAbGluayBSYWMuQXJjfSBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5BcmMuemVybyAvLyByZWFkeS1tYWRlIHplcm8gYXJjXG4qIHJhYy5BcmMuemVyby5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQXJjXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBcmMocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5BcmNgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogQSBjbG9ja3dpc2UgYEFyY2Agd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQXJjfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BcmMjXG4gICovXG4gIHJhYy5BcmMuemVybyA9IHJhYy5BcmMoMCwgMCwgMCwgMCwgMCwgdHJ1ZSk7XG5cbn0gLy8gYXR0YWNoUmFjQXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5CZXppZXJgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkJlemllcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkJlemllclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VCZXppZXIocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5CZXppZXJgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogQSBgQmV6aWVyYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5CZXppZXJ9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkJlemllciNcbiAgKi9cbiAgcmFjLkJlemllci56ZXJvID0gcmFjLkJlemllcihcbiAgICAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDApO1xuXG59IC8vIGF0dGFjaEluc3RhbmNlQmV6aWVyXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuUG9pbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjUG9pbnR9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYFBvaW50YF17QGxpbmsgUmFjLlBvaW50fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlBvaW50Lm9yaWdpbiAvLyByZWFkeS1tYWRlIG9yaWdpbiBwb2ludFxuKiByYWMuUG9pbnQub3JpZ2luLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Qb2ludFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5Qb2ludGAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGBQb2ludGAgd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuemVybyA9IHJhYy5Qb2ludCgwLCAwKTtcblxuICAvKipcbiAgKiBBIGBQb2ludGAgYXQgYCgwLCAwKWAuXG4gICpcbiAgKiBFcXVhbCB0byBbYHJhYy5Qb2ludC56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb30uXG4gICpcbiAgKiBAbmFtZSBvcmlnaW5cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lm9yaWdpbiA9IHJhYy5Qb2ludC56ZXJvO1xuXG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5SYXlgIGZ1bmN0aW9uXXtAbGluayBSYWMjUmF5fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BSYXlgXXtAbGluayBSYWMuUmF5fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlJheS54QXhpcyAvLyByZWFkeS1tYWRlIHgtYXhpcyByYXlcbiogcmFjLlJheS54QXhpcy5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUmF5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNSYXkocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5SYXlgIGlzIGF0dGFjaGVkIGluIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cbiAgLyoqXG4gICogQSBgUmF5YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfSBhbmQgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99LlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICovXG4gIHJhYy5SYXkuemVybyA9IHJhYy5SYXkoMCwgMCwgcmFjLkFuZ2xlLnplcm8pO1xuXG5cbiAgLyoqXG4gICogQSBgUmF5YCBvdmVyIHRoZSB4LWF4aXMsIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lm9yaWdpbmBde0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn0gYW5kIHBvaW50cyB0b1xuICAqIFtgcmFjLkFuZ2xlLnplcm9gXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfS5cbiAgKlxuICAqIEVxdWFsIHRvIFtgcmFjLlJheS56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUmF5I3plcm99LlxuICAqXG4gICogQG5hbWUgeEF4aXNcbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqL1xuICByYWMuUmF5LnhBeGlzID0gcmFjLlJheS56ZXJvO1xuXG5cbiAgLyoqXG4gICogQSBgUmF5YCBvdmVyIHRoZSB5LWF4aXMsIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lm9yaWdpbmBde0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn0gYW5kIHBvaW50cyB0b1xuICAqIFtgcmFjLkFuZ2xlLnF1YXJ0ZXJgXXtAbGluayBpbnN0YW5jZS5BbmdsZSNxdWFydGVyfS5cbiAgKlxuICAqIEBuYW1lIHlBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKi9cbiAgcmFjLlJheS55QXhpcyA9IHJhYy5SYXkoMCwgMCwgcmFjLkFuZ2xlLnF1YXJ0ZXIpO1xuXG59IC8vIGF0dGFjaFJhY1JheVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlNlZ21lbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjU2VnbWVudH0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgU2VnbWVudGBde0BsaW5rIFJhYy5TZWdtZW50fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoXG4qIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlNlZ21lbnQuemVybyAvLyByZWFkeS1tYWRlIHplcm8gc2VnbWVudFxuKiByYWMuU2VnbWVudC56ZXJvLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5TZWdtZW50XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNTZWdtZW50KHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbiAgLy9cbiAgLy8gVGhlIGZ1bmN0aW9uIGByYWMuU2VnbWVudGAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGBTZWdtZW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfSwgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99LCBhbmQgaGFzIGEgbGVuZ3RoIG9mXG4gICogemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlNlZ21lbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50Lnplcm8gPSByYWMuU2VnbWVudCgwLCAwLCAwLCAwKTtcblxufSAvLyBhdHRhY2hSYWNTZWdtZW50XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiAgKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuICAqIFtgcmFjLlRleHQuRm9ybWF0YCBmdW5jdGlvbl17QGxpbmsgUmFjI1RleHRGb3JtYXR9LlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiAgKiBbYFRleHQuRm9ybWF0YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbFxuICAqIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0IC8vIHJlYWR5LW1hZGUgdG9wLWxlZnQgdGV4dCBmb3JtYXRcbiAgKiByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHQuRm9ybWF0XG4gICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHRGb3JtYXQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5UZXh0Rm9ybWF0YCBhbmQgYHJhYy5UZXh0LkZvcm1hdGAgYXJlIGF0dGFjaGVkIGluXG4gIC8vIGBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qc2AuXG5cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRvcHMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvIHRoZVxuICAqIHRvcC1sZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHRsYC5cbiAgKlxuICAqIEBuYW1lIHRvcExlZnRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCk7XG4gIHJhYy5UZXh0LkZvcm1hdC50bCA9IHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0O1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGNlbnRlci1sZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHRjYC5cbiAgKlxuICAqIEBuYW1lIHRvcENlbnRlclxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQudG9wQ2VudGVyID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24uY2VudGVyLFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCk7XG4gIHJhYy5UZXh0LkZvcm1hdC50YyA9IHJhYy5UZXh0LkZvcm1hdC50b3BDZW50ZXI7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgY2VudGVyLXJpZ2h0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHRyYC5cbiAgKlxuICAqIEBuYW1lIHRvcFJpZ2h0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC50b3BSaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCk7XG4gIHJhYy5UZXh0LkZvcm1hdC50ciA9IHJhYy5UZXh0LkZvcm1hdC50b3BSaWdodDtcblxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2VudGVycyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgY2VudGVyLWxlZnQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgY2xgLlxuICAqXG4gICogQG5hbWUgY2VudGVyTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcbiAgcmFjLlRleHQuRm9ybWF0LmNsID0gcmFjLlRleHQuRm9ybWF0LmNlbnRlckxlZnQ7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgY2VudGVyIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBjY2AsIGBjZW50ZXJlZGAuXG4gICpcbiAgKiBAbmFtZSBjZW50ZXJDZW50ZXJcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmNlbnRlckNlbnRlciA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmNlbnRlcixcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIpO1xuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyZWQgPSByYWMuVGV4dC5Gb3JtYXQuY2VudGVyQ2VudGVyO1xuICByYWMuVGV4dC5Gb3JtYXQuY2MgICAgICAgPSByYWMuVGV4dC5Gb3JtYXQuY2VudGVyQ2VudGVyO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGNlbnRlci1yaWdodCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgY3JgLlxuICAqXG4gICogQG5hbWUgY2VudGVyUmlnaHRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmNlbnRlclJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcbiAgcmFjLlRleHQuRm9ybWF0LmNyID0gcmFjLlRleHQuRm9ybWF0LmNlbnRlclJpZ2h0O1xuXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCb3R0b21zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBib3R0b20tbGVmdCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYmxgLlxuICAqXG4gICogQG5hbWUgYm90dG9tTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYm90dG9tTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tKTtcbiAgcmFjLlRleHQuRm9ybWF0LmJsID0gcmFjLlRleHQuRm9ybWF0LmJvdHRvbUxlZnQ7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgYm90dG9tLWNlbnRlciBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYmNgLlxuICAqXG4gICogQG5hbWUgYm90dG9tQ2VudGVyXG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5ib3R0b21DZW50ZXIgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5jZW50ZXIsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tKTtcbiAgcmFjLlRleHQuRm9ybWF0LmJjID0gcmFjLlRleHQuRm9ybWF0LmJvdHRvbUNlbnRlcjtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBib3R0b20tcmlnaHQgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJyYC5cbiAgKlxuICAqIEBuYW1lIGJvdHRvbVJpZ2h0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5ib3R0b21SaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJvdHRvbSk7XG4gIHJhYy5UZXh0LkZvcm1hdC5iciA9IHJhYy5UZXh0LkZvcm1hdC5ib3R0b21SaWdodDtcblxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQmFzZWxpbmVzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgYmFzZWxpbmUgYW5kIGxlZnQgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJsbGAuXG4gICpcbiAgKiBAbmFtZSBiYXNlbGluZUxlZnRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJhc2VsaW5lTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYmFzZWxpbmUpO1xuICByYWMuVGV4dC5Gb3JtYXQuYmxsID0gcmFjLlRleHQuRm9ybWF0LmJhc2VsaW5lTGVmdDtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBiYXNlbGluZSBhbmQgY2VudGVyIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBibGNgLlxuICAqXG4gICogQG5hbWUgYmFzZWxpbmVDZW50ZXJcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJhc2VsaW5lQ2VudGVyID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24uY2VudGVyLFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJhc2VsaW5lKTtcbiAgcmFjLlRleHQuRm9ybWF0LmJsYyA9IHJhYy5UZXh0LkZvcm1hdC5iYXNlbGluZUNlbnRlcjtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBiYXNlbGluZSBhbmQgcmlnaHQgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJscmAuXG4gICpcbiAgKiBAbmFtZSBiYXNlbGluZVJpZ2h0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5iYXNlbGluZVJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYmFzZWxpbmUpO1xuICByYWMuVGV4dC5Gb3JtYXQuYmxyID0gcmFjLlRleHQuRm9ybWF0LmJhc2VsaW5lUmlnaHQ7XG5cbn0gLy8gYXR0YWNoUmFjVGV4dEZvcm1hdFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlRleHRgIGZ1bmN0aW9uXXtAbGluayBSYWMjVGV4dH0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgVGV4dGBde0BsaW5rIFJhYy5UZXh0fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlRleHQuaGVsbG8gLy8gcmVhZHktbWFkZSBoZWxsby13b3JsZCB0ZXh0XG4qIHJhYy5UZXh0LmhlbGxvLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5UZXh0XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNUZXh0KHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbiAgLy9cbiAgLy8gVGhlIGZ1bmN0aW9uIGByYWMuVGV4dGAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuXG4gIC8qKlxuICAqIEEgYFRleHRgIGZvciBkcmF3aW5nIGBoZWxsbyB3b3JsZGAgd2l0aCBgdG9wTGVmdGAgZm9ybWF0IGF0XG4gICogYFBvaW50Lnplcm9gLlxuICAqIEBuYW1lIGhlbGxvXG4gICogQHR5cGUge1JhYy5UZXh0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5oZWxsbyA9IHJhYy5UZXh0KDAsIDAsICdoZWxsbyB3b3JsZCEnKTtcblxuICAvKipcbiAgKiBBIGBUZXh0YCBmb3IgZHJhd2luZyB0aGUgcGFuZ3JhbSBgc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93YFxuICAqIHdpdGggYHRvcExlZnRgIGZvcm1hdCBhdCBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgc3BoaW54XG4gICogQHR5cGUge1JhYy5UZXh0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5zcGhpbnggPSByYWMuVGV4dCgwLCAwLCAnc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93Jyk7XG5cbn0gLy8gYXR0YWNoUmFjVGV4dFxuXG4iLCJcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci90ZW1wbGF0ZXMvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW1kanMvYW1kanMtYXBpL2Jsb2IvbWFzdGVyL0FNRC5tZFxuICAgIC8vIGh0dHBzOi8vcmVxdWlyZWpzLm9yZy9kb2NzL3doeWFtZC5odG1sXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBBTUQgLSBkZWZpbmU6JHt0eXBlb2YgZGVmaW5lfWApO1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBOb2RlIC0gbW9kdWxlOiR7dHlwZW9mIG1vZHVsZX1gKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuXG4gIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBpbnRvIHNlbGYgLSByb290OiR7dHlwZW9mIHJvb3R9YCk7XG4gIHJvb3QuUmFjID0gZmFjdG9yeSgpO1xuXG59KHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vUmFjJyk7XG5cbn0pKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERyYXdlciB0aGF0IHVzZXMgYSBbUDVdKGh0dHBzOi8vcDVqcy5vcmcvKSBpbnN0YW5jZSBmb3IgYWxsIGRyYXdpbmdcbiogb3BlcmF0aW9ucy5cbipcbiogQGFsaWFzIFJhYy5QNURyYXdlclxuKi9cbmNsYXNzIFA1RHJhd2VyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHA1KXtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnA1ID0gcDU7XG4gICAgdGhpcy5kcmF3Um91dGluZXMgPSBbXTtcbiAgICB0aGlzLmRlYnVnUm91dGluZXMgPSBbXTtcbiAgICB0aGlzLmFwcGx5Um91dGluZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdXNlZCBmb3IgZGVidWcgZHJhd2luZywgd2hlbiBgbnVsbGAgdGhlIHN0eWxlIGFscmVhZHkgYXBwbGllZFxuICAgICogaXMgdXNlZC5cbiAgICAqXG4gICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1N0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdXNlZCBmb3IgdGV4dCBmb3IgZGVidWcgZHJhd2luZywgd2hlbiBgbnVsbGAgdGhlIHN0eWxlIGFscmVhZHlcbiAgICAqIGFwcGxpZWQgaXMgdXNlZC5cbiAgICAqXG4gICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1RleHRTdHlsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIFNldHRpbmdzIHVzZWQgYnkgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgYGRyYXdhYmxlLmRlYnVnKClgLlxuICAgICpcbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBmb250PSdtb25vc3BhY2UnXG4gICAgKiAgIEZvbnQgdG8gdXNlIHdoZW4gZHJhd2luZyB3aXRoIGBkZWJ1ZygpYFxuICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFtzaXplPVtyYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemVde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9XVxuICAgICogICBGb250IHNpemUgdG8gdXNlIHdoZW4gZHJhd2luZyB3aXRoIGBkZWJ1ZygpYFxuICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZpeGVkRGlnaXRzPTJcbiAgICAqICAgTnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIHRvIHByaW50IHdoZW4gZHJhd2luZyB3aXRoIGBkZWJ1ZygpYFxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmRlYnVnVGV4dE9wdGlvbnMgPSB7XG4gICAgICBmb250OiAnbW9ub3NwYWNlJyxcbiAgICAgIC8vIFRPRE86IGRvY3VtZW50YXRpb24gZGlzcGxheXMgdGhpcyBhcyBiZWluZyBvcHRpb25hbFxuICAgICAgLy8gaW4gb3JkZXIgdG8gbWFrZSB0aGUgbGluayB3b3JrIGl0IGhhcyB0byBiZSB3cmFwcGVkIGluIFtdLFxuICAgICAgLy8gd2hpY2ggbWFrZXMgaXQgYW4gb3B0aW9uYWxcbiAgICAgIHNpemU6IHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZSxcbiAgICAgIGZpeGVkRGlnaXRzOiAyXG4gICAgfTtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHBvaW50IG1hcmtlcnMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMjJcbiAgICAqL1xuICAgIHRoaXMuZGVidWdQb2ludFJhZGl1cyA9IDU7XG5cbiAgICAvKipcbiAgICAqIFJhZGl1cyBvZiB0aGUgbWFpbiB2aXN1YWwgZWxlbWVudHMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMjJcbiAgICAqL1xuICAgIHRoaXMuZGVidWdNYXJrZXJSYWRpdXMgPSAyMjtcblxuICAgIC8qKlxuICAgICogRmFjdG9yIGFwcGxpZWQgdG8gc3Ryb2tlIHdlaWdodCBzZXR0aW5nLiBTdHJva2Ugd2VpZ2h0IGlzIHNldCB0b1xuICAgICogYHN0cm9rZS53ZWlnaHQgKiBzdHJva2VXZWlnaHRGYWN0b3JgIHdoZW4gYXBwbGljYWJsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5zdHJva2VXZWlnaHRGYWN0b3IgPSAxO1xuXG4gICAgdGhpcy5zZXR1cEFsbERyYXdGdW5jdGlvbnMoKTtcbiAgICB0aGlzLnNldHVwQWxsRGVidWdGdW5jdGlvbnMoKTtcbiAgICB0aGlzLnNldHVwQWxsQXBwbHlGdW5jdGlvbnMoKTtcbiAgICAvLyBUT0RPOiBhZGQgYSBjdXN0b21pemVkIGZ1bmN0aW9uIGZvciBuZXcgY2xhc3NlcyFcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZ2l2ZW4gYGRyYXdGdW5jdGlvbmAgdG8gcGVyZm9ybSB0aGUgZHJhd2luZyBmb3IgaW5zdGFuY2VzIG9mXG4gICogY2xhc3MgYGRyYXdhYmxlQ2xhc3NgLlxuICAqXG4gICogYGRyYXdGdW5jdGlvbmAgaXMgZXhwZWN0ZWQgdG8gaGF2ZSB0aGUgc2lnbmF0dXJlOlxuICAqIGBgYFxuICAqIGRyYXdGdW5jdGlvbihkcmF3ZXIsIG9iamVjdE9mQ2xhc3MpXG4gICogYGBgXG4gICogKyBgZHJhd2VyOiBQNURyYXdlcmAgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmdcbiAgKiArIGBvYmplY3RPZkNsYXNzOiBkcmF3YWJsZUNsYXNzYCAtIEluc3RhbmNlIG9mIGBkcmF3YWJsZUNsYXNzYCB0byBkcmF3XG4gICpcbiAgKiBAcGFyYW0ge2NsYXNzfSBkcmF3YWJsZUNsYXNzIC0gQ2xhc3Mgb2YgdGhlIGluc3RhbmNlcyB0byBkcmF3XG4gICogQHBhcmFtIHtmdW5jdGlvbn0gZHJhd0Z1bmN0aW9uIC0gRnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBkcmF3aW5nXG4gICovXG4gIHNldERyYXdGdW5jdGlvbihkcmF3YWJsZUNsYXNzLCBkcmF3RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGRyYXdhYmxlQ2xhc3MpO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBEcmF3Um91dGluZShkcmF3YWJsZUNsYXNzLCBkcmF3RnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5kcmF3Um91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cblxuICBzZXREcmF3T3B0aW9ucyhjbGFzc09iaiwgb3B0aW9ucykge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgZmluZCByb3V0aW5lIGZvciBjbGFzcyAtIGNsYXNzTmFtZToke2NsYXNzT2JqLm5hbWV9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb25cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yZXF1aXJlc1B1c2hQb3AgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcm91dGluZS5yZXF1aXJlc1B1c2hQb3AgPSBvcHRpb25zLnJlcXVpcmVzUHVzaFBvcDtcbiAgICB9XG4gIH1cblxuXG4gIHNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCBzdHlsZSkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBDYW5ub3QgZmluZCByb3V0aW5lIGZvciBjbGFzcyAtIGNsYXNzTmFtZToke2NsYXNzT2JqLm5hbWV9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb25cbiAgICB9XG5cbiAgICByb3V0aW5lLnN0eWxlID0gc3R5bGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgdGhlIGdpdmVuIGBkZWJ1Z0Z1bmN0aW9uYCB0byBwZXJmb3JtIHRoZSBkZWJ1Zy1kcmF3aW5nIGZvclxuICAqIGluc3RhbmNlcyBvZiBjbGFzcyBgZHJhd2FibGVDbGFzc2AuXG4gICpcbiAgKiBXaGVuIGEgZHJhd2FibGUgY2xhc3MgZG9lcyBub3QgaGF2ZSBhIGBkZWJ1Z0Z1bmN0aW9uYCBzZXR1cCwgY2FsbGluZ1xuICAqIGBkcmF3YWJsZS5kZWJ1ZygpYCBzaW1wbHkgY2FsbHMgYGRyYXcoKWAgd2l0aFxuICAqIGBbZGVidWdTdHlsZV17QGxpbmsgUmFjLlA1RHJhd2VyI2RlYnVnU3R5bGV9YCBhcHBsaWVkLlxuICAqXG4gICogYGRlYnVnRnVuY3Rpb25gIGlzIGV4cGVjdGVkIHRvIGhhdmUgdGhlIHNpZ25hdHVyZTpcbiAgKiBgYGBcbiAgKiBkZWJ1Z0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcywgZHJhd3NUZXh0KVxuICAqIGBgYFxuICAqICsgYGRyYXdlcjogUDVEcmF3ZXJgIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nXG4gICogKyBgb2JqZWN0T2ZDbGFzczogZHJhd2FibGVDbGFzc2AgLSBJbnN0YW5jZSBvZiBgZHJhd2FibGVDbGFzc2AgdG8gZHJhd1xuICAqICsgYGRyYXdzVGV4dDogYm9vbGAgLSBXaGVuIGB0cnVlYCB0ZXh0IHNob3VsZCBiZSBkcmF3biB3aXRoXG4gICogICAgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyBvZiB0aGUgaW5zdGFuY2VzIHRvIGRyYXdcbiAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkZWJ1Z0Z1bmN0aW9uIC0gRnVuY3Rpb24gdGhhdCBwZXJmb3JtcyBkZWJ1Zy1kcmF3aW5nXG4gICovXG4gIHNldERlYnVnRnVuY3Rpb24oZHJhd2FibGVDbGFzcywgZGVidWdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGRyYXdhYmxlQ2xhc3MpO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBEZWJ1Z1JvdXRpbmUoZHJhd2FibGVDbGFzcywgZGVidWdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRlYnVnUm91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uID0gZGVidWdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRlYnVnUm91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlYnVnUm91dGluZXMucHVzaChyb3V0aW5lKTtcbiAgfVxuXG5cbiAgLy8gQWRkcyBhIEFwcGx5Um91dGluZSBmb3IgdGhlIGdpdmVuIGNsYXNzLlxuICBzZXRBcHBseUZ1bmN0aW9uKGNsYXNzT2JqLCBhcHBseUZ1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBBcHBseVJvdXRpbmUoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuYXBwbHlSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbHlSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cblxuICBkcmF3T2JqZWN0KG9iamVjdCwgc3R5bGUgPSBudWxsKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgZHJhdyBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvRHJhdztcbiAgICB9XG5cbiAgICBpZiAocm91dGluZS5yZXF1aXJlc1B1c2hQb3AgPT09IHRydWVcbiAgICAgIHx8IHN0eWxlICE9PSBudWxsXG4gICAgICB8fCByb3V0aW5lLnN0eWxlICE9PSBudWxsKVxuICAgIHtcbiAgICAgIHRoaXMucDUucHVzaCgpO1xuICAgICAgaWYgKHJvdXRpbmUuc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgcm91dGluZS5zdHlsZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgaWYgKHN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIHN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICAgICAgdGhpcy5wNS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcHVzaC1wdWxsXG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICAgIH1cbiAgfVxuXG5cbiAgZGVidWdPYmplY3Qob2JqZWN0LCBkcmF3c1RleHQpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBObyByb3V0aW5lLCBqdXN0IGRyYXcgb2JqZWN0IHdpdGggZGVidWcgc3R5bGVcbiAgICAgIHRoaXMuZHJhd09iamVjdChvYmplY3QsIHRoaXMuZGVidWdTdHlsZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVidWdTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICB0aGlzLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24odGhpcywgb2JqZWN0LCBkcmF3c1RleHQpO1xuICAgIH1cbiAgfVxuXG5cbiAgYXBwbHlPYmplY3Qob2JqZWN0KSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS50cmFjZShgQ2Fubm90IGFwcGx5IG9iamVjdCAtIG9iamVjdC10eXBlOiR7dXRpbHMudHlwZU5hbWUob2JqZWN0KX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0VG9BcHBseTtcbiAgICB9XG5cbiAgICByb3V0aW5lLmFwcGx5RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgfVxuXG5cbiAgLy8gU2V0cyB1cCBhbGwgZHJhd2luZyByb3V0aW5lcyBmb3IgcmFjIGRyYXdhYmxlIGNsYXNlcy5cbiAgLy8gQWxzbyBhdHRhY2hlcyBhZGRpdGlvbmFsIHByb3RvdHlwZSBhbmQgc3RhdGljIGZ1bmN0aW9ucyBpbiByZWxldmFudFxuICAvLyBjbGFzc2VzLlxuICBzZXR1cEFsbERyYXdGdW5jdGlvbnMoKSB7XG4gICAgbGV0IGZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZHJhdy5mdW5jdGlvbnMnKTtcblxuICAgIC8vIFBvaW50XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlBvaW50LCBmdW5jdGlvbnMuZHJhd1BvaW50KTtcbiAgICByZXF1aXJlKCcuL1BvaW50LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFJheVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5SYXksIGZ1bmN0aW9ucy5kcmF3UmF5KTtcbiAgICByZXF1aXJlKCcuL1JheS5mdW5jdGlvbnMnKSh0aGlzLnJhYyk7XG5cbiAgICAvLyBTZWdtZW50XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlNlZ21lbnQsIGZ1bmN0aW9ucy5kcmF3U2VnbWVudCk7XG4gICAgcmVxdWlyZSgnLi9TZWdtZW50LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIEFyY1xuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kcmF3QXJjKTtcblxuICAgIFJhYy5BcmMucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICAgIGxldCBiZXppZXJzUGVyVHVybiA9IDU7XG4gICAgICBsZXQgZGl2aXNpb25zID0gTWF0aC5jZWlsKGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpICogYmV6aWVyc1BlclR1cm4pO1xuICAgICAgdGhpcy5kaXZpZGVUb0JlemllcnMoZGl2aXNpb25zKS52ZXJ0ZXgoKTtcbiAgICB9O1xuXG4gICAgLy8gVGV4dFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5UZXh0LCBmdW5jdGlvbnMuZHJhd1RleHQpO1xuICAgIC8vIFRleHQgZHJhd2luZyB1c2VzIGB0ZXh0LmZvcm1hdC5hcHBseWAsIHdoaWNoIHRyYW5zbGF0ZSBhbmQgcm90YXRpb25cbiAgICAvLyBtb2RpZmljYXRpb25zIHRvIHRoZSBkcmF3aW5nIG1hdHJpeFxuICAgIC8vIHRoaXMgcmVxdWlyZXMgYSBwdXNoLXBvcCBvbiBldmVyeSBkcmF3XG4gICAgdGhpcy5zZXREcmF3T3B0aW9ucyhSYWMuVGV4dCwge3JlcXVpcmVzUHVzaFBvcDogdHJ1ZX0pO1xuXG4gICAgLy8gQmV6aWVyXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkJlemllciwgKGRyYXdlciwgYmV6aWVyKSA9PiB7XG4gICAgICBkcmF3ZXIucDUuYmV6aWVyKFxuICAgICAgICBiZXppZXIuc3RhcnQueCwgYmV6aWVyLnN0YXJ0LnksXG4gICAgICAgIGJlemllci5zdGFydEFuY2hvci54LCBiZXppZXIuc3RhcnRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZEFuY2hvci54LCBiZXppZXIuZW5kQW5jaG9yLnksXG4gICAgICAgIGJlemllci5lbmQueCwgYmV6aWVyLmVuZC55KTtcbiAgICB9KTtcblxuICAgIFJhYy5CZXppZXIucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zdGFydC52ZXJ0ZXgoKVxuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJlemllclZlcnRleChcbiAgICAgICAgdGhpcy5zdGFydEFuY2hvci54LCB0aGlzLnN0YXJ0QW5jaG9yLnksXG4gICAgICAgIHRoaXMuZW5kQW5jaG9yLngsIHRoaXMuZW5kQW5jaG9yLnksXG4gICAgICAgIHRoaXMuZW5kLngsIHRoaXMuZW5kLnkpO1xuICAgIH07XG5cbiAgICAvLyBDb21wb3NpdGVcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQ29tcG9zaXRlLCAoZHJhd2VyLCBjb21wb3NpdGUpID0+IHtcbiAgICAgIGNvbXBvc2l0ZS5zZXF1ZW5jZS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkNvbXBvc2l0ZS5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLnZlcnRleCgpKTtcbiAgICB9O1xuXG4gICAgLy8gU2hhcGVcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2hhcGUsIChkcmF3ZXIsIHNoYXBlKSA9PiB7XG4gICAgICBkcmF3ZXIucDUuYmVnaW5TaGFwZSgpO1xuICAgICAgc2hhcGUub3V0bGluZS52ZXJ0ZXgoKTtcblxuICAgICAgaWYgKHNoYXBlLmNvbnRvdXIuaXNOb3RFbXB0eSgpKSB7XG4gICAgICAgIGRyYXdlci5wNS5iZWdpbkNvbnRvdXIoKTtcbiAgICAgICAgc2hhcGUuY29udG91ci52ZXJ0ZXgoKTtcbiAgICAgICAgZHJhd2VyLnA1LmVuZENvbnRvdXIoKTtcbiAgICAgIH1cbiAgICAgIGRyYXdlci5wNS5lbmRTaGFwZSgpO1xuICAgIH0pO1xuXG4gICAgUmFjLlNoYXBlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub3V0bGluZS52ZXJ0ZXgoKTtcbiAgICAgIHRoaXMuY29udG91ci52ZXJ0ZXgoKTtcbiAgICB9O1xuICB9IC8vIHNldHVwQWxsRHJhd0Z1bmN0aW9uc1xuXG5cbiAgLy8gU2V0cyB1cCBhbGwgZGVidWcgcm91dGluZXMgZm9yIHJhYyBkcmF3YWJsZSBjbGFzZXMuXG4gIHNldHVwQWxsRGVidWdGdW5jdGlvbnMoKSB7XG4gICAgbGV0IGZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZGVidWcuZnVuY3Rpb25zJyk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5Qb2ludCwgZnVuY3Rpb25zLmRlYnVnUG9pbnQpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuUmF5LCBmdW5jdGlvbnMuZGVidWdSYXkpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRlYnVnU2VnbWVudCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kZWJ1Z0FyYyk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5UZXh0LCBmdW5jdGlvbnMuZGVidWdUZXh0KTtcblxuICAgIC8vIFJldHVybnMgY2FsbGluZyBhbmdsZVxuICAgIFJhYy5BbmdsZS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbihwb2ludCwgZHJhd3NUZXh0ID0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IGRyYXdlciA9IHRoaXMucmFjLmRyYXdlcjtcbiAgICAgIGlmIChkcmF3ZXIuZGVidWdTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUucHVzaCgpO1xuICAgICAgICBkcmF3ZXIuZGVidWdTdHlsZS5hcHBseSgpO1xuICAgICAgICAvLyBUT0RPOiBjb3VsZCB0aGlzIGJlIGEgZ29vZCBvcHRpb24gdG8gaW1wbGVtZW50IHNwbGF0dGluZyBhcmd1bWVudHNcbiAgICAgICAgLy8gaW50byB0aGUgZGVidWdGdW5jdGlvbj9cbiAgICAgICAgZnVuY3Rpb25zLmRlYnVnQW5nbGUoZHJhd2VyLCB0aGlzLCBwb2ludCwgZHJhd3NUZXh0KTtcbiAgICAgICAgZHJhd2VyLnA1LnBvcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVuY3Rpb25zLmRlYnVnQW5nbGUoZHJhd2VyLCB0aGlzLCBwb2ludCwgZHJhd3NUZXh0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBSZXR1cm5zIGNhbGxpbmcgcG9pbnRcbiAgICBSYWMuUG9pbnQucHJvdG90eXBlLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihhbmdsZSwgZHJhd3NUZXh0ID0gZmFsc2UpIHtcbiAgICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgICBhbmdsZS5kZWJ1Zyh0aGlzLCBkcmF3c1RleHQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfSAvLyBzZXR1cEFsbERlYnVnRnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBhcHBseWluZyByb3V0aW5lcyBmb3IgcmFjIHN0eWxlIGNsYXNlcy5cbiAgLy8gQWxzbyBhdHRhY2hlcyBhZGRpdGlvbmFsIHByb3RvdHlwZSBmdW5jdGlvbnMgaW4gcmVsZXZhbnQgY2xhc3Nlcy5cbiAgc2V0dXBBbGxBcHBseUZ1bmN0aW9ucygpIHtcbiAgICAvLyBDb2xvciBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseUJhY2tncm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5iYWNrZ3JvdW5kKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5RmlsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmZpbGwodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSwgdGhpcy5hICogMjU1KTtcbiAgICB9O1xuXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseVN0cm9rZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnN0cm9rZSh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICAvLyBTdHJva2VcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0cm9rZSwgKGRyYXdlciwgc3Ryb2tlKSA9PiB7XG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCA9PT0gbnVsbCAmJiBzdHJva2UuY29sb3IgPT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1Lm5vU3Ryb2tlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cm9rZS5jb2xvciAhPT0gbnVsbCkge1xuICAgICAgICBzdHJva2UuY29sb3IuYXBwbHlTdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cm9rZS53ZWlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1LnN0cm9rZVdlaWdodChzdHJva2Uud2VpZ2h0ICogZHJhd2VyLnN0cm9rZVdlaWdodEZhY3Rvcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBGaWxsXG4gICAgdGhpcy5zZXRBcHBseUZ1bmN0aW9uKFJhYy5GaWxsLCAoZHJhd2VyLCBmaWxsKSA9PiB7XG4gICAgICBpZiAoZmlsbC5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9GaWxsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZmlsbC5jb2xvci5hcHBseUZpbGwoKTtcbiAgICB9KTtcblxuICAgIC8vIFN0eWxlQ29udGFpbmVyXG4gICAgdGhpcy5zZXRBcHBseUZ1bmN0aW9uKFJhYy5TdHlsZUNvbnRhaW5lciwgKGRyYXdlciwgY29udGFpbmVyKSA9PiB7XG4gICAgICBjb250YWluZXIuc3R5bGVzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGl0ZW0uYXBwbHkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVGV4dC5Gb3JtYXRcbiAgICAvLyBBcHBsaWVzIGFsbCB0ZXh0IHByb3BlcnRpZXMgYW5kIHRyYW5zbGF0ZXMgdG8gdGhlIGdpdmVuIGBwb2ludGAuXG4gICAgLy8gQWZ0ZXIgdGhlIGZvcm1hdCBpcyBhcHBsaWVkIHRoZSB0ZXh0IHNob3VsZCBiZSBkcmF3biBhdCB0aGUgb3JpZ2luLlxuICAgIC8vXG4gICAgLy8gQ2FsbGluZyB0aGlzIGZ1bmN0aW9uIHJlcXVpcmVzIGEgcHVzaC1wb3AgdG8gdGhlIGRyYXdpbmcgc3R5bGVcbiAgICAvLyBzZXR0aW5ncyBzaW5jZSB0cmFuc2xhdGUgYW5kIHJvdGF0aW9uIG1vZGlmaWNhdGlvbnMgYXJlIG1hZGUgdG8gdGhlXG4gICAgLy8gZHJhd2luZyBtYXRyaXguIE90aGVyd2lzZSBhbGwgb3RoZXIgc3Vic2VxdWVudCBkcmF3aW5nIHdpbGwgYmVcbiAgICAvLyBpbXBhY3RlZC5cbiAgICBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIGxldCBoQWxpZ247XG4gICAgICBsZXQgaEVudW0gPSBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduO1xuICAgICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgICBjYXNlIGhFbnVtLmxlZnQ6ICAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkxFRlQ7ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaEVudW0uY2VudGVyOiBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5yaWdodDogIGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5SSUdIVDsgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgaEFsaWduIGNvbmZpZ3VyYXRpb24gLSBoQWxpZ246JHt0aGlzLmhBbGlnbn1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIGxldCB2QWxpZ247XG4gICAgICBsZXQgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcbiAgICAgIHN3aXRjaCAodGhpcy52QWxpZ24pIHtcbiAgICAgICAgY2FzZSB2RW51bS50b3A6ICAgICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlRPUDsgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5ib3R0b206ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJPVFRPTTsgICBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5jZW50ZXI6ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkNFTlRFUjsgICBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5iYXNlbGluZTogdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJBU0VMSU5FOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHZBbGlnbiBjb25maWd1cmF0aW9uIC0gdkFsaWduOiR7dGhpcy52QWxpZ259YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBBbGlnblxuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRBbGlnbihoQWxpZ24sIHZBbGlnbik7XG5cbiAgICAgIC8vIFNpemVcbiAgICAgIGNvbnN0IHRleHRTaXplID0gdGhpcy5zaXplID8/IHRoaXMucmFjLnRleHRGb3JtYXREZWZhdWx0cy5zaXplO1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRTaXplKHRleHRTaXplKTtcblxuICAgICAgLy8gRm9udFxuICAgICAgY29uc3QgdGV4dEZvbnQgPSB0aGlzLmZvbnQgPz8gdGhpcy5yYWMudGV4dEZvcm1hdERlZmF1bHRzLmZvbnQ7XG4gICAgICBpZiAodGV4dEZvbnQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRGb250KHRleHRGb250KTtcbiAgICAgIH1cblxuICAgICAgLy8gUG9zaXRpb25pbmdcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50cmFuc2xhdGUocG9pbnQueCwgcG9pbnQueSk7XG5cbiAgICAgIC8vIFJvdGF0aW9uXG4gICAgICBpZiAodGhpcy5hbmdsZS50dXJuICE9PSAwKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5yb3RhdGUodGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBQYWRkaW5nXG4gICAgICBsZXQgeFBhZCA9IDA7XG4gICAgICBsZXQgeVBhZCA9IDA7XG5cbiAgICAgIHN3aXRjaCAodGhpcy5oQWxpZ24pIHtcbiAgICAgICAgY2FzZSBoRW51bS5sZWZ0OiAgIHhQYWQgKz0gdGhpcy5oUGFkZGluZzsgYnJlYWs7XG4gICAgICAgIGNhc2UgaEVudW0uY2VudGVyOiB4UGFkICs9IHRoaXMuaFBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIGhFbnVtLnJpZ2h0OiAgeFBhZCAtPSB0aGlzLmhQYWRkaW5nOyBicmVhaztcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAodGhpcy52QWxpZ24pIHtcbiAgICAgICAgY2FzZSB2RW51bS50b3A6ICAgICAgeVBhZCArPSB0aGlzLnZQYWRkaW5nOyBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5jZW50ZXI6ICAgeVBhZCArPSB0aGlzLnZQYWRkaW5nOyBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5iYXNlbGluZTogeVBhZCArPSB0aGlzLnZQYWRkaW5nOyBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5ib3R0b206ICAgeVBhZCAtPSB0aGlzLnZQYWRkaW5nOyBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHhQYWQgIT09IDAgfHwgeVBhZCAhPT0gMCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudHJhbnNsYXRlKHhQYWQsIHlQYWQpO1xuICAgICAgfVxuICAgIH0gLy8gUmFjLlRleHQuRm9ybWF0LnByb3RvdHlwZS5hcHBseVxuXG4gIH0gLy8gc2V0dXBBbGxBcHBseUZ1bmN0aW9uc1xuXG59IC8vIGNsYXNzIFA1RHJhd2VyXG5cbm1vZHVsZS5leHBvcnRzID0gUDVEcmF3ZXI7XG5cblxuLy8gQ29udGFpbnMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGRyYXdpbmcgb2JqZWN0cyBvZiBhXG4vLyBzcGVjaWZpYyBjbGFzcy5cbi8vXG4vLyBBbiBpbnN0YW5jZSBpcyBjcmVhdGVkIGZvciBlYWNoIGRyYXdhYmxlIGNsYXNzIHRoYXQgdGhlIGRyYXdlciBjYW5cbi8vIHN1cHBvcnQsIHdoaWNoIGNvbnRhaW5zIGFsbCB0aGUgc2V0dGluZ3MgbmVlZGVkIGZvciBkcmF3aW5nLlxuY2xhc3MgRHJhd1JvdXRpbmUge1xuXG4gIC8vIFRPRE86IFJlbmFtZSB0byBkcmF3YWJsZUNsYXNzXG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgZHJhd0Z1bmN0aW9uKSB7XG4gICAgLy8gQ2xhc3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb250YWluZWQgc2V0dGluZ3MuXG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuXG4gICAgLy8gRHJhd2luZyBmdW5jdGlvbiBmb3Igb2JqZWN0cyBvZiB0eXBlIGBjbGFzc09iamAgd2l0aCB0aGUgc2lnbmF0dXJlOlxuICAgIC8vIGBkcmF3RnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzKWBcbiAgICAvLyArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAgIC8vICsgYG9iamVjdE9mQ2xhc3M6IGNsYXNzT2JqYCAtIEluc3RhbmNlIG9mIGBjbGFzc09iamAgdG8gZHJhd1xuICAgIC8vXG4gICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGludGVuZGVkIHRvIHBlcmZvcm0gZHJhd2luZyB1c2luZyBgZHJhd2VyLnA1YFxuICAgIC8vIGZ1bmN0aW9ucyBvciBjYWxsaW5nIGBkcmF3KClgIGluIG90aGVyIGRyYXdhYmxlIG9iamVjdHMuIEFsbCBzdHlsZXNcbiAgICAvLyBhcmUgcHVzaGVkIGJlZm9yZWhhbmQgYW5kIHBvcHBlZCBhZnRlcndhcmRzLlxuICAgIC8vXG4gICAgLy8gSW4gZ2VuZXJhbCBpdCBpcyBleHBlY3RlZCB0aGF0IHRoZSBgZHJhd0Z1bmN0aW9uYCBwZWZvcm1zIG5vIGNoYW5nZXNcbiAgICAvLyB0byB0aGUgZHJhd2luZyBzZXR0aW5ncyBpbiBvcmRlciBmb3IgZWFjaCBkcmF3aW5nIGNhbGwgdG8gdXNlIG9ubHkgYVxuICAgIC8vIHNpbmdsZSBgcHVzaC9wb3BgIHdoZW4gbmVjZXNzYXJ5LiBGb3IgY2xhc3NlcyB0aGF0IHJlcXVpcmVcbiAgICAvLyBtb2RpZmljYXRpb25zIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzIHRoZSBgcmVxdWlyZXNQdXNoUG9wYFxuICAgIC8vIHByb3BlcnR5IGNhbiBiZSBzZXQgdG8gZm9yY2UgYSBgcHVzaC9wb3BgIHdpdGggZWFjaCBkcmF3aW5nIGNhbGxcbiAgICAvLyByZWdhcmRsZXNzIGlmIHN0eWxlcyBhcmUgYXBwbGllZC5cbiAgICB0aGlzLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcblxuICAgIC8vIFdoZW4gc2V0LCB0aGlzIHN0eWxlIGlzIGFsd2F5cyBhcHBsaWVkIGJlZm9yZSBlYWNoIGRyYXdpbmcgY2FsbCB0b1xuICAgIC8vIG9iamVjdHMgb2YgdHlwZSBgY2xhc3NPYmpgLiBUaGlzIGBzdHlsZWAgaXMgYXBwbGllZCBiZWZvcmUgdGhlXG4gICAgLy8gYHN0eWxlYCBwcm92aWRlZCB0byB0aGUgZHJhd2luZyBjYWxsLlxuICAgIHRoaXMuc3R5bGUgPSBudWxsO1xuXG4gICAgLy8gV2hlbiBzZXQgdG8gYHRydWVgLCBhIGBwdXNoL3BvcGAgaXMgYWx3YXlzIHBlZm9ybWVkIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICAvLyBhbGwgdGhlIHN0eWxlIGFyZSBhcHBsaWVkIGFuZCBkcmF3aW5nIGlzIHBlcmZvcm1lZC4gVGhpcyBpcyBpbnRlbmRlZFxuICAgIC8vIGZvciBvYmplY3RzIHdoaWNoIGRyYXdpbmcgb3BlcmF0aW9ucyBtYXkgbmVlZCB0byBwZXJmb3JtXG4gICAgLy8gdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzLlxuICAgIHRoaXMucmVxdWlyZXNQdXNoUG9wID0gZmFsc2U7XG4gIH0gLy8gY29uc3RydWN0b3JcblxufSAvLyBEcmF3Um91dGluZVxuXG5cbi8vIENvbnRhaW5zIHRoZSBkZWJ1Zy1kcmF3aW5nIGZ1bmN0aW9uIGFuZCBvcHRpb25zIGZvciBkZWJ1Zy1kcmF3aW5nXG4vLyBvYmplY3RzIG9mIGEgc3BlY2lmaWMgY2xhc3MuXG4vL1xuLy8gQW4gaW5zdGFuY2UgaXMgY3JlYXRlZCBmb3IgZWFjaCBkcmF3YWJsZSBjbGFzcyB0aGF0IHRoZSBkcmF3ZXIgY2FuXG4vLyBzdXBwb3J0LCB3aGljaCBjb250YWlucyBhbGwgdGhlIHNldHRpbmdzIG5lZWRlZCBmb3IgZGVidWctZHJhd2luZy5cbi8vXG4vLyBXaGVuIGEgZHJhd2FibGUgb2JqZWN0IGRvZXMgbm90IGhhdmUgYSBgRGVidWdSb3V0aW5lYCBzZXR1cCwgY2FsbGluZ1xuLy8gYGRlYnVnKClgIHNpbXBseSBjYWxscyBgZHJhdygpYCB3aXRoIHRoZSBkZWJ1ZyBzdHlsZSBhcHBsaWVkLlxuY2xhc3MgRGVidWdSb3V0aW5lIHtcblxuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRlYnVnRnVuY3Rpb24pIHtcbiAgICAvLyBDbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbnRhaW5lZCBzZXR0aW5ncy5cbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG5cbiAgICAvLyBEZWJ1ZyBmdW5jdGlvbiBmb3Igb2JqZWN0cyBvZiB0eXBlIGBjbGFzc09iamAgd2l0aCB0aGUgc2lnbmF0dXJlOlxuICAgIC8vIGBkZWJ1Z0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcywgZHJhd3NUZXh0KWBcbiAgICAvLyArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAgIC8vICsgYG9iamVjdE9mQ2xhc3M6IGNsYXNzT2JqYCAtIEluc3RhbmNlIG9mIGBjbGFzc09iamAgdG8gZGVidWdcbiAgICAvLyArIGBkcmF3c1RleHQ6IGJvb2xgIC0gV2hlbiBgdHJ1ZWAgdGV4dCBzaG91bGQgYmUgZHJhd24gd2l0aFxuICAgIC8vICAgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICAvL1xuICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBpbnRlbmRlZCB0byBwZXJmb3JtIGRlYnVnLWRyYXdpbmcgdXNpbmcgYGRyYXdlci5wNWBcbiAgICAvLyBmdW5jdGlvbnMgb3IgY2FsbGluZyBgZHJhdygpYCBpbiBvdGhlciBkcmF3YWJsZSBvYmplY3RzLiBUaGUgZGVidWdcbiAgICAvLyBzdHlsZSBpcyBwdXNoZWQgYmVmb3JlaGFuZCBhbmQgcG9wcGVkIGFmdGVyd2FyZHMuXG4gICAgLy9cbiAgICAvLyBJbiBnZW5lcmFsIGl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlIGBkcmF3RnVuY3Rpb25gIHBlZm9ybXMgbm8gY2hhbmdlc1xuICAgIC8vIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzIGluIG9yZGVyIGZvciBlYWNoIGRyYXdpbmcgY2FsbCB0byB1c2Ugb25seSBhXG4gICAgLy8gc2luZ2xlIGBwdXNoL3BvcGAgd2hlbiBuZWNlc3NhcnkuXG4gICAgLy9cbiAgICB0aGlzLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICB9IC8vIGNvbnN0cnVjdG9yXG5cbn1cblxuXG5jbGFzcyBBcHBseVJvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5hcHBseUZ1bmN0aW9uID0gYXBwbHlGdW5jdGlvbjtcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFBvaW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBQb2ludGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5Qb2ludC5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqL1xuICBSYWMuUG9pbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLmRyYXdlci5wNS52ZXJ0ZXgodGhpcy54LCB0aGlzLnkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyLlxuICAqXG4gICogQWRkZWQgdG8gYHJhYy5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIHBvaW50ZXJcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUG9pbnQjXG4gICovXG4gIHJhYy5Qb2ludC5wb2ludGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1Lm1vdXNlWCwgcmFjLmRyYXdlci5wNS5tb3VzZVkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAgKlxuICAqIEFkZGVkIHRvIGByYWMuUG9pbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNDZW50ZXJcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUG9pbnQjXG4gICovXG4gIHJhYy5Qb2ludC5jYW52YXNDZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgvMiwgcmFjLmRyYXdlci5wNS5oZWlnaHQvMik7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGVuZCBvZiB0aGUgY2FudmFzLCB0aGF0IGlzLCBhdCB0aGUgcG9zaXRpb25cbiAgKiBgKHdpZHRoLGhlaWdodClgLlxuICAqXG4gICogQWRkZWQgdG8gYHJhYy5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0VuZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG59IC8vIGF0dGFjaFBvaW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmF5RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSByYXkgdG91Y2hlcyB0aGUgY2FudmFzIGVkZ2UuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCByZXR1cm5zIGBudWxsYFxuICAqIHNpbmNlIG5vIHBvaW50IGluIHRoZSBjYW52YXMgaXMgcG9zc2libGUuXG4gICpcbiAgKiBBZGRlZCB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5wb2ludEF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBsZXQgZWRnZVJheSA9IHRoaXMucmF5QXRDYW52YXNFZGdlKG1hcmdpbik7XG4gICAgaWYgKGVkZ2VSYXkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkZ2VSYXkuc3RhcnQ7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IHRoZSBwb2ludCB3aGVyZSB0aGUgYHRoaXNgIHRvdWNoZXNcbiAgKiB0aGUgY2FudmFzIGVkZ2UgYW5kIHBvaW50ZWQgdG93YXJkcyB0aGUgaW5zaWRlIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCByZXR1cm5zIGBudWxsYFxuICAqIHNpbmNlIG5vIHBvaW50IGluIHRoZSBjYW52YXMgaXMgcG9zc2libGUuXG4gICpcbiAgKiBBZGRlZCB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMgez9SYWMuUmF5fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5yYXlBdENhbnZhc0VkZ2UgPSBmdW5jdGlvbihtYXJnaW4gPSAwKSB7XG4gICAgY29uc3QgdHVybiA9IHRoaXMuYW5nbGUudHVybjtcbiAgICBjb25zdCBwNSA9IHRoaXMucmFjLmRyYXdlci5wNTtcblxuICAgIGNvbnN0IGRvd25FZGdlICA9IHA1LmhlaWdodCAtIG1hcmdpbjtcbiAgICBjb25zdCBsZWZ0RWRnZSAgPSBtYXJnaW47XG4gICAgY29uc3QgdXBFZGdlICAgID0gbWFyZ2luO1xuICAgIGNvbnN0IHJpZ2h0RWRnZSA9IHA1LndpZHRoIC0gbWFyZ2luO1xuXG4gICAgLy8gcG9pbnRpbmcgZG93blxuICAgIGlmICh0dXJuID49IDEvOCAmJiB0dXJuIDwgMy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55IDwgZG93bkVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyBsZWZ0XG4gICAgaWYgKHR1cm4gPj0gMy84ICYmIHR1cm4gPCA1LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnggPj0gbGVmdEVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnkgPiBkb3duRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueSA8IHVwRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyB1cFxuICAgIGlmICh0dXJuID49IDUvOCAmJiB0dXJuIDwgNy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55ID49IHVwRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHJpZ2h0XG4gICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgIGlmICh0aGlzLnN0YXJ0LnggPCByaWdodEVkZ2UpIHtcbiAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkZ2VSYXk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUmF5RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoU2VnbWVudEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCB0byByZXByZXNlbnQgdGhpcyBgU2VnbWVudGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5TZWdtZW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5TZWdtZW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0UG9pbnQoKS52ZXJ0ZXgoKTtcbiAgICB0aGlzLmVuZFBvaW50KCkudmVydGV4KCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSB0b3Agb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdCB0b1xuICAqIHRvcC1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgcmFjLlNlZ21lbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc1RvcFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNUb3AgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50Lnplcm9cbiAgICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUucmlnaHQsIHJhYy5kcmF3ZXIucDUud2lkdGgpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTZWdtZW50YCB0aGF0IGNvdmVycyB0aGUgbGVmdCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1sZWZ0XG4gICogdG8gYm90dG9tLWxlZnQuXG4gICpcbiAgKiBBZGRlZCAgdG8gYHJhYy5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNMZWZ0XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0xlZnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50Lnplcm9cbiAgICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuZG93biwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTZWdtZW50YCB0aGF0IGNvdmVycyB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtcmlnaHRcbiAgKiB0byBib3R0b20tcmlnaHQuXG4gICpcbiAgKiBBZGRlZCAgdG8gYHJhYy5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNSaWdodFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgsIDApO1xuICAgIHJldHVybiB0b3BSaWdodFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhcywgZnJvbVxuICAqIGJvdHRvbS1sZWZ0IHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgcmFjLlNlZ21lbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0JvdHRvbVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNCb3R0b20gPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgYm90dG9tTGVmdCA9IHJhYy5Qb2ludCgwLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gICAgcmV0dXJuIGJvdHRvbUxlZnRcbiAgICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUucmlnaHQsIHJhYy5kcmF3ZXIucDUud2lkdGgpO1xuICB9O1xuXG5cblxufSAvLyBhdHRhY2hTZWdtZW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vLyBDcmVhdGVzIGFuZCByZXN0b3JlcyB0aGUgZHJhd2luZyBjb250ZXh0IGZvciBhIGRhc2hlZCBzdHJva2Ugd2hpbGVcbi8vIGBjbG9zdXJlYCBpcyBjYWxsZWQuXG5mdW5jdGlvbiBkYXNoZWREcmF3KGRyYXdlciwgc2VnbWVudCwgY2xvc3VyZSkge1xuICBjb25zdCBjb250ZXh0ID0gZHJhd2VyLnA1LmRyYXdpbmdDb250ZXh0O1xuICBjb250ZXh0LnNhdmUoKTtcbiAgY29udGV4dC5saW5lQ2FwID0gJ2J1dHQnO1xuICBjb250ZXh0LnNldExpbmVEYXNoKHNlZ21lbnQpO1xuICBjbG9zdXJlKCk7XG4gIGNvbnRleHQucmVzdG9yZSgpO1xufVxuXG5cbmV4cG9ydHMuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGRyYXdlciwgYW5nbGUsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgLy8gWmVybyBzZWdtZW50XG4gIHBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS56ZXJvLCBtYXJrZXJSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBBbmdsZSBzZWdtZW50XG4gIGxldCBhbmdsZVNlZ21lbnQgPSBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhbmdsZSwgbWFya2VyUmFkaXVzICogMS41KTtcbiAgYW5nbGVTZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKHBvaW50UmFkaXVzLCBhbmdsZSwgYW5nbGUuaW52ZXJzZSgpLCBmYWxzZSlcbiAgICAuZHJhdygpO1xuICBhbmdsZVNlZ21lbnRcbiAgICAud2l0aExlbmd0aEFkZChwb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIE1pbmkgYW5nbGUgYXJjIG1hcmtlcnNcbiAgbGV0IGFuZ2xlQXJjID0gcG9pbnQuYXJjKG1hcmtlclJhZGl1cywgcmFjLkFuZ2xlLnplcm8sIGFuZ2xlKTtcbiAgZGFzaGVkRHJhdyhkcmF3ZXIsIFs2LCA0XSwgKCk9PnsgYW5nbGVBcmMuZHJhdygpOyB9KTtcblxuICAvLyBPdXRzaWRlIGFuZ2xlIGFyY1xuICBpZiAoIWFuZ2xlQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBsZXQgb3V0c2lkZUFuZ2xlQXJjID0gYW5nbGVBcmNcbiAgICAgIC53aXRoUmFkaXVzKG1hcmtlclJhZGl1cyozLzQpXG4gICAgICAud2l0aENsb2Nrd2lzZShmYWxzZSk7XG4gICAgZGFzaGVkRHJhdyhkcmF3ZXIsIFsyLCA0XSwgKCk9Pnsgb3V0c2lkZUFuZ2xlQXJjLmRyYXcoKTsgfSk7XG4gIH1cblxuICAvLyBEZWJ1ZyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHJldHVybjtcblxuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChyYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcixcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUsXG4gICAgbWFya2VyUmFkaXVzKjIsIDApO1xuXG4gIC8vIFR1cm4gdGV4dFxuICBsZXQgdHVyblN0cmluZyA9IGB0dXJuOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcG9pbnQudGV4dCh0dXJuU3RyaW5nLCBmb3JtYXQpXG4gICAgLnVwcmlnaHQoKVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z0FuZ2xlXG5cblxuZXhwb3J0cy5kZWJ1Z1BvaW50ID0gZnVuY3Rpb24oZHJhd2VyLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIHBvaW50LmRyYXcoKTtcblxuICAvLyBQb2ludCBtYXJrZXJcbiAgcG9pbnQuYXJjKHBvaW50UmFkaXVzKS5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgcmV0aWN1bGUgbWFya2VyXG4gIGxldCBhcmMgPSBwb2ludFxuICAgIC5hcmMobWFya2VyUmFkaXVzLCByYWMuQW5nbGUucywgcmFjLkFuZ2xlLmUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLnN0YXJ0U2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5lbmRTZWdtZW50KClcbiAgICAucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygxLzIpXG4gICAgLmRyYXcoKTtcblxuICAvLyBEZWJ1ZyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHJldHVybjtcblxuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCxcbiAgICByYWMuQW5nbGUuZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUsXG4gICAgcG9pbnRSYWRpdXMsIHBvaW50UmFkaXVzKTtcblxuICBsZXQgc3RyaW5nID0gYHg6JHtwb2ludC54LnRvRml4ZWQoZGlnaXRzKX1cXG55OiR7cG9pbnQueS50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcG9pbnQudGV4dChzdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdQb2ludFxuXG5cbi8vIFNoYXJlZCB0ZXh0IGRyYXdpbmcgZm9yIHJheSBhbmQgc2VnbWVudFxuZnVuY3Rpb24gZHJhd1JheVRleHRzKGRyYXdlciwgcmF5LCB0b3BTdHJpbmcsIGJvdHRvbVN0cmluZykge1xuICBjb25zdCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGNvbnN0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gIGNvbnN0IGZvbnQgICAgICAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udDtcbiAgY29uc3Qgc2l6ZSAgICAgICAgPSBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplO1xuICBjb25zdCBwb2ludFJhZGl1cyA9IGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuXG4gIGxldCB0b3BGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIGRyYXdlci5yYWMsXG4gICAgaEVudW0ubGVmdCwgdkVudW0uYm90dG9tLFxuICAgIHJheS5hbmdsZSwgZm9udCwgc2l6ZSxcbiAgICBwb2ludFJhZGl1cywgcG9pbnRSYWRpdXMpO1xuICBsZXQgYm90dG9tRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICBkcmF3ZXIucmFjLFxuICAgIGhFbnVtLmxlZnQsIHZFbnVtLnRvcCxcbiAgICByYXkuYW5nbGUsIGZvbnQsIHNpemUsXG4gICAgcG9pbnRSYWRpdXMsIHBvaW50UmFkaXVzKTtcblxuICAvLyBUZXh0c1xuICByYXkudGV4dCh0b3BTdHJpbmcsIHRvcEZvcm1hdClcbiAgICAudXByaWdodCgpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgcmF5LnRleHQoYm90dG9tU3RyaW5nLCBib3R0b21Gb3JtYXQpXG4gICAgLnVwcmlnaHQoKVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59O1xuXG5cbmV4cG9ydHMuZGVidWdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9IGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICByYXkuZHJhdygpO1xuXG4gIC8vIExpdHRsZSBjaXJjbGUgYXQgc3RhcnQgbWFya2VyXG4gIHJheS5zdGFydC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBhdCBzdGFydFxuICBjb25zdCBwZXJwQW5nbGUgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICBjb25zdCBzdGFydEFyYyA9IHJheS5zdGFydFxuICAgIC5hcmMobWFya2VyUmFkaXVzLCBwZXJwQW5nbGUsIHBlcnBBbmdsZS5pbnZlcnNlKCkpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRWRnZSBlbmQgaGFsZiBjaXJjbGVcbiAgY29uc3QgZWRnZVJheSA9IHJheS5yYXlBdENhbnZhc0VkZ2UoKTtcbiAgaWYgKGVkZ2VSYXkgIT0gbnVsbCkge1xuICAgIGNvbnN0IGVkZ2VBcmMgPSBlZGdlUmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cylcbiAgICAgIC5wZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgICAgLmFyY1RvQW5nbGVEaXN0YW5jZShtYXJrZXJSYWRpdXMvMiwgMC41KVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gICAgZWRnZUFyYy5lbmRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnJhZGl1c1NlZ21lbnRBdEFuZ2xlKGVkZ2VSYXkuYW5nbGUpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBEZWJ1ZyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHJldHVybjtcblxuICBjb25zdCBkaWdpdHMgPSBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcbiAgY29uc3Qgc3RhcnRTdHJpbmcgPSBgc3RhcnQ6KCR7cmF5LnN0YXJ0LngudG9GaXhlZChkaWdpdHMpfSwke3JheS5zdGFydC55LnRvRml4ZWQoZGlnaXRzKX0pYDtcbiAgY29uc3QgYW5nbGVTdHJpbmcgPSBgYW5nbGU6JHtyYXkuYW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgZHJhd1JheVRleHRzKGRyYXdlciwgcmF5LCBzdGFydFN0cmluZywgYW5nbGVTdHJpbmcpO1xufTsgLy8gZGVidWdSYXlcblxuXG5leHBvcnRzLmRlYnVnU2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG5cbiAgc2VnbWVudC5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgc2VnbWVudC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5hcmMoKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gSGFsZiBjaXJjbGUgc3RhcnQgc2VnbWVudFxuICBsZXQgcGVycEFuZ2xlID0gc2VnbWVudC5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoKTtcbiAgbGV0IGFyYyA9IHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIFBlcnBlbmRpY3VsYXIgZW5kIG1hcmtlclxuICBsZXQgZW5kTWFya2VyU3RhcnQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcigpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGVuZE1hcmtlckVuZCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgIC53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy8yKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oLXBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIC8vIExpdHRsZSBlbmQgaGFsZiBjaXJjbGVcbiAgc2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgZW5kTWFya2VyU3RhcnQuYW5nbGUoKSwgZW5kTWFya2VyRW5kLmFuZ2xlKCkpXG4gICAgLmRyYXcoKTtcblxuICAvLyBGb3JtaW5nIGVuZCBhcnJvd1xuICBsZXQgYXJyb3dBbmdsZVNoaWZ0ID0gcmFjLkFuZ2xlLmZyb20oMS83KTtcbiAgbGV0IGVuZEFycm93U3RhcnQgPSBlbmRNYXJrZXJTdGFydFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgZmFsc2UpO1xuICBsZXQgZW5kQXJyb3dFbmQgPSBlbmRNYXJrZXJFbmRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIHRydWUpO1xuICBsZXQgZW5kQXJyb3dQb2ludCA9IGVuZEFycm93U3RhcnRcbiAgICAucG9pbnRBdEludGVyc2VjdGlvbihlbmRBcnJvd0VuZCk7XG4gIC8vIEVuZCBhcnJvd1xuICBlbmRNYXJrZXJTdGFydFxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kQXJyb3dQb2ludClcbiAgICAuZHJhdygpXG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRNYXJrZXJFbmQuZW5kUG9pbnQoKSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgcmV0dXJuO1xuXG4gIGNvbnN0IGRpZ2l0cyA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuICBsZXQgbGVuZ3RoU3RyaW5nID0gYGxlbmd0aDoke3NlZ21lbnQubGVuZ3RoLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgYW5nbGVTdHJpbmcgID0gYGFuZ2xlOiR7c2VnbWVudC5yYXkuYW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgZHJhd1JheVRleHRzKGRyYXdlciwgc2VnbWVudC5yYXksIGxlbmd0aFN0cmluZywgYW5nbGVTdHJpbmcpO1xufTsgLy8gZGVidWdTZWdtZW50XG5cblxuZXhwb3J0cy5kZWJ1Z0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjLCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICBhcmMuZHJhdygpO1xuXG4gIC8vIENlbnRlciBtYXJrZXJzXG4gIGxldCBjZW50ZXJBcmNSYWRpdXMgPSBtYXJrZXJSYWRpdXMgKiAyLzM7XG4gIGlmIChhcmMucmFkaXVzID4gbWFya2VyUmFkaXVzLzMgJiYgYXJjLnJhZGl1cyA8IG1hcmtlclJhZGl1cykge1xuICAgIC8vIElmIHJhZGl1cyBpcyB0b28gY2xvc2UgdG8gdGhlIGNlbnRlci1hcmMgbWFya2Vyc1xuICAgIC8vIE1ha2UgdGhlIGNlbnRlci1hcmMgYmUgb3V0c2lkZSBvZiB0aGUgYXJjXG4gICAgY2VudGVyQXJjUmFkaXVzID0gYXJjLnJhZGl1cyArIG1hcmtlclJhZGl1cy8zO1xuICB9XG5cbiAgLy8gQ2VudGVyIHN0YXJ0IHNlZ21lbnRcbiAgbGV0IGNlbnRlckFyYyA9IGFyYy53aXRoUmFkaXVzKGNlbnRlckFyY1JhZGl1cyk7XG4gIGNlbnRlckFyYy5zdGFydFNlZ21lbnQoKS5kcmF3KCk7XG5cbiAgLy8gUmFkaXVzXG4gIGxldCByYWRpdXNNYXJrZXJMZW5ndGggPSBhcmMucmFkaXVzXG4gICAgLSBjZW50ZXJBcmNSYWRpdXNcbiAgICAtIG1hcmtlclJhZGl1cy8yXG4gICAgLSBwb2ludFJhZGl1cyoyO1xuICBpZiAocmFkaXVzTWFya2VyTGVuZ3RoID4gMCkge1xuICAgIGFyYy5zdGFydFNlZ21lbnQoKVxuICAgICAgLndpdGhMZW5ndGgocmFkaXVzTWFya2VyTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGNlbnRlckFyY1JhZGl1cyArIHBvaW50UmFkaXVzKjIpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gSW5zaWRlIGFuZ2xlIGFyYyAtIGJpZyBkYXNoZXNcbiAgZGFzaGVkRHJhdyhkcmF3ZXIsIFs2LCA0XSwgKCk9PnsgY2VudGVyQXJjLmRyYXcoKTsgfSk7XG5cbiAgLy8gT3V0c2lkZSBhbmdsZSBhcmMgLSBzbWFsbCBkYXNoZXNcbiAgaWYgKCFjZW50ZXJBcmMuaXNDaXJjbGUoKSkge1xuICAgIGxldCBvdXRzaWRlQW5nbGVBcmMgPSBjZW50ZXJBcmNcbiAgICAgIC53aXRoQ2xvY2t3aXNlKCFjZW50ZXJBcmMuY2xvY2t3aXNlKTtcbiAgICBkYXNoZWREcmF3KGRyYXdlciwgWzIsIDRdLCAoKT0+eyBvdXRzaWRlQW5nbGVBcmMuZHJhdygpOyB9KTtcbiAgfVxuXG4gIC8vIENlbnRlciBlbmQgc2VnbWVudFxuICBpZiAoIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgY2VudGVyQXJjLmVuZFNlZ21lbnQoKS5yZXZlcnNlKCkud2l0aExlbmd0aFJhdGlvKDEvMikuZHJhdygpO1xuICB9XG5cbiAgLy8gU3RhcnQgcG9pbnQgbWFya2VyXG4gIGxldCBzdGFydFBvaW50ID0gYXJjLnN0YXJ0UG9pbnQoKTtcbiAgc3RhcnRQb2ludFxuICAgIC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcbiAgc3RhcnRQb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhcmMuc3RhcnQsIG1hcmtlclJhZGl1cylcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKC1tYXJrZXJSYWRpdXMvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIE9yaWVudGF0aW9uIG1hcmtlclxuICBsZXQgb3JpZW50YXRpb25MZW5ndGggPSBtYXJrZXJSYWRpdXMqMjtcbiAgbGV0IG9yaWVudGF0aW9uQXJjID0gYXJjXG4gICAgLnN0YXJ0U2VnbWVudCgpXG4gICAgLndpdGhMZW5ndGhBZGQobWFya2VyUmFkaXVzKVxuICAgIC5hcmMobnVsbCwgYXJjLmNsb2Nrd2lzZSlcbiAgICAud2l0aExlbmd0aChvcmllbnRhdGlvbkxlbmd0aClcbiAgICAuZHJhdygpO1xuICBsZXQgYXJyb3dDZW50ZXIgPSBvcmllbnRhdGlvbkFyY1xuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aChtYXJrZXJSYWRpdXMvMilcbiAgICAuY2hvcmRTZWdtZW50KCk7XG4gIGxldCBhcnJvd0FuZ2xlID0gMy8zMjtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoLWFycm93QW5nbGUpLmRyYXcoKTtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZSkuZHJhdygpO1xuXG4gIC8vIEludGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IGVuZFBvaW50ID0gYXJjLmVuZFBvaW50KCk7XG4gIGxldCBpbnRlcm5hbExlbmd0aCA9IE1hdGgubWluKG1hcmtlclJhZGl1cy8yLCBhcmMucmFkaXVzKTtcbiAgaW50ZXJuYWxMZW5ndGggLT0gcG9pbnRSYWRpdXM7XG4gIGlmIChpbnRlcm5hbExlbmd0aCA+IHJhYy5lcXVhbGl0eVRocmVzaG9sZCkge1xuICAgIGVuZFBvaW50XG4gICAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZC5pbnZlcnNlKCksIGludGVybmFsTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIEV4dGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IHRleHRKb2luVGhyZXNob2xkID0gbWFya2VyUmFkaXVzKjM7XG4gIGxldCBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID0gb3JpZW50YXRpb25BcmNcbiAgICAud2l0aEVuZChhcmMuZW5kKVxuICAgIC5sZW5ndGgoKTtcbiAgbGV0IGV4dGVybmFsTGVuZ3RoID0gbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkICYmIGRyYXdzVGV4dCA9PT0gdHJ1ZVxuICAgID8gbWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXNcbiAgICA6IG1hcmtlclJhZGl1cy8yIC0gcG9pbnRSYWRpdXM7XG5cbiAgZW5kUG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZCwgZXh0ZXJuYWxMZW5ndGgpXG4gICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRW5kIHBvaW50IGxpdHRsZSBhcmNcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGVuZFBvaW50XG4gICAgICAuYXJjKHBvaW50UmFkaXVzLCBhcmMuZW5kLCBhcmMuZW5kLmludmVyc2UoKSwgYXJjLmNsb2Nrd2lzZSlcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBEZWJ1ZyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHJldHVybjtcblxuICBjb25zdCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGNvbnN0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gIGNvbnN0IGZvbnQgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQ7XG4gIGNvbnN0IHNpemUgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemU7XG4gIGNvbnN0IGRpZ2l0cyA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIGxldCBoZWFkVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2RW51bS50b3BcbiAgICA6IHZFbnVtLmJvdHRvbTtcbiAgbGV0IHRhaWxWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLmJvdHRvbVxuICAgIDogdkVudW0udG9wO1xuICBsZXQgcmFkaXVzVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2RW51bS5ib3R0b21cbiAgICA6IHZFbnVtLnRvcDtcblxuICBsZXQgaGVhZEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhFbnVtLmxlZnQsIGhlYWRWZXJ0aWNhbCxcbiAgICBhcmMuc3RhcnQsXG4gICAgZm9udCwgc2l6ZSxcbiAgICBwb2ludFJhZGl1cywgMCk7XG4gIGxldCB0YWlsRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChyYWMsXG4gICAgaEVudW0ubGVmdCwgdGFpbFZlcnRpY2FsLFxuICAgIGFyYy5lbmQsXG4gICAgZm9udCwgc2l6ZSxcbiAgICBwb2ludFJhZGl1cywgMCk7XG4gIGxldCByYWRpdXNGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRW51bS5sZWZ0LCByYWRpdXNWZXJ0aWNhbCxcbiAgICBhcmMuc3RhcnQsXG4gICAgZm9udCwgc2l6ZSxcbiAgICBtYXJrZXJSYWRpdXMsIHBvaW50UmFkaXVzKTtcblxuICBsZXQgc3RhcnRTdHJpbmcgID0gYHN0YXJ0OiR7YXJjLnN0YXJ0LnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCByYWRpdXNTdHJpbmcgPSBgcmFkaXVzOiR7YXJjLnJhZGl1cy50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IGVuZFN0cmluZyAgICA9IGBlbmQ6JHthcmMuZW5kLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhcmMuYW5nbGVEaXN0YW5jZSgpO1xuICBsZXQgZGlzdGFuY2VTdHJpbmcgPSBgZGlzdGFuY2U6JHthbmdsZURpc3RhbmNlLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IHRhaWxTdHJpbmcgPSBgJHtkaXN0YW5jZVN0cmluZ31cXG4ke2VuZFN0cmluZ31gO1xuICBsZXQgaGVhZFN0cmluZztcblxuICAvLyBSYWRpdXMgbGFiZWxcbiAgY29uc3QgZW5kSXNBd2F5ID0gYW5nbGVEaXN0YW5jZS50dXJuIDw9IDMvNCB8fCBhbmdsZURpc3RhbmNlLmVxdWFscygzLzQpO1xuICBpZiAoZW5kSXNBd2F5ICYmICFhcmMuaXNDaXJjbGUoKSkge1xuICAgIC8vIFJhZGl1cyBkcmF3biBzZXBhcmF0ZWx5XG4gICAgaGVhZFN0cmluZyA9IHN0YXJ0U3RyaW5nO1xuICAgIGFyYy5jZW50ZXJcbiAgICAgIC50ZXh0KHJhZGl1c1N0cmluZywgcmFkaXVzRm9ybWF0KVxuICAgICAgLnVwcmlnaHQoKVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICB9IGVsc2Uge1xuICAgIC8vIFJhZGl1cyBqb2luZWQgdG8gaGVhZFxuICAgIGhlYWRTdHJpbmcgPSBgJHtzdGFydFN0cmluZ31cXG4ke3JhZGl1c1N0cmluZ31gO1xuICB9XG5cbiAgaWYgKGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCkge1xuICAgIC8vIERyYXcgaGVhZCBhbmQgdGFpbCBzZXBhcmF0ZWx5XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAudGV4dChoZWFkU3RyaW5nLCBoZWFkRm9ybWF0KVxuICAgICAgLnVwcmlnaHQoKVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBvcmllbnRhdGlvbkFyYy5wb2ludEF0QW5nbGUoYXJjLmVuZClcbiAgICAgIC50ZXh0KHRhaWxTdHJpbmcsIHRhaWxGb3JtYXQpXG4gICAgICAudXByaWdodCgpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIERyYXcgaGVhZCBhbmQgdGFpbCB0b2dldGhlclxuICAgIGxldCBib3RoU3RyaW5ncyA9IGAke2hlYWRTdHJpbmd9XFxuJHt0YWlsU3RyaW5nfWA7XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAudGV4dChib3RoU3RyaW5ncywgaGVhZEZvcm1hdClcbiAgICAgIC51cHJpZ2h0KClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gIH1cbn07IC8vIGRlYnVnQXJjXG5cblxuZXhwb3J0cy5kZWJ1Z1RleHQgPSBmdW5jdGlvbihkcmF3ZXIsIHRleHQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBjb25zdCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGNvbnN0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG5cbiAgY29uc3QgZm9ybWF0ID0gdGV4dC5mb3JtYXQ7XG5cbiAgLy8gUG9pbnQgbWFya2VyXG4gIHRleHQucG9pbnQuYXJjKHBvaW50UmFkaXVzKS5kcmF3KCk7XG5cbiAgY29uc3QgY29ybmVyUmV0aWN1bGUgPSBmdW5jdGlvbihhbmdsZSwgcGFkZGluZywgcGVycFBhZGRpbmcsIHJvdGF0aW9uKSB7XG4gICAgcmFjLlBvaW50Lnplcm9cbiAgICAgIC5zZWdtZW50VG9BbmdsZShhbmdsZSwgbWFya2VyUmFkaXVzKVxuICAgICAgLnJldmVyc2UoKS53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy1wb2ludFJhZGl1cyoyKS5kcmF3KCkgLy8gbGluZSBhdCB0ZXh0IGVkZ2VcbiAgICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIocm90YXRpb24sIHBhZGRpbmcpLnB1c2goKSAvLyBlbGJvdyB0dXJuXG4gICAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKCFyb3RhdGlvbiwgcGVycFBhZGRpbmcpLmRyYXcoKSAvLyBsaW5lIGF0IG9yaWdpblxuICAgICAgLm5leHRTZWdtZW50V2l0aExlbmd0aChwb2ludFJhZGl1cyo0KVxuICAgICAgLm5leHRTZWdtZW50V2l0aExlbmd0aChtYXJrZXJSYWRpdXMtcG9pbnRSYWRpdXMqMikuZHJhdygpOyAvLyBvcHBvc2l0ZSBzaWRlIGxpbmVcbiAgICAgIC8vIERhc2hlZCBlbGJvdyB0dXJuXG4gICAgICBkYXNoZWREcmF3KGRyYXdlciwgWzUsIDJdLCAoKT0+eyByYWMucG9wU3RhY2soKS5kcmF3KCk7IH0pO1xuICB9O1xuXG4gIGNvbnN0IGNlbnRlclJldGljdWxlID0gZnVuY3Rpb24oYW5nbGUsIHBhZGRpbmcsIHBlcnBQYWRkaW5nLCByb3RhdGlvbikge1xuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIC8vIGxpbmVzIGF0IGVkZ2Ugb2YgdGV4dFxuICAgIHJhYy5Qb2ludC56ZXJvXG4gICAgICAucmF5KGFuZ2xlLnBlcnBlbmRpY3VsYXIocm90YXRpb24pKVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UocG9pbnRSYWRpdXMqMilcbiAgICAgIC5zZWdtZW50KG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzKjIpLmRyYXcoKTtcbiAgICBsZXQgcmV0aWN1bGVDZW50ZXIgPSByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLmludmVyc2UoKSwgcGFkZGluZylcbiAgICAgIC5wdXNoKCkgLy8gZGFzaGVkIGxpbmUgdG8gZWxib3dcbiAgICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIocm90YXRpb24sIHBvaW50UmFkaXVzKVxuICAgICAgLnJldmVyc2UoKS5kcmF3KCkgLy8gZWxib3cgbWFya1xuICAgICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihyb3RhdGlvbiwgcG9pbnRSYWRpdXMpXG4gICAgICAucmV2ZXJzZSgpLmRyYXcoKSAvLyBlbGJvdyBtYXJrXG4gICAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHJvdGF0aW9uLCBwZXJwUGFkZGluZylcbiAgICAgIC5wdXNoKCkgLy8gZGFzaGVkIGxpbmUgdG8gY2VudGVyXG4gICAgICAuZW5kUG9pbnQoKTtcbiAgICBkYXNoZWREcmF3KGRyYXdlciwgWzUsIDJdLCAoKT0+e1xuICAgICAgcmFjLnBvcFN0YWNrKCkuZHJhdygpO1xuICAgICAgcmFjLnBvcFN0YWNrKCkuZHJhdygpO1xuICAgIH0pO1xuXG4gICAgLy8gbGluZXMgYXJvdW5kIHJldGljdWxlIGNlbnRlclxuICAgIHJldGljdWxlQ2VudGVyLnJheShhbmdsZS5pbnZlcnNlKCkpXG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cyoyKVxuICAgICAgLnNlZ21lbnQobWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXMqMikuZHJhdygpO1xuICAgIHJldGljdWxlQ2VudGVyLnJheShhbmdsZS5wZXJwZW5kaWN1bGFyKCFyb3RhdGlvbikpXG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cyoyKVxuICAgICAgLnNlZ21lbnQobWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXMqMikuZHJhdygpO1xuICAgIGxldCBsYXN0Q2VudGVyTGluZSA9XG4gICAgICByZXRpY3VsZUNlbnRlci5yYXkoYW5nbGUpXG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cyoyKVxuICAgICAgLnNlZ21lbnQobWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXMqMikuZHJhdygpO1xuXG4gICAgaWYgKE1hdGguYWJzKHBlcnBQYWRkaW5nKSA8PSAyKSByZXR1cm47XG5cbiAgICAvLyBzaG9ydCBkYXNoZWQgbGluZXMgYmFjayB0byB0ZXh0IGVkZ2VcbiAgICBsYXN0Q2VudGVyTGluZVxuICAgICAgLm5leHRTZWdtZW50V2l0aExlbmd0aChwYWRkaW5nIC0gbWFya2VyUmFkaXVzKVxuICAgICAgLnB1c2goKVxuICAgICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcighcm90YXRpb24sIGZvcm1hdC5oUGFkZGluZylcbiAgICAgIC5wdXNoKCk7XG4gICAgZGFzaGVkRHJhdyhkcmF3ZXIsIFsyLCAzXSwgKCk9PntcbiAgICAgIHJhYy5wb3BTdGFjaygpLmRyYXcoKTtcbiAgICAgIHJhYy5wb3BTdGFjaygpLmRyYXcoKTtcbiAgICB9KTtcbiAgfTtcblxuICBkcmF3ZXIucDUucHVzaCgpO1xuICAgIGZvcm1hdC5hcHBseSh0ZXh0LnBvaW50KTtcbiAgICBzd2l0Y2ggKGZvcm1hdC5oQWxpZ24pIHtcbiAgICAgIGNhc2UgaEVudW0ubGVmdDpcbiAgICAgICAgc3dpdGNoIChmb3JtYXQudkFsaWduKSB7XG4gICAgICAgICAgY2FzZSB2RW51bS50b3A6XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgwLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgxLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uY2VudGVyOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMC80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMC80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTpcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDAvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMy80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgaEVudW0uY2VudGVyOlxuICAgICAgICBzd2l0Y2ggKGZvcm1hdC52QWxpZ24pIHtcbiAgICAgICAgICBjYXNlIHZFbnVtLnRvcDpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDEvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uY2VudGVyOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMS80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5iYXNlbGluZTpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDEvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uYm90dG9tOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMy80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBoRW51bS5yaWdodDpcbiAgICAgICAgc3dpdGNoIChmb3JtYXQudkFsaWduKSB7XG4gICAgICAgICAgY2FzZSB2RW51bS50b3A6XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgyLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDEvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uY2VudGVyOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMi80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5iYXNlbGluZTpcbiAgICAgICAgICAgIGNlbnRlclJldGljdWxlKDIvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uYm90dG9tOlxuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMi80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMy80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIGRyYXdlci5wNS5wb3AoKTtcblxuICAvLyBUZXh0IG9iamVjdFxuICB0ZXh0LmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAvLyBEZWJ1ZyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgY29uc3QgZml4ID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKGRpZ2l0cyk7XG4gIH07XG5cbiAgbGV0IHN0cmluZ1BhID0gYHA6KCR7Zml4KHRleHQucG9pbnQueCl9LCR7Zml4KHRleHQucG9pbnQueSl9KSBhOiR7Zml4KGZvcm1hdC5hbmdsZS50dXJuKX1gO1xuICBsZXQgc3RyaW5nQWwgPSBgYWw6JHtmb3JtYXQuaEFsaWdufSwke2Zvcm1hdC52QWxpZ259YDtcbiAgbGV0IHN0cmluZ1BhZCA9IGBwYToke2ZpeChmb3JtYXQuaFBhZGRpbmcpfSwke2ZpeChmb3JtYXQudlBhZGRpbmcpfWA7XG4gIGxldCBkZWJ1Z1N0cmluZyA9IGAke3N0cmluZ1BhfVxcbiR7c3RyaW5nQWx9XFxuJHtzdHJpbmdQYWR9YDtcblxuICBsZXQgZGVidWdGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBoRW51bS5yaWdodCwgdkVudW0uYm90dG9tLFxuICAgIHJhYy5BbmdsZS56ZXJvLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSxcbiAgICBwb2ludFJhZGl1cywgcG9pbnRSYWRpdXMpO1xuICB0ZXh0LnBvaW50LnRleHQoYCR7ZGVidWdTdHJpbmd9YCwgZGVidWdGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnVGV4dFxuXG5cbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgQmV6aWVyXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIENvbXBvc2l0ZVxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBTaGFwZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuZXhwb3J0cy5kcmF3UG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50KSB7XG4gIGRyYXdlci5wNS5wb2ludChwb2ludC54LCBwb2ludC55KTtcbn07IC8vIGRyYXdQb2ludFxuXG5cbmV4cG9ydHMuZHJhd1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5KSB7XG4gIGxldCBlZGdlUG9pbnQgPSByYXkucG9pbnRBdENhbnZhc0VkZ2UoKTtcblxuICBpZiAoZWRnZVBvaW50ID09PSBudWxsKSB7XG4gICAgLy8gUmF5IGlzIG91dHNpZGUgY2FudmFzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZHJhd2VyLnA1LmxpbmUoXG4gICAgcmF5LnN0YXJ0LngsIHJheS5zdGFydC55LFxuICAgIGVkZ2VQb2ludC54LCBlZGdlUG9pbnQueSk7XG59OyAvLyBkcmF3UmF5XG5cblxuZXhwb3J0cy5kcmF3U2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCkge1xuICBjb25zdCBzdGFydCA9IHNlZ21lbnQucmF5LnN0YXJ0O1xuICBjb25zdCBlbmQgPSBzZWdtZW50LmVuZFBvaW50KCk7XG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHN0YXJ0LngsIHN0YXJ0LnksXG4gICAgZW5kLngsICAgZW5kLnkpO1xufTsgLy8gZHJhd1NlZ21lbnRcblxuXG5leHBvcnRzLmRyYXdBcmMgPSBmdW5jdGlvbihkcmF3ZXIsIGFyYykge1xuICBpZiAoYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBsZXQgc3RhcnRSYWQgPSBhcmMuc3RhcnQucmFkaWFucygpO1xuICAgIGxldCBlbmRSYWQgPSBzdGFydFJhZCArIFJhYy5UQVU7XG4gICAgZHJhd2VyLnA1LmFyYyhcbiAgICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgICAgc3RhcnRSYWQsIGVuZFJhZCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHN0YXJ0ID0gYXJjLnN0YXJ0O1xuICBsZXQgZW5kID0gYXJjLmVuZDtcbiAgaWYgKCFhcmMuY2xvY2t3aXNlKSB7XG4gICAgc3RhcnQgPSBhcmMuZW5kO1xuICAgIGVuZCA9IGFyYy5zdGFydDtcbiAgfVxuXG4gIGRyYXdlci5wNS5hcmMoXG4gICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgIHN0YXJ0LnJhZGlhbnMoKSwgZW5kLnJhZGlhbnMoKSk7XG59OyAvLyBkcmF3QXJjXG5cblxuZXhwb3J0cy5kcmF3VGV4dCA9IGZ1bmN0aW9uKGRyYXdlciwgdGV4dCkge1xuICAvLyBUZXh0IGRyYXdSb3V0aW5lIGlzIHNldHMgYHJlcXVpcmVzUHVzaFBvcGBcbiAgLy8gVGhpcyBgYXBwbHlgIGdldHMgcmV2ZXJ0ZWQgYXQgYHA1RHJhd2VyLmRyYXdPYmplY3RgXG4gIHRleHQuZm9ybWF0LmFwcGx5KHRleHQucG9pbnQpO1xuICBkcmF3ZXIucDUudGV4dCh0ZXh0LnN0cmluZywgMCwgMCk7XG59OyAvLyBkcmF3VGV4dFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29sb3Igd2l0aCBSQkdBIHZhbHVlcywgZWFjaCBvbmUgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4qXG4qICMjIyBgaW5zdGFuY2UuQ29sb3JgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuQ29sb3JgIGZ1bmN0aW9uXXtAbGluayBSYWMjQ29sb3J9IHRvIGNyZWF0ZSBgQ29sb3JgIG9iamVjdHMgd2l0aFxuKiBmZXdlciBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLkNvbG9yLnJlZGBde0BsaW5rIGluc3RhbmNlLkNvbG9yI3JlZH0sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLkNvbG9yYF17QGxpbmsgaW5zdGFuY2UuQ29sb3J9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBjb2xvciA9IG5ldyBSYWMuQ29sb3IocmFjLCAwLjIsIDAuNCwgMC42KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJDb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuKlxuKiBAc2VlIFtgcmFjLkNvbG9yYF17QGxpbmsgUmFjI0NvbG9yfVxuKiBAc2VlIFtgaW5zdGFuY2UuQ29sb3JgXXtAbGluayBpbnN0YW5jZS5Db2xvcn1cbipcbiogQGFsaWFzIFJhYy5Db2xvclxuKi9cbmNsYXNzIENvbG9yIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IFthPTFdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgciwgZywgYiwgYSA9IDEpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCByLCBnLCBiLCBhKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIociwgZywgYiwgYSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIHJlZCBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5yID0gcjtcblxuICAgIC8qKlxuICAgICogVGhlIGdyZWVuIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmcgPSBnO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYmx1ZSBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5iID0gYjtcblxuICAgIC8qKlxuICAgICogVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmEgPSBhO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLkNvbG9yKDAuMSwgMC4yLCAwLjMsIDAuNCkudG9TdHJpbmcoKVxuICAqIC8vIHJldHVybnM6ICdDb2xvcigwLjEsMC4yLDAuMywwLjQpJ1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgclN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnIsIGRpZ2l0cyk7XG4gICAgY29uc3QgZ1N0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmcsIGRpZ2l0cyk7XG4gICAgY29uc3QgYlN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmIsIGRpZ2l0cyk7XG4gICAgY29uc3QgYVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmEsIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBDb2xvcigke3JTdHJ9LCR7Z1N0cn0sJHtiU3RyfSwke2FTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJDb2xvcmAgZm9yIGVhY2ggY2hhbm5lbFxuICAqIGlzIHVuZGVyIFtgcmFjLmVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfTtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJDb2xvcmAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5Db2xvcmAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFZhbHVlcyBhcmUgY29tcGFyZWQgdXNpbmcgW2ByYWMudW5pdGFyeUVxdWFsc2Bde0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxzfS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSBvdGhlckNvbG9yIC0gQSBgQ29sb3JgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgcmFjLnVuaXRhcnlFcXVhbHNgXXtAbGluayBSYWMjdW5pdGFyeUVxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyQ29sb3IpIHtcbiAgICByZXR1cm4gb3RoZXJDb2xvciBpbnN0YW5jZW9mIENvbG9yXG4gICAgICAmJiB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuciwgb3RoZXJDb2xvci5yKVxuICAgICAgJiYgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmcsIG90aGVyQ29sb3IuZylcbiAgICAgICYmIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5iLCBvdGhlckNvbG9yLmIpXG4gICAgICAmJiB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYSwgb3RoZXJDb2xvci5hKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlIHdpdGggZWFjaCBjaGFubmVsIHJlY2VpdmVkIGluIHRoZVxuICAqICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbYT0yNTVdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHN0YXRpYyBmcm9tUmdiYShyYWMsIHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgci8yNTUsIGcvMjU1LCBiLzI1NSwgYS8yNTUpO1xuICB9XG5cblxuLy8gUkVMRUFTRS1UT0RPOiB1cGRhdGUgZG9jcyBoZXJlIGFuZCBpbiBpbnN0YW5jZS5mcm9tSGV4XG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IGRpZ2l0cyBhbmQgY2FuIG9wdGlvbmFsbHkgc3RhcnRcbiAgKiB3aXRoIGAjYC4gYEFBQkJDQ2AgYW5kIGAjRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMsIHRoZSB0aHJlZSBkaWdpdFxuICAqIHNob3J0aGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgaGV4U3RyaW5nYCBpcyBtaXNmb3JtYXR0ZWQgb3IgY2Fubm90IGJlIHBhcnNlZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIFJHQiBoZXggdHJpcGxldCB0byBpbnRlcnByZXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHN0YXRpYyBmcm9tSGV4KHJhYywgaGV4U3RyaW5nKSB7XG4gICAgaWYgKGhleFN0cmluZy5jaGFyQXQoMCkgPT0gJyMnKSB7XG4gICAgICBoZXhTdHJpbmcgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGlmICghWzYsIDhdLmluY2x1ZGVzKGhleFN0cmluZy5sZW5ndGgpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYFVuZXhwZWN0ZWQgbGVuZ3RoIGZvciBoZXggdHJpcGxldCBzdHJpbmc6ICR7aGV4U3RyaW5nfWApO1xuICAgIH1cblxuICAgIGxldCByU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZygwLCAyKTtcbiAgICBsZXQgZ1N0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoMiwgNCk7XG4gICAgbGV0IGJTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDQsIDYpO1xuICAgIGxldCBhU3RyID0gJ2ZmJztcbiAgICBpZiAoaGV4U3RyaW5nLmxlbmd0aCA9PSA4KSB7XG4gICAgICBhU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZyg2LCA4KTtcbiAgICB9XG5cbiAgICBsZXQgbmV3UiA9IHBhcnNlSW50KHJTdHIsIDE2KTtcbiAgICBsZXQgbmV3RyA9IHBhcnNlSW50KGdTdHIsIDE2KTtcbiAgICBsZXQgbmV3QiA9IHBhcnNlSW50KGJTdHIsIDE2KTtcbiAgICBsZXQgbmV3QSA9IHBhcnNlSW50KGFTdHIsIDE2KTtcblxuICAgIGlmIChpc05hTihuZXdSKSB8fCBpc05hTihuZXdHKSB8fCBpc05hTihuZXdCKSB8fCBpc05hTihuZXdBKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBDb3VsZCBub3QgcGFyc2UgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgbmV3Ui8yNTUsIG5ld0cvMjU1LCBuZXdCLzI1NSwgbmV3QS8yNTUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBGaWxsYCB0aGF0IHVzZXMgYHRoaXNgIGFzIGBjb2xvcmAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICovXG4gIGZpbGwoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLnJhYywgdGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgdGhhdCB1c2VzIGB0aGlzYCBhcyBgY29sb3JgLlxuICAqXG4gICogQHBhcmFtIHs/TnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBuZXcgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgc3Ryb2tlKHdlaWdodCA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHJva2UodGhpcy5yYWMsIHdlaWdodCwgdGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGBhYCBzZXQgdG8gYG5ld0FscGhhYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdBbHBoYSAtIFRoZSBhbHBoYSBjaGFubmVsIGZvciB0aGUgbmV3IGBDb2xvcmAsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHdpdGhBbHBoYShuZXdBbHBoYSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIG5ld0FscGhhKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggYGFgIHNldCB0byBgdGhpcy5hICogcmF0aW9gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgYWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICB3aXRoQWxwaGFSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYSAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIGluIHRoZSBsaW5lYXIgdHJhbnNpdGlvbiBiZXR3ZWVuIGB0aGlzYCBhbmRcbiAgKiBgdGFyZ2V0YCBhdCBhIGByYXRpb2AgaW4gdGhlIHJhbmdlICpbMCwxXSouXG4gICpcbiAgKiBXaGVuIGByYXRpb2AgaXMgYDBgIG9yIGxlc3MgdGhlIG5ldyBgQ29sb3JgIGlzIGVxdWl2YWxlbnQgdG8gYHRoaXNgLFxuICAqIHdoZW4gYHJhdGlvYCBpcyBgMWAgb3IgbGFyZ2VyIHRoZSBuZXcgYENvbG9yYCBpcyBlcXVpdmFsZW50IHRvXG4gICogYHRhcmdldGAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgdHJhbnNpdGlvbiByYXRpbyBmb3IgdGhlIG5ldyBgQ29sb3JgXG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IHRhcmdldCAtIFRoZSB0cmFuc2l0aW9uIHRhcmdldCBgQ29sb3JgXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgbGluZWFyVHJhbnNpdGlvbihyYXRpbywgdGFyZ2V0KSB7XG4gICAgcmF0aW8gPSBNYXRoLm1heChyYXRpbywgMCk7XG4gICAgcmF0aW8gPSBNYXRoLm1pbihyYXRpbywgMSk7XG5cbiAgICBsZXQgbmV3UiA9IHRoaXMuciArICh0YXJnZXQuciAtIHRoaXMucikgKiByYXRpbztcbiAgICBsZXQgbmV3RyA9IHRoaXMuZyArICh0YXJnZXQuZyAtIHRoaXMuZykgKiByYXRpbztcbiAgICBsZXQgbmV3QiA9IHRoaXMuYiArICh0YXJnZXQuYiAtIHRoaXMuYikgKiByYXRpbztcbiAgICBsZXQgbmV3QSA9IHRoaXMuYSArICh0YXJnZXQuYSAtIHRoaXMuYSkgKiByYXRpbztcblxuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIG5ld1IsIG5ld0csIG5ld0IsIG5ld0EpO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29sb3JcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xuXG4iLCIgICd1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBGaWxsIFtjb2xvcl17QGxpbmsgUmFjLkNvbG9yfSBmb3IgZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgYXMgYGZpbGwuYXBwbHkoKWAgdG8gYXBwbHkgdGhlIGZpbGwgc2V0dGluZ3MgZ2xvYmFsbHksIG9yIGFzXG4qIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoZmlsbClgIHRvIGFwcGx5IHRoZSBmaWxsIG9ubHkgZm9yIHRoYXRcbiogY2FsbC5cbipcbiogV2hlbiBgY29sb3JgIGlzIGBudWxsYCBhICpuby1maWxsKiBzZXR0aW5nIGlzIGFwcGxpZWQuXG4qXG4qICMjIyBgaW5zdGFuY2UuRmlsbGBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5GaWxsYCBmdW5jdGlvbl17QGxpbmsgUmFjI0ZpbGx9IHRvIGNyZWF0ZSBgRmlsbGAgb2JqZWN0cyB3aXRoXG4qIGZld2VyIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuRmlsbC5ub25lYF17QGxpbmsgaW5zdGFuY2UuRmlsbCNub25lfSwgbGlzdGVkXG4qIHVuZGVyIFtgaW5zdGFuY2UuRmlsbGBde0BsaW5rIGluc3RhbmNlLkZpbGx9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgZmlsbCA9IG5ldyBSYWMuRmlsbChyYWMsIGNvbG9yKVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJGaWxsID0gcmFjLkZpbGwoY29sb3IpXG4qXG4qIEBzZWUgW2ByYWMuRmlsbGBde0BsaW5rIFJhYyNGaWxsfVxuKiBAc2VlIFtgaW5zdGFuY2UuRmlsbGBde0BsaW5rIGluc3RhbmNlLkZpbGx9XG4qXG4qIEBhbGlhcyBSYWMuRmlsbFxuKi9cbmNsYXNzIEZpbGwge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZpbGxgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gY29sb3IgLSBBIGBDb2xvcmAgZm9yIHRoZSBmaWxsIHNldHRpbmcsIG9yIGBudWxsYFxuICAqICAgdG8gYXBwbHkgYSAqbm8tZmlsbCogc2V0dGluZ1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIGNvbG9yKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgY29sb3IgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQ29sb3IsIGNvbG9yKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLy8gUkVMRUFTRS1UT0RPOiBkb2N1bWVudFxuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBGaWxsYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBDb2xvcmAsIHJldHVybnMgYSBuZXcgYEZpbGxgXG4gICogICB1c2luZyBgc29tZXRoaW5nYCBhcyBgY29sb3JgLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgU3Ryb2tlYCwgcmV0dXJucyBhIG5ldyBgRmlsbGBcbiAgKiAgIHVzaW5nIGBzdHJva2UuY29sb3JgLlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkZpbGx8UmFjLkNvbG9yfFJhYy5TdHJva2V9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBzdGF0aWMgZnJvbShyYWMsIHNvbWV0aGluZykge1xuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBGaWxsKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkNvbG9yKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGwocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlN0cm9rZSkge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkZpbGwgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIG9ubHkgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpc10pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIGBzdHlsZWAuIFdoZW5cbiAgKiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBjb250YWluIGFsb25nIGB0aGlzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ8UmFjLkZpbGx9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgU3Ryb2tlYFxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5TdHJva2UuZnJvbX0gYHNvbWVTdHJva2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZVN0cm9rZSAtIEFuIG9iamVjdCB0byBkZXJpdmVcbiAgKiAgIGEgYFN0cm9rZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICpcbiAgKiBAc2VlIFtgcmFjLlN0cm9rZS5mcm9tYF17QGxpbmsgUmFjLlN0cm9rZS5mcm9tfVxuICAqL1xuICBhcHBlbmRTdHJva2Uoc29tZVN0cm9rZSkge1xuICAgIGxldCBzdHJva2UgPSBSYWMuU3Ryb2tlLmZyb20odGhpcy5yYWMsIHNvbWVTdHJva2UpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgc3Ryb2tlXSk7XG4gIH1cblxufSAvLyBjbGFzcyBGaWxsXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxsO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU3Ryb2tlIHdlaWdodCBhbmQgW2NvbG9yXXtAbGluayBSYWMuQ29sb3J9IGZvciBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgc3Ryb2tlLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBzdHJva2Ugc2V0dGluZ3MgZ2xvYmFsbHksIG9yXG4qIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoc3Ryb2tlKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBvbmx5IGZvclxuKiB0aGF0IGBkcmF3YC5cbipcbiogQXBwbHlpbmcgdGhlIGluc3RhbmNlIGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgYmVoYXZpb3VyczpcbiogKyBBcHBsaWVzIGEgKipuby1zdHJva2UqKiBzZXR0aW5nOyB3aGVuIGBjb2xvciA9IG51bGxgIGFuZCBgd2VpZ2h0ID0gbnVsbGBcbiogKyBBcHBsaWVzICoqb25seSBzdHJva2UgY29sb3IqKiwgbGVhdmluZyB3ZWlnaHQgdW5jaGFuZ2VkOyB3aGVuIGBjb2xvcmBcbiogICBpcyBzZXQgYW5kIGB3ZWlnaHQgPSBudWxsYFxuKiArIEFwcGxpZXMgKipvbmx5IHN0cm9rZSB3ZWlnaHQqKiwgbGVhdmluZyBjb2xvciB1bmNoYW5nZWQ7IHdoZW4gYHdlaWdodGBcbiogICBpcyBzZXQgYW5kIGBjb2xvciA9IG51bGxgXG4qICsgQXBwbGllcyAqKmJvdGggd2VpZ2h0IGFuZCBjb2xvcioqOyB3aGVuIGJvdGggYGNvbG9yYCBhbmQgYHdlaWdodGAgYXJlIHNldFxuKlxuKiAjIyMgYGluc3RhbmNlLlN0cm9rZWBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5TdHJva2VgIGZ1bmN0aW9uXXtAbGluayBSYWMjU3Ryb2tlfSB0byBjcmVhdGUgYFN0cm9rZWAgb2JqZWN0cyB3aXRoXG4qIGZld2VyIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuU3Ryb2tlLm5vbmVgXXtAbGluayBpbnN0YW5jZS5TdHJva2Ujbm9uZX0sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLlN0cm9rZWBde0BsaW5rIGluc3RhbmNlLlN0cm9rZX0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBzdHJva2UgPSBuZXcgUmFjLlN0cm9rZShyYWMsIDIsIGNvbG9yKVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJTdHJva2UgPSByYWMuU3Ryb2tlKDIsIGNvbG9yKVxuKlxuKiBAc2VlIFtgcmFjLlN0cm9rZWBde0BsaW5rIFJhYyNTdHJva2V9XG4qIEBzZWUgW2BpbnN0YW5jZS5TdHJva2VgXXtAbGluayBpbnN0YW5jZS5TdHJva2V9XG4qXG4qIEBhbGlhcyBSYWMuU3Ryb2tlXG4qL1xuY2xhc3MgU3Ryb2tlIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTdHJva2VgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IHdlaWdodCAtIFRoZSB3ZWlnaHQgb2YgdGhlIHN0cm9rZSwgb3IgYG51bGxgIHRvIHNraXAgd2VpZ2h0XG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBbY29sb3I9bnVsbF0gLSBBIGBDb2xvcmAgZm9yIHRoZSBzdHJva2UsIG9yIGBudWxsYFxuICAqICAgdG8gc2tpcCBjb2xvclxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHdlaWdodCwgY29sb3IgPSBudWxsKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgd2VpZ2h0ICE9PSBudWxsICYmIHV0aWxzLmFzc2VydE51bWJlcih3ZWlnaHQpO1xuICAgIGNvbG9yICE9PSBudWxsICYmIHV0aWxzLmFzc2VydFR5cGUoUmFjLkNvbG9yLCBjb2xvcik7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhY1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLndlaWdodCA9IHdlaWdodDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTdHJva2VgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgU3Ryb2tlYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgQ29sb3JgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgXG4gICogICB1c2luZyBgc29tZXRoaW5nYCBhcyBgY29sb3JgIGFuZCBhIGBudWxsYCBzdHJva2Ugd2VpZ2h0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgRmlsbGAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWBcbiAgKiAgIHVzaW5nIGBmaWxsLmNvbG9yYCBhbmQgYSBgbnVsbGAgc3Ryb2tlIHdlaWdodC5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2V8UmFjLkNvbG9yfFJhYy5GaWxsfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiAgIGRlcml2ZSBhIGBTdHJva2VgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgU3Ryb2tlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkNvbG9yKSB7XG4gICAgICByZXR1cm4gbmV3IFN0cm9rZShyYWMsIG51bGwsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuRmlsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcuY29sb3IpO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuU3Ryb2tlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYHdlaWdodGAgc2V0IHRvIGBuZXdXZWlnaHRgLlxuICAqXG4gICogQHBhcmFtIHs/TnVtYmVyfSBuZXdXZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwXG4gICogICB3ZWlnaHRcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aFdlaWdodChuZXdXZWlnaHQpIHtcbiAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgbmV3V2VpZ2h0LCB0aGlzLmNvbG9yLCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgd2l0aCBhIGNvcHkgb2YgYGNvbG9yYCBzZXR1cCB3aXRoIGBuZXdBbHBoYWAsXG4gICogYW5kIHRoZSBzYW1lIGBzdHJva2VgIGFzIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuY29sb3JgIGlzIHNldCB0byBgbnVsbGAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWAgdGhhdCBpcyBhXG4gICogY29weSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3QWxwaGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBvZiB0aGUgYGNvbG9yYCBvZiB0aGUgbmV3XG4gICogICBgU3Ryb2tlYFxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICB3aXRoQWxwaGEobmV3QWxwaGEpIHtcbiAgICBpZiAodGhpcy5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIHRoaXMud2VpZ2h0LCBudWxsKTtcbiAgICB9XG5cbiAgICBsZXQgbmV3Q29sb3IgPSB0aGlzLmNvbG9yLndpdGhBbHBoYShuZXdBbHBoYSk7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIHRoaXMud2VpZ2h0LCBuZXdDb2xvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIG9ubHkgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpc10pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIGBzdHlsZWAuIFdoZW5cbiAgKiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBjb250YWluIGFsb25nIGB0aGlzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ8UmFjLlN0cm9rZX1cbiAgKi9cbiAgYXBwZW5kU3R5bGUoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIHN0eWxlXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgdGhlIGBGaWxsYFxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5GaWxsLmZyb219IGBzb21lRmlsbGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5GaWxsfFJhYy5Db2xvcnxSYWMuU3Ryb2tlfSBzb21lRmlsbCAtIEFuIG9iamVjdCB0byBkZXJpdmVcbiAgKiAgIGEgYEZpbGxgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqXG4gICogQHNlZSBbYHJhYy5GaWxsLmZyb21gXXtAbGluayBSYWMuRmlsbC5mcm9tfVxuICAqL1xuICBhcHBlbmRGaWxsKHNvbWVGaWxsKSB7XG4gICAgbGV0IGZpbGwgPSBSYWMuRmlsbC5mcm9tKHRoaXMucmFjLCBzb21lRmlsbCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBmaWxsXSk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHJva2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cm9rZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBgW1N0cm9rZV17QGxpbmsgUmFjLlN0cm9rZX1gIGFuZCBgW0ZpbGxde0BsaW5rIFJhYy5GaWxsfWBcbiogb2JqZWN0cyB3aGljaCBnZXQgYXBwbGllZCBzZXF1ZW50aWFsbHkgd2hlbiBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgY29udGFpbmVyLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBjb250YWluZWQgc3R5bGVzXG4qIGdsb2JhbGx5LCBvciBhcyB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KGNvbnRhaW5lcilgIHRvIGFwcGx5IHRoZVxuKiBzdHlsZSBzZXR0aW5ncyBvbmx5IGZvciB0aGF0IGBkcmF3YC5cbipcbiogQGFsaWFzIFJhYy5TdHlsZUNvbnRhaW5lclxuKi9cbmNsYXNzIFN0eWxlQ29udGFpbmVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0eWxlcyA9IFtdKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogQ29udGFpbmVyIG9mIHN0eWxlIG9iamVjdHMgdG8gYXBwbHkuXG4gICAgKlxuICAgICogQ2FuIGJlIG1hbmlwdWxhdGVkIGRpcmVjdGx5IHRvIGFkZCBvciByZW1vdmUgc3R5bGVzIGZyb20gYHRoaXNgLlxuICAgICogTW9zdCBvZiB0aGUgaW1wbGVtZW50ZWQgbWV0aG9kcyBsaWtlXG4gICAgKiBgW2FkZF17QGxpbmsgUmFjLlN0eWxlQ29udGFpbmVyI2FkZH1gIHJldHVybiBhIG5ldyBgU3R5bGVDb250YWluZXJgXG4gICAgKiB3aXRoIGFuIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgKi9cbiAgICB0aGlzLnN0eWxlcyA9IHN0eWxlcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICBsZXQgY29udGVudHMgPSB0aGlzLnN0eWxlcy5qb2luKCcgJyk7XG4gICAgcmV0dXJuIGBTdHlsZUNvbnRhaW5lcigke2NvbnRlbnRzfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBhIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgdGhpcy5zdHlsZXMuc2xpY2UoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCB3aXRoIGBzdHlsZWAgYXBwZW5kZWQgYXQgdGhlIGVuZCBvZlxuICAqIGBzdHlsZXNgLiBXaGVuIGBzdHlsZWAgaXMgYG51bGxgLCByZXR1cm5zIGB0aGlzYCBpbnN0ZWFkLlxuICAqXG4gICogYHRoaXNgIGlzIG5vdCBtb2RpZmllZCBieSB0aGlzIG1ldGhvZCwgdGhlIG5ldyBgU3R5bGVDb250YWluZXJgIGlzXG4gICogY3JlYXRlZCB3aXRoIGEgY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IHN0eWxlIC0gQSBzdHlsZSBvYmplY3RcbiAgKiAgIHRvIGFwcGVuZCB0byBgc3R5bGVzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc3R5bGVzQ29weSA9IHRoaXMuc3R5bGVzLnNsaWNlKCk7XG4gICAgc3R5bGVzQ29weS5wdXNoKHN0eWxlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgc3R5bGVzQ29weSk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHlsZUNvbnRhaW5lclxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3R5bGVDb250YWluZXI7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuQ29sb3JgIGZ1bmN0aW9uXXtAbGluayBSYWMjQ29sb3J9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYENvbG9yYF17QGxpbmsgUmFjLkNvbG9yfSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLkNvbG9yLnJlZCAvLyByZWFkeS1tYWRlIHJlZCBjb2xvclxuKiByYWMuQ29sb3IucmVkLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Db2xvclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQ29sb3IocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBlYWNoIGNoYW5uZWwgcmVjZWl2ZWQgaW4gdGhlICpbMCwyNTVdKiByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbYT0yNTVdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJnYmFcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5mcm9tUmdiYSA9IGZ1bmN0aW9uKHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gUmFjLkNvbG9yLmZyb21SZ2JhKHJhYywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UgZnJvbSBhIGhleGFkZWNpbWFsIHRyaXBsZXQgc3RyaW5nLlxuICAqXG4gICogVGhlIGBoZXhTdHJpbmdgIGlzIGV4cGVjdGVkIHRvIGhhdmUgNiBkaWdpdHMgYW5kIGNhbiBvcHRpb25hbGx5IHN0YXJ0XG4gICogd2l0aCBgI2AuIGBBQUJCQ0NgIGFuZCBgI0RERUVGRmAgYXJlIGJvdGggdmFsaWQgaW5wdXRzLCB0aGUgdGhyZWUgZGlnaXRcbiAgKiBzaG9ydGhhbmQgaXMgbm90IHlldCBzdXBwb3J0ZWQuXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGhleFN0cmluZ2AgaXMgbWlzZm9ybWF0dGVkIG9yIGNhbm5vdCBiZSBwYXJzZWQuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIFJHQiBoZXggdHJpcGxldCB0byBpbnRlcnByZXRcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21IZXhcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5mcm9tSGV4ID0gZnVuY3Rpb24oaGV4U3RyaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tSGV4KHJhYywgaGV4U3RyaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQSBgQ29sb3JgIHdpdGggYWxsIGNoYW5uZWxzIHNldCB0byBgMGAuXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuemVybyA9IHJhYy5Db2xvcigwLCAwLCAwLCAwKTtcblxuXG4gIC8qKlxuICAqIEEgYmxhY2sgYENvbG9yYC5cbiAgKlxuICAqIEBuYW1lIGJsYWNrXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuYmxhY2sgICA9IHJhYy5Db2xvcigwLCAwLCAwKTtcblxuICAvKipcbiAgKiBBIHdoaXRlIGBDb2xvcmAsIHdpdGggYWxsIGNoYW5uZWxzIHNldCB0byBgMWAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhcyBgb25lYC5cbiAgKlxuICAqIEBuYW1lIHdoaXRlXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3Iud2hpdGUgICA9IHJhYy5Db2xvcigxLCAxLCAxKTtcbiAgcmFjLkNvbG9yLm9uZSA9IHJhYy5Db2xvci53aGl0ZTtcblxuICAvKipcbiAgKiBBIHJlZCBgQ29sb3JgLlxuICAqXG4gICogQG5hbWUgcmVkXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IucmVkICAgICA9IHJhYy5Db2xvcigxLCAwLCAwKTtcblxuICByYWMuQ29sb3IuZ3JlZW4gICA9IHJhYy5Db2xvcigwLCAxLCAwKTtcbiAgcmFjLkNvbG9yLmJsdWUgICAgPSByYWMuQ29sb3IoMCwgMCwgMSk7XG4gIHJhYy5Db2xvci55ZWxsb3cgID0gcmFjLkNvbG9yKDEsIDEsIDApO1xuICByYWMuQ29sb3IubWFnZW50YSA9IHJhYy5Db2xvcigxLCAwLCAxKTtcbiAgcmFjLkNvbG9yLmN5YW4gICAgPSByYWMuQ29sb3IoMCwgMSwgMSk7XG5cbn0gLy8gYXR0YWNoUmFjQ29sb3JcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5GaWxsYCBmdW5jdGlvbl17QGxpbmsgUmFjI0ZpbGx9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYEZpbGxgXXtAbGluayBSYWMuRmlsbH0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5GaWxsLm5vbmUgLy8gcmVhZHktbWFkZSBub25lIGZpbGxcbiogcmFjLkZpbGwubm9uZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuRmlsbFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjRmlsbChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBGaWxsYCB3aXRob3V0IGNvbG9yLiBSZW1vdmVzIHRoZSBmaWxsIGNvbG9yIHdoZW4gYXBwbGllZC5cbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkZpbGwjXG4gICovXG4gIHJhYy5GaWxsLm5vbmUgPSByYWMuRmlsbChudWxsKTtcblxufSAvLyBhdHRhY2hSYWNGaWxsXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuU3Ryb2tlYCBmdW5jdGlvbl17QGxpbmsgUmFjI1N0cm9rZX0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgU3Ryb2tlYF17QGxpbmsgUmFjLlN0cm9rZX0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5TdHJva2Uubm9uZSAvLyByZWFkeS1tYWRlIG5vbmUgc3Ryb2tlXG4qIHJhYy5TdHJva2Uubm9uZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU3Ryb2tlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNTdHJva2UocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRoIG5vIHdlaWdodCBhbmQgbm8gY29sb3IuIFVzaW5nIG9yIGFwcGx5aW5nIHRoaXMgc3Ryb2tlXG4gICogd2lsbCBkaXNhYmxlIHN0cm9rZSBkcmF3aW5nLlxuICAqXG4gICogQG5hbWUgbm9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uubm9uZSA9IHJhYy5TdHJva2UobnVsbCk7XG5cblxuICAvKipcbiAgKiBBIGBTdHJva2VgIHdpdGggYHdlaWdodCA9IDFgIGFuZCBubyBjb2xvci4gVXNpbmcgb3IgYXBwbHlpbmcgdGhpc1xuICAqIHN0cm9rZSB3aWxsIG9ubHkgc2V0IHRoZSBzdHJva2Ugd2VpZ2h0IHRvIGAxYCBsZWF2aW5nIHN0cm9rZSBjb2xvclxuICAqIHVuY2hhbmdlZC5cbiAgKlxuICAqIEBuYW1lIG9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uub25lID0gcmFjLlN0cm9rZSgxKTtcblxufSAvLyBhdHRhY2hSYWNTdHJva2VcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gSW1wbGVtZW50YXRpb24gb2YgYW4gZWFzZSBmdW5jdGlvbiB3aXRoIHNldmVyYWwgb3B0aW9ucyB0byB0YWlsb3IgaXRzXG4vLyBiZWhhdmlvdXIuIFRoZSBjYWxjdWxhdGlvbiB0YWtlcyB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuLy8gVmFsdWUgaXMgcmVjZWl2ZWQsIHByZWZpeCBpcyByZW1vdmVkXG4vLyAgIFZhbHVlIC0+IGVhc2VWYWx1ZSh2YWx1ZSlcbi8vICAgICB2YWx1ZSA9IHZhbHVlIC0gcHJlZml4XG4vLyBSYXRpbyBpcyBjYWxjdWxhdGVkXG4vLyAgIHJhdGlvID0gdmFsdWUgLyBpblJhbmdlXG4vLyBSYXRpbyBpcyBhZGp1c3RlZFxuLy8gICByYXRpbyAtPiBlYXNlUmF0aW8ocmF0aW8pXG4vLyAgICAgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHJhdGlvT2ZzZXQpICogcmF0aW9GYWN0b3Jcbi8vIEVhc2UgaXMgY2FsY3VsYXRlZFxuLy8gICBlYXNlZFJhdGlvID0gZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbylcbi8vIEVhc2VkUmF0aW8gaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkUmF0aW8gPSAoZWFzZWRSYXRpbyArIGVhc2VPZnNldCkgKiBlYXNlRmFjdG9yXG4vLyAgIGVhc2VSYXRpbyhyYXRpbykgLT4gZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgcHJvamVjdGVkXG4vLyAgIGVhc2VkVmFsdWUgPSB2YWx1ZSAqIGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFZhbHVlID0gcHJlZml4ICsgKGVhc2VkVmFsdWUgKiBvdXRSYW5nZSlcbi8vICAgZWFzZVZhbHVlKHZhbHVlKSAtPiBlYXNlZFZhbHVlXG5jbGFzcyBFYXNlRnVuY3Rpb24ge1xuXG4gIC8vIEJlaGF2aW9ycyBmb3IgdGhlIGBlYXNlVmFsdWVgIGZ1bmN0aW9uIHdoZW4gYHZhbHVlYCBmYWxscyBiZWZvcmUgdGhlXG4gIC8vIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gIHN0YXRpYyBCZWhhdmlvciA9IHtcbiAgICAvLyBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgYW55IGVhc2luZyB0cmFuc2Zvcm1hdGlvbi4gYHByZUZhY3RvcmBcbiAgICAvLyBhbmQgYHBvc3RGYWN0b3JgIGFyZSBhcHBsaWVkLiBUaGlzIGlzIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uXG4gICAgcGFzczogXCJwYXNzXCIsXG4gICAgLy8gQ2xhbXBzIHRoZSByZXR1cm5lZCB2YWx1ZSB0byBgcHJlZml4YCBvciBgcHJlZml4K2luUmFuZ2VgO1xuICAgIGNsYW1wOiBcImNsYW1wXCIsXG4gICAgLy8gUmV0dXJucyB0aGUgYXBwbGllZCBlYXNpbmcgdHJhbnNmb3JtYXRpb24gdG8gYHZhbHVlYCBmb3IgdmFsdWVzXG4gICAgLy8gYmVmb3JlIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gICAgY29udGludWU6IFwiY29udGludWVcIlxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYSA9IDI7XG5cbiAgICAvLyBBcHBsaWVkIHRvIHJhdGlvIGJlZm9yZSBlYXNpbmcuXG4gICAgdGhpcy5yYXRpb09mZnNldCA9IDBcbiAgICB0aGlzLnJhdGlvRmFjdG9yID0gMTtcblxuICAgIC8vIEFwcGxpZWQgdG8gZWFzZWRSYXRpby5cbiAgICB0aGlzLmVhc2VPZmZzZXQgPSAwXG4gICAgdGhpcy5lYXNlRmFjdG9yID0gMTtcblxuICAgIC8vIERlZmluZXMgdGhlIGxvd2VyIGxpbWl0IG9mIGB2YWx1ZWBgIHRvIGFwcGx5IGVhc2luZy5cbiAgICB0aGlzLnByZWZpeCA9IDA7XG5cbiAgICAvLyBgdmFsdWVgIGlzIHJlY2VpdmVkIGluIGBpblJhbmdlYCBhbmQgb3V0cHV0IGluIGBvdXRSYW5nZWAuXG4gICAgdGhpcy5pblJhbmdlID0gMTtcbiAgICB0aGlzLm91dFJhbmdlID0gMTtcblxuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYmVmb3JlIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlQmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0QmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcblxuICAgIC8vIEZvciBhIGBwcmVCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdmFsdWVzIGJlZm9yZVxuICAgIC8vIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlRmFjdG9yID0gMTtcbiAgICAvLyBGb3IgYSBgcG9zdEJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB0aGUgdmFsdWVzXG4gICAgLy8gYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RGYWN0b3IgPSAxO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBlYXNlZCB2YWx1ZSBmb3IgYHVuaXRgLiBCb3RoIHRoZSBnaXZlblxuICAvLyBgdW5pdGAgYW5kIHRoZSByZXR1cm5lZCB2YWx1ZSBhcmUgaW4gdGhlIFswLDFdIHJhbmdlLiBJZiBgdW5pdGAgaXNcbiAgLy8gb3V0c2lkZSB0aGUgWzAsMV0gdGhlIHJldHVybmVkIHZhbHVlIGZvbGxvd3MgdGhlIGN1cnZlIG9mIHRoZSBlYXNpbmdcbiAgLy8gZnVuY3Rpb24sIHdoaWNoIG1heSBiZSBpbnZhbGlkIGZvciBzb21lIHZhbHVlcyBvZiBgYWAuXG4gIC8vXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGJhc2UgZWFzaW5nIGZ1bmN0aW9uLCBpdCBkb2VzIG5vdCBhcHBseSBhbnlcbiAgLy8gb2Zmc2V0cyBvciBmYWN0b3JzLlxuICBlYXNlVW5pdCh1bml0KSB7XG4gICAgLy8gU291cmNlOlxuICAgIC8vIGh0dHBzOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvMTIxNzIwL2Vhc2UtaW4tb3V0LWZ1bmN0aW9uLzEyMTc1NSMxMjE3NTVcbiAgICAvLyBmKHQpID0gKHReYSkvKHReYSsoMS10KV5hKVxuICAgIGxldCByYSA9IE1hdGgucG93KHVuaXQsIHRoaXMuYSk7XG4gICAgbGV0IGlyYSA9IE1hdGgucG93KDEtdW5pdCwgdGhpcy5hKTtcbiAgICByZXR1cm4gcmEgLyAocmEgKyBpcmEpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZWFzZSBmdW5jdGlvbiBhcHBsaWVkIHRvIHRoZSBnaXZlbiByYXRpby4gYHJhdGlvT2Zmc2V0YFxuICAvLyBhbmQgYHJhdGlvRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgaW5wdXQsIGBlYXNlT2Zmc2V0YCBhbmRcbiAgLy8gYGVhc2VGYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBvdXRwdXQuXG4gIGVhc2VSYXRpbyhyYXRpbykge1xuICAgIGxldCBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgdGhpcy5yYXRpb09mZnNldCkgKiB0aGlzLnJhdGlvRmFjdG9yO1xuICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlVW5pdChhZGp1c3RlZFJhdGlvKTtcbiAgICByZXR1cm4gKGVhc2VkUmF0aW8gKyB0aGlzLmVhc2VPZmZzZXQpICogdGhpcy5lYXNlRmFjdG9yO1xuICB9XG5cbiAgLy8gQXBwbGllcyB0aGUgZWFzaW5nIGZ1bmN0aW9uIHRvIGB2YWx1ZWAgY29uc2lkZXJpbmcgdGhlIGNvbmZpZ3VyYXRpb25cbiAgLy8gb2YgdGhlIHdob2xlIGluc3RhbmNlLlxuICBlYXNlVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgYmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3I7XG5cbiAgICBsZXQgc2hpZnRlZFZhbHVlID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICBsZXQgcmF0aW8gPSBzaGlmdGVkVmFsdWUgLyB0aGlzLmluUmFuZ2U7XG5cbiAgICAvLyBCZWZvcmUgcHJlZml4XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5wcmVmaXgpIHtcbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZXRvUHJlZml4ID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICAgICAgLy8gV2l0aCBhIHByZUZhY3RvciBvZiAxIHRoaXMgaXMgZXF1aXZhbGVudCB0byBgcmV0dXJuIHJhbmdlYFxuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyAoZGlzdGFuY2V0b1ByZWZpeCAqIHRoaXMucHJlRmFjdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXg7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHByZUJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwcmVCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIC8vIEFmdGVyIHByZWZpeFxuICAgIGlmIChyYXRpbyA8PSAxIHx8IHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgLy8gRWFzZSBmdW5jdGlvbiBhcHBsaWVkIHdpdGhpbiByYW5nZSAob3IgYWZ0ZXIpXG4gICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgIC8vIFNoaWZ0ZWQgdG8gaGF2ZSBpblJhbmdlIGFzIG9yaWdpblxuICAgICAgbGV0IHNoaWZ0ZWRQb3N0ID0gc2hpZnRlZFZhbHVlIC0gdGhpcy5pblJhbmdlO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZSArIHNoaWZ0ZWRQb3N0ICogdGhpcy5wb3N0RmFjdG9yO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlO1xuICAgIH1cblxuICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcG9zdEJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwb3N0QmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gIH1cblxuXG4gIC8vIFByZWNvbmZpZ3VyZWQgZnVuY3Rpb25zXG5cbiAgLy8gTWFrZXMgYW4gZWFzZUZ1bmN0aW9uIHByZWNvbmZpZ3VyZWQgdG8gYW4gZWFzZSBvdXQgbW90aW9uLlxuICAvL1xuICAvLyBUaGUgYG91dFJhbmdlYCB2YWx1ZSBzaG91bGQgYmUgYGluUmFuZ2UqMmAgaW4gb3JkZXIgZm9yIHRoZSBlYXNlXG4gIC8vIG1vdGlvbiB0byBjb25uZWN0IHdpdGggdGhlIGV4dGVybmFsIG1vdGlvbiBhdCB0aGUgY29ycmVjdCB2ZWxvY2l0eS5cbiAgc3RhdGljIG1ha2VFYXNlT3V0KCkge1xuICAgIGxldCBlYXNlT3V0ID0gbmV3IEVhc2VGdW5jdGlvbigpXG4gICAgZWFzZU91dC5yYXRpb09mZnNldCA9IDE7XG4gICAgZWFzZU91dC5yYXRpb0ZhY3RvciA9IC41O1xuICAgIGVhc2VPdXQuZWFzZU9mZnNldCA9IC0uNTtcbiAgICBlYXNlT3V0LmVhc2VGYWN0b3IgPSAyO1xuICAgIHJldHVybiBlYXNlT3V0O1xuICB9XG5cbn0gLy8gY2xhc3MgRWFzZUZ1bmN0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFYXNlRnVuY3Rpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhyb3dhYmxlIG9iamVjdCB0byByZXBvcnQgZXJyb3JzLCBhbmQgY29udGFpbmVyIG9mIGNvbnZlbmllbmNlIGZ1bmN0aW9uc1xuKiB0byBjcmVhdGUgdGhlc2UuXG4qXG4qIFRoZSBzdGF0aWMgZnVuY3Rpb25zIGNyZWF0ZSBlaXRoZXIgYEV4Y2VwdGlvbmAgb3IgYEVycm9yYCBpbnN0YW5jZXMsXG4qIHNpbmNlIGRpZmZlcmVudCBlbnZpcm9ubWVudHMgcmVzcG9uZCBkaWZmZXJlbnRlbHkgdG8gdGhlc2UgdGhyb3dzLiBGb3JcbiogbW9yZSBkZXRhaWxzIHNlZSBbYGJ1aWxkc0Vycm9yc2Bde0BsaW5rIFJhYy5FeGNlcHRpb24uYnVpbGRzRXJyb3JzfS5cbipcbiogQGFsaWFzIFJhYy5FeGNlcHRpb25cbiovXG5jbGFzcyBFeGNlcHRpb24ge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEV4Y2VwdGlvbmAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgKiAgIFRoZSBuYW1lIG9mIHRoZSBleGNlcHRpb25cbiAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAqICAgVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxuICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogKG5ldyBSYWMuRXhjZXB0aW9uKCdOb3RBUGFuZ3JhbScsICdXYWx0eiwgYmFkIG55bXBoJykpLnRvU3RyaW5nKClcbiAgKiAvLyBSZXR1cm5zOiAnRXhjZXB0aW9uOk5vdEFQYW5ncmFtIC0gV2FsdHosIGJhZCBueW1waCdcbiAgKlxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgRXhjZXB0aW9uOiR7dGhpcy5uYW1lfSAtICR7dGhpcy5tZXNzYWdlfWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFdoZW4gYHRydWVgIHRoZSBjb252ZW5pZW5jZSBzdGF0aWMgZnVuY3Rpb25zIG9mIHRoaXMgY2xhc3Mgd2lsbFxuICAqIGJ1aWxkIGBFcnJvcmAgb2JqZWN0cywgb3RoZXJ3aXNlIGBFeGNlcHRpb25gIG9iamVjdHMgYXJlIGJ1aWx0LlxuICAqXG4gICogRGVmYXVsdHMgdG8gYGZhbHNlYCBmb3IgYnJvd3NlciB1c2U6IHRocm93aW5nIGFuIGBFeGNlcHRpb25gIGluIGNocm9tZVxuICAqIGRpc3BsYXlzIHRoZSBlcnJvciBzdGFjayB1c2luZyBzb3VyY2UtbWFwcyB3aGVuIGF2YWlsYWJsZS4gSW4gY29udHJhc3RcbiAgKiB0aHJvd2luZyBhbiBgRXJyb3JgIG9iamVjdCBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgcmVsYXRpdmUgdG8gdGhlXG4gICogYnVuZGxlZCBmaWxlLCB3aGljaCBpcyBoYXJkZXIgdG8gcmVhZC5cbiAgKlxuICAqIFVzZWQgYXMgYHRydWVgIGZvciB0ZXN0IHJ1bnMgaW4gSmVzdDogdGhyb3dpbmcgYW4gYEVycm9yYCB3aWxsIGJlXG4gICogcmVwb3J0ZWQgaW4gdGhlIHRlc3QgcmVwb3J0LCB3aGlsZSB0aHJvd2luZyBhIGN1c3RvbSBvYmplY3QgKGxpa2VcbiAgKiBgRXhjZXB0aW9uYCkgd2l0aGluIGEgbWF0Y2hlciByZXN1bHRzIGluIHRoZSBleHBlY3RhdGlvbiBoYW5naW5nXG4gICogaW5kZWZpbml0ZWx5LlxuICAqXG4gICogQHR5cGUge0Jvb2xlYW59XG4gICogQGRlZmF1bHQgZmFsc2VcbiAgKlxuICAqIEBtZW1iZXJvZiBSYWMuRXhjZXB0aW9uXG4gICovXG4gIHN0YXRpYyBidWlsZHNFcnJvcnMgPSBmYWxzZTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgYnVpbGRzIHRocm93YWJsZSBvYmplY3RzIHdpdGggdGhlIGdpdmVuXG4gICogYG5hbWVgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgZmFjdG9yeSA9IFJhYy5FeGNlcHRpb24ubmFtZWQoJ05vdEFQYW5ncmFtJylcbiAgKiBmYWN0b3J5LmV4Y2VwdGlvbk5hbWUgLy8gcmV0dXJucyAnTm90QVBhbmdyYW0nXG4gICogZmFjdG9yeSgnV2FsdHosIGJhZCBueW1waCcpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnRXhjZXB0aW9uOk5vdEFQYW5ncmFtIC0gV2FsdHosIGJhZCBueW1waCdcbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgZm9yIHRoZSBwcm9kdWNlZCB0aHJvd2FibGUgb2JqZWN0c1xuICAqIEByZXR1cm4ge1JhYy5FeGNlcHRpb25+bmFtZWRGYWN0b3J5fVxuICAqL1xuICBzdGF0aWMgbmFtZWQobmFtZSkge1xuICAgIC8qKlxuICAgICogRmFjdG9yeSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSB0aHJvd2FibGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuXG4gICAgKiBgbWVzc2FnZWAuXG4gICAgKlxuICAgICogQGNhbGxiYWNrIFJhYy5FeGNlcHRpb25+bmFtZWRGYWN0b3J5XG4gICAgKlxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGV4Y2VwdGlvbk5hbWVcbiAgICAqICAgVGhlIG5hbWUgZm9yIHRoZSBwcm9kdWNlZCB0aHJvd2FibGUgb2JqZWN0c1xuICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAqICAgVGhlIG1lc3NhZ2UgZm9yIHRoZSBwcm9kdWNlZCB0aHJvd2FibGUgb2JqZWN0LlxuICAgICpcbiAgICAqIEByZXR1cm4ge0V4Y2VwdGlvbnxFcnJvcn1cbiAgICAqL1xuICAgIGxldCBmdW5jID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChFeGNlcHRpb24uYnVpbGRzRXJyb3JzKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICBlcnJvci5uYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEV4Y2VwdGlvbihuYW1lLCBtZXNzYWdlKTtcbiAgICB9O1xuXG4gICAgZnVuYy5leGNlcHRpb25OYW1lID0gbmFtZTtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuXG4gIHN0YXRpYyBkcmF3ZXJOb3RTZXR1cCAgICAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnRHJhd2VyTm90U2V0dXAnKTtcbiAgc3RhdGljIGZhaWxlZEFzc2VydCAgICAgICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdGYWlsZWRBc3NlcnQnKTtcbiAgc3RhdGljIGludmFsaWRPYmplY3RUeXBlICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdJbnZhbGlkT2JqZWN0VHlwZScpO1xuICBzdGF0aWMgYWJzdHJhY3RGdW5jdGlvbkNhbGxlZCAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0Fic3RyYWN0RnVuY3Rpb25DYWxsZWQnKTtcbiAgLy8gVE9ETzogbWlncmF0ZSByZXN0IG9mIGludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gIHN0YXRpYyBpbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbiA9IEV4Y2VwdGlvbi5uYW1lZCgnSW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24nKTtcblxuICAvLyBpbnZhbGlkUGFyYW1ldGVyQ29tYmluYXRpb246ICdJbnZhbGlkIHBhcmFtZXRlciBjb21iaW5hdGlvbicsXG5cbiAgLy8gaW52YWxpZE9iamVjdFRvRHJhdzogJ0ludmFsaWQgb2JqZWN0IHRvIGRyYXcnLFxuICAvLyBpbnZhbGlkT2JqZWN0VG9BcHBseTogJ0ludmFsaWQgb2JqZWN0IHRvIGFwcGx5JyxcblxufSAvLyBjbGFzcyBFeGNlcHRpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4Y2VwdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBJbnRlcm5hbCB1dGlsaXRpZXMuXG4qXG4qIEF2YWlsYWJsZSB0aHJvdWdoIGB7QGxpbmsgUmFjLnV0aWxzfWAgb3IgW2ByYWMudXRpbHNgXXtAbGluayBSYWMjdXRpbHN9LlxuKlxuKiBAbmFtZXNwYWNlIHV0aWxzXG4qL1xuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIHBhc3NlZCBwYXJhbWV0ZXJzIGFyZSBvYmplY3RzIG9yIHByaW1pdGl2ZXMuIElmIGFueVxuKiBwYXJhbWV0ZXIgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gXG4qIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi4oT2JqZWN0fHByaW1pdGl2ZSl9IHBhcmFtZXRlcnNcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRFeGlzdHNcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gZnVuY3Rpb24oLi4ucGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgaWYgKGl0ZW0gPT09IG51bGwpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRm91bmQgbnVsbCwgZXhwZWN0aW5nIGVsZW1lbnQgdG8gZXhpc3QgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBGb3VuZCB1bmRlZmluZWQsIGV4cGVjdGluZyBlbGVtZW50IHRvIGV4aXN0IGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBvYmplY3RzIG9yIHRoZSBnaXZlbiBgdHlwZWAsIG90aGVyd2lzZSBhXG4qIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIFdoZW4gYW55IG1lbWJlciBvZiBgZWxlbWVudHNgIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgdGhlIGV4Y2VwdGlvbiBpc1xuKiBhbHNvIHRocm93bi5cbipcbiogQHBhcmFtIHtmdW5jdGlvbn0gdHlwZVxuKiBAcGFyYW0gey4uLk9iamVjdH0gZWxlbWVudHNcbipcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRUeXBlXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydFR5cGUgPSBmdW5jdGlvbih0eXBlLCAuLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiB0eXBlKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBleHBlY3RlZC10eXBlLW5hbWU6JHt0eXBlLm5hbWV9IGVsZW1lbnQ6JHtpdGVtfWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgbnVtYmVyIHByaW1pdGl2ZXMgYW5kIG5vdCBOYU4sIG90aGVyd2lzZVxuKiBhIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uTnVtYmVyfSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydE51bWJlclxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnROdW1iZXIgPSBmdW5jdGlvbiguLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gJ251bWJlcicgfHwgaXNOYU4oaXRlbSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBudW1iZXIgcHJpbWl0aXZlIC0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9IGVsZW1lbnQ6JHtpdGVtfWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgc3RyaW5nIHByaW1pdGl2ZXMsIG90aGVyd2lzZVxuKiBhIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uU3RyaW5nfSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydFN0cmluZ1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRTdHJpbmcgPSBmdW5jdGlvbiguLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBzdHJpbmcgcHJpbWl0aXZlIC0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9IGVsZW1lbnQ6JHtpdGVtfWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgYm9vbGVhbiBwcmltaXRpdmVzLCBvdGhlcndpc2UgYVxuKiBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLkJvb2xlYW59IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0Qm9vbGVhblxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRCb29sZWFuID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIGJvb2xlYW4gcHJpbWl0aXZlIC0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9IGVsZW1lbnQ6JHtpdGVtfWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIFJldHVybnMgdGhlIGNvbnN0cnVjdG9yIG5hbWUgb2YgYG9iamAsIG9yIGl0cyB0eXBlIG5hbWUuXG4qIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBkZWJ1Z2dpbmcgYW5kIGVycm9ycy5cbipcbiogQHBhcmFtIHtPYmplY3R9IG9iaiAtIEFuIGBPYmplY3RgIHRvIGdldCBpdHMgdHlwZSBuYW1lXG4qIEByZXR1cm5zIHtTdHJpbmd9XG4qXG4qIEBmdW5jdGlvbiB0eXBlTmFtZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZnVuY3Rpb24gdHlwZU5hbWUob2JqKSB7XG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gJ3VuZGVmaW5lZCc7IH1cbiAgaWYgKG9iaiA9PT0gbnVsbCkgeyByZXR1cm4gJ251bGwnOyB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicgJiYgb2JqLm5hbWUgIT0gbnVsbCkge1xuICAgIHJldHVybiBvYmoubmFtZSA9PSAnJ1xuICAgICAgPyBgZnVuY3Rpb25gXG4gICAgICA6IGBmdW5jdGlvbjoke29iai5uYW1lfWA7XG4gIH1cbiAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lID8/IHR5cGVvZiBvYmo7XG59XG5leHBvcnRzLnR5cGVOYW1lID0gdHlwZU5hbWU7XG5cblxuLyoqXG4qIEFkZHMgYSBjb25zdGFudCB0byB0aGUgZ2l2ZW4gb2JqZWN0LCB0aGUgY29uc3RhbnQgaXMgbm90IGVudW1lcmFibGUgYW5kXG4qIG5vdCBjb25maWd1cmFibGUuXG4qXG4qIEBmdW5jdGlvbiBhZGRDb25zdGFudFRvXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFkZENvbnN0YW50VG8gPSBmdW5jdGlvbihvYmosIHByb3BOYW1lLCB2YWx1ZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KTtcbn1cblxuXG4vKipcbiogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBgbnVtYmVyYCBkaXNwbGF5aW5nIGFsbCBhdmFpbGFibGVcbiogZGlnaXRzLCBvciBmb3JtbWF0dGVkIHVzZWQgZml4ZWQtcG9pbnQgbm90YXRpb24gbGltaXRlZCB0byBgZGlnaXRzYC5cbipcbiogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciAtIFRoZSBudW1iZXIgdG8gZm9ybWF0XG4qIEBwYXJhbSB7P051bWJlcn0gW2RpZ2l0c10gLSBUaGUgYW1vdW50IG9mIGRpZ2l0cyB0byBwcmludCwgb3IgYG51bGxgIHRvXG4qIHByaW50IGFsbCBkaWdpdHNcbipcbiogQHJldHVybnMge1N0cmluZ31cbipcbiogQGZ1bmN0aW9uIGN1dERpZ2l0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5jdXREaWdpdHMgPSBmdW5jdGlvbihudW1iZXIsIGRpZ2l0cyA9IG51bGwpIHtcbiAgcmV0dXJuIGRpZ2l0cyA9PT0gbnVsbFxuICAgID8gbnVtYmVyLnRvU3RyaW5nKClcbiAgICA6IG51bWJlci50b0ZpeGVkKGRpZ2l0cyk7XG59XG5cblxuLyoqXG4qIFJldHVybnMgYHRydWVgIGlmIHRleHQgb3JpZW50ZWQgd2l0aCB0aGUgZ2l2ZW4gYGFuZ2xlVHVybmAgd291bGQgYmVcbiogcHJpbnRlZCB1cHJpZ2h0LlxuKlxuKiBBbmdsZSB0dXJuIHZhbHVlcyBpbiB0aGUgcmFuZ2UgX1szLzQsIDEvNClfIGFyZSBjb25zaWRlcmVkIHVwcmlnaHQuXG4qXG4qIEBwYXJhbSB7TnVtYmVyfSBhbmdsZVR1cm4gLSBUaGUgdHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUgdG8gY2hlY2tcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBpc1VwcmlnaHRUZXh0XG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmlzVXByaWdodFRleHQgPSBmdW5jdGlvbihhbmdsZVR1cm4pIHtcbiAgcmV0dXJuIGFuZ2xlVHVybiA+PSAzLzQgfHwgYW5nbGVUdXJuIDwgMS80O1xufVxuXG4iXX0=
