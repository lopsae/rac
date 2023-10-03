Changelog
=========

1.3.0-dev - Work in progress
----------------------------
+ Overall documentation improvements and corrections
+ Add `ray.text`, `segment.text`, `arc.text`
+ Add `arc.startTangentRay`, `arc.endTangentRay`, `arc.startRadiusSegment`, `arc.endRadiusSegment`
+ Add `text.reverse`, `text.upright`, `text.withPaddings`
+ Add properties `textFormat.hPadding`, `textFormat.vPadding`
+ Add `textFormat.withPaddings`
+ Add `rac.Text.Format.bottomCenter`, `rac.Text.Format.bottomRight`
+ Add `rac.Text.Format.baseline...` constants
+ Add abbreviated shorthands for `rac.Text.Format` ready-made formats, like `rac.Text.Format.tl`
+ Add tests for `Color`
+ Renamed `version` file to `versioning`



1.2.1 - 2022 October 27th
-------------------------
Add Rac.dated and overhaul documentation examples and code blocks
+ Fix incorrect arrows showing for ArcControl with a full circle `angleDistance`
+ Add `Rac.dated` with the date of the build
+ Update `minami-rac` to `1.4.1` with overhauls to `example` and `code` blocks
+ Improve documentation examples for several classes
+ Improve references to `instance` namespace for several classes
+ Overall documentation improvements and corrections


1.2.0 - 2022 September 8th
--------------------------
Streamline and document Text and Text.Format
+ Fix incorrect values set in `rac.Text.Format.topLeft` and `rac.Text.Format.topRight`
+ Add `angle.log`
+ Add `point.pointAtBisector`
+ Add `segment.inverse`
+ Add `text.format.toString`
+ Add `rac.textFormatDefaults`
+ Add `text.withAngle`, `text.withFont`, `text.withSize`
+ Add `text.format.withFont`, `text.format.withSize`
+ Add `rac.utils`
+ Modify `Text.Format` constructor defaults and parameter order
+ Modify `Text.Format` to allow nullable `size` and `font`
+ Modify `rac.Text` to allow an optional `format` parameter
+ Modify `point.text` to allow an optional `format` parameter
+ Rename `Text.Format.horizontal` to `horizontalAlign`
+ Rename `Text.Format.vertical` to `verticalAlign`
+ Rename `text.format.inverse` to `reverse`
+ Improve documentation for `p5drawer.debugTextOptions`
+ Document `P5Drawer.setDrawFunction`, `P5Drawer.setDebugFunction`, `Rac.utils`, `rac.utils`, `rac.textFormatDefaults`
+ Document `Text`, `Text.Format`


1.1.0 - 2021 October 13th
-------------------------
Finalize and document Controls and Styles
+ Add `controller.controlStyle`, `controller.autoAddControls`
+ Add `textFormat.withAngle`
+ Add `arc.withLengthAdd`
+ Add `segment.withEndExtension`
+ Modify `controller.pointerStyle` to nullable
+ Implement `StyleContainer` as replacement of `Style`
+ Implement `p5Drawer.strokeWeightFactor`
+ Reimplement `SegmentControl` as `RayControl`
+ Rename `control.copyAnchor` to `affixAnchor`
+ Rename `control.center` to `knob`
+ Rename `segment.withStartExtended` to `withStartExtension`
+ Rename `rac.controller.selection.pointerOffset` to `pointerToKnobOffset`
+ Improve documentation for `Stroke`, `Fill`, `StyleContainer`
+ Improve documentation for `Controller`, `Control`, `RayControl`, `ArcControl`


1.0.1 - 2021 August 20th
------------------------
Improvement for tutorials
+ Add `angle.sin/cos/tan`
+ Add `color.linearTransition`
+ Add `ray.[ray|point]AtCanvasEdge
+ Add `arc.with[Start|End]Extension`, `arc.with[Start|End]Point`
+ Change `color.stroke()` to default to `null` weight
+ Implement debug display for `Ray`
+ Improve documentation for `Stroke`, `Fill`, `Color`
+ Rename `color.alpha` to `a`
+ Rename `p5Drawer.debugRadius` to `debugMarkerRadius`


1.0.0 - 2021 June 1st
---------------------
First public release
+ Rac works as an instance, instead of a global
+ All drawable classes documented, tested, and stable
+ Drawables stabilized as Angle, Point, Ray, Segment, Arc

