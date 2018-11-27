import React from 'react';
import {View, StyleSheet, Button, Alert, BackHandler} from 'react-native';
import { displayArrow } from "../helpers/NavigationHelper";
import ProgramList from "../components/ProgramList";
import {ActionAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import { NavigationEvents } from 'react-navigation';
import { connect } from "react-redux";

class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'ChooseProgramScreen',
        headerLeft: displayArrow(navigation, "Êtes-vous sûr de vouloir vous déconnecter du four ?", "FindKiln"),
    });

    constructor(props) {
        super(props);
        this.actionAPI = new ActionAPI(NetworkRoute.getInstance().getAddress());
        this.state = {
            ids: [],
        };
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.addBackListener()}
                    onWillBlur={() => this.removeBackListener()}
                />
                <View style={{flex: 6}}>
                    <ProgramList ids={this.state.ids}/>
                </View>
                <View style={{flex: 2} && styles.buttons}>
                    <View style={styles.button}>
                        <Button title={this.buttonNameEditProgram()} onPress={() => this.props.navigation.navigate("EditProgram")}/>
                    </View>
                    <View style={styles.button}>
                        <Button title={"Lancer la cuisson"} onPress={() => this.launchCooking()} disabled={this.props.selectedProgram === -1}/>
                    </View>
                </View>
            </View>
        );
    }

    addBackListener() {
        this.setState({ids: Array.from({length: this.props.programs.length}, (v, k) => k+1)});
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    removeBackListener() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    launchCooking() {
        Alert.alert("Démarrage de la cuisson", "Êtes-vous sûr de vouloir lancer le processus de cuisson ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () =>
                        this.actionAPI.startCooking()
                            .then((response) => {
                                if (response.ok) {
                                    this.props.navigation.navigate("TrackingCooking");
                                }
                                else throw new Error("HTTP response status not code 200 as expected.");
                            })
                            .catch((error) => {
                                console.log(error);
                                alert("Connexion réseau échouée")
                            })
                },
            ]);
    }

    handleBackPress = () => {
        Alert.alert("Retour", "Êtes-vous sûr de vouloir vous déconnecter du four ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () => this.props.navigation.navigate("FindKiln")},
            ]);
        return true;
    };

    buttonNameEditProgram() {
        return (this.props.selectedProgram === -1) ? "Créer un nouveau programme" : "Modifier le programme sélectionné";
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column',
    },
    buttons: {
        alignItems: "stretch",
    },
    button: {
        padding: 10,
    }
});

const mapStateToProps = (state) => {
    return {
        selectedProgram: state.selectedProgram,
        programs: state.programs
    };
};
export default connect(mapStateToProps)(ChooseProgramScreen);