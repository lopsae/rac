TODO's
======

Latest stabe npm used: 7.5.3, checked 2021 Aug 16th

In progress
-----------
+ BUG: whole circle control located at 0 shows incorrect arrows
+ recheck what is drawn with fills for controls
+ can rac or drawer have a stroke factor? all applied stroke gets multiplied by this
+ popComposite,popShape,stack are still setup as static properties of Rac
+ add arc.withLengthAdd
+ Rename segment.withStartExtended to withStartExtension, maybe add withEndExtension (same as withLengthAdd)

+ Can Arc have a null end? to signal full circle


For version change
------------------



Future
------
+ Docs: reference instance.X on class
+ Docs: reference class on instance.X

+ Color can be a style object, applyed to fill and stroke when available?

+ what is the behaviour when equalityThreshold is zero? check and document

+ angle.debug could receive any drawable?

+ function to push marker to controls

+ separate drawing/style of control selection, effects, and pointer

+ Control -> RangeControl? when controls with boolean/toggle-value are defined
+ Leave still a base Control class?


Bugs
----
+
