import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";

class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'ChooseProgramScreen',
        headerLeft: displayHamburger(navigation),
    });

    render() {
        return (
            <View style={styles.container}>
                <Text>ChooseProgramScreen</Text>
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

export default ChooseProgramScreen;