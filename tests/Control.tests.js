'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


tools.test( function initial() {
  const control = new Rac.Control(rac, 0.5);
  expect(control.value).toBe(0.5);
});


tools.test( function valueProjection() {
  const control = new Rac.Control(rac, 0.2);
  expect(control.value).toBe(0.2);
  expect(control.projectedValue()).toBe(0.2);

  control.projectionStart = 2;
  control.projectionEnd   = 4;
  expect(control.value).toBe(0.2);
  expect(control.projectedValue()).toBe(2.4);

  control.projectionStart = 4;
  control.projectionEnd   = 2;
  expect(control.value).toBe(0.2);
  expect(control.projectedValue()).toBe(3.6);
});


tools.test( function abstractFunctions() {
  const control = new Rac.Control(rac, 0.2);

  expect(() => { control.knob(); })
    .toThrowNamed(Rac.Exception.abstractFunctionCalled.exceptionName);

  expect(() => { control.affixAnchor(); })
    .toThrowNamed(Rac.Exception.abstractFunctionCalled.exceptionName);

  expect(() => { control.draw(); })
    .toThrowNamed(Rac.Exception.abstractFunctionCalled.exceptionName);

  expect(() => { control.updateWithPointer(rac.Point.zero, null); })
    .toThrowNamed(Rac.Exception.abstractFunctionCalled.exceptionName);

  expect(() => { control.drawSelection(rac.Point.zero, null, rac.Segment.zero); })
    .toThrowNamed(Rac.Exception.abstractFunctionCalled.exceptionName);
});


// TODO: full coverage!

