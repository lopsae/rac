(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'useStrict';

// Ruler and Compass - version
module.exports = '0.9.14-dev-121-0e8ba35'


},{}],2:[function(require,module,exports){
'use strict';


module.exports = function attachProtoFunctions(rac) {

  function checkDrawer(rac) {
    if (rac.drawer === null) {
      console.trace(`Drawer is not setup`);
      throw rac.Error.drawerNotSetup;
    }
  }


  // Container of prototype functions for drawable classes.
  rac.drawableProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `rac.drawableProtoFunctions`. These are functions shared by all
  // drawable objects (E.g. `draw()` and `debug()`).
  rac.setupDrawableProtoFunctions = function(classObj) {
    Object.keys(rac.drawableProtoFunctions).forEach(name => {
      classObj.prototype[name] = rac.drawableProtoFunctions[name];
    });
  }


  rac.drawableProtoFunctions.draw = function(style = null){
    checkDrawer(rac);

    rac.drawer.drawObject(this, style);
    return this;
  };

  rac.drawableProtoFunctions.debug = function(drawsText = false){
    checkDrawer(rac);

    rac.drawer.debugObject(this, drawsText);
    return this;
  };


  rac.stack = [];

  rac.stack.peek = function() {
    return rac.stack[rac.stack.length - 1];
  }

  rac.drawableProtoFunctions.push = function() {
    rac.stack.push(this);
    return this;
  }

  rac.drawableProtoFunctions.pop = function() {
    return rac.stack.pop();
  }

  rac.drawableProtoFunctions.peek = function() {
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

  rac.drawableProtoFunctions.attachToShape = function() {
    if (rac.currentShape === null) {
      rac.currentShape = new rac.Shape();
    }

    this.attachTo(rac.currentShape);
    return this;
  }

  rac.drawableProtoFunctions.popShape = function() {
    return rac.popShape();
  }

  rac.drawableProtoFunctions.popShapeToComposite = function() {
    let shape = rac.popShape();
    shape.attachToComposite();
    return this;
  }

  rac.drawableProtoFunctions.attachToComposite = function() {
    if (rac.currentComposite === null) {
      rac.currentComposite = new rac.Composite();
    }

    this.attachTo(rac.currentComposite);
    return this;
  }

  rac.drawableProtoFunctions.popComposite = function() {
    return rac.popComposite();
  }

  rac.drawableProtoFunctions.attachTo = function(someComposite) {
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


  // Container of prototype functions for style classes.
  rac.styleProtoFunctions = {};

  // Adds to the given class prototype all the functions contained in
  // `rac.styleProtoFunctions`. These are functions shared by all
  // style objects (E.g. `apply()`).
  rac.setupStyleProtoFunctions = function(classObj) {
    Object.keys(rac.styleProtoFunctions).forEach(name => {
      classObj.prototype[name] = rac.styleProtoFunctions[name];
    });
  }


  rac.styleProtoFunctions.apply = function(){
    checkDrawer(rac);
    rac.drawer.applyObject(this);
  };

} // attachProtoFunctions

},{}],3:[function(require,module,exports){
'use strict';


module.exports = function makeArcControl(rac) {

  // Control that uses an Arc as anchor.
  return class RacArcControl extends rac.Control {

    // Creates a new Control instance with the given `value` and an
    // `angleDistance` from `someAngleDistance`.
    // By default the value range is [0,1] and limits are set to be the equal
    // as `startValue` and `endValue`.
    constructor(value, someAngleDistance, startValue = 0, endValue = 1) {
      super(value, startValue, endValue);

      // Angle distance for the copied anchor object.
      this.angleDistance = rac.Angle.from(someAngleDistance);

      // `Arc`` to which the control will be anchored. When the control is
      // drawn and interacted a copy of the anchor is created with the
      // control's `angleDistance`.
      this.anchor = null;
    }

    setValueWithAngleDistance(someAngleDistance) {
      let angleDistance = rac.Angle.from(someAngleDistance)
      let angleDistanceRatio = angleDistance.turn / this.angleDistance.turnOne();
      this.value = this.valueOf(angleDistanceRatio);
    }

    setLimitsWithAngleDistanceInsets(startInset, endInset) {
      startInset = rac.Angle.from(startInset);
      endInset = rac.Angle.from(endInset);
      this.startLimit = this.valueOf(startInset.turn / this.angleDistance.turnOne());
      this.endLimit = this.valueOf((this.angleDistance.turnOne() - endInset.turn) / this.angleDistance.turnOne());
    }

    // TODO: rename control.center to control.knob or similar
    // Returns the angle distance from `anchor.start` to the control center.
    distance() {
      return this.angleDistance.multOne(this.ratioValue());
    }

    center() {
      // Not posible to calculate a center
      if (this.anchor === null) { return null; }
      return this.anchor.withAngleDistance(this.distance()).endPoint();
    }

    // Creates a copy of the current `anchor` with the control's
    // `angleDistance`.
    copyAnchor() {
      // No anchor to copy
      if (this.anchor === null) { return null; }
      return this.anchor.withAngleDistance(this.angleDistance);
    }

    draw() {
      let anchorCopy = this.copyAnchor();

      let anchorStyle = this.style !== null
        ? this.style.withFill(rac.Fill.none)
        : null;
      anchorCopy.draw(anchorStyle);

      let center = this.center();
      let angle = anchorCopy.center.angleToPoint(center);

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let markerAngleDistance = this.angleDistance.multOne(markerRatio);
        let markerAngle = anchorCopy.shiftAngle(markerAngleDistance);
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
      let angleDistance = anchorCopy.angleDistance();
      let startInset = angleDistance.multOne(this.ratioStartLimit());
      let endInset = angleDistance.multOne(1 - this.ratioEndLimit());

      let selectionAngle = anchorCopy.center
        .angleToPoint(pointerControlCenter);
      selectionAngle = anchorCopy.clampToInsets(selectionAngle,
        startInset, endInset);
      let newDistance = anchorCopy.distanceFromStart(selectionAngle);

      // Update control with new distance
      let lengthRatio = newDistance.turn / this.angleDistance.turnOne();
      this.value = this.valueOf(lengthRatio);
    }

    drawSelection(pointerCenter, anchorCopy, pointerOffset) {
      anchorCopy.attachToComposite();

      let angleDistance = anchorCopy.angleDistance();

      // Value markers
      this.markers.forEach(item => {
        let markerRatio = this.ratioOf(item);
        if (markerRatio < 0 || markerRatio > 1) { return }
        let markerAngle = anchorCopy.shiftAngle(angleDistance.multOne(markerRatio));
        let markerPoint = anchorCopy.pointAtAngle(markerAngle);
        rac.Control.makeValueMarker(markerPoint, markerAngle.perpendicular(!anchorCopy.clockwise))
          .attachToComposite();
      });

      // Limit markers
      let ratioStartLimit = this.ratioStartLimit();
      if (ratioStartLimit > 0) {
        let minAngle = anchorCopy.shiftAngle(angleDistance.multOne(ratioStartLimit));
        let minPoint = anchorCopy.pointAtAngle(minAngle);
        let markerAngle = minAngle.perpendicular(anchorCopy.clockwise);
        rac.Control.makeLimitMarker(minPoint, markerAngle)
          .attachToComposite();
      }

      let ratioEndLimit = this.ratioEndLimit();
      if (ratioEndLimit < 1) {
        let maxAngle = anchorCopy.shiftAngle(angleDistance.multOne(ratioEndLimit));
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

  } // RacArcControl

} // makeArcControl


},{}],4:[function(require,module,exports){
'use strict';


module.exports = function makeControl(rac) {

  // Parent class for all controls for manipulating a value with the pointer.
  // Represents a control with a value, value-range, limits, markers, and
  // drawing style. By default the control returns a `value` in the range
  // [0,1] coresponding to the location of the control center in relation to
  // the anchor shape. The value-range is defined by `startValue` and
  // `endValue`.
  class RacControl {

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
        this.pointerOffset = rac.Point.pointer().segmentToPoint(control.center());
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
      if (RacControl.selection === null) {
        return false;
      }
      return RacControl.selection.control === this;
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

  } // RacControl


  // Controls shared drawing elements

  RacControl.makeArrowShape = function(center, angle) {
    // Arc
    let angleDistance = rac.Angle.from(1/22);
    let arc = center.arc(RacControl.radius * 1.5,
      angle.sub(angleDistance), angle.add(angleDistance));

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

  RacControl.makeLimitMarker = function(point, someAngle) {
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

  RacControl.makeValueMarker = function(point, someAngle) {
    let angle = rac.Angle.from(someAngle);
    return point.segmentToAngle(angle.perpendicular(), 3)
      .withStartExtended(3);
  };


  // Control pointer and interaction

  // Call to signal the pointer being pressed. If the ponter hits a control
  // it will be considered selected. When a control is selected a copy of its
  // anchor is stored as to allow interaction with a fixed anchor.
  RacControl.pointerPressed = function(pointerCenter) {
    RacControl.lastPointer = null;

    // Test pointer hit
    let selected = RacControl.controls.find(item => {
      let controlCenter = item.center();
      if (controlCenter === null) { return false; }
      if (controlCenter.distanceToPoint(pointerCenter) <= RacControl.radius) {
        return true;
      }
      return false;
    });

    if (selected === undefined) {
      return;
    }

    RacControl.selection = new RacControl.Selection(selected, pointerCenter);
  };


  // Call to signal the pointer being dragged. As the pointer moves the
  // selected control is updated with a new `distance`.
  RacControl.pointerDragged = function(pointerCenter){
    if (RacControl.selection === null) {
      return;
    }

    let control = RacControl.selection.control;
    let anchorCopy = RacControl.selection.anchorCopy;

    // Center of dragged control in the pointer current position
    let currentPointerControlCenter = RacControl.selection.pointerOffset
      .translateToStart(pointerCenter)
      .end;

    control.updateWithPointer(currentPointerControlCenter, anchorCopy);
  };


  // Call to signal the pointer being released. Upon release the selected
  // control is cleared.
  RacControl.pointerReleased = function(pointerCenter) {
    if (RacControl.selection === null) {
      RacControl.lastPointer = pointerCenter;
      return;
    }

    RacControl.lastPointer = RacControl.selection.control;
    RacControl.selection = null;
  };


  // Draws controls and the visuals of pointer and control selection. Usually
  // called at the end of `draw` so that controls sits on top of the drawing.
  RacControl.drawControls = function() {
    let pointerStyle = RacControl.pointerStyle;

    // Last pointer or control
    if (RacControl.lastPointer instanceof rac.Point) {
      RacControl.lastPointer.arc(12).draw(pointerStyle);
    }
    if (RacControl.lastPointer instanceof RacControl) {
      // TODO: implement last selected control state
    }

    // Pointer pressed
    let pointerCenter = rac.Point.pointer();
    if (rac.drawer.p5.mouseIsPressed) {
      if (RacControl.selection === null) {
        pointerCenter.arc(10).draw(pointerStyle);
      } else {
        pointerCenter.arc(5).draw(pointerStyle);
      }
    }

    // All controls in display
    RacControl.controls.forEach(item => item.draw());

    // Rest is Control selection visuals
    if (RacControl.selection === null) {
      return;
    }

    RacControl.selection.drawSelection(pointerCenter);
  };


  return RacControl;

} // makeControl


},{}],5:[function(require,module,exports){
'use strict';


module.exports = function makeSegmentControl(rac) {

  // Control that uses a Segment as anchor.
  return class RacSegmentControl extends rac.Control {

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

  } // RacSegmentControl

} // makeSegmentControl


},{}],6:[function(require,module,exports){
'use strict';


module.exports = function makeAngle(rac) {

  let RacAngle = function RacAngle(turn) {
    this.setTurn(turn);
  };

  RacAngle.from = function(something) {
    if (something instanceof RacAngle) {
      return something;
    }
    if (typeof something === "number") {
      return new RacAngle(something);
    }
    if (something instanceof rac.Segment) {
      return something.angle();
    }

    console.trace(`Cannot convert to rac.Angle - something-type:${rac.typeName(something)}`);
    throw rac.Error.invalidObjectToConvert;
  }

  RacAngle.fromRadians = function(radians) {
    return new RacAngle(radians / rac.TAU);
  };

  RacAngle.fromPoint = function(point) {
    return RacAngle.fromRadians(Math.atan2(point.y, point.x));
  };

  RacAngle.fromSegment = function(segment) {
    return segment.start.angleToPoint(segment.end);
  };

  RacAngle.prototype.setTurn = function(turn) {
    this.turn = turn % 1;
    if (this.turn < 0) {
      this.turn = (this.turn + 1) % 1;
    }
    return this;
  };

  // If `turn`` is zero returns 1 instead, otherwise returns `turn`.
  RacAngle.prototype.turnOne = function() {
    if (this.turn === 0) { return 1; }
    return this.turn;
  }

  RacAngle.prototype.add = function(someAngle) {
    let other = RacAngle.from(someAngle);
    return new RacAngle(this.turn + other.turn);
  };

  RacAngle.prototype.substract = function(someAngle) {
    let other = RacAngle.from(someAngle);
    return new RacAngle(this.turn - other.turn);
  };

  RacAngle.prototype.sub = function(someAngle) {
    return this.substract(someAngle);
  };

  // Returns the equivalent to `someAngle` shifted to have `this` as the
  // origin, in the `clockwise` orientation.
  //
  // For angle at `0.1`, `shift(0.5)` will return a `0.6` angle.
  // For a clockwise orientation, equivalent to `this + someAngle`.
  RacAngle.prototype.shift = function(someAngle, clockwise = true) {
    let angle = RacAngle.from(someAngle);
    return clockwise
      ? this.add(angle)
      : this.sub(angle);
  };

  // Returns the equivalent of `this` when `someOrigin` is considered the
  // origin, in the `clockwise` orientation.
  // TODO: add example and difference to shift
  RacAngle.prototype.shiftToOrigin = function(someOrigin, clockwise) {
    let origin = RacAngle.from(someOrigin);
    return origin.shift(this, clockwise);
  };

  // Returns `factor * turn`.
  RacAngle.prototype.mult = function(factor) {
    return new RacAngle(this.turn * factor);
  };

  // Returns `factor * turnOne()`, where `turn` is considered in the
  // range (0, 1].
  // Useful when doing ratio calculation where a zero angle corresponds to
  // a complete-circle since:
  // ```
  // rac.Angle(0).mult(0.5) // returns rac.Angle(0)
  // // whereas
  // rac.Angle(0).multOne(0.5) // return rac.Angle(0.5)
  // ```
  RacAngle.prototype.multOne = function(factor) {
    return new RacAngle(this.turnOne() * factor);
  };

  // Returns `this` adding half a turn.
  RacAngle.prototype.inverse = function() {
    return this.add(RacAngle.inverse);
  };

  RacAngle.prototype.negative = function() {
    return new RacAngle(-this.turn);
  };

  RacAngle.prototype.perpendicular = function(clockwise = true) {
    return this.shift(RacAngle.square, clockwise);
  };

  // Returns an Angle that represents the distance from `this` to `someAngle`
  // traveling in the `clockwise` orientation.
  RacAngle.prototype.distance = function(someAngle, clockwise = true) {
    let other = RacAngle.from(someAngle);
    let distance = other.substract(this);
    return clockwise
      ? distance
      : distance.negative();
  };

  RacAngle.prototype.radians = function() {
    return this.turn * rac.TAU;
  };

  RacAngle.prototype.degrees = function() {
    return this.turn * 360;
  };

  RacAngle.zero =    new RacAngle(0.0);
  RacAngle.square =  new RacAngle(1/4);
  RacAngle.inverse = new RacAngle(1/2);

  RacAngle.half =    new RacAngle(1/2);
  RacAngle.quarter = new RacAngle(1/4);
  RacAngle.eighth =  new RacAngle(1/8);

  RacAngle.e = new RacAngle(0/4);
  RacAngle.s = new RacAngle(1/4);
  RacAngle.w = new RacAngle(2/4);
  RacAngle.n = new RacAngle(3/4);

  RacAngle.east  = RacAngle.e;
  RacAngle.south = RacAngle.s;
  RacAngle.west  = RacAngle.w;
  RacAngle.north = RacAngle.n;

  RacAngle.ne = RacAngle.n.add(1/8);
  RacAngle.se = RacAngle.e.add(1/8);
  RacAngle.sw = RacAngle.s.add(1/8);
  RacAngle.nw = RacAngle.w.add(1/8);

  // North north-east
  RacAngle.nne = RacAngle.ne.add(-1/16);
  // East north-east
  RacAngle.ene = RacAngle.ne.add(+1/16);
  // North-east north
  RacAngle.nen = RacAngle.nne;
  // North-east east
  RacAngle.nee = RacAngle.ene;

  // East south-east
  RacAngle.ese = RacAngle.se.add(-1/16);
  // South south-east
  RacAngle.sse = RacAngle.se.add(+1/16);
  // South-east east
  RacAngle.see = RacAngle.ese;
  // South-east south
  RacAngle.ses = RacAngle.sse;

  // South south-west
  RacAngle.ssw = RacAngle.sw.add(-1/16);
  // West south-west
  RacAngle.wsw = RacAngle.sw.add(+1/16);
  // South-west south
  RacAngle.sws = RacAngle.ssw;
  // South-west west
  RacAngle.sww = RacAngle.wsw;

  // West north-west
  RacAngle.wnw = RacAngle.nw.add(-1/16);
  // North north-west
  RacAngle.nnw = RacAngle.nw.add(+1/16);
  // Nort-hwest west
  RacAngle.nww = RacAngle.wnw;
  // North-west north
  RacAngle.nwn = RacAngle.nnw;

  RacAngle.right = RacAngle.e;
  RacAngle.down  = RacAngle.s;
  RacAngle.left  = RacAngle.w;
  RacAngle.up    = RacAngle.n;

  RacAngle.r = RacAngle.right;
  RacAngle.d = RacAngle.down;
  RacAngle.l = RacAngle.left;
  RacAngle.u = RacAngle.up;

  RacAngle.top    = RacAngle.up;
  RacAngle.bottom = RacAngle.down;
  RacAngle.t      = RacAngle.top;
  RacAngle.b      = RacAngle.bottom;


  return RacAngle;

} // makeAngle


},{}],7:[function(require,module,exports){
'use strict';


module.exports = function makeArc(rac) {

  class RacArc {

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
      return new RacArc(
        this.center,
        this.radius,
        this.start,
        this.end,
        this.clockwise);
    }

    reverse() {
      return new RacArc(
        this.center, this.radius,
        this.end, this.start,
        !this.clockwise);
    }

    length() {
      return this.angleDistance().turnOne() * this.radius * rac.TAU;
    }

    // Returns an Angle that represents the distance between `this.start`
    // and `this.end`, in the orientation of the arc.
    angleDistance() {
      return this.start.distance(this.end, this.clockwise);
    }

    startPoint() {
      return this.pointAtAngle(this.start);
    }

    endPoint() {
      return this.pointAtAngle(this.end);
    }

    // Returns the segment from `center` to `startPoint()`.
    //
    // Note that the segment starts at `center`, in contrast to
    // `endSegment` which ends at `center`.
    startSegment() {
      return new rac.Segment(this.center, this.startPoint());
    }

    // Returns the segment from `endPoint` to `center`.
    //
    // Note that the segment ends at `center`, in contrast to
    // `startSegment` which starts at `center`.
    endSegment() {
      return new rac.Segment(this.endPoint(), this.center);
    }

    // Returns the segment from `startPoint()` to `endPoint()`. Note that
    // for complete-circle arcs this segment will have a length of zero.
    chordSegment() {
      return new rac.Segment(this.startPoint(), this.endPoint());
    }

    withCenter(newCenter) {
      return new RacArc(
        newCenter, this.radius,
        this.start, this.end,
        this.clockwise);
    }

    withStart(newStart) {
      let newStartAngle = rac.Angle.from(newStart);
      return new RacArc(
        this.center, this.radius,
        newStartAngle, this.end,
        this.clockwise);
    }

    withEnd(newEnd) {
      let newEndAngle = rac.Angle.from(newEnd);
      return new RacArc(
        this.center, this.radius,
        this.start, newEndAngle,
        this.clockwise);
    }

    withRadius(newRadius) {
      return new RacArc(
        this.center, newRadius,
        this.start, this.end,
        this.clockwise);
    }

    withAngleDistance(newAngleDistance) {
      let newEnd = this.angleAtAngleDistance(newAngleDistance);
      return new RacArc(
        this.center, this.radius,
        this.start, newEnd,
        this.clockwise);
    }

    withLength(newLength) {
      let circumference = this.radius * rac.TAU;
      let newAngleDistance = newLength / circumference;
      return this.withAngleDistance(newAngleDistance);
    }

    withLengthRatio(ratio) {
      let newLength = this.length() * ratio;
      return this.withLength(newLength);
    }

    withClockwise(newClockwise) {
      return new RacArc(
        this.center, this.radius,
        this.start, this.end,
        newClockwise);
    }

    withStartTowardsPoint(point) {
      let newStart = this.center.angleToPoint(point);
      return new RacArc(
        this.center, this.radius,
        newStart, this.end,
        this.clockwise);
    }

    withEndTowardsPoint(point) {
      let newEnd = this.center.angleToPoint(point);
      return new RacArc(
        this.center, this.radius,
        this.start, newEnd,
        this.clockwise);
    }

    withStartEndTowardsPoint(startPoint, endPoint) {
      let newStart = this.center.angleToPoint(startPoint);
      let newEnd = this.center.angleToPoint(endPoint);
      return new RacArc(
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
      let shiftedEndClamp = this.angleDistance().substract(endInset);

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

  } // RacArc


  // Returns `true` if the given angle is positioned between `start` and
  // `end` in the `clockwise` orientation. For complete circle arcs `true` is
  // always returned.
  RacArc.prototype.containsAngle = function(someAngle) {
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
  RacArc.prototype.containsProjectedPoint = function(point) {
    if (this.isCircle()) { return true; }
    return this.containsAngle(this.center.angleToPoint(point));
  }

  // Returns a segment for the chord formed by the intersection of `this` and
  // `other`; or return `null` if there is no intersection.
  // Both arcs are considered complete circles for the calculation of the
  // chord, thus the endpoints of the returned segment may not lay inside the
  // actual arcs.
  RacArc.prototype.intersectionChord = function(other) {
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
  RacArc.prototype.intersectionArc = function(other) {
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

    return new RacArc(
      this.center, this.radius,
      startAngle,
      endAngle,
      this.clockwise);
  };

  // Returns only intersecting points.
  RacArc.prototype.intersectingPointsWithArc = function(other) {
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
  RacArc.prototype.intersectionChordWithSegment = function(segment) {
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
  RacArc.prototype.chordEndOrProjectionWithSegment = function(segment) {
    let chord = this.intersectionChordWithSegment(segment);
    if (chord !== null) {
      return chord.end;
    }

    let centerOrientation = segment.pointOrientation(this.center);
    let perpendicular = segment.angle().perpendicular(!centerOrientation);
    return this.pointAtAngle(perpendicular);
  };

  RacArc.prototype.radiusSegmentAtAngle = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.center.segmentToAngle(angle, this.radius);
  }

  RacArc.prototype.radiusSegmentTowardsPoint = function(point) {
    let angle = this.center.angleToPoint(point);
    return this.center.segmentToAngle(angle, this.radius);
  }

  // Returns the equivalent to `someAngle` shifted to have `this.start` as
  // origin, in the orientation of the arc.
  // Useful to determine an angle inside the arc, where the arc is considered
  // the origin coordinate system.
  // For a clockwise arc starting at `0.5`, a `shiftAngle(0.1)` is `0.6`.
  // For a clockwise orientation, equivalent to `this.start + someAngle`.
  RacArc.prototype.shiftAngle = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.start.shift(angle, this.clockwise);
  }

  // Returns an Angle that represents the distance from `this.start` to
  // `someAngle` traveling in the `clockwise` orientation.
  // Useful to determine for a given angle, where it sits inside the arc if
  // the arc was the origin coordinate system.
  // For a clockwise arc starting at `0.1`, a `distanceFromStart(0.5)` is `0.4`.
  // For a clockwise orientation, equivalent to `someAngle - this.start`.
  RacArc.prototype.distanceFromStart = function(someAngle) {
    let angle = rac.Angle.from(someAngle);
    return this.start.distance(angle, this.clockwise);
  }

  // Returns the Angle at the given arc length from `start`. Equivalent to
  // `shiftAngle(someAngle)`.
  RacArc.prototype.angleAtAngleDistance = function(someAngle) {
    return this.shiftAngle(someAngle);
  }

  // Returns the point in the arc at the given angle shifted by `this.start`
  // in the arc orientation. The arc is considered a complete circle.
  RacArc.prototype.pointAtAngleDistance = function(someAngle) {
    let shiftedAngle = this.shiftAngle(someAngle);
    return this.pointAtAngle(shiftedAngle);
  };

  // Returns the point in the arc at the current arc length multiplied by
  // `angleDistanceRatio` and then shifted by `this.start` in the arc
  // orientation. The arc is considered a complete circle.
  RacArc.prototype.pointAtAngleDistanceRatio = function(angleDistanceRatio) {
    let newAngleDistance = this.angleDistance().multOne(angleDistanceRatio);
    let shiftedAngle = this.shiftAngle(newAngleDistance);
    return this.pointAtAngle(shiftedAngle);
  };

  // Returns the point in the arc at the given angle. The arc is considered
  // a complete circle.
  RacArc.prototype.pointAtAngle = function(someAngle) {
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
  RacArc.prototype.segmentTangentToArc = function(otherArc, startClockwise = true, endClockwise = true) {
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

  // Returns an array containing the arc divided into `arcCount` arcs, each
  // with the same `angleDistance`.
  RacArc.prototype.divideToArcs = function(arcCount) {
    if (arcCount <= 0) { return []; }

    let angleDistance = this.angleDistance();
    let partTurn = angleDistance.turnOne() / arcCount;

    let partAngleDistance = new rac.Angle(partTurn);

    let arcs = [];
    for (let index = 0; index < arcCount; index++) {
      let start = this.start.shift(partTurn * index, this.clockwise);
      let end = this.start.shift(partTurn * (index+1), this.clockwise);
      let arc = new rac.Arc(this.center, this.radius, start, end, this.clockwise);
      arcs.push(arc);
    }

    return arcs;
  };

  RacArc.prototype.divideToSegments = function(segmentCount) {
    let angleDistance = this.angleDistance();
    let partTurn = angleDistance.turnOne() / segmentCount;

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
  };

  RacArc.prototype.divideToBeziers = function(bezierCount) {
    let angleDistance = this.angleDistance();
    let partTurn = angleDistance.turn == 0
    // TODO: use turnOne? when possible to test
      ? 1 / bezierCount
      : angleDistance.turn / bezierCount;

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
        .nextSegmentToAngleShift(rac.Angle.square, tangent, !this.clockwise)
        .end;
      let endAnchor = endRay
        .nextSegmentToAngleShift(rac.Angle.square, tangent, this.clockwise)
        .end;

      beziers.push(new rac.Bezier(
        startRay.end, startAnchor,
        endAnchor, endRay.end));
    }, this);

    return new rac.Composite(beziers);
  };


  return RacArc;


} // makeArc


},{}],8:[function(require,module,exports){
'use strict';


module.exports = function makeBezier(rac) {

  let RacBezier = function RacBezier(start, startAnchor, endAnchor, end) {
    this.start = start;
    this.startAnchor = startAnchor;
    this.endAnchor = endAnchor;
    this.end = end;
  };


  RacBezier.prototype.drawAnchors = function(style = undefined) {
    push();
    if (style !== undefined) {
      style.apply();
    }
    this.start.segmentToPoint(this.startAnchor).draw();
    this.end.segmentToPoint(this.endAnchor).draw();
    pop();
  };

  RacBezier.prototype.reverse = function() {
    return new RacBezier(
      this.end, this.endAnchor,
      this.startAnchor, this.start);
  };


  return RacBezier;

} // makeBezier


},{}],9:[function(require,module,exports){
'use strict';


module.exports = function makeComposite(rac) {

  // Contains a sequence of geometry objects which can be drawn or vertex
  // together.
  let RacComposite = function RacComposite(sequence = []) {
    this.sequence = sequence;
  };


  RacComposite.prototype.isNotEmpty = function() {
    return this.sequence.length != 0;
  };

  RacComposite.prototype.add = function(element) {
    if (element instanceof Array) {
      element.forEach(item => this.sequence.push(item));
      return
    }
    this.sequence.push(element);
  };

  RacComposite.prototype.reverse = function() {
    let reversed = this.sequence.map(item => item.reverse())
      .reverse();
    return new RacComposite(reversed);
  };


  return RacComposite;

} // makeComposite


},{}],10:[function(require,module,exports){
'use strict';


module.exports = function makePoint(rac) {

  class RacPoint{

    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    text(string, format, rotation = rac.Angle.zero) {
      return new rac.Text(string, format, this, rotation);
    }

    withX(newX) {
      return new RacPoint(newX, this.y);
    }

    withY(newY) {
      return new RacPoint(this.x, newY);
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

  } // RacPoint


  RacPoint.prototype.add = function(other, y = undefined) {
    if (other instanceof RacPoint && y === undefined) {
      return new RacPoint(
        this.x + other.x,
        this.y + other.y);
    }

    if (typeof other === "number" && typeof y === "number") {
      let x = other;
      return new RacPoint(
        this.x + x,
        this.y + y);
    }

    console.trace(`Invalid parameter combination - other-type:${rac.typeName(other)} y-type:${rac.typeName(y)}`);
    throw rac.Error.invalidParameterCombination;
  };

  RacPoint.prototype.substract = function(other, y = undefined) {
    if (other instanceof RacPoint && y === undefined) {
      return new RacPoint(
        this.x - other.x,
        this.y - other.y);
    }

    if (typeof other === "number" && typeof y === "number") {
      let x = other;
      return new RacPoint(
        this.x - x,
        this.y - y);
    }

    console.trace(`Invalid parameter combination - other-type:${rac.typeName(other)} y-type:${rac.typeName(y)}`);
    throw rac.Error.invalidParameterCombination;
  };


  RacPoint.prototype.sub = function(other, y = undefined) {
    this.substract(other, y);
  };

  RacPoint.prototype.addX = function(x) {
    return new RacPoint(
      this.x + x,
      this.y);
  };

  RacPoint.prototype.addY = function(y) {
    return new RacPoint(
      this.x,
      this.y + y);
  };


  RacPoint.prototype.negative = function() {
    return new RacPoint(-this.x, -this.y);
  };

  RacPoint.prototype.angleToPoint = function(other) {
    let offset = other.add(this.negative());
    return rac.Angle.fromPoint(offset);
  };

  RacPoint.prototype.distanceToPoint = function(other) {
    let x = Math.pow((other.x - this.x), 2);
    let y = Math.pow((other.y - this.y), 2);
    return Math.sqrt(x+y);
  };

  RacPoint.prototype.pointPerpendicular = function(clockwise = true) {
    return clockwise
      ? new RacPoint(-this.y, this.x)
      : new RacPoint(this.y, -this.x);
  };

  RacPoint.prototype.pointToAngle = function(someAngle, distance) {
    let angle = rac.Angle.from(someAngle);
    let distanceX = distance * Math.cos(angle.radians());
    let distanceY = distance * Math.sin(angle.radians());
    return new RacPoint(this.x + distanceX, this.y + distanceY);
  };

  RacPoint.prototype.segmentToPoint = function(point) {
    return new rac.Segment(this, point);
  };

  RacPoint.prototype.segmentToAngle = function(someAngle, distance) {
    let end = this.pointToAngle(someAngle, distance);
    return new rac.Segment(this, end);
  };

  RacPoint.prototype.segmentToAngleToIntersectionWithSegment = function(someAngle, segment) {
    let unit = this.segmentToAngle(someAngle, 1);
    return unit.segmentToIntersectionWithSegment(segment);
  }

  RacPoint.prototype.segmentPerpendicularToSegment = function(segment) {
    let projectedPoint = segment.projectedPoint(this);
    return this.segmentToPoint(projectedPoint);
  };

  RacPoint.prototype.arc = function(radius, start = rac.Angle.zero, end = start, clockwise = true) {
    return new rac.Arc(this, radius, start, end, clockwise);
  };


  RacPoint.zero = new RacPoint(0, 0);
  RacPoint.origin = RacPoint.zero;


  return RacPoint;

} // makePoint


},{}],11:[function(require,module,exports){
'use strict';


module.exports = function makeX(rac) {

  class RacSegment {

    constructor(start, end) {
      this.start = start;
      this.end = end;
    }

    copy() {
      return new RacSegment(this.start, this.end);
    }

    withAngleAdd(someAngle) {
      let newAngle = this.angle().add(someAngle);
      let newEnd = this.start.pointToAngle(newAngle, this.length());
      return new RacSegment(this.start, newEnd);
    }

    withAngleShift(someAngle, clockwise = true) {
      let newAngle = this.angle().shift(someAngle, clockwise);
      let newEnd = this.start.pointToAngle(newAngle, this.length());
      return new RacSegment(this.start, newEnd);
    }

    withStartExtended(length) {
      let newStart = this.reverse().nextSegmentWithLength(length).end;
      return new RacSegment(newStart, this.end);
    }

    withEndExtended(length) {
      let newEnd = this.nextSegmentWithLength(length).end;
      return new RacSegment(this.start, newEnd);
    }


    // Returns a new segment from `this.start`, with the same length, that is
    // perpendicular to `this` in the `clockwise` orientation.
    withPerpendicularAngle(clockwise = true) {
      return this.withAngleShift(rac.Angle.square, clockwise);
    };

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
      let angleDistance = angle.substract(this.angle());
      // [0 to 0.5) is considered clockwise
      // [0.5, 1) is considered counter-clockwise
      return angleDistance.turn < 0.5;
    }

  } // RacSegment


  RacSegment.prototype.withStart = function(newStart) {
    return new RacSegment(newStart, this.end);
  };

  RacSegment.prototype.withEnd = function(newEnd) {
    return new RacSegment(this.start, newEnd);
  };

  RacSegment.prototype.withLength = function(newLength) {
    let newEnd = this.start.pointToAngle(this.angle(), newLength);
    return new RacSegment(this.start, newEnd);
  };

  RacSegment.prototype.pointAtBisector = function() {
    return new rac.Point(
      this.start.x + (this.end.x - this.start.x) /2,
      this.start.y + (this.end.y - this.start.y) /2);
  };

  RacSegment.prototype.length = function() {
    return this.start.distanceToPoint(this.end);
  };

  RacSegment.prototype.angle = function() {
    return rac.Angle.fromSegment(this);
  };

  // Returns the slope of the segment, or `null` if the segment is part of a
  // vertical line.
  RacSegment.prototype.slope = function() {
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
  RacSegment.prototype.yIntercept = function() {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }
    // y = mx + b
    // y - mx = b
    return this.start.y - slope * this.start.x;
  };


  RacSegment.prototype.pointAtX = function(x) {
    let slope = this.slope();
    if (slope === null) {
      return null;
    }

    let y = slope*x + this.yIntercept();
    return new rac.Point(x, y);
  }

  RacSegment.prototype.reverseAngle = function() {
    return rac.Angle.fromSegment(this).inverse();
  };

  RacSegment.prototype.reverse = function() {
    return new RacSegment(this.end, this.start);
  };

  // Translates the segment by the entire `point`, or by the given `x` and
  // `y` components.
  RacSegment.prototype.translate = function(point, y = undefined) {
    if (point instanceof rac.Point && y === undefined) {
      return new RacSegment(
        this.start.add(point),
        this.end.add(point));
    }

    if (typeof point === "number" && typeof y === "number") {
      let x = point;
      return new RacSegment(
        this.start.add(x, y),
        this.end.add(x, y));
    }

    console.trace(`Invalid parameter combination - point-type:${rac.typeName(point)} y-type:${rac.typeName(y)}`);
    throw rac.Error.invalidParameterCombination;
  }

  RacSegment.prototype.translateToStart = function(newStart) {
    let offset = newStart.substract(this.start);
    return new RacSegment(this.start.add(offset), this.end.add(offset));
  };

  RacSegment.prototype.translateToAngle = function(someAngle, distance) {
    let angle = rac.Angle.from(someAngle);
    let offset = rac.Point.zero.pointToAngle(angle, distance);
    return new RacSegment(this.start.add(offset), this.end.add(offset));
  };

  RacSegment.prototype.translateToLength = function(distance) {
    let offset = rac.Point.zero.pointToAngle(this.angle(), distance);
    return new RacSegment(this.start.add(offset), this.end.add(offset));
  };

  RacSegment.prototype.translatePerpendicular = function(distance, clockwise = true) {
    let perpendicular = this.angle().perpendicular(clockwise);
    return this.translateToAngle(perpendicular, distance);
  };

  // Returns the intersecting point of `this` and `other`. Both segments are
  // considered lines without endpoints.
  RacSegment.prototype.pointAtIntersectionWithSegment = function(other) {
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

  RacSegment.prototype.pointAtLength = function(length) {
    return this.start.pointToAngle(this.angle(), length);
  };

  RacSegment.prototype.pointAtLengthRatio = function(lengthRatio) {
    let newLength = this.length() * lengthRatio;
    return this.start.pointToAngle(this.angle(), newLength);
  };

  // Returns a new segment from `start` to `pointAtBisector`.
  RacSegment.prototype.segmentToBisector = function() {
    return new RacSegment(this.start, this.pointAtBisector());
  };

  // Returns a new segment from `start` to a length determined by
  // `ratio*length`.
  RacSegment.prototype.withLengthRatio = function(ratio) {
    return this.start.segmentToAngle(this.angle(), this.length() * ratio);
  };

  // Returns a new segment from `end` with the given `length` with the same
  // angle as `this`.
  RacSegment.prototype.nextSegmentWithLength = function(length) {
    return this.end.segmentToAngle(this.angle(), length);
  };

  // Returns a new segment from `end` to the given `nextEnd`.
  RacSegment.prototype.nextSegmentToPoint = function(nextEnd) {
    return new RacSegment(this.end, nextEnd);
  }

  // Returns a new segment from `end` to the given `someAngle` and `distance`.
  RacSegment.prototype.nextSegmentToAngle = function(someAngle, distance) {
    return this.end.segmentToAngle(someAngle, distance);
  }


  // Returns a new segment from `this.end`, with the same length, that is
  // perpendicular to `this` in the `clockwise` orientation.
  // TODO: rename to nextPerpendicularSegment?
  RacSegment.prototype.nextSegmentPerpendicular = function(clockwise = true) {
    let offset = this.start.add(this.end.negative());
    let newEnd = this.end.add(offset.pointPerpendicular(clockwise));
    return this.end.segmentToPoint(newEnd);
  };

  // Returns an complete circle Arc using this segment `start` as center,
  // `length()` as radiusm, and `angle()` as start and end angles.
  RacSegment.prototype.arc = function(clockwise = true) {
    let angle = this.angle();
    return new rac.Arc(
      this.start, this.length(),
      angle, angle,
      clockwise);
  };

  // Returns an Arc using this segment `start` as center, `length()` as
  // radius, starting from the `angle()` to the given angle and orientation.
  RacSegment.prototype.arcWithEnd = function(
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
  RacSegment.prototype.arcWithAngleDistance = function(someAngleDistance, clockwise = true) {
    let angleDistance = rac.Angle.from(someAngleDistance);
    let arcStart = this.angle();
    let arcEnd = arcStart.shift(angleDistance, clockwise);

    return new rac.Arc(
      this.start, this.length(),
      arcStart, arcEnd,
      clockwise);
  };

  // Returns a segment from `this.start` to the intersection between `this`
  // and `other`.
  RacSegment.prototype.segmentToIntersectionWithSegment = function(other) {
    let end = this.pointAtIntersectionWithSegment(other);
    if (end === null) {
      return null;
    }
    return new RacSegment(this.start, end);
  };

  RacSegment.prototype.nextSegmentToAngleShift = function(
    angleShift, distance, clockwise = true)
  {
    let angle = this.reverseAngle().shift(angleShift, clockwise);
    return this.end.segmentToAngle(angle, distance);
  };

  RacSegment.prototype.oppositeWithHyp = function(hypotenuse, clockwise = true) {
    // cos = ady / hyp
    // acos can error if hypotenuse is smaller that length
    let radians = Math.acos(this.length() / hypotenuse);
    let angle = rac.Angle.fromRadians(radians);

    let hypSegment = this.reverse()
      .nextSegmentToAngleShift(angle, hypotenuse, !clockwise);
    return this.end.segmentToPoint(hypSegment.end);
  };

  // Returns a new segment that starts from `pointAtBisector` in the given
  // `clockwise` orientation.
  RacSegment.prototype.segmentFromBisector = function(length, clockwise = true) {
    let angle = clockwise
      ? this.angle().add(rac.Angle.square)
      : this.angle().add(rac.Angle.square.negative());
    return this.pointAtBisector().segmentToAngle(angle, length);
  };

  RacSegment.prototype.bezierCentralAnchor = function(distance, clockwise = true) {
    let bisector = this.segmentFromBisector(distance, clockwise);
    return new rac.Bezier(
      this.start, bisector.end,
      bisector.end, this.end);
  };


  return RacSegment;

} // makeSegment


},{}],12:[function(require,module,exports){
'use strict';


module.exports = function makeShape(rac) {

  let RacShape = function RacShape() {
    this.outline = new rac.Composite();
    this.contour = new rac.Composite();
  }


  RacShape.prototype.addOutline = function(element) {
    this.outline.add(element);
  };

  RacShape.prototype.addContour = function(element) {
    this.contour.add(element);
  };


  return RacShape;

} // makeShape


},{}],13:[function(require,module,exports){
'use strict';


module.exports = function makeText(rac) {

  class RacTextFormat {

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
      size = RacTextFormat.defaultSize)
    {
      this.horizontal = horizontal;
      this.vertical = vertical;
      this.font = font;
      this.rotation = rotation;
      this.size = size;
    }

    // Returns a format to draw text in the same position as `self` with
    // the inverse angle.
    inverse() {
      let hEnum = RacTextFormat.horizontal;
      let vEnum = RacTextFormat.vertical;
      let horizontal, vertical;
      switch (this.horizontal) {
        case hEnum.left:
          horizontal = hEnum.right; break;
        case hEnum.right:
          horizontal = hEnum.left; break;
        default:
          horizontal = this.horizontal; break;
      }
      switch (this.vertical) {
        case vEnum.top:
          vertical = vEnum.bottom; break;
        case vEnum.bottom:
          vertical = vEnum.top; break;
        default:
          vertical = this.vertical; break;
      }

      return new RacTextFormat(
        horizontal, vertical,
        this.font,
        this.rotation.inverse(),
        this.size)
    }

  } // RacTextFormat


  class RacText {

    constructor(string, format, point) {
      this.string = string;
      this.format = format;
      this.point = point;
    }

    static Format = RacTextFormat;

  } // RacText


  return RacText;

} // makeText


},{}],14:[function(require,module,exports){


// https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // https://github.com/amdjs/amdjs-api/blob/master/AMD.md
    // https://requirejs.org/docs/whyamd.html
    // AMD. Register as an anonymous module.
    console.log(`Loading RAC for AMD - define:${typeof define}`);
    define([], factory);
    return;
  }

  if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    console.log(`Loading RAC for Node - module:${typeof module}`);
    module.exports = factory();
    return;
  }

  // Browser globals (root is window)
  console.log(`Loading RAC into self - root:${typeof root}`);
  root.makeRac = factory();

}(typeof self !== 'undefined' ? self : this, function () {

  return require('./rac');

}));


},{"./rac":17}],15:[function(require,module,exports){
'use strict';

function reversesText(angle) {
  return angle.turn < 3/4 && angle.turn >= 1/4;
}

exports.debugAngle = function(drawer, angle, point, drawsText) {
  let rac = drawer.rac;

  // Zero segment
  point
    .segmentToAngle(rac.Angle.zero, drawer.debugRadius)
    .draw();

  // Angle segment
  let angleSegment = point
    .segmentToAngle(angle, drawer.debugRadius * 1.5);
  angleSegment.end
    .arc(drawer.debugPointRadius, angle, angle.inverse(), false)
    .draw();
  angleSegment
    .withEndExtended(drawer.debugPointRadius)
    .draw();

  // Mini arc markers
  let angleArc = point.arc(drawer.debugRadius, rac.Angle.zero, angle);
  let context = drawer.p5.drawingContext;
  context.save();
  context.setLineDash([6, 6]);
  angleArc.draw();
  context.restore();

  // Text
  if (drawsText !== true) { return; }

  // Normal orientation
  let format = new rac.Text.Format(
    rac.Text.Format.horizontal.left,
    rac.Text.Format.vertical.center,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    format = format.inverse();
  }

  // Turn text
  let turnString = `turn:${drawer.debugNumber(angle.turn)}`;
  point
    .pointToAngle(angle, drawer.debugRadius*2)
    .text(turnString, format)
    .draw(drawer.debugTextStyle);
}; // debugAngle


exports.debugPoint = function(drawer, point, drawsText) {
  let rac = drawer.rac;

  point.draw();

  // Point marker
  point.arc(drawer.debugPointRadius).draw();

  // Point reticule marker
  let arc = point
    .arc(drawer.debugRadius, rac.Angle.s, rac.Angle.e)
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(1/2)
    .draw();
  arc.endSegment()
    .withLengthRatio(1/2)
    .draw();

  // Text
  if (drawsText !== true) { return; }

  let string = `x:${drawer.debugNumber(point.x)}\ny:${drawer.debugNumber(point.y)}`;
  let format = new rac.Text.Format(
    rac.Text.Format.horizontal.left,
    rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    rac.Angle.e,
    drawer.debugTextOptions.size);
  point
    .pointToAngle(rac.Angle.se, drawer.debugPointRadius*2)
    .text(string, format)
    .draw(drawer.debugTextStyle);
}; // debugPoint


exports.debugSegment = function(drawer, segment, drawsText) {
  let rac = drawer.rac;

  segment.draw();

  // Half circle start marker
  segment.start.arc(drawer.debugPointRadius).draw();

  // Half circle start segment
  let perpAngle = segment.angle().perpendicular();
  let arc = segment.start
    .arc(drawer.debugRadius, perpAngle, perpAngle.inverse())
    .draw();
  arc.startSegment().reverse()
    .withLengthRatio(0.5)
    .draw();
  arc.endSegment()
    .withLengthRatio(0.5)
    .draw();

  // Perpendicular end marker
  let endMarkerStart = segment
    .nextSegmentPerpendicular()
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw();
  let endMarkerEnd = segment
    .nextSegmentPerpendicular(false)
    .withLength(drawer.debugRadius/2)
    .withStartExtended(-drawer.debugPointRadius)
    .draw();
  // Little end half circle
  segment.end
    .arc(drawer.debugPointRadius, endMarkerStart.angle(), endMarkerEnd.angle())
    .draw();

  // Forming end arrow
  let arrowAngleShift = rac.Angle.from(1/7);
  let endArrowStart = endMarkerStart
    .nextSegmentToAngleShift(arrowAngleShift, 100, false);
  let endArrowEnd = endMarkerEnd
    .nextSegmentToAngleShift(arrowAngleShift, 100, true);
  let endArrowPoint = endArrowStart
    .pointAtIntersectionWithSegment(endArrowEnd);
  // End arrow
  endMarkerStart
    .nextSegmentToPoint(endArrowPoint)
    .draw()
    .nextSegmentToPoint(endMarkerEnd.end)
    .draw();


  // Text
  if (drawsText !== true) { return; }

  let angle = segment.angle();
  // Normal orientation
  let lengthFormat = new rac.Text.Format(
    rac.Text.Format.horizontal.left,
    rac.Text.Format.vertical.bottom,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  let angleFormat = new rac.Text.Format(
    rac.Text.Format.horizontal.left,
    rac.Text.Format.vertical.top,
    drawer.debugTextOptions.font,
    angle,
    drawer.debugTextOptions.size);
  if (reversesText(angle)) {
    // Reverse orientation
    lengthFormat = lengthFormat.inverse();
    angleFormat = angleFormat.inverse();
  }

  // Length
  let lengthString = `length:${drawer.debugNumber(segment.length())}`;
  segment.start
    .pointToAngle(angle, drawer.debugPointRadius)
    .pointToAngle(angle.sub(1/4), drawer.debugRadius/2)
    .text(lengthString, lengthFormat)
    .draw(drawer.debugTextStyle);

    // Angle
  let angleString = `angle:${drawer.debugNumber(angle.turn)}`;
  segment.start
    .pointToAngle(angle, drawer.debugPointRadius)
    .pointToAngle(angle.add(1/4), drawer.debugRadius/2)
    .text(angleString, angleFormat)
    .draw(drawer.debugTextStyle);
}; // debugSegment


exports.debugArc = function(drawer, arc, drawsText) {
  let rac = drawer.rac;

  arc.draw();

  // Center markers
  let centerArcRadius = drawer.debugRadius * 2/3;
  if (arc.radius > drawer.debugRadius/3 && arc.radius < drawer.debugRadius) {
    // If radius is to close to the center-arc markers
    // Make the center-arc be outside of the arc
    centerArcRadius = arc.radius + drawer.debugRadius/3;
  }

  // Center start segment
  let centerArc = arc.withRadius(centerArcRadius);
  centerArc.startSegment().draw();

  // Radius
  let radiusMarkerLength = arc.radius
    - centerArcRadius
    - drawer.debugRadius/2
    - drawer.debugPointRadius*2;
  if (radiusMarkerLength > 0) {
    arc.startSegment()
      .withLength(radiusMarkerLength)
      .translateToLength(centerArcRadius + drawer.debugPointRadius*2)
      .draw();
  }

  // Mini arc markers
  let context = drawer.p5.drawingContext;
  context.save();
  context.setLineDash([6, 6]);
  centerArc.draw();
  context.restore();

  // Center end segment
  if (!arc.isCircle()) {
    centerArc.endSegment().withLengthRatio(1/2).draw();
  }

  // Start point marker
  let startPoint = arc.startPoint();
  startPoint
    .arc(drawer.debugPointRadius).draw();
  startPoint
    .segmentToAngle(arc.start, drawer.debugRadius)
    .withStartExtended(-drawer.debugRadius/2)
    .draw();

  // Orientation marker
  let orientationLength = drawer.debugRadius*2;
  let orientationArc = arc
    .startSegment()
    .withEndExtended(drawer.debugRadius)
    .arc(arc.clockwise)
    .withLength(orientationLength)
    .draw();
  let arrowCenter = orientationArc
    .reverse()
    .withLength(drawer.debugRadius/2)
    .chordSegment();
  let arrowAngle = 3/32;
  arrowCenter.withAngleShift(-arrowAngle).draw();
  arrowCenter.withAngleShift(arrowAngle).draw();

  // Internal end point marker
  let endPoint = arc.endPoint();
  let internalLength = Math.min(drawer.debugRadius/2, arc.radius);
  internalLength -= drawer.debugPointRadius;
  if (internalLength > rac.equalityThreshold) {
    endPoint
      .segmentToAngle(arc.end.inverse(), internalLength)
      .translateToLength(drawer.debugPointRadius)
      .draw();
  }

  // External end point marker
  let textJoinThreshold = drawer.debugRadius*3;
  let lengthAtOrientationArc = orientationArc
    .withEnd(arc.end)
    .length();
  let externalLength = lengthAtOrientationArc > textJoinThreshold && drawsText === true
    ? drawer.debugRadius - drawer.debugPointRadius
    : drawer.debugRadius/2 - drawer.debugPointRadius;

  endPoint
    .segmentToAngle(arc.end, externalLength)
    .translateToLength(drawer.debugPointRadius)
    .draw();

  // End point little arc
  if (!arc.isCircle()) {
    endPoint
      .arc(drawer.debugPointRadius, arc.end, arc.end.inverse(), arc.clockwise)
      .draw();
  }

  // Text
  if (drawsText !== true) { return; }

  let hFormat = rac.Text.Format.horizontal;
  let vFormat = rac.Text.Format.vertical;

  let headVertical = arc.clockwise
    ? vFormat.top
    : vFormat.bottom;
  let tailVertical = arc.clockwise
    ? vFormat.bottom
    : vFormat.top;
  let radiusVertical = arc.clockwise
    ? vFormat.bottom
    : vFormat.top;

  // Normal orientation
  let headFormat = new rac.Text.Format(
    hFormat.left,
    headVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);
  let tailFormat = new rac.Text.Format(
    hFormat.left,
    tailVertical,
    drawer.debugTextOptions.font,
    arc.end,
    drawer.debugTextOptions.size);
  let radiusFormat = new rac.Text.Format(
    hFormat.left,
    radiusVertical,
    drawer.debugTextOptions.font,
    arc.start,
    drawer.debugTextOptions.size);

  // Reverse orientation
  if (reversesText(arc.start)) {
    headFormat = headFormat.inverse();
    radiusFormat = radiusFormat.inverse();
  }
  if (reversesText(arc.end)) {
    tailFormat = tailFormat.inverse();
  }

  let startString = `start:${drawer.debugNumber(arc.start.turn)}`;
  let radiusString = `radius:${drawer.debugNumber(arc.radius)}`;
  let endString = `end:${drawer.debugNumber(arc.end.turn)}`;

  let angleDistance = arc.angleDistance();
  let distanceString = `distance:${drawer.debugNumber(angleDistance.turn)}`;

  let tailString = `${distanceString}\n${endString}`;
  let headString;

  // Radius label
  if (angleDistance.turn <= 3/4 && !arc.isCircle()) {
    // Radius drawn separately
    let perpAngle = arc.start.perpendicular(!arc.clockwise);
    arc.center
      .pointToAngle(arc.start, drawer.debugPointRadius)
      .pointToAngle(perpAngle, drawer.debugPointRadius*2)
      .text(radiusString, radiusFormat)
      .draw(drawer.debugTextStyle);
    headString = startString;
  } else {
    // Radius joined to head
    headString = `${startString}\n${radiusString}`;
  }

  if (lengthAtOrientationArc > textJoinThreshold) {
    // Draw strings separately
    orientationArc.startPoint()
      .pointToAngle(arc.start, drawer.debugRadius/2)
      .text(headString, headFormat)
      .draw(drawer.debugTextStyle);
    orientationArc.pointAtAngle(arc.end)
      .pointToAngle(arc.end, drawer.debugRadius/2)
      .text(tailString, tailFormat)
      .draw(drawer.debugTextStyle);
  } else {
    // Draw strings together
    let allStrings = `${headString}\n${tailString}`;
    orientationArc.startPoint()
      .pointToAngle(arc.start, drawer.debugRadius/2)
      .text(allStrings, headFormat)
      .draw(drawer.debugTextStyle);
  }



}; // debugArc

// TODO: debug routine of Bezier
// TODO: debug routine of Composite
// TODO: debug routine of Shape
// TODO: debug routine of Text


},{}],16:[function(require,module,exports){
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

      let drawer = this;
      rac.Angle.prototype.debug = function(point, drawsText = false) {
        if (drawer.debugStyle !== null) {
          drawer.p5.push();
          drawer.debugStyle.apply();
          // TODO: could this be a good option to implement splatting arguments
          // into the debugFunction?
          functions.debugAngle(drawer, this, point, drawsText);
          drawer.p5.pop();
        } else {
          functions.debugAngle(drawer, this, point, drawsText);
        }
      };

      rac.Point.prototype.debugAngle = function(someAngle, drawsText = false) {
        let angle = rac.Angle.from(someAngle);
        angle.debug(this, drawsText);
        return this;
      };
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


},{"./debugFunctions":15}],17:[function(require,module,exports){
'use strict';


// Ruler and Compass
const version = require('../built/version');


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
    addEnumConstant(this, 'TAU', Math.PI * 2);

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
      abstractFunctionCalled: 'Abstract function called',
      invalidParameterCombination: 'Invalid parameter combination',
      invalidObjectConfiguration: 'Invalid object configuration',
      invalidObjectToConvert: 'Invalid object to convert',
      invalidObjectToDraw: 'Invalid object to draw',
      invalidObjectToApply: 'Invalid object to apply',
      drawerNotSetup: 'Drawer not setup'}
  }

  // Sets the drawer for the instance. Currently only a p5.js instance
  // is supported.
  // The drawer will also populate some classes with prototype functions
  // relevant to the drawer. For p5.js this include `apply` functions for
  // colors and style object, and `vertex` functions for drawable objects.
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


  // Prototype functions
  require('./attachProtoFunction')(rac);


  // P5Drawer
  rac.P5Drawer = require('./p5Drawer/makeP5Drawer')(rac);


  // Color
  rac.Color = require('./style/makeColor')(rac);


  // Stroke
  rac.Stroke = require('./style/makeStroke')(rac);
  rac.setupStyleProtoFunctions(rac.Stroke);


  // Fill
  rac.Fill = require('./style/makeFill')(rac);
  rac.setupStyleProtoFunctions(rac.Fill);


  // Style
  rac.Style = require('./style/makeStyle')(rac);
  rac.setupStyleProtoFunctions(rac.Style);


  // Text
  rac.Text = require('./drawable/makeText.js')(rac);
  rac.setupDrawableProtoFunctions(rac.Text);


  // Angle
  rac.Angle = require('./drawable/makeAngle')(rac);


  // Point
  rac.Point = require('./drawable/makePoint')(rac);
  rac.setupDrawableProtoFunctions(rac.Point);


  // Segment
  rac.Segment = require('./drawable/makeSegment')(rac);
  rac.setupDrawableProtoFunctions(rac.Segment);


  // Arc
  rac.Arc = require('./drawable/makeArc')(rac);
  rac.setupDrawableProtoFunctions(rac.Arc);


  // Bezier
  rac.Bezier = require('./drawable/makeBezier')(rac);
  rac.setupDrawableProtoFunctions(rac.Bezier);


  // Composite
  rac.Composite = require('./drawable/makeComposite')(rac);
  rac.setupDrawableProtoFunctions(rac.Composite);


  // Shape
  rac.Shape = require('./drawable/makeShape')(rac);
  rac.setupDrawableProtoFunctions(rac.Shape);


  // EaseFunction
  rac.EaseFunction = require('./util/makeEaseFunction')(rac);


  // Control
  rac.Control = require('./control/makeControl')(rac);


  // SegmentControl
  rac.SegmentControl = require('./control/makeSegmentControl')(rac);


  // ArcControl
  rac.ArcControl = require('./control/makeArcControl')(rac);


  return rac;

}; // makeRac


addEnumConstant(makeRac, 'version', version);
module.exports = makeRac;


},{"../built/version":1,"./attachProtoFunction":2,"./control/makeArcControl":3,"./control/makeControl":4,"./control/makeSegmentControl":5,"./drawable/makeAngle":6,"./drawable/makeArc":7,"./drawable/makeBezier":8,"./drawable/makeComposite":9,"./drawable/makePoint":10,"./drawable/makeSegment":11,"./drawable/makeShape":12,"./drawable/makeText.js":13,"./p5Drawer/makeP5Drawer":16,"./style/makeColor":18,"./style/makeFill":19,"./style/makeStroke":20,"./style/makeStyle":21,"./util/makeEaseFunction":22}],18:[function(require,module,exports){
'use strict';


module.exports = function makeColor(rac) {

  return class RacColor {

    static black   = new RacColor(0, 0, 0);
    static red     = new RacColor(1, 0, 0);
    static green   = new RacColor(0, 1, 0);
    static blue    = new RacColor(0, 0, 1);
    static yellow  = new RacColor(1, 1, 0);
    static magenta = new RacColor(1, 0, 1);
    static cyan    = new RacColor(0, 1, 1);
    static white   = new RacColor(1, 1, 1);


    constructor(r, g, b, alpha = 1) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.alpha = alpha;
    }

    static fromRgba(r, g, b, a = 255) {
      return new RacColor(r/255, g/255, b/255, a/255);
    }

    copy() {
      return new RacColor(this.r, this.g, this.b, this.alpha);
    }

    fill() {
      return new rac.Fill(this);
    }

    stroke(weight = 1) {
      return new rac.Stroke(this, weight);
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

  } // RacColor

} // makeColor


},{}],19:[function(require,module,exports){
'use strict';


module.exports = function makeFill(rac) {

 return class RacFill {

    static none = new RacFill(null);

    constructor(color = null) {
      this.color = color;
    }

    static from(something) {
      if (something instanceof RacFill) {
        return new RacFill(something.color);
      }
      if (something instanceof rac.Stroke) {
        return new RacFill(something.color);
      }
      if (something instanceof rac.Color) {
        return new RacFill(something);
      }

      console.trace(`Cannot convert to rac.Fill - something-type:${rac.typeName(something)}`);
      throw rac.Error.invalidObjectToConvert;
    }

    styleWithStroke(stroke) {
      return new rac.Style(stroke, this);
    }

  } // RacFill

} // makeFill


},{}],20:[function(require,module,exports){
'use strict';


module.exports = function makeStroke(rac) {

  return class RacStroke {

    static none = new RacStroke(null);

    constructor(color = null, weight = 1) {
      this.color = color;
      this.weight = weight;
    }

    copy() {
      let colorCopy = null;
      if (this.color !== null) {
        colorCopy = this.color.copy();
      }
      return new RacStroke(colorCopy, this.weight);
    }

    withWeight(weight) {
      return new RacStroke(this.color, weight);
    }

    withAlpha(alpha) {
      if (this.color === null) {
        return new RacStroke(null, this.weight);
      }

      let newColor = this.color.withAlpha(alpha);
      return new RacStroke(newColor, this.weight);
    }

    styleWithFill(someFill) {
      let fill = rac.Fill.from(someFill);
      return new rac.Style(this, fill);
    }

  } // RacStroke

} // makeStroke


},{}],21:[function(require,module,exports){
'use strict';


module.exports = function makeStyle(rac) {

return class RacStyle {

    constructor(stroke = null, fill = null) {
      this.stroke = stroke;
      this.fill = fill;
    }

    withStroke(stroke) {
      return new RacStyle(stroke, this.fill);
    }

    withFill(fill) {
      return new RacStyle(this.stroke, fill);
    }

  } // RacStyle

} // makeStyle


},{}],22:[function(require,module,exports){
'use strict';


module.exports = function makeEaseFunction(rac) {

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
  let RacEaseFunction = class RacEaseFunction {

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
      this.preBehavior = RacEaseFunction.Behavior.pass;
      // Behavior for values after `prefix+inRange`.
      this.postBehavior = RacEaseFunction.Behavior.pass;

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
      let behavior = RacEaseFunction.Behavior;

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
      let easeOut = new RacEaseFunction()
      easeOut.ratioOffset = 1;
      easeOut.ratioFactor = .5;
      easeOut.easeOffset = -.5;
      easeOut.easeFactor = 2;
      return easeOut;
    }

  } // RacEaseFunction


  return RacEaseFunction;

} // makeEaseFunction


},{}]},{},[14]);
