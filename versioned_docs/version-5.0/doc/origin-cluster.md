---
title: Origin Cluster
sidebar_label: Origin Cluster
hide_title: false
hide_table_of_contents: false
---

# OriginCluster

## Design

About the design of Origin Cluster, please read the [Issue#464](https://github.com/ossrs/srs/issues/464#issuecomment-306082751).
SRS Origin Cluster is designed for large amount of streams.

![](/img/doc-advanced-guides-origin-cluster-001.png)

> Remark: Origin cluster only supports RTMP, use Edge to transmux RTMP to FLV.

## Config

The config for origin cluster:

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
        # please read: https://ossrs.io/lts/en-us/docs/v4/doc/origin-cluster
        # TODO: FIXME: Support reload.
        coworkers           127.0.0.1:9091 127.0.0.1:9092;
    }
}
```

* mode: The mode of cluster, it should be local for origin cluster.
* origin_cluster: Whether enable origin cluster.
* coworkers: The HTTP APIs of other origin servers in the cluster. 

> Remark: Say, a client, a player or edge server, starts to play a stream from a origin server. The origin server would query the coworkers and redirect client by RTMP302 when it doesn't serve the stream. If no origin is found, it responses error. The HTTP API response message includes fields for whether owns the stream, and stream information. 

> Remark: Note in particular that server response error when the requested stream hasn't been publish to origin server. For independent origin server, server responses success and waits for stream to be published. While when origin in origin cluster, as the stream might not be published to it, it should responses error and shouldn't wait for the stream.

## Usage

To use origin cluster, please read [#464](https://github.com/ossrs/srs/issues/464#issuecomment-366169487).

We also recommend to use a edge server please read [here](https://github.com/ossrs/srs/issues/464#issuecomment-366169962). The edge server can transmux RTMP to HTTP-FLV, supports fault-tolerance.

2018.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v5/origin-cluster)


