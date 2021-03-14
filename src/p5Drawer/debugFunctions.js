'use strict';


exports.debugPoint = function(drawer, point, drawsText) {
  let rac = drawer.rac;
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
    .withLengthRatio(1/2)
    .draw();

  // Text
  if (!drawsText) { return; }

  let string = `x:${drawer.debugNumber(point.x)}\ny:${drawer.debugNumber(point.y)}`;
  let format = new rac.Text.Format(
    rac.Text.Format.horizontal.left,
    rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    rac.Angle.e,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, drawer.debugRadius/2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


exports.debugSegment = function(drawer, segment, drawsText) {
  let rac = drawer.rac;
  // Half circle start marker
  segment.start.arc(drawer.debugPointRadius).draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.start
    .arc(drawer.debugRadius, perpAngle, perpAngle.inverse())
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  arc.endSegment()
    .withLengthRatio(0.5)
    .draw();

  // Perpendicular end marker
  let endMarkerStart = segment
    .nextSegmentPerpendicular()
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw()
    .angle();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw()
    .angle();
  segment.end
    .arc(drawer.debugPointRadius, endMarkerStart, endMarkerEnd)
    .draw();

  // Text
  if (!drawsText) { return; }

  let angle = segment.angle();
  let lengthFormat;
  let angleFormat;
  if (angle.turn >= 3/4 || angle.turn <= 1/4) {
    // Normal orientation
    lengthFormat = new rac.Text.Format(
      rac.Text.Format.horizontal.left,
      rac.Text.Format.vertical.bottom,
      drawer.debugTextOptions.font,
      angle,
      drawer.debugTextOptions.size);
    angleFormat = new rac.Text.Format(
      rac.Text.Format.horizontal.left,
      rac.Text.Format.vertical.top,
      drawer.debugTextOptions.font,
      angle,
      drawer.debugTextOptions.size);
  } else {
    // Reverse orientation
    lengthFormat = new rac.Text.Format(
      rac.Text.Format.horizontal.right,
      rac.Text.Format.vertical.top,
      drawer.debugTextOptions.font,
      angle.inverse(),
      drawer.debugTextOptions.size);
    angleFormat = new rac.Text.Format(
      rac.Text.Format.horizontal.right,
      rac.Text.Format.vertical.bottom,
      drawer.debugTextOptions.font,
      angle.inverse(),
      drawer.debugTextOptions.size);
  }

  // Length
  let lengthString = `length:${drawer.debugNumber(segment.length())}`;
  segment.start
    .pointToAngle(angle.sub(1/8), drawer.debugRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${drawer.debugNumber(angle.turn)}`;
  segment.start
    .pointToAngle(angle.add(1/8), drawer.debugRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  let rac = drawer.rac;
  // Center markers
  let centerArcRadius = drawer.debugRadius * 2/3;
  if (arc.radius > drawer.debugRadius/3 && arc.radius < drawer.debugRadius) {
    centerArcRadius = arc.radius + drawer.debugRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Mini arc markers
  let totalArcsPerTurn = 18;
  let arcCount = Math.ceil(arc.angleDistance().turnOne() * totalArcsPerTurn);
  // Corrects up to the nearest odd number
  arcCount = 1 + Math.floor(arcCount/2) * 2;
  let arcs = centerArc.divideToArcs(arcCount).filter((item, index) => {
    return index % 2 == 0;
  });
  arcs.forEach(item => item.draw());

  // Center end segment
  if (!arc.isCircle()) {
    centerArc.endSegment().withLengthRatio(1/2).draw();
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
  let orientationArc = arc
    .startSegment()
    .withEndExtended(drawer.debugRadius)
    .arc(arc.clockwise)
    .withLength(drawer.debugRadius*2)
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
  let externalLength = drawer.debugRadius/2 - drawer.debugPointRadius;
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
}; // debugArc

// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape
// TODO: debug routine of Text

