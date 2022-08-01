---
title: 点播FLV流
sidebar_label: 点播FLV流
hide_title: false
hide_table_of_contents: false
---

# 点播FLV流

## HTTP VOD

推荐以下的方式：
* 点播建议用http分发，http服务器一大堆。
SRS能将直播流录制为flv文件，并且提供了一些工具来支持flv点播流，
但是应该使用其他的HTTP服务器分发flv文件。
* 总之，srs不支持点播，只支持直播。这是官方回答。

点播FLV流的主要流程是：

* 服务器录制直播为FLV文件，或者上传FLV点播文件资源，到SRS的HTTP根目录：`objs/nginx/html`
* HTTP服务器必须要支持flv的start=offset，譬如nginx的flv模块，或者SRS的实验性HTTP服务器。
* 使用`research/librtmp/objs/srs_flv_injecter`将FLV的时间和对于的offset（文件偏移量）写入FLV的metadata。
* 播放器请求FLV文件，譬如：`http://192.168.1.170:8080/sample.flv`
* 用户点击进度条进行SEEK，譬如SEEK到300秒。
* 播放器根据inject的时间和offset对应关系找出准确的关键帧的offset。譬如：300秒偏移是`6638860`
* 根据offset发起新请求：`http://192.168.1.170:8080/sample.flv?start=6638860`

备注：SRS还不支持限速，会以最快的速度将文件发给客户端。
备注：SRS还提供了查看FLV文件内容的工具`research/librtmp/objs/srs_flv_parser`，可以看到metadata和每个tag信息。

## SRS Embeded HTTP server

SRS支持http-api，因此也能解析HTTP协议（目前是部分支持），所以也实现了一个简单的HTTP服务器。

SRS的HTTP服务器已经重写，稳定可以商用。

对于一些嵌入式设备，并发也不高时，可以考虑使用SRS的HTTP服务器分发HLS，这样比较简单。

## Config

参考[HTTP Server](./http-server#config)

Winlin 2015.1

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-4/doc/flv-vod-stream)


