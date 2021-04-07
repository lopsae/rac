'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* The `rac.Angle` function contains methods and properties for convenience
* `{@link Rac.Angle}` objects with the current `rac` instance.
* @namespace instance.Angle
*/
module.exports = function attachRacAngle(rac) {

  /**
  * Returns an `Angle` produced with `something`. Calls
  * `{@link Rac.Angle.from}` using `this`.
  * @name from
  * @memberof instance.Angle#
  * @function
  */
  rac.Angle.from = function(something) {
    return Rac.Angle.from(rac, something);
  };

  /**
  * An `Angle` with turn `0`.
  * @name zero
  * @memberof instance.Angle#
  */
  rac.Angle.zero =    rac.Angle(0.0);
  rac.Angle.square =  rac.Angle(1/4);
  rac.Angle.inverse = rac.Angle(1/2);

  rac.Angle.half =    rac.Angle(1/2);
  rac.Angle.quarter = rac.Angle(1/4);
  rac.Angle.eighth =  rac.Angle(1/8);
  rac.Angle.neighth =  rac.Angle(-1/8);

  rac.Angle.e = rac.Angle(0/4);
  rac.Angle.s = rac.Angle(1/4);
  rac.Angle.w = rac.Angle(2/4);
  rac.Angle.n = rac.Angle(3/4);

  rac.Angle.east  = rac.Angle.e;
  rac.Angle.south = rac.Angle.s;
  rac.Angle.west  = rac.Angle.w;
  rac.Angle.north = rac.Angle.n;

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

