'use strict';

const Rac = require('rulerandcompass');
const tools = require('./testTools');


const rac = tools.rac;


test('identity', () => {
  expect(null).not.equalsAngle(0);
  expect(null).not.equalsAngle(1/2);

  expect(rac.Angle.zero).equalsAngle(0);
  expect(rac.Angle.zero).equalsAngle(rac.Angle.east);
  expect(rac.Angle.zero).equalsAngle(1);
  expect(rac.Angle.zero).equalsAngle(55);
  expect(rac.Angle.zero).equalsAngle(-7);

  expect(rac.Angle.half).equalsAngle(1/2);
  expect(rac.Angle.half).equalsAngle(rac.Angle.left);
  expect(rac.Angle.half).equalsAngle(2.5);
  expect(rac.Angle.half).equalsAngle(-0.5);
  expect(rac.Angle.half).equalsAngle(-7.5);

  let string = rac.Angle(0.12345).toString();
  expect(string).toMatch('Angle');
  expect(string).toMatch('0.12345');

  string = rac.Angle(0.12345).toString(2);
  expect(string).toMatch('Angle');
  expect(string).toMatch('0.12');
  expect(string).not.toMatch('0.123');
});


test('errors', () => {
  expect(() => {new Rac.Angle(null, 1/2);})
    .toThrow();
  expect(() => {new Rac.Angle(rac, null);})
    .toThrow();
  expect(() => {Rac.Angle.from(rac, 'unsuported');})
    .toThrow();
  expect(() => {Rac.Angle.from(null, 1/2);})
    .toThrow();
});


test.todo('Angle.from')

