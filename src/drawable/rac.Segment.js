'use strict';


/**
* The `instance.Segment` function contains convenience methods and members
* for `{@link Rac.Segment}` objects setup with the owning `Rac` instance.
* @namespace instance.Segment
*/
module.exports = function attachRacSegment(rac) {

  /**
  * A `Segment` with all values set to zero, , starts at
  * `{@link instance.Point#zero}`, points to
  * `{@link instance.Angle#zero}`, and has a length of zero.
  *
  * @name zero
  * @type {Rac.Segment}
  * @memberof instance.Segment#
  */
  rac.Segment.zero = rac.Segment(0, 0, 0, 0);

} // attachRacSegment

