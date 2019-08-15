import _isNil from "lodash/isNil";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, CommonProps } from "victory-core";
import Candle from "./candle";
import { getDomain, getData, getBaseProps } from "./helper-methods";
/*eslint-disable no-magic-numbers */

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  candleColors: {
    positive: "#ffffff",
    negative: "#252525"
  }
};
var defaultData = [{
  x: new Date(2016, 6, 1),
  open: 5,
  close: 10,
  high: 15,
  low: 0
}, {
  x: new Date(2016, 6, 2),
  open: 10,
  close: 15,
  high: 20,
  low: 5
}, {
  x: new Date(2016, 6, 3),
  open: 15,
  close: 20,
  high: 25,
  low: 10
}, {
  x: new Date(2016, 6, 4),
  open: 20,
  close: 25,
  high: 30,
  low: 15
}, {
  x: new Date(2016, 6, 5),
  open: 25,
  close: 30,
  high: 35,
  low: 20
}, {
  x: new Date(2016, 6, 6),
  open: 30,
  close: 35,
  high: 40,
  low: 25
}, {
  x: new Date(2016, 6, 7),
  open: 35,
  close: 40,
  high: 45,
  low: 30
}, {
  x: new Date(2016, 6, 8),
  open: 40,
  close: 45,
  high: 50,
  low: 35
}];
/*eslint-enable no-magic-numbers */

var VictoryCandlestick =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryCandlestick, _React$Component);

  function VictoryCandlestick() {
    _classCallCheck(this, VictoryCandlestick);

    return _possibleConstructorReturn(this, (VictoryCandlestick.__proto__ || Object.getPrototypeOf(VictoryCandlestick)).apply(this, arguments));
  }

  _createClass(VictoryCandlestick, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "shouldRenderDatum",
    value: function shouldRenderDatum(datum) {
      return !_isNil(datum._x) && !_isNil(datum._high) && !_isNil(datum._low) && !_isNil(datum._close) && !_isNil(datum._open);
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryCandlestick.animationWhitelist,
          role = VictoryCandlestick.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderData(props, this.shouldRenderDatum);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryCandlestick;
}(React.Component);

Object.defineProperty(VictoryCandlestick, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "samples", "size", "style", "width"]
});
Object.defineProperty(VictoryCandlestick, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryCandlestick"
});
Object.defineProperty(VictoryCandlestick, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "candlestick"
});
Object.defineProperty(VictoryCandlestick, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryCandlestick, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    candleColors: PropTypes.shape({
      positive: PropTypes.string,
      negative: PropTypes.string
    }),
    candleRatio: PropTypes.number,
    candleWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    close: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    high: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    low: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    open: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    wickStrokeWidth: PropTypes.number
  })
});
Object.defineProperty(VictoryCandlestick, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: React.createElement(VictoryContainer, null),
    data: defaultData,
    dataComponent: React.createElement(Candle, null),
    groupComponent: React.createElement("g", {
      role: "presentation"
    }),
    labelComponent: React.createElement(VictoryLabel, null),
    samples: 50,
    scale: "linear",
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryCandlestick, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getDomain
});
Object.defineProperty(VictoryCandlestick, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getData
});
Object.defineProperty(VictoryCandlestick, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryCandlestick, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryCandlestick);