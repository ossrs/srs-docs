# FAQ

关于Q&A，请按下面的流程：

* 在[Wiki](../docs/v4/doc/introduction)中有的内容，请花时间看文档，不要提Issue。
* 重复的Issue会被删除，请先在[Issues](https://github.com/ossrs/srs/issues)中搜索你的问题，确认没有后再提Issue。
* 我如何才能够？How do I? -- [Stack Overflow](https://stackoverflow.com/questions/tagged/simple-realtime-server)
* 我碰到一个错误，为何？I got this error, why? -- [Stack Overflow](https://stackoverflow.com/questions/tagged/simple-realtime-server)
* 我碰到个错误，确定是Bug，请按Issue模版提[Bug](https://github.com/ossrs/srs/issues/new) or [PR](/how-to-file-pr)，不提供**完整**信息的Issue会被直接删除。
* 咨询和讨论请来[视频号直播间交流](/contact)。也可以[加微信群](/contact)，在群里交流。

## FAQ

下面是常见的问题，如果没有找到你的问题，请先在本[Issue](https://github.com/ossrs/srs/issues)中搜索，如果你确认是个Bug并且没有提交过，
请按照要求提交Issue。

> Note: 这是关于SRS的FAQ，如果是Oryx的FAQ请参考[Oryx FAQ](./faq-oryx)

<a name='cdn'></a> <a name='vod'></a>

### [Cluster and CDN](#cdn)
* 关于RTMP/HTTP-FLV/WebRTC等直播？
  > 1. SRS只支持流协议，比如直播或WebRTC，详细请参考WiKi中关于集群的部分。
* 关于HLS/DASH等切片直播，或者点播/录制/VoD/DVR？
  > 1. SRS可以录制为点播文件。参考 [DVR](../docs/v4/doc/dvr)
  > 1. SRS可以生成HLS或DASH。参考 [HLS](../docs/v4/doc/delivery-hls)
* 关于HLS/DASH/VoD/DVR的分发集群？
  > 1. 这些都是HTTP文件，HTTP文件分发集群建议使用NGINX，参考 [HLS Cluster](../docs/v4/doc/sample-hls-cluster)
  > 1. 可以用NGINX结合SRS Edge分发HTTP-FLV，实现所有HTTP协议的分发，参考 [Nginx For HLS](../docs/v4/doc/nginx-for-hls#work-with-srs-edge-server)
* SRS源站集群，多流热备，流切换，推流容灾，提问关于直播流的容灾和切换，参考[链接](https://stackoverflow.com/a/70629002/17679565)
* 如何构建一个服务器网络，解决就近服务，和扩展服务器容量，SRS的Edge集群，参考[链接](https://stackoverflow.com/a/71030396/17679565)
* 如何做多流备份，多个流取可用的一个，流的灾备和切换，参考[链接](https://stackoverflow.com/a/77363633/17679565)

<a name="console"></a>

### [Console](#console)
* `Pagination`: 关于控制台流和客户端的分页问题，参考 [#3451](https://github.com/ossrs/srs/issues/3451)
  > 1. API默认参数为`start=0`, `count=10`，而Console没有支持分页，计划在新的Console支持。

<a name='cors'></a>

### [CORS](#cors)
* `CORS`: 关于HTTP API或流的跨域
  > 1. SRS 3.0支持了跨域(CORS)，不需要额外的HTTP代理，已经内置支持了，默认就是打开的，参考 [#717](https://github.com/ossrs/srs/issues/717) [#798](https://github.com/ossrs/srs/issues/798) [#1002](https://github.com/ossrs/srs/issues/1002)
  > 1. 当然使用Nginx代理服务器，也可以解决跨域问题，这样就不需要在SRS设置了。注意只需要代理API，不要代理流媒体，因为流的带宽消耗太高了，会把代理打挂，也没有必要。
  > 1. 使用Nginx或Caddy代理，提供统一的HTTP/HTTPS服务，参考 [#2881](https://github.com/ossrs/srs/issues/2881)

<a name='cpu-and-os'></a>

### [CPU and OS](#cpu-and-os)
* `CPU and OS`：关于SRS支持的CPU架构和OS操作系统
  > 1. SRS支持常见的CPU架构，比如x86_64或者amd64，以及armv7/aarch64/AppleM1，还有MIPS或RISCV，以及龙芯loongarch，其他CPU适配请参考[ST#22](https://github.com/ossrs/state-threads/issues/22)。
  > 1. SRS支持常用的操作系统，比如Linux包括CentOS和Ubuntu等，还有macOS，以及Windows等。
  > 1. 国产信创系统，SRS也是支持的，如果需要适配新的国产信创系统，可以提issue。
* `Windows`: 关于Windows的特别说明
  > 1. 一般用Windows做服务器比较少，但也有一些应用场景，SRS 5.0目前已经支持了Windows，每个版本发布都会有Windows的安装包下载。
  > 1. 由于大家在Github下载比较困难，我们提供了gitee的镜像下载，具体请看 [Gitee: Releases](https://gitee.com/ossrs/srs/releases) 每个版本的附件。
  > 1. 在Windows平台还有些问题未解决，也会继续完善支持，详细请参考[#2532](https://github.com/ossrs/srs/issues/2532)

<a name='dvr'></a>

### [DVR](#dvr)

* `Dynamic DVR`: 关于动态录制，正则表达式匹配需要录制的流等。
  > 1. 可以用`on_publish`，回调业务系统，由业务系统实现负责的规则。
  > 1. 具体录制文件用`on_hls`，将切片拷贝到录制目录，或者云存储。
  > 1. 可以参考[srs-stack](https://github.com/ossrs/oryx/blob/main/platform/srs-hooks.go)中DVR的实现。
  > 1. SRS不会支持动态DVR，但给出了一些方案，也可以参考 [#1577](https://github.com/ossrs/srs/issues/1577)
* SRS录制WebRTC为MP4为何会失败，参考[链接](https://stackoverflow.com/a/75861599/17679565)

<a name='edge-hls-dvr-rtc'></a>

### [Edge HLS/DVR/RTC](#edge-hls-dvr-rtc)
* `Edge HLS/DVR/RTC`: 关于边缘(Edge)支持HLS/DVR/RTC等
  > 1. 边缘(Edge)是直播的集群，只支持直播流协议比如RTMP和FLV，只有源站才能支持HLS/DVR/RTC，参考 [#1066](https://github.com/ossrs/srs/issues/1066)
  > 1. 目前并没有在Edge禁用HLS/DVR/RTC等能力，但未来会禁用，所以请不要这么用，也用不起来。
  > 1. HLS的集群，请参考文档[HLS Edge Cluster](../docs/v5/doc/nginx-for-hls)
  > 1. 正在开发WebRTC和SRT的集群能力，参考[#3138](ttps://github.com/ossrs/srs/issues/3138)。

<a name='ffmpeg'></a>

### [FFmpeg](#ffmpeg)
* `FFmpeg`: 关于FFmpeg相关的问题
  > 1. 找不到FFmpeg，出现`terminate, please restart it`，编译失败`No FFmpeg found`，FFmpeg不支持h.265或其他Codec，这是需要自己编译或者下载FFmpeg，并放到指定的路径后SRS就会检测到，参考 [#1523](https://github.com/ossrs/srs/issues/1523)
  > 1. 如果是FFmpeg的使用问题，请一律不要在SRS提Issue，请移步到FFmpeg的社区提交。在SRS提FFmpeg的问题，会被直接删除，不要偷懒。

<a name='features'></a>

### [Features](#features)
* 关于支持的功能，过时的功能，以及计划？
  > 1. 每个版本支持的功能不一样，在Github首页会给出来支持的功能，比如[develop/5.0](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features), [release/4.0](https://github.com/ossrs/srs/blob/4.0release/trunk/doc/Features.md#features), [release/3.0](https://github.com/ossrs/srs/tree/3.0release#features)。
  > 1. 每个版本的变更也不相同，在Github首页也会给出来具体的变更，比如[develop/5.0](https://github.com/ossrs/srs/blob/develop/trunk/doc/CHANGELOG.md#changelog), [release/4.0](https://github.com/ossrs/srs/blob/4.0release/trunk/doc/CHANGELOG.md#changelog), [release/3.0](https://github.com/ossrs/srs/tree/3.0release#v3-changes)。
  > 1. 除了新增功能，SRS还会删除不合适的功能，比如RTSP推流，比如srs-librtmp，比如GB的SIP信令等等，这些功能有可能是没有用，有可能是因为不合适，也有可能是以更加合适的方式提供，参考 [#1535](https://github.com/ossrs/srs/issues/1535)

<a name='gb28181'></a>

### [GB28181](#gb28181)
* `GB28181`: 关于GB的状态和路线图
  > 1. GB已经放到独立的仓库 [srs-gb28181](https://github.com/ossrs/srs-gb28181)， 请参考 [#2845](https://github.com/ossrs/srs/issues/2845)
  > 1. GB的使用请参考 [#1500](https://github.com/ossrs/srs/issues/1500) ，目前GB还是在[feature/gb28181](https://github.com/ossrs/srs-gb28181/tree/feature/gb28181)分支，稳定后才会合并到develop然后release，预计在SRS 5.0发布。
  > 1. SRS支持GB不会支持全，只会作为接入协议。关注度比较高的[对讲](https://github.com/ossrs/srs-gb28181/issues/1898)有计划支持。

<a name='help'></a>

### [Help](#help)
* 微信群问问题没人回答？社区提问的艺术？
  > 1. 请先在社区的各种文档中搜索，不要问已经存在的答案的问题。
  > 1. 请详细描述问题的背景，请表现出自己已经做出的努力。
  > 1. 开源社区意味着需要你自己能解决问题，如果不行，请考虑付费咨询。

<a name="hevc"></a>

### [HEVC/H.265](#hevc)

* `RTMP for HEVC`: 关于RTMP如何支持HEVC。
  > 1. 如何支持RTMP FLV HEVC推流，参考[链接](https://video.stackexchange.com/a/36922/42693)

<a name='hls-fragments'></a>

### [HLS Fragments](#hls-fragments)
* `HLS Fragment Duration`: 关于HLS切片时长
  > 1. HLS切片时长，和GOP长度、是否等待关键帧`hls_wait_keyframe`，切片时长`hls_fragment`，三个因素决定的。
  > 1. 举例来说，GOP若设置为`2s`，切片长度`hls_fragment:5`，等待关键帧`hls_wait_keyframe:on`，那么实际每个TS切片可能在5~6秒左右，因为需要等待一个完整的GOP才能关闭切片。
  > 1. 举例来说，GOP若设置为`10s`，切片长度`hls_fragment:5`，等待关键帧`hls_wait_keyframe:on`，那么实际每个TS切片也是10秒以上。
  > 1. 举例来说，GOP若设置为`10s`，切片长度`hls_fragment:5`，等待关键帧`hls_wait_keyframe:off`，那么实际每个TS切片是5秒左右。切片不是关键帧开头，所以有些播放器起播可能会花屏，或者出现画面比较慢。
  > 1. 举例来说，GOP若设置为`2s`，切片长度`hls_fragment:2`，等待关键帧`hls_wait_keyframe:on`，那么实际每个TS切片可能在2秒左右。这样HLS的延迟比较低，而且不会有花屏或解码问题，但是由于GOP比较小，所以编码质量会稍微有所损失。
  > 1. 虽然切片大小可以设置为小于1秒，比如`hls_fragment:0.5`，但是`#EXT-X-TARGETDURATION`还是1秒，因为它是个整数。而且切片太小，会导致切片数量过多，不利于CDN缓存，也不利于播放器缓存，所以不建议设置太小的切片。
  > 1. 若希望降低延迟，不要将切片设置为1秒以下，设置为1秒或2秒会比较合适。因为就算设置为1秒，由于播放器有取切片的策略，有缓存策略，并不代表延迟就能和RTMP或HTTP-FLV流一样。一般HLS的最小延迟都在5秒以上。
  > 1. GOP就是两个关键帧之间的帧数目，需要在编码器上设置，比如FFmpeg的参数`-r 25 -g 50`，就是帧率为25fps，GOP为50帧，也就是2秒。
  > 1. OBS上是有个`Keyframe Interval(0=auto)`，它最小是`1s`，如果设置为0实际上是代表自动，并不是最低延迟设置。低延迟建议设置为1s或2s。

<a name='http-api'></a>

### [HTTP API](#http-api)
* `HTTP RAW API`: 关于RAW API，动态录制DVR等
  > 1. 由于RAW API有各种问题，会导致过度使用，4.0已经将该功能删除，详细原因请看 [#2653](https://github.com/ossrs/srs/issues/2653)
  > 1. 再次强调不要用HTTP RAW API实现业务，这是你的业务系统该做的，用Go或Nodejs搞下就可以。

* `Secure HTTP API`: 关于API鉴权，API安全等
  > 1. 关于HTTP API鉴权，如何防止所有人访问，目前建议用Nginx代理解决，后续会增强，详细请看 [#1657](https://github.com/ossrs/srs/issues/1657)
  > 1. 还可以使用HTTP Callback来实现鉴权，在推流或播放时，调用你的业务系统的API，实现hook。

* `HTTP Callback`: 关于HTTP回调和鉴权。
  > 1. SRS的HTTP回调做鉴权，HTTP Callback, Response如何返回错误码，参考[链接](https://stackoverflow.com/a/70358233/17679565)

<a name='api-security'></a> <a name='https'></a> <a name='https-h2-3'></a>

### [HTTPS & HTTP2/3](#https-h2-3)
* `HTTPS`: 关于HTTPS服务、API、Callback、Streaming、WebRTC等
  > 1. [HTTPS API](../docs/v4/doc/http-api#https-api)提供传输层安全的API，WebRTC推流要求是HTTPS页面自然也只能访问HTTPS API。
  > 1. [HTTPS Callback](../docs/v4/doc/http-callback#https-callback)回调HTTPS服务，如果你的服务器是HTTPS协议，一般业务系统为了安全性都是HTTPS协议。
  > 1. [HTTPS Live Streaming](../docs/v4/doc/delivery-http-flv#https-flv-live-stream)提供传输层安全的Stream流，主要是HTTPS的网页只能访问HTTPS的资源。
  > 1. 单域名自动从`letsencrypt`自动申请SSL证书，方便中小企业部署SRS，也避免HTTPS代理因为流媒体业务代理的开销太大了，参考 [#2864](https://github.com/ossrs/srs/issues/2864)
  > 1. 使用Nginx或Caddy等反向代理，HTTP/HTTPS Proxy，提供统一的HTTP/HTTPS服务，参考 [#2881](https://github.com/ossrs/srs/issues/2881)
* `HTTP2`: 关于HTTP2-FLV或HTTP2 HLS等。
  > 1. SRS不会实现HTTP2或者HTTP3，而是推荐使用反向代理来转换协议，比如Nginx或者Go。
  > 1. 由于HTTP是非常非常成熟的协议，现有的工具和反向代理能力非常完善，SRS没有必要实现完整的协议。
  > 1. SRS已经实现的是一个简单的HTTP 1.0的协议，主要提供API和Callback的能力。

<a name='latency'></a>

### [Latency](#latency)
* `Latency`: 关于如何降低延迟，如何做低延迟直播，WebRTC延迟多少。
  > 1. 直播延迟一般1到3秒，WebRTC延迟在100ms左右，为何自己搭出来的延迟很大？
  > 1. 最常见的延迟大的原因，是用VLC播放器，这个播放器的延迟就是几十秒，请换成SRS的H5播放器。
  > 1. 延迟是和每个环节都相关，不仅仅是SRS降低延迟就可以，还有推流工具(FFmpeg/OBS)和播放器都相关，具体请参考 [Realtime](../docs/v4/doc/sample-realtime) 一步步操作，别上来就自己弄些骚操作操作，先按文档搭出来低延迟的环境。
  > 1. 如果一步步操作还是发现延迟高，怎么排查呢？可以参考 [#2742](https://github.com/ossrs/srs/issues/2742)
* `HLS Latency`: 关于HLS协议的延迟。
  > 1. HLS的延迟太大，切换内容后观看到需要挺久，如何降低HLS延迟，参考[链接](https://video.stackexchange.com/a/36923/42693)
  > 1. 如何配置HLS降低延迟，参考[HLS Latency](../docs/v6/doc/hls#hls-low-latency)
* `Benchmark`: 关于延迟的测量和测试。
  > 1. 如何测量和优化直播的延迟，各个环节和协议的延迟，如何改善和度量延迟，参考[链接](https://stackoverflow.com/a/70402476/17679565)

<a name='performance'></a> <a name='memory'></a>

### [Performance](#performance) and [Memory](#memory)
* `Performance`: 关于性能优化，并发，压测，内存泄漏，野指针
  > 1. 性能是一个综合话题，是项目的质量、支持的容量和并发、如何优化性能等比较笼统的叫法，甚至也包含内存问题，比如内存泄漏（导致性能降低）、越界和野指针问题。
  > 1. 如果是需要了解SRS的并发，必须分为直播和WebRTC单独的并发，直播可以用[srs-bench](https://github.com/ossrs/srs-bench)，WebRTC可以用[feature/rtc](https://github.com/ossrs/srs-bench/tree/feature/rtc)分支压测，获取特定码率和延迟以及业务特点下，你的硬件和软件环境所能支持的并发数。
  > 1. SRS也提供了官方的并发数据，具体可以参考 [Performance](https://github.com/ossrs/srs/blob/4.0release/trunk/doc/PERFORMANCE.md#performance) ，还给出了如何测量这些并发，以及什么条件下的数据，还有具体的优化代码。
  > 1. 如果是需要查性能问题，或者内存泄漏，或者野指针问题，必须使用系统的相关工具，比如perf、valgrind或者gperftools等工具，具体请参考 [SRS性能(CPU)、内存优化工具用法](https://www.jianshu.com/p/6d4a89359352) 或者 [Perf](../docs/v4/doc/perf) 。
  > 1. 特别强调，valgrid从SRS 3.0(含)开始已经支持，ST的patch已经打上了。

<a name='player'></a>

### [Player](#player)

* `Player`: 关于播放器的选择和平台支持情况。
  > 1. 如何选择直播播放器，以及对应的协议和延迟介绍，推RTMP播放HTTP-FLV/HLS/WebRTC：参考[链接](https://stackoverflow.com/a/70358918/17679565)
  > 1. 如何用H5播放HTTP-FLV，MSE的适配情况，各个平台的H5播放器，iOS如何用WASM播FLV，参考[链接](https://stackoverflow.com/a/70429640/17679565)

<a name='rtsp'></a>

### [RTSP](#rtsp)
* `RTSP`：RTSP推流，RTSP服务器，RTSP播放等
  > 1. SRS支持用Ingest拉RTSP，不支持推RTSP流到SRS，这不是正确的用法，详细原因请参考 [#2304](https://github.com/ossrs/srs/issues/2304) 。
  > 1. 当然RTSP服务器，RTSP播放，更加不会支持，参考 [#476](https://github.com/ossrs/srs/issues/476)
  > 1. 如果你需要非常多比如1万路摄像头接入，那么用FFmpeg可能会比较费劲，这么大规模的业务，比较推荐的方案是自己用ST+SRS的代码，实现一个拉RTSP转发的服务器。
* `Browser RTSP`: 如何使用浏览器播放RTSP等
  > 1. H5如何播放RTSP流，FFmpeg拉RTSP流，如何降低延迟，参考[链接](https://stackoverflow.com/a/70400665/17679565)
  > 1. 如何在Web浏览器中观看IP摄像头的RTSP流，参考[链接](https://stackoverflow.com/a/77335988/17679565)
* 如何用一个服务器接收所有的IPC流，内网RTSP转公网直播或RTC，参考[链接](https://stackoverflow.com/a/70901153/17679565)

<a name='solution'></a>

### [Solution](#solution)
* `Media Stream Server`: 关于媒体服务器和比较。
  > 1. 如何做直播或通话，直播和RTC的区别和关注点的不同，参考[链接](https://stackoverflow.com/a/70401471/17679565)
  > 1. Android之间如何做直播，直播服务器和播放器，两个Android之间如何传视频，参考[链接](https://stackoverflow.com/a/70400557/17679565)
  > 1. 媒体服务器推荐和协议介绍，直播有哪些协议，参考[链接](https://stackoverflow.com/a/70400495/17679565)
* `Raspberry Pi`: 关于树莓派的支持。
  > 1. 远程控制Raspberry PI摄像头和车，直播和纯WebRTC方案，参考[链接](https://stackoverflow.com/a/70675353/17679565)
* `Others`：其他方案和常见问题。
  > 1. 为何两个RTMP会逐步不同步，如何使用SRT或WebRTC来让两个不同的流保持同步，参考[链接](https://stackoverflow.com/a/71273229/17679565)
  > 1. SRS源站集群如何支持HLS，切片文件如何分发，参考[链接](https://stackoverflow.com/a/70416358/17679565)
  > 1. SRS源站集群如何扩展，如何解决MESH通信问题，参考[链接](https://stackoverflow.com/a/70416254/17679565)
  > 1. 使用WebRTC录制视频，用SRS将WebRTC转RTMP后录制，参考[链接](https://stackoverflow.com/a/70402235/17679565)
  > 1. RTSP和RTP的差别，RTSP和WebRTC区别，参考[链接](https://stackoverflow.com/a/70401047/17679565)
  > 1. SRS的日志缩写含义，基于连接的日志，参考[链接](https://stackoverflow.com/a/70374760/17679565)
  > 1. FPS为何不准，TBN的含义，转换时的误差，参考[链接](https://stackoverflow.com/a/70373364/17679565)
  > 1. RTMP的tcURL是什么，如何获取流地址，参考[链接](https://stackoverflow.com/a/70920881/17679565)
  > 1. 不用Flash和Nginx，H5如何播放RTMP流，参考[链接](https://stackoverflow.com/a/70920989/17679565)
  > 1. WebRTC是否能替代RTMP，直播是否只能WebRTC，参考[链接](https://stackoverflow.com/a/75491330/17679565)
  > 1. 如何使用云主机自建流媒体系统，参考[链接](https://video.stackexchange.com/a/36925/42693)

<a name='source-cleanup'></a>

### [Source Cleanup](#source-cleanup)
* `Source Cleanup`: 关于超多路流的内存增长等
  > 1. 推流的Source对象没有清理，推流路数增多内存会增长，暂时可以使用[Gracefully Quit](https://github.com/ossrs/srs/issues/413#issuecomment-917771521)绕开，会在未来解决，参考 [#413](https://github.com/ossrs/srs/issues/413)
  > 1. 再次强调，可以用[Gracefully Quit](https://github.com/ossrs/srs/issues/413#issuecomment-917771521)绕开，就算未来解决了这个问题，这个方案也是最靠谱和最优的，重启大法好。

<a name='threading'></a>

### [Threading](#threading)

* SRS为何不支持多线程，如何扩容你的SRS，参考[链接](https://stackoverflow.com/a/75566192/17679565)

<a name='video-guides'></a>

### [Video Guides](#video-guides)

下面是答疑的视频资料，详细讲解了某个话题，如果你的问题类似请直接看视频哈：

* [FAQ：SRS有哪些文档和资料](https://www.bilibili.com/video/BV1QA4y1S7iU/) SRS有哪些文档资料？先看Usage，在看FAQ，接着是Wiki，还有Issues。如果GitHub访问慢怎么办呢？可以把资料Clone到本地，或者访问Gitee镜像。
* [FAQ：SRS是否支持STUN和WebRTC的P2P](https://www.bilibili.com/video/BV13t4y1x7QV/) SRS是否支持STUN协议？如何支持WebRTC P2P打洞？SFU和P2P的区别？
* [FAQ：SRS导致WebRTC丢帧如何排查](https://www.bilibili.com/video/BV1LS4y187xU/) RTMP推流到SRS使用WebRTC播放是常见的用法，RTMP是30帧，WebRTC只有10帧，看起来就会卡顿不流畅，这个视频分享了如何排查这类问题。
* [FAQ：SRS如何实现服务的高可靠和热备](https://www.bilibili.com/video/BV1U34y1776t/) SRS如果挂了，怎么能保障服务不受到影响？如何实现音视频服务的高可靠？如何做流的热备和恢复？
* [FAQ：SRS有哪些Docker镜像](https://www.bilibili.com/video/BV1BZ4y1a7Fg/) Docker是非常好用的技术，SRS提供了完善的Docker镜像，也可以自己打SRS的Docker镜像。
* [FAQ：SRS如何提交Issue](https://www.bilibili.com/video/BV13v4y1A74N/) 如果碰到问题，怎么判断是否是Issue？怎么排查Issue？如何提交新的Issue？为何提交的Issue被删除？
* [FAQ：SRS为何不支持WebRTC的FEC等复杂算法](https://www.bilibili.com/video/BV1CA4y1f7JW/) 什么是WebRTC的拥塞控制算法？FEC和NACK有何不同、如何选择？为何SRS没有支持复杂的算法？为何说复杂牛逼的算法一般没什么鸟用？
* [FAQ：CDN支持WebRTC的完善度](https://www.bilibili.com/video/BV14r4y1b7cH/) CDN或云厂商是否都支持WebRTC了？为何说是差不多支持了？目前还有哪些问题或坑？都有哪些CDN的直播是支持WebRTC协议的？
* [FAQ：如何实现直播混流或WebRTC的MCU](https://www.bilibili.com/video/BV1L34y1E7D5/) 如何给直播添加LOGO？如何实现直播画中画？如何实现WebRTC转直播？如何实现WebRTC的MCU功能？为何RTC架构大多是SFU而不是MCU？什么时候必须用MCU？
* [FAQ：开源SFU如何选？Janus有哪些问题，何解？](https://www.bilibili.com/video/BV1bR4y1w7X1/) Janus是WebRTC领域使用最广泛也是最好的SFU之一，当然和所有SFU一样它也有一堆的问题，选择开源选的不仅是代码和架构，选择的更是活跃的社区和对方向的判断。
* [FAQ：如何更低码率达到同等画质](https://www.bilibili.com/video/BV1qB4y197ov/) 在保证画质的前提下，如何降低码率？我们可以使用动态码率，还可以使用相对空闲的客户端CPU交换码率，还可以在业务上优化，特别多平台推流时需要避免上行码率过高。

<a name='webrtc-cluster'></a>

### [WebRTC Cluster](#webrtc-cluster)
* `WebRTC+Cluster`: 关于WebRTC集群的相关问题
  > 1. WebRTC集群并不是直播集群(Edge+Origin Cluster)，而是叫WebRTC级联，参考[#2091](https://github.com/ossrs/srs/issues/2091)
  > 1. 除了集群方案，SRS还会支持Proxy方案，比集群更简单，也会具备扩展性和容灾能力，参考[#3138](https://github.com/ossrs/srs/issues/3138)

<a name='webrtc-live'></a>

### [WebRTC Live](#webrtc-live)
* `WebRTC+Live`: 关于WebRTC和直播的相关问题
  > 1. WebRTC和RTMP的互相转换，比如RTMP2RTC（RTMP推流RTC播放）， 或者RTC2RTMP（RTC推流RTMP播放），必须要指定转换配置，默认不会开启音频转码，避免较大的性能损失，参考 [#2728](https://github.com/ossrs/srs/issues/2728)
  > 1. SRS 4.0.174之前可以，更新到之后就不工作了，是因为`rtc.conf`不默认开启RTMP转RTC，需要使用`rtmp2rtc.conf`或者`rtc2rtmp.conf`，参考 71ed6e5dc51df06eaa90637992731a7e75eabcd7
  > 1. 未来也不会自动开启RTC和RTMP的转换，因为SRS必须要考虑到独立的RTMP和独立的RTC场景，转换的场景只是其中一个，但是由于转换的场景导致严重的性能问题，所以不能默认开启，会导致独立的场景出现大问题。
* WebRTC如何支持一对多广播，支持非常多的拉流客户端，WebRTC转直播，参考[链接](https://stackoverflow.com/a/71019599/17679565)
* FFmpeg和H5如何做低延迟直播，RaspberryPI采集设备推流，医疗设备远程协助，参考[链接](https://stackoverflow.com/a/71984507/17679565)

<a name='webrtc'></a>

### [WebRTC](#webrtc)
* `WebRTC`: 关于WebRTC推拉流或会议的问题
  > 1. WebRTC比直播复杂多了，很多WebRTC的问题，就不要在SRS里面提Issue，要自己先Google查询下什么问题。如果没有这个能力，就不要用WebRTC，这不是给小白用的功能，坑非常非常的多，没有爬坑能力就别往坑里跳。
  > 1. 比较常见的是Candidate设置不对，导致无法推拉流，这个详细看WebRTC的使用说明：[#307](https://github.com/ossrs/srs/issues/307)
  > 1. 还有UDP端口无法访问的问题，可能是防火墙设置问题，也可能是网络问题，请用工具测试，参考 [#2843](https://github.com/ossrs/srs/issues/2843)
  > 1. 另外比较常见的是RTMP和WebRTC互相转换，请看上面 <a name='webrtc-live' href='#webrtc-live'>#webrtc-live</a> 的说明。
  > 1. 接着就是WebRTC权限问题，比如本机能推流部署到公网不能推流，这是Chrome的安全设置问题，参考 [#2762](https://github.com/ossrs/srs/issues/2762)
  > 1. 还有不太常见，用官网的播放器，是不能播放非HTTPS的SRS的流，这也是Chrome的安全策略问题，参考 [#2787](https://github.com/ossrs/srs/issues/2787)
  > 1. 在docker映射端口时，若改变了端口需要改配置文件，或者通过eip指定，参考 [#2907](https://github.com/ossrs/srs/issues/2907)

* `WebRTC RTMP`: 关于WebRTC和直播相关的问题。
  > 1. WebRTC转RTMP，用WebRTC做直播，H5推流，或低延迟直播，参考[链接](https://stackoverflow.com/a/70402692/17679565)
  > 1. RTMP转WebRTC，做低延迟直播的方案，HTTP-TS和HEVC直播，参考[链接](https://stackoverflow.com/a/75569582/17679565)
  > 1. 如何使用WebRTC推流到视频号等，同时还能录制和WebRTC观看流，参考[链接](https://stackoverflow.com/a/76913341/17679565)

* WebRTC的SFU的作用和应用场景有哪些，SFU功能对比，参考[链接](https://stackoverflow.com/a/75491178/17679565)

<a name='websocket'></a>

### [Websocket](#websocket)
* `WebSocket/WS`：如何支持WS-FLV或WS-TS？
  > 1. 可以用一个Go代理转一次，几行关键代码稳定又可靠，参考[mse.go](https://github.com/winlinvip/videojs-flow/blob/master/demo/mse.go)

## Q&A

### WebRTC Demo Failed

**Question** 加入RTC房间或通话失败
> 根据5.0文档中的[SFU: One to One](../docs/v5/doc/webrtc#sfu-one-to-one)说明，我已经完成了以下配置：
> 1. 将CANDIDATE设置为内网地址192.168.100.140
> 1. 使用Docker启动了RTC服务、信令服务和HTTPS服务
> 1. 成功访问了http://192.168.100.140/demos/并能够正常打开

> 然而，我在点击开始通话或加入房间后，摄像头会亮一下但没有任何反应。已经使用了自签发的OpenSSL key和crt证书，遇到了一个TLS证书握手错误的提示。

**Answer**
  > 1. 首先明确严格按照文档[SFU: One to One](../docs/v5/doc/webrtc#sfu-one-to-one)进行操作
  > 2. 排查证书问题、https连接问题、浏览器权限问题等

## Deleting

如果不符合要求的Issue，一般会打标为Deleting，会在一两周后删除，并回复：

```text
!!! Before submitting a new bug/feature/discussion report, please ensure you have searched for any existing 
bug/feature/discussion and utilized the `Ask AI` feature at https://ossrs.io or https://ossrs.net (for users 
in China). Duplicate issues or questions that are overly simple or already addressed in the documentation 
will be removed without any response.
```

```
这个问题在[Wiki](https://ossrs.net/lts/en-us/docs/v5/doc/getting-started)中有，请看文档。该Issue会被删除，请先阅读FAQ：#2716
```

```
咨询和讨论请加[付费星球](https://mp.weixin.qq.com/s/HdSf7qAR94v2Mxdzf2qLAQ)交流。也可以[加微信群](https://ossrs.net/lts/zh-cn/docs/v4/doc/contact)，在群里交流。
该Issue会被删除，请先阅读FAQ：#2716
```

```
你的问题不符合Issue的要求，请按Issue模版提Bug，不提供**完整**信息的Issue会被直接删除。
该Issue会被删除，请先阅读FAQ：#2716
```

```
你的问题已经在FAQ中存在，该Issue会被删除，请在FAQ中搜索。#2716
```

```
你的问题已经在Issues中存在，属于重复的问题，该Issue会被删除，请在Issues中搜索。#2716
```

```
这个问题不是SRS问题，是FFmpeg、WebRTC、客户端、OBS、反向代理Nginx、流的内容、编译工具问题，该Issue会被删除。#2716
```

```
Oryx的问题，请提交到[srs-stack](https://github.com/ossrs/oryx)，该Issue会被删除，请先阅读FAQ：#2716
```

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/pages/faq-zh)
