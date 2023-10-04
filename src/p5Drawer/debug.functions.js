'use strict';


const Rac = require('../Rac');


// RELEASE-TODO: use uprightText for these cases
function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
}


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

  // Text
  if (drawsText !== true) { return; }

  // Normal orientation
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.center,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    format = format.reverse();
  }

  // Turn text
  let turnString = `turn:${angle.turn.toFixed(digits)}`;
  point
    .pointToAngle(angle, markerRadius*2)
    .text(turnString, format)
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

  // Text
  if (drawsText !== true) { return; }

  let string = `x:${point.x.toFixed(digits)}\ny:${point.y.toFixed(digits)}`;
  let format = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top,
    rac.Angle.e,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, pointRadius*2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


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

  // Text
  if (drawsText !== true) { return; }

  const angle  = ray.angle;
  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;
  const font   = drawer.debugTextOptions.font;
  const size   = drawer.debugTextOptions.size;
  const digits = drawer.debugTextOptions.fixedDigits;

  // Normal orientation
  let startFormat = new Rac.Text.Format(rac,
    hEnum.left, vEnum.bottom,
    angle, font, size);
  let angleFormat = new Rac.Text.Format(rac,
    hEnum.left, vEnum.top,
    angle, font, size);
  if (reversesText(angle)) {
    // Reverse orientation
    startFormat = startFormat.reverse();
    angleFormat = angleFormat.reverse();
  }

  // Start text
  const startString = `start:(${ray.start.x.toFixed(digits)},${ray.start.y.toFixed(digits)})`;
  ray.start
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(startString, startFormat)
    .draw(drawer.debugTextStyle);

  // Angle text
  const angleString = `angle:${angle.turn.toFixed(digits)}`;
  ray.start
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugRay


