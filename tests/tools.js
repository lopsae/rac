'use strict';


const Rac = require('ruler-and-compass');
const chalk = require('chalk');


// TODO: can this be set in a better place?
Rac.Exception.buildsErrors = true;

const rac = new Rac();
exports.rac = rac;


// Number of digits to display in test output
const digits = 3;


// Returns the hypotenuse of a triangle with catheti a,b, or a,a.
exports.hypotenuse = function(a, maybeB = null) {
  const b = maybeB === null ? a : b;
  return Math.sqrt(a*a + b*b);
};


// Returns the length of the side of a triangle of hypotenuse hyp and equal
// catheti.
exports.cathetus = function(hyp) {
  return Math.sqrt(hyp*hyp/2);
};


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


class Messenger {

  constructor(matcher, funcName, comment) {
    this.matcher = matcher;
    this.funcName = funcName;
    this.options = {
      comment: comment,
      isNot: matcher.isNot
    };
  }

  // Returns a string with red coloring, for received values
  r(received) {
    return chalk.red(received);
  }

  // Returns a string with green coloring, for expected values
  e(expected) {
    return chalk.green(expected);
  }

  done(passes, received, expected, ...lines) {
    const messageFunc = () => {
      const receivedStr = typeof received === "string"
        ? received
        : received.toString(digits);
      const expectedStr = typeof expected === "string"
        ? expected
        : expected.toString(digits);

      const hint = this.matcher.utils.matcherHint(
        this.funcName,
        receivedStr, expectedStr,
        this.options);

      if (lines.length > 0) {
        // add an empty line
        lines.unshift('');
      }
      lines.unshift(hint);
      return lines.join('\n');
    };
    return {
      message: messageFunc,
      pass: passes
    };
  }

  pass(received, expected, ...lines) {
    return this.done(true, received, expected, ...lines);
  }

  // received/expected can be a string or a drawable
  fail(received, expected, ...lines) {
    return this.done(false, received, expected, ...lines);
  }

}


expect.extend({ equalsAngle(angle, expectedAngle) {
  const messenger = new Messenger(this,
    'equalsAngle',
    'equal Angle properties');

  const expected = rac.Angle.from(expectedAngle);
  if (angle == null) {
    return messenger.fail('null', expected.toString(digits));
  }

  if (!(angle instanceof Rac.Angle)) {
    return messenger.fail(angle.toString(), expected,
      `Unexpected type: ${Rac.utils.typeName(angle)}`);
  }

  const isEqual = expected.equals(angle);
  return messenger.done(isEqual, angle, expected);
}}); // equalsAngle


expect.extend({ equalsPoint(point, x, y) {
  const msg = new Messenger(this,
    'equalsPoint',
    'equal Point properties');

  const expected = rac.Point(x, y);
  if (point == null) {
    return msg.fail('null', expected);
  }

  if (!(point instanceof Rac.Point)) {
    return msg.fail(point.toString(), expected,
      `Received type: ${msg.r(Rac.utils.typeName(point))}`,
      `Expected type: ${msg.e('Rac.Point')}`);
  }

  const isEqual = expected.equals(point);
  return msg.done(isEqual, point, expected,
    `Received: ${msg.r(point.toString(digits))}`,
    `Expected: ${msg.e(expected.toString(digits))}`);
}}); // equalsPoint


expect.extend({ equalsRay(ray, x, y, angle) {
  const messenger = new Messenger(this,
    'equalsRay',
    'equal Ray properties');

  const expected = rac.Ray(x, y, angle);
  if (ray == null) {
    return messenger.fail('null', expected);
  }

  if (!(ray instanceof Rac.Ray)) {
    return messenger.fail(ray.toString(), expected,
      `Unexpected type: ${Rac.utils.typeName(ray)}`);
  }

  const isEqual = expected.equals(ray);
  return messenger.done(isEqual, ray, expected);
}}); // equalsRay


expect.extend({ equalsSegment(segment, x, y, angle, length) {
  const msg = new Messenger(this,
    'equalsSegment',
    'equal Segment properties');

  const expected = rac.Segment(x, y, angle, length);

  if (segment == null) {
    return msg.fail('null', expected);
  }

  if (!(segment instanceof Rac.Segment)) {
    return msg.fail(segment.toString(), expected,
      `Received type: ${msg.r(Rac.utils.typeName(segment))}`,
      `Expected type: ${msg.e('Rac.Segment')}`);
  }

  const isEqual = expected.equals(segment);
  return msg.done(isEqual, segment, expected,
    `Received: ${msg.r(segment.toString(digits))}`,
    `Expected: ${msg.e(expected.toString(digits))}`);
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

  const isEqual = expected.equals(arc);
  return done(isEqual, () =>
    this.utils.matcherHint('equalsArc',
      arc.toString(), expected.toString(),
      options));
}}); // equalsArc


// Checks all text properties, except for `format`
expect.extend({ equalsText(text, x, y, string) {
  const messenger = new Messenger(this,
    'equalsText',
    'equal Text properties');

  const expected = rac.Text(x, y, string, rac.Text.Format.topLeft);
  if (text == null) {
    return messenger.fail('null', expected);
  }

  const isEqual = expected.string === text.string
    && expected.point.equals(text.point);
  return messenger.done(isEqual, text, expected)
}}); // equalsText


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




