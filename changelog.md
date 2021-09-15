Changelog
=========

1.1.0-dev
---------
+ `controller.pointerStyle` can now be `null`
+ Added `controller.controlStyle`, `controller.autoAddControls`
+ Added `textFormat.withAngle`
+ Implemented `StyleContainer` as replacement of `Style`
+ Improved documentation on `Stroke`, `Fill`, `StyleContainer`
+ Improved documentation on `Controller`, `Control`, `SegmentControl`, `ArcControl`


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

