---
title: WebRTC
sidebar_label: WebRTC
hide_title: false
hide_table_of_contents: false
---

# WebRTC

WebRTC是Google开源的在线实时通信的方案，简单来讲就是互联网音视频会议，由于是RFC标准协议，并且浏览器支持，
因此也不断的在拓展边界，应用在低延迟的音视频场景，比如在线会议、直播连麦、低延迟直播、远程机器人控制、远程桌面、
云游戏、智能门铃、直播的网页推流等。

WebRTC实际上是两个Web浏览器之间直接通信的标准，主要包含了信令(Signaling)和媒体(Media)两个部分的协议。
信令解决两个设备之间的能力的协商的问题，比如支持的编解码能力。媒体解决两个设备之间加密和低延迟媒体包传输的能力。
除此之外，WebRTC本身还实现了语言处理技术比如3A，网络拥塞控制比如NACK、FEC和GCC，音视频编解码，平滑和低延迟播放技术。

```bash
+----------------+                        +----------------+
+    Browser     +----<--Signaling----->--+    Browser     +
+ (like Chrome)  +----<----Media----->----+ (like Chrome)  +
+----------------+                        +----------------+
```

> Note: WebRTC已经是RFC正式标准，因此各种浏览器都已经支持，而开源的实现也很多，因此不限于浏览器，移动端的浏览器和
> Native库也有很多，因此为了沟通的简单起见，本文一般以浏览器指代所有支持WebRTC协议的客户端或设备。

实际上，在互联网上，两个浏览器几乎无法直接通信，特别是不在一个局域网，而且是在远距离跨城市甚至跨国家时，两个浏览器之间
传输数据会经过非常多的网络路由器和防火墙，因此传输质量无法保障。因此，实际应用是需要经过服务器中转，而WebRTC服务器有
几种类型：

