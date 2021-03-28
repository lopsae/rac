'use strict';

const Rac = require('rulerandcompass');
const tools = require('./testTools');


const rac = tools.rac;


let diagonal = rac.Ray(rac.Point(55, 55), rac.Angle.se);


test('identity', () => {
  expect(null).not.equalsRay(55, 55, rac.Angle.se);

  expect(diagonal).equalsRay(55, 55, rac.Angle.se);
  expect(diagonal).not.equalsRay(100, 100, rac.Angle.zero);

  let string = diagonal.toString();
  expect(string).toMatch('Ray');
  expect(string).toMatch('55');
  expect(string).toMatch('0.125');
});

