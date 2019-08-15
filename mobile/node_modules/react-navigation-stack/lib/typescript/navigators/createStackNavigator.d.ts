/// <reference types="react" />
import { NavigationStackOptions, NavigationProp, Screen } from '../types';
declare function createStackNavigator(routeConfigMap: {
    [key: string]: Screen | (({
        screen: Screen;
    } | {
        getScreen(): Screen;
    }) & {
        path?: string;
        navigationOptions?: NavigationStackOptions | ((options: {
            navigation: NavigationProp;
        }) => NavigationStackOptions);
    });
}, stackConfig?: NavigationStackOptions): import("react").ComponentType<{}>;
export default createStackNavigator;
