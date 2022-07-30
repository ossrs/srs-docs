---
title: HTTP-FLV 部署
sidebar_label: HTTP-FLV 部署
hide_title: false
hide_table_of_contents: false
---

# HTTP-FLV部署实例

SRS支持HTTP FLV直播流分发，详细参考[HTTP FLV](http://ossrs.net/srs.release/wiki/v4_CN_DeliveryHttpStream#about-http-flv)

SRS的HTTP FLV边缘只能使用单进程，如何做到多进程呢？可以使用HTTP反向代理，SRS提供了go-sharp，支持根据SRS边缘的负载均衡以及心跳检测。参考：[go-sharp][go-sharp]

**假设服务器的IP是：192.168.1.170**

## 第一步，获取SRS

详细参考[GIT获取代码](../../doc/git.md)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：

```bash
git pull
```

## 第二步，编译SRS

详细参考[Build](../../doc/build/install.md)

```bash
./configure && make
```

## 第三步，编写SRS配置文件

详细参考[HTTP FLV](http://ossrs.net/srs.release/wiki/v4_CN_DeliveryHttpStream)

将以下内容保存为文件，譬如`conf/http.flv.live.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/http.flv.live.conf
listen              1935;
max_connections     1000;
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
vhost __defaultVhost__ {
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
        hstrs       on;
    }
}
```

## 第四步，启动SRS

详细参考[HTTP FLV](http://ossrs.net/srs.release/wiki/v4_CN_DeliveryHttpStream)

```bash
./objs/srs -c conf/http.flv.live.conf
```

## 第五步，启动推流编码器

详细参考[HTTP FLV](http://ossrs.net/srs.release/wiki/v4_CN_DeliveryHttpStream)

使用FFMPEG命令推流：

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

或使用支持FMLE推流：

```bash
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

生成的流地址为：
* RTMP流地址为：`rtmp://192.168.1.170/live/livestream`
* HTTP FLV: `http://192.168.1.170:8080/live/livestream.flv`

## 第六步，观看RTMP流

详细参考[HTTP FLV](http://ossrs.net/srs.release/wiki/v4_CN_DeliveryHttpStream)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`，可以使用VLC观看，或者使用在线SRS播放器播放：[srs-player][srs-player]

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第七步，观看FLV流

详细参考[HTTP FLV](http://ossrs.net/srs.release/wiki/v4_CN_DeliveryHttpStream)

HTTP FLV流地址为： `http://192.168.1.170:8080/live/livestream.flv`，可以使用VLC观看，或者使用在线SRS播放器播放：[jwplayer-flv][jwplayer-flv]

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.4