---
title: SRT
sidebar_label: SRT
hide_title: false
hide_table_of_contents: false
---

# SRT

[SRT](https://github.com/Haivision/srt)，全称是Secure Reliable Transport，是Haivision推出的一个广播传输协议，主要是为了
替代RTMP，实际上OBS、vMix、FFmpeg等直播推流编码器都已经支持了SRT，在实际中有较大比例的用户使用SRT推流。

Adobe公司没有一直更新RTMP协议，也没有提交给标准组织比如RFC，因此很多新功能都没有支持，比如HEVC或Opus。
直到2023.03，终于[Enhanced RTMP](https://github.com/veovera/enhanced-rtmp)项目建立，开始支持了HEVC和AV1，
SRS和OBS已经支持了基于Enhanced RTMP的[HEVC](https://github.com/veovera/enhanced-rtmp/issues/4)编码。

由于SRT使用的封装是TS封装，因此对于新的Codec天然就支持。而SRT基于UDP协议，因此对于延迟和弱网传输，也比RTMP要好不少。
一般RTMP延迟在1到3秒以上，而SRT的延迟在300到500毫秒，而且在弱网下表现也很稳定。在广播电视l领域，由于长距离跨国跨地区
传输，或者户外广播时，网络不稳定，因此SRT比RTMP的优势会更明显。

SRT是SRS的核心协议，SRS早在2020年即支持了SRT协议，并且在2022年实现了SRT协程化，从而大幅提高了SRT和其他核心协议的一致性。
比如回调和API的支持，SRT和RTMP保持了非常高的一致性。

## Usage

SRS内置SRT的支持，可以用[docker](./getting-started.md)或者[从源码编译](./getting-started-build.md):

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
    ./objs/srs -c conf/srt.conf
```

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* HLS by SRS player: [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html)

SRS支持将SRT转换成其他协议，下面会详细描述。

## Config

SRT相关的配置如下：

```bash
srt_server {
    # whether SRT server is enabled.
    # Overwrite by env SRS_SRT_SERVER_ENABLED
    # default: off
    enabled on;
    # The UDP listen port for SRT.
    # Overwrite by env SRS_SRT_SERVER_LISTEN
    listen 10080;
    # For detail parameters, please read wiki:
    # @see https://ossrs.net/lts/zh-cn/docs/v5/doc/srt-params
    # @see https://ossrs.io/lts/en-us/docs/v5/doc/srt-params
    # The maxbw is the max bandwidth of the sender side.
    # 	-1: Means the biggest bandwidth is infinity.
    # 	 0: Means the bandwidth is determined by SRTO_INPUTBW.
    # 	>0: Means the bandwidth is the configuration value.
    # Overwrite by env SRS_SRT_SERVER_MAXBW
    # default: -1
    maxbw 1000000000;
    # Maximum Segment Size. Used for buffer allocation and rate calculation using packet counter assuming fully
    # filled packets. Each party can set its own MSS value independently. During a handshake the parties exchange
    # MSS values, and the lowest is used.
    # Overwrite by env SRS_SRT_SERVER_MSS
    # default: 1500
    mss 1500;
    # The timeout time of the SRT connection on the sender side in ms. When SRT connects to a peer costs time 
    # more than this config, it will be close.
    # Overwrite by env SRS_SRT_SERVER_CONNECT_TIMEOUT
    # default: 3000
    connect_timeout 4000;
	# The timeout time of SRT connection on the receiver side in ms. When the SRT connection is idle 
    # more than this config, it will be close.
    # Overwrite by env SRS_SRT_SERVER_PEER_IDLE_TIMEOUT
    # default: 10000
    peer_idle_timeout 8000;
    # Default app for vmix, see https://github.com/ossrs/srs/pull/1615
    # Overwrite by env SRS_SRT_SERVER_DEFAULT_APP
    # default: live
    default_app live;
	# The peerlatency is set by the sender side and will notify the receiver side.
    # Overwrite by env SRS_SRT_SERVER_PEERLATENCY
    # default: 0
    peerlatency 0;
	# The recvlatency means latency from sender to receiver.
    # Overwrite by env SRS_SRT_SERVER_RECVLATENCY
    # default: 120
    recvlatency 0;
	# This latency configuration configures both recvlatency and peerlatency to the same value.
    # Overwrite by env SRS_SRT_SERVER_LATENCY
    # default: 120
    latency 0;
	# The tsbpd mode means timestamp based packet delivery.
	# SRT sender side will pack timestamp in each packet. If this config is true,
	# the receiver will read the packet according to the timestamp in the head of the packet.
    # Overwrite by env SRS_SRT_SERVER_TSBPDMODE
    # default: on
    tsbpdmode off;
	# The tlpkdrop means too-late Packet Drop
	# SRT sender side will pack timestamp in each packet, When the network is congested,
	# the packet will drop if latency is bigger than the configuration in both sender side and receiver side.
	# And on the sender side, it also will be dropped because latency is bigger than configuration.
    # Overwrite by env SRS_SRT_SERVER_TLPKTDROP
    # default: on
    tlpktdrop off;
	# The send buffer size of SRT.
    # Overwrite by env SRS_SRT_SERVER_SENDBUF
    # default:  8192 * (1500-28)
    sendbuf 2000000;
	# The recv buffer size of SRT.
    # Overwrite by env SRS_SRT_SERVER_RECVBUF
    # default:  8192 * (1500-28)
    recvbuf 2000000;
    # The passphrase of SRT.
    # If passphrase is no empty, all the srt client must be using the correct passphrase to publish or play,
    # or the srt connection will reject. The length of passphrase must be in range 10~79.
    # @see https://github.com/Haivision/srt/blob/master/docs/API/API-socket-options.md#srto_passphrase.
    # Overwrite by env SRS_SRT_SERVER_PASSPHRASE
    # default: ""
    passphrase xxxxxxxxxxxx;
    # The pbkeylen of SRT.
    # The pbkeylen determined the AES encrypt algorithm, this option only allow 4 values which is 0, 16, 24, 32
    # @see https://github.com/Haivision/srt/blob/master/docs/API/API-socket-options.md#srto_pbkeylen.
    # Overwrite by env SRS_SRT_SERVER_PBKEYLEN
    # default: 0
    pbkeylen 16;
}
vhost __defaultVhost__ {
    srt {
        # Whether enable SRT on this vhost.
        # Overwrite by env SRS_VHOST_SRT_ENABLED for all vhosts.
        # Default: off
        enabled on;
        # Whether covert SRT to RTMP stream.
        # Overwrite by env SRS_VHOST_SRT_TO_RTMP for all vhosts.
        # Default: on
        srt_to_rtmp on;
    }
}
```

> Note: 这里只是推流和拉流的配置，还有些其他的配置是在其他地方的，比如RTMP转[HTTP-FLV](./flv.md#config)或HTTP-TS等。

SRT所有的配置参数，可以参考[libsrt](https://github.com/Haivision/srt/blob/master/docs/API/API-socket-options.md#list-of-options)文档。
下面列出SRS支持的和重要的参数：

* `tsbpdmode`, 按时间戳投递包模式(Timestamp based packet delivery), 给每一个报文打上时间戳，应用层读取时，会按照报文时间戳的间隔读取
* `latency`, 单位：ms(毫秒)。这个latency配置同时配置了recvlatency和peerlatency成同一个值。如果recvlatency配置，将使用recvlatency的配置；如果peerlatency配置，将使用peerlatency的配置。
* `recvlatency`, 单位：ms(毫秒)。这是接收方缓存时间长度，其包括报文从发送方出发，通过网络，接收方接收，直到上送给上层媒体应用。也就是说这个缓存时间长度，其应该大于RTT，并且要为多次丢包重传做好准备。
  * 低延时网络：如果应用对延时要求低，可以考虑配置的参数低于250ms(常人对音视频低于250ms的延时不会被影响)
  * 长距离，RTT比较大：因为传输距离长，RTT比较大，就不能配置太小的latency；或者是重要的直播，不要求低延时，但是要求无卡顿播放，无抖动；建议配置的latency >= 3*RTT, 因为其中包含丢包重传和ack/nack的周期。
* `peerlatency`, 单位：ms(毫秒)。是srt发送方设置peerlatency，告知接收方的latency buffer的时间长度应该是多少；如果接收方也配置了recvlatency，接收方就取两者中最大值作为latency buffer时间长度。
  * 低延时网络: 如果应用对延时要求低，可以考虑配置的参数低于250ms(常人对音视频低于250ms的延时不会被影响)
  * 长距离，RTT比较大: 因为传输距离长，RTT比较大，就不能配置太小的latency；或者是重要的直播，不要求低延时，但是要求无卡顿播放，无抖动；建议配置的latency >= 3*RTT, 因为其中包含丢包重传和ack/nack的周期。
* `tlpkdrop`, 是否丢弃太晚到达的包(Too-late Packet Drop), 因为srt是针对于音视频的传输协议，接收方是基于报文时间戳或编码bitrate来上送报文给上层应用的。也就是说，如果报文在接收方latency timeout后到达，报文也会应为太晚到达而被丢弃。在直播模式下，tlpkdrop默认是true，因为直播对延时要求高。
* `maxbw`, 单位: bytes/s, 最大的发送带宽。`-1`: 表示最大带宽为1Gbps；`0`: 由SRTO_INPUTBW的计算决定(不推荐在直播模式下设置为0)；`>0`: 带宽为bytes/s。
* `mss`, 单位: byte。单个发送报文最大的size。这个报文的大小指的是ip报文，其包含udp和srt协议报文的。
* `connect_timeout`，单位：ms(毫秒)，SRT建立连接超时时间。
* `peer_idle_timeout`, 单位：ms(毫秒)，SRT对端超时时间。
* `sendbuf`, 单位：byte, SRT发送buffer大小；
* `recvbuf`, 单位：byte, SRT接收buffer大小；
* `payloadsize`, 单位：byte, 因为srt承载的媒体数据是mpegts封装，而每个mpegts的最小包是188bytes，所以payloadsize是188的倍数，默认是1316bytes(188x7)
* `passphrase`, SRT连接密码，默认值为空(不加密)。SRT连接密码，长度10-79之间，客户端必须输入正确密码才能建连成功，否则连接将会被拒绝。
* `pbkeylen`, SRT密钥长度，默认值为0。推流加密key长度，仅可输入0/16/24/32，对应不同的密钥长度的AES加密。当设置了`passphrase`选项时才需要设置这个参数。
* `srt_to_rtmp` 是否开启SRT转换为RTMP，转换RTMP后才能以RTMP、HTTP-FLV和HLS等协议播放。

## Low Latency Mode

若你希望最低延迟，可以容忍偶然的丢包，则可以考虑这个配置。

> Note: 注意SRT针对丢包会有重传，只有网络非常糟糕时，非常迟到达或未到达的包，在开启了`tlpktdrop`时才会丢弃，导致花屏。

对于赛事、活动、电视制作等长距离推流，链路一般都是提前准备好，且独占稳定的。这类场景下，需要满足固定延迟，允许一定程度的丢包（极小概率）
一般会在推流开始前探测链路的RTT， 并作为依据进行配置SRT推拉流参数。

推荐配置如下，假设RTT是100ms：

```bash
srt_server {
    enabled on;
    listen 10080;
    connect_timeout 4000;
    peerlatency 300; # RTT * 3
    recvlatency 300; # RTT * 3
    latency 300; # RTT * 3
    tlpktdrop on;
    tsbpdmode on;
}
```

## High Quality Mode

若你希望最高质量，极小概率花屏也不能容忍，可以容忍延迟变大，则可以考虑这个配置。

在公网环境使用SRT，链路不稳定，RTT也会动态变化。对于低延迟直播场景，需要自适应延迟，而且一定不能丢包。

推荐配置如下：

```
srt_server {
    enabled on;
    listen 10080;
    connect_timeout 4000;
    peerlatency 0;
    recvlatency 0;
    latency 0;
    tlpktdrop off;
    tsbpdmode off;
}
```

> Note: 如果你使用了如上配置仍然花屏，请参考[FFmpeg patch](https://github.com/FFmpeg/FFmpeg/commit/9099046cc76c9e3bf02f62a237b4d444cdaf5b20)

## Video codec

当前支持H264和HEVC编码。 由于SRT协议传输媒体是MPEG-TS，TS对HEVC编码格式本来就是支持的，标准类型值为(streamtype)0x24，
所以SRT传输HEVC编码的视频格式是天然支持的，不需要做修改。

使用下面的命令，支持HEVC编码的推流：
```bash
ffmpeg -re -i source.mp4 -c:v libx265 -c:a copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

使用下面的命令，播放HEVC编码的播放：
```bash
ffplay 'srt://127.0.0.1:10080?streamid=#!::h=live/livestream,m=request'
```

## Audio codec

当前支持编码格式：
* AAC，支持采样率44100, 22050, 11025, 5512.

## FFmpeg push SRT stream

当使用FFmpeg推AAC音频格式的SRT流时, 建议在命令行里加上`-pes_payload_size 0`这个参数。这个参数会阻止合并多个AAC音频帧在一个PES包里,
这样可以减少延迟以及由于音视频同步问题.

FFmpeg命令行示例:

```bash
ffmpeg -re -i source.mp4 -c copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

## SRT URL

SRT的URL是反人类的设计，它使用的是YAML格式，而不是一般常见的URL定义。

先考虑SRS对于RTMP地址的定义，请参考 [RTMP URL](./rtmp-url-vhost.md) 的定义：

* 常规RTMP格式(无vhost)
    - `rtmp://hostip:port/app/stream`
    - 例子: `rtmp://10.111.1.100:1935/live/livestream`
    - 上面例子中app="live", stream="livestream"
* 复杂RTMP格式(有vhost)
    - `rtmp://hostip:port/app/stream?vhost=xxx`
    - 例子: `rtmp://10.111.1.100:1935/live/livestream?vhost=srs.com.cn`
    - 上面例子中vhost="srs.com.cn", app="live", stream="livestream"

无论是推流还是拉流，RTMP地址都是一个地址，RTMP是使用协议层的消息来确定的。`publish消息` 表示是对该url进行推流，
`play消息` 表示是对该url进行拉流。

SRT是四层传输协议，所以无法确定对某个srt url操作是推流还是拉流。 在SRT文档中有对推/拉流的推荐：[AccessControl.md](https://github.com/Haivision/srt/blob/master/docs/features/access-control.md)
关键方法是通过streamid参数来明确url的作用，streamid的格式符合YAML格式。

下面是一个SRT的URL，没有vhost的情况：
* 推流地址: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish`
* 拉流地址: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request`
* 对应的RTMP拉流地址为：`rtmp://127.0.0.1/live/livestream`

其中：
* `#!::`, 为开始，符合yaml格式标准。
* `r`, 映射到rtmp地址中的`app/stream`。
* `m`, `publish`表示推流, `request`表示拉流。

下面是SRT的URL，支持vhost的情况：
* 推流地址: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=publish`
* 拉流地址: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=request`
* 对应的RTMP地址为：`rtmp://127.0.0.1/live/livestream?vhost=srs.srt.com.cn`

其中：
* `h`, 映射到rtmp地址中的vhost

## SRT URL without streamid

有些设备不支持streamid的输入，或者不支持streamid里面的一些特殊符号，比如`!`,`#`,`,`等字符。
这种情况下，允许仅用`ip:port`进行推流，比如`srt://127.0.0.1:10080`。对于这种url，SRS会将
streamid默认为`#!::r=live/livestream,m=publish`。

也就是说，下面两个地址等价：
* `srt://127.0.0.1:10080`
* `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish`

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/srt)

