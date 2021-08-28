TODO's
======

Latest stabe npm used: 7.5.3

In progress
-----------



For version change
------------------
+ Style could be Styles, or StyleContainer? Just a list of styles, which would allow for additional style objects
+ Rename segment.withStartExtended to withStartExtension, maybe add withEndExtension (same as withLengthAdd)
+ rename center to knob in all controls
+ function controller.push to push to controller.controls
+ controls should work without style
+ function to add controls to controller.controls? controller setting to autoadd?


Future
------
+ Docs: reference instance.X on class
+ Docs: reference class on instance.X

+ can rac or drawer have a stroke factor? all applied stroke gets multiplied by this

+ Color can be a style object, applyed to fill and stroke when available?

+ what is the behaviour when equalityThreshold is zero? check and document

+ angle.debug could receive any drawable?

+ function to push marker to controls

+ add arc.withLengthAdd

Bugs
----
+ whole circle control located at 0 shows incorrect arrows

