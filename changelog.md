Changelog
=========

1.1.0-dev
---------
+ Add `controller.controlStyle`, `controller.autoAddControls`
+ Add `textFormat.withAngle`
+ Make `controller.pointerStyle` nullable
+ Implement `StyleContainer` as replacement of `Style`
+ Implement `p5Drawer.strokeWeightFactor`
+ Improve documentation on `Stroke`, `Fill`, `StyleContainer`
+ Improve documentation on `Controller`, `Control`, `RayControl`, `ArcControl`
+ Reimplement `SegmentControl` as `RayControl`
+ Rename `control.copyAnchor` to `affixAnchor`
+ Rename `control.center` to `knob`


1.0.1 - 2021 August 20th
------------------------
Improvement for tutorials
+ Additional documentation for Stroke, Fill, Color
+ Added `angle.sin/cos/tan`
+ Added `color.linearTransition`
+ Added `ray.[ray|point]AtCanvasEdge
+ Added `arc.with[Start|End]Extension`, `arc.with[Start|End]Point`
+ Implemented debug display for Ray
+ `color.stroke` now defaults to `null` weight
+ `color.alpha` renamed to `a`
+ `p5Drawer.debugRadius` renamed to `debugMarkerRadius`


1.0.0 - 2021 June 1st
---------------------
First public release
+ Rac works as an instance, instead of a global
+ All drawable classes documented, tested, and stable
+ Drawables stabilized as Angle, Point, Ray, Segment, Arc

