import React from 'react';
import {View, Text, StyleSheet, Button, Alert, BackHandler} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import ProgramList from "../components/ProgramList";
import {ActionAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import { NavigationEvents } from 'react-navigation';

export default class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'ChooseProgramScreen',
        //headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.actionAPI = new ActionAPI(NetworkRoute.getInstance().getAddress());
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.addBackListener()}
                    onWillBlur={() => this.removeBackListener()}
                />
                <View style={styles.title}>
                    <Text>ChooseProgramScreen</Text>
                </View>
                <View style={{flex: 6, backgroundColor: 'skyblue'}}>
                    <ProgramList/>
                </View>
                <View style={{flex: 2} && styles.buttons}>
                    <View style={styles.button}>
                        <Button title={"Créer un nouveau programme"} onPress={() => this.props.navigation.navigate("CreateProgram")}/>
                    </View>
                    <View style={styles.button}>
                        <Button title={"Lancer la cuisson"} onPress={() => this.launchCooking()}/>
                    </View>
                </View>
            </View>
        );
    }

    addBackListener() {
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
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "stretch",

        flexDirection: 'column',
    },
    buttons: {
        alignItems: "stretch",
    },
    button: {
        padding: 10,
    },
    title: {
        alignItems: 'center',
        padding: 10,
        fontSize: 16
    }
});