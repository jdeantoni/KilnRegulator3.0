#!/bin/sh
echo "Enabling Avahi with SSH and KilnRegulator services"
DIR="$(dirname "$0")"
set -x

sudo apt update
sudo apt install -y avahi-daemon
# SSH avahi service
sudo cp /usr/share/doc/avahi-daemon/examples/ssh.service /etc/avahi/services
# KilnRegulator Avahi service
sudo cp "$DIR"/../avahi/services/kilnregulator.service /etc/avahi/services

sudo systemctl enable avahi-daemon.service
