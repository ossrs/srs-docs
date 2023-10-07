---
title: HLS
sidebar_label: HLS
hide_title: false
hide_table_of_contents: false
---

# HLS

HLS是适配性和兼容性最好的流媒体协议，没有之一。这个世界上几乎所有的设备都能支持HLS协议，包括PC、Android、iOS、OTT、SmartTV等等。
各种各样的浏览器对HLS的支持也很好，包括Chrome、Safari、Firefox、Edge等等，包括移动端的浏览器。

如果你的用户群体是多种多样的，特别是设备性能还不太好，那么HLS是最好的选择。如果你希望兼容更多的设备，那么HLS是最好的选择。
如果你希望在任何一个CDN都能分发你的直播流，在全球范围内分发你的直播流，那么HLS是最好的选择。

当然了，HLS并不是没有毛病，它的问题就是延迟比较高，一般在30秒左右。虽然经过优化可以到8秒左右，但是不同播放器的行为可能不一致。
对比起其他流媒体协议，优化后的延迟也很高。因此如果你特别在意直播的延迟，那么请使用[RTMP](./rtmp.md)或者
[HTTP-FLV](./sample-http-flv.md)协议。

HLS主要的应用场景包括：
* 跨平台：PC主要的直播方案是HLS，可用hls.js库播放HLS。所以实际上如果选一种协议能跨PC/Android/IOS，那就是HLS。
* iOS上苛刻的稳定性要求：iOS上最稳定的当然是HLS，稳定性不差于RTMP和HTTP-FLV的稳定性。
* 友好的CDN分发方式：HLS分发的基础是HTTP，所以CDN的接入和分发会比RTMP更加完善。HLS能在各种CDN之间切换。
* 简单问题少：HLS作为流媒体协议非常简单，apple支持得也很完善。Android对HLS的支持也会越来越完善。

HLS协议是SRS的核心协议，将会持续维护和更新，不断完善对HLS协议的支持。SRS将RTMP、SRT或WebRTC流，转换成HLS流。
特别是WebRTC，SRS实现了音频转码的能力。

## Usage

SRS内置HLS的支持，可以用[docker](./getting-started.md)或者[从源码编译](./getting-started-build.md):

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  ./objs/srs -c conf/hls.conf
```

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* HLS (by [VLC](https://www.videolan.org/)): `http://localhost:8080/live/livestream.m3u8`

> Note: 请等待大约10秒左右，再播放流，否则会播放失败，因为生成第一个切片需要一些时间。

## Config

HLS相关的配置如下：

