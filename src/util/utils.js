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
    if (!(item instanceof type)) {
      throw Rac.Exception.failedAssert.make(
        `Element is unexpected type - element:${item} element-type:${typeName(item)} expected-name:${type.name}`);
    }
  });
}


/**
* TODO
*
* @name assertNumber
* @memberof utils#
* @function
*/
exports.assertNumber = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'number') {
      throw Rac.Exception.failedAssert.make(
        `Element is unexpected type, expecting number primitive - element:${item} element-type:${typeName(item)}`);
    }
  });
}


/**
* TODO
*
* @name assertBoolean
* @memberof utils#
* @function
*/
exports.assertBoolean = function(...elements) {
  elements.forEach(item => {
    if (typeof item !== 'boolean') {
      throw Rac.Exception.failedAssert.make(
        `Element is unexpected type, expecting boolean primitive - element:${item} element-type:${typeName(item)}`);
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

