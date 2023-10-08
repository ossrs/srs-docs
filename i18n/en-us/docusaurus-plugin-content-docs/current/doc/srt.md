---
title: SRT
sidebar_label: SRT
hide_title: false
hide_table_of_contents: false
---

# SRT

SRT (Secure Reliable Transport) is a broadcasting protocol created by Haivision to replace RTMP. Many live streaming 
encoders like OBS, vMix, and FFmpeg already support SRT, and many users prefer it for streaming.

Adobe hasn't been updating the RTMP protocol or submitting it to standard organizations like RFC, so it doesn't support
many new features like HEVC or Opus. In March 2023, the Enhanced RTMP project was created, which now supports HEVC and 
AV1. SRS and OBS also support HEVC encoding based on Enhanced RTMP.

Since SRT uses TS encapsulation, it naturally supports new codecs. SRT is based on the UDP protocol, so it has lower 
latency and better performance on weak networks than RTMP. RTMP latency is usually 1-3 seconds, while SRT latency is 
300-500 milliseconds. SRT is more stable on weak networks, making it better for long-distance and outdoor broadcasting.

SRT is a core protocol of SRS. SRS has supported SRT since 2020 and improved its consistency with other core protocols
in 2022. SRT and RTMP have very high consistency in terms of callbacks and API support.

## Usage

SRS has built-in support for SRT and can be used with [docker](./getting-started.md) or [compiled from source](./getting-started-build.md):

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 -p 10080:10080/udp ossrs/srs:5 \
  ./objs/srs -c conf/srt.conf
```

Use [FFmpeg(click to download)](https://ffmpeg.org/download.html) or [OBS(click to download)](https://obsproject.com/download) to push the stream:

```bash
ffmpeg -re -i ./doc/source.flv -c copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

Open the following page to play the stream (if SRS is not on your local machine, replace localhost with the server IP):

* HLS by SRS player: [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html)

SRS supports converting SRT to other protocols, which will be described in detail below.

## Config

The configuration for SRT is as follows:

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

