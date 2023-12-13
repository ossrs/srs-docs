---
slug: live-streams-transcription
title: SRS Stack - 直播流AI自动字幕
authors: []
tags: [live, ai, transcription, asr, subtitles]
custom_edit_url: null
---

# Revolutionizing Live Streams with AI Transcription: Creating Accessible, Multilingual Subtitles for Diverse Audiences

## Introduction

在这篇博客中，我们将探讨一种正在改变直播体验的创新方法：使用自动语音识别（ASR）来创建实时字幕。您是否曾想过如何使
直播对听力障碍者或说不同语言的人更具包容性？答案在于一项正在重塑我们体验直播内容的创新技术。

<!--truncate-->

我们的重点是ASR领域的一个颠覆性工具——OpenAI的Whisper。这不仅仅是一项技术；它是一个强大的AI服务，能够理解世界上
几乎所有的语言，并以惊人的准确度转录语音。忘掉过去需要昂贵专业人士进行现场翻译和转录的日子。有了OpenAI的Whisper，
这个过程变得自动化、高效且经济。

这个为初学者设计的指南将带您了解如何将Whisper AI整合到您的直播中，实时识别和转录语音。然后，我们将向您展示如何
使用FFmpeg具，将这些字幕无缝叠加到您的直播上。所有这些都通过SRS Stack轻松实现，该技术将这些技术无缝连接，
只需点击一下。

我们一起迈入以AI为动力的直播未来，其中无障碍和包容性至关重要，使您的内容更加愉快，且能触及更广泛的观众。

### Step 1: Create SRS Stack by one click

如果您使用腾讯云轻量服务器，只需点击一下即可创建SRS Stack。请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

您还可以使用Docker通过单个命令行创建SRS Stack：

```bash
docker run --rm -it -p 80:2022 -p 443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建SRS Stack后，您可以通过 `http://your-server-ip/mgmt` 或 `http://your-server-ip:2022/mgmt` 访问它。

## Step 2: Publish a Live Stream to SRS Stack

您可以使用 OBS 或 FFmpeg 将直播流发布到 SRS Stack。您还可以设置 HTTPS 并通过 WebRTC 发布。

![](/img/blog-2023-11-28-02.png)

发布流后，您可以使用 H5 播放器或 VLC 预览它。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-SRS-Stack-Tutorial.md)了解详细信息。

## Step 3: Setup OpenAI Secret Key for Whisper ASR

要使用 Whisper ASR，您必须从 OpenAI 获取一个密钥。请在您的浏览器中打开 [API 密钥](https://platform.openai.com/api-keys) 
页面，然后点击 `创建新的密钥` 按钮。密钥创建后，复制它并在 SRS Stack 中设置。然后，如下图所示，点击 `测试OpenAI服务可用性` 
按钮。

![](/img/blog-2023-11-28-04.png)

如果测试成功，您可以点击 `开启AI字幕` 按钮以开始直播自动加字幕。

## Step 4: View Live Stream with Subtitles

当生成HLS片段时，SRS Stack使用FFmpeg将TS片段转码为音频MP4文件。然后，它利用OpenAI的Whisper服务将其转换为SRT字幕。
接下来，将字幕覆盖到原始TS文件上，从而创建一个新的直播流。

页面中有链接可以播放带有字幕的新生成的直播流。您可以直接在浏览器中打开此链接，如下图所示。

![](/img/blog-2023-11-28-06.png)

在浏览器中打开HLS流链接，以看到带有字幕的直播。

![](/img/blog-2023-11-28-07.png)

您还可以使用HTTP API获取每个HLS片段的ASR结果，并执行诸如翻译或与您的AI系统集成等操作。

## Conclusion

SRS Stack将OpenAI的Whisper和FFmpeg整合在一起，彻底改变了直播方式，使观众体验更佳，通过提供包容性的AI驱动字幕。
这种从手动转录到自动化转录的转变既节约成本又扩大了全球可及性，克服了语言和听力障碍。我们正在进入一个AI增强数字包容性
的未来，丰富了我们在线分享和消费内容的方式。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/blog-zh/23-11-28-SRS-Stack-Live-Streams-Transcription)
