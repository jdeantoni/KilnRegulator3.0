#!/bin/sh
echo "Disabling swap and removing swapfile"
set -x
# We don't need no swapfile
sudo systemctl disable dphys-swapfile.service
sudo rm -f /var/swap
