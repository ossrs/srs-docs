---
title: Getting Started
sidebar_label: Getting Started
hide_title: false
hide_table_of_contents: false
---

# Getting Started

To learn the basics of SRS, you may choose one of the following favorite methods.

## Build From Source

Get SRS source, recommend [CentOS7](./install):

```
git clone -b 4.0release https://gitee.com/ossrs/srs.git
```

Build SRS in `srs/trunk`:

```
cd srs/trunk
./configure
make
```

Run SRS server:

```
./objs/srs -c conf/srs.conf
```

Check SRS by [http://localhost:8080/](http://localhost:8080/) or:

```
# Check the process status
./etc/init.d/srs status

# Check the SRS logs
tail -n 30 -f ./objs/srs.log
```

Publish stream by [FFmpeg](https://ffmpeg.org/download.html) or [OBS](https://obsproject.com/download) :

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

Or use docker of FFmpeg to publish, please replace the `192.168.1.10` by your IP:

```bash
docker run --rm ossrs/srs:encoder \
  ffmpeg -re -i ./doc/source.200kbps.768x320.flv -c copy -f flv rtmp://192.168.1.10/live/livestream
```

Play stream by:

* RTMP (by [VLC](https://www.videolan.org/)): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

Note that if convert RTMP to WebRTC, please use [`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-en-guide):

* H5(WebRTC): [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)

> Note: Recommend **[docker](#Docker)**, or **[K8s](#K8s)**

> Note: Please set CANDIDATE if need to enable WebRTC, please read [CANDIDATE](https://github.com/ossrs/srs/wiki/v4_EN_WebRTC#config-candidate)。

> Note: If need HTTPS, by which WebRTC and modern browsers require, please read
> **[HTTPS API](https://github.com/ossrs/srs/wiki/v4_EN_HTTPApi#https-api)**
> and **[HTTPS Callback](https://github.com/ossrs/srs/wiki/v4_EN_HTTPCallback#https-callback)**
> and **[HTTPS Live Streaming](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHttpStream#https-flv-live-stream)**,
> however HTTPS proxy also works perfect with SRS such as Nginx.

Please read more information about SRS.

## Docker

Run SRS docker, the available images is [here](https://hub.docker.com/r/ossrs/srs/tags) :

```bash
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

If need to enable WebRTC, please set the CANDIDATE and expose UDP/8000 :

```bash
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 \
    --env CANDIDATE="192.168.1.10" -p 8000:8000/udp \
    ossrs/srs:4 ./objs/srs -c conf/docker.conf
```

For HTTPS, please map the HTTPS ports, and use configs like `conf/https.*`, for example, `conf/https.docker.conf`:

```bash
CANDIDATE="192.168.1.10"
docker run --rm -it -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 1990:1990 -p 8088:8088 \
    --env CANDIDATE=$CANDIDATE -p 8000:8000/udp \
    ossrs/srs:4 ./objs/srs -c conf/https.docker.conf
```

> Note: About CANDIDATE, please read [CANDIDATE](https://github.com/ossrs/srs/wiki/v4_EN_WebRTC#config-candidate)

> Note: If convert RTMP to WebRTC, please use [`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-en-guide)

> Remark: Please use your HTTPS key and cert file, please read
> **[HTTPS API](https://github.com/ossrs/srs/wiki/v4_EN_HTTPApi#https-api)**
> and **[HTTPS Callback](https://github.com/ossrs/srs/wiki/v4_EN_HTTPCallback#https-callback)**
> and **[HTTPS Live Streaming](https://github.com/ossrs/srs/wiki/v4_EN_DeliveryHttpStream#https-flv-live-stream)**,
> however HTTPS proxy also works perfect with SRS such as Nginx.

Publish stream by [FFmpeg](https://ffmpeg.org/download.html) or [OBS](https://obsproject.com/download) :

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

Or use docker of FFmpeg to publish, please replace the `192.168.1.10` by your IP:

```bash
docker run --rm ossrs/srs:encoder \
  ffmpeg -re -i ./doc/source.200kbps.768x320.flv -c copy -f flv rtmp://192.168.1.10/live/livestream
```

Play stream by:

* RTMP (by [VLC](https://www.videolan.org/)): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

Please read more information about SRS.

## Cloud Virtual Machine

SRS works well on **Cloud Virtual Machine**:

* [DigitalOcean Droplet](https://github.com/ossrs/srs-cloud/wiki/Droplet): Create SRS Droplet.
* [TencentCloud LightHouse](https://www.bilibili.com/video/BV1844y1L7dL/): Deploy SRS to Tencent LightHouse.
* [TencentCloud CVM](https://www.bilibili.com/video/BV1844y1L7dL/): Deploy SRS to Tencent CVM.
* [Binary installer for CentOS 7](https://github.com/ossrs/srs/releases), download and install SRS, use [systemctl](./service#systemctl) to manage the service.

## K8s

Highly recommend that you [Deploy to Cloud Platforms](https://github.com/ossrs/srs/wiki/v4_CN_K8s#deploy-to-cloud-platforms).

SRS provides a set of template repository for fast deploy:

* [General K8s](https://github.com/ossrs/srs-k8s-template)
* [EKS(Amazon Elastic Kubernetes Service)](https://github.com/ossrs/srs-eks-template)
* [AKS(Azure Kubernetes Service)](https://github.com/ossrs/srs-aks-template)
* [TKE(Tencent Kubernetes Engine)](https://github.com/ossrs/srs-tke-template)
* [ACK(Alibaba Cloud Container Service for Kubernetes)](https://github.com/ossrs/srs-ack-template)


