'use strict';


/**
* Exceptions used in Rac.
* @alias Rac.Exception
*/
class Exception {

  constructor(name, message) {
    this.name = name;
    this.message = message;
  }

  toString() {
    return `Exception:${name} - ${message}`;
  }

  /**
  * Returns an convenience object for a named `Exception`. The object
  * will have the property `name` with the given `name` parameter, and
  * a function `make(message)` to produce a new `Exception` with a given
  * `message`.
  */
  static named(name) {
    return {
      name: name,
      make: message => new Exception(name, message)
    };
  }

  static drawerNotSetup =    Exception.named('DrawerNotSetup');
  static failedAssert =      Exception.named('FailedAssert');
  static invalidObjectType = Exception.named('invalidObjectType');

  // abstractFunctionCalled: 'Abstract function called',
  // invalidParameterCombination: 'Invalid parameter combination',
  // invalidObjectConfiguration: 'Invalid object configuration',
  // invalidObjectToDraw: 'Invalid object to draw',
  // invalidObjectToApply: 'Invalid object to apply',

} // class Exception


module.exports = Exception;

