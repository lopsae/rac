"use strict";


console.log('❎ Running debug-test');


const racLocation = window.location.hostname == 'localhost'
  ? 'http://localhost:9001/rac.dev.js'
  // ? 'http://localhost:9001/rac.js'
  // ? 'http://localhost:9001/rac.min.js'
  // ? 'https://cdn.jsdelivr.net/gh/lopsae/rac/dist/rac.js'
  : 'https://cdn.jsdelivr.net/gh/lopsae/rac@develop/dist/rac.js';

if (typeof requirejs === "function") {
  console.log(`📚 Requesting rac from: ${racLocation}`);
  requirejs([racLocation], racConstructor => {
    console.log('📚 Loaded RAC');
    console.log(`🗃 ${racConstructor.version} ${racConstructor.build}`);
    console.log(`🕰 ${racConstructor.dated}`);
    let timed = racConstructor.dated.split('T').at(-1);
    console.log(`⏱ ${timed}`);

    requirejs(['https://cdn.jsdelivr.net/npm/p5@1.2.0/lib/p5.min.js'], p5Func => {
      console.log(`📚 Loaded p5:${typeof p5Func}`);
      new p5Func(sketch => buildSketch(sketch, racConstructor));
    });
  });
}


// d3.require("p5@1.0.0").then(p5 => {
//   console.log(`loaded p5`);
//   d3.require("./rac-0.9.9.x.js").then(rac => {
//     window.rac = rac;
//     console.log(`loaded rac`);
//   });
// });


