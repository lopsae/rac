'use strict';


module.exports = function makeFill(rac) {

 return class RacFill {

    static none = new RacFill(null);

    constructor(color = null) {
      this.color = color;
    }

    static from(something) {
      if (something instanceof RacFill) {
        return new RacFill(something.color);
      }
      if (something instanceof rac.Stroke) {
        return new RacFill(something.color);
      }
      if (something instanceof rac.Color) {
        return new RacFill(something);
      }

      console.trace(`Cannot convert to rac.Fill - something-type:${rac.typeName(something)}`);
      throw rac.Error.invalidObjectToConvert;
    }

    styleWithStroke(stroke) {
      return new rac.Style(stroke, this);
    }

  } // RacFill

} // makeFill

