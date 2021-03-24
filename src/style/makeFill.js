'use strict';


let Rac = require('../rac');
let utils = require('../util/utils');


// module.exports = function makeFill(rac) {

module.exports = class RacFill {

    // TODO: figure out
    // static none = new RacFill(null);

    constructor(rac, color = null) {
      utils.assertExists(rac);
      this.rac = rac;
      this.color = color;
    }

    static from(rac, something) {
      if (something instanceof RacFill) {
        return new RacFill(rac, something.color);
      }
      if (something instanceof Rac.Stroke) {
        return new RacFill(rac, something.color);
      }
      if (something instanceof Rac.Color) {
        return new RacFill(rac, something);
      }

      console.trace(`Cannot convert to rac.Fill - something-type:${rac.typeName(something)}`);
      throw rac.Error.invalidObjectToConvert;
    }

    styleWithStroke(stroke) {
      return new Rac.Style(this.rac, stroke, this);
    }

  } // RacFill

// } // makeFill

