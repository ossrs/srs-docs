---
title: HDS Delivery
sidebar_label: HDS Delivery
hide_title: false
hide_table_of_contents: false
---

# HDS Delivery

HDS is the Http Dynamic Stream of Adobe，similar to Apple [HLS](./delivery-hls).

For specification of HDS, read http://www.adobe.com/devnet/hds.html

## Build

We can disable or enable HDS when build SRS, read [Build](./install)

```
./configure --hds=on
```

## Player

The OSMF player can play HDS. For example, use [OSMF player](http://www.ossrs.net/players/osmf.html) to play the following HDS:

```
http://ossrs.net:8081/live/livestream.f4m
```

## HDS Config

The vhost hds.srs.com of conf/full.conf describes the config for HDS:

```
vhost __defaultVhost__ {
    hds {
        # whether hds enabled
        # default: off
        enabled         on;
        # the hds fragment in seconds.
        # default: 10
        hds_fragment    10;
        # the hds window in seconds, erase the segment when exceed the window.
        # default: 60
        hds_window      60;
        # the path to store the hds files.
        # default: ./objs/nginx/html
        hds_path        ./objs/nginx/html;
    }
}
```

The config items are similar to HLS, read [HLS config](./delivery-hls#hls-config)

Winlin 2015.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v4/delivery-hds)


