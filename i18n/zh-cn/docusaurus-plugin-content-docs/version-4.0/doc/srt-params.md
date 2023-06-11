---
title: SRT 参数
sidebar_label: SRT 参数
hide_title: false
hide_table_of_contents: false
---

# SRT参数配置

SRT有一些重要的参数配置，在SRT的流收发中非常重要。SRS支持对SRT重要参数的配置。

## 如何配置SRT参数

在srs的配置中，srt_server中有独立的配置，如下：
```
srt_server {
    enabled on;
    listen 10080;
    maxbw 1000000000;
    connect_timeout 4000;
    peerlatency 300;
    recvlatency 300;
    mix_correct on;
}
```
srt的配置配置在srt_server的模板下。
下面简介一下参数的配置，和其具体的含义。

### latency

单位：ms(毫秒)，默认值120ms。 
这个latency配置同时配置了recvlatency和peerlatency成同一个值。
* 如果recvlatency配置，将使用recvlatency的配置；
* 如果peerlatency配置，将使用peerlatency的配置；

### recvlatency

单位：ms(毫秒)，默认值120ms。 
这是接收方缓存时间长度，其包括报文从发送方出发，通过网络，接收方接收，直到上送给上层媒体应用。
也就是说这个缓存时间长度，其应该大于RTT，并且要为多次丢包重传做好准备。
推荐配置：
* 低延时网络 
    - 如果应用对延时要求低，可以考虑配置的参数低于250ms(常人对音视频低于250ms的延时不会被影响)
* 长距离，RTT比较大 
    - 因为传输距离长，RTT比较大，就不能配置太小的latency；
    - 或者是重要的直播，不要求低延时，但是要求无卡顿播放，无抖动；
    - 建议配置的latency >= 3*RTT, 因为其中包含丢包重传和ack/nack的周期。

### peerlatency

单位：ms(毫秒)，默认值120ms。 
是srt发送方设置peerlatency，告知接收方的latency buffer的时间长度应该是多少；如果接收方也配置了recvlatency，接收方就取两者中最大值作为latency buffer时间长度。
推荐配置：
* 低延时网络 
    - 如果应用对延时要求低，可以考虑配置的参数低于250ms(常人对音视频低于250ms的延时不会被影响)
* 长距离，RTT比较大 
    - 因为传输距离长，RTT比较大，就不能配置太小的latency；
    - 或者是重要的直播，不要求低延时，但是要求无卡顿播放，无抖动；
    - 建议配置的latency >= 3*RTT, 因为其中包含丢包重传和ack/nack的周期。

### tlpkdrop

- true 或者 false，默认是true 
- 太晚而丢弃(Too-late Packet Drop)
- 因为srt是针对于音视频的传输协议，接收方是基于报文时间戳或编码bitrate来上送报文给上层应用的。
- 也就是说，如果报文在接收方latency timeout后到达，报文也会应为太晚到达而被丢弃。
- 在直播模式下，tlpkdrop默认是true，因为直播对延时要求高。

### maxbw

单位: bytes/s, 默认值-1；
-  最大的发送带宽.
- `-1`: 表示最大带宽为1Gbps
- `0`: 由SRTO_INPUTBW的计算决定(不推荐在直播模式下设置为0)
- `>0`: 带宽为bytes/s

### mss

- 单位: byte 
- 单个发送报文最大的size。默认1500。
- 这个报文的大小指的是ip报文，其包含udp和srt协议报文的。

### connect_timeout

- 单位：ms(毫秒)，默认值是3000ms。 
- srt连接超时时间。

### sendbuf

- 单位：byte，默认值是8192 * (1500-28)。
- srt发送buffer大小；

### recvbuf

- 单位：byte，默认值是8192 * (1500-28)。
- srt接收buffer大小；

### payloadsize

- 单位：byte，默认值是1316=188x7 
- 因为srt承载的媒体数据是mpegts封装，而每个mpegts的最小包是188bytes，所以payloadsize是188的倍数，默认是1316bytes(188x7)

### mix_correct
* on: 使能
* off: 去使能

默认是使能状态。srt的媒体封装格式是mpegts，对于AAC在mpegts中的封装，会出现多个报文只携带一个dts时间戳，导致音视频不同步，所以在mpegts的解析过程，需要做一下音视频同步，默认使能。

Runner365 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v4/srt-params)


