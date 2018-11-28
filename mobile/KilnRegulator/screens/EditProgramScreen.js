import React from "react";
import {Alert, BackHandler, Button, StyleSheet, Text, TextInput, View, KeyboardAvoidingView} from "react-native";
import Table from "../components/Table";
import connect from "react-redux/es/connect/connect";
import {displayArrow} from "../helpers/NavigationHelper";
import {NavigationEvents} from "react-navigation";
import uuidv4 from "uuid/v4"
import {ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";

class EditProgramScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'EditProgramScreen',
        headerLeft: displayArrow(navigation, "Êtes-vous sûr de quitter la page sans conserver les modifications ?", "ChooseProgram"),
    });

    constructor(props) {
        super(props);

        this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());

        this.state = {
            programName: (this.props.selectedProgram !== "") ? this.props.programs[this.props.selectedProgram].name : "",
            segments: (this.props.selectedProgram !== "") ? this.unitToUser(this.props.programs[this.props.selectedProgram].segments) : [{}]
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
                    <Text>Graph</Text>
                </View>

                <View style={styles.table}>
                    <Table
                        segments={this.state.segments}
                        onChangeValue={this.handleChangeValue}/>
                </View>

                <View style={styles.bottom}>
                    <TextInput
                        placeholder={"Nom du programme"}
                        onChangeText={(text) => this.setState({programName: text})}
                        value={this.state.programName}/>
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
                            segments: this.unitToDev(this.state.segments),
                            lastModificationDate: (new Date()).toISOString()
                        };

                        if (this.props.selectedProgram === "") {
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
            for (let key in segments[i]) {
                if (segments[i][key] === "") {
                    delete segments[i][key];
                    continue;
                }
                if (Number.isNaN(Number.parseFloat(segments[i][key]))) {
                    Alert.alert("Erreur", "Les segments comportent des erreurs de syntaxe.", [{text: 'Ok', onPress: () => {}}]);
                    return false;
                }
                if (Number.parseFloat(segments[i][key]) !== segments[i][key]) {
                    segments[i][key] = Number.parseFloat(segments[i][key]);
                }
            }
            if (Object.keys(segments[i]).length < 2) {
                Alert.alert("Erreur", "Le segment " + (i+1) + " est incomplet.", [{text: 'Ok', onPress: () => {}}]);
                return false;
            }
        }
        this.setState({segments: segments});
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

    unitToUser(segments) {
        let newSegments = JSON.parse(JSON.stringify(segments));

        for (let i = 0; i < segments.length; i++) {
            if (segments[i].hasOwnProperty("duration")) {
                newSegments[i]["duration"] = segments[i]["duration"] / 3600;
            }
            if (segments[i].hasOwnProperty("slope")) {
                newSegments[i]["slope"] = segments[i]["slope"] * 3600;
            }
        }

        return newSegments;
    }

    unitToDev(segments) {
        for (let i = 0; i < segments.length; i++) {
            if (segments[i].hasOwnProperty("duration")) {
                segments[i]["duration"] *= 3600;
            }
            if (segments[i].hasOwnProperty("slope")) {
                segments[i]["slope"] /= 3600
            }
            if (segments[i].hasOwnProperty("_id")) {
                delete segments[i]["_id"];
            }
        }

        return segments;
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
    button: {
        padding: 10,
    },
    graph: {
        flex: 4,
        backgroundColor: "skyblue"
    },
    table: {
        flex: 4,
    },
    bottom: {
    }
});

const mapStateToProps = (state) => {
    return {
        selectedProgram: state.selectedProgram,
        programs: state.programs
    };
};
export default connect(mapStateToProps)(EditProgramScreen);