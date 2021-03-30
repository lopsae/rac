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
exports.assertExists = function(...parameters) {
  parameters.forEach((item, index) => {
    if (item === null || item === undefined) {
      throw Rac.Exception.failedAssert.make(
        `Missing element at index ${index}`);
    }
  });
}


/**
* TODO
*
* @name assertType
* @memberof utils#
* @function
*/
exports.assertType = function(type, ...elements) {
  elements.forEach(item => {
    if (type === Number) {
      if (typeof item !== 'number') {
        throw Rac.Exception.failedAssert.make(
          `Element with unexpected type - element:${item} element-type:${typeName(item)} expected-name:${type.name}`);
      }
      return;
    }

    if (!(item instanceof type)) {
      throw Rac.Exception.failedAssert.make(
        `Element with unexpected type - element:${item} element-type:${typeName(item)} expected-name${type.name}`);
    }
  });
}


/**
* Returns the constructor name of `obj`, or its type name.
* Convenience function for debugging.
*
* @name typeName
* @memberof utils#
* @function
*/
function typeName(obj) {
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
exports.typeName = typeName;


/**
* Adds a constant to the given object, the constant is not enumerable and
* not configurable.
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

