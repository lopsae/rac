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
  * @see Rac.Fill.from
  */
  appendFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.StyleContainer(this.rac, [this, fill]);
  }

} // class Stroke


module.exports = Stroke;

