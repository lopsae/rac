'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Bezier curve with start, end, and two anchor [points]{@link Rac.Point}.
* @alias Rac.Bezier
*/
class Bezier {

  constructor(rac, start, startAnchor, endAnchor, end) {
    utils.assertExists(rac, start, startAnchor, endAnchor, end);
    utils.assertType(Rac.Point, start, startAnchor, endAnchor, end);

    this.rac = rac;
    this.start = start;
    this.startAnchor = startAnchor;
    this.endAnchor = endAnchor;
    this.end = end;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @param {Number} [digits] - The number of digits to print after the
  * decimal point, when ommited all digits are printed
  * @returns {String}
  */
  toString(digits = null) {
    const startXStr       = utils.cutDigits(this.start.x,       digits);
    const startYStr       = utils.cutDigits(this.start.y,       digits);
    const startAnchorXStr = utils.cutDigits(this.startAnchor.x, digits);
    const startAnchorYStr = utils.cutDigits(this.startAnchor.y, digits);
    const endAnchorXStr   = utils.cutDigits(this.endAnchor.x,   digits);
    const endAnchorYStr   = utils.cutDigits(this.endAnchor.y,   digits);
    const endXStr         = utils.cutDigits(this.end.x,         digits);
    const endYStr         = utils.cutDigits(this.end.y,         digits);

    return `Bezier(s:(${startXStr},${startYStr}) sa:(${startAnchorXStr},${startAnchorYStr}) ea:(${endAnchorXStr},${endAnchorYStr}) e:(${endXStr},${endYStr}))`;
  }


  /**
  * Returns `true` when all members, except `rac`, of both beziers are
  * [considered equal]{@link Rac.Point#equals}; otherwise returns `false`.
  *
  * When `otherBezier` is any class other that `Rac.Bezier`, returns
  * `false`.
  *
  * @param {Rac.Bezier} otherBezier - A `Bezier` to compare
  * @returns {Boolean}
  *
  * @see Rac.Point#equals
  */
  equals(otherBezier) {
    return otherBezier instanceof Bezier
      && this.start      .equals(otherBezier.start)
      && this.startAnchor.equals(otherBezier.startAnchor)
      && this.endAnchor  .equals(otherBezier.endAnchor)
      && this.end        .equals(otherBezier.end);
  }

} // class Bezier


module.exports = Bezier;


Bezier.prototype.drawAnchors = function(style = undefined) {
  push();
  if (style !== undefined) {
    style.apply();
  }
  this.start.segmentToPoint(this.startAnchor).draw();
  this.end.segmentToPoint(this.endAnchor).draw();
  pop();
};

Bezier.prototype.reverse = function() {
  return new Bezier(this.rac,
    this.end, this.endAnchor,
    this.startAnchor, this.start);
};

