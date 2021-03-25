'use strict';

const Rac = require('rulerandcompass');
const rac = new Rac();


test('RAC version', () => {
  expect(Rac.version).toBeTruthy();
  expect(rac.version).toBeTruthy();
  expect(Rac.version).toBe(rac.version);
});


function pass(messageFunc) {
  return {
    pass: true,
    message: messageFunc
  };
}


function fail(messageFunc) {
  return {
    message: messageFunc,
    pass: false
  };
}


function done(isPass, messageFunc) {
  return isPass
    ? pass(messageFunc)
    : fail(messageFunc);
}


expect.extend({
  equalsPoint(point, x, y) {
    const options = {
      comment: 'equal Point properties',
      isNot: this.isNot
    };
    const expected = rac.Point(x, y);
    if (point == null) {
      return fail(() =>
        this.utils.matcherHint('equalsPoint', 'null', expected.describe(), options));
    }

    const isEqual = rac.equals(point.x, expected.x) && rac.equals(point.y, expected.y);

    return done(isEqual, () =>
        this.utils.matcherHint('equalsPoint', point.describe(), expected.describe(), options));
  },
  equalsAngle(angle, someAngle) {
    let other = Rac.Angle.from(someAngle);
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
  },
  equalsSegment(segment, startX, startY, endX, endY) {
    const pass =
      rac.equals(segment.start.x, startX)
      && rac.equals(segment.start.y, startY)
      && rac.equals(segment.end.x, endX)
      && rac.equals(segment.end.y, endY);
    if (pass) {
      return {
        message: () =>
          `expected segment ((${segment.start.x},${segment.start.y}),(${segment.end.x},${segment.end.y})) not to equal to ((${startX},${startY})(${endX},${endY}))`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected segment ((${segment.start.x},${segment.start.y}),(${segment.end.x},${segment.end.y})) to equal to ((${startX},${startY})(${endX},${endY}))`,
        pass: false,
      };
    }
  },
  equalsArc(arc, centerX, centerY, radius, someStartAngle, someEndAngle, clockwise) {
    let startAngle = Rac.Angle.from(someStartAngle);
    let endAngle = Rac.Angle.from(someEndAngle);
    const pass =
      rac.equals(arc.center.x, centerX)
      && rac.equals(arc.center.y, centerY)
      && rac.equals(arc.radius, radius)
      && rac.equals(arc.start.turn, startAngle.turn)
      && rac.equals(arc.end.turn, endAngle.turn)
      && clockwise === clockwise;
    if (pass) {
      return {
        message: () =>
          `expected arc ((${arc.center.x},${arc.center.x}) r:${arc.radius} s:${arc.start.turn} e:${arc.end.turn} c:${arc.clockwise}) not to equal to ((${centerX},${centerY}) r:${radius} s:${startAngle.turn} e:${endAngle.turn} c:${clockwise})`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected arc ((${arc.center.x},${arc.center.x}) r:${arc.radius} s:${arc.start.turn} e:${arc.end.turn} c:${arc.clockwise}) to equal to ((${centerX},${centerY}) r:${radius} s:${startAngle.turn} e:${endAngle.turn} c:${clockwise})`,
        pass: false,
      };
    }
  }
});


describe('Point', () => {
  let point = rac.Point(100, 100);
  let fifty = rac.Point(55, 55);

  test('identity', () => {
    expect(null).not.equalsPoint(100, 100);

    expect(point).equalsPoint(100, 100);
    expect(fifty).not.equalsPoint(100, 100);
    expect(rac.Point.zero).equalsPoint(0, 0);
    expect(rac.Point.origin).equalsPoint(0, 0);
  });

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

    expect(Rac.Angle.zero.turn).toBe(0);

    expect(point.pointToAngle(Rac.Angle.zero, 100))
      .equalsPoint(200, 100);
    expect(point.pointToAngle(Rac.Angle.half, 100))
      .equalsPoint(0, 100);


    expect(point).equalsPoint(100, 100);
  });

  test.skip('misc', () => {
    expect(point.angleToPoint(fifty)).equalsAngle(Rac.Angle.nw);

    expect(point.distanceToPoint(rac.Point(100, 200)))
      .toBe(100);
    expect(point.distanceToPoint(rac.Point(200, 100)))
      .toBe(100);

    expect(point.segmentToPoint(fifty))
      .equalsSegment(100, 100, 55, 55);

    expect(point.segmentToAngle(Rac.Angle.s, 55))
      .equalsSegment(100, 100, 100, 155);

    let intersector = point
      .addX(200) // x is 300
      .segmentToAngle(Rac.Angle.s, 100);

    expect(point.segmentToAngleToIntersectionWithSegment(Rac.Angle.zero, intersector))
      .equalsSegment(100, 100, 300, 100);

    expect(point.segmentPerpendicularToSegment(intersector))
      .equalsSegment(100, 100, 300, 100);

    expect(point.arc(155, Rac.Angle.e, Rac.Angle.n, false))
      .equalsArc(100, 100, 155, 0, 3/4, false);
  });

}); // describe Point


