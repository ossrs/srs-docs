---
title: Client SDK
sidebar_label: Client SDK
hide_title: false
hide_table_of_contents: false
---

# Client SDK

整个直播的业务架构是：

```
+---------+      +-----------------+       +---------+
| Encoder +-->---+ SRS/CDN Network +--->---+ Player  |
+---------+      +-----------------+       +---------+
```

## EXOPlayer

[EXOPlayer](https://github.com/google/ExoPlayer)是基于Android新的播放器框架的新播放器，支持众多的协议，包括HTTP-FLV和HLS。虽然不支持RTMP，但是支持FLV，因此延迟可以比HLS低很多。

## IJKPlayer

[ijkplayer](https://github.com/Bilibili/ijkplayer)是[B站](http://www.bilibili.com/)出的一个播放器，基于FFMPEG软件解码，可以在Android和iOS上用。

## FFmpeg

[FFmpeg](https://ffmpeg.org) is a complete, cross-platform solution to record, convert and stream audio and video.

## WebRTC

[WebRTC](https://webrtc.org/) is Real-time communication for the web.

## LIBRTMP

[LIBRTMP](https://github.com/ossrs/librtmp)或者[SRS-LIBRTMP](https://github.com/ossrs/srs-librtmp)，只是提供了Transport(RTMP)的功能，用于只需要做传输的场景，比如一些安防摄像头厂商，Transport之前是用RTSP/RTP做的，如果需要接入互联网，将流送到CDN给PC和移动端观看，直接使用H5或者Flash，不需要装插件时，可以用librtmp将已经编码的流MUX成FLV（RTMP传输实际上用的是FLV格式），然后通过librtmp发送出去。

## PC

有些应用场景，还是会用PC端推流，当然是用[OBS](https://obsproject.com/)。

> 注意：OBS推流时，流名称的翻译有问题，**流名称**是要写在**流密钥**这里的，如下图所示。

![OBS](/img/doc-integration-client-sdk-001.png)

![OBS](/img/doc-integration-client-sdk-002.png)

Winlin 2017.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/client-sdk)


