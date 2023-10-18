'use strict';


/**
* The `instance.Bezier` function contains convenience methods and members
* for `{@link Rac.Bezier}` objects setup with the owning `Rac` instance.
*
* @namespace instance.Bezier
*/
module.exports = function attachInstanceBezier(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Bezier` is attached in `attachInstanceFunctions.js`.

  /**
  * A `Bezier` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Bezier}
  * @memberof instance.Bezier#
  */
  rac.Bezier.zero = rac.Bezier(
    0, 0, 0, 0,
    0, 0, 0, 0);

} // attachInstanceBezier

