---
title: RTMP Deploy
sidebar_label: RTMP Deploy 
hide_title: false
hide_table_of_contents: false
---

# RTMP deploy example

RTMP is the kernel feature of SRS.

**Suppose the server ip is 192.168.1.170**

## Step 1, get SRS

For detail, read [GIT](./git.md)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update the exists code:

```bash
git pull
```

## Step 2, build SRS

For detail, read [Build](./install.md)

```bash
./configure && make
```

## Step 3, config SRS

For detail, read [RTMP](./delivery-rtmp.md)

Save bellow as config, or use `conf/rtmp.conf`:

```bash
# conf/rtmp.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
}
```

## Step 4, start SRS

For detail, read [RTMP](./delivery-rtmp.md)

```bash
./objs/srs -c conf/rtmp.conf
```

## Step 5, start encoder

For detail, read [RTMP](./delivery-rtmp.md)

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

## Step 6, play RTMP

For detail, read [RTMP](./delivery-rtmp.md)

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v4/sample-rtmp)


