# KilnRegulator Server on RaspberryPi

Arduino code will be automatically built and deployed on the Arduino when running through `docker-compose`.

## Dependencies

```
docker
docker-compose
```

## Prepare

Edit `raspberrypi/conf/udev/rules.d/arduino.rules` replacing the `idVendor` and `idProduct` by those of your Arduino device.

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
