'use strict';


const Rac = require('rulerandcompass');


const rac = new Rac();
exports.rac = rac;


const digits = 3;


function pass(messageFunc) {
  return {
    pass: true,
    message: messageFunc
  };
}
exports.pass = pass;


function fail(messageFunc) {
  return {
    message: messageFunc,
    pass: false
  };
}
exports.fail = fail;


function done(isPass, messageFunc) {
  return isPass
    ? pass(messageFunc)
    : fail(messageFunc);
}
exports.done = done;


expect.extend({ equalsPoint(point, x, y) {
  const options = {
    comment: 'equal Point properties',
    isNot: this.isNot
  };

  const expected = rac.Point(x, y);
  if (point == null) {
    return fail(() =>
      this.utils.matcherHint('equalsPoint',
        'null', expected.toString(),
        options));
  }

  const isEqual = rac.equals(point.x, expected.x)
    && rac.equals(point.y, expected.y);

  return done(isEqual, () =>
    this.utils.matcherHint('equalsPoint',
      point.toString(), expected.toString(),
      options));
}}); // equalsPoint


expect.extend({ equalsAngle(angle, someAngle) {
  const options = {
    comment: 'equal Point properties',
    isNot: this.isNot
  };

  let expected = rac.Angle.from(someAngle);
  if (angle == null) {
    return fail(() =>
      this.utils.matcherHint('equalsAngle',
        'null', expected.toString(digits),
        options));
  }

  // TODO: make a equals for angles specifically
  const isEqual = rac.equals(angle.turn, expected.turn);
  return done(isEqual, () =>
    this.utils.matcherHint('equalsAngle',
      angle.toString(digits), expected.toString(digits),
      options));
}}); // equalsAngle


expect.extend({ equalsSegment(segment, startX, startY, endX, endY) {
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
}}); // equalsSegment


expect.extend({ equalsArc(arc, centerX, centerY, radius, someStartAngle, someEndAngle, clockwise) {
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
}}); // equalsArc

