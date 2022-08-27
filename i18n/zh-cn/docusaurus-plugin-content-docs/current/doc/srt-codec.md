---
title: SRT Codec
sidebar_label: SRT Codec
hide_title: false
hide_table_of_contents: false
---

# SRT媒体编码支持格式

## 视频支持格式

当前支持:
* H264
* HEVC

### 支持HEVC特殊说明

srt协议传输媒体是mpegts。mpegts对hevc编码格式是支持封装，标准类型值为(streamtype)0x24，所以srt传输hevc编码的视频格式是天然支持的。

* 支持hevc srt推流
    - `ffmpeg -re -i source.mp4 -c:v libx265 -c:a copy -f mpegts 'srt://127.0.0.1:10080?streamid=livestream'`
* 支持hevc srt拉流
    - `ffplay 'srt://127.0.0.1:10080?streamid=#!::h=live/livestream,m=request'` 


但是因为rtmp协议本身对hevc编码格式的封装没有定义，所以当前是以国内众多cdn定义的类型值为准。

* h264 CodecID(协议定义): 7
* _**hevc CodecID(自定义): 12**_

## 音频支持格式

当前支持编码格式：
* AAC
    - 支持采样率44100, 22050, 11025, 5512.


Runner365 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/srt-codec)


