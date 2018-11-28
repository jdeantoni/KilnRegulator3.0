import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from "react-redux";

class ProgramItem extends React.Component {
    render() {
        const program = this.props.programs[this.props.id.item];

        return (
            <TouchableOpacity style={[styles.main_container, this.isSelected()]} onPress={() => {this.toggleOnPress()}}>
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>{program.name}</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>{program.segments.length} segment{this.writeS(program.segments.length)}</Text>
                        <Text style={styles.description_text}>{this.computeTime(program.segments)}</Text>
                        <Text style={styles.description_text}>Dernière modification le {program.lastModificationDate.split("T")[0]}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    computeTime(segments) {
        let timeInSeconds = 0;
        segments.forEach((segment) => {
            if (segment.hasOwnProperty("duration")) {
                timeInSeconds += segment["duration"];
            } else if (segment.hasOwnProperty("targetTemperature") && segment.hasOwnProperty("slope")) {
                timeInSeconds += segment["targetTemperature"] / segment["slope"];
            }
        });

        const hours = Math.floor(timeInSeconds / 3600);
        let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
        if (minutes < 10) { minutes = "0" + minutes }

        return hours + "h" + minutes + "min";
    }

    toggleOnPress() {
        const action = { type: "SELECT_PROGRAM", value: this.props.id.item };
        this.props.dispatch(action);
    }

    isSelected() {
        if (this.props.selectedProgram === this.props.id.item) {
            return {
                backgroundColor: "lightgreen"
            }
        } else {
            return {
                backgroundColor: "white"
            };
        }
    }

    writeS(nbSegments) {
        return (nbSegments > 1) ? "s" : "";
    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 100,
        flexDirection: 'row',
    },
    textId: {
        fontSize: 40
    },
    content_container: {
        margin: 5
    },
    header_container: {
        flex: 2,
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 20,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    description_container: {
        flex: 4,
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        flex: 1
    }
});

const mapStateToProps = (state) => {
    return {
        selectedProgram: state.selectedProgram,
        programs: state.programs
    };
};
export default connect(mapStateToProps)(ProgramItem);