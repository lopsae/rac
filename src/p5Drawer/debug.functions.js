'use strict';


const Rac = require('../Rac');


// Creates and restores the drawing context for a dashed stroke while
// `closure` is called.
function dashedDraw(drawer, segment, closure) {
  const context = drawer.p5.drawingContext;
  context.save();
  context.lineCap = 'butt';
  context.setLineDash(segment);
  closure();
  context.restore();
}


exports.debugAngle = function(drawer, angle, point, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  // Zero segment
  point
    .segmentToAngle(rac.Angle.zero, markerRadius)
    .draw();

  // Angle segment
  let angleSegment = point
    .segmentToAngle(angle, markerRadius * 1.5);
  angleSegment.endPoint()
    .arc(pointRadius, angle, angle.inverse(), false)
    .draw();
  angleSegment
    .withLengthAdd(pointRadius)
    .draw();

  // Mini angle arc markers
  let angleArc = point.arc(markerRadius, rac.Angle.zero, angle);
  dashedDraw(drawer, [6, 4], ()=>{ angleArc.draw(); });

  // Outside angle arc
  if (!angleArc.isCircle()) {
    let outsideAngleArc = angleArc
      .withRadius(markerRadius*3/4)
      .withClockwise(false);
    dashedDraw(drawer, [2, 4], ()=>{ outsideAngleArc.draw(); });
  }

  // Debug Text
  if (drawsText !== true) return;

  let format = new Rac.Text.Format(rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size,
    markerRadius*2, 0);

  // Turn text
  let turnString = `turn:${angle.turn.toFixed(digits)}`;
  point.text(turnString, format)
    .upright()
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  point.draw();

  // Point marker
  point.arc(pointRadius).draw();

  // Point reticule marker
  let arc = point
    .arc(markerRadius, rac.Angle.s, rac.Angle.e)
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(1/2)
    .draw();
  arc.endSegment()
    .reverse()
    .withLengthRatio(1/2)
    .draw();

  // Debug Text
  if (drawsText !== true) return;

  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top,
    rac.Angle.e,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size,
    pointRadius, pointRadius);

  let string = `x:${point.x.toFixed(digits)}\ny:${point.y.toFixed(digits)}`;
  point.text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


// Shared text drawing for ray and segment
function drawRayTexts(drawer, ray, topString, bottomString) {
  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;
  const font        = drawer.debugTextOptions.font;
  const size        = drawer.debugTextOptions.size;
  const pointRadius = drawer.debugPointRadius;

  let topFormat = new Rac.Text.Format(
    drawer.rac,
    hEnum.left, vEnum.bottom,
    ray.angle, font, size,
    pointRadius, pointRadius);
  let bottomFormat = new Rac.Text.Format(
    drawer.rac,
    hEnum.left, vEnum.top,
    ray.angle, font, size,
    pointRadius, pointRadius);

  // Texts
  ray.text(topString, topFormat)
    .upright()
    .draw(drawer.debugTextStyle);
  ray.text(bottomString, bottomFormat)
    .upright()
    .draw(drawer.debugTextStyle);
};


exports.debugRay = function(drawer, ray, drawsText) {
  const rac = drawer.rac;
  const pointRadius = drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  ray.draw();

  // Little circle at start marker
  ray.start.arc(pointRadius).draw();

  // Half circle at start
  const perpAngle = ray.angle.perpendicular();
  const startArc = ray.start
    .arc(markerRadius, perpAngle, perpAngle.inverse())
    .draw();
  startArc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  startArc.endSegment().reverse()
    .withLengthRatio(0.5)
    .draw();

  // Edge end half circle
  const edgeRay = ray.rayAtCanvasEdge();
  if (edgeRay != null) {
    const edgeArc = edgeRay
      .translateToDistance(pointRadius)
      .perpendicular(false)
      .arcToAngleDistance(markerRadius/2, 0.5)
      .draw();
    edgeArc.startSegment()
      .reverse()
      .withLength(pointRadius)
      .draw();
    edgeArc.endSegment()
      .reverse()
      .withLength(pointRadius)
      .draw();
    edgeArc.radiusSegmentAtAngle(edgeRay.angle)
      .reverse()
      .withLength(pointRadius)
      .draw();
  }

  // Debug Text
  if (drawsText !== true) return;

  const digits = drawer.debugTextOptions.fixedDigits;
  const startString = `start:(${ray.start.x.toFixed(digits)},${ray.start.y.toFixed(digits)})`;
  const angleString = `angle:${ray.angle.turn.toFixed(digits)}`;
  drawRayTexts(drawer, ray, startString, angleString);
}; // debugRay


