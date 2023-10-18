Order of tests
==============
Preferred order of testing functions.


identity
--------------
+ Rac instance - check that using a different rac instance affects expectation extensions and equals
+ Testing Constants - check for expected values of constants for testing
+ Angle/number parameter - check that passing equalsX angles or numbers works, see Ray.tests for example
+ Assertion Inequality - check for each property that changing it affects assertion
+ Unexpected types for equalsX - check that unexpected types passed to expect affects the assertion
+ Expected types for equals - check that x.equals is true and false with expected types
+ Unexpected types for equals - check that x.equals is false with unexpected types


toString
--------


thrownErrors
------------


instanceMembers
----------------
check for expected values of rac.X.members, like rac.Point.zero


allOtherFunctions
-----------------
Tests for all remaining functions


