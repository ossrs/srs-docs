---
slug: SRS-Cloud-Tutorial
title: SRS云服务器：起步、购买和入门
authors: []
tags: [turotial, srs, webrtc, streaming]
custom_edit_url: null
---

# SRS云服务器：起步、购买和入门

SRS云服务器，是开箱即用的音视频方案，提供升级和监控运维能力，同时针对不同音视频的应用场景，开箱即用。

使用起来非常简单，不熟悉服务器和命令行也可以使用，也可以作为开发者的参考实现。

<!--truncate-->

## Video Tutorial

我们准备了视频教程，非常短只有几分钟时间，可以解决你的很多疑问，请观看下面B站的视频：

SRS云服务器：https://www.bilibili.com/video/BV1844y1L7dL/

特别提醒几点：

* 记得防火墙开特定端口哈，开防火墙也很容易。
* 关于云服务器有问题，可以扫视频中的二维码加群。
* 请注意SRS和音视频的相关问题，还是请提到开源社区。

> Note: 这不是SRS的商业版本哈，也不是售后支持群，镜像中涉及的组件都是开源的，大伙儿可以自己随便修改。

## Lighthouse

推荐使用腾讯云轻量服务器Lighthouse镜像，一键部署和安装。详细请看视频，要点如下：

1. 首先登录腾讯云控制台，选择[轻量应用服务器](https://console.cloud.tencent.com/lighthouse)，可阅读原文直达。
1. 点击`购买`或`新建`按钮，在`镜像`中选择`SRS 4.1 Release`，点`购买`就可以了。
1. 等服务器创建完成后，点击进入管理，在`应用管理`中，可以看到需要开的端口，在`防火墙`开放对应端口。
1. 在`应用管理`中，点击进入`访问地址`，首次需要设置密码，然后就看各位的造化了。

> Note: WebRTC需要HTTPS，详细的就请观看视频了哈，可以在进度条看预览小图，找WebRTC那一小节。

> Note: 如果你已经有了轻量服务器，也可以选择`重装系统`，选择`镜像`，然后继续操作。

## CVM

如果Lighthouse的带宽太低，可以选择腾讯云CVM，详细请参考[云SRS支持CVM镜像](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)。

> Note: 我们准备了视频教程，非常短只有几分钟时间，可以解决你的很多疑问，请观看视频教程。

## DigitalOcean

若你需要在海外使用云SRS，可以选择DigitalOcean的Droplet镜像，详细请参考[云SRS支持DigitalOcean镜像](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ)。

> Note: 我们准备了视频教程，非常短只有几分钟时间，可以解决你的很多疑问，请观看视频教程。

## BT

若你希望在其他云厂商和平台，或者自己的虚拟机，可以使用宝塔安装云SRS，详细请参考[云SRS支持宝塔安装](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ)

> Note: 我们准备了视频教程，非常短只有几分钟时间，可以解决你的很多疑问，请观看视频教程。

## aaPanel

若你是海外的其他云厂商和平台，或者海外自己的虚拟机，可以使用宝塔海外版本aaPanel，详细请参考[aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)

> Note: 我们准备了视频教程，非常短只有几分钟时间，可以解决你的很多疑问，请观看视频教程。

## FAQ

如果你有一些疑问，基本上你的疑问其他人也问过，请先在[FAQ](https://github.com/ossrs/srs-cloud/issues/4)中找一找。

> Note: 这些FAQ会不断更新，请访问Github地址，查看最新的FAQ列表。

## Features

如果你想知道云SRS支持哪些功能，或者某个功能是否支持了，请看[Features](https://github.com/ossrs/srs/issues/2856)。

> Note: 这些功能会不断更新，请访问GitHub地址，查看最新的功能列表。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/22-04-09-SRS-Cloud-Tutorial)


