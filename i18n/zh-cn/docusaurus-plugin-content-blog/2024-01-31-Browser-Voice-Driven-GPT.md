---
slug: browser-voice-driven-gpt
title: Oryx - 基于浏览器的语音驱动的GPT-AI助手
authors: []
tags: [ai, gpt, voice, srs, srs-stack, streaming]
custom_edit_url: null
---

# Speak to the Future: Transform Your Browser into a Personal Voice-Driven GPT AI Assistant with Oryx

想象一下仅通过语音在浏览器中与GPT AI互动，与朋友分享这种功能，或从任何地方访问它。设想一个使学习英语口语变得愉快而简单的助手，
或者通过实时翻译所有内容，让您和说不同语言的朋友进行无缝对话的助手。探索如何将这些激动人心的可能性变为现实！

<!--truncate-->

向您介绍一种突破性的互动工具：一个可以快捷构建的、基于浏览器的语音驱动的GPT AI助手。你可以使用简单易用的Oryx快捷构建，
仅需点击一下即可轻松启用HTTPS，可以在任何配备浏览器的设备上使用，包括PC和手机。它的便利性使您可以在任何时候、任何地方、使用语音
轻松的与您的私人GPT AI助手进行交流。无论是用于提高您的英语口语、充当实时翻译工具，还是作为智能伴侣，这款语音驱动的GPT AI助手都可以
通过简单的对话实现。

## Step 1: Create Oryx by One Click

创建 Oryx 很简单，只需点击一下，如果您使用 Digital Ocean droplet，就可以完成。
请参阅[如何通过 1-Click 设置视频流服务](./2022-04-09-SRS-Stack-Tutorial.md)了解详细信息。

您还可以使用 Docker 通过单个命令行创建 Oryx：

```bash
docker run --restart always -d -it --name srs-stack -v $HOME/data:/data \
  -p 80:2022 -p 443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建 Oryx 后，您可以通过 `http://your-server-ip/mgmt` 访问它。

## Step 2: Setup HTTPS for Voice-Driven GPT

在将语音功能集成到基于浏览器的 GPT AI助手中时，安全性至关重要。浏览器要求在访问麦克风以捕获语音输入时使用 HTTPS，
作为其安全策略的一部分。这听起来可能很复杂，但使用 Oryx，让您的网站启用 HTTPS 变得简单而轻松。以下是如何使用 
HTTPS 保护您的语音驱动助手的方法：

1. **DNS 配置**：首先为您的域名添加 DNS A 记录。此步骤将您的域名指向您的 Oryx 服务器。要验证 DNS 设置是否正确，请尝试通过 http 使用您的域名访问您的 Oryx，如 `http://your_domain_name`。如果设置正确，这应该可以正常工作。

2. **启用 HTTPS**：导航到 Oryx 仪表板中的 `系统配置 > HTTPS > 自动HTTPS证书` 部分。在这里，您只需输入您的域名并点击 `提交` 按钮。此过程启动为您的域名自动生成和安装 Let's Encrypt SSL 证书，使 HTTPS 设置如同点击一下鼠标按钮一样简单。

3. **验证结果**：启用 HTTPS 后，您现在可以通过 "https://your_domain_name" 安全地访问您的 Oryx 站点。此安全策略提高了与 GPT AI助手互动的安全性。

有关更多详细信息，请参阅[设置 Oryx 的 HTTPS](./2022-04-12-SRS-Stack-HTTPS.md)。按照这些步骤操作，您将确保您的语音驱动
GPT AI助手不仅创新且有用，而且安全且符合浏览器安全标准。

## Step 3: Setup OpenAI Secret Key in Live Room

