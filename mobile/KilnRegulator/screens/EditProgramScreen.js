import React from "react";
import {Alert, BackHandler, Button, StyleSheet, Text, TextInput, View} from "react-native";
import Table from "../components/Table";
import connect from "react-redux/es/connect/connect";
import {displayArrow} from "../helpers/NavigationHelper";
import {NavigationEvents} from "react-navigation";

class EditProgramScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'EditProgramScreen',
        headerLeft: displayArrow(navigation, "Êtes-vous sûr de quitter la page sans conserver les modifications ?", "ChooseProgram"),
    });

    constructor(props) {
        super(props);

        this.state = {
            programName: (this.props.selectedProgram !== -1) ? this.props.programs[this.props.selectedProgram-1].name : "",
            segments: (this.props.selectedProgram !== -1) ? this.props.programs[this.props.selectedProgram-1].segments : [{}]
        };
    }

    render() {
        return (
            <View style={styles.main_container}>
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
            </View>
        );
    }
//TODO Check int for text input
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
                            id: (this.props.selectedProgram !== -1) ? this.props.selectedProgram : this.props.programs.length+1,
                            name: this.state.programName,
                            segments: this.state.segments
                        };

                        const action = { type: "EDIT_PROGRAM", value: newProgram };
                        this.props.dispatch(action);

                        this.props.navigation.navigate("ChooseProgram")
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