'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Bezier curve with start, end, and two anchor points.
* @alias Rac.Bezier
*/
function Bezier(rac, start, startAnchor, endAnchor, end) {
  utils.assertExists(rac, start, startAnchor, endAnchor, end);

  this.rac = rac;
  this.start = start;
  this.startAnchor = startAnchor;
  this.endAnchor = endAnchor;
  this.end = end;
};


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


module.exports = Bezier;

