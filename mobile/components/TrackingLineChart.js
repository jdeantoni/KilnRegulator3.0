import React from "react";
import {StyleSheet, View} from "react-native";
import {
    VictoryChart,
    VictoryLine,
    VictoryTheme,
    VictoryAxis,
    VictoryCursorContainer,
    VictoryScatter,
    VictoryLabel,
    VictoryGroup
} from "victory-native";
import {secondsToUser} from "../helpers/UnitsHelper";
import {TEMP_ORIGIN, TIME_ORIGIN} from "../helpers/Constants";

export default class TrackingLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: undefined,
            activePoint: null
        }
    }

    render() {
        if (this.state.dimensions === undefined) return <View style={styles.container} onLayout={this.onLayout}/>;
        if (this.props.theoreticData == null || this.props.theoreticData.length <= 1) return <View/>;
        if (this.coeff == null) this.findCoefficients();

        return (
            <View style={styles.container}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    height={270} width={this.state.width}
                    containerComponent={<VictoryCursorContainer
                        cursorDimension="x"
                        cursorLabel={cursor => { return {
                            message: (secondsToUser(cursor.x) + " | " + this.getTemperatureFromTimeInSegments(cursor.x) + "°C"),
                            dimensions: this.state.dimensions};
                        }}
                        onCursorChange={this.handleCursorChange.bind(this)}
                        cursorLabelComponent={<ChartCursorLabel/>}
                    />}
                >
                    <VictoryAxis
                        tickFormat={(t) => secondsToUser(t)}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(T) => T + "°C"}
                    />
                    <VictoryGroup>
                        <VictoryLine
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"},
                            }}
                            data={this.props.theoreticData}
                            x={"time"}
                            y={"temperature"}
                        />
                        <VictoryLine
                            style={{
                                data: { stroke: "green" },
                                parent: { border: "1px solid #ccc"},
                            }}
                            data={(this.props.realData.length <= 1) ? [{timestamp: 0, temperature: 0}] : this.props.realData}
                            x={"timestamp"}
                            y={"temperature"}
                        />
                    </VictoryGroup>
                    {this.displayPoint()}
                </VictoryChart>
            </View>
        );
    }

    handleCursorChange(value) {
        if (value == null) return;
        const y = this.getTemperatureFromTimeInSegments(value);
        if (y == null) return;

        this.setState({
            activePoint: {x: value, y: y}
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
        let i;
        for (i = 1; i < this.props.theoreticData.length; i++) {
            if (time < this.props.theoreticData[i].time) break;
        }
        try {
            return Math.round(this.coeff[i].a * time + this.coeff[i].b);
        } catch {
            return null;
        }
    }

    findCoefficients() {
        this.coeff = [];

        let lastPoint;
        let nextPoint = {time: TIME_ORIGIN, temperature: TEMP_ORIGIN};
        let a;
        let b;

        for (let i = 1; i < this.props.theoreticData.length; i++) {
            lastPoint = nextPoint;
            nextPoint = this.props.theoreticData[i];

            a = (nextPoint.temperature - lastPoint.temperature) / (nextPoint.time - lastPoint.time);
            b = lastPoint.temperature - a * lastPoint.time;

            this.coeff[i] = {a: a, b: b};
        }
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

    (x < viewWidth / 2) ? (x += 3) : (x += -92);
    const y = viewHeight / 2;

    return <VictoryLabel {...props} x={x} y={y} text={props.text.message} />;
};
