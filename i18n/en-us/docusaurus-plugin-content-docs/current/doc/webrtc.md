---
title: WebRTC
sidebar_label: WebRTC
hide_title: false
hide_table_of_contents: false
---

# WebRTC

https://github.com/ossrs/srs/issues/307

## Config

There are some config for WebRTC, please see `full.conf` for more:

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

The config `rtc_server` is global configuration for RTC, for example:
* `enabled`：Whether enable WebRTC server.
* `listen`：The udp listen port, we will reuse it for connections.
* `candidate`：The exposed candidate IPs, response in SDP candidate line. Please read [Config: Candidate](./webrtc.md#config-candidate) for detail.
* `tcp.listen`: Whether enable WebRTC over TCP. Please read [WebRTC over TCP](./webrtc.md#webrtc-over-tcp) for detail.

For each vhost, the configuration is `rtc` section, for example:
* `rtc.enabled`：Whether enable WebRTC server for this vhost.
* `rtc.rtmp_to_rtc`：Whether enable transmuxing RTMP to RTC.
* `rtc.rtc_to_rtmp`：Whether enable transmuxing RTC to RTMP.
* `rtc.stun_timeout`：The timeout in seconds for session timeout.
* `rtc.nack`：Whether support NACK for ARQ.
* `rtc.twcc`：Whether support TWCC for congestion feedback.
* `rtc.dtls_role`：The role of dtls when peer is actpass: passive or active.

## Config: Candidate

Please note that `candidate` is essential important, and most failure is caused by wrong `candidate`, so be careful.

As it shows, `candidate` is server IP to connect to, SRS will response it in SDP answer as `candidate`, like this one:

```bash
type: answer, sdp: v=0
a=candidate:0 1 udp 2130706431 192.168.3.6 8000 typ host generation 0
```

So the `192.168.3.6 8000` is an endpoint that client could access. There be some IP you can use:
* Config as fixed IP, such as `candidate 192.168.3.6;`
* Use `ifconfig` to get server IP and pass by environment variable, such as `candidate $CANDIDATE;`
* Detect automatically, first by environment, then use server network interface IP, such as `candidate *;`, we will explain at bellow.
* Specify the `?eip=x` in URL, such as: `webrtc://192.168.3.6/live/livestream?eip=192.168.3.6`
* Normally API is provided by SRS, so you're able to use hostname of HTTP-API as `candidate`, we will explain at bellow.

Configurations for automatically detect the IP for `candidate`:
* `candidate *;` or `candidate 0.0.0.0;` means detect the network interface IP.
* `use_auto_detect_network_ip on;` If disabled, never detect the IP automatically.
* `ip_family ipv4;` To filter the IP if automatically detect.

Configurations for using HTTP-API hostname as `candidate`:
* `api_as_candidates on;` If disabled, never use HTTP API hostname as candidate.
* `resolve_api_domain on;` If hostname is domain name, resolve to IP address. Note that Firefox does not support domain name.
* `keep_api_domain on;` Whether keep the domain name to resolve it by client.

> Note: Please note that if no `candidate` specified, SRS will use one automatically detected IP.

In short, the `candidate` must be a IP address that client could connect to.

Use command `ifconfig` to retrieve the IP:

```bash
# For macOS
CANDIDATE=$(ifconfig en0 inet| grep 'inet '|awk '{print $2}')

# For CentOS
CANDIDATE=$(ifconfig eth0|grep 'inet '|awk '{print $2}')

# Directly set ip.
CANDIDATE="192.168.3.10"
```

Pass it to SRS by ENV:

```bash
env CANDIDATE="192.168.3.10" \
  ./objs/srs -c conf/rtc.conf
```

For example, to run SRS in docker, and setup the CANDIDATE:

```bash
export CANDIDATE="192.168.3.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:5 \
  objs/srs -c conf/rtc.conf
```

> Note：About the usage of srs-docker, please read [srs-docker](https://github.com/ossrs/dev-docker/tree/v4#usage).

## Stream URL

Online demo URL:

* Publish：[webrtc://d.ossrs.net/live/show](https://ossrs.net/players/rtc_publisher.html?vhost=d.ossrs.net&server=d.ossrs.net&api=443&autostart=true&schema=https&stream=show)
* Play：[webrtc://d.ossrs.net/live/show](https://ossrs.net/players/rtc_player.html?vhost=d.ossrs.net&server=d.ossrs.net&api=443&autostart=true&schema=https&stream=show)

The streams for SRS:

* VLC(RTMP): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)
* H5(WebRTC): [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)

## WebRTC over TCP

In many networks, UDP is not available for WebRTC, so TCP is very important to make it highly reliable. SRS supports directly TCP transport for WebRTC, not TURN, which introduce a complex network layer and system. It also makes the LoadBalancer possible to forward TCP packets, because TCP is more stable than UDP for LoadBalancer.

* All HTTP API, HTTP Stream and WebRTC over TCP reuses one TCP port, such as TCP(443) for HTTPS.
* Support directly transport over UDP or TCP, no dependency of TURN, no extra system and resource cost.
* Works very well with [Proxy(Not Implemented)](https://github.com/ossrs/srs/issues/3138) and [Cluster(Not Implemented)](https://github.com/ossrs/srs/issues/2091), for load balancing and system capacity.

Run SRS with WebRTC over TCP, by default the port is 8000:

```bash
docker run --rm -it -p 8080:8080 -p 1985:1985 -p 8000:8000 \
  -e CANDIDATE="192.168.3.82" \
  -e SRS_RTC_SERVER_TCP_ENABLED=on \
  -e SRS_RTC_SERVER_PROTOCOL=tcp \
  ossrs/srs:v5.0.60
```

Please use [FFmpeg](https://ffmpeg.org/download.html) or [OBS](https://obsproject.com/download) to publish stream:

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

* Play WebRTC over TCP: [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)
* Play HTTP FLV: [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true)
* Play HLS: [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?stream=livestream.m3u8&autostart=true)

> Note: We config SRS by environment variables, you're able to use config file also.

> Note: We use dedicated TCP port, for example, HTTP API(1985), HTTP Stream(8080) and WebRTC over TCP(8000), you're able to reuse one TCP port at HTTP Stream(8080).

## HTTP API

About the API for WebRTC, please read [publish](./http-api.md#webrtc-publish) and [play](./http-api.md#webrtc-play).

## RTMP to RTC

Please use `conf/rtmp2rtc.conf` as config.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:5 \
  objs/srs -c conf/rtmp2rtc.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc.md#config-candidate).

Use FFmpeg docker to push to localhost:

```bash
docker run --rm -it ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

Play the stream in browser:

* WebRTC：[webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)
* HTTP-FLV：[http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)

## RTC to RTC

Please use `conf/rtc.conf` as config.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:5 \
  objs/srs -c conf/rtc.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc.md#config-candidate).

Play the stream in browser:

* Publish by WebRTC：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_publisher.html?stream=show&autostart=true)
* Play by WebRTC：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_player.html?stream=show&autostart=true)

> Remark: Note that if not localhost, the WebRTC publisher should be HTTPS page.

## RTC to RTMP

Please use `conf/rtc2rtmp.conf` as config.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:5 \
  objs/srs -c conf/rtc2rtmp.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc.md#config-candidate).

The streams:

* Publish by WebRTC：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_publisher.html?stream=show&autostart=true)
* Play by WebRTC：[webrtc://localhost/live/show](http://localhost:8080/players/rtc_player.html?stream=show&autostart=true)
* HTTP-FLV：[http://localhost:8080/live/show.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=show.flv)
* RTMP by VLC：rtmp://localhost/live/show

## SFU: One to One

Please use `conf/rtc.conf` as config.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:5 \
  objs/srs -c conf/rtc.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc.md#config-candidate).

Then startup the signaling, please read [usage](http://ossrs.net/srs.release/wiki/https://github.com/ossrs/signaling#usage):

```bash
docker run --rm -p 1989:1989 ossrs/signaling:1
```

Use HTTPS proxy [httpx-static](https://github.com/ossrs/go-oryx/tree/develop/httpx-static#usage) as api gateway:

```bash
export CANDIDATE="192.168.1.10"
docker run --rm -p 80:80 -p 443:443 ossrs/httpx:1 \
    ./bin/httpx-static -http 80 -https 443 -ssk ./etc/server.key -ssc ./etc/server.crt \
          -proxy http://$CANDIDATE:1989/sig -proxy http://$CANDIDATE:1985/rtc \
          -proxy http://$CANDIDATE:8080/
```

To open [http://localhost/demos/one2one.html?autostart=true](http://localhost/demos/one2one.html?autostart=true)

Or by the IP [https://192.168.3.6/demos/one2one.html?autostart=true](https://192.168.3.6/demos/one2one.html?autostart=true)

> Note: For self-sign certificate, please type `thisisunsafe` to accept it.

## SFU: Video Room

Please follow [SFU: One to One](./webrtc.md#sfu-one-to-one), and open the bellow demo pages.

To open [http://localhost/demos/room.html?autostart=true](http://localhost/demos/room.html?autostart=true)

Or by the IP [https://192.168.3.6/demos/room.html?autostart=true](https://192.168.3.6/demos/room.html?autostart=true)

> Note: For self-sign certificate, please type `thisisunsafe` to accept it.

## Room to Live

Please follow [SFU: One to One](./webrtc.md#sfu-one-to-one), and please convert RTC to RTMP, for FFmpeg to mix the streams.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:5 \
  objs/srs -c conf/rtc2rtmp.conf
```

If use FFmpeg to mix streams, there is a FFmpeg CLI on the demo page, for example:

```bash
ffmpeg -f flv -i rtmp://192.168.3.6/live/alice -f flv -i rtmp://192.168.3.6/live/314d0336 \
     -filter_complex "[1:v]scale=w=96:h=72[ckout];[0:v][ckout]overlay=x=W-w-10:y=H-h-10[out]" -map "[out]" \
     -c:v libx264 -profile:v high -preset medium \
     -filter_complex amix -c:a aac \
     -f flv rtmp://192.168.3.6/live/merge
```

Input:
* rtmp://192.168.3.6/live/alice
* rtmp://192.168.3.6/live/314d0336

Output:
* rtmp://192.168.3.6/live/merge

Winlin 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v6/webrtc)


