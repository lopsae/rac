'use strict';


const Rac = require('../Rac');


/**
* The `instance.Angle` function contains convenience methods and members
* for `{@link Rac.Angle}` objects setup with the owning `Rac` instance.
* @namespace instance.Angle
*/
module.exports = function attachRacAngle(rac) {

  /**
  * Returns an `Angle` derived from `something`.
  *
  * Calls`{@link Rac.Angle.from}` using `this`.
  *
  * @param {number|Rac.Angle|Rac.Ray|Rac.Segment} something - An object to
  * derive an `Angle` from
  * @returns {Rac.Angle}
  *
  * @function from
  * @memberof instance.Angle#
  * @see Rac.Angle.from
  */
  rac.Angle.from = function(something) {
    return Rac.Angle.from(rac, something);
  };


  /**
  * Returns an `Angle` derived from `radians`.
  *
  * Calls `{@link Rac.Angle.fromRadians}` using `this`.
  *
  * @param {number} radians - The measure of the angle, in radians
  * @returns {Rac.Angle}
  *
  * @function fromRadians
  * @memberof instance.Angle#
  * @see Rac.Angle.fromRadians
  */
  rac.Angle.fromRadians = function(radians) {
    return Rac.Angle.fromRadians(rac, radians);
  };


  /**
  * An `Angle` with turn `0`.
  *
  * Also named as: `right`, `r`, `east`, `e`.
  *
  * @name zero
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.zero = rac.Angle(0.0);

  /**
  * An `Angle` with turn `1/2`.
  *
  * Also named as: `left`, `l`, `west`, `w`, `inverse`.
  *
  * @name half
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.half = rac.Angle(1/2);
  rac.Angle.inverse = rac.Angle.half;

  /**
  * An `Angle` with turn `1/4`.
  *
  * Also named as: `down`, `d`, `bottom`, `b`, `south`, `s`, `square`.
  *
  * @name quarter
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.quarter = rac.Angle(1/4);
  rac.Angle.square =  rac.Angle.quarter;

  /**
  * An `Angle` with turn `1/8`.
  *
  * Also named as: `bottomRight`, `br`, `se`.
  *
  * @name eighth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.eighth =  rac.Angle(1/8);

  /**
  * An `Angle` with turn `7/8`, negative angle of
  * `{@link instance.Angle#eighth eighth}`.
  *
  * Also named as: `topRight`, `tr`, `ne`.
  *
  * @name neighth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.neighth =  rac.Angle(-1/8);


  /**
  * An `Angle` with turn `1/16`.
  *
  * @name sixteenth
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.sixteenth = rac.Angle(1/16);

  /**
  * An `Angle` with turn `3/4`.
  *
  * Also named as: `up`, `u`, `top`, `t`.
  *
  * @name north
  * @type {Rac.Point}
  * @memberof instance.Angle#
  */
  rac.Angle.north = rac.Angle(3/4);
  rac.Angle.east  = rac.Angle(0/4);
  rac.Angle.south = rac.Angle(1/4);
  rac.Angle.west  = rac.Angle(2/4);

  rac.Angle.e = rac.Angle.east;
  rac.Angle.s = rac.Angle.south;
  rac.Angle.w = rac.Angle.west;
  rac.Angle.n = rac.Angle.north;

  rac.Angle.ne = rac.Angle.n.add(1/8);
  rac.Angle.se = rac.Angle.e.add(1/8);
  rac.Angle.sw = rac.Angle.s.add(1/8);
  rac.Angle.nw = rac.Angle.w.add(1/8);

  // North north-east
  rac.Angle.nne = rac.Angle.ne.add(-1/16);
  // East north-east
  rac.Angle.ene = rac.Angle.ne.add(+1/16);
  // North-east north
  rac.Angle.nen = rac.Angle.nne;
  // North-east east
  rac.Angle.nee = rac.Angle.ene;

  // East south-east
  rac.Angle.ese = rac.Angle.se.add(-1/16);
  // South south-east
  rac.Angle.sse = rac.Angle.se.add(+1/16);
  // South-east east
  rac.Angle.see = rac.Angle.ese;
  // South-east south
  rac.Angle.ses = rac.Angle.sse;

  // South south-west
  rac.Angle.ssw = rac.Angle.sw.add(-1/16);
  // West south-west
  rac.Angle.wsw = rac.Angle.sw.add(+1/16);
  // South-west south
  rac.Angle.sws = rac.Angle.ssw;
  // South-west west
  rac.Angle.sww = rac.Angle.wsw;

  // West north-west
  rac.Angle.wnw = rac.Angle.nw.add(-1/16);
  // North north-west
  rac.Angle.nnw = rac.Angle.nw.add(+1/16);
  // Nort-hwest west
  rac.Angle.nww = rac.Angle.wnw;
  // North-west north
  rac.Angle.nwn = rac.Angle.nnw;

  rac.Angle.right = rac.Angle.e;
  rac.Angle.down  = rac.Angle.s;
  rac.Angle.left  = rac.Angle.w;
  rac.Angle.up    = rac.Angle.n;

  rac.Angle.r = rac.Angle.right;
  rac.Angle.d = rac.Angle.down;
  rac.Angle.l = rac.Angle.left;
  rac.Angle.u = rac.Angle.up;

  rac.Angle.top    = rac.Angle.up;
  rac.Angle.bottom = rac.Angle.down;
  rac.Angle.t      = rac.Angle.top;
  rac.Angle.b      = rac.Angle.bottom;

  rac.Angle.topRight    = rac.Angle.ne;
  rac.Angle.tr          = rac.Angle.ne;
  rac.Angle.topLeft     = rac.Angle.nw;
  rac.Angle.tl          = rac.Angle.nw;
  rac.Angle.bottomRight = rac.Angle.se;
  rac.Angle.br          = rac.Angle.se;
  rac.Angle.bottomLeft  = rac.Angle.sw;
  rac.Angle.bl          = rac.Angle.sw;

} // attachRacAngle