exports.debugSegment = function(drawer, segment, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  segment.draw();

  // Little circle at start marker
  segment.withLength(pointRadius)
    .arc()
    .draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.startPoint()
    .arc(markerRadius, perpAngle, perpAngle.inverse())
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
    .withLength(markerRadius/2)
    .withStartExtension(-pointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(markerRadius/2)
    .withStartExtension(-pointRadius)
    .draw();
  // Little end half circle
  segment.endPoint()
    .arc(pointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
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

  // Debug Text
  if (drawsText !== true) return;

  const digits = drawer.debugTextOptions.fixedDigits;
  let lengthString = `length:${segment.length.toFixed(digits)}`;
  let angleString  = `angle:${segment.ray.angle.turn.toFixed(digits)}`;
  drawRayTexts(drawer, segment.ray, lengthString, angleString);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;

  arc.draw();

  // Center markers
  let centerArcRadius = markerRadius * 2/3;
  if (arc.radius > markerRadius/3 && arc.radius < markerRadius) {
    // If radius is too close to the center-arc markers
    // Make the center-arc be outside of the arc
    centerArcRadius = arc.radius + markerRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Radius
  let radiusMarkerLength = arc.radius
    - centerArcRadius
    - markerRadius/2
    - pointRadius*2;
  if (radiusMarkerLength > 0) {
    arc.startSegment()
      .withLength(radiusMarkerLength)
      .translateToLength(centerArcRadius + pointRadius*2)
      .draw();
  }

  // Inside angle arc - big dashes
  dashedDraw(drawer, [6, 4], ()=>{ centerArc.draw(); });

  // Outside angle arc - small dashes
  if (!centerArc.isCircle()) {
    let outsideAngleArc = centerArc
      .withClockwise(!centerArc.clockwise);
    dashedDraw(drawer, [2, 4], ()=>{ outsideAngleArc.draw(); });
  }

  // Center end segment
  if (!arc.isCircle()) {
    centerArc.endSegment().reverse().withLengthRatio(1/2).draw();
  }

  // Start point marker
  let startPoint = arc.startPoint();
  startPoint
    .arc(pointRadius).draw();
  startPoint
    .segmentToAngle(arc.start, markerRadius)
    .withStartExtension(-markerRadius/2)
    .draw();

  // Orientation marker
  let orientationLength = markerRadius*2;
  let orientationArc = arc
    .startSegment()
    .withLengthAdd(markerRadius)
    .arc(null, arc.clockwise)
    .withLength(orientationLength)
    .draw();
  let arrowCenter = orientationArc
    .reverse()
    .withLength(markerRadius/2)
    .chordSegment();
  let arrowAngle = 3/32;
  arrowCenter.withAngleShift(-arrowAngle).draw();
  arrowCenter.withAngleShift(arrowAngle).draw();

  // Internal end point marker
  let endPoint = arc.endPoint();
  let internalLength = Math.min(markerRadius/2, arc.radius);
  internalLength -= pointRadius;
  if (internalLength > rac.equalityThreshold) {
    endPoint
      .segmentToAngle(arc.end.inverse(), internalLength)
      .translateToLength(pointRadius)
      .draw();
  }

  // External end point marker
  let textJoinThreshold = markerRadius*3;
  let lengthAtOrientationArc = orientationArc
    .withEnd(arc.end)
    .length();
  let externalLength = lengthAtOrientationArc > textJoinThreshold && drawsText === true
    ? markerRadius - pointRadius
    : markerRadius/2 - pointRadius;

  endPoint
    .segmentToAngle(arc.end, externalLength)
    .translateToLength(pointRadius)
    .draw();

  // End point little arc
  if (!arc.isCircle()) {
    endPoint
      .arc(pointRadius, arc.end, arc.end.inverse(), arc.clockwise)
      .draw();
  }

  // Debug Text
  if (drawsText !== true) return;

  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;
  const font   = drawer.debugTextOptions.font;
  const size   = drawer.debugTextOptions.size;
  const digits = drawer.debugTextOptions.fixedDigits;

  let headVertical = arc.clockwise
    ? vEnum.top
    : vEnum.bottom;
  let tailVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;
  let radiusVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;

  let headFormat = new Rac.Text.Format(rac,
    hEnum.left, headVertical,
    arc.start,
    font, size,
    pointRadius, 0);
  let tailFormat = new Rac.Text.Format(rac,
    hEnum.left, tailVertical,
    arc.end,
    font, size,
    pointRadius, 0);
  let radiusFormat = new Rac.Text.Format(rac,
    hEnum.left, radiusVertical,
    arc.start,
    font, size,
    markerRadius, pointRadius);

  let startString  = `start:${arc.start.turn.toFixed(digits)}`;
  let radiusString = `radius:${arc.radius.toFixed(digits)}`;
  let endString    = `end:${arc.end.turn.toFixed(digits)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${angleDistance.turn.toFixed(digits)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  const endIsAway = angleDistance.turn <= 3/4 || angleDistance.equals(3/4);
  if (endIsAway && !arc.isCircle()) {
    // Radius drawn separately
    headString = startString;
    arc.center
      .text(radiusString, radiusFormat)
      .upright()
      .draw(drawer.debugTextStyle);

  } else {
    // Radius joined to head
    headString = `${startString}\n${radiusString}`;
  }

  if (lengthAtOrientationArc > textJoinThreshold) {
    // Draw head and tail separately
    orientationArc.startPoint()
      .text(headString, headFormat)
      .upright()
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .text(tailString, tailFormat)
      .upright()
      .draw(drawer.debugTextStyle);
  } else {
    // Draw head and tail together
    let bothStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .text(bothStrings, headFormat)
      .upright()
      .draw(drawer.debugTextStyle);
  }
}; // debugArc


exports.debugText = function(drawer, text, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;

  const format = text.format;

  // Point marker
  text.point.arc(pointRadius).draw();

  const cornerReticule = function(angle, padding, perpPadding, rotation) {
    rac.Point.zero
      .segmentToAngle(angle, markerRadius)
      .reverse().withLength(markerRadius-pointRadius*2).draw() // line at text edge
      .nextSegmentPerpendicular(rotation, padding).push() // elbow turn
      .nextSegmentPerpendicular(!rotation, perpPadding).draw() // line at origin
      .nextSegmentWithLength(pointRadius*4)
      .nextSegmentWithLength(markerRadius-pointRadius*2).draw(); // opposite side line
      // Dashed elbow turn
      dashedDraw(drawer, [5, 2], ()=>{ rac.popStack().draw(); });
  };

  const centerReticule = function(angle, padding, perpPadding, rotation) {
    angle = rac.Angle.from(angle);
    // lines at edge of text
    rac.Point.zero
      .ray(angle.perpendicular(rotation))
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();
    let reticuleCenter = rac.Point.zero
      .segmentToAngle(angle.inverse(), padding)
      .push() // dashed line to elbow
      .nextSegmentPerpendicular(rotation, pointRadius)
      .reverse().draw() // elbow mark
      .nextSegmentPerpendicular(rotation, pointRadius)
      .reverse().draw() // elbow mark
      .nextSegmentPerpendicular(rotation, perpPadding)
      .push() // dashed line to center
      .endPoint();
    dashedDraw(drawer, [5, 2], ()=>{
      rac.popStack().draw();
      rac.popStack().draw();
    });

    // lines around reticule center
    reticuleCenter.ray(angle.inverse())
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();
    reticuleCenter.ray(angle.perpendicular(!rotation))
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();
    let lastCenterLine =
      reticuleCenter.ray(angle)
      .translateToDistance(pointRadius*2)
      .segment(markerRadius - pointRadius*2).draw();

    if (Math.abs(perpPadding) <= 2) return;

    // short dashed lines back to text edge
    lastCenterLine
      .nextSegmentWithLength(padding - markerRadius)
      .push()
      .nextSegmentPerpendicular(!rotation, format.hPadding)
      .push();
    dashedDraw(drawer, [2, 3], ()=>{
      rac.popStack().draw();
      rac.popStack().draw();
    });
  };

  drawer.p5.push();
    format.apply(text.point);
    switch (format.hAlign) {
      case hEnum.left:
        switch (format.vAlign) {
          case vEnum.top:
            cornerReticule(0/4, format.vPadding, format.hPadding, false);
            cornerReticule(1/4, format.hPadding, format.vPadding, true);
            break;
          case vEnum.center:
            centerReticule(0/4, format.hPadding, format.vPadding, true);
            break;
          case vEnum.baseline:
            centerReticule(0/4, format.hPadding, format.vPadding, true);
            break;
          case vEnum.bottom:
            cornerReticule(0/4, format.vPadding, format.hPadding, true);
            cornerReticule(3/4, format.hPadding, format.vPadding, false);
            break;
        }
        break;

      case hEnum.center:
        switch (format.vAlign) {
          case vEnum.top:
            centerReticule(1/4, format.vPadding, format.hPadding, false);
            break;
          case vEnum.center:
            centerReticule(1/4, format.vPadding, format.hPadding, false);
            break;
          case vEnum.baseline:
            centerReticule(1/4, format.vPadding, format.hPadding, false);
            break;
          case vEnum.bottom:
            centerReticule(3/4, format.vPadding, format.hPadding, true);
            break;
        }
        break;

      case hEnum.right:
        switch (format.vAlign) {
          case vEnum.top:
            cornerReticule(2/4, format.vPadding, format.hPadding, true);
            cornerReticule(1/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.center:
            centerReticule(2/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.baseline:
            centerReticule(2/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.bottom:
            cornerReticule(2/4, format.vPadding, format.hPadding, false);
            cornerReticule(3/4, format.hPadding, format.vPadding, true);
            break;
        }
        break;
    }
  drawer.p5.pop();

  // Text object
  text.draw(drawer.debugTextStyle);

  // Debug Text
  if (drawsText !== true) { return; }

  const fix = function(number) {
    return number.toFixed(digits);
  };

  let stringPa = `p:(${fix(text.point.x)},${fix(text.point.y)}) a:${fix(format.angle.turn)}`;
  let stringAl = `al:${format.hAlign},${format.vAlign}`;
  let stringPad = `pa:${fix(format.hPadding)},${fix(format.vPadding)}`;
  let debugString = `${stringPa}\n${stringAl}\n${stringPad}`;

  let debugFormat = new Rac.Text.Format(
    rac,
    hEnum.right, vEnum.bottom,
    rac.Angle.zero,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size,
    pointRadius, pointRadius);
  text.point.text(`${debugString}`, debugFormat)
    .draw(drawer.debugTextStyle);
}; // debugText


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape

