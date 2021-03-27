'use strict';


let Rac = require('../Rac');
let utils = require('../util/utils');


/**
* Color with RBGA values, each on the `[0,1]` range.
* @alias Rac.Color
*/
class Color {

  // TODO: figure out
  // static black   = new Color(0, 0, 0);
  // static red     = new Color(1, 0, 0);
  // static green   = new Color(0, 1, 0);
  // static blue    = new Color(0, 0, 1);
  // static yellow  = new Color(1, 1, 0);
  // static magenta = new Color(1, 0, 1);
  // static cyan    = new Color(0, 1, 1);
  // static white   = new Color(1, 1, 1);


  constructor(rac, r, g, b, alpha = 1) {
    utils.assertExists(rac, r, g, b, alpha);
    this.rac = rac;
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = alpha;
  }

  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    return `Color(${this.r},${this.g},${this.b},${this.alpha})`;
  }

  static fromRgba(rac, r, g, b, a = 255) {
    return new Color(rac, r/255, g/255, b/255, a/255);
  }

  copy() {
    return new Color(this.rac, this.r, this.g, this.b, this.alpha);
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

} // class Color


module.exports = Color;
