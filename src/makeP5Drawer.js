'use strict';



module.exports = function makeP5Drawer(rac) {

  // Drawer that uses a P5 instance for all drawing operations.
  return class RacP5Drawer {

    constructor(rac, p5){
      this.p5 = p5;
      this.drawRoutines = [];
      this.applyRoutines = [];
      this.enabled = true;
      this.debugStyle = null;

      this.setupAllDrawFunctions(rac);
      this.setupAllApplyFunctions(rac);
    }

    // Adds a routine for the given class.
    setDrawFunction(classObj, drawFunction) {
      let index = this.drawRoutines
        .findIndex(routine => routine.classObj === classObj);

      let routine;
      if (index === -1) {
        routine = new RacP5Drawer.DrawRoutine(classObj, drawFunction);
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

    setApplyFunction(classObj, applyFunction) {
      let index = this.applyRoutines
        .findIndex(routine => routine.classObj === classObj);

      let routine;
      if (index === -1) {
        routine = new RacP5Drawer.ApplyRoutine(classObj, applyFunction);
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

    debugObject(object) {
      this.drawObject(object, this.debugStyle);
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
    setupAllDrawFunctions(rac) {
      // Point
      this.setDrawFunction(rac.Point, (drawer, point) => {
        drawer.p5.point(point.x, point.y);
      });

      // Text
      this.setDrawFunction(rac.Text, (drawer, text) => {
        text.format.apply(text.point);
        drawer.p5.text(text.string, 0, 0);
      });
      this.setDrawOptions(rac.Text, {requiresPushPop: true});

      // Segment
      this.setDrawFunction(rac.Segment, (drawer, segment) => {
        drawer.p5.line(
          segment.start.x, segment.start.y,
          segment.end.x,   segment.end.y);
      });

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

      // Bezier
      this.setDrawFunction(rac.Bezier, (drawer, bezier) => {
        drawer.p5.bezier(
          bezier.start.x, bezier.start.y,
          bezier.startAnchor.x, bezier.startAnchor.y,
          bezier.endAnchor.x, bezier.endAnchor.y,
          bezier.end.x, bezier.end.y);
      });

      // Composite
      this.setDrawFunction(rac.Composite, (drawer, composite) => {
        composite.sequence.forEach(item => item.draw());
      });

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

    } // setupAllDrawFunctions


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
    static DrawRoutine = class RacDrawerP5DrawRoutine {
      constructor (classObj, drawFunction) {
        this.classObj = classObj;
        this.drawFunction = drawFunction
        this.style = null;

        // Options
        this.requiresPushPop = false;
      }
    }


    static ApplyRoutine = class RacDrawerP5ApplyRoutine {
      constructor (classObj, applyFunction) {
        this.classObj = classObj;
        this.applyFunction = applyFunction
      }
    }

  } // RacP5Drawer

} // makeP5Drawer

