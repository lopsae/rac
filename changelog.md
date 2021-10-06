Changelog
=========

1.1.0-dev
---------
+ Add `controller.controlStyle`, `controller.autoAddControls`
+ Add `textFormat.withAngle`
+ Add `arc.withLengthAdd`
+ Add `segment.withEndExtension`
+ Make `controller.pointerStyle` nullable
+ Implement `StyleContainer` as replacement of `Style`
+ Implement `p5Drawer.strokeWeightFactor`
+ Improve documentation on `Stroke`, `Fill`, `StyleContainer`
+ Improve documentation on `Controller`, `Control`, `RayControl`, `ArcControl`
+ Reimplement `SegmentControl` as `RayControl`
+ Rename `control.copyAnchor` to `affixAnchor`
+ Rename `control.center` to `knob`
+ Rename `segment.withStartExtended` to `withStartExtension`


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

