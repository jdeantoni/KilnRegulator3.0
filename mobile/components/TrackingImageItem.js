import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

export default class TrackingImageItem extends React.Component {
    render() {
        return (
            <View style={styles.main_container}>
                <Image style={styles.image} source={this.props.img}/>
                <View style={styles.text_container}>
                    <Text style={styles.title}>{this.props.text}</Text>
                    <Text style={styles.description}>{this.props.subText}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    title: {
        fontSize: 34,
        textAlign: 'center'
    },
    description: {
        fontSize: 12,
        textAlign: 'center'
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    text_container: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
