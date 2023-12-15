---
slug: obs-whip-internet-service
title: SRS Stack - 为OBS快速构建公网WHIP服务
authors: []
tags: [live, obs, whip, streaming]
custom_edit_url: null
---

# Effortlessly Create a Public Internet WHIP Service for OBS: A Comprehensive Guide to Sub-Second Streaming

## Introduction

您是否厌倦了在尝试为OBS创建公共互联网WHIP服务时与复杂设置和技术术语作斗争？再也不用寻找了！在本综合指南中，
我们将引导您通过使用SRS Stack一键轻松构建自己的WHIP服务的过程。告别安全性、身份验证和WebRTC的复杂性，
拥抱亚秒级直播和无缝OBS-RTC房间连接的未来。

<!--truncate-->

加入我们，打破在线流媒体的障碍，帮助您充分利用OBS的WHIP支持。我们易于理解的、分步教程将使您能够创建一个安全高效的WHIP服务，
彻底改变您的在线会议和直播体验。不要再让技术挑战阻碍您前进 - 深入了解我们的指南，从今天开始像专业人士一样进行流媒体！

### Step 1: Create SRS Stack by one click

如果您使用腾讯云轻量服务器，只需点击一下即可创建SRS Stack。请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

您还可以使用Docker通过单个命令行创建SRS Stack：

```bash
docker run --rm -it -p 80:2022 -p 443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建SRS Stack后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Get the WHIP URL from SRS Stack

请从[此链接](https://github.com/obsproject/obs-studio/releases)下载 OBS 30 或更高版本，并继续进行安装。

打开 SRS Stack，选择`场景 > 推拉直播流 > WebRTC：WHIP OBS`，并操作步骤，获取一个WHIP的推流地址。

![](/img/blog-2023-12-12-01.png)

请复制 WHIP URL，因为我们将在 OBS 中使用它。请注意，可以使用 WHEP 播放器播放 WHIP 流或将其嵌入到您的 
WordPress 网站中。

## Step 3: Publish WHIP via OBS to SRS Stack

接下来，启动 OBS 并选择`设置 > 流`。从`服务`下拉菜单中选择`WHIP`，并将 WHIP URL 设置到`服务器`字段中。

![](/img/blog-2023-12-12-02.png)

现在，您可以点击`开始直播`按钮将 WHIP 流发布到 SRS Stack。

## Step 4: Use WHEP to View the Stream

在发布流之后，您可以使用WebRTC HTML5播放器查看它。从SRS Stack管理后台访问WHEP播放器。

![](/img/blog-2023-12-12-03.png)

此外，将WHEP播放器集成到您的WordPress网站中。请遵循SRS Stack管理后台上提供的指南。

## Conclusion

总之，我们的全面指南为您提供了一种简单高效的方法，使用SRS Stack为OBS创建公共互联网WHIP服务。通过遵循我们易于理解的分步教程，
您现在可以毫不费力地仅通过单击一下即可构建自己的WHIP服务，无需应对复杂的安全性、认证和WebRTC问题。有了这个新发现的知识，
您可以彻底改变您的在线会议和直播体验，充分利用OBS的WHIP支持实现亚秒级流媒体和无缝OBS-RTC房间连接。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-12-12-SRS-Stack-OBS-WHIP-Service)
