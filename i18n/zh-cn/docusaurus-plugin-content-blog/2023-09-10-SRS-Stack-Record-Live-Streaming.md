---
slug: Record-Live-Streaming
title: SRS Stack - 如何录制直播流为MP4文件和对接云存储
authors: []
tags: [live streaming, record, dvr, srs]
custom_edit_url: null
---

# Effortless Live Stream Recording with SRS Stack: A Step-by-Step Guide to Server-Side Recording and AWS S3 Integration

## Introduction

使用SRS Stack，您可以轻松录制直播流并将其发布到网页上供观众观看。在这篇博客中，我们将指导您如何使用SRS Stack将直播流录制为MP4文件。

<!--truncate-->

直播流越来越受欢迎，许多内容创作者希望录制他们的直播流以供日后使用或为观众提供视频点播（VoD）内容。虽然有多种方法可以录制直播流，
例如使用OBS，但一些嵌入式设备可能不支持录制或可能难以控制。在这种情况下，服务器端录制可能是一个更有效的解决方案。

### Step 1: Create SRS Stack by one click

如果您使用腾讯云轻量服务器，只需点击一下即可创建SRS Stack。请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

您还可以使用Docker通过单个命令行创建SRS Stack：

```bash
docker run --rm -it -p 80:2022 -p 443:2443 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

创建SRS Stack后，您可以通过 `http://your-server-ip/mgmt` 访问它。

### Step 2: Publish a live stream to SRS Stack

您可以使用OBS或FFmpeg将直播发布到SRS Stack。您还可以设置HTTPS并通过WebRTC发布。发布流后，您可以使用H5播放器或VLC预览它。

![](/img/blog-2023-09-09-13.png)

推流到SRS Stack后，你可以用网页预览它，也可以用VLC播放。
请参考 [SRS Stack - 起步、购买和入门](./2022-04-09-SRS-Stack-Tutorial.md) 这个博客。

## Step 3: Record the Live Stream by SRS Stack

发布直播流后，您可以使用SRS Stack开始录制。为此，请打开`Scenarios > Record > Setup Record Rules`部分，
然后点击`Start Record`按钮。

![](/img/blog-2023-09-10-04.png)

录制过程将开始，您可以监控录制任务的进度。

![](/img/blog-2023-09-10-05.png)

## Step 4: Stop and Download MP4 File

当您想要停止录制时，请在`Setup Record Rules`部分点击`Stop Record`按钮。等待几秒钟，让录制停止。如果直播流不再发布，
SRS Stack将在几分钟后（例如5分钟）自动停止录制任务。

录制停止后，SRS Stack将把录制的文件转换为MP4格式。然后，您可以预览并下载MP4文件以供进一步使用或分发。

![](/img/blog-2023-09-10-03.png)

![](/img/blog-2023-09-10-03.png)

## How to Record Specific Streams?

参考 [如何录制特定的流](/faq-srs-stack#how-to-record-a-specific-stream)

## How to Record to S3 Cloud Storage?

参考 [如何录制到S3云存储](/faq-srs-stack#how-to-record-to-s3-cloud-storage)

## How to Merge to One Mp4 File?

参考 [为何不能在停止推流时停止录制](/faq-srs-stack#recording-doesnt-stop-when-the-stream-is-stopped)
和 [如何快速生成录制文件](/faq-srs-stack#how-to-quickly-generate-a-recorded-file)

## Conclusion

将直播流录制为MP4文件对于希望为观众提供视频点播内容的内容创作者来说是非常有价值的功能。使用SRS Stack，录制、停止和
下载直播流的过程得到了简化，使您更容易管理和分发录制的内容。按照本博客中概述的步骤，您可以快速高效地录制直播流，
并使观众随时观看。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-09-10-Record-Live-Streaming)
