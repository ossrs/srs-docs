---
slug: unlock-the-power-of-srs-real-world-use-cases
title: SRS Server - 解锁SRS真实应用场景
authors: []
tags: [srs, use-case]
custom_edit_url: null
---

发掘SRS服务器的能力，这是一款全能的开源媒体服务器解决方案，可以实现无缝的直播流媒体、内容创作和AI等系统集成，
支持视频号、抖音、B站和快手等平台上的多平台直播。

<!--truncate-->

You can also watch the video on YouTube: [Unlock the Power of SRS: Real-World Use Cases and Boosting Your Business with Simple Realtime Server.](https://youtu.be/WChYr6z7EpY)

## Introduction

![](/img/blog-2023-05-22-001.png)

你好，我是 Winlin！

我创建了 SRS，即简单实时服务器，简称“SARS”。

SRS 是一款易于使用、高效的实时视频服务器，支持多种协议，如 RTMP、WebRTC、HLS、HTTP-FLV、SRT、MPEG-DASH和GB28181。

在这个视频中，我将介绍一些常见的 SRS 使用方法。

## Project Compare, an open-source media gateway server.

![](/img/blog-2023-05-22-002.png)

市面上有几个知名的开源媒体服务器，如用于直播的 NginxRTMP，用于 WebRTC 的 Janus 和 Mediasoup，当然还有 SRS，它涵盖了所有功能。

我们在 2013 年开始了 SRS 项目，最初支持 RTMP 和 HLS，延迟分别为 1-3 秒和 5-10 秒。SRS 还支持 HTTP-FLV 和 HTTP-TS，它们与 RTMP 类似。

2020 年，我们扩大了社区，并增加了对 WebRTC 和 SRT 的支持，实现了亚秒级延迟。SRT 延迟约为 300-500 毫秒，而 WebRTC 延迟在 80-200 毫秒之间。

SRS 充当媒体网关，在 RTMP、SRT 和 WebRTC 之间进行转换，因此您不需要三个单独的服务器。

我们还更新了文档和网站，您可以在 ossrs.net 上查看。SRS 取得了很大进展，但仍有更多工作要做。我们正在 Discord 上建立全球社区，帮助许多开发者并赢得他们的赞赏。

现在，让我向您介绍一些人们使用 SRS 的方法。

## Live Origin Cluter, converting streams is essential.

![](/img/blog-2023-05-22-003.png)

第一个用例是Origin集群，它是一组Origin服务器。

Origin服务器是一种基本且必不可少的服务器，作为 SRS 网关，接收并转换来自发布者的流。

与扩展Origin服务器的边缘或代理服务器不同，Origin服务器至关重要。默认情况下，SRS 服务器充当Origin服务器，充当从各种发布者收集流的流中心。

您可以通过 RTMP、SRT 或 WebRTC 将实时流发送到Origin服务器，然后将它们转换为 HLS、HTTP-FLV、RTMP、SRT 和 WebRTC。

您还可以从Origin服务器拉取流，转码、DVR 或将它们转发到其他服务器，甚至将它们交付给 CDN 或使用 SRS 创建 CDN。

简而言之，这是 SRS 的一个关键功能。

## Vrtual Live Streaming, boosting business with virtual live streaming.

![](/img/blog-2023-05-22-004.png)

你是一个拥有大量高质量视频的视频博主吗？你是否考虑过建立一个直播间来发展你的业务？

通过 SRS Stack，您可以轻松地将视频文件转换为直播流，无需亲自直播就可以吸引观众。

SRS Stack让您只需三个步骤就可以创建 24/7 虚拟直播：上传视频、设置直播间（如 视频号和抖音直播间），然后复制粘贴流密钥开始直播。

这很简单，不需要任何媒体流专业知识，而且 SRS Stack甚至可以免费将您的直播流重新发送到其他平台，因为它是开源的。

## Video Blogger, empower video bloggers with live streaming.

![](/img/blog-2023-05-22-005.png)

如果您拥有一个 WordPress 网站，您可能考虑过添加直播功能，但由于 WordPress 的限制，以前无法实现。

但现在，有了 SRS 播放器 WordPress 插件，您可以使用 HTTP-FLV、HLS 和 WebRTC 进行直播，以及通过 HTTP-MP4 进行点播流。

只需使用 WordPress 短代码将直播播放器嵌入，您可以在 SRS Stack控制台中找到它。

这个强大的插件让每个人都可以使用直播，甚至在 WooCommerce（一款广泛使用的 WordPress 电子商务插件）中，展示了开源技术的影响力。

## Unity WebRTC Streaming, make Unity work with WebRTC SFU.

![](/img/blog-2023-05-22-006.png)

SRS Unity 展示了 Unity 开发者如何使用与 SRS 兼容的 WebRTC SDK 集成直播。

您可以将 Unity 摄像头画面发送到 SRS，并在浏览器中播放流，从 SRS 检索流并在 Unity 游戏中显示，或者使用 WebRTC 使多个 Unity 游戏互动。

在这种情况下，SRS 充当 WebRTC SFU 服务器，这对生产环境中的 WebRTC Unity 客户端至关重要。

WebRTC P2P 在实际情况中并不可靠，但 SFU 服务器提供了更好的网络质量、可扩展性以及对 WebRTC-RTMP 转换的支持。

此外，您可以将 WebRTC 流记录为点播文件，SRS 与 Unity WebRTC SDK、Unity AR 和 VR 一起工作。

## Remote Broadcasting & Content Creator, enables remote content creation in broadcasting.

![](/img/blog-2023-05-22-007.png)

SRS 可以应用于广播行业，开发远程内容创作系统。

Origin摄像头画面发送到 SRS，然后由远程编辑访问，编辑在编辑后的流上添加水印和徽标。

使用 SRT，延迟约为 300-500 毫秒，实现实时编辑和在摄像头画面之间切换。

低延迟确保所有流同步，使其成为远程内容创作的强大工具。

您可以在远离现场的地方进行编辑，并同时生成多个流，甚至使用 HEVC 或 AV1 生成 HDR 内容。

通过 SRS，您可以实现更高效的远程内容创作和实时编辑，从而提高广播行业的生产力和灵活性。这种技术的应用将有助于降低成本、提高效率，并为观众带来更丰富的视听体验。

## Video & Audio AI Process, real-time AI processing makes more possibilities.

![](/img/blog-2023-05-22-008.png)

SRS在AI领域的视频和音频处理方面也很有用。从SRS接收流，然后用AI模型处理它们，比如使用deepfake进行人脸替换。

SRS与音频处理的AI模型兼容，srs-k2项目就是一个例子，它演示了如何将SRS与k2-fsa一起用于ASR（Kaldi 2.0，一款流行的开源ASR工具包）。

srs-k2的端到端延迟约为400-800毫秒，可用于WebRTC多语言实时通信系统。这使得与不同语言的人进行对话以及与AIGC系统集成成为可能。

## HEVC/AV1 for AV/AR/8K, reduce the cost significantly.

![](/img/blog-2023-05-22-009.png)

想要将直播费用减半，请考虑使用HEVC或AV1。

AV1是一种新的、开源的、免版税的视频编解码器，但其硬件解码器并不像HEVC那样普及。然而，它正在迅速获得关注，并对未来充满希望。

HEVC是业界广泛采用的编解码器，通过OBS支持RTMP和SRT。将HEVC流通过OBS发送到SRS，然后使用H5播放器、mpegjs.js、VLC或ffplay播放流。

HEVC或AV1对于8K直播至关重要，并在VR/AR领域变得越来越流行。

## Restream to Multiple Platforms, restream to multiple platforms without extra cost.

![](/img/blog-2023-05-22-010.png)

想要在视频号、抖音、B站和快手等多个平台上直播吗？

SRS Stack简化了这个任务，而且不会占用你的带宽，因为它会为你处理重新推流。

## SRS Prometheus Exporter, make SRS an operatable online product.

![](/img/blog-2023-05-22-011.png)

Prometheus是一个著名的开源监控系统，通过其导出器，SRS可以原生支持它，让你可以密切关注SRS服务器。

使用Grafana可视化指标，并期待Prometheus和Grafana将来被整合到SRS Stack中。

## Support, contributions and donations are welcome.

![](/img/blog-2023-05-22-012.png)

如果想要支持SRS这个项目，请考虑加入SRS付费星球支持我们。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-en/2023-05-22-Unlock-the-Power-of-SRS-Real-World-Use-Cases)

