import React from 'react';
import {View, Text, StyleSheet, Button, Alert, BackHandler} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import {ActionAPI, StatusAPI} from "../network/APIClient";

export default class TrackingCookingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'TrackingCookingScreen',
        //headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.state = {
            temperature: 0.0
        };
        this.statusApi = new StatusAPI();
        this.actionApi = new ActionAPI();
        this.getTemperature();
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.container}>
                    <Text>{this.state.temperature}°C</Text>
                </View>
                <View style={styles.container}>
                    <Button title={"Get temperature"} onPress={() => this.getTemperature()}/>
                </View>
                <View style={styles.container}>
                    <Button title={"Stop"} onPress={() => this.stopCooking()}/>
                </View>
            </View>
        );
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.interval = setInterval(() => this.getTemperature(), 5000);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        clearInterval(this.interval);
    }

    getTemperature() {
        this.statusApi.getStatus()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {console.log(response); this.setState({temperature: response.sample.temperature})})
            .catch((error) => {
                console.log(error);
                alert("Connexion réseau échouée")
            });
    }

    stopCooking() {
        Alert.alert("Arrêt de la cuisson", "Êtes-vous sûr de vouloir arrêter le processus de cuisson ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () =>
                        this.actionApi.stopCooking()
                            .then((response) => {
                                if (response.status === 200) {
                                    this.props.navigation.navigate("ChooseProgram")
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
        alignItems: "center"
    },
    container: {
        padding: 10,
    }
});