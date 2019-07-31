## WiFi access point
echo "Configuring network access point"
DIR="$(dirname "$0")"
set -x

sudo apt update
sudo apt install -y hostapd
sudo cp "$DIR"/../../hostapd/hostapd.conf /etc/hostapd/
sudo cp "$DIR"/../../systemd/system/hostapd.service /etc/systemd/system/
sudo systemctl enable hostapd
sudo systemctl restart hostapd
