'use strict';


module.exports = function makeFill(rac) {

 return class RacFill {

    static none = new RacFill(null);

    constructor(color = null) {
      this.color = color;
    }

    styleWithStroke(stroke) {
      return new rac.Style(stroke, this);
    }

  } // RacFill

} // makeFill

