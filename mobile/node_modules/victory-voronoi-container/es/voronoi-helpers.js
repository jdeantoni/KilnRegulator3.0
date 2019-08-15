import _includes from "lodash/includes";
import _keys from "lodash/keys";
import _groupBy from "lodash/groupBy";
import _isEmpty from "lodash/isEmpty";
import _isFunction from "lodash/isFunction";
import _throttle from "lodash/throttle";
import _assign from "lodash/assign";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { Selection, Data, Helpers } from "victory-core";
import isEqual from "react-fast-compare";
import { voronoi as d3Voronoi } from "d3-voronoi";
import React from "react";
var VoronoiHelpers = {
  withinBounds: function (props, point) {
    var width = props.width,
        height = props.height,
        voronoiPadding = props.voronoiPadding,
        polar = props.polar,
        origin = props.origin,
        scale = props.scale;
    var padding = voronoiPadding || 0;
    var x = point.x,
        y = point.y;

    if (polar) {
      var distanceSquared = Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2);
      var radius = Math.max.apply(Math, _toConsumableArray(scale.y.range()));
      return distanceSquared < Math.pow(radius, 2);
    } else {
      return x >= padding && x <= width - padding && y >= padding && y <= height - padding;
    }
  },
  getDatasets: function (props) {
    var children = React.Children.toArray(props.children);

    var addMeta = function (data, name, child) {
      var continuous = child && child.type && child.type.continuous;
      var style = child ? child.props && child.props.style : props.style;
      return data.map(function (datum, index) {
        var _Helpers$getPoint = Helpers.getPoint(datum),
            x = _Helpers$getPoint.x,
            y = _Helpers$getPoint.y,
            y0 = _Helpers$getPoint.y0,
            x0 = _Helpers$getPoint.x0;

        var voronoiX = props.horizontal ? (+y + +y0) / 2 : (+x + +x0) / 2;
        var voronoiY = props.horizontal ? (+x + +x0) / 2 : (+y + +y0) / 2;
        return _assign({
          _voronoiX: props.voronoiDimension === "y" ? 0 : voronoiX,
          _voronoiY: props.voronoiDimension === "x" ? 0 : voronoiY,
          eventKey: index,
          childName: name,
          continuous: continuous,
          style: style
        }, datum);
      });
    };

    if (props.data) {
      return addMeta(props.data);
    }

    var getData = function (childProps) {
      var data = Data.getData(childProps);
      return Array.isArray(data) && data.length > 0 ? data : undefined;
    };

    var iteratee = function (child, childName) {
      var childProps = child.props || {};
      var name = childProps.name || childName;
      var blacklist = props.voronoiBlacklist || [];

      if (!Data.isDataComponent(child) || _includes(blacklist, name)) {
        return null;
      }

      var getChildData = child.type && _isFunction(child.type.getData) ? child.type.getData : getData;
      var childData = getChildData(child.props);
      return childData ? addMeta(childData, name, child) : null;
    };

    return Helpers.reduceChildren(children, iteratee, props);
  },
  // returns an array of objects with point and data where point is an x, y coordinate, and data is
  // an array of points belonging to that coordinate
  mergeDatasets: function (props, datasets) {
    var points = _groupBy(datasets, function (datum) {
      var _Helpers$scalePoint = Helpers.scalePoint(props, datum),
          x = _Helpers$scalePoint.x,
          y = _Helpers$scalePoint.y;

      return "".concat(x, ",").concat(y);
    });

    return _keys(points).map(function (key) {
      var point = key.split(",");
      return {
        x: +point[0],
        y: +point[1],
        points: points[key]
      };
    });
  },
  getVoronoi: function (props, mousePosition) {
    var width = props.width,
        height = props.height,
        voronoiPadding = props.voronoiPadding;
    var padding = voronoiPadding || 0;
    var voronoiFunction = d3Voronoi().x(function (d) {
      return d.x;
    }).y(function (d) {
      return d.y;
    }).extent([[padding, padding], [width - padding, height - padding]]);
    var datasets = this.getDatasets(props);
    var voronoi = voronoiFunction(this.mergeDatasets(props, datasets));
    var size = props.voronoiDimension ? undefined : props.radius;
    return voronoi.find(mousePosition.x, mousePosition.y, size);
  },
  getActiveMutations: function (props, point) {
    var childName = point.childName,
        continuous = point.continuous;
    var activateData = props.activateData,
        activateLabels = props.activateLabels,
        labels = props.labels;

    if (!activateData && !activateLabels) {
      return [];
    }

    var defaultTarget = activateData ? ["data"] : [];
    var targets = labels && !activateLabels ? defaultTarget : defaultTarget.concat("labels");

    if (_isEmpty(targets)) {
      return [];
    }

    return targets.map(function (target) {
      var eventKey = continuous === true && target === "data" ? "all" : point.eventKey;
      return {
        childName: childName,
        eventKey: eventKey,
        target: target,
        mutation: function () {
          return {
            active: true
          };
        }
      };
    });
  },
  getInactiveMutations: function (props, point) {
    var childName = point.childName,
        continuous = point.continuous;
    var activateData = props.activateData,
        activateLabels = props.activateLabels,
        labels = props.labels;

    if (!activateData && !activateLabels) {
      return [];
    }

    var defaultTarget = activateData ? ["data"] : [];
    var targets = labels && !activateLabels ? defaultTarget : defaultTarget.concat("labels");

    if (_isEmpty(targets)) {
      return [];
    }

    return targets.map(function (target) {
      var eventKey = continuous && target === "data" ? "all" : point.eventKey;
      return {
        childName: childName,
        eventKey: eventKey,
        target: target,
        mutation: function () {
          return null;
        }
      };
    });
  },
  getParentMutation: function (activePoints, mousePosition, parentSVG) {
    return [{
      target: "parent",
      eventKey: "parent",
      mutation: function () {
        return {
          activePoints: activePoints,
          mousePosition: mousePosition,
          parentSVG: parentSVG
        };
      }
    }];
  },
  onActivated: function (props, points) {
    if (_isFunction(props.onActivated)) {
      props.onActivated(points, props);
    }
  },
  onDeactivated: function (props, points) {
    if (_isFunction(props.onDeactivated)) {
      props.onDeactivated(points, props);
    }
  },
  onMouseLeave: function (evt, targetProps) {
    var _this = this,
        _getParentMutation;

    var activePoints = targetProps.activePoints || [];
    this.onDeactivated(targetProps, activePoints);
    var inactiveMutations = activePoints.length ? activePoints.map(function (point) {
      return _this.getInactiveMutations(targetProps, point);
    }) : [];
    return (_getParentMutation = this.getParentMutation([])).concat.apply(_getParentMutation, _toConsumableArray(inactiveMutations));
  },
  onMouseMove: function (evt, targetProps) {
    var _this2 = this;

    // eslint-disable-line max-statements
    var activePoints = targetProps.activePoints || [];
    var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
    var mousePosition = Selection.getSVGEventCoordinates(evt, parentSVG);

    if (!this.withinBounds(targetProps, mousePosition)) {
      var _getParentMutation2;

      this.onDeactivated(targetProps, activePoints);
      var inactiveMutations = activePoints.length ? activePoints.map(function (point) {
        return _this2.getInactiveMutations(targetProps, point);
      }) : [];
      return (_getParentMutation2 = this.getParentMutation([], mousePosition, parentSVG)).concat.apply(_getParentMutation2, _toConsumableArray(inactiveMutations));
    }

    var nearestVoronoi = this.getVoronoi(targetProps, mousePosition);
    var points = nearestVoronoi ? nearestVoronoi.data.points : [];
    var parentMutations = this.getParentMutation(points, mousePosition, parentSVG);

    if (activePoints.length && isEqual(points, activePoints)) {
      return parentMutations;
    } else {
      this.onActivated(targetProps, points);
      this.onDeactivated(targetProps, activePoints);
      var activeMutations = points.length ? points.map(function (point) {
        return _this2.getActiveMutations(targetProps, point);
      }) : [];

      var _inactiveMutations = activePoints.length ? activePoints.map(function (point) {
        return _this2.getInactiveMutations(targetProps, point);
      }) : [];

      return parentMutations.concat.apply(parentMutations, _toConsumableArray(_inactiveMutations).concat(_toConsumableArray(activeMutations)));
    }
  }
};
export default {
  onMouseLeave: VoronoiHelpers.onMouseLeave.bind(VoronoiHelpers),
  onMouseMove: _throttle(VoronoiHelpers.onMouseMove.bind(VoronoiHelpers), 32, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  })
};