```bash
vhost __defaultVhost__ {
    hls {
        # whether the hls is enabled.
        # if off, do not write hls(ts and m3u8) when publish.
        # Overwrite by env SRS_VHOST_HLS_ENABLED for all vhosts.
        # default: off
        enabled on;

        # the hls fragment in seconds, the duration of a piece of ts.
        # Overwrite by env SRS_VHOST_HLS_HLS_FRAGMENT for all vhosts.
        # default: 10
        hls_fragment 10;
        # the hls m3u8 target duration ratio,
        #   EXT-X-TARGETDURATION = hls_td_ratio * hls_fragment // init
        #   EXT-X-TARGETDURATION = max(ts_duration, EXT-X-TARGETDURATION) // for each ts
        # Overwrite by env SRS_VHOST_HLS_HLS_TD_RATIO for all vhosts.
        # default: 1.0
        hls_td_ratio 1.0;
        # the audio overflow ratio.
        # for pure audio, the duration to reap the segment.
        # for example, the hls_fragment is 10s, hls_aof_ratio is 1.2,
        # the segment will reap to 12s for pure audio.
        # Overwrite by env SRS_VHOST_HLS_HLS_AOF_RATIO for all vhosts.
        # default: 1.2
        hls_aof_ratio 1.2;
        # the hls window in seconds, the number of ts in m3u8.
        # Overwrite by env SRS_VHOST_HLS_HLS_WINDOW for all vhosts.
        # default: 60
        hls_window 60;
        # the error strategy. can be:
        #       ignore, disable the hls.
        #       disconnect, require encoder republish.
        #       continue, ignore failed try to continue output hls.
        # Overwrite by env SRS_VHOST_HLS_HLS_ON_ERROR for all vhosts.
        # default: continue
        hls_on_error continue;
        # the hls output path.
        # the m3u8 file is configured by hls_path/hls_m3u8_file, the default is:
        #       ./objs/nginx/html/[app]/[stream].m3u8
        # the ts file is configured by hls_path/hls_ts_file, the default is:
        #       ./objs/nginx/html/[app]/[stream]-[seq].ts
        # @remark the hls_path is compatible with srs v1 config.
        # Overwrite by env SRS_VHOST_HLS_HLS_PATH for all vhosts.
        # default: ./objs/nginx/html
        hls_path ./objs/nginx/html;
        # the hls m3u8 file name.
        # we supports some variables to generate the filename.
        #       [vhost], the vhost of stream.
        #       [app], the app of stream.
        #       [stream], the stream name of stream.
        # Overwrite by env SRS_VHOST_HLS_HLS_M3U8_FILE for all vhosts.
        # default: [app]/[stream].m3u8
        hls_m3u8_file [app]/[stream].m3u8;
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
        # Overwrite by env SRS_VHOST_HLS_HLS_TS_FILE for all vhosts.
        # default: [app]/[stream]-[seq].ts
        hls_ts_file [app]/[stream]-[seq].ts;
        # the hls entry prefix, which is base url of ts url.
        # for example, the prefix is:
        #         http://your-server/
        # then, the ts path in m3u8 will be like:
        #         http://your-server/live/livestream-0.ts
        #         http://your-server/live/livestream-1.ts
        #         ...
        # Overwrite by env SRS_VHOST_HLS_HLS_ENTRY_PREFIX for all vhosts.
        # optional, default to empty string.
        hls_entry_prefix http://your-server;
        # the default audio codec of hls.
        # when codec changed, write the PAT/PMT table, but maybe ok util next ts.
        # so user can set the default codec for mp3.
        # the available audio codec:
        #       aac, mp3, an
        # Overwrite by env SRS_VHOST_HLS_HLS_ACODEC for all vhosts.
        # default: aac
        hls_acodec aac;
        # the default video codec of hls.
        # when codec changed, write the PAT/PMT table, but maybe ok util next ts.
        # so user can set the default codec for pure audio(without video) to vn.
        # the available video codec:
        #       h264, vn
        # Overwrite by env SRS_VHOST_HLS_HLS_VCODEC for all vhosts.
        # default: h264
        hls_vcodec h264;
        # whether cleanup the old expired ts files.
        # Overwrite by env SRS_VHOST_HLS_HLS_CLEANUP for all vhosts.
        # default: on
        hls_cleanup on;
        # If there is no incoming packets, dispose HLS in this timeout in seconds,
        # which removes all HLS files including m3u8 and ts files.
        # @remark 0 to disable dispose for publisher.
        # @remark apply for publisher timeout only, while "etc/init.d/srs stop" always dispose hls.
        # Overwrite by env SRS_VHOST_HLS_HLS_DISPOSE for all vhosts.
        # default: 120
        hls_dispose 120;
        # whether wait keyframe to reap segment,
        # if off, reap segment when duration exceed the fragment,
        # if on, reap segment when duration exceed and got keyframe.
        # Overwrite by env SRS_VHOST_HLS_HLS_WAIT_KEYFRAME for all vhosts.
        # default: on
        hls_wait_keyframe on;
        # whether use floor for the hls_ts_file path generation.
        # if on, use floor(timestamp/hls_fragment) as the variable [timestamp],
        #       and use enhanced algorithm to calc deviation for segment.
        # @remark when floor on, recommend the hls_segment>=2*gop.
        # Overwrite by env SRS_VHOST_HLS_HLS_TS_FLOOR for all vhosts.
        # default: off
        hls_ts_floor off;
        # the max size to notify hls,
        # to read max bytes from ts of specified cdn network,
        # @remark only used when on_hls_notify is config.
        # Overwrite by env SRS_VHOST_HLS_HLS_NB_NOTIFY for all vhosts.
        # default: 64
        hls_nb_notify 64;

        # Whether enable hls_ctx for HLS streaming, for which we create a "fake" connection for HTTP API and callback.
        # For each HLS streaming session, we use a child m3u8 with a session identified by query "hls_ctx", it simply
        # work as the session id.
        # Once the HLS streaming session is created, we will cleanup it when timeout in 2*hls_window seconds. So it
        # takes a long time period to identify the timeout.
        # Now we got a HLS stremaing session, just like RTMP/WebRTC/HTTP-FLV streaming, we're able to stat the session
        # as a "fake" connection, do HTTP callback when start playing the HLS streaming. You're able to do querying and
        # authentication.
        # Note that it will make NGINX edge cache always missed, so never enable HLS streaming if use NGINX edges.
        # Overwrite by env SRS_VHOST_HLS_HLS_CTX for all vhosts.
        # Default: on
        hls_ctx on;
        # For HLS pseudo streaming, whether enable the session for each TS segment.
        # If enabled, SRS HTTP API will show the statistics about HLS streaming bandwidth, both m3u8 and ts file. Please
        # note that it also consumes resource, because each ts file should be served by SRS, all NGINX cache will be
        # missed because we add session id to each ts file.
        # Note that it will make NGINX edge cache always missed, so never enable HLS streaming if use NGINX edges.
        # Overwrite by env SRS_VHOST_HLS_HLS_TS_CTX for all vhosts.
        # Default: on
        hls_ts_ctx on;

        # whether using AES encryption.
        # Overwrite by env SRS_VHOST_HLS_HLS_KEYS for all vhosts.
        # default: off
        hls_keys on;
        # the number of clear ts which one key can encrypt.
        # Overwrite by env SRS_VHOST_HLS_HLS_FRAGMENTS_PER_KEY for all vhosts.
        # default: 5
        hls_fragments_per_key 5;
        # the hls key file name.
        # we supports some variables to generate the filename.
        #       [vhost], the vhost of stream.
        #       [app], the app of stream.
        #       [stream], the stream name of stream.
        #       [seq], the sequence number of key corresponding to the ts.
        # Overwrite by env SRS_VHOST_HLS_HLS_KEY_FILE for all vhosts.
        hls_key_file [app]/[stream]-[seq].key;
        # the key output path.
        # the key file is configed by hls_path/hls_key_file, the default is:
        # ./objs/nginx/html/[app]/[stream]-[seq].key
        # Overwrite by env SRS_VHOST_HLS_HLS_KEY_FILE_PATH for all vhosts.
        hls_key_file_path ./objs/nginx/html;
        # the key root URL, use this can support https.
        # @remark It's optional.
        # Overwrite by env SRS_VHOST_HLS_HLS_KEY_URL for all vhosts.
        hls_key_url https://localhost:8080;

        # Special control controls.
        ###########################################
        # Whether calculate the DTS of audio frame directly.
        # If on, guess the specific DTS by AAC samples, please read https://github.com/ossrs/srs/issues/547#issuecomment-294350544
        # If off, directly turn the FLV timestamp to DTS, which might cause corrupt audio stream.
        # @remark Recommend to set to off, unless your audio stream sample-rate and timestamp is not correct.
        # Overwrite by env SRS_VHOST_HLS_HLS_DTS_DIRECTLY for all vhosts.
        # Default: on
        hls_dts_directly on;

        # on_hls, never config in here, should config in http_hooks.
        # for the hls http callback, @see http_hooks.on_hls of vhost hooks.callback.srs.com
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#http-callback
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#http-callback

        # on_hls_notify, never config in here, should config in http_hooks.
        # we support the variables to generate the notify url:
        #       [app], replace with the app.
        #       [stream], replace with the stream.
        #       [param], replace with the param.
        #       [ts_url], replace with the ts url.
        # for the hls http callback, @see http_hooks.on_hls_notify of vhost hooks.callback.srs.com
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/delivery-hls#on-hls-notify
        # @see https://ossrs.io/lts/en-us/docs/v4/doc/delivery-hls#on-hls-notify
    }
}
```

