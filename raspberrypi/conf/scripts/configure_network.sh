#!/bin/sh
echo "Configuring network"
DIR="$(dirname "$0")"

echo -n "  a. "
"$DIR"/network/configure_network_systemd_networkd.sh
echo -n "  b. "
"$DIR"/network/configure_network_dns.sh
echo -n "  c. "
"$DIR"/network/configure_network_bridge.sh
echo -n "  d. "
"$DIR"/network/configure_network_wait_online.sh

echo -n "  e. "
"$DIR"/network/configure_network_access_point.sh

echo -n "  f. "
"$DIR"/network/configure_network_wireless_nat.sh
#OR "$DIR"/network/configure_network_access_point_bridge.sh
