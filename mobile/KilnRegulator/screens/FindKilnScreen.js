import React from 'react';
import {View, Text, StyleSheet, Button, BackHandler, Alert, TextInput} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import {StatusAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";

export default class FindKilnScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'FindKilnScreen',
        //headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.state = {
            ip: "10.212.100.10:3000"
        };
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Text>FindKilnScreen</Text>
                <TextInput placeholder={"Adresse IP"}
                           onChangeText={(text) => this.setState({ip: text})}
                           value={this.state.ip}/>
                <Button title={"Sélectionner four"} onPress={() => this.kilnSelected()}/>
            </View>
        );
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
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
        if (this.statusApi == null) {
            this.statusApi = new StatusAPI(this.state.ip);
        }

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