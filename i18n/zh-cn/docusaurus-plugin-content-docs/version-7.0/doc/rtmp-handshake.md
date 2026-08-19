---
title: RTMP 握手
sidebar_label: RTMP 握手
hide_title: false
hide_table_of_contents: false
---

# RTMP Handshake

rtmp 1.0规范中，指定了RTMP的握手协议：
* c0/s0：一个字节，说明是明文还是加密。
* c1/s1: 1536字节，4字节时间，4字节0x00，1528字节随机数
* c2/s2: 1536字节，4字节时间1，4字节时间2，1528随机数和s1相同。
这个就是srs以及其他开源软件所谓的simple handshake，简单握手，标准握手，FMLE也是使用这个握手协议。

Flash播放器连接服务器时，若服务器只支持简单握手，则无法播放h264和aac的流，可能是adobe的限制。adobe将简单握手改为了有一系列加密算法的复杂握手（complex handshake） ，详细协议分析参考[变更的RTMP握手](http://blog.csdn.net/win_lin/article/details/13006803)

下表为总结：

| 方式 | 依赖库 | 播放器 | 客户端 | SRS | 用途 |
| ---- | ----- | --------------------- | -------- | --- | ---- |
| Simple<br/>标准握手<br/>简单握手 | 不依赖 | vp6+mp3/speex | 所有 | 支持 | 编码器，譬如FMLE，FFMPEG<br/>srs-librtmp（两种都支持，推荐用Simple） |
| Complex<br/>复杂握手 | openssl | vp6+mp3/speex<br/>h264+aac | Flash | 支持 | 主要是Flash播放器播放H264+aac流时需要，<br/>其他都不需要 |

播放器(Flash Player): Flash播放器支持的编码。

备注：SRS编译时若打开了SSL选项（--with-ssl），SRS会先使用复杂握手和客户端握手，若复杂握手失败，则尝试简单握手。

Winlin 2014.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/rtmp-handshake)


