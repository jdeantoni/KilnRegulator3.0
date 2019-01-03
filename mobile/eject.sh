#!/bin/sh
npm install

expo eject --non-interactive --eject-method plain

npm install
npm install --save react-native-svg
react-native link
