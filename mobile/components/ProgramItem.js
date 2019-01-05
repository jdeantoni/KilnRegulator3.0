import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Image, Alert} from 'react-native'
import { connect } from "react-redux";
import {
    estimateTimeInSecondsForAllSegments,
    isoDateToUser,
    secondsToUser
} from "../helpers/UnitsHelper";
import images from "../helpers/ImageLoader";
import uuidv4 from "uuid/v4";
import {ADD_PROGRAM, DELETE_PROGRAM, SELECT_PROGRAM} from "../helpers/Constants";
import {ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {offlineMode} from "../helpers/NavigationHelper";
import colors from "../styles/colors";

class ProgramItem extends React.Component {
    constructor(props) {
        super(props);

        if (!offlineMode) {
            this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());
        }
    }

    render() {
        if (!this.props.program) return <View/>;
        this.program = this.props.program;

        return (
            <TouchableOpacity style={[styles.main_container, this.colorIfSelected()]} onPress={() => {this.toggleOnPress()}}>
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>{this.program.name}</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>{this.program.segments.length} segment{this.writeS(this.program.segments.length)}</Text>
                        <Text style={styles.description_text}>Durée : {secondsToUser(estimateTimeInSecondsForAllSegments(this.program.segments))}</Text>
                        <Text style={styles.description_text}>Dernière modification le {isoDateToUser(this.program.lastModificationDate)}</Text>
                    </View>
                </View>
                {this.displayIcons()}
            </TouchableOpacity>
        )
    }

    toggleOnPress() {
        const action = { type: SELECT_PROGRAM, value: this.program.uuid };
        this.props.dispatch(action);
    }

    colorIfSelected() {
        if (this.props.selectedProgram === this.program.uuid) {
            return {
                backgroundColor: colors.SECONDARY_LIGHT_COLOR
            }
        }
    }

    writeS(nbSegments) {
        return (nbSegments > 1) ? "s" : "";
    }

    displayIcons() {
        if (this.props.selectedProgram === this.program.uuid) {
            return (
                <View style={styles.right_container}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate("EditProgram", { program: this.program, offline: this.props.offline })
                    }}>
                        <Image source={images.edit} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.duplicateProgram()}>
                        <Image source={images.duplicate} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.eraseProgram()}>
                        <Image source={images.garbage} style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    duplicateProgram() {
        const newProgram = {
            uuid: uuidv4(),
            name: this.program.name,
            segments: this.program.segments,
            segmentEditableStates:this.program.segmentEditableStates,
            lastModificationDate: (new Date()).toISOString()
        };

        if (offlineMode) {
            this.props.dispatch({ type: ADD_PROGRAM, value: newProgram });
        } else {
            this.programApi.addProgram(newProgram)
                .then((response) => {
                    if (response.ok) {
                        this.props.dispatch({ type: ADD_PROGRAM, value: newProgram });
                    }
                    else throw new Error("HTTP response status not code 200 as expected.");
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert("Erreur", "Connexion réseau échouée");
                });
        }
    }

    eraseProgram() {
        if (offlineMode) {
            this.props.dispatch({ type: DELETE_PROGRAM, value: this.program.uuid });
        } else {
            this.programApi.deleteProgram(this.program.uuid)
                .then((response) => {
                    if (response.ok) {
                        this.props.dispatch({ type: DELETE_PROGRAM, value: this.program.uuid });
                    }
                    else throw new Error("HTTP response status not code 200 as expected.");
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert("Erreur", "Connexion réseau échouée");
                });
        }
    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 100,
        flexDirection: 'row',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    textId: {
        fontSize: 40
    },
    content_container: {
        margin: 5,
        flex: 3
    },
    header_container: {
        flex: 2,
    },
    right_container: {
        justifyContent: 'center',
        alignItems: "center",
        marginRight: 5,
        flex: 1,
        flexDirection: 'row'
    },
    title_text: {
        fontWeight: 'bold',
        color: colors.PRIMARY_DARK_COLOR,
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
    icon: {
        height: 25,
        width: 25,
        marginHorizontal: 5
    }
});

const mapStateToProps = (state) => {
    return {
        selectedProgram: state.selectedProgram,
        programs: state.programs
    };
};
export default connect(mapStateToProps)(ProgramItem);
