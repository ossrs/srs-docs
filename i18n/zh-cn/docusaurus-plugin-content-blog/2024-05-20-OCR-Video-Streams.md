---
slug: ocr-video-streams
title: Oryx - 基于AI的视频流的OCR和对象识别
authors: []
tags: [ocr, ai, gpt, srs, oryx]
custom_edit_url: null
---

# Leveraging OpenAI for OCR and Object Recognition in Video Streams using Oryx

## Introduction

在当今的数字世界中，视频无处不在。从社交媒体片段到直播，我们每天都在大量消费视频内容。但你是否想过我们如何理解这些视频中的所有信息？
这就是人工智能的作用。有了人工智能的帮助，我们现在可以识别文字、识别物体，甚至描述视频流中的场景。

<!--truncate-->

一个强大的工具使这个过程变得简单，那就是Oryx。在这篇博客中，我们将探讨Oryx如何帮助你在视频流上执行OCR（光学字符识别），
让你能够实时提取有价值的信息。

## Step 1: Create Oryx by One Click

创建 Oryx 很简单，只需点击一下，如果您使用 Digital Ocean droplet，就可以完成。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-Oryx-Tutorial.md)了解详细信息。

您还可以使用 Docker 通过单个命令行创建 Oryx：

```bash
docker run --restart always -d -it --name oryx -v $HOME/data:/data \
  -p 80:2022 -p 443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/oryx:5
```

创建 Oryx 后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Publish a Live Stream to Oryx

您可以使用 OBS 或 FFmpeg 将直播流发布到 Oryx。您还可以设置 HTTPS 并通过 WebRTC 发布。

![](/img/blog-2024-05-20-11.png)

发布流后，您可以使用 H5 播放器或 VLC 预览它。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-Oryx-Tutorial.md)了解详细信息。

## Step 3: Setup OpenAI Secret Key for OCR

要使用 Whisper ASR，您必须从 OpenAI 获取一个密钥。请在您的浏览器中打开 [API 密钥](https://platform.openai.com/api-keys)
页面，然后点击 `创建新的密钥` 按钮。密钥创建后，复制它并在 Oryx 中设置。然后，如下图所示，点击 `测试OpenAI服务可用性`
按钮。

![](/img/blog-2024-05-20-12.png)

如果测试成功，你可以点击 `开始OCR` 按钮来启动OCR过程。

## Step 4: Setup AI Instructions for OCR

配置好你的GPT AI助手后，你可以在设置网页上更新以下提示`服务设置 > AI模型配置 > 提示词`。

![](/img/blog-2024-05-20-13.png)

要在视频流中识别文本，你可以使用以下指令：

```text
Recognize the text in the image. Output the identified text directly.
```

请记得在更新AI设置后重新启动OCR。

## Step 5: View OCR Results by Callback

一旦OCR过程完成，你可以通过在Oryx中设置回调URL来查看结果。

![](/img/blog-2024-05-20-14.png)

你也可以在仪表板中查看最新的OCR结果。

![](/img/blog-2024-05-20-15.png)

## Conclusion

总之，使用AI识别视频流中的文本和物体是一个改变游戏规则的技术。它帮助我们快速准确地从视频中提取有价值的信息。
像Oryx这样的工具使这个过程变得简单高效，让你能够轻松发布直播并获得实时OCR结果。无论你是想识别人、读取文本还是描述场景，
AI驱动的OCR都可以改变你与视频内容的互动方式。通过利用这些技术，你可以从每天接触到的视频中解锁新的可能性和见解。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/24-05-20-OCR-Video-Streams)
