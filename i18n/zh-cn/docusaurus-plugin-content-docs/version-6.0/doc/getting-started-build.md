---
title: Build
sidebar_label: 源码编译
hide_title: false
hide_table_of_contents: false
---

# Build

SRS可以从源码编译和启动，但推荐更简单的[Docker](./getting-started.md)方式启动。

## Live Streaming

直播是SRS的典型场景，支持推直播流后多种观看方式。

下载源码，推荐用[Ubuntu20](./install.md)：

```
git clone -b develop https://gitee.com/ossrs/srs.git
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

> Note: 实例文件`./doc/source.flv`在SRS的源代码目录中有。

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* RTMP (by [VLC](https://www.videolan.org/)): `rtmp://localhost/live/livestream`
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)

## WebRTC

SRS支持WebRTC，可以做会议或视频聊天。

下载源码，推荐用[Ubuntu20](./install.md)：

```
git clone -b develop https://gitee.com/ossrs/srs.git
```

编译，注意需要切换到`srs/trunk`目录：

```
cd srs/trunk
./configure
make
```

启动服务器：

```
CANDIDATE="192.168.1.10"
./objs/srs -c conf/srs.conf
```

> Note: 请将IP换成你的SRS的IP地址。

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

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

本机推拉流（即浏览器和SRS都在本机），使用WebRTC推流到SRS：[WebRTC: Publish](http://localhost:8080/players/rtc_publisher.html?autostart=true&stream=livestream&port=8080&schema=http)

> Note: 非本机推拉流，也就是不能用localhost访问SRS时，浏览器限制必须HTTPS才能推拉流，请参考[WebRTC using HTTPS](./getting-started-build.md#webrtc-using-https)，再次强调这是浏览器限制。

打开页面观看WebRTC流：[WebRTC: Play](http://localhost:8080/players/rtc_player.html?autostart=true&stream=livestream&schema=http)

> Note: 可以打开不同的页面，推拉不同的流，就可以实现视频聊天了。

## WebRTC for Live Streaming

SRS支持直播转WebRTC，推直播流，使用WebRTC观看。

下载源码，推荐用[Ubuntu20](./install.md)：

```
git clone -b develop https://gitee.com/ossrs/srs.git
```

编译，注意需要切换到`srs/trunk`目录：

```
cd srs/trunk
./configure
make
```

启动服务器：

```
CANDIDATE="192.168.1.10"
./objs/srs -c conf/rtmp2rtc.conf
```

> Note: 请将IP换成你的SRS的IP地址。

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Note: 注意如果RTMP转WebRTC流播放，必须使用配置文件[`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-cn-guide)

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

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

下载源码，推荐用[Ubuntu20](./install.md)：

```
git clone -b develop https://gitee.com/ossrs/srs.git
```

编译，注意需要切换到`srs/trunk`目录：

```
cd srs/trunk
./configure
make
```

启动服务器：

```
CANDIDATE="192.168.1.10"
./objs/srs -c conf/https.rtc.conf
``` 

> Note: 请将IP换成你的SRS的IP地址。

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: 请使用你的证书文件，代替上面配置中的key和cert，请参考
> **[HTTPS API](./http-api.md#https-api)**
> 以及 **[HTTPS Callback](./http-callback.md#https-callback)**
> 以及 **[HTTPS Live Streaming](./flv.md#https-flv-live-stream)**，
> 当然了HTTPS的反向代理也能和SRS工作很好，比如Nginx代理到SRS。

使用WebRTC推流到SRS：[WebRTC: Publish](https://192.168.3.82:8088/players/rtc_publisher.html?autostart=true&stream=livestream&api=1990&schema=https)

打开页面观看WebRTC流：[WebRTC: Play](https://192.168.3.82:8088/players/rtc_player.html?autostart=true&stream=livestream&api=1990&schema=https)

> 注意：自签名证书，在空白处输入`thisisunsafe`（注意没空格）。

> Note: 可以打开不同的页面，推拉不同的流，就可以实现视频聊天了。

## Cross Build

注意一般都可以直接编译，即使是ARM系统也可以直接编译，只有嵌入式板子才需要交叉编译。

若需要交叉编译，请参考[ARM和交叉编译](./arm.md)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/getting-started-build)


