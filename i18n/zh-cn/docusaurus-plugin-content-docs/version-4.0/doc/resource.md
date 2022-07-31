---
title: 资源
sidebar_label: 资源
hide_title: false
hide_table_of_contents: false
---

# Resources

The resources of SRS.

## Ports

The ports used by SRS, kernel services:

* `tcp://1935`, for [RTMP live streaming server](https://ossrs.io/lts/en-us/docs/v4/doc/delivery-rtmp).
* `tcp://1985`, HTTP API server, for [HTTP-API](https://ossrs.io/lts/en-us/docs/v4/doc/http-api), [WebRTC](https://ossrs.io/lts/en-us/docs/v4/doc/webrtc]), etc.
* `tcp://8080`, HTTP live streaming server, [HTTP-FLV](https://ossrs.io/lts/en-us/docs/v4/doc/sample-http-flv), HLS(https://ossrs.io/lts/en-us/docs/v4/doc/sample-hls) as such.
* `udp://8000`, [WebRTC Media](https://ossrs.io/lts/en-us/docs/v4/doc/webrtc) server.

For optional HTTPS services, which might be provided by other web servers:

* `tcp://8088`, HTTPS live streaming server.
* `tcp://1990`, HTTPS API server.

For optional stream caster services, to push streams to SRS:

* `udp://8935`, Stream Caster: [Push MPEGTS over UDP](https://ossrs.net/lts/zh-cn/docs/v4/doc/streamer#push-mpeg-ts-over-udp) server.
* `tcp://554`, Stream Caster: [Push RTSP](https://ossrs.net/lts/zh-cn/docs/v4/doc/streamer#push-rtsp-to-srs) server.
* `tcp://8936`, Stream Caster: [Push HTTP-FLV](https://ossrs.net/lts/zh-cn/docs/v4/doc/streamer#push-http-flv-to-srs) server.
* `udp://10080`, Stream Caster: [Push SRT Media](https://github.com/ossrs/srs/issues/1147#issuecomment-577469119) server.

For external services to work with SRS:

* `udp://1989`, [WebRTC Signaling](https://github.com/ossrs/signaling#usage) server.

## APIs

The API used by SRS:

* `/api/v1/` The HTTP API path.
* `/rtc/v1/` The HTTP API path for RTC.
* `/sig/v1/` The [demo signaling](https://github.com/ossrs/signaling) API.

Other API used by [ossrs.net](https://ossrs.net):

* `/gif/v1` The statistic API.
* `/service/v1/` The latest available version API.
* `/ws-service/v1/` The latest available version API, by websocket.
* `/im-service/v1/` The latest available version API, by IM.
* `/code-service/v1/` The latest available version API, by Code verification.

The statistic path for [ossrs.net](https://ossrs.net):

* `/srs/xxx` The GitHub pages for [srs](https://github.com/ossrs/srs)
* `/release/xxx` The pages for [ossrs.net](https://ossrs.net)
* `/console/xxx` The pages for [console](http://ossrs.net/console/)
* `/player/xxx` The pages for [players and publishers](http://ossrs.net/players/)
* `/k8s/xxx` The template and repository deploy by K8s, like [srs-k8s-template](https://github.com/ossrs/srs-k8s-template)

## Mirrors

[Gitee](https://gitee.com/ossrs/srs), [the GIT usage](https://ossrs.io/lts/en-us/docs/v4/doc/git)

```
git clone https://gitee.com/ossrs/srs.git &&
cd srs && git remote set-url origin https://github.com/ossrs/srs.git && git pull
```

> Remark: For users in China, recomment to use mirror from CSDN or OSChina, because they are much faster.
[Gitlab](https://gitlab.com/winlinvip/srs-gitlab), [the GIT usage](https://ossrs.io/lts/en-us/docs/v4/doc/git)

```
git clone https://gitlab.com/winlinvip/srs-gitlab.git srs &&
cd srs && git remote set-url origin https://github.com/ossrs/srs.git && git pull
```

[Github](https://github.com/ossrs/srs), [the GIT usage](https://ossrs.io/lts/en-us/docs/v4/doc/git)

```
git clone https://github.com/ossrs/srs.git
```

| Branch | Cost | Size | CMD |
| --- | --- | --- | --- |
| 3.0release | 2m19.931s | 262MB | git clone -b 3.0release https://gitee.com/ossrs/srs.git |
| 3.0release | 0m56.515s | 95MB | git clone -b 3.0release --depth=1 https://gitee.com/ossrs/srs.git |
| develop | 2m22.430s | 234MB | git clone -b develop https://gitee.com/ossrs/srs.git |
| develop | 0m46.421s | 42MB | git clone -b develop --depth=1 https://gitee.com/ossrs/srs.git |
| min | 2m22.865s | 217MB | git clone -b min https://gitee.com/ossrs/srs.git |
| min | 0m36.472s | 11MB | git clone -b min --depth=1 https://gitee.com/ossrs/srs.git |