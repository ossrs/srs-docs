---
title: Stream Caster
sidebar_label: Stream Caster 
hide_title: false
hide_table_of_contents: false
---

# Streamer

Streamer是SRS作为服务器侦听并接收其他协议的流（譬如RTSP，MPEG-TS over UDP等等），将这些协议的流转换成RTMP推送给自己，以使用RTMP/HLS/HTTP分发流。

## Use Scenario

常见的应用场景包括：

* Push MPEG-TS over UDP to SRS：通过UDP协议，将MPEG-TS推送到SRS，分发为RTMP/HLS/HTTP流。
* Push RTSP to SRS：通过RTSP协议，将流推送到SRS，分发为RTMP/HLS/HTTP流。
* POST FLV over HTTP to SRS: 通过HTTP协议，将FLV流POST到SRS，分发为RTMP/HLS/HTTP流。

备注：Streamer将其他支持的协议推送RTMP给SRS后，所有SRS的功能都能支持。譬如，推RTSP流给Streamer，Streamer转成RTMP推送给SRS，若vhost是edge，SRS将RTMP流转发给源站。或者将RTMP流转码，或者直接转发。另外，所有分发方法都是可用的，譬如推RTSP流给Streamer，Streamer转成RTMP推给SRS，以RTMP/HLS/HTTP分发。

## Build

编译SRS时打开StreamCaster支持，参考[Build](./install.md)：

```
./configure --stream-caster=on
```

## Protocols

目前Streamer支持的协议包括：

* MPEG-TS over UDP：已支持，可使用FFMPEG或其他编码器`push MPEG-TS over UDP`到SRS上。
* Push RTSP to SRS：已支持，可以使用FFMPEG或其他编码器`push rtsp to SRS`。
* POST FLV over HTTP to SRS: 已支持。

## Config

The config for stream casters:

```
# the streamer cast stream from other protocol to SRS over RTMP.
# @see https://github.com/ossrs/srs/tree/develop#stream-architecture
stream_caster {
    # whether stream caster is enabled.
    # default: off
    enabled         off;
    # the caster type of stream, the casters:
    #       mpegts_over_udp, MPEG-TS over UDP caster.
    #       rtsp, Real Time Streaming Protocol (RTSP).
    #       flv, FLV over HTTP POST.
    caster          mpegts_over_udp;
    # the output rtmp url.
    # for mpegts_over_udp caster, the typically output url:
    #       rtmp://127.0.0.1/live/livestream
    # for rtsp caster, the typically output url:
    #       rtmp://127.0.0.1/[app]/[stream]
    #       for example, the rtsp url:
    #           rtsp://192.168.1.173:8544/live/livestream.sdp
    #           where the [app] is "live" and [stream] is "livestream", output is:
    #           rtmp://127.0.0.1/live/livestream
    output          rtmp://127.0.0.1/live/livestream;
    # the listen port for stream caster.
    #       for mpegts_over_udp caster, listen at udp port. for example, 8935.
    #       for rtsp caster, listen at tcp port. for example, 554.
    #       for flv caster, listen at tcp port. for example, 8936.
    # TODO: support listen at <[ip:]port>
    listen          8935;
    # for the rtsp caster, the rtp server local port over udp,
    # which reply the rtsp setup request message, the port will be used:
    #       [rtp_port_min, rtp_port_max)
    rtp_port_min    57200;
    rtp_port_max    57300;
}
```

## Push MPEG-TS over UDP

SRS可以侦听一个udp端口，编码器将流推送到这个udp端口（SPTS）后，SRS会转成一路RTMP流。后面RTMP流能支持的功能都支持。

配置如下，参考`conf/push.mpegts.over.udp.conf`：

```
# the streamer cast stream from other protocol to SRS over RTMP.
# @see https://github.com/ossrs/srs/tree/develop#stream-architecture
stream_caster {
    enabled         on;
    caster          mpegts_over_udp;
    output          rtmp://127.0.0.1/live/livestream;
    listen          1935;
}
```

参考：https://github.com/ossrs/srs/issues/250#issuecomment-72321769

# Push RTSP to SRS

这个功能被标记为了过时(Deprecated)，并且会在未来删除，详细原因参考[#2304](https://github.com/ossrs/srs/issues/2304#issuecomment-826009290)。

## Push HTTP FLV to SRS

SRS可以侦听一个HTTP端口，编码器将流推送到这个http端口后，SRS会转成一路RTMP流。所有RTMP流的功能都能支持。

配置如下，参考`conf/push.flv.conf`：

```
# the streamer cast stream from other protocol to SRS over RTMP.
# @see https://github.com/ossrs/srs/tree/develop#stream-architecture
stream_caster {
    enabled         on;
    caster          flv;
    output          rtmp://127.0.0.1/[app]/[stream];
    listen          8936;
}
```

这个配置时，客户端推流的地址，例如：`http://127.0.0.1:8936/live/sea.flv`<br/>
播放RTMP流地址是：`rtmp://127.0.0.1/live/sea`<br/>
播放HLS流地址是：`http://127.0.0.1:8080/live/sea.m3u8`

注意：需要配置HTTP服务器和HLS，参考`conf/push.flv.conf`

2015.1

[ap]: https://github.com/ossrs/android-publisher

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/streamer)


