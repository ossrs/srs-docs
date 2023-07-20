---
title: HLS Delivery
sidebar_label: HLS Delivery
hide_title: false
hide_table_of_contents: false
---

# HLS Delivery

SRS supports RTMP and HLS, the most popular delivery protocols for the Internet.

RTMP is Adobe RTMP (Realtime Message Protocol), for low latency live streaming, and the standard protocol for Internet encoding, and the best protocol for Flash on PC.

HLS is Apple HLS (HTTP Live Streaming), for both live and VOD streaming over HTTP, and the standard protocol on Apple platforms.

Servers delivering both HLS and RTMP can support all screens. For RTMP, see: [RTMP Delivery](./rtmp.md)。

For information comparing RTMP and HLS, read [RTMP PK HLS](./rtmp-pk-http.md).

For information about how to deploy SRS to support HLS, read [Usage: HLS](./sample-hls.md).

For cluster to deliver HLS, to serve a vast set of visitors, please see [Nginx for HLS](./nginx-for-hls.md).

## Use Scenario

The main use scenario of HLS:
* Cross Platform: the default for live streaming to PCs is RTMP, although some libraries can play HLS in Flash right now. Android 3.0+ can play HLS, and iOS has always supported HLS.
* Industrial Strength on Apple platforms: the most stable live streaming protocol for OSX/iOS is HLS, similar to RTMP for Flash on Windows PCs.
* Friendly for CDNs: HLS, since it streams over HTTP, is a CDN-friendly delivery protocol.
* Simple: HLS is an open protocol and there are lots of tools for TS (MPEG transport stream is the container format used by HLS).

In a word, HLS is the best delivery protocol when the user does not care about the latency, for both PC and mobile (Android and iOS).

## Delivering Streams

The table below describes the different protocols for PC and mobile platforms.

| Delivery | Platform | Protocol | Inventor | Description |
|   ----- | -------- | --------- | -------- | ----------- |
| RTMP | Windows/Flash | RTMP | Adobe | RTMP is used to deliver low latency stream over the Internet, especially for Flash in Internet Explorer, and other web browsers, on PC. RTMP allows you to publish streams to servers very stably and for long durations.|
| HLS | Apple/<br/>Android | HTTP | Apple/<br/>Google | HLS lantency >= 10s. Android 3+ supports HLS. All Apple platforms support HLS.|
| HDS | - | HTTP | Adobe | HDS is a protocol similar to HLS, developed by Adobe. HDS is complex and offers no unique benefits, nonetheless, SRS2 support HDS.|
| <a href='http://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP'>DASH</a> | - | HTTP | - | Dash (Dynamic Adaptive Streaming over HTTP), developed by the MPEG working group, is similar to HLS. It's a new protocol, and SRS may support it once it's used by many users.|

## HLS Introduction

HLS is an HTTP m3u8 URL, which can be played in Apple's Safari directly. For example:

```bash
http://demo.srs.com/live/livestream.m3u8
```

The m3u8 url must be embedded in HTML5 for Android. For example:

```html
<!-- livestream.html -->
<video width="640" height="360"
        autoplay controls autobuffer 
        src="http://demo.srs.com/live/livestream.m3u8"
        type="application/vnd.apple.mpegurl">
</video>
```

