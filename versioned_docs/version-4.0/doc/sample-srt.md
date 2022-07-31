---
title: SRT Deploy
sidebar_label: SRT Deploy
hide_title: false
hide_table_of_contents: false
---

# SRT deploy example

Delivery SRT by SRS:

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
./configure --srt=on && make
```

> Remark: Recommend [srs-docker](https://github.com/ossrs/srs/issues/1147#issuecomment-577951899) to run SRS and FFMPEG.

## Step 3, config SRS

Save bellow as config, or use `conf/srt.conf`:

```bash
# conf/srt.conf
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;
srt_server {
    enabled on;
    listen 10080;
}
vhost __defaultVhost__ {
}
```

> Note: About more parameters, please see [SRT Parameters](./srt-params).

> Note: More discussion about SRT, please read [#1147](https://github.com/ossrs/srs/issues/1147#issuecomment-577469119).

## Step 4, start SRS

```bash
./objs/srs -c conf/srt.conf
```

## Step 5, start Encoder

Use FFMPEG to publish stream:

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f mpegts "srt://192.168.1.170:10080?streamid=#!::r=live/livestream,m=publish"; \
        sleep 1; \
    done
```

The stream in SRS:
* RTMP url：`rtmp://192.168.1.170/live/livestream`

## Step 6, play RTMP stream

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2020.01

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[jwplayer-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream_ff.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[HLS-Audio-Only]: https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#hlsaudioonly

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-4/doc/sample-srt)


