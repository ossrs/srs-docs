---
slug: SRS-Cloud-HTTPS
title: 如何设置HTTPS
authors: []
tags: [turotial, srs, https]
custom_edit_url: null
---

# 如何设置HTTPS

## Introduction

Let's Encrypt可以提供免费证书，SRS Cloud可以一键申请。

HTTPS在WebRTC中是必要的，若需要在HTTPS的网站中播放直播流，SRS Cloud也必须是HTTPS的流。

这个文章介绍了如何开启SRS Cloud的HTTPS功能，并自动续期。

<!--truncate-->

## Prerequisites

操作的前提条件是：

1. 你得有一个SRS云服务器，参考[云SRS](https://www.bilibili.com/video/BV1844y1L7dL/)
1. 必须有个自己的域名，不能随便填别人的域名，可以上[DNS Pod](http://dnspod.com/)上买个域名，并备案。

文章中，我们会用`your_public_ipv4`和`your_domain_name`，代表你的域名和SRS服务器的公网IP，请替换成你自己的。

## Step 1 - DNS Records Setup

当你有个自己的域名后，需要添加一个DNS A记录，将域名`your_domain_name`指向你的SRS服务器的公网IP，比如:

```text
A your_domain_name your_public_ipv4
```

可以用下面的命令检查你的域名是否生效了：

```bash
ping your_domain_name
```

```text
Output
PING ossrs.io (your_public_ipv4): 56 data bytes
64 bytes from your_public_ipv4: icmp_seq=0 ttl=64 time=11.828 ms
64 bytes from your_public_ipv4: icmp_seq=1 ttl=64 time=16.553 ms
64 bytes from your_public_ipv4: icmp_seq=2 ttl=64 time=12.433 ms
```

如果你访问地址 `http://your_domain_name/mgmt` 应该能看到SRS的控制台。

![](/img/blog-2022-04-12-01.png)

然后，我们申请HTTPS的证书。

## Step 2 - Obtaining an SSL Certificate

请访问SRS控制台的 `系统配置 > HTTPS > 自动HTTPS证书` 并输入域名 `your_domain_name` 然后点击 `申请证书` 会自动从 [Let's Encrypt](https://letsencrypt.org/) 获取证书:

![](/img/blog-2022-04-12-02.png)

证书申请是自动的，不需要人工干预，请等待就好了。

若申请成功，请访问 `https://your_domain_name/mgmt` 可以看到已经是HTTPS的了。

![](/img/blog-2022-04-12-03.png)

> Note: 你可以指定多个域名，当然每个域名都要解析到这个服务器，用分号分割多个域名，比如 `domain.com;www.domain.com`，这样 `https://domain.com` 和 `https://www.domain.com` 都是可用的。

最后，我们看看如何续期证书。

## Step 3 - About Certificate Auto-Renewal

Let's Encrypt证书是3个月过期，SRS Cloud会自动续期，不需要人工干预。

你可以查看续期的日志：

```bash
docker logs platform |grep renew
```

```text
Output
Thread #crontab: auto renew the Let's Encrypt ssl
Thread #crontab: renew ssl updated=false, message is 
Processing /etc/letsencrypt/renewal/lh.ossrs.net.conf
Certificate not yet due for renewal
The following certificates are not due for renewal yet:
No renewals were attempted.
```

这样我们就完成了HTTPS配置。

## Conclusion

这个文章中，我们设置了DNS A记录，申请了HTTPS证书，如果有问题请关注公众号 [加微信群](/contact) 。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/22-04-12-SRS-Cloud-HTTPS)


