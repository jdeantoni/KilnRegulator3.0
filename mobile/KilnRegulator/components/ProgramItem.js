import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export default class ProgramItem extends React.Component {
    render() {
        const program = this.props.program.item;
        return (
            <TouchableOpacity style={styles.main_container} onPress={() => {}}>
                <View style={styles.left_container}>
                    <Text style={styles.textId} adjustsFontSizeToFit>{program.id}</Text>
                </View>
                <View style={styles.content_container}>
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>{program.name}</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>{program.segments.length} segments</Text>
                        <Text style={styles.description_text}>{this.computeTime(program.segments)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    computeTime(segments) {
        let timeInSeconds = 0;
        segments.forEach((segment) => {
            if (segment.hasOwnProperty("duration")) {
                timeInSeconds += segment["duration"];
            } else if (segment.hasOwnProperty("target") && segment.hasOwnProperty("slope")) {
                timeInSeconds += segment["target"] / segment["slope"];
            }
        });

        const hours = Math.floor(timeInSeconds / 3600);
        let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
        if (minutes < 10) { minutes = "0" + minutes };

        return hours + "h" + minutes + "min";
    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 80,
        flexDirection: 'row',
    },
    left_container: {
        flex: 1,
        resizeMode: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textId: {
        fontSize: 40
    },
    content_container: {
        flex: 3,
        margin: 5
    },
    header_container: {
        flex: 2,
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 20,
        flexWrap: 'wrap',
        paddingRight: 5
    },
    description_container: {
        flex: 3,
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        flex: 1
    }
});