import React from "react";
import {Alert, BackHandler, Button, StyleSheet, Text, TextInput, View, KeyboardAvoidingView} from "react-native";
import Table from "../components/Table";
import connect from "react-redux/es/connect/connect";
import {displayArrow} from "../helpers/NavigationHelper";
import {NavigationEvents} from "react-navigation";
import uuidv4 from "uuid/v4"
import {ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import EditProgramLineChart from "../components/EditProgramLineChart";
import {getDurationFromTempAndSlope, getTempFromDurationAndSlope, unitToDev, unitToUser} from "../helpers/UnitsManager";
import {
    DURATION,
    NO_PROG_SELECTED,
    SLOPE,
    TABLE_KEYS,
    TARGET_TEMPERATURE,
    TEMP_ORIGIN,
    TIME_ORIGIN
} from "../helpers/Constants";

class EditProgramScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'EditProgramScreen',
        headerLeft: displayArrow(navigation, "Êtes-vous sûr de quitter la page sans conserver les modifications ?", "ChooseProgram"),
    });

    constructor(props) {
        super(props);

        this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());

        this.state = {
            programName: (this.props.selectedProgram !== NO_PROG_SELECTED) ? this.props.programs[this.props.selectedProgram].name : "",
            segments: (this.props.selectedProgram !== NO_PROG_SELECTED) ? unitToUser(this.props.programs[this.props.selectedProgram].segments) : [{}]
        };
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.main_container} behavior="padding">
                <NavigationEvents
                    onWillFocus={() => this.addBackListener()}
                    onWillBlur={() => this.removeBackListener()}
                />
                <View style={styles.graph}>
                    <EditProgramLineChart data={this.dataToChart(this.state.segments)}/>
                </View>

                <View style={styles.table}>
                    <Table
                        segments={this.state.segments}
                        onChangeValue={this.handleChangeValue}/>
                </View>

                <View style={styles.bottom}>
                    <View style={styles.name_input}>
                        <Text style={{flex: 1}}>Nom du programme</Text>
                        <TextInput
                            style={styles.text_input}
                            placeholder={"Nom du programme"}
                            onChangeText={(text) => this.setState({programName: text})}
                            value={this.state.programName}/>
                    </View>

                    <Button
                        title={"Sauvegarder le programme"}
                        onPress={() => this.saveProgram()}/>
                </View>
            </KeyboardAvoidingView>
        );
    }

    handleChangeValue = e => this.setState({segments: e});

    saveProgram() {
        if (!this.checkIntegrity()) {
            return;
        }
        Alert.alert("Sauvegarder", "Voulez-vous enregistrer vos modifications ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () => {
                        const newProgram = {
                            uuid: uuidv4(),
                            name: this.state.programName.trim(),
                            segments: unitToDev(this.state.segments),
                            lastModificationDate: (new Date()).toISOString()
                        };

                        if (this.props.selectedProgram === NO_PROG_SELECTED) {
                            this.programApi.addProgram(newProgram)
                                .then((response) => {
                                    if (!response.ok) throw new Error("HTTP response status not code 200 as expected.");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    alert("Connexion réseau échouée")
                                });
                        } else {
                            this.programApi.editProgram(this.props.selectedProgram, newProgram)
                                .then((response) => {
                                    if (!response.ok) throw new Error("HTTP response status not code 200 as expected.");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    alert("Connexion réseau échouée")
                                });
                        }
                        this.props.dispatch({ type: "SELECT_PROGRAM", value: newProgram.uuid });

                        this.props.navigation.navigate("ChooseProgram");
                    }
                },
            ]);
    }

    checkIntegrity() {
        if (this.state.programName.length === 0) {
            Alert.alert("Erreur", "Le programme n'a pas été nommé.", [{text: 'Ok', onPress: () => {}}]);
            return false;
        }
        if (this.state.segments.length === 0) {
            Alert.alert("Erreur", "Les segments n'ont pas été spécifiés.", [{text: 'Ok', onPress: () => {}}]);
            return false;
        }
        let segments = [...this.state.segments];
        for (let i = 0; i < segments.length; i++) {
            this.checkSegmentIntegrity(segments[i], i);
        }
        this.setState({segments: segments});
        return true;
    }

    checkSegmentIntegrity(segment, i) {
        for (let key in segment) {
            if (segment[key] === "") {
                delete segment[key];
                continue;
            }
            if (Number.isNaN(Number.parseFloat(segment[key]))) {
                Alert.alert("Erreur", "Les segments comportent des erreurs de syntaxe.", [{text: 'Ok', onPress: () => {}}]);
                return false;
            }
            if (Number.parseFloat(segment[key]) !== segment[key]) {
                segment[key] = Number.parseFloat(segment[key]);
            }
        }
        if (Object.keys(segment).length < 2) {
            Alert.alert("Erreur", "Le segment " + (i+1) + " est incomplet.", [{text: 'Ok', onPress: () => {}}]);
            return false;
        }
    }

    addBackListener() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    removeBackListener() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        Alert.alert("Retour", "Êtes-vous sûr de quitter la page sans conserver les modifications ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () => this.props.navigation.navigate("ChooseProgram")},
            ]);
        return true;
    };

    dataToChart(segments) {
        let chartData = [{time: TIME_ORIGIN, temperature: TEMP_ORIGIN}];
        let temp = 0;
        let time = 0;
        let segDuration;
        let segTemp;
        let segSlope;
        let lastTemp;
        let lastTime;
        let timeWithSlope;
        let tempWithSlope;
        for (const i in segments) {
            //set segment vars
            segDuration = parseFloat(segments[i][DURATION]);
            segTemp = parseFloat(segments[i][TARGET_TEMPERATURE]);
            segSlope = parseFloat(segments[i][SLOPE]);
            lastTemp = chartData[chartData.length-1].temperature;
            lastTime = chartData[chartData.length-1].time;
            timeWithSlope = getDurationFromTempAndSlope(segTemp, lastTemp, segSlope);
            tempWithSlope = getTempFromDurationAndSlope(segDuration, segSlope);

            //check properties
            for (let key in segments[i]) {
                if (segments[i][key] === "") {
                    delete segments[i][key];
                }
            }
            if ((segments[i].length < 2) || (segSlope === 0 && lastTemp !== segTemp)) {
                continue;
            }

            //compute time
            if (this.hasProperty(segments[i],[DURATION])) {
                time += segDuration;
            } else {
                time += timeWithSlope;
            }

            //compute temperature
            if (this.hasProperty(segments[i],[TARGET_TEMPERATURE])) {
                temp = segTemp;
            } else {
                temp += tempWithSlope;
            }

            //add plateau if necessary
            if (this.hasProperty(segments[i], TABLE_KEYS)) {
                //horizontal segment
                if (timeWithSlope < segDuration) {
                    chartData[chartData.length] = {
                        time: timeWithSlope + lastTime,
                        temperature: temp
                    };
                }
                //vertical segment
                else if (timeWithSlope > segDuration) {
                    chartData[chartData.length] = {
                        time: time,
                        temperature: tempWithSlope + lastTemp
                    };
                }
            }

            //create point
            if (!Number.isNaN(time) && !Number.isNaN(temp)) {
                chartData[chartData.length] = {time: time, temperature: temp};
            }
        }
        return chartData;
    }

    hasProperty(object, properties) {
        for (let i in properties) {
            if (!object.hasOwnProperty(properties[i])) {
                return false;
            }
        }
        return true;
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "stretch",

        flexDirection: 'column',
    },
    graph: {
        flex: 4,
    },
    table: {
        flex: 4,
    },
    bottom: {
        backgroundColor: "#dddddd",
        padding: 10
    },
    name_input: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        paddingBottom: 3
    },
    text_input: {
        backgroundColor: '#f2f2f2',
        flex: 1,
        padding: 3
    }
});

const mapStateToProps = (state) => {
    return {
        selectedProgram: state.selectedProgram,
        programs: state.programs
    };
};
export default connect(mapStateToProps)(EditProgramScreen);