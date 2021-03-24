'use strict';


let Rac = require('../rac');
let utils = require('../util/utils');


// module.exports = function makeColor(rac) {

module.exports = class RacColor {

    // TODO: figure out
    // static black   = new RacColor(0, 0, 0);
    // static red     = new RacColor(1, 0, 0);
    // static green   = new RacColor(0, 1, 0);
    // static blue    = new RacColor(0, 0, 1);
    // static yellow  = new RacColor(1, 1, 0);
    // static magenta = new RacColor(1, 0, 1);
    // static cyan    = new RacColor(0, 1, 1);
    // static white   = new RacColor(1, 1, 1);


    constructor(rac, r, g, b, alpha = 1) {
      utils.assertExists(rac, r, g, b, alpha);
      this.rac = rac;
      this.r = r;
      this.g = g;
      this.b = b;
      this.alpha = alpha;
    }

    describe() {
      return `Color(${this.r},${this.g},${this.b},${this.alpha})`;
    }

    static fromRgba(rac, r, g, b, a = 255) {
      return new RacColor(rac, r/255, g/255, b/255, a/255);
    }

    copy() {
      return new RacColor(this.rac, this.r, this.g, this.b, this.alpha);
    }

    fill() {
      return new Rac.Fill(this.rac, this);
    }

    stroke(weight = 1) {
      return new Rac.Stroke(this.rac, this, weight);
    }

    withAlpha(alpha) {
      let copy = this.copy();
      copy.alpha = alpha;
      return copy;
    }

    withAlphaRatio(ratio) {
      let copy = this.copy();
      copy.alpha = this.color.alpha * ratio;
      return copy;
    }

  } // RacColor

// } // makeColor

