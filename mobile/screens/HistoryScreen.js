import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import colors from "../styles/colors";
import {displayArrow} from "../helpers/NavigationHelper";
import TrackingLineChart from "../components/TrackingLineChart";
import {CookingsAPI, ProgramsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {isoDateToUser} from "../helpers/UnitsHelper";
import {segmentsToChart} from "../helpers/ChartHelper";

export default class HistoryScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Historique',
        headerLeft: displayArrow(navigation, "Histories"),
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    constructor(props) {
        super(props);

        this.history = this.props.navigation.state.params.history;

        this.state = {
            theoreticData: [],
            realData: []
        };

        (new ProgramsAPI(NetworkRoute.getInstance().getAddress()))
            .getProgram(this.history.programId)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                // console.log('response get Program: '+JSON.stringify(response))
                this.setState({theoreticData: segmentsToChart(response.segments)});
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée : "+error);
            });

        (new CookingsAPI(NetworkRoute.getInstance().getAddress()))
            .getCooking(this.history.uuid)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                // console.log("realdata: "+JSON.stringify(response))
                this.setState({realData: response.samples});
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée2: "+error);
            });
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.text_container}>
                    <Text style={styles.title_text}>Historique du programme {this.history.programName}</Text>
                    <Text style={styles.sub_text}>Lancé le {isoDateToUser(this.history.startDate)}</Text>
                </View>

                <TrackingLineChart
                    theoreticData={this.state.theoreticData}
                    realData={this.state.realData}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column',
        backgroundColor: colors.LIGHT_GREY
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 16
    },
    sub_text: {
        fontStyle: 'italic',
        color: '#666666',
        fontSize: 14
    },
    text_container: {
        padding: 15
    }
});
