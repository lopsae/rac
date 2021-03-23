

const makeRac = require('rulerandcompass');
const rac = makeRac();


test('RAC version', () => {
  expect(makeRac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(makeRac.version).toBe(rac.version);
});



expect.extend({
  equalsPoint(point, x, y) {
    const pass = rac.equals(point.x, x) && rac.equals(point.y, y);
    if (pass) {
      return {
        message: () =>
          `expected point at (${point.x},${point.y}) not to equal (${x},${y})`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected point at (${point.x},${point.y}) to equal (${x},${y})`,
        pass: false,
      };
    }
  },
  equalsAngle(angle, someAngle) {
    let other = rac.Angle.from(someAngle);
    const pass = rac.equals(angle.turn, other.turn);
    if (pass) {
      return {
        message: () =>
          `expected angle (turn:${angle.turn}) not to equal to (turn:${other.turn})`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected angle (turn:${angle.turn}) to equal to (turn:${other.turn})`,
        pass: false,
      };
    }
  }
});


describe('Point', () => {
  let point = new rac.Point(100, 100);
  let fifty = new rac.Point(55, 55);

  test('withX functions', () => {
    expect(point.withX(77))
      .equalsPoint(77, 100);
    expect(point.withY(77))
      .equalsPoint(100, 77);

    expect(point).equalsPoint(100, 100);
  });


  test('add/sub', () => {
    expect(point.add(fifty))
      .equalsPoint(155, 155);
    expect(point.add(55, 55))
      .equalsPoint(155, 155);

    expect(point.sub(fifty))
      .equalsPoint(45, 45);
    expect(point.sub(55, 55))
      .equalsPoint(45, 45);

    expect(point).equalsPoint(100, 100);
  });


  test('addX/Y', () => {
    expect(point.addX(55)).equalsPoint(155, 100);
    expect(point.addY(55)).equalsPoint(100, 155);
    expect(point).equalsPoint(100, 100);
  });


  test('transforms', () => {
    expect(point.negative()).equalsPoint(-100, -100);

    expect(point.perpendicular(true)).equalsPoint(-100, 100);
    expect(point.perpendicular(false)).equalsPoint(100, -100);

    expect(point.pointToAngle(rac.Angle.zero, 100))
      .equalsPoint(200, 100);
    expect(point.pointToAngle(rac.Angle.half, 100))
      .equalsPoint(0, 100);


    expect(point).equalsPoint(100, 100);
  });

  test('misc', () => {
    expect(point.angleToPoint(fifty)).equalsAngle(rac.Angle.nw);

    expect(point.distanceToPoint(new rac.Point(100, 200)))
      .toBe(100);
    expect(point.distanceToPoint(new rac.Point(200, 100)))
      .toBe(100);



    expect(point).equalsPoint(100, 100);
  });


  test.todo('segmentToPoint');
  test.todo('segmentToAngle');
  test.todo('segmentToAngleToIntersectionWithSegment');
  test.todo('segmentPerpendicularToSegment');
  test.todo('arc');

});


