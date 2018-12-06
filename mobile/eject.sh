#!/bin/sh
npm install

expo eject --non-interactive --eject-method plain

npm install
react-native link
