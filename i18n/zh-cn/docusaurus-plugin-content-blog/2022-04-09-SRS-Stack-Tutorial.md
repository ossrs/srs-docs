---
slug: SRS-Stack-Tutorial
title: SRS Stack - 起步、购买和入门
authors: []
tags: [turotial, srs, webrtc, streaming]
custom_edit_url: null
---

# How to Setup a Video Streaming Service by 1-Click

## Introduction

流媒体视频在各种行业中非常受欢迎，有许多关于构建媒体服务器的教程，使用 [SRS](https://github.com/ossrs/srs) 或 
[NGINX-RTMP](https://github.com/arut/nginx-rtmp-module) 托管流媒体，而无需依赖其他服务提供商。

<!--truncate-->

但是，如果我们想要构建一个在线视频流媒体服务，那么它不仅仅是一个媒体服务器：

1. [Authentication](./2023-08-29-SRS-Stack-Ensuring-Authentication-for-Live-Streaming-Publishing.md)：因为服务器位于具有公共IPv4地址的公共互联网上，如何进行身份验证？如何阻止所有用户，除非他们拥有正确的令牌？
1. 多种协议：与其使用OBS发布RTMP，您可能需要[使用WebRTC或H5发布直播流](./2023-05-16-Stream-YouTube-Using-Web-Browser.md)，或者[OBS WHIP服务器](./2023-12-12-SRS-Stack-OBS-WHIP-Service.md)，因为它易于使用。您还可以使用SRT与一些广播设备。如何将RTMP/WebRTC/SRT转换为HLS？
1. [Restreaming](./2023-09-09-SRS-Stack-Multi-Platform-Streaming.md)：使用SRS Stack将流重新发送到多个平台，以扩大受众范围并增加参与度。在YouTube、Twitch和Facebook上进行直播的简单且高效的解决方案。
1. [DVR or Recording](./2023-09-10-SRS-Stack-Record-Live-Streaming.md)：在本逐步指南中，了解如何使用SRS Stack轻松录制直播流。学习配置Glob过滤器以进行选择性录制，并集成S3云存储以实现无缝的服务器端录制，使直播流对所有人都可访问。
1. [Transcoding](./2023-10-21-SRS-Stack-Live-Transcoding.md)：探讨使用SRS Stack和FFmpeg进行高效直播流转码的好处，以减少带宽并节省成本。了解如何为具有不同互联网速度和设备的观众优化流媒体体验，并利用SRS Stack实现更顺畅、更经济的流媒体传输。
1. [Virtual Live Events](./2023-09-11-SRS-Stack-Virtual-Live-Events.md)：了解虚拟直播活动的好处，并学习如何使用预先录制的内容创建无缝且引人入胜的直播流体验。本博客文章将指导您将录制的视频转换为适用于各种应用的直播广播，例如电子商务、教育和在线演讲。
1. [IP Camera Streaming](./2023-10-11-SRS-Stack-Stream-IP-Camera-Events.md)：了解如何使用SRS Stack轻松将您的RTSP IP摄像头流式传输到YouTube、Twitch或Facebook等流行平台。了解这个强大的工具如何简化流程，使您能够连接多个IP摄像头并将直播流传输到各种平台，以提供更好的直播流体验。
1. [AI Transcription](./2023-11-28-SRS-Stack-Live-Streams-Transcription.md)：借助OpenAI的Whisper实现AI驱动的转录和实时字幕，探索直播流的未来。学习如何为多元化受众创建无障碍、多语言内容，彻底改变直播流体验。拥抱包容性，并通过AI增强的直播流吸引更广泛的受众。

实际上，这不仅仅是一个媒体服务器，而且似乎有点复杂，对吗？是的，也不是！

* 是的！构建一个视频流媒体服务确实很困难，不容易。它需要视频流媒体工程技术，还需要像Nodejs或Go这样的后端服务技术，以及构建管理和主页的前端技能。
* 不！与其从头开始构建所有内容，我们可以基于一些开源解决方案（如[SRS Stack](https://github.com/ossrs/srs-stack)）和轻量级云服务（如[DigitalOcean](https://digitalocean.com)或[AWS](https://console.aws.amazon.com)）来构建一个视频流媒体服务，这样构建您的视频流媒体服务就非常简单了。

在本教程中，您将学习如何设置一个视频流媒体服务，支持通过浏览器发布而无需插件，即将WebRTC转换为HLS，使用SRT提供低延迟（约300ms）
的视频流，并通过认证确保服务安全。此外，这个解决方案是开源的，非常容易完成，甚至可以通过1-Click来完成。

## Prerequisites

要完成这些操作，您需要：

1. 安装 OBS，按照[此处](https://obsproject.com/)的说明下载并安装 OBS。
2. 一个虚拟专用服务器（VPS）实例，例如 [TencentCloud LightHouse](https://www.bilibili.com/video/BV1844y1L7dL/)、[AWS Lightsail](https://lightsail.aws.amazon.com)、[DigitalOcean Droplets](https://cloud.digitalocean.com/droplets) 或其他类似服务。
3. 可选地，您可以选择在本地网络或个人计算机上使用 SRS Stack。确保为此目的安装了 [Docker](https://www.docker.com/)。

本指南将在整个流媒体 URL 中使用占位符 `your_public_ipv4` 和 `your_domain_name`。请用您自己的 IP 地址或域名替换它们。

## Step 1.0: TencentCloud LightHouse

使用方式请参考 [TencentCloud LightHouse](https://www.bilibili.com/video/BV1844y1L7dL/)

## Step 1.1: Create an SRS Stack using AWS Lightsail

注册一个AWS帐户并登录到[AWS Lightsail](https://lightsail.aws.amazon.com)。接下来，点击`创建实例`按钮。选择`Linux/Unix`
平台和`仅限操作系统`蓝图。最后，选择`Ubuntu 20.04 LTS`作为实例镜像。

![](/img/blog-2022-04-09-24.png)

接下来，点击`添加启动脚本`按钮并输入以下脚本，该脚本将在实例创建后执行以安装SRS Stack。

![](/img/blog-2022-04-09-25.png)

请输入以下脚本：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/ossrs/srs-stack/HEAD/scripts/lightsail.sh)"
```

> Note: 您还可以访问实例并手动运行脚本。请在网络查找有关如何登录到Lightsail实例的教程。

接下来，选择实例计划，选择`2vCPUs 1GB`计划或更高的计划，然后点击`创建实例`。

实例建立后，访问`联网`选项卡，点击`附加静态IP`以防止IP在重启后变化。在`IPv4防火墙`内，按下`添加规则`选项，添加一个`所有协议`
规则，然后点击`创建`按钮：

![](/img/blog-2022-04-09-26.png)

现在，SRS Stack已经创建！在浏览器中打开 `http://your_public_ipv4/mgmt/` ，点击 `设置管理员密码` 按钮以首次设置管理员密码。

## Step 1.2: Create an SRS Stack using Docker

如果您不喜欢使用AWS Lightsail，有其他的VPS，甚至是本地的虚拟机或个人电脑，强烈建议使用Docker，这是一种简单高效的方法，
只需一个命令就可以在VPS上运行SRS Stack：

```bash
docker run --restart always -d -it --name srs-stack -v $HOME/data:/data \
  -p 80:2022 -p 443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

现在，SRS Stack已经创建！在浏览器中打开 `http://your_public_ipv4/mgmt/` ，点击 `设置管理员密码` 按钮以首次设置管理员密码。

## Step 1.3: Create an SRS Stack using DigitalOcean Droplets

您可以使用DigitalOcean droplet一键运行SRS Stack。droplet是DigitalOcean的一个简单可扩展的虚拟机。SRS Droplet是一个安装了
SRS Stack的droplet，用于支持您的视频流媒体服务。

您可以通过 [点击这里](https://marketplace.digitalocean.com/apps/srs) 点击按钮 `Create SRS Droplet`，设置droplet的 
`Region` 和 `Size`，然后点击底部的 `Create Droplet` 按钮。

> Note: 推荐使用`2vCPUs 2GB`的套餐，或者稍微高一点点的套餐。

现在，SRS Stack已经创建！在浏览器中打开 `http://your_public_ipv4/mgmt/` ，点击 `设置管理员密码` 按钮以首次设置管理员密码。

## Step 2: Publish Stream using OBS

OBS 使用起来更简单，SRS 为 OBS 提供了指南，请点击 `应用场景 > 推拉直播流 > RTMP: OBS或vMix推流`
或者打开网址 `http://your_public_ipv4/mgmt/en/routers-scenario?tab=live` ，其中包含了 `服务器` 和 `推流密钥` 供 OBS 使用，
请将这些配置复制并粘贴到 OBS 中。

![](/img/blog-2022-04-09-01.png)

> Note: 还有一个关于使用 FFmpeg 和 WebRTC 发布流的指南，但是对于 WebRTC 来说有点复杂，
> 我们稍后再谈论这个问题。

在将 RTMP 流发布到 SRS 之后，您可以通过点击 H5 播放器链接或使用 [VLC](https://www.videolan.org/) 播放 URL 来通过 
HTTP-FLV 或 HLS 播放该流。

> Note: VLC 的延迟非常大，所以如果您想要低延迟的直播，请使用 [ffplay](https://ffmpeg.org/) 播放 RTMP 或 HTTP-FLV。

现在我们已经完成了基本的直播流发布和播放，注意`Stream Key`中包含一个用于身份验证的`secret`。如果没有这个密钥，SRS 将拒绝发布者，
所以只有知道密钥的人才能发布 RTMP 流。

而对于播放器来说，URL 是公开的，没有`secret`这样的东西，因为通常我们不需要对播放器进行身份验证。然而，SRS 计划支持更多的身份验证算法，
包括针对播放器的令牌，或者连接数的限制，或者在连接超过一定时间后断开连接。

## Step 3: Publish by WebRTC (Optional)

WebRTC 或 H5 对于用户来说非常方便，只需打开一个 H5 URL，就可以像 OBS 一样开始直播。请参考
[使用 Let's Encrypt 保护 SRS](https://blog.ossrs.io/how-to-secure-srs-with-lets-encrypt-by-1-click-cb618777639f)教程。

因为 WebRTC 需要 HTTPS，所以你需要一个完全注册的域名，你可以在 [Namecheap](https://namecheap.com/) 或 
[GoDaddy](https://godaddy.com/) 上购买域名，但在本教程中我们将使用占位符 `your_domain_name`。

当你获得一个域名时，请确保为你的服务器设置一个 DNS 记录，请添加一个 `A 记录`，将 `your_domain_name` 指向我们所说的 
`your_public_ipv4` 的服务器公共 IP 地址，参见[域名和 DNS](https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/#a-records)。

现在，请切换到 `System / HTTPS / Let's Encrypt`，输入 `your_domain_name`，然后点击 `Submit` 按钮从 
[Let's Encrypt](https://letsencrypt.org/) 请求一个免费的 SSL 证书：

![](/img/blog-2022-04-09-02.png)

当HTTPS准备好后，请打开网址 `https://your_domain_name/mgmt` 访问 `应用场景 > 推拉直播流 > WebRTC: WHIP网页推流`，
然后打开使用WebRTC发布的网址。

![](/img/blog-2022-04-09-03.png)

> Remark: 请注意，网站和流媒体URL已更改为HTTPS，包括HTTPS-FLV、HLS和WebRTC。

以下是一个通过WebRTC发布和通过HTTP-FLV或HLS播放的演示：

![](/img/blog-2022-04-09-04.png)

WebRTC比RTMP或HLS稍微复杂一些，但使用SRS的功能，设置HTTPS网站和WebRTC信令API也非常简单，而且WebRTC发布者和播放器的演示页面
也非常易于使用。

## Step 4: Low Latency Streaming by SRT (Optional)

对于RTMP/FLV，流媒体延迟大约为`3~5秒`，而对于HLS则为`5~10秒`。如果我们想要构建一个低延迟的直播流服务，比如说，
低于1秒，应该使用哪种协议？

WebRTC？不！它太复杂了，而且很少有设备支持WebRTC。[WHIP](https://datatracker.ietf.org/doc/draft-ietf-wish-whip/)
是使用WebRTC进行直播的一个可能选择，但它现在（2022年）还不是一个RFC。将WebRTC应用到直播行业可能需要很长时间，尤其是当我们有
其他选择时，如 [SRT](https://www.srtalliance.org/) 和 [RIST](https://www.rist.tv/) 等。

> Note: 无论如何，SRS Stack允许您使用WebRTC进行直播，通过WebRTC发布并通过RTMP/HLS/WebRTC播放。

使用SRT也非常容易，只需点击`应用场景 > 直播推拉流 > SRT：OBS或vMix推流`，指南是使用OBS发布SRT流，并通过ffplay播放。
`OBS+ffplay`的延迟大约为300ms，下面是一个更低的解决方案，通过`vMix+ffplay`：

![](/img/blog-2022-04-09-05.png)

> Note: SRT的端到端延迟为200ms至500ms，足够好了！而WebRTC的延迟约为50ms至300ms。WebRTC比SRT还要低，但WebRTC也引入了更多的暂停事件，流媒体播放不如SRT流畅。

SRT受到广播行业许多设备的支持，OBS/vMix等软件也支持SRT，因此它实际上是获得低延迟直播的最稳定且最简单的方法。

请注意，H5不支持SRT，因此您不能使用Chrome播放SRT流。然而，SRS Stack会将SRT转换为HTTP-FLV/HLS，以确保与普通直播流的兼容性。

## Other Topics

SRS Stack还支持将流重播到其他平台，通过分叉多个FFmpeg进程，每个进程对应一个流。这是个很长的故事，所以让我们在新教程中讨论它。

DVR又是另一个话题，DVR意味着我们将直播流转换为VoD文件，因此我们必须将VoD文件保存到云存储中。所以我们正在开发以支持更多的云存储。

我们还在考虑将CMS集成到SRS Stack中，以便用户发布直播间或像vlog等的VoD文件。

SRS Stack是一个单节点视频流服务，但SRS是一个支持集群的媒体服务器，例如[源集群](../docs/v4/doc/origin-cluster)、
[RTMP边缘集群](../docs/v4/doc/sample-rtmp-cluster)甚至[HLS边缘集群](../docs/v4/doc/sample-hls-cluster)。
HLS边缘集群基于NGINX，SRS可以与NGINX很好地协同工作，如果您愿意可以订阅我们，我们会发布更多关于这个主题的教程。

## Conclusion

在本教程中，您只需1-Click就可以搭建一个视频流媒体服务，但功能强大，如身份验证、SRT和WebRTC等。如果您对SRS有进一步的问题，
[官网文档](../docs/v6/doc/getting-started-stack)是一个很好的起点。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/22-04-09-SRS-Stack-Tutorial)


