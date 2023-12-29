---
title: SRS Stack
sidebar_label: SRS Stack
hide_title: false
hide_table_of_contents: false
---

# SRS Stack

SRS Stack是一个基于Go、Reactjs、SRS、FFmpeg、WebRTC等的轻量级、开源的视频云解决方案。

## Introduction

SRS Stack作为开源的开箱即用的音视频方案，是完全基于场景构建的。 常见的比如推拉流场景，支持各种不同协议的推拉流，
并且支持嵌入到WordPress等网站。

比如录制场景，支持合并多次推流，支持设置过滤器，只录制特定的流。比如转发和虚拟直播，可以将文件和其他流，转发到不同的平台，
或者转发到SRS Stack自身。比如AI自动字幕，可以使用OpenAI的能力，自动识别字幕并将字幕嵌入到视频流中。比如一键自动HTTPS，
可以非常方便的开启HTTPS能力。

未来还会有更多丰富的场景。

## FAQ

若使用SRS Stack时遇到问题，请先阅读[FAQ](/faq-srs-stack)。

## Usage

请根据你的平台，选择安装方式。

> Remark: 请选择Ubuntu 20系统，其他系统可能会碰到一些奇怪的问题。

### Docker

推荐使用Docker运行SRS Stack：

```bash
docker run --restart always -d -it --name srs-stack -v $HOME/data:/data \
  -p 2022:2022 -p 2443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

请打开页面[http://localhost:2022](http://localhost:2022)开始使用SRS Stack。

关于使用说明，请参考 [SRS Stack Docker](https://github.com/ossrs/srs-stack#usage)。

### HELM

推荐使用HELM安装和运行SRS Stack：

```bash
helm repo add srs http://helm.ossrs.io/stable
helm install srs srs/srs-stack --set persistence.path=$HOME/data \
  --set service.http=2022 --set service.https=2443 --set service.rtmp=1935 \
  --set service.rtc=8000 --set service.srt=10080
```

请打开页面[http://localhost:2022](http://localhost:2022)开始使用SRS Stack。

### BT

SRS Stack提供了宝塔插件，使用方法参考[宝塔插件](/blog/BT-aaPanel)。

### Script

对于 Ubuntu 20+，您可以下载 [linux-srs_stack-zh.tar.gz](https://github.com/ossrs/srs-stack/releases/latest/download/linux-srs_stack-zh.tar.gz) 
并安装它。

### TencentCloud LightHouse

在国内做流媒体或RTC业务，可以在腾讯云轻量服务器上购买SRS Stack，参考[SRS Stack：起步、购买和入门](/blog/SRS-Stack-Tutorial)。

### DigitalOcean Droplet

若你需要做出海业务，在海外做直播或者RTC，可以很方便的一键创建SRS Stack，参考 
[DigitalOcean Droplet](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ) 使用说明。

## Features

关于SRS Stack的功能以及与SRS的比较。

### Compare to SRS

在比较SRS Stack和SRS时，两者都提供相似级别的媒体流功能。然而，SRS Stack为终端用户提供了更强大且功能丰富的体验，
无需编写任何代码。用户可以直接使用SRS Stack满足您的媒体服务需求。

| 比较        | SRS Stack | SRS    | 说明                                    |
|-----------|------|--------|---------------------------------------|
| 许可证       | MIT | AGPL-3.0-or-later | SRS是MIT，而SRS Stack是AGPL-3.0-or-later。 |
| 直播流       | 是    | 是      | 两者都支持RTMP，HLS和HTTP-FLV协议。             |
| WebRTC    | 是    | 是      | 两者都支持WebRTC。                          |
| Auto HTTPS  | Yes   | No      | SRS Stack自动申请和更新HTTPS证书.              |
| 控制台       | 增强   | HTTP API | SRS Stack提供了更强大的控制台。                  |
| 身份验证      | 是    | HTTP回调 | SRS Stack具有内置身份验证，而SRS使用回调。           |
| DVR       | 增强   | 基于文件   | SRS Stack支持将DVR存储到文件和云存储。             |
| 转发        | 增强   | 基本     | SRS Stack可以通过各种协议转发到多个平台。             |
| 虚拟直播      | 是    | 否      | SRS Stack提供了先进的虚拟直播功能。                |
| WordPress | 是    | 否      | SRS Stack提供了WordPress插件和操作指南。         |
| 转码        | 是 | 否 | SRS Stack提供了直播转码的能力。                  |
| AI字幕      | Yes   | No     | 自动识别直播语音并转为字幕，叠加到视频                   |

### Streaming and Authentication

SRS Stack支持基于SRS回调的带身份验证的增强流媒体。SRS Stack生成并将流令牌保存到Redis中，并在用户通过RTMP、
SRT或WHIP/WebRTC发布流时验证流令牌。

SRS Stack还代理并保护SRS的所有HTTP API，因此只有经过身份验证的用户才能访问HTTP API和控制台。

### DVR

SRS Stack 支持 DVR 或录制功能，将实时流转换为文件，然后保存到本地磁盘或云存储中。
我们还支持将多个重新发布会话合并到一个 DVR 文件中，并支持设置过滤器来录制指定的流。

详细信息请参阅[服务器端录制和 AWS S3 集成的指南](/blog/Record-Live-Streaming)。

### Automatic HTTPS

SRS Stack 支持自动 HTTPS，只需点击一下，您就可以为您的 SRS Stack 启用 HTTPS。SRS Stack 将自动从 [Let's Encrypt](https://letsencrypt.org/) 
请求和更新 HTTPS 证书。自动 HTTPS 允许 WHIP 或通过网页发布，同时支持 WebRTC，并访问用户的麦克风。

详细信息请参阅[如何通过一键开启HTTPS](/blog/SRS-Stack-HTTPS)。

### Virtual Live Events

您可以使用预先录制的视频来模拟现场活动。您只需1个视频文件就可以进行7x24小时的直播。您还可以将流拉到您的直播间，使直播更强大。
您甚至可以将您的IP摄像头流拉到您的直播间。

请参阅[虚拟直播](/blog/Virtual-Live-Events)和[摄像头直播](/blog/Stream-IP-Camera-Events)。

### Restream

使用SRS Stack，您可以将流媒体重新发送到多个平台。SRS Stack会自动选择一个流进行转发，因此您可以发布多个流作为容错或备份流，
当某个流中断时，SRS Stack会切换到另一个流。

请参阅[多平台转播](/blog/Multi-Platform-Streaming)以获取详细信息。

### AI Transcription

SRS Stack支持由OpenAI提供支持的AI转录功能，将实时语音转换为文本并叠加到视频流中作为新的实时流。借助此功能，您可以吸引更多观众，
特别是对于有听力障碍的人或非母语者。

请参阅[AI自动字幕](/blog/live-streams-transcription)以获取详细信息。

### Transcode

SRS Stack支持对实时流进行转码，以降低比特率、节省带宽和成本，或过滤实时流内容以使其更优。

详细信息请参阅[直播转码](/blog/Live-Transcoding)。

## HTTP API

用户在网页上可以执行的所有操作，也可以通过HTTP API完成。您可以打开`系统配置 > OpenAPI`以获取Bearer令牌并尝试使用HTTP API。

您可以点击网页上的按钮来请求HTTP API，也可以使用curl或js代码来请求HTTP API。请按照网页上的说明操作。

请注意，网页可能使用JWT令牌，但您也可以使用Bearer令牌来请求HTTP API。

## HTTP Callback

HTTP回调是指在Docker容器中运行的SRS Stack，向target URL发起HTTP请求。例如，以下过程说明了当OBS发送RTMP流时，
SRS Stack会给你的服务器发起一个请求，你可以通过target URL来配置你的服务器地址。

```bash
                   +-----------------------+
                   +                       +
