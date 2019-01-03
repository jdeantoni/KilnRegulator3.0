import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {isoDateToUser} from "../helpers/UnitsHelper";
import colors from "../styles/colors";

export default class HistoryItem extends React.Component {
    render() {
        this.history = this.props.history;

        return (
            <TouchableOpacity style={styles.main_container} onPress={() => this.onItemPressed()}>
                <Text style={styles.title_text}>{this.history.programName}</Text>
                <Text style={styles.sub_text}>Enregistrée le {isoDateToUser(this.history.startDate)}</Text>
            </TouchableOpacity>
        );
    }

    onItemPressed() {
        this.props.navigation.navigate("History", {
            history: this.history
        });
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        height: 60,
        flexDirection: 'column',
        padding: 10,
        backgroundColor: colors.LIGHT_GREY,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    },
    title_text: {
        fontWeight: 'bold',
    },
    sub_text: {
        fontStyle: 'italic',
        color: '#666666',
    }
});
