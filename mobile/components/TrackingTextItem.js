import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class TrackingTextItem extends React.Component {
    render() {
        return (
            <View style={styles.main_container}>
                <Text style={styles.title}>{this.props.text}</Text>
                <Text style={styles.description}>{this.props.subText}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 32
    },
    description: {
        fontSize: 12
    }
});