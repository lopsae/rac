'use strict';


const Rac = require('../Rac');


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
      throw Rac.Exception.failedAssert.make(
        `Missing element at index ${index}`);
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
  if (obj === undefined) {
    return 'undefined';
  }
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

