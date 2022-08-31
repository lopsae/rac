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


  // RELEASE-TODO: test
  /**
  * Creates a new `Text.Format` instance.
  * @param {Rac} rac - Instance to use for drawing and creating other objects
  * @param {string} hAlign - The horizontal alignment, left-to-right; one
  *   of the values from [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {string} vAlign - The vertical alignment, top-to-bottom; one of
  *   the values from [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle={@link instance.Angle#zero rac.Angle.zero}] -
  *   The angle towards which the text is drawn
  * @param {string} [font] - The font name
  * @param {number} [size] - The font size
  */
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
    * The horizontal alignment, left-to-right, to position a text relative
    * to its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign} object.
    *
    * @type {string}
    */
    this.hAlign = hAlign;

    /**
    * The vertical alignment, top-to-bottom, to position a text relative to
    * its [`point`]{@link Rac.Text#point}.
    *
    * Supported values are available through the
    * [`verticalAlign`]{@link Rac.Text.Format.verticalAlign} object.
    *
    * @type {string}
    */
    this.vAlign = vAlign;

    /**
    * The angle towards which the text is drawn.
    *
    * An angle of [`zero`]{@link instance.Angle#zero} wil draw the text
    * towards the right of the screen.
    *
    * @type {Rac.Angle}
    */
    this.angle = angle;

    /**
    * The font name of the text to draw.
    * @type {string}
    */
    this.font = font;

    /**
    * The font size of the text to draw.
    * @type {number}
    */
    this.size = size;
  } // constructor


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

} // class TextFormat


module.exports = TextFormat;

