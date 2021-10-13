'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


tools.test( function initial() {
  const control = new Rac.ArcControl(rac, 0.5, rac.Angle.from(0.5));
  expect(control.value).toBe(0.5);
  expect(control.angleDistance).equalsAngle(0.5);
  expect(control.distance()).equalsAngle(0.25);
});


tools.test( function withAnchor() {
  const control = new Rac.ArcControl(rac, 0.5, rac.Angle.from(0.5));

  expect(control.anchor).toBe(null);
  expect(control.knob()).toBe(null);

  expect(() => { control.affixAnchor(); })
    .toThrowNamed(Rac.Exception.invalidObjectConfiguration.exceptionName);

  control.anchor = rac.Arc(0, 0, 100);

  expect(control.anchor).equalsArc(0, 0, 100, 0, 0);//, true);
  expect(control.knob()).equalsPoint(0, 100);
  expect(control.affixAnchor()).equalsArc(0, 0, 100, 0, 0.5);//, true);
});


tools.test( function updateWithPointer() {
  const control = new Rac.ArcControl(rac, 0.5, rac.Angle.from(0.5));
  control.anchor = rac.Arc(0, 0, 100);
  const fixedAnchor = control.affixAnchor();

  control.updateWithPointer(rac.Point.zero, fixedAnchor);
  expect(control.value).toBe(0);
  expect(control.distance()).equalsAngle(0);
  expect(control.knob()).equalsPoint(100, 0);

  control.updateWithPointer(rac.Point(100, 0), fixedAnchor);
  expect(control.value).toBe(0);
  expect(control.distance()).equalsAngle(0);
  expect(control.knob()).equalsPoint(100, 0);

  control.updateWithPointer(rac.Point(277, 0), fixedAnchor);
  expect(control.value).toBe(0);
  expect(control.distance()).equalsAngle(0);
  expect(control.knob()).equalsPoint(100, 0);

  control.updateWithPointer(rac.Point(277, -10), fixedAnchor);
  expect(control.value).toBe(0);
  expect(control.distance()).equalsAngle(0);
  expect(control.knob()).equalsPoint(100, 0);

  control.updateWithPointer(rac.Point(0, 55), fixedAnchor);
  expect(control.value).toBe(0.5);
  expect(control.distance()).equalsAngle(0.25);
  expect(control.knob()).equalsPoint(0, 100);

  control.updateWithPointer(rac.Point(0, 277), fixedAnchor);
  expect(control.value).toBe(0.5);
  expect(control.distance()).equalsAngle(0.25);
  expect(control.knob()).equalsPoint(0, 100);

  control.updateWithPointer(rac.Point(-277, 0), fixedAnchor);
  expect(control.value).toBe(1);
  expect(control.distance()).equalsAngle(0.5);
  expect(control.knob()).equalsPoint(-100, 0);

  control.updateWithPointer(rac.Point(-277, -10), fixedAnchor);
  expect(control.value).toBe(1);
  expect(control.distance()).equalsAngle(0.5);
  expect(control.knob()).equalsPoint(-100, 0);
});


// TODO: full coverage!

