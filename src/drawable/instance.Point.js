'use strict';


/**
* Members and methods attached to the
* [`rac.Point` function]{@link Rac#Point}.
*
* The function contains ready-made convenience
* [`Point`]{@link Rac.Point} objects for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Point.origin // ready-made origin point
* rac.Point.origin.rac === rac // true
*
* @namespace instance.Point
*/
module.exports = function attachRacPoint(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Point` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Point` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.zero = rac.Point(0, 0);

  /**
  * A `Point` at `(0, 0)`.
  *
  * Equal to [`rac.Point.zero`]{@link instance.Point#zero}.
  *
  * @name origin
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.origin = rac.Point.zero;


} // attachRacPoint

