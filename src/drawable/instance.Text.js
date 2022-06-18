'use strict';


const Rac = require('../Rac');


/**
* The `instance.Text` function contains convenience methods and members
* for `{@link Rac.Text}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Text
*/
module.exports = function attachRacText(rac) {
  // Intended to receive a Rac instance as parameter


  // RELEASE-TODO: document - test
  rac.Text.Format = function(
    horizontal,
    vertical,
    angle = rac.Angle.zero,
    font = null,
    size = null)
  {
    angle = rac.Angle.from(angle);
    return new Rac.Text.Format(
      rac,
      horizontal, vertical,
      angle, font, size);
  };


  // RELEASE-TODO: document - test
  rac.Text.Format.topLeft = rac.Text.Format(
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top);

  rac.Text.Format.topRight = rac.Text.Format(
    Rac.Text.Format.horizontal.right,
    Rac.Text.Format.vertical.top);

  rac.Text.Format.centerLeft = rac.Text.Format(
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.center);

  rac.Text.Format.centerRight = rac.Text.Format(
    Rac.Text.Format.horizontal.right,
    Rac.Text.Format.vertical.center);

  rac.Text.Format.bottomLeft = rac.Text.Format(
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.bottom);

  rac.Text.Format.bottomRight = rac.Text.Format(
    Rac.Text.Format.horizontal.right,
    Rac.Text.Format.vertical.bottom);

  /**
  * A `Text` for drawing `hello world` with `topLeft` format at
  * `Point.zero`.
  * @name hello
  * @memberof instance.Text#
  */
  rac.Text.hello = rac.Text(0, 0, 'hello world!',
    rac.Text.Format.topLeft);

  /**
  * A `Text` for drawing the pangram `sphinx of black quartz, judge my vow`
  * with `topLeft` format at `Point.zero`.
  * @name sphinx
  * @memberof instance.Text#
  */
  rac.Text.sphinx = rac.Text(0, 0, 'sphinx of black quartz, judge my vow',
    rac.Text.Format.topLeft);

} // attachRacPoint

