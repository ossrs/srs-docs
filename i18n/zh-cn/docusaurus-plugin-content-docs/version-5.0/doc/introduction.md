---
title: Introduction
sidebar_label: 介绍
hide_title: false
hide_table_of_contents: false
---

# Introduction

SRS是一个开源的（[MIT协议](/license)）简单高效的实时视频服务器，支持RTMP、WebRTC、HLS、HTTP-FLV、SRT、MPEG-DASH和GB28181等协议。
SRS媒体服务器和[FFmpeg](https://ffmpeg.org)、[OBS](https://obsproject.com)、[VLC](https://www.videolan.org)、
[WebRTC](https://webrtc.org)等客户端配合使用，提供[流的接收和分发](./getting-started.md)的能力，是一个典型的发布
（推流）和订阅（播放）服务器模型。 SRS支持互联网广泛应用的音视频协议转换，比如可以将[RTMP](./rtmp.md)或[SRT](./srt.md)，
转成[HLS](./hls.md)或[HTTP-FLV](./flv.md)或[WebRTC](./webrtc.md)等协议。

SRS提供了[HTTP API](./http-api.md)开放接口，可以查询系统的状态和流状态。同时还支持[HTTP Callback](./http-callback.md)
支持回调能力，主动通知你的系统，并可以实现流的鉴权能力和业务定制（比如动态DVR）。SRS也支持官方的[Prometheus Exporter](./exporter.md)
对接到云原生的监控系统，具备强大的可观测性。SRS支持会话级别[可追踪日志](./log.md)，极大降低了系统维护成本。

若你是新接触音视频和流媒体的朋友，或者新接触SRS的朋友，推荐阅读[快速起步](./getting-started.md)和[学习路径](/guide)。请花时间
阅读后续的文档，阅读和熟悉文档是社区的基本要求。如果你遇到问题，请先在[FAQ](/faq)中快速查找，然后在[Issues](https://github.com/ossrs/srs/issues)
和[Discussions](https://github.com/ossrs/srs/discussions)中查找，几乎所有问题都可以在这里找到答案。

SRS使用ANSI C++ (98)开发，只使用了基本的C++能力，可以在Linux、Windows、macOS等多个平台运行，推荐使用Ubuntu 20+系统开发和调试，
我们提供的镜像[ossrs/srs](https://hub.docker.com/r/ossrs/srs)也是基于Ubuntu 20 (focal)构建的。

> Note: 为了解决复杂的流媒体处理中的长连接和复杂的状态机问题，SRS使用了[ST(State Threads)](https://github.com/ossrs/state-threads)
协程技术（类似[Goroutine](https://go.dev/doc/effective_go#goroutines)），并在不断增强和维护ST的能力，支持了Linux、Windows、macOS
多个平台，X86_64、ARMv7、AARCH64、M1、RISCV、LOONGARCH和MIPS等多种CPU架构。

## Who's using SRS?

SRS的用户遍布全球，欢迎大家在[SRS应用案例](https://github.com/ossrs/srs/discussions/3771)中展示自己的SRS应用。

## Governance

欢迎大家参与SRS的开发和维护，推荐从[Contribute](https://github.com/ossrs/srs/contribute)解决Issue和
[提交PR](/how-to-file-pr)开始， 所有贡献过的朋友都会在[Contributors](https://github.com/ossrs/srs#authors)
中展示。

## Milestone

SRS大概是两年发布一个大版本，一年时间开发，一年时间提升稳定性，详细请参考[Milestone](/product)。

## Sponsors

SRS致力于构建一个非盈利性的开源项目和社区，我们对赞助SRS朋友提供专门的社区支持，请看[Sponsor](/contact#donation)。

## About SRS Stack

SRS Stack是一个基于Go、Reactjs、SRS、FFmpeg、WebRTC等的轻量级、开源的视频云解决方案。
详细请参考[SRS Stack](./getting-started-stack.md)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/introduction)


