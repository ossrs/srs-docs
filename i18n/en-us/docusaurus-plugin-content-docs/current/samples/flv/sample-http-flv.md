---
title: HTTP-FLV Deploy
sidebar_label: HTTP-FLV Deploy
hide_title: false
hide_table_of_contents: false
---

# HTTP FLV deploy example

About the HTTP FLV of SRS, read [HTTP FLV](http://ossrs.net/srs.release/wiki/v4_EN_DeliveryHttpStream#about-http-flv)

How to use multiple process for HTTP FLV? You can use HTTP reverse proxy, and SRS start the go-sharp project, which can proxy in load balance mode and detect the status of SRS. For go-sharp, read [go-sharp][go-sharp]

**Suppose the server ip is 192.168.1.170**

## Step 1, get SRS

For detail, read [GIT](../../doc/git.md)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update the exists code:

```bash
git pull
```

## Step 2, build SRS

For detail, read [Build](../../doc/build/install.md)

```bash
./configure && make
```

## Step 3, config SRS

For detail, read [HTTP FLV](http://ossrs.net/srs.release/wiki/v4_EN_DeliveryHttpStream)

Save bellow as config, or use `conf/http.flv.live.conf`:

```bash
# conf/http.flv.live.conf
listen              1935;
max_connections     1000;
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
vhost __defaultVhost__ {
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
        hstrs       on;
    }
}
```

## Step 4, start SRS

For detail, read [HTTP FLV](http://ossrs.net/srs.release/wiki/v4_EN_DeliveryHttpStream)

```bash
./objs/srs -c conf/http.flv.live.conf
```

## Step 5, start Encoder

For detail, read read [HTTP FLV](http://ossrs.net/srs.release/wiki/v4_EN_DeliveryHttpStream)

Use FFMPEG to publish stream:

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

Or use FMLE to publish：

```bash
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

The streams on SRS:
* RTMP: `rtmp://192.168.1.170/live/livestream`
* HTTP FLV: `http://192.168.1.170:8080/live/livestream.flv`

## Step 6, play RTMP

For detail, read [HTTP FLV](http://ossrs.net/srs.release/wiki/v4_EN_DeliveryHttpStream)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`, User can use vlc to play the RTMP stream. Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

## Step 7, play HTTP FLV

For detail, read [HTTP FLV](http://ossrs.net/srs.release/wiki/v4_EN_DeliveryHttpStream)

HTTP FLV url: `http://192.168.1.170:8080/live/livestream.flv`, User can use vlc to play the HLS stream. Or, use online SRS player(you must input the flv url): [jwplayer-flv][jwplayer-flv]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11