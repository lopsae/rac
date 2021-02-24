"use strict";

// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // https://github.com/amdjs/amdjs-api/blob/master/AMD.md
    // AMD. Register as an anonymous module.
    console.log(`Loading RAC with define:${typeof define}`);
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    console.log(`Loading RAC with module:${typeof module}`);
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    console.log(`Loading RAC into root:${typeof root}`);
    root.makeRac = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // Ruler and Compass - 0.9.9.x
  let version = '0.9.9.x';

  class Rac {

    constructor (p5Obj) {
      this.version = version;

      // TODO: temporary holder for P5, figure out if an abstraction is needed
      this.p5 = p5Obj;

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

      // Error identifiers
      this.Error = {
        abstractFunctionCalled: "Abstract function called",
        invalidParameterCombination: "Invalid parameter combination",
        invalidObjectConfiguration: "Invalid object configuration",
        invalidObjectToConvert: "Invalid object to convert",
        invalidObjectToDraw: "Invalid object to draw"}
    }

  }


  let makeRac = function makeRac(p5Obj) {
    let rac = new Rac(p5Obj);

    // Draws using p5js canvas
    rac.Drawer = class RacDrawer {

      static Routine = class RacDrawerRoutine {
        constructor (classObj, drawElement) {
          this.classObj = classObj;
          this.drawElement = drawElement
          this.style = null;

          // Options
          this.requiresPushPop = false;
        }
      }

      constructor() {
        this.routines = [];
        this.enabled = true;
        this.debugStyle = null;
      }

      // Adds a routine for the given class. The `drawElement` function will be
      // called passing the element to be drawn as `this`.
      setDrawFunction(classObj, drawElement) {
        let index = this.routines
          .findIndex(routine => routine.classObj === classObj);

        let routine;
        if (index === -1) {
          routine = new rac.Drawer.Routine(classObj, drawElement);
        } else {
          routine = this.routines[index];
          routine.drawElement = drawElement;
          // Delete routine
          this.routine.splice(index, 1);
        }

        this.routines.push(routine);
      }

      setDrawOptions(classObj, options) {
        let routine = this.routines
          .find(routine => routine.classObj === classObj);
        if (routine === undefined) {
          console.log(`Cannot find routine for class - className:${classObj.name}`);
          throw rac.Error.invalidObjectConfiguration
        }

        if (options.requiresPushPop !== undefined) {
          routine.requiresPushPop = options.requiresPushPop;
        }
      }

      setClassStyle(classObj, style) {
        let routine = this.routines
          .find(routine => routine.classObj === classObj);
        if (routine === undefined) {
          console.log(`Cannot find routine for class - className:${classObj.name}`);
          throw rac.Error.invalidObjectConfiguration
        }

        routine.style = style;
      }

      drawElement(element, style = null) {
        let routine = this.routines
          .find(routine => element instanceof routine.classObj);
        if (routine === undefined) {
          console.trace(`Cannot draw element - element-type:${rac.typeName(element)}`);
          throw rac.Error.invalidObjectToDraw;
        }

        if (routine.requiresPushPop === true
          || style !== null
          || routine.style !== null)
        {
          rac.p5.push();
          if (routine.style !== null) {
            routine.style.apply();
          }
          if (style !== null) {
            style.apply();
          }
          routine.drawElement.call(element);
          rac.p5.pop();
        } else {
          // No push-pull
          routine.drawElement.call(element);
        }
      }

      debugElement(element) {
        this.drawElement(element, this.debugStyle);
      }

    }

    rac.defaultDrawer = new rac.Drawer();



    // Container for prototype functions
    rac.protoFunctions = {};

    rac.protoFunctions.draw = function(style = null){
      rac.defaultDrawer.drawElement(this, style);
      return this;
    };

    rac.protoFunctions.debug = function(){
      rac.defaultDrawer.debugElement(this);
      return this;
    };


    rac.stack = [];

    rac.stack.peek = function() {
      return rac.stack[rac.stack.length - 1];
    }

    rac.protoFunctions.push = function() {
      rac.stack.push(this);
      return this;
    }

    rac.protoFunctions.pop = function() {
      return rac.stack.pop();
    }

    rac.protoFunctions.peek = function() {
      return rac.stack.peek();
    }

    // TODO: shape and composite should be stacks, so that several can be
    // started in different contexts
    rac.currentShape = null;
    rac.currentComposite = null;

    rac.popShape = function() {
      let shape = rac.currentShape;
      rac.currentShape = null;
      return shape;
    }

    rac.popComposite = function() {
      let composite = rac.currentComposite;
      rac.currentComposite = null;
      return composite;
    }

    rac.protoFunctions.attachToShape = function() {
      if (rac.currentShape === null) {
        rac.currentShape = new rac.Shape();
      }

      this.attachTo(rac.currentShape);
      return this;
    }

    rac.protoFunctions.popShape = function() {
      return rac.popShape();
    }

    rac.protoFunctions.popShapeToComposite = function() {
      let shape = rac.popShape();
      shape.attachToComposite();
      return this;
    }

    rac.protoFunctions.attachToComposite = function() {
      if (rac.currentComposite === null) {
        rac.currentComposite = new rac.Composite();
      }

      this.attachTo(rac.currentComposite);
      return this;
    }

    rac.protoFunctions.popComposite = function() {
      return rac.popComposite();
    }

    rac.protoFunctions.attachTo = function(someComposite) {
      if (someComposite instanceof rac.Composite) {
        someComposite.add(this);
        return this;
      }

      if (someComposite instanceof rac.Shape) {
        someComposite.addOutline(this);
        return this;
      }

      console.trace(`Cannot attachTo composite - someComposite-type:${rac.typeName(someComposite)}`);
      throw rac.Error.invalidObjectToConvert;
    };

    rac.setupProtoFunctions = function(classObj) {
      classObj.prototype.draw                = rac.protoFunctions.draw;
      classObj.prototype.debug               = rac.protoFunctions.debug;
      classObj.prototype.push                = rac.protoFunctions.push;
      classObj.prototype.pop                 = rac.protoFunctions.pop;
      classObj.prototype.peek                = rac.protoFunctions.peek;
      classObj.prototype.attachTo            = rac.protoFunctions.attachTo;
      classObj.prototype.attachToShape       = rac.protoFunctions.attachToShape;
      classObj.prototype.popShape            = rac.protoFunctions.popShape;
      classObj.prototype.popShapeToComposite = rac.protoFunctions.popShapeToComposite;
      classObj.prototype.attachToComposite   = rac.protoFunctions.attachToComposite;
      classObj.prototype.popComposite        = rac.protoFunctions.popComposite;
    }


    // Returns the constructor name of `obj`, or its type name.
    rac.typeName = function(obj) {
      return obj.constructor.name ?? typeof obj
    };


    rac.Color = class RacColor {

      constructor(r, g, b, alpha = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
      }

      static fromRgba(r, g, b, a = 255) {
        return new rac.Color(r/255, g/255, b/255, a/255);
      }

      copy() {
        return new rac.Color(this.r, this.g, this.b, this.alpha);
      }

      fill() {
        return new rac.Fill(this);
      }

      stroke(weight = 1) {
        return new rac.Stroke(this, weight);
      }

      applyBackground() {
        rac.p5.background(this.r * 255, this.g * 255, this.b * 255);
      }

      applyFill = function() {
        rac.p5.fill(this.r * 255, this.g * 255, this.b * 255, this.alpha * 255);
      }

      withAlpha(alpha) {
        let copy = this.copy();
        copy.alpha = alpha;
        return copy;
      }

      withAlphaRatio(ratio) {
        let copy = this.copy();
        copy.alpha = this.color.alpha * ratio;
        return copy;
      }

    }

    rac.Color.black   = new rac.Color(0, 0, 0);
    rac.Color.red     = new rac.Color(1, 0, 0);
    rac.Color.green   = new rac.Color(0, 1, 0);
    rac.Color.blue    = new rac.Color(0, 0, 1);
    rac.Color.yellow  = new rac.Color(1, 1, 0);
    rac.Color.magenta = new rac.Color(1, 0, 1);
    rac.Color.cyan    = new rac.Color(0, 1, 1);
    rac.Color.white   = new rac.Color(1, 1, 1);


    rac.Stroke = class RacStroke {

      constructor(color = null, weight = 1) {
        this.color = color;
        this.weight = weight;
      }

      copy() {
        let colorCopy = null;
        if (this.color !== null) {
          colorCopy = this.color.copy();
        }
        return new rac.Stroke(colorCopy, this.weight);
      }

      withWeight(weight) {
        return new rac.Stroke(this.color, weight);
      }

      withAlpha(alpha) {
        if (this.color === null) {
          return new rac.Stroke(null, this.weight);
        }

        let newColor = this.color.withAlpha(alpha);
        return new rac.Stroke(newColor, this.weight);
      }

      apply() {
        if (this.color === null) {
          rac.p5.noStroke();
          return;
        }

        rac.p5.stroke(
          this.color.r * 255,
          this.color.g * 255,
          this.color.b * 255,
          this.color.alpha * 255);
        rac.p5.strokeWeight(this.weight);
      }

      styleWithFill(fill) {
        return new rac.Style(this, fill);
      }

    }

    rac.Stroke.none = new rac.Stroke(null);


    rac.Fill = class RacFill {

      constructor(color = null) {
        this.color = color;
      }

      apply() {
        if (this.color === null) {
          rac.p5.noFill();
          return;
        }

        this.color.applyFill();
      }

      styleWithStroke(stroke) {
        return new rac.Style(stroke, this);
      }

    }

    rac.Fill.none = new rac.Fill(null);


    rac.Style = class RacStyle {

      constructor(stroke = null, fill = null) {
        this.stroke = stroke;
        this.fill = fill;
      }

      apply() {
        if (this.stroke !== null) {
          this.stroke.apply();
        }
        if (this.fill !== null) {
          this.fill.apply();
        }
      }

      applyToClass(classObj) {
        rac.defaultDrawer.setClassStyle(classObj, this);
      }

      withStroke(stroke) {
        return new rac.Style(stroke, this.fill);
      }

      withFill(fill) {
        return new rac.Style(this.stroke, fill);
      }

    }


    rac.Angle = function RacAngle(turn) {
      this.set(turn);
    };

    rac.Angle.from = function(something) {
      if (something instanceof rac.Angle) {
        return something;
      }
      if (typeof something === "number") {
        return new rac.Angle(something);
      }
      if (something instanceof rac.Segment) {
        return something.angle();
      }

      console.trace(`Cannot convert to rac.Angle - something-type:${rac.typeName(something)}`);
      throw rac.Error.invalidObjectToConvert;
    }

    rac.Angle.fromRadians = function(radians) {
      return new rac.Angle(radians / rac.p5.TWO_PI);
    };

    rac.Angle.fromPoint = function(point) {
      return rac.Angle.fromRadians(Math.atan2(point.y, point.x));
    };

    rac.Angle.fromSegment = function(segment) {
      return segment.start.angleToPoint(segment.end);
    };

    rac.Angle.prototype.set = function(turn) {
      this.turn = turn % 1;
      if (this.turn < 0) {
        this.turn = (this.turn + 1) % 1;
      }
      return this;
    };

    // If `turn`` is zero returns 1 instead, otherwise returns `turn`.
    rac.Angle.prototype.turnOne = function() {
      if (this.turn === 0) { return 1; }
      return this.turn;
    }

    rac.Angle.prototype.add = function(someAngle) {
      let other = rac.Angle.from(someAngle);
      return new rac.Angle(this.turn + other.turn);
    };

    rac.Angle.prototype.substract = function(someAngle) {
      let other = rac.Angle.from(someAngle);
      return new rac.Angle(this.turn - other.turn);
    };

    rac.Angle.prototype.sub = function(someAngle) {
      return this.substract(someAngle);
    };

    // Returns the equivalent to `someAngle` shifted to have `this` as the
    // origin, in the `clockwise` orientation.
    //
    // For angle at `0.1`, `shift(0.5)` will return a `0.6` angle.
    // For a clockwise orientation, equivalent to `this + someAngle`.
    rac.Angle.prototype.shift = function(someAngle, clockwise = true) {
      let angle = rac.Angle.from(someAngle);
      return clockwise
        ? this.add(angle)
        : this.sub(angle);
    };

    // Returns the equivalent of `this` when `someOrigin` is considered the
    // origin, in the `clockwise` orientation.
    rac.Angle.prototype.shiftToOrigin = function(someOrigin, clockwise) {
      let origin = rac.Angle.from(someOrigin);
      return origin.shift(this, clockwise);
    };

    rac.Angle.prototype.mult = function(factor) {
      return new rac.Angle(this.turn * factor);
    };

    // If `turn` is zero multiplies by 1, otherwise multiplies by `turn`.
    rac.Angle.prototype.multOne = function(factor) {
      return new rac.Angle(this.turnOne() * factor);
    };

    // Returns `this` adding half a turn.
    rac.Angle.prototype.inverse = function() {
      return this.add(rac.Angle.inverse);
    };

    rac.Angle.prototype.negative = function() {
      return new rac.Angle(-this.turn);
    };

    rac.Angle.prototype.perpendicular = function(clockwise = true) {
      return this.shift(rac.Angle.square, clockwise);
    };

    // Returns an Angle that represents the distance from `this` to `someAngle`
    // traveling in the `clockwise` orientation.
    rac.Angle.prototype.distance = function(someAngle, clockwise = true) {
      let other = rac.Angle.from(someAngle);
      let distance = other.substract(this);
      return clockwise
        ? distance
        : distance.negative();
    };

    rac.Angle.prototype.radians = function() {
      return this.turn * rac.p5.TWO_PI;
    };

    rac.Angle.prototype.degrees = function() {
      return this.turn * 360;
    };

    rac.Angle.zero =    new rac.Angle(0.0);
    rac.Angle.square =  new rac.Angle(1/4);
    rac.Angle.inverse = new rac.Angle(1/2);

    rac.Angle.half =    new rac.Angle(1/2);
    rac.Angle.quarter = new rac.Angle(1/4);
    rac.Angle.eighth =  new rac.Angle(1/8);

    rac.Angle.n = new rac.Angle(3/4);
    rac.Angle.e = new rac.Angle(0/4);
    rac.Angle.s = new rac.Angle(1/4);
    rac.Angle.w = new rac.Angle(2/4);

    rac.Angle.ne = rac.Angle.n.add(1/8);
    rac.Angle.se = rac.Angle.e.add(1/8);
    rac.Angle.sw = rac.Angle.s.add(1/8);
    rac.Angle.nw = rac.Angle.w.add(1/8);

    rac.Angle.nne = rac.Angle.ne.add(-1/16);
    rac.Angle.ene = rac.Angle.ne.add(+1/16);

    rac.Angle.ese = rac.Angle.se.add(-1/16);
    rac.Angle.sse = rac.Angle.se.add(+1/16);

    rac.Angle.ssw = rac.Angle.sw.add(-1/16);
    rac.Angle.wsw = rac.Angle.sw.add(+1/16);

    rac.Angle.wnw = rac.Angle.nw.add(-1/16);
    rac.Angle.nnw = rac.Angle.nw.add(+1/16);

    rac.Angle.right = rac.Angle.e;
    rac.Angle.down = rac.Angle.s;
    rac.Angle.left = rac.Angle.w;
    rac.Angle.up = rac.Angle.n;


    rac.Point = class RacPoint{

      constructor(x, y) {
        this.x = x;
        this.y = y;
      }

      vertex() {
        rac.p5.vertex(this.x, this.y);
        return this;
      }

      text(string, format, rotation = rac.Angle.zero) {
        return new rac.Text(string, format, this, rotation);
      }

      withX(newX) {
        return new rac.Point(newX, this.y);
      }

      withY(newY) {
        return new rac.Point(this.x, newY);
      }

      // Returns a segment that is tangent to `arc` in the `clockwise`
      // orientation from the segment formed by `this` and `arc.center`. The
      // returned segment has `this` as `start` and `end` is a point in `arc`.
      // `arc` is considered as a complete circle.
      // Returns `null` if `this` is inside `arc` and thus no tangent segment
      // is possible.
      segmentTangentToArc(arc, clockwise = true) {
        let hypotenuse = this.segmentToPoint(arc.center);
        let ops = arc.radius;

        let angleSine = ops / hypotenuse.length();
        if (angleSine > 1) {
          return null;
        }

        let angleRadians = Math.asin(angleSine);
        let opsAngle = rac.Angle.fromRadians(angleRadians);
        let shiftedOpsAngle = hypotenuse.angle().shift(opsAngle, clockwise);

        let end = arc.pointAtAngle(shiftedOpsAngle.perpendicular(clockwise));
        return this.segmentToPoint(end);
      }



      static mouse() {
        return new rac.Point(rac.p5.mouseX, rac.p5.mouseY);
      }

    }


    rac.defaultDrawer.setDrawFunction(rac.Point, function() {
      rac.p5.point(this.x, this.y);
    });

    rac.setupProtoFunctions(rac.Point);


    rac.Point.prototype.add = function(other, y = undefined) {
      if (other instanceof rac.Point && y === undefined) {
        return new rac.Point(
        this.x + other.x,
        this.y + other.y);
      }

      if (typeof other === "number" && typeof y === "number") {
        let x = other;
        return new rac.Point(
          this.x + x,
          this.y + y);
      }

      console.trace(`Invalid parameter combination - other-type:${rac.typeName(other)} y-type:${rac.typeName(y)}`);
      throw rac.Error.invalidParameterCombination;
    };

    rac.Point.prototype.substract = function(other, y = undefined) {
      if (other instanceof rac.Point && y === undefined) {
        return new rac.Point(
        this.x - other.x,
        this.y - other.y);
      }

      if (typeof other === "number" && typeof y === "number") {
        let x = other;
        return new rac.Point(
          this.x - x,
          this.y - y);
      }

      console.trace(`Invalid parameter combination - other-type:${rac.typeName(other)} y-type:${rac.typeName(y)}`);
      throw rac.Error.invalidParameterCombination;
    };


    rac.Point.prototype.sub = function(other, y = undefined) {
      this.substract(other, y);
    };

    rac.Point.prototype.addX = function(x) {
      return new rac.Point(
        this.x + x,
        this.y);
    };

    rac.Point.prototype.addY = function(y) {
      return new rac.Point(
        this.x,
        this.y + y);
    };


    rac.Point.prototype.negative = function() {
      return new rac.Point(-this.x, -this.y);
    };

    rac.Point.prototype.angleToPoint = function(other) {
      let offset = other.add(this.negative());
      return rac.Angle.fromPoint(offset);
    };

    rac.Point.prototype.distanceToPoint = function(other) {
      let x = Math.pow((other.x - this.x), 2);
      let y = Math.pow((other.y - this.y), 2);
      return Math.sqrt(x+y);
    };

    rac.Point.prototype.pointPerpendicular = function(clockwise = true) {
      return clockwise
        ? new rac.Point(-this.y, this.x)
        : new rac.Point(this.y, -this.x);
    };

    rac.Point.prototype.pointToAngle = function(someAngle, distance) {
      let angle = rac.Angle.from(someAngle);
      let distanceX = distance * Math.cos(angle.radians());
      let distanceY = distance * Math.sin(angle.radians());
      return new rac.Point(this.x + distanceX, this.y + distanceY);
    };

    rac.Point.prototype.segmentToPoint = function(point) {
      return new rac.Segment(this, point);
    };

    rac.Point.prototype.segmentToAngle = function(someAngle, distance) {
      let end = this.pointToAngle(someAngle, distance);
      return new rac.Segment(this, end);
    };

    rac.Point.prototype.segmentToAngleToIntersectionWithSegment = function(someAngle, segment) {
      let unit = this.segmentToAngle(someAngle, 1);
      return unit.segmentToIntersectionWithSegment(segment);
    }

    rac.Point.prototype.segmentPerpendicularToSegment = function(segment) {
      let projectedPoint = segment.projectedPoint(this);
      return this.segmentToPoint(projectedPoint);
    };

    rac.Point.prototype.arc = function(radius, start = rac.Angle.zero, end = start, clockwise = true) {
      return new rac.Arc(this, radius, start, end, clockwise);
    };


    rac.Point.zero = new rac.Point(0, 0);
    rac.Point.origin = rac.Point.zero;



    rac.Text = class RacText {

      constructor(string, format, point) {
        this.string = string;
        this.format = format;
        this.point = point;
      }

      static Format = class RacTextFormat {

        static defaultSize = 15;

        static horizontal = {
          left: "left",
          center: "horizontalCenter",
          right: "right"
        };

        static vertical = {
          top: "top",
          bottom: "bottom",
          center: "verticalCenter",
          baseline: "baseline"
        };

        constructor(
          horizontal, vertical,
          font = null,
          rotation = rac.Angle.zero,
          size = rac.Text.Format.defaultSize)
        {
          this.horizontal = horizontal;
          this.vertical = vertical;
          this.font = font;
          this.rotation = rotation;
          this.size = size;
        }

        apply(point) {
          let hAlign;
          let hOptions = rac.Text.Format.horizontal;
          switch (this.horizontal) {
            case hOptions.left:   hAlign = LEFT;   break;
            case hOptions.center: hAlign = CENTER; break;
            case hOptions.right:  hAlign = RIGHT;  break;
            default:
              console.trace(`Invalid horizontal configuration - horizontal:${this.horizontal}`);
              throw rac.Error.invalidObjectConfiguration;
          }

          let vAlign;
          let vOptions = rac.Text.Format.vertical;
          switch (this.vertical) {
            case vOptions.top:      vAlign = TOP;      break;
            case vOptions.bottom:   vAlign = BOTTOM;   break;
            case vOptions.center:   vAlign = CENTER;   break;
            case vOptions.baseline: vAlign = BASELINE; break;
            default:
              console.trace(`Invalid vertical configuration - vertical:${this.vertical}`);
              throw rac.Error.invalidObjectConfiguration;
          }

          // Text properties
          textAlign(hAlign, vAlign);
          textSize(this.size);
          if (this.font !== null) {
            textFont(this.font);
          }

          // Positioning
          translate(point.x, point.y);
          if (this.rotation.turn != 0) {
            rotate(this.rotation.radians());
          }
        }

      }

    }

    rac.defaultDrawer.setDrawFunction(rac.Text, function() {
      this.format.apply(this.point);
      rac.p5.text(this.string, 0, 0);
    });
    rac.defaultDrawer.setDrawOptions(rac.Text, {requiresPushPop: true});

    rac.setupProtoFunctions(rac.Text);


    rac.Segment = class RacSegment {

      constructor(start, end) {
        this.start = start;
        this.end = end;
      }

      copy() {
        return new rac.Segment(this.start, this.end);
      }

      vertex() {
        this.start.vertex();
        this.end.vertex();
        return this;
      }

      withAngleAdd(someAngle) {
        let newAngle = this.angle().add(someAngle);
        let newEnd = this.start.pointToAngle(newAngle, this.length());
        return new rac.Segment(this.start, newEnd);
      }

      withStartExtended(length) {
        let newStart = this.reverse().nextSegmentWithLength(length).end;
        return new rac.Segment(newStart, this.end);
      }

      withEndExtended(length) {
        let newEnd = this.nextSegmentWithLength(length).end;
        return new rac.Segment(this.start, newEnd);
      }

      // Returns `value` clamped to the given insets from zero and the length
      // of the segment.
      // TODO: invalid range could return a value centered in the insets! more visually congruent
      // If the `min/maxInset` values result in a contradictory range, the
      // returned value will comply with `minInset`.
      clampToLengthInsets(value, startInset = 0, endInset = 0) {
        let clamped = value;
        clamped = Math.min(clamped, this.length() - endInset);
        // Comply at least with minClamp
        clamped = Math.max(clamped, startInset);
        return clamped;
      }

      projectedPoint(point) {
        let perpendicular = this.angle().perpendicular();
        return point.segmentToAngle(perpendicular, rac.arbitraryLength)
          .pointAtIntersectionWithSegment(this);
      }

      // Returns the length of a segment from `start` to `point` being
      // projected in the segment. The returned length may be negative if the
      // projected point falls behind `start`.
      lengthToProjectedPoint(point) {
        let projected = this.projectedPoint(point);
        let segment = this.start.segmentToPoint(projected);

        if (segment.length() < rac.equalityThreshold) {
          return 0;
        }

        let angleDiff = this.angle().substract(segment.angle());
        if (angleDiff.turn <= 1/4 || angleDiff.turn > 3/4) {
          return segment.length();
        } else {
          return - segment.length();
        }
      }

      // Returns `true` if the given point is located clockwise of the segment,
      // or `false` if located counter-clockwise.
      pointOrientation(point) {
        let angle = this.start.angleToPoint(point);
        let arcLength = angle.substract(this.angle());
        // [0 to 0.5) is considered clockwise
        // [0.5, 1) is considered counter-clockwise
        return arcLength.turn < 0.5;
      }

    }

    rac.defaultDrawer.setDrawFunction(rac.Segment, function() {
      rac.p5.line(
        this.start.x, this.start.y,
        this.end.x,   this.end.y);
    });

    rac.setupProtoFunctions(rac.Segment);

    rac.Segment.prototype.withStart = function(newStart) {
      return new rac.Segment(newStart, this.end);
    };

    rac.Segment.prototype.withEnd = function(newEnd) {
      return new rac.Segment(this.start, newEnd);
    };

    rac.Segment.prototype.withLength = function(newLength) {
      let newEnd = this.start.pointToAngle(this.angle(), newLength);
      return new rac.Segment(this.start, newEnd);
    };

    rac.Segment.prototype.pointAtBisector = function() {
      return new rac.Point(
        this.start.x + (this.end.x - this.start.x) /2,
        this.start.y + (this.end.y - this.start.y) /2);
    };

    rac.Segment.prototype.length = function() {
      return this.start.distanceToPoint(this.end);
    };

    rac.Segment.prototype.angle = function() {
      return rac.Angle.fromSegment(this);
    };

    // Returns the slope of the segment, or `null` if the segment is part of a
    // vertical line.
    rac.Segment.prototype.slope = function() {
      let dx = this.end.x - this.start.x;
      let dy = this.end.y - this.start.y;
      if (Math.abs(dx) < rac.equalityThreshold) {
        if(Math.abs(dy) < rac.equalityThreshold) {
          // Segment with equal end and start returns a default angle of 0
          // Equivalent slope is 0
          return 0;
        }
        return null;
      }

      return dy / dx;
    };

    // Returns the y-intercept, or `null` if the segment is part of a
    // vertical line.
    rac.Segment.prototype.yIntercept = function() {
      let slope = this.slope();
      if (slope === null) {
        return null;
      }
      // y = mx + b
      // y - mx = b
      return this.start.y - slope * this.start.x;
    };


    rac.Segment.prototype.pointAtX = function(x) {
      let slope = this.slope();
      if (slope === null) {
        return null;
      }

      let y = slope*x + this.yIntercept();
      return new rac.Point(x, y);
    }

    rac.Segment.prototype.reverseAngle = function() {
      return rac.Angle.fromSegment(this).inverse();
    };

    rac.Segment.prototype.reverse = function() {
      return new rac.Segment(this.end, this.start);
    };

    // Translates the segment by the entire `point`, or by the given `x` and
    // `y` components.
    rac.Segment.prototype.translate = function(point, y = undefined) {
      if (point instanceof rac.Point && y === undefined) {
        return new rac.Segment(
          this.start.add(point),
          this.end.add(point));
      }

      if (typeof point === "number" && typeof y === "number") {
        let x = point;
        return new rac.Segment(
          this.start.add(x, y),
          this.end.add(x, y));
      }

      console.trace(`Invalid parameter combination - point-type:${rac.typeName(point)} y-type:${rac.typeName(y)}`);
      throw rac.Error.invalidParameterCombination;
    }

    rac.Segment.prototype.translateToStart = function(newStart) {
      let offset = newStart.substract(this.start);
      return new rac.Segment(this.start.add(offset), this.end.add(offset));
    };

    rac.Segment.prototype.translateToAngle = function(someAngle, distance) {
      let angle = rac.Angle.from(someAngle);
      let offset = rac.Point.zero.pointToAngle(angle, distance);
      return new rac.Segment(this.start.add(offset), this.end.add(offset));
    };

    rac.Segment.prototype.translatePerpendicular = function(distance, clockwise = true) {
      let perpendicular = this.angle().perpendicular(clockwise);
      return this.translateToAngle(perpendicular, distance);
    };

    // Returns the intersecting point of `this` and `other`. Both segments are
    // considered lines without endpoints.
    rac.Segment.prototype.pointAtIntersectionWithSegment = function(other) {
      // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
      let a = this.slope();
      let b = other.slope();
      if (a === b) {
        // Parallel lines, no intersection
        return null;
      }

      let c = this.yIntercept();
      let d = other.yIntercept();

      if (a === null) { return other.pointAtX(this.start.x); }
      if (b === null) { return this.pointAtX(other.start.x); }

      let x = (d - c) / (a - b);
      let y = a * x + c;
      return new rac.Point(x, y);
    };

    rac.Segment.prototype.pointAtLength = function(length) {
      return this.start.pointToAngle(this.angle(), length);
    };

    rac.Segment.prototype.pointAtLengthRatio = function(lengthRatio) {
      let newLength = this.length() * lengthRatio;
      return this.start.pointToAngle(this.angle(), newLength);
    };

    // Returns a new segment from `start` to `pointAtBisector`.
    rac.Segment.prototype.segmentToBisector = function() {
      return new rac.Segment(this.start, this.pointAtBisector());
    };

    // TODO: rename to withLengthRatio, when there is a chance to test
    // Returns a new segment from `start` to a length determined by
    // `ratio*length`.
    rac.Segment.prototype.segmentWithRatioOfLength = function(ratio) {
      return this.start.segmentToAngle(this.angle(), this.length() * ratio);
    };

    // Returns a new segment from `end` with the given `length` with the same
    // angle as `this`.
    rac.Segment.prototype.nextSegmentWithLength = function(length) {
      return this.end.segmentToAngle(this.angle(), length);
    };

    // Returns a new segment from `end` to the given `nextEnd`.
    rac.Segment.prototype.nextSegmentToPoint = function(nextEnd) {
      return new rac.Segment(this.end, nextEnd);
    }

    // Returns a new segment from `end` to the given `someAngle` and `distance`.
    rac.Segment.prototype.nextSegmentToAngle = function(someAngle, distance) {
      return this.end.segmentToAngle(someAngle, distance);
    }


    // Returns a new segment from `this.end`, with the same length, that is
    // perpendicular to `this` in the `clockwise` orientation.
    rac.Segment.prototype.nextSegmentPerpendicular = function(clockwise = true) {
      let offset = this.start.add(this.end.negative());
      let newEnd = this.end.add(offset.pointPerpendicular(clockwise));
      return this.end.segmentToPoint(newEnd);
    };

    // Returns an complete circle Arc using this segment `start` as center,
    // `length()` as radiusm, and `angle()` as start and end angles.
    rac.Segment.prototype.arc = function(clockwise = true) {
      let angle = this.angle();
      return new rac.Arc(
        this.start, this.length(),
        angle, angle,
        clockwise);
    };

    // Returns an Arc using this segment `start` as center, `length()` as
    // radius, starting from the `angle()` to the given angle and orientation.
    rac.Segment.prototype.arcWithEnd = function(
      someAngleEnd = this.angle(),
      clockwise = true)
    {
      let arcEnd = rac.Angle.from(someAngleEnd);
      let arcStart = rac.Angle.fromSegment(this);
      return new rac.Arc(
        this.start, this.length(),
        arcStart, arcEnd,
        clockwise);
    };

    // Returns an Arc using this segment `start` as center, `length()` as
    // radius, starting from the `angle()` to the arc distance of the given
    // angle and orientation.
    rac.Segment.prototype.arcWithArcLength = function(someAngleArcLength, clockwise = true) {
      let arcLength = rac.Angle.from(someAngleArcLength);
      let arcStart = this.angle();
      let arcEnd = arcStart.shift(arcLength, clockwise);

      return new rac.Arc(
        this.start, this.length(),
        arcStart, arcEnd,
        clockwise);
    };

    // Returns a segment from `this.start` to the intersection between `this`
    // and `other`.
    rac.Segment.prototype.segmentToIntersectionWithSegment = function(other) {
      let end = this.pointAtIntersectionWithSegment(other);
      if (end === null) {
        return null;
      }
      return new rac.Segment(this.start, end);
    };

    // TODO: rename maybe to nextSegment? reevaluate "relative" vs shift
    rac.Segment.prototype.segmentToRelativeAngle = function(
      relativeAngle, distance, clockwise = true)
    {
      let angle = this.reverseAngle().shift(relativeAngle, clockwise);
      return this.end.segmentToAngle(angle, distance);
    };

    rac.Segment.prototype.oppositeWithHyp = function(hypotenuse, clockwise = true) {
      // cos = ady / hyp
      // acos can error if hypotenuse is smaller that length
      let radians = Math.acos(this.length() / hypotenuse);
      let angle = rac.Angle.fromRadians(radians);

      let hypSegment = this.reverse()
        .segmentToRelativeAngle(angle, hypotenuse, !clockwise);
      return this.end.segmentToPoint(hypSegment.end);
    };

    // Returns a new segment that starts from `pointAtBisector` in the given
    // `clockwise` orientation.
    rac.Segment.prototype.segmentFromBisector = function(length, clockwise = true) {
      let angle = clockwise
        ? this.angle().add(rac.Angle.square)
        : this.angle().add(rac.Angle.square.negative());
      return this.pointAtBisector().segmentToAngle(angle, length);
    };

    rac.Segment.prototype.bezierCentralAnchor = function(distance, clockwise = true) {
      let bisector = this.segmentFromBisector(distance, clockwise);
      return new rac.Bezier(
        this.start, bisector.end,
        bisector.end, this.end);
    };


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


    rac.defaultDrawer.setDrawFunction(rac.Arc, function() {
      if (this.isCircle()) {
        let startRad = this.start.radians();
        let endRad = startRad + (Math.PI * 2);
        rac.p5.arc(
          this.center.x, this.center.y,
          this.radius * 2, this.radius * 2,
          startRad, endRad);
        return;
      }

      let start = this.start;
      let end = this.end;
      if (!this.clockwise) {
        start = this.end;
        end = this.start;
      }

      rac.p5.arc(
        this.center.x, this.center.y,
        this.radius * 2, this.radius * 2,
        start.radians(), end.radians());
    });

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
      let tangent = this.radius * (4/3) * Math.tan(rac.p5.PI/(parsPerTurn*2));

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

    rac.defaultDrawer.setDrawFunction(rac.Bezier, function() {
      rac.p5.bezier(
        this.start.x, this.start.y,
        this.startAnchor.x, this.startAnchor.y,
        this.endAnchor.x, this.endAnchor.y,
        this.end.x, this.end.y);
    });

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
      rac.p5.bezierVertex(
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

    rac.defaultDrawer.setDrawFunction(rac.Composite, function() {
      this.sequence.forEach(item => item.draw());
    });

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

    rac.defaultDrawer.setDrawFunction(rac.Shape, function () {
      rac.p5.beginShape();
      this.outline.vertex();

      if (this.contour.isNotEmpty()) {
        rac.p5.beginContour();
        this.contour.vertex();
        rac.p5.endContour();
      }
      rac.p5.endShape();
    });

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
      if (rac.p5.mouseIsPressed) {
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

  makeRac.version = version;
  return makeRac

}));


