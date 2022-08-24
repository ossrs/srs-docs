---
title: Stream Caster
sidebar_label: Stream Caster 
hide_title: false
hide_table_of_contents: false
---

# Streamer

Streamer is a server feature to accept stream over other protocol, for example, allow user to publish MPEG-TS over UDP to SRS.

Streamer will cast other stream protocol to rtmp, then publish to SRS itself, to devliery in RTMP/HLS/HTTP.

## Use Scenario

Typically use scenarios:

* Push MPEG-TS over UDP to SRS, delivery in RTMP/HLS/HTTP.
* Push RTSP to SRS, delivery in RTMP/HLS/HTTP.
* POST FLV over HTTP to SRS, delivery in RTMP/HLS/HTTP.

Remark: The streamer will demux other protocol then push to SRS over RTMP, so all features of SRS are available, for example, push RTSP to SRS over RTMP to edge vhost which will forward stream to origin, or transcode the rtmp stream, or directly forward to other server. And, all delivery methods are ok, for example, push RTSP to SRS overy RTMP, delivery in RTMP/HLS/HTTP.

## Build

Build SRS with stream caster, read [Build](./install)

```
./configure --stream-caster=on
```

## Protocols

The protocols supported by Streamer:

* MPEG-TS over UDP: Support encoder to push MPEG-TS over UDP to SRS.
* Push RTSP to SRS: Support encoder to push RTSP to SRS.
* POST FLV over HTTP to SRS: Support encoder.

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

# Push RTSP to SRS

It's deprecated and will be removed in the future, see [#2304](https://github.com/ossrs/srs/issues/2304#issuecomment-826009290).

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


