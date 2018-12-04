# KilnRegulator Server on RaspberryPi

## Setup
Raspbian Lite

```
sudo apt install hostapd
sudo systemctl enable systemd-networkd
sudo systemctl enable systemd-networkd-wait-online
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl enable systemd-resolved.service
sudo systemctl enable hostapd
sudo systemctl enable avahi-daemon

sudo rm /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf

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
echo -e "# rpi watchdog max timeout\nwatchdog-timeout=15" | sudo tee /etc/watchdog.conf
# some parameters to trigger watchdog on resource exhausted
echo -e "max-load-1 = 24\nmin-memory = 8" | sudo tee /etc/watchdog.conf

# We don't need no swapfile
sudo systemctl disable dphys-swapfile.service
sudo rm -f /var/swap
```
