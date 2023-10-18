Style Guidelines
================


Order of classes
----------------
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
+ RayControl
+ ArcControl


Order of functions in a class
-----------------------------
+ Constructor
+ toString
+ equals
+ accesors (segment.angle())
+ built properties (segment.startPoint())
+ withX simple modifiers (segment.withStart())
+ withX complex modifiers (segment.withStartExtension())
+ transformations (returns same object, modified: translates, reverse)
+ data processing/calculations (segment.clamp, distanceToPoint)
+ other object builder in class order



Style
=====

Functions that return the same object type with a modified property start with *with*:
+ `point.withX(x)`
+ `segment.withLength(newLength)`
+ `segment.withPerpendicularAngle(clockwise)`


When possible, functions that create a new object should start with that object name:
+ `point.ray(angle)`, `point.rayToPoint(point)`
+ `ray.segmentToIntersection(otherRay)`
+ `arc.pointAtLength(length)`


Sometimes functions that create a new object can start with a particular word to group several functions with related functionality, usually defines a caracteristic that is intrinsic to the instance, like *radius* for arcs, or *next* for segments:
+ `arc.radiusSegmentAtAngle(angle)`, `arc.radiusSegmentTowardsPoint(point)`
+ `segment.nextSegmentPerpendicular(clockwise, length)`, `nextSegmentToAngle(angle, length)`
+ `arc.intersectionArc(otherArc)`, `arc.intersectionChord(otherArc)`


When object type retured is same as instance and the operation is transformation, ommit type in function name:
+ Not: `ray.perpendicularRay()`
+ Instead: `ray.perpendicular()`


When object type retured is same as instance, but operation is dependant on other objects, type in function name may be used:
+ Not: `point.atBisector(otherPoint)`
+ Instead: `point.pointAtBisector(otherPoint)`


Functions that throw an error in a specific circumstance must mention it:
+ > An error is thrown when `anchor` is not set.
+ > An error is thrown when `hexString` is misformatted or cannot be parsed.

Documentation that refers to the instance itself should use `this`.
+ Not: Class associated with the setings in the instance.
+ Instead: Class associated with the setings in `this`.

+ Not: Returns a new `Segment` using the object and the given `length`.
+ Instead: Returns a new `Segment` using `this` and the given `length`.

Preffer present tense to future tense.
+ Not: This method will consider turn values...
+ Innstead: This method considers turn values...

Most functions that return objects start with _Returns a new `Object`_:
+ > Returns a new `Segment` from `this` to `point`.
Afterwards in the documentation body, refer to the object being returned as _The resulting `Object`:
+ Not: When `this` and `point` are considered equal the new `Segment` defaults to...
+ Instead: When `this` and `point` are considered equal the resulting `Segment` defaults to...
However, param descriptions should use _the new `Object`_:
+ > The length of the new `Segment`





Usual Cases
===========

Nullable params
---------------
Parameters that can be set to null and dont have a default.
```
@param {?String} newFont - The font name for the new `Text.Format`; can be set to `null`
```

Nullable params with default
----------------------------
Parameters that can be st to null and have a default value.
```
@param {?Rac.Angle|Number} [endAngle=null] - The end `Angle` of the new `Arc`; when ommited or set to `null`, `this.angle` is used instead
```
// MAICTODO: correct in ray to have example used





Language Questions
==================

Functions that return a different object type start or end with that object?
+ point.pointPerpendicular or point.perpendicularPoint?
+ arc.chordSegment or arc.segmentChord?


Functions with adjective-object structure to use a past tense?
Look for other examples? There does not seem to be a lot of past tense adjectives
+ Not: `ray.projectionPoint` or `ray.pointProjection`
+ Instead: `ray.projectedPoint` ray.pointAtProjection



