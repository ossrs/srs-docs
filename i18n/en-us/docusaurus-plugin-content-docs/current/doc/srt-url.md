---
title: SRT URL
sidebar_label: SRT URL
hide_title: false
hide_table_of_contents: false
---

# SRT URL Specification

Introduce how to generate publish/play url in SRT live mode.

## RTMP URL

For detail about RTMP URL specification, please read [RTMP URL](./rtmp-url-vhost.md).

* common rtmp url format(without vhost)
    - `rtmp://hostip:port/app/stream` 
    - example: `rtmp://10.111.1.100:1935/live/livestream` 
    - in the example above, app="live", stream="livestream" 
* complex rtmp url format(with vhost)
    - `rtmp://hostip:port/app/stream?vhost=xxx` 
    - example: `rtmp://10.111.1.100:1935/live/livestream?vhost=srs.com.cn` 
    - in the example above, vhost="srs.com.cn", app="live", stream="livestream"

How rtmp distinguish the url is use to publish or play stream:

* publish 
    - In rtmp protocol `publish message` indicate the url is use for publish stream
* play 
    - In rtmp protocol `play message` indicate the url is use for play stream

## SRT URL Format

Because srt is in the transport layer, we can't determine the given srt url is use to publish or play stream.

The srt official recommend how to configure url: [AccessControl.md](https://github.com/Haivision/srt/blob/master/docs/features/access-control.md)
The key method is using parameters in streamid to determine the usage of srt url, the format of streamid in YAML format.

## SRT URL no Vhost

srt url example:
* publish: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish` 
* play: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request` 

Note:
* `#!::` 
    - `#!::` is the begining of streamid, in YAML format.
* r 
    - map to /app/stream in rtmp url
* m 
    - publish means publish stream.
    - request measn play stream.

the rtmp url correspond with srt url above is: `rtmp://127.0.0.1/live/livestream`

## SRT URL for Vhost

srt url example:
* publish: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=publish` 
* play: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=request` 

Note:
* `#!::` 
    - `#!::` is the begining of streamid, in yaml format.
* h 
    - map to vhost in rtmp url
* r 
    - map to /app/stream in rtmp url
* m 
    - publish means publish stream.
    - request measn play stream.

The rtmp url correspond with srt url above is: `rtmp://127.0.0.1/live/livestream?vhost=srs.srt.com.cn`.

Runner365 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v5/srt-url)


