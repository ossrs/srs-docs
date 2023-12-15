---
slug: unlock-the-power-of-hevc-via-rtmp
title: SRS Server - 用FFmpeg推送RTMP HEVC流
authors: []
tags: [hevc, rtmp, obs, ffmpeg, live]
custom_edit_url: null
---

# Unlock the Power of HEVC via RTMP - Boost Your Live Streaming with OBS and FFmpeg

## Introduction

HEVC（或H.265）与广泛使用的H.264编码相比，可以将带宽使用量减少约50%，而H.264具有最佳的兼容性。在过去的10年里，
HEVC的发展速度较慢，因为新的编码需要一个生态系统来支持它，包括解码器和设备硬件。现在，OBS和FFmpeg都支持RTMP和FLV的HEVC，
这些都是直播行业的标准工具。

<!--truncate-->

在直播中，所有必要的工具都已准备好支持HEVC。对于编码，FFmpeg和OBS是最常用的直播工具。OBS 29+支持带有HEVC的RTMP，
而FFmpeg 6支持带有HEVC的RTMP。对于HTML5播放器，mpegts.js 1.7.3已经通过HTTP-FLV或HTTP-TS支持HEVC。
VLC和ffplay还通过HTTP-TS、SRT和HLS支持HEVC。对于媒体服务器，SRS 6通过RTMP、FLV、TS、HLS、SRT、WebRTC等支持HEVC。

在本教程中，我们介绍了几个月前刚添加了HEVC支持的FFmpeg 6。这是一个重要的发展，因为许多使用FFmpeg的工具现在可以通过
RTMP无需任何补丁就可以使用HEVC。

> Note: 如果您有兴趣了解 OBS 通过 RTMP 支持 HEVC，请阅读
> [如何通过 OBS 推送 RTMP 的 HEVC](./2023-04-08-Push-HEVC-via-RTMP-by-OBS.md)。

> Note: 请注意，SRS 6.0 已经支持 RTMP、HTTP-FLV、SRT、HTTP-TS、HLS、MPEG-DASH
> 和 WebRTC（Safari）的 HEVC（H.265），请参考 [H.265 直播节省 50% 成本](./2023-03-07-Lets-Do-H265-Live-Streaming.md)。

## Step 1: Run SRS Media Server

如果您需要创建自己的直播平台，可以使用支持通过RTMP使用HEVC的SRS媒体服务器。

要运行SRS，您可以使用Docker并使用以下命令：

```
docker run --rm -it -p 1935:1935 -p 8080:8080 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:6 \
    ./objs/srs -c conf/docker.conf
```

可以打开链接，检查是否正常启动：[http://localhost:8080](http://localhost:8080).

## Step 2: Publish by FFmpeg 6

如果您按照此[帖子](/docs/v6/doc/hevc#ffmpeg-tools)中的说明使用源代码编译了FFmpeg 6，
现在您可以使用FFmpeg发布RTMP HEVC流：

```bash
ffmpeg -stream_loop -1 -re -i doc/source.flv -acodec copy \
  -vcodec libx265 -f flv rtmp://localhost/live/livestream
```

请注意，需要确认你的代码，需要更新到这个Commit之后，才支持HEVC via RTMP
[637c761b](https://github.com/FFmpeg/FFmpeg/commit/637c761be1bf9c3e1f0f347c5c3a390d7c32b282):

```
commit 637c761be1bf9c3e1f0f347c5c3a390d7c32b282
Author: Steven Liu <liuqi05@kuaishou.com>
Date:   Mon Aug 28 09:59:24 2023 +0800

    avformat/rtmpproto: support enhanced rtmp
    
    add option named rtmp_enhanced_codec,
    it would support hvc1,av01,vp09 now,
    the fourcc is using Array of strings.
    
    Signed-off-by: Steven Liu <lq@chinaffmpeg.org>
```

SRS为FFmpeg 4和5版本提供了Docker支持，这使得可以通过RTMP实现HEVC直播。您可以方便地使用Docker直接发布您的实时流。

```bash
# For macOS
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -stream_loop -1 -re -i doc/source.flv -acodec copy \
    -vcodec libx265 -f flv rtmp://host.docker.internal/live/livestream

# For Linux
docker run --net=host --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -stream_loop -1 -re -i doc/source.flv -acodec copy \
    -vcodec libx265 -f flv rtmp://127.0.0.1/live/livestream
```

> Note: 如果要使用OBS，请从[这里](https://github.com/obsproject/obs-studio/releases)下载OBS 29+，
> 选择HEVC编解码器，请参阅[如何通过OBS推送HEVC RTMP直播](./2023-04-08-Push-HEVC-via-RTMP-by-OBS.md)了解详细信息。

## Step 3: Play by HTML5 Player

要在您的网络浏览器中播放HEVC流，您可以使用mpegts.js 1.7.3+版本播放HTTP-FLV或HTTP-TS。

SRS播放器已集成了mpegts.js，因此您只需打开URL即可播放HEVC流：

* HTTP-FLV(by H5):  [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true)

对于HLS流，hls.js不支持通过TS的HEVC。因此，您应该使用VLC或ffplay播放HLS流：

* HLS(by VLC or fflay): `http://localhost:8080/live/livestream.m3u8`

## Conclusion

由于OBS、FFmpeg和SRS媒体服务器等关键工具的支持，使用HEVC进行直播变得更加容易，使用户更容易从这种编解码器提供的带宽节省中受益。
按照本指南中的步骤，您可以使用HEVC和RTMP创建自己的直播平台，并使用像mpegts.js这样的HTML5播放器播放流，或者使用VLC和ffplay进行
HLS流播放。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/23-10-26-Unlock-the-Power-of-HEVC-via-RTMP)
