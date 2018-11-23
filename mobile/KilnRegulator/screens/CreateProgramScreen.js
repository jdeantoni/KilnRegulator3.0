import React from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import Table from "../components/Table";

export default class CreateProgramScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'CreateProgramScreen',
        //headerLeft: displayHamburger(navigation),
    });

    constructor(props) {
        super(props);
        this.state = {
            programName: ""
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.graph}>
                    <Text>Graph</Text>
                </View>
                <View style={styles.table}>
                    <Table/>
                </View>
                <View style={styles.bottom}>
                    <TextInput placeholder={"Nom du programme"}
                               onChangeText={(text) => this.setState({programName: text})}
                               value={this.state.programName}/>
                    <Button title={"Créer le programme"} onPress={() => this.props.navigation.navigate("ChooseProgram")}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: "stretch",

        flexDirection: 'column',
    },
    button: {
        padding: 10,
    },
    graph: {
        flex: 4,
        backgroundColor: "skyblue"
    },
    table: {
        flex: 4,
    },
    bottom: {
    }
});