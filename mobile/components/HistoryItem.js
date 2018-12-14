import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {isoDateToUser} from "../helpers/UnitsHelper";
import colors from "../styles/colors";

export default class HistoryItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.history = this.props.history;

        return (
            <View style={styles.main_container}>
                <Text style={styles.title_text}>{this.history.programId}</Text>
                <Text style={styles.sub_text}>{isoDateToUser(this.history.startDate)}</Text>
                <Text style={styles.sub_text}>{this.history.uuid}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        height: 80,
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
