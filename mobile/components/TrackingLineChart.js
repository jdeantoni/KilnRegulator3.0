import React from "react";
import {StyleSheet, View} from "react-native";
import {VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryStack, VictoryArea} from "victory-native";
import {hoursToHoursAndMinutes} from "../helpers/UnitsManager";

export default class TrackingLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: undefined,
        }
    }

    render() {
        if (this.state.dimensions === undefined) return <View style={styles.container} onLayout={this.onLayout}/>;

        return (
            <View style={styles.container}>
                <VictoryChart theme={VictoryTheme.material} height={270} width={this.state.width}>
                    <VictoryAxis
                        tickFormat={(t) => hoursToHoursAndMinutes(t)}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(T) => T + "°C"}
                    />
                    <VictoryStack>
                        <VictoryLine
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"},
                            }}
                            data={this.props.data}
                            x={"time"}
                            y={"temperature"}
                        />
                        <VictoryArea
                            style={{
                                data: { fill: "#c43a31" }
                            }}
                            data={this.props.data}
                            x={"time"}
                            y={"temperature"}
                        />
                    </VictoryStack>
                </VictoryChart>
            </View>
        );
    }

    onLayout = event => {
        if (this.state.dimensions) return;
        let {width, height} = event.nativeEvent.layout;
        this.setState({dimensions: {width, height}});
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