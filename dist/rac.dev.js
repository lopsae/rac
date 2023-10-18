// RAC - ruler-and-compass - 1.3.0 1375-a1012dd 2023-10-18T20:11:17.183Z
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
  version: '1.3.0',

  /**
  * Build of the package. Exposed through
  * [`Rac.build`]{@link Rac.build}.
  * @constant {String} build
  * @memberof versioning#
  */
  build: '1375-a1012dd',

  /**
  * Date of build of the package. Exposed through
  * [`Rac.dated`]{@link Rac.dated}.
  * @constant {String} dated
  * @memberof versioning#
  */
  dated: '2023-10-18T20:11:17.183Z'
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


  /**
  * Returns a new `Ray` tangent to the arc starting at `startPoint()` and
  * towards the arc's orientation.
  */
  startTangentRay() {
    let tangentAngle = this.start.perpendicular(this.clockwise);
    return this.startPoint().ray(tangentAngle);
  }


  /**
  * Returns a new `Ray` tangent to the arc starting at `endPoint()` and
  * against the arc's orientation.
  */
  endTangentRay() {
    let tangentAngle = this.end.perpendicular(!this.clockwise);
    return this.endPoint().ray(tangentAngle);
  }


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
  * Returns the given `value` clamped to `[startInset, length-endInset]`.
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
  * `length * ratio` from `ray.start`.
  *
  * When `ratio` is negative, the resulting `Point` is located in the
  * opposite direction of the segment's ray.
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
  * When `endAngle` is ommited or `null`, the segment's angle is used as
  * default resulting in a complete-circle arc.
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


  /**
  * Creates a new `Color` instance from a hexadecimal triplet or quadruplet
  * string.
  *
  * The `hexString` is expected to have 6 or 8 hex digits for the RGB and
  * optionally alpha channels. It can start with `#`. `AABBCC` and
  * `#CCDDEEFF` are both valid inputs.
  *
  * The three digit shorthand is not yet supported.
  *
  * An error is thrown if `hexString` is misformatted or cannot be parsed.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {String} hexString - The hex string to interpret
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
* Can be used with `fill.apply()` to apply the fill settings globally, or
* as the parameter of `drawable.draw(fill)` to apply the fill only during
* that call.
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

    /**
    * The `Color` to apply for fills, when `null` a *no-fill* setting is
    * applied.
    * @type {?Color}
    */
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
* Can be used with `stroke.apply()` to apply the stroke settings globally,
* or as the parameter of `drawable.draw(stroke)` to apply the stroke only
* during that call.
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

    /**
    * The `Color` to apply for strokes, when `null` no color setting is
    * applied.
    * @type {?Color}
    */
    this.color = color;

    /**
    * The weight to apply for strokes, when `null` no weight setting is
    * applied.
    * @type {?Number}
    */
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
  * Returns a new `Color` instance from a hexadecimal triplet or quadruplet
  * string.
  *
  * The `hexString` is expected to have 6 or 8 hex digits for the RGB and
  * optionally alpha channels. It can start with `#`. `AABBCC` and
  * `#CCDDEEFF` are both valid inputs.
  *
  * The three digit shorthand is not yet supported.
  *
  * An error is thrown if `hexString` is misformatted or cannot be parsed.
  *
  * @param {String} hexString - The hex string to interpret
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uaW5nLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5Gb3JtYXQuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuRm9ybWF0LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9XQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2NENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2dCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNubUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2VTdHJpY3QnO1xuXG4vLyBSdWxlciBhbmQgQ29tcGFzcyAtIHZlcnNpb24gYW5kIGJ1aWxkXG4vKipcbiogQ29udGFpbmVyIG9mIHRoZSB2ZXJzaW9uaW5nIGRhdGEgZm9yIHRoZSBwYWNrYWdlLlxuKiBAbmFtZXNwYWNlIHZlcnNpb25pbmdcbiovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgKiBWZXJzaW9uIG9mIHRoZSBwYWNrYWdlLiBFeHBvc2VkIHRocm91Z2hcbiAgKiBbYFJhYy52ZXJzaW9uYF17QGxpbmsgUmFjLnZlcnNpb259LlxuICAqIEBjb25zdGFudCB7U3RyaW5nfSB2ZXJzaW9uXG4gICogQG1lbWJlcm9mIHZlcnNpb25pbmcjXG4gICovXG4gIHZlcnNpb246ICcxLjMuMCcsXG5cbiAgLyoqXG4gICogQnVpbGQgb2YgdGhlIHBhY2thZ2UuIEV4cG9zZWQgdGhyb3VnaFxuICAqIFtgUmFjLmJ1aWxkYF17QGxpbmsgUmFjLmJ1aWxkfS5cbiAgKiBAY29uc3RhbnQge1N0cmluZ30gYnVpbGRcbiAgKiBAbWVtYmVyb2YgdmVyc2lvbmluZyNcbiAgKi9cbiAgYnVpbGQ6ICcxMzc1LWExMDEyZGQnLFxuXG4gIC8qKlxuICAqIERhdGUgb2YgYnVpbGQgb2YgdGhlIHBhY2thZ2UuIEV4cG9zZWQgdGhyb3VnaFxuICAqIFtgUmFjLmRhdGVkYF17QGxpbmsgUmFjLmRhdGVkfS5cbiAgKiBAY29uc3RhbnQge1N0cmluZ30gZGF0ZWRcbiAgKiBAbWVtYmVyb2YgdmVyc2lvbmluZyNcbiAgKi9cbiAgZGF0ZWQ6ICcyMDIzLTEwLTE4VDIwOjExOjE3LjE4M1onXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gUnVsZXIgYW5kIENvbXBhc3NcbmNvbnN0IHZlcnNpb25pbmcgPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uaW5nJylcbmNvbnN0IHZlcnNpb24gPSB2ZXJzaW9uaW5nLnZlcnNpb247XG5jb25zdCBidWlsZCAgID0gdmVyc2lvbmluZy5idWlsZDtcbmNvbnN0IGRhdGVkICAgPSB2ZXJzaW9uaW5nLmRhdGVkO1xuXG5cbi8qKlxuKiBSb290IGNsYXNzIG9mIFJBQy4gQWxsIGRyYXdhYmxlLCBzdHlsZSwgY29udHJvbCwgYW5kIGRyYXdlciBjbGFzc2VzIGFyZVxuKiBjb250YWluZWQgaW4gdGhpcyBjbGFzcy5cbipcbiogQW4gaW5zdGFuY2UgbXVzdCBiZSBjcmVhdGVkIHdpdGggYG5ldyBSYWMoKWAgaW4gb3JkZXIgdG9cbiogYnVpbGQgZHJhd2FibGUsIHN0eWxlLCBhbmQgb3RoZXIgb2JqZWN0cy5cbipcbiogVG8gcGVyZm9ybSBkcmF3aW5nIG9wZXJhdGlvbnMsIGEgZHJhd2VyIG11c3QgYmUgc2V0dXAgd2l0aFxuKiBbYHNldHVwRHJhd2VyYF17QGxpbmsgUmFjI3NldHVwRHJhd2VyfS4gQ3VycmVudGx5IHRoZSBvbmx5IGF2YWlsYWJsZVxuKiBpbXBsZW1lbnRhdGlvbiBpcyBbYFA1RHJhd2VyYF17QGxpbmsgUmFjLlA1RHJhd2VyfS5cbiovXG5jbGFzcyBSYWMge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgUmFjLiBUaGUgbmV3IGluc3RhbmNlIGhhcyBubyBgZHJhd2VyYCBzZXR1cC5cbiAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvKipcbiAgICAqIFZlcnNpb24gb2YgdGhlIGluc3RhbmNlLCBlcXVpdmFsZW50IHRvIGB7QGxpbmsgUmFjLnZlcnNpb259YC5cbiAgICAqXG4gICAgKiBAZXhhbXBsZVxuICAgICogcmFjLnZlcnNpb24gLy8gcmV0dXJucyBFLmcuICcxLjIuMSdcbiAgICAqXG4gICAgKiBAY29uc3RhbnQge1N0cmluZ30gdmVyc2lvblxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50VG8odGhpcywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4gICAgLyoqXG4gICAgKiBCdWlsZCBvZiB0aGUgaW5zdGFuY2UsIGVxdWl2YWxlbnQgdG8gYHtAbGluayBSYWMuYnVpbGR9YC5cbiAgICAqXG4gICAgKiBAZXhhbXBsZVxuICAgICogcmFjLmJ1aWxkIC8vIHJldHVybnMgRS5nLiAnMTA1Ny05NGIwNTlkJ1xuICAgICpcbiAgICAqIEBjb25zdGFudCB7U3RyaW5nfSBidWlsZFxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50VG8odGhpcywgJ2J1aWxkJywgYnVpbGQpO1xuXG5cbiAgICAvKipcbiAgICAqIERhdGUgb2YgdGhlIGJ1aWxkIG9mIHRoZSBpbnN0YW5jZSwgZXF1aXZhbGVudCB0byBge0BsaW5rIFJhYy5kYXRlZH1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMuZGF0ZWQgLy8gcmV0dXJucyBFLmcuICcyMDIyLTEwLTEzVDIzOjA2OjEyLjUwMFonXG4gICAgKlxuICAgICogQGNvbnN0YW50IHtTdHJpbmd9IGRhdGVkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnZGF0ZWQnLCBkYXRlZCk7XG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gbnVtZXJpYyB2YWx1ZXMuIFVzZWQgZm9yXG4gICAgKiB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGJlIGludGVnZXJzLCBsaWtlIHNjcmVlbiBjb29yZGluYXRlcy4gVXNlZCBieVxuICAgICogW2BlcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfS5cbiAgICAqXG4gICAgKiBXaGVuIGNoZWNraW5nIGZvciBlcXVhbGl0eSBgeGAgaXMgZXF1YWwgdG8gbm9uLWluY2x1c2l2ZVxuICAgICogYCh4LWVxdWFsaXR5VGhyZXNob2xkLCB4K2VxdWFsaXR5VGhyZXNob2xkKWA6XG4gICAgKiArIGB4YCBpcyAqKm5vdCBlcXVhbCoqIHRvIGB4IMKxIGVxdWFsaXR5VGhyZXNob2xkYFxuICAgICogKyBgeGAgaXMgKiplcXVhbCoqIHRvIGB4IMKxIGVxdWFsaXR5VGhyZXNob2xkLzJgXG4gICAgKlxuICAgICogRHVlIHRvIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiBzb21lIG9wZXJ0YXRpb24gbGlrZSBpbnRlcnNlY3Rpb25zXG4gICAgKiBjYW4gcmV0dXJuIG9kZCBvciBvc2NpbGF0aW5nIHZhbHVlcy4gVGhpcyB0aHJlc2hvbGQgaXMgdXNlZCB0byBzbmFwXG4gICAgKiB2YWx1ZXMgdG9vIGNsb3NlIHRvIGEgbGltaXQsIGFzIHRvIHByZXZlbnQgb3NjaWxhdGluZyBlZmVjdHMgaW5cbiAgICAqIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgYmFzZWQgb24gYDEvMTAwMGAgb2YgYSBwb2ludC5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMC4wMDFcbiAgICAqL1xuICAgIHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMTtcblxuXG4gICAgLyoqXG4gICAgKiBWYWx1ZSB1c2VkIHRvIGRldGVybWluZSBlcXVhbGl0eSBiZXR3ZWVuIHR3byB1bml0YXJ5IG51bWVyaWMgdmFsdWVzLlxuICAgICogVXNlZCBmb3IgdmFsdWVzIHRoYXQgdGVuZCB0byBleGlzdCBpbiB0aGUgYFswLCAxXWAgcmFuZ2UsIGxpa2VcbiAgICAqIFtgYW5nbGUudHVybmBde0BsaW5rIFJhYy5BbmdsZSN0dXJufS4gVXNlZCBieVxuICAgICogW2B1bml0YXJ5RXF1YWxzYF17QGxpbmsgUmFjI3VuaXRhcnlFcXVhbHN9LlxuICAgICpcbiAgICAqIEVxdWFsaXR5IGxvZ2ljIGlzIHRoZSBzYW1lIGFzXG4gICAgKiBbYGVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfS5cbiAgICAqXG4gICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBiYXNlZCBvbiAxLzEwMDAgb2YgdGhlIHR1cm4gb2YgYW4gY29tcGxldGVcbiAgICAqIGNpcmNsZSBhcmMgb2YgcmFkaXVzIDUwMDpcbiAgICAqIGBgYFxuICAgICogMS8oNTAwKjYuMjgpLzEwMDAgPSAwLjAwMF8wMDBfMzE4NDcxMzM4XG4gICAgKiBgYGBcbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMC4wMDBfMDAwXzNcbiAgICAqL1xuICAgIHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkID0gMC4wMDAwMDAzO1xuXG5cbiAgICAvKipcbiAgICAqIENvbnRhaW5lciBvZiB1dGlsaXR5IGZ1bmN0aW9ucy4gU2VlIHRoZVxuICAgICogW2B1dGlsc2AgbmFtZXNwYWNlXXtAbGluayB1dGlsc30gZm9yIHRoZSBhdmFpbGFibGUgbWVtYmVycy5cbiAgICAqXG4gICAgKiBBbHNvIGF2YWlsYWJsZSB0aHJvdWdoIGB7QGxpbmsgUmFjLnV0aWxzfWAuXG4gICAgKlxuICAgICogQHR5cGUge3V0aWxzfVxuICAgICovXG4gICAgdGhpcy51dGlscyA9IHV0aWxzXG5cbiAgICB0aGlzLnN0YWNrID0gW107XG4gICAgdGhpcy5zaGFwZVN0YWNrID0gW107XG4gICAgdGhpcy5jb21wb3NpdGVTdGFjayA9IFtdO1xuXG5cbiAgICAvKipcbiAgICAqIERlZmF1bHRzIGZvciB0aGUgb3B0aW9uYWwgcHJvcGVydGllcyBvZlxuICAgICogW2BUZXh0LkZvcm1hdGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdH0uXG4gICAgKlxuICAgICogV2hlbiBhIFtgVGV4dGBde0BsaW5rIFJhYy5UZXh0fSBpcyBkcmF3IHdoaWNoXG4gICAgKiBbYGZvcm1hdC5mb250YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2ZvbnR9IG9yXG4gICAgKiBbYGZvcm1hdC5zaXplYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3NpemV9IGFyZSBzZXQgdG8gYG51bGxgLCB0aGVcbiAgICAqIHZhbHVlcyBzZXQgaGVyZSBhcmUgdXNlZCBpbnN0ZWFkLlxuICAgICpcbiAgICAqIEBwcm9wZXJ0eSB7P1N0cmluZ30gZm9udD1udWxsXG4gICAgKiAgIERlZmF1bHQgZm9udCwgdXNlZCB3aGVuIGRyYXdpbmcgYSBgVGV4dGAgd2hpY2hcbiAgICAqICAgW2Bmb3JtYXQuZm9udGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNmb250fSBpcyBzZXQgdG8gYG51bGxgOyB3aGVuXG4gICAgKiAgIHNldCB0byBgbnVsbGAgdGhlIGZvbnQgaXMgbm90IHNldCB1cG9uIGRyYXdpbmdcbiAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzaXplPTE1XG4gICAgKiAgIERlZmF1bHQgc2l6ZSwgdXNlZCB3aGVuIGRyYXdpbmcgYSBgVGV4dGAgd2hpY2hcbiAgICAqICAgW2Bmb3JtYXQuc2l6ZWBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNzaXplfSBpcyBzZXQgdG8gYG51bGxgXG4gICAgKlxuICAgICogQHR5cGUge09iamVjdH1cbiAgICAqL1xuICAgIHRoaXMudGV4dEZvcm1hdERlZmF1bHRzID0ge1xuICAgICAgZm9udDogbnVsbCxcbiAgICAgIHNpemU6IDE1XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgKiBEcmF3ZXIgb2YgdGhlIGluc3RhbmNlLiBUaGlzIG9iamVjdCBoYW5kbGVzIHRoZSBkcmF3aW5nIGZvciBhbGxcbiAgICAqIGRyYXdhYmxlIG9iamVjdCBjcmVhdGVkIHVzaW5nIGB0aGlzYC5cbiAgICAqIEB0eXBlIHs/T2JqZWN0fVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5kcmF3ZXIgPSBudWxsO1xuXG4gICAgcmVxdWlyZSgnLi9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucycpKHRoaXMpO1xuXG4gICAgcmVxdWlyZSgnLi9zdHlsZS9pbnN0YW5jZS5Db2xvcicpICAgICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9zdHlsZS9pbnN0YW5jZS5TdHJva2UnKSAgICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9zdHlsZS9pbnN0YW5jZS5GaWxsJykgICAgICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZScpICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5Qb2ludCcpICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5SYXknKSAgICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50JykodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5BcmMnKSAgICAodGhpcyk7XG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5CZXppZXInKSAodGhpcyk7XG5cbiAgICAvLyBEZXBlbmRzIG9uIGluc3RhbmNlLlBvaW50IGFuZCBpbnN0YW5jZS5BbmdsZSBiZWluZyBhbHJlYWR5IHNldHVwXG4gICAgcmVxdWlyZSgnLi9kcmF3YWJsZS9pbnN0YW5jZS5UZXh0LkZvcm1hdCcpKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuVGV4dCcpICAgICAgICh0aGlzKTtcblxuXG5cbiAgICAvKipcbiAgICAqIENvbnRyb2xsZXIgb2YgdGhlIGluc3RhbmNlLiBUaGlzIG9iamVjcyBoYW5kbGVzIGFsbCBvZiB0aGUgY29udHJvbHNcbiAgICAqIGFuZCBwb2ludGVyIGV2ZW50cyByZWxhdGVkIHRvIHRoaXMgaW5zdGFuY2Ugb2YgYFJhY2AuXG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgUmFjLkNvbnRyb2xsZXIodGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgdGhlIGRyYXdlciBmb3IgdGhlIGluc3RhbmNlLiBDdXJyZW50bHkgb25seSBhIHA1LmpzIGluc3RhbmNlIGlzXG4gICogc3VwcG9ydGVkLlxuICAqXG4gICogVGhlIGRyYXdlciB3aWxsIGFsc28gcG9wdWxhdGUgc29tZSBjbGFzc2VzIHdpdGggcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAqIHJlbGV2YW50IHRvIHRoZSBkcmF3ZXIuIEZvciBwNS5qcyB0aGlzIGluY2x1ZGUgYGFwcGx5YCBmdW5jdGlvbnMgZm9yXG4gICogY29sb3JzIGFuZCBzdHlsZSBvYmplY3QsIGFuZCBgdmVydGV4YCBmdW5jdGlvbnMgZm9yIGRyYXdhYmxlIG9iamVjdHMuXG4gICpcbiAgKiBAcGFyYW0ge1A1fSBwNUluc3RhbmNlXG4gICovXG4gIHNldHVwRHJhd2VyKHA1SW5zdGFuY2UpIHtcbiAgICB0aGlzLmRyYXdlciA9IG5ldyBSYWMuUDVEcmF3ZXIodGhpcywgcDVJbnN0YW5jZSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBbYGVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBhIC0gRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge051bWJlcn0gYiAtIFNlY29uZCBudW1iZXIgdG8gY29tcGFyZVxuICAqXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICovXG4gIGVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzKGEtYik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLmVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIFtgdW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI3VuaXRhcnlFcXVhbGl0eVRocmVzaG9sZH0uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gYSBGaXJzdCBudW1iZXIgdG8gY29tcGFyZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBiIFNlY29uZCBudW1iZXIgdG8gY29tcGFyZVxuICAqXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICovXG4gIHVuaXRhcnlFcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGEtYik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgcHVzaFN0YWNrKG9iaikge1xuICAgIHRoaXMuc3RhY2sucHVzaChvYmopO1xuICB9XG5cblxuICBwZWVrU3RhY2soKSB7XG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BTdGFjaygpIHtcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xuICB9XG5cblxuICBwdXNoU2hhcGUoc2hhcGUgPSBudWxsKSB7XG4gICAgc2hhcGUgPSBzaGFwZSA/PyBuZXcgUmFjLlNoYXBlKHRoaXMpO1xuICAgIHRoaXMuc2hhcGVTdGFjay5wdXNoKHNoYXBlKTtcbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cblxuXG4gIHBlZWtTaGFwZSgpIHtcbiAgICBpZiAodGhpcy5zaGFwZVN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2hhcGVTdGFja1t0aGlzLnNoYXBlU3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcFNoYXBlKCkge1xuICAgIGlmICh0aGlzLnNoYXBlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaGFwZVN0YWNrLnBvcCgpO1xuICB9XG5cblxuICBwdXNoQ29tcG9zaXRlKGNvbXBvc2l0ZSkge1xuICAgIGNvbXBvc2l0ZSA9IGNvbXBvc2l0ZSA/PyBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzKTtcbiAgICB0aGlzLmNvbXBvc2l0ZVN0YWNrLnB1c2goY29tcG9zaXRlKTtcbiAgICByZXR1cm4gY29tcG9zaXRlO1xuICB9XG5cblxuICBwZWVrQ29tcG9zaXRlKCkge1xuICAgIGlmICh0aGlzLmNvbXBvc2l0ZVN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tcG9zaXRlU3RhY2tbdGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wQ29tcG9zaXRlKCkge1xuICAgIGlmICh0aGlzLmNvbXBvc2l0ZVN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29tcG9zaXRlU3RhY2sucG9wKCk7XG4gIH1cblxufSAvLyBjbGFzcyBSYWNcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhYztcblxuXG4vLyBBbGwgY2xhc3MgKHN0YXRpYykgcHJvcGVydGllcyBzaG91bGQgYmUgZGVmaW5lZCBvdXRzaWRlIG9mIHRoZSBjbGFzc1xuLy8gYXMgdG8gcHJldmVudCBjeWNsaWMgZGVwZW5kZW5jeSB3aXRoIFJhYy5cblxuXG4vKipcbiogQ29udGFpbmVyIG9mIHV0aWxpdHkgZnVuY3Rpb25zLiBTZWUgdGhlIFtgdXRpbHNgIG5hbWVzcGFjZV17QGxpbmsgdXRpbHN9XG4qIGZvciB0aGUgYXZhaWxhYmxlIG1lbWJlcnMuXG4qXG4qIEFsc28gYXZhaWxhYmxlIHRocm91Z2ggW2ByYWMudXRpbHNgXXtAbGluayBSYWMjdXRpbHN9LlxuKlxuKiBAdmFyIHt1dGlsc31cbiogQG1lbWJlcm9mIFJhY1xuKi9cbmNvbnN0IHV0aWxzID0gcmVxdWlyZShgLi91dGlsL3V0aWxzYCk7XG5SYWMudXRpbHMgPSB1dGlscztcblxuXG4vKipcbiogVmVyc2lvbiBvZiB0aGUgY2xhc3MuIEVxdWl2YWxlbnQgdG8gdGhlIHZlcnNpb24gdXNlZCBmb3IgdGhlIG5wbSBwYWNrYWdlLlxuKlxuKiBAZXhhbXBsZVxuKiBSYWMudmVyc2lvbiAvLyByZXR1cm5zIEUuZy4gJzEuMi4xJ1xuKlxuKiBAY29uc3RhbnQge1N0cmluZ30gdmVyc2lvblxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuLyoqXG4qIEJ1aWxkIG9mIHRoZSBjbGFzcy4gSW50ZW5kZWQgZm9yIGRlYnVnZ2luZyBwdXJwb3VzZXMuXG4qXG4qIENvbnRhaW5zIGEgY29tbWl0LWNvdW50IGFuZCBzaG9ydC1oYXNoIG9mIHRoZSByZXBvc2l0b3J5IHdoZW4gdGhlIGJ1aWxkXG4qIHdhcyBkb25lLlxuKlxuKiBAZXhhbXBsZVxuKiBSYWMuYnVpbGQgLy8gcmV0dXJucyBFLmcuICcxMDU3LTk0YjA1OWQnXG4qXG4qIEBjb25zdGFudCB7U3RyaW5nfSBidWlsZFxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdidWlsZCcsIGJ1aWxkKTtcblxuXG5cbi8qKlxuKiBEYXRlIG9mIHRoZSBidWlsZCBvZiB0aGUgY2xhc3MuIEludGVuZGVkIGZvciBkZWJ1Z2dpbmcgcHVycG91c2VzLlxuKlxuKiBDb250YWlucyBhIFtJU08tODYwMSBzdGFuZGFyZF0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPXzg2MDEpXG4qIGRhdGUgd2hlbiB0aGUgYnVpbGQgd2FzIGRvbmUuXG4qXG4qIEBleGFtcGxlXG4qIFJhYy5kYXRlZCAvLyByZXR1cm5zIEUuZy4gJzIwMjItMTAtMTNUMjM6MDY6MTIuNTAwWidcbipcbiogQGNvbnN0YW50IHtTdHJpbmd9IGRhdGVkXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ2RhdGVkJywgZGF0ZWQpO1xuXG5cbi8qKlxuKiBUYXUsIGVxdWFsIHRvIGBNYXRoLlBJICogMmAuXG4qXG4qIFNlZSBbVGF1IE1hbmlmZXN0b10oaHR0cHM6Ly90YXVkYXkuY29tL3RhdS1tYW5pZmVzdG8pLlxuKlxuKiBAY29uc3RhbnQge051bWJlcn0gVEFVXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ1RBVScsIE1hdGguUEkgKiAyKTtcblxuXG4vLyBFeGNlcHRpb25cblJhYy5FeGNlcHRpb24gPSByZXF1aXJlKCcuL3V0aWwvRXhjZXB0aW9uJyk7XG5cblxuLy8gUHJvdG90eXBlIGZ1bmN0aW9uc1xucmVxdWlyZSgnLi9hdHRhY2hQcm90b0Z1bmN0aW9ucycpKFJhYyk7XG5cblxuLy8gUDVEcmF3ZXJcblJhYy5QNURyYXdlciA9IHJlcXVpcmUoJy4vcDVEcmF3ZXIvUDVEcmF3ZXInKTtcblxuXG4vLyBDb2xvclxuUmFjLkNvbG9yID0gcmVxdWlyZSgnLi9zdHlsZS9Db2xvcicpO1xuXG5cbi8vIFN0cm9rZVxuUmFjLlN0cm9rZSA9IHJlcXVpcmUoJy4vc3R5bGUvU3Ryb2tlJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5TdHJva2UpO1xuXG5cbi8vIEZpbGxcblJhYy5GaWxsID0gcmVxdWlyZSgnLi9zdHlsZS9GaWxsJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5GaWxsKTtcblxuXG4vLyBTdHlsZUNvbnRhaW5lclxuUmFjLlN0eWxlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9zdHlsZS9TdHlsZUNvbnRhaW5lcicpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3R5bGVDb250YWluZXIpO1xuXG5cbi8vIEFuZ2xlXG5SYWMuQW5nbGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0FuZ2xlJyk7XG5SYWMuQW5nbGUucHJvdG90eXBlLmxvZyA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZztcblxuXG4vLyBQb2ludFxuUmFjLlBvaW50ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9Qb2ludCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuUG9pbnQpO1xuXG5cbi8vIFJheVxuUmFjLlJheSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvUmF5Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5SYXkpO1xuXG5cbi8vIFNlZ21lbnRcblJhYy5TZWdtZW50ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TZWdtZW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5TZWdtZW50KTtcblxuXG4vLyBBcmNcblJhYy5BcmMgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0FyYycpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQXJjKTtcblxuXG4vLyBUZXh0XG5SYWMuVGV4dCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvVGV4dCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuVGV4dCk7XG5cblxuLy8gQmV6aWVyXG5SYWMuQmV6aWVyID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9CZXppZXInKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkJlemllcik7XG5cblxuLy8gQ29tcG9zaXRlXG5SYWMuQ29tcG9zaXRlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9Db21wb3NpdGUnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkNvbXBvc2l0ZSk7XG5cblxuLy8gU2hhcGVcblJhYy5TaGFwZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvU2hhcGUnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNoYXBlKTtcblxuXG4vLyBFYXNlRnVuY3Rpb25cblJhYy5FYXNlRnVuY3Rpb24gPSByZXF1aXJlKCcuL3V0aWwvRWFzZUZ1bmN0aW9uJyk7XG5cblxuLy8gQ29udHJvbGxlclxuUmFjLkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2wvQ29udHJvbGxlcicpO1xuXG5cbi8vIENvbnRyb2xcblJhYy5Db250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL0NvbnRyb2wnKTtcblxuXG4vLyBSYXlDb250cm9sXG5SYWMuUmF5Q29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9SYXlDb250cm9sJyk7XG5cblxuLy8gQXJjQ29udHJvbFxuUmFjLkFyY0NvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQXJjQ29udHJvbCcpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi9SYWMnKTtcblxuXG4vKipcbiogVGhpcyBuYW1lc3BhY2UgbGlzdHMgdXRpbGl0eSBmdW5jdGlvbnMgYXR0YWNoZWQgdG8gYW4gaW5zdGFuY2Ugb2ZcbiogYHtAbGluayBSYWN9YCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIEVhY2ggZHJhd2FibGUgYW5kIHN0eWxlIGNsYXNzIGdldHNcbiogYSBjb3JyZXNwb25kaW5nIGZ1bmN0aW9uIGxpa2UgW2ByYWMuUG9pbnRgXXtAbGluayBpbnN0YW5jZS5Qb2ludH0gb3JcbiogW2ByYWMuQ29sb3JgXXtAbGluayBpbnN0YW5jZS5Db2xvcn0uXG4qXG4qIERyYXdhYmxlIGFuZCBzdHlsZSBvYmplY3RzIHJlcXVpcmUgZm9yIGNvbnN0cnVjdGlvbiBhIHJlZmVyZW5jZSB0byBhXG4qIGBSYWNgIGluc3RhbmNlIGluIG9yZGVyIHRvIHBlcmZvcm0gZHJhd2luZyBvcGVyYXRpb25zLiBUaGUgYXR0YWNoZWRcbiogZnVuY3Rpb25zIGJ1aWxkIG5ldyBvYmplY3RzIHVzaW5nIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYWxzbyBzZXR1cCB3aXRoIHJlYWR5LW1hZGUgY29udmVuaWVuY2Ugb2JqZWN0cyBmb3JcbiogbWFueSB1c3VhbCB2YWx1ZXMgbGlrZSBbYHJhYy5BbmdsZS5ub3J0aGBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI25vcnRofSBvclxuKiBbYHJhYy5Qb2ludC56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb30uXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2VcbiovXG5cblxuLy8gQXR0YWNoZXMgY29udmVuaWVuY2UgZnVuY3Rpb25zIHRvIGNyZWF0ZSBvYmplY3RzIHdpdGggdGhpcyBpbnN0YW5jZSBvZlxuLy8gUmFjLiBFLmcuIGByYWMuQ29sb3IoLi4uKWAsIGByYWMuUG9pbnQoLi4uKWAuXG4vL1xuLy8gVGhlc2UgZnVuY3Rpb25zIGFyZSBhdHRhY2hlZCBhcyBwcm9wZXJ0aWVzIChpbnN0ZWFkIG9mIGludG8gdGhlXG4vLyBwcm90b3R5cGUpIGJlY2F1c2UgdGhlc2UgYXJlIGxhdGVyIHBvcHVsYXRlZCB3aXRoIG1vcmUgcHJvcGVydGllcyBhbmRcbi8vIG1ldGhvZHMsIGFuZCB0aHVzIG5lZWQgdG8gYmUgaW5kZXBlbmRlbnQgZm9yIGVhY2ggaW5zdGFuY2UuXG4vL1xuLy8gUmVhZHkgbWFkZSBvYmplY3RzIGF0dGFjaGVkIHRvIHRoZXNlIGZ1bmN0aW9ucyAoRS5nLiBgcmFjLlBvaW50Lnplcm9gKVxuLy8gYXJlIGRlZmluZWQgaW4gdGhlIGBpbnN0YW5jZS5Qb2ludC5qc2AgYW5kIGVxdWl2YWxlbnQgZmlsZXMuXG4vL1xuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYENvbG9yYC4gVGhlIGNyZWF0ZWQgYGNvbG9yLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkNvbG9yfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBjb2xvci5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gclxuICAqIEBwYXJhbSB7TnVtYmVyfSBnXG4gICogQHBhcmFtIHtOdW1iZXJ9IGJcbiAgKiBAcGFyYW0ge051bWJlcn0gW2E9MV1cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICpcbiAgKiBAZnVuY3Rpb24gQ29sb3JcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQ29sb3IgPSBmdW5jdGlvbiBtYWtlQ29sb3IociwgZywgYiwgYSA9IDEpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5Db2xvcih0aGlzLCByLCBnLCBiLCBhKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgU3Ryb2tlYC4gVGhlIGNyZWF0ZWQgYHN0cm9rZS5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TdHJva2V9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuICAqIGxldCBzdHJva2UgPSByYWMuU3Ryb2tlKDIsIGNvbG9yKVxuICAqIHN0cm9rZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IHdlaWdodFxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSBbY29sb3I9bnVsbF1cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqXG4gICogQGZ1bmN0aW9uIFN0cm9rZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHJva2UgPSBmdW5jdGlvbiBtYWtlU3Ryb2tlKHdlaWdodCwgY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMsIHdlaWdodCwgY29sb3IpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBGaWxsYC4gVGhlIGNyZWF0ZWQgYGZpbGwucmFjYCBpc1xuICAqIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuRmlsbH1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4gICogbGV0IGZpbGwgPSByYWMuRmlsbChjb2xvcilcbiAgKiBmaWxsLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSBbY29sb3I9bnVsbF1cbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICpcbiAgKiBAZnVuY3Rpb24gRmlsbFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5GaWxsID0gZnVuY3Rpb24gbWFrZUZpbGwoY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLCBjb2xvcik7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFN0eWxlYC4gVGhlIGNyZWF0ZWQgYHN0eWxlLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlN0eWxlfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBsZXQgc3R5bGUgPSByYWMuU3R5bGUocmFjLlN0cm9rZSgyLCBjb2xvciksIHJhYy5GaWxsKGNvbG9yKSlcbiAgKiBzdHlsZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2V9IFtzdHJva2U9bnVsbF1cbiAgKiBAcGFyYW0ge1JhYy5GaWxsfSBbZmlsbD1udWxsXVxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBTdHlsZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHlsZSA9IGZ1bmN0aW9uIG1ha2VTdHlsZShzdHJva2UgPSBudWxsLCBmaWxsID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlKHRoaXMsIHN0cm9rZSwgZmlsbCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYEFuZ2xlYC4gVGhlIGNyZWF0ZWQgYGFuZ2xlLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgYW5nbGUgPSByYWMuQW5nbGUoMC4yKVxuICAqIGFuZ2xlLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlLCBpbiB0aGUgcmFuZ2UgYFtPLDEpYFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gQW5nbGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQW5nbGUgPSBmdW5jdGlvbiBtYWtlQW5nbGUodHVybikge1xuICAgIHJldHVybiBuZXcgUmFjLkFuZ2xlKHRoaXMsIHR1cm4pO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBQb2ludGAuIFRoZSBjcmVhdGVkIGBwb2ludC5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludH1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IHBvaW50ID0gcmFjLlBvaW50KDU1LCA3NylcbiAgKiBwb2ludC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGVcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gUG9pbnRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuUG9pbnQgPSBmdW5jdGlvbiBtYWtlUG9pbnQoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBSYXlgIHdpdGggdGhlIGdpdmVuIHByaW1pdGl2ZVxuICAqIHZhbHVlcy4gVGhlIGNyZWF0ZWQgYHJheS5yYWNgIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUmF5fWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgcmF5ID0gcmFjLlJheSg1NSwgNzcsIDAuMilcbiAgKiByYXkucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgKiBAcGFyYW0ge051bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqXG4gICogQGZ1bmN0aW9uIFJheVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5SYXkgPSBmdW5jdGlvbiBtYWtlUmF5KHgsIHksIGFuZ2xlKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLCBzdGFydCwgYW5nbGUpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBnaXZlbiBwcmltaXRpdmVcbiAgKiB2YWx1ZXMuIFRoZSBjcmVhdGVkIGBzZWdtZW50LnJhY2AgaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TZWdtZW50fWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgc2VnbWVudCA9IHJhYy5TZWdtZW50KDU1LCA3NywgMC4yLCAxMDApXG4gICogc2VnbWVudC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geFxuICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGhcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBTZWdtZW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlNlZ21lbnQgPSBmdW5jdGlvbiBtYWtlU2VnbWVudCh4LCB5LCBhbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLCByYXksIGxlbmd0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gcHJpbWl0aXZlXG4gICogdmFsdWVzLiBUaGUgY3JlYXRlZCBgYXJjLnJhY2AgaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBhcmMgPSByYWMuQXJjKDU1LCA3NywgMC4yKVxuICAqIGFyYy5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBfeF8gY29vcmRpbmF0ZSBmb3IgdGhlIGFyYyBjZW50ZXJcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBfeV8gY29vcmRpbmF0ZSBmb3IgdGhlIGFyYyBjZW50ZXJcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IHN0YXJ0IC0gVGhlIHN0YXJ0IG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8TnVtYmVyfSBbZW5kPW51bGxdIC0gVGhlIGVuZCBvZiB0aGUgYXJjOyB3aGVuXG4gICogICBvbW1pdGVkIG9yIHNldCB0byBgbnVsbGAsIGBzdGFydGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBmdW5jdGlvbiBBcmNcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQXJjID0gZnVuY3Rpb24gbWFrZUFyYyh4LCB5LCByYWRpdXMsIHN0YXJ0ID0gdGhpcy5BbmdsZS56ZXJvLCBlbmQgPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBzdGFydCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcywgZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQsIGNsb2Nrd2lzZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFRleHRgLiBUaGUgY3JlYXRlZCBgdGV4dC5yYWNgIGlzXG4gICogc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5UZXh0fWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgdGV4dCA9IHJhYy5UZXh0KDU1LCA3NywgJ2JsYWNrIHF1YXJ0eicpXG4gICogdGV4dC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgbG9jYXRpb24gZm9yIHRoZSBkcmF3biB0ZXh0XG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIGRyYXdcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gW2Zvcm1hdD1bcmFjLlRleHQuRm9ybWF0LnRvcExlZnRde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I3RvcExlZnR9XVxuICAqICAgVGhlIGZvcm1hdCBmb3IgdGhlIGRyYXduIHRleHRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKlxuICAqIEBmdW5jdGlvbiBUZXh0XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlRleHQgPSBmdW5jdGlvbiBtYWtlVGV4dCh4LCB5LCBzdHJpbmcsIGZvcm1hdCA9IHRoaXMuVGV4dC5Gb3JtYXQudG9wTGVmdCkge1xuICAgIGNvbnN0IHBvaW50ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMsIHBvaW50LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFRleHQuRm9ybWF0YC4gVGhlIGNyZWF0ZWRcbiAgKiBgZm9ybWF0LnJhY2AgaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdH1gLlxuICAqXG4gICogW2ByYWMuVGV4dC5Gb3JtYXRgXXtAbGluayBpbnN0YW5jZS5UZXh0I0Zvcm1hdH0gaXMgYW4gYWxpYXMgb2YgdGhpc1xuICAqIGZ1bmN0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGZvcm1hdCA9IHJhYy5UZXh0LkZvcm1hdCgnbGVmdCcsICdiYXNlbGluZScsIDAuMilcbiAgKiBmb3JtYXQucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGhBbGlnbiAtIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodDsgb25lXG4gICogICBvZiB0aGUgdmFsdWVzIGZyb20gW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufVxuICAqIEBwYXJhbSB7U3RyaW5nfSB2QWxpZ24gLSBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tOyBvbmUgb2ZcbiAgKiAgIHRoZSB2YWx1ZXMgZnJvbSBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn1cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gW2FuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgdGV4dCBpcyBkcmF3blxuICAqIEBwYXJhbSB7U3RyaW5nfSBbZm9udD1udWxsXSAtIFRoZSBmb250IG5hbWVcbiAgKiBAcGFyYW0ge051bWJlcn0gW3NpemU9bnVsbF0gLSBUaGUgZm9udCBzaXplXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtoUGFkZGluZz0wXSAtIFRoZSBob3Jpem9udGFsIHBhZGRpbmcsIGxlZnQtdG8tcmlnaHRcbiAgKiBAcGFyYW0ge051bWJlcn0gW3ZQYWRkaW5nPTBdIC0gVGhlIHZlcnRpY2FsIHBhZGRpbmcsIHRvcC10by1ib3R0b21cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICpcbiAgKiBAZnVuY3Rpb24gVGV4dEZvcm1hdFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5UZXh0Rm9ybWF0ID0gZnVuY3Rpb24gbWFrZVRleHRGb3JtYXQoXG4gICAgaEFsaWduLFxuICAgIHZBbGlnbixcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS56ZXJvLFxuICAgIGZvbnQgPSBudWxsLFxuICAgIHNpemUgPSBudWxsLFxuICAgIGhQYWRkaW5nID0gMCxcbiAgICB2UGFkZGluZyA9IDApXG4gIHtcbiAgICAvLyBUaGlzIGZ1bmN0aW9ucyB1c2VzIGByYWNgIGluc3RlYWQgb2YgYHRoaXNgLCBzaW5jZSBgdGhpc2AgbWF5IHBvaW50XG4gICAgLy8gdG8gZGlmZmVyZW50IG9iamVjdHM6XG4gICAgLy8gKyBgcmFjYCBpbiB0aGlzIGZ1bmN0aW9uIGJvZHlcbiAgICAvLyArIGByYWMuVGV4dGAgaW4gdGhlIGBUZXh0LkZvcm1hdGAgYWxpYXMgYmVsbG93XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbShyYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICAgIHJhYyxcbiAgICAgIGhBbGlnbiwgdkFsaWduLFxuICAgICAgYW5nbGUsIGZvbnQsIHNpemUsXG4gICAgICBoUGFkZGluZywgdlBhZGRpbmcpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBUZXh0LkZvcm1hdGAuIEFsaWFzIG9mXG4gICogW2ByYWMuVGV4dEZvcm1hdGBde0BsaW5rIFJhYyNUZXh0Rm9ybWF0fS5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBoQWxpZ24gLSBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQsIGxlZnQtdG8tcmlnaHQ7IG9uZVxuICAqICAgb2YgdGhlIHZhbHVlcyBmcm9tIFtgaG9yaXpvbnRhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbn1cbiAgKiBAcGFyYW0ge1N0cmluZ30gdkFsaWduIC0gVGhlIHZlcnRpY2FsIGFsaWdubWVudCwgdG9wLXRvLWJvdHRvbTsgb25lIG9mXG4gICogICB0aGUgdmFsdWVzIGZyb20gW2B2ZXJ0aWNhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ259XG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IFthbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd25cbiAgKiBAcGFyYW0ge1N0cmluZ30gW2ZvbnQ9bnVsbF0gLSBUaGUgZm9udCBuYW1lXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtzaXplPW51bGxdIC0gVGhlIGZvbnQgc2l6ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbaFBhZGRpbmc9MF0gLSBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nLCBsZWZ0LXRvLXJpZ2h0XG4gICogQHBhcmFtIHtOdW1iZXJ9IFt2UGFkZGluZz0wXSAtIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nLCB0b3AtdG8tYm90dG9tXG4gICpcbiAgKiBAZnVuY3Rpb24gRm9ybWF0XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdCA9IHJhYy5UZXh0Rm9ybWF0O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBCZXppZXJgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQmV6aWVyfWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRYXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0WVxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEFuY2hvclhcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRBbmNob3JZXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEFuY2hvclhcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kQW5jaG9yWVxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRYXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZFlcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQmV6aWVyfVxuICAqXG4gICogQGZ1bmN0aW9uIEJlemllclxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5CZXppZXIgPSBmdW5jdGlvbiBtYWtlQmV6aWVyKFxuICAgIHN0YXJ0WCwgc3RhcnRZLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSxcbiAgICBlbmRBbmNob3JYLCBlbmRBbmNob3JZLCBlbmRYLCBlbmRZKVxuICB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHN0YXJ0WCwgc3RhcnRZKTtcbiAgICBjb25zdCBzdGFydEFuY2hvciA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRBbmNob3JYLCBzdGFydEFuY2hvclkpO1xuICAgIGNvbnN0IGVuZEFuY2hvciA9IG5ldyBSYWMuUG9pbnQodGhpcywgZW5kQW5jaG9yWCwgZW5kQW5jaG9yWSk7XG4gICAgY29uc3QgZW5kID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRYLCBlbmRZKTtcbiAgICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYENvbXBvc2l0ZWAuIFRoZSBjcmVhdGVkXG4gICogYGNvbXBvc2l0ZS5yYWNgIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IGNvbXBvc2l0ZSA9IHJhYy5Db21wb3NpdGUoKVxuICAqIGNvbXBvc2l0ZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge0FycmF5fSBzZXF1ZW5jZSAtIEFuIGFycmF5IG9mIGRyYXdhYmxlIG9iamVjdHMgdG8gY29udGFpblxuICAqXG4gICogQHJldHVybnMge1JhYy5Db21wb3NpdGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gQ29tcG9zaXRlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkNvbXBvc2l0ZSA9IGZ1bmN0aW9uIG1ha2VDb21wb3NpdGUoc2VxdWVuY2UgPSBbXSkge1xuICAgIHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLCBzZXF1ZW5jZSk7XG4gIH07XG5cblxufTsgLy8gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgdXRpbGl0eSBmdW5jdGlvbnMgdG8gYSBSYWMgaW5zdGFuY2UgdGhhdCBhZGQgZnVuY3Rpb25zIHRvIGFsbFxuLy8gZHJhd2FibGUgYW5kIHN0eWxlIGNsYXNzIHByb3RvdHlwZXMuXG4vL1xuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuXG4gIC8qKlxuICAqIEFkZHMgdG8gYGRyYXdhYmxlQ2xhc3MucHJvdG90eXBlYCBhbGwgdGhlIGZ1bmN0aW9ucyBjb250YWluZWQgaW5cbiAgKiBgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgdGhlIGZ1bmN0aW9ucyBzaGFyZWQgYnkgYWxsXG4gICogZHJhd2FibGUgb2JqZWN0cywgZm9yIGV4YW1wbGUgYGRyYXcoKWAgYW5kIGBkZWJ1ZygpYC5cbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyB0byBzZXR1cCB3aXRoIGRyYXdhYmxlIGZ1bmN0aW9uc1xuICAqL1xuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oZHJhd2FibGVDbGFzcykge1xuICAgIE9iamVjdC5rZXlzKFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgZHJhd2FibGVDbGFzcy5wcm90b3R5cGVbbmFtZV0gPSBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc1tuYW1lXTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZHJhdyA9IGZ1bmN0aW9uKHN0eWxlID0gbnVsbCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kcmF3T2JqZWN0KHRoaXMsIHN0eWxlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmRlYnVnID0gZnVuY3Rpb24oZHJhd3NUZXh0ID0gZmFsc2Upe1xuICAgIGFzc2VydERyYXdlcih0aGlzKTtcbiAgICB0aGlzLnJhYy5kcmF3ZXIuZGVidWdPYmplY3QodGhpcywgZHJhd3NUZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UgPSBudWxsKXtcbiAgICBsZXQgY29hbGVzY2VkTWVzc2FnZSA9IG1lc3NhZ2UgPz8gJyVvJztcbiAgICBjb25zb2xlLmxvZyhjb2FsZXNjZWRNZXNzYWdlLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnB1c2ggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wdXNoU3RhY2sodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTdGFjaygpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBlZWtTdGFjaygpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUb1NoYXBlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMucGVla1NoYXBlKCkuYWRkT3V0bGluZSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGVUb0NvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzaGFwZSA9IHRoaXMucmFjLnBvcFNoYXBlKCk7XG4gICAgdGhpcy5yYWMucGVla0NvbXBvc2l0ZSgpLmFkZChzaGFwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMucGVla0NvbXBvc2l0ZSgpLmFkZCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUbyA9IGZ1bmN0aW9uKHNvbWVDb21wb3NpdGUpIHtcbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5Db21wb3NpdGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHNvbWVDb21wb3NpdGUgaW5zdGFuY2VvZiBSYWMuU2hhcGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkT3V0bGluZSh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGF0dGFjaFRvIGNvbXBvc2l0ZSAtIHNvbWVDb21wb3NpdGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWVDb21wb3NpdGUpfWApO1xuICB9O1xuXG5cbiAgLy8gQ29udGFpbmVyIG9mIHByb3RvdHlwZSBmdW5jdGlvbnMgZm9yIHN0eWxlIGNsYXNzZXMuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zID0ge307XG5cbiAgLy8gQWRkcyB0byB0aGUgZ2l2ZW4gY2xhc3MgcHJvdG90eXBlIGFsbCB0aGUgZnVuY3Rpb25zIGNvbnRhaW5lZCBpblxuICAvLyBgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgZnVuY3Rpb25zIHNoYXJlZCBieSBhbGxcbiAgLy8gc3R5bGUgb2JqZWN0cyAoRS5nLiBgYXBwbHkoKWApLlxuICBSYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucy5hcHBseSA9IGZ1bmN0aW9uKCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5hcHBseU9iamVjdCh0aGlzKTtcbiAgfTtcblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmxvZyA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZztcblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5VG9DbGFzcyA9IGZ1bmN0aW9uKGNsYXNzT2JqKSB7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5zZXRDbGFzc0RyYXdTdHlsZShjbGFzc09iaiwgdGhpcyk7XG4gIH07XG5cbn07IC8vIGF0dGFjaFByb3RvRnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCBhbGxvd3MgdGhlIHNlbGVjdGlvbiBvZiBhIHZhbHVlIHdpdGggYSBrbm9iIHRoYXQgc2xpZGVzXG4qIHRocm91Z2ggdGhlIHNlY3Rpb24gb2YgYW4gYEFyY2AuXG4qXG4qIFVzZXMgYW4gYEFyY2AgYXMgYFthbmNob3Jde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuY2hvcn1gLCB3aGljaCBkZWZpbmVzXG4qIHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbipcbiogYFthbmdsZURpc3RhbmNlXXtAbGluayBSYWMuQXJjQ29udHJvbCNhbmdsZURpc3RhbmNlfWAgZGVmaW5lcyB0aGVcbiogc2VjdGlvbiBvZiB0aGUgYGFuY2hvcmAgYXJjIHdoaWNoIGlzIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiogV2l0aGluIHRoaXMgc2VjdGlvbiB0aGUgdXNlciBjYW4gc2xpZGUgdGhlIGNvbnRyb2wga25vYiB0byBzZWxlY3QgYVxuKiB2YWx1ZS5cbipcbiogQGFsaWFzIFJhYy5BcmNDb250cm9sXG4qIEBleHRlbmRzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgQXJjQ29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBcmNDb250cm9sYCBpbnN0YW5jZSB3aXRoIHRoZSBzdGFydGluZyBgdmFsdWVgIGFuZCB0aGVcbiAgKiBpbnRlcmFjdGl2ZSBgYW5nbGVEaXN0YW5jZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGNvbnRyb2wsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlRGlzdGFuY2Ugb2YgdGhlIGBhbmNob3JgXG4gICogICBhcmMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGFuZ2xlRGlzdGFuY2UpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBhbmdsZURpc3RhbmNlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBBbmdsZSBkaXN0YW5jZSBvZiB0aGUgYGFuY2hvcmAgYXJjIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbShyYWMsIGFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgLyoqXG4gICAgKiBgQXJjYCB0byB3aGljaCB0aGUgY29udHJvbCB3aWxsIGJlIGFuY2hvcmVkLiBEZWZpbmVzIHRoZSBsb2NhdGlvblxuICAgICogd2hlcmUgdGhlIGNvbnRyb2wgaXMgZHJhd24uXG4gICAgKlxuICAgICogQWxvbmcgd2l0aCBgW2FuZ2xlRGlzdGFuY2Vde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuZ2xlRGlzdGFuY2V9YFxuICAgICogZGVmaW5lcyB0aGUgc2VjdGlvbiBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGNvbnRyb2wgY2Fubm90IGJlIGRyYXduIG9yIHNlbGVjdGVkIHVudGlsIHRoaXMgcHJvcGVydHkgaXMgc2V0LlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLkFyY31cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyYWMuY29udHJvbGxlci5hdXRvQWRkQ29udHJvbHMpIHtcbiAgICAgIHJhYy5jb250cm9sbGVyLmFkZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYHZhbHVlYCB1c2luZyB0aGUgcHJvamVjdGlvbiBvZiBgdmFsdWVBbmdsZURpc3RhbmNlLnR1cm5gIGluIHRoZVxuICAqIGBbMCxhbmdsZUxlbmd0aC50dXJuXWAgcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IHZhbHVlQW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBhdFxuICAqICAgd2hpY2ggdG8gc2V0IHRoZSBjdXJyZW50IHZhbHVlXG4gICovXG4gIHNldFZhbHVlV2l0aEFuZ2xlRGlzdGFuY2UodmFsdWVBbmdsZURpc3RhbmNlKSB7XG4gICAgdmFsdWVBbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHZhbHVlQW5nbGVEaXN0YW5jZSlcbiAgICBsZXQgZGlzdGFuY2VSYXRpbyA9IHZhbHVlQW5nbGVEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG5cbiAgLy8gVE9ETzogdGhpcyBleGFtcGxlL2NvZGUgbWF5IG5vdCBiZSB3b3JraW5nIG9yIGJlIGlubmFjdXJyYXRlXG4gIC8vIGNoZWNrIFJheUNvbnRyb2w6c2V0TGltaXRzV2l0aExlbmd0aEluc2V0cyBmb3IgYSBiZXR0ZXIgZXhhbXBsZVxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgYW5nbGVEaXN0YW5jZS50dXJuYCwgY29ycmVzcG9uZGluZ2x5LCBib3RoIHByb2plY3RlZCBpbiB0aGVcbiAgKiBgWzAsIGFuZ2xlRGlzdGFuY2UudHVybl1gIHJhbmdlLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYW4gQXJjQ29udHJvbCB3aXRoIGFuZ2xlRGlzdGFuY2Ugb2YgMC41IHR1cm48L2NhcHRpb24+XG4gICogbGV0IGNvbnRyb2wgPSBuZXcgUmFjLkFyY0NvbnRyb2wocmFjLCAwLCByYWMuQW5nbGUoMC41KSlcbiAgKiAvLyBzZXRzIHN0YXJ0TGltaXQgYXMgMC4xLCBzaW5jZSAgIDAgKyAwLjIgKiAwLjUgPSAwLjFcbiAgKiAvLyBzZXRzIGVuZExpbWl0ICAgYXMgMC4zLCBzaW5jZSAwLjUgLSAwLjQgKiAwLjUgPSAwLjNcbiAgKiBjb250cm9sLnNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKDAuMiwgMC40KVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIGluIHRoZSByYW5nZVxuICAqICAgYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBlbmRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGBhbmdsZURpc3RhbmNlLnR1cm5gXG4gICogICBpbiB0aGUgcmFuZ2UgYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHRvIHVzZSBmb3IgYGVuZExpbWl0YFxuICAqL1xuICBzZXRMaW1pdHNXaXRoQW5nbGVEaXN0YW5jZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC0gZW5kSW5zZXQudHVybikgLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSAgW2FuZ2xlIGBkaXN0YW5jZWBde0BsaW5rIFJhYy5BbmdsZSNkaXN0YW5jZX0gYmV0d2VlbiB0aGVcbiAgKiBgYW5jaG9yYCBhcmMgYHN0YXJ0YCBhbmQgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqIFRoZSBgdHVybmAgb2YgdGhlIHJldHVybmVkIGBBbmdsZWAgaXMgZXF1aXZhbGVudCB0byB0aGUgY29udHJvbCBgdmFsdWVgXG4gICogcHJvamVjdGVkIHRvIHRoZSByYW5nZSBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy52YWx1ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqIFdoZW4gYGFuY2hvcmAgaXMgbm90IHNldCwgcmV0dXJucyBgbnVsbGAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm4gez9SYWMuUG9pbnR9XG4gICovXG4gIGtub2IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBOb3QgcG9zaWJsZSB0byBjYWxjdWxhdGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0QW5nbGVEaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHByb2R1Y2VkIHdpdGggdGhlIGBhbmNob3JgIGFyYyB3aXRoXG4gICogYGFuZ2xlRGlzdGFuY2VgLCB0byBiZSBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGFuY2hvcmAgaXMgbm90IHNldC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhZmZpeEFuY2hvcigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24oXG4gICAgICAgIGBFeHBlY3RlZCBhbmNob3IgdG8gYmUgc2V0LCBudWxsIGZvdW5kIGluc3RlYWRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLndpdGhBbmdsZURpc3RhbmNlKHRoaXMuYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqL1xuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IGNvbnRyb2xTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKVxuICAgICAgOiB0aGlzLnJhYy5GaWxsLm5vbmU7XG5cbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuY2VudGVyLmFuZ2xlVG9Qb2ludChrbm9iKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUobWFya2VyQW5nbGVEaXN0YW5jZSk7XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvLyBDb250cm9sIGtub2JcbiAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCBpc0NpcmNsZUNvbnRyb2wgPSB0aGlzLmFuZ2xlRGlzdGFuY2UuZXF1YWxzKHRoaXMucmFjLkFuZ2xlLnplcm8pXG4gICAgICAmJiB0aGlzLnN0YXJ0TGltaXQgPT0gMFxuICAgICAgJiYgdGhpcy5lbmRMaW1pdCA9PSAxXG4gICAgbGV0IGhhc05lZ2F0aXZlUmFuZ2UgPSBpc0NpcmNsZUNvbnRyb2xcbiAgICAgIHx8IHRoaXMudmFsdWUgPj0gdGhpcy5zdGFydExpbWl0ICsgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG4gICAgbGV0IGhhc1Bvc2l0aXZlUmFuZ2UgPSBpc0NpcmNsZUNvbnRyb2xcbiAgICAgIHx8IHRoaXMudmFsdWUgPD0gdGhpcy5lbmRMaW1pdCAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZFxuXG4gICAgLy8gTmVnYXRpdmUgYXJyb3dcbiAgICBpZiAoaGFzTmVnYXRpdmVSYW5nZSkge1xuICAgICAgbGV0IG5lZ0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpLmludmVyc2UoKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBuZWdBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAoaGFzUG9zaXRpdmVSYW5nZSkge1xuICAgICAgbGV0IHBvc0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIHBvc0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KGNvbnRyb2xTdHlsZSk7XG5cbiAgICAvLyBTZWxlY3Rpb25cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICAgIGlmIChwb2ludGVyU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqXG4gICogYHZhbHVlYCBpcyBhbHdheXMgdXBkYXRlZCBieSB0aGlzIG1ldGhvZCB0byBiZSB3aXRoaW4gKlswLDFdKiBhbmRcbiAgKiBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLkFyY30gZml4ZWRBbmNob3IgLSBBbmNob3IgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgIHdoZW5cbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnN0YXJ0TGltaXQpO1xuICAgIGxldCBlbmRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICBsZXQgc2VsZWN0aW9uQW5nbGUgPSBmaXhlZEFuY2hvci5jZW50ZXJcbiAgICAgIC5hbmdsZVRvUG9pbnQocG9pbnRlcktub2JDZW50ZXIpO1xuICAgIHNlbGVjdGlvbkFuZ2xlID0gZml4ZWRBbmNob3IuY2xhbXBUb0FuZ2xlcyhzZWxlY3Rpb25BbmdsZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5kaXN0YW5jZUZyb21TdGFydChzZWxlY3Rpb25BbmdsZSk7XG5cbiAgICAvLyBVcGRhdGUgY29udHJvbCB3aXRoIG5ldyBkaXN0YW5jZVxuICAgIGxldCBkaXN0YW5jZVJhdGlvID0gbmV3RGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IGRpc3RhbmNlUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuQXJjfSBmaXhlZEFuY2hvciAtIGBBcmNgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYCB3aGVuXG4gICogICB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBBcmMgYW5jaG9yIGlzIGFsd2F5cyBkcmF3biB3aXRob3V0IGZpbGxcbiAgICBsZXQgYW5jaG9yU3R5bGUgPSBwb2ludGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKTtcbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBhbmdsZURpc3RhbmNlID0gZml4ZWRBbmNob3IuYW5nbGVEaXN0YW5jZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBmaXhlZEFuY2hvci5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKSk7XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBtYXJrZXJQb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5BbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuc3RhcnRMaW1pdCkpO1xuICAgICAgbGV0IG1pblBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1pbkFuZ2xlKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IG1pbkFuZ2xlLnBlcnBlbmRpY3VsYXIoZml4ZWRBbmNob3IuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmRMaW1pdCA8IDEpIHtcbiAgICAgIGxldCBtYXhBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuZW5kTGltaXQpKTtcbiAgICAgIGxldCBtYXhQb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXhBbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtYXhBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgbWFya2VyQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFNlZ21lbnQgZnJvbSBwb2ludGVyIHRvIGNvbnRyb2wgZHJhZ2dlZCBjZW50ZXJcbiAgICBsZXQgZHJhZ2dlZENlbnRlciA9IHBvaW50ZXJUb0tub2JPZmZzZXRcbiAgICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIGRyYWdnZWQgY2VudGVyLCBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgZHJhZ2dlZENlbnRlci5hcmMoMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuXG4gICAgLy8gVE9ETzogaW1wbGVtZW50IGFyYyBjb250cm9sIGRyYWdnaW5nIHZpc3VhbHMhXG4gIH1cblxufSAvLyBjbGFzcyBBcmNDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmNDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBYnN0cmFjdCBjbGFzcyBmb3IgY29udHJvbHMgdGhhdCBzZWxlY3QgYSB2YWx1ZSB3aXRoaW4gYSByYW5nZS5cbipcbiogQ29udHJvbHMgbWF5IHVzZSBhbiBgYW5jaG9yYCBvYmplY3QgdG8gZGV0ZXJtaW5lIHRoZSB2aXN1YWwgcG9zaXRpb24gb2ZcbiogdGhlIGNvbnRyb2wncyBpbnRlcmFjdGl2ZSBlbGVtZW50cy4gRWFjaCBpbXBsZW1lbnRhdGlvbiBkZXRlcm1pbmVzIHRoZVxuKiBjbGFzcyB1c2VkIGZvciB0aGlzIGBhbmNob3JgLCBmb3IgZXhhbXBsZVxuKiBgW0FyY0NvbnRyb2xde0BsaW5rIFJhYy5BcmNDb250cm9sfWAgdXNlcyBhbiBgW0FyY117QGxpbmsgUmFjLkFyY31gIGFzXG4qIGFuY2hvciwgd2hpY2ggZGVmaW5lcyB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3biwgd2hhdCBvcmllbnRhdGlvbiBpdFxuKiB1c2VzLCBhbmQgdGhlIHBvc2l0aW9uIG9mIHRoZSBjb250cm9sIGtub2IgdGhyb3VnaCB0aGUgcmFuZ2Ugb2YgcG9zc2libGVcbiogdmFsdWVzLlxuKlxuKiBBIGNvbnRyb2wga2VlcHMgYSBgdmFsdWVgIHByb3BlcnR5IGluIHRoZSByYW5nZSAqWzAsMV0qIGZvciB0aGUgY3VycmVudGx5XG4qIHNlbGVjdGVkIHZhbHVlLlxuKlxuKiBUaGUgYHByb2plY3Rpb25TdGFydGAgYW5kIGBwcm9qZWN0aW9uRW5kYCBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvXG4qIHByb2plY3QgYHZhbHVlYCBpbnRvIHRoZSByYW5nZSBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAgYnkgdXNpbmdcbiogdGhlIGBwcm9qZWN0ZWRWYWx1ZSgpYCBtZXRob2QuIEJ5IGRlZmF1bHQgc2V0IHRvICpbMCwxXSouXG4qXG4qIFRoZSBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgY2FuIGJlIHVzZWQgdG8gcmVzdHJhaW4gdGhlIGFsbG93YWJsZVxuKiB2YWx1ZXMgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLiBCeSBkZWZhdWx0IHNldCB0b1xuKiAqWzAsMV0qLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBDb250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb250cm9sYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIEN1cnJlbnQgc2VsZWN0ZWQgdmFsdWUsIGluIHRoZSByYW5nZSAqWzAsMV0qLlxuICAgICpcbiAgICAqIE1heSBiZSBmdXJ0aGVyIGNvbnN0cmFpbmVkIHRvIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvKipcbiAgICAqIFtQcm9qZWN0ZWQgdmFsdWVde0BsaW5rIFJhYy5Db250cm9sI3Byb2plY3RlZFZhbHVlfSB0byB1c2Ugd2hlblxuICAgICogYHZhbHVlYCBpcyBgMGAuXG4gICAgKlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqIEBkZWZhdWx0IDBcbiAgICAqL1xuICAgIHRoaXMucHJvamVjdGlvblN0YXJ0ID0gMDtcblxuICAgIC8qKlxuICAgICogW1Byb2plY3RlZCB2YWx1ZV17QGxpbmsgUmFjLkNvbnRyb2wjcHJvamVjdGVkVmFsdWV9IHRvIHVzZSB3aGVuXG4gICAgKiBgdmFsdWVgIGlzIGAxYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5wcm9qZWN0aW9uRW5kID0gMTtcblxuICAgIC8qKlxuICAgICogTWluaW11bSBgdmFsdWVgIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMFxuICAgICovXG4gICAgdGhpcy5zdGFydExpbWl0ID0gMDtcblxuICAgIC8qKlxuICAgICogTWF4aW11bSBgdmFsdWVgIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5lbmRMaW1pdCA9IDE7XG5cbiAgICAvKipcbiAgICAqIENvbGxlY3Rpb24gb2YgdmFsdWVzIGF0IHdoaWNoIHZpc3VhbCBtYXJrZXJzIGFyZSBkcmF3bi5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgKiBAZGVmYXVsdCBbXVxuICAgICovXG4gICAgdGhpcy5tYXJrZXJzID0gW107XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHRvIGFwcGx5IHdoZW4gZHJhd2luZy4gVGhpcyBzdHlsZSBnZXRzIGFwcGxpZWQgYWZ0ZXJcbiAgICAqIGBbcmFjLmNvbnRyb2xsZXIuY29udHJvbFN0eWxlXXtAbGluayBSYWMuQ29udHJvbGxlciNjb250cm9sU3R5bGV9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5zdHlsZSA9IG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHZhbHVlYCBwcm9qZWN0ZWQgaW50byB0aGUgcmFuZ2VcbiAgKiBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAuXG4gICpcbiAgKiBCeSBkZWZhdWx0IHRoZSBwcm9qZWN0aW9uIHJhbmdlIGlzICpbMCwxXSosIGluIHdoaWNoIGNhc2UgYHZhbHVlYCBhbmRcbiAgKiBgcHJvamVjdGVkVmFsdWUoKWAgYXJlIGVxdWFsLlxuICAqXG4gICogUHJvamVjdGlvbiByYW5nZXMgd2l0aCBhIG5lZ2F0aXZlIGRpcmVjdGlvbiAoRS5nLiAqWzUwLDMwXSosIHdoZW5cbiAgKiBgcHJvamVjdGlvblN0YXJ0YCBpcyBncmVhdGVyIHRoYXQgYHByb2plY3Rpb25FbmRgKSBhcmUgc3VwcG9ydGVkLiBBc1xuICAqIGB2YWx1ZWAgaW5jcmVhc2VzLCB0aGUgcHJvamVjdGlvbiByZXR1cm5lZCBkZWNyZWFzZXMgZnJvbVxuICAqIGBwcm9qZWN0aW9uU3RhcnRgIHVudGlsIHJlYWNoaW5nIGBwcm9qZWN0aW9uRW5kYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbMTAwLDIwMF08L2NhcHRpb24+XG4gICogY29udHJvbC5zZXRQcm9qZWN0aW9uUmFuZ2UoMTAwLCAyMDApXG4gICogY29udHJvbC52YWx1ZSA9IDA7ICAgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDEwMFxuICAqIGNvbnRyb2wudmFsdWUgPSAwLjU7IGNvbnRyb2wucHJvamVjdGlvblZhbHVlKCkgLy8gcmV0dXJucyAxNTBcbiAgKiBjb250cm9sLnZhbHVlID0gMTsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgMjAwXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNvbnRyb2wgd2l0aCBhIHByb2plY3Rpb24gcmFuZ2Ugb2YgWzUwLDMwXTwvY2FwdGlvbj5cbiAgKiBjb250cm9sLnNldFByb2plY3Rpb25SYW5nZSgzMCwgNTApXG4gICogY29udHJvbC52YWx1ZSA9IDA7ICAgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDUwXG4gICogY29udHJvbC52YWx1ZSA9IDAuNTsgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDQwXG4gICogY29udHJvbC52YWx1ZSA9IDE7ICAgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDMwXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBwcm9qZWN0ZWRWYWx1ZSgpIHtcbiAgICBsZXQgcHJvamVjdGlvblJhbmdlID0gdGhpcy5wcm9qZWN0aW9uRW5kIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gICAgcmV0dXJuICh0aGlzLnZhbHVlICogcHJvamVjdGlvblJhbmdlKSArIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICB9XG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSBpbiB0aGUgcmFuZ2UgKlswLDFdKiBmb3IgdGhlXG4gIC8vIGBwcm9qZWN0ZWRWYWx1ZWAgaW4gdGhlIHJhbmdlIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYC5cbiAgLy8gdmFsdWVPZlByb2plY3RlZChwcm9qZWN0ZWRWYWx1ZSkge1xuICAvLyAgIGxldCBwcm9qZWN0aW9uUmFuZ2UgPSB0aGlzLnByb2plY3Rpb25FbmQgLSB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgLy8gICByZXR1cm4gKHByb2plY3RlZFZhbHVlIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQpIC8gcHJvamVjdGlvblJhbmdlO1xuICAvLyB9XG5cblxuICAvLyBUT0RPOiBkb2N1bWVudCwgdGVzdFxuICBzZXRQcm9qZWN0aW9uUmFuZ2Uoc3RhcnQsIGVuZCkge1xuICAgIHRoaXMucHJvamVjdGlvblN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5wcm9qZWN0aW9uRW5kID0gZW5kO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgMWAsIGNvcnJlc3BvbmRpbmdseS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogY29udHJvbC5zZXRMaW1pdHNXaXRoSW5zZXRzKDAuMSwgMC4yKVxuICAqIC8vIHJldHVybnMgMC4xLCBzaW5jZSAwICsgMC4xID0gMC4xXG4gICogY29udHJvbC5zdGFydExpbWl0XG4gICogLy8gcmV0dXJucyAwLjgsIHNpbmNlIDEgLSAwLjIgPSAwLjhcbiAgKiBjb250cm9sLmVuZExpbWl0XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGAwYCB0byB1c2UgZm9yIGBzdGFydExpbWl0YFxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGAxYCB0byB1c2UgZm9yIGBlbmRMaW1pdGBcbiAgKi9cbiAgc2V0TGltaXRzV2l0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQ7XG4gICAgdGhpcy5lbmRMaW1pdCA9IDEgLSBlbmRJbnNldDtcbiAgfVxuXG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gU2V0cyBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0d28gaW5zZXQgdmFsdWVzIHJlbGF0aXZlIHRvIHRoZVxuICAvLyBbMCwxXSByYW5nZS5cbiAgLy8gc2V0TGltaXRzV2l0aFByb2plY3Rpb25JbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgLy8gICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCk7XG4gIC8vICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMudmFsdWVPZigxIC0gZW5kSW5zZXQpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBBZGRzIGEgbWFya2VyIGF0IHRoZSBjdXJyZW50IGB2YWx1ZWAuXG4gICovXG4gIGFkZE1hcmtlckF0Q3VycmVudFZhbHVlKCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGlzIGNvbnRyb2wgaXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLlxuICAqXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICovXG4gIGlzU2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJhYy5jb250cm9sbGVyLnNlbGVjdGlvbi5jb250cm9sID09PSB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHJldHVybiB7UmFjLlBvaW50fVxuICAqL1xuICBrbm9iKCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIGFuY2hvciB0byBiZSBwZXJzaXRlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gZGV0ZXJtaW5lcyB0aGUgdHlwZSB1c2VkIGZvciBgYW5jaG9yYCBhbmRcbiAgKiBgYWZmaXhBbmNob3IoKWAuXG4gICpcbiAgKiBUaGlzIGZpeGVkIGFuY2hvciBpcyBwYXNzZWQgYmFjayB0byB0aGUgY29udHJvbCB0aHJvdWdoXG4gICogYFt1cGRhdGVXaXRoUG9pbnRlcl17QGxpbmsgUmFjLkNvbnRyb2wjdXBkYXRlV2l0aFBvaW50ZXJ9YCBhbmRcbiAgKiBgW2RyYXdTZWxlY3Rpb25de0BsaW5rIFJhYy5Db250cm9sI2RyYXdTZWxlY3Rpb259YCBkdXJpbmcgdXNlclxuICAqIGludGVyYWN0aW9uLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKi9cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKi9cbiAgZHJhdygpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqIENhbGxlZCBieSBgW3JhYy5jb250cm9sbGVyLnBvaW50ZXJEcmFnZ2VkXXtAbGluayBSYWMuQ29udHJvbGxlciNwb2ludGVyRHJhZ2dlZH1gXG4gICogYXMgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGggdGhlIGNvbnRyb2wuXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGludGVycHJldHMgYHBvaW50ZXJLbm9iQ2VudGVyYCBhZ2FpbnN0IGBmaXhlZEFuY2hvcmBcbiAgKiB0byB1cGRhdGUgaXRzIG93biB2YWx1ZS4gVGhlIGN1cnJlbnQgYGFuY2hvcmAgaXMgbm90IHVzZWQgZm9yIHRoaXNcbiAgKiB1cGRhdGUgc2luY2UgYGFuY2hvcmAgY291bGQgY2hhbmdlIGR1cmluZyByZWRyYXcgaW4gcmVzcG9uc2UgdG8gdXBkYXRlc1xuICAqIGluIGB2YWx1ZWAuXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGlzIGFsc28gcmVzcG9uc2libGUgb2Yga2VlcGluZyB0aGUgdXBkYXRlZCBgdmFsdWVgXG4gICogd2l0aGluIHRoZSByYW5nZSBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC4gVGhpcyBtZXRob2QgaXMgdGhlIG9ubHkgcGF0aFxuICAqIGZvciB1cGRhdGluZyB0aGUgY29udHJvbCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24sIGFuZCB0aHVzIHRoZSBvbmx5XG4gICogcGxhY2Ugd2hlcmUgZWFjaCBpbXBsZW1lbnRhdGlvbiBtdXN0IGVuZm9yY2UgYSB2YWxpZCBgdmFsdWVgIHdpdGhpblxuICAqICpbMCwxXSogYW5kIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7T2JqZWN0fSBmaXhlZEFuY2hvciAtIEFuY2hvciBwcm9kdWNlZCB3aGVuIHVzZXIgaW50ZXJhY3Rpb25cbiAgKiAgIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIHNlbGVjdGlvbiBzdGF0ZSBhbG9uZyB3aXRoIHBvaW50ZXIgaW50ZXJhY3Rpb24gdmlzdWFscy5cbiAgKiBDYWxsZWQgYnkgYFtyYWMuY29udHJvbGxlci5kcmF3Q29udHJvbHNde0BsaW5rIFJhYy5Db250cm9sbGVyI2RyYXdDb250cm9sc31gXG4gICogb25seSBmb3IgdGhlIHNlbGVjdGVkIGNvbnRyb2wuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7T2JqZWN0fSBmaXhlZEFuY2hvciAtIEFuY2hvciBvZiB0aGUgY29udHJvbCBwcm9kdWNlZCB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbDtcblxuXG4vLyBDb250cm9scyBzaGFyZWQgZHJhd2luZyBlbGVtZW50c1xuXG5Db250cm9sLm1ha2VBcnJvd1NoYXBlID0gZnVuY3Rpb24ocmFjLCBjZW50ZXIsIGFuZ2xlKSB7XG4gIC8vIEFyY1xuICBsZXQgYW5nbGVEaXN0YW5jZSA9IHJhYy5BbmdsZS5mcm9tKDEvMjIpO1xuICBsZXQgYXJjID0gY2VudGVyLmFyYyhyYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41LFxuICAgIGFuZ2xlLnN1YnRyYWN0KGFuZ2xlRGlzdGFuY2UpLCBhbmdsZS5hZGQoYW5nbGVEaXN0YW5jZSkpO1xuXG4gIC8vIEFycm93IHdhbGxzXG4gIGxldCBwb2ludEFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oMS84KTtcbiAgbGV0IHJpZ2h0V2FsbCA9IGFyYy5zdGFydFBvaW50KCkucmF5KGFuZ2xlLmFkZChwb2ludEFuZ2xlKSk7XG4gIGxldCBsZWZ0V2FsbCA9IGFyYy5lbmRQb2ludCgpLnJheShhbmdsZS5zdWJ0cmFjdChwb2ludEFuZ2xlKSk7XG5cbiAgLy8gQXJyb3cgcG9pbnRcbiAgbGV0IHBvaW50ID0gcmlnaHRXYWxsLnBvaW50QXRJbnRlcnNlY3Rpb24obGVmdFdhbGwpO1xuXG4gIC8vIFNoYXBlXG4gIHJhYy5wdXNoU2hhcGUoKTtcbiAgcG9pbnQuc2VnbWVudFRvUG9pbnQoYXJjLnN0YXJ0UG9pbnQoKSlcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuZW5kUG9pbnQoKS5zZWdtZW50VG9Qb2ludChwb2ludClcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuXG4gIHJldHVybiByYWMucG9wU2hhcGUoKTtcbn07XG5cbkNvbnRyb2wubWFrZUxpbWl0TWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIGxldCBwZXJwZW5kaWN1bGFyID0gYW5nbGUucGVycGVuZGljdWxhcihmYWxzZSk7XG4gIGxldCBjb21wb3NpdGUgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xuXG4gIHBvaW50LnNlZ21lbnRUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIDQpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbig0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigzKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEluZm9ybWF0aW9uIHJlZ2FyZGluZyB0aGUgY3VycmVudGx5IHNlbGVjdGVkXG4qIGBbQ29udHJvbF17QGxpbmsgUmFjLkNvbnRyb2x9YC5cbipcbiogQ3JlYXRlZCBhbmQga2VwdCBieSBgW0NvbnRyb2xsZXJde0BsaW5rIFJhYy5Db250cm9sbGVyfWAgd2hlbiBhIGNvbnRyb2xcbiogYmVjb21lcyBzZWxlY3RlZC5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sbGVyLlNlbGVjdGlvblxuKi9cbmNsYXNzIENvbnRyb2xTZWxlY3Rpb257XG5cbiAgLyoqXG4gICogQnVpbGRzIGEgbmV3IGBTZWxlY3Rpb25gIHdpdGggdGhlIGdpdmVuIGBjb250cm9sYCBhbmQgcG9pbnRlciBsb2NhdGVkXG4gICogYXQgYHBvaW50ZXJDZW50ZXJgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29udHJvbH0gY29udHJvbCAtIFRoZSBzZWxlY3RlZCBjb250cm9sXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gb2YgdGhlIHBvaW50ZXIgd2hlblxuICAqICAgdGhlIHNlbGVjdGlvbiBzdGFydGVkXG4gICovXG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHBvaW50ZXJDZW50ZXIpIHtcblxuICAgIC8qKlxuICAgICogVGhlIHNlbGVjdGVkIGNvbnRyb2wuXG4gICAgKiBAdHlwZSB7UmFjLkNvbnRyb2x9XG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuXG4gICAgLyoqXG4gICAgKiBBbmNob3IgcHJvZHVjZWQgYnlcbiAgICAqIGBbY29udHJvbC5hZmZpeEFuY2hvcl17QGxpbmsgUmFjLkNvbnRyb2wjYWZmaXhBbmNob3J9YCB3aGVuIHRoZVxuICAgICogc2VsZWN0aW9uIGJlZ2FuLlxuICAgICpcbiAgICAqIFRoaXMgYW5jaG9yIGlzIHBlcnNpc3RlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbiBhcyB0byBhbGxvdyB0aGUgdXNlclxuICAgICogdG8gaW50ZXJhY3Qgd2l0aCB0aGUgc2VsZWN0ZWQgY29udHJvbCBpbiBhIGZpeGVkIGxvY2F0aW9uLCBldmVuIGlmXG4gICAgKiB0aGUgY29udHJvbCBtb3ZlcyBkdXJpbmcgdGhlIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmZpeGVkQW5jaG9yID0gY29udHJvbC5hZmZpeEFuY2hvcigpO1xuXG4gICAgLyoqXG4gICAgKiBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzIHRoZSBvZmZzZXQgZnJvbSB0aGUgcG9pbnRlciBwb3NpdGlvbiB0byB0aGVcbiAgICAqIGNvbnRyb2wga25vYiBjZW50ZXIuXG4gICAgKlxuICAgICogVXNlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBjb250cm9sIGtub2IgYXQgYSBjb25zdGFudCBvZmZzZXQgcG9zaXRpb25cbiAgICAqIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIFRoZSBwb2ludGVyIHN0YXJ0aW5nIGxvY2F0aW9uIGlzIGVxdWFsIHRvIGBzZWdtZW50LnN0YXJ0UG9pbnQoKWAsXG4gICAgKiB0aGUgY29udHJvbCBrbm9iIGNlbnRlciBzdGFydGluZyBwb3NpdGlvbiBpcyBlcXVhbCB0b1xuICAgICogYHNlZ21lbnQuZW5kUG9pbnQoKWAuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAgICovXG4gICAgdGhpcy5wb2ludGVyVG9Lbm9iT2Zmc2V0ID0gcG9pbnRlckNlbnRlci5zZWdtZW50VG9Qb2ludChjb250cm9sLmtub2IoKSk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmNvbnRyb2wuZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCB0aGlzLmZpeGVkQW5jaG9yLCB0aGlzLnBvaW50ZXJUb0tub2JPZmZzZXQpO1xuICB9XG59XG5cblxuLyoqXG4qIE1hbmFnZXIgb2YgaW50ZXJhY3RpdmUgYFtDb250cm9sXXtAbGluayBSYWMuQ29udHJvbH1gcyBmb3IgYW4gaW5zdGFuY2Vcbiogb2YgYFJhY2AuXG4qXG4qIENvbnRhaW5zIGEgbGlzdCBvZiBhbGwgbWFuYWdlZCBjb250cm9scyBhbmQgY29vcmRpbmF0ZXMgZHJhd2luZyBhbmQgdXNlclxuKiBpbnRlcmFjdGlvbiBiZXR3ZWVuIHRoZW0uXG4qXG4qIEZvciBjb250cm9scyB0byBiZSBmdW5jdGlvbmFsIHRoZSBgcG9pbnRlclByZXNzZWRgLCBgcG9pbnRlclJlbGVhc2VkYCxcbiogYW5kIGBwb2ludGVyRHJhZ2dlZGAgbWV0aG9kcyBoYXZlIHRvIGJlIGNhbGxlZCBhcyBwb2ludGVyIGludGVyYWN0aW9uc1xuKiBoYXBwZW4uIFRoZSBgZHJhd0NvbnRyb2xzYCBtZXRob2QgaGFuZGxlcyB0aGUgZHJhd2luZyBvZiBhbGwgY29udHJvbHNcbiogYW5kIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbCwgaXQgaXMgdXN1YWxseSBjYWxsZWQgYXQgdGhlIHZlcnkgZW5kXG4qIG9mIGRyYXdpbmcuXG4qXG4qIEFsc28gY29udGFpbnMgc2V0dGluZ3Mgc2hhcmVkIGJldHdlZW4gYWxsIGNvbnRyb2xzIGFuZCB1c2VkIGZvciB1c2VyXG4qIGludGVyYWN0aW9uLCBsaWtlIGBwb2ludGVyU3R5bGVgIHRvIGRyYXcgdGhlIHBvaW50ZXIsIGBjb250cm9sU3R5bGVgIGFzXG4qIGEgZGVmYXVsdCBzdHlsZSBmb3IgZHJhd2luZyBjb250cm9scywgYW5kIGBrbm9iUmFkaXVzYCB0aGF0IGRlZmluZXMgdGhlXG4qIHNpemUgb2YgdGhlIGludGVyYWN0aXZlIGVsZW1lbnQgb2YgbW9zdCBjb250cm9scy5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sbGVyXG4qL1xuY2xhc3MgQ29udHJvbGxlciB7XG5cbiAgc3RhdGljIFNlbGVjdGlvbiA9IENvbnRyb2xTZWxlY3Rpb247XG5cblxuICAvKipcbiAgKiBCdWlsZHMgYSBuZXcgYENvbnRyb2xsZXJgIHdpdGggdGhlIGdpdmVuIGBSYWNgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMpIHtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBEaXN0YW5jZSBhdCB3aGljaCB0aGUgcG9pbnRlciBpcyBjb25zaWRlcmVkIHRvIGludGVyYWN0IHdpdGggYVxuICAgICogY29udHJvbCBrbm9iLiBBbHNvIHVzZWQgYnkgY29udHJvbHMgZm9yIGRyYXdpbmcuXG4gICAgKlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMua25vYlJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBDb2xsZWN0aW9uIG9mIGFsbCBjb250cm9sbHMgbWFuYWdlZCBieSB0aGUgaW5zdGFuY2UuIENvbnRyb2xzIGluIHRoaXNcbiAgICAqIGxpc3QgYXJlIGNvbnNpZGVyZWQgZm9yIHBvaW50ZXIgaGl0IHRlc3RpbmcgYW5kIGZvciBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQ29udHJvbFtdfVxuICAgICogQGRlZmF1bHQgW11cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbHMgPSBbXTtcblxuICAgIC8qKlxuICAgICogSW5kaWNhdGVzIGNvbnRyb2xzIHRvIGFkZCB0aGVtc2VsdmVzIGludG8gYHRoaXMuY29udHJvbHNgIHdoZW5cbiAgICAqIGNyZWF0ZWQuXG4gICAgKlxuICAgICogVGhpcyBwcm9wZXJ0eSBpcyBhIHNoYXJlZCBjb25maWd1cmF0aW9uLiBUaGUgYmVoYXZpb3VyIGlzIGltcGxlbWVudGVkXG4gICAgKiBpbmRlcGVuZGVudGx5IGJ5IGVhY2ggY29udHJvbCBjb25zdHJ1Y3Rvci5cbiAgICAqXG4gICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAqL1xuICAgIHRoaXMuYXV0b0FkZENvbnRyb2xzID0gdHJ1ZTtcblxuICAgIC8vIFRPRE86IHNlcGFyYXRlIGxhc3RDb250cm9sIGZyb20gbGFzdFBvaW50ZXJcblxuICAgIC8vIExhc3QgYFBvaW50YCBvZiB0aGUgcG9zaXRpb24gd2hlbiB0aGUgcG9pbnRlciB3YXMgcHJlc3NlZCwgb3IgbGFzdFxuICAgIC8vIENvbnRyb2wgaW50ZXJhY3RlZCB3aXRoLiBTZXQgdG8gYG51bGxgIHdoZW4gdGhlcmUgaGFzIGJlZW4gbm9cbiAgICAvLyBpbnRlcmFjdGlvbiB5ZXQgYW5kIHdoaWxlIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbC5cbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU3R5bGUgb2JqZWN0IHVzZWQgZm9yIHRoZSB2aXN1YWwgZWxlbWVudHMgcmVsYXRlZCB0byBwb2ludGVyXG4gICAgKiBpbnRlcmFjdGlvbiBhbmQgY29udHJvbCBzZWxlY3Rpb24uIFdoZW4gYG51bGxgIG5vIHBvaW50ZXIgb3JcbiAgICAqIHNlbGVjdGlvbiB2aXN1YWxzIGFyZSBkcmF3bi5cbiAgICAqXG4gICAgKiBCeSBkZWZhdWx0IGNvbnRhaW5zIGEgc3R5bGUgdGhhdCB1c2VzIHRoZSBjdXJyZW50IHN0cm9rZVxuICAgICogY29uZmlndXJhdGlvbiB3aXRoIG5vLWZpbGwuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn1cbiAgICAqIEBkZWZhdWx0IHtAbGluayBpbnN0YW5jZS5GaWxsI25vbmV9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ZXJTdHlsZSA9IHJhYy5GaWxsLm5vbmU7XG5cbiAgICAvKipcbiAgICAqIERlZmF1bHQgc3R5bGUgdG8gYXBwbHkgZm9yIGFsbCBjb250cm9scy4gV2hlbiBzZXQgaXQgaXMgYXBwbGllZFxuICAgICogYmVmb3JlIGNvbnRyb2wgZHJhd2luZy4gVGhlIGluZGl2aWR1YWwgY29udHJvbCBzdHlsZSBpblxuICAgICogYFtjb250cm9sLnN0eWxlXXtAbGluayBSYWMuQ29udHJvbCNzdHlsZX1gIGlzIGFwcGxpZWQgYWZ0ZXJ3YXJkcy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5jb250cm9sU3R5bGUgPSBudWxsXG5cbiAgICAvKipcbiAgICAqIFNlbGVjdGlvbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBvciBgbnVsbGBcbiAgICAqIHdoZW4gdGhlcmUgaXMgbm8gc2VsZWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9ufVxuICAgICovXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuXG4gIH0gLy8gY29uc3RydWN0b3JcblxuXG4gIC8qKlxuICAqIFB1c2hlcyBgY29udHJvbGAgaW50byBgdGhpcy5jb250cm9sc2AsIGFsbG93aW5nIHRoZSBpbnN0YW5jZSB0byBoYW5kbGVcbiAgKiBwb2ludGVyIGludGVyYWN0aW9uIGFuZCBkcmF3aW5nIG9mIGBjb250cm9sYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbnRyb2x9IGNvbnRyb2wgLSBBIGBDb250cm9sYCB0byBhZGQgaW50byBgY29udHJvbHNgXG4gICovXG4gIGFkZChjb250cm9sKSB7XG4gICAgdGhpcy5jb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICB9XG5cblxuICAvKipcbiAgKiBOb3RpZmllcyB0aGUgaW5zdGFuY2UgdGhhdCB0aGUgcG9pbnRlciBoYXMgYmVlbiBwcmVzc2VkIGF0IHRoZVxuICAqIGBwb2ludGVyQ2VudGVyYCBsb2NhdGlvbi4gQWxsIGNvbnRyb2xzIGFyZSBoaXQgdGVzdGVkIGFuZCB0aGUgZmlyc3RcbiAgKiBjb250cm9sIHRvIGJlIGhpdCBpcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgcHJlc3MgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgcHJlc3NlZFxuICAqL1xuICBwb2ludGVyUHJlc3NlZChwb2ludGVyQ2VudGVyKSB7XG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IG51bGw7XG5cbiAgICAvLyBUZXN0IHBvaW50ZXIgaGl0XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmNvbnRyb2xzLmZpbmQoIGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29udHJvbEtub2IgPSBpdGVtLmtub2IoKTtcbiAgICAgIGlmIChjb250cm9sS25vYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGlmIChjb250cm9sS25vYi5kaXN0YW5jZVRvUG9pbnQocG9pbnRlckNlbnRlcikgPD0gdGhpcy5rbm9iUmFkaXVzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvbiA9IG5ldyBDb250cm9sbGVyLlNlbGVjdGlvbihzZWxlY3RlZCwgcG9pbnRlckNlbnRlcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIGRyYWdnZWQgdG8gdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBXaGVuIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbCwgdXNlclxuICAqIGludGVyYWN0aW9uIGlzIHBlcmZvcm1lZCBhbmQgdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBkcmFnIGludGVyYWN0aW9uIGZvciBhbGxcbiAgKiBtYW5hZ2VkIGNvbnRyb2xzIHRvIHByb3Blcmx5IHdvcmsuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgcG9pbnRlciB3YXNcbiAgKiAgIGRyYWdnZWRcbiAgKi9cbiAgcG9pbnRlckRyYWdnZWQocG9pbnRlckNlbnRlcil7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLnNlbGVjdGlvbi5jb250cm9sO1xuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuc2VsZWN0aW9uLmZpeGVkQW5jaG9yO1xuXG4gICAgLy8gT2Zmc2V0IGNlbnRlciBvZiBkcmFnZ2VkIGNvbnRyb2wga25vYiBmcm9tIHRoZSBwb2ludGVyIHBvc2l0aW9uXG4gICAgbGV0IHBvaW50ZXJLbm9iQ2VudGVyID0gdGhpcy5zZWxlY3Rpb24ucG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIGNvbnRyb2wudXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gcmVsZWFzZWQgYXQgdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBXaGVuIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbCwgdXNlclxuICAqIGludGVyYWN0aW9uIGlzIGZpbmFsaXplZCBhbmQgdGhlIGNvbnRyb2wgc2VsZWN0aW9uIGlzIGNsZWFyZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgZHJhZyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICByZWxlYXNlZFxuICAqL1xuICBwb2ludGVyUmVsZWFzZWQocG9pbnRlckNlbnRlcikge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5sYXN0UG9pbnRlciA9IHBvaW50ZXJDZW50ZXI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IHRoaXMuc2VsZWN0aW9uLmNvbnRyb2w7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyBhbGwgY29udHJvbHMgY29udGFpbmVkIGluXG4gICogYFtjb250cm9sc117QGxpbmsgUmFjLkNvbnRyb2xsZXIjY29udHJvbHN9YCBhbG9uZyB0aGUgdmlzdWFsIGVsZW1lbnRzXG4gICogZm9yIHBvaW50ZXIgYW5kIGNvbnRyb2wgc2VsZWN0aW9uLlxuICAqXG4gICogVXN1YWxseSBjYWxsZWQgYXQgdGhlIGVuZCBvZiBkcmF3aW5nLCBhcyB0byBkcmF3IGNvbnRyb2xzIG9uIHRvcCBvZlxuICAqIG90aGVyIGdyYXBoaWNzLlxuICAqL1xuICBkcmF3Q29udHJvbHMoKSB7XG4gICAgbGV0IHBvaW50ZXJDZW50ZXIgPSB0aGlzLnJhYy5Qb2ludC5wb2ludGVyKCk7XG4gICAgdGhpcy5kcmF3UG9pbnRlcihwb2ludGVyQ2VudGVyKTtcblxuICAgIC8vIEFsbCBjb250cm9scyBpbiBkaXNwbGF5XG4gICAgdGhpcy5jb250cm9scy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpO1xuICAgIH1cbiAgfVxuXG5cbiAgZHJhd1BvaW50ZXIocG9pbnRlckNlbnRlcikge1xuICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnBvaW50ZXJTdHlsZTtcbiAgICBpZiAocG9pbnRlclN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGFzdCBwb2ludGVyIG9yIGNvbnRyb2xcbiAgICBpZiAodGhpcy5sYXN0UG9pbnRlciBpbnN0YW5jZW9mIFJhYy5Qb2ludCkge1xuICAgICAgdGhpcy5sYXN0UG9pbnRlci5hcmMoMTIpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuQ29udHJvbCkge1xuICAgICAgLy8gVE9ETzogaW1wbGVtZW50IGxhc3Qgc2VsZWN0ZWQgY29udHJvbCBzdGF0ZVxuICAgIH1cblxuICAgIC8vIFBvaW50ZXIgcHJlc3NlZFxuICAgIGlmICh0aGlzLnJhYy5kcmF3ZXIucDUubW91c2VJc1ByZXNzZWQpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICBwb2ludGVyQ2VudGVyLmFyYygxMCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9pbnRlckNlbnRlci5hcmMoNSkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbn0gLy8gY2xhc3MgQ29udHJvbGxlclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IGFsbG93cyB0aGUgc2VsZWN0aW9uIG9mIGEgdmFsdWUgd2l0aCBhIGtub2IgdGhhdCBzbGlkZXNcbiogdGhyb3VnaCB0aGUgc2VnbWVudCBvZiBhIGBSYXlgLlxuKlxuKiBVc2VzIGEgYFJheWAgYXMgYFthbmNob3Jde0BsaW5rIFJhYy5SYXlDb250cm9sI2FuY2hvcn1gLCB3aGljaCBkZWZpbmVzXG4qIHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbipcbiogYFtsZW5ndGhde0BsaW5rIFJhYy5SYXlDb250cm9sI2xlbmd0aH1gIGRlZmluZXMgdGhlIGxlbmd0aCBvZiB0aGVcbiogc2VnbWVudCBpbiB0aGUgYGFuY2hvcmAgcmF5IHdoaWNoIGlzIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiogV2l0aGluIHRoaXMgc2VnbWVudCB0aGUgdXNlciBjYW4gc2xpZGUgdGhlIGNvbnRyb2wga25vYiB0byBzZWxlY3QgYVxuKiB2YWx1ZS5cbipcbiogQGFsaWFzIFJhYy5SYXlDb250cm9sXG4qIEBleHRlbmRzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgUmF5Q29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBSYXlDb250cm9sYCBpbnN0YW5jZSB3aXRoIHRoZSBzdGFydGluZyBgdmFsdWVgIGFuZCB0aGVcbiAgKiBpbnRlcmFjdGl2ZSBgbGVuZ3RoYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGBhbmNob3JgIHJheSBhdmFpbGFibGUgZm9yXG4gICogICB1c2VyIGludGVyYWN0aW9uXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSwgbGVuZ3RoKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBMZW5ndGggb2YgdGhlIGBhbmNob3JgIHJheSBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAvKipcbiAgICAqIGBSYXlgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIERlZmluZXMgdGhlIGxvY2F0aW9uXG4gICAgKiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbiAgICAqXG4gICAgKiBBbG9uZyB3aXRoIGBbbGVuZ3RoXXtAbGluayBSYWMuUmF5Q29udHJvbCNsZW5ndGh9YCBkZWZpbmVzIHRoZVxuICAgICogc2VnbWVudCBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGNvbnRyb2wgY2Fubm90IGJlIGRyYXduIG9yIHNlbGVjdGVkIHVudGlsIHRoaXMgcHJvcGVydHkgaXMgc2V0LlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlJheX1cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyYWMuY29udHJvbGxlci5hdXRvQWRkQ29udHJvbHMpIHtcbiAgICAgIHJhYy5jb250cm9sbGVyLmFkZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIFRPRE86IGRvY3VtZW50LCB0ZXN0XG4gIHN0YXJ0TGltaXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRMaW1pdCAqIHRoaXMubGVuZ3RoO1xuICB9XG5cbiAgLy8gVE9ETzogZG9jdW1lbnQsIHRlc3RcbiAgZW5kTGltaXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kTGltaXQgKiB0aGlzLmxlbmd0aDtcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBgdmFsdWVgIHVzaW5nIHRoZSBwcm9qZWN0aW9uIG9mIGBsZW5ndGhWYWx1ZWAgaW4gdGhlIGBbMCxsZW5ndGhdYFxuICAqIHJhbmdlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFZhbHVlIC0gVGhlIGxlbmd0aCBhdCB3aGljaCB0byBzZXQgdGhlIGN1cnJlbnRcbiAgKiAgIHZhbHVlXG4gICovXG4gIHNldFZhbHVlV2l0aExlbmd0aChsZW5ndGhWYWx1ZSkge1xuICAgIGxldCBsZW5ndGhSYXRpbyA9IGxlbmd0aFZhbHVlIC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IGxlbmd0aFJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgbGVuZ3RoYCwgY29ycmVzcG9uZGluZ2x5LCBib3RoIHByb2plY3RlZCBpbiB0aGUgYFswLGxlbmd0aF1gXG4gICogcmFuZ2UuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIFJheUNvbnRyb2wgd2l0aCBsZW5ndGggb2YgMjAwPC9jYXB0aW9uPlxuICAqIGxldCBjb250cm9sID0gbmV3IFJhYy5SYXlDb250cm9sKHJhYywgMC41LCAyMDApO1xuICAqIGNvbnRyb2wuc2V0TGltaXRzV2l0aExlbmd0aEluc2V0cygxMCwgMjApO1xuICAqIC8vIHJldHVybnMgMTAsIHNpbmNlIDAgKyAxMCA9IDEwXG4gICogY29udHJvbC5zdGFydExpbWl0TGVuZ3RoKClcbiAgKiAvLyByZXR1cm5zIDAuMDUsIHNpbmNlIDAgKyAoMTAgLyAyMDApID0gMC4wNVxuICAqIGNvbnRyb2wuc3RhcnRMaW1pdFxuICAqIC8vIHJldHVybnMgMTgwLCBzaW5jZSAyMDAgLSAyMCA9IDE4MFxuICAqIGNvbnRyb2wuZW5kTGltaXRMZW5ndGgoKVxuICAqIC8vIHJldHVybnMgMC45LCBzaW5jZSAxIC0gKDIwIC8gMjAwKSA9IDAuOVxuICAqIGNvbnRyb2wuZW5kTGltaXRcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIGluIHRoZSByYW5nZVxuICAqICAgYFswLGxlbmd0aF1gIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYGxlbmd0aGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsbGVuZ3RoXWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSBzdGFydEluc2V0IC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBgYW5jaG9yYCByYXkgYHN0YXJ0YCBhbmQgdGhlIGNvbnRyb2xcbiAgKiBrbm9iLlxuICAqXG4gICogRXF1aXZhbGVudCB0byB0aGUgY29udHJvbCBgdmFsdWVgIHByb2plY3RlZCB0byB0aGUgcmFuZ2UgYFswLGxlbmd0aF1gLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgZGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoICogdGhpcy52YWx1ZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogV2hlbiBgYW5jaG9yYCBpcyBub3Qgc2V0LCByZXR1cm5zIGBudWxsYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybiB7P1JhYy5Qb2ludH1cbiAgKi9cbiAga25vYigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSB0aGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0RGlzdGFuY2UodGhpcy5kaXN0YW5jZSgpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCB0aGUgYGFuY2hvcmAgcmF5IHdpdGggYGxlbmd0aGAsXG4gICogdG8gYmUgcGVyc2lzdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBhbmNob3JgIGlzIG5vdCBzZXQuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbihcbiAgICAgICAgYEV4cGVjdGVkIGFuY2hvciB0byBiZSBzZXQsIG51bGwgZm91bmQgaW5zdGVhZGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iuc2VnbWVudCh0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqL1xuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIGZpeGVkQW5jaG9yLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuYW5nbGUoKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IHBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5sZW5ndGggKiBpdGVtKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgcG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wga25vYlxuICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gTmVnYXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA+PSB0aGlzLnN0YXJ0TGltaXQgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBhbmdsZS5pbnZlcnNlKCkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aXZlIGFycm93XG4gICAgaWYgKHRoaXMudmFsdWUgPD0gdGhpcy5lbmRMaW1pdCAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KGNvbnRyb2xTdHlsZSk7XG5cbiAgICAvLyBTZWxlY3Rpb25cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICAgIGlmIChwb2ludGVyU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqXG4gICogYHZhbHVlYCBpcyBhbHdheXMgdXBkYXRlZCBieSB0aGlzIG1ldGhvZCB0byBiZSB3aXRoaW4gKlswLDFdKiBhbmRcbiAgKiBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IGZpeGVkQW5jaG9yIC0gYFNlZ21lbnRgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYFxuICAqICAgd2hlbiB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdDtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMuZW5kTGltaXQpO1xuXG4gICAgLy8gTmV3IHZhbHVlIGZyb20gdGhlIGN1cnJlbnQgcG9pbnRlciBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gZml4ZWRBbmNob3JcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnRlcktub2JDZW50ZXIpO1xuICAgIC8vIENsYW1waW5nIHZhbHVlIChqYXZhc2NyaXB0IGhhcyBubyBNYXRoLmNsYW1wKVxuICAgIG5ld0Rpc3RhbmNlID0gZml4ZWRBbmNob3IuY2xhbXBUb0xlbmd0aChuZXdEaXN0YW5jZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UgLyBsZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IGxlbmd0aFJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGFsb25nIHdpdGggcG9pbnRlciBpbnRlcmFjdGlvbiB2aXN1YWxzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IGZpeGVkQW5jaG9yIC0gYFNlZ21lbnRgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYFxuICAqICAgd2hlbiB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG4gICAgZml4ZWRBbmNob3IuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCBhbmdsZSA9IGZpeGVkQW5jaG9yLmFuZ2xlKCk7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlclBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogaXRlbSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5Qb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1pblBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5kTGltaXQgPCAxKSB7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiB0aGlzLmVuZExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWF4UG9pbnQsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBDb25zdHJhaW5lZCBsZW5ndGggY2xhbXBlZCB0byBsaW1pdHNcbiAgICBsZXQgY29uc3RyYWluZWRMZW5ndGggPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQoZHJhZ2dlZENlbnRlcik7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBsZW5ndGggKiB0aGlzLnN0YXJ0TGltaXQ7XG4gICAgbGV0IGVuZEluc2V0ID0gbGVuZ3RoICogKDEgLSB0aGlzLmVuZExpbWl0KTtcbiAgICBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yLmNsYW1wVG9MZW5ndGgoY29uc3RyYWluZWRMZW5ndGgsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICBsZXQgY29uc3RyYWluZWRBbmNob3JDZW50ZXIgPSBmaXhlZEFuY2hvclxuICAgICAgLndpdGhMZW5ndGgoY29uc3RyYWluZWRMZW5ndGgpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgY2VudGVyIGNvbnN0cmFpbmVkIHRvIGFuY2hvclxuICAgIGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYWdnZWQgc2hhZG93IGNlbnRlciwgc2VtaSBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgLy8gYWx3YXlzIHBlcnBlbmRpY3VsYXIgdG8gYW5jaG9yXG4gICAgbGV0IGRyYWdnZWRTaGFkb3dDZW50ZXIgPSBkcmFnZ2VkQ2VudGVyXG4gICAgICAuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KGZpeGVkQW5jaG9yLnJheSlcbiAgICAgIC8vIHJldmVyc2UgYW5kIHRyYW5zbGF0ZWQgdG8gY29uc3RyYWludCB0byBhbmNob3JcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoU3RhcnRQb2ludChjb25zdHJhaW5lZEFuY2hvckNlbnRlcilcbiAgICAgIC8vIFNlZ21lbnQgZnJvbSBjb25zdHJhaW5lZCBjZW50ZXIgdG8gc2hhZG93IGNlbnRlclxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBzaGFkb3cgY2VudGVyXG4gICAgZHJhZ2dlZFNoYWRvd0NlbnRlci5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzIC8gMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRWFzZSBmb3Igc2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZWFzZU91dCA9IFJhYy5FYXNlRnVuY3Rpb24ubWFrZUVhc2VPdXQoKTtcbiAgICBlYXNlT3V0LnBvc3RCZWhhdmlvciA9IFJhYy5FYXNlRnVuY3Rpb24uQmVoYXZpb3IuY2xhbXA7XG5cbiAgICAvLyBUYWlsIHdpbGwgc3RvcCBzdHJldGNoaW5nIGF0IDJ4IHRoZSBtYXggdGFpbCBsZW5ndGhcbiAgICBsZXQgbWF4RHJhZ2dlZFRhaWxMZW5ndGggPSB0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiA1O1xuICAgIGVhc2VPdXQuaW5SYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoICogMjtcbiAgICBlYXNlT3V0Lm91dFJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBkcmFnZ2VkVGFpbCA9IGRyYWdnZWRTaGFkb3dDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qb2ludChkcmFnZ2VkQ2VudGVyKTtcblxuICAgIGxldCBlYXNlZExlbmd0aCA9IGVhc2VPdXQuZWFzZVZhbHVlKGRyYWdnZWRUYWlsLmxlbmd0aCk7XG4gICAgZHJhZ2dlZFRhaWwud2l0aExlbmd0aChlYXNlZExlbmd0aCkuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYXcgYWxsIVxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJheUNvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheUNvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBbmdsZSBtZWFzdXJlZCB0aHJvdWdoIGEgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMSkqIHRoYXRcbiogcmVwcmVzZW50cyB0aGUgYW1vdW50IG9mIHR1cm4gaW4gYSBmdWxsIGNpcmNsZS5cbipcbiogTW9zdCBmdW5jdGlvbnMgdGhyb3VnaCBSQUMgdGhhdCBjYW4gcmVjZWl2ZSBhbiBgQW5nbGVgIHBhcmFtZXRlciBjYW5cbiogYWxzbyByZWNlaXZlIGEgYG51bWJlcmAgdmFsdWUgdGhhdCBpcyB1c2VkIGFzIGB0dXJuYCB0byBpbnN0YW50aWF0ZSBhIG5ld1xuKiBgQW5nbGVgLiBUaGUgbWFpbiBleGNlcHRpb24gdG8gdGhpcyBiZWhhdmlvdXIgYXJlIGNvbnN0cnVjdG9ycyxcbiogd2hpY2ggYWx3YXlzIGV4cGVjdCB0byByZWNlaXZlIGBBbmdsZWAgb2JqZWN0cy5cbipcbiogRm9yIGRyYXdpbmcgb3BlcmF0aW9ucyB0aGUgdHVybiB2YWx1ZSBvZiBgMGAgcG9pbnRzIHJpZ2h0LCB3aXRoIHRoZVxuKiBkaXJlY3Rpb24gcm90YXRpbmcgY2xvY2t3aXNlOlxuKiBgYGBcbiogcmFjLkFuZ2xlKDAvNCkgLy8gcG9pbnRzIHJpZ2h0XG4qIHJhYy5BbmdsZSgxLzQpIC8vIHBvaW50cyBkb3dud2FyZHNcbiogcmFjLkFuZ2xlKDIvNCkgLy8gcG9pbnRzIGxlZnRcbiogcmFjLkFuZ2xlKDMvNCkgLy8gcG9pbnRzIHVwd2FyZHNcbiogYGBgXG4qXG4qICMjIyBgaW5zdGFuY2UuQW5nbGVgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuQW5nbGVgIGZ1bmN0aW9uXXtAbGluayBSYWMjQW5nbGV9IHRvIGNyZWF0ZSBgQW5nbGVgIG9iamVjdHMgd2l0aFxuKiBmZXdlciBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLkFuZ2xlLnF1YXJ0ZXJgXXtAbGluayBpbnN0YW5jZS5BbmdsZSNxdWFydGVyfSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuQW5nbGVgXXtAbGluayBpbnN0YW5jZS5BbmdsZX0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IGFuZ2xlID0gbmV3IFJhYy5BbmdsZShyYWMsIDMvOClcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyQW5nbGUgPSByYWMuQW5nbGUoMy84KVxuKlxuKiBAc2VlIFtgcmFjLkFuZ2xlYF17QGxpbmsgUmFjI0FuZ2xlfVxuKiBAc2VlIFtgaW5zdGFuY2UuQW5nbGVgXXtAbGluayBpbnN0YW5jZS5BbmdsZX1cbipcbiogQGFsaWFzIFJhYy5BbmdsZVxuKi9cbmNsYXNzIEFuZ2xlIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBbmdsZWAgaW5zdGFuY2UuXG4gICpcbiAgKiBUaGUgYHR1cm5gIHZhbHVlIGlzIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5nZSAqWzAsMSkqLCBhbnkgdmFsdWVcbiAgKiBvdXRzaWRlIGlzIHJlZHVjZWQgaW50byByYW5nZSB1c2luZyBhIG1vZHVsbyBvcGVyYXRpb246XG4gICogYGBgXG4gICogKG5ldyBSYWMuQW5nbGUocmFjLCAxLzQpKSAudHVybiAvLyByZXR1cm5zIDEvNFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgNS80KSkgLnR1cm4gLy8gcmV0dXJucyAxLzRcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIC0xLzQpKS50dXJuIC8vIHJldHVybnMgMy80XG4gICogKG5ldyBSYWMuQW5nbGUocmFjLCAxKSkgICAudHVybiAvLyByZXR1cm5zIDBcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIDQpKSAgIC50dXJuIC8vIHJldHVybnMgMFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB0dXJuKSB7XG4gICAgLy8gVE9ETzogY2hhbmdlZCB0byBhc3NlcnRUeXBlLCBhZGQgdGVzdHNcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYywgcmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodHVybik7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIHR1cm4gPSB0dXJuICUgMTtcbiAgICBpZiAodHVybiA8IDApIHtcbiAgICAgIHR1cm4gPSAodHVybiArIDEpICUgMTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIFR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlLCBjb25zdHJhaW5lZCB0byB0aGUgcmFuZ2UgKlswLDEpKi5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnR1cm4gPSB0dXJuO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLkFuZ2xlKDAuMikpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnQW5nbGUoMC4yKSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHR1cm5TdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy50dXJuLCBkaWdpdHMpO1xuICAgIHJldHVybiBgQW5nbGUoJHt0dXJuU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBkaWZmZXJlbmNlIHdpdGggdGhlIGB0dXJuYCB2YWx1ZSBvZiB0aGUgYW5nbGVcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuQW5nbGUuZnJvbX0gYGFuZ2xlYCBpcyB1bmRlclxuICAqIFtgcmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9O1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBUaGUgYG90aGVyQW5nbGVgIHBhcmFtZXRlciBjYW4gb25seSBiZSBgQW5nbGVgIG9yIGBudW1iZXJgLCBhbnkgb3RoZXJcbiAgKiB0eXBlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB0dXJuIHZhbHVlcyBpbiB0aGUgb3Bvc2l0ZSBlbmRzIG9mIHRoZSByYW5nZVxuICAqICpbMCwxKSogYXMgZXF1YWxzLiBFLmcuIGBBbmdsZWAgb2JqZWN0cyB3aXRoIGB0dXJuYCB2YWx1ZXMgb2YgYDBgIGFuZFxuICAqIGAxIC0gcmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZC8yYCBhcmUgY29uc2lkZXJlZCBlcXVhbC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKlxuICAqIEBzZWUgW2ByYWMuQW5nbGUuZnJvbWBde0BsaW5rIFJhYy5BbmdsZS5mcm9tfVxuICAqL1xuICBlcXVhbHMob3RoZXJBbmdsZSkge1xuICAgIGlmIChvdGhlckFuZ2xlIGluc3RhbmNlb2YgUmFjLkFuZ2xlKSB7XG4gICAgICAvLyBhbGwgZ29vZCFcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvdGhlckFuZ2xlID09PSAnbnVtYmVyJykge1xuICAgICAgb3RoZXJBbmdsZSA9IEFuZ2xlLmZyb20odGhpcy5yYWMsIG90aGVyQW5nbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKHRoaXMudHVybiAtIG90aGVyQW5nbGUudHVybik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGRcbiAgICAgIC8vIEZvciBjbG9zZSB2YWx1ZXMgdGhhdCBsb29wIGFyb3VuZFxuICAgICAgfHwgKDEgLSBkaWZmKSA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgQW5nbGVgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYG51bWJlcmAsIHJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoXG4gICogICBgc29tZXRoaW5nYCBhcyBgdHVybmAuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYHtAbGluayBSYWMuUmF5fWAsIHJldHVybnMgaXRzIGFuZ2xlLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGB7QGxpbmsgUmFjLlNlZ21lbnR9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8UmFjLlJheXxSYWMuU2VnbWVudHxOdW1iZXJ9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhbiBgQW5nbGVgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdGF0aWMgZnJvbShyYWMsIHNvbWV0aGluZykge1xuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuQW5nbGUpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc29tZXRoaW5nID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuUmF5KSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nLmFuZ2xlO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlNlZ21lbnQpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmcucmF5LmFuZ2xlO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuQW5nbGUgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHJhZGlhbnNgLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhbnMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIHJhZGlhbnNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdGF0aWMgZnJvbVJhZGlhbnMocmFjLCByYWRpYW5zKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIHJhZGlhbnMgLyBSYWMuVEFVKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgZGVncmVlc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlcyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gZGVncmVlc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tRGVncmVlcyhyYWMsIGRlZ3JlZXMpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgZGVncmVlcyAvIDM2MCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCBwb2ludGluZyBpbiB0aGUgb3Bwb3NpdGUgZGlyZWN0aW9uIHRvIGB0aGlzYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAzLzgsIHNpbmNlIDEvOCArIDEvMiA9IDUvOFxuICAqIHJhYy5BbmdsZSgxLzgpLmludmVyc2UoKS50dXJuXG4gICogLy8gcmV0dXJucyAzLzgsIHNpbmNlIDcvOCArIDEvMiA9IDMvOFxuICAqIHJhYy5BbmdsZSg3LzgpLmludmVyc2UoKS50dXJuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIHJldHVybiB0aGlzLmFkZCh0aGlzLnJhYy5BbmdsZS5pbnZlcnNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYSB0dXJuIHZhbHVlIGVxdWl2YWxlbnQgdG8gYC10dXJuYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAzLzQsIHNpbmNlIDEgLSAxLzQgPSAzLzRcbiAgKiByYWMuQW5nbGUoMS80KS5uZWdhdGl2ZSgpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDUvOCwgc2luY2UgMSAtIDMvOCA9IDUvOFxuICAqIHJhYy5BbmdsZSgzLzgpLm5lZ2F0aXZlKCkudHVyblxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbmVnYXRpdmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgLXRoaXMudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aGljaCBpcyBwZXJwZW5kaWN1bGFyIHRvIGB0aGlzYCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAzLzgsIHNpbmNlIDEvOCArIDEvNCA9IDMvOFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIodHJ1ZSkudHVyblxuICAqIC8vIHJldHVybnMgNy84LCBzaW5jZSAxLzggLSAxLzQgPSA3LzhcbiAgKiByYWMuQW5nbGUoMS84KS5wZXJwZW5kaWN1bGFyKGZhbHNlKS50dXJuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlmdCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICByYWRpYW5zKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSBpbiBkZWdyZWVzLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgZGVncmVlcygpIHtcbiAgICByZXR1cm4gdGhpcy50dXJuICogMzYwO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBzaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHNpbigpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4odGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGNvc2luZSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBjb3MoKSB7XG4gICAgcmV0dXJuIE1hdGguY29zKHRoaXMucmFkaWFucygpKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB0YW5nZW50IG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHRhbigpIHtcbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGB0dXJuYCB2YWx1ZSBpbiB0aGUgcmFuZ2UgYCgwLCAxXWAuIFdoZW4gYHR1cm5gIGlzIGVxdWFsIHRvXG4gICogYDBgIHJldHVybnMgYDFgIGluc3RlYWQuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICB0dXJuT25lKCkge1xuICAgIGlmICh0aGlzLnR1cm4gPT09IDApIHsgcmV0dXJuIDE7IH1cbiAgICByZXR1cm4gdGhpcy50dXJuO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgc3VtIG9mIGB0aGlzYCBhbmQgdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbVxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhZGQoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiArIGFuZ2xlLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWBcbiAgKiBzdWJ0cmFjdGVkIHRvIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3VidHJhY3QoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAtIGFuZ2xlLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgdHVybmAgc2V0IHRvIGB0aGlzLnR1cm4gKiBmYWN0b3JgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGZhY3RvciAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYHR1cm5gIGJ5XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbXVsdChmYWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gKiBmYWN0b3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgdHVybmAgc2V0IHRvXG4gICogYHtAbGluayBSYWMuQW5nbGUjdHVybk9uZSB0aGlzLnR1cm5PbmUoKX0gKiBmYWN0b3JgLlxuICAqXG4gICogVXNlZnVsIHdoZW4gZG9pbmcgcmF0aW8gY2FsY3VsYXRpb25zIHdoZXJlIGEgemVybyBhbmdsZSBjb3JyZXNwb25kcyB0b1xuICAqIGEgY29tcGxldGUtY2lyY2xlLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuQW5nbGUoMCkubXVsdCgwLjUpLnR1cm4gICAgLy8gcmV0dXJucyAwXG4gICogLy8gd2hlcmVhc1xuICAqIHJhYy5BbmdsZSgwKS5tdWx0T25lKDAuNSkudHVybiAvLyByZXR1cm5zIDAuNVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGZhY3RvciAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYHR1cm5gIGJ5XG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgbXVsdE9uZShmYWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm5PbmUoKSAqIGZhY3Rvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXNgIHRvIHRoZVxuICAqIGFuZ2xlIGRlcml2ZWQgZnJvbSBgYW5nbGVgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDEvMiwgc2luY2UgMS8yIC0gMS80ID0gMS80XG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCB0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyAzLzQsIHNpbmNlIDEgLSAoMS8yIC0gMS80KSA9IDMvNFxuICAqIHJhYy5BbmdsZSgxLzQpLmRpc3RhbmNlKDEvMiwgZmFsc2UpLnR1cm5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBtZWFzdXJlbWVudFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlKGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gZGlzdGFuY2VcbiAgICAgIDogZGlzdGFuY2UubmVnYXRpdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCByZXN1bHQgb2YgYWRkaW5nIGBhbmdsZWAgdG8gYHRoaXNgLCBpbiB0aGVcbiAgKiBnaXZlbiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIGVxdWl2YWxlbnQgdG8gc2hpZnRpbmcgYGFuZ2xlYCB3aGVyZSBgdGhpc2AgaXNcbiAgKiBjb25zaWRlcmVkIHRoZSBhbmdsZSBvZiBvcmlnaW4uXG4gICpcbiAgKiBUaGUgcmV0dXJuIGlzIGVxdWl2YWxlbnQgdG86XG4gICogKyBgdGhpcy5hZGQoYW5nbGUpYCB3aGVuIGNsb2Nrd2lzZVxuICAqICsgYHRoaXMuc3VidHJhY3QoYW5nbGUpYCB3aGVuIGNvdW50ZXItY2xvY2t3aXNlXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuNSwgdHJ1ZSkudHVyblxuICAqIC8vIHJldHVybnMgMC42LCBzaW5jZSAwLjUgKyAwLjEgPSAwLjZcbiAgKlxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuNSwgZmFsc2UpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDAuNCwgc2luY2UgMC41IC0gMC4xID0gMC40XG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBiZSBzaGlmdGVkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IHRoaXMuYWRkKGFuZ2xlKVxuICAgICAgOiB0aGlzLnN1YnRyYWN0KGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBhZGRpbmcgYHRoaXNgIHRvIGBvcmlnaW5gLCBpbiB0aGUgZ2l2ZW5cbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIGVxdWl2YWxlbnQgdG8gc2hpZnRpbmcgYHRoaXNgIHdoZXJlIGBvcmlnaW5gIGlzXG4gICogY29uc2lkZXJlZCB0aGUgYW5nbGUgb2Ygb3JpZ2luLlxuICAqXG4gICogVGhlIHJldHVybiBpcyBlcXVpdmFsZW50IHRvOlxuICAqICsgYG9yaWdpbi5hZGQodGhpcylgIHdoZW4gY2xvY2t3aXNlXG4gICogKyBgb3JpZ2luLnN1YnRyYWN0KHRoaXMpYCB3aGVuIGNvdW50ZXItY2xvY2t3aXNlXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC41LCB0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjYsIHNpbmNlIDAuNSArIDAuMSA9IDAuNlxuICAqXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjUsIGZhbHNlKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjQsIHNpbmNlIDAuNSAtIDAuMSA9IDAuNFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBvcmlnaW4gLSBBbiBgQW5nbGVgIHRvIHVzZSBhcyBvcmlnaW5cbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnRUb09yaWdpbihvcmlnaW4sIGNsb2Nrd2lzZSkge1xuICAgIG9yaWdpbiA9IHRoaXMucmFjLkFuZ2xlLmZyb20ob3JpZ2luKTtcbiAgICByZXR1cm4gb3JpZ2luLnNoaWZ0KHRoaXMsIGNsb2Nrd2lzZSk7XG4gIH1cblxufSAvLyBjbGFzcyBBbmdsZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQW5nbGU7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cblxuLyoqXG4qIEFyYyBvZiBhIGNpcmNsZSBmcm9tIGEgYHN0YXJ0YCB0byBhbiBgZW5kYCBbYW5nbGVde0BsaW5rIFJhYy5BbmdsZX0uXG4qXG4qIEFyY3MgdGhhdCBoYXZlIFtlcXVhbF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30gYHN0YXJ0YCBhbmQgYGVuZGAgYW5nbGVzXG4qIGFyZSBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuKlxuKiAjIyMgYGluc3RhbmNlLkFyY2BcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5BcmNgIGZ1bmN0aW9uXXtAbGluayBSYWMjQXJjfSB0byBjcmVhdGUgYEFyY2Agb2JqZWN0cyBmcm9tXG4qIHByaW1pdGl2ZSB2YWx1ZXMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuQXJjLnplcm9gXXtAbGluayBpbnN0YW5jZS5BcmMjemVyb30sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLkFyY2Bde0BsaW5rIGluc3RhbmNlLkFyY30uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IGNlbnRlciA9IHJhYy5Qb2ludCg1NSwgNzcpXG4qIGxldCBzdGFydCA9IHJhYy5BbmdsZSgxLzgpXG4qIGxldCBlbmQgPSByYWMuQW5nbGUoMy84KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgYXJjID0gbmV3IFJhYy5BcmMocmFjLCBjZW50ZXIsIDEwMCwgc3RhcnQsIGVuZCwgdHJ1ZSlcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyQXJjID0gcmFjLkFyYyg1NSwgNzcsIDEvOCwgMy84KVxuKlxuKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiogQHNlZSBbYHJhYy5BcmNgXXtAbGluayBSYWMjQXJjfVxuKiBAc2VlIFtgaW5zdGFuY2UuQXJjYF17QGxpbmsgaW5zdGFuY2UuQXJjfVxuKlxuKiBAYWxpYXMgUmFjLkFyY1xuKi9cbmNsYXNzIEFyY3tcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBcmNgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBjZW50ZXIgLSBUaGUgY2VudGVyIG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IHN0YXJ0IC0gQW4gYEFuZ2xlYCB3aGVyZSB0aGUgYXJjIHN0YXJ0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBlbmQgLSBBbmcgYEFuZ2xlYCB3aGVyZSB0aGUgYXJjIGVuZHNcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IGNsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYyxcbiAgICBjZW50ZXIsIHJhZGl1cyxcbiAgICBzdGFydCwgZW5kLFxuICAgIGNsb2Nrd2lzZSlcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBjZW50ZXIpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihyYWRpdXMpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBzdGFydCwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRCb29sZWFuKGNsb2Nrd2lzZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGNlbnRlciBgUG9pbnRgIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAgICovXG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAvKipcbiAgICAqIFRoZSByYWRpdXMgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcblxuICAgIC8qKlxuICAgICogVGhlIHN0YXJ0IGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gdGhpcyBhbmdsZSB0b3dhcmRzXG4gICAgKiBgZW5kYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcblxuICAgIC8qKlxuICAgICogVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBhcmMuIFRoZSBhcmMgaXMgZHJhdyBmcm9tIGBzdGFydGAgdG8gdGhpc1xuICAgICogYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAgICpcbiAgICAqIFdoZW4gYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKiB0aGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICovXG4gICAgdGhpcy5lbmQgPSBlbmQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBvcmllbnRpYXRpb24gb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICovXG4gICAgdGhpcy5jbG9ja3dpc2UgPSBjbG9ja3dpc2U7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuQXJjKDU1LCA3NywgMC4yLCAwLjQsIDEwMCkudG9TdHJpbmcoKVxuICAqIC8vIHJldHVybnM6ICdBcmMoKDU1LDc3KSByOjEwMCBzOjAuMiBlOjAuNCBjOnRydWUpJ1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuY2VudGVyLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHJhZGl1c1N0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJhZGl1cywgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRTdHIgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQudHVybiwgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRTdHIgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQudHVybiwgICBkaWdpdHMpO1xuICAgIHJldHVybiBgQXJjKCgke3hTdHJ9LCR7eVN0cn0pIHI6JHtyYWRpdXNTdHJ9IHM6JHtzdGFydFN0cn0gZToke2VuZFN0cn0gYzoke3RoaXMuY2xvY2t3aXNlfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzLCBleGNlcHQgYHJhY2AsIG9mIGJvdGggYXJjcyBhcmUgZXF1YWw7XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyQXJjYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkFyY2AsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEFyY3MnIGByYWRpdXNgIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IG90aGVyU2VnbWVudCAtIEEgYFNlZ21lbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgKiBAc2VlIFtgcmFjLmVxdWFsc2Bde0BsaW5rIFJhYyNlcXVhbHN9XG4gICovXG4gIGVxdWFscyhvdGhlckFyYykge1xuICAgIHJldHVybiBvdGhlckFyYyBpbnN0YW5jZW9mIEFyY1xuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMucmFkaXVzLCBvdGhlckFyYy5yYWRpdXMpXG4gICAgICAmJiB0aGlzLmNsb2Nrd2lzZSA9PT0gb3RoZXJBcmMuY2xvY2t3aXNlXG4gICAgICAmJiB0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJBcmMuc3RhcnQpXG4gICAgICAmJiB0aGlzLmVuZC5lcXVhbHMob3RoZXJBcmMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmM6IHRoZSBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIHRoZSBhcmNcbiAgKiByZXByZXNlbnRzLlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlKCkudHVybk9uZSgpICogdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBjaXJjdW1mZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cyAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8vIFRPRE86IHJlcGxhY2UgYGluIHRoZSBvcmllbnRhdGlvbmAgdG8gYHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uYD9cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgYmV0d2VlbiBgc3RhcnRgIGFuZFxuICAqIGBlbmRgLCBpbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGFyYy5cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhbmdsZURpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmRpc3RhbmNlKHRoaXMuZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSBhcmMgc3RhcnRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN0YXJ0UG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHRoaXMuc3RhcnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCB3aGVyZSB0aGUgYXJjIGVuZHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgZW5kUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGBjZW50ZXJgIHRvd2FycyBgc3RhcnRgLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBzdGFydFJheSgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnN0YXJ0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGBjZW50ZXJgIHRvd2FycyBgZW5kYC5cbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgZW5kUmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB0YW5nZW50IHRvIHRoZSBhcmMgc3RhcnRpbmcgYXQgYHN0YXJ0UG9pbnQoKWAgYW5kXG4gICogdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICovXG4gIHN0YXJ0VGFuZ2VudFJheSgpIHtcbiAgICBsZXQgdGFuZ2VudEFuZ2xlID0gdGhpcy5zdGFydC5wZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydFBvaW50KCkucmF5KHRhbmdlbnRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGFuZ2VudCB0byB0aGUgYXJjIHN0YXJ0aW5nIGF0IGBlbmRQb2ludCgpYCBhbmRcbiAgKiBhZ2FpbnN0IHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKi9cbiAgZW5kVGFuZ2VudFJheSgpIHtcbiAgICBsZXQgdGFuZ2VudEFuZ2xlID0gdGhpcy5lbmQucGVycGVuZGljdWxhcighdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLmVuZFBvaW50KCkucmF5KHRhbmdlbnRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgYHN0YXJ0YC5cbiAgKiBUaGUgc2VnbWVudCBzdGFydHMgc3RhcnRzIGF0IGBjZW50ZXJgIGFuZCBlbmRzIGF0IGBzdGFydFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc3RhcnRSYWRpdXNTZWdtZW50KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMuc3RhcnRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGF0IGBzdGFydGAuXG4gICogVGhlIHNlZ21lbnQgc3RhcnRzIHN0YXJ0cyBhdCBgY2VudGVyYCBhbmQgZW5kcyBhdCBgc3RhcnRQb2ludCgpYC5cbiAgKlxuICAqIEVxdWl2YWxlbnQgdG8gW2BzdGFydFJhZGl1c1NlZ21lbnRgXXtAbGluayBSYWMuQXJjI3N0YXJ0UmFkaXVzU2VnbWVudH0uXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzdGFydFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRSYWRpdXNTZWdtZW50KClcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCBgZW5kYC5cbiAgKiBUaGUgc2VnbWVudCBzdGFydHMgc3RhcnRzIGF0IGBjZW50ZXJgIGFuZCBlbmRzIGF0IGBlbmRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGVuZFJhZGl1c1NlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5lbmRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGF0IGBlbmRgLlxuICAqIFRoZSBzZWdtZW50IHN0YXJ0cyBzdGFydHMgYXQgYGNlbnRlcmAgYW5kIGVuZHMgYXQgYGVuZFBvaW50KClgLlxuICAqXG4gICogRXF1aXZhbGVudCB0byBbYGVuZFJhZGl1c1NlZ21lbnRgXXtAbGluayBSYWMuQXJjI2VuZFJhZGl1c1NlZ21lbnR9LlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBlbmRTZWdtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVuZFJhZGl1c1NlZ21lbnQoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgc3RhcnRQb2ludCgpYCB0byBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBOb3RlIHRoYXQgZm9yIGNvbXBsZXRlIGNpcmNsZSBhcmNzIHRoaXMgc2VnbWVudCB3aWxsIGhhdmUgYSBsZW5ndGggb2ZcbiAgKiB6ZXJvIGFuZCBiZSBwb2ludGVkIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgb2YgYHN0YXJ0YCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgY2hvcmRTZWdtZW50KCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLnN0YXJ0LnBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0UG9pbnQoKS5zZWdtZW50VG9Qb2ludCh0aGlzLmVuZFBvaW50KCksIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJjIGlzIGEgY29tcGxldGUgY2lyY2xlLCB3aGljaCBpcyB3aGVuIGBzdGFydGBcbiAgKiBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9LlxuICAqXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICovXG4gIGlzQ2lyY2xlKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmVxdWFscyh0aGlzLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgc2V0IHRvIGBuZXdDZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdDZW50ZXIgLSBUaGUgY2VudGVyIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhDZW50ZXIobmV3Q2VudGVyKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICBuZXdDZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBzdGFydCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld1N0YXJ0IC0gVGhlIHN0YXJ0IGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhTdGFydChuZXdTdGFydCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnRBbmdsZSwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBlbmQgc2V0IHRvIGBuZXdFbmRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3RW5kIC0gVGhlIGVuZCBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoRW5kKG5ld0VuZCkge1xuICAgIGNvbnN0IG5ld0VuZEFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0VuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmRBbmdsZSxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHJhZGl1cyBzZXQgdG8gYG5ld1JhZGl1c2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1JhZGl1cyAtIFRoZSByYWRpdXMgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFJhZGl1cyhuZXdSYWRpdXMpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGl0cyBvcmllbnRhdGlvbiBzZXQgdG8gYG5ld0Nsb2Nrd2lzZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtCb29sZWFufSBuZXdDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENsb2Nrd2lzZShuZXdDbG9ja3dpc2UpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgbmV3Q2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgYW5nbGVEaXN0YW5jZWAgYXMgdGhlIGRpc3RhbmNlXG4gICogYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uIFRoaXMgY2hhbmdlcyBgZW5kYFxuICAqIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBvZiB0aGVcbiAgKiBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFtgYXJjLmFuZ2xlRGlzdGFuY2VgXXtAbGluayBSYWMuQXJjI2FuZ2xlRGlzdGFuY2V9XG4gICovXG4gIHdpdGhBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdFbmQgPSB0aGlzLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAgYXMgdGhlIGxlbmd0aCBvZiB0aGVcbiAgKiBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIGl0IHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIGdpdmVuIGBsZW5ndGhgIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSByZWR1Y2VkIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBbYGxlbmd0aGBde0BsaW5rIFJhYy5BcmMjbGVuZ3RofVxuICAqL1xuICB3aXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBpbmNyZW1lbnRgIGFkZGVkIHRvIHRoZSBwYXJ0IG9mIHRoZVxuICAqIGNpcmN1bWZlcmVuY2UgYHRoaXNgIHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIHJlc3VsdGluZyBsZW5ndGggaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIHJlZHVjZWQgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBzZWUgW2BsZW5ndGhgXXtAbGluayBSYWMuQXJjI2xlbmd0aH1cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBpbmNyZW1lbnQgLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoTGVuZ3RoQWRkKGluY3JlbWVudCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSAodGhpcy5sZW5ndGgoKSArIGluY3JlbWVudCkgLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGEgYGxlbmd0aCgpYCBvZiBgdGhpcy5sZW5ndGgoKSAqIHJhdGlvYC4gVGhpc1xuICAqIGNoYW5nZXMgYGVuZGAgZm9yIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgKlswLHJhZGl1cypUQVUpKi4gV2hlbiB0aGUgY2FsY3VsYXRlZCBsZW5ndGggaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIHJlZHVjZWQgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYGxlbmd0aGBde0BsaW5rIFJhYy5BcmMjbGVuZ3RofVxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aCgpICogcmF0aW87XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aChuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0UG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzXG4gICogY2hhbmdlcyBgc3RhcnRgIGFuZCBgcmFkaXVzYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5zdGFydGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgYXQgdGhlIGBzdGFydFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhTdGFydFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZFBvaW50KClgIGxvY2F0ZWQgYXQgYHBvaW50YC4gVGhpcyBjaGFuZ2VzXG4gICogYGVuZGAgYW5kIGByYWRpdXNgIGluIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuZW5kYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYGVuZFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhFbmRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbVxuICAqIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICB3aXRoU3RhcnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBlbmRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aEVuZFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBzdGFydFBvaW50YCBhbmRcbiAgKiBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBlbmRQb2ludGAsIGJvdGggZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiAqIFdoZW4gYGNlbnRlcmAgaXMgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRvXG4gICogZWl0aGVyIGBzdGFydFBvaW50YCBvciBgZW5kUG9pbnRgLCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YFxuICAqIG9yIGB0aGlzLmVuZGAgcmVzcGVjdGl2ZWx5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0UG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHs/UmFjLlBvaW50fSBbZW5kUG9pbnQ9bnVsbF0gLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkcztcbiAgKiB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgLCBgc3RhcnRQb2ludGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhBbmdsZXNUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3RW5kID0gZW5kUG9pbnQgPT09IG51bGxcbiAgICAgID8gbmV3U3RhcnRcbiAgICAgIDogdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGVuZFBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fVxuICAqIHRoZSBnaXZlbiBgYW5nbGVgIHRvd2FyZHMgdGhlIGFyYydzIG9wcG9zaXRlIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgc3RhcnRgIHRvd2FyZHMgdGhlIGFyYydzICpvcHBvc2l0ZSpcbiAgKiBvcmllbnRhdGlvbiwgcmVzdWx0aW5nIGluIGEgbmV3IGBBcmNgIHdpdGggYW4gaW5jcmVhc2UgdG9cbiAgKiBgYW5nbGVEaXN0YW5jZSgpYC5cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnQgYHN0YXJ0YCBhZ2FpbnN0XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhTdGFydEV4dGVuc2lvbihhbmdsZSkge1xuICAgIGxldCBuZXdTdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQoYW5nbGUsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fSB0aGVcbiAgKiBnaXZlbiBgYW5nbGVgIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgZW5kYCB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbixcbiAgKiByZXN1bHRpbmcgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0byBgYW5nbGVEaXN0YW5jZSgpYC5cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnQgYHN0YXJ0YCBhZ2FpbnN0XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhFbmRFeHRlbnNpb24oYW5nbGUpIHtcbiAgICBsZXQgbmV3RW5kID0gdGhpcy5lbmQuc2hpZnQoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGl0cyBgc3RhcnRgIGFuZCBgZW5kYCBleGNoYW5nZWQsIGFuZCB0aGVcbiAgKiBvcHBvc2l0ZSBjbG9ja3dpc2Ugb3JpZW50YXRpb24uIFRoZSBjZW50ZXIgYW5kIHJhZGl1cyByZW1haW4gdGhlXG4gICogc2FtZSBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuZW5kLCB0aGlzLnN0YXJ0LFxuICAgICAgIXRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZ2l2ZW4gYGFuZ2xlYCBjbGFtcGVkIHRvIHRoZSByYW5nZTpcbiAgKiBgYGBcbiAgKiBbc3RhcnQgKyBzdGFydEluc2V0LCBlbmQgLSBlbmRJbnNldF1cbiAgKiBgYGBcbiAgKiB3aGVyZSB0aGUgYWRkaXRpb24gaGFwcGVucyB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbiwgYW5kIHRoZVxuICAqIHN1YnRyYWN0aW9uIGFnYWluc3QuXG4gICpcbiAgKiBXaGVuIGBhbmdsZWAgaXMgb3V0c2lkZSB0aGUgcmFuZ2UsIHJldHVybnMgd2hpY2hldmVyIHJhbmdlIGxpbWl0IGlzXG4gICogY2xvc2VyLlxuICAqXG4gICogV2hlbiB0aGUgc3VtIG9mIHRoZSBnaXZlbiBpbnNldHMgaXMgbGFyZ2VyIHRoYXQgYHRoaXMuYXJjRGlzdGFuY2UoKWBcbiAgKiB0aGUgcmFuZ2UgZm9yIHRoZSBjbGFtcCBpcyBpbXBvc2libGUgdG8gZnVsZmlsbC4gSW4gdGhpcyBjYXNlIHRoZVxuICAqIHJldHVybmVkIHZhbHVlIHdpbGwgYmUgdGhlIGNlbnRlcmVkIGJldHdlZW4gdGhlIHJhbmdlIGxpbWl0cyBhbmQgc3RpbGxcbiAgKiBjbGFtcGxlZCB0byBgW3N0YXJ0LCBlbmRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGNsYW1wXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBbc3RhcnRJbnNldD17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVybyByYWMuQW5nbGUuemVyb31dIC1cbiAgKiAgIFRoZSBpbnNldCBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gW2VuZEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvIHJhYy5BbmdsZS56ZXJvfV0gLVxuICAqICAgVGhlIGluc2V0IGZvciB0aGUgaGlnaGVyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGNsYW1wVG9BbmdsZXMoYW5nbGUsIHN0YXJ0SW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLCBlbmRJbnNldCA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG5cbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpICYmIHN0YXJ0SW5zZXQudHVybiA9PSAwICYmIGVuZEluc2V0LnR1cm4gPT0gMCkge1xuICAgICAgLy8gQ29tcGxldGUgY2lyY2xlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gQW5nbGUgaW4gYXJjLCB3aXRoIGFyYyBhcyBvcmlnaW5cbiAgICAvLyBBbGwgY29tcGFyaXNvbnMgYXJlIG1hZGUgaW4gYSBjbG9ja3dpc2Ugb3JpZW50YXRpb25cbiAgICBjb25zdCBzaGlmdGVkQW5nbGUgPSB0aGlzLmRpc3RhbmNlRnJvbVN0YXJ0KGFuZ2xlKTtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3Qgc2hpZnRlZFN0YXJ0Q2xhbXAgPSBzdGFydEluc2V0O1xuICAgIGNvbnN0IHNoaWZ0ZWRFbmRDbGFtcCA9IGFuZ2xlRGlzdGFuY2Uuc3VidHJhY3QoZW5kSW5zZXQpO1xuICAgIGNvbnN0IHRvdGFsSW5zZXRUdXJuID0gc3RhcnRJbnNldC50dXJuICsgZW5kSW5zZXQudHVybjtcblxuICAgIGlmICh0b3RhbEluc2V0VHVybiA+PSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSkge1xuICAgICAgLy8gSW52YWxpZCByYW5nZVxuICAgICAgY29uc3QgcmFuZ2VEaXN0YW5jZSA9IHNoaWZ0ZWRFbmRDbGFtcC5kaXN0YW5jZShzaGlmdGVkU3RhcnRDbGFtcCk7XG4gICAgICBsZXQgaGFsZlJhbmdlO1xuICAgICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkge1xuICAgICAgICBoYWxmUmFuZ2UgPSByYW5nZURpc3RhbmNlLm11bHQoMS8yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhhbGZSYW5nZSA9IHRvdGFsSW5zZXRUdXJuID49IDFcbiAgICAgICAgICA/IHJhbmdlRGlzdGFuY2UubXVsdE9uZSgxLzIpXG4gICAgICAgICAgOiByYW5nZURpc3RhbmNlLm11bHQoMS8yKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWlkZGxlUmFuZ2UgPSBzaGlmdGVkRW5kQ2xhbXAuYWRkKGhhbGZSYW5nZSk7XG4gICAgICBjb25zdCBtaWRkbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KG1pZGRsZVJhbmdlLCB0aGlzLmNsb2Nrd2lzZSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmNsYW1wVG9BbmdsZXMobWlkZGxlKTtcbiAgICB9XG5cbiAgICBpZiAoc2hpZnRlZEFuZ2xlLnR1cm4gPj0gc2hpZnRlZFN0YXJ0Q2xhbXAudHVybiAmJiBzaGlmdGVkQW5nbGUudHVybiA8PSBzaGlmdGVkRW5kQ2xhbXAudHVybikge1xuICAgICAgLy8gSW5zaWRlIGNsYW1wIHJhbmdlXG4gICAgICByZXR1cm4gYW5nbGU7XG4gICAgfVxuXG4gICAgLy8gT3V0c2lkZSByYW5nZSwgZmlndXJlIG91dCBjbG9zZXN0IGxpbWl0XG4gICAgbGV0IGRpc3RhbmNlVG9TdGFydENsYW1wID0gc2hpZnRlZFN0YXJ0Q2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlLCBmYWxzZSk7XG4gICAgbGV0IGRpc3RhbmNlVG9FbmRDbGFtcCA9IHNoaWZ0ZWRFbmRDbGFtcC5kaXN0YW5jZShzaGlmdGVkQW5nbGUpO1xuICAgIGlmIChkaXN0YW5jZVRvU3RhcnRDbGFtcC50dXJuIDw9IGRpc3RhbmNlVG9FbmRDbGFtcC50dXJuKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChzdGFydEluc2V0LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVuZC5zaGlmdChlbmRJbnNldCwgIXRoaXMuY2xvY2t3aXNlKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYGFuZ2xlYCBpcyBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBldmFsdWF0ZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBjb250YWluc0FuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIGlmICh0aGlzLmNsb2Nrd2lzZSkge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgICAgbGV0IGVuZE9mZnNldCA9IHRoaXMuZW5kLnN1YnRyYWN0KHRoaXMuc3RhcnQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IGVuZE9mZnNldC50dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gYW5nbGUuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgbGV0IHN0YXJ0T2Zmc2V0ID0gdGhpcy5zdGFydC5zdWJ0cmFjdCh0aGlzLmVuZCk7XG4gICAgICByZXR1cm4gb2Zmc2V0LnR1cm4gPD0gc3RhcnRPZmZzZXQudHVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgaW4gdGhlIGFyYyBpcyBwb3NpdGlvbmVkXG4gICogYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIHRoZSBhcmMgcmVwcmVzZW50cyBhIGNvbXBsZXRlIGNpcmNsZSwgYHRydWVgIGlzIGFsd2F5cyByZXR1cm5lZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBldmFsdWF0ZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBjb250YWluc1Byb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zQW5nbGUodGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50KSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIGFuZCBgZW5kYCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fVxuICAqIHRoZSBnaXZlbiBgYW5nbGVgIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGJvdGggYHN0YXJ0YCBhbmQgYGVuZGAgdG93YXJkcyB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbiwgcmVzdWx0aW5nIGluIGEgbmV3IGBBcmNgIHdpdGggdGhlIHNhbWUgYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAc2VlIFtgYW5nbGUuc2hpZnRgXXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmM8L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoMCwgMCwgMC40LCAwLjYsIHRydWUpXG4gICogbGV0IHNoaWZ0ZWRBcmMgPSBhcmMuc2hpZnQoMC4xKVxuICAqIHNoaWZ0ZWRBcmMuc3RhcnQudHVybiAvLyByZXR1cm5zIDAuNVxuICAqIHNoaWZ0ZWRBcmMuZW5kLnR1cm4gICAvLyByZXR1cm5zIDAuN1xuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmM8L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoMCwgMCwgMC40LCAwLjYsIGZhbHNlKVxuICAqIGxldCBzaGlmdGVkQXJjID0gYXJjLnNoaWZ0KDAuMSlcbiAgKiBzaGlmdGVkQXJjLnN0YXJ0LnR1cm4gLy8gcmV0dXJucyAwLjNcbiAgKiBzaGlmdGVkQXJjLmVuZC50dXJuICAgLy8gcmV0dXJucyAwLjVcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IHRoZSBhcmMgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgc2hpZnQoYW5nbGUpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICBjb25zdCBuZXdFbmQgPSB0aGlzLmVuZC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuXG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgYW5nbGVgIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICogYHN0YXJ0YCB0b3dhcmRzIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCA8Y29kZT4wLjU8L2NvZGU+PC9jYXB0aW9uPlxuICAqIGxldCBhcmMgPSByYWMuQXJjKDAsIDAsIDAuNSwgbnVsbCwgdHJ1ZSlcbiAgKiBhcmMuc2hpZnRBbmdsZSgwLjEpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDAuNiwgc2luY2UgMC41ICsgMC4xID0gMC42XG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNvdW50ZXItY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCA8Y29kZT4wLjU8L2NvZGU+PC9jYXB0aW9uPlxuICAqIGxldCBhcmMgPSByYWMuQXJjKDAsIDAsIDAuNSwgbnVsbCwgZmFsc2UpXG4gICogYXJjLnNoaWZ0QW5nbGUoMC4xKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjQsIHNpbmNlIDAuNSAtIDAuMSA9IDAuNFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzaGlmdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gYHN0YXJ0YFxuICAqIHRvIGBhbmdsZWAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogQ2FuIGJlIHVzZWQgdG8gZGV0ZXJtaW5lLCBmb3IgYSBnaXZlbiBhbmdsZSwgd2hlcmUgaXQgc2l0cyBpbnNpZGUgdGhlXG4gICogYXJjIGlmIHRoZSBhcmMgYHN0YXJ0YCB3YXMgdGhlIG9yaWdpbiBhbmdsZS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCA8Y29kZT4wLjU8L2NvZGU+PC9jYXB0aW9uPlxuICAqIGxldCBhcmMgPSByYWMuQXJjKDU1LCA3NywgMC41LCBudWxsLCB0cnVlKVxuICAqIC8vIHJldHVybnMgMC4yLCBzaW5jZSAwLjcgLSAwLjUgPSAwLjJcbiAgKiBhcmMuZGlzdGFuY2VGcm9tU3RhcnQoMC43KVxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYyg1NSwgNzcsIDAuNSwgbnVsbCwgZmFsc2UpXG4gICogLy8gcmV0dXJucyAwLjgsIHNpbmNlIDEgLSAoMC43IC0gMC41KSA9IDAuOFxuICAqIGFyYy5kaXN0YW5jZUZyb21TdGFydCgwLjcpXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtZWFzdXJlIHRoZSBkaXN0YW5jZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlRnJvbVN0YXJ0KGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmRpc3RhbmNlKGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBhbmdsZWAuIFRoaXNcbiAgKiBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlIGBzdGFydGAgbm9yIGBlbmRgIG9mIHRoZSBhcmMuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0b3dhcmRzIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5jZW50ZXIucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8vIFRPRE86IGNoZWNrIG90aGVyIGluc3RhbmNlcyBvZiBgYXJjIGlzIGNvbnNpZGVyZWRgIGFuZCBhZGQgbm90ZSBvZlxuICAvLyB0aGUgcG9zc2libGUgaW1wYWN0LCB1c2luZyB0aGlzIGFzIGV4YW1wbGVcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYFxuICAqIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9IGBzdGFydGAgdG93YXJkcyB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEZvciB0aGlzIG9wZXJhdGlvbiB0aGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZVxuICAqIHJldHVybmVkIGBQb2ludGAgbWF5IGJlIG91dHNpZGUgdGhlIGFyYydzIGJvdW5kcy5cbiAgKlxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYmUgc2hpZnRlZCBieSBgc3RhcnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGUpIHtcbiAgICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5zaGlmdEFuZ2xlKGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggZnJvbSBgc3RhcnRQb2ludCgpYCB0byB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCBgbGVuZ3RoKCkgKiByYXRpb2AgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGxldCBuZXdBbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCkubXVsdE9uZShyYXRpbyk7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCB0aGVcbiAgKiBnaXZlbiBgYW5nbGVgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2ZcbiAgKiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGluIHRoZVxuICAqIGRpcmVjdGlvbiB0b3dhcmRzIHRoZSBnaXZlbiBgcG9pbnRgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGVcbiAgKiBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMucG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGluIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBhbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZvciB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZSBpbnRlcnNlY3Rpb24gb2ZcbiAgKiBgdGhpc2AgYW5kIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgcG9pbnQgdG93YXJkcyBgdGhpc2Agb3JpZW50YXRpb24uXG4gICpcbiAgKiBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuICAqIGNob3JkLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgbWF5IG5vdCBsYXkgaW5zaWRlXG4gICogdGhlIGFjdHVhbCBhcmNzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIGRlc2NyaXB0aW9uXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpIHtcbiAgICAvLyBodHRwczovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9DaXJjbGUtQ2lyY2xlSW50ZXJzZWN0aW9uLmh0bWxcbiAgICAvLyBSPXRoaXMsIHI9b3RoZXJBcmNcblxuICAgIGlmICh0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLmNlbnRlci5kaXN0YW5jZVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcblxuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzICsgb3RoZXJBcmMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBkaXN0YW5jZVRvQ2hvcmQgPSAoZF4yIC0gcl4yICsgUl4yKSAvIChkKjIpXG4gICAgY29uc3QgZGlzdGFuY2VUb0Nob3JkID0gKFxuICAgICAgICBNYXRoLnBvdyhkaXN0YW5jZSwgMilcbiAgICAgIC0gTWF0aC5wb3cob3RoZXJBcmMucmFkaXVzLCAyKVxuICAgICAgKyBNYXRoLnBvdyh0aGlzLnJhZGl1cywgMilcbiAgICAgICkgLyAoZGlzdGFuY2UgKiAyKTtcblxuICAgIC8vIGEgPSAxL2Qgc3FydHwoLWQrci1SKSgtZC1yK1IpKC1kK3IrUikoZCtyK1IpXG4gICAgY29uc3QgY2hvcmRMZW5ndGggPSAoMSAvIGRpc3RhbmNlKSAqIE1hdGguc3FydChcbiAgICAgICAgKC1kaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlIC0gb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAgICogKGRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpKTtcblxuICAgIGNvbnN0IHNlZ21lbnRUb0Nob3JkID0gdGhpcy5jZW50ZXIucmF5VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpXG4gICAgICAuc2VnbWVudChkaXN0YW5jZVRvQ2hvcmQpO1xuICAgIHJldHVybiBzZWdtZW50VG9DaG9yZC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UsIGNob3JkTGVuZ3RoLzIpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aFJhdGlvKDIpO1xuICB9XG5cblxuICAvLyBUT0RPOiBjb25zaWRlciBpZiBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjIGlzIG5lY2Vzc2FyeVxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGludGVyc2VjdGluZyBwb2ludHMgb2YgYHRoaXNgIHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogV2hlbiB0aGVyZSBhcmUgbm8gaW50ZXJzZWN0aW5nIHBvaW50cywgcmV0dXJucyBhbiBlbXB0eSBhcnJheS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgaW50ZXJzZWN0aW9uIHBvaW50cyB3aXRoXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGludGVyc2VjdGluZ1BvaW50c1dpdGhBcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cbiAgLy8gICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCldLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gIC8vICAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0pKVxuICAvLyAgICAgICAmJiBvdGhlckFyYy5jb250YWluc0FuZ2xlKG90aGVyQXJjLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSk7XG4gIC8vICAgfSwgdGhpcyk7XG5cbiAgLy8gICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgYW5nbGUgYXMgYHJheWAuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUgYW5kIGByYXlgIGlzIGNvbnNpZGVyZWQgYW5cbiAgKiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSkge1xuICAgIC8vIEZpcnN0IGNoZWNrIGludGVyc2VjdGlvblxuICAgIGNvbnN0IGJpc2VjdG9yID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBiaXNlY3Rvci5sZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvbyBjbG9zZSB0byBjZW50ZXIsIGNvc2luZSBjYWxjdWxhdGlvbnMgbWF5IGJlIGluY29ycmVjdFxuICAgIC8vIENhbGN1bGF0ZSBzZWdtZW50IHRocm91Z2ggY2VudGVyXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscygwLCBkaXN0YW5jZSkpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUocmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKjIpO1xuICAgIH1cblxuICAgIC8vIFJheSBpcyB0YW5nZW50LCByZXR1cm4gemVyby1sZW5ndGggc2VnbWVudCBhdCBjb250YWN0IHBvaW50XG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgdGhpcy5yYWRpdXMpKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLnJheS5hbmdsZSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIDApO1xuICAgIH1cblxuICAgIC8vIFJheSBkb2VzIG5vdCB0b3VjaCBhcmNcbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYWNvcyhkaXN0YW5jZS90aGlzLnJhZGl1cyk7XG4gICAgY29uc3QgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIHJhZGlhbnMpO1xuXG4gICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCAhY2VudGVyT3JpZW50YXRpb24pKTtcbiAgICBjb25zdCBlbmQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCBjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIHJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCByZXByZXNlbnRpbmcgdGhlIGVuZCBvZiB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB1c2VQcm9qZWN0aW9uYCBpcyBgdHJ1ZWAgdGhlIG1ldGhvZCB3aWxsIGFsd2F5cyByZXR1cm4gYSBgUG9pbnRgXG4gICogZXZlbiB3aGVuIHRoZXJlIGlzIG5vIGNvbnRhY3QgYmV0d2VlbiB0aGUgYXJjIGFuZCBgcmF5YC4gSW4gdGhpcyBjYXNlXG4gICogdGhlIHBvaW50IGluIHRoZSBhcmMgY2xvc2VzdCB0byBgcmF5YCBpcyByZXR1cm5lZC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5Qb2ludH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRFbmRXaXRoUmF5KHJheSwgdXNlUHJvamVjdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkV2l0aFJheShyYXkpO1xuICAgIGlmIChjaG9yZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNob3JkLmVuZFBvaW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHVzZVByb2plY3Rpb24pIHtcbiAgICAgIGNvbnN0IGNlbnRlck9yaWVudGF0aW9uID0gcmF5LnBvaW50T3JpZW50YXRpb24odGhpcy5jZW50ZXIpO1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCFjZW50ZXJPcmllbnRhdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUocGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyY1xuICAqIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIEJvdGggYXJjcyBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzIGZvciB0aGUgY2FsY3VsYXRpb24gb2YgdGhlXG4gICogaW50ZXJzZWN0aW9uLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIGFyYyBtYXkgbm90IGxheSBpbnNpZGVcbiAgKiBgdGhpc2AuXG4gICpcbiAgKiBBbiBlZGdlIGNhc2Ugb2YgdGhpcyBtZXRob2QgaXMgdGhhdCB3aGVuIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGB0aGlzYFxuICAqIGFuZCBgb3RoZXJBcmNgIGlzIHRoZSBzdW0gb2YgdGhlaXIgcmFkaXVzLCBtZWFuaW5nIHRoZSBhcmNzIHRvdWNoIGF0IGFcbiAgKiBzaW5nbGUgcG9pbnQsIHRoZSByZXN1bHRpbmcgYXJjIG1heSBoYXZlIGEgYW5nbGUtZGlzdGFuY2Ugb2YgemVybyxcbiAgKiB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICovXG4gIGludGVyc2VjdGlvbkFyYyhvdGhlckFyYykge1xuICAgIGNvbnN0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVzVG93YXJkc1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSwgY2hvcmQuZW5kUG9pbnQoKSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBpbnRlcnNlY3Rpb25BcmNOb0NpcmNsZT9cblxuXG4gIC8vIFRPRE86IGZpbmlzaCBib3VuZGVkSW50ZXJzZWN0aW9uQXJjXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AgYW5kIGJvdW5kZWQgYnkgYHRoaXMuc3RhcnRgIGFuZCBgdGhpcy5lbmRgLCBvciBgbnVsbGAgd2hlblxuICAqIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGhhdmUgdGhlIHNhbWUgY2VudGVyLFxuICAqIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIGBvdGhlckFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSwgd2hpbGUgdGhlIHN0YXJ0IGFuZCBlbmQgb2ZcbiAgKiBgdGhpc2AgYXJlIGNvbnNpZGVyZWQgZm9yIHRoZSByZXN1bHRpbmcgYEFyY2AuXG4gICpcbiAgKiBXaGVuIHRoZXJlIGV4aXN0IHR3byBzZXBhcmF0ZSBhcmMgc2VjdGlvbnMgdGhhdCBpbnRlcnNlY3Qgd2l0aFxuICAqIGBvdGhlckFyY2A6IG9ubHkgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIGNsb3Nlc3QgdG8gYHN0YXJ0YCBpcyByZXR1cm5lZC5cbiAgKiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBgdGhpc2Agc3RhcnRzIGluc2lkZSBgb3RoZXJBcmNgLCB0aGVuIGV4aXRzLCBhbmRcbiAgKiB0aGVuIGVuZHMgaW5zaWRlIGBvdGhlckFyY2AsIHJlZ2FyZGxlc3MgaWYgYHRoaXNgIGlzIGEgY29tcGxldGUgY2lyY2xlXG4gICogb3Igbm90LlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGludGVyc2VjdCB3aXRoXG4gICogQHJldHVybnMgez9SYWMuQXJjfVxuICAqXG4gICogQGlnbm9yZVxuICAqL1xuICAvLyBib3VuZGVkSW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgLy8gICBsZXQgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSk7XG4gIC8vICAgbGV0IGNob3JkRW5kQW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuZW5kUG9pbnQoKSk7XG5cbiAgLy8gICAvLyBnZXQgYWxsIGRpc3RhbmNlcyBmcm9tIHRoaXMuc3RhcnRcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkRW5kQW5nbGUsIG9ubHkgc3RhcnQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIHRoaXMuZW5kLCB3aG9sZSBhcmMgaXMgaW5zaWRlIG9yIG91dHNpZGVcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgb25seSBlbmQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICBjb25zdCBpbnRlclN0YXJ0RGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkU3RhcnRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGludGVyRW5kRGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkRW5kQW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gICBjb25zdCBlbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcblxuXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZFN0YXJ0QW5nbGUsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRTdGFydCwgcmV0dXJuIG51bGxcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCBub3QgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkZW5kLCByZXR1cm4gc2VsZlxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCBub3JtYWwgcnVsZXNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzdGFydCB0byBjaG9yZGVuZFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkRW5kXG5cblxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkU3RhcnRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQ7XG4gIC8vICAgfVxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkRW5kQW5nbGUpKSB7XG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlID0gdGhpcy5lbmQ7XG4gIC8vICAgfVxuXG4gIC8vICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gIC8vICAgICBjaG9yZFN0YXJ0QW5nbGUsXG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlLFxuICAvLyAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IGlzIHRhbmdlbnQgdG8gYm90aCBgdGhpc2AgYW5kIGBvdGhlckFyY2AsXG4gICogb3IgYG51bGxgIHdoZW4gbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlLiBUaGUgbmV3IGBTZWdtZW50YCBzdGFydHNcbiAgKiBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoIGB0aGlzYCBhbmQgZW5kcyBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIENvbnNpZGVyaW5nIF9jZW50ZXIgYXhpc18gYSByYXkgZnJvbSBgdGhpcy5jZW50ZXJgIHRvd2FyZHNcbiAgKiBgb3RoZXJBcmMuY2VudGVyYCwgYHN0YXJ0Q2xvY2t3aXNlYCBkZXRlcm1pbmVzIHRoZSBzaWRlIG9mIHRoZSBzdGFydFxuICAqIHBvaW50IG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IGluIHJlbGF0aW9uIHRvIF9jZW50ZXIgYXhpc18sIGFuZFxuICAqIGBlbmRDbG9ja3dpc2VgIHRoZSBzaWRlIG9mIHRoZSBlbmQgcG9pbnQuXG4gICpcbiAgKiBCb3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgc2VnbWVudCB0b3dhcmRzXG4gICogQHBhcmFtIHtCb29sZWFufSBzdGFydENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIHN0YXJ0IHBvaW50IGluIHJlbGF0aW9uIHRvIHRoZSBfY2VudGVyIGF4aXNfXG4gICogQHBhcmFtIHtCb29sZWFufSBlbmRDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBlbmQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICB0YW5nZW50U2VnbWVudChvdGhlckFyYywgc3RhcnRDbG9ja3dpc2UgPSB0cnVlLCBlbmRDbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIeXBvdGhlbnVzZSBvZiB0aGUgdHJpYW5nbGUgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHRhbmdlbnRcbiAgICAvLyBtYWluIGFuZ2xlIGlzIGF0IGB0aGlzLmNlbnRlcmBcbiAgICBjb25zdCBoeXBTZWdtZW50ID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcbiAgICBjb25zdCBvcHMgPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzXG4gICAgICA6IG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzO1xuXG4gICAgLy8gV2hlbiBvcHMgYW5kIGh5cCBhcmUgY2xvc2UsIHNuYXAgdG8gMVxuICAgIGNvbnN0IGFuZ2xlU2luZSA9IHRoaXMucmFjLmVxdWFscyhNYXRoLmFicyhvcHMpLCBoeXBTZWdtZW50Lmxlbmd0aClcbiAgICAgID8gKG9wcyA+IDAgPyAxIDogLTEpXG4gICAgICA6IG9wcyAvIGh5cFNlZ21lbnQubGVuZ3RoO1xuICAgIGlmIChNYXRoLmFicyhhbmdsZVNpbmUpID4gMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVSYWRpYW5zID0gTWF0aC5hc2luKGFuZ2xlU2luZSk7XG4gICAgY29uc3Qgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG5cbiAgICBjb25zdCBhZGpPcmllbnRhdGlvbiA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc3RhcnRDbG9ja3dpc2VcbiAgICAgIDogIXN0YXJ0Q2xvY2t3aXNlO1xuICAgIGNvbnN0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cFNlZ21lbnQucmF5LmFuZ2xlLnNoaWZ0KG9wc0FuZ2xlLCBhZGpPcmllbnRhdGlvbik7XG4gICAgY29uc3Qgc2hpZnRlZEFkakFuZ2xlID0gc2hpZnRlZE9wc0FuZ2xlLnBlcnBlbmRpY3VsYXIoYWRqT3JpZW50YXRpb24pO1xuXG4gICAgY29uc3Qgc3RhcnRBbmdsZSA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc2hpZnRlZEFkakFuZ2xlXG4gICAgICA6IHNoaWZ0ZWRBZGpBbmdsZS5pbnZlcnNlKClcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgIGNvbnN0IGVuZCA9IG90aGVyQXJjLnBvaW50QXRBbmdsZShzaGlmdGVkQWRqQW5nbGUpO1xuICAgIGNvbnN0IGRlZmF1bHRBbmdsZSA9IHN0YXJ0QW5nbGUucGVycGVuZGljdWxhcighc3RhcnRDbG9ja3dpc2UpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYEFyY2Agb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgYXJjcywgYWxsIHdpdGggdGhlIHNhbWVcbiAgKiBbYW5nbGUgZGlzdGFuY2Vde0BsaW5rIFJhYy5BcmMjYW5nbGVEaXN0YW5jZX0uXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGFyY3MgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5BcmNbXX1cbiAgKi9cbiAgZGl2aWRlVG9BcmNzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3QgYXJjcyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiAoaW5kZXgrMSksIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGFyYyA9IG5ldyBBcmModGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cywgc3RhcnQsIGVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgYXJjcy5wdXNoKGFyYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyY3M7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYFNlZ21lbnRgIG9iamVjdHMgcmVwcmVzZW50aW5nIGB0aGlzYFxuICAqIGRpdmlkZWQgaW50byBgY291bnRgIGNob3JkcywgYWxsIHdpdGggdGhlIHNhbWUgbGVuZ3RoLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuIFdoZW4gYGNvdW50YCBpc1xuICAqIGAxYCByZXR1cm5zIGFuIGFyYyBlcXVpdmFsZW50IHRvXG4gICogYFt0aGlzLmNob3JkU2VnbWVudCgpXXtAbGluayBSYWMuQXJjI2Nob3JkU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIHNlZ21lbnRzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudFtdfVxuICAqL1xuICBkaXZpZGVUb1NlZ21lbnRzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZEFuZ2xlID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLnBvaW50QXRBbmdsZShlbmRBbmdsZSk7XG4gICAgICBjb25zdCBzZWdtZW50ID0gc3RhcnRQb2ludC5zZWdtZW50VG9Qb2ludChlbmRQb2ludCk7XG4gICAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50cztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29tcG9zaXRlYCB0aGF0IGNvbnRhaW5zIGBCZXppZXJgIG9iamVjdHMgcmVwcmVzZW50aW5nXG4gICogdGhlIGFyYyBkaXZpZGVkIGludG8gYGNvdW50YCBiZXppZXJzIHRoYXQgYXBwcm94aW1hdGUgdGhlIHNoYXBlIG9mIHRoZVxuICAqIGFyYy5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGBDb21wb3NpdGVgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGJlemllcnMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5Db21wb3NpdGV9XG4gICpcbiAgKiBAc2VlIFtgUmFjLkJlemllcmBde0BsaW5rIFJhYy5CZXppZXJ9XG4gICovXG4gIGRpdmlkZVRvQmV6aWVycyhjb3VudCkge1xuICAgIGlmIChjb3VudCA8PSAwKSB7IHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYywgW10pOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgLy8gbGVuZ3RoIG9mIHRhbmdlbnQ6XG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTczNDc0NS9ob3ctdG8tY3JlYXRlLWNpcmNsZS13aXRoLWIlQzMlQTl6aWVyLWN1cnZlc1xuICAgIGNvbnN0IHBhcnNQZXJUdXJuID0gMSAvIHBhcnRUdXJuO1xuICAgIGNvbnN0IHRhbmdlbnQgPSB0aGlzLnJhZGl1cyAqICg0LzMpICogTWF0aC50YW4oUmFjLlRBVS8ocGFyc1BlclR1cm4qNCkpO1xuXG4gICAgY29uc3QgYmV6aWVycyA9IFtdO1xuICAgIGNvbnN0IHNlZ21lbnRzID0gdGhpcy5kaXZpZGVUb1NlZ21lbnRzKGNvdW50KTtcbiAgICBzZWdtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3Qgc3RhcnRBcmNSYWRpdXMgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtLnN0YXJ0UG9pbnQoKSk7XG4gICAgICBjb25zdCBlbmRBcmNSYWRpdXMgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtLmVuZFBvaW50KCkpO1xuXG4gICAgICBsZXQgc3RhcnRBbmNob3IgPSBzdGFydEFyY1JhZGl1c1xuICAgICAgICAubmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UodGhpcy5yYWMuQW5nbGUuc3F1YXJlLCAhdGhpcy5jbG9ja3dpc2UsIHRhbmdlbnQpXG4gICAgICAgIC5lbmRQb2ludCgpO1xuICAgICAgbGV0IGVuZEFuY2hvciA9IGVuZEFyY1JhZGl1c1xuICAgICAgICAubmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UodGhpcy5yYWMuQW5nbGUuc3F1YXJlLCB0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAgIGNvbnN0IG5ld0JlemllciA9IG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICBzdGFydEFyY1JhZGl1cy5lbmRQb2ludCgpLCBzdGFydEFuY2hvcixcbiAgICAgICAgZW5kQW5jaG9yLCBlbmRBcmNSYWRpdXMuZW5kUG9pbnQoKSlcblxuICAgICAgYmV6aWVycy5wdXNoKG5ld0Jlemllcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5Db21wb3NpdGUodGhpcy5yYWMsIGJlemllcnMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBsb2NhdGVkIGFuZCBvcmllbnRlZCB0b3dhcmRzIGBzdGFydFRhbmdlbnRSYXkoKWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmQgYGZvcm1hdGAuXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIG9tbWl0ZWQgb3IgYG51bGxgLCB0aGUgZm9ybWF0IHVzZWQgZm9yIHRoZSByZXN1bHRpbmdcbiAgKiBgVGV4dGAgd2lsbCBiZTpcbiAgKiArIFtgcmFjLlRleHQuRm9ybWF0LmJvdHRvbUxlZnRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCNib3R0b21MZWZ0fVxuICAqIGZvcm1hdCBmb3IgYXJjcyB3aXRoIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uIHNldCB0byBgdHJ1ZWBcbiAgKiArIFtgcmFjLlRleHQuRm9ybWF0LnRvcExlZnRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fVxuICAqIGZvcm1hdCBmb3IgYXJjcyB3aXRoIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uIHNldCB0byBgZmFsc2VgXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIHByb3ZpZGVkLCB0aGUgYW5nbGUgZm9yIHRoZSByZXN1bHRpbmcgYFRleHRgIHdpbGxcbiAgKiBzdGlsbCBiZSBzZXQgdG8gYHN0YXJ0VGFuZ2VudFJheSgpLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGA7IHdoZW4gb21taXRlZCBvciBgbnVsbGAsIGEgZGVmYXVsdFxuICAqICAgZm9ybWF0IGlzIHVzZWQgaW5zdGVhZFxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgdGV4dChzdHJpbmcsIGZvcm1hdCA9IG51bGwpIHtcbiAgICBpZiAoZm9ybWF0ID09PSBudWxsKSB7XG4gICAgICBmb3JtYXQgPSB0aGlzLmNsb2Nrd2lzZVxuICAgICAgICA/IHRoaXMucmFjLlRleHQuRm9ybWF0LmJvdHRvbUxlZnRcbiAgICAgICAgOiB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGFydFRhbmdlbnRSYXkoKS50ZXh0KHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIEFyY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQXJjO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQmV6aWVyIGN1cnZlIHdpdGggc3RhcnQsIGVuZCwgYW5kIHR3byBhbmNob3IgW3BvaW50c117QGxpbmsgUmFjLlBvaW50fS5cbiogQGFsaWFzIFJhYy5CZXppZXJcbiovXG5jbGFzcyBCZXppZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcblxuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLnN0YXJ0QW5jaG9yID0gc3RhcnRBbmNob3I7XG4gICAgdGhpcy5lbmRBbmNob3IgPSBlbmRBbmNob3I7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3Qgc3RhcnRYU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueCwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydFlTdHIgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC55LCAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLngsIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRBbmNob3JZU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnRBbmNob3IueSwgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JYU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueCwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZEFuY2hvcllTdHIgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZEFuY2hvci55LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWFN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLngsICAgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRZU3RyICAgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQueSwgICAgICAgICBkaWdpdHMpO1xuXG4gICAgcmV0dXJuIGBCZXppZXIoczooJHtzdGFydFhTdHJ9LCR7c3RhcnRZU3RyfSkgc2E6KCR7c3RhcnRBbmNob3JYU3RyfSwke3N0YXJ0QW5jaG9yWVN0cn0pIGVhOigke2VuZEFuY2hvclhTdHJ9LCR7ZW5kQW5jaG9yWVN0cn0pIGU6KCR7ZW5kWFN0cn0sJHtlbmRZU3RyfSkpYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBhbGwgbWVtYmVycywgZXhjZXB0IGByYWNgLCBvZiBib3RoIGJlemllcnMgYXJlXG4gICogW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9OyBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJCZXppZXJgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQmV6aWVyYCwgcmV0dXJuc1xuICAqIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5CZXppZXJ9IG90aGVyQmV6aWVyIC0gQSBgQmV6aWVyYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyQmV6aWVyKSB7XG4gICAgcmV0dXJuIG90aGVyQmV6aWVyIGluc3RhbmNlb2YgQmV6aWVyXG4gICAgICAmJiB0aGlzLnN0YXJ0ICAgICAgLmVxdWFscyhvdGhlckJlemllci5zdGFydClcbiAgICAgICYmIHRoaXMuc3RhcnRBbmNob3IuZXF1YWxzKG90aGVyQmV6aWVyLnN0YXJ0QW5jaG9yKVxuICAgICAgJiYgdGhpcy5lbmRBbmNob3IgIC5lcXVhbHMob3RoZXJCZXppZXIuZW5kQW5jaG9yKVxuICAgICAgJiYgdGhpcy5lbmQgICAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuZW5kKTtcbiAgfVxuXG59IC8vIGNsYXNzIEJlemllclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmV6aWVyO1xuXG5cbkJlemllci5wcm90b3R5cGUuZHJhd0FuY2hvcnMgPSBmdW5jdGlvbihzdHlsZSA9IHVuZGVmaW5lZCkge1xuICBwdXNoKCk7XG4gIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuYXBwbHkoKTtcbiAgfVxuICB0aGlzLnN0YXJ0LnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnRBbmNob3IpLmRyYXcoKTtcbiAgdGhpcy5lbmQuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRBbmNob3IpLmRyYXcoKTtcbiAgcG9wKCk7XG59O1xuXG5CZXppZXIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5lbmQsIHRoaXMuZW5kQW5jaG9yLFxuICAgIHRoaXMuc3RhcnRBbmNob3IsIHRoaXMuc3RhcnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBhIHNlcXVlbmNlIG9mIGRyYXdhYmxlIG9iamVjdHMgdGhhdCBjYW4gYmUgZHJhd24gdG9nZXRoZXIuXG4qXG4qIFVzZWQgYnkgYFtQNURyYXdlcl17QGxpbmsgUmFjLlA1RHJhd2VyfWAgdG8gcGVyZm9ybSBzcGVjaWZpYyB2ZXJ0ZXhcbiogb3BlcmF0aW9ucyB3aXRoIGRyYXdhYmxlcyB0byBkcmF3IGNvbXBsZXggc2hhcGVzLlxuKlxuKiBAYWxpYXMgUmFjLkNvbXBvc2l0ZVxuKi9cbmNsYXNzIENvbXBvc2l0ZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29tcG9zaXRlYCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjXG4gICogICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge0FycmF5fSBbc2VxdWVuY2VdXG4gICogICBBbiBhcnJheSBvZiBkcmF3YWJsZSBvYmplY3RzIHRvIGNvbnRhaW5cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzZXF1ZW5jZSA9IFtdKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc2VxdWVuY2UpO1xuXG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5zZXF1ZW5jZSA9IHNlcXVlbmNlO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29tcG9zaXRlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGU7XG5cblxuQ29tcG9zaXRlLnByb3RvdHlwZS5pc05vdEVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNlcXVlbmNlLmxlbmd0aCAhPSAwO1xufTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBlbGVtZW50LmZvckVhY2goaXRlbSA9PiB0aGlzLnNlcXVlbmNlLnB1c2goaXRlbSkpO1xuICAgIHJldHVyblxuICB9XG4gIHRoaXMuc2VxdWVuY2UucHVzaChlbGVtZW50KTtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICBsZXQgcmV2ZXJzZWQgPSB0aGlzLnNlcXVlbmNlLm1hcChpdGVtID0+IGl0ZW0ucmV2ZXJzZSgpKVxuICAgIC5yZXZlcnNlKCk7XG4gIHJldHVybiBuZXcgQ29tcG9zaXRlKHRoaXMucmFjLCByZXZlcnNlZCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogUG9pbnQgaW4gYSB0d28gZGltZW50aW9uYWwgY29vcmRpbmF0ZSBzeXN0ZW0uXG4qXG4qIFNldmVyYWwgbWV0aG9kcyByZXR1cm4gYW4gYWRqdXN0ZWQgdmFsdWUgb3IgcGVyZm9ybSBhZGp1c3RtZW50cyBpbiB0aGVpclxuKiBvcGVyYXRpb24gd2hlbiB0d28gcG9pbnRzIGFyZSBjbG9zZSBlbm91Z2ggYXMgdG8gYmUgY29uc2lkZXJlZCBlcXVhbC5cbiogV2hlbiB0aGUgdGhlIGRpZmZlcmVuY2Ugb2YgZWFjaCBjb29yZGluYXRlIG9mIHR3byBwb2ludHMgaXMgdW5kZXIgdGhlXG4qIFtgZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9IHRoZSBwb2ludHMgYXJlXG4qIGNvbnNpZGVyZWQgZXF1YWwuIFRoZSBbYGVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IG1ldGhvZCBwZXJmb3Jtc1xuKiB0aGlzIGNoZWNrLlxuKlxuKiAjIyMgYGluc3RhbmNlLlBvaW50YFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlBvaW50YCBmdW5jdGlvbl17QGxpbmsgUmFjI1BvaW50fSB0byBjcmVhdGUgYFBvaW50YCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5Qb2ludC5vcmlnaW5gXXtAbGluayBpbnN0YW5jZS5Qb2ludCNvcmlnaW59LCBsaXN0ZWQgdW5kZXJcbiogW2BpbnN0YW5jZS5Qb2ludGBde0BsaW5rIGluc3RhbmNlLlBvaW50fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHJhYywgNTUsIDc3KVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJQb2ludCA9IHJhYy5Qb2ludCg1NSwgNzcpXG4qXG4qIEBzZWUgW2ByYWMuUG9pbnRgXXtAbGluayBSYWMjUG9pbnR9XG4qIEBzZWUgW2BpbnN0YW5jZS5Qb2ludGBde0BsaW5rIGluc3RhbmNlLlBvaW50fVxuKlxuKiBAYWxpYXMgUmFjLlBvaW50XG4qL1xuY2xhc3MgUG9pbnR7XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBQb2ludGAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhY1xuICAqICAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgKiAgIFRoZSB4IGNvb3JkaW5hdGVcbiAgKiBAcGFyYW0ge051bWJlcn0geVxuICAqICAgVGhlIHkgY29vcmRpbmF0ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHgsIHkpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB4LCB5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIoeCwgeSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogWCBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnggPSB4O1xuXG4gICAgLyoqXG4gICAgKiBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMueSA9IHk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuUG9pbnQoNTUsIDc3KS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ1BvaW50KDU1LDc3KSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgUG9pbnQoJHt4U3RyfSwke3lTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJQb2ludGAgZm9yIGVhY2hcbiAgKiBjb29yZGluYXRlIGlzIHVuZGVyIFtgcmFjLmVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfTtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJQb2ludGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5Qb2ludGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFZhbHVlcyBhcmUgY29tcGFyZWQgdXNpbmcgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc30uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gb3RoZXJQb2ludCAtIEEgYFBvaW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJQb2ludCkge1xuICAgIHJldHVybiBvdGhlclBvaW50IGluc3RhbmNlb2YgUG9pbnRcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLngsIG90aGVyUG9pbnQueClcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnksIG90aGVyUG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIG5ld1gsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdZIC0gVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCwgbmV3WSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBhZGRlZCB0byBgdGhpcy54YC5cbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWCh4KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHgsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB5YCBhZGRlZCB0byBgdGhpcy55YC5cbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWSh5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBhZGRpbmcgdGhlIGNvbXBvbmVudHMgb2YgYHBvaW50YCB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgcG9pbnQueCxcbiAgICAgIHRoaXMueSArIHBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzIHRvIGB0aGlzYC5cbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGQoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3RQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHBvaW50LngsXG4gICAgICB0aGlzLnkgLSBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzLlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdWJ0cmFjdCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54IC0geCxcbiAgICAgIHRoaXMueSAtIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCB0aGUgbmVnYXRpdmUgY29vcmRpbmF0ZSB2YWx1ZXMgb2YgYHRoaXNgLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIG5lZ2F0aXZlKCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIC10aGlzLngsIC10aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiByZXR1cm5zIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKiBAc2VlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgZGlzdGFuY2VUb1BvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHggPSBNYXRoLnBvdygocG9pbnQueCAtIHRoaXMueCksIDIpO1xuICAgIGNvbnN0IHkgPSBNYXRoLnBvdygocG9pbnQueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gcmV0dXJuIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBbYGVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGlmICh0aGlzLmVxdWFscyhwb2ludCkpIHtcbiAgICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oZGVmYXVsdEFuZ2xlKTtcbiAgICAgIHJldHVybiBkZWZhdWx0QW5nbGU7XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHBvaW50LnN1YnRyYWN0UG9pbnQodGhpcyk7XG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYXRhbjIob2Zmc2V0LnksIG9mZnNldC54KTtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IGEgYGRpc3RhbmNlYCBmcm9tIGB0aGlzYCBpbiB0aGUgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FycyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgZGlzdGFuY2VYID0gZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZS5yYWRpYW5zKCkpO1xuICAgIGNvbnN0IGRpc3RhbmNlWSA9IGRpc3RhbmNlICogTWF0aC5zaW4oYW5nbGUucmFkaWFucygpKTtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLnggKyBkaXN0YW5jZVgsIHRoaXMueSArIGRpc3RhbmNlWSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBtaWRkbGUgYmV0d2VlbiBgdGhpc2AgYW5kIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGNhbGN1bGF0ZSBhIGJpc2VjdG9yIHRvXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEJpc2VjdG9yKHBvaW50KSB7XG4gICAgY29uc3QgeE9mZnNldCA9IChwb2ludC54IC0gdGhpcy54KSAvIDI7XG4gICAgY29uc3QgeU9mZnNldCA9IChwb2ludC55IC0gdGhpcy55KSAvIDI7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgeE9mZnNldCwgdGhpcy55ICsgeU9mZnNldCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYEFuZ2xlYCBvZiB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheShhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiB0aGUgcmVzdWx0aW5nIGBSYXlgIHVzZXMgdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9XG4gICogICBbZGVmYXVsdEFuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBBbiBgQW5nbGVgIHRvIHVzZSB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgcmF5VG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMuYW5nbGVUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgZGVmYXVsdEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzYCB0byB0aGUgcHJvamVjdGlvbiBvZiBgdGhpc2AgaW4gYHJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgYW5kIGB0aGlzYCBhcmVcbiAgKiBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gdGhlIHJlc3VsdGluZyBgUmF5YCBkZWZhdWx0c1xuICAqIHRvIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnJheVRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IGB0aGlzYCBhbmQgaXMgdGFuZ2VudCB0byBgYXJjYCwgd2hlblxuICAqIG5vIHRhbmdlbnQgaXMgcG9zc2libGUgcmV0dXJucyBgbnVsbGAuXG4gICpcbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBUaGUgcmVzdWx0aW5nIGBSYXlgIGlzIGluIHRoZSBgY2xvY2t3aXNlYCBzaWRlIG9mIHRoZSByYXkgZm9ybWVkXG4gICogZnJvbSBgdGhpc2AgdG93YXJkcyBgYXJjLmNlbnRlcmAuIGBhcmNgIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZVxuICAqIGNpcmNsZS5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGlzIGluc2lkZSBgYXJjYCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gdGFuZ2VudCBzZWdtZW50IGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBBIHNwZWNpYWwgY2FzZSBpcyBjb25zaWRlcmVkIHdoZW4gYGFyYy5yYWRpdXNgIGlzIGNvbnNpZGVyZWQgdG8gYmUgYDBgXG4gICogYW5kIGB0aGlzYCBpcyBlcXVhbCB0byBgYXJjLmNlbnRlcmAuIEluIHRoaXMgY2FzZSB0aGUgYW5nbGUgYmV0d2VlblxuICAqIGB0aGlzYCBhbmQgYGFyYy5jZW50ZXJgIGlzIGFzc3VtZWQgdG8gYmUgdGhlIGludmVyc2Ugb2YgYGFyYy5zdGFydGAsXG4gICogdGh1cyB0aGUgcmVzdWx0aW5nIGBSYXlgIGRlZmF1bHRzIHRvIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJuIHs/UmFjLlJheX1cbiAgKi9cbiAgcmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIC8vIEEgZGVmYXVsdCBhbmdsZSBpcyBnaXZlbiBmb3IgdGhlIGVkZ2UgY2FzZSBvZiBhIHplcm8tcmFkaXVzIGFyY1xuICAgIGxldCBoeXBvdGVudXNlID0gdGhpcy5zZWdtZW50VG9Qb2ludChhcmMuY2VudGVyLCBhcmMuc3RhcnQuaW52ZXJzZSgpKTtcbiAgICBsZXQgb3BzID0gYXJjLnJhZGl1cztcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIGFyYy5yYWRpdXMpKSB7XG4gICAgICAvLyBQb2ludCBpbiBhcmNcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSBoeXBvdGVudXNlLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIHBlcnBlbmRpY3VsYXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIDApKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVTaW5lID0gb3BzIC8gaHlwb3RlbnVzZS5sZW5ndGg7XG4gICAgaWYgKGFuZ2xlU2luZSA+IDEpIHtcbiAgICAgIC8vIFBvaW50IGluc2lkZSBhcmNcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBsZXQgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG4gICAgbGV0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cG90ZW51c2UuYW5nbGUoKS5zaGlmdChvcHNBbmdsZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgc2hpZnRlZE9wc0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgIHdpdGggdGhlIGdpdmVuXG4gICogYGxlbmd0aGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBwb2ludCB0aGUgc2VnbWVudFxuICAqIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzIHRvIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoXG4gICogYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBTZWdtZW50YCB0b3dhcmRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfVxuICAqICAgW2RlZmF1bHRBbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgQW4gYEFuZ2xlYCB0byB1c2Ugd2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGVxdWFsXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2BlcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBzZWdtZW50VG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMuYW5nbGVUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgZGVmYXVsdEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGB0aGlzYCBpblxuICAqIGByYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGlzIGVxdWFsIHRvIGB0aGlzYCwgdGhlIHJlc3VsdGluZyBgU2VnbWVudGBcbiAgKiBkZWZhdWx0cyB0byBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvIGByYXlgIGluIHRoZSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIHByb2plY3QgYHRoaXNgIG9udG9cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KHByb2plY3RlZCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLFxuICAqIHdoZW4gbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGlzIGluIHRoZSBgY2xvY2t3aXNlYCBzaWRlIG9mIHRoZSByYXkgZm9ybWVkXG4gICogZnJvbSBgdGhpc2AgdG93YXJkcyBgYXJjLmNlbnRlcmAsIGFuZCBlbmRzIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGhcbiAgKiBgYXJjYCB3aGljaCBpcyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyB0YW5nZW50IHNlZ21lbnQgaXNcbiAgKiBwb3NzaWJsZS5cbiAgKlxuICAqIEEgc3BlY2lhbCBjYXNlIGlzIGNvbnNpZGVyZWQgd2hlbiBgYXJjLnJhZGl1c2AgaXMgY29uc2lkZXJlZCB0byBiZSBgMGBcbiAgKiBhbmQgYHRoaXNgIGlzIGVxdWFsIHRvIGBhcmMuY2VudGVyYC4gSW4gdGhpcyBjYXNlIHRoZSBhbmdsZSBiZXR3ZWVuXG4gICogYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAgaXMgYXNzdW1lZCB0byBiZSB0aGUgaW52ZXJzZSBvZiBgYXJjLnN0YXJ0YCxcbiAgKiB0aHVzIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzIHRvIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybiB7P1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHRhbmdlbnRSYXkgPSB0aGlzLnJheVRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSk7XG4gICAgaWYgKHRhbmdlbnRSYXkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRhbmdlbnRQZXJwID0gdGFuZ2VudFJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgcmFkaXVzUmF5ID0gYXJjLmNlbnRlci5yYXkodGFuZ2VudFBlcnApO1xuXG4gICAgcmV0dXJuIHRhbmdlbnRSYXkuc2VnbWVudFRvSW50ZXJzZWN0aW9uKHJhZGl1c1JheSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXNgIGFuZCB0aGUgZ2l2ZW4gYXJjIHByb3BlcnRpZXMuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfVxuICAqICAgW3N0YXJ0PVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgc3RhcnQgYEFuZ2xlYCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBbZW5kPW51bGxdIC0gVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBuZXdcbiAgKiAgIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgc3RhcnRgIGlzIHVzZWQgaW5zdGVhZFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhcbiAgICByYWRpdXMsXG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLFxuICAgIGVuZCA9IG51bGwsXG4gICAgY2xvY2t3aXNlID0gdHJ1ZSlcbiAge1xuICAgIHN0YXJ0ID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzdGFydCk7XG4gICAgZW5kID0gZW5kID09PSBudWxsXG4gICAgICA/IHN0YXJ0XG4gICAgICA6IHRoaXMucmFjLkFuZ2xlLmZyb20oZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsIHRoaXMsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgdGhpc2Agd2l0aCB0aGUgZ2l2ZW4gYHN0cmluZ2AgYW5kXG4gICogYGZvcm1hdGAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyBvZiB0aGUgbmV3IGBUZXh0YFxuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBbZm9ybWF0PVtyYWMuVGV4dC5Gb3JtYXQudG9wTGVmdF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjdG9wTGVmdH1dXG4gICogICBUaGUgZm9ybWF0IG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB0ZXh0KHN0cmluZywgZm9ybWF0ID0gdGhpcy5yYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCkge1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcy5yYWMsIHRoaXMsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIFBvaW50XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFVuYm91bmRlZCByYXkgZnJvbSBhIGBbUG9pbnRde0BsaW5rIFJhYy5Qb2ludH1gIGluIGRpcmVjdGlvbiBvZiBhblxuKiBgW0FuZ2xlXXtAbGluayBSYWMuQW5nbGV9YC5cbipcbiogIyMjIGBpbnN0YW5jZS5SYXlgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuUmF5YCBmdW5jdGlvbl17QGxpbmsgUmFjI1JheX0gdG8gY3JlYXRlIGBSYXlgIG9iamVjdHMgZnJvbVxuKiBwcmltaXRpdmUgdmFsdWVzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlJheS54QXhpc2Bde0BsaW5rIGluc3RhbmNlLlJheSN4QXhpc30sIGxpc3RlZCB1bmRlclxuKiBbYGluc3RhbmNlLlJheWBde0BsaW5rIGluc3RhbmNlLlJheX0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IHBvaW50ID0gcmFjLlBvaW50KDU1LCA3NylcbiogbGV0IGFuZ2xlID0gcmFjLkFuZ2xlKDEvNClcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IHJheSA9IG5ldyBSYWMuUmF5KHJhYywgcG9pbnQsIGFuZ2xlKVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJSYXkgPSByYWMuUmF5KDU1LCA3NywgMS80KVxuKlxuKiBAc2VlIFtgcmFjLlJheWBde0BsaW5rIFJhYyNSYXl9XG4qIEBzZWUgW2BpbnN0YW5jZS5SYXlgXXtAbGluayBpbnN0YW5jZS5SYXl9XG4qXG4qIEBhbGlhcyBSYWMuUmF5XG4qL1xuY2xhc3MgUmF5IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBSYXlgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0IC0gQSBgUG9pbnRgIHdoZXJlIHRoZSByYXkgc3RhcnRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0aGUgcmF5IGlzIGRpcmVjdGVkIHRvXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgc3RhcnQsIGFuZ2xlKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc3RhcnQsIGFuZ2xlKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBhbmdsZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIHN0YXJ0IHBvaW50IG9mIHRoZSByYXkuXG4gICAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAgICovXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgcmF5IGV4dGVuZHMuXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICovXG4gICAgdGhpcy5hbmdsZSA9IGFuZ2xlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLlJheSg1NSwgNzcsIDAuMikudG9TdHJpbmcoKVxuICAqIC8vIHJldHVybnM6ICdSYXkoKDU1LDc3KSBhOjAuMiknXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueSwgZGlnaXRzKTtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuYW5nbGUudHVybiwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFJheSgoJHt4U3RyfSwke3lTdHJ9KSBhOiR7dHVyblN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBgc3RhcnRgIGFuZCBgYW5nbGVgIGluIGJvdGggcmF5cyBhcmUgZXF1YWw7XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyUmF5YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlJheWAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyUmF5KSB7XG4gICAgcmV0dXJuIG90aGVyUmF5IGluc3RhbmNlb2YgUmF5XG4gICAgICAmJiB0aGlzLnN0YXJ0LmVxdWFscyhvdGhlclJheS5zdGFydClcbiAgICAgICYmIHRoaXMuYW5nbGUuZXF1YWxzKG90aGVyUmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgc2xvcGUgb2YgdGhlIHJheSwgb3IgYG51bGxgIGlmIHRoZSByYXkgaXMgdmVydGljYWwuXG4gICpcbiAgKiBJbiB0aGUgbGluZSBmb3JtdWxhIGB5ID0gbXggKyBiYCB0aGUgc2xvcGUgaXMgYG1gLlxuICAqXG4gICogQHJldHVybnMgez9OdW1iZXJ9XG4gICovXG4gIHNsb3BlKCkge1xuICAgIGxldCBpc1ZlcnRpY2FsID1cbiAgICAgICAgIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hbmdsZS50dXJuLCB0aGlzLnJhYy5BbmdsZS5kb3duLnR1cm4pXG4gICAgICB8fCB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUudXAudHVybik7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHktaW50ZXJjZXB0OiB0aGUgcG9pbnQgYXQgd2hpY2ggdGhlIHJheSwgZXh0ZW5kZWQgaW4gYm90aFxuICAqIGRpcmVjdGlvbnMsIGludGVyY2VwdHMgd2l0aCB0aGUgeS1heGlzOyBvciBgbnVsbGAgaWYgdGhlIHJheSBpc1xuICAqIHZlcnRpY2FsLlxuICAqXG4gICogSW4gdGhlIGxpbmUgZm9ybXVsYSBgeSA9IG14ICsgYmAgdGhlIHktaW50ZXJjZXB0IGlzIGBiYC5cbiAgKlxuICAqIEByZXR1cm5zIHs/TnVtYmVyfVxuICAqL1xuICB5SW50ZXJjZXB0KCkge1xuICAgIGxldCBzbG9wZSA9IHRoaXMuc2xvcGUoKTtcbiAgICBpZiAoc2xvcGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgLy8geSAtIG14ID0gYlxuICAgIHJldHVybiB0aGlzLnN0YXJ0LnkgLSBzbG9wZSAqIHRoaXMuc3RhcnQueDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld1N0YXJ0IC0gVGhlIHN0YXJ0IGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhTdGFydChuZXdTdGFydCkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnQueGAgc2V0IHRvIGBuZXdYYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3WCAtIFRoZSB4IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LndpdGhYKG5ld1gpLCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydC55YCBzZXQgdG8gYG5ld1lgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdZIC0gVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoWShuZXdZKSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQud2l0aFkobmV3WSksIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGFuZ2xlYCBzZXQgdG8gYG5ld0FuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBpbmNyZW1lbnRgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGluY3JlbWVudCAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlQWRkKGluY3JlbWVudCkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuYW5nbGUuYWRkKGluY3JlbWVudCk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkc1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2UgYW5nbGUuaW52ZXJzZSgpfWAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgaW52ZXJzZUFuZ2xlID0gdGhpcy5hbmdsZS5pbnZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIGludmVyc2VBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYGFuZ2xlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBhbG9uZyB0aGUgcmF5IGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW5cbiAgKiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGJ5IHRoZSBnaXZlbiBkaXN0YW5jZSB0b3dhcmQgdGhlXG4gICogYGFuZ2xlLnBlcnBlbmRpY3VsYXIoKWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVRvQW5nbGUocGVycGVuZGljdWxhciwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCByZXR1cm5zIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHggY29vcmRpbmF0ZSBpcyBgeGAuXG4gICogV2hlbiB0aGUgcmF5IGlzIHZlcnRpY2FsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB4XG4gICogY29vcmRpbmF0ZSBhdCBgeGAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYSB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFgoeCkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWCh4KTtcbiAgICB9XG5cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgY29uc3QgeSA9IHNsb3BlICogeCArIHRoaXMueUludGVyY2VwdCgpO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeSBjb29yZGluYXRlIGlzIGB5YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgaG9yaXpvbnRhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeVxuICAqIGNvb3JkaW5hdGUgYXQgYHlgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WSh5KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhZKHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIG14ICsgYiA9IHlcbiAgICAvLyB4ID0gKHkgLSBiKS9tXG4gICAgY29uc3QgeCA9ICh5IC0gdGhpcy55SW50ZXJjZXB0KCkpIC8gc2xvcGU7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHJheSBhdCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCBmcm9tXG4gICogYHRoaXMuc3RhcnRgLiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkXG4gICogaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBCb3RoIHJheXMgYXJlIGNvbnNpZGVyZWQgdW5ib3VuZGVkIGxpbmVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBhID0gdGhpcy5zbG9wZSgpO1xuICAgIGNvbnN0IGIgPSBvdGhlclJheS5zbG9wZSgpO1xuICAgIC8vIFBhcmFsbGVsIGxpbmVzLCBubyBpbnRlcnNlY3Rpb25cbiAgICBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoYSwgYikpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIC8vIEFueSB2ZXJ0aWNhbCByYXlcbiAgICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gb3RoZXJSYXkucG9pbnRBdFgodGhpcy5zdGFydC54KTsgfVxuICAgIGlmIChiID09PSBudWxsKSB7IHJldHVybiB0aGlzLnBvaW50QXRYKG90aGVyUmF5LnN0YXJ0LngpOyB9XG5cbiAgICBjb25zdCBjID0gdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgY29uc3QgZCA9IG90aGVyUmF5LnlJbnRlcmNlcHQoKTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpbmUlRTIlODAlOTNsaW5lX2ludGVyc2VjdGlvblxuICAgIGNvbnN0IHggPSAoZCAtIGMpIC8gKGEgLSBiKTtcbiAgICBjb25zdCB5ID0gYSAqIHggKyBjO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgb250byB0aGUgcmF5LiBUaGVcbiAgKiBwcm9qZWN0ZWQgcG9pbnQgaXMgdGhlIGNsb3Nlc3QgcG9zc2libGUgcG9pbnQgdG8gYHBvaW50YC5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IG9udG8gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50UHJvamVjdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gcG9pbnQucmF5KHBlcnBlbmRpY3VsYXIpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbih0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG8gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YFxuICAqIG9udG8gdGhlIHJheS5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgZGlzdGFuY2UgaXMgcG9zaXRpdmUgd2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGlzIHRvd2FyZHNcbiAgKiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYXksIGFuZCBuZWdhdGl2ZSB3aGVuIGl0IGlzIGJlaGluZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IGFuZCBtZWFzdXJlIHRoZVxuICAqIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgZGlzdGFuY2VUb1Byb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgcHJvamVjdGVkID0gdGhpcy5wb2ludFByb2plY3Rpb24ocG9pbnQpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZVRvUG9pbnQocHJvamVjdGVkKTtcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoZGlzdGFuY2UsIDApKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVRvUHJvamVjdGVkID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocHJvamVjdGVkKTtcbiAgICBjb25zdCBhbmdsZURpZmYgPSB0aGlzLmFuZ2xlLnN1YnRyYWN0KGFuZ2xlVG9Qcm9qZWN0ZWQpO1xuICAgIGlmIChhbmdsZURpZmYudHVybiA8PSAxLzQgfHwgYW5nbGVEaWZmLnR1cm4gPiAzLzQpIHtcbiAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC1kaXN0YW5jZTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGFuZ2xlIHRvIHRoZSBnaXZlbiBgcG9pbnRgIGlzIGxvY2F0ZWQgY2xvY2t3aXNlXG4gICogb2YgdGhlIHJheSBvciBgZmFsc2VgIHdoZW4gbG9jYXRlZCBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgKlxuICAqICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IG9yIGBwb2ludGAgbGFuZHMgb24gdGhlIHJheSwgaXQgaXNcbiAgKiBjb25zaWRlcmVkIGNsb2Nrd2lzZS4gV2hlbiBgcG9pbnRgIGxhbmRzIG9uIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuUmF5I2ludmVyc2V9IG9mIHRoZSByYXksIGl0IGlzIGNvbnNpZGVyZWRcbiAgKiBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBvcmllbnRhdGlvbiB0b1xuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuUmF5I2ludmVyc2VcbiAgKi9cbiAgcG9pbnRPcmllbnRhdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBvaW50QW5nbGUgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gICAgaWYgKHRoaXMuYW5nbGUuZXF1YWxzKHBvaW50QW5nbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcG9pbnRBbmdsZS5zdWJ0cmFjdCh0aGlzLmFuZ2xlKTtcbiAgICAvLyBbMCB0byAwLjUpIGlzIGNvbnNpZGVyZWQgY2xvY2t3aXNlXG4gICAgLy8gWzAuNSwgMSkgaXMgY29uc2lkZXJlZCBjb3VudGVyLWNsb2Nrd2lzZVxuICAgIHJldHVybiBhbmdsZURpc3RhbmNlLnR1cm4gPCAwLjU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpcy5zdGFydGAgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgUmF5YCB3aWxsIHVzZSBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgcmF5VG9Qb2ludChwb2ludCkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB1c2luZyBgdGhpc2AgYW5kIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgdGhpcy5zdGFydGAgYW5kIGVuZGluZyBhdCB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZCBgb3RoZXJSYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcmF5cyBhcmUgcGFyYWxsZWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIGludGVyc2VjdGlvbiBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEJvdGggcmF5cyBhcmUgY29uc2lkZXJlZCB1bmJvdW5kZWQgbGluZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9JbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgIGlmIChpbnRlcnNlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZWdtZW50VG9Qb2ludChpbnRlcnNlY3Rpb24pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgXG4gICogYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8TnVtYmVyfSBbZW5kQW5nbGU9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgdGhpcy5hbmdsZWAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKHJhZGl1cywgZW5kQW5nbGUgPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgZW5kQW5nbGUgPSBlbmRBbmdsZSA9PT0gbnVsbFxuICAgICAgPyB0aGlzLmFuZ2xlXG4gICAgICA6IHRoaXMucmFjLkFuZ2xlLmZyb20oZW5kQW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuc3RhcnQsIHJhZGl1cyxcbiAgICAgIHRoaXMuYW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBhdCBgdGhpcy5zdGFydGAsIHN0YXJ0IGF0IGB0aGlzLmFuZ2xlYCxcbiAgKiBhbmQgZW5kIGF0IHRoZSBnaXZlbiBgYW5nbGVEaXN0YW5jZWAgZnJvbSBgdGhpcy5zdGFydGAgaW4gdGhlXG4gICogYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGZyb21cbiAgKiBgdGhpcy5zdGFydGAgdG8gdGhlIG5ldyBgQXJjYCBlbmRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmNUb0FuZ2xlRGlzdGFuY2UocmFkaXVzLCBhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IGVuZEFuZ2xlID0gdGhpcy5hbmdsZS5zaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuc3RhcnQsIHJhZGl1cyxcbiAgICAgIHRoaXMuYW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogTGVhdmluZyB1bmRvY3VtZW50ZWQgZm9yIG5vdywgdW50aWwgYmV0dGVyIHVzZS9leHBsYW5hdGlvbiBpcyBmb3VuZFxuICAvLyBiYXNlZCBvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGJlemllckFyYyhvdGhlclJheSkge1xuICAgIGlmICh0aGlzLnN0YXJ0LmVxdWFscyhvdGhlclJheS5zdGFydCkpIHtcbiAgICAgIC8vIFdoZW4gYm90aCByYXlzIGhhdmUgdGhlIHNhbWUgc3RhcnQsIHJldHVybnMgYSBwb2ludCBiZXppZXIuXG4gICAgICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQsXG4gICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIGxldCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBlcnBlbmRpY3VsYXIoKVxuICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkucGVycGVuZGljdWxhcigpKTtcblxuICAgIGxldCBvcmllbnRhdGlvbiA9IG51bGw7XG4gICAgbGV0IHJhZGl1c0EgPSBudWxsO1xuICAgIGxldCByYWRpdXNCID0gbnVsbDtcblxuICAgIC8vIENoZWNrIGZvciBwYXJhbGxlbCByYXlzXG4gICAgaWYgKGludGVyc2VjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgLy8gTm9ybWFsIGludGVyc2VjdGlvbiBjYXNlXG4gICAgICBvcmllbnRhdGlvbiA9IHRoaXMucG9pbnRPcmllbnRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgcmFkaXVzQSA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJhZGl1c0IgPSBpbnRlcnNlY3Rpb24uc2VnbWVudFRvUG9pbnQob3RoZXJSYXkuc3RhcnQpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgcGFyYWxsZWwgcmF5cywgb3RoZXJSYXkgZ2V0cyBzaGlmdGVkIHRvIGJlXG4gICAgICAvLyBwZXJwZW5kaWN1bGFyIHRvIHRoaXMuXG4gICAgICBsZXQgc2hpZnRlZEludGVyc2VjdGlvbiA9IHRoaXMucGVycGVuZGljdWxhcigpXG4gICAgICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKG90aGVyUmF5KTtcbiAgICAgIGlmIChzaGlmdGVkSW50ZXJzZWN0aW9uID09PSBudWxsIHx8IHRoaXMuc3RhcnQuZXF1YWxzKHNoaWZ0ZWRJbnRlcnNlY3Rpb24pKSB7XG4gICAgICAgIC8vIFdoZW4gYm90aCByYXlzIGxheSBvbiB0b3Agb2YgZWFjaCBvdGhlciwgdGhlIHNoaWZ0aW5nIHByb2R1Y2VzXG4gICAgICAgIC8vIHJheXMgd2l0aCB0aGUgc2FtZSBzdGFydDsgZnVuY3Rpb24gcmV0dXJucyBhIGxpbmVhciBiZXppZXIuXG4gICAgICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgICB0aGlzLnN0YXJ0LCB0aGlzLnN0YXJ0LFxuICAgICAgICAgIG90aGVyUmF5LnN0YXJ0LCBvdGhlclJheS5zdGFydCk7XG4gICAgICB9XG4gICAgICBpbnRlcnNlY3Rpb24gPSB0aGlzLnN0YXJ0LnBvaW50QXRCaXNlY3RvcihzaGlmdGVkSW50ZXJzZWN0aW9uKTtcblxuICAgICAgLy8gQ2FzZSBmb3Igc2hpZnRlZCBpbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gcmF5c1xuICAgICAgb3JpZW50YXRpb24gPSB0aGlzLnBvaW50T3JpZW50YXRpb24oaW50ZXJzZWN0aW9uKTtcbiAgICAgIHJhZGl1c0EgPSBpbnRlcnNlY3Rpb24uc2VnbWVudFRvUG9pbnQodGhpcy5zdGFydCk7XG4gICAgICByYWRpdXNCID0gcmFkaXVzQS5pbnZlcnNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHJhZGl1c0EuYW5nbGUoKS5kaXN0YW5jZShyYWRpdXNCLmFuZ2xlKCksIG9yaWVudGF0aW9uKTtcbiAgICBjb25zdCBxdWFydGVyQW5nbGUgPSBhbmdsZURpc3RhbmNlLm11bHQoMS80KTtcbiAgICAvLyBUT0RPOiB3aGF0IGhhcHBlbnMgd2l0aCBzcXVhcmUgYW5nbGVzPyBpcyB0aGlzIGNvdmVyZWQgYnkgaW50ZXJzZWN0aW9uIGxvZ2ljP1xuICAgIGNvbnN0IHF1YXJ0ZXJUYW4gPSBxdWFydGVyQW5nbGUudGFuKCk7XG5cbiAgICBjb25zdCB0YW5nZW50QSA9IHF1YXJ0ZXJUYW4gKiByYWRpdXNBLmxlbmd0aCAqIDQvMztcbiAgICBjb25zdCBhbmNob3JBID0gdGhpcy5wb2ludEF0RGlzdGFuY2UodGFuZ2VudEEpO1xuXG4gICAgY29uc3QgdGFuZ2VudEIgPSBxdWFydGVyVGFuICogcmFkaXVzQi5sZW5ndGggKiA0LzM7XG4gICAgY29uc3QgYW5jaG9yQiA9IG90aGVyUmF5LnBvaW50QXREaXN0YW5jZSh0YW5nZW50Qik7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHRoaXMuc3RhcnQsIGFuY2hvckEsXG4gICAgICAgIGFuY2hvckIsIG90aGVyUmF5LnN0YXJ0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgc3RhcnRgIGFuZCBvcmllbnRlZCB0b3dhcmRzIGBhbmdsZWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmQgYGZvcm1hdGAuXG4gICpcbiAgKiBXaGVuIGBmb3JtYXRgIGlzIHByb3ZpZGVkLCB0aGUgYW5nbGUgZm9yIHRoZSByZXN1bHRpbmcgYFRleHRgIHdpbGxcbiAgKiBzdGlsbCBiZSBzZXQgdG8gYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgZm9ybWF0ID0gZm9ybWF0LndpdGhBbmdsZSh0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH1cblxuXG59IC8vIGNsYXNzIFJheVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU2VnbWVudCBvZiBhIGBbUmF5XXtAbGluayBSYWMuUmF5fWAgd2l0aCBhIGdpdmVuIGxlbmd0aC5cbipcbiogIyMjIGBpbnN0YW5jZS5TZWdtZW50YFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlNlZ21lbnRgIGZ1bmN0aW9uXXtAbGluayBSYWMjU2VnbWVudH0gdG8gY3JlYXRlIGBTZWdtZW50YCBvYmplY3RzXG4qIGZyb20gcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5TZWdtZW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5TZWdtZW50I3plcm99LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5TZWdtZW50YF17QGxpbmsgaW5zdGFuY2UuU2VnbWVudH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IHJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzQpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBzZWdtZW50ID0gbmV3IFJhYy5TZWdtZW50KHJhYywgcmF5LCAxMDApXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclNlZ21lbnQgPSByYWMuU2VnbWVudCg1NSwgNzcsIDEvNCwgMTAwKVxuKlxuKiBAc2VlIFtgcmFjLlNlZ21lbnRgXXtAbGluayBSYWMjU2VnbWVudH1cbiogQHNlZSBbYGluc3RhbmNlLlNlZ21lbnRgXXtAbGluayBpbnN0YW5jZS5TZWdtZW50fVxuKlxuKiBAYWxpYXMgUmFjLlNlZ21lbnRcbiovXG5jbGFzcyBTZWdtZW50IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTZWdtZW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRoZSBzZWdtZW50IGlzIGJhc2VkIG9mXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByYXksIGxlbmd0aCkge1xuICAgIC8vIFRPRE86IGRpZmZlcmVudCBhcHByb2FjaCB0byBlcnJvciB0aHJvd2luZz9cbiAgICAvLyBhc3NlcnQgfHwgdGhyb3cgbmV3IEVycm9yKGVyci5taXNzaW5nUGFyYW1ldGVycylcbiAgICAvLyBvclxuICAgIC8vIGNoZWNrZXIobXNnID0+IHsgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQobXNnKSk7XG4gICAgLy8gICAuZXhpc3RzKHJhYylcbiAgICAvLyAgIC5pc1R5cGUoUmFjLlJheSwgcmF5KVxuICAgIC8vICAgLmlzTnVtYmVyKGxlbmd0aClcblxuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHJheSwgbGVuZ3RoKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5SYXksIHJheSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKGxlbmd0aCk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGBSYXlgIHRoZSBzZWdtZW50IGlzIGJhc2VkIG9mLlxuICAgICogQHR5cGUge1JhYy5SYXl9XG4gICAgKi9cbiAgICB0aGlzLnJheSA9IHJheTtcblxuICAgIC8qKlxuICAgICogVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudC5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5TZWdtZW50KDU1LCA3NywgMC4yLCAxMDApLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnU2VnbWVudCgoNTUsNzcpIGE6MC4yIGw6MTAwKSdcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGxlbmd0aFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmxlbmd0aCwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFNlZ21lbnQoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9IGw6JHtsZW5ndGhTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHJheWAgYW5kIGBsZW5ndGhgIGluIGJvdGggc2VnbWVudHMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclNlZ21lbnRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuU2VnbWVudGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFNlZ21lbnRzJyBgbGVuZ3RoYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFtgcmF5LmVxdWFsc2Bde0BsaW5rIFJhYy5SYXkjZXF1YWxzfVxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc31cbiAgKi9cbiAgZXF1YWxzKG90aGVyU2VnbWVudCkge1xuICAgIHJldHVybiBvdGhlclNlZ21lbnQgaW5zdGFuY2VvZiBTZWdtZW50XG4gICAgICAmJiB0aGlzLnJheS5lcXVhbHMob3RoZXJTZWdtZW50LnJheSlcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLmxlbmd0aCwgb3RoZXJTZWdtZW50Lmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGBbYW5nbGVde0BsaW5rIFJhYy5SYXkjYW5nbGV9YCBvZiB0aGUgc2VnbWVudCdzIGByYXlgLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5hbmdsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFtzdGFydF17QGxpbmsgUmFjLlJheSNzdGFydH1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc3RhcnQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aGVyZSB0aGUgc2VnbWVudCBlbmRzLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGVuZFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGFuZ2xlIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdBbmdsZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMucmF5LnN0YXJ0LCBuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgcmF5YCBzZXQgdG8gYG5ld1JheWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBuZXdSYXkgLSBUaGUgcmF5IGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFJheShuZXdSYXkpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHN0YXJ0IHBvaW50IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydFBvaW50IC0gVGhlIHN0YXJ0IHBvaW50IGZvciB0aGUgbmV3XG4gICogYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoU3RhcnRQb2ludChuZXdTdGFydFBvaW50KSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0KG5ld1N0YXJ0UG9pbnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgc2V0IHRvIGBuZXdMZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdMZW5ndGggLSBUaGUgbGVuZ3RoIGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aChuZXdMZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBpbmNyZW1lbnRgIGFkZGVkIHRvIGBsZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBpbmNyZW1lbnQgLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aEFkZChpbmNyZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCArIGluY3JlbWVudCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYSBsZW5ndGggb2YgYGxlbmd0aCAqIHJhdGlvYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgaW5jcmVtZW50YCBhZGRlZCB0byBgcmF5LmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGluY3JlbWVudCAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZUFkZChpbmNyZW1lbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVBZGQoaW5jcmVtZW50KTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHJheS5bYW5nbGUuc2hpZnRde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCB0cmFuc2xhdGVkIGFnYWluc3QgdGhlXG4gICogc2VnbWVudCdzIHJheSBieSB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCwgd2hpbGUga2VlcGluZyB0aGUgc2FtZVxuICAqIGBlbmRQb2ludCgpYC4gVGhlIHJlc3VsdGluZyBzZWdtZW50IGtlZXBzIHRoZSBzYW1lIGFuZ2xlIGFzIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZSgtZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCArIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgZGlzdGFuY2VgIGFkZGVkIHRvIGBsZW5ndGhgLCB3aGljaFxuICAqIHJlc3VsdHMgaW4gYGVuZFBvaW50KClgIGZvciB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBtb3ZpbmcgaW4gdGhlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHRoZSBzYW1lIG9wZXJhdGlvbiBhc1xuICAqIGBbd2l0aExlbmd0aEFkZF17QGxpbmsgUmFjLlNlZ21lbnQjd2l0aExlbmd0aEFkZH1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIGFkZCB0byBgbGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLndpdGhMZW5ndGhBZGQoZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwb2ludGluZyB0b3dhcmRzXG4gICogYHJheS5hbmdsZS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAga2VlcHMgdGhlIHNhbWUgc3RhcnQgYW5kIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkuaW52ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGByYXkuYW5nbGVgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGtlZXBzIHRoZSBzYW1lIHN0YXJ0IGFuZCBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBlbmRQb2ludCgpYCBhbmQgZW5kaW5nIGF0XG4gICogYHN0YXJ0UG9pbnQoKWAuXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB1c2VzIHRoZSBbaW52ZXJzZV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9XG4gICogYW5nbGUgdG8gYHJheS5hbmdsZWAgYW5kIGtlZXBzIHRoZSBzYW1lIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgY29uc3QgZW5kID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IGludmVyc2VSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgZW5kLCB0aGlzLnJheS5hbmdsZS5pbnZlcnNlKCkpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgaW52ZXJzZVJheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCB0cmFuc2xhdGVkIGJ5IGBkaXN0YW5jZWBcbiAgKiB0b3dhcmRzIHRoZSBnaXZlbiBgYW5nbGVgLCBhbmQga2VlcGluZyB0aGUgc2FtZSBhbmdsZSBhbmQgbGVuZ3RoIGFzXG4gICogYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnRcbiAgICB0b3dhcmRzXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCB0cmFuc2xhdGVkIGJ5IGBkaXN0YW5jZWBcbiAgKiBhbG9uZyB0aGUgc2VnbWVudCdzIHJheSwgYW5kIGtlZXBpbmcgdGhlIHNhbWUgYW5nbGUgYW5kIGxlbmd0aCBhc1xuICAqIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGRpc3RhbmNlYCBpcyBuZWdhdGl2ZSwgdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgaXMgdHJhbnNsYXRlZCBpblxuICAqIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlIHNlZ21lbnQncyByYXkuXG4gICpcbiAgKiBAc2VlIFtgcmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2VgXXtAbGluayBSYWMuUmF5I3RyYW5zbGF0ZVRvRGlzdGFuY2V9XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvTGVuZ3RoKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgdHJhbnNsYXRlZCBhbG9uZyB0aGVcbiAgKiBzZWdtZW50J3MgcmF5IGJ5IGEgZGlzdGFuY2Ugb2YgYGxlbmd0aCAqIHJhdGlvYC4gVGhlIHJlc3VsdGluZyBzZWdtZW50XG4gICoga2VlcHMgdGhlIHNhbWUgYW5nbGUgYW5kIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGByYXRpb2AgaXMgbmVnYXRpdmUsIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGlzIHRyYW5zbGF0ZWQgaW4gdGhlXG4gICogb3Bwb3NpdGUgZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5LlxuICAqXG4gICogQHNlZSBbYHJheS50cmFuc2xhdGVUb0Rpc3RhbmNlYF17QGxpbmsgUmFjLlJheSN0cmFuc2xhdGVUb0Rpc3RhbmNlfVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgdHJhbnNsYXRlVG9MZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2UodGhpcy5sZW5ndGggKiByYXRpbyk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgdHJhbnNsYXRlZCBieSBgZGlzdGFuY2VgXG4gICogdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBvZiBgcmF5LmFuZ2xlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRvbi5cbiAgKiBUaGUgcmVzdWx0aW5nIHNlZ21lbnQga2VlcHMgdGhlIHNhbWUgYW5nbGUgYW5kIGxlbmd0aCBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGB2YWx1ZWAgY2xhbXBlZCB0byBgW3N0YXJ0SW5zZXQsIGxlbmd0aC1lbmRJbnNldF1gLlxuICAqXG4gICogV2hlbiBgc3RhcnRJbnNldGAgaXMgZ3JlYXRlciB0aGF0IGBsZW5ndGgtZW5kSW5zZXRgIHRoZSByYW5nZSBmb3IgdGhlXG4gICogY2xhbXAgYmVjb21lcyBpbXBvc2libGUgdG8gZnVsZmlsbC4gSW4gdGhpcyBjYXNlIHRoZSByZXR1cm5lZCB2YWx1ZVxuICAqIGlzIGNlbnRlcmVkIGJldHdlZW4gdGhlIHJhbmdlIGxpbWl0cyBhbmQgc3RpbGwgY2xhbXBsZWQgdG8gYFswLCBsZW5ndGhdYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIEEgdmFsdWUgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0SW5zZXQ9MF0gLSBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7ZW5kSW5zZXR9IFtlbmRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGNsYW1wVG9MZW5ndGgodmFsdWUsIHN0YXJ0SW5zZXQgPSAwLCBlbmRJbnNldCA9IDApIHtcbiAgICBjb25zdCBlbmRMaW1pdCA9IHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQ7XG4gICAgaWYgKHN0YXJ0SW5zZXQgPj0gZW5kTGltaXQpIHtcbiAgICAgIC8vIGltcG9zaWJsZSByYW5nZSwgcmV0dXJuIG1pZGRsZSBwb2ludFxuICAgICAgY29uc3QgcmFuZ2VNaWRkbGUgPSAoc3RhcnRJbnNldCAtIGVuZExpbWl0KSAvIDI7XG4gICAgICBjb25zdCBtaWRkbGUgPSBzdGFydEluc2V0IC0gcmFuZ2VNaWRkbGU7XG4gICAgICAvLyBTdGlsbCBjbGFtcCB0byB0aGUgc2VnbWVudCBpdHNlbGZcbiAgICAgIGxldCBjbGFtcGVkID0gbWlkZGxlO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoKTtcbiAgICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCAwKTtcbiAgICAgIHJldHVybiBjbGFtcGVkO1xuICAgIH1cbiAgICBsZXQgY2xhbXBlZCA9IHZhbHVlO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1pbihjbGFtcGVkLCB0aGlzLmxlbmd0aCAtIGVuZEluc2V0KTtcbiAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgc3RhcnRJbnNldCk7XG4gICAgcmV0dXJuIGNsYW1wZWQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhbG9uZyB0aGUgc2VnbWVudCdzIHJheSBhdCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYFxuICAqIGZyb20gYHJheS5zdGFydGAuXG4gICpcbiAgKiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIHRoZSByZXN1bHRpbmcgYFBvaW50YCBpcyBsb2NhdGVkIGluIHRoZVxuICAqIG9wcG9zaXRlIGRpcmVjdGlvbiBvZiB0aGUgc2VnbWVudCdzIHJheS5cbiAgKlxuICAqIEBzZWUgW2ByYXkucG9pbnRBdERpc3RhbmNlYF17QGxpbmsgUmFjLlJheSNwb2ludEF0RGlzdGFuY2V9XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgZnJvbSBgc3RhcnRQb2ludCgpYFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRMZW5ndGgoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGFsb25nIHRoZSBzZWdtZW50J3MgcmF5IGF0IGEgZGlzdGFuY2Ugb2ZcbiAgKiBgbGVuZ3RoICogcmF0aW9gIGZyb20gYHJheS5zdGFydGAuXG4gICpcbiAgKiBXaGVuIGByYXRpb2AgaXMgbmVnYXRpdmUsIHRoZSByZXN1bHRpbmcgYFBvaW50YCBpcyBsb2NhdGVkIGluIHRoZVxuICAqIG9wcG9zaXRlIGRpcmVjdGlvbiBvZiB0aGUgc2VnbWVudCdzIHJheS5cbiAgKlxuICAqIEBzZWUgW2ByYXkucG9pbnRBdERpc3RhbmNlYF17QGxpbmsgUmFjLlJheSNwb2ludEF0RGlzdGFuY2V9XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBtaWRkbGUgcG9pbnQgdGhlIHNlZ21lbnQuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEJpc2VjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgvMik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBuZXdTdGFydFBvaW50YCBhbmQgZW5kaW5nIGF0XG4gICogYGVuZFBvaW50KClgLlxuICAqXG4gICogV2hlbiBgbmV3U3RhcnRQb2ludGAgYW5kIGBlbmRQb2ludCgpYCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzXG4gICogdG8gYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbW92ZVN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBzdGFydFBvaW50KClgIGFuZCBlbmRpbmcgYXRcbiAgKiBgbmV3RW5kUG9pbnRgLlxuICAqXG4gICogV2hlbiBgc3RhcnRQb2ludCgpYCBhbmQgYG5ld0VuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzIHRvXG4gICogYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3RW5kUG9pbnQgLSBUaGUgZW5kIHBvaW50IG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBtb3ZlRW5kUG9pbnQobmV3RW5kUG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc2VnbWVudFRvUG9pbnQobmV3RW5kUG9pbnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzdGFydGluZyBwb2ludCB0byB0aGUgc2VnbWVudCdzIG1pZGRsZVxuICAqIHBvaW50LlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2Bwb2ludEF0QmlzZWN0b3JgXXtAbGluayBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3J9XG4gICovXG4gIHNlZ21lbnRUb0Jpc2VjdG9yKCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzZWdtZW50J3MgbWlkZGxlIHBvaW50IHRvd2FyZHMgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB1c2VzIGBuZXdMZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgXG4gICogZGVmYXVsdHMgdG8gYGxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBzZWUgW2Bwb2ludEF0QmlzZWN0b3JgXXtAbGluayBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3J9XG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gW25ld0xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgbGVuZ3RoYFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudEJpc2VjdG9yKG5ld0xlbmd0aCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMucG9pbnRBdEJpc2VjdG9yKCk7XG4gICAgY29uc3QgbmV3QW5nbGUgPSB0aGlzLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCBuZXdBbmdsZSk7XG4gICAgbmV3TGVuZ3RoID0gbmV3TGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IG5ld0xlbmd0aDtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAsIHdpdGggdGhlIGdpdmVuXG4gICogYG5ld0xlbmd0aGAsIGFuZCBrZWVwaW5nIHRoZSBzYW1lIGFuZ2xlIGFzIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdMZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXh0IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRXaXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhTdGFydChuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIGFuZCBlbmRpbmcgYXRcbiAgKiBgbmV4dEVuZFBvaW50YC5cbiAgKlxuICAqIFdoZW4gYGVuZFBvaW50KClgIGFuZCBgbmV4dEVuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIGRlZmF1bHRzXG4gICogdG8gYHJheS5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV4dEVuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBuZXh0U2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0LnNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCwgdGhpcy5yYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgdG93YXJkcyBgYW5nbGVgLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgdXNlcyBgbmV3TGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yIGBudWxsYFxuICAqIGRlZmF1bHRzIHRvIGBsZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbmV3TGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGBsZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFRvQW5nbGUoYW5nbGUsIG5ld0xlbmd0aCA9IG51bGwpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgbmV3TGVuZ3RoID0gbmV3TGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IG5ld0xlbmd0aDtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgYW5kIHBvaW50aW5nIHRvd2FyZHNcbiAgKiBgcmF5LmFuZ2xlLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAgc2hpZnRlZCBieVxuICAqIGBhbmdsZURpc3RhbmNlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB1c2VzIGBuZXdMZW5ndGhgLCB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgZGVmYXVsdHMgdG8gYGxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoZSBgYW5nbGVEaXN0YW5jZWAgaXMgYXBwbGllZCB0byB0aGVcbiAgKiBbaW52ZXJzZV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9IG9mIHRoZSBzZWdtZW50J3MgYW5nbGUuIEUuZy4gd2l0aFxuICAqIGFuIGBhbmdsZURpc3RhbmNlYCBvZiBgMGAgdGhlIHJlc3VsdGluZyBgU2VnbWVudGAgaXMgZGlyZWN0bHkgb3ZlciBhbmRcbiAgKiBwb2ludGluZyBpbiB0aGUgaW52ZXJzZSBhbmdsZSBvZiBgdGhpc2AuIEFzIHRoZSBgYW5nbGVEaXN0YW5jZWBcbiAgKiBpbmNyZWFzZXMgdGhlIHR3byBzZWdtZW50cyBzZXBhcmF0ZSB3aXRoIHRoZSBwaXZvdCBhdCBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBBbiBhbmdsZSBkaXN0YW5jZSB0byBhcHBseSB0b1xuICAqIHRoZSBzZWdtZW50J3MgYW5nbGUgaW52ZXJzZVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYW5nbGUgc2hpZnRcbiAgKiBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P051bWJlcn0gW25ld0xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgbGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSwgbmV3TGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIG5ld0xlbmd0aCA9IG5ld0xlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbmV3TGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5pbnZlcnNlKClcbiAgICAgIC53aXRoQW5nbGVTaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZVxuICAqIGBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9YCBvZlxuICAqIGByYXkuYW5nbGUuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHVzZXMgYG5ld0xlbmd0aGAsIHdoZW4gb21taXRlZCBvciBgbnVsbGBcbiAgKiBkZWZhdWx0cyB0byBgbGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX0gb2YgdGhlIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoXG4gICogYGNsb2Nrd2lzZWAgYXMgYHRydWVgLCB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBwb2ludHMgdG93YXJkc1xuICAqIGByYXkuYW5nbGUucGVycGVuZGljdWxhcihmYWxzZSlgLlxuICAqXG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGZyb20gYGVuZFBvaW50KClgXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbmV3TGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGBsZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSwgbmV3TGVuZ3RoID0gbnVsbCkge1xuICAgIG5ld0xlbmd0aCA9IG5ld0xlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbmV3TGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IHN0YXJ0cyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgY29ycmVzcG9uZHNcbiAgKiB0byB0aGUgbGVnIG9mIGEgcmlnaHQgdHJpYW5nbGUgd2hlcmUgYHRoaXNgIGlzIHRoZSBvdGhlciBjYXRoZXR1cyBhbmRcbiAgKiB0aGUgaHlwb3RlbnVzZSBpcyBvZiBsZW5ndGggYGh5cG90ZW51c2VgLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgU2VnbWVudGAgcG9pbnRzIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgb2ZcbiAgKiBgcmF5LmFuZ2xlLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIGBoeXBvdGVudXNlYCBpcyBzbWFsbGVyIHRoYXQgdGhlIHNlZ21lbnQncyBgbGVuZ3RoYCwgcmV0dXJuc1xuICAqIGBudWxsYCBzaW5jZSBubyByaWdodCB0cmlhbmdsZSBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBoeXBvdGVudXNlIC0gVGhlIGxlbmd0aCBvZiB0aGUgaHlwb3RlbnVzZSBzaWRlIG9mIHRoZVxuICAqIHJpZ2h0IHRyaWFuZ2xlIGZvcm1lZCB3aXRoIGB0aGlzYCBhbmQgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgbmV4dFNlZ21lbnRMZWdXaXRoSHlwKGh5cG90ZW51c2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAoaHlwb3RlbnVzZSA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBjb3MgPSBhZHkgLyBoeXBcbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKHRoaXMubGVuZ3RoIC8gaHlwb3RlbnVzZSk7XG4gICAgLy8gdGFuID0gb3BzIC8gYWRqXG4gICAgLy8gdGFuICogYWRqID0gb3BzXG4gICAgY29uc3Qgb3BzID0gTWF0aC50YW4ocmFkaWFucykgKiB0aGlzLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlLCBvcHMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgZ2l2ZW4gYGVuZEFuZ2xlYFxuICAqIGFuZCBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYEFyY2AgaXMgY2VudGVyZWQgYXQgYHJheS5zdGFydGAsIHN0YXJ0aW5nIGF0XG4gICogYHJheS5hbmdsZWAsIGFuZCB3aXRoIGEgcmFkaXVzIG9mIGBsZW5ndGhgLlxuICAqXG4gICogV2hlbiBgZW5kQW5nbGVgIGlzIG9tbWl0ZWQgb3IgYG51bGxgLCB0aGUgc2VnbWVudCdzIGFuZ2xlIGlzIHVzZWQgYXNcbiAgKiBkZWZhdWx0IHJlc3VsdGluZyBpbiBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV9IFtlbmRBbmdsZT1udWxsXSAtIEFuIGBBbmdsZWAgdG8gdXNlIGFzIGVuZCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLCBvciBgbnVsbGAgdG8gdXNlIGByYXkuYW5nbGVgXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKGVuZEFuZ2xlID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGVuZEFuZ2xlID0gZW5kQW5nbGUgPT09IG51bGxcbiAgICAgID8gdGhpcy5yYXkuYW5nbGVcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGVuZEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICB0aGlzLnJheS5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgYXJjJ3MgZW5kIGF0XG4gICogYGFuZ2xlRGlzdGFuY2VgIGZyb20gdGhlIHNlZ21lbnQncyBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYEFyY2AgaXMgY2VudGVyZWQgYXQgYHJheS5zdGFydGAsIHN0YXJ0aW5nIGF0XG4gICogYHJheS5hbmdsZWAsIGFuZCB3aXRoIGEgcmFkaXVzIG9mIGBsZW5ndGhgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gdGhlXG4gICogc2VnbWVudCdzIHN0YXJ0IHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjV2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IHN0YXJnQW5nbGUgPSB0aGlzLnJheS5hbmdsZTtcbiAgICBjb25zdCBlbmRBbmdsZSA9IHN0YXJnQW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHN0YXJnQW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogdW5jb21tZW50IG9uY2UgYmV6aWVycyBhcmUgdGVzdGVkIGFnYWluXG4gIC8vIGJlemllckNlbnRyYWxBbmNob3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgLy8gICBsZXQgYmlzZWN0b3IgPSB0aGlzLnNlZ21lbnRCaXNlY3RvcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgLy8gICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLnN0YXJ0LCBiaXNlY3Rvci5lbmQsXG4gIC8vICAgICBiaXNlY3Rvci5lbmQsIHRoaXMuZW5kKTtcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgc3RhcnRgIGFuZCBvcmllbnRlZCB0b3dhcmRzIGByYXkuYW5nbGVgXG4gICogd2l0aCB0aGUgZ2l2ZW4gYHN0cmluZ2AgYW5kIGBmb3JtYXRgLlxuICAqXG4gICogV2hlbiBgZm9ybWF0YCBpcyBwcm92aWRlZCwgdGhlIGFuZ2xlIGZvciB0aGUgcmVzdWx0aW5nIGBUZXh0YCBpcyBzdGlsbFxuICAqIHNldCB0byBgcmF5LmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgZm9ybWF0ID0gZm9ybWF0LndpdGhBbmdsZSh0aGlzLnJheS5hbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuVGV4dCh0aGlzLnJhYywgdGhpcy5yYXkuc3RhcnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG5cbn0gLy8gU2VnbWVudFxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5zIHR3byBgW0NvbXBvc2l0ZV17QGxpbmsgUmFjLkNvbXBvc2l0ZX1gIG9iamVjdHM6IGBvdXRsaW5lYCBhbmRcbiogYGNvbnRvdXJgLlxuKlxuKiBVc2VkIGJ5IGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gIHRvIGRyYXcgdGhlIGNvbXBvc2l0ZXMgYXMgYVxuKiBjb21wbGV4IHNoYXBlIChgb3V0bGluZWApIHdpdGggYW4gbmVnYXRpdmUgc3BhY2Ugc2hhcGUgaW5zaWRlIChgY29udG91cmApLlxuKlxuKiDimqDvuI8gVGhlIEFQSSBmb3IgU2hhcGUgaXMgKipwbGFubmVkIHRvIGNoYW5nZSoqIGluIGEgZnV0dXJlIHJlbGVhc2UuIOKaoO+4j1xuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5TaGFwZVxuKi9cbmZ1bmN0aW9uIFNoYXBlKHJhYykge1xuICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5vdXRsaW5lID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbiAgdGhpcy5jb250b3VyID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlO1xuXG5cblNoYXBlLnByb3RvdHlwZS5hZGRPdXRsaW5lID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLm91dGxpbmUuYWRkKGVsZW1lbnQpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLmFkZENvbnRvdXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHRoaXMuY29udG91ci5hZGQoZWxlbWVudCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRGV0ZXJtaW5lcyB0aGUgYWxpZ25tZW50LCBhbmdsZSwgZm9udCwgc2l6ZSwgYW5kIHBhZGRpbmcgZm9yIGRyYXdpbmcgYVxuKiBbYFRleHRgXXtAbGluayBSYWMuVGV4dH0gb2JqZWN0LlxuKlxuKiAjIyMgYGluc3RhbmNlLlRleHQuRm9ybWF0YFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlRleHQuRm9ybWF0YCBmdW5jdGlvbl17QGxpbmsgUmFjI1RleHRGb3JtYXR9IHRvIGNyZWF0ZVxuKiBgVGV4dC5Gb3JtYXRgIG9iamVjdHMgZnJvbSBwcmltaXRpdmUgdmFsdWVzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnNcbiogcmVhZHktbWFkZSBjb252ZW5pZW5jZSBvYmplY3RzLCBsaWtlXG4qIFtgcmFjLlRleHQuRm9ybWF0LnRvcExlZnRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fSwgbGlzdGVkXG4qIHVuZGVyIFtgaW5zdGFuY2UuVGV4dC5Gb3JtYXRgXXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IGFuZ2xlID0gcmFjLkFuZ2xlKDEvOClcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLCAnbGVmdCcsICdiYXNlbGluZScsIGFuZ2xlKVxuKiAvLyBvciBjb252ZW5pZW5jZSBmdW5jdGlvblxuKiBsZXQgb3RoZXJGb3JtYXQgPSByYWMuVGV4dC5Gb3JtYXQoJ2xlZnQnLCAnYmFzZWxpbmUnLCAxLzgpXG4qXG4qIEBzZWUgW2ByYWMuVGV4dC5Gb3JtYXRgXXtAbGluayBSYWMjVGV4dEZvcm1hdH1cbiogQHNlZSBbYGluc3RhbmNlLlRleHQuRm9ybWF0YF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXR9XG4qXG4qIEBhbGlhcyBSYWMuVGV4dC5Gb3JtYXRcbiovXG5jbGFzcyBUZXh0Rm9ybWF0IHtcblxuICAvKipcbiAgKiBTdXBwb3J0ZWQgdmFsdWVzIGZvciBbYGhBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNoQWxpZ259IHdoaWNoXG4gICogZGVybWluZXMgdGhlIGxlZnQtdG8tcmlnaHQgYWxpZ25tZW50IG9mIHRoZSBkcmF3biBgVGV4dGAgaW4gcmVsYXRpb25cbiAgKiB0byBpdHMgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAqXG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGxlZnRcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIGxlZnQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBjZW50ZXJcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIGNlbnRlciwgZnJvbSBzaWRlIHRvIHNpZGUsIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IHJpZ2h0XG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSByaWdodCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICpcbiAgKiBAdHlwZSB7T2JqZWN0fVxuICAqIEBtZW1iZXJvZiBSYWMuVGV4dC5Gb3JtYXRcbiAgKi9cbiAgc3RhdGljIGhvcml6b250YWxBbGlnbiA9IHtcbiAgICBsZWZ0OiAgIFwibGVmdFwiLFxuICAgIGNlbnRlcjogXCJob3Jpem9udGFsQ2VudGVyXCIsXG4gICAgcmlnaHQ6ICBcInJpZ2h0XCJcbiAgfTtcblxuICAvKipcbiAgKiBTdXBwb3J0ZWQgdmFsdWVzIGZvciBbYHZBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCN2QWxpZ259IHdoaWNoXG4gICogZGVybWluZXMgdGhlIHRvcC10by1ib3R0b20gYWxpZ25tZW50IG9mIHRoZSBkcmF3biBgVGV4dGAgaW4gcmVsYXRpb25cbiAgKiB0byBpdHMgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAqXG4gICogQHByb3BlcnR5IHtTdHJpbmd9IHRvcFxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgdG9wIGVkZ2Ugb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gY2VudGVyXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIGF0IHRoZSBjZW50ZXIsIGZyb20gdG9wIHRvIGJvdHRvbSwgb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gYmFzZWxpbmVcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgYXQgdGhlIGJhc2VsaW5lIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGJvdHRvbVxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCBhdCB0aGUgYm90dG9tIGVkZ2Ugb2YgdGhlIGRyYXduIHRleHRcbiAgKlxuICAqIEB0eXBlIHtPYmplY3R9XG4gICogQG1lbWJlcm9mIFJhYy5UZXh0LkZvcm1hdFxuICAqL1xuICBzdGF0aWMgdmVydGljYWxBbGlnbiA9IHtcbiAgICB0b3A6ICAgICAgXCJ0b3BcIixcbiAgICBjZW50ZXI6ICAgXCJ2ZXJ0aWNhbENlbnRlclwiLFxuICAgIGJhc2VsaW5lOiBcImJhc2VsaW5lXCIsXG4gICAgYm90dG9tOiAgIFwiYm90dG9tXCJcbiAgfTtcblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFRleHQuRm9ybWF0YCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWNcbiAgKiAgIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7U3RyaW5nfSBoQWxpZ25cbiAgKiAgIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodDsgb25lIG9mIHRoZSB2YWx1ZXMgZnJvbVxuICAqICAgW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufVxuICAqIEBwYXJhbSB7U3RyaW5nfSB2QWxpZ25cbiAgKiAgIFRoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQsIHRvcC10by1ib3R0b207IG9uZSBvZiB0aGUgdmFsdWVzIGZyb21cbiAgKiAgIFtgdmVydGljYWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWdufVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBbYW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduXG4gICogQHBhcmFtIHs/U3RyaW5nfSBbZm9udD1udWxsXVxuICAqICAgVGhlIGZvbnQgbmFtZVxuICAqIEBwYXJhbSB7P051bWJlcn0gW3NpemU9bnVsbF1cbiAgKiAgIFRoZSBmb250IHNpemVcbiAgKiBAcGFyYW0ge051bWJlcn0gW2hQYWRkaW5nPTBdXG4gICogICBUaGUgaG9yaXpvbnRhbCBwYWRkaW5nLCBsZWZ0LXRvLXJpZ2h0XG4gICogQHBhcmFtIHtOdW1iZXJ9IFt2UGFkZGluZz0wXVxuICAqICAgVGhlIHZlcnRpY2FsIHBhZGRpbmcsIHRvcC10by1ib3R0b21cbiAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmFjLFxuICAgIGhBbGlnbixcbiAgICB2QWxpZ24sXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBmb250ID0gbnVsbCxcbiAgICBzaXplID0gbnVsbCxcbiAgICBoUGFkZGluZyA9IDAsXG4gICAgdlBhZGRpbmcgPSAwKVxuICB7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0U3RyaW5nKGhBbGlnbiwgdkFsaWduKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5BbmdsZSwgYW5nbGUpO1xuICAgIGZvbnQgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0U3RyaW5nKGZvbnQpO1xuICAgIHNpemUgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0TnVtYmVyKHNpemUpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihoUGFkZGluZywgdlBhZGRpbmcpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodCwgdG8gcG9zaXRpb24gYSBgVGV4dGBcbiAgICAqIHJlbGF0aXZlIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIFN1cHBvcnRlZCB2YWx1ZXMgYXJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZVxuICAgICogW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufSBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuaEFsaWduID0gaEFsaWduO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tLCB0byBwb3NpdGlvbiBhIGBUZXh0YCByZWxhdGl2ZVxuICAgICogdG8gaXRzIFtgcG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICAgKlxuICAgICogU3VwcG9ydGVkIHZhbHVlcyBhcmUgYXZhaWxhYmxlIHRocm91Z2ggdGhlXG4gICAgKiBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn0gb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnZBbGlnbiA9IHZBbGlnbjtcblxuICAgIC8qKlxuICAgICogVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd24uXG4gICAgKlxuICAgICogQW4gYW5nbGUgb2YgW2B6ZXJvYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb30gd2lsIGRyYXcgdGhlIHRleHRcbiAgICAqIHRvd2FyZHMgdGhlIHJpZ2h0IG9mIHRoZSBzY3JlZW4uXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgIC8qKlxuICAgICogVGhlIGZvbnQgbmFtZSBvZiB0aGUgdGV4dCB0byBkcmF3LlxuICAgICpcbiAgICAqIFdoZW4gc2V0IHRvIGBudWxsYCB0aGUgZm9udCBkZWZpbmVkIGluXG4gICAgKiBbYHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuZm9udGBde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9IGlzXG4gICAgKiB1c2VkIGluc3RlYWQgdXBvbiBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHs/U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy5mb250ID0gZm9udDtcblxuICAgIC8qKlxuICAgICogVGhlIGZvbnQgc2l6ZSBvZiB0aGUgdGV4dCB0byBkcmF3LlxuICAgICpcbiAgICAqIFdoZW4gc2V0IHRvIGBudWxsYCB0aGUgc2l6ZSBkZWZpbmVkIGluXG4gICAgKiBbYHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZWBde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9IGlzXG4gICAgKiB1c2VkIGluc3RlYWQgdXBvbiBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHs/TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcblxuICAgIC8qKlxuICAgICogVGhlIGhvcml6b250YWwgcGFkZGluZywgbGVmdC10by1yaWdodCwgdG8gZGlzdGFuY2UgYSBgVGV4dGBcbiAgICAqIHJlbGF0aXZlIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmhQYWRkaW5nID0gaFBhZGRpbmc7XG5cbiAgICAvKipcbiAgICAqIFRoZSB2ZXJ0aWNhbCBwYWRkaW5nLCB0b3AtdG8tYm90dG9tLCB0byBkaXN0YW5jZSBhIGBUZXh0YCByZWxhdGl2ZVxuICAgICogdG8gaXRzIFtgcG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy52UGFkZGluZyA9IHZQYWRkaW5nO1xuICB9IC8vIGNvbnN0cnVjdG9yXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ3RvcCcsIDAuMiwgJ3NhbnMnLCAxNCwgNywgNSkpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnVGV4dC5Gb3JtYXQoaGE6bGVmdCB2YTp0b3AgYTowLjIgZjpcInNhbnNcIiBzOjE0IHA6KDcsNSkpJ1xuICAqXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCBhbmdsZVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgY29uc3Qgc2l6ZVN0ciA9IHRoaXMuc2l6ZSA9PT0gbnVsbFxuICAgICAgPyAnbnVsbCdcbiAgICAgIDogdXRpbHMuY3V0RGlnaXRzKHRoaXMuc2l6ZSwgZGlnaXRzKTtcbiAgICBjb25zdCBmb250U3RyID0gdGhpcy5mb250ID09PSBudWxsXG4gICAgICA/ICdudWxsJ1xuICAgICAgOiBgXCIke3RoaXMuZm9udH1cImA7XG4gICAgY29uc3QgaFBhZGRpbmdTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5oUGFkZGluZywgZGlnaXRzKTtcbiAgICBjb25zdCB2UGFkZGluZ1N0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnZQYWRkaW5nLCBkaWdpdHMpO1xuICAgIGNvbnN0IHBhZGRpbmdzU3RyID0gYCR7aFBhZGRpbmdTdHJ9LCR7dlBhZGRpbmdTdHJ9YFxuICAgIHJldHVybiBgVGV4dC5Gb3JtYXQoaGE6JHt0aGlzLmhBbGlnbn0gdmE6JHt0aGlzLnZBbGlnbn0gYToke2FuZ2xlU3RyfSBmOiR7Zm9udFN0cn0gczoke3NpemVTdHJ9IHA6KCR7cGFkZGluZ3NTdHJ9KSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzLCBleGNlcHQgYHJhY2AsIG9mIGJvdGggZm9ybWF0cyBhcmVcbiAgKiBlcXVhbCwgb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyRm9ybWF0YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlRleHQuRm9ybWF0YCwgcmV0dXJuc1xuICAqIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gb3RoZXJGb3JtYXQgLSBBIGBUZXh0LkZvcm1hdGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJGb3JtYXQpIHtcbiAgICByZXR1cm4gb3RoZXJGb3JtYXQgaW5zdGFuY2VvZiBUZXh0Rm9ybWF0XG4gICAgICAmJiB0aGlzLmhBbGlnbiAgID09PSBvdGhlckZvcm1hdC5oQWxpZ25cbiAgICAgICYmIHRoaXMudkFsaWduICAgPT09IG90aGVyRm9ybWF0LnZBbGlnblxuICAgICAgJiYgdGhpcy5mb250ICAgICA9PT0gb3RoZXJGb3JtYXQuZm9udFxuICAgICAgJiYgdGhpcy5zaXplICAgICA9PT0gb3RoZXJGb3JtYXQuc2l6ZVxuICAgICAgJiYgdGhpcy5oUGFkZGluZyA9PT0gb3RoZXJGb3JtYXQuaFBhZGRpbmdcbiAgICAgICYmIHRoaXMudlBhZGRpbmcgPT09IG90aGVyRm9ybWF0LnZQYWRkaW5nXG4gICAgICAmJiB0aGlzLmFuZ2xlLmVxdWFscyhvdGhlckZvcm1hdC5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHQuRm9ybWF0YCB3aXRoIGBhbmdsZWAgc2V0IHRvIHRoZSBgQW5nbGVgIGRlcml2ZWRcbiAgKiBmcm9tIGBuZXdBbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaEFsaWduLCB0aGlzLnZBbGlnbixcbiAgICAgIG5ld0FuZ2xlLFxuICAgICAgdGhpcy5mb250LCB0aGlzLnNpemUsXG4gICAgICB0aGlzLmhQYWRkaW5nLCB0aGlzLnZQYWRkaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggYGZvbnRgIHNldCB0byBgbmV3Rm9udGAuXG4gICogQHBhcmFtIHs/U3RyaW5nfSBuZXdGb250IC0gVGhlIGZvbnQgbmFtZSBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgO1xuICAqICAgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aEZvbnQobmV3Rm9udCkge1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaEFsaWduLCB0aGlzLnZBbGlnbixcbiAgICAgIHRoaXMuYW5nbGUsXG4gICAgICBuZXdGb250LCB0aGlzLnNpemUsXG4gICAgICB0aGlzLmhQYWRkaW5nLCB0aGlzLnZQYWRkaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggYHNpemVgIHNldCB0byBgbmV3U2l6ZWAuXG4gICogQHBhcmFtIHs/TnVtYmVyfSBuZXdTaXplIC0gVGhlIGZvbnQgc2l6ZSBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgO1xuICAqICAgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aFNpemUobmV3U2l6ZSkge1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaEFsaWduLCB0aGlzLnZBbGlnbixcbiAgICAgIHRoaXMuYW5nbGUsXG4gICAgICB0aGlzLmZvbnQsIG5ld1NpemUsXG4gICAgICB0aGlzLmhQYWRkaW5nLCB0aGlzLnZQYWRkaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggcGFkZGluZ3Mgc2V0IHRvIHRoZSBnaXZlbiB2YWx1ZXMuXG4gICpcbiAgKiBXaGVuIG9ubHkgYGhQYWRkaW5nYCBpcyBwcm92aWRlZCwgdGhhdCB2YWx1ZSBpcyB1c2VkIGZvciBib3RoXG4gICogaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFkZGluZy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBoUGFkZGluZyAtIFRoZSBob3Jpem9udGFsIHBhZGRpbmcgZm9yIHRoZSBuZXcgYFRleHQuRm9ybWF0YFxuICAqIEBwYXJhbSB7TnVtYmVyfSBbdlBhZGRpbmddIC0gVGhlIHZlcnRpY2FsIHBhZGRpbmcgZm9yIHRoZSBuZXcgYFRleHQuRm9ybWF0YDtcbiAgKiAgIHdoZW4gb21taXRlZCwgYGhQYWRkaW5nYCBpcyB1c2VkIGluc3RlYWRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICovXG4gIHdpdGhQYWRkaW5ncyhoUGFkZGluZywgdlBhZGRpbmcgPSBudWxsKSB7XG4gICAgaWYgKHZQYWRkaW5nID09PSBudWxsKSB7XG4gICAgICB2UGFkZGluZyA9IGhQYWRkaW5nO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLCB0aGlzLmZvbnQsIHRoaXMuc2l6ZSxcbiAgICAgIGhQYWRkaW5nLCB2UGFkZGluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHQuRm9ybWF0YCB0aGF0IGZvcm1hdHMgYSB0ZXh0IHJldmVyc2VkLCB1cHNpZGUtZG93bixcbiAgKiBnZW5lcmFsbHkgaW4gdGhlIHNhbWUgcG9zaXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogVGhlIHJlc3VsdGluZyBgRm9ybWF0YCB3aWxsIGJlIG9yaWVudGVkIHRvd2FyZHMgdGhlXG4gICogW2ludmVyc2Vde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfSBvZiBgYW5nbGVgOyBhbGlnbm1lbnRzIGZvciBgbGVmdGBcbiAgKiBiZWNvbWVzIGByaWdodGAgYW5kIHZpY2V2ZXJzYTsgYHRvcGAgYmVjb21lcyBgYm90dG9tYCBhbmQgdmljZXZlcnNhO1xuICAqIGBjZW50ZXJgIGFuZCBgYmFzZWxpbmVgIHJlbWFpbiB0aGUgc2FtZS5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgbGV0IGhFbnVtID0gVGV4dEZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gICAgbGV0IHZFbnVtID0gVGV4dEZvcm1hdC52ZXJ0aWNhbEFsaWduO1xuICAgIGxldCBoQWxpZ24sIHZBbGlnbjtcbiAgICBzd2l0Y2ggKHRoaXMuaEFsaWduKSB7XG4gICAgICBjYXNlIGhFbnVtLmxlZnQ6ICBoQWxpZ24gPSBoRW51bS5yaWdodDsgYnJlYWs7XG4gICAgICBjYXNlIGhFbnVtLnJpZ2h0OiBoQWxpZ24gPSBoRW51bS5sZWZ0OyBicmVhaztcbiAgICAgIGRlZmF1bHQ6ICAgICAgICAgIGhBbGlnbiA9IHRoaXMuaEFsaWduOyBicmVhaztcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLnZBbGlnbikge1xuICAgICAgY2FzZSB2RW51bS50b3A6ICAgIHZBbGlnbiA9IHZFbnVtLmJvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlIHZFbnVtLmJvdHRvbTogdkFsaWduID0gdkVudW0udG9wOyBicmVhaztcbiAgICAgIGRlZmF1bHQ6ICAgICAgICAgICB2QWxpZ24gPSB0aGlzLnZBbGlnbjsgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICBoQWxpZ24sIHZBbGlnbixcbiAgICAgIHRoaXMuYW5nbGUuaW52ZXJzZSgpLFxuICAgICAgdGhpcy5mb250LCB0aGlzLnNpemUsXG4gICAgICB0aGlzLmhQYWRkaW5nLCB0aGlzLnZQYWRkaW5nKTtcbiAgfVxuXG59IC8vIGNsYXNzIFRleHRGb3JtYXRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGb3JtYXQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbmNvbnN0IFRleHRGb3JtYXQgPSByZXF1aXJlKCcuL1RleHQuRm9ybWF0JylcblxuLy8gTm90IHVzZWQsIFNlZW1zIGxpa2UgdWdsaWZ5IG1pbmlmaWNhdGlvbiBuZWVkcyBhIHJlZmVyZW5jZSBoZXJlO1xuLy8gb3RoZXJ3aXNlIFRleHRGb3JtYXQgaXMgbm90IGNvcnJlY3RseSByZXF1aXJlZC5cbnZhciBtaW5pZnlIZWxwZXIgPSBUZXh0Rm9ybWF0XG5cbi8qKlxuKiBTdHJpbmcsIHBvc2l0aW9uIGFuZCBbZm9ybWF0XXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9IHRvIGRyYXcgYSB0ZXh0LlxuKlxuKiBBbiBpbnN0YW5jZSBvZiB0aGlzIG9iamVjdCBjb250YWlucyB0aGUgc3RyaW5nIGFuZCBhIGBQb2ludGAgdXNlZCB0b1xuKiBkZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIHRoZSBkcmF3biB0ZXh0LiBUaGVcbiogW2BUZXh0LkZvcm1hdGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdH0gb2JqZWN0IGRldGVybWluZXMgdGhlIGZvbnQsIHNpemUsXG4qIG9yaWVudGF0aW9uIGFuZ2xlLCBhbmQgdGhlIGFsaWdubWVudCByZWxhdGl2ZSB0b1xuKiBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvIGRyYXcgdGhlIHRleHQuXG4qXG4qICMjIyBgaW5zdGFuY2UuVGV4dGBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5UZXh0YCBmdW5jdGlvbl17QGxpbmsgUmFjI1RleHR9IHRvIGNyZWF0ZSBgVGV4dGAgb2JqZWN0cyB3aXRoIGZld2VyXG4qIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuVGV4dC5oZWxsb2Bde0BsaW5rIGluc3RhbmNlLlRleHQjaGVsbG99LCBsaXN0ZWQgdW5kZXJcbiogW2BpbnN0YW5jZS5UZXh0YF17QGxpbmsgaW5zdGFuY2UuVGV4dH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IHBvaW50ID0gcmFjLlBvaW50KDU1LCA3NylcbiogbGV0IGZvcm1hdCA9IHJhYy5UZXh0LkZvcm1hdCgnbGVmdCcsICdiYXNlbGluZScpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCB0ZXh0ID0gbmV3IFJhYy5UZXh0KHJhYywgcG9pbnQsICdibGFjayBxdWFydHonLCBmb3JtYXQpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclRleHQgPSByYWMuVGV4dCg1NSwgNzcsICdibGFjayBxdWFydHonLCBmb3JtYXQpXG4qXG4qIEBzZWUgW2ByYWMuVGV4dGBde0BsaW5rIFJhYyNUZXh0fVxuKiBAc2VlIFtgaW5zdGFuY2UuVGV4dGBde0BsaW5rIGluc3RhbmNlLlRleHR9XG4qXG4qIEBhbGlhcyBSYWMuVGV4dFxuKi9cbmNsYXNzIFRleHQge1xuXG4gIHN0YXRpYyBGb3JtYXQgPSBUZXh0Rm9ybWF0O1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFRleHRgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhY1xuICAqICAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50XG4gICogICBUaGUgbG9jYXRpb24gZm9yIHRoZSBkcmF3biB0ZXh0XG4gICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICAqICAgVGhlIHN0cmluZyB0byBkcmF3XG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IGZvcm1hdFxuICAqICAgVGhlIGZvcm1hdCBmb3IgdGhlIGRyYXduIHRleHRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpIHtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYywgcmFjKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgcG9pbnQpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhzdHJpbmcpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoVGV4dC5Gb3JtYXQsIGZvcm1hdCk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSB0ZXh0IHdpbGwgYmUgZHJhd24uXG4gICAgKlxuICAgICogVGhlIHRleHQgd2lsbCBiZSBkcmF3biByZWxhdGl2ZSB0byB0aGlzIHBvaW50IGJhc2VkIG9uIHRoZVxuICAgICogYWxpZ25tZW50IGFuZCBhbmdsZSBjb25maWd1cmF0aW9uIG9mXG4gICAgKiBbYGZvcm1hdGBde0BsaW5rIFJhYy5UZXh0I2Zvcm1hdH0uXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5Qb2ludH1cbiAgICAqL1xuICAgIHRoaXMucG9pbnQgPSBwb2ludDtcblxuICAgIC8qKlxuICAgICogVGhlIHN0cmluZyB0byBkcmF3LlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYWxpZ25tZW50LCBhbmdsZSwgZm9udCwgYW5kIHNpemUgdG8gdXNlIHRvIGRyYXcgdGhlIHRleHQuXG4gICAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAgICovXG4gICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuVGV4dCg1NSwgNzcsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6JykudG9TdHJpbmcoKVxuICAqIC8vIHJldHVybnMgJ1RleHQoKDU1LDc3KSBcInNwaGlueCBvZiBibGFjayBxdWFydHpcIiknXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucG9pbnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucG9pbnQueSwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFRleHQoKCR7eFN0cn0sJHt5U3RyfSkgXCIke3RoaXMuc3RyaW5nfVwiKWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGBzdHJpbmdgIGFuZCBgcG9pbnRgIG9mIGJvdGggdGV4dHMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclRleHRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuVGV4dGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIGBwb2ludGBzIGFyZSBjb21wYXJlZCB1c2luZyBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LlxuICAqXG4gICogVGhlIGBmb3JtYXRgIG9iamVjdHMgYXJlIGlnbm9yZWQgaW4gdGhpcyBjb21wYXJpc29uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuVGV4dH0gb3RoZXJUZXh0IC0gQSBgVGV4dGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJUZXh0KSB7XG4gICAgcmV0dXJuIG90aGVyVGV4dCBpbnN0YW5jZW9mIFRleHRcbiAgICAgICYmIHRoaXMuc3RyaW5nID09PSBvdGhlclRleHQuc3RyaW5nXG4gICAgICAmJiB0aGlzLnBvaW50LmVxdWFscyhvdGhlclRleHQucG9pbnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgd2l0aCBgZm9ybWF0LmFuZ2xlYCBzZXQgdG8gdGhlXG4gICogYEFuZ2xlYCBkZXJpdmVkIGZyb20gYG5ld0FuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhBbmdsZShuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggYGZvcm1hdC5mb250YCBzZXQgdG8gYG5ld0ZvbnRgLlxuICAqIEBwYXJhbSB7P1N0cmluZ30gbmV3Rm9udCAtIFRoZSBmb250IG5hbWUgZm9yIHRoZSBuZXcgYFRleHRgIGFuZFxuICAqICAgYFRleHQuRm9ybWF0YDsgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB3aXRoRm9udChuZXdGb250KSB7XG4gICAgY29uc3QgbmV3Rm9ybWF0ID0gdGhpcy5mb3JtYXQud2l0aEZvbnQobmV3Rm9udCk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggYGZvcm1hdC5zaXplYCBzZXQgdG8gYG5ld1NpemVgLlxuICAqIEBwYXJhbSB7P051bWJlcn0gbmV3U2l6ZSAtIFRoZSBmb250IHNpemUgZm9yIHRoZSBuZXcgYFRleHRgIGFuZFxuICAqICAgYFRleHQuRm9ybWF0YDsgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB3aXRoU2l6ZShuZXdTaXplKSB7XG4gICAgY29uc3QgbmV3Rm9ybWF0ID0gdGhpcy5mb3JtYXQud2l0aFNpemUobmV3U2l6ZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggcGFkZGluZ3Mgc2V0IHRvIHRoZSBnaXZlbiB2YWx1ZXMuXG4gICpcbiAgKiBXaGVuIG9ubHkgYGhQYWRkaW5nYCBpcyBwcm92aWRlZCwgdGhhdCB2YWx1ZSBpcyB1c2VkIGZvciBib3RoXG4gICogaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFkZGluZy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBoUGFkZGluZyAtIFRoZSBob3Jpem9udGFsIHBhZGRpbmcgZm9yIHRoZSBuZXcgYFRleHRgXG4gICogICBhbmQgYFRleHQuRm9ybWF0YFxuICAqIEBwYXJhbSB7TnVtYmVyfSBbdlBhZGRpbmddIC0gVGhlIHZlcnRpY2FsIHBhZGRpbmcgZm9yIHRoZSBuZXcgYFRleHRgXG4gICogICBhbmQgYFRleHQuRm9ybWF0YDsgd2hlbiBvbW1pdGVkLCBgaFBhZGRpbmdgIGlzIHVzZWQgaW5zdGVhZFxuICAqXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aFBhZGRpbmdzKGhQYWRkaW5nLCB2UGFkZGluZyA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoUGFkZGluZ3MoaFBhZGRpbmcsIHZQYWRkaW5nKTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCBuZXdGb3JtYXQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCB3aGljaCBpcyBhbiB1cHNpZGUtZG93biBlcXVpdmFsZW50IG9mIGB0aGlzYFxuICAqIGFuZCBnZW5lcmFsbHkgaW4gdGhlIHNhbWUgbG9jYXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBUZXh0YCBpcyBhdCB0aGUgc2FtZSBsb2NhdGlvbiBhcyBgdGhpc2AsIHVzaW5nIGFcbiAgKiBbcmV2ZXJzZWRde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNyZXZlcnNlfSBmb3JtYXQgYW5kIG9yaWVudGVkXG4gICogdG93YXJkcyB0aGUgW2ludmVyc2Vde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfSBvZiBgZm9ybWF0LmFuZ2xlYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBsZXQgcmV2ZXJzZUZvcm1hdCA9IHRoaXMuZm9ybWF0LnJldmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCByZXZlcnNlRm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdGhpc2Agb3IgYSBuZXcgYFRleHRgIGFuZCBgRm9ybWF0YCB0aGF0IHdpbGwgYWx3YXlzIGJlXG4gICogb3JpZW50ZWQgdG8gYmUgdXByaWdodCBhbmQgcmVhZGFibGUuXG4gICpcbiAgKiBSZXR1cm5zIGB0aGlzYCB3aGVuIFtgZm9ybWF0LmFuZ2xlYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2FuZ2xlfSB0dXJuXG4gICogdmFsdWUgaXMgYmV0d2VlbiBfWzMvNCwgMS80KV8sIHNpbmNlIGB0aGlzYCBpcyBhbiB1cHJpZ2h0IHRleHQgYWxyZWFkeTtcbiAgKiBvdGhlcml3c2UgW2B0aGlzLnJldmVyc2UoKWBdfXtAbGluayBSYWMuVGV4dCNyZXZlcnNlfSBpcyByZXR1cm5lZC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgdXByaWdodCgpIHtcbiAgICBpZiAodXRpbHMuaXNVcHJpZ2h0VGV4dCh0aGlzLmZvcm1hdC5hbmdsZS50dXJuKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKTtcbiAgICB9XG4gIH1cblxuXG59IC8vIGNsYXNzIFRleHRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuQW5nbGVgIGZ1bmN0aW9uXXtAbGluayBSYWMjQW5nbGV9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYEFuZ2xlYF17QGxpbmsgUmFjLkFuZ2xlfSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLkFuZ2xlLnF1YXJ0ZXIgLy8gcmVhZHktbWFkZSBxdWFydGVyIGFuZ2xlXG4qIHJhYy5BbmdsZS5xdWFydGVyLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5BbmdsZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQW5nbGUocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5BbmdsZWAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogQ2FsbHNge0BsaW5rIFJhYy5BbmdsZS5mcm9tfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbVxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ8UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhbiBgQW5nbGVgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tID0gZnVuY3Rpb24oc29tZXRoaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tKHJhYywgc29tZXRoaW5nKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHJhZGlhbnNgLlxuICAqXG4gICogQ2FsbHMgYHtAbGluayBSYWMuQW5nbGUuZnJvbVJhZGlhbnN9YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tUmFkaWFuc1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhbnMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIHJhZGlhbnNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21SYWRpYW5zXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZnJvbVJhZGlhbnMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgZGVncmVlc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tRGVncmVlc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21EZWdyZWVzXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlcyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gZGVncmVlc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbURlZ3JlZXNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tRGVncmVlcyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21EZWdyZWVzKHJhYywgZGVncmVlcyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMGAuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHJpZ2h0YCwgYHJgLCBgZWFzdGAsIGBlYC5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnplcm8gPSByYWMuQW5nbGUoMC4wKTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8yYC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgbGVmdGAsIGBsYCwgYHdlc3RgLCBgd2AsIGBpbnZlcnNlYC5cbiAgKlxuICAqIEBuYW1lIGhhbGZcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmhhbGYgPSByYWMuQW5nbGUoMS8yKTtcbiAgcmFjLkFuZ2xlLmludmVyc2UgPSByYWMuQW5nbGUuaGFsZjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS80YC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgZG93bmAsIGBkYCwgYGJvdHRvbWAsIGBiYCwgYHNvdXRoYCwgYHNgLCBgc3F1YXJlYC5cbiAgKlxuICAqIEBuYW1lIHF1YXJ0ZXJcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnF1YXJ0ZXIgPSByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLnNxdWFyZSA9ICByYWMuQW5nbGUucXVhcnRlcjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS84YC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYm90dG9tUmlnaHRgLCBgYnJgLCBgc2VgLlxuICAqXG4gICogQG5hbWUgZWlnaHRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5laWdodGggPSByYWMuQW5nbGUoMS84KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgNy84YCwgbmVnYXRpdmUgYW5nbGUgb2ZcbiAgKiBbYGVpZ2h0aGBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI2VpZ2h0aH0uXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYHRvcFJpZ2h0YCwgYHRyYCwgYG5lYC5cbiAgKlxuICAqIEBuYW1lIG5laWdodGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5laWdodGggPSByYWMuQW5nbGUoLTEvOCk7XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8xNmAuXG4gICpcbiAgKiBAbmFtZSBzaXh0ZWVudGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnNpeHRlZW50aCA9IHJhYy5BbmdsZSgxLzE2KTtcblxuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzEwYC5cbiAgKlxuICAqIEBuYW1lIHRlbnRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS50ZW50aCA9IHJhYy5BbmdsZSgxLzEwKTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMy80YC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgdXBgLCBgdWAsIGB0b3BgLCBgdGAuXG4gICpcbiAgKiBAbmFtZSBub3J0aFxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubm9ydGggPSByYWMuQW5nbGUoMy80KTtcbiAgcmFjLkFuZ2xlLmVhc3QgID0gcmFjLkFuZ2xlKDAvNCk7XG4gIHJhYy5BbmdsZS5zb3V0aCA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUud2VzdCAgPSByYWMuQW5nbGUoMi80KTtcblxuICByYWMuQW5nbGUuZSA9IHJhYy5BbmdsZS5lYXN0O1xuICByYWMuQW5nbGUucyA9IHJhYy5BbmdsZS5zb3V0aDtcbiAgcmFjLkFuZ2xlLncgPSByYWMuQW5nbGUud2VzdDtcbiAgcmFjLkFuZ2xlLm4gPSByYWMuQW5nbGUubm9ydGg7XG5cbiAgcmFjLkFuZ2xlLm5lID0gcmFjLkFuZ2xlLm4uYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zZSA9IHJhYy5BbmdsZS5lLmFkZCgxLzgpO1xuICByYWMuQW5nbGUuc3cgPSByYWMuQW5nbGUucy5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLm53ID0gcmFjLkFuZ2xlLncuYWRkKDEvOCk7XG5cbiAgLy8gTm9ydGggbm9ydGgtZWFzdFxuICByYWMuQW5nbGUubm5lID0gcmFjLkFuZ2xlLm5lLmFkZCgtMS8xNik7XG4gIC8vIEVhc3Qgbm9ydGgtZWFzdFxuICByYWMuQW5nbGUuZW5lID0gcmFjLkFuZ2xlLm5lLmFkZCgrMS8xNik7XG4gIC8vIE5vcnRoLWVhc3Qgbm9ydGhcbiAgcmFjLkFuZ2xlLm5lbiA9IHJhYy5BbmdsZS5ubmU7XG4gIC8vIE5vcnRoLWVhc3QgZWFzdFxuICByYWMuQW5nbGUubmVlID0gcmFjLkFuZ2xlLmVuZTtcblxuICAvLyBFYXN0IHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLmVzZSA9IHJhYy5BbmdsZS5zZS5hZGQoLTEvMTYpO1xuICAvLyBTb3V0aCBzb3V0aC1lYXN0XG4gIHJhYy5BbmdsZS5zc2UgPSByYWMuQW5nbGUuc2UuYWRkKCsxLzE2KTtcbiAgLy8gU291dGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5zZWUgPSByYWMuQW5nbGUuZXNlO1xuICAvLyBTb3V0aC1lYXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zZXMgPSByYWMuQW5nbGUuc3NlO1xuXG4gIC8vIFNvdXRoIHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLnNzdyA9IHJhYy5BbmdsZS5zdy5hZGQoLTEvMTYpO1xuICAvLyBXZXN0IHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLndzdyA9IHJhYy5BbmdsZS5zdy5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC13ZXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zd3MgPSByYWMuQW5nbGUuc3N3O1xuICAvLyBTb3V0aC13ZXN0IHdlc3RcbiAgcmFjLkFuZ2xlLnN3dyA9IHJhYy5BbmdsZS53c3c7XG5cbiAgLy8gV2VzdCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS53bncgPSByYWMuQW5nbGUubncuYWRkKC0xLzE2KTtcbiAgLy8gTm9ydGggbm9ydGgtd2VzdFxuICByYWMuQW5nbGUubm53ID0gcmFjLkFuZ2xlLm53LmFkZCgrMS8xNik7XG4gIC8vIE5vcnQtaHdlc3Qgd2VzdFxuICByYWMuQW5nbGUubnd3ID0gcmFjLkFuZ2xlLndudztcbiAgLy8gTm9ydGgtd2VzdCBub3J0aFxuICByYWMuQW5nbGUubnduID0gcmFjLkFuZ2xlLm5udztcblxuICByYWMuQW5nbGUucmlnaHQgPSByYWMuQW5nbGUuZTtcbiAgcmFjLkFuZ2xlLmRvd24gID0gcmFjLkFuZ2xlLnM7XG4gIHJhYy5BbmdsZS5sZWZ0ICA9IHJhYy5BbmdsZS53O1xuICByYWMuQW5nbGUudXAgICAgPSByYWMuQW5nbGUubjtcblxuICByYWMuQW5nbGUuciA9IHJhYy5BbmdsZS5yaWdodDtcbiAgcmFjLkFuZ2xlLmQgPSByYWMuQW5nbGUuZG93bjtcbiAgcmFjLkFuZ2xlLmwgPSByYWMuQW5nbGUubGVmdDtcbiAgcmFjLkFuZ2xlLnUgPSByYWMuQW5nbGUudXA7XG5cbiAgcmFjLkFuZ2xlLnRvcCAgICA9IHJhYy5BbmdsZS51cDtcbiAgcmFjLkFuZ2xlLmJvdHRvbSA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUudCAgICAgID0gcmFjLkFuZ2xlLnRvcDtcbiAgcmFjLkFuZ2xlLmIgICAgICA9IHJhYy5BbmdsZS5ib3R0b207XG5cbiAgcmFjLkFuZ2xlLnRvcFJpZ2h0ICAgID0gcmFjLkFuZ2xlLm5lO1xuICByYWMuQW5nbGUudHIgICAgICAgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50b3BMZWZ0ICAgICA9IHJhYy5BbmdsZS5udztcbiAgcmFjLkFuZ2xlLnRsICAgICAgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUuYm90dG9tUmlnaHQgPSByYWMuQW5nbGUuc2U7XG4gIHJhYy5BbmdsZS5iciAgICAgICAgICA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJvdHRvbUxlZnQgID0gcmFjLkFuZ2xlLnN3O1xuICByYWMuQW5nbGUuYmwgICAgICAgICAgPSByYWMuQW5nbGUuc3c7XG5cbn0gLy8gYXR0YWNoUmFjQW5nbGVcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5BcmNgIGZ1bmN0aW9uXXtAbGluayBSYWMjQXJjfS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BBcmNgIG9iamVjdHNde0BsaW5rIFJhYy5BcmN9IGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLkFyYy56ZXJvIC8vIHJlYWR5LW1hZGUgemVybyBhcmNcbiogcmFjLkFyYy56ZXJvLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5BcmNcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FyYyhyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG4gIC8vXG4gIC8vIFRoZSBmdW5jdGlvbiBgcmFjLkFyY2AgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGNsb2Nrd2lzZSBgQXJjYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5BcmN9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFyYyNcbiAgKi9cbiAgcmFjLkFyYy56ZXJvID0gcmFjLkFyYygwLCAwLCAwLCAwLCAwLCB0cnVlKTtcblxufSAvLyBhdHRhY2hSYWNBcmNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkJlemllcmAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQmV6aWVyfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQmV6aWVyXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hJbnN0YW5jZUJlemllcihyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG4gIC8vXG4gIC8vIFRoZSBmdW5jdGlvbiBgcmFjLkJlemllcmAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGBCZXppZXJgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLkJlemllcn1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQmV6aWVyI1xuICAqL1xuICByYWMuQmV6aWVyLnplcm8gPSByYWMuQmV6aWVyKFxuICAgIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoSW5zdGFuY2VCZXppZXJcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5Qb2ludGAgZnVuY3Rpb25de0BsaW5rIFJhYyNQb2ludH0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgUG9pbnRgXXtAbGluayBSYWMuUG9pbnR9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuUG9pbnQub3JpZ2luIC8vIHJlYWR5LW1hZGUgb3JpZ2luIHBvaW50XG4qIHJhYy5Qb2ludC5vcmlnaW4ucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlBvaW50XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNQb2ludChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG4gIC8vXG4gIC8vIFRoZSBmdW5jdGlvbiBgcmFjLlBvaW50YCBpcyBhdHRhY2hlZCBpbiBgYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMuanNgLlxuXG4gIC8qKlxuICAqIEEgYFBvaW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUG9pbnQjXG4gICovXG4gIHJhYy5Qb2ludC56ZXJvID0gcmFjLlBvaW50KDAsIDApO1xuXG4gIC8qKlxuICAqIEEgYFBvaW50YCBhdCBgKDAsIDApYC5cbiAgKlxuICAqIEVxdWFsIHRvIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfS5cbiAgKlxuICAqIEBuYW1lIG9yaWdpblxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQub3JpZ2luID0gcmFjLlBvaW50Lnplcm87XG5cblxufSAvLyBhdHRhY2hSYWNQb2ludFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlJheWAgZnVuY3Rpb25de0BsaW5rIFJhYyNSYXl9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYFJheWBde0BsaW5rIFJhYy5SYXl9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuUmF5LnhBeGlzIC8vIHJlYWR5LW1hZGUgeC1heGlzIHJheVxuKiByYWMuUmF5LnhBeGlzLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5SYXlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1JheShyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG4gIC8vXG4gIC8vIFRoZSBmdW5jdGlvbiBgcmFjLlJheWAgaXMgYXR0YWNoZWQgaW4gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuICAvKipcbiAgKiBBIGBSYXlgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVybywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQuemVyb2Bde0BsaW5rIGluc3RhbmNlLlBvaW50I3plcm99IGFuZCBwb2ludHMgdG9cbiAgKiBbYHJhYy5BbmdsZS56ZXJvYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb30uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKi9cbiAgcmFjLlJheS56ZXJvID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUuemVybyk7XG5cblxuICAvKipcbiAgKiBBIGBSYXlgIG92ZXIgdGhlIHgtYXhpcywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQub3JpZ2luYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjb3JpZ2lufSBhbmQgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99LlxuICAqXG4gICogRXF1YWwgdG8gW2ByYWMuUmF5Lnplcm9gXXtAbGluayBpbnN0YW5jZS5SYXkjemVyb30uXG4gICpcbiAgKiBAbmFtZSB4QXhpc1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICovXG4gIHJhYy5SYXkueEF4aXMgPSByYWMuUmF5Lnplcm87XG5cblxuICAvKipcbiAgKiBBIGBSYXlgIG92ZXIgdGhlIHktYXhpcywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQub3JpZ2luYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjb3JpZ2lufSBhbmQgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUucXVhcnRlcmBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9LlxuICAqXG4gICogQG5hbWUgeUF4aXNcbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqL1xuICByYWMuUmF5LnlBeGlzID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUucXVhcnRlcik7XG5cbn0gLy8gYXR0YWNoUmFjUmF5XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuU2VnbWVudGAgZnVuY3Rpb25de0BsaW5rIFJhYyNTZWdtZW50fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BTZWdtZW50YF17QGxpbmsgUmFjLlNlZ21lbnR9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGhcbiogdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuU2VnbWVudC56ZXJvIC8vIHJlYWR5LW1hZGUgemVybyBzZWdtZW50XG4qIHJhYy5TZWdtZW50Lnplcm8ucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlNlZ21lbnRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1NlZ21lbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5TZWdtZW50YCBpcyBhdHRhY2hlZCBpbiBgYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMuanNgLlxuXG4gIC8qKlxuICAqIEEgYFNlZ21lbnRgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVybywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQuemVyb2Bde0BsaW5rIGluc3RhbmNlLlBvaW50I3plcm99LCBwb2ludHMgdG9cbiAgKiBbYHJhYy5BbmdsZS56ZXJvYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb30sIGFuZCBoYXMgYSBsZW5ndGggb2ZcbiAgKiB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuU2VnbWVudH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU2VnbWVudCNcbiAgKi9cbiAgcmFjLlNlZ21lbnQuemVybyA9IHJhYy5TZWdtZW50KDAsIDAsIDAsIDApO1xuXG59IC8vIGF0dGFjaFJhY1NlZ21lbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuICAqIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4gICogW2ByYWMuVGV4dC5Gb3JtYXRgIGZ1bmN0aW9uXXtAbGluayBSYWMjVGV4dEZvcm1hdH0uXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuICAqIFtgVGV4dC5Gb3JtYXRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsXG4gICogc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogcmFjLlRleHQuRm9ybWF0LnRvcExlZnQgLy8gcmVhZHktbWFkZSB0b3AtbGVmdCB0ZXh0IGZvcm1hdFxuICAqIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0LnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBuYW1lc3BhY2UgaW5zdGFuY2UuVGV4dC5Gb3JtYXRcbiAgKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjVGV4dEZvcm1hdChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG4gIC8vXG4gIC8vIFRoZSBmdW5jdGlvbiBgcmFjLlRleHRGb3JtYXRgIGFuZCBgcmFjLlRleHQuRm9ybWF0YCBhcmUgYXR0YWNoZWQgaW5cbiAgLy8gYGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zLmpzYC5cblxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVG9wcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG8gdGhlXG4gICogdG9wLWxlZnQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgdGxgLlxuICAqXG4gICogQG5hbWUgdG9wTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24udG9wKTtcbiAgcmFjLlRleHQuRm9ybWF0LnRsID0gcmFjLlRleHQuRm9ybWF0LnRvcExlZnQ7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgY2VudGVyLWxlZnQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgdGNgLlxuICAqXG4gICogQG5hbWUgdG9wQ2VudGVyXG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC50b3BDZW50ZXIgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5jZW50ZXIsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24udG9wKTtcbiAgcmFjLlRleHQuRm9ybWF0LnRjID0gcmFjLlRleHQuRm9ybWF0LnRvcENlbnRlcjtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBjZW50ZXItcmlnaHQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgdHJgLlxuICAqXG4gICogQG5hbWUgdG9wUmlnaHRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LnRvcFJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24udG9wKTtcbiAgcmFjLlRleHQuRm9ybWF0LnRyID0gcmFjLlRleHQuRm9ybWF0LnRvcFJpZ2h0O1xuXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDZW50ZXJzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBjZW50ZXItbGVmdCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBjbGAuXG4gICpcbiAgKiBAbmFtZSBjZW50ZXJMZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJMZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIpO1xuICByYWMuVGV4dC5Gb3JtYXQuY2wgPSByYWMuVGV4dC5Gb3JtYXQuY2VudGVyTGVmdDtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBjZW50ZXIgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGNjYCwgYGNlbnRlcmVkYC5cbiAgKlxuICAqIEBuYW1lIGNlbnRlckNlbnRlclxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyQ2VudGVyID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24uY2VudGVyLFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcik7XG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJlZCA9IHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJDZW50ZXI7XG4gIHJhYy5UZXh0LkZvcm1hdC5jYyAgICAgICA9IHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJDZW50ZXI7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gdG9cbiAgKiB0aGUgY2VudGVyLXJpZ2h0IG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBjcmAuXG4gICpcbiAgKiBAbmFtZSBjZW50ZXJSaWdodFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIpO1xuICByYWMuVGV4dC5Gb3JtYXQuY3IgPSByYWMuVGV4dC5Gb3JtYXQuY2VudGVyUmlnaHQ7XG5cblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEJvdHRvbXMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGJvdHRvbS1sZWZ0IG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBibGAuXG4gICpcbiAgKiBAbmFtZSBib3R0b21MZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5ib3R0b21MZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20pO1xuICByYWMuVGV4dC5Gb3JtYXQuYmwgPSByYWMuVGV4dC5Gb3JtYXQuYm90dG9tTGVmdDtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBib3R0b20tY2VudGVyIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXM6IGBiY2AuXG4gICpcbiAgKiBAbmFtZSBib3R0b21DZW50ZXJcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJvdHRvbUNlbnRlciA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmNlbnRlcixcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20pO1xuICByYWMuVGV4dC5Gb3JtYXQuYmMgPSByYWMuVGV4dC5Gb3JtYXQuYm90dG9tQ2VudGVyO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGJvdHRvbS1yaWdodCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYnJgLlxuICAqXG4gICogQG5hbWUgYm90dG9tUmlnaHRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJvdHRvbVJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tKTtcbiAgcmFjLlRleHQuRm9ybWF0LmJyID0gcmFjLlRleHQuRm9ybWF0LmJvdHRvbVJpZ2h0O1xuXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCYXNlbGluZXMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSB0b1xuICAqIHRoZSBiYXNlbGluZSBhbmQgbGVmdCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYmxsYC5cbiAgKlxuICAqIEBuYW1lIGJhc2VsaW5lTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYmFzZWxpbmVMZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5iYXNlbGluZSk7XG4gIHJhYy5UZXh0LkZvcm1hdC5ibGwgPSByYWMuVGV4dC5Gb3JtYXQuYmFzZWxpbmVMZWZ0O1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGJhc2VsaW5lIGFuZCBjZW50ZXIgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGJsY2AuXG4gICpcbiAgKiBAbmFtZSBiYXNlbGluZUNlbnRlclxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYmFzZWxpbmVDZW50ZXIgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5jZW50ZXIsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYmFzZWxpbmUpO1xuICByYWMuVGV4dC5Gb3JtYXQuYmxjID0gcmFjLlRleHQuRm9ybWF0LmJhc2VsaW5lQ2VudGVyO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvXG4gICogdGhlIGJhc2VsaW5lIGFuZCByaWdodCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgYmxyYC5cbiAgKlxuICAqIEBuYW1lIGJhc2VsaW5lUmlnaHRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJhc2VsaW5lUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5iYXNlbGluZSk7XG4gIHJhYy5UZXh0LkZvcm1hdC5ibHIgPSByYWMuVGV4dC5Gb3JtYXQuYmFzZWxpbmVSaWdodDtcblxufSAvLyBhdHRhY2hSYWNUZXh0Rm9ybWF0XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuVGV4dGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuVGV4dC5oZWxsbyAvLyByZWFkeS1tYWRlIGhlbGxvLXdvcmxkIHRleHRcbiogcmFjLlRleHQuaGVsbG8ucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxuICAvL1xuICAvLyBUaGUgZnVuY3Rpb24gYHJhYy5UZXh0YCBpcyBhdHRhY2hlZCBpbiBgYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMuanNgLlxuXG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgYGhlbGxvIHdvcmxkYCB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXRcbiAgKiBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgaGVsbG9cbiAgKiBAdHlwZSB7UmFjLlRleHR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LmhlbGxvID0gcmFjLlRleHQoMCwgMCwgJ2hlbGxvIHdvcmxkIScpO1xuXG4gIC8qKlxuICAqIEEgYFRleHRgIGZvciBkcmF3aW5nIHRoZSBwYW5ncmFtIGBzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3dgXG4gICogd2l0aCBgdG9wTGVmdGAgZm9ybWF0IGF0IGBQb2ludC56ZXJvYC5cbiAgKiBAbmFtZSBzcGhpbnhcbiAgKiBAdHlwZSB7UmFjLlRleHR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LnNwaGlueCA9IHJhYy5UZXh0KDAsIDAsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3cnKTtcblxufSAvLyBhdHRhY2hSYWNUZXh0XG5cbiIsIlxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3RlbXBsYXRlcy9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbWRqcy9hbWRqcy1hcGkvYmxvYi9tYXN0ZXIvQU1ELm1kXG4gICAgLy8gaHR0cHM6Ly9yZXF1aXJlanMub3JnL2RvY3Mvd2h5YW1kLmh0bWxcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIEFNRCAtIGRlZmluZToke3R5cGVvZiBkZWZpbmV9YCk7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIE5vZGUgLSBtb2R1bGU6JHt0eXBlb2YgbW9kdWxlfWApO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG5cbiAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGludG8gc2VsZiAtIHJvb3Q6JHt0eXBlb2Ygcm9vdH1gKTtcbiAgcm9vdC5SYWMgPSBmYWN0b3J5KCk7XG5cbn0odHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4gcmVxdWlyZSgnLi9SYWMnKTtcblxufSkpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRHJhd2VyIHRoYXQgdXNlcyBhIFtQNV0oaHR0cHM6Ly9wNWpzLm9yZy8pIGluc3RhbmNlIGZvciBhbGwgZHJhd2luZ1xuKiBvcGVyYXRpb25zLlxuKlxuKiBAYWxpYXMgUmFjLlA1RHJhd2VyXG4qL1xuY2xhc3MgUDVEcmF3ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgcDUpe1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMucDUgPSBwNTtcbiAgICB0aGlzLmRyYXdSb3V0aW5lcyA9IFtdO1xuICAgIHRoaXMuZGVidWdSb3V0aW5lcyA9IFtdO1xuICAgIHRoaXMuYXBwbHlSb3V0aW5lcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB1c2VkIGZvciBkZWJ1ZyBkcmF3aW5nLCB3aGVuIGBudWxsYCB0aGUgc3R5bGUgYWxyZWFkeSBhcHBsaWVkXG4gICAgKiBpcyB1c2VkLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRlYnVnU3R5bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB1c2VkIGZvciB0ZXh0IGZvciBkZWJ1ZyBkcmF3aW5nLCB3aGVuIGBudWxsYCB0aGUgc3R5bGUgYWxyZWFkeVxuICAgICogYXBwbGllZCBpcyB1c2VkLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRlYnVnVGV4dFN0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU2V0dGluZ3MgdXNlZCBieSB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgZHJhd2FibGUuZGVidWcoKWAuXG4gICAgKlxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZvbnQ9J21vbm9zcGFjZSdcbiAgICAqICAgRm9udCB0byB1c2Ugd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gW3NpemU9W3JhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZV17QGxpbmsgUmFjI3RleHRGb3JtYXREZWZhdWx0c31dXG4gICAgKiAgIEZvbnQgc2l6ZSB0byB1c2Ugd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gZml4ZWREaWdpdHM9MlxuICAgICogICBOdW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gcHJpbnQgd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKlxuICAgICogQHR5cGUge09iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdUZXh0T3B0aW9ucyA9IHtcbiAgICAgIGZvbnQ6ICdtb25vc3BhY2UnLFxuICAgICAgLy8gVE9ETzogZG9jdW1lbnRhdGlvbiBkaXNwbGF5cyB0aGlzIGFzIGJlaW5nIG9wdGlvbmFsXG4gICAgICAvLyBpbiBvcmRlciB0byBtYWtlIHRoZSBsaW5rIHdvcmsgaXQgaGFzIHRvIGJlIHdyYXBwZWQgaW4gW10sXG4gICAgICAvLyB3aGljaCBtYWtlcyBpdCBhbiBvcHRpb25hbFxuICAgICAgc2l6ZTogcmFjLnRleHRGb3JtYXREZWZhdWx0cy5zaXplLFxuICAgICAgZml4ZWREaWdpdHM6IDJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKiBSYWRpdXMgb2YgcG9pbnQgbWFya2VycyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAyMlxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1BvaW50UmFkaXVzID0gNTtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHRoZSBtYWluIHZpc3VhbCBlbGVtZW50cyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAyMlxuICAgICovXG4gICAgdGhpcy5kZWJ1Z01hcmtlclJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBGYWN0b3IgYXBwbGllZCB0byBzdHJva2Ugd2VpZ2h0IHNldHRpbmcuIFN0cm9rZSB3ZWlnaHQgaXMgc2V0IHRvXG4gICAgKiBgc3Ryb2tlLndlaWdodCAqIHN0cm9rZVdlaWdodEZhY3RvcmAgd2hlbiBhcHBsaWNhYmxlLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnN0cm9rZVdlaWdodEZhY3RvciA9IDE7XG5cbiAgICB0aGlzLnNldHVwQWxsRHJhd0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxBcHBseUZ1bmN0aW9ucygpO1xuICAgIC8vIFRPRE86IGFkZCBhIGN1c3RvbWl6ZWQgZnVuY3Rpb24gZm9yIG5ldyBjbGFzc2VzIVxuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIHRoZSBnaXZlbiBgZHJhd0Z1bmN0aW9uYCB0byBwZXJmb3JtIHRoZSBkcmF3aW5nIGZvciBpbnN0YW5jZXMgb2ZcbiAgKiBjbGFzcyBgZHJhd2FibGVDbGFzc2AuXG4gICpcbiAgKiBgZHJhd0Z1bmN0aW9uYCBpcyBleHBlY3RlZCB0byBoYXZlIHRoZSBzaWduYXR1cmU6XG4gICogYGBgXG4gICogZHJhd0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcylcbiAgKiBgYGBcbiAgKiArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAqICsgYG9iamVjdE9mQ2xhc3M6IGRyYXdhYmxlQ2xhc3NgIC0gSW5zdGFuY2Ugb2YgYGRyYXdhYmxlQ2xhc3NgIHRvIGRyYXdcbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyBvZiB0aGUgaW5zdGFuY2VzIHRvIGRyYXdcbiAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkcmF3RnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGRyYXdpbmdcbiAgKi9cbiAgc2V0RHJhd0Z1bmN0aW9uKGRyYXdhYmxlQ2xhc3MsIGRyYXdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gZHJhd2FibGVDbGFzcyk7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERyYXdSb3V0aW5lKGRyYXdhYmxlQ2xhc3MsIGRyYXdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRyYXdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIHNldERyYXdPcHRpb25zKGNsYXNzT2JqLCBvcHRpb25zKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlcXVpcmVzUHVzaFBvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9IG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wO1xuICAgIH1cbiAgfVxuXG5cbiAgc2V0Q2xhc3NEcmF3U3R5bGUoY2xhc3NPYmosIHN0eWxlKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIHJvdXRpbmUuc3R5bGUgPSBzdHlsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZ2l2ZW4gYGRlYnVnRnVuY3Rpb25gIHRvIHBlcmZvcm0gdGhlIGRlYnVnLWRyYXdpbmcgZm9yXG4gICogaW5zdGFuY2VzIG9mIGNsYXNzIGBkcmF3YWJsZUNsYXNzYC5cbiAgKlxuICAqIFdoZW4gYSBkcmF3YWJsZSBjbGFzcyBkb2VzIG5vdCBoYXZlIGEgYGRlYnVnRnVuY3Rpb25gIHNldHVwLCBjYWxsaW5nXG4gICogYGRyYXdhYmxlLmRlYnVnKClgIHNpbXBseSBjYWxscyBgZHJhdygpYCB3aXRoXG4gICogYFtkZWJ1Z1N0eWxlXXtAbGluayBSYWMuUDVEcmF3ZXIjZGVidWdTdHlsZX1gIGFwcGxpZWQuXG4gICpcbiAgKiBgZGVidWdGdW5jdGlvbmAgaXMgZXhwZWN0ZWQgdG8gaGF2ZSB0aGUgc2lnbmF0dXJlOlxuICAqIGBgYFxuICAqIGRlYnVnRnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzLCBkcmF3c1RleHQpXG4gICogYGBgXG4gICogKyBgZHJhd2VyOiBQNURyYXdlcmAgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmdcbiAgKiArIGBvYmplY3RPZkNsYXNzOiBkcmF3YWJsZUNsYXNzYCAtIEluc3RhbmNlIG9mIGBkcmF3YWJsZUNsYXNzYCB0byBkcmF3XG4gICogKyBgZHJhd3NUZXh0OiBib29sYCAtIFdoZW4gYHRydWVgIHRleHQgc2hvdWxkIGJlIGRyYXduIHdpdGhcbiAgKiAgICBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtjbGFzc30gZHJhd2FibGVDbGFzcyAtIENsYXNzIG9mIHRoZSBpbnN0YW5jZXMgdG8gZHJhd1xuICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlYnVnRnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGRlYnVnLWRyYXdpbmdcbiAgKi9cbiAgc2V0RGVidWdGdW5jdGlvbihkcmF3YWJsZUNsYXNzLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gZHJhd2FibGVDbGFzcyk7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERlYnVnUm91dGluZShkcmF3YWJsZUNsYXNzLCBkZWJ1Z0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZGVidWdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cblxuICAvLyBBZGRzIGEgQXBwbHlSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldEFwcGx5RnVuY3Rpb24oY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IEFwcGx5Um91dGluZShjbGFzc09iaiwgYXBwbHlGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5hcHBseVJvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVJvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIGRyYXdPYmplY3Qob2JqZWN0LCBzdHlsZSA9IG51bGwpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBkcmF3IG9iamVjdCAtIG9iamVjdC10eXBlOiR7dXRpbHMudHlwZU5hbWUob2JqZWN0KX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0VG9EcmF3O1xuICAgIH1cblxuICAgIGlmIChyb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9PT0gdHJ1ZVxuICAgICAgfHwgc3R5bGUgIT09IG51bGxcbiAgICAgIHx8IHJvdXRpbmUuc3R5bGUgIT09IG51bGwpXG4gICAge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICBpZiAocm91dGluZS5zdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICByb3V0aW5lLnN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwdXNoLXB1bGxcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgfVxuICB9XG5cblxuICBkZWJ1Z09iamVjdChvYmplY3QsIGRyYXdzVGV4dCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHJvdXRpbmUsIGp1c3QgZHJhdyBvYmplY3Qgd2l0aCBkZWJ1ZyBzdHlsZVxuICAgICAgdGhpcy5kcmF3T2JqZWN0KG9iamVjdCwgdGhpcy5kZWJ1Z1N0eWxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIHRoaXMuZGVidWdTdHlsZS5hcHBseSgpO1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uKHRoaXMsIG9iamVjdCwgZHJhd3NUZXh0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgfVxuICB9XG5cblxuICBhcHBseU9iamVjdChvYmplY3QpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuYXBwbHlSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgYXBwbHkgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0FwcGx5O1xuICAgIH1cblxuICAgIHJvdXRpbmUuYXBwbHlGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICB9XG5cblxuICAvLyBTZXRzIHVwIGFsbCBkcmF3aW5nIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGFuZCBzdGF0aWMgZnVuY3Rpb25zIGluIHJlbGV2YW50XG4gIC8vIGNsYXNzZXMuXG4gIHNldHVwQWxsRHJhd0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kcmF3LmZ1bmN0aW9ucycpO1xuXG4gICAgLy8gUG9pbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kcmF3UG9pbnQpO1xuICAgIHJlcXVpcmUoJy4vUG9pbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gUmF5XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRyYXdSYXkpO1xuICAgIHJlcXVpcmUoJy4vUmF5LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFNlZ21lbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRyYXdTZWdtZW50KTtcbiAgICByZXF1aXJlKCcuL1NlZ21lbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gQXJjXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRyYXdBcmMpO1xuXG4gICAgUmFjLkFyYy5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgICAgbGV0IGJlemllcnNQZXJUdXJuID0gNTtcbiAgICAgIGxldCBkaXZpc2lvbnMgPSBNYXRoLmNlaWwoYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgKiBiZXppZXJzUGVyVHVybik7XG4gICAgICB0aGlzLmRpdmlkZVRvQmV6aWVycyhkaXZpc2lvbnMpLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBUZXh0XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlRleHQsIGZ1bmN0aW9ucy5kcmF3VGV4dCk7XG4gICAgLy8gVGV4dCBkcmF3aW5nIHVzZXMgYHRleHQuZm9ybWF0LmFwcGx5YCwgd2hpY2ggdHJhbnNsYXRlIGFuZCByb3RhdGlvblxuICAgIC8vIG1vZGlmaWNhdGlvbnMgdG8gdGhlIGRyYXdpbmcgbWF0cml4XG4gICAgLy8gdGhpcyByZXF1aXJlcyBhIHB1c2gtcG9wIG9uIGV2ZXJ5IGRyYXdcbiAgICB0aGlzLnNldERyYXdPcHRpb25zKFJhYy5UZXh0LCB7cmVxdWlyZXNQdXNoUG9wOiB0cnVlfSk7XG5cbiAgICAvLyBCZXppZXJcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQmV6aWVyLCAoZHJhd2VyLCBiZXppZXIpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZXppZXIoXG4gICAgICAgIGJlemllci5zdGFydC54LCBiZXppZXIuc3RhcnQueSxcbiAgICAgICAgYmV6aWVyLnN0YXJ0QW5jaG9yLngsIGJlemllci5zdGFydEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kQW5jaG9yLngsIGJlemllci5lbmRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZC54LCBiZXppZXIuZW5kLnkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkJlemllci5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0YXJ0LnZlcnRleCgpXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuYmV6aWVyVmVydGV4KFxuICAgICAgICB0aGlzLnN0YXJ0QW5jaG9yLngsIHRoaXMuc3RhcnRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmRBbmNob3IueCwgdGhpcy5lbmRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmQueCwgdGhpcy5lbmQueSk7XG4gICAgfTtcblxuICAgIC8vIENvbXBvc2l0ZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Db21wb3NpdGUsIChkcmF3ZXIsIGNvbXBvc2l0ZSkgPT4ge1xuICAgICAgY29tcG9zaXRlLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG4gICAgfSk7XG5cbiAgICBSYWMuQ29tcG9zaXRlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0udmVydGV4KCkpO1xuICAgIH07XG5cbiAgICAvLyBTaGFwZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TaGFwZSwgKGRyYXdlciwgc2hhcGUpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZWdpblNoYXBlKCk7XG4gICAgICBzaGFwZS5vdXRsaW5lLnZlcnRleCgpO1xuXG4gICAgICBpZiAoc2hhcGUuY29udG91ci5pc05vdEVtcHR5KCkpIHtcbiAgICAgICAgZHJhd2VyLnA1LmJlZ2luQ29udG91cigpO1xuICAgICAgICBzaGFwZS5jb250b3VyLnZlcnRleCgpO1xuICAgICAgICBkcmF3ZXIucDUuZW5kQ29udG91cigpO1xuICAgICAgfVxuICAgICAgZHJhd2VyLnA1LmVuZFNoYXBlKCk7XG4gICAgfSk7XG5cbiAgICBSYWMuU2hhcGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vdXRsaW5lLnZlcnRleCgpO1xuICAgICAgdGhpcy5jb250b3VyLnZlcnRleCgpO1xuICAgIH07XG4gIH0gLy8gc2V0dXBBbGxEcmF3RnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBkZWJ1ZyByb3V0aW5lcyBmb3IgcmFjIGRyYXdhYmxlIGNsYXNlcy5cbiAgc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kZWJ1Zy5mdW5jdGlvbnMnKTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlBvaW50LCBmdW5jdGlvbnMuZGVidWdQb2ludCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5SYXksIGZ1bmN0aW9ucy5kZWJ1Z1JheSk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5TZWdtZW50LCBmdW5jdGlvbnMuZGVidWdTZWdtZW50KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRlYnVnQXJjKTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlRleHQsIGZ1bmN0aW9ucy5kZWJ1Z1RleHQpO1xuXG4gICAgLy8gUmV0dXJucyBjYWxsaW5nIGFuZ2xlXG4gICAgUmFjLkFuZ2xlLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKHBvaW50LCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgY29uc3QgZHJhd2VyID0gdGhpcy5yYWMuZHJhd2VyO1xuICAgICAgaWYgKGRyYXdlci5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5wdXNoKCk7XG4gICAgICAgIGRyYXdlci5kZWJ1Z1N0eWxlLmFwcGx5KCk7XG4gICAgICAgIC8vIFRPRE86IGNvdWxkIHRoaXMgYmUgYSBnb29kIG9wdGlvbiB0byBpbXBsZW1lbnQgc3BsYXR0aW5nIGFyZ3VtZW50c1xuICAgICAgICAvLyBpbnRvIHRoZSBkZWJ1Z0Z1bmN0aW9uP1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgICBkcmF3ZXIucDUucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgY2FsbGluZyBwb2ludFxuICAgIFJhYy5Qb2ludC5wcm90b3R5cGUuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICAgIGFuZ2xlLmRlYnVnKHRoaXMsIGRyYXdzVGV4dCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9IC8vIHNldHVwQWxsRGVidWdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGFwcGx5aW5nIHJvdXRpbmVzIGZvciByYWMgc3R5bGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGZ1bmN0aW9ucyBpbiByZWxldmFudCBjbGFzc2VzLlxuICBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCkge1xuICAgIC8vIENvbG9yIHByb3RvdHlwZSBmdW5jdGlvbnNcbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5QmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJhY2tncm91bmQodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuZmlsbCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5U3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuc3Ryb2tlKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIC8vIFN0cm9rZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3Ryb2tlLCAoZHJhd2VyLCBzdHJva2UpID0+IHtcbiAgICAgIGlmIChzdHJva2Uud2VpZ2h0ID09PSBudWxsICYmIHN0cm9rZS5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9TdHJva2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLmNvbG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0cm9rZS5jb2xvci5hcHBseVN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUuc3Ryb2tlV2VpZ2h0KHN0cm9rZS53ZWlnaHQgKiBkcmF3ZXIuc3Ryb2tlV2VpZ2h0RmFjdG9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZpbGxcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLkZpbGwsIChkcmF3ZXIsIGZpbGwpID0+IHtcbiAgICAgIGlmIChmaWxsLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5ub0ZpbGwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaWxsLmNvbG9yLmFwcGx5RmlsbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3R5bGVDb250YWluZXJcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0eWxlQ29udGFpbmVyLCAoZHJhd2VyLCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5hcHBseSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBUZXh0LkZvcm1hdFxuICAgIC8vIEFwcGxpZXMgYWxsIHRleHQgcHJvcGVydGllcyBhbmQgdHJhbnNsYXRlcyB0byB0aGUgZ2l2ZW4gYHBvaW50YC5cbiAgICAvLyBBZnRlciB0aGUgZm9ybWF0IGlzIGFwcGxpZWQgdGhlIHRleHQgc2hvdWxkIGJlIGRyYXduIGF0IHRoZSBvcmlnaW4uXG4gICAgLy9cbiAgICAvLyBDYWxsaW5nIHRoaXMgZnVuY3Rpb24gcmVxdWlyZXMgYSBwdXNoLXBvcCB0byB0aGUgZHJhd2luZyBzdHlsZVxuICAgIC8vIHNldHRpbmdzIHNpbmNlIHRyYW5zbGF0ZSBhbmQgcm90YXRpb24gbW9kaWZpY2F0aW9ucyBhcmUgbWFkZSB0byB0aGVcbiAgICAvLyBkcmF3aW5nIG1hdHJpeC4gT3RoZXJ3aXNlIGFsbCBvdGhlciBzdWJzZXF1ZW50IGRyYXdpbmcgd2lsbCBiZVxuICAgIC8vIGltcGFjdGVkLlxuICAgIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbihwb2ludCkge1xuICAgICAgbGV0IGhBbGlnbjtcbiAgICAgIGxldCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gICAgICBzd2l0Y2ggKHRoaXMuaEFsaWduKSB7XG4gICAgICAgIGNhc2UgaEVudW0ubGVmdDogICBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuTEVGVDsgICBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5jZW50ZXI6IGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5DRU5URVI7IGJyZWFrO1xuICAgICAgICBjYXNlIGhFbnVtLnJpZ2h0OiAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlJJR0hUOyAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBoQWxpZ24gY29uZmlndXJhdGlvbiAtIGhBbGlnbjoke3RoaXMuaEFsaWdufWApO1xuICAgICAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICAgIH1cblxuICAgICAgbGV0IHZBbGlnbjtcbiAgICAgIGxldCB2RW51bSA9IFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduO1xuICAgICAgc3dpdGNoICh0aGlzLnZBbGlnbikge1xuICAgICAgICBjYXNlIHZFbnVtLnRvcDogICAgICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuVE9QOyAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTogICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQk9UVE9NOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjogICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOiB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQkFTRUxJTkU7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgdkFsaWduIGNvbmZpZ3VyYXRpb24gLSB2QWxpZ246JHt0aGlzLnZBbGlnbn1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIC8vIEFsaWduXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dEFsaWduKGhBbGlnbiwgdkFsaWduKTtcblxuICAgICAgLy8gU2l6ZVxuICAgICAgY29uc3QgdGV4dFNpemUgPSB0aGlzLnNpemUgPz8gdGhpcy5yYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemU7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dFNpemUodGV4dFNpemUpO1xuXG4gICAgICAvLyBGb250XG4gICAgICBjb25zdCB0ZXh0Rm9udCA9IHRoaXMuZm9udCA/PyB0aGlzLnJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuZm9udDtcbiAgICAgIGlmICh0ZXh0Rm9udCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dEZvbnQodGV4dEZvbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbmluZ1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRyYW5zbGF0ZShwb2ludC54LCBwb2ludC55KTtcblxuICAgICAgLy8gUm90YXRpb25cbiAgICAgIGlmICh0aGlzLmFuZ2xlLnR1cm4gIT09IDApIHtcbiAgICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnJvdGF0ZSh0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBhZGRpbmdcbiAgICAgIGxldCB4UGFkID0gMDtcbiAgICAgIGxldCB5UGFkID0gMDtcblxuICAgICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgICBjYXNlIGhFbnVtLmxlZnQ6ICAgeFBhZCArPSB0aGlzLmhQYWRkaW5nOyBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5jZW50ZXI6IHhQYWQgKz0gdGhpcy5oUGFkZGluZzsgYnJlYWs7XG4gICAgICAgIGNhc2UgaEVudW0ucmlnaHQ6ICB4UGFkIC09IHRoaXMuaFBhZGRpbmc7IGJyZWFrO1xuICAgICAgfVxuICAgICAgc3dpdGNoICh0aGlzLnZBbGlnbikge1xuICAgICAgICBjYXNlIHZFbnVtLnRvcDogICAgICB5UGFkICs9IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjogICB5UGFkICs9IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOiB5UGFkICs9IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTogICB5UGFkIC09IHRoaXMudlBhZGRpbmc7IGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoeFBhZCAhPT0gMCB8fCB5UGFkICE9PSAwKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50cmFuc2xhdGUoeFBhZCwgeVBhZCk7XG4gICAgICB9XG4gICAgfSAvLyBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5XG5cbiAgfSAvLyBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zXG5cbn0gLy8gY2xhc3MgUDVEcmF3ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBQNURyYXdlcjtcblxuXG4vLyBDb250YWlucyB0aGUgZHJhd2luZyBmdW5jdGlvbiBhbmQgb3B0aW9ucyBmb3IgZHJhd2luZyBvYmplY3RzIG9mIGFcbi8vIHNwZWNpZmljIGNsYXNzLlxuLy9cbi8vIEFuIGluc3RhbmNlIGlzIGNyZWF0ZWQgZm9yIGVhY2ggZHJhd2FibGUgY2xhc3MgdGhhdCB0aGUgZHJhd2VyIGNhblxuLy8gc3VwcG9ydCwgd2hpY2ggY29udGFpbnMgYWxsIHRoZSBzZXR0aW5ncyBuZWVkZWQgZm9yIGRyYXdpbmcuXG5jbGFzcyBEcmF3Um91dGluZSB7XG5cbiAgLy8gVE9ETzogUmVuYW1lIHRvIGRyYXdhYmxlQ2xhc3NcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkcmF3RnVuY3Rpb24pIHtcbiAgICAvLyBDbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbnRhaW5lZCBzZXR0aW5ncy5cbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG5cbiAgICAvLyBEcmF3aW5nIGZ1bmN0aW9uIGZvciBvYmplY3RzIG9mIHR5cGUgYGNsYXNzT2JqYCB3aXRoIHRoZSBzaWduYXR1cmU6XG4gICAgLy8gYGRyYXdGdW5jdGlvbihkcmF3ZXIsIG9iamVjdE9mQ2xhc3MpYFxuICAgIC8vICsgYGRyYXdlcjogUDVEcmF3ZXJgIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nXG4gICAgLy8gKyBgb2JqZWN0T2ZDbGFzczogY2xhc3NPYmpgIC0gSW5zdGFuY2Ugb2YgYGNsYXNzT2JqYCB0byBkcmF3XG4gICAgLy9cbiAgICAvLyBUaGUgZnVuY3Rpb24gaXMgaW50ZW5kZWQgdG8gcGVyZm9ybSBkcmF3aW5nIHVzaW5nIGBkcmF3ZXIucDVgXG4gICAgLy8gZnVuY3Rpb25zIG9yIGNhbGxpbmcgYGRyYXcoKWAgaW4gb3RoZXIgZHJhd2FibGUgb2JqZWN0cy4gQWxsIHN0eWxlc1xuICAgIC8vIGFyZSBwdXNoZWQgYmVmb3JlaGFuZCBhbmQgcG9wcGVkIGFmdGVyd2FyZHMuXG4gICAgLy9cbiAgICAvLyBJbiBnZW5lcmFsIGl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlIGBkcmF3RnVuY3Rpb25gIHBlZm9ybXMgbm8gY2hhbmdlc1xuICAgIC8vIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzIGluIG9yZGVyIGZvciBlYWNoIGRyYXdpbmcgY2FsbCB0byB1c2Ugb25seSBhXG4gICAgLy8gc2luZ2xlIGBwdXNoL3BvcGAgd2hlbiBuZWNlc3NhcnkuIEZvciBjbGFzc2VzIHRoYXQgcmVxdWlyZVxuICAgIC8vIG1vZGlmaWNhdGlvbnMgdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MgdGhlIGByZXF1aXJlc1B1c2hQb3BgXG4gICAgLy8gcHJvcGVydHkgY2FuIGJlIHNldCB0byBmb3JjZSBhIGBwdXNoL3BvcGAgd2l0aCBlYWNoIGRyYXdpbmcgY2FsbFxuICAgIC8vIHJlZ2FyZGxlc3MgaWYgc3R5bGVzIGFyZSBhcHBsaWVkLlxuICAgIHRoaXMuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuXG4gICAgLy8gV2hlbiBzZXQsIHRoaXMgc3R5bGUgaXMgYWx3YXlzIGFwcGxpZWQgYmVmb3JlIGVhY2ggZHJhd2luZyBjYWxsIHRvXG4gICAgLy8gb2JqZWN0cyBvZiB0eXBlIGBjbGFzc09iamAuIFRoaXMgYHN0eWxlYCBpcyBhcHBsaWVkIGJlZm9yZSB0aGVcbiAgICAvLyBgc3R5bGVgIHByb3ZpZGVkIHRvIHRoZSBkcmF3aW5nIGNhbGwuXG4gICAgdGhpcy5zdHlsZSA9IG51bGw7XG5cbiAgICAvLyBXaGVuIHNldCB0byBgdHJ1ZWAsIGEgYHB1c2gvcG9wYCBpcyBhbHdheXMgcGVmb3JtZWQgYmVmb3JlIGFuZCBhZnRlclxuICAgIC8vIGFsbCB0aGUgc3R5bGUgYXJlIGFwcGxpZWQgYW5kIGRyYXdpbmcgaXMgcGVyZm9ybWVkLiBUaGlzIGlzIGludGVuZGVkXG4gICAgLy8gZm9yIG9iamVjdHMgd2hpY2ggZHJhd2luZyBvcGVyYXRpb25zIG1heSBuZWVkIHRvIHBlcmZvcm1cbiAgICAvLyB0cmFuc2Zvcm1hdGlvbnMgdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MuXG4gICAgdGhpcy5yZXF1aXJlc1B1c2hQb3AgPSBmYWxzZTtcbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG59IC8vIERyYXdSb3V0aW5lXG5cblxuLy8gQ29udGFpbnMgdGhlIGRlYnVnLWRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGRlYnVnLWRyYXdpbmdcbi8vIG9iamVjdHMgb2YgYSBzcGVjaWZpYyBjbGFzcy5cbi8vXG4vLyBBbiBpbnN0YW5jZSBpcyBjcmVhdGVkIGZvciBlYWNoIGRyYXdhYmxlIGNsYXNzIHRoYXQgdGhlIGRyYXdlciBjYW5cbi8vIHN1cHBvcnQsIHdoaWNoIGNvbnRhaW5zIGFsbCB0aGUgc2V0dGluZ3MgbmVlZGVkIGZvciBkZWJ1Zy1kcmF3aW5nLlxuLy9cbi8vIFdoZW4gYSBkcmF3YWJsZSBvYmplY3QgZG9lcyBub3QgaGF2ZSBhIGBEZWJ1Z1JvdXRpbmVgIHNldHVwLCBjYWxsaW5nXG4vLyBgZGVidWcoKWAgc2ltcGx5IGNhbGxzIGBkcmF3KClgIHdpdGggdGhlIGRlYnVnIHN0eWxlIGFwcGxpZWQuXG5jbGFzcyBEZWJ1Z1JvdXRpbmUge1xuXG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgZGVidWdGdW5jdGlvbikge1xuICAgIC8vIENsYXNzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29udGFpbmVkIHNldHRpbmdzLlxuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcblxuICAgIC8vIERlYnVnIGZ1bmN0aW9uIGZvciBvYmplY3RzIG9mIHR5cGUgYGNsYXNzT2JqYCB3aXRoIHRoZSBzaWduYXR1cmU6XG4gICAgLy8gYGRlYnVnRnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzLCBkcmF3c1RleHQpYFxuICAgIC8vICsgYGRyYXdlcjogUDVEcmF3ZXJgIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nXG4gICAgLy8gKyBgb2JqZWN0T2ZDbGFzczogY2xhc3NPYmpgIC0gSW5zdGFuY2Ugb2YgYGNsYXNzT2JqYCB0byBkZWJ1Z1xuICAgIC8vICsgYGRyYXdzVGV4dDogYm9vbGAgLSBXaGVuIGB0cnVlYCB0ZXh0IHNob3VsZCBiZSBkcmF3biB3aXRoXG4gICAgLy8gICBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgIC8vXG4gICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGludGVuZGVkIHRvIHBlcmZvcm0gZGVidWctZHJhd2luZyB1c2luZyBgZHJhd2VyLnA1YFxuICAgIC8vIGZ1bmN0aW9ucyBvciBjYWxsaW5nIGBkcmF3KClgIGluIG90aGVyIGRyYXdhYmxlIG9iamVjdHMuIFRoZSBkZWJ1Z1xuICAgIC8vIHN0eWxlIGlzIHB1c2hlZCBiZWZvcmVoYW5kIGFuZCBwb3BwZWQgYWZ0ZXJ3YXJkcy5cbiAgICAvL1xuICAgIC8vIEluIGdlbmVyYWwgaXQgaXMgZXhwZWN0ZWQgdGhhdCB0aGUgYGRyYXdGdW5jdGlvbmAgcGVmb3JtcyBubyBjaGFuZ2VzXG4gICAgLy8gdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MgaW4gb3JkZXIgZm9yIGVhY2ggZHJhd2luZyBjYWxsIHRvIHVzZSBvbmx5IGFcbiAgICAvLyBzaW5nbGUgYHB1c2gvcG9wYCB3aGVuIG5lY2Vzc2FyeS5cbiAgICAvL1xuICAgIHRoaXMuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gIH0gLy8gY29uc3RydWN0b3JcblxufVxuXG5cbmNsYXNzIEFwcGx5Um91dGluZSB7XG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgYXBwbHlGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmFwcGx5RnVuY3Rpb24gPSBhcHBseUZ1bmN0aW9uO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUG9pbnRGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ2FsbHMgYHA1LnZlcnRleGAgdG8gcmVwcmVzZW50IHRoaXMgYFBvaW50YC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlBvaW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5Qb2ludC5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMuZHJhd2VyLnA1LnZlcnRleCh0aGlzLngsIHRoaXMueSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHBvaW50ZXIuXG4gICpcbiAgKiBBZGRlZCB0byBgcmFjLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gcG9pbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LnBvaW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUubW91c2VYLCByYWMuZHJhd2VyLnA1Lm1vdXNlWSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogQWRkZWQgdG8gYHJhYy5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0NlbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0NlbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aC8yLCByYWMuZHJhd2VyLnA1LmhlaWdodC8yKTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgZW5kIG9mIHRoZSBjYW52YXMsIHRoYXQgaXMsIGF0IHRoZSBwb3NpdGlvblxuICAqIGAod2lkdGgsaGVpZ2h0KWAuXG4gICpcbiAgKiBBZGRlZCB0byBgcmFjLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzRW5kXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUG9pbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYXlGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIHJheSB0b3VjaGVzIHRoZSBjYW52YXMgZWRnZS5cbiAgKlxuICAqIFdoZW4gdGhlIHJheSBpcyBvdXRzaWRlIHRoZSBjYW52YXMgYW5kIHBvaW50aW5nIGF3YXksIHJldHVybnMgYG51bGxgXG4gICogc2luY2Ugbm8gcG9pbnQgaW4gdGhlIGNhbnZhcyBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIEFkZGVkIHRvIGBSYWMuUmF5LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICogQHJldHVybnMgez9SYWMuUG9pbnR9XG4gICovXG4gIFJhYy5SYXkucHJvdG90eXBlLnBvaW50QXRDYW52YXNFZGdlID0gZnVuY3Rpb24obWFyZ2luID0gMCkge1xuICAgIGxldCBlZGdlUmF5ID0gdGhpcy5yYXlBdENhbnZhc0VkZ2UobWFyZ2luKTtcbiAgICBpZiAoZWRnZVJheSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRnZVJheS5zdGFydDtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGhhdCBzdGFydHMgYXQgdGhlIHBvaW50IHdoZXJlIHRoZSBgdGhpc2AgdG91Y2hlc1xuICAqIHRoZSBjYW52YXMgZWRnZSBhbmQgcG9pbnRlZCB0b3dhcmRzIHRoZSBpbnNpZGUgb2YgdGhlIGNhbnZhcy5cbiAgKlxuICAqIFdoZW4gdGhlIHJheSBpcyBvdXRzaWRlIHRoZSBjYW52YXMgYW5kIHBvaW50aW5nIGF3YXksIHJldHVybnMgYG51bGxgXG4gICogc2luY2Ugbm8gcG9pbnQgaW4gdGhlIGNhbnZhcyBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIEFkZGVkIHRvIGBSYWMuUmF5LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7P1JhYy5SYXl9XG4gICovXG4gIFJhYy5SYXkucHJvdG90eXBlLnJheUF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBjb25zdCB0dXJuID0gdGhpcy5hbmdsZS50dXJuO1xuICAgIGNvbnN0IHA1ID0gdGhpcy5yYWMuZHJhd2VyLnA1O1xuXG4gICAgY29uc3QgZG93bkVkZ2UgID0gcDUuaGVpZ2h0IC0gbWFyZ2luO1xuICAgIGNvbnN0IGxlZnRFZGdlICA9IG1hcmdpbjtcbiAgICBjb25zdCB1cEVkZ2UgICAgPSBtYXJnaW47XG4gICAgY29uc3QgcmlnaHRFZGdlID0gcDUud2lkdGggLSBtYXJnaW47XG5cbiAgICAvLyBwb2ludGluZyBkb3duXG4gICAgaWYgKHR1cm4gPj0gMS84ICYmIHR1cm4gPCAzLzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnkgPCBkb3duRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WShkb3duRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnVwKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIGxlZnRcbiAgICBpZiAodHVybiA+PSAzLzggJiYgdHVybiA8IDUvOCkge1xuICAgICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuc3RhcnQueCA+PSBsZWZ0RWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChsZWZ0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnJpZ2h0KTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHVwXG4gICAgaWYgKHR1cm4gPj0gNS84ICYmIHR1cm4gPCA3LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnkgPj0gdXBFZGdlKSB7XG4gICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICBpZiAoZWRnZVJheS5zdGFydC54ID4gcmlnaHRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgocmlnaHRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUubGVmdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC54IDwgbGVmdEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChsZWZ0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVkZ2VSYXk7XG4gICAgfVxuXG4gICAgLy8gcG9pbnRpbmcgcmlnaHRcbiAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgaWYgKHRoaXMuc3RhcnQueCA8IHJpZ2h0RWRnZSkge1xuICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgocmlnaHRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUubGVmdCk7XG4gICAgICBpZiAoZWRnZVJheS5zdGFydC55ID4gZG93bkVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WShkb3duRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnVwKTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnkgPCB1cEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWRnZVJheTtcbiAgfTtcblxufSAvLyBhdHRhY2hSYXlGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hTZWdtZW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBTZWdtZW50YC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlNlZ21lbnQucHJvdG90eXBlYCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKi9cbiAgUmFjLlNlZ21lbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3RhcnRQb2ludCgpLnZlcnRleCgpO1xuICAgIHRoaXMuZW5kUG9pbnQoKS52ZXJ0ZXgoKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHRvcCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1sZWZ0IHRvXG4gICogdG9wLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGByYWMuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzVG9wXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkICB0byBgcmFjLlNlZ21lbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0xlZnRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU2VnbWVudCNcbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzTGVmdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSByaWdodCBvZiB0aGUgY2FudmFzLCBmcm9tIHRvcC1yaWdodFxuICAqIHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgcmFjLlNlZ21lbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc1JpZ2h0XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdG9wUmlnaHQgPSByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgMCk7XG4gICAgcmV0dXJuIHRvcFJpZ2h0XG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIGJvdHRvbSBvZiB0aGUgY2FudmFzLCBmcm9tXG4gICogYm90dG9tLWxlZnQgdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGByYWMuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQm90dG9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8vIENyZWF0ZXMgYW5kIHJlc3RvcmVzIHRoZSBkcmF3aW5nIGNvbnRleHQgZm9yIGEgZGFzaGVkIHN0cm9rZSB3aGlsZVxuLy8gYGNsb3N1cmVgIGlzIGNhbGxlZC5cbmZ1bmN0aW9uIGRhc2hlZERyYXcoZHJhd2VyLCBzZWdtZW50LCBjbG9zdXJlKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBkcmF3ZXIucDUuZHJhd2luZ0NvbnRleHQ7XG4gIGNvbnRleHQuc2F2ZSgpO1xuICBjb250ZXh0LmxpbmVDYXAgPSAnYnV0dCc7XG4gIGNvbnRleHQuc2V0TGluZURhc2goc2VnbWVudCk7XG4gIGNsb3N1cmUoKTtcbiAgY29udGV4dC5yZXN0b3JlKCk7XG59XG5cblxuZXhwb3J0cy5kZWJ1Z0FuZ2xlID0gZnVuY3Rpb24oZHJhd2VyLCBhbmdsZSwgcG9pbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICAvLyBaZXJvIHNlZ21lbnRcbiAgcG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLnplcm8sIG1hcmtlclJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIEFuZ2xlIHNlZ21lbnRcbiAgbGV0IGFuZ2xlU2VnbWVudCA9IHBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBtYXJrZXJSYWRpdXMgKiAxLjUpO1xuICBhbmdsZVNlZ21lbnQuZW5kUG9pbnQoKVxuICAgIC5hcmMocG9pbnRSYWRpdXMsIGFuZ2xlLCBhbmdsZS5pbnZlcnNlKCksIGZhbHNlKVxuICAgIC5kcmF3KCk7XG4gIGFuZ2xlU2VnbWVudFxuICAgIC53aXRoTGVuZ3RoQWRkKHBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gTWluaSBhbmdsZSBhcmMgbWFya2Vyc1xuICBsZXQgYW5nbGVBcmMgPSBwb2ludC5hcmMobWFya2VyUmFkaXVzLCByYWMuQW5nbGUuemVybywgYW5nbGUpO1xuICBkYXNoZWREcmF3KGRyYXdlciwgWzYsIDRdLCAoKT0+eyBhbmdsZUFyYy5kcmF3KCk7IH0pO1xuXG4gIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gIGlmICghYW5nbGVBcmMuaXNDaXJjbGUoKSkge1xuICAgIGxldCBvdXRzaWRlQW5nbGVBcmMgPSBhbmdsZUFyY1xuICAgICAgLndpdGhSYWRpdXMobWFya2VyUmFkaXVzKjMvNClcbiAgICAgIC53aXRoQ2xvY2t3aXNlKGZhbHNlKTtcbiAgICBkYXNoZWREcmF3KGRyYXdlciwgWzIsIDRdLCAoKT0+eyBvdXRzaWRlQW5nbGVBcmMuZHJhdygpOyB9KTtcbiAgfVxuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgcmV0dXJuO1xuXG4gIGxldCBmb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyLFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSxcbiAgICBtYXJrZXJSYWRpdXMqMiwgMCk7XG5cbiAgLy8gVHVybiB0ZXh0XG4gIGxldCB0dXJuU3RyaW5nID0gYHR1cm46JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBwb2ludC50ZXh0KHR1cm5TdHJpbmcsIGZvcm1hdClcbiAgICAudXByaWdodCgpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnQW5nbGVcblxuXG5leHBvcnRzLmRlYnVnUG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgcG9pbnQuZHJhdygpO1xuXG4gIC8vIFBvaW50IG1hcmtlclxuICBwb2ludC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBQb2ludCByZXRpY3VsZSBtYXJrZXJcbiAgbGV0IGFyYyA9IHBvaW50XG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS5zLCByYWMuQW5nbGUuZSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygxLzIpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgcmV0dXJuO1xuXG4gIGxldCBmb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24udG9wLFxuICAgIHJhYy5BbmdsZS5lLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSxcbiAgICBwb2ludFJhZGl1cywgcG9pbnRSYWRpdXMpO1xuXG4gIGxldCBzdHJpbmcgPSBgeDoke3BvaW50LngudG9GaXhlZChkaWdpdHMpfVxcbnk6JHtwb2ludC55LnRvRml4ZWQoZGlnaXRzKX1gO1xuICBwb2ludC50ZXh0KHN0cmluZywgZm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1BvaW50XG5cblxuLy8gU2hhcmVkIHRleHQgZHJhd2luZyBmb3IgcmF5IGFuZCBzZWdtZW50XG5mdW5jdGlvbiBkcmF3UmF5VGV4dHMoZHJhd2VyLCByYXksIHRvcFN0cmluZywgYm90dG9tU3RyaW5nKSB7XG4gIGNvbnN0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgY29uc3QgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcbiAgY29uc3QgZm9udCAgICAgICAgPSBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250O1xuICBjb25zdCBzaXplICAgICAgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemU7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG5cbiAgbGV0IHRvcEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgZHJhd2VyLnJhYyxcbiAgICBoRW51bS5sZWZ0LCB2RW51bS5ib3R0b20sXG4gICAgcmF5LmFuZ2xlLCBmb250LCBzaXplLFxuICAgIHBvaW50UmFkaXVzLCBwb2ludFJhZGl1cyk7XG4gIGxldCBib3R0b21Gb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIGRyYXdlci5yYWMsXG4gICAgaEVudW0ubGVmdCwgdkVudW0udG9wLFxuICAgIHJheS5hbmdsZSwgZm9udCwgc2l6ZSxcbiAgICBwb2ludFJhZGl1cywgcG9pbnRSYWRpdXMpO1xuXG4gIC8vIFRleHRzXG4gIHJheS50ZXh0KHRvcFN0cmluZywgdG9wRm9ybWF0KVxuICAgIC51cHJpZ2h0KClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICByYXkudGV4dChib3R0b21TdHJpbmcsIGJvdHRvbUZvcm1hdClcbiAgICAudXByaWdodCgpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07XG5cblxuZXhwb3J0cy5kZWJ1Z1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuXG4gIHJheS5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgcmF5LnN0YXJ0LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIEhhbGYgY2lyY2xlIGF0IHN0YXJ0XG4gIGNvbnN0IHBlcnBBbmdsZSA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gIGNvbnN0IHN0YXJ0QXJjID0gcmF5LnN0YXJ0XG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBzdGFydEFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBzdGFydEFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcblxuICAvLyBFZGdlIGVuZCBoYWxmIGNpcmNsZVxuICBjb25zdCBlZGdlUmF5ID0gcmF5LnJheUF0Q2FudmFzRWRnZSgpO1xuICBpZiAoZWRnZVJheSAhPSBudWxsKSB7XG4gICAgY29uc3QgZWRnZUFyYyA9IGVkZ2VSYXlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKVxuICAgICAgLnBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgICAuYXJjVG9BbmdsZURpc3RhbmNlKG1hcmtlclJhZGl1cy8yLCAwLjUpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMuc3RhcnRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLmVuZFNlZ21lbnQoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMucmFkaXVzU2VnbWVudEF0QW5nbGUoZWRnZVJheS5hbmdsZSlcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgcmV0dXJuO1xuXG4gIGNvbnN0IGRpZ2l0cyA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuICBjb25zdCBzdGFydFN0cmluZyA9IGBzdGFydDooJHtyYXkuc3RhcnQueC50b0ZpeGVkKGRpZ2l0cyl9LCR7cmF5LnN0YXJ0LnkudG9GaXhlZChkaWdpdHMpfSlgO1xuICBjb25zdCBhbmdsZVN0cmluZyA9IGBhbmdsZToke3JheS5hbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBkcmF3UmF5VGV4dHMoZHJhd2VyLCByYXksIHN0YXJ0U3RyaW5nLCBhbmdsZVN0cmluZyk7XG59OyAvLyBkZWJ1Z1JheVxuXG5cbmV4cG9ydHMuZGVidWdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICBzZWdtZW50LmRyYXcoKTtcblxuICAvLyBMaXR0bGUgY2lyY2xlIGF0IHN0YXJ0IG1hcmtlclxuICBzZWdtZW50LndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgLmFyYygpXG4gICAgLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBzdGFydCBzZWdtZW50XG4gIGxldCBwZXJwQW5nbGUgPSBzZWdtZW50LmFuZ2xlKCkucGVycGVuZGljdWxhcigpO1xuICBsZXQgYXJjID0gc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcGVycEFuZ2xlLCBwZXJwQW5nbGUuaW52ZXJzZSgpKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gUGVycGVuZGljdWxhciBlbmQgbWFya2VyXG4gIGxldCBlbmRNYXJrZXJTdGFydCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKClcbiAgICAud2l0aExlbmd0aChtYXJrZXJSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKC1wb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuICBsZXQgZW5kTWFya2VyRW5kID0gc2VnbWVudFxuICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgLy8gTGl0dGxlIGVuZCBoYWxmIGNpcmNsZVxuICBzZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKHBvaW50UmFkaXVzLCBlbmRNYXJrZXJTdGFydC5hbmdsZSgpLCBlbmRNYXJrZXJFbmQuYW5nbGUoKSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIEZvcm1pbmcgZW5kIGFycm93XG4gIGxldCBhcnJvd0FuZ2xlU2hpZnQgPSByYWMuQW5nbGUuZnJvbSgxLzcpO1xuICBsZXQgZW5kQXJyb3dTdGFydCA9IGVuZE1hcmtlclN0YXJ0XG4gICAgLnJldmVyc2UoKVxuICAgIC5yYXkud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZVNoaWZ0LCBmYWxzZSk7XG4gIGxldCBlbmRBcnJvd0VuZCA9IGVuZE1hcmtlckVuZFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgdHJ1ZSk7XG4gIGxldCBlbmRBcnJvd1BvaW50ID0gZW5kQXJyb3dTdGFydFxuICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKGVuZEFycm93RW5kKTtcbiAgLy8gRW5kIGFycm93XG4gIGVuZE1hcmtlclN0YXJ0XG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRBcnJvd1BvaW50KVxuICAgIC5kcmF3KClcbiAgICAubmV4dFNlZ21lbnRUb1BvaW50KGVuZE1hcmtlckVuZC5lbmRQb2ludCgpKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRGVidWcgVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSByZXR1cm47XG5cbiAgY29uc3QgZGlnaXRzID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG4gIGxldCBsZW5ndGhTdHJpbmcgPSBgbGVuZ3RoOiR7c2VnbWVudC5sZW5ndGgudG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCBhbmdsZVN0cmluZyAgPSBgYW5nbGU6JHtzZWdtZW50LnJheS5hbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBkcmF3UmF5VGV4dHMoZHJhd2VyLCBzZWdtZW50LnJheSwgbGVuZ3RoU3RyaW5nLCBhbmdsZVN0cmluZyk7XG59OyAvLyBkZWJ1Z1NlZ21lbnRcblxuXG5leHBvcnRzLmRlYnVnQXJjID0gZnVuY3Rpb24oZHJhd2VyLCBhcmMsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuXG4gIGFyYy5kcmF3KCk7XG5cbiAgLy8gQ2VudGVyIG1hcmtlcnNcbiAgbGV0IGNlbnRlckFyY1JhZGl1cyA9IG1hcmtlclJhZGl1cyAqIDIvMztcbiAgaWYgKGFyYy5yYWRpdXMgPiBtYXJrZXJSYWRpdXMvMyAmJiBhcmMucmFkaXVzIDwgbWFya2VyUmFkaXVzKSB7XG4gICAgLy8gSWYgcmFkaXVzIGlzIHRvbyBjbG9zZSB0byB0aGUgY2VudGVyLWFyYyBtYXJrZXJzXG4gICAgLy8gTWFrZSB0aGUgY2VudGVyLWFyYyBiZSBvdXRzaWRlIG9mIHRoZSBhcmNcbiAgICBjZW50ZXJBcmNSYWRpdXMgPSBhcmMucmFkaXVzICsgbWFya2VyUmFkaXVzLzM7XG4gIH1cblxuICAvLyBDZW50ZXIgc3RhcnQgc2VnbWVudFxuICBsZXQgY2VudGVyQXJjID0gYXJjLndpdGhSYWRpdXMoY2VudGVyQXJjUmFkaXVzKTtcbiAgY2VudGVyQXJjLnN0YXJ0U2VnbWVudCgpLmRyYXcoKTtcblxuICAvLyBSYWRpdXNcbiAgbGV0IHJhZGl1c01hcmtlckxlbmd0aCA9IGFyYy5yYWRpdXNcbiAgICAtIGNlbnRlckFyY1JhZGl1c1xuICAgIC0gbWFya2VyUmFkaXVzLzJcbiAgICAtIHBvaW50UmFkaXVzKjI7XG4gIGlmIChyYWRpdXNNYXJrZXJMZW5ndGggPiAwKSB7XG4gICAgYXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAud2l0aExlbmd0aChyYWRpdXNNYXJrZXJMZW5ndGgpXG4gICAgICAudHJhbnNsYXRlVG9MZW5ndGgoY2VudGVyQXJjUmFkaXVzICsgcG9pbnRSYWRpdXMqMilcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBJbnNpZGUgYW5nbGUgYXJjIC0gYmlnIGRhc2hlc1xuICBkYXNoZWREcmF3KGRyYXdlciwgWzYsIDRdLCAoKT0+eyBjZW50ZXJBcmMuZHJhdygpOyB9KTtcblxuICAvLyBPdXRzaWRlIGFuZ2xlIGFyYyAtIHNtYWxsIGRhc2hlc1xuICBpZiAoIWNlbnRlckFyYy5pc0NpcmNsZSgpKSB7XG4gICAgbGV0IG91dHNpZGVBbmdsZUFyYyA9IGNlbnRlckFyY1xuICAgICAgLndpdGhDbG9ja3dpc2UoIWNlbnRlckFyYy5jbG9ja3dpc2UpO1xuICAgIGRhc2hlZERyYXcoZHJhd2VyLCBbMiwgNF0sICgpPT57IG91dHNpZGVBbmdsZUFyYy5kcmF3KCk7IH0pO1xuICB9XG5cbiAgLy8gQ2VudGVyIGVuZCBzZWdtZW50XG4gIGlmICghYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBjZW50ZXJBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKS53aXRoTGVuZ3RoUmF0aW8oMS8yKS5kcmF3KCk7XG4gIH1cblxuICAvLyBTdGFydCBwb2ludCBtYXJrZXJcbiAgbGV0IHN0YXJ0UG9pbnQgPSBhcmMuc3RhcnRQb2ludCgpO1xuICBzdGFydFBvaW50XG4gICAgLmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuICBzdGFydFBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oLW1hcmtlclJhZGl1cy8yKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gT3JpZW50YXRpb24gbWFya2VyXG4gIGxldCBvcmllbnRhdGlvbkxlbmd0aCA9IG1hcmtlclJhZGl1cyoyO1xuICBsZXQgb3JpZW50YXRpb25BcmMgPSBhcmNcbiAgICAuc3RhcnRTZWdtZW50KClcbiAgICAud2l0aExlbmd0aEFkZChtYXJrZXJSYWRpdXMpXG4gICAgLmFyYyhudWxsLCBhcmMuY2xvY2t3aXNlKVxuICAgIC53aXRoTGVuZ3RoKG9yaWVudGF0aW9uTGVuZ3RoKVxuICAgIC5kcmF3KCk7XG4gIGxldCBhcnJvd0NlbnRlciA9IG9yaWVudGF0aW9uQXJjXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy8yKVxuICAgIC5jaG9yZFNlZ21lbnQoKTtcbiAgbGV0IGFycm93QW5nbGUgPSAzLzMyO1xuICBhcnJvd0NlbnRlci53aXRoQW5nbGVTaGlmdCgtYXJyb3dBbmdsZSkuZHJhdygpO1xuICBhcnJvd0NlbnRlci53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlKS5kcmF3KCk7XG5cbiAgLy8gSW50ZXJuYWwgZW5kIHBvaW50IG1hcmtlclxuICBsZXQgZW5kUG9pbnQgPSBhcmMuZW5kUG9pbnQoKTtcbiAgbGV0IGludGVybmFsTGVuZ3RoID0gTWF0aC5taW4obWFya2VyUmFkaXVzLzIsIGFyYy5yYWRpdXMpO1xuICBpbnRlcm5hbExlbmd0aCAtPSBwb2ludFJhZGl1cztcbiAgaWYgKGludGVybmFsTGVuZ3RoID4gcmFjLmVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgZW5kUG9pbnRcbiAgICAgIC5zZWdtZW50VG9BbmdsZShhcmMuZW5kLmludmVyc2UoKSwgaW50ZXJuYWxMZW5ndGgpXG4gICAgICAudHJhbnNsYXRlVG9MZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gRXh0ZXJuYWwgZW5kIHBvaW50IG1hcmtlclxuICBsZXQgdGV4dEpvaW5UaHJlc2hvbGQgPSBtYXJrZXJSYWRpdXMqMztcbiAgbGV0IGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPSBvcmllbnRhdGlvbkFyY1xuICAgIC53aXRoRW5kKGFyYy5lbmQpXG4gICAgLmxlbmd0aCgpO1xuICBsZXQgZXh0ZXJuYWxMZW5ndGggPSBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID4gdGV4dEpvaW5UaHJlc2hvbGQgJiYgZHJhd3NUZXh0ID09PSB0cnVlXG4gICAgPyBtYXJrZXJSYWRpdXMgLSBwb2ludFJhZGl1c1xuICAgIDogbWFya2VyUmFkaXVzLzIgLSBwb2ludFJhZGl1cztcblxuICBlbmRQb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhcmMuZW5kLCBleHRlcm5hbExlbmd0aClcbiAgICAudHJhbnNsYXRlVG9MZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBFbmQgcG9pbnQgbGl0dGxlIGFyY1xuICBpZiAoIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgZW5kUG9pbnRcbiAgICAgIC5hcmMocG9pbnRSYWRpdXMsIGFyYy5lbmQsIGFyYy5lbmQuaW52ZXJzZSgpLCBhcmMuY2xvY2t3aXNlKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgcmV0dXJuO1xuXG4gIGNvbnN0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgY29uc3QgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcbiAgY29uc3QgZm9udCAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udDtcbiAgY29uc3Qgc2l6ZSAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZTtcbiAgY29uc3QgZGlnaXRzID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgbGV0IGhlYWRWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLnRvcFxuICAgIDogdkVudW0uYm90dG9tO1xuICBsZXQgdGFpbFZlcnRpY2FsID0gYXJjLmNsb2Nrd2lzZVxuICAgID8gdkVudW0uYm90dG9tXG4gICAgOiB2RW51bS50b3A7XG4gIGxldCByYWRpdXNWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLmJvdHRvbVxuICAgIDogdkVudW0udG9wO1xuXG4gIGxldCBoZWFkRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChyYWMsXG4gICAgaEVudW0ubGVmdCwgaGVhZFZlcnRpY2FsLFxuICAgIGFyYy5zdGFydCxcbiAgICBmb250LCBzaXplLFxuICAgIHBvaW50UmFkaXVzLCAwKTtcbiAgbGV0IHRhaWxGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRW51bS5sZWZ0LCB0YWlsVmVydGljYWwsXG4gICAgYXJjLmVuZCxcbiAgICBmb250LCBzaXplLFxuICAgIHBvaW50UmFkaXVzLCAwKTtcbiAgbGV0IHJhZGl1c0Zvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhFbnVtLmxlZnQsIHJhZGl1c1ZlcnRpY2FsLFxuICAgIGFyYy5zdGFydCxcbiAgICBmb250LCBzaXplLFxuICAgIG1hcmtlclJhZGl1cywgcG9pbnRSYWRpdXMpO1xuXG4gIGxldCBzdGFydFN0cmluZyAgPSBgc3RhcnQ6JHthcmMuc3RhcnQudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IHJhZGl1c1N0cmluZyA9IGByYWRpdXM6JHthcmMucmFkaXVzLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgZW5kU3RyaW5nICAgID0gYGVuZDoke2FyYy5lbmQudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcblxuICBsZXQgYW5nbGVEaXN0YW5jZSA9IGFyYy5hbmdsZURpc3RhbmNlKCk7XG4gIGxldCBkaXN0YW5jZVN0cmluZyA9IGBkaXN0YW5jZToke2FuZ2xlRGlzdGFuY2UudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcblxuICBsZXQgdGFpbFN0cmluZyA9IGAke2Rpc3RhbmNlU3RyaW5nfVxcbiR7ZW5kU3RyaW5nfWA7XG4gIGxldCBoZWFkU3RyaW5nO1xuXG4gIC8vIFJhZGl1cyBsYWJlbFxuICBjb25zdCBlbmRJc0F3YXkgPSBhbmdsZURpc3RhbmNlLnR1cm4gPD0gMy80IHx8IGFuZ2xlRGlzdGFuY2UuZXF1YWxzKDMvNCk7XG4gIGlmIChlbmRJc0F3YXkgJiYgIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgLy8gUmFkaXVzIGRyYXduIHNlcGFyYXRlbHlcbiAgICBoZWFkU3RyaW5nID0gc3RhcnRTdHJpbmc7XG4gICAgYXJjLmNlbnRlclxuICAgICAgLnRleHQocmFkaXVzU3RyaW5nLCByYWRpdXNGb3JtYXQpXG4gICAgICAudXByaWdodCgpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gIH0gZWxzZSB7XG4gICAgLy8gUmFkaXVzIGpvaW5lZCB0byBoZWFkXG4gICAgaGVhZFN0cmluZyA9IGAke3N0YXJ0U3RyaW5nfVxcbiR7cmFkaXVzU3RyaW5nfWA7XG4gIH1cblxuICBpZiAobGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkKSB7XG4gICAgLy8gRHJhdyBoZWFkIGFuZCB0YWlsIHNlcGFyYXRlbHlcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC50ZXh0KGhlYWRTdHJpbmcsIGhlYWRGb3JtYXQpXG4gICAgICAudXByaWdodCgpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICAgIG9yaWVudGF0aW9uQXJjLnBvaW50QXRBbmdsZShhcmMuZW5kKVxuICAgICAgLnRleHQodGFpbFN0cmluZywgdGFpbEZvcm1hdClcbiAgICAgIC51cHJpZ2h0KClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRHJhdyBoZWFkIGFuZCB0YWlsIHRvZ2V0aGVyXG4gICAgbGV0IGJvdGhTdHJpbmdzID0gYCR7aGVhZFN0cmluZ31cXG4ke3RhaWxTdHJpbmd9YDtcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC50ZXh0KGJvdGhTdHJpbmdzLCBoZWFkRm9ybWF0KVxuICAgICAgLnVwcmlnaHQoKVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfVxufTsgLy8gZGVidWdBcmNcblxuXG5leHBvcnRzLmRlYnVnVGV4dCA9IGZ1bmN0aW9uKGRyYXdlciwgdGV4dCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIGNvbnN0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgY29uc3QgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcblxuICBjb25zdCBmb3JtYXQgPSB0ZXh0LmZvcm1hdDtcblxuICAvLyBQb2ludCBtYXJrZXJcbiAgdGV4dC5wb2ludC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICBjb25zdCBjb3JuZXJSZXRpY3VsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBwYWRkaW5nLCBwZXJwUGFkZGluZywgcm90YXRpb24pIHtcbiAgICByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBtYXJrZXJSYWRpdXMpXG4gICAgICAucmV2ZXJzZSgpLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLXBvaW50UmFkaXVzKjIpLmRyYXcoKSAvLyBsaW5lIGF0IHRleHQgZWRnZVxuICAgICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihyb3RhdGlvbiwgcGFkZGluZykucHVzaCgpIC8vIGVsYm93IHR1cm5cbiAgICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoIXJvdGF0aW9uLCBwZXJwUGFkZGluZykuZHJhdygpIC8vIGxpbmUgYXQgb3JpZ2luXG4gICAgICAubmV4dFNlZ21lbnRXaXRoTGVuZ3RoKHBvaW50UmFkaXVzKjQpXG4gICAgICAubmV4dFNlZ21lbnRXaXRoTGVuZ3RoKG1hcmtlclJhZGl1cy1wb2ludFJhZGl1cyoyKS5kcmF3KCk7IC8vIG9wcG9zaXRlIHNpZGUgbGluZVxuICAgICAgLy8gRGFzaGVkIGVsYm93IHR1cm5cbiAgICAgIGRhc2hlZERyYXcoZHJhd2VyLCBbNSwgMl0sICgpPT57IHJhYy5wb3BTdGFjaygpLmRyYXcoKTsgfSk7XG4gIH07XG5cbiAgY29uc3QgY2VudGVyUmV0aWN1bGUgPSBmdW5jdGlvbihhbmdsZSwgcGFkZGluZywgcGVycFBhZGRpbmcsIHJvdGF0aW9uKSB7XG4gICAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgLy8gbGluZXMgYXQgZWRnZSBvZiB0ZXh0XG4gICAgcmFjLlBvaW50Lnplcm9cbiAgICAgIC5yYXkoYW5nbGUucGVycGVuZGljdWxhcihyb3RhdGlvbikpXG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cyoyKVxuICAgICAgLnNlZ21lbnQobWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXMqMikuZHJhdygpO1xuICAgIGxldCByZXRpY3VsZUNlbnRlciA9IHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUoYW5nbGUuaW52ZXJzZSgpLCBwYWRkaW5nKVxuICAgICAgLnB1c2goKSAvLyBkYXNoZWQgbGluZSB0byBlbGJvd1xuICAgICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihyb3RhdGlvbiwgcG9pbnRSYWRpdXMpXG4gICAgICAucmV2ZXJzZSgpLmRyYXcoKSAvLyBlbGJvdyBtYXJrXG4gICAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHJvdGF0aW9uLCBwb2ludFJhZGl1cylcbiAgICAgIC5yZXZlcnNlKCkuZHJhdygpIC8vIGVsYm93IG1hcmtcbiAgICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIocm90YXRpb24sIHBlcnBQYWRkaW5nKVxuICAgICAgLnB1c2goKSAvLyBkYXNoZWQgbGluZSB0byBjZW50ZXJcbiAgICAgIC5lbmRQb2ludCgpO1xuICAgIGRhc2hlZERyYXcoZHJhd2VyLCBbNSwgMl0sICgpPT57XG4gICAgICByYWMucG9wU3RhY2soKS5kcmF3KCk7XG4gICAgICByYWMucG9wU3RhY2soKS5kcmF3KCk7XG4gICAgfSk7XG5cbiAgICAvLyBsaW5lcyBhcm91bmQgcmV0aWN1bGUgY2VudGVyXG4gICAgcmV0aWN1bGVDZW50ZXIucmF5KGFuZ2xlLmludmVyc2UoKSlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKjIpXG4gICAgICAuc2VnbWVudChtYXJrZXJSYWRpdXMgLSBwb2ludFJhZGl1cyoyKS5kcmF3KCk7XG4gICAgcmV0aWN1bGVDZW50ZXIucmF5KGFuZ2xlLnBlcnBlbmRpY3VsYXIoIXJvdGF0aW9uKSlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKjIpXG4gICAgICAuc2VnbWVudChtYXJrZXJSYWRpdXMgLSBwb2ludFJhZGl1cyoyKS5kcmF3KCk7XG4gICAgbGV0IGxhc3RDZW50ZXJMaW5lID1cbiAgICAgIHJldGljdWxlQ2VudGVyLnJheShhbmdsZSlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKjIpXG4gICAgICAuc2VnbWVudChtYXJrZXJSYWRpdXMgLSBwb2ludFJhZGl1cyoyKS5kcmF3KCk7XG5cbiAgICBpZiAoTWF0aC5hYnMocGVycFBhZGRpbmcpIDw9IDIpIHJldHVybjtcblxuICAgIC8vIHNob3J0IGRhc2hlZCBsaW5lcyBiYWNrIHRvIHRleHQgZWRnZVxuICAgIGxhc3RDZW50ZXJMaW5lXG4gICAgICAubmV4dFNlZ21lbnRXaXRoTGVuZ3RoKHBhZGRpbmcgLSBtYXJrZXJSYWRpdXMpXG4gICAgICAucHVzaCgpXG4gICAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKCFyb3RhdGlvbiwgZm9ybWF0LmhQYWRkaW5nKVxuICAgICAgLnB1c2goKTtcbiAgICBkYXNoZWREcmF3KGRyYXdlciwgWzIsIDNdLCAoKT0+e1xuICAgICAgcmFjLnBvcFN0YWNrKCkuZHJhdygpO1xuICAgICAgcmFjLnBvcFN0YWNrKCkuZHJhdygpO1xuICAgIH0pO1xuICB9O1xuXG4gIGRyYXdlci5wNS5wdXNoKCk7XG4gICAgZm9ybWF0LmFwcGx5KHRleHQucG9pbnQpO1xuICAgIHN3aXRjaCAoZm9ybWF0LmhBbGlnbikge1xuICAgICAgY2FzZSBoRW51bS5sZWZ0OlxuICAgICAgICBzd2l0Y2ggKGZvcm1hdC52QWxpZ24pIHtcbiAgICAgICAgICBjYXNlIHZFbnVtLnRvcDpcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDAvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDEvNCwgZm9ybWF0LmhQYWRkaW5nLCBmb3JtYXQudlBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5jZW50ZXI6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgwLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uYmFzZWxpbmU6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgwLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgdkVudW0uYm90dG9tOlxuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMC80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgdHJ1ZSk7XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgzLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBoRW51bS5jZW50ZXI6XG4gICAgICAgIHN3aXRjaCAoZm9ybWF0LnZBbGlnbikge1xuICAgICAgICAgIGNhc2UgdkVudW0udG9wOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMS80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5jZW50ZXI6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgxLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMS80LCBmb3JtYXQudlBhZGRpbmcsIGZvcm1hdC5oUGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5ib3R0b206XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgzLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGhFbnVtLnJpZ2h0OlxuICAgICAgICBzd2l0Y2ggKGZvcm1hdC52QWxpZ24pIHtcbiAgICAgICAgICBjYXNlIHZFbnVtLnRvcDpcbiAgICAgICAgICAgIGNvcm5lclJldGljdWxlKDIvNCwgZm9ybWF0LnZQYWRkaW5nLCBmb3JtYXQuaFBhZGRpbmcsIHRydWUpO1xuICAgICAgICAgICAgY29ybmVyUmV0aWN1bGUoMS80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5jZW50ZXI6XG4gICAgICAgICAgICBjZW50ZXJSZXRpY3VsZSgyLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOlxuICAgICAgICAgICAgY2VudGVyUmV0aWN1bGUoMi80LCBmb3JtYXQuaFBhZGRpbmcsIGZvcm1hdC52UGFkZGluZywgZmFsc2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSB2RW51bS5ib3R0b206XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgyLzQsIGZvcm1hdC52UGFkZGluZywgZm9ybWF0LmhQYWRkaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBjb3JuZXJSZXRpY3VsZSgzLzQsIGZvcm1hdC5oUGFkZGluZywgZm9ybWF0LnZQYWRkaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgZHJhd2VyLnA1LnBvcCgpO1xuXG4gIC8vIFRleHQgb2JqZWN0XG4gIHRleHQuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gIC8vIERlYnVnIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBjb25zdCBmaXggPSBmdW5jdGlvbihudW1iZXIpIHtcbiAgICByZXR1cm4gbnVtYmVyLnRvRml4ZWQoZGlnaXRzKTtcbiAgfTtcblxuICBsZXQgc3RyaW5nUGEgPSBgcDooJHtmaXgodGV4dC5wb2ludC54KX0sJHtmaXgodGV4dC5wb2ludC55KX0pIGE6JHtmaXgoZm9ybWF0LmFuZ2xlLnR1cm4pfWA7XG4gIGxldCBzdHJpbmdBbCA9IGBhbDoke2Zvcm1hdC5oQWxpZ259LCR7Zm9ybWF0LnZBbGlnbn1gO1xuICBsZXQgc3RyaW5nUGFkID0gYHBhOiR7Zml4KGZvcm1hdC5oUGFkZGluZyl9LCR7Zml4KGZvcm1hdC52UGFkZGluZyl9YDtcbiAgbGV0IGRlYnVnU3RyaW5nID0gYCR7c3RyaW5nUGF9XFxuJHtzdHJpbmdBbH1cXG4ke3N0cmluZ1BhZH1gO1xuXG4gIGxldCBkZWJ1Z0Zvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLnJpZ2h0LCB2RW51bS5ib3R0b20sXG4gICAgcmFjLkFuZ2xlLnplcm8sXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplLFxuICAgIHBvaW50UmFkaXVzLCBwb2ludFJhZGl1cyk7XG4gIHRleHQucG9pbnQudGV4dChgJHtkZWJ1Z1N0cmluZ31gLCBkZWJ1Z0Zvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdUZXh0XG5cblxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBCZXppZXJcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgQ29tcG9zaXRlXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIFNoYXBlXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG5leHBvcnRzLmRyYXdQb2ludCA9IGZ1bmN0aW9uKGRyYXdlciwgcG9pbnQpIHtcbiAgZHJhd2VyLnA1LnBvaW50KHBvaW50LngsIHBvaW50LnkpO1xufTsgLy8gZHJhd1BvaW50XG5cblxuZXhwb3J0cy5kcmF3UmF5ID0gZnVuY3Rpb24oZHJhd2VyLCByYXkpIHtcbiAgbGV0IGVkZ2VQb2ludCA9IHJheS5wb2ludEF0Q2FudmFzRWRnZSgpO1xuXG4gIGlmIChlZGdlUG9pbnQgPT09IG51bGwpIHtcbiAgICAvLyBSYXkgaXMgb3V0c2lkZSBjYW52YXNcbiAgICByZXR1cm47XG4gIH1cblxuICBkcmF3ZXIucDUubGluZShcbiAgICByYXkuc3RhcnQueCwgcmF5LnN0YXJ0LnksXG4gICAgZWRnZVBvaW50LngsIGVkZ2VQb2ludC55KTtcbn07IC8vIGRyYXdSYXlcblxuXG5leHBvcnRzLmRyYXdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50KSB7XG4gIGNvbnN0IHN0YXJ0ID0gc2VnbWVudC5yYXkuc3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHNlZ21lbnQuZW5kUG9pbnQoKTtcbiAgZHJhd2VyLnA1LmxpbmUoXG4gICAgc3RhcnQueCwgc3RhcnQueSxcbiAgICBlbmQueCwgICBlbmQueSk7XG59OyAvLyBkcmF3U2VnbWVudFxuXG5cbmV4cG9ydHMuZHJhd0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjKSB7XG4gIGlmIChhcmMuaXNDaXJjbGUoKSkge1xuICAgIGxldCBzdGFydFJhZCA9IGFyYy5zdGFydC5yYWRpYW5zKCk7XG4gICAgbGV0IGVuZFJhZCA9IHN0YXJ0UmFkICsgUmFjLlRBVTtcbiAgICBkcmF3ZXIucDUuYXJjKFxuICAgICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgICBhcmMucmFkaXVzICogMiwgYXJjLnJhZGl1cyAqIDIsXG4gICAgICBzdGFydFJhZCwgZW5kUmFkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgc3RhcnQgPSBhcmMuc3RhcnQ7XG4gIGxldCBlbmQgPSBhcmMuZW5kO1xuICBpZiAoIWFyYy5jbG9ja3dpc2UpIHtcbiAgICBzdGFydCA9IGFyYy5lbmQ7XG4gICAgZW5kID0gYXJjLnN0YXJ0O1xuICB9XG5cbiAgZHJhd2VyLnA1LmFyYyhcbiAgICBhcmMuY2VudGVyLngsIGFyYy5jZW50ZXIueSxcbiAgICBhcmMucmFkaXVzICogMiwgYXJjLnJhZGl1cyAqIDIsXG4gICAgc3RhcnQucmFkaWFucygpLCBlbmQucmFkaWFucygpKTtcbn07IC8vIGRyYXdBcmNcblxuXG5leHBvcnRzLmRyYXdUZXh0ID0gZnVuY3Rpb24oZHJhd2VyLCB0ZXh0KSB7XG4gIC8vIFRleHQgZHJhd1JvdXRpbmUgaXMgc2V0cyBgcmVxdWlyZXNQdXNoUG9wYFxuICAvLyBUaGlzIGBhcHBseWAgZ2V0cyByZXZlcnRlZCBhdCBgcDVEcmF3ZXIuZHJhd09iamVjdGBcbiAgdGV4dC5mb3JtYXQuYXBwbHkodGV4dC5wb2ludCk7XG4gIGRyYXdlci5wNS50ZXh0KHRleHQuc3RyaW5nLCAwLCAwKTtcbn07IC8vIGRyYXdUZXh0XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb2xvciB3aXRoIFJCR0EgdmFsdWVzLCBlYWNoIG9uZSBpbiB0aGUgKlswLDFdKiByYW5nZS5cbipcbiogIyMjIGBpbnN0YW5jZS5Db2xvcmBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5Db2xvcmAgZnVuY3Rpb25de0BsaW5rIFJhYyNDb2xvcn0gdG8gY3JlYXRlIGBDb2xvcmAgb2JqZWN0cyB3aXRoXG4qIGZld2VyIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuQ29sb3IucmVkYF17QGxpbmsgaW5zdGFuY2UuQ29sb3IjcmVkfSwgbGlzdGVkXG4qIHVuZGVyIFtgaW5zdGFuY2UuQ29sb3JgXXtAbGluayBpbnN0YW5jZS5Db2xvcn0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IGNvbG9yID0gbmV3IFJhYy5Db2xvcihyYWMsIDAuMiwgMC40LCAwLjYpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlckNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4qXG4qIEBzZWUgW2ByYWMuQ29sb3JgXXtAbGluayBSYWMjQ29sb3J9XG4qIEBzZWUgW2BpbnN0YW5jZS5Db2xvcmBde0BsaW5rIGluc3RhbmNlLkNvbG9yfVxuKlxuKiBAYWxpYXMgUmFjLkNvbG9yXG4qL1xuY2xhc3MgQ29sb3Ige1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gW2E9MV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByLCBnLCBiLCBhID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHIsIGcsIGIsIGEpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihyLCBnLCBiLCBhKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgcmVkIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnIgPSByO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgZ3JlZW4gY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuZyA9IGc7XG5cbiAgICAvKipcbiAgICAqIFRoZSBibHVlIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmIgPSBiO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYWxwaGEgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYSA9IGE7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiByYWMuQ29sb3IoMC4xLCAwLjIsIDAuMywgMC40KS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ0NvbG9yKDAuMSwwLjIsMC4zLDAuNCknXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCByU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuciwgZGlnaXRzKTtcbiAgICBjb25zdCBnU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZywgZGlnaXRzKTtcbiAgICBjb25zdCBiU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuYiwgZGlnaXRzKTtcbiAgICBjb25zdCBhU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuYSwgZGlnaXRzKTtcbiAgICByZXR1cm4gYENvbG9yKCR7clN0cn0sJHtnU3RyfSwke2JTdHJ9LCR7YVN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgZGlmZmVyZW5jZSB3aXRoIGBvdGhlckNvbG9yYCBmb3IgZWFjaCBjaGFubmVsXG4gICogaXMgdW5kZXIgW2ByYWMuZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9O1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlckNvbG9yYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkNvbG9yYCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVmFsdWVzIGFyZSBjb21wYXJlZCB1c2luZyBbYHJhYy51bml0YXJ5RXF1YWxzYF17QGxpbmsgUmFjI3VuaXRhcnlFcXVhbHN9LlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IG90aGVyQ29sb3IgLSBBIGBDb2xvcmAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgW2ByYWMudW5pdGFyeUVxdWFsc2Bde0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJDb2xvcikge1xuICAgIHJldHVybiBvdGhlckNvbG9yIGluc3RhbmNlb2YgQ29sb3JcbiAgICAgICYmIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5yLCBvdGhlckNvbG9yLnIpXG4gICAgICAmJiB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuZywgb3RoZXJDb2xvci5nKVxuICAgICAgJiYgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmIsIG90aGVyQ29sb3IuYilcbiAgICAgICYmIHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hLCBvdGhlckNvbG9yLmEpO1xuICB9XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2Ugd2l0aCBlYWNoIGNoYW5uZWwgcmVjZWl2ZWQgaW4gdGhlXG4gICogKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IFthPTI1NV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgc3RhdGljIGZyb21SZ2JhKHJhYywgciwgZywgYiwgYSA9IDI1NSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IocmFjLCByLzI1NSwgZy8yNTUsIGIvMjU1LCBhLzI1NSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBvciBxdWFkcnVwbGV0XG4gICogc3RyaW5nLlxuICAqXG4gICogVGhlIGBoZXhTdHJpbmdgIGlzIGV4cGVjdGVkIHRvIGhhdmUgNiBvciA4IGhleCBkaWdpdHMgZm9yIHRoZSBSR0IgYW5kXG4gICogb3B0aW9uYWxseSBhbHBoYSBjaGFubmVscy4gSXQgY2FuIHN0YXJ0IHdpdGggYCNgLiBgQUFCQkNDYCBhbmRcbiAgKiBgI0NDRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMuXG4gICpcbiAgKiBUaGUgdGhyZWUgZGlnaXQgc2hvcnRoYW5kIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBoZXhTdHJpbmdgIGlzIG1pc2Zvcm1hdHRlZCBvciBjYW5ub3QgYmUgcGFyc2VkLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7U3RyaW5nfSBoZXhTdHJpbmcgLSBUaGUgaGV4IHN0cmluZyB0byBpbnRlcnByZXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHN0YXRpYyBmcm9tSGV4KHJhYywgaGV4U3RyaW5nKSB7XG4gICAgaWYgKGhleFN0cmluZy5jaGFyQXQoMCkgPT0gJyMnKSB7XG4gICAgICBoZXhTdHJpbmcgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGlmICghWzYsIDhdLmluY2x1ZGVzKGhleFN0cmluZy5sZW5ndGgpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYFVuZXhwZWN0ZWQgbGVuZ3RoIGZvciBoZXggdHJpcGxldCBzdHJpbmc6ICR7aGV4U3RyaW5nfWApO1xuICAgIH1cblxuICAgIGxldCByU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZygwLCAyKTtcbiAgICBsZXQgZ1N0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoMiwgNCk7XG4gICAgbGV0IGJTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDQsIDYpO1xuICAgIGxldCBhU3RyID0gJ2ZmJztcbiAgICBpZiAoaGV4U3RyaW5nLmxlbmd0aCA9PSA4KSB7XG4gICAgICBhU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZyg2LCA4KTtcbiAgICB9XG5cbiAgICBsZXQgbmV3UiA9IHBhcnNlSW50KHJTdHIsIDE2KTtcbiAgICBsZXQgbmV3RyA9IHBhcnNlSW50KGdTdHIsIDE2KTtcbiAgICBsZXQgbmV3QiA9IHBhcnNlSW50KGJTdHIsIDE2KTtcbiAgICBsZXQgbmV3QSA9IHBhcnNlSW50KGFTdHIsIDE2KTtcblxuICAgIGlmIChpc05hTihuZXdSKSB8fCBpc05hTihuZXdHKSB8fCBpc05hTihuZXdCKSB8fCBpc05hTihuZXdBKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBDb3VsZCBub3QgcGFyc2UgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgbmV3Ui8yNTUsIG5ld0cvMjU1LCBuZXdCLzI1NSwgbmV3QS8yNTUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBGaWxsYCB0aGF0IHVzZXMgYHRoaXNgIGFzIGBjb2xvcmAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICovXG4gIGZpbGwoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLnJhYywgdGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgdGhhdCB1c2VzIGB0aGlzYCBhcyBgY29sb3JgLlxuICAqXG4gICogQHBhcmFtIHs/TnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBuZXcgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgc3Ryb2tlKHdlaWdodCA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHJva2UodGhpcy5yYWMsIHdlaWdodCwgdGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGBhYCBzZXQgdG8gYG5ld0FscGhhYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdBbHBoYSAtIFRoZSBhbHBoYSBjaGFubmVsIGZvciB0aGUgbmV3IGBDb2xvcmAsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHdpdGhBbHBoYShuZXdBbHBoYSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIG5ld0FscGhhKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggYGFgIHNldCB0byBgdGhpcy5hICogcmF0aW9gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgYWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICB3aXRoQWxwaGFSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYSAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIGluIHRoZSBsaW5lYXIgdHJhbnNpdGlvbiBiZXR3ZWVuIGB0aGlzYCBhbmRcbiAgKiBgdGFyZ2V0YCBhdCBhIGByYXRpb2AgaW4gdGhlIHJhbmdlICpbMCwxXSouXG4gICpcbiAgKiBXaGVuIGByYXRpb2AgaXMgYDBgIG9yIGxlc3MgdGhlIG5ldyBgQ29sb3JgIGlzIGVxdWl2YWxlbnQgdG8gYHRoaXNgLFxuICAqIHdoZW4gYHJhdGlvYCBpcyBgMWAgb3IgbGFyZ2VyIHRoZSBuZXcgYENvbG9yYCBpcyBlcXVpdmFsZW50IHRvXG4gICogYHRhcmdldGAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgdHJhbnNpdGlvbiByYXRpbyBmb3IgdGhlIG5ldyBgQ29sb3JgXG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IHRhcmdldCAtIFRoZSB0cmFuc2l0aW9uIHRhcmdldCBgQ29sb3JgXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgbGluZWFyVHJhbnNpdGlvbihyYXRpbywgdGFyZ2V0KSB7XG4gICAgcmF0aW8gPSBNYXRoLm1heChyYXRpbywgMCk7XG4gICAgcmF0aW8gPSBNYXRoLm1pbihyYXRpbywgMSk7XG5cbiAgICBsZXQgbmV3UiA9IHRoaXMuciArICh0YXJnZXQuciAtIHRoaXMucikgKiByYXRpbztcbiAgICBsZXQgbmV3RyA9IHRoaXMuZyArICh0YXJnZXQuZyAtIHRoaXMuZykgKiByYXRpbztcbiAgICBsZXQgbmV3QiA9IHRoaXMuYiArICh0YXJnZXQuYiAtIHRoaXMuYikgKiByYXRpbztcbiAgICBsZXQgbmV3QSA9IHRoaXMuYSArICh0YXJnZXQuYSAtIHRoaXMuYSkgKiByYXRpbztcblxuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIG5ld1IsIG5ld0csIG5ld0IsIG5ld0EpO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29sb3JcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xuXG4iLCIgICd1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBGaWxsIFtjb2xvcl17QGxpbmsgUmFjLkNvbG9yfSBmb3IgZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgd2l0aCBgZmlsbC5hcHBseSgpYCB0byBhcHBseSB0aGUgZmlsbCBzZXR0aW5ncyBnbG9iYWxseSwgb3JcbiogYXMgdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhmaWxsKWAgdG8gYXBwbHkgdGhlIGZpbGwgb25seSBkdXJpbmdcbiogdGhhdCBjYWxsLlxuKlxuKiBXaGVuIGBjb2xvcmAgaXMgYG51bGxgIGEgKm5vLWZpbGwqIHNldHRpbmcgaXMgYXBwbGllZC5cbipcbiogIyMjIGBpbnN0YW5jZS5GaWxsYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkZpbGxgIGZ1bmN0aW9uXXtAbGluayBSYWMjRmlsbH0gdG8gY3JlYXRlIGBGaWxsYCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5GaWxsLm5vbmVgXXtAbGluayBpbnN0YW5jZS5GaWxsI25vbmV9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5GaWxsYF17QGxpbmsgaW5zdGFuY2UuRmlsbH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBmaWxsID0gbmV3IFJhYy5GaWxsKHJhYywgY29sb3IpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlckZpbGwgPSByYWMuRmlsbChjb2xvcilcbipcbiogQHNlZSBbYHJhYy5GaWxsYF17QGxpbmsgUmFjI0ZpbGx9XG4qIEBzZWUgW2BpbnN0YW5jZS5GaWxsYF17QGxpbmsgaW5zdGFuY2UuRmlsbH1cbipcbiogQGFsaWFzIFJhYy5GaWxsXG4qL1xuY2xhc3MgRmlsbCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgRmlsbGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBjb2xvciAtIEEgYENvbG9yYCBmb3IgdGhlIGZpbGwgc2V0dGluZywgb3IgYG51bGxgXG4gICogICB0byBhcHBseSBhICpuby1maWxsKiBzZXR0aW5nXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgY29sb3IpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBgQ29sb3JgIHRvIGFwcGx5IGZvciBmaWxscywgd2hlbiBgbnVsbGAgYSAqbm8tZmlsbCogc2V0dGluZyBpc1xuICAgICogYXBwbGllZC5cbiAgICAqIEB0eXBlIHs/Q29sb3J9XG4gICAgKi9cbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgRmlsbGAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBGaWxsYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgQ29sb3JgLCByZXR1cm5zIGEgbmV3IGBGaWxsYFxuICAqICAgdXNpbmcgYHNvbWV0aGluZ2AgYXMgYGNvbG9yYC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYFN0cm9rZWAsIHJldHVybnMgYSBuZXcgYEZpbGxgXG4gICogICB1c2luZyBgc3Ryb2tlLmNvbG9yYC5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5GaWxsfFJhYy5Db2xvcnxSYWMuU3Ryb2tlfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYSBgRmlsbGAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgRmlsbCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TdHJva2UpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZy5jb2xvcik7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5GaWxsIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBvbmx5IGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXNdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCBgc3R5bGVgLiBXaGVuXG4gICogYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gY29udGFpbiBhbG9uZyBgdGhpc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfFJhYy5GaWxsfVxuICAqL1xuICBhcHBlbmRTdHlsZShzdHlsZSkge1xuICAgIGlmIChzdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgc3R5bGVdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCB0aGUgYFN0cm9rZWBcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuU3Ryb2tlLmZyb219IGBzb21lU3Ryb2tlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlN0cm9rZXxSYWMuQ29sb3J8UmFjLkZpbGx9IHNvbWVTdHJva2UgLSBBbiBvYmplY3QgdG8gZGVyaXZlXG4gICogICBhIGBTdHJva2VgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqXG4gICogQHNlZSBbYHJhYy5TdHJva2UuZnJvbWBde0BsaW5rIFJhYy5TdHJva2UuZnJvbX1cbiAgKi9cbiAgYXBwZW5kU3Ryb2tlKHNvbWVTdHJva2UpIHtcbiAgICBsZXQgc3Ryb2tlID0gUmFjLlN0cm9rZS5mcm9tKHRoaXMucmFjLCBzb21lU3Ryb2tlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIHN0cm9rZV0pO1xuICB9XG5cbn0gLy8gY2xhc3MgRmlsbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gRmlsbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFN0cm9rZSB3ZWlnaHQgYW5kIFtjb2xvcl17QGxpbmsgUmFjLkNvbG9yfSBmb3IgZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgd2l0aCBgc3Ryb2tlLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBzdHJva2Ugc2V0dGluZ3MgZ2xvYmFsbHksXG4qIG9yIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoc3Ryb2tlKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBvbmx5XG4qIGR1cmluZyB0aGF0IGNhbGwuXG4qXG4qIEFwcGx5aW5nIHRoZSBpbnN0YW5jZSBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIGJlaGF2aW91cnM6XG4qICsgQXBwbGllcyBhICoqbm8tc3Ryb2tlKiogc2V0dGluZzsgd2hlbiBgY29sb3IgPSBudWxsYCBhbmQgYHdlaWdodCA9IG51bGxgXG4qICsgQXBwbGllcyAqKm9ubHkgc3Ryb2tlIGNvbG9yKiosIGxlYXZpbmcgd2VpZ2h0IHVuY2hhbmdlZDsgd2hlbiBgY29sb3JgXG4qICAgaXMgc2V0IGFuZCBgd2VpZ2h0ID0gbnVsbGBcbiogKyBBcHBsaWVzICoqb25seSBzdHJva2Ugd2VpZ2h0KiosIGxlYXZpbmcgY29sb3IgdW5jaGFuZ2VkOyB3aGVuIGB3ZWlnaHRgXG4qICAgaXMgc2V0IGFuZCBgY29sb3IgPSBudWxsYFxuKiArIEFwcGxpZXMgKipib3RoIHdlaWdodCBhbmQgY29sb3IqKjsgd2hlbiBib3RoIGBjb2xvcmAgYW5kIGB3ZWlnaHRgIGFyZSBzZXRcbipcbiogIyMjIGBpbnN0YW5jZS5TdHJva2VgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuU3Ryb2tlYCBmdW5jdGlvbl17QGxpbmsgUmFjI1N0cm9rZX0gdG8gY3JlYXRlIGBTdHJva2VgIG9iamVjdHMgd2l0aFxuKiBmZXdlciBwYXJhbWV0ZXJzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlN0cm9rZS5ub25lYF17QGxpbmsgaW5zdGFuY2UuU3Ryb2tlI25vbmV9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5TdHJva2VgXXtAbGluayBpbnN0YW5jZS5TdHJva2V9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgc3Ryb2tlID0gbmV3IFJhYy5TdHJva2UocmFjLCAyLCBjb2xvcilcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyU3Ryb2tlID0gcmFjLlN0cm9rZSgyLCBjb2xvcilcbipcbiogQHNlZSBbYHJhYy5TdHJva2VgXXtAbGluayBSYWMjU3Ryb2tlfVxuKiBAc2VlIFtgaW5zdGFuY2UuU3Ryb2tlYF17QGxpbmsgaW5zdGFuY2UuU3Ryb2tlfVxuKlxuKiBAYWxpYXMgUmFjLlN0cm9rZVxuKi9cbmNsYXNzIFN0cm9rZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU3Ryb2tlYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/TnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwIHdlaWdodFxuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gW2NvbG9yPW51bGxdIC0gQSBgQ29sb3JgIGZvciB0aGUgc3Ryb2tlLCBvciBgbnVsbGBcbiAgKiAgIHRvIHNraXAgY29sb3JcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB3ZWlnaHQsIGNvbG9yID0gbnVsbCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHdlaWdodCAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnROdW1iZXIod2VpZ2h0KTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWNcblxuICAgIC8qKlxuICAgICogVGhlIGBDb2xvcmAgdG8gYXBwbHkgZm9yIHN0cm9rZXMsIHdoZW4gYG51bGxgIG5vIGNvbG9yIHNldHRpbmcgaXNcbiAgICAqIGFwcGxpZWQuXG4gICAgKiBAdHlwZSB7P0NvbG9yfVxuICAgICovXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgd2VpZ2h0IHRvIGFwcGx5IGZvciBzdHJva2VzLCB3aGVuIGBudWxsYCBubyB3ZWlnaHQgc2V0dGluZyBpc1xuICAgICogYXBwbGllZC5cbiAgICAqIEB0eXBlIHs/TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU3Ryb2tlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYFN0cm9rZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYFxuICAqICAgdXNpbmcgYHNvbWV0aGluZ2AgYXMgYGNvbG9yYCBhbmQgYSBgbnVsbGAgc3Ryb2tlIHdlaWdodC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgXG4gICogICB1c2luZyBgZmlsbC5jb2xvcmAgYW5kIGEgYG51bGxgIHN0cm9rZSB3ZWlnaHQuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogICBkZXJpdmUgYSBgU3Ryb2tlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFN0cm9rZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkZpbGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHJhYywgbnVsbCwgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLlN0cm9rZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHRgIHNldCB0byBgbmV3V2VpZ2h0YC5cbiAgKlxuICAqIEBwYXJhbSB7P051bWJlcn0gbmV3V2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgc3Ryb2tlLCBvciBgbnVsbGAgdG8gc2tpcFxuICAqICAgd2VpZ2h0XG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHdpdGhXZWlnaHQobmV3V2VpZ2h0KSB7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIG5ld1dlaWdodCwgdGhpcy5jb2xvciwpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYSBjb3B5IG9mIGBjb2xvcmAgc2V0dXAgd2l0aCBgbmV3QWxwaGFgLFxuICAqIGFuZCB0aGUgc2FtZSBgc3Ryb2tlYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGB0aGlzLmNvbG9yYCBpcyBzZXQgdG8gYG51bGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgaXMgYVxuICAqIGNvcHkgb2YgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld0FscGhhIC0gVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGBjb2xvcmAgb2YgdGhlIG5ld1xuICAqICAgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgaWYgKHRoaXMuY29sb3IgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbnVsbCk7XG4gICAgfVxuXG4gICAgbGV0IG5ld0NvbG9yID0gdGhpcy5jb2xvci53aXRoQWxwaGEobmV3QWxwaGEpO1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbmV3Q29sb3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBvbmx5IGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXNdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCBgc3R5bGVgLiBXaGVuXG4gICogYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gY29udGFpbiBhbG9uZyBgdGhpc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfFJhYy5TdHJva2V9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgRmlsbGBcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuRmlsbC5mcm9tfSBgc29tZUZpbGxgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZUZpbGwgLSBBbiBvYmplY3QgdG8gZGVyaXZlXG4gICogICBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKlxuICAqIEBzZWUgW2ByYWMuRmlsbC5mcm9tYF17QGxpbmsgUmFjLkZpbGwuZnJvbX1cbiAgKi9cbiAgYXBwZW5kRmlsbChzb21lRmlsbCkge1xuICAgIGxldCBmaWxsID0gUmFjLkZpbGwuZnJvbSh0aGlzLnJhYywgc29tZUZpbGwpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgZmlsbF0pO1xuICB9XG5cbn0gLy8gY2xhc3MgU3Ryb2tlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJva2U7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250YWluZXIgb2YgYFtTdHJva2Vde0BsaW5rIFJhYy5TdHJva2V9YCBhbmQgYFtGaWxsXXtAbGluayBSYWMuRmlsbH1gXG4qIG9iamVjdHMgd2hpY2ggZ2V0IGFwcGxpZWQgc2VxdWVudGlhbGx5IHdoZW4gZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgYXMgYGNvbnRhaW5lci5hcHBseSgpYCB0byBhcHBseSB0aGUgY29udGFpbmVkIHN0eWxlc1xuKiBnbG9iYWxseSwgb3IgYXMgdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhjb250YWluZXIpYCB0byBhcHBseSB0aGVcbiogc3R5bGUgc2V0dGluZ3Mgb25seSBmb3IgdGhhdCBgZHJhd2AuXG4qXG4qIEBhbGlhcyBSYWMuU3R5bGVDb250YWluZXJcbiovXG5jbGFzcyBTdHlsZUNvbnRhaW5lciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBzdHlsZXMgPSBbXSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIENvbnRhaW5lciBvZiBzdHlsZSBvYmplY3RzIHRvIGFwcGx5LlxuICAgICpcbiAgICAqIENhbiBiZSBtYW5pcHVsYXRlZCBkaXJlY3RseSB0byBhZGQgb3IgcmVtb3ZlIHN0eWxlcyBmcm9tIGB0aGlzYC5cbiAgICAqIE1vc3Qgb2YgdGhlIGltcGxlbWVudGVkIG1ldGhvZHMgbGlrZVxuICAgICogYFthZGRde0BsaW5rIFJhYy5TdHlsZUNvbnRhaW5lciNhZGR9YCByZXR1cm4gYSBuZXcgYFN0eWxlQ29udGFpbmVyYFxuICAgICogd2l0aCBhbiBjb3B5IG9mIGB0aGlzLnN0eWxlc2AuXG4gICAgKlxuICAgICogQHR5cGUge0FycmF5fVxuICAgICovXG4gICAgdGhpcy5zdHlsZXMgPSBzdHlsZXM7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IGNvbnRlbnRzID0gdGhpcy5zdHlsZXMuam9pbignICcpO1xuICAgIHJldHVybiBgU3R5bGVDb250YWluZXIoJHtjb250ZW50c30pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYSBjb3B5IG9mIGB0aGlzLnN0eWxlc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIHRoaXMuc3R5bGVzLnNsaWNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgd2l0aCBgc3R5bGVgIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2ZcbiAgKiBgc3R5bGVzYC4gV2hlbiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIGB0aGlzYCBpcyBub3QgbW9kaWZpZWQgYnkgdGhpcyBtZXRob2QsIHRoZSBuZXcgYFN0eWxlQ29udGFpbmVyYCBpc1xuICAqIGNyZWF0ZWQgd2l0aCBhIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBhcHBlbmQgdG8gYHN0eWxlc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBhcHBlbmRTdHlsZShzdHlsZSkge1xuICAgIGlmIChzdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbGV0IHN0eWxlc0NvcHkgPSB0aGlzLnN0eWxlcy5zbGljZSgpO1xuICAgIHN0eWxlc0NvcHkucHVzaChzdHlsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIHN0eWxlc0NvcHkpO1xuICB9XG5cbn0gLy8gY2xhc3MgU3R5bGVDb250YWluZXJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0eWxlQ29udGFpbmVyO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLkNvbG9yYCBmdW5jdGlvbl17QGxpbmsgUmFjI0NvbG9yfS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BDb2xvcmBde0BsaW5rIFJhYy5Db2xvcn0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5Db2xvci5yZWQgLy8gcmVhZHktbWFkZSByZWQgY29sb3JcbiogcmFjLkNvbG9yLnJlZC5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQ29sb3JcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0NvbG9yKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggZWFjaCBjaGFubmVsIHJlY2VpdmVkIGluIHRoZSAqWzAsMjU1XSogcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gW2E9MjU1XSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21SZ2JhXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuZnJvbVJnYmEgPSBmdW5jdGlvbihyLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tUmdiYShyYWMsIHIsIGcsIGIsIGEpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlIGZyb20gYSBoZXhhZGVjaW1hbCB0cmlwbGV0IG9yIHF1YWRydXBsZXRcbiAgKiBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IG9yIDggaGV4IGRpZ2l0cyBmb3IgdGhlIFJHQiBhbmRcbiAgKiBvcHRpb25hbGx5IGFscGhhIGNoYW5uZWxzLiBJdCBjYW4gc3RhcnQgd2l0aCBgI2AuIGBBQUJCQ0NgIGFuZFxuICAqIGAjQ0NEREVFRkZgIGFyZSBib3RoIHZhbGlkIGlucHV0cy5cbiAgKlxuICAqIFRoZSB0aHJlZSBkaWdpdCBzaG9ydGhhbmQgaXMgbm90IHlldCBzdXBwb3J0ZWQuXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGhleFN0cmluZ2AgaXMgbWlzZm9ybWF0dGVkIG9yIGNhbm5vdCBiZSBwYXJzZWQuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIGhleCBzdHJpbmcgdG8gaW50ZXJwcmV0XG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tSGV4XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuZnJvbUhleCA9IGZ1bmN0aW9uKGhleFN0cmluZykge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbUhleChyYWMsIGhleFN0cmluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIEEgYENvbG9yYCB3aXRoIGFsbCBjaGFubmVscyBzZXQgdG8gYDBgLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLnplcm8gPSByYWMuQ29sb3IoMCwgMCwgMCwgMCk7XG5cblxuICAvKipcbiAgKiBBIGJsYWNrIGBDb2xvcmAuXG4gICpcbiAgKiBAbmFtZSBibGFja1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLmJsYWNrICAgPSByYWMuQ29sb3IoMCwgMCwgMCk7XG5cbiAgLyoqXG4gICogQSB3aGl0ZSBgQ29sb3JgLCB3aXRoIGFsbCBjaGFubmVscyBzZXQgdG8gYDFgLlxuICAqXG4gICogQWxzbyBhdmFpbGFibGUgYXMgYG9uZWAuXG4gICpcbiAgKiBAbmFtZSB3aGl0ZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLndoaXRlICAgPSByYWMuQ29sb3IoMSwgMSwgMSk7XG4gIHJhYy5Db2xvci5vbmUgPSByYWMuQ29sb3Iud2hpdGU7XG5cbiAgLyoqXG4gICogQSByZWQgYENvbG9yYC5cbiAgKlxuICAqIEBuYW1lIHJlZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLnJlZCAgICAgPSByYWMuQ29sb3IoMSwgMCwgMCk7XG5cbiAgcmFjLkNvbG9yLmdyZWVuICAgPSByYWMuQ29sb3IoMCwgMSwgMCk7XG4gIHJhYy5Db2xvci5ibHVlICAgID0gcmFjLkNvbG9yKDAsIDAsIDEpO1xuICByYWMuQ29sb3IueWVsbG93ICA9IHJhYy5Db2xvcigxLCAxLCAwKTtcbiAgcmFjLkNvbG9yLm1hZ2VudGEgPSByYWMuQ29sb3IoMSwgMCwgMSk7XG4gIHJhYy5Db2xvci5jeWFuICAgID0gcmFjLkNvbG9yKDAsIDEsIDEpO1xuXG59IC8vIGF0dGFjaFJhY0NvbG9yXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuRmlsbGAgZnVuY3Rpb25de0BsaW5rIFJhYyNGaWxsfS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BGaWxsYF17QGxpbmsgUmFjLkZpbGx9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuRmlsbC5ub25lIC8vIHJlYWR5LW1hZGUgbm9uZSBmaWxsXG4qIHJhYy5GaWxsLm5vbmUucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkZpbGxcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0ZpbGwocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgRmlsbGAgd2l0aG91dCBjb2xvci4gUmVtb3ZlcyB0aGUgZmlsbCBjb2xvciB3aGVuIGFwcGxpZWQuXG4gICogQG5hbWUgbm9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5GaWxsI1xuICAqL1xuICByYWMuRmlsbC5ub25lID0gcmFjLkZpbGwobnVsbCk7XG5cbn0gLy8gYXR0YWNoUmFjRmlsbFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlN0cm9rZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNTdHJva2V9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYFN0cm9rZWBde0BsaW5rIFJhYy5TdHJva2V9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuU3Ryb2tlLm5vbmUgLy8gcmVhZHktbWFkZSBub25lIHN0cm9rZVxuKiByYWMuU3Ryb2tlLm5vbmUucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlN0cm9rZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU3Ryb2tlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYFN0cm9rZWAgd2l0aCBubyB3ZWlnaHQgYW5kIG5vIGNvbG9yLiBVc2luZyBvciBhcHBseWluZyB0aGlzIHN0cm9rZVxuICAqIHdpbGwgZGlzYWJsZSBzdHJva2UgZHJhd2luZy5cbiAgKlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU3Ryb2tlI1xuICAqL1xuICByYWMuU3Ryb2tlLm5vbmUgPSByYWMuU3Ryb2tlKG51bGwpO1xuXG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHQgPSAxYCBhbmQgbm8gY29sb3IuIFVzaW5nIG9yIGFwcGx5aW5nIHRoaXNcbiAgKiBzdHJva2Ugd2lsbCBvbmx5IHNldCB0aGUgc3Ryb2tlIHdlaWdodCB0byBgMWAgbGVhdmluZyBzdHJva2UgY29sb3JcbiAgKiB1bmNoYW5nZWQuXG4gICpcbiAgKiBAbmFtZSBvbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU3Ryb2tlI1xuICAqL1xuICByYWMuU3Ryb2tlLm9uZSA9IHJhYy5TdHJva2UoMSk7XG5cbn0gLy8gYXR0YWNoUmFjU3Ryb2tlXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8vIEltcGxlbWVudGF0aW9uIG9mIGFuIGVhc2UgZnVuY3Rpb24gd2l0aCBzZXZlcmFsIG9wdGlvbnMgdG8gdGFpbG9yIGl0c1xuLy8gYmVoYXZpb3VyLiBUaGUgY2FsY3VsYXRpb24gdGFrZXMgdGhlIGZvbGxvd2luZyBzdGVwczpcbi8vIFZhbHVlIGlzIHJlY2VpdmVkLCBwcmVmaXggaXMgcmVtb3ZlZFxuLy8gICBWYWx1ZSAtPiBlYXNlVmFsdWUodmFsdWUpXG4vLyAgICAgdmFsdWUgPSB2YWx1ZSAtIHByZWZpeFxuLy8gUmF0aW8gaXMgY2FsY3VsYXRlZFxuLy8gICByYXRpbyA9IHZhbHVlIC8gaW5SYW5nZVxuLy8gUmF0aW8gaXMgYWRqdXN0ZWRcbi8vICAgcmF0aW8gLT4gZWFzZVJhdGlvKHJhdGlvKVxuLy8gICAgIGFkanVzdGVkUmF0aW8gPSAocmF0aW8gKyByYXRpb09mc2V0KSAqIHJhdGlvRmFjdG9yXG4vLyBFYXNlIGlzIGNhbGN1bGF0ZWRcbi8vICAgZWFzZWRSYXRpbyA9IGVhc2VVbml0KGFkanVzdGVkUmF0aW8pXG4vLyBFYXNlZFJhdGlvIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFJhdGlvID0gKGVhc2VkUmF0aW8gKyBlYXNlT2ZzZXQpICogZWFzZUZhY3RvclxuLy8gICBlYXNlUmF0aW8ocmF0aW8pIC0+IGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIHByb2plY3RlZFxuLy8gICBlYXNlZFZhbHVlID0gdmFsdWUgKiBlYXNlZFJhdGlvXG4vLyBWYWx1ZSBpcyBhZGp1c3RlZCBhbmQgcmV0dXJuZWRcbi8vICAgZWFzZWRWYWx1ZSA9IHByZWZpeCArIChlYXNlZFZhbHVlICogb3V0UmFuZ2UpXG4vLyAgIGVhc2VWYWx1ZSh2YWx1ZSkgLT4gZWFzZWRWYWx1ZVxuY2xhc3MgRWFzZUZ1bmN0aW9uIHtcblxuICAvLyBCZWhhdmlvcnMgZm9yIHRoZSBgZWFzZVZhbHVlYCBmdW5jdGlvbiB3aGVuIGB2YWx1ZWAgZmFsbHMgYmVmb3JlIHRoZVxuICAvLyBgcHJlZml4YCBhbmQgYWZ0ZXIgYGluUmFuZ2VgLlxuICBzdGF0aWMgQmVoYXZpb3IgPSB7XG4gICAgLy8gYHZhbHVlYCBpcyByZXR1cm5lZCB3aXRob3V0IGFueSBlYXNpbmcgdHJhbnNmb3JtYXRpb24uIGBwcmVGYWN0b3JgXG4gICAgLy8gYW5kIGBwb3N0RmFjdG9yYCBhcmUgYXBwbGllZC4gVGhpcyBpcyB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICAgIHBhc3M6IFwicGFzc1wiLFxuICAgIC8vIENsYW1wcyB0aGUgcmV0dXJuZWQgdmFsdWUgdG8gYHByZWZpeGAgb3IgYHByZWZpeCtpblJhbmdlYDtcbiAgICBjbGFtcDogXCJjbGFtcFwiLFxuICAgIC8vIFJldHVybnMgdGhlIGFwcGxpZWQgZWFzaW5nIHRyYW5zZm9ybWF0aW9uIHRvIGB2YWx1ZWAgZm9yIHZhbHVlc1xuICAgIC8vIGJlZm9yZSBgcHJlZml4YCBhbmQgYWZ0ZXIgYGluUmFuZ2VgLlxuICAgIGNvbnRpbnVlOiBcImNvbnRpbnVlXCJcbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmEgPSAyO1xuXG4gICAgLy8gQXBwbGllZCB0byByYXRpbyBiZWZvcmUgZWFzaW5nLlxuICAgIHRoaXMucmF0aW9PZmZzZXQgPSAwXG4gICAgdGhpcy5yYXRpb0ZhY3RvciA9IDE7XG5cbiAgICAvLyBBcHBsaWVkIHRvIGVhc2VkUmF0aW8uXG4gICAgdGhpcy5lYXNlT2Zmc2V0ID0gMFxuICAgIHRoaXMuZWFzZUZhY3RvciA9IDE7XG5cbiAgICAvLyBEZWZpbmVzIHRoZSBsb3dlciBsaW1pdCBvZiBgdmFsdWVgYCB0byBhcHBseSBlYXNpbmcuXG4gICAgdGhpcy5wcmVmaXggPSAwO1xuXG4gICAgLy8gYHZhbHVlYCBpcyByZWNlaXZlZCBpbiBgaW5SYW5nZWAgYW5kIG91dHB1dCBpbiBgb3V0UmFuZ2VgLlxuICAgIHRoaXMuaW5SYW5nZSA9IDE7XG4gICAgdGhpcy5vdXRSYW5nZSA9IDE7XG5cbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGJlZm9yZSBgcHJlZml4YC5cbiAgICB0aGlzLnByZUJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLnBhc3M7XG4gICAgLy8gQmVoYXZpb3IgZm9yIHZhbHVlcyBhZnRlciBgcHJlZml4K2luUmFuZ2VgLlxuICAgIHRoaXMucG9zdEJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLnBhc3M7XG5cbiAgICAvLyBGb3IgYSBgcHJlQmVoYXZpb3JgIG9mIGBwYXNzYCwgdGhlIGZhY3RvciBhcHBsaWVkIHRvIHZhbHVlcyBiZWZvcmVcbiAgICAvLyBgcHJlZml4YC5cbiAgICB0aGlzLnByZUZhY3RvciA9IDE7XG4gICAgLy8gRm9yIGEgYHBvc3RCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdGhlIHZhbHVlc1xuICAgIC8vIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0RmFjdG9yID0gMTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgZWFzZWQgdmFsdWUgZm9yIGB1bml0YC4gQm90aCB0aGUgZ2l2ZW5cbiAgLy8gYHVuaXRgIGFuZCB0aGUgcmV0dXJuZWQgdmFsdWUgYXJlIGluIHRoZSBbMCwxXSByYW5nZS4gSWYgYHVuaXRgIGlzXG4gIC8vIG91dHNpZGUgdGhlIFswLDFdIHRoZSByZXR1cm5lZCB2YWx1ZSBmb2xsb3dzIHRoZSBjdXJ2ZSBvZiB0aGUgZWFzaW5nXG4gIC8vIGZ1bmN0aW9uLCB3aGljaCBtYXkgYmUgaW52YWxpZCBmb3Igc29tZSB2YWx1ZXMgb2YgYGFgLlxuICAvL1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHRoZSBiYXNlIGVhc2luZyBmdW5jdGlvbiwgaXQgZG9lcyBub3QgYXBwbHkgYW55XG4gIC8vIG9mZnNldHMgb3IgZmFjdG9ycy5cbiAgZWFzZVVuaXQodW5pdCkge1xuICAgIC8vIFNvdXJjZTpcbiAgICAvLyBodHRwczovL21hdGguc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzEyMTcyMC9lYXNlLWluLW91dC1mdW5jdGlvbi8xMjE3NTUjMTIxNzU1XG4gICAgLy8gZih0KSA9ICh0XmEpLyh0XmErKDEtdCleYSlcbiAgICBsZXQgcmEgPSBNYXRoLnBvdyh1bml0LCB0aGlzLmEpO1xuICAgIGxldCBpcmEgPSBNYXRoLnBvdygxLXVuaXQsIHRoaXMuYSk7XG4gICAgcmV0dXJuIHJhIC8gKHJhICsgaXJhKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGVhc2UgZnVuY3Rpb24gYXBwbGllZCB0byB0aGUgZ2l2ZW4gcmF0aW8uIGByYXRpb09mZnNldGBcbiAgLy8gYW5kIGByYXRpb0ZhY3RvcmAgYXJlIGFwcGxpZWQgdG8gdGhlIGlucHV0LCBgZWFzZU9mZnNldGAgYW5kXG4gIC8vIGBlYXNlRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgb3V0cHV0LlxuICBlYXNlUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHRoaXMucmF0aW9PZmZzZXQpICogdGhpcy5yYXRpb0ZhY3RvcjtcbiAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbyk7XG4gICAgcmV0dXJuIChlYXNlZFJhdGlvICsgdGhpcy5lYXNlT2Zmc2V0KSAqIHRoaXMuZWFzZUZhY3RvcjtcbiAgfVxuXG4gIC8vIEFwcGxpZXMgdGhlIGVhc2luZyBmdW5jdGlvbiB0byBgdmFsdWVgIGNvbnNpZGVyaW5nIHRoZSBjb25maWd1cmF0aW9uXG4gIC8vIG9mIHRoZSB3aG9sZSBpbnN0YW5jZS5cbiAgZWFzZVZhbHVlKHZhbHVlKSB7XG4gICAgbGV0IGJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yO1xuXG4gICAgbGV0IHNoaWZ0ZWRWYWx1ZSA9IHZhbHVlIC0gdGhpcy5wcmVmaXg7XG4gICAgbGV0IHJhdGlvID0gc2hpZnRlZFZhbHVlIC8gdGhpcy5pblJhbmdlO1xuXG4gICAgLy8gQmVmb3JlIHByZWZpeFxuICAgIGlmICh2YWx1ZSA8IHRoaXMucHJlZml4KSB7XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IucGFzcykge1xuICAgICAgICBsZXQgZGlzdGFuY2V0b1ByZWZpeCA9IHZhbHVlIC0gdGhpcy5wcmVmaXg7XG4gICAgICAgIC8vIFdpdGggYSBwcmVGYWN0b3Igb2YgMSB0aGlzIGlzIGVxdWl2YWxlbnQgdG8gYHJldHVybiByYW5nZWBcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgKGRpc3RhbmNldG9QcmVmaXggKiB0aGlzLnByZUZhY3Rvcik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY2xhbXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLmNvbnRpbnVlKSB7XG4gICAgICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlUmF0aW8ocmF0aW8pO1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBlYXNlZFJhdGlvICogdGhpcy5vdXRSYW5nZTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBwcmVCZWhhdmlvciBjb25maWd1cmF0aW9uIC0gcHJlQmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICAgIHRocm93IHJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICAvLyBBZnRlciBwcmVmaXhcbiAgICBpZiAocmF0aW8gPD0gMSB8fCB0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgIC8vIEVhc2UgZnVuY3Rpb24gYXBwbGllZCB3aXRoaW4gcmFuZ2UgKG9yIGFmdGVyKVxuICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBlYXNlZFJhdGlvICogdGhpcy5vdXRSYW5nZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAvLyBTaGlmdGVkIHRvIGhhdmUgaW5SYW5nZSBhcyBvcmlnaW5cbiAgICAgIGxldCBzaGlmdGVkUG9zdCA9IHNoaWZ0ZWRWYWx1ZSAtIHRoaXMuaW5SYW5nZTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMub3V0UmFuZ2UgKyBzaGlmdGVkUG9zdCAqIHRoaXMucG9zdEZhY3RvcjtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZTtcbiAgICB9XG5cbiAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHBvc3RCZWhhdmlvciBjb25maWd1cmF0aW9uIC0gcG9zdEJlaGF2aW9yOiR7dGhpcy5wb3N0QmVoYXZpb3J9YCk7XG4gICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICB9XG5cblxuICAvLyBQcmVjb25maWd1cmVkIGZ1bmN0aW9uc1xuXG4gIC8vIE1ha2VzIGFuIGVhc2VGdW5jdGlvbiBwcmVjb25maWd1cmVkIHRvIGFuIGVhc2Ugb3V0IG1vdGlvbi5cbiAgLy9cbiAgLy8gVGhlIGBvdXRSYW5nZWAgdmFsdWUgc2hvdWxkIGJlIGBpblJhbmdlKjJgIGluIG9yZGVyIGZvciB0aGUgZWFzZVxuICAvLyBtb3Rpb24gdG8gY29ubmVjdCB3aXRoIHRoZSBleHRlcm5hbCBtb3Rpb24gYXQgdGhlIGNvcnJlY3QgdmVsb2NpdHkuXG4gIHN0YXRpYyBtYWtlRWFzZU91dCgpIHtcbiAgICBsZXQgZWFzZU91dCA9IG5ldyBFYXNlRnVuY3Rpb24oKVxuICAgIGVhc2VPdXQucmF0aW9PZmZzZXQgPSAxO1xuICAgIGVhc2VPdXQucmF0aW9GYWN0b3IgPSAuNTtcbiAgICBlYXNlT3V0LmVhc2VPZmZzZXQgPSAtLjU7XG4gICAgZWFzZU91dC5lYXNlRmFjdG9yID0gMjtcbiAgICByZXR1cm4gZWFzZU91dDtcbiAgfVxuXG59IC8vIGNsYXNzIEVhc2VGdW5jdGlvblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRWFzZUZ1bmN0aW9uO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRocm93YWJsZSBvYmplY3QgdG8gcmVwb3J0IGVycm9ycywgYW5kIGNvbnRhaW5lciBvZiBjb252ZW5pZW5jZSBmdW5jdGlvbnNcbiogdG8gY3JlYXRlIHRoZXNlLlxuKlxuKiBUaGUgc3RhdGljIGZ1bmN0aW9ucyBjcmVhdGUgZWl0aGVyIGBFeGNlcHRpb25gIG9yIGBFcnJvcmAgaW5zdGFuY2VzLFxuKiBzaW5jZSBkaWZmZXJlbnQgZW52aXJvbm1lbnRzIHJlc3BvbmQgZGlmZmVyZW50ZWx5IHRvIHRoZXNlIHRocm93cy4gRm9yXG4qIG1vcmUgZGV0YWlscyBzZWUgW2BidWlsZHNFcnJvcnNgXXtAbGluayBSYWMuRXhjZXB0aW9uLmJ1aWxkc0Vycm9yc30uXG4qXG4qIEBhbGlhcyBSYWMuRXhjZXB0aW9uXG4qL1xuY2xhc3MgRXhjZXB0aW9uIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBFeGNlcHRpb25gIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICogICBUaGUgbmFtZSBvZiB0aGUgZXhjZXB0aW9uXG4gICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgKiAgIFRoZSBtZXNzYWdlIG9mIHRoZSBleGNlcHRpb25cbiAgKi9cbiAgY29uc3RydWN0b3IobmFtZSwgbWVzc2FnZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIChuZXcgUmFjLkV4Y2VwdGlvbignTm90QVBhbmdyYW0nLCAnV2FsdHosIGJhZCBueW1waCcpKS50b1N0cmluZygpXG4gICogLy8gUmV0dXJuczogJ0V4Y2VwdGlvbjpOb3RBUGFuZ3JhbSAtIFdhbHR6LCBiYWQgbnltcGgnXG4gICpcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEV4Y2VwdGlvbjoke3RoaXMubmFtZX0gLSAke3RoaXMubWVzc2FnZX1gO1xuICB9XG5cblxuICAvKipcbiAgKiBXaGVuIGB0cnVlYCB0aGUgY29udmVuaWVuY2Ugc3RhdGljIGZ1bmN0aW9ucyBvZiB0aGlzIGNsYXNzIHdpbGxcbiAgKiBidWlsZCBgRXJyb3JgIG9iamVjdHMsIG90aGVyd2lzZSBgRXhjZXB0aW9uYCBvYmplY3RzIGFyZSBidWlsdC5cbiAgKlxuICAqIERlZmF1bHRzIHRvIGBmYWxzZWAgZm9yIGJyb3dzZXIgdXNlOiB0aHJvd2luZyBhbiBgRXhjZXB0aW9uYCBpbiBjaHJvbWVcbiAgKiBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgdXNpbmcgc291cmNlLW1hcHMgd2hlbiBhdmFpbGFibGUuIEluIGNvbnRyYXN0XG4gICogdGhyb3dpbmcgYW4gYEVycm9yYCBvYmplY3QgZGlzcGxheXMgdGhlIGVycm9yIHN0YWNrIHJlbGF0aXZlIHRvIHRoZVxuICAqIGJ1bmRsZWQgZmlsZSwgd2hpY2ggaXMgaGFyZGVyIHRvIHJlYWQuXG4gICpcbiAgKiBVc2VkIGFzIGB0cnVlYCBmb3IgdGVzdCBydW5zIGluIEplc3Q6IHRocm93aW5nIGFuIGBFcnJvcmAgd2lsbCBiZVxuICAqIHJlcG9ydGVkIGluIHRoZSB0ZXN0IHJlcG9ydCwgd2hpbGUgdGhyb3dpbmcgYSBjdXN0b20gb2JqZWN0IChsaWtlXG4gICogYEV4Y2VwdGlvbmApIHdpdGhpbiBhIG1hdGNoZXIgcmVzdWx0cyBpbiB0aGUgZXhwZWN0YXRpb24gaGFuZ2luZ1xuICAqIGluZGVmaW5pdGVseS5cbiAgKlxuICAqIEB0eXBlIHtCb29sZWFufVxuICAqIEBkZWZhdWx0IGZhbHNlXG4gICpcbiAgKiBAbWVtYmVyb2YgUmFjLkV4Y2VwdGlvblxuICAqL1xuICBzdGF0aWMgYnVpbGRzRXJyb3JzID0gZmFsc2U7XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGJ1aWxkcyB0aHJvd2FibGUgb2JqZWN0cyB3aXRoIHRoZSBnaXZlblxuICAqIGBuYW1lYC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IGZhY3RvcnkgPSBSYWMuRXhjZXB0aW9uLm5hbWVkKCdOb3RBUGFuZ3JhbScpXG4gICogZmFjdG9yeS5leGNlcHRpb25OYW1lIC8vIHJldHVybnMgJ05vdEFQYW5ncmFtJ1xuICAqIGZhY3RvcnkoJ1dhbHR6LCBiYWQgbnltcGgnKS50b1N0cmluZygpXG4gICogLy8gcmV0dXJuczogJ0V4Y2VwdGlvbjpOb3RBUGFuZ3JhbSAtIFdhbHR6LCBiYWQgbnltcGgnXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIGZvciB0aGUgcHJvZHVjZWQgdGhyb3dhYmxlIG9iamVjdHNcbiAgKiBAcmV0dXJuIHtSYWMuRXhjZXB0aW9ufm5hbWVkRmFjdG9yeX1cbiAgKi9cbiAgc3RhdGljIG5hbWVkKG5hbWUpIHtcbiAgICAvKipcbiAgICAqIEZhY3RvcnkgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgdGhyb3dhYmxlIG9iamVjdCB3aXRoIHRoZSBnaXZlblxuICAgICogYG1lc3NhZ2VgLlxuICAgICpcbiAgICAqIEBjYWxsYmFjayBSYWMuRXhjZXB0aW9ufm5hbWVkRmFjdG9yeVxuICAgICpcbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBleGNlcHRpb25OYW1lXG4gICAgKiAgIFRoZSBuYW1lIGZvciB0aGUgcHJvZHVjZWQgdGhyb3dhYmxlIG9iamVjdHNcbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlXG4gICAgKiAgIFRoZSBtZXNzYWdlIGZvciB0aGUgcHJvZHVjZWQgdGhyb3dhYmxlIG9iamVjdC5cbiAgICAqXG4gICAgKiBAcmV0dXJuIHtFeGNlcHRpb258RXJyb3J9XG4gICAgKi9cbiAgICBsZXQgZnVuYyA9IChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAoRXhjZXB0aW9uLmJ1aWxkc0Vycm9ycykge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgICAgZXJyb3IubmFtZSA9IG5hbWU7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBFeGNlcHRpb24obmFtZSwgbWVzc2FnZSk7XG4gICAgfTtcblxuICAgIGZ1bmMuZXhjZXB0aW9uTmFtZSA9IG5hbWU7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cblxuICBzdGF0aWMgZHJhd2VyTm90U2V0dXAgICAgICAgICAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0RyYXdlck5vdFNldHVwJyk7XG4gIHN0YXRpYyBmYWlsZWRBc3NlcnQgICAgICAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnRmFpbGVkQXNzZXJ0Jyk7XG4gIHN0YXRpYyBpbnZhbGlkT2JqZWN0VHlwZSAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnSW52YWxpZE9iamVjdFR5cGUnKTtcbiAgc3RhdGljIGFic3RyYWN0RnVuY3Rpb25DYWxsZWQgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdBYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkJyk7XG4gIC8vIFRPRE86IG1pZ3JhdGUgcmVzdCBvZiBpbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICBzdGF0aWMgaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24gPSBFeGNlcHRpb24ubmFtZWQoJ0ludmFsaWRPYmplY3RDb25maWd1cmF0aW9uJyk7XG5cbiAgLy8gaW52YWxpZFBhcmFtZXRlckNvbWJpbmF0aW9uOiAnSW52YWxpZCBwYXJhbWV0ZXIgY29tYmluYXRpb24nLFxuXG4gIC8vIGludmFsaWRPYmplY3RUb0RyYXc6ICdJbnZhbGlkIG9iamVjdCB0byBkcmF3JyxcbiAgLy8gaW52YWxpZE9iamVjdFRvQXBwbHk6ICdJbnZhbGlkIG9iamVjdCB0byBhcHBseScsXG5cbn0gLy8gY2xhc3MgRXhjZXB0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFeGNlcHRpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogSW50ZXJuYWwgdXRpbGl0aWVzLlxuKlxuKiBBdmFpbGFibGUgdGhyb3VnaCBge0BsaW5rIFJhYy51dGlsc31gIG9yIFtgcmFjLnV0aWxzYF17QGxpbmsgUmFjI3V0aWxzfS5cbipcbiogQG5hbWVzcGFjZSB1dGlsc1xuKi9cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBwYXNzZWQgcGFyYW1ldGVycyBhcmUgb2JqZWN0cyBvciBwcmltaXRpdmVzLiBJZiBhbnlcbiogcGFyYW1ldGVyIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCBhIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YFxuKiBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uKE9iamVjdHxwcmltaXRpdmUpfSBwYXJhbWV0ZXJzXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0RXhpc3RzXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydEV4aXN0cyA9IGZ1bmN0aW9uKC4uLnBhcmFtZXRlcnMpIHtcbiAgcGFyYW1ldGVycy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEZvdW5kIG51bGwsIGV4cGVjdGluZyBlbGVtZW50IHRvIGV4aXN0IGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRm91bmQgdW5kZWZpbmVkLCBleHBlY3RpbmcgZWxlbWVudCB0byBleGlzdCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgb2JqZWN0cyBvciB0aGUgZ2l2ZW4gYHR5cGVgLCBvdGhlcndpc2UgYVxuKiBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBXaGVuIGFueSBtZW1iZXIgb2YgYGVsZW1lbnRzYCBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIHRoZSBleGNlcHRpb24gaXNcbiogYWxzbyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHR5cGVcbiogQHBhcmFtIHsuLi5PYmplY3R9IGVsZW1lbnRzXG4qXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0VHlwZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRUeXBlID0gZnVuY3Rpb24odHlwZSwgLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUgLSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZXhwZWN0ZWQtdHlwZS1uYW1lOiR7dHlwZS5uYW1lfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG51bWJlciBwcmltaXRpdmVzIGFuZCBub3QgTmFOLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLk51bWJlcn0gZWxlbWVudHNcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnROdW1iZXJcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0TnVtYmVyID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdudW1iZXInIHx8IGlzTmFOKGl0ZW0pKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgbnVtYmVyIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIHN0cmluZyBwcmltaXRpdmVzLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLlN0cmluZ30gZWxlbWVudHNcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRTdHJpbmdcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0U3RyaW5nID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3Rpbmcgc3RyaW5nIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIGJvb2xlYW4gcHJpbWl0aXZlcywgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5Cb29sZWFufSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydEJvb2xlYW5cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0Qm9vbGVhbiA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBib29sZWFuIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3RvciBuYW1lIG9mIGBvYmpgLCBvciBpdHMgdHlwZSBuYW1lLlxuKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgZGVidWdnaW5nIGFuZCBlcnJvcnMuXG4qXG4qIEBwYXJhbSB7T2JqZWN0fSBvYmogLSBBbiBgT2JqZWN0YCB0byBnZXQgaXRzIHR5cGUgbmFtZVxuKiBAcmV0dXJucyB7U3RyaW5nfVxuKlxuKiBAZnVuY3Rpb24gdHlwZU5hbWVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKG9iaikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuICd1bmRlZmluZWQnOyB9XG4gIGlmIChvYmogPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5uYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gb2JqLm5hbWUgPT0gJydcbiAgICAgID8gYGZ1bmN0aW9uYFxuICAgICAgOiBgZnVuY3Rpb246JHtvYmoubmFtZX1gO1xuICB9XG4gIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA/PyB0eXBlb2Ygb2JqO1xufVxuZXhwb3J0cy50eXBlTmFtZSA9IHR5cGVOYW1lO1xuXG5cbi8qKlxuKiBBZGRzIGEgY29uc3RhbnQgdG8gdGhlIGdpdmVuIG9iamVjdCwgdGhlIGNvbnN0YW50IGlzIG5vdCBlbnVtZXJhYmxlIGFuZFxuKiBub3QgY29uZmlndXJhYmxlLlxuKlxuKiBAZnVuY3Rpb24gYWRkQ29uc3RhbnRUb1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hZGRDb25zdGFudFRvID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgdmFsdWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfSk7XG59XG5cblxuLyoqXG4qIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYG51bWJlcmAgZGlzcGxheWluZyBhbGwgYXZhaWxhYmxlXG4qIGRpZ2l0cywgb3IgZm9ybW1hdHRlZCB1c2VkIGZpeGVkLXBvaW50IG5vdGF0aW9uIGxpbWl0ZWQgdG8gYGRpZ2l0c2AuXG4qXG4qIEBwYXJhbSB7TnVtYmVyfSBudW1iZXIgLSBUaGUgbnVtYmVyIHRvIGZvcm1hdFxuKiBAcGFyYW0gez9OdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIGFtb3VudCBvZiBkaWdpdHMgdG8gcHJpbnQsIG9yIGBudWxsYCB0b1xuKiBwcmludCBhbGwgZGlnaXRzXG4qXG4qIEByZXR1cm5zIHtTdHJpbmd9XG4qXG4qIEBmdW5jdGlvbiBjdXREaWdpdHNcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuY3V0RGlnaXRzID0gZnVuY3Rpb24obnVtYmVyLCBkaWdpdHMgPSBudWxsKSB7XG4gIHJldHVybiBkaWdpdHMgPT09IG51bGxcbiAgICA/IG51bWJlci50b1N0cmluZygpXG4gICAgOiBudW1iZXIudG9GaXhlZChkaWdpdHMpO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIGB0cnVlYCBpZiB0ZXh0IG9yaWVudGVkIHdpdGggdGhlIGdpdmVuIGBhbmdsZVR1cm5gIHdvdWxkIGJlXG4qIHByaW50ZWQgdXByaWdodC5cbipcbiogQW5nbGUgdHVybiB2YWx1ZXMgaW4gdGhlIHJhbmdlIF9bMy80LCAxLzQpXyBhcmUgY29uc2lkZXJlZCB1cHJpZ2h0LlxuKlxuKiBAcGFyYW0ge051bWJlcn0gYW5nbGVUdXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlIHRvIGNoZWNrXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gaXNVcHJpZ2h0VGV4dFxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5pc1VwcmlnaHRUZXh0ID0gZnVuY3Rpb24oYW5nbGVUdXJuKSB7XG4gIHJldHVybiBhbmdsZVR1cm4gPj0gMy80IHx8IGFuZ2xlVHVybiA8IDEvNDtcbn1cblxuIl19
