---
title: Docker
sidebar_label: Docker镜像
hide_title: false
hide_table_of_contents: false
---

# Docker

推荐使用Docker启动SRS，这是最简单也是最方便的方式。

## Live Streaming

直播是SRS的典型场景，支持推直播流后多种观看方式。

先用Docker启动SRS:

```bash
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

> Note: 可用镜像在 [这里](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images) 和每个 [Release](https://github.com/ossrs/srs/releases?q=v4&expanded=true) 都会给出来链接。

使用FFmpeg的Docker推流到本机：

```bash
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

或者使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

> Note: 实例文件`./doc/source.flv`在SRS的源代码目录中有。

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* RTMP (by [VLC](https://www.videolan.org/)): `rtmp://localhost/live/livestream`
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

## WebRTC

SRS支持WebRTC，可以做会议或视频聊天。

先使用Docker启动SRS：

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 1990:1990 -p 8088:8088 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

> Note: 请将IP换成你的SRS的IP地址。

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

使用WebRTC推流到SRS：[WebRTC: Publish](http://localhost:8080/players/rtc_publisher.html?autostart=true&stream=livestream&port=8080&schema=http)

打开页面观看WebRTC流：[WebRTC: Play](http://localhost:8080/players/rtc_player.html?autostart=true&stream=livestream&schema=http)

> Note: 可以打开不同的页面，推拉不同的流，就可以实现视频聊天了。

## WebRTC for Live Streaming

SRS支持直播转WebRTC，推直播流，使用WebRTC观看。

先用Docker启动SRS：

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/rtmp2rtc.conf
```

> Note: 请将IP换成你的SRS的IP地址。

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Note: 注意如果RTMP转WebRTC流播放，必须使用配置文件[`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-cn-guide)

使用FFmpeg的Docker推流到本机：

```bash
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

或者使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

> Note: 实例文件`./doc/source.flv`在SRS的源代码目录中有。

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* WebRTC: [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true)
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

## WebRTC using HTTPS

若需要在非本机使用WebRTC，比如SRS运行在远程服务器，在笔记本或者手机上使用WebRTC，则需要开启HTTPS API。 

先用Docker启动SRS：

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 1990:1990 -p 8088:8088 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/https.docker.conf
```

> Note: 请将IP换成你的SRS的IP地址。

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: 请使用你的证书文件，代替上面配置中的key和cert，请参考
> **[HTTPS API](./http-api.md#https-api)**
> 以及 **[HTTPS Callback](./http-callback.md#https-callback)**
> 以及 **[HTTPS Live Streaming](./delivery-http-flv.md#https-flv-live-stream)**，
> 当然了HTTPS的反向代理也能和SRS工作很好，比如Nginx代理到SRS。

使用WebRTC推流到SRS：[WebRTC: Publish](https://192.168.3.82:8088/players/rtc_publisher.html?autostart=true&stream=livestream&api=1990&schema=https)

打开页面观看WebRTC流：[WebRTC: Play](https://192.168.3.82:8088/players/rtc_player.html?autostart=true&stream=livestream&api=1990&schema=https)

> 注意：自签名证书，在空白处输入`thisisunsafe`（注意没空格）。

> Note: 可以打开不同的页面，推拉不同的流，就可以实现视频聊天了。

## SRT for Live Streaming

SRS支持SRT推直播流，使用SRT或其他协议观看。

先用Docker启动SRS：

```bash
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 10080:10080/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/srt.conf
```

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

使用 [ffplay(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 播放：

```bash
ffplay 'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request'
```

## Multiple Streams

你可以推拉多路流到SRS，不需要特殊的设置，按照前面的步骤运行SRS后，改变推拉流的URL就可以。比如：

* `rtmp://ip/live/livesteam`
* `rtmp://ip/live/livesteamN`
* `rtmp://ip/liveN/livestreamN`
* `srt://ip:10080?streamid=#!::r=anyM/streamN,m=publish`
* `webrtc://localhost/anyM/streamN`
* `http://ip:8080/anyM/streamN.flv`
* `http://ip:8080/anyM/streamN.m3u8`
* `https://ip:8080/anyM/streamN.flv`
* `https://ip:8080/anyM/streamN.m3u8`

> Note: 详细请参考[RTMP URL](./rtmp-url-vhost.md)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v4/getting-started)


