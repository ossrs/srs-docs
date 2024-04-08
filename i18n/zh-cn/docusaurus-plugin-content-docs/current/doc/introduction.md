---
title: Introduction
sidebar_label: 介绍
hide_title: false
hide_table_of_contents: false
---

# Introduction

> 注意：SRS6属于开发版，不稳定。

SRS是一个开源的（[MIT协议](../../../license)）简单高效的实时视频服务器，支持RTMP、WebRTC、HLS、HTTP-FLV、SRT、MPEG-DASH和GB28181等协议。
SRS媒体服务器和[FFmpeg](https://ffmpeg.org)、[OBS](https://obsproject.com)、[VLC](https://www.videolan.org)、
[WebRTC](https://webrtc.org)等客户端配合使用，提供[流的接收和分发](./getting-started.md)的能力，是一个典型的发布
（推流）和订阅（播放）服务器模型。 SRS支持互联网广泛应用的音视频协议转换，比如可以将[RTMP](./rtmp.md)或[SRT](./srt.md)，
转成[HLS](./hls.md)或[HTTP-FLV](./flv.md)或[WebRTC](./webrtc.md)等协议。

SRS主要用于直播和WebRTC领域。在直播领域，SRS支持RTMP、HLS、SRT、MPEG-DASH和HTTP-FLV等典型协议。在WebRTC领域，SRS支持WebRTC、
WHIP和WHEP等协议。SRS可以为直播和WebRTC实现协议转换。作为媒体服务器，SRS通常与FFmpeg、OBS和WebRTC等其他开源项目一起工作。
Oryx作为一个开箱即用的媒体解决方案，整合了众多开源项目和工具，更多详细信息，请参考Oryx的
[介绍](./getting-started-oryx.md#introduction)。

SRS提供了[HTTP API](./http-api.md)开放接口，可以查询系统的状态和流状态。同时还支持[HTTP Callback](./http-callback.md)
支持回调能力，主动通知你的系统，并可以实现流的鉴权能力和业务定制（比如动态DVR）。SRS也支持官方的[Prometheus Exporter](./exporter.md)
对接到云原生的监控系统，具备强大的可观测性。SRS支持会话级别[可追踪日志](./log.md)，极大降低了系统维护成本。

若你是新接触音视频和流媒体的朋友，或者新接触SRS的朋友，推荐阅读[快速起步](./getting-started.md)和[学习路径](/guide)。请花时间
阅读后续的文档，阅读和熟悉文档是社区的基本要求。如果你遇到问题，请先在[FAQ](../../../faq)中快速查找，然后在[Issues](https://github.com/ossrs/srs/issues)
和[Discussions](https://github.com/ossrs/srs/discussions)中查找，几乎所有问题都可以在这里找到答案。

SRS使用ANSI C++ (98)开发，只使用了基本的C++能力，可以在Linux、Windows、macOS等多个平台运行，推荐使用Ubuntu 20+系统开发和调试，
我们提供的镜像[ossrs/srs](https://hub.docker.com/r/ossrs/srs)也是基于Ubuntu 20 (focal)构建的。

> Note: 为了解决复杂的流媒体处理中的长连接和复杂的状态机问题，SRS使用了[ST(State Threads)](https://github.com/ossrs/state-threads)
协程技术（类似[Goroutine](https://go.dev/doc/effective_go#goroutines)），并在不断增强和维护ST的能力，支持了Linux、Windows、macOS
多个平台，X86_64、ARMv7、AARCH64、M1、RISCV、LOONGARCH和MIPS等多种CPU架构。

## Features

功能一般是大家比较关注的点，丰富程度也是选择项目的重要原因，
详细的功能列表可以看 [Features](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features) 。
我们列出了主要的功能的版本，以及相关的Issue和PR链接。

此外，在 [里程碑](/product) 的详细描述中，也会介绍这个大的版本，所支持的功能。

> Note: 如果希望看每个里程碑的Issues，则可以在 [Milestones](https://github.com/ossrs/srs/milestones) 中查看。

特别注意的是，尽管不多，但SRS还是会将某些功能设置为 [Deprecated](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features) ，
可以在页面中搜索`Deprecated`或者`Removed`。我们也会详细解释为何要移除这个功能。

如果你想知道我们正在做的功能，可以在 [微信公众号](/contact#discussion) 中，点菜单的最新版本，比如`SRS 5.0`或者`SRS 6.0`。
新的功能完成后，我们也会发布文章到微信公众号，请关注。

## Who's using SRS?

SRS的用户遍布全球，欢迎大家在[SRS应用案例](https://github.com/ossrs/srs/discussions/3771)中展示自己的SRS应用。

## Governance

欢迎大家参与SRS的开发和维护，推荐从[Contribute](https://github.com/ossrs/srs/contribute)解决Issue和
[提交PR](/how-to-file-pr)开始， 所有贡献过的朋友都会在[Contributors](https://github.com/ossrs/srs#authors)
中展示。

SRS是一个非商业化的开源社区，活跃的开发者都有自己的工作，会花自己的业余时间推动SRS的发展。

由于SRS整个体系是非常高效的，因此我们可以花很少的时间让SRS不断进步，交付功能丰富且稳定性很高的高质量产品，基于SRS定制也很容易。

我们是全球的开源社区，国内和海外都有开发者社区，我们欢迎开发者加入我们：

* 巨大的成就感：你的代码可以影响全球的用户，改变音视频行业，并且随着SRS在各行各业的广泛应用，也改变了各行各业。
* 扎实的技术进步：在这里可以和全球顶尖的音视频开发者交流，掌握高质量软件开发的能力，互相提升技术能力。

SRS目前使用了以下的技术和规则，保证项目的高质量和高效率：

* 长时间的架构和方案探讨，对于大的功能和方案，需要得到长时间探讨，比如 [HEVC/H.265](https://github.com/ossrs/srs/issues/465) 的支持，我们讨论了7年。
* 仔细认真的CodeReview，每个PullRequest至少2个TOC和Developer通过，并且Actions全部通过，才能合并。
* 完善的单元测试(500多个)、覆盖率(60%左右)、黑盒测试等，保持一年开发一年测试的充足测试时间。
* 全流水线，每个PullRequest会有流水线，每次发布由流水线自动完成。

欢迎加入我们，具体请访问 [Contribute](https://github.com/ossrs/srs/contribute) 按要求提交PullRequest。

## Milestone

SRS大概是两年发布一个大版本，一年时间开发，一年时间提升稳定性，详细请参考[Milestone](/product)。

如果你想在线上使用SRS，推荐使用稳定版本。如果你想用新功能，就用开发版本。

SRS的分支规则，是按版本的分支，比如：

* [develop](https://github.com/ossrs/srs/tree/develop) SRS 6.0，开发分支，不稳定，但是新功能最多。
* [5.0release](https://github.com/ossrs/srs/tree/5.0release#releases) SRS 5.0，目前已经稳定，具体要看分支的状态。
* [4.0release](https://github.com/ossrs/srs/tree/4.0release#releases) SRS 4.0，目前是稳定分支，而且会越来越稳定。

具体分支是否稳定，要看Releases的标记，比如 [SRS 4.0](https://github.com/ossrs/srs/tree/4.0release#releases) ：

* 2022-06-11, Release v4.0-r0，这个是稳定的发布版本。
* 2021-12-01, Release v4.0-b0，这个是相对比较稳定的beta版本，也就是公测版本。
* 2021-11-15, Release v4.0.198，这个版本就是不稳定的开发版。

> Note: 除了beta版本，还有alpha版本，比如`v5.0-a0`，是比beta更不稳定的内测版本。

> Note：每个alpha、beta、release版本，都会对应具体的版本号，比如`v5.0-a0`，对应的就是`v5.0.98`。

对于SRS来说，一般达到beta版本，就可以在线上使用了。

## Strategy

SRS不做客户端，因为无论是FFmpeg，还是OBS，还是VLC，还是WebRTC，都是非常成熟和庞大的开源社区，我们和这些社区合作，使用这些社区的产品。

除了SRS服务器，我们还在做Oryx，还有WordPress插件等等，主要的目标还是根据不同行业，做出更简单的应用方式，包括：

* [oryx](https://github.com/ossrs/oryx) Oryx或Oryx，是一个开箱即用的单机的视频云，里面有FFmpeg和SRS等，主要是方便不会命令行的用户，直接通过腾讯云镜像或者宝塔，鼠标操作，就可以把音视频的应用搭起来。
* [WordPress-Plugin-SrsPlayer](https://github.com/ossrs/WordPress-Plugin-SrsPlayer) 出版领域，比如个人博客、网站传媒等，方便用户可以使用音视频的能力。
* [srs-unity](https://github.com/ossrs/srs-unity) 游戏领域，对接Unity的WebRTC SDK，使用音视频的能力。

SRS还会在工具链上不断完善，开发者可能不用SRS，但可能用过SB压测工具：

* [srs-bench](https://github.com/ossrs/srs-bench) 音视频压测工具，包括RTMP/FLV/WebRTC/GB28181等，未来还会完善。
* [state-threads](https://github.com/ossrs/state-threads) C的协程库，可以认为是C版本的Go，很小巧但很强大的服务器库，我们也会不断完善它。
* [tea](https://github.com/ossrs/tea) 这是eBPF方向的探索，网络的弱网模拟，以及LB负载均衡。

通过不断完善音视频的工具链、解决方案、场景化的能力，让各行各业都可以应用音视频的能力。

## Sponsors

SRS致力于构建一个非盈利性的开源项目和社区，我们对赞助SRS朋友提供专门的社区支持，请看[Sponsor](/contact#donation)。

音视频开发者，几乎必然碰到问题，估计大家比较习惯云厂商的贴身服务，来到开源社区就非常不习惯。

其实遇到问题不要慌张，大部分问题都是已经有的，可以在 [FAQ](../../../faq) 中找到答案，或者在文档 [Docs](./getting-started.md) 中找到答案。

也可以在 [支持](/contact) 中加微信群，和其他开发者交流，不过请遵守社区规范，否则也得不到支持的。

作为开发者，我们必须学会看文档，调查问题，然后再在社区中交流。

值得澄清的是，中国开发者的素质也越来越高了，深度开发者我们建议加付费星球，参考 [Support](/contact#donation) 。

SRS没有商业化的计划，我们目前正在努力建设全球的活跃的开发者社区，开源的价值会越来越大，社区彼此的支持也会越来越多。

## About Oryx

Oryx是一个基于Go、Reactjs、SRS、FFmpeg、WebRTC等的轻量级、开源的视频云解决方案。
详细请参考[Oryx](./getting-started-oryx.md)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/introduction)


