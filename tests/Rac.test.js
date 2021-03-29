'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;


test('Version', () => {
  expect(Rac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(Rac.version).toBe(rac.version);
});


expect.extend({ equalsWithThreshold(value, expected) {
  const options = {
    comment: 'equal values with rac.equals',
    isNot: this.isNot
  };

  const isEqual = rac.equals(value, expected);
  return tools.done(isEqual, () =>
    this.utils.matcherHint('equalsWithThreshold',
      value, expected,
      options));
}}); // equalsWithThreshold


expect.extend({ equalsWithUnitaryThreshold(value, expected) {
  const options = {
    comment: 'equal values with rac.unitaryEquals',
    isNot: this.isNot
  };

  const isEqual = rac.unitaryEquals(value, expected);
  return tools.done(isEqual, () =>
    this.utils.matcherHint('equalsWithUnitaryThreshold',
      value, expected,
      options)
    + '\n\n'
    + `distance: ${Math.abs(value-expected)}\n`
    + `threshold: ${rac.unitaryEqualityThreshold}`
    );
}}); // equalsWithUnitaryThreshold


test('Equality threshold', () => {
  let threshold = rac.equalityThreshold;
  let bump = threshold/16;

  expect(3).equalsWithThreshold(3);
  expect(3).not.equalsWithThreshold(4);
  expect(4).not.equalsWithThreshold(3);

  expect(7+threshold).not.equalsWithThreshold(7);
  expect(7-threshold).not.equalsWithThreshold(7);

  expect(7+threshold-bump).equalsWithThreshold(7);
  expect(7-threshold+bump).equalsWithThreshold(7);
});


test('Unitary equality threshold', () => {
  let threshold = rac.unitaryEqualityThreshold;
  let bump = threshold/16;

  expect(3).equalsWithUnitaryThreshold(3);
  expect(3).not.equalsWithUnitaryThreshold(4);
  expect(4).not.equalsWithUnitaryThreshold(3);

  expect(7+threshold+bump).not.equalsWithUnitaryThreshold(7);
  expect(7-threshold-bump).not.equalsWithUnitaryThreshold(7);

  expect(7+threshold-bump).equalsWithUnitaryThreshold(7);
  expect(7-threshold+bump).equalsWithUnitaryThreshold(7);
});

