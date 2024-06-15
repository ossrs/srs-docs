---
slug: video-chat-live
title: SRS - 如何实现直播间连麦
authors: []
tags: [tutorial, video, chat, streaming]
custom_edit_url: null
---

这十年是音视频快速发展的十年，从互动娱乐和电商直播，到互联网会议和在线教育，最近火热的元宇宙，音视频是基础能力之一。

从直播间连麦场景出发，可以了解互联网音视频所涉及的技术，由此深入学习音视频的相关技术点，可以让自己建立完整的音视频技术体系，快速应用到线上业务中。

<!--truncate-->

# Introduction

![](/img/blog-2022-06-30-001.jpeg)

2015年音视频直播迎来了大的爆发，典型的场景是互动娱乐和电商直播。2017年WebRTC迅猛发展，典型场景是互联网会议、在线教育、低延迟直播和互动。2021年开始炒元宇宙，音视频也是基础能力之一。

音视频的爆发性增长，是由于云计算、基础网络和智能终端的快速发展和完善。基础网络这十年是飞速发展，4G的广泛应用，宽带基本实现了全国犄角旮旯的覆盖。智能终端特别是智能手机的普及，中国进入移动互联网时代。信息的传递方式逐步可以使用更直观的音视频。

![](/img/blog-2022-06-30-002.jpeg)

在这些纷繁复杂的音视频场景中，直播和WebRTC是互联网音视频的核心技术，主要的应用场景，都可以由这两个技术组合应用实现。直播间连麦这个场景，是直播和WebRTC两种技术的最佳结合。

从直播间连麦场景出发，可以了解互联网音视频所涉及的技术，由此深入学习音视频的相关技术点，可以让自己建立完整的音视频技术体系。

# Prerequisites

前提条件，需要具备的知识点，或依赖的工具：

* 一台云主机，带公网IP。推荐[Oryx](./Oryx-Tutorial)，带有音视频服务器Oryx，腾讯云Lighthouse或CVM有Oryx镜像，其他云主机可以用宝塔安装。
* 有一定的软件开发基础，虽然设计了比较简单的入门场景，还是有部分场景需要移动端开发能力，以及Linux服务器的操作能力。
* [可选] 注册的域名，申请合法的HTTPS证书必须得域名，用于WebRTC推流；无域名只能使用自签名证书，操作麻烦些，也是可行的。

下面是实现直播连麦场景的步骤，从简单的场景入手，逐步实现直播连麦。

# Step 1: Build a Live Room using RTMP and HLS

![](/img/blog-2022-06-30-002.jpeg)

直播间连麦，我们首先需要搭建普通直播间，虽然没有连麦的能力，但是直播推流和观看是基本的能力。

由于普通直播非常完善，是最容易实现的一个场景，甚至不需要具备编程知识，使用现有的工具链就可以完成。

