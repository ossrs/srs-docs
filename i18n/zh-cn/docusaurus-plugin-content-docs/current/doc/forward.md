---
title: Forward
sidebar_label: Forward 
hide_title: false
hide_table_of_contents: false
---

# Forward For Small Cluster

srs定位为直播服务器，其中一项重要的功能是forward，即将服务器的流转发到其他服务器。

备注：SRS的边缘RTMP参考[Edge](./edge)，支持访问时回源，为大规模并发提供最佳解决方案。

注意：edge可以从源站拉流，也可以将流转发给源站。也就是说，播放edge上的流时，edge会回源拉流；推流到edge上时，edge会直接将流转发给源站。

注意：若只需要中转流给源站，不必用forward，直接使用edge模式即可。可以直接支持推流和拉流的中转，简单快捷。Forward应用于目标服务器是多个，譬如将一路流主动送给多路服务器；edge虽然配置了多台服务器，但是只用了一台，有故障时才切换。

注意：优先使用edge，除非知道必须用forward，才使用forward。

forward本身是用做热备，即用户推一路流上来，可以被SRS转发（或者转码后转发）到多个slave源站，CDN边缘可以回多个slave源，实现故障热备的功能，构建强容错系统。

转发的部署实例参考：[Usage: Forward](./sample-forward)

## Keywords

为了和edge方式区分，forward定义一次词汇如下：

* master：主服务器，编码器推流到这个服务器，或者用ingest流到服务器。总之，master就是主服务器，负责转发流给其他服务器。
* slave：从服务器，主服务器转发流到这个服务器。

如果结合edge集群方式，一般而言master和slave都是origin（源站服务器），edge边缘服务器可以从master或者slave回源取流。

实际上master和slave也可以是edge，但是不推荐，这种组合方式太多了，测试没有办法覆盖到。因此，强烈建议简化服务器的结构，只有origin（源站服务器）才配置转发，edge（边缘服务器）只做边缘。

## Config

可以参考`full.conf`中的`same.vhost.forward.srs.com`的配置：

```
vhost __defaultVhost__ {
    # forward stream to other servers.
    forward {
        # whether enable the forward.
        # default: off
        enabled on;
        # forward all publish stream to the specified server.
        # this used to split/forward the current stream for cluster active-standby,
        # active-active for cdn to build high available fault tolerance system.
        # format: {ip}:{port} {ip_N}:{port_N}
        destination 127.0.0.1:1936 127.0.0.1:1937;

        # when client(encoder) publish to vhost/app/stream, call the hook in creating backend forwarder.
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_forward",
        #           "server_id": "vid-k21d7y2",
        #           "client_id": "9o7g1330",
        #           "ip": "127.0.0.1",
        #           "vhost": "__defaultVhost__",
        #           "app": "live",
        #           "tcUrl": "rtmp://127.0.0.1:1935/live",
        #           "stream": "livestream",
        #           "param": ""
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       {
        #          "code": 0,
        #          "data": {
        #              "urls":[
        #                 "rtmp://127.0.0.1:19350/test/teststream"
        #              ]
        #          }
        #       }
        # PS: you can transform params to backend service, such as:
        #       { "param": "?forward=rtmp://127.0.0.1:19351/test/livestream" }
        #     then backend return forward's url in response.
        # if backend return empty urls, destanition is still disabled.
        # only support one api hook, format:
        #       backend http://xxx/api0
        backend http://127.0.0.1:8085/api/v1/forward;
    }
}
```

## Dynamic Forward

SRS支持动态Forward，从你的后端服务查询是否需要转发，以及转发的目标地址。

首先，配置`backend`，你的后端服务的地址：

```
vhost __defaultVhost__ {
    forward {
        enabled on;
        backend http://127.0.0.1:8085/api/v1/forward;
    }
}
```

当推流到SRS时，SRS会调用你的后端服务，请求Body如下：

```json
{
    "action": "on_forward",
    "server_id": "vid-k21d7y2",
    "client_id": "9o7g1330",
    "ip": "127.0.0.1",
    "vhost": "__defaultVhost__",
    "app": "live",
    "tcUrl": "rtmp://127.0.0.1:1935/live",
    "stream": "livestream",
    "param": ""
}
```

如果你的后端服务返回了urls，SRS会开始转发：

```json
{
   "code": 0,
   "data": {
       "urls":[
          "rtmp://127.0.0.1:19350/test/teststream"
       ]
   }
}
```

> Note: 如果urls为空数组，SRS不会转发。

