---
slug: lets-do-h265-live-streaming
title: SRS Server - H.265直播省一半带宽费用
authors: []
tags: [architecture, hevc, h265, codec, live]
custom_edit_url: null
---

# Let's Do H265 Live Streaming

> Written by [Winlin](https://github.com/winlinvip), [runner365](https://github.com/runner365), [yinjiaoyuan](https://github.com/yinjiaoyuan), [PieerePi](https://github.com/PieerePi), [qichaoshen82](https://github.com/qichaoshen82), [ZSC714725](https://github.com/ZSC714725), [bluestn](https://github.com/bluestn), [mapengfei53](https://github.com/mapengfei53), [chundonglinlin](https://github.com/chundonglinlin), [duiniuluantanqin](https://github.com/duiniuluantanqin), [panda1986](https://github.com/panda1986)

经过七年的酝酿和开发，SRS在6.0中终于正式支持了HEVC(H.265)，几乎全面支持，包括RTMP、FLV、SRT、TS、HLS、DASH、GB28181、WebRTC(Safari)、DVR FLV、DVR MP4、WordPress SrsPlayer等等。

一般H.265比H.264，可以省50%带宽，就是省50%的钱哈。

<!--truncate-->

在大多数商业公司中，七年，黄花菜都凉了。开源项目只要能做出来，哪怕慢一些，也能活久见。

## Why Important?

H.265比H.264的编码效率更高，不过一个编解码的更新换代，一般是以N个10年为基准的，现在也不能说H.265就能完全替换H.264，还有不少遗留问题。

H.265的收益就不用说了，可以用更少的带宽，传输同样的质量，这就是省钱啊。

此外，8K的朋友必须H.265，大约在9Mbps码率，而H.264得30Mbps而且最高分辨率无法支持8K。

但省钱的前提是不出问题，如果用户的设备支持H.265有问题，那就会引起投诉和体验问题，反而造成更大的成本。

当然了可以将 H.265转码一个H.264的流出来，给那些只支持H.264的设备用，不过这样一样会引入转码成本了。

而H.265正有这一堆的问题，所以如果你想要选择H.265，一定要想好了，看看你的场景下收益是否能超过要付出的成本。

## Status of H.265

下面是各种场景下，H.265的支持情况，可以阅读原文，看详细的Commit。

第一部分，推流，推流端基本是支持的，通过打Patch也可以支持：

* [x] 原生支持：使用FFmpeg推SRT流，目前支持得最好的方式。
* [x] 原生支持：OBS推SRT流，需要有硬件支持。
* [x] 原生支持：摄像头推GB28181流，基本上都支持。
* [x] 补丁支持：使用FFmpeg推RTMP流，需要打[Patch](https://github.com/ossrs/srs/issues/465#ffmpeg-tools)
* [x] 配置支持：Safari浏览器推WebRTC流，需要手动点下菜单栏的选项才能开启。
* [ ] 不支持：Chrome/Firefox推WebRTC流。
* [ ] 不支持：使用OBS推流RTMP流。

第二部分，FFmpeg/ffplay拉流，支持度是比较完善的：

* [x] 原生支持：使用FFmpeg拉HTTP-TS流。
* [x] 原生支持：使用FFmpeg拉HLS流。
* [x] 原生支持：使用FFmpeg拉MPEG-DASH流。
* [x] 原生支持：使用FFmpeg拉SRT流。
* [x] 原生支持：使用ffplay播放HTTP-TS流。
* [x] 原生支持：使用ffplay播放HLS流。
* [x] 原生支持：使用ffplay播放MPEG-DASH流。
* [x] 原生支持：使用ffplay播放SRT流。
* [x] 补丁支持：使用FFmpeg拉RTMP流。
* [x] 补丁支持：使用FFmpeg拉HTTP-FLV流。
* [x] 补丁支持：使用ffplay播放RTMP流。
* [x] 补丁支持：使用ffplay播放HTTP-FLV流。

第三部分，浏览器H5播放流，MSE支持，但也需要上层播放器库支持：

* [x] 原生支持：使用Chrome播放HTTP-TS流，需要硬解支持，SRS使用mpegts.js。
* [x] 原生支持：使用Chrome播放HTTP-FLV流，需要硬解支持，SRS使用mpegts.js。
* [x] 配置支持：使用Safari拉WebRTC流，需要手动点下菜单栏开启。
* [ ] 不支持：使用Chrome [hls.js](https://github.com/video-dev/hls.js)播放HLS流。底层MSE支持，但hls.js是负责将HLS转fMP4，也需要支持才行。
* [ ] 不支持：使用Chrome [dash.js](https://github.com/Dash-Industry-Forum/dash.js)播放DASH流。底层MSE支持，但dash.js是负责将DASH转fMP4，也需要支持才行。
* [ ] 不支持：使用Chrome/Firefox拉WebRTC流。暂时没有看到有支持的可能，Chrome主要是在做AV1方向。

第四部分，VLC播放流，对于TS和MP4封装支持比较好：

* [x] 原生支持：VLC播放HTTP-TS流。
* [x] 原生支持：VLC播放SRT流。
* [x] 原生支持：VLC播放HLS流。
* [x] 原生支持：VLC播放MPEG-DASH流。
* [ ] 不支持：VLC播放RTMP流。暂时没看到支持的可能。
* [ ] 不支持：VLC播放HTTP-FLV流。暂时没看到支持的可能。

第五部分，辅助功能，关于HEVC的重要的辅助能力：

* [x] 原生支持：录制为FLV/MP4文件。FLV是非标准的，MP4是标准的。
* [x] 原生支持：解析HEVC元数据，通过HTTP API提供。
* [x] 原生支持：黑盒测试支持HEVC。
* [x] 原生支持：SRS镜像支持补丁的FFmpeg。可以不用自己编译FFmpeg，使用SRS镜像提供的FFmpeg即可。
* [x] 原生支持：[WordPress plugin SrsPlayer](https://github.com/ossrs/WordPress-Plugin-SrsPlayer)插件支持HEVC。由于Oryx使用的是4.0稳定版本，还需要几年才能切换到6.0。
* [ ] 不支持：Update [srs-stack](https://github.com/ossrs/oryx) for HEVC.
* [ ] 不支持：Edge server supports publish HEVC stream to origin.
* [ ] 不支持：Edge server supprots play HEVC stream from origin.
* [ ] 不支持：HTTP Callback takes HEVC metadata.
* [ ] 不支持：Prometheus Exporter supports HEVC metadata.
* [ ] 不支持：Improve coverage for HEVC.
* [ ] 不支持：Supports benchmark for HEVC by [srs-bench](https://github.com/ossrs/srs-bench).

至于iOS或Android Native，可以用FFmpeg解码，早就可以自己支持了。

由于[Chrome 105](https://zhuanlan.zhihu.com/p/541082191) MSE已经支持了HEVC，所以浏览器上的完善度就很高了，感谢头条的开发者。

MSE HEVC依赖GPU硬件解码，可以打开`chrome://gpu`，搜索下`hevc`，如果能找到就可以支持。

## Usage: Live

我们看一个最简单的H.265直播的例子。

首先，使用Docker启动SRS：

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:6 \
  ./objs/srs -c conf/docker.conf
```

接着，启动FFmpeg推流，HEVC RTMP流，参考 [FFmpeg Tools](#ffmpeg-tools):

```bash
# For macOS
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -acodec copy -vcodec libx265 -f flv rtmp://host.docker.internal/live/livestream

# For linux
docker run --net=host --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -acodec copy -vcodec libx265 -f flv rtmp://127.0.0.1/live/livestream
```

> Note: 请将域名`host.docker.internal`换成你的服务器的IP。

就可以直接打开网页播放HTTP-FLV流了，也可以使用ffplay或VLC播放HLS：

* [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?stream=livestream.flv)
* `http://localhost:8080/live/livestream.m3u8`

> Note: 注意不能用H5播放HLS，因为hls.js还不支持，但可以用H5播放HTTP-FLV或HTTP-TS，因为mpegts.js支持。

其他协议请参考SRS的文档开启即可。

## Usage: WebRTC

特别解释下WebRTC H.265：只有Safari支持HEVC，Chrome和Firefox还不支持。

Safari默认没有开启，需要手动点下`开发 > 实验性功能 > WebRTC H265 codec`。

具体使用方法，请参考[#465](https://github.com/ossrs/srs/issues/465#safari-webrtc)的`Safari WebRTC`部分的使用说明。

WebRTC对于AV1的支持更完善，Safari/Chrome/Firefox也都支持，具体请参考[#1070](https://github.com/ossrs/srs/issues/1070)，当然MSE对于AV1目前还没有支持。

> Note: Media Source Extensions (MSE)是浏览器支持流媒体的底层接口，可以认为是把点播或直播转成fMP4切片送给H5 video对象，比如mpegts.js、hls.js和dash.js都是基于MSE，具体可以参考[MDN: MSE](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)。

## FFmpeg Patch

FFmpeg 6支持了HEVC over RTMP，如果需要自己编译，参考[FFmpeg Tools](../docs/v6/doc/hevc#ffmpeg-tools#ffmpeg-tools).

SRS提供了打过Patch的FFmpeg、ffplay和ffprobe，可以直接用SRS Docker推流：

```bash
# For macOS
docker run --rm -it ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -acodec copy -vcodec libx265 -f flv rtmp://host.docker.internal/live/livestream

# For linux
docker run --net=host --rm -it ossrs/srs:encoder ffmpeg -stream_loop -1 -re -i doc/source.flv \
  -acodec copy -vcodec libx265 -f flv rtmp://127.0.0.1/live/livestream
```

可以详细参考[FFmpeg Tools](../docs/v6/doc/hevc#ffmpeg-tools#ffmpeg-tools)

## Known Issues

目前已知的问题，总结下：

1. Safari HEVC WebRTC只支持WebRTC，不支持转换其他协议。SRS可以实现，但目前使用的场景比较少，有需要会在未来完善。
1. Chrome/Firefox WebRTC是不支持HEVC的，也没有计划支持。
1. 几乎浏览器都支持MSE，除了iOS。注意HEVC MSE是依赖硬件解码的。
1. H5播放器目前mpegts.js支持，hls.js和dash.js还没有支持。

在某些场景下，HEVC的应用完全成熟了，具体就需要各位开发者自己评估了。

## Thanks

H.265这个功能，核心的贡献都是社区的朋友，有可能会漏掉哈请多包涵，包括但不限于：

* [runner365](https://github.com/runner365) 施维大神，最初的PR的提交者，RTMP、HLS和SRT支持265。
* [yinjiaoyuan](https://github.com/yinjiaoyuan) 解决了265的bug，GB28181支持265的Patch。
* [PieerePi](https://github.com/PieerePi) 解决了265的bug。
* [qichaoshen82](https://github.com/qichaoshen82) 解决了265的bug。
* [ZSC714725](https://github.com/ZSC714725) 解决了265的bug。
* [bluestn](https://github.com/bluestn) MP4和GB28181录制支持265。
* [mapengfei53](https://github.com/mapengfei53) MP4录制支持265。
* [chundonglinlin](https://github.com/chundonglinlin) SRT支持265。
* [duiniuluantanqin](https://github.com/duiniuluantanqin) GB28181支持265。
* [panda1986](https://github.com/panda1986) WordPress SrsPlayer插件支持265。

> Note: 可以看到大家的工作是有交叉的，虽然有些PR没有直接合并到SRS，但是最终合并到SRS的代码，都参考了大家提交的PR，并且会把大家作为co-author写到Commit中的哈。

最后，特别感谢[mpegts.js](https://github.com/xqq/mpegts.js)，谦谦大神的H5播放器，支持了HTTP-FLV和HTTP-TS的H.265能力，这是flv.js的延续的项目，我觉得大家都欠他一个Star哇。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/23-03-07-Lets-Do-H265-Live-Streaming)
