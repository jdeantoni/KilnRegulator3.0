# KilnRegulator Server on RaspberryPi

## Setup
Raspbian Lite

```
sudo apt install hostapd
sudo systemctl enable systemd-networkd
sudo systemctl enable systemd-networkd-wait-online
sudo systemctl enable systemd-resolved.service
sudo systemctl enable hostapd
sudo systemctl enable avahi-daemon

sudo rm /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf

# SSH avahi service
cp  /usr/share/doc/avahi-daemon/examples/ssh.service services/

#Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
 echo "deb [arch=armhf] https://download.docker.com/linux/debian \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt-get install docker-ce docker-compose
sudo usermod -G docker -a pi

```
