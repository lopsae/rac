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
* TODO: outdated!
* null - null -> noStroke
* 0 - null -> applies zero stroke
* 0 - color -> applies both
* 1 - null -> applies 1 stroke
* 1 - color -> applies 1 and color
* null - color -> applies color
*
* The instance applies the `weight` and `color` settings as available:
* + when `color` and `weight` are set: both stroke settings are applied
* + when `weight` is `0` and `color` is set: only stroke color is applied
* + when `color` is `null` and `weight` is larger that `0`: only stroke
*   weight is applied
* + when `weight` is `0` and `color` is `null`: a *no stroke* setting is
*   applied
* + TODO: when `weight` and `color` are both `null`, no op?
*
* @alias Rac.Stroke
*/
class Stroke {

  /**
  * Creates a new `Stroke` instance.
  *
  * @param {Rac} rac -  Instance to use for drawing and creating other objects
  * @param {?number} weight - The weight of the stroke, or `null` to skip weight
  * @param {?Rac.Color} color - A `Color` for the stroke, or `null` to skip color
  */
  constructor(rac, weight, color = null) {
    utils.assertExists(rac);
    weight !== null && utils.assertNumber(weight);
    color !== null && utils.assertType(Rac.Color, color);

    this.rac = rac
    this.color = color;
    this.weight = weight;
  }

  withWeight(newWeight) {
    return new Stroke(this.rac, newWeight, this.color,);
  }

  withAlpha(newAlpha) {
    if (this.color === null) {
      return new Stroke(this.rac, this.weight, null);
    }

    let newColor = this.color.withAlpha(newAlpha);
    return new Stroke(this.rac, this.weight, newColor);
  }

  styleWithFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.Style(this.rac, this, fill);
  }

} // class Stroke


module.exports = Stroke;

