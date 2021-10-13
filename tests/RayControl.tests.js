'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


tools.test( function initial() {
  const control = new Rac.RayControl(rac, 0.5, 100);
  expect(control.value).toBe(0.5);
  expect(control.length).toBe(100);
  expect(control.distance()).toBe(50);
});


tools.test( function withAnchor() {
  const control = new Rac.RayControl(rac, 0.5, 100);

  expect(control.anchor).toBe(null);
  expect(control.knob()).toBe(null);

  expect(() => { control.affixAnchor(); })
    .toThrowNamed(Rac.Exception.invalidObjectConfiguration.exceptionName);

  control.anchor = rac.Ray.zero;

  expect(control.anchor).equalsRay(0, 0, 0);
  expect(control.knob()).equalsPoint(50, 0);
  expect(control.affixAnchor()).equalsSegment(0, 0, 0, 100);
});


tools.test( function updateWithPointer() {
  const control = new Rac.RayControl(rac, 0.5, 100);
  control.anchor = rac.Ray.zero;
  const fixedAnchor = control.affixAnchor();

  control.updateWithPointer(rac.Point.zero, fixedAnchor);
  expect(control.value).toBe(0);
  expect(control.distance()).toBe(0);
  expect(control.knob()).equalsPoint(0, 0);

  control.updateWithPointer(rac.Point(-20, 100), fixedAnchor);
  expect(control.value).toBe(0);
  expect(control.distance()).toBe(0);
  expect(control.knob()).equalsPoint(0, 0);

  control.updateWithPointer(rac.Point(70, -100), fixedAnchor);
  expect(control.value).toBe(0.7);
  expect(control.distance()).toBe(70);
  expect(control.knob()).equalsPoint(70, 0);

  control.updateWithPointer(rac.Point(120, 100), fixedAnchor);
  expect(control.value).toBe(1);
  expect(control.distance()).toBe(100);
  expect(control.knob()).equalsPoint(100, 0);
});


// TODO: full coverage!

