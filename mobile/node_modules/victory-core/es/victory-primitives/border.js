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
import Rect from "./rect";

var Border =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Border, _React$Component);

  function Border() {
    _classCallCheck(this, Border);

    return _possibleConstructorReturn(this, (Border.__proto__ || Object.getPrototypeOf(Border)).apply(this, arguments));
  }

  _createClass(Border, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          x = _props.x,
          y = _props.y,
          width = _props.width,
          height = _props.height,
          events = _props.events,
          datum = _props.datum,
          active = _props.active,
          role = _props.role,
          clipPath = _props.clipPath,
          className = _props.className,
          shapeRendering = _props.shapeRendering,
          rectComponent = _props.rectComponent,
          transform = _props.transform;
      var style = Helpers.evaluateStyle(_assign({
        fill: "none"
      }, this.props.style), datum, active);
      return React.cloneElement(rectComponent, {
        style: style,
        className: className,
        x: x,
        y: y,
        width: width,
        height: height,
        events: events,
        role: role,
        shapeRendering: shapeRendering,
        transform: transform,
        clipPath: clipPath
      });
    }
  }]);

  return Border;
}(React.Component);

Object.defineProperty(Border, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    height: PropTypes.number,
    rectComponent: PropTypes.element,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  })
});
Object.defineProperty(Border, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    rectComponent: React.createElement(Rect, null)
  }
});
export { Border as default };