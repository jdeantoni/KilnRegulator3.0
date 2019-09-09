# KilnRegulator Server on RaspberryPi

## Setup

Raspbian Lite
(note: on pi zero w, to connect through USB do ```touch ssh``` in the boot partition, then append ```dtoverlay=dwc2``` at the end of config.txt and append ```modules-load=dwc2,g_ether``` at the end of the line in cmdline.txt)

### Auto

```
cd scripts
./install.sh
```

### Manual

```
sudo apt install hostapd
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl enable systemd-networkd.service
sudo systemctl enable systemd-resolved.service
sudo systemctl enable avahi-daemon.service


# Network configuration
## DNS using systemd-resolved
sudo rm /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
## WiFi access point
sudo cp hostapd/hostapd.conf /etc/hostapd/
sudo cp systemd/system/hostapd.service /etc/systemd/system/
sudo systemctl enable hostapd
sudo cp systemd/network/wlan0.network /etc/systemd/network/
## Ethernet
sudo cp systemd/network/eth0.network /etc/systemd/network/
## Bridge
sudo cp systemd/network/br0.netdev /etc/systemd/network/
sudo cp systemd/network/br0.network /etc/systemd/network/
## Wait for network configuration to be up, ignoring wlan0 interface (configured later in the boot process by hostapd)
sudo mkdir /etc/systemd/system/systemd-networkd-wait-online.service.d
sudo cp systemd/system/systemd-networkd-wait-online.service.d/override.conf /etc/systemd/system/systemd-networkd-wait-online.service.d/
sudo systemctl enable systemd-networkd-wait-online.service

# SSH avahi service
sudo cp  /usr/share/doc/avahi-daemon/examples/ssh.service /etc/avahi/services
# KilnRegulator Avahi service
sudo cp avahi/services/kilnregulator.service /etc/avahi/services

#Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
 echo "deb [arch=armhf] https://download.docker.com/linux/debian \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt-get install docker-ce docker-compose
sudo usermod -G docker -a pi

#Watchdog
sudo apt install watchdog
echo -e "# activating the hardware watchdog\ndtparam=watchdog=on" |sudo tee -a /boot/config.txt
cat <<EOF | sudo tee -a /etc/watchdog.conf
# rpi watchdog device
watchdog-device = /dev/watchdog
# rpi watchdog max timeout
watchdog-timeout=15
# some parameters to trigger watchdog on resource exhausted
max-load-1 = 24
min-memory = 8
EOF


# We don't need no swapfile
sudo systemctl disable dphys-swapfile.service
sudo rm -f /var/swap
```

Reboot Raspberry Pi.

## Default settings

| Parameter           | Default value    | Configuration file                 |
| ------------------- | ---------------- | ---------------------------------- |
| SSID                | KilnRegulator    | /etc/hostapd/hostapd.conf          |
| Passphrase          | KilnRegulator3.0 | /etc/hostapd/hostapd.conf          |
| WiFi IP Address     | 192.168.1.1      | /etc/systemd/network/wlan0.network |
| Ethernet IP Address | DHCP configured  | /etc/systemd/network/br0.network   |
