'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


module.exports = function makeStyle(rac) {

return class RacStyle {

    constructor(stroke = null, fill = null) {
      this.stroke = stroke;
      this.fill = fill;
    }

    withStroke(stroke) {
      return new RacStyle(stroke, this.fill);
    }

    withFill(fill) {
      return new RacStyle(this.stroke, fill);
    }

  } // RacStyle

} // makeStyle

