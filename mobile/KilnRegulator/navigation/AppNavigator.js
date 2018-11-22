import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import ChooseProgramScreen from "../screens/ChooseProgramScreen";
import FindKilnScreen from "../screens/FindKilnScreen";
import TrackingCookingScreen from "../screens/TrackingCookingScreen";
import CreateProgramScreen from "../screens/CreateProgramScreen";

const MainStack = createStackNavigator({
    FindKiln: FindKilnScreen,
    ChooseProgram: ChooseProgramScreen,
    TrackingCooking: TrackingCookingScreen,
    CreateProgram: CreateProgramScreen
});

const AppContainer = createAppContainer(MainStack);

export default AppContainer;