'use strict';


const Rac = require('../Rac');


function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
}


exports.debugAngle = function(drawer, angle, point, drawsText) {
  let rac = drawer.rac;

  // Zero segment
  point
    .segmentToAngle(rac.Angle.zero, drawer.debugRadius)
    .draw();

  // Angle segment
  let angleSegment = point
    .segmentToAngle(angle, drawer.debugRadius * 1.5);
  angleSegment.endPoint()
    .arc(drawer.debugPointRadius, angle, angle.inverse(), false)
    .draw();
  angleSegment
    .withLengthAdd(drawer.debugPointRadius)
    .draw();

  // Mini arc markers
  let angleArc = point.arc(drawer.debugRadius, rac.Angle.zero, angle);
  let context = drawer.p5.drawingContext;
  let strokeWeight = context.lineWidth;
  context.save(); {
    context.lineCap = 'butt';
    context.setLineDash([6, 4]);
    // Angle arc
    angleArc.draw();

    if (!angleArc.isCircle()) {
      // Outside angle arc
      context.setLineDash([2, 4]);
      angleArc
        .withRadius(drawer.debugRadius*3/4)
        .withClockwise(false)
        .draw();
    }
  };
  context.restore();

  // Text
  if (drawsText !== true) { return; }

  // Normal orientation
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.center,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    format = format.inverse();
  }

  // Turn text
  let turnString = `turn:${drawer.debugNumber(angle.turn)}`;
  point
    .pointToAngle(angle, drawer.debugRadius*2)
    .text(turnString, format)
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  let rac = drawer.rac;

  point.draw();

  // Point marker
  point.arc(drawer.debugPointRadius).draw();

  // Point reticule marker
  let arc = point
    .arc(drawer.debugRadius, rac.Angle.s, rac.Angle.e)
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(1/2)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(1/2)
    .draw();

  // Text
  if (drawsText !== true) { return; }

  let string = `x:${drawer.debugNumber(point.x)}\ny:${drawer.debugNumber(point.y)}`;
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    rac.Angle.e,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, drawer.debugPointRadius*2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


exports.debugRay = function(drawer, ray, drawsText) {
  let rac = drawer.rac;

  ray.draw();

  // Little circle at start marker
  ray.start.arc(drawer.debugPointRadius).draw();

  // Half circle at start
  let perpAngle = ray.angle.perpendicular();
  let arc = ray.start
    .arc(drawer.debugRadius, perpAngle, perpAngle.inverse())
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  arc.endSegment().reverse()
    .withLengthRatio(0.5)
    .draw();

  // Perpendicular end marker
  // let endMarkerStart = segment
  //   .nextSegmentPerpendicular()
  //   .withLength(drawer.debugRadius/2)
  //   .withStartExtended(-drawer.debugPointRadius)
  //   .draw();
  // let endMarkerEnd = segment
  //   .nextSegmentPerpendicular(false)
  //   .withLength(drawer.debugRadius/2)
  //   .withStartExtended(-drawer.debugPointRadius)
  //   .draw();
  // // Little end half circle
  // segment.endPoint()
  //   .arc(drawer.debugPointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
  //   .draw();

  // Forming end arrow
  // let arrowAngleShift = rac.Angle.from(1/7);
  // let endArrowStart = endMarkerStart
  //   .reverse()
  //   .ray.withAngleShift(arrowAngleShift, false);
  // let endArrowEnd = endMarkerEnd
  //   .reverse()
  //   .ray.withAngleShift(arrowAngleShift, true);
  // let endArrowPoint = endArrowStart
  //   .pointAtIntersection(endArrowEnd);
  // // End arrow
  // endMarkerStart
  //   .nextSegmentToPoint(endArrowPoint)
  //   .draw()
  //   .nextSegmentToPoint(endMarkerEnd.endPoint())
  //   .draw();


  // Text
  // if (drawsText !== true) { return; }

  // let angle = segment.angle();
  // // Normal orientation
  // let lengthFormat = new Rac.Text.Format(
  //   rac,
  //   Rac.Text.Format.horizontal.left,
  //   Rac.Text.Format.vertical.bottom,
  //   drawer.debugTextOptions.font,
  //   angle,
  //   drawer.debugTextOptions.size);
  // let angleFormat = new Rac.Text.Format(
  //   rac,
  //   Rac.Text.Format.horizontal.left,
  //   Rac.Text.Format.vertical.top,
  //   drawer.debugTextOptions.font,
  //   angle,
  //   drawer.debugTextOptions.size);
  // if (reversesText(angle)) {
  //   // Reverse orientation
  //   lengthFormat = lengthFormat.inverse();
  //   angleFormat = angleFormat.inverse();
  // }

  // Length
  // let lengthString = `length:${drawer.debugNumber(segment.length)}`;
  // segment.startPoint()
  //   .pointToAngle(angle, drawer.debugPointRadius)
  //   .pointToAngle(angle.subtract(1/4), drawer.debugRadius/2)
  //   .text(lengthString, lengthFormat)
  //   .draw(drawer.debugTextStyle);

    // Angle
  // let angleString = `angle:${drawer.debugNumber(angle.turn)}`;
  // segment.startPoint()
  //   .pointToAngle(angle, drawer.debugPointRadius)
  //   .pointToAngle(angle.add(1/4), drawer.debugRadius/2)
  //   .text(angleString, angleFormat)
  //   .draw(drawer.debugTextStyle);
}; // debugRay


