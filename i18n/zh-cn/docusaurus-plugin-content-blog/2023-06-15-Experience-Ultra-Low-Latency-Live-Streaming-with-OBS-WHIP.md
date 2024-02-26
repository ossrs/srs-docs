---
slug: Experience-Ultra-Low-Latency-Live-Streaming-with-OBS-WHIP
title: SRS Server - 体验OBS WHIP超低延迟直播！
authors: []
tags: [srs, obs, whip]
custom_edit_url: null
---

# Ultra-Low Latency Streaming with OBS WHIP: New Features & Stable Performance!

OBS现在支持WHIP功能，最近已经合并了这个补丁。这使得OBS WHIP具有各种新功能和可能性，
因为延迟从1秒降低到200毫秒。

在没有OBS WHIP的情况下，您可以使用RTMP+WebRTC进行直播，这将导致大约500ms的延迟。
然而，通过使用OBS WHIP，您可以实现低延迟直播，延迟大约为200ms。

<!--truncate-->

此外，即使在网络连接不佳或通过互联网进行流媒体传输的情况下，OBS WHIP也能保持稳定的
低延迟。

在这个视频中，我将演示如何轻松地将OBS WHIP与SRS结合使用，只需三个简单的步骤。

SRS Stack还支持OBS WHIP，使您只需点击一下即可建立WHIP服务。
请参考[为OBS快速构建公网WHIP服务](./2023-12-12-SRS-Stack-OBS-WHIP-Service.md)。

You can also watch the video on YouTube: [Ultra Low Latency Streaming with OBS WHIP](https://youtu.be/SqrazCPWcV0)

## Prerequisites

请在继续操作之前安装以下软件：

- [OBS Studio](https://obsproject.com/download)

> 注意：OBS WHIP已经合并到主分支，将在OBS 30版本中支持该功能。
> 您可以从[这里](https://github.com/obsproject/obs-studio/releases/tag/30.0.0-rc1)下载。

## Step 1: Run SRS

运行以下命令以启动SRS：

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    ossrs/srs:5 ./objs/srs -c conf/rtmp2rtc.conf
```

> Note: 请将 CANDIDATE 设置为你的 IP 地址。关于如何设置CANDIDATE, 请参考[CANDIDATE](../docs/v5/doc/webrtc#config-candidate)

有关配置详细信息，请参考[这里](../docs/v5/doc/getting-started#webrtc-for-live-streaming)。

## Step 2: Run OBS

打开OBS并单击`Settings`以进行以下配置：

1. 打开OBS并单击**Settings**。
1. 单击左侧边栏上的**Stream**。
1. 选择`WHIP`作为**Service**。
1. 将**Server**设置为`http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream`。
1. 单击**OK**以保存设置。
1. 单击**Start Streaming**以开始直播。

![](/img/blog-2023-06-15-011.png)

## Step 3: Play the Stream

在浏览器中打开以下网址以播放流媒体：

[http://localhost:8080/players/whep.html](http://localhost:8080/players/whep.html)

![](/img/blog-2023-06-15-012.png)

## Cloud Service and Support

我测试了 TRTC 云服务，它与 OBS WHIP 配合得非常好。如果您正在寻找一个提供 24/7 支持的 
WHIP 云服务，我强烈建议尝试 TRTC。要查看演示，请点击[这里](https://tencent-rtc.github.io/obs-trtc/)。

## Conclusion

在本教程中，我们探讨了 OBS WHIP 的超低延迟直播功能，并演示了如何在仅需三个简单步骤的
情况下将其与 SRS 配置。OBS WHIP 显著降低了延迟，使其成为低延迟直播的绝佳选择。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-06-15-Experience-Ultra-Low-Latency-Live-Streaming-with-OBS-WHIP)

