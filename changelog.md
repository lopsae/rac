Changelog
=========

1.2.0-dev - IN PROGRESS
---------
+ Add `angle.log`
+ Add `point.pointAtBisector`
+ Add `ray.bezierArc`
+ Add `segment.inverse`
+ Add `text.format.toString`
+ Add `rac.textFormatDefaults`
+ Add `text.withAngle`, `text.withFont`, `text.withSize`
+ Add `text.format.withFont`, `text.format.withSize`
+ Add `rac.utils`
+ Modify `Text.Format` constructor defaults and parameter order
+ Modify `Text.Format` to allow nullable `size` and `font`
+ Fix incorrect values set in `rac.Text.Format.topLeft` and `rac.Text.Format.topRight`
+ Modify `point.text` to allow an optional `format` parameter
+ Rename `Text.Format.horizontal` to `horizontalAlign`
+ Rename `Text.Format.vertical` to `verticalAlign`
+ Document `P5Drawer.setDrawFunction`, `P5Drawer.setDebugFunction`, `Rac.utils`, `rac.utils`


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
+ Improve documentation on `Stroke`, `Fill`, `StyleContainer`
+ Improve documentation on `Controller`, `Control`, `RayControl`, `ArcControl`
+ Reimplement `SegmentControl` as `RayControl`
+ Rename `control.copyAnchor` to `affixAnchor`
+ Rename `control.center` to `knob`
+ Rename `segment.withStartExtended` to `withStartExtension`
+ Rename `rac.controller.selection.pointerOffset` to `pointerToKnobOffset`


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

