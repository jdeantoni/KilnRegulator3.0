# KilnRegulator Client in React Native

## Dependencies

Install Expo, React Native and the project dependencies:

```
npm install expo-cli --global
npm install
```

## Run

Launch the project on your terminal with Expo:

```
expo start
```

For the next steps, follow the instructions on your terminal and your browser at http://localhost:19002/.
If you want to use your own phone to test the app, download the [Expo app](https://expo.io) on your phone and scan the QR code from Expo.
Open it in the [Expo app](https://expo.io) on your phone to view it.

## Notes

In case of errors:
- If there is a connection error, please go to the webpage opened when you launched `expo start`, choose the *tunnel* mode and open it again in the expo app.
- For the emulation, check if `adb` is updated. If you have more than one installations of ADB, check the versions.
If you are using Genymotion, localize the Android SDK in the settings.
- Check if the ip address is correct. You may have to modify it each time you change your network.
With PowerShell:
```
$env:REACT_NATIVE_PACKAGER_HOSTNAME = “<IP>”
```
- If the terminal displays some errors, don't hesitate to reload Expo.
- If the QR code doesn't appear, reload Expo.
- If the bundle can't be constructed, add a dummy line in the code, the build may start.
- Check there is an unique instance of the app on your phone.

## Deploy

### Prepare

#### Eject

```
./eject.sh
```

#### Generate signing key

```
keytool -genkey -v -keystore android/app/my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### Add signing configuration

```
patch -p1 -i android-sign.patch
```

### Build & deploy

#### Generate signed apk

```
./android/gradlew -p android assembleRelease
```

#### Install signed apk

```
adb install ./android/app/build/outputs/apk/release/app-release.apk
```
