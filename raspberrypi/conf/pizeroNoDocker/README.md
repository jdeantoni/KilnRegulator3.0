when using a pi zero W, docker and mongodb are barely usable since the pi zero W is armhf 32bits.

The actual solution does not use docker and use precompiled mongo 3.0.4 32 bit version (the version on the raspbian repo is too old to work with nodejs 10+).

In order to make it works: 

 * install mongodb from the repo, 
 * copy the binaries found in the mongo folder in /usr/bin
 * enable mongodb (systemctl enable mongodb)
 * cp the startKilnRegulator.sh script in /usr/local/bin
 * cp the kilnRegulator.target into /etc/systemd/system/ folder
 * enable kilnRegulator (systemctl enable kilnRegulator)
 
