#!/bin/sh
echo "Configuring wireless access point as NATed"
DIR="$(dirname "$0")"
set -x

sudo cp "$DIR"/../../systemd/network/wlan0.network /etc/systemd/network/
sudo sed "s/^bridge=br0/#bridge=br0/g" -i /etc/hostapd/hostapd.conf
sudo systemctl restart systemd-networkd.service
sudo systemctl restart hostapd.service