+-------+          +     +-----------+     +                 +--------------+
+  OBS  +--RTMP->--+-----+ SRS Stack +-----+----HTTP--->-----+  Your Server +
+-------+          +     +-----------+     +  (Target URL)   +--------------+
                   +                       +
                   +       Docker          +
                   +-----------------------+
```

所有请求的格式是json：

* `Content-Type: application-json`

所有响应都应该遵守：

* 成功：`Status: 200 OK` and `"code": 0`
* 其他代表失败或错误。

关于如何实现回调的处理，请参考[HTTP Callback](/docs/v6/doc/http-callback#go-example)

### HTTP Callback: Connectivity Check

有时，您可能需要验证网络是否可访问并确定要使用的适当目标URL。通过在Docker容器内使用curl命令，您可以模拟此请求并确认
target URL是否可以通过curl或SRS Stack访问。

首先，在SRS Stack的容器中安装curl：

```bash
docker exec -it srs-stack apt-get update -y
docker exec -it srs-stack apt-get install -y curl
```

然后，用curl模拟SRS Stack发起一个HTTP请求：

```bash
docker exec -it srs-stack curl http://your-target-URL
```

你可以使用任何合法的target URL来测试，包括：

* 内网IP：`http://192.168.1.10/check`
* 公网IP：`http://159.133.96.20/check`
* HTTP地址，使用域名： `http://your-domain.com/check`
* HTTPS地址，使用域名：`https://your-domain.com/check`

请记住，您应在SRS Stack Docker中测试与target URL的连通性，并避免从其他服务器运行curl命令。

### HTTP Callback: on_publish

For HTTP callback `on_publish` event:

```json
Request:
{
  "request_id": "3ab26a09-59b0-42f7-98e3-a281c7d0712b",
  "action": "on_unpublish",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream",
  "param": "?secret=8f7605d657c74d69b6b48f532c469bc9"
}

Response:
{
  "code": 0
}
```

* Allow publishing if response success.
* Reject publishing if response error.

### HTTP Callback: on_unpublish

For HTTP callback `on_unpublish` event:

```json
Request:
{
  "request_id": "9ea987fa-1563-4c28-8c6c-a0e9edd4f536",
  "action": "on_unpublish",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream"
}

Response:
{
  "code": 0
}
```

* Ignore any response error.

### HTTP Callback: on_record_begin

For HTTP callback `on_record_begin` event:

```json
Request:
{
  "request_id": "80ad1ddf-1731-450c-83ec-735ea79dd6a3",
  "action": "on_record_begin",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream",
  "uuid": "824b96f9-8d51-4046-ba1e-a9aec7d57c95"
}

Response:
{
"code": 0
}
```

* Ignore any response error.

### HTTP Callback: on_record_end

For HTTP callback `on_record_end` event:

```json
Request:
{
  "request_id": "d13a0e60-e2fe-42cd-a8d8-f04c7e71b5f5",
  "action": "on_record_end",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream",
  "uuid": "824b96f9-8d51-4046-ba1e-a9aec7d57c95",
  "artifact_code": 0,
  "artifact_path": "/data/record/824b96f9-8d51-4046-ba1e-a9aec7d57c95/index.mp4",
  "artifact_url": "http://localhost:2022/terraform/v1/hooks/record/hls/824b96f9-8d51-4046-ba1e-a9aec7d57c95/index.mp4"
}

Response:
{
  "code": 0
}
```

* The `uuid` is the UUID of record task.
* The `artifact_code` indicates the error code. If no error, it's 0.
* The `artifact_path` is the path of artifact mp4 in the container.
* The `artifact_url` is the URL path to access the artifact mp4.
* Ignore any response error.

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/getting-started-stack)


