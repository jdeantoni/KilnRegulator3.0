import _uniqueId from "lodash/uniqueId";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import { PropTypes as CustomPropTypes, TextSize, Helpers, LabelHelpers, VictoryLabel, VictoryTheme, VictoryPortal } from "victory-core";
import Flyout from "./flyout";
var fallbackProps = {
  cornerRadius: 5,
  pointerLength: 10,
  pointerWidth: 10
};

var VictoryTooltip =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryTooltip, _React$Component);

  function VictoryTooltip(props) {
    var _this;

    _classCallCheck(this, VictoryTooltip);

    _this = _possibleConstructorReturn(this, (VictoryTooltip.__proto__ || Object.getPrototypeOf(VictoryTooltip)).call(this, props));
    _this.id = props.id === undefined ? _uniqueId("tooltip-") : props.id;
    return _this;
  }

  _createClass(VictoryTooltip, [{
    key: "getDefaultOrientation",
    value: function getDefaultOrientation(props) {
      var datum = props.datum,
          horizontal = props.horizontal,
          polar = props.polar;

      if (!polar) {
        var positive = horizontal ? "right" : "top";
        var negative = horizontal ? "left" : "bottom";
        return datum && datum.y < 0 ? negative : positive;
      } else {
        return this.getPolarOrientation(props, datum);
      }
    }
  }, {
    key: "getPolarOrientation",
    value: function getPolarOrientation(props, datum) {
      var degrees = LabelHelpers.getDegrees(props, datum);
      var placement = props.labelPlacement || "vertical";

      if (placement === " vertical") {
        return this.getVerticalOrientations(degrees);
      } else if (placement === "parallel") {
        return degrees < 90 || degrees > 270 ? "right" : "left";
      } else {
        return degrees > 180 ? "bottom" : "top";
      }
    }
  }, {
    key: "getVerticalOrientations",
    value: function getVerticalOrientations(degrees) {
      // eslint-disable-next-line no-magic-numbers
      if (degrees < 45 || degrees > 315) {
        return "right"; // eslint-disable-next-line no-magic-numbers
      } else if (degrees >= 45 && degrees <= 135) {
        return "top"; // eslint-disable-next-line no-magic-numbers
      } else if (degrees > 135 && degrees < 225) {
        return "left";
      } else {
        return "bottom";
      }
    }
  }, {
    key: "getEvaluatedProps",
    value: function getEvaluatedProps(props) {
      var horizontal = props.horizontal,
          datum = props.datum,
          pointerLength = props.pointerLength,
          pointerWidth = props.pointerWidth,
          cornerRadius = props.cornerRadius,
          width = props.width,
          height = props.height,
          dx = props.dx,
          dy = props.dy,
          text = props.text,
          active = props.active;
      var style = Array.isArray(props.style) ? props.style.map(function (s) {
        return Helpers.evaluateStyle(s, datum, active);
      }) : Helpers.evaluateStyle(props.style, datum, active);
      var flyoutStyle = Helpers.evaluateStyle(props.flyoutStyle, datum, active);
      var padding = flyoutStyle && flyoutStyle.padding || 0;
      var defaultDx = horizontal ? padding : 0;
      var defaultDy = horizontal ? 0 : padding;
      var orientation = Helpers.evaluateProp(props.orientation, datum, active) || this.getDefaultOrientation(props);
      return _assign({}, props, {
        style: style,
        flyoutStyle: flyoutStyle,
        orientation: orientation,
        dx: dx !== undefined ? Helpers.evaluateProp(dx, datum, active) : defaultDx,
        dy: dy !== undefined ? Helpers.evaluateProp(dy, datum, active) : defaultDy,
        cornerRadius: Helpers.evaluateProp(cornerRadius, datum, active),
        pointerLength: Helpers.evaluateProp(pointerLength, datum, active),
        pointerWidth: Helpers.evaluateProp(pointerWidth, datum, active),
        width: Helpers.evaluateProp(width, datum, active),
        height: Helpers.evaluateProp(height, datum, active),
        active: Helpers.evaluateProp(active, datum, active),
        text: Helpers.evaluateProp(text, datum, active)
      });
    }
  }, {
    key: "getCalculatedValues",
    value: function getCalculatedValues(props) {
      var style = props.style,
          text = props.text,
          datum = props.datum,
          active = props.active;
      var theme = props.theme || VictoryTheme.grayscale;
      var defaultLabelStyles = theme && theme.tooltip && theme.tooltip.style ? theme.tooltip.style : {};
      var baseLabelStyle = Array.isArray(style) ? style.map(function (s) {
        return _defaults({}, s, defaultLabelStyles);
      }) : _defaults({}, style, defaultLabelStyles);
      var defaultFlyoutStyles = theme && theme.tooltip && theme.tooltip.flyoutStyle ? theme.tooltip.flyoutStyle : {};
      var flyoutStyle = props.flyoutStyle ? _defaults({}, props.flyoutStyle, defaultFlyoutStyles) : defaultFlyoutStyles;
      var labelStyle = Array.isArray(baseLabelStyle) ? baseLabelStyle.map(function (s) {
        return Helpers.evaluateStyle(s, datum, active);
      }) : Helpers.evaluateStyle(baseLabelStyle, datum, active);
      var labelSize = TextSize.approximateTextSize(text, labelStyle);
      var flyoutDimensions = this.getDimensions(props, labelSize, labelStyle);
      var flyoutCenter = this.getFlyoutCenter(props, flyoutDimensions);
      var transform = this.getTransform(props);
      return {
        labelStyle: labelStyle,
        flyoutStyle: flyoutStyle,
        labelSize: labelSize,
        flyoutDimensions: flyoutDimensions,
        flyoutCenter: flyoutCenter,
        transform: transform
      };
    }
  }, {
    key: "getTransform",
    value: function getTransform(props) {
      var x = props.x,
          y = props.y,
          style = props.style;
      var labelStyle = style || {};
      var angle = labelStyle.angle || props.angle || this.getDefaultAngle(props);
      return angle ? "rotate(".concat(angle, " ").concat(x, " ").concat(y, ")") : undefined;
    } // eslint-disable-next-line complexity

  }, {
    key: "getDefaultAngle",
    value: function getDefaultAngle(props) {
      var polar = props.polar,
          labelPlacement = props.labelPlacement,
          orientation = props.orientation,
          datum = props.datum;

      if (!polar || !labelPlacement || labelPlacement === "vertical") {
        return 0;
      }

      var degrees = LabelHelpers.getDegrees(props, datum);
      var sign = degrees > 90 && degrees < 180 || degrees > 270 ? 1 : -1;
      var labelRotation = labelPlacement === "perpendicular" ? 0 : 90;
      var angle;

      if (degrees === 0 || degrees === 180) {
        angle = orientation === "top" && degrees === 180 ? 270 : 90;
      } else if (degrees > 0 && degrees < 180) {
        angle = 90 - degrees;
      } else if (degrees > 180 && degrees < 360) {
        angle = 270 - degrees;
      }

      return angle + sign * labelRotation;
    }
  }, {
    key: "getFlyoutCenter",
    value: function getFlyoutCenter(props, dimensions) {
      var x = props.x,
          y = props.y,
          dx = props.dx,
          dy = props.dy,
          pointerLength = props.pointerLength,
          orientation = props.orientation;
      var height = dimensions.height,
          width = dimensions.width;
      var xSign = orientation === "left" ? -1 : 1;
      var ySign = orientation === "bottom" ? -1 : 1;
      return {
        x: orientation === "left" || orientation === "right" ? x + xSign * (pointerLength + width / 2 + dx) : x + dx,
        y: orientation === "top" || orientation === "bottom" ? y - ySign * (pointerLength + height / 2 + dy) : y - dy
      };
    }
  }, {
    key: "getLabelPadding",
    value: function getLabelPadding(style) {
      if (!style) {
        return 0;
      }

      var paddings = Array.isArray(style) ? style.map(function (s) {
        return s.padding;
      }) : [style.padding];
      return Math.max.apply(Math, _toConsumableArray(paddings).concat([0]));
    }
  }, {
    key: "getDimensions",
    value: function getDimensions(props, labelSize, labelStyle) {
      var orientation = props.orientation,
          cornerRadius = props.cornerRadius,
          pointerLength = props.pointerLength,
          pointerWidth = props.pointerWidth;
      var padding = this.getLabelPadding(labelStyle);

      var getHeight = function () {
        var calculatedHeight = labelSize.height + padding;
        var minHeight = orientation === "top" || orientation === "bottom" ? 2 * cornerRadius : 2 * cornerRadius + pointerWidth;
        return Math.max(minHeight, calculatedHeight);
      };

      var getWidth = function () {
        var calculatedWidth = labelSize.width + padding;
        var minWidth = orientation === "left" || orientation === "right" ? 2 * cornerRadius + pointerLength : 2 * cornerRadius;
        return Math.max(minWidth, calculatedWidth);
      };

      return {
        height: props.height || getHeight(props, labelSize, orientation) + padding / 2,
        width: props.width || getWidth(props, labelSize, orientation) + padding
      };
    }
  }, {
    key: "getLabelProps",
    value: function getLabelProps(props, calculatedValues) {
      var flyoutCenter = calculatedValues.flyoutCenter,
          labelStyle = calculatedValues.labelStyle,
          labelSize = calculatedValues.labelSize,
          dy = calculatedValues.dy,
          dx = calculatedValues.dx;
      var text = props.text,
          datum = props.datum,
          labelComponent = props.labelComponent,
          index = props.index;
      var textAnchor = (Array.isArray(labelStyle) && labelStyle.length ? labelStyle[0].textAnchor : labelStyle.textAnchor) || "middle";

      var getLabelX = function () {
        var sign = textAnchor === "end" ? -1 : 1;
        return flyoutCenter.x - sign * (labelSize.width / 2);
      };

      return _defaults({}, labelComponent.props, {
        key: "".concat(this.id, "-label-").concat(index),
        text: text,
        datum: datum,
        textAnchor: textAnchor,
        dy: dy,
        dx: dx,
        style: labelStyle,
        x: !textAnchor || textAnchor === "middle" ? flyoutCenter.x : getLabelX(),
        y: flyoutCenter.y,
        verticalAnchor: "middle",
        angle: labelStyle.angle
      });
    }
  }, {
    key: "getFlyoutProps",
    value: function getFlyoutProps(props, calculatedValues) {
      var flyoutDimensions = calculatedValues.flyoutDimensions,
          flyoutStyle = calculatedValues.flyoutStyle;
      var x = props.x,
          y = props.y,
          dx = props.dx,
          dy = props.dy,
          datum = props.datum,
          index = props.index,
          orientation = props.orientation,
          pointerLength = props.pointerLength,
          pointerWidth = props.pointerWidth,
          cornerRadius = props.cornerRadius,
          events = props.events,
          flyoutComponent = props.flyoutComponent;
      return _defaults({}, flyoutComponent.props, {
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        datum: datum,
        index: index,
        orientation: orientation,
        pointerLength: pointerLength,
        pointerWidth: pointerWidth,
        cornerRadius: cornerRadius,
        events: events,
        key: "".concat(this.id, "-tooltip-").concat(index),
        width: flyoutDimensions.width,
        height: flyoutDimensions.height,
        style: flyoutStyle
      });
    } // Overridden in victory-core-native

  }, {
    key: "renderTooltip",
    value: function renderTooltip(props) {
      var evaluatedProps = this.getEvaluatedProps(props);
      var flyoutComponent = evaluatedProps.flyoutComponent,
          labelComponent = evaluatedProps.labelComponent,
          groupComponent = evaluatedProps.groupComponent,
          active = evaluatedProps.active,
          renderInPortal = evaluatedProps.renderInPortal;

      if (!active) {
        return renderInPortal ? React.createElement(VictoryPortal, null, null) : null;
      }

      var calculatedValues = this.getCalculatedValues(evaluatedProps);
      var children = [React.cloneElement(flyoutComponent, this.getFlyoutProps(evaluatedProps, calculatedValues)), React.cloneElement(labelComponent, this.getLabelProps(evaluatedProps, calculatedValues))];
      var tooltip = React.cloneElement(groupComponent, {
        role: "presentation",
        transform: calculatedValues.transform
      }, children);
      return renderInPortal ? React.createElement(VictoryPortal, null, tooltip) : tooltip;
    }
  }, {
    key: "render",
    value: function render() {
      var props = Helpers.modifyProps(this.props, fallbackProps, "tooltip");
      return this.renderTooltip(props);
    }
  }]);

  return VictoryTooltip;
}(React.Component);