要使用AI的各种服务，您必须从 OpenAI 获取一个密钥。请在您的浏览器中打开 [API 密钥](https://platform.openai.com/api-keys)
页面，然后点击 `创建新的密钥` 按钮。密钥创建后，复制它并在 Oryx 中设置。

接下来，如下图所示，导航至`应用场景 > 直播间 > 创建直播间`，然后按下`创建`按钮以创建一个与GPT AI助手交谈的直播间。或者，
选择链接加入现有的直播间。

![](/img/blog-2024-01-31-21.png)

然后，在`直播间 > AI助手 > AI服务商`中设置OpenAI的密钥，如下图所示。然后点击 `测试OpenAI服务可用性`按钮，如果测试通过，
没有任何错误，点击`更新助手`按钮。

> Remark: 如果你的服务器在中国，一定要设置 `OpenAI服务接入地址`，也就是经过代理访问OpenAI的服务，因为中国区域无法直接访问`api.openai.com`这个域名。

![](/img/blog-2024-01-31-22.png)

设置完成了，非常简单!

## Step 4: Open GPT AI Assistant in Browser

现在，点击 `Assistant` 生成基于浏览器的语音驱动 GPT AI助手的链接，可以直接点击打开。或者右键复制链接，将网址分享给其他设备或朋友。
你也可以在手机上访问它。

![](/img/blog-2024-01-31-23.png)

在打开助手网页时，按`允许`按钮授权麦克风访问权限给助手。

![](/img/blog-2024-01-31-24.png)

然后点击`开始聊天`开始对话。

![](/img/blog-2024-01-31-25.png)

现在，你的助手就准备好了，接下来让我们看如何和她对话。

## Step 5: How to Interact with GPT AI Assistant

当在电脑上（如Apple Mac或Windows PC）使用基于浏览器的语音驱动GPT AI助手时，点击网页上的麦克风图标。按住`空格键`或`R`键开始讲话，
松开键停止讲话。

![](/img/blog-2024-01-31-26.png)

在移动设备浏览器上使用助手时，比如 iPhone 或 Android，按住麦克风键进行讲话，松开即可完成讲话。

![](/img/blog-2024-01-31-27.png)

一旦您向助手提交了您的消息，请稍等片刻。助手将以文字和语音的形式回复您。

> Note: 此外，还有一个文本输入功能，允许您通过键入或从剪贴板粘贴来输入文本。使用语音输入时，输入文本框将自动填充，使您能够编辑并重新发送给助手。

![](/img/blog-2024-01-31-28.png)

好的！接下来，让我展示一些引人入胜且实用的现实世界示例，以及如何通过基于浏览器的语音驱动的GTP助手来实现它们。

## How to Create an English Speaking Coach with a Voice-Driven GPT AI Assistant

一旦您配置好了您的语音驱动的GPT AI助手，你可以在 `AI助手 > AI模型配置 > 提示词` 中，更新为下面的提示词。你就可以获得一个非常好的
口语教练了，它不眠不休、不骄不躁、不会发脾气，非常耐心的陪你训练口语。我使用了一个月之后，从最初的一个词一个词的说，能做到一句话
一句话的说了。

```text
I want you to act as a spoken English teacher and improver. 
I will speak to you in English and you will reply to me in English to practice my spoken English. 
I want you to strictly correct my grammar mistakes, typos, and factual errors. 
I want you to ask me a question in your reply. 
Now let's start practicing, you could ask me a question first. 
Remember, I want you to strictly correct my grammar mistakes, typos, and factual errors.
```

> Note: 更多提示词，可以参考 [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts?#perform-as-a-spoken-english-instructor-and-enhancer) 这个站点。

## How to Create a Simultaneous Translator for Multilingual Users

通过将您的语音激活的GPT AI助手分享给多个用户，使他们可以与同一个AI助手进行交流，那么您将同时获得一名同声传译。你需要将提示词设置为
翻译为多种语言。

请将下面提示词中的语言更改为您需要翻译的语言，请在 `AI助手 > AI模型配置 > 提示词` 中更新提示词：

```text
I want you to act as a language translator.
I want you to translate my text in conversational tone.
I want you to strictly translate to English and Chinese.
Keep in mind that you must translate to English and Chinese.
Remember, never answer questions but only translate.
```

> Note: 更多提示词，可以参考 [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) 这个站点。

## Conclusion

总结一下，使用Oryx创建个人的、基于浏览器的、语音驱动的GPT AI助手的过程非常简单。从设置HTTPS进行安全通信，到集成OpenAI GPT，
每个步骤都设计非常容易使用。无论是为了提高语言能力、实现多语言对话，还是简单地享受便利的语音驱动的GPT AI助手，它为直播间和主播提供了
许多可能性。将来，还将支持将实时观众聊天连接到AI助手。您可以在真实场景中发现更多有益的GPT AI助手用例。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2024-01-31-browser-voice-driven-gpt)
