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
import Helpers from "../victory-util/helpers";
import CommonProps from "../victory-util/common-props";
import Line from "./line";

var LineSegment =
/*#__PURE__*/
function (_React$Component) {
  _inherits(LineSegment, _React$Component);

  function LineSegment() {
    _classCallCheck(this, LineSegment);

    return _possibleConstructorReturn(this, (LineSegment.__proto__ || Object.getPrototypeOf(LineSegment)).apply(this, arguments));
  }

  _createClass(LineSegment, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          x1 = _props.x1,
          x2 = _props.x2,
          y1 = _props.y1,
          y2 = _props.y2,
          events = _props.events,
          datum = _props.datum,
          active = _props.active,
          lineComponent = _props.lineComponent,
          className = _props.className,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          transform = _props.transform,
          clipPath = _props.clipPath;
      var style = Helpers.evaluateStyle(_assign({
        stroke: "black"
      }, this.props.style), datum, active);
      return React.cloneElement(lineComponent, {
        style: style,
        className: className,
        role: role,
        shapeRendering: shapeRendering,
        events: events,
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        transform: transform,
        clipPath: clipPath
      });
    }
  }]);

  return LineSegment;
}(React.Component);

Object.defineProperty(LineSegment, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    datum: PropTypes.any,
    lineComponent: PropTypes.element,
    x1: PropTypes.number,
    x2: PropTypes.number,
    y1: PropTypes.number,
    y2: PropTypes.number
  })
});
Object.defineProperty(LineSegment, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    lineComponent: React.createElement(Line, null)
  }
});
export { LineSegment as default };