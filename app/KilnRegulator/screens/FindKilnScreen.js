import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";

class FindKilnScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'FindKilnScreen',
        headerLeft: displayHamburger(navigation),
    });

    render() {
        return (
            <View style={styles.container}>
                <Text>FindKilnScreen</Text>
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

export default FindKilnScreen;