---
title: SRS Stack
sidebar_label: SRS Stack
hide_title: false
hide_table_of_contents: false
---

# SRS Stack

SRS Stack是一个基于Go、Reactjs、SRS、FFmpeg、WebRTC等的轻量级、开源的视频云解决方案。

在比较SRS Stack和SRS时，两者都提供相似级别的媒体流功能。然而，SRS Stack为终端用户提供了更强大且功能丰富的体验，
无需编写任何代码。用户可以直接使用SRS Stack满足您的媒体服务需求。

| 比较       | SRS Stack | SRS      | 说明                            |
|----------|------|----------|-------------------------------|
| 许可证      | MIT | MIT      | 都是MIT许可证的开源项目。                |
| 直播流      | 是    | 是        | 两者都支持RTMP，HLS和HTTP-FLV协议。     |
| WebRTC   | 是    | 是        | 两者都支持WebRTC。                  |
| 控制台      | 增强   | HTTP API | SRS Stack提供了更强大的控制台。          |
| 身份验证     | 是    | HTTP回调   | SRS Stack具有内置身份验证，而SRS使用回调。   |
| DVR      | 增强   | 基于文件     | SRS Stack支持将DVR存储到文件和云存储。     |
| 转发       | 增强   | 基本       | SRS Stack可以通过各种协议转发到多个平台。     |
| 虚拟直播     | 是    | 否        | SRS Stack提供了先进的虚拟直播功能。        |
| WordPress | 是    | 否        | SRS Stack提供了WordPress插件和操作指南。 |

特别说明：

* 请选择Ubuntu 20系统，其他系统可能会碰到一些奇怪的问题。

## Docker

SRS Stack 提供了一个 Docker 镜像，关于使用说明，请参考 [SRS Stack Docker](https://github.com/ossrs/srs-stack/issues/44)。

## Script

对于 Ubuntu 20+，您可以下载 [linux-srs_stack-zh.tar.gz](https://github.com/ossrs/srs-stack/releases/latest/download/linux-srs_stack-zh.tar.gz)
并安装它。

## TencentCloud LightHouse

在国内做流媒体或RTC业务，可以在腾讯云轻量服务器上购买SRS Stack，参考[SRS Stack：起步、购买和入门](/blog/SRS-Cloud-Tutorial)。

## BT

SRS Stack提供了宝塔插件，使用方法参考[宝塔插件](/blog/BT-aaPanel)。

## DigitalOcean Droplet

若你需要做出海业务，在海外做直播或者RTC，可以很方便的一键创建SRS Stack，参考
[DigitalOcean Droplet](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ) 使用说明。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/getting-started-stack)


