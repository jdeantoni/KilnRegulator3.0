import React from 'react';
import {View, Text, StyleSheet, Button, Alert, BackHandler, Image, TouchableOpacity} from 'react-native';
import { displayArrowWithMessage } from "../helpers/NavigationHelper";
import {ActionAPI, ProgramsAPI, StatusAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import {NavigationEvents} from "react-navigation";
import TrackingLineChart from "../components/TrackingLineChart";
import connect from "react-redux/es/connect/connect";
import {segmentsToChart,keepOnlyFullSegments} from "../helpers/ChartHelper";
import {estimateTimeInSecondsForAllSegments, secondsToUser} from "../helpers/UnitsHelper";
import {ADD_PROGRAM, DELETE_PROGRAM} from "../helpers/Constants";
import {COOLING, HEATING, STALE, TEMP_ORIGIN, TIME_ORIGIN, UPDATE_PROGRAMS} from "../helpers/Constants";
import TrackingImageItem from "../components/TrackingImageItem";
import images from "../helpers/ImageLoader";
import TrackingTextItem from "../components/TrackingTextItem";
import colors from "../styles/colors";
import {prettyPrintDuration} from "../helpers/UnitsHelper"


class TrackingCookingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Suivi de cuisson',
        headerLeft: displayArrowWithMessage(navigation, "Êtes-vous sûr de vouloir vous déconnecter du four ?", "FindKiln"),
        headerRight: (
            <TouchableOpacity style={{paddingRight: 16}} onPress={() => {navigation.navigate("Errors")}}>
                <Image source={(navigation.getParam("errored")) ? images.error_notif : images.bell}
                       style={{height: 28, width: 28}}/>
            </TouchableOpacity>),
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    constructor(props) {
        super(props);

        this.statusApi = new StatusAPI(NetworkRoute.getInstance().getAddress());
        this.actionApi = new ActionAPI(NetworkRoute.getInstance().getAddress());
        this.programApi = new ProgramsAPI(NetworkRoute.getInstance().getAddress());
        if (this.props.programs === undefined || this.props.programs.length === 0) {
            this.getPrograms(this.programApi);
        }

        this.state = {
            temperature: 0.0,
            realData: [],
            theoreticData: null,
            theoreticDataFull : null,
            elementState: STALE,
            isStopped: false,
            delayDate:this.props.startDate,
            isDelayed: false,
            currentSegment : 0,
            isInFullSeg : false
        };
    }

    render() {
        if(this.state.isDelayed){
            return (
                <View style={styles.main_container}>
                    <View style={styles.loading}>
                        <NavigationEvents
                            onWillFocus={() => this.onWillFocus()}
                            onWillBlur={() => this.onWillBlur()}
                        />
                        <Image source={images.wait} style={{width: 150, height: 150}}/>
                        <Text style = {styles.delay_text}>
                        {"\n"}
                    la cuisson est différée.{"\n"} 
                    Elle commencera dans {"\n"}
                    </Text>
                    <Text style = {styles.delay_time}>
                    {prettyPrintDuration(this.state.delayDate/60)}
                        </Text>
                    </View>
                    <View style={styles.button}>
                        <Button
                            title={this.state.isStopped ? "Retour aux programmes" : "Arrêt"}
                            onPress={() => this.stopButton()}
                            color={colors.PRIMARY_COLOR}/>
                    </View>
                </View>
            );     
        }

        if (!this.currentProgram) {
            return (
                <View style={styles.loading}>
                    <NavigationEvents
                        onWillFocus={() => this.onWillFocus()}
                        onWillBlur={() => this.onWillBlur()}
                    />
                    <Image source={images.loading} style={{width: 100, height: 100}}/>
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
                        theoreticDataFull = {this.state.theoreticDataFull}
                        realData={this.state.realData}/>
                </View>
                <View style={styles.program_name_container}>
                    <Text style={styles.program_name}>Programme en cours :
                        <Text style={styles.program_name && {fontWeight: "bold"}}> {this.currentProgram.name}</Text>
                    </Text>
                </View>
                <View style={styles.major_data_container}>
                    <View style={styles.data_container}>
                        <TrackingImageItem text={currentTemperature + "°C"} img={this.thermometerImage()} subText={"Température actuelle"}/>
                    </View>
                    <View style={styles.divider}/>
                    <View style={styles.data_container}>
                        {this.displayRemainingTime(remainingTime)}
                    </View>
                </View>
                <View style={styles.minor_data_container}>
                    <TrackingTextItem text={expectedTemperature + "°C"} subText={"Température prévue"}/>
                    <View style={styles.divider}/>
                    <TrackingTextItem text={elapsedTime} subText={"Temps écoulé"}/>
                    <View style={styles.divider}/>
                    <TrackingTextItem text={expectedTimeRemaining} subText={"Prochain segment"}/>
                </View>
                <View style={styles.button}>
                    <Button
                        title={this.state.isStopped ? "Retour aux programmes" : "Arrêt"}
                        onPress={() => this.stopButton()}
                        color={colors.PRIMARY_COLOR}/>
                </View>
            </View>
        );
    }

    increaseSegmentAccordingToRealData(){
        this.setState({isInFullSeg : true})
        if (this.state.realData == undefined || this.state.realData == null ){
            return
        }
        var lastTimeStamp = this.state.realData[this.state.realData.length-1].timestamp
        var theoreticEndTime = this.state.theoreticData[this.state.currentSegment+1].time
        // console.log("two times :)",lastTimeStamp," ",theoreticEndTime)
        if (theoreticEndTime < lastTimeStamp){
            const dif = lastTimeStamp - theoreticEndTime;
            let array = [...this.state.theoreticData]
            let arrayFull = [...this.state.theoreticDataFull]
            for(var i = this.state.currentSegment+1; i < array.length; i++) {
                array[i].time = array[i].time + dif
                this.currentProgram.segments[i-2].duration = this.currentProgram.segments[i-2].duration + (dif/3600)
                if (i < arrayFull.length){
                    arrayFull[i].time = arrayFull[i].time + dif
                }
            }

            this.setState({theoreticData: array, theoreticDataFull : arrayFull})
            if (! this.currentProgram.name.endsWith("_M")){
                this.currentProgram.name = this.currentProgram.name+'_M'
            }
            // this.programApi.editProgram(this.currentProgram.uuid, this.currentProgram)
            // .then((response) => {
            //     if (response.ok) {
            //         this.props.dispatch({ type: DELETE_PROGRAM, value: this.currentProgram.uuid });
            //         this.props.dispatch({ type: ADD_PROGRAM, value: this.currentProgram });
            //     }
            //     else throw new Error("HTTP response status not code 200 as expected.");
            // })
            // .catch((error) => {
            //     console.log(error);
            //     Alert.alert("Erreur", "Connexion réseau échouée");
            // });
        }
    }

    shrinkSegmentAccordingToRealData(){
        this.setState({isInFullSeg : false})
        if (this.state.realData == undefined || this.state.realData == null ){
            return
        }
        var lastTimeStamp = this.state.realData[this.state.realData.length-2].timestamp //-2 to get the last sample in full seg
        var theoreticEndTime = this.state.theoreticData[this.state.currentSegment].time //warning, no + one since we want previous seg
        // console.log("two times :-/",lastTimeStamp," ",theoreticEndTime)
        if (theoreticEndTime > lastTimeStamp){
            const dif = theoreticEndTime - lastTimeStamp;
            let array = [...this.state.theoreticData]
            let arrayFull = [...this.state.theoreticDataFull]
            console.log('modifies prog', this.currentProgram.segments, ' cs ', this.state.currentSegment)
            for(var i = this.state.currentSegment; i < array.length; i++) {
                array[i].time = array[i].time - dif
                this.currentProgram.segments[i-1].duration = this.currentProgram.segments[i-1].duration - (dif/3600) 
                if (i < arrayFull.length){
                    arrayFull[i].time = arrayFull[i].time - dif
                }
            }
            this.setState({theoreticData: array, theoreticDataFull : arrayFull})
            if (! this.currentProgram.name.endsWith("_M")){
                this.currentProgram.name = this.currentProgram.name+'_M'
            }
            // this.programApi.editProgram(this.currentProgram.uuid, this.currentProgram)
            // .then((response) => {
            //     if (response.ok) {
            //         this.props.dispatch({ type: DELETE_PROGRAM, value: this.currentProgram.uuid });
            //         this.props.dispatch({ type: ADD_PROGRAM, value: this.currentProgram });
            //     }
            //     else throw new Error("HTTP response status not code 200 as expected.");
            // })
            // .catch((error) => {
            //     console.log(error);
            //     Alert.alert("Erreur", "Connexion réseau échouée");
            // });
        }
    }

    displayRemainingTime(remainingTime) {
        return (this.state.isStopped) ?
            <View style={styles.terminated_container}><Text style={styles.terminated_text}>Programme terminé</Text></View> :
            <TrackingImageItem text={remainingTime} img={images.time} subText={"Temps restant"}/>
    }

    onWillFocus() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        this.statusApi.getStatus()
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else throw new Error("HTTP response status not code 200 as expected.");
        }).then((response) => {
            console.log("TrackingCookingScreen.js ==> response is "+JSON.stringify(response))
            if (response.state === "delayed"){
                this.setState({currentSegment: response.currentSegment, isDelayed: true, delayDate: response.delay});

            }else{
                this.setState({currentSegment: response.currentSegment, isDelayed: false});
            }
            console.log("current segment",this.state.currentSegment)

        })

        if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.hasOwnProperty("program")) {
            this.getCurrentCookingFromProps();
        } else if (this.currentProgram !== null) {
            this.getCurrentCooking();
        }
        this.getTemperature();

        this.interval = setInterval(() => this.getTemperature(), 15000);
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
                if (response.errored) {
                    this.props.navigation.setParams({errored: response.errored});
                }
                console.log("received state: ",response.state)
                if (response.state === "running" || response.state === "stopped") {
                    this.setState({
                        currentSegment: response.currentSegment,
                        temperature: response.sample.temperature,
                        elementState: response.elementState,
                        isStopped: (response.state === "stopped"),
                        realData: (this.state.realData === []) ?
                            [{temperature: response.sample.temperature, timestamp: response.sample.timestamp}] :
                            this.state.realData.concat({temperature: response.sample.temperature, timestamp: response.sample.timestamp})
                    });
                    // console.log("ici")
                    if (this.state.currentSegment != -1 && this.state.currentSegment != undefined
                        && this.state.theoreticData != null && this.state.theoreticData != undefined
                        && this.state.currentSegment+1 < this.state.theoreticData.length 
                        && this.state.theoreticData[this.state.currentSegment+1].isFull){
                        this.increaseSegmentAccordingToRealData();
                    }else{
                        if (this.state.isInFullSeg === true){ //just Moved From Full Seg
                            this.shrinkSegmentAccordingToRealData();
                        }
                    }
                } else {
                    this.setState({ temperature: response.sample.temperature });
                }
                if (response.state === "delayed"){
                    this.setState({isDelayed: true, delayDate: response.delay});
                }else{
                    this.setState({isDelayed: false});
                }
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée: "+error);
            });
    }

    getCurrentCooking() {
        this.statusApi.getCurrentCooking()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected. cooking not started yet");
            })
            .then((response) => {
                if (!this.state.isDelayed){
                    this.startDate = new Date(response.startDate);
                    this.currentProgram = this.findProgram(response.programId);
                    this.estimatedTime = estimateTimeInSecondsForAllSegments(this.currentProgram.segments);
                    var tData = segmentsToChart(this.currentProgram.segments)
                    //console.log("data in tracking 2", tData)
                    this.setState({
                        theoreticData: tData,
                        theoreticDataFull: keepOnlyFullSegments(tData),
                        realData: response.samples
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                // Alert.alert("Erreur", "Connexion réseau échouée");
            });
    }

    getCurrentCookingFromProps() {
        this.startDate = new Date();
        for (let i in this.props.programs) {
            if (this.props.programs[i].uuid === this.props.navigation.state.params.program) {
                this.currentProgram = this.props.programs[i];
                break;
            }
        }
        this.estimatedTime = estimateTimeInSecondsForAllSegments(this.currentProgram.segments);
        var tData = segmentsToChart(this.currentProgram.segments)
        // console.log("data in tracking", tData)
        this.setState({
            theoreticData: tData,
            theoreticDataFull: keepOnlyFullSegments(tData),
            realData: (!Array.isArray(this.state.realData) || this.state.realData === []) ? [] : [...this.state.realData]
        });
    }

    stopButton() {
        if (this.state.isStopped) {
            this.actionApi.resetCooking()
                .then((response) => {
                    if (response.ok) {
                        this.setState({
                            realData: [],
                            theoreticData: null,
                            theoreticData: null,
                            elementState: STALE,
                            isStopped: false
                        });
                        this.props.navigation.navigate("ChooseProgram")
                    }
                    else throw new Error("HTTP response status not code 200 as expected.");
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert("Erreur", "Connexion réseau échouée");
                });
        } else {
            Alert.alert("Arrêt de la cuisson", "Êtes-vous sûr de vouloir arrêter le processus de cuisson ?",
                [
                    {text: 'Annuler', onPress: () => {}, style: 'cancel'},
                    {text: 'Oui', onPress: () =>
                            this.actionApi.stopCooking()
                                .then((response) => {
                                    if (!response.ok) throw new Error("HTTP response status not code 200 as expected.");
                                })
                                .catch((error) => {
                                    console.log(error);
                                    Alert.alert("Erreur", "Connexion réseau échouée");
                                })
                    },
                ]);
        }
    }

    findProgram(programId) {
        for (let i in this.props.programs) {
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
                Alert.alert("Erreur", "Connexion réseau échouée");
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
        let lastPoint;
        let nextPoint = {time: TIME_ORIGIN, temp: TEMP_ORIGIN};
        for (let i in this.state.theoreticData) {
            lastPoint = nextPoint;
            nextPoint = this.state.theoreticData[i];
            if (this.state.theoreticData[i].time > elapsedTime) {
                break;
            }
        }
        return {lastPoint: lastPoint, nextPoint: nextPoint};
    }

    computeTemperatureFromSegmentAndTime(lastPoint, nextPoint, elapsedTime) {
        if (elapsedTime > nextPoint.time) {
            return nextPoint.temperature;
        }
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
        backgroundColor: colors.LIGHT_GREY
    },
    major_data_container: {
        flex: 5,
        flexDirection: 'row',
        backgroundColor: colors.SECONDARY_LIGHT_COLOR,
    },
    minor_data_container: {
        flex: 4,
        flexDirection: 'row',
        backgroundColor: colors.LIGHT_GREY
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    program_name_container: {
        backgroundColor: colors.PRIMARY_COLOR,
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 3
    },
    program_name: {
        color: "white",
        fontSize: 14
    },
    divider: {
        borderLeftColor: 'black',
        borderLeftWidth: 2,
        marginVertical: 15
    },
    data_container: {
        flex: 1
    },
    terminated_text: {
        textAlign: 'center',
        fontSize: 28
    },
    delay_time: {
        color: "red",
        textAlign: 'center',
        fontSize: 32
    },
    delay_text: {
        textAlign: 'center',
        fontSize: 20
    },
    terminated_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    button: {
        backgroundColor: colors.LIGHT_GREY,
        paddingHorizontal: 10,
        paddingBottom: 5
    }
});

const mapStateToProps = (state) => {
    return {
        programs: state.programs
    };
};
export default connect(mapStateToProps)(TrackingCookingScreen);
