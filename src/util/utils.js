'use strict';


// TODO: rename mustExist
exports.checkDefined = function(...checks) {
  checks.forEach((item, index) => {
    if (item === null || item === undefined) {
      console.trace(`Undefined element at index ${index}`)
      throw `MissingParameterError`;
    }
  });
}


// TODO: replace all calls to rac.typeName
exports.typeName = function(obj) {
  return obj.constructor.name ?? typeof obj
}

