---
title: Stream Converter
sidebar_label: Stream Converter 
hide_title: false
hide_table_of_contents: false
---

# Stream Converter

Stream Converter is a server feature to accept stream over other protocol, for example, allow user to publish MPEG-TS over UDP to SRS.

Stream Converter will cast other stream protocol to rtmp, then publish to SRS itself, to devliery in RTMP/HLS/HTTP.

## Use Scenario

Typically use scenarios:

* Push MPEG-TS over UDP to SRS, delivery in RTMP/HLS/HTTP.
* POST FLV over HTTP to SRS, delivery in RTMP/HLS/HTTP.

> Remark: The Stream Converter will demux other protocol then push to SRS over RTMP, so all features of SRS are available, for example, push MPEGTS to SRS over RTMP to edge vhost which will forward stream to origin, or transcode the rtmp stream, or directly forward to other server. And, all delivery methods are ok, for example, push MPEGTS to SRS overy RTMP, delivery in RTMP/HLS/HTTP.

## Build

Build SRS with stream converter, read [Build](./install.md)

```
./configure --stream-caster=on
```

## Protocols

The protocols supported by Stream Converter:

* MPEG-TS over UDP: Support encoder to push MPEG-TS over UDP to SRS.
* POST FLV over HTTP to SRS: Support encoder.

## Config

The config for stream converters:

```
# Push MPEGTS over UDP to SRS.
stream_caster {
    # Whether stream converter is enabled.
    # Default: off
    enabled on;
    # The type of stream converter, could be:
    #       mpegts_over_udp, push MPEG-TS over UDP and convert to RTMP.
    caster mpegts_over_udp;
    # The output rtmp url.
    # For mpegts_over_udp converter, the typically output url:
    #           rtmp://127.0.0.1/live/livestream
    output rtmp://127.0.0.1/live/livestream;
    # The listen port for stream converter.
    # For mpegts_over_udp converter, listen at udp port. for example, 8935.
    listen 8935;
}

# Push FLV by HTTP POST to SRS.
stream_caster {
    # Whether stream converter is enabled.
    # Default: off
    enabled on;
    # The type of stream converter, could be:
    #       flv, push FLV by HTTP POST and convert to RTMP.
    caster flv;
    # The output rtmp url.
    # For flv converter, the typically output url:
    #           rtmp://127.0.0.1/[app]/[stream]
    # For example, POST to url:
    #           http://127.0.0.1:8936/live/livestream.flv
    # Where the [app] is "live" and [stream] is "livestream", output is:
    #           rtmp://127.0.0.1/live/livestream
    output rtmp://127.0.0.1/[app]/[stream];
    # The listen port for stream converter.
    # For flv converter, listen at tcp port. for example, 8936.
    listen 8936;
}
```

## Push MPEG-TS over UDP

SRS can listen a udp port, which recv udp packet(SPTS) from encoder, then remux the SPTS to a RTMP stream. All features for RTMP is ok for this RTMP stream.

The config for pushing MPEG-TS over UDP, see `conf/push.mpegts.over.udp.conf`:

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

For more information, read https://github.com/ossrs/srs/issues/250#issuecomment-72321769

## Push RTSP to SRS

It's been eliminated, see [#2304](https://github.com/ossrs/srs/issues/2304#issuecomment-826009290).

## Push HTTP FLV to SRS

SRS can listen at a http port, to which encoder to push stream, then remux the HTTP flv to RTMP. All features for RTMP is ok for this RTMP stream.

The config for pushing HTTP FLV to SRS, read `conf/push.flv.conf`：

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

The app publish url: `http://127.0.0.1:8936/live/sea.flv`<br/>
The RTMP url to play: `rtmp://127.0.0.1/live/sea`<br/>
The HLS url to play: `http://127.0.0.1:8080/live/sea.m3u8`

Remark: User should enable the HTTP server and HLS, read `conf/push.flv.conf`

2015.1

[ap]: https://github.com/ossrs/android-publisher

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v4/streamer)


