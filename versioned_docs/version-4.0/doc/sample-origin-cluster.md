---
title: RTMP Origin Cluster
sidebar_label: RTMP Origin Cluster
hide_title: false
hide_table_of_contents: false
---

# RTMP Origin Cluster

RTMP Origin Cluster is a powerful feature for huge pushing streams,
we could use RTMP Origin Cluster and RTMP Edge Cluster together,
to support huge pushing and pulling streams.

**Suppose your server is: 192.168.1.170**

## Step 1: Get SRS

For more information please read [here](./git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update your repository:

```bash
git pull
```

## Step 2: Build SRS

For more information please read [here](./install)

```bash
./configure && make
```

## Step 3: Config the first origin, Origin ServerA

For more information please read [here](./origin-cluster)

You can use the file `conf/origin.cluster.serverA.conf`, or write your own:

```bash
# conf/origin.cluster.serverA.conf
listen              19350;
max_connections     1000;
daemon              off;
srs_log_tank        console;
pid                 ./objs/origin.cluster.serverA.pid;
http_api {
    enabled         on;
    listen          9090;
}
vhost __defaultVhost__ {
    cluster {
        mode            local;
        origin_cluster  on;
        coworkers       127.0.0.1:9091;
    }
}
```

## Step 4: Config the second origin, Origin ServerB

For more information please read [here](./origin-cluster)

You can use the file `conf/origin.cluster.serverB.conf`, or write your own:

```bash
# conf/origin.cluster.serverB.conf
listen              19351;
max_connections     1000;
daemon              off;
srs_log_tank        console;
pid                 ./objs/origin.cluster.serverB.pid;
http_api {
    enabled         on;
    listen          9091;
}
vhost __defaultVhost__ {
    cluster {
        mode            local;
        origin_cluster  on;
        coworkers       127.0.0.1:9090;
    }
}
```

## Step 5: Config edge server, which pulls streams from Origin Servers

For more information please read [here](./origin-cluster)

You can use the file `conf/origin.cluster.edge.conf`, or write your own:

```bash
# conf/origin.cluster.edge.conf
listen              1935;
max_connections     1000;
pid                 objs/edge.pid;
daemon              off;
srs_log_tank        console;
vhost __defaultVhost__ {
    cluster {
        mode            remote;
        origin          127.0.0.1:19351 127.0.0.1:19350;
    }
}
```

## Step 6: Start SRS servers

For more information please read [here](./origin-cluster)

```bash
./objs/srs -c conf/origin.cluster.serverA.conf &
./objs/srs -c conf/origin.cluster.serverB.conf &
./objs/srs -c conf/origin.cluster.edge.conf &
```

## Step 7: Push stream to any Origin Server

For more information please read [here](./origin-cluster)

By FFMEPG: 

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170:19350/live/livestream; \
        sleep 1; \
    done
```

Or FMLE:

```bash
FMS URL: rtmp://192.168.1.170:19350/live
Stream: livestream
```

## Step 8: Play RTMP stream from Edge server

For more information please read [here](./origin-cluster)

RTMP URL is: `rtmp://192.168.1.170/live/livestream`, you can choose VLC, or only player [srs-player][srs-player].

> Remark: Replace the IP `192.168.1.170` to your server IP.

Winlin 2018.2

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-4/doc/sample-origin-cluster)


