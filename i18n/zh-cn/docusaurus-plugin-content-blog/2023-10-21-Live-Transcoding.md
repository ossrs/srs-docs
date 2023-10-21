---
slug: Live-Transcoding
title: SRS Stack - 直播转码降低带宽并节约成本
authors: []
tags: [live streaming, transcode, srs, ffmpeg]
custom_edit_url: null
---

# Efficient Live Streaming Transcoding for Reducing Bandwidth and Saving Costs

## Introduction

在当今的数字世界中，直播流已成为企业、内容创作者和个人的必备工具。随着越来越多的观众收看直播，优化直播流体验变得至关重要，
无论观众的网络速度或设备性能如何。实现这一目标的有效方法之一是通过直播转码，这个过程可以在不影响视频质量的情况下降低带宽并节省成本。
在这篇博客中，我们将探讨使用 SRS Stack 进行高效直播转码的好处，以及它如何带来显著的成本节省。

<!--truncate-->

直播转码涉及将 SRS Stack 使用 FFmpeg 转换的直播流转换为不同的比特率和分辨率，然后将其推送回 SRS Stack。这个过程通过降低流的
比特率来降低带宽，同时保持相同的分辨率。因此，整体观看带宽减少，为流媒体提供者和观众节省成本。

例如，考虑一个有 10,000 名观众观看相同 2Mbps 比特率流的直播场景。通过将流转码为 1Mbps，所需带宽减少到 10Gbps，节省了 50% 的成本。
这不仅使内容提供商受益，还确保了具有不同网络速度和设备的观众获得更流畅的观看体验。

请继续关注我们对直播转码世界的深入探讨，并学习如何利用 SRS Stack 的力量优化您的直播体验并节省成本。

## Step 1: Create SRS Stack by one click

创建 SRS Stack 很简单，只需点击一下，如果您使用 Digital Ocean droplet，就可以完成。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-SRS-Stack-Tutorial.md)了解详细信息。

您还可以使用 Docker 通过单个命令行创建 SRS Stack：

```bash
docker run --rm -it --name srs-stack -v $HOME/data:/data \
  -p 2022:2022 -p 2443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建 SRS Stack 后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Publish a Live Stream to SRS Stack

您可以使用 OBS 或 FFmpeg 将直播流发布到 SRS Stack。您还可以设置 HTTPS 并通过 WebRTC 发布。

![](/img/blog-2023-10-21-04.png)

发布流后，您可以使用 H5 播放器或 VLC 预览它。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-SRS-Stack-Tutorial.md)了解详细信息。

## Step 3: Transcode the Live Stream to Lower Bitrate

假设您使用 OBS 将 8Mbps 流发送到 SRS Stack，并且您无法在 OBS 中调整比特率。这可能是因为流是由您无法控制的供应商发布的，
或者您需要记录原始高分辨率流，或者某些设备（如 4K/8K 电视）需要高分辨率流。

然而，您的大多数观众在移动设备上观看直播，他们不需要 8Mbps 流。对于移动设备来说，2Mbps 流就足够了，他们的带宽可能只支持 
2Mbps 比特率。在这种情况下，您可以使用转码将 8Mbps 流转换为 2Mbps 直播流。

![](/img/blog-2023-10-21-05.png)

转码流后，您可以预览 2Mbps 版本或将其转发到另一个直播平台。
请参阅[如何做RTSP监控摄像头直播](./2023-10-11-Stream-IP-Camera-Events.md)
了解更多信息。您还可以从 SRS Stack 拉取 RTMP 流并将其转发到其他地方。

## Check Transcoding Status

您可以在 SRS Stack 仪表板中检查转码状态。

![](/img/blog-2023-10-21-06.png)

您可以点击预览链接检查转码流，或将其转发到另一个直播平台。
请参阅[如何做RTSP监控摄像头直播](./2023-10-11-Stream-IP-Camera-Events.md)
了解更多信息。

## 结论

总之，我们讨论了使用 SRS Stack 和 FFmpeg 进行直播转码的好处。转码优化了具有不同网络速度和设备的观众的流媒体观看体验，
减少了带宽使用并节省了成本。我们介绍了设置 SRS Stack 和 FFmpeg、创建配置文件以及将转码流推送回 SRS Stack 的方法。
监控和调整设置对于实现最佳观众体验至关重要，转码还可以将高分辨率流转换为适用于移动设备的较低分辨率。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-10-21-Live-Transcoding)
