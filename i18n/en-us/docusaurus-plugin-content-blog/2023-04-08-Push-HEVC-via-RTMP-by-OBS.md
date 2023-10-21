---
slug: push-hevc-via-rtmp-by-obs
title: SRS Server - How to Push HEVC via RTMP by OBS
authors: []
tags: [hevc, rtmp, obs, live]
custom_edit_url: null
---

# How to Push HEVC via RTMP by OBS

> Written by [Winlin](https://github.com/winlinvip), [chundonglinlin](https://github.com/chundonglinlin)

OBS 29.1 supports HEVC via RTMP, so you can do HEVC live stream by OBS and SRS now.

There is a new specification for HEVC via RTMP, please see [Enhanced RTMP](https://github.com/veovera/enhanced-rtmp).
This specification defines a new codec ID for HEVC, which uses fourCC `hvc1`,
both OBS and SRS support it.

<!--truncate-->

> Note: Please see [#3495](https://github.com/ossrs/srs/pull/3495) and [#3464](https://github.com/ossrs/srs/issues/3464) for details.

Please note that SRS 6.0 had already HEVC(H.265) support for SRT, HTTP-TS, HLS, MPEG-DASH and WebRTC(Safari), 
please refer to [H.265 Live Streaming Saving 50% Cost](./2023-03-07-Lets-Do-H265-Live-Streaming.md).

## Prerequisites

To use HEVC via RTMP, you must:

* Update SRS to 6.0.42+, or use the latest develop branch.
* Use OBS 29.1+. You can download the beta version from [here](https://github.com/obsproject/obs-studio/releases).
* For H5 player, SRS has already upgraded the [mpegjs.js](https://github.com/xqq/mpegts.js) to 1.7.3+
* FFmpeg doesn't support HEVC via RTMP yet, but some of the maintainers are working on it now.

## Usage

First, download and build SRS:

```bash
git clone http://github.com/ossrs/srs.git
cd srs/trunk
./configure --h265=on
make
```

Then, start SRS, please make sure the SRS version is 6.0.42+:

```bash
./objs/srs -c conf/http.ts.live.conf
```

Next, start OBS with the following settings in the `Settings > Stream` tab:

* Server: `rtmp://localhost/live`
* Stream Key: `livestream`
* Encoder: Please select the HEVC hardware encoder.

> Note: Please note that the HEVC software encoder is too slow to encode the video, so it causes the video laggy.

![](/img/blog-2023-04-08-001.png)

![](/img/blog-2023-04-08-002.png)

Now, open the web page to play the HTTP-TS live stream: 
[http://localhost:8080/live/livestream.ts](http://localhost:8080/players/srs_player.html?stream=livestream.ts).

You can also play the HLS, DASH or HTTP-FLV live stream, after you enable the HLS or HTTP-FLV in the config file.

## What's Next

FFmpeg doesn't support HEVC via RTMP yet, but some of the maintainers are working on it now.
However, there is a tutorial to patch FFmpeg, please see [here](http://claire-chang.com/2023/03/09/%e7%82%basrs6%e7%b7%a8%e8%ad%af%e6%94%af%e6%8c%81http-flv%e7%9a%84ffmpeg%e6%aa%94%e6%a1%88/).

Besides, although SRS supports HEVC via WebRTC for Safari, but SRS doesn't support converting the HEVC via RTMP to WebRTC.
We're working on it now.

The OBS HEVC software encoder is too slow to encode the video, so it causes the video laggy.

## Conclusion

In this article, we introduced how to push HEVC via RTMP by OBS.

Although there are still some works to do, it's already a big step for HEVC live streaming.

We wrote this article with the help of GitHub Copilot.

Welcome for more discussion at [discord](https://discord.gg/bQUPDRqy79).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-en/23-04-08-Push-HEVC-via-RTMP-by-OBS)

