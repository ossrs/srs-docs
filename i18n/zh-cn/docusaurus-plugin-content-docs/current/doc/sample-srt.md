---
title: SRT 部署
sidebar_label: SRT 部署
hide_title: false
hide_table_of_contents: false
---

# SRT部署实例

SRS支持SRT的详细步骤。

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
./configure --srt=on && make
```

> 备注：推荐使用[srs-docker](https://github.com/ossrs/srs/issues/1147#issuecomment-577951899)启动SRS和运行FFMPEG。

## 第三步，编写SRS配置文件

将以下内容保存为文件，譬如`conf/srt.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/srt.conf
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;
srt_server {
    enabled on;
    listen 10080;
}
vhost __defaultVhost__ {
}
```

> Note: 关于SRT更多的详细配置参数，参考[SRT Parameters](./srt-params.md)。

> Note: 关于SRT的讨论可以参考[#1147](https://github.com/ossrs/srs/issues/1147#issuecomment-577469119)。

## 第四步，启动SRS

```bash
./objs/srs -c conf/srt.conf
```

## 第五步，启动推流编码器

使用FFMPEG命令推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -pes_payload_size 0 -f mpegts 'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

可直接用ffplay播放：

```bash
ffplay 'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request'
```

生成的流地址为：

* RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

## 第六步，观看RTMP流

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

Winlin 2020.01

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[HLS-Audio-Only]: https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#hlsaudioonly

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/sample-srt)


