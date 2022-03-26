---
title: Build
sidebar_label: Build
hide_title: false
hide_table_of_contents: false
custom_edit_url: null
---

You can directly use the release binaries, or build SRS step by step. See: Github: release or Mirror of China: release

## OS

- CentOS6/CentOS7 is recommended.
- Use srs-docker to build SRS.
- Use srs-docker to run SRS.


## IPTABLES and SELINUX
Sometimes the stream play failed, but without any error message, or server cann't connect to. Please check the iptables and selinux.

Turn off iptables:

```
# disable the firewall
sudo /etc/init.d/iptables stop
sudo /sbin/chkconfig iptables off
```

Disable the selinux, to run getenforce to ensure the result is Disabled:

1. Edit the config of selinux: sudo vi /etc/sysconfig/selinux
2. Change the SELINUX to disabled: SELINUX=disabled
3. Rebot: sudo init 6


## Build

It's very easy to build SRS:

```
./configure && make
```

Also easy to start SRS:

```
./objs/srs -c conf/srs.conf
```

Publish RTMP, please read: Usage: RTMP

More usages, please read: Usage

For service management, please read Service.

Run SRS in docker, please read srs-docker

## ARM

It's also ok to directly build on ARM server.

For ARM/MIPS or crossbuild, please read here.

Winlin 2014.11
