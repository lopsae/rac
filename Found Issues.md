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
