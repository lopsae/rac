'use strict';



module.exports = function makeP5Drawer(rac) {

  // Drawer that uses a P5 instance for all drawing operations.
  return class RacP5Drawer {

    constructor(rac, p5){
      this.p5 = p5;
      this.routines = [];
      this.enabled = true;
      this.debugStyle = null;

      this.setupAllDrawFunctions(rac);
    }

    // Adds a routine for the given class. The `drawFunction` function will be
    // called passing the element to be drawn as `this`.
    setDrawFunction(classObj, drawFunction) {
      let index = this.routines
        .findIndex(routine => routine.classObj === classObj);

      let routine;
      if (index === -1) {
        routine = new RacP5Drawer.Routine(classObj, drawFunction);
      } else {
        routine = this.routines[index];
        routine.drawFunction = drawFunction;
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
        this.p5.push();
        if (routine.style !== null) {
          routine.style.apply();
        }
        if (style !== null) {
          style.apply();
        }
        routine.drawFunction(this, element);
        this.p5.pop();
      } else {
        // No push-pull
        routine.drawFunction(this, element);
      }
    }

    debugElement(element) {
      this.drawElement(element, this.debugStyle);
    }

    // Sets up all drawing routines for rac clases.
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


      // Encapsulates the drawing function and options for a specific class.
      // The draw function is called with an instance of the drawer, and
      // the object to draw.
      //
      // Optionally a `style` can be asigned to always be applied before
      // drawing an instance of the associated class. This style will be
      // applied before any styles provided to the `draw` function.
      //
      // Optionally `requiresPushPop` can be set to `true` to always peform
      // a `push` and `pop` before and after all the style and drawing in
      // the routine. This is intended for objects which drawing operations
      // may need to push transformation to the stack.
    static Routine = class RacDrawerRoutine {
      constructor (classObj, drawFunction) {
        this.classObj = classObj;
        this.drawFunction = drawFunction
        this.style = null;

        // Options
        this.requiresPushPop = false;
      }
    }

  } // RacP5Drawer

} // makeP5Drawer