Object.defineProperty(VictoryTooltip, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryTooltip"
});
Object.defineProperty(VictoryTooltip, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    activateData: PropTypes.bool,
    active: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    angle: PropTypes.number,
    cornerRadius: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
    data: PropTypes.array,
    datum: PropTypes.object,
    dx: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    dy: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    events: PropTypes.object,
    flyoutComponent: PropTypes.element,
    flyoutStyle: PropTypes.object,
    groupComponent: PropTypes.element,
    height: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
    horizontal: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    labelComponent: PropTypes.element,
    orientation: PropTypes.oneOfType([PropTypes.oneOf(["top", "bottom", "left", "right"]), PropTypes.func]),
    pointerLength: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
    pointerWidth: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
    polar: PropTypes.bool,
    renderInPortal: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func, PropTypes.array]),
    theme: PropTypes.object,
    width: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
    x: PropTypes.number,
    y: PropTypes.number
  }
});
Object.defineProperty(VictoryTooltip, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    active: false,
    renderInPortal: true,
    labelComponent: React.createElement(VictoryLabel, null),
    flyoutComponent: React.createElement(Flyout, null),
    groupComponent: React.createElement("g", null)
  }
});
Object.defineProperty(VictoryTooltip, "defaultEvents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return [{
      target: "data",
      eventHandlers: {
        onMouseOver: function () {
          return props.activateData ? [{
            target: "labels",
            mutation: function () {
              return {
                active: true
              };
            }
          }, {
            target: "data",
            mutation: function () {
              return {
                active: true
              };
            }
          }] : [{
            target: "labels",
            mutation: function () {
              return {
                active: true
              };
            }
          }];
        },
        onTouchStart: function () {
          return props.activateData ? [{
            target: "labels",
            mutation: function () {
              return {
                active: true
              };
            }
          }, {
            target: "data",
            mutation: function () {
              return {
                active: true
              };
            }
          }] : [{
            target: "labels",
            mutation: function () {
              return {
                active: true
              };
            }
          }];
        },
        onMouseOut: function () {
          return props.activateData ? [{
            target: "labels",
            mutation: function () {
              return {
                active: undefined
              };
            }
          }, {
            target: "data",
            mutation: function () {
              return {
                active: undefined
              };
            }
          }] : [{
            target: "labels",
            mutation: function () {
              return {
                active: undefined
              };
            }
          }];
        },
        onTouchEnd: function () {
          return props.activateData ? [{
            target: "labels",
            mutation: function () {
              return {
                active: undefined
              };
            }
          }, {
            target: "data",
            mutation: function () {
              return {
                active: undefined
              };
            }
          }] : [{
            target: "labels",
            mutation: function () {
              return {
                active: undefined
              };
            }
          }];
        }
      }
    }];
  }
});
export { VictoryTooltip as default };