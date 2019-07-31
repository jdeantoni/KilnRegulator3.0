import React from 'react';
import {View, StyleSheet, Button, BackHandler, Alert, TextInput} from 'react-native';
import {StatusAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {NavigationEvents} from "react-navigation";
import {setOfflineMode} from "../helpers/NavigationHelper";
import connect from "react-redux/es/connect/connect";
import {CLEAN_PROGRAMS} from "../helpers/Constants";
import colors from "../styles/colors";

class FindKilnScreen extends React.Component {
    static navigationOptions = () => ({
        title: 'KilnRegulator3.0',
        headerLeft: <View/>,
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    constructor(props) {
        super(props);
        this.state = {
            ip: "192.168.88.1:3000"
        };
    }

    render() {
        return (
            <View style={styles.main_container} behavior="padding">
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                {/* <View style={styles.container}>
                    <TextInput placeholder={"Adresse IP"}
                               onChangeText={(text) => this.setState({ip: text})}
                               value={this.state.ip}/>
                </View> */}
                <View style={styles.container}>
                    <Button title={"Se connecter au four"}
                            onPress={() => this.kilnSelected()}
                            color={colors.PRIMARY_COLOR}/>

                </View>
                <View style={styles.container}>
                    <Button title={"Mode hors ligne"}
                            onPress={() => this.offlineModeSelected()}
                            color={colors.PRIMARY_COLOR}/>
                </View>
            </View>
        );
    }

    onWillFocus() {
        this.props.dispatch({ type: CLEAN_PROGRAMS });

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    onWillBlur() {
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
                setOfflineMode(false);
                if (response.state === "ready") {
                    this.props.navigation.navigate("ChooseProgram");
                }
                else {
                    this.props.navigation.navigate("TrackingCooking");
                }
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée");
            });
    }

    offlineModeSelected() {
        setOfflineMode(true);
        this.props.navigation.navigate("ChooseProgram")
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: colors.LIGHT_GREY,
        justifyContent: 'center',
        alignItems: "center"
    },
    container: {
        padding: 10
    }
});

export default connect()(FindKilnScreen);
