---
title: RTMP deploy
sidebar_label: RTMP deploy
hide_title: false
hide_table_of_contents: false
---

# RTMP deploy example

RTMP is the kernel feature of SRS.

<strong>Suppose the server ip is 192.168.1.170</strong>

<strong>Step 1, get SRS.</strong> For detail, read [GIT](v4_EN_Git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update the exists code:

```bash
git pull
```

<strong>Step 2, build SRS.</strong> For detail, read [Build](v4_EN_Build)

```bash
./configure && make
```

<strong>Step 3, config srs.</strong> For detail, read [RTMP](v4_EN_DeliveryRTMP)

Save bellow as config, or use `conf/rtmp.conf`:

```bash
# conf/rtmp.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
}
```

<strong>Step 4, start srs.</strong> For detail, read [RTMP](v4_EN_DeliveryRTMP)

```bash
./objs/srs -c conf/rtmp.conf
```

<strong>Step 5, start encoder.</strong> For detail, read [RTMP](v4_EN_DeliveryRTMP)

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

<strong>Step 6, play RTMP.</strong> For detail, read [RTMP](v4_EN_DeliveryRTMP)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[jwplayer-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream_ff.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080