---
title: Stream Converter
sidebar_label: Stream Converter 
hide_title: false
hide_table_of_contents: false
---

# Stream Converter

Stream Converter侦听特殊的TCP/UDP端口，接受客户端连接和媒体流，并转成RTMP流，推送给SRS。

简单来说，它将其他流转成RTMP流，工作流如下：

```text
Client ---PUSH--> Stream Converter --RTMP--> SRS --RTMP/FLV/HLS/WebRTC--> Clients
```

> Note: 有些流可能不止一个流，甚至有不同的传输通道。

## Use Scenario

常见的应用场景包括：

* Push MPEG-TS over UDP, 通过UDP协议，将裸流MPEGTS推送到SRS，主要是一些编码器支持。
* Push FLV by HTTP POST, 通过HTTP POST，将FLV流推送到SRS，主要是移动端支持。
* Push GB28181 over TCP, 通过TCP协议，将摄像头的流推送到SRS，主要是监控摄像头支持。

> Note: FFmpeg支持推送MPEGTS和FLV流到SRS，可以用FFmpeg测试。

## Build

SRS默认开启Stream Converter的支持，不需要特别的编译参数。但某些协议可能需要特别的编译参数，请参考下面具体协议的使用介绍。

## Protocols

目前Stream Converter支持的协议包括：

* MPEG-TS over UDP: MPEG-TS裸流，基于UDP协议。
* FLV by HTTP POST: FLV流，基于HTTP协议。
* GB28181-2016: SIP和MPEG-PS流，基于TCP协议。

## Config

Stream Converter相关的配置如下：

```
# Push MPEGTS over UDP to SRS.
stream_caster {
    # Whether stream converter is enabled.
    # Default: off
    enabled on;
    # The type of stream converter, could be:
    #       mpegts_over_udp, push MPEG-TS over UDP and convert to RTMP.
    caster mpegts_over_udp;
    # The output rtmp url.
    # For mpegts_over_udp converter, the typically output url:
    #           rtmp://127.0.0.1/live/livestream
    output rtmp://127.0.0.1/live/livestream;
    # The listen port for stream converter.
    # For mpegts_over_udp converter, listen at udp port. for example, 8935.
    listen 8935;
}

# Push FLV by HTTP POST to SRS.
stream_caster {
    # Whether stream converter is enabled.
    # Default: off
    enabled on;
    # The type of stream converter, could be:
    #       flv, push FLV by HTTP POST and convert to RTMP.
    caster flv;
    # The output rtmp url.
    # For flv converter, the typically output url:
    #           rtmp://127.0.0.1/[app]/[stream]
    # For example, POST to url:
    #           http://127.0.0.1:8936/live/livestream.flv
    # Where the [app] is "live" and [stream] is "livestream", output is:
    #           rtmp://127.0.0.1/live/livestream
    output rtmp://127.0.0.1/[app]/[stream];
    # The listen port for stream converter.
    # For flv converter, listen at tcp port. for example, 8936.
    listen 8936;
}

# For GB28181 server, see https://github.com/ossrs/srs/issues/3176
# For SIP specification, see https://www.ietf.org/rfc/rfc3261.html
# For GB28181 2016 spec, see https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=469659DC56B9B8187671FF08748CEC89
stream_caster {
    # Whether stream converter is enabled.
    # Default: off
    enabled off;
    # The type of stream converter, could be:
    #       gb28181, Push GB28181 stream and convert to RTMP.
    caster gb28181;
    # The output rtmp url.
    # For gb28181 converter, the typically output url:
    #           rtmp://127.0.0.1/live/[stream]
    # The available variables:
    #           [stream] The video channel codec ID.
    output rtmp://127.0.0.1/live/[stream];
    # The listen TCP/UDP port for stream converter.
    #       For gb28181 converter, listen at TCP/UDP port. for example, 9000.
    # @remark We always enable bundle for media streams at this port.
    listen 9000;
    # SIP server for GB28181. Please note that this is only a demonstrated SIP server, please never use it in your
    # online production environment. Instead please use [jsip](https://github.com/usnistgov/jsip) and there is a demo
    # [srs-sip](https://github.com/ossrs/srs-sip) also base on it.
    sip {
        # Whether enable embedded SIP server.
        # Default: on
        enabled on;
        # The SIP listen port, for both TCP and UDP protocol.
        # Default: 5060
        listen 5060;
        # The SIP or media transport timeout in seconds.
        # Default: 60
        timeout 60;
        # When media disconnect, the wait time in seconds to re-invite device to publish. During this wait time, device
        # might send bye or unregister message(expire is 0), so that we will cancel the re-invite.
        # Default: 5
        reinvite 5;
        # The exposed candidate IPs, response in SDP connection line. It can be:
        #       *           Retrieve server IP automatically, from all network interfaces.
        #       $CANDIDATE  Read the IP from ENV variable, use * if not set.
        #       x.x.x.x     A specified IP address or DNS name, use * if 0.0.0.0.
        # Default: *
        candidate *;
    }
}
```

