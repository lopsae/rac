'use strict';


module.exports = function makeStroke(rac) {

  return class RacStroke {

    static none = new RacStroke(null);

    constructor(color = null, weight = 1) {
      this.color = color;
      this.weight = weight;
    }

    copy() {
      let colorCopy = null;
      if (this.color !== null) {
        colorCopy = this.color.copy();
      }
      return new RacStroke(colorCopy, this.weight);
    }

    withWeight(weight) {
      return new RacStroke(this.color, weight);
    }

    withAlpha(alpha) {
      if (this.color === null) {
        return new RacStroke(null, this.weight);
      }

      let newColor = this.color.withAlpha(alpha);
      return new RacStroke(newColor, this.weight);
    }

    styleWithFill(someFill) {
      let fill = rac.Fill.from(someFill);
      return new rac.Style(this, fill);
    }

  } // RacStroke

} // makeStroke

