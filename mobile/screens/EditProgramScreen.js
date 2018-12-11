import React from "react";
import {Alert, BackHandler, Button, StyleSheet, Text, TextInput, View, KeyboardAvoidingView} from "react-native";
import Table from "../components/Table";
import {displayArrowWithMessage} from "../helpers/NavigationHelper";
import {NavigationEvents} from "react-navigation";
import uuidv4 from "uuid/v4"
import {ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import EditProgramLineChart from "../components/EditProgramLineChart";
import {unitToDev, unitToUser} from "../helpers/UnitsHelper";
import {ADD_PROGRAM, DELETE_PROGRAM} from "../helpers/Constants";
import segmentsToChart from "../helpers/ChartHelper";
import connect from "react-redux/es/connect/connect";

class EditProgramScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Édition d\'un programme',
        headerLeft: displayArrowWithMessage(navigation, "Êtes-vous sûr de quitter la page sans conserver les modifications ?", "ChooseProgram"),
    });

    constructor(props) {
        super(props);

        this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());

        try {
            this.initProgram = this.props.navigation.state.params.program;
        } catch {
            this.initProgram = undefined;
        }
        this.state = {
            programName: (this.initProgram === undefined) ? "" : this.initProgram.name,
            segments: (this.initProgram === undefined) ? [{}] : unitToUser(this.initProgram.segments)
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
                    <EditProgramLineChart data={segmentsToChart(this.state.segments)}/>
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

                        if (this.initProgram === undefined) {
                            this.programApi.addProgram(newProgram)
                                .then((response) => {
                                    if (response.ok) {
                                        this.props.dispatch({ type: ADD_PROGRAM, value: newProgram });
                                        this.props.navigation.navigate("ChooseProgram");
                                    }
                                    else throw new Error("HTTP response status not code 200 as expected.");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    Alert.alert("Erreur", "Connexion réseau échouée");
                                });
                        }
                        else {
                            this.programApi.editProgram(this.initProgram.uuid, newProgram)
                                .then((response) => {
                                    if (response.ok) {
                                        this.props.dispatch({ type: DELETE_PROGRAM, value: this.initProgram.uuid });
                                        this.props.dispatch({ type: ADD_PROGRAM, value: newProgram });
                                        this.props.navigation.navigate("ChooseProgram");
                                    }
                                    else throw new Error("HTTP response status not code 200 as expected.");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    Alert.alert("Erreur", "Connexion réseau échouée");
                                });
                        }
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
        let isCorrect;
        for (let i = 0; i < segments.length; i++) {
            isCorrect = this.checkSegmentIntegrity(segments[i], i);
            if (!isCorrect) return false;
        }
        this.setState({segments: segments});
        return true;
    }

    checkSegmentIntegrity(segment, i) {
        for (let key in segment) {
            if (segment[key] === "" || segment[key] === "-" || segment[key] === ".") {
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
        return true;
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

export default connect()(EditProgramScreen);
