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

