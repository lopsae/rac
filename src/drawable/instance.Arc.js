'use strict';


/**
* Members and methods attached to the
* [`rac.Arc` function]{@link Rac#Arc}.
*
* The function contains ready-made convenience
* [`Arc` objects]{@link Rac.Arc} for usual values, all setup with the
* owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Arc.zero // ready-made zero arc
* rac.Arc.zero.rac === rac // true
*
* @namespace instance.Arc
*/
module.exports = function attachRacArc(rac) {
  // Intended to receive a Rac instance as parameter.
  //
  // The function `rac.Arc` is attached in `attachInstanceFunctions.js`.

  /**
  * A clockwise `Arc` with all values set to zero.
  *
  * @name zero
  * @type {Rac.Arc}
  * @memberof instance.Arc#
  */
  rac.Arc.zero = rac.Arc(0, 0, 0, 0, 0, true);

} // attachRacArc

