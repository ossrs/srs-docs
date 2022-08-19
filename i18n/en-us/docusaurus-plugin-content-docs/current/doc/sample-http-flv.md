---
title: HTTP-FLV Deploy
sidebar_label: HTTP-FLV Deploy
hide_title: false
hide_table_of_contents: false
---

# HTTP FLV deploy example

About the HTTP FLV of SRS, read [HTTP FLV](./delivery-http-flv#about-http-flv)

How to use multiple process for HTTP FLV? Please read [Reuse Port](./reuse-port) for detail.

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

For detail, read [HTTP FLV](./delivery-http-flv)

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

For detail, read [HTTP FLV](./delivery-http-flv)

```bash
./objs/srs -c conf/http.flv.live.conf
```

## Step 5, start Encoder

For detail, read read [HTTP FLV](./delivery-http-flv)

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

For detail, read [HTTP FLV](./delivery-http-flv)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`, User can use vlc to play the RTMP stream.

Note: Please replace all ip 192.168.1.170 to your server ip.

## Step 7, play HTTP FLV

For detail, read [HTTP FLV](./delivery-http-flv)

HTTP FLV url: `http://192.168.1.170:8080/live/livestream.flv`, User can use vlc to play the HLS stream. Or, use online SRS player(you must input the flv url): [srs-player](https://ossrs.net/players/srs_player.html)

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-5/doc/sample-http-flv)


