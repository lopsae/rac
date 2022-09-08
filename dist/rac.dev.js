// RAC - ruler-and-compass - 1.2.0 1005-94b722f
// Development distribution with sourcemaps
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version and build
module.exports = {
	version: '1.2.0',
	build: '1005-94b722f'
};


},{}],2:[function(require,module,exports){
'use strict';


// Ruler and Compass
const version = require('../built/version').version;
const build   = require('../built/version').build;


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
    * E.g. `1.2.0`.
    *
    * @constant {string} version
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'version', version);


    /**
    * Build of the instance, same as `{@link Rac.build}`.
    *
    * E.g. `904-011be8f`.
    *
    * @constant {string} build
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'build', build);


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
    * Default value is based on `1/1000` of a point.
    *
    * @type {number}
    */
    this.equalityThreshold = 0.001;


    /**
    * Value used to determine equality between two unitary numeric values.
    * Used for values that tend to exist in the `[0, 1]` range, like
    * `{@link Rac.Angle#turn}`. Used by `{@link Rac#unitaryEquals}`.
    *
    * Equality logic is the same as `{@link Rac#equalityThreshold}`.
    *
    * Default value is based on 1/1000 of the turn of an arc of radius 500
    * and length of 1: `1/(500*6.28)/1000`
    *
    * @type {number}
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
    * [`format.size`]{@link Rac.Text.Format#size} is set to `null`, the
    * values set here are used instead.
    *
    * @property {?string} font=null
    *   Default font, used when drawing a `Text` which
    *   [`format.font`]{@link Rac.Text.Format#font} is set to `null`; when
    *   set to `null` the font is not set upon drawing
    * @property {number} size=15
    *   Default size, used when drawing a `Text` which
    *   [`format.size`]{@link Rac.Text.Format#size} is set to `null`
    *
    * @type {object}
    */
    this.textFormatDefaults = {
      font: null,
      size: 15
    };


    /**
    * Drawer of the instance. This object handles the drawing for all
    * drawable object created using `this`.
    * @type {object}
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
* E.g. `1.2.0`.
*
* @constant {string} version
* @memberof Rac
*/
utils.addConstantTo(Rac, 'version', version);


/**
* Build of the class. Intended for debugging purpouses.
*
* Contains a commit-count and short-hash of the repository when the build
* was done.
*
* E.g. `904-011be8f`.
*
* @constant {string} build
* @memberof Rac
*/
utils.addConstantTo(Rac, 'build', build);


/**
* Tau, equal to `Math.PI * 2`.
*
* [Tau Manifesto](https://tauday.com/tau-manifesto).
*
* @constant {number} TAU
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
* `rac` instance in order to perform drawing operations. The attached
* functions build new objects using the calling `Rac` instance.
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
  * Convenience function that creates a new `Color` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Color}`.
  *
  * @param {number} r
  * @param {number} g
  * @param {number} b
  * @param {number=} a
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
  * Convenience function that creates a new `Stroke` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Stroke}`.
  *
  * @param {?number} weight
  * @param {?Rac.Color} color
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
  * Convenience function that creates a new `Fill` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Fill}`.
  *
  * @param {Rac.Color=} color
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
  * Convenience function that creates a new `Style` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Style}`.
  *
  * @param {?Rac.Stroke} stroke
  * @param {?Rac.Fill} fill
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
  * Convenience function that creates a new `Angle` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Angle}`.
  *
  * @param {number} turn - The turn value of the angle, in the range `[O,1)`
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
  * Convenience function that creates a new `Point` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Point}`.
  *
  * @param {number} x - The x coordinate
  * @param {number} y - The y coordinate
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
  * Convenience function that creates a new `Ray` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Ray}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} angle
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
  * Convenience function that creates a new `Segment` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Segment}`.
  *
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} angle
  * @param {number} length
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
  * Convenience function that creates a new `Arc` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Arc}`.
  *
  * @param {number} x - The _x_ coordinate for the arc center
  * @param {number} y - The _y_ coordinate for the arc center
  * @param {Rac.Angle|number} start - The start of the arc
  * @param {?Rac.Angle|number} [end=null] - The end of the arc; when
  *   ommited or set to `null`, `start` is used instead
  * @param {boolean} [clockwise=true] The orientation of the arc
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
  * Convenience function that creates a new `Text` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text}`.
  *
  * @param {number} x - The x coordinate location for the drawn text
  * @param {number} y - The y coordinate location for the drawn text
  * @param {string} string - The string to draw
  * @param {Rac.Text.Format} format - The format for the drawn text
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
  * Convenience function that creates a new `Text.Format` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text.Format}`.
  *
  * @param {string} hAlign - The horizontal alignment, left-to-right; one
  *   of the values from [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {string} vAlign - The vertical alignment, top-to-bottom; one of
  *   the values from [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {string} [font=null] - The font name
  * @param {number} [size=null] - The font size
  *
  * @returns {Rac.Text.Format}
  *
  * @see instance.Text.Format
  *
  * @function Format
  * @memberof instance.Text#
  */
  rac.Text.Format = function makeTextFormat(
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    // This functions uses `rac` instead of `this`, since `this` points to
    // `rac.Text` here and to `rac` in the `TextFormat` alias
    angle = Rac.Angle.from(rac, angle);
    return new Rac.Text.Format(
      rac,
      hAlign, vAlign,
      angle, font, size);
  };


  /**
  * Alias of [`rac.Text.Format`]{@link instance.Text#Format}.
  *
  * To display in documentation along the rest of
  * [utility instance functions]{@link instance}.
  *
  * @function TextFormat
  * @memberof Rac#
  */
  rac.TextFormat = rac.Text.Format;


  /**
  * Convenience function that creates a new `Bezier` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Bezier}`.
  *
  * @param {number} startX
  * @param {number} startY
  * @param {number} startAnchorX
  * @param {number} startAnchorY
  * @param {number} endAnchorX
  * @param {number} endAnchorY
  * @param {number} endX
  * @param {number} endY
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
  * @param {number} value - The initial value of the control, in the
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
    * @type {number}
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
    * @type {Rac.Arc?}
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
  * @param {Rac.Angle|number} valueAngleDistance - The angle distance at
  *   which to set the current value
  */
  setValueWithAngleDistance(valueAngleDistance) {
    valueAngleDistance = Rac.Angle.from(this.rac, valueAngleDistance)
    let distanceRatio = valueAngleDistance.turn / this.angleDistance.turnOne();
    this.value = distanceRatio;
  }


  /**
  * Sets both `startLimit` and `endLimit` with the given insets from `0`
  * and `endInset.turn`, correspondingly, both projected in the
  * `[0,angleDistance.turn]` range.
  *
  * > E.g.
  * > ```
  * > // For an ArcControl with angle distance of 0.5 turn
  * > control.setLimitsWithAngleDistanceInsets(0.1, 0.3)
  * > // sets startLimit as 0.2 which is at angle distance 0.1
  * > // sets endLimit   as 0.4 which is at angle distance 0.2
  * > //   0.1 inset from 0   = 0.1
  * > //   0.3 inset from 0.5 = 0.2
  * > ```
  *
  * @param {Rac.Angle|number} startInset - The inset from `0` in the range
  *   `[0,angleDistance.turn]` to use for `startLimit`
  * @param {Rac.Angle|number} endInset - The inset from `angleDistance.turn`
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
  * @return {Rac.Point?}
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

    // Negative arrow
    if (this.value >= this.startLimit + this.rac.unitaryEqualityThreshold) {
      let negAngle = angle.perpendicular(fixedAnchor.clockwise).inverse();
      Rac.Control.makeArrowShape(this.rac, knob, negAngle)
        .attachToComposite();
    }

    // Positive arrow
    if (this.value <= this.endLimit - this.rac.unitaryEqualityThreshold) {
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
  * @param {number} value - The initial value of the control, in the
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
    * @type {number}
    */
    this.value = value;

    /**
    * [Projected value]{@link Rac.Control#projectedValue} to use when
    * `value` is `0`.
    *
    * @type {number}
    * @default 0
    */
    this.projectionStart = 0;

    /**
    * [Projected value]{@link Rac.Control#projectedValue} to use when
    * `value` is `1`.
    *
    * @type {number}
    * @default 1
    */
    this.projectionEnd = 1;

    /**
    * Minimum `value` that can be selected through user interaction.
    *
    * @type {number}
    * @default 0
    */
    this.startLimit = 0;

    /**
    * Maximum `value` that can be selected through user interaction.
    *
    * @type {number}
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
    * @type {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} [style=null]
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
  * > E.g.
  * > ```
  * > For a control with a projection range of [100,200]
  * > + when value is 0,   projectionValue() is 100
  * > + when value is 0.5, projectionValue() is 150
  * > + when value is 1,   projectionValue() is 200
  * >
  * > For a control with a projection range of [50,30]
  * > + when value is 0,   projectionValue() is 50
  * > + when value is 0.5, projectionValue() is 40
  * > + when value is 1,   projectionValue() is 30
  * > ```
  *
  * @returns {number}
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


  /**
  * Sets both `startLimit` and `endLimit` with the given insets from `0`
  * and `1`, correspondingly.
  *
  * > E.g.
  * > ```
  * > control.setLimitsWithInsets(0.1, 0.2)
  * > // sets startLimit as 0.1
  * > // sets endLimit   as 0.8
  * > ```
  *
  * @param {number} startInset - The inset from `0` to use for `startLimit`
  * @param {number} endInset - The inset from `1` to use for `endLimit`
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
  * @returns {boolean}
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
  * @return {object}
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
  * @param {object} fixedAnchor - Anchor produced when user interaction
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
  * @param {object} fixedAnchor - Anchor of the control produced when user
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
    * @type {object}
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
    * @type {number}
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
    * @type {boolean}
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
  * @param {number} value - The initial value of the control, in the
  *   *[0,1]* range
  * @param {number} length - The length of the `anchor` ray available for
  *   user interaction
  */
  constructor(rac, value, length) {
    utils.assertExists(rac, value, length);
    utils.assertNumber(value, length);

    super(rac, value);

    /**
    * Length of the `anchor` ray available for user interaction.
    * @type {number}
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
    * @type {Rac.Ray?}
    * @default null
    */
    this.anchor = null;

    if (rac.controller.autoAddControls) {
      rac.controller.add(this);
    }
  }


  /**
  * Sets `value` using the projection of `lengthValue` in the `[0,length]`
  * range.
  *
  * @param {number} lengthValue - The length at which to set the current
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
  * > E.g.
  * > ```
  * > // For a RayControl with length of 100
  * > control.setLimitsWithLengthInsets(10, 20)
  * > // sets startLimit as 0.1 which is at length 10
  * > // sets endLimit   as 0.8 which is at length 80 from 100
  * > //   10 inset from 0 = 10
  * > //   20 inset from 100 = 80
  * > ```
  *
  * @param {number} startInset - The inset from `0` in the range
  *   `[0,length]` to use for `startLimit`
  * @param {number} endInset - The inset from `length` in the range
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
  * @returns {number}
  */
  distance() {
    return this.length * this.value;
  }


  /**
  * Returns a `Point` at the center of the control knob.
  *
  * When `anchor` is not set, returns `null` instead.
  *
  * @return {Rac.Point?}
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
* Angle measured by a `turn` value in the range *[0,1)* that represents the
* amount of turn in a full circle.
*
* Most functions through RAC that can receive an `Angle` parameter can
* also receive a `number` value that will be used as `turn` to instantiate
* a new `Angle`. The main exception to this behaviour are constructors,
* which always expect to receive `Angle` objects.
*
* For drawing operations the turn value is interpreted to be pointing to
* the following directions:
* + `0/4` - points right
* + `1/4` - points downwards
* + `2/4` - points left
* + `3/4` - points upwards
*
* @alias Rac.Angle
*/
class Angle {

  /**
  * Creates a new `Angle` instance.
  *
  * The `turn` value is constrained to the rance *[0,1)*, any value
  * outside is reduced back into range using a modulo operation.
  *
  * ```
  * new Rac.Angle(rac, 1/4)  // turn is 1/4
  * new Rac.Angle(rac, 5/4)  // turn is 1/4
  * new Rac.Angle(rac, -1/4) // turn is 3/4
  * new Rac.Angle(rac, 1)    // turn is 0
  * new Rac.Angle(rac, 4)    // turn is 0
  * ```
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} turn - The turn value
  */
  constructor(rac, turn) {
    // TODO: changed to assertType, test
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
    * @type {number}
    */
    this.turn = turn;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const turnStr = utils.cutDigits(this.turn, digits);
    return `Angle(${turnStr})`;
  }


  /**
  * Returns `true` when the difference with the `turn` value of the angle
  * derived [from]{@link Rac.Angle.from} `angle` is under
  * `{@link Rac#unitaryEqualityThreshold}`; otherwise returns `false`.
  *
  * For this method `otherAngle` can only be `Angle` or `number`, any other
  * type returns `false`.
  *
  * This method will consider turn values in the oposite ends of the range
  * *[0,1)* as equals. E.g. `Angle` objects with `turn` values of `0` and
  * `1 - rac.unitaryEqualityThreshold/2` will be considered equal.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to compare
  * @returns {boolean}
  *
  * @see Rac.Angle.from
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
  * @param {Rac.Angle|Rac.Ray|Rac.Segment|number} something - An object to
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
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  */
  static fromRadians(rac, radians) {
    return new Angle(rac, radians / Rac.TAU);
  }


  /**
  * Returns an `Angle` derived from `degrees`.
  *
  * @param {Rac} rac - Instance to pass along to newly created objects
  * @param {number} degrees - The measure of the angle, in degrees
  * @returns {Rac.Angle}
  */
  static fromDegrees(rac, degrees) {
    return new Angle(rac, degrees / 360);
  }


  /**
  * Returns a new `Angle` pointing in the opposite direction to `this`.
  * ```
  * rac.Angle(1/8).inverse() // turn is 1/8 + 1/2 = 5/8
  * rac.Angle(7/8).inverse() // turn is 7/8 + 1/2 = 3/8
  * ```
  *
  * @returns {Rac.Angle}
  */
  inverse() {
    return this.add(this.rac.Angle.inverse);
  }


  /**
  * Returns a new `Angle` with a turn value equivalent to `-turn`.
  * ```
  * rac.Angle(1/4).negative() // -1/4 becomes turn 3/4
  * rac.Angle(3/8).negative() // -3/8 becomes turn 5/8
  * ```
  *
  * @returns {Rac.Angle}
  */
  negative() {
    return new Angle(this.rac, -this.turn);
  }


  /**
  * Returns a new `Angle` which is perpendicular to `this` in the
  * `clockwise` orientation.
  * ```
  * rac.Angle(1/8).perpendicular(true)  // turn is 1/8 + 1/4 = 3/8
  * rac.Angle(1/8).perpendicular(false) // turn is 1/8 - 1/4 = 7/8
  * ```
  *
  * @returns {Rac.Angle}
  */
  perpendicular(clockwise = true) {
    return this.shift(this.rac.Angle.square, clockwise);
  }


  /**
  * Returns the measure of the angle in radians.
  *
  * @returns {number}
  */
  radians() {
    return this.turn * Rac.TAU;
  }


  /**
  * Returns the measure of the angle in degrees.
  *
  * @returns {number}
  */
  degrees() {
    return this.turn * 360;
  }


  /**
  * Returns the sine of `this`.
  *
  * @returns {number}
  */
  sin() {
    return Math.sin(this.radians())
  }


  /**
  * Returns the cosine of `this`.
  *
  * @returns {number}
  */
  cos() {
    return Math.cos(this.radians())
  }


  /**
  * Returns the tangent of `this`.
  *
  * @returns {number}
  */
  tan() {
    return Math.tan(this.radians())
  }


  /**
  * Returns the `turn` value in the range `(0, 1]`. When `turn` is equal to
  * `0` returns `1` instead.
  *
  * @returns {number}
  */
  turnOne() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }


  /**
  * Returns a new `Angle` with the sum of `this` and the angle derived from
  * `angle`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to add
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
  * @param {Rac.Angle|number} angle - An `Angle` to subtract
  * @returns {Rac.Angle}
  */
  subtract(angle) {
    angle = this.rac.Angle.from(angle);
    return new Angle(this.rac, this.turn - angle.turn);
  }


  /**
  * Returns a new `Angle` with `turn` set to `this.turn * factor`.
  *
  * @param {number} factor - The factor to multiply `turn` by
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
  * a complete-circle since:
  * ```
  * rac.Angle(0).mult(0.5)    // turn is 0
  * // whereas
  * rac.Angle(0).multOne(0.5) // turn is 0.5
  * ```
  *
  * @param {number} factor - The factor to multiply `turn` by
  * @returns {number}
  */
  multOne(factor) {
    return new Angle(this.rac, this.turnOne() * factor);
  }

  /**
  * Returns a new `Angle` that represents the distance from `this` to the
  * angle derived from `angle`.
  * ```
  * rac.Angle(1/4).distance(1/2, true)  // turn is 1/2
  * rac.Angle(1/4).distance(1/2, false) // turn in 3/4
  * ```
  *
  * @param {Rac.Angle|number} angle - An `Angle` to measure the distance to
  * @param {boolean} [clockwise=true] - The orientation of the measurement
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
  * ```
  * rac.Angle(0.1).shift(0.3, true)  // turn is 0.1 + 0.3 = 0.4
  * rac.Angle(0.1).shift(0.3, false) // turn is 0.1 - 0.3 = 0.8
  * ```
  *
  * @param {Rac.Angle|number} angle - An `Angle` to be shifted
  * @param {boolean} [clockwise=true] - The orientation of the shift
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
  * ```
  * rac.Angle(0.1).shiftToOrigin(0.3, true)  // turn is 0.3 + 0.1 = 0.4
  * rac.Angle(0.1).shiftToOrigin(0.3, false) // turn is 0.3 - 0.1 = 0.2
  * ```
  *
  * @param {Rac.Angle|number} origin - An `Angle` to use as origin
  * @param {boolean} [clockwise=true] - The orientation of the shift
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
* @alias Rac.Arc
*/
class Arc{

  /**
  * Creates a new `Arc` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Point} center - The center of the arc
  * @param {number} radius - The radius of the arc
  * @param {Rac.Angle} start - An `Angle` where the arc starts
  * @param {Rac.Angle} end - Ang `Angle` where the arc ends
  * @param {boolean} clockwise - The orientation of the arc
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
    * @type {number}
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
    * @see Rac.Angle#equals
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
    * @see Rac.Angle#equals
    */
    this.end = end;

    /**
    * The orientiation of the arc.
    * @type {boolean}
    */
    this.clockwise = clockwise;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * @returns {boolean}
  * @see Rac.Point#equals
  * @see Rac.Angle#equals
  * @see Rac#equals
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
  * @returns {number}
  */
  length() {
    return this.angleDistance().turnOne() * this.radius * Rac.TAU;
  }


  /**
  * Returns the length of circumference of the arc considered as a complete
  * circle.
  * @returns {number}
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
  * @returns {boolean}
  * @see Rac.Angle#equals
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
  * @param {Rac.Angle|number} newStart - The start for the new `Arc`
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
  * @param {Rac.Angle|number} newEnd - The end for the new `Arc`
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
  * @param {number} newRadius - The radius for the new `Arc`
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
  * @param {boolean} newClockwise - The orientation for the new `Arc`
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
  * @param {Rac.Angle|number} angleDistance - The angle distance of the
  * new `Arc`
  * @returns {Rac.Arc}
  * @see Rac.Arc#angleDistance
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
  * @param {number} length - The length of the new `Arc`
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
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
  * @param {number} length - The length to add
  * @returns {Rac.Arc}
  * @see Rac.Arc#length
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
  * @param {number} ratio - The factor to multiply `length()` by
  * @returns {Rac.Arc}
  *
  * @see Rac.Arc#length
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
  * @see Rac.Point#equals
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
  * @see Rac.Point#equals
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
  * @see Rac.Point#equals
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
  * @see Rac.Point#equals
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
  * @see Rac.Point#equals
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
  * @param {Rac.Angle|number} angle - An `Angle` to clamp
  * @param {Rac.Angle|number} [startInset={@link instance.Angle#zero rac.Angle.zero}] -
  *   The inset for the lower limit of the clamping range
  * @param {Rac.Angle|number} [endInset={@link instance.Angle#zero rac.Angle.zero}] -
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
  * @param {Rac.Angle|number} angle - An `Angle` to evaluate
  * @returns {boolean}
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
  * @returns {boolean}
  */
  containsProjectedPoint(point) {
    if (this.isCircle()) { return true; }
    return this.containsAngle(this.center.angleToPoint(point));
  }


  /**
  * Returns a new `Angle` with `angle` [shifted by]{@link Rac.Angle#shift}
  * `start` in the arc's orientation.
  *
  * E.g.
  * For a clockwise arc starting at `0.5`: `shiftAngle(0.1)` is `0.6`.
  * For a counter-clockwise arc starting at `0.5`: `shiftAngle(0.1)` is `0.4`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to shift
  * @returns {Rac.Angle}
  * @see Rac.Angle#shift
  */
  shiftAngle(angle) {
    angle = Rac.Angle.from(this.rac, angle);
    return this.start.shift(angle, this.clockwise);
  }

  // Returns an Angle that represents the distance from `this.start` to
  // `angle` traveling in the `clockwise` orientation.
  // Useful to determine for a given angle, where it sits inside the arc if
  // the arc was the origin coordinate system.
  //
  /**
  * Returns a new `Angle` that represents the angle distance from `start`
  * to `angle` in the arc's orientation.
  *
  * E.g.
  * For a clockwise arc starting at `0.5`: `distanceFromStart(0.6)` is `0.1`.
  * For a counter-clockwise arc starting at `0.5`: `distanceFromStart(0.6)` is `0.9`.
  *
  * @param {Rac.Angle|number} angle - An `Angle` to measure the distance to
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
  * @param {Rac.Angle|number} angle - An `Angle` towards the new `Point`
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
  * @param {number} length - The length from `startPoint()` to the new `Point`
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
  * @param {number} ratio - The factor to multiply `length()` by
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
  * @param {Rac.Angle|number} angle - The direction of the radius to return
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
  * @param {boolean} startClockwise - The orientation of the new `Segment`
  * start point in relation to the _center axis_
  * @param {boolean} endClockwise - The orientation of the new `Segment`
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
  * @param {number} count - Number of arcs to divide `this` into
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
  * @param {number} count - Number of segments to divide `this` into
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
  * @param {number} count - Number of beziers to divide `this` into
  * @returns {Rac.Composite}
  *
  * @see Rac.Bezier
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
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * @returns {boolean}
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
* @alias Rac.Point
*/
class Point{


  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {number} x
  *   The x coordinate
  * @param {number} y
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
    * @type {number}
    */
    this.x = x;

    /**
    * Y coordinate of the point.
    * @type {number}
    */
    this.y = y;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * ```
  * (new Rac.Point(rac, 55, 77)).toString()
  * // Returns: Point(55,77)
  * ```
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * Values are compared using [`Rac.equals`]{@link Rac#equals}.
  *
  * @param {Rac.Point} otherPoint - A `Point` to compare
  * @returns {boolean}
  * @see Rac#equals
  */
  equals(otherPoint) {
    return otherPoint instanceof Point
      && this.rac.equals(this.x, otherPoint.x)
      && this.rac.equals(this.y, otherPoint.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  * @param {number} newX - The x coordinate for the new `Point`
  * @returns {Rac.Point}
  */
  withX(newX) {
    return new Point(this.rac, newX, this.y);
  }


  /**
  * Returns a new `Point` with `x` set to `newX`.
  * @param {number} newY - The y coordinate for the new `Point`
  * @returns {Rac.Point}
  */
  withY(newY) {
    return new Point(this.rac, this.x, newY);
  }


  /**
  * Returns a new `Point` with `x` added to `this.x`.
  * @param {number} x - The x coordinate to add
  * @returns {Rac.Point}
  */
  addX(x) {
    return new Point(this.rac,
      this.x + x, this.y);
  }


  /**
  * Returns a new `Point` with `y` added to `this.y`.
  * @param {number} y - The y coordinate to add
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
  * @param {number} x - The x coodinate to add
  * @param {number} y - The y coodinate to add
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
  * @param {number} x - The x coodinate to subtract
  * @param {number} y - The y coodinate to subtract
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
  * @returns {number}
  * @see Rac.Point#equals
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
  * @param {Rac.Angle|number}
  *   [defaultAngle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   An `Angle` to return when `this` and `point` are equal
  * @returns {Rac.Angle}
  * @see Rac.Point#equals
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
  * @param {Rac.Angle|number} angle - An `Angle` towars the new `Point`
  * @param {number} distance - The distance to the new `Point`
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
  * @param {Rac.Angle|number} angle - The `Angle` of the new `Ray`
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
  * @param {Rac.Angle|number}
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
  * @param {boolean} [clockwise=true] - the orientation of the new `Ray`
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
  * @param {Rac.Angle|number} angle - An `Angle` to point the segment
  * towards
  * @param {number} length - The length of the new `Segment`
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
  * @param {Rac.Angle|number}
  *   [defaultAngle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   An `Angle` to use when `this` and `point` are equal
  * @returns {Rac.Segment}
  * @see Rac.Point#equals
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
  * @param {boolean} [clockwise=true] - the orientation of the new `Segment`
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
  * @param {number} radius - The radius of the new `Arc`
  * @param {Rac.Angle|number}
  *   [start=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The start `Angle` of the new `Arc`
  * @param {Rac.Angle|number} [end=null] - The end `Angle` of the new
  *   `Arc`; when `null` or ommited, `start` is used instead
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
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
  * @param {string} string - The string of the new `Text`
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
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * @returns {boolean}
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
  * @returns {?number}
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
  * @returns {?number}
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
  * @param {number} newX - The x coordinate for the new `Ray`
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
  * @param {number} newY - The y coordinate for the new `Ray`
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
  * @param {Rac.Angle|number} newAngle - The angle for the new `Ray`
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
  * @param {Rac.Angle|number} angle - The angle to add
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
  * @param {Rac.Angle|number} angle - The angle to be shifted by
  * @param {boolean} [clockwise=true] - The orientation of the shift
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
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
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
  * @param {number} distance - The distance to move `start` by
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
  * @param {Rac.Angle|number} angle - An `Angle` to move `start` towards
  * @param {number} distance - The distance to move `start` by
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
  * @param {number} distance - The distance to move `start` by
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
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
  * @param {number} x - The x coordinate to calculate a point in the ray
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
  * @param {number} y - The y coordinate to calculate a point in the ray
  * @retursn {Rac.Point}
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
  * @param {number} distance - The distance from `this.start`
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
  * @returns {number}
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
  * @returns {boolean}
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
  * @param {number} length - The length of the new `Segment`
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
  * @param {number} radius - The radius of the new `Arc`
  * @param {?Rac.Angle|number} [endAngle=null] - The end `Angle` of the new
  * `Arc`; when `null` or ommited, `this.angle` is used instead
  * @param {boolean=} clockwise=true - The orientation of the new `Arc`
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
  * @param {number} radius - The radius of the new `Arc`
  * @param {Rac.Angle|number} angleDistance - The angle distance from
  * `this.start` to the new `Arc` end
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
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
* Segment of a `[Ray]{@link Rac.Ray}` up to a given length.
*
* @alias Rac.Segment
*/
class Segment {

  /**
  * Creates a new `Segment` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {Rac.Ray} ray - A `Ray` the segment will be based of
  * @param {number} length - The length of the segment
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
    * @type {number}
    */
    this.length = length;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * @returns {boolean}
  * @see Rac.Ray#equals
  * @see Rac#equals
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
  * @param {Rac.Angle|number} newAngle - The angle for the new `Segment`
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
  * @param {number} newLength - The length for the new `Segment`
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
  * @param {number} length - The length to add
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
  * @param {number} ratio - The factor to multiply `length` by
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
  * @param {Rac.Angle|number} angle - The angle to add
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
  * @param {Rac.Angle|number} angle - The angle to be shifted by
  * @param {boolean} [clockwise=true] - The orientation of the shift
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
  * @param {number} distance - The distance to move the start point by
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
  * @param {number} distance - The distance to add to `length`
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
  * @see Rac.Angle#inverse
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
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  * @see Rac.Angle#perpendicular
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
  * @see Rac.Angle#inverse
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
  * @param {Rac.Angle|number} angle - An `Angle` to move the start point
    towards
  * @param {number} distance - The distance to move the start point by
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
  * @param {number} length - The length to move the start point by
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
  * @param {number} distance - The distance to move the start point by
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
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
  * @param {number} value - A value to clamp
  * @param {number} [startInset=0] - The inset for the lower limit of the
  * clamping range
  * @param {endInset} [endInset=0] - The inset for the higher limit of the
  * clamping range
  * @returns {number}
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
  * @param {number} length - The distance from `this.startPoint()`
  * @returns {Rac.Point}
  * @see Rac.Ray#pointAtDistance
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
  * @param {number} ratio - The factor to multiply `length` by
  * @returns {Rac.Point}
  * @see Rac.Ray#pointAtDistance
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
  * @see Rac.Point#equals
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
  * @see Rac.Point#equals
  */
  moveEndPoint(newEndPoint) {
    return this.ray.segmentToPoint(newEndPoint);
  }


  /**
  * Returns a new `Segment` from the starting point to the segment's middle
  * point.
  *
  * @returns {Rac.Segment}
  * @see Rac.Segment#pointAtBisector
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
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @param {boolean} [clockwise=true] - The orientation of the perpendicular
  * @returns {Rac.Segment}
  * @see Rac.Segment#pointAtBisector
  * @see Rac.Angle#perpendicular
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
  * @param {number} length - The length of the next `Segment`
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
  * @see Rac.Point#equals
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
  * @param {Rac.Angle|number} angle - The angle of the new `Segment`
  * @param {?number} [length=null] - The length of the new `Segment`, or
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
  * @param {Rac.Angle|number} angleDistance - An angle distance to apply to
  * the segment's angle inverse
  * @param {boolean} [clockwise=true] - The orientation of the angle shift
  * from `endPoint()`
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  * @see Rac.Angle#inverse
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
  * @param {boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @param {?number} [length=null] - The length of the new `Segment`, or
  * `null` to use `this.length`
  * @returns {Rac.Segment}
  * @see Rac.Angle#perpendicular
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
  * @param {number} hypotenuse - The length of the hypotenuse side of the
  * right triangle formed with `this` and the new `Segment`
  * @param {boolean} [clockwise=true] - The orientation of the
  * perpendicular angle from `endPoint()`
  * @returns {Rac.Segment}
  * @see Rac.Angle#inverse
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
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
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
  * @param {Rac.Angle|number} angleDistance - The angle distance from the
  * segment's start to the new `Arc` end
  * @param {boolean} [clockwise=true] - The orientation of the new `Arc`
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
* ⚠️ The API for Shape is **planned to change** in a future minor release. ⚠️
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
* @alias Rac.Text.Format
*/
class TextFormat {

  /**
  * Supported values for [`hAlign`]{@link Rac.Text.Format#hAlign} which
  * dermines the left-to-right alignment of the drawn `Text` in relation
  * to its [`text.point`]{@link Rac.Text#point}.
  *
  * @property {string} left
  *   aligns `text.point` to the left edge of the drawn text
  * @property {string} center
  *   aligns `text.point` to the center, from side to
  * @property {string} right
  *   aligns `text.point` to the right edge of the drawn text
  *
  * @type {object}
  * @memberof Rac.Text.Format
  */
  static horizontalAlign = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  /**
  * Supported values for [`vAlign`]{@link Rac.Text.Format#vAlign} which
  * dermines the top-to-bottom alignment of the drawn `Text` in relation
  * to its [`text.point`]{@link Rac.Text#point}.
  *
  * @property {string} top
  *   aligns `text.point` to the top edge of the drawn text
  * @property {string} center
  *   aligns `text.point` to the center, from top to bottom, of the drawn text
  * @property {string} baseline
  *   aligns `text.point` to the baseline of the drawn text
  * @property {string} bottom
  *   aligns `text.point` to the bottom edge of the drawn text
  *
  * @type {object}
  * @memberof Rac.Text.Format
  */
  static verticalAlign = {
    top: "top",
    center: "verticalCenter",
    baseline: "baseline",
    bottom: "bottom"
  };


  /**
  * Creates a new `Text.Format` instance.
  *
  * @param {Rac} rac
  *   Instance to use for drawing and creating other objects
  * @param {string} hAlign
  *   The horizontal alignment, left-to-right; one of the values from
  *   [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {string} vAlign
  *   The vertical alignment, top-to-bottom; one of the values from
  *   [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {string} [font=null]
  *   The font name
  * @param {number} [size=null]
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
    * @type {string}
    */
    this.hAlign = hAlign;

    /**
    * The vertical alignment, top-to-bottom, to position a `Text` relative
    * to its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`verticalAlign`]{@link Rac.Text.Format.verticalAlign} object.
    *
    * @type {string}
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
    * @type {?string}
    */
    this.font = font;

    /**
    * The font size of the text to draw.
    *
    * When set to `null` the size defined in
    * [`rac.textFormatDefaults.size`]{@link Rac#textFormatDefaults} is
    * used instead upon drawing.
    *
    * @type {?number}
    */
    this.size = size;
  } // constructor


  /**
  * Returns a string representation intended for human consumption.
  *
  * ```
  * (new Rac.Text.Format(rac, 'left', 'top', 0.5, 'sans', 14)).toString()
  * // Returns: Text.Format(ha:left va:top a:0.5 f:"sans" s:14)
  * ```
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * @returns {boolean}
  * @see Rac.Angle#equals
  */
  equals(otherFormat) {
    return otherFormat instanceof TextFormat
      && this.hAlign === otherFormat.hAlign
      && this.vAlign === otherFormat.vAlign
      && this.angle.equals(otherFormat.angle)
      && this.font === otherFormat.font
      && this.size === otherFormat.size;
  }


  /**
  * Returns a new `Text.Format` with `angle` set to the `Angle` derived
  * from `newAngle`.
  * @param {Rac.Angle|number} newAngle - The angle for the new `Text.Format`
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
  * @param {?string} newFont - The font name for the new `Text.Format`;
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
  * @param {?number} newSize - The font size for the new `Text.Format`;
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
* orientation angle, and the alignment relative to `point` to draw the text.
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
  * @param {string} string
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
    * @type {string}
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
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
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
  * @returns {boolean}
  * @see Rac.Point#equals
  */
  equals(otherText) {
    return otherText instanceof Text
      && this.string === otherText.string
      && this.point.equals(otherText.point);
  }


  /**
  * Returns a new `Text` and `Format` with `format.angle` set to the
  * `Angle` derived from `newAngle`.
  * @param {Rac.Angle|number} newAngle - The angle for the new `Text` and
  *   `Text.Format`
  * @returns {Rac.Text}
  */
  withAngle(newAngle) {
    const newFormat = this.format.withAngle(newAngle);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  /**
  * Returns a new `Text` and `Format` with `format.font` set to `newFont`.
  * @param {?string} newFont - The font name for the new `Text` and
  *   `Text.Format`; can be set to `null`.
  * @returns {Rac.Text}
  */
  withFont(newFont) {
    const newFormat = this.format.withFont(newFont);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  /**
  * Returns a new `Text` and `Format` with `format.size` set to `newSize`.
  * @param {?number} newSize - The font size for the new `Text` and
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
* The [`instance.Angle` function]{@link Rac#Angle} contains convenience
* methods and members for `{@link Rac.Angle}` objects setup with the owning
* `Rac` instance.
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
  * @param {number} radians - The measure of the angle, in radians
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
  * @param {number} degrees - The measure of the angle, in degrees
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
* The `instance.Arc` function contains convenience methods and members
* for `{@link Rac.Arc}` objects setup with the owning `Rac` instance.
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
* The [`instance.Point` function]{@link Rac#Point} contains convenience
* methods and members for `{@link Rac.Point}` objects setup with the owning
* `Rac` instance.
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
  * Equal to `{@link instance.Point#zero}`.
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
* The `instance.Ray` function contains convenience methods and members
* for `{@link Rac.Ray}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Ray` with all values set to zero, starts at
  * `{@link instance.Point#zero}` and points to
  * `{@link instance.Angle#zero}`.
  *
  * @name zero
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#zero
  * @see instance.Angle#zero
  */
  rac.Ray.zero = rac.Ray(0, 0, rac.Angle.zero);


  /**
  * A `Ray` over the x-axis, starts at `{@link instance.Point#origin}` and
  * points to `{@link instance.Angle#zero}`.
  *
  * Equal to `{@link instance.Ray#zero}`.
  *
  * @name xAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#zero
  */
  rac.Ray.xAxis = rac.Ray.zero;


  /**
  * A `Ray` over the y-axis, starts at`{@link instance.Point#origin}` and
  * points to `{@link instance.Angle#quarter}`.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#quarter
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay


},{}],24:[function(require,module,exports){
'use strict';


/**
* The `instance.Segment` function contains convenience methods and members
* for `{@link Rac.Segment}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Segment
*/
module.exports = function attachRacSegment(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Segment` with all values set to zero, , starts at
  * `{@link instance.Point#zero}`, points to
  * `{@link instance.Angle#zero}`, and has a length of zero.
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
* The [`instance.Text` function]{@link Rac#Text} contains convenience
* methods and members for `{@link Rac.Text}` objects setup with the owning
* `Rac` instance.
*
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {
  // Intended to receive a Rac instance as parameter


  /**
  * The [`instance.Text.Format` function]{@link instance.Text#Format}
  * contains convenience methods and members for `{@link Rac.Text.Format}`
  * objects setup with the owning `Rac` instance.
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
    * @type {object}
    */
    this.debugStyle = null;

    /**
    * Style used for text for debug drawing, when `null` the style already
    * applied is used.
    *
    * @type {object}
    */
    this.debugTextStyle = null;

    /**
    * Settings used by the default implementation of `drawable.debug()`.
    *
    * @property {string} font='monospace'
    *   Font to use when drawing with `debug()`
    * @property {number} [font=[rac.textFormatDefaults.size]{@link Rac#textFormatDefaults}]
    *   Font size to use when drawing with `debug()`
    * @property {number} fixedDigits=2
    *   Number of decimal digits to print when drawing with `debug()`
    *
    * @type {object}
    */
    this.debugTextOptions = {
      font: 'monospace',
      size: rac.textFormatDefaults.size,
      fixedDigits: 2
    };

    /**
    * Radius of point markers for debug drawing.
    * @type {number}
    */
    this.debugPointRadius = 4;

    /**
    * Radius of the main visual elements for debug drawing.
    * @type {number}
    */
    this.debugMarkerRadius = 22;

    /**
    * Factor applied to stroke weight setting. Stroke weight is set to
    * `stroke.weight * strokeWeightFactor` when applicable.
    *
    * @type {number}
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
  * Added to `instance.Point` when `{@link Rac.P5Drawer}` is setup as
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
  * Added to `instance.Point` when `{@link Rac.P5Drawer}` is setup as
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
  * Added to `instance.Point` when `{@link Rac.P5Drawer}` is setup as
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
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
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
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
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
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
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
  * Added  to `instance.Segment` when `{@link Rac.P5Drawer}` is setup as
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
* Color with RBGA values, each one on the *[0,1]* range.
*
* @alias Rac.Color
*/
class Color {

  /**
  * Creates a new `Color` instance.
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} r - The red channel value, in the *[0,1]* range
  * @param {number} g - The green channel value, in the *[0,1]* range
  * @param {number} b - The blue channel value, in the *[0,1]* range
  * @param {number} [a=1] - The alpha channel value, in the *[0,1]* range
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
    * @type {number}
    */
    this.r = r;

    /**
    * The green channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.g = g;

    /**
    * The blue channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.b = b;

    /**
    * The alpha channel of the color, in the *[0,1]* range.
    * @type {number}
    */
    this.a = a;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @returns {string}
  */
  toString() {
    return `Color(${this.r},${this.g},${this.b},${this.a})`;
  }


  /**
  * Creates a new `Color` instance with each channel received in the
  * *[0,255]* range
  *
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} r - The red channel value, in the *[0,255]* range
  * @param {number} g - The green channel value, in the *[0,255]* range
  * @param {number} b - The blue channel value, in the *[0,255]* range
  * @param {number} [a=255] - The alpha channel value, in the *[0,255]* range
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
  * @param {string} hexString - The RGB hex triplet to interpret
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
  * @param {?number} weight - The weight of the new `Stroke`
  * @returns {Rac.Stroke}
  */
  stroke(weight = null) {
    return new Rac.Stroke(this.rac, weight, this);
  }


  /**
  * Returns a new `Color` with `a` set to `newAlpha`.
  *
  * @param {number} newAlpha - The alpha channel for the new `Color`, in the
  *   *[0,1]* range
  * @returns {Rac.Color}
  */
  withAlpha(newAlpha) {
    return new Color(this.rac, this.r, this.g, this.b, newAlpha);
  }


  /**
  * Returns a new `Color` with `a` set to `this.a * ratio`.
  *
  * @param {number} ratio - The factor to multiply `a` by
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
  * @param {number} ratio - The transition ratio for the new `Color`
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
* `draw`.
*
* When `color` is `null` a *no-fill* setting is applied.
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
  * @see Rac.Stroke.from
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
* The instance applies the stroke color and weight settings in the
* following combinations:
* + when `color = null` and `weight = null`: a *no-stroke* setting is
*   applied
* + when `color` is set and `weight = null`: only the stroke color is
*   applied, stroke weight is not modified
* + when `weight` is set and `color = null`: only the stroke weight is
*   applied, stroke color is not modified
* + when both `color` and `weight` are set: both stroke color and weight
*   are applied
*
* @alias Rac.Stroke
*/
class Stroke {

  /**
  * Creates a new `Stroke` instance.
  *
  * @param {Rac} rac -  Instance to use for drawing and creating other objects
  * @param {?number} weight - The weight of the stroke, or `null` to skip weight
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
  * @param {?number} newWeight - The weight of the stroke, or `null` to skip
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
  * @param {number} newAlpha - The alpha channel of the `color` of the new
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
  * @see Rac.Fill.from
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
  * @returns {string}
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
* The `instance.Color` function contains convenience methods and members
* for `{@link Rac.Color}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Color
*/
module.exports = function attachRacColor(rac) {
  // Intended to receive a Rac instance as parameter


  /**
  * Returns a new `Color` with each channel received in the *[0,255]* range.
  *
  * @param {number} r - The red channel value, in the *[0,255]* range
  * @param {number} g - The green channel value, in the *[0,255]* range
  * @param {number} b - The blue channel value, in the *[0,255]* range
  * @param {number} [a=255] - The alpha channel value, in the *[0,255]* range
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
  * @param {string} hexString - The RGB hex triplet to interpret
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
* The `instance.Fill` function contains convenience methods and members
* for `{@link Rac.Fill}` objects setup with the owning `Rac` instance.
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
* The `instance.Stroke` function contains convenience methods and members
* for `{@link Rac.Stroke}` objects setup with the owning `Rac` instance.
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
  * A `Stroke` with `weight` of `1` and no color. Using or applying this
  * stroke will only set the stroke weight to `1`.
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
* Exception builder for throwable objects.
* @alias Rac.Exception
*/
class Exception {

  constructor(name, message) {
    this.name = name;
    this.message = message;
  }

  toString() {
    return `Exception:${this.name} - ${this.message}`;
  }

  /**
  * When `true` the convenience static functions of this class will
  * build `Error` objects, otherwise `Exception` objects are built.
  *
  * Set as `false` by default for browser use: throwing an `Exception`
  * in chrome displays the error stack using source-maps when available,
  * while throwing an `Error` object displays the error stack relative to
  * the bundled file which is harder to read.
  *
  * Used as `true` for test runs in Jest: throwing an `Error` will be
  * reported in the test report, while throwing a custom object (like
  * `Exception`) within a matcher results in the expectation hanging
  * indefinitely.
  */
  static buildsErrors = false;

  /**
  * Returns an convenience function for building throwable objects.
  *
  * The function can can be used as following:
  * ```
  * func(message) // returns an `Exception`` object with `name` and `message`
  * func.exceptionName // returns the `name` of the built throwable objects
  * ```
  */
  static named(name) {
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
* @returns {boolean}
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
* @returns {boolean}
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
* @param {...number} elements
* @returns {boolean}
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
* @param {...string} elements
* @returns {boolean}
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
* @param {...boolean} elements
* @returns {boolean}
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
* @param {object} obj - An `Object` to get its type name
* @returns {string}
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
* @param {number} number - The number to format
* @param {?number} [digits] - The amount of digits to print, or `null` to
* print all digits.
*
* @returns {string}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5Gb3JtYXQuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaHVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNydEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2akJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2VTdHJpY3QnO1xuXG4vLyBSdWxlciBhbmQgQ29tcGFzcyAtIHZlcnNpb24gYW5kIGJ1aWxkXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dmVyc2lvbjogJzEuMi4wJyxcblx0YnVpbGQ6ICcxMDA1LTk0YjcyMmYnXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gUnVsZXIgYW5kIENvbXBhc3NcbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykudmVyc2lvbjtcbmNvbnN0IGJ1aWxkICAgPSByZXF1aXJlKCcuLi9idWlsdC92ZXJzaW9uJykuYnVpbGQ7XG5cblxuLyoqXG4qIFJvb3QgY2xhc3Mgb2YgUkFDLiBBbGwgZHJhd2FibGUsIHN0eWxlLCBjb250cm9sLCBhbmQgZHJhd2VyIGNsYXNzZXMgYXJlXG4qIGNvbnRhaW5lZCBpbiB0aGlzIGNsYXNzLlxuKlxuKiBBbiBpbnN0YW5jZSBtdXN0IGJlIGNyZWF0ZWQgd2l0aCBgbmV3IFJhYygpYCBpbiBvcmRlciB0b1xuKiBidWlsZCBkcmF3YWJsZSwgc3R5bGUsIGFuZCBvdGhlciBvYmplY3RzLlxuKlxuKiBUbyBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucywgYSBkcmF3ZXIgbXVzdCBiZSBzZXR1cCB3aXRoXG4qIGBbc2V0dXBEcmF3ZXJde0BsaW5rIFJhYyNzZXR1cERyYXdlcn1gLiBDdXJyZW50bHkgdGhlIG9ubHkgYXZhaWxhYmxlXG4qIGltcGxlbWVudGF0aW9uIGlzIGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gLlxuKi9cbmNsYXNzIFJhYyB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBSYWMuIFRoZSBuZXcgaW5zdGFuY2UgaGFzIG5vIGBkcmF3ZXJgIHNldHVwLlxuICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIC8qKlxuICAgICogVmVyc2lvbiBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMudmVyc2lvbn1gLlxuICAgICpcbiAgICAqIEUuZy4gYDEuMi4wYC5cbiAgICAqXG4gICAgKiBAY29uc3RhbnQge3N0cmluZ30gdmVyc2lvblxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50VG8odGhpcywgJ3ZlcnNpb24nLCB2ZXJzaW9uKTtcblxuXG4gICAgLyoqXG4gICAgKiBCdWlsZCBvZiB0aGUgaW5zdGFuY2UsIHNhbWUgYXMgYHtAbGluayBSYWMuYnVpbGR9YC5cbiAgICAqXG4gICAgKiBFLmcuIGA5MDQtMDExYmU4ZmAuXG4gICAgKlxuICAgICogQGNvbnN0YW50IHtzdHJpbmd9IGJ1aWxkXG4gICAgKiBAbWVtYmVyb2YgUmFjI1xuICAgICovXG4gICAgdXRpbHMuYWRkQ29uc3RhbnRUbyh0aGlzLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuICAgIC8qKlxuICAgICogVmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkgYmV0d2VlbiB0d28gbnVtZXJpYyB2YWx1ZXMuIFVzZWQgZm9yXG4gICAgKiB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGJlIGludGVnZXJzLCBsaWtlIHNjcmVlbiBjb29yZGluYXRlcy4gVXNlZCBieVxuICAgICogYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICAgKlxuICAgICogV2hlbiBjaGVja2luZyBmb3IgZXF1YWxpdHkgYHhgIGlzIGVxdWFsIHRvIG5vbi1pbmNsdXNpdmVcbiAgICAqIGAoeC1lcXVhbGl0eVRocmVzaG9sZCwgeCtlcXVhbGl0eVRocmVzaG9sZClgOlxuICAgICogKyBgeGAgaXMgKipub3QgZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZGBcbiAgICAqICsgYHhgIGlzICoqZXF1YWwqKiB0byBgeCDCsSBlcXVhbGl0eVRocmVzaG9sZC8yYFxuICAgICpcbiAgICAqIER1ZSB0byBmbG9hdGluZyBwb2ludCBwcmVjaXNpb24gc29tZSBvcGVydGF0aW9uIGxpa2UgaW50ZXJzZWN0aW9uc1xuICAgICogY2FuIHJldHVybiBvZGQgb3Igb3NjaWxhdGluZyB2YWx1ZXMuIFRoaXMgdGhyZXNob2xkIGlzIHVzZWQgdG8gc25hcFxuICAgICogdmFsdWVzIHRvbyBjbG9zZSB0byBhIGxpbWl0LCBhcyB0byBwcmV2ZW50IG9zY2lsYXRpbmcgZWZlY3RzIGluXG4gICAgKiB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIERlZmF1bHQgdmFsdWUgaXMgYmFzZWQgb24gYDEvMTAwMGAgb2YgYSBwb2ludC5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5lcXVhbGl0eVRocmVzaG9sZCA9IDAuMDAxO1xuXG5cbiAgICAvKipcbiAgICAqIFZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5IGJldHdlZW4gdHdvIHVuaXRhcnkgbnVtZXJpYyB2YWx1ZXMuXG4gICAgKiBVc2VkIGZvciB2YWx1ZXMgdGhhdCB0ZW5kIHRvIGV4aXN0IGluIHRoZSBgWzAsIDFdYCByYW5nZSwgbGlrZVxuICAgICogYHtAbGluayBSYWMuQW5nbGUjdHVybn1gLiBVc2VkIGJ5IGB7QGxpbmsgUmFjI3VuaXRhcnlFcXVhbHN9YC5cbiAgICAqXG4gICAgKiBFcXVhbGl0eSBsb2dpYyBpcyB0aGUgc2FtZSBhcyBge0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gLlxuICAgICpcbiAgICAqIERlZmF1bHQgdmFsdWUgaXMgYmFzZWQgb24gMS8xMDAwIG9mIHRoZSB0dXJuIG9mIGFuIGFyYyBvZiByYWRpdXMgNTAwXG4gICAgKiBhbmQgbGVuZ3RoIG9mIDE6IGAxLyg1MDAqNi4yOCkvMTAwMGBcbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMDAwMDM7XG5cblxuICAgIC8qKlxuICAgICogQ29udGFpbmVyIG9mIHV0aWxpdHkgZnVuY3Rpb25zLiBTZWUgYHtAbGluayB1dGlsc31gIGZvciB0aGUgYXZhaWxhYmxlXG4gICAgKiBtZW1iZXJzLlxuICAgICpcbiAgICAqIEFsc28gYXZhaWxhYmxlIHRocm91Z2ggYHtAbGluayBSYWMudXRpbHN9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7dXRpbHN9XG4gICAgKi9cbiAgICB0aGlzLnV0aWxzID0gdXRpbHNcblxuICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICB0aGlzLnNoYXBlU3RhY2sgPSBbXTtcbiAgICB0aGlzLmNvbXBvc2l0ZVN0YWNrID0gW107XG5cblxuXG5cbiAgICAvKipcbiAgICAqIERlZmF1bHRzIGZvciB0aGUgb3B0aW9uYWwgcHJvcGVydGllcyBvZlxuICAgICogW2BUZXh0LkZvcm1hdGBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdH0uXG4gICAgKlxuICAgICogV2hlbiBhIFtgVGV4dGBde0BsaW5rIFJhYy5UZXh0fSBpcyBkcmF3IHdoaWNoXG4gICAgKiBbYGZvcm1hdC5mb250YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2ZvbnR9IG9yXG4gICAgKiBbYGZvcm1hdC5zaXplYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3NpemV9IGlzIHNldCB0byBgbnVsbGAsIHRoZVxuICAgICogdmFsdWVzIHNldCBoZXJlIGFyZSB1c2VkIGluc3RlYWQuXG4gICAgKlxuICAgICogQHByb3BlcnR5IHs/c3RyaW5nfSBmb250PW51bGxcbiAgICAqICAgRGVmYXVsdCBmb250LCB1c2VkIHdoZW4gZHJhd2luZyBhIGBUZXh0YCB3aGljaFxuICAgICogICBbYGZvcm1hdC5mb250YF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2ZvbnR9IGlzIHNldCB0byBgbnVsbGA7IHdoZW5cbiAgICAqICAgc2V0IHRvIGBudWxsYCB0aGUgZm9udCBpcyBub3Qgc2V0IHVwb24gZHJhd2luZ1xuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNpemU9MTVcbiAgICAqICAgRGVmYXVsdCBzaXplLCB1c2VkIHdoZW4gZHJhd2luZyBhIGBUZXh0YCB3aGljaFxuICAgICogICBbYGZvcm1hdC5zaXplYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3NpemV9IGlzIHNldCB0byBgbnVsbGBcbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy50ZXh0Rm9ybWF0RGVmYXVsdHMgPSB7XG4gICAgICBmb250OiBudWxsLFxuICAgICAgc2l6ZTogMTVcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAqIERyYXdlciBvZiB0aGUgaW5zdGFuY2UuIFRoaXMgb2JqZWN0IGhhbmRsZXMgdGhlIGRyYXdpbmcgZm9yIGFsbFxuICAgICogZHJhd2FibGUgb2JqZWN0IGNyZWF0ZWQgdXNpbmcgYHRoaXNgLlxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZHJhd2VyID0gbnVsbDtcblxuICAgIHJlcXVpcmUoJy4vYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMnKSh0aGlzKTtcblxuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuQ29sb3InKSAgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuU3Ryb2tlJykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vc3R5bGUvaW5zdGFuY2UuRmlsbCcpICAgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQW5nbGUnKSAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuUG9pbnQnKSAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuUmF5JykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuU2VnbWVudCcpKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQXJjJykgICAgKHRoaXMpO1xuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyJykgKHRoaXMpO1xuXG4gICAgLy8gRGVwZW5kcyBvbiBpbnN0YW5jZS5Qb2ludCBhbmQgaW5zdGFuY2UuQW5nbGUgYmVpbmcgYWxyZWFkeSBzZXR1cFxuICAgIHJlcXVpcmUoJy4vZHJhd2FibGUvaW5zdGFuY2UuVGV4dCcpKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgKiBDb250cm9sbGVyIG9mIHRoZSBpbnN0YW5jZS4gVGhpcyBvYmplY3MgaGFuZGxlcyBhbGwgb2YgdGhlIGNvbnRyb2xzXG4gICAgKiBhbmQgcG9pbnRlciBldmVudHMgcmVsYXRlZCB0byB0aGlzIGluc3RhbmNlIG9mIGBSYWNgLlxuICAgICovXG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFJhYy5Db250cm9sbGVyKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICogU2V0cyB0aGUgZHJhd2VyIGZvciB0aGUgaW5zdGFuY2UuIEN1cnJlbnRseSBvbmx5IGEgcDUuanMgaW5zdGFuY2UgaXNcbiAgKiBzdXBwb3J0ZWQuXG4gICpcbiAgKiBUaGUgZHJhd2VyIHdpbGwgYWxzbyBwb3B1bGF0ZSBzb21lIGNsYXNzZXMgd2l0aCBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICogcmVsZXZhbnQgdG8gdGhlIGRyYXdlci4gRm9yIHA1LmpzIHRoaXMgaW5jbHVkZSBgYXBwbHlgIGZ1bmN0aW9ucyBmb3JcbiAgKiBjb2xvcnMgYW5kIHN0eWxlIG9iamVjdCwgYW5kIGB2ZXJ0ZXhgIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgb2JqZWN0cy5cbiAgKlxuICAqIEBwYXJhbSB7UDV9IHA1SW5zdGFuY2VcbiAgKi9cbiAgc2V0dXBEcmF3ZXIocDVJbnN0YW5jZSkge1xuICAgIHRoaXMuZHJhd2VyID0gbmV3IFJhYy5QNURyYXdlcih0aGlzLCBwNUluc3RhbmNlKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gYSBGaXJzdCBudW1iZXIgdG8gY29tcGFyZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBiIFNlY29uZCBudW1iZXIgdG8gY29tcGFyZVxuICAqXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICovXG4gIGVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzKGEtYik7XG4gICAgcmV0dXJuIGRpZmYgPCB0aGlzLmVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiBgYWAgYW5kIGBiYCBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI3VuaXRhcnlFcXVhbGl0eVRocmVzaG9sZH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICB1bml0YXJ5RXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIHB1c2hTdGFjayhvYmopIHtcbiAgICB0aGlzLnN0YWNrLnB1c2gob2JqKTtcbiAgfVxuXG5cbiAgcGVla1N0YWNrKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wU3RhY2soKSB7XG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGFjay5wb3AoKTtcbiAgfVxuXG5cbiAgcHVzaFNoYXBlKHNoYXBlID0gbnVsbCkge1xuICAgIHNoYXBlID0gc2hhcGUgPz8gbmV3IFJhYy5TaGFwZSh0aGlzKTtcbiAgICB0aGlzLnNoYXBlU3RhY2sucHVzaChzaGFwZSk7XG4gICAgcmV0dXJuIHNoYXBlO1xuICB9XG5cblxuICBwZWVrU2hhcGUoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNoYXBlU3RhY2tbdGhpcy5zaGFwZVN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BTaGFwZSgpIHtcbiAgICBpZiAodGhpcy5zaGFwZVN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2hhcGVTdGFjay5wb3AoKTtcbiAgfVxuXG5cbiAgcHVzaENvbXBvc2l0ZShjb21wb3NpdGUpIHtcbiAgICBjb21wb3NpdGUgPSBjb21wb3NpdGUgPz8gbmV3IFJhYy5Db21wb3NpdGUodGhpcyk7XG4gICAgdGhpcy5jb21wb3NpdGVTdGFjay5wdXNoKGNvbXBvc2l0ZSk7XG4gICAgcmV0dXJuIGNvbXBvc2l0ZTtcbiAgfVxuXG5cbiAgcGVla0NvbXBvc2l0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZVN0YWNrW3RoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcENvbXBvc2l0ZSgpIHtcbiAgICBpZiAodGhpcy5jb21wb3NpdGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZVN0YWNrLnBvcCgpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmFjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYWM7XG5cblxuLy8gQWxsIGNsYXNzIChzdGF0aWMpIHByb3BlcnRpZXMgc2hvdWxkIGJlIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgY2xhc3Ncbi8vIGFzIHRvIHByZXZlbnQgY3ljbGljIGRlcGVuZGVuY3kgd2l0aCBSYWMuXG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiB1dGlsaXR5IGZ1bmN0aW9ucy4gU2VlIGB7QGxpbmsgdXRpbHN9YCBmb3IgdGhlIGF2YWlsYWJsZVxuKiBtZW1iZXJzLlxuKlxuKiBBbHNvIGF2YWlsYWJsZSB0aHJvdWdoIGB7QGxpbmsgUmFjI3V0aWxzfWAuXG4qXG4qIEB2YXIge3V0aWxzfVxuKiBAbWVtYmVyb2YgUmFjXG4qL1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKGAuL3V0aWwvdXRpbHNgKTtcblJhYy51dGlscyA9IHV0aWxzO1xuXG5cbi8qKlxuKiBWZXJzaW9uIG9mIHRoZSBjbGFzcy4gU2FtZSBhcyB0aGUgdmVyc2lvbiB1c2VkIGZvciB0aGUgbnBtIHBhY2thZ2UuXG4qXG4qIEUuZy4gYDEuMi4wYC5cbipcbiogQGNvbnN0YW50IHtzdHJpbmd9IHZlcnNpb25cbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAndmVyc2lvbicsIHZlcnNpb24pO1xuXG5cbi8qKlxuKiBCdWlsZCBvZiB0aGUgY2xhc3MuIEludGVuZGVkIGZvciBkZWJ1Z2dpbmcgcHVycG91c2VzLlxuKlxuKiBDb250YWlucyBhIGNvbW1pdC1jb3VudCBhbmQgc2hvcnQtaGFzaCBvZiB0aGUgcmVwb3NpdG9yeSB3aGVuIHRoZSBidWlsZFxuKiB3YXMgZG9uZS5cbipcbiogRS5nLiBgOTA0LTAxMWJlOGZgLlxuKlxuKiBAY29uc3RhbnQge3N0cmluZ30gYnVpbGRcbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAnYnVpbGQnLCBidWlsZCk7XG5cblxuLyoqXG4qIFRhdSwgZXF1YWwgdG8gYE1hdGguUEkgKiAyYC5cbipcbiogW1RhdSBNYW5pZmVzdG9dKGh0dHBzOi8vdGF1ZGF5LmNvbS90YXUtbWFuaWZlc3RvKS5cbipcbiogQGNvbnN0YW50IHtudW1iZXJ9IFRBVVxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdUQVUnLCBNYXRoLlBJICogMik7XG5cblxuLy8gRXhjZXB0aW9uXG5SYWMuRXhjZXB0aW9uID0gcmVxdWlyZSgnLi91dGlsL0V4Y2VwdGlvbicpO1xuXG5cbi8vIFByb3RvdHlwZSBmdW5jdGlvbnNcbnJlcXVpcmUoJy4vYXR0YWNoUHJvdG9GdW5jdGlvbnMnKShSYWMpO1xuXG5cbi8vIFA1RHJhd2VyXG5SYWMuUDVEcmF3ZXIgPSByZXF1aXJlKCcuL3A1RHJhd2VyL1A1RHJhd2VyJyk7XG5cblxuLy8gQ29sb3JcblJhYy5Db2xvciA9IHJlcXVpcmUoJy4vc3R5bGUvQ29sb3InKTtcblxuXG4vLyBTdHJva2VcblJhYy5TdHJva2UgPSByZXF1aXJlKCcuL3N0eWxlL1N0cm9rZScpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuU3Ryb2tlKTtcblxuXG4vLyBGaWxsXG5SYWMuRmlsbCA9IHJlcXVpcmUoJy4vc3R5bGUvRmlsbCcpO1xuUmFjLnNldHVwU3R5bGVQcm90b0Z1bmN0aW9ucyhSYWMuRmlsbCk7XG5cblxuLy8gU3R5bGVDb250YWluZXJcblJhYy5TdHlsZUNvbnRhaW5lciA9IHJlcXVpcmUoJy4vc3R5bGUvU3R5bGVDb250YWluZXInKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0eWxlQ29udGFpbmVyKTtcblxuXG4vLyBBbmdsZVxuUmFjLkFuZ2xlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BbmdsZScpO1xuUmFjLkFuZ2xlLnByb3RvdHlwZS5sb2cgPSBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5sb2c7XG5cblxuLy8gUG9pbnRcblJhYy5Qb2ludCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvUG9pbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlBvaW50KTtcblxuXG4vLyBSYXlcblJhYy5SYXkgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1JheScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuUmF5KTtcblxuXG4vLyBTZWdtZW50XG5SYWMuU2VnbWVudCA9IHJlcXVpcmUoJy4vZHJhd2FibGUvU2VnbWVudCcpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2VnbWVudCk7XG5cblxuLy8gQXJjXG5SYWMuQXJjID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9BcmMnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLkFyYyk7XG5cblxuLy8gVGV4dFxuUmFjLlRleHQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1RleHQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlRleHQpO1xuXG5cbi8vIEJlemllclxuUmFjLkJlemllciA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQmV6aWVyJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5CZXppZXIpO1xuXG5cbi8vIENvbXBvc2l0ZVxuUmFjLkNvbXBvc2l0ZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQ29tcG9zaXRlJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Db21wb3NpdGUpO1xuXG5cbi8vIFNoYXBlXG5SYWMuU2hhcGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NoYXBlJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5TaGFwZSk7XG5cblxuLy8gRWFzZUZ1bmN0aW9uXG5SYWMuRWFzZUZ1bmN0aW9uID0gcmVxdWlyZSgnLi91dGlsL0Vhc2VGdW5jdGlvbicpO1xuXG5cbi8vIENvbnRyb2xsZXJcblJhYy5Db250cm9sbGVyID0gcmVxdWlyZSgnLi9jb250cm9sL0NvbnRyb2xsZXInKTtcblxuXG4vLyBDb250cm9sXG5SYWMuQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sJyk7XG5cblxuLy8gUmF5Q29udHJvbFxuUmFjLlJheUNvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvUmF5Q29udHJvbCcpO1xuXG5cbi8vIEFyY0NvbnRyb2xcblJhYy5BcmNDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL0FyY0NvbnRyb2wnKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4vUmFjJyk7XG5cblxuLyoqXG4qIFRoaXMgbmFtZXNwYWNlIGxpc3RzIHV0aWxpdHkgZnVuY3Rpb25zIGF0dGFjaGVkIHRvIGFuIGluc3RhbmNlIG9mXG4qIGB7QGxpbmsgUmFjfWAgZHVyaW5nIGluaXRpYWxpemF0aW9uLiBFYWNoIGRyYXdhYmxlIGFuZCBzdHlsZSBjbGFzcyBnZXRzXG4qIGEgY29ycmVzcG9uZGluZyBmdW5jdGlvbiBsaWtlIFtgcmFjLlBvaW50YF17QGxpbmsgaW5zdGFuY2UuUG9pbnR9IG9yXG4qIFtgcmFjLkNvbG9yYF17QGxpbmsgaW5zdGFuY2UuQ29sb3J9LlxuKlxuKiBEcmF3YWJsZSBhbmQgc3R5bGUgb2JqZWN0cyByZXF1aXJlIGZvciBjb25zdHJ1Y3Rpb24gYSByZWZlcmVuY2UgdG8gYVxuKiBgcmFjYCBpbnN0YW5jZSBpbiBvcmRlciB0byBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucy4gVGhlIGF0dGFjaGVkXG4qIGZ1bmN0aW9ucyBidWlsZCBuZXcgb2JqZWN0cyB1c2luZyB0aGUgY2FsbGluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogVGhlc2UgZnVuY3Rpb25zIGFyZSBhbHNvIHNldHVwIHdpdGggcmVhZHktbWFkZSBjb252ZW5pZW5jZSBvYmplY3RzIGZvclxuKiBtYW55IHVzdWFsIHZhbHVlcyBsaWtlIFtgcmFjLkFuZ2xlLm5vcnRoYF17QGxpbmsgaW5zdGFuY2UuQW5nbGUjbm9ydGh9IG9yXG4qIFtgcmFjLlBvaW50Lnplcm9gXXtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZVxuKi9cblxuXG4vLyBBdHRhY2hlcyB0aGUgY29udmVuaWVuY2UgZnVuY3Rpb25zIHRvIGNyZWF0ZSBvYmplY3RzIHdpdGggdGhpcyBpbnN0YW5jZVxuLy8gb2YgUmFjLiBUaGVzZSBmdW5jdGlvbnMgYXJlIGF0dGFjaGVkIGFzIHByb3BlcnRpZXMgKGluc3RlYWQgb2YgaW50byB0aGVcbi8vIHByb3RvdHlwZSkgYmVjYXVzZSB0aGVzZSBhcmUgbGF0ZXIgcG9wdWxhdGVkIHdpdGggbW9yZSBwcm9wZXJ0aWVzIGFuZFxuLy8gbWV0aG9kcywgYW5kIHRodXMgbmVlZCB0byBiZSBpbmRlcGVuZGVudCBmb3IgZWFjaCBpbnN0YW5jZS5cbi8vXG4vLyBJbnRlbmRlZCB0byByZWNlaXZlIHRoZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXIuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaEluc3RhbmNlRnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQ29sb3JgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQ29sb3J9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByXG4gICogQHBhcmFtIHtudW1iZXJ9IGdcbiAgKiBAcGFyYW0ge251bWJlcn0gYlxuICAqIEBwYXJhbSB7bnVtYmVyPX0gYVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQ29sb3JcbiAgKlxuICAqIEBmdW5jdGlvbiBDb2xvclxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Db2xvciA9IGZ1bmN0aW9uIG1ha2VDb2xvcihyLCBnLCBiLCBhID0gMSkge1xuICAgIHJldHVybiBuZXcgUmFjLkNvbG9yKHRoaXMsIHIsIGcsIGIsIGEpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBTdHJva2VgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3Ryb2tlfWAuXG4gICpcbiAgKiBAcGFyYW0gez9udW1iZXJ9IHdlaWdodFxuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gY29sb3JcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TdHJva2VcbiAgKlxuICAqIEBmdW5jdGlvbiBTdHJva2VcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuU3Ryb2tlID0gZnVuY3Rpb24gbWFrZVN0cm9rZSh3ZWlnaHQsIGNvbG9yID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0cm9rZSh0aGlzLCB3ZWlnaHQsIGNvbG9yKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgRmlsbGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5GaWxsfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db2xvcj19IGNvbG9yXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5GaWxsXG4gICpcbiAgKiBAZnVuY3Rpb24gRmlsbFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5GaWxsID0gZnVuY3Rpb24gbWFrZUZpbGwoY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLCBjb2xvcik7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFN0eWxlYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlN0eWxlfWAuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfSBzdHJva2VcbiAgKiBAcGFyYW0gez9SYWMuRmlsbH0gZmlsbFxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuU3R5bGVcbiAgKlxuICAqIEBmdW5jdGlvbiBTdHlsZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHlsZSA9IGZ1bmN0aW9uIG1ha2VTdHlsZShzdHJva2UgPSBudWxsLCBmaWxsID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlKHRoaXMsIHN0cm9rZSwgZmlsbCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFuZ2xlYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gdHVybiAtIFRoZSB0dXJuIHZhbHVlIG9mIHRoZSBhbmdsZSwgaW4gdGhlIHJhbmdlIGBbTywxKWBcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5BbmdsZVxuICAqXG4gICogQGZ1bmN0aW9uIEFuZ2xlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkFuZ2xlID0gZnVuY3Rpb24gbWFrZUFuZ2xlKHR1cm4pIHtcbiAgICByZXR1cm4gbmV3IFJhYy5BbmdsZSh0aGlzLCB0dXJuKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgUG9pbnRgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBQb2ludFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Qb2ludCA9IGZ1bmN0aW9uIG1ha2VQb2ludCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFJheWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5SYXl9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUmF5XG4gICpcbiAgKiBAZnVuY3Rpb24gUmF5XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlJheSA9IGZ1bmN0aW9uIG1ha2VSYXkoeCwgeSwgYW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFNlZ21lbnRgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlNlZ21lbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBTZWdtZW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlNlZ21lbnQgPSBmdW5jdGlvbiBtYWtlU2VnbWVudCh4LCB5LCBhbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLCByYXksIGxlbmd0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFyY2Agc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIF94XyBjb29yZGluYXRlIGZvciB0aGUgYXJjIGNlbnRlclxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIF95XyBjb29yZGluYXRlIGZvciB0aGUgYXJjIGNlbnRlclxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gc3RhcnQgLSBUaGUgc3RhcnQgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxudW1iZXJ9IFtlbmQ9bnVsbF0gLSBUaGUgZW5kIG9mIHRoZSBhcmM7IHdoZW5cbiAgKiAgIG9tbWl0ZWQgb3Igc2V0IHRvIGBudWxsYCwgYHN0YXJ0YCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmNcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5BcmNcbiAgKlxuICAqIEBmdW5jdGlvbiBBcmNcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQXJjID0gZnVuY3Rpb24gbWFrZUFyYyh4LCB5LCByYWRpdXMsIHN0YXJ0ID0gdGhpcy5BbmdsZS56ZXJvLCBlbmQgPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgY2VudGVyID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICBzdGFydCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMsIHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogUmFjLkFuZ2xlLmZyb20odGhpcywgZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0LCBlbmQsIGNsb2Nrd2lzZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFRleHRgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuVGV4dH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBsb2NhdGlvbiBmb3IgdGhlIGRyYXduIHRleHRcbiAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byBkcmF3XG4gICogQHBhcmFtIHtSYWMuVGV4dC5Gb3JtYXR9IGZvcm1hdCAtIFRoZSBmb3JtYXQgZm9yIHRoZSBkcmF3biB0ZXh0XG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlRleHRcbiAgKlxuICAqIEBmdW5jdGlvbiBUZXh0XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlRleHQgPSBmdW5jdGlvbiBtYWtlVGV4dCh4LCB5LCBzdHJpbmcsIGZvcm1hdCA9IHRoaXMuVGV4dC5Gb3JtYXQudG9wTGVmdCkge1xuICAgIGNvbnN0IHBvaW50ID0gbmV3IFJhYy5Qb2ludCh0aGlzLCB4LCB5KTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0KHRoaXMsIHBvaW50LCBzdHJpbmcsIGZvcm1hdCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFRleHQuRm9ybWF0YCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLlRleHQuRm9ybWF0fWAuXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gaEFsaWduIC0gVGhlIGhvcml6b250YWwgYWxpZ25tZW50LCBsZWZ0LXRvLXJpZ2h0OyBvbmVcbiAgKiAgIG9mIHRoZSB2YWx1ZXMgZnJvbSBbYGhvcml6b250YWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ259XG4gICogQHBhcmFtIHtzdHJpbmd9IHZBbGlnbiAtIFRoZSB2ZXJ0aWNhbCBhbGlnbm1lbnQsIHRvcC10by1ib3R0b207IG9uZSBvZlxuICAqICAgdGhlIHZhbHVlcyBmcm9tIFtgdmVydGljYWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWdufVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBbYW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduXG4gICogQHBhcmFtIHtzdHJpbmd9IFtmb250PW51bGxdIC0gVGhlIGZvbnQgbmFtZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBbc2l6ZT1udWxsXSAtIFRoZSBmb250IHNpemVcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlRleHQuRm9ybWF0XG4gICpcbiAgKiBAZnVuY3Rpb24gRm9ybWF0XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdCA9IGZ1bmN0aW9uIG1ha2VUZXh0Rm9ybWF0KFxuICAgIGhBbGlnbixcbiAgICB2QWxpZ24sXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBmb250ID0gbnVsbCxcbiAgICBzaXplID0gbnVsbClcbiAge1xuICAgIC8vIFRoaXMgZnVuY3Rpb25zIHVzZXMgYHJhY2AgaW5zdGVhZCBvZiBgdGhpc2AsIHNpbmNlIGB0aGlzYCBwb2ludHMgdG9cbiAgICAvLyBgcmFjLlRleHRgIGhlcmUgYW5kIHRvIGByYWNgIGluIHRoZSBgVGV4dEZvcm1hdGAgYWxpYXNcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgICAgcmFjLFxuICAgICAgaEFsaWduLCB2QWxpZ24sXG4gICAgICBhbmdsZSwgZm9udCwgc2l6ZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBBbGlhcyBvZiBbYHJhYy5UZXh0LkZvcm1hdGBde0BsaW5rIGluc3RhbmNlLlRleHQjRm9ybWF0fS5cbiAgKlxuICAqIFRvIGRpc3BsYXkgaW4gZG9jdW1lbnRhdGlvbiBhbG9uZyB0aGUgcmVzdCBvZlxuICAqIFt1dGlsaXR5IGluc3RhbmNlIGZ1bmN0aW9uc117QGxpbmsgaW5zdGFuY2V9LlxuICAqXG4gICogQGZ1bmN0aW9uIFRleHRGb3JtYXRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuVGV4dEZvcm1hdCA9IHJhYy5UZXh0LkZvcm1hdDtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQmV6aWVyYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkJlemllcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0WFxuICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFlcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0QW5jaG9yWVxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZEFuY2hvcllcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kWFxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRZXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkJlemllcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQmV6aWVyXG4gICpcbiAgKiBAZnVuY3Rpb24gQmV6aWVyXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgdXRpbGl0eSBmdW5jdGlvbnMgdG8gYSBSYWMgaW5zdGFuY2UgdGhhdCBhZGQgZnVuY3Rpb25zIHRvIGFsbFxuLy8gZHJhd2FibGUgYW5kIHN0eWxlIGNsYXNzIHByb3RvdHlwZXMuXG4vL1xuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuXG4gIC8qKlxuICAqIEFkZHMgdG8gYGRyYXdhYmxlQ2xhc3MucHJvdG90eXBlYCBhbGwgdGhlIGZ1bmN0aW9ucyBjb250YWluZWQgaW5cbiAgKiBgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgdGhlIGZ1bmN0aW9ucyBzaGFyZWQgYnkgYWxsXG4gICogZHJhd2FibGUgb2JqZWN0cywgZm9yIGV4YW1wbGUgYGRyYXcoKWAgYW5kIGBkZWJ1ZygpYC5cbiAgKlxuICAqIEBwYXJhbSB7Y2xhc3N9IGRyYXdhYmxlQ2xhc3MgLSBDbGFzcyB0byBzZXR1cCB3aXRoIGRyYXdhYmxlIGZ1bmN0aW9uc1xuICAqL1xuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oZHJhd2FibGVDbGFzcykge1xuICAgIE9iamVjdC5rZXlzKFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgZHJhd2FibGVDbGFzcy5wcm90b3R5cGVbbmFtZV0gPSBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc1tuYW1lXTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZHJhdyA9IGZ1bmN0aW9uKHN0eWxlID0gbnVsbCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kcmF3T2JqZWN0KHRoaXMsIHN0eWxlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmRlYnVnID0gZnVuY3Rpb24oZHJhd3NUZXh0ID0gZmFsc2Upe1xuICAgIGFzc2VydERyYXdlcih0aGlzKTtcbiAgICB0aGlzLnJhYy5kcmF3ZXIuZGVidWdPYmplY3QodGhpcywgZHJhd3NUZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZyA9IGZ1bmN0aW9uKG1lc3NhZ2UgPSBudWxsKXtcbiAgICBsZXQgY29hbGVzY2VkTWVzc2FnZSA9IG1lc3NhZ2UgPz8gJyVvJztcbiAgICBjb25zb2xlLmxvZyhjb2FsZXNjZWRNZXNzYWdlLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnB1c2ggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wdXNoU3RhY2sodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTdGFjaygpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wZWVrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBlZWtTdGFjaygpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUb1NoYXBlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMucGVla1NoYXBlKCkuYWRkT3V0bGluZSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wU2hhcGVUb0NvbXBvc2l0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBzaGFwZSA9IHRoaXMucmFjLnBvcFNoYXBlKCk7XG4gICAgdGhpcy5yYWMucGVla0NvbXBvc2l0ZSgpLmFkZChzaGFwZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWMucGVla0NvbXBvc2l0ZSgpLmFkZCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5hdHRhY2hUbyA9IGZ1bmN0aW9uKHNvbWVDb21wb3NpdGUpIHtcbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5Db21wb3NpdGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHNvbWVDb21wb3NpdGUgaW5zdGFuY2VvZiBSYWMuU2hhcGUpIHtcbiAgICAgIHNvbWVDb21wb3NpdGUuYWRkT3V0bGluZSh0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGF0dGFjaFRvIGNvbXBvc2l0ZSAtIHNvbWVDb21wb3NpdGUtdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWVDb21wb3NpdGUpfWApO1xuICB9O1xuXG5cbiAgLy8gQ29udGFpbmVyIG9mIHByb3RvdHlwZSBmdW5jdGlvbnMgZm9yIHN0eWxlIGNsYXNzZXMuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zID0ge307XG5cbiAgLy8gQWRkcyB0byB0aGUgZ2l2ZW4gY2xhc3MgcHJvdG90eXBlIGFsbCB0aGUgZnVuY3Rpb25zIGNvbnRhaW5lZCBpblxuICAvLyBgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNgLiBUaGVzZSBhcmUgZnVuY3Rpb25zIHNoYXJlZCBieSBhbGxcbiAgLy8gc3R5bGUgb2JqZWN0cyAoRS5nLiBgYXBwbHkoKWApLlxuICBSYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuc3R5bGVQcm90b0Z1bmN0aW9ucy5hcHBseSA9IGZ1bmN0aW9uKCl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5hcHBseU9iamVjdCh0aGlzKTtcbiAgfTtcblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmxvZyA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmxvZztcblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5VG9DbGFzcyA9IGZ1bmN0aW9uKGNsYXNzT2JqKSB7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5zZXRDbGFzc0RyYXdTdHlsZShjbGFzc09iaiwgdGhpcyk7XG4gIH07XG5cbn07IC8vIGF0dGFjaFByb3RvRnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCBhbGxvd3MgdGhlIHNlbGVjdGlvbiBvZiBhIHZhbHVlIHdpdGggYSBrbm9iIHRoYXQgc2xpZGVzXG4qIHRocm91Z2ggdGhlIHNlY3Rpb24gb2YgYW4gYEFyY2AuXG4qXG4qIFVzZXMgYW4gYEFyY2AgYXMgYFthbmNob3Jde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuY2hvcn1gLCB3aGljaCBkZWZpbmVzXG4qIHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbipcbiogYFthbmdsZURpc3RhbmNlXXtAbGluayBSYWMuQXJjQ29udHJvbCNhbmdsZURpc3RhbmNlfWAgZGVmaW5lcyB0aGVcbiogc2VjdGlvbiBvZiB0aGUgYGFuY2hvcmAgYXJjIHdoaWNoIGlzIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiogV2l0aGluIHRoaXMgc2VjdGlvbiB0aGUgdXNlciBjYW4gc2xpZGUgdGhlIGNvbnRyb2wga25vYiB0byBzZWxlY3QgYVxuKiB2YWx1ZS5cbipcbiogQGFsaWFzIFJhYy5BcmNDb250cm9sXG4qIEBleHRlbmRzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgQXJjQ29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBcmNDb250cm9sYCBpbnN0YW5jZSB3aXRoIHRoZSBzdGFydGluZyBgdmFsdWVgIGFuZCB0aGVcbiAgKiBpbnRlcmFjdGl2ZSBgYW5nbGVEaXN0YW5jZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGNvbnRyb2wsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlRGlzdGFuY2Ugb2YgdGhlIGBhbmNob3JgXG4gICogICBhcmMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGFuZ2xlRGlzdGFuY2UpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBhbmdsZURpc3RhbmNlKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBBbmdsZSBkaXN0YW5jZSBvZiB0aGUgYGFuY2hvcmAgYXJjIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbShyYWMsIGFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgLyoqXG4gICAgKiBgQXJjYCB0byB3aGljaCB0aGUgY29udHJvbCB3aWxsIGJlIGFuY2hvcmVkLiBEZWZpbmVzIHRoZSBsb2NhdGlvblxuICAgICogd2hlcmUgdGhlIGNvbnRyb2wgaXMgZHJhd24uXG4gICAgKlxuICAgICogQWxvbmcgd2l0aCBgW2FuZ2xlRGlzdGFuY2Vde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuZ2xlRGlzdGFuY2V9YFxuICAgICogZGVmaW5lcyB0aGUgc2VjdGlvbiBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGNvbnRyb2wgY2Fubm90IGJlIGRyYXduIG9yIHNlbGVjdGVkIHVudGlsIHRoaXMgcHJvcGVydHkgaXMgc2V0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQXJjP31cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyYWMuY29udHJvbGxlci5hdXRvQWRkQ29udHJvbHMpIHtcbiAgICAgIHJhYy5jb250cm9sbGVyLmFkZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYHZhbHVlYCB1c2luZyB0aGUgcHJvamVjdGlvbiBvZiBgdmFsdWVBbmdsZURpc3RhbmNlLnR1cm5gIGluIHRoZVxuICAqIGBbMCxhbmdsZUxlbmd0aC50dXJuXWAgcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHZhbHVlQW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBhdFxuICAqICAgd2hpY2ggdG8gc2V0IHRoZSBjdXJyZW50IHZhbHVlXG4gICovXG4gIHNldFZhbHVlV2l0aEFuZ2xlRGlzdGFuY2UodmFsdWVBbmdsZURpc3RhbmNlKSB7XG4gICAgdmFsdWVBbmdsZURpc3RhbmNlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHZhbHVlQW5nbGVEaXN0YW5jZSlcbiAgICBsZXQgZGlzdGFuY2VSYXRpbyA9IHZhbHVlQW5nbGVEaXN0YW5jZS50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLnZhbHVlID0gZGlzdGFuY2VSYXRpbztcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBib3RoIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHRoZSBnaXZlbiBpbnNldHMgZnJvbSBgMGBcbiAgKiBhbmQgYGVuZEluc2V0LnR1cm5gLCBjb3JyZXNwb25kaW5nbHksIGJvdGggcHJvamVjdGVkIGluIHRoZVxuICAqIGBbMCxhbmdsZURpc3RhbmNlLnR1cm5dYCByYW5nZS5cbiAgKlxuICAqID4gRS5nLlxuICAqID4gYGBgXG4gICogPiAvLyBGb3IgYW4gQXJjQ29udHJvbCB3aXRoIGFuZ2xlIGRpc3RhbmNlIG9mIDAuNSB0dXJuXG4gICogPiBjb250cm9sLnNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKDAuMSwgMC4zKVxuICAqID4gLy8gc2V0cyBzdGFydExpbWl0IGFzIDAuMiB3aGljaCBpcyBhdCBhbmdsZSBkaXN0YW5jZSAwLjFcbiAgKiA+IC8vIHNldHMgZW5kTGltaXQgICBhcyAwLjQgd2hpY2ggaXMgYXQgYW5nbGUgZGlzdGFuY2UgMC4yXG4gICogPiAvLyAgIDAuMSBpbnNldCBmcm9tIDAgICA9IDAuMVxuICAqID4gLy8gICAwLjMgaW5zZXQgZnJvbSAwLjUgPSAwLjJcbiAgKiA+IGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIGluIHRoZSByYW5nZVxuICAqICAgYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBlbmRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGBhbmdsZURpc3RhbmNlLnR1cm5gXG4gICogICBpbiB0aGUgcmFuZ2UgYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHRvIHVzZSBmb3IgYGVuZExpbWl0YFxuICAqL1xuICBzZXRMaW1pdHNXaXRoQW5nbGVEaXN0YW5jZUluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC0gZW5kSW5zZXQudHVybikgLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSAgW2FuZ2xlIGBkaXN0YW5jZWBde0BsaW5rIFJhYy5BbmdsZSNkaXN0YW5jZX0gYmV0d2VlbiB0aGVcbiAgKiBgYW5jaG9yYCBhcmMgYHN0YXJ0YCBhbmQgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqIFRoZSBgdHVybmAgb2YgdGhlIHJldHVybmVkIGBBbmdsZWAgaXMgZXF1aXZhbGVudCB0byB0aGUgY29udHJvbCBgdmFsdWVgXG4gICogcHJvamVjdGVkIHRvIHRoZSByYW5nZSBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy52YWx1ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjZW50ZXIgb2YgdGhlIGNvbnRyb2wga25vYi5cbiAgKlxuICAqIFdoZW4gYGFuY2hvcmAgaXMgbm90IHNldCwgcmV0dXJucyBgbnVsbGAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm4ge1JhYy5Qb2ludD99XG4gICovXG4gIGtub2IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBOb3QgcG9zaWJsZSB0byBjYWxjdWxhdGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0QW5nbGVEaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHByb2R1Y2VkIHdpdGggdGhlIGBhbmNob3JgIGFyYyB3aXRoXG4gICogYGFuZ2xlRGlzdGFuY2VgLCB0byBiZSBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGFuY2hvcmAgaXMgbm90IHNldC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhZmZpeEFuY2hvcigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24oXG4gICAgICAgIGBFeHBlY3RlZCBhbmNob3IgdG8gYmUgc2V0LCBudWxsIGZvdW5kIGluc3RlYWRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLndpdGhBbmdsZURpc3RhbmNlKHRoaXMuYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqL1xuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIC8vIEFyYyBhbmNob3IgaXMgYWx3YXlzIGRyYXduIHdpdGhvdXQgZmlsbFxuICAgIGxldCBhbmNob3JTdHlsZSA9IGNvbnRyb2xTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKVxuICAgICAgOiB0aGlzLnJhYy5GaWxsLm5vbmU7XG5cbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuY2VudGVyLmFuZ2xlVG9Qb2ludChrbm9iKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUobWFya2VyQW5nbGVEaXN0YW5jZSk7XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICAvLyBDb250cm9sIGtub2JcbiAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIE5lZ2F0aXZlIGFycm93XG4gICAgaWYgKHRoaXMudmFsdWUgPj0gdGhpcy5zdGFydExpbWl0ICsgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBsZXQgbmVnQW5nbGUgPSBhbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSkuaW52ZXJzZSgpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIG5lZ0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGl2ZSBhcnJvd1xuICAgIGlmICh0aGlzLnZhbHVlIDw9IHRoaXMuZW5kTGltaXQgLSB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIGxldCBwb3NBbmdsZSA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZml4ZWRBbmNob3IuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBwb3NBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhjb250cm9sU3R5bGUpO1xuXG4gICAgLy8gU2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCgpKSB7XG4gICAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgICBpZiAocG9pbnRlclN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDEuNSkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogVXBkYXRlcyBgdmFsdWVgIHVzaW5nIGBwb2ludGVyS25vYkNlbnRlcmAgaW4gcmVsYXRpb24gdG8gYGZpeGVkQW5jaG9yYC5cbiAgKlxuICAqIGB2YWx1ZWAgaXMgYWx3YXlzIHVwZGF0ZWQgYnkgdGhpcyBtZXRob2QgdG8gYmUgd2l0aGluICpbMCwxXSogYW5kXG4gICogYFtzdGFydExpbWl0LGVuZExpbWl0XWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlcktub2JDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIGtub2IgY2VudGVyXG4gICogICBhcyBpbnRlcmFjdGVkIGJ5IHRoZSB1c2VyIHBvaW50ZXJcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGZpeGVkQW5jaG9yIC0gQW5jaG9yIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYCB3aGVuXG4gICogICB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBmaXhlZEFuY2hvci5hbmdsZURpc3RhbmNlKCk7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBhbmdsZURpc3RhbmNlLm11bHRPbmUodGhpcy5zdGFydExpbWl0KTtcbiAgICBsZXQgZW5kSW5zZXQgPSBhbmdsZURpc3RhbmNlLm11bHRPbmUoMSAtIHRoaXMuZW5kTGltaXQpO1xuXG4gICAgbGV0IHNlbGVjdGlvbkFuZ2xlID0gZml4ZWRBbmNob3IuY2VudGVyXG4gICAgICAuYW5nbGVUb1BvaW50KHBvaW50ZXJLbm9iQ2VudGVyKTtcbiAgICBzZWxlY3Rpb25BbmdsZSA9IGZpeGVkQW5jaG9yLmNsYW1wVG9BbmdsZXMoc2VsZWN0aW9uQW5nbGUsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG4gICAgbGV0IG5ld0Rpc3RhbmNlID0gZml4ZWRBbmNob3IuZGlzdGFuY2VGcm9tU3RhcnQoc2VsZWN0aW9uQW5nbGUpO1xuXG4gICAgLy8gVXBkYXRlIGNvbnRyb2wgd2l0aCBuZXcgZGlzdGFuY2VcbiAgICBsZXQgZGlzdGFuY2VSYXRpbyA9IG5ld0Rpc3RhbmNlLnR1cm4gLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICAgIHRoaXMudmFsdWUgPSBkaXN0YW5jZVJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGFsb25nIHdpdGggcG9pbnRlciBpbnRlcmFjdGlvbiB2aXN1YWxzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLkFyY30gZml4ZWRBbmNob3IgLSBgQXJjYCBwcm9kdWNlZCB3aXRoIGBhZmZpeEFuY2hvcmAgd2hlblxuICAqICAgdXNlciBpbnRlcmFjdGlvbiBzdGFydGVkXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gcG9pbnRlclRvS25vYk9mZnNldCAtIEEgYFNlZ21lbnRgIHRoYXQgcmVwcmVzZW50c1xuICAqICAgdGhlIG9mZnNldCBmcm9tIGBwb2ludGVyQ2VudGVyYCB0byB0aGUgY29udHJvbCBrbm9iIHdoZW4gdXNlclxuICAqICAgaW50ZXJhY3Rpb24gc3RhcnRlZC5cbiAgKi9cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCBmaXhlZEFuY2hvciwgcG9pbnRlclRvS25vYk9mZnNldCkge1xuICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICBpZiAocG9pbnRlclN0eWxlID09PSBudWxsKSB7IHJldHVybjsgfVxuXG4gICAgLy8gQXJjIGFuY2hvciBpcyBhbHdheXMgZHJhd24gd2l0aG91dCBmaWxsXG4gICAgbGV0IGFuY2hvclN0eWxlID0gcG9pbnRlclN0eWxlLmFwcGVuZFN0eWxlKHRoaXMucmFjLkZpbGwubm9uZSk7XG4gICAgZml4ZWRBbmNob3IuZHJhdyhhbmNob3JTdHlsZSk7XG5cbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmFuZ2xlRGlzdGFuY2UoKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShhbmdsZURpc3RhbmNlLm11bHRPbmUoaXRlbSkpO1xuICAgICAgbGV0IG1hcmtlclBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1hcmtlckFuZ2xlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIG1hcmtlckFuZ2xlLnBlcnBlbmRpY3VsYXIoIWZpeGVkQW5jaG9yLmNsb2Nrd2lzZSkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gTGltaXQgbWFya2Vyc1xuICAgIGlmICh0aGlzLnN0YXJ0TGltaXQgPiAwKSB7XG4gICAgICBsZXQgbWluQW5nbGUgPSBmaXhlZEFuY2hvci5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnN0YXJ0TGltaXQpKTtcbiAgICAgIGxldCBtaW5Qb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtaW5BbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtaW5BbmdsZS5wZXJwZW5kaWN1bGFyKGZpeGVkQW5jaG9yLmNsb2Nrd2lzZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1pblBvaW50LCBtYXJrZXJBbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5kTGltaXQgPCAxKSB7XG4gICAgICBsZXQgbWF4QW5nbGUgPSBmaXhlZEFuY2hvci5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLmVuZExpbWl0KSk7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWF4QW5nbGUpO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gbWF4QW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWF4UG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWdtZW50IGZyb20gcG9pbnRlciB0byBjb250cm9sIGRyYWdnZWQgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRDZW50ZXIgPSBwb2ludGVyVG9Lbm9iT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBkcmFnZ2VkIGNlbnRlciwgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIGRyYWdnZWRDZW50ZXIuYXJjKDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcocG9pbnRlclN0eWxlKTtcblxuICAgIC8vIFRPRE86IGltcGxlbWVudCBhcmMgY29udHJvbCBkcmFnZ2luZyB2aXN1YWxzIVxuICB9XG5cbn0gLy8gY2xhc3MgQXJjQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQXJjQ29udHJvbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQWJzdHJhY3QgY2xhc3MgZm9yIGNvbnRyb2xzIHRoYXQgc2VsZWN0IGEgdmFsdWUgd2l0aGluIGEgcmFuZ2UuXG4qXG4qIENvbnRyb2xzIG1heSB1c2UgYW4gYGFuY2hvcmAgb2JqZWN0IHRvIGRldGVybWluZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mXG4qIHRoZSBjb250cm9sJ3MgaW50ZXJhY3RpdmUgZWxlbWVudHMuIEVhY2ggaW1wbGVtZW50YXRpb24gZGV0ZXJtaW5lcyB0aGVcbiogY2xhc3MgdXNlZCBmb3IgdGhpcyBgYW5jaG9yYCwgZm9yIGV4YW1wbGVcbiogYFtBcmNDb250cm9sXXtAbGluayBSYWMuQXJjQ29udHJvbH1gIHVzZXMgYW4gYFtBcmNde0BsaW5rIFJhYy5BcmN9YCBhc1xuKiBhbmNob3IsIHdoaWNoIGRlZmluZXMgd2hlcmUgdGhlIGNvbnRyb2wgaXMgZHJhd24sIHdoYXQgb3JpZW50YXRpb24gaXRcbiogdXNlcywgYW5kIHRoZSBwb3NpdGlvbiBvZiB0aGUgY29udHJvbCBrbm9iIHRocm91Z2ggdGhlIHJhbmdlIG9mIHBvc3NpYmxlXG4qIHZhbHVlcy5cbipcbiogQSBjb250cm9sIGtlZXBzIGEgYHZhbHVlYCBwcm9wZXJ0eSBpbiB0aGUgcmFuZ2UgKlswLDFdKiBmb3IgdGhlIGN1cnJlbnRseVxuKiBzZWxlY3RlZCB2YWx1ZS5cbipcbiogVGhlIGBwcm9qZWN0aW9uU3RhcnRgIGFuZCBgcHJvamVjdGlvbkVuZGAgcHJvcGVydGllcyBjYW4gYmUgdXNlZCB0b1xuKiBwcm9qZWN0IGB2YWx1ZWAgaW50byB0aGUgcmFuZ2UgYFtwcm9qZWN0aW9uU3RhcnQscHJvamVjdGlvbkVuZF1gIGJ5IHVzaW5nXG4qIHRoZSBgcHJvamVjdGVkVmFsdWUoKWAgbWV0aG9kLiBCeSBkZWZhdWx0IHNldCB0byAqWzAsMV0qLlxuKlxuKiBUaGUgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIGNhbiBiZSB1c2VkIHRvIHJlc3RyYWluIHRoZSBhbGxvd2FibGVcbiogdmFsdWVzIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi4gQnkgZGVmYXVsdCBzZXQgdG9cbiogKlswLDFdKi5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgQ29udHJvbCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29udHJvbGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGNvbnRyb2wsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHZhbHVlKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHZhbHVlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBDdXJyZW50IHNlbGVjdGVkIHZhbHVlLCBpbiB0aGUgcmFuZ2UgKlswLDFdKi5cbiAgICAqXG4gICAgKiBNYXkgYmUgZnVydGhlciBjb25zdHJhaW5lZCB0byBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgLyoqXG4gICAgKiBbUHJvamVjdGVkIHZhbHVlXXtAbGluayBSYWMuQ29udHJvbCNwcm9qZWN0ZWRWYWx1ZX0gdG8gdXNlIHdoZW5cbiAgICAqIGB2YWx1ZWAgaXMgYDBgLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAwXG4gICAgKi9cbiAgICB0aGlzLnByb2plY3Rpb25TdGFydCA9IDA7XG5cbiAgICAvKipcbiAgICAqIFtQcm9qZWN0ZWQgdmFsdWVde0BsaW5rIFJhYy5Db250cm9sI3Byb2plY3RlZFZhbHVlfSB0byB1c2Ugd2hlblxuICAgICogYHZhbHVlYCBpcyBgMWAuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqIEBkZWZhdWx0IDFcbiAgICAqL1xuICAgIHRoaXMucHJvamVjdGlvbkVuZCA9IDE7XG5cbiAgICAvKipcbiAgICAqIE1pbmltdW0gYHZhbHVlYCB0aGF0IGNhbiBiZSBzZWxlY3RlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqIEBkZWZhdWx0IDBcbiAgICAqL1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IDA7XG5cbiAgICAvKipcbiAgICAqIE1heGltdW0gYHZhbHVlYCB0aGF0IGNhbiBiZSBzZWxlY3RlZCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqIEBkZWZhdWx0IDFcbiAgICAqL1xuICAgIHRoaXMuZW5kTGltaXQgPSAxO1xuXG4gICAgLyoqXG4gICAgKiBDb2xsZWN0aW9uIG9mIHZhbHVlcyBhdCB3aGljaCB2aXN1YWwgbWFya2VycyBhcmUgZHJhd24uXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcltdfVxuICAgICogQGRlZmF1bHQgW11cbiAgICAqL1xuICAgIHRoaXMubWFya2VycyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBTdHlsZSB0byBhcHBseSB3aGVuIGRyYXdpbmcuIFRoaXMgc3R5bGUgZ2V0cyBhcHBsaWVkIGFmdGVyXG4gICAgKiBgW3JhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZV17QGxpbmsgUmFjLkNvbnRyb2xsZXIjY29udHJvbFN0eWxlfWAuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gW3N0eWxlPW51bGxdXG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdmFsdWVgIHByb2plY3RlZCBpbnRvIHRoZSByYW5nZVxuICAqIGBbcHJvamVjdGlvblN0YXJ0LHByb2plY3Rpb25FbmRdYC5cbiAgKlxuICAqIEJ5IGRlZmF1bHQgdGhlIHByb2plY3Rpb24gcmFuZ2UgaXMgKlswLDFdKiwgaW4gd2hpY2ggY2FzZSBgdmFsdWVgIGFuZFxuICAqIGBwcm9qZWN0ZWRWYWx1ZSgpYCBhcmUgZXF1YWwuXG4gICpcbiAgKiBQcm9qZWN0aW9uIHJhbmdlcyB3aXRoIGEgbmVnYXRpdmUgZGlyZWN0aW9uIChFLmcuICpbNTAsMzBdKiwgd2hlblxuICAqIGBwcm9qZWN0aW9uU3RhcnRgIGlzIGdyZWF0ZXIgdGhhdCBgcHJvamVjdGlvbkVuZGApIGFyZSBzdXBwb3J0ZWQuIEFzXG4gICogYHZhbHVlYCBpbmNyZWFzZXMsIHRoZSBwcm9qZWN0aW9uIHJldHVybmVkIGRlY3JlYXNlcyBmcm9tXG4gICogYHByb2plY3Rpb25TdGFydGAgdW50aWwgcmVhY2hpbmcgYHByb2plY3Rpb25FbmRgLlxuICAqXG4gICogPiBFLmcuXG4gICogPiBgYGBcbiAgKiA+IEZvciBhIGNvbnRyb2wgd2l0aCBhIHByb2plY3Rpb24gcmFuZ2Ugb2YgWzEwMCwyMDBdXG4gICogPiArIHdoZW4gdmFsdWUgaXMgMCwgICBwcm9qZWN0aW9uVmFsdWUoKSBpcyAxMDBcbiAgKiA+ICsgd2hlbiB2YWx1ZSBpcyAwLjUsIHByb2plY3Rpb25WYWx1ZSgpIGlzIDE1MFxuICAqID4gKyB3aGVuIHZhbHVlIGlzIDEsICAgcHJvamVjdGlvblZhbHVlKCkgaXMgMjAwXG4gICogPlxuICAqID4gRm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbNTAsMzBdXG4gICogPiArIHdoZW4gdmFsdWUgaXMgMCwgICBwcm9qZWN0aW9uVmFsdWUoKSBpcyA1MFxuICAqID4gKyB3aGVuIHZhbHVlIGlzIDAuNSwgcHJvamVjdGlvblZhbHVlKCkgaXMgNDBcbiAgKiA+ICsgd2hlbiB2YWx1ZSBpcyAxLCAgIHByb2plY3Rpb25WYWx1ZSgpIGlzIDMwXG4gICogPiBgYGBcbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHByb2plY3RlZFZhbHVlKCkge1xuICAgIGxldCBwcm9qZWN0aW9uUmFuZ2UgPSB0aGlzLnByb2plY3Rpb25FbmQgLSB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgICByZXR1cm4gKHRoaXMudmFsdWUgKiBwcm9qZWN0aW9uUmFuZ2UpICsgdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gIH1cblxuICAvLyBUT0RPOiByZWludHJvZHVjZSB3aGVuIHRlc3RlZFxuICAvLyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMV0qIGZvciB0aGVcbiAgLy8gYHByb2plY3RlZFZhbHVlYCBpbiB0aGUgcmFuZ2UgYFtwcm9qZWN0aW9uU3RhcnQscHJvamVjdGlvbkVuZF1gLlxuICAvLyB2YWx1ZU9mUHJvamVjdGVkKHByb2plY3RlZFZhbHVlKSB7XG4gIC8vICAgbGV0IHByb2plY3Rpb25SYW5nZSA9IHRoaXMucHJvamVjdGlvbkVuZCAtIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICAvLyAgIHJldHVybiAocHJvamVjdGVkVmFsdWUgLSB0aGlzLnByb2plY3Rpb25TdGFydCkgLyBwcm9qZWN0aW9uUmFuZ2U7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGAxYCwgY29ycmVzcG9uZGluZ2x5LlxuICAqXG4gICogPiBFLmcuXG4gICogPiBgYGBcbiAgKiA+IGNvbnRyb2wuc2V0TGltaXRzV2l0aEluc2V0cygwLjEsIDAuMilcbiAgKiA+IC8vIHNldHMgc3RhcnRMaW1pdCBhcyAwLjFcbiAgKiA+IC8vIHNldHMgZW5kTGltaXQgICBhcyAwLjhcbiAgKiA+IGBgYFxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kSW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSBzdGFydEluc2V0O1xuICAgIHRoaXMuZW5kTGltaXQgPSAxIC0gZW5kSW5zZXQ7XG4gIH1cblxuXG4gIC8vIFRPRE86IHJlaW50cm9kdWNlIHdoZW4gdGVzdGVkXG4gIC8vIFNldHMgYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdHdvIGluc2V0IHZhbHVlcyByZWxhdGl2ZSB0byB0aGVcbiAgLy8gWzAsMV0gcmFuZ2UuXG4gIC8vIHNldExpbWl0c1dpdGhQcm9qZWN0aW9uSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gIC8vICAgdGhpcy5zdGFydExpbWl0ID0gdGhpcy52YWx1ZU9mKHN0YXJ0SW5zZXQpO1xuICAvLyAgIHRoaXMuZW5kTGltaXQgPSB0aGlzLnZhbHVlT2YoMSAtIGVuZEluc2V0KTtcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogQWRkcyBhIG1hcmtlciBhdCB0aGUgY3VycmVudCBgdmFsdWVgLlxuICAqL1xuICBhZGRNYXJrZXJBdEN1cnJlbnRWYWx1ZSgpIHtcbiAgICB0aGlzLm1hcmtlcnMucHVzaCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhpcyBjb250cm9sIGlzIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbC5cbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBpc1NlbGVjdGVkKCkge1xuICAgIGlmICh0aGlzLnJhYy5jb250cm9sbGVyLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yYWMuY29udHJvbGxlci5zZWxlY3Rpb24uY29udHJvbCA9PT0gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEByZXR1cm4ge1JhYy5Qb2ludH1cbiAgKi9cbiAga25vYigpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBhbmNob3IgdG8gYmUgcGVyc2l0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGRldGVybWluZXMgdGhlIHR5cGUgdXNlZCBmb3IgYGFuY2hvcmAgYW5kXG4gICogYGFmZml4QW5jaG9yKClgLlxuICAqXG4gICogVGhpcyBmaXhlZCBhbmNob3IgaXMgcGFzc2VkIGJhY2sgdG8gdGhlIGNvbnRyb2wgdGhyb3VnaFxuICAqIGBbdXBkYXRlV2l0aFBvaW50ZXJde0BsaW5rIFJhYy5Db250cm9sI3VwZGF0ZVdpdGhQb2ludGVyfWAgYW5kXG4gICogYFtkcmF3U2VsZWN0aW9uXXtAbGluayBSYWMuQ29udHJvbCNkcmF3U2VsZWN0aW9ufWAgZHVyaW5nIHVzZXJcbiAgKiBpbnRlcmFjdGlvbi5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICovXG4gIGRyYXcoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbiAgLyoqXG4gICogVXBkYXRlcyBgdmFsdWVgIHVzaW5nIGBwb2ludGVyS25vYkNlbnRlcmAgaW4gcmVsYXRpb24gdG8gYGZpeGVkQW5jaG9yYC5cbiAgKiBDYWxsZWQgYnkgYFtyYWMuY29udHJvbGxlci5wb2ludGVyRHJhZ2dlZF17QGxpbmsgUmFjLkNvbnRyb2xsZXIjcG9pbnRlckRyYWdnZWR9YFxuICAqIGFzIHRoZSB1c2VyIGludGVyYWN0cyB3aXRoIHRoZSBjb250cm9sLlxuICAqXG4gICogRWFjaCBpbXBsZW1lbnRhdGlvbiBpbnRlcnByZXRzIGBwb2ludGVyS25vYkNlbnRlcmAgYWdhaW5zdCBgZml4ZWRBbmNob3JgXG4gICogdG8gdXBkYXRlIGl0cyBvd24gdmFsdWUuIFRoZSBjdXJyZW50IGBhbmNob3JgIGlzIG5vdCB1c2VkIGZvciB0aGlzXG4gICogdXBkYXRlIHNpbmNlIGBhbmNob3JgIGNvdWxkIGNoYW5nZSBkdXJpbmcgcmVkcmF3IGluIHJlc3BvbnNlIHRvIHVwZGF0ZXNcbiAgKiBpbiBgdmFsdWVgLlxuICAqXG4gICogRWFjaCBpbXBsZW1lbnRhdGlvbiBpcyBhbHNvIHJlc3BvbnNpYmxlIG9mIGtlZXBpbmcgdGhlIHVwZGF0ZWQgYHZhbHVlYFxuICAqIHdpdGhpbiB0aGUgcmFuZ2UgYFtzdGFydExpbWl0LGVuZExpbWl0XWAuIFRoaXMgbWV0aG9kIGlzIHRoZSBvbmx5IHBhdGhcbiAgKiBmb3IgdXBkYXRpbmcgdGhlIGNvbnRyb2wgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLCBhbmQgdGh1cyB0aGUgb25seVxuICAqIHBsYWNlIHdoZXJlIGVhY2ggaW1wbGVtZW50YXRpb24gbXVzdCBlbmZvcmNlIGEgdmFsaWQgYHZhbHVlYCB3aXRoaW5cbiAgKiAqWzAsMV0qIGFuZCBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlcktub2JDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIGtub2IgY2VudGVyXG4gICogICBhcyBpbnRlcmFjdGVkIGJ5IHRoZSB1c2VyIHBvaW50ZXJcbiAgKiBAcGFyYW0ge29iamVjdH0gZml4ZWRBbmNob3IgLSBBbmNob3IgcHJvZHVjZWQgd2hlbiB1c2VyIGludGVyYWN0aW9uXG4gICogICBzdGFydGVkXG4gICovXG4gIHVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJLbm9iQ2VudGVyLCBmaXhlZEFuY2hvcikge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICogQ2FsbGVkIGJ5IGBbcmFjLmNvbnRyb2xsZXIuZHJhd0NvbnRyb2xzXXtAbGluayBSYWMuQ29udHJvbGxlciNkcmF3Q29udHJvbHN9YFxuICAqIG9ubHkgZm9yIHRoZSBzZWxlY3RlZCBjb250cm9sLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSB1c2VyIHBvaW50ZXJcbiAgKiBAcGFyYW0ge29iamVjdH0gZml4ZWRBbmNob3IgLSBBbmNob3Igb2YgdGhlIGNvbnRyb2wgcHJvZHVjZWQgd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gcG9pbnRlclRvS25vYk9mZnNldCAtIEEgYFNlZ21lbnRgIHRoYXQgcmVwcmVzZW50c1xuICAqICAgdGhlIG9mZnNldCBmcm9tIGBwb2ludGVyQ2VudGVyYCB0byB0aGUgY29udHJvbCBrbm9iIHdoZW4gdXNlclxuICAqICAgaW50ZXJhY3Rpb24gc3RhcnRlZC5cbiAgKi9cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCBmaXhlZEFuY2hvciwgcG9pbnRlclRvS25vYk9mZnNldCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG59IC8vIGNsYXNzIENvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2w7XG5cblxuLy8gQ29udHJvbHMgc2hhcmVkIGRyYXdpbmcgZWxlbWVudHNcblxuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSA9IGZ1bmN0aW9uKHJhYywgY2VudGVyLCBhbmdsZSkge1xuICAvLyBBcmNcbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSByYWMuQW5nbGUuZnJvbSgxLzIyKTtcbiAgbGV0IGFyYyA9IGNlbnRlci5hcmMocmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDEuNSxcbiAgICBhbmdsZS5zdWJ0cmFjdChhbmdsZURpc3RhbmNlKSwgYW5nbGUuYWRkKGFuZ2xlRGlzdGFuY2UpKTtcblxuICAvLyBBcnJvdyB3YWxsc1xuICBsZXQgcG9pbnRBbmdsZSA9IHJhYy5BbmdsZS5mcm9tKDEvOCk7XG4gIGxldCByaWdodFdhbGwgPSBhcmMuc3RhcnRQb2ludCgpLnJheShhbmdsZS5hZGQocG9pbnRBbmdsZSkpO1xuICBsZXQgbGVmdFdhbGwgPSBhcmMuZW5kUG9pbnQoKS5yYXkoYW5nbGUuc3VidHJhY3QocG9pbnRBbmdsZSkpO1xuXG4gIC8vIEFycm93IHBvaW50XG4gIGxldCBwb2ludCA9IHJpZ2h0V2FsbC5wb2ludEF0SW50ZXJzZWN0aW9uKGxlZnRXYWxsKTtcblxuICAvLyBTaGFwZVxuICByYWMucHVzaFNoYXBlKCk7XG4gIHBvaW50LnNlZ21lbnRUb1BvaW50KGFyYy5zdGFydFBvaW50KCkpXG4gICAgLmF0dGFjaFRvU2hhcGUoKTtcbiAgYXJjLmF0dGFjaFRvU2hhcGUoKTtcbiAgYXJjLmVuZFBvaW50KCkuc2VnbWVudFRvUG9pbnQocG9pbnQpXG4gICAgLmF0dGFjaFRvU2hhcGUoKTtcblxuICByZXR1cm4gcmFjLnBvcFNoYXBlKCk7XG59O1xuXG5Db250cm9sLm1ha2VMaW1pdE1hcmtlciA9IGZ1bmN0aW9uKHJhYywgcG9pbnQsIGFuZ2xlKSB7XG4gIGFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICBsZXQgcGVycGVuZGljdWxhciA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZmFsc2UpO1xuICBsZXQgY29tcG9zaXRlID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcblxuICBwb2ludC5zZWdtZW50VG9BbmdsZShwZXJwZW5kaWN1bGFyLCA0KVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oNClcbiAgICAuYXR0YWNoVG8oY29tcG9zaXRlKTtcbiAgcG9pbnQucG9pbnRUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIDgpLmFyYygzKVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuXG4gIHJldHVybiBjb21wb3NpdGU7XG59O1xuXG5Db250cm9sLm1ha2VWYWx1ZU1hcmtlciA9IGZ1bmN0aW9uKHJhYywgcG9pbnQsIGFuZ2xlKSB7XG4gIGFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICByZXR1cm4gcG9pbnQuc2VnbWVudFRvQW5nbGUoYW5nbGUucGVycGVuZGljdWxhcigpLCAzKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oMyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBJbmZvcm1hdGlvbiByZWdhcmRpbmcgdGhlIGN1cnJlbnRseSBzZWxlY3RlZFxuKiBgW0NvbnRyb2xde0BsaW5rIFJhYy5Db250cm9sfWAuXG4qXG4qIENyZWF0ZWQgYW5kIGtlcHQgYnkgYFtDb250cm9sbGVyXXtAbGluayBSYWMuQ29udHJvbGxlcn1gIHdoZW4gYSBjb250cm9sXG4qIGJlY29tZXMgc2VsZWN0ZWQuXG4qXG4qIEBhbGlhcyBSYWMuQ29udHJvbGxlci5TZWxlY3Rpb25cbiovXG5jbGFzcyBDb250cm9sU2VsZWN0aW9ue1xuXG4gIC8qKlxuICAqIEJ1aWxkcyBhIG5ldyBgU2VsZWN0aW9uYCB3aXRoIHRoZSBnaXZlbiBgY29udHJvbGAgYW5kIHBvaW50ZXIgbG9jYXRlZFxuICAqIGF0IGBwb2ludGVyQ2VudGVyYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbnRyb2x9IGNvbnRyb2wgLSBUaGUgc2VsZWN0ZWQgY29udHJvbFxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIG9mIHRoZSBwb2ludGVyIHdoZW5cbiAgKiAgIHRoZSBzZWxlY3Rpb24gc3RhcnRlZFxuICAqL1xuICBjb25zdHJ1Y3Rvcihjb250cm9sLCBwb2ludGVyQ2VudGVyKSB7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzZWxlY3RlZCBjb250cm9sLlxuICAgICogQHR5cGUge1JhYy5Db250cm9sfVxuICAgICovXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcblxuICAgIC8qKlxuICAgICogQW5jaG9yIHByb2R1Y2VkIGJ5XG4gICAgKiBgW2NvbnRyb2wuYWZmaXhBbmNob3Jde0BsaW5rIFJhYy5Db250cm9sI2FmZml4QW5jaG9yfWAgd2hlbiB0aGVcbiAgICAqIHNlbGVjdGlvbiBiZWdhbi5cbiAgICAqXG4gICAgKiBUaGlzIGFuY2hvciBpcyBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24gYXMgdG8gYWxsb3cgdGhlIHVzZXJcbiAgICAqIHRvIGludGVyYWN0IHdpdGggdGhlIHNlbGVjdGVkIGNvbnRyb2wgaW4gYSBmaXhlZCBsb2NhdGlvbiwgZXZlbiBpZlxuICAgICogdGhlIGNvbnRyb2wgbW92ZXMgZHVyaW5nIHRoZSBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5maXhlZEFuY2hvciA9IGNvbnRyb2wuYWZmaXhBbmNob3IoKTtcblxuICAgIC8qKlxuICAgICogYFNlZ21lbnRgIHRoYXQgcmVwcmVzZW50cyB0aGUgb2Zmc2V0IGZyb20gdGhlIHBvaW50ZXIgcG9zaXRpb24gdG8gdGhlXG4gICAgKiBjb250cm9sIGtub2IgY2VudGVyLlxuICAgICpcbiAgICAqIFVzZWQgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgY29udHJvbCBrbm9iIGF0IGEgY29uc3RhbnQgb2Zmc2V0IHBvc2l0aW9uXG4gICAgKiBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgcG9pbnRlciBzdGFydGluZyBsb2NhdGlvbiBpcyBlcXVhbCB0byBgc2VnbWVudC5zdGFydFBvaW50KClgLFxuICAgICogdGhlIGNvbnRyb2wga25vYiBjZW50ZXIgc3RhcnRpbmcgcG9zaXRpb24gaXMgZXF1YWwgdG9cbiAgICAqIGBzZWdtZW50LmVuZFBvaW50KClgLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuU2VnbWVudH1cbiAgICAqL1xuICAgIHRoaXMucG9pbnRlclRvS25vYk9mZnNldCA9IHBvaW50ZXJDZW50ZXIuc2VnbWVudFRvUG9pbnQoY29udHJvbC5rbm9iKCkpO1xuICB9XG5cbiAgZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyKSB7XG4gICAgdGhpcy5jb250cm9sLmRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgdGhpcy5maXhlZEFuY2hvciwgdGhpcy5wb2ludGVyVG9Lbm9iT2Zmc2V0KTtcbiAgfVxufVxuXG5cbi8qKlxuKiBNYW5hZ2VyIG9mIGludGVyYWN0aXZlIGBbQ29udHJvbF17QGxpbmsgUmFjLkNvbnRyb2x9YHMgZm9yIGFuIGluc3RhbmNlXG4qIG9mIGBSYWNgLlxuKlxuKiBDb250YWlucyBhIGxpc3Qgb2YgYWxsIG1hbmFnZWQgY29udHJvbHMgYW5kIGNvb3JkaW5hdGVzIGRyYXdpbmcgYW5kIHVzZXJcbiogaW50ZXJhY3Rpb24gYmV0d2VlbiB0aGVtLlxuKlxuKiBGb3IgY29udHJvbHMgdG8gYmUgZnVuY3Rpb25hbCB0aGUgYHBvaW50ZXJQcmVzc2VkYCwgYHBvaW50ZXJSZWxlYXNlZGAsXG4qIGFuZCBgcG9pbnRlckRyYWdnZWRgIG1ldGhvZHMgaGF2ZSB0byBiZSBjYWxsZWQgYXMgcG9pbnRlciBpbnRlcmFjdGlvbnNcbiogaGFwcGVuLiBUaGUgYGRyYXdDb250cm9sc2AgbWV0aG9kIGhhbmRsZXMgdGhlIGRyYXdpbmcgb2YgYWxsIGNvbnRyb2xzXG4qIGFuZCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGNvbnRyb2wsIGl0IGlzIHVzdWFsbHkgY2FsbGVkIGF0IHRoZSB2ZXJ5IGVuZFxuKiBvZiBkcmF3aW5nLlxuKlxuKiBBbHNvIGNvbnRhaW5zIHNldHRpbmdzIHNoYXJlZCBiZXR3ZWVuIGFsbCBjb250cm9scyBhbmQgdXNlZCBmb3IgdXNlclxuKiBpbnRlcmFjdGlvbiwgbGlrZSBgcG9pbnRlclN0eWxlYCB0byBkcmF3IHRoZSBwb2ludGVyLCBgY29udHJvbFN0eWxlYCBhc1xuKiBhIGRlZmF1bHQgc3R5bGUgZm9yIGRyYXdpbmcgY29udHJvbHMsIGFuZCBga25vYlJhZGl1c2AgdGhhdCBkZWZpbmVzIHRoZVxuKiBzaXplIG9mIHRoZSBpbnRlcmFjdGl2ZSBlbGVtZW50IG9mIG1vc3QgY29udHJvbHMuXG4qXG4qIEBhbGlhcyBSYWMuQ29udHJvbGxlclxuKi9cbmNsYXNzIENvbnRyb2xsZXIge1xuXG4gIHN0YXRpYyBTZWxlY3Rpb24gPSBDb250cm9sU2VsZWN0aW9uO1xuXG5cbiAgLyoqXG4gICogQnVpbGRzIGEgbmV3IGBDb250cm9sbGVyYCB3aXRoIHRoZSBnaXZlbiBgUmFjYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjKSB7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogRGlzdGFuY2UgYXQgd2hpY2ggdGhlIHBvaW50ZXIgaXMgY29uc2lkZXJlZCB0byBpbnRlcmFjdCB3aXRoIGFcbiAgICAqIGNvbnRyb2wga25vYi4gQWxzbyB1c2VkIGJ5IGNvbnRyb2xzIGZvciBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmtub2JSYWRpdXMgPSAyMjtcblxuICAgIC8qKlxuICAgICogQ29sbGVjdGlvbiBvZiBhbGwgY29udHJvbGxzIG1hbmFnZWQgYnkgdGhlIGluc3RhbmNlLiBDb250cm9scyBpbiB0aGlzXG4gICAgKiBsaXN0IGFyZSBjb25zaWRlcmVkIGZvciBwb2ludGVyIGhpdCB0ZXN0aW5nIGFuZCBmb3IgZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkNvbnRyb2xbXX1cbiAgICAqIEBkZWZhdWx0IFtdXG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2xzID0gW107XG5cbiAgICAvKipcbiAgICAqIEluZGljYXRlcyBjb250cm9scyB0byBhZGQgdGhlbXNlbHZlcyBpbnRvIGB0aGlzLmNvbnRyb2xzYCB3aGVuXG4gICAgKiBjcmVhdGVkLlxuICAgICpcbiAgICAqIFRoaXMgcHJvcGVydHkgaXMgYSBzaGFyZWQgY29uZmlndXJhdGlvbi4gVGhlIGJlaGF2aW91ciBpcyBpbXBsZW1lbnRlZFxuICAgICogaW5kZXBlbmRlbnRseSBieSBlYWNoIGNvbnRyb2wgY29uc3RydWN0b3IuXG4gICAgKlxuICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgKi9cbiAgICB0aGlzLmF1dG9BZGRDb250cm9scyA9IHRydWU7XG5cbiAgICAvLyBUT0RPOiBzZXBhcmF0ZSBsYXN0Q29udHJvbCBmcm9tIGxhc3RQb2ludGVyXG5cbiAgICAvLyBMYXN0IGBQb2ludGAgb2YgdGhlIHBvc2l0aW9uIHdoZW4gdGhlIHBvaW50ZXIgd2FzIHByZXNzZWQsIG9yIGxhc3RcbiAgICAvLyBDb250cm9sIGludGVyYWN0ZWQgd2l0aC4gU2V0IHRvIGBudWxsYCB3aGVuIHRoZXJlIGhhcyBiZWVuIG5vXG4gICAgLy8gaW50ZXJhY3Rpb24geWV0IGFuZCB3aGlsZSB0aGVyZSBpcyBhIHNlbGVjdGVkIGNvbnRyb2wuXG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIG9iamVjdCB1c2VkIGZvciB0aGUgdmlzdWFsIGVsZW1lbnRzIHJlbGF0ZWQgdG8gcG9pbnRlclxuICAgICogaW50ZXJhY3Rpb24gYW5kIGNvbnRyb2wgc2VsZWN0aW9uLiBXaGVuIGBudWxsYCBubyBwb2ludGVyIG9yXG4gICAgKiBzZWxlY3Rpb24gdmlzdWFscyBhcmUgZHJhd24uXG4gICAgKlxuICAgICogQnkgZGVmYXVsdCBjb250YWlucyBhIHN0eWxlIHRoYXQgdXNlcyB0aGUgY3VycmVudCBzdHJva2VcbiAgICAqIGNvbmZpZ3VyYXRpb24gd2l0aCBuby1maWxsLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9XG4gICAgKiBAZGVmYXVsdCB7QGxpbmsgaW5zdGFuY2UuRmlsbCNub25lfVxuICAgICovXG4gICAgdGhpcy5wb2ludGVyU3R5bGUgPSByYWMuRmlsbC5ub25lO1xuXG4gICAgLyoqXG4gICAgKiBEZWZhdWx0IHN0eWxlIHRvIGFwcGx5IGZvciBhbGwgY29udHJvbHMuIFdoZW4gc2V0IGl0IGlzIGFwcGxpZWRcbiAgICAqIGJlZm9yZSBjb250cm9sIGRyYXdpbmcuIFRoZSBpbmRpdmlkdWFsIGNvbnRyb2wgc3R5bGUgaW5cbiAgICAqIGBbY29udHJvbC5zdHlsZV17QGxpbmsgUmFjLkNvbnRyb2wjc3R5bGV9YCBpcyBhcHBsaWVkIGFmdGVyd2FyZHMuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn1cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuY29udHJvbFN0eWxlID0gbnVsbFxuXG4gICAgLyoqXG4gICAgKiBTZWxlY3Rpb24gaW5mb3JtYXRpb24gZm9yIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbCwgb3IgYG51bGxgXG4gICAgKiB3aGVuIHRoZXJlIGlzIG5vIHNlbGVjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5Db250cm9sbGVyLlNlbGVjdGlvbn1cbiAgICAqL1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcblxuICB9IC8vIGNvbnN0cnVjdG9yXG5cblxuICAvKipcbiAgKiBQdXNoZXMgYGNvbnRyb2xgIGludG8gYHRoaXMuY29udHJvbHNgLCBhbGxvd2luZyB0aGUgaW5zdGFuY2UgdG8gaGFuZGxlXG4gICogcG9pbnRlciBpbnRlcmFjdGlvbiBhbmQgZHJhd2luZyBvZiBgY29udHJvbGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Db250cm9sfSBjb250cm9sIC0gQSBgQ29udHJvbGAgdG8gYWRkIGludG8gYGNvbnRyb2xzYFxuICAqL1xuICBhZGQoY29udHJvbCkge1xuICAgIHRoaXMuY29udHJvbHMucHVzaChjb250cm9sKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gcHJlc3NlZCBhdCB0aGVcbiAgKiBgcG9pbnRlckNlbnRlcmAgbG9jYXRpb24uIEFsbCBjb250cm9scyBhcmUgaGl0IHRlc3RlZCBhbmQgdGhlIGZpcnN0XG4gICogY29udHJvbCB0byBiZSBoaXQgaXMgbWFya2VkIGFzIHNlbGVjdGVkLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBhbG9uZyBwb2ludGVyIHByZXNzIGludGVyYWN0aW9uIGZvciBhbGxcbiAgKiBtYW5hZ2VkIGNvbnRyb2xzIHRvIHByb3Blcmx5IHdvcmsuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgcG9pbnRlciB3YXNcbiAgKiAgIHByZXNzZWRcbiAgKi9cbiAgcG9pbnRlclByZXNzZWQocG9pbnRlckNlbnRlcikge1xuICAgIHRoaXMubGFzdFBvaW50ZXIgPSBudWxsO1xuXG4gICAgLy8gVGVzdCBwb2ludGVyIGhpdFxuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5jb250cm9scy5maW5kKCBpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvbnRyb2xLbm9iID0gaXRlbS5rbm9iKCk7XG4gICAgICBpZiAoY29udHJvbEtub2IgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBpZiAoY29udHJvbEtub2IuZGlzdGFuY2VUb1BvaW50KHBvaW50ZXJDZW50ZXIpIDw9IHRoaXMua25vYlJhZGl1cykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIGlmIChzZWxlY3RlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBuZXcgQ29udHJvbGxlci5TZWxlY3Rpb24oc2VsZWN0ZWQsIHBvaW50ZXJDZW50ZXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBOb3RpZmllcyB0aGUgaW5zdGFuY2UgdGhhdCB0aGUgcG9pbnRlciBoYXMgYmVlbiBkcmFnZ2VkIHRvIHRoZVxuICAqIGBwb2ludGVyQ2VudGVyYCBsb2NhdGlvbi4gV2hlbiB0aGVyZSBpcyBhIHNlbGVjdGVkIGNvbnRyb2wsIHVzZXJcbiAgKiBpbnRlcmFjdGlvbiBpcyBwZXJmb3JtZWQgYW5kIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgZHJhZyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICBkcmFnZ2VkXG4gICovXG4gIHBvaW50ZXJEcmFnZ2VkKHBvaW50ZXJDZW50ZXIpe1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjb250cm9sID0gdGhpcy5zZWxlY3Rpb24uY29udHJvbDtcbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLnNlbGVjdGlvbi5maXhlZEFuY2hvcjtcblxuICAgIC8vIE9mZnNldCBjZW50ZXIgb2YgZHJhZ2dlZCBjb250cm9sIGtub2IgZnJvbSB0aGUgcG9pbnRlciBwb3NpdGlvblxuICAgIGxldCBwb2ludGVyS25vYkNlbnRlciA9IHRoaXMuc2VsZWN0aW9uLnBvaW50ZXJUb0tub2JPZmZzZXRcbiAgICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICBjb250cm9sLnVwZGF0ZVdpdGhQb2ludGVyKHBvaW50ZXJLbm9iQ2VudGVyLCBmaXhlZEFuY2hvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIHJlbGVhc2VkIGF0IHRoZVxuICAqIGBwb2ludGVyQ2VudGVyYCBsb2NhdGlvbi4gV2hlbiB0aGVyZSBpcyBhIHNlbGVjdGVkIGNvbnRyb2wsIHVzZXJcbiAgKiBpbnRlcmFjdGlvbiBpcyBmaW5hbGl6ZWQgYW5kIHRoZSBjb250cm9sIHNlbGVjdGlvbiBpcyBjbGVhcmVkLlxuICAqXG4gICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBhbG9uZyBwb2ludGVyIGRyYWcgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgcmVsZWFzZWRcbiAgKi9cbiAgcG9pbnRlclJlbGVhc2VkKHBvaW50ZXJDZW50ZXIpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHRoaXMubGFzdFBvaW50ZXIgPSBwb2ludGVyQ2VudGVyO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFBvaW50ZXIgPSB0aGlzLnNlbGVjdGlvbi5jb250cm9sO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgYWxsIGNvbnRyb2xzIGNvbnRhaW5lZCBpblxuICAqIGBbY29udHJvbHNde0BsaW5rIFJhYy5Db250cm9sbGVyI2NvbnRyb2xzfWAgYWxvbmcgdGhlIHZpc3VhbCBlbGVtZW50c1xuICAqIGZvciBwb2ludGVyIGFuZCBjb250cm9sIHNlbGVjdGlvbi5cbiAgKlxuICAqIFVzdWFsbHkgY2FsbGVkIGF0IHRoZSBlbmQgb2YgZHJhd2luZywgYXMgdG8gZHJhdyBjb250cm9scyBvbiB0b3Agb2ZcbiAgKiBvdGhlciBncmFwaGljcy5cbiAgKi9cbiAgZHJhd0NvbnRyb2xzKCkge1xuICAgIGxldCBwb2ludGVyQ2VudGVyID0gdGhpcy5yYWMuUG9pbnQucG9pbnRlcigpO1xuICAgIHRoaXMuZHJhd1BvaW50ZXIocG9pbnRlckNlbnRlcik7XG5cbiAgICAvLyBBbGwgY29udHJvbHMgaW4gZGlzcGxheVxuICAgIHRoaXMuY29udHJvbHMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZHJhdygpKTtcblxuICAgIGlmICh0aGlzLnNlbGVjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZWxlY3Rpb24uZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyKTtcbiAgICB9XG4gIH1cblxuXG4gIGRyYXdQb2ludGVyKHBvaW50ZXJDZW50ZXIpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExhc3QgcG9pbnRlciBvciBjb250cm9sXG4gICAgaWYgKHRoaXMubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuUG9pbnQpIHtcbiAgICAgIHRoaXMubGFzdFBvaW50ZXIuYXJjKDEyKS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxhc3RQb2ludGVyIGluc3RhbmNlb2YgUmFjLkNvbnRyb2wpIHtcbiAgICAgIC8vIFRPRE86IGltcGxlbWVudCBsYXN0IHNlbGVjdGVkIGNvbnRyb2wgc3RhdGVcbiAgICB9XG5cbiAgICAvLyBQb2ludGVyIHByZXNzZWRcbiAgICBpZiAodGhpcy5yYWMuZHJhd2VyLnA1Lm1vdXNlSXNQcmVzc2VkKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgcG9pbnRlckNlbnRlci5hcmMoMTApLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50ZXJDZW50ZXIuYXJjKDUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG59IC8vIGNsYXNzIENvbnRyb2xsZXJcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRyb2wgdGhhdCBhbGxvd3MgdGhlIHNlbGVjdGlvbiBvZiBhIHZhbHVlIHdpdGggYSBrbm9iIHRoYXQgc2xpZGVzXG4qIHRocm91Z2ggdGhlIHNlZ21lbnQgb2YgYSBgUmF5YC5cbipcbiogVXNlcyBhIGBSYXlgIGFzIGBbYW5jaG9yXXtAbGluayBSYWMuUmF5Q29udHJvbCNhbmNob3J9YCwgd2hpY2ggZGVmaW5lc1xuKiB0aGUgcG9zaXRpb24gd2hlcmUgdGhlIGNvbnRyb2wgaXMgZHJhd24uXG4qXG4qIGBbbGVuZ3RoXXtAbGluayBSYWMuUmF5Q29udHJvbCNsZW5ndGh9YCBkZWZpbmVzIHRoZSBsZW5ndGggb2YgdGhlXG4qIHNlZ21lbnQgaW4gdGhlIGBhbmNob3JgIHJheSB3aGljaCBpcyBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4qIFdpdGhpbiB0aGlzIHNlZ21lbnQgdGhlIHVzZXIgY2FuIHNsaWRlIHRoZSBjb250cm9sIGtub2IgdG8gc2VsZWN0IGFcbiogdmFsdWUuXG4qXG4qIEBhbGlhcyBSYWMuUmF5Q29udHJvbFxuKiBAZXh0ZW5kcyBSYWMuQ29udHJvbFxuKi9cbmNsYXNzIFJheUNvbnRyb2wgZXh0ZW5kcyBSYWMuQ29udHJvbCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgUmF5Q29udHJvbGAgaW5zdGFuY2Ugd2l0aCB0aGUgc3RhcnRpbmcgYHZhbHVlYCBhbmQgdGhlXG4gICogaW50ZXJhY3RpdmUgYGxlbmd0aGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGNvbnRyb2wsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBgYW5jaG9yYCByYXkgYXZhaWxhYmxlIGZvclxuICAqICAgdXNlciBpbnRlcmFjdGlvblxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHZhbHVlLCBsZW5ndGgpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCB2YWx1ZSwgbGVuZ3RoKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUsIGxlbmd0aCk7XG5cbiAgICBzdXBlcihyYWMsIHZhbHVlKTtcblxuICAgIC8qKlxuICAgICogTGVuZ3RoIG9mIHRoZSBgYW5jaG9yYCByYXkgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuXG4gICAgLyoqXG4gICAgKiBgUmF5YCB0byB3aGljaCB0aGUgY29udHJvbCB3aWxsIGJlIGFuY2hvcmVkLiBEZWZpbmVzIHRoZSBsb2NhdGlvblxuICAgICogd2hlcmUgdGhlIGNvbnRyb2wgaXMgZHJhd24uXG4gICAgKlxuICAgICogQWxvbmcgd2l0aCBgW2xlbmd0aF17QGxpbmsgUmFjLlJheUNvbnRyb2wjbGVuZ3RofWAgZGVmaW5lcyB0aGVcbiAgICAqIHNlZ21lbnQgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIFRoZSBjb250cm9sIGNhbm5vdCBiZSBkcmF3biBvciBzZWxlY3RlZCB1bnRpbCB0aGlzIHByb3BlcnR5IGlzIHNldC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLlJheT99XG4gICAgKiBAZGVmYXVsdCBudWxsXG4gICAgKi9cbiAgICB0aGlzLmFuY2hvciA9IG51bGw7XG5cbiAgICBpZiAocmFjLmNvbnRyb2xsZXIuYXV0b0FkZENvbnRyb2xzKSB7XG4gICAgICByYWMuY29udHJvbGxlci5hZGQodGhpcyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGB2YWx1ZWAgdXNpbmcgdGhlIHByb2plY3Rpb24gb2YgYGxlbmd0aFZhbHVlYCBpbiB0aGUgYFswLGxlbmd0aF1gXG4gICogcmFuZ2UuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoVmFsdWUgLSBUaGUgbGVuZ3RoIGF0IHdoaWNoIHRvIHNldCB0aGUgY3VycmVudFxuICAqICAgdmFsdWVcbiAgKi9cbiAgc2V0VmFsdWVXaXRoTGVuZ3RoKGxlbmd0aFZhbHVlKSB7XG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbGVuZ3RoVmFsdWUgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYm90aCBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0aGUgZ2l2ZW4gaW5zZXRzIGZyb20gYDBgXG4gICogYW5kIGBsZW5ndGhgLCBjb3JyZXNwb25kaW5nbHksIGJvdGggcHJvamVjdGVkIGluIHRoZSBgWzAsbGVuZ3RoXWBcbiAgKiByYW5nZS5cbiAgKlxuICAqID4gRS5nLlxuICAqID4gYGBgXG4gICogPiAvLyBGb3IgYSBSYXlDb250cm9sIHdpdGggbGVuZ3RoIG9mIDEwMFxuICAqID4gY29udHJvbC5zZXRMaW1pdHNXaXRoTGVuZ3RoSW5zZXRzKDEwLCAyMClcbiAgKiA+IC8vIHNldHMgc3RhcnRMaW1pdCBhcyAwLjEgd2hpY2ggaXMgYXQgbGVuZ3RoIDEwXG4gICogPiAvLyBzZXRzIGVuZExpbWl0ICAgYXMgMC44IHdoaWNoIGlzIGF0IGxlbmd0aCA4MCBmcm9tIDEwMFxuICAqID4gLy8gICAxMCBpbnNldCBmcm9tIDAgPSAxMFxuICAqID4gLy8gICAyMCBpbnNldCBmcm9tIDEwMCA9IDgwXG4gICogPiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydEluc2V0IC0gVGhlIGluc2V0IGZyb20gYDBgIGluIHRoZSByYW5nZVxuICAqICAgYFswLGxlbmd0aF1gIHRvIHVzZSBmb3IgYHN0YXJ0TGltaXRgXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYGxlbmd0aGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsbGVuZ3RoXWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgICB0aGlzLnN0YXJ0TGltaXQgPSBzdGFydEluc2V0IC8gdGhpcy5sZW5ndGg7XG4gICAgdGhpcy5lbmRMaW1pdCA9ICh0aGlzLmxlbmd0aCAtIGVuZEluc2V0KSAvIHRoaXMubGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBgYW5jaG9yYCByYXkgYHN0YXJ0YCBhbmQgdGhlIGNvbnRyb2xcbiAgKiBrbm9iLlxuICAqXG4gICogRXF1aXZhbGVudCB0byB0aGUgY29udHJvbCBgdmFsdWVgIHByb2plY3RlZCB0byB0aGUgcmFuZ2UgYFswLGxlbmd0aF1gLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgZGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoICogdGhpcy52YWx1ZTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogV2hlbiBgYW5jaG9yYCBpcyBub3Qgc2V0LCByZXR1cm5zIGBudWxsYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybiB7UmFjLlBvaW50P31cbiAgKi9cbiAga25vYigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSB0aGUga25vYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5wb2ludEF0RGlzdGFuY2UodGhpcy5kaXN0YW5jZSgpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCB0aGUgYGFuY2hvcmAgcmF5IHdpdGggYGxlbmd0aGAsXG4gICogdG8gYmUgcGVyc2lzdGVkIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBhbmNob3JgIGlzIG5vdCBzZXQuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbihcbiAgICAgICAgYEV4cGVjdGVkIGFuY2hvciB0byBiZSBzZXQsIG51bGwgZm91bmQgaW5zdGVhZGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iuc2VnbWVudCh0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBjdXJyZW50IHN0YXRlLlxuICAqL1xuICBkcmF3KCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gVW5hYmxlIHRvIGRyYXcgd2l0aG91dCBhbmNob3JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZml4ZWRBbmNob3IgPSB0aGlzLmFmZml4QW5jaG9yKCk7XG5cbiAgICBsZXQgY29udHJvbGxlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5jb250cm9sU3R5bGU7XG4gICAgbGV0IGNvbnRyb2xTdHlsZSA9IGNvbnRyb2xsZXJTdHlsZSAhPT0gbnVsbFxuICAgICAgPyBjb250cm9sbGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5zdHlsZSlcbiAgICAgIDogdGhpcy5zdHlsZTtcblxuICAgIGZpeGVkQW5jaG9yLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIGxldCBrbm9iID0gdGhpcy5rbm9iKCk7XG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuYW5nbGUoKTtcblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IHBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgdGhpcy5sZW5ndGggKiBpdGVtKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgcG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wga25vYlxuICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gTmVnYXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA+PSB0aGlzLnN0YXJ0TGltaXQgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VBcnJvd1NoYXBlKHRoaXMucmFjLCBrbm9iLCBhbmdsZS5pbnZlcnNlKCkpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aXZlIGFycm93XG4gICAgaWYgKHRoaXMudmFsdWUgPD0gdGhpcy5lbmRMaW1pdCAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KGNvbnRyb2xTdHlsZSk7XG5cbiAgICAvLyBTZWxlY3Rpb25cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICAgIGlmIChwb2ludGVyU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqXG4gICogYHZhbHVlYCBpcyBhbHdheXMgdXBkYXRlZCBieSB0aGlzIG1ldGhvZCB0byBiZSB3aXRoaW4gKlswLDFdKiBhbmRcbiAgKiBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IGZpeGVkQW5jaG9yIC0gYFNlZ21lbnRgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYFxuICAqICAgd2hlbiB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdDtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMuZW5kTGltaXQpO1xuXG4gICAgLy8gTmV3IHZhbHVlIGZyb20gdGhlIGN1cnJlbnQgcG9pbnRlciBwb3NpdGlvbiwgcmVsYXRpdmUgdG8gZml4ZWRBbmNob3JcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnRlcktub2JDZW50ZXIpO1xuICAgIC8vIENsYW1waW5nIHZhbHVlIChqYXZhc2NyaXB0IGhhcyBubyBNYXRoLmNsYW1wKVxuICAgIG5ld0Rpc3RhbmNlID0gZml4ZWRBbmNob3IuY2xhbXBUb0xlbmd0aChuZXdEaXN0YW5jZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIC8vIFVwZGF0ZSBjb250cm9sIHdpdGggbmV3IGRpc3RhbmNlXG4gICAgbGV0IGxlbmd0aFJhdGlvID0gbmV3RGlzdGFuY2UgLyBsZW5ndGg7XG4gICAgdGhpcy52YWx1ZSA9IGxlbmd0aFJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgc2VsZWN0aW9uIHN0YXRlIGFsb25nIHdpdGggcG9pbnRlciBpbnRlcmFjdGlvbiB2aXN1YWxzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IGZpeGVkQW5jaG9yIC0gYFNlZ21lbnRgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYFxuICAqICAgd2hlbiB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnJhYy5wdXNoQ29tcG9zaXRlKCk7XG4gICAgZml4ZWRBbmNob3IuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIGxldCBhbmdsZSA9IGZpeGVkQW5jaG9yLmFuZ2xlKCk7XG4gICAgbGV0IGxlbmd0aCA9IGZpeGVkQW5jaG9yLmxlbmd0aDtcblxuICAgIC8vIFZhbHVlIG1hcmtlcnNcbiAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtIDwgMCB8fCBpdGVtID4gMSkgeyByZXR1cm4gfVxuICAgICAgbGV0IG1hcmtlclBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogaXRlbSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIG1hcmtlclBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5Qb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdCk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlTGltaXRNYXJrZXIodGhpcy5yYWMsIG1pblBvaW50LCBhbmdsZSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5kTGltaXQgPCAxKSB7XG4gICAgICBsZXQgbWF4UG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiB0aGlzLmVuZExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWF4UG9pbnQsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gU2VnbWVudCBmcm9tIHBvaW50ZXIgdG8gY29udHJvbCBkcmFnZ2VkIGNlbnRlclxuICAgIGxldCBkcmFnZ2VkQ2VudGVyID0gcG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgZHJhZ2dlZCBjZW50ZXIsIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICBkcmFnZ2VkQ2VudGVyLmFyYygyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBDb25zdHJhaW5lZCBsZW5ndGggY2xhbXBlZCB0byBsaW1pdHNcbiAgICBsZXQgY29uc3RyYWluZWRMZW5ndGggPSBmaXhlZEFuY2hvclxuICAgICAgLnJheS5kaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQoZHJhZ2dlZENlbnRlcik7XG4gICAgbGV0IHN0YXJ0SW5zZXQgPSBsZW5ndGggKiB0aGlzLnN0YXJ0TGltaXQ7XG4gICAgbGV0IGVuZEluc2V0ID0gbGVuZ3RoICogKDEgLSB0aGlzLmVuZExpbWl0KTtcbiAgICBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yLmNsYW1wVG9MZW5ndGgoY29uc3RyYWluZWRMZW5ndGgsXG4gICAgICBzdGFydEluc2V0LCBlbmRJbnNldCk7XG5cbiAgICBsZXQgY29uc3RyYWluZWRBbmNob3JDZW50ZXIgPSBmaXhlZEFuY2hvclxuICAgICAgLndpdGhMZW5ndGgoY29uc3RyYWluZWRMZW5ndGgpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIC8vIENvbnRyb2wgY2VudGVyIGNvbnN0cmFpbmVkIHRvIGFuY2hvclxuICAgIGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYWdnZWQgc2hhZG93IGNlbnRlciwgc2VtaSBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgLy8gYWx3YXlzIHBlcnBlbmRpY3VsYXIgdG8gYW5jaG9yXG4gICAgbGV0IGRyYWdnZWRTaGFkb3dDZW50ZXIgPSBkcmFnZ2VkQ2VudGVyXG4gICAgICAuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KGZpeGVkQW5jaG9yLnJheSlcbiAgICAgIC8vIHJldmVyc2UgYW5kIHRyYW5zbGF0ZWQgdG8gY29uc3RyYWludCB0byBhbmNob3JcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoU3RhcnRQb2ludChjb25zdHJhaW5lZEFuY2hvckNlbnRlcilcbiAgICAgIC8vIFNlZ21lbnQgZnJvbSBjb25zdHJhaW5lZCBjZW50ZXIgdG8gc2hhZG93IGNlbnRlclxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBzaGFkb3cgY2VudGVyXG4gICAgZHJhZ2dlZFNoYWRvd0NlbnRlci5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzIC8gMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRWFzZSBmb3Igc2VnbWVudCB0byBkcmFnZ2VkIHNoYWRvdyBjZW50ZXJcbiAgICBsZXQgZWFzZU91dCA9IFJhYy5FYXNlRnVuY3Rpb24ubWFrZUVhc2VPdXQoKTtcbiAgICBlYXNlT3V0LnBvc3RCZWhhdmlvciA9IFJhYy5FYXNlRnVuY3Rpb24uQmVoYXZpb3IuY2xhbXA7XG5cbiAgICAvLyBUYWlsIHdpbGwgc3RvcCBzdHJldGNoaW5nIGF0IDJ4IHRoZSBtYXggdGFpbCBsZW5ndGhcbiAgICBsZXQgbWF4RHJhZ2dlZFRhaWxMZW5ndGggPSB0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiA1O1xuICAgIGVhc2VPdXQuaW5SYW5nZSA9IG1heERyYWdnZWRUYWlsTGVuZ3RoICogMjtcbiAgICBlYXNlT3V0Lm91dFJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBkcmFnZ2VkVGFpbCA9IGRyYWdnZWRTaGFkb3dDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qb2ludChkcmFnZ2VkQ2VudGVyKTtcblxuICAgIGxldCBlYXNlZExlbmd0aCA9IGVhc2VPdXQuZWFzZVZhbHVlKGRyYWdnZWRUYWlsLmxlbmd0aCk7XG4gICAgZHJhZ2dlZFRhaWwud2l0aExlbmd0aChlYXNlZExlbmd0aCkuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIERyYXcgYWxsIVxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJheUNvbnRyb2xcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheUNvbnRyb2w7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBbmdsZSBtZWFzdXJlZCBieSBhIGB0dXJuYCB2YWx1ZSBpbiB0aGUgcmFuZ2UgKlswLDEpKiB0aGF0IHJlcHJlc2VudHMgdGhlXG4qIGFtb3VudCBvZiB0dXJuIGluIGEgZnVsbCBjaXJjbGUuXG4qXG4qIE1vc3QgZnVuY3Rpb25zIHRocm91Z2ggUkFDIHRoYXQgY2FuIHJlY2VpdmUgYW4gYEFuZ2xlYCBwYXJhbWV0ZXIgY2FuXG4qIGFsc28gcmVjZWl2ZSBhIGBudW1iZXJgIHZhbHVlIHRoYXQgd2lsbCBiZSB1c2VkIGFzIGB0dXJuYCB0byBpbnN0YW50aWF0ZVxuKiBhIG5ldyBgQW5nbGVgLiBUaGUgbWFpbiBleGNlcHRpb24gdG8gdGhpcyBiZWhhdmlvdXIgYXJlIGNvbnN0cnVjdG9ycyxcbiogd2hpY2ggYWx3YXlzIGV4cGVjdCB0byByZWNlaXZlIGBBbmdsZWAgb2JqZWN0cy5cbipcbiogRm9yIGRyYXdpbmcgb3BlcmF0aW9ucyB0aGUgdHVybiB2YWx1ZSBpcyBpbnRlcnByZXRlZCB0byBiZSBwb2ludGluZyB0b1xuKiB0aGUgZm9sbG93aW5nIGRpcmVjdGlvbnM6XG4qICsgYDAvNGAgLSBwb2ludHMgcmlnaHRcbiogKyBgMS80YCAtIHBvaW50cyBkb3dud2FyZHNcbiogKyBgMi80YCAtIHBvaW50cyBsZWZ0XG4qICsgYDMvNGAgLSBwb2ludHMgdXB3YXJkc1xuKlxuKiBAYWxpYXMgUmFjLkFuZ2xlXG4qL1xuY2xhc3MgQW5nbGUge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFuZ2xlYCBpbnN0YW5jZS5cbiAgKlxuICAqIFRoZSBgdHVybmAgdmFsdWUgaXMgY29uc3RyYWluZWQgdG8gdGhlIHJhbmNlICpbMCwxKSosIGFueSB2YWx1ZVxuICAqIG91dHNpZGUgaXMgcmVkdWNlZCBiYWNrIGludG8gcmFuZ2UgdXNpbmcgYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogYGBgXG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDEvNCkgIC8vIHR1cm4gaXMgMS80XG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDUvNCkgIC8vIHR1cm4gaXMgMS80XG4gICogbmV3IFJhYy5BbmdsZShyYWMsIC0xLzQpIC8vIHR1cm4gaXMgMy80XG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDEpICAgIC8vIHR1cm4gaXMgMFxuICAqIG5ldyBSYWMuQW5nbGUocmFjLCA0KSAgICAvLyB0dXJuIGlzIDBcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gdHVybiAtIFRoZSB0dXJuIHZhbHVlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdHVybikge1xuICAgIC8vIFRPRE86IGNoYW5nZWQgdG8gYXNzZXJ0VHlwZSwgdGVzdFxuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLCByYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih0dXJuKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgdHVybiA9IHR1cm4gJSAxO1xuICAgIGlmICh0dXJuIDwgMCkge1xuICAgICAgdHVybiA9ICh0dXJuICsgMSkgJSAxO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogVHVybiB2YWx1ZSBvZiB0aGUgYW5nbGUsIGNvbnN0cmFpbmVkIHRvIHRoZSByYW5nZSAqWzAsMSkqLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMudHVybiA9IHR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBBbmdsZSgke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCB0aGUgYHR1cm5gIHZhbHVlIG9mIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5BbmdsZS5mcm9tfSBgYW5nbGVgIGlzIHVuZGVyXG4gICogYHtAbGluayBSYWMjdW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkfWA7IG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBGb3IgdGhpcyBtZXRob2QgYG90aGVyQW5nbGVgIGNhbiBvbmx5IGJlIGBBbmdsZWAgb3IgYG51bWJlcmAsIGFueSBvdGhlclxuICAqIHR5cGUgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVGhpcyBtZXRob2Qgd2lsbCBjb25zaWRlciB0dXJuIHZhbHVlcyBpbiB0aGUgb3Bvc2l0ZSBlbmRzIG9mIHRoZSByYW5nZVxuICAqICpbMCwxKSogYXMgZXF1YWxzLiBFLmcuIGBBbmdsZWAgb2JqZWN0cyB3aXRoIGB0dXJuYCB2YWx1ZXMgb2YgYDBgIGFuZFxuICAqIGAxIC0gcmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZC8yYCB3aWxsIGJlIGNvbnNpZGVyZWQgZXF1YWwuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tXG4gICovXG4gIGVxdWFscyhvdGhlckFuZ2xlKSB7XG4gICAgaWYgKG90aGVyQW5nbGUgaW5zdGFuY2VvZiBSYWMuQW5nbGUpIHtcbiAgICAgIC8vIGFsbCBnb29kIVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG90aGVyQW5nbGUgPT09ICdudW1iZXInKSB7XG4gICAgICBvdGhlckFuZ2xlID0gQW5nbGUuZnJvbSh0aGlzLnJhYywgb3RoZXJBbmdsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnModGhpcy50dXJuIC0gb3RoZXJBbmdsZS50dXJuKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZFxuICAgICAgLy8gRm9yIGNsb3NlIHZhbHVlcyB0aGF0IGxvb3AgYXJvdW5kXG4gICAgICB8fCAoMSAtIGRpZmYpIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBBbmdsZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBgbnVtYmVyYCwgcmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGhcbiAgKiAgIGBzb21ldGhpbmdgIGFzIGB0dXJuYC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5SYXl9YCwgcmV0dXJucyBpdHMgYW5nbGUuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGEgYHtAbGluayBSYWMuU2VnbWVudH1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxSYWMuUmF5fFJhYy5TZWdtZW50fG51bWJlcn0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzb21ldGhpbmcgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgc29tZXRoaW5nKTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5SYXkpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmcuYW5nbGU7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU2VnbWVudCkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5yYXkuYW5nbGU7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgZGVyaXZlIFJhYy5BbmdsZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHN0YXRpYyBmcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHJhYywgcmFkaWFucyAvIFJhYy5UQVUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21EZWdyZWVzKHJhYywgZGVncmVlcykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBkZWdyZWVzIC8gMzYwKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHBvaW50aW5nIGluIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gdG8gYHRoaXNgLlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgxLzgpLmludmVyc2UoKSAvLyB0dXJuIGlzIDEvOCArIDEvMiA9IDUvOFxuICAqIHJhYy5BbmdsZSg3LzgpLmludmVyc2UoKSAvLyB0dXJuIGlzIDcvOCArIDEvMiA9IDMvOFxuICAqIGBgYFxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgaW52ZXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGQodGhpcy5yYWMuQW5nbGUuaW52ZXJzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGEgdHVybiB2YWx1ZSBlcXVpdmFsZW50IHRvIGAtdHVybmAuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvNCkubmVnYXRpdmUoKSAvLyAtMS80IGJlY29tZXMgdHVybiAzLzRcbiAgKiByYWMuQW5nbGUoMy84KS5uZWdhdGl2ZSgpIC8vIC0zLzggYmVjb21lcyB0dXJuIDUvOFxuICAqIGBgYFxuICAqXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbmVnYXRpdmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgLXRoaXMudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aGljaCBpcyBwZXJwZW5kaWN1bGFyIHRvIGB0aGlzYCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMS84KS5wZXJwZW5kaWN1bGFyKHRydWUpICAvLyB0dXJuIGlzIDEvOCArIDEvNCA9IDMvOFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIoZmFsc2UpIC8vIHR1cm4gaXMgMS84IC0gMS80ID0gNy84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlmdCh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIHJhZGlhbnMuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICByYWRpYW5zKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSBpbiBkZWdyZWVzLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgZGVncmVlcygpIHtcbiAgICByZXR1cm4gdGhpcy50dXJuICogMzYwO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBzaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHNpbigpIHtcbiAgICByZXR1cm4gTWF0aC5zaW4odGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGNvc2luZSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBjb3MoKSB7XG4gICAgcmV0dXJuIE1hdGguY29zKHRoaXMucmFkaWFucygpKVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB0YW5nZW50IG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHRhbigpIHtcbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGB0dXJuYCB2YWx1ZSBpbiB0aGUgcmFuZ2UgYCgwLCAxXWAuIFdoZW4gYHR1cm5gIGlzIGVxdWFsIHRvXG4gICogYDBgIHJldHVybnMgYDFgIGluc3RlYWQuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICB0dXJuT25lKCkge1xuICAgIGlmICh0aGlzLnR1cm4gPT09IDApIHsgcmV0dXJuIDE7IH1cbiAgICByZXR1cm4gdGhpcy50dXJuO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgc3VtIG9mIGB0aGlzYCBhbmQgdGhlIGFuZ2xlIGRlcml2ZWQgZnJvbVxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhZGQoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiArIGFuZ2xlLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWBcbiAgKiBzdWJ0cmFjdGVkIHRvIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3VidHJhY3QoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAtIGFuZ2xlLnR1cm4pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgdHVybmAgc2V0IHRvIGB0aGlzLnR1cm4gKiBmYWN0b3JgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGZhY3RvciAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYHR1cm5gIGJ5XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgbXVsdChmYWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm4gKiBmYWN0b3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgdHVybmAgc2V0IHRvXG4gICogYHtAbGluayBSYWMuQW5nbGUjdHVybk9uZSB0aGlzLnR1cm5PbmUoKX0gKiBmYWN0b3JgLlxuICAqXG4gICogVXNlZnVsIHdoZW4gZG9pbmcgcmF0aW8gY2FsY3VsYXRpb25zIHdoZXJlIGEgemVybyBhbmdsZSBjb3JyZXNwb25kcyB0b1xuICAqIGEgY29tcGxldGUtY2lyY2xlIHNpbmNlOlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgwKS5tdWx0KDAuNSkgICAgLy8gdHVybiBpcyAwXG4gICogLy8gd2hlcmVhc1xuICAqIHJhYy5BbmdsZSgwKS5tdWx0T25lKDAuNSkgLy8gdHVybiBpcyAwLjVcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBmYWN0b3IgLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGB0dXJuYCBieVxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIG11bHRPbmUoZmFjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuT25lKCkgKiBmYWN0b3IpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gdGhlXG4gICogYW5nbGUgZGVyaXZlZCBmcm9tIGBhbmdsZWAuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvNCkuZGlzdGFuY2UoMS8yLCB0cnVlKSAgLy8gdHVybiBpcyAxLzJcbiAgKiByYWMuQW5nbGUoMS80KS5kaXN0YW5jZSgxLzIsIGZhbHNlKSAvLyB0dXJuIGluIDMvNFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbWVhc3VyZSB0aGUgZGlzdGFuY2UgdG9cbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG1lYXN1cmVtZW50XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2UoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gYW5nbGUuc3VidHJhY3QodGhpcyk7XG4gICAgcmV0dXJuIGNsb2Nrd2lzZVxuICAgICAgPyBkaXN0YW5jZVxuICAgICAgOiBkaXN0YW5jZS5uZWdhdGl2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHJlc3VsdCBvZiBzaGlmdGluZyB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYCB0byBoYXZlIGB0aGlzYCBhcyBpdHMgb3JpZ2luLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgdGhlIGVxdWl2YWxlbnQgdG9cbiAgKiArIGB0aGlzLmFkZChhbmdsZSlgIHdoZW4gY2xvY2t3aXNlXG4gICogKyBgdGhpcy5zdWJ0cmFjdChhbmdsZSlgIHdoZW4gY291bnRlci1jbG9ja3dpc2VcbiAgKlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0KDAuMywgdHJ1ZSkgIC8vIHR1cm4gaXMgMC4xICsgMC4zID0gMC40XG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnQoMC4zLCBmYWxzZSkgLy8gdHVybiBpcyAwLjEgLSAwLjMgPSAwLjhcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBjbG9ja3dpc2VcbiAgICAgID8gdGhpcy5hZGQoYW5nbGUpXG4gICAgICA6IHRoaXMuc3VidHJhY3QoYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcmVzdWx0IG9mIHNoaWZ0aW5nIGB0aGlzYCB0byBoYXZlIHRoZSBhbmdsZVxuICAqIGRlcml2ZWQgZnJvbSBgb3JpZ2luYCBhcyBpdHMgb3JpZ2luLlxuICAqXG4gICogVGhlIHJlc3VsdCBvZiBgYW5nbGUuc2hpZnRUb09yaWdpbihvcmlnaW4pYCBpcyBlcXVpdmFsZW50IHRvXG4gICogYG9yaWdpbi5zaGlmdChhbmdsZSlgLlxuICAqXG4gICogVGhpcyBvcGVyYXRpb24gaXMgdGhlIGVxdWl2YWxlbnQgdG9cbiAgKiArIGBvcmlnaW4uYWRkKHRoaXMpYCB3aGVuIGNsb2Nrd2lzZVxuICAqICsgYG9yaWdpbi5zdWJ0cmFjdCh0aGlzKWAgd2hlbiBjb3VudGVyLWNsb2Nrd2lzZVxuICAqXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjMsIHRydWUpICAvLyB0dXJuIGlzIDAuMyArIDAuMSA9IDAuNFxuICAqIHJhYy5BbmdsZSgwLjEpLnNoaWZ0VG9PcmlnaW4oMC4zLCBmYWxzZSkgLy8gdHVybiBpcyAwLjMgLSAwLjEgPSAwLjJcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gb3JpZ2luIC0gQW4gYEFuZ2xlYCB0byB1c2UgYXMgb3JpZ2luXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHNoaWZ0VG9PcmlnaW4ob3JpZ2luLCBjbG9ja3dpc2UpIHtcbiAgICBvcmlnaW4gPSB0aGlzLnJhYy5BbmdsZS5mcm9tKG9yaWdpbik7XG4gICAgcmV0dXJuIG9yaWdpbi5zaGlmdCh0aGlzLCBjbG9ja3dpc2UpO1xuICB9XG5cbn0gLy8gY2xhc3MgQW5nbGVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFuZ2xlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5cbi8qKlxuKiBBcmMgb2YgYSBjaXJjbGUgZnJvbSBhIGBzdGFydGAgdG8gYW4gYGVuZGAgW2FuZ2xlXXtAbGluayBSYWMuQW5nbGV9LlxuKlxuKiBBcmNzIHRoYXQgaGF2ZSBbZXF1YWxde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9IGBzdGFydGAgYW5kIGBlbmRgIGFuZ2xlc1xuKiBhcmUgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbipcbiogQGFsaWFzIFJhYy5BcmNcbiovXG5jbGFzcyBBcmN7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQXJjYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gY2VudGVyIC0gVGhlIGNlbnRlciBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIGFyY1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBzdGFydCAtIEFuIGBBbmdsZWAgd2hlcmUgdGhlIGFyYyBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gZW5kIC0gQW5nIGBBbmdsZWAgd2hlcmUgdGhlIGFyYyBlbmRzXG4gICogQHBhcmFtIHtib29sZWFufSBjbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIGFyY1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsXG4gICAgY2VudGVyLCByYWRpdXMsXG4gICAgc3RhcnQsIGVuZCxcbiAgICBjbG9ja3dpc2UpXG4gIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgY2VudGVyKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIocmFkaXVzKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5BbmdsZSwgc3RhcnQsIGVuZCk7XG4gICAgdXRpbHMuYXNzZXJ0Qm9vbGVhbihjbG9ja3dpc2UpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBjZW50ZXIgYFBvaW50YCBvZiB0aGUgYXJjLlxuICAgICogQHR5cGUge1JhYy5Qb2ludH1cbiAgICAqL1xuICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgcmFkaXVzIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzdGFydCBgQW5nbGVgIG9mIHRoZSBhcmMuIFRoZSBhcmMgaXMgZHJhdyBmcm9tIHRoaXMgYW5nbGUgdG93YXJkc1xuICAgICogYGVuZGAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAgICpcbiAgICAqIFdoZW4gYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKiB0aGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAgICovXG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0XG5cbiAgICAvKipcbiAgICAqIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgYXJjLiBUaGUgYXJjIGlzIGRyYXcgZnJvbSBgc3RhcnRgIHRvIHRoaXNcbiAgICAqIGFuZ2xlIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgICAqXG4gICAgKiBXaGVuIGBzdGFydGAgYW5kIGBlbmRgIGFyZSBbZXF1YWwgYW5nbGVzXXtAbGluayBSYWMuQW5nbGUjZXF1YWxzfVxuICAgICogdGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgICAqL1xuICAgIHRoaXMuZW5kID0gZW5kO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgb3JpZW50aWF0aW9uIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAqL1xuICAgIHRoaXMuY2xvY2t3aXNlID0gY2xvY2t3aXNlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmNlbnRlci54LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuY2VudGVyLnksICAgZGlnaXRzKTtcbiAgICBjb25zdCByYWRpdXNTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYWRpdXMsICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0U3RyICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnR1cm4sIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kU3RyICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLnR1cm4sICAgZGlnaXRzKTtcbiAgICByZXR1cm4gYEFyYygoJHt4U3RyfSwke3lTdHJ9KSByOiR7cmFkaXVzU3RyfSBzOiR7c3RhcnRTdHJ9IGU6JHtlbmRTdHJ9IGM6JHt0aGlzLmNsb2Nrd2lzZX19KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMsIGV4Y2VwdCBgcmFjYCwgb2YgYm90aCBhcmNzIGFyZSBlcXVhbDtcbiAgKiBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJBcmNgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQXJjYCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogQXJjcycgYHJhZGl1c2AgYXJlIGNvbXBhcmVkIHVzaW5nIGB7QGxpbmsgUmFjI2VxdWFsc31gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gb3RoZXJTZWdtZW50IC0gQSBgU2VnbWVudGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqIEBzZWUgUmFjI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJBcmMpIHtcbiAgICByZXR1cm4gb3RoZXJBcmMgaW5zdGFuY2VvZiBBcmNcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnJhZGl1cywgb3RoZXJBcmMucmFkaXVzKVxuICAgICAgJiYgdGhpcy5jbG9ja3dpc2UgPT09IG90aGVyQXJjLmNsb2Nrd2lzZVxuICAgICAgJiYgdGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcilcbiAgICAgICYmIHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyQXJjLnN0YXJ0KVxuICAgICAgJiYgdGhpcy5lbmQuZXF1YWxzKG90aGVyQXJjLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgYXJjOiB0aGUgcGFydCBvZiB0aGUgY2lyY3VtZmVyZW5jZSB0aGUgYXJjXG4gICogcmVwcmVzZW50cy5cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5nbGVEaXN0YW5jZSgpLnR1cm5PbmUoKSAqIHRoaXMucmFkaXVzICogUmFjLlRBVTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGVcbiAgKiBjaXJjbGUuXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgY2lyY3VtZmVyZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gICogYGVuZGAsIGluIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlRGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBzdGFydHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSBhcmMgZW5kcy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBzdGFydGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHN0YXJ0UmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuc3RhcnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBlbmRgLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBlbmRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBjZW50ZXJgIHRvIGBzdGFydFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc3RhcnRTZWdtZW50KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMuc3RhcnRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBjZW50ZXJgIHRvIGBlbmRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGVuZFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5lbmRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBzdGFydFBvaW50KClgIHRvIGBlbmRQb2ludCgpYC5cbiAgKlxuICAqIE5vdGUgdGhhdCBmb3IgY29tcGxldGUgY2lyY2xlIGFyY3MgdGhpcyBzZWdtZW50IHdpbGwgaGF2ZSBhIGxlbmd0aCBvZlxuICAqIHplcm8gYW5kIGJlIHBvaW50ZWQgdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBvZiBgc3RhcnRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBjaG9yZFNlZ21lbnQoKSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuc3RhcnQucGVycGVuZGljdWxhcih0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHRoaXMuZW5kUG9pbnQoKSwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmMgaXMgYSBjb21wbGV0ZSBjaXJjbGUsIHdoaWNoIGlzIHdoZW4gYHN0YXJ0YFxuICAqIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30uXG4gICpcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgKi9cbiAgaXNDaXJjbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZXF1YWxzKHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBzZXQgdG8gYG5ld0NlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0NlbnRlciAtIFRoZSBjZW50ZXIgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENlbnRlcihuZXdDZW50ZXIpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIG5ld0NlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHN0YXJ0IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgY29uc3QgbmV3U3RhcnRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydEFuZ2xlLCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGVuZCBzZXQgdG8gYG5ld0VuZGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdFbmQgLSBUaGUgZW5kIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhFbmQobmV3RW5kKSB7XG4gICAgY29uc3QgbmV3RW5kQW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3RW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZEFuZ2xlLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggcmFkaXVzIHNldCB0byBgbmV3UmFkaXVzYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3UmFkaXVzIC0gVGhlIHJhZGl1cyBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoUmFkaXVzKG5ld1JhZGl1cykge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIG5ld1JhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIG9yaWVudGF0aW9uIHNldCB0byBgbmV3Q2xvY2t3aXNlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld0Nsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoQ2xvY2t3aXNlKG5ld0Nsb2Nrd2lzZSkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICBuZXdDbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBhcyB0aGUgZGlzdGFuY2VcbiAgKiBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi4gVGhpcyBjaGFuZ2VzIGBlbmRgXG4gICogZm9yIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIG9mIHRoZVxuICAqIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLkFyYyNhbmdsZURpc3RhbmNlXG4gICovXG4gIHdpdGhBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdFbmQgPSB0aGlzLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAgYXMgdGhlIGxlbmd0aCBvZiB0aGVcbiAgKiBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIGl0IHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIGdpdmVuIGBsZW5ndGhgIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSBjdXQgYmFjayBpbnRvIHJhbmdlIHRocm91Z2ggYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLkFyYyNsZW5ndGhcbiAgKi9cbiAgd2l0aExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdBbmdsZURpc3RhbmNlID0gbGVuZ3RoIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlRGlzdGFuY2UobmV3QW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgbGVuZ3RoYCBhZGRlZCB0byB0aGUgcGFydCBvZiB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIGB0aGlzYCByZXByZXNlbnRzLiBUaGlzIGNoYW5nZXMgYGVuZGAgZm9yIHRoZVxuICAqIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBUaGUgYWN0dWFsIGBsZW5ndGgoKWAgb2YgdGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGFsd2F5cyBiZSBpbiB0aGVcbiAgKiByYW5nZSBgWzAscmFkaXVzKlRBVSlgLiBXaGVuIHRoZSByZXN1bHRpbmcgYGxlbmd0aGAgaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5BcmMjbGVuZ3RoXG4gICovXG4gIHdpdGhMZW5ndGhBZGQobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3QW5nbGVEaXN0YW5jZSA9ICh0aGlzLmxlbmd0aCgpICsgbGVuZ3RoKSAvIHRoaXMuY2lyY3VtZmVyZW5jZSgpO1xuICAgIHJldHVybiB0aGlzLndpdGhBbmdsZURpc3RhbmNlKG5ld0FuZ2xlRGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYSBgbGVuZ3RoKClgIG9mIGB0aGlzLmxlbmd0aCgpICogcmF0aW9gLiBUaGlzXG4gICogY2hhbmdlcyBgZW5kYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBUaGUgYWN0dWFsIGBsZW5ndGgoKWAgb2YgdGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGFsd2F5cyBiZSBpbiB0aGVcbiAgKiByYW5nZSAqWzAscmFkaXVzKlRBVSkqLiBXaGVuIHRoZSBjYWxjdWxhdGVkIGxlbmd0aCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuQXJjI2xlbmd0aFxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aCgpICogcmF0aW87XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aChuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0UG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzXG4gICogY2hhbmdlcyBgc3RhcnRgIGFuZCBgcmFkaXVzYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5zdGFydGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgYXQgdGhlIGBzdGFydFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhTdGFydFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZFBvaW50KClgIGxvY2F0ZWQgYXQgYHBvaW50YC4gVGhpcyBjaGFuZ2VzXG4gICogYGVuZGAgYW5kIGByYWRpdXNgIGluIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuZW5kYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYGVuZFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhFbmRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbVxuICAqIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICB3aXRoU3RhcnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBlbmRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aEVuZFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBzdGFydFBvaW50YCBhbmRcbiAgKiBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBlbmRQb2ludGAsIGJvdGggZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiAqIFdoZW4gYGNlbnRlcmAgaXMgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRvXG4gICogZWl0aGVyIGBzdGFydFBvaW50YCBvciBgZW5kUG9pbnRgLCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YFxuICAqIG9yIGB0aGlzLmVuZGAgcmVzcGVjdGl2ZWx5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0UG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHs/UmFjLlBvaW50fSBbZW5kUG9pbnQ9bnVsbF0gLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkcztcbiAgKiB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgLCBgc3RhcnRQb2ludGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhBbmdsZXNUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3RW5kID0gZW5kUG9pbnQgPT09IG51bGxcbiAgICAgID8gbmV3U3RhcnRcbiAgICAgIDogdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGVuZFBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBgYW5nbGVgIGluIHRoZVxuICAqIGFyYydzIG9wcG9zaXRlIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgc3RhcnRgIHRvIHRoZSBhcmMncyAqb3Bwb3NpdGUqXG4gICogb3JpZW50YXRpb24sIGludGVuZGluZyB0byByZXN1bHQgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0b1xuICAqIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCBgc3RhcnRgIGFnYWluc3RcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGFuZ2xlKSB7XG4gICAgbGV0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgIXRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBlbmRgIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIGBhbmdsZWAgaW4gdGhlXG4gICogYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGBlbmRgIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLFxuICAqIGludGVuZGluZyB0byByZXN1bHQgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0b1xuICAqIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCBgc3RhcnRgIGFnYWluc3RcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihhbmdsZSkge1xuICAgIGxldCBuZXdFbmQgPSB0aGlzLmVuZC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIGBzdGFydGAgYW5kIGBlbmRgIGV4Y2hhbmdlZCwgYW5kIHRoZVxuICAqIG9wcG9zaXRlIGNsb2Nrd2lzZSBvcmllbnRhdGlvbi4gVGhlIGNlbnRlciBhbmQgcmFkaXVzIHJlbWFpbiBiZSB0aGVcbiAgKiBzYW1lIGFzIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5lbmQsIHRoaXMuc3RhcnQsXG4gICAgICAhdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBnaXZlbiBgYW5nbGVgIGNsYW1wZWQgdG8gdGhlIHJhbmdlOlxuICAqIGBgYFxuICAqIFtzdGFydCArIHN0YXJ0SW5zZXQsIGVuZCAtIGVuZEluc2V0XVxuICAqIGBgYFxuICAqIHdoZXJlIHRoZSBhZGRpdGlvbiBoYXBwZW5zIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLCBhbmQgdGhlXG4gICogc3VidHJhY3Rpb24gYWdhaW5zdC5cbiAgKlxuICAqIFdoZW4gYGFuZ2xlYCBpcyBvdXRzaWRlIHRoZSByYW5nZSwgcmV0dXJucyB3aGljaGV2ZXIgcmFuZ2UgbGltaXQgaXNcbiAgKiBjbG9zZXIuXG4gICpcbiAgKiBXaGVuIHRoZSBzdW0gb2YgdGhlIGdpdmVuIGluc2V0cyBpcyBsYXJnZXIgdGhhdCBgdGhpcy5hcmNEaXN0YW5jZSgpYFxuICAqIHRoZSByYW5nZSBmb3IgdGhlIGNsYW1wIGlzIGltcG9zaWJsZSB0byBmdWxmaWxsLiBJbiB0aGlzIGNhc2UgdGhlXG4gICogcmV0dXJuZWQgdmFsdWUgd2lsbCBiZSB0aGUgY2VudGVyZWQgYmV0d2VlbiB0aGUgcmFuZ2UgbGltaXRzIGFuZCBzdGlsbFxuICAqIGNsYW1wbGVkIHRvIGBbc3RhcnQsIGVuZF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtzdGFydEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvIHJhYy5BbmdsZS56ZXJvfV0gLVxuICAqICAgVGhlIGluc2V0IGZvciB0aGUgbG93ZXIgbGltaXQgb2YgdGhlIGNsYW1waW5nIHJhbmdlXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZW5kSW5zZXQ9e0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm8gcmFjLkFuZ2xlLnplcm99XSAtXG4gICogICBUaGUgaW5zZXQgZm9yIHRoZSBoaWdoZXIgbGltaXQgb2YgdGhlIGNsYW1waW5nIHJhbmdlXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgY2xhbXBUb0FuZ2xlcyhhbmdsZSwgc3RhcnRJbnNldCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sIGVuZEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBzdGFydEluc2V0ID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIHN0YXJ0SW5zZXQpO1xuICAgIGVuZEluc2V0ID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGVuZEluc2V0KTtcblxuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkgJiYgc3RhcnRJbnNldC50dXJuID09IDAgJiYgZW5kSW5zZXQudHVybiA9PSAwKSB7XG4gICAgICAvLyBDb21wbGV0ZSBjaXJjbGVcbiAgICAgIHJldHVybiBhbmdsZTtcbiAgICB9XG5cbiAgICAvLyBBbmdsZSBpbiBhcmMsIHdpdGggYXJjIGFzIG9yaWdpblxuICAgIC8vIEFsbCBjb21wYXJpc29ucyBhcmUgbWFkZSBpbiBhIGNsb2Nrd2lzZSBvcmllbnRhdGlvblxuICAgIGNvbnN0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuZGlzdGFuY2VGcm9tU3RhcnQoYW5nbGUpO1xuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBzaGlmdGVkU3RhcnRDbGFtcCA9IHN0YXJ0SW5zZXQ7XG4gICAgY29uc3Qgc2hpZnRlZEVuZENsYW1wID0gYW5nbGVEaXN0YW5jZS5zdWJ0cmFjdChlbmRJbnNldCk7XG4gICAgY29uc3QgdG90YWxJbnNldFR1cm4gPSBzdGFydEluc2V0LnR1cm4gKyBlbmRJbnNldC50dXJuO1xuXG4gICAgaWYgKHRvdGFsSW5zZXRUdXJuID49IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpKSB7XG4gICAgICAvLyBJbnZhbGlkIHJhbmdlXG4gICAgICBjb25zdCByYW5nZURpc3RhbmNlID0gc2hpZnRlZEVuZENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRTdGFydENsYW1wKTtcbiAgICAgIGxldCBoYWxmUmFuZ2U7XG4gICAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7XG4gICAgICAgIGhhbGZSYW5nZSA9IHJhbmdlRGlzdGFuY2UubXVsdCgxLzIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGFsZlJhbmdlID0gdG90YWxJbnNldFR1cm4gPj0gMVxuICAgICAgICAgID8gcmFuZ2VEaXN0YW5jZS5tdWx0T25lKDEvMilcbiAgICAgICAgICA6IHJhbmdlRGlzdGFuY2UubXVsdCgxLzIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtaWRkbGVSYW5nZSA9IHNoaWZ0ZWRFbmRDbGFtcC5hZGQoaGFsZlJhbmdlKTtcbiAgICAgIGNvbnN0IG1pZGRsZSA9IHRoaXMuc3RhcnQuc2hpZnQobWlkZGxlUmFuZ2UsIHRoaXMuY2xvY2t3aXNlKTtcblxuICAgICAgcmV0dXJuIHRoaXMuY2xhbXBUb0FuZ2xlcyhtaWRkbGUpO1xuICAgIH1cblxuICAgIGlmIChzaGlmdGVkQW5nbGUudHVybiA+PSBzaGlmdGVkU3RhcnRDbGFtcC50dXJuICYmIHNoaWZ0ZWRBbmdsZS50dXJuIDw9IHNoaWZ0ZWRFbmRDbGFtcC50dXJuKSB7XG4gICAgICAvLyBJbnNpZGUgY2xhbXAgcmFuZ2VcbiAgICAgIHJldHVybiBhbmdsZTtcbiAgICB9XG5cbiAgICAvLyBPdXRzaWRlIHJhbmdlLCBmaWd1cmUgb3V0IGNsb3Nlc3QgbGltaXRcbiAgICBsZXQgZGlzdGFuY2VUb1N0YXJ0Q2xhbXAgPSBzaGlmdGVkU3RhcnRDbGFtcC5kaXN0YW5jZShzaGlmdGVkQW5nbGUsIGZhbHNlKTtcbiAgICBsZXQgZGlzdGFuY2VUb0VuZENsYW1wID0gc2hpZnRlZEVuZENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSk7XG4gICAgaWYgKGRpc3RhbmNlVG9TdGFydENsYW1wLnR1cm4gPD0gZGlzdGFuY2VUb0VuZENsYW1wLnR1cm4pIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LnNoaWZ0KHN0YXJ0SW5zZXQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZW5kLnNoaWZ0KGVuZEluc2V0LCAhdGhpcy5jbG9ja3dpc2UpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBgYW5nbGVgIGlzIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBXaGVuIHRoZSBhcmMgcmVwcmVzZW50cyBhIGNvbXBsZXRlIGNpcmNsZSwgYHRydWVgIGlzIGFsd2F5cyByZXR1cm5lZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGV2YWx1YXRlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICovXG4gIGNvbnRhaW5zQW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgaWYgKHRoaXMuY2xvY2t3aXNlKSB7XG4gICAgICBsZXQgb2Zmc2V0ID0gYW5nbGUuc3VidHJhY3QodGhpcy5zdGFydCk7XG4gICAgICBsZXQgZW5kT2Zmc2V0ID0gdGhpcy5lbmQuc3VidHJhY3QodGhpcy5zdGFydCk7XG4gICAgICByZXR1cm4gb2Zmc2V0LnR1cm4gPD0gZW5kT2Zmc2V0LnR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBvZmZzZXQgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzLmVuZCk7XG4gICAgICBsZXQgc3RhcnRPZmZzZXQgPSB0aGlzLnN0YXJ0LnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICAgIHJldHVybiBvZmZzZXQudHVybiA8PSBzdGFydE9mZnNldC50dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YCBpbiB0aGUgYXJjIGlzIHBvc2l0aW9uZWRcbiAgKiBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gdGhlIGFyYyByZXByZXNlbnRzIGEgY29tcGxldGUgY2lyY2xlLCBgdHJ1ZWAgaXMgYWx3YXlzIHJldHVybmVkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIGV2YWx1YXRlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICovXG4gIGNvbnRhaW5zUHJvamVjdGVkUG9pbnQocG9pbnQpIHtcbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbnNBbmdsZSh0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYGFuZ2xlYCBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fVxuICAqIGBzdGFydGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogRS5nLlxuICAqIEZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBzaGlmdEFuZ2xlKDAuMSlgIGlzIGAwLjZgLlxuICAqIEZvciBhIGNvdW50ZXItY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC41YDogYHNoaWZ0QW5nbGUoMC4xKWAgaXMgYDAuNGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuQW5nbGUjc2hpZnRcbiAgKi9cbiAgc2hpZnRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhbiBBbmdsZSB0aGF0IHJlcHJlc2VudHMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRgIHRvXG4gIC8vIGBhbmdsZWAgdHJhdmVsaW5nIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgLy8gVXNlZnVsIHRvIGRldGVybWluZSBmb3IgYSBnaXZlbiBhbmdsZSwgd2hlcmUgaXQgc2l0cyBpbnNpZGUgdGhlIGFyYyBpZlxuICAvLyB0aGUgYXJjIHdhcyB0aGUgb3JpZ2luIGNvb3JkaW5hdGUgc3lzdGVtLlxuICAvL1xuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIGBzdGFydGBcbiAgKiB0byBgYW5nbGVgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEUuZy5cbiAgKiBGb3IgYSBjbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IGAwLjVgOiBgZGlzdGFuY2VGcm9tU3RhcnQoMC42KWAgaXMgYDAuMWAuXG4gICogRm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IGAwLjVgOiBgZGlzdGFuY2VGcm9tU3RhcnQoMC42KWAgaXMgYDAuOWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtZWFzdXJlIHRoZSBkaXN0YW5jZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlRnJvbVN0YXJ0KGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmRpc3RhbmNlKGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBhbmdsZWAuIFRoaXNcbiAgKiBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlIGBzdGFydGAgbm9yIGBlbmRgIG9mIHRoZSBhcmMuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0b3dhcmRzIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICByZXR1cm4gdGhpcy5jZW50ZXIucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBhbmdsZWBcbiAgKiBbc2hpZnRlZCBieV17QGxpbmsgUmFjLkFuZ2xlI3NoaWZ0fSBgc3RhcnRgIGluIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBiZSBzaGlmdGVkIGJ5IGBzdGFydGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QW5nbGVEaXN0YW5jZShhbmdsZSkge1xuICAgIGxldCBzaGlmdGVkQW5nbGUgPSB0aGlzLnNoaWZ0QW5nbGUoYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShzaGlmdGVkQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IHRoZSBnaXZlbiBgbGVuZ3RoYCBmcm9tXG4gICogYHN0YXJ0UG9pbnQoKWAgaW4gYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBmcm9tIGBzdGFydFBvaW50KClgIHRvIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IGxlbmd0aCAvIHRoaXMuY2lyY3VtZmVyZW5jZSgpO1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgYXJjIGF0IGBsZW5ndGgoKSAqIHJhdGlvYCBmcm9tXG4gICogYHN0YXJ0UG9pbnQoKWAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoKClgIGJ5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgbGV0IG5ld0FuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKS5tdWx0T25lKHJhdGlvKTtcbiAgICBsZXQgc2hpZnRlZEFuZ2xlID0gdGhpcy5zaGlmdEFuZ2xlKG5ld0FuZ2xlRGlzdGFuY2UpO1xuICAgIHJldHVybiB0aGlzLnBvaW50QXRBbmdsZShzaGlmdGVkQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIHJhZGl1cyBvZiB0aGUgYXJjIGF0IHRoZVxuICAqIGdpdmVuIGBhbmdsZWAuIFRoaXMgbWV0aG9kIGRvZXMgbm90IGNvbnNpZGVyIHRoZSBgc3RhcnRgIG5vciBgZW5kYCBvZlxuICAqIHRoZSBhcmMuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGRpcmVjdGlvbiBvZiB0aGUgcmFkaXVzIHRvIHJldHVyblxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgcmFkaXVzU2VnbWVudEF0QW5nbGUoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMuY2VudGVyLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgaW4gdGhlXG4gICogZGlyZWN0aW9uIHRvd2FyZHMgdGhlIGdpdmVuIGBwb2ludGAuIFRoaXMgbWV0aG9kIGRvZXMgbm90IGNvbnNpZGVyIHRoZVxuICAqIGBzdGFydGAgbm9yIGBlbmRgIG9mIHRoZSBhcmMuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5wb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgaW4gdGhlIGRpcmVjdGlvbiBvZiB0aGUgcmFkaXVzIHRvIHJldHVyblxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgcmFkaXVzU2VnbWVudFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KHBvaW50KTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZm9yIHRoZSBjaG9yZCBmb3JtZWQgYnkgdGhlIGludGVyc2VjdGlvbiBvZlxuICAqIGB0aGlzYCBhbmQgYG90aGVyQXJjYCwgb3IgYG51bGxgIHdoZW4gdGhlcmUgaXMgbm8gaW50ZXJzZWN0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBTZWdtZW50YCB3aWxsIHBvaW50IHRvd2FyZHMgdGhlIGB0aGlzYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEJvdGggYXJjcyBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzIGZvciB0aGUgY2FsY3VsYXRpb24gb2YgdGhlXG4gICogY2hvcmQsIHRodXMgdGhlIGVuZHBvaW50cyBvZiB0aGUgcmV0dXJuZWQgc2VnbWVudCBtYXkgbm90IGxheSBpbnNpZGVcbiAgKiB0aGUgYWN0dWFsIGFyY3MuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gZGVzY3JpcHRpb25cbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICBpbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYykge1xuICAgIC8vIGh0dHBzOi8vbWF0aHdvcmxkLndvbGZyYW0uY29tL0NpcmNsZS1DaXJjbGVJbnRlcnNlY3Rpb24uaHRtbFxuICAgIC8vIFI9dGhpcywgcj1vdGhlckFyY1xuXG4gICAgaWYgKHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChvdGhlckFyYy5jZW50ZXIpO1xuXG4gICAgaWYgKGRpc3RhbmNlID4gdGhpcy5yYWRpdXMgKyBvdGhlckFyYy5yYWRpdXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGRpc3RhbmNlVG9DaG9yZCA9IChkXjIgLSByXjIgKyBSXjIpIC8gKGQqMilcbiAgICBjb25zdCBkaXN0YW5jZVRvQ2hvcmQgPSAoXG4gICAgICAgIE1hdGgucG93KGRpc3RhbmNlLCAyKVxuICAgICAgLSBNYXRoLnBvdyhvdGhlckFyYy5yYWRpdXMsIDIpXG4gICAgICArIE1hdGgucG93KHRoaXMucmFkaXVzLCAyKVxuICAgICAgKSAvIChkaXN0YW5jZSAqIDIpO1xuXG4gICAgLy8gYSA9IDEvZCBzcXJ0fCgtZCtyLVIpKC1kLXIrUikoLWQrcitSKShkK3IrUilcbiAgICBjb25zdCBjaG9yZExlbmd0aCA9ICgxIC8gZGlzdGFuY2UpICogTWF0aC5zcXJ0KFxuICAgICAgICAoLWRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzIC0gdGhpcy5yYWRpdXMpXG4gICAgICAqICgtZGlzdGFuY2UgLSBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cylcbiAgICAgICogKC1kaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKVxuICAgICAgKiAoZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cykpO1xuXG4gICAgY29uc3Qgc2VnbWVudFRvQ2hvcmQgPSB0aGlzLmNlbnRlci5yYXlUb1BvaW50KG90aGVyQXJjLmNlbnRlcilcbiAgICAgIC5zZWdtZW50KGRpc3RhbmNlVG9DaG9yZCk7XG4gICAgcmV0dXJuIHNlZ21lbnRUb0Nob3JkLm5leHRTZWdtZW50UGVycGVuZGljdWxhcih0aGlzLmNsb2Nrd2lzZSwgY2hvcmRMZW5ndGgvMilcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoUmF0aW8oMik7XG4gIH1cblxuXG4gIC8vIFRPRE86IGNvbnNpZGVyIGlmIGludGVyc2VjdGluZ1BvaW50c1dpdGhBcmMgaXMgbmVjZXNzYXJ5XG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgaW50ZXJzZWN0aW5nIHBvaW50cyBvZiBgdGhpc2Agd2l0aFxuICAqIGBvdGhlckFyY2AuXG4gICpcbiAgKiBXaGVuIHRoZXJlIGFyZSBubyBpbnRlcnNlY3RpbmcgcG9pbnRzLCByZXR1cm5zIGFuIGVtcHR5IGFycmF5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBpbnRlcnNlY3Rpb24gcG9pbnRzIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBpZ25vcmVcbiAgKi9cbiAgLy8gaW50ZXJzZWN0aW5nUG9pbnRzV2l0aEFyYyhvdGhlckFyYykge1xuICAvLyAgIGxldCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpO1xuICAvLyAgIGlmIChjaG9yZCA9PT0gbnVsbCkgeyByZXR1cm4gW107IH1cblxuICAvLyAgIGxldCBpbnRlcnNlY3Rpb25zID0gW2Nob3JkLnN0YXJ0UG9pbnQoKSwgY2hvcmQuZW5kUG9pbnQoKV0uZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgLy8gICAgIHJldHVybiB0aGlzLmNvbnRhaW5zQW5nbGUodGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbSkpXG4gIC8vICAgICAgICYmIG90aGVyQXJjLmNvbnRhaW5zQW5nbGUob3RoZXJBcmMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0pKTtcbiAgLy8gICB9LCB0aGlzKTtcblxuICAvLyAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCByZXByZXNlbnRpbmcgdGhlIGNob3JkIGZvcm1lZCBieSB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgdGhlIGFyYyBhbmQgJ3JheScsIG9yIGBudWxsYCB3aGVuIG5vIGNob3JkIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBTZWdtZW50YCB3aWxsIGFsd2F5cyBoYXZlIHRoZSBzYW1lIGFuZ2xlIGFzIGByYXlgLlxuICAqXG4gICogVGhlIGFyYyBpcyBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlIGFuZCBgcmF5YCBpcyBjb25zaWRlcmVkIGFuXG4gICogdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkV2l0aFJheShyYXkpIHtcbiAgICAvLyBGaXJzdCBjaGVjayBpbnRlcnNlY3Rpb25cbiAgICBjb25zdCBiaXNlY3RvciA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gYmlzZWN0b3IubGVuZ3RoO1xuXG4gICAgLy8gU2VnbWVudCB0b28gY2xvc2UgdG8gY2VudGVyLCBjb3NpbmUgY2FsY3VsYXRpb25zIG1heSBiZSBpbmNvcnJlY3RcbiAgICAvLyBDYWxjdWxhdGUgc2VnbWVudCB0aHJvdWdoIGNlbnRlclxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoMCwgZGlzdGFuY2UpKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHJheS5hbmdsZS5pbnZlcnNlKCkpO1xuICAgICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHN0YXJ0LCByYXkuYW5nbGUpO1xuICAgICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLnJhZGl1cyoyKTtcbiAgICB9XG5cbiAgICAvLyBSYXkgaXMgdGFuZ2VudCwgcmV0dXJuIHplcm8tbGVuZ3RoIHNlZ21lbnQgYXQgY29udGFjdCBwb2ludFxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoZGlzdGFuY2UsIHRoaXMucmFkaXVzKSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5yYXkuYW5nbGUpO1xuICAgICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHN0YXJ0LCByYXkuYW5nbGUpO1xuICAgICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCAwKTtcbiAgICB9XG5cbiAgICAvLyBSYXkgZG9lcyBub3QgdG91Y2ggYXJjXG4gICAgaWYgKGRpc3RhbmNlID4gdGhpcy5yYWRpdXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmFjb3MoZGlzdGFuY2UvdGhpcy5yYWRpdXMpO1xuICAgIGNvbnN0IGFuZ2xlID0gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCByYWRpYW5zKTtcblxuICAgIGNvbnN0IGNlbnRlck9yaWVudGF0aW9uID0gcmF5LnBvaW50T3JpZW50YXRpb24odGhpcy5jZW50ZXIpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IuYW5nbGUoKS5zaGlmdChhbmdsZSwgIWNlbnRlck9yaWVudGF0aW9uKSk7XG4gICAgY29uc3QgZW5kID0gdGhpcy5wb2ludEF0QW5nbGUoYmlzZWN0b3IuYW5nbGUoKS5zaGlmdChhbmdsZSwgY2VudGVyT3JpZW50YXRpb24pKTtcbiAgICByZXR1cm4gc3RhcnQuc2VnbWVudFRvUG9pbnQoZW5kLCByYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgcmVwcmVzZW50aW5nIHRoZSBlbmQgb2YgdGhlIGNob3JkIGZvcm1lZCBieSB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgdGhlIGFyYyBhbmQgJ3JheScsIG9yIGBudWxsYCB3aGVuIG5vIGNob3JkIGlzIHBvc3NpYmxlLlxuICAqXG4gICogV2hlbiBgdXNlUHJvamVjdGlvbmAgaXMgYHRydWVgIHRoZSBtZXRob2Qgd2lsbCBhbHdheXMgcmV0dXJuIGEgYFBvaW50YFxuICAqIGV2ZW4gd2hlbiB0aGVyZSBpcyBubyBjb250YWN0IGJldHdlZW4gdGhlIGFyYyBhbmQgYHJheWAuIEluIHRoaXMgY2FzZVxuICAqIHRoZSBwb2ludCBpbiB0aGUgYXJjIGNsb3Nlc3QgdG8gYHJheWAgaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUgYW5kIGByYXlgIGlzIGNvbnNpZGVyZWQgYW5cbiAgKiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMgez9SYWMuUG9pbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkRW5kV2l0aFJheShyYXksIHVzZVByb2plY3Rpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZFdpdGhSYXkocmF5KTtcbiAgICBpZiAoY2hvcmQgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBjaG9yZC5lbmRQb2ludCgpO1xuICAgIH1cblxuICAgIGlmICh1c2VQcm9qZWN0aW9uKSB7XG4gICAgICBjb25zdCBjZW50ZXJPcmllbnRhdGlvbiA9IHJheS5wb2ludE9yaWVudGF0aW9uKHRoaXMuY2VudGVyKTtcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcighY2VudGVyT3JpZW50YXRpb24pO1xuICAgICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHBlcnBlbmRpY3VsYXIpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHJlcHJlc2VudGluZyB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgdGhhdCBpcyBpbnNpZGVcbiAgKiBgb3RoZXJBcmNgLCBvciBgbnVsbGAgd2hlbiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uIFRoZSByZXR1cm5lZCBhcmNcbiAgKiB3aWxsIGhhdmUgdGhlIHNhbWUgY2VudGVyLCByYWRpdXMsIGFuZCBvcmllbnRhdGlvbiBhcyBgdGhpc2AuXG4gICpcbiAgKiBCb3RoIGFyY3MgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcyBmb3IgdGhlIGNhbGN1bGF0aW9uIG9mIHRoZVxuICAqIGludGVyc2VjdGlvbiwgdGh1cyB0aGUgZW5kcG9pbnRzIG9mIHRoZSByZXR1cm5lZCBhcmMgbWF5IG5vdCBsYXkgaW5zaWRlXG4gICogYHRoaXNgLlxuICAqXG4gICogQW4gZWRnZSBjYXNlIG9mIHRoaXMgbWV0aG9kIGlzIHRoYXQgd2hlbiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBgdGhpc2BcbiAgKiBhbmQgYG90aGVyQXJjYCBpcyB0aGUgc3VtIG9mIHRoZWlyIHJhZGl1cywgbWVhbmluZyB0aGUgYXJjcyB0b3VjaCBhdCBhXG4gICogc2luZ2xlIHBvaW50LCB0aGUgcmVzdWx0aW5nIGFyYyBtYXkgaGF2ZSBhIGFuZ2xlLWRpc3RhbmNlIG9mIHplcm8sXG4gICogd2hpY2ggaXMgaW50ZXJwcmV0ZWQgYXMgYSBjb21wbGV0ZS1jaXJjbGUgYXJjLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGludGVyc2VjdCB3aXRoXG4gICogQHJldHVybnMgez9SYWMuQXJjfVxuICAqL1xuICBpbnRlcnNlY3Rpb25BcmMob3RoZXJBcmMpIHtcbiAgICBjb25zdCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpO1xuICAgIGlmIChjaG9yZCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlc1Rvd2FyZHNQb2ludChjaG9yZC5zdGFydFBvaW50KCksIGNob3JkLmVuZFBvaW50KCkpO1xuICB9XG5cblxuICAvLyBUT0RPOiBpbXBsZW1lbnQgaW50ZXJzZWN0aW9uQXJjTm9DaXJjbGU/XG5cblxuICAvLyBUT0RPOiBmaW5pc2ggYm91bmRlZEludGVyc2VjdGlvbkFyY1xuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHJlcHJlc2VudGluZyB0aGUgc2VjdGlvbiBvZiBgdGhpc2AgdGhhdCBpcyBpbnNpZGVcbiAgKiBgb3RoZXJBcmNgIGFuZCBib3VuZGVkIGJ5IGB0aGlzLnN0YXJ0YCBhbmQgYHRoaXMuZW5kYCwgb3IgYG51bGxgIHdoZW5cbiAgKiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uIFRoZSByZXR1cm5lZCBhcmMgd2lsbCBoYXZlIHRoZSBzYW1lIGNlbnRlcixcbiAgKiByYWRpdXMsIGFuZCBvcmllbnRhdGlvbiBhcyBgdGhpc2AuXG4gICpcbiAgKiBgb3RoZXJBcmNgIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUsIHdoaWxlIHRoZSBzdGFydCBhbmQgZW5kIG9mXG4gICogYHRoaXNgIGFyZSBjb25zaWRlcmVkIGZvciB0aGUgcmVzdWx0aW5nIGBBcmNgLlxuICAqXG4gICogV2hlbiB0aGVyZSBleGlzdCB0d28gc2VwYXJhdGUgYXJjIHNlY3Rpb25zIHRoYXQgaW50ZXJzZWN0IHdpdGhcbiAgKiBgb3RoZXJBcmNgOiBvbmx5IHRoZSBzZWN0aW9uIG9mIGB0aGlzYCBjbG9zZXN0IHRvIGBzdGFydGAgaXMgcmV0dXJuZWQuXG4gICogVGhpcyBjYW4gaGFwcGVuIHdoZW4gYHRoaXNgIHN0YXJ0cyBpbnNpZGUgYG90aGVyQXJjYCwgdGhlbiBleGl0cywgYW5kXG4gICogdGhlbiBlbmRzIGluc2lkZSBgb3RoZXJBcmNgLCByZWdhcmRsZXNzIGlmIGB0aGlzYCBpcyBhIGNvbXBsZXRlIGNpcmNsZVxuICAqIG9yIG5vdC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBpbnRlcnNlY3Qgd2l0aFxuICAqIEByZXR1cm5zIHs/UmFjLkFyY31cbiAgKlxuICAqIEBpZ25vcmVcbiAgKi9cbiAgLy8gYm91bmRlZEludGVyc2VjdGlvbkFyYyhvdGhlckFyYykge1xuICAvLyAgIGxldCBjaG9yZCA9IHRoaXMuaW50ZXJzZWN0aW9uQ2hvcmQob3RoZXJBcmMpO1xuICAvLyAgIGlmIChjaG9yZCA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8vICAgbGV0IGNob3JkU3RhcnRBbmdsZSA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChjaG9yZC5zdGFydFBvaW50KCkpO1xuICAvLyAgIGxldCBjaG9yZEVuZEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLmVuZFBvaW50KCkpO1xuXG4gIC8vICAgLy8gZ2V0IGFsbCBkaXN0YW5jZXMgZnJvbSB0aGlzLnN0YXJ0XG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZEVuZEFuZ2xlLCBvbmx5IHN0YXJ0IG1heSBiZSBpbnNpZGUgYXJjXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyB0aGlzLmVuZCwgd2hvbGUgYXJjIGlzIGluc2lkZSBvciBvdXRzaWRlXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZFN0YXJ0QW5nbGUsIG9ubHkgZW5kIG1heSBiZSBpbnNpZGUgYXJjXG4gIC8vICAgY29uc3QgaW50ZXJTdGFydERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZShjaG9yZFN0YXJ0QW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gICBjb25zdCBpbnRlckVuZERpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZShjaG9yZEVuZEFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIC8vICAgY29uc3QgZW5kRGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKHRoaXMuZW5kLCB0aGlzLmNsb2Nrd2lzZSk7XG5cblxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRTdGFydEFuZ2xlLCBub3JtYWwgcnVsZXNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCBub3QgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkU3RhcnQsIHJldHVybiBudWxsXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgbm90IHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZGVuZCwgcmV0dXJuIHNlbGZcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRTdGFydCwgbm9ybWFsIHJ1bGVzXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBlbmQgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkZW5kLCByZXR1cm4gc3RhcnQgdG8gY2hvcmRlbmRcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkRW5kQW5nbGUsIHJldHVybiBzdGFydCB0byBjaG9yZEVuZFxuXG5cbiAgLy8gICBpZiAoIXRoaXMuY29udGFpbnNBbmdsZShjaG9yZFN0YXJ0QW5nbGUpKSB7XG4gIC8vICAgICBjaG9yZFN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0O1xuICAvLyAgIH1cbiAgLy8gICBpZiAoIXRoaXMuY29udGFpbnNBbmdsZShjaG9yZEVuZEFuZ2xlKSkge1xuICAvLyAgICAgY2hvcmRFbmRBbmdsZSA9IHRoaXMuZW5kO1xuICAvLyAgIH1cblxuICAvLyAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAvLyAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAvLyAgICAgY2hvcmRTdGFydEFuZ2xlLFxuICAvLyAgICAgY2hvcmRFbmRBbmdsZSxcbiAgLy8gICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBpcyB0YW5nZW50IHRvIGJvdGggYHRoaXNgIGFuZCBgb3RoZXJBcmNgLFxuICAqIG9yIGBudWxsYCB3aGVuIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZS4gVGhlIG5ldyBgU2VnbWVudGAgc3RhcnRzXG4gICogYXQgdGhlIGNvbnRhY3QgcG9pbnQgd2l0aCBgdGhpc2AgYW5kIGVuZHMgYXQgdGhlIGNvbnRhY3QgcG9pbnQgd2l0aFxuICAqIGBvdGhlckFyY2AuXG4gICpcbiAgKiBDb25zaWRlcmluZyBfY2VudGVyIGF4aXNfIGEgcmF5IGZyb20gYHRoaXMuY2VudGVyYCB0b3dhcmRzXG4gICogYG90aGVyQXJjLmNlbnRlcmAsIGBzdGFydENsb2Nrd2lzZWAgZGV0ZXJtaW5lcyB0aGUgc2lkZSBvZiB0aGUgc3RhcnRcbiAgKiBwb2ludCBvZiB0aGUgcmV0dXJuZWQgc2VnbWVudCBpbiByZWxhdGlvbiB0byBfY2VudGVyIGF4aXNfLCBhbmRcbiAgKiBgZW5kQ2xvY2t3aXNlYCB0aGUgc2lkZSBvZiB0aGUgZW5kIHBvaW50LlxuICAqXG4gICogQm90aCBgdGhpc2AgYW5kIGBvdGhlckFyY2AgYXJlIGNvbnNpZGVyZWQgY29tcGxldGUgY2lyY2xlcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBBbiBgQXJjYCB0byBjYWxjdWxhdGUgYSB0YW5nZW50IHNlZ21lbnQgdG93YXJkc1xuICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhcnRDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBzdGFydCBwb2ludCBpbiByZWxhdGlvbiB0byB0aGUgX2NlbnRlciBheGlzX1xuICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5kQ2xvY2t3aXNlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogZW5kIHBvaW50IGluIHJlbGF0aW9uIHRvIHRoZSBfY2VudGVyIGF4aXNfXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgdGFuZ2VudFNlZ21lbnQob3RoZXJBcmMsIHN0YXJ0Q2xvY2t3aXNlID0gdHJ1ZSwgZW5kQ2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmNlbnRlci5lcXVhbHMob3RoZXJBcmMuY2VudGVyKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gSHlwb3RoZW51c2Ugb2YgdGhlIHRyaWFuZ2xlIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSB0YW5nZW50XG4gICAgLy8gbWFpbiBhbmdsZSBpcyBhdCBgdGhpcy5jZW50ZXJgXG4gICAgY29uc3QgaHlwU2VnbWVudCA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KG90aGVyQXJjLmNlbnRlcik7XG4gICAgY29uc3Qgb3BzID0gc3RhcnRDbG9ja3dpc2UgPT09IGVuZENsb2Nrd2lzZVxuICAgICAgPyBvdGhlckFyYy5yYWRpdXMgLSB0aGlzLnJhZGl1c1xuICAgICAgOiBvdGhlckFyYy5yYWRpdXMgKyB0aGlzLnJhZGl1cztcblxuICAgIC8vIFdoZW4gb3BzIGFuZCBoeXAgYXJlIGNsb3NlLCBzbmFwIHRvIDFcbiAgICBjb25zdCBhbmdsZVNpbmUgPSB0aGlzLnJhYy5lcXVhbHMoTWF0aC5hYnMob3BzKSwgaHlwU2VnbWVudC5sZW5ndGgpXG4gICAgICA/IChvcHMgPiAwID8gMSA6IC0xKVxuICAgICAgOiBvcHMgLyBoeXBTZWdtZW50Lmxlbmd0aDtcbiAgICBpZiAoTWF0aC5hYnMoYW5nbGVTaW5lKSA+IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlUmFkaWFucyA9IE1hdGguYXNpbihhbmdsZVNpbmUpO1xuICAgIGNvbnN0IG9wc0FuZ2xlID0gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCBhbmdsZVJhZGlhbnMpO1xuXG4gICAgY29uc3QgYWRqT3JpZW50YXRpb24gPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IHN0YXJ0Q2xvY2t3aXNlXG4gICAgICA6ICFzdGFydENsb2Nrd2lzZTtcbiAgICBjb25zdCBzaGlmdGVkT3BzQW5nbGUgPSBoeXBTZWdtZW50LnJheS5hbmdsZS5zaGlmdChvcHNBbmdsZSwgYWRqT3JpZW50YXRpb24pO1xuICAgIGNvbnN0IHNoaWZ0ZWRBZGpBbmdsZSA9IHNoaWZ0ZWRPcHNBbmdsZS5wZXJwZW5kaWN1bGFyKGFkak9yaWVudGF0aW9uKTtcblxuICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IHNoaWZ0ZWRBZGpBbmdsZVxuICAgICAgOiBzaGlmdGVkQWRqQW5nbGUuaW52ZXJzZSgpXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShzdGFydEFuZ2xlKTtcbiAgICBjb25zdCBlbmQgPSBvdGhlckFyYy5wb2ludEF0QW5nbGUoc2hpZnRlZEFkakFuZ2xlKTtcbiAgICBjb25zdCBkZWZhdWx0QW5nbGUgPSBzdGFydEFuZ2xlLnBlcnBlbmRpY3VsYXIoIXN0YXJ0Q2xvY2t3aXNlKTtcbiAgICByZXR1cm4gc3RhcnQuc2VnbWVudFRvUG9pbnQoZW5kLCBkZWZhdWx0QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgbmV3IGBBcmNgIG9iamVjdHMgcmVwcmVzZW50aW5nIGB0aGlzYFxuICAqIGRpdmlkZWQgaW50byBgY291bnRgIGFyY3MsIGFsbCB3aXRoIHRoZSBzYW1lXG4gICogW2FuZ2xlIGRpc3RhbmNlXXtAbGluayBSYWMuQXJjI2FuZ2xlRGlzdGFuY2V9LlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuIFdoZW4gYGNvdW50YCBpc1xuICAqIGAxYCByZXR1cm5zIGFuIGFyYyBlcXVpdmFsZW50IHRvIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiBhcmNzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuQXJjW119XG4gICovXG4gIGRpdmlkZVRvQXJjcyhjb3VudCkge1xuICAgIGlmIChjb3VudCA8PSAwKSB7IHJldHVybiBbXTsgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBjb3VudDtcblxuICAgIGNvbnN0IGFyY3MgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIGluZGV4LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBlbmQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogKGluZGV4KzEpLCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBhcmMgPSBuZXcgQXJjKHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsIHN0YXJ0LCBlbmQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGFyY3MucHVzaChhcmMpO1xuICAgIH1cblxuICAgIHJldHVybiBhcmNzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgbmV3IGBTZWdtZW50YCBvYmplY3RzIHJlcHJlc2VudGluZyBgdGhpc2BcbiAgKiBkaXZpZGVkIGludG8gYGNvdW50YCBjaG9yZHMsIGFsbCB3aXRoIHRoZSBzYW1lIGxlbmd0aC5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGFycmF5LiBXaGVuIGBjb3VudGAgaXNcbiAgKiBgMWAgcmV0dXJucyBhbiBhcmMgZXF1aXZhbGVudCB0b1xuICAqIGBbdGhpcy5jaG9yZFNlZ21lbnQoKV17QGxpbmsgUmFjLkFyYyNjaG9yZFNlZ21lbnR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiBzZWdtZW50cyB0byBkaXZpZGUgYHRoaXNgIGludG9cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnRbXX1cbiAgKi9cbiAgZGl2aWRlVG9TZWdtZW50cyhjb3VudCkge1xuICAgIGlmIChjb3VudCA8PSAwKSB7IHJldHVybiBbXTsgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHBhcnRUdXJuID0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLyBjb3VudDtcblxuICAgIGNvbnN0IHNlZ21lbnRzID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvdW50OyBpbmRleCArPSAxKSB7XG4gICAgICBjb25zdCBzdGFydEFuZ2xlID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIGluZGV4LCB0aGlzLmNsb2Nrd2lzZSk7XG4gICAgICBjb25zdCBlbmRBbmdsZSA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiAoaW5kZXgrMSksIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSB0aGlzLnBvaW50QXRBbmdsZShzdGFydEFuZ2xlKTtcbiAgICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5wb2ludEF0QW5nbGUoZW5kQW5nbGUpO1xuICAgICAgY29uc3Qgc2VnbWVudCA9IHN0YXJ0UG9pbnQuc2VnbWVudFRvUG9pbnQoZW5kUG9pbnQpO1xuICAgICAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudHM7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbXBvc2l0ZWAgdGhhdCBjb250YWlucyBgQmV6aWVyYCBvYmplY3RzIHJlcHJlc2VudGluZ1xuICAqIHRoZSBhcmMgZGl2aWRlZCBpbnRvIGBjb3VudGAgYmV6aWVycyB0aGF0IGFwcHJveGltYXRlIHRoZSBzaGFwZSBvZiB0aGVcbiAgKiBhcmMuXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBgQ29tcG9zaXRlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiBiZXppZXJzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuQ29tcG9zaXRlfVxuICAqXG4gICogQHNlZSBSYWMuQmV6aWVyXG4gICovXG4gIGRpdmlkZVRvQmV6aWVycyhjb3VudCkge1xuICAgIGlmIChjb3VudCA8PSAwKSB7IHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYywgW10pOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgLy8gbGVuZ3RoIG9mIHRhbmdlbnQ6XG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTczNDc0NS9ob3ctdG8tY3JlYXRlLWNpcmNsZS13aXRoLWIlQzMlQTl6aWVyLWN1cnZlc1xuICAgIGNvbnN0IHBhcnNQZXJUdXJuID0gMSAvIHBhcnRUdXJuO1xuICAgIGNvbnN0IHRhbmdlbnQgPSB0aGlzLnJhZGl1cyAqICg0LzMpICogTWF0aC50YW4oUmFjLlRBVS8ocGFyc1BlclR1cm4qNCkpO1xuXG4gICAgY29uc3QgYmV6aWVycyA9IFtdO1xuICAgIGNvbnN0IHNlZ21lbnRzID0gdGhpcy5kaXZpZGVUb1NlZ21lbnRzKGNvdW50KTtcbiAgICBzZWdtZW50cy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgY29uc3Qgc3RhcnRBcmNSYWRpdXMgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtLnN0YXJ0UG9pbnQoKSk7XG4gICAgICBjb25zdCBlbmRBcmNSYWRpdXMgPSB0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtLmVuZFBvaW50KCkpO1xuXG4gICAgICBsZXQgc3RhcnRBbmNob3IgPSBzdGFydEFyY1JhZGl1c1xuICAgICAgICAubmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UodGhpcy5yYWMuQW5nbGUuc3F1YXJlLCAhdGhpcy5jbG9ja3dpc2UsIHRhbmdlbnQpXG4gICAgICAgIC5lbmRQb2ludCgpO1xuICAgICAgbGV0IGVuZEFuY2hvciA9IGVuZEFyY1JhZGl1c1xuICAgICAgICAubmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UodGhpcy5yYWMuQW5nbGUuc3F1YXJlLCB0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAgIGNvbnN0IG5ld0JlemllciA9IG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICBzdGFydEFyY1JhZGl1cy5lbmRQb2ludCgpLCBzdGFydEFuY2hvcixcbiAgICAgICAgZW5kQW5jaG9yLCBlbmRBcmNSYWRpdXMuZW5kUG9pbnQoKSlcblxuICAgICAgYmV6aWVycy5wdXNoKG5ld0Jlemllcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5Db21wb3NpdGUodGhpcy5yYWMsIGJlemllcnMpO1xuICB9XG5cbn0gLy8gY2xhc3MgQXJjXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmM7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBCZXppZXIgY3VydmUgd2l0aCBzdGFydCwgZW5kLCBhbmQgdHdvIGFuY2hvciBbcG9pbnRzXXtAbGluayBSYWMuUG9pbnR9LlxuKiBAYWxpYXMgUmFjLkJlemllclxuKi9cbmNsYXNzIEJlemllciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpO1xuXG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuc3RhcnRBbmNob3IgPSBzdGFydEFuY2hvcjtcbiAgICB0aGlzLmVuZEFuY2hvciA9IGVuZEFuY2hvcjtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCBzdGFydFhTdHIgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydC54LCAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0WVN0ciAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRBbmNob3JYU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnRBbmNob3IueCwgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydEFuY2hvcllTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydEFuY2hvci55LCBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZEFuY2hvclhTdHIgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZEFuY2hvci54LCAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kQW5jaG9yWVN0ciAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kQW5jaG9yLnksICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRYU3RyICAgICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQueCwgICAgICAgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFlTdHIgICAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC55LCAgICAgICAgIGRpZ2l0cyk7XG5cbiAgICByZXR1cm4gYEJlemllcihzOigke3N0YXJ0WFN0cn0sJHtzdGFydFlTdHJ9KSBzYTooJHtzdGFydEFuY2hvclhTdHJ9LCR7c3RhcnRBbmNob3JZU3RyfSkgZWE6KCR7ZW5kQW5jaG9yWFN0cn0sJHtlbmRBbmNob3JZU3RyfSkgZTooJHtlbmRYU3RyfSwke2VuZFlTdHJ9KSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGFsbCBtZW1iZXJzLCBleGNlcHQgYHJhY2AsIG9mIGJvdGggYmV6aWVycyBhcmVcbiAgKiBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc307IG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlckJlemllcmAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5CZXppZXJgLCByZXR1cm5zXG4gICogYGZhbHNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkJlemllcn0gb3RoZXJCZXppZXIgLSBBIGBCZXppZXJgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKlxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJCZXppZXIpIHtcbiAgICByZXR1cm4gb3RoZXJCZXppZXIgaW5zdGFuY2VvZiBCZXppZXJcbiAgICAgICYmIHRoaXMuc3RhcnQgICAgICAuZXF1YWxzKG90aGVyQmV6aWVyLnN0YXJ0KVxuICAgICAgJiYgdGhpcy5zdGFydEFuY2hvci5lcXVhbHMob3RoZXJCZXppZXIuc3RhcnRBbmNob3IpXG4gICAgICAmJiB0aGlzLmVuZEFuY2hvciAgLmVxdWFscyhvdGhlckJlemllci5lbmRBbmNob3IpXG4gICAgICAmJiB0aGlzLmVuZCAgICAgICAgLmVxdWFscyhvdGhlckJlemllci5lbmQpO1xuICB9XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJlemllcjtcblxuXG5CZXppZXIucHJvdG90eXBlLmRyYXdBbmNob3JzID0gZnVuY3Rpb24oc3R5bGUgPSB1bmRlZmluZWQpIHtcbiAgcHVzaCgpO1xuICBpZiAoc3R5bGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHN0eWxlLmFwcGx5KCk7XG4gIH1cbiAgdGhpcy5zdGFydC5zZWdtZW50VG9Qb2ludCh0aGlzLnN0YXJ0QW5jaG9yKS5kcmF3KCk7XG4gIHRoaXMuZW5kLnNlZ21lbnRUb1BvaW50KHRoaXMuZW5kQW5jaG9yKS5kcmF3KCk7XG4gIHBvcCgpO1xufTtcblxuQmV6aWVyLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQmV6aWVyKHRoaXMucmFjLFxuICAgIHRoaXMuZW5kLCB0aGlzLmVuZEFuY2hvcixcbiAgICB0aGlzLnN0YXJ0QW5jaG9yLCB0aGlzLnN0YXJ0KTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250YWluZXIgb2YgYSBzZXF1ZW5jZSBvZiBkcmF3YWJsZSBvYmplY3RzIHRoYXQgY2FuIGJlIGRyYXduIHRvZ2V0aGVyLlxuKlxuKiBVc2VkIGJ5IGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gIHRvIHBlcmZvcm0gc3BlY2lmaWMgdmVydGV4XG4qIG9wZXJhdGlvbnMgd2l0aCBkcmF3YWJsZXMgdG8gZHJhdyBjb21wbGV4IHNoYXBlcy5cbipcbiogQGNsYXNzXG4qIEBhbGlhcyBSYWMuQ29tcG9zaXRlXG4qL1xuZnVuY3Rpb24gQ29tcG9zaXRlKHJhYywgc2VxdWVuY2UgPSBbXSkge1xuICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzZXF1ZW5jZSk7XG5cbiAgdGhpcy5yYWMgPSByYWM7XG4gIHRoaXMuc2VxdWVuY2UgPSBzZXF1ZW5jZTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NpdGU7XG5cblxuQ29tcG9zaXRlLnByb3RvdHlwZS5pc05vdEVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnNlcXVlbmNlLmxlbmd0aCAhPSAwO1xufTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBlbGVtZW50LmZvckVhY2goaXRlbSA9PiB0aGlzLnNlcXVlbmNlLnB1c2goaXRlbSkpO1xuICAgIHJldHVyblxuICB9XG4gIHRoaXMuc2VxdWVuY2UucHVzaChlbGVtZW50KTtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICBsZXQgcmV2ZXJzZWQgPSB0aGlzLnNlcXVlbmNlLm1hcChpdGVtID0+IGl0ZW0ucmV2ZXJzZSgpKVxuICAgIC5yZXZlcnNlKCk7XG4gIHJldHVybiBuZXcgQ29tcG9zaXRlKHRoaXMucmFjLCByZXZlcnNlZCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogUG9pbnQgaW4gYSB0d28gZGltZW50aW9uYWwgY29vcmRpbmF0ZSBzeXN0ZW0uXG4qXG4qIFNldmVyYWwgbWV0aG9kcyB3aWxsIHJldHVybiBhbiBhZGp1c3RlZCB2YWx1ZSBvciBwZXJmb3JtIGFkanVzdG1lbnRzIGluXG4qIHRoZWlyIG9wZXJhdGlvbiB3aGVuIHR3byBwb2ludHMgYXJlIGNsb3NlIGVub3VnaCBhcyB0byBiZSBjb25zaWRlcmVkXG4qIGVxdWFsLiBXaGVuIHRoZSB0aGUgZGlmZmVyZW5jZSBvZiBlYWNoIGNvb3JkaW5hdGUgb2YgdHdvIHBvaW50c1xuKiBpcyB1bmRlciB0aGUgW2BlcXVhbGl0eVRocmVzaG9sZGBde0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH0gdGhlXG4qIHBvaW50cyBhcmUgY29uc2lkZXJlZCBlcXVhbC4gVGhlIFtgZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc31cbiogbWV0aG9kIHBlcmZvcm1zIHRoaXMgY2hlY2suXG4qXG4qIEBhbGlhcyBSYWMuUG9pbnRcbiovXG5jbGFzcyBQb2ludHtcblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFBvaW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjXG4gICogICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqICAgVGhlIHggY29vcmRpbmF0ZVxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogICBUaGUgeSBjb29yZGluYXRlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgeCwgeSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHgsIHkpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih4LCB5KTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvaW50LlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMueCA9IHg7XG5cbiAgICAvKipcbiAgICAqIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBgYGBcbiAgKiAobmV3IFJhYy5Qb2ludChyYWMsIDU1LCA3NykpLnRvU3RyaW5nKClcbiAgKiAvLyBSZXR1cm5zOiBQb2ludCg1NSw3NylcbiAgKiBgYGBcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgUG9pbnQoJHt4U3RyfSwke3lTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJQb2ludGAgZm9yIGVhY2hcbiAgKiBjb29yZGluYXRlIGlzIHVuZGVyIFtgZXF1YWxpdHlUaHJlc2hvbGRgXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9O1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclBvaW50YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlBvaW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVmFsdWVzIGFyZSBjb21wYXJlZCB1c2luZyBbYFJhYy5lcXVhbHNgXXtAbGluayBSYWMjZXF1YWxzfS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBvdGhlclBvaW50IC0gQSBgUG9pbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYyNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyUG9pbnQpIHtcbiAgICByZXR1cm4gb3RoZXJQb2ludCBpbnN0YW5jZW9mIFBvaW50XG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy54LCBvdGhlclBvaW50LngpXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy55LCBvdGhlclBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WCAtIFRoZSB4IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCBuZXdYLCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLngsIG5ld1kpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgYWRkZWQgdG8gYHRoaXMueGAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFgoeCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeWAgYWRkZWQgdG8gYHRoaXMueWAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFkoeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLngsIHRoaXMueSArIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAgdG8gYHRoaXNgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGRQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHBvaW50LngsXG4gICAgICB0aGlzLnkgKyBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IGFkZGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cyB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29kaW5hdGUgdG8gYWRkXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkKHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgY29tcG9uZW50cyBvZiBgcG9pbnRgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBzdWJ0cmFjdFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN1YnRyYWN0UG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggLSBwb2ludC54LFxuICAgICAgdGhpcy55IC0gcG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cy5cbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBzdWJ0cmFjdFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3QoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHgsXG4gICAgICB0aGlzLnkgLSB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggdGhlIG5lZ2F0aXZlIGNvb3JkaW5hdGUgdmFsdWVzIG9mIGB0aGlzYC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCAtdGhpcy54LCAtdGhpcy55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBkaXN0YW5jZSB0b1xuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGRpc3RhbmNlVG9Qb2ludChwb2ludCkge1xuICAgIGlmICh0aGlzLmVxdWFscyhwb2ludCkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBjb25zdCB4ID0gTWF0aC5wb3coKHBvaW50LnggLSB0aGlzLngpLCAyKTtcbiAgICBjb25zdCB5ID0gTWF0aC5wb3coKHBvaW50LnkgLSB0aGlzLnkpLCAyKTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgreSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGFuZ2xlIGZyb20gYHRoaXNgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgW2NvbnNpZGVyZWQgZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHJldHVybnMgdGhlIGFuZ2xlIHByb2R1Y2VkIHdpdGggYGRlZmF1bHRBbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgYW5nbGUgdG9cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9XG4gICogICBbZGVmYXVsdEFuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBBbiBgQW5nbGVgIHRvIHJldHVybiB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBhbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBpZiAodGhpcy5lcXVhbHMocG9pbnQpKSB7XG4gICAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGRlZmF1bHRBbmdsZSk7XG4gICAgICByZXR1cm4gZGVmYXVsdEFuZ2xlO1xuICAgIH1cbiAgICBjb25zdCBvZmZzZXQgPSBwb2ludC5zdWJ0cmFjdFBvaW50KHRoaXMpO1xuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmF0YW4yKG9mZnNldC55LCBvZmZzZXQueCk7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCBhIGBkaXN0YW5jZWAgZnJvbSBgdGhpc2AgaW4gdGhlIGRpcmVjdGlvbiBvZlxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0b3dhcnMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlWCA9IGRpc3RhbmNlICogTWF0aC5jb3MoYW5nbGUucmFkaWFucygpKTtcbiAgICBjb25zdCBkaXN0YW5jZVkgPSBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgZGlzdGFuY2VYLCB0aGlzLnkgKyBkaXN0YW5jZVkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgbWlkZGxlIGJldHdlZW4gYHRoaXNgIGFuZCBgcG9pbnRgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBjYWxjdWxhdGUgYSBiaXNlY3RvciB0b1xuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRCaXNlY3Rvcihwb2ludCkge1xuICAgIGNvbnN0IHhPZmZzZXQgPSAocG9pbnQueCAtIHRoaXMueCkgLyAyO1xuICAgIGNvbnN0IHlPZmZzZXQgPSAocG9pbnQueSAtIHRoaXMueSkgLyAyO1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsIHRoaXMueCArIHhPZmZzZXQsIHRoaXMueSArIHlPZmZzZXQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFuZ2xlYC5cbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGBBbmdsZWAgb2YgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXkoYW5nbGUpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvd2FyZHMgYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBbY29uc2lkZXJlZCBlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sXG4gICogdGhlIG5ldyBgUmF5YCB3aWxsIHVzZSB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn1cbiAgKiAgIFtkZWZhdWx0QW5nbGU9W3JhYy5BbmdsZS56ZXJvXXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV1cbiAgKiAgIEFuIGBBbmdsZWAgdG8gdXNlIHdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBlcXVhbFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYHRoaXNgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGB0aGlzYCBpbiBgcmF5YC5cbiAgKlxuICAqIFdoZW4gdGhlIHByb2plY3RlZCBwb2ludCBhbmQgYHRoaXNgIGFyZVxuICAqIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSB0aGUgcHJvZHVjZWQgcmF5IHdpbGwgaGF2ZVxuICAqIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG8gYHJheWAgaW4gdGhlIGNsb2Nrd2lzZSBkaXJlY3Rpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IHJheSAtIEEgYFJheWAgdG8gcHJvamVjdCBgdGhpc2Agb250b1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICByYXlUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnJheVRvUG9pbnQocHJvamVjdGVkLCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IGB0aGlzYCBhbmQgaXMgdGFuZ2VudCB0byBgYXJjYCwgd2hlblxuICAqIG5vIHRhbmdlbnQgaXMgcG9zc2libGUgcmV0dXJucyBgbnVsbGAuXG4gICpcbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBUaGUgbmV3IGBSYXlgIHdpbGwgYmUgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYC4gYGFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlXG4gICogY2lyY2xlLlxuICAqXG4gICogV2hlbiBgdGhpc2AgaXMgaW5zaWRlIGBhcmNgIG5vIHRhbmdlbnQgc2VnbWVudCBpcyBwb3NzaWJsZSBhbmQgYG51bGxgXG4gICogaXMgcmV0dXJuZWQuXG4gICpcbiAgKiBBIHNwZWNpYWwgY2FzZSBpcyBjb25zaWRlcmVkIHdoZW4gYGFyYy5yYWRpdXNgIGlzIGNvbnNpZGVyZWQgdG8gYmUgYDBgXG4gICogYW5kIGB0aGlzYCBpcyBlcXVhbCB0byBgYXJjLmNlbnRlcmAuIEluIHRoaXMgY2FzZSB0aGUgYW5nbGUgYmV0d2VlblxuICAqIGB0aGlzYCBhbmQgYGFyYy5jZW50ZXJgIGlzIGFzc3VtZWQgdG8gYmUgdGhlIGludmVyc2Ugb2YgYGFyYy5zdGFydGAsXG4gICogdGh1cyB0aGUgbmV3IGBSYXlgIHdpbGwgaGF2ZSBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvXG4gICogYGFyYy5zdGFydC5pbnZlcnNlKClgLCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgdG8sIGNvbnNpZGVyZWRcbiAgKiBhcyBhIGNvbXBsZXRlIGNpcmNsZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybiB7P1JhYy5SYXl9XG4gICovXG4gIHJheVRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICAvLyBBIGRlZmF1bHQgYW5nbGUgaXMgZ2l2ZW4gZm9yIHRoZSBlZGdlIGNhc2Ugb2YgYSB6ZXJvLXJhZGl1cyBhcmNcbiAgICBsZXQgaHlwb3RlbnVzZSA9IHRoaXMuc2VnbWVudFRvUG9pbnQoYXJjLmNlbnRlciwgYXJjLnN0YXJ0LmludmVyc2UoKSk7XG4gICAgbGV0IG9wcyA9IGFyYy5yYWRpdXM7XG5cbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGh5cG90ZW51c2UubGVuZ3RoLCBhcmMucmFkaXVzKSkge1xuICAgICAgLy8gUG9pbnQgaW4gYXJjXG4gICAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gaHlwb3RlbnVzZS5yYXkuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBwZXJwZW5kaWN1bGFyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMuZXF1YWxzKGh5cG90ZW51c2UubGVuZ3RoLCAwKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGFuZ2xlU2luZSA9IG9wcyAvIGh5cG90ZW51c2UubGVuZ3RoO1xuICAgIGlmIChhbmdsZVNpbmUgPiAxKSB7XG4gICAgICAvLyBQb2ludCBpbnNpZGUgYXJjXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVSYWRpYW5zID0gTWF0aC5hc2luKGFuZ2xlU2luZSk7XG4gICAgbGV0IG9wc0FuZ2xlID0gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHRoaXMucmFjLCBhbmdsZVJhZGlhbnMpO1xuICAgIGxldCBzaGlmdGVkT3BzQW5nbGUgPSBoeXBvdGVudXNlLmFuZ2xlKCkuc2hpZnQob3BzQW5nbGUsIGNsb2Nrd2lzZSk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIHNoaWZ0ZWRPcHNBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFuZ2xlYCB3aXRoIHRoZSBnaXZlblxuICAqIGBsZW5ndGhgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gcG9pbnQgdGhlIHNlZ21lbnRcbiAgKiB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGgpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgcmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzYCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSxcbiAgKiB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZSB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aCBgZGVmYXVsdEFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9XG4gICogICBbZGVmYXVsdEFuZ2xlPVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBBbiBgQW5nbGVgIHRvIHVzZSB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgZGVmYXVsdEFuZ2xlID0gdGhpcy5hbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSk7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLCBkZWZhdWx0QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHJheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG8gdGhlIHByb2plY3Rpb24gb2YgYHRoaXNgIGluXG4gICogYHJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgZXF1YWwgdG8gYHRoaXNgLCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsXG4gICogaGF2ZSBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvIGByYXlgIGluIHRoZSBjbG9ja3dpc2UgZGlyZWN0aW9uLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIHByb2plY3QgYHRoaXNgIG9udG9cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb1Byb2plY3Rpb25JblJheShyYXkpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSByYXkucG9pbnRQcm9qZWN0aW9uKHRoaXMpO1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KHByb2plY3RlZCwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLFxuICAqIHdoZW4gbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgYmUgaW4gdGhlIGBjbG9ja3dpc2VgIHNpZGUgb2YgdGhlIHJheSBmb3JtZWRcbiAgKiBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhcmMuY2VudGVyYCwgYW5kIGl0cyBlbmQgcG9pbnQgd2lsbCBiZSBhdCB0aGVcbiAgKiBjb250YWN0IHBvaW50IHdpdGggYGFyY2Agd2hpY2ggaXMgY29uc2lkZXJlZCBhcyBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGlzIGluc2lkZSBgYXJjYCBubyB0YW5nZW50IHNlZ21lbnQgaXMgcG9zc2libGUgYW5kIGBudWxsYFxuICAqIGlzIHJldHVybmVkLlxuICAqXG4gICogQSBzcGVjaWFsIGNhc2UgaXMgY29uc2lkZXJlZCB3aGVuIGBhcmMucmFkaXVzYCBpcyBjb25zaWRlcmVkIHRvIGJlIGAwYFxuICAqIGFuZCBgdGhpc2AgaXMgZXF1YWwgdG8gYGFyYy5jZW50ZXJgLiBJbiB0aGlzIGNhc2UgdGhlIGFuZ2xlIGJldHdlZW5cbiAgKiBgdGhpc2AgYW5kIGBhcmMuY2VudGVyYCBpcyBhc3N1bWVkIHRvIGJlIHRoZSBpbnZlcnNlIG9mIGBhcmMuc3RhcnRgLFxuICAqIHRodXMgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybiB7P1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IHRhbmdlbnRSYXkgPSB0aGlzLnJheVRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSk7XG4gICAgaWYgKHRhbmdlbnRSYXkgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHRhbmdlbnRQZXJwID0gdGFuZ2VudFJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgcmFkaXVzUmF5ID0gYXJjLmNlbnRlci5yYXkodGFuZ2VudFBlcnApO1xuXG4gICAgcmV0dXJuIHRhbmdlbnRSYXkuc2VnbWVudFRvSW50ZXJzZWN0aW9uKHJhZGl1c1JheSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXNgIGFuZCB0aGUgZ2l2ZW4gYXJjIHByb3BlcnRpZXMuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfVxuICAqICAgW3N0YXJ0PVtyYWMuQW5nbGUuemVyb117QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31dXG4gICogICBUaGUgc3RhcnQgYEFuZ2xlYCBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZW5kPW51bGxdIC0gVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBuZXdcbiAgKiAgIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgc3RhcnRgIGlzIHVzZWQgaW5zdGVhZFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhcbiAgICByYWRpdXMsXG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvLFxuICAgIGVuZCA9IG51bGwsXG4gICAgY2xvY2t3aXNlID0gdHJ1ZSlcbiAge1xuICAgIHN0YXJ0ID0gdGhpcy5yYWMuQW5nbGUuZnJvbShzdGFydCk7XG4gICAgZW5kID0gZW5kID09PSBudWxsXG4gICAgICA/IHN0YXJ0XG4gICAgICA6IHRoaXMucmFjLkFuZ2xlLmZyb20oZW5kKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsIHRoaXMsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dGAgbG9jYXRlZCBhdCBgdGhpc2Agd2l0aCB0aGUgZ2l2ZW4gYHN0cmluZ2AgYW5kXG4gICogYGZvcm1hdGAuXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyBvZiB0aGUgbmV3IGBUZXh0YFxuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBbZm9ybWF0PVtyYWMuVGV4dC5Gb3JtYXQudG9wTGVmdF17QGxpbmsgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjdG9wTGVmdH1dXG4gICogICBUaGUgZm9ybWF0IG9mIHRoZSBuZXcgYFRleHRgXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICB0ZXh0KHN0cmluZywgZm9ybWF0ID0gdGhpcy5yYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCkge1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcy5yYWMsIHRoaXMsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIFBvaW50XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFVuYm91bmRlZCByYXkgZnJvbSBhIGBbUG9pbnRde0BsaW5rIFJhYy5Qb2ludH1gIGluIGRpcmVjdGlvbiBvZiBhblxuKiBgW0FuZ2xlXXtAbGluayBSYWMuQW5nbGV9YC5cbipcbiogQGFsaWFzIFJhYy5SYXlcbiovXG5jbGFzcyBSYXkge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheWAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnQgLSBBIGBQb2ludGAgd2hlcmUgdGhlIHJheSBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRoZSByYXkgaXMgZGlyZWN0ZWQgdG9cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIHJheS5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSByYXkgZXh0ZW5kcy5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBSYXkoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHN0YXJ0YCBhbmQgYGFuZ2xlYCBpbiBib3RoIHJheXMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclJheWAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5SYXlgLCByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclJheSkge1xuICAgIHJldHVybiBvdGhlclJheSBpbnN0YW5jZW9mIFJheVxuICAgICAgJiYgdGhpcy5zdGFydC5lcXVhbHMob3RoZXJSYXkuc3RhcnQpXG4gICAgICAmJiB0aGlzLmFuZ2xlLmVxdWFscyhvdGhlclJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNsb3BlIG9mIHRoZSByYXksIG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzIHZlcnRpY2FsLlxuICAqXG4gICogSW4gdGhlIGxpbmUgZm9ybXVsYSBgeSA9IG14ICsgYmAgdGhlIHNsb3BlIGlzIGBtYC5cbiAgKlxuICAqIEByZXR1cm5zIHs/bnVtYmVyfVxuICAqL1xuICBzbG9wZSgpIHtcbiAgICBsZXQgaXNWZXJ0aWNhbCA9XG4gICAgICAgICB0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHRoaXMuYW5nbGUudHVybiwgdGhpcy5yYWMuQW5nbGUuZG93bi50dXJuKVxuICAgICAgfHwgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLnVwLnR1cm4pO1xuICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC50YW4odGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB5LWludGVyY2VwdDogdGhlIHBvaW50IGF0IHdoaWNoIHRoZSByYXksIGV4dGVuZGVkIGluIGJvdGhcbiAgKiBkaXJlY3Rpb25zLCBpbnRlcmNlcHRzIHdpdGggdGhlIHktYXhpczsgb3IgYG51bGxgIGlmIHRoZSByYXkgaXNcbiAgKiB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSB5LWludGVyY2VwdCBpcyBgYmAuXG4gICpcbiAgKiBAcmV0dXJucyB7P251bWJlcn1cbiAgKi9cbiAgeUludGVyY2VwdCgpIHtcbiAgICBsZXQgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8geSA9IG14ICsgYlxuICAgIC8vIHkgLSBteCA9IGJcbiAgICByZXR1cm4gdGhpcy5zdGFydC55IC0gc2xvcGUgKiB0aGlzLnN0YXJ0Lng7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdTdGFydCAtIFRoZSBzdGFydCBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoU3RhcnQobmV3U3RhcnQpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnhgIHNldCB0byBgbmV3WGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld1ggLSBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWChuZXdYKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnQueWAgc2V0IHRvIGBuZXdZYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFkobmV3WSkge1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LndpdGhZKG5ld1kpLCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBuZXdBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20obmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoYW5nbGUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLmFkZChhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgbmV3QW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkc1xuICAqIGB7QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2UgYW5nbGUuaW52ZXJzZSgpfWAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgaW52ZXJzZUFuZ2xlID0gdGhpcy5hbmdsZS5pbnZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIGludmVyc2VBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgcG9pbnRpbmcgdG93YXJkcyB0aGVcbiAgKiBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9IG9mXG4gICogYGFuZ2xlYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBhbG9uZyB0aGUgcmF5IGJ5IHRoZSBnaXZlblxuICAqIGBkaXN0YW5jZWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW5cbiAgKiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2YgYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIGBzdGFydGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgdHJhbnNsYXRlVG9EaXN0YW5jZShkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLnN0YXJ0LnBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgc3RhcnRgIG1vdmVkIGJ5IHRoZSBnaXZlbiBkaXN0YW5jZSB0b3dhcmQgdGhlXG4gICogYGFuZ2xlLnBlcnBlbmRpY3VsYXIoKWAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVRvQW5nbGUocGVycGVuZGljdWxhciwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhbmdsZSBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCByZXR1cm5zIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBhbmdsZSB0b1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGFuZ2xlVG9Qb2ludChwb2ludCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHggY29vcmRpbmF0ZSBpcyBgeGAuXG4gICogV2hlbiB0aGUgcmF5IGlzIHZlcnRpY2FsLCByZXR1cm5zIGBudWxsYCBzaW5jZSBubyBzaW5nbGUgcG9pbnQgd2l0aCB4XG4gICogY29vcmRpbmF0ZSBhdCBgeGAgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYSB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFgoeCkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWCh4KTtcbiAgICB9XG5cbiAgICAvLyB5ID0gbXggKyBiXG4gICAgY29uc3QgeSA9IHNsb3BlICogeCArIHRoaXMueUludGVyY2VwdCgpO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIHJheSB3aGVyZSB0aGUgeSBjb29yZGluYXRlIGlzIGB5YC5cbiAgKiBXaGVuIHRoZSByYXkgaXMgaG9yaXpvbnRhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeVxuICAqIGNvb3JkaW5hdGUgYXQgYHlgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGFuIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGNhbGN1bGF0ZSBhIHBvaW50IGluIHRoZSByYXlcbiAgKiBAcmV0dXJzbiB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0WSh5KSB7XG4gICAgY29uc3Qgc2xvcGUgPSB0aGlzLnNsb3BlKCk7XG4gICAgaWYgKHNsb3BlID09PSBudWxsKSB7XG4gICAgICAvLyBWZXJ0aWNhbCByYXlcbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0LndpdGhZKHkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKHNsb3BlLCAwKSkge1xuICAgICAgLy8gSG9yaXpvbnRhbCByYXlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIG14ICsgYiA9IHlcbiAgICAvLyB4ID0gKHkgLSBiKS9tXG4gICAgY29uc3QgeCA9ICh5IC0gdGhpcy55SW50ZXJjZXB0KCkpIC8gc2xvcGU7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcy5yYWMsIHgsIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHJheSBhdCB0aGUgZ2l2ZW4gYGRpc3RhbmNlYCBmcm9tXG4gICogYHRoaXMuc3RhcnRgLiBXaGVuIGBkaXN0YW5jZWAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkXG4gICogaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0RGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUodGhpcy5hbmdsZSwgZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBCb3RoIHJheXMgYXJlIGNvbnNpZGVyZWQgdW5ib3VuZGVkIGxpbmVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY2FsY3VsYXRlIHRoZSBpbnRlcnNlY3Rpb24gd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBhID0gdGhpcy5zbG9wZSgpO1xuICAgIGNvbnN0IGIgPSBvdGhlclJheS5zbG9wZSgpO1xuICAgIC8vIFBhcmFsbGVsIGxpbmVzLCBubyBpbnRlcnNlY3Rpb25cbiAgICBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoYSwgYikpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIC8vIEFueSB2ZXJ0aWNhbCByYXlcbiAgICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gb3RoZXJSYXkucG9pbnRBdFgodGhpcy5zdGFydC54KTsgfVxuICAgIGlmIChiID09PSBudWxsKSB7IHJldHVybiB0aGlzLnBvaW50QXRYKG90aGVyUmF5LnN0YXJ0LngpOyB9XG5cbiAgICBjb25zdCBjID0gdGhpcy55SW50ZXJjZXB0KCk7XG4gICAgY29uc3QgZCA9IG90aGVyUmF5LnlJbnRlcmNlcHQoKTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpbmUlRTIlODAlOTNsaW5lX2ludGVyc2VjdGlvblxuICAgIGNvbnN0IHggPSAoZCAtIGMpIC8gKGEgLSBiKTtcbiAgICBjb25zdCB5ID0gYSAqIHggKyBjO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGAgb250byB0aGUgcmF5LiBUaGVcbiAgKiBwcm9qZWN0ZWQgcG9pbnQgaXMgdGhlIGNsb3Nlc3QgcG9zc2libGUgcG9pbnQgdG8gYHBvaW50YC5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IG9udG8gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50UHJvamVjdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gcG9pbnQucmF5KHBlcnBlbmRpY3VsYXIpXG4gICAgICAucG9pbnRBdEludGVyc2VjdGlvbih0aGlzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG8gdGhlIHByb2plY3Rpb24gb2YgYHBvaW50YFxuICAqIG9udG8gdGhlIHJheS5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBkaXN0YW5jZSBpcyBwb3NpdGl2ZSB3aGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgdG93YXJkc1xuICAqIHRoZSBkaXJlY3Rpb24gb2YgdGhlIHJheSwgYW5kIG5lZ2F0aXZlIHdoZW4gaXQgaXMgYmVoaW5kLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHByb2plY3QgYW5kIG1lYXN1cmUgdGhlXG4gICogZGlzdGFuY2UgdG9cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZVRvUHJvamVjdGVkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBwcm9qZWN0ZWQgPSB0aGlzLnBvaW50UHJvamVjdGlvbihwb2ludCk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlVG9Qb2ludChwcm9qZWN0ZWQpO1xuXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgMCkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlVG9Qcm9qZWN0ZWQgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwcm9qZWN0ZWQpO1xuICAgIGNvbnN0IGFuZ2xlRGlmZiA9IHRoaXMuYW5nbGUuc3VidHJhY3QoYW5nbGVUb1Byb2plY3RlZCk7XG4gICAgaWYgKGFuZ2xlRGlmZi50dXJuIDw9IDEvNCB8fCBhbmdsZURpZmYudHVybiA+IDMvNCkge1xuICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLWRpc3RhbmNlO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgYW5nbGUgdG8gdGhlIGdpdmVuIGBwb2ludGAgaXMgbG9jYXRlZCBjbG9ja3dpc2VcbiAgKiBvZiB0aGUgcmF5IG9yIGBmYWxzZWAgd2hlbiBsb2NhdGVkIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30gb3IgYHBvaW50YCBsYW5kcyBvbiB0aGUgcmF5LCBpdCBpc1xuICAqIGNvbnNpZGVyZWQgY2xvY2t3aXNlLiBXaGVuIGBwb2ludGAgbGFuZHMgb24gdGhlXG4gICogW2ludmVyc2Vde0BsaW5rIFJhYy5SYXkjaW52ZXJzZX0gb2YgdGhlIHJheSwgaXQgaXMgY29uc2lkZXJlZFxuICAqIGNvdW50ZXItY2xvY2t3aXNlLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIG9yaWVudGF0aW9uIHRvXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICpcbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKiBAc2VlIFJhYy5SYXkjaW52ZXJzZVxuICAqL1xuICBwb2ludE9yaWVudGF0aW9uKHBvaW50KSB7XG4gICAgY29uc3QgcG9pbnRBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICBpZiAodGhpcy5hbmdsZS5lcXVhbHMocG9pbnRBbmdsZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSBwb2ludEFuZ2xlLnN1YnRyYWN0KHRoaXMuYW5nbGUpO1xuICAgIC8vIFswIHRvIDAuNSkgaXMgY29uc2lkZXJlZCBjbG9ja3dpc2VcbiAgICAvLyBbMC41LCAxKSBpcyBjb25zaWRlcmVkIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcmV0dXJuIGFuZ2xlRGlzdGFuY2UudHVybiA8IDAuNTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBSYXlgIHdpbGwgdXNlIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFJheWAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICByYXlUb1BvaW50KHBvaW50KSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHVzaW5nIGB0aGlzYCBhbmQgdGhlIGdpdmVuIGBsZW5ndGhgLlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50KGxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMsIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXMuc3RhcnRgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgc2VnbWVudFRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5zZWdtZW50VG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0YCBhbmQgZW5kaW5nIGF0IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiBgdGhpc2AgYW5kIGBvdGhlclJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSByYXlzIGFyZSBwYXJhbGxlbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gaW50ZXJzZWN0aW9uIGlzXG4gICogcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0YCBhbmQgdGhlIGludGVyc2VjdGlvbiBwb2ludCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGVgLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHNlZ21lbnRUb0ludGVyc2VjdGlvbihvdGhlclJheSkge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSk7XG4gICAgaWYgKGludGVyc2VjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlZ21lbnRUb1BvaW50KGludGVyc2VjdGlvbik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWBcbiAgKiBhbmQgdGhlIGdpdmVuIGFyYyBwcm9wZXJ0aWVzLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxudW1iZXJ9IFtlbmRBbmdsZT1udWxsXSAtIFRoZSBlbmQgYEFuZ2xlYCBvZiB0aGUgbmV3XG4gICogYEFyY2A7IHdoZW4gYG51bGxgIG9yIG9tbWl0ZWQsIGB0aGlzLmFuZ2xlYCBpcyB1c2VkIGluc3RlYWRcbiAgKiBAcGFyYW0ge2Jvb2xlYW49fSBjbG9ja3dpc2U9dHJ1ZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhyYWRpdXMsIGVuZEFuZ2xlID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGVuZEFuZ2xlID0gZW5kQW5nbGUgPT09IG51bGxcbiAgICAgID8gdGhpcy5hbmdsZVxuICAgICAgOiB0aGlzLnJhYy5BbmdsZS5mcm9tKGVuZEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnN0YXJ0LCByYWRpdXMsXG4gICAgICB0aGlzLmFuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBjZW50ZXIgYXQgYHRoaXMuc3RhcnRgLCBzdGFydCBhdCBgdGhpcy5hbmdsZWAsXG4gICogYW5kIGVuZCBhdCB0aGUgZ2l2ZW4gYGFuZ2xlRGlzdGFuY2VgIGZyb20gYHRoaXMuc3RhcnRgIGluIHRoZVxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tXG4gICogYHRoaXMuc3RhcnRgIHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjVG9BbmdsZURpc3RhbmNlKHJhZGl1cywgYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGxldCBlbmRBbmdsZSA9IHRoaXMuYW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnN0YXJ0LCByYWRpdXMsXG4gICAgICB0aGlzLmFuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IExlYXZpbmcgdW5kb2N1bWVudGVkIGZvciBub3csIHVudGlsIGJldHRlciB1c2UvZXhwbGFuYXRpb24gaXMgZm91bmRcbiAgLy8gYmFzZWQgb24gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTczNDc0NS9ob3ctdG8tY3JlYXRlLWNpcmNsZS13aXRoLWIlQzMlQTl6aWVyLWN1cnZlc1xuICBiZXppZXJBcmMob3RoZXJSYXkpIHtcbiAgICBpZiAodGhpcy5zdGFydC5lcXVhbHMob3RoZXJSYXkuc3RhcnQpKSB7XG4gICAgICAvLyBXaGVuIGJvdGggcmF5cyBoYXZlIHRoZSBzYW1lIHN0YXJ0LCByZXR1cm5zIGEgcG9pbnQgYmV6aWVyLlxuICAgICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICB0aGlzLnN0YXJ0LCB0aGlzLnN0YXJ0LFxuICAgICAgICB0aGlzLnN0YXJ0LCB0aGlzLnN0YXJ0KTtcbiAgICB9XG5cbiAgICBsZXQgaW50ZXJzZWN0aW9uID0gdGhpcy5wZXJwZW5kaWN1bGFyKClcbiAgICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKG90aGVyUmF5LnBlcnBlbmRpY3VsYXIoKSk7XG5cbiAgICBsZXQgb3JpZW50YXRpb24gPSBudWxsO1xuICAgIGxldCByYWRpdXNBID0gbnVsbDtcbiAgICBsZXQgcmFkaXVzQiA9IG51bGw7XG5cbiAgICAvLyBDaGVjayBmb3IgcGFyYWxsZWwgcmF5c1xuICAgIGlmIChpbnRlcnNlY3Rpb24gIT09IG51bGwpIHtcbiAgICAgIC8vIE5vcm1hbCBpbnRlcnNlY3Rpb24gY2FzZVxuICAgICAgb3JpZW50YXRpb24gPSB0aGlzLnBvaW50T3JpZW50YXRpb24oaW50ZXJzZWN0aW9uKTtcbiAgICAgIHJhZGl1c0EgPSBpbnRlcnNlY3Rpb24uc2VnbWVudFRvUG9pbnQodGhpcy5zdGFydCk7XG4gICAgICByYWRpdXNCID0gaW50ZXJzZWN0aW9uLnNlZ21lbnRUb1BvaW50KG90aGVyUmF5LnN0YXJ0KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbiBjYXNlIG9mIHBhcmFsbGVsIHJheXMsIG90aGVyUmF5IGdldHMgc2hpZnRlZCB0byBiZVxuICAgICAgLy8gcGVycGVuZGljdWxhciB0byB0aGlzLlxuICAgICAgbGV0IHNoaWZ0ZWRJbnRlcnNlY3Rpb24gPSB0aGlzLnBlcnBlbmRpY3VsYXIoKVxuICAgICAgICAucG9pbnRBdEludGVyc2VjdGlvbihvdGhlclJheSk7XG4gICAgICBpZiAoc2hpZnRlZEludGVyc2VjdGlvbiA9PT0gbnVsbCB8fCB0aGlzLnN0YXJ0LmVxdWFscyhzaGlmdGVkSW50ZXJzZWN0aW9uKSkge1xuICAgICAgICAvLyBXaGVuIGJvdGggcmF5cyBsYXkgb24gdG9wIG9mIGVhY2ggb3RoZXIsIHRoZSBzaGlmdGluZyBwcm9kdWNlc1xuICAgICAgICAvLyByYXlzIHdpdGggdGhlIHNhbWUgc3RhcnQ7IGZ1bmN0aW9uIHJldHVybnMgYSBsaW5lYXIgYmV6aWVyLlxuICAgICAgICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgICAgdGhpcy5zdGFydCwgdGhpcy5zdGFydCxcbiAgICAgICAgICBvdGhlclJheS5zdGFydCwgb3RoZXJSYXkuc3RhcnQpO1xuICAgICAgfVxuICAgICAgaW50ZXJzZWN0aW9uID0gdGhpcy5zdGFydC5wb2ludEF0QmlzZWN0b3Ioc2hpZnRlZEludGVyc2VjdGlvbik7XG5cbiAgICAgIC8vIENhc2UgZm9yIHNoaWZ0ZWQgaW50ZXJzZWN0aW9uIGJldHdlZW4gdHdvIHJheXNcbiAgICAgIG9yaWVudGF0aW9uID0gdGhpcy5wb2ludE9yaWVudGF0aW9uKGludGVyc2VjdGlvbik7XG4gICAgICByYWRpdXNBID0gaW50ZXJzZWN0aW9uLnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnQpO1xuICAgICAgcmFkaXVzQiA9IHJhZGl1c0EuaW52ZXJzZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSByYWRpdXNBLmFuZ2xlKCkuZGlzdGFuY2UocmFkaXVzQi5hbmdsZSgpLCBvcmllbnRhdGlvbik7XG4gICAgY29uc3QgcXVhcnRlckFuZ2xlID0gYW5nbGVEaXN0YW5jZS5tdWx0KDEvNCk7XG4gICAgLy8gVE9ETzogd2hhdCBoYXBwZW5zIHdpdGggc3F1YXJlIGFuZ2xlcz8gaXMgdGhpcyBjb3ZlcmVkIGJ5IGludGVyc2VjdGlvbiBsb2dpYz9cbiAgICBjb25zdCBxdWFydGVyVGFuID0gcXVhcnRlckFuZ2xlLnRhbigpO1xuXG4gICAgY29uc3QgdGFuZ2VudEEgPSBxdWFydGVyVGFuICogcmFkaXVzQS5sZW5ndGggKiA0LzM7XG4gICAgY29uc3QgYW5jaG9yQSA9IHRoaXMucG9pbnRBdERpc3RhbmNlKHRhbmdlbnRBKTtcblxuICAgIGNvbnN0IHRhbmdlbnRCID0gcXVhcnRlclRhbiAqIHJhZGl1c0IubGVuZ3RoICogNC8zO1xuICAgIGNvbnN0IGFuY2hvckIgPSBvdGhlclJheS5wb2ludEF0RGlzdGFuY2UodGFuZ2VudEIpO1xuXG4gICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAgICAgICB0aGlzLnN0YXJ0LCBhbmNob3JBLFxuICAgICAgICBhbmNob3JCLCBvdGhlclJheS5zdGFydCk7XG4gIH1cblxufSAvLyBjbGFzcyBSYXlcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJheTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFNlZ21lbnQgb2YgYSBgW1JheV17QGxpbmsgUmFjLlJheX1gIHVwIHRvIGEgZ2l2ZW4gbGVuZ3RoLlxuKlxuKiBAYWxpYXMgUmFjLlNlZ21lbnRcbiovXG5jbGFzcyBTZWdtZW50IHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTZWdtZW50YCBpbnN0YW5jZS5cbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRoZSBzZWdtZW50IHdpbGwgYmUgYmFzZWQgb2ZcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudFxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHJheSwgbGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogZGlmZmVyZW50IGFwcHJvYWNoIHRvIGVycm9yIHRocm93aW5nP1xuICAgIC8vIGFzc2VydCB8fCB0aHJvdyBuZXcgRXJyb3IoZXJyLm1pc3NpbmdQYXJhbWV0ZXJzKVxuICAgIC8vIG9yXG4gICAgLy8gY2hlY2tlcihtc2cgPT4geyB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChtc2cpKTtcbiAgICAvLyAgIC5leGlzdHMocmFjKVxuICAgIC8vICAgLmlzVHlwZShSYWMuUmF5LCByYXkpXG4gICAgLy8gICAuaXNOdW1iZXIobGVuZ3RoKVxuXG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgcmF5LCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlJheSwgcmF5KTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIobGVuZ3RoKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYFJheWAgdGhlIHNlZ21lbnQgaXMgYmFzZWQgb2YuXG4gICAgKiBAdHlwZSB7UmFjLlJheX1cbiAgICAqL1xuICAgIHRoaXMucmF5ID0gcmF5O1xuXG4gICAgLyoqXG4gICAgKiBUaGUgbGVuZ3RoIG9mIHRoZSBzZWdtZW50LlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuc3RhcnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IGxlbmd0aFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmxlbmd0aCwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFNlZ21lbnQoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9IGw6JHtsZW5ndGhTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHJheWAgYW5kIGBsZW5ndGhgIGluIGJvdGggc2VnbWVudHMgYXJlIGVxdWFsO1xuICAqIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclNlZ21lbnRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuU2VnbWVudGAsIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFNlZ21lbnRzJyBgbGVuZ3RoYCBhcmUgY29tcGFyZWQgdXNpbmcgYHtAbGluayBSYWMjZXF1YWxzfWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBvdGhlclNlZ21lbnQgLSBBIGBTZWdtZW50YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUmF5I2VxdWFsc1xuICAqIEBzZWUgUmFjI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJTZWdtZW50KSB7XG4gICAgcmV0dXJuIG90aGVyU2VnbWVudCBpbnN0YW5jZW9mIFNlZ21lbnRcbiAgICAgICYmIHRoaXMucmF5LmVxdWFscyhvdGhlclNlZ21lbnQucmF5KVxuICAgICAgJiYgdGhpcy5yYWMuZXF1YWxzKHRoaXMubGVuZ3RoLCBvdGhlclNlZ21lbnQubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYFthbmdsZV17QGxpbmsgUmFjLlJheSNhbmdsZX1gIG9mIHRoZSBzZWdtZW50J3MgYHJheWAuXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgYW5nbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LmFuZ2xlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgW3N0YXJ0XXtAbGluayBSYWMuUmF5I3N0YXJ0fWAgb2YgdGhlIHNlZ21lbnQncyBgcmF5YC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBzdGFydFBvaW50KCkge1xuICAgIHJldHVybiB0aGlzLnJheS5zdGFydDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdoZXJlIHRoZSBzZWdtZW50IGVuZHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgZW5kUG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYW5nbGUgc2V0IHRvIGBuZXdBbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5yYXkuc3RhcnQsIG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGByYXlgIHNldCB0byBgbmV3UmF5YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG5ld1JheSAtIFRoZSByYXkgZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoUmF5KG5ld1JheSkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggc3RhcnQgcG9pbnQgc2V0IHRvIGBuZXdTdGFydGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld1N0YXJ0UG9pbnQgLSBUaGUgc3RhcnQgcG9pbnQgZm9yIHRoZSBuZXdcbiAgKiBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhTdGFydFBvaW50KG5ld1N0YXJ0UG9pbnQpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnRQb2ludCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBzZXQgdG8gYG5ld0xlbmd0aGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld0xlbmd0aCAtIFRoZSBsZW5ndGggZm9yIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoKG5ld0xlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgdGhpcy5yYXksIG5ld0xlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgYWRkZWQgdG8gYHRoaXMubGVuZ3RoYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGhBZGQobGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKyBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIHNldCB0byBgdGhpcy5sZW5ndGggKiByYXRpb2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGggKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGFuZ2xlYCBhZGRlZCB0byBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlQWRkKGFuZ2xlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlQWRkKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBhbmdsZWAgc2V0IHRvXG4gICogYHRoaXMucmF5LntAbGluayBSYWMuQW5nbGUjc2hpZnQgYW5nbGUuc2hpZnR9KGFuZ2xlLCBjbG9ja3dpc2UpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGJlIHNoaWZ0ZWQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGVTaGlmdChhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIGluIHRoZSBpbnZlcnNlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBUaGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgZW5kUG9pbnQoKWAgYW5kIGBhbmdsZSgpYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBVc2luZyBhIHBvc2l0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIGxvbmdlciBzZWdtZW50LCB1c2luZyBhXG4gICogbmVnYXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgc2hvcnRlciBvbmUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhTdGFydEV4dGVuc2lvbihkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvRGlzdGFuY2UoLWRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGggKyBkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGRpc3RhbmNlYCBhZGRlZCB0byBgdGhpcy5sZW5ndGhgLCB3aGljaFxuICAqIHJlc3VsdHMgaW4gYGVuZFBvaW50KClgIGZvciB0aGUgcmVzdWx0aW5nIGBTZWdtZW50YCBtb3ZpbmcgaW4gdGhlXG4gICogZGlyZWN0aW9uIG9mIHRoZSBzZWdtZW50J3MgcmF5IGJ5IHRoZSBnaXZlbiBgZGlzdGFuY2VgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHRoZSBzYW1lIG9wZXJhdGlvbiBhc1xuICAqIGBbd2l0aExlbmd0aEFkZF17QGxpbmsgUmFjLlNlZ21lbnQjd2l0aExlbmd0aEFkZH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIGFkZCB0byBgbGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihkaXN0YW5jZSkge1xuICAgIHJldHVybiB0aGlzLndpdGhMZW5ndGhBZGQoZGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwb2l0aW5nIHRvd2FyZHMgdGhlXG4gICogW2ludmVyc2UgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfSBvZiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc3RhcnRQb2ludCgpYCBhbmQgYGxlbmd0aGBcbiAgKiBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjaW52ZXJzZVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LmludmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwb2ludGluZyB0b3dhcmRzIHRoZVxuICAqIFtwZXJwZW5kaWN1bGFyIGFuZ2xlXXtAbGluayBSYWMuQW5nbGUjcGVycGVuZGljdWxhcn0gb2ZcbiAgKiBgdGhpcy5hbmdsZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmVzdWx0aW5nIGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIHNhbWUgYHN0YXJ0UG9pbnQoKWAgYW5kIGBsZW5ndGhgXG4gICogYXMgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgcGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggaXRzIHN0YXJ0IHBvaW50IHNldCBhdFxuICAqIGBbdGhpcy5lbmRQb2ludCgpXXtAbGluayBSYWMuU2VnbWVudCNlbmRQb2ludH1gLFxuICAqIGFuZ2xlIHNldCB0byBgdGhpcy5hbmdsZSgpLltpbnZlcnNlKClde0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlfWAsIGFuZFxuICAqIHNhbWUgbGVuZ3RoIGFzIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5BbmdsZSNpbnZlcnNlXG4gICovXG4gIHJldmVyc2UoKSB7XG4gICAgY29uc3QgZW5kID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IGludmVyc2VSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgZW5kLCB0aGlzLnJheS5hbmdsZS5pbnZlcnNlKCkpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgaW52ZXJzZVJheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCB0b3dhcmRzIGBhbmdsZWAgYnlcbiAgKiB0aGUgZ2l2ZW4gYGRpc3RhbmNlYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50XG4gICAgdG93YXJkc1xuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgdHJhbnNsYXRlVG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgYWxvbmcgdGhlIHNlZ21lbnQnc1xuICAqIHJheSBieSB0aGUgZ2l2ZW4gYGxlbmd0aGAuIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBsZW5ndGhgIGlzIG5lZ2F0aXZlLCBgc3RhcnRgIGlzIG1vdmVkIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZlxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgdHJhbnNsYXRlVG9MZW5ndGgobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZShsZW5ndGgpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIHRoZSBnaXZlbiBgZGlzdGFuY2VgXG4gICogdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBhbmdsZSB0byBgdGhpcy5hbmdsZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdG9uLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlUGVycGVuZGljdWxhcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBnaXZlbiBgdmFsdWVgIGNsYW1wZWQgdG8gW3N0YXJ0SW5zZXQsIGxlbmd0aC1lbmRJbnNldF0uXG4gICpcbiAgKiBXaGVuIGBzdGFydEluc2V0YCBpcyBncmVhdGVyIHRoYXQgYGxlbmd0aC1lbmRJbnNldGAgdGhlIHJhbmdlIGZvciB0aGVcbiAgKiBjbGFtcCBiZWNvbWVzIGltcG9zaWJsZSB0byBmdWxmaWxsLiBJbiB0aGlzIGNhc2UgdGhlIHJldHVybmVkIHZhbHVlXG4gICogd2lsbCBiZSB0aGUgY2VudGVyZWQgYmV0d2VlbiB0aGUgcmFuZ2UgbGltaXRzIGFuZCBzdGlsbCBjbGFtcGxlZCB0b1xuICAqIGBbMCwgbGVuZ3RoXWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBBIHZhbHVlIHRvIGNsYW1wXG4gICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydEluc2V0PTBdIC0gVGhlIGluc2V0IGZvciB0aGUgbG93ZXIgbGltaXQgb2YgdGhlXG4gICogY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcGFyYW0ge2VuZEluc2V0fSBbZW5kSW5zZXQ9MF0gLSBUaGUgaW5zZXQgZm9yIHRoZSBoaWdoZXIgbGltaXQgb2YgdGhlXG4gICogY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBjbGFtcFRvTGVuZ3RoKHZhbHVlLCBzdGFydEluc2V0ID0gMCwgZW5kSW5zZXQgPSAwKSB7XG4gICAgY29uc3QgZW5kTGltaXQgPSB0aGlzLmxlbmd0aCAtIGVuZEluc2V0O1xuICAgIGlmIChzdGFydEluc2V0ID49IGVuZExpbWl0KSB7XG4gICAgICAvLyBpbXBvc2libGUgcmFuZ2UsIHJldHVybiBtaWRkbGUgcG9pbnRcbiAgICAgIGNvbnN0IHJhbmdlTWlkZGxlID0gKHN0YXJ0SW5zZXQgLSBlbmRMaW1pdCkgLyAyO1xuICAgICAgY29uc3QgbWlkZGxlID0gc3RhcnRJbnNldCAtIHJhbmdlTWlkZGxlO1xuICAgICAgLy8gU3RpbGwgY2xhbXAgdG8gdGhlIHNlZ21lbnQgaXRzZWxmXG4gICAgICBsZXQgY2xhbXBlZCA9IG1pZGRsZTtcbiAgICAgIGNsYW1wZWQgPSBNYXRoLm1pbihjbGFtcGVkLCB0aGlzLmxlbmd0aCk7XG4gICAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgMCk7XG4gICAgICByZXR1cm4gY2xhbXBlZDtcbiAgICB9XG4gICAgbGV0IGNsYW1wZWQgPSB2YWx1ZTtcbiAgICBjbGFtcGVkID0gTWF0aC5taW4oY2xhbXBlZCwgdGhpcy5sZW5ndGggLSBlbmRJbnNldCk7XG4gICAgY2xhbXBlZCA9IE1hdGgubWF4KGNsYW1wZWQsIHN0YXJ0SW5zZXQpO1xuICAgIHJldHVybiBjbGFtcGVkO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHNlZ21lbnQncyByYXkgYXQgdGhlIGdpdmVuIGBsZW5ndGhgIGZyb21cbiAgKiBgdGhpcy5zdGFydFBvaW50KClgLiBXaGVuIGBsZW5ndGhgIGlzIG5lZ2F0aXZlLCB0aGUgbmV3IGBQb2ludGAgaXNcbiAgKiBjYWxjdWxhdGVkIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydFBvaW50KClgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKiBAc2VlIFJhYy5SYXkjcG9pbnRBdERpc3RhbmNlXG4gICovXG4gIHBvaW50QXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZShsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgaW4gdGhlIHNlZ21lbnQncyByYXkgYXQgYSBkaXN0YW5jZSBvZlxuICAqIGB0aGlzLmxlbmd0aCAqIHJhdGlvYCBmcm9tIGB0aGlzLnN0YXJ0UG9pbnQoKWAuIFdoZW4gYHJhdGlvYCBpc1xuICAqIG5lZ2F0aXZlLCB0aGUgbmV3IGBQb2ludGAgaXMgY2FsY3VsYXRlZCBpbiB0aGUgaW52ZXJzZSBkaXJlY3Rpb24gb2ZcbiAgKiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aGAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqIEBzZWUgUmFjLlJheSNwb2ludEF0RGlzdGFuY2VcbiAgKi9cbiAgcG9pbnRBdExlbmd0aFJhdGlvKHJhdGlvKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBtaWRkbGUgcG9pbnQgdGhlIHNlZ21lbnQuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEJpc2VjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLnJheS5wb2ludEF0RGlzdGFuY2UodGhpcy5sZW5ndGgvMik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGBuZXdTdGFydFBvaW50YCBhbmQgZW5kaW5nIGF0XG4gICogYHRoaXMuZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBXaGVuIGBuZXdTdGFydFBvaW50YCBhbmQgYHRoaXMuZW5kUG9pbnQoKWAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld1N0YXJ0UG9pbnQgLSBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIG1vdmVTdGFydFBvaW50KG5ld1N0YXJ0UG9pbnQpIHtcbiAgICBjb25zdCBlbmRQb2ludCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICByZXR1cm4gbmV3U3RhcnRQb2ludC5zZWdtZW50VG9Qb2ludChlbmRQb2ludCwgdGhpcy5yYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgdGhpcy5zdGFydFBvaW50KClgIGFuZCBlbmRpbmcgYXRcbiAgKiBgbmV3RW5kUG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydFBvaW50KClgIGFuZCBgbmV3RW5kUG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2VcbiAgKiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXdFbmRQb2ludCAtIFRoZSBlbmQgcG9pbnQgb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIG1vdmVFbmRQb2ludChuZXdFbmRQb2ludCkge1xuICAgIHJldHVybiB0aGlzLnJheS5zZWdtZW50VG9Qb2ludChuZXdFbmRQb2ludCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gdGhlIHN0YXJ0aW5nIHBvaW50IHRvIHRoZSBzZWdtZW50J3MgbWlkZGxlXG4gICogcG9pbnQuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuU2VnbWVudCNwb2ludEF0QmlzZWN0b3JcbiAgKi9cbiAgc2VnbWVudFRvQmlzZWN0b3IoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgdGhpcy5sZW5ndGgvMik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gdGhlIHNlZ21lbnQncyBtaWRkbGUgcG9pbnQgdG93YXJkcyB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9udW1iZXJ9IFtsZW5ndGg9bnVsbF0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgLCBvclxuICAqIGBudWxsYCB0byB1c2UgYHRoaXMubGVuZ3RoYFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5TZWdtZW50I3BvaW50QXRCaXNlY3RvclxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgc2VnbWVudEJpc2VjdG9yKGxlbmd0aCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMucG9pbnRBdEJpc2VjdG9yKCk7XG4gICAgY29uc3QgbmV3QW5nbGUgPSB0aGlzLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgY29uc3QgbmV3UmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCBuZXdBbmdsZSk7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IGxlbmd0aDtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgd2l0aCB0aGUgZ2l2ZW5cbiAgKiBgbGVuZ3RoYCBhbmQgdGhlIHNhbWUgYW5nbGUgYXMgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG5leHQgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFdpdGhMZW5ndGgobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aFN0YXJ0KG5ld1N0YXJ0KTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgYW5kIHVwIHRvIHRoZSBnaXZlblxuICAqIGBuZXh0RW5kUG9pbnRgLlxuICAqXG4gICogV2hlbiBgZW5kUG9pbnQoKWAgYW5kIGBuZXh0RW5kUG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgU2VnbWVudGAgd2lsbCB1c2VcbiAgKiBgdGhpcy5hbmdsZSgpYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBuZXh0RW5kUG9pbnQgLSBUaGUgZW5kIHBvaW50IG9mIHRoZSBuZXh0IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbmV4dFNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydC5zZWdtZW50VG9Qb2ludChuZXh0RW5kUG9pbnQsIHRoaXMucmF5LmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgdG93YXJkcyBgYW5nbGVgXG4gICogd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAuXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBuZXh0U2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IGxlbmd0aDtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgdG93YXJkcyB0aGUgZ2l2ZW5cbiAgKiBgYW5nbGVEaXN0YW5jZWAgZnJvbSBgdGhpcy5hbmdsZSgpLmludmVyc2UoKWAgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIGBhbmdsZURpc3RhbmNlYCBpcyBhcHBsaWVkIHRvIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAqIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoIGFuIGBhbmdsZURpc3RhbmNlYCBvZiBgMGAgdGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGJlIGRpcmVjdGx5IG92ZXIgYW5kIHBvaW50aW5nIGluIHRoZSBpbnZlcnNlIGFuZ2xlIG9mXG4gICogYHRoaXNgLiBBcyB0aGUgYGFuZ2xlRGlzdGFuY2VgIGluY3JlYXNlcyB0aGUgdHdvIHNlZ21lbnRzIHNlcGFyYXRlIHdpdGhcbiAgKiB0aGUgcGl2b3QgYXQgYGVuZFBvaW50KClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gQW4gYW5nbGUgZGlzdGFuY2UgdG8gYXBwbHkgdG9cbiAgKiB0aGUgc2VnbWVudCdzIGFuZ2xlIGludmVyc2VcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIGFuZ2xlIHNoaWZ0XG4gICogZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcGFyYW0gez9udW1iZXJ9IFtsZW5ndGg9bnVsbF0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgLCBvclxuICAqIGBudWxsYCB0byB1c2UgYHRoaXMubGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5BbmdsZSNpbnZlcnNlXG4gICovXG4gIG5leHRTZWdtZW50VG9BbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBhbmdsZURpc3RhbmNlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZURpc3RhbmNlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGwgPyB0aGlzLmxlbmd0aCA6IGxlbmd0aDtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UodGhpcy5sZW5ndGgpXG4gICAgICAuaW52ZXJzZSgpXG4gICAgICAud2l0aEFuZ2xlU2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgdG93YXJkcyB0aGVcbiAgKiBgW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfWAgb2ZcbiAgKiBgdGhpcy5hbmdsZSgpLmludmVyc2UoKWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoZSBwZXJwZW5kaWN1bGFyIGlzIGNhbGN1bGF0ZWQgZnJvbSB0aGUgaW52ZXJzZSBvZiB0aGVcbiAgKiBzZWdtZW50J3MgYW5nbGUuIEUuZy4gd2l0aCBgY2xvY2t3aXNlYCBhcyBgdHJ1ZWAsIHRoZSByZXN1bHRpbmdcbiAgKiBgU2VnbWVudGAgd2lsbCBiZSBwb2ludGluZyB0b3dhcmRzIGB0aGlzLmFuZ2xlKCkucGVycGVuZGljdWxhcihmYWxzZSlgLlxuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcGFyYW0gez9udW1iZXJ9IFtsZW5ndGg9bnVsbF0gLSBUaGUgbGVuZ3RoIG9mIHRoZSBuZXcgYFNlZ21lbnRgLCBvclxuICAqIGBudWxsYCB0byB1c2UgYHRoaXMubGVuZ3RoYFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyXG4gICovXG4gIG5leHRTZWdtZW50UGVycGVuZGljdWxhcihjbG9ja3dpc2UgPSB0cnVlLCBsZW5ndGggPSBudWxsKSB7XG4gICAgY29uc3QgbmV3TGVuZ3RoID0gbGVuZ3RoID09PSBudWxsXG4gICAgICA/IHRoaXMubGVuZ3RoXG4gICAgICA6IGxlbmd0aDtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheVxuICAgICAgLnRyYW5zbGF0ZVRvRGlzdGFuY2UodGhpcy5sZW5ndGgpXG4gICAgICAucGVycGVuZGljdWxhcighY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgZnJvbSBgZW5kUG9pbnQoKWAgd2hpY2ggY29ycmVzcG9uZHNcbiAgKiB0byB0aGUgbGVnIG9mIGEgcmlnaHQgdHJpYW5nbGUgd2hlcmUgYHRoaXNgIGlzIHRoZSBvdGhlciBjYXRoZXR1cyBhbmRcbiAgKiB0aGUgaHlwb3RlbnVzZSBpcyBvZiBsZW5ndGggYGh5cG90ZW51c2VgLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBwb2ludCB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIGFuZ2xlIG9mXG4gICogYFt0aGlzLmFuZ2xlKCkuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gYGh5cG90ZW51c2VgIGlzIHNtYWxsZXIgdGhhdCB0aGUgc2VnbWVudCdzIGBsZW5ndGhgLCByZXR1cm5zXG4gICogYG51bGxgIHNpbmNlIG5vIHJpZ2h0IHRyaWFuZ2xlIGlzIHBvc3NpYmxlLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGh5cG90ZW51c2UgLSBUaGUgbGVuZ3RoIG9mIHRoZSBoeXBvdGVudXNlIHNpZGUgb2YgdGhlXG4gICogcmlnaHQgdHJpYW5nbGUgZm9ybWVkIHdpdGggYHRoaXNgIGFuZCB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGVcbiAgKiBwZXJwZW5kaWN1bGFyIGFuZ2xlIGZyb20gYGVuZFBvaW50KClgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgbmV4dFNlZ21lbnRMZWdXaXRoSHlwKGh5cG90ZW51c2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBpZiAoaHlwb3RlbnVzZSA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBjb3MgPSBhZHkgLyBoeXBcbiAgICBjb25zdCByYWRpYW5zID0gTWF0aC5hY29zKHRoaXMubGVuZ3RoIC8gaHlwb3RlbnVzZSk7XG4gICAgLy8gdGFuID0gb3BzIC8gYWRqXG4gICAgLy8gdGFuICogYWRqID0gb3BzXG4gICAgY29uc3Qgb3BzID0gTWF0aC50YW4ocmFkaWFucykgKiB0aGlzLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcy5uZXh0U2VnbWVudFBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlLCBvcHMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIGJhc2VkIG9uIHRoaXMgc2VnbWVudCwgd2l0aCB0aGUgZ2l2ZW4gYGVuZEFuZ2xlYFxuICAqIGFuZCBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXR1cm5lZCBgQXJjYCB3aWxsIHVzZSB0aGlzIHNlZ21lbnQncyBzdGFydCBhcyBgY2VudGVyYCwgaXRzIGFuZ2xlXG4gICogYXMgYHN0YXJ0YCwgYW5kIGl0cyBsZW5ndGggYXMgYHJhZGl1c2AuXG4gICpcbiAgKiBXaGVuIGBlbmRBbmdsZWAgaXMgb21taXRlZCBvciBgbnVsbGAsIHRoZSBzZWdtZW50J3MgYW5nbGUgaXMgdXNlZFxuICAqIGluc3RlYWQgcmVzdWx0aW5nIGluIGEgY29tcGxldGUtY2lyY2xlIGFyYy5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZX0gW2VuZEFuZ2xlPW51bGxdIC0gQW4gYEFuZ2xlYCB0byB1c2UgYXMgZW5kIGZvciB0aGVcbiAgKiBuZXcgYEFyY2AsIG9yIGBudWxsYCB0byB1c2UgYHRoaXMuYW5nbGUoKWBcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMoZW5kQW5nbGUgPSBudWxsLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgZW5kQW5nbGUgPSBlbmRBbmdsZSA9PT0gbnVsbFxuICAgICAgPyB0aGlzLnJheS5hbmdsZVxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kQW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHRoaXMucmF5LmFuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgYmFzZWQgb24gdGhpcyBzZWdtZW50LCB3aXRoIHRoZSBhcmMncyBlbmQgYXRcbiAgKiBgYW5nbGVEaXN0YW5jZWAgZnJvbSB0aGUgc2VnbWVudCdzIGFuZ2xlIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBBcmNgIHdpbGwgdXNlIHRoaXMgc2VnbWVudCdzIHN0YXJ0IGFzIGBjZW50ZXJgLCBpdHMgYW5nbGVcbiAgKiBhcyBgc3RhcnRgLCBhbmQgaXRzIGxlbmd0aCBhcyBgcmFkaXVzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVEaXN0YW5jZSAtIFRoZSBhbmdsZSBkaXN0YW5jZSBmcm9tIHRoZVxuICAqIHNlZ21lbnQncyBzdGFydCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1dpdGhBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBhbmdsZURpc3RhbmNlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZURpc3RhbmNlKTtcbiAgICBjb25zdCBzdGFyZ0FuZ2xlID0gdGhpcy5yYXkuYW5nbGU7XG4gICAgY29uc3QgZW5kQW5nbGUgPSBzdGFyZ0FuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG5cbiAgICByZXR1cm4gbmV3IFJhYy5BcmModGhpcy5yYWMsXG4gICAgICB0aGlzLnJheS5zdGFydCwgdGhpcy5sZW5ndGgsXG4gICAgICBzdGFyZ0FuZ2xlLCBlbmRBbmdsZSxcbiAgICAgIGNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IHVuY29tbWVudCBvbmNlIGJlemllcnMgYXJlIHRlc3RlZCBhZ2FpblxuICAvLyBiZXppZXJDZW50cmFsQW5jaG9yKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gIC8vICAgbGV0IGJpc2VjdG9yID0gdGhpcy5zZWdtZW50QmlzZWN0b3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gIC8vICAgcmV0dXJuIG5ldyBSYWMuQmV6aWVyKHRoaXMucmFjLFxuICAvLyAgICAgdGhpcy5zdGFydCwgYmlzZWN0b3IuZW5kLFxuICAvLyAgICAgYmlzZWN0b3IuZW5kLCB0aGlzLmVuZCk7XG4gIC8vIH1cblxuXG59IC8vIFNlZ21lbnRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZ21lbnQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb250YWlucyB0d28gYFtDb21wb3NpdGVde0BsaW5rIFJhYy5Db21wb3NpdGV9YCBvYmplY3RzOiBgb3V0bGluZWAgYW5kXG4qIGBjb250b3VyYC5cbipcbiogVXNlZCBieSBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YCB0byBkcmF3IHRoZSBjb21wb3NpdGVzIGFzIGFcbiogY29tcGxleCBzaGFwZSAoYG91dGxpbmVgKSB3aXRoIGFuIG5lZ2F0aXZlIHNwYWNlIHNoYXBlIGluc2lkZSAoYGNvbnRvdXJgKS5cbipcbiog4pqg77iPIFRoZSBBUEkgZm9yIFNoYXBlIGlzICoqcGxhbm5lZCB0byBjaGFuZ2UqKiBpbiBhIGZ1dHVyZSBtaW5vciByZWxlYXNlLiDimqDvuI9cbipcbiogQGNsYXNzXG4qIEBhbGlhcyBSYWMuU2hhcGVcbiovXG5mdW5jdGlvbiBTaGFwZShyYWMpIHtcbiAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgdGhpcy5yYWMgPSByYWM7XG4gIHRoaXMub3V0bGluZSA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG4gIHRoaXMuY29udG91ciA9IG5ldyBSYWMuQ29tcG9zaXRlKHJhYyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFwZTtcblxuXG5TaGFwZS5wcm90b3R5cGUuYWRkT3V0bGluZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgdGhpcy5vdXRsaW5lLmFkZChlbGVtZW50KTtcbn07XG5cblNoYXBlLnByb3RvdHlwZS5hZGRDb250b3VyID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLmNvbnRvdXIuYWRkKGVsZW1lbnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERldGVybWluZXMgdGhlIGFsaWdubWVudCwgYW5nbGUsIGZvbnQsIGFuZCBzaXplIGZvciBkcmF3aW5nIGFcbiogW2BUZXh0YF17QGxpbmsgUmFjLlRleHR9IG9iamVjdC5cbipcbiogQGFsaWFzIFJhYy5UZXh0LkZvcm1hdFxuKi9cbmNsYXNzIFRleHRGb3JtYXQge1xuXG4gIC8qKlxuICAqIFN1cHBvcnRlZCB2YWx1ZXMgZm9yIFtgaEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I2hBbGlnbn0gd2hpY2hcbiAgKiBkZXJtaW5lcyB0aGUgbGVmdC10by1yaWdodCBhbGlnbm1lbnQgb2YgdGhlIGRyYXduIGBUZXh0YCBpbiByZWxhdGlvblxuICAqIHRvIGl0cyBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICpcbiAgKiBAcHJvcGVydHkge3N0cmluZ30gbGVmdFxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCB0byB0aGUgbGVmdCBlZGdlIG9mIHRoZSBkcmF3biB0ZXh0XG4gICogQHByb3BlcnR5IHtzdHJpbmd9IGNlbnRlclxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCB0byB0aGUgY2VudGVyLCBmcm9tIHNpZGUgdG9cbiAgKiBAcHJvcGVydHkge3N0cmluZ30gcmlnaHRcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgdG8gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHRcbiAgKlxuICAqIEB0eXBlIHtvYmplY3R9XG4gICogQG1lbWJlcm9mIFJhYy5UZXh0LkZvcm1hdFxuICAqL1xuICBzdGF0aWMgaG9yaXpvbnRhbEFsaWduID0ge1xuICAgIGxlZnQ6IFwibGVmdFwiLFxuICAgIGNlbnRlcjogXCJob3Jpem9udGFsQ2VudGVyXCIsXG4gICAgcmlnaHQ6IFwicmlnaHRcIlxuICB9O1xuXG4gIC8qKlxuICAqIFN1cHBvcnRlZCB2YWx1ZXMgZm9yIFtgdkFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0I3ZBbGlnbn0gd2hpY2hcbiAgKiBkZXJtaW5lcyB0aGUgdG9wLXRvLWJvdHRvbSBhbGlnbm1lbnQgb2YgdGhlIGRyYXduIGBUZXh0YCBpbiByZWxhdGlvblxuICAqIHRvIGl0cyBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0uXG4gICpcbiAgKiBAcHJvcGVydHkge3N0cmluZ30gdG9wXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIHRvIHRoZSB0b3AgZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjZW50ZXJcbiAgKiAgIGFsaWducyBgdGV4dC5wb2ludGAgdG8gdGhlIGNlbnRlciwgZnJvbSB0b3AgdG8gYm90dG9tLCBvZiB0aGUgZHJhd24gdGV4dFxuICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiYXNlbGluZVxuICAqICAgYWxpZ25zIGB0ZXh0LnBvaW50YCB0byB0aGUgYmFzZWxpbmUgb2YgdGhlIGRyYXduIHRleHRcbiAgKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tXG4gICogICBhbGlnbnMgYHRleHQucG9pbnRgIHRvIHRoZSBib3R0b20gZWRnZSBvZiB0aGUgZHJhd24gdGV4dFxuICAqXG4gICogQHR5cGUge29iamVjdH1cbiAgKiBAbWVtYmVyb2YgUmFjLlRleHQuRm9ybWF0XG4gICovXG4gIHN0YXRpYyB2ZXJ0aWNhbEFsaWduID0ge1xuICAgIHRvcDogXCJ0b3BcIixcbiAgICBjZW50ZXI6IFwidmVydGljYWxDZW50ZXJcIixcbiAgICBiYXNlbGluZTogXCJiYXNlbGluZVwiLFxuICAgIGJvdHRvbTogXCJib3R0b21cIlxuICB9O1xuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgVGV4dC5Gb3JtYXRgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhY1xuICAqICAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtzdHJpbmd9IGhBbGlnblxuICAqICAgVGhlIGhvcml6b250YWwgYWxpZ25tZW50LCBsZWZ0LXRvLXJpZ2h0OyBvbmUgb2YgdGhlIHZhbHVlcyBmcm9tXG4gICogICBbYGhvcml6b250YWxBbGlnbmBde0BsaW5rIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ259XG4gICogQHBhcmFtIHtzdHJpbmd9IHZBbGlnblxuICAqICAgVGhlIHZlcnRpY2FsIGFsaWdubWVudCwgdG9wLXRvLWJvdHRvbTsgb25lIG9mIHRoZSB2YWx1ZXMgZnJvbVxuICAqICAgW2B2ZXJ0aWNhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ259XG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IFthbmdsZT1bcmFjLkFuZ2xlLnplcm9de0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99XVxuICAqICAgVGhlIGFuZ2xlIHRvd2FyZHMgd2hpY2ggdGhlIHRleHQgaXMgZHJhd25cbiAgKiBAcGFyYW0ge3N0cmluZ30gW2ZvbnQ9bnVsbF1cbiAgKiAgIFRoZSBmb250IG5hbWVcbiAgKiBAcGFyYW0ge251bWJlcn0gW3NpemU9bnVsbF1cbiAgKiAgIFRoZSBmb250IHNpemVcbiAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcmFjLFxuICAgIGhBbGlnbixcbiAgICB2QWxpZ24sXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBmb250ID0gbnVsbCxcbiAgICBzaXplID0gbnVsbClcbiAge1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLCByYWMpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhoQWxpZ24sIHZBbGlnbik7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcbiAgICBmb250ICE9PSBudWxsICYmIHV0aWxzLmFzc2VydFN0cmluZyhmb250KTtcbiAgICBzaXplICE9PSBudWxsICYmIHV0aWxzLmFzc2VydE51bWJlcihzaXplKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQsIGxlZnQtdG8tcmlnaHQsIHRvIHBvc2l0aW9uIGEgYFRleHRgXG4gICAgKiByZWxhdGl2ZSB0byBpdHMgW2Bwb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fS5cbiAgICAqXG4gICAgKiBTdXBwb3J0ZWQgdmFsdWVzIGFyZSBhdmFpbGFibGUgdGhyb3VnaCB0aGVcbiAgICAqIFtgaG9yaXpvbnRhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbn0gb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLmhBbGlnbiA9IGhBbGlnbjtcblxuICAgIC8qKlxuICAgICogVGhlIHZlcnRpY2FsIGFsaWdubWVudCwgdG9wLXRvLWJvdHRvbSwgdG8gcG9zaXRpb24gYSBgVGV4dGAgcmVsYXRpdmVcbiAgICAqIHRvIGl0cyBbYHBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9LlxuICAgICpcbiAgICAqIFN1cHBvcnRlZCB2YWx1ZXMgYXJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZVxuICAgICogW2B2ZXJ0aWNhbEFsaWduYF17QGxpbmsgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ259IG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICovXG4gICAgdGhpcy52QWxpZ24gPSB2QWxpZ247XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSB0ZXh0IGlzIGRyYXduLlxuICAgICpcbiAgICAqIEFuIGFuZ2xlIG9mIFtgemVyb2Bde0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99IHdpbCBkcmF3IHRoZSB0ZXh0XG4gICAgKiB0b3dhcmRzIHRoZSByaWdodCBvZiB0aGUgc2NyZWVuLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG5cbiAgICAvKipcbiAgICAqIFRoZSBmb250IG5hbWUgb2YgdGhlIHRleHQgdG8gZHJhdy5cbiAgICAqXG4gICAgKiBXaGVuIHNldCB0byBgbnVsbGAgdGhlIGZvbnQgZGVmaW5lZCBpblxuICAgICogW2ByYWMudGV4dEZvcm1hdERlZmF1bHRzLmZvbnRgXXtAbGluayBSYWMjdGV4dEZvcm1hdERlZmF1bHRzfSBpc1xuICAgICogdXNlZCBpbnN0ZWFkIHVwb24gZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P3N0cmluZ31cbiAgICAqL1xuICAgIHRoaXMuZm9udCA9IGZvbnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBmb250IHNpemUgb2YgdGhlIHRleHQgdG8gZHJhdy5cbiAgICAqXG4gICAgKiBXaGVuIHNldCB0byBgbnVsbGAgdGhlIHNpemUgZGVmaW5lZCBpblxuICAgICogW2ByYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemVgXXtAbGluayBSYWMjdGV4dEZvcm1hdERlZmF1bHRzfSBpc1xuICAgICogdXNlZCBpbnN0ZWFkIHVwb24gZHJhd2luZy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gIH0gLy8gY29uc3RydWN0b3JcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogYGBgXG4gICogKG5ldyBSYWMuVGV4dC5Gb3JtYXQocmFjLCAnbGVmdCcsICd0b3AnLCAwLjUsICdzYW5zJywgMTQpKS50b1N0cmluZygpXG4gICogLy8gUmV0dXJuczogVGV4dC5Gb3JtYXQoaGE6bGVmdCB2YTp0b3AgYTowLjUgZjpcInNhbnNcIiBzOjE0KVxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgYW5nbGVTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IHNpemVTdHIgPSB0aGlzLnNpemUgPT09IG51bGxcbiAgICAgID8gJ251bGwnXG4gICAgICA6IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnNpemUsIGRpZ2l0cyk7XG4gICAgY29uc3QgZm9udFN0ciA9IHRoaXMuZm9udCA9PT0gbnVsbFxuICAgICAgPyAnbnVsbCdcbiAgICAgIDogYFwiJHt0aGlzLmZvbnR9XCJgO1xuICAgIHJldHVybiBgVGV4dC5Gb3JtYXQoaGE6JHt0aGlzLmhBbGlnbn0gdmE6JHt0aGlzLnZBbGlnbn0gYToke2FuZ2xlU3RyfSBmOiR7Zm9udFN0cn0gczoke3NpemVTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMsIGV4Y2VwdCBgcmFjYCwgb2YgYm90aCBmb3JtYXRzIGFyZVxuICAqIGVxdWFsLCBvdGhlcndpc2UgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogV2hlbiBgb3RoZXJGb3JtYXRgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuVGV4dC5Gb3JtYXRgLCByZXR1cm5zXG4gICogYGZhbHNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBvdGhlckZvcm1hdCAtIEEgYFRleHQuRm9ybWF0YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckZvcm1hdCkge1xuICAgIHJldHVybiBvdGhlckZvcm1hdCBpbnN0YW5jZW9mIFRleHRGb3JtYXRcbiAgICAgICYmIHRoaXMuaEFsaWduID09PSBvdGhlckZvcm1hdC5oQWxpZ25cbiAgICAgICYmIHRoaXMudkFsaWduID09PSBvdGhlckZvcm1hdC52QWxpZ25cbiAgICAgICYmIHRoaXMuYW5nbGUuZXF1YWxzKG90aGVyRm9ybWF0LmFuZ2xlKVxuICAgICAgJiYgdGhpcy5mb250ID09PSBvdGhlckZvcm1hdC5mb250XG4gICAgICAmJiB0aGlzLnNpemUgPT09IG90aGVyRm9ybWF0LnNpemU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHQuRm9ybWF0YCB3aXRoIGBhbmdsZWAgc2V0IHRvIHRoZSBgQW5nbGVgIGRlcml2ZWRcbiAgKiBmcm9tIGBuZXdBbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdBbmdsZSAtIFRoZSBhbmdsZSBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaEFsaWduLCB0aGlzLnZBbGlnbixcbiAgICAgIG5ld0FuZ2xlLFxuICAgICAgdGhpcy5mb250LFxuICAgICAgdGhpcy5zaXplKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggYGZvbnRgIHNldCB0byBgbmV3Rm9udGAuXG4gICogQHBhcmFtIHs/c3RyaW5nfSBuZXdGb250IC0gVGhlIGZvbnQgbmFtZSBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgO1xuICAqICAgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aEZvbnQobmV3Rm9udCkge1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaEFsaWduLCB0aGlzLnZBbGlnbixcbiAgICAgIHRoaXMuYW5nbGUsXG4gICAgICBuZXdGb250LFxuICAgICAgdGhpcy5zaXplKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHdpdGggYHNpemVgIHNldCB0byBgbmV3U2l6ZWAuXG4gICogQHBhcmFtIHs/bnVtYmVyfSBuZXdTaXplIC0gVGhlIGZvbnQgc2l6ZSBmb3IgdGhlIG5ldyBgVGV4dC5Gb3JtYXRgO1xuICAqICAgY2FuIGJlIHNldCB0byBgbnVsbGAuXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgd2l0aFNpemUobmV3U2l6ZSkge1xuICAgIHJldHVybiBuZXcgVGV4dEZvcm1hdCh0aGlzLnJhYyxcbiAgICAgIHRoaXMuaEFsaWduLCB0aGlzLnZBbGlnbixcbiAgICAgIHRoaXMuYW5nbGUsXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICBuZXdTaXplKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgVGV4dC5Gb3JtYXRgIHRoYXQgd2lsbCBkcmF3IGEgdGV4dCByZXZlcnNlZCwgdXBzaWRlLWRvd24sXG4gICogaW4gZ2VuZXJhbGx5IHRoZSBzYW1lIHBvc2l0aW9uIGFzIGB0aGlzYCB3b3VsZCBkcmF3IHRoZSBzYW1lIHRleHQuXG4gICogQHJldHVybnMge1JhYy5UZXh0LkZvcm1hdH1cbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBsZXQgaEVudW0gPSBUZXh0Rm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgICBsZXQgdkVudW0gPSBUZXh0Rm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gICAgbGV0IGhBbGlnbiwgdkFsaWduO1xuICAgIHN3aXRjaCAodGhpcy5oQWxpZ24pIHtcbiAgICAgIGNhc2UgaEVudW0ubGVmdDogIGhBbGlnbiA9IGhFbnVtLnJpZ2h0OyBicmVhaztcbiAgICAgIGNhc2UgaEVudW0ucmlnaHQ6IGhBbGlnbiA9IGhFbnVtLmxlZnQ7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogICAgICAgICAgaEFsaWduID0gdGhpcy5oQWxpZ247IGJyZWFrO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMudkFsaWduKSB7XG4gICAgICBjYXNlIHZFbnVtLnRvcDogICAgdkFsaWduID0gdkVudW0uYm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgdkVudW0uYm90dG9tOiB2QWxpZ24gPSB2RW51bS50b3A7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogICAgICAgICAgIHZBbGlnbiA9IHRoaXMudkFsaWduOyBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIGhBbGlnbiwgdkFsaWduLFxuICAgICAgdGhpcy5hbmdsZS5pbnZlcnNlKCksXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICB0aGlzLnNpemUpXG4gIH1cblxufSAvLyBjbGFzcyBUZXh0Rm9ybWF0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0Rm9ybWF0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5jb25zdCBUZXh0Rm9ybWF0ID0gcmVxdWlyZSgnLi9UZXh0LkZvcm1hdCcpXG5cbi8vIE5vdCB1c2VkLCBTZWVtcyBsaWtlIHVnbGlmeSBtaW5pZmljYXRpb24gbmVlZHMgYSByZWZlcmVuY2UgaGVyZTtcbi8vIG90aGVyd2lzZSBUZXh0Rm9ybWF0IGlzIG5vdCBjb3JyZWN0bHkgcmVxdWlyZWQuXG52YXIgbWluaWZ5SGVscGVyID0gVGV4dEZvcm1hdFxuXG4vKipcbiogU3RyaW5nLCBwb3NpdGlvbiBhbmQgW2Zvcm1hdF17QGxpbmsgUmFjLlRleHQuRm9ybWF0fSB0byBkcmF3IGEgdGV4dC5cbipcbiogQW4gaW5zdGFuY2Ugb2YgdGhpcyBvYmplY3QgY29udGFpbnMgdGhlIHN0cmluZyBhbmQgYSBgUG9pbnRgIHVzZWQgdG9cbiogZGV0ZXJtaW5lIHRoZSBsb2NhdGlvbiBvZiB0aGUgZHJhd24gdGV4dC4gVGhlXG4qIFtgVGV4dC5Gb3JtYXRgXXtAbGluayBSYWMuVGV4dC5Gb3JtYXR9IG9iamVjdCBkZXRlcm1pbmVzIHRoZSBmb250LCBzaXplLFxuKiBvcmllbnRhdGlvbiBhbmdsZSwgYW5kIHRoZSBhbGlnbm1lbnQgcmVsYXRpdmUgdG8gYHBvaW50YCB0byBkcmF3IHRoZSB0ZXh0LlxuKlxuKiBAYWxpYXMgUmFjLlRleHRcbiovXG5jbGFzcyBUZXh0IHtcblxuICBzdGF0aWMgRm9ybWF0ID0gVGV4dEZvcm1hdDtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBUZXh0YCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWNcbiAgKiAgIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludFxuICAqICAgVGhlIGxvY2F0aW9uIGZvciB0aGUgZHJhd24gdGV4dFxuICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAgKiAgIFRoZSBzdHJpbmcgdG8gZHJhd1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKiAgIFRoZSBmb3JtYXQgZm9yIHRoZSBkcmF3biB0ZXh0XG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgcG9pbnQsIHN0cmluZywgZm9ybWF0KSB7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMsIHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuUG9pbnQsIHBvaW50KTtcbiAgICB1dGlscy5hc3NlcnRTdHJpbmcoc3RyaW5nKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFRleHQuRm9ybWF0LCBmb3JtYXQpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgdGV4dCB3aWxsIGJlIGRyYXduLlxuICAgICpcbiAgICAqIFRoZSB0ZXh0IHdpbGwgYmUgZHJhd24gcmVsYXRpdmUgdG8gdGhpcyBwb2ludCBiYXNlZCBvbiB0aGVcbiAgICAqIGFsaWdubWVudCBhbmQgYW5nbGUgY29uZmlndXJhdGlvbiBvZlxuICAgICogW2Bmb3JtYXRgXXtAbGluayBSYWMuVGV4dCNmb3JtYXR9LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBzdHJpbmcgdG8gZHJhdy5cbiAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgKi9cbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcblxuICAgIC8qKlxuICAgICogVGhlIGFsaWdubWVudCwgYW5nbGUsIGZvbnQsIGFuZCBzaXplIHRvIHVzZSB0byBkcmF3IHRoZSB0ZXh0LlxuICAgICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgICAqL1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5wb2ludC54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5wb2ludC55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgVGV4dCgoJHt4U3RyfSwke3lTdHJ9KSBcIiR7dGhpcy5zdHJpbmd9XCIpYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgYHN0cmluZ2AgYW5kIGBwb2ludGAgb2YgYm90aCB0ZXh0cyBhcmUgZXF1YWw7XG4gICogb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIFdoZW4gYG90aGVyVGV4dGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5UZXh0YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogYHBvaW50YHMgYXJlIGNvbXBhcmVkIHVzaW5nIFtgcG9pbnQuZXF1YWxzYF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30uXG4gICpcbiAgKiBUaGUgYGZvcm1hdGAgb2JqZWN0cyBhcmUgaWdub3JlZCBpbiB0aGlzIGNvbXBhcmlzb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5UZXh0fSBvdGhlclRleHQgLSBBIGBUZXh0YCB0byBjb21wYXJlXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclRleHQpIHtcbiAgICByZXR1cm4gb3RoZXJUZXh0IGluc3RhbmNlb2YgVGV4dFxuICAgICAgJiYgdGhpcy5zdHJpbmcgPT09IG90aGVyVGV4dC5zdHJpbmdcbiAgICAgICYmIHRoaXMucG9pbnQuZXF1YWxzKG90aGVyVGV4dC5wb2ludCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFRleHRgIGFuZCBgRm9ybWF0YCB3aXRoIGBmb3JtYXQuYW5nbGVgIHNldCB0byB0aGVcbiAgKiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgbmV3QW5nbGVgLlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFRleHRgIGFuZFxuICAqICAgYFRleHQuRm9ybWF0YFxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgY29uc3QgbmV3Rm9ybWF0ID0gdGhpcy5mb3JtYXQud2l0aEFuZ2xlKG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCBuZXdGb3JtYXQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgd2l0aCBgZm9ybWF0LmZvbnRgIHNldCB0byBgbmV3Rm9udGAuXG4gICogQHBhcmFtIHs/c3RyaW5nfSBuZXdGb250IC0gVGhlIGZvbnQgbmFtZSBmb3IgdGhlIG5ldyBgVGV4dGAgYW5kXG4gICogICBgVGV4dC5Gb3JtYXRgOyBjYW4gYmUgc2V0IHRvIGBudWxsYC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHdpdGhGb250KG5ld0ZvbnQpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoRm9udChuZXdGb250KTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCBuZXdGb3JtYXQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBhbmQgYEZvcm1hdGAgd2l0aCBgZm9ybWF0LnNpemVgIHNldCB0byBgbmV3U2l6ZWAuXG4gICogQHBhcmFtIHs/bnVtYmVyfSBuZXdTaXplIC0gVGhlIGZvbnQgc2l6ZSBmb3IgdGhlIG5ldyBgVGV4dGAgYW5kXG4gICogICBgVGV4dC5Gb3JtYXRgOyBjYW4gYmUgc2V0IHRvIGBudWxsYC5cbiAgKiBAcmV0dXJucyB7UmFjLlRleHR9XG4gICovXG4gIHdpdGhTaXplKG5ld1NpemUpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoU2l6ZShuZXdTaXplKTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCBuZXdGb3JtYXQpO1xuICB9XG5cblxufSAvLyBjbGFzcyBUZXh0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBbYGluc3RhbmNlLkFuZ2xlYCBmdW5jdGlvbl17QGxpbmsgUmFjI0FuZ2xlfSBjb250YWlucyBjb252ZW5pZW5jZVxuKiBtZXRob2RzIGFuZCBtZW1iZXJzIGZvciBge0BsaW5rIFJhYy5BbmdsZX1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nXG4qIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkFuZ2xlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBbmdsZShyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBzb21ldGhpbmdgLlxuICAqXG4gICogQ2FsbHNge0BsaW5rIFJhYy5BbmdsZS5mcm9tfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbVxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ8UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhbiBgQW5nbGVgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tID0gZnVuY3Rpb24oc29tZXRoaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tKHJhYywgc29tZXRoaW5nKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHJhZGlhbnNgLlxuICAqXG4gICogQ2FsbHMgYHtAbGluayBSYWMuQW5nbGUuZnJvbVJhZGlhbnN9YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tUmFkaWFuc1xuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIHJhZGlhbnNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqXG4gICogQGZ1bmN0aW9uIGZyb21SYWRpYW5zXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZnJvbVJhZGlhbnMgPSBmdW5jdGlvbihyYWRpYW5zKSB7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyhyYWMsIHJhZGlhbnMpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgZGVncmVlc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tRGVncmVlc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21EZWdyZWVzXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGVncmVlcyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gZGVncmVlc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbURlZ3JlZXNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tRGVncmVlcyA9IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21EZWdyZWVzKHJhYywgZGVncmVlcyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgcmlnaHRgLCBgcmAsIGBlYXN0YCwgYGVgLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuemVybyA9IHJhYy5BbmdsZSgwLjApO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzJgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYGxlZnRgLCBgbGAsIGB3ZXN0YCwgYHdgLCBgaW52ZXJzZWAuXG4gICpcbiAgKiBAbmFtZSBoYWxmXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5oYWxmID0gcmFjLkFuZ2xlKDEvMik7XG4gIHJhYy5BbmdsZS5pbnZlcnNlID0gcmFjLkFuZ2xlLmhhbGY7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvNGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgZG93bmAsIGBkYCwgYGJvdHRvbWAsIGBiYCwgYHNvdXRoYCwgYHNgLCBgc3F1YXJlYC5cbiAgKlxuICAqIEBuYW1lIHF1YXJ0ZXJcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnF1YXJ0ZXIgPSByYWMuQW5nbGUoMS80KTtcbiAgcmFjLkFuZ2xlLnNxdWFyZSA9ICByYWMuQW5nbGUucXVhcnRlcjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS84YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGBib3R0b21SaWdodGAsIGBicmAsIGBzZWAuXG4gICpcbiAgKiBAbmFtZSBlaWdodGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmVpZ2h0aCA9ICByYWMuQW5nbGUoMS84KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgNy84YCwgbmVnYXRpdmUgYW5nbGUgb2ZcbiAgKiBbYGVpZ2h0aGBde0BsaW5rIGluc3RhbmNlLkFuZ2xlI2VpZ2h0aH0uXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgdG9wUmlnaHRgLCBgdHJgLCBgbmVgLlxuICAqXG4gICogQG5hbWUgbmVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubmVpZ2h0aCA9ICByYWMuQW5nbGUoLTEvOCk7XG5cblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS8xNmAuXG4gICpcbiAgKiBAbmFtZSBzaXh0ZWVudGhcbiAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLnNpeHRlZW50aCA9IHJhYy5BbmdsZSgxLzE2KTtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMy80YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGB1cGAsIGB1YCwgYHRvcGAsIGB0YC5cbiAgKlxuICAqIEBuYW1lIG5vcnRoXG4gICogQHR5cGUge1JhYy5BbmdsZX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5ub3J0aCA9IHJhYy5BbmdsZSgzLzQpO1xuICByYWMuQW5nbGUuZWFzdCAgPSByYWMuQW5nbGUoMC80KTtcbiAgcmFjLkFuZ2xlLnNvdXRoID0gcmFjLkFuZ2xlKDEvNCk7XG4gIHJhYy5BbmdsZS53ZXN0ICA9IHJhYy5BbmdsZSgyLzQpO1xuXG4gIHJhYy5BbmdsZS5lID0gcmFjLkFuZ2xlLmVhc3Q7XG4gIHJhYy5BbmdsZS5zID0gcmFjLkFuZ2xlLnNvdXRoO1xuICByYWMuQW5nbGUudyA9IHJhYy5BbmdsZS53ZXN0O1xuICByYWMuQW5nbGUubiA9IHJhYy5BbmdsZS5ub3J0aDtcblxuICByYWMuQW5nbGUubmUgPSByYWMuQW5nbGUubi5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLnNlID0gcmFjLkFuZ2xlLmUuYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zdyA9IHJhYy5BbmdsZS5zLmFkZCgxLzgpO1xuICByYWMuQW5nbGUubncgPSByYWMuQW5nbGUudy5hZGQoMS84KTtcblxuICAvLyBOb3J0aCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5ubmUgPSByYWMuQW5nbGUubmUuYWRkKC0xLzE2KTtcbiAgLy8gRWFzdCBub3J0aC1lYXN0XG4gIHJhYy5BbmdsZS5lbmUgPSByYWMuQW5nbGUubmUuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydGgtZWFzdCBub3J0aFxuICByYWMuQW5nbGUubmVuID0gcmFjLkFuZ2xlLm5uZTtcbiAgLy8gTm9ydGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5uZWUgPSByYWMuQW5nbGUuZW5lO1xuXG4gIC8vIEVhc3Qgc291dGgtZWFzdFxuICByYWMuQW5nbGUuZXNlID0gcmFjLkFuZ2xlLnNlLmFkZCgtMS8xNik7XG4gIC8vIFNvdXRoIHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLnNzZSA9IHJhYy5BbmdsZS5zZS5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC1lYXN0IGVhc3RcbiAgcmFjLkFuZ2xlLnNlZSA9IHJhYy5BbmdsZS5lc2U7XG4gIC8vIFNvdXRoLWVhc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnNlcyA9IHJhYy5BbmdsZS5zc2U7XG5cbiAgLy8gU291dGggc291dGgtd2VzdFxuICByYWMuQW5nbGUuc3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgtMS8xNik7XG4gIC8vIFdlc3Qgc291dGgtd2VzdFxuICByYWMuQW5nbGUud3N3ID0gcmFjLkFuZ2xlLnN3LmFkZCgrMS8xNik7XG4gIC8vIFNvdXRoLXdlc3Qgc291dGhcbiAgcmFjLkFuZ2xlLnN3cyA9IHJhYy5BbmdsZS5zc3c7XG4gIC8vIFNvdXRoLXdlc3Qgd2VzdFxuICByYWMuQW5nbGUuc3d3ID0gcmFjLkFuZ2xlLndzdztcblxuICAvLyBXZXN0IG5vcnRoLXdlc3RcbiAgcmFjLkFuZ2xlLndudyA9IHJhYy5BbmdsZS5udy5hZGQoLTEvMTYpO1xuICAvLyBOb3J0aCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS5ubncgPSByYWMuQW5nbGUubncuYWRkKCsxLzE2KTtcbiAgLy8gTm9ydC1od2VzdCB3ZXN0XG4gIHJhYy5BbmdsZS5ud3cgPSByYWMuQW5nbGUud253O1xuICAvLyBOb3J0aC13ZXN0IG5vcnRoXG4gIHJhYy5BbmdsZS5ud24gPSByYWMuQW5nbGUubm53O1xuXG4gIHJhYy5BbmdsZS5yaWdodCA9IHJhYy5BbmdsZS5lO1xuICByYWMuQW5nbGUuZG93biAgPSByYWMuQW5nbGUucztcbiAgcmFjLkFuZ2xlLmxlZnQgID0gcmFjLkFuZ2xlLnc7XG4gIHJhYy5BbmdsZS51cCAgICA9IHJhYy5BbmdsZS5uO1xuXG4gIHJhYy5BbmdsZS5yID0gcmFjLkFuZ2xlLnJpZ2h0O1xuICByYWMuQW5nbGUuZCA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUubCA9IHJhYy5BbmdsZS5sZWZ0O1xuICByYWMuQW5nbGUudSA9IHJhYy5BbmdsZS51cDtcblxuICByYWMuQW5nbGUudG9wICAgID0gcmFjLkFuZ2xlLnVwO1xuICByYWMuQW5nbGUuYm90dG9tID0gcmFjLkFuZ2xlLmRvd247XG4gIHJhYy5BbmdsZS50ICAgICAgPSByYWMuQW5nbGUudG9wO1xuICByYWMuQW5nbGUuYiAgICAgID0gcmFjLkFuZ2xlLmJvdHRvbTtcblxuICByYWMuQW5nbGUudG9wUmlnaHQgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50ciAgICAgICAgICA9IHJhYy5BbmdsZS5uZTtcbiAgcmFjLkFuZ2xlLnRvcExlZnQgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUudGwgICAgICAgICAgPSByYWMuQW5nbGUubnc7XG4gIHJhYy5BbmdsZS5ib3R0b21SaWdodCA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJyICAgICAgICAgID0gcmFjLkFuZ2xlLnNlO1xuICByYWMuQW5nbGUuYm90dG9tTGVmdCAgPSByYWMuQW5nbGUuc3c7XG4gIHJhYy5BbmdsZS5ibCAgICAgICAgICA9IHJhYy5BbmdsZS5zdztcblxufSAvLyBhdHRhY2hSYWNBbmdsZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQXJjYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5BcmN9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5BcmNcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FyYyhyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGNsb2Nrd2lzZSBgQXJjYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5BcmN9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFyYyNcbiAgKi9cbiAgcmFjLkFyYy56ZXJvID0gcmFjLkFyYygwLCAwLCAwLCAwLCAwLCB0cnVlKTtcblxufSAvLyBhdHRhY2hSYWNBcmNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkJlemllcmAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQmV6aWVyfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQmV6aWVyXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hJbnN0YW5jZUJlemllcihyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBCZXppZXJgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLkJlemllcn1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQmV6aWVyI1xuICAqL1xuICByYWMuQmV6aWVyLnplcm8gPSByYWMuQmV6aWVyKFxuICAgIDAsIDAsIDAsIDAsXG4gICAgMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoSW5zdGFuY2VCZXppZXJcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgW2BpbnN0YW5jZS5Qb2ludGAgZnVuY3Rpb25de0BsaW5rIFJhYyNQb2ludH0gY29udGFpbnMgY29udmVuaWVuY2VcbiogbWV0aG9kcyBhbmQgbWVtYmVycyBmb3IgYHtAbGluayBSYWMuUG9pbnR9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZ1xuKiBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Qb2ludFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lnplcm8gPSByYWMuUG9pbnQoMCwgMCk7XG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIGF0IGAoMCwgMClgLlxuICAqXG4gICogRXF1YWwgdG8gYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSBvcmlnaW5cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lm9yaWdpbiA9IHJhYy5Qb2ludC56ZXJvO1xuXG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlJheWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUmF5fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUmF5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNSYXkocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUmF5YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gIGFuZCBwb2ludHMgdG9cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99YC5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnQjemVyb1xuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjemVyb1xuICAqL1xuICByYWMuUmF5Lnplcm8gPSByYWMuUmF5KDAsIDAsIHJhYy5BbmdsZS56ZXJvKTtcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeC1heGlzLCBzdGFydHMgYXQgYHtAbGluayBpbnN0YW5jZS5Qb2ludCNvcmlnaW59YCBhbmRcbiAgKiBwb2ludHMgdG8gYHtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfWAuXG4gICpcbiAgKiBFcXVhbCB0byBge0BsaW5rIGluc3RhbmNlLlJheSN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSB4QXhpc1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICogQHNlZSBpbnN0YW5jZS5Qb2ludCNvcmlnaW5cbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlI3plcm9cbiAgKi9cbiAgcmFjLlJheS54QXhpcyA9IHJhYy5SYXkuemVybztcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeS1heGlzLCBzdGFydHMgYXRge0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn1gIGFuZFxuICAqIHBvaW50cyB0byBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9YC5cbiAgKlxuICAqIEBuYW1lIHlBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKiBAc2VlIGluc3RhbmNlLlBvaW50I29yaWdpblxuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjcXVhcnRlclxuICAqL1xuICByYWMuUmF5LnlBeGlzID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUucXVhcnRlcik7XG5cbn0gLy8gYXR0YWNoUmFjUmF5XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5TZWdtZW50YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5TZWdtZW50fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU2VnbWVudFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU2VnbWVudChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBTZWdtZW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sICwgc3RhcnRzIGF0XG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAsIHBvaW50cyB0b1xuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31gLCBhbmQgaGFzIGEgbGVuZ3RoIG9mIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC56ZXJvID0gcmFjLlNlZ21lbnQoMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoUmFjU2VnbWVudFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBbYGluc3RhbmNlLlRleHRgIGZ1bmN0aW9uXXtAbGluayBSYWMjVGV4dH0gY29udGFpbnMgY29udmVuaWVuY2VcbiogbWV0aG9kcyBhbmQgbWVtYmVycyBmb3IgYHtAbGluayBSYWMuVGV4dH1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nXG4qIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICAvKipcbiAgKiBUaGUgW2BpbnN0YW5jZS5UZXh0LkZvcm1hdGAgZnVuY3Rpb25de0BsaW5rIGluc3RhbmNlLlRleHQjRm9ybWF0fVxuICAqIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnMgZm9yIGB7QGxpbmsgUmFjLlRleHQuRm9ybWF0fWBcbiAgKiBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBuYW1lc3BhY2UgaW5zdGFuY2UuVGV4dC5Gb3JtYXRcbiAgKi9cblxuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IGF0IHRoZVxuICAqIHRvcC1sZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHQuXG4gICogQG5hbWUgdG9wTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24udG9wKTtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSBhdCB0aGVcbiAgKiB0b3AtcmlnaHQgZWRnZSBvZiB0aGUgZHJhd24gdGV4dC5cbiAgKiBAbmFtZSB0b3BSaWdodFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQudG9wUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3ApO1xuXG4gIC8qKlxuICAqIEEgYFRleHQuRm9ybWF0YCB0byBhbGlnbiB0aGUgW2B0ZXh0LnBvaW50YF17QGxpbmsgUmFjLlRleHQjcG9pbnR9IGF0IHRoZVxuICAqIGNlbnRlci1sZWZ0IGVkZ2Ugb2YgdGhlIGRyYXduIHRleHQuXG4gICogQG5hbWUgY2VudGVyTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gcG9zaXRpb24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSBhdCB0aGVcbiAgKiBjZW50ZXIgb2YgdGhlIGRyYXduIHRleHQuXG4gICpcbiAgKiBBbHNvIGF2YWlsYWJsZSBhczogYGNlbnRlcmVkYC5cbiAgKlxuICAqIEBuYW1lIGNlbnRlckNlbnRlclxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyQ2VudGVyID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24uY2VudGVyLFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcik7XG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJlZCA9IHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJDZW50ZXI7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gYXQgdGhlXG4gICogY2VudGVyLXJpZ2h0IG9mIHRoZSBkcmF3biB0ZXh0LlxuICAqIEBuYW1lIGNlbnRlclJpZ2h0XG4gICogQHR5cGUge1JhYy5UZXh0LkZvcm1hdH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dC5Gb3JtYXQjXG4gICovXG4gIHJhYy5UZXh0LkZvcm1hdC5jZW50ZXJSaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmNlbnRlcik7XG5cbiAgLyoqXG4gICogQSBgVGV4dC5Gb3JtYXRgIHRvIGFsaWduIHRoZSBbYHRleHQucG9pbnRgXXtAbGluayBSYWMuVGV4dCNwb2ludH0gYXQgdGhlXG4gICogYm90dG9tLWxlZnQgb2YgdGhlIGRyYXduIHRleHQuXG4gICogQG5hbWUgYm90dG9tTGVmdFxuICAqIEB0eXBlIHtSYWMuVGV4dC5Gb3JtYXR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlRleHQuRm9ybWF0I1xuICAqL1xuICByYWMuVGV4dC5Gb3JtYXQuYm90dG9tTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tKTtcblxuICAvKipcbiAgKiBBIGBUZXh0LkZvcm1hdGAgdG8gYWxpZ24gdGhlIFtgdGV4dC5wb2ludGBde0BsaW5rIFJhYy5UZXh0I3BvaW50fSBhdCB0aGVcbiAgKiBib3R0b20tcmlnaHQgb2YgdGhlIGRyYXduIHRleHQuXG4gICogQG5hbWUgYm90dG9tUmlnaHRcbiAgKiBAdHlwZSB7UmFjLlRleHQuRm9ybWF0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0LkZvcm1hdCNcbiAgKi9cbiAgcmFjLlRleHQuRm9ybWF0LmJvdHRvbVJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tKTtcblxuXG4gIC8qKlxuICAqIEEgYFRleHRgIGZvciBkcmF3aW5nIGBoZWxsbyB3b3JsZGAgd2l0aCBgdG9wTGVmdGAgZm9ybWF0IGF0XG4gICogYFBvaW50Lnplcm9gLlxuICAqIEBuYW1lIGhlbGxvXG4gICogQHR5cGUge1JhYy5UZXh0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5oZWxsbyA9IHJhYy5UZXh0KDAsIDAsICdoZWxsbyB3b3JsZCEnKTtcblxuICAvKipcbiAgKiBBIGBUZXh0YCBmb3IgZHJhd2luZyB0aGUgcGFuZ3JhbSBgc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93YFxuICAqIHdpdGggYHRvcExlZnRgIGZvcm1hdCBhdCBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgc3BoaW54XG4gICogQHR5cGUge1JhYy5UZXh0fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5zcGhpbnggPSByYWMuVGV4dCgwLCAwLCAnc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93Jyk7XG5cbn0gLy8gYXR0YWNoUmFjVGV4dFxuXG4iLCJcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci90ZW1wbGF0ZXMvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW1kanMvYW1kanMtYXBpL2Jsb2IvbWFzdGVyL0FNRC5tZFxuICAgIC8vIGh0dHBzOi8vcmVxdWlyZWpzLm9yZy9kb2NzL3doeWFtZC5odG1sXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBBTUQgLSBkZWZpbmU6JHt0eXBlb2YgZGVmaW5lfWApO1xuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuXG4gICAgLy8gY29uc29sZS5sb2coYExvYWRpbmcgUkFDIGZvciBOb2RlIC0gbW9kdWxlOiR7dHlwZW9mIG1vZHVsZX1gKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuXG4gIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBpbnRvIHNlbGYgLSByb290OiR7dHlwZW9mIHJvb3R9YCk7XG4gIHJvb3QuUmFjID0gZmFjdG9yeSgpO1xuXG59KHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vUmFjJyk7XG5cbn0pKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIERyYXdlciB0aGF0IHVzZXMgYSBbUDVdKGh0dHBzOi8vcDVqcy5vcmcvKSBpbnN0YW5jZSBmb3IgYWxsIGRyYXdpbmdcbiogb3BlcmF0aW9ucy5cbipcbiogQGFsaWFzIFJhYy5QNURyYXdlclxuKi9cbmNsYXNzIFA1RHJhd2VyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHA1KXtcbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnA1ID0gcDU7XG4gICAgdGhpcy5kcmF3Um91dGluZXMgPSBbXTtcbiAgICB0aGlzLmRlYnVnUm91dGluZXMgPSBbXTtcbiAgICB0aGlzLmFwcGx5Um91dGluZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdXNlZCBmb3IgZGVidWcgZHJhd2luZywgd2hlbiBgbnVsbGAgdGhlIHN0eWxlIGFscmVhZHkgYXBwbGllZFxuICAgICogaXMgdXNlZC5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1N0eWxlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU3R5bGUgdXNlZCBmb3IgdGV4dCBmb3IgZGVidWcgZHJhd2luZywgd2hlbiBgbnVsbGAgdGhlIHN0eWxlIGFscmVhZHlcbiAgICAqIGFwcGxpZWQgaXMgdXNlZC5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1RleHRTdHlsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIFNldHRpbmdzIHVzZWQgYnkgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgYGRyYXdhYmxlLmRlYnVnKClgLlxuICAgICpcbiAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBmb250PSdtb25vc3BhY2UnXG4gICAgKiAgIEZvbnQgdG8gdXNlIHdoZW4gZHJhd2luZyB3aXRoIGBkZWJ1ZygpYFxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFtmb250PVtyYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemVde0BsaW5rIFJhYyN0ZXh0Rm9ybWF0RGVmYXVsdHN9XVxuICAgICogICBGb250IHNpemUgdG8gdXNlIHdoZW4gZHJhd2luZyB3aXRoIGBkZWJ1ZygpYFxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGZpeGVkRGlnaXRzPTJcbiAgICAqICAgTnVtYmVyIG9mIGRlY2ltYWwgZGlnaXRzIHRvIHByaW50IHdoZW4gZHJhd2luZyB3aXRoIGBkZWJ1ZygpYFxuICAgICpcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmRlYnVnVGV4dE9wdGlvbnMgPSB7XG4gICAgICBmb250OiAnbW9ub3NwYWNlJyxcbiAgICAgIHNpemU6IHJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZSxcbiAgICAgIGZpeGVkRGlnaXRzOiAyXG4gICAgfTtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHBvaW50IG1hcmtlcnMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1BvaW50UmFkaXVzID0gNDtcblxuICAgIC8qKlxuICAgICogUmFkaXVzIG9mIHRoZSBtYWluIHZpc3VhbCBlbGVtZW50cyBmb3IgZGVidWcgZHJhd2luZy5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmRlYnVnTWFya2VyUmFkaXVzID0gMjI7XG5cbiAgICAvKipcbiAgICAqIEZhY3RvciBhcHBsaWVkIHRvIHN0cm9rZSB3ZWlnaHQgc2V0dGluZy4gU3Ryb2tlIHdlaWdodCBpcyBzZXQgdG9cbiAgICAqIGBzdHJva2Uud2VpZ2h0ICogc3Ryb2tlV2VpZ2h0RmFjdG9yYCB3aGVuIGFwcGxpY2FibGUuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqIEBkZWZhdWx0IDFcbiAgICAqL1xuICAgIHRoaXMuc3Ryb2tlV2VpZ2h0RmFjdG9yID0gMTtcblxuICAgIHRoaXMuc2V0dXBBbGxEcmF3RnVuY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEFsbERlYnVnRnVuY3Rpb25zKCk7XG4gICAgdGhpcy5zZXR1cEFsbEFwcGx5RnVuY3Rpb25zKCk7XG4gICAgLy8gVE9ETzogYWRkIGEgY3VzdG9taXplZCBmdW5jdGlvbiBmb3IgbmV3IGNsYXNzZXMhXG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgdGhlIGdpdmVuIGBkcmF3RnVuY3Rpb25gIHRvIHBlcmZvcm0gdGhlIGRyYXdpbmcgZm9yIGluc3RhbmNlcyBvZlxuICAqIGNsYXNzIGBkcmF3YWJsZUNsYXNzYC5cbiAgKlxuICAqIGBkcmF3RnVuY3Rpb25gIGlzIGV4cGVjdGVkIHRvIGhhdmUgdGhlIHNpZ25hdHVyZTpcbiAgKiBgYGBcbiAgKiBkcmF3RnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzKVxuICAqIGBgYFxuICAqICsgYGRyYXdlcjogUDVEcmF3ZXJgIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nXG4gICogKyBgb2JqZWN0T2ZDbGFzczogZHJhd2FibGVDbGFzc2AgLSBJbnN0YW5jZSBvZiBgZHJhd2FibGVDbGFzc2AgdG8gZHJhd1xuICAqXG4gICogQHBhcmFtIHtjbGFzc30gZHJhd2FibGVDbGFzcyAtIENsYXNzIG9mIHRoZSBpbnN0YW5jZXMgdG8gZHJhd1xuICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRyYXdGdW5jdGlvbiAtIEZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgZHJhd2luZ1xuICAqL1xuICBzZXREcmF3RnVuY3Rpb24oZHJhd2FibGVDbGFzcywgZHJhd0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBkcmF3YWJsZUNsYXNzKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgRHJhd1JvdXRpbmUoZHJhd2FibGVDbGFzcywgZHJhd0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZHJhd1JvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3Um91dGluZXMucHVzaChyb3V0aW5lKTtcbiAgfVxuXG5cbiAgc2V0RHJhd09wdGlvbnMoY2xhc3NPYmosIG9wdGlvbnMpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IGZpbmQgcm91dGluZSBmb3IgY2xhc3MgLSBjbGFzc05hbWU6JHtjbGFzc09iai5uYW1lfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJvdXRpbmUucmVxdWlyZXNQdXNoUG9wID0gb3B0aW9ucy5yZXF1aXJlc1B1c2hQb3A7XG4gICAgfVxuICB9XG5cblxuICBzZXRDbGFzc0RyYXdTdHlsZShjbGFzc09iaiwgc3R5bGUpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IGZpbmQgcm91dGluZSBmb3IgY2xhc3MgLSBjbGFzc05hbWU6JHtjbGFzc09iai5uYW1lfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gICAgfVxuXG4gICAgcm91dGluZS5zdHlsZSA9IHN0eWxlO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIHRoZSBnaXZlbiBgZGVidWdGdW5jdGlvbmAgdG8gcGVyZm9ybSB0aGUgZGVidWctZHJhd2luZyBmb3JcbiAgKiBpbnN0YW5jZXMgb2YgY2xhc3MgYGRyYXdhYmxlQ2xhc3NgLlxuICAqXG4gICogV2hlbiBhIGRyYXdhYmxlIGNsYXNzIGRvZXMgbm90IGhhdmUgYSBgZGVidWdGdW5jdGlvbmAgc2V0dXAsIGNhbGxpbmdcbiAgKiBgZHJhd2FibGUuZGVidWcoKWAgc2ltcGx5IGNhbGxzIGBkcmF3KClgIHdpdGhcbiAgKiBgW2RlYnVnU3R5bGVde0BsaW5rIFJhYy5QNURyYXdlciNkZWJ1Z1N0eWxlfWAgYXBwbGllZC5cbiAgKlxuICAqIGBkZWJ1Z0Z1bmN0aW9uYCBpcyBleHBlY3RlZCB0byBoYXZlIHRoZSBzaWduYXR1cmU6XG4gICogYGBgXG4gICogZGVidWdGdW5jdGlvbihkcmF3ZXIsIG9iamVjdE9mQ2xhc3MsIGRyYXdzVGV4dClcbiAgKiBgYGBcbiAgKiArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAqICsgYG9iamVjdE9mQ2xhc3M6IGRyYXdhYmxlQ2xhc3NgIC0gSW5zdGFuY2Ugb2YgYGRyYXdhYmxlQ2xhc3NgIHRvIGRyYXdcbiAgKiArIGBkcmF3c1RleHQ6IGJvb2xgIC0gV2hlbiBgdHJ1ZWAgdGV4dCBzaG91bGQgYmUgZHJhd24gd2l0aFxuICAqICAgIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge2NsYXNzfSBkcmF3YWJsZUNsYXNzIC0gQ2xhc3Mgb2YgdGhlIGluc3RhbmNlcyB0byBkcmF3XG4gICogQHBhcmFtIHtmdW5jdGlvbn0gZGVidWdGdW5jdGlvbiAtIEZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgZGVidWctZHJhd2luZ1xuICAqL1xuICBzZXREZWJ1Z0Z1bmN0aW9uKGRyYXdhYmxlQ2xhc3MsIGRlYnVnRnVuY3Rpb24pIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLmRlYnVnUm91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBkcmF3YWJsZUNsYXNzKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgRGVidWdSb3V0aW5lKGRyYXdhYmxlQ2xhc3MsIGRlYnVnRnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5kZWJ1Z1JvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5kZWJ1Z1JvdXRpbmVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWJ1Z1JvdXRpbmVzLnB1c2gocm91dGluZSk7XG4gIH1cblxuXG4gIC8vIEFkZHMgYSBBcHBseVJvdXRpbmUgZm9yIHRoZSBnaXZlbiBjbGFzcy5cbiAgc2V0QXBwbHlGdW5jdGlvbihjbGFzc09iaiwgYXBwbHlGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuYXBwbHlSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgQXBwbHlSb3V0aW5lKGNsYXNzT2JqLCBhcHBseUZ1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuYXBwbHlSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICAgIC8vIERlbGV0ZSByb3V0aW5lXG4gICAgICB0aGlzLmFwcGx5Um91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5Um91dGluZXMucHVzaChyb3V0aW5lKTtcbiAgfVxuXG5cbiAgZHJhd09iamVjdChvYmplY3QsIHN0eWxlID0gbnVsbCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS50cmFjZShgQ2Fubm90IGRyYXcgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0RyYXc7XG4gICAgfVxuXG4gICAgaWYgKHJvdXRpbmUucmVxdWlyZXNQdXNoUG9wID09PSB0cnVlXG4gICAgICB8fCBzdHlsZSAhPT0gbnVsbFxuICAgICAgfHwgcm91dGluZS5zdHlsZSAhPT0gbnVsbClcbiAgICB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIGlmIChyb3V0aW5lLnN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIHJvdXRpbmUuc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBzdHlsZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHB1c2gtcHVsbFxuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgICB9XG4gIH1cblxuXG4gIGRlYnVnT2JqZWN0KG9iamVjdCwgZHJhd3NUZXh0KSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRlYnVnUm91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gcm91dGluZSwganVzdCBkcmF3IG9iamVjdCB3aXRoIGRlYnVnIHN0eWxlXG4gICAgICB0aGlzLmRyYXdPYmplY3Qob2JqZWN0LCB0aGlzLmRlYnVnU3R5bGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnU3R5bGUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucDUucHVzaCgpO1xuICAgICAgdGhpcy5kZWJ1Z1N0eWxlLmFwcGx5KCk7XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24odGhpcywgb2JqZWN0LCBkcmF3c1RleHQpO1xuICAgICAgdGhpcy5wNS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uKHRoaXMsIG9iamVjdCwgZHJhd3NUZXh0KTtcbiAgICB9XG4gIH1cblxuXG4gIGFwcGx5T2JqZWN0KG9iamVjdCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IG9iamVjdCBpbnN0YW5jZW9mIHJvdXRpbmUuY2xhc3NPYmopO1xuICAgIGlmIChyb3V0aW5lID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUudHJhY2UoYENhbm5vdCBhcHBseSBvYmplY3QgLSBvYmplY3QtdHlwZToke3V0aWxzLnR5cGVOYW1lKG9iamVjdCl9YCk7XG4gICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdFRvQXBwbHk7XG4gICAgfVxuXG4gICAgcm91dGluZS5hcHBseUZ1bmN0aW9uKHRoaXMsIG9iamVjdCk7XG4gIH1cblxuXG4gIC8vIFNldHMgdXAgYWxsIGRyYXdpbmcgcm91dGluZXMgZm9yIHJhYyBkcmF3YWJsZSBjbGFzZXMuXG4gIC8vIEFsc28gYXR0YWNoZXMgYWRkaXRpb25hbCBwcm90b3R5cGUgYW5kIHN0YXRpYyBmdW5jdGlvbnMgaW4gcmVsZXZhbnRcbiAgLy8gY2xhc3Nlcy5cbiAgc2V0dXBBbGxEcmF3RnVuY3Rpb25zKCkge1xuICAgIGxldCBmdW5jdGlvbnMgPSByZXF1aXJlKCcuL2RyYXcuZnVuY3Rpb25zJyk7XG5cbiAgICAvLyBQb2ludFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5Qb2ludCwgZnVuY3Rpb25zLmRyYXdQb2ludCk7XG4gICAgcmVxdWlyZSgnLi9Qb2ludC5mdW5jdGlvbnMnKSh0aGlzLnJhYyk7XG5cbiAgICAvLyBSYXlcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuUmF5LCBmdW5jdGlvbnMuZHJhd1JheSk7XG4gICAgcmVxdWlyZSgnLi9SYXkuZnVuY3Rpb25zJykodGhpcy5yYWMpO1xuXG4gICAgLy8gU2VnbWVudFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5TZWdtZW50LCBmdW5jdGlvbnMuZHJhd1NlZ21lbnQpO1xuICAgIHJlcXVpcmUoJy4vU2VnbWVudC5mdW5jdGlvbnMnKSh0aGlzLnJhYyk7XG5cbiAgICAvLyBBcmNcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQXJjLCBmdW5jdGlvbnMuZHJhd0FyYyk7XG5cbiAgICBSYWMuQXJjLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgICBsZXQgYmV6aWVyc1BlclR1cm4gPSA1O1xuICAgICAgbGV0IGRpdmlzaW9ucyA9IE1hdGguY2VpbChhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAqIGJlemllcnNQZXJUdXJuKTtcbiAgICAgIHRoaXMuZGl2aWRlVG9CZXppZXJzKGRpdmlzaW9ucykudmVydGV4KCk7XG4gICAgfTtcblxuICAgIC8vIEJlemllclxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5CZXppZXIsIChkcmF3ZXIsIGJlemllcikgPT4ge1xuICAgICAgZHJhd2VyLnA1LmJlemllcihcbiAgICAgICAgYmV6aWVyLnN0YXJ0LngsIGJlemllci5zdGFydC55LFxuICAgICAgICBiZXppZXIuc3RhcnRBbmNob3IueCwgYmV6aWVyLnN0YXJ0QW5jaG9yLnksXG4gICAgICAgIGJlemllci5lbmRBbmNob3IueCwgYmV6aWVyLmVuZEFuY2hvci55LFxuICAgICAgICBiZXppZXIuZW5kLngsIGJlemllci5lbmQueSk7XG4gICAgfSk7XG5cbiAgICBSYWMuQmV6aWVyLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc3RhcnQudmVydGV4KClcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5iZXppZXJWZXJ0ZXgoXG4gICAgICAgIHRoaXMuc3RhcnRBbmNob3IueCwgdGhpcy5zdGFydEFuY2hvci55LFxuICAgICAgICB0aGlzLmVuZEFuY2hvci54LCB0aGlzLmVuZEFuY2hvci55LFxuICAgICAgICB0aGlzLmVuZC54LCB0aGlzLmVuZC55KTtcbiAgICB9O1xuXG4gICAgLy8gQ29tcG9zaXRlXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkNvbXBvc2l0ZSwgKGRyYXdlciwgY29tcG9zaXRlKSA9PiB7XG4gICAgICBjb21wb3NpdGUuc2VxdWVuY2UuZm9yRWFjaChpdGVtID0+IGl0ZW0uZHJhdygpKTtcbiAgICB9KTtcblxuICAgIFJhYy5Db21wb3NpdGUucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zZXF1ZW5jZS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS52ZXJ0ZXgoKSk7XG4gICAgfTtcblxuICAgIC8vIFNoYXBlXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlNoYXBlLCAoZHJhd2VyLCBzaGFwZSkgPT4ge1xuICAgICAgZHJhd2VyLnA1LmJlZ2luU2hhcGUoKTtcbiAgICAgIHNoYXBlLm91dGxpbmUudmVydGV4KCk7XG5cbiAgICAgIGlmIChzaGFwZS5jb250b3VyLmlzTm90RW1wdHkoKSkge1xuICAgICAgICBkcmF3ZXIucDUuYmVnaW5Db250b3VyKCk7XG4gICAgICAgIHNoYXBlLmNvbnRvdXIudmVydGV4KCk7XG4gICAgICAgIGRyYXdlci5wNS5lbmRDb250b3VyKCk7XG4gICAgICB9XG4gICAgICBkcmF3ZXIucDUuZW5kU2hhcGUoKTtcbiAgICB9KTtcblxuICAgIFJhYy5TaGFwZS5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm91dGxpbmUudmVydGV4KCk7XG4gICAgICB0aGlzLmNvbnRvdXIudmVydGV4KCk7XG4gICAgfTtcblxuICAgIC8vIFRleHRcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuVGV4dCwgKGRyYXdlciwgdGV4dCkgPT4ge1xuICAgICAgdGV4dC5mb3JtYXQuYXBwbHkodGV4dC5wb2ludCk7XG4gICAgICBkcmF3ZXIucDUudGV4dCh0ZXh0LnN0cmluZywgMCwgMCk7XG4gICAgfSk7XG4gICAgLy8gYHRleHQuZm9ybWF0LmFwcGx5YCBtYWtlcyB0cmFuc2xhdGUgYW5kIHJvdGF0aW9uIG1vZGlmaWNhdGlvbnMgdG9cbiAgICAvLyB0aGUgZHJhd2luZyBtYXRyaXgsIHRoaXMgcmVxdWlyZXMgYSBwdXNoLXBvcCBvbiBldmVyeSBkcmF3XG4gICAgdGhpcy5zZXREcmF3T3B0aW9ucyhSYWMuVGV4dCwge3JlcXVpcmVzUHVzaFBvcDogdHJ1ZX0pO1xuICB9IC8vIHNldHVwQWxsRHJhd0Z1bmN0aW9uc1xuXG5cbiAgLy8gU2V0cyB1cCBhbGwgZGVidWcgcm91dGluZXMgZm9yIHJhYyBkcmF3YWJsZSBjbGFzZXMuXG4gIHNldHVwQWxsRGVidWdGdW5jdGlvbnMoKSB7XG4gICAgbGV0IGZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZGVidWcuZnVuY3Rpb25zJyk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5Qb2ludCwgZnVuY3Rpb25zLmRlYnVnUG9pbnQpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuUmF5LCBmdW5jdGlvbnMuZGVidWdSYXkpO1xuICAgIHRoaXMuc2V0RGVidWdGdW5jdGlvbihSYWMuU2VnbWVudCwgZnVuY3Rpb25zLmRlYnVnU2VnbWVudCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kZWJ1Z0FyYyk7XG5cbiAgICBSYWMuQW5nbGUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24ocG9pbnQsIGRyYXdzVGV4dCA9IGZhbHNlKSB7XG4gICAgICBjb25zdCBkcmF3ZXIgPSB0aGlzLnJhYy5kcmF3ZXI7XG4gICAgICBpZiAoZHJhd2VyLmRlYnVnU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1LnB1c2goKTtcbiAgICAgICAgZHJhd2VyLmRlYnVnU3R5bGUuYXBwbHkoKTtcbiAgICAgICAgLy8gVE9ETzogY291bGQgdGhpcyBiZSBhIGdvb2Qgb3B0aW9uIHRvIGltcGxlbWVudCBzcGxhdHRpbmcgYXJndW1lbnRzXG4gICAgICAgIC8vIGludG8gdGhlIGRlYnVnRnVuY3Rpb24/XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICAgIGRyYXdlci5wNS5wb3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9ucy5kZWJ1Z0FuZ2xlKGRyYXdlciwgdGhpcywgcG9pbnQsIGRyYXdzVGV4dCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgUmFjLlBvaW50LnByb3RvdHlwZS5kZWJ1Z0FuZ2xlID0gZnVuY3Rpb24oYW5nbGUsIGRyYXdzVGV4dCA9IGZhbHNlKSB7XG4gICAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgICAgYW5nbGUuZGVidWcodGhpcywgZHJhd3NUZXh0KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gIH0gLy8gc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9uc1xuXG5cbiAgLy8gU2V0cyB1cCBhbGwgYXBwbHlpbmcgcm91dGluZXMgZm9yIHJhYyBzdHlsZSBjbGFzZXMuXG4gIC8vIEFsc28gYXR0YWNoZXMgYWRkaXRpb25hbCBwcm90b3R5cGUgZnVuY3Rpb25zIGluIHJlbGV2YW50IGNsYXNzZXMuXG4gIHNldHVwQWxsQXBwbHlGdW5jdGlvbnMoKSB7XG4gICAgLy8gQ29sb3IgcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlCYWNrZ3JvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUuYmFja2dyb3VuZCh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1KTtcbiAgICB9O1xuXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseUZpbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5maWxsKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUsIHRoaXMuYSAqIDI1NSk7XG4gICAgfTtcblxuICAgIFJhYy5Db2xvci5wcm90b3R5cGUuYXBwbHlTdHJva2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5zdHJva2UodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSwgdGhpcy5hICogMjU1KTtcbiAgICB9O1xuXG4gICAgLy8gU3Ryb2tlXG4gICAgdGhpcy5zZXRBcHBseUZ1bmN0aW9uKFJhYy5TdHJva2UsIChkcmF3ZXIsIHN0cm9rZSkgPT4ge1xuICAgICAgaWYgKHN0cm9rZS53ZWlnaHQgPT09IG51bGwgJiYgc3Ryb2tlLmNvbG9yID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5ub1N0cm9rZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJva2UuY29sb3IgIT09IG51bGwpIHtcbiAgICAgICAgc3Ryb2tlLmNvbG9yLmFwcGx5U3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJva2Uud2VpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIGRyYXdlci5wNS5zdHJva2VXZWlnaHQoc3Ryb2tlLndlaWdodCAqIGRyYXdlci5zdHJva2VXZWlnaHRGYWN0b3IpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRmlsbFxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuRmlsbCwgKGRyYXdlciwgZmlsbCkgPT4ge1xuICAgICAgaWYgKGZpbGwuY29sb3IgPT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1Lm5vRmlsbCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZpbGwuY29sb3IuYXBwbHlGaWxsKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTdHlsZUNvbnRhaW5lclxuICAgIHRoaXMuc2V0QXBwbHlGdW5jdGlvbihSYWMuU3R5bGVDb250YWluZXIsIChkcmF3ZXIsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgY29udGFpbmVyLnN0eWxlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLmFwcGx5KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFRleHQuRm9ybWF0XG4gICAgLy8gQXBwbGllcyBhbGwgdGV4dCBwcm9wZXJ0aWVzIGFuZCB0cmFuc2xhdGVzIHRvIHRoZSBnaXZlbiBgcG9pbnRgLlxuICAgIC8vIEFmdGVyIHRoZSBmb3JtYXQgaXMgYXBwbGllZCB0aGUgdGV4dCBzaG91bGQgYmUgZHJhd24gYXQgdGhlIG9yaWdpbi5cbiAgICAvL1xuICAgIC8vIENhbGxpbmcgdGhpcyBmdW5jdGlvbiByZXF1aXJlcyBhIHB1c2gtcG9wIHRvIHRoZSBkcmF3aW5nIHN0eWxlXG4gICAgLy8gc2V0dGluZ3Mgc2luY2UgdHJhbnNsYXRlIGFuZCByb3RhdGlvbiBtb2RpZmljYXRpb25zIGFyZSBtYWRlIHRvIHRoZVxuICAgIC8vIGRyYXdpbmcgbWF0cml4LiBPdGhlcndpc2UgYWxsIG90aGVyIHN1YnNlcXVlbnQgZHJhd2luZyB3aWxsIGJlXG4gICAgLy8gaW1wYWN0ZWQuXG4gICAgUmFjLlRleHQuRm9ybWF0LnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgICBsZXQgaEFsaWduO1xuICAgICAgbGV0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgICAgIHN3aXRjaCAodGhpcy5oQWxpZ24pIHtcbiAgICAgICAgY2FzZSBoRW51bS5sZWZ0OiAgIGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5MRUZUOyAgIGJyZWFrO1xuICAgICAgICBjYXNlIGhFbnVtLmNlbnRlcjogaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkNFTlRFUjsgYnJlYWs7XG4gICAgICAgIGNhc2UgaEVudW0ucmlnaHQ6ICBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuUklHSFQ7ICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIGhBbGlnbiBjb25maWd1cmF0aW9uIC0gaEFsaWduOiR7dGhpcy5oQWxpZ259YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICBsZXQgdkFsaWduO1xuICAgICAgbGV0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gICAgICBzd2l0Y2ggKHRoaXMudkFsaWduKSB7XG4gICAgICAgIGNhc2UgdkVudW0udG9wOiAgICAgIHZBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5UT1A7ICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdkVudW0uYm90dG9tOiAgIHZBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5CT1RUT007ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdkVudW0uY2VudGVyOiAgIHZBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5DRU5URVI7ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdkVudW0uYmFzZWxpbmU6IHZBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5CQVNFTElORTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCB2QWxpZ24gY29uZmlndXJhdGlvbiAtIHZBbGlnbjoke3RoaXMudkFsaWdufWApO1xuICAgICAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICAgIH1cblxuICAgICAgLy8gQWxpZ25cbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0QWxpZ24oaEFsaWduLCB2QWxpZ24pO1xuXG4gICAgICAvLyBTaXplXG4gICAgICBjb25zdCB0ZXh0U2l6ZSA9IHRoaXMuc2l6ZSA/PyB0aGlzLnJhYy50ZXh0Rm9ybWF0RGVmYXVsdHMuc2l6ZTtcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0U2l6ZSh0ZXh0U2l6ZSk7XG5cbiAgICAgIC8vIEZvbnRcbiAgICAgIGNvbnN0IHRleHRGb250ID0gdGhpcy5mb250ID8/IHRoaXMucmFjLnRleHRGb3JtYXREZWZhdWx0cy5mb250O1xuICAgICAgaWYgKHRleHRGb250ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50ZXh0Rm9udCh0ZXh0Rm9udCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvc2l0aW9uaW5nXG4gICAgICB0aGlzLnJhYy5kcmF3ZXIucDUudHJhbnNsYXRlKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgaWYgKHRoaXMuYW5nbGUudHVybiAhPSAwKSB7XG4gICAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5yb3RhdGUodGhpcy5hbmdsZS5yYWRpYW5zKCkpO1xuICAgICAgfVxuICAgIH0gLy8gUmFjLlRleHQuRm9ybWF0LnByb3RvdHlwZS5hcHBseVxuXG4gIH0gLy8gc2V0dXBBbGxBcHBseUZ1bmN0aW9uc1xuXG59IC8vIGNsYXNzIFA1RHJhd2VyXG5cbm1vZHVsZS5leHBvcnRzID0gUDVEcmF3ZXI7XG5cblxuLy8gQ29udGFpbnMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGRyYXdpbmcgb2JqZWN0cyBvZiBhXG4vLyBzcGVjaWZpYyBjbGFzcy5cbi8vXG4vLyBBbiBpbnN0YW5jZSBpcyBjcmVhdGVkIGZvciBlYWNoIGRyYXdhYmxlIGNsYXNzIHRoYXQgdGhlIGRyYXdlciBjYW5cbi8vIHN1cHBvcnQsIHdoaWNoIGNvbnRhaW5zIGFsbCB0aGUgc2V0dGluZ3MgbmVlZGVkIGZvciBkcmF3aW5nLlxuY2xhc3MgRHJhd1JvdXRpbmUge1xuXG4gIC8vIFRPRE86IFJlbmFtZSB0byBkcmF3YWJsZUNsYXNzXG4gIGNvbnN0cnVjdG9yIChjbGFzc09iaiwgZHJhd0Z1bmN0aW9uKSB7XG4gICAgLy8gQ2xhc3MgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb250YWluZWQgc2V0dGluZ3MuXG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuXG4gICAgLy8gRHJhd2luZyBmdW5jdGlvbiBmb3Igb2JqZWN0cyBvZiB0eXBlIGBjbGFzc09iamAgd2l0aCB0aGUgc2lnbmF0dXJlOlxuICAgIC8vIGBkcmF3RnVuY3Rpb24oZHJhd2VyLCBvYmplY3RPZkNsYXNzKWBcbiAgICAvLyArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAgIC8vICsgYG9iamVjdE9mQ2xhc3M6IGNsYXNzT2JqYCAtIEluc3RhbmNlIG9mIGBjbGFzc09iamAgdG8gZHJhd1xuICAgIC8vXG4gICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGludGVuZGVkIHRvIHBlcmZvcm0gZHJhd2luZyB1c2luZyBgZHJhd2VyLnA1YFxuICAgIC8vIGZ1bmN0aW9ucyBvciBjYWxsaW5nIGBkcmF3KClgIGluIG90aGVyIGRyYXdhYmxlIG9iamVjdHMuIEFsbCBzdHlsZXNcbiAgICAvLyBhcmUgcHVzaGVkIGJlZm9yZWhhbmQgYW5kIHBvcHBlZCBhZnRlcndhcmRzLlxuICAgIC8vXG4gICAgLy8gSW4gZ2VuZXJhbCBpdCBpcyBleHBlY3RlZCB0aGF0IHRoZSBgZHJhd0Z1bmN0aW9uYCBwZWZvcm1zIG5vIGNoYW5nZXNcbiAgICAvLyB0byB0aGUgZHJhd2luZyBzZXR0aW5ncyBpbiBvcmRlciBmb3IgZWFjaCBkcmF3aW5nIGNhbGwgdG8gdXNlIG9ubHkgYVxuICAgIC8vIHNpbmdsZSBgcHVzaC9wb3BgIHdoZW4gbmVjZXNzYXJ5LiBGb3IgY2xhc3NlcyB0aGF0IHJlcXVpcmVcbiAgICAvLyBtb2RpZmljYXRpb25zIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzIHRoZSBgcmVxdWlyZXNQdXNoUG9wYFxuICAgIC8vIHByb3BlcnR5IGNhbiBiZSBzZXQgdG8gZm9yY2UgYSBgcHVzaC9wb3BgIHdpdGggZWFjaCBkcmF3aW5nIGNhbGxcbiAgICAvLyByZWdhcmRsZXNzIGlmIHN0eWxlcyBhcmUgYXBwbGllZC5cbiAgICB0aGlzLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcblxuICAgIC8vIFdoZW4gc2V0LCB0aGlzIHN0eWxlIGlzIGFsd2F5cyBhcHBsaWVkIGJlZm9yZSBlYWNoIGRyYXdpbmcgY2FsbCB0b1xuICAgIC8vIG9iamVjdHMgb2YgdHlwZSBgY2xhc3NPYmpgLiBUaGlzIGBzdHlsZWAgaXMgYXBwbGllZCBiZWZvcmUgdGhlXG4gICAgLy8gYHN0eWxlYCBwcm92aWRlZCB0byB0aGUgZHJhd2luZyBjYWxsLlxuICAgIHRoaXMuc3R5bGUgPSBudWxsO1xuXG4gICAgLy8gV2hlbiBzZXQgdG8gYHRydWVgLCBhIGBwdXNoL3BvcGAgaXMgYWx3YXlzIHBlZm9ybWVkIGJlZm9yZSBhbmQgYWZ0ZXJcbiAgICAvLyBhbGwgdGhlIHN0eWxlIGFyZSBhcHBsaWVkIGFuZCBkcmF3aW5nIGlzIHBlcmZvcm1lZC4gVGhpcyBpcyBpbnRlbmRlZFxuICAgIC8vIGZvciBvYmplY3RzIHdoaWNoIGRyYXdpbmcgb3BlcmF0aW9ucyBtYXkgbmVlZCB0byBwZXJmb3JtXG4gICAgLy8gdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzLlxuICAgIHRoaXMucmVxdWlyZXNQdXNoUG9wID0gZmFsc2U7XG4gIH0gLy8gY29uc3RydWN0b3JcblxufSAvLyBEcmF3Um91dGluZVxuXG5cbi8vIENvbnRhaW5zIHRoZSBkZWJ1Zy1kcmF3aW5nIGZ1bmN0aW9uIGFuZCBvcHRpb25zIGZvciBkZWJ1Zy1kcmF3aW5nXG4vLyBvYmplY3RzIG9mIGEgc3BlY2lmaWMgY2xhc3MuXG4vL1xuLy8gQW4gaW5zdGFuY2UgaXMgY3JlYXRlZCBmb3IgZWFjaCBkcmF3YWJsZSBjbGFzcyB0aGF0IHRoZSBkcmF3ZXIgY2FuXG4vLyBzdXBwb3J0LCB3aGljaCBjb250YWlucyBhbGwgdGhlIHNldHRpbmdzIG5lZWRlZCBmb3IgZGVidWctZHJhd2luZy5cbi8vXG4vLyBXaGVuIGEgZHJhd2FibGUgb2JqZWN0IGRvZXMgbm90IGhhdmUgYSBgRGVidWdSb3V0aW5lYCBzZXR1cCwgY2FsbGluZ1xuLy8gYGRlYnVnKClgIHNpbXBseSBjYWxscyBgZHJhdygpYCB3aXRoIHRoZSBkZWJ1ZyBzdHlsZSBhcHBsaWVkLlxuY2xhc3MgRGVidWdSb3V0aW5lIHtcblxuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRlYnVnRnVuY3Rpb24pIHtcbiAgICAvLyBDbGFzcyBhc3NvY2lhdGVkIHdpdGggdGhlIGNvbnRhaW5lZCBzZXR0aW5ncy5cbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG5cbiAgICAvLyBEZWJ1ZyBmdW5jdGlvbiBmb3Igb2JqZWN0cyBvZiB0eXBlIGBjbGFzc09iamAgd2l0aCB0aGUgc2lnbmF0dXJlOlxuICAgIC8vIGBkZWJ1Z0Z1bmN0aW9uKGRyYXdlciwgb2JqZWN0T2ZDbGFzcywgZHJhd3NUZXh0KWBcbiAgICAvLyArIGBkcmF3ZXI6IFA1RHJhd2VyYCAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZ1xuICAgIC8vICsgYG9iamVjdE9mQ2xhc3M6IGNsYXNzT2JqYCAtIEluc3RhbmNlIG9mIGBjbGFzc09iamAgdG8gZGVidWdcbiAgICAvLyArIGBkcmF3c1RleHQ6IGJvb2xgIC0gV2hlbiBgdHJ1ZWAgdGV4dCBzaG91bGQgYmUgZHJhd24gd2l0aFxuICAgIC8vICAgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICAvL1xuICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBpbnRlbmRlZCB0byBwZXJmb3JtIGRlYnVnLWRyYXdpbmcgdXNpbmcgYGRyYXdlci5wNWBcbiAgICAvLyBmdW5jdGlvbnMgb3IgY2FsbGluZyBgZHJhdygpYCBpbiBvdGhlciBkcmF3YWJsZSBvYmplY3RzLiBUaGUgZGVidWdcbiAgICAvLyBzdHlsZSBpcyBwdXNoZWQgYmVmb3JlaGFuZCBhbmQgcG9wcGVkIGFmdGVyd2FyZHMuXG4gICAgLy9cbiAgICAvLyBJbiBnZW5lcmFsIGl0IGlzIGV4cGVjdGVkIHRoYXQgdGhlIGBkcmF3RnVuY3Rpb25gIHBlZm9ybXMgbm8gY2hhbmdlc1xuICAgIC8vIHRvIHRoZSBkcmF3aW5nIHNldHRpbmdzIGluIG9yZGVyIGZvciBlYWNoIGRyYXdpbmcgY2FsbCB0byB1c2Ugb25seSBhXG4gICAgLy8gc2luZ2xlIGBwdXNoL3BvcGAgd2hlbiBuZWNlc3NhcnkuXG4gICAgLy9cbiAgICB0aGlzLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICB9IC8vIGNvbnN0cnVjdG9yXG5cbn1cblxuXG5jbGFzcyBBcHBseVJvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5hcHBseUZ1bmN0aW9uID0gYXBwbHlGdW5jdGlvbjtcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFBvaW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBQb2ludGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5Qb2ludC5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqL1xuICBSYWMuUG9pbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLmRyYXdlci5wNS52ZXJ0ZXgodGhpcy54LCB0aGlzLnkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gcG9pbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LnBvaW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUubW91c2VYLCByYWMuZHJhd2VyLnA1Lm1vdXNlWSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQ2VudGVyXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzQ2VudGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLzIsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0LzIpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBlbmQgb2YgdGhlIGNhbnZhcywgdGhhdCBpcywgYXQgdGhlIHBvc2l0aW9uXG4gICogYCh3aWR0aCxoZWlnaHQpYC5cbiAgKlxuICAqIEFkZGVkIHRvIGBpbnN0YW5jZS5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0VuZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG59IC8vIGF0dGFjaFBvaW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmF5RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSByYXkgdG91Y2hlcyB0aGUgY2FudmFzIGVkZ2UuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5wb2ludEF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBsZXQgZWRnZVJheSA9IHRoaXMucmF5QXRDYW52YXNFZGdlKG1hcmdpbik7XG4gICAgaWYgKGVkZ2VSYXkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkZ2VSYXkuc3RhcnQ7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IHRoZSBwb2ludCB3aGVyZSB0aGUgYHRoaXNgIHRvdWNoZXNcbiAgKiB0aGUgY2FudmFzIGVkZ2UgYW5kIHBvaW50ZWQgdG93YXJkcyB0aGUgaW5zaWRlIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMgez9SYWMuUmF5fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5yYXlBdENhbnZhc0VkZ2UgPSBmdW5jdGlvbihtYXJnaW4gPSAwKSB7XG4gICAgY29uc3QgdHVybiA9IHRoaXMuYW5nbGUudHVybjtcbiAgICBjb25zdCBwNSA9IHRoaXMucmFjLmRyYXdlci5wNTtcblxuICAgIGNvbnN0IGRvd25FZGdlICA9IHA1LmhlaWdodCAtIG1hcmdpbjtcbiAgICBjb25zdCBsZWZ0RWRnZSAgPSBtYXJnaW47XG4gICAgY29uc3QgdXBFZGdlICAgID0gbWFyZ2luO1xuICAgIGNvbnN0IHJpZ2h0RWRnZSA9IHA1LndpZHRoIC0gbWFyZ2luO1xuXG4gICAgLy8gcG9pbnRpbmcgZG93blxuICAgIGlmICh0dXJuID49IDEvOCAmJiB0dXJuIDwgMy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55IDwgZG93bkVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyBsZWZ0XG4gICAgaWYgKHR1cm4gPj0gMy84ICYmIHR1cm4gPCA1LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnggPj0gbGVmdEVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnkgPiBkb3duRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueSA8IHVwRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyB1cFxuICAgIGlmICh0dXJuID49IDUvOCAmJiB0dXJuIDwgNy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55ID49IHVwRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHJpZ2h0XG4gICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgIGlmICh0aGlzLnN0YXJ0LnggPCByaWdodEVkZ2UpIHtcbiAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkZ2VSYXk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUmF5RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoU2VnbWVudEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCB0byByZXByZXNlbnQgdGhpcyBgU2VnbWVudGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5TZWdtZW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5TZWdtZW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0UG9pbnQoKS52ZXJ0ZXgoKTtcbiAgICB0aGlzLmVuZFBvaW50KCkudmVydGV4KCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSB0b3Agb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdCB0b1xuICAqIHRvcC1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzVG9wXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzTGVmdFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNMZWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLXJpZ2h0XG4gICogdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGBpbnN0YW5jZS5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNSaWdodFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgsIDApO1xuICAgIHJldHVybiB0b3BSaWdodFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhcywgZnJvbVxuICAqIGJvdHRvbS1sZWZ0IHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQm90dG9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbmZ1bmN0aW9uIHJldmVyc2VzVGV4dChhbmdsZSkge1xuICByZXR1cm4gYW5nbGUudHVybiA8IDMvNCAmJiBhbmdsZS50dXJuID49IDEvNDtcbn1cblxuXG5leHBvcnRzLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihkcmF3ZXIsIGFuZ2xlLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIFplcm8gc2VnbWVudFxuICBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuemVybywgbWFya2VyUmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gQW5nbGUgc2VnbWVudFxuICBsZXQgYW5nbGVTZWdtZW50ID0gcG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyAqIDEuNSk7XG4gIGFuZ2xlU2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgYW5nbGUsIGFuZ2xlLmludmVyc2UoKSwgZmFsc2UpXG4gICAgLmRyYXcoKTtcbiAgYW5nbGVTZWdtZW50XG4gICAgLndpdGhMZW5ndGhBZGQocG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBNaW5pIGFyYyBtYXJrZXJzXG4gIGxldCBhbmdsZUFyYyA9IHBvaW50LmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS56ZXJvLCBhbmdsZSk7XG4gIGxldCBjb250ZXh0ID0gZHJhd2VyLnA1LmRyYXdpbmdDb250ZXh0O1xuICBsZXQgc3Ryb2tlV2VpZ2h0ID0gY29udGV4dC5saW5lV2lkdGg7XG4gIGNvbnRleHQuc2F2ZSgpOyB7XG4gICAgY29udGV4dC5saW5lQ2FwID0gJ2J1dHQnO1xuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzYsIDRdKTtcbiAgICAvLyBBbmdsZSBhcmNcbiAgICBhbmdsZUFyYy5kcmF3KCk7XG5cbiAgICBpZiAoIWFuZ2xlQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBhbmdsZUFyY1xuICAgICAgICAud2l0aFJhZGl1cyhtYXJrZXJSYWRpdXMqMy80KVxuICAgICAgICAud2l0aENsb2Nrd2lzZShmYWxzZSlcbiAgICAgICAgLmRyYXcoKTtcbiAgICB9XG4gIH07XG4gIGNvbnRleHQucmVzdG9yZSgpO1xuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIsXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgZm9ybWF0ID0gZm9ybWF0LnJldmVyc2UoKTtcbiAgfVxuXG4gIC8vIFR1cm4gdGV4dFxuICBsZXQgdHVyblN0cmluZyA9IGB0dXJuOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcG9pbnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBtYXJrZXJSYWRpdXMqMilcbiAgICAudGV4dCh0dXJuU3RyaW5nLCBmb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnQW5nbGVcblxuXG5leHBvcnRzLmRlYnVnUG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgcG9pbnQuZHJhdygpO1xuXG4gIC8vIFBvaW50IG1hcmtlclxuICBwb2ludC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBQb2ludCByZXRpY3VsZSBtYXJrZXJcbiAgbGV0IGFyYyA9IHBvaW50XG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS5zLCByYWMuQW5nbGUuZSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygxLzIpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBsZXQgc3RyaW5nID0gYHg6JHtwb2ludC54LnRvRml4ZWQoZGlnaXRzKX1cXG55OiR7cG9pbnQueS50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3AsXG4gICAgcmFjLkFuZ2xlLmUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgcG9pbnRcbiAgICAucG9pbnRUb0FuZ2xlKHJhYy5BbmdsZS5zZSwgcG9pbnRSYWRpdXMqMilcbiAgICAudGV4dChzdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdQb2ludFxuXG5cbmV4cG9ydHMuZGVidWdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9IGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICByYXkuZHJhdygpO1xuXG4gIC8vIExpdHRsZSBjaXJjbGUgYXQgc3RhcnQgbWFya2VyXG4gIHJheS5zdGFydC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBhdCBzdGFydFxuICBjb25zdCBwZXJwQW5nbGUgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICBjb25zdCBzdGFydEFyYyA9IHJheS5zdGFydFxuICAgIC5hcmMobWFya2VyUmFkaXVzLCBwZXJwQW5nbGUsIHBlcnBBbmdsZS5pbnZlcnNlKCkpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRWRnZSBlbmQgaGFsZiBjaXJjbGVcbiAgY29uc3QgZWRnZVJheSA9IHJheS5yYXlBdENhbnZhc0VkZ2UoKTtcbiAgaWYgKGVkZ2VSYXkgIT0gbnVsbCkge1xuICAgIGNvbnN0IGVkZ2VBcmMgPSBlZGdlUmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cylcbiAgICAgIC5wZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgICAgLmFyY1RvQW5nbGVEaXN0YW5jZShtYXJrZXJSYWRpdXMvMiwgMC41KVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gICAgZWRnZUFyYy5lbmRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnJhZGl1c1NlZ21lbnRBdEFuZ2xlKGVkZ2VSYXkuYW5nbGUpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgY29uc3QgYW5nbGUgID0gcmF5LmFuZ2xlO1xuICBjb25zdCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGNvbnN0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gIGNvbnN0IGZvbnQgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQ7XG4gIGNvbnN0IHNpemUgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemU7XG4gIGNvbnN0IGRpZ2l0cyA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgc3RhcnRGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRW51bS5sZWZ0LCB2RW51bS5ib3R0b20sXG4gICAgYW5nbGUsIGZvbnQsIHNpemUpO1xuICBsZXQgYW5nbGVGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRW51bS5sZWZ0LCB2RW51bS50b3AsXG4gICAgYW5nbGUsIGZvbnQsIHNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBzdGFydEZvcm1hdCA9IHN0YXJ0Rm9ybWF0LnJldmVyc2UoKTtcbiAgICBhbmdsZUZvcm1hdCA9IGFuZ2xlRm9ybWF0LnJldmVyc2UoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHRleHRcbiAgY29uc3Qgc3RhcnRTdHJpbmcgPSBgc3RhcnQ6KCR7cmF5LnN0YXJ0LngudG9GaXhlZChkaWdpdHMpfSwke3JheS5zdGFydC55LnRvRml4ZWQoZGlnaXRzKX0pYDtcbiAgcmF5LnN0YXJ0XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5zdWJ0cmFjdCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChzdGFydFN0cmluZywgc3RhcnRGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAvLyBBbmdsZSB0ZXh0XG4gIGNvbnN0IGFuZ2xlU3RyaW5nID0gYGFuZ2xlOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcmF5LnN0YXJ0XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5hZGQoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQoYW5nbGVTdHJpbmcsIGFuZ2xlRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1JheVxuXG5cbmV4cG9ydHMuZGVidWdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgc2VnbWVudC5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgc2VnbWVudC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5hcmMoKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gSGFsZiBjaXJjbGUgc3RhcnQgc2VnbWVudFxuICBsZXQgcGVycEFuZ2xlID0gc2VnbWVudC5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoKTtcbiAgbGV0IGFyYyA9IHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIFBlcnBlbmRpY3VsYXIgZW5kIG1hcmtlclxuICBsZXQgZW5kTWFya2VyU3RhcnQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcigpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGVuZE1hcmtlckVuZCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgIC53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy8yKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oLXBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIC8vIExpdHRsZSBlbmQgaGFsZiBjaXJjbGVcbiAgc2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgZW5kTWFya2VyU3RhcnQuYW5nbGUoKSwgZW5kTWFya2VyRW5kLmFuZ2xlKCkpXG4gICAgLmRyYXcoKTtcblxuICAvLyBGb3JtaW5nIGVuZCBhcnJvd1xuICBsZXQgYXJyb3dBbmdsZVNoaWZ0ID0gcmFjLkFuZ2xlLmZyb20oMS83KTtcbiAgbGV0IGVuZEFycm93U3RhcnQgPSBlbmRNYXJrZXJTdGFydFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgZmFsc2UpO1xuICBsZXQgZW5kQXJyb3dFbmQgPSBlbmRNYXJrZXJFbmRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIHRydWUpO1xuICBsZXQgZW5kQXJyb3dQb2ludCA9IGVuZEFycm93U3RhcnRcbiAgICAucG9pbnRBdEludGVyc2VjdGlvbihlbmRBcnJvd0VuZCk7XG4gIC8vIEVuZCBhcnJvd1xuICBlbmRNYXJrZXJTdGFydFxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kQXJyb3dQb2ludClcbiAgICAuZHJhdygpXG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRNYXJrZXJFbmQuZW5kUG9pbnQoKSlcbiAgICAuZHJhdygpO1xuXG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBhbmdsZSA9IHNlZ21lbnQuYW5nbGUoKTtcbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBsZW5ndGhGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tLFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIGxldCBhbmdsZUZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3AsXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgbGVuZ3RoRm9ybWF0ID0gbGVuZ3RoRm9ybWF0LnJldmVyc2UoKTtcbiAgICBhbmdsZUZvcm1hdCA9IGFuZ2xlRm9ybWF0LnJldmVyc2UoKTtcbiAgfVxuXG4gIC8vIExlbmd0aFxuICBsZXQgbGVuZ3RoU3RyaW5nID0gYGxlbmd0aDoke3NlZ21lbnQubGVuZ3RoLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIHBvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuc3VidHJhY3QoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQobGVuZ3RoU3RyaW5nLCBsZW5ndGhGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAgIC8vIEFuZ2xlXG4gIGxldCBhbmdsZVN0cmluZyA9IGBhbmdsZToke2FuZ2xlLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG4gIHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5hZGQoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQoYW5nbGVTdHJpbmcsIGFuZ2xlRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1NlZ21lbnRcblxuXG5leHBvcnRzLmRlYnVnQXJjID0gZnVuY3Rpb24oZHJhd2VyLCBhcmMsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBhcmMuZHJhdygpO1xuXG4gIC8vIENlbnRlciBtYXJrZXJzXG4gIGxldCBjZW50ZXJBcmNSYWRpdXMgPSBtYXJrZXJSYWRpdXMgKiAyLzM7XG4gIGlmIChhcmMucmFkaXVzID4gbWFya2VyUmFkaXVzLzMgJiYgYXJjLnJhZGl1cyA8IG1hcmtlclJhZGl1cykge1xuICAgIC8vIElmIHJhZGl1cyBpcyB0b28gY2xvc2UgdG8gdGhlIGNlbnRlci1hcmMgbWFya2Vyc1xuICAgIC8vIE1ha2UgdGhlIGNlbnRlci1hcmMgYmUgb3V0c2lkZSBvZiB0aGUgYXJjXG4gICAgY2VudGVyQXJjUmFkaXVzID0gYXJjLnJhZGl1cyArIG1hcmtlclJhZGl1cy8zO1xuICB9XG5cbiAgLy8gQ2VudGVyIHN0YXJ0IHNlZ21lbnRcbiAgbGV0IGNlbnRlckFyYyA9IGFyYy53aXRoUmFkaXVzKGNlbnRlckFyY1JhZGl1cyk7XG4gIGNlbnRlckFyYy5zdGFydFNlZ21lbnQoKS5kcmF3KCk7XG5cbiAgLy8gUmFkaXVzXG4gIGxldCByYWRpdXNNYXJrZXJMZW5ndGggPSBhcmMucmFkaXVzXG4gICAgLSBjZW50ZXJBcmNSYWRpdXNcbiAgICAtIG1hcmtlclJhZGl1cy8yXG4gICAgLSBwb2ludFJhZGl1cyoyO1xuICBpZiAocmFkaXVzTWFya2VyTGVuZ3RoID4gMCkge1xuICAgIGFyYy5zdGFydFNlZ21lbnQoKVxuICAgICAgLndpdGhMZW5ndGgocmFkaXVzTWFya2VyTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKGNlbnRlckFyY1JhZGl1cyArIHBvaW50UmFkaXVzKjIpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gTWluaSBhcmMgbWFya2Vyc1xuICBsZXQgY29udGV4dCA9IGRyYXdlci5wNS5kcmF3aW5nQ29udGV4dDtcbiAgbGV0IHN0cm9rZVdlaWdodCA9IGNvbnRleHQubGluZVdpZHRoO1xuICBjb250ZXh0LnNhdmUoKTsge1xuICAgIGNvbnRleHQubGluZUNhcCA9ICdidXR0JztcbiAgICBjb250ZXh0LnNldExpbmVEYXNoKFs2LCA0XSk7XG4gICAgY2VudGVyQXJjLmRyYXcoKTtcblxuICAgIGlmICghY2VudGVyQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBjZW50ZXJBcmNcbiAgICAgICAgLndpdGhDbG9ja3dpc2UoIWNlbnRlckFyYy5jbG9ja3dpc2UpXG4gICAgICAgIC5kcmF3KCk7XG4gICAgfVxuICB9O1xuICBjb250ZXh0LnJlc3RvcmUoKTtcblxuICAvLyBDZW50ZXIgZW5kIHNlZ21lbnRcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGNlbnRlckFyYy5lbmRTZWdtZW50KCkucmV2ZXJzZSgpLndpdGhMZW5ndGhSYXRpbygxLzIpLmRyYXcoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHBvaW50IG1hcmtlclxuICBsZXQgc3RhcnRQb2ludCA9IGFyYy5zdGFydFBvaW50KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuYXJjKHBvaW50UmFkaXVzKS5kcmF3KCk7XG4gIHN0YXJ0UG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtbWFya2VyUmFkaXVzLzIpXG4gICAgLmRyYXcoKTtcblxuICAvLyBPcmllbnRhdGlvbiBtYXJrZXJcbiAgbGV0IG9yaWVudGF0aW9uTGVuZ3RoID0gbWFya2VyUmFkaXVzKjI7XG4gIGxldCBvcmllbnRhdGlvbkFyYyA9IGFyY1xuICAgIC5zdGFydFNlZ21lbnQoKVxuICAgIC53aXRoTGVuZ3RoQWRkKG1hcmtlclJhZGl1cylcbiAgICAuYXJjKG51bGwsIGFyYy5jbG9ja3dpc2UpXG4gICAgLndpdGhMZW5ndGgob3JpZW50YXRpb25MZW5ndGgpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGFycm93Q2VudGVyID0gb3JpZW50YXRpb25BcmNcbiAgICAucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLmNob3JkU2VnbWVudCgpO1xuICBsZXQgYXJyb3dBbmdsZSA9IDMvMzI7XG4gIGFycm93Q2VudGVyLndpdGhBbmdsZVNoaWZ0KC1hcnJvd0FuZ2xlKS5kcmF3KCk7XG4gIGFycm93Q2VudGVyLndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGUpLmRyYXcoKTtcblxuICAvLyBJbnRlcm5hbCBlbmQgcG9pbnQgbWFya2VyXG4gIGxldCBlbmRQb2ludCA9IGFyYy5lbmRQb2ludCgpO1xuICBsZXQgaW50ZXJuYWxMZW5ndGggPSBNYXRoLm1pbihtYXJrZXJSYWRpdXMvMiwgYXJjLnJhZGl1cyk7XG4gIGludGVybmFsTGVuZ3RoIC09IHBvaW50UmFkaXVzO1xuICBpZiAoaW50ZXJuYWxMZW5ndGggPiByYWMuZXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICBlbmRQb2ludFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5lbmQuaW52ZXJzZSgpLCBpbnRlcm5hbExlbmd0aClcbiAgICAgIC50cmFuc2xhdGVUb0xlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBFeHRlcm5hbCBlbmQgcG9pbnQgbWFya2VyXG4gIGxldCB0ZXh0Sm9pblRocmVzaG9sZCA9IG1hcmtlclJhZGl1cyozO1xuICBsZXQgbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA9IG9yaWVudGF0aW9uQXJjXG4gICAgLndpdGhFbmQoYXJjLmVuZClcbiAgICAubGVuZ3RoKCk7XG4gIGxldCBleHRlcm5hbExlbmd0aCA9IGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCAmJiBkcmF3c1RleHQgPT09IHRydWVcbiAgICA/IG1hcmtlclJhZGl1cyAtIHBvaW50UmFkaXVzXG4gICAgOiBtYXJrZXJSYWRpdXMvMiAtIHBvaW50UmFkaXVzO1xuXG4gIGVuZFBvaW50XG4gICAgLnNlZ21lbnRUb0FuZ2xlKGFyYy5lbmQsIGV4dGVybmFsTGVuZ3RoKVxuICAgIC50cmFuc2xhdGVUb0xlbmd0aChwb2ludFJhZGl1cylcbiAgICAuZHJhdygpO1xuXG4gIC8vIEVuZCBwb2ludCBsaXR0bGUgYXJjXG4gIGlmICghYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBlbmRQb2ludFxuICAgICAgLmFyYyhwb2ludFJhZGl1cywgYXJjLmVuZCwgYXJjLmVuZC5pbnZlcnNlKCksIGFyYy5jbG9ja3dpc2UpXG4gICAgICAuZHJhdygpO1xuICB9XG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGxldCB2RW51bSA9IFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduO1xuXG4gIGxldCBoZWFkVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2RW51bS50b3BcbiAgICA6IHZFbnVtLmJvdHRvbTtcbiAgbGV0IHRhaWxWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLmJvdHRvbVxuICAgIDogdkVudW0udG9wO1xuICBsZXQgcmFkaXVzVmVydGljYWwgPSBhcmMuY2xvY2t3aXNlXG4gICAgPyB2RW51bS5ib3R0b21cbiAgICA6IHZFbnVtLnRvcDtcblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGhlYWRGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBoRW51bS5sZWZ0LFxuICAgIGhlYWRWZXJ0aWNhbCxcbiAgICBhcmMuc3RhcnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IHRhaWxGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBoRW51bS5sZWZ0LFxuICAgIHRhaWxWZXJ0aWNhbCxcbiAgICBhcmMuZW5kLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIGxldCByYWRpdXNGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBoRW51bS5sZWZ0LFxuICAgIHJhZGl1c1ZlcnRpY2FsLFxuICAgIGFyYy5zdGFydCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuXG4gIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgaWYgKHJldmVyc2VzVGV4dChhcmMuc3RhcnQpKSB7XG4gICAgaGVhZEZvcm1hdCA9IGhlYWRGb3JtYXQucmV2ZXJzZSgpO1xuICAgIHJhZGl1c0Zvcm1hdCA9IHJhZGl1c0Zvcm1hdC5yZXZlcnNlKCk7XG4gIH1cbiAgaWYgKHJldmVyc2VzVGV4dChhcmMuZW5kKSkge1xuICAgIHRhaWxGb3JtYXQgPSB0YWlsRm9ybWF0LnJldmVyc2UoKTtcbiAgfVxuXG4gIGxldCBzdGFydFN0cmluZyA9IGBzdGFydDoke2FyYy5zdGFydC50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBsZXQgcmFkaXVzU3RyaW5nID0gYHJhZGl1czoke2FyYy5yYWRpdXMudG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCBlbmRTdHJpbmcgPSBgZW5kOiR7YXJjLmVuZC50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuXG4gIGxldCBhbmdsZURpc3RhbmNlID0gYXJjLmFuZ2xlRGlzdGFuY2UoKTtcbiAgbGV0IGRpc3RhbmNlU3RyaW5nID0gYGRpc3RhbmNlOiR7YW5nbGVEaXN0YW5jZS50dXJuLnRvRml4ZWQoZGlnaXRzKX1gO1xuXG4gIGxldCB0YWlsU3RyaW5nID0gYCR7ZGlzdGFuY2VTdHJpbmd9XFxuJHtlbmRTdHJpbmd9YDtcbiAgbGV0IGhlYWRTdHJpbmc7XG5cbiAgLy8gUmFkaXVzIGxhYmVsXG4gIGlmIChhbmdsZURpc3RhbmNlLnR1cm4gPD0gMy80ICYmICFhcmMuaXNDaXJjbGUoKSkge1xuICAgIC8vIFJhZGl1cyBkcmF3biBzZXBhcmF0ZWx5XG4gICAgbGV0IHBlcnBBbmdsZSA9IGFyYy5zdGFydC5wZXJwZW5kaWN1bGFyKCFhcmMuY2xvY2t3aXNlKTtcbiAgICBhcmMuY2VudGVyXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzKVxuICAgICAgLnBvaW50VG9BbmdsZShwZXJwQW5nbGUsIHBvaW50UmFkaXVzKjIpXG4gICAgICAudGV4dChyYWRpdXNTdHJpbmcsIHJhZGl1c0Zvcm1hdClcbiAgICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG4gICAgaGVhZFN0cmluZyA9IHN0YXJ0U3RyaW5nO1xuICB9IGVsc2Uge1xuICAgIC8vIFJhZGl1cyBqb2luZWQgdG8gaGVhZFxuICAgIGhlYWRTdHJpbmcgPSBgJHtzdGFydFN0cmluZ31cXG4ke3JhZGl1c1N0cmluZ31gO1xuICB9XG5cbiAgaWYgKGxlbmd0aEF0T3JpZW50YXRpb25BcmMgPiB0ZXh0Sm9pblRocmVzaG9sZCkge1xuICAgIC8vIERyYXcgc3RyaW5ncyBzZXBhcmF0ZWx5XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzLzIpXG4gICAgICAudGV4dChoZWFkU3RyaW5nLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBvcmllbnRhdGlvbkFyYy5wb2ludEF0QW5nbGUoYXJjLmVuZClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLmVuZCwgbWFya2VyUmFkaXVzLzIpXG4gICAgICAudGV4dCh0YWlsU3RyaW5nLCB0YWlsRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEcmF3IHN0cmluZ3MgdG9nZXRoZXJcbiAgICBsZXQgYWxsU3RyaW5ncyA9IGAke2hlYWRTdHJpbmd9XFxuJHt0YWlsU3RyaW5nfWA7XG4gICAgb3JpZW50YXRpb25BcmMuc3RhcnRQb2ludCgpXG4gICAgICAucG9pbnRUb0FuZ2xlKGFyYy5zdGFydCwgbWFya2VyUmFkaXVzLzIpXG4gICAgICAudGV4dChhbGxTdHJpbmdzLCBoZWFkRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgfVxufTsgLy8gZGVidWdBcmNcblxuXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIEJlemllclxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBDb21wb3NpdGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgU2hhcGVcbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgVGV4dFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuZXhwb3J0cy5kcmF3UG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50KSB7XG4gIGRyYXdlci5wNS5wb2ludChwb2ludC54LCBwb2ludC55KTtcbn07IC8vIGRyYXdQb2ludFxuXG5cbmV4cG9ydHMuZHJhd1JheSA9IGZ1bmN0aW9uKGRyYXdlciwgcmF5KSB7XG4gIGxldCBlZGdlUG9pbnQgPSByYXkucG9pbnRBdENhbnZhc0VkZ2UoKTtcblxuICBpZiAoZWRnZVBvaW50ID09PSBudWxsKSB7XG4gICAgLy8gUmF5IGlzIG91dHNpZGUgY2FudmFzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZHJhd2VyLnA1LmxpbmUoXG4gICAgcmF5LnN0YXJ0LngsIHJheS5zdGFydC55LFxuICAgIGVkZ2VQb2ludC54LCBlZGdlUG9pbnQueSk7XG59OyAvLyBkcmF3UmF5XG5cblxuZXhwb3J0cy5kcmF3U2VnbWVudCA9IGZ1bmN0aW9uKGRyYXdlciwgc2VnbWVudCkge1xuICBjb25zdCBzdGFydCA9IHNlZ21lbnQucmF5LnN0YXJ0O1xuICBjb25zdCBlbmQgPSBzZWdtZW50LmVuZFBvaW50KCk7XG4gIGRyYXdlci5wNS5saW5lKFxuICAgIHN0YXJ0LngsIHN0YXJ0LnksXG4gICAgZW5kLngsICAgZW5kLnkpO1xufTsgLy8gZHJhd1NlZ21lbnRcblxuXG5leHBvcnRzLmRyYXdBcmMgPSBmdW5jdGlvbihkcmF3ZXIsIGFyYykge1xuICBpZiAoYXJjLmlzQ2lyY2xlKCkpIHtcbiAgICBsZXQgc3RhcnRSYWQgPSBhcmMuc3RhcnQucmFkaWFucygpO1xuICAgIGxldCBlbmRSYWQgPSBzdGFydFJhZCArIFJhYy5UQVU7XG4gICAgZHJhd2VyLnA1LmFyYyhcbiAgICAgIGFyYy5jZW50ZXIueCwgYXJjLmNlbnRlci55LFxuICAgICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgICAgc3RhcnRSYWQsIGVuZFJhZCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHN0YXJ0ID0gYXJjLnN0YXJ0O1xuICBsZXQgZW5kID0gYXJjLmVuZDtcbiAgaWYgKCFhcmMuY2xvY2t3aXNlKSB7XG4gICAgc3RhcnQgPSBhcmMuZW5kO1xuICAgIGVuZCA9IGFyYy5zdGFydDtcbiAgfVxuXG4gIGRyYXdlci5wNS5hcmMoXG4gICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgYXJjLnJhZGl1cyAqIDIsIGFyYy5yYWRpdXMgKiAyLFxuICAgIHN0YXJ0LnJhZGlhbnMoKSwgZW5kLnJhZGlhbnMoKSk7XG59OyAvLyBkcmF3QXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBDb2xvciB3aXRoIFJCR0EgdmFsdWVzLCBlYWNoIG9uZSBvbiB0aGUgKlswLDFdKiByYW5nZS5cbipcbiogQGFsaWFzIFJhYy5Db2xvclxuKi9cbmNsYXNzIENvbG9yIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IFthPTFdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMV0qIHJhbmdlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgciwgZywgYiwgYSA9IDEpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCByLCBnLCBiLCBhKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIociwgZywgYiwgYSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIHJlZCBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5yID0gcjtcblxuICAgIC8qKlxuICAgICogVGhlIGdyZWVuIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmcgPSBnO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYmx1ZSBjaGFubmVsIG9mIHRoZSBjb2xvciwgaW4gdGhlICpbMCwxXSogcmFuZ2UuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5iID0gYjtcblxuICAgIC8qKlxuICAgICogVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmEgPSBhO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgQ29sb3IoJHt0aGlzLnJ9LCR7dGhpcy5nfSwke3RoaXMuYn0sJHt0aGlzLmF9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSB3aXRoIGVhY2ggY2hhbm5lbCByZWNlaXZlZCBpbiB0aGVcbiAgKiAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gW2E9MjU1XSAtIFRoZSBhbHBoYSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBzdGF0aWMgZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhID0gMjU1KSB7XG4gICAgcmV0dXJuIG5ldyBDb2xvcihyYWMsIHIvMjU1LCBnLzI1NSwgYi8yNTUsIGEvMjU1KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlIGZyb20gYSBoZXhhZGVjaW1hbCB0cmlwbGV0IHN0cmluZy5cbiAgKlxuICAqIFRoZSBgaGV4U3RyaW5nYCBpcyBleHBlY3RlZCB0byBoYXZlIDYgZGlnaXRzIGFuZCBjYW4gb3B0aW9uYWxseSBzdGFydFxuICAqIHdpdGggYCNgLiBgQUFCQkNDYCBhbmQgYCNEREVFRkZgIGFyZSBib3RoIHZhbGlkIGlucHV0cywgdGhlIHRocmVlIGRpZ2l0XG4gICogc2hvcnRoYW5kIGlzIG5vdCB5ZXQgc3VwcG9ydGVkLlxuICAqXG4gICogQW4gZXJyb3IgaXMgdGhyb3duIGlmIGBoZXhTdHJpbmdgIGlzIG1pc2Zvcm1hdHRlZCBvciBjYW5ub3QgYmUgcGFyc2VkLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHJpbmcgLSBUaGUgUkdCIGhleCB0cmlwbGV0IHRvIGludGVycHJldFxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgc3RhdGljIGZyb21IZXgocmFjLCBoZXhTdHJpbmcpIHtcbiAgICBpZiAoaGV4U3RyaW5nLmNoYXJBdCgwKSA9PSAnIycpIHtcbiAgICAgIGhleFN0cmluZyA9IGhleFN0cmluZy5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgaWYgKGhleFN0cmluZy5sZW5ndGggIT0gNikge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBVbmV4cGVjdGVkIGxlbmd0aCBmb3IgaGV4IHRyaXBsZXQgc3RyaW5nOiAke2hleFN0cmluZ31gKTtcbiAgICB9XG5cbiAgICBsZXQgclN0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoMCwgMik7XG4gICAgbGV0IGdTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDIsIDQpO1xuICAgIGxldCBiU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZyg0LCA2KTtcblxuICAgIGxldCBuZXdSID0gcGFyc2VJbnQoclN0ciwgMTYpO1xuICAgIGxldCBuZXdHID0gcGFyc2VJbnQoZ1N0ciwgMTYpO1xuICAgIGxldCBuZXdCID0gcGFyc2VJbnQoYlN0ciwgMTYpO1xuXG4gICAgaWYgKGlzTmFOKG5ld1IpIHx8IGlzTmFOKG5ld0cpIHx8IGlzTmFOKG5ld0IpKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYENvdWxkIG5vdCBwYXJzZSBoZXggdHJpcGxldCBzdHJpbmc6ICR7aGV4U3RyaW5nfWApO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQ29sb3IocmFjLCBuZXdSLzI1NSwgbmV3Ry8yNTUsIG5ld0IvMjU1KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgRmlsbGAgdGhhdCB1c2VzIGB0aGlzYCBhcyBgY29sb3JgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBmaWxsKCkge1xuICAgIHJldHVybiBuZXcgUmFjLkZpbGwodGhpcy5yYWMsIHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgdXNlcyBgdGhpc2AgYXMgYGNvbG9yYC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gd2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgbmV3IGBTdHJva2VgXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0cm9rZSh3ZWlnaHQgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMucmFjLCB3ZWlnaHQsIHRoaXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBgYWAgc2V0IHRvIGBuZXdBbHBoYWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3QWxwaGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBmb3IgdGhlIG5ldyBgQ29sb3JgLCBpbiB0aGVcbiAgKiAgICpbMCwxXSogcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICB3aXRoQWxwaGEobmV3QWxwaGEpIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCBuZXdBbHBoYSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGBhYCBzZXQgdG8gYHRoaXMuYSAqIHJhdGlvYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGFgIGJ5XG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgd2l0aEFscGhhUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iLCB0aGlzLmEgKiByYXRpbyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCBpbiB0aGUgbGluZWFyIHRyYW5zaXRpb24gYmV0d2VlbiBgdGhpc2AgYW5kXG4gICogYHRhcmdldGAgYXQgYSBgcmF0aW9gIGluIHRoZSByYW5nZSAqWzAsMV0qLlxuICAqXG4gICogV2hlbiBgcmF0aW9gIGlzIGAwYCBvciBsZXNzIHRoZSBuZXcgYENvbG9yYCBpcyBlcXVpdmFsZW50IHRvIGB0aGlzYCxcbiAgKiB3aGVuIGByYXRpb2AgaXMgYDFgIG9yIGxhcmdlciB0aGUgbmV3IGBDb2xvcmAgaXMgZXF1aXZhbGVudCB0b1xuICAqIGB0YXJnZXRgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIHRyYW5zaXRpb24gcmF0aW8gZm9yIHRoZSBuZXcgYENvbG9yYFxuICAqIEBwYXJhbSB7UmFjLkNvbG9yfSB0YXJnZXQgLSBUaGUgdHJhbnNpdGlvbiB0YXJnZXQgYENvbG9yYFxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIGxpbmVhclRyYW5zaXRpb24ocmF0aW8sIHRhcmdldCkge1xuICAgIHJhdGlvID0gTWF0aC5tYXgocmF0aW8sIDApO1xuICAgIHJhdGlvID0gTWF0aC5taW4ocmF0aW8sIDEpO1xuXG4gICAgbGV0IG5ld1IgPSB0aGlzLnIgKyAodGFyZ2V0LnIgLSB0aGlzLnIpICogcmF0aW87XG4gICAgbGV0IG5ld0cgPSB0aGlzLmcgKyAodGFyZ2V0LmcgLSB0aGlzLmcpICogcmF0aW87XG4gICAgbGV0IG5ld0IgPSB0aGlzLmIgKyAodGFyZ2V0LmIgLSB0aGlzLmIpICogcmF0aW87XG4gICAgbGV0IG5ld0EgPSB0aGlzLmEgKyAodGFyZ2V0LmEgLSB0aGlzLmEpICogcmF0aW87XG5cbiAgICByZXR1cm4gbmV3IENvbG9yKHRoaXMucmFjLCBuZXdSLCBuZXdHLCBuZXdCLCBuZXdBKTtcbiAgfVxuXG59IC8vIGNsYXNzIENvbG9yXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcblxuIiwiICAndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRmlsbCBbY29sb3Jde0BsaW5rIFJhYy5Db2xvcn0gZm9yIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBmaWxsLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBmaWxsIHNldHRpbmdzIGdsb2JhbGx5LCBvciBhc1xuKiB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KGZpbGwpYCB0byBhcHBseSB0aGUgZmlsbCBvbmx5IGZvciB0aGF0XG4qIGBkcmF3YC5cbipcbiogV2hlbiBgY29sb3JgIGlzIGBudWxsYCBhICpuby1maWxsKiBzZXR0aW5nIGlzIGFwcGxpZWQuXG4qXG4qIEBhbGlhcyBSYWMuRmlsbFxuKi9cbmNsYXNzIEZpbGwge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZpbGxgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gY29sb3IgLSBBIGBDb2xvcmAgZm9yIHRoZSBmaWxsIHNldHRpbmcsIG9yIGBudWxsYFxuICAqICAgdG8gYXBwbHkgYSAqbm8tZmlsbCogc2V0dGluZ1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIGNvbG9yKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgY29sb3IgIT09IG51bGwgJiYgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQ29sb3IsIGNvbG9yKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBGaWxsYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIHRoYXQgc2FtZSBvYmplY3QuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBDb2xvcmAsIHJldHVybnMgYSBuZXcgYEZpbGxgXG4gICogICB1c2luZyBgc29tZXRoaW5nYCBhcyBgY29sb3JgLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgU3Ryb2tlYCwgcmV0dXJucyBhIG5ldyBgRmlsbGBcbiAgKiAgIHVzaW5nIGBzdHJva2UuY29sb3JgLlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkZpbGx8UmFjLkNvbG9yfFJhYy5TdHJva2V9IHNvbWV0aGluZyAtIEFuIG9iamVjdCB0b1xuICAqIGRlcml2ZSBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5GaWxsfVxuICAqL1xuICBzdGF0aWMgZnJvbShyYWMsIHNvbWV0aGluZykge1xuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBGaWxsKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkNvbG9yKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGwocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlN0cm9rZSkge1xuICAgICAgcmV0dXJuIG5ldyBGaWxsKHJhYywgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkZpbGwgLSBzb21ldGhpbmctdHlwZToke3V0aWxzLnR5cGVOYW1lKHNvbWV0aGluZyl9YCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIG9ubHkgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpc10pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIGBzdHlsZWAuIFdoZW5cbiAgKiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBjb250YWluIGFsb25nIGB0aGlzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ8UmFjLkZpbGx9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgU3Ryb2tlYFxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5TdHJva2UuZnJvbX0gYHNvbWVTdHJva2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZVN0cm9rZSAtIEFuIG9iamVjdCB0byBkZXJpdmVcbiAgKiAgIGEgYFN0cm9rZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICpcbiAgKiBAc2VlIFJhYy5TdHJva2UuZnJvbVxuICAqL1xuICBhcHBlbmRTdHJva2Uoc29tZVN0cm9rZSkge1xuICAgIGxldCBzdHJva2UgPSBSYWMuU3Ryb2tlLmZyb20odGhpcy5yYWMsIHNvbWVTdHJva2UpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpcywgc3Ryb2tlXSk7XG4gIH1cblxufSAvLyBjbGFzcyBGaWxsXG5cblxubW9kdWxlLmV4cG9ydHMgPSBGaWxsO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogU3Ryb2tlIHdlaWdodCBhbmQgW2NvbG9yXXtAbGluayBSYWMuQ29sb3J9IGZvciBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgc3Ryb2tlLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBzdHJva2Ugc2V0dGluZ3MgZ2xvYmFsbHksIG9yXG4qIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoc3Ryb2tlKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBvbmx5IGZvclxuKiB0aGF0IGBkcmF3YC5cbipcbiogVGhlIGluc3RhbmNlIGFwcGxpZXMgdGhlIHN0cm9rZSBjb2xvciBhbmQgd2VpZ2h0IHNldHRpbmdzIGluIHRoZVxuKiBmb2xsb3dpbmcgY29tYmluYXRpb25zOlxuKiArIHdoZW4gYGNvbG9yID0gbnVsbGAgYW5kIGB3ZWlnaHQgPSBudWxsYDogYSAqbm8tc3Ryb2tlKiBzZXR0aW5nIGlzXG4qICAgYXBwbGllZFxuKiArIHdoZW4gYGNvbG9yYCBpcyBzZXQgYW5kIGB3ZWlnaHQgPSBudWxsYDogb25seSB0aGUgc3Ryb2tlIGNvbG9yIGlzXG4qICAgYXBwbGllZCwgc3Ryb2tlIHdlaWdodCBpcyBub3QgbW9kaWZpZWRcbiogKyB3aGVuIGB3ZWlnaHRgIGlzIHNldCBhbmQgYGNvbG9yID0gbnVsbGA6IG9ubHkgdGhlIHN0cm9rZSB3ZWlnaHQgaXNcbiogICBhcHBsaWVkLCBzdHJva2UgY29sb3IgaXMgbm90IG1vZGlmaWVkXG4qICsgd2hlbiBib3RoIGBjb2xvcmAgYW5kIGB3ZWlnaHRgIGFyZSBzZXQ6IGJvdGggc3Ryb2tlIGNvbG9yIGFuZCB3ZWlnaHRcbiogICBhcmUgYXBwbGllZFxuKlxuKiBAYWxpYXMgUmFjLlN0cm9rZVxuKi9cbmNsYXNzIFN0cm9rZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU3Ryb2tlYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSAgSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/bnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwIHdlaWdodFxuICAqIEBwYXJhbSB7P1JhYy5Db2xvcn0gW2NvbG9yPW51bGxdIC0gQSBgQ29sb3JgIGZvciB0aGUgc3Ryb2tlLCBvciBgbnVsbGBcbiAgKiAgIHRvIHNraXAgY29sb3JcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB3ZWlnaHQsIGNvbG9yID0gbnVsbCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHdlaWdodCAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnROdW1iZXIod2VpZ2h0KTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWNcbiAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy53ZWlnaHQgPSB3ZWlnaHQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU3Ryb2tlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYFN0cm9rZWAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgU3Ryb2tlYFxuICAqICAgdXNpbmcgYHNvbWV0aGluZ2AgYXMgYGNvbG9yYCBhbmQgYSBgbnVsbGAgc3Ryb2tlIHdlaWdodC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEZpbGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgXG4gICogICB1c2luZyBgZmlsbC5jb2xvcmAgYW5kIGEgYG51bGxgIHN0cm9rZSB3ZWlnaHQuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuU3Ryb2tlfFJhYy5Db2xvcnxSYWMuRmlsbH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogICBkZXJpdmUgYSBgU3Ryb2tlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFN0cm9rZSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZztcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5Db2xvcikge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkZpbGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHJhYywgbnVsbCwgc29tZXRoaW5nLmNvbG9yKTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLlN0cm9rZSAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHRgIHNldCB0byBgbmV3V2VpZ2h0YC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gbmV3V2VpZ2h0IC0gVGhlIHdlaWdodCBvZiB0aGUgc3Ryb2tlLCBvciBgbnVsbGAgdG8gc2tpcFxuICAqICAgd2VpZ2h0XG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICovXG4gIHdpdGhXZWlnaHQobmV3V2VpZ2h0KSB7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIG5ld1dlaWdodCwgdGhpcy5jb2xvciwpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYSBjb3B5IG9mIGBjb2xvcmAgc2V0dXAgd2l0aCBgbmV3QWxwaGFgLFxuICAqIGFuZCB0aGUgc2FtZSBgc3Ryb2tlYCBhcyBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGB0aGlzLmNvbG9yYCBpcyBzZXQgdG8gYG51bGxgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgIHRoYXQgaXMgYVxuICAqIGNvcHkgb2YgYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld0FscGhhIC0gVGhlIGFscGhhIGNoYW5uZWwgb2YgdGhlIGBjb2xvcmAgb2YgdGhlIG5ld1xuICAqICAgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aEFscGhhKG5ld0FscGhhKSB7XG4gICAgaWYgKHRoaXMuY29sb3IgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbnVsbCk7XG4gICAgfVxuXG4gICAgbGV0IG5ld0NvbG9yID0gdGhpcy5jb2xvci53aXRoQWxwaGEobmV3QWxwaGEpO1xuICAgIHJldHVybiBuZXcgU3Ryb2tlKHRoaXMucmFjLCB0aGlzLndlaWdodCwgbmV3Q29sb3IpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBvbmx5IGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXNdKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgYHRoaXNgIGFuZCBgc3R5bGVgLiBXaGVuXG4gICogYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gY29udGFpbiBhbG9uZyBgdGhpc2BcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfFJhYy5TdHJva2V9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHlsZV0pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIHRoZSBgRmlsbGBcbiAgKiBkZXJpdmVkIFtmcm9tXXtAbGluayBSYWMuRmlsbC5mcm9tfSBgc29tZUZpbGxgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZUZpbGwgLSBBbiBvYmplY3QgdG8gZGVyaXZlXG4gICogICBhIGBGaWxsYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKlxuICAqIEBzZWUgUmFjLkZpbGwuZnJvbVxuICAqL1xuICBhcHBlbmRGaWxsKHNvbWVGaWxsKSB7XG4gICAgbGV0IGZpbGwgPSBSYWMuRmlsbC5mcm9tKHRoaXMucmFjLCBzb21lRmlsbCk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBmaWxsXSk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHJva2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cm9rZTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBgW1N0cm9rZV17QGxpbmsgUmFjLlN0cm9rZX1gIGFuZCBgW0ZpbGxde0BsaW5rIFJhYy5GaWxsfWBcbiogb2JqZWN0cyB3aGljaCBnZXQgYXBwbGllZCBzZXF1ZW50aWFsbHkgd2hlbiBkcmF3aW5nLlxuKlxuKiBDYW4gYmUgdXNlZCBhcyBgY29udGFpbmVyLmFwcGx5KClgIHRvIGFwcGx5IHRoZSBjb250YWluZWQgc3R5bGVzXG4qIGdsb2JhbGx5LCBvciBhcyB0aGUgcGFyYW1ldGVyIG9mIGBkcmF3YWJsZS5kcmF3KGNvbnRhaW5lcilgIHRvIGFwcGx5IHRoZVxuKiBzdHlsZSBzZXR0aW5ncyBvbmx5IGZvciB0aGF0IGBkcmF3YC5cbipcbiogQGFsaWFzIFJhYy5TdHlsZUNvbnRhaW5lclxuKi9cbmNsYXNzIFN0eWxlQ29udGFpbmVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0eWxlcyA9IFtdKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogQ29udGFpbmVyIG9mIHN0eWxlIG9iamVjdHMgdG8gYXBwbHkuXG4gICAgKlxuICAgICogQ2FuIGJlIG1hbmlwdWxhdGVkIGRpcmVjdGx5IHRvIGFkZCBvciByZW1vdmUgc3R5bGVzIGZyb20gYHRoaXNgLlxuICAgICogTW9zdCBvZiB0aGUgaW1wbGVtZW50ZWQgbWV0aG9kcyBsaWtlXG4gICAgKiBgW2FkZF17QGxpbmsgUmFjLlN0eWxlQ29udGFpbmVyI2FkZH1gIHJldHVybiBhIG5ldyBgU3R5bGVDb250YWluZXJgXG4gICAgKiB3aXRoIGFuIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgKi9cbiAgICB0aGlzLnN0eWxlcyA9IHN0eWxlcztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICBsZXQgY29udGVudHMgPSB0aGlzLnN0eWxlcy5qb2luKCcgJyk7XG4gICAgcmV0dXJuIGBTdHlsZUNvbnRhaW5lcigke2NvbnRlbnRzfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBhIGNvcHkgb2YgYHRoaXMuc3R5bGVzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGNvbnRhaW5lcigpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgdGhpcy5zdHlsZXMuc2xpY2UoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCB3aXRoIGBzdHlsZWAgYXBwZW5kZWQgYXQgdGhlIGVuZCBvZlxuICAqIGBzdHlsZXNgLiBXaGVuIGBzdHlsZWAgaXMgYG51bGxgLCByZXR1cm5zIGB0aGlzYCBpbnN0ZWFkLlxuICAqXG4gICogYHRoaXNgIGlzIG5vdCBtb2RpZmllZCBieSB0aGlzIG1ldGhvZCwgdGhlIG5ldyBgU3R5bGVDb250YWluZXJgIGlzXG4gICogY3JlYXRlZCB3aXRoIGEgY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IHN0eWxlIC0gQSBzdHlsZSBvYmplY3RcbiAgKiAgIHRvIGFwcGVuZCB0byBgc3R5bGVzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ9XG4gICovXG4gIGFwcGVuZFN0eWxlKHN0eWxlKSB7XG4gICAgaWYgKHN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBsZXQgc3R5bGVzQ29weSA9IHRoaXMuc3R5bGVzLnNsaWNlKCk7XG4gICAgc3R5bGVzQ29weS5wdXNoKHN0eWxlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgc3R5bGVzQ29weSk7XG4gIH1cblxufSAvLyBjbGFzcyBTdHlsZUNvbnRhaW5lclxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3R5bGVDb250YWluZXI7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5Db2xvcmAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQ29sb3J9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Db2xvclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjQ29sb3IocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgd2l0aCBlYWNoIGNoYW5uZWwgcmVjZWl2ZWQgaW4gdGhlICpbMCwyNTVdKiByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBbYT0yNTVdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJnYmFcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5mcm9tUmdiYSA9IGZ1bmN0aW9uKHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gUmFjLkNvbG9yLmZyb21SZ2JhKHJhYywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UgZnJvbSBhIGhleGFkZWNpbWFsIHRyaXBsZXQgc3RyaW5nLlxuICAqXG4gICogVGhlIGBoZXhTdHJpbmdgIGlzIGV4cGVjdGVkIHRvIGhhdmUgNiBkaWdpdHMgYW5kIGNhbiBvcHRpb25hbGx5IHN0YXJ0XG4gICogd2l0aCBgI2AuIGBBQUJCQ0NgIGFuZCBgI0RERUVGRmAgYXJlIGJvdGggdmFsaWQgaW5wdXRzLCB0aGUgdGhyZWUgZGlnaXRcbiAgKiBzaG9ydGhhbmQgaXMgbm90IHlldCBzdXBwb3J0ZWQuXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGhleFN0cmluZ2AgaXMgbWlzZm9ybWF0dGVkIG9yIGNhbm5vdCBiZSBwYXJzZWQuXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyaW5nIC0gVGhlIFJHQiBoZXggdHJpcGxldCB0byBpbnRlcnByZXRcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICByYWMuQ29sb3IuZnJvbUhleCA9IGZ1bmN0aW9uKGhleFN0cmluZykge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbUhleChyYWMsIGhleFN0cmluZyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIEEgYmxhY2sgYENvbG9yYC5cbiAgKlxuICAqIEBuYW1lIGJsYWNrXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IuYmxhY2sgICA9IHJhYy5Db2xvcigwLCAwLCAwKTtcblxuICAvKipcbiAgKiBBIHJlZCBgQ29sb3JgLlxuICAqXG4gICogQG5hbWUgcmVkXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkNvbG9yI1xuICAqL1xuICByYWMuQ29sb3IucmVkICAgICA9IHJhYy5Db2xvcigxLCAwLCAwKTtcblxuICByYWMuQ29sb3IuZ3JlZW4gICA9IHJhYy5Db2xvcigwLCAxLCAwKTtcbiAgcmFjLkNvbG9yLmJsdWUgICAgPSByYWMuQ29sb3IoMCwgMCwgMSk7XG4gIHJhYy5Db2xvci55ZWxsb3cgID0gcmFjLkNvbG9yKDEsIDEsIDApO1xuICByYWMuQ29sb3IubWFnZW50YSA9IHJhYy5Db2xvcigxLCAwLCAxKTtcbiAgcmFjLkNvbG9yLmN5YW4gICAgPSByYWMuQ29sb3IoMCwgMSwgMSk7XG4gIHJhYy5Db2xvci53aGl0ZSAgID0gcmFjLkNvbG9yKDEsIDEsIDEpO1xuXG59IC8vIGF0dGFjaFJhY0NvbG9yXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5GaWxsYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5GaWxsfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuRmlsbFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjRmlsbChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBGaWxsYCB3aXRob3V0IGNvbG9yLiBSZW1vdmVzIHRoZSBmaWxsIGNvbG9yIHdoZW4gYXBwbGllZC5cbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkZpbGwjXG4gICovXG4gIHJhYy5GaWxsLm5vbmUgPSByYWMuRmlsbChudWxsKTtcblxufSAvLyBhdHRhY2hSYWNGaWxsXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5TdHJva2VgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLlN0cm9rZX1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlN0cm9rZVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU3Ryb2tlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYFN0cm9rZWAgd2l0aCBubyB3ZWlnaHQgYW5kIG5vIGNvbG9yLiBVc2luZyBvciBhcHBseWluZyB0aGlzIHN0cm9rZVxuICAqIHdpbGwgZGlzYWJsZSBzdHJva2UgZHJhd2luZy5cbiAgKlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU3Ryb2tlI1xuICAqL1xuICByYWMuU3Ryb2tlLm5vbmUgPSByYWMuU3Ryb2tlKG51bGwpO1xuXG5cbiAgLyoqXG4gICogQSBgU3Ryb2tlYCB3aXRoIGB3ZWlnaHRgIG9mIGAxYCBhbmQgbm8gY29sb3IuIFVzaW5nIG9yIGFwcGx5aW5nIHRoaXNcbiAgKiBzdHJva2Ugd2lsbCBvbmx5IHNldCB0aGUgc3Ryb2tlIHdlaWdodCB0byBgMWAuXG4gICpcbiAgKiBAbmFtZSBvbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuU3Ryb2tlI1xuICAqL1xuICByYWMuU3Ryb2tlLm9uZSA9IHJhYy5TdHJva2UoMSk7XG5cbn0gLy8gYXR0YWNoUmFjU3Ryb2tlXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8vIEltcGxlbWVudGF0aW9uIG9mIGFuIGVhc2UgZnVuY3Rpb24gd2l0aCBzZXZlcmFsIG9wdGlvbnMgdG8gdGFpbG9yIGl0c1xuLy8gYmVoYXZpb3VyLiBUaGUgY2FsY3VsYXRpb24gdGFrZXMgdGhlIGZvbGxvd2luZyBzdGVwczpcbi8vIFZhbHVlIGlzIHJlY2VpdmVkLCBwcmVmaXggaXMgcmVtb3ZlZFxuLy8gICBWYWx1ZSAtPiBlYXNlVmFsdWUodmFsdWUpXG4vLyAgICAgdmFsdWUgPSB2YWx1ZSAtIHByZWZpeFxuLy8gUmF0aW8gaXMgY2FsY3VsYXRlZFxuLy8gICByYXRpbyA9IHZhbHVlIC8gaW5SYW5nZVxuLy8gUmF0aW8gaXMgYWRqdXN0ZWRcbi8vICAgcmF0aW8gLT4gZWFzZVJhdGlvKHJhdGlvKVxuLy8gICAgIGFkanVzdGVkUmF0aW8gPSAocmF0aW8gKyByYXRpb09mc2V0KSAqIHJhdGlvRmFjdG9yXG4vLyBFYXNlIGlzIGNhbGN1bGF0ZWRcbi8vICAgZWFzZWRSYXRpbyA9IGVhc2VVbml0KGFkanVzdGVkUmF0aW8pXG4vLyBFYXNlZFJhdGlvIGlzIGFkanVzdGVkIGFuZCByZXR1cm5lZFxuLy8gICBlYXNlZFJhdGlvID0gKGVhc2VkUmF0aW8gKyBlYXNlT2ZzZXQpICogZWFzZUZhY3RvclxuLy8gICBlYXNlUmF0aW8ocmF0aW8pIC0+IGVhc2VkUmF0aW9cbi8vIFZhbHVlIGlzIHByb2plY3RlZFxuLy8gICBlYXNlZFZhbHVlID0gdmFsdWUgKiBlYXNlZFJhdGlvXG4vLyBWYWx1ZSBpcyBhZGp1c3RlZCBhbmQgcmV0dXJuZWRcbi8vICAgZWFzZWRWYWx1ZSA9IHByZWZpeCArIChlYXNlZFZhbHVlICogb3V0UmFuZ2UpXG4vLyAgIGVhc2VWYWx1ZSh2YWx1ZSkgLT4gZWFzZWRWYWx1ZVxuY2xhc3MgRWFzZUZ1bmN0aW9uIHtcblxuICAvLyBCZWhhdmlvcnMgZm9yIHRoZSBgZWFzZVZhbHVlYCBmdW5jdGlvbiB3aGVuIGB2YWx1ZWAgZmFsbHMgYmVmb3JlIHRoZVxuICAvLyBgcHJlZml4YCBhbmQgYWZ0ZXIgYGluUmFuZ2VgLlxuICBzdGF0aWMgQmVoYXZpb3IgPSB7XG4gICAgLy8gYHZhbHVlYCBpcyByZXR1cm5lZCB3aXRob3V0IGFueSBlYXNpbmcgdHJhbnNmb3JtYXRpb24uIGBwcmVGYWN0b3JgXG4gICAgLy8gYW5kIGBwb3N0RmFjdG9yYCBhcmUgYXBwbGllZC4gVGhpcyBpcyB0aGUgZGVmYXVsdCBjb25maWd1cmF0aW9uLlxuICAgIHBhc3M6IFwicGFzc1wiLFxuICAgIC8vIENsYW1wcyB0aGUgcmV0dXJuZWQgdmFsdWUgdG8gYHByZWZpeGAgb3IgYHByZWZpeCtpblJhbmdlYDtcbiAgICBjbGFtcDogXCJjbGFtcFwiLFxuICAgIC8vIFJldHVybnMgdGhlIGFwcGxpZWQgZWFzaW5nIHRyYW5zZm9ybWF0aW9uIHRvIGB2YWx1ZWAgZm9yIHZhbHVlc1xuICAgIC8vIGJlZm9yZSBgcHJlZml4YCBhbmQgYWZ0ZXIgYGluUmFuZ2VgLlxuICAgIGNvbnRpbnVlOiBcImNvbnRpbnVlXCJcbiAgfTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmEgPSAyO1xuXG4gICAgLy8gQXBwbGllZCB0byByYXRpbyBiZWZvcmUgZWFzaW5nLlxuICAgIHRoaXMucmF0aW9PZmZzZXQgPSAwXG4gICAgdGhpcy5yYXRpb0ZhY3RvciA9IDE7XG5cbiAgICAvLyBBcHBsaWVkIHRvIGVhc2VkUmF0aW8uXG4gICAgdGhpcy5lYXNlT2Zmc2V0ID0gMFxuICAgIHRoaXMuZWFzZUZhY3RvciA9IDE7XG5cbiAgICAvLyBEZWZpbmVzIHRoZSBsb3dlciBsaW1pdCBvZiBgdmFsdWVgYCB0byBhcHBseSBlYXNpbmcuXG4gICAgdGhpcy5wcmVmaXggPSAwO1xuXG4gICAgLy8gYHZhbHVlYCBpcyByZWNlaXZlZCBpbiBgaW5SYW5nZWAgYW5kIG91dHB1dCBpbiBgb3V0UmFuZ2VgLlxuICAgIHRoaXMuaW5SYW5nZSA9IDE7XG4gICAgdGhpcy5vdXRSYW5nZSA9IDE7XG5cbiAgICAvLyBCZWhhdmlvciBmb3IgdmFsdWVzIGJlZm9yZSBgcHJlZml4YC5cbiAgICB0aGlzLnByZUJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLnBhc3M7XG4gICAgLy8gQmVoYXZpb3IgZm9yIHZhbHVlcyBhZnRlciBgcHJlZml4K2luUmFuZ2VgLlxuICAgIHRoaXMucG9zdEJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yLnBhc3M7XG5cbiAgICAvLyBGb3IgYSBgcHJlQmVoYXZpb3JgIG9mIGBwYXNzYCwgdGhlIGZhY3RvciBhcHBsaWVkIHRvIHZhbHVlcyBiZWZvcmVcbiAgICAvLyBgcHJlZml4YC5cbiAgICB0aGlzLnByZUZhY3RvciA9IDE7XG4gICAgLy8gRm9yIGEgYHBvc3RCZWhhdmlvcmAgb2YgYHBhc3NgLCB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gdGhlIHZhbHVlc1xuICAgIC8vIGFmdGVyIGBwcmVmaXgraW5SYW5nZWAuXG4gICAgdGhpcy5wb3N0RmFjdG9yID0gMTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgZWFzZWQgdmFsdWUgZm9yIGB1bml0YC4gQm90aCB0aGUgZ2l2ZW5cbiAgLy8gYHVuaXRgIGFuZCB0aGUgcmV0dXJuZWQgdmFsdWUgYXJlIGluIHRoZSBbMCwxXSByYW5nZS4gSWYgYHVuaXRgIGlzXG4gIC8vIG91dHNpZGUgdGhlIFswLDFdIHRoZSByZXR1cm5lZCB2YWx1ZSBmb2xsb3dzIHRoZSBjdXJ2ZSBvZiB0aGUgZWFzaW5nXG4gIC8vIGZ1bmN0aW9uLCB3aGljaCBtYXkgYmUgaW52YWxpZCBmb3Igc29tZSB2YWx1ZXMgb2YgYGFgLlxuICAvL1xuICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHRoZSBiYXNlIGVhc2luZyBmdW5jdGlvbiwgaXQgZG9lcyBub3QgYXBwbHkgYW55XG4gIC8vIG9mZnNldHMgb3IgZmFjdG9ycy5cbiAgZWFzZVVuaXQodW5pdCkge1xuICAgIC8vIFNvdXJjZTpcbiAgICAvLyBodHRwczovL21hdGguc3RhY2tleGNoYW5nZS5jb20vcXVlc3Rpb25zLzEyMTcyMC9lYXNlLWluLW91dC1mdW5jdGlvbi8xMjE3NTUjMTIxNzU1XG4gICAgLy8gZih0KSA9ICh0XmEpLyh0XmErKDEtdCleYSlcbiAgICBsZXQgcmEgPSBNYXRoLnBvdyh1bml0LCB0aGlzLmEpO1xuICAgIGxldCBpcmEgPSBNYXRoLnBvdygxLXVuaXQsIHRoaXMuYSk7XG4gICAgcmV0dXJuIHJhIC8gKHJhICsgaXJhKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIGVhc2UgZnVuY3Rpb24gYXBwbGllZCB0byB0aGUgZ2l2ZW4gcmF0aW8uIGByYXRpb09mZnNldGBcbiAgLy8gYW5kIGByYXRpb0ZhY3RvcmAgYXJlIGFwcGxpZWQgdG8gdGhlIGlucHV0LCBgZWFzZU9mZnNldGAgYW5kXG4gIC8vIGBlYXNlRmFjdG9yYCBhcmUgYXBwbGllZCB0byB0aGUgb3V0cHV0LlxuICBlYXNlUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgYWRqdXN0ZWRSYXRpbyA9IChyYXRpbyArIHRoaXMucmF0aW9PZmZzZXQpICogdGhpcy5yYXRpb0ZhY3RvcjtcbiAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVVuaXQoYWRqdXN0ZWRSYXRpbyk7XG4gICAgcmV0dXJuIChlYXNlZFJhdGlvICsgdGhpcy5lYXNlT2Zmc2V0KSAqIHRoaXMuZWFzZUZhY3RvcjtcbiAgfVxuXG4gIC8vIEFwcGxpZXMgdGhlIGVhc2luZyBmdW5jdGlvbiB0byBgdmFsdWVgIGNvbnNpZGVyaW5nIHRoZSBjb25maWd1cmF0aW9uXG4gIC8vIG9mIHRoZSB3aG9sZSBpbnN0YW5jZS5cbiAgZWFzZVZhbHVlKHZhbHVlKSB7XG4gICAgbGV0IGJlaGF2aW9yID0gRWFzZUZ1bmN0aW9uLkJlaGF2aW9yO1xuXG4gICAgbGV0IHNoaWZ0ZWRWYWx1ZSA9IHZhbHVlIC0gdGhpcy5wcmVmaXg7XG4gICAgbGV0IHJhdGlvID0gc2hpZnRlZFZhbHVlIC8gdGhpcy5pblJhbmdlO1xuXG4gICAgLy8gQmVmb3JlIHByZWZpeFxuICAgIGlmICh2YWx1ZSA8IHRoaXMucHJlZml4KSB7XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IucGFzcykge1xuICAgICAgICBsZXQgZGlzdGFuY2V0b1ByZWZpeCA9IHZhbHVlIC0gdGhpcy5wcmVmaXg7XG4gICAgICAgIC8vIFdpdGggYSBwcmVGYWN0b3Igb2YgMSB0aGlzIGlzIGVxdWl2YWxlbnQgdG8gYHJldHVybiByYW5nZWBcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgKGRpc3RhbmNldG9QcmVmaXggKiB0aGlzLnByZUZhY3Rvcik7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcmVCZWhhdmlvciA9PT0gYmVoYXZpb3IuY2xhbXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLmNvbnRpbnVlKSB7XG4gICAgICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlUmF0aW8ocmF0aW8pO1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBlYXNlZFJhdGlvICogdGhpcy5vdXRSYW5nZTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS50cmFjZShgSW52YWxpZCBwcmVCZWhhdmlvciBjb25maWd1cmF0aW9uIC0gcHJlQmVoYXZpb3I6JHt0aGlzLnBvc3RCZWhhdmlvcn1gKTtcbiAgICAgIHRocm93IHJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICAvLyBBZnRlciBwcmVmaXhcbiAgICBpZiAocmF0aW8gPD0gMSB8fCB0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IuY29udGludWUpIHtcbiAgICAgIC8vIEVhc2UgZnVuY3Rpb24gYXBwbGllZCB3aXRoaW4gcmFuZ2UgKG9yIGFmdGVyKVxuICAgICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VSYXRpbyhyYXRpbyk7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyBlYXNlZFJhdGlvICogdGhpcy5vdXRSYW5nZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5wYXNzKSB7XG4gICAgICAvLyBTaGlmdGVkIHRvIGhhdmUgaW5SYW5nZSBhcyBvcmlnaW5cbiAgICAgIGxldCBzaGlmdGVkUG9zdCA9IHNoaWZ0ZWRWYWx1ZSAtIHRoaXMuaW5SYW5nZTtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMub3V0UmFuZ2UgKyBzaGlmdGVkUG9zdCAqIHRoaXMucG9zdEZhY3RvcjtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zdEJlaGF2aW9yID09PSBiZWhhdmlvci5jbGFtcCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgdGhpcy5vdXRSYW5nZTtcbiAgICB9XG5cbiAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHBvc3RCZWhhdmlvciBjb25maWd1cmF0aW9uIC0gcG9zdEJlaGF2aW9yOiR7dGhpcy5wb3N0QmVoYXZpb3J9YCk7XG4gICAgdGhyb3cgcmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICB9XG5cblxuICAvLyBQcmVjb25maWd1cmVkIGZ1bmN0aW9uc1xuXG4gIC8vIE1ha2VzIGFuIGVhc2VGdW5jdGlvbiBwcmVjb25maWd1cmVkIHRvIGFuIGVhc2Ugb3V0IG1vdGlvbi5cbiAgLy9cbiAgLy8gVGhlIGBvdXRSYW5nZWAgdmFsdWUgc2hvdWxkIGJlIGBpblJhbmdlKjJgIGluIG9yZGVyIGZvciB0aGUgZWFzZVxuICAvLyBtb3Rpb24gdG8gY29ubmVjdCB3aXRoIHRoZSBleHRlcm5hbCBtb3Rpb24gYXQgdGhlIGNvcnJlY3QgdmVsb2NpdHkuXG4gIHN0YXRpYyBtYWtlRWFzZU91dCgpIHtcbiAgICBsZXQgZWFzZU91dCA9IG5ldyBFYXNlRnVuY3Rpb24oKVxuICAgIGVhc2VPdXQucmF0aW9PZmZzZXQgPSAxO1xuICAgIGVhc2VPdXQucmF0aW9GYWN0b3IgPSAuNTtcbiAgICBlYXNlT3V0LmVhc2VPZmZzZXQgPSAtLjU7XG4gICAgZWFzZU91dC5lYXNlRmFjdG9yID0gMjtcbiAgICByZXR1cm4gZWFzZU91dDtcbiAgfVxuXG59IC8vIGNsYXNzIEVhc2VGdW5jdGlvblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRWFzZUZ1bmN0aW9uO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4qIEV4Y2VwdGlvbiBidWlsZGVyIGZvciB0aHJvd2FibGUgb2JqZWN0cy5cbiogQGFsaWFzIFJhYy5FeGNlcHRpb25cbiovXG5jbGFzcyBFeGNlcHRpb24ge1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUsIG1lc3NhZ2UpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEV4Y2VwdGlvbjoke3RoaXMubmFtZX0gLSAke3RoaXMubWVzc2FnZX1gO1xuICB9XG5cbiAgLyoqXG4gICogV2hlbiBgdHJ1ZWAgdGhlIGNvbnZlbmllbmNlIHN0YXRpYyBmdW5jdGlvbnMgb2YgdGhpcyBjbGFzcyB3aWxsXG4gICogYnVpbGQgYEVycm9yYCBvYmplY3RzLCBvdGhlcndpc2UgYEV4Y2VwdGlvbmAgb2JqZWN0cyBhcmUgYnVpbHQuXG4gICpcbiAgKiBTZXQgYXMgYGZhbHNlYCBieSBkZWZhdWx0IGZvciBicm93c2VyIHVzZTogdGhyb3dpbmcgYW4gYEV4Y2VwdGlvbmBcbiAgKiBpbiBjaHJvbWUgZGlzcGxheXMgdGhlIGVycm9yIHN0YWNrIHVzaW5nIHNvdXJjZS1tYXBzIHdoZW4gYXZhaWxhYmxlLFxuICAqIHdoaWxlIHRocm93aW5nIGFuIGBFcnJvcmAgb2JqZWN0IGRpc3BsYXlzIHRoZSBlcnJvciBzdGFjayByZWxhdGl2ZSB0b1xuICAqIHRoZSBidW5kbGVkIGZpbGUgd2hpY2ggaXMgaGFyZGVyIHRvIHJlYWQuXG4gICpcbiAgKiBVc2VkIGFzIGB0cnVlYCBmb3IgdGVzdCBydW5zIGluIEplc3Q6IHRocm93aW5nIGFuIGBFcnJvcmAgd2lsbCBiZVxuICAqIHJlcG9ydGVkIGluIHRoZSB0ZXN0IHJlcG9ydCwgd2hpbGUgdGhyb3dpbmcgYSBjdXN0b20gb2JqZWN0IChsaWtlXG4gICogYEV4Y2VwdGlvbmApIHdpdGhpbiBhIG1hdGNoZXIgcmVzdWx0cyBpbiB0aGUgZXhwZWN0YXRpb24gaGFuZ2luZ1xuICAqIGluZGVmaW5pdGVseS5cbiAgKi9cbiAgc3RhdGljIGJ1aWxkc0Vycm9ycyA9IGZhbHNlO1xuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGJ1aWxkaW5nIHRocm93YWJsZSBvYmplY3RzLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGNhbiBjYW4gYmUgdXNlZCBhcyBmb2xsb3dpbmc6XG4gICogYGBgXG4gICogZnVuYyhtZXNzYWdlKSAvLyByZXR1cm5zIGFuIGBFeGNlcHRpb25gYCBvYmplY3Qgd2l0aCBgbmFtZWAgYW5kIGBtZXNzYWdlYFxuICAqIGZ1bmMuZXhjZXB0aW9uTmFtZSAvLyByZXR1cm5zIHRoZSBgbmFtZWAgb2YgdGhlIGJ1aWx0IHRocm93YWJsZSBvYmplY3RzXG4gICogYGBgXG4gICovXG4gIHN0YXRpYyBuYW1lZChuYW1lKSB7XG4gICAgbGV0IGZ1bmMgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKEV4Y2VwdGlvbi5idWlsZHNFcnJvcnMpIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIGVycm9yLm5hbWUgPSBuYW1lO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgRXhjZXB0aW9uKG5hbWUsIG1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICBmdW5jLmV4Y2VwdGlvbk5hbWUgPSBuYW1lO1xuICAgIHJldHVybiBmdW5jO1xuICB9XG5cbiAgc3RhdGljIGRyYXdlck5vdFNldHVwICAgICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdEcmF3ZXJOb3RTZXR1cCcpO1xuICBzdGF0aWMgZmFpbGVkQXNzZXJ0ICAgICAgICAgICAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0ZhaWxlZEFzc2VydCcpO1xuICBzdGF0aWMgaW52YWxpZE9iamVjdFR5cGUgICAgICAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0ludmFsaWRPYmplY3RUeXBlJyk7XG4gIHN0YXRpYyBhYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnQWJzdHJhY3RGdW5jdGlvbkNhbGxlZCcpO1xuICAvLyBUT0RPOiBtaWdyYXRlIHJlc3Qgb2YgaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb25cbiAgc3RhdGljIGludmFsaWRPYmplY3RDb25maWd1cmF0aW9uID0gRXhjZXB0aW9uLm5hbWVkKCdJbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbicpO1xuXG4gIC8vIGludmFsaWRQYXJhbWV0ZXJDb21iaW5hdGlvbjogJ0ludmFsaWQgcGFyYW1ldGVyIGNvbWJpbmF0aW9uJyxcblxuICAvLyBpbnZhbGlkT2JqZWN0VG9EcmF3OiAnSW52YWxpZCBvYmplY3QgdG8gZHJhdycsXG4gIC8vIGludmFsaWRPYmplY3RUb0FwcGx5OiAnSW52YWxpZCBvYmplY3QgdG8gYXBwbHknLFxuXG59IC8vIGNsYXNzIEV4Y2VwdGlvblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRXhjZXB0aW9uO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIEludGVybmFsIHV0aWxpdGllcy5cbiogQG5hbWVzcGFjZSB1dGlsc1xuKi9cblxuXG4vKipcbiogQXNzZXJ0cyB0aGF0IGFsbCBwYXNzZWQgcGFyYW1ldGVycyBhcmUgb2JqZWN0cyBvciBwcmltaXRpdmVzLiBJZiBhbnlcbiogcGFyYW1ldGVyIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCBhIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YFxuKiBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7Li4uKE9iamVjdHxwcmltaXRpdmUpfSBwYXJhbWV0ZXJzXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0RXhpc3RzXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmFzc2VydEV4aXN0cyA9IGZ1bmN0aW9uKC4uLnBhcmFtZXRlcnMpIHtcbiAgcGFyYW1ldGVycy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEZvdW5kIG51bGwsIGV4cGVjdGluZyBlbGVtZW50IHRvIGV4aXN0IGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRm91bmQgdW5kZWZpbmVkLCBleHBlY3RpbmcgZWxlbWVudCB0byBleGlzdCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgYGVsZW1lbnRzYCBhcmUgb2JqZWN0cyBvciB0aGUgZ2l2ZW4gYHR5cGVgLCBvdGhlcndpc2UgYVxuKiBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBXaGVuIGFueSBtZW1iZXIgb2YgYGVsZW1lbnRzYCBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIHRoZSBleGNlcHRpb24gaXNcbiogYWxzbyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHR5cGVcbiogQHBhcmFtIHsuLi5PYmplY3R9IGVsZW1lbnRzXG4qXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0VHlwZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRUeXBlID0gZnVuY3Rpb24odHlwZSwgLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUgLSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX0gZXhwZWN0ZWQtdHlwZS1uYW1lOiR7dHlwZS5uYW1lfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG51bWJlciBwcmltaXRpdmVzIGFuZCBub3QgTmFOLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLm51bWJlcn0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnROdW1iZXJcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0TnVtYmVyID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdudW1iZXInIHx8IGlzTmFOKGl0ZW0pKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgbnVtYmVyIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIHN0cmluZyBwcmltaXRpdmVzLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLnN0cmluZ30gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRTdHJpbmdcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0U3RyaW5nID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3Rpbmcgc3RyaW5nIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIGJvb2xlYW4gcHJpbWl0aXZlcywgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5ib29sZWFufSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydEJvb2xlYW5cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0Qm9vbGVhbiA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBib29sZWFuIHByaW1pdGl2ZSAtIGVsZW1lbnQtdHlwZToke3R5cGVOYW1lKGl0ZW0pfSBlbGVtZW50OiR7aXRlbX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3RvciBuYW1lIG9mIGBvYmpgLCBvciBpdHMgdHlwZSBuYW1lLlxuKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgZGVidWdnaW5nIGFuZCBlcnJvcnMuXG4qXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBBbiBgT2JqZWN0YCB0byBnZXQgaXRzIHR5cGUgbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKlxuKiBAZnVuY3Rpb24gdHlwZU5hbWVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKG9iaikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuICd1bmRlZmluZWQnOyB9XG4gIGlmIChvYmogPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5uYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gb2JqLm5hbWUgPT0gJydcbiAgICAgID8gYGZ1bmN0aW9uYFxuICAgICAgOiBgZnVuY3Rpb246JHtvYmoubmFtZX1gO1xuICB9XG4gIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA/PyB0eXBlb2Ygb2JqO1xufVxuZXhwb3J0cy50eXBlTmFtZSA9IHR5cGVOYW1lO1xuXG5cbi8qKlxuKiBBZGRzIGEgY29uc3RhbnQgdG8gdGhlIGdpdmVuIG9iamVjdCwgdGhlIGNvbnN0YW50IGlzIG5vdCBlbnVtZXJhYmxlIGFuZFxuKiBub3QgY29uZmlndXJhYmxlLlxuKlxuKiBAZnVuY3Rpb24gYWRkQ29uc3RhbnRUb1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hZGRDb25zdGFudFRvID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgdmFsdWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfSk7XG59XG5cblxuLyoqXG4qIFJldHVybnMgYSBzdHJpbmcgb2YgYG51bWJlcmAgZm9ybWF0IHVzaW5nIGZpeGVkLXBvaW50IG5vdGF0aW9uIG9yIHRoZVxuKiBjb21wbGV0ZSBgbnVtYmVyYCBzdHJpbmcuXG4qXG4qIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBUaGUgbnVtYmVyIHRvIGZvcm1hdFxuKiBAcGFyYW0gez9udW1iZXJ9IFtkaWdpdHNdIC0gVGhlIGFtb3VudCBvZiBkaWdpdHMgdG8gcHJpbnQsIG9yIGBudWxsYCB0b1xuKiBwcmludCBhbGwgZGlnaXRzLlxuKlxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKlxuKiBAZnVuY3Rpb24gY3V0RGlnaXRzXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmN1dERpZ2l0cyA9IGZ1bmN0aW9uKG51bWJlciwgZGlnaXRzID0gbnVsbCkge1xuICByZXR1cm4gZGlnaXRzID09PSBudWxsXG4gICAgPyBudW1iZXIudG9TdHJpbmcoKVxuICAgIDogbnVtYmVyLnRvRml4ZWQoZGlnaXRzKTtcbn1cblxuIl19
