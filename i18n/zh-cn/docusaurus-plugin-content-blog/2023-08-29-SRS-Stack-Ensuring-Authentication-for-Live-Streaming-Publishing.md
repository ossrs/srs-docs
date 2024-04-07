---
slug: Ensuring-Authentication-in-Live-Streaming-Publishing
title: Oryx - 如何实现直播推流鉴权和安全
authors: []
tags: [live streaming, security, authentication]
custom_edit_url: null
---

# Ensuring Authentication in Live Streaming Publishing

在当今的数字时代，直播变得越来越受欢迎，像视频号和抖音这样的平台为用户提供了实时直播内容的能力。然而，随着这种越来越受
欢迎的需求，加强安全性和认证措施以保护播放者和观众变得尤为重要。在这篇全面的指南中，我们将深入探讨直播中安全性和认证的重要性，
讨论Oryx解决方案以实现安全发布，并提供一步一步的指南来为您自己的直播服务设置Oryx。

<!--truncate-->

## The Importance of Authentication in Live Streaming

在视频号和抖音等平台上发布直播时，用户需要获取一个流密钥，并使用像OBS将流推送到直播平台。保持流密钥的私密性至关重要，
因为任何有权访问它的人都可以代表您发布流，触发违规行为。

对于那些希望建立自己的直播服务的人来说，确保安全性和认证变得更加关键。这就是Oryx的作用所在，通过使用Publish Secret
来提供安全发布的解决方案。

然而，过于复杂的安全设计也可能导致用户感到困惑和困难，使得流媒体平台难以使用。因此，实施一种安全且简单的解决方案对于
实时流媒体发布至关重要。

## The Oryx Solution for Secure Publishing

Oryx是一个强大的工具，帮助用户建立自己的直播服务，并增强安全性和认证功能。通过使用Publish Secret，Oryx
确保只有授权用户才能发布流，防止未经授权的访问并保护您的内容。

要设置Oryx以实现安全发布，请按照以下步骤操作：

1. 一键创建Oryx。有关详细说明，请访问[Oryx：起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md)

1. 创建后，Oryx将自动生成一个Publish Secret，例如`5181a08ee6eab86597e913e1f9e4c294`。您可以从`System / Authentication / Update Stream Secret`设置它。

1. 从`Scenarios / Streaming`复制OBS设置，包括`Server`和`StreamKey`。例如，`Server`可能是`rtmp://135.98.31.15/live/`，`StreamKey`可能是`livestream?secret=5181a08ee6eab86597e913e1f9e4c294`。

打开HLS播放器播放流，例如 `http://135.98.31.15/live/livestream.m3u8`

例如，您将获得以下网址：

* Publish URL: `rtmp://135.98.31.15/live/livestream?secret=5181a08ee6eab86597e913e1f9e4c294`
* Play URL: `http://135.98.31.15/live/livestream.m3u8`

请注意，播放流网址中不包含Publish Secret，防止观众知道Publish Secret。这样观众只能观看流，而不能发布。

## Supporting Multiple Streams

Oryx允许用户通过根据需要简单地更改资源名称（流名称）来支持多个流。例如，将流名称从`livestream`更改为`movie`：
- Publish URL: `rtmp://135.98.31.15/live/movie?secret=5181a08ee6eab86597e913e1f9e4c294`
- Play URL: `http://135.98.31.15/live/movie.m3u8`

或者您可以将`livestream`更改为`sport`：
- Publish URL: `rtmp://135.98.31.15/live/sport?secret=5181a08ee6eab86597e913e1f9e4c294`
- Play URL: `http://135.98.31.15/live/sport.m3u8`

您可以使用任何您喜欢的名称，例如，`the-10-years-anually-for-you` ：
- Publish URL: `rtmp://135.98.31.15/live/the-10-years-anually-for-you?secret=5181a08ee6eab86597e913e1f9e4c294`
- Play URL: `http://135.98.31.15/live/the-10-years-anually-for-you.m3u8`

> Note: 请注意这些流的Secret都是一样的。

Oryx允许无限数量的同时流，唯一的限制是您的服务器带宽容量。此外，您可以自由选择任何所需的流名称。

## Limitations of the Oryx

然而，Oryx也有一些局限性。

截至目前，只支持全局的Publish Secret，也就是所有推流的Secret是一样的。这是为了保持简单和易用。目前不支持每个流
使用单独的Secret，这需要每次推流都需要生成密钥，并且需要考虑密钥的管理和过期。

此外，与YouTube和Twitch不同，Oryx不支持更改流名称，也就是在发布和播放时使用不同的流名称。这可能会令人困惑，
整体的复杂性很高， 因为它需要一个额外的系统来管理推流和播放流名称的映射。

最后，Oryx目前尚未支持播放流的认证，使流视图对所有人公开和可访问。如果您希望限制流的播放，请告诉我们。这个
功能已经在里规划中了，但没有具体的实施时间表。

## Conclusion

总之，安全性和认证是直播的重要方面，Oryx为那些建立自己的流媒体服务的人提供了一个简单的解决方案。
通过遵循本指南中概述的步骤，您可以确保您的直播服务保持安全并仅对授权用户可访问。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-08-29-Ensuring-Authentication-for-Live-Streaming-Publishing)
