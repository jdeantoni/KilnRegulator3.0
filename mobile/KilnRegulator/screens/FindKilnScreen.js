import React from 'react';
import {View, Text, StyleSheet, Button, BackHandler, Alert, TextInput} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import {StatusAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {NavigationEvents} from "react-navigation";

export default class FindKilnScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'FindKilnScreen',
        //headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.state = {
            ip: ""
        };
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.addBackListener()}
                    onWillBlur={() => this.removeBackListener()}
                />
                <Text>FindKilnScreen</Text>
                <TextInput placeholder={"Adresse IP"}
                           onChangeText={(text) => this.setState({ip: text})}
                           value={this.state.ip}/>
                <Button title={"Sélectionner four"} onPress={() => this.kilnSelected()}/>
            </View>
        );
    }

    addBackListener() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    removeBackListener() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        Alert.alert("Quitter", "Êtes-vous sûr de vouloir quitter l'application ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () => BackHandler.exitApp()},
            ]);
        return true;
    };

    kilnSelected() {
        this.statusApi = new StatusAPI(this.state.ip);

        this.statusApi.getStatus()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                NetworkRoute.getInstance().setAddress(this.state.ip);
                if (response.state === "ready") {
                    this.props.navigation.navigate("ChooseProgram");
                }
                else {
                    this.props.navigation.navigate("TrackingCooking");
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Connexion réseau échouée")
            });
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "center"
    },
});