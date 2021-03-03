'use strict';


module.exports = function makeColor(rac) {

  return class RacColor {

    static black   = new RacColor(0, 0, 0);
    static red     = new RacColor(1, 0, 0);
    static green   = new RacColor(0, 1, 0);
    static blue    = new RacColor(0, 0, 1);
    static yellow  = new RacColor(1, 1, 0);
    static magenta = new RacColor(1, 0, 1);
    static cyan    = new RacColor(0, 1, 1);
    static white   = new RacColor(1, 1, 1);


    constructor(r, g, b, alpha = 1) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.alpha = alpha;
    }

    static fromRgba(r, g, b, a = 255) {
      return new RacColor(r/255, g/255, b/255, a/255);
    }

    copy() {
      return new RacColor(this.r, this.g, this.b, this.alpha);
    }

    fill() {
      return new rac.Fill(this);
    }

    stroke(weight = 1) {
      return new rac.Stroke(this, weight);
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

} // makeColor

