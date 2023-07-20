---
title: 时间戳矫正
sidebar_label: 时间戳矫正
hide_title: false
hide_table_of_contents: false
---

# TimeJitter

描述了SRS的时间戳矫正机制。

## RTMP Monotonically Increase Timestamp

RTMP要求流的时间戳是单增的，视频流的时间戳单增，音频流的时间戳单增。所谓单增就是指单调递增，所谓单调递增就是包的时间戳越来越大。所谓越来越大就是......数字越来越大。

单增有两种情况：
* 分别单增：指的是视频是单增的，音频是单增的，但是流（混合了音频和视频）是不单增的。
* 流单增：指的不仅仅是分别单增，而且流里面的包永远是单增的。

RTMP协议没有说道要求什么级别的单增，但一般指流单增。

如果非单增会怎样？有些服务器会断开连接，librtmp会报错，flash客户端会播放不了之类。但是，实际上并没有那么恐怖（还是保持单增好点，毕竟RTMP协议里说到这个了），所以有些编码器出来的流不是单增也能播放，特别是用vlc播放之类。

## Timestamp Jitter

如果流不是单增的怎么办？SRS采用非常简单的算法保证它是单增的。如果不是单增就把时间戳增量设为40（即fps为25）。这个机制就是SRS的时间戳矫正机制。

有几处地方用到了时间戳矫正：
* RTMP流分发：可以设置vhost的time_jitter来选择矫正机制。分发给客户端的RTMP流的时间戳矫正机制。
* DVR录制：可以设置vhost的dvr的time_jitter来配置矫正机制。录制为flv文件的时间戳处理机制。
* HLS：打开时间戳矫正机制。
* Forward：打开时间戳矫正机制。
* HTTP Audio Stream Fast Cache: 和RTMP一样，即在vhost中配置，参考`fast_cache`.

如果你的编码器只能做到分别单增（对音频和视频分别编码的情况很常见），那么可以关闭时间戳矫正。

## Config

在vhost中配置时间戳矫正：

```bash
vhost jitter.srs.com {
    # for play client, both RTMP and other stream clients,
    # for instance, the HTTP FLV stream clients.
    play {
        # about the stream monotonically increasing:
        #   1. video timestamp is monotonically increasing, 
        #   2. audio timestamp is monotonically increasing,
        #   3. video and audio timestamp is interleaved/mixed monotonically increasing.
        # it's specified by RTMP specification, @see 3. Byte Order, Alignment, and Time Format
        # however, some encoder cannot provides this feature, please set this to off to ignore time jitter.
        # the time jitter algorithm:
        #   1. full, to ensure stream start at zero, and ensure stream monotonically increasing.
        #   2. zero, only ensure sttream start at zero, ignore timestamp jitter.
        #   3. off, disable the time jitter algorithm, like atc.
        # default: full
        time_jitter             full;
        # whether use the interleaved/mixed algorithm to correct the timestamp.
        # if on, always ensure the timestamp of audio+video is interleaved/mixed monotonically increase.
        # if off, use time_jitter to correct the timestamp if required.
        # default: off
        mix_correct             off;
    }
}
```

其中，vhost的`mix_correct`配置，能将分别单增的音频和视频流，变成混合单增的流。

在DVR中配置时间戳矫正：

```
vhost dvr.srs.com {
    # dvr RTMP stream to file,
    # start to record to file when encoder publish,
    # reap flv according by specified dvr_plan.
    # http callbacks:
    # @see http callback on_dvr_hss_reap_flv on http_hooks section.
    dvr {
        # about the stream monotonically increasing:
        #   1. video timestamp is monotonically increasing, 
        #   2. audio timestamp is monotonically increasing,
        #   3. video and audio timestamp is interleaved monotonically increasing.
        # it's specified by RTMP specification, @see 3. Byte Order, Alignment, and Time Format
        # however, some encoder cannot provides this feature, please set this to off to ignore time jitter.
        # the time jitter algorithm:
        #   1. full, to ensure stream start at zero, and ensure stream monotonically increasing.
        #   2. zero, only ensure sttream start at zero, ignore timestamp jitter.
        #   3. off, disable the time jitter algorithm, like atc.
        # default: full
        time_jitter             full;
    }
}
```

## ATC

[RTMP ATC](./rtmp-atc.md)开启时，RTMP流分发的时间戳矫正机制变为关闭，不对时间戳做任何处理。

Winlin 2015.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v4/time-jitter)


