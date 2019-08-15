import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [0, 0.5, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import { Helpers, CommonProps, Rect, Line } from "victory-core";

var Candle =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Candle, _React$Component);

  function Candle() {
    _classCallCheck(this, Candle);

    return _possibleConstructorReturn(this, (Candle.__proto__ || Object.getPrototypeOf(Candle)).apply(this, arguments));
  }

  _createClass(Candle, [{
    key: "getCandleWidth",
    value: function getCandleWidth(props, style) {
      var active = props.active,
          datum = props.datum,
          data = props.data,
          candleWidth = props.candleWidth,
          scale = props.scale,
          defaultCandleWidth = props.defaultCandleWidth;

      if (candleWidth) {
        return _isFunction(candleWidth) ? Helpers.evaluateProp(candleWidth, datum, active) : candleWidth;
      } else if (style.width) {
        return style.width;
      }

      var range = scale.x.range();
      var extent = Math.abs(range[1] - range[0]);
      var candles = data.length + 2;
      var candleRatio = props.candleRatio || 0.5;
      var defaultWidth = candleRatio * (data.length < 2 ? defaultCandleWidth : extent / candles);
      return Math.max(1, defaultWidth);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          x = _props.x,
          high = _props.high,
          low = _props.low,
          open = _props.open,
          close = _props.close,
          datum = _props.datum,
          active = _props.active,
          events = _props.events,
          groupComponent = _props.groupComponent,
          clipPath = _props.clipPath,
          id = _props.id,
          rectComponent = _props.rectComponent,
          lineComponent = _props.lineComponent,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          wickStrokeWidth = _props.wickStrokeWidth,
          transform = _props.transform;
      var style = Helpers.evaluateStyle(_assign({
        stroke: "black"
      }, this.props.style), datum, active);

      var wickStyle = _defaults({
        strokeWidth: wickStrokeWidth
      }, style);

      var candleWidth = this.getCandleWidth(this.props, style);
      var candleHeight = Math.abs(close - open);
      var candleX = x - candleWidth / 2;
      var sharedProps = {
        role: role,
        shapeRendering: shapeRendering,
        className: className,
        events: events,
        transform: transform,
        clipPath: clipPath
      };

      var candleProps = _assign({
        key: "".concat(id, "-candle"),
        style: style,
        x: candleX,
        y: Math.min(open, close),
        width: candleWidth,
        height: candleHeight
      }, sharedProps);

      var highWickProps = _assign({
        key: "".concat(id, "-highWick"),
        style: wickStyle,
        x1: x,
        x2: x,
        y1: high,
        y2: Math.min(open, close)
      }, sharedProps);

      var lowWickProps = _assign({
        key: "".concat(id, "-lowWick"),
        style: wickStyle,
        x1: x,
        x2: x,
        y1: Math.max(open, close),
        y2: low
      }, sharedProps);

      return React.cloneElement(groupComponent, {}, [React.cloneElement(rectComponent, candleProps), React.cloneElement(lineComponent, highWickProps), React.cloneElement(lineComponent, lowWickProps)]);
    }
  }]);

  return Candle;
}(React.Component);

Object.defineProperty(Candle, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    candleRatio: PropTypes.number,
    candleWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    close: PropTypes.number,
    datum: PropTypes.object,
    defaultCandleWidth: PropTypes.number,
    groupComponent: PropTypes.element,
    high: PropTypes.number,
    lineComponent: PropTypes.element,
    low: PropTypes.number,
    open: PropTypes.number,
    rectComponent: PropTypes.element,
    wickStrokeWidth: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number
  })
});
Object.defineProperty(Candle, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    defaultCandleWidth: 8,
    groupComponent: React.createElement("g", null),
    lineComponent: React.createElement(Line, null),
    rectComponent: React.createElement(Rect, null)
  }
});
export { Candle as default };