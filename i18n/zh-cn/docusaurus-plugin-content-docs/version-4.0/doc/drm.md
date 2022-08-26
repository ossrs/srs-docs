---
title: DRM
sidebar_label: DRM
hide_title: false
hide_table_of_contents: false
---

# DRM

DRM重要的功能就是防盗链，只有允许的用户，才能访问服务器的流。有多种DRM的方式：
* refer防盗链：检查用户从哪个网站过来的。譬如不是从公司的页面过来的人都不让看。
* token防盗链：用户在播放时，必须先申请token，SRS会回调http检查这个token合法性。
* FMS token tranverse：边缘RTMP服务器收到每个连接，都去上行节点验证，即token穿越认证。
* Access服务器：专门的access服务器负责DRM。譬如adobe的access服务器。
* 推流认证：adobe的RTMP推流时，支持几种认证方式，这个也可以归于防盗链概念。

## Refer Authentication

SRS支持refer防盗链，adobe的flash在播放RTMP流时，会把页面的http url放在请求中，
as客户端代码不可以更改。当然如果用自己的客户端，不用flash播放流，就可以随意伪造了；
尽管如此，refer防盗链还是能防住相当一部分盗链。

配置Refer防盗链，在vhost中开启refer即可，可以指定publish和play的refer：

```bash
# the vhost for antisuck.
vhost refer.anti_suck.com {
    # refer hotlink-denial.
    refer {
        # whether enable the refer hotlink-denial.
        # default: off.
        enabled         on;
        # the common refer for play and publish.
        # if the page url of client not in the refer, access denied.
        # if not specified this field, allow all.
        # default: not specified.
        all           github.com github.io;
        # refer for publish clients specified.
        # the common refer is not overrided by this.
        # if not specified this field, allow all.
        # default: not specified.
        publish   github.com github.io;
        # refer for play clients specified.
        # the common refer is not overrided by this.
        # if not specified this field, allow all.
        # default: not specified.
        play      github.com github.io;
    }
}
```

备注：SRS1/2的Refer配置方法和SRS3不一致，SRS3兼容SRS1/2的配置方法。

## Token Authentication

token类似于refer，不过是放在URL中，在请求参数中，譬如：

```
rtmp://vhost/app/stream?token=xxxx
http://vhost/app/stream.flv?token=xxxx
http://vhost/app/stream.m3u8?token=xxxx
webrtc://vhost/app/stream?token=xxxx
```

这样服务器在`on_publish`或`on_play`回调接口中， 就会把url带过去验证。参考：[HTTP callback](./http-callback)

token比refer更强悍，可以指定超时时间，可以变更token之类。可惜就是需要服务器端做定制，做验证。
SRS提供http回调来做验证，已经有人用这种方式做了，比较简单靠谱。

举个常用的token认证的例子：

1. 用户在web页面登录，服务器可以生成一个token，譬如：`token=md5(time+id+私钥+有效期)=88195f8943e5c944066725df2b1706f8`
1. 服务器返回给用户一个地址，带token，譬如：`rtmp://192.168.1.10/live/livestream?time=1402307089&expire=3600&token=88195f8943e5c944066725df2b1706f8`
1. 配置srs的http回调，`on_publish http://127.0.0.1:8085/api/v1/streams;` ，参考：[HTTP callback](./http-callback#config-srs)
1. 用户推流时，srs会回调那个地址，解析请求的内容，里面的params就有那些认证信息。
1. 按同样的算法验证，如果md5变了就返回错误，srs就会拒绝连接。如果返回0就会接受连接。

> Note: 这是验证推流的，也可以验证播放。

## TokenTraverse

Token防盗链的穿越，指的是在origin-edge集群中，客户播放edge边缘服务器的流时，
边缘将认证的token发送给源站进行验证，即token穿越。

FMS的edge和FMS的origin使用私有协议，使用一个连接回源取数据，一个连接回源传输控制命令，
譬如token穿越就是在这个连接做的。参考：https://github.com/ossrs/srs/issues/104

token认证建议使用http方式，也就是说客户端连接到边缘时，边缘使用http回调方式验证token。
像fms那种token穿越，是需要走RTMP协议，其他开源服务器一般都不支持这种方式（中国特色）。

SRS可以支持类似fms的token穿越，不过实现方式稍微有区别，不是采用fms edge的私有协议，
而是每次新开一个连接回源验证，验证通过后边缘才提供服务。也就是边缘先做一个完全的代理。

SRS这种方式的特点是：
* 在token认证上，能和fms源站对接，fms源站感觉不到什么区别。
* 每次边缘都会新开连接去验证，开销会大一些；而且只限于connect事件验证，马上验证过后就会收到disconnect事件。
* 会导致源站的短连接过多（连接验证token，断开），不过可以加一层fms edge解决，这样比所有都是fms edge要好。

对于源站短连接过多的问题，可以加一层fms边缘缓解，假设1000个客户端连接到边缘：
* srs => 客户fms 这种方案，会有1000个连接去回源验证，然后断开。
* srs => cdn-fms => 客户fms 这种方案，会有1000个连接去cdn的fms去验证，只有1个连接去客户那边验证。

SRS的token穿越(traverse)的配置，参考`edge.token.traverse.conf`：

```bash
listen              1935;
vhost __defaultVhost__ {
    cluster {
        mode            remote;
        origin          127.0.0.1:19350;
        token_traverse  on;
    }
}
```

## Access服务器

SRS暂时不支持。

## 推流认证

SRS暂时不支持，是RTMP特殊的握手协议。

Winlin 2015.8

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v4/drm)


