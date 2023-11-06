---
title: WebRTC
sidebar_label: WebRTC
hide_title: false
hide_table_of_contents: false
---

# WebRTC

WebRTC是通信的能力，从技术上看是两个或多个客户端，让用户具备互动的能力。
人对于延迟的感知是400ms，也就是一般的对话能顺利进行，这是RTC的核心指标。
由于端和端之间有关联，导致系统复杂度比直播高了多个数量级，这是很多问题的根源。

SRS是在2020年支持的WebRTC协议，研发的详细过程请参考[#307](https://github.com/ossrs/srs/issues/307)。
直播和RTC的协议或能力，是SRS的核心能力，新的音视频开发者，将不会区分直播和RTC，因为都是互联网视频能力。

SRS对直播和RTC这两种能力的抽象，是流(Stream)，一个流会有多个消费者(Consumer)，流之间没有关联。
基于流，我们构造了各种业务的能力，比如集群、录制、转码、转发。
基于这些业务能力，我们提供了各种场景下的DEMO，比如低延迟直播、一对一通话、多人通话、连麦等等。

开源最强大的是开放，因为开放所以和每个开发者有关系。
开源最大的问题是没有SLA，只能提供DEMO不能提供服务，也不能及时给予开发者支持。
和开源结合的云服务，弥补了开源的短板，SRS的开源方案，会和云服务对接，利用云服务的能力补充开源没有SLA的短板。

对于RTC，SRS提供两个关键的能力：
* 开源的全链路能力、方案和DEMO，能快速搭建和了解RTC系统。
* 无缝（尽量）对接云服务，平滑（尽量）迁移到云，保障业务的发展。

## Config

RTC的配置很多，详细配置参考`full.conf`，如下：

```bash
rtc_server {
    enabled on;
    listen 8000;
    candidate $CANDIDATE;
}

vhost rtc.vhost.srs.com {
    rtc {
        enabled on;
        rtmp_to_rtc off;
        rtc_to_rtmp off;
        nack on;
        twcc on;
    }
}
```

第一部分，`rtc_server`是全局的RTC服务器的配置，部分关键配置包括：
* `enabled`：是否开启RTC服务器，默认是off。
* `listen`：侦听的RTC端口，注意是UDP协议。
* `candidate`：服务器提供服务的IP地址，由于RTC的特殊性，必须配置这个地址。
* `ecdsa`：服务器自动生成的证书种类，ECDSA或RSA，是否用ECDSA。

第二部分，每个vhost中的RTC配置，部分关键配置包括：
* `rtc.enabled`：是否开启RTC能力，默认是off。
* `rtc.rtmp_to_rtc`：是否开启RTMP转RTC。
* `rtc.stun_timeout`：会话超时时间，单位秒。
* `rtc.nack`：是否开启NACK的支持，即丢包重传，默认on。
* `rtc.twcc`：是否开启TWCC的支持，即拥塞控制的反馈机制，默认on。
* `rtc.dtls_role`：DTLS角色，active就是DTLS Client(主动发起)，passive是DTLS Server(被动接受)。

There are some config for WebRTC:

* full.conf: Section `rtc_server` and vhost `rtc.vhost.srs.com` is about WebRTC.
* rtc.conf: WebRTC to WebRTC clients.
* rtmp2rtc.conf: Covert RTMP to WebRTC.
* rtc2rtmp.conf: Covert WebRTC to RTMP.

## Config: Candidate

由于`candidate`特别、特别、特别的重要，大概有1/3的朋友的问题都是这个配置不对。只要`candidate`配置不对，一定会出问题，没有其他可能，是一定会出问题。

其实，`candidate`就是服务器的`候选地址`，客户端可以连接的地址`ip:port`，在SDP交换中，就有个`candidate`的信息，比如服务器回的answer可能是这样：

```bash
type: answer, sdp: v=0
a=candidate:0 1 udp 2130706431 192.168.3.6 8000 typ host generation 0
```

上面SDP中的`192.168.3.6 8000`，就是`candidate listen`这两个配置，即服务器的IP和端口。 既然是服务器的IP，那么目前有几种方式可以配置：
* 直接配置成固定的IP，比如：`candidate 192.168.3.6;`
* 用命令`ifconfig`获取本机的内网IP，通过环境变量传递给SRS，比如：`candidate $CANDIDATE;`
* 自动获取，先读取环境变量，然后获取本机网卡的IP，比如：`candidate *;`，下面会有详细说明。
* 在url中通过`?eip=x`指定，比如：`webrtc://192.168.3.6/live/livestream?eip=192.168.3.6`
* 若API和SRS是同一个服务器（默认就是），可以用API的hostname作为CANDIDATE，这种情况下面单独说明。

此外，自动获取本机网卡IP的情况，相关配置如下：
* `candidate *;`或`candidate 0.0.0.0;`，支持任意IP，就意味着让服务器自己选择，先选公网IP，然后选内网IP。
* `use_auto_detect_network_ip on;` 若关闭这个功能，则不会自动选择IP。
* `ip_family ipv4;` 自动选择IP时，选择IPv4还是IPv6的地址。

由于WebRTC推拉流之前，必须访问HTTP API交换SDP，因此在HTTP请求中的hostname一般就是SRS的公网域名或IP。相关配置如下：
* `api_as_candidates on;` 是否开启这个功能。若API是单独的服务器，可以关闭这个功能。
* `resolve_api_domain on;` 若API是域名，是否将域名解析为IP地址。注意Firefox不支持域名，所以一般是推荐打开的。
* `keep_api_domain on;` 是否保留API的域名，支持域名解析的客户端可以自己解析IP地址，避免服务器实现解析。

> Note: 注意，如果以上途径无法获取CANDIDATE，还是会自动选择一个网卡的IP，避免失败(无CANDIDATE一定失败)。

简单来说，如果在SRS运行的服务器上，运行`ifconfig`获取的IP地址，是客户端访问不了的地址， 就必须通过配置`candidate`，指定一个客户端能访问的地址。

通过`ifconfig`获取本机IP：

```bash
# For macOS
CANDIDATE=$(ifconfig en0 inet| grep 'inet '|awk '{print $2}')

# For CentOS
CANDIDATE=$(ifconfig eth0|grep 'inet '|awk '{print $2}')

# Directly set ip.
CANDIDATE="192.168.3.10"
```

设置环境变量，然后启动SRS：

```bash
env CANDIDATE="192.168.3.10" \
  ./objs/srs -c conf/rtc.conf
```

用Docker方式运行SRS，设置环境变量的方法：

```bash
export CANDIDATE="192.168.3.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
  objs/srs -c conf/rtc.conf
```

> Note：Docker的详细用法参考[srs-docker](https://github.com/ossrs/dev-docker/tree/v4#usage)，
> 镜像地址和可用的版本参考[这里](https://hub.docker.com/r/ossrs/srs/tags)或[这里](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images)。

## Stream URL

直播和WebRTC的基本概念都是流(Stream)，流的URL定义有很高的概念一致性，
参考下面SRS的几个演示流：

* [webrtc://d.ossrs.net/live/livestream](http://ossrs.net/players/rtc_player.html?vhost=d.ossrs.net&server=d.ossrs.net&port=1985&autostart=true)
* [http://d.ossrs.net/live/livestream.flv](http://ossrs.net/players/srs_player.html?app=live&stream=livestream.flv&server=d.ossrs.net&port=80&autostart=true&vhost=d.ossrs.net&schema=http)
* rtmp://d.ossrs.net/live/livestream

在线演示，WebRTC推流，WebRTC播放：

* 推流：[webrtc://d.ossrs.net/live/show](https://ossrs.net/players/rtc_publisher.html?vhost=d.ossrs.net&server=d.ossrs.net&api=443&autostart=true&schema=https&stream=show)
* 播放：[webrtc://d.ossrs.net/live/show](https://ossrs.net/players/rtc_player.html?vhost=d.ossrs.net&server=d.ossrs.net&api=443&autostart=true&schema=https&stream=show)

> Remark: 可能会比较卡，因为服务器支持3个并发观看。

> Remark: 由于Flash已经被禁用，RTMP流无法在Chrome播放，请使用VLC播放。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，开启直播和RTC，对应的流地址是：

* VLC(RTMP): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)
* H5(WebRTC): [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true)

SRS的URL定义，遵守的是HTTP的URL定义，不同的流的schema不同，比如RTC的是`webrtc`。

## HTTP API

关于SRS的WebRTC API，请参考[publish](./http-api.md#webrtc-publish)和[play](./http-api.md#webrtc-play).

## RTMP to RTC

WebRTC可以作为直播的一个播放器，播放直播流，延迟比RTMP还要低，更能抗网络抖动。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
  objs/srs -c conf/rtmp2rtc.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: SRS 4.0.14+支持RTMP推流，WebRTC播放。

相关的配置说明：

* `rtc.rtmp_to_rtc`：是否将RTMP转RTC。禁用时，推RTMP流无法使用WebRTC播放。开启时，音频转码为opus（一路流消耗2%左右CPU）。
* `rtc.keep_bframe`：是否保留B帧，RTMP流中一般会有B帧，而RTC没有，默认丢弃B帧。
* `min_latency`：如果开启了RTC，这个配置的默认值也是on，而RTMP这个的默认值是off。
* `play.mw_latency`：如果开启了RTC，这个配置的默认值是0。
* `play.mw_msgs`：如果开启RTC，`min_latency`开启默认为0，否则默认为1，比直播的默认值要小。

使用RTMP推流到本机：

```bash
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

可播放的流地址：

* WebRTC播放：[http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true)
* HTTP-FLV播放：[http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)

> Remark: 默认静音(H5自动播放要求的)，可以点右下角小喇叭开启声音。

## RTC to RTC

WebRTC本身是可以推流和拉流的，全链路延迟都很低。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
  objs/srs -c conf/rtc.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: SRS 4.0.76+支持WebRTC推流，WebRTC播放。

演示，WebRTC推流和播放，链接：

* WebRTC推流：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_publisher.html?stream=show&autostart=true)
* WebRTC播放：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_player.html?stream=show&autostart=true)

> Remark: 推流时，必须是HTTPS页面，当然本机localhost没这个限制。

## RTC to RTMP

WebRTC推流，可以转成RTMP流播放，SRS只会对音频转码（Opus转AAC），因此要求视频是H.264编码。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
  objs/srs -c conf/rtc2rtmp.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: SRS 4.0.95+支持WebRTC推流，RTMP/HTTP-FLV播放，参考[#2303](https://github.com/ossrs/srs/pull/2303)。

相关的配置说明：

* `rtc.rtc_to_rtmp`：是否开启RTC转RTMP，只会对音频转码（Opus转AAC），视频（H.264）不转码，默认off。
* `rtc.pli_for_rtmp`：请求关键帧的间隔，单位秒，RTC没有固定GOP，而RTMP一般需要，默认6.0。

演示，WebRTC推流和播放，链接：

* WebRTC推流：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_publisher.html?stream=show&autostart=true)
* WebRTC播放：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_player.html?stream=show&autostart=true)
* HTTP-FLV播放：[http://localhost:8080/live/show.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=show.flv)
* RTMP流（可用VLC播放）：rtmp://localhost/live/show

## SFU: One to One

SRS早就具备了SFU的能力，比如一对一通话、[多人通话](./webrtc.md#sfu-video-room)、[直播连麦](./webrtc.md#room-to-live)等等。在沟通中，一对一是常用而且典型的场景，
让我们一起来看看如何用SRS做直播和RTC一体化的一对一通话。

> 下面以Docker中运行DEMO为例子，若希望从代码编译，请设置好对应的环境变量和启动命令。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
  objs/srs -c conf/rtc.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Note: More images and version is [here](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images).

> Note: Demo的H5页面，是在SRS镜像中的。

本机启动信令(参考[usage](https://github.com/ossrs/signaling#usage))，例如：

```bash
docker run --rm -p 1989:1989 registry.cn-hangzhou.aliyuncs.com/ossrs/signaling:1
```

> Note: More images and version is [here](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/signaling/images).

启动[httpx-static](https://github.com/ossrs/go-oryx/tree/develop/httpx-static#usage)，转换HTTPS和WSS协议：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm -p 80:80 -p 443:443 registry.cn-hangzhou.aliyuncs.com/ossrs/httpx:1 \
    ./bin/httpx-static -http 80 -https 443 -ssk ./etc/server.key -ssc ./etc/server.crt \
          -proxy http://$CANDIDATE:1989/sig -proxy http://$CANDIDATE:1985/rtc \
          -proxy http://$CANDIDATE:8080/
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

本机(localhost)可以直接打开[http://localhost/demos/one2one.html?autostart=true](http://localhost/demos/one2one.html?autostart=true)。

若非本机，则可以打开[https://192.168.3.6/demos/one2one.html?autostart=true](https://192.168.3.6/demos/one2one.html?autostart=true)。

> 注意：自签名证书，在空白处输入`thisisunsafe`（注意没空格）。

## SFU: Video Room

SRS支持多人通话的SFU能力，请参考[一对一通话](./webrtc.md#sfu-one-to-one)搭建环境，然后访问页面：

本机(localhost)可以直接打开[http://localhost/demos/room.html?autostart=true](http://localhost/demos/room.html?autostart=true)。

若非本机，则可以打开[https://192.168.3.6/demos/room.html?autostart=true](https://192.168.3.6/demos/room.html?autostart=true)。

> 注意：自签名证书，在空白处输入`thisisunsafe`（注意没空格）。

若需要会议转直播，请参考[RTC转直播](./webrtc.md#room-to-live)。

## Room to Live

上面我们介绍了[一对一通话](./webrtc.md#sfu-one-to-one)，如果能将这个通话合成一个流，叠加视频和混音，
转成RTMP流推送到直播，这就是连麦了。

> Note: [多人通话](./webrtc.md#sfu-video-room)也是可以转直播的，原理一样，只是多人通话的流更多。

注意请开启RTC转RTMP，我们合并的是RTMP流，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:4 \
  objs/srs -c conf/rtc2rtmp.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Note: More images and version is [here](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images).

> Note: 请参考[一对一通话](./webrtc.md#sfu-one-to-one)启动Signaling和httpx-static。

视频合流非常非常消耗CPU，而且有很多种方式：
* SRS+FFmpeg，SRS将WebRTC流转RTMP，FFmpeg将多路RTMP合流。优势：延迟小，音质好；缺点是命令行难度高。
* SRS+OBS，方案和SRS+FFmpeg一样，不过用OBS来实现合流。优势：图形化界面更友好，音质好；缺点是延迟大有不同步风险较大。
* OBS抓浏览器，OBS直接捕获浏览器窗口和电脑的音频。优势：可见即所得，依赖少；缺点是音质不如前面的方案。

SRS+FFmpeg方案，我们在一对一通话的DEMO中，给出了使用FFmpeg合流的命令，比如：

```bash
ffmpeg -f flv -i rtmp://192.168.3.6/live/alice -f flv -i rtmp://192.168.3.6/live/314d0336 \
     -filter_complex "[1:v]scale=w=96:h=72[ckout];[0:v][ckout]overlay=x=W-w-10:y=H-h-10[out]" -map "[out]" \
     -c:v libx264 -profile:v high -preset medium \
     -filter_complex amix -c:a aac \
     -f flv rtmp://192.168.3.6/live/merge
```

输入：
* rtmp://192.168.3.6/live/alice
* rtmp://192.168.3.6/live/314d0336

输出：
* rtmp://192.168.3.6/live/merge

SRS+OBS可以添加多个MediaSource（媒体源），将File（文件）的勾选去掉，就可以输入上面的两个RTMP流。

OBS直接捕获浏览器，可以选择WindowCapature（窗口捕获），直接选择浏览器即可。

> Note: 转直播后，就可以使用SRS的直播录制（DVR）功能，将每个RTC流录下来，也可以录合并的流。

Winlin 2020.03

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v4/webrtc)