The [m3u8](https://github.com/ossrs/srs/blob/master/trunk/doc/hls-m3u8-draft-pantos-http-live-streaming-12.txt) file of HLS is actually a play list. For example:

```bash
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:64
#EXT-X-TARGETDURATION:12
#EXTINF:11.550
livestream-64.ts
#EXTINF:5.250
livestream-65.ts
#EXTINF:7.700
livestream-66.ts
#EXTINF:6.850
livestream-67.ts
```

The important data items can be configured in SRS's config file:

* EXT-X-TARGETDURATION: This is calculated by SRS automatically. The EXT-X-TARGETDURATION tag specifies the maximum media segment duration.  The EXTINF duration of each media segment in the playlist file, when rounded to the nearest integer, MUST be less than or equal to the target duration.  This tag MUST appear once in a media playlist file.  It applies to the entire playlist file.
* EXTINF: This is calculated by SRS automatically, and the maximum value is configured by SRS setting `hls_fragment`. The EXTINF tag specifies the duration of a media segment.  It applies only to the media segment that follows it, and MUST be followed by a media segment URI.  Each media segment MUST be preceded by an EXTINF tag.
* Number of ts in m3u8: The `hls_window`, in seconds, specifies how many ts files will be in an m3u8, and SRS will delete the old ts files.
* Name of ts filenames: For example, `livestream-67.ts`, SRS will increase the number automatically; the next ts for instance is `livestream-68.ts`.

For example, if the `hls_fragment` is 10s, and the `hls_window` is 60s, then there are 60/10=6 ts files in the m3u8, and the old ts files are automatically deleted by SRS.

## HLS Workflow

The workflow of HLS: 

1. The encoder, for example, FFMPEG or FMLE, publishes an RTMP stream to SRS, and the codec of that stream must be H.264+AAC (use transcoding to convert other codecs when required).
1. SRS demuxes RTMP then remuxes the content into mpegts and writes a ts file, updating the m3u8.
1. The client, for example, an iPhone or VLC, accesses the m3u8 provided by any web server, for instance, SRS's embedded HTTP server, or nginx.

Note: SRS only needs you to configure HLS on the vhost, and SRS will create the directory by app name.

## HLS Configuration

The vhost `hls.srs.com` in conf/full.conf of SRS is an example of how to configure HLS, which users can copy the hls section from to their vhosts:

```bash
vhost __defaultVhost__ {
    hls {
        # whether the hls is enabled.
        # if off, do not write hls(ts and m3u8) when publish.
        # default: off
        enabled         on;
        # the hls fragment in seconds, the duration of a piece of ts.
        # default: 10
        hls_fragment    10;
        # the hls m3u8 target duration ratio,
        #   EXT-X-TARGETDURATION = hls_td_ratio * hls_fragment // init
        #   EXT-X-TARGETDURATION = max(ts_duration, EXT-X-TARGETDURATION) // for each ts
        # @see https://github.com/ossrs/srs/issues/304#issuecomment-74000081
        # default: 1.5
        hls_td_ratio    1.5;
        # the audio overflow ratio.
        # for pure audio, the duration to reap the segment.
        # for example, the hls_fragment is 10s, hls_aof_ratio is 2.0,
        # the segment will reap to 20s for pure audio.
        # default: 2.0
        hls_aof_ratio   2.0;
        # the hls window in seconds, the number of ts in m3u8.
        # default: 60
        hls_window      60;
        # the error strategy. can be:
        #       ignore, disable the hls.
        #       disconnect, require encoder republish.
        #       continue, ignore failed try to continue output hls.
        # @see https://github.com/ossrs/srs/issues/264
        # default: continue
        hls_on_error    continue;
        # the hls output path.
        # the m3u8 file is configured by hls_path/hls_m3u8_file, the default is:
        #       ./objs/nginx/html/[app]/[stream].m3u8
        # the ts file is configured by hls_path/hls_ts_file, the default is:
        #       ./objs/nginx/html/[app]/[stream]-[seq].ts
        # @remark the hls_path is compatible with srs v1 config.
        # default: ./objs/nginx/html
        hls_path        ./objs/nginx/html;
        # the hls m3u8 file name.
        # we supports some variables to generate the filename.
        #       [vhost], the vhost of stream.
        #       [app], the app of stream.
        #       [stream], the stream name of stream.
        # default: [app]/[stream].m3u8
        hls_m3u8_file   [app]/[stream].m3u8;
        # the hls ts file name.
        # we supports some variables to generate the filename.
        #       [vhost], the vhost of stream.
        #       [app], the app of stream.
        #       [stream], the stream name of stream.
        #       [2006], replace this const to current year.
        #       [01], replace this const to current month.
        #       [02], replace this const to current date.
        #       [15], replace this const to current hour.
        #       [04], replace this const to current minute.
        #       [05], replace this const to current second.
        #       [999], replace this const to current millisecond.
        #       [timestamp],replace this const to current UNIX timestamp in ms.
        #       [seq], the sequence number of ts.
        #       [duration], replace this const to current ts duration.
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/dvr#custom-path
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#hls-config
        # default: [app]/[stream]-[seq].ts
        hls_ts_file     [app]/[stream]-[seq].ts;
        # whether use floor for the hls_ts_file path generation.
        # if on, use floor(timestamp/hls_fragment) as the variable [timestamp],
        #       and use enhanced algorithm to calc deviation for segment.
        # @remark when floor on, recommend the hls_segment>=2*gop.
        # default: off
        hls_ts_floor    off;
        # the hls entry prefix, which is base url of ts url.
        # for example, the prefix is:
        #         http://your-server/
        # then, the ts path in m3u8 will be like:
        #         http://your-server/live/livestream-0.ts
        #         http://your-server/live/livestream-1.ts
        #         ...
        # optional, default to empty string.
        hls_entry_prefix http://your-server;
        # the default audio codec of hls.
        # when codec changed, write the PAT/PMT table, but maybe ok util next ts.
        # so user can set the default codec for mp3.
        # the available audio codec:
        #       aac, mp3, an
        # default: aac
        hls_acodec      aac;
        # the default video codec of hls.
        # when codec changed, write the PAT/PMT table, but maybe ok util next ts.
        # so user can set the default codec for pure audio(without video) to vn.
        # the available video codec:
        #       h264, vn
        # default: h264
        hls_vcodec      h264;
        # whether cleanup the old expired ts files.
        # default: on
        hls_cleanup     on;
        # If there is no incoming packets, dispose HLS in this timeout in seconds,
        # which removes all HLS files including m3u8 and ts files.
        # @remark 0 to disable dispose for publisher.
        # @remark apply for publisher timeout only, while "etc/init.d/srs stop" always dispose hls.
        # default: 0
        hls_dispose     0;
        # the max size to notify hls,
        # to read max bytes from ts of specified cdn network,
        # @remark only used when on_hls_notify is config.
        # default: 64
        hls_nb_notify   64;
        # whether wait keyframe to reap segment,
        # if off, reap segment when duration exceed the fragment,
        # if on, reap segment when duration exceed and got keyframe.
        # default: on
        hls_wait_keyframe       on;

        # whether using AES encryption.
        # default: off
        hls_keys        on; 
        # the number of clear ts which one key can encrypt.
        # default: 5
        hls_fragments_per_key 5;
        # the hls key file name.
        # we supports some variables to generate the filename.
        #       [vhost], the vhost of stream.
        #       [app], the app of stream.
        #       [stream], the stream name of stream.
        #       [seq], the sequence number of key corresponding to the ts.
        hls_key_file     [app]/[stream]-[seq].key;
        # the key output path.
        # the key file is configed by hls_path/hls_key_file, the default is:
        # ./objs/nginx/html/[app]/[stream]-[seq].key
        hls_key_file_path    ./objs/nginx/html;
        # the key root URL, use this can support https.
        # @remark It's optional.
        hls_key_url       https://localhost:8080;

        # Special control controls.
        ###########################################
        # Whether calculate the DTS of audio frame directly.
        # If on, guess the specific DTS by AAC samples, please read https://github.com/ossrs/srs/issues/547#issuecomment-294350544
        # If off, directly turn the FLV timestamp to DTS, which might cause corrupt audio stream.
        # @remark Recommend to set to off, unless your audio stream sample-rate and timestamp is not correct.
        # Default: on
        hls_dts_directly on;

        # on_hls, never config in here, should config in http_hooks.
        # for the hls http callback, @see http_hooks.on_hls of vhost hooks.callback.srs.com
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#http-callback
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#http-callback

        # on_hls_notify, never config in here, should config in http_hooks.
        # we support the variables to generate the notify url:
        #       [app], replace with the app.
        #       [stream], replace with the stream.
        #       [param], replace with the param.
        #       [ts_url], replace with the ts url.
        # for the hls http callback, @see http_hooks.on_hls_notify of vhost hooks.callback.srs.com
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#on-hls-notify
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#on-hls-notify
    }
}
```

The section `hls` is for HLS configuration:
* enabled: Whether to enable HLS, on to enable, off to disable. Default: off.
* hls_fragment: The HLS duration in seconds. The actual duration of ts file is determined by:
```bash
TS duration(s) = max(hls_fragment, gop_size)
hls_fragment: The length, in seconds, per ts file, for example, 5s.
gop_size: The stream gop size, for example, the fps is 20, gop is 200frames, then gop_size=gop/fps=10s.
So, the actual ts duration is max(5, 10)=10s, that is why the ts duration is larger than hls_fragment.
```
* hls_td_ratio: The ratio to calculate the m3u8 EXT-X-TARGETDURATION, read https://github.com/ossrs/srs/issues/304#issuecomment-74000081
* hls_aof_ratio: The ratio to determine whether the pure audio should be reap. For example, when hls_fragment is 10s, the hls_aof_ratio is 2.0, for pure audio, reap ts every 10s*2.0=20s.
* hls_window: The total HLS windows size in seconds, the sum of all ts durations in the m3u8. SRS will drop the old ts file in the m3u8 and delete the files from the filesystem. SRS will keep:
```bash
hls_window >= sum(each ts duration in m3u8)
```
* hls_path: The path to save m3u8 and ts files, where m3u8 and ts files are saved.
* hls_m3u8_file: The filename of the m3u8 file, with variables [vhost], [app] and [stream] available for replacement.
* hls_ts_file: The filename of the ts file, with some variables in [dvr variables](./dvr.md#custom-path). And, variable [seq] is the ts seqence number.
```bash
For RTMP stream: rtmp://localhost/live/livestream
HLS path: 
        hls_path        /data/nginx/html;
        hls_m3u8_file   [app]/[stream].m3u8;
        hls_ts_file     [app]/[stream]-[seq].ts;
SRS will generate the below files:
/data/nginx/html/live/livestream.m3u8
/data/nginx/html/live/livestream-0.ts
/data/nginx/html/live/livestream-1.ts
/data/nginx/html/live/livestream-2.ts
And the HLS URL for playback will be: http://localhost/live/livestream.m3u8
```
* hls_entry_prefix: the base URL for ts. Optional and defaults to an empty string.
```
For ts: live/livestream-0.ts
When config: hls_entry_prefix http://your-server;
The ts url generated to: http://your-server/live/livestream-0.ts
```
* hls_acodec: the default audio codec of hls. When the codec is changed, write the PAT/PMT table, but maybe okay until the next ts. So user can set the default codec for mp3.
* hls_vcodec: the default video codec of hls. When the codec is changed, write the PAT/PMT table, but maybe okay until next ts. So user can set the default codec for pure audio (without video) to vn.
* hls_cleanup: whether to cleanup the expired ts files, which exceed the hls_window.
* hls_dispose: When there is no incoming packets for a stream, the timeout in seconds to remove all hls files, the m3u8 and ts files. When the server restarts or exceeds this timeout, it removes all the hls files. Defaults to 0, which never cleans up the timeout pieces.
* hls_wait_keyframe: whether reap the ts base on top, that is, reap when got keyframe.
* hls_nb_notify: the maximum number of bytes to read from the notify server.
* on_hls: callback when ts generated.
* on_hls_notify: callback when ts generated, use [ts_url] as a variable, uses GET method. Can be used to push ts files to can network.

For how to deploy SRS to deliver HLS, read [Usage: HLS](./sample-hls.md)

## HTTP Callback

To configure `on_hls` for HTTP hooks, you should configure them in the `http_hooks` section, not in the hls section.

Remark: The HLS fault backup can base on this callback, read [#351](https://github.com/ossrs/srs/issues/351)

## ON HLS Notify

To configure the `on_hls_notify` for pushing ts files to can network, you should configure them in the `http_hooks` section, not in the hls section.

## HLS Audio Corrupt

When turning timestamp from FLV(tbn=1000) to TS(tbn=90000), the audio may corrupt and introduce noise, it's because the audio sample-rate problem described in [#547](https://github.com/ossrs/srs/issues/547#issuecomment-294350544).

> Remark: If you want to fix the HLS audio corrupt issue, please disable `hls_dts_directly` to off.

SRS3 fixed it by using the number of AAC samples to calculate the TS DTS, it works quit well except when the stream itself has some timestamp problem. So there is a config `hls_dts_directly` to force use the original timestamp, please read [#547](https://github.com/ossrs/srs/issues/547#issuecomment-563942711).

## HLSAudioOnly

SRS support delivering pure audio stream by HLS. The audio codec requires AAC, user must transcode other codecs to AAC, read [Usage: Transcode2HLS](./sample-transcode-to-hls.md)

For information about dropping video, read [Transcode: Disable Stream](./ffmpeg.md#drop-video-or-audio)

There is no special configuration for pure audio for HLS. Please read [Usage: HLS](./sample-hls.md)

## HLS and Forwarding

All streams published by forwarding will output HLS when HLS is enabled.

## HLS and Transcoding

Users should use transcoding to ensure the video codec is H.264 and the audio codec is AAC/MP3, because H.264+AAC/MP3 is required by HLS.

The below transcoding configuration sets the [gop](http://ffmpeg.org/ffmpeg-codecs.html#Options-7) to keep ts duration small:
```bash
vhost hls.transcode.vhost.com {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine hls {
            enabled         on;
            vfilter {
            }
            vcodec          libx264;
            vbitrate        500;
            vfps            20;
            vwidth          768;
            vheight         320;
            vthreads        2;
            vprofile        baseline;
            vpreset         superfast;
            vparams {
                g           100;
            }
            acodec          libaacplus;
            abitrate        45;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```
The gop is 100/20=5s, where fps specified by vfps is 20, and gop frames specified by g is 100.

## HLS Multiple Bitrates

SRS does not support HLS multiple bitrates.

## HLS M3u8 Examples

### live.m3u8

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:YES
#EXT-X-TARGETDURATION:13
#EXT-X-MEDIA-SEQUENCE:430
#EXTINF:11.800
news-430.ts
#EXTINF:10.120
news-431.ts
#EXTINF:11.160
news-432.ts
```

### event.m3u8

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:YES
#EXT-X-TARGETDURATION:13
#EXT-X-MEDIA-SEQUENCE:430
#EXT-X-PLAYLIST-TYPE:EVENT
#EXTINF:11.800
news-430.ts
#EXTINF:10.120
news-431.ts
#EXTINF:11.160
news-432.ts
```

### vod.m3u8

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:YES
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-TARGETDURATION:12
#EXTINF:10.120,
livestream-184.ts
#EXTINF:10.029,
livestream-185.ts
#EXTINF:10.206,
livestream-186.ts
#EXTINF:10.160,
livestream-187.ts
#EXTINF:11.360,
livestream-188.ts
#EXTINF:9.782,
livestream-189.ts
#EXT-X-ENDLIST
```

### loop.m3u8

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-ALLOW-CACHE:YES
#EXT-X-TARGETDURATION:13
#EXT-X-MEDIA-SEQUENCE:430
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:11.800
news-430.ts
#EXTINF:10.120
news-431.ts
#EXT-X-DISCONTINUITY
#EXTINF:11.952
news-430.ts
#EXTINF:12.640
news-431.ts
#EXTINF:11.160
news-432.ts
#EXT-X-DISCONTINUITY
#EXTINF:11.751
news-430.ts
#EXTINF:2.040
news-431.ts
#EXT-X-ENDLIST
```

## HLS in RAM

SRS supports HLS delivery from RAM, without writing m3u8/ts to disk. Read [513](https://github.com/ossrs/srs/issues/513)

> Warning: HLS RAM is removed from SRS2 to SRS3.

## SRS How to Support HLS

The HLS of SRS1 refers to nginx-rtmp.

SRS2 already rewrites the HLS strictly following the HLS specification.

## HLS Encryption

You could use HLS with encryption from [#1093](https://github.com/ossrs/srs/issues/1093#issuecomment-415971022).

Winlin 2015.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v6/delivery-hls)


