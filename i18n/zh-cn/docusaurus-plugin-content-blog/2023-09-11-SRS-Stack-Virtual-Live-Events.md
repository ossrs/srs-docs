---
slug: Virtual-Live-Events
title: SRS Stack - 虚拟直播和无人直播间
authors: []
tags: [live streaming, virual live events, srs]
custom_edit_url: null
---

# Virtual Live Events: Revolutionizing the Way We Experience Entertainment

## Introduction

虚拟直播是指将录制的视频文件，或者设备，或者网络流，转成直播推送到直播平台。比如在电商直播中，可以先录制好直播内容，商品的讲解。
比如在教育直播中，可以预先录制课程，在直播间播放课程。比如在线演讲和分享，可以将提前录制的内容在直播间播放。

虚拟直播让主播可以有充分的准备时间，让直播内容更加精美，可以避免经验不足的主播的焦虑，可以避免主播网络问题，可以7x24小时在
直播间做直播，可以触达更多的观众，可以让直播有更多的可能性。

<!--truncate-->

SRS Stack使您只需点击一次即可创建虚拟直播，并将其广播到多个平台，如视频号直播、B站和快手等各种直播平台。在这篇博客文章中，
我们将指导您如何使用SRS Stack创建虚拟直播。

在如今快节奏的世界中，由于所提供的便利性，虚拟直播正变得越来越受欢迎。无论是音乐会、足球比赛还是在线课程，您现在都可以使用视频文件创建虚拟直播，使其更具互动性并能触及更广泛的受众。

### Step 1: Create SRS Stack by one click

如果您使用腾讯云轻量服务器，只需点击一下即可创建SRS Stack。请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

您还可以使用Docker通过单个命令行创建SRS Stack：

```bash
docker run --rm -it -p 2022:2022 -p 2443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建SRS Stack后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Upload your video file

创建SRS Stack后，打开后台，点击`应用场景 > 虚拟直播 > 视频号直播`，然后点击`Choose File`，选择您的视频文件，然后点击`上传文件`。

![](/img/blog-2023-09-11-21.png)

## Step 3: Stream file to WeChat

若需要虚拟直播到视频号直播，请先在[视频号直播](https://channels.weixin.qq.com/platform/live/liveBuild)后台，创建直播。
然后，复制服务器地址和密钥。

![](/img/blog-2023-09-11-22.png)

请打开SRS Stack仪表板，然后单击`应用场景 > 虚拟直播 > 视频号直播`，然后在SRS Stack中单击`开始直播`。

![](/img/blog-2023-09-11-23.png)

您的流现在将在视频号直播上发布。

![](/img/blog-2023-09-11-24.png)

### Step 4: Stream file to Bilibili

若需要虚拟直播到B站直播，请先在[B站直播](https://link.bilibili.com/p/center/index#/my-room/start-live)后台，创建直播。
然后，复制服务器地址和密钥。

![](/img/blog-2023-09-11-25.png)

请打开SRS Stack仪表板，然后单击`应用场景 > 虚拟直播 > B站直播`，然后在SRS Stack中单击`开始直播`。

![](/img/blog-2023-09-11-26.png)

您的流现在将在B站直播上发布。

![](/img/blog-2023-09-11-27.png)

### Step 5: Stream file to Custom

你也可以将流转给任意平台，甚至可以转给SRS Stack自己，在`应用场景 > 私人直播间`中复制服务器地址和密钥。

请打开SRS Stack仪表板，然后单击`应用场景 > 虚拟直播 > 自定义平台`，然后在SRS Stack中单击`开始直播`。

![](/img/blog-2023-09-11-28.png)

您的流现在将在自定义平台上发布。

## (Optional) Upload Video File by Other Tools

您还可以使用 FTP 或 SCP 等工具将视频文件上传到 `/data/upload` 文件夹。然后选择 `Use server file`，
输入视频文件的路径，并将其用作虚拟直播源。

这种方法使您能够上传非常大的文件，尤其是当基于网页的上传失败时。通过使用专业的上传工具，您可以继续上传或
通过多线程等功能加快上传过程。

## Conclusion

总之，虚拟直播活动为在各种平台上播放预先录制的内容提供了便捷高效的方式，使其更加精致且触及更广泛的受众。通过减轻对于新手
直播者的焦虑并实现7x24直播，虚拟直播活动为各行各业带来了诸多可能性。SRS Stack 简化了创建和播放这些活动的过程，
满足了当今快节奏世界对这种互动体验的日益增长的需求。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-zh/2023-09-11-Virtual-Live-Events)
