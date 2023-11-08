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
* FFmpeg 6 support HEVC via RTMP.

## Usage

First, run SRS in docker:

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 ossrs/srs:6 \
  ./objs/srs -c conf/hevc.flv.conf
```

Next, start OBS with the following settings in the `Settings > Stream` tab:

* Server: `rtmp://localhost/live`
* Stream Key: `livestream`
* Encoder: Please select the HEVC hardware encoder.

> Note: Please note that the HEVC software encoder is too slow to encode the video, so it causes the video laggy.

![](/img/blog-2023-04-08-001.png)

![](/img/blog-2023-04-08-002.png)

Now, open the web page to play the HTTP-FLV live stream: 
[http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html).

You can also play the HLS, DASH or HTTP-TS live stream, after you enable the HLS or HTTP-TS in the config file.

## What's Next

Although SRS supports HEVC via WebRTC for Safari, but SRS doesn't support converting the HEVC via RTMP to WebRTC.
We're working on it now.

The OBS HEVC software encoder is too slow to encode the video, so it causes the video laggy.

## TRTC Cloud Service

We also recommend our [TRTC cloud service](https://trtc.io/register?utm_source=community&utm_medium=ossrs&utm_campaign=OBS-WHIP-TRTC&_channel_track_key=K7mXPmCZ), 
because it supports global network acceleration, improved congestion control algorithms, better performance on weak networks, 
client SDKs for all platforms, and a monthly free quota. Click [here](https://ossrs.io/trtc/demo?utm_source=community&utm_medium=ossrs&utm_campaign=OBS-WHIP-TRTC&_channel_track_key=lfJKyOlF)
to view the online demo. If you have any questions, please join our [Discord](https://discord.gg/DCCH6HyhuT) channel
to contact us.

## Conclusion

In this article, we introduced how to push HEVC via RTMP by OBS.

Although there are still some works to do, it's already a big step for HEVC live streaming.

We wrote this article with the help of GitHub Copilot.

## Contact

Welcome for more discussion at [discord](https://discord.gg/bQUPDRqy79).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-en/23-04-08-Push-HEVC-via-RTMP-by-OBS)

