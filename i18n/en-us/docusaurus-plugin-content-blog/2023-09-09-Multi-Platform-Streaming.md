---
slug: Multi-Platform-Streaming
title: SRS Stack - Maximize Your Live Streaming Reach - A Guide to Multi-Platform Streaming
authors: []
tags: [live streaming, multi-platform streaming, restreaming]
custom_edit_url: null
---

# Maximize Your Live Streaming Reach: A Comprehensive Guide to Multi-Platform Streaming with SRS Stack

In today's digital world, live streaming has become an essential tool for businesses, content creators, and individuals to engage with their audiences. With the increasing popularity of various live streaming platforms like YouTube, Twitch, and Facebook, it has become crucial to stream your content on multiple platforms simultaneously to reach a wider audience. This blog will guide you through the process of live streaming to multiple platforms using SRS Stack.

<!--truncate-->

SRS Stack is a powerful and easy-to-use solution that allows you to live stream to multiple platforms with just a few clicks. It also enables you to stream to your own platform or even set up an intranet live stream within your company. Let's dive into the steps to set up live streaming on multiple platforms using SRS Stack.

### Step 1: Create SRS Stack by one click

Creating an SRS Stack is simple and can be done with just one click if you use Digital Ocean droplet.
Please see [How to Setup a Video Streaming Service by 1-Click](./2022-04-09-SRS-Stack-Tutorial.md) for detail.

You can also use Docker to create an SRS Stack with a single command line:

```bash
docker run --rm -it -p 2022:2022 -p 2443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data ossrs/srs-stack:5
```

After creating the SRS Stack, you can access it through `http://your-server-ip/mgmt`.

### Step 2: Publish a live stream to SRS Stack

You can use OBS or FFmpeg to publish a live stream to SRS Stack. You can also set up HTTPS and publish via WebRTC.

![](/img/blog-2022-04-09-01.png)

Once the stream is published, you can preview it using an H5 player or VLC.
Please see [How to Setup a Video Streaming Service by 1-Click](./2022-04-09-SRS-Stack-Tutorial.md) for detail.

### Step 3: Forward to YouTube

To forward your stream to YouTube, copy the Stream URL and Stream key from your YouTube [Go live](https://studio.youtube.com/channel/UC/livestreaming) page.

![](/img/blog-2023-09-09-01.png)

Open the SRS Stack dashboard and click on `Scenarios > Forward > YouTube`. And click `Start Forward` in SRS Stack.

![](/img/blog-2023-09-09-02.png) 

Your stream will now be published on YouTube.

![](/img/blog-2023-09-09-03.png)

### Step 4: Forward to Twitch

To forward your stream to Twitch, copy the Stream key from your Twitch [Dashboard](https://www.twitch.tv/dashboard/settings) under `Settings > Stream`.

![](/img/blog-2023-09-09-04.png)

Open the SRS Stack dashboard and click on `Scenarios > Forward > Twitch`. Click `Start Forward` in SRS Stack.

![](/img/blog-2023-09-09-05.png)

And your stream will be published on Twitch in the [Stream Manager](https://www.twitch.tv/dashboard/stream).

![](/img/blog-2023-09-09-06.png)

### Step 5: Forward to Facebook

To forward your stream to Facebook, copy the Stream key from your Facebook [Live Producer](https://www.facebook.com/live/producer?ref=OBS) page,
then click `Go live`, and select `Streaming software`. 

![](/img/blog-2023-09-09-07.png)

![](/img/blog-2023-09-09-08.png)

Open the SRS Stack dashboard and click on `Scenarios > Forward > Facebook`. Click `Start Forward` in SRS Stack, and your stream will be published on Facebook.

![](/img/blog-2023-09-09-09.png)

![](/img/blog-2023-09-09-10.png)

![](/img/blog-2023-09-09-11.png)

### Step 6: Check Multiple Streaming Status

After publishing your stream on all platforms, you can check the multiple streaming status in the SRS Stack dashboard.

![](/img/blog-2023-09-09-12.png)

## TRTC Cloud Service

We also recommend the TRTC cloud services, because it supports global network acceleration, improved congestion control
algorithms, better performance on weak networks, client SDKs for all platforms, and a monthly free quota. Click
[here](https://ossrs.io/trtc/demo?utm_source=community&utm_medium=ossrs&utm_campaign=OBS-WHIP-TRTC&_channel_track_key=lfJKyOlF)
to view the online demo. If you have any questions, please join our [Discord](https://discord.gg/DCCH6HyhuT) channel
to contact us.

### Conclusion

Live streaming to multiple platforms is an effective way to reach a broader audience and increase engagement. 
SRS Stack makes this process simple and efficient, allowing you to focus on creating quality content while it takes 
care of the technical aspects. By following the steps outlined in this blog, you can easily set up live streaming 
on multiple platforms like YouTube, Twitch, and Facebook, and take your content to the next level.

## Contact

Welcome for more discussion at [discord](https://discord.gg/bQUPDRqy79).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-en/2023-09-09-Multi-Platform-Streaming)
