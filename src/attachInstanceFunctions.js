'use strict';


const Rac = require('./Rac');


/**
* This namespace lists utility functions attached to an instance of
* `{@link Rac}` during initialization. Each drawable and style class gets
* a corresponding function like [`rac.Point`]{@link instance.Point} or
* [`rac.Color`]{@link instance.Color}.
*
* Drawable and style objects require for construction a reference to a
* `Rac` instance in order to perform drawing operations. The attached
* functions build new objects using the owning `Rac` instance.
*
* These functions are also setup with ready-made convenience objects for
* many usual values like [`rac.Angle.north`]{@link instance.Angle#north} or
* [`rac.Point.zero`]{@link instance.Point#zero}.
*
* @namespace instance
*/


// Attaches convenience functions to create objects with this instance of
// Rac. E.g. `rac.Color(...)`, `rac.Point(...)`.
//
// These functions are attached as properties (instead of into the
// prototype) because these are later populated with more properties and
// methods, and thus need to be independent for each instance.
//
// Ready made objects attached to these functions (E.g. `rac.Point.zero`)
// are defined in the `instance.Point.js` and equivalent files.
//
// Intended to receive the a Rac instance as parameter.
module.exports = function attachInstanceFunctions(rac) {

  /**
  * Convenience function to create a new `Color`. The created `color.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Color}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * color.rac === rac // true
  *
  * @param {Number} r
  * @param {Number} g
  * @param {Number} b
  * @param {Number} [a=1]
  *
  * @returns {Rac.Color}
  *
  * @function Color
  * @memberof Rac#
  */
  rac.Color = function makeColor(r, g, b, a = 1) {
    return new Rac.Color(this, r, g, b, a);
  };


  /**
  * Convenience function to create a new `Stroke`. The created `stroke.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Stroke}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * let stroke = rac.Stroke(2, color)
  * stroke.rac === rac // true
  *
  * @param {?Number} weight
  * @param {Rac.Color} [color=null]
  *
  * @returns {Rac.Stroke}
  *
  * @function Stroke
  * @memberof Rac#
  */
  rac.Stroke = function makeStroke(weight, color = null) {
    return new Rac.Stroke(this, weight, color);
  };


  /**
  * Convenience function to create a new `Fill`. The created `fill.rac` is
  * setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Fill}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * let fill = rac.Fill(color)
  * fill.rac === rac // true
  *
  * @param {Rac.Color} [color=null]
  * @returns {Rac.Fill}
  *
  * @function Fill
  * @memberof Rac#
  */
  rac.Fill = function makeFill(color = null) {
    return new Rac.Fill(this, color);
  };


  /**
  * Convenience function to create a new `Style`. The created `style.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Style}`.
  *
  * @example
  * let rac = new Rac()
  * let color = rac.Color(0.2, 0.4, 0.6)
  * let style = rac.Style(rac.Stroke(2, color), rac.Fill(color))
  * style.rac === rac // true
  *
  * @param {Rac.Stroke} [stroke=null]
  * @param {Rac.Fill} [fill=null]
  *
  * @returns {Rac.Style}
  *
  * @function Style
  * @memberof Rac#
  */
  rac.Style = function makeStyle(stroke = null, fill = null) {
    return new Rac.Style(this, stroke, fill);
  };


  /**
  * Convenience function to create a new `Angle`. The created `angle.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Angle}`.
  *
  * @example
  * let rac = new Rac()
  * let angle = rac.Angle(0.2)
  * angle.rac === rac // true
  *
  * @param {Number} turn - The turn value of the angle, in the range `[O,1)`
  * @returns {Rac.Angle}
  *
  * @function Angle
  * @memberof Rac#
  */
  rac.Angle = function makeAngle(turn) {
    return new Rac.Angle(this, turn);
  };


  /**
  * Convenience function to create a new `Point`. The created `point.rac`
  * is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Point}`.
  *
  * @example
  * let rac = new Rac()
  * let point = rac.Point(55, 77)
  * point.rac === rac // true
  *
  * @param {Number} x - The x coordinate
  * @param {Number} y - The y coordinate
  *
  * @returns {Rac.Point}
  *
  * @function Point
  * @memberof Rac#
  */
  rac.Point = function makePoint(x, y) {
    return new Rac.Point(this, x, y);
  };


  /**
  * Convenience function to create a new `Ray` with the given primitive
  * values. The created `ray.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Ray}`.
  *
  * @example
  * let rac = new Rac()
  * let ray = rac.Ray(55, 77, 0.2)
  * ray.rac === rac // true
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Rac.Angle|Number} angle
  *
  * @returns {Rac.Ray}
  *
  * @function Ray
  * @memberof Rac#
  */
  rac.Ray = function makeRay(x, y, angle) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    return new Rac.Ray(this, start, angle);
  };


  /**
  * Convenience function to create a new `Segment` with the given primitive
  * values. The created `segment.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Segment}`.
  *
  * @example
  * let rac = new Rac()
  * let segment = rac.Segment(55, 77, 0.2, 100)
  * segment.rac === rac // true
  *
  * @param {Number} x
  * @param {Number} y
  * @param {Rac.Angle|Number} angle
  * @param {Number} length
  *
  * @returns {Rac.Segment}
  *
  * @function Segment
  * @memberof Rac#
  */
  rac.Segment = function makeSegment(x, y, angle, length) {
    const start = new Rac.Point(this, x, y);
    angle = Rac.Angle.from(this, angle);
    const ray = new Rac.Ray(this, start, angle);
    return new Rac.Segment(this, ray, length);
  };


  /**
  * Convenience function to create a new `Arc` with the given primitive
  * values. The created `arc.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Arc}`.
  *
  * @example
  * let rac = new Rac()
  * let arc = rac.Arc(55, 77, 0.2)
  * arc.rac === rac // true
  *
  * @param {Number} x - The _x_ coordinate for the arc center
  * @param {Number} y - The _y_ coordinate for the arc center
  * @param {Rac.Angle|Number} start - The start of the arc
  * @param {?Rac.Angle|Number} [end=null] - The end of the arc; when
  *   ommited or set to `null`, `start` is used instead
  * @param {Boolean} [clockwise=true] The orientation of the arc
  *
  * @returns {Rac.Arc}
  *
  * @function Arc
  * @memberof Rac#
  */
  rac.Arc = function makeArc(x, y, radius, start = this.Angle.zero, end = null, clockwise = true) {
    const center = new Rac.Point(this, x, y);
    start = Rac.Angle.from(this, start);
    end = end === null
      ? start
      : Rac.Angle.from(this, end);
    return new Rac.Arc(this, center, radius, start, end, clockwise);
  };


  /**
  * Convenience function to create a new `Text`. The created `text.rac` is
  * setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text}`.
  *
  * @example
  * let rac = new Rac()
  * let text = rac.Text(55, 77, 'black quartz')
  * text.rac === rac // true
  *
  * @param {Number} x - The x coordinate location for the drawn text
  * @param {Number} y - The y coordinate location for the drawn text
  * @param {String} string - The string to draw
  * @param {Rac.Text.Format} [format=[rac.Text.Format.topLeft]{@link instance.Text.Format#topLeft}]
  *   The format for the drawn text
  *
  * @returns {Rac.Text}
  *
  * @function Text
  * @memberof Rac#
  */
  rac.Text = function makeText(x, y, string, format = this.Text.Format.topLeft) {
    const point = new Rac.Point(this, x, y);
    return new Rac.Text(this, point, string, format);
  };


  /**
  * Convenience function to create a new `Text.Format`. The created
  * `format.rac` is setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Text.Format}`.
  *
  * [`rac.Text.Format`]{@link instance.Text#Format} is an alias of this
  * function.
  *
  * @example
  * let rac = new Rac()
  * let format = rac.Text.Format('left', 'baseline', 0.2)
  * format.rac === rac // true
  *
  * @param {String} hAlign - The horizontal alignment, left-to-right; one
  *   of the values from [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {String} vAlign - The vertical alignment, top-to-bottom; one of
  *   the values from [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {String} [font=null] - The font name
  * @param {Number} [size=null] - The font size
  * @param {Number} [hPadding=0] - The horizontal padding, left-to-right
  * @param {Number} [vPadding=0] - The vertical padding, top-to-bottom
  *
  * @returns {Rac.Text.Format}
  *
  * @function TextFormat
  * @memberof Rac#
  */
  rac.TextFormat = function makeTextFormat(
    hAlign,
    vAlign,
    angle = rac.Angle.zero,
    font = null,
    size = null,
    hPadding = 0,
    vPadding = 0)
  {
    // This functions uses `rac` instead of `this`, since `this` may point
    // to different objects:
    // + `rac` in this function body
    // + `rac.Text` in the `Text.Format` alias bellow
    angle = Rac.Angle.from(rac, angle);
    return new Rac.Text.Format(
      rac,
      hAlign, vAlign,
      angle, font, size,
      hPadding, vPadding);
  };


  /**
  * Convenience function to create a new `Text.Format`. Alias of
  * [`rac.TextFormat`]{@link Rac#TextFormat}.
  *
  * @param {String} hAlign - The horizontal alignment, left-to-right; one
  *   of the values from [`horizontalAlign`]{@link Rac.Text.Format.horizontalAlign}
  * @param {String} vAlign - The vertical alignment, top-to-bottom; one of
  *   the values from [`verticalAlign`]{@link Rac.Text.Format.verticalAlign}
  * @param {Rac.Angle} [angle=[rac.Angle.zero]{@link instance.Angle#zero}]
  *   The angle towards which the text is drawn
  * @param {String} [font=null] - The font name
  * @param {Number} [size=null] - The font size
  * @param {Number} [hPadding=0] - The horizontal padding, left-to-right
  * @param {Number} [vPadding=0] - The vertical padding, top-to-bottom
  *
  * @function Format
  * @memberof instance.Text#
  */
  rac.Text.Format = rac.TextFormat;


  /**
  * Convenience function that creates a new `Bezier` setup with `this`.
  *
  * The function also contains additional methods and properties listed in
  * `{@link instance.Bezier}`.
  *
  * @param {Number} startX
  * @param {Number} startY
  * @param {Number} startAnchorX
  * @param {Number} startAnchorY
  * @param {Number} endAnchorX
  * @param {Number} endAnchorY
  * @param {Number} endX
  * @param {Number} endY
  *
  * @returns {Rac.Bezier}
  *
  * @function Bezier
  * @memberof Rac#
  */
  rac.Bezier = function makeBezier(
    startX, startY, startAnchorX, startAnchorY,
    endAnchorX, endAnchorY, endX, endY)
  {
    const start = new Rac.Point(this, startX, startY);
    const startAnchor = new Rac.Point(this, startAnchorX, startAnchorY);
    const endAnchor = new Rac.Point(this, endAnchorX, endAnchorY);
    const end = new Rac.Point(this, endX, endY);
    return new Rac.Bezier(this, start, startAnchor, endAnchor, end);
  };


  /**
  * Convenience function to create a new `Composite`. The created
  * `composite.rac` is setup with `this`.
  *
  * @example
  * let rac = new Rac()
  * let composite = rac.Composite()
  * composite.rac === rac // true
  *
  * @param {Array} sequence - An array of drawable objects to contain
  *
  * @returns {Rac.Composite}
  *
  * @function Composite
  * @memberof Rac#
  */
  rac.Composite = function makeComposite(sequence = []) {
    return new Rac.Composite(this, sequence);
  };


}; // attachInstanceFunctions

