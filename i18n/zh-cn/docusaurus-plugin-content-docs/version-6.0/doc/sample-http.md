---
title: HTTP Server 部署
sidebar_label: HTTP Server 部署
hide_title: false
hide_table_of_contents: false
---

# SRS-HTTP服务部署实例

SRS内嵌了http服务器，支持分发hls流和文件。

以分发HLS为例，使用SRS分发RTMP和HLS流，不依赖于外部服务器。

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

## 第三步，编写SRS配置文件

详细参考[HLS分发](./hls.md)和[HTTP服务器](./http-server.md)

将以下内容保存为文件，譬如`conf/http.hls.conf`，服务器启动时指定该配置文件(srs的conf文件夹有该文件)。

```bash
# conf/http.hls.conf
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

备注：hls_path必须存在，srs只会自动创建`${hls_path}`下的app的目录。参考：[HLS分发: HLS流程](./hls.md)

## 第四步，启动SRS

详细参考[HLS分发](./hls.md)和[HTTP服务器](./http-server.md)

```bash
./objs/srs -c conf/http.hls.conf
```

备注：请确定srs-http-server已经启动，可以访问[nginx](http://localhost:8080/nginx.html)，若能看到`nginx is ok`则没有问题。

备注：实际上提供服务的是SRS，可以看到响应头是`Server: SRS/0.9.51`之类。

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

或使用支持h.264+aac的FMLE推流（若不支持h.264+aac，则可以使用srs转码，参考[Transcode2HLS](./sample-transcode-to-hls.md)）：

```bash
FMS URL: rtmp://192.168.1.170/live
Stream: livestream
```

生成的流地址为：
* RTMP流地址为：`rtmp://192.168.1.170/live/livestream`
* HLS流地址为： `http://192.168.1.170:8080/live/livestream.m3u8`

## 第六步，观看RTMP流

详细参考[HLS分发](./hls.md)

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

## 第七步，观看HLS流

详细参考[HLS分发](./hls.md)

HLS流地址为： `http://192.168.1.170:8080/live/livestream.m3u8`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

注意：VLC无法观看纯音频流。

## Q&A

## RTMP流能看，HLS看不了
* 确认srs-http-server启动并且可以访问：`nginx is ok`页面能访问。
* 确认m3u8文件能下载：浏览器打开`http://192.168.1.170:8080/live/livestream.m3u8`，ip地址换成你服务器的IP地址。
* 若m3u8能下载，可能是srs-player的问题，使用vlc播放地址：`http://192.168.1.170:8080/live/livestream.m3u8`，ip地址换成你服务器的IP地址。
* 若VLC不能播放，将m3u8下载后，用文本编辑器打开，将m3u8文件内容发到群中，或者贴到issue中。寻求帮助。
* 还有可能是编码问题，参考下面的“RTMP流和HLS流内容不一致”

## RTMP流内容和HLS流内容不一致
* 一般这种问题出现在使用上面的例子推流，然后换成别的编码器推流，或者换个文件推流。
* 可能是流的编码不对（推流时使用FMLE），HLS需要h.264+aac，需要转码，参考只转码音频[Transcode2HLS](./sample-transcode-to-hls.md)

Winlin 2014.4

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/sample-http)


