---
title: Prometheus Exporter
sidebar_label: Exporter
hide_title: false
hide_table_of_contents: false
---

# Prometheus Exporter

SRS的可观测性是支撑业务的运营的能力，主要指监控(Prometheus Exporter)、分布式链路追踪(APM)、上下文日志(Cloud Logging)三个核心能力，以及基于这些能力的运营大盘、监控系统、问题排查、日志收集和分析等功能。

## Introduction

可观测性，在云原生中有详细的定义，参考[OpenTelemetry.io](https://opentelemetry.io)，从可观测性上看其实就是三个问题：

* [监控指标(Metrics)](https://opentelemetry.io/docs/concepts/observability-primer/#reliability--metrics)：就是我们一般所理解的监控告警。监控一般是将一些数据聚合，体现系统在不同层面的状态，当达到某个状态后告警。比如区域的水位值，达到一定水位后就需要自动或人工扩容，或者调整调度降低这个区域的负载。
* [分布式跟踪(Tracing)](https://opentelemetry.io/docs/concepts/observability-primer/#distributed-traces)：我们排查问题时，一般是按照会话或请求维度排查，在系统中会涉及多个服务器，比如播放一个流会经过API、调度、边缘、上游服务器、源站等，如何把这个全链路的信息给出来，就是分布式追踪(Tracing)。明显这是非常高效的解决问题的方法，问题迟迟得不到解决甚至不了了之，迟早会失去用户。
* [日志(Logging)](https://opentelemetry.io/docs/concepts/observability-primer/#logs): 就是我们一般所理解的日志，也是一般研发所依赖的排查问题的几乎唯一的方法。其实日志是最低效的方法，因为日志没有上下文，无法在分布式系统中分离出某个会话的多个日志。日志只有具备追踪的能力，或者在关联到Traceing中，这样才能更高效。

![](/img/doc-2022-10-30-001.png)

> Note: 上图请参考[Metrics, tracing, and logging](https://peter.bourgon.org/blog/2017/02/21/metrics-tracing-and-logging.html)

针对上面的问题，SRS的运营能力分成几个独立的部分，首先是提供了Prometheus可以对接的Exporter，Prometheus可以直接从SRS拉取监控数据，而不依赖外部第三方服务，如下图所示：

```
+-----+               +-----------+     +---------+
| SRS +--Exporter-->--| Promethus +-->--+ Grafana +
+-----+   (HTTP)      +-----------+     +---------+
```

> Note: Promethus是云原生的标准监控系统，在K8s中部署也可以使用这个能力，比如通过Pod发现和采集数据。

下面是关于Exporter的配置。

## Config

Exporter的配置如下，推荐使用环境变量方式开启配置：

```bash
# Prometheus exporter config.
# See https://prometheus.io/docs/instrumenting/exporters
exporter {
    # Whether exporter is enabled.
    # Overwrite by env SRS_EXPORTER_ENABLED
    # Default: off
    enabled off;
    # The http api listen port for exporter metrics.
    # Overwrite by env SRS_EXPORTER_LISTEN
    # Default: 9972
    # See https://github.com/prometheus/prometheus/wiki/Default-port-allocations
    listen 9972;
    # The logging label to category the cluster servers.
    # Overwrite by env SRS_EXPORTER_LABEL
    label cn-beijing;
    # The logging tag to category the cluster servers.
    # Overwrite by env SRS_EXPORTER_TAG
    tag cn-edge;
}
```

下面是详细的使用说明。

## Usage for SRS Exporter

首先，编译和启动SRS，要求`SRS 5.0.86+`：

```bash
./configure && make
env SRS_ENV_ONLY=on SRS_EXPORTER_ENABLED=on SRS_LISTEN=1935 \
  ./objs/srs -e
```

> Note: 我们使用环境变量方式配置SRS，不依赖配置文件。当然使用`conf/prometheus.conf`启动也可以。

> Note: SRS启动成功后，可以打开[http://localhost:9972/metrics](http://localhost:9972/metrics)验证，能看到返回指标数据就是成功了。

接着，我们启动FFmpeg推流：

```bash
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

然后，启动[node_exporter](https://github.com/prometheus/node_exporter)，收集节点的数据，这样和SRS的服务器数据可以形成完整的监控数据:

```bash
docker run --rm -p 9100:9100 prom/node-exporter
```

> Note: 用Docker启动node_exporter数据不准，需要特殊的权限而mac不支持。实际场景请使用二进制直接在主机上启动，可以从[这里](https://github.com/prometheus/node_exporter/releases)下载对应系统的二进制。

> Note: node_exporter启动后，可以打开[http://localhost:9100/metrics](http://localhost:9100/metrics)验证，能看到返回指标数据就是成功了。

最后，编写配置文件`prometheus.yml`，内容如下：

```yml
scrape_configs:
  - job_name: "node"
    metrics_path: "/metrics"
    scrape_interval: 5s
    static_configs:
      - targets: ["host.docker.internal:9100"]
  - job_name: "srs"
    metrics_path: "/metrics"
    scrape_interval: 5s
    static_configs:
      - targets: ["host.docker.internal:9972"]
```

> Note: 默认`scrape_interval`是1m即一分钟，为了测试方便我们设置为`5s`。

启动Prometheus：

```bash
docker run --rm -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  -p 9090:9090 prom/prometheus
```

打开[Prometheus: Targets](http://localhost:9090/targets)，可以看到抓取数据的状态。打开[Prometheus: Graph](http://localhost:9090/graph)，输入一下语句，可以验证是否正常：

```sql
rate(srs_receive_bytes_total[10s])*8/1000
```

这个语句是计算输入的带宽，也就是直播流的码率，如下图所示：

![](/img/doc-2022-10-30-002.png)

虽然Prometheus也能生成图，不过一般是使用Grafana对接Prometheus展示图表。

## Usage for Grafana

首先启动Grafana：

```bash
docker run --rm -it -p 3000:3000 \
  -e GF_SECURITY_ADMIN_USER=admin \
  -e GF_SECURITY_ADMIN_PASSWORD=12345678 \
  -e GF_USERS_DEFAULT_THEME=light \
  grafana/grafana
```

然后打开Grafana页面：[http://localhost:3000/](http://localhost:3000/)

输入用户名`admin`，以及密码`12345678`就可以进入Grafana后台了。

执行命令[添加](https://grafana.com/docs/grafana/latest/developers/http_api/data_source/#create-a-data-source)Prometheus的DataSource：

```bash
curl -s -H "Content-Type: application/json" \
    -XPOST http://admin:12345678@localhost:3000/api/datasources \
    -d '{
    "name": "prometheus",
    "type": "prometheus",
    "access": "proxy", "isDefault": true,
    "url": "http://host.docker.internal:9090"
}'
```

执行命令[导入](https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#create--update-dashboard)HelloWorld图表：

```bash
data=$(curl https://raw.githubusercontent.com/ossrs/srs-grafana/main/dashboards/helloworld-import.json 2>/dev/null)
curl -s -H "Content-Type: application/json" \
    -XPOST http://admin:12345678@localhost:3000/api/dashboards/db \
    --data-binary "{\"dashboard\":${data},\"overwrite\":true,\"inputs\":[],\"folderId\":0}"
```

> Note: 这里[srs-grafana](https://github.com/ossrs/srs-grafana/tree/main/dashboards)有更丰富的仪表盘，可以选择手动导入，或者修改上面的导入命令。

导入后就可以在[仪表盘中](http://localhost:3000/dashboards)看到了，如下图所示：

![](/img/doc-2022-10-30-003.png)

我们还提供了更加完整的仪表盘，可以在[srs-grafana](https://github.com/ossrs/srs-grafana/tree/main/dashboards)中看到，如下图所示：

![](/img/doc-2022-10-30-004.png)

欢迎一起来完善SRS仪表盘。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/exporter)

