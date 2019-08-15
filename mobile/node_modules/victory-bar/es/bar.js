import _isNil from "lodash/isNil";
import _isFunction from "lodash/isFunction";
import _isPlainObject from "lodash/isPlainObject";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import { Helpers, Path, CommonProps } from "victory-core";
import { getVerticalBarPath, getHorizontalBarPath, getVerticalPolarBarPath, getCustomBarPath } from "./path-helper-methods";

var Bar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Bar, _React$Component);

  function Bar() {
    _classCallCheck(this, Bar);

    return _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).apply(this, arguments));
  }

  _createClass(Bar, [{
    key: "getBarPath",
    value: function getBarPath(props, width, cornerRadius) {
      if (props.getPath) {
        return getCustomBarPath(props, width);
      }

      return props.horizontal ? getHorizontalBarPath(props, width, cornerRadius) : getVerticalBarPath(props, width, cornerRadius);
    }
  }, {
    key: "getPolarBarPath",
    value: function getPolarBarPath(props, cornerRadius) {
      // TODO Radial bars
      return getVerticalPolarBarPath(props, cornerRadius);
    }
  }, {
    key: "getBarWidth",
    value: function getBarWidth(props, style) {
      var active = props.active,
          scale = props.scale,
          data = props.data,
          datum = props.datum,
          barWidth = props.barWidth,
          defaultBarWidth = props.defaultBarWidth;

      if (barWidth) {
        return _isFunction(barWidth) ? Helpers.evaluateProp(barWidth, datum, active) : barWidth;
      } else if (style.width) {
        return style.width;
      }

      var range = scale.x.range();
      var extent = Math.abs(range[1] - range[0]);
      var bars = data.length + 2;
      var barRatio = props.barRatio || 0.5;
      var defaultWidth = barRatio * (data.length < 2 ? defaultBarWidth : extent / bars);
      return Math.max(1, defaultWidth);
    }
  }, {
    key: "getCornerRadiusFromObject",
    value: function getCornerRadiusFromObject(props) {
      var cornerRadius = props.cornerRadius,
          datum = props.datum,
          active = props.active;
      var realCornerRadius = {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0
      };

      var updateCornerRadius = function (corner, fallback) {
        if (!_isNil(cornerRadius[corner])) {
          realCornerRadius[corner] = Helpers.evaluateProp(cornerRadius[corner], datum, active);
        } else if (!_isNil(cornerRadius[fallback])) {
          realCornerRadius[corner] = Helpers.evaluateProp(cornerRadius[fallback], datum, active);
        }
      };

      updateCornerRadius("topLeft", "top");
      updateCornerRadius("topRight", "top");
      updateCornerRadius("bottomLeft", "bottom");
      updateCornerRadius("bottomRight", "bottom");
      return realCornerRadius;
    }
  }, {
    key: "getCornerRadius",
    value: function getCornerRadius(props) {
      var cornerRadius = props.cornerRadius,
          datum = props.datum,
          active = props.active;
      var realCornerRadius = {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 0,
        bottomRight: 0
      };

      if (!cornerRadius) {
        return realCornerRadius;
      }

      if (_isPlainObject(cornerRadius)) {
        return this.getCornerRadiusFromObject(props);
      }

      realCornerRadius.topLeft = Helpers.evaluateProp(cornerRadius, datum, active);
      realCornerRadius.topRight = Helpers.evaluateProp(cornerRadius, datum, active);
      return realCornerRadius;
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          role = _props.role,
          datum = _props.datum,
          active = _props.active,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          origin = _props.origin,
          polar = _props.polar,
          pathComponent = _props.pathComponent,
          events = _props.events,
          clipPath = _props.clipPath;
      var stroke = this.props.style && this.props.style.fill || "black";
      var baseStyle = {
        fill: "black",
        stroke: stroke
      };
      var style = Helpers.evaluateStyle(_assign(baseStyle, this.props.style), datum, active);
      var width = this.getBarWidth(this.props, style);
      var cornerRadius = this.getCornerRadius(this.props);
      var path = polar ? this.getPolarBarPath(this.props, cornerRadius) : this.getBarPath(this.props, width, cornerRadius);
      var defaultTransform = polar && origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
      var transform = this.props.transform || defaultTransform;
      return React.cloneElement(pathComponent, {
        d: path,
        transform: transform,
        className: className,
        style: style,
        role: role,
        shapeRendering: shapeRendering,
        events: events,
        clipPath: clipPath
      });
    }
  }]);

  return Bar;
}(React.Component);

Object.defineProperty(Bar, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    alignment: PropTypes.oneOf(["start", "middle", "end"]),
    barRatio: PropTypes.number,
    barWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.shape({
      top: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      topLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      topRight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      bottomLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      bottomRight: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
    })]),
    datum: PropTypes.object,
    getPath: PropTypes.func,
    horizontal: PropTypes.bool,
    pathComponent: PropTypes.element,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    y0: PropTypes.number
  })
});
Object.defineProperty(Bar, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pathComponent: React.createElement(Path, null),
    defaultBarWidth: 8
  }
});
export { Bar as default };