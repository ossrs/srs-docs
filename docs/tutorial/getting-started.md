---
title: Getting Started
sidebar_label: Getting Started
hide_title: false
hide_table_of_contents: false
custom_edit_url: null
---



对于新手来说，音视频的门槛真的非常高，SRS的目标是降低（不能消除）音视频的门槛，所以请一定要读完Wiki。 不读Wiki一定扑街，不读文档请不要提Issue，不读文档请不要提问题，任何文档中明确说过的疑问都不会解答。

## 源码

下载源码，推荐用 [CentOS7](https://github.com/ossrs/srs/wiki/v4_EN_Build)系统:

```
git clone -b 4.0release https://gitee.com/ossrs/srs.git
```

> Note: Recommend docker, or K8s

编译，注意需要切换到srs/trunk目录：

```
cd srs/trunk
./configure
make
```

启动服务器：

```
./objs/srs -c conf/srs.conf
```

检查SRS是否成功启动，可以打开 http://localhost:8080 ，或者执行命令：

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

使用 FFmpeg(点击下载) 或 OBS(点击下载) 推流：

```
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:
- RTMP (by VLC): rtmp://localhost/live/livestream
- H5(HTTP-FLV): http://localhost:8080/live/livestream.flv
- H5(HLS): http://localhost:8080/live/livestream.m3u8

注意如果RTMP转WebRTC流播放，必须使用配置文件 [rtmp2rtc.conf](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-en-guide):
- H5(WebRTC): webrtc://localhost/live/livestream

> Note: Please set CANDIDATE if need to enable WebRTC, please read [CANDIDATE](https://github.com/ossrs/srs/wiki/v4_EN_WebRTC#config-candidate).

请继续阅读下面的内容，了解更多SRS的信息。


## Docker

Run SRS docker, the available images is [here](https://hub.docker.com/r/ossrs/srs/tags) :

```
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

If need to enable WebRTC, please set the CANDIDATE and expose UDP/8000 :

```
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    --env CANDIDATE="192.168.1.10" -p 8000:8000/udp \
    ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

> Note: About CANDIDATE, please read [CANDIDATE](https://github.com/ossrs/srs/wiki/v4_EN_WebRTC#config-candidate)

> Note: If convert RTMP to WebRTC, please use [rtmp2rtc.conf](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-en-guide)

Please read more information about SRS.


## K8s

Highly recommend that you [Deploy to Cloud Platforms](https://github.com/ossrs/srs/wiki/v4_EN_Home#v4_CN_K8s#deploy-to-cloud-platforms).

SRS provides a set of template repository for fast deploy:
- General K8s
- TKE(Tencent Kubernetes Engine)
- ACK(Alibaba Cloud Container Service for Kubernetes)
- EKS(Amazon Elastic Kubernetes Service)
- AKS(Azure Kubernetes Service)

Please read more information about SRS.
