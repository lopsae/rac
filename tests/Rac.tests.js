'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


// Run this file with: npm test "rac\."


tools.test( function version() {
  expect(Rac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(Rac.version).toBe(rac.version);
});


tools.test( function equalityThreshold() {
  const threshold = rac.equalityThreshold;
  const bump = threshold/16;

  expect(null).not.thresEquals(3);
  expect(3).not.thresEquals(null);
  expect(null).not.thresEquals(null);

  expect(3).thresEquals(3);
  expect(3).not.thresEquals(4);
  expect(4).not.thresEquals(3);

  expect(7+threshold).not.thresEquals(7);
  expect(7-threshold).not.thresEquals(7);

  expect(7+threshold-bump).thresEquals(7);
  expect(7-threshold+bump).thresEquals(7);
});


tools.test( function unitaryEqualityThreshold() {
  const threshold = rac.unitaryEqualityThreshold;
  const bump = threshold/16;

  expect(null).not.uniThresEquals(3);
  expect(3).not.uniThresEquals(null);
  expect(null).not.uniThresEquals(null);

  expect(3).uniThresEquals(3);
  expect(3).not.uniThresEquals(4);
  expect(4).not.uniThresEquals(3);

  expect(7+threshold+bump).not.uniThresEquals(7);
  expect(7-threshold-bump).not.uniThresEquals(7);

  expect(7+threshold-bump).uniThresEquals(7);
  expect(7-threshold+bump).uniThresEquals(7);
});


tools.test.todo( function instanceStyles() {
});


tools.test.todo( function instanceAngle() {
});


tools.test.todo( function instancePoint() {
});


tools.test.todo( function instanceRay() {
});


tools.test.todo( function instanceSegment() {
});


tools.test( function instanceArc() {
  //Arc(x, y, radius, start = this.Angle.zero, end = null, clockwise = true)

  // Angle/number parameter
  expect(rac.Arc(55, 55, 72, rac.Angle.zero, rac.Angle.half, true))
    .equalsArc(55, 55, 72, 0, 1/2, true);
  expect(rac.Arc(55, 55, 72, 0, 1/2, true))
    .equalsArc(55, 55, 72, 0, 1/2, true);

  // Default parameters
  expect(rac.Arc(55, 55, 72))
    .equalsArc(55, 55, 72, 0, 0, true);
  expect(rac.Arc(55, 55, 72, 1/2))
    .equalsArc(55, 55, 72, 1/2, 1/2, true);
  expect(rac.Arc(55, 55, 72, 1/2, 1/4))
    .equalsArc(55, 55, 72, 1/2, 1/4, true);
  expect(rac.Arc(55, 55, 72, 1/2, 1/4, false))
    .equalsArc(55, 55, 72, 1/2, 1/4, false);

  // nullable parameter
  expect(rac.Arc(55, 55, 72, 1/2, null))
    .equalsArc(55, 55, 72, 1/2, 1/2, true);
  expect(rac.Arc(55, 55, 72, 1/2, null, false))
    .equalsArc(55, 55, 72, 1/2, 1/2, false);

  // known issue, undefined becomes null
  expect(rac.Arc(55, 55, 72, 1/2, undefined))
    .equalsArc(55, 55, 72, 1/2, 1/2, true);
});


test.todo(`Check for coverage!`);

