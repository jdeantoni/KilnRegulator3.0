function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";

var ClipPath =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ClipPath, _React$Component);

  function ClipPath() {
    _classCallCheck(this, ClipPath);

    return _possibleConstructorReturn(this, (ClipPath.__proto__ || Object.getPrototypeOf(ClipPath)).apply(this, arguments));
  }

  _createClass(ClipPath, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          children = _props.children,
          clipId = _props.clipId;
      return React.createElement("defs", null, React.createElement("clipPath", {
        id: clipId
      }, children));
    }
  }]);

  return ClipPath;
}(React.Component);

Object.defineProperty(ClipPath, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    clipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }
});
export { ClipPath as default };