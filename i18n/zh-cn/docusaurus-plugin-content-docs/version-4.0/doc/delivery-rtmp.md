---
title: RTMP 分发
sidebar_label: RTMP 分发
hide_title: false
hide_table_of_contents: false
---

分发RTMP流

SRS（Simple RTMP Server）分发RTMP是核心功能，srs的主要定位就是分发RTMP低延时流媒体，同时支持分发HLS流。

RTMP和HLS的优势参考：[HLS](./delivery-hls)

RTMP和HLS的比较参考：[RTMP PK HLS](./rtmp-pk-http)

部署RTMP的实例参考：[Usage: RTMP](./sample-rtmp)

## 应用场景

RTMP是PC-flash支持最完善的流分发方式，主要的应用场景包括：
* 无插件流媒体应用：十年前各种浏览器插件大行其道，最后adobe的flash一统天下，现在如何观看视频还需要用户装插件，已经是非常罕见的事情。打开浏览器就能用，不用装插件，这是RTMP的最基本的应用方式。
* 适配广泛的播放器：如果没有专业的flash开发人员，那么RTMP会是个很好的选择，只要3行代码就能完成一个播放器，和html5的video标签一样方便。HDS/HLS在PC上，都需要库支持，N行代码很麻烦。
* 苛刻的稳定性支持：RTMP服务器能365x24提供服务，当然http服务器也可以。客户端的稳定性呢？RTMP在flash中连续播放10天没有问题，flash如果播放HTTP流就真的很难讲。如果在PC上需要客户端长时间播放，稳定播放，选择RTMP会是最佳选择。
* 稳定的较小延迟：RTMP延迟在0.8-3秒，能应用于交互式直播，视频会议，互动式直播等等。如果对延时有一定要求，就不要选择HLS，RTMP会是最佳选择。
* 通用接入标准：RTMP是编码器到服务器的实际标准协议，所有编码器都支持RTMP推送流。选择RTMP作为直播接入协议，能适配多种编码器，不至于绑定到一种编码器。如果服务器只能接入HTTP FLV流，像某些公司做的私有协议，那么对接通用编码器就有问题。何必闭门造车？！绑定用户的方式在于良好的客户关系和优秀的软件质量，而不是上了贼船就下不了船了。

SRS直播将RTMP作为基本协议，以各种方式转码为RTMP后输入到SRS，输出为RTMP和HLS，支持广泛的客户端和各种应用场景。

SRS点播还在计划中，不会使用RTMP作为点播协议，点播还是文件为主，即HTTP协议为主。

## FlashRTMP

RTMP最初就是adobe在flash上的协议，flash播放RTMP只需要几行as代码：

```bash
var conn = new NetConnection();
var stream = new NetStream(conn);
var video = new Video();
this.addChild(video);
video.attachNetStream(stream);
conn.connect("rtmp://192.168.1.170/live");
stream.play("livestream");
```

## 配置RTMP流

SRS只需要配置vhost和侦听端口，以及支持的最大连接数，就可以支持RTMP：

```bash
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
}
```

启动服务器：`./objs/srs -c conf/rtmp.conf`

## 推送RTMP流

可以使用支持RTMP输出的编码器，譬如FMLE。在FMS URL中输入vhost/app，在Stream中输入流名称。譬如：

```bash
# 譬如RTMP流：rtmp://192.168.1.170/live/livestream
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

RTMP的URL规则，Vhost规则，参考：[RTMP URL&Vhost](./rtmp-url-vhost)

部署分发RTMP流的实例，参考：[Usage: RTMP](./sample-rtmp)

如下图所示：
![FMLE推流到SRS](http://ossrs.net/srs.release/wiki/images/FMLE.png)

## 观看RTMP流

可以使用支持RTMP流的播放器播放，譬如vlc/flash player，播放地址：`rtmp://192.168.1.170/live/livestream`

## RTMP流的低延时配置

RTMP流的延时在1-3秒，比HLS的延时更靠谱，低延时的配置参考：[低延时](./low-latency)

Winlin 2013.10
