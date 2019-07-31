# Prepare

Download and extract the Arduino IDE from
https://www.arduino.cc/en/Main/Software

Then set the environment variables according to the path of the extracted Arduino IDE (assuming it is in the current directory):
```
export ARDUINO_DIR="$(pwd)/arduino-1.8.7"
export PATH="${PATH}:${ARDUINO_DIR}"
```

Supported versions: 1.8.3 to 1.8.7 (included)

On ArchLinux, simply install the `arduino` package from the community repository.

# Build

```
git submodule update --init
make
```

# Deploy

```
make upload
```
