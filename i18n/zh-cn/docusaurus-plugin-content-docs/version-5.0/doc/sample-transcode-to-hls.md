---
title: 转码 HLS 分发
sidebar_label: 转码 HLS 分发
hide_title: false
hide_table_of_contents: false
---

# 转码后分发HLS部署实例

HLS需要h.264+aac，若符合这个要求可以按照[Usage: HLS](./hls.md)部署，若不符合这个要求则需要转码。

如何知道流是否是h264+aac编码：
* [Usage: HLS](./hls.md)中的`Q&A`说明的问题。
* 看编码器的参数，FMLE可以选视频编码为vp6或者h264，音频一般为mp3/NellyMoser。，所以FMLE肯定推流是不符合要求的。
* 看SRS的日志，若显示`hls only support video h.264/avc codec. ret=601`，就明显说明是编码问题。

备注：在虚拟机上测试，一路流转码为aac，需要3%CPU，在物理机上可能稍好点。转码的开销比分发要大，实际应用需要考虑这个因素。

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

## 第三步，编写SRS配置文件

详细参考[HLS分发](./hls.md)

将以下内容保存为文件，譬如`conf/transcode2hls.audio.only.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/transcode2hls.audio.only.conf
listen              1935;
max_connections     1000;
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
vhost __defaultVhost__ {
    hls {
        enabled         on;
        hls_path        ./objs/nginx/html;
        hls_fragment    10;
        hls_window      60;
    }
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine ff {
            enabled         on;
            vcodec          copy;
            acodec          libfdk_aac;
            abitrate        45;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

备注：这个配置使用只转码音频，因为视频是h.264符合要求，若需要全转码

## 第四步，启动SRS

详细参考[HLS分发](./hls.md)

```bash
./objs/srs -c conf/transcode2hls.audio.only.conf
```

## 第五步，启动推流编码器

详细参考[HLS分发](./hls.md)

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

生成的流地址为：
* RTMP流地址为（FMLE推流无HLS地址）：`rtmp://192.168.1.170/live/livestream`
* 转码后的RTMP流地址为：`rtmp://192.168.1.170/live/livestream_ff`
* 转码后的HLS流地址为： `http://192.168.1.170:8080/live/livestream_ff.m3u8`

备注：因为FMLE推上来的音频有问题，不是aac，所以srs会报错（当然啦，不然就不用转码了）。这个错误可以忽略，srs是说，rtmp流没有问题，但是无法切片为hls，因为音频编码不对。没有关系，ffmpeg会转码后重新推一路流给srs。

备注：如何只对符合要求的流切hls？可以用vhost。默认的vhost不切hls，将转码后的流推送到另外一个vhost，这个vhost切hls。

## 第七步，观看RTMP流

详细参考[HLS分发](./hls.md)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream_ff`

可以使用VLC观看。

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第八步，观看HLS流

详细参考[HLS分发](./hls.md)

HLS流地址为： `http://192.168.1.170:8080/live/livestream_ff.m3u8`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/sample-transcode-to-hls)


