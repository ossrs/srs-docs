---
title: Origin Cluster
sidebar_label: Origin Cluster
hide_title: false
hide_table_of_contents: false
---

# OriginCluster

## Design

关于源站集群的设计参考[Issue#464](https://github.com/ossrs/srs/issues/464#issuecomment-306082751)。
源站集群主要解决大量推流的情况，比如需要推1万路流。

![](/img/doc-advanced-guides-origin-cluster-001.png)

> Remark: 源站集群只支持RTMP协议，如果需要HTTP-FLV，可以加一个Edge将RTMP转成HTTP-FLV。

## Config

源站集群的配置如下：

```
vhost __defaultVhost__ {
    # The config for cluster.
    cluster {
        # The cluster mode, local or remote.
        #       local: It's an origin server, serve streams itself.
        #       remote: It's an edge server, fetch or push stream to origin server.
        # default: local
        mode            local;

        # For origin(mode local) cluster, turn on the cluster.
        # @remark Origin cluster only supports RTMP, use Edge to transmux RTMP to FLV.
        # default: off
        # TODO: FIXME: Support reload.
        origin_cluster      on;

        # For origin (mode local) cluster, the co-worker's HTTP APIs.
        # This origin will connect to co-workers and communicate with them.
        # please read: https://ossrs.net/lts/zh-cn/docs/v4/doc/origin-cluster
        # TODO: FIXME: Support reload.
        coworkers           127.0.0.1:9091 127.0.0.1:9092;
    }
}
```

其中：

* mode: 集群的模式，对于源站集群，值应该是local。
* origin_cluster: 是否开启源站集群。
* coworkers: 源站集群中的其他源站的HTTP API地址。

> Remark: 如果流不在本源站，会通过HTTP API查询其他源站是否有流。如果流其他源站，则返回RTMP302重定向请求到该源站。如果所有源站都没有流则返回错误。

> Remark: 特别注意的是，如果流还没有开始推，那么服务器会返回失败，这点和源站没有在源站集群的行为不同。当源站独立工作时，会等待流推上来；当源站在源站集群中时，因为流可能不会推到本源站，所以等待流推上来没有意义。

## Usage

源站集群的用法参考[#464](https://github.com/ossrs/srs/issues/464#issuecomment-366169487)。

推荐在源站集群前面挂一系列的Edge服务器，参考[这里](https://github.com/ossrs/srs/issues/464#issuecomment-366169962)，Edge服务器可以转换协议，支持RTMP和HTTP-FLV，同时支持源站故障时自动切换，不中断客户端。

2018.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-5/doc/origin-cluster)


