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

Because the proxy server is a new server, not all protocols are supported yet. The supported 
protocols are:

- [x] RTMP: Proxy RTMP protocol to the SRS origin server.
- [x] HTTP-FLV: Proxy HTTP-FLV or HTTP-TS protocol to the SRS origin server.
- [x] HLS: Proxy HLS protocol to the SRS origin server.
- [X] WebRTC: Proxy WebRTC(WHIP/WHEP) protocol to the SRS origin server.
- [ ] SRT: Proxy SRT protocol to the SRS origin server.
- [ ] MPEG-DASH: Proxy MPEG-DASH protocol to the SRS origin server.

There are also some key features not supported yet:

- [x] Single node proxy server, use memory to store state.
- [x] Redis: Connect to the Redis server to sync the state.
- [ ] MESH: Connect to other proxy servers to sync the state.
- [ ] HTTP-API: Provide an HTTP API that collects all the metrics of the origin servers.
- [ ] Exporter: Provide a Prometheus exporter that exports the metrics of the proxy server.

For a media cluster, the media server is only one part of the whole system. The control and management panel 
are also very important to maintain this complex system.

## Config

The proxy server is configured by environment variables. The supported environment variables for proxy 
backend server are:

* `PROXY_HTTP_API`: The HTTP API port, proxy to SRS origin server. Default: `11985`
* `PROXY_HTTP_SERVER`: The HTTP streaming server, proxy to SRS origin server. Default: `18080`
* `PROXY_RTMP_SERVER`: The RTMP server, proxy to SRS origin server. Default: `11935`
* `PROXY_WEBRTC_SERVER`: The WebRTC server, proxy to SRS origin server, via UDP protocol. Default: `18000`

The following environment variables are about the proxy server itself:

* `PROXY_SYSTEM_API`: The system API port, allow origin server register services to proxy servers. Default: `12025`
* `PROXY_LOAD_BALANCER_TYPE`: The load balancer type, `memory` or `redis`. Default: `redis`

For the Redis load balancer, you need to set the following environment variables:

* `PROXY_REDIS_HOST`: The Redis host. Default: `127.0.0.1`
* `PROXY_REDIS_PORT`: The Redis port. Default: `6379`
* `PROXY_REDIS_PASSWORD`: The Redis password. Default to empty, no password.
* `PROXY_REDIS_DB`: The Redis DB. Default: `0`

For debugging, the proxy server will proxy to a default origin server, you can set the following 
environment variables:

* `PROXY_DEFAULT_BACKEND_ENABLED`: Whether to enable the default backend origin server. Default: `off`
* `PROXY_DEFAULT_BACKEND_IP`: The default backend IP. Default: `127.0.0.1`
* `PROXY_DEFAULT_BACKEND_RTMP`: The default backend RTMP port. Default: `1935`
* `PROXY_DEFAULT_BACKEND_HTTP`: The default backend HTTP port. Default: `8080`
* `PROXY_DEFAULT_BACKEND_RTC`: The default backend WebRTC port via UDP. Default: `8000
* `PROXY_DEFAULT_BACKEND_API`: The default backend API port. Default: `1985`

> Note: The default backend origin server, is designed for any RTMP server like nginx-rtmp, it does not 
> require the origin server to register to the proxy server.

## Usage: RTMP Origin Cluster

To use the RTMP origin cluster, you need to deploy the proxy server and the origin server. 
First, start the proxy server:

```bash
env PROXY_RTMP_SERVER=1935 PROXY_HTTP_SERVER=8080 PROXY_HTTP_API=1985 \
    PROXY_SYSTEM_API=12025 PROXY_LOAD_BALANCER_TYPE=memory ./srs-proxy
```

> Note: Here we use the memory load balancer, you can switch to `redis` if you want to run more
> than one proxy server.

Then, deploy three origin servers, which connects to the proxy server via port `12025`:

```bash
./objs/srs -c conf/origin1-for-proxy.conf
./objs/srs -c conf/origin2-for-proxy.conf
./objs/srs -c conf/origin3-for-proxy.conf
```

> Note: The origin servers are independent, so it's recommended to deploy them as Deployments 
> in Kubernetes (K8s).

Now, you're able to publish RTMP stream to the proxy server:

```bash
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

And play the RTMP stream from the proxy server:

```bash
ffplay rtmp://localhost/live/livestream
```

Or play HTTP-FLV stream from the proxy server:

```bash
ffplay http://localhost:8080/live/livestream.flv
```

You can also use VLC or other players to play the stream in proxy server.

![](https://ossrs.io/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v7/origin-cluster)

