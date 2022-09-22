---
title: SRT Codec
sidebar_label: SRT Codec
hide_title: false
hide_table_of_contents: false
---

# SRT codec support

## Video codec

当前支持:
* H264
* HEVC

srt协议传输媒体是mpegts。mpegts对hevc编码格式是支持封装，标准类型值为(streamtype)0x24，所以srt传输hevc编码的视频格式是天然支持的。

* 支持hevc srt推流
    - `ffmpeg -re -i source.mp4 -c:v libx265 -c:a copy -f mpegts 'srt://127.0.0.1:10080?streamid=livestream'`
* 支持hevc srt拉流
    - `ffplay 'srt://127.0.0.1:10080?streamid=#!::h=live/livestream,m=request'` 


但是因为rtmp协议本身对hevc编码格式的封装没有定义，所以当推流是HEVC格式时，即使打开了srt_to_rtmp选项，也无法播放。

## Audio codec

当前支持编码格式：
* AAC
    - 支持采样率44100, 22050, 11025, 5512.

## FFmpeg push SRT stream

当使用FFmpeg推AAC音频格式的SRT流时, 建议在命令行里加上`-pes_payload_size 0`这个参数。这个参数会阻止合并多个AAC音频帧在一个PES包里,
这样可以减少延迟以及由于音视频同步问题.
FFmpeg命令行示例:
> `ffmpeg -re -i source.mp4 -c:v libx265 -c:a aac -pes_payload_size 0 -f mpegts 'srt://127.0.0.1:10080?streamid=livestream'

Runner365 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/srt-codec)


