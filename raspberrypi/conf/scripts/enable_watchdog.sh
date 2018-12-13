#!/bin/sh
echo "Installing, configuring and enabling watchdog"
set -x

#Watchdog
sudo apt update
sudo apt install -y watchdog
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
sudo systemctl enable watchdog.service
