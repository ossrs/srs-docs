---
title: Introduction
sidebar_label: 介绍
hide_title: false
hide_table_of_contents: false
---

# Introduction

> 注意：SRS5属于开发版，不稳定。

## SRS Overview

SRS是一个简单高效的实时视频服务器，支持RTMP/WebRTC/HLS/HTTP-FLV/SRT/GB28181。

[![SRS Overview](/img/SRS-SingleNode-4.0-sd.png)](/img/SRS-SingleNode-4.0-hd.png)

> Note: 简单的单节点架构，适用于大多数场景，大图请看[figma](https://www.figma.com/file/333POxVznQ8Wz1Rxlppn36/SRS-4.0-Server-Arch)。

[![SRS Overview](/img/SRS-Overview-4.0.png)](/img/SRS-Overview-4.0.png)

> Note: 这是典型的源站和边缘集群的架构，适用于需要高并发的场景，高清大图请参考[这里](https://www.processon.com/view/link/5e3f5581e4b0a3daae80ecef)

对于新手来说，音视频的门槛真的非常高，SRS的目标是**降低**（不能**消除**）音视频的门槛，所以请一定要读完Wiki。
不读Wiki一定扑街，不读文档请不要提Issue，不读文档请不要提问题，任何文档中明确说过的疑问都不会解答。

Please read [Getting Started](../doc/getting-started).

## Solution Guides

* [陈海博：SRS在安防中的应用](https://www.bilibili.com/video/BV11S4y197Zx)
* 最佳实践：[一对一通话](https://mp.weixin.qq.com/s/xWe6f9WRhtwnpJQ8SO0Eeg)，[多人通话](https://mp.weixin.qq.com/s/CM2h99A1e_masL5sjkp4Zw)和[直播连麦](https://mp.weixin.qq.com/s/7xexl07rrWBdh8xennXK3w)
* [最佳实践：如何扩展你的SRS并发能力？](https://mp.weixin.qq.com/s/pd9YQS0WR3hSuHybkm1F7Q)
* SRS是单进程模型，不支持多进程；可以使用[集群](https://mp.weixin.qq.com/s/pd9YQS0WR3hSuHybkm1F7Q) 或者[ReusePort](./reuse-port)扩展多进程(多核)能力。
* [基于HLS-TS&RTMP-FLV的微信小程序点直播方案](https://mp.weixin.qq.com/s/xhScUrkoroM7Q7ziODHyMA)
* [借力SRS落地实际业务的几个关键事项](https://mp.weixin.qq.com/s/b19kBer_phZl4n4oUBOvxQ)
* [干货 | 基于SRS直播平台的监控系统之实现思路与过程](https://mp.weixin.qq.com/s/QDTtW85giKmryhvCBkyyCg)
* [Android直播实现](https://blog.csdn.net/dxpqxb/article/details/83012950)
* [SRS直播服务器与APP用户服务器的交互](https://www.jianshu.com/p/f3dfa727475a)
* [使用flvjs实现摄像头flv流低延时实时直播](https://www.jianshu.com/p/2647393f956a)
* [IOS 直播方面探索（服务器搭建，推流，拉流）](https://www.jianshu.com/p/1aa677d99d17)
* [国产开源流媒体SRS4.0对视频监控GB28181的支持](https://mp.weixin.qq.com/s/VIPSPaBB5suUk7_I2oOkMw)

## Develop Guide

* [高性能网络服务器设计](https://blog.csdn.net/win_lin/article/details/8242653)，分析高性能网络服务器的设计要点。
* [SRS高精度、低误差定时器](https://mp.weixin.qq.com/s/DDSzRKHyJ-uYQ9QQC9VOZg)，论高并发服务器的定时器问题。
* [协程原理：函数调用过程、参数和寄存器](https://mp.weixin.qq.com/s/2TsYSiV8ysyLrELHdlHtjg)，剖析SRS协程实现的最底层原理。
* [性能优化：SRS为何能做到同类的三倍](https://mp.weixin.qq.com/s/r2jn1GAcHe08IeTW32OyuQ)，论性能优化的七七八八、前前后后。
* [SRS代码分析](https://github.com/xialixin/srs_code_note/blob/master/doc/srs_note.md)，分析SRS结构和代码逻辑，类结构图，线程模型，模块架构。
* [Third-party Client SDK](./client-sdk): 第三方厂商提供的客户端推流和播放的SDK，一般是移动端包括Andoird和iOS。
* [轻量线程分析](https://github.com/ossrs/state-threads#analysis)，分析SRS依赖的库ST的关键技术。
* [SRS代码分析](https://github.com/xialixin/srs_code_note/blob/master/doc/srs_note.md)，分析SRS结构和代码逻辑，类结构图，线程模型，模块架构。
* [深度: 掀起你的汇编来：如何移植ST协程到其他系统或CPU？](https://mp.weixin.qq.com/s/dARz99INVlGuoFW6K7SXaw)
* [肖志宏：SRS支持WebRTC级联和QUIC协议](https://www.bilibili.com/video/BV1Db4y1b77J)
* [StateThreads源码分析](https://www.xianwaizhiyin.net/?cat=24)
* [SRS 4.0源码分析](https://www.xianwaizhiyin.net/?cat=21)

## Tech Docs

* [历经5代跨越25年的RTC架构演化史](https://mp.weixin.qq.com/s/fO-FcKU_9Exdqh4xb_U5Xw)
* [技术解码 | SRT和RIST协议综述](https://mp.weixin.qq.com/s/jjtD4ik-9noMyWbecogXHg)
* [公众号专栏：SRS，知识库，重要功能和阶段性结果，解决方案和DEMO](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzA4NTQ3MzQ5OA==&scene=1&album_id=1703565147509669891&count=10#wechat_redirect)
* [公众号专栏：深度，底层技术分析，服务器模型，协议处理，性能优化等](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA4NTQ3MzQ5OA==&action=getalbum&album_id=2156820160114900994#wechat_redirect)
* [公众号专栏：动态，关于最新的会议和动态，新闻，社区等](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA4NTQ3MzQ5OA==&action=getalbum&album_id=1683217451712299009&count=10#wechat_redirect)
* [WebRTC 的现状和未来：专访 W3C WebRTC Chair Bernard Aboba](https://mp.weixin.qq.com/s/0HzzWSb5irvpNKNnSJL6Bg)
* [B站专栏(视频)：SRS开源服务器](https://space.bilibili.com/430256302/channel/detail?cid=136049)
* [零声学院(视频)：SRS流媒体服务器实战](https://www.bilibili.com/video/BV1XZ4y1P7um)
* [音视频开发为什么要学SRS流媒体服务器](https://zhuanlan.zhihu.com/p/190182314)

## Cluster Guides

Please see [link](../category/clusters).

## Effective SRS

Please see [link](/guide#scenario).

## Deployment Guides

Please see [link](../category/main-protocols).

## Integration Guides

Please see [link](../category/openapi).

## Video Guides

Please see [link](../tutorial/srs-open-source).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/introduction)


