Found Issues
============

Issues found in published version

+ ArcControls of a complete circle show incorrect arrows at distance 0


Language Questions
==================

Functions that return the same object type with a modified property start with `with...`
+ point.withX
+ segment.withLength
+ segment.withPerpendicularAngle


When object retured is same type, ommit type in function name
+ Not: `ray.perpendicularRay()`
+ Instead: `ray.perpendicular()`

Functions that return a different object type start or end with that object?
+ point.pointPerpendicular or point.perpendicularPoint?
+ arc.chordSegment or arc.segmentChord?


Style
=====

Order of classes:
+ Color
+ Stroke
+ Fill
+ Style
+ Angle
+ Point
+ Ray
+ Segment
+ Arc
+ Text
+ Bezier
+ Composite
+ Shape
+ Control
+ SegmentControl
+ ArcControl

Order of functions in an object:
+ Constructor
+ toString
+ copy
+ accesors (segment.angle())
+ built properties (segment.startPoint())
+ withX simple modifiers (segment.withStart())
+ withX complex modifiers (segment.withStartExtended())
+ transformations (translates, reverse)
+ data processing (segment.clamp)
+ other object builder in class orderd
