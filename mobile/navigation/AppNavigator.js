import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import ChooseProgramScreen from "../screens/ChooseProgramScreen";
import FindKilnScreen from "../screens/FindKilnScreen";
import TrackingCookingScreen from "../screens/TrackingCookingScreen";
import EditProgramScreen from "../screens/EditProgramScreen";
import ErrorsScreen from "../screens/ErrorsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HistoriesScreen from "../screens/HistoriesScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ParametersScreen from "../screens/ParametersScreen";



const MainStack = createStackNavigator({
    FindKiln: FindKilnScreen,
    ChooseProgram: ChooseProgramScreen,
    TrackingCooking: TrackingCookingScreen,
    EditProgram: EditProgramScreen,
    Errors: ErrorsScreen,
    Settings: SettingsScreen,
    Histories: HistoriesScreen,
    History: HistoryScreen,
    Parameters:ParametersScreen
});

const AppContainer = createAppContainer(MainStack);

export default AppContainer;