关于动态Forward的信息，请参考[#1342](https://github.com/ossrs/srs/issues/1342)。

## For Small Cluster

forward也可以用作搭建小型集群。架构图如下：

```bash
                                   +-------------+    +---------------+
                               +-->+ Slave(1935) +->--+  Player(3000) +
                               |   +-------------+    +---------------+
                               |   +-------------+    +---------------+
                               |-->+ Slave(1936) +->--+  Player(3000) +
         publish       forward |   +-------------+    +---------------+
+-----------+    +--------+    |     192.168.1.6                       
|  Encoder  +-->-+ Master +-->-|                                       
+-----------+    +--------+    |   +-------------+    +---------------+
 192.168.1.3    192.168.1.5    +-->+ Slave(1935) +->--+  Player(3000) +
                               |   +-------------+    +---------------+
                               |   +-------------+    +---------------+
                               +-->+ Slave(1936) +->--+  Player(3000) +
                                   +-------------+    +---------------+
                                     192.168.1.7                          
```

下面是搭建小型集群的实例。

### Encoder

编码器使用FFMPEG推流。编码参数如下：

```bash
for((;;)); do\
    ./objs/ffmpeg/bin/ffmpeg -re -i doc/source.flv \
        -c copy -f flv rtmp://192.168.1.5:1935/live/livestream; \
done
```

### SRS-Master Server

SRS（192.168.1.5）的配置如下：

```bash
listen              1935;
pid                 ./objs/srs.pid;
max_connections     10240;
vhost __defaultVhost__ {
    forward {
        enabled on;
        destination 192.168.1.6:1935 192.168.1.6:1936 192.168.1.7:1935 192.168.1.7:1936;
    }
}
```

源站的流地址播放地址是：`rtmp://192.168.1.5/live/livestream`

将流forward到两个边缘节点上。

### SRS-Slave Server

Slave节点启动多个SRS的进程，每个进程一个配置文件，侦听不同的端口。

以192.168.1.6的配置为例，需要侦听1935和1936端口。

配置文件`srs.1935.conf`配置如下：

```bash
listen              1935;
pid                 ./objs/srs.1935.pid;
max_connections     10240;
vhost __defaultVhost__ {
}
```

配置文件`srs.1936.conf`配置如下：

```bash
listen              1936;
pid                 ./objs/srs.1936.pid;
max_connections     10240;
vhost __defaultVhost__ {
}
```

启动两个SRS进程：

```bash
nohup ./objs/srs -c srs.1935.conf >/dev/null 2>&1 &
nohup ./objs/srs -c srs.1936.conf >/dev/null 2>&1 &
```

播放器可以随机播放着两个流：
* `rtmp://192.168.1.6:1935/live/livestream`
* `rtmp://192.168.1.6:1936/live/livestream`

另外一个Slave节点192.168.1.7的配置和192.168.1.6一样。

### Stream in Service

此架构服务中的流为：

| 流地址 | 服务器 | 端口 | 连接数 |
| ---- | ----- | ----- | ------- |
| rtmp://192.168.1.6:1935/live/livestream | 192.168.1.6 | 1935 | 3000 |
| rtmp://192.168.1.6:1936/live/livestream | 192.168.1.6 | 1936 | 3000 |
| rtmp://192.168.1.7:1935/live/livestream | 192.168.1.7 | 1935 | 3000 |
| rtmp://192.168.1.7:1936/live/livestream | 192.168.1.7 | 1936 | 3000 |

这个架构每个节点可以支撑6000个并发，两个节点可以支撑1.2万并发。
还可以加端口，可以支持更多并发。

## Forward VS Edge

Forward架构和CDN架构的最大区别在于，CDN属于大规模集群，边缘节点会有成千上万台，源站2台（做热备），还需要有中间层。CDN的客户很多，流也会有很多。所以假若源站将每个流都转发给边缘，会造成巨大的浪费（有很多流只有少数节点需要）。

可见，forward只适用于所有边缘节点都需要所有的流。CDN是某些边缘节点需要某些流。

forward的瓶颈在于流的数目，假设每个SRS只侦听一个端口：

```bash
系统中流的数目 = 编码器的流数目 × 节点数目 × 端口数目
```

考虑5个节点，每个节点起4个端口，即有20个SRS边缘。编码器出5路流，则有`20 * 5 = 100路流`。

同样的架构，对于CDN的边缘节点来讲，系统的流数为`用户访问边缘节点的流`，假设没有用户访问，系统中就没有流量。某个区域的用户访问某个节点上的流，系统中只有一路流，而不是forward广播式的多路流。

另外，forward需要播放器随机访问多个端口，实现负载均衡，或者播放器访问api服务器，api服务器实现负载均衡，对于CDN来讲也不合适（需要客户改播放器）。

总之，forward适用于小型规模的集群，不适用于CDN大规模集群应用。

## Other Use Scenarios

forward还可以结合hls和transcoder功能使用，即在源站将流转码，然后forward到Slave节点，Slave节点支持rtmp同时切HLS。

因为用户推上来的流，或者编码器（譬如FMLE）可能不是h264+aac，需要先转码为h264+aac（可以只转码音频）后才能切片为hls。

需要结合vhost，先将流transcode送到另外一个vhost，这个vhost将流转发到Slave。这样可以只转发转码的流。

参考vhost，hls和transcoder相关wiki。

Winlin 2014.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-5/doc/forward)


