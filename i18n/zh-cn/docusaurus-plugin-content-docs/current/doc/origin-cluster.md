---
title: Origin Cluster
sidebar_label: Origin Cluster
hide_title: false
hide_table_of_contents: false
---

# OriginCluster

SRS源站集群是一组源站服务器，用于大量流的场景。

新的源站集群被设计为一组proxy server，负载均衡到后端的一组独立源站服务器，
详情请参考[Discussion #3634](https://github.com/ossrs/srs/discussions/3634)。
如果您想使用旧的源站集群，请切换到SRS 6.0之前的版本。

## Introduction

您可以部署多个SRS源服务器，以处理大量流。proxy server用作这些源服务器的负载均衡器：

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

源站集群还增强了源服务器的可扩展性。例如，使用200个后端SRS源服务器，可以支持100个WebRTC流媒体，每个流媒体有200个观众，
总共有20,000个连接。如果您在具有大量CPU核心的服务器上部署此集群，它将成为一个非常强大的媒体服务器。

> Note：您还可以部署多个proxy server，或代理到其他媒体服务器，或与边缘集群一起工作，详细信息请参见[Design](#design)。

proxy server支持几乎所有SRS协议，包括RTMP、HTTP-FLV、HLS、WebRTC和SRT。详情请参见[Protocols](#protocols)。

## Build

要构建proxy server，您需要安装Go 1.18以上版本。然后，您可以通过以下命令构建proxy server：

```bash
cd srs/proxy && make
```

> Note: 您也可以在构建之前运行 `go mod download` 来下载依赖项。

我们将在未来支持Docker镜像，或将proxy server集成到Oryx项目中。

## RTMP Origin Cluster

要使用RTMP源站集群，您需要部署proxy server和源服务器。首先，启动proxy server：

```bash
env PROXY_RTMP_SERVER=1935 PROXY_HTTP_SERVER=8080 \
    PROXY_HTTP_API=1985 PROXY_WEBRTC_SERVER=8000 PROXY_SRT_SERVER=10080 \
    PROXY_SYSTEM_API=12025 PROXY_LOAD_BALANCER_TYPE=memory ./srs-proxy
```

> Note: 这里我们使用内存负载均衡器，如果您想运行多个proxy server，可以切换到 `redis`。

然后，部署三个源服务器，通过端口 `12025` 连接到proxy server：

```bash
./objs/srs -c conf/origin1-for-proxy.conf
./objs/srs -c conf/origin2-for-proxy.conf
./objs/srs -c conf/origin3-for-proxy.conf
```

> Note: 源服务器是独立的，因此建议将它们作为部署（Deployments）在Kubernetes（K8s）中部署。

现在，您可以将RTMP流发布到proxy server：

```bash
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

并从proxy server播放RTMP流：

```bash
ffplay rtmp://localhost/live/livestream
```

或者从proxy server播放HTTP-FLV流：

```bash
ffplay http://localhost:8080/live/livestream.flv
```

或者从proxy server播放HLS流：

```bash
ffplay http://localhost:8080/live/livestream.m3u8
```

或者通过[WHEP Player](http://localhost:8080/players/whep.html)从proxy server播放WebRTC流。

您也可以使用VLC或其他播放器播放proxy server中的流。

## WebRTC Origin Cluster

要使用WebRTC源站集群，您需要部署proxy server和源服务器。首先，启动proxy server：

```bash
env PROXY_RTMP_SERVER=1935 PROXY_HTTP_SERVER=8080 \
    PROXY_HTTP_API=1985 PROXY_WEBRTC_SERVER=8000 PROXY_SRT_SERVER=10080 \
    PROXY_SYSTEM_API=12025 PROXY_LOAD_BALANCER_TYPE=memory ./srs-proxy
```

然后，部署三个源服务器，通过端口 `12025` 连接到proxy server：

```bash
./objs/srs -c conf/origin1-for-proxy.conf
./objs/srs -c conf/origin2-for-proxy.conf
./objs/srs -c conf/origin3-for-proxy.conf
```

> Note: 源服务器是独立的，因此建议将它们作为部署（Deployments）在Kubernetes（K8s）中部署。

现在，您可以通过 [WHIP Publisher](http://localhost:8080/players/whip.html) 将 WebRTC 流发布到proxy server。

并通过 [WHEP 播放器](http://localhost:8080/players/whep.html) 从proxy server播放 WebRTC 流。

或者从proxy server播放 RTMP 流：

```bash
ffplay rtmp://localhost/live/livestream
```

或者从proxy server播放 HTTP-FLV 流：

```bash
ffplay http://localhost:8080/live/livestream.flv
```

或者从proxy server播放 HLS 流：

```bash
ffplay http://localhost:8080/live/livestream.m3u8
```

您也可以使用 VLC 或其他播放器播放proxy server中的流。

## SRT Origin Cluster

要使用 SRT 源站集群，您需要部署proxy server和源服务器。首先，启动proxy server：

```bash
env PROXY_RTMP_SERVER=1935 PROXY_HTTP_SERVER=8080 \
    PROXY_HTTP_API=1985 PROXY_WEBRTC_SERVER=8000 PROXY_SRT_SERVER=10080 \
    PROXY_SYSTEM_API=12025 PROXY_LOAD_BALANCER_TYPE=memory ./srs-proxy
```

然后，部署三个源服务器，通过端口 `12025` 连接到proxy server：

```bash
./objs/srs -c conf/origin1-for-proxy.conf
./objs/srs -c conf/origin2-for-proxy.conf
./objs/srs -c conf/origin3-for-proxy.conf
```

> Note: 源服务器是独立的，因此建议将它们作为部署（Deployments）在Kubernetes（K8s）中部署。

现在，您可以将 SRT 流发布到proxy server：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

并从proxy server播放 SRT 流：

```bash
ffplay 'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request'
```

或者从proxy server播放 RTMP 流：

```bash
ffplay rtmp://localhost/live/livestream
```

或者从proxy server播放 HTTP-FLV 流：

```bash
ffplay http://localhost:8080/live/livestream.flv
```

或者从proxy server播放 HLS 流：

```bash
ffplay http://localhost:8080/live/livestream.m3u8
```

或者通过 [WHEP Player](http://localhost:8080/players/whep.html) 从proxy server播放 WebRTC 流。

您也可以使用 VLC 或其他播放器播放proxy server中的流。

## Config

proxy server通过环境变量配置。代理后端服务器支持的环境变量有：

* `PROXY_HTTP_API`: HTTP API 端口，代理到 SRS 源服务器。默认：`11985`
* `PROXY_HTTP_SERVER`: HTTP 流媒体服务器，代理到 SRS 源服务器。默认：`18080`
* `PROXY_RTMP_SERVER`: RTMP 服务器，代理到 SRS 源服务器。默认：`11935`
* `PROXY_WEBRTC_SERVER`: WebRTC 服务器，通过 UDP 协议代理到 SRS 源服务器。默认：`18000`
* `PROXY_SRT_SERVER`: SRT 服务器，代理到 SRS 源服务器。默认：`20080`

以下环境变量是关于proxy server本身的：

* `PROXY_SYSTEM_API`: 系统 API 端口，允许源服务器向proxy server注册服务。默认：`12025`
* `PROXY_STATIC_FILES`: 静态网页服务器的文件目录，如播放器。默认：`../trunk/research`
* `PROXY_LOAD_BALANCER_TYPE`: 负载均衡类型，`memory` 或 `redis`。默认：`redis`

对于 Redis 负载均衡器，您需要设置以下环境变量：

* `PROXY_REDIS_HOST`: Redis 主机。默认：`127.0.0.1`
* `PROXY_REDIS_PORT`: Redis 端口。默认：`6379`
* `PROXY_REDIS_PASSWORD`: Redis 密码。默认为空，无密码。
* `PROXY_REDIS_DB`: Redis 数据库。默认：`0`

为了调试，proxy server将代理到默认的源服务器，您可以设置以下环境变量：

* `PROXY_DEFAULT_BACKEND_ENABLED`: 是否启用默认后端源服务器。默认：`off`
* `PROXY_DEFAULT_BACKEND_IP`: 默认后端 IP。默认：`127.0.0.1`
* `PROXY_DEFAULT_BACKEND_RTMP`: 默认后端 RTMP 端口。默认：`1935`
* `PROXY_DEFAULT_BACKEND_HTTP`: 默认后端 HTTP 端口。默认：`8080`
* `PROXY_DEFAULT_BACKEND_RTC`: 默认后端 WebRTC 端口，通过 UDP。默认：`8000`
* `PROXY_DEFAULT_BACKEND_SRT`: 默认后端 SRT 端口。默认：`10080`
* `PROXY_DEFAULT_BACKEND_API`: 默认后端 API 端口。默认：`1985`

> 注意：默认后端源服务器是为任何 RTMP 服务器（如 nginx-rtmp）设计的，它不需要源服务器向proxy server注册。

## Design

proxy server与 SRS 源服务器一起工作，流媒体流程如下：

```text
Client ----> Proxy Server ---> Origin Servers
Client ---> LB --> Proxy Servers --> Origin Servers

OBS/FFmpeg --RTMP--> K8s(Service) --Proxy--> SRS(pod A)

Browsers --FLV/HLS/SRT--> K8s(Service) --Proxy--> SRS(pod A)

Browsers --+---HTTP-API--> K8s(Service) --Proxy--> SRS(pod A)
           +---WebRTC----> K8s(Service) --Proxy--> SRS(pod A)
```

> Note: 此proxy server可以部署在 Kubernetes (K8s) 中，并可以将流量路由到 SRS 源服务器。proxy server充当负载均衡器，
> 将负载分配到源服务器。您也可以在没有 Kubernetes 的情况下使用proxy server。

这是与 Kubernetes (K8s) 系统一起工作的详细部署过程：

```text
                         +-----------------------+
                     +---+ SRS Proxy(Deployment) +------+---------------------+
+-----------------+  |   +-----------+-----------+      +                     +
| LB(K8s Service) +--+               +(Redis/MESH)      + SRS Origin Servers  +
+-----------------+  |   +-----------+-----------+      +    (Deployment)     +
                     +---+ SRS Proxy(Deployment) +------+---------------------+
                         +-----------------------+
```

> Note: 有多个proxy server，因此它们需要 Redis 或 MESH 来同步其状态。MESH 意味着proxy server相互连接以同步状态，并应作为 
> StatefulSet 在 Kubernetes (K8s) 中部署。推荐使用 Redis 解决方案，因为proxy server可以作为 Deployment 在 K8s 中部署，
> 并且您还可以使用 Redis 集群以实现高可用性。

> Note: 有多个源服务器，它们作为 Deployment 在 Kubernetes (K8s) 中部署，因为源服务器之间无需同步状态。这些源服务器是完全独立的，
> 使系统非常健壮。请注意，这与 SRS 6.0 之前的源站集群不同，之前使用 MESH 互相连接，这不是一个好的架构。

如果您想构建一个具有单个proxy server和多个源服务器的源站集群：

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

> Note: 如果您仅希望支持许多流并且观众数量较少，单个proxy server架构也很有用。proxy server性能非常高，支持多个进程。

> Note: 如果您想使用多个proxy server，您可以简单地部署更多并将它们连接到同一个 Redis 服务器。这些proxy server将协同工作以支持大量流。
> 这种架构是可扩展的。

使用此架构，您可以支持大量流，然后使用边缘服务器来支持多个观众。

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

> Note: 使用此架构，您可以构建一个非常大的媒体系统，支持大量流和观众。维护这个系统非常复杂，所以只有在必要时才使用它。

实际上，proxy server也可以与 SRS 边缘服务器一起工作，但这不是典型的架构。

## Protocols

由于proxy server是一个新服务器，并非所有协议都已支持。目前支持的协议有：

- [x] RTMP：代理 RTMP 协议到 SRS 源服务器。
- [x] HTTP-FLV：代理 HTTP-FLV 协议到 SRS 源服务器。
- [x] HTTP-TS：代理 HTTP-TS 协议到 SRS 源服务器。
- [x] HLS：代理 HLS 协议到 SRS 源服务器。
- [x] WebRTC：代理 WebRTC(WHIP/WHEP) 协议到 SRS 源服务器。
- [x] SRT：代理 SRT 协议到 SRS 源服务器。
- [ ] MPEG-DASH：代理 MPEG-DASH 协议到 SRS 源服务器。
- [ ] RTSP：代理 RTSP 协议到 SRS 源服务器。

还有一些关键功能尚未支持：

- [x] 单节点proxy server，使用内存存储状态。
- [x] Redis：连接到 Redis 服务器以同步状态。
- [ ] MESH：连接到其他proxy server以同步状态。
- [ ] HTTP-API：提供一个 HTTP API，收集所有源服务器的指标。
- [ ] Exporter：提供一个 Prometheus exporter，导出proxy server的指标。

对于一个媒体集群，媒体服务器只是整个系统的一部分。控制和管理面板对于维护这个复杂的系统也非常重要。

## Register

源服务器可以注册到proxy server，以便proxy server能够对后端服务器进行负载均衡。注册 API 是一个简单的 HTTP API：

```bash
curl -X POST http://127.0.0.1:12025/api/v1/srs/register \
     -H "Connection: Close" \
     -H "Content-Type: application/json" \
     -H "User-Agent: curl" \
     -d '{
          "device_id": "origin2",
          "ip": "10.78.122.184",
          "server": "vid-46p14mm",
          "service": "z2s3w865",
          "pid": "42583",
          "rtmp": ["19352"],
          "http": ["8082"],
          "api": ["19853"],
          "srt": ["10082"],
          "rtc": ["udp://0.0.0.0:8001"]
        }'
#{"code":0,"pid":"53783"}
```

* `ip`: 必填，后端服务器的 IP。确保proxy server可以通过此 IP 访问后端服务器。
* `server`: 必填，后端服务器的服务器 ID。对于 SRS，它存储在文件中，可能不会改变。
* `service`: 必填，后端服务器的服务 ID。对于 SRS，每次重启都会改变。
* `pid`: 必填，后端服务器的进程 ID。用于识别进程是否重启。
* `rtmp`: 必填，后端服务器的 RTMP 监听端点。proxy server将通过此端口连接后端服务器以使用 RTMP 协议。
* `http`: 可选，后端服务器的 HTTP 监听端点。proxy server将通过此端口连接后端服务器以使用 HTTP-FLV 或 HTTP-TS 协议。
* `api`: 可选，后端服务器的 HTTP API 监听端点。proxy server将通过此端口连接后端服务器以使用 HTTP-API，例如 WHIP 和 WHEP。
* `srt`: 可选，后端服务器的 SRT 监听端点。proxy server将通过此端口连接后端服务器以使用 SRT 协议。
* `rtc`: 可选，后端服务器的 WebRTC 监听端点。proxy server将通过此端口连接后端服务器以使用 WebRTC 协议。
* `device_id`: 可选，后端服务器的设备 ID。用作后端服务器的标签。

监听端点的格式可以是 `port`，或者 `protocol://ip:port`，或者 `protocol://:port`，例如：

* `1935`: 监听 TCP 协议的 1935 端口，适用于任何 IP。
* `tcp://:1935`: 监听 TCP 协议的 1935 端口，适用于任何 IP。
* `tcp://0.0.0.0:1935`: 监听 TCP 协议的 1935 端口，适用于任何 IP。
* `tcp://192.168.3.10:1935`: 监听 TCP 协议的 1935 端口，适用于指定的 IP。

您还可以使用 SRS 5.0+ 作为后端服务器，它支持 `heartbeat` 功能，可以自动注册到proxy server。

此外，您可以编写一个 curl 脚本来注册后端服务器，或者使用一个专门的后端服务器管理服务。例如，如果您不想修改 nginx-rtmp 代码，
可以使用一个独立的程序将 nginx-rtmp 注册到proxy server。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/origin-cluster)


