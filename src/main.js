

// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // https://github.com/amdjs/amdjs-api/blob/master/AMD.md
    // https://requirejs.org/docs/whyamd.html
    // AMD. Register as an anonymous module.

    // console.log(`Loading RAC for AMD - define:${typeof define}`);
    define([], factory);
    return;
  }

  if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.

    // console.log(`Loading RAC for Node - module:${typeof module}`);
    module.exports = factory();
    return;
  }

  // Browser globals (root is window)

  // console.log(`Loading RAC into self - root:${typeof root}`);
  root.Rac = factory();

}(typeof self !== 'undefined' ? self : this, function () {

  return require('./Rac');

}));

