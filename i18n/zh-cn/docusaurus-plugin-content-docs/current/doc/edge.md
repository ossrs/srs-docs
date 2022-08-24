---
title: Edge Cluster
sidebar_label: Edge Cluster
hide_title: false
hide_table_of_contents: false
---

# Edge Server

SRS的Edge主要解决几条流有大量播放请求的场景，比如一个流有上万人观看。SRS的Edge能对接所有的标准RTMP源站服务器。

![](/img/doc-main-concepts-edge-001.png)

> 备注：Edge一般负载高，SRS支持的并发足够跑满千兆网带宽了。

> Remark: SRS Edge does not support Transcoding, DVR and HLS, which is supported by SRS Origin Server.

Edge的主要应用场景：
* CDN/VDN大规模集群，客户众多流众多需要按需回源。
* 小规模集群，但是流比较多，需要按需回源。
* 骨干带宽低，边缘服务器强悍，可以使用多层edge，降低上层BGP带宽。

注意：edge可以从源站拉流，也可以将流转发给源站。也就是说，播放edge上的流时，edge会
回源拉流；推流到edge上时，edge会直接将流转发给源站。

注意：若只需要中转流给源站，不必用forward，直接使用edge模式即可。可以直接支持推流
和拉流的中转，简单快捷。Forward应用于目标服务器是多个，譬如将一路流主动送给多路服务
器；edge虽然配置了多台服务器，但是只用了一台，有故障时才切换。

注意：优先使用edge，除非知道必须用forward，才使用forward。

## 概念

所谓边缘edge服务器，就是边缘直播缓存服务器，配置时指定为remote模式和origin（指定一
个或多个源站IP），这个边缘edge服务器就是源站的缓存了。

当用户推流到边缘服务器时，边缘直接将流转发给源站。譬如源站在北京BGP机房，湖南有个
电信ADSL用户要推流发布自己的直播流，要是直接推流到北京BGP可能效果不是很好，可以在
湖南电信机房部署一个边缘，用户推流到湖南边缘，边缘转发给北京源站BGP。

当用户播放边缘服务器的流时，边缘服务器看有没有缓存，若缓存了就直接将流发给客户端。
若没有缓存，则发起一路回源链接，从源站取数据源源不断放到自己的缓存队列。也就是说，
多个客户端连接到边缘时，只有一路回源。这种结构在CDN是最典型的部署结构。譬如北京源站，
在全国32个省每个省都部署了10台服务器，一共就有320台边缘，假设每个省1台边缘服务器都有
2000用户观看，那么就有64万用户，每秒钟集群发送640Gbps数据；而回源链接只有320个，
实现了大规模分发。

边缘edge服务器，实际上是解决大并发问题产生的分布式集群结构。SRS的边缘可以指定多个源站，
在源站出现故障时会自动切换到下一个源站，不影响用户观看，具有最佳的容错性，用户完全不会觉察。

## Config

edge属于vhost的配置，将某个vhost配置为edge后，该vhost会回源取流（播放时）或者将流转发
给源站（发布时）。

```bash
vhost __defaultVhost__ {
    # The config for cluster.
    cluster {
        # The cluster mode, local or remote.
        #       local: It's an origin server, serve streams itself.
        #       remote: It's an edge server, fetch or push stream to origin server.
        # default: local
        mode            remote;

        # For edge(mode remote), user must specifies the origin server
        # format as: <server_name|ip>[:port]
        # @remark user can specifies multiple origin for error backup, by space,
        # for example, 192.168.1.100:1935 192.168.1.101:1935 192.168.1.102:1935
        origin          127.0.0.1:1935 localhost:1935;

        # For edge(mode remote), whether open the token traverse mode,
        # if token traverse on, all connections of edge will forward to origin to check(auth),
        # it's very important for the edge to do the token auth.
        # the better way is use http callback to do the token auth by the edge,
        # but if user prefer origin check(auth), the token_traverse if better solution.
        # default: off
        token_traverse  off;

        # For edge(mode remote), the vhost to transform for edge,
        # to fetch from the specified vhost at origin,
        # if not specified, use the current vhost of edge in origin, the variable [vhost].
        # default: [vhost]
        vhost           same.edge.srs.com;

        # For edge(mode remote), when upnode(forward to, edge push to, edge pull from) is srs,
        # it's strongly recommend to open the debug_srs_upnode,
        # when connect to upnode, it will take the debug info,
        # for example, the id, source id, pid.
        # please see https://ossrs.net/lts/zh-cn/docs/v4/doc/log
        # default: on
        debug_srs_upnode    on;
    }
}
```

可配置`多个`源站，在故障时会切换到下一个源站。

## 集群配置

下面举例说明如何配置一个源站和集群。

