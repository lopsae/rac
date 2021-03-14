'use strict';



module.exports = function makeP5Drawer(rac) {

  // Drawer that uses a P5 instance for all drawing operations.
  class RacP5Drawer {

    constructor(rac, p5){
      this.rac = rac;
      this.p5 = p5;
      this.drawRoutines = [];
      this.debugRoutines = [];
      this.applyRoutines = [];

      // Style used for debug drawing, if null thise style already applied
      // is used.
      this.debugStyle = null;
      // Style used for text for debug drawing, if null the style already
      // applied is used.
      this.debugTextStyle = null;
      // Radius of point markers for debug drawing.
      this.debugTextOptions = {
        font: 'monospace',
        size: rac.Text.Format.defaultSize,
        toFixed: 2
      };

      this.debugPointRadius = 4;
      // Radius of main visual elements for debug drawing.
      this.debugRadius = 22;

      this.setupAllDrawFunctions(rac);
      this.setupAllDebugFunctions(rac);
      this.setupAllApplyFunctions(rac);
    }

    // Adds a DrawRoutine for the given class.
    setDrawFunction(classObj, drawFunction) {
      let index = this.drawRoutines
        .findIndex(routine => routine.classObj === classObj);

      let routine;
      if (index === -1) {
        routine = new DrawRoutine(classObj, drawFunction);
      } else {
        routine = this.drawRoutines[index];
        routine.drawFunction = drawFunction;
        // Delete routine
        this.drawRoutines.splice(index, 1);
      }

      this.drawRoutines.push(routine);
    }

    setDrawOptions(classObj, options) {
      let routine = this.drawRoutines
        .find(routine => routine.classObj === classObj);
      if (routine === undefined) {
        console.log(`Cannot find routine for class - className:${classObj.name}`);
        throw rac.Error.invalidObjectConfiguration
      }

      if (options.requiresPushPop !== undefined) {
        routine.requiresPushPop = options.requiresPushPop;
      }
    }

    setClassDrawStyle(classObj, style) {
      let routine = this.drawRoutines
        .find(routine => routine.classObj === classObj);
      if (routine === undefined) {
        console.log(`Cannot find routine for class - className:${classObj.name}`);
        throw rac.Error.invalidObjectConfiguration
      }

      routine.style = style;
    }

    // Adds a DebugRoutine for the given class.
    setDebugFunction(classObj, debugFunction) {
      let index = this.debugRoutines
        .findIndex(routine => routine.classObj === classObj);

      let routine;
      if (index === -1) {
        routine = new DebugRoutine(classObj, debugFunction);
      } else {
        routine = this.debugRoutines[index];
        routine.debugFunction = debugFunction;
        // Delete routine
        this.debugRoutines.splice(index, 1);
      }

      this.debugRoutines.push(routine);
    }

    // Adds a ApplyRoutine for the given class.
    setApplyFunction(classObj, applyFunction) {
      let index = this.applyRoutines
        .findIndex(routine => routine.classObj === classObj);

      let routine;
      if (index === -1) {
        routine = new ApplyRoutine(classObj, applyFunction);
      } else {
        routine = this.applyRoutines[index];
        routine.drawFunction = drawFunction;
        // Delete routine
        this.applyRoutines.splice(index, 1);
      }

      this.applyRoutines.push(routine);
    }

    drawObject(object, style = null) {
      let routine = this.drawRoutines
        .find(routine => object instanceof routine.classObj);
      if (routine === undefined) {
        console.trace(`Cannot draw object - object-type:${rac.typeName(object)}`);
        throw rac.Error.invalidObjectToDraw;
      }

      if (routine.requiresPushPop === true
        || style !== null
        || routine.style !== null)
      {
        this.p5.push();
        if (routine.style !== null) {
          routine.style.apply();
        }
        if (style !== null) {
          style.apply();
        }
        routine.drawFunction(this, object);
        this.p5.pop();
      } else {
        // No push-pull
        routine.drawFunction(this, object);
      }
    }

    debugNumber(number) {
      return number.toFixed(this.debugTextOptions.toFixed);
    }

    debugObject(object, drawsText) {
      let routine = this.debugRoutines
        .find(routine => object instanceof routine.classObj);
      if (routine === undefined) {
        // No routine, just draw object with debug style
        this.drawObject(object, this.debugStyle);
        return;
      }

      if (this.debugStyle !== null) {
        this.p5.push();
        this.debugStyle.apply();
        routine.debugFunction(this, object, drawsText);
        this.p5.pop();
      } else {
        routine.debugFunction(this, object, drawsText);
      }
    }

    applyObject(object) {
      let routine = this.applyRoutines
        .find(routine => object instanceof routine.classObj);
      if (routine === undefined) {
        console.trace(`Cannot apply object - object-type:${rac.typeName(object)}`);
        throw rac.Error.invalidObjectToApply;
      }

      routine.applyFunction(this, object);
    }

    // Sets up all drawing routines for rac drawable clases.
    // Also attaches additional prototype and static functions in relevant
    // classes.
    setupAllDrawFunctions(rac) {
      // Point
      this.setDrawFunction(rac.Point, (drawer, point) => {
        drawer.p5.point(point.x, point.y);
      });

      rac.Point.prototype.vertex = function() {
        rac.drawer.p5.vertex(this.x, this.y);
      };

      rac.Point.pointer = function() {
        return new rac.Point(rac.drawer.p5.mouseX, rac.drawer.p5.mouseY);
      };

      rac.Point.canvasCenter = function() {
        return new rac.Point(rac.drawer.p5.width/2, rac.drawer.p5.height/2);
      };

      rac.Point.canvasEnd = function() {
        return new rac.Point(rac.drawer.p5.width, rac.drawer.p5.height);
      };

      // Segment
      this.setDrawFunction(rac.Segment, (drawer, segment) => {
        drawer.p5.line(
          segment.start.x, segment.start.y,
          segment.end.x,   segment.end.y);
      });

      rac.Segment.prototype.vertex = function() {
        this.start.vertex();
        this.end.vertex();
      };

      // Arc
      this.setDrawFunction(rac.Arc, (drawer, arc) => {
        if (arc.isCircle()) {
          let startRad = arc.start.radians();
          let endRad = startRad + (rac.TAU);
          drawer.p5.arc(
            arc.center.x, arc.center.y,
            arc.radius * 2, arc.radius * 2,
            startRad, endRad);
          return;
        }

        let start = arc.start;
        let end = arc.end;
        if (!arc.clockwise) {
          start = arc.end;
          end = arc.start;
        }

        drawer.p5.arc(
          arc.center.x, arc.center.y,
          arc.radius * 2, arc.radius * 2,
          start.radians(), end.radians());
      });

      rac.Arc.prototype.vertex = function() {
        let angleDistance = this.angleDistance();
        let beziersPerTurn = 5;
        let divisions = angleDistance.turn == 0
          ? beziersPerTurn
          // TODO: use turnOne? when possible to test
          : Math.ceil(angleDistance.turn * beziersPerTurn);

        this.divideToBeziers(divisions).vertex();
      };

      // Bezier
      this.setDrawFunction(rac.Bezier, (drawer, bezier) => {
        drawer.p5.bezier(
          bezier.start.x, bezier.start.y,
          bezier.startAnchor.x, bezier.startAnchor.y,
          bezier.endAnchor.x, bezier.endAnchor.y,
          bezier.end.x, bezier.end.y);
      });

      rac.Bezier.prototype.vertex = function() {
        this.start.vertex()
        rac.drawer.p5.bezierVertex(
          this.startAnchor.x, this.startAnchor.y,
          this.endAnchor.x, this.endAnchor.y,
          this.end.x, this.end.y);
      };

      // Composite
      this.setDrawFunction(rac.Composite, (drawer, composite) => {
        composite.sequence.forEach(item => item.draw());
      });

      rac.Composite.prototype.vertex = function() {
        this.sequence.forEach(item => item.vertex());
      };

      // Shape
      this.setDrawFunction(rac.Shape, (drawer, shape) => {
        drawer.p5.beginShape();
        shape.outline.vertex();

        if (shape.contour.isNotEmpty()) {
          drawer.p5.beginContour();
          shape.contour.vertex();
          drawer.p5.endContour();
        }
        drawer.p5.endShape();
      });

      rac.Shape.prototype.vertex = function() {
        this.outline.vertex();
        this.contour.vertex();
      };

      // Text
      this.setDrawFunction(rac.Text, (drawer, text) => {
        text.format.apply(text.point);
        drawer.p5.text(text.string, 0, 0);
      });
      this.setDrawOptions(rac.Text, {requiresPushPop: true});

      // Applies all text properties and translates to the given `point`.
      // After the format is applied the text should be drawn at the origin.
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
      } // rac.Text.Format.prototype.apply

    } // setupAllDrawFunctions


    // Sets up all debug routines for rac drawable clases.
    setupAllDebugFunctions(rac) {
      let functions = require('./debugFunctions');
      this.setDebugFunction(rac.Point, functions.debugPoint);
      this.setDebugFunction(rac.Segment, functions.debugSegment);
      this.setDebugFunction(rac.Arc, functions.debugArc);
    } // setupAllDebugFunctions


    // Sets up all applying routines for rac style clases.
    // Also attaches additional prototype functions in relevant classes.
    setupAllApplyFunctions(rac) {
      // Color prototype functions
      rac.Color.prototype.applyBackground = function() {
        rac.drawer.p5.background(this.r * 255, this.g * 255, this.b * 255);
      };

      rac.Color.prototype.applyFill = function() {
        rac.drawer.p5.fill(this.r * 255, this.g * 255, this.b * 255, this.alpha * 255);
      };

      rac.Color.prototype.applyStroke = function() {
        rac.drawer.p5.stroke(this.r * 255, this.g * 255, this.b * 255, this.alpha * 255);
      };

      // Stroke
      this.setApplyFunction(rac.Stroke, (drawer, stroke) => {
        if (stroke.color === null) {
          drawer.p5.noStroke();
          return;
        }

        stroke.color.applyStroke();
        drawer.p5.strokeWeight(stroke.weight);
      });

      // Fill
      this.setApplyFunction(rac.Fill, (drawer, fill) => {
        if (fill.color === null) {
          rac.drawer.p5.noFill();
          return;
        }

        fill.color.applyFill();
      });

      // Style
      this.setApplyFunction(rac.Style, (drawer, style) => {
        if (style.stroke !== null) {
          style.stroke.apply();
        }
        if (style.fill !== null) {
          style.fill.apply();
        }
      });

      rac.Style.prototype.applyToClass = function(classObj) {
        rac.drawer.setClassDrawStyle(classObj, this);
      }

    } // setupAllApplyFunctions

  } // RacP5Drawer


  // Encapsulates the drawing function and options for a specific class.
  // The draw function is called with two parameters: the instance of the
  // drawer, and the object to draw.
  //
  // Optionally a `style` can be asigned to always be applied before
  // drawing an instance of the associated class. This style will be
  // applied before any styles provided to the `draw` function.
  //
  // Optionally `requiresPushPop` can be set to `true` to always peform
  // a `push` and `pop` before and after all the style and drawing in
  // the routine. This is intended for objects which drawing operations
  // may need to push transformation to the stack.
  class DrawRoutine {
    constructor (classObj, drawFunction) {
      this.classObj = classObj;
      this.drawFunction = drawFunction;
      this.style = null;

      // Options
      this.requiresPushPop = false;
    }
  } // DrawRoutine


  class DebugRoutine {
    constructor (classObj, debugFunction) {
      this.classObj = classObj;
      this.debugFunction = debugFunction;
    }
  }


  class ApplyRoutine {
    constructor (classObj, applyFunction) {
      this.classObj = classObj;
      this.applyFunction = applyFunction;
    }
  }


  return RacP5Drawer;

} // makeP5Drawer

