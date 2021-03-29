'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;


let diagonal = rac.Ray(rac.Point(55, 55), rac.Angle.se);


test('Identity', () => {
  expect(null).not.equalsRay(55, 55, rac.Angle.se);

  expect(diagonal).equalsRay(55, 55, rac.Angle.se);
  expect(diagonal).not.equalsRay(100, 100, rac.Angle.zero);

  let string = diagonal.toString();
  expect(string).toMatch('Ray');
  expect(string).toMatch('55');
  expect(string).toMatch('0.125');
});


test('Slope, yIntercept', () => {
  let hunty = rac.Point(100, 100);
  expect(rac.Ray(hunty, rac.Angle.zero).slope()).thresEquals(0);
  expect(rac.Ray(hunty, rac.Angle.half).slope()).thresEquals(0);

  expect(rac.Ray(hunty, rac.Angle.down).slope()).toBe(null);
  expect(rac.Ray(hunty, rac.Angle.up).slope()).toBe(null);

  expect(rac.Ray(hunty, rac.Angle.bottomRight).slope()).thresEquals(1);
  expect(rac.Ray(hunty, rac.Angle.topLeft).slope()).thresEquals(1);

  expect(rac.Ray(hunty, rac.Angle.topRight).slope()).thresEquals(-1);
  expect(rac.Ray(hunty, rac.Angle.bottomLeft).slope()).thresEquals(-1);

  expect(rac.Ray(hunty, rac.Angle.tr).yIntercept())
    .thresEquals(200);
  expect(rac.Ray(hunty.negative(), rac.Angle.bl).yIntercept())
    .thresEquals(-200);

  expect(rac.Ray(hunty, rac.Angle.br).yIntercept())
    .thresEquals(0);
  expect(rac.Ray(hunty.negative(), rac.Angle.tl).yIntercept())
    .thresEquals(0);

  expect(rac.Ray(hunty, rac.Angle.u).yIntercept()).toBe(null);
  expect(rac.Ray(hunty.negative(), rac.Angle.d).yIntercept()).toBe(null);
});


test.todo('More!')

