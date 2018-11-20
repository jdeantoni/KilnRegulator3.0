import {Platform, Image, TouchableOpacity} from "react-native";
import Images from "./ImageLoader";
import React from "react";

export default function displayHamburger(navigation) {
    if (Platform.OS === 'android') {
        return (
            <TouchableOpacity style={{paddingLeft: 16}} onPress={() => navigation.openDrawer()}>
                <Image source={Images.hamburger} style={{height: 24, width: 24}}/>
            </TouchableOpacity>
        );
    }
}