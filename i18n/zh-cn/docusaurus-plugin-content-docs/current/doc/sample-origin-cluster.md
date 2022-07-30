---
title: RTMP 源站集群
sidebar_label: RTMP 源站集群
hide_title: false
hide_table_of_contents: false
---

# RTMP源站集群部署实例

RTMP源站集群部署的步骤，我们给出了一个例子，部署了两个源站做集群，还部署了一个边缘。
实际使用中，可以部署多个源站和多个边缘，形成源站集群。

**假设服务器的IP是：192.168.1.170**

## 第一步，获取SRS

详细参考[GIT获取代码](https://github.com/ossrs/srs/wiki/v4_CN_Git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：

```bash
git pull
```

## 第二步，编译SRS

详细参考[Build](https://github.com/ossrs/srs/wiki/v4_CN_Build)

```bash
./configure && make
```

## 第三步，编写SRS源站A配置文件

详细参考[RTMP源站集群](https://github.com/ossrs/srs/wiki/v4_CN_OriginCluster)

将以下内容保存为文件，譬如`conf/origin.cluster.serverA.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/origin.cluster.serverA.conf
listen              19350;
max_connections     1000;
daemon              off;
srs_log_tank        console;
pid                 ./objs/origin.cluster.serverA.pid;
http_api {
    enabled         on;
    listen          9090;
}
vhost __defaultVhost__ {
    cluster {
        mode            local;
        origin_cluster  on;
        coworkers       127.0.0.1:9091;
    }
}
```

## 第四步，编写SRS源站B配置文件

详细参考[RTMP源站集群](https://github.com/ossrs/srs/wiki/v4_CN_OriginCluster)

将以下内容保存为文件，譬如`conf/origin.cluster.serverB.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/origin.cluster.serverB.conf
listen              19351;
max_connections     1000;
daemon              off;
srs_log_tank        console;
pid                 ./objs/origin.cluster.serverB.pid;
http_api {
    enabled         on;
    listen          9091;
}
vhost __defaultVhost__ {
    cluster {
        mode            local;
        origin_cluster  on;
        coworkers       127.0.0.1:9090;
    }
}
```

## 第五步，编写SRS边缘配置文件，从多个源站拉流，实现热备和负载均衡

详细参考[RTMP源站集群](https://github.com/ossrs/srs/wiki/v4_CN_OriginCluster)

将以下内容保存为文件，譬如`conf/origin.cluster.edge.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/origin.cluster.edge.conf
listen              1935;
max_connections     1000;
pid                 objs/edge.pid;
daemon              off;
srs_log_tank        console;
vhost __defaultVhost__ {
    cluster {
        mode            remote;
        origin          127.0.0.1:19351 127.0.0.1:19350;
    }
}
```

> Remark: 如果播放器支持RTMP302，当然可以直接播放源站的流，任意源站都能播放，如果流不在访问的源站，会返回RTMP302重定向到流所在的源站。

## 第六步，启动SRS

详细参考[RTMP源站集群](https://github.com/ossrs/srs/wiki/v4_CN_OriginCluster)

```bash
./objs/srs -c conf/origin.cluster.serverA.conf &
./objs/srs -c conf/origin.cluster.serverB.conf &
./objs/srs -c conf/origin.cluster.edge.conf &
```

## 第七步，启动推流编码器，推流到19350

详细参考[RTMP源站集群](https://github.com/ossrs/srs/wiki/v4_CN_OriginCluster)

使用FFMPEG命令推流：

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170:19350/live/livestream; \
        sleep 1; \
    done
```

或使用FMLE推流：

```bash
FMS URL: rtmp://192.168.1.170:19350/live
Stream: livestream
```

## 第八步，观看RTMP流，不管流推到哪个源站，播放边缘的流都能从正确的源站回源取流

详细参考[RTMP源站集群](https://github.com/ossrs/srs/wiki/v4_CN_OriginCluster)

观看集群的RTMP流地址为：`rtmp://192.168.1.170/live/livestream`，可以使用VLC观看。或者使用在线SRS播放器播放：[srs-player][srs-player]

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2018.2

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080