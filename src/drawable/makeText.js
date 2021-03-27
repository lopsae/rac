'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function makeText(rac) {

  class RacTextFormat {

    static defaultSize = 15;

    static horizontal = {
      left: "left",
      center: "horizontalCenter",
      right: "right"
    };

    static vertical = {
      top: "top",
      bottom: "bottom",
      center: "verticalCenter",
      baseline: "baseline"
    };

    constructor(
      horizontal, vertical,
      font = null,
      rotation = rac.Angle.zero,
      size = RacTextFormat.defaultSize)
    {
      this.horizontal = horizontal;
      this.vertical = vertical;
      this.font = font;
      this.rotation = rotation;
      this.size = size;
    }

    // Returns a format to draw text in the same position as `self` with
    // the inverse angle.
    inverse() {
      let hEnum = RacTextFormat.horizontal;
      let vEnum = RacTextFormat.vertical;
      let horizontal, vertical;
      switch (this.horizontal) {
        case hEnum.left:
          horizontal = hEnum.right; break;
        case hEnum.right:
          horizontal = hEnum.left; break;
        default:
          horizontal = this.horizontal; break;
      }
      switch (this.vertical) {
        case vEnum.top:
          vertical = vEnum.bottom; break;
        case vEnum.bottom:
          vertical = vEnum.top; break;
        default:
          vertical = this.vertical; break;
      }

      return new RacTextFormat(
        horizontal, vertical,
        this.font,
        this.rotation.inverse(),
        this.size)
    }

  } // RacTextFormat


  class RacText {

    constructor(string, format, point) {
      this.string = string;
      this.format = format;
      this.point = point;
    }

    static Format = RacTextFormat;

  } // RacText


  return RacText;

} // makeText

