import _isNil from "lodash/isNil";
import _assign from "lodash/assign";
import { Helpers, LabelHelpers, Scale, Domain, Data, Collection } from "victory-core";

var getData = function (props) {
  var accessorTypes = ["x", "high", "low", "close", "open"];
  return Data.formatData(props.data, props, accessorTypes);
};

var reduceData = function (dataset, axis, type) {
  var yDataTypes = {
    min: "_low",
    max: "_high"
  };
  var dataType = axis === "x" ? "_x" : yDataTypes[type];
  var baseCondition = type === "min" ? Infinity : -Infinity;
  return dataset.reduce(function (memo, datum) {
    var current = datum[dataType];
    return memo < current && type === "min" || memo > current && type === "max" ? memo : current;
  }, baseCondition);
};

var getDomainFromData = function (props, axis) {
  var minDomain = Domain.getMinFromProps(props, axis);
  var maxDomain = Domain.getMaxFromProps(props, axis);
  var dataset = getData(props);

  if (dataset.length < 1) {
    var scaleDomain = Scale.getBaseScale(props, axis).domain();

    var _min = minDomain !== undefined ? minDomain : Collection.getMinValue(scaleDomain);

    var _max = maxDomain !== undefined ? maxDomain : Collection.getMaxValue(scaleDomain);

    return Domain.getDomainFromMinMax(_min, _max);
  }

  var min = minDomain !== undefined ? minDomain : reduceData(dataset, axis, "min");
  var max = maxDomain !== undefined ? maxDomain : reduceData(dataset, axis, "max");
  return Domain.getDomainFromMinMax(min, max);
};

var getDomain = function (props, axis) {
  return Domain.createDomainFunction(getDomainFromData)(props, axis);
};

var getCalculatedValues = function (props) {
  var theme = props.theme,
      polar = props.polar;
  var defaultStyle = theme && theme.candlestick && theme.candlestick.style ? theme.candlestick.style : {};
  var style = Helpers.getStyles(props.style, defaultStyle);
  var data = getData(props);
  var range = {
    x: Helpers.getRange(props, "x"),
    y: Helpers.getRange(props, "y")
  };
  var domain = {
    x: getDomain(props, "x"),
    y: getDomain(props, "y")
  };
  var scale = {
    x: Scale.getBaseScale(props, "x").domain(domain.x).range(range.x),
    y: Scale.getBaseScale(props, "y").domain(domain.y).range(range.y)
  };
  var origin = polar ? props.origin || Helpers.getPolarOrigin(props) : undefined;
  return {
    domain: domain,
    data: data,
    scale: scale,
    style: style,
    origin: origin
  };
};

var isTransparent = function (attr) {
  return attr === "none" || attr === "transparent";
};

var getDataStyles = function (datum, style, props) {
  style = style || {};
  var candleColor = datum.open > datum.close ? props.candleColors.negative : props.candleColors.positive;
  var fill = style.fill || candleColor;
  var strokeColor = style.stroke;
  var stroke = isTransparent(strokeColor) ? fill : strokeColor || "black";
  return _assign({}, style, {
    stroke: stroke,
    fill: fill
  });
};

var getLabelProps = function (dataProps, text, style) {
  var x = dataProps.x,
      high = dataProps.high,
      index = dataProps.index,
      scale = dataProps.scale,
      datum = dataProps.datum,
      data = dataProps.data;
  var labelStyle = style.labels || {};
  return {
    style: labelStyle,
    y: high - (labelStyle.padding || 0),
    x: x,
    text: text,
    index: index,
    scale: scale,
    datum: datum,
    data: data,
    textAnchor: labelStyle.textAnchor,
    verticalAnchor: labelStyle.verticalAnchor || "end",
    angle: labelStyle.angle
  };
};

var getBaseProps = function (props, fallbackProps) {
  // eslint-disable-line max-statements
  props = Helpers.modifyProps(props, fallbackProps, "candlestick");
  var calculatedValues = getCalculatedValues(props);
  var data = calculatedValues.data,
      style = calculatedValues.style,
      scale = calculatedValues.scale,
      domain = calculatedValues.domain,
      origin = calculatedValues.origin;
  var _props = props,
      groupComponent = _props.groupComponent,
      width = _props.width,
      height = _props.height,
      padding = _props.padding,
      standalone = _props.standalone,
      name = _props.name,
      candleWidth = _props.candleWidth,
      candleRatio = _props.candleRatio,
      theme = _props.theme,
      polar = _props.polar,
      wickStrokeWidth = _props.wickStrokeWidth,
      labels = _props.labels,
      events = _props.events,
      sharedEvents = _props.sharedEvents;
  var initialChildProps = {
    parent: {
      domain: domain,
      scale: scale,
      width: width,
      height: height,
      data: data,
      standalone: standalone,
      theme: theme,
      polar: polar,
      origin: origin,
      name: name,
      style: style.parent,
      padding: padding
    }
  };
  return data.reduce(function (childProps, datum, index) {
    var eventKey = !_isNil(datum.eventKey) ? datum.eventKey : index;
    var x = scale.x(datum._x1 !== undefined ? datum._x1 : datum._x);
    var high = scale.y(datum._high);
    var close = scale.y(datum._close);
    var open = scale.y(datum._open);
    var low = scale.y(datum._low);
    var dataStyle = getDataStyles(datum, style.data, props);
    var dataProps = {
      x: x,
      high: high,
      low: low,
      candleWidth: candleWidth,
      candleRatio: candleRatio,
      scale: scale,
      data: data,
      datum: datum,
      groupComponent: groupComponent,
      index: index,
      style: dataStyle,
      width: width,
      polar: polar,
      origin: origin,
      wickStrokeWidth: wickStrokeWidth,
      open: open,
      close: close
    };
    childProps[eventKey] = {
      data: dataProps
    };
    var text = LabelHelpers.getText(props, datum, index);

    if (text !== undefined && text !== null || labels && (events || sharedEvents)) {
      childProps[eventKey].labels = getLabelProps(dataProps, text, style);
    }

    return childProps;
  }, initialChildProps);
};

export { getBaseProps, getDomain, getData };