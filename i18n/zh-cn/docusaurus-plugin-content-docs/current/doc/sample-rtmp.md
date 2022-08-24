---
title: RTMP 部署
sidebar_label: RTMP 部署
hide_title: false
hide_table_of_contents: false
---

# RTMP 部署实例

RTMP部署的步骤。

**假设服务器的IP是：192.168.1.170**

## 第一步，获取SRS。

详细参考GIT获取代码

```
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：

```
git pull
```


## 第二步，编译SRS。
详细参考Build

```
./configure && make
```


## 第三步，编写SRS配置文件。
详细参考RTMP分发

将以下内容保存为文件，譬如 conf/rtmp.conf，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```
# conf/rtmp.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
}
```

## 第四步，启动SRS。
详细参考RTMP分发

```
./objs/srs -c conf/rtmp.conf
```

## 第五步，启动推流编码器。
详细参考RTMP分发

使用FFMPEG命令推流：
```
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

或使用FMLE推流：

```
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

## 第六步，观看RTMP流。
详细参考RTMP分发


RTMP流地址为：rtmp://192.168.1.170/live/livestream

可以使用VLC观看。

或者使用在线SRS播放器播放：srs-player

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/sample-rtmp)


