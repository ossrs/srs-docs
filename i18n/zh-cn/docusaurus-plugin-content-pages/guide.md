# Guide

新同学专用的学习路径，请一定按照文档操作。

<a name="start"></a>

## [快速预览](#start)

先过第一个门槛：看到直播和WebRTC长什么样子，能跑出来下图的效果，需要`5～15分钟`左右。

![](/img/page-guide-001.png)

> Note: 这个看似很容易，甚至直接在[SRS官网](/docs/v4/tools/demo)中就能点开两个页面，但是一定要自己用SRS搭建出来才算，而不是直接打开线上的演示网页。

具体怎么做呢？请参考[Wiki: Getting Started](/docs/v5/doc/getting-started)。推荐用SRS Stack快速跑通，你也可以用宝塔快速部署，请看视频教程：[SRS Stack：起步、购买和入门](https://www.bilibili.com/video/BV1844y1L7dL/)

接触一个新的东西，首先就要有直观的体验和感觉，这个门槛虽然看起来很简单，但是它涉及到了音视频的几乎全链路的东西：

* FFmpeg，强大的音视频客户端，推拉流和编解码，以及各种处理的能力。
* Chrome（或浏览器），H5是最便捷的客户端，非常方便演示和学习，SRS功能基本上都有H5的演示。
* 音视频协议：RTMP，HTTP-FLV，HLS和WebRTC，这些操作步骤中，已经涉及到了这些协议，也是实际应用中典型的用法。
* SRS服务器，自己部署音视频云，或者提供音视频的云服务，SRS本质上就是视频云的一种服务器。

> Note: 上面的拼图还缺少移动端，其实移动端只是一种端，而并没有新的协议，也可以下载[SRS直播](http://ossrs.net/releases/app.html)客户端，体验上面的推流和播放，也可以输入你的服务器的流地址播放。

<a name="scenario"></a>

## [深入场景](#scenario)

第二个门槛：了解音视频应用的各个典型场景，大约五个核心场景，总共需要`3~7天`左右。

典型的音视频业务场景，包括但不限于：

* 全平台直播，小荷才露尖尖角。只需要上图的Encoders(FFmpeg/OBS)[推送RTMP到SRS](/docs/v4/doc/sample-rtmp)；一台SRS Origin(不需要Cluster)，[转封装成HTTP-FLV流](/docs/v4/doc/sample-http-flv)、[转封装成HLS](/docs/v4/doc/sample-hls)；Players根据平台的播放器可以选HTTP-FLV或HLS流播放。
* WebRTC通话业务，[一对一通话](https://mp.weixin.qq.com/s/xWe6f9WRhtwnpJQ8SO0Eeg)，[多人通话](https://mp.weixin.qq.com/s/CM2h99A1e_masL5sjkp4Zw)，会议室等。[WebRTC](/docs/v4/doc/webrtc)是SRS4引入的关键和核心的能力，从1到3秒延迟，到100到300毫秒延迟，绝对不是数字的变化，而是本质的变化。
* 监控和广电上云，各行业风起云涌。除了使用FFmpeg主动[拉取流到SRS](/docs/v4/doc/ingest)，还可以广电行业[SRT协议](/docs/v4/doc/sample-srt)推流，或监控行业[GB28181协议](https://github.com/ossrs/srs/issues/1500#issue-528623588)推流，SRS转换成互联网的协议观看。
* 直播低延迟和互动，聚变近在咫尺。[RTMP转WebRTC播放](https://github.com/ossrs/srs/issues/307#issue-76908382)降低播放延迟，还能做[直播连麦](https://mp.weixin.qq.com/s/7xexl07rrWBdh8xennXK3w)，或者使用WebRTC推流，未来还会支持WebTransport直播等等。
* 大规模业务，带你装逼带你飞。如果业务快速上涨，可以通过[Edge Cluster](/docs/v4/doc/sample-rtmp-cluster)支持海量Players，或者[Origin Cluster](/docs/v4/doc/sample-origin-cluster)支持海量Encoders，当然可以直接平滑迁移到视频云。未来还会支持RTC的级联和集群。

每个场景都可以自己搭建出来典型的应用。

<a name="more"></a>

## [了解细节](#more)

第三个门槛：了解每个纵向的技术点，应用场景，代码和问题排查，大约`3～6月`左右。

* [视频专栏](/docs/v4/tutorial/srs-server)，包括环境搭建，代码分析，还有专业老师的讲解。
* [部署方案](/docs/v4/category/main-protocols)，如何部署实现不同的具体功能，这些功能可以组合起来使用。
* [集群和扩展](/docs/v4/category/clusters)，当业务量上升，如何扩展单机到集群，如何服务不同区域的用户。
* [集成和定制](/docs/v4/category/openapi)，如何和现有系统对接，如何验证用户，安全和防盗链机制等。

如果能踏踏实实的了解完SRS，音视频真不难。

如果总想着三分钟XXX，那可不是很难么？
