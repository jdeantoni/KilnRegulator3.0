import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import displayHamburger from "../helpers/NavigationHelper";
import ProgramList from "../components/ProgramList";

class ChooseProgramScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'ChooseProgramScreen',
        headerLeft: displayHamburger(navigation),
    });

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <Text>ChooseProgramScreen</Text>
                </View>
                <View style={{flex: 6, backgroundColor: 'skyblue'}}>
                    <ProgramList/>
                </View>
                <View style={{flex: 2} && styles.buttons}>
                    <View style={styles.button}>
                        <Button title={"Créer une nouvelle cuisson"} onPress={() => {}}/>
                    </View>
                    <View style={styles.button}>
                        <Button title={"Lancer la cuisson"} onPress={() => {}}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "stretch",

        flexDirection: 'column',
    },
    buttons: {
        alignItems: "center",
    },
    button: {
        padding: 10,
    }
});

export default ChooseProgramScreen;