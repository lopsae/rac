// RAC - ruler-and-compass - 1.2.0-dev 891-7ff81e5
// Development distribution with sourcemaps
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version and build
module.exports = {
	version: '1.2.0-dev',
	build: '891-7ff81e5'
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
    * @type {string}
    *
    * @name version
    * @memberof Rac#
    */
    utils.addConstantTo(this, 'version', version);


    /**
    * Build of the instance, same as `{@link Rac.build}`.
    *
    * @type {string}
    *
    * @name build
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
    * Default value is based on 1/000 of the turn of an arc of radius 500
    * and length of 1: `1/(500*6.28)/1000`
    *
    * @type {number}
    */
    this.unitaryEqualityThreshold = 0.0000003;


    // RELEASE-TODO: document
    this.utils = utils

    this.stack = [];
    this.shapeStack = [];
    this.compositeStack = [];


    // RELEASE-TODO: document - test
    this.textFormatDefaults = {
      font: null,
      size: 15
    };


    /**
    * Drawer of the instance. This object handles the drawing of all
    * drawable object using this instance of `Rac`.
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


const utils = require(`./util/utils`);
/**
* Container of utility functions. See `{@link utils}` for the available
* members.
*
* @type {object}
*/
Rac.utils = utils;


/**
* Version of the class. Same as the version used for the npm package.
*
* @type {string}
*
* @name version
* @memberof Rac
*/
utils.addConstantTo(Rac, 'version', version);


/**
* Build of the class. Intended for debugging purpouses.
*
* Contains a commit-count and short-hash of the repository when the build
* was done.
*
* @type {string}
*
* @name build
* @memberof Rac
*/
utils.addConstantTo(Rac, 'build', build);


/**
* Tau, equal to `Math.PI * 2`.
*
* [Tau Manifesto](https://tauday.com/tau-manifesto).
*
* @type {number}
*
* @name TAU
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


},{"../built/version":1,"./attachInstanceFunctions":3,"./attachProtoFunctions":4,"./control/ArcControl":5,"./control/Control":6,"./control/Controller":7,"./control/RayControl":8,"./drawable/Angle":9,"./drawable/Arc":10,"./drawable/Bezier":11,"./drawable/Composite":12,"./drawable/Point":13,"./drawable/Ray":14,"./drawable/Segment":15,"./drawable/Shape":16,"./drawable/Text":17,"./drawable/instance.Angle":18,"./drawable/instance.Arc":19,"./drawable/instance.Bezier":20,"./drawable/instance.Point":21,"./drawable/instance.Ray":22,"./drawable/instance.Segment":23,"./drawable/instance.Text":24,"./p5Drawer/P5Drawer":26,"./style/Color":32,"./style/Fill":33,"./style/Stroke":34,"./style/StyleContainer":35,"./style/instance.Color":36,"./style/instance.Fill":37,"./style/instance.Stroke":38,"./util/EaseFunction":39,"./util/Exception":40,"./util/utils":41}],3:[function(require,module,exports){
'use strict';


const Rac = require('./Rac');


/**
* This namespace lists utility functions attached to an instance of
* `{@link Rac}` used to produce drawable and other objects, and to access
* ready-build convenience objects like `{@link instance.Angle#north}` or
* `{@link instance.Point#zero}`.
*
* Drawable and related objects require a reference to a `rac` instance in
* order to perform drawing operations. These functions build new objects
* using the calling `Rac` instance, and contain ready-made convenience
* objects that are also setup with the same `Rac` instance.
*
* @namespace instance
*/


// Attaches the convenience functions to create objects with this instance
// of Rac. These functions are attached as properties (instead of into the
// prototype) because these are later populated with more properties and
// methods, and thus need to be an independent instance.
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
  * @param {number} x
  * @param {number} y
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
  * @param {number} x
  * @param {number} y
  * @param {Rac.Angle|number} start
  * @param {?Rac.Angle|number} [end=null]
  * @param {boolean} [clockwise=true]
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
  * @param {number} x
  * @param {number} y
  * @param {string} string
  * @param {Rac.Text.Format} format
  *
  * @returns {Rac.Text}
  *
  * @see instance.Text
  *
  * @function Text
  * @memberof Rac#
  */
  rac.Text = function makeText(x, y, string, format) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
  };


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

  // Adds to the given class prototype all the functions contained in
  // `Rac.drawableProtoFunctions`. These are functions shared by all
  // drawable objects (E.g. `draw()` and `debug()`).
  Rac.setupDrawableProtoFunctions = function(classObj) {
    Object.keys(Rac.drawableProtoFunctions).forEach(name => {
      classObj.prototype[name] = Rac.drawableProtoFunctions[name];
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


},{"./util/utils":41}],5:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],6:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],7:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],8:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],9:[function(require,module,exports){
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
    utils.assertExists(rac);
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
  * `{@link Rac#unitaryEqualityThreshold}`, otherwise returns `false`.
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


},{"../Rac":2,"../util/utils":41}],10:[function(require,module,exports){
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
  * Returns `true` when all members of both arcs are equal.
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
  * @param {Rac.Angle|number} [startInset={@link instance.Angle#zero}] - The inset
  * for the lower limit of the clamping range
  * @param {Rac.Angle|number} [endInset={@link instance.Angle#zero}] - The inset
  * for the higher limit of the clamping range
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


},{"../Rac":2,"../util/utils":41}],11:[function(require,module,exports){
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
  * Returns `true` when all members of both beziers are
  * [considered equal]{@link Rac.Point#equals}.
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


},{"../Rac":2,"../util/utils":41}],12:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],13:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Point in a two dimentional coordinate system.
*
* Several methods will return an adjusted value or perform adjustments in
* their operation when two points are close enough as to be considered
* equal. When the the difference of each coordinate of two points
* is under the `[equalityThreshold]{@link Rac#equalityThreshold}` the
* points are considered equal. The `[equals]{@link Rac.Point#equals}`
* method performs this check.
*
* @alias Rac.Point
*/
class Point{


  /**
  * Creates a new `Point` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {number} x - The x coordinate
  * @param {number} y - The y coordinate
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
  * Returns `true` when the difference with `otherPoint` for each coordinate is
  * under `{@link Rac#equalityThreshold}`, otherwise returns `false`.
  *
  * When `otherPoint` is any class other that `Rac.Point`, returns `false`.
  *
  * Values are compared using `{@link Rac#equals}`.
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
  * Returns the distance from `this` to `point`, or returns `0` when
  * `this` and `point` are considered [equal]{@link Rac.Point#equals}.
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
  * When `this` and `point` are considered
  * [equal]{@link Rac.Point#equals}, returns the angle produced with
  * `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to measure the angle to
  * @param {Rac.Angle|number} [defaultAngle=instance.Angle.Zero] -
  * An `Angle` to return when `this` and `point` are equal
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


  // RELEASE-TODO: document
  // RELEASE-TODO: test
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
  * When `this` and `point` are considered equal, the new `Ray` will use
  * the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Ray` towards
  * @param {Rac.Angle|number} [defaultAngle=instance.Angle.Zero] -
  * An `Angle` to use when `this` and `point` are equal
  * @returns {Rac.Ray}
  */
  rayToPoint(point, defaultAngle = this.rac.Angle.zero) {
    defaultAngle = this.angleToPoint(point, defaultAngle);
    return new Rac.Ray(this.rac, this, defaultAngle);
  }


  /**
  * Returns a new `Ray` from `this` to the projection of `this` in `ray`.
  *
  * When the projected point is equal to `this` the produced ray will have
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
  * @return {Rac.Ray?}
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
  * When `this` and `point` are considered [equal]{@link Rac.Point#equals},
  * the new `Segment` will use the angle produced with `defaultAngle`.
  *
  * @param {Rac.Point} point - A `Point` to point the `Segment` towards
  * @param {Rac.Angle|number} [defaultAngle=instance.Angle.Zero] -
  * An `Angle` to use when `this` and `point` are equal
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
  * @return {Rac.Segment?}
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
  * @param {Rac.Angle|number} [start=rac.Angle.zero] - The start
  * `Angle` of the new `Arc`
  * @param {?Rac.Angle|number} [end=null] - The end `Angle` of the new
  * `Arc`; when `null` or ommited, `start` is used instead
  * @param {boolean=} clockwise=true - The orientation of the new `Arc`
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
  * @param {string} string - The string of the new `Text`
  * @param {Rac.Text.Format} [format=null] - The format of the new `Text`;
  * when ommited `[instance.Text.Format.topLeft]{@link instance.Text.Format#topLeft}`
  * is used instead.
  * @returns {Rac.Text}
  */
  // RELEASE-TODO: check link
  // RELEASE-TODO: check if test needs to udpate
  text(string, format = null) {
    format = format ?? this.rac.Text.Format.topLeft;
    return new Rac.Text(this.rac, this, string, format);
  }

} // class Point


module.exports = Point;


},{"../Rac":2,"../util/utils":41}],14:[function(require,module,exports){
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
  * Returns `true` when `start` and `angle` in both rays are equal.
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


  // RELEASE-TODO: document
  // RELEASE-TODO: test
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
    // RELEASE-TODO: what happens with square angles? is this covered by intersection logic?
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


},{"../Rac":2,"../util/utils":41}],15:[function(require,module,exports){
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
  * Returns `true` when `ray` and `length` in both segments are equal.
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


  // RELEASE-TODO: document
  // RELEASE-TODO: test
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


},{"../Rac":2,"../util/utils":41}],16:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],17:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Format for drawing a `[Text]{@link Rac.Text}` object.
*
* @alias Rac.Text.Format
*/
class TextFormat {

  // RELEASE-TODO: document
  static horizontalAlign = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  // RELEASE-TODO: document
  static verticalAlign = {
    top: "top",
    bottom: "bottom",
    center: "verticalCenter",
    baseline: "baseline"
  };


  // RELEASE-TODO: document - test
  constructor(
    rac,
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    utils.assertExists(rac);
    utils.assertString(hAlign, vAlign);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);

    this.rac = rac;
    this.hAlign = hAlign;
    this.vAlign = vAlign;
    this.angle = angle;
    this.font = font;
    this.size = size;
  }

  // Returns a format to draw text in the same position as `self` with
  // the inverse angle.
  // RELEASE-TODO: document - test
  inverse() {
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


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      newAngle,
      this.font,
      this.size);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      newFont,
      this.size);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      this.font,
      newSize);
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const angleStr = utils.cutDigits(this.angle.turn, digits);
    const sizeStr = this.size === null
      ? "null"
      : utils.cutDigits(this.size, digits);
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${this.font} s:${sizeStr})`;
  }

} // class TextFormat


/**
* String, format, and position to draw a text.
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

  // RELEASE-TODO: document - test
  constructor(rac, point, string, format) {
    utils.assertExists(rac, point, string, format);
    utils.assertType(Rac.Point, point);
    utils.assertString(string);
    utils.assertType(Text.Format, format);
    this.rac = rac;
    this.point = point;
    this.string = string;
    this.format = format;
  }


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    const newFormat = this.format.withAngle(newAngle);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    const newFormat = this.format.withFont(newFont);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    const newFormat = this.format.withSize(newSize);
    return new Text(this.rac, this.point, this.string, newFormat);
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

} // class Text


module.exports = Text;


},{"../Rac":2,"../util/utils":41}],18:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Angle` function contains convenience methods and members
* for `{@link Rac.Angle}` objects setup with the owning `Rac` instance.
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
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.zero = rac.Angle(0.0);

  /**
  * An `Angle` with turn `1/2`.
  *
  * Also named as: `left`, `l`, `west`, `w`, `inverse`.
  *
  * @name half
  * @type {Rac.Point}
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
  * @type {Rac.Point}
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
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.eighth =  rac.Angle(1/8);

  /**
  * An `Angle` with turn `7/8`, negative angle of
  * `{@link instance.Angle#eighth eighth}`.
  *
  * Also named as: `topRight`, `tr`, `ne`.
  *
  * @name neighth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.neighth =  rac.Angle(-1/8);


  /**
  * An `Angle` with turn `1/16`.
  *
  * @name sixteenth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.sixteenth = rac.Angle(1/16);

  /**
  * An `Angle` with turn `3/4`.
  *
  * Also named as: `up`, `u`, `top`, `t`.
  *
  * @name north
  * @type {Rac.Point}
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


},{"../Rac":2}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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


},{}],21:[function(require,module,exports){
'use strict';


/**
* The `instance.Point` function contains convenience methods and members
* for `{@link Rac.Point}` objects setup with the owning `Rac` instance.
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


},{}],22:[function(require,module,exports){
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


},{}],23:[function(require,module,exports){
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


},{}],24:[function(require,module,exports){
'use strict';


const Rac = require('../Rac');


/**
* The `instance.Text` function contains convenience methods and members
* for `{@link Rac.Text}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {
  // Intended to receive a Rac instance as parameter


  // RELEASE-TODO: document - test
  rac.Text.Format = function(
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    angle = rac.Angle.from(angle);
    return new Rac.Text.Format(
      rac,
      hAlign, vAlign,
      angle, font, size);
  };


  // RELEASE-TODO: document - test
  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top);

  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.top);

  rac.Text.Format.centerLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center);

  rac.Text.Format.centerRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.center);

  rac.Text.Format.bottomLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom);

  rac.Text.Format.bottomRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.bottom);

  /**
  * A `Text` for drawing `hello world` with `topLeft` format at
  * `Point.zero`.
  * @name hello
  * @memberof instance.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!',
    rac.Text.Format.topLeft);

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @memberof instance.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow',
    rac.Text.Format.topLeft);

} // attachRacPoint


},{"../Rac":2}],25:[function(require,module,exports){


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


},{"./Rac":2}],26:[function(require,module,exports){
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
    * Object with options used by the default implementation of
    * `drawable.debug()`.
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

  // Adds a DrawRoutine for the given class.
  setDrawFunction(classObj, drawFunction) {
    let index = this.drawRoutines
      .findIndex(routine => routine.classObj === classObj);

    let routine;
    if (index === -1) {
      routine = new DrawRoutine(classObj, drawFunction);
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

  // Adds a DebugRoutine for the given class.
  setDebugFunction(classObj, debugFunction) {
    let index = this.debugRoutines
      .findIndex(routine => routine.classObj === classObj);

    let routine;
    if (index === -1) {
      routine = new DebugRoutine(classObj, debugFunction);
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


// Encapsulates the drawing function and options for a specific class.
// The draw function is called with two parameters: the instance of the
// drawer, and the object to draw.
//
// Optionally a `style` can be asigned to always be applied before
// drawing an instance of the associated class. This style will be
// applied before any styles provided to the `draw` function.
//
// Optionally `requiresPushPop` can be set to `true` to always peform
// a `push` and `pop` before and after all the style and drawing in
// the routine. This is intended for objects which drawing operations
// may need to push transformation to the stack.
class DrawRoutine {
  constructor (classObj, drawFunction) {
    this.classObj = classObj;
    this.drawFunction = drawFunction;
    this.style = null;

    // Options
    this.requiresPushPop = false;
  }
} // DrawRoutine


class DebugRoutine {
  constructor (classObj, debugFunction) {
    this.classObj = classObj;
    this.debugFunction = debugFunction;
  }
}


class ApplyRoutine {
  constructor (classObj, applyFunction) {
    this.classObj = classObj;
    this.applyFunction = applyFunction;
  }
}


},{"../Rac":2,"../util/utils":41,"./Point.functions":27,"./Ray.functions":28,"./Segment.functions":29,"./debug.functions":30,"./draw.functions":31}],27:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],28:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],29:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],30:[function(require,module,exports){
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
    format = format.inverse();
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
    startFormat = startFormat.inverse();
    angleFormat = angleFormat.inverse();
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
    lengthFormat = lengthFormat.inverse();
    angleFormat = angleFormat.inverse();
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
    // If radius is to close to the center-arc markers
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
    headFormat = headFormat.inverse();
    radiusFormat = radiusFormat.inverse();
  }
  if (reversesText(arc.end)) {
    tailFormat = tailFormat.inverse();
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


},{"../Rac":2}],31:[function(require,module,exports){
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


},{"../Rac":2}],32:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],33:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],34:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],35:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],36:[function(require,module,exports){
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


},{"../Rac":2}],37:[function(require,module,exports){
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


},{}],38:[function(require,module,exports){
'use strict';


/**
* The `instance.Stroke` function contains convenience methods and members
* for `{@link Rac.Stroke}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Stroke
*/
module.exports = function attachRacPoint(rac) {
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


},{}],39:[function(require,module,exports){
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


},{"../Rac":2,"../util/utils":41}],40:[function(require,module,exports){
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


},{}],41:[function(require,module,exports){
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
* Asserts that all `elements` are objects or the given `typeo`, otherwise a
* `{@link Rac.Exception.failedAssert}` is thrown.
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
        `Element is unexpected type - element:${item} element-type:${typeName(item)} expected-type-name:${type.name}`);
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
        `Element is unexpected type, expecting number primitive - element:${item} element-type:${typeName(item)}`);
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
        `Element is unexpected type, expecting string primitive - element:${item} element-type:${typeName(item)}`);
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
        `Element is unexpected type, expecting boolean primitive - element:${item} element-type:${typeName(item)}`);
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


},{"../Rac":2}]},{},[25])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsdC92ZXJzaW9uLmpzIiwic3JjL1JhYy5qcyIsInNyYy9hdHRhY2hJbnN0YW5jZUZ1bmN0aW9ucy5qcyIsInNyYy9hdHRhY2hQcm90b0Z1bmN0aW9ucy5qcyIsInNyYy9jb250cm9sL0FyY0NvbnRyb2wuanMiLCJzcmMvY29udHJvbC9Db250cm9sLmpzIiwic3JjL2NvbnRyb2wvQ29udHJvbGxlci5qcyIsInNyYy9jb250cm9sL1JheUNvbnRyb2wuanMiLCJzcmMvZHJhd2FibGUvQW5nbGUuanMiLCJzcmMvZHJhd2FibGUvQXJjLmpzIiwic3JjL2RyYXdhYmxlL0Jlemllci5qcyIsInNyYy9kcmF3YWJsZS9Db21wb3NpdGUuanMiLCJzcmMvZHJhd2FibGUvUG9pbnQuanMiLCJzcmMvZHJhd2FibGUvUmF5LmpzIiwic3JjL2RyYXdhYmxlL1NlZ21lbnQuanMiLCJzcmMvZHJhd2FibGUvU2hhcGUuanMiLCJzcmMvZHJhd2FibGUvVGV4dC5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BbmdsZS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5BcmMuanMiLCJzcmMvZHJhd2FibGUvaW5zdGFuY2UuQmV6aWVyLmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlJheS5qcyIsInNyYy9kcmF3YWJsZS9pbnN0YW5jZS5TZWdtZW50LmpzIiwic3JjL2RyYXdhYmxlL2luc3RhbmNlLlRleHQuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9wNURyYXdlci9QNURyYXdlci5qcyIsInNyYy9wNURyYXdlci9Qb2ludC5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvUmF5LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9TZWdtZW50LmZ1bmN0aW9ucy5qcyIsInNyYy9wNURyYXdlci9kZWJ1Zy5mdW5jdGlvbnMuanMiLCJzcmMvcDVEcmF3ZXIvZHJhdy5mdW5jdGlvbnMuanMiLCJzcmMvc3R5bGUvQ29sb3IuanMiLCJzcmMvc3R5bGUvRmlsbC5qcyIsInNyYy9zdHlsZS9TdHJva2UuanMiLCJzcmMvc3R5bGUvU3R5bGVDb250YWluZXIuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuQ29sb3IuanMiLCJzcmMvc3R5bGUvaW5zdGFuY2UuRmlsbC5qcyIsInNyYy9zdHlsZS9pbnN0YW5jZS5TdHJva2UuanMiLCJzcmMvdXRpbC9FYXNlRnVuY3Rpb24uanMiLCJzcmMvdXRpbC9FeGNlcHRpb24uanMiLCJzcmMvdXRpbC91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25TQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3paQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3bkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1c0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlU3RyaWN0JztcblxuLy8gUnVsZXIgYW5kIENvbXBhc3MgLSB2ZXJzaW9uIGFuZCBidWlsZFxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHZlcnNpb246ICcxLjIuMC1kZXYnLFxuXHRidWlsZDogJzg5MS03ZmY4MWU1J1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8vIFJ1bGVyIGFuZCBDb21wYXNzXG5jb25zdCB2ZXJzaW9uID0gcmVxdWlyZSgnLi4vYnVpbHQvdmVyc2lvbicpLnZlcnNpb247XG5jb25zdCBidWlsZCAgID0gcmVxdWlyZSgnLi4vYnVpbHQvdmVyc2lvbicpLmJ1aWxkO1xuXG5cbi8qKlxuKiBSb290IGNsYXNzIG9mIFJBQy4gQWxsIGRyYXdhYmxlLCBzdHlsZSwgY29udHJvbCwgYW5kIGRyYXdlciBjbGFzc2VzIGFyZVxuKiBjb250YWluZWQgaW4gdGhpcyBjbGFzcy5cbipcbiogQW4gaW5zdGFuY2UgbXVzdCBiZSBjcmVhdGVkIHdpdGggYG5ldyBSYWMoKWAgaW4gb3JkZXIgdG9cbiogYnVpbGQgZHJhd2FibGUsIHN0eWxlLCBhbmQgb3RoZXIgb2JqZWN0cy5cbipcbiogVG8gcGVyZm9ybSBkcmF3aW5nIG9wZXJhdGlvbnMsIGEgZHJhd2VyIG11c3QgYmUgc2V0dXAgd2l0aFxuKiBgW3NldHVwRHJhd2VyXXtAbGluayBSYWMjc2V0dXBEcmF3ZXJ9YC4gQ3VycmVudGx5IHRoZSBvbmx5IGF2YWlsYWJsZVxuKiBpbXBsZW1lbnRhdGlvbiBpcyBgW1A1RHJhd2VyXXtAbGluayBSYWMuUDVEcmF3ZXJ9YC5cbiovXG5jbGFzcyBSYWMge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgUmFjLiBUaGUgbmV3IGluc3RhbmNlIGhhcyBubyBgZHJhd2VyYCBzZXR1cC5cbiAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvKipcbiAgICAqIFZlcnNpb24gb2YgdGhlIGluc3RhbmNlLCBzYW1lIGFzIGB7QGxpbmsgUmFjLnZlcnNpb259YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICpcbiAgICAqIEBuYW1lIHZlcnNpb25cbiAgICAqIEBtZW1iZXJvZiBSYWMjXG4gICAgKi9cbiAgICB1dGlscy5hZGRDb25zdGFudFRvKHRoaXMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuICAgIC8qKlxuICAgICogQnVpbGQgb2YgdGhlIGluc3RhbmNlLCBzYW1lIGFzIGB7QGxpbmsgUmFjLmJ1aWxkfWAuXG4gICAgKlxuICAgICogQHR5cGUge3N0cmluZ31cbiAgICAqXG4gICAgKiBAbmFtZSBidWlsZFxuICAgICogQG1lbWJlcm9mIFJhYyNcbiAgICAqL1xuICAgIHV0aWxzLmFkZENvbnN0YW50VG8odGhpcywgJ2J1aWxkJywgYnVpbGQpO1xuXG5cbiAgICAvKipcbiAgICAqIFZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5IGJldHdlZW4gdHdvIG51bWVyaWMgdmFsdWVzLiBVc2VkIGZvclxuICAgICogdmFsdWVzIHRoYXQgdGVuZCB0byBiZSBpbnRlZ2VycywgbGlrZSBzY3JlZW4gY29vcmRpbmF0ZXMuIFVzZWQgYnlcbiAgICAqIGB7QGxpbmsgUmFjI2VxdWFsc31gLlxuICAgICpcbiAgICAqIFdoZW4gY2hlY2tpbmcgZm9yIGVxdWFsaXR5IGB4YCBpcyBlcXVhbCB0byBub24taW5jbHVzaXZlXG4gICAgKiBgKHgtZXF1YWxpdHlUaHJlc2hvbGQsIHgrZXF1YWxpdHlUaHJlc2hvbGQpYDpcbiAgICAqICsgYHhgIGlzICoqbm90IGVxdWFsKiogdG8gYHggwrEgZXF1YWxpdHlUaHJlc2hvbGRgXG4gICAgKiArIGB4YCBpcyAqKmVxdWFsKiogdG8gYHggwrEgZXF1YWxpdHlUaHJlc2hvbGQvMmBcbiAgICAqXG4gICAgKiBEdWUgdG8gZmxvYXRpbmcgcG9pbnQgcHJlY2lzaW9uIHNvbWUgb3BlcnRhdGlvbiBsaWtlIGludGVyc2VjdGlvbnNcbiAgICAqIGNhbiByZXR1cm4gb2RkIG9yIG9zY2lsYXRpbmcgdmFsdWVzLiBUaGlzIHRocmVzaG9sZCBpcyB1c2VkIHRvIHNuYXBcbiAgICAqIHZhbHVlcyB0b28gY2xvc2UgdG8gYSBsaW1pdCwgYXMgdG8gcHJldmVudCBvc2NpbGF0aW5nIGVmZWN0cyBpblxuICAgICogdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBEZWZhdWx0IHZhbHVlIGlzIGJhc2VkIG9uIGAxLzEwMDBgIG9mIGEgcG9pbnQuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuZXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMTtcblxuXG4gICAgLyoqXG4gICAgKiBWYWx1ZSB1c2VkIHRvIGRldGVybWluZSBlcXVhbGl0eSBiZXR3ZWVuIHR3byB1bml0YXJ5IG51bWVyaWMgdmFsdWVzLlxuICAgICogVXNlZCBmb3IgdmFsdWVzIHRoYXQgdGVuZCB0byBleGlzdCBpbiB0aGUgYFswLCAxXWAgcmFuZ2UsIGxpa2VcbiAgICAqIGB7QGxpbmsgUmFjLkFuZ2xlI3R1cm59YC4gVXNlZCBieSBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxzfWAuXG4gICAgKlxuICAgICogRXF1YWxpdHkgbG9naWMgaXMgdGhlIHNhbWUgYXMgYHtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9YC5cbiAgICAqXG4gICAgKiBEZWZhdWx0IHZhbHVlIGlzIGJhc2VkIG9uIDEvMDAwIG9mIHRoZSB0dXJuIG9mIGFuIGFyYyBvZiByYWRpdXMgNTAwXG4gICAgKiBhbmQgbGVuZ3RoIG9mIDE6IGAxLyg1MDAqNi4yOCkvMTAwMGBcbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQgPSAwLjAwMDAwMDM7XG5cblxuICAgIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnRcbiAgICB0aGlzLnV0aWxzID0gdXRpbHNcblxuICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICB0aGlzLnNoYXBlU3RhY2sgPSBbXTtcbiAgICB0aGlzLmNvbXBvc2l0ZVN0YWNrID0gW107XG5cblxuICAgIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgLSB0ZXN0XG4gICAgdGhpcy50ZXh0Rm9ybWF0RGVmYXVsdHMgPSB7XG4gICAgICBmb250OiBudWxsLFxuICAgICAgc2l6ZTogMTVcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAqIERyYXdlciBvZiB0aGUgaW5zdGFuY2UuIFRoaXMgb2JqZWN0IGhhbmRsZXMgdGhlIGRyYXdpbmcgb2YgYWxsXG4gICAgKiBkcmF3YWJsZSBvYmplY3QgdXNpbmcgdGhpcyBpbnN0YW5jZSBvZiBgUmFjYC5cbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmRyYXdlciA9IG51bGw7XG5cbiAgICByZXF1aXJlKCcuL2F0dGFjaEluc3RhbmNlRnVuY3Rpb25zJykodGhpcyk7XG5cbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkNvbG9yJykgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLlN0cm9rZScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL3N0eWxlL2luc3RhbmNlLkZpbGwnKSAgICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFuZ2xlJykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlBvaW50JykgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlJheScpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlNlZ21lbnQnKSh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkFyYycpICAgICh0aGlzKTtcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLkJlemllcicpICh0aGlzKTtcblxuICAgIC8vIERlcGVuZHMgb24gaW5zdGFuY2UuUG9pbnQgYW5kIGluc3RhbmNlLkFuZ2xlIGJlaW5nIGFscmVhZHkgc2V0dXBcbiAgICByZXF1aXJlKCcuL2RyYXdhYmxlL2luc3RhbmNlLlRleHQnKSh0aGlzKTtcblxuICAgIC8qKlxuICAgICogQ29udHJvbGxlciBvZiB0aGUgaW5zdGFuY2UuIFRoaXMgb2JqZWNzIGhhbmRsZXMgYWxsIG9mIHRoZSBjb250cm9sc1xuICAgICogYW5kIHBvaW50ZXIgZXZlbnRzIHJlbGF0ZWQgdG8gdGhpcyBpbnN0YW5jZSBvZiBgUmFjYC5cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBSYWMuQ29udHJvbGxlcih0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAqIFNldHMgdGhlIGRyYXdlciBmb3IgdGhlIGluc3RhbmNlLiBDdXJyZW50bHkgb25seSBhIHA1LmpzIGluc3RhbmNlIGlzXG4gICogc3VwcG9ydGVkLlxuICAqXG4gICogVGhlIGRyYXdlciB3aWxsIGFsc28gcG9wdWxhdGUgc29tZSBjbGFzc2VzIHdpdGggcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAqIHJlbGV2YW50IHRvIHRoZSBkcmF3ZXIuIEZvciBwNS5qcyB0aGlzIGluY2x1ZGUgYGFwcGx5YCBmdW5jdGlvbnMgZm9yXG4gICogY29sb3JzIGFuZCBzdHlsZSBvYmplY3QsIGFuZCBgdmVydGV4YCBmdW5jdGlvbnMgZm9yIGRyYXdhYmxlIG9iamVjdHMuXG4gICpcbiAgKiBAcGFyYW0ge1A1fSBwNUluc3RhbmNlXG4gICovXG4gIHNldHVwRHJhd2VyKHA1SW5zdGFuY2UpIHtcbiAgICB0aGlzLmRyYXdlciA9IG5ldyBSYWMuUDVEcmF3ZXIodGhpcywgcDVJbnN0YW5jZSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyNlcXVhbGl0eVRocmVzaG9sZH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGEgRmlyc3QgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKiBAcGFyYW0ge251bWJlcn0gYiBTZWNvbmQgbnVtYmVyIHRvIGNvbXBhcmVcbiAgKlxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqL1xuICBlcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyhhLWIpO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5lcXVhbGl0eVRocmVzaG9sZDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFic29sdXRlIGRpc3RhbmNlIGJldHdlZW4gYGFgIGFuZCBgYmAgaXNcbiAgKiB1bmRlciBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBhIEZpcnN0IG51bWJlciB0byBjb21wYXJlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgU2Vjb25kIG51bWJlciB0byBjb21wYXJlXG4gICpcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgdW5pdGFyeUVxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoYS1iKTtcbiAgICByZXR1cm4gZGlmZiA8IHRoaXMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkO1xuICB9XG5cblxuICBwdXNoU3RhY2sob2JqKSB7XG4gICAgdGhpcy5zdGFjay5wdXNoKG9iaik7XG4gIH1cblxuXG4gIHBlZWtTdGFjaygpIHtcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuXG4gIHBvcFN0YWNrKCkge1xuICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XG4gIH1cblxuXG4gIHB1c2hTaGFwZShzaGFwZSA9IG51bGwpIHtcbiAgICBzaGFwZSA9IHNoYXBlID8/IG5ldyBSYWMuU2hhcGUodGhpcyk7XG4gICAgdGhpcy5zaGFwZVN0YWNrLnB1c2goc2hhcGUpO1xuICAgIHJldHVybiBzaGFwZTtcbiAgfVxuXG5cbiAgcGVla1NoYXBlKCkge1xuICAgIGlmICh0aGlzLnNoYXBlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaGFwZVN0YWNrW3RoaXMuc2hhcGVTdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG5cbiAgcG9wU2hhcGUoKSB7XG4gICAgaWYgKHRoaXMuc2hhcGVTdGFjay5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNoYXBlU3RhY2sucG9wKCk7XG4gIH1cblxuXG4gIHB1c2hDb21wb3NpdGUoY29tcG9zaXRlKSB7XG4gICAgY29tcG9zaXRlID0gY29tcG9zaXRlID8/IG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMpO1xuICAgIHRoaXMuY29tcG9zaXRlU3RhY2sucHVzaChjb21wb3NpdGUpO1xuICAgIHJldHVybiBjb21wb3NpdGU7XG4gIH1cblxuXG4gIHBlZWtDb21wb3NpdGUoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3NpdGVTdGFja1t0aGlzLmNvbXBvc2l0ZVN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG5cblxuICBwb3BDb21wb3NpdGUoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaXRlU3RhY2subGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb21wb3NpdGVTdGFjay5wb3AoKTtcbiAgfVxuXG59IC8vIGNsYXNzIFJhY1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmFjO1xuXG5cbi8vIEFsbCBjbGFzcyAoc3RhdGljKSBwcm9wZXJ0aWVzIHNob3VsZCBiZSBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIGNsYXNzXG4vLyBhcyB0byBwcmV2ZW50IGN5Y2xpYyBkZXBlbmRlbmN5IHdpdGggUmFjLlxuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZShgLi91dGlsL3V0aWxzYCk7XG4vKipcbiogQ29udGFpbmVyIG9mIHV0aWxpdHkgZnVuY3Rpb25zLiBTZWUgYHtAbGluayB1dGlsc31gIGZvciB0aGUgYXZhaWxhYmxlXG4qIG1lbWJlcnMuXG4qXG4qIEB0eXBlIHtvYmplY3R9XG4qL1xuUmFjLnV0aWxzID0gdXRpbHM7XG5cblxuLyoqXG4qIFZlcnNpb24gb2YgdGhlIGNsYXNzLiBTYW1lIGFzIHRoZSB2ZXJzaW9uIHVzZWQgZm9yIHRoZSBucG0gcGFja2FnZS5cbipcbiogQHR5cGUge3N0cmluZ31cbipcbiogQG5hbWUgdmVyc2lvblxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICd2ZXJzaW9uJywgdmVyc2lvbik7XG5cblxuLyoqXG4qIEJ1aWxkIG9mIHRoZSBjbGFzcy4gSW50ZW5kZWQgZm9yIGRlYnVnZ2luZyBwdXJwb3VzZXMuXG4qXG4qIENvbnRhaW5zIGEgY29tbWl0LWNvdW50IGFuZCBzaG9ydC1oYXNoIG9mIHRoZSByZXBvc2l0b3J5IHdoZW4gdGhlIGJ1aWxkXG4qIHdhcyBkb25lLlxuKlxuKiBAdHlwZSB7c3RyaW5nfVxuKlxuKiBAbmFtZSBidWlsZFxuKiBAbWVtYmVyb2YgUmFjXG4qL1xudXRpbHMuYWRkQ29uc3RhbnRUbyhSYWMsICdidWlsZCcsIGJ1aWxkKTtcblxuXG4vKipcbiogVGF1LCBlcXVhbCB0byBgTWF0aC5QSSAqIDJgLlxuKlxuKiBbVGF1IE1hbmlmZXN0b10oaHR0cHM6Ly90YXVkYXkuY29tL3RhdS1tYW5pZmVzdG8pLlxuKlxuKiBAdHlwZSB7bnVtYmVyfVxuKlxuKiBAbmFtZSBUQVVcbiogQG1lbWJlcm9mIFJhY1xuKi9cbnV0aWxzLmFkZENvbnN0YW50VG8oUmFjLCAnVEFVJywgTWF0aC5QSSAqIDIpO1xuXG5cbi8vIEV4Y2VwdGlvblxuUmFjLkV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FeGNlcHRpb24nKTtcblxuXG4vLyBQcm90b3R5cGUgZnVuY3Rpb25zXG5yZXF1aXJlKCcuL2F0dGFjaFByb3RvRnVuY3Rpb25zJykoUmFjKTtcblxuXG4vLyBQNURyYXdlclxuUmFjLlA1RHJhd2VyID0gcmVxdWlyZSgnLi9wNURyYXdlci9QNURyYXdlcicpO1xuXG5cbi8vIENvbG9yXG5SYWMuQ29sb3IgPSByZXF1aXJlKCcuL3N0eWxlL0NvbG9yJyk7XG5cblxuLy8gU3Ryb2tlXG5SYWMuU3Ryb2tlID0gcmVxdWlyZSgnLi9zdHlsZS9TdHJva2UnKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLlN0cm9rZSk7XG5cblxuLy8gRmlsbFxuUmFjLkZpbGwgPSByZXF1aXJlKCcuL3N0eWxlL0ZpbGwnKTtcblJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMoUmFjLkZpbGwpO1xuXG5cbi8vIFN0eWxlQ29udGFpbmVyXG5SYWMuU3R5bGVDb250YWluZXIgPSByZXF1aXJlKCcuL3N0eWxlL1N0eWxlQ29udGFpbmVyJyk7XG5SYWMuc2V0dXBTdHlsZVByb3RvRnVuY3Rpb25zKFJhYy5TdHlsZUNvbnRhaW5lcik7XG5cblxuLy8gQW5nbGVcblJhYy5BbmdsZSA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQW5nbGUnKTtcblJhYy5BbmdsZS5wcm90b3R5cGUubG9nID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nO1xuXG5cbi8vIFBvaW50XG5SYWMuUG9pbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1BvaW50Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5Qb2ludCk7XG5cblxuLy8gUmF5XG5SYWMuUmF5ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9SYXknKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlJheSk7XG5cblxuLy8gU2VnbWVudFxuUmFjLlNlZ21lbnQgPSByZXF1aXJlKCcuL2RyYXdhYmxlL1NlZ21lbnQnKTtcblJhYy5zZXR1cERyYXdhYmxlUHJvdG9GdW5jdGlvbnMoUmFjLlNlZ21lbnQpO1xuXG5cbi8vIEFyY1xuUmFjLkFyYyA9IHJlcXVpcmUoJy4vZHJhd2FibGUvQXJjJyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5BcmMpO1xuXG5cbi8vIFRleHRcblJhYy5UZXh0ID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9UZXh0Jyk7XG5SYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zKFJhYy5UZXh0KTtcblxuXG4vLyBCZXppZXJcblJhYy5CZXppZXIgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0JlemllcicpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQmV6aWVyKTtcblxuXG4vLyBDb21wb3NpdGVcblJhYy5Db21wb3NpdGUgPSByZXF1aXJlKCcuL2RyYXdhYmxlL0NvbXBvc2l0ZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuQ29tcG9zaXRlKTtcblxuXG4vLyBTaGFwZVxuUmFjLlNoYXBlID0gcmVxdWlyZSgnLi9kcmF3YWJsZS9TaGFwZScpO1xuUmFjLnNldHVwRHJhd2FibGVQcm90b0Z1bmN0aW9ucyhSYWMuU2hhcGUpO1xuXG5cbi8vIEVhc2VGdW5jdGlvblxuUmFjLkVhc2VGdW5jdGlvbiA9IHJlcXVpcmUoJy4vdXRpbC9FYXNlRnVuY3Rpb24nKTtcblxuXG4vLyBDb250cm9sbGVyXG5SYWMuQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vY29udHJvbC9Db250cm9sbGVyJyk7XG5cblxuLy8gQ29udHJvbFxuUmFjLkNvbnRyb2wgPSByZXF1aXJlKCcuL2NvbnRyb2wvQ29udHJvbCcpO1xuXG5cbi8vIFJheUNvbnRyb2xcblJhYy5SYXlDb250cm9sID0gcmVxdWlyZSgnLi9jb250cm9sL1JheUNvbnRyb2wnKTtcblxuXG4vLyBBcmNDb250cm9sXG5SYWMuQXJjQ29udHJvbCA9IHJlcXVpcmUoJy4vY29udHJvbC9BcmNDb250cm9sJyk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuL1JhYycpO1xuXG5cbi8qKlxuKiBUaGlzIG5hbWVzcGFjZSBsaXN0cyB1dGlsaXR5IGZ1bmN0aW9ucyBhdHRhY2hlZCB0byBhbiBpbnN0YW5jZSBvZlxuKiBge0BsaW5rIFJhY31gIHVzZWQgdG8gcHJvZHVjZSBkcmF3YWJsZSBhbmQgb3RoZXIgb2JqZWN0cywgYW5kIHRvIGFjY2Vzc1xuKiByZWFkeS1idWlsZCBjb252ZW5pZW5jZSBvYmplY3RzIGxpa2UgYHtAbGluayBpbnN0YW5jZS5BbmdsZSNub3J0aH1gIG9yXG4qIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gLlxuKlxuKiBEcmF3YWJsZSBhbmQgcmVsYXRlZCBvYmplY3RzIHJlcXVpcmUgYSByZWZlcmVuY2UgdG8gYSBgcmFjYCBpbnN0YW5jZSBpblxuKiBvcmRlciB0byBwZXJmb3JtIGRyYXdpbmcgb3BlcmF0aW9ucy4gVGhlc2UgZnVuY3Rpb25zIGJ1aWxkIG5ldyBvYmplY3RzXG4qIHVzaW5nIHRoZSBjYWxsaW5nIGBSYWNgIGluc3RhbmNlLCBhbmQgY29udGFpbiByZWFkeS1tYWRlIGNvbnZlbmllbmNlXG4qIG9iamVjdHMgdGhhdCBhcmUgYWxzbyBzZXR1cCB3aXRoIHRoZSBzYW1lIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlXG4qL1xuXG5cbi8vIEF0dGFjaGVzIHRoZSBjb252ZW5pZW5jZSBmdW5jdGlvbnMgdG8gY3JlYXRlIG9iamVjdHMgd2l0aCB0aGlzIGluc3RhbmNlXG4vLyBvZiBSYWMuIFRoZXNlIGZ1bmN0aW9ucyBhcmUgYXR0YWNoZWQgYXMgcHJvcGVydGllcyAoaW5zdGVhZCBvZiBpbnRvIHRoZVxuLy8gcHJvdG90eXBlKSBiZWNhdXNlIHRoZXNlIGFyZSBsYXRlciBwb3B1bGF0ZWQgd2l0aCBtb3JlIHByb3BlcnRpZXMgYW5kXG4vLyBtZXRob2RzLCBhbmQgdGh1cyBuZWVkIHRvIGJlIGFuIGluZGVwZW5kZW50IGluc3RhbmNlLlxuLy9cbi8vIEludGVuZGVkIHRvIHJlY2VpdmUgdGhlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnMocmFjKSB7XG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBDb2xvcmAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Db2xvcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJcbiAgKiBAcGFyYW0ge251bWJlcn0gZ1xuICAqIEBwYXJhbSB7bnVtYmVyfSBiXG4gICogQHBhcmFtIHtudW1iZXI9fSBhXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5Db2xvclxuICAqXG4gICogQGZ1bmN0aW9uIENvbG9yXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkNvbG9yID0gZnVuY3Rpb24gbWFrZUNvbG9yKHIsIGcsIGIsIGEgPSAxKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuQ29sb3IodGhpcywgciwgZywgYiwgYSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFN0cm9rZWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5TdHJva2V9YC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gd2VpZ2h0XG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBjb2xvclxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHJva2V9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlN0cm9rZVxuICAqXG4gICogQGZ1bmN0aW9uIFN0cm9rZVxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5TdHJva2UgPSBmdW5jdGlvbiBtYWtlU3Ryb2tlKHdlaWdodCwgY29sb3IgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3Ryb2tlKHRoaXMsIHdlaWdodCwgY29sb3IpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBGaWxsYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkZpbGx9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbG9yPX0gY29sb3JcbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkZpbGxcbiAgKlxuICAqIEBmdW5jdGlvbiBGaWxsXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkZpbGwgPSBmdW5jdGlvbiBtYWtlRmlsbChjb2xvciA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5GaWxsKHRoaXMsIGNvbG9yKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgU3R5bGVgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU3R5bGV9YC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V9IHN0cm9rZVxuICAqIEBwYXJhbSB7P1JhYy5GaWxsfSBmaWxsXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlfVxuICAqXG4gICogQHNlZSBpbnN0YW5jZS5TdHlsZVxuICAqXG4gICogQGZ1bmN0aW9uIFN0eWxlXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlN0eWxlID0gZnVuY3Rpb24gbWFrZVN0eWxlKHN0cm9rZSA9IG51bGwsIGZpbGwgPSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGUodGhpcywgc3Ryb2tlLCBmaWxsKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQW5nbGVgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGV9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWUgb2YgdGhlIGFuZ2xlLCBpbiB0aGUgcmFuZ2UgYFtPLDEpYFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlXG4gICpcbiAgKiBAZnVuY3Rpb24gQW5nbGVcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuQW5nbGUgPSBmdW5jdGlvbiBtYWtlQW5nbGUodHVybikge1xuICAgIHJldHVybiBuZXcgUmFjLkFuZ2xlKHRoaXMsIHR1cm4pO1xuICB9O1xuXG5cbiAgLyoqXG4gICogQ29udmVuaWVuY2UgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgbmV3IGBQb2ludGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBQb2ludFxuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5Qb2ludCA9IGZ1bmN0aW9uIG1ha2VQb2ludCh4LCB5KSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFJheWAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5SYXl9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuUmF5XG4gICpcbiAgKiBAZnVuY3Rpb24gUmF5XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlJheSA9IGZ1bmN0aW9uIG1ha2VSYXkoeCwgeSwgYW5nbGUpIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgeCwgeSk7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYFNlZ21lbnRgIHNldHVwIHdpdGggYHRoaXNgLlxuICAqXG4gICogVGhlIGZ1bmN0aW9uIGFsc28gY29udGFpbnMgYWRkaXRpb25hbCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGxpc3RlZCBpblxuICAqIGB7QGxpbmsgaW5zdGFuY2UuU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgKiBAcGFyYW0ge251bWJlcn0geVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGVcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLlNlZ21lbnRcbiAgKlxuICAqIEBmdW5jdGlvbiBTZWdtZW50XG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLlNlZ21lbnQgPSBmdW5jdGlvbiBtYWtlU2VnbWVudCh4LCB5LCBhbmdsZSwgbGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcywgYW5nbGUpO1xuICAgIGNvbnN0IHJheSA9IG5ldyBSYWMuUmF5KHRoaXMsIHN0YXJ0LCBhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLCByYXksIGxlbmd0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBuZXcgYEFyY2Agc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5BcmN9YC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHN0YXJ0XG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfG51bWJlcn0gW2VuZD1udWxsXVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXVxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICpcbiAgKiBAc2VlIGluc3RhbmNlLkFyY1xuICAqXG4gICogQGZ1bmN0aW9uIEFyY1xuICAqIEBtZW1iZXJvZiBSYWMjXG4gICovXG4gIHJhYy5BcmMgPSBmdW5jdGlvbiBtYWtlQXJjKHgsIHksIHJhZGl1cywgc3RhcnQgPSB0aGlzLkFuZ2xlLnplcm8sIGVuZCA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBjZW50ZXIgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHN0YXJ0ID0gUmFjLkFuZ2xlLmZyb20odGhpcywgc3RhcnQpO1xuICAgIGVuZCA9IGVuZCA9PT0gbnVsbFxuICAgICAgPyBzdGFydFxuICAgICAgOiBSYWMuQW5nbGUuZnJvbSh0aGlzLCBlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnQsIGVuZCwgY2xvY2t3aXNlKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgVGV4dGAgc2V0dXAgd2l0aCBgdGhpc2AuXG4gICpcbiAgKiBUaGUgZnVuY3Rpb24gYWxzbyBjb250YWlucyBhZGRpdGlvbmFsIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgbGlzdGVkIGluXG4gICogYHtAbGluayBpbnN0YW5jZS5UZXh0fWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBmb3JtYXRcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuVGV4dH1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuVGV4dFxuICAqXG4gICogQGZ1bmN0aW9uIFRleHRcbiAgKiBAbWVtYmVyb2YgUmFjI1xuICAqL1xuICByYWMuVGV4dCA9IGZ1bmN0aW9uIG1ha2VUZXh0KHgsIHksIHN0cmluZywgZm9ybWF0KSB7XG4gICAgY29uc3QgcG9pbnQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIHgsIHkpO1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIG5ldyBgQmV6aWVyYCBzZXR1cCB3aXRoIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBhbHNvIGNvbnRhaW5zIGFkZGl0aW9uYWwgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBsaXN0ZWQgaW5cbiAgKiBge0BsaW5rIGluc3RhbmNlLkJlemllcn1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0WFxuICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFlcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0QW5jaG9yWVxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRBbmNob3JYXG4gICogQHBhcmFtIHtudW1iZXJ9IGVuZEFuY2hvcllcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kWFxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRZXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkJlemllcn1cbiAgKlxuICAqIEBzZWUgaW5zdGFuY2UuQmV6aWVyXG4gICpcbiAgKiBAZnVuY3Rpb24gQmV6aWVyXG4gICogQG1lbWJlcm9mIFJhYyNcbiAgKi9cbiAgcmFjLkJlemllciA9IGZ1bmN0aW9uIG1ha2VCZXppZXIoXG4gICAgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5jaG9yWCwgc3RhcnRBbmNob3JZLFxuICAgIGVuZEFuY2hvclgsIGVuZEFuY2hvclksIGVuZFgsIGVuZFkpXG4gIHtcbiAgICBjb25zdCBzdGFydCA9IG5ldyBSYWMuUG9pbnQodGhpcywgc3RhcnRYLCBzdGFydFkpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBzdGFydEFuY2hvclgsIHN0YXJ0QW5jaG9yWSk7XG4gICAgY29uc3QgZW5kQW5jaG9yID0gbmV3IFJhYy5Qb2ludCh0aGlzLCBlbmRBbmNob3JYLCBlbmRBbmNob3JZKTtcbiAgICBjb25zdCBlbmQgPSBuZXcgUmFjLlBvaW50KHRoaXMsIGVuZFgsIGVuZFkpO1xuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoSW5zdGFuY2VGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlsL3V0aWxzJyk7XG5cblxuLy8gQXR0YWNoZXMgdXRpbGl0eSBmdW5jdGlvbnMgdG8gYSBSYWMgaW5zdGFuY2UgdGhhdCBhZGQgZnVuY3Rpb25zIHRvIGFsbFxuLy8gZHJhd2FibGUgYW5kIHN0eWxlIGNsYXNzIHByb3RvdHlwZXMuXG4vL1xuLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSB0aGUgUmFjIGNsYXNzIGFzIHBhcmFtZXRlci5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUHJvdG9GdW5jdGlvbnMoUmFjKSB7XG5cbiAgZnVuY3Rpb24gYXNzZXJ0RHJhd2VyKGRyYXdhYmxlKSB7XG4gICAgaWYgKGRyYXdhYmxlLnJhYyA9PSBudWxsIHx8IGRyYXdhYmxlLnJhYy5kcmF3ZXIgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5kcmF3ZXJOb3RTZXR1cChcbiAgICAgICAgYGRyYXdhYmxlLXR5cGU6JHt1dGlscy50eXBlTmFtZShkcmF3YWJsZSl9YCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3IgZHJhd2FibGUgY2xhc3Nlcy5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBkcmF3YWJsZSBvYmplY3RzIChFLmcuIGBkcmF3KClgIGFuZCBgZGVidWcoKWApLlxuICBSYWMuc2V0dXBEcmF3YWJsZVByb3RvRnVuY3Rpb25zID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBPYmplY3Qua2V5cyhSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNsYXNzT2JqLnByb3RvdHlwZVtuYW1lXSA9IFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zW25hbWVdO1xuICAgIH0pO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5kcmF3ID0gZnVuY3Rpb24oc3R5bGUgPSBudWxsKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmRyYXdPYmplY3QodGhpcywgc3R5bGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuZGVidWcgPSBmdW5jdGlvbihkcmF3c1RleHQgPSBmYWxzZSl7XG4gICAgYXNzZXJ0RHJhd2VyKHRoaXMpO1xuICAgIHRoaXMucmFjLmRyYXdlci5kZWJ1Z09iamVjdCh0aGlzLCBkcmF3c1RleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nID0gZnVuY3Rpb24obWVzc2FnZSA9IG51bGwpe1xuICAgIGxldCBjb2FsZXNjZWRNZXNzYWdlID0gbWVzc2FnZSA/PyAnJW8nO1xuICAgIGNvbnNvbGUubG9nKGNvYWxlc2NlZE1lc3NhZ2UsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLnB1c2hTdGFjayh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmFjLnBvcFN0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucGVla1N0YWNrKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvU2hhcGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrU2hhcGUoKS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJhYy5wb3BTaGFwZSgpO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BTaGFwZVRvQ29tcG9zaXRlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNoYXBlID0gdGhpcy5yYWMucG9wU2hhcGUoKTtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHNoYXBlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMuYXR0YWNoVG9Db21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhYy5wZWVrQ29tcG9zaXRlKCkuYWRkKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICBSYWMuZHJhd2FibGVQcm90b0Z1bmN0aW9ucy5wb3BDb21wb3NpdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yYWMucG9wQ29tcG9zaXRlKCk7XG4gIH1cblxuXG4gIFJhYy5kcmF3YWJsZVByb3RvRnVuY3Rpb25zLmF0dGFjaFRvID0gZnVuY3Rpb24oc29tZUNvbXBvc2l0ZSkge1xuICAgIGlmIChzb21lQ29tcG9zaXRlIGluc3RhbmNlb2YgUmFjLkNvbXBvc2l0ZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGQodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAoc29tZUNvbXBvc2l0ZSBpbnN0YW5jZW9mIFJhYy5TaGFwZSkge1xuICAgICAgc29tZUNvbXBvc2l0ZS5hZGRPdXRsaW5lKHRoaXMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0VHlwZShcbiAgICAgIGBDYW5ub3QgYXR0YWNoVG8gY29tcG9zaXRlIC0gc29tZUNvbXBvc2l0ZS10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZUNvbXBvc2l0ZSl9YCk7XG4gIH07XG5cblxuICAvLyBDb250YWluZXIgb2YgcHJvdG90eXBlIGZ1bmN0aW9ucyBmb3Igc3R5bGUgY2xhc3Nlcy5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMgPSB7fTtcblxuICAvLyBBZGRzIHRvIHRoZSBnaXZlbiBjbGFzcyBwcm90b3R5cGUgYWxsIHRoZSBmdW5jdGlvbnMgY29udGFpbmVkIGluXG4gIC8vIGBSYWMuc3R5bGVQcm90b0Z1bmN0aW9uc2AuIFRoZXNlIGFyZSBmdW5jdGlvbnMgc2hhcmVkIGJ5IGFsbFxuICAvLyBzdHlsZSBvYmplY3RzIChFLmcuIGBhcHBseSgpYCkuXG4gIFJhYy5zZXR1cFN0eWxlUHJvdG9GdW5jdGlvbnMgPSBmdW5jdGlvbihjbGFzc09iaikge1xuICAgIE9iamVjdC5rZXlzKFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY2xhc3NPYmoucHJvdG90eXBlW25hbWVdID0gUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnNbbmFtZV07XG4gICAgfSk7XG4gIH1cblxuXG4gIFJhYy5zdHlsZVByb3RvRnVuY3Rpb25zLmFwcGx5ID0gZnVuY3Rpb24oKXtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLmFwcGx5T2JqZWN0KHRoaXMpO1xuICB9O1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMubG9nID0gUmFjLmRyYXdhYmxlUHJvdG9GdW5jdGlvbnMubG9nO1xuXG5cbiAgUmFjLnN0eWxlUHJvdG9GdW5jdGlvbnMuYXBwbHlUb0NsYXNzID0gZnVuY3Rpb24oY2xhc3NPYmopIHtcbiAgICBhc3NlcnREcmF3ZXIodGhpcyk7XG4gICAgdGhpcy5yYWMuZHJhd2VyLnNldENsYXNzRHJhd1N0eWxlKGNsYXNzT2JqLCB0aGlzKTtcbiAgfTtcblxufTsgLy8gYXR0YWNoUHJvdG9GdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IGFsbG93cyB0aGUgc2VsZWN0aW9uIG9mIGEgdmFsdWUgd2l0aCBhIGtub2IgdGhhdCBzbGlkZXNcbiogdGhyb3VnaCB0aGUgc2VjdGlvbiBvZiBhbiBgQXJjYC5cbipcbiogVXNlcyBhbiBgQXJjYCBhcyBgW2FuY2hvcl17QGxpbmsgUmFjLkFyY0NvbnRyb2wjYW5jaG9yfWAsIHdoaWNoIGRlZmluZXNcbiogdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBjb250cm9sIGlzIGRyYXduLlxuKlxuKiBgW2FuZ2xlRGlzdGFuY2Vde0BsaW5rIFJhYy5BcmNDb250cm9sI2FuZ2xlRGlzdGFuY2V9YCBkZWZpbmVzIHRoZVxuKiBzZWN0aW9uIG9mIHRoZSBgYW5jaG9yYCBhcmMgd2hpY2ggaXMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuKiBXaXRoaW4gdGhpcyBzZWN0aW9uIHRoZSB1c2VyIGNhbiBzbGlkZSB0aGUgY29udHJvbCBrbm9iIHRvIHNlbGVjdCBhXG4qIHZhbHVlLlxuKlxuKiBAYWxpYXMgUmFjLkFyY0NvbnRyb2xcbiogQGV4dGVuZHMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBBcmNDb250cm9sIGV4dGVuZHMgUmFjLkNvbnRyb2wge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEFyY0NvbnRyb2xgIGluc3RhbmNlIHdpdGggdGhlIHN0YXJ0aW5nIGB2YWx1ZWAgYW5kIHRoZVxuICAqIGludGVyYWN0aXZlIGBhbmdsZURpc3RhbmNlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGVEaXN0YW5jZSBvZiB0aGUgYGFuY2hvcmBcbiAgKiAgIGFyYyBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb25cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB2YWx1ZSwgYW5nbGVEaXN0YW5jZSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlRGlzdGFuY2UpO1xuXG4gICAgc3VwZXIocmFjLCB2YWx1ZSk7XG5cbiAgICAvKipcbiAgICAqIEFuZ2xlIGRpc3RhbmNlIG9mIHRoZSBgYW5jaG9yYCBhcmMgYXZhaWxhYmxlIGZvciB1c2VyIGludGVyYWN0aW9uLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYW5nbGVEaXN0YW5jZSA9IFJhYy5BbmdsZS5mcm9tKHJhYywgYW5nbGVEaXN0YW5jZSk7XG5cbiAgICAvKipcbiAgICAqIGBBcmNgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIERlZmluZXMgdGhlIGxvY2F0aW9uXG4gICAgKiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbiAgICAqXG4gICAgKiBBbG9uZyB3aXRoIGBbYW5nbGVEaXN0YW5jZV17QGxpbmsgUmFjLkFyY0NvbnRyb2wjYW5nbGVEaXN0YW5jZX1gXG4gICAgKiBkZWZpbmVzIHRoZSBzZWN0aW9uIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBUaGUgY29udHJvbCBjYW5ub3QgYmUgZHJhd24gb3Igc2VsZWN0ZWQgdW50aWwgdGhpcyBwcm9wZXJ0eSBpcyBzZXQuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BcmM/fVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5hbmNob3IgPSBudWxsO1xuXG4gICAgaWYgKHJhYy5jb250cm9sbGVyLmF1dG9BZGRDb250cm9scykge1xuICAgICAgcmFjLmNvbnRyb2xsZXIuYWRkKHRoaXMpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBgdmFsdWVgIHVzaW5nIHRoZSBwcm9qZWN0aW9uIG9mIGB2YWx1ZUFuZ2xlRGlzdGFuY2UudHVybmAgaW4gdGhlXG4gICogYFswLGFuZ2xlTGVuZ3RoLnR1cm5dYCByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gdmFsdWVBbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGF0XG4gICogICB3aGljaCB0byBzZXQgdGhlIGN1cnJlbnQgdmFsdWVcbiAgKi9cbiAgc2V0VmFsdWVXaXRoQW5nbGVEaXN0YW5jZSh2YWx1ZUFuZ2xlRGlzdGFuY2UpIHtcbiAgICB2YWx1ZUFuZ2xlRGlzdGFuY2UgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgdmFsdWVBbmdsZURpc3RhbmNlKVxuICAgIGxldCBkaXN0YW5jZVJhdGlvID0gdmFsdWVBbmdsZURpc3RhbmNlLnR1cm4gLyB0aGlzLmFuZ2xlRGlzdGFuY2UudHVybk9uZSgpO1xuICAgIHRoaXMudmFsdWUgPSBkaXN0YW5jZVJhdGlvO1xuICB9XG5cblxuICAvKipcbiAgKiBTZXRzIGJvdGggYHN0YXJ0TGltaXRgIGFuZCBgZW5kTGltaXRgIHdpdGggdGhlIGdpdmVuIGluc2V0cyBmcm9tIGAwYFxuICAqIGFuZCBgZW5kSW5zZXQudHVybmAsIGNvcnJlc3BvbmRpbmdseSwgYm90aCBwcm9qZWN0ZWQgaW4gdGhlXG4gICogYFswLGFuZ2xlRGlzdGFuY2UudHVybl1gIHJhbmdlLlxuICAqXG4gICogPiBFLmcuXG4gICogPiBgYGBcbiAgKiA+IC8vIEZvciBhbiBBcmNDb250cm9sIHdpdGggYW5nbGUgZGlzdGFuY2Ugb2YgMC41IHR1cm5cbiAgKiA+IGNvbnRyb2wuc2V0TGltaXRzV2l0aEFuZ2xlRGlzdGFuY2VJbnNldHMoMC4xLCAwLjMpXG4gICogPiAvLyBzZXRzIHN0YXJ0TGltaXQgYXMgMC4yIHdoaWNoIGlzIGF0IGFuZ2xlIGRpc3RhbmNlIDAuMVxuICAqID4gLy8gc2V0cyBlbmRMaW1pdCAgIGFzIDAuNCB3aGljaCBpcyBhdCBhbmdsZSBkaXN0YW5jZSAwLjJcbiAgKiA+IC8vICAgMC4xIGluc2V0IGZyb20gMCAgID0gMC4xXG4gICogPiAvLyAgIDAuMyBpbnNldCBmcm9tIDAuNSA9IDAuMlxuICAqID4gYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGVuZEluc2V0IC0gVGhlIGluc2V0IGZyb20gYGFuZ2xlRGlzdGFuY2UudHVybmBcbiAgKiAgIGluIHRoZSByYW5nZSBgWzAsYW5nbGVEaXN0YW5jZS50dXJuXWAgdG8gdXNlIGZvciBgZW5kTGltaXRgXG4gICovXG4gIHNldExpbWl0c1dpdGhBbmdsZURpc3RhbmNlSW5zZXRzKHN0YXJ0SW5zZXQsIGVuZEluc2V0KSB7XG4gICAgc3RhcnRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBzdGFydEluc2V0KTtcbiAgICBlbmRJbnNldCA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRJbnNldCk7XG4gICAgdGhpcy5zdGFydExpbWl0ID0gc3RhcnRJbnNldC50dXJuIC8gdGhpcy5hbmdsZURpc3RhbmNlLnR1cm5PbmUoKTtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCkgLSBlbmRJbnNldC50dXJuKSAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlICBbYW5nbGUgYGRpc3RhbmNlYF17QGxpbmsgUmFjLkFuZ2xlI2Rpc3RhbmNlfSBiZXR3ZWVuIHRoZVxuICAqIGBhbmNob3JgIGFyYyBgc3RhcnRgIGFuZCB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogVGhlIGB0dXJuYCBvZiB0aGUgcmV0dXJuZWQgYEFuZ2xlYCBpcyBlcXVpdmFsZW50IHRvIHRoZSBjb250cm9sIGB2YWx1ZWBcbiAgKiBwcm9qZWN0ZWQgdG8gdGhlIHJhbmdlIGBbMCxhbmdsZURpc3RhbmNlLnR1cm5dYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGRpc3RhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLmFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY29udHJvbCBrbm9iLlxuICAqXG4gICogV2hlbiBgYW5jaG9yYCBpcyBub3Qgc2V0LCByZXR1cm5zIGBudWxsYCBpbnN0ZWFkLlxuICAqXG4gICogQHJldHVybiB7UmFjLlBvaW50P31cbiAgKi9cbiAga25vYigpIHtcbiAgICBpZiAodGhpcy5hbmNob3IgPT09IG51bGwpIHtcbiAgICAgIC8vIE5vdCBwb3NpYmxlIHRvIGNhbGN1bGF0ZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXRBbmdsZURpc3RhbmNlKHRoaXMuZGlzdGFuY2UoKSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcHJvZHVjZWQgd2l0aCB0aGUgYGFuY2hvcmAgYXJjIHdpdGhcbiAgKiBgYW5nbGVEaXN0YW5jZWAsIHRvIGJlIHBlcnNpc3RlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgYW5jaG9yYCBpcyBub3Qgc2V0LlxuICAqXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFmZml4QW5jaG9yKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbihcbiAgICAgICAgYEV4cGVjdGVkIGFuY2hvciB0byBiZSBzZXQsIG51bGwgZm91bmQgaW5zdGVhZGApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hbmNob3Iud2l0aEFuZ2xlRGlzdGFuY2UodGhpcy5hbmdsZURpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgLy8gQXJjIGFuY2hvciBpcyBhbHdheXMgZHJhd24gd2l0aG91dCBmaWxsXG4gICAgbGV0IGFuY2hvclN0eWxlID0gY29udHJvbFN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnJhYy5GaWxsLm5vbmUpXG4gICAgICA6IHRoaXMucmFjLkZpbGwubm9uZTtcblxuICAgIGZpeGVkQW5jaG9yLmRyYXcoYW5jaG9yU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5jZW50ZXIuYW5nbGVUb1BvaW50KGtub2IpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyQW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZS5tdWx0T25lKGl0ZW0pO1xuICAgICAgbGV0IG1hcmtlckFuZ2xlID0gZml4ZWRBbmNob3Iuc2hpZnRBbmdsZShtYXJrZXJBbmdsZURpc3RhbmNlKTtcbiAgICAgIGxldCBwb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXJrZXJBbmdsZSk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlVmFsdWVNYXJrZXIodGhpcy5yYWMsIHBvaW50LCBtYXJrZXJBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIENvbnRyb2wga25vYlxuICAgIGtub2IuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gTmVnYXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA+PSB0aGlzLnN0YXJ0TGltaXQgKyB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQpIHtcbiAgICAgIGxldCBuZWdBbmdsZSA9IGFuZ2xlLnBlcnBlbmRpY3VsYXIoZml4ZWRBbmNob3IuY2xvY2t3aXNlKS5pbnZlcnNlKCk7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgbmVnQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aXZlIGFycm93XG4gICAgaWYgKHRoaXMudmFsdWUgPD0gdGhpcy5lbmRMaW1pdCAtIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgbGV0IHBvc0FuZ2xlID0gYW5nbGUucGVycGVuZGljdWxhcihmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIHBvc0FuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnJhYy5wb3BDb21wb3NpdGUoKS5kcmF3KGNvbnRyb2xTdHlsZSk7XG5cbiAgICAvLyBTZWxlY3Rpb25cbiAgICBpZiAodGhpcy5pc1NlbGVjdGVkKCkpIHtcbiAgICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLnBvaW50ZXJTdHlsZTtcbiAgICAgIGlmIChwb2ludGVyU3R5bGUgIT09IG51bGwpIHtcbiAgICAgICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41KS5kcmF3KHBvaW50ZXJTdHlsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqXG4gICogYHZhbHVlYCBpcyBhbHdheXMgdXBkYXRlZCBieSB0aGlzIG1ldGhvZCB0byBiZSB3aXRoaW4gKlswLDFdKiBhbmRcbiAgKiBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7UmFjLkFyY30gZml4ZWRBbmNob3IgLSBBbmNob3IgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgIHdoZW5cbiAgKiAgIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgYW5nbGVEaXN0YW5jZSA9IGZpeGVkQW5jaG9yLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSh0aGlzLnN0YXJ0TGltaXQpO1xuICAgIGxldCBlbmRJbnNldCA9IGFuZ2xlRGlzdGFuY2UubXVsdE9uZSgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICBsZXQgc2VsZWN0aW9uQW5nbGUgPSBmaXhlZEFuY2hvci5jZW50ZXJcbiAgICAgIC5hbmdsZVRvUG9pbnQocG9pbnRlcktub2JDZW50ZXIpO1xuICAgIHNlbGVjdGlvbkFuZ2xlID0gZml4ZWRBbmNob3IuY2xhbXBUb0FuZ2xlcyhzZWxlY3Rpb25BbmdsZSxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcbiAgICBsZXQgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5kaXN0YW5jZUZyb21TdGFydChzZWxlY3Rpb25BbmdsZSk7XG5cbiAgICAvLyBVcGRhdGUgY29udHJvbCB3aXRoIG5ldyBkaXN0YW5jZVxuICAgIGxldCBkaXN0YW5jZVJhdGlvID0gbmV3RGlzdGFuY2UudHVybiAvIHRoaXMuYW5nbGVEaXN0YW5jZS50dXJuT25lKCk7XG4gICAgdGhpcy52YWx1ZSA9IGRpc3RhbmNlUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuQXJjfSBmaXhlZEFuY2hvciAtIGBBcmNgIHByb2R1Y2VkIHdpdGggYGFmZml4QW5jaG9yYCB3aGVuXG4gICogICB1c2VyIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgIGlmIChwb2ludGVyU3R5bGUgPT09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBBcmMgYW5jaG9yIGlzIGFsd2F5cyBkcmF3biB3aXRob3V0IGZpbGxcbiAgICBsZXQgYW5jaG9yU3R5bGUgPSBwb2ludGVyU3R5bGUuYXBwZW5kU3R5bGUodGhpcy5yYWMuRmlsbC5ub25lKTtcbiAgICBmaXhlZEFuY2hvci5kcmF3KGFuY2hvclN0eWxlKTtcblxuICAgIGxldCBhbmdsZURpc3RhbmNlID0gZml4ZWRBbmNob3IuYW5nbGVEaXN0YW5jZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBmaXhlZEFuY2hvci5zaGlmdEFuZ2xlKGFuZ2xlRGlzdGFuY2UubXVsdE9uZShpdGVtKSk7XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBmaXhlZEFuY2hvci5wb2ludEF0QW5nbGUobWFya2VyQW5nbGUpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBtYXJrZXJQb2ludCwgbWFya2VyQW5nbGUucGVycGVuZGljdWxhcighZml4ZWRBbmNob3IuY2xvY2t3aXNlKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaW1pdCBtYXJrZXJzXG4gICAgaWYgKHRoaXMuc3RhcnRMaW1pdCA+IDApIHtcbiAgICAgIGxldCBtaW5BbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuc3RhcnRMaW1pdCkpO1xuICAgICAgbGV0IG1pblBvaW50ID0gZml4ZWRBbmNob3IucG9pbnRBdEFuZ2xlKG1pbkFuZ2xlKTtcbiAgICAgIGxldCBtYXJrZXJBbmdsZSA9IG1pbkFuZ2xlLnBlcnBlbmRpY3VsYXIoZml4ZWRBbmNob3IuY2xvY2t3aXNlKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIG1hcmtlckFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmRMaW1pdCA8IDEpIHtcbiAgICAgIGxldCBtYXhBbmdsZSA9IGZpeGVkQW5jaG9yLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZS5tdWx0T25lKHRoaXMuZW5kTGltaXQpKTtcbiAgICAgIGxldCBtYXhQb2ludCA9IGZpeGVkQW5jaG9yLnBvaW50QXRBbmdsZShtYXhBbmdsZSk7XG4gICAgICBsZXQgbWFya2VyQW5nbGUgPSBtYXhBbmdsZS5wZXJwZW5kaWN1bGFyKCFmaXhlZEFuY2hvci5jbG9ja3dpc2UpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgbWFya2VyQW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIC8vIFNlZ21lbnQgZnJvbSBwb2ludGVyIHRvIGNvbnRyb2wgZHJhZ2dlZCBjZW50ZXJcbiAgICBsZXQgZHJhZ2dlZENlbnRlciA9IHBvaW50ZXJUb0tub2JPZmZzZXRcbiAgICAgIC53aXRoU3RhcnRQb2ludChwb2ludGVyQ2VudGVyKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIGRyYWdnZWQgY2VudGVyLCBhdHRhY2hlZCB0byBwb2ludGVyXG4gICAgZHJhZ2dlZENlbnRlci5hcmMoMilcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuXG4gICAgLy8gVE9ETzogaW1wbGVtZW50IGFyYyBjb250cm9sIGRyYWdnaW5nIHZpc3VhbHMhXG4gIH1cblxufSAvLyBjbGFzcyBBcmNDb250cm9sXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBcmNDb250cm9sO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxubGV0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xubGV0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBBYnN0cmFjdCBjbGFzcyBmb3IgY29udHJvbHMgdGhhdCBzZWxlY3QgYSB2YWx1ZSB3aXRoaW4gYSByYW5nZS5cbipcbiogQ29udHJvbHMgbWF5IHVzZSBhbiBgYW5jaG9yYCBvYmplY3QgdG8gZGV0ZXJtaW5lIHRoZSB2aXN1YWwgcG9zaXRpb24gb2ZcbiogdGhlIGNvbnRyb2wncyBpbnRlcmFjdGl2ZSBlbGVtZW50cy4gRWFjaCBpbXBsZW1lbnRhdGlvbiBkZXRlcm1pbmVzIHRoZVxuKiBjbGFzcyB1c2VkIGZvciB0aGlzIGBhbmNob3JgLCBmb3IgZXhhbXBsZVxuKiBgW0FyY0NvbnRyb2xde0BsaW5rIFJhYy5BcmNDb250cm9sfWAgdXNlcyBhbiBgW0FyY117QGxpbmsgUmFjLkFyY31gIGFzXG4qIGFuY2hvciwgd2hpY2ggZGVmaW5lcyB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3biwgd2hhdCBvcmllbnRhdGlvbiBpdFxuKiB1c2VzLCBhbmQgdGhlIHBvc2l0aW9uIG9mIHRoZSBjb250cm9sIGtub2IgdGhyb3VnaCB0aGUgcmFuZ2Ugb2YgcG9zc2libGVcbiogdmFsdWVzLlxuKlxuKiBBIGNvbnRyb2wga2VlcHMgYSBgdmFsdWVgIHByb3BlcnR5IGluIHRoZSByYW5nZSAqWzAsMV0qIGZvciB0aGUgY3VycmVudGx5XG4qIHNlbGVjdGVkIHZhbHVlLlxuKlxuKiBUaGUgYHByb2plY3Rpb25TdGFydGAgYW5kIGBwcm9qZWN0aW9uRW5kYCBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvXG4qIHByb2plY3QgYHZhbHVlYCBpbnRvIHRoZSByYW5nZSBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAgYnkgdXNpbmdcbiogdGhlIGBwcm9qZWN0ZWRWYWx1ZSgpYCBtZXRob2QuIEJ5IGRlZmF1bHQgc2V0IHRvICpbMCwxXSouXG4qXG4qIFRoZSBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgY2FuIGJlIHVzZWQgdG8gcmVzdHJhaW4gdGhlIGFsbG93YWJsZVxuKiB2YWx1ZXMgdGhhdCBjYW4gYmUgc2VsZWN0ZWQgdGhyb3VnaCB1c2VyIGludGVyYWN0aW9uLiBCeSBkZWZhdWx0IHNldCB0b1xuKiAqWzAsMV0qLlxuKlxuKiBAYWxpYXMgUmFjLkNvbnRyb2xcbiovXG5jbGFzcyBDb250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb250cm9sYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICB1dGlscy5hc3NlcnROdW1iZXIodmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIEN1cnJlbnQgc2VsZWN0ZWQgdmFsdWUsIGluIHRoZSByYW5nZSAqWzAsMV0qLlxuICAgICpcbiAgICAqIE1heSBiZSBmdXJ0aGVyIGNvbnN0cmFpbmVkIHRvIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAvKipcbiAgICAqIFtQcm9qZWN0ZWQgdmFsdWVde0BsaW5rIFJhYy5Db250cm9sI3Byb2plY3RlZFZhbHVlfSB0byB1c2Ugd2hlblxuICAgICogYHZhbHVlYCBpcyBgMGAuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqIEBkZWZhdWx0IDBcbiAgICAqL1xuICAgIHRoaXMucHJvamVjdGlvblN0YXJ0ID0gMDtcblxuICAgIC8qKlxuICAgICogW1Byb2plY3RlZCB2YWx1ZV17QGxpbmsgUmFjLkNvbnRyb2wjcHJvamVjdGVkVmFsdWV9IHRvIHVzZSB3aGVuXG4gICAgKiBgdmFsdWVgIGlzIGAxYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5wcm9qZWN0aW9uRW5kID0gMTtcblxuICAgIC8qKlxuICAgICogTWluaW11bSBgdmFsdWVgIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICogQGRlZmF1bHQgMFxuICAgICovXG4gICAgdGhpcy5zdGFydExpbWl0ID0gMDtcblxuICAgIC8qKlxuICAgICogTWF4aW11bSBgdmFsdWVgIHRoYXQgY2FuIGJlIHNlbGVjdGVkIHRocm91Z2ggdXNlciBpbnRlcmFjdGlvbi5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICogQGRlZmF1bHQgMVxuICAgICovXG4gICAgdGhpcy5lbmRMaW1pdCA9IDE7XG5cbiAgICAvKipcbiAgICAqIENvbGxlY3Rpb24gb2YgdmFsdWVzIGF0IHdoaWNoIHZpc3VhbCBtYXJrZXJzIGFyZSBkcmF3bi5cbiAgICAqXG4gICAgKiBAdHlwZSB7bnVtYmVyW119XG4gICAgKiBAZGVmYXVsdCBbXVxuICAgICovXG4gICAgdGhpcy5tYXJrZXJzID0gW107XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHRvIGFwcGx5IHdoZW4gZHJhd2luZy4gVGhpcyBzdHlsZSBnZXRzIGFwcGxpZWQgYWZ0ZXJcbiAgICAqIGBbcmFjLmNvbnRyb2xsZXIuY29udHJvbFN0eWxlXXtAbGluayBSYWMuQ29udHJvbGxlciNjb250cm9sU3R5bGV9YC5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBbc3R5bGU9bnVsbF1cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuc3R5bGUgPSBudWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB2YWx1ZWAgcHJvamVjdGVkIGludG8gdGhlIHJhbmdlXG4gICogYFtwcm9qZWN0aW9uU3RhcnQscHJvamVjdGlvbkVuZF1gLlxuICAqXG4gICogQnkgZGVmYXVsdCB0aGUgcHJvamVjdGlvbiByYW5nZSBpcyAqWzAsMV0qLCBpbiB3aGljaCBjYXNlIGB2YWx1ZWAgYW5kXG4gICogYHByb2plY3RlZFZhbHVlKClgIGFyZSBlcXVhbC5cbiAgKlxuICAqIFByb2plY3Rpb24gcmFuZ2VzIHdpdGggYSBuZWdhdGl2ZSBkaXJlY3Rpb24gKEUuZy4gKls1MCwzMF0qLCB3aGVuXG4gICogYHByb2plY3Rpb25TdGFydGAgaXMgZ3JlYXRlciB0aGF0IGBwcm9qZWN0aW9uRW5kYCkgYXJlIHN1cHBvcnRlZC4gQXNcbiAgKiBgdmFsdWVgIGluY3JlYXNlcywgdGhlIHByb2plY3Rpb24gcmV0dXJuZWQgZGVjcmVhc2VzIGZyb21cbiAgKiBgcHJvamVjdGlvblN0YXJ0YCB1bnRpbCByZWFjaGluZyBgcHJvamVjdGlvbkVuZGAuXG4gICpcbiAgKiA+IEUuZy5cbiAgKiA+IGBgYFxuICAqID4gRm9yIGEgY29udHJvbCB3aXRoIGEgcHJvamVjdGlvbiByYW5nZSBvZiBbMTAwLDIwMF1cbiAgKiA+ICsgd2hlbiB2YWx1ZSBpcyAwLCAgIHByb2plY3Rpb25WYWx1ZSgpIGlzIDEwMFxuICAqID4gKyB3aGVuIHZhbHVlIGlzIDAuNSwgcHJvamVjdGlvblZhbHVlKCkgaXMgMTUwXG4gICogPiArIHdoZW4gdmFsdWUgaXMgMSwgICBwcm9qZWN0aW9uVmFsdWUoKSBpcyAyMDBcbiAgKiA+XG4gICogPiBGb3IgYSBjb250cm9sIHdpdGggYSBwcm9qZWN0aW9uIHJhbmdlIG9mIFs1MCwzMF1cbiAgKiA+ICsgd2hlbiB2YWx1ZSBpcyAwLCAgIHByb2plY3Rpb25WYWx1ZSgpIGlzIDUwXG4gICogPiArIHdoZW4gdmFsdWUgaXMgMC41LCBwcm9qZWN0aW9uVmFsdWUoKSBpcyA0MFxuICAqID4gKyB3aGVuIHZhbHVlIGlzIDEsICAgcHJvamVjdGlvblZhbHVlKCkgaXMgMzBcbiAgKiA+IGBgYFxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgcHJvamVjdGVkVmFsdWUoKSB7XG4gICAgbGV0IHByb2plY3Rpb25SYW5nZSA9IHRoaXMucHJvamVjdGlvbkVuZCAtIHRoaXMucHJvamVjdGlvblN0YXJ0O1xuICAgIHJldHVybiAodGhpcy52YWx1ZSAqIHByb2plY3Rpb25SYW5nZSkgKyB0aGlzLnByb2plY3Rpb25TdGFydDtcbiAgfVxuXG4gIC8vIFRPRE86IHJlaW50cm9kdWNlIHdoZW4gdGVzdGVkXG4gIC8vIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW4gdGhlIHJhbmdlICpbMCwxXSogZm9yIHRoZVxuICAvLyBgcHJvamVjdGVkVmFsdWVgIGluIHRoZSByYW5nZSBgW3Byb2plY3Rpb25TdGFydCxwcm9qZWN0aW9uRW5kXWAuXG4gIC8vIHZhbHVlT2ZQcm9qZWN0ZWQocHJvamVjdGVkVmFsdWUpIHtcbiAgLy8gICBsZXQgcHJvamVjdGlvblJhbmdlID0gdGhpcy5wcm9qZWN0aW9uRW5kIC0gdGhpcy5wcm9qZWN0aW9uU3RhcnQ7XG4gIC8vICAgcmV0dXJuIChwcm9qZWN0ZWRWYWx1ZSAtIHRoaXMucHJvamVjdGlvblN0YXJ0KSAvIHByb2plY3Rpb25SYW5nZTtcbiAgLy8gfVxuXG5cbiAgLyoqXG4gICogU2V0cyBib3RoIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHRoZSBnaXZlbiBpbnNldHMgZnJvbSBgMGBcbiAgKiBhbmQgYDFgLCBjb3JyZXNwb25kaW5nbHkuXG4gICpcbiAgKiA+IEUuZy5cbiAgKiA+IGBgYFxuICAqID4gY29udHJvbC5zZXRMaW1pdHNXaXRoSW5zZXRzKDAuMSwgMC4yKVxuICAqID4gLy8gc2V0cyBzdGFydExpbWl0IGFzIDAuMVxuICAqID4gLy8gc2V0cyBlbmRMaW1pdCAgIGFzIDAuOFxuICAqID4gYGBgXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGAwYCB0byB1c2UgZm9yIGBzdGFydExpbWl0YFxuICAqIEBwYXJhbSB7bnVtYmVyfSBlbmRJbnNldCAtIFRoZSBpbnNldCBmcm9tIGAxYCB0byB1c2UgZm9yIGBlbmRMaW1pdGBcbiAgKi9cbiAgc2V0TGltaXRzV2l0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQ7XG4gICAgdGhpcy5lbmRMaW1pdCA9IDEgLSBlbmRJbnNldDtcbiAgfVxuXG5cbiAgLy8gVE9ETzogcmVpbnRyb2R1Y2Ugd2hlbiB0ZXN0ZWRcbiAgLy8gU2V0cyBgc3RhcnRMaW1pdGAgYW5kIGBlbmRMaW1pdGAgd2l0aCB0d28gaW5zZXQgdmFsdWVzIHJlbGF0aXZlIHRvIHRoZVxuICAvLyBbMCwxXSByYW5nZS5cbiAgLy8gc2V0TGltaXRzV2l0aFByb2plY3Rpb25JbnNldHMoc3RhcnRJbnNldCwgZW5kSW5zZXQpIHtcbiAgLy8gICB0aGlzLnN0YXJ0TGltaXQgPSB0aGlzLnZhbHVlT2Yoc3RhcnRJbnNldCk7XG4gIC8vICAgdGhpcy5lbmRMaW1pdCA9IHRoaXMudmFsdWVPZigxIC0gZW5kSW5zZXQpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBBZGRzIGEgbWFya2VyIGF0IHRoZSBjdXJyZW50IGB2YWx1ZWAuXG4gICovXG4gIGFkZE1hcmtlckF0Q3VycmVudFZhbHVlKCkge1xuICAgIHRoaXMubWFya2Vycy5wdXNoKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGlzIGNvbnRyb2wgaXMgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLlxuICAqXG4gICogQHJldHVybnMge2Jvb2xlYW59XG4gICovXG4gIGlzU2VsZWN0ZWQoKSB7XG4gICAgaWYgKHRoaXMucmFjLmNvbnRyb2xsZXIuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJhYy5jb250cm9sbGVyLnNlbGVjdGlvbi5jb250cm9sID09PSB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHJldHVybiB7UmFjLlBvaW50fVxuICAqL1xuICBrbm9iKCkge1xuICAgIHRocm93IFJhYy5FeGNlcHRpb24uYWJzdHJhY3RGdW5jdGlvbkNhbGxlZChcbiAgICAgIGB0aGlzLXR5cGU6JHt1dGlscy50eXBlTmFtZSh0aGlzKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIGFuY2hvciB0byBiZSBwZXJzaXRlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbi5cbiAgKlxuICAqIEVhY2ggaW1wbGVtZW50YXRpb24gZGV0ZXJtaW5lcyB0aGUgdHlwZSB1c2VkIGZvciBgYW5jaG9yYCBhbmRcbiAgKiBgYWZmaXhBbmNob3IoKWAuXG4gICpcbiAgKiBUaGlzIGZpeGVkIGFuY2hvciBpcyBwYXNzZWQgYmFjayB0byB0aGUgY29udHJvbCB0aHJvdWdoXG4gICogYFt1cGRhdGVXaXRoUG9pbnRlcl17QGxpbmsgUmFjLkNvbnRyb2wjdXBkYXRlV2l0aFBvaW50ZXJ9YCBhbmRcbiAgKiBgW2RyYXdTZWxlY3Rpb25de0BsaW5rIFJhYy5Db250cm9sI2RyYXdTZWxlY3Rpb259YCBkdXJpbmcgdXNlclxuICAqIGludGVyYWN0aW9uLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEByZXR1cm4ge29iamVjdH1cbiAgKi9cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgKlxuICAqID4g4pqg77iPIFRoaXMgbWV0aG9kIG11c3QgYmUgb3ZlcnJpZGVuIGJ5IGFuIGV4dGVuZGluZyBjbGFzcy4gQ2FsbGluZyB0aGlzXG4gICogPiBpbXBsZW1lbnRhdGlvbiB0aHJvd3MgYW4gZXJyb3IuXG4gICpcbiAgKiBAYWJzdHJhY3RcbiAgKi9cbiAgZHJhdygpIHtcbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmFic3RyYWN0RnVuY3Rpb25DYWxsZWQoXG4gICAgICBgdGhpcy10eXBlOiR7dXRpbHMudHlwZU5hbWUodGhpcyl9YCk7XG4gIH1cblxuICAvKipcbiAgKiBVcGRhdGVzIGB2YWx1ZWAgdXNpbmcgYHBvaW50ZXJLbm9iQ2VudGVyYCBpbiByZWxhdGlvbiB0byBgZml4ZWRBbmNob3JgLlxuICAqIENhbGxlZCBieSBgW3JhYy5jb250cm9sbGVyLnBvaW50ZXJEcmFnZ2VkXXtAbGluayBSYWMuQ29udHJvbGxlciNwb2ludGVyRHJhZ2dlZH1gXG4gICogYXMgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGggdGhlIGNvbnRyb2wuXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGludGVycHJldHMgYHBvaW50ZXJLbm9iQ2VudGVyYCBhZ2FpbnN0IGBmaXhlZEFuY2hvcmBcbiAgKiB0byB1cGRhdGUgaXRzIG93biB2YWx1ZS4gVGhlIGN1cnJlbnQgYGFuY2hvcmAgaXMgbm90IHVzZWQgZm9yIHRoaXNcbiAgKiB1cGRhdGUgc2luY2UgYGFuY2hvcmAgY291bGQgY2hhbmdlIGR1cmluZyByZWRyYXcgaW4gcmVzcG9uc2UgdG8gdXBkYXRlc1xuICAqIGluIGB2YWx1ZWAuXG4gICpcbiAgKiBFYWNoIGltcGxlbWVudGF0aW9uIGlzIGFsc28gcmVzcG9uc2libGUgb2Yga2VlcGluZyB0aGUgdXBkYXRlZCBgdmFsdWVgXG4gICogd2l0aGluIHRoZSByYW5nZSBgW3N0YXJ0TGltaXQsZW5kTGltaXRdYC4gVGhpcyBtZXRob2QgaXMgdGhlIG9ubHkgcGF0aFxuICAqIGZvciB1cGRhdGluZyB0aGUgY29udHJvbCB0aHJvdWdoIHVzZXIgaW50ZXJhY3Rpb24sIGFuZCB0aHVzIHRoZSBvbmx5XG4gICogcGxhY2Ugd2hlcmUgZWFjaCBpbXBsZW1lbnRhdGlvbiBtdXN0IGVuZm9yY2UgYSB2YWxpZCBgdmFsdWVgIHdpdGhpblxuICAqICpbMCwxXSogYW5kIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogPiDimqDvuI8gVGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZW4gYnkgYW4gZXh0ZW5kaW5nIGNsYXNzLiBDYWxsaW5nIHRoaXNcbiAgKiA+IGltcGxlbWVudGF0aW9uIHRocm93cyBhbiBlcnJvci5cbiAgKlxuICAqIEBhYnN0cmFjdFxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyS25vYkNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUga25vYiBjZW50ZXJcbiAgKiAgIGFzIGludGVyYWN0ZWQgYnkgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7b2JqZWN0fSBmaXhlZEFuY2hvciAtIEFuY2hvciBwcm9kdWNlZCB3aGVuIHVzZXIgaW50ZXJhY3Rpb25cbiAgKiAgIHN0YXJ0ZWRcbiAgKi9cbiAgdXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIHNlbGVjdGlvbiBzdGF0ZSBhbG9uZyB3aXRoIHBvaW50ZXIgaW50ZXJhY3Rpb24gdmlzdWFscy5cbiAgKiBDYWxsZWQgYnkgYFtyYWMuY29udHJvbGxlci5kcmF3Q29udHJvbHNde0BsaW5rIFJhYy5Db250cm9sbGVyI2RyYXdDb250cm9sc31gXG4gICogb25seSBmb3IgdGhlIHNlbGVjdGVkIGNvbnRyb2wuXG4gICpcbiAgKiA+IOKaoO+4jyBUaGlzIG1ldGhvZCBtdXN0IGJlIG92ZXJyaWRlbiBieSBhbiBleHRlbmRpbmcgY2xhc3MuIENhbGxpbmcgdGhpc1xuICAqID4gaW1wbGVtZW50YXRpb24gdGhyb3dzIGFuIGVycm9yLlxuICAqXG4gICogQGFic3RyYWN0XG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgcG9zaXRpb24gb2YgdGhlIHVzZXIgcG9pbnRlclxuICAqIEBwYXJhbSB7b2JqZWN0fSBmaXhlZEFuY2hvciAtIEFuY2hvciBvZiB0aGUgY29udHJvbCBwcm9kdWNlZCB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWRcbiAgKiBAcGFyYW0ge1JhYy5TZWdtZW50fSBwb2ludGVyVG9Lbm9iT2Zmc2V0IC0gQSBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzXG4gICogICB0aGUgb2Zmc2V0IGZyb20gYHBvaW50ZXJDZW50ZXJgIHRvIHRoZSBjb250cm9sIGtub2Igd2hlbiB1c2VyXG4gICogICBpbnRlcmFjdGlvbiBzdGFydGVkLlxuICAqL1xuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIsIGZpeGVkQW5jaG9yLCBwb2ludGVyVG9Lbm9iT2Zmc2V0KSB7XG4gICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5hYnN0cmFjdEZ1bmN0aW9uQ2FsbGVkKFxuICAgICAgYHRoaXMtdHlwZToke3V0aWxzLnR5cGVOYW1lKHRoaXMpfWApO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbDtcblxuXG4vLyBDb250cm9scyBzaGFyZWQgZHJhd2luZyBlbGVtZW50c1xuXG5Db250cm9sLm1ha2VBcnJvd1NoYXBlID0gZnVuY3Rpb24ocmFjLCBjZW50ZXIsIGFuZ2xlKSB7XG4gIC8vIEFyY1xuICBsZXQgYW5nbGVEaXN0YW5jZSA9IHJhYy5BbmdsZS5mcm9tKDEvMjIpO1xuICBsZXQgYXJjID0gY2VudGVyLmFyYyhyYWMuY29udHJvbGxlci5rbm9iUmFkaXVzICogMS41LFxuICAgIGFuZ2xlLnN1YnRyYWN0KGFuZ2xlRGlzdGFuY2UpLCBhbmdsZS5hZGQoYW5nbGVEaXN0YW5jZSkpO1xuXG4gIC8vIEFycm93IHdhbGxzXG4gIGxldCBwb2ludEFuZ2xlID0gcmFjLkFuZ2xlLmZyb20oMS84KTtcbiAgbGV0IHJpZ2h0V2FsbCA9IGFyYy5zdGFydFBvaW50KCkucmF5KGFuZ2xlLmFkZChwb2ludEFuZ2xlKSk7XG4gIGxldCBsZWZ0V2FsbCA9IGFyYy5lbmRQb2ludCgpLnJheShhbmdsZS5zdWJ0cmFjdChwb2ludEFuZ2xlKSk7XG5cbiAgLy8gQXJyb3cgcG9pbnRcbiAgbGV0IHBvaW50ID0gcmlnaHRXYWxsLnBvaW50QXRJbnRlcnNlY3Rpb24obGVmdFdhbGwpO1xuXG4gIC8vIFNoYXBlXG4gIHJhYy5wdXNoU2hhcGUoKTtcbiAgcG9pbnQuc2VnbWVudFRvUG9pbnQoYXJjLnN0YXJ0UG9pbnQoKSlcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuYXR0YWNoVG9TaGFwZSgpO1xuICBhcmMuZW5kUG9pbnQoKS5zZWdtZW50VG9Qb2ludChwb2ludClcbiAgICAuYXR0YWNoVG9TaGFwZSgpO1xuXG4gIHJldHVybiByYWMucG9wU2hhcGUoKTtcbn07XG5cbkNvbnRyb2wubWFrZUxpbWl0TWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIGxldCBwZXJwZW5kaWN1bGFyID0gYW5nbGUucGVycGVuZGljdWxhcihmYWxzZSk7XG4gIGxldCBjb21wb3NpdGUgPSBuZXcgUmFjLkNvbXBvc2l0ZShyYWMpO1xuXG4gIHBvaW50LnNlZ21lbnRUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIDQpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbig0KVxuICAgIC5hdHRhY2hUbyhjb21wb3NpdGUpO1xuICBwb2ludC5wb2ludFRvQW5nbGUocGVycGVuZGljdWxhciwgOCkuYXJjKDMpXG4gICAgLmF0dGFjaFRvKGNvbXBvc2l0ZSk7XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZTtcbn07XG5cbkNvbnRyb2wubWFrZVZhbHVlTWFya2VyID0gZnVuY3Rpb24ocmFjLCBwb2ludCwgYW5nbGUpIHtcbiAgYW5nbGUgPSByYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gIHJldHVybiBwb2ludC5zZWdtZW50VG9BbmdsZShhbmdsZS5wZXJwZW5kaWN1bGFyKCksIDMpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigzKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5sZXQgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5sZXQgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEluZm9ybWF0aW9uIHJlZ2FyZGluZyB0aGUgY3VycmVudGx5IHNlbGVjdGVkXG4qIGBbQ29udHJvbF17QGxpbmsgUmFjLkNvbnRyb2x9YC5cbipcbiogQ3JlYXRlZCBhbmQga2VwdCBieSBgW0NvbnRyb2xsZXJde0BsaW5rIFJhYy5Db250cm9sbGVyfWAgd2hlbiBhIGNvbnRyb2xcbiogYmVjb21lcyBzZWxlY3RlZC5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sbGVyLlNlbGVjdGlvblxuKi9cbmNsYXNzIENvbnRyb2xTZWxlY3Rpb257XG5cbiAgLyoqXG4gICogQnVpbGRzIGEgbmV3IGBTZWxlY3Rpb25gIHdpdGggdGhlIGdpdmVuIGBjb250cm9sYCBhbmQgcG9pbnRlciBsb2NhdGVkXG4gICogYXQgYHBvaW50ZXJDZW50ZXJgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQ29udHJvbH0gY29udHJvbCAtIFRoZSBzZWxlY3RlZCBjb250cm9sXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gb2YgdGhlIHBvaW50ZXIgd2hlblxuICAqICAgdGhlIHNlbGVjdGlvbiBzdGFydGVkXG4gICovXG4gIGNvbnN0cnVjdG9yKGNvbnRyb2wsIHBvaW50ZXJDZW50ZXIpIHtcblxuICAgIC8qKlxuICAgICogVGhlIHNlbGVjdGVkIGNvbnRyb2wuXG4gICAgKiBAdHlwZSB7UmFjLkNvbnRyb2x9XG4gICAgKi9cbiAgICB0aGlzLmNvbnRyb2wgPSBjb250cm9sO1xuXG4gICAgLyoqXG4gICAgKiBBbmNob3IgcHJvZHVjZWQgYnlcbiAgICAqIGBbY29udHJvbC5hZmZpeEFuY2hvcl17QGxpbmsgUmFjLkNvbnRyb2wjYWZmaXhBbmNob3J9YCB3aGVuIHRoZVxuICAgICogc2VsZWN0aW9uIGJlZ2FuLlxuICAgICpcbiAgICAqIFRoaXMgYW5jaG9yIGlzIHBlcnNpc3RlZCBkdXJpbmcgdXNlciBpbnRlcmFjdGlvbiBhcyB0byBhbGxvdyB0aGUgdXNlclxuICAgICogdG8gaW50ZXJhY3Qgd2l0aCB0aGUgc2VsZWN0ZWQgY29udHJvbCBpbiBhIGZpeGVkIGxvY2F0aW9uLCBldmVuIGlmXG4gICAgKiB0aGUgY29udHJvbCBtb3ZlcyBkdXJpbmcgdGhlIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKi9cbiAgICB0aGlzLmZpeGVkQW5jaG9yID0gY29udHJvbC5hZmZpeEFuY2hvcigpO1xuXG4gICAgLyoqXG4gICAgKiBgU2VnbWVudGAgdGhhdCByZXByZXNlbnRzIHRoZSBvZmZzZXQgZnJvbSB0aGUgcG9pbnRlciBwb3NpdGlvbiB0byB0aGVcbiAgICAqIGNvbnRyb2wga25vYiBjZW50ZXIuXG4gICAgKlxuICAgICogVXNlZCB0byBpbnRlcmFjdCB3aXRoIHRoZSBjb250cm9sIGtub2IgYXQgYSBjb25zdGFudCBvZmZzZXQgcG9zaXRpb25cbiAgICAqIGR1cmluZyB1c2VyIGludGVyYWN0aW9uLlxuICAgICpcbiAgICAqIFRoZSBwb2ludGVyIHN0YXJ0aW5nIGxvY2F0aW9uIGlzIGVxdWFsIHRvIGBzZWdtZW50LnN0YXJ0UG9pbnQoKWAsXG4gICAgKiB0aGUgY29udHJvbCBrbm9iIGNlbnRlciBzdGFydGluZyBwb3NpdGlvbiBpcyBlcXVhbCB0b1xuICAgICogYHNlZ21lbnQuZW5kUG9pbnQoKWAuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAgICovXG4gICAgdGhpcy5wb2ludGVyVG9Lbm9iT2Zmc2V0ID0gcG9pbnRlckNlbnRlci5zZWdtZW50VG9Qb2ludChjb250cm9sLmtub2IoKSk7XG4gIH1cblxuICBkcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpIHtcbiAgICB0aGlzLmNvbnRyb2wuZHJhd1NlbGVjdGlvbihwb2ludGVyQ2VudGVyLCB0aGlzLmZpeGVkQW5jaG9yLCB0aGlzLnBvaW50ZXJUb0tub2JPZmZzZXQpO1xuICB9XG59XG5cblxuLyoqXG4qIE1hbmFnZXIgb2YgaW50ZXJhY3RpdmUgYFtDb250cm9sXXtAbGluayBSYWMuQ29udHJvbH1gcyBmb3IgYW4gaW5zdGFuY2Vcbiogb2YgYFJhY2AuXG4qXG4qIENvbnRhaW5zIGEgbGlzdCBvZiBhbGwgbWFuYWdlZCBjb250cm9scyBhbmQgY29vcmRpbmF0ZXMgZHJhd2luZyBhbmQgdXNlclxuKiBpbnRlcmFjdGlvbiBiZXR3ZWVuIHRoZW0uXG4qXG4qIEZvciBjb250cm9scyB0byBiZSBmdW5jdGlvbmFsIHRoZSBgcG9pbnRlclByZXNzZWRgLCBgcG9pbnRlclJlbGVhc2VkYCxcbiogYW5kIGBwb2ludGVyRHJhZ2dlZGAgbWV0aG9kcyBoYXZlIHRvIGJlIGNhbGxlZCBhcyBwb2ludGVyIGludGVyYWN0aW9uc1xuKiBoYXBwZW4uIFRoZSBgZHJhd0NvbnRyb2xzYCBtZXRob2QgaGFuZGxlcyB0aGUgZHJhd2luZyBvZiBhbGwgY29udHJvbHNcbiogYW5kIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgY29udHJvbCwgaXQgaXMgdXN1YWxseSBjYWxsZWQgYXQgdGhlIHZlcnkgZW5kXG4qIG9mIGRyYXdpbmcuXG4qXG4qIEFsc28gY29udGFpbnMgc2V0dGluZ3Mgc2hhcmVkIGJldHdlZW4gYWxsIGNvbnRyb2xzIGFuZCB1c2VkIGZvciB1c2VyXG4qIGludGVyYWN0aW9uLCBsaWtlIGBwb2ludGVyU3R5bGVgIHRvIGRyYXcgdGhlIHBvaW50ZXIsIGBjb250cm9sU3R5bGVgIGFzXG4qIGEgZGVmYXVsdCBzdHlsZSBmb3IgZHJhd2luZyBjb250cm9scywgYW5kIGBrbm9iUmFkaXVzYCB0aGF0IGRlZmluZXMgdGhlXG4qIHNpemUgb2YgdGhlIGludGVyYWN0aXZlIGVsZW1lbnQgb2YgbW9zdCBjb250cm9scy5cbipcbiogQGFsaWFzIFJhYy5Db250cm9sbGVyXG4qL1xuY2xhc3MgQ29udHJvbGxlciB7XG5cbiAgc3RhdGljIFNlbGVjdGlvbiA9IENvbnRyb2xTZWxlY3Rpb247XG5cblxuICAvKipcbiAgKiBCdWlsZHMgYSBuZXcgYENvbnRyb2xsZXJgIHdpdGggdGhlIGdpdmVuIGBSYWNgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMpIHtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBEaXN0YW5jZSBhdCB3aGljaCB0aGUgcG9pbnRlciBpcyBjb25zaWRlcmVkIHRvIGludGVyYWN0IHdpdGggYVxuICAgICogY29udHJvbCBrbm9iLiBBbHNvIHVzZWQgYnkgY29udHJvbHMgZm9yIGRyYXdpbmcuXG4gICAgKlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMua25vYlJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBDb2xsZWN0aW9uIG9mIGFsbCBjb250cm9sbHMgbWFuYWdlZCBieSB0aGUgaW5zdGFuY2UuIENvbnRyb2xzIGluIHRoaXNcbiAgICAqIGxpc3QgYXJlIGNvbnNpZGVyZWQgZm9yIHBvaW50ZXIgaGl0IHRlc3RpbmcgYW5kIGZvciBkcmF3aW5nLlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuQ29udHJvbFtdfVxuICAgICogQGRlZmF1bHQgW11cbiAgICAqL1xuICAgIHRoaXMuY29udHJvbHMgPSBbXTtcblxuICAgIC8qKlxuICAgICogSW5kaWNhdGVzIGNvbnRyb2xzIHRvIGFkZCB0aGVtc2VsdmVzIGludG8gYHRoaXMuY29udHJvbHNgIHdoZW5cbiAgICAqIGNyZWF0ZWQuXG4gICAgKlxuICAgICogVGhpcyBwcm9wZXJ0eSBpcyBhIHNoYXJlZCBjb25maWd1cmF0aW9uLiBUaGUgYmVoYXZpb3VyIGlzIGltcGxlbWVudGVkXG4gICAgKiBpbmRlcGVuZGVudGx5IGJ5IGVhY2ggY29udHJvbCBjb25zdHJ1Y3Rvci5cbiAgICAqXG4gICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAqL1xuICAgIHRoaXMuYXV0b0FkZENvbnRyb2xzID0gdHJ1ZTtcblxuICAgIC8vIFRPRE86IHNlcGFyYXRlIGxhc3RDb250cm9sIGZyb20gbGFzdFBvaW50ZXJcblxuICAgIC8vIExhc3QgYFBvaW50YCBvZiB0aGUgcG9zaXRpb24gd2hlbiB0aGUgcG9pbnRlciB3YXMgcHJlc3NlZCwgb3IgbGFzdFxuICAgIC8vIENvbnRyb2wgaW50ZXJhY3RlZCB3aXRoLiBTZXQgdG8gYG51bGxgIHdoZW4gdGhlcmUgaGFzIGJlZW4gbm9cbiAgICAvLyBpbnRlcmFjdGlvbiB5ZXQgYW5kIHdoaWxlIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbC5cbiAgICB0aGlzLmxhc3RQb2ludGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICogU3R5bGUgb2JqZWN0IHVzZWQgZm9yIHRoZSB2aXN1YWwgZWxlbWVudHMgcmVsYXRlZCB0byBwb2ludGVyXG4gICAgKiBpbnRlcmFjdGlvbiBhbmQgY29udHJvbCBzZWxlY3Rpb24uIFdoZW4gYG51bGxgIG5vIHBvaW50ZXIgb3JcbiAgICAqIHNlbGVjdGlvbiB2aXN1YWxzIGFyZSBkcmF3bi5cbiAgICAqXG4gICAgKiBCeSBkZWZhdWx0IGNvbnRhaW5zIGEgc3R5bGUgdGhhdCB1c2VzIHRoZSBjdXJyZW50IHN0cm9rZVxuICAgICogY29uZmlndXJhdGlvbiB3aXRoIG5vLWZpbGwuXG4gICAgKlxuICAgICogQHR5cGUgez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn1cbiAgICAqIEBkZWZhdWx0IHtAbGluayBpbnN0YW5jZS5GaWxsI25vbmV9XG4gICAgKi9cbiAgICB0aGlzLnBvaW50ZXJTdHlsZSA9IHJhYy5GaWxsLm5vbmU7XG5cbiAgICAvKipcbiAgICAqIERlZmF1bHQgc3R5bGUgdG8gYXBwbHkgZm9yIGFsbCBjb250cm9scy4gV2hlbiBzZXQgaXQgaXMgYXBwbGllZFxuICAgICogYmVmb3JlIGNvbnRyb2wgZHJhd2luZy4gVGhlIGluZGl2aWR1YWwgY29udHJvbCBzdHlsZSBpblxuICAgICogYFtjb250cm9sLnN0eWxlXXtAbGluayBSYWMuQ29udHJvbCNzdHlsZX1gIGlzIGFwcGxpZWQgYWZ0ZXJ3YXJkcy5cbiAgICAqXG4gICAgKiBAdHlwZSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfVxuICAgICogQGRlZmF1bHQgbnVsbFxuICAgICovXG4gICAgdGhpcy5jb250cm9sU3R5bGUgPSBudWxsXG5cbiAgICAvKipcbiAgICAqIFNlbGVjdGlvbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBjb250cm9sLCBvciBgbnVsbGBcbiAgICAqIHdoZW4gdGhlcmUgaXMgbm8gc2VsZWN0aW9uLlxuICAgICpcbiAgICAqIEB0eXBlIHs/UmFjLkNvbnRyb2xsZXIuU2VsZWN0aW9ufVxuICAgICovXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuXG4gIH0gLy8gY29uc3RydWN0b3JcblxuXG4gIC8qKlxuICAqIFB1c2hlcyBgY29udHJvbGAgaW50byBgdGhpcy5jb250cm9sc2AsIGFsbG93aW5nIHRoZSBpbnN0YW5jZSB0byBoYW5kbGVcbiAgKiBwb2ludGVyIGludGVyYWN0aW9uIGFuZCBkcmF3aW5nIG9mIGBjb250cm9sYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkNvbnRyb2x9IGNvbnRyb2wgLSBBIGBDb250cm9sYCB0byBhZGQgaW50byBgY29udHJvbHNgXG4gICovXG4gIGFkZChjb250cm9sKSB7XG4gICAgdGhpcy5jb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICB9XG5cblxuICAvKipcbiAgKiBOb3RpZmllcyB0aGUgaW5zdGFuY2UgdGhhdCB0aGUgcG9pbnRlciBoYXMgYmVlbiBwcmVzc2VkIGF0IHRoZVxuICAqIGBwb2ludGVyQ2VudGVyYCBsb2NhdGlvbi4gQWxsIGNvbnRyb2xzIGFyZSBoaXQgdGVzdGVkIGFuZCB0aGUgZmlyc3RcbiAgKiBjb250cm9sIHRvIGJlIGhpdCBpcyBtYXJrZWQgYXMgc2VsZWN0ZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgcHJlc3MgaW50ZXJhY3Rpb24gZm9yIGFsbFxuICAqIG1hbmFnZWQgY29udHJvbHMgdG8gcHJvcGVybHkgd29yay5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludGVyQ2VudGVyIC0gVGhlIGxvY2F0aW9uIHdoZXJlIHRoZSBwb2ludGVyIHdhc1xuICAqICAgcHJlc3NlZFxuICAqL1xuICBwb2ludGVyUHJlc3NlZChwb2ludGVyQ2VudGVyKSB7XG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IG51bGw7XG5cbiAgICAvLyBUZXN0IHBvaW50ZXIgaGl0XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmNvbnRyb2xzLmZpbmQoIGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29udHJvbEtub2IgPSBpdGVtLmtub2IoKTtcbiAgICAgIGlmIChjb250cm9sS25vYiA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGlmIChjb250cm9sS25vYi5kaXN0YW5jZVRvUG9pbnQocG9pbnRlckNlbnRlcikgPD0gdGhpcy5rbm9iUmFkaXVzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgaWYgKHNlbGVjdGVkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvbiA9IG5ldyBDb250cm9sbGVyLlNlbGVjdGlvbihzZWxlY3RlZCwgcG9pbnRlckNlbnRlcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIE5vdGlmaWVzIHRoZSBpbnN0YW5jZSB0aGF0IHRoZSBwb2ludGVyIGhhcyBiZWVuIGRyYWdnZWQgdG8gdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBXaGVuIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbCwgdXNlclxuICAqIGludGVyYWN0aW9uIGlzIHBlcmZvcm1lZCBhbmQgdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgKlxuICAqIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgYWxvbmcgcG9pbnRlciBkcmFnIGludGVyYWN0aW9uIGZvciBhbGxcbiAgKiBtYW5hZ2VkIGNvbnRyb2xzIHRvIHByb3Blcmx5IHdvcmsuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBsb2NhdGlvbiB3aGVyZSB0aGUgcG9pbnRlciB3YXNcbiAgKiAgIGRyYWdnZWRcbiAgKi9cbiAgcG9pbnRlckRyYWdnZWQocG9pbnRlckNlbnRlcil7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGNvbnRyb2wgPSB0aGlzLnNlbGVjdGlvbi5jb250cm9sO1xuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuc2VsZWN0aW9uLmZpeGVkQW5jaG9yO1xuXG4gICAgLy8gT2Zmc2V0IGNlbnRlciBvZiBkcmFnZ2VkIGNvbnRyb2wga25vYiBmcm9tIHRoZSBwb2ludGVyIHBvc2l0aW9uXG4gICAgbGV0IHBvaW50ZXJLbm9iQ2VudGVyID0gdGhpcy5zZWxlY3Rpb24ucG9pbnRlclRvS25vYk9mZnNldFxuICAgICAgLndpdGhTdGFydFBvaW50KHBvaW50ZXJDZW50ZXIpXG4gICAgICAuZW5kUG9pbnQoKTtcblxuICAgIGNvbnRyb2wudXBkYXRlV2l0aFBvaW50ZXIocG9pbnRlcktub2JDZW50ZXIsIGZpeGVkQW5jaG9yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogTm90aWZpZXMgdGhlIGluc3RhbmNlIHRoYXQgdGhlIHBvaW50ZXIgaGFzIGJlZW4gcmVsZWFzZWQgYXQgdGhlXG4gICogYHBvaW50ZXJDZW50ZXJgIGxvY2F0aW9uLiBXaGVuIHRoZXJlIGlzIGEgc2VsZWN0ZWQgY29udHJvbCwgdXNlclxuICAqIGludGVyYWN0aW9uIGlzIGZpbmFsaXplZCBhbmQgdGhlIGNvbnRyb2wgc2VsZWN0aW9uIGlzIGNsZWFyZWQuXG4gICpcbiAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGFsb25nIHBvaW50ZXIgZHJhZyBpbnRlcmFjdGlvbiBmb3IgYWxsXG4gICogbWFuYWdlZCBjb250cm9scyB0byBwcm9wZXJseSB3b3JrLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJDZW50ZXIgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHBvaW50ZXIgd2FzXG4gICogICByZWxlYXNlZFxuICAqL1xuICBwb2ludGVyUmVsZWFzZWQocG9pbnRlckNlbnRlcikge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5sYXN0UG9pbnRlciA9IHBvaW50ZXJDZW50ZXI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0UG9pbnRlciA9IHRoaXMuc2VsZWN0aW9uLmNvbnRyb2w7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuICB9XG5cblxuICAvKipcbiAgKiBEcmF3cyBhbGwgY29udHJvbHMgY29udGFpbmVkIGluXG4gICogYFtjb250cm9sc117QGxpbmsgUmFjLkNvbnRyb2xsZXIjY29udHJvbHN9YCBhbG9uZyB0aGUgdmlzdWFsIGVsZW1lbnRzXG4gICogZm9yIHBvaW50ZXIgYW5kIGNvbnRyb2wgc2VsZWN0aW9uLlxuICAqXG4gICogVXN1YWxseSBjYWxsZWQgYXQgdGhlIGVuZCBvZiBkcmF3aW5nLCBhcyB0byBkcmF3IGNvbnRyb2xzIG9uIHRvcCBvZlxuICAqIG90aGVyIGdyYXBoaWNzLlxuICAqL1xuICBkcmF3Q29udHJvbHMoKSB7XG4gICAgbGV0IHBvaW50ZXJDZW50ZXIgPSB0aGlzLnJhYy5Qb2ludC5wb2ludGVyKCk7XG4gICAgdGhpcy5kcmF3UG9pbnRlcihwb2ludGVyQ2VudGVyKTtcblxuICAgIC8vIEFsbCBjb250cm9scyBpbiBkaXNwbGF5XG4gICAgdGhpcy5jb250cm9scy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5kcmF3U2VsZWN0aW9uKHBvaW50ZXJDZW50ZXIpO1xuICAgIH1cbiAgfVxuXG5cbiAgZHJhd1BvaW50ZXIocG9pbnRlckNlbnRlcikge1xuICAgIGxldCBwb2ludGVyU3R5bGUgPSB0aGlzLnBvaW50ZXJTdHlsZTtcbiAgICBpZiAocG9pbnRlclN0eWxlID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGFzdCBwb2ludGVyIG9yIGNvbnRyb2xcbiAgICBpZiAodGhpcy5sYXN0UG9pbnRlciBpbnN0YW5jZW9mIFJhYy5Qb2ludCkge1xuICAgICAgdGhpcy5sYXN0UG9pbnRlci5hcmMoMTIpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdFBvaW50ZXIgaW5zdGFuY2VvZiBSYWMuQ29udHJvbCkge1xuICAgICAgLy8gVE9ETzogaW1wbGVtZW50IGxhc3Qgc2VsZWN0ZWQgY29udHJvbCBzdGF0ZVxuICAgIH1cblxuICAgIC8vIFBvaW50ZXIgcHJlc3NlZFxuICAgIGlmICh0aGlzLnJhYy5kcmF3ZXIucDUubW91c2VJc1ByZXNzZWQpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICBwb2ludGVyQ2VudGVyLmFyYygxMCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9pbnRlckNlbnRlci5hcmMoNSkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbn0gLy8gY2xhc3MgQ29udHJvbGxlclxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmxldCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmxldCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udHJvbCB0aGF0IGFsbG93cyB0aGUgc2VsZWN0aW9uIG9mIGEgdmFsdWUgd2l0aCBhIGtub2IgdGhhdCBzbGlkZXNcbiogdGhyb3VnaCB0aGUgc2VnbWVudCBvZiBhIGBSYXlgLlxuKlxuKiBVc2VzIGEgYFJheWAgYXMgYFthbmNob3Jde0BsaW5rIFJhYy5SYXlDb250cm9sI2FuY2hvcn1gLCB3aGljaCBkZWZpbmVzXG4qIHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbipcbiogYFtsZW5ndGhde0BsaW5rIFJhYy5SYXlDb250cm9sI2xlbmd0aH1gIGRlZmluZXMgdGhlIGxlbmd0aCBvZiB0aGVcbiogc2VnbWVudCBpbiB0aGUgYGFuY2hvcmAgcmF5IHdoaWNoIGlzIGF2YWlsYWJsZSBmb3IgdXNlciBpbnRlcmFjdGlvbi5cbiogV2l0aGluIHRoaXMgc2VnbWVudCB0aGUgdXNlciBjYW4gc2xpZGUgdGhlIGNvbnRyb2wga25vYiB0byBzZWxlY3QgYVxuKiB2YWx1ZS5cbipcbiogQGFsaWFzIFJhYy5SYXlDb250cm9sXG4qIEBleHRlbmRzIFJhYy5Db250cm9sXG4qL1xuY2xhc3MgUmF5Q29udHJvbCBleHRlbmRzIFJhYy5Db250cm9sIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBSYXlDb250cm9sYCBpbnN0YW5jZSB3aXRoIHRoZSBzdGFydGluZyBgdmFsdWVgIGFuZCB0aGVcbiAgKiBpbnRlcmFjdGl2ZSBgbGVuZ3RoYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBUaGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgY29udHJvbCwgaW4gdGhlXG4gICogICAqWzAsMV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIGBhbmNob3JgIHJheSBhdmFpbGFibGUgZm9yXG4gICogICB1c2VyIGludGVyYWN0aW9uXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgdmFsdWUsIGxlbmd0aCkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHZhbHVlLCBsZW5ndGgpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcih2YWx1ZSwgbGVuZ3RoKTtcblxuICAgIHN1cGVyKHJhYywgdmFsdWUpO1xuXG4gICAgLyoqXG4gICAgKiBMZW5ndGggb2YgdGhlIGBhbmNob3JgIHJheSBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAvKipcbiAgICAqIGBSYXlgIHRvIHdoaWNoIHRoZSBjb250cm9sIHdpbGwgYmUgYW5jaG9yZWQuIERlZmluZXMgdGhlIGxvY2F0aW9uXG4gICAgKiB3aGVyZSB0aGUgY29udHJvbCBpcyBkcmF3bi5cbiAgICAqXG4gICAgKiBBbG9uZyB3aXRoIGBbbGVuZ3RoXXtAbGluayBSYWMuUmF5Q29udHJvbCNsZW5ndGh9YCBkZWZpbmVzIHRoZVxuICAgICogc2VnbWVudCBhdmFpbGFibGUgZm9yIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgKlxuICAgICogVGhlIGNvbnRyb2wgY2Fubm90IGJlIGRyYXduIG9yIHNlbGVjdGVkIHVudGlsIHRoaXMgcHJvcGVydHkgaXMgc2V0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWMuUmF5P31cbiAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAqL1xuICAgIHRoaXMuYW5jaG9yID0gbnVsbDtcblxuICAgIGlmIChyYWMuY29udHJvbGxlci5hdXRvQWRkQ29udHJvbHMpIHtcbiAgICAgIHJhYy5jb250cm9sbGVyLmFkZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFNldHMgYHZhbHVlYCB1c2luZyB0aGUgcHJvamVjdGlvbiBvZiBgbGVuZ3RoVmFsdWVgIGluIHRoZSBgWzAsbGVuZ3RoXWBcbiAgKiByYW5nZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGhWYWx1ZSAtIFRoZSBsZW5ndGggYXQgd2hpY2ggdG8gc2V0IHRoZSBjdXJyZW50XG4gICogICB2YWx1ZVxuICAqL1xuICBzZXRWYWx1ZVdpdGhMZW5ndGgobGVuZ3RoVmFsdWUpIHtcbiAgICBsZXQgbGVuZ3RoUmF0aW8gPSBsZW5ndGhWYWx1ZSAvIHRoaXMubGVuZ3RoO1xuICAgIHRoaXMudmFsdWUgPSBsZW5ndGhSYXRpbztcbiAgfVxuXG5cbiAgLyoqXG4gICogU2V0cyBib3RoIGBzdGFydExpbWl0YCBhbmQgYGVuZExpbWl0YCB3aXRoIHRoZSBnaXZlbiBpbnNldHMgZnJvbSBgMGBcbiAgKiBhbmQgYGxlbmd0aGAsIGNvcnJlc3BvbmRpbmdseSwgYm90aCBwcm9qZWN0ZWQgaW4gdGhlIGBbMCxsZW5ndGhdYFxuICAqIHJhbmdlLlxuICAqXG4gICogPiBFLmcuXG4gICogPiBgYGBcbiAgKiA+IC8vIEZvciBhIFJheUNvbnRyb2wgd2l0aCBsZW5ndGggb2YgMTAwXG4gICogPiBjb250cm9sLnNldExpbWl0c1dpdGhMZW5ndGhJbnNldHMoMTAsIDIwKVxuICAqID4gLy8gc2V0cyBzdGFydExpbWl0IGFzIDAuMSB3aGljaCBpcyBhdCBsZW5ndGggMTBcbiAgKiA+IC8vIHNldHMgZW5kTGltaXQgICBhcyAwLjggd2hpY2ggaXMgYXQgbGVuZ3RoIDgwIGZyb20gMTAwXG4gICogPiAvLyAgIDEwIGluc2V0IGZyb20gMCA9IDEwXG4gICogPiAvLyAgIDIwIGluc2V0IGZyb20gMTAwID0gODBcbiAgKiA+IGBgYFxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0SW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgMGAgaW4gdGhlIHJhbmdlXG4gICogICBgWzAsbGVuZ3RoXWAgdG8gdXNlIGZvciBgc3RhcnRMaW1pdGBcbiAgKiBAcGFyYW0ge251bWJlcn0gZW5kSW5zZXQgLSBUaGUgaW5zZXQgZnJvbSBgbGVuZ3RoYCBpbiB0aGUgcmFuZ2VcbiAgKiAgIGBbMCxsZW5ndGhdYCB0byB1c2UgZm9yIGBlbmRMaW1pdGBcbiAgKi9cbiAgc2V0TGltaXRzV2l0aExlbmd0aEluc2V0cyhzdGFydEluc2V0LCBlbmRJbnNldCkge1xuICAgIHRoaXMuc3RhcnRMaW1pdCA9IHN0YXJ0SW5zZXQgLyB0aGlzLmxlbmd0aDtcbiAgICB0aGlzLmVuZExpbWl0ID0gKHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQpIC8gdGhpcy5sZW5ndGg7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIGBhbmNob3JgIHJheSBgc3RhcnRgIGFuZCB0aGUgY29udHJvbFxuICAqIGtub2IuXG4gICpcbiAgKiBFcXVpdmFsZW50IHRvIHRoZSBjb250cm9sIGB2YWx1ZWAgcHJvamVjdGVkIHRvIHRoZSByYW5nZSBgWzAsbGVuZ3RoXWAuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBkaXN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggKiB0aGlzLnZhbHVlO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFBvaW50YCBhdCB0aGUgY2VudGVyIG9mIHRoZSBjb250cm9sIGtub2IuXG4gICpcbiAgKiBXaGVuIGBhbmNob3JgIGlzIG5vdCBzZXQsIHJldHVybnMgYG51bGxgIGluc3RlYWQuXG4gICpcbiAgKiBAcmV0dXJuIHtSYWMuUG9pbnQ/fVxuICAqL1xuICBrbm9iKCkge1xuICAgIGlmICh0aGlzLmFuY2hvciA9PT0gbnVsbCkge1xuICAgICAgLy8gTm90IHBvc2libGUgdG8gY2FsY3VsYXRlIHRoZSBrbm9iXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYW5jaG9yLnBvaW50QXREaXN0YW5jZSh0aGlzLmRpc3RhbmNlKCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBwcm9kdWNlZCB3aXRoIHRoZSBgYW5jaG9yYCByYXkgd2l0aCBgbGVuZ3RoYCxcbiAgKiB0byBiZSBwZXJzaXN0ZWQgZHVyaW5nIHVzZXIgaW50ZXJhY3Rpb24uXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGFuY2hvcmAgaXMgbm90IHNldC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgYWZmaXhBbmNob3IoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uKFxuICAgICAgICBgRXhwZWN0ZWQgYW5jaG9yIHRvIGJlIHNldCwgbnVsbCBmb3VuZCBpbnN0ZWFkYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFuY2hvci5zZWdtZW50KHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogRHJhd3MgdGhlIGN1cnJlbnQgc3RhdGUuXG4gICovXG4gIGRyYXcoKSB7XG4gICAgaWYgKHRoaXMuYW5jaG9yID09PSBudWxsKSB7XG4gICAgICAvLyBVbmFibGUgdG8gZHJhdyB3aXRob3V0IGFuY2hvclxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaXhlZEFuY2hvciA9IHRoaXMuYWZmaXhBbmNob3IoKTtcblxuICAgIGxldCBjb250cm9sbGVyU3R5bGUgPSB0aGlzLnJhYy5jb250cm9sbGVyLmNvbnRyb2xTdHlsZTtcbiAgICBsZXQgY29udHJvbFN0eWxlID0gY29udHJvbGxlclN0eWxlICE9PSBudWxsXG4gICAgICA/IGNvbnRyb2xsZXJTdHlsZS5hcHBlbmRTdHlsZSh0aGlzLnN0eWxlKVxuICAgICAgOiB0aGlzLnN0eWxlO1xuXG4gICAgZml4ZWRBbmNob3IuZHJhdyhjb250cm9sU3R5bGUpO1xuXG4gICAgbGV0IGtub2IgPSB0aGlzLmtub2IoKTtcbiAgICBsZXQgYW5nbGUgPSBmaXhlZEFuY2hvci5hbmdsZSgpO1xuXG4gICAgdGhpcy5yYWMucHVzaENvbXBvc2l0ZSgpO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgcG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCB0aGlzLmxlbmd0aCAqIGl0ZW0pO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZVZhbHVlTWFya2VyKHRoaXMucmFjLCBwb2ludCwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgLy8gQ29udHJvbCBrbm9iXG4gICAga25vYi5hcmModGhpcy5yYWMuY29udHJvbGxlci5rbm9iUmFkaXVzKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBOZWdhdGl2ZSBhcnJvd1xuICAgIGlmICh0aGlzLnZhbHVlID49IHRoaXMuc3RhcnRMaW1pdCArIHRoaXMucmFjLnVuaXRhcnlFcXVhbGl0eVRocmVzaG9sZCkge1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUFycm93U2hhcGUodGhpcy5yYWMsIGtub2IsIGFuZ2xlLmludmVyc2UoKSlcbiAgICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpdmUgYXJyb3dcbiAgICBpZiAodGhpcy52YWx1ZSA8PSB0aGlzLmVuZExpbWl0IC0gdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkKSB7XG4gICAgICBSYWMuQ29udHJvbC5tYWtlQXJyb3dTaGFwZSh0aGlzLnJhYywga25vYiwgYW5nbGUpXG4gICAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmFjLnBvcENvbXBvc2l0ZSgpLmRyYXcoY29udHJvbFN0eWxlKTtcblxuICAgIC8vIFNlbGVjdGlvblxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoKSkge1xuICAgICAgbGV0IHBvaW50ZXJTdHlsZSA9IHRoaXMucmFjLmNvbnRyb2xsZXIucG9pbnRlclN0eWxlO1xuICAgICAgaWYgKHBvaW50ZXJTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBrbm9iLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgKiAxLjUpLmRyYXcocG9pbnRlclN0eWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFVwZGF0ZXMgYHZhbHVlYCB1c2luZyBgcG9pbnRlcktub2JDZW50ZXJgIGluIHJlbGF0aW9uIHRvIGBmaXhlZEFuY2hvcmAuXG4gICpcbiAgKiBgdmFsdWVgIGlzIGFsd2F5cyB1cGRhdGVkIGJ5IHRoaXMgbWV0aG9kIHRvIGJlIHdpdGhpbiAqWzAsMV0qIGFuZFxuICAqIGBbc3RhcnRMaW1pdCxlbmRMaW1pdF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50ZXJLbm9iQ2VudGVyIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBrbm9iIGNlbnRlclxuICAqICAgYXMgaW50ZXJhY3RlZCBieSB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gZml4ZWRBbmNob3IgLSBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgXG4gICogICB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqL1xuICB1cGRhdGVXaXRoUG9pbnRlcihwb2ludGVyS25vYkNlbnRlciwgZml4ZWRBbmNob3IpIHtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuICAgIGxldCBzdGFydEluc2V0ID0gbGVuZ3RoICogdGhpcy5zdGFydExpbWl0O1xuICAgIGxldCBlbmRJbnNldCA9IGxlbmd0aCAqICgxIC0gdGhpcy5lbmRMaW1pdCk7XG5cbiAgICAvLyBOZXcgdmFsdWUgZnJvbSB0aGUgY3VycmVudCBwb2ludGVyIHBvc2l0aW9uLCByZWxhdGl2ZSB0byBmaXhlZEFuY2hvclxuICAgIGxldCBuZXdEaXN0YW5jZSA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChwb2ludGVyS25vYkNlbnRlcik7XG4gICAgLy8gQ2xhbXBpbmcgdmFsdWUgKGphdmFzY3JpcHQgaGFzIG5vIE1hdGguY2xhbXApXG4gICAgbmV3RGlzdGFuY2UgPSBmaXhlZEFuY2hvci5jbGFtcFRvTGVuZ3RoKG5ld0Rpc3RhbmNlLFxuICAgICAgc3RhcnRJbnNldCwgZW5kSW5zZXQpO1xuXG4gICAgLy8gVXBkYXRlIGNvbnRyb2wgd2l0aCBuZXcgZGlzdGFuY2VcbiAgICBsZXQgbGVuZ3RoUmF0aW8gPSBuZXdEaXN0YW5jZSAvIGxlbmd0aDtcbiAgICB0aGlzLnZhbHVlID0gbGVuZ3RoUmF0aW87XG4gIH1cblxuXG4gIC8qKlxuICAqIERyYXdzIHRoZSBzZWxlY3Rpb24gc3RhdGUgYWxvbmcgd2l0aCBwb2ludGVyIGludGVyYWN0aW9uIHZpc3VhbHMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnRlckNlbnRlciAtIFRoZSBwb3NpdGlvbiBvZiB0aGUgdXNlciBwb2ludGVyXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gZml4ZWRBbmNob3IgLSBgU2VnbWVudGAgcHJvZHVjZWQgd2l0aCBgYWZmaXhBbmNob3JgXG4gICogICB3aGVuIHVzZXIgaW50ZXJhY3Rpb24gc3RhcnRlZFxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IHBvaW50ZXJUb0tub2JPZmZzZXQgLSBBIGBTZWdtZW50YCB0aGF0IHJlcHJlc2VudHNcbiAgKiAgIHRoZSBvZmZzZXQgZnJvbSBgcG9pbnRlckNlbnRlcmAgdG8gdGhlIGNvbnRyb2wga25vYiB3aGVuIHVzZXJcbiAgKiAgIGludGVyYWN0aW9uIHN0YXJ0ZWQuXG4gICovXG4gIGRyYXdTZWxlY3Rpb24ocG9pbnRlckNlbnRlciwgZml4ZWRBbmNob3IsIHBvaW50ZXJUb0tub2JPZmZzZXQpIHtcbiAgICBsZXQgcG9pbnRlclN0eWxlID0gdGhpcy5yYWMuY29udHJvbGxlci5wb2ludGVyU3R5bGU7XG4gICAgaWYgKHBvaW50ZXJTdHlsZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMucmFjLnB1c2hDb21wb3NpdGUoKTtcbiAgICBmaXhlZEFuY2hvci5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgbGV0IGFuZ2xlID0gZml4ZWRBbmNob3IuYW5nbGUoKTtcbiAgICBsZXQgbGVuZ3RoID0gZml4ZWRBbmNob3IubGVuZ3RoO1xuXG4gICAgLy8gVmFsdWUgbWFya2Vyc1xuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGl0ZW0gPCAwIHx8IGl0ZW0gPiAxKSB7IHJldHVybiB9XG4gICAgICBsZXQgbWFya2VyUG9pbnQgPSBmaXhlZEFuY2hvci5zdGFydFBvaW50KCkucG9pbnRUb0FuZ2xlKGFuZ2xlLCBsZW5ndGggKiBpdGVtKTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VWYWx1ZU1hcmtlcih0aGlzLnJhYywgbWFya2VyUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIExpbWl0IG1hcmtlcnNcbiAgICBpZiAodGhpcy5zdGFydExpbWl0ID4gMCkge1xuICAgICAgbGV0IG1pblBvaW50ID0gZml4ZWRBbmNob3Iuc3RhcnRQb2ludCgpLnBvaW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoICogdGhpcy5zdGFydExpbWl0KTtcbiAgICAgIFJhYy5Db250cm9sLm1ha2VMaW1pdE1hcmtlcih0aGlzLnJhYywgbWluUG9pbnQsIGFuZ2xlKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmRMaW1pdCA8IDEpIHtcbiAgICAgIGxldCBtYXhQb2ludCA9IGZpeGVkQW5jaG9yLnN0YXJ0UG9pbnQoKS5wb2ludFRvQW5nbGUoYW5nbGUsIGxlbmd0aCAqIHRoaXMuZW5kTGltaXQpO1xuICAgICAgUmFjLkNvbnRyb2wubWFrZUxpbWl0TWFya2VyKHRoaXMucmFjLCBtYXhQb2ludCwgYW5nbGUuaW52ZXJzZSgpKVxuICAgICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcbiAgICB9XG5cbiAgICAvLyBTZWdtZW50IGZyb20gcG9pbnRlciB0byBjb250cm9sIGRyYWdnZWQgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRDZW50ZXIgPSBwb2ludGVyVG9Lbm9iT2Zmc2V0XG4gICAgICAud2l0aFN0YXJ0UG9pbnQocG9pbnRlckNlbnRlcilcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBkcmFnZ2VkIGNlbnRlciwgYXR0YWNoZWQgdG8gcG9pbnRlclxuICAgIGRyYWdnZWRDZW50ZXIuYXJjKDIpXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKTtcblxuICAgIC8vIENvbnN0cmFpbmVkIGxlbmd0aCBjbGFtcGVkIHRvIGxpbWl0c1xuICAgIGxldCBjb25zdHJhaW5lZExlbmd0aCA9IGZpeGVkQW5jaG9yXG4gICAgICAucmF5LmRpc3RhbmNlVG9Qcm9qZWN0ZWRQb2ludChkcmFnZ2VkQ2VudGVyKTtcbiAgICBsZXQgc3RhcnRJbnNldCA9IGxlbmd0aCAqIHRoaXMuc3RhcnRMaW1pdDtcbiAgICBsZXQgZW5kSW5zZXQgPSBsZW5ndGggKiAoMSAtIHRoaXMuZW5kTGltaXQpO1xuICAgIGNvbnN0cmFpbmVkTGVuZ3RoID0gZml4ZWRBbmNob3IuY2xhbXBUb0xlbmd0aChjb25zdHJhaW5lZExlbmd0aCxcbiAgICAgIHN0YXJ0SW5zZXQsIGVuZEluc2V0KTtcblxuICAgIGxldCBjb25zdHJhaW5lZEFuY2hvckNlbnRlciA9IGZpeGVkQW5jaG9yXG4gICAgICAud2l0aExlbmd0aChjb25zdHJhaW5lZExlbmd0aClcbiAgICAgIC5lbmRQb2ludCgpO1xuXG4gICAgLy8gQ29udHJvbCBjZW50ZXIgY29uc3RyYWluZWQgdG8gYW5jaG9yXG4gICAgY29uc3RyYWluZWRBbmNob3JDZW50ZXIuYXJjKHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cylcbiAgICAgIC5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhZ2dlZCBzaGFkb3cgY2VudGVyLCBzZW1pIGF0dGFjaGVkIHRvIHBvaW50ZXJcbiAgICAvLyBhbHdheXMgcGVycGVuZGljdWxhciB0byBhbmNob3JcbiAgICBsZXQgZHJhZ2dlZFNoYWRvd0NlbnRlciA9IGRyYWdnZWRDZW50ZXJcbiAgICAgIC5zZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkoZml4ZWRBbmNob3IucmF5KVxuICAgICAgLy8gcmV2ZXJzZSBhbmQgdHJhbnNsYXRlZCB0byBjb25zdHJhaW50IHRvIGFuY2hvclxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhTdGFydFBvaW50KGNvbnN0cmFpbmVkQW5jaG9yQ2VudGVyKVxuICAgICAgLy8gU2VnbWVudCBmcm9tIGNvbnN0cmFpbmVkIGNlbnRlciB0byBzaGFkb3cgY2VudGVyXG4gICAgICAuYXR0YWNoVG9Db21wb3NpdGUoKVxuICAgICAgLmVuZFBvaW50KCk7XG5cbiAgICAvLyBDb250cm9sIHNoYWRvdyBjZW50ZXJcbiAgICBkcmFnZ2VkU2hhZG93Q2VudGVyLmFyYyh0aGlzLnJhYy5jb250cm9sbGVyLmtub2JSYWRpdXMgLyAyKVxuICAgICAgLmF0dGFjaFRvQ29tcG9zaXRlKCk7XG5cbiAgICAvLyBFYXNlIGZvciBzZWdtZW50IHRvIGRyYWdnZWQgc2hhZG93IGNlbnRlclxuICAgIGxldCBlYXNlT3V0ID0gUmFjLkVhc2VGdW5jdGlvbi5tYWtlRWFzZU91dCgpO1xuICAgIGVhc2VPdXQucG9zdEJlaGF2aW9yID0gUmFjLkVhc2VGdW5jdGlvbi5CZWhhdmlvci5jbGFtcDtcblxuICAgIC8vIFRhaWwgd2lsbCBzdG9wIHN0cmV0Y2hpbmcgYXQgMnggdGhlIG1heCB0YWlsIGxlbmd0aFxuICAgIGxldCBtYXhEcmFnZ2VkVGFpbExlbmd0aCA9IHRoaXMucmFjLmNvbnRyb2xsZXIua25vYlJhZGl1cyAqIDU7XG4gICAgZWFzZU91dC5pblJhbmdlID0gbWF4RHJhZ2dlZFRhaWxMZW5ndGggKiAyO1xuICAgIGVhc2VPdXQub3V0UmFuZ2UgPSBtYXhEcmFnZ2VkVGFpbExlbmd0aDtcblxuICAgIC8vIFNlZ21lbnQgdG8gZHJhZ2dlZCBzaGFkb3cgY2VudGVyXG4gICAgbGV0IGRyYWdnZWRUYWlsID0gZHJhZ2dlZFNoYWRvd0NlbnRlclxuICAgICAgLnNlZ21lbnRUb1BvaW50KGRyYWdnZWRDZW50ZXIpO1xuXG4gICAgbGV0IGVhc2VkTGVuZ3RoID0gZWFzZU91dC5lYXNlVmFsdWUoZHJhZ2dlZFRhaWwubGVuZ3RoKTtcbiAgICBkcmFnZ2VkVGFpbC53aXRoTGVuZ3RoKGVhc2VkTGVuZ3RoKS5hdHRhY2hUb0NvbXBvc2l0ZSgpO1xuXG4gICAgLy8gRHJhdyBhbGwhXG4gICAgdGhpcy5yYWMucG9wQ29tcG9zaXRlKCkuZHJhdyhwb2ludGVyU3R5bGUpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5Q29udHJvbFxuXG5cbm1vZHVsZS5leHBvcnRzID0gUmF5Q29udHJvbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEFuZ2xlIG1lYXN1cmVkIGJ5IGEgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSAqWzAsMSkqIHRoYXQgcmVwcmVzZW50cyB0aGVcbiogYW1vdW50IG9mIHR1cm4gaW4gYSBmdWxsIGNpcmNsZS5cbipcbiogTW9zdCBmdW5jdGlvbnMgdGhyb3VnaCBSQUMgdGhhdCBjYW4gcmVjZWl2ZSBhbiBgQW5nbGVgIHBhcmFtZXRlciBjYW5cbiogYWxzbyByZWNlaXZlIGEgYG51bWJlcmAgdmFsdWUgdGhhdCB3aWxsIGJlIHVzZWQgYXMgYHR1cm5gIHRvIGluc3RhbnRpYXRlXG4qIGEgbmV3IGBBbmdsZWAuIFRoZSBtYWluIGV4Y2VwdGlvbiB0byB0aGlzIGJlaGF2aW91ciBhcmUgY29uc3RydWN0b3JzLFxuKiB3aGljaCBhbHdheXMgZXhwZWN0IHRvIHJlY2VpdmUgYEFuZ2xlYCBvYmplY3RzLlxuKlxuKiBGb3IgZHJhd2luZyBvcGVyYXRpb25zIHRoZSB0dXJuIHZhbHVlIGlzIGludGVycHJldGVkIHRvIGJlIHBvaW50aW5nIHRvXG4qIHRoZSBmb2xsb3dpbmcgZGlyZWN0aW9uczpcbiogKyBgMC80YCAtIHBvaW50cyByaWdodFxuKiArIGAxLzRgIC0gcG9pbnRzIGRvd253YXJkc1xuKiArIGAyLzRgIC0gcG9pbnRzIGxlZnRcbiogKyBgMy80YCAtIHBvaW50cyB1cHdhcmRzXG4qXG4qIEBhbGlhcyBSYWMuQW5nbGVcbiovXG5jbGFzcyBBbmdsZSB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQW5nbGVgIGluc3RhbmNlLlxuICAqXG4gICogVGhlIGB0dXJuYCB2YWx1ZSBpcyBjb25zdHJhaW5lZCB0byB0aGUgcmFuY2UgKlswLDEpKiwgYW55IHZhbHVlXG4gICogb3V0c2lkZSBpcyByZWR1Y2VkIGJhY2sgaW50byByYW5nZSB1c2luZyBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBgYGBcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgMS80KSAgLy8gdHVybiBpcyAxLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgNS80KSAgLy8gdHVybiBpcyAxLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgLTEvNCkgLy8gdHVybiBpcyAzLzRcbiAgKiBuZXcgUmFjLkFuZ2xlKHJhYywgMSkgICAgLy8gdHVybiBpcyAwXG4gICogbmV3IFJhYy5BbmdsZShyYWMsIDQpICAgIC8vIHR1cm4gaXMgMFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSB0dXJuIC0gVGhlIHR1cm4gdmFsdWVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB0dXJuKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHR1cm4pO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICB0dXJuID0gdHVybiAlIDE7XG4gICAgaWYgKHR1cm4gPCAwKSB7XG4gICAgICB0dXJuID0gKHR1cm4gKyAxKSAlIDE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBUdXJuIHZhbHVlIG9mIHRoZSBhbmdsZSwgY29uc3RyYWluZWQgdG8gdGhlIHJhbmdlICpbMCwxKSouXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy50dXJuID0gdHVybjtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB0dXJuU3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMudHVybiwgZGlnaXRzKTtcbiAgICByZXR1cm4gYEFuZ2xlKCR7dHVyblN0cn0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgZGlmZmVyZW5jZSB3aXRoIHRoZSBgdHVybmAgdmFsdWUgb2YgdGhlIGFuZ2xlXG4gICogZGVyaXZlZCBbZnJvbV17QGxpbmsgUmFjLkFuZ2xlLmZyb219IGBhbmdsZWAgaXMgdW5kZXJcbiAgKiBge0BsaW5rIFJhYyN1bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGR9YCwgb3RoZXJ3aXNlIHJldHVybnMgYGZhbHNlYC5cbiAgKlxuICAqIEZvciB0aGlzIG1ldGhvZCBgb3RoZXJBbmdsZWAgY2FuIG9ubHkgYmUgYEFuZ2xlYCBvciBgbnVtYmVyYCwgYW55IG90aGVyXG4gICogdHlwZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBUaGlzIG1ldGhvZCB3aWxsIGNvbnNpZGVyIHR1cm4gdmFsdWVzIGluIHRoZSBvcG9zaXRlIGVuZHMgb2YgdGhlIHJhbmdlXG4gICogKlswLDEpKiBhcyBlcXVhbHMuIEUuZy4gYEFuZ2xlYCBvYmplY3RzIHdpdGggYHR1cm5gIHZhbHVlcyBvZiBgMGAgYW5kXG4gICogYDEgLSByYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkLzJgIHdpbGwgYmUgY29uc2lkZXJlZCBlcXVhbC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21cbiAgKi9cbiAgZXF1YWxzKG90aGVyQW5nbGUpIHtcbiAgICBpZiAob3RoZXJBbmdsZSBpbnN0YW5jZW9mIFJhYy5BbmdsZSkge1xuICAgICAgLy8gYWxsIGdvb2QhXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3RoZXJBbmdsZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIG90aGVyQW5nbGUgPSBBbmdsZS5mcm9tKHRoaXMucmFjLCBvdGhlckFuZ2xlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyh0aGlzLnR1cm4gLSBvdGhlckFuZ2xlLnR1cm4pO1xuICAgIHJldHVybiBkaWZmIDwgdGhpcy5yYWMudW5pdGFyeUVxdWFsaXR5VGhyZXNob2xkXG4gICAgICAvLyBGb3IgY2xvc2UgdmFsdWVzIHRoYXQgbG9vcCBhcm91bmRcbiAgICAgIHx8ICgxIC0gZGlmZikgPCB0aGlzLnJhYy51bml0YXJ5RXF1YWxpdHlUaHJlc2hvbGQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYEFuZ2xlYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGBudW1iZXJgLCByZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aFxuICAqICAgYHNvbWV0aGluZ2AgYXMgYHR1cm5gLlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhIGB7QGxpbmsgUmFjLlJheX1gLCByZXR1cm5zIGl0cyBhbmdsZS5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYSBge0BsaW5rIFJhYy5TZWdtZW50fWAsIHJldHVybnMgaXRzIGFuZ2xlLlxuICAqICsgT3RoZXJ3aXNlIGFuIGVycm9yIGlzIHRocm93bi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfFJhYy5SYXl8UmFjLlNlZ21lbnR8bnVtYmVyfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiBkZXJpdmUgYW4gYEFuZ2xlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkFuZ2xlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHNvbWV0aGluZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCBzb21ldGhpbmcpO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLlJheSkge1xuICAgICAgcmV0dXJuIHNvbWV0aGluZy5hbmdsZTtcbiAgICB9XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIFJhYy5TZWdtZW50KSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nLnJheS5hbmdsZTtcbiAgICB9XG5cbiAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmludmFsaWRPYmplY3RUeXBlKFxuICAgICAgYENhbm5vdCBkZXJpdmUgUmFjLkFuZ2xlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGByYWRpYW5zYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byBwYXNzIGFsb25nIHRvIG5ld2x5IGNyZWF0ZWQgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiByYWRpYW5zXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc3RhdGljIGZyb21SYWRpYW5zKHJhYywgcmFkaWFucykge1xuICAgIHJldHVybiBuZXcgQW5nbGUocmFjLCByYWRpYW5zIC8gUmFjLlRBVSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYGRlZ3JlZXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZXMgLSBUaGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUsIGluIGRlZ3JlZXNcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdGF0aWMgZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKSB7XG4gICAgcmV0dXJuIG5ldyBBbmdsZShyYWMsIGRlZ3JlZXMgLyAzNjApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcG9pbnRpbmcgaW4gdGhlIG9wcG9zaXRlIGRpcmVjdGlvbiB0byBgdGhpc2AuXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDEvOCkuaW52ZXJzZSgpIC8vIHR1cm4gaXMgMS84ICsgMS8yID0gNS84XG4gICogcmFjLkFuZ2xlKDcvOCkuaW52ZXJzZSgpIC8vIHR1cm4gaXMgNy84ICsgMS8yID0gMy84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIHJldHVybiB0aGlzLmFkZCh0aGlzLnJhYy5BbmdsZS5pbnZlcnNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdpdGggYSB0dXJuIHZhbHVlIGVxdWl2YWxlbnQgdG8gYC10dXJuYC5cbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMS80KS5uZWdhdGl2ZSgpIC8vIC0xLzQgYmVjb21lcyB0dXJuIDMvNFxuICAqIHJhYy5BbmdsZSgzLzgpLm5lZ2F0aXZlKCkgLy8gLTMvOCBiZWNvbWVzIHR1cm4gNS84XG4gICogYGBgXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCAtdGhpcy50dXJuKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQW5nbGVgIHdoaWNoIGlzIHBlcnBlbmRpY3VsYXIgdG8gYHRoaXNgIGluIHRoZVxuICAqIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqIGBgYFxuICAqIHJhYy5BbmdsZSgxLzgpLnBlcnBlbmRpY3VsYXIodHJ1ZSkgIC8vIHR1cm4gaXMgMS84ICsgMS80ID0gMy84XG4gICogcmFjLkFuZ2xlKDEvOCkucGVycGVuZGljdWxhcihmYWxzZSkgLy8gdHVybiBpcyAxLzggLSAxLzQgPSA3LzhcbiAgKiBgYGBcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIHBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KHRoaXMucmFjLkFuZ2xlLnNxdWFyZSwgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbWVhc3VyZSBvZiB0aGUgYW5nbGUgaW4gcmFkaWFucy5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHJhZGlhbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMudHVybiAqIFJhYy5UQVU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICpcbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBkZWdyZWVzKCkge1xuICAgIHJldHVybiB0aGlzLnR1cm4gKiAzNjA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHNpbmUgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgc2luKCkge1xuICAgIHJldHVybiBNYXRoLnNpbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgY29zaW5lIG9mIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGNvcygpIHtcbiAgICByZXR1cm4gTWF0aC5jb3ModGhpcy5yYWRpYW5zKCkpXG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIHRhbmdlbnQgb2YgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgdGFuKCkge1xuICAgIHJldHVybiBNYXRoLnRhbih0aGlzLnJhZGlhbnMoKSlcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYHR1cm5gIHZhbHVlIGluIHRoZSByYW5nZSBgKDAsIDFdYC4gV2hlbiBgdHVybmAgaXMgZXF1YWwgdG9cbiAgKiBgMGAgcmV0dXJucyBgMWAgaW5zdGVhZC5cbiAgKlxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIHR1cm5PbmUoKSB7XG4gICAgaWYgKHRoaXMudHVybiA9PT0gMCkgeyByZXR1cm4gMTsgfVxuICAgIHJldHVybiB0aGlzLnR1cm47XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBzdW0gb2YgYHRoaXNgIGFuZCB0aGUgYW5nbGUgZGVyaXZlZCBmcm9tXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFkZChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuICsgYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIHRoZSBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYFxuICAqIHN1YnRyYWN0ZWQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gc3VidHJhY3RcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzdWJ0cmFjdChhbmdsZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBBbmdsZSh0aGlzLnJhYywgdGhpcy50dXJuIC0gYW5nbGUudHVybik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYCBzZXQgdG8gYHRoaXMudHVybiAqIGZhY3RvcmAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZmFjdG9yIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgdHVybmAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBtdWx0KGZhY3Rvcikge1xuICAgIHJldHVybiBuZXcgQW5nbGUodGhpcy5yYWMsIHRoaXMudHVybiAqIGZhY3Rvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB3aXRoIGB0dXJuYCBzZXQgdG9cbiAgKiBge0BsaW5rIFJhYy5BbmdsZSN0dXJuT25lIHRoaXMudHVybk9uZSgpfSAqIGZhY3RvcmAuXG4gICpcbiAgKiBVc2VmdWwgd2hlbiBkb2luZyByYXRpbyBjYWxjdWxhdGlvbnMgd2hlcmUgYSB6ZXJvIGFuZ2xlIGNvcnJlc3BvbmRzIHRvXG4gICogYSBjb21wbGV0ZS1jaXJjbGUgc2luY2U6XG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDApLm11bHQoMC41KSAgICAvLyB0dXJuIGlzIDBcbiAgKiAvLyB3aGVyZWFzXG4gICogcmFjLkFuZ2xlKDApLm11bHRPbmUoMC41KSAvLyB0dXJuIGlzIDAuNVxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGZhY3RvciAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYHR1cm5gIGJ5XG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgbXVsdE9uZShmYWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFuZ2xlKHRoaXMucmFjLCB0aGlzLnR1cm5PbmUoKSAqIGZhY3Rvcik7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzYCB0byB0aGVcbiAgKiBhbmdsZSBkZXJpdmVkIGZyb20gYGFuZ2xlYC5cbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMS80KS5kaXN0YW5jZSgxLzIsIHRydWUpICAvLyB0dXJuIGlzIDEvMlxuICAqIHJhYy5BbmdsZSgxLzQpLmRpc3RhbmNlKDEvMiwgZmFsc2UpIC8vIHR1cm4gaW4gMy80XG4gICogYGBgXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBtZWFzdXJlIHRoZSBkaXN0YW5jZSB0b1xuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbWVhc3VyZW1lbnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBkaXN0YW5jZShhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzKTtcbiAgICByZXR1cm4gY2xvY2t3aXNlXG4gICAgICA/IGRpc3RhbmNlXG4gICAgICA6IGRpc3RhbmNlLm5lZ2F0aXZlKCk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgcmVzdWx0IG9mIHNoaWZ0aW5nIHRoZSBhbmdsZSBkZXJpdmVkIGZyb21cbiAgKiBgYW5nbGVgIHRvIGhhdmUgYHRoaXNgIGFzIGl0cyBvcmlnaW4uXG4gICpcbiAgKiBUaGlzIG9wZXJhdGlvbiBpcyB0aGUgZXF1aXZhbGVudCB0b1xuICAqICsgYHRoaXMuYWRkKGFuZ2xlKWAgd2hlbiBjbG9ja3dpc2VcbiAgKiArIGB0aGlzLnN1YnRyYWN0KGFuZ2xlKWAgd2hlbiBjb3VudGVyLWNsb2Nrd2lzZVxuICAqXG4gICogYGBgXG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnQoMC4zLCB0cnVlKSAgLy8gdHVybiBpcyAwLjEgKyAwLjMgPSAwLjRcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdCgwLjMsIGZhbHNlKSAvLyB0dXJuIGlzIDAuMSAtIDAuMyA9IDAuOFxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gYmUgc2hpZnRlZFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBzaGlmdChhbmdsZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgcmV0dXJuIGNsb2Nrd2lzZVxuICAgICAgPyB0aGlzLmFkZChhbmdsZSlcbiAgICAgIDogdGhpcy5zdWJ0cmFjdChhbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCByZXN1bHQgb2Ygc2hpZnRpbmcgYHRoaXNgIHRvIGhhdmUgdGhlIGFuZ2xlXG4gICogZGVyaXZlZCBmcm9tIGBvcmlnaW5gIGFzIGl0cyBvcmlnaW4uXG4gICpcbiAgKiBUaGUgcmVzdWx0IG9mIGBhbmdsZS5zaGlmdFRvT3JpZ2luKG9yaWdpbilgIGlzIGVxdWl2YWxlbnQgdG9cbiAgKiBgb3JpZ2luLnNoaWZ0KGFuZ2xlKWAuXG4gICpcbiAgKiBUaGlzIG9wZXJhdGlvbiBpcyB0aGUgZXF1aXZhbGVudCB0b1xuICAqICsgYG9yaWdpbi5hZGQodGhpcylgIHdoZW4gY2xvY2t3aXNlXG4gICogKyBgb3JpZ2luLnN1YnRyYWN0KHRoaXMpYCB3aGVuIGNvdW50ZXItY2xvY2t3aXNlXG4gICpcbiAgKiBgYGBcbiAgKiByYWMuQW5nbGUoMC4xKS5zaGlmdFRvT3JpZ2luKDAuMywgdHJ1ZSkgIC8vIHR1cm4gaXMgMC4zICsgMC4xID0gMC40XG4gICogcmFjLkFuZ2xlKDAuMSkuc2hpZnRUb09yaWdpbigwLjMsIGZhbHNlKSAvLyB0dXJuIGlzIDAuMyAtIDAuMSA9IDAuMlxuICAqIGBgYFxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBvcmlnaW4gLSBBbiBgQW5nbGVgIHRvIHVzZSBhcyBvcmlnaW5cbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgc2hpZnRUb09yaWdpbihvcmlnaW4sIGNsb2Nrd2lzZSkge1xuICAgIG9yaWdpbiA9IHRoaXMucmFjLkFuZ2xlLmZyb20ob3JpZ2luKTtcbiAgICByZXR1cm4gb3JpZ2luLnNoaWZ0KHRoaXMsIGNsb2Nrd2lzZSk7XG4gIH1cblxufSAvLyBjbGFzcyBBbmdsZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQW5nbGU7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cblxuLyoqXG4qIEFyYyBvZiBhIGNpcmNsZSBmcm9tIGEgYHN0YXJ0YCB0byBhbiBgZW5kYCBbYW5nbGVde0BsaW5rIFJhYy5BbmdsZX0uXG4qXG4qIEFyY3MgdGhhdCBoYXZlIFtlcXVhbF17QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30gYHN0YXJ0YCBhbmQgYGVuZGAgYW5nbGVzXG4qIGFyZSBjb25zaWRlcmVkIGEgY29tcGxldGUgY2lyY2xlLlxuKlxuKiBAYWxpYXMgUmFjLkFyY1xuKi9cbmNsYXNzIEFyY3tcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBBcmNgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBjZW50ZXIgLSBUaGUgY2VudGVyIG9mIHRoZSBhcmNcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIC0gVGhlIHJhZGl1cyBvZiB0aGUgYXJjXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IHN0YXJ0IC0gQW4gYEFuZ2xlYCB3aGVyZSB0aGUgYXJjIHN0YXJ0c1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfSBlbmQgLSBBbmcgYEFuZ2xlYCB3aGVyZSB0aGUgYXJjIGVuZHNcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IGNsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYyxcbiAgICBjZW50ZXIsIHJhZGl1cyxcbiAgICBzdGFydCwgZW5kLFxuICAgIGNsb2Nrd2lzZSlcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIGNlbnRlciwgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBjZW50ZXIpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihyYWRpdXMpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLkFuZ2xlLCBzdGFydCwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRCb29sZWFuKGNsb2Nrd2lzZSk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGNlbnRlciBgUG9pbnRgIG9mIHRoZSBhcmMuXG4gICAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAgICovXG4gICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAvKipcbiAgICAqIFRoZSByYWRpdXMgb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcblxuICAgIC8qKlxuICAgICogVGhlIHN0YXJ0IGBBbmdsZWAgb2YgdGhlIGFyYy4gVGhlIGFyYyBpcyBkcmF3IGZyb20gdGhpcyBhbmdsZSB0b3dhcmRzXG4gICAgKiBgZW5kYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICAgKlxuICAgICogV2hlbiBgc3RhcnRgIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc31cbiAgICAqIHRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjLkFuZ2xlfVxuICAgICogQHNlZSBSYWMuQW5nbGUjZXF1YWxzXG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcblxuICAgIC8qKlxuICAgICogVGhlIGVuZCBgQW5nbGVgIG9mIHRoZSBhcmMuIFRoZSBhcmMgaXMgZHJhdyBmcm9tIGBzdGFydGAgdG8gdGhpc1xuICAgICogYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAgICpcbiAgICAqIFdoZW4gYHN0YXJ0YCBhbmQgYGVuZGAgYXJlIFtlcXVhbCBhbmdsZXNde0BsaW5rIFJhYy5BbmdsZSNlcXVhbHN9XG4gICAgKiB0aGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICAgKlxuICAgICogQHR5cGUge1JhYy5BbmdsZX1cbiAgICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAgICovXG4gICAgdGhpcy5lbmQgPSBlbmQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBvcmllbnRpYXRpb24gb2YgdGhlIGFyYy5cbiAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICovXG4gICAgdGhpcy5jbG9ja3dpc2UgPSBjbG9ja3dpc2U7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuY2VudGVyLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyICAgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5jZW50ZXIueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IHJhZGl1c1N0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJhZGl1cywgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRTdHIgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQudHVybiwgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRTdHIgICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmQudHVybiwgICBkaWdpdHMpO1xuICAgIHJldHVybiBgQXJjKCgke3hTdHJ9LCR7eVN0cn0pIHI6JHtyYWRpdXNTdHJ9IHM6JHtzdGFydFN0cn0gZToke2VuZFN0cn0gYzoke3RoaXMuY2xvY2t3aXNlfX0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiBhbGwgbWVtYmVycyBvZiBib3RoIGFyY3MgYXJlIGVxdWFsLlxuICAqXG4gICogV2hlbiBgb3RoZXJBcmNgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuQXJjYCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogQXJjcycgYHJhZGl1c2AgYXJlIGNvbXBhcmVkIHVzaW5nIGB7QGxpbmsgUmFjI2VxdWFsc31gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuU2VnbWVudH0gb3RoZXJTZWdtZW50IC0gQSBgU2VnbWVudGAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqIEBzZWUgUmFjI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJBcmMpIHtcbiAgICByZXR1cm4gb3RoZXJBcmMgaW5zdGFuY2VvZiBBcmNcbiAgICAgICYmIHRoaXMucmFjLmVxdWFscyh0aGlzLnJhZGl1cywgb3RoZXJBcmMucmFkaXVzKVxuICAgICAgJiYgdGhpcy5jbG9ja3dpc2UgPT09IG90aGVyQXJjLmNsb2Nrd2lzZVxuICAgICAgJiYgdGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcilcbiAgICAgICYmIHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyQXJjLnN0YXJ0KVxuICAgICAgJiYgdGhpcy5lbmQuZXF1YWxzKG90aGVyQXJjLmVuZCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgYXJjOiB0aGUgcGFydCBvZiB0aGUgY2lyY3VtZmVyZW5jZSB0aGUgYXJjXG4gICogcmVwcmVzZW50cy5cbiAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAqL1xuICBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYW5nbGVEaXN0YW5jZSgpLnR1cm5PbmUoKSAqIHRoaXMucmFkaXVzICogUmFjLlRBVTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBjb25zaWRlcmVkIGFzIGEgY29tcGxldGVcbiAgKiBjaXJjbGUuXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgY2lyY3VtZmVyZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYWRpdXMgKiBSYWMuVEFVO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgdGhhdCByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGBzdGFydGAgYW5kXG4gICogYGVuZGAsIGluIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYXJjLlxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICovXG4gIGFuZ2xlRGlzdGFuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgd2hlcmUgdGhlIGFyYyBzdGFydHMuXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3RhcnRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5zdGFydCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSBhcmMgZW5kcy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUodGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBzdGFydGAuXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHN0YXJ0UmF5KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIHRoaXMuc3RhcnQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIGZyb20gYGNlbnRlcmAgdG93YXJzIGBlbmRgLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBlbmRSYXkoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgdGhpcy5lbmQpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBjZW50ZXJgIHRvIGBzdGFydFBvaW50KClgLlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc3RhcnRTZWdtZW50KCkge1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIHRoaXMuc3RhcnRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBjZW50ZXJgIHRvIGBlbmRQb2ludCgpYC5cbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIGVuZFNlZ21lbnQoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU2VnbWVudCh0aGlzLnJhYywgdGhpcy5lbmRSYXkoKSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGBzdGFydFBvaW50KClgIHRvIGBlbmRQb2ludCgpYC5cbiAgKlxuICAqIE5vdGUgdGhhdCBmb3IgY29tcGxldGUgY2lyY2xlIGFyY3MgdGhpcyBzZWdtZW50IHdpbGwgaGF2ZSBhIGxlbmd0aCBvZlxuICAqIHplcm8gYW5kIGJlIHBvaW50ZWQgdG93YXJkcyB0aGUgcGVycGVuZGljdWxhciBvZiBgc3RhcnRgIGluIHRoZSBhcmMnc1xuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBjaG9yZFNlZ21lbnQoKSB7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHRoaXMuc3RhcnQucGVycGVuZGljdWxhcih0aGlzLmNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnRQb2ludCgpLnNlZ21lbnRUb1BvaW50KHRoaXMuZW5kUG9pbnQoKSwgcGVycGVuZGljdWxhcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmMgaXMgYSBjb21wbGV0ZSBjaXJjbGUsIHdoaWNoIGlzIHdoZW4gYHN0YXJ0YFxuICAqIGFuZCBgZW5kYCBhcmUgW2VxdWFsIGFuZ2xlc117QGxpbmsgUmFjLkFuZ2xlI2VxdWFsc30uXG4gICpcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5BbmdsZSNlcXVhbHNcbiAgKi9cbiAgaXNDaXJjbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZXF1YWxzKHRoaXMuZW5kKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGNlbnRlciBzZXQgdG8gYG5ld0NlbnRlcmAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0NlbnRlciAtIFRoZSBjZW50ZXIgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aENlbnRlcihuZXdDZW50ZXIpIHtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIG5ld0NlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIHN0YXJ0IHNldCB0byBgbmV3U3RhcnRgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgY29uc3QgbmV3U3RhcnRBbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBuZXdTdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydEFuZ2xlLCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGVuZCBzZXQgdG8gYG5ld0VuZGAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBuZXdFbmQgLSBUaGUgZW5kIGZvciB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIHdpdGhFbmQobmV3RW5kKSB7XG4gICAgY29uc3QgbmV3RW5kQW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3RW5kKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIG5ld0VuZEFuZ2xlLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggcmFkaXVzIHNldCB0byBgbmV3UmFkaXVzYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3UmFkaXVzIC0gVGhlIHJhZGl1cyBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoUmFkaXVzKG5ld1JhZGl1cykge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIG5ld1JhZGl1cyxcbiAgICAgIHRoaXMuc3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIG9yaWVudGF0aW9uIHNldCB0byBgbmV3Q2xvY2t3aXNlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IG5ld0Nsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBmb3IgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICB3aXRoQ2xvY2t3aXNlKG5ld0Nsb2Nrd2lzZSkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgdGhpcy5lbmQsXG4gICAgICBuZXdDbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBhcyB0aGUgZGlzdGFuY2VcbiAgKiBiZXR3ZWVuIGBzdGFydGAgYW5kIGBlbmRgIGluIHRoZSBhcmMncyBvcmllbnRhdGlvbi4gVGhpcyBjaGFuZ2VzIGBlbmRgXG4gICogZm9yIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIG9mIHRoZVxuICAqIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLkFyYyNhbmdsZURpc3RhbmNlXG4gICovXG4gIHdpdGhBbmdsZURpc3RhbmNlKGFuZ2xlRGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdFbmQgPSB0aGlzLnNoaWZ0QW5nbGUoYW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICB0aGlzLnN0YXJ0LCBuZXdFbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCB0aGUgZ2l2ZW4gYGxlbmd0aGAgYXMgdGhlIGxlbmd0aCBvZiB0aGVcbiAgKiBwYXJ0IG9mIHRoZSBjaXJjdW1mZXJlbmNlIGl0IHJlcHJlc2VudHMuIFRoaXMgY2hhbmdlcyBgZW5kYCBmb3IgdGhlXG4gICogbmV3IGBBcmNgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFRoZSBhY3R1YWwgYGxlbmd0aCgpYCBvZiB0aGUgcmVzdWx0aW5nIGBBcmNgIHdpbGwgYWx3YXlzIGJlIGluIHRoZVxuICAqIHJhbmdlIGBbMCxyYWRpdXMqVEFVKWAuIFdoZW4gdGhlIGdpdmVuIGBsZW5ndGhgIGlzIGxhcmdlciB0aGF0IHRoZVxuICAqIGNpcmN1bWZlcmVuY2Ugb2YgdGhlIGFyYyBhcyBhIGNvbXBsZXRlIGNpcmNsZSwgdGhlIHJlc3VsdGluZyBhcmMgbGVuZ3RoXG4gICogd2lsbCBiZSBjdXQgYmFjayBpbnRvIHJhbmdlIHRocm91Z2ggYSBtb2R1bG8gb3BlcmF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqIEBzZWUgUmFjLkFyYyNsZW5ndGhcbiAgKi9cbiAgd2l0aExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdBbmdsZURpc3RhbmNlID0gbGVuZ3RoIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMud2l0aEFuZ2xlRGlzdGFuY2UobmV3QW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgbGVuZ3RoYCBhZGRlZCB0byB0aGUgcGFydCBvZiB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIGB0aGlzYCByZXByZXNlbnRzLiBUaGlzIGNoYW5nZXMgYGVuZGAgZm9yIHRoZVxuICAqIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBUaGUgYWN0dWFsIGBsZW5ndGgoKWAgb2YgdGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGFsd2F5cyBiZSBpbiB0aGVcbiAgKiByYW5nZSBgWzAscmFkaXVzKlRBVSlgLiBXaGVuIHRoZSByZXN1bHRpbmcgYGxlbmd0aGAgaXMgbGFyZ2VyIHRoYXQgdGhlXG4gICogY2lyY3VtZmVyZW5jZSBvZiB0aGUgYXJjIGFzIGEgY29tcGxldGUgY2lyY2xlLCB0aGUgcmVzdWx0aW5nIGFyYyBsZW5ndGhcbiAgKiB3aWxsIGJlIGN1dCBiYWNrIGludG8gcmFuZ2UgdGhyb3VnaCBhIG1vZHVsbyBvcGVyYXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5BcmMjbGVuZ3RoXG4gICovXG4gIHdpdGhMZW5ndGhBZGQobGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3QW5nbGVEaXN0YW5jZSA9ICh0aGlzLmxlbmd0aCgpICsgbGVuZ3RoKSAvIHRoaXMuY2lyY3VtZmVyZW5jZSgpO1xuICAgIHJldHVybiB0aGlzLndpdGhBbmdsZURpc3RhbmNlKG5ld0FuZ2xlRGlzdGFuY2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYSBgbGVuZ3RoKClgIG9mIGB0aGlzLmxlbmd0aCgpICogcmF0aW9gLiBUaGlzXG4gICogY2hhbmdlcyBgZW5kYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBUaGUgYWN0dWFsIGBsZW5ndGgoKWAgb2YgdGhlIHJlc3VsdGluZyBgQXJjYCB3aWxsIGFsd2F5cyBiZSBpbiB0aGVcbiAgKiByYW5nZSAqWzAscmFkaXVzKlRBVSkqLiBXaGVuIHRoZSBjYWxjdWxhdGVkIGxlbmd0aCBpcyBsYXJnZXIgdGhhdCB0aGVcbiAgKiBjaXJjdW1mZXJlbmNlIG9mIHRoZSBhcmMgYXMgYSBjb21wbGV0ZSBjaXJjbGUsIHRoZSByZXN1bHRpbmcgYXJjIGxlbmd0aFxuICAqIHdpbGwgYmUgY3V0IGJhY2sgaW50byByYW5nZSB0aHJvdWdoIGEgbW9kdWxvIG9wZXJhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYXRpbyAtIFRoZSBmYWN0b3IgdG8gbXVsdGlwbHkgYGxlbmd0aCgpYCBieVxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuQXJjI2xlbmd0aFxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aCgpICogcmF0aW87XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aChuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0UG9pbnQoKWAgbG9jYXRlZCBhdCBgcG9pbnRgLiBUaGlzXG4gICogY2hhbmdlcyBgc3RhcnRgIGFuZCBgcmFkaXVzYCBmb3IgdGhlIG5ldyBgQXJjYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5zdGFydGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgYXQgdGhlIGBzdGFydFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhTdGFydFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuc3RhcnQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgbmV3U3RhcnQsIHRoaXMuZW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYGVuZFBvaW50KClgIGxvY2F0ZWQgYXQgYHBvaW50YC4gVGhpcyBjaGFuZ2VzXG4gICogYGVuZGAgYW5kIGByYWRpdXNgIGluIHRoZSBuZXcgYEFyY2AuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgY2VudGVyYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYEFyY2Agd2lsbCB1c2UgYHRoaXMuZW5kYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBhdCB0aGUgYGVuZFBvaW50KCkgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhFbmRQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIGNvbnN0IG5ld1JhZGl1cyA9IHRoaXMuY2VudGVyLmRpc3RhbmNlVG9Qb2ludChwb2ludCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgbmV3UmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbVxuICAqIGBjZW50ZXJgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGNlbnRlcmAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCBgc3RhcnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKlxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICB3aXRoU3RhcnRUb3dhcmRzUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5zdGFydCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgdGhpcy5lbmQsXG4gICAgICB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2Agd2l0aCBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBwb2ludGAgZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBXaGVuIGBjZW50ZXJgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgQXJjYCB3aWxsIHVzZSBgdGhpcy5lbmRgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IGBlbmRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgd2l0aEVuZFRvd2FyZHNQb2ludChwb2ludCkge1xuICAgIGNvbnN0IG5ld0VuZCA9IHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5lbmQpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBwb2ludGluZyB0b3dhcmRzIGBzdGFydFBvaW50YCBhbmRcbiAgKiBgZW5kYCBwb2ludGluZyB0b3dhcmRzIGBlbmRQb2ludGAsIGJvdGggZnJvbSBgY2VudGVyYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiAqIFdoZW4gYGNlbnRlcmAgaXMgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IHRvXG4gICogZWl0aGVyIGBzdGFydFBvaW50YCBvciBgZW5kUG9pbnRgLCB0aGUgbmV3IGBBcmNgIHdpbGwgdXNlIGB0aGlzLnN0YXJ0YFxuICAqIG9yIGB0aGlzLmVuZGAgcmVzcGVjdGl2ZWx5LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHN0YXJ0UG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHs/UmFjLlBvaW50fSBbZW5kUG9pbnQ9bnVsbF0gLSBBIGBQb2ludGAgdG8gcG9pbnQgYGVuZGAgdG93YXJkcztcbiAgKiB3aGVuIG9tbWl0ZWQgb3IgYG51bGxgLCBgc3RhcnRQb2ludGAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHdpdGhBbmdsZXNUb3dhcmRzUG9pbnQoc3RhcnRQb2ludCwgZW5kUG9pbnQgPSBudWxsKSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoc3RhcnRQb2ludCwgdGhpcy5zdGFydCk7XG4gICAgY29uc3QgbmV3RW5kID0gZW5kUG9pbnQgPT09IG51bGxcbiAgICAgID8gbmV3U3RhcnRcbiAgICAgIDogdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGVuZFBvaW50LCB0aGlzLmVuZCk7XG4gICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gICAgICBuZXdTdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggYHN0YXJ0YCBzaGlmdGVkIGJ5IHRoZSBnaXZlbiBgYW5nbGVgIGluIHRoZVxuICAqIGFyYydzIG9wcG9zaXRlIG9yaWVudGF0aW9uLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIE5vdGljZSB0aGF0IHRoaXMgbWV0aG9kIHNoaWZ0cyBgc3RhcnRgIHRvIHRoZSBhcmMncyAqb3Bwb3NpdGUqXG4gICogb3JpZW50YXRpb24sIGludGVuZGluZyB0byByZXN1bHQgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0b1xuICAqIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCBgc3RhcnRgIGFnYWluc3RcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGFuZ2xlKSB7XG4gICAgbGV0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5zaGlmdChhbmdsZSwgIXRoaXMuY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IEFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cyxcbiAgICAgIG5ld1N0YXJ0LCB0aGlzLmVuZCxcbiAgICAgIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCB3aXRoIGBlbmRgIHNoaWZ0ZWQgYnkgdGhlIGdpdmVuIGBhbmdsZWAgaW4gdGhlXG4gICogYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhpcyBtZXRob2Qgc2hpZnRzIGBlbmRgIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLFxuICAqIGludGVuZGluZyB0byByZXN1bHQgaW4gYSBuZXcgYEFyY2Agd2l0aCBhbiBpbmNyZWFzZSB0b1xuICAqIGBhbmdsZURpc3RhbmNlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBzaGlmdCBgc3RhcnRgIGFnYWluc3RcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgd2l0aEVuZEV4dGVuc2lvbihhbmdsZSkge1xuICAgIGxldCBuZXdFbmQgPSB0aGlzLmVuZC5zaGlmdChhbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5zdGFydCwgbmV3RW5kLFxuICAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggaXRzIGBzdGFydGAgYW5kIGBlbmRgIGV4Y2hhbmdlZCwgYW5kIHRoZVxuICAqIG9wcG9zaXRlIGNsb2Nrd2lzZSBvcmllbnRhdGlvbi4gVGhlIGNlbnRlciBhbmQgcmFkaXVzIHJlbWFpbiBiZSB0aGVcbiAgKiBzYW1lIGFzIGB0aGlzYC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICByZXZlcnNlKCkge1xuICAgIHJldHVybiBuZXcgQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5jZW50ZXIsIHRoaXMucmFkaXVzLFxuICAgICAgdGhpcy5lbmQsIHRoaXMuc3RhcnQsXG4gICAgICAhdGhpcy5jbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBnaXZlbiBgYW5nbGVgIGNsYW1wZWQgdG8gdGhlIHJhbmdlOlxuICAqIGBgYFxuICAqIFtzdGFydCArIHN0YXJ0SW5zZXQsIGVuZCAtIGVuZEluc2V0XVxuICAqIGBgYFxuICAqIHdoZXJlIHRoZSBhZGRpdGlvbiBoYXBwZW5zIHRvd2FyZHMgdGhlIGFyYydzIG9yaWVudGF0aW9uLCBhbmQgdGhlXG4gICogc3VidHJhY3Rpb24gYWdhaW5zdC5cbiAgKlxuICAqIFdoZW4gYGFuZ2xlYCBpcyBvdXRzaWRlIHRoZSByYW5nZSwgcmV0dXJucyB3aGljaGV2ZXIgcmFuZ2UgbGltaXQgaXNcbiAgKiBjbG9zZXIuXG4gICpcbiAgKiBXaGVuIHRoZSBzdW0gb2YgdGhlIGdpdmVuIGluc2V0cyBpcyBsYXJnZXIgdGhhdCBgdGhpcy5hcmNEaXN0YW5jZSgpYFxuICAqIHRoZSByYW5nZSBmb3IgdGhlIGNsYW1wIGlzIGltcG9zaWJsZSB0byBmdWxmaWxsLiBJbiB0aGlzIGNhc2UgdGhlXG4gICogcmV0dXJuZWQgdmFsdWUgd2lsbCBiZSB0aGUgY2VudGVyZWQgYmV0d2VlbiB0aGUgcmFuZ2UgbGltaXRzIGFuZCBzdGlsbFxuICAqIGNsYW1wbGVkIHRvIGBbc3RhcnQsIGVuZF1gLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IFtzdGFydEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV0gLSBUaGUgaW5zZXRcbiAgKiBmb3IgdGhlIGxvd2VyIGxpbWl0IG9mIHRoZSBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW2VuZEluc2V0PXtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfV0gLSBUaGUgaW5zZXRcbiAgKiBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGUgY2xhbXBpbmcgcmFuZ2VcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBjbGFtcFRvQW5nbGVzKGFuZ2xlLCBzdGFydEluc2V0ID0gdGhpcy5yYWMuQW5nbGUuemVybywgZW5kSW5zZXQgPSB0aGlzLnJhYy5BbmdsZS56ZXJvKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHN0YXJ0SW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgc3RhcnRJbnNldCk7XG4gICAgZW5kSW5zZXQgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgZW5kSW5zZXQpO1xuXG4gICAgaWYgKHRoaXMuaXNDaXJjbGUoKSAmJiBzdGFydEluc2V0LnR1cm4gPT0gMCAmJiBlbmRJbnNldC50dXJuID09IDApIHtcbiAgICAgIC8vIENvbXBsZXRlIGNpcmNsZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIEFuZ2xlIGluIGFyYywgd2l0aCBhcmMgYXMgb3JpZ2luXG4gICAgLy8gQWxsIGNvbXBhcmlzb25zIGFyZSBtYWRlIGluIGEgY2xvY2t3aXNlIG9yaWVudGF0aW9uXG4gICAgY29uc3Qgc2hpZnRlZEFuZ2xlID0gdGhpcy5kaXN0YW5jZUZyb21TdGFydChhbmdsZSk7XG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpO1xuICAgIGNvbnN0IHNoaWZ0ZWRTdGFydENsYW1wID0gc3RhcnRJbnNldDtcbiAgICBjb25zdCBzaGlmdGVkRW5kQ2xhbXAgPSBhbmdsZURpc3RhbmNlLnN1YnRyYWN0KGVuZEluc2V0KTtcbiAgICBjb25zdCB0b3RhbEluc2V0VHVybiA9IHN0YXJ0SW5zZXQudHVybiArIGVuZEluc2V0LnR1cm47XG5cbiAgICBpZiAodG90YWxJbnNldFR1cm4gPj0gYW5nbGVEaXN0YW5jZS50dXJuT25lKCkpIHtcbiAgICAgIC8vIEludmFsaWQgcmFuZ2VcbiAgICAgIGNvbnN0IHJhbmdlRGlzdGFuY2UgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZFN0YXJ0Q2xhbXApO1xuICAgICAgbGV0IGhhbGZSYW5nZTtcbiAgICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHtcbiAgICAgICAgaGFsZlJhbmdlID0gcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoYWxmUmFuZ2UgPSB0b3RhbEluc2V0VHVybiA+PSAxXG4gICAgICAgICAgPyByYW5nZURpc3RhbmNlLm11bHRPbmUoMS8yKVxuICAgICAgICAgIDogcmFuZ2VEaXN0YW5jZS5tdWx0KDEvMik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1pZGRsZVJhbmdlID0gc2hpZnRlZEVuZENsYW1wLmFkZChoYWxmUmFuZ2UpO1xuICAgICAgY29uc3QgbWlkZGxlID0gdGhpcy5zdGFydC5zaGlmdChtaWRkbGVSYW5nZSwgdGhpcy5jbG9ja3dpc2UpO1xuXG4gICAgICByZXR1cm4gdGhpcy5jbGFtcFRvQW5nbGVzKG1pZGRsZSk7XG4gICAgfVxuXG4gICAgaWYgKHNoaWZ0ZWRBbmdsZS50dXJuID49IHNoaWZ0ZWRTdGFydENsYW1wLnR1cm4gJiYgc2hpZnRlZEFuZ2xlLnR1cm4gPD0gc2hpZnRlZEVuZENsYW1wLnR1cm4pIHtcbiAgICAgIC8vIEluc2lkZSBjbGFtcCByYW5nZVxuICAgICAgcmV0dXJuIGFuZ2xlO1xuICAgIH1cblxuICAgIC8vIE91dHNpZGUgcmFuZ2UsIGZpZ3VyZSBvdXQgY2xvc2VzdCBsaW1pdFxuICAgIGxldCBkaXN0YW5jZVRvU3RhcnRDbGFtcCA9IHNoaWZ0ZWRTdGFydENsYW1wLmRpc3RhbmNlKHNoaWZ0ZWRBbmdsZSwgZmFsc2UpO1xuICAgIGxldCBkaXN0YW5jZVRvRW5kQ2xhbXAgPSBzaGlmdGVkRW5kQ2xhbXAuZGlzdGFuY2Uoc2hpZnRlZEFuZ2xlKTtcbiAgICBpZiAoZGlzdGFuY2VUb1N0YXJ0Q2xhbXAudHVybiA8PSBkaXN0YW5jZVRvRW5kQ2xhbXAudHVybikge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQuc2hpZnQoc3RhcnRJbnNldCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5lbmQuc2hpZnQoZW5kSW5zZXQsICF0aGlzLmNsb2Nrd2lzZSk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGBhbmdsZWAgaXMgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZW5kYCBpbiB0aGUgYXJjJ3NcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFdoZW4gdGhlIGFyYyByZXByZXNlbnRzIGEgY29tcGxldGUgY2lyY2xlLCBgdHJ1ZWAgaXMgYWx3YXlzIHJldHVybmVkLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBpZiAodGhpcy5pc0NpcmNsZSgpKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBpZiAodGhpcy5jbG9ja3dpc2UpIHtcbiAgICAgIGxldCBvZmZzZXQgPSBhbmdsZS5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIGxldCBlbmRPZmZzZXQgPSB0aGlzLmVuZC5zdWJ0cmFjdCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJldHVybiBvZmZzZXQudHVybiA8PSBlbmRPZmZzZXQudHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9mZnNldCA9IGFuZ2xlLnN1YnRyYWN0KHRoaXMuZW5kKTtcbiAgICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMuc3RhcnQuc3VidHJhY3QodGhpcy5lbmQpO1xuICAgICAgcmV0dXJuIG9mZnNldC50dXJuIDw9IHN0YXJ0T2Zmc2V0LnR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIGluIHRoZSBhcmMgaXMgcG9zaXRpb25lZFxuICAqIGJldHdlZW4gYHN0YXJ0YCBhbmQgYGVuZGAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiB0aGUgYXJjIHJlcHJlc2VudHMgYSBjb21wbGV0ZSBjaXJjbGUsIGB0cnVlYCBpcyBhbHdheXMgcmV0dXJuZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gZXZhbHVhdGVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKi9cbiAgY29udGFpbnNQcm9qZWN0ZWRQb2ludChwb2ludCkge1xuICAgIGlmICh0aGlzLmlzQ2lyY2xlKCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICByZXR1cm4gdGhpcy5jb250YWluc0FuZ2xlKHRoaXMuY2VudGVyLmFuZ2xlVG9Qb2ludChwb2ludCkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBbmdsZWAgd2l0aCBgYW5nbGVgIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9XG4gICogYHN0YXJ0YCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBFLmcuXG4gICogRm9yIGEgY2xvY2t3aXNlIGFyYyBzdGFydGluZyBhdCBgMC41YDogYHNoaWZ0QW5nbGUoMC4xKWAgaXMgYDAuNmAuXG4gICogRm9yIGEgY291bnRlci1jbG9ja3dpc2UgYXJjIHN0YXJ0aW5nIGF0IGAwLjVgOiBgc2hpZnRBbmdsZSgwLjEpYCBpcyBgMC40YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKiBAc2VlIFJhYy5BbmdsZSNzaGlmdFxuICAqL1xuICBzaGlmdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LnNoaWZ0KGFuZ2xlLCB0aGlzLmNsb2Nrd2lzZSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIGFuIEFuZ2xlIHRoYXQgcmVwcmVzZW50cyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpcy5zdGFydGAgdG9cbiAgLy8gYGFuZ2xlYCB0cmF2ZWxpbmcgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAvLyBVc2VmdWwgdG8gZGV0ZXJtaW5lIGZvciBhIGdpdmVuIGFuZ2xlLCB3aGVyZSBpdCBzaXRzIGluc2lkZSB0aGUgYXJjIGlmXG4gIC8vIHRoZSBhcmMgd2FzIHRoZSBvcmlnaW4gY29vcmRpbmF0ZSBzeXN0ZW0uXG4gIC8vXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFuZ2xlYCB0aGF0IHJlcHJlc2VudHMgdGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gYHN0YXJ0YFxuICAqIHRvIGBhbmdsZWAgaW4gdGhlIGFyYydzIG9yaWVudGF0aW9uLlxuICAqXG4gICogRS5nLlxuICAqIEZvciBhIGNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBkaXN0YW5jZUZyb21TdGFydCgwLjYpYCBpcyBgMC4xYC5cbiAgKiBGb3IgYSBjb3VudGVyLWNsb2Nrd2lzZSBhcmMgc3RhcnRpbmcgYXQgYDAuNWA6IGBkaXN0YW5jZUZyb21TdGFydCgwLjYpYCBpcyBgMC45YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKi9cbiAgZGlzdGFuY2VGcm9tU3RhcnQoYW5nbGUpIHtcbiAgICBhbmdsZSA9IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZGlzdGFuY2UoYW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYC4gVGhpc1xuICAqIG1ldGhvZCBkb2VzIG5vdCBjb25zaWRlciB0aGUgYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvd2FyZHMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdEFuZ2xlKGFuZ2xlKSB7XG4gICAgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgYW5nbGUpO1xuICAgIHJldHVybiB0aGlzLmNlbnRlci5wb2ludFRvQW5nbGUoYW5nbGUsIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGxvY2F0ZWQgaW4gdGhlIGFyYyBhdCB0aGUgZ2l2ZW4gYGFuZ2xlYFxuICAqIFtzaGlmdGVkIGJ5XXtAbGluayBSYWMuQW5nbGUjc2hpZnR9IGBzdGFydGAgaW4gYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIGJlIHNoaWZ0ZWQgYnkgYHN0YXJ0YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRBbmdsZURpc3RhbmNlKGFuZ2xlKSB7XG4gICAgbGV0IHNoaWZ0ZWRBbmdsZSA9IHRoaXMuc2hpZnRBbmdsZShhbmdsZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgdGhlIGdpdmVuIGBsZW5ndGhgIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiBhcmMncyBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIGZyb20gYHN0YXJ0UG9pbnQoKWAgdG8gdGhlIG5ldyBgUG9pbnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gbGVuZ3RoIC8gdGhpcy5jaXJjdW1mZXJlbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSBhcmMgYXQgYGxlbmd0aCgpICogcmF0aW9gIGZyb21cbiAgKiBgc3RhcnRQb2ludCgpYCBpbiB0aGUgYXJjJ3Mgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGgoKWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICBsZXQgbmV3QW5nbGVEaXN0YW5jZSA9IHRoaXMuYW5nbGVEaXN0YW5jZSgpLm11bHRPbmUocmF0aW8pO1xuICAgIGxldCBzaGlmdGVkQW5nbGUgPSB0aGlzLnNoaWZ0QW5nbGUobmV3QW5nbGVEaXN0YW5jZSk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRBdEFuZ2xlKHNoaWZ0ZWRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgcmFkaXVzIG9mIHRoZSBhcmMgYXQgdGhlXG4gICogZ2l2ZW4gYGFuZ2xlYC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlIGBzdGFydGAgbm9yIGBlbmRgIG9mXG4gICogdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50QXRBbmdsZShhbmdsZSkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcy5jZW50ZXIsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgcmVwcmVzZW50aW5nIHRoZSByYWRpdXMgb2YgdGhlIGFyYyBpbiB0aGVcbiAgKiBkaXJlY3Rpb24gdG93YXJkcyB0aGUgZ2l2ZW4gYHBvaW50YC4gVGhpcyBtZXRob2QgZG9lcyBub3QgY29uc2lkZXIgdGhlXG4gICogYHN0YXJ0YCBub3IgYGVuZGAgb2YgdGhlIGFyYy5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLnBvaW50fSBwb2ludCAtIEEgYFBvaW50YCBpbiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYWRpdXMgdG8gcmV0dXJuXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICByYWRpdXNTZWdtZW50VG93YXJkc1BvaW50KHBvaW50KSB7XG4gICAgY29uc3QgYW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQocG9pbnQpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLmNlbnRlciwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmb3IgdGhlIGNob3JkIGZvcm1lZCBieSB0aGUgaW50ZXJzZWN0aW9uIG9mXG4gICogYHRoaXNgIGFuZCBgb3RoZXJBcmNgLCBvciBgbnVsbGAgd2hlbiB0aGVyZSBpcyBubyBpbnRlcnNlY3Rpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHdpbGwgcG9pbnQgdG93YXJkcyB0aGUgYHRoaXNgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQm90aCBhcmNzIGFyZSBjb25zaWRlcmVkIGNvbXBsZXRlIGNpcmNsZXMgZm9yIHRoZSBjYWxjdWxhdGlvbiBvZiB0aGVcbiAgKiBjaG9yZCwgdGh1cyB0aGUgZW5kcG9pbnRzIG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IG1heSBub3QgbGF5IGluc2lkZVxuICAqIHRoZSBhY3R1YWwgYXJjcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gb3RoZXJBcmMgLSBkZXNjcmlwdGlvblxuICAqIEByZXR1cm5zIHs/UmFjLlNlZ21lbnR9XG4gICovXG4gIGludGVyc2VjdGlvbkNob3JkKG90aGVyQXJjKSB7XG4gICAgLy8gaHR0cHM6Ly9tYXRod29ybGQud29sZnJhbS5jb20vQ2lyY2xlLUNpcmNsZUludGVyc2VjdGlvbi5odG1sXG4gICAgLy8gUj10aGlzLCByPW90aGVyQXJjXG5cbiAgICBpZiAodGhpcy5jZW50ZXIuZXF1YWxzKG90aGVyQXJjLmNlbnRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5jZW50ZXIuZGlzdGFuY2VUb1BvaW50KG90aGVyQXJjLmNlbnRlcik7XG5cbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cyArIG90aGVyQXJjLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gZGlzdGFuY2VUb0Nob3JkID0gKGReMiAtIHJeMiArIFJeMikgLyAoZCoyKVxuICAgIGNvbnN0IGRpc3RhbmNlVG9DaG9yZCA9IChcbiAgICAgICAgTWF0aC5wb3coZGlzdGFuY2UsIDIpXG4gICAgICAtIE1hdGgucG93KG90aGVyQXJjLnJhZGl1cywgMilcbiAgICAgICsgTWF0aC5wb3codGhpcy5yYWRpdXMsIDIpXG4gICAgICApIC8gKGRpc3RhbmNlICogMik7XG5cbiAgICAvLyBhID0gMS9kIHNxcnR8KC1kK3ItUikoLWQtcitSKSgtZCtyK1IpKGQrcitSKVxuICAgIGNvbnN0IGNob3JkTGVuZ3RoID0gKDEgLyBkaXN0YW5jZSkgKiBNYXRoLnNxcnQoXG4gICAgICAgICgtZGlzdGFuY2UgKyBvdGhlckFyYy5yYWRpdXMgLSB0aGlzLnJhZGl1cylcbiAgICAgICogKC1kaXN0YW5jZSAtIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKVxuICAgICAgKiAoLWRpc3RhbmNlICsgb3RoZXJBcmMucmFkaXVzICsgdGhpcy5yYWRpdXMpXG4gICAgICAqIChkaXN0YW5jZSArIG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzKSk7XG5cbiAgICBjb25zdCBzZWdtZW50VG9DaG9yZCA9IHRoaXMuY2VudGVyLnJheVRvUG9pbnQob3RoZXJBcmMuY2VudGVyKVxuICAgICAgLnNlZ21lbnQoZGlzdGFuY2VUb0Nob3JkKTtcbiAgICByZXR1cm4gc2VnbWVudFRvQ2hvcmQubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKHRoaXMuY2xvY2t3aXNlLCBjaG9yZExlbmd0aC8yKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLndpdGhMZW5ndGhSYXRpbygyKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgaWYgaW50ZXJzZWN0aW5nUG9pbnRzV2l0aEFyYyBpcyBuZWNlc3NhcnlcbiAgLyoqXG4gICogUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBpbnRlcnNlY3RpbmcgcG9pbnRzIG9mIGB0aGlzYCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIFdoZW4gdGhlcmUgYXJlIG5vIGludGVyc2VjdGluZyBwb2ludHMsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGludGVyc2VjdGlvbiBwb2ludHMgd2l0aFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqXG4gICogQGlnbm9yZVxuICAqL1xuICAvLyBpbnRlcnNlY3RpbmdQb2ludHNXaXRoQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBbXTsgfVxuXG4gIC8vICAgbGV0IGludGVyc2VjdGlvbnMgPSBbY2hvcmQuc3RhcnRQb2ludCgpLCBjaG9yZC5lbmRQb2ludCgpXS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAvLyAgICAgcmV0dXJuIHRoaXMuY29udGFpbnNBbmdsZSh0aGlzLmNlbnRlci5zZWdtZW50VG9Qb2ludChpdGVtKSlcbiAgLy8gICAgICAgJiYgb3RoZXJBcmMuY29udGFpbnNBbmdsZShvdGhlckFyYy5jZW50ZXIuc2VnbWVudFRvUG9pbnQoaXRlbSkpO1xuICAvLyAgIH0sIHRoaXMpO1xuXG4gIC8vICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XG4gIC8vIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHJlcHJlc2VudGluZyB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYFNlZ21lbnRgIHdpbGwgYWx3YXlzIGhhdmUgdGhlIHNhbWUgYW5nbGUgYXMgYHJheWAuXG4gICpcbiAgKiBUaGUgYXJjIGlzIGNvbnNpZGVyZWQgYSBjb21wbGV0ZSBjaXJjbGUgYW5kIGByYXlgIGlzIGNvbnNpZGVyZWQgYW5cbiAgKiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMgez9SYWMuU2VnbWVudH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRXaXRoUmF5KHJheSkge1xuICAgIC8vIEZpcnN0IGNoZWNrIGludGVyc2VjdGlvblxuICAgIGNvbnN0IGJpc2VjdG9yID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUHJvamVjdGlvbkluUmF5KHJheSk7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBiaXNlY3Rvci5sZW5ndGg7XG5cbiAgICAvLyBTZWdtZW50IHRvbyBjbG9zZSB0byBjZW50ZXIsIGNvc2luZSBjYWxjdWxhdGlvbnMgbWF5IGJlIGluY29ycmVjdFxuICAgIC8vIENhbGN1bGF0ZSBzZWdtZW50IHRocm91Z2ggY2VudGVyXG4gICAgaWYgKHRoaXMucmFjLmVxdWFscygwLCBkaXN0YW5jZSkpIHtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb2ludEF0QW5nbGUocmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMucmFkaXVzKjIpO1xuICAgIH1cblxuICAgIC8vIFJheSBpcyB0YW5nZW50LCByZXR1cm4gemVyby1sZW5ndGggc2VnbWVudCBhdCBjb250YWN0IHBvaW50XG4gICAgaWYgKHRoaXMucmFjLmVxdWFscyhkaXN0YW5jZSwgdGhpcy5yYWRpdXMpKSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKGJpc2VjdG9yLnJheS5hbmdsZSk7XG4gICAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgc3RhcnQsIHJheS5hbmdsZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIDApO1xuICAgIH1cblxuICAgIC8vIFJheSBkb2VzIG5vdCB0b3VjaCBhcmNcbiAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnJhZGl1cykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmFkaWFucyA9IE1hdGguYWNvcyhkaXN0YW5jZS90aGlzLnJhZGl1cyk7XG4gICAgY29uc3QgYW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIHJhZGlhbnMpO1xuXG4gICAgY29uc3QgY2VudGVyT3JpZW50YXRpb24gPSByYXkucG9pbnRPcmllbnRhdGlvbih0aGlzLmNlbnRlcik7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCAhY2VudGVyT3JpZW50YXRpb24pKTtcbiAgICBjb25zdCBlbmQgPSB0aGlzLnBvaW50QXRBbmdsZShiaXNlY3Rvci5hbmdsZSgpLnNoaWZ0KGFuZ2xlLCBjZW50ZXJPcmllbnRhdGlvbikpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIHJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCByZXByZXNlbnRpbmcgdGhlIGVuZCBvZiB0aGUgY2hvcmQgZm9ybWVkIGJ5IHRoZVxuICAqIGludGVyc2VjdGlvbiBvZiB0aGUgYXJjIGFuZCAncmF5Jywgb3IgYG51bGxgIHdoZW4gbm8gY2hvcmQgaXMgcG9zc2libGUuXG4gICpcbiAgKiBXaGVuIGB1c2VQcm9qZWN0aW9uYCBpcyBgdHJ1ZWAgdGhlIG1ldGhvZCB3aWxsIGFsd2F5cyByZXR1cm4gYSBgUG9pbnRgXG4gICogZXZlbiB3aGVuIHRoZXJlIGlzIG5vIGNvbnRhY3QgYmV0d2VlbiB0aGUgYXJjIGFuZCBgcmF5YC4gSW4gdGhpcyBjYXNlXG4gICogdGhlIHBvaW50IGluIHRoZSBhcmMgY2xvc2VzdCB0byBgcmF5YCBpcyByZXR1cm5lZC5cbiAgKlxuICAqIFRoZSBhcmMgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSBhbmQgYHJheWAgaXMgY29uc2lkZXJlZCBhblxuICAqIHVuYm91bmRlZCBsaW5lLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSByYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5Qb2ludH1cbiAgKi9cbiAgaW50ZXJzZWN0aW9uQ2hvcmRFbmRXaXRoUmF5KHJheSwgdXNlUHJvamVjdGlvbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgY2hvcmQgPSB0aGlzLmludGVyc2VjdGlvbkNob3JkV2l0aFJheShyYXkpO1xuICAgIGlmIChjaG9yZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNob3JkLmVuZFBvaW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHVzZVByb2plY3Rpb24pIHtcbiAgICAgIGNvbnN0IGNlbnRlck9yaWVudGF0aW9uID0gcmF5LnBvaW50T3JpZW50YXRpb24odGhpcy5jZW50ZXIpO1xuICAgICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCFjZW50ZXJPcmllbnRhdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5wb2ludEF0QW5nbGUocGVycGVuZGljdWxhcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AsIG9yIGBudWxsYCB3aGVuIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyY1xuICAqIHdpbGwgaGF2ZSB0aGUgc2FtZSBjZW50ZXIsIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIEJvdGggYXJjcyBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzIGZvciB0aGUgY2FsY3VsYXRpb24gb2YgdGhlXG4gICogaW50ZXJzZWN0aW9uLCB0aHVzIHRoZSBlbmRwb2ludHMgb2YgdGhlIHJldHVybmVkIGFyYyBtYXkgbm90IGxheSBpbnNpZGVcbiAgKiBgdGhpc2AuXG4gICpcbiAgKiBBbiBlZGdlIGNhc2Ugb2YgdGhpcyBtZXRob2QgaXMgdGhhdCB3aGVuIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGB0aGlzYFxuICAqIGFuZCBgb3RoZXJBcmNgIGlzIHRoZSBzdW0gb2YgdGhlaXIgcmFkaXVzLCBtZWFuaW5nIHRoZSBhcmNzIHRvdWNoIGF0IGFcbiAgKiBzaW5nbGUgcG9pbnQsIHRoZSByZXN1bHRpbmcgYXJjIG1heSBoYXZlIGEgYW5nbGUtZGlzdGFuY2Ugb2YgemVybyxcbiAgKiB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyBhIGNvbXBsZXRlLWNpcmNsZSBhcmMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IG90aGVyQXJjIC0gQW4gYEFyY2AgdG8gaW50ZXJzZWN0IHdpdGhcbiAgKiBAcmV0dXJucyB7P1JhYy5BcmN9XG4gICovXG4gIGludGVyc2VjdGlvbkFyYyhvdGhlckFyYykge1xuICAgIGNvbnN0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICByZXR1cm4gdGhpcy53aXRoQW5nbGVzVG93YXJkc1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSwgY2hvcmQuZW5kUG9pbnQoKSk7XG4gIH1cblxuXG4gIC8vIFRPRE86IGltcGxlbWVudCBpbnRlcnNlY3Rpb25BcmNOb0NpcmNsZT9cblxuXG4gIC8vIFRPRE86IGZpbmlzaCBib3VuZGVkSW50ZXJzZWN0aW9uQXJjXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgcmVwcmVzZW50aW5nIHRoZSBzZWN0aW9uIG9mIGB0aGlzYCB0aGF0IGlzIGluc2lkZVxuICAqIGBvdGhlckFyY2AgYW5kIGJvdW5kZWQgYnkgYHRoaXMuc3RhcnRgIGFuZCBgdGhpcy5lbmRgLCBvciBgbnVsbGAgd2hlblxuICAqIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbi4gVGhlIHJldHVybmVkIGFyYyB3aWxsIGhhdmUgdGhlIHNhbWUgY2VudGVyLFxuICAqIHJhZGl1cywgYW5kIG9yaWVudGF0aW9uIGFzIGB0aGlzYC5cbiAgKlxuICAqIGBvdGhlckFyY2AgaXMgY29uc2lkZXJlZCBhIGNvbXBsZXRlIGNpcmNsZSwgd2hpbGUgdGhlIHN0YXJ0IGFuZCBlbmQgb2ZcbiAgKiBgdGhpc2AgYXJlIGNvbnNpZGVyZWQgZm9yIHRoZSByZXN1bHRpbmcgYEFyY2AuXG4gICpcbiAgKiBXaGVuIHRoZXJlIGV4aXN0IHR3byBzZXBhcmF0ZSBhcmMgc2VjdGlvbnMgdGhhdCBpbnRlcnNlY3Qgd2l0aFxuICAqIGBvdGhlckFyY2A6IG9ubHkgdGhlIHNlY3Rpb24gb2YgYHRoaXNgIGNsb3Nlc3QgdG8gYHN0YXJ0YCBpcyByZXR1cm5lZC5cbiAgKiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBgdGhpc2Agc3RhcnRzIGluc2lkZSBgb3RoZXJBcmNgLCB0aGVuIGV4aXRzLCBhbmRcbiAgKiB0aGVuIGVuZHMgaW5zaWRlIGBvdGhlckFyY2AsIHJlZ2FyZGxlc3MgaWYgYHRoaXNgIGlzIGEgY29tcGxldGUgY2lyY2xlXG4gICogb3Igbm90LlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGludGVyc2VjdCB3aXRoXG4gICogQHJldHVybnMgez9SYWMuQXJjfVxuICAqXG4gICogQGlnbm9yZVxuICAqL1xuICAvLyBib3VuZGVkSW50ZXJzZWN0aW9uQXJjKG90aGVyQXJjKSB7XG4gIC8vICAgbGV0IGNob3JkID0gdGhpcy5pbnRlcnNlY3Rpb25DaG9yZChvdGhlckFyYyk7XG4gIC8vICAgaWYgKGNob3JkID09PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgLy8gICBsZXQgY2hvcmRTdGFydEFuZ2xlID0gdGhpcy5jZW50ZXIuYW5nbGVUb1BvaW50KGNob3JkLnN0YXJ0UG9pbnQoKSk7XG4gIC8vICAgbGV0IGNob3JkRW5kQW5nbGUgPSB0aGlzLmNlbnRlci5hbmdsZVRvUG9pbnQoY2hvcmQuZW5kUG9pbnQoKSk7XG5cbiAgLy8gICAvLyBnZXQgYWxsIGRpc3RhbmNlcyBmcm9tIHRoaXMuc3RhcnRcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkRW5kQW5nbGUsIG9ubHkgc3RhcnQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIHRoaXMuZW5kLCB3aG9sZSBhcmMgaXMgaW5zaWRlIG9yIG91dHNpZGVcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGNob3JkU3RhcnRBbmdsZSwgb25seSBlbmQgbWF5IGJlIGluc2lkZSBhcmNcbiAgLy8gICBjb25zdCBpbnRlclN0YXJ0RGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkU3RhcnRBbmdsZSwgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyAgIGNvbnN0IGludGVyRW5kRGlzdGFuY2UgPSB0aGlzLnN0YXJ0LmRpc3RhbmNlKGNob3JkRW5kQW5nbGUsIHRoaXMuY2xvY2t3aXNlKTtcbiAgLy8gICBjb25zdCBlbmREaXN0YW5jZSA9IHRoaXMuc3RhcnQuZGlzdGFuY2UodGhpcy5lbmQsIHRoaXMuY2xvY2t3aXNlKTtcblxuXG4gIC8vICAgLy8gaWYgY2xvc2VzdCBpcyBjaG9yZFN0YXJ0QW5nbGUsIG5vcm1hbCBydWxlc1xuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIG5vdCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRTdGFydCwgcmV0dXJuIG51bGxcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCBub3QgemVybywgaWYgZm9sbG93aW5nIGlzIGNob3JkZW5kLCByZXR1cm4gc2VsZlxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgZW5kIHplcm8sIGlmIGZvbGxvd2luZyBpcyBjaG9yZFN0YXJ0LCBub3JtYWwgcnVsZXNcbiAgLy8gICAvLyBpZiBjbG9zZXN0IGlzIGVuZCB6ZXJvLCBpZiBmb2xsb3dpbmcgaXMgY2hvcmRlbmQsIHJldHVybiBzdGFydCB0byBjaG9yZGVuZFxuICAvLyAgIC8vIGlmIGNsb3Nlc3QgaXMgY2hvcmRFbmRBbmdsZSwgcmV0dXJuIHN0YXJ0IHRvIGNob3JkRW5kXG5cblxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkU3RhcnRBbmdsZSkpIHtcbiAgLy8gICAgIGNob3JkU3RhcnRBbmdsZSA9IHRoaXMuc3RhcnQ7XG4gIC8vICAgfVxuICAvLyAgIGlmICghdGhpcy5jb250YWluc0FuZ2xlKGNob3JkRW5kQW5nbGUpKSB7XG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlID0gdGhpcy5lbmQ7XG4gIC8vICAgfVxuXG4gIC8vICAgcmV0dXJuIG5ldyBBcmModGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLmNlbnRlciwgdGhpcy5yYWRpdXMsXG4gIC8vICAgICBjaG9yZFN0YXJ0QW5nbGUsXG4gIC8vICAgICBjaG9yZEVuZEFuZ2xlLFxuICAvLyAgICAgdGhpcy5jbG9ja3dpc2UpO1xuICAvLyB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB0aGF0IGlzIHRhbmdlbnQgdG8gYm90aCBgdGhpc2AgYW5kIGBvdGhlckFyY2AsXG4gICogb3IgYG51bGxgIHdoZW4gbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlLiBUaGUgbmV3IGBTZWdtZW50YCBzdGFydHNcbiAgKiBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoIGB0aGlzYCBhbmQgZW5kcyBhdCB0aGUgY29udGFjdCBwb2ludCB3aXRoXG4gICogYG90aGVyQXJjYC5cbiAgKlxuICAqIENvbnNpZGVyaW5nIF9jZW50ZXIgYXhpc18gYSByYXkgZnJvbSBgdGhpcy5jZW50ZXJgIHRvd2FyZHNcbiAgKiBgb3RoZXJBcmMuY2VudGVyYCwgYHN0YXJ0Q2xvY2t3aXNlYCBkZXRlcm1pbmVzIHRoZSBzaWRlIG9mIHRoZSBzdGFydFxuICAqIHBvaW50IG9mIHRoZSByZXR1cm5lZCBzZWdtZW50IGluIHJlbGF0aW9uIHRvIF9jZW50ZXIgYXhpc18sIGFuZFxuICAqIGBlbmRDbG9ja3dpc2VgIHRoZSBzaWRlIG9mIHRoZSBlbmQgcG9pbnQuXG4gICpcbiAgKiBCb3RoIGB0aGlzYCBhbmQgYG90aGVyQXJjYCBhcmUgY29uc2lkZXJlZCBjb21wbGV0ZSBjaXJjbGVzLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQXJjfSBvdGhlckFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgc2VnbWVudCB0b3dhcmRzXG4gICogQHBhcmFtIHtib29sZWFufSBzdGFydENsb2Nrd2lzZSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIHN0YXJ0IHBvaW50IGluIHJlbGF0aW9uIHRvIHRoZSBfY2VudGVyIGF4aXNfXG4gICogQHBhcmFtIHtib29sZWFufSBlbmRDbG9ja3dpc2UgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBlbmQgcG9pbnQgaW4gcmVsYXRpb24gdG8gdGhlIF9jZW50ZXIgYXhpc19cbiAgKiBAcmV0dXJucyB7P1JhYy5TZWdtZW50fVxuICAqL1xuICB0YW5nZW50U2VnbWVudChvdGhlckFyYywgc3RhcnRDbG9ja3dpc2UgPSB0cnVlLCBlbmRDbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuY2VudGVyLmVxdWFscyhvdGhlckFyYy5jZW50ZXIpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBIeXBvdGhlbnVzZSBvZiB0aGUgdHJpYW5nbGUgdXNlZCB0byBjYWxjdWxhdGUgdGhlIHRhbmdlbnRcbiAgICAvLyBtYWluIGFuZ2xlIGlzIGF0IGB0aGlzLmNlbnRlcmBcbiAgICBjb25zdCBoeXBTZWdtZW50ID0gdGhpcy5jZW50ZXIuc2VnbWVudFRvUG9pbnQob3RoZXJBcmMuY2VudGVyKTtcbiAgICBjb25zdCBvcHMgPSBzdGFydENsb2Nrd2lzZSA9PT0gZW5kQ2xvY2t3aXNlXG4gICAgICA/IG90aGVyQXJjLnJhZGl1cyAtIHRoaXMucmFkaXVzXG4gICAgICA6IG90aGVyQXJjLnJhZGl1cyArIHRoaXMucmFkaXVzO1xuXG4gICAgLy8gV2hlbiBvcHMgYW5kIGh5cCBhcmUgY2xvc2UsIHNuYXAgdG8gMVxuICAgIGNvbnN0IGFuZ2xlU2luZSA9IHRoaXMucmFjLmVxdWFscyhNYXRoLmFicyhvcHMpLCBoeXBTZWdtZW50Lmxlbmd0aClcbiAgICAgID8gKG9wcyA+IDAgPyAxIDogLTEpXG4gICAgICA6IG9wcyAvIGh5cFNlZ21lbnQubGVuZ3RoO1xuICAgIGlmIChNYXRoLmFicyhhbmdsZVNpbmUpID4gMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVSYWRpYW5zID0gTWF0aC5hc2luKGFuZ2xlU2luZSk7XG4gICAgY29uc3Qgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG5cbiAgICBjb25zdCBhZGpPcmllbnRhdGlvbiA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc3RhcnRDbG9ja3dpc2VcbiAgICAgIDogIXN0YXJ0Q2xvY2t3aXNlO1xuICAgIGNvbnN0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cFNlZ21lbnQucmF5LmFuZ2xlLnNoaWZ0KG9wc0FuZ2xlLCBhZGpPcmllbnRhdGlvbik7XG4gICAgY29uc3Qgc2hpZnRlZEFkakFuZ2xlID0gc2hpZnRlZE9wc0FuZ2xlLnBlcnBlbmRpY3VsYXIoYWRqT3JpZW50YXRpb24pO1xuXG4gICAgY29uc3Qgc3RhcnRBbmdsZSA9IHN0YXJ0Q2xvY2t3aXNlID09PSBlbmRDbG9ja3dpc2VcbiAgICAgID8gc2hpZnRlZEFkakFuZ2xlXG4gICAgICA6IHNoaWZ0ZWRBZGpBbmdsZS5pbnZlcnNlKClcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgIGNvbnN0IGVuZCA9IG90aGVyQXJjLnBvaW50QXRBbmdsZShzaGlmdGVkQWRqQW5nbGUpO1xuICAgIGNvbnN0IGRlZmF1bHRBbmdsZSA9IHN0YXJ0QW5nbGUucGVycGVuZGljdWxhcighc3RhcnRDbG9ja3dpc2UpO1xuICAgIHJldHVybiBzdGFydC5zZWdtZW50VG9Qb2ludChlbmQsIGRlZmF1bHRBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYEFyY2Agb2JqZWN0cyByZXByZXNlbnRpbmcgYHRoaXNgXG4gICogZGl2aWRlZCBpbnRvIGBjb3VudGAgYXJjcywgYWxsIHdpdGggdGhlIHNhbWVcbiAgKiBbYW5nbGUgZGlzdGFuY2Vde0BsaW5rIFJhYy5BcmMjYW5nbGVEaXN0YW5jZX0uXG4gICpcbiAgKiBXaGVuIGBjb3VudGAgaXMgemVybyBvciBsb3dlciwgcmV0dXJucyBhbiBlbXB0eSBhcnJheS4gV2hlbiBgY291bnRgIGlzXG4gICogYDFgIHJldHVybnMgYW4gYXJjIGVxdWl2YWxlbnQgdG8gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGFyY3MgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5BcmNbXX1cbiAgKi9cbiAgZGl2aWRlVG9BcmNzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3QgYXJjcyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb3VudDsgaW5kZXggKz0gMSkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuc3RhcnQuc2hpZnQocGFydFR1cm4gKiAoaW5kZXgrMSksIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGFyYyA9IG5ldyBBcmModGhpcy5yYWMsIHRoaXMuY2VudGVyLCB0aGlzLnJhZGl1cywgc3RhcnQsIGVuZCwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgYXJjcy5wdXNoKGFyYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyY3M7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBuZXcgYFNlZ21lbnRgIG9iamVjdHMgcmVwcmVzZW50aW5nIGB0aGlzYFxuICAqIGRpdmlkZWQgaW50byBgY291bnRgIGNob3JkcywgYWxsIHdpdGggdGhlIHNhbWUgbGVuZ3RoLlxuICAqXG4gICogV2hlbiBgY291bnRgIGlzIHplcm8gb3IgbG93ZXIsIHJldHVybnMgYW4gZW1wdHkgYXJyYXkuIFdoZW4gYGNvdW50YCBpc1xuICAqIGAxYCByZXR1cm5zIGFuIGFyYyBlcXVpdmFsZW50IHRvXG4gICogYFt0aGlzLmNob3JkU2VnbWVudCgpXXtAbGluayBSYWMuQXJjI2Nob3JkU2VnbWVudH1gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIHNlZ21lbnRzIHRvIGRpdmlkZSBgdGhpc2AgaW50b1xuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudFtdfVxuICAqL1xuICBkaXZpZGVUb1NlZ21lbnRzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIFtdOyB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gdGhpcy5hbmdsZURpc3RhbmNlKCk7XG4gICAgY29uc3QgcGFydFR1cm4gPSBhbmdsZURpc3RhbmNlLnR1cm5PbmUoKSAvIGNvdW50O1xuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXTtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSB0aGlzLnN0YXJ0LnNoaWZ0KHBhcnRUdXJuICogaW5kZXgsIHRoaXMuY2xvY2t3aXNlKTtcbiAgICAgIGNvbnN0IGVuZEFuZ2xlID0gdGhpcy5zdGFydC5zaGlmdChwYXJ0VHVybiAqIChpbmRleCsxKSwgdGhpcy5jbG9ja3dpc2UpO1xuICAgICAgY29uc3Qgc3RhcnRQb2ludCA9IHRoaXMucG9pbnRBdEFuZ2xlKHN0YXJ0QW5nbGUpO1xuICAgICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLnBvaW50QXRBbmdsZShlbmRBbmdsZSk7XG4gICAgICBjb25zdCBzZWdtZW50ID0gc3RhcnRQb2ludC5zZWdtZW50VG9Qb2ludChlbmRQb2ludCk7XG4gICAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50cztcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29tcG9zaXRlYCB0aGF0IGNvbnRhaW5zIGBCZXppZXJgIG9iamVjdHMgcmVwcmVzZW50aW5nXG4gICogdGhlIGFyYyBkaXZpZGVkIGludG8gYGNvdW50YCBiZXppZXJzIHRoYXQgYXBwcm94aW1hdGUgdGhlIHNoYXBlIG9mIHRoZVxuICAqIGFyYy5cbiAgKlxuICAqIFdoZW4gYGNvdW50YCBpcyB6ZXJvIG9yIGxvd2VyLCByZXR1cm5zIGFuIGVtcHR5IGBDb21wb3NpdGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIGJlemllcnMgdG8gZGl2aWRlIGB0aGlzYCBpbnRvXG4gICogQHJldHVybnMge1JhYy5Db21wb3NpdGV9XG4gICpcbiAgKiBAc2VlIFJhYy5CZXppZXJcbiAgKi9cbiAgZGl2aWRlVG9CZXppZXJzKGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDw9IDApIHsgcmV0dXJuIG5ldyBSYWMuQ29tcG9zaXRlKHRoaXMucmFjLCBbXSk7IH1cblxuICAgIGNvbnN0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICBjb25zdCBwYXJ0VHVybiA9IGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpIC8gY291bnQ7XG5cbiAgICAvLyBsZW5ndGggb2YgdGFuZ2VudDpcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gICAgY29uc3QgcGFyc1BlclR1cm4gPSAxIC8gcGFydFR1cm47XG4gICAgY29uc3QgdGFuZ2VudCA9IHRoaXMucmFkaXVzICogKDQvMykgKiBNYXRoLnRhbihSYWMuVEFVLyhwYXJzUGVyVHVybio0KSk7XG5cbiAgICBjb25zdCBiZXppZXJzID0gW107XG4gICAgY29uc3Qgc2VnbWVudHMgPSB0aGlzLmRpdmlkZVRvU2VnbWVudHMoY291bnQpO1xuICAgIHNlZ21lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBzdGFydEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uc3RhcnRQb2ludCgpKTtcbiAgICAgIGNvbnN0IGVuZEFyY1JhZGl1cyA9IHRoaXMuY2VudGVyLnNlZ21lbnRUb1BvaW50KGl0ZW0uZW5kUG9pbnQoKSk7XG5cbiAgICAgIGxldCBzdGFydEFuY2hvciA9IHN0YXJ0QXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsICF0aGlzLmNsb2Nrd2lzZSwgdGFuZ2VudClcbiAgICAgICAgLmVuZFBvaW50KCk7XG4gICAgICBsZXQgZW5kQW5jaG9yID0gZW5kQXJjUmFkaXVzXG4gICAgICAgIC5uZXh0U2VnbWVudFRvQW5nbGVEaXN0YW5jZSh0aGlzLnJhYy5BbmdsZS5zcXVhcmUsIHRoaXMuY2xvY2t3aXNlLCB0YW5nZW50KVxuICAgICAgICAuZW5kUG9pbnQoKTtcblxuICAgICAgY29uc3QgbmV3QmV6aWVyID0gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHN0YXJ0QXJjUmFkaXVzLmVuZFBvaW50KCksIHN0YXJ0QW5jaG9yLFxuICAgICAgICBlbmRBbmNob3IsIGVuZEFyY1JhZGl1cy5lbmRQb2ludCgpKVxuXG4gICAgICBiZXppZXJzLnB1c2gobmV3QmV6aWVyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgUmFjLkNvbXBvc2l0ZSh0aGlzLnJhYywgYmV6aWVycyk7XG4gIH1cblxufSAvLyBjbGFzcyBBcmNcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEFyYztcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIEJlemllciBjdXJ2ZSB3aXRoIHN0YXJ0LCBlbmQsIGFuZCB0d28gYW5jaG9yIFtwb2ludHNde0BsaW5rIFJhYy5Qb2ludH0uXG4qIEBhbGlhcyBSYWMuQmV6aWVyXG4qL1xuY2xhc3MgQmV6aWVyIHtcblxuICBjb25zdHJ1Y3RvcihyYWMsIHN0YXJ0LCBzdGFydEFuY2hvciwgZW5kQW5jaG9yLCBlbmQpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgc3RhcnRBbmNob3IsIGVuZEFuY2hvciwgZW5kKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgc3RhcnQsIHN0YXJ0QW5jaG9yLCBlbmRBbmNob3IsIGVuZCk7XG5cbiAgICB0aGlzLnJhYyA9IHJhYztcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5zdGFydEFuY2hvciA9IHN0YXJ0QW5jaG9yO1xuICAgIHRoaXMuZW5kQW5jaG9yID0gZW5kQW5jaG9yO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHN0YXJ0WFN0ciAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3Qgc3RhcnRZU3RyICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuc3RhcnQueSwgICAgICAgZGlnaXRzKTtcbiAgICBjb25zdCBzdGFydEFuY2hvclhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5zdGFydEFuY2hvci54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHN0YXJ0QW5jaG9yWVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0QW5jaG9yLnksIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kQW5jaG9yWFN0ciAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kQW5jaG9yLngsICAgZGlnaXRzKTtcbiAgICBjb25zdCBlbmRBbmNob3JZU3RyICAgPSB1dGlscy5jdXREaWdpdHModGhpcy5lbmRBbmNob3IueSwgICBkaWdpdHMpO1xuICAgIGNvbnN0IGVuZFhTdHIgICAgICAgICA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmVuZC54LCAgICAgICAgIGRpZ2l0cyk7XG4gICAgY29uc3QgZW5kWVN0ciAgICAgICAgID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMuZW5kLnksICAgICAgICAgZGlnaXRzKTtcblxuICAgIHJldHVybiBgQmV6aWVyKHM6KCR7c3RhcnRYU3RyfSwke3N0YXJ0WVN0cn0pIHNhOigke3N0YXJ0QW5jaG9yWFN0cn0sJHtzdGFydEFuY2hvcllTdHJ9KSBlYTooJHtlbmRBbmNob3JYU3RyfSwke2VuZEFuY2hvcllTdHJ9KSBlOigke2VuZFhTdHJ9LCR7ZW5kWVN0cn0pKWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYWxsIG1lbWJlcnMgb2YgYm90aCBiZXppZXJzIGFyZVxuICAqIFtjb25zaWRlcmVkIGVxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfS5cbiAgKlxuICAqIFdoZW4gYG90aGVyQmV6aWVyYCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLkJlemllcmAsIHJldHVybnNcbiAgKiBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQmV6aWVyfSBvdGhlckJlemllciAtIEEgYEJlemllcmAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlckJlemllcikge1xuICAgIHJldHVybiBvdGhlckJlemllciBpbnN0YW5jZW9mIEJlemllclxuICAgICAgJiYgdGhpcy5zdGFydCAgICAgIC5lcXVhbHMob3RoZXJCZXppZXIuc3RhcnQpXG4gICAgICAmJiB0aGlzLnN0YXJ0QW5jaG9yLmVxdWFscyhvdGhlckJlemllci5zdGFydEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kQW5jaG9yICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZEFuY2hvcilcbiAgICAgICYmIHRoaXMuZW5kICAgICAgICAuZXF1YWxzKG90aGVyQmV6aWVyLmVuZCk7XG4gIH1cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQmV6aWVyO1xuXG5cbkJlemllci5wcm90b3R5cGUuZHJhd0FuY2hvcnMgPSBmdW5jdGlvbihzdHlsZSA9IHVuZGVmaW5lZCkge1xuICBwdXNoKCk7XG4gIGlmIChzdHlsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuYXBwbHkoKTtcbiAgfVxuICB0aGlzLnN0YXJ0LnNlZ21lbnRUb1BvaW50KHRoaXMuc3RhcnRBbmNob3IpLmRyYXcoKTtcbiAgdGhpcy5lbmQuc2VnbWVudFRvUG9pbnQodGhpcy5lbmRBbmNob3IpLmRyYXcoKTtcbiAgcG9wKCk7XG59O1xuXG5CZXppZXIucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCZXppZXIodGhpcy5yYWMsXG4gICAgdGhpcy5lbmQsIHRoaXMuZW5kQW5jaG9yLFxuICAgIHRoaXMuc3RhcnRBbmNob3IsIHRoaXMuc3RhcnQpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5lciBvZiBhIHNlcXVlbmNlIG9mIGRyYXdhYmxlIG9iamVjdHMgdGhhdCBjYW4gYmUgZHJhd24gdG9nZXRoZXIuXG4qXG4qIFVzZWQgYnkgYFtQNURyYXdlcl17QGxpbmsgUmFjLlA1RHJhd2VyfWAgdG8gcGVyZm9ybSBzcGVjaWZpYyB2ZXJ0ZXhcbiogb3BlcmF0aW9ucyB3aXRoIGRyYXdhYmxlcyB0byBkcmF3IGNvbXBsZXggc2hhcGVzLlxuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5Db21wb3NpdGVcbiovXG5mdW5jdGlvbiBDb21wb3NpdGUocmFjLCBzZXF1ZW5jZSA9IFtdKSB7XG4gIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHNlcXVlbmNlKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5zZXF1ZW5jZSA9IHNlcXVlbmNlO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0ZTtcblxuXG5Db21wb3NpdGUucHJvdG90eXBlLmlzTm90RW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc2VxdWVuY2UubGVuZ3RoICE9IDA7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIGVsZW1lbnQuZm9yRWFjaChpdGVtID0+IHRoaXMuc2VxdWVuY2UucHVzaChpdGVtKSk7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5zZXF1ZW5jZS5wdXNoKGVsZW1lbnQpO1xufTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gIGxldCByZXZlcnNlZCA9IHRoaXMuc2VxdWVuY2UubWFwKGl0ZW0gPT4gaXRlbS5yZXZlcnNlKCkpXG4gICAgLnJldmVyc2UoKTtcbiAgcmV0dXJuIG5ldyBDb21wb3NpdGUodGhpcy5yYWMsIHJldmVyc2VkKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBQb2ludCBpbiBhIHR3byBkaW1lbnRpb25hbCBjb29yZGluYXRlIHN5c3RlbS5cbipcbiogU2V2ZXJhbCBtZXRob2RzIHdpbGwgcmV0dXJuIGFuIGFkanVzdGVkIHZhbHVlIG9yIHBlcmZvcm0gYWRqdXN0bWVudHMgaW5cbiogdGhlaXIgb3BlcmF0aW9uIHdoZW4gdHdvIHBvaW50cyBhcmUgY2xvc2UgZW5vdWdoIGFzIHRvIGJlIGNvbnNpZGVyZWRcbiogZXF1YWwuIFdoZW4gdGhlIHRoZSBkaWZmZXJlbmNlIG9mIGVhY2ggY29vcmRpbmF0ZSBvZiB0d28gcG9pbnRzXG4qIGlzIHVuZGVyIHRoZSBgW2VxdWFsaXR5VGhyZXNob2xkXXtAbGluayBSYWMjZXF1YWxpdHlUaHJlc2hvbGR9YCB0aGVcbiogcG9pbnRzIGFyZSBjb25zaWRlcmVkIGVxdWFsLiBUaGUgYFtlcXVhbHNde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9YFxuKiBtZXRob2QgcGVyZm9ybXMgdGhpcyBjaGVjay5cbipcbiogQGFsaWFzIFJhYy5Qb2ludFxuKi9cbmNsYXNzIFBvaW50e1xuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgUG9pbnRgIGluc3RhbmNlLlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGVcbiAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGVcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCB4LCB5KSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgeCwgeSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKHgsIHkpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG5cbiAgICAvKipcbiAgICAqIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy54ID0geDtcblxuICAgIC8qKlxuICAgICogWSBjb29yZGluYXRlIG9mIHRoZSBwb2ludC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBbZGlnaXRzXSAtIFRoZSBudW1iZXIgb2YgZGlnaXRzIHRvIHByaW50IGFmdGVyIHRoZVxuICAqIGRlY2ltYWwgcG9pbnQsIHdoZW4gb21taXRlZCBhbGwgZGlnaXRzIGFyZSBwcmludGVkXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoZGlnaXRzID0gbnVsbCkge1xuICAgIGNvbnN0IHhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy54LCBkaWdpdHMpO1xuICAgIGNvbnN0IHlTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy55LCBkaWdpdHMpO1xuICAgIHJldHVybiBgUG9pbnQoJHt4U3RyfSwke3lTdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGRpZmZlcmVuY2Ugd2l0aCBgb3RoZXJQb2ludGAgZm9yIGVhY2ggY29vcmRpbmF0ZSBpc1xuICAqIHVuZGVyIGB7QGxpbmsgUmFjI2VxdWFsaXR5VGhyZXNob2xkfWAsIG90aGVyd2lzZSByZXR1cm5zIGBmYWxzZWAuXG4gICpcbiAgKiBXaGVuIGBvdGhlclBvaW50YCBpcyBhbnkgY2xhc3Mgb3RoZXIgdGhhdCBgUmFjLlBvaW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogVmFsdWVzIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBvdGhlclBvaW50IC0gQSBgUG9pbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYyNlcXVhbHNcbiAgKi9cbiAgZXF1YWxzKG90aGVyUG9pbnQpIHtcbiAgICByZXR1cm4gb3RoZXJQb2ludCBpbnN0YW5jZW9mIFBvaW50XG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy54LCBvdGhlclBvaW50LngpXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy55LCBvdGhlclBvaW50LnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WCAtIFRoZSB4IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhYKG5ld1gpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCBuZXdYLCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgc2V0IHRvIGBuZXdYYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3WSAtIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLngsIG5ld1kpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeGAgYWRkZWQgdG8gYHRoaXMueGAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFgoeCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLnggKyB4LCB0aGlzLnkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2l0aCBgeWAgYWRkZWQgdG8gYHRoaXMueWAuXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIGFkZFkoeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy5yYWMsXG4gICAgICB0aGlzLngsIHRoaXMueSArIHkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYnkgYWRkaW5nIHRoZSBjb21wb25lbnRzIG9mIGBwb2ludGAgdG8gYHRoaXNgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBhZGRQb2ludChwb2ludCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCArIHBvaW50LngsXG4gICAgICB0aGlzLnkgKyBwb2ludC55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGJ5IGFkZGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cyB0byBgdGhpc2AuXG4gICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29kaW5hdGUgdG8gYWRkXG4gICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29kaW5hdGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgYWRkKHgsIHkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLFxuICAgICAgdGhpcy54ICsgeCwgdGhpcy55ICsgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgY29tcG9uZW50cyBvZiBgcG9pbnRgLlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBzdWJ0cmFjdFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN1YnRyYWN0UG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KFxuICAgICAgdGhpcy5yYWMsXG4gICAgICB0aGlzLnggLSBwb2ludC54LFxuICAgICAgdGhpcy55IC0gcG9pbnQueSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBieSBzdWJ0cmFjdGluZyB0aGUgYHhgIGFuZCBgeWAgY29tcG9uZW50cy5cbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb2RpbmF0ZSB0byBzdWJ0cmFjdFxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vZGluYXRlIHRvIHN1YnRyYWN0XG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgc3VidHJhY3QoeCwgeSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIHRoaXMueCAtIHgsXG4gICAgICB0aGlzLnkgLSB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIHdpdGggdGhlIG5lZ2F0aXZlIGNvb3JkaW5hdGUgdmFsdWVzIG9mIGB0aGlzYC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBuZWdhdGl2ZSgpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCAtdGhpcy54LCAtdGhpcy55KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZGlzdGFuY2UgZnJvbSBgdGhpc2AgdG8gYHBvaW50YCwgb3IgcmV0dXJucyBgMGAgd2hlblxuICAqIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgZGlzdGFuY2VUb1BvaW50KHBvaW50KSB7XG4gICAgaWYgKHRoaXMuZXF1YWxzKHBvaW50KSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGNvbnN0IHggPSBNYXRoLnBvdygocG9pbnQueCAtIHRoaXMueCksIDIpO1xuICAgIGNvbnN0IHkgPSBNYXRoLnBvdygocG9pbnQueSAtIHRoaXMueSksIDIpO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCt5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpc2AgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXNgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgcmV0dXJucyB0aGUgYW5nbGUgcHJvZHVjZWQgd2l0aFxuICAqIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIG1lYXN1cmUgdGhlIGFuZ2xlIHRvXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZGVmYXVsdEFuZ2xlPWluc3RhbmNlLkFuZ2xlLlplcm9dIC1cbiAgKiBBbiBgQW5nbGVgIHRvIHJldHVybiB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBhbmdsZVRvUG9pbnQocG9pbnQsIGRlZmF1bHRBbmdsZSA9IHRoaXMucmFjLkFuZ2xlLnplcm8pIHtcbiAgICBpZiAodGhpcy5lcXVhbHMocG9pbnQpKSB7XG4gICAgICBkZWZhdWx0QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGRlZmF1bHRBbmdsZSk7XG4gICAgICByZXR1cm4gZGVmYXVsdEFuZ2xlO1xuICAgIH1cbiAgICBjb25zdCBvZmZzZXQgPSBwb2ludC5zdWJ0cmFjdFBvaW50KHRoaXMpO1xuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmF0YW4yKG9mZnNldC55LCBvZmZzZXQueCk7XG4gICAgcmV0dXJuIFJhYy5BbmdsZS5mcm9tUmFkaWFucyh0aGlzLnJhYywgcmFkaWFucyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCBhIGBkaXN0YW5jZWAgZnJvbSBgdGhpc2AgaW4gdGhlIGRpcmVjdGlvbiBvZlxuICAqIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0b3dhcnMgdGhlIG5ldyBgUG9pbnRgXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIHRoZSBuZXcgYFBvaW50YFxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50VG9BbmdsZShhbmdsZSwgZGlzdGFuY2UpIHtcbiAgICBhbmdsZSA9IHRoaXMucmFjLkFuZ2xlLmZyb20oYW5nbGUpO1xuICAgIGNvbnN0IGRpc3RhbmNlWCA9IGRpc3RhbmNlICogTWF0aC5jb3MoYW5nbGUucmFkaWFucygpKTtcbiAgICBjb25zdCBkaXN0YW5jZVkgPSBkaXN0YW5jZSAqIE1hdGguc2luKGFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLnJhYywgdGhpcy54ICsgZGlzdGFuY2VYLCB0aGlzLnkgKyBkaXN0YW5jZVkpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IGRvY3VtZW50XG4gIC8vIFJFTEVBU0UtVE9ETzogdGVzdFxuICBwb2ludEF0QmlzZWN0b3IocG9pbnQpIHtcbiAgICBjb25zdCB4T2Zmc2V0ID0gKHBvaW50LnggLSB0aGlzLngpIC8gMjtcbiAgICBjb25zdCB5T2Zmc2V0ID0gKHBvaW50LnkgLSB0aGlzLnkpIC8gMjtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMucmFjLCB0aGlzLnggKyB4T2Zmc2V0LCB0aGlzLnkgKyB5T2Zmc2V0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBhbmdsZWAuXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBgQW5nbGVgIG9mIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgcmF5KGFuZ2xlKSB7XG4gICAgYW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzYCB0b3dhcmRzIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZCBlcXVhbCwgdGhlIG5ldyBgUmF5YCB3aWxsIHVzZVxuICAqIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgUmF5YCB0b3dhcmRzXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBbZGVmYXVsdEFuZ2xlPWluc3RhbmNlLkFuZ2xlLlplcm9dIC1cbiAgKiBBbiBgQW5nbGVgIHRvIHVzZSB3aGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgZXF1YWxcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgcmF5VG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMuYW5nbGVUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgZGVmYXVsdEFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCBmcm9tIGB0aGlzYCB0byB0aGUgcHJvamVjdGlvbiBvZiBgdGhpc2AgaW4gYHJheWAuXG4gICpcbiAgKiBXaGVuIHRoZSBwcm9qZWN0ZWQgcG9pbnQgaXMgZXF1YWwgdG8gYHRoaXNgIHRoZSBwcm9kdWNlZCByYXkgd2lsbCBoYXZlXG4gICogYW4gYW5nbGUgcGVycGVuZGljdWxhciB0byBgcmF5YCBpbiB0aGUgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBwcm9qZWN0IGB0aGlzYCBvbnRvXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHJheVRvUHJvamVjdGlvbkluUmF5KHJheSkge1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHJheS5wb2ludFByb2plY3Rpb24odGhpcyk7XG4gICAgY29uc3QgcGVycGVuZGljdWxhciA9IHJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHRoaXMucmF5VG9Qb2ludChwcm9qZWN0ZWQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgdGhhdCBzdGFydHMgYXQgYHRoaXNgIGFuZCBpcyB0YW5nZW50IHRvIGBhcmNgLCB3aGVuXG4gICogbm8gdGFuZ2VudCBpcyBwb3NzaWJsZSByZXR1cm5zIGBudWxsYC5cbiAgKlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFRoZSBuZXcgYFJheWAgd2lsbCBiZSBpbiB0aGUgYGNsb2Nrd2lzZWAgc2lkZSBvZiB0aGUgcmF5IGZvcm1lZFxuICAqIGZyb20gYHRoaXNgIHRvd2FyZHMgYGFyYy5jZW50ZXJgLiBgYXJjYCBpcyBjb25zaWRlcmVkIGEgY29tcGxldGVcbiAgKiBjaXJjbGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBpcyBpbnNpZGUgYGFyY2Agbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlIGFuZCBgbnVsbGBcbiAgKiBpcyByZXR1cm5lZC5cbiAgKlxuICAqIEEgc3BlY2lhbCBjYXNlIGlzIGNvbnNpZGVyZWQgd2hlbiBgYXJjLnJhZGl1c2AgaXMgY29uc2lkZXJlZCB0byBiZSBgMGBcbiAgKiBhbmQgYHRoaXNgIGlzIGVxdWFsIHRvIGBhcmMuY2VudGVyYC4gSW4gdGhpcyBjYXNlIHRoZSBhbmdsZSBiZXR3ZWVuXG4gICogYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAgaXMgYXNzdW1lZCB0byBiZSB0aGUgaW52ZXJzZSBvZiBgYXJjLnN0YXJ0YCxcbiAgKiB0aHVzIHRoZSBuZXcgYFJheWAgd2lsbCBoYXZlIGFuIGFuZ2xlIHBlcnBlbmRpY3VsYXIgdG9cbiAgKiBgYXJjLnN0YXJ0LmludmVyc2UoKWAsIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFyY30gYXJjIC0gQW4gYEFyY2AgdG8gY2FsY3VsYXRlIGEgdGFuZ2VudCB0bywgY29uc2lkZXJlZFxuICAqIGFzIGEgY29tcGxldGUgY2lyY2xlXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJuIHtSYWMuUmF5P31cbiAgKi9cbiAgcmF5VGFuZ2VudFRvQXJjKGFyYywgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIC8vIEEgZGVmYXVsdCBhbmdsZSBpcyBnaXZlbiBmb3IgdGhlIGVkZ2UgY2FzZSBvZiBhIHplcm8tcmFkaXVzIGFyY1xuICAgIGxldCBoeXBvdGVudXNlID0gdGhpcy5zZWdtZW50VG9Qb2ludChhcmMuY2VudGVyLCBhcmMuc3RhcnQuaW52ZXJzZSgpKTtcbiAgICBsZXQgb3BzID0gYXJjLnJhZGl1cztcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIGFyYy5yYWRpdXMpKSB7XG4gICAgICAvLyBQb2ludCBpbiBhcmNcbiAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXIgPSBoeXBvdGVudXNlLnJheS5hbmdsZS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgICByZXR1cm4gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIHBlcnBlbmRpY3VsYXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoaHlwb3RlbnVzZS5sZW5ndGgsIDApKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgYW5nbGVTaW5lID0gb3BzIC8gaHlwb3RlbnVzZS5sZW5ndGg7XG4gICAgaWYgKGFuZ2xlU2luZSA+IDEpIHtcbiAgICAgIC8vIFBvaW50IGluc2lkZSBhcmNcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBhbmdsZVJhZGlhbnMgPSBNYXRoLmFzaW4oYW5nbGVTaW5lKTtcbiAgICBsZXQgb3BzQW5nbGUgPSBSYWMuQW5nbGUuZnJvbVJhZGlhbnModGhpcy5yYWMsIGFuZ2xlUmFkaWFucyk7XG4gICAgbGV0IHNoaWZ0ZWRPcHNBbmdsZSA9IGh5cG90ZW51c2UuYW5nbGUoKS5zaGlmdChvcHNBbmdsZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgc2hpZnRlZE9wc0FuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSBgdGhpc2AgdG93YXJkcyBgYW5nbGVgIHdpdGggdGhlIGdpdmVuXG4gICogYGxlbmd0aGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gQW4gYEFuZ2xlYCB0byBwb2ludCB0aGUgc2VnbWVudFxuICAqIHRvd2FyZHNcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudFRvQW5nbGUoYW5nbGUsIGxlbmd0aCkge1xuICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgY29uc3QgcmF5ID0gbmV3IFJhYy5SYXkodGhpcy5yYWMsIHRoaXMsIGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvIGBwb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBhbmQgYHBvaW50YCBhcmUgY29uc2lkZXJlZCBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LFxuICAqIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlIHRoZSBhbmdsZSBwcm9kdWNlZCB3aXRoIGBkZWZhdWx0QW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IHBvaW50IC0gQSBgUG9pbnRgIHRvIHBvaW50IHRoZSBgU2VnbWVudGAgdG93YXJkc1xuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW2RlZmF1bHRBbmdsZT1pbnN0YW5jZS5BbmdsZS5aZXJvXSAtXG4gICogQW4gYEFuZ2xlYCB0byB1c2Ugd2hlbiBgdGhpc2AgYW5kIGBwb2ludGAgYXJlIGVxdWFsXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBzZWdtZW50VG9Qb2ludChwb2ludCwgZGVmYXVsdEFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuemVybykge1xuICAgIGRlZmF1bHRBbmdsZSA9IHRoaXMuYW5nbGVUb1BvaW50KHBvaW50LCBkZWZhdWx0QW5nbGUpO1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuZGlzdGFuY2VUb1BvaW50KHBvaW50KTtcbiAgICBjb25zdCByYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgdGhpcywgZGVmYXVsdEFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCByYXksIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIGZyb20gYHRoaXNgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGB0aGlzYCBpblxuICAqIGByYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGlzIGVxdWFsIHRvIGB0aGlzYCwgdGhlIG5ldyBgU2VnbWVudGAgd2lsbFxuICAqIGhhdmUgYW4gYW5nbGUgcGVycGVuZGljdWxhciB0byBgcmF5YCBpbiB0aGUgY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0byBwcm9qZWN0IGB0aGlzYCBvbnRvXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9Qcm9qZWN0aW9uSW5SYXkocmF5KSB7XG4gICAgY29uc3QgcHJvamVjdGVkID0gcmF5LnBvaW50UHJvamVjdGlvbih0aGlzKTtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gcmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoKTtcbiAgICByZXR1cm4gdGhpcy5zZWdtZW50VG9Qb2ludChwcm9qZWN0ZWQsIHBlcnBlbmRpY3VsYXIpO1xuICB9XG5cblxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHRoYXQgc3RhcnRzIGF0IGB0aGlzYCBhbmQgaXMgdGFuZ2VudCB0byBgYXJjYCxcbiAgKiB3aGVuIG5vIHRhbmdlbnQgaXMgcG9zc2libGUgcmV0dXJucyBgbnVsbGAuXG4gICpcbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGJlIGluIHRoZSBgY2xvY2t3aXNlYCBzaWRlIG9mIHRoZSByYXkgZm9ybWVkXG4gICogZnJvbSBgdGhpc2AgdG93YXJkcyBgYXJjLmNlbnRlcmAsIGFuZCBpdHMgZW5kIHBvaW50IHdpbGwgYmUgYXQgdGhlXG4gICogY29udGFjdCBwb2ludCB3aXRoIGBhcmNgIHdoaWNoIGlzIGNvbnNpZGVyZWQgYXMgYSBjb21wbGV0ZSBjaXJjbGUuXG4gICpcbiAgKiBXaGVuIGB0aGlzYCBpcyBpbnNpZGUgYGFyY2Agbm8gdGFuZ2VudCBzZWdtZW50IGlzIHBvc3NpYmxlIGFuZCBgbnVsbGBcbiAgKiBpcyByZXR1cm5lZC5cbiAgKlxuICAqIEEgc3BlY2lhbCBjYXNlIGlzIGNvbnNpZGVyZWQgd2hlbiBgYXJjLnJhZGl1c2AgaXMgY29uc2lkZXJlZCB0byBiZSBgMGBcbiAgKiBhbmQgYHRoaXNgIGlzIGVxdWFsIHRvIGBhcmMuY2VudGVyYC4gSW4gdGhpcyBjYXNlIHRoZSBhbmdsZSBiZXR3ZWVuXG4gICogYHRoaXNgIGFuZCBgYXJjLmNlbnRlcmAgaXMgYXNzdW1lZCB0byBiZSB0aGUgaW52ZXJzZSBvZiBgYXJjLnN0YXJ0YCxcbiAgKiB0aHVzIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSBhbiBhbmdsZSBwZXJwZW5kaWN1bGFyIHRvXG4gICogYGFyYy5zdGFydC5pbnZlcnNlKClgLCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BcmN9IGFyYyAtIEFuIGBBcmNgIHRvIGNhbGN1bGF0ZSBhIHRhbmdlbnQgdG8sIGNvbnNpZGVyZWRcbiAgKiBhcyBhIGNvbXBsZXRlIGNpcmNsZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm4ge1JhYy5TZWdtZW50P31cbiAgKi9cbiAgc2VnbWVudFRhbmdlbnRUb0FyYyhhcmMsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCB0YW5nZW50UmF5ID0gdGhpcy5yYXlUYW5nZW50VG9BcmMoYXJjLCBjbG9ja3dpc2UpO1xuICAgIGlmICh0YW5nZW50UmF5ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB0YW5nZW50UGVycCA9IHRhbmdlbnRSYXkuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIGNvbnN0IHJhZGl1c1JheSA9IGFyYy5jZW50ZXIucmF5KHRhbmdlbnRQZXJwKTtcblxuICAgIHJldHVybiB0YW5nZW50UmF5LnNlZ21lbnRUb0ludGVyc2VjdGlvbihyYWRpdXNSYXkpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzYCBhbmQgdGhlIGdpdmVuIGFyYyBwcm9wZXJ0aWVzLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIFRoZSByYWRpdXMgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gW3N0YXJ0PXJhYy5BbmdsZS56ZXJvXSAtIFRoZSBzdGFydFxuICAqIGBBbmdsZWAgb2YgdGhlIG5ldyBgQXJjYFxuICAqIEBwYXJhbSB7P1JhYy5BbmdsZXxudW1iZXJ9IFtlbmQ9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgc3RhcnRgIGlzIHVzZWQgaW5zdGVhZFxuICAqIEBwYXJhbSB7Ym9vbGVhbj19IGNsb2Nrd2lzZT10cnVlIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjKFxuICAgIHJhZGl1cyxcbiAgICBzdGFydCA9IHRoaXMucmFjLkFuZ2xlLnplcm8sXG4gICAgZW5kID0gbnVsbCxcbiAgICBjbG9ja3dpc2UgPSB0cnVlKVxuICB7XG4gICAgc3RhcnQgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKHN0YXJ0KTtcbiAgICBlbmQgPSBlbmQgPT09IG51bGxcbiAgICAgID8gc3RhcnRcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmQpO1xuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYywgdGhpcywgcmFkaXVzLCBzdGFydCwgZW5kLCBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBUZXh0YCBsb2NhdGVkIGF0IGB0aGlzYCB3aXRoIHRoZSBnaXZlbiBgc3RyaW5nYCBhbmRcbiAgKiBgZm9ybWF0YC5cbiAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyBvZiB0aGUgbmV3IGBUZXh0YFxuICAqIEBwYXJhbSB7UmFjLlRleHQuRm9ybWF0fSBbZm9ybWF0PW51bGxdIC0gVGhlIGZvcm1hdCBvZiB0aGUgbmV3IGBUZXh0YDtcbiAgKiB3aGVuIG9tbWl0ZWQgYFtpbnN0YW5jZS5UZXh0LkZvcm1hdC50b3BMZWZ0XXtAbGluayBpbnN0YW5jZS5UZXh0LkZvcm1hdCN0b3BMZWZ0fWBcbiAgKiBpcyB1c2VkIGluc3RlYWQuXG4gICogQHJldHVybnMge1JhYy5UZXh0fVxuICAqL1xuICAvLyBSRUxFQVNFLVRPRE86IGNoZWNrIGxpbmtcbiAgLy8gUkVMRUFTRS1UT0RPOiBjaGVjayBpZiB0ZXN0IG5lZWRzIHRvIHVkcGF0ZVxuICB0ZXh0KHN0cmluZywgZm9ybWF0ID0gbnVsbCkge1xuICAgIGZvcm1hdCA9IGZvcm1hdCA/PyB0aGlzLnJhYy5UZXh0LkZvcm1hdC50b3BMZWZ0O1xuICAgIHJldHVybiBuZXcgUmFjLlRleHQodGhpcy5yYWMsIHRoaXMsIHN0cmluZywgZm9ybWF0KTtcbiAgfVxuXG59IC8vIGNsYXNzIFBvaW50XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIFVuYm91bmRlZCByYXkgZnJvbSBhIGBbUG9pbnRde0BsaW5rIFJhYy5Qb2ludH1gIGluIGRpcmVjdGlvbiBvZiBhblxuKiBgW0FuZ2xlXXtAbGluayBSYWMuQW5nbGV9YC5cbipcbiogQGFsaWFzIFJhYy5SYXlcbiovXG5jbGFzcyBSYXkge1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYFJheWAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gc3RhcnQgLSBBIGBQb2ludGAgd2hlcmUgdGhlIHJheSBzdGFydHNcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZX0gYW5nbGUgLSBBbiBgQW5nbGVgIHRoZSByYXkgaXMgZGlyZWN0ZWQgdG9cbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCBzdGFydCwgYW5nbGUpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjLCBzdGFydCwgYW5nbGUpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoUmFjLlBvaW50LCBzdGFydCk7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgc3RhcnQgcG9pbnQgb2YgdGhlIHJheS5cbiAgICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICAgKi9cbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG5cbiAgICAvKipcbiAgICAqIFRoZSBhbmdsZSB0b3dhcmRzIHdoaWNoIHRoZSByYXkgZXh0ZW5kcy5cbiAgICAqIEB0eXBlIHtSYWMuQW5nbGV9XG4gICAgKi9cbiAgICB0aGlzLmFuZ2xlID0gYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgeFN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnN0YXJ0LnksIGRpZ2l0cyk7XG4gICAgY29uc3QgdHVyblN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLmFuZ2xlLnR1cm4sIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBSYXkoKCR7eFN0cn0sJHt5U3RyfSkgYToke3R1cm5TdHJ9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gYHN0YXJ0YCBhbmQgYGFuZ2xlYCBpbiBib3RoIHJheXMgYXJlIGVxdWFsLlxuICAqXG4gICogV2hlbiBgb3RoZXJSYXlgIGlzIGFueSBjbGFzcyBvdGhlciB0aGF0IGBSYWMuUmF5YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUmF5fSBvdGhlclJheSAtIEEgYFJheWAgdG8gY29tcGFyZVxuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqIEBzZWUgUmFjLkFuZ2xlI2VxdWFsc1xuICAqL1xuICBlcXVhbHMob3RoZXJSYXkpIHtcbiAgICByZXR1cm4gb3RoZXJSYXkgaW5zdGFuY2VvZiBSYXlcbiAgICAgICYmIHRoaXMuc3RhcnQuZXF1YWxzKG90aGVyUmF5LnN0YXJ0KVxuICAgICAgJiYgdGhpcy5hbmdsZS5lcXVhbHMob3RoZXJSYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBzbG9wZSBvZiB0aGUgcmF5LCBvciBgbnVsbGAgaWYgdGhlIHJheSBpcyB2ZXJ0aWNhbC5cbiAgKlxuICAqIEluIHRoZSBsaW5lIGZvcm11bGEgYHkgPSBteCArIGJgIHRoZSBzbG9wZSBpcyBgbWAuXG4gICpcbiAgKiBAcmV0dXJucyB7P251bWJlcn1cbiAgKi9cbiAgc2xvcGUoKSB7XG4gICAgbGV0IGlzVmVydGljYWwgPVxuICAgICAgICAgdGhpcy5yYWMudW5pdGFyeUVxdWFscyh0aGlzLmFuZ2xlLnR1cm4sIHRoaXMucmFjLkFuZ2xlLmRvd24udHVybilcbiAgICAgIHx8IHRoaXMucmFjLnVuaXRhcnlFcXVhbHModGhpcy5hbmdsZS50dXJuLCB0aGlzLnJhYy5BbmdsZS51cC50dXJuKTtcbiAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgudGFuKHRoaXMuYW5nbGUucmFkaWFucygpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgeS1pbnRlcmNlcHQ6IHRoZSBwb2ludCBhdCB3aGljaCB0aGUgcmF5LCBleHRlbmRlZCBpbiBib3RoXG4gICogZGlyZWN0aW9ucywgaW50ZXJjZXB0cyB3aXRoIHRoZSB5LWF4aXM7IG9yIGBudWxsYCBpZiB0aGUgcmF5IGlzXG4gICogdmVydGljYWwuXG4gICpcbiAgKiBJbiB0aGUgbGluZSBmb3JtdWxhIGB5ID0gbXggKyBiYCB0aGUgeS1pbnRlcmNlcHQgaXMgYGJgLlxuICAqXG4gICogQHJldHVybnMgez9udW1iZXJ9XG4gICovXG4gIHlJbnRlcmNlcHQoKSB7XG4gICAgbGV0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIHkgPSBteCArIGJcbiAgICAvLyB5IC0gbXggPSBiXG4gICAgcmV0dXJuIHRoaXMuc3RhcnQueSAtIHNsb3BlICogdGhpcy5zdGFydC54O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnQgLSBUaGUgc3RhcnQgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aFN0YXJ0KG5ld1N0YXJ0KSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIG5ld1N0YXJ0LCB0aGlzLmFuZ2xlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydC54YCBzZXQgdG8gYG5ld1hgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdYIC0gVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIG5ldyBgUmF5YFxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB3aXRoWChuZXdYKSB7XG4gICAgcmV0dXJuIG5ldyBSYXkodGhpcy5yYWMsIHRoaXMuc3RhcnQud2l0aFgobmV3WCksIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0LnlgIHNldCB0byBgbmV3WWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IG5ld1kgLSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgbmV3IGBSYXlgXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhZKG5ld1kpIHtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydC53aXRoWShuZXdZKSwgdGhpcy5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIHNldCB0byBgbmV3QW5nbGVgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gbmV3QW5nbGUgLSBUaGUgYW5nbGUgZm9yIHRoZSBuZXcgYFJheWBcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYGFuZ2xlYCBhZGRlZCB0byBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIFRoZSBhbmdsZSB0byBhZGRcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKi9cbiAgd2l0aEFuZ2xlQWRkKGFuZ2xlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5hZGQoYW5nbGUpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBuZXdBbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgd2l0aCBgYW5nbGVgIHNldCB0b1xuICAqIGB0aGlzLntAbGluayBSYWMuQW5nbGUjc2hpZnQgYW5nbGUuc2hpZnR9KGFuZ2xlLCBjbG9ja3dpc2UpYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIHRvIGJlIHNoaWZ0ZWQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaWZ0XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHdpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IG5ld0FuZ2xlID0gdGhpcy5hbmdsZS5zaGlmdChhbmdsZSwgY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHBvaW50aW5nIHRvd2FyZHNcbiAgKiBge0BsaW5rIFJhYy5BbmdsZSNpbnZlcnNlIGFuZ2xlLmludmVyc2UoKX1gLlxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICBpbnZlcnNlKCkge1xuICAgIGNvbnN0IGludmVyc2VBbmdsZSA9IHRoaXMuYW5nbGUuaW52ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBpbnZlcnNlQW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGBhbmdsZWAgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgcGVycGVuZGljdWxhciA9IHRoaXMuYW5nbGUucGVycGVuZGljdWxhcihjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgUmF5KHRoaXMucmFjLCB0aGlzLnN0YXJ0LCBwZXJwZW5kaWN1bGFyKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUmF5YCB3aXRoIGBzdGFydGAgbW92ZWQgYWxvbmcgdGhlIHJheSBieSB0aGUgZ2l2ZW5cbiAgKiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogV2hlbiBgZGlzdGFuY2VgIGlzIG5lZ2F0aXZlLCBgc3RhcnRgIGlzIG1vdmVkIGluXG4gICogdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGBhbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSBgc3RhcnRgIGJ5XG4gICogQHJldHVybnMge1JhYy5SYXl9XG4gICovXG4gIHRyYW5zbGF0ZVRvRGlzdGFuY2UoZGlzdGFuY2UpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCB0b3dhcmRzIGBhbmdsZWAgYnkgdGhlIGdpdmVuXG4gICogYGRpc3RhbmNlYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBBbiBgQW5nbGVgIHRvIG1vdmUgYHN0YXJ0YCB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgYHN0YXJ0YCBieVxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5zdGFydC5wb2ludFRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgbmV3U3RhcnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHdpdGggYHN0YXJ0YCBtb3ZlZCBieSB0aGUgZ2l2ZW4gZGlzdGFuY2UgdG93YXJkIHRoZVxuICAqIGBhbmdsZS5wZXJwZW5kaWN1bGFyKClgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgYHN0YXJ0YCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcGVycGVuZGljdWxhclxuICAqIEByZXR1cm5zIHtSYWMuUmF5fVxuICAqL1xuICB0cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgbGV0IHBlcnBlbmRpY3VsYXIgPSB0aGlzLmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGVUb0FuZ2xlKHBlcnBlbmRpY3VsYXIsIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYW5nbGUgZnJvbSBgdGhpcy5zdGFydGAgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgcmV0dXJucyBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gbWVhc3VyZSB0aGUgYW5nbGUgdG9cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBhbmdsZVRvUG9pbnQocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgbG9jYXRlZCBpbiB0aGUgcmF5IHdoZXJlIHRoZSB4IGNvb3JkaW5hdGUgaXMgYHhgLlxuICAqIFdoZW4gdGhlIHJheSBpcyB2ZXJ0aWNhbCwgcmV0dXJucyBgbnVsbGAgc2luY2Ugbm8gc2luZ2xlIHBvaW50IHdpdGggeFxuICAqIGNvb3JkaW5hdGUgYXQgYHhgIGlzIHBvc3NpYmxlLlxuICAqXG4gICogVGhlIHJheSBpcyBjb25zaWRlcmVkIGEgdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gY2FsY3VsYXRlIGEgcG9pbnQgaW4gdGhlIHJheVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHBvaW50QXRYKHgpIHtcbiAgICBjb25zdCBzbG9wZSA9IHRoaXMuc2xvcGUoKTtcbiAgICBpZiAoc2xvcGUgPT09IG51bGwpIHtcbiAgICAgIC8vIFZlcnRpY2FsIHJheVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmFjLnVuaXRhcnlFcXVhbHMoc2xvcGUsIDApKSB7XG4gICAgICAvLyBIb3Jpem9udGFsIHJheVxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnQud2l0aFgoeCk7XG4gICAgfVxuXG4gICAgLy8geSA9IG14ICsgYlxuICAgIGNvbnN0IHkgPSBzbG9wZSAqIHggKyB0aGlzLnlJbnRlcmNlcHQoKTtcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIGluIHRoZSByYXkgd2hlcmUgdGhlIHkgY29vcmRpbmF0ZSBpcyBgeWAuXG4gICogV2hlbiB0aGUgcmF5IGlzIGhvcml6b250YWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIHNpbmdsZSBwb2ludCB3aXRoIHlcbiAgKiBjb29yZGluYXRlIGF0IGB5YCBpcyBwb3NzaWJsZS5cbiAgKlxuICAqIFRoZSByYXkgaXMgY29uc2lkZXJlZCBhbiB1bmJvdW5kZWQgbGluZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSB0byBjYWxjdWxhdGUgYSBwb2ludCBpbiB0aGUgcmF5XG4gICogQHJldHVyc24ge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdFkoeSkge1xuICAgIGNvbnN0IHNsb3BlID0gdGhpcy5zbG9wZSgpO1xuICAgIGlmIChzbG9wZSA9PT0gbnVsbCkge1xuICAgICAgLy8gVmVydGljYWwgcmF5XG4gICAgICByZXR1cm4gdGhpcy5zdGFydC53aXRoWSh5KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYWMudW5pdGFyeUVxdWFscyhzbG9wZSwgMCkpIHtcbiAgICAgIC8vIEhvcml6b250YWwgcmF5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBteCArIGIgPSB5XG4gICAgLy8geCA9ICh5IC0gYikvbVxuICAgIGNvbnN0IHggPSAoeSAtIHRoaXMueUludGVyY2VwdCgpKSAvIHNsb3BlO1xuICAgIHJldHVybiBuZXcgUmFjLlBvaW50KHRoaXMucmFjLCB4LCB5KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGluIHRoZSByYXkgYXQgdGhlIGdpdmVuIGBkaXN0YW5jZWAgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YC4gV2hlbiBgZGlzdGFuY2VgIGlzIG5lZ2F0aXZlLCB0aGUgbmV3IGBQb2ludGAgaXMgY2FsY3VsYXRlZFxuICAqIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZiBgYW5nbGVgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRgXG4gICogQHJldHVybnMge1JhYy5Qb2ludH1cbiAgKi9cbiAgcG9pbnRBdERpc3RhbmNlKGRpc3RhbmNlKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQucG9pbnRUb0FuZ2xlKHRoaXMuYW5nbGUsIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgUG9pbnRgIGF0IHRoZSBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZCBgb3RoZXJSYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcmF5cyBhcmUgcGFyYWxsZWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIGludGVyc2VjdGlvbiBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogQm90aCByYXlzIGFyZSBjb25zaWRlcmVkIHVuYm91bmRlZCBsaW5lcy5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gb3RoZXJSYXkgLSBBIGBSYXlgIHRvIGNhbGN1bGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHdpdGhcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0SW50ZXJzZWN0aW9uKG90aGVyUmF5KSB7XG4gICAgY29uc3QgYSA9IHRoaXMuc2xvcGUoKTtcbiAgICBjb25zdCBiID0gb3RoZXJSYXkuc2xvcGUoKTtcbiAgICAvLyBQYXJhbGxlbCBsaW5lcywgbm8gaW50ZXJzZWN0aW9uXG4gICAgaWYgKGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICh0aGlzLnJhYy51bml0YXJ5RXF1YWxzKGEsIGIpKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAvLyBBbnkgdmVydGljYWwgcmF5XG4gICAgaWYgKGEgPT09IG51bGwpIHsgcmV0dXJuIG90aGVyUmF5LnBvaW50QXRYKHRoaXMuc3RhcnQueCk7IH1cbiAgICBpZiAoYiA9PT0gbnVsbCkgeyByZXR1cm4gdGhpcy5wb2ludEF0WChvdGhlclJheS5zdGFydC54KTsgfVxuXG4gICAgY29uc3QgYyA9IHRoaXMueUludGVyY2VwdCgpO1xuICAgIGNvbnN0IGQgPSBvdGhlclJheS55SW50ZXJjZXB0KCk7XG5cbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaW5lJUUyJTgwJTkzbGluZV9pbnRlcnNlY3Rpb25cbiAgICBjb25zdCB4ID0gKGQgLSBjKSAvIChhIC0gYik7XG4gICAgY29uc3QgeSA9IGEgKiB4ICsgYztcbiAgICByZXR1cm4gbmV3IFJhYy5Qb2ludCh0aGlzLnJhYywgeCwgeSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBhdCB0aGUgcHJvamVjdGlvbiBvZiBgcG9pbnRgIG9udG8gdGhlIHJheS4gVGhlXG4gICogcHJvamVjdGVkIHBvaW50IGlzIHRoZSBjbG9zZXN0IHBvc3NpYmxlIHBvaW50IHRvIGBwb2ludGAuXG4gICpcbiAgKiBUaGUgcmF5IGlzIGNvbnNpZGVyZWQgYW4gdW5ib3VuZGVkIGxpbmUuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcHJvamVjdCBvbnRvIHRoZSByYXlcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludFByb2plY3Rpb24ocG9pbnQpIHtcbiAgICBjb25zdCBwZXJwZW5kaWN1bGFyID0gdGhpcy5hbmdsZS5wZXJwZW5kaWN1bGFyKCk7XG4gICAgcmV0dXJuIHBvaW50LnJheShwZXJwZW5kaWN1bGFyKVxuICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24odGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGZyb20gYHRoaXMuc3RhcnRgIHRvIHRoZSBwcm9qZWN0aW9uIG9mIGBwb2ludGBcbiAgKiBvbnRvIHRoZSByYXkuXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgZGlzdGFuY2UgaXMgcG9zaXRpdmUgd2hlbiB0aGUgcHJvamVjdGVkIHBvaW50IGlzIHRvd2FyZHNcbiAgKiB0aGUgZGlyZWN0aW9uIG9mIHRoZSByYXksIGFuZCBuZWdhdGl2ZSB3aGVuIGl0IGlzIGJlaGluZC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwcm9qZWN0IGFuZCBtZWFzdXJlIHRoZVxuICAqIGRpc3RhbmNlIHRvXG4gICogQHJldHVybnMge251bWJlcn1cbiAgKi9cbiAgZGlzdGFuY2VUb1Byb2plY3RlZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgcHJvamVjdGVkID0gdGhpcy5wb2ludFByb2plY3Rpb24ocG9pbnQpO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5zdGFydC5kaXN0YW5jZVRvUG9pbnQocHJvamVjdGVkKTtcblxuICAgIGlmICh0aGlzLnJhYy5lcXVhbHMoZGlzdGFuY2UsIDApKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZVRvUHJvamVjdGVkID0gdGhpcy5zdGFydC5hbmdsZVRvUG9pbnQocHJvamVjdGVkKTtcbiAgICBjb25zdCBhbmdsZURpZmYgPSB0aGlzLmFuZ2xlLnN1YnRyYWN0KGFuZ2xlVG9Qcm9qZWN0ZWQpO1xuICAgIGlmIChhbmdsZURpZmYudHVybiA8PSAxLzQgfHwgYW5nbGVEaWZmLnR1cm4gPiAzLzQpIHtcbiAgICAgIHJldHVybiBkaXN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC1kaXN0YW5jZTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIGFuZ2xlIHRvIHRoZSBnaXZlbiBgcG9pbnRgIGlzIGxvY2F0ZWQgY2xvY2t3aXNlXG4gICogb2YgdGhlIHJheSBvciBgZmFsc2VgIHdoZW4gbG9jYXRlZCBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgKlxuICAqICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9IG9yIGBwb2ludGAgbGFuZHMgb24gdGhlIHJheSwgaXQgaXNcbiAgKiBjb25zaWRlcmVkIGNsb2Nrd2lzZS4gV2hlbiBgcG9pbnRgIGxhbmRzIG9uIHRoZVxuICAqIFtpbnZlcnNlXXtAbGluayBSYWMuUmF5I2ludmVyc2V9IG9mIHRoZSByYXksIGl0IGlzIGNvbnNpZGVyZWRcbiAgKiBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBtZWFzdXJlIHRoZSBvcmllbnRhdGlvbiB0b1xuICAqIEByZXR1cm5zIHtib29sZWFufVxuICAqXG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICogQHNlZSBSYWMuUmF5I2ludmVyc2VcbiAgKi9cbiAgcG9pbnRPcmllbnRhdGlvbihwb2ludCkge1xuICAgIGNvbnN0IHBvaW50QW5nbGUgPSB0aGlzLnN0YXJ0LmFuZ2xlVG9Qb2ludChwb2ludCwgdGhpcy5hbmdsZSk7XG4gICAgaWYgKHRoaXMuYW5nbGUuZXF1YWxzKHBvaW50QW5nbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmdsZURpc3RhbmNlID0gcG9pbnRBbmdsZS5zdWJ0cmFjdCh0aGlzLmFuZ2xlKTtcbiAgICAvLyBbMCB0byAwLjUpIGlzIGNvbnNpZGVyZWQgY2xvY2t3aXNlXG4gICAgLy8gWzAuNSwgMSkgaXMgY29uc2lkZXJlZCBjb3VudGVyLWNsb2Nrd2lzZVxuICAgIHJldHVybiBhbmdsZURpc3RhbmNlLnR1cm4gPCAwLjU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFJheWAgZnJvbSBgdGhpcy5zdGFydGAgdG8gYHBvaW50YC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuc3RhcnRgIGFuZCBgcG9pbnRgIGFyZSBjb25zaWRlcmVkXG4gICogW2VxdWFsXXtAbGluayBSYWMuUG9pbnQjZXF1YWxzfSwgdGhlIG5ldyBgUmF5YCB3aWxsIHVzZSBgdGhpcy5hbmdsZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gcG9pbnQgLSBBIGBQb2ludGAgdG8gcG9pbnQgdGhlIGBSYXlgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlJheX1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgcmF5VG9Qb2ludChwb2ludCkge1xuICAgIGxldCBuZXdBbmdsZSA9IHRoaXMuc3RhcnQuYW5nbGVUb1BvaW50KHBvaW50LCB0aGlzLmFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJheSh0aGlzLnJhYywgdGhpcy5zdGFydCwgbmV3QW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB1c2luZyBgdGhpc2AgYW5kIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgc2VnbWVudChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TZWdtZW50KHRoaXMucmFjLCB0aGlzLCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBmcm9tIGB0aGlzLnN0YXJ0YCB0byBgcG9pbnRgLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIGBwb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlBvaW50fSBwb2ludCAtIEEgYFBvaW50YCB0byBwb2ludCB0aGUgYFNlZ21lbnRgIHRvd2FyZHNcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuUG9pbnQjZXF1YWxzXG4gICovXG4gIHNlZ21lbnRUb1BvaW50KHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuc2VnbWVudFRvUG9pbnQocG9pbnQsIHRoaXMuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBhdCBgdGhpcy5zdGFydGAgYW5kIGVuZGluZyBhdCB0aGVcbiAgKiBpbnRlcnNlY3Rpb24gb2YgYHRoaXNgIGFuZCBgb3RoZXJSYXlgLlxuICAqXG4gICogV2hlbiB0aGUgcmF5cyBhcmUgcGFyYWxsZWwsIHJldHVybnMgYG51bGxgIHNpbmNlIG5vIGludGVyc2VjdGlvbiBpc1xuICAqIHBvc3NpYmxlLlxuICAqXG4gICogV2hlbiBgdGhpcy5zdGFydGAgYW5kIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlYC5cbiAgKlxuICAqIEJvdGggcmF5cyBhcmUgY29uc2lkZXJlZCB1bmJvdW5kZWQgbGluZXMuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5SYXl9IG90aGVyUmF5IC0gQSBgUmF5YCB0byBjYWxjdWxhdGUgdGhlIGludGVyc2VjdGlvbiB3aXRoXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICBzZWdtZW50VG9JbnRlcnNlY3Rpb24ob3RoZXJSYXkpIHtcbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkpO1xuICAgIGlmIChpbnRlcnNlY3Rpb24gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZWdtZW50VG9Qb2ludChpbnRlcnNlY3Rpb24pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgXG4gICogYW5kIHRoZSBnaXZlbiBhcmMgcHJvcGVydGllcy5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0gez9SYWMuQW5nbGV8bnVtYmVyfSBbZW5kQW5nbGU9bnVsbF0gLSBUaGUgZW5kIGBBbmdsZWAgb2YgdGhlIG5ld1xuICAqIGBBcmNgOyB3aGVuIGBudWxsYCBvciBvbW1pdGVkLCBgdGhpcy5hbmdsZWAgaXMgdXNlZCBpbnN0ZWFkXG4gICogQHBhcmFtIHtib29sZWFuPX0gY2xvY2t3aXNlPXRydWUgLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5ldyBgQXJjYFxuICAqIEByZXR1cm5zIHtSYWMuQXJjfVxuICAqL1xuICBhcmMocmFkaXVzLCBlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMuYW5nbGVcbiAgICAgIDogdGhpcy5yYWMuQW5nbGUuZnJvbShlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBBcmNgIHdpdGggY2VudGVyIGF0IGB0aGlzLnN0YXJ0YCwgc3RhcnQgYXQgYHRoaXMuYW5nbGVgLFxuICAqIGFuZCBlbmQgYXQgdGhlIGdpdmVuIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLnN0YXJ0YCBpbiB0aGVcbiAgKiBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpdXMgLSBUaGUgcmFkaXVzIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBUaGUgYW5nbGUgZGlzdGFuY2UgZnJvbVxuICAqIGB0aGlzLnN0YXJ0YCB0byB0aGUgbmV3IGBBcmNgIGVuZFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyY1RvQW5nbGVEaXN0YW5jZShyYWRpdXMsIGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBsZXQgZW5kQW5nbGUgPSB0aGlzLmFuZ2xlLnNoaWZ0KGFuZ2xlRGlzdGFuY2UsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5zdGFydCwgcmFkaXVzLFxuICAgICAgdGhpcy5hbmdsZSwgZW5kQW5nbGUsXG4gICAgICBjbG9ja3dpc2UpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IGRvY3VtZW50XG4gIC8vIFJFTEVBU0UtVE9ETzogdGVzdFxuICAvLyBiYXNlZCBvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNzM0NzQ1L2hvdy10by1jcmVhdGUtY2lyY2xlLXdpdGgtYiVDMyVBOXppZXItY3VydmVzXG4gIGJlemllckFyYyhvdGhlclJheSkge1xuICAgIGlmICh0aGlzLnN0YXJ0LmVxdWFscyhvdGhlclJheS5zdGFydCkpIHtcbiAgICAgIC8vIFdoZW4gYm90aCByYXlzIGhhdmUgdGhlIHNhbWUgc3RhcnQsIHJldHVybnMgYSBwb2ludCBiZXppZXIuXG4gICAgICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQsXG4gICAgICAgIHRoaXMuc3RhcnQsIHRoaXMuc3RhcnQpO1xuICAgIH1cblxuICAgIGxldCBpbnRlcnNlY3Rpb24gPSB0aGlzLnBlcnBlbmRpY3VsYXIoKVxuICAgICAgLnBvaW50QXRJbnRlcnNlY3Rpb24ob3RoZXJSYXkucGVycGVuZGljdWxhcigpKTtcblxuICAgIGxldCBvcmllbnRhdGlvbiA9IG51bGw7XG4gICAgbGV0IHJhZGl1c0EgPSBudWxsO1xuICAgIGxldCByYWRpdXNCID0gbnVsbDtcblxuICAgIC8vIENoZWNrIGZvciBwYXJhbGxlbCByYXlzXG4gICAgaWYgKGludGVyc2VjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgLy8gTm9ybWFsIGludGVyc2VjdGlvbiBjYXNlXG4gICAgICBvcmllbnRhdGlvbiA9IHRoaXMucG9pbnRPcmllbnRhdGlvbihpbnRlcnNlY3Rpb24pO1xuICAgICAgcmFkaXVzQSA9IGludGVyc2VjdGlvbi5zZWdtZW50VG9Qb2ludCh0aGlzLnN0YXJ0KTtcbiAgICAgIHJhZGl1c0IgPSBpbnRlcnNlY3Rpb24uc2VnbWVudFRvUG9pbnQob3RoZXJSYXkuc3RhcnQpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgcGFyYWxsZWwgcmF5cywgb3RoZXJSYXkgZ2V0cyBzaGlmdGVkIHRvIGJlXG4gICAgICAvLyBwZXJwZW5kaWN1bGFyIHRvIHRoaXMuXG4gICAgICBsZXQgc2hpZnRlZEludGVyc2VjdGlvbiA9IHRoaXMucGVycGVuZGljdWxhcigpXG4gICAgICAgIC5wb2ludEF0SW50ZXJzZWN0aW9uKG90aGVyUmF5KTtcbiAgICAgIGlmIChzaGlmdGVkSW50ZXJzZWN0aW9uID09PSBudWxsIHx8IHRoaXMuc3RhcnQuZXF1YWxzKHNoaWZ0ZWRJbnRlcnNlY3Rpb24pKSB7XG4gICAgICAgIC8vIFdoZW4gYm90aCByYXlzIGxheSBvbiB0b3Agb2YgZWFjaCBvdGhlciwgdGhlIHNoaWZ0aW5nIHByb2R1Y2VzXG4gICAgICAgIC8vIHJheXMgd2l0aCB0aGUgc2FtZSBzdGFydDsgZnVuY3Rpb24gcmV0dXJucyBhIGxpbmVhciBiZXppZXIuXG4gICAgICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgICB0aGlzLnN0YXJ0LCB0aGlzLnN0YXJ0LFxuICAgICAgICAgIG90aGVyUmF5LnN0YXJ0LCBvdGhlclJheS5zdGFydCk7XG4gICAgICB9XG4gICAgICBpbnRlcnNlY3Rpb24gPSB0aGlzLnN0YXJ0LnBvaW50QXRCaXNlY3RvcihzaGlmdGVkSW50ZXJzZWN0aW9uKTtcblxuICAgICAgLy8gQ2FzZSBmb3Igc2hpZnRlZCBpbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gcmF5c1xuICAgICAgb3JpZW50YXRpb24gPSB0aGlzLnBvaW50T3JpZW50YXRpb24oaW50ZXJzZWN0aW9uKTtcbiAgICAgIHJhZGl1c0EgPSBpbnRlcnNlY3Rpb24uc2VnbWVudFRvUG9pbnQodGhpcy5zdGFydCk7XG4gICAgICByYWRpdXNCID0gcmFkaXVzQS5pbnZlcnNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYW5nbGVEaXN0YW5jZSA9IHJhZGl1c0EuYW5nbGUoKS5kaXN0YW5jZShyYWRpdXNCLmFuZ2xlKCksIG9yaWVudGF0aW9uKTtcbiAgICBjb25zdCBxdWFydGVyQW5nbGUgPSBhbmdsZURpc3RhbmNlLm11bHQoMS80KTtcbiAgICAvLyBSRUxFQVNFLVRPRE86IHdoYXQgaGFwcGVucyB3aXRoIHNxdWFyZSBhbmdsZXM/IGlzIHRoaXMgY292ZXJlZCBieSBpbnRlcnNlY3Rpb24gbG9naWM/XG4gICAgY29uc3QgcXVhcnRlclRhbiA9IHF1YXJ0ZXJBbmdsZS50YW4oKTtcblxuICAgIGNvbnN0IHRhbmdlbnRBID0gcXVhcnRlclRhbiAqIHJhZGl1c0EubGVuZ3RoICogNC8zO1xuICAgIGNvbnN0IGFuY2hvckEgPSB0aGlzLnBvaW50QXREaXN0YW5jZSh0YW5nZW50QSk7XG5cbiAgICBjb25zdCB0YW5nZW50QiA9IHF1YXJ0ZXJUYW4gKiByYWRpdXNCLmxlbmd0aCAqIDQvMztcbiAgICBjb25zdCBhbmNob3JCID0gb3RoZXJSYXkucG9pbnRBdERpc3RhbmNlKHRhbmdlbnRCKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkJlemllcih0aGlzLnJhYyxcbiAgICAgICAgdGhpcy5zdGFydCwgYW5jaG9yQSxcbiAgICAgICAgYW5jaG9yQiwgb3RoZXJSYXkuc3RhcnQpO1xuICB9XG5cbn0gLy8gY2xhc3MgUmF5XG5cblxubW9kdWxlLmV4cG9ydHMgPSBSYXk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBTZWdtZW50IG9mIGEgYFtSYXlde0BsaW5rIFJhYy5SYXl9YCB1cCB0byBhIGdpdmVuIGxlbmd0aC5cbipcbiogQGFsaWFzIFJhYy5TZWdtZW50XG4qL1xuY2xhc3MgU2VnbWVudCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgU2VnbWVudGAgaW5zdGFuY2UuXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7UmFjLlJheX0gcmF5IC0gQSBgUmF5YCB0aGUgc2VnbWVudCB3aWxsIGJlIGJhc2VkIG9mXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIHNlZ21lbnRcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByYXksIGxlbmd0aCkge1xuICAgIC8vIFRPRE86IGRpZmZlcmVudCBhcHByb2FjaCB0byBlcnJvciB0aHJvd2luZz9cbiAgICAvLyBhc3NlcnQgfHwgdGhyb3cgbmV3IEVycm9yKGVyci5taXNzaW5nUGFyYW1ldGVycylcbiAgICAvLyBvclxuICAgIC8vIGNoZWNrZXIobXNnID0+IHsgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQobXNnKSk7XG4gICAgLy8gICAuZXhpc3RzKHJhYylcbiAgICAvLyAgIC5pc1R5cGUoUmFjLlJheSwgcmF5KVxuICAgIC8vICAgLmlzTnVtYmVyKGxlbmd0aClcblxuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHJheSwgbGVuZ3RoKTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5SYXksIHJheSk7XG4gICAgdXRpbHMuYXNzZXJ0TnVtYmVyKGxlbmd0aCk7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhYztcblxuICAgIC8qKlxuICAgICogVGhlIGBSYXlgIHRoZSBzZWdtZW50IGlzIGJhc2VkIG9mLlxuICAgICogQHR5cGUge1JhYy5SYXl9XG4gICAgKi9cbiAgICB0aGlzLnJheSA9IHJheTtcblxuICAgIC8qKlxuICAgICogVGhlIGxlbmd0aCBvZiB0aGUgc2VnbWVudC5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucmF5LnN0YXJ0LngsIGRpZ2l0cyk7XG4gICAgY29uc3QgeVN0ciA9IHV0aWxzLmN1dERpZ2l0cyh0aGlzLnJheS5zdGFydC55LCBkaWdpdHMpO1xuICAgIGNvbnN0IHR1cm5TdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5yYXkuYW5nbGUudHVybiwgZGlnaXRzKTtcbiAgICBjb25zdCBsZW5ndGhTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5sZW5ndGgsIGRpZ2l0cyk7XG4gICAgcmV0dXJuIGBTZWdtZW50KCgke3hTdHJ9LCR7eVN0cn0pIGE6JHt0dXJuU3RyfSBsOiR7bGVuZ3RoU3RyfSlgO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIGByYXlgIGFuZCBgbGVuZ3RoYCBpbiBib3RoIHNlZ21lbnRzIGFyZSBlcXVhbC5cbiAgKlxuICAqIFdoZW4gYG90aGVyU2VnbWVudGAgaXMgYW55IGNsYXNzIG90aGVyIHRoYXQgYFJhYy5TZWdtZW50YCwgcmV0dXJucyBgZmFsc2VgLlxuICAqXG4gICogU2VnbWVudHMnIGBsZW5ndGhgIGFyZSBjb21wYXJlZCB1c2luZyBge0BsaW5rIFJhYyNlcXVhbHN9YC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlNlZ21lbnR9IG90aGVyU2VnbWVudCAtIEEgYFNlZ21lbnRgIHRvIGNvbXBhcmVcbiAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgKiBAc2VlIFJhYy5SYXkjZXF1YWxzXG4gICogQHNlZSBSYWMjZXF1YWxzXG4gICovXG4gIGVxdWFscyhvdGhlclNlZ21lbnQpIHtcbiAgICByZXR1cm4gb3RoZXJTZWdtZW50IGluc3RhbmNlb2YgU2VnbWVudFxuICAgICAgJiYgdGhpcy5yYXkuZXF1YWxzKG90aGVyU2VnbWVudC5yYXkpXG4gICAgICAmJiB0aGlzLnJhYy5lcXVhbHModGhpcy5sZW5ndGgsIG90aGVyU2VnbWVudC5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBgW2FuZ2xlXXtAbGluayBSYWMuUmF5I2FuZ2xlfWAgb2YgdGhlIHNlZ21lbnQncyBgcmF5YC5cbiAgKiBAcmV0dXJucyB7UmFjLkFuZ2xlfVxuICAqL1xuICBhbmdsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkuYW5nbGU7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGBbc3RhcnRde0BsaW5rIFJhYy5SYXkjc3RhcnR9YCBvZiB0aGUgc2VnbWVudCdzIGByYXlgLlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICovXG4gIHN0YXJ0UG9pbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnN0YXJ0O1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgd2hlcmUgdGhlIHNlZ21lbnQgZW5kcy5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBlbmRQb2ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBhbmdsZSBzZXQgdG8gYG5ld0FuZ2xlYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IG5ld0FuZ2xlIC0gVGhlIGFuZ2xlIGZvciB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aEFuZ2xlKG5ld0FuZ2xlKSB7XG4gICAgbmV3QW5nbGUgPSBSYWMuQW5nbGUuZnJvbSh0aGlzLnJhYywgbmV3QW5nbGUpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCB0aGlzLnJheS5zdGFydCwgbmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYHJheWAgc2V0IHRvIGBuZXdSYXlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLlJheX0gbmV3UmF5IC0gVGhlIHJheSBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhSYXkobmV3UmF5KSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBzdGFydCBwb2ludCBzZXQgdG8gYG5ld1N0YXJ0YC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBmb3IgdGhlIG5ld1xuICAqIGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LndpdGhTdGFydChuZXdTdGFydFBvaW50KTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIGBsZW5ndGhgIHNldCB0byBgbmV3TGVuZ3RoYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3TGVuZ3RoIC0gVGhlIGxlbmd0aCBmb3IgdGhlIG5ldyBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhMZW5ndGgobmV3TGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCB0aGlzLnJheSwgbmV3TGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgbGVuZ3RoYCBhZGRlZCB0byBgdGhpcy5sZW5ndGhgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIGFkZFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aExlbmd0aEFkZChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCArIGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGxlbmd0aGAgc2V0IHRvIGB0aGlzLmxlbmd0aCAqIHJhdGlvYC5cbiAgKlxuICAqIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgZmFjdG9yIHRvIG11bHRpcGx5IGBsZW5ndGhgIGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoTGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aCAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgYW5nbGVgIGFkZGVkIHRvIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYWRkXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoQW5nbGVBZGQoYW5nbGUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoQW5nbGVBZGQoYW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggYGFuZ2xlYCBzZXQgdG9cbiAgKiBgdGhpcy5yYXkue0BsaW5rIFJhYy5BbmdsZSNzaGlmdCBhbmdsZS5zaGlmdH0oYW5nbGUsIGNsb2Nrd2lzZSlgLlxuICAqXG4gICogQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIEBwYXJhbSB7UmFjLkFuZ2xlfG51bWJlcn0gYW5nbGUgLSBUaGUgYW5nbGUgdG8gYmUgc2hpZnRlZCBieVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpZnRcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHdpdGhBbmdsZVNoaWZ0KGFuZ2xlLCBjbG9ja3dpc2UgPSB0cnVlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkud2l0aEFuZ2xlU2hpZnQoYW5nbGUsIGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgaW4gdGhlIGludmVyc2VcbiAgKiBkaXJlY3Rpb24gb2YgdGhlIHNlZ21lbnQncyByYXkgYnkgdGhlIGdpdmVuIGBkaXN0YW5jZWAuIFRoZSByZXN1bHRpbmdcbiAgKiBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBzYW1lIGBlbmRQb2ludCgpYCBhbmQgYGFuZ2xlKClgIGFzIGB0aGlzYC5cbiAgKlxuICAqIFVzaW5nIGEgcG9zaXRpdmUgYGRpc3RhbmNlYCByZXN1bHRzIGluIGEgbG9uZ2VyIHNlZ21lbnQsIHVzaW5nIGFcbiAgKiBuZWdhdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBzaG9ydGVyIG9uZS5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIFRoZSBkaXN0YW5jZSB0byBtb3ZlIHRoZSBzdGFydCBwb2ludCBieVxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKi9cbiAgd2l0aFN0YXJ0RXh0ZW5zaW9uKGRpc3RhbmNlKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkudHJhbnNsYXRlVG9EaXN0YW5jZSgtZGlzdGFuY2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCArIGRpc3RhbmNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBgZGlzdGFuY2VgIGFkZGVkIHRvIGB0aGlzLmxlbmd0aGAsIHdoaWNoXG4gICogcmVzdWx0cyBpbiBgZW5kUG9pbnQoKWAgZm9yIHRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIG1vdmluZyBpbiB0aGVcbiAgKiBkaXJlY3Rpb24gb2YgdGhlIHNlZ21lbnQncyByYXkgYnkgdGhlIGdpdmVuIGBkaXN0YW5jZWAuXG4gICpcbiAgKiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogVXNpbmcgYSBwb3NpdGl2ZSBgZGlzdGFuY2VgIHJlc3VsdHMgaW4gYSBsb25nZXIgc2VnbWVudCwgdXNpbmcgYVxuICAqIG5lZ2F0aXZlIGBkaXN0YW5jZWAgcmVzdWx0cyBpbiBhIHNob3J0ZXIgb25lLlxuICAqXG4gICogVGhpcyBtZXRob2QgcGVyZm9ybXMgdGhlIHNhbWUgb3BlcmF0aW9uIGFzXG4gICogYFt3aXRoTGVuZ3RoQWRkXXtAbGluayBSYWMuU2VnbWVudCN3aXRoTGVuZ3RoQWRkfWAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gYWRkIHRvIGBsZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB3aXRoRW5kRXh0ZW5zaW9uKGRpc3RhbmNlKSB7XG4gICAgcmV0dXJuIHRoaXMud2l0aExlbmd0aEFkZChkaXN0YW5jZSk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnRcbiAgLy8gUkVMRUFTRS1UT0RPOiB0ZXN0XG4gIGludmVyc2UoKSB7XG4gICAgY29uc3QgbmV3UmF5ID0gdGhpcy5yYXkuaW52ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHBvaW50aW5nIHRvd2FyZHMgdGhlXG4gICogW3BlcnBlbmRpY3VsYXIgYW5nbGVde0BsaW5rIFJhYy5BbmdsZSNwZXJwZW5kaWN1bGFyfSBvZlxuICAqIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYCBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSByZXN1bHRpbmcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgc2FtZSBgc3RhcnRQb2ludCgpYCBhbmQgYGxlbmd0aGBcbiAgKiBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBwZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS5wZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCBpdHMgc3RhcnQgcG9pbnQgc2V0IGF0XG4gICogYFt0aGlzLmVuZFBvaW50KClde0BsaW5rIFJhYy5TZWdtZW50I2VuZFBvaW50fWAsXG4gICogYW5nbGUgc2V0IHRvIGB0aGlzLmFuZ2xlKCkuW2ludmVyc2UoKV17QGxpbmsgUmFjLkFuZ2xlI2ludmVyc2V9YCwgYW5kXG4gICogc2FtZSBsZW5ndGggYXMgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgcmV2ZXJzZSgpIHtcbiAgICBjb25zdCBlbmQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgY29uc3QgaW52ZXJzZVJheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBlbmQsIHRoaXMucmF5LmFuZ2xlLmludmVyc2UoKSk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBpbnZlcnNlUmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHdpdGggdGhlIHN0YXJ0IHBvaW50IG1vdmVkIHRvd2FyZHMgYGFuZ2xlYCBieVxuICAqIHRoZSBnaXZlbiBgZGlzdGFuY2VgLiBBbGwgb3RoZXIgcHJvcGVydGllcyBhcmUgY29waWVkIGZyb20gYHRoaXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZSAtIEFuIGBBbmdsZWAgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnRcbiAgICB0b3dhcmRzXG4gICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gVGhlIGRpc3RhbmNlIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0FuZ2xlKGFuZ2xlLCBkaXN0YW5jZSkge1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5LnRyYW5zbGF0ZVRvQW5nbGUoYW5nbGUsIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIG5ld1JheSwgdGhpcy5sZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCB3aXRoIHRoZSBzdGFydCBwb2ludCBtb3ZlZCBhbG9uZyB0aGUgc2VnbWVudCdzXG4gICogcmF5IGJ5IHRoZSBnaXZlbiBgbGVuZ3RoYC4gQWxsIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvcGllZCBmcm9tIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIGBzdGFydGAgaXMgbW92ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mXG4gICogYGFuZ2xlYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIHRvIG1vdmUgdGhlIHN0YXJ0IHBvaW50IGJ5XG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqL1xuICB0cmFuc2xhdGVUb0xlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVUb0Rpc3RhbmNlKGxlbmd0aCk7XG4gICAgcmV0dXJuIG5ldyBTZWdtZW50KHRoaXMucmFjLCBuZXdSYXksIHRoaXMubGVuZ3RoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgd2l0aCB0aGUgc3RhcnQgcG9pbnQgbW92ZWQgdGhlIGdpdmVuIGBkaXN0YW5jZWBcbiAgKiB0b3dhcmRzIHRoZSBwZXJwZW5kaWN1bGFyIGFuZ2xlIHRvIGB0aGlzLmFuZ2xlKClgIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0b24uIEFsbCBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgZnJvbSBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSBUaGUgZGlzdGFuY2UgdG8gbW92ZSB0aGUgc3RhcnQgcG9pbnQgYnlcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHBlcnBlbmRpY3VsYXJcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIHRyYW5zbGF0ZVBlcnBlbmRpY3VsYXIoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS50cmFuc2xhdGVQZXJwZW5kaWN1bGFyKGRpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCB0aGlzLmxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGdpdmVuIGB2YWx1ZWAgY2xhbXBlZCB0byBbc3RhcnRJbnNldCwgbGVuZ3RoLWVuZEluc2V0XS5cbiAgKlxuICAqIFdoZW4gYHN0YXJ0SW5zZXRgIGlzIGdyZWF0ZXIgdGhhdCBgbGVuZ3RoLWVuZEluc2V0YCB0aGUgcmFuZ2UgZm9yIHRoZVxuICAqIGNsYW1wIGJlY29tZXMgaW1wb3NpYmxlIHRvIGZ1bGZpbGwuIEluIHRoaXMgY2FzZSB0aGUgcmV0dXJuZWQgdmFsdWVcbiAgKiB3aWxsIGJlIHRoZSBjZW50ZXJlZCBiZXR3ZWVuIHRoZSByYW5nZSBsaW1pdHMgYW5kIHN0aWxsIGNsYW1wbGVkIHRvXG4gICogYFswLCBsZW5ndGhdYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIEEgdmFsdWUgdG8gY2xhbXBcbiAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0SW5zZXQ9MF0gLSBUaGUgaW5zZXQgZm9yIHRoZSBsb3dlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEBwYXJhbSB7ZW5kSW5zZXR9IFtlbmRJbnNldD0wXSAtIFRoZSBpbnNldCBmb3IgdGhlIGhpZ2hlciBsaW1pdCBvZiB0aGVcbiAgKiBjbGFtcGluZyByYW5nZVxuICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICovXG4gIGNsYW1wVG9MZW5ndGgodmFsdWUsIHN0YXJ0SW5zZXQgPSAwLCBlbmRJbnNldCA9IDApIHtcbiAgICBjb25zdCBlbmRMaW1pdCA9IHRoaXMubGVuZ3RoIC0gZW5kSW5zZXQ7XG4gICAgaWYgKHN0YXJ0SW5zZXQgPj0gZW5kTGltaXQpIHtcbiAgICAgIC8vIGltcG9zaWJsZSByYW5nZSwgcmV0dXJuIG1pZGRsZSBwb2ludFxuICAgICAgY29uc3QgcmFuZ2VNaWRkbGUgPSAoc3RhcnRJbnNldCAtIGVuZExpbWl0KSAvIDI7XG4gICAgICBjb25zdCBtaWRkbGUgPSBzdGFydEluc2V0IC0gcmFuZ2VNaWRkbGU7XG4gICAgICAvLyBTdGlsbCBjbGFtcCB0byB0aGUgc2VnbWVudCBpdHNlbGZcbiAgICAgIGxldCBjbGFtcGVkID0gbWlkZGxlO1xuICAgICAgY2xhbXBlZCA9IE1hdGgubWluKGNsYW1wZWQsIHRoaXMubGVuZ3RoKTtcbiAgICAgIGNsYW1wZWQgPSBNYXRoLm1heChjbGFtcGVkLCAwKTtcbiAgICAgIHJldHVybiBjbGFtcGVkO1xuICAgIH1cbiAgICBsZXQgY2xhbXBlZCA9IHZhbHVlO1xuICAgIGNsYW1wZWQgPSBNYXRoLm1pbihjbGFtcGVkLCB0aGlzLmxlbmd0aCAtIGVuZEluc2V0KTtcbiAgICBjbGFtcGVkID0gTWF0aC5tYXgoY2xhbXBlZCwgc3RhcnRJbnNldCk7XG4gICAgcmV0dXJuIGNsYW1wZWQ7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCB0aGUgZ2l2ZW4gYGxlbmd0aGAgZnJvbVxuICAqIGB0aGlzLnN0YXJ0UG9pbnQoKWAuIFdoZW4gYGxlbmd0aGAgaXMgbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpc1xuICAqIGNhbGN1bGF0ZWQgaW4gdGhlIGludmVyc2UgZGlyZWN0aW9uIG9mIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBkaXN0YW5jZSBmcm9tIGB0aGlzLnN0YXJ0UG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqIEBzZWUgUmFjLlJheSNwb2ludEF0RGlzdGFuY2VcbiAgKi9cbiAgcG9pbnRBdExlbmd0aChsZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKGxlbmd0aCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBpbiB0aGUgc2VnbWVudCdzIHJheSBhdCBhIGRpc3RhbmNlIG9mXG4gICogYHRoaXMubGVuZ3RoICogcmF0aW9gIGZyb20gYHRoaXMuc3RhcnRQb2ludCgpYC4gV2hlbiBgcmF0aW9gIGlzXG4gICogbmVnYXRpdmUsIHRoZSBuZXcgYFBvaW50YCBpcyBjYWxjdWxhdGVkIGluIHRoZSBpbnZlcnNlIGRpcmVjdGlvbiBvZlxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgbGVuZ3RoYCBieVxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICogQHNlZSBSYWMuUmF5I3BvaW50QXREaXN0YW5jZVxuICAqL1xuICBwb2ludEF0TGVuZ3RoUmF0aW8ocmF0aW8pIHtcbiAgICByZXR1cm4gdGhpcy5yYXkucG9pbnRBdERpc3RhbmNlKHRoaXMubGVuZ3RoICogcmF0aW8pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBQb2ludGAgYXQgdGhlIG1pZGRsZSBwb2ludCB0aGUgc2VnbWVudC5cbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqL1xuICBwb2ludEF0QmlzZWN0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnBvaW50QXREaXN0YW5jZSh0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgc3RhcnRpbmcgYXQgYG5ld1N0YXJ0UG9pbnRgIGFuZCBlbmRpbmcgYXRcbiAgKiBgdGhpcy5lbmRQb2ludCgpYC5cbiAgKlxuICAqIFdoZW4gYG5ld1N0YXJ0UG9pbnRgIGFuZCBgdGhpcy5lbmRQb2ludCgpYCBhcmUgY29uc2lkZXJlZFxuICAqIFtlcXVhbF17QGxpbmsgUmFjLlBvaW50I2VxdWFsc30sIHRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgdXNlXG4gICogYHRoaXMuYW5nbGUoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5Qb2ludH0gbmV3U3RhcnRQb2ludCAtIFRoZSBzdGFydCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbW92ZVN0YXJ0UG9pbnQobmV3U3RhcnRQb2ludCkge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIHJldHVybiBuZXdTdGFydFBvaW50LnNlZ21lbnRUb1BvaW50KGVuZFBvaW50LCB0aGlzLnJheS5hbmdsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFNlZ21lbnRgIHN0YXJ0aW5nIGF0IGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGVuZGluZyBhdFxuICAqIGBuZXdFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGB0aGlzLnN0YXJ0UG9pbnQoKWAgYW5kIGBuZXdFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5ld0VuZFBvaW50IC0gVGhlIGVuZCBwb2ludCBvZiB0aGUgbmV3IGBTZWdtZW50YFxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5Qb2ludCNlcXVhbHNcbiAgKi9cbiAgbW92ZUVuZFBvaW50KG5ld0VuZFBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMucmF5LnNlZ21lbnRUb1BvaW50KG5ld0VuZFBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc3RhcnRpbmcgcG9pbnQgdG8gdGhlIHNlZ21lbnQncyBtaWRkbGVcbiAgKiBwb2ludC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKiBAc2VlIFJhYy5TZWdtZW50I3BvaW50QXRCaXNlY3RvclxuICAqL1xuICBzZWdtZW50VG9CaXNlY3RvcigpIHtcbiAgICByZXR1cm4gbmV3IFNlZ21lbnQodGhpcy5yYWMsIHRoaXMucmF5LCB0aGlzLmxlbmd0aC8yKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU2VnbWVudGAgZnJvbSB0aGUgc2VnbWVudCdzIG1pZGRsZSBwb2ludCB0b3dhcmRzIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIG5ldyBgU2VnbWVudGAgd2lsbCBoYXZlIHRoZSBnaXZlbiBgbGVuZ3RoYCwgb3Igd2hlbiBvbW1pdGVkIG9yXG4gICogYG51bGxgIHdpbGwgdXNlIGB0aGlzLmxlbmd0aGAgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwZXJwZW5kaWN1bGFyXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlNlZ21lbnQjcG9pbnRBdEJpc2VjdG9yXG4gICogQHNlZSBSYWMuQW5nbGUjcGVycGVuZGljdWxhclxuICAqL1xuICBzZWdtZW50QmlzZWN0b3IobGVuZ3RoID0gbnVsbCwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5wb2ludEF0QmlzZWN0b3IoKTtcbiAgICBjb25zdCBuZXdBbmdsZSA9IHRoaXMucmF5LmFuZ2xlLnBlcnBlbmRpY3VsYXIoY2xvY2t3aXNlKTtcbiAgICBjb25zdCBuZXdSYXkgPSBuZXcgUmFjLlJheSh0aGlzLnJhYywgbmV3U3RhcnQsIG5ld0FuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aXRoIHRoZSBnaXZlblxuICAqIGBsZW5ndGhgIGFuZCB0aGUgc2FtZSBhbmdsZSBhcyBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV4dCBgU2VnbWVudGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50V2l0aExlbmd0aChsZW5ndGgpIHtcbiAgICBjb25zdCBuZXdTdGFydCA9IHRoaXMuZW5kUG9pbnQoKTtcbiAgICBjb25zdCBuZXdSYXkgPSB0aGlzLnJheS53aXRoU3RhcnQobmV3U3RhcnQpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBsZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCBhbmQgdXAgdG8gdGhlIGdpdmVuXG4gICogYG5leHRFbmRQb2ludGAuXG4gICpcbiAgKiBXaGVuIGBlbmRQb2ludCgpYCBhbmQgYG5leHRFbmRQb2ludGAgYXJlIGNvbnNpZGVyZWRcbiAgKiBbZXF1YWxde0BsaW5rIFJhYy5Qb2ludCNlcXVhbHN9LCB0aGUgbmV3IGBTZWdtZW50YCB3aWxsIHVzZVxuICAqIGB0aGlzLmFuZ2xlKClgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuUG9pbnR9IG5leHRFbmRQb2ludCAtIFRoZSBlbmQgcG9pbnQgb2YgdGhlIG5leHQgYFNlZ21lbnRgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLlBvaW50I2VxdWFsc1xuICAqL1xuICBuZXh0U2VnbWVudFRvUG9pbnQobmV4dEVuZFBvaW50KSB7XG4gICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmVuZFBvaW50KCk7XG4gICAgcmV0dXJuIG5ld1N0YXJ0LnNlZ21lbnRUb1BvaW50KG5leHRFbmRQb2ludCwgdGhpcy5yYXkuYW5nbGUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIGBhbmdsZWBcbiAgKiB3aXRoIHRoZSBnaXZlbiBgbGVuZ3RoYC5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlIC0gVGhlIGFuZ2xlIG9mIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHs/bnVtYmVyfSBbbGVuZ3RoPW51bGxdIC0gVGhlIGxlbmd0aCBvZiB0aGUgbmV3IGBTZWdtZW50YCwgb3JcbiAgKiBgbnVsbGAgdG8gdXNlIGB0aGlzLmxlbmd0aGBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICovXG4gIG5leHRTZWdtZW50VG9BbmdsZShhbmdsZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIGFuZ2xlKTtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1N0YXJ0ID0gdGhpcy5lbmRQb2ludCgpO1xuICAgIGNvbnN0IG5ld1JheSA9IG5ldyBSYWMuUmF5KHRoaXMucmFjLCBuZXdTdGFydCwgYW5nbGUpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZSBnaXZlblxuICAqIGBhbmdsZURpc3RhbmNlYCBmcm9tIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWBcbiAgKiBvcmllbnRhdGlvbi5cbiAgKlxuICAqIFRoZSBuZXcgYFNlZ21lbnRgIHdpbGwgaGF2ZSB0aGUgZ2l2ZW4gYGxlbmd0aGAsIG9yIHdoZW4gb21taXRlZCBvclxuICAqIGBudWxsYCB3aWxsIHVzZSBgdGhpcy5sZW5ndGhgIGluc3RlYWQuXG4gICpcbiAgKiBOb3RpY2UgdGhhdCB0aGUgYGFuZ2xlRGlzdGFuY2VgIGlzIGFwcGxpZWQgdG8gdGhlIGludmVyc2Ugb2YgdGhlXG4gICogc2VnbWVudCdzIGFuZ2xlLiBFLmcuIHdpdGggYW4gYGFuZ2xlRGlzdGFuY2VgIG9mIGAwYCB0aGUgcmVzdWx0aW5nXG4gICogYFNlZ21lbnRgIHdpbGwgYmUgZGlyZWN0bHkgb3ZlciBhbmQgcG9pbnRpbmcgaW4gdGhlIGludmVyc2UgYW5nbGUgb2ZcbiAgKiBgdGhpc2AuIEFzIHRoZSBgYW5nbGVEaXN0YW5jZWAgaW5jcmVhc2VzIHRoZSB0d28gc2VnbWVudHMgc2VwYXJhdGUgd2l0aFxuICAqIHRoZSBwaXZvdCBhdCBgZW5kUG9pbnQoKWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5BbmdsZXxudW1iZXJ9IGFuZ2xlRGlzdGFuY2UgLSBBbiBhbmdsZSBkaXN0YW5jZSB0byBhcHBseSB0b1xuICAqIHRoZSBzZWdtZW50J3MgYW5nbGUgaW52ZXJzZVxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgYW5nbGUgc2hpZnRcbiAgKiBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI2ludmVyc2VcbiAgKi9cbiAgbmV4dFNlZ21lbnRUb0FuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSwgbGVuZ3RoID0gbnVsbCkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IG5ld0xlbmd0aCA9IGxlbmd0aCA9PT0gbnVsbCA/IHRoaXMubGVuZ3RoIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5pbnZlcnNlKClcbiAgICAgIC53aXRoQW5nbGVTaGlmdChhbmdsZURpc3RhbmNlLCBjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB0b3dhcmRzIHRoZVxuICAqIGBbcGVycGVuZGljdWxhciBhbmdsZV17QGxpbmsgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJ9YCBvZlxuICAqIGB0aGlzLmFuZ2xlKCkuaW52ZXJzZSgpYCBpbiB0aGUgYGNsb2Nrd2lzZWAgb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIGhhdmUgdGhlIGdpdmVuIGBsZW5ndGhgLCBvciB3aGVuIG9tbWl0ZWQgb3JcbiAgKiBgbnVsbGAgd2lsbCB1c2UgYHRoaXMubGVuZ3RoYCBpbnN0ZWFkLlxuICAqXG4gICogTm90aWNlIHRoYXQgdGhlIHBlcnBlbmRpY3VsYXIgaXMgY2FsY3VsYXRlZCBmcm9tIHRoZSBpbnZlcnNlIG9mIHRoZVxuICAqIHNlZ21lbnQncyBhbmdsZS4gRS5nLiB3aXRoIGBjbG9ja3dpc2VgIGFzIGB0cnVlYCwgdGhlIHJlc3VsdGluZ1xuICAqIGBTZWdtZW50YCB3aWxsIGJlIHBvaW50aW5nIHRvd2FyZHMgYHRoaXMuYW5nbGUoKS5wZXJwZW5kaWN1bGFyKGZhbHNlKWAuXG4gICpcbiAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbG9ja3dpc2U9dHJ1ZV0gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlXG4gICogcGVycGVuZGljdWxhciBhbmdsZSBmcm9tIGBlbmRQb2ludCgpYFxuICAqIEBwYXJhbSB7P251bWJlcn0gW2xlbmd0aD1udWxsXSAtIFRoZSBsZW5ndGggb2YgdGhlIG5ldyBgU2VnbWVudGAsIG9yXG4gICogYG51bGxgIHRvIHVzZSBgdGhpcy5sZW5ndGhgXG4gICogQHJldHVybnMge1JhYy5TZWdtZW50fVxuICAqIEBzZWUgUmFjLkFuZ2xlI3BlcnBlbmRpY3VsYXJcbiAgKi9cbiAgbmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGNsb2Nrd2lzZSA9IHRydWUsIGxlbmd0aCA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBsZW5ndGggPT09IG51bGxcbiAgICAgID8gdGhpcy5sZW5ndGhcbiAgICAgIDogbGVuZ3RoO1xuICAgIGNvbnN0IG5ld1JheSA9IHRoaXMucmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZSh0aGlzLmxlbmd0aClcbiAgICAgIC5wZXJwZW5kaWN1bGFyKCFjbG9ja3dpc2UpO1xuICAgIHJldHVybiBuZXcgU2VnbWVudCh0aGlzLnJhYywgbmV3UmF5LCBuZXdMZW5ndGgpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTZWdtZW50YCBzdGFydGluZyBmcm9tIGBlbmRQb2ludCgpYCB3aGljaCBjb3JyZXNwb25kc1xuICAqIHRvIHRoZSBsZWcgb2YgYSByaWdodCB0cmlhbmdsZSB3aGVyZSBgdGhpc2AgaXMgdGhlIG90aGVyIGNhdGhldHVzIGFuZFxuICAqIHRoZSBoeXBvdGVudXNlIGlzIG9mIGxlbmd0aCBgaHlwb3RlbnVzZWAuXG4gICpcbiAgKiBUaGUgbmV3IGBTZWdtZW50YCB3aWxsIHBvaW50IHRvd2FyZHMgdGhlIHBlcnBlbmRpY3VsYXIgYW5nbGUgb2ZcbiAgKiBgW3RoaXMuYW5nbGUoKS5baW52ZXJzZSgpXXtAbGluayBSYWMuQW5nbGUjaW52ZXJzZX1gIGluIHRoZSBgY2xvY2t3aXNlYFxuICAqIG9yaWVudGF0aW9uLlxuICAqXG4gICogV2hlbiBgaHlwb3RlbnVzZWAgaXMgc21hbGxlciB0aGF0IHRoZSBzZWdtZW50J3MgYGxlbmd0aGAsIHJldHVybnNcbiAgKiBgbnVsbGAgc2luY2Ugbm8gcmlnaHQgdHJpYW5nbGUgaXMgcG9zc2libGUuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gaHlwb3RlbnVzZSAtIFRoZSBsZW5ndGggb2YgdGhlIGh5cG90ZW51c2Ugc2lkZSBvZiB0aGVcbiAgKiByaWdodCB0cmlhbmdsZSBmb3JtZWQgd2l0aCBgdGhpc2AgYW5kIHRoZSBuZXcgYFNlZ21lbnRgXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZVxuICAqIHBlcnBlbmRpY3VsYXIgYW5nbGUgZnJvbSBgZW5kUG9pbnQoKWBcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICogQHNlZSBSYWMuQW5nbGUjaW52ZXJzZVxuICAqL1xuICBuZXh0U2VnbWVudExlZ1dpdGhIeXAoaHlwb3RlbnVzZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGlmIChoeXBvdGVudXNlIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGNvcyA9IGFkeSAvIGh5cFxuICAgIGNvbnN0IHJhZGlhbnMgPSBNYXRoLmFjb3ModGhpcy5sZW5ndGggLyBoeXBvdGVudXNlKTtcbiAgICAvLyB0YW4gPSBvcHMgLyBhZGpcbiAgICAvLyB0YW4gKiBhZGogPSBvcHNcbiAgICBjb25zdCBvcHMgPSBNYXRoLnRhbihyYWRpYW5zKSAqIHRoaXMubGVuZ3RoO1xuICAgIHJldHVybiB0aGlzLm5leHRTZWdtZW50UGVycGVuZGljdWxhcihjbG9ja3dpc2UsIG9wcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYEFyY2AgYmFzZWQgb24gdGhpcyBzZWdtZW50LCB3aXRoIHRoZSBnaXZlbiBgZW5kQW5nbGVgXG4gICogYW5kIGBjbG9ja3dpc2VgIG9yaWVudGF0aW9uLlxuICAqXG4gICogVGhlIHJldHVybmVkIGBBcmNgIHdpbGwgdXNlIHRoaXMgc2VnbWVudCdzIHN0YXJ0IGFzIGBjZW50ZXJgLCBpdHMgYW5nbGVcbiAgKiBhcyBgc3RhcnRgLCBhbmQgaXRzIGxlbmd0aCBhcyBgcmFkaXVzYC5cbiAgKlxuICAqIFdoZW4gYGVuZEFuZ2xlYCBpcyBvbW1pdGVkIG9yIGBudWxsYCwgdGhlIHNlZ21lbnQncyBhbmdsZSBpcyB1c2VkXG4gICogaW5zdGVhZCByZXN1bHRpbmcgaW4gYSBjb21wbGV0ZS1jaXJjbGUgYXJjLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLkFuZ2xlfSBbZW5kQW5nbGU9bnVsbF0gLSBBbiBgQW5nbGVgIHRvIHVzZSBhcyBlbmQgZm9yIHRoZVxuICAqIG5ldyBgQXJjYCwgb3IgYG51bGxgIHRvIHVzZSBgdGhpcy5hbmdsZSgpYFxuICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Nsb2Nrd2lzZT10cnVlXSAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbmV3IGBBcmNgXG4gICogQHJldHVybnMge1JhYy5BcmN9XG4gICovXG4gIGFyYyhlbmRBbmdsZSA9IG51bGwsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgICBlbmRBbmdsZSA9IGVuZEFuZ2xlID09PSBudWxsXG4gICAgICA/IHRoaXMucmF5LmFuZ2xlXG4gICAgICA6IFJhYy5BbmdsZS5mcm9tKHRoaXMucmFjLCBlbmRBbmdsZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuQXJjKHRoaXMucmFjLFxuICAgICAgdGhpcy5yYXkuc3RhcnQsIHRoaXMubGVuZ3RoLFxuICAgICAgdGhpcy5yYXkuYW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQXJjYCBiYXNlZCBvbiB0aGlzIHNlZ21lbnQsIHdpdGggdGhlIGFyYydzIGVuZCBhdFxuICAqIGBhbmdsZURpc3RhbmNlYCBmcm9tIHRoZSBzZWdtZW50J3MgYW5nbGUgaW4gdGhlIGBjbG9ja3dpc2VgXG4gICogb3JpZW50YXRpb24uXG4gICpcbiAgKiBUaGUgcmV0dXJuZWQgYEFyY2Agd2lsbCB1c2UgdGhpcyBzZWdtZW50J3Mgc3RhcnQgYXMgYGNlbnRlcmAsIGl0cyBhbmdsZVxuICAqIGFzIGBzdGFydGAsIGFuZCBpdHMgbGVuZ3RoIGFzIGByYWRpdXNgLlxuICAqXG4gICogQHBhcmFtIHtSYWMuQW5nbGV8bnVtYmVyfSBhbmdsZURpc3RhbmNlIC0gVGhlIGFuZ2xlIGRpc3RhbmNlIGZyb20gdGhlXG4gICogc2VnbWVudCdzIHN0YXJ0IHRvIHRoZSBuZXcgYEFyY2AgZW5kXG4gICogQHBhcmFtIHtib29sZWFufSBbY2xvY2t3aXNlPXRydWVdIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSBuZXcgYEFyY2BcbiAgKiBAcmV0dXJucyB7UmFjLkFyY31cbiAgKi9cbiAgYXJjV2l0aEFuZ2xlRGlzdGFuY2UoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlID0gdHJ1ZSkge1xuICAgIGFuZ2xlRGlzdGFuY2UgPSB0aGlzLnJhYy5BbmdsZS5mcm9tKGFuZ2xlRGlzdGFuY2UpO1xuICAgIGNvbnN0IHN0YXJnQW5nbGUgPSB0aGlzLnJheS5hbmdsZTtcbiAgICBjb25zdCBlbmRBbmdsZSA9IHN0YXJnQW5nbGUuc2hpZnQoYW5nbGVEaXN0YW5jZSwgY2xvY2t3aXNlKTtcblxuICAgIHJldHVybiBuZXcgUmFjLkFyYyh0aGlzLnJhYyxcbiAgICAgIHRoaXMucmF5LnN0YXJ0LCB0aGlzLmxlbmd0aCxcbiAgICAgIHN0YXJnQW5nbGUsIGVuZEFuZ2xlLFxuICAgICAgY2xvY2t3aXNlKTtcbiAgfVxuXG5cbiAgLy8gVE9ETzogdW5jb21tZW50IG9uY2UgYmV6aWVycyBhcmUgdGVzdGVkIGFnYWluXG4gIC8vIGJlemllckNlbnRyYWxBbmNob3IoZGlzdGFuY2UsIGNsb2Nrd2lzZSA9IHRydWUpIHtcbiAgLy8gICBsZXQgYmlzZWN0b3IgPSB0aGlzLnNlZ21lbnRCaXNlY3RvcihkaXN0YW5jZSwgY2xvY2t3aXNlKTtcbiAgLy8gICByZXR1cm4gbmV3IFJhYy5CZXppZXIodGhpcy5yYWMsXG4gIC8vICAgICB0aGlzLnN0YXJ0LCBiaXNlY3Rvci5lbmQsXG4gIC8vICAgICBiaXNlY3Rvci5lbmQsIHRoaXMuZW5kKTtcbiAgLy8gfVxuXG5cbn0gLy8gU2VnbWVudFxuXG5cbm1vZHVsZS5leHBvcnRzID0gU2VnbWVudDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbnRhaW5zIHR3byBgW0NvbXBvc2l0ZV17QGxpbmsgUmFjLkNvbXBvc2l0ZX1gIG9iamVjdHM6IGBvdXRsaW5lYCBhbmRcbiogYGNvbnRvdXJgLlxuKlxuKiBVc2VkIGJ5IGBbUDVEcmF3ZXJde0BsaW5rIFJhYy5QNURyYXdlcn1gIHRvIGRyYXcgdGhlIGNvbXBvc2l0ZXMgYXMgYVxuKiBjb21wbGV4IHNoYXBlIChgb3V0bGluZWApIHdpdGggYW4gbmVnYXRpdmUgc3BhY2Ugc2hhcGUgaW5zaWRlIChgY29udG91cmApLlxuKlxuKiDimqDvuI8gVGhlIEFQSSBmb3IgU2hhcGUgaXMgKipwbGFubmVkIHRvIGNoYW5nZSoqIGluIGEgZnV0dXJlIG1pbm9yIHJlbGVhc2UuIOKaoO+4j1xuKlxuKiBAY2xhc3NcbiogQGFsaWFzIFJhYy5TaGFwZVxuKi9cbmZ1bmN0aW9uIFNoYXBlKHJhYykge1xuICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcblxuICB0aGlzLnJhYyA9IHJhYztcbiAgdGhpcy5vdXRsaW5lID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbiAgdGhpcy5jb250b3VyID0gbmV3IFJhYy5Db21wb3NpdGUocmFjKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXBlO1xuXG5cblNoYXBlLnByb3RvdHlwZS5hZGRPdXRsaW5lID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICB0aGlzLm91dGxpbmUuYWRkKGVsZW1lbnQpO1xufTtcblxuU2hhcGUucHJvdG90eXBlLmFkZENvbnRvdXIgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gIHRoaXMuY29udG91ci5hZGQoZWxlbWVudCk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogRm9ybWF0IGZvciBkcmF3aW5nIGEgYFtUZXh0XXtAbGluayBSYWMuVGV4dH1gIG9iamVjdC5cbipcbiogQGFsaWFzIFJhYy5UZXh0LkZvcm1hdFxuKi9cbmNsYXNzIFRleHRGb3JtYXQge1xuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnRcbiAgc3RhdGljIGhvcml6b250YWxBbGlnbiA9IHtcbiAgICBsZWZ0OiBcImxlZnRcIixcbiAgICBjZW50ZXI6IFwiaG9yaXpvbnRhbENlbnRlclwiLFxuICAgIHJpZ2h0OiBcInJpZ2h0XCJcbiAgfTtcblxuICAvLyBSRUxFQVNFLVRPRE86IGRvY3VtZW50XG4gIHN0YXRpYyB2ZXJ0aWNhbEFsaWduID0ge1xuICAgIHRvcDogXCJ0b3BcIixcbiAgICBib3R0b206IFwiYm90dG9tXCIsXG4gICAgY2VudGVyOiBcInZlcnRpY2FsQ2VudGVyXCIsXG4gICAgYmFzZWxpbmU6IFwiYmFzZWxpbmVcIlxuICB9O1xuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBkb2N1bWVudCAtIHRlc3RcbiAgY29uc3RydWN0b3IoXG4gICAgcmFjLFxuICAgIGhBbGlnbixcbiAgICB2QWxpZ24sXG4gICAgYW5nbGUgPSByYWMuQW5nbGUuemVybyxcbiAgICBmb250ID0gbnVsbCxcbiAgICBzaXplID0gbnVsbClcbiAge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhoQWxpZ24sIHZBbGlnbik7XG4gICAgdXRpbHMuYXNzZXJ0VHlwZShSYWMuQW5nbGUsIGFuZ2xlKTtcbiAgICBmb250ICE9PSBudWxsICYmIHV0aWxzLmFzc2VydFN0cmluZyhmb250KTtcbiAgICBzaXplICE9PSBudWxsICYmIHV0aWxzLmFzc2VydE51bWJlcihzaXplKTtcblxuICAgIHRoaXMucmFjID0gcmFjO1xuICAgIHRoaXMuaEFsaWduID0gaEFsaWduO1xuICAgIHRoaXMudkFsaWduID0gdkFsaWduO1xuICAgIHRoaXMuYW5nbGUgPSBhbmdsZTtcbiAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgZm9ybWF0IHRvIGRyYXcgdGV4dCBpbiB0aGUgc2FtZSBwb3NpdGlvbiBhcyBgc2VsZmAgd2l0aFxuICAvLyB0aGUgaW52ZXJzZSBhbmdsZS5cbiAgLy8gUkVMRUFTRS1UT0RPOiBkb2N1bWVudCAtIHRlc3RcbiAgaW52ZXJzZSgpIHtcbiAgICBsZXQgaEVudW0gPSBUZXh0Rm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgICBsZXQgdkVudW0gPSBUZXh0Rm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gICAgbGV0IGhBbGlnbiwgdkFsaWduO1xuICAgIHN3aXRjaCAodGhpcy5oQWxpZ24pIHtcbiAgICAgIGNhc2UgaEVudW0ubGVmdDogIGhBbGlnbiA9IGhFbnVtLnJpZ2h0OyBicmVhaztcbiAgICAgIGNhc2UgaEVudW0ucmlnaHQ6IGhBbGlnbiA9IGhFbnVtLmxlZnQ7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogICAgICAgICAgaEFsaWduID0gdGhpcy5oQWxpZ247IGJyZWFrO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMudkFsaWduKSB7XG4gICAgICBjYXNlIHZFbnVtLnRvcDogICAgdkFsaWduID0gdkVudW0uYm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgdkVudW0uYm90dG9tOiB2QWxpZ24gPSB2RW51bS50b3A7IGJyZWFrO1xuICAgICAgZGVmYXVsdDogICAgICAgICAgIHZBbGlnbiA9IHRoaXMudkFsaWduOyBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQoXG4gICAgICB0aGlzLnJhYyxcbiAgICAgIGhBbGlnbiwgdkFsaWduLFxuICAgICAgdGhpcy5hbmdsZS5pbnZlcnNlKCksXG4gICAgICB0aGlzLmZvbnQsXG4gICAgICB0aGlzLnNpemUpXG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgLSB0ZXN0XG4gIHdpdGhBbmdsZShuZXdBbmdsZSkge1xuICAgIG5ld0FuZ2xlID0gUmFjLkFuZ2xlLmZyb20odGhpcy5yYWMsIG5ld0FuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICBuZXdBbmdsZSxcbiAgICAgIHRoaXMuZm9udCxcbiAgICAgIHRoaXMuc2l6ZSk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgLSB0ZXN0XG4gIHdpdGhGb250KG5ld0ZvbnQpIHtcbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLFxuICAgICAgbmV3Rm9udCxcbiAgICAgIHRoaXMuc2l6ZSk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgLSB0ZXN0XG4gIHdpdGhTaXplKG5ld1NpemUpIHtcbiAgICByZXR1cm4gbmV3IFRleHRGb3JtYXQodGhpcy5yYWMsXG4gICAgICB0aGlzLmhBbGlnbiwgdGhpcy52QWxpZ24sXG4gICAgICB0aGlzLmFuZ2xlLFxuICAgICAgdGhpcy5mb250LFxuICAgICAgbmV3U2l6ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IFtkaWdpdHNdIC0gVGhlIG51bWJlciBvZiBkaWdpdHMgdG8gcHJpbnQgYWZ0ZXIgdGhlXG4gICogZGVjaW1hbCBwb2ludCwgd2hlbiBvbW1pdGVkIGFsbCBkaWdpdHMgYXJlIHByaW50ZWRcbiAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAqL1xuICB0b1N0cmluZyhkaWdpdHMgPSBudWxsKSB7XG4gICAgY29uc3QgYW5nbGVTdHIgPSB1dGlscy5jdXREaWdpdHModGhpcy5hbmdsZS50dXJuLCBkaWdpdHMpO1xuICAgIGNvbnN0IHNpemVTdHIgPSB0aGlzLnNpemUgPT09IG51bGxcbiAgICAgID8gXCJudWxsXCJcbiAgICAgIDogdXRpbHMuY3V0RGlnaXRzKHRoaXMuc2l6ZSwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFRleHQuRm9ybWF0KGhhOiR7dGhpcy5oQWxpZ259IHZhOiR7dGhpcy52QWxpZ259IGE6JHthbmdsZVN0cn0gZjoke3RoaXMuZm9udH0gczoke3NpemVTdHJ9KWA7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0Rm9ybWF0XG5cblxuLyoqXG4qIFN0cmluZywgZm9ybWF0LCBhbmQgcG9zaXRpb24gdG8gZHJhdyBhIHRleHQuXG4qIEBhbGlhcyBSYWMuVGV4dFxuKi9cbmNsYXNzIFRleHQge1xuXG4gIHN0YXRpYyBGb3JtYXQgPSBUZXh0Rm9ybWF0O1xuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgLSB0ZXN0XG4gIGNvbnN0cnVjdG9yKHJhYywgcG9pbnQsIHN0cmluZywgZm9ybWF0KSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYywgcG9pbnQsIHN0cmluZywgZm9ybWF0KTtcbiAgICB1dGlscy5hc3NlcnRUeXBlKFJhYy5Qb2ludCwgcG9pbnQpO1xuICAgIHV0aWxzLmFzc2VydFN0cmluZyhzdHJpbmcpO1xuICAgIHV0aWxzLmFzc2VydFR5cGUoVGV4dC5Gb3JtYXQsIGZvcm1hdCk7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5wb2ludCA9IHBvaW50O1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IGRvY3VtZW50IC0gdGVzdFxuICB3aXRoQW5nbGUobmV3QW5nbGUpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoQW5nbGUobmV3QW5nbGUpO1xuICAgIHJldHVybiBuZXcgVGV4dCh0aGlzLnJhYywgdGhpcy5wb2ludCwgdGhpcy5zdHJpbmcsIG5ld0Zvcm1hdCk7XG4gIH1cblxuXG4gIC8vIFJFTEVBU0UtVE9ETzogZG9jdW1lbnQgLSB0ZXN0XG4gIHdpdGhGb250KG5ld0ZvbnQpIHtcbiAgICBjb25zdCBuZXdGb3JtYXQgPSB0aGlzLmZvcm1hdC53aXRoRm9udChuZXdGb250KTtcbiAgICByZXR1cm4gbmV3IFRleHQodGhpcy5yYWMsIHRoaXMucG9pbnQsIHRoaXMuc3RyaW5nLCBuZXdGb3JtYXQpO1xuICB9XG5cblxuICAvLyBSRUxFQVNFLVRPRE86IGRvY3VtZW50IC0gdGVzdFxuICB3aXRoU2l6ZShuZXdTaXplKSB7XG4gICAgY29uc3QgbmV3Rm9ybWF0ID0gdGhpcy5mb3JtYXQud2l0aFNpemUobmV3U2l6ZSk7XG4gICAgcmV0dXJuIG5ldyBUZXh0KHRoaXMucmFjLCB0aGlzLnBvaW50LCB0aGlzLnN0cmluZywgbmV3Rm9ybWF0KTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbnRlbmRlZCBmb3IgaHVtYW4gY29uc3VtcHRpb24uXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gW2RpZ2l0c10gLSBUaGUgbnVtYmVyIG9mIGRpZ2l0cyB0byBwcmludCBhZnRlciB0aGVcbiAgKiBkZWNpbWFsIHBvaW50LCB3aGVuIG9tbWl0ZWQgYWxsIGRpZ2l0cyBhcmUgcHJpbnRlZFxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKGRpZ2l0cyA9IG51bGwpIHtcbiAgICBjb25zdCB4U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucG9pbnQueCwgZGlnaXRzKTtcbiAgICBjb25zdCB5U3RyID0gdXRpbHMuY3V0RGlnaXRzKHRoaXMucG9pbnQueSwgZGlnaXRzKTtcbiAgICByZXR1cm4gYFRleHQoKCR7eFN0cn0sJHt5U3RyfSkgXCIke3RoaXMuc3RyaW5nfVwiKWA7XG4gIH1cblxufSAvLyBjbGFzcyBUZXh0XG5cblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuQW5nbGVgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkFuZ2xlfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQW5nbGVcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY0FuZ2xlKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIFJldHVybnMgYW4gYEFuZ2xlYCBkZXJpdmVkIGZyb20gYHNvbWV0aGluZ2AuXG4gICpcbiAgKiBDYWxsc2B7QGxpbmsgUmFjLkFuZ2xlLmZyb219YCB1c2luZyBgdGhpc2AuXG4gICpcbiAgKiBAc2VlIFJhYy5BbmdsZS5mcm9tXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcnxSYWMuQW5nbGV8UmFjLlJheXxSYWMuU2VnbWVudH0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGFuIGBBbmdsZWAgZnJvbVxuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb20gPSBmdW5jdGlvbihzb21ldGhpbmcpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb20ocmFjLCBzb21ldGhpbmcpO1xuICB9O1xuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhbiBgQW5nbGVgIGRlcml2ZWQgZnJvbSBgcmFkaWFuc2AuXG4gICpcbiAgKiBDYWxscyBge0BsaW5rIFJhYy5BbmdsZS5mcm9tUmFkaWFuc31gIHVzaW5nIGB0aGlzYC5cbiAgKlxuICAqIEBzZWUgUmFjLkFuZ2xlLmZyb21SYWRpYW5zXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIFRoZSBtZWFzdXJlIG9mIHRoZSBhbmdsZSwgaW4gcmFkaWFuc1xuICAqIEByZXR1cm5zIHtSYWMuQW5nbGV9XG4gICpcbiAgKiBAZnVuY3Rpb24gZnJvbVJhZGlhbnNcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5mcm9tUmFkaWFucyA9IGZ1bmN0aW9uKHJhZGlhbnMpIHtcbiAgICByZXR1cm4gUmFjLkFuZ2xlLmZyb21SYWRpYW5zKHJhYywgcmFkaWFucyk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGBBbmdsZWAgZGVyaXZlZCBmcm9tIGBkZWdyZWVzYC5cbiAgKlxuICAqIENhbGxzIGB7QGxpbmsgUmFjLkFuZ2xlLmZyb21EZWdyZWVzfWAgdXNpbmcgYHRoaXNgLlxuICAqXG4gICogQHNlZSBSYWMuQW5nbGUuZnJvbURlZ3JlZXNcbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gVGhlIG1lYXN1cmUgb2YgdGhlIGFuZ2xlLCBpbiBkZWdyZWVzXG4gICogQHJldHVybnMge1JhYy5BbmdsZX1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tRGVncmVlc1xuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmZyb21EZWdyZWVzID0gZnVuY3Rpb24oZGVncmVlcykge1xuICAgIHJldHVybiBSYWMuQW5nbGUuZnJvbURlZ3JlZXMocmFjLCBkZWdyZWVzKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAwYC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGByaWdodGAsIGByYCwgYGVhc3RgLCBgZWAuXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS56ZXJvID0gcmFjLkFuZ2xlKDAuMCk7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMmAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgbGVmdGAsIGBsYCwgYHdlc3RgLCBgd2AsIGBpbnZlcnNlYC5cbiAgKlxuICAqIEBuYW1lIGhhbGZcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLmhhbGYgPSByYWMuQW5nbGUoMS8yKTtcbiAgcmFjLkFuZ2xlLmludmVyc2UgPSByYWMuQW5nbGUuaGFsZjtcblxuICAvKipcbiAgKiBBbiBgQW5nbGVgIHdpdGggdHVybiBgMS80YC5cbiAgKlxuICAqIEFsc28gbmFtZWQgYXM6IGBkb3duYCwgYGRgLCBgYm90dG9tYCwgYGJgLCBgc291dGhgLCBgc2AsIGBzcXVhcmVgLlxuICAqXG4gICogQG5hbWUgcXVhcnRlclxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUucXVhcnRlciA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUuc3F1YXJlID0gIHJhYy5BbmdsZS5xdWFydGVyO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGAxLzhgLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYGJvdHRvbVJpZ2h0YCwgYGJyYCwgYHNlYC5cbiAgKlxuICAqIEBuYW1lIGVpZ2h0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUuZWlnaHRoID0gIHJhYy5BbmdsZSgxLzgpO1xuXG4gIC8qKlxuICAqIEFuIGBBbmdsZWAgd2l0aCB0dXJuIGA3LzhgLCBuZWdhdGl2ZSBhbmdsZSBvZlxuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjZWlnaHRoIGVpZ2h0aH1gLlxuICAqXG4gICogQWxzbyBuYW1lZCBhczogYHRvcFJpZ2h0YCwgYHRyYCwgYG5lYC5cbiAgKlxuICAqIEBuYW1lIG5laWdodGhcbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BbmdsZSNcbiAgKi9cbiAgcmFjLkFuZ2xlLm5laWdodGggPSAgcmFjLkFuZ2xlKC0xLzgpO1xuXG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDEvMTZgLlxuICAqXG4gICogQG5hbWUgc2l4dGVlbnRoXG4gICogQHR5cGUge1JhYy5Qb2ludH1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQW5nbGUjXG4gICovXG4gIHJhYy5BbmdsZS5zaXh0ZWVudGggPSByYWMuQW5nbGUoMS8xNik7XG5cbiAgLyoqXG4gICogQW4gYEFuZ2xlYCB3aXRoIHR1cm4gYDMvNGAuXG4gICpcbiAgKiBBbHNvIG5hbWVkIGFzOiBgdXBgLCBgdWAsIGB0b3BgLCBgdGAuXG4gICpcbiAgKiBAbmFtZSBub3J0aFxuICAqIEB0eXBlIHtSYWMuUG9pbnR9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkFuZ2xlI1xuICAqL1xuICByYWMuQW5nbGUubm9ydGggPSByYWMuQW5nbGUoMy80KTtcbiAgcmFjLkFuZ2xlLmVhc3QgID0gcmFjLkFuZ2xlKDAvNCk7XG4gIHJhYy5BbmdsZS5zb3V0aCA9IHJhYy5BbmdsZSgxLzQpO1xuICByYWMuQW5nbGUud2VzdCAgPSByYWMuQW5nbGUoMi80KTtcblxuICByYWMuQW5nbGUuZSA9IHJhYy5BbmdsZS5lYXN0O1xuICByYWMuQW5nbGUucyA9IHJhYy5BbmdsZS5zb3V0aDtcbiAgcmFjLkFuZ2xlLncgPSByYWMuQW5nbGUud2VzdDtcbiAgcmFjLkFuZ2xlLm4gPSByYWMuQW5nbGUubm9ydGg7XG5cbiAgcmFjLkFuZ2xlLm5lID0gcmFjLkFuZ2xlLm4uYWRkKDEvOCk7XG4gIHJhYy5BbmdsZS5zZSA9IHJhYy5BbmdsZS5lLmFkZCgxLzgpO1xuICByYWMuQW5nbGUuc3cgPSByYWMuQW5nbGUucy5hZGQoMS84KTtcbiAgcmFjLkFuZ2xlLm53ID0gcmFjLkFuZ2xlLncuYWRkKDEvOCk7XG5cbiAgLy8gTm9ydGggbm9ydGgtZWFzdFxuICByYWMuQW5nbGUubm5lID0gcmFjLkFuZ2xlLm5lLmFkZCgtMS8xNik7XG4gIC8vIEVhc3Qgbm9ydGgtZWFzdFxuICByYWMuQW5nbGUuZW5lID0gcmFjLkFuZ2xlLm5lLmFkZCgrMS8xNik7XG4gIC8vIE5vcnRoLWVhc3Qgbm9ydGhcbiAgcmFjLkFuZ2xlLm5lbiA9IHJhYy5BbmdsZS5ubmU7XG4gIC8vIE5vcnRoLWVhc3QgZWFzdFxuICByYWMuQW5nbGUubmVlID0gcmFjLkFuZ2xlLmVuZTtcblxuICAvLyBFYXN0IHNvdXRoLWVhc3RcbiAgcmFjLkFuZ2xlLmVzZSA9IHJhYy5BbmdsZS5zZS5hZGQoLTEvMTYpO1xuICAvLyBTb3V0aCBzb3V0aC1lYXN0XG4gIHJhYy5BbmdsZS5zc2UgPSByYWMuQW5nbGUuc2UuYWRkKCsxLzE2KTtcbiAgLy8gU291dGgtZWFzdCBlYXN0XG4gIHJhYy5BbmdsZS5zZWUgPSByYWMuQW5nbGUuZXNlO1xuICAvLyBTb3V0aC1lYXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zZXMgPSByYWMuQW5nbGUuc3NlO1xuXG4gIC8vIFNvdXRoIHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLnNzdyA9IHJhYy5BbmdsZS5zdy5hZGQoLTEvMTYpO1xuICAvLyBXZXN0IHNvdXRoLXdlc3RcbiAgcmFjLkFuZ2xlLndzdyA9IHJhYy5BbmdsZS5zdy5hZGQoKzEvMTYpO1xuICAvLyBTb3V0aC13ZXN0IHNvdXRoXG4gIHJhYy5BbmdsZS5zd3MgPSByYWMuQW5nbGUuc3N3O1xuICAvLyBTb3V0aC13ZXN0IHdlc3RcbiAgcmFjLkFuZ2xlLnN3dyA9IHJhYy5BbmdsZS53c3c7XG5cbiAgLy8gV2VzdCBub3J0aC13ZXN0XG4gIHJhYy5BbmdsZS53bncgPSByYWMuQW5nbGUubncuYWRkKC0xLzE2KTtcbiAgLy8gTm9ydGggbm9ydGgtd2VzdFxuICByYWMuQW5nbGUubm53ID0gcmFjLkFuZ2xlLm53LmFkZCgrMS8xNik7XG4gIC8vIE5vcnQtaHdlc3Qgd2VzdFxuICByYWMuQW5nbGUubnd3ID0gcmFjLkFuZ2xlLndudztcbiAgLy8gTm9ydGgtd2VzdCBub3J0aFxuICByYWMuQW5nbGUubnduID0gcmFjLkFuZ2xlLm5udztcblxuICByYWMuQW5nbGUucmlnaHQgPSByYWMuQW5nbGUuZTtcbiAgcmFjLkFuZ2xlLmRvd24gID0gcmFjLkFuZ2xlLnM7XG4gIHJhYy5BbmdsZS5sZWZ0ICA9IHJhYy5BbmdsZS53O1xuICByYWMuQW5nbGUudXAgICAgPSByYWMuQW5nbGUubjtcblxuICByYWMuQW5nbGUuciA9IHJhYy5BbmdsZS5yaWdodDtcbiAgcmFjLkFuZ2xlLmQgPSByYWMuQW5nbGUuZG93bjtcbiAgcmFjLkFuZ2xlLmwgPSByYWMuQW5nbGUubGVmdDtcbiAgcmFjLkFuZ2xlLnUgPSByYWMuQW5nbGUudXA7XG5cbiAgcmFjLkFuZ2xlLnRvcCAgICA9IHJhYy5BbmdsZS51cDtcbiAgcmFjLkFuZ2xlLmJvdHRvbSA9IHJhYy5BbmdsZS5kb3duO1xuICByYWMuQW5nbGUudCAgICAgID0gcmFjLkFuZ2xlLnRvcDtcbiAgcmFjLkFuZ2xlLmIgICAgICA9IHJhYy5BbmdsZS5ib3R0b207XG5cbiAgcmFjLkFuZ2xlLnRvcFJpZ2h0ICAgID0gcmFjLkFuZ2xlLm5lO1xuICByYWMuQW5nbGUudHIgICAgICAgICAgPSByYWMuQW5nbGUubmU7XG4gIHJhYy5BbmdsZS50b3BMZWZ0ICAgICA9IHJhYy5BbmdsZS5udztcbiAgcmFjLkFuZ2xlLnRsICAgICAgICAgID0gcmFjLkFuZ2xlLm53O1xuICByYWMuQW5nbGUuYm90dG9tUmlnaHQgPSByYWMuQW5nbGUuc2U7XG4gIHJhYy5BbmdsZS5iciAgICAgICAgICA9IHJhYy5BbmdsZS5zZTtcbiAgcmFjLkFuZ2xlLmJvdHRvbUxlZnQgID0gcmFjLkFuZ2xlLnN3O1xuICByYWMuQW5nbGUuYmwgICAgICAgICAgPSByYWMuQW5nbGUuc3c7XG5cbn0gLy8gYXR0YWNoUmFjQW5nbGVcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkFyY2AgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuQXJjfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuQXJjXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNBcmMocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBjbG9ja3dpc2UgYEFyY2Agd2l0aCBhbGwgdmFsdWVzIHNldCB0byB6ZXJvLlxuICAqXG4gICogQG5hbWUgemVyb1xuICAqIEB0eXBlIHtSYWMuQXJjfVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5BcmMjXG4gICovXG4gIHJhYy5BcmMuemVybyA9IHJhYy5BcmMoMCwgMCwgMCwgMCwgMCwgdHJ1ZSk7XG5cbn0gLy8gYXR0YWNoUmFjQXJjXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5CZXppZXJgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkJlemllcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkJlemllclxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoSW5zdGFuY2VCZXppZXIocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgQmV6aWVyYCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5CZXppZXJ9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLkJlemllciNcbiAgKi9cbiAgcmFjLkJlemllci56ZXJvID0gcmFjLkJlemllcihcbiAgICAwLCAwLCAwLCAwLFxuICAgIDAsIDAsIDAsIDApO1xuXG59IC8vIGF0dGFjaEluc3RhbmNlQmV6aWVyXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5Qb2ludGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUG9pbnR9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5Qb2ludFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjUG9pbnQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIHdpdGggYWxsIHZhbHVlcyBzZXQgdG8gemVyby5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lnplcm8gPSByYWMuUG9pbnQoMCwgMCk7XG5cbiAgLyoqXG4gICogQSBgUG9pbnRgIGF0IGAoMCwgMClgLlxuICAqXG4gICogRXF1YWwgdG8gYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSBvcmlnaW5cbiAgKiBAdHlwZSB7UmFjLlBvaW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50Lm9yaWdpbiA9IHJhYy5Qb2ludC56ZXJvO1xuXG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlJheWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuUmF5fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuUmF5XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNSYXkocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cbiAgLyoqXG4gICogQSBgUmF5YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sIHN0YXJ0cyBhdFxuICAqIGB7QGxpbmsgaW5zdGFuY2UuUG9pbnQjemVyb31gIGFuZCBwb2ludHMgdG9cbiAgKiBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3plcm99YC5cbiAgKlxuICAqIEBuYW1lIHplcm9cbiAgKiBAdHlwZSB7UmFjLlJheX1cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuUmF5I1xuICAqIEBzZWUgaW5zdGFuY2UuUG9pbnQjemVyb1xuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjemVyb1xuICAqL1xuICByYWMuUmF5Lnplcm8gPSByYWMuUmF5KDAsIDAsIHJhYy5BbmdsZS56ZXJvKTtcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeC1heGlzLCBzdGFydHMgYXQgYHtAbGluayBpbnN0YW5jZS5Qb2ludCNvcmlnaW59YCBhbmRcbiAgKiBwb2ludHMgdG8gYHtAbGluayBpbnN0YW5jZS5BbmdsZSN6ZXJvfWAuXG4gICpcbiAgKiBFcXVhbCB0byBge0BsaW5rIGluc3RhbmNlLlJheSN6ZXJvfWAuXG4gICpcbiAgKiBAbmFtZSB4QXhpc1xuICAqIEB0eXBlIHtSYWMuUmF5fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5SYXkjXG4gICogQHNlZSBpbnN0YW5jZS5Qb2ludCNvcmlnaW5cbiAgKiBAc2VlIGluc3RhbmNlLkFuZ2xlI3plcm9cbiAgKi9cbiAgcmFjLlJheS54QXhpcyA9IHJhYy5SYXkuemVybztcblxuXG4gIC8qKlxuICAqIEEgYFJheWAgb3ZlciB0aGUgeS1heGlzLCBzdGFydHMgYXRge0BsaW5rIGluc3RhbmNlLlBvaW50I29yaWdpbn1gIGFuZFxuICAqIHBvaW50cyB0byBge0BsaW5rIGluc3RhbmNlLkFuZ2xlI3F1YXJ0ZXJ9YC5cbiAgKlxuICAqIEBuYW1lIHlBeGlzXG4gICogQHR5cGUge1JhYy5SYXl9XG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlJheSNcbiAgKiBAc2VlIGluc3RhbmNlLlBvaW50I29yaWdpblxuICAqIEBzZWUgaW5zdGFuY2UuQW5nbGUjcXVhcnRlclxuICAqL1xuICByYWMuUmF5LnlBeGlzID0gcmFjLlJheSgwLCAwLCByYWMuQW5nbGUucXVhcnRlcik7XG5cbn0gLy8gYXR0YWNoUmFjUmF5XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiogVGhlIGBpbnN0YW5jZS5TZWdtZW50YCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5TZWdtZW50fWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU2VnbWVudFxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmFjU2VnbWVudChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBTZWdtZW50YCB3aXRoIGFsbCB2YWx1ZXMgc2V0IHRvIHplcm8sICwgc3RhcnRzIGF0XG4gICogYHtAbGluayBpbnN0YW5jZS5Qb2ludCN6ZXJvfWAsIHBvaW50cyB0b1xuICAqIGB7QGxpbmsgaW5zdGFuY2UuQW5nbGUjemVyb31gLCBhbmQgaGFzIGEgbGVuZ3RoIG9mIHplcm8uXG4gICpcbiAgKiBAbmFtZSB6ZXJvXG4gICogQHR5cGUge1JhYy5TZWdtZW50fVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC56ZXJvID0gcmFjLlNlZ21lbnQoMCwgMCwgMCwgMCk7XG5cbn0gLy8gYXR0YWNoUmFjU2VnbWVudFxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5cblxuLyoqXG4qIFRoZSBgaW5zdGFuY2UuVGV4dGAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuVGV4dH1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLlRleHRcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFJhY1RleHQocmFjKSB7XG4gIC8vIEludGVuZGVkIHRvIHJlY2VpdmUgYSBSYWMgaW5zdGFuY2UgYXMgcGFyYW1ldGVyXG5cblxuICAvLyBSRUxFQVNFLVRPRE86IGRvY3VtZW50IC0gdGVzdFxuICByYWMuVGV4dC5Gb3JtYXQgPSBmdW5jdGlvbihcbiAgICBoQWxpZ24sXG4gICAgdkFsaWduLFxuICAgIGFuZ2xlID0gcmFjLkFuZ2xlLnplcm8sXG4gICAgZm9udCA9IG51bGwsXG4gICAgc2l6ZSA9IG51bGwpXG4gIHtcbiAgICBhbmdsZSA9IHJhYy5BbmdsZS5mcm9tKGFuZ2xlKTtcbiAgICByZXR1cm4gbmV3IFJhYy5UZXh0LkZvcm1hdChcbiAgICAgIHJhYyxcbiAgICAgIGhBbGlnbiwgdkFsaWduLFxuICAgICAgYW5nbGUsIGZvbnQsIHNpemUpO1xuICB9O1xuXG5cbiAgLy8gUkVMRUFTRS1UT0RPOiBkb2N1bWVudCAtIHRlc3RcbiAgcmFjLlRleHQuRm9ybWF0LnRvcExlZnQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5sZWZ0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLnRvcCk7XG5cbiAgcmFjLlRleHQuRm9ybWF0LnRvcFJpZ2h0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ucmlnaHQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24udG9wKTtcblxuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyTGVmdCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uY2VudGVyKTtcblxuICByYWMuVGV4dC5Gb3JtYXQuY2VudGVyUmlnaHQgPSByYWMuVGV4dC5Gb3JtYXQoXG4gICAgUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbi5yaWdodCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIpO1xuXG4gIHJhYy5UZXh0LkZvcm1hdC5ib3R0b21MZWZ0ID0gcmFjLlRleHQuRm9ybWF0KFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5ib3R0b20pO1xuXG4gIHJhYy5UZXh0LkZvcm1hdC5ib3R0b21SaWdodCA9IHJhYy5UZXh0LkZvcm1hdChcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLnJpZ2h0LFxuICAgIFJhYy5UZXh0LkZvcm1hdC52ZXJ0aWNhbEFsaWduLmJvdHRvbSk7XG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgYGhlbGxvIHdvcmxkYCB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXRcbiAgKiBgUG9pbnQuemVyb2AuXG4gICogQG5hbWUgaGVsbG9cbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuVGV4dCNcbiAgKi9cbiAgcmFjLlRleHQuaGVsbG8gPSByYWMuVGV4dCgwLCAwLCAnaGVsbG8gd29ybGQhJyxcbiAgICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCk7XG5cbiAgLyoqXG4gICogQSBgVGV4dGAgZm9yIGRyYXdpbmcgdGhlIHBhbmdyYW0gYHNwaGlueCBvZiBibGFjayBxdWFydHosIGp1ZGdlIG15IHZvd2BcbiAgKiB3aXRoIGB0b3BMZWZ0YCBmb3JtYXQgYXQgYFBvaW50Lnplcm9gLlxuICAqIEBuYW1lIHNwaGlueFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5UZXh0I1xuICAqL1xuICByYWMuVGV4dC5zcGhpbnggPSByYWMuVGV4dCgwLCAwLCAnc3BoaW54IG9mIGJsYWNrIHF1YXJ0eiwganVkZ2UgbXkgdm93JyxcbiAgICByYWMuVGV4dC5Gb3JtYXQudG9wTGVmdCk7XG5cbn0gLy8gYXR0YWNoUmFjUG9pbnRcblxuIiwiXG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvdGVtcGxhdGVzL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FtZGpzL2FtZGpzLWFwaS9ibG9iL21hc3Rlci9BTUQubWRcbiAgICAvLyBodHRwczovL3JlcXVpcmVqcy5vcmcvZG9jcy93aHlhbWQuaHRtbFxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblxuICAgIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBmb3IgQU1EIC0gZGVmaW5lOiR7dHlwZW9mIGRlZmluZX1gKTtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cblxuICAgIC8vIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJBQyBmb3IgTm9kZSAtIG1vZHVsZToke3R5cGVvZiBtb2R1bGV9YCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcblxuICAvLyBjb25zb2xlLmxvZyhgTG9hZGluZyBSQUMgaW50byBzZWxmIC0gcm9vdDoke3R5cGVvZiByb290fWApO1xuICByb290LlJhYyA9IGZhY3RvcnkoKTtcblxufSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiByZXF1aXJlKCcuL1JhYycpO1xuXG59KSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBEcmF3ZXIgdGhhdCB1c2VzIGEgW1A1XShodHRwczovL3A1anMub3JnLykgaW5zdGFuY2UgZm9yIGFsbCBkcmF3aW5nXG4qIG9wZXJhdGlvbnMuXG4qXG4qIEBhbGlhcyBSYWMuUDVEcmF3ZXJcbiovXG5jbGFzcyBQNURyYXdlciB7XG5cbiAgY29uc3RydWN0b3IocmFjLCBwNSl7XG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5wNSA9IHA1O1xuICAgIHRoaXMuZHJhd1JvdXRpbmVzID0gW107XG4gICAgdGhpcy5kZWJ1Z1JvdXRpbmVzID0gW107XG4gICAgdGhpcy5hcHBseVJvdXRpbmVzID0gW107XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHVzZWQgZm9yIGRlYnVnIGRyYXdpbmcsIHdoZW4gYG51bGxgIHRoZSBzdHlsZSBhbHJlYWR5IGFwcGxpZWRcbiAgICAqIGlzIHVzZWQuXG4gICAgKlxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdTdHlsZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAqIFN0eWxlIHVzZWQgZm9yIHRleHQgZm9yIGRlYnVnIGRyYXdpbmcsIHdoZW4gYG51bGxgIHRoZSBzdHlsZSBhbHJlYWR5XG4gICAgKiBhcHBsaWVkIGlzIHVzZWQuXG4gICAgKlxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdUZXh0U3R5bGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgKiBPYmplY3Qgd2l0aCBvcHRpb25zIHVzZWQgYnkgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2ZcbiAgICAqIGBkcmF3YWJsZS5kZWJ1ZygpYC5cbiAgICAqXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z1RleHRPcHRpb25zID0ge1xuICAgICAgZm9udDogJ21vbm9zcGFjZScsXG4gICAgICBzaXplOiByYWMudGV4dEZvcm1hdERlZmF1bHRzLnNpemUsXG4gICAgICBmaXhlZERpZ2l0czogMlxuICAgIH07XG5cbiAgICAvKipcbiAgICAqIFJhZGl1cyBvZiBwb2ludCBtYXJrZXJzIGZvciBkZWJ1ZyBkcmF3aW5nLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuZGVidWdQb2ludFJhZGl1cyA9IDQ7XG5cbiAgICAvKipcbiAgICAqIFJhZGl1cyBvZiB0aGUgbWFpbiB2aXN1YWwgZWxlbWVudHMgZm9yIGRlYnVnIGRyYXdpbmcuXG4gICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICovXG4gICAgdGhpcy5kZWJ1Z01hcmtlclJhZGl1cyA9IDIyO1xuXG4gICAgLyoqXG4gICAgKiBGYWN0b3IgYXBwbGllZCB0byBzdHJva2Ugd2VpZ2h0IHNldHRpbmcuIFN0cm9rZSB3ZWlnaHQgaXMgc2V0IHRvXG4gICAgKiBgc3Ryb2tlLndlaWdodCAqIHN0cm9rZVdlaWdodEZhY3RvcmAgd2hlbiBhcHBsaWNhYmxlLlxuICAgICpcbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKiBAZGVmYXVsdCAxXG4gICAgKi9cbiAgICB0aGlzLnN0cm9rZVdlaWdodEZhY3RvciA9IDE7XG5cbiAgICB0aGlzLnNldHVwQWxsRHJhd0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpO1xuICAgIHRoaXMuc2V0dXBBbGxBcHBseUZ1bmN0aW9ucygpO1xuICAgIC8vIFRPRE86IGFkZCBhIGN1c3RvbWl6ZWQgZnVuY3Rpb24gZm9yIG5ldyBjbGFzc2VzIVxuICB9XG5cbiAgLy8gQWRkcyBhIERyYXdSb3V0aW5lIGZvciB0aGUgZ2l2ZW4gY2xhc3MuXG4gIHNldERyYXdGdW5jdGlvbihjbGFzc09iaiwgZHJhd0Z1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kSW5kZXgocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG5cbiAgICBsZXQgcm91dGluZTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByb3V0aW5lID0gbmV3IERyYXdSb3V0aW5lKGNsYXNzT2JqLCBkcmF3RnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNbaW5kZXhdO1xuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24gPSBkcmF3RnVuY3Rpb247XG4gICAgICAvLyBEZWxldGUgcm91dGluZVxuICAgICAgdGhpcy5kcmF3Um91dGluZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cbiAgc2V0RHJhd09wdGlvbnMoY2xhc3NPYmosIG9wdGlvbnMpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuZHJhd1JvdXRpbmVzXG4gICAgICAuZmluZChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgQ2Fubm90IGZpbmQgcm91dGluZSBmb3IgY2xhc3MgLSBjbGFzc05hbWU6JHtjbGFzc09iai5uYW1lfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVxdWlyZXNQdXNoUG9wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJvdXRpbmUucmVxdWlyZXNQdXNoUG9wID0gb3B0aW9ucy5yZXF1aXJlc1B1c2hQb3A7XG4gICAgfVxuICB9XG5cbiAgc2V0Q2xhc3NEcmF3U3R5bGUoY2xhc3NPYmosIHN0eWxlKSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRyYXdSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiByb3V0aW5lLmNsYXNzT2JqID09PSBjbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5sb2coYENhbm5vdCBmaW5kIHJvdXRpbmUgZm9yIGNsYXNzIC0gY2xhc3NOYW1lOiR7Y2xhc3NPYmoubmFtZX1gKTtcbiAgICAgIHRocm93IFJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIHJvdXRpbmUuc3R5bGUgPSBzdHlsZTtcbiAgfVxuXG4gIC8vIEFkZHMgYSBEZWJ1Z1JvdXRpbmUgZm9yIHRoZSBnaXZlbiBjbGFzcy5cbiAgc2V0RGVidWdGdW5jdGlvbihjbGFzc09iaiwgZGVidWdGdW5jdGlvbikge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZGVidWdSb3V0aW5lc1xuICAgICAgLmZpbmRJbmRleChyb3V0aW5lID0+IHJvdXRpbmUuY2xhc3NPYmogPT09IGNsYXNzT2JqKTtcblxuICAgIGxldCByb3V0aW5lO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJvdXRpbmUgPSBuZXcgRGVidWdSb3V0aW5lKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZSA9IHRoaXMuZGVidWdSb3V0aW5lc1tpbmRleF07XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24gPSBkZWJ1Z0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuZGVidWdSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuZGVidWdSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cbiAgLy8gQWRkcyBhIEFwcGx5Um91dGluZSBmb3IgdGhlIGdpdmVuIGNsYXNzLlxuICBzZXRBcHBseUZ1bmN0aW9uKGNsYXNzT2JqLCBhcHBseUZ1bmN0aW9uKSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5hcHBseVJvdXRpbmVzXG4gICAgICAuZmluZEluZGV4KHJvdXRpbmUgPT4gcm91dGluZS5jbGFzc09iaiA9PT0gY2xhc3NPYmopO1xuXG4gICAgbGV0IHJvdXRpbmU7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcm91dGluZSA9IG5ldyBBcHBseVJvdXRpbmUoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0aW5lID0gdGhpcy5hcHBseVJvdXRpbmVzW2luZGV4XTtcbiAgICAgIHJvdXRpbmUuZHJhd0Z1bmN0aW9uID0gZHJhd0Z1bmN0aW9uO1xuICAgICAgLy8gRGVsZXRlIHJvdXRpbmVcbiAgICAgIHRoaXMuYXBwbHlSb3V0aW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbHlSb3V0aW5lcy5wdXNoKHJvdXRpbmUpO1xuICB9XG5cbiAgZHJhd09iamVjdChvYmplY3QsIHN0eWxlID0gbnVsbCkge1xuICAgIGxldCByb3V0aW5lID0gdGhpcy5kcmF3Um91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS50cmFjZShgQ2Fubm90IGRyYXcgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0RyYXc7XG4gICAgfVxuXG4gICAgaWYgKHJvdXRpbmUucmVxdWlyZXNQdXNoUG9wID09PSB0cnVlXG4gICAgICB8fCBzdHlsZSAhPT0gbnVsbFxuICAgICAgfHwgcm91dGluZS5zdHlsZSAhPT0gbnVsbClcbiAgICB7XG4gICAgICB0aGlzLnA1LnB1c2goKTtcbiAgICAgIGlmIChyb3V0aW5lLnN0eWxlICE9PSBudWxsKSB7XG4gICAgICAgIHJvdXRpbmUuc3R5bGUuYXBwbHkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBzdHlsZS5hcHBseSgpO1xuICAgICAgfVxuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgICAgIHRoaXMucDUucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHB1c2gtcHVsbFxuICAgICAgcm91dGluZS5kcmF3RnVuY3Rpb24odGhpcywgb2JqZWN0KTtcbiAgICB9XG4gIH1cblxuXG4gIGRlYnVnT2JqZWN0KG9iamVjdCwgZHJhd3NUZXh0KSB7XG4gICAgbGV0IHJvdXRpbmUgPSB0aGlzLmRlYnVnUm91dGluZXNcbiAgICAgIC5maW5kKHJvdXRpbmUgPT4gb2JqZWN0IGluc3RhbmNlb2Ygcm91dGluZS5jbGFzc09iaik7XG4gICAgaWYgKHJvdXRpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gTm8gcm91dGluZSwganVzdCBkcmF3IG9iamVjdCB3aXRoIGRlYnVnIHN0eWxlXG4gICAgICB0aGlzLmRyYXdPYmplY3Qob2JqZWN0LCB0aGlzLmRlYnVnU3R5bGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlYnVnU3R5bGUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucDUucHVzaCgpO1xuICAgICAgdGhpcy5kZWJ1Z1N0eWxlLmFwcGx5KCk7XG4gICAgICByb3V0aW5lLmRlYnVnRnVuY3Rpb24odGhpcywgb2JqZWN0LCBkcmF3c1RleHQpO1xuICAgICAgdGhpcy5wNS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGluZS5kZWJ1Z0Z1bmN0aW9uKHRoaXMsIG9iamVjdCwgZHJhd3NUZXh0KTtcbiAgICB9XG4gIH1cblxuICBhcHBseU9iamVjdChvYmplY3QpIHtcbiAgICBsZXQgcm91dGluZSA9IHRoaXMuYXBwbHlSb3V0aW5lc1xuICAgICAgLmZpbmQocm91dGluZSA9PiBvYmplY3QgaW5zdGFuY2VvZiByb3V0aW5lLmNsYXNzT2JqKTtcbiAgICBpZiAocm91dGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLnRyYWNlKGBDYW5ub3QgYXBwbHkgb2JqZWN0IC0gb2JqZWN0LXR5cGU6JHt1dGlscy50eXBlTmFtZShvYmplY3QpfWApO1xuICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RUb0FwcGx5O1xuICAgIH1cblxuICAgIHJvdXRpbmUuYXBwbHlGdW5jdGlvbih0aGlzLCBvYmplY3QpO1xuICB9XG5cbiAgLy8gU2V0cyB1cCBhbGwgZHJhd2luZyByb3V0aW5lcyBmb3IgcmFjIGRyYXdhYmxlIGNsYXNlcy5cbiAgLy8gQWxzbyBhdHRhY2hlcyBhZGRpdGlvbmFsIHByb3RvdHlwZSBhbmQgc3RhdGljIGZ1bmN0aW9ucyBpbiByZWxldmFudFxuICAvLyBjbGFzc2VzLlxuICBzZXR1cEFsbERyYXdGdW5jdGlvbnMoKSB7XG4gICAgbGV0IGZ1bmN0aW9ucyA9IHJlcXVpcmUoJy4vZHJhdy5mdW5jdGlvbnMnKTtcblxuICAgIC8vIFBvaW50XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlBvaW50LCBmdW5jdGlvbnMuZHJhd1BvaW50KTtcbiAgICByZXF1aXJlKCcuL1BvaW50LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIFJheVxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5SYXksIGZ1bmN0aW9ucy5kcmF3UmF5KTtcbiAgICByZXF1aXJlKCcuL1JheS5mdW5jdGlvbnMnKSh0aGlzLnJhYyk7XG5cbiAgICAvLyBTZWdtZW50XG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLlNlZ21lbnQsIGZ1bmN0aW9ucy5kcmF3U2VnbWVudCk7XG4gICAgcmVxdWlyZSgnLi9TZWdtZW50LmZ1bmN0aW9ucycpKHRoaXMucmFjKTtcblxuICAgIC8vIEFyY1xuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5BcmMsIGZ1bmN0aW9ucy5kcmF3QXJjKTtcblxuICAgIFJhYy5BcmMucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGFuZ2xlRGlzdGFuY2UgPSB0aGlzLmFuZ2xlRGlzdGFuY2UoKTtcbiAgICAgIGxldCBiZXppZXJzUGVyVHVybiA9IDU7XG4gICAgICBsZXQgZGl2aXNpb25zID0gTWF0aC5jZWlsKGFuZ2xlRGlzdGFuY2UudHVybk9uZSgpICogYmV6aWVyc1BlclR1cm4pO1xuICAgICAgdGhpcy5kaXZpZGVUb0JlemllcnMoZGl2aXNpb25zKS52ZXJ0ZXgoKTtcbiAgICB9O1xuXG4gICAgLy8gQmV6aWVyXG4gICAgdGhpcy5zZXREcmF3RnVuY3Rpb24oUmFjLkJlemllciwgKGRyYXdlciwgYmV6aWVyKSA9PiB7XG4gICAgICBkcmF3ZXIucDUuYmV6aWVyKFxuICAgICAgICBiZXppZXIuc3RhcnQueCwgYmV6aWVyLnN0YXJ0LnksXG4gICAgICAgIGJlemllci5zdGFydEFuY2hvci54LCBiZXppZXIuc3RhcnRBbmNob3IueSxcbiAgICAgICAgYmV6aWVyLmVuZEFuY2hvci54LCBiZXppZXIuZW5kQW5jaG9yLnksXG4gICAgICAgIGJlemllci5lbmQueCwgYmV6aWVyLmVuZC55KTtcbiAgICB9KTtcblxuICAgIFJhYy5CZXppZXIucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zdGFydC52ZXJ0ZXgoKVxuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmJlemllclZlcnRleChcbiAgICAgICAgdGhpcy5zdGFydEFuY2hvci54LCB0aGlzLnN0YXJ0QW5jaG9yLnksXG4gICAgICAgIHRoaXMuZW5kQW5jaG9yLngsIHRoaXMuZW5kQW5jaG9yLnksXG4gICAgICAgIHRoaXMuZW5kLngsIHRoaXMuZW5kLnkpO1xuICAgIH07XG5cbiAgICAvLyBDb21wb3NpdGVcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuQ29tcG9zaXRlLCAoZHJhd2VyLCBjb21wb3NpdGUpID0+IHtcbiAgICAgIGNvbXBvc2l0ZS5zZXF1ZW5jZS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kcmF3KCkpO1xuICAgIH0pO1xuXG4gICAgUmFjLkNvbXBvc2l0ZS5wcm90b3R5cGUudmVydGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnNlcXVlbmNlLmZvckVhY2goaXRlbSA9PiBpdGVtLnZlcnRleCgpKTtcbiAgICB9O1xuXG4gICAgLy8gU2hhcGVcbiAgICB0aGlzLnNldERyYXdGdW5jdGlvbihSYWMuU2hhcGUsIChkcmF3ZXIsIHNoYXBlKSA9PiB7XG4gICAgICBkcmF3ZXIucDUuYmVnaW5TaGFwZSgpO1xuICAgICAgc2hhcGUub3V0bGluZS52ZXJ0ZXgoKTtcblxuICAgICAgaWYgKHNoYXBlLmNvbnRvdXIuaXNOb3RFbXB0eSgpKSB7XG4gICAgICAgIGRyYXdlci5wNS5iZWdpbkNvbnRvdXIoKTtcbiAgICAgICAgc2hhcGUuY29udG91ci52ZXJ0ZXgoKTtcbiAgICAgICAgZHJhd2VyLnA1LmVuZENvbnRvdXIoKTtcbiAgICAgIH1cbiAgICAgIGRyYXdlci5wNS5lbmRTaGFwZSgpO1xuICAgIH0pO1xuXG4gICAgUmFjLlNoYXBlLnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub3V0bGluZS52ZXJ0ZXgoKTtcbiAgICAgIHRoaXMuY29udG91ci52ZXJ0ZXgoKTtcbiAgICB9O1xuXG4gICAgLy8gVGV4dFxuICAgIHRoaXMuc2V0RHJhd0Z1bmN0aW9uKFJhYy5UZXh0LCAoZHJhd2VyLCB0ZXh0KSA9PiB7XG4gICAgICB0ZXh0LmZvcm1hdC5hcHBseSh0ZXh0LnBvaW50KTtcbiAgICAgIGRyYXdlci5wNS50ZXh0KHRleHQuc3RyaW5nLCAwLCAwKTtcbiAgICB9KTtcbiAgICAvLyBgdGV4dC5mb3JtYXQuYXBwbHlgIG1ha2VzIHRyYW5zbGF0ZSBhbmQgcm90YXRpb24gbW9kaWZpY2F0aW9ucyB0b1xuICAgIC8vIHRoZSBkcmF3aW5nIG1hdHJpeCwgdGhpcyByZXF1aXJlcyBhIHB1c2gtcG9wIG9uIGV2ZXJ5IGRyYXdcbiAgICB0aGlzLnNldERyYXdPcHRpb25zKFJhYy5UZXh0LCB7cmVxdWlyZXNQdXNoUG9wOiB0cnVlfSk7XG4gIH0gLy8gc2V0dXBBbGxEcmF3RnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBkZWJ1ZyByb3V0aW5lcyBmb3IgcmFjIGRyYXdhYmxlIGNsYXNlcy5cbiAgc2V0dXBBbGxEZWJ1Z0Z1bmN0aW9ucygpIHtcbiAgICBsZXQgZnVuY3Rpb25zID0gcmVxdWlyZSgnLi9kZWJ1Zy5mdW5jdGlvbnMnKTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLlBvaW50LCBmdW5jdGlvbnMuZGVidWdQb2ludCk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5SYXksIGZ1bmN0aW9ucy5kZWJ1Z1JheSk7XG4gICAgdGhpcy5zZXREZWJ1Z0Z1bmN0aW9uKFJhYy5TZWdtZW50LCBmdW5jdGlvbnMuZGVidWdTZWdtZW50KTtcbiAgICB0aGlzLnNldERlYnVnRnVuY3Rpb24oUmFjLkFyYywgZnVuY3Rpb25zLmRlYnVnQXJjKTtcblxuICAgIFJhYy5BbmdsZS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbihwb2ludCwgZHJhd3NUZXh0ID0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IGRyYXdlciA9IHRoaXMucmFjLmRyYXdlcjtcbiAgICAgIGlmIChkcmF3ZXIuZGVidWdTdHlsZSAhPT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUucHVzaCgpO1xuICAgICAgICBkcmF3ZXIuZGVidWdTdHlsZS5hcHBseSgpO1xuICAgICAgICAvLyBUT0RPOiBjb3VsZCB0aGlzIGJlIGEgZ29vZCBvcHRpb24gdG8gaW1wbGVtZW50IHNwbGF0dGluZyBhcmd1bWVudHNcbiAgICAgICAgLy8gaW50byB0aGUgZGVidWdGdW5jdGlvbj9cbiAgICAgICAgZnVuY3Rpb25zLmRlYnVnQW5nbGUoZHJhd2VyLCB0aGlzLCBwb2ludCwgZHJhd3NUZXh0KTtcbiAgICAgICAgZHJhd2VyLnA1LnBvcCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVuY3Rpb25zLmRlYnVnQW5nbGUoZHJhd2VyLCB0aGlzLCBwb2ludCwgZHJhd3NUZXh0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBSYWMuUG9pbnQucHJvdG90eXBlLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihhbmdsZSwgZHJhd3NUZXh0ID0gZmFsc2UpIHtcbiAgICAgIGFuZ2xlID0gdGhpcy5yYWMuQW5nbGUuZnJvbShhbmdsZSk7XG4gICAgICBhbmdsZS5kZWJ1Zyh0aGlzLCBkcmF3c1RleHQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfSAvLyBzZXR1cEFsbERlYnVnRnVuY3Rpb25zXG5cblxuICAvLyBTZXRzIHVwIGFsbCBhcHBseWluZyByb3V0aW5lcyBmb3IgcmFjIHN0eWxlIGNsYXNlcy5cbiAgLy8gQWxzbyBhdHRhY2hlcyBhZGRpdGlvbmFsIHByb3RvdHlwZSBmdW5jdGlvbnMgaW4gcmVsZXZhbnQgY2xhc3Nlcy5cbiAgc2V0dXBBbGxBcHBseUZ1bmN0aW9ucygpIHtcbiAgICAvLyBDb2xvciBwcm90b3R5cGUgZnVuY3Rpb25zXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseUJhY2tncm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS5iYWNrZ3JvdW5kKHRoaXMuciAqIDI1NSwgdGhpcy5nICogMjU1LCB0aGlzLmIgKiAyNTUpO1xuICAgIH07XG5cbiAgICBSYWMuQ29sb3IucHJvdG90eXBlLmFwcGx5RmlsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LmZpbGwodGhpcy5yICogMjU1LCB0aGlzLmcgKiAyNTUsIHRoaXMuYiAqIDI1NSwgdGhpcy5hICogMjU1KTtcbiAgICB9O1xuXG4gICAgUmFjLkNvbG9yLnByb3RvdHlwZS5hcHBseVN0cm9rZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnN0cm9rZSh0aGlzLnIgKiAyNTUsIHRoaXMuZyAqIDI1NSwgdGhpcy5iICogMjU1LCB0aGlzLmEgKiAyNTUpO1xuICAgIH07XG5cbiAgICAvLyBTdHJva2VcbiAgICB0aGlzLnNldEFwcGx5RnVuY3Rpb24oUmFjLlN0cm9rZSwgKGRyYXdlciwgc3Ryb2tlKSA9PiB7XG4gICAgICBpZiAoc3Ryb2tlLndlaWdodCA9PT0gbnVsbCAmJiBzdHJva2UuY29sb3IgPT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1Lm5vU3Ryb2tlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cm9rZS5jb2xvciAhPT0gbnVsbCkge1xuICAgICAgICBzdHJva2UuY29sb3IuYXBwbHlTdHJva2UoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cm9rZS53ZWlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgZHJhd2VyLnA1LnN0cm9rZVdlaWdodChzdHJva2Uud2VpZ2h0ICogZHJhd2VyLnN0cm9rZVdlaWdodEZhY3Rvcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBGaWxsXG4gICAgdGhpcy5zZXRBcHBseUZ1bmN0aW9uKFJhYy5GaWxsLCAoZHJhd2VyLCBmaWxsKSA9PiB7XG4gICAgICBpZiAoZmlsbC5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3ZXIucDUubm9GaWxsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZmlsbC5jb2xvci5hcHBseUZpbGwoKTtcbiAgICB9KTtcblxuICAgIC8vIFN0eWxlQ29udGFpbmVyXG4gICAgdGhpcy5zZXRBcHBseUZ1bmN0aW9uKFJhYy5TdHlsZUNvbnRhaW5lciwgKGRyYXdlciwgY29udGFpbmVyKSA9PiB7XG4gICAgICBjb250YWluZXIuc3R5bGVzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGl0ZW0uYXBwbHkoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVGV4dC5Gb3JtYXRcbiAgICAvLyBBcHBsaWVzIGFsbCB0ZXh0IHByb3BlcnRpZXMgYW5kIHRyYW5zbGF0ZXMgdG8gdGhlIGdpdmVuIGBwb2ludGAuXG4gICAgLy8gQWZ0ZXIgdGhlIGZvcm1hdCBpcyBhcHBsaWVkIHRoZSB0ZXh0IHNob3VsZCBiZSBkcmF3biBhdCB0aGUgb3JpZ2luLlxuICAgIC8vXG4gICAgLy8gQ2FsbGluZyB0aGlzIGZ1bmN0aW9uIHJlcXVpcmVzIGEgcHVzaC1wb3AgdG8gdGhlIGRyYXdpbmcgc3R5bGVcbiAgICAvLyBzZXR0aW5ncyBzaW5jZSB0cmFuc2xhdGUgYW5kIHJvdGF0aW9uIG1vZGlmaWNhdGlvbnMgYXJlIG1hZGUgdG8gdGhlXG4gICAgLy8gZHJhd2luZyBtYXRyaXguIE90aGVyd2lzZSBhbGwgb3RoZXIgc3Vic2VxdWVudCBkcmF3aW5nIHdpbGwgYmVcbiAgICAvLyBpbXBhY3RlZC5cbiAgICBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICAgIGxldCBoQWxpZ247XG4gICAgICBsZXQgaEVudW0gPSBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduO1xuICAgICAgc3dpdGNoICh0aGlzLmhBbGlnbikge1xuICAgICAgICBjYXNlIGhFbnVtLmxlZnQ6ICAgaEFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkxFRlQ7ICAgYnJlYWs7XG4gICAgICAgIGNhc2UgaEVudW0uY2VudGVyOiBoQWxpZ24gPSB0aGlzLnJhYy5kcmF3ZXIucDUuQ0VOVEVSOyBicmVhaztcbiAgICAgICAgY2FzZSBoRW51bS5yaWdodDogIGhBbGlnbiA9IHRoaXMucmFjLmRyYXdlci5wNS5SSUdIVDsgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgaEFsaWduIGNvbmZpZ3VyYXRpb24gLSBoQWxpZ246JHt0aGlzLmhBbGlnbn1gKTtcbiAgICAgICAgICB0aHJvdyBSYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgICB9XG5cbiAgICAgIGxldCB2QWxpZ247XG4gICAgICBsZXQgdkVudW0gPSBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbjtcbiAgICAgIHN3aXRjaCAodGhpcy52QWxpZ24pIHtcbiAgICAgICAgY2FzZSB2RW51bS50b3A6ICAgICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LlRPUDsgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5ib3R0b206ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJPVFRPTTsgICBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5jZW50ZXI6ICAgdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkNFTlRFUjsgICBicmVhaztcbiAgICAgICAgY2FzZSB2RW51bS5iYXNlbGluZTogdkFsaWduID0gdGhpcy5yYWMuZHJhd2VyLnA1LkJBU0VMSU5FOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLnRyYWNlKGBJbnZhbGlkIHZBbGlnbiBjb25maWd1cmF0aW9uIC0gdkFsaWduOiR7dGhpcy52QWxpZ259YCk7XG4gICAgICAgICAgdGhyb3cgUmFjLkVycm9yLmludmFsaWRPYmplY3RDb25maWd1cmF0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBBbGlnblxuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRBbGlnbihoQWxpZ24sIHZBbGlnbik7XG5cbiAgICAgIC8vIFNpemVcbiAgICAgIGNvbnN0IHRleHRTaXplID0gdGhpcy5zaXplID8/IHRoaXMucmFjLnRleHRGb3JtYXREZWZhdWx0cy5zaXplO1xuICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRTaXplKHRleHRTaXplKTtcblxuICAgICAgLy8gRm9udFxuICAgICAgY29uc3QgdGV4dEZvbnQgPSB0aGlzLmZvbnQgPz8gdGhpcy5yYWMudGV4dEZvcm1hdERlZmF1bHRzLmZvbnQ7XG4gICAgICBpZiAodGV4dEZvbnQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnRleHRGb250KHRleHRGb250KTtcbiAgICAgIH1cblxuICAgICAgLy8gUG9zaXRpb25pbmdcbiAgICAgIHRoaXMucmFjLmRyYXdlci5wNS50cmFuc2xhdGUocG9pbnQueCwgcG9pbnQueSk7XG4gICAgICBpZiAodGhpcy5hbmdsZS50dXJuICE9IDApIHtcbiAgICAgICAgdGhpcy5yYWMuZHJhd2VyLnA1LnJvdGF0ZSh0aGlzLmFuZ2xlLnJhZGlhbnMoKSk7XG4gICAgICB9XG4gICAgfSAvLyBSYWMuVGV4dC5Gb3JtYXQucHJvdG90eXBlLmFwcGx5XG5cbiAgfSAvLyBzZXR1cEFsbEFwcGx5RnVuY3Rpb25zXG5cbn0gLy8gY2xhc3MgUDVEcmF3ZXJcblxubW9kdWxlLmV4cG9ydHMgPSBQNURyYXdlcjtcblxuXG4vLyBFbmNhcHN1bGF0ZXMgdGhlIGRyYXdpbmcgZnVuY3Rpb24gYW5kIG9wdGlvbnMgZm9yIGEgc3BlY2lmaWMgY2xhc3MuXG4vLyBUaGUgZHJhdyBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0d28gcGFyYW1ldGVyczogdGhlIGluc3RhbmNlIG9mIHRoZVxuLy8gZHJhd2VyLCBhbmQgdGhlIG9iamVjdCB0byBkcmF3LlxuLy9cbi8vIE9wdGlvbmFsbHkgYSBgc3R5bGVgIGNhbiBiZSBhc2lnbmVkIHRvIGFsd2F5cyBiZSBhcHBsaWVkIGJlZm9yZVxuLy8gZHJhd2luZyBhbiBpbnN0YW5jZSBvZiB0aGUgYXNzb2NpYXRlZCBjbGFzcy4gVGhpcyBzdHlsZSB3aWxsIGJlXG4vLyBhcHBsaWVkIGJlZm9yZSBhbnkgc3R5bGVzIHByb3ZpZGVkIHRvIHRoZSBgZHJhd2AgZnVuY3Rpb24uXG4vL1xuLy8gT3B0aW9uYWxseSBgcmVxdWlyZXNQdXNoUG9wYCBjYW4gYmUgc2V0IHRvIGB0cnVlYCB0byBhbHdheXMgcGVmb3JtXG4vLyBhIGBwdXNoYCBhbmQgYHBvcGAgYmVmb3JlIGFuZCBhZnRlciBhbGwgdGhlIHN0eWxlIGFuZCBkcmF3aW5nIGluXG4vLyB0aGUgcm91dGluZS4gVGhpcyBpcyBpbnRlbmRlZCBmb3Igb2JqZWN0cyB3aGljaCBkcmF3aW5nIG9wZXJhdGlvbnNcbi8vIG1heSBuZWVkIHRvIHB1c2ggdHJhbnNmb3JtYXRpb24gdG8gdGhlIHN0YWNrLlxuY2xhc3MgRHJhd1JvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGRyYXdGdW5jdGlvbikge1xuICAgIHRoaXMuY2xhc3NPYmogPSBjbGFzc09iajtcbiAgICB0aGlzLmRyYXdGdW5jdGlvbiA9IGRyYXdGdW5jdGlvbjtcbiAgICB0aGlzLnN0eWxlID0gbnVsbDtcblxuICAgIC8vIE9wdGlvbnNcbiAgICB0aGlzLnJlcXVpcmVzUHVzaFBvcCA9IGZhbHNlO1xuICB9XG59IC8vIERyYXdSb3V0aW5lXG5cblxuY2xhc3MgRGVidWdSb3V0aW5lIHtcbiAgY29uc3RydWN0b3IgKGNsYXNzT2JqLCBkZWJ1Z0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5jbGFzc09iaiA9IGNsYXNzT2JqO1xuICAgIHRoaXMuZGVidWdGdW5jdGlvbiA9IGRlYnVnRnVuY3Rpb247XG4gIH1cbn1cblxuXG5jbGFzcyBBcHBseVJvdXRpbmUge1xuICBjb25zdHJ1Y3RvciAoY2xhc3NPYmosIGFwcGx5RnVuY3Rpb24pIHtcbiAgICB0aGlzLmNsYXNzT2JqID0gY2xhc3NPYmo7XG4gICAgdGhpcy5hcHBseUZ1bmN0aW9uID0gYXBwbHlGdW5jdGlvbjtcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF0dGFjaFBvaW50RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIENhbGxzIGBwNS52ZXJ0ZXhgIHRvIHJlcHJlc2VudCB0aGlzIGBQb2ludGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5Qb2ludC5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqL1xuICBSYWMuUG9pbnQucHJvdG90eXBlLnZlcnRleCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmFjLmRyYXdlci5wNS52ZXJ0ZXgodGhpcy54LCB0aGlzLnkpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBwb2ludGVyLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gcG9pbnRlclxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LnBvaW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUubW91c2VYLCByYWMuZHJhd2VyLnA1Lm1vdXNlWSk7XG4gIH07XG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBQb2ludGAgYXQgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAqXG4gICogQWRkZWQgdG8gYGluc3RhbmNlLlBvaW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuUG9pbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQ2VudGVyXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlBvaW50I1xuICAqL1xuICByYWMuUG9pbnQuY2FudmFzQ2VudGVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludChyYWMuZHJhd2VyLnA1LndpZHRoLzIsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0LzIpO1xuICB9O1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgUG9pbnRgIGF0IHRoZSBlbmQgb2YgdGhlIGNhbnZhcywgdGhhdCBpcywgYXQgdGhlIHBvc2l0aW9uXG4gICogYCh3aWR0aCxoZWlnaHQpYC5cbiAgKlxuICAqIEFkZGVkIHRvIGBpbnN0YW5jZS5Qb2ludGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlBvaW50fVxuICAqXG4gICogQGZ1bmN0aW9uIGNhbnZhc0VuZFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Qb2ludCNcbiAgKi9cbiAgcmFjLlBvaW50LmNhbnZhc0VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQocmFjLmRyYXdlci5wNS53aWR0aCwgcmFjLmRyYXdlci5wNS5oZWlnaHQpO1xuICB9O1xuXG59IC8vIGF0dGFjaFBvaW50RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoUmF5RnVuY3Rpb25zKHJhYykge1xuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFBvaW50YCBsb2NhdGVkIHdoZXJlIHRoZSByYXkgdG91Y2hlcyB0aGUgY2FudmFzIGVkZ2UuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqIEByZXR1cm5zIHs/UmFjLlBvaW50fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5wb2ludEF0Q2FudmFzRWRnZSA9IGZ1bmN0aW9uKG1hcmdpbiA9IDApIHtcbiAgICBsZXQgZWRnZVJheSA9IHRoaXMucmF5QXRDYW52YXNFZGdlKG1hcmdpbik7XG4gICAgaWYgKGVkZ2VSYXkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkZ2VSYXkuc3RhcnQ7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBSYXlgIHRoYXQgc3RhcnRzIGF0IHRoZSBwb2ludCB3aGVyZSB0aGUgYHRoaXNgIHRvdWNoZXNcbiAgKiB0aGUgY2FudmFzIGVkZ2UgYW5kIHBvaW50ZWQgdG93YXJkcyB0aGUgaW5zaWRlIG9mIHRoZSBjYW52YXMuXG4gICpcbiAgKiBXaGVuIHRoZSByYXkgaXMgb3V0c2lkZSB0aGUgY2FudmFzIGFuZCBwb2ludGluZyBhd2F5LCBgbnVsbGAgaXNcbiAgKiByZXR1cm5lZC5cbiAgKlxuICAqIEFkZGVkICB0byBgUmFjLlJheS5wcm90b3R5cGVgIHdoZW4gYHtAbGluayBSYWMuUDVEcmF3ZXJ9YCBpcyBzZXR1cCBhc1xuICAqIGBbcmFjLmRyYXdlcl17QGxpbmsgUmFjI2RyYXdlcn1gLlxuICAqXG4gICogQHJldHVybnMgez9SYWMuUmF5fVxuICAqL1xuICBSYWMuUmF5LnByb3RvdHlwZS5yYXlBdENhbnZhc0VkZ2UgPSBmdW5jdGlvbihtYXJnaW4gPSAwKSB7XG4gICAgY29uc3QgdHVybiA9IHRoaXMuYW5nbGUudHVybjtcbiAgICBjb25zdCBwNSA9IHRoaXMucmFjLmRyYXdlci5wNTtcblxuICAgIGNvbnN0IGRvd25FZGdlICA9IHA1LmhlaWdodCAtIG1hcmdpbjtcbiAgICBjb25zdCBsZWZ0RWRnZSAgPSBtYXJnaW47XG4gICAgY29uc3QgdXBFZGdlICAgID0gbWFyZ2luO1xuICAgIGNvbnN0IHJpZ2h0RWRnZSA9IHA1LndpZHRoIC0gbWFyZ2luO1xuXG4gICAgLy8gcG9pbnRpbmcgZG93blxuICAgIGlmICh0dXJuID49IDEvOCAmJiB0dXJuIDwgMy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55IDwgZG93bkVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnggPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WChyaWdodEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5sZWZ0KTtcbiAgICAgICAgfSBlbHNlIGlmIChlZGdlUmF5LnN0YXJ0LnggPCBsZWZ0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKGxlZnRFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyBsZWZ0XG4gICAgaWYgKHR1cm4gPj0gMy84ICYmIHR1cm4gPCA1LzgpIHtcbiAgICAgIGxldCBlZGdlUmF5ID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN0YXJ0LnggPj0gbGVmdEVkZ2UpIHtcbiAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIGlmIChlZGdlUmF5LnN0YXJ0LnkgPiBkb3duRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKGRvd25FZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUudXApO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueSA8IHVwRWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRZKHVwRWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmRvd24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWRnZVJheTtcbiAgICB9XG5cbiAgICAvLyBwb2ludGluZyB1cFxuICAgIGlmICh0dXJuID49IDUvOCAmJiB0dXJuIDwgNy84KSB7XG4gICAgICBsZXQgZWRnZVJheSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5zdGFydC55ID49IHVwRWRnZSkge1xuICAgICAgICBlZGdlUmF5ID0gdGhpcy5wb2ludEF0WSh1cEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5kb3duKTtcbiAgICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVkZ2VSYXkuc3RhcnQueCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFgobGVmdEVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGdlUmF5O1xuICAgIH1cblxuICAgIC8vIHBvaW50aW5nIHJpZ2h0XG4gICAgbGV0IGVkZ2VSYXkgPSBudWxsO1xuICAgIGlmICh0aGlzLnN0YXJ0LnggPCByaWdodEVkZ2UpIHtcbiAgICAgIGVkZ2VSYXkgPSB0aGlzLnBvaW50QXRYKHJpZ2h0RWRnZSkucmF5KHRoaXMucmFjLkFuZ2xlLmxlZnQpO1xuICAgICAgaWYgKGVkZ2VSYXkuc3RhcnQueSA+IGRvd25FZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkoZG93bkVkZ2UpLnJheSh0aGlzLnJhYy5BbmdsZS51cCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZWRnZVJheS5zdGFydC55IDwgdXBFZGdlKSB7XG4gICAgICAgICAgZWRnZVJheSA9IHRoaXMucG9pbnRBdFkodXBFZGdlKS5yYXkodGhpcy5yYWMuQW5nbGUuZG93bik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkZ2VSYXk7XG4gIH07XG5cbn0gLy8gYXR0YWNoUmF5RnVuY3Rpb25zXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXR0YWNoU2VnbWVudEZ1bmN0aW9ucyhyYWMpIHtcblxuICAvKipcbiAgKiBDYWxscyBgcDUudmVydGV4YCB0byByZXByZXNlbnQgdGhpcyBgU2VnbWVudGAuXG4gICpcbiAgKiBBZGRlZCAgdG8gYFJhYy5TZWdtZW50LnByb3RvdHlwZWAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICovXG4gIFJhYy5TZWdtZW50LnByb3RvdHlwZS52ZXJ0ZXggPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXJ0UG9pbnQoKS52ZXJ0ZXgoKTtcbiAgICB0aGlzLmVuZFBvaW50KCkudmVydGV4KCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSB0b3Agb2YgdGhlIGNhbnZhcywgZnJvbSB0b3AtbGVmdCB0b1xuICAqIHRvcC1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzVG9wXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc1RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByYWMuUG9pbnQuemVyb1xuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBsZWZ0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLWxlZnRcbiAgKiB0byBib3R0b20tbGVmdC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzTGVmdFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNMZWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHJhYy5Qb2ludC56ZXJvXG4gICAgICAuc2VnbWVudFRvQW5nbGUocmFjLkFuZ2xlLmRvd24sIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBgU2VnbWVudGAgdGhhdCBjb3ZlcnMgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXMsIGZyb20gdG9wLXJpZ2h0XG4gICogdG8gYm90dG9tLXJpZ2h0LlxuICAqXG4gICogQWRkZWQgIHRvIGBpbnN0YW5jZS5TZWdtZW50YCB3aGVuIGB7QGxpbmsgUmFjLlA1RHJhd2VyfWAgaXMgc2V0dXAgYXNcbiAgKiBgW3JhYy5kcmF3ZXJde0BsaW5rIFJhYyNkcmF3ZXJ9YC5cbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuU2VnbWVudH1cbiAgKlxuICAqIEBmdW5jdGlvbiBjYW52YXNSaWdodFxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5TZWdtZW50I1xuICAqL1xuICByYWMuU2VnbWVudC5jYW52YXNSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHRvcFJpZ2h0ID0gcmFjLlBvaW50KHJhYy5kcmF3ZXIucDUud2lkdGgsIDApO1xuICAgIHJldHVybiB0b3BSaWdodFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5kb3duLCByYWMuZHJhd2VyLnA1LmhlaWdodCk7XG4gIH07XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYFNlZ21lbnRgIHRoYXQgY292ZXJzIHRoZSBib3R0b20gb2YgdGhlIGNhbnZhcywgZnJvbVxuICAqIGJvdHRvbS1sZWZ0IHRvIGJvdHRvbS1yaWdodC5cbiAgKlxuICAqIEFkZGVkICB0byBgaW5zdGFuY2UuU2VnbWVudGAgd2hlbiBge0BsaW5rIFJhYy5QNURyYXdlcn1gIGlzIHNldHVwIGFzXG4gICogYFtyYWMuZHJhd2VyXXtAbGluayBSYWMjZHJhd2VyfWAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlNlZ21lbnR9XG4gICpcbiAgKiBAZnVuY3Rpb24gY2FudmFzQm90dG9tXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlNlZ21lbnQjXG4gICovXG4gIHJhYy5TZWdtZW50LmNhbnZhc0JvdHRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBib3R0b21MZWZ0ID0gcmFjLlBvaW50KDAsIHJhYy5kcmF3ZXIucDUuaGVpZ2h0KTtcbiAgICByZXR1cm4gYm90dG9tTGVmdFxuICAgICAgLnNlZ21lbnRUb0FuZ2xlKHJhYy5BbmdsZS5yaWdodCwgcmFjLmRyYXdlci5wNS53aWR0aCk7XG4gIH07XG5cblxuXG59IC8vIGF0dGFjaFNlZ21lbnRGdW5jdGlvbnNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbmZ1bmN0aW9uIHJldmVyc2VzVGV4dChhbmdsZSkge1xuICByZXR1cm4gYW5nbGUudHVybiA8IDMvNCAmJiBhbmdsZS50dXJuID49IDEvNDtcbn1cblxuXG5leHBvcnRzLmRlYnVnQW5nbGUgPSBmdW5jdGlvbihkcmF3ZXIsIGFuZ2xlLCBwb2ludCwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9ICAgICAgICAgIGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gIGRyYXdlci5kZWJ1Z1BvaW50UmFkaXVzO1xuICBjb25zdCBtYXJrZXJSYWRpdXMgPSBkcmF3ZXIuZGVidWdNYXJrZXJSYWRpdXM7XG4gIGNvbnN0IGRpZ2l0cyA9ICAgICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIFplcm8gc2VnbWVudFxuICBwb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShyYWMuQW5nbGUuemVybywgbWFya2VyUmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gQW5nbGUgc2VnbWVudFxuICBsZXQgYW5nbGVTZWdtZW50ID0gcG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYW5nbGUsIG1hcmtlclJhZGl1cyAqIDEuNSk7XG4gIGFuZ2xlU2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgYW5nbGUsIGFuZ2xlLmludmVyc2UoKSwgZmFsc2UpXG4gICAgLmRyYXcoKTtcbiAgYW5nbGVTZWdtZW50XG4gICAgLndpdGhMZW5ndGhBZGQocG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcblxuICAvLyBNaW5pIGFyYyBtYXJrZXJzXG4gIGxldCBhbmdsZUFyYyA9IHBvaW50LmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS56ZXJvLCBhbmdsZSk7XG4gIGxldCBjb250ZXh0ID0gZHJhd2VyLnA1LmRyYXdpbmdDb250ZXh0O1xuICBsZXQgc3Ryb2tlV2VpZ2h0ID0gY29udGV4dC5saW5lV2lkdGg7XG4gIGNvbnRleHQuc2F2ZSgpOyB7XG4gICAgY29udGV4dC5saW5lQ2FwID0gJ2J1dHQnO1xuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzYsIDRdKTtcbiAgICAvLyBBbmdsZSBhcmNcbiAgICBhbmdsZUFyYy5kcmF3KCk7XG5cbiAgICBpZiAoIWFuZ2xlQXJjLmlzQ2lyY2xlKCkpIHtcbiAgICAgIC8vIE91dHNpZGUgYW5nbGUgYXJjXG4gICAgICBjb250ZXh0LnNldExpbmVEYXNoKFsyLCA0XSk7XG4gICAgICBhbmdsZUFyY1xuICAgICAgICAud2l0aFJhZGl1cyhtYXJrZXJSYWRpdXMqMy80KVxuICAgICAgICAud2l0aENsb2Nrd2lzZShmYWxzZSlcbiAgICAgICAgLmRyYXcoKTtcbiAgICB9XG4gIH07XG4gIGNvbnRleHQucmVzdG9yZSgpO1xuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICAvLyBOb3JtYWwgb3JpZW50YXRpb25cbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi5jZW50ZXIsXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgZm9ybWF0ID0gZm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIFR1cm4gdGV4dFxuICBsZXQgdHVyblN0cmluZyA9IGB0dXJuOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcG9pbnRcbiAgICAucG9pbnRUb0FuZ2xlKGFuZ2xlLCBtYXJrZXJSYWRpdXMqMilcbiAgICAudGV4dCh0dXJuU3RyaW5nLCBmb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbn07IC8vIGRlYnVnQW5nbGVcblxuXG5leHBvcnRzLmRlYnVnUG9pbnQgPSBmdW5jdGlvbihkcmF3ZXIsIHBvaW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgcG9pbnQuZHJhdygpO1xuXG4gIC8vIFBvaW50IG1hcmtlclxuICBwb2ludC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBQb2ludCByZXRpY3VsZSBtYXJrZXJcbiAgbGV0IGFyYyA9IHBvaW50XG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHJhYy5BbmdsZS5zLCByYWMuQW5nbGUuZSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygxLzIpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDEvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIFRleHRcbiAgaWYgKGRyYXdzVGV4dCAhPT0gdHJ1ZSkgeyByZXR1cm47IH1cblxuICBsZXQgc3RyaW5nID0gYHg6JHtwb2ludC54LnRvRml4ZWQoZGlnaXRzKX1cXG55OiR7cG9pbnQueS50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IGZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3AsXG4gICAgcmFjLkFuZ2xlLmUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgcG9pbnRcbiAgICAucG9pbnRUb0FuZ2xlKHJhYy5BbmdsZS5zZSwgcG9pbnRSYWRpdXMqMilcbiAgICAudGV4dChzdHJpbmcsIGZvcm1hdClcbiAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xufTsgLy8gZGVidWdQb2ludFxuXG5cbmV4cG9ydHMuZGVidWdSYXkgPSBmdW5jdGlvbihkcmF3ZXIsIHJheSwgZHJhd3NUZXh0KSB7XG4gIGNvbnN0IHJhYyA9IGRyYXdlci5yYWM7XG4gIGNvbnN0IHBvaW50UmFkaXVzID0gZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcblxuICByYXkuZHJhdygpO1xuXG4gIC8vIExpdHRsZSBjaXJjbGUgYXQgc3RhcnQgbWFya2VyXG4gIHJheS5zdGFydC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcblxuICAvLyBIYWxmIGNpcmNsZSBhdCBzdGFydFxuICBjb25zdCBwZXJwQW5nbGUgPSByYXkuYW5nbGUucGVycGVuZGljdWxhcigpO1xuICBjb25zdCBzdGFydEFyYyA9IHJheS5zdGFydFxuICAgIC5hcmMobWFya2VyUmFkaXVzLCBwZXJwQW5nbGUsIHBlcnBBbmdsZS5pbnZlcnNlKCkpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgc3RhcnRBcmMuZW5kU2VnbWVudCgpLnJldmVyc2UoKVxuICAgIC53aXRoTGVuZ3RoUmF0aW8oMC41KVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRWRnZSBlbmQgaGFsZiBjaXJjbGVcbiAgY29uc3QgZWRnZVJheSA9IHJheS5yYXlBdENhbnZhc0VkZ2UoKTtcbiAgaWYgKGVkZ2VSYXkgIT0gbnVsbCkge1xuICAgIGNvbnN0IGVkZ2VBcmMgPSBlZGdlUmF5XG4gICAgICAudHJhbnNsYXRlVG9EaXN0YW5jZShwb2ludFJhZGl1cylcbiAgICAgIC5wZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgICAgLmFyY1RvQW5nbGVEaXN0YW5jZShtYXJrZXJSYWRpdXMvMiwgMC41KVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gICAgZWRnZUFyYy5lbmRTZWdtZW50KClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgICBlZGdlQXJjLnJhZGl1c1NlZ21lbnRBdEFuZ2xlKGVkZ2VSYXkuYW5nbGUpXG4gICAgICAucmV2ZXJzZSgpXG4gICAgICAud2l0aExlbmd0aChwb2ludFJhZGl1cylcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgY29uc3QgYW5nbGUgID0gcmF5LmFuZ2xlO1xuICBjb25zdCBoRW51bSA9IFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ247XG4gIGNvbnN0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG4gIGNvbnN0IGZvbnQgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQ7XG4gIGNvbnN0IHNpemUgICA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemU7XG4gIGNvbnN0IGRpZ2l0cyA9IGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZpeGVkRGlnaXRzO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgc3RhcnRGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRW51bS5sZWZ0LCB2RW51bS5ib3R0b20sXG4gICAgYW5nbGUsIGZvbnQsIHNpemUpO1xuICBsZXQgYW5nbGVGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KHJhYyxcbiAgICBoRW51bS5sZWZ0LCB2RW51bS50b3AsXG4gICAgYW5nbGUsIGZvbnQsIHNpemUpO1xuICBpZiAocmV2ZXJzZXNUZXh0KGFuZ2xlKSkge1xuICAgIC8vIFJldmVyc2Ugb3JpZW50YXRpb25cbiAgICBzdGFydEZvcm1hdCA9IHN0YXJ0Rm9ybWF0LmludmVyc2UoKTtcbiAgICBhbmdsZUZvcm1hdCA9IGFuZ2xlRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHRleHRcbiAgY29uc3Qgc3RhcnRTdHJpbmcgPSBgc3RhcnQ6KCR7cmF5LnN0YXJ0LngudG9GaXhlZChkaWdpdHMpfSwke3JheS5zdGFydC55LnRvRml4ZWQoZGlnaXRzKX0pYDtcbiAgcmF5LnN0YXJ0XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5zdWJ0cmFjdCgxLzQpLCBtYXJrZXJSYWRpdXMvMilcbiAgICAudGV4dChzdGFydFN0cmluZywgc3RhcnRGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAvLyBBbmdsZSB0ZXh0XG4gIGNvbnN0IGFuZ2xlU3RyaW5nID0gYGFuZ2xlOiR7YW5nbGUudHVybi50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgcmF5LnN0YXJ0XG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5hZGQoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQoYW5nbGVTdHJpbmcsIGFuZ2xlRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1JheVxuXG5cbmV4cG9ydHMuZGVidWdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50LCBkcmF3c1RleHQpIHtcbiAgY29uc3QgcmFjID0gICAgICAgICAgZHJhd2VyLnJhYztcbiAgY29uc3QgcG9pbnRSYWRpdXMgPSAgZHJhd2VyLmRlYnVnUG9pbnRSYWRpdXM7XG4gIGNvbnN0IG1hcmtlclJhZGl1cyA9IGRyYXdlci5kZWJ1Z01hcmtlclJhZGl1cztcbiAgY29uc3QgZGlnaXRzID0gICAgICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZml4ZWREaWdpdHM7XG5cbiAgc2VnbWVudC5kcmF3KCk7XG5cbiAgLy8gTGl0dGxlIGNpcmNsZSBhdCBzdGFydCBtYXJrZXJcbiAgc2VnbWVudC53aXRoTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5hcmMoKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gSGFsZiBjaXJjbGUgc3RhcnQgc2VnbWVudFxuICBsZXQgcGVycEFuZ2xlID0gc2VnbWVudC5hbmdsZSgpLnBlcnBlbmRpY3VsYXIoKTtcbiAgbGV0IGFyYyA9IHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLmFyYyhtYXJrZXJSYWRpdXMsIHBlcnBBbmdsZSwgcGVycEFuZ2xlLmludmVyc2UoKSlcbiAgICAuZHJhdygpO1xuICBhcmMuc3RhcnRTZWdtZW50KCkucmV2ZXJzZSgpXG4gICAgLndpdGhMZW5ndGhSYXRpbygwLjUpXG4gICAgLmRyYXcoKTtcbiAgYXJjLmVuZFNlZ21lbnQoKVxuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aFJhdGlvKDAuNSlcbiAgICAuZHJhdygpO1xuXG4gIC8vIFBlcnBlbmRpY3VsYXIgZW5kIG1hcmtlclxuICBsZXQgZW5kTWFya2VyU3RhcnQgPSBzZWdtZW50XG4gICAgLm5leHRTZWdtZW50UGVycGVuZGljdWxhcigpXG4gICAgLndpdGhMZW5ndGgobWFya2VyUmFkaXVzLzIpXG4gICAgLndpdGhTdGFydEV4dGVuc2lvbigtcG9pbnRSYWRpdXMpXG4gICAgLmRyYXcoKTtcbiAgbGV0IGVuZE1hcmtlckVuZCA9IHNlZ21lbnRcbiAgICAubmV4dFNlZ21lbnRQZXJwZW5kaWN1bGFyKGZhbHNlKVxuICAgIC53aXRoTGVuZ3RoKG1hcmtlclJhZGl1cy8yKVxuICAgIC53aXRoU3RhcnRFeHRlbnNpb24oLXBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG4gIC8vIExpdHRsZSBlbmQgaGFsZiBjaXJjbGVcbiAgc2VnbWVudC5lbmRQb2ludCgpXG4gICAgLmFyYyhwb2ludFJhZGl1cywgZW5kTWFya2VyU3RhcnQuYW5nbGUoKSwgZW5kTWFya2VyRW5kLmFuZ2xlKCkpXG4gICAgLmRyYXcoKTtcblxuICAvLyBGb3JtaW5nIGVuZCBhcnJvd1xuICBsZXQgYXJyb3dBbmdsZVNoaWZ0ID0gcmFjLkFuZ2xlLmZyb20oMS83KTtcbiAgbGV0IGVuZEFycm93U3RhcnQgPSBlbmRNYXJrZXJTdGFydFxuICAgIC5yZXZlcnNlKClcbiAgICAucmF5LndpdGhBbmdsZVNoaWZ0KGFycm93QW5nbGVTaGlmdCwgZmFsc2UpO1xuICBsZXQgZW5kQXJyb3dFbmQgPSBlbmRNYXJrZXJFbmRcbiAgICAucmV2ZXJzZSgpXG4gICAgLnJheS53aXRoQW5nbGVTaGlmdChhcnJvd0FuZ2xlU2hpZnQsIHRydWUpO1xuICBsZXQgZW5kQXJyb3dQb2ludCA9IGVuZEFycm93U3RhcnRcbiAgICAucG9pbnRBdEludGVyc2VjdGlvbihlbmRBcnJvd0VuZCk7XG4gIC8vIEVuZCBhcnJvd1xuICBlbmRNYXJrZXJTdGFydFxuICAgIC5uZXh0U2VnbWVudFRvUG9pbnQoZW5kQXJyb3dQb2ludClcbiAgICAuZHJhdygpXG4gICAgLm5leHRTZWdtZW50VG9Qb2ludChlbmRNYXJrZXJFbmQuZW5kUG9pbnQoKSlcbiAgICAuZHJhdygpO1xuXG5cbiAgLy8gVGV4dFxuICBpZiAoZHJhd3NUZXh0ICE9PSB0cnVlKSB7IHJldHVybjsgfVxuXG4gIGxldCBhbmdsZSA9IHNlZ21lbnQuYW5nbGUoKTtcbiAgLy8gTm9ybWFsIG9yaWVudGF0aW9uXG4gIGxldCBsZW5ndGhGb3JtYXQgPSBuZXcgUmFjLlRleHQuRm9ybWF0KFxuICAgIHJhYyxcbiAgICBSYWMuVGV4dC5Gb3JtYXQuaG9yaXpvbnRhbEFsaWduLmxlZnQsXG4gICAgUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ24uYm90dG9tLFxuICAgIGFuZ2xlLFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG4gIGxldCBhbmdsZUZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIFJhYy5UZXh0LkZvcm1hdC5ob3Jpem9udGFsQWxpZ24ubGVmdCxcbiAgICBSYWMuVGV4dC5Gb3JtYXQudmVydGljYWxBbGlnbi50b3AsXG4gICAgYW5nbGUsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgaWYgKHJldmVyc2VzVGV4dChhbmdsZSkpIHtcbiAgICAvLyBSZXZlcnNlIG9yaWVudGF0aW9uXG4gICAgbGVuZ3RoRm9ybWF0ID0gbGVuZ3RoRm9ybWF0LmludmVyc2UoKTtcbiAgICBhbmdsZUZvcm1hdCA9IGFuZ2xlRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuXG4gIC8vIExlbmd0aFxuICBsZXQgbGVuZ3RoU3RyaW5nID0gYGxlbmd0aDoke3NlZ21lbnQubGVuZ3RoLnRvRml4ZWQoZGlnaXRzKX1gO1xuICBzZWdtZW50LnN0YXJ0UG9pbnQoKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUsIHBvaW50UmFkaXVzKVxuICAgIC5wb2ludFRvQW5nbGUoYW5nbGUuc3VidHJhY3QoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQobGVuZ3RoU3RyaW5nLCBsZW5ndGhGb3JtYXQpXG4gICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcblxuICAgIC8vIEFuZ2xlXG4gIGxldCBhbmdsZVN0cmluZyA9IGBhbmdsZToke2FuZ2xlLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG4gIHNlZ21lbnQuc3RhcnRQb2ludCgpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZSwgcG9pbnRSYWRpdXMpXG4gICAgLnBvaW50VG9BbmdsZShhbmdsZS5hZGQoMS80KSwgbWFya2VyUmFkaXVzLzIpXG4gICAgLnRleHQoYW5nbGVTdHJpbmcsIGFuZ2xlRm9ybWF0KVxuICAgIC5kcmF3KGRyYXdlci5kZWJ1Z1RleHRTdHlsZSk7XG59OyAvLyBkZWJ1Z1NlZ21lbnRcblxuXG5leHBvcnRzLmRlYnVnQXJjID0gZnVuY3Rpb24oZHJhd2VyLCBhcmMsIGRyYXdzVGV4dCkge1xuICBjb25zdCByYWMgPSAgICAgICAgICBkcmF3ZXIucmFjO1xuICBjb25zdCBwb2ludFJhZGl1cyA9ICBkcmF3ZXIuZGVidWdQb2ludFJhZGl1cztcbiAgY29uc3QgbWFya2VyUmFkaXVzID0gZHJhd2VyLmRlYnVnTWFya2VyUmFkaXVzO1xuICBjb25zdCBkaWdpdHMgPSAgICAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5maXhlZERpZ2l0cztcblxuICBhcmMuZHJhdygpO1xuXG4gIC8vIENlbnRlciBtYXJrZXJzXG4gIGxldCBjZW50ZXJBcmNSYWRpdXMgPSBtYXJrZXJSYWRpdXMgKiAyLzM7XG4gIGlmIChhcmMucmFkaXVzID4gbWFya2VyUmFkaXVzLzMgJiYgYXJjLnJhZGl1cyA8IG1hcmtlclJhZGl1cykge1xuICAgIC8vIElmIHJhZGl1cyBpcyB0byBjbG9zZSB0byB0aGUgY2VudGVyLWFyYyBtYXJrZXJzXG4gICAgLy8gTWFrZSB0aGUgY2VudGVyLWFyYyBiZSBvdXRzaWRlIG9mIHRoZSBhcmNcbiAgICBjZW50ZXJBcmNSYWRpdXMgPSBhcmMucmFkaXVzICsgbWFya2VyUmFkaXVzLzM7XG4gIH1cblxuICAvLyBDZW50ZXIgc3RhcnQgc2VnbWVudFxuICBsZXQgY2VudGVyQXJjID0gYXJjLndpdGhSYWRpdXMoY2VudGVyQXJjUmFkaXVzKTtcbiAgY2VudGVyQXJjLnN0YXJ0U2VnbWVudCgpLmRyYXcoKTtcblxuICAvLyBSYWRpdXNcbiAgbGV0IHJhZGl1c01hcmtlckxlbmd0aCA9IGFyYy5yYWRpdXNcbiAgICAtIGNlbnRlckFyY1JhZGl1c1xuICAgIC0gbWFya2VyUmFkaXVzLzJcbiAgICAtIHBvaW50UmFkaXVzKjI7XG4gIGlmIChyYWRpdXNNYXJrZXJMZW5ndGggPiAwKSB7XG4gICAgYXJjLnN0YXJ0U2VnbWVudCgpXG4gICAgICAud2l0aExlbmd0aChyYWRpdXNNYXJrZXJMZW5ndGgpXG4gICAgICAudHJhbnNsYXRlVG9MZW5ndGgoY2VudGVyQXJjUmFkaXVzICsgcG9pbnRSYWRpdXMqMilcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBNaW5pIGFyYyBtYXJrZXJzXG4gIGxldCBjb250ZXh0ID0gZHJhd2VyLnA1LmRyYXdpbmdDb250ZXh0O1xuICBsZXQgc3Ryb2tlV2VpZ2h0ID0gY29udGV4dC5saW5lV2lkdGg7XG4gIGNvbnRleHQuc2F2ZSgpOyB7XG4gICAgY29udGV4dC5saW5lQ2FwID0gJ2J1dHQnO1xuICAgIGNvbnRleHQuc2V0TGluZURhc2goWzYsIDRdKTtcbiAgICBjZW50ZXJBcmMuZHJhdygpO1xuXG4gICAgaWYgKCFjZW50ZXJBcmMuaXNDaXJjbGUoKSkge1xuICAgICAgLy8gT3V0c2lkZSBhbmdsZSBhcmNcbiAgICAgIGNvbnRleHQuc2V0TGluZURhc2goWzIsIDRdKTtcbiAgICAgIGNlbnRlckFyY1xuICAgICAgICAud2l0aENsb2Nrd2lzZSghY2VudGVyQXJjLmNsb2Nrd2lzZSlcbiAgICAgICAgLmRyYXcoKTtcbiAgICB9XG4gIH07XG4gIGNvbnRleHQucmVzdG9yZSgpO1xuXG4gIC8vIENlbnRlciBlbmQgc2VnbWVudFxuICBpZiAoIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgY2VudGVyQXJjLmVuZFNlZ21lbnQoKS5yZXZlcnNlKCkud2l0aExlbmd0aFJhdGlvKDEvMikuZHJhdygpO1xuICB9XG5cbiAgLy8gU3RhcnQgcG9pbnQgbWFya2VyXG4gIGxldCBzdGFydFBvaW50ID0gYXJjLnN0YXJ0UG9pbnQoKTtcbiAgc3RhcnRQb2ludFxuICAgIC5hcmMocG9pbnRSYWRpdXMpLmRyYXcoKTtcbiAgc3RhcnRQb2ludFxuICAgIC5zZWdtZW50VG9BbmdsZShhcmMuc3RhcnQsIG1hcmtlclJhZGl1cylcbiAgICAud2l0aFN0YXJ0RXh0ZW5zaW9uKC1tYXJrZXJSYWRpdXMvMilcbiAgICAuZHJhdygpO1xuXG4gIC8vIE9yaWVudGF0aW9uIG1hcmtlclxuICBsZXQgb3JpZW50YXRpb25MZW5ndGggPSBtYXJrZXJSYWRpdXMqMjtcbiAgbGV0IG9yaWVudGF0aW9uQXJjID0gYXJjXG4gICAgLnN0YXJ0U2VnbWVudCgpXG4gICAgLndpdGhMZW5ndGhBZGQobWFya2VyUmFkaXVzKVxuICAgIC5hcmMobnVsbCwgYXJjLmNsb2Nrd2lzZSlcbiAgICAud2l0aExlbmd0aChvcmllbnRhdGlvbkxlbmd0aClcbiAgICAuZHJhdygpO1xuICBsZXQgYXJyb3dDZW50ZXIgPSBvcmllbnRhdGlvbkFyY1xuICAgIC5yZXZlcnNlKClcbiAgICAud2l0aExlbmd0aChtYXJrZXJSYWRpdXMvMilcbiAgICAuY2hvcmRTZWdtZW50KCk7XG4gIGxldCBhcnJvd0FuZ2xlID0gMy8zMjtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoLWFycm93QW5nbGUpLmRyYXcoKTtcbiAgYXJyb3dDZW50ZXIud2l0aEFuZ2xlU2hpZnQoYXJyb3dBbmdsZSkuZHJhdygpO1xuXG4gIC8vIEludGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IGVuZFBvaW50ID0gYXJjLmVuZFBvaW50KCk7XG4gIGxldCBpbnRlcm5hbExlbmd0aCA9IE1hdGgubWluKG1hcmtlclJhZGl1cy8yLCBhcmMucmFkaXVzKTtcbiAgaW50ZXJuYWxMZW5ndGggLT0gcG9pbnRSYWRpdXM7XG4gIGlmIChpbnRlcm5hbExlbmd0aCA+IHJhYy5lcXVhbGl0eVRocmVzaG9sZCkge1xuICAgIGVuZFBvaW50XG4gICAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZC5pbnZlcnNlKCksIGludGVybmFsTGVuZ3RoKVxuICAgICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgICAgLmRyYXcoKTtcbiAgfVxuXG4gIC8vIEV4dGVybmFsIGVuZCBwb2ludCBtYXJrZXJcbiAgbGV0IHRleHRKb2luVGhyZXNob2xkID0gbWFya2VyUmFkaXVzKjM7XG4gIGxldCBsZW5ndGhBdE9yaWVudGF0aW9uQXJjID0gb3JpZW50YXRpb25BcmNcbiAgICAud2l0aEVuZChhcmMuZW5kKVxuICAgIC5sZW5ndGgoKTtcbiAgbGV0IGV4dGVybmFsTGVuZ3RoID0gbGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkICYmIGRyYXdzVGV4dCA9PT0gdHJ1ZVxuICAgID8gbWFya2VyUmFkaXVzIC0gcG9pbnRSYWRpdXNcbiAgICA6IG1hcmtlclJhZGl1cy8yIC0gcG9pbnRSYWRpdXM7XG5cbiAgZW5kUG9pbnRcbiAgICAuc2VnbWVudFRvQW5nbGUoYXJjLmVuZCwgZXh0ZXJuYWxMZW5ndGgpXG4gICAgLnRyYW5zbGF0ZVRvTGVuZ3RoKHBvaW50UmFkaXVzKVxuICAgIC5kcmF3KCk7XG5cbiAgLy8gRW5kIHBvaW50IGxpdHRsZSBhcmNcbiAgaWYgKCFhcmMuaXNDaXJjbGUoKSkge1xuICAgIGVuZFBvaW50XG4gICAgICAuYXJjKHBvaW50UmFkaXVzLCBhcmMuZW5kLCBhcmMuZW5kLmludmVyc2UoKSwgYXJjLmNsb2Nrd2lzZSlcbiAgICAgIC5kcmF3KCk7XG4gIH1cblxuICAvLyBUZXh0XG4gIGlmIChkcmF3c1RleHQgIT09IHRydWUpIHsgcmV0dXJuOyB9XG5cbiAgbGV0IGhFbnVtID0gUmFjLlRleHQuRm9ybWF0Lmhvcml6b250YWxBbGlnbjtcbiAgbGV0IHZFbnVtID0gUmFjLlRleHQuRm9ybWF0LnZlcnRpY2FsQWxpZ247XG5cbiAgbGV0IGhlYWRWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLnRvcFxuICAgIDogdkVudW0uYm90dG9tO1xuICBsZXQgdGFpbFZlcnRpY2FsID0gYXJjLmNsb2Nrd2lzZVxuICAgID8gdkVudW0uYm90dG9tXG4gICAgOiB2RW51bS50b3A7XG4gIGxldCByYWRpdXNWZXJ0aWNhbCA9IGFyYy5jbG9ja3dpc2VcbiAgICA/IHZFbnVtLmJvdHRvbVxuICAgIDogdkVudW0udG9wO1xuXG4gIC8vIE5vcm1hbCBvcmllbnRhdGlvblxuICBsZXQgaGVhZEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgaGVhZFZlcnRpY2FsLFxuICAgIGFyYy5zdGFydCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5mb250LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLnNpemUpO1xuICBsZXQgdGFpbEZvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgdGFpbFZlcnRpY2FsLFxuICAgIGFyYy5lbmQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuZm9udCxcbiAgICBkcmF3ZXIuZGVidWdUZXh0T3B0aW9ucy5zaXplKTtcbiAgbGV0IHJhZGl1c0Zvcm1hdCA9IG5ldyBSYWMuVGV4dC5Gb3JtYXQoXG4gICAgcmFjLFxuICAgIGhFbnVtLmxlZnQsXG4gICAgcmFkaXVzVmVydGljYWwsXG4gICAgYXJjLnN0YXJ0LFxuICAgIGRyYXdlci5kZWJ1Z1RleHRPcHRpb25zLmZvbnQsXG4gICAgZHJhd2VyLmRlYnVnVGV4dE9wdGlvbnMuc2l6ZSk7XG5cbiAgLy8gUmV2ZXJzZSBvcmllbnRhdGlvblxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5zdGFydCkpIHtcbiAgICBoZWFkRm9ybWF0ID0gaGVhZEZvcm1hdC5pbnZlcnNlKCk7XG4gICAgcmFkaXVzRm9ybWF0ID0gcmFkaXVzRm9ybWF0LmludmVyc2UoKTtcbiAgfVxuICBpZiAocmV2ZXJzZXNUZXh0KGFyYy5lbmQpKSB7XG4gICAgdGFpbEZvcm1hdCA9IHRhaWxGb3JtYXQuaW52ZXJzZSgpO1xuICB9XG5cbiAgbGV0IHN0YXJ0U3RyaW5nID0gYHN0YXJ0OiR7YXJjLnN0YXJ0LnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG4gIGxldCByYWRpdXNTdHJpbmcgPSBgcmFkaXVzOiR7YXJjLnJhZGl1cy50b0ZpeGVkKGRpZ2l0cyl9YDtcbiAgbGV0IGVuZFN0cmluZyA9IGBlbmQ6JHthcmMuZW5kLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IGFuZ2xlRGlzdGFuY2UgPSBhcmMuYW5nbGVEaXN0YW5jZSgpO1xuICBsZXQgZGlzdGFuY2VTdHJpbmcgPSBgZGlzdGFuY2U6JHthbmdsZURpc3RhbmNlLnR1cm4udG9GaXhlZChkaWdpdHMpfWA7XG5cbiAgbGV0IHRhaWxTdHJpbmcgPSBgJHtkaXN0YW5jZVN0cmluZ31cXG4ke2VuZFN0cmluZ31gO1xuICBsZXQgaGVhZFN0cmluZztcblxuICAvLyBSYWRpdXMgbGFiZWxcbiAgaWYgKGFuZ2xlRGlzdGFuY2UudHVybiA8PSAzLzQgJiYgIWFyYy5pc0NpcmNsZSgpKSB7XG4gICAgLy8gUmFkaXVzIGRyYXduIHNlcGFyYXRlbHlcbiAgICBsZXQgcGVycEFuZ2xlID0gYXJjLnN0YXJ0LnBlcnBlbmRpY3VsYXIoIWFyYy5jbG9ja3dpc2UpO1xuICAgIGFyYy5jZW50ZXJcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMpXG4gICAgICAucG9pbnRUb0FuZ2xlKHBlcnBBbmdsZSwgcG9pbnRSYWRpdXMqMilcbiAgICAgIC50ZXh0KHJhZGl1c1N0cmluZywgcmFkaXVzRm9ybWF0KVxuICAgICAgLmRyYXcoZHJhd2VyLmRlYnVnVGV4dFN0eWxlKTtcbiAgICBoZWFkU3RyaW5nID0gc3RhcnRTdHJpbmc7XG4gIH0gZWxzZSB7XG4gICAgLy8gUmFkaXVzIGpvaW5lZCB0byBoZWFkXG4gICAgaGVhZFN0cmluZyA9IGAke3N0YXJ0U3RyaW5nfVxcbiR7cmFkaXVzU3RyaW5nfWA7XG4gIH1cblxuICBpZiAobGVuZ3RoQXRPcmllbnRhdGlvbkFyYyA+IHRleHRKb2luVGhyZXNob2xkKSB7XG4gICAgLy8gRHJhdyBzdHJpbmdzIHNlcGFyYXRlbHlcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KGhlYWRTdHJpbmcsIGhlYWRGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICAgIG9yaWVudGF0aW9uQXJjLnBvaW50QXRBbmdsZShhcmMuZW5kKVxuICAgICAgLnBvaW50VG9BbmdsZShhcmMuZW5kLCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KHRhaWxTdHJpbmcsIHRhaWxGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIC8vIERyYXcgc3RyaW5ncyB0b2dldGhlclxuICAgIGxldCBhbGxTdHJpbmdzID0gYCR7aGVhZFN0cmluZ31cXG4ke3RhaWxTdHJpbmd9YDtcbiAgICBvcmllbnRhdGlvbkFyYy5zdGFydFBvaW50KClcbiAgICAgIC5wb2ludFRvQW5nbGUoYXJjLnN0YXJ0LCBtYXJrZXJSYWRpdXMvMilcbiAgICAgIC50ZXh0KGFsbFN0cmluZ3MsIGhlYWRGb3JtYXQpXG4gICAgICAuZHJhdyhkcmF3ZXIuZGVidWdUZXh0U3R5bGUpO1xuICB9XG59OyAvLyBkZWJ1Z0FyY1xuXG5cbi8vIFRPRE86IGRlYnVnIHJvdXRpbmUgb2YgQmV6aWVyXG4vLyBUT0RPOiBkZWJ1ZyByb3V0aW5lIG9mIENvbXBvc2l0ZVxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBTaGFwZVxuLy8gVE9ETzogZGVidWcgcm91dGluZSBvZiBUZXh0XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcblxuXG5leHBvcnRzLmRyYXdQb2ludCA9IGZ1bmN0aW9uKGRyYXdlciwgcG9pbnQpIHtcbiAgZHJhd2VyLnA1LnBvaW50KHBvaW50LngsIHBvaW50LnkpO1xufTsgLy8gZHJhd1BvaW50XG5cblxuZXhwb3J0cy5kcmF3UmF5ID0gZnVuY3Rpb24oZHJhd2VyLCByYXkpIHtcbiAgbGV0IGVkZ2VQb2ludCA9IHJheS5wb2ludEF0Q2FudmFzRWRnZSgpO1xuXG4gIGlmIChlZGdlUG9pbnQgPT09IG51bGwpIHtcbiAgICAvLyBSYXkgaXMgb3V0c2lkZSBjYW52YXNcbiAgICByZXR1cm47XG4gIH1cblxuICBkcmF3ZXIucDUubGluZShcbiAgICByYXkuc3RhcnQueCwgcmF5LnN0YXJ0LnksXG4gICAgZWRnZVBvaW50LngsIGVkZ2VQb2ludC55KTtcbn07IC8vIGRyYXdSYXlcblxuXG5leHBvcnRzLmRyYXdTZWdtZW50ID0gZnVuY3Rpb24oZHJhd2VyLCBzZWdtZW50KSB7XG4gIGNvbnN0IHN0YXJ0ID0gc2VnbWVudC5yYXkuc3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHNlZ21lbnQuZW5kUG9pbnQoKTtcbiAgZHJhd2VyLnA1LmxpbmUoXG4gICAgc3RhcnQueCwgc3RhcnQueSxcbiAgICBlbmQueCwgICBlbmQueSk7XG59OyAvLyBkcmF3U2VnbWVudFxuXG5cbmV4cG9ydHMuZHJhd0FyYyA9IGZ1bmN0aW9uKGRyYXdlciwgYXJjKSB7XG4gIGlmIChhcmMuaXNDaXJjbGUoKSkge1xuICAgIGxldCBzdGFydFJhZCA9IGFyYy5zdGFydC5yYWRpYW5zKCk7XG4gICAgbGV0IGVuZFJhZCA9IHN0YXJ0UmFkICsgUmFjLlRBVTtcbiAgICBkcmF3ZXIucDUuYXJjKFxuICAgICAgYXJjLmNlbnRlci54LCBhcmMuY2VudGVyLnksXG4gICAgICBhcmMucmFkaXVzICogMiwgYXJjLnJhZGl1cyAqIDIsXG4gICAgICBzdGFydFJhZCwgZW5kUmFkKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgc3RhcnQgPSBhcmMuc3RhcnQ7XG4gIGxldCBlbmQgPSBhcmMuZW5kO1xuICBpZiAoIWFyYy5jbG9ja3dpc2UpIHtcbiAgICBzdGFydCA9IGFyYy5lbmQ7XG4gICAgZW5kID0gYXJjLnN0YXJ0O1xuICB9XG5cbiAgZHJhd2VyLnA1LmFyYyhcbiAgICBhcmMuY2VudGVyLngsIGFyYy5jZW50ZXIueSxcbiAgICBhcmMucmFkaXVzICogMiwgYXJjLnJhZGl1cyAqIDIsXG4gICAgc3RhcnQucmFkaWFucygpLCBlbmQucmFkaWFucygpKTtcbn07IC8vIGRyYXdBcmNcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlsL3V0aWxzJyk7XG5cblxuLyoqXG4qIENvbG9yIHdpdGggUkJHQSB2YWx1ZXMsIGVhY2ggb25lIG9uIHRoZSAqWzAsMV0qIHJhbmdlLlxuKlxuKiBAYWxpYXMgUmFjLkNvbG9yXG4qL1xuY2xhc3MgQ29sb3Ige1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSB7UmFjfSByYWMgLSBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDFdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gW2E9MV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwxXSogcmFuZ2VcbiAgKi9cbiAgY29uc3RydWN0b3IocmFjLCByLCBnLCBiLCBhID0gMSkge1xuICAgIHV0aWxzLmFzc2VydEV4aXN0cyhyYWMsIHIsIGcsIGIsIGEpO1xuICAgIHV0aWxzLmFzc2VydE51bWJlcihyLCBnLCBiLCBhKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgcmVkIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLnIgPSByO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgZ3JlZW4gY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuZyA9IGc7XG5cbiAgICAvKipcbiAgICAqIFRoZSBibHVlIGNoYW5uZWwgb2YgdGhlIGNvbG9yLCBpbiB0aGUgKlswLDFdKiByYW5nZS5cbiAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgKi9cbiAgICB0aGlzLmIgPSBiO1xuXG4gICAgLyoqXG4gICAgKiBUaGUgYWxwaGEgY2hhbm5lbCBvZiB0aGUgY29sb3IsIGluIHRoZSAqWzAsMV0qIHJhbmdlLlxuICAgICogQHR5cGUge251bWJlcn1cbiAgICAqL1xuICAgIHRoaXMuYSA9IGE7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW50ZW5kZWQgZm9yIGh1bWFuIGNvbnN1bXB0aW9uLlxuICAqXG4gICogQHJldHVybnMge3N0cmluZ31cbiAgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBDb2xvcigke3RoaXMucn0sJHt0aGlzLmd9LCR7dGhpcy5ifSwke3RoaXMuYX0pYDtcbiAgfVxuXG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgQ29sb3JgIGluc3RhbmNlIHdpdGggZWFjaCBjaGFubmVsIHJlY2VpdmVkIGluIHRoZVxuICAqICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHVzZSBmb3IgZHJhd2luZyBhbmQgY3JlYXRpbmcgb3RoZXIgb2JqZWN0c1xuICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqIEBwYXJhbSB7bnVtYmVyfSBbYT0yNTVdIC0gVGhlIGFscGhhIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKlxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHN0YXRpYyBmcm9tUmdiYShyYWMsIHIsIGcsIGIsIGEgPSAyNTUpIHtcbiAgICByZXR1cm4gbmV3IENvbG9yKHJhYywgci8yNTUsIGcvMjU1LCBiLzI1NSwgYS8yNTUpO1xuICB9XG5cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBDb2xvcmAgaW5zdGFuY2UgZnJvbSBhIGhleGFkZWNpbWFsIHRyaXBsZXQgc3RyaW5nLlxuICAqXG4gICogVGhlIGBoZXhTdHJpbmdgIGlzIGV4cGVjdGVkIHRvIGhhdmUgNiBkaWdpdHMgYW5kIGNhbiBvcHRpb25hbGx5IHN0YXJ0XG4gICogd2l0aCBgI2AuIGBBQUJCQ0NgIGFuZCBgI0RERUVGRmAgYXJlIGJvdGggdmFsaWQgaW5wdXRzLCB0aGUgdGhyZWUgZGlnaXRcbiAgKiBzaG9ydGhhbmQgaXMgbm90IHlldCBzdXBwb3J0ZWQuXG4gICpcbiAgKiBBbiBlcnJvciBpcyB0aHJvd24gaWYgYGhleFN0cmluZ2AgaXMgbWlzZm9ybWF0dGVkIG9yIGNhbm5vdCBiZSBwYXJzZWQuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHtzdHJpbmd9IGhleFN0cmluZyAtIFRoZSBSR0IgaGV4IHRyaXBsZXQgdG8gaW50ZXJwcmV0XG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICBzdGF0aWMgZnJvbUhleChyYWMsIGhleFN0cmluZykge1xuICAgIGlmIChoZXhTdHJpbmcuY2hhckF0KDApID09ICcjJykge1xuICAgICAgaGV4U3RyaW5nID0gaGV4U3RyaW5nLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBpZiAoaGV4U3RyaW5nLmxlbmd0aCAhPSA2KSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYFVuZXhwZWN0ZWQgbGVuZ3RoIGZvciBoZXggdHJpcGxldCBzdHJpbmc6ICR7aGV4U3RyaW5nfWApO1xuICAgIH1cblxuICAgIGxldCByU3RyID0gaGV4U3RyaW5nLnN1YnN0cmluZygwLCAyKTtcbiAgICBsZXQgZ1N0ciA9IGhleFN0cmluZy5zdWJzdHJpbmcoMiwgNCk7XG4gICAgbGV0IGJTdHIgPSBoZXhTdHJpbmcuc3Vic3RyaW5nKDQsIDYpO1xuXG4gICAgbGV0IG5ld1IgPSBwYXJzZUludChyU3RyLCAxNik7XG4gICAgbGV0IG5ld0cgPSBwYXJzZUludChnU3RyLCAxNik7XG4gICAgbGV0IG5ld0IgPSBwYXJzZUludChiU3RyLCAxNik7XG5cbiAgICBpZiAoaXNOYU4obmV3UikgfHwgaXNOYU4obmV3RykgfHwgaXNOYU4obmV3QikpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgQ291bGQgbm90IHBhcnNlIGhleCB0cmlwbGV0IHN0cmluZzogJHtoZXhTdHJpbmd9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDb2xvcihyYWMsIG5ld1IvMjU1LCBuZXdHLzI1NSwgbmV3Qi8yNTUpO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBGaWxsYCB0aGF0IHVzZXMgYHRoaXNgIGFzIGBjb2xvcmAuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICovXG4gIGZpbGwoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuRmlsbCh0aGlzLnJhYywgdGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgdGhhdCB1c2VzIGB0aGlzYCBhcyBgY29sb3JgLlxuICAqXG4gICogQHBhcmFtIHs/bnVtYmVyfSB3ZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBuZXcgYFN0cm9rZWBcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgc3Ryb2tlKHdlaWdodCA9IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHJva2UodGhpcy5yYWMsIHdlaWdodCwgdGhpcyk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGBhYCBzZXQgdG8gYG5ld0FscGhhYC5cbiAgKlxuICAqIEBwYXJhbSB7bnVtYmVyfSBuZXdBbHBoYSAtIFRoZSBhbHBoYSBjaGFubmVsIGZvciB0aGUgbmV3IGBDb2xvcmAsIGluIHRoZVxuICAqICAgKlswLDFdKiByYW5nZVxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHdpdGhBbHBoYShuZXdBbHBoYSkge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIG5ld0FscGhhKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIHdpdGggYGFgIHNldCB0byBgdGhpcy5hICogcmF0aW9gLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHJhdGlvIC0gVGhlIGZhY3RvciB0byBtdWx0aXBseSBgYWAgYnlcbiAgKiBAcmV0dXJucyB7UmFjLkNvbG9yfVxuICAqL1xuICB3aXRoQWxwaGFSYXRpbyhyYXRpbykge1xuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYSAqIHJhdGlvKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgQ29sb3JgIGluIHRoZSBsaW5lYXIgdHJhbnNpdGlvbiBiZXR3ZWVuIGB0aGlzYCBhbmRcbiAgKiBgdGFyZ2V0YCBhdCBhIGByYXRpb2AgaW4gdGhlIHJhbmdlICpbMCwxXSouXG4gICpcbiAgKiBXaGVuIGByYXRpb2AgaXMgYDBgIG9yIGxlc3MgdGhlIG5ldyBgQ29sb3JgIGlzIGVxdWl2YWxlbnQgdG8gYHRoaXNgLFxuICAqIHdoZW4gYHJhdGlvYCBpcyBgMWAgb3IgbGFyZ2VyIHRoZSBuZXcgYENvbG9yYCBpcyBlcXVpdmFsZW50IHRvXG4gICogYHRhcmdldGAuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gLSBUaGUgdHJhbnNpdGlvbiByYXRpbyBmb3IgdGhlIG5ldyBgQ29sb3JgXG4gICogQHBhcmFtIHtSYWMuQ29sb3J9IHRhcmdldCAtIFRoZSB0cmFuc2l0aW9uIHRhcmdldCBgQ29sb3JgXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKi9cbiAgbGluZWFyVHJhbnNpdGlvbihyYXRpbywgdGFyZ2V0KSB7XG4gICAgcmF0aW8gPSBNYXRoLm1heChyYXRpbywgMCk7XG4gICAgcmF0aW8gPSBNYXRoLm1pbihyYXRpbywgMSk7XG5cbiAgICBsZXQgbmV3UiA9IHRoaXMuciArICh0YXJnZXQuciAtIHRoaXMucikgKiByYXRpbztcbiAgICBsZXQgbmV3RyA9IHRoaXMuZyArICh0YXJnZXQuZyAtIHRoaXMuZykgKiByYXRpbztcbiAgICBsZXQgbmV3QiA9IHRoaXMuYiArICh0YXJnZXQuYiAtIHRoaXMuYikgKiByYXRpbztcbiAgICBsZXQgbmV3QSA9IHRoaXMuYSArICh0YXJnZXQuYSAtIHRoaXMuYSkgKiByYXRpbztcblxuICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yYWMsIG5ld1IsIG5ld0csIG5ld0IsIG5ld0EpO1xuICB9XG5cbn0gLy8gY2xhc3MgQ29sb3JcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yO1xuXG4iLCIgICd1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBGaWxsIFtjb2xvcl17QGxpbmsgUmFjLkNvbG9yfSBmb3IgZHJhd2luZy5cbipcbiogQ2FuIGJlIHVzZWQgYXMgYGZpbGwuYXBwbHkoKWAgdG8gYXBwbHkgdGhlIGZpbGwgc2V0dGluZ3MgZ2xvYmFsbHksIG9yIGFzXG4qIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoZmlsbClgIHRvIGFwcGx5IHRoZSBmaWxsIG9ubHkgZm9yIHRoYXRcbiogYGRyYXdgLlxuKlxuKiBXaGVuIGBjb2xvcmAgaXMgYG51bGxgIGEgKm5vLWZpbGwqIHNldHRpbmcgaXMgYXBwbGllZC5cbipcbiogQGFsaWFzIFJhYy5GaWxsXG4qL1xuY2xhc3MgRmlsbCB7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgRmlsbGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gdXNlIGZvciBkcmF3aW5nIGFuZCBjcmVhdGluZyBvdGhlciBvYmplY3RzXG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBjb2xvciAtIEEgYENvbG9yYCBmb3IgdGhlIGZpbGwgc2V0dGluZywgb3IgYG51bGxgXG4gICogICB0byBhcHBseSBhICpuby1maWxsKiBzZXR0aW5nXG4gICovXG4gIGNvbnN0cnVjdG9yKHJhYywgY29sb3IpIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcbiAgICBjb2xvciAhPT0gbnVsbCAmJiB1dGlscy5hc3NlcnRUeXBlKFJhYy5Db2xvciwgY29sb3IpO1xuXG4gICAgLyoqXG4gICAgKiBJbnN0YW5jZSBvZiBgUmFjYCB1c2VkIGZvciBkcmF3aW5nIGFuZCBwYXNzZWQgYWxvbmcgdG8gYW55IGNyZWF0ZWRcbiAgICAqIG9iamVjdC5cbiAgICAqXG4gICAgKiBAdHlwZSB7UmFjfVxuICAgICovXG4gICAgdGhpcy5yYWMgPSByYWM7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgYEZpbGxgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgRmlsbGAsIHJldHVybnMgdGhhdCBzYW1lIG9iamVjdC5cbiAgKiArIFdoZW4gYHNvbWV0aGluZ2AgaXMgYW4gaW5zdGFuY2Ugb2YgYENvbG9yYCwgcmV0dXJucyBhIG5ldyBgRmlsbGBcbiAgKiAgIHVzaW5nIGBzb21ldGhpbmdgIGFzIGBjb2xvcmAuXG4gICogKyBXaGVuIGBzb21ldGhpbmdgIGlzIGFuIGluc3RhbmNlIG9mIGBTdHJva2VgLCByZXR1cm5zIGEgbmV3IGBGaWxsYFxuICAqICAgdXNpbmcgYHN0cm9rZS5jb2xvcmAuXG4gICogKyBPdGhlcndpc2UgYW4gZXJyb3IgaXMgdGhyb3duLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtIEluc3RhbmNlIHRvIHBhc3MgYWxvbmcgdG8gbmV3bHkgY3JlYXRlZCBvYmplY3RzXG4gICogQHBhcmFtIHtSYWMuRmlsbHxSYWMuQ29sb3J8UmFjLlN0cm9rZX0gc29tZXRoaW5nIC0gQW4gb2JqZWN0IHRvXG4gICogZGVyaXZlIGEgYEZpbGxgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLkZpbGx9XG4gICovXG4gIHN0YXRpYyBmcm9tKHJhYywgc29tZXRoaW5nKSB7XG4gICAgaWYgKHNvbWV0aGluZyBpbnN0YW5jZW9mIEZpbGwpIHtcbiAgICAgIHJldHVybiBzb21ldGhpbmc7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuQ29sb3IpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsbChyYWMsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuU3Ryb2tlKSB7XG4gICAgICByZXR1cm4gbmV3IEZpbGwocmFjLCBzb21ldGhpbmcuY29sb3IpO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuRmlsbCAtIHNvbWV0aGluZy10eXBlOiR7dXRpbHMudHlwZU5hbWUoc29tZXRoaW5nKX1gKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIGNvbnRhaW5pbmcgb25seSBgdGhpc2AuXG4gICpcbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqL1xuICBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgYHN0eWxlYC4gV2hlblxuICAqIGBzdHlsZWAgaXMgYG51bGxgLCByZXR1cm5zIGB0aGlzYCBpbnN0ZWFkLlxuICAqXG4gICogQHBhcmFtIHs/UmFjLlN0cm9rZXxSYWMuRmlsbHxSYWMuU3R5bGVDb250YWluZXJ9IHN0eWxlIC0gQSBzdHlsZSBvYmplY3RcbiAgKiAgIHRvIGNvbnRhaW4gYWxvbmcgYHRoaXNgXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcnxSYWMuRmlsbH1cbiAgKi9cbiAgYXBwZW5kU3R5bGUoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIHN0eWxlXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgdGhlIGBTdHJva2VgXG4gICogZGVyaXZlZCBbZnJvbV17QGxpbmsgUmFjLlN0cm9rZS5mcm9tfSBgc29tZVN0cm9rZWAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2V8UmFjLkNvbG9yfFJhYy5GaWxsfSBzb21lU3Ryb2tlIC0gQW4gb2JqZWN0IHRvIGRlcml2ZVxuICAqICAgYSBgU3Ryb2tlYCBmcm9tXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKlxuICAqIEBzZWUgUmFjLlN0cm9rZS5mcm9tXG4gICovXG4gIGFwcGVuZFN0cm9rZShzb21lU3Ryb2tlKSB7XG4gICAgbGV0IHN0cm9rZSA9IFJhYy5TdHJva2UuZnJvbSh0aGlzLnJhYywgc29tZVN0cm9rZSk7XG4gICAgcmV0dXJuIG5ldyBSYWMuU3R5bGVDb250YWluZXIodGhpcy5yYWMsIFt0aGlzLCBzdHJva2VdKTtcbiAgfVxuXG59IC8vIGNsYXNzIEZpbGxcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGw7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuXG5jb25zdCBSYWMgPSByZXF1aXJlKCcuLi9SYWMnKTtcbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbC91dGlscycpO1xuXG5cbi8qKlxuKiBTdHJva2Ugd2VpZ2h0IGFuZCBbY29sb3Jde0BsaW5rIFJhYy5Db2xvcn0gZm9yIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBzdHJva2UuYXBwbHkoKWAgdG8gYXBwbHkgdGhlIHN0cm9rZSBzZXR0aW5ncyBnbG9iYWxseSwgb3JcbiogYXMgdGhlIHBhcmFtZXRlciBvZiBgZHJhd2FibGUuZHJhdyhzdHJva2UpYCB0byBhcHBseSB0aGUgc3Ryb2tlIG9ubHkgZm9yXG4qIHRoYXQgYGRyYXdgLlxuKlxuKiBUaGUgaW5zdGFuY2UgYXBwbGllcyB0aGUgc3Ryb2tlIGNvbG9yIGFuZCB3ZWlnaHQgc2V0dGluZ3MgaW4gdGhlXG4qIGZvbGxvd2luZyBjb21iaW5hdGlvbnM6XG4qICsgd2hlbiBgY29sb3IgPSBudWxsYCBhbmQgYHdlaWdodCA9IG51bGxgOiBhICpuby1zdHJva2UqIHNldHRpbmcgaXNcbiogICBhcHBsaWVkXG4qICsgd2hlbiBgY29sb3JgIGlzIHNldCBhbmQgYHdlaWdodCA9IG51bGxgOiBvbmx5IHRoZSBzdHJva2UgY29sb3IgaXNcbiogICBhcHBsaWVkLCBzdHJva2Ugd2VpZ2h0IGlzIG5vdCBtb2RpZmllZFxuKiArIHdoZW4gYHdlaWdodGAgaXMgc2V0IGFuZCBgY29sb3IgPSBudWxsYDogb25seSB0aGUgc3Ryb2tlIHdlaWdodCBpc1xuKiAgIGFwcGxpZWQsIHN0cm9rZSBjb2xvciBpcyBub3QgbW9kaWZpZWRcbiogKyB3aGVuIGJvdGggYGNvbG9yYCBhbmQgYHdlaWdodGAgYXJlIHNldDogYm90aCBzdHJva2UgY29sb3IgYW5kIHdlaWdodFxuKiAgIGFyZSBhcHBsaWVkXG4qXG4qIEBhbGlhcyBSYWMuU3Ryb2tlXG4qL1xuY2xhc3MgU3Ryb2tlIHtcblxuICAvKipcbiAgKiBDcmVhdGVzIGEgbmV3IGBTdHJva2VgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIHtSYWN9IHJhYyAtICBJbnN0YW5jZSB0byB1c2UgZm9yIGRyYXdpbmcgYW5kIGNyZWF0aW5nIG90aGVyIG9iamVjdHNcbiAgKiBAcGFyYW0gez9udW1iZXJ9IHdlaWdodCAtIFRoZSB3ZWlnaHQgb2YgdGhlIHN0cm9rZSwgb3IgYG51bGxgIHRvIHNraXAgd2VpZ2h0XG4gICogQHBhcmFtIHs/UmFjLkNvbG9yfSBbY29sb3I9bnVsbF0gLSBBIGBDb2xvcmAgZm9yIHRoZSBzdHJva2UsIG9yIGBudWxsYFxuICAqICAgdG8gc2tpcCBjb2xvclxuICAqL1xuICBjb25zdHJ1Y3RvcihyYWMsIHdlaWdodCwgY29sb3IgPSBudWxsKSB7XG4gICAgdXRpbHMuYXNzZXJ0RXhpc3RzKHJhYyk7XG4gICAgd2VpZ2h0ICE9PSBudWxsICYmIHV0aWxzLmFzc2VydE51bWJlcih3ZWlnaHQpO1xuICAgIGNvbG9yICE9PSBudWxsICYmIHV0aWxzLmFzc2VydFR5cGUoUmFjLkNvbG9yLCBjb2xvcik7XG5cbiAgICAvKipcbiAgICAqIEluc3RhbmNlIG9mIGBSYWNgIHVzZWQgZm9yIGRyYXdpbmcgYW5kIHBhc3NlZCBhbG9uZyB0byBhbnkgY3JlYXRlZFxuICAgICogb2JqZWN0LlxuICAgICpcbiAgICAqIEB0eXBlIHtSYWN9XG4gICAgKi9cbiAgICB0aGlzLnJhYyA9IHJhY1xuICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLndlaWdodCA9IHdlaWdodDtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIGBTdHJva2VgIGRlcml2ZWQgZnJvbSBgc29tZXRoaW5nYC5cbiAgKlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgU3Ryb2tlYCwgcmV0dXJucyB0aGF0IHNhbWUgb2JqZWN0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgQ29sb3JgLCByZXR1cm5zIGEgbmV3IGBTdHJva2VgXG4gICogICB1c2luZyBgc29tZXRoaW5nYCBhcyBgY29sb3JgIGFuZCBhIGBudWxsYCBzdHJva2Ugd2VpZ2h0LlxuICAqICsgV2hlbiBgc29tZXRoaW5nYCBpcyBhbiBpbnN0YW5jZSBvZiBgRmlsbGAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWBcbiAgKiAgIHVzaW5nIGBmaWxsLmNvbG9yYCBhbmQgYSBgbnVsbGAgc3Ryb2tlIHdlaWdodC5cbiAgKiArIE90aGVyd2lzZSBhbiBlcnJvciBpcyB0aHJvd24uXG4gICpcbiAgKiBAcGFyYW0ge1JhY30gcmFjIC0gSW5zdGFuY2UgdG8gcGFzcyBhbG9uZyB0byBuZXdseSBjcmVhdGVkIG9iamVjdHNcbiAgKiBAcGFyYW0ge1JhYy5TdHJva2V8UmFjLkNvbG9yfFJhYy5GaWxsfSBzb21ldGhpbmcgLSBBbiBvYmplY3QgdG9cbiAgKiAgIGRlcml2ZSBhIGBTdHJva2VgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgc3RhdGljIGZyb20ocmFjLCBzb21ldGhpbmcpIHtcbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgU3Ryb2tlKSB7XG4gICAgICByZXR1cm4gc29tZXRoaW5nO1xuICAgIH1cbiAgICBpZiAoc29tZXRoaW5nIGluc3RhbmNlb2YgUmFjLkNvbG9yKSB7XG4gICAgICByZXR1cm4gbmV3IFN0cm9rZShyYWMsIG51bGwsIHNvbWV0aGluZyk7XG4gICAgfVxuICAgIGlmIChzb21ldGhpbmcgaW5zdGFuY2VvZiBSYWMuRmlsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UocmFjLCBudWxsLCBzb21ldGhpbmcuY29sb3IpO1xuICAgIH1cblxuICAgIHRocm93IFJhYy5FeGNlcHRpb24uaW52YWxpZE9iamVjdFR5cGUoXG4gICAgICBgQ2Fubm90IGRlcml2ZSBSYWMuU3Ryb2tlIC0gc29tZXRoaW5nLXR5cGU6JHt1dGlscy50eXBlTmFtZShzb21ldGhpbmcpfWApO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHJva2VgIHdpdGggYHdlaWdodGAgc2V0IHRvIGBuZXdXZWlnaHRgLlxuICAqXG4gICogQHBhcmFtIHs/bnVtYmVyfSBuZXdXZWlnaHQgLSBUaGUgd2VpZ2h0IG9mIHRoZSBzdHJva2UsIG9yIGBudWxsYCB0byBza2lwXG4gICogICB3ZWlnaHRcbiAgKiBAcmV0dXJucyB7UmFjLlN0cm9rZX1cbiAgKi9cbiAgd2l0aFdlaWdodChuZXdXZWlnaHQpIHtcbiAgICByZXR1cm4gbmV3IFN0cm9rZSh0aGlzLnJhYywgbmV3V2VpZ2h0LCB0aGlzLmNvbG9yLCk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0cm9rZWAgd2l0aCBhIGNvcHkgb2YgYGNvbG9yYCBzZXR1cCB3aXRoIGBuZXdBbHBoYWAsXG4gICogYW5kIHRoZSBzYW1lIGBzdHJva2VgIGFzIGB0aGlzYC5cbiAgKlxuICAqIFdoZW4gYHRoaXMuY29sb3JgIGlzIHNldCB0byBgbnVsbGAsIHJldHVybnMgYSBuZXcgYFN0cm9rZWAgdGhhdCBpcyBhXG4gICogY29weSBvZiBgdGhpc2AuXG4gICpcbiAgKiBAcGFyYW0ge251bWJlcn0gbmV3QWxwaGEgLSBUaGUgYWxwaGEgY2hhbm5lbCBvZiB0aGUgYGNvbG9yYCBvZiB0aGUgbmV3XG4gICogICBgU3Ryb2tlYFxuICAqIEByZXR1cm5zIHtSYWMuU3Ryb2tlfVxuICAqL1xuICB3aXRoQWxwaGEobmV3QWxwaGEpIHtcbiAgICBpZiAodGhpcy5jb2xvciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIHRoaXMud2VpZ2h0LCBudWxsKTtcbiAgICB9XG5cbiAgICBsZXQgbmV3Q29sb3IgPSB0aGlzLmNvbG9yLndpdGhBbHBoYShuZXdBbHBoYSk7XG4gICAgcmV0dXJuIG5ldyBTdHJva2UodGhpcy5yYWMsIHRoaXMud2VpZ2h0LCBuZXdDb2xvcik7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIG9ubHkgYHRoaXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBbdGhpc10pO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmAgY29udGFpbmluZyBgdGhpc2AgYW5kIGBzdHlsZWAuIFdoZW5cbiAgKiBgc3R5bGVgIGlzIGBudWxsYCwgcmV0dXJucyBgdGhpc2AgaW5zdGVhZC5cbiAgKlxuICAqIEBwYXJhbSB7P1JhYy5TdHJva2V8UmFjLkZpbGx8UmFjLlN0eWxlQ29udGFpbmVyfSBzdHlsZSAtIEEgc3R5bGUgb2JqZWN0XG4gICogICB0byBjb250YWluIGFsb25nIGB0aGlzYFxuICAqIEByZXR1cm5zIHtSYWMuU3R5bGVDb250YWluZXJ8UmFjLlN0cm9rZX1cbiAgKi9cbiAgYXBwZW5kU3R5bGUoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIHN0eWxlXSk7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGB0aGlzYCBhbmQgdGhlIGBGaWxsYFxuICAqIGRlcml2ZWQgW2Zyb21de0BsaW5rIFJhYy5GaWxsLmZyb219IGBzb21lRmlsbGAuXG4gICpcbiAgKiBAcGFyYW0ge1JhYy5GaWxsfFJhYy5Db2xvcnxSYWMuU3Ryb2tlfSBzb21lRmlsbCAtIEFuIG9iamVjdCB0byBkZXJpdmVcbiAgKiAgIGEgYEZpbGxgIGZyb21cbiAgKiBAcmV0dXJucyB7UmFjLlN0eWxlQ29udGFpbmVyfVxuICAqXG4gICogQHNlZSBSYWMuRmlsbC5mcm9tXG4gICovXG4gIGFwcGVuZEZpbGwoc29tZUZpbGwpIHtcbiAgICBsZXQgZmlsbCA9IFJhYy5GaWxsLmZyb20odGhpcy5yYWMsIHNvbWVGaWxsKTtcbiAgICByZXR1cm4gbmV3IFJhYy5TdHlsZUNvbnRhaW5lcih0aGlzLnJhYywgW3RoaXMsIGZpbGxdKTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0cm9rZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3Ryb2tlO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vKipcbiogQ29udGFpbmVyIG9mIGBbU3Ryb2tlXXtAbGluayBSYWMuU3Ryb2tlfWAgYW5kIGBbRmlsbF17QGxpbmsgUmFjLkZpbGx9YFxuKiBvYmplY3RzIHdoaWNoIGdldCBhcHBsaWVkIHNlcXVlbnRpYWxseSB3aGVuIGRyYXdpbmcuXG4qXG4qIENhbiBiZSB1c2VkIGFzIGBjb250YWluZXIuYXBwbHkoKWAgdG8gYXBwbHkgdGhlIGNvbnRhaW5lZCBzdHlsZXNcbiogZ2xvYmFsbHksIG9yIGFzIHRoZSBwYXJhbWV0ZXIgb2YgYGRyYXdhYmxlLmRyYXcoY29udGFpbmVyKWAgdG8gYXBwbHkgdGhlXG4qIHN0eWxlIHNldHRpbmdzIG9ubHkgZm9yIHRoYXQgYGRyYXdgLlxuKlxuKiBAYWxpYXMgUmFjLlN0eWxlQ29udGFpbmVyXG4qL1xuY2xhc3MgU3R5bGVDb250YWluZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJhYywgc3R5bGVzID0gW10pIHtcbiAgICB1dGlscy5hc3NlcnRFeGlzdHMocmFjKTtcblxuICAgIC8qKlxuICAgICogSW5zdGFuY2Ugb2YgYFJhY2AgdXNlZCBmb3IgZHJhd2luZyBhbmQgcGFzc2VkIGFsb25nIHRvIGFueSBjcmVhdGVkXG4gICAgKiBvYmplY3QuXG4gICAgKlxuICAgICogQHR5cGUge1JhY31cbiAgICAqL1xuICAgIHRoaXMucmFjID0gcmFjO1xuXG4gICAgLyoqXG4gICAgKiBDb250YWluZXIgb2Ygc3R5bGUgb2JqZWN0cyB0byBhcHBseS5cbiAgICAqXG4gICAgKiBDYW4gYmUgbWFuaXB1bGF0ZWQgZGlyZWN0bHkgdG8gYWRkIG9yIHJlbW92ZSBzdHlsZXMgZnJvbSBgdGhpc2AuXG4gICAgKiBNb3N0IG9mIHRoZSBpbXBsZW1lbnRlZCBtZXRob2RzIGxpa2VcbiAgICAqIGBbYWRkXXtAbGluayBSYWMuU3R5bGVDb250YWluZXIjYWRkfWAgcmV0dXJuIGEgbmV3IGBTdHlsZUNvbnRhaW5lcmBcbiAgICAqIHdpdGggYW4gY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAgICpcbiAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAqL1xuICAgIHRoaXMuc3R5bGVzID0gc3R5bGVzO1xuICB9XG5cblxuICAvKipcbiAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIGludGVuZGVkIGZvciBodW1hbiBjb25zdW1wdGlvbi5cbiAgKlxuICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICovXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCBjb250ZW50cyA9IHRoaXMuc3R5bGVzLmpvaW4oJyAnKTtcbiAgICByZXR1cm4gYFN0eWxlQ29udGFpbmVyKCR7Y29udGVudHN9KWA7XG4gIH1cblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYFN0eWxlQ29udGFpbmVyYCBjb250YWluaW5nIGEgY29weSBvZiBgdGhpcy5zdHlsZXNgLlxuICAqXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgY29udGFpbmVyKCkge1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCB0aGlzLnN0eWxlcy5zbGljZSgpKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogUmV0dXJucyBhIG5ldyBgU3R5bGVDb250YWluZXJgIHdpdGggYHN0eWxlYCBhcHBlbmRlZCBhdCB0aGUgZW5kIG9mXG4gICogYHN0eWxlc2AuIFdoZW4gYHN0eWxlYCBpcyBgbnVsbGAsIHJldHVybnMgYHRoaXNgIGluc3RlYWQuXG4gICpcbiAgKiBgdGhpc2AgaXMgbm90IG1vZGlmaWVkIGJ5IHRoaXMgbWV0aG9kLCB0aGUgbmV3IGBTdHlsZUNvbnRhaW5lcmAgaXNcbiAgKiBjcmVhdGVkIHdpdGggYSBjb3B5IG9mIGB0aGlzLnN0eWxlc2AuXG4gICpcbiAgKiBAcGFyYW0gez9SYWMuU3Ryb2tlfFJhYy5GaWxsfFJhYy5TdHlsZUNvbnRhaW5lcn0gc3R5bGUgLSBBIHN0eWxlIG9iamVjdFxuICAqICAgdG8gYXBwZW5kIHRvIGBzdHlsZXNgXG4gICogQHJldHVybnMge1JhYy5TdHlsZUNvbnRhaW5lcn1cbiAgKi9cbiAgYXBwZW5kU3R5bGUoc3R5bGUpIHtcbiAgICBpZiAoc3R5bGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGxldCBzdHlsZXNDb3B5ID0gdGhpcy5zdHlsZXMuc2xpY2UoKTtcbiAgICBzdHlsZXNDb3B5LnB1c2goc3R5bGUpO1xuICAgIHJldHVybiBuZXcgUmFjLlN0eWxlQ29udGFpbmVyKHRoaXMucmFjLCBzdHlsZXNDb3B5KTtcbiAgfVxuXG59IC8vIGNsYXNzIFN0eWxlQ29udGFpbmVyXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHlsZUNvbnRhaW5lcjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkNvbG9yYCBmdW5jdGlvbiBjb250YWlucyBjb252ZW5pZW5jZSBtZXRob2RzIGFuZCBtZW1iZXJzXG4qIGZvciBge0BsaW5rIFJhYy5Db2xvcn1gIG9iamVjdHMgc2V0dXAgd2l0aCB0aGUgb3duaW5nIGBSYWNgIGluc3RhbmNlLlxuKlxuKiBAbmFtZXNwYWNlIGluc3RhbmNlLkNvbG9yXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNDb2xvcihyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCB3aXRoIGVhY2ggY2hhbm5lbCByZWNlaXZlZCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlLlxuICAqXG4gICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIGNoYW5uZWwgdmFsdWUsIGluIHRoZSAqWzAsMjU1XSogcmFuZ2VcbiAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IGIgLSBUaGUgYmx1ZSBjaGFubmVsIHZhbHVlLCBpbiB0aGUgKlswLDI1NV0qIHJhbmdlXG4gICogQHBhcmFtIHtudW1iZXJ9IFthPTI1NV0gLSBUaGUgYWxwaGEgY2hhbm5lbCB2YWx1ZSwgaW4gdGhlICpbMCwyNTVdKiByYW5nZVxuICAqXG4gICogQHJldHVybnMge1JhYy5Db2xvcn1cbiAgKlxuICAqIEBmdW5jdGlvbiBmcm9tUmdiYVxuICAqIEBtZW1iZXJvZiBpbnN0YW5jZS5Db2xvciNcbiAgKi9cbiAgcmFjLkNvbG9yLmZyb21SZ2JhID0gZnVuY3Rpb24ociwgZywgYiwgYSA9IDI1NSkge1xuICAgIHJldHVybiBSYWMuQ29sb3IuZnJvbVJnYmEocmFjLCByLCBnLCBiLCBhKTtcbiAgfTtcblxuXG4gIC8qKlxuICAqIFJldHVybnMgYSBuZXcgYENvbG9yYCBpbnN0YW5jZSBmcm9tIGEgaGV4YWRlY2ltYWwgdHJpcGxldCBzdHJpbmcuXG4gICpcbiAgKiBUaGUgYGhleFN0cmluZ2AgaXMgZXhwZWN0ZWQgdG8gaGF2ZSA2IGRpZ2l0cyBhbmQgY2FuIG9wdGlvbmFsbHkgc3RhcnRcbiAgKiB3aXRoIGAjYC4gYEFBQkJDQ2AgYW5kIGAjRERFRUZGYCBhcmUgYm90aCB2YWxpZCBpbnB1dHMsIHRoZSB0aHJlZSBkaWdpdFxuICAqIHNob3J0aGFuZCBpcyBub3QgeWV0IHN1cHBvcnRlZC5cbiAgKlxuICAqIEFuIGVycm9yIGlzIHRocm93biBpZiBgaGV4U3RyaW5nYCBpcyBtaXNmb3JtYXR0ZWQgb3IgY2Fubm90IGJlIHBhcnNlZC5cbiAgKlxuICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHJpbmcgLSBUaGUgUkdCIGhleCB0cmlwbGV0IHRvIGludGVycHJldFxuICAqIEByZXR1cm5zIHtSYWMuQ29sb3J9XG4gICovXG4gIHJhYy5Db2xvci5mcm9tSGV4ID0gZnVuY3Rpb24oaGV4U3RyaW5nKSB7XG4gICAgcmV0dXJuIFJhYy5Db2xvci5mcm9tSGV4KHJhYywgaGV4U3RyaW5nKTtcbiAgfVxuXG5cbiAgLyoqXG4gICogQSBibGFjayBgQ29sb3JgLlxuICAqXG4gICogQG5hbWUgYmxhY2tcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5ibGFjayAgID0gcmFjLkNvbG9yKDAsIDAsIDApO1xuXG4gIC8qKlxuICAqIEEgcmVkIGBDb2xvcmAuXG4gICpcbiAgKiBAbmFtZSByZWRcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuQ29sb3IjXG4gICovXG4gIHJhYy5Db2xvci5yZWQgICAgID0gcmFjLkNvbG9yKDEsIDAsIDApO1xuXG4gIHJhYy5Db2xvci5ncmVlbiAgID0gcmFjLkNvbG9yKDAsIDEsIDApO1xuICByYWMuQ29sb3IuYmx1ZSAgICA9IHJhYy5Db2xvcigwLCAwLCAxKTtcbiAgcmFjLkNvbG9yLnllbGxvdyAgPSByYWMuQ29sb3IoMSwgMSwgMCk7XG4gIHJhYy5Db2xvci5tYWdlbnRhID0gcmFjLkNvbG9yKDEsIDAsIDEpO1xuICByYWMuQ29sb3IuY3lhbiAgICA9IHJhYy5Db2xvcigwLCAxLCAxKTtcbiAgcmFjLkNvbG9yLndoaXRlICAgPSByYWMuQ29sb3IoMSwgMSwgMSk7XG5cbn0gLy8gYXR0YWNoUmFjQ29sb3JcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLkZpbGxgIGZ1bmN0aW9uIGNvbnRhaW5zIGNvbnZlbmllbmNlIG1ldGhvZHMgYW5kIG1lbWJlcnNcbiogZm9yIGB7QGxpbmsgUmFjLkZpbGx9YCBvYmplY3RzIHNldHVwIHdpdGggdGhlIG93bmluZyBgUmFjYCBpbnN0YW5jZS5cbipcbiogQG5hbWVzcGFjZSBpbnN0YW5jZS5GaWxsXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNGaWxsKHJhYykge1xuICAvLyBJbnRlbmRlZCB0byByZWNlaXZlIGEgUmFjIGluc3RhbmNlIGFzIHBhcmFtZXRlclxuXG4gIC8qKlxuICAqIEEgYEZpbGxgIHdpdGhvdXQgY29sb3IuIFJlbW92ZXMgdGhlIGZpbGwgY29sb3Igd2hlbiBhcHBsaWVkLlxuICAqIEBuYW1lIG5vbmVcbiAgKiBAbWVtYmVyb2YgaW5zdGFuY2UuRmlsbCNcbiAgKi9cbiAgcmFjLkZpbGwubm9uZSA9IHJhYy5GaWxsKG51bGwpO1xuXG59IC8vIGF0dGFjaFJhY0ZpbGxcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBUaGUgYGluc3RhbmNlLlN0cm9rZWAgZnVuY3Rpb24gY29udGFpbnMgY29udmVuaWVuY2UgbWV0aG9kcyBhbmQgbWVtYmVyc1xuKiBmb3IgYHtAbGluayBSYWMuU3Ryb2tlfWAgb2JqZWN0cyBzZXR1cCB3aXRoIHRoZSBvd25pbmcgYFJhY2AgaW5zdGFuY2UuXG4qXG4qIEBuYW1lc3BhY2UgaW5zdGFuY2UuU3Ryb2tlXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhdHRhY2hSYWNQb2ludChyYWMpIHtcbiAgLy8gSW50ZW5kZWQgdG8gcmVjZWl2ZSBhIFJhYyBpbnN0YW5jZSBhcyBwYXJhbWV0ZXJcblxuICAvKipcbiAgKiBBIGBTdHJva2VgIHdpdGggbm8gd2VpZ2h0IGFuZCBubyBjb2xvci4gVXNpbmcgb3IgYXBwbHlpbmcgdGhpcyBzdHJva2VcbiAgKiB3aWxsIGRpc2FibGUgc3Ryb2tlIGRyYXdpbmcuXG4gICpcbiAgKiBAbmFtZSBub25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlN0cm9rZSNcbiAgKi9cbiAgcmFjLlN0cm9rZS5ub25lID0gcmFjLlN0cm9rZShudWxsKTtcblxuXG4gIC8qKlxuICAqIEEgYFN0cm9rZWAgd2l0aCBgd2VpZ2h0YCBvZiBgMWAgYW5kIG5vIGNvbG9yLiBVc2luZyBvciBhcHBseWluZyB0aGlzXG4gICogc3Ryb2tlIHdpbGwgb25seSBzZXQgdGhlIHN0cm9rZSB3ZWlnaHQgdG8gYDFgLlxuICAqXG4gICogQG5hbWUgb25lXG4gICogQG1lbWJlcm9mIGluc3RhbmNlLlN0cm9rZSNcbiAgKi9cbiAgcmFjLlN0cm9rZS5vbmUgPSByYWMuU3Ryb2tlKDEpO1xuXG59IC8vIGF0dGFjaFJhY1N0cm9rZVxuXG4iLCIndXNlIHN0cmljdCc7XG5cblxuY29uc3QgUmFjID0gcmVxdWlyZSgnLi4vUmFjJyk7XG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWwvdXRpbHMnKTtcblxuXG4vLyBJbXBsZW1lbnRhdGlvbiBvZiBhbiBlYXNlIGZ1bmN0aW9uIHdpdGggc2V2ZXJhbCBvcHRpb25zIHRvIHRhaWxvciBpdHNcbi8vIGJlaGF2aW91ci4gVGhlIGNhbGN1bGF0aW9uIHRha2VzIHRoZSBmb2xsb3dpbmcgc3RlcHM6XG4vLyBWYWx1ZSBpcyByZWNlaXZlZCwgcHJlZml4IGlzIHJlbW92ZWRcbi8vICAgVmFsdWUgLT4gZWFzZVZhbHVlKHZhbHVlKVxuLy8gICAgIHZhbHVlID0gdmFsdWUgLSBwcmVmaXhcbi8vIFJhdGlvIGlzIGNhbGN1bGF0ZWRcbi8vICAgcmF0aW8gPSB2YWx1ZSAvIGluUmFuZ2Vcbi8vIFJhdGlvIGlzIGFkanVzdGVkXG4vLyAgIHJhdGlvIC0+IGVhc2VSYXRpbyhyYXRpbylcbi8vICAgICBhZGp1c3RlZFJhdGlvID0gKHJhdGlvICsgcmF0aW9PZnNldCkgKiByYXRpb0ZhY3RvclxuLy8gRWFzZSBpcyBjYWxjdWxhdGVkXG4vLyAgIGVhc2VkUmF0aW8gPSBlYXNlVW5pdChhZGp1c3RlZFJhdGlvKVxuLy8gRWFzZWRSYXRpbyBpcyBhZGp1c3RlZCBhbmQgcmV0dXJuZWRcbi8vICAgZWFzZWRSYXRpbyA9IChlYXNlZFJhdGlvICsgZWFzZU9mc2V0KSAqIGVhc2VGYWN0b3Jcbi8vICAgZWFzZVJhdGlvKHJhdGlvKSAtPiBlYXNlZFJhdGlvXG4vLyBWYWx1ZSBpcyBwcm9qZWN0ZWRcbi8vICAgZWFzZWRWYWx1ZSA9IHZhbHVlICogZWFzZWRSYXRpb1xuLy8gVmFsdWUgaXMgYWRqdXN0ZWQgYW5kIHJldHVybmVkXG4vLyAgIGVhc2VkVmFsdWUgPSBwcmVmaXggKyAoZWFzZWRWYWx1ZSAqIG91dFJhbmdlKVxuLy8gICBlYXNlVmFsdWUodmFsdWUpIC0+IGVhc2VkVmFsdWVcbmNsYXNzIEVhc2VGdW5jdGlvbiB7XG5cbiAgLy8gQmVoYXZpb3JzIGZvciB0aGUgYGVhc2VWYWx1ZWAgZnVuY3Rpb24gd2hlbiBgdmFsdWVgIGZhbGxzIGJlZm9yZSB0aGVcbiAgLy8gYHByZWZpeGAgYW5kIGFmdGVyIGBpblJhbmdlYC5cbiAgc3RhdGljIEJlaGF2aW9yID0ge1xuICAgIC8vIGB2YWx1ZWAgaXMgcmV0dXJuZWQgd2l0aG91dCBhbnkgZWFzaW5nIHRyYW5zZm9ybWF0aW9uLiBgcHJlRmFjdG9yYFxuICAgIC8vIGFuZCBgcG9zdEZhY3RvcmAgYXJlIGFwcGxpZWQuIFRoaXMgaXMgdGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbi5cbiAgICBwYXNzOiBcInBhc3NcIixcbiAgICAvLyBDbGFtcHMgdGhlIHJldHVybmVkIHZhbHVlIHRvIGBwcmVmaXhgIG9yIGBwcmVmaXgraW5SYW5nZWA7XG4gICAgY2xhbXA6IFwiY2xhbXBcIixcbiAgICAvLyBSZXR1cm5zIHRoZSBhcHBsaWVkIGVhc2luZyB0cmFuc2Zvcm1hdGlvbiB0byBgdmFsdWVgIGZvciB2YWx1ZXNcbiAgICAvLyBiZWZvcmUgYHByZWZpeGAgYW5kIGFmdGVyIGBpblJhbmdlYC5cbiAgICBjb250aW51ZTogXCJjb250aW51ZVwiXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hID0gMjtcblxuICAgIC8vIEFwcGxpZWQgdG8gcmF0aW8gYmVmb3JlIGVhc2luZy5cbiAgICB0aGlzLnJhdGlvT2Zmc2V0ID0gMFxuICAgIHRoaXMucmF0aW9GYWN0b3IgPSAxO1xuXG4gICAgLy8gQXBwbGllZCB0byBlYXNlZFJhdGlvLlxuICAgIHRoaXMuZWFzZU9mZnNldCA9IDBcbiAgICB0aGlzLmVhc2VGYWN0b3IgPSAxO1xuXG4gICAgLy8gRGVmaW5lcyB0aGUgbG93ZXIgbGltaXQgb2YgYHZhbHVlYGAgdG8gYXBwbHkgZWFzaW5nLlxuICAgIHRoaXMucHJlZml4ID0gMDtcblxuICAgIC8vIGB2YWx1ZWAgaXMgcmVjZWl2ZWQgaW4gYGluUmFuZ2VgIGFuZCBvdXRwdXQgaW4gYG91dFJhbmdlYC5cbiAgICB0aGlzLmluUmFuZ2UgPSAxO1xuICAgIHRoaXMub3V0UmFuZ2UgPSAxO1xuXG4gICAgLy8gQmVoYXZpb3IgZm9yIHZhbHVlcyBiZWZvcmUgYHByZWZpeGAuXG4gICAgdGhpcy5wcmVCZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvci5wYXNzO1xuICAgIC8vIEJlaGF2aW9yIGZvciB2YWx1ZXMgYWZ0ZXIgYHByZWZpeCtpblJhbmdlYC5cbiAgICB0aGlzLnBvc3RCZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvci5wYXNzO1xuXG4gICAgLy8gRm9yIGEgYHByZUJlaGF2aW9yYCBvZiBgcGFzc2AsIHRoZSBmYWN0b3IgYXBwbGllZCB0byB2YWx1ZXMgYmVmb3JlXG4gICAgLy8gYHByZWZpeGAuXG4gICAgdGhpcy5wcmVGYWN0b3IgPSAxO1xuICAgIC8vIEZvciBhIGBwb3N0QmVoYXZpb3JgIG9mIGBwYXNzYCwgdGhlIGZhY3RvciBhcHBsaWVkIHRvIHRoZSB2YWx1ZXNcbiAgICAvLyBhZnRlciBgcHJlZml4K2luUmFuZ2VgLlxuICAgIHRoaXMucG9zdEZhY3RvciA9IDE7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGVhc2VkIHZhbHVlIGZvciBgdW5pdGAuIEJvdGggdGhlIGdpdmVuXG4gIC8vIGB1bml0YCBhbmQgdGhlIHJldHVybmVkIHZhbHVlIGFyZSBpbiB0aGUgWzAsMV0gcmFuZ2UuIElmIGB1bml0YCBpc1xuICAvLyBvdXRzaWRlIHRoZSBbMCwxXSB0aGUgcmV0dXJuZWQgdmFsdWUgZm9sbG93cyB0aGUgY3VydmUgb2YgdGhlIGVhc2luZ1xuICAvLyBmdW5jdGlvbiwgd2hpY2ggbWF5IGJlIGludmFsaWQgZm9yIHNvbWUgdmFsdWVzIG9mIGBhYC5cbiAgLy9cbiAgLy8gVGhpcyBmdW5jdGlvbiBpcyB0aGUgYmFzZSBlYXNpbmcgZnVuY3Rpb24sIGl0IGRvZXMgbm90IGFwcGx5IGFueVxuICAvLyBvZmZzZXRzIG9yIGZhY3RvcnMuXG4gIGVhc2VVbml0KHVuaXQpIHtcbiAgICAvLyBTb3VyY2U6XG4gICAgLy8gaHR0cHM6Ly9tYXRoLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy8xMjE3MjAvZWFzZS1pbi1vdXQtZnVuY3Rpb24vMTIxNzU1IzEyMTc1NVxuICAgIC8vIGYodCkgPSAodF5hKS8odF5hKygxLXQpXmEpXG4gICAgbGV0IHJhID0gTWF0aC5wb3codW5pdCwgdGhpcy5hKTtcbiAgICBsZXQgaXJhID0gTWF0aC5wb3coMS11bml0LCB0aGlzLmEpO1xuICAgIHJldHVybiByYSAvIChyYSArIGlyYSk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlYXNlIGZ1bmN0aW9uIGFwcGxpZWQgdG8gdGhlIGdpdmVuIHJhdGlvLiBgcmF0aW9PZmZzZXRgXG4gIC8vIGFuZCBgcmF0aW9GYWN0b3JgIGFyZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCwgYGVhc2VPZmZzZXRgIGFuZFxuICAvLyBgZWFzZUZhY3RvcmAgYXJlIGFwcGxpZWQgdG8gdGhlIG91dHB1dC5cbiAgZWFzZVJhdGlvKHJhdGlvKSB7XG4gICAgbGV0IGFkanVzdGVkUmF0aW8gPSAocmF0aW8gKyB0aGlzLnJhdGlvT2Zmc2V0KSAqIHRoaXMucmF0aW9GYWN0b3I7XG4gICAgbGV0IGVhc2VkUmF0aW8gPSB0aGlzLmVhc2VVbml0KGFkanVzdGVkUmF0aW8pO1xuICAgIHJldHVybiAoZWFzZWRSYXRpbyArIHRoaXMuZWFzZU9mZnNldCkgKiB0aGlzLmVhc2VGYWN0b3I7XG4gIH1cblxuICAvLyBBcHBsaWVzIHRoZSBlYXNpbmcgZnVuY3Rpb24gdG8gYHZhbHVlYCBjb25zaWRlcmluZyB0aGUgY29uZmlndXJhdGlvblxuICAvLyBvZiB0aGUgd2hvbGUgaW5zdGFuY2UuXG4gIGVhc2VWYWx1ZSh2YWx1ZSkge1xuICAgIGxldCBiZWhhdmlvciA9IEVhc2VGdW5jdGlvbi5CZWhhdmlvcjtcblxuICAgIGxldCBzaGlmdGVkVmFsdWUgPSB2YWx1ZSAtIHRoaXMucHJlZml4O1xuICAgIGxldCByYXRpbyA9IHNoaWZ0ZWRWYWx1ZSAvIHRoaXMuaW5SYW5nZTtcblxuICAgIC8vIEJlZm9yZSBwcmVmaXhcbiAgICBpZiAodmFsdWUgPCB0aGlzLnByZWZpeCkge1xuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLnBhc3MpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNldG9QcmVmaXggPSB2YWx1ZSAtIHRoaXMucHJlZml4O1xuICAgICAgICAvLyBXaXRoIGEgcHJlRmFjdG9yIG9mIDEgdGhpcyBpcyBlcXVpdmFsZW50IHRvIGByZXR1cm4gcmFuZ2VgXG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIChkaXN0YW5jZXRvUHJlZml4ICogdGhpcy5wcmVGYWN0b3IpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucHJlQmVoYXZpb3IgPT09IGJlaGF2aW9yLmNsYW1wKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByZUJlaGF2aW9yID09PSBiZWhhdmlvci5jb250aW51ZSkge1xuICAgICAgICBsZXQgZWFzZWRSYXRpbyA9IHRoaXMuZWFzZVJhdGlvKHJhdGlvKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgZWFzZWRSYXRpbyAqIHRoaXMub3V0UmFuZ2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUudHJhY2UoYEludmFsaWQgcHJlQmVoYXZpb3IgY29uZmlndXJhdGlvbiAtIHByZUJlaGF2aW9yOiR7dGhpcy5wb3N0QmVoYXZpb3J9YCk7XG4gICAgICB0aHJvdyByYWMuRXJyb3IuaW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb247XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgcHJlZml4XG4gICAgaWYgKHJhdGlvIDw9IDEgfHwgdGhpcy5wb3N0QmVoYXZpb3IgPT09IGJlaGF2aW9yLmNvbnRpbnVlKSB7XG4gICAgICAvLyBFYXNlIGZ1bmN0aW9uIGFwcGxpZWQgd2l0aGluIHJhbmdlIChvciBhZnRlcilcbiAgICAgIGxldCBlYXNlZFJhdGlvID0gdGhpcy5lYXNlUmF0aW8ocmF0aW8pO1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ICsgZWFzZWRSYXRpbyAqIHRoaXMub3V0UmFuZ2U7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IucGFzcykge1xuICAgICAgLy8gU2hpZnRlZCB0byBoYXZlIGluUmFuZ2UgYXMgb3JpZ2luXG4gICAgICBsZXQgc2hpZnRlZFBvc3QgPSBzaGlmdGVkVmFsdWUgLSB0aGlzLmluUmFuZ2U7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXggKyB0aGlzLm91dFJhbmdlICsgc2hpZnRlZFBvc3QgKiB0aGlzLnBvc3RGYWN0b3I7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc3RCZWhhdmlvciA9PT0gYmVoYXZpb3IuY2xhbXApIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeCArIHRoaXMub3V0UmFuZ2U7XG4gICAgfVxuXG4gICAgY29uc29sZS50cmFjZShgSW52YWxpZCBwb3N0QmVoYXZpb3IgY29uZmlndXJhdGlvbiAtIHBvc3RCZWhhdmlvcjoke3RoaXMucG9zdEJlaGF2aW9yfWApO1xuICAgIHRocm93IHJhYy5FcnJvci5pbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbjtcbiAgfVxuXG5cbiAgLy8gUHJlY29uZmlndXJlZCBmdW5jdGlvbnNcblxuICAvLyBNYWtlcyBhbiBlYXNlRnVuY3Rpb24gcHJlY29uZmlndXJlZCB0byBhbiBlYXNlIG91dCBtb3Rpb24uXG4gIC8vXG4gIC8vIFRoZSBgb3V0UmFuZ2VgIHZhbHVlIHNob3VsZCBiZSBgaW5SYW5nZSoyYCBpbiBvcmRlciBmb3IgdGhlIGVhc2VcbiAgLy8gbW90aW9uIHRvIGNvbm5lY3Qgd2l0aCB0aGUgZXh0ZXJuYWwgbW90aW9uIGF0IHRoZSBjb3JyZWN0IHZlbG9jaXR5LlxuICBzdGF0aWMgbWFrZUVhc2VPdXQoKSB7XG4gICAgbGV0IGVhc2VPdXQgPSBuZXcgRWFzZUZ1bmN0aW9uKClcbiAgICBlYXNlT3V0LnJhdGlvT2Zmc2V0ID0gMTtcbiAgICBlYXNlT3V0LnJhdGlvRmFjdG9yID0gLjU7XG4gICAgZWFzZU91dC5lYXNlT2Zmc2V0ID0gLS41O1xuICAgIGVhc2VPdXQuZWFzZUZhY3RvciA9IDI7XG4gICAgcmV0dXJuIGVhc2VPdXQ7XG4gIH1cblxufSAvLyBjbGFzcyBFYXNlRnVuY3Rpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEVhc2VGdW5jdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbi8qKlxuKiBFeGNlcHRpb24gYnVpbGRlciBmb3IgdGhyb3dhYmxlIG9iamVjdHMuXG4qIEBhbGlhcyBSYWMuRXhjZXB0aW9uXG4qL1xuY2xhc3MgRXhjZXB0aW9uIHtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCBtZXNzYWdlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBFeGNlcHRpb246JHt0aGlzLm5hbWV9IC0gJHt0aGlzLm1lc3NhZ2V9YDtcbiAgfVxuXG4gIC8qKlxuICAqIFdoZW4gYHRydWVgIHRoZSBjb252ZW5pZW5jZSBzdGF0aWMgZnVuY3Rpb25zIG9mIHRoaXMgY2xhc3Mgd2lsbFxuICAqIGJ1aWxkIGBFcnJvcmAgb2JqZWN0cywgb3RoZXJ3aXNlIGBFeGNlcHRpb25gIG9iamVjdHMgYXJlIGJ1aWx0LlxuICAqXG4gICogU2V0IGFzIGBmYWxzZWAgYnkgZGVmYXVsdCBmb3IgYnJvd3NlciB1c2U6IHRocm93aW5nIGFuIGBFeGNlcHRpb25gXG4gICogaW4gY2hyb21lIGRpc3BsYXlzIHRoZSBlcnJvciBzdGFjayB1c2luZyBzb3VyY2UtbWFwcyB3aGVuIGF2YWlsYWJsZSxcbiAgKiB3aGlsZSB0aHJvd2luZyBhbiBgRXJyb3JgIG9iamVjdCBkaXNwbGF5cyB0aGUgZXJyb3Igc3RhY2sgcmVsYXRpdmUgdG9cbiAgKiB0aGUgYnVuZGxlZCBmaWxlIHdoaWNoIGlzIGhhcmRlciB0byByZWFkLlxuICAqXG4gICogVXNlZCBhcyBgdHJ1ZWAgZm9yIHRlc3QgcnVucyBpbiBKZXN0OiB0aHJvd2luZyBhbiBgRXJyb3JgIHdpbGwgYmVcbiAgKiByZXBvcnRlZCBpbiB0aGUgdGVzdCByZXBvcnQsIHdoaWxlIHRocm93aW5nIGEgY3VzdG9tIG9iamVjdCAobGlrZVxuICAqIGBFeGNlcHRpb25gKSB3aXRoaW4gYSBtYXRjaGVyIHJlc3VsdHMgaW4gdGhlIGV4cGVjdGF0aW9uIGhhbmdpbmdcbiAgKiBpbmRlZmluaXRlbHkuXG4gICovXG4gIHN0YXRpYyBidWlsZHNFcnJvcnMgPSBmYWxzZTtcblxuICAvKipcbiAgKiBSZXR1cm5zIGFuIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBidWlsZGluZyB0aHJvd2FibGUgb2JqZWN0cy5cbiAgKlxuICAqIFRoZSBmdW5jdGlvbiBjYW4gY2FuIGJlIHVzZWQgYXMgZm9sbG93aW5nOlxuICAqIGBgYFxuICAqIGZ1bmMobWVzc2FnZSkgLy8gcmV0dXJucyBhbiBgRXhjZXB0aW9uYGAgb2JqZWN0IHdpdGggYG5hbWVgIGFuZCBgbWVzc2FnZWBcbiAgKiBmdW5jLmV4Y2VwdGlvbk5hbWUgLy8gcmV0dXJucyB0aGUgYG5hbWVgIG9mIHRoZSBidWlsdCB0aHJvd2FibGUgb2JqZWN0c1xuICAqIGBgYFxuICAqL1xuICBzdGF0aWMgbmFtZWQobmFtZSkge1xuICAgIGxldCBmdW5jID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChFeGNlcHRpb24uYnVpbGRzRXJyb3JzKSB7XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgICBlcnJvci5uYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEV4Y2VwdGlvbihuYW1lLCBtZXNzYWdlKTtcbiAgICB9O1xuXG4gICAgZnVuYy5leGNlcHRpb25OYW1lID0gbmFtZTtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuXG4gIHN0YXRpYyBkcmF3ZXJOb3RTZXR1cCAgICAgICAgICAgICA9IEV4Y2VwdGlvbi5uYW1lZCgnRHJhd2VyTm90U2V0dXAnKTtcbiAgc3RhdGljIGZhaWxlZEFzc2VydCAgICAgICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdGYWlsZWRBc3NlcnQnKTtcbiAgc3RhdGljIGludmFsaWRPYmplY3RUeXBlICAgICAgICAgID0gRXhjZXB0aW9uLm5hbWVkKCdJbnZhbGlkT2JqZWN0VHlwZScpO1xuICBzdGF0aWMgYWJzdHJhY3RGdW5jdGlvbkNhbGxlZCAgICAgPSBFeGNlcHRpb24ubmFtZWQoJ0Fic3RyYWN0RnVuY3Rpb25DYWxsZWQnKTtcbiAgLy8gVE9ETzogbWlncmF0ZSByZXN0IG9mIGludmFsaWRPYmplY3RDb25maWd1cmF0aW9uXG4gIHN0YXRpYyBpbnZhbGlkT2JqZWN0Q29uZmlndXJhdGlvbiA9IEV4Y2VwdGlvbi5uYW1lZCgnSW52YWxpZE9iamVjdENvbmZpZ3VyYXRpb24nKTtcblxuICAvLyBpbnZhbGlkUGFyYW1ldGVyQ29tYmluYXRpb246ICdJbnZhbGlkIHBhcmFtZXRlciBjb21iaW5hdGlvbicsXG5cbiAgLy8gaW52YWxpZE9iamVjdFRvRHJhdzogJ0ludmFsaWQgb2JqZWN0IHRvIGRyYXcnLFxuICAvLyBpbnZhbGlkT2JqZWN0VG9BcHBseTogJ0ludmFsaWQgb2JqZWN0IHRvIGFwcGx5JyxcblxufSAvLyBjbGFzcyBFeGNlcHRpb25cblxuXG5tb2R1bGUuZXhwb3J0cyA9IEV4Y2VwdGlvbjtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmNvbnN0IFJhYyA9IHJlcXVpcmUoJy4uL1JhYycpO1xuXG5cbi8qKlxuKiBJbnRlcm5hbCB1dGlsaXRpZXMuXG4qIEBuYW1lc3BhY2UgdXRpbHNcbiovXG5cblxuLyoqXG4qIEFzc2VydHMgdGhhdCBhbGwgcGFzc2VkIHBhcmFtZXRlcnMgYXJlIG9iamVjdHMgb3IgcHJpbWl0aXZlcy4gSWYgYW55XG4qIHBhcmFtZXRlciBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWBcbiogaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLihPYmplY3R8cHJpbWl0aXZlKX0gcGFyYW1ldGVyc1xuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydEV4aXN0c1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRFeGlzdHMgPSBmdW5jdGlvbiguLi5wYXJhbWV0ZXJzKSB7XG4gIHBhcmFtZXRlcnMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnQoXG4gICAgICAgIGBGb3VuZCBudWxsLCBleHBlY3RpbmcgZWxlbWVudCB0byBleGlzdCBhdCBpbmRleCAke2luZGV4fWApO1xuICAgIH1cbiAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEZvdW5kIHVuZGVmaW5lZCwgZXhwZWN0aW5nIGVsZW1lbnQgdG8gZXhpc3QgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG9iamVjdHMgb3IgdGhlIGdpdmVuIGB0eXBlb2AsIG90aGVyd2lzZSBhXG4qIGB7QGxpbmsgUmFjLkV4Y2VwdGlvbi5mYWlsZWRBc3NlcnR9YCBpcyB0aHJvd24uXG4qXG4qIEBwYXJhbSB7ZnVuY3Rpb259IHR5cGVcbiogQHBhcmFtIHsuLi5PYmplY3R9IGVsZW1lbnRzXG4qXG4qIEByZXR1cm5zIHtib29sZWFufVxuKlxuKiBAZnVuY3Rpb24gYXNzZXJ0VHlwZVxuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hc3NlcnRUeXBlID0gZnVuY3Rpb24odHlwZSwgLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgdHlwZSkpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUgLSBlbGVtZW50OiR7aXRlbX0gZWxlbWVudC10eXBlOiR7dHlwZU5hbWUoaXRlbSl9IGV4cGVjdGVkLXR5cGUtbmFtZToke3R5cGUubmFtZX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIG51bWJlciBwcmltaXRpdmVzIGFuZCBub3QgTmFOLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLm51bWJlcn0gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnROdW1iZXJcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0TnVtYmVyID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdudW1iZXInIHx8IGlzTmFOKGl0ZW0pKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3RpbmcgbnVtYmVyIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIHN0cmluZyBwcmltaXRpdmVzLCBvdGhlcndpc2VcbiogYSBge0BsaW5rIFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0fWAgaXMgdGhyb3duLlxuKlxuKiBAcGFyYW0gey4uLnN0cmluZ30gZWxlbWVudHNcbiogQHJldHVybnMge2Jvb2xlYW59XG4qXG4qIEBmdW5jdGlvbiBhc3NlcnRTdHJpbmdcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0U3RyaW5nID0gZnVuY3Rpb24oLi4uZWxlbWVudHMpIHtcbiAgZWxlbWVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydChcbiAgICAgICAgYEVsZW1lbnQgaXMgdW5leHBlY3RlZCB0eXBlLCBleHBlY3Rpbmcgc3RyaW5nIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBBc3NlcnRzIHRoYXQgYWxsIGBlbGVtZW50c2AgYXJlIGJvb2xlYW4gcHJpbWl0aXZlcywgb3RoZXJ3aXNlIGFcbiogYHtAbGluayBSYWMuRXhjZXB0aW9uLmZhaWxlZEFzc2VydH1gIGlzIHRocm93bi5cbipcbiogQHBhcmFtIHsuLi5ib29sZWFufSBlbGVtZW50c1xuKiBAcmV0dXJucyB7Ym9vbGVhbn1cbipcbiogQGZ1bmN0aW9uIGFzc2VydEJvb2xlYW5cbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmV4cG9ydHMuYXNzZXJ0Qm9vbGVhbiA9IGZ1bmN0aW9uKC4uLmVsZW1lbnRzKSB7XG4gIGVsZW1lbnRzLmZvckVhY2goaXRlbSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpdGVtICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IFJhYy5FeGNlcHRpb24uZmFpbGVkQXNzZXJ0KFxuICAgICAgICBgRWxlbWVudCBpcyB1bmV4cGVjdGVkIHR5cGUsIGV4cGVjdGluZyBib29sZWFuIHByaW1pdGl2ZSAtIGVsZW1lbnQ6JHtpdGVtfSBlbGVtZW50LXR5cGU6JHt0eXBlTmFtZShpdGVtKX1gKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3RvciBuYW1lIG9mIGBvYmpgLCBvciBpdHMgdHlwZSBuYW1lLlxuKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgZGVidWdnaW5nIGFuZCBlcnJvcnMuXG4qXG4qIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBBbiBgT2JqZWN0YCB0byBnZXQgaXRzIHR5cGUgbmFtZVxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKlxuKiBAZnVuY3Rpb24gdHlwZU5hbWVcbiogQG1lbWJlcm9mIHV0aWxzI1xuKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKG9iaikge1xuICBpZiAob2JqID09PSB1bmRlZmluZWQpIHsgcmV0dXJuICd1bmRlZmluZWQnOyB9XG4gIGlmIChvYmogPT09IG51bGwpIHsgcmV0dXJuICdudWxsJzsgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5uYW1lICE9IG51bGwpIHtcbiAgICByZXR1cm4gb2JqLm5hbWUgPT0gJydcbiAgICAgID8gYGZ1bmN0aW9uYFxuICAgICAgOiBgZnVuY3Rpb246JHtvYmoubmFtZX1gO1xuICB9XG4gIHJldHVybiBvYmouY29uc3RydWN0b3IubmFtZSA/PyB0eXBlb2Ygb2JqO1xufVxuZXhwb3J0cy50eXBlTmFtZSA9IHR5cGVOYW1lO1xuXG5cbi8qKlxuKiBBZGRzIGEgY29uc3RhbnQgdG8gdGhlIGdpdmVuIG9iamVjdCwgdGhlIGNvbnN0YW50IGlzIG5vdCBlbnVtZXJhYmxlIGFuZFxuKiBub3QgY29uZmlndXJhYmxlLlxuKlxuKiBAZnVuY3Rpb24gYWRkQ29uc3RhbnRUb1xuKiBAbWVtYmVyb2YgdXRpbHMjXG4qL1xuZXhwb3J0cy5hZGRDb25zdGFudFRvID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgdmFsdWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfSk7XG59XG5cblxuLyoqXG4qIFJldHVybnMgYSBzdHJpbmcgb2YgYG51bWJlcmAgZm9ybWF0IHVzaW5nIGZpeGVkLXBvaW50IG5vdGF0aW9uIG9yIHRoZVxuKiBjb21wbGV0ZSBgbnVtYmVyYCBzdHJpbmcuXG4qXG4qIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBUaGUgbnVtYmVyIHRvIGZvcm1hdFxuKiBAcGFyYW0gez9udW1iZXJ9IFtkaWdpdHNdIC0gVGhlIGFtb3VudCBvZiBkaWdpdHMgdG8gcHJpbnQsIG9yIGBudWxsYCB0b1xuKiBwcmludCBhbGwgZGlnaXRzLlxuKlxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKlxuKiBAZnVuY3Rpb24gY3V0RGlnaXRzXG4qIEBtZW1iZXJvZiB1dGlscyNcbiovXG5leHBvcnRzLmN1dERpZ2l0cyA9IGZ1bmN0aW9uKG51bWJlciwgZGlnaXRzID0gbnVsbCkge1xuICByZXR1cm4gZGlnaXRzID09PSBudWxsXG4gICAgPyBudW1iZXIudG9TdHJpbmcoKVxuICAgIDogbnVtYmVyLnRvRml4ZWQoZGlnaXRzKTtcbn1cblxuIl19
