---
title: RTMP 集群部署
sidebar_label: RTMP 集群部署
hide_title: false
hide_table_of_contents: false
---

# RTMP边缘集群部署实例

RTMP边缘集群部署的步骤。

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

## 第三步，编写SRS源站配置文件

详细参考[RTMP分发](./rtmp.md)和[Edge](./edge.md)

将以下内容保存为文件，譬如`conf/origin.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/origin.conf
listen              19350;
max_connections     1000;
pid                 objs/origin.pid;
srs_log_file        ./objs/origin.log;
vhost __defaultVhost__ {
}
```

## 第四步，编写SRS边缘配置文件

详细参考[RTMP分发](./rtmp.md)和[Edge](./edge.md)

将以下内容保存为文件，譬如`conf/edge.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/edge.conf
listen              1935;
max_connections     1000;
pid                 objs/edge.pid;
srs_log_file        ./objs/edge.log;
vhost __defaultVhost__ {
    cluster {
        mode            remote;
        origin          127.0.0.1:19350;
    }
}
```

## 第五步，启动SRS

详细参考[RTMP分发](./rtmp.md)和[Edge](./edge.md)

```bash
./objs/srs -c conf/origin.conf &
./objs/srs -c conf/edge.conf &
```

## 第六步，启动推流编码器

详细参考[RTMP分发](./rtmp.md)和[Edge](./edge.md)

使用FFMPEG命令推流：

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

或使用FMLE推流：

```bash
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

## 第七步，观看RTMP流

详细参考[RTMP分发](./rtmp.md)和[Edge](./edge.md)

源站RTMP流地址为：`rtmp://192.168.1.170:19350/live/livestream`，可以使用VLC观看。

边缘RTMP流地址为：`rtmp://192.168.1.170/live/livestream`，可以使用VLC观看。或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/sample-rtmp-cluster)


