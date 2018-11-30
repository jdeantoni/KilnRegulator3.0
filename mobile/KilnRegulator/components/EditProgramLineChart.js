import React from "react";
import {StyleSheet, View} from "react-native";
import {VictoryChart, VictoryLine, VictoryTheme, VictoryAxis} from "victory-native";
import {hoursToHoursAndMinutes} from "../helpers/UnitsManager";

export default class EditProgramLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: undefined,
        }
    }

    render() {
        if (this.state.dimensions === undefined) return <View style={styles.container} onLayout={this.onLayout}/>;
        if (this.props.data.length <= 1) return <View/>;

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
                    <VictoryLine
                        style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc"},
                        }}
                        data={this.props.data}
                        x={"time"}
                        y={"temperature"}
                    />
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