源站配置，参考`origin.conf`：

```bash
listen              19350;
pid                 objs/origin.pid;
srs_log_file        ./objs/origin.log;
vhost __defaultVhost__ {
}
```

边缘配置，参考`edge.conf`：

```bash
listen              1935;
pid                 objs/edge.pid;
srs_log_file        ./objs/edge.log;
vhost __defaultVhost__ {
    cluster {
        mode            remote;
        origin          127.0.0.1:19350;
    }
}
```

## HLS边缘

Edge指的是RTMP边缘，也就是说，配置为Edge后，流推送到源站（Origin）时，Edge不会切片生成HLS。

HLS切片配置在源站，只有源站会在推流上来就产生HLS切片。边缘只有在访问时才会回源（这个时候
也会生成HLS，但单独访问边缘的HLS是不行的）。

也就是说，HLS的边缘需要使用WEB服务器缓存，譬如nginx反向代理，squid，或者traffic server等。

## 下行边缘结构设计

下行边缘指的是下行加速边缘，即客户端播放边缘服务器的流，边缘服务器从上层或源站取流。

SRS下行边缘是非常重要的功能，需要考虑以下因素：
* 以后支持多进程时结构变动最小。
* 和目前所有功能的对接良好。
* 支持平滑切换，源站和边缘两种角色。

权衡后，SRS下行边缘的结构设计如下：
* 客户端连接到SRS
* 开始播放SRS的流
* 若流存在则直接播放。
* 若流不存在，则从源站开始取流。
* 其他其他流的功能，譬如转码/转发/采集等等。

核心原则是：
* 边缘服务器在没有流时，向源站拉取流。
* 当流建立起来后，边缘完全变成源站服务器，对流的处理逻辑保持一致。
* 支持回多个源站，错误时切换。这样可以支持上层服务器热备。

备注：RTMP多进程（计划中）的核心原则是用多进程作为完全镜像代理，连接到本地的服务器
（源站或边缘），完全不考虑其他业务因素，透明代理。这样可以简单，而且利用多CPU能力。
HTTP多进程是不考虑支持的，用NGINX是最好选择，SRS的HTTP服务器只是用在嵌入式设备中，
没有性能要求的场合。

## 上行边缘结构设计

上行边缘指的是上行推流加速，客户端推流到边缘服务器，边缘将流转发给源站服务器。

考虑到下行和上行可能同时发生在一台边缘服务器，所以上行边缘只能用最简单的代理方式，
完全将流代理到上层或源站服务器。也就是说，只有在下行边缘时，边缘服务器才会启用其他
的功能，譬如HLS转发等等。

上行边缘主要流程是：
* 客户端连接到SRS
* 开始推流到SRS。
* 开始转发到源站服务器。

## EdgeState

边缘的状态图分析如下：

![RTMP-HLS-latency](/img/doc-main-concepts-edge-002.jpg)

注意：这种细节的文档很难保持不变，以代码为准。

## 边缘的难点

RTMP边缘对于SRS来讲问题不大，主要是混合了reload和HLS功能的边缘服务器，会是一个难点。

譬如，用户在访问边缘上的HLS流时，是使用nginx反向代理回源，还是使用RTMP回源后在边缘切片？
对于前者，需要部署srs作为RTMP边缘，nginx作为HLS边缘，管理两个服务器自然是比一个要费劲。
若使用后者，即RTMP回源后边缘切片，能节省骨干带宽，只有一路回源，难点在于访问HLS时要发起
RTMP回源连接。

正因为业务逻辑会是边缘服务器的难点，所以SRS对于上行边缘，采取直接代理方式，并没有采取
边缘缓存方式。所谓边缘缓存方式，即推流到边缘时边缘也会当作源站直接缓存（作为源站），
然后转发给源站。边缘缓存方式看起来先进，这个边缘节点不必回源，实际上加大了集群的逻辑难度，
不如直接作为代理方式简单。

## Transform Vhost

一般CDN都支持上行和下行边缘加速，上行和下行的域名是分开的，譬如上行使用`up.srs.com`，下行使用`down.srs.com`，这样可以使用不同的设备组，避免下行影响下行之类。

用户在推流到`up.srs.com`时，边缘使用edge模式，回源时也是用的`up.srs.com`，到源站还是`up.srs.com`，所以播放`down.srs.com`这个vhost的流时就播放不了用户推的那个流。因此需要edge在回源时transform vhost，也就是转换vhost。

解决方案：在最上层edge，可以配置回源的vhost，默认使用当前的vhost。譬如上行`up.srs.com`，可以指定回源`down.srs.com`;配置时指定`vhost down.srs.com;`就可以了。

具体配置参考上面的Config。

Winlin 2015.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/edge)


