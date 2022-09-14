'use strict';


/**
* Throwable object to report errors, and container of convenience functions
* to create these.
*
* The static functions create either `Exception` or `Error` instances,
* since different environments respond differentely to these throws. For
* more details see [`buildsErrors`]{@link Rac.Exception.buildsErrors}.
*
* @alias Rac.Exception
*/
class Exception {

  /**
  * Creates a new `Exception` instance.
  * @param {String} name
  *   The name of the exception
  * @param {String} message
  *   The message of the exception
  */
  constructor(name, message) {
    this.name = name;
    this.message = message;
  }


  /**
  * Returns a string representation intended for human consumption.
  *
  * @example
  * (new Rac.Exception('NotAPangram', 'Waltz, bad nymph')).toString()
  * // Returns: 'Exception:NotAPangram - Waltz, bad nymph'
  *
  * @returns {String}
  */
  toString() {
    return `Exception:${this.name} - ${this.message}`;
  }


  /**
  * When `true` the convenience static functions of this class will
  * build `Error` objects, otherwise `Exception` objects are built.
  *
  * Defaults to `false` for browser use: throwing an `Exception` in chrome
  * displays the error stack using source-maps when available. In contrast
  * throwing an `Error` object displays the error stack relative to the
  * bundled file, which is harder to read.
  *
  * Used as `true` for test runs in Jest: throwing an `Error` will be
  * reported in the test report, while throwing a custom object (like
  * `Exception`) within a matcher results in the expectation hanging
  * indefinitely.
  *
  * @type {Boolean}
  * @default false
  *
  * @memberof Rac.Exception
  */
  static buildsErrors = false;


  /**
  * Returns a factory function that builds throwable objects with the given
  * `name`.
  *
  * @example
  * let factory = Rac.Exception.named('NotAPangram')
  * factory.exceptionName // returns 'NotAPangram'
  * factory('Waltz, bad nymph').toString()
  * // returns: 'Exception:NotAPangram - Waltz, bad nymph'
  *
  * @param {String} name - The name for the produced throwable objects
  * @return {Rac.Exception~namedFactory}
  */
  static named(name) {
    /**
    * Factory function that returns a throwable object with the given
    * `message`.
    *
    * @callback Rac.Exception~namedFactory
    *
    * @property {String} exceptionName
    *   The name for the produced throwable objects
    * @param {String} message
    *   The message for the produced throwable object.
    *
    * @return {Exception|Error}
    */
    let func = (message) => {
      if (Exception.buildsErrors) {
        const error = new Error(message);
        error.name = name;
        return error;
      }

      return new Exception(name, message);
    };

    func.exceptionName = name;
    return func;
  }

  static drawerNotSetup             = Exception.named('DrawerNotSetup');
  static failedAssert               = Exception.named('FailedAssert');
  static invalidObjectType          = Exception.named('InvalidObjectType');
  static abstractFunctionCalled     = Exception.named('AbstractFunctionCalled');
  // TODO: migrate rest of invalidObjectConfiguration
  static invalidObjectConfiguration = Exception.named('InvalidObjectConfiguration');

  // invalidParameterCombination: 'Invalid parameter combination',

  // invalidObjectToDraw: 'Invalid object to draw',
  // invalidObjectToApply: 'Invalid object to apply',

} // class Exception


module.exports = Exception;

