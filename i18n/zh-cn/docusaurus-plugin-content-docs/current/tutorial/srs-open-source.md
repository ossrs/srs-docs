---
title: SRS
sidebar_label: SRS
hide_title: false
hide_table_of_contents: false
---

# SRS

## 开源视频服务器
* 地址: https://www.bilibili.com/video/BV1M54y1z7jo
* 说明: SRS是开源视频服务器，支持直播和WebRTC，高效稳定，一直在更新，社区和开发者很活跃。本视频介绍了SRS的定位、发展、思路和里程碑，推荐想了解SRS的朋友观看。

## SRS如何支持WebRTC
* 地址: https://www.bilibili.com/video/BV1r54y1S77q
* 说明: WebRTC是Google推出的做Web视频会议的框架，可以用浏览器就可以实现多人视频通话；同时随着Flash的禁用，WebRTC也在低延迟直播中也有应用。

## SRS开发和定制
* 地址: https://www.bilibili.com/video/BV1az4y1Q7zL
* 说明: 开源产品降低了开发的难度和工作量，同时任何产品都不可能完全满足所有的业务需求，这需要工程师定制和开发，这个视频介绍了如何在SRS基础上定制自己的流媒体服务器。

## SRS运行环境
* 地址: https://www.bilibili.com/video/BV19A411v7Zz
* 说明: SRS都可以在哪些环境运行？如何用Docker或安装包运行？或者从源代码编译和运行？如何修改代码和打安装包？

## SRS配置和热加载
* 地址: https://www.bilibili.com/video/BV1SZ4y1M7Ag
* 说明: SRS有非常多的配置项，怎么了解这些配置。如何修改配置后，不重启服务，实现配置的热加载。

## SRS关于HTTPS和WebRTC推流
* 地址: https://www.bilibili.com/video/BV1bK4y1x7Ut
* 说明: WebRTC推流除了本机可以HTTP，一般都必须用HTTPS。另外HTTPS-FLV，HTTPS HLS这些也是常用的能力。本视频介绍了如何让SRS支持HTTPS。

## 陈海博：SRS在安防中的应用
* 地址: https://www.bilibili.com/video/BV11S4y197Zx
* 说明: 安防领域是音视频的垂直细分行业中庞大的市场之一，安防也是物联网的应用领域之一，各种嵌入式的摄像头正在和互联网产生连接，SRS是其中关键的一环，实现了GB28181接入，转换成互联网直播和WebRTC协议，陈海博是SRS技术委员TOC成员，在安防领域有多年的丰富的工作经验，通过这次分享可以详细了解安防的音视频和互联网的差别，SRS解决了什么问题，安防领域要解决的关键问题是什么，哪些问题不能使用SRS解决，SRS未来对安防的支持的方向是什么。

## 肖志宏：RTC级联和QUIC协议
* 地址: https://www.bilibili.com/video/BV1Db4y1b77J
* 说明: WebRTC的集群一般叫级联，是扩展服务器并发能力的一种方式，单台服务器支持的并发有限，通过级联可以支持更多的并发。WebRTC是基于UDP的，因此我们选择QUIC协议作为集群之间的通信协议。

## SRS日志和错误
* 地址: https://www.bilibili.com/video/BV1mD4y1S7jy
* 说明: SRS的面向会话的日志，让排查长连接问题非常高效，可以分离出会话整个长时间生命周期中的、上下文相关的日志。SRS的错误带有堆栈，可以在出现错误时一眼能看出来问题发生的上下文。

## IDE高效调试
* 地址: https://www.bilibili.com/video/BV1bF411q7R4
* 说明: 如何调试SRS，同时开多个窗口看调用链函数，还能快速搜索

## SRS高效理解代码
* 地址: https://www.bilibili.com/video/BV1Bp4y1v7hR
* 说明: 如何高效的了解SRS的代码，推荐使用工具，能够更快速和全面的掌握代码上下文。

## SRS：如何用NGINX搭建HLS分发集群
* 地址: https://www.bilibili.com/video/BV1DP4y1K7Jc
* 说明: SRS作为源站，用NGINX作为边缘集群，实现大规模的HLS或DASH的分发，也可以配合SRS Edge分发FLV，也可以用NGINX支持HTTPS HLS或FLV。SRS的集群，终于补上了重要一块拼图。

## SRS十年岔路：SRS 5.0核心问题定义和解法
* 地址: https://www.bilibili.com/video/BV1bY4y1L7Kn
* 说明: 时光过隙，SRS已经进入第十年了，十年岔路有非常多的挑战和问题，SRS又如何做出调整和选择，SRS对于音视频开源服务器的核心任务有哪些认知的变化，开源社区对SRS的影响又有哪些。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/tutorial/zh/v5/srs-open-source)


