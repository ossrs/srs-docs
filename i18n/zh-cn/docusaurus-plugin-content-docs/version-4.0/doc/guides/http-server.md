---
title: Embeded HTTP Server
sidebar_label: Embeded HTTP Server 
hide_title: false
hide_table_of_contents: false
---

# SRS Embeded HTTP Server

SRS内嵌了一个web服务器，支持api和简单的文件分发。

部署和使用SRS的内嵌http服务器，参考：[Usage: HTTP](http://ossrs.net/srs.release/wiki/v4_CN_SampleHTTP)

SRS的内置HTTP服务器已经参考GO的HTTP模块重写，满足商用要求，可以当作web服务器使用。参考：[#277](https://github.com/ossrs/srs/issues/277)

> 备注：SRS只支持源站HTTP分发，边缘还是需要用Web服务器比如NGINX、SQUID或ATS等。

## Use Scenario

它的定位很简单：智能手机上的摄像头。

Nginx/Apache/lighthttpd等众多HTTP server大佬就是专业的单反，老长老长镜头了。
难道有了单反智能手机上就不能有摄像头？不会吧！而且必须有。所以不是要和nginx拼个你死我活，
定位不一样，就像fms内嵌apache一样（不过fms嵌得很烂），真的有必要而且方便。

为何srs不内嵌一个nginx呢？智能手机上能内嵌一个单反长镜头么？我去，那是怪物吧。
nginx14万行代码，巨大无比，srs才2万行，如何能内嵌呢？最核心的原因是：srs需要提供http的api，
方便外部管理和调用；这点往往都毫无异议，但是提到srs要内嵌web服务器，就都炸开锅啦。
OK，其实就是http的api稍微扩展点，支持读文件后发送给客户端。

srs会一如既往的保持最简单，http的代码不会有多少行，功能不会有几个，就支持简单的文件分发就足够了。可以：
* 只需要部署一个服务器就可以分发RTMP和HLS。
* SRS对于HLS/HDS/DASH的支持会更完善。
* SRS可以支持点播，动态转封装等。
* SRS依然可以用nginx作为反向代理，或者禁用这个选项，使用nginx分发。

实际上，RTMP协议本身比HTTP复杂很多，所以st来做http分发，没有任何不可以的地方，更何况只是做部分。所以，淡定～

## Config

需要配置全局的HTTP端口和根目录的路径。

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

同时，vhost上可以指定http配置（虚拟目录和vhost）：

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

注意：SRS1中的`http_stream`在SRS2改名为`http_server`，全局的server配置，即静态HTTP服务器，可用来分发dvr的HLS/FLV/HDS/MPEG-DASH等。

注意：SRS1中vhost的`http`在SRS2改名为`http_static`，和全局的`http_server`类似用来分发静态的文件。而SRS2新增的功能`http_remux`，用来动态转封装，将RTMP流转封装为 HTTP Live FLV/Mp3/Aac/Hls/Hds/MPEG-DASH流。

## MIME

支持少量的MIME，见下表。

| 文件扩展名 | Content-Type |
| ------------- | -----------  |
| .ts | Content-Type: video/MP2T;charset=utf-8 |
| .m3u8 | Content-Type: application/x-mpegURL;charset=utf-8 |
| .json | Content-Type: application/json;charset=utf-8 |
| .css | Content-Type: text/css;charset=utf-8 |
| .swf | Content-Type: application/x-shockwave-flash;charset=utf-8 |
| .js | Content-Type: text/javascript;charset=utf-8 |
| .xml | Content-Type: text/xml;charset=utf-8 |
| 其他 | Content-Type: text/html;charset=utf-8 |

## Method

支持的Method包括：
* GET: 下载文件。

Winlin 2015.1