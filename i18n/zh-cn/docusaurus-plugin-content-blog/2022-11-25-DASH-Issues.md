---
slug: why-dash-is-bad-solution-for-live-streaming
title: SRS Server - 为何DASH是个很烂的直播协议
authors: []
tags: [video, dash, live, streaming]
custom_edit_url: null
---

# Why DASH Is Bad Solution for Live Streaming

> Written by [John](https://github.com/xiaozhihong), [Winlin](https://github.com/winlinvip)

什么是MPEG-DASH(Dynamic Adaptive Streaming over HTTP)? 一群大牛觉得HLS不够好，所以做了一个更烂的流媒体协议叫做DASH或MPEG-DASH。

当然，这只是对所有新技术的调侃而已，特别是当新技术还不够成熟时。当然，DASH现在的状态，确实问题还不少。我们在支持DASH时，非常难受。

不过，在流媒体中DASH使用得越来越多，我们也相信这些问题迟早会被解决，这篇文章总结了我们遇到的一些问题。

<!--truncate-->

## Good News: Normal Scenario

在一般的场景中，DASH已经完全够用了，对于VoD和LIVE都是如此。你可以用下面命令快速尝试DASH：

```bash
docker run --rm -it -p 8080:8080 -p 1935:1935 \
  -e SRS_HTTP_SERVER_ENABLED=on -e SRS_VHOST_DASH_ENABLED=on \
  ossrs/srs:5
```

推流一个RTMP直播流到服务器：

```bash
docker run --rm -it ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -c copy -f flv rtmp://host.docker.internal/live/livestream
```

简单两个命令，你就可以播放DASH流了：

* VLC: `http://localhost:8080/live/livestream.mpd`
* FFmpeg: `ffplay http://localhost:8080/live/livestream.mpd`
* H5 [srs-player](http://localhost:8080/players/srs_player.html?stream=livestream.mpd&autostart=true)

其实用起来还是非常简单的。

## Bad News: Republishing

DASH的问题到底有哪些？

如果你尝试长时间运行[srs-player](http://localhost:8080/players/srs_player.html?stream=livestream.mpd&autostart=true)，等待一
定的时间，你会发现播放器可能会卡住，特别是当流重推时。

可能这是SRS播放器的问题，使用的是[dash.js@v4.5.1](https://github.com/Dash-Industry-Forum/dash.js)，我们看看其他播放器。

大名鼎鼎的VLC怎么样？在重推时，一样会卡死。

大家常用的ffplay怎么样？一样会卡死。

这些问题大多由流重推引起，也就是停止推流，然后重新推流，播放器有一定概率会卡住。

> Note: 刷新页面，播放器还是能继续播放的，所以容错还是可以的。

对于HLS，使用的是`EXT-X-DISCONTINUITY`来应对这种场景，播放器都工作得很好。

而DASH，规范中介绍了新的Period，但我们尝试后没有作用。SRS目前做法是重新生成新的MPD文件，这让dash.js工作得很好，但是其他播放器不行。

## Bad News: MPD Mode

如果使用`SegmentTimeline`和`$Time$`模式，在`VLC 3.0.17`中依然有问题，但是`VLC 4.0`工作良好。详细的情况请参考
[VLC#2845](https://code.videolan.org/videolan/vlc/-/merge_requests/2845).

如果使用`SegmentTemplate`，但不使用`SegmentTimeline`，播放器会猜测需要访问的文件名，基本上就会失败。SRS 4.0使用这种简单的模式，但一直都
有bug，参考[SRS#1864](https://github.com/ossrs/srs/issues/1864)，因此SRS 5.0解决了这个问题，不再使用这种模式。

SRS 5.0使用`SegmentTemplate`和`SegmentTimeline`，并且使用`$Number$`而不使用`$Time$`模式，因为`$Time$`模式下VLC依然有问题，参考前面
的描述。

到现在为止，2022.11，兼容性最好的方式是`SegmentTemplate`和`SegmentTimeline`和`$Number$`模式，这也是SRS 5.0采用的方式。这种模式下，
dash.js工作很好，但是VLC/ffplay依然有些问题。

## About HEVC

[Chrome 105+](https://caniuse.com/?search=HEVC)默认已经支持HEVC了，参考[这篇文章](https://zhuanlan.zhihu.com/p/541082191).

可以用Chrome直接播放MP4(HEVC)文件，或者用MSE来播放HTTP-FLV/HTTP-TS/HLS等。推荐使用[mpegts.js](https://github.com/xqq/mpegts.js)
播放HTTP-FLV/HTTP-TS(HEVC)流，详细请参考[SRS#465](https://github.com/ossrs/srs/issues/465#usage).

对于DASH，并没有限制是H.264还是HEVC，只要浏览器能播放MP4(HEVC)，就能支持。

当然，对于流媒体服务器还有些工作要做，需要支持MP4(HEVC)，SRS 6.0正在实现这个功能，详细请参考
[SRS#465](https://github.com/ossrs/srs/issues/465#status-of-hevc-in-srs).

## Publish by H5 then Delivery by DASH

如果希望使用H5推流，然后使用MPEG-DASH分发流媒体，你可以使用以下方案：

```bash
Camera/Microphone --WebRTC---> SRS --DASH--> Viewers
```

由于浏览器推流，只能使用WebRTC，因此需要一个流媒体服务器，将WebRTC转换成DASH。SRS就可以实现，详细请参考
[这里](/docs/v5/doc/getting-started#webrtc-for-live-streaming).

注意SRS也支持[WebRTC-HTTP ingestion protocol (WHIP)](https://datatracker.ietf.org/doc/draft-ietf-wish-whip/)，例如
[srs-unity](https://github.com/ossrs/srs-unity)就是使用WHIP实现Unity环境的推流。

## Conclusion

DASH是一个相对比较新的流媒体协议。在两年持续不断的解决问题后，SRS 5.0认为DASH功能已经逐渐稳定，可以在生产环境使用了。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/2022-11-25-DASH-Issues)

