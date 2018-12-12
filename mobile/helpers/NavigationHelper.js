import {Image, TouchableOpacity, Alert} from "react-native";
import Images from "./ImageLoader";
import React from "react";

export function displayArrowWithMessage(navigation, message, target) {
    return (
        <TouchableOpacity style={{paddingLeft: 16}} onPress={() => alertForBackNavigation(navigation, message, target)}>
            <Image source={Images.arrow} style={{height: 24, width: 24}}/>
        </TouchableOpacity>
    );
}

function alertForBackNavigation(navigation, message, target) {
    Alert.alert("Retour", message,
        [
            {text: 'Annuler', onPress: () => {}, style: 'cancel'},
            {text: 'Oui', onPress: () => navigation.navigate(target)},
        ]);
}

export function displayArrow(navigation, target) {
    return (
        <TouchableOpacity style={{paddingLeft: 16}} onPress={() => navigation.navigate(target)}>
            <Image source={Images.arrow} style={{height: 24, width: 24}}/>
        </TouchableOpacity>
    );
}

export let offlineMode = false;

export function setOfflineMode(bool) {
    offlineMode = bool;
}
