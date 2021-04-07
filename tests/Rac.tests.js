'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;


test('Version', () => {
  expect(Rac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(Rac.version).toBe(rac.version);
});


test('Equality threshold', () => {
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


test('Unitary equality threshold', () => {
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


test.todo(`Utility constructors`);

