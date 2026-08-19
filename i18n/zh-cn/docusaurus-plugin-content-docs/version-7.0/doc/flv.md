---
title: HTTP-FLV
sidebar_label: HTTP-FLV
hide_title: false
hide_table_of_contents: false
---

# HTTP-FLV

HTTP-FLV是一种直播流协议，有时候也简称FLV，是在HTTP连接上传输FLV格式的直播流。

和文件下载不同的是，直播流的长度是无限长，或者不确定长度，因此一般是基于HTTP Chunked协议实现。和HTTP-FLV类似的，还有HTTP-TS，
或者HTTP-MP3，TS主要应用于广播电视领域，MP3主要应用于音频领域。

和HLS不同的是，HLS本质上就是HTTP文件下载，而HTTP-FLV本质上是流传输。CDN对于HTTP文件下载的支持很完善，因此HLS的兼容性比HTTP-FLV
要好很多；同样HTTP-FLV的延迟比HLS要低很多，基本上可以做到3的5秒左右延迟，而HLS的延迟一般是8到10秒以上。

从协议实现上看，RTMP和HTTP-FLV几乎一样，RTMP是基于TCP协议，而HTTP-FLV基于HTTP也是TCP协议，因此两者的特点也非常类似。一般推流和
流的生产使用RTMP，主要是因为流的生产设备都支持RTMP；而流的播放和消费端采用HTTP-FLV或者HLS，因为播放设备支持HTTP更完善。

