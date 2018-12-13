# KilnRegulator Client in React Native

## Dependencies

Install Expo, React Native and the project dependencies:

```
sudo npm install expo-cli --global
sudo npm install react-native-cli --global
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

Make sure the `ANDROID_HOME` environment variable is set to the Android SDK path, eg. `~/Android/Sdk`:
```
export ANDROID_HOME="$HOME/Android/Sdk"
```

#### Eject

```
./eject.sh
```

#### Generate signing key

```
keytool -genkey -v -keystore android/app/my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass "password" -keypass "password" -dname "CN=Unknown, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown"
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

## Screen navigation

### Home Page

When the app is launched, the home page display two buttons:
* You can connect your device to your kiln using the server IP address (don't forget the port).
* If you're not next to your kiln, there is an off line mode.

### Program choice

You can modify and create programs from this page. Select a program in the list, then, you have four options:
* Edit the program
* Duplicate the program
* Delete the program
* Launch the program

### Program edition

Edit the program in this page. You can edit the segments in the table and see results in the graph.
See in precision the temperature evolution with a cursor on the graph.

### Settings

Import and export kiln and phone programs.

### Tracking cooking

See the temperature evolution of the cooking. In brown, you can see the theoretical points, and in green the real ones.
When you connect your device with a kiln already heating, you will see first this screen.
When the kiln is stopped, you will see the last data from the cooking and the button will reinitialize the kiln state.
If an error appear, the icon in the header bar will change and you can access to the errors list.
