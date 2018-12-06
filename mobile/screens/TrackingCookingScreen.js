import React from 'react';
import {View, Text, StyleSheet, Button, Alert, BackHandler, Image} from 'react-native';
import { displayArrow } from "../helpers/NavigationHelper";
import {ActionAPI, ProgramsAPI, StatusAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {NavigationEvents} from "react-navigation";
import TrackingLineChart from "../components/TrackingLineChart";
import connect from "react-redux/es/connect/connect";
import segmentsToChart from "../helpers/ChartHelper";
import {estimateTimeInSecondsForAllSegments, secondsToUser} from "../helpers/UnitsHelper";
import {COOLING, HEATING, STALE, TEMP_ORIGIN, TIME_ORIGIN, UPDATE_PROGRAMS} from "../helpers/Constants";
import TrackingImageItem from "../components/TrackingImageItem";
import images from "../helpers/ImageLoader";
import TrackingTextItem from "../components/TrackingTextItem";

class TrackingCookingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Suivi de cuisson',
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
            theoreticData: null,
            elementState: STALE
        };
    }

    render() {
        if (!this.currentProgram) {
            return (
                <View style={styles.loading}>
                    <NavigationEvents
                        onWillFocus={() => this.onWillFocus()}
                        onWillBlur={() => this.onWillBlur()}
                    />
                    <Image
                        source={images.loading}
                        style={{width: 50, height: 50}}/>
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
                        theoreticData={this.state.theoreticData}
                        realData={this.state.realData}/>
                </View>
                <View style={styles.program_name}>
                    <Text style={{fontSize: 14}}>Programme en cours :
                        <Text style={{fontWeight: "bold", fontSize: 14}}> {this.currentProgram.name}</Text>
                    </Text>
                </View>
                <View style={styles.major_data_container}>
                    <TrackingImageItem text={currentTemperature + "°C"} img={this.thermometerImage()} subText={"Température actuelle"}/>
                    <View style={styles.divider}/>
                    <TrackingImageItem text={remainingTime} img={images.time} subText={"Temps restant"}/>
                </View>
                <View style={styles.minor_data_container}>
                    <TrackingTextItem text={expectedTemperature + "°C"} subText={"Température prévue"}/>
                    <View style={styles.divider}/>
                    <TrackingTextItem text={elapsedTime} subText={"Temps écoulé"}/>
                    <View style={styles.divider}/>
                    <TrackingTextItem text={expectedTimeRemaining} subText={"Prochain segment"}/>
                </View>
                <View>
                    <Button title={"Arrêt"} onPress={() => this.stopCooking()}/>
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
                this.setState({
                    temperature: response.sample.temperature,
                    elementState: response.elementState,
                    realData: (this.state.realData === []) ?
                        [{temperature: response.sample.temperature, timestamp: response.sample.timestamp}] :
                        this.state.realData.concat({temperature: response.sample.temperature, timestamp: response.sample.timestamp})
                })
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
                    theoreticData: segmentsToChart(this.currentProgram.segments),
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
            theoreticData: segmentsToChart(this.currentProgram.segments),
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
        const {lastPoint, nextPoint} = this.findPointsOfSegments(elapsedTime);

        return {
            currentTemperature: Math.round(this.state.temperature),
            remainingTime: secondsToUser(this.estimatedTime - elapsedTime),
            elapsedTime: secondsToUser(elapsedTime),
            expectedTemperature: this.computeTemperatureFromSegmentAndTime(lastPoint, nextPoint, elapsedTime),
            expectedTimeRemaining: secondsToUser(nextPoint.time - elapsedTime)
        };
    }

    computeElapsedTime() {
        return (new Date() - this.startDate) / 1000;
    }

    findPointsOfSegments(elapsedTime) {
        let timeInSeconds = 0;
        let lastPoint;
        let nextPoint = {time: TIME_ORIGIN, temp: TEMP_ORIGIN};
        for (let i in this.state.theoreticData) {
            timeInSeconds += this.state.theoreticData[i].time;
            lastPoint = nextPoint;
            nextPoint = this.state.theoreticData[i];
            if (timeInSeconds > elapsedTime) {
                break;
            }
        }
        return {lastPoint: lastPoint, nextPoint: nextPoint};
    }

    computeTemperatureFromSegmentAndTime(lastPoint, nextPoint, elapsedTime) {
        const a = (nextPoint.temperature - lastPoint.temperature) / (nextPoint.time - lastPoint.time);
        const b = lastPoint.temperature - a * lastPoint.time;

        return Math.round(a * elapsedTime + b);
    }

    thermometerImage() {
        switch (this.state.elementState) {
            case COOLING:
                return images.cooling;
            case HEATING:
                return images.heating;
            default:
                return images.stale;
        }
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
        flex: 11,
    },
    major_data_container: {
        flex: 5,
        flexDirection: 'row',
        backgroundColor: "lightblue",
    },
    minor_data_container: {
        flex: 4,
        flexDirection: 'row',
        backgroundColor: "lightgrey"
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    program_name: {
        backgroundColor: 'pink',
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 3
    },
    divider: {
        borderLeftColor: 'black',
        borderLeftWidth: 2,
        marginVertical: 15
    }
});

const mapStateToProps = (state) => {
    return {
        programs: state.programs
    };
};
export default connect(mapStateToProps)(TrackingCookingScreen);
