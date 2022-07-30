---
title: SRT Params
sidebar_label: SRT Params
hide_title: false
hide_table_of_contents: false
---

# SRT Config

There are some important parameters about stream transport in SRT. SRS support configures those parameters. <br/>
For more detail about SRT, please see [SRT wiki](v5_EN_SRTParams)
> Note: [all options in libSRT](https://github.com/Haivision/srt/blob/master/docs/API/API-socket-options.md#list-of-options)

## How to config SRT

In srs config file, srt_server have indenpendent config block as below: <br/>
```
srt_server {
    enabled on;
    listen 10080;
    maxbw 1000000000;
    connect_timeout 4000;
    peerlatency 300;
    recvlatency 300;
    mix_correct on;
}
```
Srt config block is in block of srt_server.
Now let's see all of the SRT parameters and what's the meaning of them.

### latency

Unit: millisecond，default value 120ms. <br/>
This latency configuration configures both recvlatency and peerlatency to the same value. <br/>
* If recvlatency is configured, the recvlatency configuration will be used;
* If peerlatency is configured, the peerlatency configuration will be used;

### recvlatency

Unit: millisecond，default value 120ms. <br/>
The recvlatency means latency from sender to receiver.<br/>
It must be bigger than RTT because the packet may retransmit serval times through the network. <br/>
Recommend config:
* Low latency network <br/>
  If your application cares about low latency, you can configure this parameter less than 250ms. <br/>
* Long distance, long RTT <br/>
  We must no configure small latency because of the long RTT; <br/>
  Or some important live stream, which doesn't care about low latency but requires play smooth; <br/>
  Recommend configure latency >= 3 * RTT, it include possible packet retransmit and ack or nack of the packets; <br/>


### peerlatency

Unit: millisecond，default value 120ms. <br/>
The peerlatency is set by the sender side and will notify the receiver side.<br/>
If the receiver side set recvlatency also, it will get the max value of peerlatency and recvlatency. <br/>
Recommend config:
* Low latency network <br/>
  If your application cares about low latency, you can configure this parameter to less than 250ms.
* Long distance, long RTT <br/>
  We must not configure small latency because of the long RTT; <br/>
  Or some important live stream, which doesn't care about low latency but requires play smooth; <br/>
  Recommend configure latency >= 3 * RTT, it include possible packet retransmit and ack or nack of the packets; <br/>

### tlpkdrop

true or false，default value true <br/>
The tlpkdrop means too-late Packet Drop<br/>
SRT sender side will pack timestamp in each packet, When the network is congested, <br/>
the packet will drop if latency is bigger than the configuration in both sender side and receiver side.<br/>
And on the sender side, it also will be dropped because latency is bigger than configuration.

### tsbpdmode

true or false，default value true <br/>
The tsbpd mode means timestamp based packet delivery.<br/>
SRT sender side will pack timestamp in each packet. If this config is true, <br/>
the receiver will read the packet according to the timestamp in the head of the packet. <br/>

### maxbw

Unit: bytes/s, default value -1(means infinite) <br/>
-  The maxbw is the max bandwidth of the sender side.
- `-1`: Means the biggest bandwidth is infinity.
- `0`: Means the bandwidth is determined by SRTO_INPUTBW.
- `>0`: Means the bandwidth is the configuration value.

### mss

Unit: bytes, default value 1500 <br/>
The max segment size of SRT, in IP layer. <br/>

### connect_timeout

Unit: millisecond, default value 3000ms. <br/>
The timeout time of the SRT connection on the sender side. When SRT connects to a peer costs time more than this config, it will be close.

### peer_idle_timeout

Unit: millisecond, default value 10000ms. <br/>
The timeout time of SRT connection on the receiver side. When the peer SRT connection is idle more than this config, it will be close.

### sendbuf

Unit: bytes, default value 8192 * (1500-28). <br/>
The send buffer size of SRT.

### recvbuf

Unit: bytes, default value 8192 * (1500-28). <br/>
The recv buffer size of SRT.

### payloadsize

Unit: bytes, default value 1316(188x7) <br/>
Because we use MPEG-TS over SRT, and MPEG-TS packet size is n times 188 bytes. <br/>
So we must configure payload size n times 188, and the default size is 1316(188x7) bytes.


# Recommend SRT config
### Latency first

Delay first, allow packet loss.
In case of contest live, TV content production, we always prepare a link which is stable and exclusive. <br/>
And we care about latency in those case, and allow some loss packets. <br/>
We will detect the RTT of link before we start publish, and using the result RTT to configure SRT parameters. <br/>
The recommended configuration is below <br/>
```
srt_server {
    enabled on;
    listen 10080;
    connect_timeout 4000;
    peerlatency RTT * 3;
    recvlatency RTT * 3;
    latency RTT * 3;
    tlpktdrop on;
    tsbpdmode on;
}
```


### Common Live
Latency adaptive, no packet loss allowed. When we use SRT on the internet, the network is unstable with RTT jitter and non-exclusive.<br/>
In this case, we must adapt to the latency, and must not loss packets to avoid play video artifacts.<br/>
The recommended configuration is below. <br/>

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
> Note: If you use the configuration above, but play video artifacts, please see [FFmpeg patch](https://github.com/FFmpeg/FFmpeg/commit/9099046cc76c9e3bf02f62a237b4d444cdaf5b20)

John 2022.5.24