首先，我们下载推流的工具[OBS](https://obsproject.com/)，这是广泛使用的推流工具，网上有非常多的文档和视频教程，可以花时间了解下基本用法。我们选择`Settings > Stream > Service(Custom)`，OBS的推流地址由两部分组成，一般直播平台都会给出来，例如：

* Server，推流地址，例如视频号的是：`rtmp://******.livepush.myqcloud.com/trtc_**********/`
* Stream Key，推流密钥，例如视频号的是：`live_******?txSecret=******&txTime=******`

然后，我们看直播平台。按照实现的难易程度，从容易到复杂，有三个方式可供选择：

* SaaS：直接使用现有的直播平台。好处：无难度，可直接大规模商用；不足：不可定制，无法了解直播原理。
* 开源方案：使用开源服务器搭建直播平台。好处：容易使用，可编程定制，能理解直播的原理；不足：需要搭建服务器，无法大规模使用。
* PaaS：使用直播云服务。好处：容易使用，有一定定制性，可直接大规模商用；不足：需要云账号，可能需要付费。

> Note: 这章我们只介绍SaaS和开源方案，由于PaaS云服务包含了直播和连麦，我们放在后面统一介绍。

我们在SaaS平台上新建一个直播，不同平台会有审核或其他要求，达到要求后就可以创建直播，比如[视频号](https://channels.weixin.qq.com/platform/live/liveBuild)或[B站](https://link.bilibili.com/p/center/index#/my-room/start-live)，创建直播后就可以拿到OBS的两个推流参数。推流到SaaS后，就可以使用SaaS的客户端观看。比如视频号是可以转发到微信群和朋友圈，在微信上就可以观看了；比如B站是B站的App，也可以通过网页观看。整个直播的链路如下图所示：

```
OBS(主播) ---RTMP---> 视频号/B站平台 -----> 微信/B站App(观众)
```

SaaS做直播的好处是不用了解直播的细节，直接就能把直播做起来，用户也可以直接观看，当然也不能定制只能按平台设计的方式做直播，而且也不能自己部署服务器比如在学校或企业内部就无法部署一套视频号或B站的直播系统。

如果需要了解直播的原理，或者需要自己搭建直播平台，就可以选择使用开源方案。

直播开源方案，推流工具还是用[OBS](https://obsproject.com/)，使用方法也是一样的。但是我们需要自己部署服务器，也需要选择直播观看的客户端：

* 推流工具：OBS，vMix，芯象，腾讯会议等。
* 直播平台：Oryx，SRS，NginxRTMP等。
* 观看工具：Chrome浏览器，VLC等。

推荐使用Oryx，因为后面也可以用于连麦。最方便的部署SRS的方式使用[Oryx](./Oryx-Tutorial)，可以用腾讯云镜像一键部署，其他云或自己虚拟机可以用宝塔部署，具体请参考[视频教程](https://www.bilibili.com/video/BV1844y1L7dL/)。

部署好SRS后，可以使用OBS推流到SRS，地址一般比较简单，例如：

* Server: `rtmp://your-server-ip/live/`
* Stream Key: `livestream`

> Note：若使用Oryx，则`Stream Key`中可能有鉴权字符，例如`livestream?secret=******`，可以从Oryx的后台`私人直播间`拷贝就可以。

开源方案的播放器需要自己选择，比较简单的是[VLC](https://www.videolan.org/)，选择`File > Open Network`，然后输入地址：

* RTMP流： `rtmp://your-server-ip/live/livestream`
* FLV流：`http://your-server-ip/live/livestream.flv`
* HLS流：`http://your-server-ip/live/livestream.m3u8`

> Note: 若自己部署SRS，则HTTP端口默认是8080，需要在地址中加上，比如 `http://your-server-ip/live/livestream.flv`

用开源方案搭建直播，比较容易能看到整个直播的链路，如下图所示：

```
OBS(主播) ---RTMP---> SRS ----RTMP/FLV/HLS---> VLC
```

> Note: RTMP和FLV协议，客户端和SRS之间都是一个TCP连接。而HLS协议则是多个TCP连接。

一般用户不会使用VLC看直播流。其实也可以直接用浏览器看直播，比如[SrsPlayer](https://ossrs.net/players/srs_player.html)就可以输入FLV或HLS地址观看，包括PC和移动端都可以看HLS直播流。也可以将直播地址嵌入到WordPress博客页面，参考[链接](./WordPress-Plugin)，这样可以有比较丰富的内容展示。移动端除了H5观看HLS直播流，还可以用[ijkplayer](https://github.com/bilibili/ijkplayer)把直播流嵌入原生应用。

安装完[SrsPlayer](https://wordpress.org/plugins/srs-player/)插件后，新建一个Post或Page，嵌入直播流到WordPress页面：

```
[srs_player url="http://your-server-ip/live/livestream.flv"]
```

> Note: 在线DEMO，请看[FLV直播直播流展示](https://wp.ossrs.net/live-demo-flv/)。

> Note: 针对不同的业务要求，我们可以选择不同的直播流，一般FLV的延迟比较低兼容性不如HLS，HLS延迟比较大但平台的兼容性很好。还可以使用WebRTC观看直播流，这个就不在这里介绍，有兴趣可以自己摸索。

使用SRS搭建直播，虽然能看到直播的全链路过程，但有个明显的问题，就是这里只有一台SRS服务器，能支持的观看人数是有限的，除了少数场景的流很少，一般都需要支持成百上千甚至上万人观看。可以用多台SRS组成集群，可以支持更多人观看，我们不展开讲这个实现，可以参考[SRS集群](../docs/v4/doc/introduction#cluster-guides)。

> Note: SRS集群和直播云服务还是有区别的，SRS集群只是扩展了SRS的并发能力，一般在企业或学校内网可以用，但在互联网上的直播云服务除了并发，还需要支持就近调度、计量计费、运维监控、安全防护等，详细可以参考CDN的原理。

现在我们了解了直播如何实现，接下来我们考虑如何实现连麦，然后将连麦转成直播流，就实现了有连麦能力的直播间。

# Step 2: Start Video Chat using WebRTC

![](/img/blog-2022-06-30-004.jpeg)

连麦本质上就是通话，两个主播之间互相交流，然后把交流的画面变成直播流推送到直播平台。既然要交流，明显是需要推流和拉流，这和之前的主播不同，之前只推流并不拉流。

无论选择什么技术、平台或架构，从流的图上看，连麦就是一个通话的过程:

```
主播 <---RTC---> 服务器或平台 <---RTC---> 主播
```

> Note: 和直播一般用TCP协议不同，这里RTC一般是UDP协议，是不会有TCP连接，但从逻辑的流来看，主播之间是需要互相推拉流，才能完成连麦或通话过程。

通话和直播非常不一样的是，通话并没有统一的标准协议，因此客户端都是和平台绑定的，不同的供应商和方案之间的客户端是不能互通的。因此我们在实现通话能力时，只能根据我们不同方案选择不同的客户端。

> Note: WebRTC是通话中的一个标准，但实际上WebRTC也不是一个RFC，而是几十个核心RFC构成。另外，在业务信令、QoS拥塞控制算法、语音算法、编解码算法上，各个平台针对自己的业务特点和优化，都设计了私有协议，因此就算各平台支持的WebRTC也是不能互通的。

同样，最简单的通话方案是SaaS，可以选择腾讯会议或Zoom两个通话的SaaS，它们都有自己的客户端和账号体系，只需要下载就可以使用了。

若使用开源搭建，推荐SRS服务器。最方便的部署SRS的方式使用[Oryx](./Oryx-Tutorial)，可以用腾讯云镜像一键部署，其他云或自己虚拟机可以用宝塔部署，具体请参考[视频教程](https://www.bilibili.com/video/BV1844y1L7dL/)。

由于WebRTC推流，必须使用HTTPS，而HTTPS必须要域名和证书，可以参考[如何设置HTTPS](./Oryx-HTTPS)。当然如果使用自签名证书也可以，需要手动允许自签名证书。

安装好Oryx后，我们打开后台`私人直播间`，选择`WebRTC推流`，点击更换流名称按钮，获取推流和播放链接，每个主播一个流地址比如：

* 主播A：`webrtc://lh.ossrs.net:443/live/acagdd?secret=xxx`
* 主播B：`webrtc://lh.ossrs.net:443/live/ccdkkc?secret=xxx`

每个主播只需要打开自己的推流，和对方的播放页面，就可以实现连麦通话了。流传输图如下：

```
主播A ----WebRTC-----> SRS ----WebRTC---> 主播B
主播B ----WebRTC-----> SRS ----WebRTC---> 主播A
```

> Note: 主播之间交换播放的地址，其实就是一种业务信令；两个主播连麦，可以通过手动交换彼此的播放地址；如果有10主播连麦，就需要一个业务信令的服务器，实现加入房间后自动交换信令。

同样，可以将WebRTC推流和播放嵌入到WordPress博客页面，参考[链接](./WordPress-Plugin)，这样可以有比较丰富的内容展示。

安装完[SrsPlayer](https://wordpress.org/plugins/srs-player/)插件后，新建一个Post或Page，例如主播A的页面，嵌入推流和播放对方流的地址：

```
[srs_publisher url="webrtc://your-server-ip/live/stream-a"]
[srs_player url="webrtc://your-server-ip/live/stream-b"]
```

> Note: 在线DEMO，请看[WebRTC：主播A页面](https://wp.ossrs.net/webrtc-hosta/)。

主播B的页面，嵌入推流和播放对方流的地址：

```
[srs_publisher url="webrtc://your-server-ip/live/stream-b"]
[srs_player url="webrtc://your-server-ip/live/stream-a"]
```

> Note: 在线DEMO，请看[WebRTC：主播B页面](https://wp.ossrs.net/webrtc-hostb/)。

两个主播分别打开页面，就可以实现连麦了。

> Note: 可以实现一个动态页面，在一个页面中实现推流，和拉取其他人的流，这个只需要一个业务服务器交换URL地址就可以，实现起来比较容易。

接下来，我们只需要将连麦或通话的场景，转成直播流就实现了直播连麦。

# Step 3: Covert WebRTC to RTMP

![](/img/blog-2022-06-30-005.jpeg)

![](/img/blog-2022-06-30-006.jpeg)

将连麦转成直播流，从技术上看有几种方案：

* 客户端混流：使用OBS抓取连麦的画面和声音，OBS天然就具备混流和布局的能力，然后推直播就可以。
* 服务器混流：连麦的平台将连麦的流混流后转直播流，或者将WebRTC流转RTMP流后混流。

先看简单的`客户端混流`方案，客户端OBS中，新建`Sources > Window Capture`，抓取连麦的腾讯会议或者WebRTC网页。然后选择`Settings > Audio > Global Audio Device > Desktop Audio > Default`，就可以添加一个桌面音频(Desktop Audio)，也就是连麦的混音。

> Note: OBS也可以多次抓取后，裁剪窗口，实现更加复杂的布局。

对于WebRTC，可以新建一个单独页面，将主播的流拉出来，但不推流，如下所示：

```
[srs_player url="webrtc://your-server-ip/live/stream-a"]
[srs_player url="webrtc://your-server-ip/live/stream-b"]
```

> Note: 在线DEMO，请看[WebRTC：主播B页面](https://wp.ossrs.net/webrtc-mergeab/)。

在OBS中，新建一个`Sources > Browser`，打开这个页面，就可以把视频和声音都抓出来了。OBS也可以对页面进行裁剪，实现不同的布局，比如把视频画面放到一个背景中，可以加上文字说明和UI设计，可以达到新闻演播室的效果了。

还有一种办法，`服务器混流`方案，就是将每个RTC流转成RTMP流，然后使用FFmpeg命令行合并两个流：

```bash
ffmpeg -f flv -i rtmp://your-server-ip/live/stream-a -f flv -i rtmp://your-server-ip/live/stream-b \
     -filter_complex "[1:v]scale=w=96:h=72[ckout];[0:v][ckout]overlay=x=W-w-10:y=H-h-10[out]" -map "[out]" \
     -c:v libx264 -profile:v high -preset medium \
     -filter_complex amix -c:a aac \
     -f flv -y rtmp://your-server-ip/live/merge
```

这种方式比OBS复杂一些，但是它可以在服务器上直接取本机的RTMP流转换，而且可以使用程序启动这个命令，有利于在产品中实现这个能力。

从流的处理上看，这个方案是：

```
StreamA ----WebRTC-----> SRS ----RTMP---+
                                        +--> FFmpeg ---RTMP--> 直播
StreamB ----WebRTC-----> SRS ----RTMP---+ 
```

从技术方案上看，完全可以直接混合RTC的流，这就是一般说的MCU模式（SRS是SFU模式）：

```
StreamA ----WebRTC-----> SRS ----RTC---+
                                        +--> MCU ---RTMP--> 直播
StreamB ----WebRTC-----> SRS ----RTC---+ 
```

这种方案去掉了RTMP的中间过程，效率更高，而且也可以利用RTC的拥塞算法等优势，实现SFU和MCU的跨机房部署。

> Note: 目前会议平台都是使用这种MCU的模式实现混流，开源项目可以参考[OWT](https://github.com/open-webrtc-toolkit/owt-server)。

# Step 4: Scale Out by Cloud Service

![](/img/blog-2022-06-30-006.jpeg)

SaaS（视频号和腾讯会议）无门槛但不够灵活，开源方案（SRS、OBS、WebRTC和FFmpeg）非常灵活但要搭建全部的系统，特别是大规模的分发网络不是一两天可以建成的。

PaaS就是比SaaS更灵活更容易实现自己业务，但是比开源不用自建庞大的基础设施，PaaS提供的各种平台服务比如云直播、TRTC、云点播、云IM和客户端视立方等等，这些基础服务像积木一样，可以根据自己的业务灵活组合使用，我们只需要关注业务实现。

我们选择[腾讯云“小直播”](https://cloud.tencent.com/document/product/454/38625)，小直播 App 是一套开源的、完整的在线直播解决方案，它基于云直播服务、即时通信（IM）构建，并使用云函数（Serverless）提供标准的后台服务，可以实现登录、注册、开播、房间列表、连麦互动、文字互动和弹幕消息等功能。

开通腾讯云直播服务后，点击[直播SDK > License管理](https://console.cloud.tencent.com/live/license)，新建一个测试的License，信息如下：

* License URL: `https://license.vod2.myqcloud.com/license/v2/xxx/v_cube.license`
* License Key: `xxxxxxxxxxxxxxx`

然后，点击[连麦管理 > 连麦应用](https://console.cloud.tencent.com/live/micro/appmanage)，新建一个连麦的应用，信息如下：

* SDKAppID: `1400xxxxxxx`
* SecretKey(密钥或秘钥): `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

接着，在[连麦应用](https://console.cloud.tencent.com/live/micro/appmanage)，选择`CDN观看配置页 > 旁路推流 > 全局自动旁路`，这样可以将RTC流转换成RTMP直播流。

下载客户端代码：

```bash
git clone https://github.com/tencentyun/XiaoZhiBo
```

以iOS为例，安装依赖，打开iOS工程：

```bash
cd XiaoZhiBo/iOS/APP
pod install
open XiaoZhiBoApp.xcworkspace
```

> Note: 详细命令，以及Android系统，请参考[运行小直播App](https://cloud.tencent.com/document/product/454/38625#.E6.AD.A5.E9.AA.A42.EF.BC.9A.E8.BF.90.E8.A1.8C.E2.80.9C.E5.B0.8F.E7.9B.B4.E6.92.AD.E2.80.9Dapp)

打开文件`XiaoZhiBo/iOS/APP/Debug/GenerateGlobalConfig.swift`，设置好参数：

* LICENSEURL	默认为 PLACEHOLDER ，请设置为实际的 License URL 信息
* LICENSEURLKEY	默认为 PLACEHOLDER ，请设置为实际的 License Key 信息
* SDKAPPID	默认为 PLACEHOLDER , 请设置为实际的 SDKAppID
* SECRETKEY	默认为 PLACEHOLDER ，请设置为实际的密钥信息
* PLAY_DOMAIN	默认为 PLACEHOLDER ，请设置为实际的拉流域名

> Note: 其中`PLAY_DOMAIN`就是直播的播放域名，可以在[云直播 > 域名管理](https://console.cloud.tencent.com/live/domainmanage)中配置播放域名。

修改工程的`Bundle identifier`字段为 License 信息所对应的包名。连上 iOS 设备，编译并运行即可。

# Conclusion

通过直播连麦，我们了解了直播的全链路原理，直播平台的搭建，WebRTC通话原理，WebRTC通话实现连麦的搭建，以及将连麦转成直播的多种技术方案。此外，我们也了解了如何使用SaaS工具，以及PaaS云平台，实现直播连麦，快速应用到线上业务中。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/22-06-30-Video-Chat-Live)


