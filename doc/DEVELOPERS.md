# Developer's manual

## Overall architecture

![Croquis](https://raw.githubusercontent.com/jdeantoni/KilnRegulator3.0/master/doc/Overall_architecture.svg?sanitize=true)


### Communication protocol between Raspberry Pi Server and Arduino

Communication between the Raspberry Pi and Arduino is done through the virtual serial port exposed on top of the Arduino USB link.

Messages are serialized from JavaScript objects to Messagepack binary format.

Raspberry Pi Server sends command to the Arduino upon request coming from the client trough the REST API.

Commands sent to the Arduino are:
 * `["start", segmentCount]`: start the program transmitted through `segment` commands, switching from "ready" to "running" state
 * `["stop"]`: stop the current program before it has ended, forcing a switch from "running" to "stopped" state
 * `["reset"]`: reset to initial state, switching from "stopped" to "ready" state
 * `["segment", segmentNumber, targetTemperature, slope, duration]`: transmit a segment for the next program to run
 * `["timesync", timestamp]`: send current timestamp (in seconds) to synchronize Arduino's clock
 * `["setpoint", setpoint]`: manually set the target temperature

Arduino regularly sends status update:
```
{
	"command": "status",
	"s": kilnState,
	"eS": elementState,
	"cS": currentSegment,
	"t": temperature,
	"o": output,
	"sP": setPoint,
	"ts": timestamp
}
```
and timesync requests:
```
{
	"command": "timesync"
}
```

Message from the Raspberry Pi Server to the Arduino are always acknowledged by the Arduino. The Arduino compute a CRC8 of the received data and append it to the acknowledgment. Message contains a sequence ID that is sent back in the acknowledgment.

### Raspberry Pi Server REST API for Mobile client

REST API between the Raspberry Pi NodeJS server and the mobile React-Native app is defined using Swagger in the `doc/swagger.yaml` file.

After spinning up the Raspberry Pi NodeJS server (see below), the API documentation can be seen at <http://localhost:3000/docs>. API can be queried from inside the Swagger user interface, or by using the web browser or a command line utility such as `curl` for testing purposes.

The Raspberry Pi NodeJS server parses the Swagger file at runtime to handle routing.

The client libraries must be generated again from a Swagger editor or the command line Swagger generator after modifying the API description.

## Arduino

### Development environment

Arduino development requires installing the Arduino IDE locally. See `arduino/README.md`.
Although it may possibly be working on other platforms, the build system was used only on Linux so far.

#### Development

Please do not use the Arduino IDE itself but rather a standard text editor with EditorConfig support or an IDE with EditorConfig support as well.

#### Build & run

Connect the Arduino on a USB port and use the provided Makefile build system inside the `arduino` folder. Make sure the current user can write to the virtual serial port, check your distribution documentation if needed.

```
cd arduino
make upload
```

### Code style

Defined in `arduino/.editorconfig`
 * Single tab for indendation
 * LF line ending


### Code architecture

All the libraries are added as git submodules under the `src/` folder. Only the `src/kilnregulator/` subfolder actually contains original source code for the Arduino application.



## Raspberry Pi server



### Development environment

Raspberry Pi server development can be done both on a Raspberry Pi 3 or a standard computer with a Linux distribution, although keep in mind that the architecture is different. Raspberry Pi 3 is ARMv7-A (armhf on Debian), a PC is x86_64 (amd64 on Debian, note that i686 is not supported).

Raspberry Pi development requires `nodejs >= 8` and `npm` locally. Make sure you use a recent `npm` version or else modules may fail installing (repository server may throw 405 errors). You may encounter this issue with the latest `npm` package on Raspbian.

#### Development

Use the text editor or IDE of your choice, preferably with EditorConfig support or set the code style parameters manually.

#### Build & run

When running for the first time, start the MongoDB database inside Docker.
```
docker-compose up mongodb
```
Or on Raspberry Pi:
```
docker-compose -f docker-compose-rpi.yml up mongodb
```

Then connect the Arduino (deploy the Arduino code if needed, see above) and start the server:
```
cd raspberrypi
npm start
```

### Code style

Defined in the top-level `.editorconfig`
 * Two spaces for indendation
 * LF line ending

### Code architecture

#### `handlers/`

Request handlers, called by Swagger from the routes defined in the Swagger file. The name of the file must match the `operationId` of the route. A handler must always send something to the client, even an empty string if nothing needs to be sent. Most of the business logic is offloaded to modules inside `services/`

Please read Swagger documentation for details on the purpose of the handlers.

#### `services/`

Business logic for Arduino communication and database objects management.

 * `arduino.js`: encapsulate the Arduino serial port management
 * `arduinomessagepack.js`: manages the Arduino communication protocol: messagepack serialization/deserialization, output buffer, acknowledgments, timeout
 * `arduinokilnregulator.js`: operations on the Arduino as a KilnRegulator module such as handling a state update and stopping/starting a cooking
 * `arduinorepository.js`: Detects and maintain a list of available Arduino (as ArduinoKilnRegulator objects)
 * `cookingrepository.js`: some CRUD operations to manage cookings in database
 * `programrepository.js`: some CRUD operations to manage programs in database
 * `errorhandler.js`: error loggers with 4 severity levels, from warnings, recoverable errors to fatal errors and panic

#### `model/`

Database object models, state machine enums are also declared here, matching the enums declared in Arduino code. Objet models try to match the ones used for the REST API, declared in the Swagger file.

 * `kilnState.js`, `elementState.js`: state machine enums matching Arduino enums, not related to database
 * `db.js`: database connection handler
 * `model.js`: list of database object models
 * `cooking.js`, `program.js`: some object models to store cookings and programs in database

## Mobile app

### Development environment

#### Development

For React Native development, there is no specific IDE to work with, but you can use WebStorm, Visual Studio Code, Atom (with the plugin Nuclide) or your favorite JS text editor.
But you need to have installed on your computer: `npm`, `expo-cli` and `react-native-cli` (npm packages). For more information, see `mobile/README.md`.

#### Build & run

Connect your Android phone or your iPhone on the same network as your computer. Launch the Expo CLI. With the Expo app on your phone, scan the QR code on Expo CLI. Every modification in the code will reload the app on your phone.
```
cd mobile
expo start
```
When the app is opened, connect the mobile to the Raspberry Pi using its IP address (like: 123.1.1.1:3000). Don't forget the port.

### Code style

Defined in `.editorconfig` and modified in `mobile/.editorconfig`
 * Four spaces for indendation
 * LF line ending

### Code architecture

#### At root
 * `app.js`: program entry point (initialize the navigation tool and Redux).
 * `package.json`: list of dependencies.

#### `components/`
Contains all graphic components (table, charts, list items...). This components are reusable in several screens.

#### `screens/`
Represents project pages. Contains the main logic.

#### `navigation/`
Defines the stack navigation. All the screens must be declared here.

#### `helpers/`
Toolbox which contains useful functions. Mainly:
 * `ImageLoader.js`: Registers pictures and icons contained in the `assets/` directory.
 * `NavigationHelper.js`: Helps to edit the header bar.
 * `UnitsHelper.js`: Manages all units conversions (temperature, slope, time...).

#### `network/`
Used to call KilnRegulator3.0 API.
 * `APIClient.js`: Defines the differents client objects for each Swagger tag.
 * `NetworkRoutes`: Memorizes the server IP address.
 * `jsclient/`: Code generated by Swagger to call the API. Be careful, some lines from `ApiClient.js` has been deleted; you will have to do remove it at each code generation (lines 177 to 186 which require fs, not available with Expo).

#### `store/`
Redux files needed to save programs with segments in a global local state. Use actions defined in `helpers/Constants.js` to alter the programs.
