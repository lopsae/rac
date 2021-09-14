'use strict';


const Rac = require('../Rac');
const utils = require('../util/utils');


/**
* Container of `[Stroke]{@link Rac.Stroke}` and `[Fill]{@link Rac.Fill}`
* objects which get applied sequentially when drawing.
*
* Can be used as `container.apply()` to apply the contained styles
* globally, or as the parameter of `drawable.draw(container)` to apply the
* style settings only for that `draw`.
*
* @alias Rac.StyleContainer
*/
class StyleContainer {

  constructor(rac, styles = []) {
    utils.assertExists(rac);

    /**
    * Instance of `Rac` used for drawing and passed along to any created
    * object.
    *
    * @type {Rac}
    */
    this.rac = rac;

    /**
    * Container of style objects to apply.
    *
    * Can be manipulated directly to add or remove styles from `this`.
    * Most of the implemented methods like
    * `[add]{@link Rac.StyleContainer#add}` return a new `StyleContainer`
    * with an copy of `this.styles`.
    *
    * @type {Array}
    */
    this.styles = styles;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @returns {string}
  */
  toString() {
    let contents = this.styles.join(' ');
    return `StyleContainer(${contents})`;
  }


  /**
  * Returns a new `StyleContainer` containing a copy of `this.styles`.
  *
  * @returns {Rac.StyleContainer}
  */
  container() {
    return new Rac.StyleContainer(this.rac, this.styles.slice());
  }


  /**
  * Returns a new `StyleContainer` with `style` appended at the end of
  * `styles`. When `style` is `null`, returns `this` instead.
  *
  * `this` is not modified by this method, the new `StyleContainer` is
  * created with a copy of `this.styles`.
  *
  * @param {?Rac.Stroke|Rac.Fill|Rac.StyleContainer} style - A style object
  *   to append to `styles`
  * @returns {Rac.StyleContainer}
  */
  appendStyle(style) {
    if (style === null) {
      return this;
    }

    let stylesCopy = this.styles.slice();
    stylesCopy.push(style);
    return new Rac.StyleContainer(this.rac, stylesCopy);
  }

} // class StyleContainer


module.exports = StyleContainer;

