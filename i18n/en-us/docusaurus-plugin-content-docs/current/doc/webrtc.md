---
title: WebRTC
sidebar_label: WebRTC
hide_title: false
hide_table_of_contents: false
---

# WebRTC

https://github.com/ossrs/srs/issues/307

## Config

There are some config for WebRTC:

* full.conf: Section `rtc_server` and vhost `rtc.vhost.srs.com` is about WebRTC.
* rtc.conf: WebRTC to WebRTC clients.
* rtmp2rtc.conf: Covert RTMP to WebRTC.
* rtc2rtmp.conf: Covert WebRTC to RTMP.

## Config: Candidate

The play will definitely fail if the `CANDIDATE` of config is not correct,
because it's the RTP server address(`IP` and port) in SDP, the `IP` is `CANDIDATE`:

```bash
type: answer, sdp: v=0
a=candidate:0 1 udp 2130706431 192.168.3.6 8000 typ host generation 0
```

So the `CANDIDATE` is `192.168.3.6` here, which is the IP of server.
We could config it by:

* Use plaintext IP directly, such as `candidate 192.168.3.6;`
* Use command `ifconfig` to retrieve IP of network interface, pass it by ENV, such as `candidate $CANDIDATE;`
* Try to read the intranet IP from network interface, for example, `candidate *;`
* Read from query string of stream URL, such as `webrtc://192.168.3.6/live/livestream?eip=192.168.3.6`

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
  ossrs/srs:4 \
  objs/srs -c conf/rtc.conf
```

> Note：About the usage of srs-docker, please read [srs-docker](https://github.com/ossrs/dev-docker/tree/v4#usage).

## Stream URL

Online demo URL:

* Publish：[webrtc://d.ossrs.net/live/show](https://ossrs.net/players/rtc_publisher.html?vhost=d.ossrs.net&server=d.ossrs.net&api=443&autostart=true&schema=https&stream=show)
* Play：[webrtc://d.ossrs.net/live/show](https://ossrs.net/players/rtc_player.html?vhost=d.ossrs.net&server=d.ossrs.net&api=443&autostart=true&schema=https&stream=show)

The streams for SRS [usage](https://github.com/ossrs/srs/tree/4.0release#usage):

* VLC(RTMP): rtmp://localhost/live/livestream
* H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
* H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)
* H5(WebRTC): [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)

## HTTP API

About the API for WebRTC, please read [publish](./http-api#webrtc-publish) and [play](./http-api#webrtc-play).

## RTMP to RTC

Please use `conf/rtmp2rtc.conf` as config.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:4 \
  objs/srs -c conf/rtmp2rtc.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc#config-candidate).

Use FFmpeg docker to push to localhost:

```bash
docker run --rm --network=host ossrs/srs:encoder ffmpeg -re -i ./doc/source.flv \
  -c copy -f flv rtmp://localhost/live/livestream
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
  ossrs/srs:4 \
  objs/srs -c conf/rtc.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc#config-candidate).

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
  ossrs/srs:4 \
  objs/srs -c conf/rtc2rtmp.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc#config-candidate).

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
  ossrs/srs:4 \
  objs/srs -c conf/rtc.conf
```

> Note: Please set CANDIDATE as the ip of server, please read [CANDIDATE](./webrtc#config-candidate).

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

Please follow [SFU: One to One](./webrtc#sfu-one-to-one), and open the bellow demo pages.

To open [http://localhost/demos/room.html?autostart=true](http://localhost/demos/room.html?autostart=true)

Or by the IP [https://192.168.3.6/demos/room.html?autostart=true](https://192.168.3.6/demos/room.html?autostart=true)

> Note: For self-sign certificate, please type `thisisunsafe` to accept it.

## Room to Live

Please follow [SFU: One to One](./webrtc#sfu-one-to-one), and please convert RTC to RTMP, for FFmpeg to mix the streams.

```bash
export CANDIDATE="192.168.1.10"
docker run --rm --env CANDIDATE=$CANDIDATE \
  -p 1935:1935 -p 8080:8080 -p 1985:1985 -p 8000:8000/udp \
  ossrs/srs:4 \
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
![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-5/doc/webrtc)


