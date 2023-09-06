---
slug: how-to-stream-youtube-using-a-web-browser
title: SRS Server - 如何用浏览器做YouTube直播
authors: []
tags: [youtube, rtmp, rtmps, webrtc, srs, ffmpeg]
custom_edit_url: null
---

# 如何用浏览器通过RTMP或RTMPS做YouTube直播

> Written by [Winlin](https://github.com/winlinvip) and GPT4

虽然Open Broadcaster Software（OBS）是通过RTMP或RTMPS向YouTube进行直播的广泛使用的解决方案，但还有一种利用网络浏览器的替代方法。

这种方法涉及在网页中使用WebRTC直播您的摄像头，然后使用Simple Realtime Server（SRS）将WebRTC转换为RTMP，并用FFmpeg将RTMP流发布到YouTube。对于那些更喜欢RTMPS的人，可以使用FFmpeg从SRS获取流，将RTMP转为RTMPS，然后发布到YouTube。

<!--truncate-->

## Step 1: Setting Up SRS

首先，从GitHub仓库克隆SRS：

```bash
git clone https://github.com/ossrs/srs.git
```

然后，执行以下命令编译SRS：

```bash
./configure && make
```

最后，使用以下命令启动SRS：

```bash
./objs/srs -c conf/rtc2rtmp.conf
```

要确认成功安装，请在网络浏览器中访问 [http://localhost:8080](http://localhost:8080)

## Step 2: Streaming WebRTC to SRS

打开网页 [http://localhost:8080/players/whip.html](http://localhost:8080/players/whip.html) ，通过WebRTC将您的摄像头流传输到SRS。

![](/img/blog-2023-05-16-001.png)

要预览RTMP流，请使用VLC播放`rtmp://localhost/live/livestream`

## Step 3: Routing RTMP to YouTube

访问YouTube直播流控制台，网址为 [https://youtube.com/livestreaming/dashboard](https://youtube.com/livestreaming/dashboard)

获取流服务器（例如，`rtmp://a.rtmp.youtube.com/live2`）和流密钥（例如，`9xxx-8yyy-3zzz-3iii-7jjj`）。

![](/img/blog-2023-05-16-002.png)

使用FFmpeg从SRS提取RTMP流并将其转发到YouTube，命令如下：

```bash
ffmpeg -i rtmp://localhost/live/livestream -c copy \
  -f flv rtmp://a.rtmp.youtube.com/live2/9xxx-8yyy-3zzz-3iii-7jjj
```

![](/img/blog-2023-05-16-003.png)

## Step 4: Routing RTMPS to YouTube

要通过RTMPS传输流，请将RTMP URL从 `rtmp://a.rtmp.youtube.com/live2/9xxx-8yyy-3zzz-3iii-7jjj` 修改为RTMPS URL，例如 `rtmps://a.rtmp.youtube.com:443/live2/9xxx-8yyy-3zzz-3iii-7jjj`

```bash
ffmpeg -i rtmp://localhost/live/livestream -c copy \
  -f flv rtmps://a.rtmp.youtube.com:443/live2/9xxx-8yyy-3zzz-3iii-7jjj
```

## Conclusion

通过遵循这些说明，您可以使用网络浏览器有效地通过RTMP或RTMPS进行YouTube直播。这种技术为OBS提供了一种实用的替代方案，使您能够利用WebRTC、SRS和FFmpeg的功能，实现流畅高效的直播体验。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2023-05-16-Stream-YouTube-Using-Web-Browser)
