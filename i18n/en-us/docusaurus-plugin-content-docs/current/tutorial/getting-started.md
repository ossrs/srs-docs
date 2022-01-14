---
title: Getting Started
sidebar_label: Getting Started
hide_title: false
hide_table_of_contents: false
custom_edit_url: null
---

Let's install SRS.

## Source

Get SRS source, recommend [CentOS7](https://github.com/ossrs/srs/wiki/v4_EN_Build):

```
git clone -b 4.0release https://gitee.com/ossrs/srs.git
```

> Note: Recommend docker, or K8s

Build SRS in srs/trunk:

```
cd srs/trunk
./configure
make
```

Run SRS server:

```
./objs/srs -c conf/srs.conf
```

Check SRS by http://localhost:8080 or:

```
# Check the process status
./etc/init.d/srs status

# Check the SRS logs
tail -n 30 -f ./objs/srs.log
```

Publish stream by FFmpeg or OBS :

```
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

Play stream by:
- RTMP (by VLC): rtmp://localhost/live/livestream
- H5(HTTP-FLV): http://localhost:8080/live/livestream.flv
- H5(HLS): http://localhost:8080/live/livestream.m3u8

Note that if convert RTMP to WebRTC, please use [rtmp2rtc.conf](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-en-guide):
- H5(WebRTC): webrtc://localhost/live/livestream

> Note: Please set CANDIDATE if need to enable WebRTC, please read [CANDIDATE](https://github.com/ossrs/srs/wiki/v4_EN_WebRTC#config-candidate).

Please read more information about SRS.


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
