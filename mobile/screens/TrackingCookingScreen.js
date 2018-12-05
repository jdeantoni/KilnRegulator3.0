import React from 'react';
import {View, Text, StyleSheet, Button, Alert, BackHandler} from 'react-native';
import { displayArrow } from "../helpers/NavigationHelper";
import {ActionAPI, ProgramsAPI, StatusAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {NavigationEvents} from "react-navigation";
import TrackingLineChart from "../components/TrackingLineChart";
import connect from "react-redux/es/connect/connect";
import segmentsToChart from "../helpers/ChartHelper";
import {
    estimateTimeInSecondsForAllSegments,
    estimateTimeInSecondsForSegment,
    secondsToUser
} from "../helpers/UnitsHelper";
import {UPDATE_PROGRAMS} from "../helpers/Constants";

class TrackingCookingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'TrackingCookingScreen',
        headerLeft: displayArrow(navigation, "Êtes-vous sûr de vouloir vous déconnecter du four ?", "FindKiln"),
    });

    constructor(props) {
        super(props);

        this.statusApi = new StatusAPI(NetworkRoute.getInstance().getAddress());
        this.actionApi = new ActionAPI(NetworkRoute.getInstance().getAddress());

        if (Object.keys(this.props.programs).length === 0 && this.props.programs.constructor === Object) {
            this.getPrograms(new ProgramsAPI(NetworkRoute.getInstance().getAddress()));
        }

        this.state = {
            temperature: 0.0,
            realData: [],
            theoreticData: null
        };
    }

    render() {
        if (!this.currentProgram) {
            return (
                <View style={styles.main_container}>
                    <NavigationEvents
                        onWillFocus={() => this.onWillFocus()}
                        onWillBlur={() => this.onWillBlur()}
                    />
                    <Text>Chargement...</Text>
                </View>
            );
        }
        const {currentTemperature, remainingTime, elapsedTime, expectedTemperature, expectedTimeRemaining} = this.infoToDisplay();

        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <View style={styles.chart_container}>
                    <TrackingLineChart
                        theoreticData={segmentsToChart(this.state.theoreticData)}
                        realData={this.state.realData}/>
                </View>
                <View style={styles.major_data_container}>
                    <Text>Température actuelle : {currentTemperature}°C</Text>
                    <Text>Temps restant estimé : {remainingTime}</Text>
                    <Text>Programme en cours : {this.currentProgram.name}</Text>
                </View>
                <View style={styles.minor_data_container}>
                    <Text>Temps écoulé : {elapsedTime}</Text>
                    <Text>Température prévue : {expectedTemperature}°C</Text>
                    <Text>Prochain segment : {expectedTimeRemaining}</Text>
                    <Button title={"Stop"} onPress={() => this.stopCooking()}/>
                </View>
            </View>
        );
    }

    onWillFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        if (this.props.navigation.state.params !== undefined) {
            this.getCurrentCookingFromProps();
        } else if (this.currentProgram !== null) {
            this.getCurrentCooking();
        }
        this.getTemperature();

        this.interval = setInterval(() => this.getTemperature(), 5000);
    }

    onWillBlur() {
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
            .then((response) => {
                if (response.state === "stopped") {
                    this.setState({
                        temperature: response.sample.temperature
                    })
                } else {
                    this.setState({
                        temperature: response.sample.temperature,
                        realData: (this.state.realData === []) ?
                            [{temperature: response.sample.temperature, timestamp: response.sample.timestamp}] :
                            this.state.realData.concat({temperature: response.sample.temperature, timestamp: response.sample.timestamp})
                    })
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Connexion réseau échouée")
            });
    }

    getCurrentCooking() {
        this.statusApi.getCurrentCooking()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                this.startDate = new Date(response.startDate);
                this.currentProgram = this.findProgram(response.programId);
                this.estimatedTime = estimateTimeInSecondsForAllSegments(this.currentProgram.segments);

                this.setState({
                    theoreticData: this.currentProgram.segments,
                    realData: response.samples
                });
            })
            .catch((error) => {
                console.log(error);
                alert("Connexion réseau échouée")
            });
    }

    getCurrentCookingFromProps() {
        this.startDate = new Date();
        this.currentProgram = this.props.programs[this.props.navigation.state.params.program];
        this.estimatedTime = estimateTimeInSecondsForAllSegments(this.currentProgram.segments);

        this.setState({
            theoreticData: this.currentProgram.segments,
            realData: (!Array.isArray(this.state.realData) || this.state.realData === []) ? [] : [...this.state.realData]
        });
    }

    stopCooking() {
        Alert.alert("Arrêt de la cuisson", "Êtes-vous sûr de vouloir arrêter le processus de cuisson ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () =>
                        this.actionApi.stopCooking()
                            .then((response) => {
                                if (response.ok) {
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

    findProgram(programId) {
        for (const i in this.props.programs) {
            if (this.props.programs[i].uuid === programId) {
                return this.props.programs[i];
            }
        }
    }

    handleBackPress = () => {
        Alert.alert("Retour", "Êtes-vous sûr de vouloir vous déconnecter du four ?",
            [
                {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                {text: 'Oui', onPress: () => this.props.navigation.navigate("FindKiln")},
            ]);
        return true;
    };

    getPrograms(programsAPI) {
        programsAPI.getPrograms()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                const action = { type: UPDATE_PROGRAMS, value: response };
                this.props.dispatch(action);
            })
            .catch((error) => {
                console.log(error);
                alert("Connexion réseau échouée")
            });
    }

    infoToDisplay() {
        const elapsedTime = this.computeElapsedTime();
        const nextTheoreticPoint = this.findNextTheoreticPoint(elapsedTime);

        return {
            currentTemperature: Math.round(this.state.temperature),
            remainingTime: secondsToUser(this.estimatedTime - elapsedTime),
            elapsedTime: secondsToUser(elapsedTime),
            expectedTemperature: nextTheoreticPoint.targetTemperature,
            expectedTimeRemaining: secondsToUser(nextTheoreticPoint.duration - elapsedTime)
        };

    }

    computeElapsedTime() {
        return (new Date() - this.startDate) / 1000;
    }

    findNextTheoreticPoint(elapsedTime) {
        let timeInSeconds = 0;
        let i;
        for (i in this.currentProgram.segments) {
            timeInSeconds += estimateTimeInSecondsForSegment(this.currentProgram.segments, parseInt(i));
            if (timeInSeconds > elapsedTime) {
                break;
            }
        }
        return this.currentProgram.segments[parseInt(i)];
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column'
    },
    container: {
        padding: 10,
    },
    chart_container: {
        flex: 5,
    },
    major_data_container: {
        flex: 3,
        backgroundColor: "lightblue"
    },
    minor_data_container: {
        flex: 2,
        backgroundColor: "lightgrey"
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
});

const mapStateToProps = (state) => {
    return {
        programs: state.programs
    };
};
export default connect(mapStateToProps)(TrackingCookingScreen);
