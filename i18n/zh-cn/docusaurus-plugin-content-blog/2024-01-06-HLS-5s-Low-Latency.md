---
slug: hls-5s-low-latency
title: Oryx - 如何实现5秒HLS低延迟
authors: []
tags: [hls, llhls, live-streaming, low-latency-streaming, low-latency-hls]
custom_edit_url: null
---

# Unlock Universal Ultra-Low Latency: Achieving 5-Second HLS Live Streams for All, No Special Equipment Needed

## Introduction

在动态的直播世界中，延迟是一个关键因素，它可以决定观众体验的成败。传统上，实现低延迟一直是一个挑战，
特别是在努力实现跨设备和平台的广泛兼容性时。这就是HLS发挥作用的地方，它是一种因其可靠性和兼容性而广受欢迎的格式。
然而，HLS通常与较高的延迟（约30秒）相关联，这对于实时互动可能是一个缺点。

<!--truncate-->

进入低延迟HLS流媒体的领域，这对于现场广播来说是一个游戏规则改变者。在这篇博客中，我们将探讨如何将HLS流延迟降低到最低5秒。
最好的部分？这可以通过使用常见的、高度兼容的技术来实现，无需专门的设备。我们将深入研究Oryx的使用，这是一个功能强大而简单的工具，
可以简化流程，仅需点击一下即可实现超低延迟HLS流媒体。

如果您需要更低的延迟并可以在兼容性上妥协，还有其他选择。对于1到3秒之间的延迟，HTTP-FLV是一个很好的选择。对于大约0.5到1秒的超低延迟，
WebRTC是理想的选择。每种技术都适用于不同的需求和内容类型。

在这篇博客中，我们的目标是为您提供一个关于如何为您的业务选择合适的流媒体技术的全面指南，重点关注HLS，
以实现低延迟和高兼容性之间的最佳平衡。无论您是在进行现场体育赛事、互动网络研讨会还是实时游戏会话的直播，了解这些技术将使您能够为观众提供最佳的直播体验。

## Key Points

为了实现最广泛的兼容性，我们使用最常见的HLS协议，而不是HTTP-FLV、WebRTC或LLHLS协议，而是最标准的HLS协议。

然而，我们需要在关键点上更改一些设置，例如：

* 对于OBS编码器，选择x264编码器，在高级设置中，将`GOP（关键帧间隔）`设置为`1 s`。选择`CPU使用预设`为`fast`，`配置 (Profile)`为`baseline`，`微调 (Tune)`为`zerolatency`。这些设置允许OBS在保持兼容性的同时生成较短的片段。
* 对于Oryx，启用HLS低延迟模式。这将生成尽可能短的HLS片段，每个片段约2秒。HLS的最小延迟大约是两个片段，允许大约5秒的延迟。
* 对于HLS播放器，如hls.js，将其设置为从最后一个片段开始播放，并配置最大缓冲时间。当累积延迟达到一定阈值时，启用加速播放以保持稳定的低延迟。

整个工作流程，从流媒体到服务器到播放器，都需要优化以实现5秒的低延迟。在此过程中的常见错误包括：
* 
* 无法将编码器（如 OBS）设置为较大的 GOP（如 10 秒），或者编码器缓冲区过大，导致整体延迟显著增加。
* Oryx 未设置为低延迟模式。在正常模式下，生成的片段持续时间较长，或者某些服务器可能无法生成准确持续时间的片段，而是更喜欢较大的片段。
* 使用不正确的播放器，如 VLC，无论使用哪种协议，都会有显著的延迟。并非所有播放器都适用；我们已经测试过 hls.js 和 mpegts.js 播放器具有低延迟。将来，我们将测试并确保与更多播放器兼容。

让我们通过一些简单的设置步骤和点击来实现 5 秒的 HLS 延迟。

## Step 1: Create Oryx by One Click

创建 Oryx 很简单，只需点击一下，如果您使用 Digital Ocean droplet，就可以完成。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-Oryx-Tutorial.md)了解详细信息。

您还可以使用 Docker 通过单个命令行创建 Oryx：

```bash
docker run --restart always -d -it --name oryx -v $HOME/data:/data \
  -p 80:2022 -p 443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/oryx:5
```

创建 Oryx 后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Setup OBS for HLS Low Latency

我建议使用OBS发布流。这是一个受欢迎且功能强大的流媒体工具，易于设置。 您应按照以下方式配置OBS：

![](/img/blog-2024-01-06-11.png)

点击`设置`按钮，然后转到`输出`选项卡并应用以下设置：

* 将`输出模式`设置为`高级`。`简单`模式不适用于低延迟HLS。
* 将`视频编码器`设置为`x264`。请注意，硬件编码器可能具有较大的延迟。
* 将`关键帧间隔`设置为`1 s`。请注意，这是实现低延迟的最关键设置。
* 将`CPU使用预设`设置为`fast`。此设置有助于减少延迟。
* 将`配置 (Profile)`设置为`baseline`。此设置有助于减少延迟。
* 将`微调 (Tune)`设置为`zerolatency`。此设置有助于减少延迟。

接下来，打开`直播`选项卡并按照Oryx提供的说明设置服务器和流密钥以发布流。

## Step 3: Setup Oryx in HLS Low Latency Mode

打开Oryx，导航至`系统配置 > HLS`。启用HLS低延迟模式，然后点击`提交`按钮。

![](/img/blog-2024-01-06-12.png)

在此之后，您可以获取发布服务器和流密钥，以便将OBS流传输到Oryx。

![](/img/blog-2024-01-06-13.png)

请配置OBS并开始将RTMP流发布到Oryx。

## Step 4: Setup the HLS Player

在浏览器中打开 Oryx 的 `简易播放器`，您可以看到具有5秒延迟的 HLS 流。

![](/img/blog-2024-01-06-04.png)

Oryx已使用hls.js为低延迟模式配置了HLS播放器。我们已经应用了以下设置。如果您需要使用自己的HLS播放器，请进行类似的配置：

* 通过将其设置为`true`来启用`enableWorker`。这可以提高性能，避免卡顿或丢帧。
* 通过将其设置为`true`来激活`lowLatencyMode`。这将启用低延迟HLS部分播放列表和片段加载。
* 将`liveSyncDurationCount`设置为`0`，从最后一个片段开始播放。
* 将`maxBufferLength`设置为`5`，以秒为单位设置最大缓冲长度。
* 将`maxLiveSyncPlaybackRate`设置为`2`，以便在延迟较大时追赶。

有关详细信息，请参阅[此提交](https://github.com/ossrs/oryx/commit/a6b709f516da3c7f36f5c3c599142296148187ee#diff-06095ca53f7d88e4f592f1a432030f541adf2060cb2dfc6c4efd86cd9f074820R40)。

## Conclusion

利用Oryx、OBS和hls.js，我们实现了5秒延迟的HLS流媒体直播，打破了直播低延迟和兼容性的障碍。
这一进步标志着互动和引人入胜的现场活动的新时代，无需专门的设备，所有人都可以使用，为流媒体观众带来了新的体验。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2024-01-06-HLS-5s-Low-Latency)
