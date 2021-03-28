'use strict';


/**
* The `rac.Point` function contains methods and properties for convenience
* `{@link Rac.Point}` objects with the current `rac` instance.
* @namespace rac.Point
*/
module.exports = function attachRacPoint(rac) {

  /**
  * A `Point` at `(0, 0)`.
  * @name zero
  * @memberof rac.Point#
  */
  rac.Point.zero = rac.Point(0, 0);

  /**
  * A `Point` at `(0, 0)`.
  * @name origin
  * @memberof rac.Point#
  */
  rac.Point.origin = rac.Point.zero;

} // attachRacPoint

