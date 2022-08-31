'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Determines the alignment, angle, font, and size for for drawing a
* [`Text`]{@link Rac.Text} object.
*
* @alias Rac.Text.Format
*/
class TextFormat {

  /**
   * Supported values for [`hAlign`]{@link Rac.Text.Format#hAlign} which
   * dermines the left-to-right alignment of the drawn text in relation to
   * its [`text.point`]{@link Rac.Text#point}.
   *
   * Contained values are:
   * + `left` - aligns `text.point` to the left edge of the drawn text
   * + `center` - aligns `text.point` to the center, from side to
   *   side, of the drawn text
   * + `right` - aligns `text.point` to the right edge of the drawn text
   *
   * @type {object}
   * @memberof Rac.Text.Format
   */
  static horizontalAlign = {
    left: "left",
    center: "horizontalCenter",
    right: "right"
  };

  /**
   * Supported values for [`vAlign`]{@link Rac.Text.Format#vAlign} which
   * dermines the top-to-bottom alignment of the drawn text in relation to
   * its [`text.point`]{@link Rac.Text#point}.
   *
   * Contained values are:
   * + `top` - aligns `text.point` to the top edge of the drawn text
   * + `center` - aligns `text.point` to the center, from top to
   *   bottom, of the drawn text
   * + `baseline` - aligns `text.point` to the baseline of the drawn text
   * + `bottom` - aligns `text.point` to the bottom edge of the drawn text
   *
   * @type {object}
   * @memberof Rac.Text.Format
   */
  static verticalAlign = {
    top: "top",
    center: "verticalCenter",
    baseline: "baseline",
    bottom: "bottom"
  };


  // RELEASE-TODO: document - test
  constructor(
    rac,
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    utils.assertExists(rac);
    utils.assertString(hAlign, vAlign);
    utils.assertType(Rac.Angle, angle);
    font !== null && utils.assertString(font);
    size !== null && utils.assertNumber(size);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Horizontal, left-to-right, alignment to position a text relative to
    * its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign} object.
    *
    * @type {string}
    */
    this.hAlign = hAlign;

    /**
    * Vertical, top-to-bottom, alignment to position a text relative to
    * its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`verticalAlign`]{@link Rac.Text.Format.verticalAlign} object.
    *
    * @type {string}
    */
    this.vAlign = vAlign;

    // RELEASE-TODO: document
    this.angle = angle;
    // RELEASE-TODO: document
    this.font = font;
    // RELEASE-TODO: document
    this.size = size;
  }

  // Returns a format to draw text in the same position as `self` with
  // the inverse angle.
  // RELEASE-TODO: document - test
  inverse() {
    let hEnum = TextFormat.horizontalAlign;
    let vEnum = TextFormat.verticalAlign;
    let hAlign, vAlign;
    switch (this.hAlign) {
      case hEnum.left:  hAlign = hEnum.right; break;
      case hEnum.right: hAlign = hEnum.left; break;
      default:          hAlign = this.hAlign; break;
    }
    switch (this.vAlign) {
      case vEnum.top:    vAlign = vEnum.bottom; break;
      case vEnum.bottom: vAlign = vEnum.top; break;
      default:           vAlign = this.vAlign; break;
    }

    return new TextFormat(
      this.rac,
      hAlign, vAlign,
      this.angle.inverse(),
      this.font,
      this.size)
  }


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    newAngle = Rac.Angle.from(this.rac, newAngle);
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      newAngle,
      this.font,
      this.size);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      newFont,
      this.size);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    return new TextFormat(this.rac,
      this.hAlign, this.vAlign,
      this.angle,
      this.font,
      newSize);
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const angleStr = utils.cutDigits(this.angle.turn, digits);
    const sizeStr = this.size === null
      ? "null"
      : utils.cutDigits(this.size, digits);
    return `Text.Format(ha:${this.hAlign} va:${this.vAlign} a:${angleStr} f:${this.font} s:${sizeStr})`;
  }

} // class TextFormat


/**
* String, format, and position to draw a text.
* @alias Rac.Text
*/
class Text {

  static Format = TextFormat;

  // RELEASE-TODO: document - test
  constructor(rac, point, string, format) {
    utils.assertExists(rac, point, string, format);
    utils.assertType(Rac.Point, point);
    utils.assertString(string);
    utils.assertType(Text.Format, format);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * The location where the text will be drawn.
    *
    * The text will be drawn relative to this point based on the
    * alignment and angle configuration of
    * [`format`]{@link Rac.Text#format}.
    *
    * @type {Rac.Point}
    */
    this.point = point;

    /**
    * The string to draw.
    * @type {string}
    */
    this.string = string;

    /**
    * The alignment, angle, font, and size to use to draw the text.
    * @type {Rac.Text.Format}
    */
    this.format = format;
  }


  // RELEASE-TODO: document - test
  withAngle(newAngle) {
    const newFormat = this.format.withAngle(newAngle);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document - test
  withFont(newFont) {
    const newFormat = this.format.withFont(newFont);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  // RELEASE-TODO: document - test
  withSize(newSize) {
    const newFormat = this.format.withSize(newSize);
    return new Text(this.rac, this.point, this.string, newFormat);
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {string}
  */
  toString(digits = null) {
    const xStr = utils.cutDigits(this.point.x, digits);
    const yStr = utils.cutDigits(this.point.y, digits);
    return `Text((${xStr},${yStr}) "${this.string}")`;
  }

} // class Text


module.exports = Text;

