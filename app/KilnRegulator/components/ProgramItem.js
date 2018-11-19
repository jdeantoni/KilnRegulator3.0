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
                        <Text style={styles.title_text}>Miaou</Text>
                    </View>
                    <View style={styles.description_container}>
                        <Text style={styles.description_text}>Nyan</Text>
                        <Text style={styles.description_text}>Myu</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
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