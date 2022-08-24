---
title: Forward 部署
sidebar_label: Forward 部署
hide_title: false
hide_table_of_contents: false
---

# RTMP流转发（Forward）部署实例

SRS可以将送到SRS的流转发给其他RTMP服务器，实现简单集群/热备功能，也可以实现一路流热备（譬如编码器由于带宽限制，只能送一路流到RTMP服务器，要求RTMP服务器能将这路流也转发给其他RTMP备用服务器，实现主备容错集群）。

**假设服务器的IP是：192.168.1.170**

Forward就是SRS将流拷贝输出给其他的RTMP服务器，以SRS转发给SRS为例：
* 主SRS：Master, 编码器推流到主SRS，主SRS将流处理的同时，将流转发到备SRS
* 备SRS：Slave, 主SRS转发流到备SRS，就像编码器推送流到备用SRS一样。
我们的部署实例中，主SRS侦听1935端口，备SRS侦听19350端口。

## 第一步，获取SRS

详细参考[GIT获取代码](./git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：

```bash
git pull
```

## 第二步，编译SRS

详细参考[Build](./install)

```bash
./configure && make
```

## 第三步，编写主SRS配置文件

详细参考[Forward](./forward)

将以下内容保存为文件，譬如`conf/forward.master.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/forward.master.conf
listen              1935;
max_connections     1000;
pid                 ./objs/srs.master.pid;
srs_log_tank        file;
srs_log_file        ./objs/srs.master.log;
vhost __defaultVhost__ {
    forward {
        enabled on;
        destination 127.0.0.1:19350;
    }
}
```

## 第四步，启动主SRS，主SRS将流转发到备SRS

详细参考[Forward](./forward)

```bash
./objs/srs -c conf/forward.master.conf
```

## 第五步，编写备SRS配置文件

详细参考[Forward](./forward)

将以下内容保存为文件，譬如`conf/forward.slave.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/forward.slave.conf
listen              19350;
pid                 ./objs/srs.slave.pid;
srs_log_tank        file;
srs_log_file        ./objs/srs.slave.log;
vhost __defaultVhost__ {
}
```

## 第六步，启动备SRS，主SRS将流转发到备SRS

详细参考[Forward](./forward)

```bash
./objs/srs -c conf/forward.slave.conf
```

注意：启动srs后查看下srs是否启动成功，错误可以查看日志。

```bash
[winlin@dev6 srs]$ sudo netstat -anp|grep srs
tcp        0      0 0.0.0.0:1935                0.0.0.0:*                   LISTEN      7826/srs            
tcp        0      0 0.0.0.0:19350               0.0.0.0:*                   LISTEN      7834/srs
```

## 第七步，启动推流编码器

详细参考[Forward](./forward)

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

涉及的流包括：
* 编码器推送的流：rtmp://192.168.1.170/live/livestream
* 主SRS转发的流：rtmp://192.168.1.170:19350/live/livestream
* 观看主SRS的流：rtmp://192.168.1.170/live/livestream
* 观看备SRS的流：rtmp://192.168.1.170:19350/live/livestream

## 第八步，观看主SRS的RTMP流

详细参考[Forward](./forward)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第九步，观看备SRS的RTMP流

详细参考[Forward](./forward)

RTMP流地址为：`rtmp://192.168.1.170:19350/live/livestream`

可以使用VLC观看。



备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.3

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/sample-forward)


