---
slug: experience-ultra-low-latency-live-streaming-with-obs-whip
title: Experience Ultra-Low Latency Live Streaming with OBS WHIP!
authors: []
tags: [srs, obs, whip]
custom_edit_url: null
---

# Ultra-Low Latency Streaming with OBS WHIP: New Features & Stable Performance!

OBS now features WHIP support, with the patch having been recently merged. This enables 
various new functions and possibilities with OBS WHIP, as the latency drops from 1 second 
to 200 milliseconds.

Without OBS WHIP, you can employ RTMP+WebRTC for live streaming, which results in a latency 
of approximately 500ms. However, by using OBS WHIP, you can achieve low-latency live 
streaming with a latency of around 200ms.

<!--truncate-->

Furthermore, even in situations with poor network connections or when streaming over the 
internet, OBS WHIP maintains a consistently low and stable latency.

In this video, I will demonstrate how to effortlessly utilize OBS WHIP with SRS in just 
three simple steps.

You can also watch the video on YouTube: [Ultra Low Latency Streaming with OBS WHIP](https://youtu.be/SqrazCPWcV0)

## Prerequisites

Please install the following software before proceeding:

- [OBS Studio](https://obsproject.com/download)

> Note: Currently, OBS WHIP has been merged into the master branch but has not been released yet.
> You can login GitHub and download it from [here](https://github.com/obsproject/obs-studio/actions/runs/5227109208?pr=7926).

## Step 1: Run SRS

Run the following command to start SRS:

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    ossrs/srs:5 ./objs/srs -c conf/rtmp2rtc.conf
```

> Note: Please set the CANDIDATE to your own IP. About CANDIDATE, please read [CANDIDATE](/docs/v5/doc/webrtc#config-candidate)

For configuration details, refer to [this post](/docs/v5/doc/getting-started#webrtc-for-live-streaming).

## Step 2: Run OBS

Open OBS and click `Settings` to configure the following:

1. Open OBS and click **Settings**.
1. Click **Stream** on the left sidebar.
1. Select `WHIP` for **Service**.
1. Set the **Server** to `http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream`.
1. Click **OK** to save the settings.
1. Click **Start Streaming** to start streaming.

![](/img/blog-2023-06-15-011.png)

## Step 3: Play the Stream

Open the following URL in your browser to play the stream:

[http://localhost:8080/players/whep.html](http://localhost:8080/players/whep.html)

![](/img/blog-2023-06-15-012.png)

## Cloud Service and Support

I tested the TRTC cloud service and it works great with OBS WHIP. If you're looking for 
a WHIP cloud service that has 24/7 support, I definitely suggest trying TRTC. To see a 
demo, click [here](https://tencent-rtc.github.io/obs-trtc/).

## Conclusion

In this tutorial, we explored the ultra-low latency live streaming capabilities of OBS WHIP and 
demonstrated how to set it up with SRS in just three simple steps. OBS WHIP significantly reduces 
latency, making it an excellent option for low-latency live streaming.

If you're interested in discussing SRS, feel free to join us on [Discord](https://discord.gg/yZ4BnPmHAd).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-en/2023-06-15-Experience-Ultra-Low-Latency-Live-Streaming-with-OBS-WHIP)
