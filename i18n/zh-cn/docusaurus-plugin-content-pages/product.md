# Product

关于SRS的来源，定位，愿景和计划。

* [Release5.0](#release50), 2022~至今，开发代号：Bee（蜜蜂）。
* [Release4.0](#release40), 2020~2021，开发代号：Leo（付亮）。
* [Release3.0](#release30), 2018~2019，开发代号：OuXuli（欧旭理）。
* [Release2.0](#release20), 2015~2017，开发代号：ZhouGuowen（周国文）。
* [Release1.0](#release10), 2013~2014，开发代号：HuKaiqun（胡开群）。

## History

简单介绍下SRS的历史吧，我们倒着说。

2022年6月，组建了SRS的TOC和开发者社区，活跃开发者人数达到42人。

2021年1月，[开源技术委员会成立](https://mp.weixin.qq.com/s/NM7zOKYNUbMZPPZLi1wGeA)，
[4月在LVS分享SRS在阿里云的最佳实践](https://mp.weixin.qq.com/s/keeVd2Lu3ZEYERo_jvZSFg)并支持[AV1](https://mp.weixin.qq.com/s/v7jp58geuvrcet8zskDxdQ)，
5月完善RTC文档包括[RTC和RTMP转换](https://mp.weixin.qq.com/s/SMGER9vso14cqDtB-XkGNw)、[一对一通话](https://mp.weixin.qq.com/s/xWe6f9WRhtwnpJQ8SO0Eeg)、
[直播连麦](https://mp.weixin.qq.com/s/7xexl07rrWBdh8xennXK3w)和[多人会议](https://mp.weixin.qq.com/s/CM2h99A1e_masL5sjkp4Zw)，
5月[改善SRT](https://mp.weixin.qq.com/s/FjzeBmVZ-sSeWhXgulk5bw)。

2020年，SRS4.0开始开发，[1月支持SRT](https://mp.weixin.qq.com/s/xWuB6_J99N-C-pSXDZzKvA)，
[2月支持K8S](https://mp.weixin.qq.com/s/RCGEnGmuf3MtYpDd_7k5HQ)，[3月支持WebRTC](https://mp.weixin.qq.com/s/PhKOzA60eXI7LJpqgA5O_w)，
[6月发布SRS 3.0](https://mp.weixin.qq.com/s/pN3Y-C6DvdTwLMngKrmxIg)，
[10月官方App上线](https://mp.weixin.qq.com/s/GQJzByb3UhfXBzLQagVBtQ)和[Flutter](https://mp.weixin.qq.com/s/lmmiRFIoGu1h_8ashPZsGQ)，
[11月支持HTTPS](https://mp.weixin.qq.com/s/FvmqXSGMaGsRHR9_CAjqpw)，[12月成为全球Top1开源视频服务器](https://mp.weixin.qq.com/s/8arzMkgmiOUpiZutiDfh8w)。

2019.12，SRS3核心协议HTTP/RTMP覆盖率95%，总体覆盖率42%，稳定性工作有了关键进展。开始进入Alpha发布阶段。
SRS全面支持[Docker](https://github.com/ossrs/dev-docker)。

2018.02，支持[源站集群](https://mp.weixin.qq.com/s/mATtX0yY5pabRQ2YgEgvbw)，直播集群（源站集群和边缘集群）完善。

2017.3.3, [SRS2.0 r0](https://github.com/ossrs/srs/releases/tag/v2.0-r0)正式发布，足足延期了2年，主要是工作太忙了，
没有大块的时间维护SRS。2017年初换工作了，中间有2个月时间撸起袖子加油干的时间，就把r0给刨出来了。一共挣扎了869天(+100%)，234次(+5%)更新，
新增1550次(+80%)提交，平均每天1.78次(-60%)提交，新增了2.69万行(+45%)代码，解决了229个(+27%)ISSUE。
参考[微信文章](http://mp.weixin.qq.com/s/DJaRjZ_ItmpdUkA23cn5Dw).

2017.02，支持[录制为MP4](https://mp.weixin.qq.com/s/2x0_NVMyL-LsX9-D_E3zFg)和MP4格式。
[4月支持Haivison编码器](https://mp.weixin.qq.com/s/Fr4vlOYkj3WQlSAprcrNlA)，[6月支持DASH](https://mp.weixin.qq.com/s/FKo0Ii6mEjCcGvPQaqXtmA)。

2016.05，对比了[SRS/BMS/NGINX和CDN的区别](https://mp.weixin.qq.com/s/DYrivGni_JCy4coq94yp_Q)。
当时尝试过开源商业化方案，提供SRS开源免费版本，BMS是商业化收费版本，但这条路在国内不好走；中国的开源要走出中国特色的道理，
国外的模式搬过来不一定行得通。

2014.10，启动[SRS2.0](#release20)研发，预计6个月左右的研发周期，主要目标是完全了解和掌握st，简化服务器的客户端模型，
以及其他小功能的完善。比较大的方向在3.0+支持。

2014.10，[SRS1.0](#release10)beta发布。从0到1.0，SRS花了1年时间，17个里程碑，
[7](https://github.com/ossrs/srs/tree/1.0release)个开发版，223个修订版，43700行功能代码，15616行utest代码，1803次提交，161个bug和功能，
解决了[117](https://github.com/ossrs/srs/tree/1.0release)个，可在[1](https://github.com/ossrs/srs/tree/1.0release)个平台运行(linux)，支持4种cpu(x86/x64/arm/mips)，[11](https://github.com/ossrs/srs/tree/1.0release)个核心功能(origin、
[edge](v4_CN_Edge)、 [vhost](v4_CN_RtmpUrlVhost)、 [transcode](v4_CN_FFMPEG)、 [ingest](v4_CN_Ingest)、 [dvr](v4_CN_DVR)、
[forward](v4_CN_FFMPEG)、 [http-api](v4_CN_HTTPApi)、 [http-callback](v4_CN_HTTPCallback)、 [reload](v4_CN_Reload)、
[tracable-log](v4_CN_SrsLog))，[35](https://github.com/ossrs/srs/tree/1.0release)个功能点，[58](v4_CN_Home)篇wiki，SRS的QQ群有245位成员，活跃成员141人，
2位主作者，12位贡献者，14位捐赠者，至少有蓝汛、VeryCloud、VeryCDN、
清华电视台在[使用或基于SRS改自己的服务器](v4_CN_Sample)，数百个各种行业的公司在使用SRS主要包含视频监控、移动端、在线教育、
秀场和KTV、互动视频、电视台、物联网、学生。

2014.3，进入反馈期，树莓派，极路由，cubieboard等嵌入式设备上有人问是否能支持。我自己买了树莓派，在上面运行成功，
改了st的一个bug。从这个时候开始，是功能爆发的时期，得到群里童鞋们的反馈。转码，转发，采集，录制都是这个时期的工作。

2013.11，加入观止负责研发管理工作。后来观止创想做编码器，编码器需要输出到rtmp服务器，nginx-rtmp又经常出问题，
就打算用我的SRS替换nginx-rtmp。后来编码器上线过程中，我也逐步完善了SRS，这是SRS的快速成长期。开放服务器，
就让客户可以更好的用我们编码器，而且我们编码器可以支持拉模式。这个阶段主要是源站阶段。

2013.10，SRS创建。SRS是2013.9我从蓝汛离职后，我参考nginx-rtmp写了个简洁直播源站服务器。蓝汛接我工作的同事也可以看到服务器如何一步步构建。
蓝汛的客户也可以用这个源站，那些乱七八糟的源站对接太麻烦。我想用业余时间构建不受客户随意影响的产品，只遵循核心价值而加入功能，
而不会因为赚钱或者客户头脑发热，总之，实现我对于产品价值和质量，真正实现客户核心要求，定位清晰，一个实践现代软件工程和研发理念的服务器。

## Vision

SRS是全球TOP1的开源视频服务器，支持直播和WebRTC，可应用于多种视频场景和行业。

* Mission：用开源快速展示视频的未来。
* Vison：让新手都能跨越视频的门槛，让开发者保持浓密的头发。
* Values：简单、可靠、开放。

详细解读请看[欢迎关注SRS：使命、愿景、价值观](https://mp.weixin.qq.com/s/Mx9LMrUVwKq6C3wgHLUibQ)。

## Release5.0

开发代号：Bee（蜜蜂），代表SRS正式开始开源社区驱动，协作是主要的特点，也不断提示我们做开源项目需要像蜜蜂那样，持续的每天都付出时间，才能做好开源项目。
感谢所有三百多位开发者，以及技术委员会的核心开发者，特别感谢[TOC](https://github.com/ossrs/srs/blob/develop/trunk/AUTHORS.md#toc)，
大家一起在不断做出自己的贡献。2021年6月，SRS进入[木兰开源社区](https://mulanos.oschina.net/)孵化，感谢导师阿里云陈绪、周明辉教授、腾讯单致豪，感谢木兰社区杨丽蕴主任的大力支持。特别感谢腾讯Tommy(李郁韬)、Eddie(薛迪)、Leo(刘连响)、Vulture(李志成)、Dragon(兰玉龙)，以及各位开发者领导对于SRS的认可和对开发者参与开源贡献的支持。特别感谢社区经理耿航和刘歧，对社区推广和发展做出的贡献。

- [x] 优化SRT，支持协程原生架构。[#3010](https://github.com/ossrs/srs/issues/3010)
- [x] 支持amd/armv7/aarch64多CPU架构的Docker镜像。[#3058](https://github.com/ossrs/srs/issues/3058)

预计5.0会在2023年底发布。

## Release4.0

开发代号：Leo（付亮）。感谢我流媒体和管理生涯的Leader，蓝汛前VP付亮(Leo)，在当年研发流媒体时给了坚定的支持，在刚开始带团队时亲自辅导和交流。
感谢我十几年职业生涯中遇到的Leader，包括大唐的何力和朱晖，微软的舒适，蓝汛的付亮、张玮、Michael、刘岐、苗权和文杰，快手的于冰，观止的杨默涵和雷健，
LVS的包研，阿里的叔度、致凡、华大、文景、士豪和还剑。感谢一起成长和码代码的同学们。

- [x] 支持WebRTC推流和播放，参考 [#307](https://github.com/ossrs/srs/issues/307)
- [x] 支持RTMP转RTC，低延迟直播场景，参考 [#307](https://github.com/ossrs/srs/issues/307)
- [x] 支持RTC转RTMP，会议录制，参考 [#307](https://github.com/ossrs/srs/issues/307)
- [x] 支持RTC单端口复用，避免开多端口问题，参考 [#307](https://github.com/ossrs/srs/issues/307)
- [x] 完善HTTP-API，支持WebRTC和HLS，参考[#2578](https://github.com/ossrs/srs/pull/2578), [#2483](https://github.com/ossrs/srs/pull/2483), [#2509](https://github.com/ossrs/srs/pull/2509)
- [x] 增强HTTPS，支持[HTTPS-FLV](https://github.com/ossrs/srs/issues/1657#issuecomment-722971676), [HTTPS-API](https://github.com/ossrs/srs/issues/1657#issuecomment-722904004), [HTTPS-Callback](https://github.com/ossrs/srs/issues/1657#issuecomment-720889906)
- [x] 支持Docker和K8S对接，云原生改造，参考 [#1579](https://github.com/ossrs/srs/issues/1579), [#1595](https://github.com/ossrs/srs/issues/1595)
- [x] 支持RTC客户端切网，多网卡切换问题，参考 [#307](https://github.com/ossrs/srs/issues/307)
- [x] 支持回归测试，RTC自动测试，参考 [srs-bench](https://github.com/ossrs/srs-bench/tree/feature/rtc)
- [x] [experimental]支持SRT推流，广电广泛支持的新协议。参考：[#1147](https://github.com/ossrs/srs/issues/1147).
- [x] [feature]支持GB28181推流，摄像头通过国标协议推流。参考：[#1500](https://github.com/ossrs/srs/issues/1500).

预计4.0会在2021年底发布。

## Release3.0

开发代号：OuXuli（欧旭理）。感谢我的大学老师欧旭理老师(欧工)，他创建的中勤在线让我可以在大学学习软件理论时还能实践出真知。
感谢中勤的同学们，陈哲、刘小婧、盛谢华、易念华、马琰以及中勤的其他同学，希望SRS能带着我们最初的梦想越行越远~

[SRS release 3.0](https://github.com/ossrs/srs/tree/3.0release)，研发阶段。主要的目标是：

- [x] 支持NGINX-RTMP的EXEC功能。参考：[#367](https://github.com/ossrs/srs/issues/367).
- [x] 支持NGINX-RTMP的dvr control module功能。参考：[#459](https://github.com/ossrs/srs/issues/459).
- [x] 支持安全的可读写的HTTP API（HTTP Security Raw Api）。参考：[#470](https://github.com/ossrs/srs/issues/470), [#319](https://github.com/ossrs/srs/issues/319), [#459](https://github.com/ossrs/srs/issues/459).
- [x] 支持DVR 为MP4文件。参考: [#738](https://github.com/ossrs/srs/issues/738).
- [x] 支持截图，HttpCallback和Transcoder两种方式。参考：[#502](https://github.com/ossrs/srs/issues/502).
- [x] 重写错误和日志处理，使用复杂错误，简化日志。参考：[#913](https://github.com/ossrs/srs/issues/913).
- [x] 重写错误处理的工作流，准确定义异常情况。参考：[#1043](https://github.com/ossrs/srs/issues/1043).
- [x] 学习英语，重写English WIKI。参考：[#967](https://github.com/ossrs/srs/issues/967).
- [x] 支持源站集群，负载均衡和热备。参考：[#464](https://github.com/ossrs/srs/issues/464)，[RTMP 302](https://github.com/ossrs/srs/issues/92).
- [x] 增加UTest，覆盖核心关键逻辑代码。参考：[#1042](https://github.com/ossrs/srs/issues/1042).
- [x] [experimental]支持MPEG-DASH，可能的未来标准。参考：[#299](https://github.com/ossrs/srs/issues/299).

[SRS Release 3.0](https://github.com/ossrs/srs/tree/3.0release)预计在2019年年底发布。

## Release2.0

开发代号：ZhouGuowen（周国文）。感谢我的高中老师周国文老师，教我成人自立，为我翻开一个新的篇章。

[SRS release 2.0](https://github.com/ossrs/srs/tree/2.0release)，预计研发周期为1年左右。主要的目标是：

- [x] 翻译中文wiki为英文。
- [x] 提升性能，支持10k+播放和4.5k+推流。参考：[#194](https://github.com/ossrs/srs/issues/194)，[#237](https://github.com/ossrs/srs/issues/237)和[#251](https://github.com/ossrs/srs/issues/251)
- [x] srs-librtmp支持发送h.264和aac裸码流。参考：[#66](https://github.com/ossrs/srs/issues/66)和[#212](https://github.com/ossrs/srs/issues/212)
- [x] 学习和简化st，只保留linux/arm部分代码。参考：[#182](https://github.com/ossrs/srs/issues/182)
- [x] srs-librtmp支持windows平台。参考：[bug #213](https://github.com/ossrs/srs/issues/213), 以及[srs-librtmp](https://github.com/winlinvip/srs.librtmp)
- [x] 简化握手，使用模板方法代替union。参考：[#235](https://github.com/ossrs/srs/issues/235)
- [x] srs-librtmp支持劫持IO，应用于[srs-bench](https://github.com/ossrs/srs-bench).
- [x] 支持实时模式，最低支持0.1秒延迟。参考：[#257](https://github.com/ossrs/srs/issues/257)
- [x] 支持允许和禁止客户端推流或播放。参考：[#211](https://github.com/ossrs/srs/issues/211)
- [x] DVR支持[自定义文件路径](https://github.com/ossrs/srs/issues/179)和[DVR http callback](https://github.com/ossrs/srs/issues/274).
- [x] 可商用的内置HTTP服务器，参考GO的http模块。参考：[#277](https://github.com/ossrs/srs/issues/277).
- [x] RTMP流转封装为HTTP Live flv/aac/mp3/ts流分发。参考：[#293](https://github.com/ossrs/srs/issues/293).
- [x] 增强的DVR，支持Append/callback，参考：[#179](https://github.com/ossrs/srs/issues/179).
- [x] 增强的HTTP API，支持stream/vhost查询，参考：[#316](https://github.com/ossrs/srs/issues/316).
- [x] 支持HSTRS(HTTP流触发RTMP回源)，支持HTTP-FLV等待，支持边缘回源，参考：[#324](https://github.com/ossrs/srs/issues/324).
- [x] [experimental]支持HDS，参考：[#328](https://github.com/ossrs/srs/issues/328).
- [x] [experimental]支持Push MPEG-TS over UDP to SRS, 参考：[#250](https://github.com/ossrs/srs/issues/250).
- [x] [experimental]支持Push RTSP to SRS，参考：[#133](https://github.com/ossrs/srs/issues/133).
- [x] [experimental]支持远程控制台，链接： [console](https://github.com/ossrs/srs-console).
- [x] 其他小功能的完善。

[SRS Release 2.0](https://github.com/ossrs/srs/tree/2.0release)于2017.3.3正式发布。

## Release1.0

开发代号：HuKaiqun（胡开群）。感谢我的初中老师胡开群和高昂老师，教育我热爱自己所做的事情。

[SRS release 1.0](https://github.com/ossrs/srs/tree/1.0release)，预计研发周期为1年左右。主要的目标是：

- [x] 提供互联网直播的核心业务功能，即RTMP/HLS直播。能对接任意的编码器和播放器，集群支持对接任意的源站服务器。
- [x] 提供丰富的外围流媒体功能，譬如Forward，Transcode，Ingest，DVR。方便开展多种源站业务。
- [x] 完善的运维接口，reload，HTTP API，完善和保持更新的wiki。另外，提供配套的商业监控和排错系统。
- [x] 完备的utest机制，还有gperf（gmc，gmp，gcp）和gprof性能以及优化机制。提供c++层次足够满意的性能和内存错误查找机制。
- [x] 在ARM/MIPS等嵌入式CPU设备Linux上运行。另外，提供配套的内网监控和排错，cubieboard/raspberry-pi的嵌入式服务器。
- [x] 高性能服务器，支持2.7k并发。

[SRS Release 1.0](https://github.com/ossrs/srs/tree/1.0release)已经在2014.12.5如期发布。

Beijing, 2014.3<br/>
Winlin

