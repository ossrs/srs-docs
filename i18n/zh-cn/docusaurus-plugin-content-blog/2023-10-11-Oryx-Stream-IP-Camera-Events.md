---
slug: Stream-IP-Camera-Events
title: Oryx - 如何做RTSP监控摄像头直播
authors: []
tags: [live streaming, virual live events, srs, ip camera, rtsp]
custom_edit_url: null
---

# Easily Stream Your RTSP IP Camera to Live Streaming

## Introduction

您是否拥有一台仅支持 RTSP 协议的 IP 摄像头，并希望将其流式传输到视频号直播、B站和快手等各种直播平台？最简单的解决方案是使用 
Oryx。只需点击一下，您就可以将 IP 摄像头流式传输到这些平台，实现 24/7 不间断直播。

<!--truncate-->

如何将IP摄像头的RTSP流转换为RTMP/RTMPS以用于直播平台？您可以使用OBS或Oryx。 OBS需要一个设备，而Oryx则在云服务器
上运行并在后端工作。请参阅下面的工作流程。

```bash
IP Camera ---RTSP---> OBS or Oryx ---RTMP/RTMPS---> 视频号、B站和快手
```

Oryx 可帮助您连接多个 IP 摄像头并在各种平台上进行实时直播，使您的直播体验更加强大。

### Step 1: Create Oryx by One Click

如果您使用腾讯云轻量服务器，只需点击一下即可创建Oryx。请参考 [Oryx - 起步、购买和入门](./2022-04-09-Oryx-Tutorial.md) 这个博客。

您还可以使用Docker通过单个命令行创建Oryx：

```bash
docker run --rm -it -p 80:2022 -p 443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建Oryx后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Pull RTSP Stream from IP Camera

创建Oryx后，打开后台，点击`应用场景 > 虚拟直播 > 视频号直播`，然后点击`拉流转推`，输入RTSP流地址，然后点击`确认`。

![](/img/blog-2023-10-11-21.png)

转发RTSP流时，Oryx会自动为您生成一个静音音轨。

## Step 2.1: (Optional) Enable Extra Silent Audio Track

如果您的摄像头仅提供视频流，则必须启用额外的静音音轨，否则，发布到像视频号这样的直播平台将失败。
Oryx可以为您自动生成静音音轨。请选择`静音音频流`选项。

![](/img/blog-2023-10-11-29.png)

## Step 3: Stream IP Camera to WeChat

若需要虚拟直播到视频号直播，请先在[视频号直播](https://channels.weixin.qq.com/platform/live/liveBuild)后台，创建直播。
然后，复制服务器地址和密钥。

![](/img/blog-2023-10-11-22.png)

请打开Oryx仪表板，然后单击`应用场景 > 虚拟直播 > 视频号直播`，然后在Oryx中单击`开始直播`。

![](/img/blog-2023-10-11-23.png)

您的流现在将在视频号直播上发布。

![](/img/blog-2023-10-11-24.png)

### Step 4: Stream IP Camera to Bilibili

若需要虚拟直播到B站直播，请先在[B站直播](https://link.bilibili.com/p/center/index#/my-room/start-live)后台，创建直播。
然后，复制服务器地址和密钥。

![](/img/blog-2023-10-11-25.png)

请打开Oryx仪表板，然后单击`应用场景 > 虚拟直播 > B站直播`，然后在Oryx中单击`开始直播`。

![](/img/blog-2023-10-11-26.png)

您的流现在将在B站直播上发布。

![](/img/blog-2023-10-11-27.png)

### Step 5: Stream IP Camera to Custom

你也可以将流转给任意平台，甚至可以转给Oryx自己，在`应用场景 > 私人直播间`中复制服务器地址和密钥。

请打开Oryx仪表板，然后单击`应用场景 > 虚拟直播 > 自定义平台`，然后在Oryx中单击`开始直播`。

![](/img/blog-2023-10-11-28.png)

您的流现在将在自定义平台上发布。

## Conclusion

总之，通过Oryx，将您的RTSP IP摄像头流式传输到视频号直播、B站和快手等热门平台从未如此简单。只需几个简单的步骤，
您就可以在这些平台上为您的IP摄像头设置连续24/7的流式传输。通过使用Oryx，您还可以连接多个IP摄像头并实时流式传输到各种平台，
从而增强您的实时流式传输体验。所以，请尝试使用Oryx，并享受它为您的IP摄像头流式传输需求提供的便利和灵活性。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-10-11-Stream-IP-Camera-Events)
