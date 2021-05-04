'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


class Style {

  constructor(rac, stroke = null, fill = null) {
    utils.assertExists(rac);
    this.rac = rac;
    this.stroke = stroke;
    this.fill = fill;
  }


  /**
  * Returns a string representation intended for human consumption.
  */
  toString() {
    let strokeString = 'null';
    if (this.stroke !== null) {
      let colorString = this.stroke.color === null
        ? 'null-color'
        : this.stroke.color.toString();
      strokeString = `${colorString},${this.stroke.weight}`;
    }

    let fillString = 'null';
    if (this.fill !== null) {
      let colorString = this.fill.color === null
        ? 'null-color'
        : this.fill.color.toString();
      fillString = colorString;
    }

    return `Style(s:(${strokeString}) f:${fillString})`;
  }


  withStroke(stroke) {
    return new Style(this.rac, stroke, this.fill);
  }

  withFill(someFill) {
    let fill = Rac.Fill.from(this.rac, someFill);
    return new Style(this.rac, this.stroke, fill);
  }

} // class Style


module.exports = Style;

