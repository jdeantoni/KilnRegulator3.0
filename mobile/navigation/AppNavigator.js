import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import ChooseProgramScreen from "../screens/ChooseProgramScreen";
import FindKilnScreen from "../screens/FindKilnScreen";
import TrackingCookingScreen from "../screens/TrackingCookingScreen";
import EditProgramScreen from "../screens/EditProgramScreen";
import ErrorsScreen from "../screens/ErrorsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const MainStack = createStackNavigator({
    FindKiln: FindKilnScreen,
    ChooseProgram: ChooseProgramScreen,
    TrackingCooking: TrackingCookingScreen,
    EditProgram: EditProgramScreen,
    Errors: ErrorsScreen,
    Settings: SettingsScreen
});

const AppContainer = createAppContainer(MainStack);

export default AppContainer;
