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
| 许可证      | MIT | AGPL-3.0-or-later      | SRS是MIT，而SRS Stack是AGPL-3.0-or-later。          |
| 直播流      | 是    | 是        | 两者都支持RTMP，HLS和HTTP-FLV协议。     |
| WebRTC   | 是    | 是        | 两者都支持WebRTC。                  |
| 控制台      | 增强   | HTTP API | SRS Stack提供了更强大的控制台。          |
| 身份验证     | 是    | HTTP回调   | SRS Stack具有内置身份验证，而SRS使用回调。   |
| DVR      | 增强   | 基于文件     | SRS Stack支持将DVR存储到文件和云存储。     |
| 转发       | 增强   | 基本       | SRS Stack可以通过各种协议转发到多个平台。     |
| 虚拟直播     | 是    | 否        | SRS Stack提供了先进的虚拟直播功能。        |
| WordPress | 是    | 否        | SRS Stack提供了WordPress插件和操作指南。 |
| Transcoding | 是 | 否 | SRS Stack提供了直播转码的能力。|

特别说明：

* 请选择Ubuntu 20系统，其他系统可能会碰到一些奇怪的问题。

## Docker

推荐使用Docker运行SRS Stack：

```bash
docker run --rm -it --name srs-stack -v $HOME/data:/data \
  -p 2022:2022 -p 2443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

请打开页面[http://localhost:2022](http://localhost:2022)开始使用SRS Stack。

关于使用说明，请参考 [SRS Stack Docker](https://github.com/ossrs/srs-stack#usage)。

## HELM

推荐使用HELM安装和运行SRS Stack：

```bash
helm repo add srs http://helm.ossrs.io/stable
helm install srs srs/srs-stack
```

请打开页面[http://localhost](http://localhost)开始使用SRS Stack。

## BT

SRS Stack提供了宝塔插件，使用方法参考[宝塔插件](/blog/BT-aaPanel)。

## Script

对于 Ubuntu 20+，您可以下载 [linux-srs_stack-zh.tar.gz](https://github.com/ossrs/srs-stack/releases/latest/download/linux-srs_stack-zh.tar.gz)
并安装它。

## TencentCloud LightHouse

在国内做流媒体或RTC业务，可以在腾讯云轻量服务器上购买SRS Stack，参考[SRS Stack：起步、购买和入门](/blog/SRS-Stack-Tutorial)。

## DigitalOcean Droplet

若你需要做出海业务，在海外做直播或者RTC，可以很方便的一键创建SRS Stack，参考
[DigitalOcean Droplet](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ) 使用说明。

## FAQ

若使用SRS Stack时遇到问题，请先阅读[FAQ](/faq-srs-stack)。

## Blogs

* [SRS Stack - 起步、购买和入门](/blog/SRS-Stack-Tutorial)
* [SRS Stack - 如何设置HTTPS](/blog/SRS-Stack-HTTPS)
* [SRS Stack - 如何用WordPress做直播网站](/blog/WordPress-Plugin)
* [SRS Stack - 用宝塔插件做音视频业务](/blog/BT-aaPanel)
* [SRS Stack - 如何实现直播推流鉴权和安全](/blog/Ensuring-Authentication-in-Live-Streaming-Publishing)

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/getting-started-stack)


