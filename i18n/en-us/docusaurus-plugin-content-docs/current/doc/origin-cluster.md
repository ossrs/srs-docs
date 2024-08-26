---
title: Origin Cluster
sidebar_label: Origin Cluster
hide_title: false
hide_table_of_contents: false
---

# OriginCluster
The SRS origin cluster is a group of origin servers intended for handling a large number of streams.

The new origin cluster is designed as a collection of proxy servers. For more information, see 
[Discussion #3634](https://github.com/ossrs/srs/discussions/3634). If you prefer to use the old 
origin cluster, please switch to a version before SRS 6.0.

## Design

The proxy works with SRS origin servers, and the stream flow operates as follows:

```text
Client ----> Proxy Server ---> Origin Servers
Client ---> LB --> Proxy Servers --> Origin Servers

OBS/FFmpeg --RTMP--> K8s(Service) --Proxy--> SRS(pod A)

Browsers --FLV/HLS/SRT--> K8s(Service) --Proxy--> SRS(pod A)

Browsers --+---HTTP-API--> K8s(Service) --Proxy--> SRS(pod A)
           +---WebRTC----> K8s(Service) --Proxy--> SRS(pod A)
```

> Note: This proxy server can be deployed in Kubernetes (K8s) and can route traffic to the SRS origin 
> servers. The proxy server functions as a load balancer to distribute the load among the origin servers. 
> You can also use the proxy server without Kubernetes.

This is the detailed deployment process that works with the Kubernetes (K8s) system:

```text
                         +-----------------------+
                     +---+ SRS Proxy(Deployment) +------+---------------------+
+-----------------+  |   +-----------+-----------+      +                     +
| LB(K8s Service) +--+               +(Redis/MESH)      + SRS Origin Servers  +
+-----------------+  |   +-----------+-----------+      +    (Deployment)     +
                     +---+ SRS Proxy(Deployment) +------+---------------------+
                         +-----------------------+
```

> Note: There are multiple proxy servers, so they need Redis or MESH to synchronize their state. MESH means 
> the proxy servers connect to each other to sync the state and should be deployed as a StatefulSet in 
> Kubernetes (K8s). The Redis solution is preferable because the proxy server can be deployed as a Deployment 
> in K8s, and you can also use a Redis cluster for high availability.

> Note: There are multiple origin servers, which are deployed as Deployments in Kubernetes (K8s), as there is 
> no need to sync the state between origin servers. These origin servers are completely independent, making 
> the system very robust. Please note that this is different from the previous origin cluster before SRS 6.0,
> which used MESH to connect to each other, and it was not a good architecture.

If you want to build an origin cluster with a single proxy server and multiple origin servers:

```text
                                       +--------------------+
                               +-------+ SRS Origin Server  +
                               +       +--------------------+
                               +
+-----------------------+      +       +--------------------+
+ SRS Proxy(Deployment) +------+-------+ SRS Origin Server  +
+-----------------------+      +       +--------------------+
                               +
                               +       +--------------------+
                               +-------+ SRS Origin Server  +
                                       +--------------------+
```

> Note: A single proxy server architecture is also useful if you only want to support many streams with a 
> small number of viewers. The proxy server is very high performance and supports multiple processes.

> Note: If you want to use multiple proxy servers, you can simply deploy more and connect them to the same 
> Redis server. These proxy servers will work together to support a large number of streams. This architecture 
> is scalable.

With this architecture, you can support a large number of streams and then use edge servers to support
multiple viewers.

```text
+------------------+                                               +--------------------+
+ SRS Edge Server  +--+                                    +-------+ SRS Origin Server  +
+------------------+  +                                    +       +--------------------+
                      +                                    +
+------------------+  +     +-----------------------+      +       +--------------------+
+ SRS Edge Server  +--+-----+ SRS Proxy(Deployment) +------+-------+ SRS Origin Server  +
+------------------+  +     +-----------------------+      +       +--------------------+
                      +                                    +
+------------------+  +                                    +       +--------------------+
+ SRS Edge Server  +--+                                    +-------+ SRS Origin Server  +
+------------------+                                               +--------------------+
```

> Note: With this architecture, you can build a very large media system that supports a large number of 
> streams and viewers. It is a complex system to maintain, so only use it if necessary.

In fact, a proxy server also works with SRS edge servers, but it is not a typical architecture.

## Protocols

Because the proxy server is a new server, not all protocols are supported yet. The supported protocols are:

- [ ] RTMP: Proxy RTMP protocol to the SRS origin server.
- [ ] HTTP-FLV: Proxy HTTP-FLV protocol to the SRS origin server.
- [ ] HLS: Proxy HLS protocol to the SRS origin server.
- [ ] SRT: Proxy SRT protocol to the SRS origin server.
- [ ] WebRTC: Proxy WebRTC protocol to the SRS origin server.
- [ ] MPEG-DASH: Proxy MPEG-DASH protocol to the SRS origin server.

There are also some key features not supported yet:

- [ ] Redis: Connect to the Redis server to sync the state.
- [ ] MESH: Connect to other proxy servers to sync the state.
- [ ] HTTP-API: Provide an HTTP API that collects all the metrics of the origin servers.
- [ ] Exporter: Provide a Prometheus exporter that exports the metrics of the proxy server.

For a media cluster, the media server is only one part of the whole system. The control and management panel 
are also very important to maintain this complex system.

![](https://ossrs.io/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v7/origin-cluster)

