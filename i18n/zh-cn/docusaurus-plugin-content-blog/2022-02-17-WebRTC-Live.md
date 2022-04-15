# 什么时候应该和不应该用WebRTC做直播？

什么时候应该和不应该用WebRTC做直播？为什么说WebRTC做直播，不是潮流而是大坑？

这是和Thegobot在Discord上讨论的文章。

## About send stream

如果是需要用H5推流，把浏览器当OBS使用，那么只有WebRTC可用。

如果需要支持移动端，比如iOS或Android，在直播场景FFmpeg/OBS比WebRTC要更合适。

如果要适配广播媒体领域的各种推流设备，比如各种推流背包，那么WebRTC目前(2022)绝对支持得不好。若希望降低延迟，应该选择SRT而不是WebRTC。

## About play stream

如果是从播放器角度来说，对于直播场景，MSE是比WebRTC成熟得多的技术，几乎目前所有直播平台都是用MSE在播放。

可能MSE会有些Bug，问题是谁没有Bug，WebRTC的Bug更多得多。而且MSE的Bug也不是HTTP-FLV协议封装的问题，同样用DASH或HLS也有。

如果需要支持iOS或Android，在直播领域FFmpeg同样是个更合适的选择，例如ijkplayer，可以播放RTMP或HTTP-FLV，是非常成熟的方案。

所以如何选择播放器，完全取决于你的客户端，如果只有PC H5，那么WebRTC或MSE都行，当然WebRTC的服务器更复杂。

最后，关于直播的延迟，HTTP-FLV一样延迟也很低，大约1~3秒。想要做得更低么？要想好了，因为可能会引入其他问题，比如卡顿。

做直播是否500ms的延迟是刚需？是否它就比1~3秒延迟更好？我反正不这么认为。

## Known Issues

据我所知，WebRTC做直播还有以下问题：

1. 需要更长的起播时间，也就是黑屏时间更长，用户得看更久的黑黢黢的画面。
1. 目前CDN还不是广泛支持，当然已经有了一部分CDN开始在支持了，还是螃蟹阶段。
1. 需要更多的服务器分发流，因为加密、QoS、UDP性能三座大山，导致服务器成本更高。
1. 移动端设备适配WebRTC有各种问题，特别是H5浏览器，Native会适配好点但为何不用完全没问题的FLV呢。
1. 生态支持还不完善，特别是推流端，估计FFmpeg永远都不会支持WebRTC，他们已经被SRT还有RIST蒙蔽了闪亮的双眼。
1. 画质更差，由于WebRTC的核心诉求是保障延迟，所以它会牺牲画质，当然可以魔改魔改问题是真的不容易持久维护。
1. 录制不友好，同样由于WebRTC为了追求低延迟，所以喜欢弄开放Gop，总变换I帧，还喜欢玩高大上的AV1，都是让直播录制服务扑街的操作。
1. 音频转码损耗很高，由于直播使用的是AAC，而WebRTC用的是Opus，转码总有成本还容易出问题，当然可以魔改，额。
1. WebRTC技术栈还不稳定，各种新玩意儿自己都绕晕了吧，WebTransport还没唱完，来个WebCodec，还有WASM。
1. 最后，基于UDP而有时候UDP就是被封了，嗯你说有TCP，那就干脆用FLV算了。

如果你坚持要吃WebRTC搞直播的螃蟹，可以尝试尝试，然后给我一些反馈。

## Conclusion

其实，WebRTC就不是为直播设计的，最合适的场景就是H5推流，其他情况请考虑普通的直播技术，比如RTMP、HLS、HTTP-FLV或SRT。

对于直播而言，WebRTC不是潮流，而是坑中坑，没有最坑只有更坑。

欢迎关注SRS的公众号，加微信群请看[这里](https://github.com/ossrs/srs/wikis/Contact#wechat)。

