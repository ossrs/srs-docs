---
title: RTSP
sidebar_label: RTSP
hide_title: false
hide_table_of_contents: false
---

# RTSP

RTSP是很古老的协议，已经有接近30年的历史。在安防行业，几乎每家公司都自己实现了一个RTSP服务器，但他们都不喜欢开源，还喜欢加很多私有的东西在里面。在市面上，你随便就能找到一个RTMP服务器，却很难找到一个RTSP服务器。

SRS最早在2.0版本就已经支持RTSP协议，但只有推流（ANNOUNCE → SETUP → RECORD），而没有拉流（DESCRIBE → SETUP → PLAY）。实际上，很多传统的C/S架构的客户端、解码器、嵌入式设备，以及最新的AI视觉检测等，首选播放协议仍然RTSP。

这个版本，复用了2.0的协议解析的部分代码，删除推流，新增拉流，仅支持TCP方式。

## Usage

首先，编译和启动SRS，请确认版本为`7.0.47+`：

```bash
cd srs/trunk && ./configure --rtsp=on && make
./objs/srs -c conf/rtsp.conf
```
> 编译时必须开启`--rtsp=on`（默认关闭）。

然后，使用RTMP协议推流

```bash
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

最后，使用RTSP协议拉流，注意：仅支持TCP方式

```bash
ffplay -rtsp_transport tcp -i rtsp://localhost:8554/live/livestream
```

## Config

参考`conf/rtsp.conf`

```bash
rtsp_server {
    enabled on;
    listen 8554;
}

vhost __defaultVhost__ {
    rtsp {
        enabled on;
        rtmp_to_rtsp on;
    }
}
```

## Port

RTSP协议分为2个部分，1个是信令交互，即DESCRIBE/SETUP/PLAY等；1个是媒体传输，即RTP/RTCP包发送。

信令交互必须是TCP协议，默认端口是`554`，某些系统需要`root`权限才能监听，所以这里改成了`8554`。

交互成功后开始媒体传输，有2种方式：TCP或UDP，TCP方式直接复用交互时建立的Socket链接。由于UDP需要分配端口，所以不支持通过UDP传输媒体流。如果您尝试使用UDP作为传输，则会失败：

```bash
ffplay -rtsp_transport udp -i rtsp://localhost:8554/live/livestream

[rtsp @ 0x7fbc99a14880] method SETUP failed: 461 Unsupported Transport
rtsp://localhost:8554/live/livestream: Protocol not supported

[2025-07-05 21:30:52.738][WARN][14916][7d7gf623][35] RTSP: setup failed: code=2057
(RtspTransportNotSupported) : UDP transport not supported, only TCP/interleaved mode is supported
```

目前没有计划支持 UDP传输。在实际应用中，UDP很少使用；绝大多数RTSP流量都使用TCP。

## Rtp

TCP传输时，每个RTP/RTCP包前面有额外的4个字节，第1个字节是固定的`0x24`，后跟1个字节通道标识符，后跟2个字节的RTP包长度，参考`RFC2326`中的第10.12小节`Embedded (Interleaved) Binary Data`。

## Play Before Publish

RTSP协议在处理音频编码方面与RTMP和WebRTC有明显区别。由于RTSP需要通过SDP交换来确定音频轨道参数，而不同编码格式（如OPUS和AAC）的参数差异较大，因此无法支持先播放后推流的功能。播放RTSP流时，必须已经有流存在，这样才能确定正确的音频编码参数。

## Opus Codec

当前RTSP不支持Opus编码，主要是因为在RTC转RTSP的过程中，音频会先转为RTMP格式（只支持AAC）。要支持Opus，需要调整桥接架构，让RTC2RTSP能够保留原始音频编码，而不是经过RTMP转换。虽然enhanced-RTMP已支持Opus，但这需要额外的适配工作。

## Architecture

RTSP协议解析部分，拷贝了原来3.0的代码，删除了SDP和RTP以及推流相关的一些代码，只保留关键的`SrsRtspRequest`和`SrsRtspResponse`用于处理请求和相应，并且只处理`OPTIONS`、`DESCRIBE`、`SETUP`、`PLAY`、`TEARDOWN`这5个方法。对于RTSP播放，这足够了。

业务部分，`SrsRtspConnection`负责处理客户端连接和协议交互，通过`SrsRtspPlayStream`从`SrsRtspSource`消费数据，`SrsRtspSource`管理多个`SrsRtspConsumer`并分发RTP包，最终通过`SrsRtspSendTrack`将音视频数据发送给客户端。

## Test

### Unit Test

```bash
./configure --utest=on & make utest
./objs/srs_utest
```

### Regression Test

```bash
cd srs/trunk/3rdparty/srs-bench
go test ./srs -mod=vendor -v -count=1 -run=TestRtmpPublish_RtspPlay
```
> 注意：回归测试需要先启动SRS

### BlackBox Test

```bash
cd srs/trunk/3rdparty/srs-bench
go test ./blackbox -mod=vendor -v -count=1 -run=TestFast_RtmpPublish_RtspPlay_Basic
```

## TODO

目前的版本，只是实现了一个基本功能，其他比如鉴权、重定向、RTCP等，根据实际需要再做计划，或许就在不久的将来。


## Refer

- [rfc2326-1998-rtsp.pdf](https://ossrs.net/lts/zh-cn/assets/files/rfc2326-1998-rtsp-12b5cccfcac4f911bfab96c8f57b0bf9.pdf)