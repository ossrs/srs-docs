---
title: HLS 集群部署
sidebar_label: HLS 集群部署
hide_title: false
hide_table_of_contents: false
---

# HLS 边缘集群部署实例

如何创建分发HLS的边缘集群，就像CDN一样分发HLS流。

**假设服务器的IP是：192.168.1.170**

## 第一步，获取SRS

详细参考[GIT获取代码](./git.md)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：

```bash
git pull
```

## 第二步，编译SRS

详细参考[Build](./install.md)

```bash
./configure && make
```

## 第三步，编写SRS源站配置文件，生成HLS切片文件

详细参考[HLS分发](./delivery-hls.md)。

将以下内容保存为文件，譬如`conf/hls.origin.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/hls.origin.conf
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;
http_server {
    enabled         on;
    listen          8080;
}
vhost __defaultVhost__ {
    hls {
        enabled         on;
    }
}
```

## 第四步，编写NGINX边缘配置文件，分发HLS文件

详细参考[Nginx for HLS](./nginx-for-hls.md)。

将以下内容保存为文件，譬如`conf/hls.edge.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/hls.edge.conf
worker_processes  3;
events {
    worker_connections  10240;
}

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

## 第五步，启动SRS源站和NGINX边缘

```bash
nginx -c $(pwd)/conf/hls.edge.conf
./objs/srs -c conf/hls.origin.conf
```

> Note: 请参考[NGINX](https://nginx.org/)的说明下载和安装，只要是NGINX就可以，没有特别的要求。

## 第六步，启动推流编码器，推流到SRS，生成HLS文件

使用FFMPEG命令推流：

```bash
for((;;)); do \
    ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
    -c copy -f flv rtmp://192.168.1.170/live/livestream; \
    sleep 1; \
done
```

或使用OBS推流：

```bash
Server: rtmp://192.168.1.170/live
StreamKey: livestream
```

## 第七步，观看HLS流

SRS源站的HLS流: `http://192.168.1.170:8080/live/livestream.m3u8`

NGINX边缘的HLS流: `http://192.168.1.170:8081/live/livestream.m3u8`

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第八步，压测和添加更多的边缘NGINX

可以使用[srs-bench](https://github.com/ossrs/srs-bench#usage)，模拟很多客户端，播放HLS流：

```bash
docker run --rm -it --network=host --name sb ossrs/srs:sb \
  ./objs/sb_hls_load -c 100 -r http://192.168.1.170:8081/live/livestream.m3u8
```

可以多找几台服务器，用同样的配置文件启动NGINX，就成了一个边缘集群了。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/sample-hls-cluster)


