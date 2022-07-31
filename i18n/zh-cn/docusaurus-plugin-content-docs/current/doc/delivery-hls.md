---
title: HLS 分发
sidebar_label: HLS 分发
hide_title: false
hide_table_of_contents: false
---

# HLS 分发

SRS支持HLS/RTMP两种成熟而且广泛应用的流媒体分发方式。

RTMP指Adobe的RTMP(Realtime Message Protocol)，广泛应用于低延时直播，也是编码器和服务器对接的实际标准协议，在PC（Flash）上有最佳观看体验和最佳稳定性。

HLS指Apple的HLS(Http Live Streaming)，本身就是Live（直播）的，不过Vod（点播）也能支持。HLS是Apple平台的标准流媒体协议，和RTMP在PC上一样支持得天衣无缝。

HLS和RTMP两种分发方式，就可以支持所有的终端。RTMP参考[RTMP分发](./delivery-rtmp)。

RTMP和HLS的比较参考：[RTMP PK HLS](./rtmp-pk-http)

部署分发HLS的实例，参考：[Usage: HLS](./sample-hls)

部署HLS的分发集群，边缘分发集群，解决海量的观看问题，请参考[Nginx for HLS](./nginx-for-hls)

## Use Scenario

HLS主要的应用场景包括：
* 跨平台：PC主要的直播方案是RTMP，也有一些库能播放HLS，譬如jwplayer，基于osmf的hls插件也一大堆。所以实际上如果选一种协议能跨PC/Android/IOS，那就是HLS。
* IOS上苛刻的稳定性要求：IOS上最稳定的当然是HLS，稳定性不差于RTMP在PC-flash上的表现。
* 友好的CDN分发方式：目前CDN对于RTMP也是基本协议，但是HLS分发的基础是HTTP，所以CDN的接入和分发会比RTMP更加完善。能在各种CDN之间切换，RTMP也能，只是可能需要对接测试。
* 简单：HLS作为流媒体协议非常简单，apple支持得也很完善。Android对HLS的支持也会越来越完善。至于DASH/HDS，好像没有什么特别的理由，就像linux已经大行其道而且开放，其他的系统很难再广泛应用。

总之，SRS支持HLS主要是作为输出的分发协议，直播以RTMP+HLS分发，满足各种应用场景。点播以HLS为主。

## Delivering Streams

详见下表：

| 分发 | 平台 | 协议 | 公司 | 说明 |
| ---- | --- | ---  | ---  | --- |
| RTMP | Windows Flash | RTMP | Adobe | 主流的低延时分发方式，<br/>Adobe对RTMP是Flash原生支持方式，<br/>FMS（Adobe Media Server前身），<br/>就是Flash Media Server的简写，可见Flash播放RTMP是多么“原生”，<br/>就像浏览器打开http网页一样“原生”，<br/>经测试，Flash播放RTMP流可以10天以上不间断播放。|
| HLS | Apple/<br/>Android | HTTP | Apple/<br/>Google | 延时一个切片以上（一般10秒以上），<br/>Apple平台上HLS的效果比PC的RTMP还要好，<br/>而且Apple所有设备都支持，<br/>Android最初不支持HLS，后来也支持了，<br/>但测试发现支持得还不如Apple，<br/>不过观看是没有问题，稳定性稍差，<br/>所以有些公司专门做Android上的流媒体播放器。|
| HDS | - | HTTP | Adobe | Adobe自己的HLS，<br/>协议方面做得是复杂而且没有什么好处，<br/>国内没有什么应用，传说国外有，<br/>SRS2已经支持。|
| <a href='http://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP'>DASH</a> | - | HTTP | - | Dynamic Adaptive Streaming over HTTP (DASH)，<br/>一些公司提出的HLS，<br/>国内还没有应用，国外据说有用了，<br/>nginx-rtmp好像已经支持了，<br/>明显这个还不成熟，SRS是不会支持的。|

## HLS Introduction

HLS是提供一个m3u8地址，Apple的Safari浏览器直接就能打开m3u8地址，譬如：
```bash
http://demo.srs.com/live/livestream.m3u8
```

Android不能直接打开，需要使用html5的video标签，然后在浏览器中打开这个页面即可，譬如：
```html
<!-- livestream.html -->
<video width="640" height="360"
        autoplay controls autobuffer 
        src="http://demo.srs.com/live/livestream.m3u8"
        type="application/vnd.apple.mpegurl">
</video>
```

