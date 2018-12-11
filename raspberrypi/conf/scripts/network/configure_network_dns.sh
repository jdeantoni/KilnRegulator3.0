#!/bin/sh
echo "Configuring DNS resolver using systemd-resolved"
set -x

## DNS using systemd-resolved
sudo rm /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
sudo systemctl enable systemd-resolved.service
sudo systemctl restart systemd-resolved.service