exports.debugSegment = function(drawer, segment, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

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


  // Text
  if (drawsText !== true) { return; }

  let angle = segment.angle();
  // Normal orientation
  let lengthFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.bottom,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  let angleFormat = new Rac.Text.Format(
    rac,
    Rac.Text.Format.horizontalAlign.left,
    Rac.Text.Format.verticalAlign.top,
    angle,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    lengthFormat = lengthFormat.reverse();
    angleFormat = angleFormat.reverse();
  }

  // Length
  let lengthString = `length:${segment.length.toFixed(digits)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.subtract(1/4), markerRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${angle.turn.toFixed(digits)}`;
  segment.startPoint()
    .pointToAngle(angle, pointRadius)
    .pointToAngle(angle.add(1/4), markerRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

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

  // Text
  if (drawsText !== true) { return; }

  let hEnum = Rac.Text.Format.horizontalAlign;
  let vEnum = Rac.Text.Format.verticalAlign;

  let headVertical = arc.clockwise
    ? vEnum.top
    : vEnum.bottom;
  let tailVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;
  let radiusVertical = arc.clockwise
    ? vEnum.bottom
    : vEnum.top;

  // Normal orientation
  let headFormat = new Rac.Text.Format(
    rac,
    hEnum.left,
    headVertical,
    arc.start,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  let tailFormat = new Rac.Text.Format(
    rac,
    hEnum.left,
    tailVertical,
    arc.end,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);
  let radiusFormat = new Rac.Text.Format(
    rac,
    hEnum.left,
    radiusVertical,
    arc.start,
    drawer.debugTextOptions.font,
    drawer.debugTextOptions.size);

  // Reverse orientation
  if (reversesText(arc.start)) {
    headFormat = headFormat.reverse();
    radiusFormat = radiusFormat.reverse();
  }
  if (reversesText(arc.end)) {
    tailFormat = tailFormat.reverse();
  }

  let startString = `start:${arc.start.turn.toFixed(digits)}`;
  let radiusString = `radius:${arc.radius.toFixed(digits)}`;
  let endString = `end:${arc.end.turn.toFixed(digits)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${angleDistance.turn.toFixed(digits)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  if (angleDistance.turn <= 3/4 && !arc.isCircle()) {
    // Radius drawn separately
    let perpAngle = arc.start.perpendicular(!arc.clockwise);
    arc.center
      .pointToAngle(arc.start, markerRadius)
      .pointToAngle(perpAngle, pointRadius*2)
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
      .pointToAngle(arc.start, markerRadius/2)
      .text(headString, headFormat)
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .pointToAngle(arc.end, markerRadius/2)
      .text(tailString, tailFormat)
      .draw(drawer.debugTextStyle);
  } else {
    // Draw strings together
    let allStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .pointToAngle(arc.start, markerRadius/2)
      .text(allStrings, headFormat)
      .draw(drawer.debugTextStyle);
  }
}; // debugArc


// RELEASE-TODO: finalize, clean
exports.debugText = function(drawer, text, drawsText) {
  const rac =          drawer.rac;
  const pointRadius =  drawer.debugPointRadius;
  const markerRadius = drawer.debugMarkerRadius;
  const digits =       drawer.debugTextOptions.fixedDigits;

  const hEnum = Rac.Text.Format.horizontalAlign;
  const vEnum = Rac.Text.Format.verticalAlign;

  const format = text.format;

  // RELEASE-TODO: delete when done
  let mark = drawer.rac.Color.red.stroke(2);

  // Point marker
  text.point.arc(pointRadius).draw();

  let cornerReticule = function(angle, padding, perpPadding, rotation) {
    let atOriginLength = perpPadding;
    rac.Point.zero
      .segmentToAngle(angle, markerRadius)
      .reverse().withLength(markerRadius-pointRadius*2).draw() // line at text edge
      .nextSegmentPerpendicular(rotation, padding).push() // elbow turn
      .nextSegmentPerpendicular(!rotation, atOriginLength).draw() // line at origin
      .nextSegmentWithLength(pointRadius*4)
      .nextSegmentWithLength(markerRadius-pointRadius*2).draw(); // opposite side line
      // Dashed elbow turn
      dashedDraw(drawer, [5, 2], ()=>{ rac.popStack().draw(); });
  }

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
            break;
          case vEnum.baseline:break;
          case vEnum.bottom:
            cornerReticule(0/4, format.vPadding, format.hPadding, true);
            cornerReticule(3/4, format.hPadding, format.vPadding, false);
            break;
        }
        break;

      case hEnum.center:
        switch (format.vAlign) {
          case vEnum.top:
            // lines at edge of text
            rac.Point.zero
              .ray(0/4).translateToDistance(pointRadius*2)
              .segment(markerRadius - pointRadius*2).draw();
            let elbowMarker = rac.Point.zero
              .segmentToAngle(3/4, format.vPadding).push() //distance to elbow
              .nextSegmentPerpendicular(false, pointRadius)
              .reverse().draw()
              .nextSegmentPerpendicular(false, pointRadius)
              .reverse().draw()

            let center = elbowMarker
              .nextSegmentPerpendicular(false, format.hPadding).push()
              .endPoint();
            dashedDraw(drawer, [5, 2], ()=>{
              rac.popStack().draw();
              rac.popStack().draw();
            });

            center.ray(3/4).translateToDistance(pointRadius*2)
              .segment(markerRadius - pointRadius*2).draw();
            center.ray(2/4).translateToDistance(pointRadius*2)
              .segment(markerRadius - pointRadius*2).draw();
            center.ray(1/4).translateToDistance(pointRadius*2)
              .segment(markerRadius - pointRadius*2).draw()
              .nextSegmentWithLength(format.vPadding - markerRadius)
              .push()
              .nextSegmentPerpendicular(true, format.hPadding)
              .push();
            dashedDraw(drawer, [2, 3], ()=>{
              rac.popStack().draw();
              rac.popStack().draw();
            });
            break;
          case vEnum.center: break;
          case vEnum.baseline: break;
          case vEnum.bottom: break;
        }
        break;

      case hEnum.right:
        switch (format.vAlign) {
          case vEnum.top:
            cornerReticule(2/4, format.vPadding, format.hPadding, true);
            cornerReticule(1/4, format.hPadding, format.vPadding, false);
            break;
          case vEnum.center:break;
          case vEnum.baseline:break;
          case vEnum.bottom:
            cornerReticule(2/4, format.vPadding, format.hPadding, false);
            cornerReticule(3/4, format.hPadding, format.vPadding, true);
            break;
        }
        break;
    }

    // switch (format.vAlign) {
    //       case vEnum.top: break;
    //       case vEnum.center: break;
    //       case vEnum.baseline: break;
    //       case vEnum.bottom: break;
    //     }


  drawer.p5.pop();

  // Text
  text.draw(drawer.debugTextStyle);

  // Point reticule marker
  // let arc = point
  //   .arc(markerRadius, rac.Angle.s, rac.Angle.e)
  //   .draw();
  // arc.startSegment().reverse()
  //   .withLengthRatio(1/2)
  //   .draw();
  // arc.endSegment()
  //   .reverse()
  //   .withLengthRatio(1/2)
  //   .draw();

  // Text
  // if (drawsText !== true) { return; }

  // let string = `x:${point.x.toFixed(digits)}\ny:${point.y.toFixed(digits)}`;
  // let format = new Rac.Text.Format(
  //   rac,
  //   Rac.Text.Format.horizontalAlign.left,
  //   Rac.Text.Format.verticalAlign.top,
  //   rac.Angle.e,
  //   drawer.debugTextOptions.font,
  //   drawer.debugTextOptions.size);
  // point
  //   .pointToAngle(rac.Angle.se, pointRadius*2)
  //   .text(string, format)
  //   .draw(drawer.debugTextStyle);
}; // debugText


// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape

