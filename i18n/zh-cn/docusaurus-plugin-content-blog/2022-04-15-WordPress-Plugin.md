---
slug: WordPress-Plugin
title: 如何用WordPress+SRS做直播网站
authors: []
tags: [tutorial, wordpress, streaming]
custom_edit_url: null
---

# 如何用WordPress+SRS做直播网站

## Introduction

如果你已经有了一台 [SRS云服务器](https://www.bilibili.com/video/BV1844y1L7dL/) ，推流后可以用播放器播放直播流，
可以用H5或[VLC](https://www.videolan.org/) 播放。

但是如果你想在WordPress网站的文章中，播放HLS、HTTP-FLV或WebRTC直播流，要怎么搞？

在这个文章中，我会给出如何使用WordPress的SrsPlayer插件，来直接播放直播流，做一个直播网站，观众可以观看。

## Prerequisites

操作的前提条件是：

1. 安装下OBS，请在 [这里](https://obsproject.com/) 下载和安装OBS。
1. 安装和设置完 [SRS云服务器](https://www.bilibili.com/video/BV1844y1L7dL/) 。
1. 安装和设置好WordPress，可以用WordPress写文章了，这个麻烦网上搜一搜。很多介绍了。

这个文章中，我们会用`your_public_ipv4`和`your_domain_name`，代表你的SRS服务器的IP和域名，请替换成你的地址。

## Step 1: Download the SRS WordPress Plugin

打开WordPress的后台，点击`Plugins > Add New`按钮。

![](/img/blog-2022-04-15-001.png)

搜索插件`SRS Player`，或者直接打开页面 [链接](https://wordpress.org/plugins/srs-player/) 安装插件。

![](/img/blog-2022-04-15-002.png)

点击`Install Now`按钮，安装完成后，点击`Activate`按钮激活插件。

## Step 2: Embed the WordPress Plugin shortcode into your post or page.

从SRS的后台，直接拷贝WordPress的Shortcode，如下图所示：

![](/img/blog-2022-04-15-003.png)

在WordPress中，创建一个Post或Page。

![](/img/blog-2022-04-15-004.png)

在Post或Page中，新建一个Shortcode。

![](/img/blog-2022-04-15-005.png)

![](/img/blog-2022-04-15-006.png)

![](/img/blog-2022-04-15-007.png)

在Shortcode中，粘贴已经复制的流地址。比如：

1. HLS `[srs_player url="https://your_public_ipv4/live/livestream.m3u8"]`
1. FLV `[srs_player url="https://your_public_ipv4/live/livestream.flv"]`
1. WebRTC `[srs_player url="webrtc://your_public_ipv4/live/livestream"]`

点击`Publish`按钮，然后访问你的页面。

![](/img/blog-2022-04-15-008.png)

你的播放器应该在页面上正常播放了。

> Note: SRS不需要HTTPS，但是如果你的WordPress网站是HTTPS的，那么就无法播放非HTTPS的流。这时候就必须设置SRS的HTTPS，请参考
> [如何设置HTTPS](./2022-04-12-SRS-Cloud-HTTPS.md)。

Step 3: Resize the player on your post or page.

播放器默认的大小是视频流的大小，自动检测的，一般可以不用调整。如果你希望设置也可以，可以加一个属性`width="your chosen width"`就可以。

例如，如果你希望设置为320，那么代码如下：

```text
[srs_player url="https://ip/live/livestream.m3u8" width="320"]
```

你的播放器的宽会变成320，而高是自动等比调整的。

## Step 4: Set up your SRS server as HTTPS (optional)

如果你的WordPress网站是HTTPS的，但是SRS是HTTP，会播放失败。因为HTTPS网站不能访问HTTP资源，这是浏览器安全要求。

请参考[如何设置HTTPS](./2022-04-12-SRS-Cloud-HTTPS.md)，让SRS支持HTTPS的流。

## Conclusion

在这个文章中，我们设置了WordPress插件，并且在Post或Page中，实现了直播播放。如果对于SRS有问题，那么可以参考
[Wiki](https://github.com/ossrs/srs/wiki/v4_CN_Home) 。也欢迎加微信群 [这里](https://github.com/ossrs/srs/wikis/Contact#wechat) 。

