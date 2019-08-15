import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";

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
import { Helpers, CommonProps, Path } from "victory-core";
import * as d3Shape from "d3-shape";

var Slice =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Slice, _React$Component);

  function Slice() {
    _classCallCheck(this, Slice);

    return _possibleConstructorReturn(this, (Slice.__proto__ || Object.getPrototypeOf(Slice)).apply(this, arguments));
  }

  _createClass(Slice, [{
    key: "getPath",
    value: function getPath(props) {
      var datum = props.datum,
          active = props.active,
          slice = props.slice;

      if (_isFunction(props.pathFunction)) {
        return props.pathFunction(slice);
      }

      var cornerRadius = Helpers.evaluateProp(props.cornerRadius, datum, active);
      var innerRadius = Helpers.evaluateProp(props.innerRadius, datum, active);
      var radius = Helpers.evaluateProp(props.radius, datum, active);
      var padAngle = Helpers.degreesToRadians(Helpers.evaluateProp(props.padAngle, datum, active));
      var startAngle = Helpers.degreesToRadians(Helpers.evaluateProp(props.sliceStartAngle, datum, active));
      var endAngle = Helpers.degreesToRadians(Helpers.evaluateProp(props.sliceEndAngle, datum, active));
      var pathFunction = d3Shape.arc().cornerRadius(cornerRadius).outerRadius(radius).innerRadius(innerRadius);
      return pathFunction(_defaults({
        startAngle: startAngle,
        endAngle: endAngle,
        padAngle: padAngle
      }, slice));
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          datum = _props.datum,
          active = _props.active,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          origin = _props.origin,
          events = _props.events,
          pathComponent = _props.pathComponent,
          style = _props.style,
          clipPath = _props.clipPath;
      var defaultTransform = origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
      var transform = this.props.transform || defaultTransform;
      return React.cloneElement(pathComponent, {
        className: className,
        role: role,
        shapeRendering: shapeRendering,
        events: events,
        transform: transform,
        clipPath: clipPath,
        style: Helpers.evaluateStyle(style, datum, active),
        d: this.getPath(this.props)
      });
    }
  }]);

  return Slice;
}(React.Component);

Object.defineProperty(Slice, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    datum: PropTypes.object,
    innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    padAngle: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    pathComponent: PropTypes.element,
    pathFunction: PropTypes.func,
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    slice: PropTypes.object,
    sliceEndAngle: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    sliceStartAngle: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
  })
});
Object.defineProperty(Slice, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pathComponent: React.createElement(Path, null)
  }
});
export { Slice as default };