import React from 'react';
import {View, StyleSheet, Text, FlatList, Alert} from 'react-native';
import {displayArrow, offlineMode} from "../helpers/NavigationHelper";
import colors from "../styles/colors";
import {NavigationEvents} from "react-navigation";
import ColorPalette from 'react-native-color-palette';
import {AsyncStorage} from 'react-native';


export default class ParametersScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Historique des cuissons',
        headerLeft: displayArrow(navigation, "Settings"),
        headerTintColor: "white",
        headerStyle: { backgroundColor: colors.PRIMARY_COLOR }
    });

    constructor(props) {
        super(props);

        this.state = {
            
        };

        // if (!offlineMode) {
        //     this.cookingsAPI = new CookingsAPI(NetworkRoute.getInstance().getAddress());
        // }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <NavigationEvents
                    onWillFocus={() => this.onWillFocus()}
                />
                {this.displayColors()}
            </View>
        );
    }

    displayColors() {
            return (
                <View style={styles.parameters}>
                    <ColorPalette
                    onChange={color => {
                        colors.PRIMARY_COLOR = color;
                        this.storeData('@colors.PRIMARY_COLOR', color)
                        if (color === "#C0392B"){
                            colors.PRIMARY_DARK_COLOR = '#B0291B'
                            this.storeData('@colors.PRIMARY_DARK_COLOR', colors.PRIMARY_DARK_COLOR)
                            colors.PRIMARY_LIGHT_COLOR = '#D0493B'
                            this.storeData('@colors.PRIMARY_LIGHT_COLOR', colors.PRIMARY_LIGHT_COLOR)
                            colors.SECONDARY_LIGHT_COLOR = '#ffbb93'
                            this.storeData('@colors.SECONDARY_LIGHT_COLOR', colors.SECONDARY_LIGHT_COLOR)
                        }
                        if (color === "#419e39"){
                            colors.PRIMARY_DARK_COLOR = '#318e29'
                            this.storeData('@colors.PRIMARY_DARK_COLOR', colors.PRIMARY_DARK_COLOR)
                            colors.PRIMARY_LIGHT_COLOR = '#51Ae49'
                            this.storeData('@colors.PRIMARY_LIGHT_COLOR', colors.PRIMARY_LIGHT_COLOR)
                            colors.SECONDARY_LIGHT_COLOR = '#deffdb'
                            this.storeData('@colors.SECONDARY_LIGHT_COLOR', colors.SECONDARY_LIGHT_COLOR)
                        }
                        if (color === "#d18202"){
                            colors.PRIMARY_DARK_COLOR = '#d18202'
                            this.storeData('@colors.PRIMARY_DARK_COLOR', colors.PRIMARY_DARK_COLOR)
                            colors.PRIMARY_LIGHT_COLOR = '#f1A222'
                            this.storeData('@colors.PRIMARY_LIGHT_COLOR', colors.PRIMARY_LIGHT_COLOR)
                        }
                        if (color === "#8E44AD"){
                            colors.PRIMARY_DARK_COLOR = '#7E349D'
                            this.storeData('@colors.PRIMARY_DARK_COLOR', colors.PRIMARY_DARK_COLOR)
                            colors.PRIMARY_LIGHT_COLOR = '#9E54BD'
                            this.storeData('@colors.PRIMARY_LIGHT_COLOR', colors.PRIMARY_LIGHT_COLOR)
                        }
                        if (color === "#2980B9"){
                            colors.PRIMARY_DARK_COLOR = '#1970A9'
                            this.storeData('@colors.PRIMARY_DARK_COLOR', colors.PRIMARY_DARK_COLOR)
                            colors.PRIMARY_LIGHT_COLOR = '#3990C9'
                            this.storeData('@colors.PRIMARY_LIGHT_COLOR', colors.PRIMARY_LIGHT_COLOR)
                        }
                    }}
                    value={colors.PRIMARY_COLOR}
                    colors={['#C0392B', '#419e39', '#d18202', '#8E44AD', '#2980B9']}
                    title={"couleur principale"}
                    />

                   
                    
              
                </View>
               
            );
       
    }
    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            // Error saving data
        }
    }

    onWillFocus() {
        
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
    parameters: {
        flex: 1,
        justifyContent: 'center',
        padding: 15
    },
    parameters_text: {
        fontStyle: 'italic',
        color: '#666666'
    }
});
