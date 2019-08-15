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
import Helpers from "../victory-util/helpers";
import pathHelpers from "./path-helpers";
import CommonProps from "../victory-util/common-props";
import Path from "./path";

var Point =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Point, _React$Component);

  function Point() {
    _classCallCheck(this, Point);

    return _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).apply(this, arguments));
  }

  _createClass(Point, [{
    key: "getPath",
    value: function getPath(props) {
      var datum = props.datum,
          active = props.active,
          x = props.x,
          y = props.y;
      var size = Helpers.evaluateProp(props.size, datum, active);

      if (props.getPath) {
        return props.getPath(x, y, size);
      }

      var pathFunctions = {
        circle: pathHelpers.circle,
        square: pathHelpers.square,
        diamond: pathHelpers.diamond,
        triangleDown: pathHelpers.triangleDown,
        triangleUp: pathHelpers.triangleUp,
        plus: pathHelpers.plus,
        minus: pathHelpers.minus,
        star: pathHelpers.star
      };
      var symbol = Helpers.evaluateProp(props.symbol, datum, active);
      var symbolFunction = typeof pathFunctions[symbol] === "function" ? pathFunctions[symbol] : pathFunctions.circle;
      return symbolFunction(x, y, size);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          active = _props.active,
          datum = _props.datum,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          events = _props.events,
          pathComponent = _props.pathComponent,
          transform = _props.transform,
          clipPath = _props.clipPath;
      var style = Helpers.evaluateStyle(this.props.style, datum, active);
      var d = this.getPath(this.props);
      return React.cloneElement(pathComponent, {
        style: style,
        role: role,
        shapeRendering: shapeRendering,
        className: className,
        events: events,
        d: d,
        transform: transform,
        clipPath: clipPath
      });
    }
  }]);

  return Point;
}(React.Component);

Object.defineProperty(Point, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    datum: PropTypes.object,
    getPath: PropTypes.func,
    pathComponent: PropTypes.element,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    symbol: PropTypes.oneOfType([PropTypes.oneOf(["circle", "diamond", "plus", "minus", "square", "star", "triangleDown", "triangleUp"]), PropTypes.func]),
    x: PropTypes.number,
    y: PropTypes.number
  })
});
Object.defineProperty(Point, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pathComponent: React.createElement(Path, null)
  }
});
export { Point as default };