'use strict';

const Rac = require('ruler-and-compass');
const tools = require('./tools');


const rac = tools.rac;

const fifty = rac.Point(55, 55);
const hunty = rac.Point(100, 100);

const diagonal = rac.Segment(55, 55, rac.Angle.eighth, 72);
const vertical = rac.Segment(100, 100, rac.Angle.down, 72);
const horizontal = rac.Segment(100, 100, rac.Angle.zero, 72);


tools.test( function identity() {
  // Rac instance
  const otherRac = new Rac();
  expect(otherRac.Segment.zero).not.equalsSegment(0, 0, 0, 0);

  // Instance members
  expect(rac.Segment.zero).equalsSegment(0, 0, 0, 0);

  // Angle/number parameter
  expect(diagonal).equalsSegment(55, 55, 1/8, 72);
  expect(diagonal).equalsSegment(55, 55, rac.Angle.eighth, 72);

  // Inequality
  expect(rac.Segment.zero).not.equalsSegment(7, 0, .0, 0);
  expect(rac.Segment.zero).not.equalsSegment(0, 7, .0, 0);
  expect(rac.Segment.zero).not.equalsSegment(0, 0, .7, 0);
  expect(rac.Segment.zero).not.equalsSegment(0, 0, .0, 7);

  // Unexpected type for equalsSegment
  expect(null)          .not.equalsSegment(0, 0, 0, 0);
  expect(0)             .not.equalsSegment(0, 0, 0, 0);
  expect('0')           .not.equalsSegment(0, 0, 0, 0);
  expect(rac.Point.zero).not.equalsSegment(0, 0, 0, 0);
  expect(rac.Angle.zero).not.equalsSegment(0, 0, 0, 0);
  expect(rac.Ray.zero)  .not.equalsSegment(0, 0, 0, 0);

  // Expected type for equals
  expect(diagonal.equals(diagonal)).toBe(true);
  expect(diagonal.equals(vertical)).toBe(false);

  // Unexpected type for equals
  expect(diagonal.equals(null))            .toBe(false);
  expect(diagonal.equals(55))              .toBe(false);
  expect(diagonal.equals('55'))            .toBe(false);
  expect(diagonal.equals(rac.Point.zero))  .toBe(false);
  expect(diagonal.equals(rac.Angle.eighth)).toBe(false);
  expect(diagonal.equals(rac.Ray.zero))    .toBe(false);
});


tools.test( function toString() {
  const segment = rac.Segment(1.23456, 2.34567, 0.12345, 3.45678);

  expect(segment.toString())
    .toBe('Segment((1.23456,2.34567) a:0.12345 l:3.45678)');
  expect(segment.toString(2))
    .toBe('Segment((1.23,2.35) a:0.12 l:3.46)');
});


tools.test( function errors() {
  const ray = rac.Ray.yAxis;
  expect(() => {new Rac.Segment(rac, ray, 72);})
    .not.toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Missing parameters
  expect(() => {new Rac.Segment(null, ray, 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, null, 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, ray, null);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);


  // Invalid ray
  expect(() => {new Rac.Segment(rac, 100, 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, "nonsense", 72);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);

  // Invalid length
  expect(() => {new Rac.Segment(rac, ray, "nonsense");})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
  expect(() => {new Rac.Segment(rac, ray, NaN);})
    .toThrowNamed(Rac.Exception.failedAssert.exceptionName);
});


tools.test( function accesors() {
  expect(diagonal.startPoint()).equalsPoint(55, 55);
  expect(diagonal.angle()).equalsAngle(1/8);

  let cathetus = tools.cathetus(72);
  expect(diagonal.endPoint()).equalsPoint(55+cathetus, 55+cathetus);
});


tools.test( function withStartPoint() {
  expect(diagonal.withStartPoint(hunty))
    .equalsSegment(100, 100, 1/8, 72);
});


tools.test( function withStartExtension() {
  const hyp = tools.hypotenuse(55);
  expect(diagonal.withStartExtension(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withStartExtension(hyp))
    .equalsSegment(0, 0, 1/8, 72+hyp);
  expect(diagonal.withStartExtension(-hyp))
    .equalsSegment(110, 110, 1/8, 72-hyp);
});


tools.test( function withAngle_Ray_Length() {
  expect(diagonal.withAngle(rac.Ray.zero)).equalsSegment(55, 55, 0, 72);
  expect(diagonal.withAngle(1/2))         .equalsSegment(55, 55, 1/2, 72);

  expect(diagonal.withRay(rac.Ray.zero)) .equalsSegment(0, 0, 0, 72);
  expect(diagonal.withRay(rac.Ray.yAxis)).equalsSegment(0, 0, 1/4, 72);

  expect(diagonal.withLength(0))  .equalsSegment(55, 55, 1/8, 0);
  expect(diagonal.withLength(100)).equalsSegment(55, 55, 1/8, 100);
});


tools.test( function withLengthAdd_EndExtension_LengthRatio() {
  expect(diagonal.withLengthAdd(0))  .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withLengthAdd(28)) .equalsSegment(55, 55, 1/8, 100);
  expect(diagonal.withLengthAdd(-72)).equalsSegment(55, 55, 1/8, 0);

  // Same as withLengthAdd
  expect(diagonal.withEndExtension(0))  .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withEndExtension(28)) .equalsSegment(55, 55, 1/8, 100);
  expect(diagonal.withEndExtension(-72)).equalsSegment(55, 55, 1/8, 0);

  expect(diagonal.withLengthRatio(0))  .equalsSegment(55, 55, 1/8, 0);
  expect(diagonal.withLengthRatio(1/2)).equalsSegment(55, 55, 1/8, 36);
  expect(diagonal.withLengthRatio(1))  .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withLengthRatio(2))  .equalsSegment(55, 55, 1/8, 144);
});


