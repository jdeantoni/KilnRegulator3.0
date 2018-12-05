# KilnRegulator Server on RaspberryPi

Arduino code will be automatically built and deployed on the Arduino when running through `docker-compose`.

## Dependencies (to be installed on the Raspberry or the development environment accordingly)
This README considers that the Raspbian OS is already installed on the Raspberry (see https://www.raspberrypi.org/downloads/raspbian/). 

```
docker
docker-compose
```

## Prepare
The arduino is connected through usb serial to the raspberry and the rasberry connected to the development computer (e.g., by using ethernet). Then, in the later, you can either connect to the raspberry through ssh or directly launch commands on the raspberry. But First, on the raspberry

Edit `raspberrypi/conf/udev/rules.d/arduino.rules` replacing the `idVendor` and `idProduct` by those of your Arduino device (that can be found in dmesg for instance).

```
sudo cp raspberrypi/conf/udev/rules.d/arduino.rules /etc/udev/rules.d
```

## Build
From the root of the project,

```
docker-compose build
```

Or on Raspberry Pi:
```
docker-compose -f docker-compose-rpi.yml build
```

## Run

Arduino container is started before the server for it to deploy the code first then free the serial port for the server.

From the root of the project,

```
docker-compose up arduino && docker-compose up mongo server
```

Or on Raspberry Pi:
```
docker-compose -f docker-compose-rpi.yml up arduino && docker-compose -f docker-compose-rpi.yml up mongo server
```


## Notes

API can be viewed and tried at http://localhost:3000/docs

Bug with Linux 4.19 and Docker 18.09
https://github.com/docker/for-linux/issues/480