主要配置项如下：
* enabled：是否开启HLS，on/off，默认off。
* hls_fragment：秒，指定ts切片的最小长度。实际上ts文件的长度请参考[HLS TS Duration](#hls-ts-duration)的详细说明。
* hls_td_ratio：正常切片时长倍数。实际上ts文件的长度请参考[HLS TS Duration](#hls-ts-duration)的详细说明。
* hls_wait_keyframe: 是否按top切片，即等待到关键帧后开始切片。实际上ts文件的长度请参考[HLS TS Duration](#hls-ts-duration)的详细说明。
* hls_aof_ratio: 纯音频切片时长倍数。纯音频时，当ts时长超过配置的ls_fragment乘以这个系数时就切割文件。实际上ts文件的长度请参考[HLS TS Duration](#hls-ts-duration)的详细说明。
* hls_window：秒，指定HLS窗口大小，即m3u8中ts文件的时长之和，决定了m3u8中ts文件数量，详细参考[HLS TS Files](#hls-ts-files)。
* hls_path：HLS的m3u8和ts文件保存的路径。m3u8和ts文件都保存在这个目录中。
* hls_m3u8_file: HLS的m3u8文件名，包含可替换的`[vhost]`,`[app]`和`[stream]`变量。
* hls_ts_file: HLS的ts文件名，包含可替换的一系列变量，参考[dvr variables](./dvr.md#custom-path)，另外，`[seq]`是ts的seqence number。
* hls_entry_prefix: TS的base url。可选默认为空字符串；非空时加在ts前面作为base url。
* hls_acodec: 默认的音频编码。当流的编码改变时，会更新PMT/PAT信息；默认是aac，因此默认的PMT/PAT信息是aac；如果流是mp3，那么可以配置这个参数为mp3，避免PMT/PAT改变。
* hls_vcodec: 默认的视频编码。当流的编码改变时，会更新PMT/PAT信息；默认是h264。如果是纯音频HLS，可以配置为vn，可以减少SRS检测纯音频的时间，直接进入纯音频模式。
* hls_cleanup: 是否删除过期的ts切片，不在hls_window中就是过期。可以关闭清除ts切片，实现时移和存储，使用自己的切片管理系统。
* hls_dispose: 在没有流时，HLS清理的过期时间（秒），系统重启或者超过这个时间时，清理HLS的所有文件，包括m3u8和ts。若配置为0，则不清理。
* hls_nb_notify: 从notify服务器读取数据的长度。
* on_hls: 当切片生成时，回调这个url，使用POST回调。用来和自己的系统集成，譬如实现切片移动等。
* on_hls_notify: 当切片生成时，回调这个url，使用GET回调。用来和系统集成，可以使用`[ts_url]`变量，实现预分发(即下载一次ts片)。

## HLS TS Duration

HLS的TS切片时长如何决定的？由配置和流的特征决定的。

若有视频，切片时长为`max(hls_fragment*hls_td_ratio, gop_size*N)`，即`hls_fragment`和`gop_size`中的最大值。
而`gop_size`则是由编码器决定的，比如OBS可以设置GOP大小单位是秒，而FFmpeg则是帧数量结合帧率可以换算成秒。

举个例子，若流的帧率是25，GOP是50帧，那么`gop_size`就是2秒：

* 若`hls_fragment`是10秒，那么最终的TS切片时长就是10秒。
* 若`hls_fragment`是5秒，那么最终的TS切片时长就是6秒，此时有3个GOP。
* 若`hls_fragment`是5秒，`hls_td_ratio`是2，那么最终的TS切片时长就是10秒。

若配置了`hls_wait_keyframe off`，则不再参考GOP大小，无论GOP多大，假设GOP是10秒：

* 若`hls_fragment`是10秒，那么最终的TS切片时长就是10秒。
* 若`hls_fragment`是5秒，那么最终的TS切片时长就是5秒。
* 若`hls_fragment`是3秒，`hls_td_ratio`是2，那么最终的TS切片时长就是6秒。

> Note: 由此可见，关闭`hls_wait_keyframe`后，可以减少切片大小，从而减少延迟，但是由于以非关键帧开头，有些播放器开始播放时可能会有花屏。

若无视频，即纯音频HLS，则切片无法根据GOP大小决定，则是根据`hls_fragment*hls_aof_ratio`决定的：

* 若`hls_fragment`是10秒，`hls_aof_ratio`是1.2，那么最终的TS切片时长就是12秒。
* 若`hls_fragment`是5秒，`hls_aof_ratio`是1，那么最终的TS切片时长就是5秒。

注意若切片时长异常，超过了一定的大小，一般是3倍切片的最大长度，则会直接丢弃。

## HLS TS Files

m3u8中的TS文件数量，由TS的时长和`hls_window`决定的。 当TS的总时长，超过`hls_window`后，丢弃第一个m3u8中的第一个切片，
直到ts的总时长在这个配置项范围之内。

即SRS保证下面的公式：

```bash
hls_window >= sum(m3u8中每个ts的时长)
```

举个例子，若`hls_window`是60秒，`hls_fragment`是10秒，若TS实际切片时长是10秒，那么m3u8中的ts文件数量是6个。
当然TS实际切片时长，可能比`hls_fragment`要大，具体参考[HLS TS Duration](#hls-ts-duration)。

## HTTP Callback

可以配置`on_hls`实现回调，应该在`http_hooks`中配置，而不是在hls中配置。

备注：HLS热备可以基于这个回调实现，参考[#351](https://github.com/ossrs/srs/issues/351).

备注：HLS热备必须保证两个服务器的切片<b>完全</b>一样，因为负载均衡器或者边缘可能从两个服务器取切片，必须完全一样。因此在切片上保证两个服务器切片完全一致，是一个非常非常复杂的流媒体问题；但是通过业务系统和回调，通过选择两个服务器的切片的方式，可以做到非常简单可靠的HLS热备系统。

## HLS Authentication

SRS支持HLS客户端播放和在线人数的统计，默认会开启`hls_ctx`和`hls_ts_ctx`，这样HLS和其他协议一样，可以通过回调实现鉴权播放和数据统计。
比如在播放HLS时，通过`on_play`回调返回错误，实现拒绝客户端播放的功能。

```bash
vhost __defaultVhost__ {
    hls {
        enabled  on;
        hls_ctx on;
        hls_ts_ctx on;
    }
}
```

但这个功能会导致HLS在CDN的缓存失效，因为每个播放都会有不同的ctx_id，类似会话ID的功能。因此，在[HLS Cluster](./nginx-for-hls.md)
中必须关闭这两个选项。

## HLS Dispose

若停止推流，HLS由于切片文件依然存在，客户端依然还可以播放，不过播放的是之前的内容。

有时候直播中，临时需要停止推流后，更换编码参数或者推流设备，然后重新推流。因此SRS不能在停止推流时就删除HLS的文件。

SRS默认是会在`hls_dispose`配置的时间后，再清理HLS的切片文件。这个时间默认是120秒，即2分钟后，清理HLS的切片文件。

```bash
vhost __defaultVhost__ {
    hls {
        enabled  on;
        hls_dispose 120;
    }
}
```

若需要更快清理，则可以缩短这个清理时间，但这个配置不能配置太短，建议不要小于`hls_window`，否则可能会在重新推流时，
出现过早清理的情况，导致播放器无法访问到HLS流。

## HLS in RAM

若需要提高HLS的并发数量，可以试用内存直接分发HLS，不写入磁盘。

可以挂载内存为磁盘目录，然后将HLS切片写入内存盘：

```bash
mkdir -p /ramdisk &&
mount -o size=7G -t tmpfs none /ramdisk
```

> Note: 取消挂载内存盘，可以使用命令`unmount /randisk`即可。

> Note: 若流路数不多，需要磁盘空间不大，可以将HLS切片写入`/tmp`目录，`/tmp`默认就是内存盘。

然后配置`hls_path`，或者软链接目录即可。

## HLS Delivery Cluster

部署HLS的分发集群，边缘分发集群，实现自建CDN分发HLS，解决海量的观看问题，请参考[Nginx for HLS](./nginx-for-hls.md)。

## HLS Low Latency

如何降低HLS延迟？关键减少切片数量，减少m3u8中的TS文件数量。SRS的默认配置是10秒一个切片，60秒一个m3u8，这样延迟是30秒左右。
因为有些播放器是从中间位置开始请求切片，也就是第3个切片开始请求，因此会有3个切片的延迟。

我们可以调整下面三个配置，可以将延迟降低到6到8秒左右：

* 减少GOP大小，比如设置OBS的GOP为1秒，或者FFmpeg的GOP为FPS的帧数。
* 减少`hls_fragment`，比如设置为2秒，或者1秒。
* 减少`hls_window`，比如配置为10秒，或者5秒。
* 使用低延迟播放器，比如hls.js或者fijkplayer或ffplay，不要使用VLC等很高延迟的播放器。

参考配置文件`conf/hls.realtime.conf`：

```bash
vhost __defaultVhost__ {
    hls {
        enabled  on;
        hls_fragment 2;
        hls_window 10;
    }
}
```

> Note: 若无法调整编码器的OGP大小，则可以考虑配置`hls_wait_keyframe off`，不参考GOP，但可能会有花屏，请测试你的设备的支持情况。

当然，也不能减少得非常少，容易造成播放器缓冲不足，或者播放器网络不佳时跳片，可能会有播放失败。
延迟越低，卡顿概率越高，HLS的延迟并不能做到5秒之内，特别是考虑CDN和播放器的适配情况。

如果需要5秒之内的延迟，建议使用[HTTP-FLV](./sample-http-flv.md)或者[SRT](./srt.md)或者[WebRTC](./webrtc.md)等协议。

## ON HLS Notify

可以配置`on_hls_notify`实现CDN预分发，应该在`http_hooks`中配置，而不是在hls中配置。

## HLS Audio Corrupt

HLS可能会有爆音的问题，这是因为AAC的采样率导致在FLV(tbn=1000)和TS(tbn=90000)之间变换时，引入了微小的误差导致的。SRS3使用采样个数来计算精确的时间戳，详细参考[HLS爆音](https://github.com/ossrs/srs/issues/547#issuecomment-294350544)。

> 注意：如果需要解决HLS爆音问题，需要手动禁用`hls_dts_directly`(设为off)。

燃鹅，SRS3修正后，发现有些音频流本身的时间戳是有问题，导致从AAC采样个数计算出来的时间戳不对，所以提供了配置项`hls_dts_directly`强制使用原始时间戳，参考[HLS强制使用原始时间戳](https://github.com/ossrs/srs/issues/547#issuecomment-563942711)。

## HLS Audio Only

SRS支持分发HLS纯音频流，当RTMP流没有视频，且音频为aac（可以使用转码转为aac，参考[Usage: Transcode2HLS](./sample-transcode-to-hls.md)），SRS只切片音频。

若RTMP流中已经有视频和音频，需要支持纯音频HLS流，可以用转码将视频去掉，参考：[转码: 禁用流](./ffmpeg.md#%E7%A6%81%E7%94%A8)。然后分发音频流。

分发纯音频流不需要特殊配置，和HLS分发一样。

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

SRS目前不支持HLS自适应码流，因为一般需要将一个码流转码为多个码流，而且需要GOP对齐，可以使用FFmpeg实现，
参考[How to generate multiple resolutions HLS using FFmpeg for live streaming](https://stackoverflow.com/a/71985380/17679565)。

## Apple Examples

Apple的HLS的示例文件：

https://developer.apple.com/library/ios/technotes/tn2288/_index.html

## HLS Encryption

SRS3支持切片加密，具体使用方法参考[#1093](https://github.com/ossrs/srs/issues/1093#issuecomment-415971022)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/hls)

