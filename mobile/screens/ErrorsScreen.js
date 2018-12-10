import React from 'react';
import {View, StyleSheet, Button, FlatList, Text, Alert} from 'react-native';
import {NavigationEvents} from "react-navigation";
import {ErrorsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import ErrorItem from "../components/ErrorItem";
import {displayArrow} from "../helpers/NavigationHelper";

export default class ErrorsScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Erreurs',
        headerLeft: displayArrow(navigation, "TrackingCooking"),
    });

    constructor(props) {
        super(props);

        this.state = {
            errors: []
        };

        this.errorsApi = new ErrorsAPI(NetworkRoute.getInstance().getAddress());
        this.getErrors();
    }

    render() {
        if (this.state.errors === [] || this.state.errors.length < 1) {
            return (
                <View style={styles.no_error}>
                    <NavigationEvents
                        onWillFocus={() => this.onWillFocus()}
                        onWillBlur={() => this.onWillBlur()}
                    />
                    <Text>Aucune erreur</Text>
                </View>
            );
        }
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <View style={styles.error_list}>
                    <FlatList
                        data={this.state.errors.reverse()}
                        keyExtractor={(item) => item.timestamp + item.message}
                        renderItem={({item}) => <ErrorItem error={item}/>}
                    />
                </View>
                <View style={styles.bottom_container}>
                    <Button title={"Effacer tout"} onPress={() => {this.eraseErrors()}}/>
                </View>
            </View>
        );
    }

    onWillFocus() {
        this.interval = setInterval(() => this.getErrors(), 30000);
    }

    onWillBlur() {
        clearInterval(this.interval);
    }

    getErrors() {
        this.errorsApi.getError()
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .then((response) => {
                this.setState({errors: response});
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée");
            });
    }

    eraseErrors() {
        this.errorsApi.clearError()
            .then((response) => {
                if (response.ok) {
                    this.setState({errors: []});
                }
                else throw new Error("HTTP response status not code 200 as expected.");
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Erreur", "Connexion réseau échouée");
            });
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column',
    },
    no_error: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    error_list: {
        flex: 1
    },
    bottom_container: {
        justifyContent: 'flex-end',
        padding: 10
    }
});
