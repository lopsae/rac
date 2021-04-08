'use strict';


/**
* The `instance.Point` function contains convenience methods and properties
* for `{@link Rac.Point}` objects setup with the owning `Rac` instance.
* @namespace instance.Point
*/
module.exports = function attachRacPoint(rac) {

  /**
  * A `Point` at `(0, 0)`.
  *
  * Also named as: `origin`
  *
  * @name zero
  * @type {Rac.Point}
  * @memberof instance.Point#
  */
  rac.Point.zero = rac.Point(0, 0);
  rac.Point.origin = rac.Point.zero;

} // attachRacPoint