HLS的[m3u8](https://github.com/ossrs/srs/blob/master/trunk/doc/hls-m3u8-draft-pantos-http-live-streaming-12.txt)，是一个ts的列表，也就是告诉浏览器可以播放这些ts文件，譬如：
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

有几个关键的参数，这些参数在SRS的配置文件中都有配置项：
* EXT-X-TARGETDURATION：所有切片的最大时长。有些Apple设备这个参数不正确会无法播放。SRS会自动计算出ts文件的最大时长，然后更新m3u8时会自动更新这个值。用户不必自己配置。
* EXTINF：ts切片的实际时长，SRS提供配置项hls_fragment，但实际上的ts时长还受gop影响，详见下面配置HLS的说明。
* ts文件的数目：SRS可配置hls_window，指定m3u8中保存多少个切片，SRS会自动清理旧的切片。
* livestream-67.ts：SRS会自动维护ts切片的文件名，在编码器重推之后，这个编号会继续增长，保证流的连续性。直到SRS重启，这个编号才重置为0。

譬如，每个ts切片为10秒，窗口为60秒，那么m3u8中会保存6个ts切片。

## HLS Workflow

HLS的主要流程是：

1. FFMPEG或FMLE或编码器，推送RTMP流到SRS，编码为H264/AAC（其他编码需要SRS转码）
1. SRS将RTMP切片成TS，并生成M3U8。若流非H264和AAC，则停止输出HLS（可使用SRS转码到SRS其他vhost或流，然后再切HLS）。
1. 访问m3u8，srs内置的http服务器（或者通用http服务器）提供HTTP服务。

注意：SRS只需要在Vhost上配置HLS，会自动根据流的app创建目录，但是配置的hls_path必须自己创建

## HLS Config

conf/full.conf中的hls.srs.com是HLS配置的实例，可以拷贝到默认的Vhost，例如：

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
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/dvr#custom-path
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#hls-config
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
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#http-callback
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#http-callback

        # on_hls_notify, never config in here, should config in http_hooks.
        # we support the variables to generate the notify url:
        #       [app], replace with the app.
        #       [stream], replace with the stream.
        #       [param], replace with the param.
        #       [ts_url], replace with the ts url.
        # for the hls http callback, @see http_hooks.on_hls_notify of vhost hooks.callback.srs.com
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#on-hls-notify
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#on-hls-notify
    }
}
```

其中hls配置就是HLS的配置，主要配置项如下：
* enabled：是否开启HLS，on/off，默认off。
* hls_fragment：秒，指定ts切片的最小长度。实际上ts文件的长度由以下公式决定：
```bash
ts文件时长 = max(hls_fragment, gop_size)
hls_fragment：配置文件中的长度。譬如：5秒。
gop_size：编码器配置的gop的长度，譬如ffmpeg指定fps为20帧/秒，gop为200帧，则gop_size=gop/fps=10秒。
那么，最终ts的时长为max(5, 10) = 10秒。这也是为什么有些流配置了hls_fragment，但是ts时长仍然比这个大的原因。
```
* hls_td_ratio：倍数。控制m3u8的EXT-X-TARGETDURATION，参考：https://github.com/ossrs/srs/issues/304#issuecomment-74000081
* hls_aof_ratio: 倍数。纯音频时，当ts时长超过配置的ls_fragment乘以这个系数时就切割文件。例如，当ls_fragment是10秒，hls_aof_ratio是2.0时，对于纯音频，10s*2.0=20秒时就切割ts文件。
* hls_window：秒，指定HLS窗口大小，即m3u8中ts文件的时长之和，超过总时长后，丢弃第一个m3u8中的第一个切片，直到ts的总时长在这个配置项范围之内。即SRS保证下面的公式：
```bash
hls_window >= sum(m3u8中每个ts的时长)
```
* hls_path：HLS的m3u8和ts文件保存的路径。m3u8和ts文件都保存在这个目录中。
* hls_m3u8_file: HLS的m3u8文件名，包含可替换的[vhost],[app]和[stream]变量。
* hls_ts_file: HLS的ts文件名，包含可替换的一系列变量，参考[dvr variables](./dvr#custom-path)，另外，[seq]是ts的seqence number。
```bash
对于RTMP流：rtmp://localhost/live/livestream
HLS配置路径：
        hls_path        /data/nginx/html;
        hls_m3u8_file   [app]/[stream].m3u8;
        hls_ts_file     [app]/[stream]-[seq].ts;
