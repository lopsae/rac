'use strict';


/**
* The `rac.Point` function-container holds several convenience methods and
* properties for creating `{@link Rac.Point}` objects.
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

