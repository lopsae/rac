'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Stroke color and weight style for drawing.
* @alias Rac.Stroke
*/
class Stroke {

  constructor(rac, color = null, weight = 1) {
    utils.assertExists(rac, weight);
    this.rac = rac
    this.color = color;
    this.weight = weight;
  }

  withWeight(newWeight) {
    return new Stroke(this.rac, this.color, newWeight);
  }

  withAlpha(newAlpha) {
    if (this.color === null) {
      return new Stroke(this.rac, null, this.weight);
    }

    let newColor = this.color.withAlpha(newAlpha);
    return new Stroke(this.rac, newColor, this.weight);
  }

  styleWithFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Rac.Style(this.rac, this, fill);
  }

} // class Stroke


module.exports = Stroke;

