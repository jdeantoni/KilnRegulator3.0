import _isNil from "lodash/isNil";
import { Helpers, LabelHelpers, Scale, Domain, Data, Collection } from "victory-core";

var getErrors = function (datum, scale, axis) {
  /**
   * check if it is asymmetric error or symmetric error, asymmetric error should be an array
   * and the first value is the positive error, the second is the negative error
   * @param  {Boolean} isArray(errorX)
   * @return {String or Array}
   */
  var errorNames = {
    x: "_errorX",
    y: "_errorY"
  };
  var errors = datum[errorNames[axis]];

  if (errors === 0) {
    return false;
  }

  return Array.isArray(errors) ? [errors[0] === 0 ? false : scale[axis](errors[0] + datum["_".concat(axis)]), errors[1] === 0 ? false : scale[axis](datum["_".concat(axis)] - errors[1])] : [scale[axis](errors + datum["_".concat(axis)]), scale[axis](datum["_".concat(axis)] - errors)];
};

var getData = function (props) {
  var accessorTypes = ["x", "y", "errorX", "errorY"];

  if (props.data) {
    return Data.formatData(props.data, props, accessorTypes);
  } else {
    var generatedData = props.errorX || props.errorY ? Data.generateData(props) : [];
    return Data.formatData(generatedData, props, accessorTypes);
  }
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

  var currentAxis = Helpers.getCurrentAxis(axis, props.horizontal);
  var error = currentAxis === "x" ? "_errorX" : "_errorY";

  var reduceErrorData = function (type) {
    var baseCondition = type === "min" ? Infinity : -Infinity;
    var errorIndex = type === "min" ? 1 : 0;
    var sign = type === "min" ? -1 : 1;
    return dataset.reduce(function (memo, datum) {
      var currentError = Array.isArray(datum[error]) ? datum[error][errorIndex] : datum[error];
      var current = datum["_".concat(currentAxis)] + sign * (currentError || 0);
      return memo < current && type === "min" || memo > current && type === "max" ? memo : current;
    }, baseCondition);
  };

  var min = minDomain !== undefined ? minDomain : reduceErrorData("min");
  var max = maxDomain !== undefined ? maxDomain : reduceErrorData("max");
  return Domain.getDomainFromMinMax(min, max);
};

var getDomain = function (props, axis) {
  return Domain.createDomainFunction(getDomainFromData)(props, axis);
};

var getCalculatedValues = function (props) {
  var defaultStyles = props.theme && props.theme.errorbar && props.theme.errorbar.style ? props.theme.errorbar.style : {};
  var style = Helpers.getStyles(props.style, defaultStyles) || {};
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
  var origin = props.polar ? props.origin || Helpers.getPolarOrigin(props) : undefined;
  return {
    domain: domain,
    data: data,
    scale: scale,
    style: style,
    origin: origin
  };
};

var getLabelProps = function (dataProps, text, style) {
  var x = dataProps.x,
      index = dataProps.index,
      scale = dataProps.scale,
      errorY = dataProps.errorY;
  var error = errorY && Array.isArray(errorY) ? errorY[0] : errorY;
  var y = error || dataProps.y;
  var labelStyle = style.labels || {};
  return {
    style: labelStyle,
    y: y - (labelStyle.padding || 0),
    x: x,
    text: text,
    index: index,
    scale: scale,
    datum: dataProps.datum,
    data: dataProps.data,
    textAnchor: labelStyle.textAnchor,
    verticalAnchor: labelStyle.verticalAnchor || "end",
    angle: labelStyle.angle
  };
};

var getBaseProps = function (props, fallbackProps) {
  props = Helpers.modifyProps(props, fallbackProps, "errorbar");

  var _getCalculatedValues = getCalculatedValues(props, fallbackProps),
      data = _getCalculatedValues.data,
      style = _getCalculatedValues.style,
      scale = _getCalculatedValues.scale,
      domain = _getCalculatedValues.domain,
      origin = _getCalculatedValues.origin;

  var _props = props,
      groupComponent = _props.groupComponent,
      height = _props.height,
      width = _props.width,
      borderWidth = _props.borderWidth,
      standalone = _props.standalone,
      theme = _props.theme,
      polar = _props.polar,
      padding = _props.padding,
      labels = _props.labels,
      events = _props.events,
      sharedEvents = _props.sharedEvents,
      name = _props.name;
  var initialChildProps = {
    parent: {
      domain: domain,
      scale: scale,
      data: data,
      height: height,
      width: width,
      standalone: standalone,
      theme: theme,
      polar: polar,
      origin: origin,
      name: name,
      padding: padding,
      style: style.parent
    }
  };
  return data.reduce(function (childProps, datum, index) {
    var eventKey = !_isNil(datum.eventKey) ? datum.eventKey : index;
    var x = scale.x(datum._x1 !== undefined ? datum._x1 : datum._x);
    var y = scale.y(datum._y1 !== undefined ? datum._y1 : datum._y);
    var dataProps = {
      x: x,
      y: y,
      scale: scale,
      datum: datum,
      data: data,
      index: index,
      groupComponent: groupComponent,
      borderWidth: borderWidth,
      style: style.data,
      errorX: getErrors(datum, scale, "x"),
      errorY: getErrors(datum, scale, "y")
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