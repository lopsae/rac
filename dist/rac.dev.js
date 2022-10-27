// RAC - ruler-and-compass - 1.2.1 1160-47702d3 2022-10-27T21:44:08.026Z
// Development distribution with sourcemaps
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version and build
/**
* Container of the version data for the package.
* @namespace version
*/
module.exports = {

  /**
  * Version of the package. Exposed through
  * [`Rac.version`]{@link Rac.version}.
  * @constant {String} version
  * @memberof version#
  */
  version: '1.2.1',

  /**
  * Build of the package. Exposed through
  * [`Rac.build`]{@link Rac.build}.
  * @constant {String} build
  * @memberof version#
  */
  build: '1160-47702d3',

  /**
  * Date of build of the package. Exposed through
  * [`Rac.dated`]{@link Rac.dated}.
  * @constant {String} dated
  * @memberof version#
  */
  dated: '2022-10-27T21:44:08.026Z'
};


},{}],2:[function(require,module,exports){
'use strict';


// Ruler and Compass
const version = require('../built/version').version;
const build   = require('../built/version').build;
const dated   = require('../built/version').dated;


/**
* Root class of RAC. All drawable, style, control, and drawer classes are
* contained in this class.
*
* An instance must be created with `new Rac()` in order to
* build drawable, style, and other objects.
*
* To perform drawing operations, a drawer must be setup with
* `[setupDrawer]{@link Rac#setupDrawer}`. Currently the only available
* implementation is `[P5Drawer]{@link Rac.P5Drawer}`.
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
    * rac.version // returns as example '1.2.1'
    *
    * @constant {String} version
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'version', version);


    /**
    * Build of the instance, same as `{@link Rac.build}`.
    *
    * @example
    * rac.build // returns as example '1057-94b059d'
    *
    * @constant {String} build
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'build', build);


    /**
    * Date of the build of the instance, same as `{@link Rac.dated}`.
    *
    * @example
    * rac.dated // returns as example '2022-10-13T23:06:12.500Z'
    *
    * @constant {String} dated
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'dated', dated);


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
    * The default value is based on `1/1000` of a point.
    *
    * @type {Number}
    * @default 0.001
    */
    this.equalityThreshold = 0.001;


    /**
    * Value used to determine equality between two unitary numeric values.
    * Used for values that tend to exist in the `[0, 1]` range, like
    * `{@link Rac.Angle#turn}`. Used by `{@link Rac#unitaryEquals}`.
    *
    * Equality logic is the same as `{@link Rac#equalityThreshold}`.
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
    * Container of utility functions. See `{@link utils}` for the available
    * members.
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
  * under `{@link Rac#equalityThreshold}`.
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
  * under `{@link Rac#unitaryEqualityThreshold}`.
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
* Container of utility functions. See `{@link utils}` for the available
* members.
*
* Also available through `{@link Rac#utils}`.
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
* Rac.version // returns as example '1.2.1'
*
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
* Rac.build // returns as example '1057-94b059d'
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
* Rac.dated // returns as example '2022-10-13T23:06:12.500Z'
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


},{"../built/version":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/Controller":7,"./control/RayControl":8,"./drawable/Angle":9,"./drawable/Arc":10,"./drawable/Bezier":11,"./drawable/Composite":12,"./drawable/Point":13,"./drawable/Ray":14,"./drawable/Segment":15,"./drawable/Shape":16,"./drawable/Text":18,"./drawable/instance.Angle":19,"./drawable/instance.Arc":20,"./drawable/instance.Bezier":21,"./drawable/instance.Point":22,"./drawable/instance.Ray":23,"./drawable/instance.Segment":24,"./drawable/instance.Text":25,"./p5Drawer/P5Drawer":27,"./style/Color":33,"./style/Fill":34,"./style/Stroke":35,"./style/StyleContainer":36,"./style/instance.Color":37,"./style/instance.Fill":38,"./style/instance.Stroke":39,"./util/EaseFunction":40,"./util/Exception":41,"./util/utils":42}],3:[function(require,module,exports){
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


// Attaches the convenience functions to create objects with this instance
// of Rac. These functions are attached as properties (instead of into the
// prototype) because these are later populated with more properties and
// methods, and thus need to be independent for each instance.
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
  rac.TextFormat = function makeTextFormat(
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    // This functions uses `rac` instead of `this`, since `this` points to
    // `rac` here and to `rac.Text` in the `Text.Format` alias
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
    * @type {Number}
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
  * // returns 'Angle(0.2)'
  * rac.Angle(0.2)).toString()
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


  /**
  * Returns a new `Segment` from `center` to `startPoint()`.
  * @returns {Rac.Segment}
  */
  startSegment() {
    return new Rac.Segment(this.rac, this.startRay(), this.radius);
  }


  /**
  * Returns a new `Segment` from `center` to `endPoint()`.
  * @returns {Rac.Segment}
  */
  endSegment() {
    return new Rac.Segment(this.rac, this.endRay(), this.radius);
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
  * opposite clockwise orientation. The center and radius remain be the
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
  * // returns: 'Point(55,77)'
  * rac.Point(55, 77).toString()
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
  * coordinate is under [`equalityThreshold`]{@link Rac#equalityThreshold};
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
* Determines the alignment, angle, font, and size for drawing a
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
  *   aligns `text.point` to the left edge of the drawn text
  * @property {String} center
  *   aligns `text.point` to the center, from side to
  * @property {String} right
  *   aligns `text.point` to the right edge of the drawn text
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
  *   aligns `text.point` to the top edge of the drawn text
  * @property {String} center
  *   aligns `text.point` to the center, from top to bottom, of the drawn text
  * @property {String} baseline
  *   aligns `text.point` to the baseline of the drawn text
  * @property {String} bottom
  *   aligns `text.point` to the bottom edge of the drawn text
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
  */
  constructor(
    rac,
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    utils.assertType(Rac, rac);
    utils.assertString(hAlign, vAlign);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);

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
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${fontStr} s:${sizeStr})`;
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
      && this.hAlign === otherFormat.hAlign
      && this.vAlign === otherFormat.vAlign
      && this.font   === otherFormat.font
      && this.size   === otherFormat.size
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
      this.font,
      this.size);
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
      newFont,
      this.size);
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
      this.font,
      newSize);
  }


  /**
  * Returns a new `Text.Format` that will draw a text reversed, upside-down,
  * in generally the same position as `this` would draw the same text.
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
      this.font,
      this.size)
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
  // Intended to receive a Rac instance as parameter

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
  * Also named as: `right`, `r`, `east`, `e`.
  *
  * @name zero
  * @type {Rac.Angle}
  * @memberof instance.Angle#
  */
  rac.Angle.zero = rac.Angle(0.0);

  /**
  * An `Angle` with turn `1/2`.
  *
  * Also named as: `left`, `l`, `west`, `w`, `inverse`.
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
  * Also named as: `down`, `d`, `bottom`, `b`, `south`, `s`, `square`.
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
  * Also named as: `bottomRight`, `br`, `se`.
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
  * Also named as: `topRight`, `tr`, `ne`.
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
  * Also named as: `up`, `u`, `top`, `t`.
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
  // Intended to receive a Rac instance as parameter

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
  // Intended to receive a Rac instance as parameter

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
  // Intended to receive a Rac instance as parameter

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
  // Intended to receive a Rac instance as parameter

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
  // Intended to receive a Rac instance as parameter

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
  // Intended to receive a Rac instance as parameter


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


  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * top-left edge of the drawn text.
  * @name topLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * top-right edge of the drawn text.
  * @name topRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.top);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * center-left edge of the drawn text.
  * @name centerLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center);

  /**
  * A `Text.Format` to position the [`text.point`]{@link Rac.Text#point} at the
  * center of the drawn text.
  *
  * Also available as: `centered`.
  *
  * @name centerCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.centered = rac.Text.Format.centerCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * center-right of the drawn text.
  * @name centerRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.center);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * bottom-left of the drawn text.
  * @name bottomLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * bottom-right of the drawn text.
  * @name bottomRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.bottom);


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
    * @property {Number} [font=[rac.textFormatDefaults.size]{@link Rac#textFormatDefaults}]
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
    this.debugPointRadius = 4;

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

    // Text
    this.setDrawFunction(Rac.Text, (drawer, text) => {
      text.format.apply(text.point);
      drawer.p5.text(text.string, 0, 0);
    });
    // `text.format.apply` makes translate and rotation modifications to
    // the drawing matrix, this requires a push-pop on every draw
    this.setDrawOptions(Rac.Text, {requiresPushPop: true});
  } // setupAllDrawFunctions


  // Sets up all debug routines for rac drawable clases.
  setupAllDebugFunctions() {
    let functions = require('./debug.functions');
    this.setDebugFunction(Rac.Point, functions.debugPoint);
    this.setDebugFunction(Rac.Ray, functions.debugRay);
    this.setDebugFunction(Rac.Segment, functions.debugSegment);
    this.setDebugFunction(Rac.Arc, functions.debugArc);

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
      if (this.angle.turn != 0) {
        this.rac.drawer.p5.rotate(this.angle.radians());
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


function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
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

  // Mini arc markers
  let angleArc = point.arc(markerRadius, rac.Angle.zero, angle);
  let context = drawer.p5.drawingContext;
  let strokeWeight = context.lineWidth;
  context.save(); {
    context.lineCap = 'butt';
    context.setLineDash([6, 4]);
    // Angle arc
    angleArc.draw();

    if (!angleArc.isCircle()) {
      // Outside angle arc
      context.setLineDash([2, 4]);
      angleArc
        .withRadius(markerRadius*3/4)
        .withClockwise(false)
        .draw();
    }
  };
  context.restore();

  // Text
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

  // Text
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

  // Text
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


  // Text
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

  // Mini arc markers
  let context = drawer.p5.drawingContext;
  let strokeWeight = context.lineWidth;
  context.save(); {
    context.lineCap = 'butt';
    context.setLineDash([6, 4]);
    centerArc.draw();

    if (!centerArc.isCircle()) {
      // Outside angle arc
      context.setLineDash([2, 4]);
      centerArc
        .withClockwise(!centerArc.clockwise)
        .draw();
    }
  };
  context.restore();

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

  // Text
  if (drawsText !== true) { return; }

  let hEnum = Rac.Text.Format.horizontalAlign;
  let vEnum = Rac.Text.Format.verticalAlign;

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


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape
// TODO: debug routine of Text


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
  * @returns {String}
  */
  toString() {
    return `Color(${this.r},${this.g},${this.b},${this.a})`;
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

    if (hexString.length != 6) {
      throw Rac.Exception.failedAssert(
        `Unexpected length for hex triplet string: ${hexString}`);
    }

    let rStr = hexString.substring(0, 2);
    let gStr = hexString.substring(2, 4);
    let bStr = hexString.substring(4, 6);

    let newR = parseInt(rStr, 16);
    let newG = parseInt(gStr, 16);
    let newB = parseInt(bStr, 16);

    if (isNaN(newR) || isNaN(newG) || isNaN(newB)) {
      throw Rac.Exception.failedAssert(
        `Could not parse hex triplet string: ${hexString}`);
    }

    return new Color(rac, newR/255, newG/255, newB/255);
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
  */
  rac.Color.fromHex = function(hexString) {
    return Rac.Color.fromHex(rac, hexString);
  }


  /**
  * A black `Color`.
  *
  * @name black
  * @memberof instance.Color#
  */
  rac.Color.black   = rac.Color(0, 0, 0);

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
  rac.Color.white   = rac.Color(1, 1, 1);

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
* Returns a string of `number` format using fixed-point notation or the
* complete `number` string.
*
* @param {Number} number - The number to format
* @param {?Number} [digits] - The amount of digits to print, or `null` to
* print all digits.
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


},{"../Rac":2}]},{},[26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5Gb3JtYXQuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcndDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL3VCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZVN0cmljdCc7XG5cbi8vIFJ1bGVyIGFuZCBDb21wYXNzIC0gdmVyc2lvbiBhbmQgYnVpbGRcbi8qKlxuKiBDb250YWluZXIgb2YgdGhlIHZlcnNpb24gZGF0YSBmb3IgdGhlIHBhY2thZ2UuXG4qIEBuYW1lc3BhY2UgdmVyc2lvblxuKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAqIFZlcnNpb24gb2YgdGhlIHBhY2thZ2UuIEV4cG9zZWQgdGhyb3VnaFxuICAqIFtgUmFjLnZlcnNpb25gXXtAbGluayBSYWMudmVyc2lvbn0uXG4gICogQGNvbnN0YW50IHtTdHJpbmd9IHZlcnNpb25cbiAgKiBAbWVtYmVyb2YgdmVyc2lvbiNcbiAgKi9cbiAgdmVyc2lvbjogJzEuMi4xJyxcblxuICAvKipcbiAgKiBCdWlsZCBvZiB0aGUgcGFja2FnZS4gRXhwb3NlZCB0aHJvdWdoXG4gICogW2BSYWMuYnVpbGRgXXtAbGluayBSYWMuYnVpbGR9LlxuICAqIEBjb25zdGFudCB7U3RyaW5nfSBidWlsZFxuICAqIEBtZW1iZXJvZiB2ZXJzaW9uI1xuICAqL1xuICBidWlsZDogJzExNjAtNDc3MDJkMycsXG5cbiAgLyoqXG4gICogRGF0ZSBvZiBidWlsZCBvZiB0aGUgcGFja2FnZS4gRXhwb3NlZCB0aHJvdWdoXG4gICogW2BSYWMuZGF0ZWRgXXtAbGluayBSYWMuZGF0ZWR9LlxuICAqIEBjb25zdGFudCB7U3RyaW5nfSBkYXRlZFxuICAqIEBtZW1iZXJvZiB2ZXJzaW9uI1xuICAqL1xuICBkYXRlZDogJzIwMjItMTAtMjdUMjE6NDQ6MDguMDI2Widcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vLyBSdWxlciBhbmQgQ29tcGFzc1xuY29uc3QgdmVyc2lvbiA9IHJlcXVpcmUoJy4uL2J1aWx0L3ZlcnNpb24nKS52ZXJzaW9uO1xuY29uc3QgYnVpbGQgICA9IHJlcXVpcmUoJy4uL2J1aWx0L3ZlcnNpb24nKS5idWlsZDtcbmNvbnN0IGRhdGVkICAgPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykuZGF0ZWQ7XG5cblxuLyoqXG4qIFJvb3QgY2xhc3Mgb2YgUkFDLiBBbGwgZHJhd2FibGUsIHN0eWxlLCBjb250cm9sLCBhbmQgZHJhd2VyIGNsYXNzZXMgYXJlXG4qIGNvbnRhaW5lZCBpbiB0aGlzIGNsYXNzLlxuKlxuKiBBbiBpbnN0YW5jZSBtdXN0IGJlIGNyZWF0ZWQgd2l0aCBgbmV3IFJhYygpYCBpbiBvcmRlciB0b1xuKiBidWlsZCBkcmF3YWJsZSwgc3R5bGUsIGFuZCBvdGhlciBvYmplY3RzLlxuKlxuKiBUbyBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucywgYSBkcmF3ZXIgbXVzdCBiZSBzZXR1cCB3aXRoXG4qIGBbc2V0dXBEcmF3ZXJde0BsaW5rIFJhYyNzZXR1cERyYXdlcn1gLiBDdXJyZW50bHkgdGhlIG9ubHkgYXZhaWxhYmxlXG4qIGltcGxlbWVudGF0aW9uIGlzIGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gLlxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMudmVyc2lvbiAvLyByZXR1cm5zIGFzIGV4YW1wbGUgJzEuMi4xJ1xuICAgICpcbiAgICAqIEBjb25zdGFudCB7U3RyaW5nfSB2ZXJzaW9uXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAndmVyc2lvbicsIHZlcnNpb24pO1xuXG5cbiAgICAvKipcbiAgICAqIEJ1aWxkIG9mIHRoZSBpbnN0YW5jZSwgc2FtZSBhcyBge0BsaW5rIFJhYy5idWlsZH1gLlxuICAgICpcbiAgICAqIEBleGFtcGxlXG4gICAgKiByYWMuYnVpbGQgLy8gcmV0dXJucyBhcyBleGFtcGxlICcxMDU3LTk0YjA1OWQnXG4gICAgKlxuICAgICogQGNvbnN0YW50IHtTdHJpbmd9IGJ1aWxkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuICAgIC8qKlxuICAgICogRGF0ZSBvZiB0aGUgYnVpbGQgb2YgdGhlIGluc3RhbmNlLCBzYW1lIGFzIGB7QGxpbmsgUmFjLmRhdGVkfWAuXG4gICAgKlxuICAgICogQGV4YW1wbGVcbiAgICAqIHJhYy5kYXRlZCAvLyByZXR1cm5zIGFzIGV4YW1wbGUgJzIwMjItMTAtMTNUMjM6MDY6MTIuNTAwWidcbiAgICAqXG4gICAgKiBAY29uc3RhbnQge1N0cmluZ30gZGF0ZWRcbiAgICAqIEBtZW1iZXJvZiBSYWMjXG4gICAgKi9cbiAgICB1dGlscy5hZGRDb25zdGFudFRvKHRoaXMsICdkYXRlZCcsIGRhdGVkKTtcblxuXG4gICAgLyoqXG4gICAgKiBWYWx1ZSB1c2VkIHRvIGRldGVybWluZSBlcXVhbGl0eSBiZXR3ZWVuIHR3byBudW1lcmljIHZhbHVlcy4gVXNlZCBmb3JcbiAgICAqIHZhbHVlcyB0aGF0IHRlbmQgdG8gYmUgaW50ZWdlcnMsIGxpa2Ugc2NyZWVuIGNvb3JkaW5hdGVzLiBVc2VkIGJ5XG4gICAgKiBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgICAqXG4gICAgKiBXaGVuIGNoZWNraW5nIGZvciBlcXVhbGl0eSBgeGAgaXMgZXF1YWwgdG8gbm9uLWluY2x1c2l2ZVxuICAgICogYCh4LWVxdWFsaXR5VGhyZXNob2xkLCB4K2VxdWFsaXR5VGhyZXNob2xkKWA6XG4gICAgKiArIGB4YCBpcyAqKm5vdCBlcXVhbCoqIHRvIGB4IMKxIGVxdWFsaXR5VGhyZXNob2xkYFxuICAgICogKyBgeGAgaXMgKiplcXVhbCoqIHRvIGB4IMKxIGVxdWFsaXR5VGhyZXNob2xkLzJgXG4gICAgKlxuICAgICogRHVlIHRvIGZsb2F0aW5nIHBvaW50IHByZWNpc2lvbiBzb21lIG9wZXJ0YXRpb24gbGlrZSBpbnRlcnNlY3Rpb25zXG4gICAgKiBjYW4gcmV0dXJuIG9kZCBvciBvc2NpbGF0aW5nIHZhbHVlcy4gVGhpcyB0aHJlc2hvbGQgaXMgdXNlZCB0byBzbmFwXG4gICAgKiB2YWx1ZXMgdG9vIGNsb3NlIHRvIGEgbGltaXQsIGFzIHRvIHByZXZlbnQgb3NjaWxhdGluZyBlZmVjdHMgaW5cbiAgICAqIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGRlZmF1bHQgdmFsdWUgaXMgYmFzZWQgb24gYDEvMTAwMGAgb2YgYSBwb2ludC5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMC4wMDFcbiAgICAqL1xuICAgIHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMTtcblxuXG4gICAgLyoqXG4gICAgKiBWYWx1ZSB1c2VkIHRvIGRldGVybWluZSBlcXVhbGl0eSBiZXR3ZWVuIHR3byB1bml0YXJ5IG51bWVyaWMgdmFsdWVzLlxuICAgICogVXNlZCBmb3IgdmFsdWVzIHRoYXQgdGVuZCB0byBleGlzdCBpbiB0aGUgYFswLCAxXWAgcmFuZ2UsIGxpa2VcbiAgICAqIGB7QGxpbmsgUmFjLkFuZ2xlI3R1cm59YC4gVXNlZCBieSBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxzfWAuXG4gICAgKlxuICAgICogRXF1YWxpdHkgbG9naWMgaXMgdGhlIHNhbWUgYXMgYHtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9YC5cbiAgICAqXG4gICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBiYXNlZCBvbiAxLzEwMDAgb2YgdGhlIHR1cm4gb2YgYW4gY29tcGxldGVcbiAgICAqIGNpcmNsZSBhcmMgb2YgcmFkaXVzIDUwMDpcbiAgICAqIGBgYFxuICAgICogMS8oNTAwKjYuMjgpLzEwMDAgPSAwLjAwMF8wMDBfMzE4NDcxMzM4XG4gICAgKiBgYGBcbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMC4wMDBfMDAwXzNcbiAgICAqL1xuICAgIHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkID0gMC4wMDAwMDAzO1xuXG5cbiAgICAvKipcbiAgICAqIENvbnRhaW5lciBvZiB1dGlsaXR5IGZ1bmN0aW9ucy4gU2VlIGB7QGxpbmsgdXRpbHN9YCBmb3IgdGhlIGF2YWlsYWJsZVxuICAgICogbWVtYmVycy5cbiAgICAqXG4gICAgKiBBbHNvIGF2YWlsYWJsZSB0aHJvdWdoIGB7QGxpbmsgUmFjLnV0aWxzfWAuXG4gICAgKlxuICAgICogQHR5cGUge3V0aWxzfVxuICAgICovXG4gICAgdGhpcy51dGlscyA9IHV0aWxzXG5cbiAgICB0aGlzLnN0YWNrID0gW107XG4gICAgdGhpcy5zaGFwZVN0YWNrID0gW107XG4gICAgdGhpcy5jb21wb3NpdGVTdGFjayA9IFtdO1xuXG5cblxuXG4gICAgLyoqXG4gICAgKiBEZWZhdWx0cyBmb3IgdGhlIG9wdGlvbmFsIHByb3BlcnRpZXMgb2ZcbiAgICAqIFtgVGV4dC5Gb3JtYXRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9LlxuICAgICpcbiAgICAqIFdoZW4gYSBbYFRleHRgXXtAbGluayBSYWMuVGV4dH0gaXMgZHJhdyB3aGljaFxuICAgICogW2Bmb3JtYXQuZm9udGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNmb250fSBvclxuICAgICogW2Bmb3JtYXQuc2l6ZWBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdCNzaXplfSBhcmUgc2V0IHRvIGBudWxsYCwgdGhlXG4gICAgKiB2YWx1ZXMgc2V0IGhlcmUgYXJlIHVzZWQgaW5zdGVhZC5cbiAgICAqXG4gICAgKiBAcHJvcGVydHkgez9TdHJpbmd9IGZvbnQ9bnVsbFxuICAgICogICBEZWZhdWx0IGZvbnQsIHVzZWQgd2hlbiBkcmF3aW5nIGEgYFRleHRgIHdoaWNoXG4gICAgKiAgIFtgZm9ybWF0LmZvbnRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjZm9udH0gaXMgc2V0IHRvIGBudWxsYDsgd2hlblxuICAgICogICBzZXQgdG8gYG51bGxgIHRoZSBmb250IGlzIG5vdCBzZXQgdXBvbiBkcmF3aW5nXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gc2l6ZT0xNVxuICAgICogICBEZWZhdWx0IHNpemUsIHVzZWQgd2hlbiBkcmF3aW5nIGEgYFRleHRgIHdoaWNoXG4gICAgKiAgIFtgZm9ybWF0LnNpemVgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjc2l6ZX0gaXMgc2V0IHRvIGBudWxsYFxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLnRleHRGb3JtYXREZWZhdWx0cyA9IHtcbiAgICAgIGZvbnQ6IG51bGwsXG4gICAgICBzaXplOiAxNVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICogRHJhd2VyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3QgaGFuZGxlcyB0aGUgZHJhd2luZyBmb3IgYWxsXG4gICAgKiBkcmF3YWJsZSBvYmplY3QgY3JlYXRlZCB1c2luZyBgdGhpc2AuXG4gICAgKiBAdHlwZSB7P09iamVjdH1cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuZHJhd2VyID0gbnVsbDtcblxuICAgIHJlcXVpcmUoJy4vYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMnKSh0aGlzKTtcblxuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuQ29sb3InKSAgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuU3Ryb2tlJykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuRmlsbCcpICAgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQW5nbGUnKSAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuUG9pbnQnKSAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuUmF5JykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuU2VnbWVudCcpKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQXJjJykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyJykgKHRoaXMpO1xuXG4gICAgLy8gRGVwZW5kcyBvbiBpbnN0YW5jZS5Qb2ludCBhbmQgaW5zdGFuY2UuQW5nbGUgYmVpbmcgYWxyZWFkeSBzZXR1cFxuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuVGV4dCcpKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgKiBDb250cm9sbGVyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3MgaGFuZGxlcyBhbGwgb2YgdGhlIGNvbnRyb2xzXG4gICAgKiBhbmQgcG9pbnRlciBldmVudHMgcmVsYXRlZCB0byB0aGlzIGluc3RhbmNlIG9mIGBSYWNgLlxuICAgICovXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFJhYy5Db250cm9sbGVyKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZHJhd2VyIGZvciB0aGUgaW5zdGFuY2UuIEN1cnJlbnRseSBvbmx5IGEgcDUuanMgaW5zdGFuY2UgaXNcbiAgKiBzdXBwb3J0ZWQuXG4gICpcbiAgKiBUaGUgZHJhd2VyIHdpbGwgYWxzbyBwb3B1bGF0ZSBzb21lIGNsYXNzZXMgd2l0aCBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICogcmVsZXZhbnQgdG8gdGhlIGRyYXdlci4gRm9yIHA1LmpzIHRoaXMgaW5jbHVkZSBgYXBwbHlgIGZ1bmN0aW9ucyBmb3JcbiAgKiBjb2xvcnMgYW5kIHN0eWxlIG9iamVjdCwgYW5kIGB2ZXJ0ZXhgIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgb2JqZWN0cy5cbiAgKlxuICAqIEBwYXJhbSB7UDV9IHA1SW5zdGFuY2VcbiAgKi9cbiAgc2V0dXBEcmF3ZXIocDVJbnN0YW5jZSkge1xuICAgIHRoaXMuZHJhd2VyID0gbmV3IFJhYy5QNURyYXdlcih0aGlzLCBwNUluc3RhbmNlKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gYSAtIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBlcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5lcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9YC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBhIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgU2Vjb25kIG51bWJlciB0byBjb21wYXJlXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgdW5pdGFyeUVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICBwdXNoU3RhY2sob2JqKSB7XG4gICAgdGhpcy5zdGFjay5wdXNoKG9iaik7XG4gIH1cblxuXG4gIHBlZWtTdGFjaygpIHtcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcFN0YWNrKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XG4gIH1cblxuXG4gIHB1c2hTaGFwZShzaGFwZSA9IG51bGwpIHtcbiAgICBzaGFwZSA9IHNoYXBlID8/IG5ldyBSYWMuU2hhcGUodGhpcyk7XG4gICAgdGhpcy5zaGFwZVN0YWNrLnB1c2goc2hhcGUpO1xuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG5cbiAgcGVla1NoYXBlKCkge1xuICAgIGlmICh0aGlzLnNoYXBlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaGFwZVN0YWNrW3RoaXMuc2hhcGVTdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wU2hhcGUoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNoYXBlU3RhY2sucG9wKCk7XG4gIH1cblxuXG4gIHB1c2hDb21wb3NpdGUoY29tcG9zaXRlKSB7XG4gICAgY29tcG9zaXRlID0gY29tcG9zaXRlID8/IG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMpO1xuICAgIHRoaXMuY29tcG9zaXRlU3RhY2sucHVzaChjb21wb3NpdGUpO1xuICAgIHJldHVybiBjb21wb3NpdGU7XG4gIH1cblxuXG4gIHBlZWtDb21wb3NpdGUoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3NpdGVTdGFja1t0aGlzLmNvbXBvc2l0ZVN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BDb21wb3NpdGUoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3NpdGVTdGFjay5wb3AoKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJhY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFjO1xuXG5cbi8vIEFsbCBjbGFzcyAoc3RhdGljKSBwcm9wZXJ0aWVzIHNob3VsZCBiZSBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIGNsYXNzXG4vLyBhcyB0byBwcmV2ZW50IGN5Y2xpYyBkZXBlbmRlbmN5IHdpdGggUmFjLlxuXG5cbi8qKlxuKiBDb250YWluZXIgb2YgdXRpbGl0eSBmdW5jdGlvbnMuIFNlZSBge0BsaW5rIHV0aWxzfWAgZm9yIHRoZSBhdmFpbGFibGVcbiogbWVtYmVycy5cbipcbiogQWxzbyBhdmFpbGFibGUgdGhyb3VnaCBge0BsaW5rIFJhYyN1dGlsc31gLlxuKlxuKiBAdmFyIHt1dGlsc31cbiogQG1lbWJlcm9mIFJhY1xuKi9cbmNvbnN0IHV0aWxzID0gcmVxdWlyZShgLi91dGlsL3V0aWxzYCk7XG5SYWMudXRpbHMgPSB1dGlscztcblxuXG4vKipcbiogVmVyc2lvbiBvZiB0aGUgY2xhc3MuIFNhbWUgYXMgdGhlIHZlcnNpb24gdXNlZCBmb3IgdGhlIG5wbSBwYWNrYWdlLlxuKlxuKiBAZXhhbXBsZVxuKiBSYWMudmVyc2lvbiAvLyByZXR1cm5zIGFzIGV4YW1wbGUgJzEuMi4xJ1xuKlxuKlxuKiBAY29uc3RhbnQge1N0cmluZ30gdmVyc2lvblxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuLyoqXG4qIEJ1aWxkIG9mIHRoZSBjbGFzcy4gSW50ZW5kZWQgZm9yIGRlYnVnZ2luZyBwdXJwb3VzZXMuXG4qXG4qIENvbnRhaW5zIGEgY29tbWl0LWNvdW50IGFuZCBzaG9ydC1oYXNoIG9mIHRoZSByZXBvc2l0b3J5IHdoZW4gdGhlIGJ1aWxkXG4qIHdhcyBkb25lLlxuKlxuKiBAZXhhbXBsZVxuKiBSYWMuYnVpbGQgLy8gcmV0dXJucyBhcyBleGFtcGxlICcxMDU3LTk0YjA1OWQnXG4qXG4qIEBjb25zdGFudCB7U3RyaW5nfSBidWlsZFxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdidWlsZCcsIGJ1aWxkKTtcblxuXG5cbi8qKlxuKiBEYXRlIG9mIHRoZSBidWlsZCBvZiB0aGUgY2xhc3MuIEludGVuZGVkIGZvciBkZWJ1Z2dpbmcgcHVycG91c2VzLlxuKlxuKiBDb250YWlucyBhIFtJU08tODYwMSBzdGFuZGFyZF0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPXzg2MDEpXG4qIGRhdGUgd2hlbiB0aGUgYnVpbGQgd2FzIGRvbmUuXG4qXG4qIEBleGFtcGxlXG4qIFJhYy5kYXRlZCAvLyByZXR1cm5zIGFzIGV4YW1wbGUgJzIwMjItMTAtMTNUMjM6MDY6MTIuNTAwWidcbipcbiogQGNvbnN0YW50IHtTdHJpbmd9IGRhdGVkXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ2RhdGVkJywgZGF0ZWQpO1xuXG5cbi8qKlxuKiBUYXUsIGVxdWFsIHRvIGBNYXRoLlBJICogMmAuXG4qXG4qIFNlZSBbVGF1IE1hbmlmZXN0b10oaHR0cHM6Ly90YXVkYXkuY29tL3RhdS1tYW5pZmVzdG8pLlxuKlxuKiBAY29uc3RhbnQge051bWJlcn0gVEFVXG4qIEBtZW1iZXJvZiBSYWNcbiovXG51dGlscy5hZGRDb25zdGFudFRvKFJhYywgJ1RBVScsIE1hdGguUEkgKiAyKTtcblxuXG4vLyBFeGNlcHRpb25cblJhYy5FeGNlcHRpb24gPSByZXF1aXJlKCcuL3V0aWwvRXhjZXB0aW9uJyk7XG5cblxuLy8gUHJvdG90eXBlIGZ1bmN0aW9uc1xucmVxdWlyZSgnLi9hdHRhY2hQcm90b0Z1bmN0aW9ucycpKFJhYyk7XG5cblxuLy8gUDVEcmF3ZXJcblJhYy5QNURyYXdlciA9IHJlcXVpcmUoJy4vcDVEcmF3ZXIvUDVEcmF3ZXInKTtcblxuXG4vLyBDb2xvclxuUmFjLkNvbG9yID0gcmVxdWlyZSgnLi9zdHlsZS9Db2xvcicpO1xuXG5cbi8vIFN0cm9rZVxuUmFjLlN0cm9rZSA9IHJlcXVpcmUoJy4vc3R5bGUvU3Ryb2tlJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5TdHJva2UpO1xuXG5cbi8vIEZpbGxcblJhYy5GaWxsID0gcmVxdWlyZSgnLi9zdHlsZS9GaWxsJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5GaWxsKTtcblxuXG4vLyBTdHlsZUNvbnRhaW5lclxuUmFjLlN0eWxlQ29udGFpbmVyID0gcmVxdWlyZSgnLi9zdHlsZS9TdHlsZUNvbnRhaW5lcicpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3R5bGVDb250YWluZXIpO1xuXG5cbi8vIEFuZ2xlXG5SYWMuQW5nbGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0FuZ2xlJyk7XG5SYWMuQW5nbGUucHJvdG90eXBlLmxvZyA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZztcblxuXG4vLyBQb2ludFxuUmFjLlBvaW50ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9Qb2ludCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuUG9pbnQpO1xuXG5cbi8vIFJheVxuUmFjLlJheSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvUmF5Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5SYXkpO1xuXG5cbi8vIFNlZ21lbnRcblJhYy5TZWdtZW50ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TZWdtZW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5TZWdtZW50KTtcblxuXG4vLyBBcmNcblJhYy5BcmMgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0FyYycpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQXJjKTtcblxuXG4vLyBUZXh0XG5SYWMuVGV4dCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvVGV4dCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuVGV4dCk7XG5cblxuLy8gQmV6aWVyXG5SYWMuQmV6aWVyID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9CZXppZXInKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkJlemllcik7XG5cblxuLy8gQ29tcG9zaXRlXG5SYWMuQ29tcG9zaXRlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9Db21wb3NpdGUnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkNvbXBvc2l0ZSk7XG5cblxuLy8gU2hhcGVcblJhYy5TaGFwZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvU2hhcGUnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNoYXBlKTtcblxuXG4vLyBFYXNlRnVuY3Rpb25cblJhYy5FYXNlRnVuY3Rpb24gPSByZXF1aXJlKCcuL3V0aWwvRWFzZUZ1bmN0aW9uJyk7XG5cblxuLy8gQ29udHJvbGxlclxuUmFjLkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2NvbnRyb2wvQ29udHJvbGxlcicpO1xuXG5cbi8vIENvbnRyb2xcblJhYy5Db250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL0NvbnRyb2wnKTtcblxuXG4vLyBSYXlDb250cm9sXG5SYWMuUmF5Q29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9SYXlDb250cm9sJyk7XG5cblxuLy8gQXJjQ29udHJvbFxuUmFjLkFyY0NvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQXJjQ29udHJvbCcpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi9SYWMnKTtcblxuXG4vKipcbiogVGhpcyBuYW1lc3BhY2UgbGlzdHMgdXRpbGl0eSBmdW5jdGlvbnMgYXR0YWNoZWQgdG8gYW4gaW5zdGFuY2Ugb2ZcbiogYHtAbGluayBSYWN9YCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIEVhY2ggZHJhd2FibGUgYW5kIHN0eWxlIGNsYXNzIGdldHNcbiogYSBjb3JyZXNwb25kaW5nIGZ1bmN0aW9uIGxpa2UgW2ByYWMuUG9pbnRgXXtAbGluayBpbnN0YW5jZS5Qb2ludH0gb3JcbiogW2ByYWMuQ29sb3JgXXtAbGluayBpbnN0YW5jZS5Db2xvcn0uXG4qXG4qIERyYXdhYmxlIGFuZCBzdHlsZSBvYmplY3RzIHJlcXVpcmUgZm9yIGNvbnN0cnVjdGlvbiBhIHJlZmVyZW5jZSB0byBhXG4qIGBSYWNgIGluc3RhbmNlIGluIG9yZGVyIHRvIHBlcmZvcm0gZHJhd2luZyBvcGVyYXRpb25zLiBUaGUgYXR0YWNoZWRcbiogZnVuY3Rpb25zIGJ1aWxkIG5ldyBvYmplY3RzIHVzaW5nIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYWxzbyBzZXR1cCB3aXRoIHJlYWR5LW1hZGUgY29udmVuaWVuY2Ugb2JqZWN0cyBmb3JcbiogbWFueSB1c3VhbCB2YWx1ZXMgbGlrZSBbYHJhYy5BbmdsZS5ub3J0aGBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI25vcnRofSBvclxuKiBbYHJhYy5Qb2ludC56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb30uXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2VcbiovXG5cblxuLy8gQXR0YWNoZXMgdGhlIGNvbnZlbmllbmNlIGZ1bmN0aW9ucyB0byBjcmVhdGUgb2JqZWN0cyB3aXRoIHRoaXMgaW5zdGFuY2Vcbi8vIG9mIFJhYy4gVGhlc2UgZnVuY3Rpb25zIGFyZSBhdHRhY2hlZCBhcyBwcm9wZXJ0aWVzIChpbnN0ZWFkIG9mIGludG8gdGhlXG4vLyBwcm90b3R5cGUpIGJlY2F1c2UgdGhlc2UgYXJlIGxhdGVyIHBvcHVsYXRlZCB3aXRoIG1vcmUgcHJvcGVydGllcyBhbmRcbi8vIG1ldGhvZHMsIGFuZCB0aHVzIG5lZWQgdG8gYmUgaW5kZXBlbmRlbnQgZm9yIGVhY2ggaW5zdGFuY2UuXG4vL1xuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYENvbG9yYC4gVGhlIGNyZWF0ZWQgYGNvbG9yLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkNvbG9yfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBjb2xvci5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gclxuICAqIEBwYXJhbSB7TnVtYmVyfSBnXG4gICogQHBhcmFtIHtOdW1iZXJ9IGJcbiAgKiBAcGFyYW0ge051bWJlcn0gW2E9MV1cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkNvbG9yXG4gICpcbiAgKiBAZnVuY3Rpb24gQ29sb3JcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQ29sb3IgPSBmdW5jdGlvbiBtYWtlQ29sb3IociwgZywgYiwgYSA9IDEpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5Db2xvcih0aGlzLCByLCBnLCBiLCBhKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgU3Ryb2tlYC4gVGhlIGNyZWF0ZWQgYHN0cm9rZS5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TdHJva2V9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuICAqIGxldCBzdHJva2UgPSByYWMuU3Ryb2tlKDIsIGNvbG9yKVxuICAqIHN0cm9rZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IHdlaWdodFxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSBbY29sb3I9bnVsbF1cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TdHJva2VcbiAgKlxuICAqIEBmdW5jdGlvbiBTdHJva2VcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuU3Ryb2tlID0gZnVuY3Rpb24gbWFrZVN0cm9rZSh3ZWlnaHQsIGNvbG9yID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0cm9rZSh0aGlzLCB3ZWlnaHQsIGNvbG9yKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgRmlsbGAuIFRoZSBjcmVhdGVkIGBmaWxsLnJhY2AgaXNcbiAgKiBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkZpbGx9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBjb2xvciA9IHJhYy5Db2xvcigwLjIsIDAuNCwgMC42KVxuICAqIGxldCBmaWxsID0gcmFjLkZpbGwoY29sb3IpXG4gICogZmlsbC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcn0gW2NvbG9yPW51bGxdXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5GaWxsXG4gICpcbiAgKiBAZnVuY3Rpb24gRmlsbFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5GaWxsID0gZnVuY3Rpb24gbWFrZUZpbGwoY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLCBjb2xvcik7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFN0eWxlYC4gVGhlIGNyZWF0ZWQgYHN0eWxlLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlN0eWxlfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiAgKiBsZXQgc3R5bGUgPSByYWMuU3R5bGUocmFjLlN0cm9rZSgyLCBjb2xvciksIHJhYy5GaWxsKGNvbG9yKSlcbiAgKiBzdHlsZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2V9IFtzdHJva2U9bnVsbF1cbiAgKiBAcGFyYW0ge1JhYy5GaWxsfSBbZmlsbD1udWxsXVxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuU3R5bGVcbiAgKlxuICAqIEBmdW5jdGlvbiBTdHlsZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHlsZSA9IGZ1bmN0aW9uIG1ha2VTdHlsZShzdHJva2UgPSBudWxsLCBmaWxsID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlKHRoaXMsIHN0cm9rZSwgZmlsbCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYEFuZ2xlYC4gVGhlIGNyZWF0ZWQgYGFuZ2xlLnJhY2BcbiAgKiBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlfWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgYW5nbGUgPSByYWMuQW5nbGUoMS8yKVxuICAqIGFuZ2xlLnJhYyA9PT0gcmFjIC8vIHRydWVcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlLCBpbiB0aGUgcmFuZ2UgYFtPLDEpYFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlXG4gICpcbiAgKiBAZnVuY3Rpb24gQW5nbGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQW5nbGUgPSBmdW5jdGlvbiBtYWtlQW5nbGUodHVybikge1xuICAgIHJldHVybiBuZXcgUmFjLkFuZ2xlKHRoaXMsIHR1cm4pO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBQb2ludGAuIFRoZSBjcmVhdGVkIGBwb2ludC5yYWNgXG4gICogaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludH1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IHBvaW50ID0gcmFjLlBvaW50KDU1LCA3NylcbiAgKiBwb2ludC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGVcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlBvaW50XG4gICpcbiAgKiBAZnVuY3Rpb24gUG9pbnRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuUG9pbnQgPSBmdW5jdGlvbiBtYWtlUG9pbnQoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBSYXlgIHdpdGggdGhlIGdpdmVuIHByaW1pdGl2ZVxuICAqIHZhbHVlcy4gVGhlIGNyZWF0ZWQgYHJheS5yYWNgIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUmF5fWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgcmF5ID0gcmFjLlJheSg1NSwgNzcsIDEvMilcbiAgKiByYXkucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgKiBAcGFyYW0ge051bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5SYXlcbiAgKlxuICAqIEBmdW5jdGlvbiBSYXlcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuUmF5ID0gZnVuY3Rpb24gbWFrZVJheSh4LCB5LCBhbmdsZSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcywgc3RhcnQsIGFuZ2xlKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgZ2l2ZW4gcHJpbWl0aXZlXG4gICogdmFsdWVzLiBUaGUgY3JlYXRlZCBgc2VnbWVudC5yYWNgIGlzIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU2VnbWVudH1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IHNlZ21lbnQgPSByYWMuU2VnbWVudCg1NSwgNzcsIDEvMiwgMTAwKVxuICAqIHNlZ21lbnQucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgKiBAcGFyYW0ge051bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlNlZ21lbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBTZWdtZW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlNlZ21lbnQgPSBmdW5jdGlvbiBtYWtlU2VnbWVudCh4LCB5LCBhbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLCByYXksIGxlbmd0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gcHJpbWl0aXZlXG4gICogdmFsdWVzLiBUaGUgY3JlYXRlZCBgYXJjLnJhY2AgaXMgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogbGV0IHJhYyA9IG5ldyBSYWMoKVxuICAqIGxldCBhcmMgPSByYWMuQXJjKDU1LCA3NywgMS80KVxuICAqIGFyYy5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBfeF8gY29vcmRpbmF0ZSBmb3IgdGhlIGFyYyBjZW50ZXJcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBfeV8gY29vcmRpbmF0ZSBmb3IgdGhlIGFyYyBjZW50ZXJcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IHN0YXJ0IC0gVGhlIHN0YXJ0IG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8TnVtYmVyfSBbZW5kPW51bGxdIC0gVGhlIGVuZCBvZiB0aGUgYXJjOyB3aGVuXG4gICogICBvbW1pdGVkIG9yIHNldCB0byBgbnVsbGAsIGBzdGFydGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQXJjXG4gICpcbiAgKiBAZnVuY3Rpb24gQXJjXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkFyYyA9IGZ1bmN0aW9uIG1ha2VBcmMoeCwgeSwgcmFkaXVzLCBzdGFydCA9IHRoaXMuQW5nbGUuemVybywgZW5kID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IGNlbnRlciA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgc3RhcnQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBzdGFydCk7XG4gICAgZW5kID0gZW5kID09PSBudWxsXG4gICAgICA/IHN0YXJ0XG4gICAgICA6IFJhYy5BbmdsZS5mcm9tKHRoaXMsIGVuZCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMsIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGBUZXh0YC4gVGhlIGNyZWF0ZWQgYHRleHQucmFjYCBpc1xuICAqIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuVGV4dH1gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgcmFjID0gbmV3IFJhYygpXG4gICogbGV0IHRleHQgPSByYWMuVGV4dCg1NSwgNzcsIFwiYmxhY2sgcXVhcnR6XCIpXG4gICogdGV4dC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgbG9jYXRpb24gZm9yIHRoZSBkcmF3biB0ZXh0XG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIGRyYXdcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gW2Zvcm1hdD1bcmFjLlRleHQuRm9ybWF0LnRvcExlZnRde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0I3RvcExlZnR9XVxuICAqICAgVGhlIGZvcm1hdCBmb3IgdGhlIGRyYXduIHRleHRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuVGV4dFxuICAqXG4gICogQGZ1bmN0aW9uIFRleHRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuVGV4dCA9IGZ1bmN0aW9uIG1ha2VUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0ID0gdGhpcy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBgVGV4dC5Gb3JtYXRgLiBUaGUgY3JlYXRlZFxuICAqIGBmb3JtYXQucmFjYCBpcyBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fWAuXG4gICpcbiAgKiBbYHJhYy5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQjRm9ybWF0fSBpcyBhbiBhbGlhcyBvZiB0aGlzXG4gICogZnVuY3Rpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiBsZXQgZm9ybWF0ID0gcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ2Jhc2VsaW5lJywgMS84KVxuICAqIGZvcm1hdC5yYWMgPT09IHJhYyAvLyB0cnVlXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gaEFsaWduIC0gVGhlIGhvcml6b250YWwgYWxpZ25tZW50LCBsZWZ0LXRvLXJpZ2h0OyBvbmVcbiAgKiAgIG9mIHRoZSB2YWx1ZXMgZnJvbSBbYGhvcml6b250YWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ259XG4gICogQHBhcmFtIHtTdHJpbmd9IHZBbGlnbiAtIFRoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQsIHRvcC10by1ib3R0b207IG9uZSBvZlxuICAqICAgdGhlIHZhbHVlcyBmcm9tIFtgdmVydGljYWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWdufVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBbYW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduXG4gICogQHBhcmFtIHtTdHJpbmd9IFtmb250PW51bGxdIC0gVGhlIGZvbnQgbmFtZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbc2l6ZT1udWxsXSAtIFRoZSBmb250IHNpemVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlRleHQuRm9ybWF0XG4gICpcbiAgKiBAZnVuY3Rpb24gVGV4dEZvcm1hdFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5UZXh0Rm9ybWF0ID0gZnVuY3Rpb24gbWFrZVRleHRGb3JtYXQoXG4gICAgaEFsaWduLFxuICAgIHZBbGlnbixcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS56ZXJvLFxuICAgIGZvbnQgPSBudWxsLFxuICAgIHNpemUgPSBudWxsKVxuICB7XG4gICAgLy8gVGhpcyBmdW5jdGlvbnMgdXNlcyBgcmFjYCBpbnN0ZWFkIG9mIGB0aGlzYCwgc2luY2UgYHRoaXNgIHBvaW50cyB0b1xuICAgIC8vIGByYWNgIGhlcmUgYW5kIHRvIGByYWMuVGV4dGAgaW4gdGhlIGBUZXh0LkZvcm1hdGAgYWxpYXNcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgICAgcmFjLFxuICAgICAgaEFsaWduLCB2QWxpZ24sXG4gICAgICBhbmdsZSwgZm9udCwgc2l6ZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYFRleHQuRm9ybWF0YC4gQWxpYXMgb2ZcbiAgKiBbYHJhYy5UZXh0Rm9ybWF0YF17QGxpbmsgUmFjI1RleHRGb3JtYXR9LlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGhBbGlnbiAtIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodDsgb25lXG4gICogICBvZiB0aGUgdmFsdWVzIGZyb20gW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufVxuICAqIEBwYXJhbSB7U3RyaW5nfSB2QWxpZ24gLSBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tOyBvbmUgb2ZcbiAgKiAgIHRoZSB2YWx1ZXMgZnJvbSBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn1cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gW2FuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgdGV4dCBpcyBkcmF3blxuICAqIEBwYXJhbSB7U3RyaW5nfSBbZm9udD1udWxsXSAtIFRoZSBmb250IG5hbWVcbiAgKiBAcGFyYW0ge051bWJlcn0gW3NpemU9bnVsbF0gLSBUaGUgZm9udCBzaXplXG4gICpcbiAgKiBAZnVuY3Rpb24gRm9ybWF0XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdCA9IHJhYy5UZXh0Rm9ybWF0O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBCZXppZXJgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQmV6aWVyfWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRYXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0WVxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEFuY2hvclhcbiAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnRBbmNob3JZXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEFuY2hvclhcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kQW5jaG9yWVxuICAqIEBwYXJhbSB7TnVtYmVyfSBlbmRYXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZFlcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQmV6aWVyfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5CZXppZXJcbiAgKlxuICAqIEBmdW5jdGlvbiBCZXppZXJcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQmV6aWVyID0gZnVuY3Rpb24gbWFrZUJlemllcihcbiAgICBzdGFydFgsIHN0YXJ0WSwgc3RhcnRBbmNob3JYLCBzdGFydEFuY2hvclksXG4gICAgZW5kQW5jaG9yWCwgZW5kQW5jaG9yWSwgZW5kWCwgZW5kWSlcbiAge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydFgsIHN0YXJ0WSk7XG4gICAgY29uc3Qgc3RhcnRBbmNob3IgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZKTtcbiAgICBjb25zdCBlbmRBbmNob3IgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZEFuY2hvclgsIGVuZEFuY2hvclkpO1xuICAgIGNvbnN0IGVuZCA9IG5ldyBSYWMuUG9pbnQodGhpcywgZW5kWCwgZW5kWSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpO1xuICB9O1xuXG59OyAvLyBhdHRhY2hJbnN0YW5jZUZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBBdHRhY2hlcyB1dGlsaXR5IGZ1bmN0aW9ucyB0byBhIFJhYyBpbnN0YW5jZSB0aGF0IGFkZCBmdW5jdGlvbnMgdG8gYWxsXG4vLyBkcmF3YWJsZSBhbmQgc3R5bGUgY2xhc3MgcHJvdG90eXBlcy5cbi8vXG4vLyBJbnRlbmRlZCB0byByZWNlaXZlIHRoZSBSYWMgY2xhc3MgYXMgcGFyYW1ldGVyLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hQcm90b0Z1bmN0aW9ucyhSYWMpIHtcblxuICBmdW5jdGlvbiBhc3NlcnREcmF3ZXIoZHJhd2FibGUpIHtcbiAgICBpZiAoZHJhd2FibGUucmFjID09IG51bGwgfHwgZHJhd2FibGUucmFjLmRyYXdlciA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmRyYXdlck5vdFNldHVwKFxuICAgICAgICBgZHJhd2FibGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKGRyYXdhYmxlKX1gKTtcbiAgICB9XG4gIH1cblxuXG4gIC8vIENvbnRhaW5lciBvZiBwcm90b3R5cGUgZnVuY3Rpb25zIGZvciBkcmF3YWJsZSBjbGFzc2VzLlxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucyA9IHt9O1xuXG5cbiAgLyoqXG4gICogQWRkcyB0byBgZHJhd2FibGVDbGFzcy5wcm90b3R5cGVgIGFsbCB0aGUgZnVuY3Rpb25zIGNvbnRhaW5lZCBpblxuICAqIGBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSB0aGUgZnVuY3Rpb25zIHNoYXJlZCBieSBhbGxcbiAgKiBkcmF3YWJsZSBvYmplY3RzLCBmb3IgZXhhbXBsZSBgZHJhdygpYCBhbmQgYGRlYnVnKClgLlxuICAqXG4gICogQHBhcmFtIHtjbGFzc30gZHJhd2FibGVDbGFzcyAtIENsYXNzIHRvIHNldHVwIHdpdGggZHJhd2FibGUgZnVuY3Rpb25zXG4gICovXG4gIFJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihkcmF3YWJsZUNsYXNzKSB7XG4gICAgT2JqZWN0LmtleXMoUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBkcmF3YWJsZUNsYXNzLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kcmF3ID0gZnVuY3Rpb24oc3R5bGUgPSBudWxsKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmRyYXdPYmplY3QodGhpcywgc3R5bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZGVidWcgPSBmdW5jdGlvbihkcmF3c1RleHQgPSBmYWxzZSl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kZWJ1Z09iamVjdCh0aGlzLCBkcmF3c1RleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nID0gZnVuY3Rpb24obWVzc2FnZSA9IG51bGwpe1xuICAgIGxldCBjb2FsZXNjZWRNZXNzYWdlID0gbWVzc2FnZSA/PyAnJW8nO1xuICAgIGNvbnNvbGUubG9nKGNvYWxlc2NlZE1lc3NhZ2UsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLnB1c2hTdGFjayh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcFN0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucGVla1N0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrU2hhcGUoKS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTaGFwZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZVRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNoYXBlID0gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHNoYXBlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG9Db21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BDb21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wQ29tcG9zaXRlKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvID0gZnVuY3Rpb24oc29tZUNvbXBvc2l0ZSkge1xuICAgIGlmIChzb21lQ29tcG9zaXRlIGluc3RhbmNlb2YgUmFjLkNvbXBvc2l0ZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5TaGFwZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgYXR0YWNoVG8gY29tcG9zaXRlIC0gc29tZUNvbXBvc2l0ZS10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZUNvbXBvc2l0ZSl9YCk7XG4gIH07XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3Igc3R5bGUgY2xhc3Nlcy5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuc3R5bGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBzdHlsZSBvYmplY3RzIChFLmcuIGBhcHBseSgpYCkuXG4gIFJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgIE9iamVjdC5rZXlzKFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY2xhc3NPYmoucHJvdG90eXBlW25hbWVdID0gUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5ID0gZnVuY3Rpb24oKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmFwcGx5T2JqZWN0KHRoaXMpO1xuICB9O1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMubG9nID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nO1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMuYXBwbHlUb0NsYXNzID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLnNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCB0aGlzKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoUHJvdG9GdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IGFsbG93cyB0aGUgc2VsZWN0aW9uIG9mIGEgdmFsdWUgd2l0aCBhIGtub2IgdGhhdCBzbGlkZXNcbiogdGhyb3VnaCB0aGUgc2VjdGlvbiBvZiBhbiBgQXJjYC5cbipcbiogVXNlcyBhbiBgQXJjYCBhcyBgW2FuY2hvcl17QGxpbmsgUmFjLkFyY0NvbnRyb2wjYW5jaG9yfWAsIHdoaWNoIGRlZmluZXNcbiogdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuKlxuKiBgW2FuZ2xlRGlzdGFuY2Vde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuZ2xlRGlzdGFuY2V9YCBkZWZpbmVzIHRoZVxuKiBzZWN0aW9uIG9mIHRoZSBgYW5jaG9yYCBhcmMgd2hpY2ggaXMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuKiBXaXRoaW4gdGhpcyBzZWN0aW9uIHRoZSB1c2VyIGNhbiBzbGlkZSB0aGUgY29udHJvbCBrbm9iIHRvIHNlbGVjdCBhXG4qIHZhbHVlLlxuKlxuKiBAYWxpYXMgUmFjLkFyY0NvbnRyb2xcbiogQGV4dGVuZHMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBBcmNDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY0NvbnRyb2xgIGluc3RhbmNlIHdpdGggdGhlIHN0YXJ0aW5nIGB2YWx1ZWAgYW5kIHRoZVxuICAqIGludGVyYWN0aXZlIGBhbmdsZURpc3RhbmNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGVEaXN0YW5jZSBvZiB0aGUgYGFuY2hvcmBcbiAgKiAgIGFyYyBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb25cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgYW5nbGVEaXN0YW5jZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgc3VwZXIocmFjLCB2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIEFuZ2xlIGRpc3RhbmNlIG9mIHRoZSBgYW5jaG9yYCBhcmMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGVEaXN0YW5jZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgYW5nbGVEaXN0YW5jZSk7XG5cbiAgICAvKipcbiAgICAqIGBBcmNgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIERlZmluZXMgdGhlIGxvY2F0aW9uXG4gICAgKiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbiAgICAqXG4gICAgKiBBbG9uZyB3aXRoIGBbYW5nbGVEaXN0YW5jZV17QGxpbmsgUmFjLkFyY0NvbnRyb2wjYW5nbGVEaXN0YW5jZX1gXG4gICAgKiBkZWZpbmVzIHRoZSBzZWN0aW9uIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgY29udHJvbCBjYW5ub3QgYmUgZHJhd24gb3Igc2VsZWN0ZWQgdW50aWwgdGhpcyBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuQXJjfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJhYy5jb250cm9sbGVyLmF1dG9BZGRDb250cm9scykge1xuICAgICAgcmFjLmNvbnRyb2xsZXIuYWRkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBgdmFsdWVgIHVzaW5nIHRoZSBwcm9qZWN0aW9uIG9mIGB2YWx1ZUFuZ2xlRGlzdGFuY2UudHVybmAgaW4gdGhlXG4gICogYFswLGFuZ2xlTGVuZ3RoLnR1cm5dYCByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gdmFsdWVBbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGF0XG4gICogICB3aGljaCB0byBzZXQgdGhlIGN1cnJlbnQgdmFsdWVcbiAgKi9cbiAgc2V0VmFsdWVXaXRoQW5nbGVEaXN0YW5jZSh2YWx1ZUFuZ2xlRGlzdGFuY2UpIHtcbiAgICB2YWx1ZUFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgdmFsdWVBbmdsZURpc3RhbmNlKVxuICAgIGxldCBkaXN0YW5jZVJhdGlvID0gdmFsdWVBbmdsZURpc3RhbmNlLnR1cm4gLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICAgIHRoaXMudmFsdWUgPSBkaXN0YW5jZVJhdGlvO1xuICB9XG5cblxuICAvLyBUT0RPOiB0aGlzIGV4YW1wbGUvY29kZSBtYXkgbm90IGJlIHdvcmtpbmcgb3IgYmUgaW5uYWN1cnJhdGVcbiAgLy8gY2hlY2sgUmF5Q29udHJvbDpzZXRMaW1pdHNXaXRoTGVuZ3RoSW5zZXRzIGZvciBhIGJldHRlciBleGFtcGxlXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGBhbmdsZURpc3RhbmNlLnR1cm5gLCBjb3JyZXNwb25kaW5nbHksIGJvdGggcHJvamVjdGVkIGluIHRoZVxuICAqIGBbMCwgYW5nbGVEaXN0YW5jZS50dXJuXWAgcmFuZ2UuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhbiBBcmNDb250cm9sIHdpdGggYW5nbGVEaXN0YW5jZSBvZiAwLjUgdHVybjwvY2FwdGlvbj5cbiAgKiBsZXQgY29udHJvbCA9IG5ldyBSYWMuQXJjQ29udHJvbChyYWMsIDAsIHJhYy5BbmdsZSgwLjUpKVxuICAqIC8vIHNldHMgc3RhcnRMaW1pdCBhcyAwLjEsIHNpbmNlICAgMCArIDAuMiAqIDAuNSA9IDAuMVxuICAqIC8vIHNldHMgZW5kTGltaXQgICBhcyAwLjMsIHNpbmNlIDAuNSAtIDAuNCAqIDAuNSA9IDAuM1xuICAqIGNvbnRyb2wuc2V0TGltaXRzV2l0aEFuZ2xlRGlzdGFuY2VJbnNldHMoMC4yLCAwLjQpXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYGFuZ2xlRGlzdGFuY2UudHVybmBcbiAgKiAgIGluIHRoZSByYW5nZSBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG4gICAgdGhpcy5zdGFydExpbWl0ID0gc3RhcnRJbnNldC50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLSBlbmRJbnNldC50dXJuKSAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlICBbYW5nbGUgYGRpc3RhbmNlYF17QGxpbmsgUmFjLkFuZ2xlI2Rpc3RhbmNlfSBiZXR3ZWVuIHRoZVxuICAqIGBhbmNob3JgIGFyYyBgc3RhcnRgIGFuZCB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogVGhlIGB0dXJuYCBvZiB0aGUgcmV0dXJuZWQgYEFuZ2xlYCBpcyBlcXVpdmFsZW50IHRvIHRoZSBjb250cm9sIGB2YWx1ZWBcbiAgKiBwcm9qZWN0ZWQgdG8gdGhlIHJhbmdlIGBbMCxhbmdsZURpc3RhbmNlLnR1cm5dYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogV2hlbiBgYW5jaG9yYCBpcyBub3Qgc2V0LCByZXR1cm5zIGBudWxsYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybiB7P1JhYy5Qb2ludH1cbiAgKi9cbiAga25vYigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXRBbmdsZURpc3RhbmNlKHRoaXMuZGlzdGFuY2UoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcHJvZHVjZWQgd2l0aCB0aGUgYGFuY2hvcmAgYXJjIHdpdGhcbiAgKiBgYW5nbGVEaXN0YW5jZWAsIHRvIGJlIHBlcnNpc3RlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgYW5jaG9yYCBpcyBub3Qgc2V0LlxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbihcbiAgICAgICAgYEV4cGVjdGVkIGFuY2hvciB0byBiZSBzZXQsIG51bGwgZm91bmQgaW5zdGVhZGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aEFuZ2xlRGlzdGFuY2UodGhpcy5hbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgLy8gQXJjIGFuY2hvciBpcyBhbHdheXMgZHJhd24gd2l0aG91dCBmaWxsXG4gICAgbGV0IGFuY2hvclN0eWxlID0gY29udHJvbFN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnJhYy5GaWxsLm5vbmUpXG4gICAgICA6IHRoaXMucmFjLkZpbGwubm9uZTtcblxuICAgIGZpeGVkQW5jaG9yLmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5jZW50ZXIuYW5nbGVUb1BvaW50KGtub2IpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyQW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZS5tdWx0T25lKGl0ZW0pO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShtYXJrZXJBbmdsZURpc3RhbmNlKTtcbiAgICAgIGxldCBwb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIHBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wga25vYlxuICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGlzQ2lyY2xlQ29udHJvbCA9IHRoaXMuYW5nbGVEaXN0YW5jZS5lcXVhbHModGhpcy5yYWMuQW5nbGUuemVybylcbiAgICAgICYmIHRoaXMuc3RhcnRMaW1pdCA9PSAwXG4gICAgICAmJiB0aGlzLmVuZExpbWl0ID09IDFcbiAgICBsZXQgaGFzTmVnYXRpdmVSYW5nZSA9IGlzQ2lyY2xlQ29udHJvbFxuICAgICAgfHwgdGhpcy52YWx1ZSA+PSB0aGlzLnN0YXJ0TGltaXQgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGRcbiAgICBsZXQgaGFzUG9zaXRpdmVSYW5nZSA9IGlzQ2lyY2xlQ29udHJvbFxuICAgICAgfHwgdGhpcy52YWx1ZSA8PSB0aGlzLmVuZExpbWl0IC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmIChoYXNOZWdhdGl2ZVJhbmdlKSB7XG4gICAgICBsZXQgbmVnQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSkuaW52ZXJzZSgpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIG5lZ0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGl2ZSBhcnJvd1xuICAgIGlmIChoYXNQb3NpdGl2ZVJhbmdlKSB7XG4gICAgICBsZXQgcG9zQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgcG9zQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgICAgaWYgKHBvaW50ZXJTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICpcbiAgKiBgdmFsdWVgIGlzIGFsd2F5cyB1cGRhdGVkIGJ5IHRoaXMgbWV0aG9kIHRvIGJlIHdpdGhpbiAqWzAsMV0qIGFuZFxuICAqIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuQXJjfSBmaXhlZEFuY2hvciAtIEFuY2hvciBwcm9kdWNlZCB3aXRoIGBhZmZpeEFuY2hvcmAgd2hlblxuICAqICAgdXNlciBpbnRlcmFjdGlvbiBzdGFydGVkXG4gICovXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJLbm9iQ2VudGVyLCBmaXhlZEFuY2hvcikge1xuICAgIGxldCBhbmdsZURpc3RhbmNlID0gZml4ZWRBbmNob3IuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGxldCBzdGFydEluc2V0ID0gYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgbGV0IGVuZEluc2V0ID0gYW5nbGVEaXN0YW5jZS5tdWx0T25lKDEgLSB0aGlzLmVuZExpbWl0KTtcblxuICAgIGxldCBzZWxlY3Rpb25BbmdsZSA9IGZpeGVkQW5jaG9yLmNlbnRlclxuICAgICAgLmFuZ2xlVG9Qb2ludChwb2ludGVyS25vYkNlbnRlcik7XG4gICAgc2VsZWN0aW9uQW5nbGUgPSBmaXhlZEFuY2hvci5jbGFtcFRvQW5nbGVzKHNlbGVjdGlvbkFuZ2xlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmRpc3RhbmNlRnJvbVN0YXJ0KHNlbGVjdGlvbkFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGRpc3RhbmNlUmF0aW8gPSBuZXdEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIHNlbGVjdGlvbiBzdGF0ZSBhbG9uZyB3aXRoIHBvaW50ZXIgaW50ZXJhY3Rpb24gdmlzdWFscy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSB1c2VyIHBvaW50ZXJcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGZpeGVkQW5jaG9yIC0gYEFyY2AgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgIHdoZW5cbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IHBvaW50ZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnJhYy5GaWxsLm5vbmUpO1xuICAgIGZpeGVkQW5jaG9yLmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBmaXhlZEFuY2hvci5hbmdsZURpc3RhbmNlKCk7XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBWYWx1ZSBtYXJrZXJzXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbSA8IDAgfHwgaXRlbSA+IDEpIHsgcmV0dXJuIH1cbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKGl0ZW0pKTtcbiAgICAgIGxldCBtYXJrZXJQb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIExpbWl0IG1hcmtlcnNcbiAgICBpZiAodGhpcy5zdGFydExpbWl0ID4gMCkge1xuICAgICAgbGV0IG1pbkFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5zdGFydExpbWl0KSk7XG4gICAgICBsZXQgbWluUG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWluQW5nbGUpO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gbWluQW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtaW5Qb2ludCwgbWFya2VyQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuZExpbWl0IDwgMSkge1xuICAgICAgbGV0IG1heEFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5lbmRMaW1pdCkpO1xuICAgICAgbGV0IG1heFBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1heEFuZ2xlKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IG1heEFuZ2xlLnBlcnBlbmRpY3VsYXIoIWZpeGVkQW5jaG9yLmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1heFBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG5cbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgYXJjIGNvbnRyb2wgZHJhZ2dpbmcgdmlzdWFscyFcbiAgfVxuXG59IC8vIGNsYXNzIEFyY0NvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyY0NvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFic3RyYWN0IGNsYXNzIGZvciBjb250cm9scyB0aGF0IHNlbGVjdCBhIHZhbHVlIHdpdGhpbiBhIHJhbmdlLlxuKlxuKiBDb250cm9scyBtYXkgdXNlIGFuIGBhbmNob3JgIG9iamVjdCB0byBkZXRlcm1pbmUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZlxuKiB0aGUgY29udHJvbCdzIGludGVyYWN0aXZlIGVsZW1lbnRzLiBFYWNoIGltcGxlbWVudGF0aW9uIGRldGVybWluZXMgdGhlXG4qIGNsYXNzIHVzZWQgZm9yIHRoaXMgYGFuY2hvcmAsIGZvciBleGFtcGxlXG4qIGBbQXJjQ29udHJvbF17QGxpbmsgUmFjLkFyY0NvbnRyb2x9YCB1c2VzIGFuIGBbQXJjXXtAbGluayBSYWMuQXJjfWAgYXNcbiogYW5jaG9yLCB3aGljaCBkZWZpbmVzIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLCB3aGF0IG9yaWVudGF0aW9uIGl0XG4qIHVzZXMsIGFuZCB0aGUgcG9zaXRpb24gb2YgdGhlIGNvbnRyb2wga25vYiB0aHJvdWdoIHRoZSByYW5nZSBvZiBwb3NzaWJsZVxuKiB2YWx1ZXMuXG4qXG4qIEEgY29udHJvbCBrZWVwcyBhIGB2YWx1ZWAgcHJvcGVydHkgaW4gdGhlIHJhbmdlICpbMCwxXSogZm9yIHRoZSBjdXJyZW50bHlcbiogc2VsZWN0ZWQgdmFsdWUuXG4qXG4qIFRoZSBgcHJvamVjdGlvblN0YXJ0YCBhbmQgYHByb2plY3Rpb25FbmRgIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgdG9cbiogcHJvamVjdCBgdmFsdWVgIGludG8gdGhlIHJhbmdlIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYCBieSB1c2luZ1xuKiB0aGUgYHByb2plY3RlZFZhbHVlKClgIG1ldGhvZC4gQnkgZGVmYXVsdCBzZXQgdG8gKlswLDFdKi5cbipcbiogVGhlIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCBjYW4gYmUgdXNlZCB0byByZXN0cmFpbiB0aGUgYWxsb3dhYmxlXG4qIHZhbHVlcyB0aGF0IGNhbiBiZSBzZWxlY3RlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uIEJ5IGRlZmF1bHQgc2V0IHRvXG4qICpbMCwxXSouXG4qXG4qIEBhbGlhcyBSYWMuQ29udHJvbFxuKi9cbmNsYXNzIENvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbnRyb2xgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBjb250cm9sLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogQ3VycmVudCBzZWxlY3RlZCB2YWx1ZSwgaW4gdGhlIHJhbmdlICpbMCwxXSouXG4gICAgKlxuICAgICogTWF5IGJlIGZ1cnRoZXIgY29uc3RyYWluZWQgdG8gYFtzdGFydExpbWl0LGVuZExpbWl0XWAuXG4gICAgKlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIC8qKlxuICAgICogW1Byb2plY3RlZCB2YWx1ZV17QGxpbmsgUmFjLkNvbnRyb2wjcHJvamVjdGVkVmFsdWV9IHRvIHVzZSB3aGVuXG4gICAgKiBgdmFsdWVgIGlzIGAwYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQGRlZmF1bHQgMFxuICAgICovXG4gICAgdGhpcy5wcm9qZWN0aW9uU3RhcnQgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBbUHJvamVjdGVkIHZhbHVlXXtAbGluayBSYWMuQ29udHJvbCNwcm9qZWN0ZWRWYWx1ZX0gdG8gdXNlIHdoZW5cbiAgICAqIGB2YWx1ZWAgaXMgYDFgLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnByb2plY3Rpb25FbmQgPSAxO1xuXG4gICAgLyoqXG4gICAgKiBNaW5pbXVtIGB2YWx1ZWAgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwXG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0TGltaXQgPSAwO1xuXG4gICAgLyoqXG4gICAgKiBNYXhpbXVtIGB2YWx1ZWAgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLmVuZExpbWl0ID0gMTtcblxuICAgIC8qKlxuICAgICogQ29sbGVjdGlvbiBvZiB2YWx1ZXMgYXQgd2hpY2ggdmlzdWFsIG1hcmtlcnMgYXJlIGRyYXduLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJbXX1cbiAgICAqIEBkZWZhdWx0IFtdXG4gICAgKi9cbiAgICB0aGlzLm1hcmtlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdG8gYXBwbHkgd2hlbiBkcmF3aW5nLiBUaGlzIHN0eWxlIGdldHMgYXBwbGllZCBhZnRlclxuICAgICogYFtyYWMuY29udHJvbGxlci5jb250cm9sU3R5bGVde0BsaW5rIFJhYy5Db250cm9sbGVyI2NvbnRyb2xTdHlsZX1gLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdmFsdWVgIHByb2plY3RlZCBpbnRvIHRoZSByYW5nZVxuICAqIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYC5cbiAgKlxuICAqIEJ5IGRlZmF1bHQgdGhlIHByb2plY3Rpb24gcmFuZ2UgaXMgKlswLDFdKiwgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIGFuZFxuICAqIGBwcm9qZWN0ZWRWYWx1ZSgpYCBhcmUgZXF1YWwuXG4gICpcbiAgKiBQcm9qZWN0aW9uIHJhbmdlcyB3aXRoIGEgbmVnYXRpdmUgZGlyZWN0aW9uIChFLmcuICpbNTAsMzBdKiwgd2hlblxuICAqIGBwcm9qZWN0aW9uU3RhcnRgIGlzIGdyZWF0ZXIgdGhhdCBgcHJvamVjdGlvbkVuZGApIGFyZSBzdXBwb3J0ZWQuIEFzXG4gICogYHZhbHVlYCBpbmNyZWFzZXMsIHRoZSBwcm9qZWN0aW9uIHJldHVybmVkIGRlY3JlYXNlcyBmcm9tXG4gICogYHByb2plY3Rpb25TdGFydGAgdW50aWwgcmVhY2hpbmcgYHByb2plY3Rpb25FbmRgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiA8Y2FwdGlvbj5Gb3IgYSBjb250cm9sIHdpdGggYSBwcm9qZWN0aW9uIHJhbmdlIG9mIFsxMDAsMjAwXTwvY2FwdGlvbj5cbiAgKiBjb250cm9sLnNldFByb2plY3Rpb25SYW5nZSgxMDAsIDIwMClcbiAgKiBjb250cm9sLnZhbHVlID0gMDsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgMTAwXG4gICogY29udHJvbC52YWx1ZSA9IDAuNTsgY29udHJvbC5wcm9qZWN0aW9uVmFsdWUoKSAvLyByZXR1cm5zIDE1MFxuICAqIGNvbnRyb2wudmFsdWUgPSAxOyAgIGNvbnRyb2wucHJvamVjdGlvblZhbHVlKCkgLy8gcmV0dXJucyAyMDBcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbNTAsMzBdPC9jYXB0aW9uPlxuICAqIGNvbnRyb2wuc2V0UHJvamVjdGlvblJhbmdlKDMwLCA1MClcbiAgKiBjb250cm9sLnZhbHVlID0gMDsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgNTBcbiAgKiBjb250cm9sLnZhbHVlID0gMC41OyBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgNDBcbiAgKiBjb250cm9sLnZhbHVlID0gMTsgICBjb250cm9sLnByb2plY3Rpb25WYWx1ZSgpIC8vIHJldHVybnMgMzBcbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHByb2plY3RlZFZhbHVlKCkge1xuICAgIGxldCBwcm9qZWN0aW9uUmFuZ2UgPSB0aGlzLnByb2plY3Rpb25FbmQgLSB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgICByZXR1cm4gKHRoaXMudmFsdWUgKiBwcm9qZWN0aW9uUmFuZ2UpICsgdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gIH1cblxuICAvLyBUT0RPOiByZWludHJvZHVjZSB3aGVuIHRlc3RlZFxuICAvLyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMV0qIGZvciB0aGVcbiAgLy8gYHByb2plY3RlZFZhbHVlYCBpbiB0aGUgcmFuZ2UgYFtwcm9qZWN0aW9uU3RhcnQscHJvamVjdGlvbkVuZF1gLlxuICAvLyB2YWx1ZU9mUHJvamVjdGVkKHByb2plY3RlZFZhbHVlKSB7XG4gIC8vICAgbGV0IHByb2plY3Rpb25SYW5nZSA9IHRoaXMucHJvamVjdGlvbkVuZCAtIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICAvLyAgIHJldHVybiAocHJvamVjdGVkVmFsdWUgLSB0aGlzLnByb2plY3Rpb25TdGFydCkgLyBwcm9qZWN0aW9uUmFuZ2U7XG4gIC8vIH1cblxuXG4gIC8vIFRPRE86IGRvY3VtZW50LCB0ZXN0XG4gIHNldFByb2plY3Rpb25SYW5nZShzdGFydCwgZW5kKSB7XG4gICAgdGhpcy5wcm9qZWN0aW9uU3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLnByb2plY3Rpb25FbmQgPSBlbmQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGAxYCwgY29ycmVzcG9uZGluZ2x5LlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBjb250cm9sLnNldExpbWl0c1dpdGhJbnNldHMoMC4xLCAwLjIpXG4gICogLy8gcmV0dXJucyAwLjEsIHNpbmNlIDAgKyAwLjEgPSAwLjFcbiAgKiBjb250cm9sLnN0YXJ0TGltaXRcbiAgKiAvLyByZXR1cm5zIDAuOCwgc2luY2UgMSAtIDAuMiA9IDAuOFxuICAqIGNvbnRyb2wuZW5kTGltaXRcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtOdW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDFgIHRvIHVzZSBmb3IgYGVuZExpbWl0YFxuICAqL1xuICBzZXRMaW1pdHNXaXRoSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gICAgdGhpcy5zdGFydExpbWl0ID0gc3RhcnRJbnNldDtcbiAgICB0aGlzLmVuZExpbWl0ID0gMSAtIGVuZEluc2V0O1xuICB9XG5cblxuICAvLyBUT0RPOiByZWludHJvZHVjZSB3aGVuIHRlc3RlZFxuICAvLyBTZXRzIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHR3byBpbnNldCB2YWx1ZXMgcmVsYXRpdmUgdG8gdGhlXG4gIC8vIFswLDFdIHJhbmdlLlxuICAvLyBzZXRMaW1pdHNXaXRoUHJvamVjdGlvbkluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAvLyAgIHRoaXMuc3RhcnRMaW1pdCA9IHRoaXMudmFsdWVPZihzdGFydEluc2V0KTtcbiAgLy8gICB0aGlzLmVuZExpbWl0ID0gdGhpcy52YWx1ZU9mKDEgLSBlbmRJbnNldCk7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIEFkZHMgYSBtYXJrZXIgYXQgdGhlIGN1cnJlbnQgYHZhbHVlYC5cbiAgKi9cbiAgYWRkTWFya2VyQXRDdXJyZW50VmFsdWUoKSB7XG4gICAgdGhpcy5tYXJrZXJzLnB1c2godGhpcy52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoaXMgY29udHJvbCBpcyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wuXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgaXNTZWxlY3RlZCgpIHtcbiAgICBpZiAodGhpcy5yYWMuY29udHJvbGxlci5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmNvbnRyb2wgPT09IHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcmV0dXJuIHtSYWMuUG9pbnR9XG4gICovXG4gIGtub2IoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgYW5jaG9yIHRvIGJlIHBlcnNpdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAqXG4gICogRWFjaCBpbXBsZW1lbnRhdGlvbiBkZXRlcm1pbmVzIHRoZSB0eXBlIHVzZWQgZm9yIGBhbmNob3JgIGFuZFxuICAqIGBhZmZpeEFuY2hvcigpYC5cbiAgKlxuICAqIFRoaXMgZml4ZWQgYW5jaG9yIGlzIHBhc3NlZCBiYWNrIHRvIHRoZSBjb250cm9sIHRocm91Z2hcbiAgKiBgW3VwZGF0ZVdpdGhQb2ludGVyXXtAbGluayBSYWMuQ29udHJvbCN1cGRhdGVXaXRoUG9pbnRlcn1gIGFuZFxuICAqIGBbZHJhd1NlbGVjdGlvbl17QGxpbmsgUmFjLkNvbnRyb2wjZHJhd1NlbGVjdGlvbn1gIGR1cmluZyB1c2VyXG4gICogaW50ZXJhY3Rpb24uXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqL1xuICBhZmZpeEFuY2hvcigpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqL1xuICBkcmF3KCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICogQ2FsbGVkIGJ5IGBbcmFjLmNvbnRyb2xsZXIucG9pbnRlckRyYWdnZWRde0BsaW5rIFJhYy5Db250cm9sbGVyI3BvaW50ZXJEcmFnZ2VkfWBcbiAgKiBhcyB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aCB0aGUgY29udHJvbC5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gaW50ZXJwcmV0cyBgcG9pbnRlcktub2JDZW50ZXJgIGFnYWluc3QgYGZpeGVkQW5jaG9yYFxuICAqIHRvIHVwZGF0ZSBpdHMgb3duIHZhbHVlLiBUaGUgY3VycmVudCBgYW5jaG9yYCBpcyBub3QgdXNlZCBmb3IgdGhpc1xuICAqIHVwZGF0ZSBzaW5jZSBgYW5jaG9yYCBjb3VsZCBjaGFuZ2UgZHVyaW5nIHJlZHJhdyBpbiByZXNwb25zZSB0byB1cGRhdGVzXG4gICogaW4gYHZhbHVlYC5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gaXMgYWxzbyByZXNwb25zaWJsZSBvZiBrZWVwaW5nIHRoZSB1cGRhdGVkIGB2YWx1ZWBcbiAgKiB3aXRoaW4gdGhlIHJhbmdlIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLiBUaGlzIG1ldGhvZCBpcyB0aGUgb25seSBwYXRoXG4gICogZm9yIHVwZGF0aW5nIHRoZSBjb250cm9sIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbiwgYW5kIHRodXMgdGhlIG9ubHlcbiAgKiBwbGFjZSB3aGVyZSBlYWNoIGltcGxlbWVudGF0aW9uIG11c3QgZW5mb3JjZSBhIHZhbGlkIGB2YWx1ZWAgd2l0aGluXG4gICogKlswLDFdKiBhbmQgYFtzdGFydExpbWl0LGVuZExpbWl0XWAuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtPYmplY3R9IGZpeGVkQW5jaG9yIC0gQW5jaG9yIHByb2R1Y2VkIHdoZW4gdXNlciBpbnRlcmFjdGlvblxuICAqICAgc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGFsb25nIHdpdGggcG9pbnRlciBpbnRlcmFjdGlvbiB2aXN1YWxzLlxuICAqIENhbGxlZCBieSBgW3JhYy5jb250cm9sbGVyLmRyYXdDb250cm9sc117QGxpbmsgUmFjLkNvbnRyb2xsZXIjZHJhd0NvbnRyb2xzfWBcbiAgKiBvbmx5IGZvciB0aGUgc2VsZWN0ZWQgY29udHJvbC5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtPYmplY3R9IGZpeGVkQW5jaG9yIC0gQW5jaG9yIG9mIHRoZSBjb250cm9sIHByb2R1Y2VkIHdoZW4gdXNlclxuICAqICAgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxufSAvLyBjbGFzcyBDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sO1xuXG5cbi8vIENvbnRyb2xzIHNoYXJlZCBkcmF3aW5nIGVsZW1lbnRzXG5cbkNvbnRyb2wubWFrZUFycm93U2hhcGUgPSBmdW5jdGlvbihyYWMsIGNlbnRlciwgYW5nbGUpIHtcbiAgLy8gQXJjXG4gIGxldCBhbmdsZURpc3RhbmNlID0gcmFjLkFuZ2xlLmZyb20oMS8yMik7XG4gIGxldCBhcmMgPSBjZW50ZXIuYXJjKHJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUsXG4gICAgYW5nbGUuc3VidHJhY3QoYW5nbGVEaXN0YW5jZSksIGFuZ2xlLmFkZChhbmdsZURpc3RhbmNlKSk7XG5cbiAgLy8gQXJyb3cgd2FsbHNcbiAgbGV0IHBvaW50QW5nbGUgPSByYWMuQW5nbGUuZnJvbSgxLzgpO1xuICBsZXQgcmlnaHRXYWxsID0gYXJjLnN0YXJ0UG9pbnQoKS5yYXkoYW5nbGUuYWRkKHBvaW50QW5nbGUpKTtcbiAgbGV0IGxlZnRXYWxsID0gYXJjLmVuZFBvaW50KCkucmF5KGFuZ2xlLnN1YnRyYWN0KHBvaW50QW5nbGUpKTtcblxuICAvLyBBcnJvdyBwb2ludFxuICBsZXQgcG9pbnQgPSByaWdodFdhbGwucG9pbnRBdEludGVyc2VjdGlvbihsZWZ0V2FsbCk7XG5cbiAgLy8gU2hhcGVcbiAgcmFjLnB1c2hTaGFwZSgpO1xuICBwb2ludC5zZWdtZW50VG9Qb2ludChhcmMuc3RhcnRQb2ludCgpKVxuICAgIC5hdHRhY2hUb1NoYXBlKCk7XG4gIGFyYy5hdHRhY2hUb1NoYXBlKCk7XG4gIGFyYy5lbmRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHBvaW50KVxuICAgIC5hdHRhY2hUb1NoYXBlKCk7XG5cbiAgcmV0dXJuIHJhYy5wb3BTaGFwZSgpO1xufTtcblxuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIgPSBmdW5jdGlvbihyYWMsIHBvaW50LCBhbmdsZSkge1xuICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgbGV0IHBlcnBlbmRpY3VsYXIgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZhbHNlKTtcbiAgbGV0IGNvbXBvc2l0ZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG5cbiAgcG9pbnQuc2VnbWVudFRvQW5nbGUocGVycGVuZGljdWxhciwgNClcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKDQpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG4gIHBvaW50LnBvaW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCA4KS5hcmMoMylcbiAgICAuYXR0YWNoVG8oY29tcG9zaXRlKTtcblxuICByZXR1cm4gY29tcG9zaXRlO1xufTtcblxuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIgPSBmdW5jdGlvbihyYWMsIHBvaW50LCBhbmdsZSkge1xuICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgcmV0dXJuIHBvaW50LnNlZ21lbnRUb0FuZ2xlKGFuZ2xlLnBlcnBlbmRpY3VsYXIoKSwgMylcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKDMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogSW5mb3JtYXRpb24gcmVnYXJkaW5nIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWRcbiogYFtDb250cm9sXXtAbGluayBSYWMuQ29udHJvbH1gLlxuKlxuKiBDcmVhdGVkIGFuZCBrZXB0IGJ5IGBbQ29udHJvbGxlcl17QGxpbmsgUmFjLkNvbnRyb2xsZXJ9YCB3aGVuIGEgY29udHJvbFxuKiBiZWNvbWVzIHNlbGVjdGVkLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9uXG4qL1xuY2xhc3MgQ29udHJvbFNlbGVjdGlvbntcblxuICAvKipcbiAgKiBCdWlsZHMgYSBuZXcgYFNlbGVjdGlvbmAgd2l0aCB0aGUgZ2l2ZW4gYGNvbnRyb2xgIGFuZCBwb2ludGVyIGxvY2F0ZWRcbiAgKiBhdCBgcG9pbnRlckNlbnRlcmAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db250cm9sfSBjb250cm9sIC0gVGhlIHNlbGVjdGVkIGNvbnRyb2xcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiBvZiB0aGUgcG9pbnRlciB3aGVuXG4gICogICB0aGUgc2VsZWN0aW9uIHN0YXJ0ZWRcbiAgKi9cbiAgY29uc3RydWN0b3IoY29udHJvbCwgcG9pbnRlckNlbnRlcikge1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc2VsZWN0ZWQgY29udHJvbC5cbiAgICAqIEB0eXBlIHtSYWMuQ29udHJvbH1cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbCA9IGNvbnRyb2w7XG5cbiAgICAvKipcbiAgICAqIEFuY2hvciBwcm9kdWNlZCBieVxuICAgICogYFtjb250cm9sLmFmZml4QW5jaG9yXXtAbGluayBSYWMuQ29udHJvbCNhZmZpeEFuY2hvcn1gIHdoZW4gdGhlXG4gICAgKiBzZWxlY3Rpb24gYmVnYW4uXG4gICAgKlxuICAgICogVGhpcyBhbmNob3IgaXMgcGVyc2lzdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uIGFzIHRvIGFsbG93IHRoZSB1c2VyXG4gICAgKiB0byBpbnRlcmFjdCB3aXRoIHRoZSBzZWxlY3RlZCBjb250cm9sIGluIGEgZml4ZWQgbG9jYXRpb24sIGV2ZW4gaWZcbiAgICAqIHRoZSBjb250cm9sIG1vdmVzIGR1cmluZyB0aGUgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUge09iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZml4ZWRBbmNob3IgPSBjb250cm9sLmFmZml4QW5jaG9yKCk7XG5cbiAgICAvKipcbiAgICAqIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHMgdGhlIG9mZnNldCBmcm9tIHRoZSBwb2ludGVyIHBvc2l0aW9uIHRvIHRoZVxuICAgICogY29udHJvbCBrbm9iIGNlbnRlci5cbiAgICAqXG4gICAgKiBVc2VkIHRvIGludGVyYWN0IHdpdGggdGhlIGNvbnRyb2wga25vYiBhdCBhIGNvbnN0YW50IG9mZnNldCBwb3NpdGlvblxuICAgICogZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIHBvaW50ZXIgc3RhcnRpbmcgbG9jYXRpb24gaXMgZXF1YWwgdG8gYHNlZ21lbnQuc3RhcnRQb2ludCgpYCxcbiAgICAqIHRoZSBjb250cm9sIGtub2IgY2VudGVyIHN0YXJ0aW5nIHBvc2l0aW9uIGlzIGVxdWFsIHRvXG4gICAgKiBgc2VnbWVudC5lbmRQb2ludCgpYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLlNlZ21lbnR9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ZXJUb0tub2JPZmZzZXQgPSBwb2ludGVyQ2VudGVyLnNlZ21lbnRUb1BvaW50KGNvbnRyb2wua25vYigpKTtcbiAgfVxuXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlcikge1xuICAgIHRoaXMuY29udHJvbC5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIHRoaXMuZml4ZWRBbmNob3IsIHRoaXMucG9pbnRlclRvS25vYk9mZnNldCk7XG4gIH1cbn1cblxuXG4vKipcbiogTWFuYWdlciBvZiBpbnRlcmFjdGl2ZSBgW0NvbnRyb2xde0BsaW5rIFJhYy5Db250cm9sfWBzIGZvciBhbiBpbnN0YW5jZVxuKiBvZiBgUmFjYC5cbipcbiogQ29udGFpbnMgYSBsaXN0IG9mIGFsbCBtYW5hZ2VkIGNvbnRyb2xzIGFuZCBjb29yZGluYXRlcyBkcmF3aW5nIGFuZCB1c2VyXG4qIGludGVyYWN0aW9uIGJldHdlZW4gdGhlbS5cbipcbiogRm9yIGNvbnRyb2xzIHRvIGJlIGZ1bmN0aW9uYWwgdGhlIGBwb2ludGVyUHJlc3NlZGAsIGBwb2ludGVyUmVsZWFzZWRgLFxuKiBhbmQgYHBvaW50ZXJEcmFnZ2VkYCBtZXRob2RzIGhhdmUgdG8gYmUgY2FsbGVkIGFzIHBvaW50ZXIgaW50ZXJhY3Rpb25zXG4qIGhhcHBlbi4gVGhlIGBkcmF3Q29udHJvbHNgIG1ldGhvZCBoYW5kbGVzIHRoZSBkcmF3aW5nIG9mIGFsbCBjb250cm9sc1xuKiBhbmQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBpdCBpcyB1c3VhbGx5IGNhbGxlZCBhdCB0aGUgdmVyeSBlbmRcbiogb2YgZHJhd2luZy5cbipcbiogQWxzbyBjb250YWlucyBzZXR0aW5ncyBzaGFyZWQgYmV0d2VlbiBhbGwgY29udHJvbHMgYW5kIHVzZWQgZm9yIHVzZXJcbiogaW50ZXJhY3Rpb24sIGxpa2UgYHBvaW50ZXJTdHlsZWAgdG8gZHJhdyB0aGUgcG9pbnRlciwgYGNvbnRyb2xTdHlsZWAgYXNcbiogYSBkZWZhdWx0IHN0eWxlIGZvciBkcmF3aW5nIGNvbnRyb2xzLCBhbmQgYGtub2JSYWRpdXNgIHRoYXQgZGVmaW5lcyB0aGVcbiogc2l6ZSBvZiB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudCBvZiBtb3N0IGNvbnRyb2xzLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xsZXJcbiovXG5jbGFzcyBDb250cm9sbGVyIHtcblxuICBzdGF0aWMgU2VsZWN0aW9uID0gQ29udHJvbFNlbGVjdGlvbjtcblxuXG4gIC8qKlxuICAqIEJ1aWxkcyBhIG5ldyBgQ29udHJvbGxlcmAgd2l0aCB0aGUgZ2l2ZW4gYFJhY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYykge1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIERpc3RhbmNlIGF0IHdoaWNoIHRoZSBwb2ludGVyIGlzIGNvbnNpZGVyZWQgdG8gaW50ZXJhY3Qgd2l0aCBhXG4gICAgKiBjb250cm9sIGtub2IuIEFsc28gdXNlZCBieSBjb250cm9scyBmb3IgZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5rbm9iUmFkaXVzID0gMjI7XG5cbiAgICAvKipcbiAgICAqIENvbGxlY3Rpb24gb2YgYWxsIGNvbnRyb2xscyBtYW5hZ2VkIGJ5IHRoZSBpbnN0YW5jZS4gQ29udHJvbHMgaW4gdGhpc1xuICAgICogbGlzdCBhcmUgY29uc2lkZXJlZCBmb3IgcG9pbnRlciBoaXQgdGVzdGluZyBhbmQgZm9yIGRyYXdpbmcuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5Db250cm9sW119XG4gICAgKiBAZGVmYXVsdCBbXVxuICAgICovXG4gICAgdGhpcy5jb250cm9scyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBJbmRpY2F0ZXMgY29udHJvbHMgdG8gYWRkIHRoZW1zZWx2ZXMgaW50byBgdGhpcy5jb250cm9sc2Agd2hlblxuICAgICogY3JlYXRlZC5cbiAgICAqXG4gICAgKiBUaGlzIHByb3BlcnR5IGlzIGEgc2hhcmVkIGNvbmZpZ3VyYXRpb24uIFRoZSBiZWhhdmlvdXIgaXMgaW1wbGVtZW50ZWRcbiAgICAqIGluZGVwZW5kZW50bHkgYnkgZWFjaCBjb250cm9sIGNvbnN0cnVjdG9yLlxuICAgICpcbiAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICovXG4gICAgdGhpcy5hdXRvQWRkQ29udHJvbHMgPSB0cnVlO1xuXG4gICAgLy8gVE9ETzogc2VwYXJhdGUgbGFzdENvbnRyb2wgZnJvbSBsYXN0UG9pbnRlclxuXG4gICAgLy8gTGFzdCBgUG9pbnRgIG9mIHRoZSBwb3NpdGlvbiB3aGVuIHRoZSBwb2ludGVyIHdhcyBwcmVzc2VkLCBvciBsYXN0XG4gICAgLy8gQ29udHJvbCBpbnRlcmFjdGVkIHdpdGguIFNldCB0byBgbnVsbGAgd2hlbiB0aGVyZSBoYXMgYmVlbiBub1xuICAgIC8vIGludGVyYWN0aW9uIHlldCBhbmQgd2hpbGUgdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLlxuICAgIHRoaXMubGFzdFBvaW50ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSBvYmplY3QgdXNlZCBmb3IgdGhlIHZpc3VhbCBlbGVtZW50cyByZWxhdGVkIHRvIHBvaW50ZXJcbiAgICAqIGludGVyYWN0aW9uIGFuZCBjb250cm9sIHNlbGVjdGlvbi4gV2hlbiBgbnVsbGAgbm8gcG9pbnRlciBvclxuICAgICogc2VsZWN0aW9uIHZpc3VhbHMgYXJlIGRyYXduLlxuICAgICpcbiAgICAqIEJ5IGRlZmF1bHQgY29udGFpbnMgYSBzdHlsZSB0aGF0IHVzZXMgdGhlIGN1cnJlbnQgc3Ryb2tlXG4gICAgKiBjb25maWd1cmF0aW9uIHdpdGggbm8tZmlsbC5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQge0BsaW5rIGluc3RhbmNlLkZpbGwjbm9uZX1cbiAgICAqL1xuICAgIHRoaXMucG9pbnRlclN0eWxlID0gcmFjLkZpbGwubm9uZTtcblxuICAgIC8qKlxuICAgICogRGVmYXVsdCBzdHlsZSB0byBhcHBseSBmb3IgYWxsIGNvbnRyb2xzLiBXaGVuIHNldCBpdCBpcyBhcHBsaWVkXG4gICAgKiBiZWZvcmUgY29udHJvbCBkcmF3aW5nLiBUaGUgaW5kaXZpZHVhbCBjb250cm9sIHN0eWxlIGluXG4gICAgKiBgW2NvbnRyb2wuc3R5bGVde0BsaW5rIFJhYy5Db250cm9sI3N0eWxlfWAgaXMgYXBwbGllZCBhZnRlcndhcmRzLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2xTdHlsZSA9IG51bGxcblxuICAgIC8qKlxuICAgICogU2VsZWN0aW9uIGluZm9ybWF0aW9uIGZvciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wsIG9yIGBudWxsYFxuICAgICogd2hlbiB0aGVyZSBpcyBubyBzZWxlY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuQ29udHJvbGxlci5TZWxlY3Rpb259XG4gICAgKi9cbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG5cbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG5cbiAgLyoqXG4gICogUHVzaGVzIGBjb250cm9sYCBpbnRvIGB0aGlzLmNvbnRyb2xzYCwgYWxsb3dpbmcgdGhlIGluc3RhbmNlIHRvIGhhbmRsZVxuICAqIHBvaW50ZXIgaW50ZXJhY3Rpb24gYW5kIGRyYXdpbmcgb2YgYGNvbnRyb2xgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29udHJvbH0gY29udHJvbCAtIEEgYENvbnRyb2xgIHRvIGFkZCBpbnRvIGBjb250cm9sc2BcbiAgKi9cbiAgYWRkKGNvbnRyb2wpIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIHByZXNzZWQgYXQgdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBBbGwgY29udHJvbHMgYXJlIGhpdCB0ZXN0ZWQgYW5kIHRoZSBmaXJzdFxuICAqIGNvbnRyb2wgdG8gYmUgaGl0IGlzIG1hcmtlZCBhcyBzZWxlY3RlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBwcmVzcyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICBwcmVzc2VkXG4gICovXG4gIHBvaW50ZXJQcmVzc2VkKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8vIFRlc3QgcG9pbnRlciBoaXRcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuY29udHJvbHMuZmluZCggaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sS25vYiA9IGl0ZW0ua25vYigpO1xuICAgICAgaWYgKGNvbnRyb2xLbm9iID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGNvbnRyb2xLbm9iLmRpc3RhbmNlVG9Qb2ludChwb2ludGVyQ2VudGVyKSA8PSB0aGlzLmtub2JSYWRpdXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoc2VsZWN0ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IENvbnRyb2xsZXIuU2VsZWN0aW9uKHNlbGVjdGVkLCBwb2ludGVyQ2VudGVyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gZHJhZ2dlZCB0byB0aGVcbiAgKiBgcG9pbnRlckNlbnRlcmAgbG9jYXRpb24uIFdoZW4gdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLCB1c2VyXG4gICogaW50ZXJhY3Rpb24gaXMgcGVyZm9ybWVkIGFuZCB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBhbG9uZyBwb2ludGVyIGRyYWcgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgZHJhZ2dlZFxuICAqL1xuICBwb2ludGVyRHJhZ2dlZChwb2ludGVyQ2VudGVyKXtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY29udHJvbCA9IHRoaXMuc2VsZWN0aW9uLmNvbnRyb2w7XG4gICAgbGV0IGZpeGVkQW5jaG9yID0gdGhpcy5zZWxlY3Rpb24uZml4ZWRBbmNob3I7XG5cbiAgICAvLyBPZmZzZXQgY2VudGVyIG9mIGRyYWdnZWQgY29udHJvbCBrbm9iIGZyb20gdGhlIHBvaW50ZXIgcG9zaXRpb25cbiAgICBsZXQgcG9pbnRlcktub2JDZW50ZXIgPSB0aGlzLnNlbGVjdGlvbi5wb2ludGVyVG9Lbm9iT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgY29udHJvbC51cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBOb3RpZmllcyB0aGUgaW5zdGFuY2UgdGhhdCB0aGUgcG9pbnRlciBoYXMgYmVlbiByZWxlYXNlZCBhdCB0aGVcbiAgKiBgcG9pbnRlckNlbnRlcmAgbG9jYXRpb24uIFdoZW4gdGhlcmUgaXMgYSBzZWxlY3RlZCBjb250cm9sLCB1c2VyXG4gICogaW50ZXJhY3Rpb24gaXMgZmluYWxpemVkIGFuZCB0aGUgY29udHJvbCBzZWxlY3Rpb24gaXMgY2xlYXJlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBkcmFnIGludGVyYWN0aW9uIGZvciBhbGxcbiAgKiBtYW5hZ2VkIGNvbnRyb2xzIHRvIHByb3Blcmx5IHdvcmsuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgcG9pbnRlciB3YXNcbiAgKiAgIHJlbGVhc2VkXG4gICovXG4gIHBvaW50ZXJSZWxlYXNlZChwb2ludGVyQ2VudGVyKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICB0aGlzLmxhc3RQb2ludGVyID0gcG9pbnRlckNlbnRlcjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RQb2ludGVyID0gdGhpcy5zZWxlY3Rpb24uY29udHJvbDtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIGFsbCBjb250cm9scyBjb250YWluZWQgaW5cbiAgKiBgW2NvbnRyb2xzXXtAbGluayBSYWMuQ29udHJvbGxlciNjb250cm9sc31gIGFsb25nIHRoZSB2aXN1YWwgZWxlbWVudHNcbiAgKiBmb3IgcG9pbnRlciBhbmQgY29udHJvbCBzZWxlY3Rpb24uXG4gICpcbiAgKiBVc3VhbGx5IGNhbGxlZCBhdCB0aGUgZW5kIG9mIGRyYXdpbmcsIGFzIHRvIGRyYXcgY29udHJvbHMgb24gdG9wIG9mXG4gICogb3RoZXIgZ3JhcGhpY3MuXG4gICovXG4gIGRyYXdDb250cm9scygpIHtcbiAgICBsZXQgcG9pbnRlckNlbnRlciA9IHRoaXMucmFjLlBvaW50LnBvaW50ZXIoKTtcbiAgICB0aGlzLmRyYXdQb2ludGVyKHBvaW50ZXJDZW50ZXIpO1xuXG4gICAgLy8gQWxsIGNvbnRyb2xzIGluIGRpc3BsYXlcbiAgICB0aGlzLmNvbnRyb2xzLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlcik7XG4gICAgfVxuICB9XG5cblxuICBkcmF3UG9pbnRlcihwb2ludGVyQ2VudGVyKSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMYXN0IHBvaW50ZXIgb3IgY29udHJvbFxuICAgIGlmICh0aGlzLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgUmFjLlBvaW50KSB7XG4gICAgICB0aGlzLmxhc3RQb2ludGVyLmFyYygxMikuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0UG9pbnRlciBpbnN0YW5jZW9mIFJhYy5Db250cm9sKSB7XG4gICAgICAvLyBUT0RPOiBpbXBsZW1lbnQgbGFzdCBzZWxlY3RlZCBjb250cm9sIHN0YXRlXG4gICAgfVxuXG4gICAgLy8gUG9pbnRlciBwcmVzc2VkXG4gICAgaWYgKHRoaXMucmFjLmRyYXdlci5wNS5tb3VzZUlzUHJlc3NlZCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgIHBvaW50ZXJDZW50ZXIuYXJjKDEwKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb2ludGVyQ2VudGVyLmFyYyg1KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxufSAvLyBjbGFzcyBDb250cm9sbGVyXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250cm9sIHRoYXQgYWxsb3dzIHRoZSBzZWxlY3Rpb24gb2YgYSB2YWx1ZSB3aXRoIGEga25vYiB0aGF0IHNsaWRlc1xuKiB0aHJvdWdoIHRoZSBzZWdtZW50IG9mIGEgYFJheWAuXG4qXG4qIFVzZXMgYSBgUmF5YCBhcyBgW2FuY2hvcl17QGxpbmsgUmFjLlJheUNvbnRyb2wjYW5jaG9yfWAsIHdoaWNoIGRlZmluZXNcbiogdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuKlxuKiBgW2xlbmd0aF17QGxpbmsgUmFjLlJheUNvbnRyb2wjbGVuZ3RofWAgZGVmaW5lcyB0aGUgbGVuZ3RoIG9mIHRoZVxuKiBzZWdtZW50IGluIHRoZSBgYW5jaG9yYCByYXkgd2hpY2ggaXMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuKiBXaXRoaW4gdGhpcyBzZWdtZW50IHRoZSB1c2VyIGNhbiBzbGlkZSB0aGUgY29udHJvbCBrbm9iIHRvIHNlbGVjdCBhXG4qIHZhbHVlLlxuKlxuKiBAYWxpYXMgUmFjLlJheUNvbnRyb2xcbiogQGV4dGVuZHMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBSYXlDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheUNvbnRyb2xgIGluc3RhbmNlIHdpdGggdGhlIHN0YXJ0aW5nIGB2YWx1ZWAgYW5kIHRoZVxuICAqIGludGVyYWN0aXZlIGBsZW5ndGhgLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSAtIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBjb250cm9sLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgYGFuY2hvcmAgcmF5IGF2YWlsYWJsZSBmb3JcbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb25cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgdmFsdWUsIGxlbmd0aCk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHZhbHVlLCBsZW5ndGgpO1xuXG4gICAgc3VwZXIocmFjLCB2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIExlbmd0aCBvZiB0aGUgYGFuY2hvcmAgcmF5IGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcblxuICAgIC8qKlxuICAgICogYFJheWAgdG8gd2hpY2ggdGhlIGNvbnRyb2wgd2lsbCBiZSBhbmNob3JlZC4gRGVmaW5lcyB0aGUgbG9jYXRpb25cbiAgICAqIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuICAgICpcbiAgICAqIEFsb25nIHdpdGggYFtsZW5ndGhde0BsaW5rIFJhYy5SYXlDb250cm9sI2xlbmd0aH1gIGRlZmluZXMgdGhlXG4gICAgKiBzZWdtZW50IGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgY29udHJvbCBjYW5ub3QgYmUgZHJhd24gb3Igc2VsZWN0ZWQgdW50aWwgdGhpcyBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuUmF5fVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJhYy5jb250cm9sbGVyLmF1dG9BZGRDb250cm9scykge1xuICAgICAgcmFjLmNvbnRyb2xsZXIuYWRkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gVE9ETzogZG9jdW1lbnQsIHRlc3RcbiAgc3RhcnRMaW1pdExlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydExpbWl0ICogdGhpcy5sZW5ndGg7XG4gIH1cblxuICAvLyBUT0RPOiBkb2N1bWVudCwgdGVzdFxuICBlbmRMaW1pdExlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbmRMaW1pdCAqIHRoaXMubGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGB2YWx1ZWAgdXNpbmcgdGhlIHByb2plY3Rpb24gb2YgYGxlbmd0aFZhbHVlYCBpbiB0aGUgYFswLGxlbmd0aF1gXG4gICogcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoVmFsdWUgLSBUaGUgbGVuZ3RoIGF0IHdoaWNoIHRvIHNldCB0aGUgY3VycmVudFxuICAqICAgdmFsdWVcbiAgKi9cbiAgc2V0VmFsdWVXaXRoTGVuZ3RoKGxlbmd0aFZhbHVlKSB7XG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbGVuZ3RoVmFsdWUgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGBsZW5ndGhgLCBjb3JyZXNwb25kaW5nbHksIGJvdGggcHJvamVjdGVkIGluIHRoZSBgWzAsbGVuZ3RoXWBcbiAgKiByYW5nZS5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgUmF5Q29udHJvbCB3aXRoIGxlbmd0aCBvZiAyMDA8L2NhcHRpb24+XG4gICogbGV0IGNvbnRyb2wgPSBuZXcgUmFjLlJheUNvbnRyb2wocmFjLCAwLjUsIDIwMCk7XG4gICogY29udHJvbC5zZXRMaW1pdHNXaXRoTGVuZ3RoSW5zZXRzKDEwLCAyMCk7XG4gICogLy8gcmV0dXJucyAxMCwgc2luY2UgMCArIDEwID0gMTBcbiAgKiBjb250cm9sLnN0YXJ0TGltaXRMZW5ndGgoKVxuICAqIC8vIHJldHVybnMgMC4wNSwgc2luY2UgMCArICgxMCAvIDIwMCkgPSAwLjA1XG4gICogY29udHJvbC5zdGFydExpbWl0XG4gICogLy8gcmV0dXJucyAxODAsIHNpbmNlIDIwMCAtIDIwID0gMTgwXG4gICogY29udHJvbC5lbmRMaW1pdExlbmd0aCgpXG4gICogLy8gcmV0dXJucyAwLjksIHNpbmNlIDEgLSAoMjAgLyAyMDApID0gMC45XG4gICogY29udHJvbC5lbmRMaW1pdFxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsbGVuZ3RoXWAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge051bWJlcn0gZW5kSW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgbGVuZ3RoYCBpbiB0aGUgcmFuZ2VcbiAgKiAgIGBbMCxsZW5ndGhdYCB0byB1c2UgZm9yIGBlbmRMaW1pdGBcbiAgKi9cbiAgc2V0TGltaXRzV2l0aExlbmd0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpIC8gdGhpcy5sZW5ndGg7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGBhbmNob3JgIHJheSBgc3RhcnRgIGFuZCB0aGUgY29udHJvbFxuICAqIGtub2IuXG4gICpcbiAgKiBFcXVpdmFsZW50IHRvIHRoZSBjb250cm9sIGB2YWx1ZWAgcHJvamVjdGVkIHRvIHRoZSByYW5nZSBgWzAsbGVuZ3RoXWAuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggKiB0aGlzLnZhbHVlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiBXaGVuIGBhbmNob3JgIGlzIG5vdCBzZXQsIHJldHVybnMgYG51bGxgIGluc3RlYWQuXG4gICpcbiAgKiBAcmV0dXJuIHs/UmFjLlBvaW50fVxuICAqL1xuICBrbm9iKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gTm90IHBvc2libGUgdG8gY2FsY3VsYXRlIHRoZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXREaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwcm9kdWNlZCB3aXRoIHRoZSBgYW5jaG9yYCByYXkgd2l0aCBgbGVuZ3RoYCxcbiAgKiB0byBiZSBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGFuY2hvcmAgaXMgbm90IHNldC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uKFxuICAgICAgICBgRXhwZWN0ZWQgYW5jaG9yIHRvIGJlIHNldCwgbnVsbCBmb3VuZCBpbnN0ZWFkYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5zZWdtZW50KHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgZml4ZWRBbmNob3IuZHJhdyhjb250cm9sU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5hbmdsZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIGl0ZW0pO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gQ29udHJvbCBrbm9iXG4gICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmICh0aGlzLnZhbHVlID49IHRoaXMuc3RhcnRMaW1pdCArIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA8PSB0aGlzLmVuZExpbWl0IC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgICAgaWYgKHBvaW50ZXJTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICpcbiAgKiBgdmFsdWVgIGlzIGFsd2F5cyB1cGRhdGVkIGJ5IHRoaXMgbWV0aG9kIHRvIGJlIHdpdGhpbiAqWzAsMV0qIGFuZFxuICAqIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gZml4ZWRBbmNob3IgLSBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgXG4gICogICB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogdGhpcy5zdGFydExpbWl0O1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICAvLyBOZXcgdmFsdWUgZnJvbSB0aGUgY3VycmVudCBwb2ludGVyIHBvc2l0aW9uLCByZWxhdGl2ZSB0byBmaXhlZEFuY2hvclxuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludGVyS25vYkNlbnRlcik7XG4gICAgLy8gQ2xhbXBpbmcgdmFsdWUgKGphdmFzY3JpcHQgaGFzIG5vIE1hdGguY2xhbXApXG4gICAgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5jbGFtcFRvTGVuZ3RoKG5ld0Rpc3RhbmNlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuXG4gICAgLy8gVXBkYXRlIGNvbnRyb2wgd2l0aCBuZXcgZGlzdGFuY2VcbiAgICBsZXQgbGVuZ3RoUmF0aW8gPSBuZXdEaXN0YW5jZSAvIGxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gZml4ZWRBbmNob3IgLSBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgXG4gICogICB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcbiAgICBmaXhlZEFuY2hvci5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuYW5nbGUoKTtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiBpdGVtKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIExpbWl0IG1hcmtlcnNcbiAgICBpZiAodGhpcy5zdGFydExpbWl0ID4gMCkge1xuICAgICAgbGV0IG1pblBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogdGhpcy5zdGFydExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmRMaW1pdCA8IDEpIHtcbiAgICAgIGxldCBtYXhQb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuZW5kTGltaXQpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgYW5nbGUuaW52ZXJzZSgpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWdtZW50IGZyb20gcG9pbnRlciB0byBjb250cm9sIGRyYWdnZWQgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRDZW50ZXIgPSBwb2ludGVyVG9Lbm9iT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBkcmFnZ2VkIGNlbnRlciwgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIGRyYWdnZWRDZW50ZXIuYXJjKDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIENvbnN0cmFpbmVkIGxlbmd0aCBjbGFtcGVkIHRvIGxpbWl0c1xuICAgIGxldCBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChkcmFnZ2VkQ2VudGVyKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdDtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMuZW5kTGltaXQpO1xuICAgIGNvbnN0cmFpbmVkTGVuZ3RoID0gZml4ZWRBbmNob3IuY2xhbXBUb0xlbmd0aChjb25zdHJhaW5lZExlbmd0aCxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIGxldCBjb25zdHJhaW5lZEFuY2hvckNlbnRlciA9IGZpeGVkQW5jaG9yXG4gICAgICAud2l0aExlbmd0aChjb25zdHJhaW5lZExlbmd0aClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBjZW50ZXIgY29uc3RyYWluZWQgdG8gYW5jaG9yXG4gICAgY29uc3RyYWluZWRBbmNob3JDZW50ZXIuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhZ2dlZCBzaGFkb3cgY2VudGVyLCBzZW1pIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICAvLyBhbHdheXMgcGVycGVuZGljdWxhciB0byBhbmNob3JcbiAgICBsZXQgZHJhZ2dlZFNoYWRvd0NlbnRlciA9IGRyYWdnZWRDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkoZml4ZWRBbmNob3IucmF5KVxuICAgICAgLy8gcmV2ZXJzZSBhbmQgdHJhbnNsYXRlZCB0byBjb25zdHJhaW50IHRvIGFuY2hvclxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhTdGFydFBvaW50KGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyKVxuICAgICAgLy8gU2VnbWVudCBmcm9tIGNvbnN0cmFpbmVkIGNlbnRlciB0byBzaGFkb3cgY2VudGVyXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIHNoYWRvdyBjZW50ZXJcbiAgICBkcmFnZ2VkU2hhZG93Q2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgLyAyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBFYXNlIGZvciBzZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBlYXNlT3V0ID0gUmFjLkVhc2VGdW5jdGlvbi5tYWtlRWFzZU91dCgpO1xuICAgIGVhc2VPdXQucG9zdEJlaGF2aW9yID0gUmFjLkVhc2VGdW5jdGlvbi5CZWhhdmlvci5jbGFtcDtcblxuICAgIC8vIFRhaWwgd2lsbCBzdG9wIHN0cmV0Y2hpbmcgYXQgMnggdGhlIG1heCB0YWlsIGxlbmd0aFxuICAgIGxldCBtYXhEcmFnZ2VkVGFpbExlbmd0aCA9IHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDU7XG4gICAgZWFzZU91dC5pblJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGggKiAyO1xuICAgIGVhc2VPdXQub3V0UmFuZ2UgPSBtYXhEcmFnZ2VkVGFpbExlbmd0aDtcblxuICAgIC8vIFNlZ21lbnQgdG8gZHJhZ2dlZCBzaGFkb3cgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRUYWlsID0gZHJhZ2dlZFNoYWRvd0NlbnRlclxuICAgICAgLnNlZ21lbnRUb1BvaW50KGRyYWdnZWRDZW50ZXIpO1xuXG4gICAgbGV0IGVhc2VkTGVuZ3RoID0gZWFzZU91dC5lYXNlVmFsdWUoZHJhZ2dlZFRhaWwubGVuZ3RoKTtcbiAgICBkcmFnZ2VkVGFpbC53aXRoTGVuZ3RoKGVhc2VkTGVuZ3RoKS5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhdyBhbGwhXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5Q29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5Q29udHJvbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFuZ2xlIG1lYXN1cmVkIHdpdGggYSBgdHVybmAgdmFsdWUgaW4gdGhlIHJhbmdlICpbMCwxKSogdGhhdCByZXByZXNlbnRzXG4qIHRoZSBhbW91bnQgb2YgdHVybiBpbiBhIGZ1bGwgY2lyY2xlLlxuKlxuKiBNb3N0IGZ1bmN0aW9ucyB0aHJvdWdoIFJBQyB0aGF0IGNhbiByZWNlaXZlIGFuIGBBbmdsZWAgcGFyYW1ldGVyIGNhblxuKiBhbHNvIHJlY2VpdmUgYSBgbnVtYmVyYCB2YWx1ZSB0aGF0IHdpbGwgYmUgdXNlZCBhcyBgdHVybmAgdG8gaW5zdGFudGlhdGVcbiogYSBuZXcgYEFuZ2xlYC4gVGhlIG1haW4gZXhjZXB0aW9uIHRvIHRoaXMgYmVoYXZpb3VyIGFyZSBjb25zdHJ1Y3RvcnMsXG4qIHdoaWNoIGFsd2F5cyBleHBlY3QgdG8gcmVjZWl2ZSBgQW5nbGVgIG9iamVjdHMuXG4qXG4qIEZvciBkcmF3aW5nIG9wZXJhdGlvbnMgdGhlIHR1cm4gdmFsdWUgb2YgYDBgIHBvaW50cyByaWdodCwgd2l0aCB0aGVcbiogZGlyZWN0aW9uIHJvdGF0aW5nIGNsb2Nrd2lzZTpcbiogYGBgXG4qIHJhYy5BbmdsZSgwLzQpIC8vIHBvaW50cyByaWdodFxuKiByYWMuQW5nbGUoMS80KSAvLyBwb2ludHMgZG93bndhcmRzXG4qIHJhYy5BbmdsZSgyLzQpIC8vIHBvaW50cyBsZWZ0XG4qIHJhYy5BbmdsZSgzLzQpIC8vIHBvaW50cyB1cHdhcmRzXG4qIGBgYFxuKlxuKiAjIyMgYGluc3RhbmNlLkFuZ2xlYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkFuZ2xlYCBmdW5jdGlvbl17QGxpbmsgUmFjI0FuZ2xlfSB0byBjcmVhdGUgYEFuZ2xlYCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5BbmdsZS5xdWFydGVyYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjcXVhcnRlcn0sIGxpc3RlZCB1bmRlclxuKiBbYGluc3RhbmNlLkFuZ2xlYF17QGxpbmsgaW5zdGFuY2UuQW5nbGV9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBhbmdsZSA9IG5ldyBSYWMuQW5nbGUocmFjLCAzLzgpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlckFuZ2xlID0gcmFjLkFuZ2xlKDMvOClcbipcbiogQHNlZSBbYHJhYy5BbmdsZWBde0BsaW5rIFJhYyNBbmdsZX1cbiogQHNlZSBbYGluc3RhbmNlLkFuZ2xlYF17QGxpbmsgaW5zdGFuY2UuQW5nbGV9XG4qXG4qIEBhbGlhcyBSYWMuQW5nbGVcbiovXG5jbGFzcyBBbmdsZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQW5nbGVgIGluc3RhbmNlLlxuICAqXG4gICogVGhlIGB0dXJuYCB2YWx1ZSBpcyBjb25zdHJhaW5lZCB0byB0aGUgcmFuZ2UgKlswLDEpKiwgYW55IHZhbHVlXG4gICogb3V0c2lkZSBpcyByZWR1Y2VkIGludG8gcmFuZ2UgdXNpbmcgYSBtb2R1bG8gb3BlcmF0aW9uOlxuICAqIGBgYFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgMS80KSkgLnR1cm4gLy8gcmV0dXJucyAxLzRcbiAgKiAobmV3IFJhYy5BbmdsZShyYWMsIDUvNCkpIC50dXJuIC8vIHJldHVybnMgMS80XG4gICogKG5ldyBSYWMuQW5nbGUocmFjLCAtMS80KSkudHVybiAvLyByZXR1cm5zIDMvNFxuICAqIChuZXcgUmFjLkFuZ2xlKHJhYywgMSkpICAgLnR1cm4gLy8gcmV0dXJucyAwXG4gICogKG5ldyBSYWMuQW5nbGUocmFjLCA0KSkgICAudHVybiAvLyByZXR1cm5zIDBcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gdHVybiAtIFRoZSB0dXJuIHZhbHVlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdHVybikge1xuICAgIC8vIFRPRE86IGNoYW5nZWQgdG8gYXNzZXJ0VHlwZSwgYWRkIHRlc3RzXG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHR1cm4pO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICB0dXJuID0gdHVybiAlIDE7XG4gICAgaWYgKHR1cm4gPCAwKSB7XG4gICAgICB0dXJuID0gKHR1cm4gKyAxKSAlIDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBUdXJuIHZhbHVlIG9mIHRoZSBhbmdsZSwgY29uc3RyYWluZWQgdG8gdGhlIHJhbmdlICpbMCwxKSouXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy50dXJuID0gdHVybjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnMgJ0FuZ2xlKDAuMiknXG4gICogcmFjLkFuZ2xlKDAuMikpLnRvU3RyaW5nKClcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHR1cm5TdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy50dXJuLCBkaWdpdHMpO1xuICAgIHJldHVybiBgQW5nbGUoJHt0dXJuU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBkaWZmZXJlbmNlIHdpdGggdGhlIGB0dXJuYCB2YWx1ZSBvZiB0aGUgYW5nbGVcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuQW5nbGUuZnJvbX0gYGFuZ2xlYCBpcyB1bmRlclxuICAqIFtgcmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9O1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBUaGUgYG90aGVyQW5nbGVgIHBhcmFtZXRlciBjYW4gb25seSBiZSBgQW5nbGVgIG9yIGBudW1iZXJgLCBhbnkgb3RoZXJcbiAgKiB0eXBlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFRoaXMgbWV0aG9kIHdpbGwgY29uc2lkZXIgdHVybiB2YWx1ZXMgaW4gdGhlIG9wb3NpdGUgZW5kcyBvZiB0aGUgcmFuZ2VcbiAgKiAqWzAsMSkqIGFzIGVxdWFscy4gRS5nLiBgQW5nbGVgIG9iamVjdHMgd2l0aCBgdHVybmAgdmFsdWVzIG9mIGAwYCBhbmRcbiAgKiBgMSAtIHJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQvMmAgd2lsbCBiZSBjb25zaWRlcmVkIGVxdWFsLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqXG4gICogQHNlZSBbYHJhYy5BbmdsZS5mcm9tYF17QGxpbmsgUmFjLkFuZ2xlLmZyb219XG4gICovXG4gIGVxdWFscyhvdGhlckFuZ2xlKSB7XG4gICAgaWYgKG90aGVyQW5nbGUgaW5zdGFuY2VvZiBSYWMuQW5nbGUpIHtcbiAgICAgIC8vIGFsbCBnb29kIVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG90aGVyQW5nbGUgPT09ICdudW1iZXInKSB7XG4gICAgICBvdGhlckFuZ2xlID0gQW5nbGUuZnJvbSh0aGlzLnJhYywgb3RoZXJBbmdsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnModGhpcy50dXJuIC0gb3RoZXJBbmdsZS50dXJuKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZFxuICAgICAgLy8gRm9yIGNsb3NlIHZhbHVlcyB0aGF0IGxvb3AgYXJvdW5kXG4gICAgICB8fCAoMSAtIGRpZmYpIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBBbmdsZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBgbnVtYmVyYCwgcmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGhcbiAgKiAgIGBzb21ldGhpbmdgIGFzIGB0dXJuYC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5SYXl9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYHtAbGluayBSYWMuU2VnbWVudH1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxSYWMuUmF5fFJhYy5TZWdtZW50fE51bWJlcn0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzb21ldGhpbmcgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5SYXkpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmcuYW5nbGU7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU2VnbWVudCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5yYXkuYW5nbGU7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5BbmdsZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgcmFkaWFucyAvIFJhYy5UQVUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21EZWdyZWVzKHJhYywgZGVncmVlcykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBkZWdyZWVzIC8gMzYwKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHBvaW50aW5nIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gdG8gYHRoaXNgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDMvOCwgc2luY2UgMS84ICsgMS8yID0gNS84XG4gICogcmFjLkFuZ2xlKDEvOCkuaW52ZXJzZSgpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDMvOCwgc2luY2UgNy84ICsgMS8yID0gMy84XG4gICogcmFjLkFuZ2xlKDcvOCkuaW52ZXJzZSgpLnR1cm5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkKHRoaXMucmFjLkFuZ2xlLmludmVyc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBhIHR1cm4gdmFsdWUgZXF1aXZhbGVudCB0byBgLXR1cm5gLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDMvNCwgc2luY2UgMSAtIDEvNCA9IDMvNFxuICAqIHJhYy5BbmdsZSgxLzQpLm5lZ2F0aXZlKCkudHVyblxuICAqIC8vIHJldHVybnMgNS84LCBzaW5jZSAxIC0gMy84ID0gNS84XG4gICogcmFjLkFuZ2xlKDMvOCkubmVnYXRpdmUoKS50dXJuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCAtdGhpcy50dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdoaWNoIGlzIHBlcnBlbmRpY3VsYXIgdG8gYHRoaXNgIGluIHRoZVxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zIDMvOCwgc2luY2UgMS84ICsgMS80ID0gMy84XG4gICogcmFjLkFuZ2xlKDEvOCkucGVycGVuZGljdWxhcih0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyA3LzgsIHNpbmNlIDEvOCAtIDEvNCA9IDcvOFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIoZmFsc2UpLnR1cm5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHJhZGlhbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudHVybiAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICpcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkZWdyZWVzKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiAzNjA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNpbmUgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgc2luKCkge1xuICAgIHJldHVybiBNYXRoLnNpbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgY29zaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIGNvcygpIHtcbiAgICByZXR1cm4gTWF0aC5jb3ModGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHRhbmdlbnQgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgdGFuKCkge1xuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSBgKDAsIDFdYC4gV2hlbiBgdHVybmAgaXMgZXF1YWwgdG9cbiAgKiBgMGAgcmV0dXJucyBgMWAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gICovXG4gIHR1cm5PbmUoKSB7XG4gICAgaWYgKHRoaXMudHVybiA9PT0gMCkgeyByZXR1cm4gMTsgfVxuICAgIHJldHVybiB0aGlzLnR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBzdW0gb2YgYHRoaXNgIGFuZCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFkZChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICsgYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYFxuICAqIHN1YnRyYWN0ZWQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdWJ0cmFjdChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuIC0gYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYCBzZXQgdG8gYHRoaXMudHVybiAqIGZhY3RvcmAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBtdWx0KGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAqIGZhY3Rvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYCBzZXQgdG9cbiAgKiBge0BsaW5rIFJhYy5BbmdsZSN0dXJuT25lIHRoaXMudHVybk9uZSgpfSAqIGZhY3RvcmAuXG4gICpcbiAgKiBVc2VmdWwgd2hlbiBkb2luZyByYXRpbyBjYWxjdWxhdGlvbnMgd2hlcmUgYSB6ZXJvIGFuZ2xlIGNvcnJlc3BvbmRzIHRvXG4gICogYSBjb21wbGV0ZS1jaXJjbGUuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIHJhYy5BbmdsZSgwKS5tdWx0KDAuNSkudHVybiAgICAvLyByZXR1cm5zIDBcbiAgKiAvLyB3aGVyZWFzXG4gICogcmFjLkFuZ2xlKDApLm11bHRPbmUoMC41KS50dXJuIC8vIHJldHVybnMgMC41XG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBtdWx0T25lKGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybk9uZSgpICogZmFjdG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gdGhlXG4gICogYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWAuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnMgMS8yLCBzaW5jZSAxLzIgLSAxLzQgPSAxLzRcbiAgKiByYWMuQW5nbGUoMS80KS5kaXN0YW5jZSgxLzIsIHRydWUpLnR1cm5cbiAgKiAvLyByZXR1cm5zIDMvNCwgc2luY2UgMSAtICgxLzIgLSAxLzQpID0gMy80XG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCBmYWxzZSkudHVyblxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG1lYXN1cmVtZW50XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2UoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gYW5nbGUuc3VidHJhY3QodGhpcyk7XG4gICAgcmV0dXJuIGNsb2Nrd2lzZVxuICAgICAgPyBkaXN0YW5jZVxuICAgICAgOiBkaXN0YW5jZS5uZWdhdGl2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBzaGlmdGluZyB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYCB0byBoYXZlIGB0aGlzYCBhcyBpdHMgb3JpZ2luLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgdGhlIGVxdWl2YWxlbnQgdG9cbiAgKiArIGB0aGlzLmFkZChhbmdsZSlgIHdoZW4gY2xvY2t3aXNlXG4gICogKyBgdGhpcy5zdWJ0cmFjdChhbmdsZSlgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAwLjQsIHNpbmNlIDAuMSArIDAuMyA9IDAuNFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuMywgdHJ1ZSkudHVyblxuICAqIC8vIHJldHVybnMgMC44LCBzaW5jZSAwLjEgLSAwLjMgPSAwLjhcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdCgwLjMsIGZhbHNlKS50dXJuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBiZSBzaGlmdGVkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IHRoaXMuYWRkKGFuZ2xlKVxuICAgICAgOiB0aGlzLnN1YnRyYWN0KGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBzaGlmdGluZyBgdGhpc2AgdG8gaGF2ZSB0aGUgYW5nbGVcbiAgKiBkZXJpdmVkIGZyb20gYG9yaWdpbmAgYXMgaXRzIG9yaWdpbi5cbiAgKlxuICAqIFRoZSByZXN1bHQgb2YgYGFuZ2xlLnNoaWZ0VG9PcmlnaW4ob3JpZ2luKWAgaXMgZXF1aXZhbGVudCB0b1xuICAqIGBvcmlnaW4uc2hpZnQoYW5nbGUpYC5cbiAgKlxuICAqIFRoaXMgb3BlcmF0aW9uIGlzIHRoZSBlcXVpdmFsZW50IHRvXG4gICogKyBgb3JpZ2luLmFkZCh0aGlzKWAgd2hlbiBjbG9ja3dpc2VcbiAgKiArIGBvcmlnaW4uc3VidHJhY3QodGhpcylgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJucyAwLjQsIHNpbmNlIDAuMyArIDAuMSA9IDAuNFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC4zLCB0cnVlKS50dXJuXG4gICogLy8gcmV0dXJucyAwLjIsIHNpbmNlIDAuMyAtIDAuMSA9IDAuMlxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC4zLCBmYWxzZSkudHVyblxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBvcmlnaW4gLSBBbiBgQW5nbGVgIHRvIHVzZSBhcyBvcmlnaW5cbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnRUb09yaWdpbihvcmlnaW4sIGNsb2Nrd2lzZSkge1xuICAgIG9yaWdpbiA9IHRoaXMucmFjLkFuZ2xlLmZyb20ob3JpZ2luKTtcbiAgICByZXR1cm4gb3JpZ2luLnNoaWZ0KHRoaXMsIGNsb2Nrd2lzZSk7XG4gIH1cblxufSAvLyBjbGFzcyBBbmdsZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQW5nbGU7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cblxuLyoqXG4qIEFyYyBvZiBhIGNpcmNsZSBmcm9tIGEgYHN0YXJ0YCB0byBhbiBgZW5kYCBbYW5nbGVde0BsaW5rIFJhYy5BbmdsZX0uXG4qXG4qIEFyY3MgdGhhdCBoYXZlIFtlcXVhbF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30gYHN0YXJ0YCBhbmQgYGVuZGAgYW5nbGVzXG4qIGFyZSBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuKlxuKiAjIyMgYGluc3RhbmNlLkFyY2BcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5BcmNgIGZ1bmN0aW9uXXtAbGluayBSYWMjQXJjfSB0byBjcmVhdGUgYEFyY2Agb2JqZWN0cyBmcm9tXG4qIHByaW1pdGl2ZSB2YWx1ZXMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuQXJjLnplcm9gXXtAbGluayBpbnN0YW5jZS5BcmMjemVyb30sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLkFyY2Bde0BsaW5rIGluc3RhbmNlLkFyY30uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IGNlbnRlciA9IHJhYy5Qb2ludCg1NSwgNzcpXG4qIGxldCBzdGFydCA9IHJhYy5BbmdsZSgxLzgpXG4qIGxldCBlbmQgPSByYWMuQW5nbGUoMy84KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgYXJjID0gbmV3IFJhYy5BcmMocmFjLCBjZW50ZXIsIDEwMCwgc3RhcnQsIGVuZCwgdHJ1ZSlcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyQXJjID0gcmFjLkFyYyg1NSwgNzcsIDEvOCwgMy84KVxuKlxuKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiogQHNlZSBbYHJhYy5BcmNgXXtAbGluayBSYWMjQXJjfVxuKiBAc2VlIFtgaW5zdGFuY2UuQXJjYF17QGxpbmsgaW5zdGFuY2UuQXJjfVxuKlxuKiBAYWxpYXMgUmFjLkFyY1xuKi9cbmNsYXNzIEFyY3tcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBcmNgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBjZW50ZXIgLSBUaGUgY2VudGVyIG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IHN0YXJ0IC0gQW4gYEFuZ2xlYCB3aGVyZSB0aGUgYXJjIHN0YXJ0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBlbmQgLSBBbmcgYEFuZ2xlYCB3aGVyZSB0aGUgYXJjIGVuZHNcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IGNsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYyxcbiAgICBjZW50ZXIsIHJhZGl1cyxcbiAgICBzdGFydCwgZW5kLFxuICAgIGNsb2Nrd2lzZSlcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBjZW50ZXIpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihyYWRpdXMpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBzdGFydCwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRCb29sZWFuKGNsb2Nrd2lzZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGNlbnRlciBgUG9pbnRgIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAgICovXG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAvKipcbiAgICAqIFRoZSByYWRpdXMgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcblxuICAgIC8qKlxuICAgICogVGhlIHN0YXJ0IGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gdGhpcyBhbmdsZSB0b3dhcmRzXG4gICAgKiBgZW5kYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcblxuICAgIC8qKlxuICAgICogVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBhcmMuIFRoZSBhcmMgaXMgZHJhdyBmcm9tIGBzdGFydGAgdG8gdGhpc1xuICAgICogYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAgICpcbiAgICAqIFdoZW4gYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKiB0aGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICovXG4gICAgdGhpcy5lbmQgPSBlbmQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBvcmllbnRpYXRpb24gb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICovXG4gICAgdGhpcy5jbG9ja3dpc2UgPSBjbG9ja3dpc2U7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuY2VudGVyLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHJhZGl1c1N0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJhZGl1cywgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRTdHIgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQudHVybiwgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRTdHIgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQudHVybiwgICBkaWdpdHMpO1xuICAgIHJldHVybiBgQXJjKCgke3hTdHJ9LCR7eVN0cn0pIHI6JHtyYWRpdXNTdHJ9IHM6JHtzdGFydFN0cn0gZToke2VuZFN0cn0gYzoke3RoaXMuY2xvY2t3aXNlfX0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBhbGwgbWVtYmVycywgZXhjZXB0IGByYWNgLCBvZiBib3RoIGFyY3MgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlckFyY2AgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5BcmNgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBBcmNzJyBgcmFkaXVzYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICogQHNlZSBbYGFuZ2xlLmVxdWFsc2Bde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJBcmMpIHtcbiAgICByZXR1cm4gb3RoZXJBcmMgaW5zdGFuY2VvZiBBcmNcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnJhZGl1cywgb3RoZXJBcmMucmFkaXVzKVxuICAgICAgJiYgdGhpcy5jbG9ja3dpc2UgPT09IG90aGVyQXJjLmNsb2Nrd2lzZVxuICAgICAgJiYgdGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcilcbiAgICAgICYmIHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyQXJjLnN0YXJ0KVxuICAgICAgJiYgdGhpcy5lbmQuZXF1YWxzKG90aGVyQXJjLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgYXJjOiB0aGUgcGFydCBvZiB0aGUgY2lyY3VtZmVyZW5jZSB0aGUgYXJjXG4gICogcmVwcmVzZW50cy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5nbGVEaXN0YW5jZSgpLnR1cm5PbmUoKSAqIHRoaXMucmFkaXVzICogUmFjLlRBVTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGVcbiAgKiBjaXJjbGUuXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgY2lyY3VtZmVyZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gICogYGVuZGAsIGluIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlRGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBzdGFydHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSBhcmMgZW5kcy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBzdGFydGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHN0YXJ0UmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuc3RhcnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBlbmRgLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBlbmRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBjZW50ZXJgIHRvIGBzdGFydFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc3RhcnRTZWdtZW50KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMuc3RhcnRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBjZW50ZXJgIHRvIGBlbmRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGVuZFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5lbmRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBzdGFydFBvaW50KClgIHRvIGBlbmRQb2ludCgpYC5cbiAgKlxuICAqIE5vdGUgdGhhdCBmb3IgY29tcGxldGUgY2lyY2xlIGFyY3MgdGhpcyBzZWdtZW50IHdpbGwgaGF2ZSBhIGxlbmd0aCBvZlxuICAqIHplcm8gYW5kIGJlIHBvaW50ZWQgdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBvZiBgc3RhcnRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBjaG9yZFNlZ21lbnQoKSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuc3RhcnQucGVycGVuZGljdWxhcih0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHRoaXMuZW5kUG9pbnQoKSwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmMgaXMgYSBjb21wbGV0ZSBjaXJjbGUsIHdoaWNoIGlzIHdoZW4gYHN0YXJ0YFxuICAqIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30uXG4gICpcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKiBAc2VlIFtgYW5nbGUuZXF1YWxzYF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgKi9cbiAgaXNDaXJjbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZXF1YWxzKHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBzZXQgdG8gYG5ld0NlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0NlbnRlciAtIFRoZSBjZW50ZXIgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENlbnRlcihuZXdDZW50ZXIpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIG5ld0NlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHN0YXJ0IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgY29uc3QgbmV3U3RhcnRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydEFuZ2xlLCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGVuZCBzZXQgdG8gYG5ld0VuZGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdFbmQgLSBUaGUgZW5kIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhFbmQobmV3RW5kKSB7XG4gICAgY29uc3QgbmV3RW5kQW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3RW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZEFuZ2xlLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggcmFkaXVzIHNldCB0byBgbmV3UmFkaXVzYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3UmFkaXVzIC0gVGhlIHJhZGl1cyBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoUmFkaXVzKG5ld1JhZGl1cykge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIG5ld1JhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIG9yaWVudGF0aW9uIHNldCB0byBgbmV3Q2xvY2t3aXNlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IG5ld0Nsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoQ2xvY2t3aXNlKG5ld0Nsb2Nrd2lzZSkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICBuZXdDbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBhcyB0aGUgZGlzdGFuY2VcbiAgKiBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi4gVGhpcyBjaGFuZ2VzIGBlbmRgXG4gICogZm9yIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIG9mIHRoZVxuICAqIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgW2BhcmMuYW5nbGVEaXN0YW5jZWBde0BsaW5rIFJhYy5BcmMjYW5nbGVEaXN0YW5jZX1cbiAgKi9cbiAgd2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYCBhcyB0aGUgbGVuZ3RoIG9mIHRoZVxuICAqIHBhcnQgb2YgdGhlIGNpcmN1bWZlcmVuY2UgaXQgcmVwcmVzZW50cy4gVGhpcyBjaGFuZ2VzIGBlbmRgIGZvciB0aGVcbiAgKiBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVGhlIGFjdHVhbCBgbGVuZ3RoKClgIG9mIHRoZSByZXN1bHRpbmcgYEFyY2Agd2lsbCBhbHdheXMgYmUgaW4gdGhlXG4gICogcmFuZ2UgYFswLHJhZGl1cypUQVUpYC4gV2hlbiB0aGUgZ2l2ZW4gYGxlbmd0aGAgaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBbYGxlbmd0aGBde0BsaW5rIFJhYy5BcmMjbGVuZ3RofVxuICAqL1xuICB3aXRoTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0FuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVEaXN0YW5jZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBsZW5ndGhgIGFkZGVkIHRvIHRoZSBwYXJ0IG9mIHRoZVxuICAqIGNpcmN1bWZlcmVuY2UgYHRoaXNgIHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIHJlc3VsdGluZyBgbGVuZ3RoYCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgW2BsZW5ndGhgXXtAbGluayBSYWMuQXJjI2xlbmd0aH1cbiAgKi9cbiAgd2l0aExlbmd0aEFkZChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdBbmdsZURpc3RhbmNlID0gKHRoaXMubGVuZ3RoKCkgKyBsZW5ndGgpIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlRGlzdGFuY2UobmV3QW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBhIGBsZW5ndGgoKWAgb2YgYHRoaXMubGVuZ3RoKCkgKiByYXRpb2AuIFRoaXNcbiAgKiBjaGFuZ2VzIGBlbmRgIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlICpbMCxyYWRpdXMqVEFVKSouIFdoZW4gdGhlIGNhbGN1bGF0ZWQgbGVuZ3RoIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSBjdXQgYmFjayBpbnRvIHJhbmdlIHRocm91Z2ggYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoKClgIGJ5XG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFtgbGVuZ3RoYF17QGxpbmsgUmFjLkFyYyNsZW5ndGh9XG4gICovXG4gIHdpdGhMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IHRoaXMubGVuZ3RoKCkgKiByYXRpbztcbiAgICByZXR1cm4gdGhpcy53aXRoTGVuZ3RoKG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRQb2ludCgpYCBsb2NhdGVkIGF0IGBwb2ludGAuIFRoaXNcbiAgKiBjaGFuZ2VzIGBzdGFydGAgYW5kIGByYWRpdXNgIGZvciB0aGUgbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYHN0YXJ0UG9pbnQoKSBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aFN0YXJ0UG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3UmFkaXVzID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kUG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzIGNoYW5nZXNcbiAgKiBgZW5kYCBhbmQgYHJhZGl1c2AgaW4gdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGF0IHRoZSBgZW5kUG9pbnQoKSBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aEVuZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmVuZCk7XG4gICAgY29uc3QgbmV3UmFkaXVzID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCBuZXdSYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tXG4gICogYGNlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBzdGFydGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIHdpdGhTdGFydFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLnN0YXJ0KTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBlbmRgIHBvaW50aW5nIHRvd2FyZHMgYHBvaW50YCBmcm9tIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLmVuZGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICB3aXRoRW5kVG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3RW5kID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHBvaW50aW5nIHRvd2FyZHMgYHN0YXJ0UG9pbnRgIGFuZFxuICAqIGBlbmRgIHBvaW50aW5nIHRvd2FyZHMgYGVuZFBvaW50YCwgYm90aCBmcm9tIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqICogV2hlbiBgY2VudGVyYCBpcyBjb25zaWRlcmVkIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gdG9cbiAgKiBlaXRoZXIgYHN0YXJ0UG9pbnRgIG9yIGBlbmRQb2ludGAsIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuc3RhcnRgXG4gICogb3IgYHRoaXMuZW5kYCByZXNwZWN0aXZlbHkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnRQb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0gez9SYWMuUG9pbnR9IFtlbmRQb2ludD1udWxsXSAtIEEgYFBvaW50YCB0byBwb2ludCBgZW5kYCB0b3dhcmRzO1xuICAqIHdoZW4gb21taXRlZCBvciBgbnVsbGAsIGBzdGFydFBvaW50YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgd2l0aEFuZ2xlc1Rvd2FyZHNQb2ludChzdGFydFBvaW50LCBlbmRQb2ludCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChzdGFydFBvaW50LCB0aGlzLnN0YXJ0KTtcbiAgICBjb25zdCBuZXdFbmQgPSBlbmRQb2ludCA9PT0gbnVsbFxuICAgICAgPyBuZXdTdGFydFxuICAgICAgOiB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoZW5kUG9pbnQsIHRoaXMuZW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgc3RhcnRgIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIGBhbmdsZWAgaW4gdGhlXG4gICogYXJjJ3Mgb3Bwb3NpdGUgb3JpZW50YXRpb24uXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGBzdGFydGAgdG8gdGhlIGFyYydzICpvcHBvc2l0ZSpcbiAgKiBvcmllbnRhdGlvbiwgaW50ZW5kaW5nIHRvIHJlc3VsdCBpbiBhIG5ldyBgQXJjYCB3aXRoIGFuIGluY3JlYXNlIHRvXG4gICogYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IGBzdGFydGAgYWdhaW5zdFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoU3RhcnRFeHRlbnNpb24oYW5nbGUpIHtcbiAgICBsZXQgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCAhdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZGAgc2hpZnRlZCBieSB0aGUgZ2l2ZW4gYGFuZ2xlYCBpbiB0aGVcbiAgKiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGlzIG1ldGhvZCBzaGlmdHMgYGVuZGAgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24sXG4gICogaW50ZW5kaW5nIHRvIHJlc3VsdCBpbiBhIG5ldyBgQXJjYCB3aXRoIGFuIGluY3JlYXNlIHRvXG4gICogYGFuZ2xlRGlzdGFuY2UoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0IGBzdGFydGAgYWdhaW5zdFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoRW5kRXh0ZW5zaW9uKGFuZ2xlKSB7XG4gICAgbGV0IG5ld0VuZCA9IHRoaXMuZW5kLnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBpdHMgYHN0YXJ0YCBhbmQgYGVuZGAgZXhjaGFuZ2VkLCBhbmQgdGhlXG4gICogb3Bwb3NpdGUgY2xvY2t3aXNlIG9yaWVudGF0aW9uLiBUaGUgY2VudGVyIGFuZCByYWRpdXMgcmVtYWluIGJlIHRoZVxuICAqIHNhbWUgYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLmVuZCwgdGhpcy5zdGFydCxcbiAgICAgICF0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGBhbmdsZWAgY2xhbXBlZCB0byB0aGUgcmFuZ2U6XG4gICogYGBgXG4gICogW3N0YXJ0ICsgc3RhcnRJbnNldCwgZW5kIC0gZW5kSW5zZXRdXG4gICogYGBgXG4gICogd2hlcmUgdGhlIGFkZGl0aW9uIGhhcHBlbnMgdG93YXJkcyB0aGUgYXJjJ3Mgb3JpZW50YXRpb24sIGFuZCB0aGVcbiAgKiBzdWJ0cmFjdGlvbiBhZ2FpbnN0LlxuICAqXG4gICogV2hlbiBgYW5nbGVgIGlzIG91dHNpZGUgdGhlIHJhbmdlLCByZXR1cm5zIHdoaWNoZXZlciByYW5nZSBsaW1pdCBpc1xuICAqIGNsb3Nlci5cbiAgKlxuICAqIFdoZW4gdGhlIHN1bSBvZiB0aGUgZ2l2ZW4gaW5zZXRzIGlzIGxhcmdlciB0aGF0IGB0aGlzLmFyY0Rpc3RhbmNlKClgXG4gICogdGhlIHJhbmdlIGZvciB0aGUgY2xhbXAgaXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGVcbiAgKiByZXR1cm5lZCB2YWx1ZSB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsXG4gICogY2xhbXBsZWQgdG8gYFtzdGFydCwgZW5kXWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBjbGFtcFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gW3N0YXJ0SW5zZXQ9e0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm8gcmFjLkFuZ2xlLnplcm99XSAtXG4gICogICBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmRJbnNldD17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVybyByYWMuQW5nbGUuemVyb31dIC1cbiAgKiAgIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBjbGFtcFRvQW5nbGVzKGFuZ2xlLCBzdGFydEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybywgZW5kSW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuXG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSAmJiBzdGFydEluc2V0LnR1cm4gPT0gMCAmJiBlbmRJbnNldC50dXJuID09IDApIHtcbiAgICAgIC8vIENvbXBsZXRlIGNpcmNsZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIEFuZ2xlIGluIGFyYywgd2l0aCBhcmMgYXMgb3JpZ2luXG4gICAgLy8gQWxsIGNvbXBhcmlzb25zIGFyZSBtYWRlIGluIGEgY2xvY2t3aXNlIG9yaWVudGF0aW9uXG4gICAgY29uc3Qgc2hpZnRlZEFuZ2xlID0gdGhpcy5kaXN0YW5jZUZyb21TdGFydChhbmdsZSk7XG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHNoaWZ0ZWRTdGFydENsYW1wID0gc3RhcnRJbnNldDtcbiAgICBjb25zdCBzaGlmdGVkRW5kQ2xhbXAgPSBhbmdsZURpc3RhbmNlLnN1YnRyYWN0KGVuZEluc2V0KTtcbiAgICBjb25zdCB0b3RhbEluc2V0VHVybiA9IHN0YXJ0SW5zZXQudHVybiArIGVuZEluc2V0LnR1cm47XG5cbiAgICBpZiAodG90YWxJbnNldFR1cm4gPj0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkpIHtcbiAgICAgIC8vIEludmFsaWQgcmFuZ2VcbiAgICAgIGNvbnN0IHJhbmdlRGlzdGFuY2UgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZFN0YXJ0Q2xhbXApO1xuICAgICAgbGV0IGhhbGZSYW5nZTtcbiAgICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHtcbiAgICAgICAgaGFsZlJhbmdlID0gcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYWxmUmFuZ2UgPSB0b3RhbEluc2V0VHVybiA+PSAxXG4gICAgICAgICAgPyByYW5nZURpc3RhbmNlLm11bHRPbmUoMS8yKVxuICAgICAgICAgIDogcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pZGRsZVJhbmdlID0gc2hpZnRlZEVuZENsYW1wLmFkZChoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgbWlkZGxlID0gdGhpcy5zdGFydC5zaGlmdChtaWRkbGVSYW5nZSwgdGhpcy5jbG9ja3dpc2UpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jbGFtcFRvQW5nbGVzKG1pZGRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHNoaWZ0ZWRBbmdsZS50dXJuID49IHNoaWZ0ZWRTdGFydENsYW1wLnR1cm4gJiYgc2hpZnRlZEFuZ2xlLnR1cm4gPD0gc2hpZnRlZEVuZENsYW1wLnR1cm4pIHtcbiAgICAgIC8vIEluc2lkZSBjbGFtcCByYW5nZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIE91dHNpZGUgcmFuZ2UsIGZpZ3VyZSBvdXQgY2xvc2VzdCBsaW1pdFxuICAgIGxldCBkaXN0YW5jZVRvU3RhcnRDbGFtcCA9IHNoaWZ0ZWRTdGFydENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSwgZmFsc2UpO1xuICAgIGxldCBkaXN0YW5jZVRvRW5kQ2xhbXAgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlKTtcbiAgICBpZiAoZGlzdGFuY2VUb1N0YXJ0Q2xhbXAudHVybiA8PSBkaXN0YW5jZVRvRW5kQ2xhbXAudHVybikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQuc2hpZnQoc3RhcnRJbnNldCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQuc2hpZnQoZW5kSW5zZXQsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBhbmdsZWAgaXMgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gdGhlIGFyYyByZXByZXNlbnRzIGEgY29tcGxldGUgY2lyY2xlLCBgdHJ1ZWAgaXMgYWx3YXlzIHJldHVybmVkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBpZiAodGhpcy5jbG9ja3dpc2UpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIGxldCBlbmRPZmZzZXQgPSB0aGlzLmVuZC5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybiBvZmZzZXQudHVybiA8PSBlbmRPZmZzZXQudHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMuc3RhcnQuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IHN0YXJ0T2Zmc2V0LnR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIGluIHRoZSBhcmMgaXMgcG9zaXRpb25lZFxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNQcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgYW5nbGVgIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICogYHN0YXJ0YCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYygwLCAwLCAwLjUsIG51bGwsIHRydWUpXG4gICogLy8gcmV0dXJucyAwLjYsIHNpbmNlIDAuNSArIDAuMSA9IDAuNlxuICAqIGFyYy5zaGlmdEFuZ2xlKDAuMSlcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IDxjb2RlPjAuNTwvY29kZT48L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoMCwgMCwgMC41LCBudWxsLCBmYWxzZSlcbiAgKiAvLyByZXR1cm5zIDAuMywgc2luY2UgMC41IC0gMC4yID0gMC4zXG4gICogYXJjLnNoaWZ0QW5nbGUoMC4yKVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgW2BhbmdsZS5zaGlmdGBde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH1cbiAgKi9cbiAgc2hpZnRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBzdGFydGBcbiAgKiB0byBgYW5nbGVgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIENhbiBiZSB1c2VkIHRvIGRldGVybWluZSwgZm9yIGEgZ2l2ZW4gYW5nbGUsIHdoZXJlIGl0IHNpdHMgaW5zaWRlIHRoZVxuICAqIGFyYyBpZiB0aGUgYXJjIGBzdGFydGAgd2FzIHRoZSBvcmlnaW4gYW5nbGUuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIDxjYXB0aW9uPkZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgPGNvZGU+MC41PC9jb2RlPjwvY2FwdGlvbj5cbiAgKiBsZXQgYXJjID0gcmFjLkFyYyg1NSwgNzcsIDAuNSwgbnVsbCwgdHJ1ZSlcbiAgKiAvLyByZXR1cm5zIDAuMiwgc2luY2UgMC43IC0gMC41ID0gMC4yXG4gICogYXJjLmRpc3RhbmNlRnJvbVN0YXJ0KDAuNylcbiAgKlxuICAqIEBleGFtcGxlXG4gICogPGNhcHRpb24+Rm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IDxjb2RlPjAuNTwvY29kZT48L2NhcHRpb24+XG4gICogbGV0IGFyYyA9IHJhYy5BcmMoNTUsIDc3LCAwLjUsIG51bGwsIGZhbHNlKVxuICAqIC8vIHJldHVybnMgMC44LCBzaW5jZSAxIC0gKDAuNyAtIDAuNSkgPSAwLjhcbiAgKiBhcmMuZGlzdGFuY2VGcm9tU3RhcnQoMC43KVxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZUZyb21TdGFydChhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5kaXN0YW5jZShhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgLiBUaGlzXG4gICogbWV0aG9kIGRvZXMgbm90IGNvbnNpZGVyIHRoZSBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG93YXJkcyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuY2VudGVyLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgYW5nbGVgXG4gICogW3NoaWZ0ZWQgYnlde0BsaW5rIFJhYy5BbmdsZSNzaGlmdH0gYHN0YXJ0YCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYmUgc2hpZnRlZCBieSBgc3RhcnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGUpIHtcbiAgICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5zaGlmdEFuZ2xlKGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggZnJvbSBgc3RhcnRQb2ludCgpYCB0byB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBsZW5ndGggLyB0aGlzLmNpcmN1bWZlcmVuY2UoKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCBgbGVuZ3RoKCkgKiByYXRpb2AgZnJvbVxuICAqIGBzdGFydFBvaW50KClgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIGxldCBuZXdBbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCkubXVsdE9uZShyYXRpbyk7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShuZXdBbmdsZURpc3RhbmNlKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUoc2hpZnRlZEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBhdCB0aGVcbiAgKiBnaXZlbiBgYW5nbGVgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2ZcbiAgKiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGluIHRoZVxuICAqIGRpcmVjdGlvbiB0b3dhcmRzIHRoZSBnaXZlbiBgcG9pbnRgLiBUaGlzIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGVcbiAgKiBgc3RhcnRgIG5vciBgZW5kYCBvZiB0aGUgYXJjLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMucG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIGluIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJhZGl1cyB0byByZXR1cm5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHJhZGl1c1NlZ21lbnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBhbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZvciB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZSBpbnRlcnNlY3Rpb24gb2ZcbiAgKiBgdGhpc2AgYW5kIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgU2VnbWVudGAgd2lsbCBwb2ludCB0b3dhcmRzIHRoZSBgdGhpc2Agb3JpZW50YXRpb24uXG4gICpcbiAgKiBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuICAqIGNob3JkLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgbWF5IG5vdCBsYXkgaW5zaWRlXG4gICogdGhlIGFjdHVhbCBhcmNzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIGRlc2NyaXB0aW9uXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpIHtcbiAgICAvLyBodHRwczovL21hdGh3b3JsZC53b2xmcmFtLmNvbS9DaXJjbGUtQ2lyY2xlSW50ZXJzZWN0aW9uLmh0bWxcbiAgICAvLyBSPXRoaXMsIHI9b3RoZXJBcmNcblxuICAgIGlmICh0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLmNlbnRlci5kaXN0YW5jZVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcblxuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzICsgb3RoZXJBcmMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBkaXN0YW5jZVRvQ2hvcmQgPSAoZF4yIC0gcl4yICsgUl4yKSAvIChkKjIpXG4gICAgY29uc3QgZGlzdGFuY2VUb0Nob3JkID0gKFxuICAgICAgICBNYXRoLnBvdyhkaXN0YW5jZSwgMilcbiAgICAgIC0gTWF0aC5wb3cob3RoZXJBcmMucmFkaXVzLCAyKVxuICAgICAgKyBNYXRoLnBvdyh0aGlzLnJhZGl1cywgMilcbiAgICAgICkgLyAoZGlzdGFuY2UgKiAyKTtcblxuICAgIC8vIGEgPSAxL2Qgc3FydHwoLWQrci1SKSgtZC1yK1IpKC1kK3IrUikoZCtyK1IpXG4gICAgY29uc3QgY2hvcmRMZW5ndGggPSAoMSAvIGRpc3RhbmNlKSAqIE1hdGguc3FydChcbiAgICAgICAgKC1kaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlIC0gb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAgICogKGRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpKTtcblxuICAgIGNvbnN0IHNlZ21lbnRUb0Nob3JkID0gdGhpcy5jZW50ZXIucmF5VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpXG4gICAgICAuc2VnbWVudChkaXN0YW5jZVRvQ2hvcmQpO1xuICAgIHJldHVybiBzZWdtZW50VG9DaG9yZC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIodGhpcy5jbG9ja3dpc2UsIGNob3JkTGVuZ3RoLzIpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aFJhdGlvKDIpO1xuICB9XG5cblxuICAvLyBUT0RPOiBjb25zaWRlciBpZiBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjIGlzIG5lY2Vzc2FyeVxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGludGVyc2VjdGluZyBwb2ludHMgb2YgYHRoaXNgIHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogV2hlbiB0aGVyZSBhcmUgbm8gaW50ZXJzZWN0aW5nIHBvaW50cywgcmV0dXJucyBhbiBlbXB0eSBhcnJheS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgaW50ZXJzZWN0aW9uIHBvaW50cyB3aXRoXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGludGVyc2VjdGluZ1BvaW50c1dpdGhBcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIFtdOyB9XG5cbiAgLy8gICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCldLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gIC8vICAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0pKVxuICAvLyAgICAgICAmJiBvdGhlckFyYy5jb250YWluc0FuZ2xlKG90aGVyQXJjLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSk7XG4gIC8vICAgfSwgdGhpcyk7XG5cbiAgLy8gICByZXR1cm4gaW50ZXJzZWN0aW9ucztcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgU2VnbWVudGAgd2lsbCBhbHdheXMgaGF2ZSB0aGUgc2FtZSBhbmdsZSBhcyBgcmF5YC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZFdpdGhSYXkocmF5KSB7XG4gICAgLy8gRmlyc3QgY2hlY2sgaW50ZXJzZWN0aW9uXG4gICAgY29uc3QgYmlzZWN0b3IgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkocmF5KTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IGJpc2VjdG9yLmxlbmd0aDtcblxuICAgIC8vIFNlZ21lbnQgdG9vIGNsb3NlIHRvIGNlbnRlciwgY29zaW5lIGNhbGN1bGF0aW9ucyBtYXkgYmUgaW5jb3JyZWN0XG4gICAgLy8gQ2FsY3VsYXRlIHNlZ21lbnQgdGhyb3VnaCBjZW50ZXJcbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKDAsIGRpc3RhbmNlKSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShyYXkuYW5nbGUuaW52ZXJzZSgpKTtcbiAgICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBzdGFydCwgcmF5LmFuZ2xlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMqMik7XG4gICAgfVxuXG4gICAgLy8gUmF5IGlzIHRhbmdlbnQsIHJldHVybiB6ZXJvLWxlbmd0aCBzZWdtZW50IGF0IGNvbnRhY3QgcG9pbnRcbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGRpc3RhbmNlLCB0aGlzLnJhZGl1cykpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IucmF5LmFuZ2xlKTtcbiAgICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBzdGFydCwgcmF5LmFuZ2xlKTtcbiAgICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgMCk7XG4gICAgfVxuXG4gICAgLy8gUmF5IGRvZXMgbm90IHRvdWNoIGFyY1xuICAgIGlmIChkaXN0YW5jZSA+IHRoaXMucmFkaXVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKGRpc3RhbmNlL3RoaXMucmFkaXVzKTtcbiAgICBjb25zdCBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG5cbiAgICBjb25zdCBjZW50ZXJPcmllbnRhdGlvbiA9IHJheS5wb2ludE9yaWVudGF0aW9uKHRoaXMuY2VudGVyKTtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsICFjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLmFuZ2xlKCkuc2hpZnQoYW5nbGUsIGNlbnRlck9yaWVudGF0aW9uKSk7XG4gICAgcmV0dXJuIHN0YXJ0LnNlZ21lbnRUb1BvaW50KGVuZCwgcmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHJlcHJlc2VudGluZyB0aGUgZW5kIG9mIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlXG4gICogaW50ZXJzZWN0aW9uIG9mIHRoZSBhcmMgYW5kICdyYXknLCBvciBgbnVsbGAgd2hlbiBubyBjaG9yZCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFdoZW4gYHVzZVByb2plY3Rpb25gIGlzIGB0cnVlYCB0aGUgbWV0aG9kIHdpbGwgYWx3YXlzIHJldHVybiBhIGBQb2ludGBcbiAgKiBldmVuIHdoZW4gdGhlcmUgaXMgbm8gY29udGFjdCBiZXR3ZWVuIHRoZSBhcmMgYW5kIGByYXlgLiBJbiB0aGlzIGNhc2VcbiAgKiB0aGUgcG9pbnQgaW4gdGhlIGFyYyBjbG9zZXN0IHRvIGByYXlgIGlzIHJldHVybmVkLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlIGFuZCBgcmF5YCBpcyBjb25zaWRlcmVkIGFuXG4gICogdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZEVuZFdpdGhSYXkocmF5LCB1c2VQcm9qZWN0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSk7XG4gICAgaWYgKGNob3JkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY2hvcmQuZW5kUG9pbnQoKTtcbiAgICB9XG5cbiAgICBpZiAodXNlUHJvamVjdGlvbikge1xuICAgICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoIWNlbnRlck9yaWVudGF0aW9uKTtcbiAgICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShwZXJwZW5kaWN1bGFyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCByZXByZXNlbnRpbmcgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIHRoYXQgaXMgaW5zaWRlXG4gICogYG90aGVyQXJjYCwgb3IgYG51bGxgIHdoZW4gdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLiBUaGUgcmV0dXJuZWQgYXJjXG4gICogd2lsbCBoYXZlIHRoZSBzYW1lIGNlbnRlciwgcmFkaXVzLCBhbmQgb3JpZW50YXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBpbnRlcnNlY3Rpb24sIHRodXMgdGhlIGVuZHBvaW50cyBvZiB0aGUgcmV0dXJuZWQgYXJjIG1heSBub3QgbGF5IGluc2lkZVxuICAqIGB0aGlzYC5cbiAgKlxuICAqIEFuIGVkZ2UgY2FzZSBvZiB0aGlzIG1ldGhvZCBpcyB0aGF0IHdoZW4gdGhlIGRpc3RhbmNlIGJldHdlZW4gYHRoaXNgXG4gICogYW5kIGBvdGhlckFyY2AgaXMgdGhlIHN1bSBvZiB0aGVpciByYWRpdXMsIG1lYW5pbmcgdGhlIGFyY3MgdG91Y2ggYXQgYVxuICAqIHNpbmdsZSBwb2ludCwgdGhlIHJlc3VsdGluZyBhcmMgbWF5IGhhdmUgYSBhbmdsZS1kaXN0YW5jZSBvZiB6ZXJvLFxuICAqIHdoaWNoIGlzIGludGVycHJldGVkIGFzIGEgY29tcGxldGUtY2lyY2xlIGFyYy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBpbnRlcnNlY3Qgd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLkFyY31cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHJldHVybiB0aGlzLndpdGhBbmdsZXNUb3dhcmRzUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogaW1wbGVtZW50IGludGVyc2VjdGlvbkFyY05vQ2lyY2xlP1xuXG5cbiAgLy8gVE9ETzogZmluaXNoIGJvdW5kZWRJbnRlcnNlY3Rpb25BcmNcbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCByZXByZXNlbnRpbmcgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIHRoYXQgaXMgaW5zaWRlXG4gICogYG90aGVyQXJjYCBhbmQgYm91bmRlZCBieSBgdGhpcy5zdGFydGAgYW5kIGB0aGlzLmVuZGAsIG9yIGBudWxsYCB3aGVuXG4gICogdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLiBUaGUgcmV0dXJuZWQgYXJjIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsXG4gICogcmFkaXVzLCBhbmQgb3JpZW50YXRpb24gYXMgYHRoaXNgLlxuICAqXG4gICogYG90aGVyQXJjYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLCB3aGlsZSB0aGUgc3RhcnQgYW5kIGVuZCBvZlxuICAqIGB0aGlzYCBhcmUgY29uc2lkZXJlZCBmb3IgdGhlIHJlc3VsdGluZyBgQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgZXhpc3QgdHdvIHNlcGFyYXRlIGFyYyBzZWN0aW9ucyB0aGF0IGludGVyc2VjdCB3aXRoXG4gICogYG90aGVyQXJjYDogb25seSB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgY2xvc2VzdCB0byBgc3RhcnRgIGlzIHJldHVybmVkLlxuICAqIFRoaXMgY2FuIGhhcHBlbiB3aGVuIGB0aGlzYCBzdGFydHMgaW5zaWRlIGBvdGhlckFyY2AsIHRoZW4gZXhpdHMsIGFuZFxuICAqIHRoZW4gZW5kcyBpbnNpZGUgYG90aGVyQXJjYCwgcmVnYXJkbGVzcyBpZiBgdGhpc2AgaXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBvciBub3QuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICpcbiAgKiBAaWdub3JlXG4gICovXG4gIC8vIGJvdW5kZWRJbnRlcnNlY3Rpb25BcmMob3RoZXJBcmMpIHtcbiAgLy8gICBsZXQgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKTtcbiAgLy8gICBpZiAoY2hvcmQgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAvLyAgIGxldCBjaG9yZFN0YXJ0QW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuc3RhcnRQb2ludCgpKTtcbiAgLy8gICBsZXQgY2hvcmRFbmRBbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChjaG9yZC5lbmRQb2ludCgpKTtcblxuICAvLyAgIC8vIGdldCBhbGwgZGlzdGFuY2VzIGZyb20gdGhpcy5zdGFydFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgb25seSBzdGFydCBtYXkgYmUgaW5zaWRlIGFyY1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgdGhpcy5lbmQsIHdob2xlIGFyYyBpcyBpbnNpZGUgb3Igb3V0c2lkZVxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRTdGFydEFuZ2xlLCBvbmx5IGVuZCBtYXkgYmUgaW5zaWRlIGFyY1xuICAvLyAgIGNvbnN0IGludGVyU3RhcnREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UoY2hvcmRTdGFydEFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vICAgY29uc3QgaW50ZXJFbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UoY2hvcmRFbmRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGVuZERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZSh0aGlzLmVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuXG5cbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgbm9ybWFsIHJ1bGVzXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgbm90IHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCByZXR1cm4gbnVsbFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzZWxmXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkU3RhcnQsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZGVuZCwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkZW5kXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZEVuZEFuZ2xlLCByZXR1cm4gc3RhcnQgdG8gY2hvcmRFbmRcblxuXG4gIC8vICAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoY2hvcmRTdGFydEFuZ2xlKSkge1xuICAvLyAgICAgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5zdGFydDtcbiAgLy8gICB9XG4gIC8vICAgaWYgKCF0aGlzLmNvbnRhaW5zQW5nbGUoY2hvcmRFbmRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkRW5kQW5nbGUgPSB0aGlzLmVuZDtcbiAgLy8gICB9XG5cbiAgLy8gICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgLy8gICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSxcbiAgLy8gICAgIGNob3JkRW5kQW5nbGUsXG4gIC8vICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHRoYXQgaXMgdGFuZ2VudCB0byBib3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCxcbiAgKiBvciBgbnVsbGAgd2hlbiBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUuIFRoZSBuZXcgYFNlZ21lbnRgIHN0YXJ0c1xuICAqIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGggYHRoaXNgIGFuZCBlbmRzIGF0IHRoZSBjb250YWN0IHBvaW50IHdpdGhcbiAgKiBgb3RoZXJBcmNgLlxuICAqXG4gICogQ29uc2lkZXJpbmcgX2NlbnRlciBheGlzXyBhIHJheSBmcm9tIGB0aGlzLmNlbnRlcmAgdG93YXJkc1xuICAqIGBvdGhlckFyYy5jZW50ZXJgLCBgc3RhcnRDbG9ja3dpc2VgIGRldGVybWluZXMgdGhlIHNpZGUgb2YgdGhlIHN0YXJ0XG4gICogcG9pbnQgb2YgdGhlIHJldHVybmVkIHNlZ21lbnQgaW4gcmVsYXRpb24gdG8gX2NlbnRlciBheGlzXywgYW5kXG4gICogYGVuZENsb2Nrd2lzZWAgdGhlIHNpZGUgb2YgdGhlIGVuZCBwb2ludC5cbiAgKlxuICAqIEJvdGggYHRoaXNgIGFuZCBgb3RoZXJBcmNgIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCBzZWdtZW50IHRvd2FyZHNcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IHN0YXJ0Q2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogc3RhcnQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuZENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIGVuZCBwb2ludCBpbiByZWxhdGlvbiB0byB0aGUgX2NlbnRlciBheGlzX1xuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIHRhbmdlbnRTZWdtZW50KG90aGVyQXJjLCBzdGFydENsb2Nrd2lzZSA9IHRydWUsIGVuZENsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEh5cG90aGVudXNlIG9mIHRoZSB0cmlhbmdsZSB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgdGFuZ2VudFxuICAgIC8vIG1haW4gYW5nbGUgaXMgYXQgYHRoaXMuY2VudGVyYFxuICAgIGNvbnN0IGh5cFNlZ21lbnQgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChvdGhlckFyYy5jZW50ZXIpO1xuICAgIGNvbnN0IG9wcyA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gb3RoZXJBcmMucmFkaXVzIC0gdGhpcy5yYWRpdXNcbiAgICAgIDogb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXM7XG5cbiAgICAvLyBXaGVuIG9wcyBhbmQgaHlwIGFyZSBjbG9zZSwgc25hcCB0byAxXG4gICAgY29uc3QgYW5nbGVTaW5lID0gdGhpcy5yYWMuZXF1YWxzKE1hdGguYWJzKG9wcyksIGh5cFNlZ21lbnQubGVuZ3RoKVxuICAgICAgPyAob3BzID4gMCA/IDEgOiAtMSlcbiAgICAgIDogb3BzIC8gaHlwU2VnbWVudC5sZW5ndGg7XG4gICAgaWYgKE1hdGguYWJzKGFuZ2xlU2luZSkgPiAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBjb25zdCBvcHNBbmdsZSA9IFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgYW5nbGVSYWRpYW5zKTtcblxuICAgIGNvbnN0IGFkak9yaWVudGF0aW9uID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBzdGFydENsb2Nrd2lzZVxuICAgICAgOiAhc3RhcnRDbG9ja3dpc2U7XG4gICAgY29uc3Qgc2hpZnRlZE9wc0FuZ2xlID0gaHlwU2VnbWVudC5yYXkuYW5nbGUuc2hpZnQob3BzQW5nbGUsIGFkak9yaWVudGF0aW9uKTtcbiAgICBjb25zdCBzaGlmdGVkQWRqQW5nbGUgPSBzaGlmdGVkT3BzQW5nbGUucGVycGVuZGljdWxhcihhZGpPcmllbnRhdGlvbik7XG5cbiAgICBjb25zdCBzdGFydEFuZ2xlID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBzaGlmdGVkQWRqQW5nbGVcbiAgICAgIDogc2hpZnRlZEFkakFuZ2xlLmludmVyc2UoKVxuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoc3RhcnRBbmdsZSk7XG4gICAgY29uc3QgZW5kID0gb3RoZXJBcmMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBZGpBbmdsZSk7XG4gICAgY29uc3QgZGVmYXVsdEFuZ2xlID0gc3RhcnRBbmdsZS5wZXJwZW5kaWN1bGFyKCFzdGFydENsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHN0YXJ0LnNlZ21lbnRUb1BvaW50KGVuZCwgZGVmYXVsdEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG5ldyBgQXJjYCBvYmplY3RzIHJlcHJlc2VudGluZyBgdGhpc2BcbiAgKiBkaXZpZGVkIGludG8gYGNvdW50YCBhcmNzLCBhbGwgd2l0aCB0aGUgc2FtZVxuICAqIFthbmdsZSBkaXN0YW5jZV17QGxpbmsgUmFjLkFyYyNhbmdsZURpc3RhbmNlfS5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGFycmF5LiBXaGVuIGBjb3VudGAgaXNcbiAgKiBgMWAgcmV0dXJucyBhbiBhcmMgZXF1aXZhbGVudCB0byBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgLSBOdW1iZXIgb2YgYXJjcyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLkFyY1tdfVxuICAqL1xuICBkaXZpZGVUb0FyY3MoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gW107IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICBjb25zdCBhcmNzID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvdW50OyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgZW5kID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgYXJjID0gbmV3IEFyYyh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLCBzdGFydCwgZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBhcmNzLnB1c2goYXJjKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJjcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG5ldyBgU2VnbWVudGAgb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgY2hvcmRzLCBhbGwgd2l0aCB0aGUgc2FtZSBsZW5ndGguXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG9cbiAgKiBgW3RoaXMuY2hvcmRTZWdtZW50KClde0BsaW5rIFJhYy5BcmMjY2hvcmRTZWdtZW50fWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgLSBOdW1iZXIgb2Ygc2VnbWVudHMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50W119XG4gICovXG4gIGRpdmlkZVRvU2VnbWVudHMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPD0gMCkgeyByZXR1cm4gW107IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiBpbmRleCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3QgZW5kQW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogKGluZGV4KzEpLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBzdGFydFBvaW50ID0gdGhpcy5wb2ludEF0QW5nbGUoc3RhcnRBbmdsZSk7XG4gICAgICBjb25zdCBlbmRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKGVuZEFuZ2xlKTtcbiAgICAgIGNvbnN0IHNlZ21lbnQgPSBzdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50KTtcbiAgICAgIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb21wb3NpdGVgIHRoYXQgY29udGFpbnMgYEJlemllcmAgb2JqZWN0cyByZXByZXNlbnRpbmdcbiAgKiB0aGUgYXJjIGRpdmlkZWQgaW50byBgY291bnRgIGJlemllcnMgdGhhdCBhcHByb3hpbWF0ZSB0aGUgc2hhcGUgb2YgdGhlXG4gICogYXJjLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYENvbXBvc2l0ZWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgLSBOdW1iZXIgb2YgYmV6aWVycyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLkNvbXBvc2l0ZX1cbiAgKlxuICAqIEBzZWUgW2BSYWMuQmV6aWVyYF17QGxpbmsgUmFjLkJlemllcn1cbiAgKi9cbiAgZGl2aWRlVG9CZXppZXJzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBbXSk7IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICAvLyBsZW5ndGggb2YgdGFuZ2VudDpcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gICAgY29uc3QgcGFyc1BlclR1cm4gPSAxIC8gcGFydFR1cm47XG4gICAgY29uc3QgdGFuZ2VudCA9IHRoaXMucmFkaXVzICogKDQvMykgKiBNYXRoLnRhbihSYWMuVEFVLyhwYXJzUGVyVHVybio0KSk7XG5cbiAgICBjb25zdCBiZXppZXJzID0gW107XG4gICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLmRpdmlkZVRvU2VnbWVudHMoY291bnQpO1xuICAgIHNlZ21lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBzdGFydEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uc3RhcnRQb2ludCgpKTtcbiAgICAgIGNvbnN0IGVuZEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uZW5kUG9pbnQoKSk7XG5cbiAgICAgIGxldCBzdGFydEFuY2hvciA9IHN0YXJ0QXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsICF0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgICAgLmVuZFBvaW50KCk7XG4gICAgICBsZXQgZW5kQW5jaG9yID0gZW5kQXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIHRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcblxuICAgICAgY29uc3QgbmV3QmV6aWVyID0gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHN0YXJ0QXJjUmFkaXVzLmVuZFBvaW50KCksIHN0YXJ0QW5jaG9yLFxuICAgICAgICBlbmRBbmNob3IsIGVuZEFyY1JhZGl1cy5lbmRQb2ludCgpKVxuXG4gICAgICBiZXppZXJzLnB1c2gobmV3QmV6aWVyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYywgYmV6aWVycyk7XG4gIH1cblxufSAvLyBjbGFzcyBBcmNcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyYztcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEJlemllciBjdXJ2ZSB3aXRoIHN0YXJ0LCBlbmQsIGFuZCB0d28gYW5jaG9yIFtwb2ludHNde0BsaW5rIFJhYy5Qb2ludH0uXG4qIEBhbGlhcyBSYWMuQmV6aWVyXG4qL1xuY2xhc3MgQmV6aWVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5zdGFydEFuY2hvciA9IHN0YXJ0QW5jaG9yO1xuICAgIHRoaXMuZW5kQW5jaG9yID0gZW5kQW5jaG9yO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHN0YXJ0WFN0ciAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRZU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueSwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydEFuY2hvclhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydEFuY2hvci54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLnksIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kQW5jaG9yWFN0ciAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kQW5jaG9yLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JZU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFhTdHIgICAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC54LCAgICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWVN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLnksICAgICAgICAgZGlnaXRzKTtcblxuICAgIHJldHVybiBgQmV6aWVyKHM6KCR7c3RhcnRYU3RyfSwke3N0YXJ0WVN0cn0pIHNhOigke3N0YXJ0QW5jaG9yWFN0cn0sJHtzdGFydEFuY2hvcllTdHJ9KSBlYTooJHtlbmRBbmNob3JYU3RyfSwke2VuZEFuY2hvcllTdHJ9KSBlOigke2VuZFhTdHJ9LCR7ZW5kWVN0cn0pKWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMsIGV4Y2VwdCBgcmFjYCwgb2YgYm90aCBiZXppZXJzIGFyZVxuICAqIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfTsgb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyQmV6aWVyYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkJlemllcmAsIHJldHVybnNcbiAgKiBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQmV6aWVyfSBvdGhlckJlemllciAtIEEgYEJlemllcmAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckJlemllcikge1xuICAgIHJldHVybiBvdGhlckJlemllciBpbnN0YW5jZW9mIEJlemllclxuICAgICAgJiYgdGhpcy5zdGFydCAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuc3RhcnQpXG4gICAgICAmJiB0aGlzLnN0YXJ0QW5jaG9yLmVxdWFscyhvdGhlckJlemllci5zdGFydEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kQW5jaG9yICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kICAgICAgICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZCk7XG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmV6aWVyO1xuXG5cbkJlemllci5wcm90b3R5cGUuZHJhd0FuY2hvcnMgPSBmdW5jdGlvbihzdHlsZSA9IHVuZGVmaW5lZCkge1xuICBwdXNoKCk7XG4gIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuYXBwbHkoKTtcbiAgfVxuICB0aGlzLnN0YXJ0LnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnRBbmNob3IpLmRyYXcoKTtcbiAgdGhpcy5lbmQuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRBbmNob3IpLmRyYXcoKTtcbiAgcG9wKCk7XG59O1xuXG5CZXppZXIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5lbmQsIHRoaXMuZW5kQW5jaG9yLFxuICAgIHRoaXMuc3RhcnRBbmNob3IsIHRoaXMuc3RhcnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBhIHNlcXVlbmNlIG9mIGRyYXdhYmxlIG9iamVjdHMgdGhhdCBjYW4gYmUgZHJhd24gdG9nZXRoZXIuXG4qXG4qIFVzZWQgYnkgYFtQNURyYXdlcl17QGxpbmsgUmFjLlA1RHJhd2VyfWAgdG8gcGVyZm9ybSBzcGVjaWZpYyB2ZXJ0ZXhcbiogb3BlcmF0aW9ucyB3aXRoIGRyYXdhYmxlcyB0byBkcmF3IGNvbXBsZXggc2hhcGVzLlxuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5Db21wb3NpdGVcbiovXG5mdW5jdGlvbiBDb21wb3NpdGUocmFjLCBzZXF1ZW5jZSA9IFtdKSB7XG4gIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHNlcXVlbmNlKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5zZXF1ZW5jZSA9IHNlcXVlbmNlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0ZTtcblxuXG5Db21wb3NpdGUucHJvdG90eXBlLmlzTm90RW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc2VxdWVuY2UubGVuZ3RoICE9IDA7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGVsZW1lbnQuZm9yRWFjaChpdGVtID0+IHRoaXMuc2VxdWVuY2UucHVzaChpdGVtKSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5zZXF1ZW5jZS5wdXNoKGVsZW1lbnQpO1xufTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gIGxldCByZXZlcnNlZCA9IHRoaXMuc2VxdWVuY2UubWFwKGl0ZW0gPT4gaXRlbS5yZXZlcnNlKCkpXG4gICAgLnJldmVyc2UoKTtcbiAgcmV0dXJuIG5ldyBDb21wb3NpdGUodGhpcy5yYWMsIHJldmVyc2VkKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBQb2ludCBpbiBhIHR3byBkaW1lbnRpb25hbCBjb29yZGluYXRlIHN5c3RlbS5cbipcbiogU2V2ZXJhbCBtZXRob2RzIHdpbGwgcmV0dXJuIGFuIGFkanVzdGVkIHZhbHVlIG9yIHBlcmZvcm0gYWRqdXN0bWVudHMgaW5cbiogdGhlaXIgb3BlcmF0aW9uIHdoZW4gdHdvIHBvaW50cyBhcmUgY2xvc2UgZW5vdWdoIGFzIHRvIGJlIGNvbnNpZGVyZWRcbiogZXF1YWwuIFdoZW4gdGhlIHRoZSBkaWZmZXJlbmNlIG9mIGVhY2ggY29vcmRpbmF0ZSBvZiB0d28gcG9pbnRzXG4qIGlzIHVuZGVyIHRoZSBbYGVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfSB0aGVcbiogcG9pbnRzIGFyZSBjb25zaWRlcmVkIGVxdWFsLiBUaGUgW2BlcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuKiBtZXRob2QgcGVyZm9ybXMgdGhpcyBjaGVjay5cbipcbiogIyMjIGBpbnN0YW5jZS5Qb2ludGBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5Qb2ludGAgZnVuY3Rpb25de0BsaW5rIFJhYyNQb2ludH0gdG8gY3JlYXRlIGBQb2ludGAgb2JqZWN0cyB3aXRoXG4qIGZld2VyIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuUG9pbnQub3JpZ2luYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjb3JpZ2lufSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuUG9pbnRgXXtAbGluayBpbnN0YW5jZS5Qb2ludH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IHBvaW50ID0gbmV3IFJhYy5Qb2ludChyYWMsIDU1LCA3NylcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyUG9pbnQgPSByYWMuUG9pbnQoNTUsIDc3KVxuKlxuKiBAc2VlIFtgcmFjLlBvaW50YF17QGxpbmsgUmFjI1BvaW50fVxuKiBAc2VlIFtgaW5zdGFuY2UuUG9pbnRgXXtAbGluayBpbnN0YW5jZS5Qb2ludH1cbipcbiogQGFsaWFzIFJhYy5Qb2ludFxuKi9cbmNsYXNzIFBvaW50e1xuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgUG9pbnRgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWNcbiAgKiAgIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICogICBUaGUgeCBjb29yZGluYXRlXG4gICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgKiAgIFRoZSB5IGNvb3JkaW5hdGVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB4LCB5KSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgeCwgeSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHgsIHkpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy54ID0geDtcblxuICAgIC8qKlxuICAgICogWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogLy8gcmV0dXJuczogJ1BvaW50KDU1LDc3KSdcbiAgKiByYWMuUG9pbnQoNTUsIDc3KS50b1N0cmluZygpXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMueSwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFBvaW50KCR7eFN0cn0sJHt5U3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBkaWZmZXJlbmNlIHdpdGggYG90aGVyUG9pbnRgIGZvciBlYWNoXG4gICogY29vcmRpbmF0ZSBpcyB1bmRlciBbYGVxdWFsaXR5VGhyZXNob2xkYF17QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfTtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJQb2ludGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5Qb2ludGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFZhbHVlcyBhcmUgY29tcGFyZWQgdXNpbmcgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjI2VxdWFsc30uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gb3RoZXJQb2ludCAtIEEgYFBvaW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJQb2ludCkge1xuICAgIHJldHVybiBvdGhlclBvaW50IGluc3RhbmNlb2YgUG9pbnRcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLngsIG90aGVyUG9pbnQueClcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnksIG90aGVyUG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFgobmV3WCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIG5ld1gsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBzZXQgdG8gYG5ld1hgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdZIC0gVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCwgbmV3WSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB4YCBhZGRlZCB0byBgdGhpcy54YC5cbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWCh4KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHgsIHRoaXMueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCB3aXRoIGB5YCBhZGRlZCB0byBgdGhpcy55YC5cbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkWSh5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYyxcbiAgICAgIHRoaXMueCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBhZGRpbmcgdGhlIGNvbXBvbmVudHMgb2YgYHBvaW50YCB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgcG9pbnQueCxcbiAgICAgIHRoaXMueSArIHBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzIHRvIGB0aGlzYC5cbiAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSB5IGNvb2RpbmF0ZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGQoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkgKyB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3RQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHBvaW50LngsXG4gICAgICB0aGlzLnkgLSBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IHN1YnRyYWN0aW5nIHRoZSBgeGAgYW5kIGB5YCBjb21wb25lbnRzLlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdWJ0cmFjdCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgdGhpcy54IC0geCxcbiAgICAgIHRoaXMueSAtIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCB0aGUgbmVnYXRpdmUgY29vcmRpbmF0ZSB2YWx1ZXMgb2YgYHRoaXNgLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIG5lZ2F0aXZlKCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIC10aGlzLngsIC10aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiByZXR1cm5zIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKiBAc2VlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgZGlzdGFuY2VUb1BvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHggPSBNYXRoLnBvdygocG9pbnQueCAtIHRoaXMueCksIDIpO1xuICAgIGNvbnN0IHkgPSBNYXRoLnBvdygocG9pbnQueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gcmV0dXJuIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBbYGVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9XG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGlmICh0aGlzLmVxdWFscyhwb2ludCkpIHtcbiAgICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oZGVmYXVsdEFuZ2xlKTtcbiAgICAgIHJldHVybiBkZWZhdWx0QW5nbGU7XG4gICAgfVxuICAgIGNvbnN0IG9mZnNldCA9IHBvaW50LnN1YnRyYWN0UG9pbnQodGhpcyk7XG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYXRhbjIob2Zmc2V0LnksIG9mZnNldC54KTtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IGEgYGRpc3RhbmNlYCBmcm9tIGB0aGlzYCBpbiB0aGUgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FycyB0aGUgbmV3IGBQb2ludGBcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgZGlzdGFuY2VYID0gZGlzdGFuY2UgKiBNYXRoLmNvcyhhbmdsZS5yYWRpYW5zKCkpO1xuICAgIGNvbnN0IGRpc3RhbmNlWSA9IGRpc3RhbmNlICogTWF0aC5zaW4oYW5nbGUucmFkaWFucygpKTtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLnggKyBkaXN0YW5jZVgsIHRoaXMueSArIGRpc3RhbmNlWSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBtaWRkbGUgYmV0d2VlbiBgdGhpc2AgYW5kIGBwb2ludGAuXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGNhbGN1bGF0ZSBhIGJpc2VjdG9yIHRvXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEJpc2VjdG9yKHBvaW50KSB7XG4gICAgY29uc3QgeE9mZnNldCA9IChwb2ludC54IC0gdGhpcy54KSAvIDI7XG4gICAgY29uc3QgeU9mZnNldCA9IChwb2ludC55IC0gdGhpcy55KSAvIDI7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgeE9mZnNldCwgdGhpcy55ICsgeU9mZnNldCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYEFuZ2xlYCBvZiB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheShhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG93YXJkcyBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgUmF5YCB0b3dhcmRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfVxuICAqICAgW2RlZmF1bHRBbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgQW4gYEFuZ2xlYCB0byB1c2Ugd2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGVxdWFsXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLmFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluIGByYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGFuZCBgdGhpc2AgYXJlXG4gICogW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRoZSBwcm9kdWNlZCByYXkgd2lsbCBoYXZlXG4gICogYW4gYW5nbGUgcGVycGVuZGljdWxhciB0byBgcmF5YCBpbiB0aGUgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBwcm9qZWN0IGB0aGlzYCBvbnRvXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMucmF5VG9Qb2ludChwcm9qZWN0ZWQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLCB3aGVuXG4gICogbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSBuZXcgYFJheWAgd2lsbCBiZSBpbiB0aGUgYGNsb2Nrd2lzZWAgc2lkZSBvZiB0aGUgcmF5IGZvcm1lZFxuICAqIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFyYy5jZW50ZXJgLiBgYXJjYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGVcbiAgKiBjaXJjbGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBpcyBpbnNpZGUgYGFyY2Agbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlIGFuZCBgbnVsbGBcbiAgKiBpcyByZXR1cm5lZC5cbiAgKlxuICAqIEEgc3BlY2lhbCBjYXNlIGlzIGNvbnNpZGVyZWQgd2hlbiBgYXJjLnJhZGl1c2AgaXMgY29uc2lkZXJlZCB0byBiZSBgMGBcbiAgKiBhbmQgYHRoaXNgIGlzIGVxdWFsIHRvIGBhcmMuY2VudGVyYC4gSW4gdGhpcyBjYXNlIHRoZSBhbmdsZSBiZXR3ZWVuXG4gICogYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAgaXMgYXNzdW1lZCB0byBiZSB0aGUgaW52ZXJzZSBvZiBgYXJjLnN0YXJ0YCxcbiAgKiB0aHVzIHRoZSBuZXcgYFJheWAgd2lsbCBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJuIHs/UmFjLlJheX1cbiAgKi9cbiAgcmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIC8vIEEgZGVmYXVsdCBhbmdsZSBpcyBnaXZlbiBmb3IgdGhlIGVkZ2UgY2FzZSBvZiBhIHplcm8tcmFkaXVzIGFyY1xuICAgIGxldCBoeXBvdGVudXNlID0gdGhpcy5zZWdtZW50VG9Qb2ludChhcmMuY2VudGVyLCBhcmMuc3RhcnQuaW52ZXJzZSgpKTtcbiAgICBsZXQgb3BzID0gYXJjLnJhZGl1cztcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIGFyYy5yYWRpdXMpKSB7XG4gICAgICAvLyBQb2ludCBpbiBhcmNcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSBoeXBvdGVudXNlLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIHBlcnBlbmRpY3VsYXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIDApKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVTaW5lID0gb3BzIC8gaHlwb3RlbnVzZS5sZW5ndGg7XG4gICAgaWYgKGFuZ2xlU2luZSA+IDEpIHtcbiAgICAgIC8vIFBvaW50IGluc2lkZSBhcmNcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBsZXQgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG4gICAgbGV0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cG90ZW51c2UuYW5nbGUoKS5zaGlmdChvcHNBbmdsZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgc2hpZnRlZE9wc0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgIHdpdGggdGhlIGdpdmVuXG4gICogYGxlbmd0aGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBwb2ludCB0aGUgc2VnbWVudFxuICAqIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLmFuZ2xlVG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlKTtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0byB0aGUgcHJvamVjdGlvbiBvZiBgdGhpc2AgaW5cbiAgKiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBpcyBlcXVhbCB0byBgdGhpc2AsIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGxcbiAgKiBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudFRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IHN0YXJ0cyBhdCBgdGhpc2AgYW5kIGlzIHRhbmdlbnQgdG8gYGFyY2AsXG4gICogd2hlbiBubyB0YW5nZW50IGlzIHBvc3NpYmxlIHJldHVybnMgYG51bGxgLlxuICAqXG4gICogQGRlc2NyaXB0aW9uXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBiZSBpbiB0aGUgYGNsb2Nrd2lzZWAgc2lkZSBvZiB0aGUgcmF5IGZvcm1lZFxuICAqIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFyYy5jZW50ZXJgLCBhbmQgaXRzIGVuZCBwb2ludCB3aWxsIGJlIGF0IHRoZVxuICAqIGNvbnRhY3QgcG9pbnQgd2l0aCBgYXJjYCB3aGljaCBpcyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZSBhbmQgYG51bGxgXG4gICogaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBBIHNwZWNpYWwgY2FzZSBpcyBjb25zaWRlcmVkIHdoZW4gYGFyYy5yYWRpdXNgIGlzIGNvbnNpZGVyZWQgdG8gYmUgYDBgXG4gICogYW5kIGB0aGlzYCBpcyBlcXVhbCB0byBgYXJjLmNlbnRlcmAuIEluIHRoaXMgY2FzZSB0aGUgYW5nbGUgYmV0d2VlblxuICAqIGB0aGlzYCBhbmQgYGFyYy5jZW50ZXJgIGlzIGFzc3VtZWQgdG8gYmUgdGhlIGludmVyc2Ugb2YgYGFyYy5zdGFydGAsXG4gICogdGh1cyB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgYW4gYW5nbGUgcGVycGVuZGljdWxhciB0b1xuICAqIGBhcmMuc3RhcnQuaW52ZXJzZSgpYCwgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBhcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHRvLCBjb25zaWRlcmVkXG4gICogYXMgYSBjb21wbGV0ZSBjaXJjbGVcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSB0aGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJuIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgdGFuZ2VudFJheSA9IHRoaXMucmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlKTtcbiAgICBpZiAodGFuZ2VudFJheSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdGFuZ2VudFBlcnAgPSB0YW5nZW50UmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCByYWRpdXNSYXkgPSBhcmMuY2VudGVyLnJheSh0YW5nZW50UGVycCk7XG5cbiAgICByZXR1cm4gdGFuZ2VudFJheS5zZWdtZW50VG9JbnRlcnNlY3Rpb24ocmFkaXVzUmF5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBhdCBgdGhpc2AgYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9XG4gICogICBbc3RhcnQ9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBzdGFydCBgQW5nbGVgIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmQ9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqICAgYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGBzdGFydGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKFxuICAgIHJhZGl1cyxcbiAgICBzdGFydCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sXG4gICAgZW5kID0gbnVsbCxcbiAgICBjbG9ja3dpc2UgPSB0cnVlKVxuICB7XG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYywgdGhpcywgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBsb2NhdGVkIGF0IGB0aGlzYCB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmRcbiAgKiBgZm9ybWF0YC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IFtmb3JtYXQ9W3JhYy5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fV1cbiAgKiAgIFRoZSBmb3JtYXQgb2YgdGhlIG5ldyBgVGV4dGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHRleHQoc3RyaW5nLCBmb3JtYXQgPSB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuVGV4dCh0aGlzLnJhYywgdGhpcywgc3RyaW5nLCBmb3JtYXQpO1xuICB9XG5cbn0gLy8gY2xhc3MgUG9pbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogVW5ib3VuZGVkIHJheSBmcm9tIGEgYFtQb2ludF17QGxpbmsgUmFjLlBvaW50fWAgaW4gZGlyZWN0aW9uIG9mIGFuXG4qIGBbQW5nbGVde0BsaW5rIFJhYy5BbmdsZX1gLlxuKlxuKiAjIyMgYGluc3RhbmNlLlJheWBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5SYXlgIGZ1bmN0aW9uXXtAbGluayBSYWMjUmF5fSB0byBjcmVhdGUgYFJheWAgb2JqZWN0cyBmcm9tXG4qIHByaW1pdGl2ZSB2YWx1ZXMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuUmF5LnhBeGlzYF17QGxpbmsgaW5zdGFuY2UuUmF5I3hBeGlzfSwgbGlzdGVkIHVuZGVyXG4qIFtgaW5zdGFuY2UuUmF5YF17QGxpbmsgaW5zdGFuY2UuUmF5fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgcG9pbnQgPSByYWMuUG9pbnQoNTUsIDc3KVxuKiBsZXQgYW5nbGUgPSByYWMuQW5nbGUoMS80KVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgcmF5ID0gbmV3IFJhYy5SYXkocmFjLCBwb2ludCwgYW5nbGUpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclJheSA9IHJhYy5SYXkoNTUsIDc3LCAxLzQpXG4qXG4qIEBzZWUgW2ByYWMuUmF5YF17QGxpbmsgUmFjI1JheX1cbiogQHNlZSBbYGluc3RhbmNlLlJheWBde0BsaW5rIGluc3RhbmNlLlJheX1cbipcbiogQGFsaWFzIFJhYy5SYXlcbiovXG5jbGFzcyBSYXkge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheWAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnQgLSBBIGBQb2ludGAgd2hlcmUgdGhlIHJheSBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRoZSByYXkgaXMgZGlyZWN0ZWQgdG9cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIHJheS5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSByYXkgZXh0ZW5kcy5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBSYXkoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHN0YXJ0YCBhbmQgYGFuZ2xlYCBpbiBib3RoIHJheXMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclJheWAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5SYXlgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclJheSkge1xuICAgIHJldHVybiBvdGhlclJheSBpbnN0YW5jZW9mIFJheVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJSYXkuc3RhcnQpXG4gICAgICAmJiB0aGlzLmFuZ2xlLmVxdWFscyhvdGhlclJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNsb3BlIG9mIHRoZSByYXksIG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzIHZlcnRpY2FsLlxuICAqXG4gICogSW4gdGhlIGxpbmUgZm9ybXVsYSBgeSA9IG14ICsgYmAgdGhlIHNsb3BlIGlzIGBtYC5cbiAgKlxuICAqIEByZXR1cm5zIHs/TnVtYmVyfVxuICAqL1xuICBzbG9wZSgpIHtcbiAgICBsZXQgaXNWZXJ0aWNhbCA9XG4gICAgICAgICB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUuZG93bi50dXJuKVxuICAgICAgfHwgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLnVwLnR1cm4pO1xuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB5LWludGVyY2VwdDogdGhlIHBvaW50IGF0IHdoaWNoIHRoZSByYXksIGV4dGVuZGVkIGluIGJvdGhcbiAgKiBkaXJlY3Rpb25zLCBpbnRlcmNlcHRzIHdpdGggdGhlIHktYXhpczsgb3IgYG51bGxgIGlmIHRoZSByYXkgaXNcbiAgKiB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSB5LWludGVyY2VwdCBpcyBgYmAuXG4gICpcbiAgKiBAcmV0dXJucyB7P051bWJlcn1cbiAgKi9cbiAgeUludGVyY2VwdCgpIHtcbiAgICBsZXQgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8geSA9IG14ICsgYlxuICAgIC8vIHkgLSBteCA9IGJcbiAgICByZXR1cm4gdGhpcy5zdGFydC55IC0gc2xvcGUgKiB0aGlzLnN0YXJ0Lng7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydCAtIFRoZSBzdGFydCBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnhgIHNldCB0byBgbmV3WGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld1ggLSBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWChuZXdYKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnQueWAgc2V0IHRvIGBuZXdZYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LndpdGhZKG5ld1kpLCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20obmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoYW5nbGUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLmFkZChhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkc1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2UgYW5nbGUuaW52ZXJzZSgpfWAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgaW52ZXJzZUFuZ2xlID0gdGhpcy5hbmdsZS5pbnZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIGludmVyc2VBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYGFuZ2xlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBhbG9uZyB0aGUgcmF5IGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW5cbiAgKiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGJ5IHRoZSBnaXZlbiBkaXN0YW5jZSB0b3dhcmQgdGhlXG4gICogYGFuZ2xlLnBlcnBlbmRpY3VsYXIoKWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVRvQW5nbGUocGVycGVuZGljdWxhciwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCByZXR1cm5zIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHggY29vcmRpbmF0ZSBpcyBgeGAuXG4gICogV2hlbiB0aGUgcmF5IGlzIHZlcnRpY2FsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB4XG4gICogY29vcmRpbmF0ZSBhdCBgeGAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYSB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFgoeCkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWCh4KTtcbiAgICB9XG5cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgY29uc3QgeSA9IHNsb3BlICogeCArIHRoaXMueUludGVyY2VwdCgpO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeSBjb29yZGluYXRlIGlzIGB5YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgaG9yaXpvbnRhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeVxuICAqIGNvb3JkaW5hdGUgYXQgYHlgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WSh5KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhZKHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIG14ICsgYiA9IHlcbiAgICAvLyB4ID0gKHkgLSBiKS9tXG4gICAgY29uc3QgeCA9ICh5IC0gdGhpcy55SW50ZXJjZXB0KCkpIC8gc2xvcGU7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHJheSBhdCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCBmcm9tXG4gICogYHRoaXMuc3RhcnRgLiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkXG4gICogaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBCb3RoIHJheXMgYXJlIGNvbnNpZGVyZWQgdW5ib3VuZGVkIGxpbmVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBhID0gdGhpcy5zbG9wZSgpO1xuICAgIGNvbnN0IGIgPSBvdGhlclJheS5zbG9wZSgpO1xuICAgIC8vIFBhcmFsbGVsIGxpbmVzLCBubyBpbnRlcnNlY3Rpb25cbiAgICBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoYSwgYikpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIC8vIEFueSB2ZXJ0aWNhbCByYXlcbiAgICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gb3RoZXJSYXkucG9pbnRBdFgodGhpcy5zdGFydC54KTsgfVxuICAgIGlmIChiID09PSBudWxsKSB7IHJldHVybiB0aGlzLnBvaW50QXRYKG90aGVyUmF5LnN0YXJ0LngpOyB9XG5cbiAgICBjb25zdCBjID0gdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgY29uc3QgZCA9IG90aGVyUmF5LnlJbnRlcmNlcHQoKTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpbmUlRTIlODAlOTNsaW5lX2ludGVyc2VjdGlvblxuICAgIGNvbnN0IHggPSAoZCAtIGMpIC8gKGEgLSBiKTtcbiAgICBjb25zdCB5ID0gYSAqIHggKyBjO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgb250byB0aGUgcmF5LiBUaGVcbiAgKiBwcm9qZWN0ZWQgcG9pbnQgaXMgdGhlIGNsb3Nlc3QgcG9zc2libGUgcG9pbnQgdG8gYHBvaW50YC5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IG9udG8gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50UHJvamVjdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gcG9pbnQucmF5KHBlcnBlbmRpY3VsYXIpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbih0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG8gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YFxuICAqIG9udG8gdGhlIHJheS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBkaXN0YW5jZSBpcyBwb3NpdGl2ZSB3aGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgdG93YXJkc1xuICAqIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJheSwgYW5kIG5lZ2F0aXZlIHdoZW4gaXQgaXMgYmVoaW5kLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3QgYW5kIG1lYXN1cmUgdGhlXG4gICogZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7TnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSB0aGlzLnBvaW50UHJvamVjdGlvbihwb2ludCk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlVG9Qb2ludChwcm9qZWN0ZWQpO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgMCkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlVG9Qcm9qZWN0ZWQgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwcm9qZWN0ZWQpO1xuICAgIGNvbnN0IGFuZ2xlRGlmZiA9IHRoaXMuYW5nbGUuc3VidHJhY3QoYW5nbGVUb1Byb2plY3RlZCk7XG4gICAgaWYgKGFuZ2xlRGlmZi50dXJuIDw9IDEvNCB8fCBhbmdsZURpZmYudHVybiA+IDMvNCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLWRpc3RhbmNlO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgYW5nbGUgdG8gdGhlIGdpdmVuIGBwb2ludGAgaXMgbG9jYXRlZCBjbG9ja3dpc2VcbiAgKiBvZiB0aGUgcmF5IG9yIGBmYWxzZWAgd2hlbiBsb2NhdGVkIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gb3IgYHBvaW50YCBsYW5kcyBvbiB0aGUgcmF5LCBpdCBpc1xuICAqIGNvbnNpZGVyZWQgY2xvY2t3aXNlLiBXaGVuIGBwb2ludGAgbGFuZHMgb24gdGhlXG4gICogW2ludmVyc2Vde0BsaW5rIFJhYy5SYXkjaW52ZXJzZX0gb2YgdGhlIHJheSwgaXQgaXMgY29uc2lkZXJlZFxuICAqIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIG9yaWVudGF0aW9uIHRvXG4gICogQHJldHVybnMge0Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5SYXkjaW52ZXJzZVxuICAqL1xuICBwb2ludE9yaWVudGF0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcG9pbnRBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICBpZiAodGhpcy5hbmdsZS5lcXVhbHMocG9pbnRBbmdsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBwb2ludEFuZ2xlLnN1YnRyYWN0KHRoaXMuYW5nbGUpO1xuICAgIC8vIFswIHRvIDAuNSkgaXMgY29uc2lkZXJlZCBjbG9ja3dpc2VcbiAgICAvLyBbMC41LCAxKSBpcyBjb25zaWRlcmVkIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcmV0dXJuIGFuZ2xlRGlzdGFuY2UudHVybiA8IDAuNTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICByYXlUb1BvaW50KHBvaW50KSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHVzaW5nIGB0aGlzYCBhbmQgdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50KGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMsIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zZWdtZW50VG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0YCBhbmQgZW5kaW5nIGF0IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgdGhlIGludGVyc2VjdGlvbiBwb2ludCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0ludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSk7XG4gICAgaWYgKGludGVyc2VjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KGludGVyc2VjdGlvbik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWBcbiAgKiBhbmQgdGhlIGdpdmVuIGFyYyBwcm9wZXJ0aWVzLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxOdW1iZXJ9IFtlbmRBbmdsZT1udWxsXSAtIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgbmV3XG4gICogYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGB0aGlzLmFuZ2xlYCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMocmFkaXVzLCBlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMuYW5nbGVcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgLFxuICAqIGFuZCBlbmQgYXQgdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLnN0YXJ0YCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1RvQW5nbGVEaXN0YW5jZShyYWRpdXMsIGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgZW5kQW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvLyBUT0RPOiBMZWF2aW5nIHVuZG9jdW1lbnRlZCBmb3Igbm93LCB1bnRpbCBiZXR0ZXIgdXNlL2V4cGxhbmF0aW9uIGlzIGZvdW5kXG4gIC8vIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE3MzQ3NDUvaG93LXRvLWNyZWF0ZS1jaXJjbGUtd2l0aC1iJUMzJUE5emllci1jdXJ2ZXNcbiAgYmV6aWVyQXJjKG90aGVyUmF5KSB7XG4gICAgaWYgKHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyUmF5LnN0YXJ0KSkge1xuICAgICAgLy8gV2hlbiBib3RoIHJheXMgaGF2ZSB0aGUgc2FtZSBzdGFydCwgcmV0dXJucyBhIHBvaW50IGJlemllci5cbiAgICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCxcbiAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCk7XG4gICAgfVxuXG4gICAgbGV0IGludGVyc2VjdGlvbiA9IHRoaXMucGVycGVuZGljdWxhcigpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheS5wZXJwZW5kaWN1bGFyKCkpO1xuXG4gICAgbGV0IG9yaWVudGF0aW9uID0gbnVsbDtcbiAgICBsZXQgcmFkaXVzQSA9IG51bGw7XG4gICAgbGV0IHJhZGl1c0IgPSBudWxsO1xuXG4gICAgLy8gQ2hlY2sgZm9yIHBhcmFsbGVsIHJheXNcbiAgICBpZiAoaW50ZXJzZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAvLyBOb3JtYWwgaW50ZXJzZWN0aW9uIGNhc2VcbiAgICAgIG9yaWVudGF0aW9uID0gdGhpcy5wb2ludE9yaWVudGF0aW9uKGludGVyc2VjdGlvbik7XG4gICAgICByYWRpdXNBID0gaW50ZXJzZWN0aW9uLnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnQpO1xuICAgICAgcmFkaXVzQiA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludChvdGhlclJheS5zdGFydCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gY2FzZSBvZiBwYXJhbGxlbCByYXlzLCBvdGhlclJheSBnZXRzIHNoaWZ0ZWQgdG8gYmVcbiAgICAgIC8vIHBlcnBlbmRpY3VsYXIgdG8gdGhpcy5cbiAgICAgIGxldCBzaGlmdGVkSW50ZXJzZWN0aW9uID0gdGhpcy5wZXJwZW5kaWN1bGFyKClcbiAgICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgICAgaWYgKHNoaWZ0ZWRJbnRlcnNlY3Rpb24gPT09IG51bGwgfHwgdGhpcy5zdGFydC5lcXVhbHMoc2hpZnRlZEludGVyc2VjdGlvbikpIHtcbiAgICAgICAgLy8gV2hlbiBib3RoIHJheXMgbGF5IG9uIHRvcCBvZiBlYWNoIG90aGVyLCB0aGUgc2hpZnRpbmcgcHJvZHVjZXNcbiAgICAgICAgLy8gcmF5cyB3aXRoIHRoZSBzYW1lIHN0YXJ0OyBmdW5jdGlvbiByZXR1cm5zIGEgbGluZWFyIGJlemllci5cbiAgICAgICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQsXG4gICAgICAgICAgb3RoZXJSYXkuc3RhcnQsIG90aGVyUmF5LnN0YXJ0KTtcbiAgICAgIH1cbiAgICAgIGludGVyc2VjdGlvbiA9IHRoaXMuc3RhcnQucG9pbnRBdEJpc2VjdG9yKHNoaWZ0ZWRJbnRlcnNlY3Rpb24pO1xuXG4gICAgICAvLyBDYXNlIGZvciBzaGlmdGVkIGludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byByYXlzXG4gICAgICBvcmllbnRhdGlvbiA9IHRoaXMucG9pbnRPcmllbnRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgcmFkaXVzQSA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJhZGl1c0IgPSByYWRpdXNBLmludmVyc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcmFkaXVzQS5hbmdsZSgpLmRpc3RhbmNlKHJhZGl1c0IuYW5nbGUoKSwgb3JpZW50YXRpb24pO1xuICAgIGNvbnN0IHF1YXJ0ZXJBbmdsZSA9IGFuZ2xlRGlzdGFuY2UubXVsdCgxLzQpO1xuICAgIC8vIFRPRE86IHdoYXQgaGFwcGVucyB3aXRoIHNxdWFyZSBhbmdsZXM/IGlzIHRoaXMgY292ZXJlZCBieSBpbnRlcnNlY3Rpb24gbG9naWM/XG4gICAgY29uc3QgcXVhcnRlclRhbiA9IHF1YXJ0ZXJBbmdsZS50YW4oKTtcblxuICAgIGNvbnN0IHRhbmdlbnRBID0gcXVhcnRlclRhbiAqIHJhZGl1c0EubGVuZ3RoICogNC8zO1xuICAgIGNvbnN0IGFuY2hvckEgPSB0aGlzLnBvaW50QXREaXN0YW5jZSh0YW5nZW50QSk7XG5cbiAgICBjb25zdCB0YW5nZW50QiA9IHF1YXJ0ZXJUYW4gKiByYWRpdXNCLmxlbmd0aCAqIDQvMztcbiAgICBjb25zdCBhbmNob3JCID0gb3RoZXJSYXkucG9pbnRBdERpc3RhbmNlKHRhbmdlbnRCKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgYW5jaG9yQSxcbiAgICAgICAgYW5jaG9yQiwgb3RoZXJSYXkuc3RhcnQpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYXk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBTZWdtZW50IG9mIGEgYFtSYXlde0BsaW5rIFJhYy5SYXl9YCB3aXRoIGEgZ2l2ZW4gbGVuZ3RoLlxuKlxuKiAjIyMgYGluc3RhbmNlLlNlZ21lbnRgXG4qXG4qIEluc3RhbmNlcyBvZiBgUmFjYCBjb250YWluIGEgY29udmVuaWVuY2VcbiogW2ByYWMuU2VnbWVudGAgZnVuY3Rpb25de0BsaW5rIFJhYyNTZWdtZW50fSB0byBjcmVhdGUgYFNlZ21lbnRgIG9iamVjdHNcbiogZnJvbSBwcmltaXRpdmUgdmFsdWVzLiBUaGlzIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBvYmplY3RzLCBsaWtlIFtgcmFjLlNlZ21lbnQuemVyb2Bde0BsaW5rIGluc3RhbmNlLlNlZ21lbnQjemVyb30sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLlNlZ21lbnRgXXtAbGluayBpbnN0YW5jZS5TZWdtZW50fS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgcmF5ID0gcmFjLlJheSg1NSwgNzcsIDEvNClcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IHNlZ21lbnQgPSBuZXcgUmFjLlNlZ21lbnQocmFjLCByYXksIDEwMClcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyU2VnbWVudCA9IHJhYy5TZWdtZW50KDU1LCA3NywgMS80LCAxMDApXG4qXG4qIEBzZWUgW2ByYWMuU2VnbWVudGBde0BsaW5rIFJhYyNTZWdtZW50fVxuKiBAc2VlIFtgaW5zdGFuY2UuU2VnbWVudGBde0BsaW5rIGluc3RhbmNlLlNlZ21lbnR9XG4qXG4qIEBhbGlhcyBSYWMuU2VnbWVudFxuKi9cbmNsYXNzIFNlZ21lbnQge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFNlZ21lbnRgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdGhlIHNlZ21lbnQgd2lsbCBiZSBiYXNlZCBvZlxuICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50XG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgcmF5LCBsZW5ndGgpIHtcbiAgICAvLyBUT0RPOiBkaWZmZXJlbnQgYXBwcm9hY2ggdG8gZXJyb3IgdGhyb3dpbmc/XG4gICAgLy8gYXNzZXJ0IHx8IHRocm93IG5ldyBFcnJvcihlcnIubWlzc2luZ1BhcmFtZXRlcnMpXG4gICAgLy8gb3JcbiAgICAvLyBjaGVja2VyKG1zZyA9PiB7IHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KG1zZykpO1xuICAgIC8vICAgLmV4aXN0cyhyYWMpXG4gICAgLy8gICAuaXNUeXBlKFJhYy5SYXksIHJheSlcbiAgICAvLyAgIC5pc051bWJlcihsZW5ndGgpXG5cbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCByYXksIGxlbmd0aCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUmF5LCByYXkpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihsZW5ndGgpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBgUmF5YCB0aGUgc2VnbWVudCBpcyBiYXNlZCBvZi5cbiAgICAqIEB0eXBlIHtSYWMuUmF5fVxuICAgICovXG4gICAgdGhpcy5yYXkgPSByYXk7XG5cbiAgICAvKipcbiAgICAqIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnQuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5zdGFydC54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueSwgZGlnaXRzKTtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgY29uc3QgbGVuZ3RoU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMubGVuZ3RoLCBkaWdpdHMpO1xuICAgIHJldHVybiBgU2VnbWVudCgoJHt4U3RyfSwke3lTdHJ9KSBhOiR7dHVyblN0cn0gbDoke2xlbmd0aFN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBgcmF5YCBhbmQgYGxlbmd0aGAgaW4gYm90aCBzZWdtZW50cyBhcmUgZXF1YWw7XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyU2VnbWVudGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5TZWdtZW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogU2VnbWVudHMnIGBsZW5ndGhgIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IG90aGVyU2VnbWVudCAtIEEgYFNlZ21lbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgKlxuICAqIEBzZWUgW2ByYXkuZXF1YWxzYF17QGxpbmsgUmFjLlJheSNlcXVhbHN9XG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJTZWdtZW50KSB7XG4gICAgcmV0dXJuIG90aGVyU2VnbWVudCBpbnN0YW5jZW9mIFNlZ21lbnRcbiAgICAgICYmIHRoaXMucmF5LmVxdWFscyhvdGhlclNlZ21lbnQucmF5KVxuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMubGVuZ3RoLCBvdGhlclNlZ21lbnQubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFthbmdsZV17QGxpbmsgUmFjLlJheSNhbmdsZX1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYW5nbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LmFuZ2xlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgW3N0YXJ0XXtAbGluayBSYWMuUmF5I3N0YXJ0fWAgb2YgdGhlIHNlZ21lbnQncyBgcmF5YC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdGFydFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5zdGFydDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdoZXJlIHRoZSBzZWdtZW50IGVuZHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgZW5kUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYW5nbGUgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5yYXkuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGByYXlgIHNldCB0byBgbmV3UmF5YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG5ld1JheSAtIFRoZSByYXkgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoUmF5KG5ld1JheSkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggc3RhcnQgcG9pbnQgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld1N0YXJ0UG9pbnQgLSBUaGUgc3RhcnQgcG9pbnQgZm9yIHRoZSBuZXdcbiAgKiBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhTdGFydFBvaW50KG5ld1N0YXJ0UG9pbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnRQb2ludCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBzZXQgdG8gYG5ld0xlbmd0aGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld0xlbmd0aCAtIFRoZSBsZW5ndGggZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgYWRkZWQgdG8gYHRoaXMubGVuZ3RoYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGhBZGQobGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKyBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIHNldCB0byBgdGhpcy5sZW5ndGggKiByYXRpb2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGFuZ2xlYCBhZGRlZCB0byBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlQWRkKGFuZ2xlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlQWRkKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMucmF5LntAbGluayBSYWMuQW5nbGUjc2hpZnQgYW5nbGUuc2hpZnR9KGFuZ2xlLCBjbG9ja3dpc2UpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGJlIHNoaWZ0ZWQgYnlcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIGluIHRoZSBpbnZlcnNlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBUaGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgZW5kUG9pbnQoKWAgYW5kIGBhbmdsZSgpYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBVc2luZyBhIHBvc2l0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIGxvbmdlciBzZWdtZW50LCB1c2luZyBhXG4gICogbmVnYXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgc2hvcnRlciBvbmUuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhTdGFydEV4dGVuc2lvbihkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2UoLWRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGggKyBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGRpc3RhbmNlYCBhZGRlZCB0byBgdGhpcy5sZW5ndGhgLCB3aGljaFxuICAqIHJlc3VsdHMgaW4gYGVuZFBvaW50KClgIGZvciB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBtb3ZpbmcgaW4gdGhlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHRoZSBzYW1lIG9wZXJhdGlvbiBhc1xuICAqIGBbd2l0aExlbmd0aEFkZF17QGxpbmsgUmFjLlNlZ21lbnQjd2l0aExlbmd0aEFkZH1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIGFkZCB0byBgbGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLndpdGhMZW5ndGhBZGQoZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwb2l0aW5nIHRvd2FyZHMgdGhlXG4gICogW2ludmVyc2UgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfSBvZiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc3RhcnRQb2ludCgpYCBhbmQgYGxlbmd0aGBcbiAgKiBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAc2VlIFtgYW5nbGUuaW52ZXJzZWBde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LmludmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwb2ludGluZyB0b3dhcmRzIHRoZVxuICAqIFtwZXJwZW5kaWN1bGFyIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn0gb2ZcbiAgKiBgdGhpcy5hbmdsZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIHNhbWUgYHN0YXJ0UG9pbnQoKWAgYW5kIGBsZW5ndGhgXG4gICogYXMgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggaXRzIHN0YXJ0IHBvaW50IHNldCBhdFxuICAqIGBbdGhpcy5lbmRQb2ludCgpXXtAbGluayBSYWMuU2VnbWVudCNlbmRQb2ludH1gLFxuICAqIGFuZ2xlIHNldCB0byBgdGhpcy5hbmdsZSgpLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAsIGFuZFxuICAqIHNhbWUgbGVuZ3RoIGFzIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFtgYW5nbGUuaW52ZXJzZWBde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIGNvbnN0IGVuZCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBpbnZlcnNlUmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIGVuZCwgdGhpcy5yYXkuYW5nbGUuaW52ZXJzZSgpKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIGludmVyc2VSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgdG93YXJkcyBgYW5nbGVgIGJ5XG4gICogdGhlIGdpdmVuIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtb3ZlIHRoZSBzdGFydCBwb2ludFxuICAgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIGFsb25nIHRoZSBzZWdtZW50J3NcbiAgKiByYXkgYnkgdGhlIGdpdmVuIGBsZW5ndGhgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgbGVuZ3RoYCBpcyBuZWdhdGl2ZSwgYHN0YXJ0YCBpcyBtb3ZlZCBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2ZcbiAgKiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVRvTGVuZ3RoKGxlbmd0aCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2UobGVuZ3RoKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYFxuICAqIHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgdG8gYHRoaXMuYW5nbGUoKWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRvbi4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgdHJhbnNsYXRlUGVycGVuZGljdWxhcihkaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZ2l2ZW4gYHZhbHVlYCBjbGFtcGVkIHRvIFtzdGFydEluc2V0LCBsZW5ndGgtZW5kSW5zZXRdLlxuICAqXG4gICogV2hlbiBgc3RhcnRJbnNldGAgaXMgZ3JlYXRlciB0aGF0IGBsZW5ndGgtZW5kSW5zZXRgIHRoZSByYW5nZSBmb3IgdGhlXG4gICogY2xhbXAgYmVjb21lcyBpbXBvc2libGUgdG8gZnVsZmlsbC4gSW4gdGhpcyBjYXNlIHRoZSByZXR1cm5lZCB2YWx1ZVxuICAqIHdpbGwgYmUgdGhlIGNlbnRlcmVkIGJldHdlZW4gdGhlIHJhbmdlIGxpbWl0cyBhbmQgc3RpbGwgY2xhbXBsZWQgdG9cbiAgKiBgWzAsIGxlbmd0aF1gLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIC0gQSB2YWx1ZSB0byBjbGFtcFxuICAqIEBwYXJhbSB7TnVtYmVyfSBbc3RhcnRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZVxuICAqIGNsYW1waW5nIHJhbmdlXG4gICogQHBhcmFtIHtlbmRJbnNldH0gW2VuZEluc2V0PTBdIC0gVGhlIGluc2V0IGZvciB0aGUgaGlnaGVyIGxpbWl0IG9mIHRoZVxuICAqIGNsYW1waW5nIHJhbmdlXG4gICogQHJldHVybnMge051bWJlcn1cbiAgKi9cbiAgY2xhbXBUb0xlbmd0aCh2YWx1ZSwgc3RhcnRJbnNldCA9IDAsIGVuZEluc2V0ID0gMCkge1xuICAgIGNvbnN0IGVuZExpbWl0ID0gdGhpcy5sZW5ndGggLSBlbmRJbnNldDtcbiAgICBpZiAoc3RhcnRJbnNldCA+PSBlbmRMaW1pdCkge1xuICAgICAgLy8gaW1wb3NpYmxlIHJhbmdlLCByZXR1cm4gbWlkZGxlIHBvaW50XG4gICAgICBjb25zdCByYW5nZU1pZGRsZSA9IChzdGFydEluc2V0IC0gZW5kTGltaXQpIC8gMjtcbiAgICAgIGNvbnN0IG1pZGRsZSA9IHN0YXJ0SW5zZXQgLSByYW5nZU1pZGRsZTtcbiAgICAgIC8vIFN0aWxsIGNsYW1wIHRvIHRoZSBzZWdtZW50IGl0c2VsZlxuICAgICAgbGV0IGNsYW1wZWQgPSBtaWRkbGU7XG4gICAgICBjbGFtcGVkID0gTWF0aC5taW4oY2xhbXBlZCwgdGhpcy5sZW5ndGgpO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWF4KGNsYW1wZWQsIDApO1xuICAgICAgcmV0dXJuIGNsYW1wZWQ7XG4gICAgfVxuICAgIGxldCBjbGFtcGVkID0gdmFsdWU7XG4gICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCBzdGFydEluc2V0KTtcbiAgICByZXR1cm4gY2xhbXBlZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGluIHRoZSBzZWdtZW50J3MgcmF5IGF0IHRoZSBnaXZlbiBgbGVuZ3RoYCBmcm9tXG4gICogYHRoaXMuc3RhcnRQb2ludCgpYC4gV2hlbiBgbGVuZ3RoYCBpcyBuZWdhdGl2ZSwgdGhlIG5ldyBgUG9pbnRgIGlzXG4gICogY2FsY3VsYXRlZCBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRQb2ludCgpYFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAc2VlIFtgcmF5LnBvaW50QXREaXN0YW5jZWBde0BsaW5rIFJhYy5SYXkjcG9pbnRBdERpc3RhbmNlfVxuICAqL1xuICBwb2ludEF0TGVuZ3RoKGxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UobGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGluIHRoZSBzZWdtZW50J3MgcmF5IGF0IGEgZGlzdGFuY2Ugb2ZcbiAgKiBgdGhpcy5sZW5ndGggKiByYXRpb2AgZnJvbSBgdGhpcy5zdGFydFBvaW50KClgLiBXaGVuIGByYXRpb2AgaXNcbiAgKiBuZWdhdGl2ZSwgdGhlIG5ldyBgUG9pbnRgIGlzIGNhbGN1bGF0ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBzZWUgW2ByYXkucG9pbnRBdERpc3RhbmNlYF17QGxpbmsgUmFjLlJheSNwb2ludEF0RGlzdGFuY2V9XG4gICovXG4gIHBvaW50QXRMZW5ndGhSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGggKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCB0aGUgbWlkZGxlIHBvaW50IHRoZSBzZWdtZW50LlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRCaXNlY3RvcigpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgbmV3U3RhcnRQb2ludGAgYW5kIGVuZGluZyBhdFxuICAqIGB0aGlzLmVuZFBvaW50KClgLlxuICAqXG4gICogV2hlbiBgbmV3U3RhcnRQb2ludGAgYW5kIGB0aGlzLmVuZFBvaW50KClgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2VcbiAgKiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydFBvaW50IC0gVGhlIHN0YXJ0IHBvaW50IG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBtb3ZlU3RhcnRQb2ludChuZXdTdGFydFBvaW50KSB7XG4gICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0UG9pbnQuc2VnbWVudFRvUG9pbnQoZW5kUG9pbnQsIHRoaXMucmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgYXQgYHRoaXMuc3RhcnRQb2ludCgpYCBhbmQgZW5kaW5nIGF0XG4gICogYG5ld0VuZFBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRQb2ludCgpYCBhbmQgYG5ld0VuZFBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3RW5kUG9pbnQgLSBUaGUgZW5kIHBvaW50IG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqXG4gICogQHNlZSBbYHJhYy5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBtb3ZlRW5kUG9pbnQobmV3RW5kUG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuc2VnbWVudFRvUG9pbnQobmV3RW5kUG9pbnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzdGFydGluZyBwb2ludCB0byB0aGUgc2VnbWVudCdzIG1pZGRsZVxuICAqIHBvaW50LlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2Bwb2ludEF0QmlzZWN0b3JgXXtAbGluayBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3J9XG4gICovXG4gIHNlZ21lbnRUb0Jpc2VjdG9yKCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIHRoaXMubGVuZ3RoLzIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIHRoZSBzZWdtZW50J3MgbWlkZGxlIHBvaW50IHRvd2FyZHMgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYHBvaW50QXRCaXNlY3RvcmBde0BsaW5rIFJhYy5TZWdtZW50I3BvaW50QXRCaXNlY3Rvcn1cbiAgKiBAc2VlIFtgYW5nbGUucGVycGVuZGljdWxhcmBde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfVxuICAqL1xuICBzZWdtZW50QmlzZWN0b3IobGVuZ3RoID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5wb2ludEF0QmlzZWN0b3IoKTtcbiAgICBjb25zdCBuZXdBbmdsZSA9IHRoaXMucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aXRoIHRoZSBnaXZlblxuICAqIGBsZW5ndGhgIGFuZCB0aGUgc2FtZSBhbmdsZSBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50V2l0aExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgdXAgdG8gdGhlIGdpdmVuXG4gICogYG5leHRFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGBlbmRQb2ludCgpYCBhbmQgYG5leHRFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5leHRFbmRQb2ludCAtIFRoZSBlbmQgcG9pbnQgb2YgdGhlIG5leHQgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgW2ByYWMuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiAgKi9cbiAgbmV4dFNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydC5zZWdtZW50VG9Qb2ludChuZXh0RW5kUG9pbnQsIHRoaXMucmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgdG93YXJkcyBgYW5nbGVgXG4gICogd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAuXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEBwYXJhbSB7P051bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IGxlbmd0aDtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgdG93YXJkcyB0aGUgZ2l2ZW5cbiAgKiBgYW5nbGVEaXN0YW5jZWAgZnJvbSBgdGhpcy5hbmdsZSgpLmludmVyc2UoKWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIGBhbmdsZURpc3RhbmNlYCBpcyBhcHBsaWVkIHRvIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAqIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoIGFuIGBhbmdsZURpc3RhbmNlYCBvZiBgMGAgdGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGJlIGRpcmVjdGx5IG92ZXIgYW5kIHBvaW50aW5nIGluIHRoZSBpbnZlcnNlIGFuZ2xlIG9mXG4gICogYHRoaXNgLiBBcyB0aGUgYGFuZ2xlRGlzdGFuY2VgIGluY3JlYXNlcyB0aGUgdHdvIHNlZ21lbnRzIHNlcGFyYXRlIHdpdGhcbiAgKiB0aGUgcGl2b3QgYXQgYGVuZFBvaW50KClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8TnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gQW4gYW5nbGUgZGlzdGFuY2UgdG8gYXBwbHkgdG9cbiAgKiB0aGUgc2VnbWVudCdzIGFuZ2xlIGludmVyc2VcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIGFuZ2xlIHNoaWZ0XG4gICogZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IFtsZW5ndGg9bnVsbF0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgLCBvclxuICAqIGBudWxsYCB0byB1c2UgYHRoaXMubGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFtgYW5nbGUuaW52ZXJzZWBde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfVxuICAqL1xuICBuZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZShhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgYW5nbGVEaXN0YW5jZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGVEaXN0YW5jZSk7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsID8gdGhpcy5sZW5ndGggOiBsZW5ndGg7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHRoaXMubGVuZ3RoKVxuICAgICAgLmludmVyc2UoKVxuICAgICAgLndpdGhBbmdsZVNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGZyb20gYGVuZFBvaW50KClgIHRvd2FyZHMgdGhlXG4gICogYFtwZXJwZW5kaWN1bGFyIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1gIG9mXG4gICogYHRoaXMuYW5nbGUoKS5pbnZlcnNlKClgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGUgcGVycGVuZGljdWxhciBpcyBjYWxjdWxhdGVkIGZyb20gdGhlIGludmVyc2Ugb2YgdGhlXG4gICogc2VnbWVudCdzIGFuZ2xlLiBFLmcuIHdpdGggYGNsb2Nrd2lzZWAgYXMgYHRydWVgLCB0aGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgYmUgcG9pbnRpbmcgdG93YXJkcyBgdGhpcy5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoZmFsc2UpYC5cbiAgKlxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGZyb20gYGVuZFBvaW50KClgXG4gICogQHBhcmFtIHs/TnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYGFuZ2xlLnBlcnBlbmRpY3VsYXJgXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn1cbiAgKi9cbiAgbmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aGljaCBjb3JyZXNwb25kc1xuICAqIHRvIHRoZSBsZWcgb2YgYSByaWdodCB0cmlhbmdsZSB3aGVyZSBgdGhpc2AgaXMgdGhlIG90aGVyIGNhdGhldHVzIGFuZFxuICAqIHRoZSBoeXBvdGVudXNlIGlzIG9mIGxlbmd0aCBgaHlwb3RlbnVzZWAuXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIHBvaW50IHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgb2ZcbiAgKiBgW3RoaXMuYW5nbGUoKS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiBgaHlwb3RlbnVzZWAgaXMgc21hbGxlciB0aGF0IHRoZSBzZWdtZW50J3MgYGxlbmd0aGAsIHJldHVybnNcbiAgKiBgbnVsbGAgc2luY2Ugbm8gcmlnaHQgdHJpYW5nbGUgaXMgcG9zc2libGUuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gaHlwb3RlbnVzZSAtIFRoZSBsZW5ndGggb2YgdGhlIGh5cG90ZW51c2Ugc2lkZSBvZiB0aGVcbiAgKiByaWdodCB0cmlhbmdsZSBmb3JtZWQgd2l0aCBgdGhpc2AgYW5kIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHtCb29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBbYGFuZ2xlLmludmVyc2VgXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1cbiAgKi9cbiAgbmV4dFNlZ21lbnRMZWdXaXRoSHlwKGh5cG90ZW51c2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAoaHlwb3RlbnVzZSA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBjb3MgPSBhZHkgLyBoeXBcbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKHRoaXMubGVuZ3RoIC8gaHlwb3RlbnVzZSk7XG4gICAgLy8gdGFuID0gb3BzIC8gYWRqXG4gICAgLy8gdGFuICogYWRqID0gb3BzXG4gICAgY29uc3Qgb3BzID0gTWF0aC50YW4ocmFkaWFucykgKiB0aGlzLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlLCBvcHMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgZ2l2ZW4gYGVuZEFuZ2xlYFxuICAqIGFuZCBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgQXJjYCB3aWxsIHVzZSB0aGlzIHNlZ21lbnQncyBzdGFydCBhcyBgY2VudGVyYCwgaXRzIGFuZ2xlXG4gICogYXMgYHN0YXJ0YCwgYW5kIGl0cyBsZW5ndGggYXMgYHJhZGl1c2AuXG4gICpcbiAgKiBXaGVuIGBlbmRBbmdsZWAgaXMgb21taXRlZCBvciBgbnVsbGAsIHRoZSBzZWdtZW50J3MgYW5nbGUgaXMgdXNlZFxuICAqIGluc3RlYWQgcmVzdWx0aW5nIGluIGEgY29tcGxldGUtY2lyY2xlIGFyYy5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZX0gW2VuZEFuZ2xlPW51bGxdIC0gQW4gYEFuZ2xlYCB0byB1c2UgYXMgZW5kIGZvciB0aGVcbiAgKiBuZXcgYEFyY2AsIG9yIGBudWxsYCB0byB1c2UgYHRoaXMuYW5nbGUoKWBcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMoZW5kQW5nbGUgPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgZW5kQW5nbGUgPSBlbmRBbmdsZSA9PT0gbnVsbFxuICAgICAgPyB0aGlzLnJheS5hbmdsZVxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kQW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHRoaXMucmF5LmFuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgYmFzZWQgb24gdGhpcyBzZWdtZW50LCB3aXRoIHRoZSBhcmMncyBlbmQgYXRcbiAgKiBgYW5nbGVEaXN0YW5jZWAgZnJvbSB0aGUgc2VnbWVudCdzIGFuZ2xlIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBBcmNgIHdpbGwgdXNlIHRoaXMgc2VnbWVudCdzIHN0YXJ0IGFzIGBjZW50ZXJgLCBpdHMgYW5nbGVcbiAgKiBhcyBgc3RhcnRgLCBhbmQgaXRzIGxlbmd0aCBhcyBgcmFkaXVzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfE51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIHRoZVxuICAqIHNlZ21lbnQncyBzdGFydCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1dpdGhBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZURpc3RhbmNlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZURpc3RhbmNlKTtcbiAgICBjb25zdCBzdGFyZ0FuZ2xlID0gdGhpcy5yYXkuYW5nbGU7XG4gICAgY29uc3QgZW5kQW5nbGUgPSBzdGFyZ0FuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICBzdGFyZ0FuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IHVuY29tbWVudCBvbmNlIGJlemllcnMgYXJlIHRlc3RlZCBhZ2FpblxuICAvLyBiZXppZXJDZW50cmFsQW5jaG9yKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gIC8vICAgbGV0IGJpc2VjdG9yID0gdGhpcy5zZWdtZW50QmlzZWN0b3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gIC8vICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAvLyAgICAgdGhpcy5zdGFydCwgYmlzZWN0b3IuZW5kLFxuICAvLyAgICAgYmlzZWN0b3IuZW5kLCB0aGlzLmVuZCk7XG4gIC8vIH1cblxuXG59IC8vIFNlZ21lbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZ21lbnQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250YWlucyB0d28gYFtDb21wb3NpdGVde0BsaW5rIFJhYy5Db21wb3NpdGV9YCBvYmplY3RzOiBgb3V0bGluZWAgYW5kXG4qIGBjb250b3VyYC5cbipcbiogVXNlZCBieSBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YCB0byBkcmF3IHRoZSBjb21wb3NpdGVzIGFzIGFcbiogY29tcGxleCBzaGFwZSAoYG91dGxpbmVgKSB3aXRoIGFuIG5lZ2F0aXZlIHNwYWNlIHNoYXBlIGluc2lkZSAoYGNvbnRvdXJgKS5cbipcbiog4pqg77iPIFRoZSBBUEkgZm9yIFNoYXBlIGlzICoqcGxhbm5lZCB0byBjaGFuZ2UqKiBpbiBhIGZ1dHVyZSByZWxlYXNlLiDimqDvuI9cbipcbiogQGNsYXNzXG4qIEBhbGlhcyBSYWMuU2hhcGVcbiovXG5mdW5jdGlvbiBTaGFwZShyYWMpIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgdGhpcy5yYWMgPSByYWM7XG4gIHRoaXMub3V0bGluZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG4gIHRoaXMuY29udG91ciA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTtcblxuXG5TaGFwZS5wcm90b3R5cGUuYWRkT3V0bGluZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdGhpcy5vdXRsaW5lLmFkZChlbGVtZW50KTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5hZGRDb250b3VyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLmNvbnRvdXIuYWRkKGVsZW1lbnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERldGVybWluZXMgdGhlIGFsaWdubWVudCwgYW5nbGUsIGZvbnQsIGFuZCBzaXplIGZvciBkcmF3aW5nIGFcbiogW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IG9iamVjdC5cbipcbiogIyMjIGBpbnN0YW5jZS5UZXh0LkZvcm1hdGBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5UZXh0LkZvcm1hdGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0Rm9ybWF0fSB0byBjcmVhdGVcbiogYFRleHQuRm9ybWF0YCBvYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zXG4qIHJlYWR5LW1hZGUgY29udmVuaWVuY2Ugb2JqZWN0cywgbGlrZVxuKiBbYHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0YF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjdG9wTGVmdH0sIGxpc3RlZFxuKiB1bmRlciBbYGluc3RhbmNlLlRleHQuRm9ybWF0YF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXR9LlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIGxldCBhbmdsZSA9IHJhYy5BbmdsZSgxLzgpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBmb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYywgJ2xlZnQnLCAnYmFzZWxpbmUnLCBhbmdsZSlcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyRm9ybWF0ID0gcmFjLlRleHQuRm9ybWF0KCdsZWZ0JywgJ2Jhc2VsaW5lJywgMS84KVxuKlxuKiBAc2VlIFtgcmFjLlRleHQuRm9ybWF0YF17QGxpbmsgUmFjI1RleHRGb3JtYXR9XG4qIEBzZWUgW2BpbnN0YW5jZS5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fVxuKlxuKiBAYWxpYXMgUmFjLlRleHQuRm9ybWF0XG4qL1xuY2xhc3MgVGV4dEZvcm1hdCB7XG5cbiAgLyoqXG4gICogU3VwcG9ydGVkIHZhbHVlcyBmb3IgW2BoQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjaEFsaWdufSB3aGljaFxuICAqIGRlcm1pbmVzIHRoZSBsZWZ0LXRvLXJpZ2h0IGFsaWdubWVudCBvZiB0aGUgZHJhd24gYFRleHRgIGluIHJlbGF0aW9uXG4gICogdG8gaXRzIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsZWZ0XG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIHRvIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge1N0cmluZ30gY2VudGVyXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIHRvIHRoZSBjZW50ZXIsIGZyb20gc2lkZSB0b1xuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSByaWdodFxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCB0byB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqXG4gICogQHR5cGUge09iamVjdH1cbiAgKiBAbWVtYmVyb2YgUmFjLlRleHQuRm9ybWF0XG4gICovXG4gIHN0YXRpYyBob3Jpem9udGFsQWxpZ24gPSB7XG4gICAgbGVmdDogICBcImxlZnRcIixcbiAgICBjZW50ZXI6IFwiaG9yaXpvbnRhbENlbnRlclwiLFxuICAgIHJpZ2h0OiAgXCJyaWdodFwiXG4gIH07XG5cbiAgLyoqXG4gICogU3VwcG9ydGVkIHZhbHVlcyBmb3IgW2B2QWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQjdkFsaWdufSB3aGljaFxuICAqIGRlcm1pbmVzIHRoZSB0b3AtdG8tYm90dG9tIGFsaWdubWVudCBvZiB0aGUgZHJhd24gYFRleHRgIGluIHJlbGF0aW9uXG4gICogdG8gaXRzIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0b3BcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgdG8gdGhlIHRvcCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGNlbnRlclxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCB0byB0aGUgY2VudGVyLCBmcm9tIHRvcCB0byBib3R0b20sIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtTdHJpbmd9IGJhc2VsaW5lXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIHRvIHRoZSBiYXNlbGluZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBib3R0b21cbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgdG8gdGhlIGJvdHRvbSBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICpcbiAgKiBAdHlwZSB7T2JqZWN0fVxuICAqIEBtZW1iZXJvZiBSYWMuVGV4dC5Gb3JtYXRcbiAgKi9cbiAgc3RhdGljIHZlcnRpY2FsQWxpZ24gPSB7XG4gICAgdG9wOiAgICAgIFwidG9wXCIsXG4gICAgY2VudGVyOiAgIFwidmVydGljYWxDZW50ZXJcIixcbiAgICBiYXNlbGluZTogXCJiYXNlbGluZVwiLFxuICAgIGJvdHRvbTogICBcImJvdHRvbVwiXG4gIH07XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBUZXh0LkZvcm1hdGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjXG4gICogICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1N0cmluZ30gaEFsaWduXG4gICogICBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQsIGxlZnQtdG8tcmlnaHQ7IG9uZSBvZiB0aGUgdmFsdWVzIGZyb21cbiAgKiAgIFtgaG9yaXpvbnRhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbn1cbiAgKiBAcGFyYW0ge1N0cmluZ30gdkFsaWduXG4gICogICBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tOyBvbmUgb2YgdGhlIHZhbHVlcyBmcm9tXG4gICogICBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn1cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gW2FuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgYW5nbGUgdG93YXJkcyB3aGljaCB0aGUgdGV4dCBpcyBkcmF3blxuICAqIEBwYXJhbSB7U3RyaW5nfSBbZm9udD1udWxsXVxuICAqICAgVGhlIGZvbnQgbmFtZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbc2l6ZT1udWxsXVxuICAqICAgVGhlIGZvbnQgc2l6ZVxuICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICByYWMsXG4gICAgaEFsaWduLFxuICAgIHZBbGlnbixcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS56ZXJvLFxuICAgIGZvbnQgPSBudWxsLFxuICAgIHNpemUgPSBudWxsKVxuICB7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0U3RyaW5nKGhBbGlnbiwgdkFsaWduKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5BbmdsZSwgYW5nbGUpO1xuICAgIGZvbnQgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0U3RyaW5nKGZvbnQpO1xuICAgIHNpemUgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0TnVtYmVyKHNpemUpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBob3Jpem9udGFsIGFsaWdubWVudCwgbGVmdC10by1yaWdodCwgdG8gcG9zaXRpb24gYSBgVGV4dGBcbiAgICAqIHJlbGF0aXZlIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIFN1cHBvcnRlZCB2YWx1ZXMgYXJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZVxuICAgICogW2Bob3Jpem9udGFsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWdufSBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuaEFsaWduID0gaEFsaWduO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgdmVydGljYWwgYWxpZ25tZW50LCB0b3AtdG8tYm90dG9tLCB0byBwb3NpdGlvbiBhIGBUZXh0YCByZWxhdGl2ZVxuICAgICogdG8gaXRzIFtgcG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICAgKlxuICAgICogU3VwcG9ydGVkIHZhbHVlcyBhcmUgYXZhaWxhYmxlIHRocm91Z2ggdGhlXG4gICAgKiBbYHZlcnRpY2FsQWxpZ25gXXtAbGluayBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbn0gb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnZBbGlnbiA9IHZBbGlnbjtcblxuICAgIC8qKlxuICAgICogVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd24uXG4gICAgKlxuICAgICogQW4gYW5nbGUgb2YgW2B6ZXJvYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb30gd2lsIGRyYXcgdGhlIHRleHRcbiAgICAqIHRvd2FyZHMgdGhlIHJpZ2h0IG9mIHRoZSBzY3JlZW4uXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcblxuICAgIC8qKlxuICAgICogVGhlIGZvbnQgbmFtZSBvZiB0aGUgdGV4dCB0byBkcmF3LlxuICAgICpcbiAgICAqIFdoZW4gc2V0IHRvIGBudWxsYCB0aGUgZm9udCBkZWZpbmVkIGluXG4gICAgKiBbYHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuZm9udGBde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9IGlzXG4gICAgKiB1c2VkIGluc3RlYWQgdXBvbiBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHs/U3RyaW5nfVxuICAgICovXG4gICAgdGhpcy5mb250ID0gZm9udDtcblxuICAgIC8qKlxuICAgICogVGhlIGZvbnQgc2l6ZSBvZiB0aGUgdGV4dCB0byBkcmF3LlxuICAgICpcbiAgICAqIFdoZW4gc2V0IHRvIGBudWxsYCB0aGUgc2l6ZSBkZWZpbmVkIGluXG4gICAgKiBbYHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZWBde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9IGlzXG4gICAgKiB1c2VkIGluc3RlYWQgdXBvbiBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHs/TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIC8vIHJldHVybnM6ICdUZXh0LkZvcm1hdChoYTpsZWZ0IHZhOnRvcCBhOjAuNSBmOlwic2Fuc1wiIHM6MTQpJ1xuICAqIHJhYy5UZXh0LkZvcm1hdCgnbGVmdCcsICd0b3AnLCAwLjUsICdzYW5zJywgMTQpKS50b1N0cmluZygpXG4gICpcbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge1N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IGFuZ2xlU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuYW5nbGUudHVybiwgZGlnaXRzKTtcbiAgICBjb25zdCBzaXplU3RyID0gdGhpcy5zaXplID09PSBudWxsXG4gICAgICA/ICdudWxsJ1xuICAgICAgOiB1dGlscy5jdXREaWdpdHModGhpcy5zaXplLCBkaWdpdHMpO1xuICAgIGNvbnN0IGZvbnRTdHIgPSB0aGlzLmZvbnQgPT09IG51bGxcbiAgICAgID8gJ251bGwnXG4gICAgICA6IGBcIiR7dGhpcy5mb250fVwiYDtcbiAgICByZXR1cm4gYFRleHQuRm9ybWF0KGhhOiR7dGhpcy5oQWxpZ259IHZhOiR7dGhpcy52QWxpZ259IGE6JHthbmdsZVN0cn0gZjoke2ZvbnRTdHJ9IHM6JHtzaXplU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzLCBleGNlcHQgYHJhY2AsIG9mIGJvdGggZm9ybWF0cyBhcmVcbiAgKiBlcXVhbCwgb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyRm9ybWF0YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlRleHQuRm9ybWF0YCwgcmV0dXJuc1xuICAqIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5UZXh0LkZvcm1hdH0gb3RoZXJGb3JtYXQgLSBBIGBUZXh0LkZvcm1hdGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgW2BhbmdsZS5lcXVhbHNgXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJGb3JtYXQpIHtcbiAgICByZXR1cm4gb3RoZXJGb3JtYXQgaW5zdGFuY2VvZiBUZXh0Rm9ybWF0XG4gICAgICAmJiB0aGlzLmhBbGlnbiA9PT0gb3RoZXJGb3JtYXQuaEFsaWduXG4gICAgICAmJiB0aGlzLnZBbGlnbiA9PT0gb3RoZXJGb3JtYXQudkFsaWduXG4gICAgICAmJiB0aGlzLmZvbnQgICA9PT0gb3RoZXJGb3JtYXQuZm9udFxuICAgICAgJiYgdGhpcy5zaXplICAgPT09IG90aGVyRm9ybWF0LnNpemVcbiAgICAgICYmIHRoaXMuYW5nbGUuZXF1YWxzKG90aGVyRm9ybWF0LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggYGFuZ2xlYCBzZXQgdG8gdGhlIGBBbmdsZWAgZGVyaXZlZFxuICAqIGZyb20gYG5ld0FuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgbmV3QW5nbGUsXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICB0aGlzLnNpemUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgd2l0aCBgZm9udGAgc2V0IHRvIGBuZXdGb250YC5cbiAgKiBAcGFyYW0gez9TdHJpbmd9IG5ld0ZvbnQgLSBUaGUgZm9udCBuYW1lIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGA7XG4gICogICBjYW4gYmUgc2V0IHRvIGBudWxsYC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoRm9udChuZXdGb250KSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgdGhpcy5hbmdsZSxcbiAgICAgIG5ld0ZvbnQsXG4gICAgICB0aGlzLnNpemUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgd2l0aCBgc2l6ZWAgc2V0IHRvIGBuZXdTaXplYC5cbiAgKiBAcGFyYW0gez9OdW1iZXJ9IG5ld1NpemUgLSBUaGUgZm9udCBzaXplIGZvciB0aGUgbmV3IGBUZXh0LkZvcm1hdGA7XG4gICogICBjYW4gYmUgc2V0IHRvIGBudWxsYC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICB3aXRoU2l6ZShuZXdTaXplKSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0Rm9ybWF0KHRoaXMucmFjLFxuICAgICAgdGhpcy5oQWxpZ24sIHRoaXMudkFsaWduLFxuICAgICAgdGhpcy5hbmdsZSxcbiAgICAgIHRoaXMuZm9udCxcbiAgICAgIG5ld1NpemUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0LkZvcm1hdGAgdGhhdCB3aWxsIGRyYXcgYSB0ZXh0IHJldmVyc2VkLCB1cHNpZGUtZG93bixcbiAgKiBpbiBnZW5lcmFsbHkgdGhlIHNhbWUgcG9zaXRpb24gYXMgYHRoaXNgIHdvdWxkIGRyYXcgdGhlIHNhbWUgdGV4dC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHQuRm9ybWF0fVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIGxldCBoRW51bSA9IFRleHRGb3JtYXQuaG9yaXpvbnRhbEFsaWduO1xuICAgIGxldCB2RW51bSA9IFRleHRGb3JtYXQudmVydGljYWxBbGlnbjtcbiAgICBsZXQgaEFsaWduLCB2QWxpZ247XG4gICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgY2FzZSBoRW51bS5sZWZ0OiAgaEFsaWduID0gaEVudW0ucmlnaHQ7IGJyZWFrO1xuICAgICAgY2FzZSBoRW51bS5yaWdodDogaEFsaWduID0gaEVudW0ubGVmdDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAgICAgICAgICBoQWxpZ24gPSB0aGlzLmhBbGlnbjsgYnJlYWs7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy52QWxpZ24pIHtcbiAgICAgIGNhc2UgdkVudW0udG9wOiAgICB2QWxpZ24gPSB2RW51bS5ib3R0b207IGJyZWFrO1xuICAgICAgY2FzZSB2RW51bS5ib3R0b206IHZBbGlnbiA9IHZFbnVtLnRvcDsgYnJlYWs7XG4gICAgICBkZWZhdWx0OiAgICAgICAgICAgdkFsaWduID0gdGhpcy52QWxpZ247IGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdChcbiAgICAgIHRoaXMucmFjLFxuICAgICAgaEFsaWduLCB2QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLmludmVyc2UoKSxcbiAgICAgIHRoaXMuZm9udCxcbiAgICAgIHRoaXMuc2l6ZSlcbiAgfVxuXG59IC8vIGNsYXNzIFRleHRGb3JtYXRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGb3JtYXQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbmNvbnN0IFRleHRGb3JtYXQgPSByZXF1aXJlKCcuL1RleHQuRm9ybWF0JylcblxuLy8gTm90IHVzZWQsIFNlZW1zIGxpa2UgdWdsaWZ5IG1pbmlmaWNhdGlvbiBuZWVkcyBhIHJlZmVyZW5jZSBoZXJlO1xuLy8gb3RoZXJ3aXNlIFRleHRGb3JtYXQgaXMgbm90IGNvcnJlY3RseSByZXF1aXJlZC5cbnZhciBtaW5pZnlIZWxwZXIgPSBUZXh0Rm9ybWF0XG5cbi8qKlxuKiBTdHJpbmcsIHBvc2l0aW9uIGFuZCBbZm9ybWF0XXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9IHRvIGRyYXcgYSB0ZXh0LlxuKlxuKiBBbiBpbnN0YW5jZSBvZiB0aGlzIG9iamVjdCBjb250YWlucyB0aGUgc3RyaW5nIGFuZCBhIGBQb2ludGAgdXNlZCB0b1xuKiBkZXRlcm1pbmUgdGhlIGxvY2F0aW9uIG9mIHRoZSBkcmF3biB0ZXh0LiBUaGVcbiogW2BUZXh0LkZvcm1hdGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdH0gb2JqZWN0IGRldGVybWluZXMgdGhlIGZvbnQsIHNpemUsXG4qIG9yaWVudGF0aW9uIGFuZ2xlLCBhbmQgdGhlIGFsaWdubWVudCByZWxhdGl2ZSB0b1xuKiBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IHRvIGRyYXcgdGhlIHRleHQuXG4qXG4qICMjIyBgaW5zdGFuY2UuVGV4dGBcbipcbiogSW5zdGFuY2VzIG9mIGBSYWNgIGNvbnRhaW4gYSBjb252ZW5pZW5jZVxuKiBbYHJhYy5UZXh0YCBmdW5jdGlvbl17QGxpbmsgUmFjI1RleHR9IHRvIGNyZWF0ZSBgVGV4dGAgb2JqZWN0cyB3aXRoIGZld2VyXG4qIHBhcmFtZXRlcnMuIFRoaXMgZnVuY3Rpb24gYWxzbyBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMsIGxpa2UgW2ByYWMuVGV4dC5oZWxsb2Bde0BsaW5rIGluc3RhbmNlLlRleHQjaGVsbG99LCBsaXN0ZWQgdW5kZXJcbiogW2BpbnN0YW5jZS5UZXh0YF17QGxpbmsgaW5zdGFuY2UuVGV4dH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IHBvaW50ID0gcmFjLlBvaW50KDU1LCA3NylcbiogbGV0IGZvcm1hdCA9IHJhYy5UZXh0LkZvcm1hdCgnbGVmdCcsICdiYXNlbGluZScpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCB0ZXh0ID0gbmV3IFJhYy5UZXh0KHJhYywgcG9pbnQsICdibGFjayBxdWFydHonLCBmb3JtYXQpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclRleHQgPSByYWMuVGV4dCg1NSwgNzcsICdibGFjayBxdWFydHonLCBmb3JtYXQpXG4qXG4qIEBzZWUgW2ByYWMuVGV4dGBde0BsaW5rIFJhYyNUZXh0fVxuKiBAc2VlIFtgaW5zdGFuY2UuVGV4dGBde0BsaW5rIGluc3RhbmNlLlRleHR9XG4qXG4qIEBhbGlhcyBSYWMuVGV4dFxuKi9cbmNsYXNzIFRleHQge1xuXG4gIHN0YXRpYyBGb3JtYXQgPSBUZXh0Rm9ybWF0O1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFRleHRgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhY1xuICAqICAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50XG4gICogICBUaGUgbG9jYXRpb24gZm9yIHRoZSBkcmF3biB0ZXh0XG4gICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZ1xuICAqICAgVGhlIHN0cmluZyB0byBkcmF3XG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IGZvcm1hdFxuICAqICAgVGhlIGZvcm1hdCBmb3IgdGhlIGRyYXduIHRleHRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBwb2ludCwgc3RyaW5nLCBmb3JtYXQpIHtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYywgcmFjKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgcG9pbnQpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhzdHJpbmcpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoVGV4dC5Gb3JtYXQsIGZvcm1hdCk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSB0ZXh0IHdpbGwgYmUgZHJhd24uXG4gICAgKlxuICAgICogVGhlIHRleHQgd2lsbCBiZSBkcmF3biByZWxhdGl2ZSB0byB0aGlzIHBvaW50IGJhc2VkIG9uIHRoZVxuICAgICogYWxpZ25tZW50IGFuZCBhbmdsZSBjb25maWd1cmF0aW9uIG9mXG4gICAgKiBbYGZvcm1hdGBde0BsaW5rIFJhYy5UZXh0I2Zvcm1hdH0uXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5Qb2ludH1cbiAgICAqL1xuICAgIHRoaXMucG9pbnQgPSBwb2ludDtcblxuICAgIC8qKlxuICAgICogVGhlIHN0cmluZyB0byBkcmF3LlxuICAgICogQHR5cGUge1N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYWxpZ25tZW50LCBhbmdsZSwgZm9udCwgYW5kIHNpemUgdG8gdXNlIHRvIGRyYXcgdGhlIHRleHQuXG4gICAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAgICovXG4gICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAvLyByZXR1cm5zICdUZXh0KCg1NSw3NykgXCJzcGhpbnggb2YgYmxhY2sgcXVhcnR6XCIpJ1xuICAqIHJhYy5UZXh0KDU1LCA3NywgJ3NwaGlueCBvZiBibGFjayBxdWFydHonKS50b1N0cmluZygpXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucG9pbnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucG9pbnQueSwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFRleHQoKCR7eFN0cn0sJHt5U3RyfSkgXCIke3RoaXMuc3RyaW5nfVwiKWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGBzdHJpbmdgIGFuZCBgcG9pbnRgIG9mIGJvdGggdGV4dHMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclRleHRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuVGV4dGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIGBwb2ludGBzIGFyZSBjb21wYXJlZCB1c2luZyBbYHBvaW50LmVxdWFsc2Bde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LlxuICAqXG4gICogVGhlIGBmb3JtYXRgIG9iamVjdHMgYXJlIGlnbm9yZWQgaW4gdGhpcyBjb21wYXJpc29uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuVGV4dH0gb3RoZXJUZXh0IC0gQSBgVGV4dGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAqIEBzZWUgW2Bwb2ludC5lcXVhbHNgXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfVxuICAqL1xuICBlcXVhbHMob3RoZXJUZXh0KSB7XG4gICAgcmV0dXJuIG90aGVyVGV4dCBpbnN0YW5jZW9mIFRleHRcbiAgICAgICYmIHRoaXMuc3RyaW5nID09PSBvdGhlclRleHQuc3RyaW5nXG4gICAgICAmJiB0aGlzLnBvaW50LmVxdWFscyhvdGhlclRleHQucG9pbnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgd2l0aCBgZm9ybWF0LmFuZ2xlYCBzZXQgdG8gdGhlXG4gICogYEFuZ2xlYCBkZXJpdmVkIGZyb20gYG5ld0FuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxOdW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBUZXh0YCBhbmRcbiAgKiAgIGBUZXh0LkZvcm1hdGBcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIGNvbnN0IG5ld0Zvcm1hdCA9IHRoaXMuZm9ybWF0LndpdGhBbmdsZShuZXdBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggYGZvcm1hdC5mb250YCBzZXQgdG8gYG5ld0ZvbnRgLlxuICAqIEBwYXJhbSB7P1N0cmluZ30gbmV3Rm9udCAtIFRoZSBmb250IG5hbWUgZm9yIHRoZSBuZXcgYFRleHRgIGFuZFxuICAqICAgYFRleHQuRm9ybWF0YDsgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB3aXRoRm9udChuZXdGb250KSB7XG4gICAgY29uc3QgbmV3Rm9ybWF0ID0gdGhpcy5mb3JtYXQud2l0aEZvbnQobmV3Rm9udCk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgYW5kIGBGb3JtYXRgIHdpdGggYGZvcm1hdC5zaXplYCBzZXQgdG8gYG5ld1NpemVgLlxuICAqIEBwYXJhbSB7P051bWJlcn0gbmV3U2l6ZSAtIFRoZSBmb250IHNpemUgZm9yIHRoZSBuZXcgYFRleHRgIGFuZFxuICAqICAgYFRleHQuRm9ybWF0YDsgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB3aXRoU2l6ZShuZXdTaXplKSB7XG4gICAgY29uc3QgbmV3Rm9ybWF0ID0gdGhpcy5mb3JtYXQud2l0aFNpemUobmV3U2l6ZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbn0gLy8gY2xhc3MgVGV4dFxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5BbmdsZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNBbmdsZX0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgQW5nbGVgXXtAbGluayBSYWMuQW5nbGV9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuQW5nbGUucXVhcnRlciAvLyByZWFkeS1tYWRlIHF1YXJ0ZXIgYW5nbGVcbiogcmFjLkFuZ2xlLnF1YXJ0ZXIucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkFuZ2xlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBbmdsZShyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogQ2FsbHNge0BsaW5rIFJhYy5BbmdsZS5mcm9tfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbVxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ8UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhbiBgQW5nbGVgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tID0gZnVuY3Rpb24oc29tZXRoaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tKHJhYywgc29tZXRoaW5nKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHJhZGlhbnNgLlxuICAqXG4gICogQ2FsbHMgYHtAbGluayBSYWMuQW5nbGUuZnJvbVJhZGlhbnN9YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tUmFkaWFuc1xuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhbnMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIHJhZGlhbnNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21SYWRpYW5zXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZnJvbVJhZGlhbnMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgZGVncmVlc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tRGVncmVlc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21EZWdyZWVzXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlcyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gZGVncmVlc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbURlZ3JlZXNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tRGVncmVlcyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21EZWdyZWVzKHJhYywgZGVncmVlcyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgcmlnaHRgLCBgcmAsIGBlYXN0YCwgYGVgLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuemVybyA9IHJhYy5BbmdsZSgwLjApO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzJgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYGxlZnRgLCBgbGAsIGB3ZXN0YCwgYHdgLCBgaW52ZXJzZWAuXG4gICpcbiAgKiBAbmFtZSBoYWxmXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5oYWxmID0gcmFjLkFuZ2xlKDEvMik7XG4gIHJhYy5BbmdsZS5pbnZlcnNlID0gcmFjLkFuZ2xlLmhhbGY7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvNGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgZG93bmAsIGBkYCwgYGJvdHRvbWAsIGBiYCwgYHNvdXRoYCwgYHNgLCBgc3F1YXJlYC5cbiAgKlxuICAqIEBuYW1lIHF1YXJ0ZXJcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnF1YXJ0ZXIgPSByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLnNxdWFyZSA9ICByYWMuQW5nbGUucXVhcnRlcjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS84YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGBib3R0b21SaWdodGAsIGBicmAsIGBzZWAuXG4gICpcbiAgKiBAbmFtZSBlaWdodGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmVpZ2h0aCA9ICByYWMuQW5nbGUoMS84KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgNy84YCwgbmVnYXRpdmUgYW5nbGUgb2ZcbiAgKiBbYGVpZ2h0aGBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI2VpZ2h0aH0uXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgdG9wUmlnaHRgLCBgdHJgLCBgbmVgLlxuICAqXG4gICogQG5hbWUgbmVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubmVpZ2h0aCA9ICByYWMuQW5nbGUoLTEvOCk7XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8xNmAuXG4gICpcbiAgKiBAbmFtZSBzaXh0ZWVudGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnNpeHRlZW50aCA9IHJhYy5BbmdsZSgxLzE2KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMy80YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGB1cGAsIGB1YCwgYHRvcGAsIGB0YC5cbiAgKlxuICAqIEBuYW1lIG5vcnRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5ub3J0aCA9IHJhYy5BbmdsZSgzLzQpO1xuICByYWMuQW5nbGUuZWFzdCAgPSByYWMuQW5nbGUoMC80KTtcbiAgcmFjLkFuZ2xlLnNvdXRoID0gcmFjLkFuZ2xlKDEvNCk7XG4gIHJhYy5BbmdsZS53ZXN0ICA9IHJhYy5BbmdsZSgyLzQpO1xuXG4gIHJhYy5BbmdsZS5lID0gcmFjLkFuZ2xlLmVhc3Q7XG4gIHJhYy5BbmdsZS5zID0gcmFjLkFuZ2xlLnNvdXRoO1xuICByYWMuQW5nbGUudyA9IHJhYy5BbmdsZS53ZXN0O1xuICByYWMuQW5nbGUubiA9IHJhYy5BbmdsZS5ub3J0aDtcblxuICByYWMuQW5nbGUubmUgPSByYWMuQW5nbGUubi5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLnNlID0gcmFjLkFuZ2xlLmUuYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zdyA9IHJhYy5BbmdsZS5zLmFkZCgxLzgpO1xuICByYWMuQW5nbGUubncgPSByYWMuQW5nbGUudy5hZGQoMS84KTtcblxuICAvLyBOb3J0aCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5ubmUgPSByYWMuQW5nbGUubmUuYWRkKC0xLzE2KTtcbiAgLy8gRWFzdCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5lbmUgPSByYWMuQW5nbGUubmUuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydGgtZWFzdCBub3J0aFxuICByYWMuQW5nbGUubmVuID0gcmFjLkFuZ2xlLm5uZTtcbiAgLy8gTm9ydGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5uZWUgPSByYWMuQW5nbGUuZW5lO1xuXG4gIC8vIEVhc3Qgc291dGgtZWFzdFxuICByYWMuQW5nbGUuZXNlID0gcmFjLkFuZ2xlLnNlLmFkZCgtMS8xNik7XG4gIC8vIFNvdXRoIHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLnNzZSA9IHJhYy5BbmdsZS5zZS5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC1lYXN0IGVhc3RcbiAgcmFjLkFuZ2xlLnNlZSA9IHJhYy5BbmdsZS5lc2U7XG4gIC8vIFNvdXRoLWVhc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnNlcyA9IHJhYy5BbmdsZS5zc2U7XG5cbiAgLy8gU291dGggc291dGgtd2VzdFxuICByYWMuQW5nbGUuc3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgtMS8xNik7XG4gIC8vIFdlc3Qgc291dGgtd2VzdFxuICByYWMuQW5nbGUud3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgrMS8xNik7XG4gIC8vIFNvdXRoLXdlc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnN3cyA9IHJhYy5BbmdsZS5zc3c7XG4gIC8vIFNvdXRoLXdlc3Qgd2VzdFxuICByYWMuQW5nbGUuc3d3ID0gcmFjLkFuZ2xlLndzdztcblxuICAvLyBXZXN0IG5vcnRoLXdlc3RcbiAgcmFjLkFuZ2xlLndudyA9IHJhYy5BbmdsZS5udy5hZGQoLTEvMTYpO1xuICAvLyBOb3J0aCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS5ubncgPSByYWMuQW5nbGUubncuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydC1od2VzdCB3ZXN0XG4gIHJhYy5BbmdsZS5ud3cgPSByYWMuQW5nbGUud253O1xuICAvLyBOb3J0aC13ZXN0IG5vcnRoXG4gIHJhYy5BbmdsZS5ud24gPSByYWMuQW5nbGUubm53O1xuXG4gIHJhYy5BbmdsZS5yaWdodCA9IHJhYy5BbmdsZS5lO1xuICByYWMuQW5nbGUuZG93biAgPSByYWMuQW5nbGUucztcbiAgcmFjLkFuZ2xlLmxlZnQgID0gcmFjLkFuZ2xlLnc7XG4gIHJhYy5BbmdsZS51cCAgICA9IHJhYy5BbmdsZS5uO1xuXG4gIHJhYy5BbmdsZS5yID0gcmFjLkFuZ2xlLnJpZ2h0O1xuICByYWMuQW5nbGUuZCA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUubCA9IHJhYy5BbmdsZS5sZWZ0O1xuICByYWMuQW5nbGUudSA9IHJhYy5BbmdsZS51cDtcblxuICByYWMuQW5nbGUudG9wICAgID0gcmFjLkFuZ2xlLnVwO1xuICByYWMuQW5nbGUuYm90dG9tID0gcmFjLkFuZ2xlLmRvd247XG4gIHJhYy5BbmdsZS50ICAgICAgPSByYWMuQW5nbGUudG9wO1xuICByYWMuQW5nbGUuYiAgICAgID0gcmFjLkFuZ2xlLmJvdHRvbTtcblxuICByYWMuQW5nbGUudG9wUmlnaHQgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50ciAgICAgICAgICA9IHJhYy5BbmdsZS5uZTtcbiAgcmFjLkFuZ2xlLnRvcExlZnQgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUudGwgICAgICAgICAgPSByYWMuQW5nbGUubnc7XG4gIHJhYy5BbmdsZS5ib3R0b21SaWdodCA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJyICAgICAgICAgID0gcmFjLkFuZ2xlLnNlO1xuICByYWMuQW5nbGUuYm90dG9tTGVmdCAgPSByYWMuQW5nbGUuc3c7XG4gIHJhYy5BbmdsZS5ibCAgICAgICAgICA9IHJhYy5BbmdsZS5zdztcblxufSAvLyBhdHRhY2hSYWNBbmdsZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLkFyY2AgZnVuY3Rpb25de0BsaW5rIFJhYyNBcmN9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYEFyY2Agb2JqZWN0c117QGxpbmsgUmFjLkFyY30gZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuQXJjLnplcm8gLy8gcmVhZHktbWFkZSB6ZXJvIGFyY1xuKiByYWMuQXJjLnplcm8ucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkFyY1xuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQXJjKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgY2xvY2t3aXNlIGBBcmNgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLkFyY31cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQXJjI1xuICAqL1xuICByYWMuQXJjLnplcm8gPSByYWMuQXJjKDAsIDAsIDAsIDAsIDAsIHRydWUpO1xuXG59IC8vIGF0dGFjaFJhY0FyY1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQmV6aWVyYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5CZXppZXJ9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5CZXppZXJcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaEluc3RhbmNlQmV6aWVyKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYEJlemllcmAgd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQmV6aWVyfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5CZXppZXIjXG4gICovXG4gIHJhYy5CZXppZXIuemVybyA9IHJhYy5CZXppZXIoXG4gICAgMCwgMCwgMCwgMCxcbiAgICAwLCAwLCAwLCAwKTtcblxufSAvLyBhdHRhY2hJbnN0YW5jZUJlemllclxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlBvaW50YCBmdW5jdGlvbl17QGxpbmsgUmFjI1BvaW50fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BQb2ludGBde0BsaW5rIFJhYy5Qb2ludH0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5Qb2ludC5vcmlnaW4gLy8gcmVhZHktbWFkZSBvcmlnaW4gcG9pbnRcbiogcmFjLlBvaW50Lm9yaWdpbi5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUG9pbnRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1BvaW50KHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYFBvaW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUG9pbnQjXG4gICovXG4gIHJhYy5Qb2ludC56ZXJvID0gcmFjLlBvaW50KDAsIDApO1xuXG4gIC8qKlxuICAqIEEgYFBvaW50YCBhdCBgKDAsIDApYC5cbiAgKlxuICAqIEVxdWFsIHRvIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfS5cbiAgKlxuICAqIEBuYW1lIG9yaWdpblxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQub3JpZ2luID0gcmFjLlBvaW50Lnplcm87XG5cblxufSAvLyBhdHRhY2hSYWNQb2ludFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlJheWAgZnVuY3Rpb25de0BsaW5rIFJhYyNSYXl9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYFJheWBde0BsaW5rIFJhYy5SYXl9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuUmF5LnhBeGlzIC8vIHJlYWR5LW1hZGUgeC1heGlzIHJheVxuKiByYWMuUmF5LnhBeGlzLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5SYXlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1JheShyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBSYXlgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVybywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQuemVyb2Bde0BsaW5rIGluc3RhbmNlLlBvaW50I3plcm99IGFuZCBwb2ludHMgdG9cbiAgKiBbYHJhYy5BbmdsZS56ZXJvYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb30uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKi9cbiAgcmFjLlJheS56ZXJvID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUuemVybyk7XG5cblxuICAvKipcbiAgKiBBIGBSYXlgIG92ZXIgdGhlIHgtYXhpcywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQub3JpZ2luYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjb3JpZ2lufSBhbmQgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUuemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99LlxuICAqXG4gICogRXF1YWwgdG8gW2ByYWMuUmF5Lnplcm9gXXtAbGluayBpbnN0YW5jZS5SYXkjemVyb30uXG4gICpcbiAgKiBAbmFtZSB4QXhpc1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICovXG4gIHJhYy5SYXkueEF4aXMgPSByYWMuUmF5Lnplcm87XG5cblxuICAvKipcbiAgKiBBIGBSYXlgIG92ZXIgdGhlIHktYXhpcywgc3RhcnRzIGF0XG4gICogW2ByYWMuUG9pbnQub3JpZ2luYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjb3JpZ2lufSBhbmQgcG9pbnRzIHRvXG4gICogW2ByYWMuQW5nbGUucXVhcnRlcmBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9LlxuICAqXG4gICogQG5hbWUgeUF4aXNcbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqL1xuICByYWMuUmF5LnlBeGlzID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUucXVhcnRlcik7XG5cbn0gLy8gYXR0YWNoUmFjUmF5XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuU2VnbWVudGAgZnVuY3Rpb25de0BsaW5rIFJhYyNTZWdtZW50fS5cbipcbiogVGhlIGZ1bmN0aW9uIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2VcbiogW2BTZWdtZW50YF17QGxpbmsgUmFjLlNlZ21lbnR9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGhcbiogdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuU2VnbWVudC56ZXJvIC8vIHJlYWR5LW1hZGUgemVybyBzZWdtZW50XG4qIHJhYy5TZWdtZW50Lnplcm8ucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlNlZ21lbnRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1NlZ21lbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgU2VnbWVudGAgd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLCBzdGFydHMgYXRcbiAgKiBbYHJhYy5Qb2ludC56ZXJvYF17QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb30sIHBvaW50cyB0b1xuICAqIFtgcmFjLkFuZ2xlLnplcm9gXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfSwgYW5kIGhhcyBhIGxlbmd0aCBvZlxuICAqIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC56ZXJvID0gcmFjLlNlZ21lbnQoMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoUmFjU2VnbWVudFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIE1lbWJlcnMgYW5kIG1ldGhvZHMgYXR0YWNoZWQgdG8gdGhlXG4qIFtgcmFjLlRleHRgIGZ1bmN0aW9uXXtAbGluayBSYWMjVGV4dH0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgVGV4dGBde0BsaW5rIFJhYy5UZXh0fSBvYmplY3RzIGZvciB1c3VhbCB2YWx1ZXMsIGFsbCBzZXR1cCB3aXRoIHRoZVxuKiBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogcmFjLlRleHQuaGVsbG8gLy8gcmVhZHktbWFkZSBoZWxsby13b3JsZCB0ZXh0XG4qIHJhYy5UZXh0LmhlbGxvLnJhYyA9PT0gcmFjIC8vIHRydWVcbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5UZXh0XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNUZXh0KHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG5cbiAgLyoqXG4gICogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiAgKiBbYHJhYy5UZXh0LkZvcm1hdGAgZnVuY3Rpb25de0BsaW5rIFJhYyNUZXh0Rm9ybWF0fS5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4gICogW2BUZXh0LkZvcm1hdGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdH0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGxcbiAgKiBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4gICpcbiAgKiBAZXhhbXBsZVxuICAqIGxldCByYWMgPSBuZXcgUmFjKClcbiAgKiByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCAvLyByZWFkeS1tYWRlIHRvcC1sZWZ0IHRleHQgZm9ybWF0XG4gICogcmFjLlRleHQuRm9ybWF0LnRvcExlZnQucmFjID09PSByYWMgLy8gdHJ1ZVxuICAqXG4gICogQG5hbWVzcGFjZSBpbnN0YW5jZS5UZXh0LkZvcm1hdFxuICAqL1xuXG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gYXQgdGhlXG4gICogdG9wLWxlZnQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKiBAbmFtZSB0b3BMZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3ApO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IGF0IHRoZVxuICAqIHRvcC1yaWdodCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqIEBuYW1lIHRvcFJpZ2h0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC50b3BSaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCk7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gYXQgdGhlXG4gICogY2VudGVyLWxlZnQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKiBAbmFtZSBjZW50ZXJMZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJMZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIpO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBwb3NpdGlvbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IGF0IHRoZVxuICAqIGNlbnRlciBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKlxuICAqIEFsc28gYXZhaWxhYmxlIGFzOiBgY2VudGVyZWRgLlxuICAqXG4gICogQG5hbWUgY2VudGVyQ2VudGVyXG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJDZW50ZXIgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5jZW50ZXIsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcbiAgcmFjLlRleHQuRm9ybWF0LmNlbnRlcmVkID0gcmFjLlRleHQuRm9ybWF0LmNlbnRlckNlbnRlcjtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSBhdCB0aGVcbiAgKiBjZW50ZXItcmlnaHQgb2YgdGhlIGRyYXduIHRleHQuXG4gICogQG5hbWUgY2VudGVyUmlnaHRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmNlbnRlclJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSBhdCB0aGVcbiAgKiBib3R0b20tbGVmdCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKiBAbmFtZSBib3R0b21MZWZ0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5ib3R0b21MZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20pO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IGF0IHRoZVxuICAqIGJvdHRvbS1yaWdodCBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKiBAbmFtZSBib3R0b21SaWdodFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYm90dG9tUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20pO1xuXG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgYGhlbGxvIHdvcmxkYCB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXRcbiAgKiBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgaGVsbG9cbiAgKiBAdHlwZSB7UmFjLlRleHR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LmhlbGxvID0gcmFjLlRleHQoMCwgMCwgJ2hlbGxvIHdvcmxkIScpO1xuXG4gIC8qKlxuICAqIEEgYFRleHRgIGZvciBkcmF3aW5nIHRoZSBwYW5ncmFtIGBzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3dgXG4gICogd2l0aCBgdG9wTGVmdGAgZm9ybWF0IGF0IGBQb2ludC56ZXJvYC5cbiAgKiBAbmFtZSBzcGhpbnhcbiAgKiBAdHlwZSB7UmFjLlRleHR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LnNwaGlueCA9IHJhYy5UZXh0KDAsIDAsICdzcGhpbnggb2YgYmxhY2sgcXVhcnR6LCBqdWRnZSBteSB2b3cnKTtcblxufSAvLyBhdHRhY2hSYWNUZXh0XG5cbiIsIlxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3RlbXBsYXRlcy9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbWRqcy9hbWRqcy1hcGkvYmxvYi9tYXN0ZXIvQU1ELm1kXG4gICAgLy8gaHR0cHM6Ly9yZXF1aXJlanMub3JnL2RvY3Mvd2h5YW1kLmh0bWxcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIEFNRCAtIGRlZmluZToke3R5cGVvZiBkZWZpbmV9YCk7XG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG5cbiAgICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgZm9yIE5vZGUgLSBtb2R1bGU6JHt0eXBlb2YgbW9kdWxlfWApO1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG5cbiAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGludG8gc2VsZiAtIHJvb3Q6JHt0eXBlb2Ygcm9vdH1gKTtcbiAgcm9vdC5SYWMgPSBmYWN0b3J5KCk7XG5cbn0odHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICByZXR1cm4gcmVxdWlyZSgnLi9SYWMnKTtcblxufSkpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRHJhd2VyIHRoYXQgdXNlcyBhIFtQNV0oaHR0cHM6Ly9wNWpzLm9yZy8pIGluc3RhbmNlIGZvciBhbGwgZHJhd2luZ1xuKiBvcGVyYXRpb25zLlxuKlxuKiBAYWxpYXMgUmFjLlA1RHJhd2VyXG4qL1xuY2xhc3MgUDVEcmF3ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgcDUpe1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMucDUgPSBwNTtcbiAgICB0aGlzLmRyYXdSb3V0aW5lcyA9IFtdO1xuICAgIHRoaXMuZGVidWdSb3V0aW5lcyA9IFtdO1xuICAgIHRoaXMuYXBwbHlSb3V0aW5lcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB1c2VkIGZvciBkZWJ1ZyBkcmF3aW5nLCB3aGVuIGBudWxsYCB0aGUgc3R5bGUgYWxyZWFkeSBhcHBsaWVkXG4gICAgKiBpcyB1c2VkLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRlYnVnU3R5bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB1c2VkIGZvciB0ZXh0IGZvciBkZWJ1ZyBkcmF3aW5nLCB3aGVuIGBudWxsYCB0aGUgc3R5bGUgYWxyZWFkeVxuICAgICogYXBwbGllZCBpcyB1c2VkLlxuICAgICpcbiAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmRlYnVnVGV4dFN0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU2V0dGluZ3MgdXNlZCBieSB0aGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiBgZHJhd2FibGUuZGVidWcoKWAuXG4gICAgKlxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZvbnQ9J21vbm9zcGFjZSdcbiAgICAqICAgRm9udCB0byB1c2Ugd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gW2ZvbnQ9W3JhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZV17QGxpbmsgUmFjI3RleHRGb3JtYXREZWZhdWx0c31dXG4gICAgKiAgIEZvbnQgc2l6ZSB0byB1c2Ugd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKiBAcHJvcGVydHkge051bWJlcn0gZml4ZWREaWdpdHM9MlxuICAgICogICBOdW1iZXIgb2YgZGVjaW1hbCBkaWdpdHMgdG8gcHJpbnQgd2hlbiBkcmF3aW5nIHdpdGggYGRlYnVnKClgXG4gICAgKlxuICAgICogQHR5cGUge09iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdUZXh0T3B0aW9ucyA9IHtcbiAgICAgIGZvbnQ6ICdtb25vc3BhY2UnLFxuICAgICAgLy8gVE9ETzogZG9jdW1lbnRhdGlvbiBkaXNwbGF5cyB0aGlzIGFzIGJlaW5nIG9wdGlvbmFsXG4gICAgICAvLyBpbiBvcmRlciB0byBtYWtlIHRoZSBsaW5rIHdvcmsgaXQgaGFzIHRvIGJlIHdyYXBwZWQgaW4gW10sXG4gICAgICAvLyB3aGljaCBtYWtlcyBpdCBhbiBvcHRpb25hbFxuICAgICAgc2l6ZTogcmFjLnRleHRGb3JtYXREZWZhdWx0cy5zaXplLFxuICAgICAgZml4ZWREaWdpdHM6IDJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgKiBSYWRpdXMgb2YgcG9pbnQgbWFya2VycyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAyMlxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1BvaW50UmFkaXVzID0gNDtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHRoZSBtYWluIHZpc3VhbCBlbGVtZW50cyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAyMlxuICAgICovXG4gICAgdGhpcy5kZWJ1Z01hcmtlclJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBGYWN0b3IgYXBwbGllZCB0byBzdHJva2Ugd2VpZ2h0IHNldHRpbmcuIFN0cm9rZSB3ZWlnaHQgaXMgc2V0IHRvXG4gICAgKiBgc3Ryb2tlLndlaWdodCAqIHN0cm9rZVdlaWdodEZhY3RvcmAgd2hlbiBhcHBsaWNhYmxlLlxuICAgICpcbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnN0cm9rZVdlaWdodEZhY3RvciA9IDE7XG5cbiAgICB0aGlzLnNldHVwQWxsRHJhd0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxBcHBseUZ1bmN0aW9ucygpO1xuICAgIC8vIFRPRE86IGFkZCBhIGN1c3RvbWl6ZWQgZnVuY3Rpb24gZm9yIG5ldyBjbGFzc2VzIVxuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIHRoZSBnaXZlbiBgZHJhd0Z1bmN0aW9uYCB0byBwZXJmb3JtIHRoZSBkcmF3aW5nIGZvciBpbnN0YW5jZXMgb2ZcbiAgKiBjbGFzcyBgZHJhd2FibGVDbGFzc2AuXG4gICpcbiAgKiBgZHJhd0Z1bmN0aW9uYCBpcyBleHBlY3RlZCB0byBoYXZlIHRoZSBzaWduYXR1cmU6XG4gICogYGBgXG4gICogZHJhd0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcylcbiAgKiBgYGBcbiAgKiArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAqICsgYG9iamVjdE9mQ2xhc3M6IGRyYXdhYmxlQ2xhc3NgIC0gSW5zdGFuY2Ugb2YgYGRyYXdhYmxlQ2xhc3NgIHRvIGRyYXdcbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyBvZiB0aGUgaW5zdGFuY2VzIHRvIGRyYXdcbiAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkcmF3RnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGRyYXdpbmdcbiAgKi9cbiAgc2V0RHJhd0Z1bmN0aW9uKGRyYXdhYmxlQ2xhc3MsIGRyYXdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gZHJhd2FibGVDbGFzcyk7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERyYXdSb3V0aW5lKGRyYXdhYmxlQ2xhc3MsIGRyYXdGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmRyYXdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhd1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIHNldERyYXdPcHRpb25zKGNsYXNzT2JqLCBvcHRpb25zKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlcXVpcmVzUHVzaFBvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9IG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wO1xuICAgIH1cbiAgfVxuXG5cbiAgc2V0Q2xhc3NEcmF3U3R5bGUoY2xhc3NPYmosIHN0eWxlKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIHJvdXRpbmUuc3R5bGUgPSBzdHlsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZ2l2ZW4gYGRlYnVnRnVuY3Rpb25gIHRvIHBlcmZvcm0gdGhlIGRlYnVnLWRyYXdpbmcgZm9yXG4gICogaW5zdGFuY2VzIG9mIGNsYXNzIGBkcmF3YWJsZUNsYXNzYC5cbiAgKlxuICAqIFdoZW4gYSBkcmF3YWJsZSBjbGFzcyBkb2VzIG5vdCBoYXZlIGEgYGRlYnVnRnVuY3Rpb25gIHNldHVwLCBjYWxsaW5nXG4gICogYGRyYXdhYmxlLmRlYnVnKClgIHNpbXBseSBjYWxscyBgZHJhdygpYCB3aXRoXG4gICogYFtkZWJ1Z1N0eWxlXXtAbGluayBSYWMuUDVEcmF3ZXIjZGVidWdTdHlsZX1gIGFwcGxpZWQuXG4gICpcbiAgKiBgZGVidWdGdW5jdGlvbmAgaXMgZXhwZWN0ZWQgdG8gaGF2ZSB0aGUgc2lnbmF0dXJlOlxuICAqIGBgYFxuICAqIGRlYnVnRnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzLCBkcmF3c1RleHQpXG4gICogYGBgXG4gICogKyBgZHJhd2VyOiBQNURyYXdlcmAgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmdcbiAgKiArIGBvYmplY3RPZkNsYXNzOiBkcmF3YWJsZUNsYXNzYCAtIEluc3RhbmNlIG9mIGBkcmF3YWJsZUNsYXNzYCB0byBkcmF3XG4gICogKyBgZHJhd3NUZXh0OiBib29sYCAtIFdoZW4gYHRydWVgIHRleHQgc2hvdWxkIGJlIGRyYXduIHdpdGhcbiAgKiAgICBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtjbGFzc30gZHJhd2FibGVDbGFzcyAtIENsYXNzIG9mIHRoZSBpbnN0YW5jZXMgdG8gZHJhd1xuICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlYnVnRnVuY3Rpb24gLSBGdW5jdGlvbiB0aGF0IHBlcmZvcm1zIGRlYnVnLWRyYXdpbmdcbiAgKi9cbiAgc2V0RGVidWdGdW5jdGlvbihkcmF3YWJsZUNsYXNzLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gZHJhd2FibGVDbGFzcyk7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERlYnVnUm91dGluZShkcmF3YWJsZUNsYXNzLCBkZWJ1Z0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZGVidWdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cblxuICAvLyBBZGRzIGEgQXBwbHlSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldEFwcGx5RnVuY3Rpb24oY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmFwcGx5Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IEFwcGx5Um91dGluZShjbGFzc09iaiwgYXBwbHlGdW5jdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUgPSB0aGlzLmFwcGx5Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5hcHBseVJvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseVJvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIGRyYXdPYmplY3Qob2JqZWN0LCBzdHlsZSA9IG51bGwpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBkcmF3IG9iamVjdCAtIG9iamVjdC10eXBlOiR7dXRpbHMudHlwZU5hbWUob2JqZWN0KX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0VG9EcmF3O1xuICAgIH1cblxuICAgIGlmIChyb3V0aW5lLnJlcXVpcmVzUHVzaFBvcCA9PT0gdHJ1ZVxuICAgICAgfHwgc3R5bGUgIT09IG51bGxcbiAgICAgIHx8IHJvdXRpbmUuc3R5bGUgIT09IG51bGwpXG4gICAge1xuICAgICAgdGhpcy5wNS5wdXNoKCk7XG4gICAgICBpZiAocm91dGluZS5zdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICByb3V0aW5lLnN0eWxlLmFwcGx5KCk7XG4gICAgICB9XG4gICAgICBpZiAoc3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgICB0aGlzLnA1LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwdXNoLXB1bGxcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gICAgfVxuICB9XG5cblxuICBkZWJ1Z09iamVjdChvYmplY3QsIGRyYXdzVGV4dCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIE5vIHJvdXRpbmUsIGp1c3QgZHJhdyBvYmplY3Qgd2l0aCBkZWJ1ZyBzdHlsZVxuICAgICAgdGhpcy5kcmF3T2JqZWN0KG9iamVjdCwgdGhpcy5kZWJ1Z1N0eWxlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIHRoaXMuZGVidWdTdHlsZS5hcHBseSgpO1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uKHRoaXMsIG9iamVjdCwgZHJhd3NUZXh0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbih0aGlzLCBvYmplY3QsIGRyYXdzVGV4dCk7XG4gICAgfVxuICB9XG5cblxuICBhcHBseU9iamVjdChvYmplY3QpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuYXBwbHlSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgYXBwbHkgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0FwcGx5O1xuICAgIH1cblxuICAgIHJvdXRpbmUuYXBwbHlGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICB9XG5cblxuICAvLyBTZXRzIHVwIGFsbCBkcmF3aW5nIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGFuZCBzdGF0aWMgZnVuY3Rpb25zIGluIHJlbGV2YW50XG4gIC8vIGNsYXNzZXMuXG4gIHNldHVwQWxsRHJhd0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kcmF3LmZ1bmN0aW9ucycpO1xuXG4gICAgLy8gUG9pbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kcmF3UG9pbnQpO1xuICAgIHJlcXVpcmUoJy4vUG9pbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gUmF5XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRyYXdSYXkpO1xuICAgIHJlcXVpcmUoJy4vUmF5LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFNlZ21lbnRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRyYXdTZWdtZW50KTtcbiAgICByZXF1aXJlKCcuL1NlZ21lbnQuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gQXJjXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRyYXdBcmMpO1xuXG4gICAgUmFjLkFyYy5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgICAgbGV0IGJlemllcnNQZXJUdXJuID0gNTtcbiAgICAgIGxldCBkaXZpc2lvbnMgPSBNYXRoLmNlaWwoYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgKiBiZXppZXJzUGVyVHVybik7XG4gICAgICB0aGlzLmRpdmlkZVRvQmV6aWVycyhkaXZpc2lvbnMpLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBCZXppZXJcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQmV6aWVyLCAoZHJhd2VyLCBiZXppZXIpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZXppZXIoXG4gICAgICAgIGJlemllci5zdGFydC54LCBiZXppZXIuc3RhcnQueSxcbiAgICAgICAgYmV6aWVyLnN0YXJ0QW5jaG9yLngsIGJlemllci5zdGFydEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kQW5jaG9yLngsIGJlemllci5lbmRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZC54LCBiZXppZXIuZW5kLnkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkJlemllci5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnN0YXJ0LnZlcnRleCgpXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuYmV6aWVyVmVydGV4KFxuICAgICAgICB0aGlzLnN0YXJ0QW5jaG9yLngsIHRoaXMuc3RhcnRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmRBbmNob3IueCwgdGhpcy5lbmRBbmNob3IueSxcbiAgICAgICAgdGhpcy5lbmQueCwgdGhpcy5lbmQueSk7XG4gICAgfTtcblxuICAgIC8vIENvbXBvc2l0ZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Db21wb3NpdGUsIChkcmF3ZXIsIGNvbXBvc2l0ZSkgPT4ge1xuICAgICAgY29tcG9zaXRlLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLmRyYXcoKSk7XG4gICAgfSk7XG5cbiAgICBSYWMuQ29tcG9zaXRlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0udmVydGV4KCkpO1xuICAgIH07XG5cbiAgICAvLyBTaGFwZVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TaGFwZSwgKGRyYXdlciwgc2hhcGUpID0+IHtcbiAgICAgIGRyYXdlci5wNS5iZWdpblNoYXBlKCk7XG4gICAgICBzaGFwZS5vdXRsaW5lLnZlcnRleCgpO1xuXG4gICAgICBpZiAoc2hhcGUuY29udG91ci5pc05vdEVtcHR5KCkpIHtcbiAgICAgICAgZHJhd2VyLnA1LmJlZ2luQ29udG91cigpO1xuICAgICAgICBzaGFwZS5jb250b3VyLnZlcnRleCgpO1xuICAgICAgICBkcmF3ZXIucDUuZW5kQ29udG91cigpO1xuICAgICAgfVxuICAgICAgZHJhd2VyLnA1LmVuZFNoYXBlKCk7XG4gICAgfSk7XG5cbiAgICBSYWMuU2hhcGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vdXRsaW5lLnZlcnRleCgpO1xuICAgICAgdGhpcy5jb250b3VyLnZlcnRleCgpO1xuICAgIH07XG5cbiAgICAvLyBUZXh0XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlRleHQsIChkcmF3ZXIsIHRleHQpID0+IHtcbiAgICAgIHRleHQuZm9ybWF0LmFwcGx5KHRleHQucG9pbnQpO1xuICAgICAgZHJhd2VyLnA1LnRleHQodGV4dC5zdHJpbmcsIDAsIDApO1xuICAgIH0pO1xuICAgIC8vIGB0ZXh0LmZvcm1hdC5hcHBseWAgbWFrZXMgdHJhbnNsYXRlIGFuZCByb3RhdGlvbiBtb2RpZmljYXRpb25zIHRvXG4gICAgLy8gdGhlIGRyYXdpbmcgbWF0cml4LCB0aGlzIHJlcXVpcmVzIGEgcHVzaC1wb3Agb24gZXZlcnkgZHJhd1xuICAgIHRoaXMuc2V0RHJhd09wdGlvbnMoUmFjLlRleHQsIHtyZXF1aXJlc1B1c2hQb3A6IHRydWV9KTtcbiAgfSAvLyBzZXR1cEFsbERyYXdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGRlYnVnIHJvdXRpbmVzIGZvciByYWMgZHJhd2FibGUgY2xhc2VzLlxuICBzZXR1cEFsbERlYnVnRnVuY3Rpb25zKCkge1xuICAgIGxldCBmdW5jdGlvbnMgPSByZXF1aXJlKCcuL2RlYnVnLmZ1bmN0aW9ucycpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuUG9pbnQsIGZ1bmN0aW9ucy5kZWJ1Z1BvaW50KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlJheSwgZnVuY3Rpb25zLmRlYnVnUmF5KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlNlZ21lbnQsIGZ1bmN0aW9ucy5kZWJ1Z1NlZ21lbnQpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuQXJjLCBmdW5jdGlvbnMuZGVidWdBcmMpO1xuXG4gICAgUmFjLkFuZ2xlLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uKHBvaW50LCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgY29uc3QgZHJhd2VyID0gdGhpcy5yYWMuZHJhd2VyO1xuICAgICAgaWYgKGRyYXdlci5kZWJ1Z1N0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5wdXNoKCk7XG4gICAgICAgIGRyYXdlci5kZWJ1Z1N0eWxlLmFwcGx5KCk7XG4gICAgICAgIC8vIFRPRE86IGNvdWxkIHRoaXMgYmUgYSBnb29kIG9wdGlvbiB0byBpbXBsZW1lbnQgc3BsYXR0aW5nIGFyZ3VtZW50c1xuICAgICAgICAvLyBpbnRvIHRoZSBkZWJ1Z0Z1bmN0aW9uP1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgICBkcmF3ZXIucDUucG9wKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jdGlvbnMuZGVidWdBbmdsZShkcmF3ZXIsIHRoaXMsIHBvaW50LCBkcmF3c1RleHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFJhYy5Qb2ludC5wcm90b3R5cGUuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlLCBkcmF3c1RleHQgPSBmYWxzZSkge1xuICAgICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICAgIGFuZ2xlLmRlYnVnKHRoaXMsIGRyYXdzVGV4dCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9IC8vIHNldHVwQWxsRGVidWdGdW5jdGlvbnNcblxuXG4gIC8vIFNldHMgdXAgYWxsIGFwcGx5aW5nIHJvdXRpbmVzIGZvciByYWMgc3R5bGUgY2xhc2VzLlxuICAvLyBBbHNvIGF0dGFjaGVzIGFkZGl0aW9uYWwgcHJvdG90eXBlIGZ1bmN0aW9ucyBpbiByZWxldmFudCBjbGFzc2VzLlxuICBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCkge1xuICAgIC8vIENvbG9yIHByb3RvdHlwZSBmdW5jdGlvbnNcbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5QmFja2dyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJhY2tncm91bmQodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlGaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuZmlsbCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5U3Ryb2tlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuc3Ryb2tlKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIC8vIFN0cm9rZVxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3Ryb2tlLCAoZHJhd2VyLCBzdHJva2UpID0+IHtcbiAgICAgIGlmIChzdHJva2Uud2VpZ2h0ID09PSBudWxsICYmIHN0cm9rZS5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9TdHJva2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLmNvbG9yICE9PSBudWxsKSB7XG4gICAgICAgIHN0cm9rZS5jb2xvci5hcHBseVN0cm9rZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUuc3Ryb2tlV2VpZ2h0KHN0cm9rZS53ZWlnaHQgKiBkcmF3ZXIuc3Ryb2tlV2VpZ2h0RmFjdG9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZpbGxcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLkZpbGwsIChkcmF3ZXIsIGZpbGwpID0+IHtcbiAgICAgIGlmIChmaWxsLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5ub0ZpbGwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmaWxsLmNvbG9yLmFwcGx5RmlsbCgpO1xuICAgIH0pO1xuXG4gICAgLy8gU3R5bGVDb250YWluZXJcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0eWxlQ29udGFpbmVyLCAoZHJhd2VyLCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5hcHBseSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBUZXh0LkZvcm1hdFxuICAgIC8vIEFwcGxpZXMgYWxsIHRleHQgcHJvcGVydGllcyBhbmQgdHJhbnNsYXRlcyB0byB0aGUgZ2l2ZW4gYHBvaW50YC5cbiAgICAvLyBBZnRlciB0aGUgZm9ybWF0IGlzIGFwcGxpZWQgdGhlIHRleHQgc2hvdWxkIGJlIGRyYXduIGF0IHRoZSBvcmlnaW4uXG4gICAgLy9cbiAgICAvLyBDYWxsaW5nIHRoaXMgZnVuY3Rpb24gcmVxdWlyZXMgYSBwdXNoLXBvcCB0byB0aGUgZHJhd2luZyBzdHlsZVxuICAgIC8vIHNldHRpbmdzIHNpbmNlIHRyYW5zbGF0ZSBhbmQgcm90YXRpb24gbW9kaWZpY2F0aW9ucyBhcmUgbWFkZSB0byB0aGVcbiAgICAvLyBkcmF3aW5nIG1hdHJpeC4gT3RoZXJ3aXNlIGFsbCBvdGhlciBzdWJzZXF1ZW50IGRyYXdpbmcgd2lsbCBiZVxuICAgIC8vIGltcGFjdGVkLlxuICAgIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbihwb2ludCkge1xuICAgICAgbGV0IGhBbGlnbjtcbiAgICAgIGxldCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gICAgICBzd2l0Y2ggKHRoaXMuaEFsaWduKSB7XG4gICAgICAgIGNhc2UgaEVudW0ubGVmdDogICBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuTEVGVDsgICBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5jZW50ZXI6IGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5DRU5URVI7IGJyZWFrO1xuICAgICAgICBjYXNlIGhFbnVtLnJpZ2h0OiAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlJJR0hUOyAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBoQWxpZ24gY29uZmlndXJhdGlvbiAtIGhBbGlnbjoke3RoaXMuaEFsaWdufWApO1xuICAgICAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICAgIH1cblxuICAgICAgbGV0IHZBbGlnbjtcbiAgICAgIGxldCB2RW51bSA9IFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduO1xuICAgICAgc3dpdGNoICh0aGlzLnZBbGlnbikge1xuICAgICAgICBjYXNlIHZFbnVtLnRvcDogICAgICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuVE9QOyAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJvdHRvbTogICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQk9UVE9NOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmNlbnRlcjogICB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIHZFbnVtLmJhc2VsaW5lOiB2QWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQkFTRUxJTkU7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgdkFsaWduIGNvbmZpZ3VyYXRpb24gLSB2QWxpZ246JHt0aGlzLnZBbGlnbn1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIC8vIEFsaWduXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dEFsaWduKGhBbGlnbiwgdkFsaWduKTtcblxuICAgICAgLy8gU2l6ZVxuICAgICAgY29uc3QgdGV4dFNpemUgPSB0aGlzLnNpemUgPz8gdGhpcy5yYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemU7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dFNpemUodGV4dFNpemUpO1xuXG4gICAgICAvLyBGb250XG4gICAgICBjb25zdCB0ZXh0Rm9udCA9IHRoaXMuZm9udCA/PyB0aGlzLnJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuZm9udDtcbiAgICAgIGlmICh0ZXh0Rm9udCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudGV4dEZvbnQodGV4dEZvbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3NpdGlvbmluZ1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRyYW5zbGF0ZShwb2ludC54LCBwb2ludC55KTtcbiAgICAgIGlmICh0aGlzLmFuZ2xlLnR1cm4gIT0gMCkge1xuICAgICAgICB0aGlzLnJhYy5kcmF3ZXIucDUucm90YXRlKHRoaXMuYW5nbGUucmFkaWFucygpKTtcbiAgICAgIH1cbiAgICB9IC8vIFJhYy5UZXh0LkZvcm1hdC5wcm90b3R5cGUuYXBwbHlcblxuICB9IC8vIHNldHVwQWxsQXBwbHlGdW5jdGlvbnNcblxufSAvLyBjbGFzcyBQNURyYXdlclxuXG5tb2R1bGUuZXhwb3J0cyA9IFA1RHJhd2VyO1xuXG5cbi8vIENvbnRhaW5zIHRoZSBkcmF3aW5nIGZ1bmN0aW9uIGFuZCBvcHRpb25zIGZvciBkcmF3aW5nIG9iamVjdHMgb2YgYVxuLy8gc3BlY2lmaWMgY2xhc3MuXG4vL1xuLy8gQW4gaW5zdGFuY2UgaXMgY3JlYXRlZCBmb3IgZWFjaCBkcmF3YWJsZSBjbGFzcyB0aGF0IHRoZSBkcmF3ZXIgY2FuXG4vLyBzdXBwb3J0LCB3aGljaCBjb250YWlucyBhbGwgdGhlIHNldHRpbmdzIG5lZWRlZCBmb3IgZHJhd2luZy5cbmNsYXNzIERyYXdSb3V0aW5lIHtcblxuICAvLyBUT0RPOiBSZW5hbWUgdG8gZHJhd2FibGVDbGFzc1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRyYXdGdW5jdGlvbikge1xuICAgIC8vIENsYXNzIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29udGFpbmVkIHNldHRpbmdzLlxuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcblxuICAgIC8vIERyYXdpbmcgZnVuY3Rpb24gZm9yIG9iamVjdHMgb2YgdHlwZSBgY2xhc3NPYmpgIHdpdGggdGhlIHNpZ25hdHVyZTpcbiAgICAvLyBgZHJhd0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcylgXG4gICAgLy8gKyBgZHJhd2VyOiBQNURyYXdlcmAgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmdcbiAgICAvLyArIGBvYmplY3RPZkNsYXNzOiBjbGFzc09iamAgLSBJbnN0YW5jZSBvZiBgY2xhc3NPYmpgIHRvIGRyYXdcbiAgICAvL1xuICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBpbnRlbmRlZCB0byBwZXJmb3JtIGRyYXdpbmcgdXNpbmcgYGRyYXdlci5wNWBcbiAgICAvLyBmdW5jdGlvbnMgb3IgY2FsbGluZyBgZHJhdygpYCBpbiBvdGhlciBkcmF3YWJsZSBvYmplY3RzLiBBbGwgc3R5bGVzXG4gICAgLy8gYXJlIHB1c2hlZCBiZWZvcmVoYW5kIGFuZCBwb3BwZWQgYWZ0ZXJ3YXJkcy5cbiAgICAvL1xuICAgIC8vIEluIGdlbmVyYWwgaXQgaXMgZXhwZWN0ZWQgdGhhdCB0aGUgYGRyYXdGdW5jdGlvbmAgcGVmb3JtcyBubyBjaGFuZ2VzXG4gICAgLy8gdG8gdGhlIGRyYXdpbmcgc2V0dGluZ3MgaW4gb3JkZXIgZm9yIGVhY2ggZHJhd2luZyBjYWxsIHRvIHVzZSBvbmx5IGFcbiAgICAvLyBzaW5nbGUgYHB1c2gvcG9wYCB3aGVuIG5lY2Vzc2FyeS4gRm9yIGNsYXNzZXMgdGhhdCByZXF1aXJlXG4gICAgLy8gbW9kaWZpY2F0aW9ucyB0byB0aGUgZHJhd2luZyBzZXR0aW5ncyB0aGUgYHJlcXVpcmVzUHVzaFBvcGBcbiAgICAvLyBwcm9wZXJ0eSBjYW4gYmUgc2V0IHRvIGZvcmNlIGEgYHB1c2gvcG9wYCB3aXRoIGVhY2ggZHJhd2luZyBjYWxsXG4gICAgLy8gcmVnYXJkbGVzcyBpZiBzdHlsZXMgYXJlIGFwcGxpZWQuXG4gICAgdGhpcy5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG5cbiAgICAvLyBXaGVuIHNldCwgdGhpcyBzdHlsZSBpcyBhbHdheXMgYXBwbGllZCBiZWZvcmUgZWFjaCBkcmF3aW5nIGNhbGwgdG9cbiAgICAvLyBvYmplY3RzIG9mIHR5cGUgYGNsYXNzT2JqYC4gVGhpcyBgc3R5bGVgIGlzIGFwcGxpZWQgYmVmb3JlIHRoZVxuICAgIC8vIGBzdHlsZWAgcHJvdmlkZWQgdG8gdGhlIGRyYXdpbmcgY2FsbC5cbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcblxuICAgIC8vIFdoZW4gc2V0IHRvIGB0cnVlYCwgYSBgcHVzaC9wb3BgIGlzIGFsd2F5cyBwZWZvcm1lZCBiZWZvcmUgYW5kIGFmdGVyXG4gICAgLy8gYWxsIHRoZSBzdHlsZSBhcmUgYXBwbGllZCBhbmQgZHJhd2luZyBpcyBwZXJmb3JtZWQuIFRoaXMgaXMgaW50ZW5kZWRcbiAgICAvLyBmb3Igb2JqZWN0cyB3aGljaCBkcmF3aW5nIG9wZXJhdGlvbnMgbWF5IG5lZWQgdG8gcGVyZm9ybVxuICAgIC8vIHRyYW5zZm9ybWF0aW9ucyB0byB0aGUgZHJhd2luZyBzZXR0aW5ncy5cbiAgICB0aGlzLnJlcXVpcmVzUHVzaFBvcCA9IGZhbHNlO1xuICB9IC8vIGNvbnN0cnVjdG9yXG5cbn0gLy8gRHJhd1JvdXRpbmVcblxuXG4vLyBDb250YWlucyB0aGUgZGVidWctZHJhd2luZyBmdW5jdGlvbiBhbmQgb3B0aW9ucyBmb3IgZGVidWctZHJhd2luZ1xuLy8gb2JqZWN0cyBvZiBhIHNwZWNpZmljIGNsYXNzLlxuLy9cbi8vIEFuIGluc3RhbmNlIGlzIGNyZWF0ZWQgZm9yIGVhY2ggZHJhd2FibGUgY2xhc3MgdGhhdCB0aGUgZHJhd2VyIGNhblxuLy8gc3VwcG9ydCwgd2hpY2ggY29udGFpbnMgYWxsIHRoZSBzZXR0aW5ncyBuZWVkZWQgZm9yIGRlYnVnLWRyYXdpbmcuXG4vL1xuLy8gV2hlbiBhIGRyYXdhYmxlIG9iamVjdCBkb2VzIG5vdCBoYXZlIGEgYERlYnVnUm91dGluZWAgc2V0dXAsIGNhbGxpbmdcbi8vIGBkZWJ1ZygpYCBzaW1wbHkgY2FsbHMgYGRyYXcoKWAgd2l0aCB0aGUgZGVidWcgc3R5bGUgYXBwbGllZC5cbmNsYXNzIERlYnVnUm91dGluZSB7XG5cbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgLy8gQ2xhc3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb250YWluZWQgc2V0dGluZ3MuXG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuXG4gICAgLy8gRGVidWcgZnVuY3Rpb24gZm9yIG9iamVjdHMgb2YgdHlwZSBgY2xhc3NPYmpgIHdpdGggdGhlIHNpZ25hdHVyZTpcbiAgICAvLyBgZGVidWdGdW5jdGlvbihkcmF3ZXIsIG9iamVjdE9mQ2xhc3MsIGRyYXdzVGV4dClgXG4gICAgLy8gKyBgZHJhd2VyOiBQNURyYXdlcmAgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmdcbiAgICAvLyArIGBvYmplY3RPZkNsYXNzOiBjbGFzc09iamAgLSBJbnN0YW5jZSBvZiBgY2xhc3NPYmpgIHRvIGRlYnVnXG4gICAgLy8gKyBgZHJhd3NUZXh0OiBib29sYCAtIFdoZW4gYHRydWVgIHRleHQgc2hvdWxkIGJlIGRyYXduIHdpdGhcbiAgICAvLyAgIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAgLy9cbiAgICAvLyBUaGUgZnVuY3Rpb24gaXMgaW50ZW5kZWQgdG8gcGVyZm9ybSBkZWJ1Zy1kcmF3aW5nIHVzaW5nIGBkcmF3ZXIucDVgXG4gICAgLy8gZnVuY3Rpb25zIG9yIGNhbGxpbmcgYGRyYXcoKWAgaW4gb3RoZXIgZHJhd2FibGUgb2JqZWN0cy4gVGhlIGRlYnVnXG4gICAgLy8gc3R5bGUgaXMgcHVzaGVkIGJlZm9yZWhhbmQgYW5kIHBvcHBlZCBhZnRlcndhcmRzLlxuICAgIC8vXG4gICAgLy8gSW4gZ2VuZXJhbCBpdCBpcyBleHBlY3RlZCB0aGF0IHRoZSBgZHJhd0Z1bmN0aW9uYCBwZWZvcm1zIG5vIGNoYW5nZXNcbiAgICAvLyB0byB0aGUgZHJhd2luZyBzZXR0aW5ncyBpbiBvcmRlciBmb3IgZWFjaCBkcmF3aW5nIGNhbGwgdG8gdXNlIG9ubHkgYVxuICAgIC8vIHNpbmdsZSBgcHVzaC9wb3BgIHdoZW4gbmVjZXNzYXJ5LlxuICAgIC8vXG4gICAgdGhpcy5kZWJ1Z0Z1bmN0aW9uID0gZGVidWdGdW5jdGlvbjtcbiAgfSAvLyBjb25zdHJ1Y3RvclxuXG59XG5cblxuY2xhc3MgQXBwbHlSb3V0aW5lIHtcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBhcHBseUZ1bmN0aW9uKSB7XG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuICAgIHRoaXMuYXBwbHlGdW5jdGlvbiA9IGFwcGx5RnVuY3Rpb247XG4gIH1cbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hQb2ludEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCB0byByZXByZXNlbnQgdGhpcyBgUG9pbnRgLlxuICAqXG4gICogQWRkZWQgIHRvIGBSYWMuUG9pbnQucHJvdG90eXBlYCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKi9cbiAgUmFjLlBvaW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5kcmF3ZXIucDUudmVydGV4KHRoaXMueCwgdGhpcy55KTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgcG9pbnRlci5cbiAgKlxuICAqIEFkZGVkIHRvIGByYWMuUG9pbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBmdW5jdGlvbiBwb2ludGVyXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQucG9pbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS5tb3VzZVgsIHJhYy5kcmF3ZXIucDUubW91c2VZKTtcbiAgfTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBBZGRlZCB0byBgcmFjLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQ2VudGVyXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzQ2VudGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLzIsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0LzIpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBlbmQgb2YgdGhlIGNhbnZhcywgdGhhdCBpcywgYXQgdGhlIHBvc2l0aW9uXG4gICogYCh3aWR0aCxoZWlnaHQpYC5cbiAgKlxuICAqIEFkZGVkIHRvIGByYWMuUG9pbnRgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNFbmRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUG9pbnQjXG4gICovXG4gIHJhYy5Qb2ludC5jYW52YXNFbmQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxufSAvLyBhdHRhY2hQb2ludEZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJheUZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCB3aGVyZSB0aGUgcmF5IHRvdWNoZXMgdGhlIGNhbnZhcyBlZGdlLlxuICAqXG4gICogV2hlbiB0aGUgcmF5IGlzIG91dHNpZGUgdGhlIGNhbnZhcyBhbmQgcG9pbnRpbmcgYXdheSwgYG51bGxgIGlzXG4gICogcmV0dXJuZWQuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5SYXkucHJvdG90eXBlYCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKiBAcmV0dXJucyB7P1JhYy5Qb2ludH1cbiAgKi9cbiAgUmFjLlJheS5wcm90b3R5cGUucG9pbnRBdENhbnZhc0VkZ2UgPSBmdW5jdGlvbihtYXJnaW4gPSAwKSB7XG4gICAgbGV0IGVkZ2VSYXkgPSB0aGlzLnJheUF0Q2FudmFzRWRnZShtYXJnaW4pO1xuICAgIGlmIChlZGdlUmF5ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBlZGdlUmF5LnN0YXJ0O1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB0aGF0IHN0YXJ0cyBhdCB0aGUgcG9pbnQgd2hlcmUgdGhlIGB0aGlzYCB0b3VjaGVzXG4gICogdGhlIGNhbnZhcyBlZGdlIGFuZCBwb2ludGVkIHRvd2FyZHMgdGhlIGluc2lkZSBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogV2hlbiB0aGUgcmF5IGlzIG91dHNpZGUgdGhlIGNhbnZhcyBhbmQgcG9pbnRpbmcgYXdheSwgYG51bGxgIGlzXG4gICogcmV0dXJuZWQuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5SYXkucHJvdG90eXBlYCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHs/UmFjLlJheX1cbiAgKi9cbiAgUmFjLlJheS5wcm90b3R5cGUucmF5QXRDYW52YXNFZGdlID0gZnVuY3Rpb24obWFyZ2luID0gMCkge1xuICAgIGNvbnN0IHR1cm4gPSB0aGlzLmFuZ2xlLnR1cm47XG4gICAgY29uc3QgcDUgPSB0aGlzLnJhYy5kcmF3ZXIucDU7XG5cbiAgICBjb25zdCBkb3duRWRnZSAgPSBwNS5oZWlnaHQgLSBtYXJnaW47XG4gICAgY29uc3QgbGVmdEVkZ2UgID0gbWFyZ2luO1xuICAgIGNvbnN0IHVwRWRnZSAgICA9IG1hcmdpbjtcbiAgICBjb25zdCByaWdodEVkZ2UgPSBwNS53aWR0aCAtIG1hcmdpbjtcblxuICAgIC8vIHBvaW50aW5nIGRvd25cbiAgICBpZiAodHVybiA+PSAxLzggJiYgdHVybiA8IDMvOCkge1xuICAgICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuc3RhcnQueSA8IGRvd25FZGdlKSB7XG4gICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICBpZiAoZWRnZVJheS5zdGFydC54ID4gcmlnaHRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgocmlnaHRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUubGVmdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC54IDwgbGVmdEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChsZWZ0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVkZ2VSYXk7XG4gICAgfVxuXG4gICAgLy8gcG9pbnRpbmcgbGVmdFxuICAgIGlmICh0dXJuID49IDMvOCAmJiB0dXJuIDwgNS84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC54ID49IGxlZnRFZGdlKSB7XG4gICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICBpZiAoZWRnZVJheS5zdGFydC55ID4gZG93bkVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WShkb3duRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLnVwKTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnkgPCB1cEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVkZ2VSYXk7XG4gICAgfVxuXG4gICAgLy8gcG9pbnRpbmcgdXBcbiAgICBpZiAodHVybiA+PSA1LzggJiYgdHVybiA8IDcvOCkge1xuICAgICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuc3RhcnQueSA+PSB1cEVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyByaWdodFxuICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICBpZiAodGhpcy5zdGFydC54IDwgcmlnaHRFZGdlKSB7XG4gICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnkgPiBkb3duRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueSA8IHVwRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlZGdlUmF5O1xuICB9O1xuXG59IC8vIGF0dGFjaFJheUZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ2FsbHMgYHA1LnZlcnRleGAgdG8gcmVwcmVzZW50IHRoaXMgYFNlZ21lbnRgLlxuICAqXG4gICogQWRkZWQgIHRvIGBSYWMuU2VnbWVudC5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqL1xuICBSYWMuU2VnbWVudC5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGFydFBvaW50KCkudmVydGV4KCk7XG4gICAgdGhpcy5lbmRQb2ludCgpLnZlcnRleCgpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTZWdtZW50YCB0aGF0IGNvdmVycyB0aGUgdG9wIG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnQgdG9cbiAgKiB0b3AtcmlnaHQuXG4gICpcbiAgKiBBZGRlZCAgdG8gYHJhYy5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNUb3BcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU2VnbWVudCNcbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzVG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLnJpZ2h0LCByYWMuZHJhd2VyLnA1LndpZHRoKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIGxlZnQgb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdFxuICAqIHRvIGJvdHRvbS1sZWZ0LlxuICAqXG4gICogQWRkZWQgIHRvIGByYWMuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzTGVmdFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNMZWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLXJpZ2h0XG4gICogdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGByYWMuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzUmlnaHRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU2VnbWVudCNcbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzUmlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0b3BSaWdodCA9IHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLCAwKTtcbiAgICByZXR1cm4gdG9wUmlnaHRcbiAgICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuZG93biwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTZWdtZW50YCB0aGF0IGNvdmVycyB0aGUgYm90dG9tIG9mIHRoZSBjYW52YXMsIGZyb21cbiAgKiBib3R0b20tbGVmdCB0byBib3R0b20tcmlnaHQuXG4gICpcbiAgKiBBZGRlZCAgdG8gYHJhYy5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNCb3R0b21cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU2VnbWVudCNcbiAgKi9cbiAgcmFjLlNlZ21lbnQuY2FudmFzQm90dG9tID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGJvdHRvbUxlZnQgPSByYWMuUG9pbnQoMCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICAgIHJldHVybiBib3R0b21MZWZ0XG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLnJpZ2h0LCByYWMuZHJhd2VyLnA1LndpZHRoKTtcbiAgfTtcblxuXG5cbn0gLy8gYXR0YWNoU2VnbWVudEZ1bmN0aW9uc1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuZnVuY3Rpb24gcmV2ZXJzZXNUZXh0KGFuZ2xlKSB7XG4gIHJldHVybiBhbmdsZS50dXJuIDwgMy80ICYmIGFuZ2xlLnR1cm4gPj0gMS80O1xufVxuXG5cbmV4cG9ydHMuZGVidWdBbmdsZSA9IGZ1bmN0aW9uKGRyYXdlciwgYW5nbGUsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgLy8gWmVybyBzZWdtZW50XG4gIHBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS56ZXJvLCBtYXJrZXJSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBBbmdsZSBzZWdtZW50XG4gIGxldCBhbmdsZVNlZ21lbnQgPSBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhbmdsZSwgbWFya2VyUmFkaXVzICogMS41KTtcbiAgYW5nbGVTZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKHBvaW50UmFkaXVzLCBhbmdsZSwgYW5nbGUuaW52ZXJzZSgpLCBmYWxzZSlcbiAgICAuZHJhdygpO1xuICBhbmdsZVNlZ21lbnRcbiAgICAud2l0aExlbmd0aEFkZChwb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIE1pbmkgYXJjIG1hcmtlcnNcbiAgbGV0IGFuZ2xlQXJjID0gcG9pbnQuYXJjKG1hcmtlclJhZGl1cywgcmFjLkFuZ2xlLnplcm8sIGFuZ2xlKTtcbiAgbGV0IGNvbnRleHQgPSBkcmF3ZXIucDUuZHJhd2luZ0NvbnRleHQ7XG4gIGxldCBzdHJva2VXZWlnaHQgPSBjb250ZXh0LmxpbmVXaWR0aDtcbiAgY29udGV4dC5zYXZlKCk7IHtcbiAgICBjb250ZXh0LmxpbmVDYXAgPSAnYnV0dCc7XG4gICAgY29udGV4dC5zZXRMaW5lRGFzaChbNiwgNF0pO1xuICAgIC8vIEFuZ2xlIGFyY1xuICAgIGFuZ2xlQXJjLmRyYXcoKTtcblxuICAgIGlmICghYW5nbGVBcmMuaXNDaXJjbGUoKSkge1xuICAgICAgLy8gT3V0c2lkZSBhbmdsZSBhcmNcbiAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzIsIDRdKTtcbiAgICAgIGFuZ2xlQXJjXG4gICAgICAgIC53aXRoUmFkaXVzKG1hcmtlclJhZGl1cyozLzQpXG4gICAgICAgIC53aXRoQ2xvY2t3aXNlKGZhbHNlKVxuICAgICAgICAuZHJhdygpO1xuICAgIH1cbiAgfTtcbiAgY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcixcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBmb3JtYXQgPSBmb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gVHVybiB0ZXh0XG4gIGxldCB0dXJuU3RyaW5nID0gYHR1cm46JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBwb2ludFxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyoyKVxuICAgIC50ZXh0KHR1cm5TdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdBbmdsZVxuXG5cbmV4cG9ydHMuZGVidWdQb2ludCA9IGZ1bmN0aW9uKGRyYXdlciwgcG9pbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBwb2ludC5kcmF3KCk7XG5cbiAgLy8gUG9pbnQgbWFya2VyXG4gIHBvaW50LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIFBvaW50IHJldGljdWxlIG1hcmtlclxuICBsZXQgYXJjID0gcG9pbnRcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcmFjLkFuZ2xlLnMsIHJhYy5BbmdsZS5lKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMS8yKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBzdHJpbmcgPSBgeDoke3BvaW50LngudG9GaXhlZChkaWdpdHMpfVxcbnk6JHtwb2ludC55LnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgZm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCxcbiAgICByYWMuQW5nbGUuZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBwb2ludFxuICAgIC5wb2ludFRvQW5nbGUocmFjLkFuZ2xlLnNlLCBwb2ludFJhZGl1cyoyKVxuICAgIC50ZXh0KHN0cmluZywgZm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1BvaW50XG5cblxuZXhwb3J0cy5kZWJ1Z1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuXG4gIHJheS5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgcmF5LnN0YXJ0LmFyYyhwb2ludFJhZGl1cykuZHJhdygpO1xuXG4gIC8vIEhhbGYgY2lyY2xlIGF0IHN0YXJ0XG4gIGNvbnN0IHBlcnBBbmdsZSA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gIGNvbnN0IHN0YXJ0QXJjID0gcmF5LnN0YXJ0XG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBzdGFydEFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBzdGFydEFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcblxuICAvLyBFZGdlIGVuZCBoYWxmIGNpcmNsZVxuICBjb25zdCBlZGdlUmF5ID0gcmF5LnJheUF0Q2FudmFzRWRnZSgpO1xuICBpZiAoZWRnZVJheSAhPSBudWxsKSB7XG4gICAgY29uc3QgZWRnZUFyYyA9IGVkZ2VSYXlcbiAgICAgIC50cmFuc2xhdGVUb0Rpc3RhbmNlKHBvaW50UmFkaXVzKVxuICAgICAgLnBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgICAuYXJjVG9BbmdsZURpc3RhbmNlKG1hcmtlclJhZGl1cy8yLCAwLjUpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMuc3RhcnRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLmVuZFNlZ21lbnQoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgICAuZHJhdygpO1xuICAgIGVkZ2VBcmMucmFkaXVzU2VnbWVudEF0QW5nbGUoZWRnZVJheS5hbmdsZSlcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBjb25zdCBhbmdsZSAgPSByYXkuYW5nbGU7XG4gIGNvbnN0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgY29uc3QgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcbiAgY29uc3QgZm9udCAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udDtcbiAgY29uc3Qgc2l6ZSAgID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZTtcbiAgY29uc3QgZGlnaXRzID0gZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBzdGFydEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhFbnVtLmxlZnQsIHZFbnVtLmJvdHRvbSxcbiAgICBhbmdsZSwgZm9udCwgc2l6ZSk7XG4gIGxldCBhbmdsZUZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLFxuICAgIGhFbnVtLmxlZnQsIHZFbnVtLnRvcCxcbiAgICBhbmdsZSwgZm9udCwgc2l6ZSk7XG4gIGlmIChyZXZlcnNlc1RleHQoYW5nbGUpKSB7XG4gICAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICAgIHN0YXJ0Rm9ybWF0ID0gc3RhcnRGb3JtYXQucmV2ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgdGV4dFxuICBjb25zdCBzdGFydFN0cmluZyA9IGBzdGFydDooJHtyYXkuc3RhcnQueC50b0ZpeGVkKGRpZ2l0cyl9LCR7cmF5LnN0YXJ0LnkudG9GaXhlZChkaWdpdHMpfSlgO1xuICByYXkuc3RhcnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLnN1YnRyYWN0KDEvNCksIG1hcmtlclJhZGl1cy8yKVxuICAgIC50ZXh0KHN0YXJ0U3RyaW5nLCBzdGFydEZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gIC8vIEFuZ2xlIHRleHRcbiAgY29uc3QgYW5nbGVTdHJpbmcgPSBgYW5nbGU6JHthbmdsZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICByYXkuc3RhcnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLmFkZCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChhbmdsZVN0cmluZywgYW5nbGVGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnUmF5XG5cblxuZXhwb3J0cy5kZWJ1Z1NlZ21lbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHNlZ21lbnQsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBzZWdtZW50LmRyYXcoKTtcblxuICAvLyBMaXR0bGUgY2lyY2xlIGF0IHN0YXJ0IG1hcmtlclxuICBzZWdtZW50LndpdGhMZW5ndGgocG9pbnRSYWRpdXMpXG4gICAgLmFyYygpXG4gICAgLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBzdGFydCBzZWdtZW50XG4gIGxldCBwZXJwQW5nbGUgPSBzZWdtZW50LmFuZ2xlKCkucGVycGVuZGljdWxhcigpO1xuICBsZXQgYXJjID0gc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAuYXJjKG1hcmtlclJhZGl1cywgcGVycEFuZ2xlLCBwZXJwQW5nbGUuaW52ZXJzZSgpKVxuICAgIC5kcmF3KCk7XG4gIGFyYy5zdGFydFNlZ21lbnQoKS5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuICBhcmMuZW5kU2VnbWVudCgpXG4gICAgLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gUGVycGVuZGljdWxhciBlbmQgbWFya2VyXG4gIGxldCBlbmRNYXJrZXJTdGFydCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKClcbiAgICAud2l0aExlbmd0aChtYXJrZXJSYWRpdXMvMilcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKC1wb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuICBsZXQgZW5kTWFya2VyRW5kID0gc2VnbWVudFxuICAgIC5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoZmFsc2UpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgLy8gTGl0dGxlIGVuZCBoYWxmIGNpcmNsZVxuICBzZWdtZW50LmVuZFBvaW50KClcbiAgICAuYXJjKHBvaW50UmFkaXVzLCBlbmRNYXJrZXJTdGFydC5hbmdsZSgpLCBlbmRNYXJrZXJFbmQuYW5nbGUoKSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIEZvcm1pbmcgZW5kIGFycm93XG4gIGxldCBhcnJvd0FuZ2xlU2hpZnQgPSByYWMuQW5nbGUuZnJvbSgxLzcpO1xuICBsZXQgZW5kQXJyb3dTdGFydCA9IGVuZE1hcmtlclN0YXJ0XG4gICAgLnJldmVyc2UoKVxuICAgIC5yYXkud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZVNoaWZ0LCBmYWxzZSk7XG4gIGxldCBlbmRBcnJvd0VuZCA9IGVuZE1hcmtlckVuZFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgdHJ1ZSk7XG4gIGxldCBlbmRBcnJvd1BvaW50ID0gZW5kQXJyb3dTdGFydFxuICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKGVuZEFycm93RW5kKTtcbiAgLy8gRW5kIGFycm93XG4gIGVuZE1hcmtlclN0YXJ0XG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRBcnJvd1BvaW50KVxuICAgIC5kcmF3KClcbiAgICAubmV4dFNlZ21lbnRUb1BvaW50KGVuZE1hcmtlckVuZC5lbmRQb2ludCgpKVxuICAgIC5kcmF3KCk7XG5cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IGFuZ2xlID0gc2VnbWVudC5hbmdsZSgpO1xuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGxlbmd0aEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20sXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IGFuZ2xlRm9ybWF0ID0gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICByYWMsXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCxcbiAgICBhbmdsZSxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBsZW5ndGhGb3JtYXQgPSBsZW5ndGhGb3JtYXQucmV2ZXJzZSgpO1xuICAgIGFuZ2xlRm9ybWF0ID0gYW5nbGVGb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgLy8gTGVuZ3RoXG4gIGxldCBsZW5ndGhTdHJpbmcgPSBgbGVuZ3RoOiR7c2VnbWVudC5sZW5ndGgudG9GaXhlZChkaWdpdHMpfWA7XG4gIHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5zdWJ0cmFjdCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChsZW5ndGhTdHJpbmcsIGxlbmd0aEZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuXG4gICAgLy8gQW5nbGVcbiAgbGV0IGFuZ2xlU3RyaW5nID0gYGFuZ2xlOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgc2VnbWVudC5zdGFydFBvaW50KClcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBwb2ludFJhZGl1cylcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLmFkZCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChhbmdsZVN0cmluZywgYW5nbGVGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnU2VnbWVudFxuXG5cbmV4cG9ydHMuZGVidWdBcmMgPSBmdW5jdGlvbihkcmF3ZXIsIGFyYywgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIGFyYy5kcmF3KCk7XG5cbiAgLy8gQ2VudGVyIG1hcmtlcnNcbiAgbGV0IGNlbnRlckFyY1JhZGl1cyA9IG1hcmtlclJhZGl1cyAqIDIvMztcbiAgaWYgKGFyYy5yYWRpdXMgPiBtYXJrZXJSYWRpdXMvMyAmJiBhcmMucmFkaXVzIDwgbWFya2VyUmFkaXVzKSB7XG4gICAgLy8gSWYgcmFkaXVzIGlzIHRvbyBjbG9zZSB0byB0aGUgY2VudGVyLWFyYyBtYXJrZXJzXG4gICAgLy8gTWFrZSB0aGUgY2VudGVyLWFyYyBiZSBvdXRzaWRlIG9mIHRoZSBhcmNcbiAgICBjZW50ZXJBcmNSYWRpdXMgPSBhcmMucmFkaXVzICsgbWFya2VyUmFkaXVzLzM7XG4gIH1cblxuICAvLyBDZW50ZXIgc3RhcnQgc2VnbWVudFxuICBsZXQgY2VudGVyQXJjID0gYXJjLndpdGhSYWRpdXMoY2VudGVyQXJjUmFkaXVzKTtcbiAgY2VudGVyQXJjLnN0YXJ0U2VnbWVudCgpLmRyYXcoKTtcblxuICAvLyBSYWRpdXNcbiAgbGV0IHJhZGl1c01hcmtlckxlbmd0aCA9IGFyYy5yYWRpdXNcbiAgICAtIGNlbnRlckFyY1JhZGl1c1xuICAgIC0gbWFya2VyUmFkaXVzLzJcbiAgICAtIHBvaW50UmFkaXVzKjI7XG4gIGlmIChyYWRpdXNNYXJrZXJMZW5ndGggPiAwKSB7XG4gICAgYXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAud2l0aExlbmd0aChyYWRpdXNNYXJrZXJMZW5ndGgpXG4gICAgICAudHJhbnNsYXRlVG9MZW5ndGgoY2VudGVyQXJjUmFkaXVzICsgcG9pbnRSYWRpdXMqMilcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBNaW5pIGFyYyBtYXJrZXJzXG4gIGxldCBjb250ZXh0ID0gZHJhd2VyLnA1LmRyYXdpbmdDb250ZXh0O1xuICBsZXQgc3Ryb2tlV2VpZ2h0ID0gY29udGV4dC5saW5lV2lkdGg7XG4gIGNvbnRleHQuc2F2ZSgpOyB7XG4gICAgY29udGV4dC5saW5lQ2FwID0gJ2J1dHQnO1xuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzYsIDRdKTtcbiAgICBjZW50ZXJBcmMuZHJhdygpO1xuXG4gICAgaWYgKCFjZW50ZXJBcmMuaXNDaXJjbGUoKSkge1xuICAgICAgLy8gT3V0c2lkZSBhbmdsZSBhcmNcbiAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzIsIDRdKTtcbiAgICAgIGNlbnRlckFyY1xuICAgICAgICAud2l0aENsb2Nrd2lzZSghY2VudGVyQXJjLmNsb2Nrd2lzZSlcbiAgICAgICAgLmRyYXcoKTtcbiAgICB9XG4gIH07XG4gIGNvbnRleHQucmVzdG9yZSgpO1xuXG4gIC8vIENlbnRlciBlbmQgc2VnbWVudFxuICBpZiAoIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgY2VudGVyQXJjLmVuZFNlZ21lbnQoKS5yZXZlcnNlKCkud2l0aExlbmd0aFJhdGlvKDEvMikuZHJhdygpO1xuICB9XG5cbiAgLy8gU3RhcnQgcG9pbnQgbWFya2VyXG4gIGxldCBzdGFydFBvaW50ID0gYXJjLnN0YXJ0UG9pbnQoKTtcbiAgc3RhcnRQb2ludFxuICAgIC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcbiAgc3RhcnRQb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhcmMuc3RhcnQsIG1hcmtlclJhZGl1cylcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKC1tYXJrZXJSYWRpdXMvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIE9yaWVudGF0aW9uIG1hcmtlclxuICBsZXQgb3JpZW50YXRpb25MZW5ndGggPSBtYXJrZXJSYWRpdXMqMjtcbiAgbGV0IG9yaWVudGF0aW9uQXJjID0gYXJjXG4gICAgLnN0YXJ0U2VnbWVudCgpXG4gICAgLndpdGhMZW5ndGhBZGQobWFya2VyUmFkaXVzKVxuICAgIC5hcmMobnVsbCwgYXJjLmNsb2Nrd2lzZSlcbiAgICAud2l0aExlbmd0aChvcmllbnRhdGlvbkxlbmd0aClcbiAgICAuZHJhdygpO1xuICBsZXQgYXJyb3dDZW50ZXIgPSBvcmllbnRhdGlvbkFyY1xuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aChtYXJrZXJSYWRpdXMvMilcbiAgICAuY2hvcmRTZWdtZW50KCk7XG4gIGxldCBhcnJvd0FuZ2xlID0gMy8zMjtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoLWFycm93QW5nbGUpLmRyYXcoKTtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZSkuZHJhdygpO1xuXG4gIC8vIEludGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IGVuZFBvaW50ID0gYXJjLmVuZFBvaW50KCk7XG4gIGxldCBpbnRlcm5hbExlbmd0aCA9IE1hdGgubWluKG1hcmtlclJhZGl1cy8yLCBhcmMucmFkaXVzKTtcbiAgaW50ZXJuYWxMZW5ndGggLT0gcG9pbnRSYWRpdXM7XG4gIGlmIChpbnRlcm5hbExlbmd0aCA+IHJhYy5lcXVhbGl0eVRocmVzaG9sZCkge1xuICAgIGVuZFBvaW50XG4gICAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZC5pbnZlcnNlKCksIGludGVybmFsTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIEV4dGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IHRleHRKb2luVGhyZXNob2xkID0gbWFya2VyUmFkaXVzKjM7XG4gIGxldCBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID0gb3JpZW50YXRpb25BcmNcbiAgICAud2l0aEVuZChhcmMuZW5kKVxuICAgIC5sZW5ndGgoKTtcbiAgbGV0IGV4dGVybmFsTGVuZ3RoID0gbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkICYmIGRyYXdzVGV4dCA9PT0gdHJ1ZVxuICAgID8gbWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXNcbiAgICA6IG1hcmtlclJhZGl1cy8yIC0gcG9pbnRSYWRpdXM7XG5cbiAgZW5kUG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZCwgZXh0ZXJuYWxMZW5ndGgpXG4gICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRW5kIHBvaW50IGxpdHRsZSBhcmNcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGVuZFBvaW50XG4gICAgICAuYXJjKHBvaW50UmFkaXVzLCBhcmMuZW5kLCBhcmMuZW5kLmludmVyc2UoKSwgYXJjLmNsb2Nrd2lzZSlcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgbGV0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG5cbiAgbGV0IGhlYWRWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLnRvcFxuICAgIDogdkVudW0uYm90dG9tO1xuICBsZXQgdGFpbFZlcnRpY2FsID0gYXJjLmNsb2Nrd2lzZVxuICAgID8gdkVudW0uYm90dG9tXG4gICAgOiB2RW51bS50b3A7XG4gIGxldCByYWRpdXNWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLmJvdHRvbVxuICAgIDogdkVudW0udG9wO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgaGVhZEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgaGVhZFZlcnRpY2FsLFxuICAgIGFyYy5zdGFydCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgdGFpbEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgdGFpbFZlcnRpY2FsLFxuICAgIGFyYy5lbmQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IHJhZGl1c0Zvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgcmFkaXVzVmVydGljYWwsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG5cbiAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5zdGFydCkpIHtcbiAgICBoZWFkRm9ybWF0ID0gaGVhZEZvcm1hdC5yZXZlcnNlKCk7XG4gICAgcmFkaXVzRm9ybWF0ID0gcmFkaXVzRm9ybWF0LnJldmVyc2UoKTtcbiAgfVxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5lbmQpKSB7XG4gICAgdGFpbEZvcm1hdCA9IHRhaWxGb3JtYXQucmV2ZXJzZSgpO1xuICB9XG5cbiAgbGV0IHN0YXJ0U3RyaW5nID0gYHN0YXJ0OiR7YXJjLnN0YXJ0LnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCByYWRpdXNTdHJpbmcgPSBgcmFkaXVzOiR7YXJjLnJhZGl1cy50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IGVuZFN0cmluZyA9IGBlbmQ6JHthcmMuZW5kLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhcmMuYW5nbGVEaXN0YW5jZSgpO1xuICBsZXQgZGlzdGFuY2VTdHJpbmcgPSBgZGlzdGFuY2U6JHthbmdsZURpc3RhbmNlLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IHRhaWxTdHJpbmcgPSBgJHtkaXN0YW5jZVN0cmluZ31cXG4ke2VuZFN0cmluZ31gO1xuICBsZXQgaGVhZFN0cmluZztcblxuICAvLyBSYWRpdXMgbGFiZWxcbiAgaWYgKGFuZ2xlRGlzdGFuY2UudHVybiA8PSAzLzQgJiYgIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgLy8gUmFkaXVzIGRyYXduIHNlcGFyYXRlbHlcbiAgICBsZXQgcGVycEFuZ2xlID0gYXJjLnN0YXJ0LnBlcnBlbmRpY3VsYXIoIWFyYy5jbG9ja3dpc2UpO1xuICAgIGFyYy5jZW50ZXJcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMpXG4gICAgICAucG9pbnRUb0FuZ2xlKHBlcnBBbmdsZSwgcG9pbnRSYWRpdXMqMilcbiAgICAgIC50ZXh0KHJhZGl1c1N0cmluZywgcmFkaXVzRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBoZWFkU3RyaW5nID0gc3RhcnRTdHJpbmc7XG4gIH0gZWxzZSB7XG4gICAgLy8gUmFkaXVzIGpvaW5lZCB0byBoZWFkXG4gICAgaGVhZFN0cmluZyA9IGAke3N0YXJ0U3RyaW5nfVxcbiR7cmFkaXVzU3RyaW5nfWA7XG4gIH1cblxuICBpZiAobGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkKSB7XG4gICAgLy8gRHJhdyBzdHJpbmdzIHNlcGFyYXRlbHlcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KGhlYWRTdHJpbmcsIGhlYWRGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICAgIG9yaWVudGF0aW9uQXJjLnBvaW50QXRBbmdsZShhcmMuZW5kKVxuICAgICAgLnBvaW50VG9BbmdsZShhcmMuZW5kLCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KHRhaWxTdHJpbmcsIHRhaWxGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIERyYXcgc3RyaW5ncyB0b2dldGhlclxuICAgIGxldCBhbGxTdHJpbmdzID0gYCR7aGVhZFN0cmluZ31cXG4ke3RhaWxTdHJpbmd9YDtcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KGFsbFN0cmluZ3MsIGhlYWRGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9XG59OyAvLyBkZWJ1Z0FyY1xuXG5cbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgQmV6aWVyXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIENvbXBvc2l0ZVxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBTaGFwZVxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBUZXh0XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG5leHBvcnRzLmRyYXdQb2ludCA9IGZ1bmN0aW9uKGRyYXdlciwgcG9pbnQpIHtcbiAgZHJhd2VyLnA1LnBvaW50KHBvaW50LngsIHBvaW50LnkpO1xufTsgLy8gZHJhd1BvaW50XG5cblxuZXhwb3J0cy5kcmF3UmF5ID0gZnVuY3Rpb24oZHJhd2VyLCByYXkpIHtcbiAgbGV0IGVkZ2VQb2ludCA9IHJheS5wb2ludEF0Q2FudmFzRWRnZSgpO1xuXG4gIGlmIChlZGdlUG9pbnQgPT09IG51bGwpIHtcbiAgICAvLyBSYXkgaXMgb3V0c2lkZSBjYW52YXNcbiAgICByZXR1cm47XG4gIH1cblxuICBkcmF3ZXIucDUubGluZShcbiAgICByYXkuc3RhcnQueCwgcmF5LnN0YXJ0LnksXG4gICAgZWRnZVBvaW50LngsIGVkZ2VQb2ludC55KTtcbn07IC8vIGRyYXdSYXlcblxuXG5leHBvcnRzLmRyYXdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50KSB7XG4gIGNvbnN0IHN0YXJ0ID0gc2VnbWVudC5yYXkuc3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHNlZ21lbnQuZW5kUG9pbnQoKTtcbiAgZHJhd2VyLnA1LmxpbmUoXG4gICAgc3RhcnQueCwgc3RhcnQueSxcbiAgICBlbmQueCwgICBlbmQueSk7XG59OyAvLyBkcmF3U2VnbWVudFxuXG5cbmV4cG9ydHMuZHJhd0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjKSB7XG4gIGlmIChhcmMuaXNDaXJjbGUoKSkge1xuICAgIGxldCBzdGFydFJhZCA9IGFyYy5zdGFydC5yYWRpYW5zKCk7XG4gICAgbGV0IGVuZFJhZCA9IHN0YXJ0UmFkICsgUmFjLlRBVTtcbiAgICBkcmF3ZXIucDUuYXJjKFxuICAgICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgICBhcmMucmFkaXVzICogMiwgYXJjLnJhZGl1cyAqIDIsXG4gICAgICBzdGFydFJhZCwgZW5kUmFkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgc3RhcnQgPSBhcmMuc3RhcnQ7XG4gIGxldCBlbmQgPSBhcmMuZW5kO1xuICBpZiAoIWFyYy5jbG9ja3dpc2UpIHtcbiAgICBzdGFydCA9IGFyYy5lbmQ7XG4gICAgZW5kID0gYXJjLnN0YXJ0O1xuICB9XG5cbiAgZHJhd2VyLnA1LmFyYyhcbiAgICBhcmMuY2VudGVyLngsIGFyYy5jZW50ZXIueSxcbiAgICBhcmMucmFkaXVzICogMiwgYXJjLnJhZGl1cyAqIDIsXG4gICAgc3RhcnQucmFkaWFucygpLCBlbmQucmFkaWFucygpKTtcbn07IC8vIGRyYXdBcmNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbG9yIHdpdGggUkJHQSB2YWx1ZXMsIGVhY2ggb25lIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuKlxuKiAjIyMgYGluc3RhbmNlLkNvbG9yYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkNvbG9yYCBmdW5jdGlvbl17QGxpbmsgUmFjI0NvbG9yfSB0byBjcmVhdGUgYENvbG9yYCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5Db2xvci5yZWRgXXtAbGluayBpbnN0YW5jZS5Db2xvciNyZWR9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5Db2xvcmBde0BsaW5rIGluc3RhbmNlLkNvbG9yfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiAvLyBuZXcgaW5zdGFuY2Ugd2l0aCBjb25zdHJ1Y3RvclxuKiBsZXQgY29sb3IgPSBuZXcgUmFjLkNvbG9yKHJhYywgMC4yLCAwLjQsIDAuNilcbiogLy8gb3IgY29udmVuaWVuY2UgZnVuY3Rpb25cbiogbGV0IG90aGVyQ29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbipcbiogQHNlZSBbYHJhYy5Db2xvcmBde0BsaW5rIFJhYyNDb2xvcn1cbiogQHNlZSBbYGluc3RhbmNlLkNvbG9yYF17QGxpbmsgaW5zdGFuY2UuQ29sb3J9XG4qXG4qIEBhbGlhcyBSYWMuQ29sb3JcbiovXG5jbGFzcyBDb2xvciB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbYT0xXSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgciwgZywgYiwgYSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHIsIGcsIGIsIGEpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSByZWQgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuciA9IHI7XG5cbiAgICAvKipcbiAgICAqIFRoZSBncmVlbiBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5nID0gZztcblxuICAgIC8qKlxuICAgICogVGhlIGJsdWUgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge051bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYiA9IGI7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbHBoYSBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5hID0gYTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYENvbG9yKCR7dGhpcy5yfSwke3RoaXMuZ30sJHt0aGlzLmJ9LCR7dGhpcy5hfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2Ugd2l0aCBlYWNoIGNoYW5uZWwgcmVjZWl2ZWQgaW4gdGhlXG4gICogKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IFthPTI1NV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgc3RhdGljIGZyb21SZ2JhKHJhYywgciwgZywgYiwgYSA9IDI1NSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IocmFjLCByLzI1NSwgZy8yNTUsIGIvMjU1LCBhLzI1NSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IGRpZ2l0cyBhbmQgY2FuIG9wdGlvbmFsbHkgc3RhcnRcbiAgKiB3aXRoIGAjYC4gYEFBQkJDQ2AgYW5kIGAjRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMsIHRoZSB0aHJlZSBkaWdpdFxuICAqIHNob3J0aGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgaGV4U3RyaW5nYCBpcyBtaXNmb3JtYXR0ZWQgb3IgY2Fubm90IGJlIHBhcnNlZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIFJHQiBoZXggdHJpcGxldCB0byBpbnRlcnByZXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHN0YXRpYyBmcm9tSGV4KHJhYywgaGV4U3RyaW5nKSB7XG4gICAgaWYgKGhleFN0cmluZy5jaGFyQXQoMCkgPT0gJyMnKSB7XG4gICAgICBoZXhTdHJpbmcgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGlmIChoZXhTdHJpbmcubGVuZ3RoICE9IDYpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgVW5leHBlY3RlZCBsZW5ndGggZm9yIGhleCB0cmlwbGV0IHN0cmluZzogJHtoZXhTdHJpbmd9YCk7XG4gICAgfVxuXG4gICAgbGV0IHJTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDAsIDIpO1xuICAgIGxldCBnU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZygyLCA0KTtcbiAgICBsZXQgYlN0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoNCwgNik7XG5cbiAgICBsZXQgbmV3UiA9IHBhcnNlSW50KHJTdHIsIDE2KTtcbiAgICBsZXQgbmV3RyA9IHBhcnNlSW50KGdTdHIsIDE2KTtcbiAgICBsZXQgbmV3QiA9IHBhcnNlSW50KGJTdHIsIDE2KTtcblxuICAgIGlmIChpc05hTihuZXdSKSB8fCBpc05hTihuZXdHKSB8fCBpc05hTihuZXdCKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBDb3VsZCBub3QgcGFyc2UgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgbmV3Ui8yNTUsIG5ld0cvMjU1LCBuZXdCLzI1NSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEZpbGxgIHRoYXQgdXNlcyBgdGhpc2AgYXMgYGNvbG9yYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuRmlsbH1cbiAgKi9cbiAgZmlsbCgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMucmFjLCB0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB0aGF0IHVzZXMgYHRoaXNgIGFzIGBjb2xvcmAuXG4gICpcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IHdlaWdodCAtIFRoZSB3ZWlnaHQgb2YgdGhlIG5ldyBgU3Ryb2tlYFxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICBzdHJva2Uod2VpZ2h0ID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0cm9rZSh0aGlzLnJhYywgd2VpZ2h0LCB0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggYGFgIHNldCB0byBgbmV3QWxwaGFgLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IG5ld0FscGhhIC0gVGhlIGFscGhhIGNoYW5uZWwgZm9yIHRoZSBuZXcgYENvbG9yYCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgbmV3QWxwaGEpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBgYWAgc2V0IHRvIGB0aGlzLmEgKiByYXRpb2AuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBhYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHdpdGhBbHBoYVJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgdGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgdGhpcy5hICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgaW4gdGhlIGxpbmVhciB0cmFuc2l0aW9uIGJldHdlZW4gYHRoaXNgIGFuZFxuICAqIGB0YXJnZXRgIGF0IGEgYHJhdGlvYCBpbiB0aGUgcmFuZ2UgKlswLDFdKi5cbiAgKlxuICAqIFdoZW4gYHJhdGlvYCBpcyBgMGAgb3IgbGVzcyB0aGUgbmV3IGBDb2xvcmAgaXMgZXF1aXZhbGVudCB0byBgdGhpc2AsXG4gICogd2hlbiBgcmF0aW9gIGlzIGAxYCBvciBsYXJnZXIgdGhlIG5ldyBgQ29sb3JgIGlzIGVxdWl2YWxlbnQgdG9cbiAgKiBgdGFyZ2V0YC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIFRoZSB0cmFuc2l0aW9uIHJhdGlvIGZvciB0aGUgbmV3IGBDb2xvcmBcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcn0gdGFyZ2V0IC0gVGhlIHRyYW5zaXRpb24gdGFyZ2V0IGBDb2xvcmBcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBsaW5lYXJUcmFuc2l0aW9uKHJhdGlvLCB0YXJnZXQpIHtcbiAgICByYXRpbyA9IE1hdGgubWF4KHJhdGlvLCAwKTtcbiAgICByYXRpbyA9IE1hdGgubWluKHJhdGlvLCAxKTtcblxuICAgIGxldCBuZXdSID0gdGhpcy5yICsgKHRhcmdldC5yIC0gdGhpcy5yKSAqIHJhdGlvO1xuICAgIGxldCBuZXdHID0gdGhpcy5nICsgKHRhcmdldC5nIC0gdGhpcy5nKSAqIHJhdGlvO1xuICAgIGxldCBuZXdCID0gdGhpcy5iICsgKHRhcmdldC5iIC0gdGhpcy5iKSAqIHJhdGlvO1xuICAgIGxldCBuZXdBID0gdGhpcy5hICsgKHRhcmdldC5hIC0gdGhpcy5hKSAqIHJhdGlvO1xuXG4gICAgcmV0dXJuIG5ldyBDb2xvcih0aGlzLnJhYywgbmV3UiwgbmV3RywgbmV3QiwgbmV3QSk7XG4gIH1cblxufSAvLyBjbGFzcyBDb2xvclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XG5cbiIsIiAgJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEZpbGwgW2NvbG9yXXtAbGluayBSYWMuQ29sb3J9IGZvciBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgZmlsbC5hcHBseSgpYCB0byBhcHBseSB0aGUgZmlsbCBzZXR0aW5ncyBnbG9iYWxseSwgb3IgYXNcbiogdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhmaWxsKWAgdG8gYXBwbHkgdGhlIGZpbGwgb25seSBmb3IgdGhhdFxuKiBjYWxsLlxuKlxuKiBXaGVuIGBjb2xvcmAgaXMgYG51bGxgIGEgKm5vLWZpbGwqIHNldHRpbmcgaXMgYXBwbGllZC5cbipcbiogIyMjIGBpbnN0YW5jZS5GaWxsYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLkZpbGxgIGZ1bmN0aW9uXXtAbGluayBSYWMjRmlsbH0gdG8gY3JlYXRlIGBGaWxsYCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5GaWxsLm5vbmVgXXtAbGluayBpbnN0YW5jZS5GaWxsI25vbmV9LCBsaXN0ZWRcbiogdW5kZXIgW2BpbnN0YW5jZS5GaWxsYF17QGxpbmsgaW5zdGFuY2UuRmlsbH0uXG4qXG4qIEBleGFtcGxlXG4qIGxldCByYWMgPSBuZXcgUmFjKClcbiogbGV0IGNvbG9yID0gcmFjLkNvbG9yKDAuMiwgMC40LCAwLjYpXG4qIC8vIG5ldyBpbnN0YW5jZSB3aXRoIGNvbnN0cnVjdG9yXG4qIGxldCBmaWxsID0gbmV3IFJhYy5GaWxsKHJhYywgY29sb3IpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlckZpbGwgPSByYWMuRmlsbChjb2xvcilcbipcbiogQHNlZSBbYHJhYy5GaWxsYF17QGxpbmsgUmFjI0ZpbGx9XG4qIEBzZWUgW2BpbnN0YW5jZS5GaWxsYF17QGxpbmsgaW5zdGFuY2UuRmlsbH1cbipcbiogQGFsaWFzIFJhYy5GaWxsXG4qL1xuY2xhc3MgRmlsbCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgRmlsbGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBjb2xvciAtIEEgYENvbG9yYCBmb3IgdGhlIGZpbGwgc2V0dGluZywgb3IgYG51bGxgXG4gICogICB0byBhcHBseSBhICpuby1maWxsKiBzZXR0aW5nXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgY29sb3IpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYEZpbGxgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgRmlsbGAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgRmlsbGBcbiAgKiAgIHVzaW5nIGBzb21ldGhpbmdgIGFzIGBjb2xvcmAuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBTdHJva2VgLCByZXR1cm5zIGEgbmV3IGBGaWxsYFxuICAqICAgdXNpbmcgYHN0cm9rZS5jb2xvcmAuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGEgYEZpbGxgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEZpbGwpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuQ29sb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU3Ryb2tlKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGwocmFjLCBzb21ldGhpbmcuY29sb3IpO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuRmlsbCAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgb25seSBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgYHN0eWxlYC4gV2hlblxuICAqIGBzdHlsZWAgaXMgYG51bGxgLCByZXR1cm5zIGB0aGlzYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IHN0eWxlIC0gQSBzdHlsZSBvYmplY3RcbiAgKiAgIHRvIGNvbnRhaW4gYWxvbmcgYHRoaXNgXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcnxSYWMuRmlsbH1cbiAgKi9cbiAgYXBwZW5kU3R5bGUoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIHN0eWxlXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgdGhlIGBTdHJva2VgXG4gICogZGVyaXZlZCBbZnJvbV17QGxpbmsgUmFjLlN0cm9rZS5mcm9tfSBgc29tZVN0cm9rZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2V8UmFjLkNvbG9yfFJhYy5GaWxsfSBzb21lU3Ryb2tlIC0gQW4gb2JqZWN0IHRvIGRlcml2ZVxuICAqICAgYSBgU3Ryb2tlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKlxuICAqIEBzZWUgW2ByYWMuU3Ryb2tlLmZyb21gXXtAbGluayBSYWMuU3Ryb2tlLmZyb219XG4gICovXG4gIGFwcGVuZFN0cm9rZShzb21lU3Ryb2tlKSB7XG4gICAgbGV0IHN0cm9rZSA9IFJhYy5TdHJva2UuZnJvbSh0aGlzLnJhYywgc29tZVN0cm9rZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHJva2VdKTtcbiAgfVxuXG59IC8vIGNsYXNzIEZpbGxcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGw7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBTdHJva2Ugd2VpZ2h0IGFuZCBbY29sb3Jde0BsaW5rIFJhYy5Db2xvcn0gZm9yIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBzdHJva2UuYXBwbHkoKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBzZXR0aW5ncyBnbG9iYWxseSwgb3JcbiogYXMgdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhzdHJva2UpYCB0byBhcHBseSB0aGUgc3Ryb2tlIG9ubHkgZm9yXG4qIHRoYXQgYGRyYXdgLlxuKlxuKiBBcHBseWluZyB0aGUgaW5zdGFuY2UgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBiZWhhdmlvdXJzOlxuKiArIEFwcGxpZXMgYSAqKm5vLXN0cm9rZSoqIHNldHRpbmc7IHdoZW4gYGNvbG9yID0gbnVsbGAgYW5kIGB3ZWlnaHQgPSBudWxsYFxuKiArIEFwcGxpZXMgKipvbmx5IHN0cm9rZSBjb2xvcioqLCBsZWF2aW5nIHdlaWdodCB1bmNoYW5nZWQ7IHdoZW4gYGNvbG9yYFxuKiAgIGlzIHNldCBhbmQgYHdlaWdodCA9IG51bGxgXG4qICsgQXBwbGllcyAqKm9ubHkgc3Ryb2tlIHdlaWdodCoqLCBsZWF2aW5nIGNvbG9yIHVuY2hhbmdlZDsgd2hlbiBgd2VpZ2h0YFxuKiAgIGlzIHNldCBhbmQgYGNvbG9yID0gbnVsbGBcbiogKyBBcHBsaWVzICoqYm90aCB3ZWlnaHQgYW5kIGNvbG9yKio7IHdoZW4gYm90aCBgY29sb3JgIGFuZCBgd2VpZ2h0YCBhcmUgc2V0XG4qXG4qICMjIyBgaW5zdGFuY2UuU3Ryb2tlYFxuKlxuKiBJbnN0YW5jZXMgb2YgYFJhY2AgY29udGFpbiBhIGNvbnZlbmllbmNlXG4qIFtgcmFjLlN0cm9rZWAgZnVuY3Rpb25de0BsaW5rIFJhYyNTdHJva2V9IHRvIGNyZWF0ZSBgU3Ryb2tlYCBvYmplY3RzIHdpdGhcbiogZmV3ZXIgcGFyYW1ldGVycy4gVGhpcyBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIHJlYWR5LW1hZGUgY29udmVuaWVuY2Vcbiogb2JqZWN0cywgbGlrZSBbYHJhYy5TdHJva2Uubm9uZWBde0BsaW5rIGluc3RhbmNlLlN0cm9rZSNub25lfSwgbGlzdGVkXG4qIHVuZGVyIFtgaW5zdGFuY2UuU3Ryb2tlYF17QGxpbmsgaW5zdGFuY2UuU3Ryb2tlfS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiBsZXQgY29sb3IgPSByYWMuQ29sb3IoMC4yLCAwLjQsIDAuNilcbiogLy8gbmV3IGluc3RhbmNlIHdpdGggY29uc3RydWN0b3JcbiogbGV0IHN0cm9rZSA9IG5ldyBSYWMuU3Ryb2tlKHJhYywgMiwgY29sb3IpXG4qIC8vIG9yIGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4qIGxldCBvdGhlclN0cm9rZSA9IHJhYy5TdHJva2UoMiwgY29sb3IpXG4qXG4qIEBzZWUgW2ByYWMuU3Ryb2tlYF17QGxpbmsgUmFjI1N0cm9rZX1cbiogQHNlZSBbYGluc3RhbmNlLlN0cm9rZWBde0BsaW5rIGluc3RhbmNlLlN0cm9rZX1cbipcbiogQGFsaWFzIFJhYy5TdHJva2VcbiovXG5jbGFzcyBTdHJva2Uge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFN0cm9rZWAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7P051bWJlcn0gd2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgc3Ryb2tlLCBvciBgbnVsbGAgdG8gc2tpcCB3ZWlnaHRcbiAgKiBAcGFyYW0gez9SYWMuQ29sb3J9IFtjb2xvcj1udWxsXSAtIEEgYENvbG9yYCBmb3IgdGhlIHN0cm9rZSwgb3IgYG51bGxgXG4gICogICB0byBza2lwIGNvbG9yXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgd2VpZ2h0LCBjb2xvciA9IG51bGwpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB3ZWlnaHQgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0TnVtYmVyKHdlaWdodCk7XG4gICAgY29sb3IgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQ29sb3IsIGNvbG9yKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjXG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMud2VpZ2h0ID0gd2VpZ2h0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFN0cm9rZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBTdHJva2VgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBDb2xvcmAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWBcbiAgKiAgIHVzaW5nIGBzb21ldGhpbmdgIGFzIGBjb2xvcmAgYW5kIGEgYG51bGxgIHN0cm9rZSB3ZWlnaHQuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBGaWxsYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYFxuICAqICAgdXNpbmcgYGZpbGwuY29sb3JgIGFuZCBhIGBudWxsYCBzdHJva2Ugd2VpZ2h0LlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlN0cm9rZXxSYWMuQ29sb3J8UmFjLkZpbGx9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqICAgZGVyaXZlIGEgYFN0cm9rZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICBzdGF0aWMgZnJvbShyYWMsIHNvbWV0aGluZykge1xuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBTdHJva2UpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuQ29sb3IpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHJhYywgbnVsbCwgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5GaWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0cm9rZShyYWMsIG51bGwsIHNvbWV0aGluZy5jb2xvcik7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5TdHJva2UgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgd2l0aCBgd2VpZ2h0YCBzZXQgdG8gYG5ld1dlaWdodGAuXG4gICpcbiAgKiBAcGFyYW0gez9OdW1iZXJ9IG5ld1dlaWdodCAtIFRoZSB3ZWlnaHQgb2YgdGhlIHN0cm9rZSwgb3IgYG51bGxgIHRvIHNraXBcbiAgKiAgIHdlaWdodFxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICB3aXRoV2VpZ2h0KG5ld1dlaWdodCkge1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCBuZXdXZWlnaHQsIHRoaXMuY29sb3IsKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB3aXRoIGEgY29weSBvZiBgY29sb3JgIHNldHVwIHdpdGggYG5ld0FscGhhYCxcbiAgKiBhbmQgdGhlIHNhbWUgYHN0cm9rZWAgYXMgYHRoaXNgLlxuICAqXG4gICogV2hlbiBgdGhpcy5jb2xvcmAgaXMgc2V0IHRvIGBudWxsYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB0aGF0IGlzIGFcbiAgKiBjb3B5IG9mIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSBuZXdBbHBoYSAtIFRoZSBhbHBoYSBjaGFubmVsIG9mIHRoZSBgY29sb3JgIG9mIHRoZSBuZXdcbiAgKiAgIGBTdHJva2VgXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHdpdGhBbHBoYShuZXdBbHBoYSkge1xuICAgIGlmICh0aGlzLmNvbG9yID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgdGhpcy53ZWlnaHQsIG51bGwpO1xuICAgIH1cblxuICAgIGxldCBuZXdDb2xvciA9IHRoaXMuY29sb3Iud2l0aEFscGhhKG5ld0FscGhhKTtcbiAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgdGhpcy53ZWlnaHQsIG5ld0NvbG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgb25seSBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgYHN0eWxlYC4gV2hlblxuICAqIGBzdHlsZWAgaXMgYG51bGxgLCByZXR1cm5zIGB0aGlzYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IHN0eWxlIC0gQSBzdHlsZSBvYmplY3RcbiAgKiAgIHRvIGNvbnRhaW4gYWxvbmcgYHRoaXNgXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcnxSYWMuU3Ryb2tlfVxuICAqL1xuICBhcHBlbmRTdHlsZShzdHlsZSkge1xuICAgIGlmIChzdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgc3R5bGVdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCB0aGUgYEZpbGxgXG4gICogZGVyaXZlZCBbZnJvbV17QGxpbmsgUmFjLkZpbGwuZnJvbX0gYHNvbWVGaWxsYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkZpbGx8UmFjLkNvbG9yfFJhYy5TdHJva2V9IHNvbWVGaWxsIC0gQW4gb2JqZWN0IHRvIGRlcml2ZVxuICAqICAgYSBgRmlsbGAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICpcbiAgKiBAc2VlIFtgcmFjLkZpbGwuZnJvbWBde0BsaW5rIFJhYy5GaWxsLmZyb219XG4gICovXG4gIGFwcGVuZEZpbGwoc29tZUZpbGwpIHtcbiAgICBsZXQgZmlsbCA9IFJhYy5GaWxsLmZyb20odGhpcy5yYWMsIHNvbWVGaWxsKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIGZpbGxdKTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0cm9rZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3Ryb2tlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udGFpbmVyIG9mIGBbU3Ryb2tlXXtAbGluayBSYWMuU3Ryb2tlfWAgYW5kIGBbRmlsbF17QGxpbmsgUmFjLkZpbGx9YFxuKiBvYmplY3RzIHdoaWNoIGdldCBhcHBsaWVkIHNlcXVlbnRpYWxseSB3aGVuIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBjb250YWluZXIuYXBwbHkoKWAgdG8gYXBwbHkgdGhlIGNvbnRhaW5lZCBzdHlsZXNcbiogZ2xvYmFsbHksIG9yIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoY29udGFpbmVyKWAgdG8gYXBwbHkgdGhlXG4qIHN0eWxlIHNldHRpbmdzIG9ubHkgZm9yIHRoYXQgYGRyYXdgLlxuKlxuKiBAYWxpYXMgUmFjLlN0eWxlQ29udGFpbmVyXG4qL1xuY2xhc3MgU3R5bGVDb250YWluZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3R5bGVzID0gW10pIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBDb250YWluZXIgb2Ygc3R5bGUgb2JqZWN0cyB0byBhcHBseS5cbiAgICAqXG4gICAgKiBDYW4gYmUgbWFuaXB1bGF0ZWQgZGlyZWN0bHkgdG8gYWRkIG9yIHJlbW92ZSBzdHlsZXMgZnJvbSBgdGhpc2AuXG4gICAgKiBNb3N0IG9mIHRoZSBpbXBsZW1lbnRlZCBtZXRob2RzIGxpa2VcbiAgICAqIGBbYWRkXXtAbGluayBSYWMuU3R5bGVDb250YWluZXIjYWRkfWAgcmV0dXJuIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmBcbiAgICAqIHdpdGggYW4gY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAgICpcbiAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAqL1xuICAgIHRoaXMuc3R5bGVzID0gc3R5bGVzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCBjb250ZW50cyA9IHRoaXMuc3R5bGVzLmpvaW4oJyAnKTtcbiAgICByZXR1cm4gYFN0eWxlQ29udGFpbmVyKCR7Y29udGVudHN9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGEgY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCB0aGlzLnN0eWxlcy5zbGljZSgpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIHdpdGggYHN0eWxlYCBhcHBlbmRlZCBhdCB0aGUgZW5kIG9mXG4gICogYHN0eWxlc2AuIFdoZW4gYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBgdGhpc2AgaXMgbm90IG1vZGlmaWVkIGJ5IHRoaXMgbWV0aG9kLCB0aGUgbmV3IGBTdHlsZUNvbnRhaW5lcmAgaXNcbiAgKiBjcmVhdGVkIHdpdGggYSBjb3B5IG9mIGB0aGlzLnN0eWxlc2AuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gYXBwZW5kIHRvIGBzdHlsZXNgXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgYXBwZW5kU3R5bGUoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzdHlsZXNDb3B5ID0gdGhpcy5zdHlsZXMuc2xpY2UoKTtcbiAgICBzdHlsZXNDb3B5LnB1c2goc3R5bGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBzdHlsZXNDb3B5KTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0eWxlQ29udGFpbmVyXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHlsZUNvbnRhaW5lcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5Db2xvcmAgZnVuY3Rpb25de0BsaW5rIFJhYyNDb2xvcn0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgQ29sb3JgXXtAbGluayBSYWMuQ29sb3J9IG9iamVjdHMgZm9yIHVzdWFsIHZhbHVlcywgYWxsIHNldHVwIHdpdGggdGhlXG4qIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQGV4YW1wbGVcbiogbGV0IHJhYyA9IG5ldyBSYWMoKVxuKiByYWMuQ29sb3IucmVkIC8vIHJlYWR5LW1hZGUgcmVkIGNvbG9yXG4qIHJhYy5Db2xvci5yZWQucmFjID09PSByYWMgLy8gdHJ1ZVxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkNvbG9yXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNDb2xvcihyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGVhY2ggY2hhbm5lbCByZWNlaXZlZCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlLlxuICAqXG4gICogQHBhcmFtIHtOdW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge051bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtOdW1iZXJ9IFthPTI1NV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tUmdiYVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLmZyb21SZ2JhID0gZnVuY3Rpb24ociwgZywgYiwgYSA9IDI1NSkge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IGRpZ2l0cyBhbmQgY2FuIG9wdGlvbmFsbHkgc3RhcnRcbiAgKiB3aXRoIGAjYC4gYEFBQkJDQ2AgYW5kIGAjRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMsIHRoZSB0aHJlZSBkaWdpdFxuICAqIHNob3J0aGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgaGV4U3RyaW5nYCBpcyBtaXNmb3JtYXR0ZWQgb3IgY2Fubm90IGJlIHBhcnNlZC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBoZXhTdHJpbmcgLSBUaGUgUkdCIGhleCB0cmlwbGV0IHRvIGludGVycHJldFxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHJhYy5Db2xvci5mcm9tSGV4ID0gZnVuY3Rpb24oaGV4U3RyaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tSGV4KHJhYywgaGV4U3RyaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQSBibGFjayBgQ29sb3JgLlxuICAqXG4gICogQG5hbWUgYmxhY2tcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5ibGFjayAgID0gcmFjLkNvbG9yKDAsIDAsIDApO1xuXG4gIC8qKlxuICAqIEEgcmVkIGBDb2xvcmAuXG4gICpcbiAgKiBAbmFtZSByZWRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5yZWQgICAgID0gcmFjLkNvbG9yKDEsIDAsIDApO1xuXG4gIHJhYy5Db2xvci5ncmVlbiAgID0gcmFjLkNvbG9yKDAsIDEsIDApO1xuICByYWMuQ29sb3IuYmx1ZSAgICA9IHJhYy5Db2xvcigwLCAwLCAxKTtcbiAgcmFjLkNvbG9yLnllbGxvdyAgPSByYWMuQ29sb3IoMSwgMSwgMCk7XG4gIHJhYy5Db2xvci5tYWdlbnRhID0gcmFjLkNvbG9yKDEsIDAsIDEpO1xuICByYWMuQ29sb3IuY3lhbiAgICA9IHJhYy5Db2xvcigwLCAxLCAxKTtcbiAgcmFjLkNvbG9yLndoaXRlICAgPSByYWMuQ29sb3IoMSwgMSwgMSk7XG5cbn0gLy8gYXR0YWNoUmFjQ29sb3JcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBNZW1iZXJzIGFuZCBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZVxuKiBbYHJhYy5GaWxsYCBmdW5jdGlvbl17QGxpbmsgUmFjI0ZpbGx9LlxuKlxuKiBUaGUgZnVuY3Rpb24gY29udGFpbnMgcmVhZHktbWFkZSBjb252ZW5pZW5jZVxuKiBbYEZpbGxgXXtAbGluayBSYWMuRmlsbH0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5GaWxsLm5vbmUgLy8gcmVhZHktbWFkZSBub25lIGZpbGxcbiogcmFjLkZpbGwubm9uZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuRmlsbFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjRmlsbChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBGaWxsYCB3aXRob3V0IGNvbG9yLiBSZW1vdmVzIHRoZSBmaWxsIGNvbG9yIHdoZW4gYXBwbGllZC5cbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkZpbGwjXG4gICovXG4gIHJhYy5GaWxsLm5vbmUgPSByYWMuRmlsbChudWxsKTtcblxufSAvLyBhdHRhY2hSYWNGaWxsXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogTWVtYmVycyBhbmQgbWV0aG9kcyBhdHRhY2hlZCB0byB0aGVcbiogW2ByYWMuU3Ryb2tlYCBmdW5jdGlvbl17QGxpbmsgUmFjI1N0cm9rZX0uXG4qXG4qIFRoZSBmdW5jdGlvbiBjb250YWlucyByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIFtgU3Ryb2tlYF17QGxpbmsgUmFjLlN0cm9rZX0gb2JqZWN0cyBmb3IgdXN1YWwgdmFsdWVzLCBhbGwgc2V0dXAgd2l0aCB0aGVcbiogb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAZXhhbXBsZVxuKiBsZXQgcmFjID0gbmV3IFJhYygpXG4qIHJhYy5TdHJva2Uubm9uZSAvLyByZWFkeS1tYWRlIG5vbmUgc3Ryb2tlXG4qIHJhYy5TdHJva2Uubm9uZS5yYWMgPT09IHJhYyAvLyB0cnVlXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU3Ryb2tlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNTdHJva2UocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRoIG5vIHdlaWdodCBhbmQgbm8gY29sb3IuIFVzaW5nIG9yIGFwcGx5aW5nIHRoaXMgc3Ryb2tlXG4gICogd2lsbCBkaXNhYmxlIHN0cm9rZSBkcmF3aW5nLlxuICAqXG4gICogQG5hbWUgbm9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uubm9uZSA9IHJhYy5TdHJva2UobnVsbCk7XG5cblxuICAvKipcbiAgKiBBIGBTdHJva2VgIHdpdGggYHdlaWdodCA9IDFgIGFuZCBubyBjb2xvci4gVXNpbmcgb3IgYXBwbHlpbmcgdGhpc1xuICAqIHN0cm9rZSB3aWxsIG9ubHkgc2V0IHRoZSBzdHJva2Ugd2VpZ2h0IHRvIGAxYCBsZWF2aW5nIHN0cm9rZSBjb2xvclxuICAqIHVuY2hhbmdlZC5cbiAgKlxuICAqIEBuYW1lIG9uZVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TdHJva2UjXG4gICovXG4gIHJhYy5TdHJva2Uub25lID0gcmFjLlN0cm9rZSgxKTtcblxufSAvLyBhdHRhY2hSYWNTdHJva2VcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gSW1wbGVtZW50YXRpb24gb2YgYW4gZWFzZSBmdW5jdGlvbiB3aXRoIHNldmVyYWwgb3B0aW9ucyB0byB0YWlsb3IgaXRzXG4vLyBiZWhhdmlvdXIuIFRoZSBjYWxjdWxhdGlvbiB0YWtlcyB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuLy8gVmFsdWUgaXMgcmVjZWl2ZWQsIHByZWZpeCBpcyByZW1vdmVkXG4vLyAgIFZhbHVlIC0+IGVhc2VWYWx1ZSh2YWx1ZSlcbi8vICAgICB2YWx1ZSA9IHZhbHVlIC0gcHJlZml4XG4vLyBSYXRpbyBpcyBjYWxjdWxhdGVkXG4vLyAgIHJhdGlvID0gdmFsdWUgLyBpblJhbmdlXG4vLyBSYXRpbyBpcyBhZGp1c3RlZFxuLy8gICByYXRpbyAtPiBlYXNlUmF0aW8ocmF0aW8pXG4vLyAgICAgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHJhdGlvT2ZzZXQpICogcmF0aW9GYWN0b3Jcbi8vIEVhc2UgaXMgY2FsY3VsYXRlZFxuLy8gICBlYXNlZFJhdGlvID0gZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbylcbi8vIEVhc2VkUmF0aW8gaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkUmF0aW8gPSAoZWFzZWRSYXRpbyArIGVhc2VPZnNldCkgKiBlYXNlRmFjdG9yXG4vLyAgIGVhc2VSYXRpbyhyYXRpbykgLT4gZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgcHJvamVjdGVkXG4vLyAgIGVhc2VkVmFsdWUgPSB2YWx1ZSAqIGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFZhbHVlID0gcHJlZml4ICsgKGVhc2VkVmFsdWUgKiBvdXRSYW5nZSlcbi8vICAgZWFzZVZhbHVlKHZhbHVlKSAtPiBlYXNlZFZhbHVlXG5jbGFzcyBFYXNlRnVuY3Rpb24ge1xuXG4gIC8vIEJlaGF2aW9ycyBmb3IgdGhlIGBlYXNlVmFsdWVgIGZ1bmN0aW9uIHdoZW4gYHZhbHVlYCBmYWxscyBiZWZvcmUgdGhlXG4gIC8vIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gIHN0YXRpYyBCZWhhdmlvciA9IHtcbiAgICAvLyBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgYW55IGVhc2luZyB0cmFuc2Zvcm1hdGlvbi4gYHByZUZhY3RvcmBcbiAgICAvLyBhbmQgYHBvc3RGYWN0b3JgIGFyZSBhcHBsaWVkLiBUaGlzIGlzIHRoZSBkZWZhdWx0IGNvbmZpZ3VyYXRpb24uXG4gICAgcGFzczogXCJwYXNzXCIsXG4gICAgLy8gQ2xhbXBzIHRoZSByZXR1cm5lZCB2YWx1ZSB0byBgcHJlZml4YCBvciBgcHJlZml4K2luUmFuZ2VgO1xuICAgIGNsYW1wOiBcImNsYW1wXCIsXG4gICAgLy8gUmV0dXJucyB0aGUgYXBwbGllZCBlYXNpbmcgdHJhbnNmb3JtYXRpb24gdG8gYHZhbHVlYCBmb3IgdmFsdWVzXG4gICAgLy8gYmVmb3JlIGBwcmVmaXhgIGFuZCBhZnRlciBgaW5SYW5nZWAuXG4gICAgY29udGludWU6IFwiY29udGludWVcIlxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYSA9IDI7XG5cbiAgICAvLyBBcHBsaWVkIHRvIHJhdGlvIGJlZm9yZSBlYXNpbmcuXG4gICAgdGhpcy5yYXRpb09mZnNldCA9IDBcbiAgICB0aGlzLnJhdGlvRmFjdG9yID0gMTtcblxuICAgIC8vIEFwcGxpZWQgdG8gZWFzZWRSYXRpby5cbiAgICB0aGlzLmVhc2VPZmZzZXQgPSAwXG4gICAgdGhpcy5lYXNlRmFjdG9yID0gMTtcblxuICAgIC8vIERlZmluZXMgdGhlIGxvd2VyIGxpbWl0IG9mIGB2YWx1ZWBgIHRvIGFwcGx5IGVhc2luZy5cbiAgICB0aGlzLnByZWZpeCA9IDA7XG5cbiAgICAvLyBgdmFsdWVgIGlzIHJlY2VpdmVkIGluIGBpblJhbmdlYCBhbmQgb3V0cHV0IGluIGBvdXRSYW5nZWAuXG4gICAgdGhpcy5pblJhbmdlID0gMTtcbiAgICB0aGlzLm91dFJhbmdlID0gMTtcblxuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYmVmb3JlIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlQmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0QmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3IucGFzcztcblxuICAgIC8vIEZvciBhIGBwcmVCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdmFsdWVzIGJlZm9yZVxuICAgIC8vIGBwcmVmaXhgLlxuICAgIHRoaXMucHJlRmFjdG9yID0gMTtcbiAgICAvLyBGb3IgYSBgcG9zdEJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB0aGUgdmFsdWVzXG4gICAgLy8gYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RGYWN0b3IgPSAxO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBlYXNlZCB2YWx1ZSBmb3IgYHVuaXRgLiBCb3RoIHRoZSBnaXZlblxuICAvLyBgdW5pdGAgYW5kIHRoZSByZXR1cm5lZCB2YWx1ZSBhcmUgaW4gdGhlIFswLDFdIHJhbmdlLiBJZiBgdW5pdGAgaXNcbiAgLy8gb3V0c2lkZSB0aGUgWzAsMV0gdGhlIHJldHVybmVkIHZhbHVlIGZvbGxvd3MgdGhlIGN1cnZlIG9mIHRoZSBlYXNpbmdcbiAgLy8gZnVuY3Rpb24sIHdoaWNoIG1heSBiZSBpbnZhbGlkIGZvciBzb21lIHZhbHVlcyBvZiBgYWAuXG4gIC8vXG4gIC8vIFRoaXMgZnVuY3Rpb24gaXMgdGhlIGJhc2UgZWFzaW5nIGZ1bmN0aW9uLCBpdCBkb2VzIG5vdCBhcHBseSBhbnlcbiAgLy8gb2Zmc2V0cyBvciBmYWN0b3JzLlxuICBlYXNlVW5pdCh1bml0KSB7XG4gICAgLy8gU291cmNlOlxuICAgIC8vIGh0dHBzOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvMTIxNzIwL2Vhc2UtaW4tb3V0LWZ1bmN0aW9uLzEyMTc1NSMxMjE3NTVcbiAgICAvLyBmKHQpID0gKHReYSkvKHReYSsoMS10KV5hKVxuICAgIGxldCByYSA9IE1hdGgucG93KHVuaXQsIHRoaXMuYSk7XG4gICAgbGV0IGlyYSA9IE1hdGgucG93KDEtdW5pdCwgdGhpcy5hKTtcbiAgICByZXR1cm4gcmEgLyAocmEgKyBpcmEpO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZWFzZSBmdW5jdGlvbiBhcHBsaWVkIHRvIHRoZSBnaXZlbiByYXRpby4gYHJhdGlvT2Zmc2V0YFxuICAvLyBhbmQgYHJhdGlvRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgaW5wdXQsIGBlYXNlT2Zmc2V0YCBhbmRcbiAgLy8gYGVhc2VGYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBvdXRwdXQuXG4gIGVhc2VSYXRpbyhyYXRpbykge1xuICAgIGxldCBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgdGhpcy5yYXRpb09mZnNldCkgKiB0aGlzLnJhdGlvRmFjdG9yO1xuICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlVW5pdChhZGp1c3RlZFJhdGlvKTtcbiAgICByZXR1cm4gKGVhc2VkUmF0aW8gKyB0aGlzLmVhc2VPZmZzZXQpICogdGhpcy5lYXNlRmFjdG9yO1xuICB9XG5cbiAgLy8gQXBwbGllcyB0aGUgZWFzaW5nIGZ1bmN0aW9uIHRvIGB2YWx1ZWAgY29uc2lkZXJpbmcgdGhlIGNvbmZpZ3VyYXRpb25cbiAgLy8gb2YgdGhlIHdob2xlIGluc3RhbmNlLlxuICBlYXNlVmFsdWUodmFsdWUpIHtcbiAgICBsZXQgYmVoYXZpb3IgPSBFYXNlRnVuY3Rpb24uQmVoYXZpb3I7XG5cbiAgICBsZXQgc2hpZnRlZFZhbHVlID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICBsZXQgcmF0aW8gPSBzaGlmdGVkVmFsdWUgLyB0aGlzLmluUmFuZ2U7XG5cbiAgICAvLyBCZWZvcmUgcHJlZml4XG4gICAgaWYgKHZhbHVlIDwgdGhpcy5wcmVmaXgpIHtcbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAgIGxldCBkaXN0YW5jZXRvUHJlZml4ID0gdmFsdWUgLSB0aGlzLnByZWZpeDtcbiAgICAgICAgLy8gV2l0aCBhIHByZUZhY3RvciBvZiAxIHRoaXMgaXMgZXF1aXZhbGVudCB0byBgcmV0dXJuIHJhbmdlYFxuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyAoZGlzdGFuY2V0b1ByZWZpeCAqIHRoaXMucHJlRmFjdG9yKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXg7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHByZUJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwcmVCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgIH1cblxuICAgIC8vIEFmdGVyIHByZWZpeFxuICAgIGlmIChyYXRpbyA8PSAxIHx8IHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgLy8gRWFzZSBmdW5jdGlvbiBhcHBsaWVkIHdpdGhpbiByYW5nZSAob3IgYWZ0ZXIpXG4gICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIGVhc2VkUmF0aW8gKiB0aGlzLm91dFJhbmdlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgIC8vIFNoaWZ0ZWQgdG8gaGF2ZSBpblJhbmdlIGFzIG9yaWdpblxuICAgICAgbGV0IHNoaWZ0ZWRQb3N0ID0gc2hpZnRlZFZhbHVlIC0gdGhpcy5pblJhbmdlO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZSArIHNoaWZ0ZWRQb3N0ICogdGhpcy5wb3N0RmFjdG9yO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlO1xuICAgIH1cblxuICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcG9zdEJlaGF2aW9yIGNvbmZpZ3VyYXRpb24gLSBwb3N0QmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gIH1cblxuXG4gIC8vIFByZWNvbmZpZ3VyZWQgZnVuY3Rpb25zXG5cbiAgLy8gTWFrZXMgYW4gZWFzZUZ1bmN0aW9uIHByZWNvbmZpZ3VyZWQgdG8gYW4gZWFzZSBvdXQgbW90aW9uLlxuICAvL1xuICAvLyBUaGUgYG91dFJhbmdlYCB2YWx1ZSBzaG91bGQgYmUgYGluUmFuZ2UqMmAgaW4gb3JkZXIgZm9yIHRoZSBlYXNlXG4gIC8vIG1vdGlvbiB0byBjb25uZWN0IHdpdGggdGhlIGV4dGVybmFsIG1vdGlvbiBhdCB0aGUgY29ycmVjdCB2ZWxvY2l0eS5cbiAgc3RhdGljIG1ha2VFYXNlT3V0KCkge1xuICAgIGxldCBlYXNlT3V0ID0gbmV3IEVhc2VGdW5jdGlvbigpXG4gICAgZWFzZU91dC5yYXRpb09mZnNldCA9IDE7XG4gICAgZWFzZU91dC5yYXRpb0ZhY3RvciA9IC41O1xuICAgIGVhc2VPdXQuZWFzZU9mZnNldCA9IC0uNTtcbiAgICBlYXNlT3V0LmVhc2VGYWN0b3IgPSAyO1xuICAgIHJldHVybiBlYXNlT3V0O1xuICB9XG5cbn0gLy8gY2xhc3MgRWFzZUZ1bmN0aW9uXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFYXNlRnVuY3Rpb247XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhyb3dhYmxlIG9iamVjdCB0byByZXBvcnQgZXJyb3JzLCBhbmQgY29udGFpbmVyIG9mIGNvbnZlbmllbmNlIGZ1bmN0aW9uc1xuKiB0byBjcmVhdGUgdGhlc2UuXG4qXG4qIFRoZSBzdGF0aWMgZnVuY3Rpb25zIGNyZWF0ZSBlaXRoZXIgYEV4Y2VwdGlvbmAgb3IgYEVycm9yYCBpbnN0YW5jZXMsXG4qIHNpbmNlIGRpZmZlcmVudCBlbnZpcm9ubWVudHMgcmVzcG9uZCBkaWZmZXJlbnRlbHkgdG8gdGhlc2UgdGhyb3dzLiBGb3JcbiogbW9yZSBkZXRhaWxzIHNlZSBbYGJ1aWxkc0Vycm9yc2Bde0BsaW5rIFJhYy5FeGNlcHRpb24uYnVpbGRzRXJyb3JzfS5cbipcbiogQGFsaWFzIFJhYy5FeGNlcHRpb25cbiovXG5jbGFzcyBFeGNlcHRpb24ge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEV4Y2VwdGlvbmAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgKiAgIFRoZSBuYW1lIG9mIHRoZSBleGNlcHRpb25cbiAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICAqICAgVGhlIG1lc3NhZ2Ugb2YgdGhlIGV4Y2VwdGlvblxuICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBleGFtcGxlXG4gICogKG5ldyBSYWMuRXhjZXB0aW9uKCdOb3RBUGFuZ3JhbScsICdXYWx0eiwgYmFkIG55bXBoJykpLnRvU3RyaW5nKClcbiAgKiAvLyBSZXR1cm5zOiAnRXhjZXB0aW9uOk5vdEFQYW5ncmFtIC0gV2FsdHosIGJhZCBueW1waCdcbiAgKlxuICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgRXhjZXB0aW9uOiR7dGhpcy5uYW1lfSAtICR7dGhpcy5tZXNzYWdlfWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFdoZW4gYHRydWVgIHRoZSBjb252ZW5pZW5jZSBzdGF0aWMgZnVuY3Rpb25zIG9mIHRoaXMgY2xhc3Mgd2lsbFxuICAqIGJ1aWxkIGBFcnJvcmAgb2JqZWN0cywgb3RoZXJ3aXNlIGBFeGNlcHRpb25gIG9iamVjdHMgYXJlIGJ1aWx0LlxuICAqXG4gICogRGVmYXVsdHMgdG8gYGZhbHNlYCBmb3IgYnJvd3NlciB1c2U6IHRocm93aW5nIGFuIGBFeGNlcHRpb25gIGluIGNocm9tZVxuICAqIGRpc3BsYXlzIHRoZSBlcnJvciBzdGFjayB1c2luZyBzb3VyY2UtbWFwcyB3aGVuIGF2YWlsYWJsZS4gSW4gY29udHJhc3RcbiAgKiB0aHJvd2luZyBhbiBgRXJyb3JgIG9iamVjdCBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgcmVsYXRpdmUgdG8gdGhlXG4gICogYnVuZGxlZCBmaWxlLCB3aGljaCBpcyBoYXJkZXIgdG8gcmVhZC5cbiAgKlxuICAqIFVzZWQgYXMgYHRydWVgIGZvciB0ZXN0IHJ1bnMgaW4gSmVzdDogdGhyb3dpbmcgYW4gYEVycm9yYCB3aWxsIGJlXG4gICogcmVwb3J0ZWQgaW4gdGhlIHRlc3QgcmVwb3J0LCB3aGlsZSB0aHJvd2luZyBhIGN1c3RvbSBvYmplY3QgKGxpa2VcbiAgKiBgRXhjZXB0aW9uYCkgd2l0aGluIGEgbWF0Y2hlciByZXN1bHRzIGluIHRoZSBleHBlY3RhdGlvbiBoYW5naW5nXG4gICogaW5kZWZpbml0ZWx5LlxuICAqXG4gICogQHR5cGUge0Jvb2xlYW59XG4gICogQGRlZmF1bHQgZmFsc2VcbiAgKlxuICAqIEBtZW1iZXJvZiBSYWMuRXhjZXB0aW9uXG4gICovXG4gIHN0YXRpYyBidWlsZHNFcnJvcnMgPSBmYWxzZTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgYnVpbGRzIHRocm93YWJsZSBvYmplY3RzIHdpdGggdGhlIGdpdmVuXG4gICogYG5hbWVgLlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiBsZXQgZmFjdG9yeSA9IFJhYy5FeGNlcHRpb24ubmFtZWQoJ05vdEFQYW5ncmFtJylcbiAgKiBmYWN0b3J5LmV4Y2VwdGlvbk5hbWUgLy8gcmV0dXJucyAnTm90QVBhbmdyYW0nXG4gICogZmFjdG9yeSgnV2FsdHosIGJhZCBueW1waCcpLnRvU3RyaW5nKClcbiAgKiAvLyByZXR1cm5zOiAnRXhjZXB0aW9uOk5vdEFQYW5ncmFtIC0gV2FsdHosIGJhZCBueW1waCdcbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgZm9yIHRoZSBwcm9kdWNlZCB0aHJvd2FibGUgb2JqZWN0c1xuICAqIEByZXR1cm4ge1JhYy5FeGNlcHRpb25+bmFtZWRGYWN0b3J5fVxuICAqL1xuICBzdGF0aWMgbmFtZWQobmFtZSkge1xuICAgIC8qKlxuICAgICogRmFjdG9yeSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSB0aHJvd2FibGUgb2JqZWN0IHdpdGggdGhlIGdpdmVuXG4gICAgKiBgbWVzc2FnZWAuXG4gICAgKlxuICAgICogQGNhbGxiYWNrIFJhYy5FeGNlcHRpb25+bmFtZWRGYWN0b3J5XG4gICAgKlxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGV4Y2VwdGlvbk5hbWVcbiAgICAqICAgVGhlIG5hbWUgZm9yIHRoZSBwcm9kdWNlZCB0aHJvd2FibGUgb2JqZWN0c1xuICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICAqICAgVGhlIG1lc3NhZ2UgZm9yIHRoZSBwcm9kdWNlZCB0aHJvd2FibGUgb2JqZWN0LlxuICAgICpcbiAgICAqIEByZXR1cm4ge0V4Y2VwdGlvbnxFcnJvcn1cbiAgICAqL1xuICAgIGxldCBmdW5jID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChFeGNlcHRpb24uYnVpbGRzRXJyb3JzKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICBlcnJvci5uYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEV4Y2VwdGlvbihuYW1lLCBtZXNzYWdlKTtcbiAgICB9O1xuXG4gICAgZnVuYy5leGNlcHRpb25OYW1lID0gbmFtZTtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuXG4gIHN0YXRpYyBkcmF3ZXJOb3RTZXR1cCAgICAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnRHJhd2VyTm90U2V0dXAnKTtcbiAgc3RhdGljIGZhaWxlZEFzc2VydCAgICAgICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdGYWlsZWRBc3NlcnQnKTtcbiAgc3RhdGljIGludmFsaWRPYmplY3RUeXBlICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdJbnZhbGlkT2JqZWN0VHlwZScpO1xuICBzdGF0aWMgYWJzdHJhY3RGdW5jdGlvbkNhbGxlZCAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0Fic3RyYWN0RnVuY3Rpb25DYWxsZWQnKTtcbiAgLy8gVE9ETzogbWlncmF0ZSByZXN0IG9mIGludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gIHN0YXRpYyBpbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbiA9IEV4Y2VwdGlvbi5uYW1lZCgnSW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24nKTtcblxuICAvLyBpbnZhbGlkUGFyYW1ldGVyQ29tYmluYXRpb246ICdJbnZhbGlkIHBhcmFtZXRlciBjb21iaW5hdGlvbicsXG5cbiAgLy8gaW52YWxpZE9iamVjdFRvRHJhdzogJ0ludmFsaWQgb2JqZWN0IHRvIGRyYXcnLFxuICAvLyBpbnZhbGlkT2JqZWN0VG9BcHBseTogJ0ludmFsaWQgb2JqZWN0IHRvIGFwcGx5JyxcblxufSAvLyBjbGFzcyBFeGNlcHRpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4Y2VwdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBJbnRlcm5hbCB1dGlsaXRpZXMuXG4qIEBuYW1lc3BhY2UgdXRpbHNcbiovXG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgcGFzc2VkIHBhcmFtZXRlcnMgYXJlIG9iamVjdHMgb3IgcHJpbWl0aXZlcy4gSWYgYW55XG4qIHBhcmFtZXRlciBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWBcbiogaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLihPYmplY3R8cHJpbWl0aXZlKX0gcGFyYW1ldGVyc1xuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydEV4aXN0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRFeGlzdHMgPSBmdW5jdGlvbiguLi5wYXJhbWV0ZXJzKSB7XG4gIHBhcmFtZXRlcnMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBGb3VuZCBudWxsLCBleHBlY3RpbmcgZWxlbWVudCB0byBleGlzdCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEZvdW5kIHVuZGVmaW5lZCwgZXhwZWN0aW5nIGVsZW1lbnQgdG8gZXhpc3QgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG9iamVjdHMgb3IgdGhlIGdpdmVuIGB0eXBlYCwgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogV2hlbiBhbnkgbWVtYmVyIG9mIGBlbGVtZW50c2AgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLCB0aGUgZXhjZXB0aW9uIGlzXG4qIGFsc28gdGhyb3duLlxuKlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSB0eXBlXG4qIEBwYXJhbSB7Li4uT2JqZWN0fSBlbGVtZW50c1xuKlxuKiBAcmV0dXJucyB7Qm9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydFR5cGVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0VHlwZSA9IGZ1bmN0aW9uKHR5cGUsIC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIHR5cGUpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlIC0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9IGV4cGVjdGVkLXR5cGUtbmFtZToke3R5cGUubmFtZX0gZWxlbWVudDoke2l0ZW19YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBudW1iZXIgcHJpbWl0aXZlcyBhbmQgbm90IE5hTiwgb3RoZXJ3aXNlXG4qIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5OdW1iZXJ9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0TnVtYmVyXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydE51bWJlciA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnbnVtYmVyJyB8fCBpc05hTihpdGVtKSkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIG51bWJlciBwcmltaXRpdmUgLSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZWxlbWVudDoke2l0ZW19YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBzdHJpbmcgcHJpbWl0aXZlcywgb3RoZXJ3aXNlXG4qIGEgYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5TdHJpbmd9IGVsZW1lbnRzXG4qIEByZXR1cm5zIHtCb29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0U3RyaW5nXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydFN0cmluZyA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBFbGVtZW50IGlzIHVuZXhwZWN0ZWQgdHlwZSwgZXhwZWN0aW5nIHN0cmluZyBwcmltaXRpdmUgLSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZWxlbWVudDoke2l0ZW19YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBgZWxlbWVudHNgIGFyZSBib29sZWFuIHByaW1pdGl2ZXMsIG90aGVyd2lzZSBhXG4qIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uQm9vbGVhbn0gZWxlbWVudHNcbiogQHJldHVybnMge0Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRCb29sZWFuXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydEJvb2xlYW4gPSBmdW5jdGlvbiguLi5lbGVtZW50cykge1xuICBlbGVtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgIGlmICh0eXBlb2YgaXRlbSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgYm9vbGVhbiBwcmltaXRpdmUgLSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZWxlbWVudDoke2l0ZW19YCk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiogUmV0dXJucyB0aGUgY29uc3RydWN0b3IgbmFtZSBvZiBgb2JqYCwgb3IgaXRzIHR5cGUgbmFtZS5cbiogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGRlYnVnZ2luZyBhbmQgZXJyb3JzLlxuKlxuKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gQW4gYE9iamVjdGAgdG8gZ2V0IGl0cyB0eXBlIG5hbWVcbiogQHJldHVybnMge1N0cmluZ31cbipcbiogQGZ1bmN0aW9uIHR5cGVOYW1lXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5mdW5jdGlvbiB0eXBlTmFtZShvYmopIHtcbiAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiAndW5kZWZpbmVkJzsgfVxuICBpZiAob2JqID09PSBudWxsKSB7IHJldHVybiAnbnVsbCc7IH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmoubmFtZSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIG9iai5uYW1lID09ICcnXG4gICAgICA/IGBmdW5jdGlvbmBcbiAgICAgIDogYGZ1bmN0aW9uOiR7b2JqLm5hbWV9YDtcbiAgfVxuICByZXR1cm4gb2JqLmNvbnN0cnVjdG9yLm5hbWUgPz8gdHlwZW9mIG9iajtcbn1cbmV4cG9ydHMudHlwZU5hbWUgPSB0eXBlTmFtZTtcblxuXG4vKipcbiogQWRkcyBhIGNvbnN0YW50IHRvIHRoZSBnaXZlbiBvYmplY3QsIHRoZSBjb25zdGFudCBpcyBub3QgZW51bWVyYWJsZSBhbmRcbiogbm90IGNvbmZpZ3VyYWJsZS5cbipcbiogQGZ1bmN0aW9uIGFkZENvbnN0YW50VG9cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYWRkQ29uc3RhbnRUbyA9IGZ1bmN0aW9uKG9iaiwgcHJvcE5hbWUsIHZhbHVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IHZhbHVlXG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIGEgc3RyaW5nIG9mIGBudW1iZXJgIGZvcm1hdCB1c2luZyBmaXhlZC1wb2ludCBub3RhdGlvbiBvciB0aGVcbiogY29tcGxldGUgYG51bWJlcmAgc3RyaW5nLlxuKlxuKiBAcGFyYW0ge051bWJlcn0gbnVtYmVyIC0gVGhlIG51bWJlciB0byBmb3JtYXRcbiogQHBhcmFtIHs/TnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBhbW91bnQgb2YgZGlnaXRzIHRvIHByaW50LCBvciBgbnVsbGAgdG9cbiogcHJpbnQgYWxsIGRpZ2l0cy5cbipcbiogQHJldHVybnMge1N0cmluZ31cbipcbiogQGZ1bmN0aW9uIGN1dERpZ2l0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5jdXREaWdpdHMgPSBmdW5jdGlvbihudW1iZXIsIGRpZ2l0cyA9IG51bGwpIHtcbiAgcmV0dXJuIGRpZ2l0cyA9PT0gbnVsbFxuICAgID8gbnVtYmVyLnRvU3RyaW5nKClcbiAgICA6IG51bWJlci50b0ZpeGVkKGRpZ2l0cyk7XG59XG5cbiJdfQ==
