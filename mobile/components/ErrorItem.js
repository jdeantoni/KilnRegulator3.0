import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import images from "../helpers/ImageLoader";
import {completeIsoDateToUser} from "../helpers/UnitsHelper";

export default class ErrorItem extends React.Component {
    render() {
        const error = this.props.error;

        return (
            <View style={styles.main_container}>
                <View style={styles.left_container}>
                    <Image
                        style={styles.image}
                        source={this.warningImage(error)}/>
                </View>
                <View style={styles.content_container}>
                    <Text style={styles.error_text}>{error.message}</Text>
                    <Text style={styles.time_text}>Notifiée le {completeIsoDateToUser(error.timestamp)}</Text>
                </View>
            </View>
        )
    }

    warningImage(error) {
        switch (error['severity']) {
            case "warning":
                return images.warning;
            case "error":
                return images.error;
            case "FATAL":
                return images.fatal;
            case "PANIC":
                return images.panic;
        }
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        height: 80,
        flexDirection: 'row',
        margin: 5
    },
    left_container: {
        resizeMode: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 70,
        width: 70,
    },
    content_container: {
        flex: 1,
        margin: 5,
        justifyContent: 'center'
    },
    title_text: {
        fontWeight: 'bold',
    },
    sub_text: {
        fontStyle: 'italic',
        color: '#666666',
    }
});
