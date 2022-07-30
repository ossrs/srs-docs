---
title: Nginx For HLS
sidebar_label: Nginx For HLS
hide_title: false
hide_table_of_contents: false
---

# NGINX for HLS

边缘集群（Edge Cluster）就是为了解决很多人观看的问题，可以支持非常多的人观看直播流。注意：

* SRS Edge只支持直播流协议，比如RTMP或HTTP-FLV等，参考[RTMP Edge Cluster](https://github.com/ossrs/srs/wiki/v4_CN_SampleRTMPCluster)。
* SRS Edge不支持HLS或DASH等切片的直播流，本质上它们不是流，就是文件分发。
* SRS Edge不支持WebRTC的流分发，这不是Edge设计的目标，WebRTC有自己的集群方式，参考[#2091](https://github.com/ossrs/srs/issues/2091)。

本文描述的就是HLS或DASH等切片的边缘集群，基于NGINX实现，所以也叫NGINX Edge Cluster。

## NGINX Edge Cluster

NGINX边缘集群，本质上就是带有缓存的反向代理，也就是NGNIX Proxy with Cache。

```text
+------------+          +------------+          +------------+          +------------+
+ FFmpeg/OBS +--RTMP-->-+ SRS Origin +--HLS-->--+ NGINX      +--HLS-->--+ Visitors   +
+------------+          +------------+          + Servers    +          +------------+
                                                +------------+          
```

只需要配置NGINX的缓存策略就可以，不需要额外插件，NGINX本身就支持：

```nginx
http {
    # For Proxy Cache.
    proxy_cache_path  /tmp/nginx-cache levels=1:2 keys_zone=srs_cache:8m max_size=1000m inactive=600m;
    proxy_temp_path /tmp/nginx-cache/tmp; 

    server {
        listen       8081;
        # For Proxy Cache.
        proxy_cache_valid  404      10s;
        proxy_cache_lock on;
        proxy_cache_lock_age 300s;
        proxy_cache_lock_timeout 300s;
        proxy_cache_min_uses 1;

        location ~ /.+/.*\.(m3u8)$ {
            proxy_pass http://127.0.0.1:8080$request_uri;
            # For Proxy Cache.
            proxy_cache srs_cache;
            proxy_cache_key $scheme$proxy_host$uri$args;
            proxy_cache_valid  200 302  10s;
        }
        location ~ /.+/.*\.(ts)$ {
            proxy_pass http://127.0.0.1:8080$request_uri;
            # For Proxy Cache.
            proxy_cache srs_cache;
            proxy_cache_key $scheme$proxy_host$uri;
            proxy_cache_valid  200 302  60m;
        }
    }
}
```

> Note: 可以配置缓存的目录`proxy_cache_path`和`proxy_temp_path`，改成能访问的目录就可以。

> Note: 一般不要修改`location`配置，除非你知道代表什么含义，要改也先跑起来了再改。

一定不能只配置成纯Proxy，这样会把负载透传到SRS，系统支持的客户端数目，还是SRS支持的数目。

开启Cache后，无论NGINX多少负载，SRS都只有一个流。这样我们可以扩展多个NGINX，实现支持非常多的观看并发了。

比如1Mbps的HLS流，1000个客户端播放NGINX，那么NGINX的带宽就是1Gbps，而SRS只有1Mbps。

如果我们扩展10个NGINX，每个NGINX是10Gbps带宽，那么整个系统的带宽是100Gbps，能支持10万并发，SRS的带宽消耗只有10Mbps。

如何验证系统正常工作呢？这就要用到Benchmark了。

## Benchmark

如何压测这个系统呢？可以用[srs-bench](https://github.com/ossrs/srs-bench#usage)，使用起来非常方便，可以用docker直接启动：

```bash
docker run --rm -it --network=host --name sb ossrs/srs:sb \
  ./objs/sb_hls_load -c 500 \
  -r http://your_server_public_ipv4/live/livestream.m3u8
```

而且也可以压测RTMP和HTTP-FLV：

```bash
docker run --rm -it --network=host --name sb ossrs/srs:sb \
  ./objs/sb_http_load -c 500 \
  -r http://your_server_public_ipv4/live/livestream.flv
```

> Note: 每个SB模拟的客户端并发在500到1000个，具体以CPU不要超过80%为准，可以启动多个进程压测。

那就让我们动手搞个HLS集群出来吧。

## Example

下面我们用docker来构建一个HLS的分发集群。

首先，启动SRS源站：

```bash
./objs/srs -c conf/hls.origin.conf
```

然后，启动NGINX源站：

```bash
nginx -c $(pwd)/conf/hls.edge.conf
```

最后，推流到源站：

```bash
ffmpeg -re -i doc/source.flv -c copy \
  -f flv rtmp://127.0.0.1/live/livestream
```

播放HLS：

* SRS源站：http://127.0.0.1:8080/live/livestream.m3u8
* NGINX边缘：http://127.0.0.1:8081/live/livestream.m3u8

启动压测，从NGINX取HLS：

```bash
docker run --rm -it --network=host --name sb ossrs/srs:sb \
  ./objs/sb_hls_load -c 500 \
  -r http://192.168.0.14:8081/live/livestream.m3u8
```

可是看到SRS的压力并不大，CPU消耗都在NGINX上。

​NGINX边缘集群成功解决了HLS的分发问题，如果同时需要做​低延迟直播，分发HTTP-FLV，怎么做呢？如果要支持HTTPS HLS，或者HTTPS-FLV呢？

NGINX完全没问题，下面就看如何配合SRS Edge Server，实现HTTP-FLV和HLS通过​NGINX分发。

## Work with SRS Edge Server

NGINX边缘集群，也可以和SRS Edge Server一起工作，可以实现HLS和HTTP-FLV的分发。

```text
+------------+           +------------+
| SRS Origin +--RTMP-->--+ SRS Edge   +
+-----+------+           +----+-------+
      |                       |               +------------+
      |                       +---HTTP-FLV->--+   NGINX    +              +-----------+
      |                                       +   Edge     +--HLS/FLV-->--+ Visitors  +
      +-------HLS--->-------------------------+   Servers  +              +-----------+
                                              +------------+
```

实现起来很简单，只需要在NGINX的服务器上，部署一个SRS，并让NGINX工作在反向代理模式就可以。

```nginx
# For SRS streaming, for example:
#   http://r.ossrs.net/live/livestream.flv
location ~ /.+/.*\.(flv)$ {
   proxy_pass http://127.0.0.1:8080$request_uri;
}
```

这样HLS由NGINX管理缓存和回源，而FLV则由SRS Edge缓存和回源。

这个架构虽好，实际上NGINX可以直接作为HLS源站，这样可以更高性能，是否可以呢​？完全没问题，我们看如何完全用NGINX分发HLS。​

## NGINX Origin Server

由于HLS就是普通的文件，因此也可以直接使用NGINX作为HLS源站。

在超高并发的NGINX Edge集群中，也可以形成机房级别的小集群，从某个NGINX中集中回源，这样可以支持更高的并发。

使用NGINX分发HLS文件，其实很简单，只需要设置root就可以了：

```nginx
  # For HLS delivery
  location ~ /.+/.*\.(m3u8)$ {
    root /usr/local/srs/objs/nginx/html;
    add_header Cache-Control "public, max-age=10";
  }
  location ~ /.+/.*\.(ts)$ {
    root /usr/local/srs/objs/nginx/html;
    add_header Cache-Control "public, max-age=86400";
  }
```

> Note: 这里我们设置了m3u8的缓存时间是10秒，需要根据切片的大小调整。

> Note: 由于目前SRS支持HLS variant，实现HLS的播放统计，因此没有NGINX这么高效，参考 [#2995](https://github.com/ossrs/srs/issues/2995)

> Note: SRS应该要设置`Cache-Control`，因为切片的服务才能动态设置正确的缓存时间，减少延迟，参考 [#2991](https://github.com/ossrs/srs/issues/2991)

## Debugging

如何判断缓存有没有生效呢？可以在NGINX日志中，加入一个字段`upstream_cache_status`，分析NGINX日志来判断缓存是否生效：

```nginx
log_format  main  '$upstream_cache_status $remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
access_log  /var/log/nginx/access.log main;
```

第一个字段就是缓存状态，可以用下面的命令分析，比如只看TS文件的缓存情况：

```bash
cat /var/log/nginx/access.log | grep '.ts HTTP' \
  | awk '{print $1}' | sort | uniq -c | sort -r
```

可以看到哪些是HIT缓存了，就不会从SRS下载文件，而直接从NGINX获取文件了。

也可以直接在响应头加入这个字段，这样可以在浏览器中看每个请求，是否HIT了：

```nginx
add_header X-Cache-Status $upstream_cache_status;
```

> Note: 关于缓存生效时间，参考字段[proxy_cache_valid](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache_valid)的定义，实际上若源站指定了`Cache-Control`会覆盖这个配置。

## aaPanel Configuration

若使用宝塔，那么可以新增一个站点，然后在站点的配置中写入如下配置：

```nginx
    # For Proxy Cache.
    proxy_cache_path  /tmp/nginx-cache levels=1:2 keys_zone=srs_cache:8m max_size=1000m inactive=600m;
    proxy_temp_path /tmp/nginx-cache/tmp; 

    server {
        listen       80;
        server_name your.domain.com;

        # For Proxy Cache.
        proxy_cache_valid  404      10s;
        proxy_cache_lock on;
        proxy_cache_lock_age 300s;
        proxy_cache_lock_timeout 300s;
        proxy_cache_min_uses 1;

        location ~ /.+/.*\.(m3u8)$ {
            proxy_pass http://127.0.0.1:8080$request_uri;
            # For Proxy Cache.
            proxy_cache srs_cache;
            proxy_cache_key $scheme$proxy_host$uri$args;
            proxy_cache_valid  200 302  10s;
        }
        location ~ /.+/.*\.(ts)$ {
            proxy_pass http://127.0.0.1:8080$request_uri;
            # For Proxy Cache.
            proxy_cache srs_cache;
            proxy_cache_key $scheme$proxy_host$uri;
            proxy_cache_valid  200 302  60m;
        }
    }
```

> 注意：一般宝塔新增站点侦听的是80端口，域名server_name是自己填的域名，其他配置同宝塔配置。或者在宝塔的这个站点配置中，加入上面的cache和location的配置也可以。