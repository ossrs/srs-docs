---
title: HEVC
sidebar_label: HEVC
hide_title: false
hide_table_of_contents: false
---

# HEVC

HEVC，也就是H.265，是H.264的下一代编码，和AV1属于统一代的编解码器，H.265大概比H.264能节约一半的带宽，或者同等带宽下能提升
一倍的清晰度和画质。

当然，H.265的问题在于支持的客户端还不够广泛，几乎所有的设备都支持H.264，包括很差性能的手机或者盒子，对于H.264的支持都是有专门
的芯片，然而H.265虽然经过了差不多十年的发展，支持的设备还不够多。 在特定场景下，比如设备端明确支持H.265时，可以选择H.265，
否则还是选择H.264。

此外，传输协议对于H.265的支持也在逐步完善，但是还并非所有的协议都支持。MEPG-TS是最早支持H.265的，当然SRT和HLS是基于TS的协议，
所以也支持了；RTMP和HTTP-FLV，直到2023.03，终于[Enhanced RTMP](https://github.com/veovera/enhanced-rtmp)项目建立，
开始支持了HEVC和AV1；而WebRTC目前只有Safari支持了，据说Chrome还在开发中。

随着H.265越来越完善，SRS最初是有一个分支支持的H.265参考[feature/h265](https://github.com/ossrs/srs-gb28181/tree/feature/h265)，
所以在SRS 5.0中并不支持H.265，若需要使用H.265功能，请切换到SRS 6.0版本。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/hevc)


