import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";

class TrackingCookingScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'TrackingCookingScreen',
        headerLeft: displayHamburger(navigation),
    });

    render() {
        return (
            <View style={styles.container}>
                <Text>TrackingCookingScreen</Text>
            </View>
        );
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