'use strict';


/**
* Members and methods attached to the
* [`rac.Segment` function]{@link Rac#Segment}.
*
* The function contains ready-made convenience
* [`Segment`]{@link Rac.Segment} objects for usual values, all setup with
* the owning `Rac` instance.
*
* @example
* let rac = new Rac()
* rac.Segment.zero // ready-made zero segment
* rac.Segment.zero.rac === rac // true
*
* @namespace instance.Segment
*/
module.exports = function attachRacSegment(rac) {
  // Intended to receive a Rac instance as parameter

  /**
  * A `Segment` with all values set to zero, starts at
  * [`rac.Point.zero`]{@link instance.Point#zero}, points to
  * [`rac.Angle.zero`]{@link instance.Angle#zero}, and has a length of
  * zero.
  *
  * @name zero
  * @type {Rac.Segment}
  * @memberof instance.Segment#
  */
  rac.Segment.zero = rac.Segment(0, 0, 0, 0);

} // attachRacSegment

