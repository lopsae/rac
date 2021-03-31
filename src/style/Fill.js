'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Fill color style for drawing.
* @alias Rac.Fill
*/
class Fill {

  constructor(rac, color = null) {
    utils.assertExists(rac);
    this.rac = rac;
    this.color = color;
  }

  static from(rac, something) {
    if (something instanceof Fill) {
      return something;
    }
    if (something instanceof Rac.Stroke) {
      return new Fill(rac, something.color);
    }
    if (something instanceof Rac.Color) {
      return new Fill(rac, something);
    }

    throw Rac.Exception.invalidObjectType(
      `Cannot derive Rac.Fill - something-type:${utils.typeName(something)}`);
  }

  styleWithStroke(stroke) {
    return new Rac.Style(this.rac, stroke, this);
  }

} // class Fill


module.exports = Fill;

