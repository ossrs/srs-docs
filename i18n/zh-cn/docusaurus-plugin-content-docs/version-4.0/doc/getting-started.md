---
title: 起步
sidebar_label: 起步
hide_title: false
hide_table_of_contents: false
---

# Getting Started

SRS支持下面多种方式启动，请使用你最熟悉的方式。


## Build From Source

下载源码，推荐用[CentOS7](./install)：

```
git clone -b 4.0release https://gitee.com/ossrs/srs.git
```

编译，注意需要切换到`srs/trunk`目录：

```
cd srs/trunk
./configure
make
```

启动服务器：

```
./objs/srs -c conf/srs.conf
```

检查SRS是否成功启动，可以打开 [http://localhost:8080/](http://localhost:8080/) ，或者执行命令：

```
# 查看SRS的状态
./etc/init.d/srs status

# 或者看SRS的日志
tail -n 30 -f ./objs/srs.log
```

例如，下面的命令显示SRS正在运行：

```
MB0:trunk $ ./etc/init.d/srs status
SRS(pid 90408) is running.                                 [  OK  ]

MB0:trunk $ tail -n 30 -f ./objs/srs.log
[2021-08-13 10:30:36.634][Trace][90408][12c97232] Hybrid cpu=0.00%,0MB, cid=1,1, timer=61,0,0, clock=0,22,25,0,0,0,0,1,0
```

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

或者使用FFmpeg的Docker推流，请将`192.168.1.10`换成你的内网IP：

```bash
docker run --rm registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -re -i ./doc/source.200kbps.768x320.flv -c copy -f flv rtmp://192.168.1.10/live/livestream
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* RTMP (by [VLC](https://www.videolan.org/)): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

注意如果RTMP转WebRTC流播放，必须使用配置文件[`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-cn-guide):

* H5(WebRTC): [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)

> Note: 推荐直接运行SRS，可以使用 **[docker](#Docker)**, 或者 **[K8s](#K8s)**

> Note: 若需要开启WebRTC能力，请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](https://github.com/ossrs/srs/wiki/v4_CN_WebRTC#config-candidate)。

> Note: 若需要HTTPS，比如WebRTC和浏览器都要求是HTTPS，那么请参考
> **[HTTPS API](https://github.com/ossrs/srs/wiki/v4_CN_HTTPApi#https-api)**
> 以及 **[HTTPS Callback](https://github.com/ossrs/srs/wiki/v4_CN_HTTPCallback#https-callback)**
> 以及 **[HTTPS Live Streaming](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHttpStream#https-flv-live-stream)**，
> 当然了HTTPS的反向代理也能和SRS工作很好，比如Nginx代理到SRS。

请继续阅读下面的内容，了解更多SRS的信息。

## Docker

推荐使用Docker直接启动SRS，可用镜像在[这里](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images)和每个[Release](https://github.com/ossrs/srs/releases?q=v4&expanded=true)都会给出来链接:

```bash
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

若需要支持WebRTC，需要设置CANDIATE，并开启UDP/8000端口：

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

若需要HTTPS，需要开启端口映射，并使用配置文件`conf/https.*`，比如`conf/https.docker.conf`：

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 1990:1990 -p 8088:8088 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 ./objs/srs -c conf/https.docker.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](https://github.com/ossrs/srs/wiki/v4_CN_WebRTC#config-candidate)。

> Note: 注意如果RTMP转WebRTC流播放，必须使用配置文件[`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-cn-guide)

> Remark: 请使用你的证书文件，代替上面配置中的key和cert，请参考
> **[HTTPS API](https://github.com/ossrs/srs/wiki/v4_CN_HTTPApi#https-api)**
> 以及 **[HTTPS Callback](https://github.com/ossrs/srs/wiki/v4_CN_HTTPCallback#https-callback)**
> 以及 **[HTTPS Live Streaming](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHttpStream#https-flv-live-stream)**，
> 当然了HTTPS的反向代理也能和SRS工作很好，比如Nginx代理到SRS。

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

或者使用FFmpeg的Docker推流，请将`192.168.1.10`换成你的内网IP：

```bash
docker run --rm registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -re -i ./doc/source.200kbps.768x320.flv -c copy -f flv rtmp://192.168.1.10/live/livestream
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* RTMP (by [VLC](https://www.videolan.org/)): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

请继续阅读下面的内容，了解更多SRS的信息。

## Cloud Virtual Machine

SRS可以在云虚拟机上工作得很好，下面是一些可用的云厂商，以及使用方式：

* [TencentCloud LightHouse](https://www.bilibili.com/video/BV1844y1L7dL/)：不仅仅是SRS，这是个微缩视频云，参考[#2856](https://github.com/ossrs/srs/issues/2856#lighthouse)。
* [TencentCloud CVM](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)：不仅仅是SRS，这是个微缩视频云，参考[#2856](https://github.com/ossrs/srs/issues/2856#lighthouse)。
* [DigitalOcean Droplet](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ)：海外用户，直接创建SRS Droplet。
* [CentOS 7安装包](https://github.com/ossrs/srs/releases)：在所有云厂商的虚拟机上，手动安装SRS，使用[systemctl](./service#systemctl)管理服务。

## K8s

推荐使用K8s部署SRS，参考[Deploy to Cloud Platforms](https://github.com/ossrs/srs/wiki/v4_CN_K8s#deploy-to-cloud-platforms)，视频教程[Bilibili: SRS-027-用K8s零命令行部署SRS](https://www.bilibili.com/video/BV1g44y1j7Vz/)

SRS提供了一系列的模版项目，可以快速部署到云平台K8s：

* [TKE(腾讯云K8s)](https://github.com/ossrs/srs-tke-template)
* [通用K8s](https://github.com/ossrs/srs-k8s-template)
* [ACK(阿里云K8s)](https://github.com/ossrs/srs-ack-template)
* [EKS(亚马逊AWS K8s)](https://github.com/ossrs/srs-eks-template)
* [AKS(微软Azure K8s)](https://github.com/ossrs/srs-aks-template)
