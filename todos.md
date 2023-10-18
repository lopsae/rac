TODO's
======


In progress
-----------


For version change
------------------
+ check package with `npm pkg fix`
+ check npm summary page, links are to https://lopsae.github.io/rac


Future
------
+ add segment.endRay, segment.rayAtLengthRatio, segment.rayAtLength
+ Create Drawable namespace, and document the drawable methods
+ add Color.hexString()
+ Update docs for Color.fromHex support for 8 hex numerals
+ add textFormat.withFormatAlign(otherFormt) to copy only align properties
+ add textFormat.withAlign(x, y) to set align properties
+ add text.withAlign(otherFormat) to copy only align properties

+ Create a namespace for `CanBeAngle` to replace `{Rac.Angle|Number}` and the phrases `derived from angle` or `produced from angle`. Angleable? CanBeAngle? ContainsAngle? AngleProvider? AngleTransformable?
+ A lot of `@see` now seem superfluous, remove?
+ see if a test page can be created for an example of tags, see https://jsdoc.app/tags-ignore.html
+ Control.anchor, make it a method to type check
+ Controller.pointer..., type check the received object

+ Observable: see if rac can use dynamic import: https://observablehq.com/@observablehq/require at the end of page

+ Can Arc have a null end? to signal full circle

+ Color can be a style object, applied to fill and stroke when available?

+ what is the behaviour when equalityThreshold is zero? check and document

+ angle.debug could receive any drawable?

+ function to push marker to controls

+ separate drawing/style of control selection, effects, and pointer

+ Control -> RangeControl? when controls with boolean/toggle-value are defined
+ Leave still a base Control class?


Bugs
----

