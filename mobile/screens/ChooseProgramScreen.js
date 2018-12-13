import React from 'react';
import {
    View,
    StyleSheet,
    Button,
    Alert,
    BackHandler,
    TouchableOpacity,
    Image,
    FlatList,
    AsyncStorage,
    Text
} from 'react-native';
import {displaySimpleArrow, offlineMode} from "../helpers/NavigationHelper";
import {ActionAPI, ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import { NavigationEvents } from 'react-navigation';
import { connect } from "react-redux";
import {NO_PROG_SELECTED, SELECT_PROGRAM, UPDATE_PROGRAMS} from "../helpers/Constants";
import images from "../helpers/ImageLoader";
import ProgramItem from "../components/ProgramItem";
import colors from "../styles/colors";

class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Choix du programme',
        headerLeft: (navigation.state.params === undefined || navigation.state.params.headerLeft === undefined) ?
            displaySimpleArrow() : navigation.state.params.headerLeft,
        headerRight: (
            <TouchableOpacity style={{paddingRight: 16}} onPress={() => {navigation.navigate("Settings")}}>
                <Image source={images.settings} style={{height: 28, width: 28}}/>
            </TouchableOpacity>),
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    componentWillMount(){
        this.props.navigation.setParams({
            headerLeft: (
                <TouchableOpacity style={{paddingLeft: 16}} onPress={() => this.handleBackPress()}>
                    <Image source={images.arrow} style={{height: 24, width: 24}}/>
                </TouchableOpacity>
            )
        })
    }

    constructor(props) {
        super(props);

        if (offlineMode) {
            this.fetchingData();
        } else {
            this.actionAPI = new ActionAPI(NetworkRoute.getInstance().getAddress());
            this.programsAPI = new ProgramsAPI(NetworkRoute.getInstance().getAddress());
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <View style={{flex: 6}}>
                    {this.displayList()}
                </View>
                <View style={{flex: 2} && styles.buttons}>
                    <View style={styles.button}>
                        <Button
                            title={this.buttonName()}
                            onPress={() => this.buttonAction()}
                            color={colors.PRIMARY_COLOR}/>
                    </View>
                </View>
            </View>
        );
    }

    onWillFocus() {
        if (!offlineMode) {
            this.getPrograms();
        }

        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    onWillBlur() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    displayList() {
        if (this.props.programs === undefined || this.props.programs == null || this.props.programs.length < 1) {
            return (
                <View style={styles.no_program}>
                    <Text style={styles.no_program_text}>Aucun programme</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={this.props.programs}
                    keyExtractor={(item) => {return item.uuid}}
                    renderItem={({item}) => <ProgramItem program={item} navigation={this.props.navigation}/>}
                />
            );
        }
    }


    buttonName() {
        return (this.props.selectedProgram === NO_PROG_SELECTED || offlineMode) ? "Créer un nouveau programme" : "Lancer la cuisson";
    }

    buttonAction() {
        if (this.props.selectedProgram === NO_PROG_SELECTED || offlineMode) {
            this.props.navigation.navigate("EditProgram");
        } else {
            this.launchCooking();
        }
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

    fetchingData = async () => {
        try {
            const programs = JSON.parse(await AsyncStorage.getItem('PROGRAMS'));
            this.props.dispatch({ type: UPDATE_PROGRAMS, value: programs });
            return programs !== null;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    persistingData = async () => {
        try {
            await AsyncStorage.setItem("PROGRAMS", JSON.stringify(this.props.programs));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    handleBackPress = () => {
        if (offlineMode) {
            Alert.alert("Retour", "Voulez-vous quitter la page en sauvegardant les modifications sur le téléphone ?",
                [
                    {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                    {text: 'Quitter sans sauvegarder', onPress: () => {this.props.navigation.navigate("FindKiln");}},
                    {text: 'Quitter et sauvegarder', onPress: () => {
                            this.persistingData();
                            this.props.navigation.navigate("FindKiln");
                        }}
                ]);
        } else {
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
        }

        return true;
    };
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column',
        backgroundColor: colors.LIGHT_GREY
    },
    no_program: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    no_program_text: {
        fontStyle: 'italic',
        color: '#666666'
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
