import React from 'react';
import {View, StyleSheet, Button, Alert, BackHandler, TouchableOpacity, Image, FlatList} from 'react-native';
import { displayArrowWithMessage } from "../helpers/NavigationHelper";
import {ActionAPI, ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import { NavigationEvents } from 'react-navigation';
import { connect } from "react-redux";
import {NO_PROG_SELECTED, SELECT_PROGRAM, UPDATE_PROGRAMS} from "../helpers/Constants";
import images from "../helpers/ImageLoader";
import ProgramItem from "../components/ProgramItem";

class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Choix du programme',
        headerLeft: displayArrowWithMessage(navigation, "Êtes-vous sûr de vouloir vous déconnecter du four ?", "FindKiln"),
        headerRight: (
            <TouchableOpacity style={{paddingRight: 16}} onPress={() => {navigation.navigate("Settings")}}>
                <Image source={images.settings}
                       style={{height: 28, width: 28}}/>
            </TouchableOpacity>)
    });

    constructor(props) {
        super(props);

        this.actionAPI = new ActionAPI(NetworkRoute.getInstance().getAddress());
        this.programsAPI = new ProgramsAPI(NetworkRoute.getInstance().getAddress());
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <View style={{flex: 6}}>
                    <FlatList
                        data={this.props.programs}
                        keyExtractor={(item) => {return item.uuid}}
                        renderItem={({item}) => <ProgramItem program={item} navigation={this.props.navigation}/>}
                    />
                </View>
                <View style={{flex: 2} && styles.buttons}>
                    <View style={styles.button}>
                        <Button
                            title={(this.props.selectedProgram === NO_PROG_SELECTED) ? "Créer un nouveau programme" : "Lancer la cuisson"}
                            onPress={() => {
                                if (this.props.selectedProgram === NO_PROG_SELECTED) {
                                    this.props.navigation.navigate("EditProgram")
                                } else {
                                    this.launchCooking();
                                }}
                            }/>
                    </View>
                </View>
            </View>
        );
    }

    onWillFocus() {
        this.getPrograms();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    onWillBlur() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    launchCooking() {
        Alert.alert("Démarrage de la cuisson", "Êtes-vous sûr de vouloir lancer le processus de cuisson ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () =>
                        this.actionAPI.startCooking({uuid: this.props.selectedProgram})
                            .then((response) => {
                                if (response.ok) {
                                    this.props.navigation.navigate("TrackingCooking", {
                                        program: this.props.selectedProgram
                                    });
                                }
                                else throw new Error("HTTP response status not code 200 as expected.");
                            })
                            .catch((error) => {
                                console.log(error);
                                Alert.alert("Erreur", "Connexion réseau échouée");
                            })
                },
            ]);
    }

    handleBackPress = () => {
        Alert.alert("Retour", "Êtes-vous sûr de vouloir vous déconnecter du four ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () => {
                    if (this.props.selectedProgram !== NO_PROG_SELECTED) {
                        this.props.dispatch({ type: SELECT_PROGRAM, value: this.props.selectedProgram });
                    }
                    this.props.navigation.navigate("FindKiln");
                }},
            ]);
        return true;
    };

    getPrograms() {
        this.programsAPI.getPrograms()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                this.props.dispatch({ type: UPDATE_PROGRAMS, value: response });
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée");
            });
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
