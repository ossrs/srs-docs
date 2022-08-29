---
title: Ingest 部署
sidebar_label: Ingest 部署
hide_title: false
hide_table_of_contents: false
---

# Ingest采集实例

SRS启动后，自动启动Ingest开始采集file/stream/device，并将流推送到SRS。详细规则参考：[Ingest](./ingest.md)，本文列出了具体的部署的实例。

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
./configure --ffmpeg-tool=on && make
```

> 注意：需要自己下载和安装FFmpeg，请看[Download](https://ffmpeg.org/download.html)。

> 注意：若执行失败，请查看日志，确认FFmpeg路径是SRS能检测到的。

## 第三步，编写SRS配置文件

详细参考[Ingest](./ingest.md)

将以下内容保存为文件，譬如`conf/ingest.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/ingest.conf
listen              1935;
max_connections     1000;
vhost __defaultVhost__ {
    ingest livestream {
        enabled      on;
        input {
            type    file;
            url     ./doc/source.flv;
        }
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine {
            enabled          off;
            output          rtmp://127.0.0.1:[port]/live?vhost=[vhost]/livestream;
        }
    }
}
```

> 注意：请检查软链接`./objs/ffmpeg/bin/ffmpeg`是否正常，也可以直接改成你安装的FFmpeg的路径。

## 第四步，启动SRS

详细参考[Ingest](./ingest.md)

```bash
./objs/srs -c conf/ingest.conf
```

涉及的流包括：
* 采集的流：rtmp://192.168.1.170:1935/live/livestream

## 第五步，观看RTMP流

详细参考[Ingest](./ingest.md)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v4/sample-ingest)


