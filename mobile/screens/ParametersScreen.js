import React from 'react';
import {View, StyleSheet, Text, FlatList, Alert} from 'react-native';
import {displayArrow, offlineMode} from "../helpers/NavigationHelper";
import colors from "../styles/colors";
import {NavigationEvents} from "react-navigation";
import NetworkRoute from "../network/NetworkRoute";
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
                    }}
                     value={colors.PRIMARY_COLOR}
                    colors={['#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9']}
                    title={"couleur principale"}
                    // icon={
                    //     <Icon name={'check-circle-o'} size={25} color={'black'} />
                    // // React-Native-Vector-Icons Example
                    // }
                    />

                    <ColorPalette
                    onChange={color => {
                        colors.PRIMARY_DARK_COLOR = color;
                        this.storeData('@colors.PRIMARY_DARK_COLOR', color)
                    }}
                     value={colors.PRIMARY_DARK_COLOR}
                    colors={['#C63F34', '#EF553F', '#A35FBF', '#964FB4', '#2F89BF']}
                    title={"couleur secondaire"}
                    // icon={
                    //     <Icon name={'check-circle-o'} size={25} color={'black'} />
                    // // React-Native-Vector-Icons Example
                    // }
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
