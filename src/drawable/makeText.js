'use strict';


module.exports = function makeText(rac) {

  return class RacText {

    constructor(string, format, point) {
      this.string = string;
      this.format = format;
      this.point = point;
    }

    static Format = class RacTextFormat {

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

    } // RacTextFormat

  } // RacText

} // makeText

