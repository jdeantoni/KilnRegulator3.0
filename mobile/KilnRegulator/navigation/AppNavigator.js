import React from 'react';
import {createDrawerNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import ChooseProgramScreen from "../screens/ChooseProgramScreen";
import FindKilnScreen from "../screens/FindKilnScreen";
import TrackingCookingScreen from "../screens/TrackingCookingScreen";

const HomeStack = createStackNavigator({
    Home: ChooseProgramScreen
});
const FindKilnStack = createStackNavigator({
    FindKiln: FindKilnScreen
});
const TrackingCookingStack = createStackNavigator({
   TrackingCooking: TrackingCookingScreen
});

const DrawerNavigator = createDrawerNavigator({
    HomeStack,
    FindKilnStack,
    TrackingCookingStack,
});

const AppContainer = createAppContainer(DrawerNavigator);

export default AppContainer;