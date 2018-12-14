import React from "react";
import {StyleSheet, View, AsyncStorage, Alert, Image} from "react-native";
import {displayArrow, offlineMode} from "../helpers/NavigationHelper";
import connect from "react-redux/es/connect/connect";
import SettingsList from 'react-native-settings-list';
import images from "../helpers/ImageLoader";
import {ADD_PROGRAM} from "../helpers/Constants";
import {ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import colors from "../styles/colors";

class SettingsScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Réglages',
        headerLeft: displayArrow(navigation, "ChooseProgram"),
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    constructor(props) {
        super(props);

        this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());
    }

    render() {
        return (
            <View style={styles.main_container}>
                <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Gestion des programmes'
                        titleStyle={{color: colors.PRIMARY_DARK_COLOR, marginBottom: 10, fontWeight: '500'}}
                        itemWidth={50}
                        borderHide={'Both'}
                    />
                    <SettingsList.Item
                        icon={
                            <View style={styles.image_container}>
                                <Image style={styles.image} source={images.import}/>
                            </View>
                        }
                        hasNavArrow={false}
                        itemWidth={70}
                        titleStyle={{color:'black', fontSize: 16}}
                        title={this.firstItemTitle()}
                        onPress={() => this.import()}
                    />
                    <SettingsList.Item
                        icon={
                            <View style={styles.image_container}>
                                <Image style={styles.image} source={images.export}/>
                            </View>
                        }
                        hasNavArrow={false}
                        itemWidth={70}
                        titleStyle={{color:'black', fontSize: 16}}
                        title={this.secondItemTitle()}
                        onPress={() => this.export()}
                    />
                    {(offlineMode) ? null : this.displayHeader()}
                    {(offlineMode) ? null : this.displayHistoryItem()}
                    {(offlineMode) ? null : this.displayHeader()}
                    {(offlineMode) ? null : this.displayErrorsItem()}
                </SettingsList>
            </View>
        );
    }

    firstItemTitle() {
        return (offlineMode) ? 'Écraser les modifications par les données du téléphone' : 'Envoyer les programmes du téléphone vers le four'
    }

    secondItemTitle() {
        return (offlineMode) ? 'Sauvegarder les modifications sur le téléphone' : 'Sauvegarder les programmes du four sur le téléphone'
    }

    displayHeader() {
        return <SettingsList.Header headerStyle={{marginTop:-5}}/>;
    }

    displayHistoryItem() {
        return (
            <SettingsList.Item
                icon={
                    <View style={styles.image_container}>
                        <Image style={styles.image} source={images.history}/>
                    </View>
                }
                hasNavArrow={true}
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                title={"Historique des cuissons"}
                onPress={() => this.props.navigation.navigate("Histories")}
            />
        );
    }

    displayErrorsItem() {
        return (
            <SettingsList.Item
                icon={
                    <View style={styles.image_container}>
                        <Image style={styles.image} source={images.error_settings}/>
                    </View>
                }
                hasNavArrow={true}
                itemWidth={70}
                titleStyle={{color:'black', fontSize: 16}}
                title={"Erreurs soulevées par le four"}
                onPress={() => this.props.navigation.navigate("Errors")}
            />
        );
    }

    import() {
        if (this.fetchingData()) {
            Alert.alert("", "L'import a réussi.");
        } else {
            Alert.alert("Erreur", "L'import des données a échoué.");
        }
    }

    export() {
        if (this.persistingData()) {
            Alert.alert("", "L'export a réussi.");
        } else {
            Alert.alert("Erreur", "L'export des données a échoué.");
        }
    }

    persistingData = async () => {
        try {
            await AsyncStorage.setItem("PROGRAMS", JSON.stringify(this.props.programs));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    fetchingData = async () => {
        try {
            const programs = JSON.parse(await AsyncStorage.getItem('PROGRAMS'));

            let found;
            for (let i in programs) {
                found = false;
                for (let j in this.props.programs) {
                    found = programs[i].uuid === this.props.programs[j].uuid;
                    if (found) break;
                }
                if (!found) {
                    if (offlineMode) {
                        this.props.dispatch({ type: ADD_PROGRAM, value: programs[i] });
                        continue;
                    }
                    this.programApi.addProgram(programs[i])
                        .then((response) => {
                            if (response.ok) {
                                this.props.dispatch({ type: ADD_PROGRAM, value: programs[i] });
                            }
                            else throw new Error("HTTP response status not code 200 as expected.");
                        })
                        .catch((error) => {
                            console.log(error);
                            Alert.alert("Erreur", "Connexion réseau échouée");
                        });
                }
            }

            return programs !== null;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}

const styles = StyleSheet.create({
    main_container: {
        backgroundColor: colors.LIGHT_GREY,
        flex: 1
    },
    image_container: {
        marginLeft: 15,
        marginRight: 20,
        alignSelf: 'center',
        width: 20,
        height: 24,
        justifyContent: 'center'
    },
    image: {
        alignSelf:'center',
        height:22,
        width:22
    }
});

const mapStateToProps = (state) => {
    return {
        programs: state.programs
    };
};
export default connect(mapStateToProps)(SettingsScreen);
