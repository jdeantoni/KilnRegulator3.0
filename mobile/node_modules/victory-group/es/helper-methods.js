import _assign from "lodash/assign";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import React from "react";
import { Helpers, Scale, Data, Wrapper } from "victory-core";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  offset: 0
}; // eslint-disable-next-line max-statements

function getCalculatedProps(props, childComponents) {
  var role = "group";
  var style = Wrapper.getStyle(props.theme, props.style, role);
  var modifiedProps = Helpers.modifyProps(props, fallbackProps);
  var offset = modifiedProps.offset,
      colorScale = modifiedProps.colorScale,
      color = modifiedProps.color,
      polar = modifiedProps.polar;
  var horizontal = modifiedProps.horizontal || childComponents.every(function (component) {
    return component.props && component.props.horizontal;
  });
  var categories = Wrapper.getCategories(modifiedProps, childComponents);
  var datasets = Wrapper.getDataFromChildren(modifiedProps);
  var domain = {
    x: Wrapper.getDomain(_assign({}, modifiedProps, {
      categories: categories
    }), "x", childComponents),
    y: Wrapper.getDomain(_assign({}, modifiedProps, {
      categories: categories
    }), "y", childComponents)
  };
  var range = {
    x: Helpers.getRange(modifiedProps, "x"),
    y: Helpers.getRange(modifiedProps, "y")
  };
  var baseScale = {
    x: Scale.getScaleFromProps(modifiedProps, "x") || Scale.getDefaultScale(),
    y: Scale.getScaleFromProps(modifiedProps, "y") || Scale.getDefaultScale()
  };
  var xScale = baseScale.x.domain(domain.x).range(range.x);
  var yScale = baseScale.y.domain(domain.y).range(range.y);
  var scale = {
    x: horizontal ? yScale : xScale,
    y: horizontal ? xScale : yScale
  };
  var origin = polar ? props.origin : Helpers.getPolarOrigin(modifiedProps);
  var padding = Helpers.getPadding(props);
  return {
    datasets: datasets,
    categories: categories,
    range: range,
    domain: domain,
    horizontal: horizontal,
    scale: scale,
    style: style,
    colorScale: colorScale,
    color: color,
    offset: offset,
    origin: origin,
    padding: padding
  };
}

function pixelsToValue(props, axis, calculatedProps) {
  if (!props.offset) {
    return 0;
  }

  var childComponents = React.Children.toArray(props.children);
  var horizontalChildren = childComponents.some(function (child) {
    return child.props.horizontal;
  });
  var horizontal = props && props.horizontal || horizontalChildren.length > 0;
  var currentAxis = Helpers.getCurrentAxis(axis, horizontal);
  var domain = calculatedProps.domain[currentAxis];
  var range = calculatedProps.range[currentAxis];
  var domainExtent = Math.max.apply(Math, _toConsumableArray(domain)) - Math.min.apply(Math, _toConsumableArray(domain));
  var rangeExtent = Math.max.apply(Math, _toConsumableArray(range)) - Math.min.apply(Math, _toConsumableArray(range));
  return domainExtent / rangeExtent * props.offset;
}

function getX0(props, calculatedProps, index) {
  var center = (calculatedProps.datasets.length - 1) / 2;
  var totalWidth = pixelsToValue(props, "x", calculatedProps);
  return (index - center) * totalWidth;
}

function getPolarX0(props, calculatedProps, index) {
  var center = (calculatedProps.datasets.length - 1) / 2;
  var width = getAngularWidth(props, calculatedProps);
  return (index - center) * width;
}

function getAngularWidth(props, calculatedProps) {
  var range = calculatedProps.range;
  var angularRange = Math.abs(range.x[1] - range.x[0]);
  var r = Math.max.apply(Math, _toConsumableArray(range.y));
  return props.offset / (2 * Math.PI * r) * angularRange;
}

function getLabels(props, datasets, index) {
  if (!props.labels) {
    return undefined;
  }

  return Math.floor(datasets.length / 2) === index ? props.labels : undefined;
}

function getChildProps(props, calculatedProps) {
  var categories = calculatedProps.categories,
      domain = calculatedProps.domain,
      range = calculatedProps.range,
      scale = calculatedProps.scale,
      horizontal = calculatedProps.horizontal,
      origin = calculatedProps.origin,
      padding = calculatedProps.padding;
  var width = props.width,
      height = props.height,
      theme = props.theme,
      polar = props.polar;
  return {
    height: height,
    width: width,
    theme: theme,
    polar: polar,
    origin: origin,
    categories: categories,
    domain: domain,
    range: range,
    scale: scale,
    horizontal: horizontal,
    padding: padding,
    standalone: false
  };
}

function getColorScale(props, child) {
  var role = child.type && child.type.role;
  var colorScaleOptions = child.props.colorScale || props.colorScale;

  if (role !== "group" && role !== "stack") {
    return undefined;
  }

  return props.theme && props.theme.group ? colorScaleOptions || props.theme.group.colorScale : colorScaleOptions;
}

function getDataWithOffset(props) {
  var defaultDataset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var offset = arguments.length > 2 ? arguments[2] : undefined;
  var dataset = props.data || props.y ? Data.getData(props) : defaultDataset;
  var xOffset = offset || 0;
  return dataset.map(function (datum) {
    var _x1 = datum._x instanceof Date ? new Date(datum._x.getTime() + xOffset) : datum._x + xOffset;

    return _assign({}, datum, {
      _x1: _x1
    });
  });
}

function getChildren(props, childComponents, calculatedProps) {
  props = Helpers.modifyProps(props, fallbackProps, "stack");
  childComponents = childComponents || React.Children.toArray(props.children);
  calculatedProps = calculatedProps || getCalculatedProps(props, childComponents);
  var _calculatedProps = calculatedProps,
      datasets = _calculatedProps.datasets;
  var _props = props,
      labelComponent = _props.labelComponent,
      polar = _props.polar;
  var childProps = getChildProps(props, calculatedProps);
  var parentName = props.name || "group";
  return childComponents.map(function (child, index) {
    var role = child.type && child.type.role;
    var xOffset = polar ? getPolarX0(props, calculatedProps, index) : getX0(props, calculatedProps, index);
    var style = role === "voronoi" || role === "tooltip" || role === "label" ? child.props.style : Wrapper.getChildStyle(child, index, calculatedProps);
    var labels = props.labels ? getLabels(props, datasets, index) : child.props.labels;
    var name = child.props.name || "".concat(parentName, "-").concat(role, "-").concat(index);
    return React.cloneElement(child, _assign({
      labels: labels,
      style: style,
      key: "".concat(name, "-key-").concat(index),
      name: name,
      data: getDataWithOffset(props, datasets[index], xOffset),
      colorScale: getColorScale(props, child),
      labelComponent: labelComponent || child.props.labelComponent,
      xOffset: role === "stack" ? xOffset : undefined
    }, childProps));
  });
}

export { getChildren, getCalculatedProps };