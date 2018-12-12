import React from "react";
import {StyleSheet, View, AsyncStorage, Alert, Image} from "react-native";
import {displayArrow, offlineMode} from "../helpers/NavigationHelper";
import connect from "react-redux/es/connect/connect";
import SettingsList from 'react-native-settings-list';
import images from "../helpers/ImageLoader";
import {ADD_PROGRAM} from "../helpers/Constants";
import {ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";

class SettingsScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Réglages',
        headerLeft: displayArrow(navigation, "ChooseProgram")
    });

    constructor(props) {
        super(props);

        this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());
    }

    render() {
        return (
            <View style={{backgroundColor:'#f6f6f6',flex:1}}>
                <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Gestion des programmes'
                        titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
                        itemWidth={50}
                        borderHide={'Both'}
                    />
                    <SettingsList.Item
                        icon={
                            <View style={styles.imageStyle}>
                                <Image style={{alignSelf:'center', height:22, width:22}} source={images.import}/>
                            </View>
                        }
                        hasNavArrow={false}
                        itemWidth={70}
                        titleStyle={{color:'black', fontSize: 16}}
                        title={this.firstItemTitle()}
                        onPress={() => {this.import()}}
                    />
                    <SettingsList.Item
                        icon={
                            <View style={styles.imageStyle}>
                                <Image style={{alignSelf:'center', height:22, width:22}} source={images.export}/>
                            </View>
                        }
                        hasNavArrow={false}
                        itemWidth={70}
                        titleStyle={{color:'black', fontSize: 16}}
                        title={this.secondItemTitle()}
                        onPress={() => {this.export()}}
                    />
                    <SettingsList.Header headerStyle={{marginTop:-5}}/>
                </SettingsList>
            </View>
        );
    }

    firstItemTitle() {
        return (offlineMode) ? 'Écraser les modifications par les données du téléphone' : 'Envoyer les programmes du téléphone au four'
    }

    secondItemTitle() {
        return (offlineMode) ? 'Sauvegarder les modifications sur le téléphone' : 'Sauvegarder les programmes du four sur le téléphone'
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
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column',
    },
    imageStyle:{
        marginLeft:15,
        marginRight:20,
        alignSelf:'center',
        width:20,
        height:24,
        justifyContent:'center'
    }
});

const mapStateToProps = (state) => {
    return {
        programs: state.programs
    };
};
export default connect(mapStateToProps)(SettingsScreen);