'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


// module.exports = function makeStroke(rac) {

module.exports = class RacStroke {

    // TODO: figure out
    // static none = new RacStroke(null);

    constructor(rac, color = null, weight = 1) {
      utils.assertExists(rac, weight);

      this.rac = rac
      this.color = color;
      this.weight = weight;
    }

    copy() {
      let colorCopy = null;
      if (this.color !== null) {
        colorCopy = this.color.copy();
      }
      return new RacStroke(this.rac, colorCopy, this.weight);
    }

    withWeight(weight) {
      return new RacStroke(this.rac, this.color, weight);
    }

    withAlpha(alpha) {
      if (this.color === null) {
        return new RacStroke(this.rac, null, this.weight);
      }

      let newColor = this.color.withAlpha(alpha);
      return new RacStroke(this.rac, newColor, this.weight);
    }

    styleWithFill(someFill) {
      let fill = Rac.Fill.from(this.rac, someFill);
      return new Rac.Style(this.rac, this, fill);
    }

  } // RacStroke

// } // makeStroke

