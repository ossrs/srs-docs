---
title: RTMP
sidebar_label: RTMP
hide_title: false
hide_table_of_contents: false
---

# RTMP

RTMP是直播的事实标准，这么多年以来一直是使用最广泛的直播协议。

然而Adobe公司没有一直更新RTMP协议，也没有提交给标准组织比如RFC，因此很多新功能都没有支持，比如HEVC或Opus。
直到2023.03，终于[Enhanced RTMP](https://github.com/veovera/enhanced-rtmp)项目建立，开始支持了HEVC和AV1，
SRS和OBS已经支持了基于Enhanced RTMP的[HEVC](https://github.com/veovera/enhanced-rtmp/issues/4)编码。

在流的制作方面，最近几年，SRT、WebRTC和SRT增长迅速，很多设备都支持了SRT和RIST协议。你也可以用WebRTC做直播。

在流的分发上，HLS是使用最广泛的协议，所有CDN和设备都支持，比如PC，iOS，Android或平板电脑。当然HLS延迟比较大(3~5s+)，
你可以选择HTTP-FLV，HTTP-TS或者WebRTC，如果需要降低延迟。

至今为止，在内容制作领域，RTMP还是使用最广泛的协议。比如你可以用OBS推流到B站、视频号或快手。如果要对接一个广播设备，
或者推流到某个平台，那么RTMP是最好的选择，几乎都会支持。

## Usage

SRS内置RTMP的支持，可以用[docker](./getting-started.md)或者[从源码编译](./getting-started-build.md):

```bash
docker run --rm -it -p 1935:1935 registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5 \
  ./objs/srs -c conf/rtmp.conf
```

使用 [FFmpeg(点击下载)](https://ffmpeg.org/download.html) 或 [OBS(点击下载)](https://obsproject.com/download) 推流：

```bash
ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream
```

打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:

* RTMP (by [VLC](https://www.videolan.org/)): `rtmp://localhost/live/livestream`

SRS支持将RTMP转换成其他协议，下面会详细描述。

## On Demand Live Streaming

有些场景下，是有需要播放时，才会邀请开始推流：

1. 推流端连接到系统，但并不会推流到SRS。
2. 播放器连接到系统，向系统请求播放流。
3. 系统通知推流端，开始推流到SRS。
4. 播放器从SRS拉流播放。

请注意`系统`是指你的业务系统，而不是SRS。

这就是我们所说的`按需直播`或`按需推流`。如果播放器停止拉流，会怎么样？

1. 系统需要通知推流端停止推流。
2. 或者，在最后一个播放器停止拉流时，SRS等待一定时间后断开推流。

[这个PR](https://github.com/ossrs/srs/pull/3105)就是第2个解决方案，这样这个功能就非常容易使用。你的系统
不再需要通知推流端停止推流，因为SRS会主动断开。

## Config

RTMP协议相关配置如下：

```nginx
vhost __defaultVhost__ {
    # whether enable min delay mode for vhost.
    # for min latency mode:
    # 1. disable the publish.mr for vhost.
    # 2. use timeout for cond wait for consumer queue.
    # @see https://github.com/ossrs/srs/issues/257
    # default: off (for RTMP/HTTP-FLV)
    # default: on (for WebRTC)
    min_latency off;

    # whether enable the TCP_NODELAY
    # if on, set the nodelay of fd by setsockopt
    # Overwrite by env SRS_VHOST_TCP_NODELAY for all vhosts.
    # default: off
    tcp_nodelay off;

    # the default chunk size is 128, max is 65536,
    # some client does not support chunk size change,
    # vhost chunk size will override the global value.
    # Overwrite by env SRS_VHOST_CHUNK_SIZE for all vhosts.
    # default: global chunk size.
    chunk_size 128;
    
    # The input ack size, 0 to not set.
    # Generally, it's set by the message from peer,
    # but for some peer(encoder), it never send message but use a different ack size.
    # We can chnage the default ack size in server-side, to send acknowledge message,
    # or the encoder maybe blocked after publishing for some time.
    # Overwrite by env SRS_VHOST_IN_ACK_SIZE for all vhosts.
    # Default: 0
    in_ack_size 0;
    
    # The output ack size, 0 to not set.
    # This is used to notify the peer(player) to send acknowledge to server.
    # Overwrite by env SRS_VHOST_OUT_ACK_SIZE for all vhosts.
    # Default: 2500000
    out_ack_size 2500000;
    
    # the config for FMLE/Flash publisher, which push RTMP to SRS.
    publish {
        # about MR, read https://github.com/ossrs/srs/issues/241
        # when enabled the mr, SRS will read as large as possible.
        # Overwrite by env SRS_VHOST_PUBLISH_MR for all vhosts.
        # default: off
        mr off;
        # the latency in ms for MR(merged-read),
        # the performance+ when latency+, and memory+,
        #       memory(buffer) = latency * kbps / 8
        # for example, latency=500ms, kbps=3000kbps, each publish connection will consume
        #       memory = 500 * 3000 / 8 = 187500B = 183KB
        # when there are 2500 publisher, the total memory of SRS at least:
        #       183KB * 2500 = 446MB
        # the recommended value is [300, 2000]
        # Overwrite by env SRS_VHOST_PUBLISH_MR_LATENCY for all vhosts.
        # default: 350
        mr_latency 350;

        # the 1st packet timeout in ms for encoder.
        # Overwrite by env SRS_VHOST_PUBLISH_FIRSTPKT_TIMEOUT for all vhosts.
        # default: 20000
        firstpkt_timeout 20000;
        # the normal packet timeout in ms for encoder.
        # Overwrite by env SRS_VHOST_PUBLISH_NORMAL_TIMEOUT for all vhosts.
        # default: 5000
        normal_timeout 7000;
        # whether parse the sps when publish stream.
        # we can got the resolution of video for stat api.
        # but we may failed to cause publish failed.
        # @remark If disabled, HLS might never update the sps/pps, it depends on this.
        # Overwrite by env SRS_VHOST_PUBLISH_PARSE_SPS for all vhosts.
        # default: on
        parse_sps on;
        # When parsing SPS/PPS, whether try ANNEXB first. If not, try IBMF first, then ANNEXB.
        # Overwrite by env SRS_VHOST_PUBLISH_TRY_ANNEXB_FIRST for all vhosts.
        # default: on
        try_annexb_first on;
        # The timeout in seconds to disconnect publisher when idle, which means no players.
        # Note that 0 means no timeout or this feature is disabled.
        # Note that this feature conflicts with forward, because it disconnect the publisher stream.
        # Overwrite by env SRS_VHOST_PUBLISH_KICKOFF_FOR_IDLE for all vhosts.
        # default: 0
        kickoff_for_idle 0;
    }
    
    # for play client, both RTMP and other stream clients,
    # for instance, the HTTP FLV stream clients.
    play {
        # whether cache the last gop.
        # if on, cache the last gop and dispatch to client,
        #   to enabled fast startup for client, client play immediately.
        # if off, send the latest media data to client,
        #   client need to wait for the next Iframe to decode and show the video.
        # set to off if requires min delay;
        # set to on if requires client fast startup.
        # Overwrite by env SRS_VHOST_PLAY_GOP_CACHE for all vhosts.
        # default: on
        gop_cache off;

        # Limit the max frames in gop cache. It might cause OOM if video stream has no IDR frame, so we limit to N
        # frames by default. Note that it's the size of gop cache, including videos, audios and other messages.
        # Overwrite by env SRS_VHOST_PLAY_GOP_CACHE_MAX_FRAMES for all vhosts.
        # default: 2500
        gop_cache_max_frames 2500;

        # the max live queue length in seconds.
        # if the messages in the queue exceed the max length,
        # drop the old whole gop.
        # Overwrite by env SRS_VHOST_PLAY_QUEUE_LENGTH for all vhosts.
        # default: 30
        queue_length 10;

        # about the stream monotonically increasing:
        #   1. video timestamp is monotonically increasing,
        #   2. audio timestamp is monotonically increasing,
        #   3. video and audio timestamp is interleaved/mixed monotonically increasing.
        # it's specified by RTMP specification, @see 3. Byte Order, Alignment, and Time Format
        # however, some encoder cannot provides this feature, please set this to off to ignore time jitter.
        # the time jitter algorithm:
        #   1. full, to ensure stream start at zero, and ensure stream monotonically increasing.
        #   2. zero, only ensure stream start at zero, ignore timestamp jitter.
        #   3. off, disable the time jitter algorithm, like atc.
        # @remark for full, correct timestamp only when |delta| > 250ms.
        # @remark disabled when atc is on.
        # Overwrite by env SRS_VHOST_PLAY_TIME_JITTER for all vhosts.
        # default: full
        time_jitter full;
        # vhost for atc for hls/hds/rtmp backup.
        # generally, atc default to off, server delivery rtmp stream to client(flash) timestamp from 0.
        # when atc is on, server delivery rtmp stream by absolute time.
        # atc is used, for instance, encoder will copy stream to master and slave server,
        # server use atc to delivery stream to edge/client, where stream time from master/slave server
        # is always the same, client/tools can slice RTMP stream to HLS according to the same time,
        # if the time not the same, the HLS stream cannot slice to support system backup.
        #
        # @see http://www.adobe.com/cn/devnet/adobe-media-server/articles/varnish-sample-for-failover.html
        # @see http://www.baidu.com/#wd=hds%20hls%20atc
        #
        # @remark when atc is on, auto off the time_jitter
        # Overwrite by env SRS_VHOST_PLAY_ATC for all vhosts.
        # default: off
        atc off;
        # whether use the interleaved/mixed algorithm to correct the timestamp.
        # if on, always ensure the timestamp of audio+video is interleaved/mixed monotonically increase.
        # if off, use time_jitter to correct the timestamp if required.
        # @remark to use mix_correct, atc should on(or time_jitter should off).
        # Overwrite by env SRS_VHOST_PLAY_MIX_CORRECT for all vhosts.
        # default: off
        mix_correct off;

        # whether enable the auto atc,
        # if enabled, detect the bravo_atc="true" in onMetaData packet,
        # set atc to on if matched.
        # always ignore the onMetaData if atc_auto is off.
        # Overwrite by env SRS_VHOST_PLAY_ATC_AUTO for all vhosts.
        # default: off
        atc_auto off;

        # set the MW(merged-write) latency in ms.
        # SRS always set mw on, so we just set the latency value.
        # the latency of stream >= mw_latency + mr_latency
        # the value recomment is [300, 1800]
        # @remark For WebRTC, we enable pass-by-timestamp mode, so we ignore this config.
        # default: 350 (For RTMP/HTTP-FLV)
        # Overwrite by env SRS_VHOST_PLAY_MW_LATENCY for all vhosts.
        # default: 0 (For WebRTC)
        mw_latency 350;

        # Set the MW(merged-write) min messages.
        # default: 0 (For Real-Time, min_latency on)
        # default: 1 (For WebRTC, min_latency off)
        # default: 8 (For RTMP/HTTP-FLV, min_latency off).
        # Overwrite by env SRS_VHOST_PLAY_MW_MSGS for all vhosts.
        mw_msgs 8;

        # the minimal packets send interval in ms,
        # used to control the ndiff of stream by srs_rtmp_dump,
        # for example, some device can only accept some stream which
        # delivery packets in constant interval(not cbr).
        # @remark 0 to disable the minimal interval.
        # @remark >0 to make the srs to send message one by one.
        # @remark user can get the right packets interval in ms by srs_rtmp_dump.
        # Overwrite by env SRS_VHOST_PLAY_SEND_MIN_INTERVAL for all vhosts.
        # default: 0
        send_min_interval 10.0;
        # whether reduce the sequence header,
        # for some client which cannot got duplicated sequence header,
        # while the sequence header is not changed yet.
        # Overwrite by env SRS_VHOST_PLAY_REDUCE_SEQUENCE_HEADER for all vhosts.
        # default: off
        reduce_sequence_header on;
    }
}
```

这里只是推流和拉流的配置，还有些其他的配置是在其他地方的，比如RTMP转HTTP-FLV或HTTP-TS等。

## Converting RTMP to HLS

如果需要将RTMP转HLS协议，请参考[HLS](./sample-hls.md).

## Converting RTMP to HTTP-FLV

如果需要将RTMP转HTTP-FLV或HTTP-TS协议，请参考[HTTP-FLV](./sample-http-flv.md).

## Converting RTMP to WebRTC

如果需要将RTMP转WebRTC协议，请参考[WebRTC: RTMP to RTC](./webrtc.md#rtmp-to-rtc).

## Converting RTMP to MPEGTS-DASH

如果需要将RTMP转DASH协议是，参考[DASH](./sample-dash.md).

## Converting SRT to RTMP

如果需要将SRT转RTMP协议，参考[SRT](./sample-srt.md).

## Converting WebRTC to RTMP

如果需要将WebRTC协议转RTMP协议，参考[WebRTC: RTC to RTMP](./webrtc.md#rtc-to-rtmp).

## RTMP Cluster

如果需要支持很多播放器播放，参考[Edge Cluster](./edge.md).

如果需要支持很多推流，或者很多路流，参考[Origin Cluster](./origin-cluster.md).

关于流媒体的负载均衡，还有很多其他方案，可以参考[load balancing](/blog/load-balancing-streaming-servers).

## Low Latency RTMP

如果希望降低RTMP的延迟，请参考[LowLatency](./low-latency.md).

## Timestamp Jitter

SRS支持校准RTMP的时间戳，参考[Jitter](./time-jitter.md).

如果希望SRS能保持原始时间戳，参考[ATC](./rtmp-atc.md).

## Performance

SRS使用writev实现高性能RTMP分发，参考[benchmark](./performance.md##performance-banchmark)

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/rtmp)