HTTP-FLV的兼容性很好，除了iOS原生浏览器不支持，其他平台和浏览器都支持了，参考[MSE](https://caniuse.com/?search=mse)。
若需要支持iOS浏览器，你可以考虑使用HLS或者使用WASM；注意一般iOS的Native应用，可以选择使用ijkplayer播放器。

## Usage

SRS支持HTTP-FLV分发，可以用[docker](./getting-started.md)或者[从源码编译](./getting-started-build.md):

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  ./objs/srs -c conf/http.flv.live.conf
```

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* HLS by SRS player: [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html)

## Config

HTTP-FLV相关的配置如下：

```bash
http_server {
    # whether http streaming service is enabled.
    # Overwrite by env SRS_HTTP_SERVER_ENABLED
    # default: off
    enabled on;
    # the http streaming listen entry is <[ip:]port>
    # for example, 192.168.1.100:8080
    # where the ip is optional, default to 0.0.0.0, that is 8080 equals to 0.0.0.0:8080
    # @remark, if use lower port, for instance 80, user must start srs by root.
    # Overwrite by env SRS_HTTP_SERVER_LISTEN
    # default: 8080
    listen 8080;
    # whether enable crossdomain request.
    # for both http static and stream server and apply on all vhosts.
    # Overwrite by env SRS_HTTP_SERVER_CROSSDOMAIN
    # default: on
    crossdomain on;
}
vhost __defaultVhost__ {
    # http flv/mp3/aac/ts stream vhost specified config
    http_remux {
        # whether enable the http live streaming service for vhost.
        # Overwrite by env SRS_VHOST_HTTP_REMUX_ENABLED for all vhosts.
        # default: off
        enabled on;
        # the fast cache for audio stream(mp3/aac),
        # to cache more audio and send to client in a time to make android(weixin) happy.
        # @remark the flv/ts stream ignore it
        # @remark 0 to disable fast cache for http audio stream.
        # Overwrite by env SRS_VHOST_HTTP_REMUX_FAST_CACHE for all vhosts.
        # default: 0
        fast_cache 30;
        # Whether drop packet if not match header. For example, there is has_audio and has video flag in FLV header, if
        # this is set to on and has_audio is false, then SRS will drop audio packets when got audio packets. Generally
        # it should work, but sometimes you might need SRS to keep packets even when FLV header is set to false.
        # See https://github.com/ossrs/srs/issues/939#issuecomment-1348740526
        # TODO: Only support HTTP-FLV stream right now.
        # Overwrite by env SRS_VHOST_HTTP_REMUX_DROP_IF_NOT_MATCH for all vhosts.
        # Default: on
        drop_if_not_match on;
        # Whether stream has audio track, used as default value for stream metadata, for example, FLV header contains
        # this flag. Sometimes you might want to force the metadata by disable guess_has_av.
        # For HTTP-FLV, use this as default value for FLV header audio flag. See https://github.com/ossrs/srs/issues/939#issuecomment-1351385460
        # For HTTP-TS, use this as default value for PMT table. See https://github.com/ossrs/srs/issues/939#issuecomment-1365086204
        # Overwrite by env SRS_VHOST_HTTP_REMUX_HAS_AUDIO for all vhosts.
        # Default: on
        has_audio on;
        # Whether stream has video track, used as default value for stream metadata, for example, FLV header contains
        # this flag. Sometimes you might want to force the metadata by disable guess_has_av.
        # For HTTP-FLV, use this as default value for FLV header video flag. See https://github.com/ossrs/srs/issues/939#issuecomment-1351385460
        # For HTTP-TS, use this as default value for PMT table. See https://github.com/ossrs/srs/issues/939#issuecomment-1365086204
        # Overwrite by env SRS_VHOST_HTTP_REMUX_HAS_VIDEO for all vhosts.
        # Default: on
        has_video on;
        # Whether guessing stream about audio or video track, used to generate the flags in, such as FLV header. If
        # guessing, depends on sequence header and frames in gop cache, so it might be incorrect especially your stream
        # is not regular. If not guessing, use the configured default value has_audio and has_video.
        # For HTTP-FLV, enable guessing for av header flag, because FLV can't change the header. See https://github.com/ossrs/srs/issues/939#issuecomment-1351385460
        # For HTTP-TS, ignore guessing because TS refresh the PMT when codec changed. See https://github.com/ossrs/srs/issues/939#issuecomment-1365086204
        # Overwrite by env SRS_VHOST_HTTP_REMUX_GUESS_HAS_AV for all vhosts.
        # Default: on
        guess_has_av on;
        # the stream mount for rtmp to remux to live streaming.
        # typical mount to [vhost]/[app]/[stream].flv
        # the variables:
        #       [vhost] current vhost for http live stream.
        #       [app] current app for http live stream.
        #       [stream] current stream for http live stream.
        # @remark the [vhost] is optional, used to mount at specified vhost.
        # the extension:
        #       .flv mount http live flv stream, use default gop cache.
        #       .ts mount http live ts stream, use default gop cache.
        #       .mp3 mount http live mp3 stream, ignore video and audio mp3 codec required.
        #       .aac mount http live aac stream, ignore video and audio aac codec required.
        # for example:
        #       mount to [vhost]/[app]/[stream].flv
        #           access by http://ossrs.net:8080/live/livestream.flv
        #       mount to /[app]/[stream].flv
        #           access by http://ossrs.net:8080/live/livestream.flv
        #           or by http://192.168.1.173:8080/live/livestream.flv
        #       mount to [vhost]/[app]/[stream].mp3
        #           access by http://ossrs.net:8080/live/livestream.mp3
        #       mount to [vhost]/[app]/[stream].aac
        #           access by http://ossrs.net:8080/live/livestream.aac
        #       mount to [vhost]/[app]/[stream].ts
        #           access by http://ossrs.net:8080/live/livestream.ts
        # @remark the port of http is specified by http_server section.
        # Overwrite by env SRS_VHOST_HTTP_REMUX_MOUNT for all vhosts.
        # default: [vhost]/[app]/[stream].flv
        mount [vhost]/[app]/[stream].flv;
    }
}
```

> Note: 这些配置只是播放HTTP-FLV相关的配置，推流的配置请根据你的协议，比如参考[RTMP](./rtmp.md#config)或者[SRT](./srt.md#config)或者[WebRTC](./webrtc.md#config)的推流配置。

关键配置说明如下：

* `has_audio` 是否有音频流，如果你的流没有音频，则需要配置这个为`off`，否则播放器可能会等待音频。
* `has_video` 是否有视频流，如果你的流没有视频，则需要配置这个为`off`，否则播放器可能会等待视频。

## Cluster

SRS支持HTTP-FLV集群分发，可以支持海量的观看客户端，参考[HTTP-FLV Cluster](./sample-http-flv-cluster.md)和[Edge](./edge.md)

## Crossdomain

SRS默认支持了HTTP CORS，请参考[HTTP CORS](./http-server.md#crossdomain)

## Websocket FLV

可以将HTTP-FLV转成WebSocket-FLV流，参考[videojs-flow](https://github.com/winlinvip/videojs-flow)。

关于HTTP转WebSocket参考[mse.go](https://github.com/winlinvip/videojs-flow/blob/master/demo/mse.go)。

## HTTP FLV VOD Stream

关于HTTP flv 点播流，参考：[v4_CN_FlvVodStream](./flv-vod-stream.md)

## HTTP and HTTPS Proxy

SRS可以和HTTP/HTTPS代理一起工作得很好，比如[Nginx](https://github.com/ossrs/srs/issues/2881#nginx-proxy),
[HTTPX](https://github.com/ossrs/srs/issues/2881#httpx-proxy), [CaddyServer](https://github.com/ossrs/srs/issues/2881#caddy-proxy),
等等。详细配置请参考 [#2881](https://github.com/ossrs/srs/issues/2881)。

## HTTPS FLV Live Stream

SRS支持将RTMP流转封装为HTTPS flv流，即在publish发布RTMP流时，在SRS的http模块中挂载一个对应的http地址（根据配置），
用户在访问这个https flv文件时，从rtmp流转封装为flv分发给用户。

具体请参考[HTTPS Server](./http-server.md#https-server)，或者`conf/https.flv.live.conf`配置文件。

## HTTP TS Live Stream

SRS支持将RTMP流转封装为HTTP ts流，即在publish发布RTMP流时，在SRS的http模块中挂载一个对应的http地址（根据配置），
用户在访问这个http ts文件时，从rtmp流转封装为ts分发给用户。

具体请参考`conf/http.ts.live.conf`配置文件。

## HTTP Mp3 Live Stream

SRS支持将rtmp流中的视频丢弃，将音频流转封装为mp3格式，在SRS的http模块中挂载对应的http地址（根据配置），
用户在访问这个http mp3文件时，从rtmp转封装为mp3分发给用户。

具体请参考`conf/http.mp3.live.conf`配置文件。

## HTTP Aac Live Stream

SRS支持将rtmp流中的视频丢弃，将音频流转封装为aac格式，在SRS的http模块中挂载对应的http地址（根据配置），
用户在访问这个http aac文件时，从rtmp转封装为aac分发给用户。

具体请参考`conf/http.aac.live.conf`配置文件。

## Why HTTP FLV

为何要整个HTTP FLV出来呢？当下HTTP FLV流正大行其道。主要的优势在于：

1. 互联网流媒体实时领域，还是RTMP。HTTP-FLV和RTMP的延迟一样，因此可以满足延迟的要求。
1. 穿墙：很多防火墙会墙掉RTMP，但是不会墙HTTP，因此HTTP FLV出现奇怪问题的概率很小。
1. 调度：RTMP也有个302，可惜是播放器as中支持的，HTTP FLV流就支持302方便CDN纠正DNS的错误。
1. 容错：SRS的HTTP FLV回源时可以回多个，和RTMP一样，可以支持多级热备。
1. 通用：Flash可以播RTMP，也可以播HTTP FLV。自己做的APP，也都能支持。主流播放器也都支持http flv的播放。
1. 简单：FLV是最简单的流媒体封装，HTTP是最广泛的协议，这两个到一起维护性很高，比RTMP简单多了。

## IPv6

SRS（v7.0.67+）支持HTTP-FLV流媒体的IPv6，实现双栈（IPv4/IPv6）操作，用于低延迟直播流传输。这允许HTTP-FLV客户端使用IPv6地址访问流，同时保持与现有IPv4基础设施的完全兼容性。

IPv6支持在SRS检测到HTTP服务器配置中的IPv6地址时自动启用。配置HTTP服务器监听IPv6地址：

```bash
http_server {
    enabled on;
    # Listen on both IPv4 and IPv6
    listen 8080 [::]:8080;
    dir ./objs/nginx/html;
}

vhost __defaultVhost__ {
    http_remux {
        enabled on;
        mount [vhost]/[app]/[stream].flv;
    }
}
```

通过IPv6访问HTTP-FLV流：

```bash
# HTTP-FLV stream via IPv6
http://[::1]:8080/live/livestream.flv
```

使用FFplay通过IPv6播放HTTP-FLV流：

```bash
ffplay 'http://[::1]:8080/live/livestream.flv'
```

SRS支持双栈HTTP-FLV操作，允许IPv4和IPv6客户端同时访问流：

```bash
http_server {
    enabled on;
    # Listen on both IPv4 and IPv6
    listen 8080 [::]:8080;
    dir ./objs/nginx/html;
}
```

此配置允许：
- IPv4客户端：`http://192.168.1.100:8080/live/livestream.flv`
- IPv6客户端：`http://[2001:db8::1]:8080/live/livestream.flv`

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/flv)

