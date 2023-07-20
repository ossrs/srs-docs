---
title: SRS 学习路径
sidebar_label: SRS 学习路径
hide_title: false
hide_table_of_contents: false
---

# Learning Path

新同学专用的学习路径，请一定按照文档操作。

## 快速预览

先过第一个门槛：看到直播和 WebRTC 长什么样子，能跑出来下图的效果，需要 5 ～ 15 分钟左右。

![](/img/doc-learning-path-001.png)

> Note: 这个看似很容易，甚至直接在 SRS 官网中就能点开两个页面，但是一定要自己用 SRS 搭建出来才算，而不是直接打开线上的演示网页。

具体怎么做呢？请参考 [Getting Started](./getting-started.md)。

接触一个新的东西，首先就要有直观的体验和感觉，这个门槛虽然看起来很简单，但是它涉及到了音视频的几乎全链路的东西：
- FFmpeg，强大的音视频客户端，推拉流和编解码，以及各种处理的能力。
- Chrome（或浏览器），H5 是最便捷的客户端，非常方便演示和学习，SRS 功能基本上都有 H5 的演示。
- 音视频协议：RTMP，HTTP-FLV，HLS 和 WebRTC，这些操作步骤中，已经涉及到了这些协议，也是实际应用中典型的用法。
- SRS 服务器，自己部署音视频云，或者提供音视频的云服务，SRS 本质上就是视频云的一种服务器。

> Note: 上面的拼图还缺少移动端，其实移动端只是一种端，而并没有新的协议，也可以下载 SRS 直播客户端，体验上面的推流和播放，也可以输入你的服务器的流地址播放。

## 深入场景

第二个门槛：了解音视频应用的各个典型场景，大约五个核心场景，总共需要 3~7 天左右。

典型的音视频业务场景，包括但不限于：
- 全平台直播，小荷才露尖尖角。只需要上图的 Encoders(FFmpeg/OBS)推送 RTMP 到 SRS；一台 SRS Origin(不需要 Cluster)，转封装成 HTTP-FLV 流、转封装成 HLS；Players 根据平台的播放器可以选 HTTP-FLV 或 HLS 流播放。
- WebRTC 通话业务，一对一通话，多人通话，会议室等。WebRTC 是 SRS4 引入的关键和核心的能力，从 1 到 3 秒延迟，到 100 到 300 毫秒延迟，绝对不是数字的变化，而是本质的变化。
- 监控和广电上云，各行业风起云涌。除了使用 FFmpeg 主动拉取流到 SRS，还可以广电行业 SRT 协议推流，或监控行业 GB28181 协议推流，SRS 转换成互联网的协议观看。
- 直播低延迟和互动，聚变近在咫尺。RTMP 转 WebRTC 播放降低播放延迟，还能做直播连麦，或者使用 WebRTC 推流，未来还会支持 WebTransport 直播等等。
- 大规模业务，带你装逼带你飞。如果业务快速上涨，可以通过 Edge Cluster 支持海量 Players，或者 Origin Cluster 支持海量 Encoders，当然可以直接平滑迁移到视频云。未来还会支持 RTC 的级联和集群。

每个场景都可以自己搭建出来典型的应用。

## 了解细节

第三个门槛：了解每个纵向的技术点，应用场景，代码和问题排查，大约 3 ～ 6 月左右。

- [视频专栏](./introduction.md#effective-srs)，包括环境搭建，代码分析，还有零声学院专业老师的讲解。
- [解决方案](./introduction.md#solution-guides)，大家在各个不同场景中，应用 SRS 的分享和探索。
- [部署方案](./introduction.md#deployment-guides)，如何部署实现不同的具体功能，这些功能可以组合起来使用。
- [集群和扩展](./introduction.md#cluster-guides)，当业务量上升，如何扩展单机到集群，如何服务不同区域的用户。
- [集成和定制](./introduction.md#integration-guides)，如何和现有系统对接，如何验证用户，安全和防盗链机制等。
- [深度分析](./introduction.md#develop-guide)，协程原理，代码分析，高性能服务器框架，性能优化等。

如果能踏踏实实的了解完 SRS，音视频真不难。

如果总想着三分钟 XXX，那可不是很难么？

作者：winlinvip

链接：https://www.jianshu.com/p/2662df9fe078

来源：简书

著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v4/learning-path)


