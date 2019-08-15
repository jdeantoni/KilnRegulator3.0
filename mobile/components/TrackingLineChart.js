import React from "react";
import {Image, StyleSheet, View} from "react-native";
import {
    VictoryChart,
    VictoryLine,
    VictoryTheme,
    VictoryAxis,
    VictoryCursorContainer,
    VictoryZoomContainer,
    VictoryScatter,
    VictoryLabel,
    VictoryGroup
} from "victory-native";
import {secondsToUser} from "../helpers/UnitsHelper";
import {TEMP_ORIGIN, TIME_ORIGIN} from "../helpers/Constants";
import images from "../helpers/ImageLoader";
import colors from "../styles/colors";

export default class TrackingLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: undefined,
            activePoint: null
        }
    }

    render() {
        if (this.state.dimensions === undefined || this.props.theoreticData == null || this.props.theoreticData.length <= 1 || this.props.realData == null || this.props.realData.length <= 1) {
            return (
                <View style={styles.loading} onLayout={this.onLayout}>
                    <Image source={images.loading} style={{width: 100, height: 100}}/>
                </View>
            );
        }
        if (this.coeff == null) this.findCoefficients();

        return (
            <View style={styles.container}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    width={this.state.width}
                    padding={{ left: 60, top: 60, right: 20, bottom: 70 }}
                    containerComponent={
                            <VictoryZoomContainer/>
                    //<VictoryCursorContainer
                    //     cursorDimension="x"
                    //     cursorLabel={cursor => { return {
                    //         message: (secondsToUser(cursor.x) + " | " + this.getTemperatureFromTimeRealData(cursor.x) + "°C"),
                    //         dimensions: this.state.dimensions};
                    //     }}
                    //     onCursorChange={this.handleCursorChange.bind(this)}
                    //     cursorLabelComponent={<ChartCursorLabel/>}
                    // />
                }
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
                                data: { stroke: colors.PRIMARY_DARK_COLOR },
                                parent: { border: "1px solid #ccc"},
                            }}
                            data={this.props.theoreticData}
                            x={"time"}
                            y={"temperature"}
                        />
                        {this.displayRealData()}
                        {/* {this.renderFullSegments(this.props.realData)
                        } */}
                       <VictoryScatter
                        style={{
                            data: { stroke: (d) => d.isFull ? colors.PRIMARY_DARK_COLOR:colors.PRIMARY_LIGHT_COLOR, 
                                    strokeWidth : (d) => d.isFull ? 4:0 },
                            parent: { border: "1px solid #ccc"},
                        }}
                        data={this.props.theoreticData}
                        x={"time"}
                        y={"temperature"}
                    />
                    </VictoryGroup>
                    {this.displayPoint()}
                </VictoryChart>
            </View>
        );
    }

    renderFullSegments(dataFull){
        if (dataFull === undefined){
            return;
        }
        if (dataFull.length > 0){
            return (<VictoryLine
                        style={{
                            parent: { border: "1px solid #ccc"},
                            data: {
                                stroke: "#FF0000"
                                }
                        }}
                        data={dataFull}
                        x={"time"}
                        y={"temperature"}
                    />
            );
        }
    }

    handleCursorChange(value) {
        if (value == null) return;
        const y = this.getTemperatureFromTimeRealData(value);
        if (y == null) return;

        this.setState({
            activePoint: {x: value, y: y}
        });
    }

    displayRealData() {
        if (this.props.realData == null || this.props.realData.length <= 1) {
            return null;
        }
        return (
            <VictoryLine
                style={{
                    data: { stroke: "green" },
                    parent: { border: "1px solid #ccc"},
                }}
                data={this.props.realData}
                x={"timestamp"}
                y={"temperature"}
            />
        );
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

    getTemperatureFromTimeRealData(time) {
        // console.log('time is: ', time)
        if (time > (this.props.realData.length*15)){
            return null;
        } 
        try {
            // console.log('index = ',Math.trunc(time/15));
            const t = this.props.realData[Math.trunc(time/15)];
            // console.log('temp =',t );
            return t.temperature;
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
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
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
