---
title: Transcode 部署
sidebar_label: Transcode 部署
hide_title: false
hide_table_of_contents: false
---

# FFMPEG 转码部署实例

FFMPEG对RTMP直播流转码，SRS在收到编码器推送的直播流后，可以对直播流进行转码，输出RTMP流到服务器（也可以到SRS自己）。
详细规则参考：[FFMPEG](./ffmpeg)，本文列出了具体的部署的实例。

**假设服务器的IP是：192.168.1.170**

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
./configure --ffmpeg-tool=on && make
```

## 第三步，编写SRS配置文件

详细参考[FFMPEG](./ffmpeg)

将以下内容保存为文件，譬如`conf/ffmpeg.transcode.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/ffmpeg.transcode.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine ff {
            enabled         on;
            vfilter {
            }
            vcodec          libx264;
            vbitrate        500;
            vfps            25;
            vwidth          768;
            vheight         320;
            vthreads        12;
            vprofile        main;
            vpreset         medium;
            vparams {
            }
            acodec          libfdk_aac;
            abitrate        70;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

## 第四步，启动SRS

详细参考[FFMPEG](./ffmpeg)

```bash
./objs/srs -c conf/ffmpeg.conf
```

## 第五步，启动推流编码器

详细参考[FFMPEG](./ffmpeg)

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
* 编码器推送流：rtmp://192.168.1.170:1935/live/livestream
* 观看原始流：rtmp://192.168.1.170:1935/live/livestream
* 观看转码流：rtmp://192.168.1.170:1935/live/livestream_ff

## 第六步，观看RTMP流

详细参考[FFMPEG](./ffmpeg)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第七步，观看FFMPEG转码的RTMP流

详细参考[FFMPEG](./ffmpeg)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream_ff`

可以使用VLC观看。

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-4/doc/sample-ffmpeg)


