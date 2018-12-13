#!/bin/sh
DIR="$(dirname "$0")"
echo -n "1. "
"$DIR"/enable_avahi.sh
echo -n "2. "
"$DIR"/install_docker.sh
echo -n "3. "
"$DIR"/enable_watchdog.sh
echo -n "4. "
"$DIR"/disable_swap.sh
echo -n "5. "
"$DIR"/configure_network.sh
