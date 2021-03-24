'use strict';


exports.assertExists = function(...checks) {
  checks.forEach((item, index) => {
    if (item === null || item === undefined) {
      console.trace(`Undefined element at index ${index}`)
      throw `MissingParameterError`;
    }
  });
}


// TODO: replace all calls to rac.typeName
/**
* Convenience function for logging, returns the constructor name of
* `obj`, or its type name.
*/
exports.typeName = function(obj) {
  return obj.constructor.name ?? typeof obj
}


// Adds a constant to the given object.
exports.addConstant = function(obj, propName, value) {
  Object.defineProperty(obj, propName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });
}

