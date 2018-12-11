#!/bin/sh
echo "Installing Docker CE"
set -x
#Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
 echo "deb [arch=armhf] https://download.docker.com/linux/debian \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update
sudo apt install -y docker-ce docker-compose
sudo usermod -G docker -a pi