function buildSketch(sketch, Rac) {

  let rac = null;

  let distanceControl = null;
  let angleControl = null;

  sketch.setup = function() {
    rac = new Rac();
    console.log(`📚 New RAC constructed`);
    rac.setupDrawer(sketch);

    // rac.unitaryEqualityThreshold = 0.1;

    distanceControl = new Rac.RayControl(rac, 0, 300);
    distanceControl.setValueWithLength(140);
    distanceControl.setLimitsWithLengthInsets(10, 10);
    distanceControl.addMarkerAtCurrentValue();

    angleControl = new Rac.ArcControl(rac, 0, rac.Angle(1));
    angleControl.setValueWithAngleDistance(-1/32);
    angleControl.addMarkerAtCurrentValue();

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.noLoop();
    sketch.noStroke();
    sketch.noFill();
  };


  sketch.windowResized = function() {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };


  sketch.mousePressed = function(event) {
    rac.controller.pointerPressed(rac.Point.pointer());
    sketch.redraw();
  }


  let lapses = [];
  sketch.mouseDragged = function(event) {
    rac.controller.pointerDragged(rac.Point.pointer());


    let start = performance.now();
    sketch.redraw();
    let elapsed = performance.now() - start;
    if (lapses.length > 40) {
      lapses.shift();
    }

    lapses.push(elapsed*1000);
    let sum = lapses.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    });
    // console.log(`⏰ mouseDragged count: ${lapses.length} avg-elapsed:${sum/lapses.length}`);
  }


  sketch.mouseReleased = function(event) {
    rac.controller.pointerReleased(rac.Point.pointer());
    sketch.redraw();
  }


  function makeExampleContext(center, exampleAngle, arcsAngle, arcsDistance, closure) {
    let distanceToExample = 250;
    let egCenter = center.pointToAngle(exampleAngle, distanceToExample);
    let movingCenter = egCenter.pointToAngle(arcsAngle, arcsDistance);

    closure(egCenter, movingCenter);
  }


  // Debug verbose
  let verbose = true;


  sketch.draw = function() {
    sketch.clear();

    // https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c-9e22f1
    let palette = {
      richBlack:   rac.Color.fromHex("011627"),//(1, 22, 39),
      babyPowder:  rac.Color.fromHex("fdfffc"),//(253, 255, 252),
      tiffanyBlue: rac.Color.fromHex("2ec4b6"),//(46, 196, 182),
      roseMadder:  rac.Color.fromHex("#e71d36"),//(231, 29, 54),
      orangePeel:  rac.Color.fromHex("#ff9f1c"),//(255, 159, 28),
      purpleX11:   rac.Color.fromHex("#9e22f1")//(158, 34, 241)
    };

    // Stroke weigth
    rac.drawer.strokeWeightFactor = 1.5;

    // Default font
    rac.textFormatDefaults.font = "Spot Mono Medium, Spot Mono, Menlo, monospace";
    rac.textFormatDefaults.size = 15;

    // Root styles
    palette.richBlack.applyBackground();
    // Default style mostly used for reticules
    palette.babyPowder.withAlpha(.5).stroke(2)
      .apply();

    // Text style
    let textStroke = palette.richBlack.withAlpha(0.6).stroke(3);
    palette.orangePeel.fill()
      .appendStroke(textStroke)
      .applyToClass(Rac.Text);

    // debug style
    rac.drawer.debugStyle = palette.purpleX11.stroke(2);
    rac.drawer.debugTextStyle = palette
      .richBlack.withAlpha(0.5).stroke(2)
      .appendFill(palette.purpleX11);

    let controlStyle = palette.roseMadder.stroke(3)
      .appendFill(palette.babyPowder);


    rac.controller.controlStyle = palette.babyPowder.fill()
      .appendStroke(palette.roseMadder.stroke(3));
    // angleControl.style = palette.roseMadder.stroke(3);
    distanceControl.style = palette.orangePeel.stroke(3);

    rac.controller.pointerStyle = palette.orangePeel.withAlpha(.5).stroke(2)
      .appendFill(palette.babyPowder.withAlpha(1/3));
    // rac.controller.pointerStyle = null;


    // General measurements
    let startArcRadius = 30;
    let endArcRadius = 80;


    // Center point
    let center = rac.Point.canvasCenter();


    // Controls
    let controlAngle = angleControl.distance();
    let controlDistance = distanceControl.distance();

    angleControl.anchor = center
      .segmentToAngle(rac.Angle.w, endArcRadius)
      .arc();
    angleControl.knob()
      .segmentToPoint(angleControl.anchor.center)
      .draw();
    angleControl.anchor.startSegment()
      .reverse()
      .segmentToBisector()
      .draw();

    distanceControl.anchor = center.ray(controlAngle);

    let distanceTextFormat = rac.Text.Format.topLeft
      .withAngle(controlAngle);
    let distanceAffixAnchor = distanceControl.affixAnchor();

    distanceAffixAnchor.withLengthAdd(30)
      .endPoint()
      .text(`${controlDistance.toFixed(3)}`, distanceTextFormat).draw();
    distanceAffixAnchor.withLengthAdd(30)
      .nextSegmentPerpendicular(false, 15)
      .endPoint()
      .text(`sll: ${distanceControl.startLimitLength().toFixed(3)}`, distanceTextFormat).draw();
    distanceAffixAnchor.withLengthAdd(30)
      .nextSegmentPerpendicular(false, 30)
      .endPoint()
      .text(`ell: ${distanceControl.endLimitLength().toFixed(3)}`, distanceTextFormat).draw();


    // Tests for default text format
    let hEnum = Rac.Text.Format.horizontalAlign;
    let vEnum = Rac.Text.Format.verticalAlign;
    rac.Point(10, 10)
      .text("Default Text", rac.Text.Format.topLeft)
      .draw();
    rac.Point(10, 30)
      .text("Text with font-size-less format", rac.Text.Format(hEnum.left, vEnum.top))
      .draw();
    rac.Point(10, 50)
      .text("Text without format")
      .draw();
    rac.Point(10, 70)
      .text("Mutating format")
      .withSize(20)
      .withFont("Futura")
      .withAngle(0.01)
      .draw();
    let reversableFormat = rac.Text.Format(hEnum.left, vEnum.top, 0.01)
    rac.Point(50, 100).debug()
      .text("reversable text", reversableFormat)
      .draw();
    rac.Point(50, 120)
      .text("reverse text", reversableFormat.reverse())
      .draw();

    rac.textFormatDefaults.font = null;
    rac.textFormatDefaults.size = 12;

    rac.Point(10, 150)
      .text("Text after changing defaults")
      .draw();


    // Tests for divideToSegments
    let circle = center.addY(-250).arc(150).draw();
    let circleTop = circle.pointAtAngle(rac.Angle.up);

    circle.radiusSegmentAtAngle(rac.Angle.left).draw(rac.Stroke(5, palette.tiffanyBlue));
    circle.radiusSegmentAtAngle(rac.Angle.nw).draw(rac.Stroke(null, palette.orangePeel));
    circle.radiusSegmentAtAngle(rac.Angle.n).draw(rac.Stroke(15));
    circle.radiusSegmentAtAngle(rac.Angle.ne).draw(rac.Stroke.none);

    circle.radiusSegmentAtAngle(rac.Angle.e).draw(palette.orangePeel.stroke());
    circle.radiusSegmentAtAngle(rac.Angle.see).draw(palette.orangePeel.stroke(5));
    circle.radiusSegmentAtAngle(rac.Angle.se).draw(Rac.Stroke.from(rac, palette.orangePeel));
    circle.radiusSegmentAtAngle(rac.Angle.ses).draw(Rac.Stroke.from(rac, palette.orangePeel.stroke(5)));
    circle.radiusSegmentAtAngle(rac.Angle.s).draw(Rac.Stroke.from(rac, rac.Stroke(10)));

    circle.radiusSegmentAtAngle(rac.Angle.sw).draw(palette.orangePeel.stroke(5).withWeight(10));
    circle.radiusSegmentAtAngle(rac.Angle.sww).draw(palette.orangePeel.stroke(5).withAlpha(0.5));
    circle.radiusSegmentAtAngle(rac.Angle.sws).draw(rac.Stroke(10).withAlpha(0.5));


    // Tests for linearTransition

    let transCircle = center.addY(250).arc(150).draw();
    let totalIndex = 20;
    for (let index = 0; index <= totalIndex; index++) {
      let ratio = index / totalIndex;
      let angle = ratio * 0.5;

      let transColor = palette.roseMadder.linearTransition(ratio, palette.tiffanyBlue);
      let stroke = transColor.stroke(5);

      transCircle.radiusSegmentAtAngle(angle).draw(stroke);
    }

    // Example 1 - A
    makeExampleContext(center, rac.Angle.nw, controlAngle, controlDistance,
      (egCenter, movingCenter) => {

      // Variable radius arc, clockwise
      egCenter.arc(controlDistance, rac.Angle.sw, controlAngle)
        .draw().debug(verbose);

    }); // Example 1


    // Example 2 - B
    makeExampleContext(center, rac.Angle.ne, controlAngle, controlDistance,
      (egCenter, movingCenter) => {

      egCenter.segmentToPoint(movingCenter, controlAngle)
        // Segment
        .draw().debug()
        // Segment verbose
        .translatePerpendicular(70, true)
        .draw().debug(verbose);

      egCenter
        // Angle through point
        .addX(100).debugAngle(controlAngle, verbose)
        .addY(-100).push();
      // Angle through angle
      controlAngle.inverse().debug(rac.popStack());

      egCenter
        .addY(-100)
        .ray(controlAngle.inverse()).debug()
        .start
        .addX(-70)
        .ray(controlAngle.inverse()).debug(true);
    }); // Example 2


    // Example 3 - C
    makeExampleContext(center, rac.Angle.sw, controlAngle, controlDistance,
      (egCenter, movingCenter) => {

      // Variable radius arc, counter-clockwise
      egCenter.arc(controlDistance, rac.Angle.sw, controlAngle, false)
        .draw().debug(verbose);

    }); // Example 3


    // Example 4 - D
    makeExampleContext(center, rac.Angle.se, controlAngle, controlDistance,
      (egCenter, movingCenter) => {

      // Point
      egCenter.debug();
      // Point verbose
      movingCenter.debug(verbose);

      let translatedSegment = egCenter
        .segmentToPoint(movingCenter, controlAngle)
        .translatePerpendicular(100, true)
        .draw();

      // Small complete-circle arc
      translatedSegment.startPoint()
        .arc(10).draw().debug();
      // Tiny complete-circle arc
      translatedSegment.endPoint()
        .arc(1, rac.Angle.w, rac.Angle.w, false).draw().debug();

      translatedSegment = egCenter
        .segmentToPoint(movingCenter, controlAngle)
        .translatePerpendicular(100, false)
        .draw();

      // Small arc
      translatedSegment.startPoint()
        .arc(10, rac.Angle.w, rac.Angle.n).draw().debug();
      // Tiny arc
      translatedSegment.endPoint()
        .arc(1, rac.Angle.w, rac.Angle.n, false).draw().debug();

    }); // Example 4


    // Controls draw on top
    rac.controller.drawControls();


    // console.log(`👑 ~finis coronat opus ${sketch.frameCount}`);
  } // draw

} // buildSketch

