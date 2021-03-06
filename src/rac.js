'use strict';


// Ruler and Compass - 0.9.10
const version = '0.9.10-dev';


// Adds an enumerable constant to the given object.
function addEnumConstant(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: value
  });
}


class Rac {

  constructor () {
    addEnumConstant(this, 'version', version);
    // https://tauday.com/tau-manifesto
    addEnumConstant(this, `TAU`, Math.PI * 2);

    // Used to determine equality between measures for some operations, like
    // calculating the slope of a segment. Values too close can result in odd
    // calculations.
    // When checking for equality x is equal to non-inclusive
    // (x-equalityThreshold, x+equalityThreshold):
    // + x is not equal to x±equalityThreshold
    // + x is equal to x±equalityThreshold/2
    this.equalityThreshold = 0.001;

    // Length for elements that need an arbitrary value.
    this.arbitraryLength = 100;

    // Drawer for the instance. This object handles the drawing of any
    // visual object.
    this.drawer = null;

    // Error identifiers
    this.Error = {
      abstractFunctionCalled: "Abstract function called",
      invalidParameterCombination: "Invalid parameter combination",
      invalidObjectConfiguration: "Invalid object configuration",
      invalidObjectToConvert: "Invalid object to convert",
      invalidObjectToDraw: "Invalid object to draw"}
  }

  // Sets the drawer for the instance. Currently only a p5.js instance
  // is supported.
  // TODO: This function will also populate some of the clases with
  // prototype functions specific to the drawer. For p5.js this include
  // `apply` functions for colors and style elements, and `vertex`
  // functions for
  setupDrawer(p5Instance) {
    this.drawer = new this.P5Drawer(this, p5Instance)
  }

}

