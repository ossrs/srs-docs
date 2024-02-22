---
slug: dubbing-translating
title: SRS Stack - 视频多语言翻译和配音
authors: []
tags: [dubbing, translating, ai, gpt, voice, srs, srs-stack, multilingual]
custom_edit_url: null
---

# Revolutionize Video Content with SRS Stack: Effortless Dubbing and Translating to Multiple Languages Using OpenAI

## Introduction

在当今全球化的世界中，内容创作不再受地理范围的限制。因此，吸引多元、国际化的受众对视频创作者越来越重要。无论您是一名YouTuber、
电影制片人还是电子学习内容提供商，能够让您的内容用多种语言呈现，都会大大提高其影响力。这时SRS Stack的作用就显现出来了 - 
通过OpenAI驱动的先进多语言配音和翻译服务，打破语言障碍现在变得更加简单、经济。

<!--truncate-->

在这篇博客中，我们将讨论SRS Stack如何支持将视频文件从一种语言配音和翻译成另一种语言，例如将一段英语演讲的视频转换成中文字幕和演讲。
我们将探讨这项技术如何帮助您吸引更广泛的受众，发掘内容的全部潜力，同时使用起来非常简单，对您的钱包友好。所以，让我们一起深入了解
多语言视频内容的SRS Stack!

## Step 1: Create SRS Stack by One Click

创建 SRS Stack 很简单，只需点击一下，如果您使用 Digital Ocean droplet，就可以完成。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-SRS-Stack-Tutorial.md)了解详细信息。

您还可以使用 Docker 通过单个命令行创建 SRS Stack：

```bash
docker run --restart always -d -it --name srs-stack -v $HOME/data:/data \
  -p 80:2022 -p 443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建 SRS Stack 后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Upload Video Source File

首先，上传视频源文件，选择 `视频源 > 上传本地文件 > 上传文件` 上传文件：

![](/img/blog-2024-02-21-21.png)

> Note: 你也可以使用其他工具，将视频文件上传到 `/data` 目录，然后选择 `指定服务器文件` 直接使用文件。

## Step 3: Setup OpenAI Secret Key for Dubbing

要使用AI的各种服务，您必须从 OpenAI 获取一个密钥。请在您的浏览器中打开 [API 密钥](https://platform.openai.com/api-keys)
页面，然后点击 `创建新的密钥` 按钮。密钥创建后，复制它并在 SRS Stack 中设置。

然后，在`视频翻译设置 > 语音识别设置`中设置OpenAI的密钥，如下图所示。然后点击 `测试OpenAI服务可用性`按钮，如果测试通过，
没有任何错误，点击`更新`按钮。

![](/img/blog-2024-02-21-22.png)

## Step 4: Setup the Language to Translate

设置视频源的语言，请打开 `视频翻译设置 > 语音识别设置 > 语言` ，然后设置翻译的目标语言，设置AI的提示词 
`视频翻译设置 > 多语言翻译设置 > 提示词` ，点击`更新`按钮。

![](/img/blog-2024-02-21-23.png)

## Step 5: Start Dubbing and Download Translated Video

点击 `开始翻译` 按钮，如下图所示。

![](/img/blog-2024-02-21-24.png)

如果翻译后的视频，比原始视频长，可以点击 `改进翻译` 或者 `合并到下一组` 按钮，让翻译后的语音更短，如下图所示。

![](/img/blog-2024-02-21-25.png)

如果所有的音频分段都没有问题，也就是没有红色背景的分段，你可以点击按钮 `下载翻译视频` 下载。

![](/img/blog-2024-02-21-26.png)

## Conclusion

总之，SRS Stack 支持将视频文件配音和翻译成多种语言，包括将英语语音转换为中文字幕和语音，这对于希望吸引更多观众的内容创作
者来说是一个改变游戏规则的解决方案。通过利用 OpenAI 服务的先进功能，SRS Stack 确保视频本地化的高效、经济实惠和用户友好。
这项了不起的技术不仅打破了语言障碍，还促进了文化交流和全球沟通，推动您的内容进入新领域，为无限可能打开大门。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2024-02-21-dubbing-translating)
