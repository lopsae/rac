'use strict';


const Rac = require('rulerandcompass');
// TODO: can this be set in a better place?
Rac.Exception.buildsErrors = true;

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


expect.extend({ equalsAngle(angle, someAngle) {
  const options = {
    comment: 'equal Angle properties',
    isNot: this.isNot
  };

  let expected = rac.Angle.from(someAngle);
  if (angle == null) {
    return fail(() =>
      this.utils.matcherHint('equalsAngle',
        'null', expected.toString(digits),
        options));
  }

  const isEqual = expected.equals(angle);
  return done(isEqual, () =>
    this.utils.matcherHint('equalsAngle',
      angle.toString(digits), expected.toString(digits),
      options));
}}); // equalsAngle


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

  const isEqual = expected.equals(point);

  return done(isEqual, () =>
    this.utils.matcherHint('equalsPoint',
      point.toString(), expected.toString(),
      options));
}}); // equalsPoint


expect.extend({ equalsRay(ray, x, y, someAngle) {
  const options = {
    comment: 'equal Ray properties',
    isNot: this.isNot
  };

  const expected = rac.Ray(x, y, someAngle);
  if (ray == null) {
    return fail(() =>
      this.utils.matcherHint('equalsRay',
        'null', expected.toString(),
        options));
  }

  const isEqual = expected.start.equals(ray.start)
    && expected.angle.equals(ray.angle);

  return done(isEqual, () =>
    this.utils.matcherHint('equalsRay',
      ray.toString(), expected.toString(),
      options));
}}); // equalsRay


expect.extend({ equalsSegment(segment, x, y, someAngle, length) {
  const options = {
    comment: 'equal Segment properties',
    isNot: this.isNot
  };

  const angle = rac.Angle.from(someAngle);
  const expected = rac.Segment(x, y, angle, length);

  if (segment == null) {
    return fail(() =>
      this.utils.matcherHint('equalsSegment',
        'null', expected.toString(),
        options));
  }

  const isEqual = rac.equals(segment.ray.start.x, x)
    && rac.equals(segment.ray.start.y, y)
    && rac.equals(segment.length, length)
    && rac.unitaryEquals(segment.ray.angle.turn, angle.turn);
  return done(isEqual, () =>
    this.utils.matcherHint('equalsSegment',
      segment.toString(), expected.toString(),
      options));
}}); // equalsSegment


expect.extend({ equalsArc(arc, x, y, radius, someStartAngle, someEndAngle, clockwise) {
  const options = {
    comment: 'equal Arc properties',
    isNot: this.isNot
  };

  let expected = rac.Arc(x, y, radius, someStartAngle, someEndAngle, clockwise);
  if (arc == null) {
    return fail(() =>
      this.utils.matcherHint('equalsArc',
        'null', expected.toString(),
        options));
  }

  // TODO: implement and use arc.equals
  const isEqual = expected.center.equals(arc.center)
    && rac.equals(expected.radius, arc.radius)
    && expected.start.equals(arc.start)
    && expected.end.equals(arc.end)
    && expected.clockwise === arc.clockwise;
  return done(isEqual, () =>
    this.utils.matcherHint('equalsArc',
      arc.toString(), expected.toString(),
      options));
}}); // equalsArc


expect.extend({ toThrowNamed(closure, name, expectsError = true) {
  const options = {
    comment: 'throws named Exception or Error',
    isNot: this.isNot
  };

  const nameToPrint = expectsError
    ? `Error:${name}`
    : `Exception:${name}`;

  let catchedObj = null;
  try {
    closure();
  } catch (obj) {
    catchedObj = obj;
  }

  if (catchedObj == null) {
    return fail(() =>
      this.utils.matcherHint('toThrowNamed',
        'no-catch', nameToPrint,
        options));
  }

  let isCorrectThrow = false;
  if (expectsError) {
    isCorrectThrow = catchedObj instanceof Error
      && catchedObj.name == name;

  } else {
    // Expects Exception
    isCorrectThrow = catchedObj instanceof Rac.Exception
      && catchedObj.name == name;
  }

  let catchedName = null;
  if (catchedObj instanceof Error){
    catchedName = `Error:${catchedObj.name}`;
  } else if (catchedObj instanceof Rac.Exception) {
    catchedName = `Exception:${catchedObj.name}`;
  } else {
    catchedName = catchedObj.toString();
  }

  return done(isCorrectThrow, () =>
    this.utils.matcherHint('toThrowNamed',
      catchedName, nameToPrint,
      options));
}}); // toThrowNamed


expect.extend({ thresEquals(value, expected) {
  const options = {
    comment: 'equal values with rac.equals',
    isNot: this.isNot
  };

  const isEqual = rac.equals(value, expected);
  return done(isEqual, () =>
    this.utils.matcherHint('thresEquals',
      value, expected,
      options)
    + '\n\n'
    + `distance: ${Math.abs(value-expected)}\n`
    + `threshold: ${rac.equalityThreshold}`
    );
}}); // thresEquals


expect.extend({ uniThresEquals(value, expected) {
  const options = {
    comment: 'equal values with rac.unitaryEquals',
    isNot: this.isNot
  };

  const isEqual = rac.unitaryEquals(value, expected);
  return done(isEqual, () =>
    this.utils.matcherHint('uniThresEquals',
      value, expected,
      options)
    + '\n\n'
    + `distance: ${Math.abs(value-expected)}\n`
    + `threshold: ${rac.unitaryEqualityThreshold}`
    );
}}); // uniThresEquals


// Returns the hypotenuse of a triangle with sides a,b, or a,a.
exports.hypotenuse = function(a, maybeB = null) {
  const b = maybeB === null ? a : b;
  return Math.sqrt(a*a + b*b);
};


// Returns the side of a triangle of hypotenuse hyp and equal sides.
exports.sides = function(hyp) {
  return Math.sqrt(hyp*hyp/2);
};

