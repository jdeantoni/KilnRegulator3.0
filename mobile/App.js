import React from 'react';
import AppNavigator from "./navigation/AppNavigator";
import {Provider} from "react-redux";
import Store from "./store/ConfigureStore"

export default class App extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                <AppNavigator/>
            </Provider>
        );
    }
}