'use strict';


/**
* Internal utilities.
* @namespace utils
*/


/**
* Asserts that all passed parameters are objects. If any parameter is
* `null` or `undefined` an error is thrown.
*
* @name assertExists
* @memberof utils#
* @function
*/
exports.assertExists = function(...checks) {
  checks.forEach((item, index) => {
    if (item === null || item === undefined) {
      // console.trace(`Undefined element at index ${index}`)
      throw new Error('FailedAssert');
    }
  });
}


// TODO: replace all calls to rac.typeName
/**
* Returns the constructor name of `obj`, or its type name.
* Convenience function for debugging.
*
* @name typeName
* @memberof utils#
* @function
*/
exports.typeName = function(obj) {
  if (typeof obj === 'function' && obj.name != null) {
    return obj.name == ''
      ? `function`
      : `function:${obj.name}`;
  }
  return obj.constructor.name ?? typeof obj;
}


/**
* Adds a constant to the given object.
*
* @name addConstant
* @memberof utils#
* @function
*/
exports.addConstant = function(obj, propName, value) {
  Object.defineProperty(obj, propName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });
}

