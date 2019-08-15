import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 180] }]*/
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import CommonProps from "../victory-util/common-props";
import Path from "./path";

var Arc =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Arc, _React$Component);

  function Arc() {
    _classCallCheck(this, Arc);

    return _possibleConstructorReturn(this, (Arc.__proto__ || Object.getPrototypeOf(Arc)).apply(this, arguments));
  }

  _createClass(Arc, [{
    key: "getStyle",
    value: function getStyle(props) {
      var style = props.style,
          datum = props.datum,
          active = props.active;
      return Helpers.evaluateStyle(_assign({
        stroke: "black",
        fill: "none"
      }, style), datum, active);
    }
  }, {
    key: "getArcPath",
    value: function getArcPath(props) {
      var cx = props.cx,
          cy = props.cy,
          r = props.r,
          startAngle = props.startAngle,
          endAngle = props.endAngle,
          closedPath = props.closedPath; // Always draw the path as two arcs so that complete circles may be rendered.

      var halfAngle = Math.abs(endAngle - startAngle) / 2 + startAngle;
      var x1 = cx + r * Math.cos(Helpers.degreesToRadians(startAngle));
      var y1 = cy - r * Math.sin(Helpers.degreesToRadians(startAngle));
      var x2 = cx + r * Math.cos(Helpers.degreesToRadians(halfAngle));
      var y2 = cy - r * Math.sin(Helpers.degreesToRadians(halfAngle));
      var x3 = cx + r * Math.cos(Helpers.degreesToRadians(endAngle));
      var y3 = cy - r * Math.sin(Helpers.degreesToRadians(endAngle));
      var largerArcFlag1 = halfAngle - startAngle <= 180 ? 0 : 1;
      var largerArcFlag2 = endAngle - halfAngle <= 180 ? 0 : 1;
      var arcStart = closedPath ? " M ".concat(cx, ", ").concat(cy, " L ").concat(x1, ", ").concat(y1) : "M ".concat(x1, ", ").concat(y1);
      var arc1 = "A ".concat(r, ", ").concat(r, ", 0, ").concat(largerArcFlag1, ", 0, ").concat(x2, ", ").concat(y2);
      var arc2 = "A ".concat(r, ", ").concat(r, ", 0, ").concat(largerArcFlag2, ", 0, ").concat(x3, ", ").concat(y3);
      var arcEnd = closedPath ? "Z" : "";
      return "".concat(arcStart, " ").concat(arc1, " ").concat(arc2, " ").concat(arcEnd);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          events = _props.events,
          pathComponent = _props.pathComponent,
          transform = _props.transform,
          clipPath = _props.clipPath;
      return React.cloneElement(pathComponent, {
        d: this.getArcPath(this.props),
        style: this.getStyle(this.props),
        className: className,
        role: role,
        shapeRendering: shapeRendering,
        events: events,
        transform: transform,
        clipPath: clipPath
      });
    }
  }]);

  return Arc;
}(React.Component);

Object.defineProperty(Arc, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    closedPath: PropTypes.bool,
    cx: PropTypes.number,
    cy: PropTypes.number,
    datum: PropTypes.any,
    endAngle: PropTypes.number,
    pathComponent: PropTypes.element,
    r: PropTypes.number,
    startAngle: PropTypes.number
  })
});
Object.defineProperty(Arc, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pathComponent: React.createElement(Path, null)
  }
});
export { Arc as default };