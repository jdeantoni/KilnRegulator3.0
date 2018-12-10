import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from "react-redux";
import {
    estimateTimeInSecondsForAllSegments,
    isoDateToUser,
    secondsToUser
} from "../helpers/UnitsHelper";
import images from "../helpers/ImageLoader";

class ProgramItem extends React.Component {
    render() {
        const program = this.props.programs[this.props.id.item];

        return (
            <TouchableOpacity style={[styles.main_container, this.colorIfSelected()]} onPress={() => {this.toggleOnPress()}}>
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>{program.name}</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>{program.segments.length} segment{this.writeS(program.segments.length)}</Text>
                        <Text style={styles.description_text}>Durée : {secondsToUser(estimateTimeInSecondsForAllSegments(program.segments))}</Text>
                        <Text style={styles.description_text}>Dernière modification le {isoDateToUser(program.lastModificationDate)}</Text>
                    </View>
                </View>
                {this.displayGarbage()}
            </TouchableOpacity>
        )
    }

    toggleOnPress() {
        const action = { type: "SELECT_PROGRAM", value: this.props.id.item };
        this.props.dispatch(action);
    }

    colorIfSelected() {
        if (this.props.selectedProgram === this.props.id.item) {
            return {
                backgroundColor: "lightgreen"
            }
        }
    }

    writeS(nbSegments) {
        return (nbSegments > 1) ? "s" : "";
    }

    displayGarbage() {
        if (this.props.selectedProgram === this.props.id.item) {
            return (
                <View style={styles.right_container}>
                    <Image source={images.garbage} style={styles.garbage}/>
                </View>
            );
        }
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
        margin: 5,
        flex: 4
    },
    header_container: {
        flex: 2,
    },
    right_container: {
        justifyContent: 'center',
        alignItems: "center",
        flex: 1
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
    },
    garbage: {
        height: 25,
        width: 25
    }
});

const mapStateToProps = (state) => {
    return {
        selectedProgram: state.selectedProgram,
        programs: state.programs
    };
};
export default connect(mapStateToProps)(ProgramItem);