// Makes a new RAC object populated with all RAC classes and features.
//
// The RAC object is initialized without a `drawer`. Call `setupDrawer`
// to enable drawing  functionality, otherwise an error will be thrown if
// any drawing is attempted.
let makeRac = function makeRac() {

  let rac = new Rac();


  // Convenience function for logging, returns the constructor name of
  // `obj`, or its type name.
  rac.typeName = function(obj) {
    return obj.constructor.name ?? typeof obj
  };


  let attachProtoFunctions = require('./protoFunctions');
  attachProtoFunctions(rac);


  // P5Drawer
  rac.P5Drawer = require('./makeP5Drawer')(rac);


  // Color
  rac.Color = require('./visual/makeColor')(rac);

  // TODO: applies should also go through the drawer
  rac.Color.prototype.applyBackground = function() {
    rac.drawer.p5.background(this.r * 255, this.g * 255, this.b * 255);
  };

  rac.Color.prototype.applyFill = function() {
    rac.drawer.p5.fill(this.r * 255, this.g * 255, this.b * 255, this.alpha * 255);
  };


  // Stroke
  rac.Stroke = require('./visual/makeStroke')(rac);

  rac.Stroke.prototype.apply = function(){
    if (this.color === null) {
      rac.drawer.p5.noStroke();
      return;
    }

    rac.drawer.p5.stroke(
      this.color.r * 255,
      this.color.g * 255,
      this.color.b * 255,
      this.color.alpha * 255);
    rac.drawer.p5.strokeWeight(this.weight);
  };


  // Fill
  rac.Fill = require('./visual/makeFill')(rac);

  rac.Fill.prototype.apply = function() {
    if (this.color === null) {
      rac.drawer.p5.noFill();
      return;
    }

    this.color.applyFill();
  }


  // Style
  rac.Style = require('./visual/makeStyle')(rac);

  rac.Style.prototype.apply = function() {
    if (this.stroke !== null) {
      this.stroke.apply();
    }
    if (this.fill !== null) {
      this.fill.apply();
    }
  }

  rac.Style.prototype.applyToClass = function(classObj) {
    rac.drawer.setClassStyle(classObj, this);
  }


  // Text
  rac.Text = require('./visual/makeText.js')(rac);
  rac.setupProtoFunctions(rac.Text);

  // TODO: should be added by drawerp5
  rac.Text.Format.prototype.apply = function(point) {
    let hAlign;
    let hOptions = rac.Text.Format.horizontal;
    switch (this.horizontal) {
      case hOptions.left:   hAlign = rac.drawer.p5.LEFT;   break;
      case hOptions.center: hAlign = rac.drawer.p5.CENTER; break;
      case hOptions.right:  hAlign = rac.drawer.p5.RIGHT;  break;
      default:
        console.trace(`Invalid horizontal configuration - horizontal:${this.horizontal}`);
        throw rac.Error.invalidObjectConfiguration;
    }

    let vAlign;
    let vOptions = rac.Text.Format.vertical;
    switch (this.vertical) {
      case vOptions.top:      vAlign = rac.drawer.p5.TOP;      break;
      case vOptions.bottom:   vAlign = rac.drawer.p5.BOTTOM;   break;
      case vOptions.center:   vAlign = rac.drawer.p5.CENTER;   break;
      case vOptions.baseline: vAlign = rac.drawer.p5.BASELINE; break;
      default:
        console.trace(`Invalid vertical configuration - vertical:${this.vertical}`);
        throw rac.Error.invalidObjectConfiguration;
    }

    // Text properties
    rac.drawer.p5.textAlign(hAlign, vAlign);
    rac.drawer.p5.textSize(this.size);
    if (this.font !== null) {
      rac.drawer.p5.textFont(this.font);
    }

    // Positioning
    rac.drawer.p5.translate(point.x, point.y);
    if (this.rotation.turn != 0) {
      rac.drawer.p5.rotate(this.rotation.radians());
    }
  }


  // Angle
  rac.Angle = require('./geometry/makeAngle')(rac);


  // Point
  rac.Point = require('./geometry/makePoint')(rac);
  rac.setupProtoFunctions(rac.Point);

  // TODO: functions should be added by P5 drawer
  // TODO: implemenent drawingAreaCenter, rename to pointer
  rac.Point.mouse = function() {
    return new rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
  }

  rac.Point.center = function() {
    return new rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
  }

  rac.Point.prototype.vertex = function() {
    rac.drawer.p5.vertex(this.x, this.y);
    return this;
  }


  // Segment
  rac.Segment = require('./geometry/makeSegment')(rac)
  rac.setupProtoFunctions(rac.Segment);


  rac.Arc = class RacArc {

    constructor(
      center, radius,
      start = rac.Angle.zero,
      end = start,
      clockwise = true)
    {
      this.center = center;
      this.radius = radius;
      // Start angle of the arc. Arc will draw from this angle towards `end`
      // in the `clockwise` orientaton.
      this.start = rac.Angle.from(start);
      // End angle of the arc. Arc will draw from `start` to this angle in
      // the `clockwise` orientaton.
      this.end = rac.Angle.from(end);
      // Orientation of the arc
      this.clockwise = clockwise;
    }

    copy() {
      return new rac.Arc(
        this.center,
        this.radius,
        this.start,
        this.end,
        this.clockwise);
    }

    vertex() {
      let arcLength = this.arcLength();
      let beziersPerTurn = 5;
      let divisions = arcLength.turn == 0
        ? beziersPerTurn
        // TODO: use turnOne? when possible to test
        : Math.ceil(arcLength.turn * beziersPerTurn);

      this.divideToBeziers(divisions).vertex();
      return this;
    }

    reverse() {
      return new rac.Arc(
        this.center, this.radius,
        this.end, this.start,
        !this.clockwise);
    }

    withCenter(newCenter) {
      return new rac.Arc(
        newCenter, this.radius,
        this.start, this.end,
        this.clockwise);
    }

    withStart(newStart) {
      let newStartAngle = rac.Angle.from(newStart);
      return new rac.Arc(
        this.center, this.radius,
        newStartAngle, this.end,
        this.clockwise);
    }

    withEnd(newEnd) {
      let newEndAngle = rac.Angle.from(newEnd);
      return new rac.Arc(
        this.center, this.radius,
        this.start, newEndAngle,
        this.clockwise);
    }

    withRadius(newRadius) {
      return new rac.Arc(
        this.center, newRadius,
        this.start, this.end,
        this.clockwise);
    }

    withArcLength(newArcLength) {
      let newEnd = this.angleAtArcLength(newArcLength);
      return new rac.Arc(
        this.center, this.radius,
        this.start, newEnd,
        this.clockwise);
    }

    withClockwise(newClockwise) {
      return new rac.Arc(
        this.center, this.radius,
        this.start, this.end,
        newClockwise);
    }

    withStartTowardsPoint(point) {
      let newStart = this.center.angleToPoint(point);
      return new rac.Arc(
        this.center, this.radius,
        newStart, this.end,
        this.clockwise);
    }

    withEndTowardsPoint(point) {
      let newEnd = this.center.angleToPoint(point);
      return new rac.Arc(
        this.center, this.radius,
        this.start, newEnd,
        this.clockwise);
    }

    withStartEndTowardsPoint(startPoint, endPoint) {
      let newStart = this.center.angleToPoint(startPoint);
      let newEnd = this.center.angleToPoint(endPoint);
      return new rac.Arc(
        this.center, this.radius,
        newStart, newEnd,
        this.clockwise);
    }

    // Returns `true` if this arc is a complete circle.
    isCircle() {
      let distance = Math.abs(this.end.turn - this.start.turn);
      return distance <= rac.equalityThreshold;
    }

    // Returns `value` clamped to the given insets from zero and the length
    // of the segment.

    // Returns `someAngle` clamped to the given insets from `this.start` and
    // `this.end`, whichever is closest in distance if `someAngle` is outside
    // the arc.
    // TODO: invalid range could return a value centered in the insets? more visually congruent
    // If the `start/endInset` values result in a contradictory range, the
    // returned value will comply with `startInset + this.start`.
    clampToInsets(someAngle, someAngleStartInset = rac.Angle.zero, someAngleEndInset = rac.Angle.zero) {
      let angle = rac.Angle.from(someAngle);
      let startInset = rac.Angle.from(someAngleStartInset);
      let endInset = rac.Angle.from(someAngleEndInset);

      if (this.isCircle() && startInset.turn == 0 && endInset.turn == 0) {
        // Complete circle
        return angle;
      }

      // Angle in arc, with arc as origin
      // All comparisons are made in a clockwise orientation
      let shiftedAngle = this.distanceFromStart(angle);
      let shiftedStartClamp = startInset;
      let shiftedEndClamp = this.arcLength().substract(endInset);

      if (shiftedAngle.turn >= shiftedStartClamp.turn && shiftedAngle.turn <= shiftedEndClamp.turn) {
        // Inside clamp range
        return angle;
      }

      // Outside range, figure out closest limit
      let distanceToStartClamp = shiftedStartClamp.distance(shiftedAngle, false);
      let distanceToEndClamp = shiftedEndClamp.distance(shiftedAngle);
      if (distanceToStartClamp.turn <= distanceToEndClamp.turn) {
        return this.shiftAngle(startInset);
      } else {
        return this.reverse().shiftAngle(endInset);
      }
    }

  }


  rac.setupProtoFunctions(rac.Arc);


  // Returns `true` if the given angle is positioned between `start` and
  // `end` in the `clockwise` orientation. For complete circle arcs `true` is
  // always returned.
  rac.Arc.prototype.containsAngle = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    if (this.isCircle()) { return true; }

    if (this.clockwise) {
      let offset = angle.sub(this.start);
      let endOffset = this.end.sub(this.start);
      return offset.turn <= endOffset.turn;
    } else {
      let offset = angle.sub(this.end);
      let startOffset = this.start.sub(this.end);
      return offset.turn <= startOffset.turn;
    }
  };

  // Returns `true` if the projection of `point` in the arc is positioned
  // between `start` and `end` in the `clockwise` orientation. For complete
  // circle arcs `true` is always returned.
  rac.Arc.prototype.containsProjectedPoint = function(point) {
    if (this.isCircle()) { return true; }
    return this.containsAngle(this.center.angleToPoint(point));
  }

  // Returns a segment for the chord formed by the intersection of `this` and
  // `other`; or return `null` if there is no intersection.
  // Both arcs are considered complete circles for the calculation of the
  // chord, thus the endpoints of the returned segment may not lay inside the
  // actual arcs.
  rac.Arc.prototype.intersectionChord = function(other) {
    // https://mathworld.wolfram.com/Circle-CircleIntersection.html
    // R=this, r=other

    let distance = this.center.distanceToPoint(other.center);

    if (distance <= rac.equalityThreshold) {
      // Distance of zero or too close considered as same center
      return null;
    }

    // distanceToChord = (d^2 - r^2 + R^2) / (d*2)
    let distanceToChord = (
        Math.pow(distance, 2)
      - Math.pow(other.radius, 2)
      + Math.pow(this.radius, 2)
      ) / (distance * 2);

    // a = 1/d sqrt|(-d+r-R)(-d-r+R)(-d+r+R)(d+r+R)
    let chordLength = (1 / distance) * Math.sqrt(
        (-distance + other.radius - this.radius)
      * (-distance - other.radius + this.radius)
      * (-distance + other.radius + this.radius)
      * (distance + other.radius + this.radius));

    let rayToChord = this.center.segmentToPoint(other.center)
      .withLength(distanceToChord);
    return rayToChord.nextSegmentPerpendicular(this.clockwise)
      .withLength(chordLength/2)
      .reverse()
      .segmentWithRatioOfLength(2);
  };

  // Returns the section of `this` that is inside `other`.
  // `other` is aways considered as a complete circle.
  rac.Arc.prototype.intersectionArc = function(other) {
    let chord = this.intersectionChord(other);
    if (chord === null) { return null; }

    let startAngle = this.center.angleToPoint(chord.start);
    let endAngle = this.center.angleToPoint(chord.end);

    if (!this.containsAngle(startAngle)) {
      startAngle = this.start;
    }
    if (!this.containsAngle(endAngle)) {
      endAngle = this.end;
    }

    return new rac.Arc(
      this.center, this.radius,
      startAngle,
      endAngle,
      this.clockwise);
  };

  // Returns only intersecting points.
  rac.Arc.prototype.intersectingPointsWithArc = function(other) {
    let chord = this.intersectionChord(other);
    if (chord === null) { return []; }

    let intersections = [chord.start, chord.end].filter(function(item) {
      return this.containsAngle(this.center.segmentToPoint(item))
        && other.containsAngle(other.center.segmentToPoint(item));
    }, this);

    return intersections;
  };

  // Returns a segment for the chord formed by the intersection of `this` and
  // `segment`; or return `null` if there is no intersection. The returned
  // segment will have the same angle as `segment`.
  //
  // For this function `this` is considered a complete circle, and `segment`
  // is considered a line without endpoints.
  rac.Arc.prototype.intersectionChordWithSegment = function(segment) {
    // First check intersection
    let projectedCenter = segment.projectedPoint(this.center);
    let bisector = this.center.segmentToPoint(projectedCenter);
    let distance = bisector.length();
    if (distance > this.radius - rac.equalityThreshold) {
      // projectedCenter outside or too close to arc edge
      return null;
    }

    // Segment too close to center, consine calculations may be incorrect
    if (distance < rac.equalityThreshold) {
      let segmentAngle = segment.angle();
      let start = this.pointAtAngle(segmentAngle.inverse());
      let end = this.pointAtAngle(segmentAngle);
      return new rac.Segment(start, end);
    }

    let radians = Math.acos(distance/this.radius);
    let angle = rac.Angle.fromRadians(radians);

    let centerOrientation = segment.pointOrientation(this.center);
    let start = this.pointAtAngle(bisector.angle().shift(angle, !centerOrientation));
    let end = this.pointAtAngle(bisector.angle().shift(angle, centerOrientation));
    return new rac.Segment(start, end);
  };

  // Returns the `end` point of `intersectionChordWithSegment` for `segment`.
  // If `segment` does not intersect with `self`, returns the point in the
  // arc closest to `segment`.
  //
  // For this function `this` is considered a complete circle, and `segment`
  // is considered a line without endpoints.
  rac.Arc.prototype.chordEndOrProjectionWithSegment = function(segment) {
    let chord = this.intersectionChordWithSegment(segment);
    if (chord !== null) {
      return chord.end;
    }

    let centerOrientation = segment.pointOrientation(this.center);
    let perpendicular = segment.angle().perpendicular(!centerOrientation);
    return this.pointAtAngle(perpendicular);
  };

  // Returns an Angle that represents the distance between `this.start` and
  // `this.end`, in the orientation of the arc.
  rac.Arc.prototype.arcLength = function() {
    return this.start.distance(this.end, this.clockwise);
  };

  rac.Arc.prototype.startPoint = function() {
    return this.center.segmentToAngle(this.start, this.radius).end;
  };

  rac.Arc.prototype.endPoint = function() {
    return this.center.segmentToAngle(this.end, this.radius).end;
  };

  rac.Arc.prototype.startSegment = function() {
    return new rac.Segment(this.center, this.startPoint());
  };

  rac.Arc.prototype.endSegment = function() {
    return new rac.Segment(this.endPoint(), this.center);
  };

  rac.Arc.prototype.radiusSegmentAtAngle = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.center.segmentToAngle(angle, this.radius);
  }

  rac.Arc.prototype.radiusSegmentTowardsPoint = function(point) {
    let angle = this.center.angleToPoint(point);
    return this.center.segmentToAngle(angle, this.radius);
  }

  // Returns the equivalent to `someAngle` shifted to have `this.start` as
  // origin, in the orientation of the arc.
  // Useful to determine an angle inside the arc, where the arc is considered
  // the origin coordinate system.
  // For a clockwise arc starting at `0.5`, a `shiftAngle(0.1)` is `0.6`.
  // For a clockwise orientation, equivalent to `this.start + someAngle`.
  rac.Arc.prototype.shiftAngle = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.start.shift(angle, this.clockwise);
  }

  // Returns an Angle that represents the distance from `this.start` to
  // `someAngle` traveling in the `clockwise` orientation.
  // Useful to determine for a given angle, where it sits inside the arc if
  // the arc was the origin coordinate system.
  // For a clockwise arc starting at `0.1`, a `distanceFromStart(0.5)` is `0.4`.
  // For a clockwise orientation, equivalent to `someAngle - this.start`.
  rac.Arc.prototype.distanceFromStart = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.start.distance(angle, this.clockwise);
  }

  // Returns the Angle at the given arc length from `start`. Equivalent to
  // `shiftAngle(someAngle)`.
  rac.Arc.prototype.angleAtArcLength = function(someAngle) {
    return this.shiftAngle(someAngle);
  }

  // Returns the point in the arc at the given angle shifted by `this.start`
  // in the arc orientation. The arc is considered a complete circle.
  rac.Arc.prototype.pointAtArcLength = function(someAngle) {
    let shiftedAngle = this.shiftAngle(someAngle);
    return this.pointAtAngle(shiftedAngle);
  };

  // Returns the point in the arc at the current arc length multiplied by
  // `arcLengthRatio` and then shifted by `this.start` in the arc
  // orientation. The arc is considered a complete circle.
  rac.Arc.prototype.pointAtArcLengthRatio = function(arcLengthRatio) {
    let newArcLength = this.arcLength().mult(arcLengthRatio);
    let shiftedAngle = this.shiftAngle(newArcLength);
    return this.pointAtAngle(shiftedAngle);
  };

  // Returns the point in the arc at the given angle. The arc is considered
  // a complete circle.
  rac.Arc.prototype.pointAtAngle = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.center.segmentToAngle(angle, this.radius).end;
  };

  // Returns a segment that is tangent to both `this` and `otherArc`,
  // considering both as complete circles.
  // With a segment from `this.center` to `otherArc.center`: `startClockwise`
  // determines the starting side returned tangent segment, `endClocwise`
  // determines the end side.
  // Returns `null` if `this` is inside `otherArc` and thus no tangent segment
  // is possible.
  rac.Arc.prototype.segmentTangentToArc = function(otherArc, startClockwise = true, endClockwise = true) {
    let hypSegment = this.center.segmentToPoint(otherArc.center);
    let ops = startClockwise === endClockwise
      ? otherArc.radius - this.radius
      : otherArc.radius + this.radius;

    let angleSine = ops / hypSegment.length();
    if (angleSine > 1) {
      return null;
    }

    let angleRadians = Math.asin(angleSine);
    let opsAngle = rac.Angle.fromRadians(angleRadians);

    let adjOrientation = startClockwise === endClockwise
      ? startClockwise
      : !startClockwise;
    let shiftedOpsAngle = hypSegment.angle().shift(opsAngle, adjOrientation);
    let shiftedAdjAngle = shiftedOpsAngle.perpendicular(adjOrientation);

    let startAngle = startClockwise === endClockwise
      ? shiftedAdjAngle
      : shiftedAdjAngle.inverse()
    let start = this.pointAtAngle(startAngle);
    let end = otherArc.pointAtAngle(shiftedAdjAngle);
    return start.segmentToPoint(end);
  };

  rac.Arc.prototype.divideToSegments = function(segmentCount) {
    let arcLength = this.arcLength();
    let partTurn = arcLength.turn == 0
    // TODO: use turnOne? when possible to test
      ? 1 / segmentCount
      : arcLength.turn / segmentCount;

    let partAngle = new rac.Angle(partTurn);
    if (!this.clockwise) {
      partAngle = partAngle.negative();
    }

    let lastRay = this.startSegment();
    let segments = [];
    for (let count = 1; count <= segmentCount; count++) {
      let currentAngle = lastRay.angle().add(partAngle);
      let currentRay = this.center.segmentToAngle(currentAngle, this.radius);
      segments.push(new rac.Segment(lastRay.end, currentRay.end));
      lastRay = currentRay;
    }

    return segments;
  }

  rac.Arc.prototype.divideToBeziers = function(bezierCount) {
    let arcLength = this.arcLength();
    let partTurn = arcLength.turn == 0
    // TODO: use turnOne? when possible to test
      ? 1 / bezierCount
      : arcLength.turn / bezierCount;

    // length of tangent:
    // https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    let parsPerTurn = 1 / partTurn;
    let tangent = this.radius * (4/3) * Math.tan(Math.PI/(parsPerTurn*2));

    let beziers = [];
    let segments = this.divideToSegments(bezierCount);
    segments.forEach(function(item) {
      let startRay = new rac.Segment(this.center, item.start);
      let endRay = new rac.Segment(this.center, item.end);

      let startAnchor = startRay
        .segmentToRelativeAngle(rac.Angle.square, tangent, !this.clockwise)
        .end;
      let endAnchor = endRay
        .segmentToRelativeAngle(rac.Angle.square, tangent, this.clockwise)
        .end;

      beziers.push(new rac.Bezier(
        startRay.end, startAnchor,
        endAnchor, endRay.end));
    }, this);

    return new rac.Composite(beziers);
  };


  rac.Bezier = function RacBezier(start, startAnchor, endAnchor, end) {
    this.start = start;
    this.startAnchor = startAnchor;
    this.endAnchor = endAnchor;
    this.end = end;
  };


  rac.setupProtoFunctions(rac.Bezier);

  rac.Bezier.prototype.drawAnchors = function(style = undefined) {
    push();
    if (style !== undefined) {
      style.apply();
    }
    this.start.segmentToPoint(this.startAnchor).draw();
    this.end.segmentToPoint(this.endAnchor).draw();
    pop();
  };

  rac.Bezier.prototype.vertex = function() {
    this.start.vertex()
    rac.drawer.p5.bezierVertex(
      this.startAnchor.x, this.startAnchor.y,
      this.endAnchor.x, this.endAnchor.y,
      this.end.x, this.end.y);
  };

  rac.Bezier.prototype.reverse = function() {
    return new rac.Bezier(
      this.end, this.endAnchor,
      this.startAnchor, this.start);
  };


  // Contains a sequence of shapes which can be drawn or vertex together
  rac.Composite = function RacComposite(sequence = []) {
    this.sequence = sequence;
  };


  rac.setupProtoFunctions(rac.Composite);


  rac.Composite.prototype.vertex = function() {
    this.sequence.forEach(item => item.vertex());
  };

  rac.Composite.prototype.isNotEmpty = function() {
    return this.sequence.length != 0;
  };

  rac.Composite.prototype.add = function(element) {
    if (element instanceof Array) {
      element.forEach(item => this.sequence.push(item));
      return
    }
    this.sequence.push(element);
  };

  rac.Composite.prototype.reverse = function() {
    let reversed = this.sequence.map(item => item.reverse())
      .reverse();
    return new rac.Composite(reversed);
  };


  rac.Shape = function RacShape() {
    this.outline = new rac.Composite();
    this.contour = new rac.Composite();
  }


  rac.setupProtoFunctions(rac.Shape);


  rac.Shape.prototype.vertex = function() {
    this.outline.vertex();
    this.contour.vertex();
  };

  rac.Shape.prototype.addOutline = function(element) {
    this.outline.add(element);
  };

  rac.Shape.prototype.addContour = function(element) {
    this.contour.add(element);
  };


  // Implementation of an ease function with several options to tailor its
  // behaviour. The calculation takes the following steps:
  // Value is received, prefix is removed
  //   Value -> easeValue(value)
  //     value = value - prefix
  // Ratio is calculated
  //   ratio = value / inRange
  // Ratio is adjusted
  //   ratio -> easeRatio(ratio)
  //     adjustedRatio = (ratio + ratioOfset) * ratioFactor
  // Ease is calculated
  //   easedRatio = easeUnit(adjustedRatio)
  // EasedRatio is adjusted and returned
  //   easedRatio = (easedRatio + easeOfset) * easeFactor
  //   easeRatio(ratio) -> easedRatio
  // Value is projected
  //   easedValue = value * easedRatio
  // Value is adjusted and returned
  //   easedValue = prefix + (easedValue * outRange)
  //   easeValue(value) -> easedValue
  rac.EaseFunction = class RacEaseFunction {

    // Behaviors for the `easeValue` function when `value` falls before the
    // `prefix` and after `inRange`.
    static Behavior = {
      // `value` is returned without any easing transformation. `preFactor`
      // and `postFactor` are applied. This is the default configuration.
      pass: "pass",
      // Clamps the returned value to `prefix` or `prefix+inRange`;
      clamp: "clamp",
      // Returns the applied easing transformation to `value` for values
      // before `prefix` and after `inRange`.
      continue: "continue"
    };

    constructor() {
      this.a = 2;

      // Applied to ratio before easing.
      this.ratioOffset = 0
      this.ratioFactor = 1;

      // Applied to easedRatio.
      this.easeOffset = 0
      this.easeFactor = 1;

      // Defines the lower limit of `value`` to apply easing.
      this.prefix = 0;

      // `value` is received in `inRange` and output in `outRange`.
      this.inRange = 1;
      this.outRange = 1;

      // Behavior for values before `prefix`.
      this.preBehavior = rac.EaseFunction.Behavior.pass;
      // Behavior for values after `prefix+inRange`.
      this.postBehavior = rac.EaseFunction.Behavior.pass;

      // For a `preBehavior` of `pass`, the factor applied to values before
      // `prefix`.
      this.preFactor = 1;
      // For a `postBehavior` of `pass`, the factor applied to the values
      // after `prefix+inRange`.
      this.postFactor = 1;
    }

    // Returns the corresponding eased value for `unit`. Both the given
    // `unit` and the returned value are in the [0,1] range. If `unit` is
    // outside the [0,1] the returned value follows the curve of the easing
    // function, which may be invalid for some values of `a`.
    //
    // This function is the base easing function, it does not apply any
    // offsets or factors.
    easeUnit(unit) {
      // Source:
      // https://math.stackexchange.com/questions/121720/ease-in-out-function/121755#121755
      // f(t) = (t^a)/(t^a+(1-t)^a)
      let ra = Math.pow(unit, this.a);
      let ira = Math.pow(1-unit, this.a);
      return ra / (ra + ira);
    }

    // Returns the ease function applied to the given ratio. `ratioOffset`
    // and `ratioFactor` are applied to the input, `easeOffset` and
    // `easeFactor` are applied to the output.
    easeRatio(ratio) {
      let adjustedRatio = (ratio + this.ratioOffset) * this.ratioFactor;
      let easedRatio = this.easeUnit(adjustedRatio);
      return (easedRatio + this.easeOffset) * this.easeFactor;
    }

    // Applies the easing function to `value` considering the configuration
    // of the whole instance.
    easeValue(value) {
      let behavior = rac.EaseFunction.Behavior;

      let shiftedValue = value - this.prefix;
      let ratio = shiftedValue / this.inRange;

      // Before prefix
      if (value < this.prefix) {
        if (this.preBehavior === behavior.pass) {
          let distancetoPrefix = value - this.prefix;
          // With a preFactor of 1 this is equivalent to `return range`
          return this.prefix + (distancetoPrefix * this.preFactor);
        }
        if (this.preBehavior === behavior.clamp) {
          return this.prefix;
        }
        if (this.preBehavior === behavior.continue) {
          let easedRatio = this.easeRatio(ratio);
          return this.prefix + easedRatio * this.outRange;
        }

        console.trace(`Invalid preBehavior configuration - preBehavior:${this.postBehavior}`);
        throw rac.Error.invalidObjectConfiguration;
      }

      // After prefix
      if (ratio <= 1 || this.postBehavior === behavior.continue) {
        // Ease function applied within range (or after)
        let easedRatio = this.easeRatio(ratio);
        return this.prefix + easedRatio * this.outRange;
      }
      if (this.postBehavior === behavior.pass) {
        // Shifted to have inRange as origin
        let shiftedPost = shiftedValue - this.inRange;
        return this.prefix + this.outRange + shiftedPost * this.postFactor;
      }
      if (this.postBehavior === behavior.clamp) {
        return this.prefix + this.outRange;
      }

      console.trace(`Invalid postBehavior configuration - postBehavior:${this.postBehavior}`);
      throw rac.Error.invalidObjectConfiguration;
    }


    // Preconfigured functions

    // Makes an easeFunction preconfigured to an ease out motion.
    //
    // The `outRange` value should be `inRange*2` in order for the ease
    // motion to connect with the external motion at the correct velocity.
    static makeEaseOut() {
      let easeOut = new rac.EaseFunction()
      easeOut.ratioOffset = 1;
      easeOut.ratioFactor = .5;
      easeOut.easeOffset = -.5;
      easeOut.easeFactor = 2;
      return easeOut;
    }

  }


  // Parent class for all controls for manipulating a value with the pointer.
  // Represents a control with a value, value-range, limits, markers, and
  // drawing style. By default the control returns a `value` in the range
  // [0,1] coresponding to the location of the control center in relation to
  // the anchor shape. The value-range is defined by `startValue` and
  // `endValue`.
  rac.Control = class RacControl {

    // Radius of the cicle drawn for the control center.
    static radius = 22;

    // Collection of all controls that are drawn with `drawControls()`
    // and evaluated for selection with the `pointer...()` functions.
    static controls = [];

    // Last Point of the pointer position when it was pressed, or last
    // Control interacted with. Set to `null` when there has been no
    // interaction yet and while there is a selected control.
    static lastPointer = null;

    // Style used for visual elements related to selection and pointer
    // interaction.
    static pointerStyle = null;

    // Selection information for the currently selected control, or `null` if
    // there is no selection.
    static selection = null;


    static Selection = class RacControlSelection{
      constructor(control) {
        // Selected control instance.
        this.control = control;
        // Copy of the control anchor, so that the control can move tied to
        // the drawing, while the interaction range remains fixed.
        this.anchorCopy = control.copyAnchor();
        // Segment from the captured pointer position to the contro center,
        // used to attach the control to the point where interaction started.
        // Pointer is at `segment.start` and control center is at `segment.end`.
        this.pointerOffset = rac.Point.mouse().segmentToPoint(control.center());
      }

      drawSelection(pointerCenter) {
        this.control.drawSelection(pointerCenter, this.anchorCopy, this.pointerOffset);
      }
    }


    // Creates a new Control instance with the given `value`, a default
    // value-range of [0,1], and limits set equal to the value-range.
    constructor(value, startValue = 0, endValue = 1) {
      // Value is a number between startValue and endValue.
      this.value = value;

      // Start and end of the value range.
      this.startValue = startValue;
      this.endValue = endValue;

      // Limits to which the control can be dragged. Interpreted as values in
      // the value-range.
      this.startLimit = startValue;
      this.endLimit = endValue;

      // Collection of values at which markers are drawn.
      this.markers = [];

      this.style = null;
    }

    // Returns the `value` of the control in a [0,1] range.
    ratioValue() {
      return this.ratioOf(this.value);
    }

    // Returns the `startLimit` of the control in a [0,1] range.
    ratioStartLimit() {
      return this.ratioOf(this.startLimit);
    }

    // Returns the `endLimit` of the control in a [0,1] range.
    ratioEndLimit() {
      return this.ratioOf(this.endLimit);
    }

    // Returns the equivalent of the given `value` in a [0,1] range.
    ratioOf(value) {
      return (value - this.startValue) / this.valueRange();
    }

    // Returns the equivalent of the given ratio in the range [0,1] to a value
    // in the value range.
    valueOf(ratio) {
      return (ratio * this.valueRange()) + this.startValue;
    }

    valueRange() {
      return this.endValue - this.startValue;
    }

    // Sets `startLimit` and `endLimit` with two inset values relative to
    // `startValue` and `endValue`.
    setLimitsWithValueInsets(startInset, endInset) {
      let rangeDirection = this.valueRange() >= 0 ? 1 : -1;

      this.startLimit = this.startValue + (startInset * rangeDirection);
      this.endLimit = this.endValue - (endInset * rangeDirection);
    }

    // Sets `startLimit` and `endLimit` with two inset values relative to the
    // [0,1] range.
    setLimitsWithRatioInsets(startInset, endInset) {
      this.startLimit = this.valueOf(startInset);
      this.endLimit = this.valueOf(1 - endInset);
    }

    // Adds a marker at the current `value`.
    addMarkerAtCurrentValue() {
      this.markers.push(this.value);
    }

    // Returns `true` if this control is the currently selected control.
    isSelected() {
      if (rac.Control.selection === null) {
        return false;
      }
      return rac.Control.selection.control === this;
    }

    // Abstract function.
    // Returns the center of the control hitpoint.
    center() {
      console.trace(`Abstract function called - this-type:${rac.typeName(this)}`);
      throw rac.Error.abstractFunctionCalled;
    }

    // Abstract function.
    // Returns the persistent copy of the control anchor to be used during
    // user interaction.
    copyAnchor() {
      console.trace(`Abstract function called - this-type:${rac.typeName(this)}`);
      throw rac.Error.abstractFunctionCalled;
    }

    // Abstract function.
    // Draws the current state of the control.
    draw() {
      console.trace(`Abstract function called - this-type:${rac.typeName(this)}`);
      throw rac.Error.abstractFunctionCalled;
    }

    // Abstract function.
    // Updates the control value with `pointerControlCenter` in relation to
    // `anchorCopy`. Called by `pointerDragged` as the user interacts with a
    // selected control.
    updateWithPointer(pointerControlCenter, anchorCopy) {
      console.trace(`Abstract function called - this-type:${rac.typeName(this)}`);
      throw rac.Error.abstractFunctionCalled;
    }

    // Abstract function.
    // Draws the selection state for the control, along with pointer
    // interaction visuals. Called by `drawControls` for the currently
    // selected control.
    drawSelection(pointerCenter, anchorCopy, pointerOffset) {
      console.trace(`Abstract function called - this-type:${rac.typeName(this)}`);
      throw rac.Error.abstractFunctionCalled;
    }

  }


  // Control that uses a Segment as anchor.
  rac.SegmentControl = class RacSegmentControl extends rac.Control {

    // Creates a new Control instance with the given `value` and `length`.
    // By default the value range is [0,1] and limits are set to be the equal
    // as `startValue` and `endValue`.
    constructor(value, length, startValue = 0, endValue = 1) {
      super(value, startValue, endValue);

      // Length for the copied anchor shape.
      this.length = length;

      // Segment to which the control will be anchored. When the control is
      // drawn and interacted a copy of the anchor is created with the
      // control's `length`.
      this.anchor = null;
    }

    setValueWithLength(lengthValue) {
      let lengthRatio = lengthValue / this.length;
      this.value = this.valueOf(lengthRatio);
    }

    // Sets `startLimit` and `endLimit` with two inset values relative to
    // zero and `length`.
    setLimitsWithLengthInsets(startInset, endInset) {
      this.startLimit = this.valueOf(startInset / this.length);
      this.endLimit = this.valueOf((this.length - endInset) / this.length);
    }


    // Returns the distance from `anchor.start` to the control center.
    distance() {
      return this.length * this.ratioValue();
    }

    center() {
      // Not posible to calculate a center
      if (this.anchor === null) { return null; }
      return this.anchor.withLength(this.distance()).end;
    }

    // Creates a copy of the current `anchor` with the control `length`.
    copyAnchor() {
      // No anchor to copy
      if (this.anchor === null) { return null; }
      return this.anchor.withLength(this.length);
    }

    draw() {
      let anchorCopy = this.copyAnchor();
      anchorCopy.draw(this.style);

      let center = this.center();
      let angle = anchorCopy.angle();

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let point = anchorCopy.start.pointToAngle(angle, this.length * markerRatio);
        rac.Control.makeValueMarker(point, angle)
          .attachToComposite();
      }, this);

      // Control button
      center.arc(rac.Control.radius)
        .attachToComposite();

      let ratioValue = this.ratioValue();

      // Negative arrow
      if (ratioValue >= this.ratioStartLimit() + rac.equalityThreshold) {
        rac.Control.makeArrowShape(center, angle.inverse())
          .attachToComposite();
      }

      // Positive arrow
      if (ratioValue <= this.ratioEndLimit() - rac.equalityThreshold) {
        rac.Control.makeArrowShape(center, angle)
          .attachToComposite();
      }

      rac.popComposite().draw(this.style);

      // Selection
      if (this.isSelected()) {
        center.arc(rac.Control.radius * 1.5).draw(rac.Control.pointerStyle);
      }
    }

    updateWithPointer(pointerControlCenter, anchorCopy) {
      let length = anchorCopy.length();
      let startInset = length * this.ratioStartLimit();
      let endInset = length * (1 - this.ratioEndLimit());

      // New value from the current pointer position, relative to anchorCopy
      let newDistance = anchorCopy
        .lengthToProjectedPoint(pointerControlCenter);
      // Clamping value (javascript has no Math.clamp)
      newDistance = anchorCopy.clampToLengthInsets(newDistance,
        startInset, endInset);

      // Update control with new distance
      let lengthRatio = newDistance / length;
      this.value = this.valueOf(lengthRatio);
    }

    drawSelection(pointerCenter, anchorCopy, pointerOffset) {
      anchorCopy.attachToComposite();

      let angle = anchorCopy.angle();
      let length = anchorCopy.length();

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let markerPoint = anchorCopy.start.pointToAngle(angle, length * markerRatio);
        rac.Control.makeValueMarker(markerPoint, angle)
          .attachToComposite();
      });

      // Limit markers
      let ratioStartLimit = this.ratioStartLimit();
      if (ratioStartLimit > 0) {
        let minPoint = anchorCopy.start.pointToAngle(angle, length * ratioStartLimit);
        rac.Control.makeLimitMarker(minPoint, angle)
          .attachToComposite();
      }

      let ratioEndLimit = this.ratioEndLimit();
      if (ratioEndLimit < 1) {
        let maxPoint = anchorCopy.start.pointToAngle(angle, length * ratioEndLimit);
        rac.Control.makeLimitMarker(maxPoint, angle.inverse())
          .attachToComposite();
      }

      // Segment from pointer to control dragged center
      let draggedCenter = pointerOffset
        .translateToStart(pointerCenter)
        .end;

      // Control dragged center, attached to pointer
      draggedCenter.arc(2)
        .attachToComposite();

      // Constrained length clamped to limits
      let constrainedLength = anchorCopy
        .lengthToProjectedPoint(draggedCenter);
      let startInset = length * ratioStartLimit;
      let endInset = length * (1 - ratioEndLimit);
      constrainedLength = anchorCopy.clampToLengthInsets(constrainedLength,
        startInset, endInset);

      let constrainedAnchorCenter = anchorCopy
        .withLength(constrainedLength)
        .end;

      // Control center constrained to anchor
      constrainedAnchorCenter.arc(rac.Control.radius)
        .attachToComposite();

      // Dragged shadow center, semi attached to pointer
      // always perpendicular to anchor
      let draggedShadowCenter = draggedCenter
        .segmentPerpendicularToSegment(anchorCopy)
        // reverse and translated to constraint to anchor
        .reverse()
        .translateToStart(constrainedAnchorCenter)
        // Segment from constrained center to shadow center
        .attachToComposite()
        .end;

      // Control shadow center
      draggedShadowCenter.arc(rac.Control.radius / 2)
        .attachToComposite();

      // Ease for segment to dragged shadow center
      let easeOut = rac.EaseFunction.makeEaseOut();
      easeOut.postBehavior = rac.EaseFunction.Behavior.clamp;

      // Tail will stop stretching at 2x the max tail length
      let maxDraggedTailLength = rac.Control.radius * 5;
      easeOut.inRange = maxDraggedTailLength * 2;
      easeOut.outRange = maxDraggedTailLength;

      // Segment to dragged shadow center
      let draggedTail = draggedShadowCenter
        .segmentToPoint(draggedCenter);

      let easedLength = easeOut.easeValue(draggedTail.length());
      draggedTail.withLength(easedLength).attachToComposite();

      // Draw all!
      rac.popComposite().draw(rac.Control.pointerStyle);
    }

  }


  // Control that uses an Arc as anchor.
  rac.ArcControl = class RacArcControl extends rac.Control {

    // Creates a new Control instance with the given `value` and an
    // `arcLength` from `someArcLength`.
    // By default the value range is [0,1] and limits are set to be the equal
    // as `startValue` and `endValue`.
    constructor(value, someArcLength, startValue = 0, endValue = 1) {
      super(value, startValue, endValue);

      // ArcLength for the copied anchor shape.
      this.arcLength = rac.Angle.from(someArcLength);

      // Arc to which the control will be anchored. When the control is
      // drawn and interacted a copy of the anchor is created with the
      // control's `arcLength`.
      this.anchor = null;
    }

    setValueWithArcLength(arcLengthValue) {
      arcLengthValue = rac.Angle.from(arcLengthValue)
      let arcLengthRatio = arcLengthValue.turn / this.arcLength.turnOne();
      this.value = this.valueOf(arcLengthRatio);
    }

    setLimitsWithArcLengthInsets(startInset, endInset) {
      startInset = rac.Angle.from(startInset);
      endInset = rac.Angle.from(endInset);
      this.startLimit = this.valueOf(startInset.turn / this.arcLength.turnOne());
      this.endLimit = this.valueOf((this.arcLength.turnOne() - endInset.turn) / this.arcLength.turnOne());
    }

    // Returns the distance from `anchor.start` to the control center.
    distance() {
      return this.arcLength.multOne(this.ratioValue());
    }

    center() {
      // Not posible to calculate a center
      if (this.anchor === null) { return null; }
      return this.anchor.withArcLength(this.distance()).endPoint();
    }

    // Creates a copy of the current `anchor` with the control's `arcLength`.
    copyAnchor() {
      // No anchor to copy
      if (this.anchor === null) { return null; }
      return this.anchor.withArcLength(this.arcLength);
    }

    draw() {
      let anchorCopy = this.copyAnchor();
      anchorCopy.draw(this.style.withFill(rac.Fill.none));

      let center = this.center();
      let angle = anchorCopy.center.angleToPoint(center);

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let markerArcLength = this.arcLength.multOne(markerRatio);
        let markerAngle = anchorCopy.shiftAngle(markerArcLength);
        let point = anchorCopy.pointAtAngle(markerAngle);
        rac.Control.makeValueMarker(point, markerAngle.perpendicular(!anchorCopy.clockwise))
          .attachToComposite();
      }, this);

      // Control button
      center.arc(rac.Control.radius)
        .attachToComposite();

      let ratioValue = this.ratioValue();

      // Negative arrow
      if (ratioValue >= this.ratioStartLimit() + rac.equalityThreshold) {
        let negAngle = angle.perpendicular(anchorCopy.clockwise).inverse();
        rac.Control.makeArrowShape(center, negAngle)
          .attachToComposite();
      }

      // Positive arrow
      if (ratioValue <= this.ratioEndLimit() - rac.equalityThreshold) {
        let posAngle = angle.perpendicular(anchorCopy.clockwise);
        rac.Control.makeArrowShape(center, posAngle)
          .attachToComposite();
      }

      rac.popComposite().draw(this.style);

      // Selection
      if (this.isSelected()) {
        center.arc(rac.Control.radius * 1.5).draw(rac.Control.pointerStyle);
      }
    }

    updateWithPointer(pointerControlCenter, anchorCopy) {
      let arcLength = anchorCopy.arcLength();
      let startInset = arcLength.multOne(this.ratioStartLimit());
      let endInset = arcLength.multOne(1 - this.ratioEndLimit());

      let selectionAngle = anchorCopy.center
        .angleToPoint(pointerControlCenter);
      selectionAngle = anchorCopy.clampToInsets(selectionAngle,
        startInset, endInset);
      let newDistance = anchorCopy.distanceFromStart(selectionAngle);

      // Update control with new distance
      let lengthRatio = newDistance.turn / this.arcLength.turnOne();
      this.value = this.valueOf(lengthRatio);
    }

    drawSelection(pointerCenter, anchorCopy, pointerOffset) {
      anchorCopy.attachToComposite();

      let arcLength = anchorCopy.arcLength();

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let markerAngle = anchorCopy.shiftAngle(arcLength.multOne(markerRatio));
        let markerPoint = anchorCopy.pointAtAngle(markerAngle);
        rac.Control.makeValueMarker(markerPoint, markerAngle.perpendicular(!anchorCopy.clockwise))
          .attachToComposite();
      });

      // Limit markers
      let ratioStartLimit = this.ratioStartLimit();
      if (ratioStartLimit > 0) {
        let minAngle = anchorCopy.shiftAngle(arcLength.multOne(ratioStartLimit));
        let minPoint = anchorCopy.pointAtAngle(minAngle);
        let markerAngle = minAngle.perpendicular(anchorCopy.clockwise);
        rac.Control.makeLimitMarker(minPoint, markerAngle)
          .attachToComposite();
      }

      let ratioEndLimit = this.ratioEndLimit();
      if (ratioEndLimit < 1) {
        let maxAngle = anchorCopy.shiftAngle(arcLength.multOne(ratioEndLimit));
        let maxPoint = anchorCopy.pointAtAngle(maxAngle);
        let markerAngle = maxAngle.perpendicular(!anchorCopy.clockwise);
        rac.Control.makeLimitMarker(maxPoint, markerAngle)
          .attachToComposite();
      }

      // Segment from pointer to control dragged center
      let draggedCenter = pointerOffset
        .translateToStart(pointerCenter)
        .end;

      // Control dragged center, attached to pointer
      draggedCenter.arc(2)
        .attachToComposite();

      // TODO: implement arc control dragging visuals!

      rac.popComposite().draw(rac.Control.pointerStyle);
    }

  }


  // Controls shared drawing elements

  rac.Control.makeArrowShape = function(center, angle) {
    // Arc
    let arcLength = rac.Angle.from(1/22);
    let arc = center.arc(rac.Control.radius * 1.5,
      angle.sub(arcLength), angle.add(arcLength));

    // Arrow walls
    let pointAngle = rac.Angle.from(1/8);
    let rightWall = arc.startPoint().segmentToAngle(angle.add(pointAngle), 100);
    let leftWall = arc.endPoint().segmentToAngle(angle.sub(pointAngle), 100);

    // Arrow point
    let point = rightWall.pointAtIntersectionWithSegment(leftWall);

    // Shape
    let arrow = new rac.Shape();
    point.segmentToPoint(arc.startPoint())
      .attachTo(arrow);
    arc.attachTo(arrow)
      .endPoint().segmentToPoint(point)
      .attachTo(arrow);

      return arrow;
  };

  rac.Control.makeLimitMarker = function(point, someAngle) {
    let angle = rac.Angle.from(someAngle);
    let perpendicular = angle.perpendicular(false);
    let composite = new rac.Composite();

    point.segmentToAngle(perpendicular, 4)
      .withStartExtended(4)
      .attachTo(composite);
    point.pointToAngle(perpendicular, 8).arc(3)
      .attachTo(composite);

    return composite;
  };

  rac.Control.makeValueMarker = function(point, someAngle) {
    let angle = rac.Angle.from(someAngle);
    return point.segmentToAngle(angle.perpendicular(), 3)
      .withStartExtended(3);
  };


  // Control pointer and interaction

  // Call to signal the pointer being pressed. If the ponter hits a control
  // it will be considered selected. When a control is selected a copy of its
  // anchor is stored as to allow interaction with a fixed anchor.
  rac.Control.pointerPressed = function(pointerCenter) {
    rac.Control.lastPointer = null;

    // Test pointer hit
    let selected = rac.Control.controls.find(item => {
      let controlCenter = item.center();
      if (controlCenter === null) { return false; }
      if (controlCenter.distanceToPoint(pointerCenter) <= rac.Control.radius) {
        return true;
      }
      return false;
    });

    if (selected === undefined) {
      return;
    }

    rac.Control.selection = new rac.Control.Selection(selected, pointerCenter);
  };


  // Call to signal the pointer being dragged. As the pointer moves the
  // selected control is updated with a new `distance`.
  rac.Control.pointerDragged = function(pointerCenter){
    if (rac.Control.selection === null) {
      return;
    }

    let control = rac.Control.selection.control;
    let anchorCopy = rac.Control.selection.anchorCopy;

    // Center of dragged control in the pointer current position
    let currentPointerControlCenter = rac.Control.selection.pointerOffset
      .translateToStart(pointerCenter)
      .end;

    control.updateWithPointer(currentPointerControlCenter, anchorCopy);
  };


  // Call to signal the pointer being released. Upon release the selected
  // control is cleared.
  rac.Control.pointerReleased = function(pointerCenter) {
    if (rac.Control.selection === null) {
      rac.Control.lastPointer = pointerCenter;
      return;
    }

    rac.Control.lastPointer = rac.Control.selection.control;
    rac.Control.selection = null;
  };


  // Draws controls and the visuals of pointer and control selection. Usually
  // called at the end of `draw` so that controls sits on top of the drawing.
  rac.Control.drawControls = function() {
    let pointerStyle = rac.Control.pointerStyle;

    // Last pointer or control
    if (rac.Control.lastPointer instanceof rac.Point) {
      rac.Control.lastPointer.arc(12).draw(pointerStyle);
    }
    if (rac.Control.lastPointer instanceof rac.Control) {
      // TODO: implement last selected control state
    }

    // Pointer pressed
    let pointerCenter = rac.Point.mouse();
    if (rac.drawer.p5.mouseIsPressed) {
      if (rac.Control.selection === null) {
        pointerCenter.arc(10).draw(pointerStyle);
      } else {
        pointerCenter.arc(5).draw(pointerStyle);
      }
    }

    // All controls in display
    rac.Control.controls.forEach(item => item.draw());

    // Rest is Control selection visuals
    if (rac.Control.selection === null) {
      return;
    }

    rac.Control.selection.drawSelection(pointerCenter);
  };


  return rac;
}; // makeRac


addEnumConstant(makeRac, 'version', version);
module.exports = makeRac;

