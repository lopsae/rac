"use strict";


console.log('❎ Running debug-test');


const racLocation = window.location.hostname == '127.0.0.1' // 'localhost'
  ? '../dist/1.3.0-dev/rac.dev.js'
  // ? 'http://localhost:9001/rac.js'
  // ? 'http://localhost:9001/rac.min.js'
  // ? 'https://cdn.jsdelivr.net/gh/lopsae/rac/dist/rac.js'
  : 'https://cdn.jsdelivr.net/gh/lopsae/rac@develop/dist/rac.js';

const p5Location = 'https://cdn.jsdelivr.net/npm/p5@1.7.0/lib/p5.min.js';

if (typeof requirejs === 'function') {
  console.log(`📚 Requesting rac from: ${racLocation}`);
  console.log(`📚 Requesting p5js from: ${p5Location}`);
  requirejs([racLocation, p5Location],
  (racConstructor, p5Func) => {
    console.log('📚 Loaded Libraries');
    console.log(`🗃 RAC:${racConstructor.version} ${racConstructor.build}`);
    console.log(`🕰 ${racConstructor.dated}`);
    let timed = racConstructor.dated.split('T').at(-1);
    console.log(`⏱️ ${timed}`);

    console.log(`📚 p5js:${typeof p5Func}`);
    new p5Func(sketch => buildSketch(sketch, racConstructor));
  });
}


function buildSketch(sketch, Rac) {

  let rac = null;

  sketch.setup = function() {
    rac = new Rac();
    console.log('🛠️ New RAC constructed');
    rac.setupDrawer(sketch);

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.noLoop();
    sketch.noStroke();
    sketch.noFill();

    runOnce();
  };


  sketch.windowResized = function() {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };


  sketch.mousePressed = function(event) {
    rac.controller.pointerPressed(rac.Point.pointer());
    sketch.redraw();
  }


  sketch.mouseDragged = function(event) {
    rac.controller.pointerDragged(rac.Point.pointer());
    sketch.redraw();
  }


  sketch.mouseReleased = function(event) {
    rac.controller.pointerReleased(rac.Point.pointer());
    sketch.redraw();
  }


  function makeExampleContext(center, exampleAngle, arcsAngle, arcsDistance, closure) {
    let distanceToExample = 250;
    let egCenter = center.pointToAngle(exampleAngle, distanceToExample);
    let segmentEnd = egCenter.pointToAngle(arcsAngle, arcsDistance);

    closure(egCenter, segmentEnd);
  }


  let distanceControl = null;
  let angleControl = null;

  let palette = null;

  // Debug verbose
  let verbose = true;


  // Builds controls and applies styles
  function runOnce() {
    distanceControl = new Rac.RayControl(rac, 0, 300);
    distanceControl.setValueWithLength(140);
    distanceControl.setLimitsWithLengthInsets(10, 10);
    distanceControl.addMarkerAtCurrentValue();

    angleControl = new Rac.ArcControl(rac, 0, rac.Angle(1));
    angleControl.setValueWithAngleDistance(1/16);
    angleControl.addMarkerAtCurrentValue();

    // https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c-9e22f1
    palette = {
      richBlack:   rac.Color.fromHex('011627'),
      babyPowder:  rac.Color.fromHex('fdfffc'),
      tiffanyBlue: rac.Color.fromHex('2ec4b6'),
      roseMadder:  rac.Color.fromHex('e71d36'),
      orangePeel:  rac.Color.fromHex('ff9f1c'),
      purpleX11:   rac.Color.fromHex('9e22f1')
    };

    // Stroke weigth
    rac.drawer.strokeWeightFactor = 1;

    // Default font
    rac.textFormatDefaults.font = "Spot Mono Medium, Spot Mono, Menlo, monospace";
    rac.textFormatDefaults.size = 15;

    // Default style
    palette.babyPowder.withAlpha(.5).stroke(2)
      .apply();

    // Text style
    let textStroke = palette.richBlack.withAlpha(0.6).stroke(3);
    palette.orangePeel.fill()
      .appendStroke(textStroke)
      .applyToClass(Rac.Text);

    // Debug style
    rac.drawer.debugStyle = palette.purpleX11.stroke(2);
    rac.drawer.debugTextStyle = palette
      .richBlack.withAlpha(0.5).stroke(2)
      .appendFill(palette.purpleX11);

    // Controll Style
    rac.controller.controlStyle = palette.babyPowder.fill()
      .appendStroke(palette.roseMadder.stroke(3));
    distanceControl.style = palette.orangePeel.stroke(3);

    // Pointer Style
    rac.controller.pointerStyle = palette.orangePeel.withAlpha(.5).stroke(2)
      .appendFill(palette.babyPowder.withAlpha(1/3));
  }


  sketch.draw = function() {
    sketch.clear();

    // General measurements
    let startArcRadius = 30;
    let endArcRadius = 80;

    // Center point
    let center = rac.Point.canvasCenter();

    // Controls values
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

    let distanceStr   = `d:${controlDistance.toFixed(3)}`;
    let startLimitStr = `sll: ${distanceControl.startLimitLength().toFixed(3)}`;
    let endLimitStr   = `ell: ${distanceControl.endLimitLength().toFixed(3)}`;
    let distanceControlStr = `${distanceStr}\n${startLimitStr}\n${endLimitStr}`;

    distanceAffixAnchor.nextSegmentWithLength(0)
      .ray.text(distanceControlStr)
      .withPaddings(30, 0)
      .draw();


    // ====================================================================
    // North-East Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.ne, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('North-East Example:\nsegments, rays, point, angles', rac.Text.Format.bc)
        .draw();

      let radius = egCenter.segmentToPoint(segmentEnd, controlAngle);

      // Point
      radius.withLengthRatio(1/2).endPoint().debug(verbose);

      // Angle
      radius.translatePerpendicular(-30)
        .endPoint().debugAngle(controlAngle, verbose);
      let pointForAngle = radius
        .translatePerpendicular(30)
        .endPoint();
      controlAngle.debug(pointForAngle, verbose);

      // Segment
      radius
        .translatePerpendicular(70)
        .debug(verbose);

      // Ray
      radius.translatePerpendicular(-70)
        .ray.debug(verbose);
    }); // North-East Example


    // ====================================================================
    // South-East Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.se, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('South-East Example:\nempty', rac.Text.Format.bc)
        .draw();
    }); // South-East Example


    // ====================================================================
    // North-West Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.nw, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      let translation = 60;
      egCenter.arc(5).draw();
      egCenter.text('North-West Example:\nclockwise arc', rac.Text.Format.bc)
        .draw();

      egCenter.addY(20)
        .arc(controlDistance, rac.Angle.sw, controlAngle, true)
        .draw().debug(verbose);
    }); // North-West Example


    // ====================================================================
    // South-West Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.sw, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('South-West Example:\ncounter-clockwise arc', rac.Text.Format.bc)
        .draw();

      egCenter.addY(20)
        .arc(controlDistance, rac.Angle.sw, controlAngle, false)
        .draw().debug(verbose);
    }); // South-West Example


    // Controls draw on top
    rac.controller.drawControls();


    console.log(`👑 ~finis coronat opus ${sketch.frameCount}`);
  } // draw

} // buildSketch

