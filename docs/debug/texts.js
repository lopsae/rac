"use strict";


console.log('❎ Running debug-test');


// RELEASE-TODO: check if dist can also be hosted with pages
const racLocation = window.location.hostname == '127.0.0.1' // 'localhost'
  ? 'http://localhost:9001/rac.dev.js'
  // ? 'http://localhost:9001/rac.js'
  // ? 'http://localhost:9001/rac.min.js'
  // ? 'https://cdn.jsdelivr.net/gh/lopsae/rac/dist/rac.js'
  : 'https://cdn.jsdelivr.net/gh/lopsae/rac@develop/dist/rac.js';

if (typeof requirejs === 'function') {
  console.log(`📚 Requesting rac from: ${racLocation}`);
  // RELEASE-TODO: can both libraries be loaded at the same time?
  requirejs([racLocation], racConstructor => {
    console.log('📚 Loaded RAC');
    console.log(`🗃 ${racConstructor.version} ${racConstructor.build}`);
    console.log(`🕰 ${racConstructor.dated}`);
    let timed = racConstructor.dated.split('T').at(-1);
    console.log(`⏱️ ${timed}`);

    // RELEASE-TODO: update to p5 1.7.0
    requirejs(['https://cdn.jsdelivr.net/npm/p5@1.2.0/lib/p5.min.js'], p5Func => {
      console.log(`📚 Loaded p5:${typeof p5Func}`);
      new p5Func(sketch => buildSketch(sketch, racConstructor));
    });
  });
}


function buildSketch(sketch, Rac) {

  let rac = null;

  let distanceControl = null;
  let angleControl = null;

  sketch.setup = function() {
    rac = new Rac();
    console.log(`📚 New RAC constructed`);
    rac.setupDrawer(sketch);

    distanceControl = new Rac.RayControl(rac, 0, 300);
    distanceControl.setValueWithLength(140);
    distanceControl.setLimitsWithLengthInsets(10, 10);
    distanceControl.addMarkerAtCurrentValue();

    angleControl = new Rac.ArcControl(rac, 0, rac.Angle(1));
    angleControl.setValueWithAngleDistance(1/16);
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


  // RELEASE-TODO: remove timing code
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
    let segmentEnd = egCenter.pointToAngle(arcsAngle, arcsDistance);

    closure(egCenter, segmentEnd);
  }


  // RELEASE-TODO: needed?
  // Debug verbose
  let verbose = true;


  sketch.draw = function() {
    sketch.clear();

    // RELEASE-TODO: move palette and other visual setup out
    // https://coolors.co/011627-fdfffc-2ec4b6-e71d36-ff9f1c-9e22f1
    let palette = {
      richBlack:   rac.Color.fromHex('011627'),//(1, 22, 39),
      babyPowder:  rac.Color.fromHex('fdfffc'),//(253, 255, 252),
      tiffanyBlue: rac.Color.fromHex('2ec4b6'),//(46, 196, 182),
      roseMadder:  rac.Color.fromHex('e71d36'),//(231, 29, 54),
      orangePeel:  rac.Color.fromHex('ff9f1c'),//(255, 159, 28),
      purpleX11:   rac.Color.fromHex('9e22f1')//(158, 34, 241)
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


    // ====================================================================
    // North-East Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.ne, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('North-East Example:\nText formatting and point.text', rac.Text.Format.bc)
        .draw()

      // Default text format
      egCenter = egCenter.addY(30);
      egCenter.segmentToAngle(0, 100).draw(palette.orangePeel.stroke());
      egCenter.text('Text without format')
        .draw();

      egCenter.text('Text with bottomLeft Format', rac.Text.Format.bottomLeft)
        .draw();

      let hEnum = Rac.Text.Format.horizontalAlign;
      let vEnum = Rac.Text.Format.verticalAlign;

      let noSizeFormat = rac.Text.Format(hEnum.left, vEnum.top)
      egCenter = egCenter.addY(20);
      egCenter.text('Text without size in format', noSizeFormat)
        .draw();

      // Save defaults
      let fontDefault = rac.textFormatDefaults.font;
      let sizeDefault = rac.textFormatDefaults.size;
      rac.textFormatDefaults.font = null;
      rac.textFormatDefaults.size = 12;

      egCenter = egCenter.addY(20);
      egCenter.text('Text after removing defaults')
        .draw();

      // Restore defaults
      rac.textFormatDefaults.font = fontDefault;
      rac.textFormatDefaults.size = sizeDefault;

      egCenter = egCenter.addY(50).debug();
      egCenter.text('Mutating format size, font, angle')
        .withSize(20)
        .withFont('Futura')
        .withAngle(controlAngle)
        .draw();

      let reversableFormat = rac.Text.Format(hEnum.left, vEnum.top, controlAngle)
      egCenter = egCenter.addY(30);
      egCenter.text('Text with reversableFormat', reversableFormat)
        .draw();

      egCenter = egCenter.addY(20);
      egCenter.text('Text with reversableFormat.reverse', reversableFormat.reverse())
        .draw();
    }); // North-East Example


    // ====================================================================
    // North-West Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.nw, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      let translation = 60;
      egCenter.arc(5).draw();
      egCenter.arc(translation).draw()

      egCenter.text('North-West Example:\nray.text, segment.text', rac.Text.Format.bc)
        .draw()

      egCenter.ray(controlAngle.add(0/16))
        .translateToDistance(translation)
        .debug()
        .text('Text with ray.text').draw();

      egCenter.ray(controlAngle.add(1/16))
        .translateToDistance(translation)
        .debug()
        .reverseText('Text with ray.reverseText').draw();

      egCenter.ray(controlAngle.add(2/16))
        .translateToDistance(translation)
        .debug()
        .uprightText('Text with ray.uprightText').draw();

      egCenter.ray(controlAngle.add(5/16))
        .translateToDistance(translation)
        .segment(100)
        .debug()
        .text('Text with segment.text').draw();
    }); // North-West Example


    // ====================================================================
    // South-West Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.sw, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('South-West Example:\nray.text', rac.Text.Format.bc)
        .draw();

      egCenter.arc(controlDistance, controlAngle, 1/4).debug()
        .text('Text with arc.text,\nfor clockwise text').draw();

      egCenter.arc(controlDistance, controlAngle.inverse(), 2/4, false).debug()
        .text('Text with arc.text,\nfor couter-clockwise text').draw();
    }); // South-West Example


    // ====================================================================
    // South-East Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.se, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('South-East Example:\nempty', rac.Text.Format.blc)
        .draw();
    }); // South-East Example


    // Controls draw on top
    rac.controller.drawControls();


    console.log(`👑 ~finis coronat opus ${sketch.frameCount}`);
  } // draw

} // buildSketch

