# Developer's manual

## Overall architecture

## API

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

## Raspberry Pi server



### Development environment

Raspberry Pi server development can be done both on a Raspberry Pi 3 or a standard computer with a Linux distribution, although keep in mind that the architecture is different. Raspberry Pi 3 is ARMv7-A (armhf on Debian), a PC is x86_64 (amd64 on Debian, note that i686 is not supported).

Raspberry Pi development requires `nodejs >= 8` and `npm` locally. Make sure you use a recent `npm` version or else modules may fail installing.

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

### Code style

### Code architecture
