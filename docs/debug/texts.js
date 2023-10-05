"use strict";


console.log('❎ Running debug-test');


// RELEASE-TODO: check if dist can also be hosted with pages
const racLocation = window.location.hostname == '127.0.0.1' // 'localhost'
  ? 'http://localhost:9001/rac.dev.js'
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

  let palette


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
        .text('Text with ray.text.reverse and padding')
        .withPaddings(10, 5)
        .reverse().draw();

      egCenter.ray(controlAngle.add(2/16))
        .translateToDistance(translation)
        .debug()
        .text('Text with ray.text.upright and padding')
        .withPaddings(10, 5)
        .upright().draw();

      egCenter.ray(controlAngle.add(5/16))
        .translateToDistance(translation)
        .segment(100)
        .debug()
        .text('Text with segment.text').draw();

      egCenter.ray(controlAngle.add(7/16))
        .translateToDistance(translation)
        .segment(100)
        .debug()
        .text('Text with segment.text and bll format', rac.Text.Format.bll)
        .draw();

      egCenter.ray(controlAngle.add(9/16))
        .translateToDistance(translation)
        .segment(100)
        .debug()
        .text('Text with segment.text.upright\nand bll format', rac.Text.Format.bll)
        .upright()
        .draw();
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

      egCenter = egCenter.addY(100);
      egCenter.arc(controlDistance, controlAngle.inverse(), 2/4, false).debug()
        .text('Text with arc.text.upright,\nfor couter-clockwise text')
        .upright()
        .draw();
    }); // South-West Example


    // ====================================================================
    // South-East Example =================================================
    // ====================================================================
    makeExampleContext(center, rac.Angle.se, controlAngle, controlDistance,
    (egCenter, segmentEnd) => {
      egCenter.arc(5).draw();
      egCenter.text('South-East Example:\ndebug texts', rac.Text.Format.blc)
        .draw();

      let genPadding = controlDistance - 130;
      egCenter = egCenter.addY(50);

      let lCenter = egCenter.addX(100);
      let cCenter = egCenter.addY(70);
      let rCenter = egCenter.addX(-100);

      // Lefts
      lCenter.text('Debug Text with bl', rac.Text.Format.bl)
        .withPaddings(genPadding*3/2, genPadding)
        .debug(true);
      lCenter = lCenter.addY(60);
      lCenter.text('Debug Text with bll', rac.Text.Format.bll)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      lCenter = lCenter.addY(60);
      lCenter.text('Debug Text with cl', rac.Text.Format.cl)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      lCenter = lCenter.addY(60);
      lCenter.text('Debug Text with tl', rac.Text.Format.tl)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();

      // Centers
      cCenter.text('Debug Text with bc', rac.Text.Format.bc)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      cCenter = cCenter.addY(60);
      cCenter.text('Debug Text with blc', rac.Text.Format.blc)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      cCenter = cCenter.addY(60);
      cCenter.text('Debug Text with cc', rac.Text.Format.cc)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      cCenter = cCenter.addY(60);
      cCenter.text('Debug Text with tc', rac.Text.Format.tc)
        // .withPaddings(0, genPadding)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();

      // Rights
      rCenter.text('Debug Text with br', rac.Text.Format.br)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      rCenter = rCenter.addY(60);
      rCenter.text('Debug Text with blr', rac.Text.Format.blr)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      rCenter = rCenter.addY(60);
      rCenter.text('Debug Text with cr', rac.Text.Format.cr)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();
      rCenter = rCenter.addY(60);
      rCenter.text('Debug Text with tr', rac.Text.Format.tr)
        .withPaddings(genPadding*3/2, genPadding)
        .debug();

      let vPadding = controlDistance -120;
      let paddingStr = `(0,${rac.utils.cutDigits(vPadding,1)})`;
      cCenter.addY(100)
        // .text(`Debug angled Text with blc format and padding ${paddingStr}`, rac.Text.Format.blc)
        .text(`Debug angled upright Text with bl format and padding ${paddingStr}`, rac.Text.Format.bl)
        .withAngle(controlAngle)
        .withPaddings(0, vPadding)
        .upright()
        .debug(true);
    }); // South-East Example


    // Controls draw on top
    rac.controller.drawControls();


    console.log(`👑 ~finis coronat opus ${sketch.frameCount}`);
  } // draw

} // buildSketch

