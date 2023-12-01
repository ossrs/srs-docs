---
slug: Stream-IP-Camera-Events
title: SRS Stack - Easily Stream Your RTSP IP Camera to YouTube, Twitch, or Facebook
authors: []
tags: [live streaming, virual live events, srs, ip camera, rtsp]
custom_edit_url: null
---

# Easily Stream Your RTSP IP Camera to YouTube, Twitch, or Facebook

## Introduction

Do you have an IP camera that supports only the RTSP protocol and want to stream it to YouTube, Twitch, 
or Facebook? The simplest solution is to use SRS Stack. With just one click, you can stream your IP 
camera to these platforms for continuous 24/7 streaming.

<!--truncate-->

How to change IP Camera's RTSP stream to RTMP/RTMPS for live streaming platforms? You can use OBS or 
SRS Stack. OBS requires a device, while SRS Stack works on a cloud server and in the backend. See the 
workflow below.

```bash
IP Camera ---RTSP---> OBS or SRS Stack ---RTMP/RTMPS---> YouTube, Twitch, or Facebook
```

SRS Stack helps you connect multiple IP cameras and stream live to various platforms, making your live 
streaming experience stronger.

## Step 1: Create SRS Stack by one click

Creating an SRS Stack is simple and can be done with just one click if you use Digital Ocean droplet.
Please see [How to Setup a Video Streaming Service by 1-Click](./2022-04-09-SRS-Stack-Tutorial.md) for detail.

You can also use Docker to create an SRS Stack with a single command line:

```bash
docker run --rm -it -p 2022:2022 -p 2443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data ossrs/srs-stack:5
```

After creating the SRS Stack, you can access it through `http://your-server-ip/mgmt`.

## Step 2: Pull RTSP Stream from IP Camera

Once you've created your SRS Stack, open the dashboard and navigate to `Scenarios > VirtualLive > YouTube`. 
Click on `Forward stream`, input the RTSP url, and then click `Submit`.

![](/img/blog-2023-10-11-01.png)

## Step 3: Stream IP Camera to YouTube

To stream your file to YouTube, copy the Stream URL and Stream key from your YouTube [Go live](https://studio.youtube.com/channel/UC/livestreaming) page.

![](/img/blog-2023-10-11-02.png)

Open the SRS Stack dashboard and click on `Scenarios > VirtualLive > YouTube`. And click `Start Virtual Live` in SRS Stack.

![](/img/blog-2023-10-11-03.png)

Your stream will now be published on YouTube.

![](/img/blog-2023-10-11-04.png)

## Step 4: Check virtual live status

To monitor the status of your virtual live event, simply check the dashboard. You'll be able to see the status of all your virtual live events, ensuring that everything is running smoothly.

![](/img/blog-2023-10-11-05.png)

## Step 5: Stream IP Camera to Twitch

After setup RTSP stream, you can stream your IP Camera to Twitch, copy the Stream key from your 
Twitch [Dashboard](https://www.twitch.tv/dashboard/settings) under `Settings > Stream`.

![](/img/blog-2023-10-11-06.png)

Open the SRS Stack dashboard and click on `Scenarios > VirtualLive > Twitch`. Click `Start Virtual Live` in SRS Stack.

![](/img/blog-2023-10-11-07.png)

And your stream will be published on Twitch in the [Stream Manager](https://www.twitch.tv/dashboard/stream).

![](/img/blog-2023-10-11-08.png)

## Step 5: Stream IP Camera to Facebook

After setup RTSP stream, you can stream your IP Camera to Facebook, copy the Stream key from your 
Facebook [Live Producer](https://www.facebook.com/live/producer?ref=OBS) page,
then click `Go live`, and select `Streaming software`.

![](/img/blog-2023-10-11-09.png)

![](/img/blog-2023-10-11-10.png)

Open the SRS Stack dashboard and click on `Scenarios > VirtualLive > Facebook`. Click `Start Virtual Live` in SRS Stack, and your stream will be published on Facebook.

![](/img/blog-2023-10-11-11.png)

![](/img/blog-2023-10-11-12.png)

![](/img/blog-2023-10-11-13.png)

## Cloud Service

At SRS, our goal is to establish a non-profit, open-source community dedicated to creating an all-in-one, 
out-of-the-box, open-source video solution for live streaming and WebRTC online services.

Additionally, we offer a [cloud](/cloud) service for those who prefer to use cloud service instead of building from 
scratch. Our cloud service features global network acceleration, enhanced congestion control algorithms, 
client SDKs for all platforms, and some free quota.

To learn more about our cloud service, click [here](/docs/v6/doc/cloud).

## Conclusion

In conclusion, streaming your RTSP IP camera to popular platforms like YouTube, Twitch, or Facebook has never 
been easier, thanks to SRS Stack. With just a few simple steps, you can set up your IP camera for continuous 
24/7 streaming on these platforms. By utilizing SRS Stack, you can also connect multiple IP cameras and stream 
live to various platforms, enhancing your live streaming experience. So, go ahead and give SRS Stack a try, and 
enjoy the convenience and flexibility it offers for your IP camera streaming needs.

## Contact

Welcome for more discussion at [discord](https://discord.gg/bQUPDRqy79).

![](https://ossrs.io/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-en/2023-10-11-Stream-IP-Camera-Events)
