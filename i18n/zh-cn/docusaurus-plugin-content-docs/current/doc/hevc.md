---
title: HEVC
sidebar_label: HEVC
hide_title: false
hide_table_of_contents: false
---

# HEVC

HEVC，也就是H.265，是H.264的下一代编码，和AV1属于统一代的编解码器，H.265大概比H.264能节约一半的带宽，或者同等带宽下能提升
一倍的清晰度和画质。

当然，H.265的问题在于支持的客户端还不够广泛，几乎所有的设备都支持H.264，包括很差性能的手机或者盒子，对于H.264的支持都是有专门
的芯片，然而H.265虽然经过了差不多十年的发展，支持的设备还不够多。 在特定场景下，比如设备端明确支持H.265时，可以选择H.265，
否则还是选择H.264。

此外，传输协议对于H.265的支持也在逐步完善，但是还并非所有的协议都支持。MEPG-TS是最早支持H.265的，当然SRT和HLS是基于TS的协议，
所以也支持了；RTMP和HTTP-FLV，直到2023.03，终于[Enhanced RTMP](https://github.com/veovera/enhanced-rtmp)项目建立，
开始支持了HEVC和AV1；而WebRTC目前只有Safari支持了，据说Chrome还在开发中。

SRS 6.0正式支持了H.265的能力，若需要使用H.265功能，请切换到SRS 6.0版本。研发的详细过程请参考[#465](https://github.com/ossrs/srs/issues/465)。

## Overview

SRS 支持 H.265（或 HEVC）的架构：

```text
FFmpeg --RTMP(h.265)---> SRS ----RTMP/FLV/TS/HLS/WebRTC(h.265)--> Chrome/Safari
```

对于直播流：

* [Chrome 105+](https://caniuse.com/?search=HEVC) 默认支持 HEVC，参见[这篇文章](https://zhuanlan.zhihu.com/p/541082191)。
    * 你可以通过 H5 视频直接播放 mp4，或者通过 MSE 播放 HTTP-FLV/HTTP-TS/HLS 等。
    * 请使用 [mpegts.js](https://github.com/xqq/mpegts.js) 播放带有 HEVC 的 HTTP-TS。
    * mpegts.js 计划支持带有 HEVC 的 HTTP-FLV，参见 [mpegts.js#64](https://github.com/xqq/mpegts.js/issues/64)
* [OBS 29+](https://github.com/obsproject/obs-studio/releases/tag/29.1.3) 支持 HEVC RTMP。
* FFmpeg 或 ffplay 支持 libx265
    * FFmpeg 6支持HEVC RTMP，参考[637c761b](https://github.com/FFmpeg/FFmpeg/commit/637c761be1bf9c3e1f0f347c5c3a390d7c32b282)。
    * FFmpeg 4或5，需要一些补丁来支持 RTMP/FLV 上的 HEVC，参见下面的**[FFmpeg 工具](#ffmpeg-tools)**。
* SRS 也支持 HEVC。
    * SRS 6.0已经支持了HEVC。
    * 原始的 HEVC 支持是由 [runner365](https://github.com/runner365) 在 [srs-gb28181/feature/h265](https://github.com/ossrs/srs-gb28181/commits/feature/h265) 中提供的。

> Note：要检查您的 Chrome 是否支持 HEVC，请打开 `chrome://gpu` 并搜索 `hevc`。

对于 WebRTC：

* Chrome 目前（2022.11）不支持 HEVC，但支持 AV1，请参见 [#2324](https://github.com/ossrs/srs/pull/2324)
* Safari 支持 HEVC，如果用户启用它，请参见[本节](#safari-webrtc)
* SRS 也只支持 AV1，因为 Chrome 尚未支持 HEVC。

## Usage

请确保您的SRS版本为`6.0.4+`，并使用h265构建：

```bash
docker run --rm -it -p 1935:1935 -p 8080:8080 registry.cn-hangzhou.aliyuncs.com/ossrs/srs:6 \
  ./objs/srs -c conf/hevc.flv.conf
```

> Note：除了环境变量，您还可以使用`conf/hevc.flv.conf`或`conf/hevc.ts.conf`配置文件。
> Note：建议使用`conf/hevc.ts.conf`，因为TS对于HEVC更好。

构建并修补FFmpeg，请参见[FFmpeg工具](#ffmpeg-tools)：

```bash
# 对于macOS
docker run --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -stream_loop -1 -re -i doc/source.flv \
    -acodec copy -vcodec libx265 -f flv rtmp://host.docker.internal/live/livestream

# 对于linux
docker run --net=host --rm -it registry.cn-hangzhou.aliyuncs.com/ossrs/srs:encoder \
  ffmpeg -stream_loop -1 -re -i doc/source.flv \
    -acodec copy -vcodec libx265 -f flv rtmp://127.0.0.1/live/livestream
```

> Note：请将IP`host.docker.internal`更改为您的SRS的IP。

通过以下方式播放HEVC直播流：

* HTTP-FLV（通过H5）：[http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true)
* HLS（通过VLC或fflay）：`http://localhost:8080/live/livestream.m3u8`

> Note：请通过`SRS_VHOST_DASH_ENABLED=on`启用MPEG-DASH，然后使用VLC/ffplay播放流`http://localhost:8080/live/livestream.mpd`

> Note：请通过`SRS_VHOST_HTTP_REMUX_MOUNT=[vhost]/[app]/[stream].ts`启用HTTP-TS，然后使用H5/VLC/ffplay播放流`http://localhost:8080/live/livestream.ts`

> Note：如果要将直播流转换为MP4文件，请通过`SRS_VHOST_DVR_ENABLED=on SRS_VHOST_DVR_DVR_PATH=./objs/nginx/html/[app]/[stream].[timestamp].mp4`启用DVR MP4。

> Note：关于HEVC可用协议和工具的详细信息，请参见[SRS中的HEVC状态](#status-of-hevc-in-srs)。

> Note：H5播放器使用[mpegts.js](https://github.com/xqq/mpegts.js)。

## Status of HEVC in SRS

The status of protocols and HEVC:

* [x] PUSH HEVC over RTMP by FFmpeg. [v6.0.2](https://github.com/ossrs/srs/commit/178e40a5fc3cf0856ace914ae61696a73007f5bf)
* [x] PUSH HEVC over SRT by FFmpeg. [v6.0.20](https://github.com/ossrs/srs/pull/3366)
* [x] PUSH HEVC over RTMP by OBS. [#3464](https://github.com/ossrs/srs/issues/3464) https://github.com/obsproject/obs-studio/pull/8522
* [x] PUSH HEVC over SRT by OBS. [v6.0.20](https://github.com/ossrs/srs/pull/3366)
* [x] PUSH HEVC over GB28181. [v6.0.25](https://github.com/ossrs/srs/pull/3408)
* [x] PULL HEVC over RTMP by FFmpeg, with [patch](#ffmpeg-tools) for FFmpeg. [v6.0.2](https://github.com/ossrs/srs/commit/178e40a5fc3cf0856ace914ae61696a73007f5bf)
* [x] PULL HEVC over HTTP-FLV by FFmpeg, with [patch](#ffmpeg-tools) for FFmpeg. [v6.0.2](https://github.com/ossrs/srs/commit/178e40a5fc3cf0856ace914ae61696a73007f5bf)
* [x] PULL HEVC over HTTP-TS by FFmpeg [v6.0.4](https://github.com/ossrs/srs/commit/70d5618979e5c8dc41b7cd87c78db7ca2b8a10e8)
* [x] PULL HEVC over HLS by FFmpeg [v6.0.11](https://github.com/ossrs/srs/commit/fff8d9863c3fba769b01782428257edf40f80a12)
* [x] PULL HEVC over MPEG-DASH  by FFmpeg [v6.0.14](https://github.com/ossrs/srs/commit/edba2c25f13c0fa915bd8e8093a4005df6077858)
* [x] PULL HEVC over SRT by FFmpeg. [v6.0.20](https://github.com/ossrs/srs/pull/3366)
* [x] PUSH HEVC over WebRTC by Safari. [v6.0.34](https://github.com/ossrs/srs/pull/3441)
* [x] PULL HEVC over WebRTC by Safari. [v6.0.34](https://github.com/ossrs/srs/pull/3441)
* [ ] PUSH HEVC over WebRTC by Chrome/Firefox
* [ ] PULL HEVC over WebRTC by Chrome/Firefox
* [x] Play HEVC over HTTP-TS by [mpegts.js](https://github.com/xqq/mpegts.js), by Chrome 105+ MSE, **NO WASM**. [v6.0.1](https://github.com/ossrs/srs/commit/7e02d972ea74faad9f4f96ae881d5ece0b89f33b)
* [x] Play pure video(no audio) HEVC over HTTP-TS by [mpegts.js](https://github.com/xqq/mpegts.js). [v6.0.9](https://github.com/ossrs/srs/commit/d5bf0ba2da30698e18700b210d2b12eed5b21d29)
* [x] Play HEVC over HTTP-FLV by [mpegts.js](https://github.com/xqq/mpegts.js), by Chrome 105+ MSE, **NO WASM**. [v6.0.1](https://github.com/ossrs/srs/commit/7e02d972ea74faad9f4f96ae881d5ece0b89f33b)
* [ ] Play HEVC over HLS by [hls.js](https://github.com/video-dev/hls.js)
* [ ] Play HEVC over MPEG-DASH by [dash.js](https://github.com/Dash-Industry-Forum/dash.js)
* [x] Play HEVC over HTTP-TS by ffplay, by offical release. [v6.0.4](https://github.com/ossrs/srs/commit/70d5618979e5c8dc41b7cd87c78db7ca2b8a10e8)
* [x] PULL HEVC over RTMP by ffplay, with [patch](#ffmpeg-tools) for FFmpeg. [v6.0.2](https://github.com/ossrs/srs/commit/178e40a5fc3cf0856ace914ae61696a73007f5bf)
* [x] Play HEVC over HTTP-FLV by ffplay, with [patch](#ffmpeg-tools) for FFmpeg. [v6.0.2](https://github.com/ossrs/srs/commit/178e40a5fc3cf0856ace914ae61696a73007f5bf)
* [x] Play pure video(no audio) HEVC by ffplay.
* [x] Play HEVC over HLS by ffplay. [v6.0.11](https://github.com/ossrs/srs/commit/fff8d9863c3fba769b01782428257edf40f80a12)
* [x] Play HEVC over MPEG-DASH by ffplay. [v6.0.14](https://github.com/ossrs/srs/commit/edba2c25f13c0fa915bd8e8093a4005df6077858)
* [x] Play HEVC over SRT by ffplay. [v6.0.20](https://github.com/ossrs/srs/pull/3366)
* [x] Play HEVC over HTTP-TS by VLC, by official release. [v6.0.4](https://github.com/ossrs/srs/commit/70d5618979e5c8dc41b7cd87c78db7ca2b8a10e8)
* [x] Play HEVC over SRT by VLC, by official. [v6.0.20](https://github.com/ossrs/srs/pull/3366)
* [x] Play pure video(no audio) HEVC by VLC.
* [ ] Play HEVC over RTMP by VLC.
* [ ] Play HEVC over HTTP-FLV by VLC.
* [x] Play HEVC over HLS by VLC. [v6.0.11](https://github.com/ossrs/srs/commit/fff8d9863c3fba769b01782428257edf40f80a12)
* [x] Play HEVC over MPEG-DASH by VLC. [v6.0.14](https://github.com/ossrs/srs/commit/edba2c25f13c0fa915bd8e8093a4005df6077858)
* [x] DVR HEVC to MP4/FLV file. [v6.0.14](https://github.com/ossrs/srs/commit/edba2c25f13c0fa915bd8e8093a4005df6077858)
* [x] HTTP API contains HEVC metadata.
* [ ] HTTP Callback takes HEVC metadata.
* [ ] Prometheus Exporter supports HEVC metadata.
* [ ] Improve coverage for HEVC.
* [x] Add regression/blackbox tests for HEVC.
* [ ] Supports benchmark for HEVC by [srs-bench](https://github.com/ossrs/srs-bench).
* [x] Support patched FFmpeg for SRS dockers: [CentOS7](https://github.com/ossrs/dev-docker/commit/0691d016adfe521f77350728d15cead8086d527d), [Ubuntu20](https://github.com/ossrs/dev-docker/commit/0e36323d15544ffe2901d10cfd255d9ef08fb250) and [Encoder](https://github.com/ossrs/dev-docker/commit/782bb31039653f562e0765a0c057d9f9babd1d1f).
* [x] Update [WordPress plugin SrsPlayer](https://github.com/ossrs/WordPress-Plugin-SrsPlayer) for HEVC.
* [ ] Update [srs-cloud](https://github.com/ossrs/srs-cloud) for HEVC.
* [ ] Edge server supports publish HEVC stream to origin.
* [ ] Edge server supprots play HEVC stream from origin.
* [ ] [HEVC: Error empty SPS/PPS when coverting RTMP to HEVC.](https://github.com/ossrs/srs/issues/3407)

> Note: We're merging HEVC support to SRS 6.0, the original supports for HEVC is [srs-gb28181/feature/h265](https://github.com/ossrs/srs-gb28181/commits/feature/h265) by [runner365](https://github.com/runner365)

## FFmpeg Tools

镜像 `ossrs/srs:encoder` 或 `ossrs/srs:6` 中的 FFmpeg 是使用 libx265 构建的，并且支持 RTMP 上的 HEVC。因此，您可以直接使用：

```bash
docker run --rm -it ossrs/srs:encoder ffmpeg -re -i doc/source.flv -acodec copy \
  -vcodec libx265 -f flv rtmp://localhost/live/livestream
```

如果您想从代码构建，请阅读以下说明。在构建 FFmpeg 之前，我们必须先构建 [libx264](https://www.videolan.org/developers/x264.html)：

```bash
git clone https://code.videolan.org/videolan/x264.git ~/git/x264
cd ~/git/x264
./configure --prefix=$(pwd)/build --disable-asm --disable-cli --disable-shared --enable-static
make -j10
make install
```

然后是编译 [libx265](https://www.videolan.org/developers/x265.html):

```bash
git clone https://bitbucket.org/multicoreware/x265_git.git ~/git/x265_git
cd ~/git/x265_git/build/linux
cmake -DCMAKE_INSTALL_PREFIX=$(pwd)/build -DENABLE_SHARED=OFF ../../source
make -j10
make install
```

请注意，FFmpeg 6.0 在以下提交之前不支持 RTMP 上的 HEVC [637c761b](https://github.com/FFmpeg/FFmpeg/commit/637c761be1bf9c3e1f0f347c5c3a390d7c32b282)：

```
commit 637c761be1bf9c3e1f0f347c5c3a390d7c32b282
Author: Steven Liu <liuqi05@kuaishou.com>
Date:   Mon Aug 28 09:59:24 2023 +0800

    avformat/rtmpproto: support enhanced rtmp
    
    add option named rtmp_enhanced_codec,
    it would support hvc1,av01,vp09 now,
    the fourcc is using Array of strings.
    
    Signed-off-by: Steven Liu <lq@chinaffmpeg.org>
```

因此，如果您使用的是 FFmpeg 6，您可以通过以下命令直接构建 FFmpeg，无需任何补丁：

```bash
git clone -b master https://github.com/FFmpeg/FFmpeg.git ~/git/FFmpeg
cd ~/git/FFmpeg
env PKG_CONFIG_PATH=~/git/x264/build/lib/pkgconfig:~/git/x265_git/build/linux/build/lib/pkgconfig \
./configure \
  --prefix=$(pwd)/build \
  --enable-gpl --enable-nonfree --enable-pthreads --extra-libs=-lpthread \
  --disable-asm --disable-x86asm --disable-inline-asm \
  --enable-decoder=aac --enable-decoder=aac_fixed --enable-decoder=aac_latm --enable-encoder=aac \
  --enable-libx264 --enable-libx265 \
  --pkg-config-flags='--static'
make -j10
```

推送HEVC over RTMP 到 SRS：

```bash
./ffmpeg -stream_loop -1 -re -i ~/srs/doc/source.flv -acodec copy -vcodec libx265 \
  -f flv rtmp://localhost/live/livestream
```

通过 ffplay 播放 HEVC over RTMP:

```bash
./ffplay rtmp://localhost/live/livestream
```

它就像魔术一样奏效！

如果您想在 FFmpeg 4.1 或 5.1 中使用 HEVC over RTM，请阅读以下说明。请下载 FFmepg 并切换到 5.1：

> Note: The [specfication](https://github.com/ksvc/FFmpeg/wiki) and [usage](https://github.com/ksvc/FFmpeg/wiki/hevcpush) 
to support HEVC over RTMP or FLV. There is a [patch for FFmpeg 4.1/5.1/6.0](https://github.com/runner365/ffmpeg_rtmp_h265) 
from [runner365](https://github.com/runner365) for FFmpeg to support HEVC over RTMP or FLV. There is also a
[patch](https://github.com/VCDP/CDN/blob/master/FFmpeg_patches/0001-Add-SVT-HEVC-FLV-support-on-FFmpeg.patch) 
from Intel for this feature.

```bash
git clone -b n5.1.2 https://github.com/FFmpeg/FFmpeg.git ~/git/FFmpeg
```

Then, patch for [HEVC over RTMP/FLV](https://github.com/runner365/ffmpeg_rtmp_h265):

```bash
git clone -b 5.1 https://github.com/runner365/ffmpeg_rtmp_h265.git ~/git/ffmpeg_rtmp_h265
cp ~/git/ffmpeg_rtmp_h265/flv.h ~/git/FFmpeg/libavformat/
cp ~/git/ffmpeg_rtmp_h265/flv*.c ~/git/FFmpeg/libavformat/
```

最后，请参考之前的操作方法编译FFmpeg即可。

## MSE for HEVC

[MSE](https://caniuse.com/?search=mse) is a base technology for [mpegts.js](https://github.com/xqq/mpegts.js), [hls.js](https://github.com/video-dev/hls.js/) and [dash.js](https://github.com/Dash-Industry-Forum/dash.js).

Now [Chrome 105+](https://caniuse.com/?search=HEVC) supports HEVC by default, see [this post](https://zhuanlan.zhihu.com/p/541082191), which means, MSE(Chrome 105+) is available for HEVC.

You can verify this feature, by generating a HEVC mp4 file:

```bash
ffmpeg -i ~/git/srs/trunk/doc/source.flv -acodec copy \
  -vcodec libx265 -y source.hevc.mp4
```

> Note: Please make sure your FFmpeg is 5.0 and libx265 is enabled.

Open `source.hevc.mp4` in Chrome 105+ directly, it should works.

You can also move the file to SRS webserver:

```bash
mkdir -p ~/git/srs/trunk/objs/nginx/html/vod/
mv source.hevc.mp4 ~/git/srs/trunk/objs/nginx/html/vod
```

Then open by [srs-player](http://localhost:8080/players/srs_player.html?app=vod&stream=source.hevc.mp4&autostart=true)

## Safari WebRTC

Safari supports WebRTC, if you enable it by:

* English version: `Develop > Experimental Features > WebRTC H265 codec`
* Chinese version: `Development > Experimental Features > WebRTC H265 codec`

Then open the url in safari, to publish or play WebRTC stream:

* Play [webrtc://localhost/live/livestream?codec=hevc](http://localhost:8080/players/rtc_player.html?codec=hevc)
* Publish [webrtc://localhost/live/livestream?codec=hevc](http://localhost:8080/players/rtc_publisher.html?codec=hevc)

Please follow other section to publish HEVC stream.

## Thanks for Contributors

There is a list of commits and contributors about HEVC in SRS:

* [H265: For #1747, Support HEVC/H.265 in SRT/RTMP/HLS.](https://github.com/ossrs/srs-gb28181/commit/3ca11071b45495e82d2d6958e5d0f7eab05e71e5)
* [H265: For #1747, Fix build fail bug for H.265](https://github.com/ossrs/srs-gb28181/commit/e355f3c37228f3602c88fed68e8fe5e6ba1153ea)
* [H265: For #1747, GB28181 support h.265 (#2037)](https://github.com/ossrs/srs-gb28181/commit/b846217bc7f94034b33bdf918dc3a49fb17947e0)
* [H265: fix some important bugs (#2156)](https://github.com/ossrs/srs-gb28181/commit/26218965dd083d13173af6eb31fcdf9868b753c6)
* [H265: Deliver the right hevc nalu and dump the wrong nalu. (#2447)](https://github.com/ossrs/srs-gb28181/commit/a13b9b54938a14796abb9011e7a8ee779439a452)
* [H265: Fix multi nal hevc frame demux fail. #2494](https://github.com/ossrs/srs-gb28181/commit/6c5e6090d7c82eb37530e109c230cabaedf948e1)
* [H265: Fix build error #2657 #2664](https://github.com/ossrs/srs-gb28181/commit/eac99e19fba6063279b9e47272523014f5e3334a)
* [H265: Update mpegts demux in srt. #2678](https://github.com/ossrs/srs-gb28181/commit/391c1426fc484c990e4324a4ae2f0de900074578)
* [H265: Fix the stat issue for h265. (#1949)](https://github.com/ossrs/srs-gb28181/commit/b4486e3b51281b4c227b2cc4f58d2b06db599ce0)
* [H265: Add h265 codec written support for MP4 format. (#2697)](https://github.com/ossrs/srs-gb28181/commit/3175d7e26730a04b27724e55dc95ef86c1f2886e)
* [H265: Add h265 for SRT.](https://github.com/runner365/srs/commit/0fa86e4f23847e8a46e3d0e91e0acd2c27047e11)

We will merge some of these commits to SRS 6.0, but not all commits.

* [PULL HEVC over WebRTC by Safari. v6.0.34](https://github.com/ossrs/srs/pull/3441)
* [GB: Support H.265 for GB28181. v6.0.25 (#3408)](https://github.com/ossrs/srs/pull/3408)
* [H265: Support HEVC over SRT. v6.0.20 (#465) (#3366)](https://github.com/ossrs/srs/pull/3366)
* [H265: Support DVR HEVC stream to MP4. v6.0.14](https://github.com/ossrs/srs/pull/3360)
* HLS: Support HEVC over HLS. v6.0.11
* [HEVC: The codec information is incorrect. v6.0.5](https://github.com/ossrs/srs/issues/3271)
* FFmpeg support libx265 and HEVC over RTMP/FLV: [CentOS7](https://github.com/ossrs/dev-docker/commit/0691d016adfe521f77350728d15cead8086d527d), [Ubuntu20](https://github.com/ossrs/dev-docker/commit/0e36323d15544ffe2901d10cfd255d9ef08fb250) and [Encoder](https://github.com/ossrs/dev-docker/commit/782bb31039653f562e0765a0c057d9f9babd1d1f).
* [H265: Support HEVC over HTTP-TS. v6.0.4](https://github.com/ossrs/srs/commit/70d5618979e5c8dc41b7cd87c78db7ca2b8a10e8)
* [H265: Support parse multiple NALUs in a frame. v6.0.3](https://github.com/ossrs/srs/commit/f316e9a0de3a892d25f2d8e7efd28ee9334f5bd6)
* [H265: Support HEVC over RTMP or HTTP-FLV. v6.0.2](https://github.com/ossrs/srs/commit/178e40a5fc3cf0856ace914ae61696a73007f5bf)
* [H265: Update mpegts.js to play HEVC over HTTP-TS/FLV. v6.0.1](https://github.com/ossrs/srs/commit/7e02d972ea74faad9f4f96ae881d5ece0b89f33b)

## Known Issues

1. HEVC over Safari WebRTC, only support WebRTC to WebRTC, doesn't support converting to RTMP.
2. Chrome/Firefox does not support HEVC, no any plan as I know.
3. Almost all browsers supports MSE, except iOS. HEVC over MSE requires hardware decoder.
4. Apart from mpegts.js, other H5 players such as hls.js/dash.js doesn't support HEVC.

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/hevc)


