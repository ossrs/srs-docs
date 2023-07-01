---
title: HTTP Server
sidebar_label: HTTP Server 
hide_title: false
hide_table_of_contents: false
---

# SRS Embeded HTTP Server

SRS Embeded a HTTP web server, supports api and simple HTTP file for HLS.

To deploy SRS HTTP server, read [Usage: HTTP](./sample-http.md)

The SRS Embeded HTTP server is rewrite refer to go http module, so it's ok to use srs as http server. Read [#277](https://github.com/ossrs/srs/issues/277)

> Remark: The SRS HTTP server is just a origin HTTP server, for HTTP edge server, please use NGINX, SQUID and ATS.

## Use Scenario

The SRS Embeded HTTP server is design to provides basic HTTP service, 
like the camera of mobile phone.

SRS should provides HTTP api, which is actually a embeded HTTP server.

Actually, RTMP is more complex than HTTP, so HTTP server on st is absolutely ok.
The HTTP Server in SRS1.0 is expirement, I will enhance it future.

## Config

Config the HTTP port and root.

```bash
# embeded http server in srs.
# the http streaming config, for HLS/HDS/DASH/HTTPProgressive
# global config for http streaming, user must config the http section for each vhost.
# the embed http server used to substitute nginx in ./objs/nginx,
# for example, srs runing in arm, can provides RTMP and HTTP service, only with srs installed.
# user can access the http server pages, generally:
#       curl http://192.168.1.170:80/srs.html
# which will show srs version and welcome to srs.
# @remeark, the http embeded stream need to config the vhost, for instance, the __defaultVhost__
# need to open the feature http of vhost.
http_server {
    # whether http streaming service is enabled.
    # default: off
    enabled         on;
    # the http streaming port
    # @remark, if use lower port, for instance 80, user must start srs by root.
    # default: 8080
    listen          8080;
    # the default dir for http root.
    # default: ./objs/nginx/html
    dir             ./objs/nginx/html;
}
```

And, each vhost can specifies the dir.

```bash
vhost your_vhost {
    # http static vhost specified config
    http_static {
        # whether enabled the http static service for vhost.
        # default: off
        enabled     on;
        # the url to mount to, 
        # typical mount to [vhost]/
        # the variables:
        #       [vhost] current vhost for http server.
        # @remark the [vhost] is optional, used to mount at specified vhost.
        # @remark the http of __defaultVhost__ will override the http_stream section.
        # for example:
        #       mount to [vhost]/
        #           access by http://ossrs.net:8080/xxx.html
        #       mount to [vhost]/hls
        #           access by http://ossrs.net:8080/hls/xxx.html
        #       mount to /
        #           access by http://ossrs.net:8080/xxx.html
        #           or by http://192.168.1.173:8080/xxx.html
        #       mount to /hls
        #           access by http://ossrs.net:8080/hls/xxx.html
        #           or by http://192.168.1.173:8080/hls/xxx.html
        # default: [vhost]/
        mount       [vhost]/hls;
        # main dir of vhost,
        # to delivery HTTP stream of this vhost.
        # default: ./objs/nginx/html
        dir         ./objs/nginx/html/hls;
    }
}
```

Remark: The `http_stream` of SRS1 renamed to `http_server` in SRS2, which specifies the global HTTP server config, used to delivery http static files, for dvr files(HLS/FLV/HDS/MPEG-DASH).

Remark: The `http` of vhost of SRS1 renamed to `http_static`, similar to global `http_server` for HTTP static files delivery. While the `http_remux` introduced in SRS2 is dynamic remux RTMP to HTTP Live FLV/Mp3/Aac/HLS/Hds/MPEG-DASH stream.

## MIME

Only some MIME is supported:

| File ext name | Content-Type |
| ------------- | -----------  |
| .ts | Content-Type: video/MP2T;charset=utf-8 |
| .m3u8 | Content-Type: application/x-mpegURL;charset=utf-8 |
| .json | Content-Type: application/json;charset=utf-8 |
| .css | Content-Type: text/css;charset=utf-8 |
| .swf | Content-Type: application/x-shockwave-flash;charset=utf-8 |
| .js | Content-Type: text/javascript;charset=utf-8 |
| .xml | Content-Type: text/xml;charset=utf-8 |
| Others | Content-Type: text/html;charset=utf-8 |

## Method

Supported HTTP method:
* GET: Query API, or download file.

Winlin 2015.1

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v5/http-server)


