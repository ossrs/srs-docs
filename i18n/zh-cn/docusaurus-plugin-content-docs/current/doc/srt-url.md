---
title: SRT URL
sidebar_label: SRT URL
hide_title: false
hide_table_of_contents: false
---

# SRT Live url introduce

介绍srt在live模式下如何构造推/拉流地址。

## rtmp url

rtmp地址格式简介
* 常规rtmp格式(无vhost) 
    - rtmp://hostip:port/appname/streamname 
    - 例子: rtmp://10.111.1.100:1935/live/livestream 
    - 上面例子中appname="live", streamname="livestream" 
* 复杂rtmp格式(有vhost) 
    - rtmp://hostip:port/vhost/appname/streamname 
    - 例子: rtmp://10.111.1.100:1935/srs.com.cn/live/livestream 
    - 上面例子中vhost="srs.com.cn", appname="live", streamname="livestream" 

rtmp如何确认对rtmp url是推流还是拉流：

* publish 
    - rtmp协议中 `publish消息` 表示是对该url进行推流 
* play 
    - rtmp协议中 `play消息` 表示是对该url进行拉流

## srt url format

因为srt是四层传输协议，所以无法确定对某个srt url操作是推流还是拉流。

在srt官网中有对推/拉流的推荐：[AccessControl.md](https://github.com/Haivision/srt/blob/master/docs/features/access-control.md) 
关键方法是通过streamid参数来明确url的作用，strreamid的格式符合YAML格式。

### common srt url format(without vhost)

srt url举例：
* 推流地址: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish` 
* 拉流地址: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request` 

其中：
* #!:: 
    - #!::为开始，符合yaml格式标准 
* r 
    - 映射到rtmp地址中的appname/streamname；
* m 
    - publish表示推流。
    - request表示拉流。

上面srt对应的rtmp拉流地址为：rtmp://127.0.0.1/live/livestream

### complex srt url(with vhost)

srt url举例：
* 推流地址: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=publish` 
* 拉流地址: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=request` 

其中：
* #!:: 
    - #!::为开始，符合yaml格式标准 
* h 
    - 映射到rtmp地址中的vhost；
* r 
    - 映射到rtmp地址中的appname/streamname；
* m 
    - publish表示推流。
    - request表示拉流。

上面srt对应的rtmp拉流地址为：rtmp://127.0.0.1/srs.srt.com.cn/live/livestream 
或rtmp://127.0.0.1/live/livestream?vhost=srs.srt.com.cn。

Runner365 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/srt-url)


