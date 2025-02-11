---
slug: push-hevc-via-rtmp-by-obs
title: SRS - 如何用OBS推送RTMP HEVC流
authors: []
tags: [hevc, rtmp, obs, live]
custom_edit_url: null
---

# How to Push HEVC via RTMP by OBS

> Written by [Winlin](https://github.com/winlinvip), [chundonglinlin](https://github.com/chundonglinlin)

OBS 29.1支持RTMP的HEVC，所以你现在可以用OBS和SRS做HEVC的直播了。

现在，RTMP支持HEVC出新标准了，详见[Enhanced RTMP](https://github.com/veovera/enhanced-rtmp)。
这个标准定义了一个新的codec ID，用于HEVC，即fourCC `hvc1`，
OBS和SRS都支持这个标准。

<!--truncate-->

> Note: Please see [#3495](https://github.com/ossrs/srs/pull/3495) and [#3464](https://github.com/ossrs/srs/issues/3464) for details.

请注意，SRS 6.0之前已经支持HEVC(H.265)了，包括SRT，HTTP-TS，HLS，MPEG-DASH和WebRTC(Safari)，
请参考[H.265 Live Streaming Saving 50% Cost](./2023-03-07-Lets-Do-H265-Live-Streaming.md)。

## Prerequisites

要使用RTMP的HEVC，你必须：

* 更新SRS到6.0.42+，或者使用最新的develop分支。
* 使用OBS 29.1+。你可以从[这里](https://github.com/obsproject/obs-studio/releases)下载beta版本。
* 对于H5播放器，SRS已经升级了[mpegjs.js](https://github.com/xqq/mpegts.js)到1.7.3+
* FFmpeg 6已经支持RTMP的HEVC。

## Usage

首先，直接使用Docker运行：

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:6 \
  ./objs/srs -c conf/hevc.flv.conf
```

然后，使用OBS推流，设置如下：

* 服务器: `rtmp://localhost/live`
* 流密钥: `livestream`
* 编码：HEVC硬件编码

> Note: HEVC软件编码器性能太差，编不动，会导致卡顿。

![](/img/blog-2023-04-08-001.png)

![](/img/blog-2023-04-08-002.png)

现在，你可以使用H5播放器播放了，如下：
[http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html).

如果需要用HLS或HTTP-TS播放，开启对应的SRS配置即可。

## What’s Next

SRS支持HEVC WebRTC，支持的是Safari浏览器，但SRS不支持HEVC over RTMP转WebRTC，我们正在开发中了。

OBS HEVC软件编码器性能太差，编不动，会导致卡顿。

## Conclusion

这篇文章介绍了如何用OBS推送HEVC RTMP流。

尽管还有一些工作要做，但是这是非常关键的进展了，HEVC更加完善了。

这文章是我们和Github Copilot一起写的。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/23-04-08-Push-HEVC-via-RTMP-by-OBS)

