import _isObject from "lodash/isObject";
import _uniqueId from "lodash/uniqueId";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "../victory-util/prop-types";
import Portal from "../victory-portal/portal";
import Timer from "../victory-util/timer";
import Helpers from "../victory-util/helpers";

var VictoryContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryContainer, _React$Component);

  function VictoryContainer(props) {
    var _this;

    _classCallCheck(this, VictoryContainer);

    _this = _possibleConstructorReturn(this, (VictoryContainer.__proto__ || Object.getPrototypeOf(VictoryContainer)).call(this, props));
    _this.getTimer = _this.getTimer.bind(_assertThisInitialized(_this));
    _this.containerId = !_isObject(props) || props.containerId === undefined ? _uniqueId("victory-container-") : props.containerId;

    _this.savePortalRef = function (portal) {
      _this.portalRef = portal;
      return portal;
    };

    _this.portalUpdate = function (key, el) {
      return _this.portalRef.portalUpdate(key, el);
    };

    _this.portalRegister = function () {
      return _this.portalRef.portalRegister();
    };

    _this.portalDeregister = function (key) {
      return _this.portalRef.portalDeregister(key);
    };

    return _this;
  }

  _createClass(VictoryContainer, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        portalUpdate: this.portalUpdate,
        portalRegister: this.portalRegister,
        portalDeregister: this.portalDeregister,
        getTimer: this.getTimer
      };
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.context.getTimer) {
        this.getTimer().stop();
      }
    }
  }, {
    key: "getTimer",
    value: function getTimer() {
      if (this.context.getTimer) {
        return this.context.getTimer();
      }

      if (!this.timer) {
        this.timer = new Timer();
      }

      return this.timer;
    }
  }, {
    key: "getIdForElement",
    value: function getIdForElement(elementName) {
      return "".concat(this.containerId, "-").concat(elementName);
    } // overridden in custom containers

  }, {
    key: "getChildren",
    value: function getChildren(props) {
      return props.children;
    }
  }, {
    key: "renderContainer",
    value: function renderContainer(props, svgProps, style) {
      var title = props.title,
          desc = props.desc,
          portalComponent = props.portalComponent,
          className = props.className,
          width = props.width,
          height = props.height,
          portalZIndex = props.portalZIndex,
          responsive = props.responsive;
      var children = this.getChildren(props);
      var dimensions = responsive ? {
        width: "100%",
        height: "100%"
      } : {
        width: width,
        height: height
      };

      var divStyle = _assign({
        pointerEvents: "none",
        touchAction: "none",
        position: "relative"
      }, dimensions);

      var portalDivStyle = _assign({
        zIndex: portalZIndex,
        position: "absolute",
        top: 0,
        left: 0
      }, dimensions);

      var svgStyle = _assign({
        pointerEvents: "all"
      }, dimensions);

      var portalSvgStyle = _assign({
        overflow: "visible"
      }, dimensions);

      var portalProps = {
        width: width,
        height: height,
        viewBox: svgProps.viewBox,
        style: portalSvgStyle
      };
      return React.createElement("div", {
        style: _defaults({}, style, divStyle),
        className: className,
        ref: props.containerRef
      }, React.createElement("svg", _extends({}, svgProps, {
        style: svgStyle
      }), title ? React.createElement("title", {
        id: this.getIdForElement("title")
      }, title) : null, desc ? React.createElement("desc", {
        id: this.getIdForElement("desc")
      }, desc) : null, children), React.createElement("div", {
        style: portalDivStyle
      }, React.cloneElement(portalComponent, _objectSpread({}, portalProps, {
        ref: this.savePortalRef
      }))));
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          responsive = _props.responsive,
          events = _props.events;
      var style = responsive ? this.props.style : Helpers.omit(this.props.style, ["height", "width"]);

      var svgProps = _assign({
        width: width,
        height: height,
        role: "img",
        "aria-labelledby": "".concat(this.getIdForElement("title"), " ").concat(this.getIdForElement("desc")),
        viewBox: responsive ? "0 0 ".concat(width, " ").concat(height) : undefined
      }, events);

      return this.renderContainer(this.props, svgProps, style);
    }
  }]);

  return VictoryContainer;
}(React.Component);

Object.defineProperty(VictoryContainer, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryContainer"
});
Object.defineProperty(VictoryContainer, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "container"
});
Object.defineProperty(VictoryContainer, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    className: PropTypes.string,
    containerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    containerRef: PropTypes.func,
    desc: PropTypes.string,
    events: PropTypes.object,
    height: CustomPropTypes.nonNegative,
    name: PropTypes.string,
    origin: PropTypes.shape({
      x: CustomPropTypes.nonNegative,
      y: CustomPropTypes.nonNegative
    }),
    polar: PropTypes.bool,
    portalComponent: PropTypes.element,
    portalZIndex: CustomPropTypes.integer,
    responsive: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object,
    title: PropTypes.string,
    width: CustomPropTypes.nonNegative
  }
});
Object.defineProperty(VictoryContainer, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    className: "VictoryContainer",
    portalComponent: React.createElement(Portal, null),
    portalZIndex: 99,
    responsive: true
  }
});
Object.defineProperty(VictoryContainer, "contextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    getTimer: PropTypes.func
  }
});
Object.defineProperty(VictoryContainer, "childContextTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    portalUpdate: PropTypes.func,
    portalRegister: PropTypes.func,
    portalDeregister: PropTypes.func,
    getTimer: PropTypes.func
  }
});
export { VictoryContainer as default };