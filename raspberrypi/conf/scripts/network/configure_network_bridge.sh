#!/bin/sh
echo "Configuring Bridge interface br0 with Ethernet"
DIR="$(dirname "$0")"
set -x

## Ethernet
sudo cp "$DIR"/../../systemd/network/eth0.network /etc/systemd/network/
## Bridge
sudo cp "$DIR"/../../systemd/network/br0.netdev /etc/systemd/network/
sudo cp "$DIR"/../../systemd/network/br0.network /etc/systemd/network/
sudo systemctl restart systemd-networkd.service
