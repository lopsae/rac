'use strict';

const Rac = require('rulerandcompass');
const tools = require('./testTools');


const rac = tools.rac;


test('RAC version', () => {
  expect(Rac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(Rac.version).toBe(rac.version);
});

