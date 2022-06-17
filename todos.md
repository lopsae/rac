TODO's
======


In progress
-----------
+ document/test point.pointAtBisector
+ document/test ray.bezierArc
+ document/test segment.inverse
+ Fix RELEASE-TODO's
+ Add docs to rac.Text.Format.topLeft and rac.Text.Format.topRight
+ rename TextFormat hor/ver to hAnchor, vAnchor?
+ Add documentation to TextFormat, check https://p5js.org/reference/#/p5/textAlign for examples for names and description
+ Text.Format.defaults may need to move to rac instance, otherwise these are shared between instances


For version change
------------------



Future
------
+ implement Angle.log
+ implement point.pointAtBisector
+ Control.anchor, make it a method to type check
+ Controller.pointer..., type check the received object
+ Docs: reference instance.X on class
+ Docs: reference class on instance.X

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
+ BUG: whole circle control located at 0 shows incorrect arrows
