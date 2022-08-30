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

> Note: About more parameters, please see [SRT Parameters](./srt-params.md).

> Note: More discussion about SRT, please read [#1147](https://github.com/ossrs/srs/issues/1147#issuecomment-577469119).

## Step 4, start SRS

```bash
./objs/srs -c conf/srt.conf
```

## Step 5, start Encoder

Use FFMPEG to publish stream:

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f mpegts 'srt://192.168.1.170:10080?streamid=#!::r=live/livestream,m=publish'
```

You're able to play it by ffplay：

```bash
ffplay 'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request'
```

The stream in SRS:

* RTMP url：`rtmp://192.168.1.170/live/livestream`

## Step 6, play RTMP stream

RTMP url is: `rtmp://192.168.1.170:1935/live/livestream`

User can use vlc to play the RTMP stream.

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2020.01

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v4/sample-srt)


