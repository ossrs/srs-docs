---
title: 分发方式比较
sidebar_label: 分发方式比较
hide_title: false
hide_table_of_contents: false
---

# 分发方式比较

互联网上的两种主要的分发方式：直播和WebRTC，什么时候用谁，完全决定于应用场景。

* 直播：[HLS](./delivery-hls.md)，[RTMP](./delivery-rtmp.md)和[HTTP-FLV](./delivery-http-flv.md)，主要是娱乐和教育场景。
* WebRTC：[RTC](./webrtc.md)，主要应用于通话，直播连麦，教育等场景。

还有其他的分发方式，这些分发方式不属于互联网常见和通用的方式，不予以比较：
* UDP：譬如YY的实时应用，视频会议等等，或者RTSP之类。这类应用的特点就是实时性要求特别高，以毫秒计算。TCP家族协议根本就满足不了要求，所以HTTP/TCP都不靠谱。这类应用没有通用的方案，必须自己实现分发（服务端）和播放（客户端）。
* P2P：譬如RTMFP或者各家自己的协议。这类应用的特点是节省带宽。目前PC/flash上的RTMFP比较成熟，Android上的P2P属于起步群雄纷争标准不一，IOS上P2P应该没有听说过。
* RTSP：这种不是互联网上的主要应用，在其他领域譬如安防等有广泛应用。

另外，HTTP的也分为几种：
* HTTP progressive：早期流媒体服务器分发http文件时，以普通的http文件分发，这种叫做渐进式下载，意思就是如果文件很大譬如1小时时长1GB大小，想从中间开始播放是不行的。但这种方式已经是作古了，很多http服务器支持http文件的seek，就是从中间开始播放。
* HTTP stream：支持seek的HTTP流，譬如各家视频网站的点播分发方式。或者稍微复杂点的，譬如把一个大文件切几段之后分发。目前在pc/flash上点播国内的主流分发是这种方式。
* HLS：这种是现在适配方式最广（除了flash, 需要额外的as库支持），在PC上有vlc，Android/IOS原生播放器就支持播放HLS，HTML5里面的url可以写HLS地址。总之，在移动端是以HLS为主。
* HDS：adobe自己的HLS，一坨屎。
* DASH：各家提出的HLS，目前还没有广泛应用。

对比以下互联网上用的流媒体分发方式：
* HLS：apple的HLS，支持点播和直播。
* HTTP：即HTTP stream，各家自己定义的http流，应用于国内点播视频网站。
* RTMP：直播应用，对实时性有一定要求，以PC为主。

## RTMP

RTMP本质上是流协议，主要的优势是：
* 实时性高：RTMP的实时性在3秒之内，经过多层CDN节点分发后，实时性也在3秒左右。在一些实时性有要求的应用中以RTMP为主。
* 支持加密：RTMPE和RTMPS为加密协议。虽然HLS也有加密，但在PC平台上flash对RTMPE/RTMPS支持应该比较不错。
* 稳定性高：在PC平台上flash播放的最稳定方式是RTMP，如果做CDN或者大中型集群分发，选择稳定性高的协议一定是必要的。HTTP也很稳定，但HTTP是在协议上稳定；稳定性不只是服务端的事情，在集群分发，服务器管理，主备切换，客户端的支持上，RTMP在PC分发这种方式上还是很有优势。
* 编码器接入：编码器输出到互联网（还可以输出为udp组播之类广电应用），主要是RTMP。譬如专业编码器，或者flash网页编码器，或者FMLE，或者ffmpeg，或者安防摄像头，都支持RTMP输出。若需要接入多种设备，譬如提供云服务；或者希望网页直接采集摄像头；或者能在不同编码器之间切换，那么RTMP作为服务器的输入协议会是最好的选择。
* 系统容错：容错有很多种级别，RTMP的集群实现时可以指定N上层，在错误时切换不会影响到下层或者客户端，另外RTMP的流没有标识，切到其他的服务器的流也可以继续播放。HLS的流热备切换没有这么容易。若对于直播的容错要求高，譬如降低出问题的概率，选择RTMP会是很好的选择。
* 可监控：在监控系统或者运维系统的角度看，流协议应该比较合适监控。HTTP的流监控感觉没有那么完善。这个不算绝对优势，但比较有利。

RTMP的劣势是：
* 协议复杂：RTMP协议比起HTTP复杂很多，导致性能低下。测试发现两台服务器直连100Gbps网络中，HTTP能跑到60Gbps，但是RTMP只能跑到10Gbps，CPU占用率RTMP要高很多。复杂协议导致在研发，扩展，维护软件系统时都没有HTTP那么方便，所以HTTP服务器现在大行其道，apache/nginx/tomcat，N多HTTP服务器；而RTMP协议虽然早就公开，但是真正在大规模中分发表现良好的没有，adobe自己的FMS在CDN中都经常出问题。
* Cache麻烦：流协议做缓存不方便。譬如点播，若做RTMP流协议，边缘缓存RTMP会很麻烦。如果是HTTP，缓存其实也很麻烦，但是HTTP服务器的缓存已经做了很久，所以只需要使用就好。这是为何点播都走HTTP的原因。

## HTTP

HTTP说的是HTTP流，譬如各大视频网站的点播流。

HTTP本质上还是文件分发，主要的优势是：
* 性能很高：HTTP的性能没得说，协议简单，各种HTTP高性能服务器也完善。如果分发的量特别大，譬如点播视频网站，没有直播的实时性要求，HTTP协议是最好选择。
* 没有碎片：HTTP比HLS没有碎片，HTTP分发大文件会比小文件分发方便很多。特别是存储，小文件的性能超低，是个硬伤。
* 穿墙：互联网不可能不开放HTTP协议，否则就不叫互联网。所以任何端口封掉，也不会导致HTTP流看不了。（不过RTMP也能穿墙，用RTMPT协议）。

HTTP的劣势是：
* 实时性差：基本上没有实时性这个说法。
* 原生支持不好：就PC上flash对于HTTP流支持还可以，Android/IOS上似乎只能mp4，总之移动端对于HTTP的支持不是很完善。

## HLS

HLS是Apple的开放标准，在Android3?以上也原生支持.

HLS的主要优势是：
* 性能高：和HTTP一样。
* 穿墙：和HTTP一样。
* 原生支持很好：IOS上支持完美。Android上支持差些。PC/flash上现在也有各种as插件支持HLS。

HLS的主要劣势是：
* 实时性差：基本上HLS的延迟在10秒以上。
* 文件碎片：若分发HLS，码流低，切片较小时，小文件分发不是很友好。特别是一些对存储比较敏感的情况，譬如源站的存储，嵌入式的SD卡。

## 应用方式

参考[HTTP](./delivery-hls.md)和[RTMP](./delivery-rtmp.md)

推荐的方式是：
* 编码器输出RTMP协议。
* 流媒体系统接入使用RTMP协议。
* 流媒体系统内部直播分发使用RTMP。
* PC+直播+实时性要求高：使用flash播放RTMP。
* PC+直播+没有实时性要求：使用RTMP或者HLS均可。
* PC+点播：使用HTTP或者HLS。
* Apple IOS/OSX：都使用HLS（实时性要求高得自己解析RTMP，或者使用外部库，譬如[https://www.vitamio.org](https://www.vitamio.org)）
* Andorid：和IOS一样，不过可以确定的是可以自己开发支持RTMP。

Winlin 2014.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/rtmp-pk-http)


