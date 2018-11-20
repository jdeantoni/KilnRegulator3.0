import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import {StatusAPI} from "../network/APIClient";

class TrackingCookingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'TrackingCookingScreen',
        headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.state = {
            temperature: 0.0
        };
        this.statusApi = new StatusAPI();
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.temperature}°C</Text>
                <Button onPress={() => {this.getTemperature()}} title={"Miaou"}/>
            </View>
        );
    }

    getTemperature() {
        this.statusApi.getStatus()
            .then((response) => response.json())
            .then((response) => this.setState({temperature: response.sample.temperature}))
            .catch((error) => console.error(error))
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "center"
    },
});

export default TrackingCookingScreen;