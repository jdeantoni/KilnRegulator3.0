import React from "react";
import {StyleSheet, View} from "react-native";
import {
    VictoryChart,
    VictoryLine,
    VictoryTheme,
    VictoryAxis,
    VictoryCursorContainer,
    VictoryScatter,
    VictoryLabel
} from "victory-native";
import {hoursToHoursAndMinutes} from "../helpers/UnitsHelper";
import {TEMP_ORIGIN, TIME_ORIGIN} from "../helpers/Constants";

export default class EditProgramLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: undefined,
            activePoint: null
        };
    }

    render() {
        if (this.state.dimensions === undefined) return <View style={styles.container} onLayout={this.onLayout}/>;
        if (this.props.data.length <= 1) return <View/>;

        return (
            <View style={styles.container}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    height={270} width={this.state.width}
                    containerComponent={<VictoryCursorContainer
                        cursorDimension="x"
                        cursorLabel={cursor => { return {
                            message: (hoursToHoursAndMinutes(cursor.x) + " | " + this.getTemperatureFromTimeInSegments(cursor.x) + "°C"),
                            dimensions: this.state.dimensions};
                        }}
                        onCursorChange={this.handleCursorChange.bind(this)}
                        cursorLabelComponent={<ChartCursorLabel/>}
                    />}
                >
                    <VictoryAxis
                        tickFormat={(t) => hoursToHoursAndMinutes(t)}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(T) => T + "°C"}
                    />
                    <VictoryLine
                        style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc"},
                        }}
                        data={this.props.data}
                        x={"time"}
                        y={"temperature"}
                    />
                    {this.displayPoint()}
                </VictoryChart>
            </View>
        );
    }

    handleCursorChange(value) {
        if (value == null) return;

        this.setState({
            activePoint: {x: value, y: this.getTemperatureFromTimeInSegments(value)}
        });
    }

    displayPoint() {
        return (
            this.state.activePoint ?
                <VictoryScatter data={[this.state.activePoint]} style={{data: {size: 100} }}/>
                : null
        );
    }

    onLayout = event => {
        if (this.state.dimensions) return;
        let {width, height} = event.nativeEvent.layout;
        this.setState({dimensions: {width, height}});
    };

    getTemperatureFromTimeInSegments(time) {
        let lastPoint = {time: TIME_ORIGIN, temperature: TEMP_ORIGIN};
        let nextPoint;

        for (let i in this.state.data) {
            if (this.state.props[i].time < time) {
                lastPoint = this.state.props[i];
            } else if (this.state.props[i].time > time) {
                nextPoint = this.state.props[i];
                break;
            } else {
                return this.state.props[i].temperature;
            }
        }

        const a = (nextPoint.temperature - lastPoint.temperature) / (nextPoint.time - lastPoint.time);
        const b = lastPoint.temperature - a * lastPoint.time;

        return Math.round(a * time + b);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    }
});

const ChartCursorLabel = (props) => {
    let x = props.x;
    const viewWidth = props.text.dimensions.width;
    const viewHeight = props.text.dimensions.height;

    (x < viewWidth / 2) ? (x += 3) : (x += -103);
    const y = viewHeight / 2;

    return <VictoryLabel {...props} x={x} y={y} text={props.text.message} />;
};