#!/bin/sh
echo "Switching from NetworkManager to systemd-networkd"
set -x
sudo systemctl disable NetworkManager.service
sudo systemctl stop NetworkManager.service
sudo systemctl disable NetworkManager-wait-online.service
sudo systemctl enable systemd-networkd.service
sudo systemctl restart systemd-networkd.service
