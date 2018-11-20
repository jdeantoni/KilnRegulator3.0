import React from 'react';
import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import ProgramList from "../components/ProgramList";
import {ActionAPI} from "../network/APIClient";

class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'ChooseProgramScreen',
        headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.actionAPI = new ActionAPI();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text>ChooseProgramScreen</Text>
                </View>
                <View style={{flex: 6, backgroundColor: 'skyblue'}}>
                    <ProgramList/>
                </View>
                <View style={{flex: 2} && styles.buttons}>
                    <View style={styles.button}>
                        <Button title={"Créer une nouvelle cuisson"} onPress={() => {}}/>
                    </View>
                    <View style={styles.button}>
                        <Button title={"Lancer la cuisson"} onPress={() => this.launchCooking()}/>
                    </View>
                </View>
            </View>
        );
    }

    launchCooking() {
        this.actionAPI.startCooking()
            .then((response) => {
                if (response.status === 200) {
                    Alert.alert("Démarrage de la cuisson", "Êtes-vous sûr de vouloir lancer le processus de cuisson ?",
                        [
                            {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                            {text: 'Oui', onPress: () => this.props.navigation.navigate("TrackingCooking")},
                        ]);
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .catch((error) => {
                console.log(error);
                alert("Connexion réseau échouée")
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "stretch",

        flexDirection: 'column',
    },
    buttons: {
        alignItems: "center",
    },
    button: {
        padding: 10,
    }
});

export default ChooseProgramScreen;