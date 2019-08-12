import React from 'react';
import AppNavigator from "./navigation/AppNavigator";
import {Provider} from "react-redux";
import Store from "./store/ConfigureStore"
import colors from './styles/colors';

export default class App extends React.Component {
    render() {
        _retrieveData = async () => {
            try {
              const valuePrim = await AsyncStorage.getItem('@colors.PRIMARY_COLOR');
              if (valuePrim !== null) {
                // We have data!!
                colors.PRIMARY_COLOR = valuePrim;
              }
              const valueSec = await AsyncStorage.getItem('@colors.PRIMARY_DARK_COLOR');
              if (valueSec !== null) {
                // We have data!!
                colors.PRIMARY_DARK_COLOR = valueSec;
              }
              const valueTer = await AsyncStorage.getItem('@colors.PRIMARY_LIGHT_COLOR');
              if (valueTer !== null) {
                // We have data!!
                colors.PRIMARY_LIGHT_COLOR = valueTer;
              }
              const value4 = await AsyncStorage.getItem('@colors.SECONDARY_LIGHT_COLOR');
              if (value4 !== null) {
                colors.SECONDARY_LIGHT_COLOR_LIGHT_COLOR = value4;
              }
            } catch (error) {
              // Error retrieving data
            }
          };
        return (
            <Provider store={Store}>
                <AppNavigator/>
            </Provider>
        );
    }
}