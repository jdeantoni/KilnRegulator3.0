import React from 'react';
import {View, StyleSheet, Text, FlatList, Alert} from 'react-native';
import {displayArrow, offlineMode} from "../helpers/NavigationHelper";
import colors from "../styles/colors";
import {NavigationEvents} from "react-navigation";
import {CookingsAPI} from "../network/APIClient";
import NetworkRoute from "../network/NetworkRoute";
import HistoryItem from "../components/HistoryItem";

export default class HistoriesScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Historique des cuissons',
        headerLeft: displayArrow(navigation, "Settings"),
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    constructor(props) {
        super(props);

        this.state = {
            histories: []
        };

        if (!offlineMode) {
            this.cookingsAPI = new CookingsAPI(NetworkRoute.getInstance().getAddress());
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                />
                {this.displayList()}
            </View>
        );
    }

    displayList() {
        if (this.state.histories === undefined || this.state.histories == null || this.state.histories.length < 1) {
            return (
                <View style={styles.no_history}>
                    <Text style={styles.no_history_text}>Aucun historique</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={this.state.histories}
                    keyExtractor={(item) => {return item.uuid}}
                    renderItem={({item}) => <HistoryItem history={item} navigation={this.props.navigation}/>}
                />
            );
        }
    }

    onWillFocus() {
        if (!offlineMode) {
            this.cookingsAPI.getCookings()
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    else throw new Error("HTTP response status not code 200 as expected.");
                })
                .then((response) => {
                    this.setState({histories: response})
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert("Erreur", "Connexion réseau échouée");
                });
        }
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "stretch",
        flexDirection: 'column',
        backgroundColor: colors.LIGHT_GREY
    },
    no_history: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    no_history_text: {
        fontStyle: 'italic',
        color: '#666666'
    }
});
