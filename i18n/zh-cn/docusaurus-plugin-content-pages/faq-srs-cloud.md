# FAQ

快速目录

* [Video Guides](#video-guides)：视频教程。
* [如何起步](#getting-started)：买了SRS云服务器怎么用，怎么开头，怎么入门，怎么起步，怎么开始折腾。
* [如何升级](#how-to-upgrade)：如何升级到最新版本或稳定版本，为何不支持界面点击升级。
* [支持哪些平台](#support-platform)：支持哪些平台，支持镜像，想直接用服务器或命令行安装，或宝塔安装
* [如何推多路流](#multiple-streams)：一路流不够，想推多路流，想改默认的流名称和流地址。
* [带宽太低，提升带宽](#bandwidth)：带宽不够，想提升带宽，在CVM中用云SRS。
* [如何设置免费HTTPS](#https)：如何申请免费HTTPS证书，如何申请多个域名的证书。
* [如何修改推流鉴权的密钥](#update-publish-secret)：更新推流鉴权的密钥，更换推流密钥
* [如何禁用推流鉴权](#no-publish-auth)：不想要推流鉴权，设备不支持特殊字符。
* [如何录制到本地磁盘](#record): 如何录制到云SRS的本地磁盘。
* [云录制和云点播的区别](#cos-vs-vod): 录制是用云录制还是云点播，有何区别。
* [如何录制到云存储](#dvr-cloud-storage): 录制到COS、OSS或S3等云存储。
* [安装后无法访问](#unavailable): 安装后提示错误，或者Redis没准备好。
* [SRS转推和OBS转推的区别](#restream-vs-obs): SRS的多平台转推，和OBS转推插件的区别。
* [SRS如何转推自定义平台](#restream-custom): SRS的多平台转推，如何推到自定义的直播平台。
* [如何更换FFmpeg](#use-custom-ffmpeg): 如何更换云SRS中的FFmepg为自定义版本。
* [宝塔安装SRS非常慢](#install-speedup): 海外用宝塔安装非常慢，访问阿里云镜像太慢。
* [宝塔如何安装最新的云SRS](#bt-install-manually): 手动安装宝塔插件，安装最新的插件。
* [宝塔CentOS7安装失败](#bt-centos7-error): CentOS7宝塔安装失败，找不到目录，或GLIBC版本问题。
* [怎么购买AI换脸服务](#how-to-buy-ai): AI换脸怎么实现？怎么买模型？找谁买？
* [提的需求或功能如何实现](#rules)：想要实现更多的功能，想要定制，想要优化改进。
* [无法实现预期效果](#can-not-replay)：遇到问题，达不到预期效果。
* [云SRS和SRS的差别](#diff-srs)：云SRS对比SRS的差异，为什么要有云SRS。
* [和宝塔的差别](#diff-baota)：和虚拟机管理软件宝塔的差异。
* [和视频云的差别](#diff-vcloud)：和一般视频云服务的差异。
* [如何重装系统](#reinstall)：针对已经有了Lighthouse或CVM的朋友。
* [如何授权排查问题](#auth-bt): 出现问题时如何授权机器权限。
* [成本优化](#cost-opt)：关于成本和成本优化。
* [OpenAPI](#openapi): 关于开放API，使用API获取相关信息。
* [功能列表](#features): 关于支持的功能清单。
* [版本规划](#changelog): 关于版本和里程碑。

你也可以在页面中搜索关键字。

> Note: 这是关于SRS Cloud的FAQ，如果是SRS的FAQ请参考[SRS FAQ](/faq)

<a name='video-guides'></a><br/><br/><br/>

## Video Guides

下面是答疑的视频资料，详细讲解了某个话题，如果你的问题类似请直接看视频哈：

* [FAQ：如何更低码率达到同等画质](https://www.bilibili.com/video/BV1qB4y197ov/) 在保证画质的前提下，如何降低码率？我们可以使用动态码率，还可以使用相对空闲的客户端CPU交换码率，还可以在业务上优化，特别多平台推流时需要避免上行码率过高。

<a name='getting-started'></a><br/><br/><br/>

## 如何起步

请先购买和设置[SRS云服务器](https://www.bilibili.com/video/BV1844y1L7dL/)，包括如何设置防火墙，视频很短只有5分钟，但是不看会有非常多的问题，请不要跳过这个基本视频。

进入SRS云服务器后，根据不同应用场景，会有对应的视频教程，如下图所示：

![](/img/page-2023-03-04-01.png)

每个场景也有完善的介绍，以及详细的操作步骤，如下图所示：

![](/img/page-2023-03-04-02.png)

请不要乱试，一定要跟引导做，音视频乱试一定会出问题。

<a name="how-to-upgrade"></a><br/><br/><br/>

## 如何升级

如何升级到最新版本或稳定版本，为何不支持界面点击升级？

由于云SRS支持多个平台，包括docker等，而docker是不能自己升级自己的，所以云SRS也不支持界面升级，需要手动升级。

Docker启动时会指定版本，比如`ossrs/srs-cloud:v1.0.293`，只需要删除容器后指定新版本启动即可，比如`ossrs/srs-cloud:v1.0.299`。

如果使用`ossrs/srs-cloud:1`则是用最新的版本，则需要手动更新，比如`docker pull ossrs/srs-cloud:1`。

如果使用宝塔，则删除应用后重装新版本即可，数据是保存在`/data`目录，不会丢失。

<a name="support-platform"></a><br/><br/><br/>

## 支持哪些平台

云SRS支持腾讯云Lighthouse和CVM镜像，DigitalOcean镜像，其他平台可以用宝塔安装。

云SRS当然是各种云平台多支持，最方便的是镜像，也就是云服务器的镜像，如果想简单省事就请用镜像，其他的方式容易弄出问题来，请不要高估自己的折腾能力，大家真的属于那80%折腾不了的，强烈建议应该用镜像：

* Lighthouse：腾讯云的轻量云服务器镜像，使用参考[这里](https://mp.weixin.qq.com/s/fWmdkw-2AoFD_pEmE_EIkA)
* CVM：腾讯云的云服务器镜像，带宽比Lighthouse高可到100Mbps，使用参考[这里](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)
* DigitalOcean: 海外轻量云服务器的镜像，使用参考[这里](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ)

如果你不想用虚拟机镜像，想直接用服务器或命令行安装，或宝塔安装，也是完全没问题：

* 宝塔：其他云平台可以用宝塔安装，要求是CentOS 7+或Ubuntu 20+的系统，使用参考[这里](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ)
* aaPanel：海外的宝塔，如果你的机器是海外的，一定不要用宝塔而要用aaPanel，使用参考[这里](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)

> Note: 如果你要命令行安装云SRS，可以先用命令行安装宝塔，然后再安装云SRS。

这些安装方式都在视频教程中有介绍，请参考[这里](https://www.bilibili.com/video/BV1844y1L7dL/)，几分钟的视频，有分章节的（要在B站App或者PC浏览器打开才有），可以直接跳到对应章节。

<a name='multile-streams'></a><br/><br/><br/>

## 如何推多路流

默认只有一个推流地址，要推多个流怎么办？如何更换流地址？

可以改流名称，比如默认给的推流地址是：

* `rtmp://1.2.3.4/live/livestream?secret=xxx`

可以把`livestream`修改成任意的，就可以直接推：

* rtmp://1.2.3.4/live/`any`?secret=xxx
* rtmp://1.2.3.4/live/`stream`?secret=xxx
* rtmp://1.2.3.4/live/`you`?secret=xxx
* rtmp://1.2.3.4/live/`want`?secret=xxx

如下图所示，可以点更新按钮自动更换推流和播放的名称：

![](/img/page-2023-03-04-03.png)

> Note: 当然了，播放也得改成对应的流名称。

<a name="bandwidth"></a><br/><br/><br/>

## 带宽太低，提升带宽

轻量应用服务器的带宽4~20Mbps不等，对于音视频来说还是会有些限制，如果你想更高带宽，比如到100Mbps，那么可以选择[CVM镜像](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)。

> Note: 云SRS的使用都是一致的，购买和平台配置有所不同。

CVM云服务器的优势是：

* 带宽最高100Mbps，可以用多平台转发到另外CVM服务器，十台CVM就可以实现1Gbps带宽，当然得摸摸自己腰包了哈。
* 按量计费，可以随时停机不收费，需要使用时再开机使用。对于比较低频的应用场景比较友好。

CVM云服务器的劣势是：

* 成本高，没有送的流量包。轻量服务器成本低，送的流量包基本上够一般的直播了。所以请大家自己算一算成本。
* 操作复杂，CVM的安全组比轻量的防火墙操作复杂多了，请大家自己试试，不行就换轻量吧。
* 没有后台链接，界面比较复杂，如果不行就换轻量吧。

如果知道了优势和劣势，还是要选择CVM，请参考[云SRS：支持CVM镜像](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)。

<a name="https"></a><br/><br/><br/>

## 如何设置免费HTTPS

云SRS支持申请免费HTTPS证书，而且可以申请多个域名的证书，还可以自动续期。比如，以下HTTPS网站的证书，都是跑了云SRS后一键自动申请的：

* https://ossrs.io SRS的海外文档网站。
* https://www.ossrs.io SRS的海外文档网站。
* https://r.ossrs.net SRS的稳定版演示服务器。

操作非常简单，只需要三步，具体请看[这里](https://ossrs.net/lts/blog/2022/04/12/SRS-Cloud-HTTPS)：

1. 购买域名并备案，一定要有自己的合法域名，否则无法申请证书的哈。
2. 将域名解析到云SRS的公网IP，可以通过域名访问到你的云SRS就可以，可以加多个域名解析，比如 `ossrs.io` `www.ossrs.io` 都是解析到同一个云SRS服务器的。
3. 在云SRS的 `系统设置 > HTTPS > 自动HTTPS证书` 填写你的域名，多个用分号分割，点申请就行了。

> Note: 申请域名就行了，不要再上传，申请了就可以了，不需要再上传一次。

> Note: 请使用宝塔申请，操作步骤和上面类似。云SRS将不再支持证书申请，原因是certbot不支持多平台的docker镜像，在其他平台上使用会有问题。

申请成功后，在浏览器敲https加你的域名，就可以访问你的网站了。

<a name="update-publish-secret"></a><br/><br/><br/>

## 如何修改推流鉴权的密钥

若你需要更新推流鉴权的密钥，或者更换推流密钥，可以按以下操作步骤：

1. 进入`系统设置`面板。
1. 选择`流鉴权`标签页。
1. 输入新的流密钥。
1. 点`更新`按钮。
1. 刷新各个场景的页面，推流密钥就自动更新了。

如下图所示：

![](/img/page-2023-03-04-04.png)

若需要禁用推流鉴权，请参考下面的说明。

<a name="no-publish-auth"></a><br/><br/><br/>

## 如何禁用推流鉴权

在场景页面中，标准的推流格式，是带`?secret=xxx`鉴权的，比如`rtmp://ip/live/livestream?secret=xxx`

发现有些摄像机，不支持`?secret=xxx`的格式，所以会提示地址不支持。

这种情况下，其实可以直接将密钥`xxx`放在流名称中，比如：`rtmp://ip/live/livestreamsecretxxx`，这样就没问题了。

当然如果你就只需要推一个流，可以直接把密钥作为流名称，比如：`rtmp://ip/live/xxx`。

> Note: 当然了，播放也得改成一样的流名称才行，也要有密钥，因为这里是把密钥放在流名称中了，播放当然也得改了。

这样的方式，是有安全性，也能支持不支持特殊字符的设备，加上推流密钥本来就可以改，所以可以改成自己想要的方式。

<a name="record"></a><br/><br/><br/>

## 如何录制到本地磁盘

如何录制到云SRS的本地磁盘？升级到v1.0.252后，在录制中就可以看到有本地录制了。

本地录制的限制和解决方案，请参考 #42

<a name="cos-vs-vod"></a><br/><br/><br/>

## 云录制和云点播的区别

云SRS提供了云录制和云点播两个类似的功能，录制是用云录制还是云点播，有何区别？

云录制可以认为是把直播写到了云盘，保存的是HLS格式，是原始的视频流。如果你是要将HLS下载下来转码和剪辑，那会比较合适。云录制是存储在腾讯云COS云存储的，可以认为是个无限磁盘，避免写爆云SRS的磁盘。

云点播提供了HLS和MP4两种格式，而且未来会上架更多的功能，比如转出来多码率，加上台标和水印，媒资管理等很多很好用的功能。云点播是一个点播系统，不仅仅是个存储的磁盘，可以认为是个B站或YouTube，如果你要做更丰富的业务那肯定要选云点播。

从费用上看，云点播会比云录制多一些，要看具体用到哪些功能。目前云SRS使用的是HLS转MP4，这个费用非常低，因为没有转码。未来如果要上高级功能，费用会高一些。总体来看，云点播的费用是非常低的，和云录制差不多，如果没有额外的计算费用就和云录制一样的了。

简单来说，推荐用云点播，好用不贵。

<a name="dvr-cloud-storage"></a><br/><br/><br/>

## 如何录制到云存储

云SRS支持录制到COS，腾讯云存储，请参考[Usage: Cloud Storage](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g)。

云SRS也可以录制到其他云存储，比如阿里云OSS或AWS S3，可以按照云存储的指引，将云存储挂载到云SRS，然后使用本地录制，配置本地路径的存储路径，这样就可以将文件写入到云存储了。

> Note: 修改本地录制的路径，可以在`本地录制/录制文件夹`中，把录制的路径软链到云存储的路径就可以。

<a name="unavailable"></a><br/><br/><br/>

## 安装后无法访问

安装后提示错误，比如：

![](/img/page-2023-03-04-05.png)

或者Redis没准备好，比如：

![](/img/page-2023-03-04-06.png)

这是因为刚刚安装后，云SRS启动需要时间，等待3到5分钟后刷新页面，就可以了。

<a name="restream-vs-obs"></a><br/><br/><br/>

## SRS转推和OBS转推的区别

SRS的多平台转推，可以将流转推给多个平台，它的工作图如下：

```
OBS/FFmpeg --RTMP--> 云SRS --RTMP--> 视频号、B站、快手等直播平台
```

其实，OBS也有一个转推插件，它的工作图如下：

```
OBS --RTMP--> 视频号、B站、快手等直播平台
```

看起来OBS的链路更短更简单，还不用经过云SRS不用付钱，为何云SRS还要做转推，OBS这个方案有什么缺点？

OBS转推的优点是不用钱，直接就转推了。缺点是它的上行/上传带宽是翻倍的，比如2Mbps的流，如果转推3个平台就是6Mbps，如果视频号还需要推多个那会更多，比如推10个平台就是20Mbps。

带宽高了，会导致所有推流都卡顿或者中断，这会让所有观众都看不了直播，直接造成直播事故。只要翻车一次，直播间的人基本上就跑得差不多了，是非常严重的事故。

基本上80%的直播翻车，都是主播推流端的问题。因为云平台和观众观看的问题都解决得差不多了，唯独主播推流这个地方云平台是无解的。

如果家里是拉的光纤专线，比如买100Mbps的专线，那肯定没问题。问题是100Mbps的专线是非常贵的，就算暂时免费，一样有收费的那一天，因为专线就是专享的资源，不可能永远免费的。就好像人家免费给你金条一样，能免费多久呢。

云SRS其实也是会有带宽翻倍，但是它是下行带宽翻倍，因为它做了一次转换，本质上是其他平台从云SRS这里下载流。下行/下载带宽一般都是更有保障的。而且云SRS和平台之间，都是服务器之间的BGP带宽，比家里到平台质量更有保障。

<a name="restream-custom"></a><br/><br/><br/>

## SRS如何转推自定义平台

SRS的多平台转推，是可以推到自定义的直播平台，比如推到视频号的推流地址和流密钥，也可以填任何其他直播平台的。

> Note: 云SRS之所以分成视频号和B站等平台，是为了提供更好的引导，这些平台的RTMP地址格式都是类似的，所以可以随意填，云SRS不会验证具体的平台。

如果直播平台的RTMP地址是一个地址，比如：

```
rtmp://ip/app/stream
```

那么，可以把它拆分成：

* 推流地址：`rtmp://ip/app`
* 流密钥：`stream`

> Note: 最后一个斜杠后面的就是流密钥。

<a name="use-custom-ffmpeg"></a><br/><br/><br/>

## 如何更换FFmpeg

如果使用Docker版本，可以更换云SRS中的FFmepg为自定义版本，启动时指定命令：

```bash
-v /path/to/ffmpeg:/usr/local/bin/ffmpeg
```

可以使用命令`which ffmpeg`来查找你的FFmpeg的路径。

> Note: 非Docker版本不支持。

<a name='install-speedup'></a><br/><br/><br/>

## 宝塔安装SRS非常慢

有朋友反馈：海外用宝塔安装非常慢，访问阿里云镜像太慢。

这是因为海外不能使用宝塔，海外用宝塔安装其他的工具也非常慢，这是因为跨国回源到国内下载数据当然非常慢了。

宝塔海外版本叫[aaPanel](https://aapanel.com)，请使用aaPanel，安装软件很快，云SRS也会切换到海外的镜像下载。

宝塔和aaPanel只是安装方法不同，具体用法是一样的，请参考[宝塔](https://ossrs.net/lts/zh-cn/blog/BT-aaPanel)或[aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)。

<a name="bt-install-manually"></a><br/><br/><br/>

## 宝塔如何安装最新的云SRS

有时候宝塔商店的版本比较老，可以手动安装宝塔插件，安装最新的插件。

云SRS最新的版本，可以看[Releases](https://github.com/ossrs/srs-cloud/releases)，每个版本的附件中`bt-srs_cloud.zip`就是可以下载的插件。

下载插件后，可以在宝塔`软件商店 > 第三方应用 > 导入插件`，上传下载的`bt-srs_cloud.zip`即可安装。

<a name="bt-centos7-error"></a><br/><br/><br/>

## 宝塔CentOS7安装失败

CentOS7宝塔安装失败，常见错误如下：

* GLIBC版本问题：```version `GLIBC_2.27' not found```
* 找不到目录：```ln: failed to access '/www/server/nvm/versions/node/v18.12.1/bin/node'```

这都是因为CentOS7上的nodejs有问题，一般是安装pm2后安装的是nodejs18，而它依赖高版本的libc，所以无法使用。

解决办法：

* 升级到云SRS v4.6.3+，可以手动安装最新版本，参考[宝塔如何安装最新的云SRS](#bt-install-manually)
* 打开pm2切换到nodejs 16，也可以绕过去这个问题。

> Note: 云SRS v4.6.3+，不再强制依赖pm2安装nodejs，只要系统存在nodejs就可以了。你可以选择nodejs管理器安装，或者pm2安装，或者自己安装也可以。

最后，如果安装成功后还不可用，可以重启下系统试试。

<a name="how-to-buy-ai"></a><br/><br/><br/>

## 怎么购买AI换脸服务

最新消息：AI换脸的B站视频已经下架了，B站审核没过。

挺多朋友问：AI换脸怎么实现？怎么买模型？找谁买？

首先，云SRS只在其中实现了推流和拉流，并没有AI的能力，也不卖AI换脸的服务。

在AI换脸那个视频中有介绍，这个AI换脸是其他朋友用云SRS和AI工具以及AI模型搭的，有相关的开源的方案，可以自己搭建。

如果自己不会搭，推荐用云服务。由于AI换脸有很高的政策风险，如果需要购买这个服务，建议走正规渠道购买，也就是用腾讯云的相关的服务，可以用[视立方AI美颜](https://cloud.tencent.com/product/rtcube)或者[腾讯特效智能美颜](https://cloud.tencent.com/product/x-magic)。

如果不想用腾讯云，找找其他视频云厂商的服务也可以。

<a name="rules"></a><br/><br/><br/>

## 提的功能如何实现，如何录视频

欢迎大家给云SRS提问题和新功能，但请说明真实业务。

大部分朋友不知道什么是真实业务，一般都是描述的业务的实现方案。而这个方案不一定是最合适的，甚至已经有了其他的技术方案，可以实现这个业务目标。因此，一定要请描述业务而不要描述功能或方案的技术实现。

请详细描述业务场景，可以尝试回答以下的问题：

1. 你是做什么业务的？作为一个普通人，我怎么用到你的产品和服务？麻烦举个真实的人来讲。
2. 你在用SRS解决你业务中的什么问题？麻烦举个真实的例子讲。
3. 你给SRS提的需求或功能，是怎么应用在业务中的？麻烦举个例子讲。

> Note: 如果群里不方便说，可以单独微信发给我。

SRS云服务器这个开源社区就是这样工作的，你提交应用场景，我们就会优先实现，用真实的钉子选锤子，欢迎大家一起参与~

<a name="can-not-replay"></a><br/><br/><br/>

## 无法实现预期效果

如果达不到预期效果，比如延迟高了，或者推拉流失败了，下面的办法可以解决所有问题：

```
一个字不要改的，跟着视频教程和应用场景的引导，鼠标操作复制粘贴，一定能疗效良好！
一个字不要改的，跟着视频教程和应用场景的引导，鼠标操作复制粘贴，一定能疗效良好！
一个字不要改的，跟着视频教程和应用场景的引导，鼠标操作复制粘贴，一定能疗效良好！
```

因为大家出现问题的原因只有一个：就是觉得音视频简单，乱改！

* 觉得SRS云服务器简单，自己买其他云服务器后部署，或者买轻量后自己安装程序：扑街！
* 换播放器，换推流器，不按视频和场景指引的，换各种客户端：扑街！
* 不看[视频教程](https://space.bilibili.com/430256302/channel/collectiondetail?sid=180263)，不看`应用场景`的文字指引，直接上手乱试：扑街！

天堂有路你不走，地狱无门你闯的头破血流的要进地域，只能说是自己造孽自己受。

如果按照[视频教程](https://space.bilibili.com/430256302/channel/collectiondetail?sid=180263)和`应用场景`的指引，还是有问题，把你的过程录下来，发群里，立刻帮你解决！

最后再苦口婆心的劝大家从良：音视频水很深，一看就会一试就废，这是为什么我要做SRS云服务器，你先用开箱即用的跑出效果来，然后想一点点折腾也可以，不要路都不会走就跑。

<a name="diff-srs"></a><br/><br/><br/>

## 云SRS和SRS的差别

[SRS](https://github.com/ossrs/srs)是一个开源服务器，是一个流媒体服务器，一般会和FFmpeg以及WebRTC等客户端配合起来实现音视频的能力，请看[这个图](https://github.com/ossrs/srs#srssimple-realtime-server)你就明白了什么是SRS。

云SRS是一个音视频的方案，它基于SRS、Nodejs、REACT等实现音视频的常用场景，请看[这个图](https://github.com/ossrs/srs-cloud#architecture)你就明白了什么是云SRS。

SRS安装后，打开是一个流媒体服务器的演示页面，有播放器和控制台的链接；云SRS安装后，打开是需要登录的管理后台，提供了很多不同场景的引导。

如果你是需要详细研究流媒体服务器，请根据SRS的文档操作，也请加SRS的社区，而不要在云SRS的群里问。SRS是一个开源的音视频服务器，面向的是开发能力非常强的C/C++程序员，你可以随意修改，定制能力很强。

如果你是想要一个直接就能使用的音视频平台，开箱即用，可以线上使用的，就请用云SRS，请不要在SRS社区问。云SRS的含义，就是云上的SRS，它是个基于云的服务，面向的是用户，不需要了解音视频细节，跟着教程操作就可以。

两个都是开源的项目，欢迎贡献。

<a name="diff-baota"></a><br/><br/><br/>

## 和宝塔的差别

宝塔是一个虚拟机的管理工具，SRS云服务器是一个音视频的开箱即用的方案，宝塔也可以安装云SRS，请参考[支持哪些平台](#support-platform)。

> Note: 海外的宝塔是叫aaPanel，也支持云SRS；如果你的机器在海外，请不要用宝塔，而要用aaPanel；大家使用的安装源不同，海外用宝塔可能安装非常慢甚至会失败。

<a name="diff-vcloud"></a><br/><br/><br/>

## 和视频云的差别

视频云是大规模服务的场景，比如云直播、比如TRTC、比如IM、比如云点播、比如CDN、比如腾讯会议或ZOOM，这些都是超大规模的系统。

SRS云服务器是把这些系统全部放在一台`Lighthouse/CVM/Droplet/宝塔`云服务器中，所以它主要是全面，但是并发和规模非常小，只适合小微场景，快速搭建应用实现业务，了解和学习新场景，可以跑起来后慢慢看怎么实现。

当然，未来SRS云服务器也会支持迁移到成熟的视频云服务，让大家可以快速满足业务要求，同时业务长大后也能得到规模化的支撑。

<a name="reinstall"></a><br/><br/><br/>

## 如何重装系统

如果已经有`Lighthouse/CVM/Droplet`，或者镜像出现问题，可以重装镜像解决。不要登录上去自己折腾，只会折腾出更多问题，直接选择重装系统比较好。

以Lighthouse为例，其他平台类似这样操作。首先，在应用管理中，选择重装系统：

![](/img/page-2023-03-04-07.png)

然后，在镜像类型中选择`应用镜像`，再选择`SRS`对应的镜像就可以，如下图：

![](/img/page-2023-03-04-08.png)

最后点确认和确定就可以，非常快就重装了。

<a name="auth-bt"></a><br/><br/><br/>

## 如何授权排查问题

出现问题时如何授权机器权限？推荐使用宝塔：

1. 面板设置。
2. 安全设置。
3. 临时访问授权管理。
4. 创建临时授权。

把临时授权的地址，发给问题排查同学就可以。

<a name="cost-opt"></a><br/><br/><br/>

## 成本优化

SRS云服务器对接了云服务，比如云存储COS、云点播VoD等等，大家习惯免费的方案后，会自然想让SRS对接其他免费的方案，比如某度某盘，类似这样节约成本薅羊毛的想法，统一答复如下：

1. 不要告诉我能省钱，或者仅仅因为人家号称免费就应该去对接，要看收益。
6. SRS云服务器是生产工具，是能带来额外收入，比如总成本1万，能增加10万收入，那么带来了9万的收益，为什么要优化成本？请不要追求100%的利润，自己吃肉，也给点别人生存的粮食。
7. 世上没有免费的服务，贪图小便宜用免费的，出问题没人管，广告满天飞，隐私泄露，后期各种收割，难道还不长点记性么。不要追求100%的利润，大家都是成年人，懂的吧？
8. 如果用SRS云服务器，不能给你带来任何收益，可以选择退货的，别折腾了。

唯一一种情况，我会考虑对接：

1. 如果其他服务或方案，能带来2倍以上的收益，比如现在成本1万，目前成本高没有增加收益，并且对接某盘只需要0.5万，能增加一倍的收益。

如果能给出收益的数据，我会考虑。

<a name="openapi"></a><br/><br/><br/>

## OpenAPI

关于开放API，使用AP对接云SRS，可以在`系统配置 > OpenAPI`中，根据引导操作。

所有云SRS的操作，都是调用API完成，这些API可以通过Chrome的Network面板看到具体请求。

凡是能在云SRS页面完成的操作，都可以通过OpenAPI完成。

<a name='features'></a><br/><br/><br/>

## Features

云SRS（即SRS云服务器）是nodejs实现的开源方案，代码在[srs-cloud](https://github.com/ossrs/srs-cloud)，欢迎一起来搞。

SRS云服务器面向鼠标编程，让每个人都能做音视频业务。不懂音视频的可以，懂音视频的也可以，种地的可以，撸网线的可以，剪电影的可以，背摄像机的也可以，跳舞的可以，唱歌的可以，卖二手货的也可以，开源项目交流也可以，多平台直播也可以，自建源站可以，会用电脑有微信就可以，守法公民都可以。

云SRS的使用说明，请参考视频[SRS云服务器：起步、购买和入门](https://www.bilibili.com/video/BV1844y1L7dL/)。

目前云SRS支持的场景和功能包括：

* [云SRS：起步、购买和入门](https://mp.weixin.qq.com/s/fWmdkw-2AoFD_pEmE_EIkA)：如何购买和设置环境，必看。
* `已支持，打磨中` 对接[宝塔](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ)或[aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)：可以用[宝塔](https://www.bt.cn/)安装SRS，支持所有CentOS或Ubuntu的机器，可命令行安装宝塔后装SRS。
* `已支持，打磨中` [私人直播间](https://mp.weixin.qq.com/s/AKqVWIdk3SBD-6uiTMliyA)：OBS推流到SRS，可以和好朋友看电影，私密直播间，专享BGP带宽，想看啥就看啥。
* `已支持，打磨中` [超高清实时直播](https://mp.weixin.qq.com/s/HQb3gLRyJHHu56pnyHerxA)：用SRT低延迟推流，也能做会议，比WebRTC清晰太多了，也适合其他低延迟SRT的场景。
* `已支持，打磨中` [录制本地](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g)：录制到云SRS服务器本地文件，提供HLS下载。[#42](https://github.com/ossrs/srs-cloud/issues/42)
* `已支持，打磨中` [录制到云存储](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g)：避免本地磁盘限制，也方便后续直播流的处理，支持录制视频流到云存储，详细参考 [#1193](https://github.com/ossrs/srs/issues/1193)。
* `已支持，打磨中` [录制到云点播](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g)：比云录制更高级的能力，云存储是无限磁盘，云点播则是短视频系统，更方便，姿势更骚。
* `已支持，打磨中` [多平台转播](https://mp.weixin.qq.com/s/FtaeQIJpb7vpmX2eFguLiQ)：推流到云SRS，转推到视频号、快手、B站、抖音等直播平台，详细参考 [#2676](https://github.com/ossrs/srs/issues/2676)。
* `已支持，打磨中` 对接[WordPress](https://mp.weixin.qq.com/s/kOWabmKbYvrmEXG2fPOZxQ)：支持[WordPress插件](https://wordpress.org/plugins/srs-player)和[Typecho插件](https://github.com/ossrs/Typecho-Plugin-SrsPlayer)，在Post中插入直播流地址。
* `已支持，打磨中` [DigitalOcean镜像](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ)：海外支持DigitalOcean Droplet镜像，中英文多语言版本。
* `已支持，打磨中` [虚拟直播](https://mp.weixin.qq.com/s/I0Kmxtc24txpngO-PiR_tQ)：服务端OBS，将点播文件、图片或流推直播，有简单布局能力。
* `开发中` [一键自动HTTPS](https://mp.weixin.qq.com/s/O70Fz-mxNedZpxgGXQ8DsA)：上传HTTPS证书，或者一键自动申请Let's Encrypt证书，属于WebRTC场景的基本能力。
* `规划中` 云摄像头：支持摄像头GB接入，支持云台，云录制。
* `规划中` 电商直播间：直播间，文字聊天能力，有商品列表和购买等，详细参考 [#2858](https://github.com/ossrs/srs/issues/2858)。
* `规划中` 互动直播：直播间，支持文件聊天，送礼物和点赞等。
* `规划中` 云直播：对接云直播或CDN分发，支持百万人观看，对接CDN分发流。
* `规划中` 一对一聊天：全平台的一对一聊天，详细参考 [#2857](https://github.com/ossrs/srs/issues/2857)。
* `规划中` 视频会议：多人视频会议，详细参考 [#2924](https://github.com/ossrs/srs/issues/2924)。
* `规划中` 直播转码：用FFmpeg将直播流转码成多个直播流，实现不同设备观看不同码率，详细参考 [#2869](https://github.com/ossrs/srs/issues/2869)。
* `规划中` 云导播：云OBS，给直播流加水印，加LOGO，加背景音乐，多路切换。
* `规划中` 开发环境：包含音视频相关的工具的源码，比如OBS和WebRTC，开发环境，详细参考 [#2891](https://github.com/ossrs/srs/issues/2891)。
* `规划中` AI：人脸检测，物体识别，自动字幕等。
* `规划中` 对接[Moodle](https://stats.moodle.org/)：支持Moodle插件，在线教育开源网站。
* `规划中` [图形化仪表盘](https://mp.weixin.qq.com/s/ub9ZGmntOy_-S11oxFkxvg)：以图表形式展示后台数据，比如CPU等等，详细参考 [Prometheus](https://github.com/ossrs/srs/issues/2899#prometheus)。

欢迎加群探讨云SRS的使用，这些SRS的周边服务都是开源的，可以自己定制后部署。

<a name='changelog'></a><br/><br/><br/>

## Changelog

以下为SRS云服务器的更新记录。

* 2023.07.14, v1.0.299, 微改进
  * 简化启动脚本，解决bug，目录调整为`/data`一级目录。v1.0.296
  * 改进消息提示，脚本注释，日志输出。v1.0.297
  * 避免每次启动修改全局目录，在容器和平台脚本中初始化。v1.0.298
  * 改进发布脚本，检查版本匹配，手动更新版本。v1.0.299
  * 删除升级功能，保持docker等平台的一致性。v1.0.300
* 2023.04.05, v1.0.295, 结构改进
  * 去掉HTTPS证书申请、管理员授权、NGINX反向代理等功能。v1.0.283
  * 将Release使用Go实现，减少内存需求和镜像大小。v1.0.284
  * 去掉dashboard和Prometheus，方便支持单个Docker镜像。v1.0.283
  * 将mgmt和platform使用Go实现，减少内存需求和镜像大小。v1.0.283
  * 使用Ubuntu focal(20)作为基础镜像，减少镜像大小。v1.0.283
  * 支持快速升级，安装在40秒左右，升级在10秒左右完成。v1.0.283
  * 解决没有流时转发的问题。v1.0.284
  * 解决上传超大文件卡死问题。v1.0.286
  * 去掉AI换脸的视频，B站审核没过。v1.0.289 (stable)
  * 去掉Redis容器，直接在platform中启动redis。v1.0.290
  * 去掉SRS容器，直接在platform中启动SRS。v1.0.291
  * 支持单容器启动，包括mgmt一个容器中。v1.0.292
  * 支持挂载到`/data`目录持久化。v1.0.295
* 2023.02.01, v1.0.281,  体验改进, Stable version.
  * 允许用户关闭自动更新，使用手动更新。
  * 适配宝塔新版本，解决nodejs检测问题。
  * 宝塔检测插件状态，没安装完之前不能操作。
  * 改进转发的状态显示，添加`等待中`状态。 v1.0.260
  * 改进镜像更新，不强依赖certbot。#47
  * 合并hooks/tencent/ffmpeg镜像到platform。v1.0.269
  * 转推支持自定义平台。v1.0.270
  * 支持虚拟直播，文件转直播。v1.0.272
  * 上传文件限制100GB。v1.0.274
  * 修复虚拟直播的bug。v1.0.276
  * Release服务，用Go替换Nodejs，减少镜像大小。v1.0.280
  * 不用buildx打单架构docker镜像，CentOS会失败。v1.0.281
* 2022.11.20, v1.0.256, 大版本更新，体验改进，Release 4.6
  * 代理根站点的资源，比如favicon.ico
  * 支持[SrsPlayer](https://wordpress.org/plugins/srs-player)的WebRTC推流简码。
  * 支持[本地录制](https://github.com/ossrs/srs-cloud/issues/42)，录制到云SRS本地磁盘。
  * 支持删除本地录制的文件和任务。
  * 支持本地录制为MP4文件和下载。
  * 支持本地录制目录为软链接，存储录制内容到其他磁盘。
  * 改进录制导航栏，合并为录制。
  * 解决主页和代理根目录的冲突问题。
  * 解决升级时未更新NGINX配置的问题。
  * 解决设置record软链接的Bug。
  * 镜像全部更换为标准镜像`ossrs/srs`。
  * 支持设置网站标题和页脚（备案要求）。
  * 提示管理员密码路径，忘记密码时可以找回密码。
  * 出错时允许恢复页面，不必刷新页面。
* 2022.06.06, v1.0.240, 大版本更新, 宝塔, Release 4.5
  * 减少磁盘占用大小，清理docker镜像
  * 改进依赖，不再强依赖Redis和Nginx
  * 支持在[流名称中传secret](https://github.com/ossrs/srs-cloud/issues/4#no-publish-auth)，避免特殊字符
  * 支持[宝塔](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ)或[aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)插件，支持CentOS或Ubuntu命令行安装
  * 迁移ossrs.net到轻量服务器，不再依赖K8s。
  * 登录密码默认改为显示密码。
  * 停止推流一定时间，清理HLS缓存文件。
  * 创建2GB的交换区，若内存小于2GB。
  * 支持收集SRS的coredump。
  * 直播场景显示SRT推流地址和命令。
  * 支持设置NGINX的根代理路径。
* 2022.04.18, v1.0.222, 小版本更新, 容器化Redis
  * 改进说明，支持禁用推流鉴权。
  * 持英文的引导，[medium](https://blog.ossrs.io)的文章。
  * 改进简易播放器，支持静音自动播放。
  * NGINX分发HLS时，添加CORS支持。
  * 新增英文引导，[创建SRS](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-1-click-e9fe6f314ac6)和[设置HTTPS](https://blog.ossrs.io/how-to-secure-srs-with-lets-encrypt-by-1-click-cb618777639f)，[WordPress](https://blog.ossrs.io/publish-your-srs-livestream-through-wordpress-ec18dfae7d6f)。
  * 增强密钥长度，加强安全性，避免暴力破解。
  * 支持WordPress的Shortcode引导。
  * 支持设置首页的跳转路径，支持和其他网站混跑。
  * 支持设置反向代理，支持将其他服务挂在NGINX下。
  * 支持HTTPS申请多个域名，解决`www`前缀域名问题。
  * 更改`备案`为`网站`，可设置首页跳转和页脚备案号。
  * 改进NGINX配置文件结构，配置集中在`containers`目录。
  * 支持简单负载均衡的设置，随机选个后端NGINX做HLS分发。
  * 容器工作在独立的`srs-cloud`网络中。
  * 新增`系统 > 工具`选项。
  * 使用Redis容器，不依赖主机的Redis服务。
* 2022.04.06, v1.0.200, 大版本更新, 多语言, Release 4.4
  * 支持中英文双语。
  * 支持DigitalOcean镜像，参考[SRS Droplet](https://marketplace.digitalocean.com/apps/srs)。
  * 支持OpenAPI获取推流密钥，参考[#19](https://github.com/ossrs/srs-cloud/pull/19)。
  * 改进更新容器镜像的脚本。
  * 支持使用NGINX分发HLS，参考[#2989](https://github.com/ossrs/srs/issues/2989#nginx-direclty-serve-hls)。
  * 改进VoD存储和服务检测。
  * 改进安装脚本。
* 2022.03.18, v1.0.191, 小版本更新, 体验改进
  * 场景默认显示教程。
  * 支持SRT地址分离，播放不带secret。
  * 分离Platform模块，简化mgmt逻辑。
  * 改进UTest升级测试脚本。
  * 支持更换流名称，随机生成流名称。
  * 支持拷贝流名称、配置、地址等。
  * 分离升级和UI，简化mgmt逻辑。
  * 分离容器管理和升级。
  * 快速高效升级，30秒之内升级完成。
  * 支持CVM镜像，参考[SRS CVM](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)。
* 2022.03.16, v1.0.162, 大版本更新，错误处理，Release 4.3
  * 支持React Error Boundary，友好的错误显示。
  * 支持RTMP推流的二维码，芯象的引导。
  * 支持简单播放器，播放HTTP-FLV和HLS。
  * 改进回调，使用React.useCallback创建。
  * 改进页面缓存时间，提高加载速度。
  * 增加REACT UI组件和Nodejs项目的测试。
  * 增加安装依赖包的脚本。
  * 改进简易播放器，默认不静音，需要用户点击才能播放。
  * 新增西瓜播放器[xgplayer](https://github.com/bytedance/xgplayer)，播放FLV和HLS
* 2022.03.09, v1.0.144, 小版本更新，多平台转推
  * 支持多平台转推，视频号、B站、快手。
  * 修改转推配置时，重启转推任务。
  * 支持设置升级窗口，默认23点到5点升级。
  * 支持jest单元测试，覆盖mgmt。
  * 支持切换SRS，稳定版和开发版。
  * 优化禁用容器的状态显示。
* 2022.03.04, v1.0.132, 小版本更新，云点播
  *  支持云点播，HLS和MP4下载。
  *  云点播支持直播中回看，更新SessionKey。
  *  升级时禁止设置密码，避免环境变量冲突。
  *  初始化系统时，重启所有依赖.env的容器。
  *  更新云录制和云点播的区别。
  *  SRT支持vMix引导教程。
* 2022.02.25, v1.0.120, 小版本更新，云录制
  *  改进升级脚本，重启必要的容器。
  *  修改Redis侦听端口，增强安全性。
  *  解决云录制，异步超长时间(8h+)的冲突问题。
  *  改进密钥创建链接，使用云API密钥。
  *  改进场景和设置TAB，按需加载，URL地址标识。
* 2022.02.23, v1.0.113, 小版本更新，云录制
  * 支持重新设置推流密钥。[#2](https://github.com/ossrs/srs-terraform/pull/2)
  * SRT推流断开，当转RTMP失败时。
  * 禁用容器时，不再启动容器。
  * SRT支持扫码二维码推流和播放。[#6](https://github.com/ossrs/srs-terraform/pull/6)
  * 支持[云录制](https://mp.weixin.qq.com/s/UXR5EBKZ-LnthwKN_rlIjg)，录制到腾讯云COS。
* 2022.02.14, v1.0.98, 大版本更新，升级，Release 4.2
  * 改进react静态资源缓存，提升后续加载速度。
  * 新增Contact专享群二维码，扫码加群。
  * 支持设置Redis的值，关闭自动更新。
  * 自动检测海外区域，使用海外源更新和升级。
  * 改进升级提示，倒计时和状态检测。
  * 在页面显示大家制作的视频教程，按播放数排序。
  * 支持授权平台管理员访问Lighthouse实例。
  * 小内存系统，自动创建swap，避免升级时OOM。
* 2022.02.05, v1.0.74, 小版本更新，仪表盘
  * 支持Prometheus监控，WebUI挂载在`/prometheus`，暂无鉴权。
  * 支持Prometheus NodeExporter，节点监控，Lighthouse的CPU、网络、磁盘等。
  * 新增仪表盘，增加了CPU的图，可跳转到[Prometheus](https://github.com/ossrs/srs/issues/2899#prometheus)。
  * 改进certbot，使用docker启动，非安装包。
  * 改进升级流程，防止重复升级。
  * 支持1GB内存的机器升级，禁用node的GENERATE_SOURCEMAP防止OOM。
* 2022.02.01, v1.0.64, 小版本更新，HTTPS
  * 支持Windows版本的ffplay播放SRT地址
  * 支持容器启动hooks，流鉴权和认证
  * 更改Redis侦听在lo和eth0，否则容器无法访问
  * 支持设置HTTPS证书，Nginx格式，参考 [这里](https://github.com/ossrs/srs/issues/2864#ssl-file)
  * 支持Let's Encrypt自动申请HTTPS证书，参考 [这里](https://github.com/ossrs/srs/issues/2864#lets-encrypt)
* 2022.01.31, v1.0.58, 小版本更新，SRT
  * 支持超清实时直播场景，SRT推拉流，200~500ms延迟，参考 [这里](https://github.com/ossrs/srs/issues/1147#lagging)
  * 芯象/OBS+SRS+ffplay推拉SRT流地址，支持鉴权。
  * 支持手动升级到最新版本，支持强制升级。
  * 改进升级脚本，更新脚本后执行
  * 支持重启SRS服务器容器
* 2022.01.27, v1.0.42, 大版本更新, 流鉴权，Release 4.1
  * 支持推流鉴权和管理后台
  * 支持更新后台，手动更新
  * 直播间场景，推流和播放引导
  * SRS源码下载，带GIT
  * 支持Lighthouse镜像，参考[SRS Lighthouse](https://mp.weixin.qq.com/s/fWmdkw-2AoFD_pEmE_EIkA)。
* 2022.01.21, Initialized.

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/pages/faq-srs-cloud-zh)
