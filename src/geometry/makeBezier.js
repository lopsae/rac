'use strict';


module.exports = function makeBezier(rac) {

  let RacBezier = function RacBezier(start, startAnchor, endAnchor, end) {
    this.start = start;
    this.startAnchor = startAnchor;
    this.endAnchor = endAnchor;
    this.end = end;
  };


  RacBezier.prototype.drawAnchors = function(style = undefined) {
    push();
    if (style !== undefined) {
      style.apply();
    }
    this.start.segmentToPoint(this.startAnchor).draw();
    this.end.segmentToPoint(this.endAnchor).draw();
    pop();
  };

  RacBezier.prototype.reverse = function() {
    return new RacBezier(
      this.end, this.endAnchor,
      this.startAnchor, this.start);
  };


  return RacBezier;

} // makeBezier

