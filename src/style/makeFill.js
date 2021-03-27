'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


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

      throw Rac.Exception.invalidObjectType.make(
        `Cannot derive Rac.Fill - something-type:${rac.typeName(something)}`);
    }

    styleWithStroke(stroke) {
      return new Rac.Style(this.rac, stroke, this);
    }

  } // RacFill

// } // makeFill

