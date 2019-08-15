import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import * as d3Shape from "d3-shape";
import { Helpers, CommonProps, Path } from "victory-core";

var defined = function (d) {
  var y = d._y1 !== undefined ? d._y1 : d._y;
  return y !== null && y !== undefined && d._y0 !== null;
};

var getXAccessor = function (scale) {
  return function (d) {
    return scale.x(d._x1 !== undefined ? d._x1 : d._x);
  };
};

var getYAccessor = function (scale) {
  return function (d) {
    return scale.y(d._y1 !== undefined ? d._y1 : d._y);
  };
};

var getAngleAccessor = function (scale) {
  return function (d) {
    var x = scale.x(d._x1 !== undefined ? d._x1 : d._x);
    return -1 * x + Math.PI / 2;
  };
};

var Curve =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Curve, _React$Component);

  function Curve() {
    _classCallCheck(this, Curve);

    return _possibleConstructorReturn(this, (Curve.__proto__ || Object.getPrototypeOf(Curve)).apply(this, arguments));
  }

  _createClass(Curve, [{
    key: "getLineFunction",
    value: function getLineFunction(props) {
      var polar = props.polar,
          scale = props.scale;
      var defaultOpenCurve = polar ? false : true;
      var openCurve = props.openCurve === undefined ? defaultOpenCurve : props.openCurve;
      var interpolation = !openCurve ? "".concat(this.toNewName(props.interpolation), "Closed") : this.toNewName(props.interpolation);
      return polar ? d3Shape.lineRadial().defined(defined).curve(d3Shape[interpolation]).angle(getAngleAccessor(scale)).radius(getYAccessor(scale)) : d3Shape.line().defined(defined).curve(d3Shape[interpolation]).x(getXAccessor(scale)).y(getYAccessor(scale));
    }
  }, {
    key: "toNewName",
    value: function toNewName(interpolation) {
      // d3 shape changed the naming scheme for interpolators from "basis" -> "curveBasis" etc.
      var capitalize = function (s) {
        return s && s[0].toUpperCase() + s.slice(1);
      };

      return "curve".concat(capitalize(interpolation));
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          data = _props.data,
          active = _props.active,
          events = _props.events,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          polar = _props.polar,
          origin = _props.origin,
          pathComponent = _props.pathComponent,
          clipPath = _props.clipPath;
      var style = Helpers.evaluateStyle(_assign({
        fill: "none",
        stroke: "black"
      }, this.props.style), data, active);
      var lineFunction = this.getLineFunction(this.props);
      var path = lineFunction(data);
      var defaultTransform = polar && origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
      var transform = this.props.transform || defaultTransform;
      return React.cloneElement(pathComponent, {
        className: className,
        style: style,
        role: role,
        shapeRendering: shapeRendering,
        transform: transform,
        events: events,
        d: path,
        clipPath: clipPath
      });
    }
  }]);

  return Curve;
}(React.Component);

Object.defineProperty(Curve, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    interpolation: PropTypes.string,
    openCurve: PropTypes.bool,
    origin: PropTypes.object,
    pathComponent: PropTypes.element,
    polar: PropTypes.bool
  })
});
Object.defineProperty(Curve, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    pathComponent: React.createElement(Path, null)
  }
});
export { Curve as default };