那么会生成以下文件：
/data/nginx/html/live/livestream.m3u8
/data/nginx/html/live/livestream-0.ts
/data/nginx/html/live/livestream-1.ts
/data/nginx/html/live/livestream-2.ts
最后的HLS地址为：http://localhost/live/livestream.m3u8
```
* hls_entry_prefix: TS的base url。可选默认为空字符串；非空时加在ts前面作为base url。
```
对于ts切片：live/livestream-0.ts
若配置为：hls_entry_prefix http://your-server;
则最后的TS的URL是：http://your-server/live/livestream-0.ts
```
* hls_acodec: 默认的音频编码。当流的编码改变时，会更新PMT/PAT信息；默认是aac，因此默认的PMT/PAT信息是aac；如果流是mp3，那么可以配置这个参数为mp3，避免PMT/PAT改变。
* hls_vcodec: 默认的视频编码。当流的编码改变时，会更新PMT/PAT信息；默认是h264。如果是纯音频HLS，可以配置为vn，可以减少SRS检测纯音频的时间，直接进入纯音频模式。
* hls_cleanup: 是否删除过期的ts切片，不在hls_window中就是过期。可以关闭清除ts切片，实现时移和存储，使用自己的切片管理系统。
* hls_dispose: 在没有流时，HLS清理的过期时间（秒），系统重启或者超过这个时间时，清理HLS的所有文件，包括m3u8和ts。默认为0，即不清理。
* hls_wait_keyframe: 是否按top切片，即等待到关键帧后开始切片。测试发现OS X和android上可以不用按go切片。
* hls_nb_notify: 从notify服务器读取数据的长度。
* on_hls: 当切片生成时，回调这个url，使用POST回调。用来和自己的系统集成，譬如实现切片移动等。
* on_hls_notify: 当切片生成时，回调这个url，使用GET回调。用来和系统集成，可以使用[ts_url]变量，实现预分发(即下载一次ts片)。

部署分发HLS的实例，参考：[Usage: HLS](./sample-hls)

## HTTP Callback

可以配置`on_hls`实现回调，应该在`http_hooks`中配置，而不是在hls中配置。

备注：HLS热备可以基于这个回调实现，参考[#351](https://github.com/ossrs/srs/issues/351).

备注：HLS热备必须保证两个服务器的切片<b>完全</b>一样，因为负载均衡器或者边缘可能从两个服务器取切片，必须完全一样。因此在切片上保证两个服务器切片完全一致，是一个非常非常复杂的流媒体问题；但是通过业务系统和回调，通过选择两个服务器的切片的方式，可以做到非常简单可靠的HLS热备系统。

## ON HLS Notify

可以配置`on_hls_notify`实现CDN预分发，应该在`http_hooks`中配置，而不是在hls中配置。

## HLS Audio Corrupt

HLS可能会有爆音的问题，这是因为AAC的采样率导致在FLV(tbn=1000)和TS(tbn=90000)之间变换时，引入了微小的误差导致的。SRS3使用采样个数来计算精确的时间戳，详细参考[HLS爆音](https://github.com/ossrs/srs/issues/547#issuecomment-294350544)。

> 注意：如果需要解决HLS爆音问题，需要手动禁用`hls_dts_directly`(设为off)。

燃鹅，SRS3修正后，发现有些音频流本身的时间戳是有问题，导致从AAC采样个数计算出来的时间戳不对，所以提供了配置项`hls_dts_directly`强制使用原始时间戳，参考[HLS强制使用原始时间戳](https://github.com/ossrs/srs/issues/547#issuecomment-563942711)。

## HLSAudioOnly

SRS支持分发HLS纯音频流，当RTMP流没有视频，且音频为aac（可以使用转码转为aac，参考[Usage: Transcode2HLS](./sample-transcode-to-hls)），SRS只切片音频。

若RTMP流中已经有视频和音频，需要支持纯音频HLS流，可以用转码将视频去掉，参考：[转码: 禁用流](./ffmpeg#%E7%A6%81%E7%94%A8)。然后分发音频流。

分发纯音频流不需要特殊配置，和HLS分发一样，参考：[Usage: HLS](./sample-hls)

## HLS and Forward

Forward的流和普通流不做区分，若forward的流所在的VHOST配置了HLS，一样会应用HLS配置进行切片。

因此，可以对原始流进行Transcode之后，保证流符合h.264/aac的规范，然后forward到多个配置了HLS的VHOST进行切片。支持多个源站的热备。

## HLS and Transcode

HLS要求RTMP流的编码为h.264+aac/mp3，否则会自动禁用HLS，会出现RTMP流能看HLS流不能看（或者看到的HLS是之前的流）。

Transcode将RTMP流转码后，可以让SRS接入任何编码的RTMP流，然后转换成HLS要求的h.264/aac/mp3编码方式。

配置Transcode时，若需要控制ts长度，需要[配置ffmpeg编码的gop](http://ffmpeg.org/ffmpeg-codecs.html#Options-7)，譬如：
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
该FFMPEG转码参数，指定gop时长为100/20=5秒，fps帧率（vfps=20），gop帧数（g=100）。

## HLS Multiple Bitrate

SRS目前不支持HLS自适应码流，需要调研这个功能。

## HLS M3u8 Examples

### live.m3u8

http://ossrs.net/hls/live.m3u8

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

http://ossrs.net/hls/event.m3u8

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

http://ossrs.net/hls/vod.m3u8

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

## Apple

https://developer.apple.com/library/ios/technotes/tn2288/_index.html

## HLS in RAM

SRS支持内存直接分发HLS，不写入磁盘。参考：[513](https://github.com/ossrs/srs/issues/513)

> 注意：由于该功能很鸡肋，所以会从SRS2中移除，在SRS3再考虑。

## SRS How to Support HLS

SRS1的HLS主要参考了nginx-rtmp的HLS实现方式，SRS2已经按照HLS标准规范重新实现。

## HLS Encryption

SRS3支持切片加密，具体使用方法参考[#1093](https://github.com/ossrs/srs/issues/1093#issuecomment-415971022)。

Winlin 2015.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-5/doc/delivery-hls)


