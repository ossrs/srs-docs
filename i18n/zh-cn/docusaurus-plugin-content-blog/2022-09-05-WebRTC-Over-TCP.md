---
slug: webrtc-over-tcp
title: SRS - 支持WebRTC over TCP
authors: []
tags: [tutorial, video, webrtc, tcp]
custom_edit_url: null
---

# Support WebRTC over TCP

> Written by [Winlin](https://github.com/winlinvip), [李鹏](https://github.com/lipeng19811218)

在很多网络条件下，WebRTC不适合使用UDP传输，因此支持TCP传输是极其重要的能力；而且SRS支持的是直接TCP传输的方式，避免使用TURN中转带来的额外网络层问题；这对于LoadBalancer也是非常友好的，一般支持TCP会更友好。

<!--truncate-->

## Why Important?

大约两年前SRS支持了WebRTC，虽然支持了不少功能但还不够完善，这两年收到了很多反馈，其中常见的而且非常重要的有：

* 用不了UDP，可能是公司网络封掉了UDP协议，或者封掉了小于10000的UDP端口，总之各种不可用的场景，SRS有个小工具检测UDP端口可用性，请参考[#2843](https://github.com/ossrs/srs/issues/2843)。
* 媒体协议和端口太多了，TCP有RTMP(1935)和HTTP(80/443)，UDP有WebRTC(8000)和SRT(10080)，还有HTTP API端口(1985)，如何让协议端口更收敛？多开一个端口就多一份麻烦。HTTP API和Stream使用同样端口的问题，请参考[#2881](https://github.com/ossrs/srs/issues/2881)。
* UDP可用但丢包比较严重，有可能是[系统设置](https://www.jianshu.com/p/6d4a89359352)问题，也有可能是网络设备或环境导致丢包，往往TCP是没问题的，请参考[#2852](https://github.com/ossrs/srs/issues/2852)

如果SRS能像HTTP-FLV那样，在HTTP(80)端口传输媒体数据，那该多么简单？多么可靠啊！只要能上网，HTTP(80)端口就一定是可用的。流传输图如下：

```bash
Publisher --------RTC------> SRS --------RTC--------> Player
            (over TCP/80)           (over TCP/80)
```

> Note: 实际上WebRTC是有个API请求的，所以这里还省略了HTTP API请求，可以在同样端口上传输HTTP API，HTTP Stream和WebRTC数据。

专业人士一般会说：这个问题可以用TURN解决，流传输图如下：

```bash
Publisher -----> TURN ----> SRS -----> TURN -----> Player
         (over TURN/3478).      (over TURN/3478)
```

TURN的方案明显是不好的，有几个问题：

* 多引入了一个网元，需要额外考虑部署和依赖问题，而且有些TURN可能还没提供Docker。
* 多引入了一个协议，看起来简单的协议（几个交互），如何监控和排查问题，如何运维都是非常麻烦的。
* 延迟和成本问题，多一跳就多一次延迟，多一份网元就多一个集群，这都是真金白银的CPU消耗。

因此，WebRTC支持TCP传输，最好的方案是直接TCP传输而不是TURN协议，参考以下两个RFC：

* SDP and ICE: [TCP Candidates with Interactive Connectivity Establishment (ICE)](https://www.rfc-editor.org/rfc/rfc6544)
* RTP over TCP: [Framing RTP and RTCP Packets over Connection-Oriented Transport](https://www.rfc-editor.org/rfc/rfc4571)

下面介绍下SRS目前的进展。

## What's Now?

SRS 5.0正式解决了这个问题：

* HTTP API、HTTP Stream、WebRTC over TCP，可以全部复用一个TCP端口，比如HTTPS(443)。
* 支持直接UDP或TCP传输，不依赖TURN协议，没有额外的网元，没有额外部署和资源消耗。
* 可部署在LoadBalancer后面(已实现)，可配合[Proxy(未实现)](https://github.com/ossrs/srs/issues/3138)或者[Cluster(未实现)](https://github.com/ossrs/srs/issues/2091)实现负载均衡和扩容。

> Note: 注意需要升级到`v5.0.60+`，若使用Docker也请先确认SRS的版本。

我们先看最简单情况，用一个TCP(8080)端口，支持RTC推拉流：

```bash
docker run --rm -it -p 8080:8080/tcp \
  -e CANDIDATE="192.168.3.82" \
  -e SRS_HTTP_API_LISTEN=8080 \
  -e SRS_RTC_SERVER_TCP_ENABLED=on \
  -e SRS_RTC_SERVER_TCP_LISTEN=8080 \
  -e SRS_RTC_SERVER_PROTOCOL=tcp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:v5.0.60
```

* 推流(WebRTC over TCP): [http://localhost:8080/rtc/v1/whip/?app=live&stream=livestream](http://localhost:8080/players/whip.html?autostart=true&api=8080)
* 播放(WebRTC over TCP): [http://localhost:8080/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true&api=8080)

一般需要支持直播，所以下面，只用一个TCP(8080)端口，支持RTC和直播：

```bash
docker run --rm -it -p 8080:8080/tcp \
  -e CANDIDATE="192.168.3.82" \
  -e SRS_VHOST_RTC_RTC_TO_RTMP=on \
  -e SRS_HTTP_API_LISTEN=8080 \
  -e SRS_RTC_SERVER_TCP_ENABLED=on \
  -e SRS_RTC_SERVER_TCP_LISTEN=8080 \
  -e SRS_RTC_SERVER_PROTOCOL=tcp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:v5.0.60
```

* 推流(WebRTC over TCP): [http://localhost:8080/rtc/v1/whip/?app=live&stream=livestream](http://localhost:8080/players/whip.html?autostart=true&api=8080)
* 播放(WebRTC over TCP): [http://localhost:8080/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true&api=8080)
* 播放(HTTP FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true)
* 播放(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?stream=livestream.m3u8&autostart=true)

如果是非`localhost`推流，得使用HTTPS，所以可以默认使用TCP(8088)，启动命令如下：

```bash
docker run --rm -it -p 8088:8088/tcp \
  -e CANDIDATE="192.168.3.82" \
  -e SRS_VHOST_RTC_RTC_TO_RTMP=on \
  -e SRS_HTTP_API_LISTEN=8080 \
  -e SRS_HTTP_API_HTTPS_ENABLED=on \
  -e SRS_HTTP_API_HTTPS_LISTEN=8088 \
  -e SRS_HTTP_SERVER_HTTTPS_ENABLED=on \
  -e SRS_RTC_SERVER_TCP_ENABLED=on \
  -e SRS_RTC_SERVER_TCP_LISTEN=8088 \
  -e SRS_RTC_SERVER_PROTOCOL=tcp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:v5.0.60
```

* 推流(WebRTC over TCP): [webrtc://localhost:8088/live/livestream](https://localhost:8088/players/rtc_publisher.html?api=8088&autostart=true)
* 播放(WebRTC over TCP): [webrtc://localhost:8088/live/livestream](https://localhost:8088/players/rtc_player.html?api=8088&autostart=true)
* 播放(HTTP FLV): [https://localhost:8088/live/livestream.flv](https://localhost:8088/players/srs_player.html?schema=https&port=8088&autostart=true)
* 播放(HLS): [https://localhost:8088/live/livestream.m3u8](https://localhost:8088/players/srs_player.html?schema=https&port=8088&stream=livestream.m3u8&autostart=true)

> Note: 可以换成IP访问。注意由于是自签名证书，所以需要点击下空白处，然后敲入字符串`thisisunsafe`

上面是通过环境变量配置的SRS，如果你习惯配置文件，也是可以的，和WebRTC over TCP相关的详细配置如下：

```bash
rtc_server {
    # For WebRTC over TCP directly, not TURN, see https://github.com/ossrs/srs/issues/2852
    # Some network does not support UDP, or not very well, so we use TCP like HTTP/80 port for firewall traversing.
    tcp {
        # Whether enable WebRTC over TCP.
        # Overwrite by env SRS_RTC_SERVER_TCP_ENABLED
        # Default: off
        enabled off;
        # The TCP listen port for WebRTC. Highly recommend is some normally used ports, such as TCP/80, TCP/443,
        # TCP/8000, TCP/8080 etc. However SRS default to TCP/8000 corresponding to UDP/8000.
        # Overwrite by env SRS_RTC_SERVER_TCP_LISTEN
        # Default: 8000
        listen 8000;
    }
    # The protocol for candidate to use, it can be:
    #       udp         Generate UDP candidates. Note that UDP server is always enabled for WebRTC.
    #       tcp         Generate TCP candidates. Fail if rtc_server.tcp(WebRTC over TCP) is disabled.
    #       all         Generate UDP+TCP candidates. Ignore if rtc_server.tcp(WebRTC over TCP) is disabled.
    # Note that if both are connected, we will use the first connected(DTLS done) one.
    # Overwrite by env SRS_RTC_SERVER_PROTOCOL
    # Default: udp
    protocol udp;
}
```

我们上面演示的是和HTTP复用端口，使用独立的TCP端口也是完全没问题的，具体可以自己尝试了。

## Future Plan

饭一口口吃，路一步步走，代码一行行码；SRS欢迎大家贡献和参与，我们的深度开发者社区人越来越多了，已经达到了近50个深度定制SRS的开发者。

如果你在2013年错过了给SRS贡献RTMP，在2014年错过了贡献Edge集群，在2015年错过了贡献FLV，在2016年错过了贡献DVR，在2017年错过了MP4和DASH，在2018年错过了贡献Origin集群，在2019年错过了贡献Docker化和云原生，在2020年错过了SRT和WebRTC，在2021年错过了HLS集群，在2022年错过了新官网和SRT协程化。。。

今天，你又错过了贡献WebRTC over TCP，我和李鹏(TOC)花了两个下午搞定了；另外，也特别感谢夏立新(TOC)的预研，节省了我们不少时间。其实贡献并不难，难的是克服自己的惯性啊。

纵然有一万个不贡献的理由，对于程序员来说，有一个贡献的理由就够了：作为程序员，只白嫖开源却不曾贡献，和咸鱼又有何分别？！

你打算在2022年尾巴上错过贡献什么？还有4个月时间，我们就要冻结5.0的功能开发了，赶紧加入我们吧，还有非常多有意思又有价值的功能，等着你来一起完成。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2022-09-05-WebRTC-Over-TCP)

