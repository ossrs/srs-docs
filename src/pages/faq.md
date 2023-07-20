# FAQ

About Q&A, please follow [rules](https://stackoverflow.com/help/product-support)：

* Please read the [Wiki](/docs/v4/doc/introduction) first.
* Search your issue in this FAQ and [issues](https://github.com/ossrs/srs/issues)
* How do I? -- [Stack Overflow](https://stackoverflow.com/questions/tagged/simple-realtime-server)
* I got this error, why? -- [Stack Overflow](https://stackoverflow.com/questions/tagged/simple-realtime-server)
* I got this error and I'm sure it's a bug -- [file an issue](https://github.com/ossrs/srs/issues/new) or [PR](/how-to-file-pr)
* I have an idea/request -- [file an issue](https://github.com/ossrs/srs/issues/new) or [PR](/how-to-file-pr)
* Why do you? -- [discord community](https://discord.gg/yZ4BnPmHAd) (developer forum etc)
* When will you? -- [discord community](https://discord.gg/yZ4BnPmHAd)

## FAQ

> Note: This is FAQ about SRS, please see [SRS Cloud FAQ](/faq-srs-cloud) for SRS Cloud.

<a name='edge-hls-dvr-rtc'></a>

### [Edge HLS/DVR/RTC](#edge-hls-dvr-rtc)
* `Edge HLS/DVR/RTC`: About Edge support for HLS/DVR/RTC, etc.
  > 1. Edge is a live streaming cluster that only supports live streaming protocols such as RTMP and FLV. Only the origin server can support HLS/DVR/RTC. Refer to [#1066](https://github.com/ossrs/srs/issues/1066)
  > 1. Currently, there is no restriction on using HLS/DVR/RTC capabilities in Edge, but they will be disabled in the future. So please do not use them this way, and they won't work.
  > 1. For the HLS cluster, please refer to the documentation [HLS Edge Cluster](/docs/v5/doc/nginx-for-hls)
  > 1. The development of WebRTC and SRT clustering capabilities is in progress. Refer to [#3138](ttps://github.com/ossrs/srs/issues/3138)

<a name='hls-fragments'></a>

### [HLS Fragments](#hls-fragments)
* `HLS Fragment Duration`: About HLS segment duration
  > 1. HLS segment duration is determined by three factors: GOP length, whether to wait for a keyframe (`hls_wait_keyframe`), and segment duration (`hls_fragment`).
  > 1. For example, if the GOP is set to 2s, the segment length is `hls_fragment:5`, and `hls_wait_keyframe:on`, then the actual duration of each TS segment may be around 5~6 seconds, as it needs to wait for a complete GOP before closing the segment.
  > 1. For example, if the GOP is set to 10s, the segment length is `hls_fragment:5`, and `hls_wait_keyframe:on`, then the actual duration of each TS segment is also over 10 seconds.
  > 1. For example, if the GOP is set to 10s, the segment length is `hls_fragment:5`, and `hls_wait_keyframe:off`, then the actual duration of each TS segment is around 5 seconds. The segment does not start with a keyframe, so some players may experience screen artifacts or slower video playback.
  > 1. For example, if the GOP is set to 2s, the segment length is `hls_fragment:2`, and `hls_wait_keyframe:on`, then the actual duration of each TS segment may be around 2 seconds. This way, the HLS delay is relatively low, and there will be no screen artifacts or decoding issues, but the encoding quality may be slightly compromised due to the smaller GOP.
  > 1. Although the segment size can be set to less than 1 second, such as `hls_fragment:0.5`, the `#EXT-X-TARGETDURATION` is still 1 second because it is an integer. Moreover, having too small segments can lead to an excessive number of segments, which is not conducive to CDN caching or player caching, so it is not recommended to set too small segments.
  > 1. If you want to reduce latency, do not set the segment duration to less than 1 second; setting it to 1 or 2 seconds is more appropriate. Because even if it is set to 1 second, due to the player's segment fetching strategy and caching policy, the latency will not be the same as RTMP or HTTP-FLV streams. The minimum latency for HLS is generally over 5 seconds. 
  > 1. GOP refers to the number of frames between two keyframes, which needs to be set in the encoder. For example, the FFmpeg parameter `-r 25 -g 50` sets the frame rate to 25fps and the GOP to 50 frames, which is equivalent to 2 seconds. 
  > 1. In OBS, there is a `Keyframe Interval(0=auto)` setting. Its minimum value is 1s. If set to 0, it actually means automatic, not the lowest latency setting. For low latency, it is recommended to set it to 1s or 2s.

<a name='api-security'></a> <a name='https'></a> <a name='https-h2-3'></a>

### [HTTPS & HTTP2/3](#https-h2-3)
* `HTTPS`: About HTTPS services, API, Callback, Streaming, WebRTC, etc.
  > 1. [HTTPS API](/docs/v4/doc/http-api#https-api) provides a transport layer secure API. WebRTC push streaming requires an HTTPS page, so it can only access the HTTPS API.
  > 1. [HTTPS Callback](/docs/v4/doc/http-callback#https-callback) calls back to an HTTPS service. If your server uses the HTTPS protocol, it is generally used for security purposes in business systems.
  > 1. [HTTPS Live Streaming](/docs/v4/doc/delivery-http-flv#https-flv-live-stream) provides a transport layer secure stream. Mainly, HTTPS pages can only access HTTPS resources.
  > 1. Single domain names automatically apply for SSL certificates from `letsencrypt`, which is convenient for small and medium-sized enterprises to deploy SRS and avoids the high overhead of HTTPS proxy for streaming media services. See [#2864](https://github.com/ossrs/srs/issues/2864)
  > 1. Use Nginx or Caddy for reverse proxy, HTTP/HTTPS Proxy, to provide a unified HTTP/HTTPS service. See[#2881](https://github.com/ossrs/srs/issues/2881)
* `HTTP2`: About HTTP2-FLV or HTTP2 HLS, etc.
  > 1. SRS will not implement HTTP2 or HTTP3, but instead recommends using a reverse proxy to convert protocols, such as Nginx or Go.
  > 1. Since HTTP is a very mature protocol, existing tools and reverse proxy capabilities are well developed, and there is no need for SRS to implement a complete protocol.
  > 1. SRS has implemented a simple HTTP 1.0 protocol, mainly providing API and Callback capabilities.

## Deleting

Refer this FAQ by:

```text
See FAQ:
* Chinese: https://ossrs.net/lts/zh-cn/faq#https-h2-3
* English: https://ossrs.io/lts/en-us/faq#https-h2-3
```

Duplicate or pre-existing issues may be removed, as they are already present in the issues or FAQ section:

```
For discussion or idea, please ask in [discord](https://discord.gg/yZ4BnPmHAd).

This issue will be eliminated, see #2716
```

```
Please ask this question on Stack Overflow using the [#simple-realtime-server tag](https://stackoverflow.com/questions/tagged/simple-realtime-server).

If want some discussion, here's the [discord](https://discord.gg/yZ4BnPmHAd).

This issue will be eliminated, see #2716
```

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/faq-en)
