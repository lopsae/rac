'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* `[Stroke]{@link Rac.Stroke}` and `[Fill]{@link Rac.Fill}` style to apply
* for drawing.
*
* Can be used as `style.apply()` to apply the stroke and fill settings
* globally, or as the parameter of `drawable.draw(style)` to apply the
* settings only for that `draw`.
*
* Applies whichever `stroke` or `fill` styles are present, any set to
* `null` is individually skipped.
*
* ⚠️ The Style class is **planned to be replaced** in a future minor release. ⚠️
*
* @alias Rac.Style
*/
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

