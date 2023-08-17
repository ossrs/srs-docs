---
title: Introduction
sidebar_label: Introduction
hide_title: false
hide_table_of_contents: false
---

# Introduction

> Remark: SRS6 is developing and not stable.

SRS is a open-source ([MIT Licensed](/license)), simple, high-efficiency, real-time video server supporting RTMP, 
WebRTC, HLS, HTTP-FLV, SRT, MPEG-DASH, and GB28181. SRS media server works with clients like [FFmpeg](https://ffmpeg.org),
[OBS](https://obsproject.com), [VLC](https://www.videolan.org), and [WebRTC](https://webrtc.org) to provide 
the ability to [receive and distribute streams](./getting-started.md) in a typical publish (push) and 
subscribe (play) server model. SRS supports widely used internet audio and video protocol conversions, 
such as converting [RTMP](./rtmp.md) or [SRT](./srt.md) to [HLS](./hls.md), [HTTP-FLV](./flv.md), or 
[WebRTC](./webrtc.md).

SRS provides an [HTTP API](./http-api.md) open interface to query system and stream status. It also supports 
[HTTP Callback](./http-callback.md) for callback capabilities, actively notifying your system and implementing 
stream authentication and business customization (such as dynamic DVR). SRS also supports the official 
[Prometheus Exporter](./exporter.md) for integration with cloud-native monitoring systems, offering powerful 
observability. SRS supports session-level [traceable logs](./log.md), greatly reducing system maintenance costs.

If you are new to audio, video, and streaming media or new to SRS, we recommend reading [Getting Started](./getting-started.md) 
and [Learning Path](/guide). Please take the time to read the following documentation, as reading and 
familiarizing yourself with the documentation is a basic requirement of the community. If you encounter any 
problems, please first search in the [FAQ](/faq), then in [Issues](https://github.com/ossrs/srs/issues) and 
[Discussions](https://github.com/ossrs/srs/discussions) to find answers to almost all questions.

SRS is developed using ANSI C++ (98) and only uses basic C++ capabilities. It can run on multiple platforms 
such as Linux, Windows, and macOS. We recommend using Ubuntu 20+ for development and debugging. The image 
we provide [ossrs/srs](https://hub.docker.com/r/ossrs/srs) is also built on Ubuntu 20 (focal).

> Note: To solve the long connection and complex state machine problems in complex streaming media processing, 
> SRS uses [ST(State Threads)](https://github.com/ossrs/state-threads) coroutine technology (similar 
> to [Goroutine](https://go.dev/doc/effective_go#goroutines)) and continuously enhances and maintains 
> ST's capabilities, supporting multiple platforms such as Linux, Windows, macOS, and various CPU 
> architectures like X86_64, ARMv7, AARCH64, M1, RISCV, LOONGARCH, and MIPS.

## Who's using SRS?

SRS users are spread all over the world, and we welcome everyone to showcase their SRS applications 
in [SRS Use Cases](https://github.com/ossrs/srs/discussions/3771).

## Governance

We welcome everyone to participate in the development and maintenance of SRS. We recommend starting by
resolving issues from [Contribute](https://github.com/ossrs/srs/contribute) and [submitting PRs](/how-to-file-pr).
All contributors will be showcased in [Contributors](https://github.com/ossrs/srs#authors).

## Milestone

SRS releases a major version approximately every two years, with one year for development and one year
for stability improvement. For more details, please refer to [Milestone](/product).

## Sponsors

SRS is committed to building a non-profit open-source project and community. We provide special community
support for friends who sponsor SRS. Please see [Sponsor](/contact#donation).

## About SRS Stack

SRS Stack is a lightweight, open-source video cloud solution based on Go, Reactjs, SRS, FFmpeg, WebRTC,
and more. For more details, please refer to [SRS Stack](./getting-started-stack.md).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v6/introduction)