下面描述具体协议的使用。

## Push MPEG-TS over UDP

你可以推送MPEGTS UDP流到SRS，转换成其他的协议。

首先，使用MPEGTS相关配置启动SRS：

```bash
./objs/srs -c conf/push.mpegts.over.udp.conf
```

> Note: 关于详细的配置，请参考[Config](#config)中`mpegts_over_udp`的部分。

然后，使用编码器推流，比如用FFmpeg：

```bash
ffmpeg -re -f flv -i doc/source.flv -c copy -f mpegts udp://127.0.0.1:8935
```

现在，就可以播放流了：

* [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?stream=livestream.flv)
* [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?stream=livestream.m3u8)
* [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?stream=livestream)

注意MPEGTS UDP是每个端口对应一个具体的RTMP流。

> Note: 关于开发的一些细节，请参考[#250](https://github.com/ossrs/srs/issues/250).

## Push HTTP FLV to SRS

你可以推送HTTP FLV流到SRS，对于一些移动端设备，使用HTTP推流会很简单。

首先，使用HTTP FLV相关配置启动SRS：

```bash
./objs/srs -c conf/push.flv.conf
```

> Note: 关于详细的配置，请参考[Config](#config)中`flv`的部分。

然后，使用编码器推流，比如用FFmpeg：

```bash
ffmpeg -re -f flv -i doc/source.flv -c copy \
    -f flv http://127.0.0.1:8936/live/livestream.flv
```

现在，就可以播放流了：

* [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?stream=livestream.flv)
* [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?stream=livestream.m3u8)
* [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?stream=livestream)

> Note: 关于开发的一些细节，请参考[#2611](https://github.com/ossrs/srs/issues/2611).

## Push GB28181 to SRS

GB28181是国内安防摄像头基本都会支持的协议，属于国家标准，主要是摄像头主动连接到服务器的场景。 随着互联网的普及，安防摄像头有时候也需要接入互联网，比如慢直播，或者景区直播等。

> Note: 一般安防摄像头的典型场景，是通过RTSP从摄像头拉流，而不是摄像头主动推流，请参考[#2304](https://github.com/ossrs/srs/issues/2304)的描述。

再次强调，SRS支持GB协议，其实并不是做安防场景，而只是支持了摄像头上互联网这个比较新也比较小的场景。当然如果有开发能力，也是完全能基于SRS做安防的流媒体服务器。

首先，使用GB28181相关配置启动SRS：

```bash
./objs/srs -c conf/gb28181.conf
```

> Note: 关于详细的配置，请参考[Config](#config)中`gb28181`的部分。

然后，配置摄像头推流：

![](/img/doc-2022-10-08-001.png)

![](/img/doc-2022-10-08-002.png)

> Note: 音频请选择AAC编码，视频选择子码流，传输协议选择TCP，协议版本选择GB28181-2016。

> Note: 配置中`CANDIDATE`需要配置为摄像头能访问到的IP地址，详细请参考[Protocol: GB28181: Candidate](./gb28181.md#candidate)。

现在，就可以播放流了，请将设备ID换成你的设备：

* [http://localhost:8080/live/34020000001320000001.flv](http://localhost:8080/players/srs_player.html?stream=34020000001320000001.flv)
* [http://localhost:8080/live/34020000001320000001.m3u8](http://localhost:8080/players/srs_player.html?stream=34020000001320000001.m3u8)
* [webrtc://localhost/live/34020000001320000001](http://localhost:8080/players/rtc_player.html?stream=34020000001320000001)

> Note: 关于开发的一些细节，请参考[#3176](https://github.com/ossrs/srs/issues/3176).

## Push RTSP to SRS

这个功能已经被删除，详细原因参考[#2304](https://github.com/ossrs/srs/issues/2304#issuecomment-826009290)。

2015.1

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/streamer)


