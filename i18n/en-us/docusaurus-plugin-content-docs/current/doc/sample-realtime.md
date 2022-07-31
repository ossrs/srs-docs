---
title: RTMP Realtime Deploy
sidebar_label: RTMP Realtime Deploy
hide_title: false
hide_table_of_contents: false
---

# RTMP low latency deploy example

The SRS realtime(low latency) mode can decrease the latency to 0.8-3s.
For detail about latency, read [LowLatency](./low-latency).

**Suppose the server ip is 192.168.1.170**

## Step 1, get SRS

For detail, read [GIT](./git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update the exists code:

```bash
git pull
```

## Step 2, build SRS

For detail, read [Build](./install)

```bash
./configure && make
```

## Step 3, config SRS

For detail, read [LowLatency](./low-latency)

Save bellow as config, or use `conf/realtime.conf`:

```bash
# conf/realtime.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
    tcp_nodelay     on;
    min_latency     on;

    play {
        gop_cache       off;
        queue_length    10;
        mw_latency      100;
    }

    publish {
        mr off;
    }
}
```

## Step 4, start SRS

For detail, read [LowLatency](./low-latency)

```bash
./objs/srs -c conf/realtime.conf
```

## Step 5, start Encoder

For detail, read [LowLatency](./low-latency)

Use FFMPEG to publish stream:

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

Or use FMLE to publish:

```bash
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

Note: To measure the latency, can use the clock of mobile phone.
![latency](/img/sample-realtime-001.png)

## Step 6, play RTMP

For detail, read [LowLatency](./low-latency)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.12

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[jwplayer-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream_ff.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
