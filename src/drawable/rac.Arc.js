'use strict';


/**
* The `instance.Arc` function contains convenience methods and members
* for `{@link Rac.Arc}` objects setup with the owning `Rac` instance.
* @namespace instance.Arc
*/
module.exports = function attachRacArc(rac) {

  /**
  * A clockwise `Arc` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Arc}
  * @memberof instance.Arc#
  */
  rac.Arc.zero = rac.Arc(0, 0, 0, 0, 0, true);

} // attachRacArc

