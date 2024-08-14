---
title: RTMP ATC
sidebar_label: RTMP ATC
hide_title: false
hide_table_of_contents: false
---

# ATC支持HLS/HDS热备

RTMP的热备怎么做？当边缘回源时，上层出现故障，可以切换到另外一个上层，所以RTMP热备只需要指定多个上层/源站就可以。边缘在故障切换时，会重新连接新服务器，客户端连接还没有断开，所以看起来就像是编码器重新推流了，画面最多抖动一下或者卡一下。

HLS热备怎么做？边缘从某个源站拿不到ts切片时，会去另外一个服务器拿。所以就要求两个上层的ts切片一样，当然如果上层服务器都从一个源站取片，是没有问题的。

如果HLS的源站需要做热备，怎么办？参考：[Adobe: HDS/HLS热备](http://www.adobe.com/cn/devnet/adobe-media-server/articles/varnish-sample-for-failover.html)，如下图所示：

```bash
                        +----------+        +----------+
               +--ATC->-+  server  +--ATC->-+ packager +-+   +---------+
+----------+   | RTMP   +----------+ RTMP   +----------+ |   | Reverse |    +-------+
| encoder  +->-+                                         +->-+  Proxy  +-->-+  CDN  +
+----------+   |        +----------+        +----------+ |   | (nginx) |    +-------+
               +--ATC->-+  server  +--ATC->-+ packager +-+   +---------+
                 RTMP   +----------+ RTMP   +----------+
```

实际上，adobe文中所说的是encoder输出的是ATC RTMP流，也没有packager直接server就打包了。如果你需要自己做打包，譬如基于ffmpeg写个工具，自定义HLS流的打包，编码器可以将ATC RTMP流推送到SRS，SRS会以ATC RTMP形式不修改时间戳分发给你的工具。

所以ATC RTMP说白了就是绝对时间，server需要能接入绝对时间，若切片在server上则根据绝对时间切片，若server和ReverseProxy之间还有切片工具，那server应该给切片工具绝对时间。

## SRS配置ATC

SRS默认ATC是关闭，即给客户端的RTMP流永远从0开始。若工具需要SRS不修改时间戳（只将sequence header和metadata调整为第一个音视频包的时间戳），可以打开ATC配置：

```bash
vhost __defaultVhost__ {
    # for play client, both RTMP and other stream clients,
    # for instance, the HTTP FLV stream clients.
    play {
        # vhost for atc for hls/hds/rtmp backup.
        # generally, atc default to off, server delivery rtmp stream to client(flash) timestamp from 0.
        # when atc is on, server delivery rtmp stream by absolute time.
        # atc is used, for instance, encoder will copy stream to master and slave server,
        # server use atc to delivery stream to edge/client, where stream time from master/slave server
        # is always the same, client/tools can slice RTMP stream to HLS according to the same time,
        # if the time not the same, the HLS stream cannot slice to support system backup.
        # 
        # @see http://www.adobe.com/cn/devnet/adobe-media-server/articles/varnish-sample-for-failover.html
        # @see http://www.baidu.com/#wd=hds%20hls%20atc
        #
        # default: off
        atc             off;
    }
}
```

## ATC和flash的兼容性

开启ATC之后，flash客户端播放SRS流时，流的起始时间不是0而是ATC时间。需要调整时间的包：
* sequence header: 调整为第一个音视频包的时间。若有gop cache，则调整为gop cache中的第一个音视频包的时间。
* metadata: 调整为第一个音视频包的时间。nginx-rtmp没有调整metadata包的时间（为0），所以平均每20次就有一次卡死。

经过测试，SRS打开和关闭ATC，flash播放器都能播放SRS的RTMP流。

## ATC和编码器

编码器开启atc之后，若在metadata中自动写入"bravo_atc"="true"，srs会自动的开启atc。

可以禁用这个功能：

```bash
vhost atc.srs.com {
    # for play client, both RTMP and other stream clients,
    # for instance, the HTTP FLV stream clients.
    play {
        # whether enable the auto atc,
        # if enabled, detect the bravo_atc="true" in onMetaData packet,
        # set atc to on if matched.
        # always ignore the onMetaData if atc_auto is off.
        # default: off
        atc_auto        off;
    }
}
```

将自动atc关闭即可。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/rtmp-atc)


