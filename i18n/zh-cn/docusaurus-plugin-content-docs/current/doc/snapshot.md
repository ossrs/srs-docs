---
title: Snapshot
sidebar_label: Snapshot 
hide_title: false
hide_table_of_contents: false
---

# Snapshot

截图有以下几种方式可以实现：

1. HttpCallback：使用HTTP回调，收到`on_publish`事件后开启ffmpeg进程截图，收到`on_unpublish`事件后停止ffmpeg进程。SRS提供了实例，具体参考下面的内容。
2. Transcoder：转码可以配置为截图，SRS提供了实例，具体参考下面的内容。

## HttpCallback

下面的实例使用Http回调截图。

先启动实例Api服务器：
```
python research/api-server/server.py 8085
```

SRS的配置如下：
```
# snapshot.conf
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;
vhost __defaultVhost__ {
    http_hooks {
        enabled on;
        on_publish http://127.0.0.1:8085/api/v1/snapshots;
        on_unpublish http://127.0.0.1:8085/api/v1/snapshots;
    }
    ingest {
        enabled on;
        input {
            type file;
            url ./doc/source.flv;
        }
        ffmpeg ./objs/ffmpeg/bin/ffmpeg;
        engine {
            enabled off;
            output rtmp://127.0.0.1:[port]/live?vhost=[vhost]/livestream;
        }
    }
}
```

启动SRS时，ingest将会推流，SRS会调用Api服务器的接口，开始截图：
```
./objs/srs -c snapshot.conf
```

截图生成的目录：
```
winlin:srs winlin$ ls -lh research/api-server/static-dir/live/*.png
-rw-r--r--  1 winlin  staff    73K Oct 20 13:35 livestream-001.png
-rw-r--r--  1 winlin  staff    91K Oct 20 13:35 livestream-002.png
-rw-r--r--  1 winlin  staff    11K Oct 20 13:35 livestream-003.png
-rw-r--r--  1 winlin  staff   167K Oct 20 13:35 livestream-004.png
-rw-r--r--  1 winlin  staff   172K Oct 20 13:35 livestream-005.png
-rw-r--r--  1 winlin  staff   264K Oct 20 13:35 livestream-006.png
lrwxr-xr-x  1 winlin  staff   105B Oct 20 13:35 livestream-best.png ->  livestream-006.png
```

其中，`live-livestream-best.png`会软链到尺寸最大的那个截图，避免生成黑屏的截图。

可以通过HTTP访问，譬如：[http://localhost:8085/live/livestream-best.png](http://localhost:8085/live/livestream-best.png)

## Transcoder

也可以使用Transcoder直接截图。SRS配置如下：

```
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;
vhost __defaultVhost__ {
    transcode {
        enabled on;
        ffmpeg ./objs/ffmpeg/bin/ffmpeg;
        engine snapshot {
            enabled on;
            iformat flv;
            vfilter {
                vf fps=1;
            }
            vcodec png;
            vparams {
                vframes 6;
            }
            acodec an;
            oformat image2;
            output ./objs/nginx/html/[app]/[stream]-%03d.png;
        }
    }
    ingest {
        enabled on;
        input {
            type file;
            url ./doc/source.flv;
        }
        ffmpeg ./objs/ffmpeg/bin/ffmpeg;
        engine {
            enabled off;
            output rtmp://127.0.0.1:[port]/live?vhost=[vhost]/livestream;
        }
    }
}
```

启动SRS就可以生成截图：
```
winlin:srs winlin$ ls -lh objs/nginx/html/live/*.png
-rw-r--r--  1 winlin  staff   265K Oct 20 14:52 livestream-001.png
-rw-r--r--  1 winlin  staff   265K Oct 20 14:52 livestream-002.png
-rw-r--r--  1 winlin  staff   287K Oct 20 14:52 livestream-003.png
-rw-r--r--  1 winlin  staff   235K Oct 20 14:52 livestream-004.png
-rw-r--r--  1 winlin  staff   315K Oct 20 14:52 livestream-005.png
-rw-r--r--  1 winlin  staff   405K Oct 20 14:52 livestream-006.png
```

注意：SRS没有办法选出最佳的截图。

Winlin 2015.10

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-5/doc/snapshot)


