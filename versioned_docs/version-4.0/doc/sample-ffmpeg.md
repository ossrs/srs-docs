---
title: Transcode Deploy
sidebar_label: Transcode Deploy
hide_title: false
hide_table_of_contents: false
---

# Transcode deploy example

FFMPEG can used to transcode the live stream, output the other RTMP server.
For detail, read [FFMPEG](./ffmpeg).

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
./configure --ffmpeg-tool=on && make
```

## Step 3, config file

For detail, read [FFMPEG](./ffmpeg)

Save the bellow as config file, or use `conf/ffmpeg.transcode.conf` instead:

```bash
# conf/ffmpeg.transcode.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine ff {
            enabled         on;
            vfilter {
            }
            vcodec          libx264;
            vbitrate        500;
            vfps            25;
            vwidth          768;
            vheight         320;
            vthreads        12;
            vprofile        main;
            vpreset         medium;
            vparams {
            }
            acodec          libfdk_aac;
            abitrate        70;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

## Step 4, start SRS

For detail, read [FFMPEG](./ffmpeg)

```bash
./objs/srs -c conf/ffmpeg.conf
```

## Step 5, start encoder

For detail, read [FFMPEG](./ffmpeg)

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

The stream in SRS:
* Stream publish by encoder: rtmp://192.168.1.170:1935/live/livestream
* Play the original stream: rtmp://192.168.1.170:1935/live/livestream
* Play the transcoded stream: rtmp://192.168.1.170:1935/live/livestream_ff

## Step 6, play the stream

For detail, read [FFMPEG](./ffmpeg)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

## Step 7, play the transcoded stream

For detail, read [FFMPEG](./ffmpeg)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream_ff`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player-ff][srs-player-ff]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[jwplayer-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream_ff.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-4/doc/sample-ffmpeg)


