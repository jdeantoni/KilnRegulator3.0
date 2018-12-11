#!/bin/sh
echo "Configuring wireless access point as bridged in br0"
set -x

sudo sed "s/^#bridge=br0/bridge=br0/g" -i /etc/hostapd/hostapd.conf
sudo rm -f /etc/systemd/network/wlan0.network
sudo systemctl restart systemd-networkd.service
sudo systemctl restart hostapd.service
