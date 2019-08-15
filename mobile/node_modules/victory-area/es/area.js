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

var getY0Accessor = function (scale) {
  return function (d) {
    return scale.y(d._y0);
  };
};

var getAngleAccessor = function (scale) {
  return function (d) {
    var x = scale.x(d._x1 !== undefined ? d._x1 : d._x);
    return -1 * x + Math.PI / 2;
  };
};

var Area =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Area, _React$Component);

  function Area() {
    _classCallCheck(this, Area);

    return _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).apply(this, arguments));
  }

  _createClass(Area, [{
    key: "getLineFunction",
    value: function getLineFunction(props) {
      var polar = props.polar,
          scale = props.scale;
      var interpolation = this.toNewName(props.interpolation);
      return polar ? d3Shape.lineRadial().defined(defined).curve(d3Shape["".concat(interpolation, "Closed")]).angle(getAngleAccessor(scale)).radius(getY0Accessor(scale)) : d3Shape.line().defined(defined).curve(d3Shape[interpolation]).x(getXAccessor(scale)).y(getYAccessor(scale));
    }
  }, {
    key: "getAreaFunction",
    value: function getAreaFunction(props) {
      var polar = props.polar,
          scale = props.scale;
      var interpolation = this.toNewName(props.interpolation);
      return polar ? d3Shape.radialArea().defined(defined).curve(d3Shape["".concat(interpolation, "Closed")]).angle(getAngleAccessor(scale)).outerRadius(getYAccessor(scale)).innerRadius(getY0Accessor(scale)) : d3Shape.area().defined(defined).curve(d3Shape[interpolation]).x(getXAccessor(scale)).y1(getYAccessor(scale)).y0(getY0Accessor(scale));
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
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          polar = _props.polar,
          origin = _props.origin,
          data = _props.data,
          active = _props.active,
          pathComponent = _props.pathComponent,
          events = _props.events,
          groupComponent = _props.groupComponent,
          clipPath = _props.clipPath,
          id = _props.id;
      var style = Helpers.evaluateStyle(_assign({
        fill: "black"
      }, this.props.style), data, active);
      var defaultTransform = polar && origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
      var transform = this.props.transform || defaultTransform;
      var renderLine = style.stroke && style.stroke !== "none" && style.stroke !== "transparent";
      var areaFunction = this.getAreaFunction(this.props);
      var lineFunction = renderLine && this.getLineFunction(this.props);
      var areaStroke = style.stroke ? "none" : style.fill;
      var sharedProps = {
        className: className,
        role: role,
        shapeRendering: shapeRendering,
        transform: transform,
        events: events,
        clipPath: clipPath
      };
      var area = React.cloneElement(pathComponent, _assign({
        key: "".concat(id, "-area"),
        style: _assign({}, style, {
          stroke: areaStroke
        }),
        d: areaFunction(data)
      }, sharedProps));
      var line = renderLine ? React.cloneElement(pathComponent, _assign({
        key: "".concat(id, "-area-stroke"),
        style: _assign({}, style, {
          fill: "none"
        }),
        d: lineFunction(data)
      }, sharedProps)) : null;
      return renderLine ? React.cloneElement(groupComponent, {}, [area, line]) : area;
    }
  }]);

  return Area;
}(React.Component);

Object.defineProperty(Area, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.primitiveProps, {
    groupComponent: PropTypes.element,
    interpolation: PropTypes.string,
    pathComponent: PropTypes.element
  })
});
Object.defineProperty(Area, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    groupComponent: React.createElement("g", null),
    pathComponent: React.createElement(Path, null)
  }
});
export { Area as default };