'use strict';


/**
* The `instance.Ray` function contains convenience methods and members
* for `{@link Rac.Ray}` objects setup with the owning `Rac` instance.
* @namespace instance.Ray
*/
module.exports = function attachRacRay(rac) {

  /**
  * A `Ray` with all values set to zero, starts at
  * `{@link instance.Point#zero}` and points to
  * `{@link instance.Angle#zero}`.
  *
  * @name zero
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#zero
  * @see instance.Angle#zero
  */
  rac.Ray.zero = rac.Ray(0, 0, rac.Angle.zero);


  /**
  * A `Ray` over the x-axis, starts at `{@link instance.Point#origin}` and
  * points to `{@link instance.Angle#zero}`.
  *
  * Equal to `{@link instance.Ray#zero}`.
  *
  * @name xAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#zero
  */
  rac.Ray.xAxis = rac.Ray.zero;


  /**
  * A `Ray` over the y-axis, starts at`{@link instance.Point#origin}` and
  * points to `{@link instance.Angle#quarter}`.
  *
  * @name yAxis
  * @type {Rac.Ray}
  * @memberof instance.Ray#
  * @see instance.Point#origin
  * @see instance.Angle#quarter
  */
  rac.Ray.yAxis = rac.Ray(0, 0, rac.Angle.quarter);

} // attachRacRay

