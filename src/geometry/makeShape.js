'use strict';


module.exports = function makeShape(rac) {

  let RacShape = function RacShape() {
    this.outline = new rac.Composite();
    this.contour = new rac.Composite();
  }


  RacShape.prototype.addOutline = function(element) {
    this.outline.add(element);
  };

  RacShape.prototype.addContour = function(element) {
    this.contour.add(element);
  };


  return RacShape;

} // makeShape

