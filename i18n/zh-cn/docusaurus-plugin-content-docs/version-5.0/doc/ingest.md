---
title: Ingest
sidebar_label: Ingest 
hide_title: false
hide_table_of_contents: false
---

# 采集

采集(Ingest)指的是将文件（flv，mp4，mkv，avi，rmvb等等），流（RTMP，RTMPT，RTMPS，RTSP，HTTP，HLS等等），设备等的数据，转封装为RTMP流（若编码不是h264/aac则需要转码），推送到SRS。

采集基本上就是使用FFMPEG作为编码器，或者转封装器，将外部流主动抓取到SRS。

采集的部署实例参考：[Ingest](./sample-ingest.md)

## 应用场景

采集的主要应用场景包括：
* 虚拟直播：将文件编码为直播流。可以指定多个文件后，SRS会循环播放。
* RTSP摄像头对接：以前安防摄像头都支持访问RTSP地址，RTSP无法在互联网播放。可以将RTSP采集后，以RTMP推送到SRS，后面的东西就不用讲了。
* 直接采集设备：SRS采集功能可以作为编码器采集设备上的未压缩图像数据，譬如video4linux和alsa设备，编码为h264/aac后输出RTMP到SRS。
* 将HTTP流采集为RTMP：有些老的设备，能输出HTTP的ts或FLV流，可以采集后转封装为RTMP，支持HLS输出。

总之，采集的应用场景主要是“SRS拉流”；能拉任意的流，只要ffmpeg支持；不是h264/aac都没有关系，ffmpeg能转码。

SRS默认是支持“推流”，即等待编码器推流上来，可以是专门的编码设备，FMLE，ffmpeg，xsplit，flash等等。

如此，SRS的接入方式可以是“推流到SRS”和“SRS主动拉流”，基本上作为源站的功能就完善了。

## 编译

Ingest需要在编译时打开：`--with-ingest`。参考：[Build](./install.md)

Ingest默认使用自带的ffmpeg，也可以不编译ffmpeg，使用自己的编转码工具。禁用默认的ffmpeg在编译时指定`--without-ffmpeg`即可。参考：[Build](./install.md)

## 配置

Ingest的配置如下：

```bash
vhost your_vhost {
    # ingest file/stream/device then push to SRS over RTMP.
    # the name/id used to identify the ingest, must be unique in global.
    # ingest id is used in reload or http api management.
    ingest livestream {
        # whether enabled ingest features
        # default: off
        enabled      on;
        # input file/stream/device
        # @remark only support one input.
        input {
            # the type of input.
            # can be file/stream/device, that is,
            #   file: ingest file specifies by url.
            #   stream: ingest stream specifeis by url.
            #   device: not support yet.
            # default: file
            type    file;
            # the url of file/stream.
            url     ./doc/source.flv;
        }
        # the ffmpeg 
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        # the transcode engine, @see all.transcode.srs.com
        # @remark, the output is specified following.
        engine {
            # @see enabled of transcode engine.
            # if disabled or vcodec/acodec not specified, use copy.
            # default: off.
            enabled          off;
            # output stream. variables:
            # [vhost] current vhost which start the ingest.
            # [port] system RTMP stream port.
            output          rtmp://127.0.0.1:[port]/live?vhost=[vhost]/livestream;
        }
    }
}
```

ingest指令后面是ingest的id，全局需要唯一，用来标识这个ingest。在reload/http-api管理时才知道操作的是哪个。譬如，reload时用来检测哪些ingest更新了，需要通知那些已经存在的ingest，停止已经不存在的ingest。

其中，`type`指定了输入的几种类型：
* file: 输入为文件，url指定了文件的路径。srs会给ffmpeg传递-re参数。
* stream: 输入为流，url指定了流地址。
* device: 暂时不支持。

`engine`指定了转码引擎参数：
* enabled: 指定是否转码，若off或者vcodec/acodec没有指定，则不转码，使用ffmpeg-copy。
* output：输出路径。有两个变量可以使用：port为系统侦听的RTMP端口，vhost为配置了ingest的vhost。
* 其他参考转码的配置：[FFMPEG](./ffmpeg.md)

注意：engine默认为copy，当：
* engine的enabled为off，没有开启转码engine，则使用copy。
* engine的vcodec/acodec没有指定，则使用copy。

## 采集多个文件

实现方法：
* 可以把输入文件变成文件列表。自己写工具实现采集列表。

参考：https://github.com/ossrs/srs/issues/55

Winlin 2014.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/ingest)