* Signaling Server: 信令服务，两个浏览器之间交换SDP的服务。如果是多人会议，则需要提供房间服务，本质上都是为各个浏览器交换SDP。而在流媒体领域，为了可以使用WebRTC推流和播放，像推送和播放RTMP/SRT/HLS流一样，WHIP/WHEP协议被设计出来了。
* TURN Server: 转发服务，帮助两个浏览器之间转发媒体数据的服务。这是一种透明转发服务，并不会实现数据缓存，因此当多人会议时，浏览器之间需要传输`N*N + N*(N-2)`份数据。一般只应用在非常少的通信场景中，比如一对一。
* SFU Server: 选择性转发服务，服务器上有缓存数据，因此浏览器只需要上传一份数据，服务器会复制给其他参会者。SRS就是SFU，关于SFU的作用可以参考[这里](https://stackoverflow.com/a/75491178/17679565)。目前主要的WebRTC服务器都是SFU服务器，会有`N*N`份流传输，比TURN少`N*(N-2)`份上行数据传输，能解决大部分的传输问题。
* MCU Server: 多点控制服务，服务器将会议中的流合并成一路，这样浏览器只需要传输`N*2`份数据，上传一路下载一路数据。但由于需要编解码，服务器支持的流的数量比SFU要少一个量级，只有在某些特定场景才会采用，具体参考[#3625](https://github.com/ossrs/srs/discussions/3625)

我们重点介绍SFU的工作流，因为SFU是在WebTC服务器中使用最多的，它本质上就是一个浏览器：

```bash
+----------------+                        +---------+
+    Browser     +----<--Signaling----->--+   SFU   +
+ (like Chrome)  +----<----Media----->----+  Server +
+----------------+                        +---------+
```

> Note: SFU一般都会有Signaling的能力，其实可以把RTMP地址也可以看成是一种非常简化的信令协议，只是WebRTC的信令需要协商
> 媒体和传输能力，所以比较复杂。在复杂的WebRTC系统中，可能有独立的Signaling和Room集群，但是SFU同样也会有简化的Signaling能力，
> 只是可能是用于和其他服务通信。

SRS是一个媒体服务器，提供了Signaling和SFU Server的能力。和其他SFU比如Janus不同的是，SRS是基于Stream的，尽管房间中
可以有多个参与者，本质上都是有人在推流，其他人在订阅这个流。这样可以避免将房间中的所有流，都耦合到一个SFU传输，可以分散到
多个SFU传输，这样可以支持更多人的会议。

SRS支持的Signaling就是WHIP和WHEP，具体请参考[HTTP API](#http-api)部分。和直播很不一样的是，由于Signaling和Media分离，
因此需要设置Candidate，详细参考[Candidate](#config-candidate)。Media默认使用UDP传输，若UDP不可用也可以用TCP参考
[TCP](#webrtc-over-tcp)。若遇到不可用的情况，很有可能是Candidate设置不对，也有可能是防火墙或端口不通，请参考
[Connectivity](#connection-failures)使用工具检查。SRS还支持了不同协议的转换，比如推流RTMP后用WebRTC观看参考
[RTMP to WebRTC](#rtmp-to-rtc)，或者用WebRTC推流后用HLS观看参考[RTC to RTMP](#rtc-to-rtmp)。

SRS是在2020年支持的WebRTC协议，研发的详细过程请参考[#307](https://github.com/ossrs/srs/issues/307)。

## Config

RTC的配置很多，详细配置参考`full.conf`，如下：

```bash
rtc_server {
    # Whether enable WebRTC server.
    # Overwrite by env SRS_RTC_SERVER_ENABLED
    # default: off
    enabled on;
    # The udp listen port, we will reuse it for connections.
    # Overwrite by env SRS_RTC_SERVER_LISTEN
    # default: 8000
    listen 8000;
    # For WebRTC over TCP directly, not TURN, see https://github.com/ossrs/srs/issues/2852
    # Some network does not support UDP, or not very well, so we use TCP like HTTP/80 port for firewall traversing.
    tcp {
        # Whether enable WebRTC over TCP.
        # Overwrite by env SRS_RTC_SERVER_TCP_ENABLED
        # Default: off
        enabled off;
        # The TCP listen port for WebRTC. Highly recommend is some normally used ports, such as TCP/80, TCP/443,
        # TCP/8000, TCP/8080 etc. However SRS default to TCP/8000 corresponding to UDP/8000.
        # Overwrite by env SRS_RTC_SERVER_TCP_LISTEN
        # Default: 8000
        listen 8000;
    }
    # The protocol for candidate to use, it can be:
    #       udp         Generate UDP candidates. Note that UDP server is always enabled for WebRTC.
    #       tcp         Generate TCP candidates. Fail if rtc_server.tcp(WebRTC over TCP) is disabled.
    #       all         Generate UDP+TCP candidates. Ignore if rtc_server.tcp(WebRTC over TCP) is disabled.
    # Note that if both are connected, we will use the first connected(DTLS done) one.
    # Overwrite by env SRS_RTC_SERVER_PROTOCOL
    # Default: udp
    protocol udp;
    # The exposed candidate IPs, response in SDP candidate line. It can be:
    #       *           Retrieve server IP automatically, from all network interfaces.
    #       $CANDIDATE  Read the IP from ENV variable, use * if not set.
    #       x.x.x.x     A specified IP address or DNS name, use * if 0.0.0.0.
    # @remark For Firefox, the candidate MUST be IP, MUST NOT be DNS name, see https://bugzilla.mozilla.org/show_bug.cgi?id=1239006
    # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/webrtc#config-candidate
    # Overwrite by env SRS_RTC_SERVER_CANDIDATE
    # default: *
    candidate *;
}

vhost rtc.vhost.srs.com {
    rtc {
        # Whether enable WebRTC server.
        # Overwrite by env SRS_VHOST_RTC_ENABLED for all vhosts.
        # default: off
        enabled on;
        # Whether support NACK.
        # default: on
        nack on;
        # Whether support TWCC.
        # default: on
        twcc on;
        # The timeout in seconds for session timeout.
        # Client will send ping(STUN binding request) to server, we use it as heartbeat.
        # default: 30
        stun_timeout 30;
        # The role of dtls when peer is actpass: passive or active
        # default: passive
        dtls_role passive;
        # Whether enable transmuxing RTMP to RTC.
        # If enabled, transcode aac to opus.
        # Overwrite by env SRS_VHOST_RTC_RTMP_TO_RTC for all vhosts.
        # default: off
        rtmp_to_rtc off;
        # Whether enable transmuxing RTC to RTMP.
        # Overwrite by env SRS_VHOST_RTC_RTC_TO_RTMP for all vhosts.
        # Default: off
        rtc_to_rtmp off;
    }
}
```

第一部分，`rtc_server`是全局的RTC服务器的配置，部分关键配置包括：
* `enabled`：是否开启RTC服务器，默认是off。
* `listen`：侦听的RTC端口，注意是UDP协议。
* `candidate`：服务器提供服务的IP地址，由于RTC的特殊性，必须配置这个地址。详细参考[Config: Candidate](./webrtc.md#config-candidate)
* `tcp.listen`: 使用TCP传输WebRTC媒体数据，侦听的TCP端口。详细参考[WebRTC over TCP](./webrtc.md#webrtc-over-tcp)

第二部分，每个vhost中的RTC配置，部分关键配置包括：
* `rtc.enabled`：是否开启RTC能力，默认是off。
* `rtc.rtmp_to_rtc`：是否开启RTMP转RTC。
* `rtc.rtc_to_rtmp`：是否开启RTC转RTMP。
* `rtc.stun_timeout`：会话超时时间，单位秒。
* `rtc.nack`：是否开启NACK的支持，即丢包重传，默认on。
* `rtc.twcc`：是否开启TWCC的支持，即拥塞控制的反馈机制，默认on。
* `rtc.dtls_role`：DTLS角色，active就是DTLS Client(主动发起)，passive是DTLS Server(被动接受)。

## Config Candidate

由于`candidate`特别、特别、特别的重要，大概有1/3的朋友的问题都是这个配置不对。只要`candidate`配置不对，一定会出问题，没有其他可能，是一定会出问题。

修改`candidate`的最简单方法是在URL中指定`eip`。例如，如果您的服务器是`192.168.3.10`，请使用此URL：

* [http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream&eip=192.168.3.10](http://localhost:8080/players/whip.html?eip=192.168.3.10)

此外，修改默认UDP端口`8000`的最简单、最直接方法（尤其是在负载均衡器或代理后面时）是使用`eip`。例如，如果您使用UDP`18000`作为端口，请考虑使用此URL：

* [http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream&eip=192.168.3.10:18000](http://localhost:8080/players/whip.html?eip=192.168.3.10:18000)

其实，`candidate`就是服务器的`候选地址`，客户端可以连接的地址`ip:port`，在SDP交换中，就有个`candidate`的信息，比如服务器回的answer可能是这样：

```bash
type: answer, sdp: v=0
a=candidate:0 1 udp 2130706431 192.168.3.6 8000 typ host generation 0
```

上面SDP中的`192.168.3.6 8000`，就是`candidate listen`这两个配置，即服务器的IP和端口。 既然是服务器的IP，那么目前有几种方式可以配置：
* 直接配置成固定的IP，比如：`candidate 192.168.3.6;`
* 用命令`ifconfig`获取本机的内网IP，通过环境变量传递给SRS，比如：`candidate $CANDIDATE;`
* 自动获取，先读取环境变量，然后获取本机网卡的IP，比如：`candidate *;`，下面会有详细说明。
* 在url中通过`?eip=x`指定，比如：`webrtc://192.168.3.6/live/livestream?eip=192.168.3.6`
* 若API和SRS是同一个服务器（默认就是），可以用API的hostname作为CANDIDATE，这种情况下面单独说明。

此外，自动获取本机网卡IP的情况，相关配置如下：
* `candidate *;`或`candidate 0.0.0.0;`，支持任意IP，就意味着让服务器自己选择，先选公网IP，然后选内网IP。
* `use_auto_detect_network_ip on;` 若关闭这个功能，则不会自动选择IP。
* `ip_family ipv4;` 自动选择IP时，选择IPv4还是IPv6的地址。

由于WebRTC推拉流之前，必须访问HTTP API交换SDP，因此在HTTP请求中的hostname一般就是SRS的公网域名或IP。相关配置如下：
* `api_as_candidates on;` 是否开启这个功能。若API是单独的服务器，可以关闭这个功能。
* `resolve_api_domain on;` 若API是域名，是否将域名解析为IP地址。注意Firefox不支持域名，所以一般是推荐打开的。
* `keep_api_domain on;` 是否保留API的域名，支持域名解析的客户端可以自己解析IP地址，避免服务器实现解析。

> Note: 注意，如果以上途径无法获取CANDIDATE，还是会自动选择一个网卡的IP，避免失败(无CANDIDATE一定失败)。

简单来说，如果在SRS运行的服务器上，运行`ifconfig`获取的IP地址，是客户端访问不了的地址， 就必须通过配置`candidate`，指定一个客户端能访问的地址。

通过`ifconfig`获取本机IP：

```bash
# For macOS
CANDIDATE=$(ifconfig en0 inet| grep 'inet '|awk '{print $2}')

# For CentOS
CANDIDATE=$(ifconfig eth0|grep 'inet '|awk '{print $2}')

# Directly set ip.
CANDIDATE="192.168.3.10"
```

设置环境变量，然后启动SRS：

```bash
env CANDIDATE="192.168.3.10" \
  ./objs/srs -c conf/rtc.conf
```

用Docker方式运行SRS，设置环境变量的方法：

```bash
export CANDIDATE="192.168.3.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  objs/srs -c conf/rtc.conf
```

> Note：Docker的详细用法参考[srs-docker](https://github.com/ossrs/dev-docker/tree/v4#usage)，
> 镜像地址和可用的版本参考[这里](https://hub.docker.com/r/ossrs/srs/tags)或[这里](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images)。

## Stream URL

在SRS中，直播和WebRTC的基本概念都是流(Stream)，因此，流的URL定义有很高的概念一致性。参考下面SRS的几种不同协议的流地址，
安装完SRS后可以直接打开：

* 使用RTMP推流或播放: `rtmp://localhost/live/livestream`
* 使用HTTP-FLV播放流: [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html)
* 使用HLS播放流: [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?stream=livestream.m3u8)
* WebRTC推流: [http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream](http://localhost:8080/players/whip.html)
* WebRTC播放: [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html)

> Remark: 由于Flash已经被禁用，RTMP流无法在Chrome播放，请使用VLC播放。

早期还没有WHIP和WHEP时，SRS支持过另外一种格式，只是HTTP API的格式不同，做的事情还是交换SDP。现在已经不推荐使用了：

* Publish: [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_publisher.html)
* Play: [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html)

> Note: 这里没有给出SRT的地址，因为SRT的地址设计并不是常见的URL格式。

## WebRTC over TCP

在很多网络条件下，WebRTC不适合使用UDP传输，因此支持TCP传输是极其重要的能力；而且SRS支持的是直接TCP传输的方式，避免使用TURN中转带来的额外网络层问题；这对于LoadBalancer也是非常友好的，一般支持TCP会更友好。

* HTTP API、HTTP Stream、WebRTC over TCP，可以全部复用一个TCP端口，比如HTTPS(443)。
* 支持直接UDP或TCP传输，不依赖TURN协议，没有额外的网元，没有额外部署和资源消耗。
* 可部署在LoadBalancer后面(已实现)，可配合[Proxy(未实现)](https://github.com/ossrs/srs/issues/3138)或者[Cluster(未实现)](https://github.com/ossrs/srs/issues/2091)实现负载均衡和扩容。

> Note: 注意需要升级到`v5.0.60+`，若使用Docker也请先确认SRS的版本。

启动SRS，指定使用TCP传输WebRTC媒体，默认使用的是TCP(8000)端口：

```bash
docker run --rm -it -p 8080:8080 -p 1985:1985 -p 8000:8000 \
  -e CANDIDATE="192.168.3.82" \
  -e SRS_RTC_SERVER_TCP_ENABLED=on \
  -e SRS_RTC_SERVER_PROTOCOL=tcp \
  -e SRS_RTC_SERVER_TCP_LISTEN=8000 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:v5
```

或者使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

* 播放(WebRTC over TCP): [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true)
* 播放(HTTP FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true)
* 播放(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?stream=livestream.m3u8&autostart=true)

> Note: 我们使用环境变量开启配置，直接使用配置文件也可以的。

> Note: 我们使用独立的TCP端口，HTTP API(1985)，HTTP Stream(8080)，WebRTC over TCP(8000)，也可以选择全部复用HTTP Stream端口。

## HTTP API

SRS支持WHIP和WHEP协议。安装好SRS后，可以直接点击下面的地址测试：

* WebRTC推流: [http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream](http://localhost:8080/players/whip.html)
* WebRTC播放: [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html)

关于协议的具体实现细节，请参考[WHIP](./http-api.md#webrtc-publish)和[WHEP](./http-api.md#webrtc-play)。下面是交互图：

[![](/img/doc-whip-whep-workflow.png)](https://www.figma.com/file/fA75Nl6Fr6v8hsrJba5Xrn/How-Does-WHIP%2FWHEP-Work%3F?type=whiteboard&node-id=0-1)

如果是在Mac或Linux上安装SRS，可以通过localhost测试本机的SRS服务。但是若在Windows，或者远程Linux服务器，或者需要在其他
设备上测试，则必须使用HTTPS WHIP推流，而WHEP则依然可以HTTP。可以开启SRS的HTTPS参考[HTTPS API](./http-api.md#https-api)，
也可以使用Web服务器代理比如Nginx参考[HTTPS Proxy](./http-api.md#http-and-https-proxy)。

若需要测试是否HTTP API正常工作，可以使用`curl`工具，具体请参考[Connectivity Check](#connection-failures)。

## Connection Failures

一些开发者来到 SRS 社区寻求帮助，因为他们在使用 OBS WHIP 连接到在线 WHIP 服务器时遇到了错误。这是因为在线服务器必须使用 HTTPS，
而且 UDP 端口可能更容易获得。此外，由于隐私或网络问题，很难调试或登录到在线服务器。

因此，我们找到了一些方法来解决 OBS WHIP 中的连接失败问题，通常是由于 HTTPS API 设置或 UDP 端口不可用问题导致的。

使用 curl 测试 WHIP HTTP 或 HTTPS API：

```bash
curl "http://localhost:1985/rtc/v1/whip/?ice-ufrag=6pk11386&ice-pwd=l91z529147ri9163933p51c4&app=live&stream=livestream-$(date +%s)" \
  -H 'Origin: http://localhost' -H 'Referer: http://localhost' \
  -H 'Accept: */*' -H 'Content-type: application/sdp' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' \
  --data-raw $'v=0\r\na=group:BUNDLE 0 1\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:J8X7\r\na=ice-pwd:Dpq7/fW/osYcPeLsCW2Ek1JH\r\na=setup:actpass\r\na=mid:0\r\na=sendonly\r\na=msid:- audio\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=ssrc:3184534672 cname:stream\r\nm=video 9 UDP/TLS/RTP/SAVPF 106\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:J8X7\r\na=ice-pwd:Dpq7/fW/osYcPeLsCW2Ek1JH\r\na=setup:actpass\r\na=mid:1\r\na=sendonly\r\na=msid:- video\r\na=rtcp-mux\r\na=rtpmap:106 H264/90000\r\na=ssrc:512761356 cname:stream' \
  -v -k
```

> Note: 您可以将 `http://localhost` 替换为 `https://yourdomain.com` 以测试 HTTPS API。

> Note: 对于Oryx，您应该指定secret，所以请将`/rtc/v1/whip?ice-ufrag=`更改为`/rtc/v1/whip?secret=xxx&ice-ufrag=`之类的。

> Note: 你也可以使用`eip=ip`或者`eip=ip:port`，强制SRS改写candidate的配置。详细请参考 [CANDIDATE](#config-candidate) 的说明。

答案包含候选项，即 UDP 服务器 IP，例如 `127.0.0.1`：

```
a=candidate:0 1 udp 2130706431 127.0.0.1 8000 typ host generation 0
```

使用 `nc` 向 SRS WHIP 服务器发送 UDP 数据包：

```bash
echo -en "\x00\x01\x00\x50\x21\x12\xa4\x42\x74\x79\x6d\x7a\x41\x51\x2b\x2f\x4a\x4b\x77\x52\x00\x06\x00\x0d\x36\x70\x6b\x31\x31\x33\x38\x36\x3a\x4a\x38\x58\x37\x00\x00\x00\xc0\x57\x00\x04\x00\x01\x00\x0a\x80\x2a\x00\x08\xda\xad\x1d\xce\xe8\x95\x5a\x83\x00\x24\x00\x04\x6e\x7f\x1e\xff\x00\x08\x00\x14\x56\x8f\x1e\x1e\x4f\x5f\x17\xf9\x2e\xa1\xec\xbd\x51\xd9\xa2\x27\xe4\xfd\xda\xb1\x80\x28\x00\x04\x84\xd3\x5a\x79" \
  |nc -w 3 -u 127.0.0.1 8000 |od -Ax -c -t x1 |grep '000' && \
  echo "Success" || echo "Failed"
```

> Note: 您还可以使用 `nc` 或 [server.go](https://github.com/ossrs/srs/pull/3837) 作为测试的 UDP 服务器。

如果使用 SRS 作为 WHIP 服务器，应该响应：

```
0000000  001 001  \0   @   ! 022 244   B   t   y   m   z   A   Q   +   /
0000010    J   K   w   R  \0 006  \0  \r   6   p   k   1   1   3   8   6
0000020    :   J   8   X   7  \0  \0  \0  \0      \0  \b  \0 001 376   `
0000030    ầ  **  ** 027  \0  \b  \0 024 206 263   +   ŉ  ** 025   G 215
0000040    I 335   P   ^   "   7   }   N   ? 017 037 224 200   (  \0 004
0000050  303   < 250 272                                                
0000054
Success
```

> Note: 应为 SRS 5.0.191+，请参阅 [#3837](https://github.com/ossrs/srs/pull/3837)，您还可以使用
> [server.go](https://github.com/ossrs/srs/issues/2843) 作为测试的 UDP 服务器。

## RTMP to RTC

WebRTC可以作为直播的一个播放器，播放直播流，延迟比RTMP还要低，更能抗网络抖动。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  objs/srs -c conf/rtmp2rtc.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: SRS 4.0.14+支持RTMP推流，WebRTC播放。

相关的配置说明：

* `rtc.rtmp_to_rtc`：是否将RTMP转RTC。禁用时，推RTMP流无法使用WebRTC播放。开启时，音频转码为opus（一路流消耗2%左右CPU）。
* `rtc.keep_bframe`：是否保留B帧，RTMP流中一般会有B帧，而RTC没有，默认丢弃B帧。
* `min_latency`：如果开启了RTC，这个配置的默认值也是on，而RTMP这个的默认值是off。
* `play.mw_latency`：如果开启了RTC，这个配置的默认值是0。
* `play.mw_msgs`：如果开启RTC，`min_latency`开启默认为0，否则默认为1，比直播的默认值要小。

使用RTMP推流到本机：

```bash
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

可播放的流地址：

* WebRTC播放：[http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html?autostart=true)
* HTTP-FLV播放：[http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)

> Remark: 默认静音(H5自动播放要求的)，可以点右下角小喇叭开启声音。

## RTC to RTC

WebRTC本身是可以推流和拉流的，全链路延迟都很低。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  objs/srs -c conf/rtc.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: SRS 4.0.76+支持WebRTC推流，WebRTC播放。

演示，WebRTC推流和播放，链接：

* WebRTC推流: [http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream](http://localhost:8080/players/whip.html)
* WebRTC播放: [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html)

> Remark: 推流时，必须是HTTPS页面，当然本机localhost没这个限制。

## RTC to RTMP

WebRTC推流，可以转成RTMP流播放，SRS只会对音频转码（Opus转AAC），因此要求视频是H.264编码。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  objs/srs -c conf/rtc2rtmp.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Remark: SRS 4.0.95+支持WebRTC推流，RTMP/HTTP-FLV播放，参考[#2303](https://github.com/ossrs/srs/pull/2303)。

相关的配置说明：

* `rtc.rtc_to_rtmp`：是否开启RTC转RTMP，只会对音频转码（Opus转AAC），视频（H.264）不转码，默认off。
* `rtc.pli_for_rtmp`：请求关键帧的间隔，单位秒，RTC没有固定GOP，而RTMP一般需要，默认6.0。

演示，WebRTC推流和播放，链接：

* WebRTC推流: [http://localhost:1985/rtc/v1/whip/?app=live&stream=livestream](http://localhost:8080/players/whip.html)
* WebRTC播放: [http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream](http://localhost:8080/players/whep.html)
* HTTP-FLV播放：[http://localhost:8080/live/show.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=show.flv)
* RTMP流（可用VLC播放）：rtmp://localhost/live/show

## SFU: One to One

SRS早就具备了SFU的能力，比如一对一通话、[多人通话](./webrtc.md#sfu-video-room)、[直播连麦](./webrtc.md#room-to-live)等等。在沟通中，一对一是常用而且典型的场景，
让我们一起来看看如何用SRS做直播和RTC一体化的一对一通话。

> 下面以Docker中运行DEMO为例子，若希望从代码编译，请设置好对应的环境变量和启动命令。

本机启动SRS(参考[usage](https://github.com/ossrs/srs/tree/4.0release#usage))，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  objs/srs -c conf/rtc.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Note: More images and version is [here](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images).

> Note: Demo的H5页面，是在SRS镜像中的。

本机启动信令(参考[usage](https://github.com/ossrs/signaling#usage))，例如：

```bash
docker run --rm -p 1989:1989 registry.cn-hangzhou.aliyuncs.com/ossrs/signaling:1
```

> Note: More images and version is [here](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/signaling/images).

启动[httpx-static](https://github.com/ossrs/go-oryx/tree/develop/httpx-static#usage)，转换HTTPS和WSS协议：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm -p 80:80 -p 443:443 registry.cn-hangzhou.aliyuncs.com/ossrs/httpx:1 \
    ./bin/httpx-static -http 80 -https 443 -ssk ./etc/server.key -ssc ./etc/server.crt \
          -proxy http://$CANDIDATE:1989/sig -proxy http://$CANDIDATE:1985/rtc \
          -proxy http://$CANDIDATE:8080/
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

本机(localhost)可以直接打开[http://localhost/demos/one2one.html?autostart=true](http://localhost/demos/one2one.html?autostart=true)。

若非本机，则可以打开[https://192.168.3.6/demos/one2one.html?autostart=true](https://192.168.3.6/demos/one2one.html?autostart=true)。

> 注意：自签名证书，在空白处输入`thisisunsafe`（注意没空格）。

## SFU: Video Room

SRS支持多人通话的SFU能力，请参考[一对一通话](./webrtc.md#sfu-one-to-one)搭建环境，然后访问页面：

本机(localhost)可以直接打开[http://localhost/demos/room.html?autostart=true](http://localhost/demos/room.html?autostart=true)。

若非本机，则可以打开[https://192.168.3.6/demos/room.html?autostart=true](https://192.168.3.6/demos/room.html?autostart=true)。

> 注意：自签名证书，在空白处输入`thisisunsafe`（注意没空格）。

若需要会议转直播，请参考[RTC转直播](./webrtc.md#room-to-live)。

## Room to Live

上面我们介绍了[一对一通话](./webrtc.md#sfu-one-to-one)，如果能将这个通话合成一个流，叠加视频和混音，
转成RTMP流推送到直播，这就是连麦了。

> Note: [多人通话](./webrtc.md#sfu-video-room)也是可以转直播的，原理一样，只是多人通话的流更多。

注意请开启RTC转RTMP，我们合并的是RTMP流，例如：

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  objs/srs -c conf/rtc2rtmp.conf
```

> Note: 请将CANDIDATE设置为服务器的外网地址，详细请阅读[WebRTC: CANDIDATE](./webrtc.md#config-candidate)。

> Note: More images and version is [here](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/srs/images).

> Note: 请参考[一对一通话](./webrtc.md#sfu-one-to-one)启动Signaling和httpx-static。

视频合流非常非常消耗CPU，而且有很多种方式：
* SRS+FFmpeg，SRS将WebRTC流转RTMP，FFmpeg将多路RTMP合流。优势：延迟小，音质好；缺点是命令行难度高。
* SRS+OBS，方案和SRS+FFmpeg一样，不过用OBS来实现合流。优势：图形化界面更友好，音质好；缺点是延迟大有不同步风险较大。
* OBS抓浏览器，OBS直接捕获浏览器窗口和电脑的音频。优势：可见即所得，依赖少；缺点是音质不如前面的方案。

SRS+FFmpeg方案，我们在一对一通话的DEMO中，给出了使用FFmpeg合流的命令，比如：

```bash
ffmpeg -f flv -i rtmp://192.168.3.6/live/alice -f flv -i rtmp://192.168.3.6/live/314d0336 \
     -filter_complex "[1:v]scale=w=96:h=72[ckout];[0:v][ckout]overlay=x=W-w-10:y=H-h-10[out]" -map "[out]" \
     -c:v libx264 -profile:v high -preset medium \
     -filter_complex amix -c:a aac \
     -f flv rtmp://192.168.3.6/live/merge
```

输入：
* rtmp://192.168.3.6/live/alice
* rtmp://192.168.3.6/live/314d0336

输出：
* rtmp://192.168.3.6/live/merge

SRS+OBS可以添加多个MediaSource（媒体源），将File（文件）的勾选去掉，就可以输入上面的两个RTMP流。

OBS直接捕获浏览器，可以选择WindowCapature（窗口捕获），直接选择浏览器即可。

> Note: 转直播后，就可以使用SRS的直播录制（DVR）功能，将每个RTC流录下来，也可以录合并的流。

Winlin 2020.03

## IPv6

SRS（v7.0.67+）支持WebRTC协议的IPv6，实现双栈（IPv4/IPv6）操作，支持UDP和TCP媒体传输。这包括对WHIP/WHEP信令和通过IPv6进行媒体传输的支持。

IPv6支持在SRS检测到配置中的IPv6地址时自动启用。配置RTC服务器监听IPv6地址：

```bash
rtc_server {
    enabled on;
    # Listen on IPv6 for UDP media
    listen [::]:8000;

    # For WebRTC over TCP
    tcp {
        enabled on;
        listen [::]:8000;
    }

    # Configure IPv6 candidate
    candidate [2001:db8::1];
}

# HTTP API server for WHIP/WHEP over IPv6
http_api {
    enabled on;
    listen [::]:1985;
}

# HTTPS API server for secure WHIP/WHEP over IPv6
https_api {
    enabled on;
    listen [::]:1990;
    key ./conf/server.key;
    cert ./conf/server.crt;
}
```

通过IPv6使用WHIP发布：
- WHIP URL：`http://[::1]:1985/rtc/v1/whip/?app=live&stream=livestream`

通过IPv6使用WHEP播放：
- WHEP URL：`http://[::1]:1985/rtc/v1/whep/?app=live&stream=livestream`

通过HTTPS IPv6进行安全连接：

通过HTTPS IPv6使用WHIP发布：
- WHIP URL：`https://[::1]:1990/rtc/v1/whip/?app=live&stream=livestream`

通过HTTPS IPv6使用WHEP播放：
- WHEP URL：`https://[::1]:1990/rtc/v1/whep/?app=live&stream=livestream`

使用IPv6时，`candidate`配置对WebRTC连接至关重要：

```bash
rtc_server {
    # Use your server's IPv6 address
    candidate [2001:db8::1];

    # For dual-stack, you can specify both IPv4 and IPv6
    # candidate 192.168.1.100 [2001:db8::1];
}
```

SRS支持双栈WebRTC，允许IPv4和IPv6客户端同时连接：

```bash
rtc_server {
    enabled on;
    # Listen on both IPv4 and IPv6
    listen 8000 [::]:8000;

    # Configure candidates for both protocols
    candidate 192.168.1.100 [2001:db8::1];
}
```

这使得：
- IPv4客户端可以通过：`http://192.168.1.100:1985/rtc/v1/whip/`连接
- IPv6客户端可以通过：`http://[2001:db8::1]:1985/rtc/v1/whip/`连接

## Known Limitation: Initial Audio Loss

在推送WebRTC流时,您可能会注意到录制(DVR)、RTMP播放或HTTP-FLV流中**前4-6秒的音频丢失**。这是WebRTC音视频同步机制的**已知限制**,
而不是一个bug。

**根本原因**: WebRTC使用RTCP Sender Reports (SR)来同步音频和视频时间戳。当WebRTC流开始时,音频和视频RTP包会立即到达。
然而,SRS需要RTCP Sender Reports来计算用于同步音视频的正确时间戳。音视频同步计算需要**两个**RTCP Sender Reports来建立
RTP时间戳和系统时间之间的时序速率。所有`avsync_time <= 0`的RTP包(包括音频和视频)都会被**丢弃**,以避免直播源中的时间戳问题。
RTCP Sender Reports通常每2-3秒到达一次。在**第二个**SR到达后(约4-6秒),音视频同步速率被计算出来,数据包开始被接受。
如果DVR配置了`dvr_wait_keyframe on`,录制无论如何都会从第一个视频关键帧开始。视频关键帧通常每2-4秒到达一次,
因此当第一个关键帧到达时,音视频同步通常已经建立。然而,在同步建立之前到达的音频包会**永久丢失**。

**为什么不会修复**: 这是WebRTC音视频同步机制的**根本限制**。基于RTCP的音视频同步对WebRTC至关重要。
如果没有它,音频和视频时间戳将不对齐,导致整个流出现严重的同步问题。当前的设计优先考虑**正确的音视频同步**,
而不是捕获前几秒的内容。对于大多数直播场景来说,这是一个合理的权衡,因为流通常会持续较长时间(几分钟到几小时),
在开始时丢失4-6秒是可以接受的,而整个流的完美音视频同步是至关重要的。修复这个问题需要从根本上重新设计WebRTC的音视频同步机制,
这是极其复杂和有风险的。

**相关Issue**: [#4418](https://github.com/ossrs/srs/issues/4418), [#4151](https://github.com/ossrs/srs/issues/4151),
[#4076](https://github.com/ossrs/srs/issues/4076)

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/webrtc)


