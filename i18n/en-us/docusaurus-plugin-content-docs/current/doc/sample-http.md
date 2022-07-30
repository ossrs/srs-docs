---
title: HTTP Server Deploy
sidebar_label: HTTP Server Deploy
hide_title: false
hide_table_of_contents: false
---

# SRS HTTP server deploy example

SRS embeded HTTP server, to delivery HLS and files.

**Suppose the server ip is 192.168.1.170**

## Step 1, get SRS

For detail, read [GIT](https://github.com/ossrs/srs/wiki/v4_EN_Git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update the exists code:

```bash
git pull
```

## Step 2, build SRS

For detail, read [Build](https://github.com/ossrs/srs/wiki/v4_EN_Build)

```bash
./configure && make
```

## Step 3, config SRS

For detail, read [HLS](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHLS) and [HTTP Server](https://github.com/ossrs/srs/wiki/v4_EN_HTTPServer)

Save bellow as config, or use `conf/http.hls.conf`:

```bash
# conf/http.hls.conf
listen              1935;
max_connections     1000;
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
vhost __defaultVhost__ {
    hls {
        enabled         on;
        hls_path        ./objs/nginx/html;
        hls_fragment    10;
        hls_window      60;
    }
}
```

Note: The hls_path must exists, srs never create it. For detail, read [HLS](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHLS)

## Step 4, start SRS

For detail, read [HLS](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHLS) and [SRS HTTP Server](https://github.com/ossrs/srs/wiki/v4_EN_HTTPServer)

```bash
./objs/srs -c conf/http.hls.conf
```

## Step 5, start Encoder

For detail, read [HLS](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHLS)

Use FFMPEG to publish stream:

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

Or use FMLE(which support h.264+aac) to publish, read [Transcode2HLS](https://github.com/ossrs/srs/wiki/v4_EN_SampleTranscode2HLS)：

```bash
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

The streams on SRS:
* RTMP: `rtmp://192.168.1.170/live/livestream`
* HLS: `http://192.168.1.170:8080/live/livestream.m3u8`

## Step 6, play RTMP

For detail, read [HLS](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHLS)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

## Step 7, play HLS

For detail, read [HLS](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHLS)

HLS url: `http://192.168.1.170:8080/live/livestream.m3u8`

User can use vlc to play the HLS stream.

Or, use online SRS player: [srs-player][jwplayer]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[jwplayer-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream_ff.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080