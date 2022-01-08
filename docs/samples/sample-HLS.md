---
title: HLS 部署实例
sidebar_label: HLS 部署实例
hide_title: true
hide_table_of_contents: false
custom_edit_url: null
---

## HLS 部署实例

> Note: 如果觉得Github的Wiki访问太慢，可以访问 Gitee 镜像。

SRS支持HLS的详细步骤。

**假设服务器的IP是：192.168.1.170**

### 第一步，获取SRS。

详细参考GIT获取代码

```
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：
```
git pull
```

### 第二步，编译SRS。

详细参考Build

```
./configure && make
```


### 第三步，编写SRS配置文件。

详细参考HLS分发

将以下内容保存为文件，譬如conf/hls.conf，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```
# conf/hls.conf
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
}
```

> 备注：我们使用SRS内置的HTTP服务器分发HLS切片，也可以使用Nginx等Web服务器分发。

> 备注：hls_path必须存在，srs只会自动创建${hls_path}下的app的目录。参考：HLS分发: HLS流程


### 第四步，启动SRS。

详细参考HLS分发

```
./objs/srs -c conf/hls.conf
```

### 第五步，用FFMPEG或FMLE推流。

详细参考HLS分发

使用FFMPEG命令推流：
```
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

或使用支持h.264+aac的FMLE推流（若不支持h.264+aac，则可以使用srs转码，参考Transcode2HLS）：

```
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

生成的流地址为：
- RTMP流地址为：rtmp://192.168.1.170/live/livestream
- HLS流地址为： http://192.168.1.170:8080/live/livestream.m3u8


### 第六步，观看RTMP流。

详细参考HLS分发

RTMP流地址为：rtmp://192.168.1.170/live/livestream

可以使用VLC观看。

或者使用在线SRS播放器播放：srs-player

> 备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

### 第七步，观看HLS流。

详细参考HLS分发

HLS流地址为： http://192.168.1.170:8080/live/livestream.m3u8

可以使用VLC观看。

或者使用在线SRS播放器播放：srs-player

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

注意：VLC无法观看纯音频流，jwplayer可以观看。

分发纯音频流参考：HLS audio only

### Q&A

**RTMP流能看，HLS看不了**

- 确认nginx启动并且可以访问：nginx is ok页面能访问。
- 确认m3u8文件能下载：浏览器打开http://192.168.1.170:8080/live/livestream.m3u8，ip地址换成你服务器的IP地址。
- 若m3u8能下载，可能是srs-player的问题，使用vlc播放地址：http://192.168.1.170:8080/live/livestream.m3u8，ip地址换成你服务器的IP地址。
若VLC不能播放，将m3u8下载后，用文本编辑器打开，将m3u8文件内容发到群中，或者贴到issue中。寻求帮助。
- 还有可能是编码问题，参考下面的“RTMP流和HLS流内容不一致”


**RTMP流内容和HLS流内容不一致**

- 一般这种问题出现在使用上面的例子推流，然后换成别的编码器推流，或者换个文件推流。
- 可能是流的编码不对（推流时使用FMLE），HLS需要h.264+aac，需要转码，参考只转码音频Transcode2HLS


Winlin 2014.3
