---
slug: Multi-Platform-Streaming
title: SRS Stack - 如何实现多平台转播
authors: []
tags: [live streaming, multi-platform streaming, restreaming]
custom_edit_url: null
---

# Maximize Your Live Streaming Reach: A Comprehensive Guide to Multi-Platform Streaming with SRS Stack

在当今的数字世界中，直播已成为企业、内容创作者和个人与受众互动的重要工具。随着视频号直播、B站和快手等各种直播平台的日益普及，同时在多个平台上播放内容已变得至关重要，以便触及更广泛的受众。本博客将指导您使用SRS Stack在多个平台上进行直播。

<!--truncate-->

SRS Stack是一种功能强大且易于使用的解决方案，只需点击几下鼠标即可在多个平台上进行直播。它还允许您将内容流式传输到自己的平台，甚至在公司内部设置内部网直播。让我们深入了解如何使用SRS Stack在多个平台上设置直播。

### Step 1: Create SRS Stack by one click

如果您使用腾讯云轻量服务器，只需点击一下即可创建SRS Stack。请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

您还可以使用Docker通过单个命令行创建SRS Stack：

```bash
docker run --rm -it -p 2022:2022 -p 2443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建SRS Stack后，您可以通过 `http://your-server-ip/mgmt` 访问它。

### Step 2: Publish a live stream to SRS Stack

您可以使用OBS或FFmpeg将直播发布到SRS Stack。您还可以设置HTTPS并通过WebRTC发布。发布流后，您可以使用H5播放器或VLC预览它。

![](/img/blog-2023-09-09-13.png)

推流到SRS Stack后，你可以用网页预览它，也可以用VLC播放。
请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

### Step 3: Forward to WeChat

要将流转发到视频号直播，请先在[视频号直播](https://channels.weixin.qq.com/platform/live/liveBuild)后台，创建直播。
然后，复制服务器地址和密钥。

![](/img/blog-2023-09-09-14.png)

请打开SRS Stack仪表板，然后单击`应用场景 > 多平台转播 > 视频号直播`，然后在SRS Stack中单击`开始转播`。

![](/img/blog-2023-09-09-15.png)

您的流现在将在视频号直播上发布。

![](/img/blog-2023-09-09-16.png)

### Step 4: Forward to Bilibili

要将流转发到B站直播，请先在[B站直播](https://link.bilibili.com/p/center/index#/my-room/start-live)后台，创建直播。
然后，复制服务器地址和密钥。

![](/img/blog-2023-09-09-17.png)

请打开SRS Stack仪表板，然后单击`应用场景 > 多平台转播 > B站直播`，然后在SRS Stack中单击`开始转播`。

![](/img/blog-2023-09-09-18.png)

您的流现在将在B站直播上发布。

![](/img/blog-2023-09-09-19.png)

### Step 5: Forward to Custom

你也可以将流转给任意平台，甚至可以转给SRS Stack自己，在`应用场景 > 私人直播间`中复制服务器地址和密钥。

请打开SRS Stack仪表板，然后单击`应用场景 > 多平台转播 > 自定义凭他`，然后在SRS Stack中单击`开始转播`。

![](/img/blog-2023-09-09-20.png)

您的流现在将在自定义平台上发布。

### Step 6: Check Multiple Streaming Status

在所有平台上发布流后，您可以在SRS Stack仪表板中检查多个流媒体状态。

![](/img/blog-2023-09-09-21.png)

### Conclusion

在多个平台上进行直播是触及更广泛受众和提高参与度的有效方法。SRS Stack使此过程变得简单高效，让您专注于创建高质量内容，而它负责处理技术方面的问题。通过遵循本博客中概述的步骤，您可以轻松地在视频号、B站、快手等多个平台上设置直播，并将您的内容提升到一个新的水平。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-zh/2023-09-09-Multi-Platform-Streaming.md)
