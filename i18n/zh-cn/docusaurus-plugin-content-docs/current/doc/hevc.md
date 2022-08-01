---
title: HEVC
sidebar_label: HEVC
hide_title: false
hide_table_of_contents: false
---

# SRS支持HEVC编码

## SRS哪些协议支持hevc编码
支持hevc编码的协议：
* rtmp
* httpflv
* hls
* srt: 具体见[srt codec wiki](./srt-codec)

## FLV视频头信息
因为rtmp在2012年后，协议没有更新，对hevc编码格式的支持在rtmp协议官方文档中没有明确定义。<br/>
国内cdn厂商通过修改<video_file_format_spec_v10_1>中CodecID的定义，将flv中的hevc codecid定义为12。<br/>

| Field |Type |	Comment|
| :---: | :---| :---|
|Frame Type|UB [4]|Frame Type Type of video frame. The following values are defined: <br/>1 = key frame (for AVC and HEVC, a seekable frame)<br/>2 = inter frame (for AVC and HEVC, a non-seekable frame)<br/>3 = disposable inter frame (H.263 only)<br/>4 = generated key frame (reserved for server use only)<br/>5 = video info/command frame|
|CodecID|UB [4]|Codec Identifier. The following values are defined:<br/>2 = Sorenson H.263<br/>3 = Screen video<br/>4 = On2 VP6<br/>5 = On2 VP6 with alpha channel<br/>6 = Screen video version 2<br/>7 = AVC<br/>12=HEVC|
|HVCPacketType|	IF CodecID == 12<br/> UI8|	The following values are defined:<br/>0 = HEVC sequence header<br/>1 = HEVC NALU<br/>2 = HEVC end of sequence (lower level NALU sequence ender is not required or supported|
|CompositionTime|	IF CodecID==7 OR CodecID == 12 <br/>SI24	|IF AVCPacketType == 1 OR HVCPacketType == 1<br/>Composition time offset<br/>ELSE<br/>0<br/>See ISO 14496-12, 8.15.3 for an explanation of composition times. The offset in an FLV file is always in milliseconds.|
|VideoTagBody	|IF FrameType == 5<br/>  UI8<br/>ELSE (<br/>IF CodecID == 2<br/>H263VIDEOPACKET<br/>IF CodecID == 3<br/>SCREENVIDEOPACKET<br/>IF CodecID == 4<br/>VP6FLVVIDEOPACKET<br/>IF CodecID == 5<br/>VP6FLVALPHAVIDEOPACKET<br/>IF CodecID == 6<br/>SCREENV2VIDEOPACKET<br/>IF CodecID == 7 <br/>AVCVIDEOPACKET<br/>IF CodecID == 12 <br/>HVCVIDEOPACKET<br/>)|Video frame payload or frame info<br/>If FrameType == 5, instead of a video payload, the Video Data Body contains a UI8 with the following meaning:<br/>0 = Start of client-side seeking video frame sequence<br/>1 = End of client-side seeking video frame sequence<br/>For all but AVCVIDEOPACKET or HVCVIDEOPACKET, see the SWF File<br/>Format Specification for details|


## 如何rtmp推/拉流编码格式hevc
因为当前官方ffmpeg的rtmp推/拉流默认不支持hevc的编码，所以需要重新对ffmpeg进行hevc in flv的自定义修改。<br/>
需要修改3个文件即可：

* libavformat/flv.h
新增hevc类型定义：

```
enum {
    FLV_CODECID_H263    = 2,
    FLV_CODECID_SCREEN  = 3,
    FLV_CODECID_VP6     = 4,
    FLV_CODECID_VP6A    = 5,
    FLV_CODECID_SCREEN2 = 6,
    FLV_CODECID_H264    = 7,
    FLV_CODECID_REALH263= 8,
    FLV_CODECID_MPEG4   = 9,
    FLV_CODECID_HEVC    = 12,
};
```

* libavformat/flvdec.c <br/>
支持hevc编码的flv解封装
* libavformat/flvenc.c <br/>
支持hevc编码的flv封装

如何编译支持hevc in flv的ffmpeg，请参考[ffmpeg supports hevc in flv](https://github.com/runner365/ffmpeg_rtmp_h265)

## 如何rtmp推/拉流hevc示例
在完成支持hevc in flv的定制化ffmpeg编译后，rtmp推流hevc视频编码，如下:

```
ffmpeg -re -i source.flv -c:v libx265 -c:a copy -f flv rtmp://127.0.0.1/live/livestream
```

rtmp拉流hevc视频编码格式，如下：<br/>
```
ffmpeg -i rtmp://127.0.0.1/live/livestream -f flv -y livestream.flv
```
播放：<br/>
```
ffplay rtmp://127.0.0.1/live/livestream
```


Runner365 2020.5

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-5/doc/hevc)


