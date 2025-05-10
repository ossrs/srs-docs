---
title: RTSP
sidebar_label: RTSP
hide_title: false
hide_table_of_contents: false
---

# RTSP

RTSP是很古老的协议，已经有接近30年的历史。在安防行业，几乎每家公司都自己实现了一个RTSP服务器，但他们都不喜欢开源，还喜欢加很多私有的东西在里面。在市面上，你随便就能找到一个RTMP服务器，却很难找到一个RTSP服务器。

SRS最早在2.0版本就已经支持RTSP协议，但只有推流（ANNOUNCE → SETUP → RECORD），而没有拉流（DESCRIBE → SETUP → PLAY）。实际上，很多传统的C/S架构的客户端、解码器、嵌入式设备，以及最新的AI视觉检测等，首选播放协议仍然RTSP。

这个版本，复用了2.0的协议解析的部分代码，删除推流，新增拉流。同时，尽可能的复用了WebRTC模块，包括RTP打包，SDP解析，因为这些几乎是一样的。

## Usage

首先，编译和启动SRS，请确认版本为`7.0.xxxx`：

```bash
cd srs/trunk && ./configure && make -j16
./objs/srs -c conf/rtsp.conf
```
> 编译时必须开启`--rtc=on`（默认开启）。

然后，使用RTMP协议推流

```bash
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

最后，使用RTSP协议拉流，支持TCP和UDP两种方式

```bash
ffplay -rtsp_transport udp -i rtsp://localhost:8554/live/livestream
或者
ffplay -rtsp_transport tcp -i rtsp://localhost:8554/live/livestream
```

## Config

```bash
rtsp_server {
    enabled on;
    listen 8554;
}
```
RTSP默认端口是`554`，但是某些系统需要`root`权限，所以这里改成了`8554`。
同时因为复用了RTC模块，所以必须开启所有RTC相关的配置，如下：

```bash
rtc_server {
    enabled on;
    listen 8000;
    candidate $CANDIDATE;
}

vhost __defaultVhost__ {
    rtc {
        enabled     on;
        rtmp_to_rtc on;
        keep_bframe on;
    }
}
```

由于RTC不支持B帧，所以`keep_bframe`默认为`off`，但如果不考虑RTC播放，可以将其设置为`on`，RTSP协议是支持B帧的。

## Test

### 单元测试

```bash
./configure --utest=on & make utest -j16
./objs/srs_utest
```

### 回归测试

需要先启动SRS
```bash
./objs/srs -c conf/rtsp.conf
```

然后执行

```bash
cd srs/trunk/3rdparty/srs-bench
go test ./srs -mod=vendor -v -count=1 -run=TestRtmpPublish_RtspPlay
```

### 黑盒测试

黑盒测试无需启动SRS

```bash
go test ./blackbox -mod=vendor -v -count=1 -run=TestFast_RtmpPublish_RtspPlay_Basic
```

## RTP

如果是UDP传输，RTP打包方式跟RTC完全相同，直接发送即可。

而TCP传输，每个RTP包前面有额外的4个字节，第1个字节是固定的`0x24`，后跟1个字节通道标识符，后跟2个字节的RTP包长度，参考`RFC2326`中的第10.12小节`Embedded (Interleaved) Binary Data`。

## 开放端口

开放端口目前只需要一个，比如`8554`，TCP传输模式会复用交互时的Socket链接。

对于UDP，情况有些复杂，客户端会开放2个端口分别用于接收RTP和RTCP，常规做法，服务端也绑定2个端口用于发送RTP和RTCP，而这会导致需要开放的端口数量剧增，这将挑战防火墙的底线。实际上，我们可以复用RTC的`8000`端口，用作发送端口，并接收RTCP请求。目前暂未实现，而是选择随机端口发送RTP包。

## 编码格式

对于音频编码格式，因为是基于RTC的Consumer模块，所以拿到的RTP包已经是转码后的`OPUS`格式。如需保持原有格式，需要额外的开发。

## GOP

目前，播放RTSP流时会等待一段时间才出画面，是因为RTC模块没有实现缓存GOP功能，需要等待下一个关键帧的出现。

## 源码

RTSP协议解析部分，拷贝了原来3.0的代码，删除了SDP和RTP以及推流相关的一些代码，只保留关键的`SrsRtspRequest`和`SrsRtspResponse`用于处理请求和相应，并且只处理`OPTIONS`、`DESCRIBE`、`SETUP`、`PLAY`、`TEARDOWN`这5个方法。对于RTSP播放，这足够了。

业务部分，`SrsRtspConn`用于接收网络数据。同时，继承于`SrsRtcConnection`，是为了复用`RTC Consumer`，实际上，每一个RTSP播放者，等同于一个RTC播放者。真实业务处理下放到`SrsRtspSession`里面，包括生成SDP、发送RTP包，以及通用的Security、Hook、Stat。

## TODO

目前的版本，只是实现了一个基本功能，其他比如音频编码、鉴权、重定向等，根据实际需要再做计划，或许就在不久的将来。


## 参考文档

- [rfc2326-1998-rtsp.pdf](https://ossrs.net/lts/zh-cn/assets/files/rfc2326-1998-rtsp-12b5cccfcac4f911bfab96c8f57b0bf9.pdf)