exports.debugSegment = function(drawer, segment, drawsText) {
  let rac = drawer.rac;

  segment.draw();

  // Little circle at start marker
  segment.withLength(drawer.debugPointRadius)
    .arc()
    .draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.startPoint()
    .arc(drawer.debugRadius, perpAngle, perpAngle.inverse())
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(0.5)
    .draw();

  // Perpendicular end marker
  let endMarkerStart = segment
    .nextSegmentPerpendicular()
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw();
  // Little end half circle
  segment.endPoint()
    .arc(drawer.debugPointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
    .draw();

  // Forming end arrow
  let arrowAngleShift = rac.Angle.from(1/7);
  let endArrowStart = endMarkerStart
    .reverse()
    .ray.withAngleShift(arrowAngleShift, false);
  let endArrowEnd = endMarkerEnd
    .reverse()
    .ray.withAngleShift(arrowAngleShift, true);
  let endArrowPoint = endArrowStart
    .pointAtIntersection(endArrowEnd);
  // End arrow
  endMarkerStart
    .nextSegmentToPoint(endArrowPoint)
    .draw()
    .nextSegmentToPoint(endMarkerEnd.endPoint())
    .draw();


  // Text
  if (drawsText !== true) { return; }

  let angle = segment.angle();
  // Normal orientation
  let lengthFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.bottom,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  let angleFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontal.left,
    Rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    lengthFormat = lengthFormat.inverse();
    angleFormat = angleFormat.inverse();
  }

  // Length
  let lengthString = `length:${drawer.debugNumber(segment.length)}`;
  segment.startPoint()
    .pointToAngle(angle, drawer.debugPointRadius)
    .pointToAngle(angle.subtract(1/4), drawer.debugRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${drawer.debugNumber(angle.turn)}`;
  segment.startPoint()
    .pointToAngle(angle, drawer.debugPointRadius)
    .pointToAngle(angle.add(1/4), drawer.debugRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  let rac = drawer.rac;

  arc.draw();

  // Center markers
  let centerArcRadius = drawer.debugRadius * 2/3;
  if (arc.radius > drawer.debugRadius/3 && arc.radius < drawer.debugRadius) {
    // If radius is to close to the center-arc markers
    // Make the center-arc be outside of the arc
    centerArcRadius = arc.radius + drawer.debugRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Radius
  let radiusMarkerLength = arc.radius
    - centerArcRadius
    - drawer.debugRadius/2
    - drawer.debugPointRadius*2;
  if (radiusMarkerLength > 0) {
    arc.startSegment()
      .withLength(radiusMarkerLength)
      .translateToLength(centerArcRadius + drawer.debugPointRadius*2)
      .draw();
  }

  // Mini arc markers
  let context = drawer.p5.drawingContext;
  let strokeWeight = context.lineWidth;
  context.save(); {
    context.lineCap = 'butt';
    context.setLineDash([6, 4]);
    centerArc.draw();

    if (!centerArc.isCircle()) {
      // Outside angle arc
      context.setLineDash([2, 4]);
      centerArc
        .withClockwise(!centerArc.clockwise)
        .draw();
    }
  };
  context.restore();

  // Center end segment
  if (!arc.isCircle()) {
    centerArc.endSegment().reverse().withLengthRatio(1/2).draw();
  }

  // Start point marker
  let startPoint = arc.startPoint();
  startPoint
    .arc(drawer.debugPointRadius).draw();
  startPoint
    .segmentToAngle(arc.start, drawer.debugRadius)
    .withStartExtended(-drawer.debugRadius/2)
    .draw();

  // Orientation marker
  let orientationLength = drawer.debugRadius*2;
  let orientationArc = arc
    .startSegment()
    .withLengthAdd(drawer.debugRadius)
    .arc(null, arc.clockwise)
    .withLength(orientationLength)
    .draw();
  let arrowCenter = orientationArc
    .reverse()
    .withLength(drawer.debugRadius/2)
    .chordSegment();
  let arrowAngle = 3/32;
  arrowCenter.withAngleShift(-arrowAngle).draw();
  arrowCenter.withAngleShift(arrowAngle).draw();

  // Internal end point marker
  let endPoint = arc.endPoint();
  let internalLength = Math.min(drawer.debugRadius/2, arc.radius);
  internalLength -= drawer.debugPointRadius;
  if (internalLength > rac.equalityThreshold) {
    endPoint
      .segmentToAngle(arc.end.inverse(), internalLength)
      .translateToLength(drawer.debugPointRadius)
      .draw();
  }

  // External end point marker
  let textJoinThreshold = drawer.debugRadius*3;
  let lengthAtOrientationArc = orientationArc
    .withEnd(arc.end)
    .length();
  let externalLength = lengthAtOrientationArc > textJoinThreshold && drawsText === true
    ? drawer.debugRadius - drawer.debugPointRadius
    : drawer.debugRadius/2 - drawer.debugPointRadius;

  endPoint
    .segmentToAngle(arc.end, externalLength)
    .translateToLength(drawer.debugPointRadius)
    .draw();

  // End point little arc
  if (!arc.isCircle()) {
    endPoint
      .arc(drawer.debugPointRadius, arc.end, arc.end.inverse(), arc.clockwise)
      .draw();
  }

  // Text
  if (drawsText !== true) { return; }

  let hFormat = Rac.Text.Format.horizontal;
  let vFormat = Rac.Text.Format.vertical;

  let headVertical = arc.clockwise
    ? vFormat.top
    : vFormat.bottom;
  let tailVertical = arc.clockwise
    ? vFormat.bottom
    : vFormat.top;
  let radiusVertical = arc.clockwise
    ? vFormat.bottom
    : vFormat.top;

  // Normal orientation
  let headFormat = new Rac.Text.Format(
    rac,
    hFormat.left,
    headVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);
  let tailFormat = new Rac.Text.Format(
    rac,
    hFormat.left,
    tailVertical,
    drawer.debugTextOptions.font,
    arc.end,
    drawer.debugTextOptions.size);
  let radiusFormat = new Rac.Text.Format(
    rac,
    hFormat.left,
    radiusVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);

  // Reverse orientation
  if (reversesText(arc.start)) {
    headFormat = headFormat.inverse();
    radiusFormat = radiusFormat.inverse();
  }
  if (reversesText(arc.end)) {
    tailFormat = tailFormat.inverse();
  }

  let startString = `start:${drawer.debugNumber(arc.start.turn)}`;
  let radiusString = `radius:${drawer.debugNumber(arc.radius)}`;
  let endString = `end:${drawer.debugNumber(arc.end.turn)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${drawer.debugNumber(angleDistance.turn)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  if (angleDistance.turn <= 3/4 && !arc.isCircle()) {
    // Radius drawn separately
    let perpAngle = arc.start.perpendicular(!arc.clockwise);
    arc.center
      .pointToAngle(arc.start, drawer.debugRadius)
      .pointToAngle(perpAngle, drawer.debugPointRadius*2)
      .text(radiusString, radiusFormat)
      .draw(drawer.debugTextStyle);
    headString = startString;
  } else {
    // Radius joined to head
    headString = `${startString}\n${radiusString}`;
  }

  if (lengthAtOrientationArc > textJoinThreshold) {
    // Draw strings separately
    orientationArc.startPoint()
      .pointToAngle(arc.start, drawer.debugRadius/2)
      .text(headString, headFormat)
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .pointToAngle(arc.end, drawer.debugRadius/2)
      .text(tailString, tailFormat)
      .draw(drawer.debugTextStyle);
  } else {
    // Draw strings together
    let allStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .pointToAngle(arc.start, drawer.debugRadius/2)
      .text(allStrings, headFormat)
      .draw(drawer.debugTextStyle);
  }
}; // debugArc


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape
// TODO: debug routine of Text

