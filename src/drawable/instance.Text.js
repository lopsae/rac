'use strict';


const Rac = require('../Rac');


/**
* Members and methods attached to the
* [`rac.Text` function]{@link Rac#Text}.
*
* The function contains ready-made convenience
* [`Text`]{@link Rac.Text} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Text.hello // ready-made hello-world text
* rac.Text.hello.rac === rac // true
*
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {
  // Intended to receive a Rac instance as parameter


  /**
  * Members and methods attached to the
  * [`rac.Text.Format` function]{@link Rac#TextFormat}.
  *
  * The function contains ready-made convenience
  * [`Text.Format`]{@link Rac.Text.Format} objects for usual values, all
  * setup with the owning `Rac` instance.
  *
  * @example
  * let rac = new Rac()
  * rac.Text.Format.topLeft // ready-made top-left text format
  * rac.Text.Format.topLeft.rac === rac // true
  *
  * @namespace instance.Text.Format
  */


  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * top-left edge of the drawn text.
  * @name topLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * top-right edge of the drawn text.
  * @name topRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.top);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * center-left edge of the drawn text.
  * @name centerLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center);

  /**
  * A `Text.Format` to position the [`text.point`]{@link Rac.Text#point} at the
  * center of the drawn text.
  *
  * Also available as: `centered`.
  *
  * @name centerCenter
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerCenter = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.center,
    Rac.Text.Format.verticalAlign.center);
  rac.Text.Format.centered = rac.Text.Format.centerCenter;

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * center-right of the drawn text.
  * @name centerRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.centerRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.center);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * bottom-left of the drawn text.
  * @name bottomLeft
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomLeft = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom);

  /**
  * A `Text.Format` to align the [`text.point`]{@link Rac.Text#point} at the
  * bottom-right of the drawn text.
  * @name bottomRight
  * @type {Rac.Text.Format}
  * @memberof instance.Text.Format#
  */
  rac.Text.Format.bottomRight = rac.Text.Format(
    Rac.Text.Format.horizontalAlign.right,
    Rac.Text.Format.verticalAlign.bottom);


  /**
  * A `Text` for drawing `hello world` with `topLeft` format at
  * `Point.zero`.
  * @name hello
  * @type {Rac.Text}
  * @memberof instance.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!');

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @type {Rac.Text}
  * @memberof instance.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow');

} // attachRacText