tools.test( function withAngleAdd_AngleShift() {
  expect(diagonal.withAngleAdd(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withAngleAdd(rac.Angle.zero))
    .equalsSegment(55, 55, 1/8, 72);

  expect(diagonal.withAngleAdd(1/4))
    .equalsSegment(55, 55, 3/8, 72);
  expect(diagonal.withAngleAdd(-1/4))
    .equalsSegment(55, 55, 7/8, 72);

  expect(diagonal.withAngleShift(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.withAngleShift(rac.Angle.zero))
    .equalsSegment(55, 55, 1/8, 72);

  expect(diagonal.withAngleShift(1/4))
    .equalsSegment(55, 55, 3/8, 72);
  expect(diagonal.withAngleShift(1/4, false))
    .equalsSegment(55, 55, 7/8, 72);
});


tools.test( function transformations() {
  // inverse
  expect(diagonal.inverse()).equalsSegment(55, 55, 5/8, 72);
  expect(horizontal.inverse()).equalsSegment(100, 100, 1/2, 72);

  // perpendicular
  expect(diagonal.perpendicular()).equalsSegment(55, 55, 3/8, 72);
  expect(diagonal.perpendicular(false)).equalsSegment(55, 55, 7/8, 72);

  // reverse
  const cathetus = tools.cathetus(72);
  expect(diagonal.reverse())
    .equalsSegment(55+cathetus, 55+cathetus, 5/8, 72);

  expect(diagonal.reverse().endPoint().equals(diagonal.startPoint()))
    .toBe(true);
});


tools.test( function transToAngle_Length_LengthRatio() {
  // translateToAngle
  expect(diagonal.translateToAngle(0, 0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.translateToAngle(rac.Angle.zero, 0))
    .equalsSegment(55, 55, 1/8, 72);

  const hyp = tools.hypotenuse(55);
  expect(diagonal.translateToAngle(3/8, 0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.translateToAngle(3/8, hyp))
    .equalsSegment(0, 110, 1/8, 72);

  // translateToLength
  expect(diagonal.translateToLength(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.translateToLength(hyp))
    .equalsSegment(110, 110, 1/8, 72);
  expect(diagonal.translateToLength(-hyp))
    .equalsSegment(0, 0, 1/8, 72);

  // translateToLengthRatio
  expect(horizontal.translateToLengthRatio(0))  .equalsSegment(100, 100, 0, 72);
  expect(horizontal.translateToLengthRatio(1/2)).equalsSegment(136, 100, 0, 72);
  expect(horizontal.translateToLengthRatio(1))  .equalsSegment(172, 100, 0, 72);
  expect(horizontal.translateToLengthRatio(-1)) .equalsSegment(28, 100, 0, 72);

  const cat = tools.cathetus(72/2);
  expect(diagonal.translateToLengthRatio(0))   .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.translateToLengthRatio(1/2)) .equalsSegment(55+cat, 55+cat, 1/8, 72);
  expect(diagonal.translateToLengthRatio(-1/2)).equalsSegment(55-cat, 55-cat, 1/8, 72);

  const zero = rac.Segment.zero;
  expect(zero.translateToLengthRatio(0))  .equalsSegment(0, 0, 0, 0);
  expect(zero.translateToLengthRatio(1/2)).equalsSegment(0, 0, 0, 0);
  expect(zero.translateToLengthRatio(1))  .equalsSegment(0, 0, 0, 0);
  expect(zero.translateToLengthRatio(-1)) .equalsSegment(0, 0, 0, 0);
});


tools.test( function translatePerpendicular() {
  expect(diagonal.translatePerpendicular(0))
    .equalsSegment(55, 55, 1/8, 72);
  expect(diagonal.translatePerpendicular(0, false))
    .equalsSegment(55, 55, 1/8, 72);

  const hyp = tools.hypotenuse(55);
  expect(diagonal.translatePerpendicular(hyp))
    .equalsSegment(0, 110, 1/8, 72);
  expect(diagonal.translatePerpendicular(hyp, false))
    .equalsSegment(110, 0, 1/8, 72);
});


tools.test( function clampToLength() {
  // No insets
  expect(vertical.clampToLength(0)).toBe(0);
  expect(vertical.clampToLength(55)).toBe(55);
  expect(vertical.clampToLength(72)).toBe(72);

  expect(vertical.clampToLength(-7)).toBe(0);
  expect(vertical.clampToLength(100)).toBe(72);

  // Valid insets
  expect(horizontal.clampToLength(-7, 10, 10)).toBe(10);
  expect(horizontal.clampToLength(0, 10, 10)).toBe(10);
  expect(horizontal.clampToLength(10, 10, 10)).toBe(10);
  expect(horizontal.clampToLength(55, 10, 10)).toBe(55);
  expect(horizontal.clampToLength(62, 10, 10)).toBe(62);
  expect(horizontal.clampToLength(72, 10, 10)).toBe(62);
  expect(horizontal.clampToLength(100, 10, 10)).toBe(62);

  // Invalid range, centered in range
  expect(vertical.clampToLength(0, 10, 72)).toBe(5);
  expect(vertical.clampToLength(55, 10, 72)).toBe(5);
  expect(vertical.clampToLength(72, 10, 72)).toBe(5);

  expect(vertical.clampToLength(0, 72, 10)).toBe(67);
  expect(vertical.clampToLength(55, 72, 10)).toBe(67);
  expect(vertical.clampToLength(72, 72, 10)).toBe(67);

  // Invalid range, clamped to 0
  expect(horizontal.clampToLength(0, 7, 100)).toBe(0);
  expect(horizontal.clampToLength(55, 7, 100)).toBe(0);
  expect(horizontal.clampToLength(72, 7, 100)).toBe(0);

  // Invalid range, clamped to length
  expect(horizontal.clampToLength(0, 100, 7)).toBe(72);
  expect(horizontal.clampToLength(55, 100, 7)).toBe(72);
  expect(horizontal.clampToLength(72, 100, 7)).toBe(72);

  // What happens with negatives?
  const negative = vertical.withLength(-10);
  expect(negative.clampToLength(0, 10, 10)).toBe(0);
  expect(negative.clampToLength(55, 10, 10)).toBe(0);
  expect(negative.clampToLength(-55, 10, 10)).toBe(0);
});


tools.test( function pointAtLenght_Ratio_Bisector() {
  const zero = rac.Segment.zero;

  // pointAtLength
  expect(vertical.pointAtLength(0)).equalsPoint(100, 100);
  expect(vertical.pointAtLength(100)).equalsPoint(100, 200);
  expect(vertical.pointAtLength(-100)).equalsPoint(100, 0);

  expect(zero.pointAtLength(0)).equalsPoint(0, 0);
  expect(zero.pointAtLength(100)).equalsPoint(100, 0);
  expect(zero.pointAtLength(-100)).equalsPoint(-100, 0);

  // pointAtLengthRadio
  expect(horizontal.pointAtLengthRatio(0)).equalsPoint(100, 100);
  expect(horizontal.pointAtLengthRatio(1/2)).equalsPoint(136, 100);
  expect(horizontal.pointAtLengthRatio(1)).equalsPoint(172, 100);
  expect(horizontal.pointAtLengthRatio(-1)).equalsPoint(28, 100);

  expect(zero.pointAtLengthRatio(0)).equalsPoint(0, 0);
  expect(zero.pointAtLengthRatio(1/2)).equalsPoint(0, 0);
  expect(zero.pointAtLengthRatio(1)).equalsPoint(0, 0);
  expect(zero.pointAtLengthRatio(-1)).equalsPoint(0, 0);

  // pointAtBisector
  expect(vertical.pointAtBisector()).equalsPoint(100, 136);
  expect(horizontal.pointAtBisector()).equalsPoint(136, 100);
  expect(zero.pointAtBisector()).equalsPoint(0, 0);
  const cathetus = tools.cathetus(72/2);
  expect(diagonal.pointAtBisector()).equalsPoint(55+cathetus, 55+cathetus);
});


tools.test( function moveStartPoint() {
  const vertical = rac.Segment(100, 0, rac.Angle.down, 100);

  // startPoint to zero
  expect(vertical.moveStartPoint(rac.Point.zero))
    .equalsSegment(0, 0, 1/8, tools.hypotenuse(100));
  // same startPoint
  expect(vertical.moveStartPoint(rac.Point(100, 0)))
    .equalsSegment(100, 0, rac.Angle.down, 100);
  // startPoint to endPoint
  expect(vertical.moveStartPoint(rac.Point(100, 100)))
    .equalsSegment(100, 100, rac.Angle.down, 0);
});


tools.test( function moveEndPoint() {
  const vertical = rac.Segment(100, 0, rac.Angle.down, 100);

  // same endPoint
  expect(vertical.moveEndPoint(rac.Point(100, 100)))
    .equalsSegment(100, 0, rac.Angle.down, 100);
  // endPoint to zero
  expect(vertical.moveEndPoint(rac.Point.zero))
    .equalsSegment(100, 0, rac.Angle.left, 100);
  // endPoint to startPoint
  expect(vertical.moveEndPoint(rac.Point(100, 0)))
    .equalsSegment(100, 0, rac.Angle.down, 0);
});


tools.test( function segmentToBisector() {
  expect(vertical.segmentToBisector())
    .equalsSegment(100, 100, rac.Angle.down, 36);
  expect(horizontal.segmentToBisector())
    .equalsSegment(100, 100, rac.Angle.right, 36);

  expect(rac.Segment.zero.segmentToBisector())
    .equalsSegment(0, 0, rac.Angle.zero, 0);
  expect(rac.Segment.zero.withAngle(3/4).segmentToBisector())
    .equalsSegment(0, 0, 3/4, 0);
});


tools.test( function segmentBisector() {
  const cathetus = 55 + tools.cathetus(36);
  expect(diagonal.segmentBisector())
    .equalsSegment(cathetus, cathetus, 3/8, 72);
  expect(diagonal.segmentBisector(null))
    .equalsSegment(cathetus, cathetus, 3/8, 72);
  expect(diagonal.segmentBisector(null, false))
    .equalsSegment(cathetus, cathetus, 7/8, 72);
  expect(diagonal.segmentBisector(100))
    .equalsSegment(cathetus, cathetus, 3/8, 100);
  expect(diagonal.segmentBisector(100, false))
    .equalsSegment(cathetus, cathetus, 7/8, 100);
});


tools.test( function nextSegmentWithLength() {
  const cathetus = 55 + tools.cathetus(72);
  expect(diagonal.nextSegmentWithLength(0))
    .equalsSegment(cathetus, cathetus, 1/8, 0);
  expect(diagonal.nextSegmentWithLength(10))
    .equalsSegment(cathetus, cathetus, 1/8, 10);
});



tools.test( function nextSegmentToPoint() {
  const cathetus = 55 + tools.cathetus(72);
  expect(diagonal.nextSegmentToPoint(rac.Point(cathetus, cathetus)))
    .equalsSegment(cathetus, cathetus, 1/8, 0);
  expect(vertical.nextSegmentToPoint(rac.Point(100, 172)))
    .equalsSegment(100, 172, rac.Angle.down, 0);

  expect(diagonal.nextSegmentToPoint(rac.Point.zero))
    .equalsSegment(cathetus, cathetus, 5/8, tools.hypotenuse(cathetus));
  expect(diagonal.nextSegmentToPoint(rac.Point(0, cathetus*2)))
    .equalsSegment(cathetus, cathetus, 3/8, tools.hypotenuse(cathetus));
});


tools.test( function nextSegmentToAngle() {
  // Angle/number parameter
  expect(vertical.nextSegmentToAngle(1/2))
    .equalsSegment(100, 172, 1/2, 72);
  expect(vertical.nextSegmentToAngle(rac.Angle.half))
    .equalsSegment(100, 172, 1/2, 72);

  // null length
  expect(vertical.nextSegmentToAngle(5/8, null))
    .equalsSegment(100, 172, 5/8, 72);

  // with length
  expect(horizontal.nextSegmentToAngle(7/8, 0))
    .equalsSegment(172, 100, 7/8, 0);
  expect(horizontal.nextSegmentToAngle(7/8, 55))
    .equalsSegment(172, 100, 7/8, 55);
});


tools.test( function nextSegmentToAngleDistance() {
  const cathetus = 55 + tools.cathetus(72);

  // Angle/number parameter
  expect(diagonal.nextSegmentToAngleDistance(0))
    .equalsSegment(cathetus, cathetus, 5/8, 72);
  expect(diagonal.nextSegmentToAngleDistance(rac.Angle.zero))
    .equalsSegment(cathetus, cathetus, 5/8, 72);

  // Clockwise, counter-clockwise
  expect(diagonal.nextSegmentToAngleDistance(1/4))
    .equalsSegment(cathetus, cathetus, 7/8, 72);
  expect(diagonal.nextSegmentToAngleDistance(1/4, false))
    .equalsSegment(cathetus, cathetus, 3/8, 72);

  // null lenght
  expect(diagonal.nextSegmentToAngleDistance(1/4, true, null))
    .equalsSegment(cathetus, cathetus, 7/8, 72);

  // with length
  expect(diagonal.nextSegmentToAngleDistance(1/4, false, 0))
    .equalsSegment(cathetus, cathetus, 3/8, 0);
  expect(diagonal.nextSegmentToAngleDistance(1/4, false, 100))
    .equalsSegment(cathetus, cathetus, 3/8, 100);
});


tools.test( function nextSegmentPerpendicular() {
  const cathetus = 55 + tools.cathetus(72);

  expect(diagonal.nextSegmentPerpendicular())
    .equalsSegment(cathetus, cathetus, 7/8, 72);
  expect(diagonal.nextSegmentPerpendicular(false))
    .equalsSegment(cathetus, cathetus, 3/8, 72);

  expect(diagonal.nextSegmentPerpendicular(true, null))
    .equalsSegment(cathetus, cathetus, 7/8, 72);

  expect(diagonal.nextSegmentPerpendicular(false, 0))
    .equalsSegment(cathetus, cathetus, 3/8, 0);
  expect(diagonal.nextSegmentPerpendicular(false, 100))
    .equalsSegment(cathetus, cathetus, 3/8, 100);
});


tools.test( function nextSegmentLegWithHyp() {
  // with short side
  const shortCathetus = 55 + tools.cathetus(30);
  const shortLeg = rac.Segment(55, 55, 1/8, 30);
  expect(shortLeg.nextSegmentLegWithHyp(50))
    .equalsSegment(shortCathetus, shortCathetus, 7/8, 40);
  expect(shortLeg.nextSegmentLegWithHyp(50, false))
    .equalsSegment(shortCathetus, shortCathetus, 3/8, 40);

  // hyp same as ops
  expect(shortLeg.nextSegmentLegWithHyp(30))
    .equalsSegment(shortCathetus, shortCathetus, 7/8, 0);
  expect(shortLeg.nextSegmentLegWithHyp(30, false))
    .equalsSegment(shortCathetus, shortCathetus, 3/8, 0);

  // with long side
  const longCathetus = 55 + tools.cathetus(40);
  const longLeg = rac.Segment(55, 55, 1/8, 40);
  expect(longLeg.nextSegmentLegWithHyp(50))
    .equalsSegment(longCathetus, longCathetus, 7/8, 30);
  expect(longLeg.nextSegmentLegWithHyp(50, false))
    .equalsSegment(longCathetus, longCathetus, 3/8, 30);

  // hyp shorter that ops
  expect(longLeg.nextSegmentLegWithHyp(39)).toBe(null);
  expect(longLeg.nextSegmentLegWithHyp(39, false)).toBe(null);
});


tools.test( function arc() {
  // default
  expect(diagonal.arc()).equalsArc(55, 55, 72, 1/8, 1/8, true);

  // Angle/number parameter
  expect(diagonal.arc(1/2))
    .equalsArc(55, 55, 72, 1/8, 1/2, true);
  expect(diagonal.arc(rac.Angle.half))
    .equalsArc(55, 55, 72, 1/8, 1/2, true);

  // clocwise, counter-clockwise
  expect(diagonal.arc(3/8))
    .equalsArc(55, 55, 72, 1/8, 3/8, true);
  expect(diagonal.arc(3/8, false))
    .equalsArc(55, 55, 72, 1/8, 3/8, false);

  // null endAngle
  expect(diagonal.arc(null, false))
    .equalsArc(55, 55, 72, 1/8, 1/8, false);
});


tools.test( function arcWithAngleDistance() {
  // Angle/number parameter
  expect(diagonal.arcWithAngleDistance(0))
    .equalsArc(55, 55, 72, 1/8, 1/8, true);
  expect(diagonal.arcWithAngleDistance(rac.Angle.zero))
    .equalsArc(55, 55, 72, 1/8, 1/8, true);

  // clocwise, counter-clockwise
  expect(diagonal.arcWithAngleDistance(1/4))
    .equalsArc(55, 55, 72, 1/8, 3/8, true);
  expect(diagonal.arcWithAngleDistance(1/4, false))
    .equalsArc(55, 55, 72, 1/8, 7/8, false);

  // zero distance
  expect(diagonal.arcWithAngleDistance(0))
    .equalsArc(55, 55, 72, 1/8, 1/8, true);
  expect(diagonal.arcWithAngleDistance(0, false))
    .equalsArc(55, 55, 72, 1/8, 1/8, false);
});


tools.test( function text() {
  const ha = Rac.Text.Format.horizontalAlign;
  const va = Rac.Text.Format.verticalAlign;

  const defaultSphinx = diagonal.text('sphinx');
  expect(defaultSphinx).equalsText(55, 55, 'sphinx');
  expect(defaultSphinx.format).equalsTextFormat(ha.left, va.top, 1/8);

  const formattedVow = vertical.text('vow', rac.Text.Format.centered);
  expect(formattedVow).equalsText(100, 100, 'vow');
  expect(formattedVow.format).equalsTextFormat(ha.center, va.center, 1/4);
});


// Full coverage!