> Note: These configurations are for publish and play. Note that there are some other configurations in other sections,
for example, converting RTMP to [HTTP-FLV](./flv.md#config) or HTTP-TS.

All SRT configuration parameters can be found in the [libsrt](https://github.com/Haivision/srt/blob/master/docs/API/API-socket-options.md#list-of-options) documentation. Below are the important parameters supported by SRS:

* `tsbpdmode`: Timestamp-based packet delivery mode. Each packet gets a timestamp, and the application reads them at the interval specified by the timestamps.
* `latency`: In milliseconds (ms). This configures both recvlatency and peerlatency to the same value. If recvlatency is set, it will be used; if peerlatency is set, it will be used.
* `recvlatency`: In milliseconds (ms). This is the receiver's buffer time length, including the time it takes for a packet to travel from the sender, through the network, to the receiver, and finally to the media application. This buffer time should be greater than RTT and prepared for multiple packet retransmissions.
    * Low-latency networks: If the application requires low latency, consider setting the parameter to less than 250ms (human perception is not affected by audio/video latency below 250ms).
    * Long-distance, high RTT: If the transmission distance is long and RTT is high, a small latency cannot be set. For important live broadcasts that don't require low latency but need smooth playback without jitter, set latency >= 3*RTT, as this includes packet retransmission and ack/nack cycles.
* `peerlatency`: In milliseconds (ms). This is the sender's setting for peerlatency, telling the receiver how long the latency buffer should be. If the receiver also sets recvlatency, the receiver will use the larger of the two values as the latency buffer length.
    * Low-latency networks: Same recommendations as for `recvlatency`.
    * Long-distance, high RTT: Same recommendations as for `recvlatency`.
* `tlpkdrop`: Whether to drop too-late packets. Since SRT is designed for audio/video transmission, the receiver sends packets to the application based on timestamps or encoding bitrate. If a packet arrives too late at the receiver (after latency timeout), it will be dropped. In live mode, tlpkdrop is true by default, as live broadcasts require low latency.
* `maxbw`: In bytes/s, the maximum sending bandwidth. `-1`: Maximum bandwidth is 1Gbps; `0`: Determined by SRTO_INPUTBW calculation (not recommended for live mode); `>0`: Bandwidth in bytes/s.
* `mss`: In bytes, the maximum size of a single sent packet. This refers to the size of IP packets, including UDP and SRT protocol packets.
* `connect_timeout`: In milliseconds (ms), the SRT connection timeout.
* `peer_idle_timeout`: In milliseconds (ms), the SRT peer timeout.
* `sendbuf`: In bytes, the SRT send buffer size.
* `recvbuf`: In bytes, the SRT receive buffer size.
* `payloadsize`: In bytes, the payload size is a multiple of 188 (the minimum size of an MPEG-TS packet), defaulting to 1316 bytes (188x7).
* `passphrase`: The SRT connection password, default is empty (no encryption). The password must be between 10-79 characters long, and the client must enter the correct password to connect successfully, or the connection will be rejected.
* `pbkeylen`: The SRT encryption key length, default is 0. The stream encryption key length can be 0/16/24/32, corresponding to different AES encryption key lengths. This parameter needs to be set when the `passphrase` option is set.
* `srt_to_rtmp`: Whether to enable SRT to RTMP conversion. After converting to RTMP, it can be played using RTMP, HTTP-FLV, and HLS protocols.

## Low Latency Mode

If you want the lowest latency and can tolerate occasional packet loss, consider this setting.

> Note: Keep in mind that SRT will retransmit lost packets. Only when the network is very bad, and packets arrive very late or not at all, will they be discarded with `tlpktdrop` enabled, causing screen glitches.

For events, activities, and TV production with long-distance streaming, the link is usually prepared in advance and is stable and dedicated. In these scenarios, a fixed latency is required, allowing a certain degree of packet loss (very low probability). Generally, the RTT of the link is detected before the stream starts and is used as a basis for configuring SRT streaming parameters.

The recommended configuration is as follows, assuming an RTT of 100ms:

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

If you want the highest quality and can't tolerate even a small chance of screen glitches, but can accept increased latency, consider this configuration.

When using SRT on public networks, the connection can be unstable, and RTT (Round Trip Time) may change dynamically. For low-latency live streaming, you need adaptive latency and must not lose packets.

Recommended settings are as follows:

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

> Note: If you still experience screen glitches with the above settings, please refer to the [FFmpeg patch](https://github.com/FFmpeg/FFmpeg/commit/9099046cc76c9e3bf02f62a237b4d444cdaf5b20).

## Video codec

Currently, H264 and HEVC encoding are supported. Since SRT protocol transfers media in MPEG-TS format, which already supports HEVC encoding (streamtype 0x24), SRT can naturally transmit HEVC encoded video without any modifications.

To stream with HEVC encoding, use the following command:
```bash
ffmpeg -re -i source.mp4 -c:v libx265 -c:a copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

To play HEVC encoded video, use the following command:
```bash
ffplay 'srt://127.0.0.1:10080?streamid=#!::h=live/livestream,m=request'
```

## Audio codec

Currently supported encoding formats:
* AAC, with sample rates of 44100, 22050, 11025, and 5512.

## FFmpeg push SRT stream

When using FFmpeg to push AAC audio format SRT stream, it is recommended to add the `-pes_payload_size 0` parameter in the command line. This parameter prevents multiple AAC audio frames from being combined into one PES package, reducing latency and audio-video synchronization issues.

FFmpeg command line example:

```bash
ffmpeg -re -i source.mp4 -c copy -pes_payload_size 0 -f mpegts \
  'srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish'
```

## SRT URL

SRT URL uses YAML format, which is different from the common URL definition.

Consider the SRS definition for RTMP address, please refer to [RTMP URL](./rtmp-url-vhost.md) definition:

* Regular RTMP format (without vhost)
    - `rtmp://hostip:port/app/stream`
    - Example: `rtmp://10.111.1.100:1935/live/livestream`
    - In this example, app="live", stream="livestream"
* Complex RTMP format (with vhost)
    - `rtmp://hostip:port/app/stream?vhost=xxx`
    - Example: `rtmp://10.111.1.100:1935/live/livestream?vhost=srs.com.cn`
    - In this example, vhost="srs.com.cn", app="live", stream="livestream"

Whether it is streaming or playing, the RTMP address is a single address, and RTMP uses protocol layer messages to determine it. `publish message` means streaming to the URL, and `play message` means playing the URL.

SRT is a transport layer protocol, so it cannot determine whether the operation on an SRT URL is streaming or playing. The SRT documentation has recommendations for streaming/playing: [AccessControl.md](https://github.com/Haivision/srt/blob/master/docs/features/access-control.md)
The key method is to use the streamid parameter to clarify the purpose of the URL, and the streamid format complies with the YAML format.

Here is an SRT URL without vhost:
* Streaming address: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish`
* Playing address: `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=request`
* Corresponding RTMP playing address: `rtmp://127.0.0.1/live/livestream`

Where:
* `#!::`, is the beginning, in line with the YAML format standard.
* `r`, maps to the `app/stream` in the RTMP address.
* `m`, `publish` means streaming, `request` means playing.

Here is an SRT URL with vhost support:
* Streaming address: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=publish`
* Playing address: `srt://127.0.0.1:10080?streamid=#!::h=srs.srt.com.cn,r=live/livestream,m=request`
* Corresponding RTMP address: `rtmp://127.0.0.1/live/livestream?vhost=srs.srt.com.cn`

Where:
* `h`, maps to the vhost in the RTMP address

## SRT URL without streamid

Some devices do not support streamid input or do not support some special characters in streamid, such as `!`, `#`, `,`, etc. In this case, you can use only `ip:port` for streaming, such as `srt://127.0.0.1:10080`. For this URL, SRS will set the streamid to `#!::r=live/livestream,m=publish` by default.

In other words, the following two addresses are equivalent:
* `srt://127.0.0.1:10080`
* `srt://127.0.0.1:10080?streamid=#!::r=live/livestream,m=publish`


![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/en/v6/srt)

