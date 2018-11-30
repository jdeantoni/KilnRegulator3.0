import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { connect } from "react-redux";
import {computeTimeFromSegments, isoDateToUser} from "../helpers/UnitsManager";

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
                        <Text style={styles.description_text}>{computeTimeFromSegments(program.segments)}</Text>
                        <Text style={styles.description_text}>Dernière modification le {isoDateToUser(program.lastModificationDate)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
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