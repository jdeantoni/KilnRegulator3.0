#!/bin/sh
echo "Enabling wait a boot for network to be up"
DIR="$(dirname "$0")"
set -x

## Wait for network configuration to be up, ignoring wlan0 interface (configured later in the boot process by hostapd)
sudo mkdir /etc/systemd/system/systemd-networkd-wait-online.service.d
sudo cp "$DIR"/../../systemd/system/systemd-networkd-wait-online.service.d/override.conf /etc/systemd/system/systemd-networkd-wait-online.service.d/
sudo systemctl enable systemd-networkd-wait-online.service
sudo systemctl start systemd-networkd-wait-online.service
