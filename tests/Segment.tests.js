'use strict';

const Rac = require('rulerandcompass');
const tools = require('./tools');


const rac = tools.rac;


let fifty = rac.Point(55, 55);
let diagonal = rac.Segment(rac.Ray(fifty, rac.Angle.eighth), 100);


test('Identity', () => {
  expect(null).not.equalsSegment(55, 55, rac.Angle.eighth, 100);

  expect(diagonal).equalsSegment(55, 55, rac.Angle.eighth, 100);
  expect(diagonal).not.equalsSegment(7, 7, 0, 7);


  let string = diagonal.toString();
  expect(string).toMatch('Segment');
  expect(string).toMatch('55');
  expect(string).toMatch('0.125');
  expect(string).toMatch('100');
});


test('Properties', () => {
  expect(diagonal.startPoint()).equalsPoint(55, 55);
  expect(diagonal.angle()).equalsAngle(1/8);

  let side = tools.sides(100);
  expect(diagonal.endPoint()).equalsPoint(55+side, 55+side);
});


test('Transforms to Arc', () => {
  expect(diagonal.arc()).equalsArc(55, 55, 100, 1/8, 1/8, true);

  expect(diagonal.arc(rac.Angle.half))
    .equalsArc(55, 55, 100, 1/8, 1/2, true);

  expect(diagonal.arc(rac.Angle.half, false))
    .equalsArc(55, 55, 100, 1/8, 1/2, false);

  expect(diagonal.arc(null, false))
    .equalsArc(55, 55, 100, 1/8, 1/8, false);
});


test.todo('More!')

