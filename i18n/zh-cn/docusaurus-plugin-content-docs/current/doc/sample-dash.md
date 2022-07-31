---
title: DASH 部署
sidebar_label: DASH 部署
hide_title: false
hide_table_of_contents: false
---

# DASH部署实例

SRS支持DASH的详细步骤。

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
./configure && make
```

## 第三步，编写SRS配置文件

详细参考[DASH](https://github.com/ossrs/srs/issues/299#issuecomment-306022840)

将以下内容保存为文件，譬如`conf/dash.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/dash.conf
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
vhost __defaultVhost__ {
    dash {
        enabled         on;
        dash_fragment       30;
        dash_update_period  150;
        dash_timeshift      300;
        dash_path           ./objs/nginx/html;
        dash_mpd_file       [app]/[stream].mpd;
    }
}
```

## 第四步，启动SRS

```bash
./objs/srs -c conf/dash.conf
```

> 备注：我们使用SRS内置的HTTP服务器分发DASH切片，也可以使用Nginx等Web服务器分发。

## 第五步，启动推流编码器

使用FFMPEG命令推流：

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

生成的流地址为：
* RTMP流地址为：`rtmp://192.168.1.170/live/livestream`
* DASH流地址为： `http://192.168.1.170:8080/live/livestream.mpd`

## 第六步，观看RTMP流

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player][srs-player]

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第七步，观看DASH流

DASH流地址为： `http://192.168.1.170:8080/live/livestream.mpd`

可以使用VLC或[dash.js](http://ossrs.net/dash.js/samples/dash-if-reference-player/)观看。

Winlin 2020.01

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[HLS-Audio-Only]: https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#hlsaudioonly
![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-5/doc/sample-dash)


