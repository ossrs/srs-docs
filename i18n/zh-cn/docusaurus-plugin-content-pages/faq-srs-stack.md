# FAQ

> Note: 这是关于SRS Stack的FAQ，如果是SRS的FAQ请参考[SRS FAQ](/faq)

快速目录

* [Video Guides](#video-guides)：视频教程。
* [如何起步](#getting-started)：买了SRS Stack怎么用，怎么开头，怎么入门，怎么起步，怎么开始折腾。
* [如何升级](#how-to-upgrade)：如何升级到最新版本或稳定版本，为何不支持界面点击升级。
* [如何设置域名](#how-to-set-domain)：如何设置域名访问管理后台，为何打不开管理后台，为何IP访问不了管理后台。
* [支持哪些平台](#support-platform)：支持哪些平台，支持镜像，想直接用服务器或命令行安装，或宝塔安装
* [如何推多路流](#multiple-streams)：一路流不够，想推多路流，想改默认的流名称和流地址。
* [如何启动多个实例](#multiple-instances)：机器CPU很多，如何支持更多的平台转发，或者更多路流以及录制等。
* [带宽太低，提升带宽](#bandwidth)：带宽不够，想提升带宽，在CVM中用SRS Stack。
* [如何设置免费HTTPS](#https)：如何申请免费HTTPS证书，如何申请多个域名的证书。
* [如何用服务器的文件做虚拟直播](#virtual-live-server-file): 如何用其他工具上传文件，并在虚拟直播中使用
* [如何修改推流鉴权的密钥](#update-publish-secret)：更新推流鉴权的密钥，更换推流密钥
* [如何禁用推流鉴权](#no-publish-auth)：不想要推流鉴权，设备不支持特殊字符。
* [如何录制到本地磁盘](#record): 如何录制到SRS Stack的本地磁盘。
* [云录制和云点播的区别](#cos-vs-vod): 录制是用云录制还是云点播，有何区别。
* [如何修改录制的目录](update-dvr-directory): 如何修改录制的目录为其他磁盘目录。
* [停止推流时录制没有停止](#dvr-continue-when-unpublish): 为何不能在停止推流时停止录制，而是等待一定时间才停止。
* [如何快速生成录制文件](#dvr-fastly-generate): 停止推流后，如何快速生成录制文件。
* [如何录制到S3云存储](#dvr-s3-cloud-storage): 录制到AWS、Azure、DigitalOcean Space等S3兼容的存储上。
* [安装后无法访问](#unavailable): 安装后提示错误，或者Redis没准备好。
* [SRS转推和OBS转推的区别](#restream-vs-obs): SRS的多平台转推，和OBS转推插件的区别。
* [SRS如何转推自定义平台](#restream-custom): SRS的多平台转推，如何推到自定义的直播平台。
* [如何更换FFmpeg](#use-custom-ffmpeg): 如何更换SRS Stack中的FFmpeg为自定义版本。
* [宝塔安装SRS非常慢](#install-speedup): 海外用宝塔安装非常慢，访问阿里云镜像太慢。
* [宝塔如何安装最新的SRS Stack](#bt-install-manually): 手动安装宝塔插件，安装最新的插件。
* [宝塔CentOS7安装失败](#bt-centos7-error): CentOS7宝塔安装失败，找不到目录，或GLIBC版本问题。
* [怎么购买AI换脸服务](#how-to-buy-ai): AI换脸怎么实现？怎么买模型？找谁买？
* [提的需求或功能如何实现](#rules)：想要实现更多的功能，想要定制，想要优化改进。
* [无法实现预期效果](#can-not-replay)：遇到问题，达不到预期效果。
* [SRS Stack和SRS的差别](#diff-srs)：SRS Stack对比SRS的差异，为什么要有SRS Stack。
* [和宝塔的差别](#diff-baota)：和虚拟机管理软件宝塔的差异。
* [和视频云的差别](#diff-vcloud)：和一般视频云服务的差异。
* [如何重装系统](#reinstall)：针对已经有了Lighthouse或CVM的朋友。
* [如何授权排查问题](#auth-bt): 出现问题时如何授权机器权限。
* [成本优化](#cost-opt)：关于成本和成本优化。
* [OpenAPI](#openapi): 关于开放API，使用API获取相关信息。
* [功能列表](#features): 关于支持的功能清单。
* [HTTP Callback](#http-callback): 关于支持的HTTP回调。
* [版本规划](#changelog): 关于版本和里程碑。

你也可以在页面中搜索关键字。

<a name='video-guides'></a><br/><br/><br/>

## Video Guides

下面是答疑的视频资料，详细讲解了某个话题，如果你的问题类似请直接看视频哈：

* [FAQ：如何更低码率达到同等画质](https://www.bilibili.com/video/BV1qB4y197ov/) 在保证画质的前提下，如何降低码率？我们可以使用动态码率，还可以使用相对空闲的客户端CPU交换码率，还可以在业务上优化，特别多平台推流时需要避免上行码率过高。

<a name='getting-started'></a><br/><br/><br/>

## 如何起步

请先购买和设置[SRS Stack](https://www.bilibili.com/video/BV1844y1L7dL/)，包括如何设置防火墙，视频很短只有5分钟，但是不看会有非常多的问题，请不要跳过这个基本视频。

进入SRS Stack后，根据不同应用场景，会有对应的视频教程，如下图所示：

![](/img/page-2023-03-04-01.png)

每个场景也有完善的介绍，以及详细的操作步骤，如下图所示：

![](/img/page-2023-03-04-02.png)

请不要乱试，一定要跟引导做，音视频乱试一定会出问题。

<a name="how-to-upgrade"></a><br/><br/><br/>

## 如何升级

如何升级到最新版本或稳定版本，为何不支持界面点击升级？

由于SRS Stack支持多个平台，包括docker等，而docker是不能自己升级自己的，所以SRS Stack也不支持界面升级，需要手动升级。

如果您使用HELM，并安装了srs-stack `1.0.1`，那么您可以通过`helm upgrade srs srs/srs-stack --version 1.0.2`进行升级，
如果想回滚到`1.0.1`，可以使用`helm rollback srs`。

Docker启动时会指定版本，比如`registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:v1.0.293`，只需要删除容器后指定新
版本启动即可，比如`registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:v1.0.299`。

如果使用`registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:1`则是用最新的版本，则需要手动更新，
比如`docker pull registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:1`。

如果使用宝塔，则删除应用后重装新版本即可，数据是保存在`/data`目录，不会丢失。

<a name="how-to-set-domain"></a><br/><br/><br/>

## 如何设置域名

如何设置域名访问管理后台，为何打不开管理后台，为何IP访问不了管理后台。

请将下面的域名和IP都换成你自己的域名和IP，可以是内网IP或公网IP，只要你的浏览器能访问到的IP即可。

使用宝塔安装SRS Stack时，需要输入管理后台的域名，例如`bt.yourdomain.com`，会自动创建管理后台的网站。

> Note: 使用宝塔安装时，若希望使用IP访问，可以设置为`bt.yourdomain.com`，然后在宝塔中把`srs.stack.local`这个网站设置为默认网站。

若使用其他方式安装也一样可以，只需要将你的域名解析到SRS Stack的IP即可。

有几种方式设置域名解析：

1. DNS域名解析，在你的域名供应商的后台，设置一个A记录，指向SRS Stack的IP。
```text
A bt.yourdomain.com 121.13.75.20
```
2. Linux/Unix修改本地`/etc/hosts`文件，将域名解析到SRS Stack的IP。
```text
121.13.75.20 bt.yourdomain.com
```
3. Windows修改本地的`C:\Windows\System32\drivers\etc`文件，将域名解析到SRS Stack的IP。
```text
121.13.75.20 bt.yourdomain.com
```

注意：如果是需要通过Let's Encrypt申请免费的HTTPS证书，IP地址必须是公网IP，而且不能通过修改hosts的方式。

<a name="support-platform"></a><br/><br/><br/>

## 支持哪些平台

SRS Stack支持Docker镜像，安装脚本，腾讯云Lighthouse和CVM镜像，DigitalOcean镜像，其他平台可以用宝塔安装。

推荐使用Docker直接安装，还可以装多个，注意要用Ubuntu 20+系统：
* Docker镜像安装：[这里](https://ossrs.io/lts/zh-cn/docs/v6/doc/getting-started-stack#docker)

如果你习惯用宝塔，可以用宝塔安装，可以和多个网站并存，注意要用Ubuntu 20+系统：
* 宝塔：其他云平台可以用宝塔安装，要求是CentOS 7+或Ubuntu 20+的系统，使用参考[这里](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ)
* aaPanel：海外的宝塔，如果你的机器是海外的，一定不要用宝塔而要用aaPanel，使用参考[这里](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)
* Script：直接用脚本也可以，参考[Script](https://ossrs.io/lts/zh-cn/docs/v6/doc/getting-started-stack#script)

支持各种云平台，最方便的是镜像，也就是云服务器的镜像，如果想简单省事就请用镜像：
* Lighthouse：腾讯云的轻量云服务器镜像，使用参考[这里](https://mp.weixin.qq.com/s/fWmdkw-2AoFD_pEmE_EIkA)
* DigitalOcean: 海外轻量云服务器的镜像，使用参考[这里](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ)

> Note: 这些安装方式都在视频教程中有介绍，请参考[这里](https://www.bilibili.com/video/BV1844y1L7dL/)，几分钟的视频，有分章节的（要在B站App或者PC浏览器打开才有），可以直接跳到对应章节。

如果你发现你的功能没有，那可能是你选择的版本比较老，按照功能的更新速度：

```bash
Docker/Script > 宝塔/aaPanel > DigitalOcean > Lighthouse/CVM
```

如果从便捷角度考虑，比较省事的角度考虑，推荐的顺序是：

```bash
Lighthouse/CVM/DigitalOcean > 宝塔/aaPanel > Docker/Script
```

可以根据自己的情况选择平台和安装方式。

<a name='multiple-streams'></a><br/><br/><br/>

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

<a name='multiple-instances'></a><br/><br/><br/>

## 如何启动多个实例

机器CPU很多，如何支持更多的平台转发，或者更多路流以及录制等。

可以选择使用Docker方式启动SRS Stack，可以非常容易跑非常多的SRS Stack实例，这些实例都是隔离的，互不影响，可以将机器资源利用上。

比如启动两个实例，侦听在2022和2023端口，流媒体依次用不同的端口：

```bash
docker run --rm -it -p 2022:2022 -p 1935:1935 \
  -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data0:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

然后打开 [http://localhost:2022](http://localhost:2022) 即可登录。

```bash
docker run --rm -it -p 2023:2022 -p 1936:1935 \
  -p 8001:8000/udp -p 10081:10080/udp --name srs-stack1 \
  -v $HOME/data1:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

然后打开 [http://localhost:2023](http://localhost:2023) 即可登录后台。

> Note: 注意端口不要重复，挂载的数据目录也不要重复，保持两个SRS Stack的完全独立。

尽管在Web界面上，看不到不同的RTMP端口，因为在容器中看到的都是1935端口，但这不会有影响，
你还是可以往两个不同的端口推流到这两个不同的实例。当然，你可以明确指定端口：

```bash
docker run --rm -it -p 2023:2022 -p 1936:1935 \
  -p 8001:8000/udp -p 10081:10080/udp --name srs-stack1 \
  -e HTTP_PORT=2023 -e RTMP_PORT=1936 -e RTC_PORT=8001 -e SRT_PORT=10081 \
  -v $HOME/data1:/data registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

如果只是用多平台转播，或者虚拟直播，不涉及推流端口，则直接使用即可。

若需要推流到两个SRS Stack实例，则需要指定端口，比如推流到这两个SRS Stack：

* `rtmp://ip:1935/live/livestream`
* `rtmp://ip:1936/live/livestream`

其他的协议端口对应的也要改变，比如HLS：

* `http://ip:2022/live/livestream.m3u8`
* `http://ip:2023/live/livestream.m3u8`

当然也不是意味着你就可以启动上万个SRS Stack，你应该关注你的CPU和内存，以及机器的带宽是否充足。

<a name="bandwidth"></a><br/><br/><br/>

## 带宽太低，提升带宽

轻量应用服务器的带宽4~20Mbps不等，对于音视频来说还是会有些限制，如果你想更高带宽，比如到100Mbps，那么可以选择CVM主机。

> Note: SRS Stack的使用都是一致的，购买和平台配置有所不同。

CVM云服务器的优势是：

* 带宽最高100Mbps，可以用多平台转发到另外CVM服务器，十台CVM就可以实现1Gbps带宽，当然得摸摸自己腰包了哈。
* 按量计费，可以随时停机不收费，需要使用时再开机使用。对于比较低频的应用场景比较友好。

CVM云服务器的劣势是：

* 成本高，没有送的流量包。轻量服务器成本低，送的流量包基本上够一般的直播了。所以请大家自己算一算成本。
* 操作复杂，CVM的安全组比轻量的防火墙操作复杂多了，请大家自己试试，不行就换轻量吧。
* 没有后台链接，界面比较复杂，如果不行就换轻量吧。

如果知道了优势和劣势，还是要选择CVM，请参考[SRS Stack：支持CVM镜像](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ)。

<a name="https"></a><br/><br/><br/>

## 如何设置免费HTTPS

SRS Stack支持申请免费HTTPS证书，而且可以申请多个域名的证书，还可以自动续期。比如，以下HTTPS网站的证书，都是跑了SRS Stack后一键自动申请的：

* https://ossrs.io SRS的海外文档网站。
* https://www.ossrs.io SRS的海外文档网站。
* https://r.ossrs.net SRS的稳定版演示服务器。

操作非常简单，只需要三步，具体请看[这里](https://ossrs.net/lts/blog/2022/04/12/SRS-Stack-HTTPS)：

1. 购买域名并备案，一定要有自己的合法域名，否则无法申请证书的哈。
2. 将域名解析到SRS Stack的公网IP，可以通过域名访问到你的SRS Stack就可以，可以加多个域名解析，比如 `ossrs.io` `www.ossrs.io` 都是解析到同一个SRS Stack服务器的。
3. 在SRS Stack的 `系统设置 > HTTPS > 自动HTTPS证书` 填写你的域名，多个用分号分割，点申请就行了。

> Note: 申请域名就行了，不要再上传，申请了就可以了，不需要再上传一次。

> Note: 若使用宝塔安装SRS Stack，可以选择在宝塔中申请，或者在SRS Stack中申请。

若出现申请失败的错误，消息为`Could not obtain certificates: error: one or more domains had a problem`，可能原因是：

* 域名没有解析到SRS Stack的IP，必须使用DNS将域名解析到SRS Stack的IP，而不能设置hosts的方式。
* SRS Stack的IP必须是公网可以访问的IP，必须是互联网上任何人都能访问的IP，而不是内网可以访问的IP。
* 端口必须是80而不是2022，因为Let's Encrypt会反向验证你的域名，而且访问的是80端口。

若使用docker直接启动，可以添加80和443端口的映射：

```bash
docker run --rm -it --name srs-stack -v $HOME/data:/data \
  -p 2022:2022 -p 2443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  -p 80:2022 -p 443:2443 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

申请成功后，在浏览器敲https加你的域名，就可以访问你的网站了。

<a name="virtual-live-server-file"></a><br/><br/><br/>

## 如何用服务器的文件做虚拟直播

如何用其他工具上传文件，并在虚拟直播中使用。

你可以使用其他工具比如ftp或者scp上传大的文件到服务器，然后在虚拟直播中使用上传的文件。但是要求上传的文件在
`/data`目录下面。

SRS Stack是在容器中运行的，所以它这个`/data`说的是容器中的路径，所以你可以在启动SRS Stack的容器时，把你host机器的
路径映射到`/data`下面， 比如：`docker run -v /your-host-dir:/data/my-upload`，这样在容器中就可以访问`/data/my-upload`
这个目录了。

然后你再上传文件到你的host的目录比如文件`my-file.mp4`，在物理机中该文件的路径是`/your-host-dir/my-file.mp4`，
你在SRS Stack中就可以输入`/data/my-upload/my-file.mp4`访问这个文件。

你也可以在上传文件后，进入SRS Stack容器，查看文件是否存在，比如执行命令：

```bash
docker exec -it srs-stack ls -lh /data/my-upload/my-file.mp4
```

如果提示文件存在，则可以在SRS Stack的Virtual Live Events使用这个文件，否则请检查启动Docker时路径是否映射对了。

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

如何录制到SRS Stack的本地磁盘？升级到v1.0.252后，在录制中就可以看到有本地录制了。

本地录制的限制和解决方案，请参考 #42

<a name="cos-vs-vod"></a><br/><br/><br/>

## 云录制和云点播的区别

SRS Stack提供了云录制和云点播两个类似的功能，录制是用云录制还是云点播，有何区别？

云录制可以认为是把直播写到了云盘，保存的是HLS格式，是原始的视频流。如果你是要将HLS下载下来转码和剪辑，那会比较合适。云录制是存储在腾讯云COS云存储的，可以认为是个无限磁盘，避免写爆SRS Stack的磁盘。

云点播提供了HLS和MP4两种格式，而且未来会上架更多的功能，比如转出来多码率，加上台标和水印，媒资管理等很多很好用的功能。云点播是一个点播系统，不仅仅是个存储的磁盘，可以认为是个B站或YouTube，如果你要做更丰富的业务那肯定要选云点播。

从费用上看，云点播会比云录制多一些，要看具体用到哪些功能。目前SRS Stack使用的是HLS转MP4，这个费用非常低，因为没有转码。未来如果要上高级功能，费用会高一些。总体来看，云点播的费用是非常低的，和云录制差不多，如果没有额外的计算费用就和云录制一样的了。

简单来说，推荐用云点播，好用不贵。

<a name="update-dvr-directory"></a><br/><br/><br/>

## 如何修改录制的目录

打开`本地录制/录制文件夹`，可以看到录制的默认目录，若希望使用其他目录，操作方法如下。

若使用docker直接启动SRS Stack，可以将目录挂载为其他路径，比如：

```bash
docker run -v /your-host-dir:/data/record
```

若使用其他方式安装SRS Stack，则可以将默认数据目录软链接为其他目录，比如：

```bash
rm -rf /data && ln -sf /your-host-dir /data
```

> Note: 请不要直接软链接`/data/record`，因为SRS Stack是在docker中运行，看不到你软链接的目录。

特别注意：若希望使用S3等云存储，请不要用挂载方式，因为频繁的录制写入可能会造成云存储挂起而无法访问，应该使用拷贝文件的方法，
具体请参考[如何录制到S3云存储](#dvr-s3-cloud-storage)。

<a name="dvr-continue-when-unpublish"></a><br/><br/><br/>

## 停止推流时录制没有停止

为何不能在停止推流时停止录制，而是等待一定时间才停止。

有些主播推流只推一次，中间不会中断。所以在这种情况下，如果停止推流停止录制，这个是没有问题的，只会生成一个文件。

但是有些主播，他推流时中间是有中断的，比如推流推了5分钟时间，中间中断等了可能30秒。那如果在停止推流就录制一个文件出来，就会有两个文件，所以这种情况下就是有问题的。

因此在停止推流时若停止录制，中间可能会导致录制会有多个文件，满足不了真实的场景的需要。

<a name="dvr-fastly-generate"></a><br/><br/><br/>

## 如何快速生成录制文件

如前面[停止推流时录制没有停止](#dvr-continue-when-unpublish)所说，为了实现录制为一个文件，特别是中断推流后还能合并为一个文件，
因此，主播停止推流后，SRS Stack不会立刻生成录制文件，而是会等待一定时间，超时后才会生成。

那么，如何在停止推流后，如何快速生成录制文件？可以在主播停止推流后，点击界面的按钮，或者使用HTTP API，请求结束录制任务，这样就可以
尽可能快速生成录制文件。

和YouTube的直播间类似，一般是在直播间有一个`End Stream`的按钮，点击按钮后，就会停止推流，同时会请求结束录制任务。

> Note: 请求结束录制任务是异步接口，调用后不会立刻就会生成录制文件，因为处理直播的切片需要时间，需要等待一定时间。
> 录制文件准确的生成时间，请调用API查询，或者以回调事件为准。

<a name="dvr-s3-cloud-storage"></a><br/><br/><br/>

## 如何录制到S3云存储

SRS Stack支持录制到AWS、Azure、DigitalOcean Space等S3兼容的存储上。

首先使用[s3fs](https://github.com/s3fs-fuse/s3fs-fuse)将S3存储挂载到本地磁盘，比如`/media/srs-bucket`目录，
具体请参考你使用的云厂商的手册，网上的资料非常多。可以执行下面的命令，如果能获取到S3存储中的文件，就准备好了：

```bash
ls -lh /media/srs-bucket/
```

然后在SRS Stack的录制中，选择`设置录制规则 > 录制后处理 > 拷贝录制文件`，输入文件夹`/media/srs-bucket`，这样在录制生成文件后，
就会将录制文件拷贝到S3存储了，并在录制回调中给出S3存储的文件路径。

可以使用S3的HTTP观看，或者CDN分发功能，直接观看录制的文件，或者进行加工和处理。

若需要禁用这个功能，则可以把目标文件夹设置为空。

<a name="unavailable"></a><br/><br/><br/>

## 安装后无法访问

新版本宝塔插件，避免和现有网站设置冲突，不再自动设置为默认网站，需要指定域名或者手动设置默认网站，请参考[如何设置域名](#how-to-set-domain)。

安装后提示错误，比如：

![](/img/page-2023-03-04-05.png)

或者Redis没准备好，比如：

![](/img/page-2023-03-04-06.png)

这是因为刚刚安装后，SRS Stack启动需要时间，等待3到5分钟后刷新页面，就可以了。

<a name="restream-vs-obs"></a><br/><br/><br/>

## SRS转推和OBS转推的区别

SRS的多平台转推，可以将流转推给多个平台，它的工作图如下：

```
OBS/FFmpeg --RTMP--> SRS Stack --RTMP--> 视频号、B站、快手等直播平台
```

其实，OBS也有一个转推插件，它的工作图如下：

```
OBS --RTMP--> 视频号、B站、快手等直播平台
```

看起来OBS的链路更短更简单，还不用经过SRS Stack不用付钱，为何SRS Stack还要做转推，OBS这个方案有什么缺点？

OBS转推的优点是不用钱，直接就转推了。缺点是它的上行/上传带宽是翻倍的，比如2Mbps的流，如果转推3个平台就是6Mbps，如果视频号还需要推多个那会更多，比如推10个平台就是20Mbps。

带宽高了，会导致所有推流都卡顿或者中断，这会让所有观众都看不了直播，直接造成直播事故。只要翻车一次，直播间的人基本上就跑得差不多了，是非常严重的事故。

基本上80%的直播翻车，都是主播推流端的问题。因为云平台和观众观看的问题都解决得差不多了，唯独主播推流这个地方云平台是无解的。

如果家里是拉的光纤专线，比如买100Mbps的专线，那肯定没问题。问题是100Mbps的专线是非常贵的，就算暂时免费，一样有收费的那一天，因为专线就是专享的资源，不可能永远免费的。就好像人家免费给你金条一样，能免费多久呢。

SRS Stack其实也是会有带宽翻倍，但是它是下行带宽翻倍，因为它做了一次转换，本质上是其他平台从SRS Stack这里下载流。下行/下载带宽一般都是更有保障的。而且SRS Stack和平台之间，都是服务器之间的BGP带宽，比家里到平台质量更有保障。

<a name="restream-custom"></a><br/><br/><br/>

## SRS如何转推自定义平台

SRS的多平台转推，是可以推到自定义的直播平台，比如推到视频号的推流地址和流密钥，也可以填任何其他直播平台的。

> Note: SRS Stack之所以分成视频号和B站等平台，是为了提供更好的引导，这些平台的RTMP地址格式都是类似的，所以可以随意填，SRS Stack不会验证具体的平台。

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

如果使用Docker版本，可以更换SRS Stack中的FFmpeg为自定义版本，启动时指定命令：

```bash
-v /path/to/ffmpeg:/usr/local/bin/ffmpeg
```

可以使用命令`which ffmpeg`来查找你的FFmpeg的路径。

> Note: 非Docker版本不支持。

<a name='install-speedup'></a><br/><br/><br/>

## 宝塔安装SRS非常慢

有朋友反馈：海外用宝塔安装非常慢，访问阿里云镜像太慢。

这是因为海外不能使用宝塔，海外用宝塔安装其他的工具也非常慢，这是因为跨国回源到国内下载数据当然非常慢了。

宝塔海外版本叫[aaPanel](https://aapanel.com)，请使用aaPanel，安装软件很快，SRS Stack也会切换到海外的镜像下载。

宝塔和aaPanel只是安装方法不同，具体用法是一样的，请参考[宝塔](https://ossrs.net/lts/zh-cn/blog/BT-aaPanel)或[aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)。

<a name="bt-install-manually"></a><br/><br/><br/>

## 宝塔如何安装最新的SRS Stack

有时候宝塔商店的版本比较老，可以手动安装宝塔插件，安装最新的插件。

SRS Stack最新的版本，可以看[Releases](https://github.com/ossrs/srs-stack/releases)，每个版本的附件中`bt-srs_stack.zip`就是可以下载的插件。

下载插件后，可以在宝塔`软件商店 > 第三方应用 > 导入插件`，上传下载的`bt-srs_stack.zip`即可安装。

<a name="bt-centos7-error"></a><br/><br/><br/>

## 宝塔CentOS7安装失败

> 注意：推荐使用Ubuntu20系统。 

CentOS7宝塔安装失败，常见错误如下：

* GLIBC版本问题：```version `GLIBC_2.27' not found```
* 找不到目录：```ln: failed to access '/www/server/nvm/versions/node/v18.12.1/bin/node'```

这都是因为CentOS7上的nodejs有问题，一般是安装pm2后安装的是nodejs18，而它依赖高版本的libc，所以无法使用。

解决办法：

* 升级到SRS Stack v4.6.3+，可以手动安装最新版本，参考[宝塔如何安装最新的SRS Stack](#bt-install-manually)
* 打开pm2切换到nodejs 16，也可以绕过去这个问题。

> Note: SRS Stack v4.6.3+，不再强制依赖pm2安装nodejs，只要系统存在nodejs就可以了。你可以选择nodejs管理器安装，或者pm2安装，或者自己安装也可以。

最后，如果安装成功后还不可用，可以重启下系统试试。

<a name="rules"></a><br/><br/><br/>

## 提的功能如何实现，如何录视频

欢迎大家给SRS Stack提问题和新功能，但请说明真实业务。

大部分朋友不知道什么是真实业务，一般都是描述的业务的实现方案。而这个方案不一定是最合适的，甚至已经有了其他的技术方案，可以实现这个业务目标。因此，一定要请描述业务而不要描述功能或方案的技术实现。

请详细描述业务场景，可以尝试回答以下的问题：

1. 你是做什么业务的？作为一个普通人，我怎么用到你的产品和服务？麻烦举个真实的人来讲。
2. 你在用SRS解决你业务中的什么问题？麻烦举个真实的例子讲。
3. 你给SRS提的需求或功能，是怎么应用在业务中的？麻烦举个例子讲。

> Note: 如果群里不方便说，可以单独微信发给我。

SRS Stack这个开源社区就是这样工作的，你提交应用场景，我们就会优先实现，用真实的钉子选锤子，欢迎大家一起参与~

<a name="can-not-replay"></a><br/><br/><br/>

## 无法实现预期效果

如果达不到预期效果，比如延迟高了，或者推拉流失败了，下面的办法可以解决所有问题：

```
一个字不要改的，跟着视频教程和应用场景的引导，鼠标操作复制粘贴，一定能疗效良好！
一个字不要改的，跟着视频教程和应用场景的引导，鼠标操作复制粘贴，一定能疗效良好！
一个字不要改的，跟着视频教程和应用场景的引导，鼠标操作复制粘贴，一定能疗效良好！
```

因为大家出现问题的原因只有一个：就是觉得音视频简单，乱改！

* 觉得SRS Stack简单，自己买其他云服务器后部署，或者买轻量后自己安装程序：扑街！
* 换播放器，换推流器，不按视频和场景指引的，换各种客户端：扑街！
* 不看[视频教程](https://space.bilibili.com/430256302/channel/collectiondetail?sid=180263)，不看`应用场景`的文字指引，直接上手乱试：扑街！

天堂有路你不走，地狱无门你闯的头破血流的要进地域，只能说是自己造孽自己受。

如果按照[视频教程](https://space.bilibili.com/430256302/channel/collectiondetail?sid=180263)和`应用场景`的指引，还是有问题，把你的过程录下来，发群里，立刻帮你解决！

最后再苦口婆心的劝大家从良：音视频水很深，一看就会一试就废，这是为什么我要做SRS Stack，你先用开箱即用的跑出效果来，然后想一点点折腾也可以，不要路都不会走就跑。

<a name="diff-srs"></a><br/><br/><br/>

## SRS Stack和SRS的差别

[SRS](https://github.com/ossrs/srs)是一个开源服务器，是一个流媒体服务器，一般会和FFmpeg以及WebRTC等客户端配合起来实现音视频的能力，请看[这个图](https://github.com/ossrs/srs#srssimple-realtime-server)你就明白了什么是SRS。

SRS Stack是一个音视频的方案，它基于SRS、Nodejs、REACT等实现音视频的常用场景，请看[这个图](https://github.com/ossrs/srs-stack#architecture)你就明白了什么是SRS Stack。

SRS安装后，打开是一个流媒体服务器的演示页面，有播放器和控制台的链接；SRS Stack安装后，打开是需要登录的管理后台，提供了很多不同场景的引导。

如果你是需要详细研究流媒体服务器，请根据SRS的文档操作，也请加SRS的社区，而不要在SRS Stack的群里问。SRS是一个开源的音视频服务器，面向的是开发能力非常强的C/C++程序员，你可以随意修改，定制能力很强。

如果你是想要一个直接就能使用的音视频平台，开箱即用，可以线上使用的，就请用SRS Stack，请不要在SRS社区问。SRS Stack的含义，就是云上的SRS，它是个基于云的服务，面向的是用户，不需要了解音视频细节，跟着教程操作就可以。

两个都是开源的项目，欢迎贡献。

<a name="diff-baota"></a><br/><br/><br/>

## 和宝塔的差别

宝塔是一个虚拟机的管理工具，SRS Stack是一个音视频的开箱即用的方案，宝塔也可以安装SRS Stack，请参考[支持哪些平台](#support-platform)。

> Note: 海外的宝塔是叫aaPanel，也支持SRS Stack；如果你的机器在海外，请不要用宝塔，而要用aaPanel；大家使用的安装源不同，海外用宝塔可能安装非常慢甚至会失败。

<a name="diff-vcloud"></a><br/><br/><br/>

## 和视频云的差别

视频云是大规模服务的场景，比如云直播、比如TRTC、比如IM、比如云点播、比如CDN、比如腾讯会议或ZOOM，这些都是超大规模的系统。

SRS Stack是把这些系统全部放在一台`Lighthouse/CVM/Droplet/宝塔`云服务器中，所以它主要是全面，但是并发和规模非常小，只适合小微场景，快速搭建应用实现业务，了解和学习新场景，可以跑起来后慢慢看怎么实现。

当然，未来SRS Stack也会支持迁移到成熟的视频云服务，让大家可以快速满足业务要求，同时业务长大后也能得到规模化的支撑。

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

<a name="openapi"></a><br/><br/><br/>

## OpenAPI

关于开放API，使用AP对接SRS Stack，可以在`系统配置 > OpenAPI`中，根据引导操作。

所有SRS Stack的操作，都是调用API完成，这些API可以通过Chrome的Network面板看到具体请求。

凡是能在SRS Stack页面完成的操作，都可以通过OpenAPI完成。

<a name='features'></a><br/><br/><br/>

## Features

SRS Stack（即SRS Stack）是nodejs实现的开源方案，代码在[srs-stack](https://github.com/ossrs/srs-stack)，欢迎一起来搞。

SRS Stack面向鼠标编程，让每个人都能做音视频业务。不懂音视频的可以，懂音视频的也可以，种地的可以，撸网线的可以，剪电影的可以，背摄像机的也可以，跳舞的可以，唱歌的可以，卖二手货的也可以，开源项目交流也可以，多平台直播也可以，自建源站可以，会用电脑有微信就可以，守法公民都可以。

SRS Stack的使用说明，请参考视频[SRS Stack：起步、购买和入门](https://www.bilibili.com/video/BV1844y1L7dL/)。

目前SRS Stack支持的场景和功能，参考[Features](https://github.com/ossrs/srs-stack#features)。

欢迎加群探讨SRS Stack的使用，这些SRS的周边服务都是开源的，可以自己定制后部署。

<a name='http-callback'></a><br/><br/><br/>

## HTTP Callback

HTTP回调是指在Docker容器中运行的SRS Stack，向target URL发起HTTP请求。例如，以下过程说明了当OBS发送RTMP流时，
SRS Stack会给你的服务器发起一个请求，你可以通过target URL来配置你的服务器地址。

```bash
                   +-----------------------+
                   +                       +
+-------+          +     +-----------+     +                 +--------------+
+  OBS  +--RTMP->--+-----+ SRS Stack +-----+----HTTP--->-----+  Your Server +
+-------+          +     +-----------+     +  (Target URL)   +--------------+
                   +                       +
                   +       Docker          +
                   +-----------------------+
```

所有请求的格式是json：

* `Content-Type: application-json`

所有响应都应该遵守：

* 成功：`Status: 200 OK` and `"code": 0`
* 其他代表失败或错误。

关于如何实现回调的处理，请参考[HTTP Callback](/docs/v6/doc/http-callback#go-example)

### HTTP Callback: Connectivity Check

有时，您可能需要验证网络是否可访问并确定要使用的适当目标URL。通过在Docker容器内使用curl命令，您可以模拟此请求并确认
target URL是否可以通过curl或SRS Stack访问。

首先，在SRS Stack的容器中安装curl：

```bash
docker exec -it srs-stack apt-get update -y
docker exec -it srs-stack apt-get install -y curl
```

然后，用curl模拟SRS Stack发起一个HTTP请求：

```bash
docker exec -it srs-stack curl http://your-target-URL
```

你可以使用任何合法的target URL来测试，包括：

* 内网IP：`http://192.168.1.10/check`
* 公网IP：`http://159.133.96.20/check`
* HTTP地址，使用域名： `http://your-domain.com/check`
* HTTPS地址，使用域名：`https://your-domain.com/check`

请记住，您应在SRS Stack Docker中测试与target URL的连通性，并避免从其他服务器运行curl命令。

### HTTP Callback: on_publish

For HTTP callback `on_publish` event:

```json
Request:
{
  "request_id": "3ab26a09-59b0-42f7-98e3-a281c7d0712b",
  "action": "on_unpublish",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream",
  "param": "?secret=8f7605d657c74d69b6b48f532c469bc9"
}

Response:
{
  "code": 0
}
```

* Allow publishing if response success.
* Reject publishing if response error.

### HTTP Callback: on_unpublish

For HTTP callback `on_unpublish` event:

```json
Request:
{
  "request_id": "9ea987fa-1563-4c28-8c6c-a0e9edd4f536",
  "action": "on_unpublish",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream"
}

Response:
{
  "code": 0
}
```

* Ignore any response error.

### HTTP Callback: on_record_begin

For HTTP callback `on_record_begin` event:

```json
Request:
{
  "request_id": "80ad1ddf-1731-450c-83ec-735ea79dd6a3",
  "action": "on_record_begin",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream",
  "uuid": "824b96f9-8d51-4046-ba1e-a9aec7d57c95"
}

Response:
{
"code": 0
}
```

* Ignore any response error.

### HTTP Callback: on_record_end

For HTTP callback `on_record_end` event:

```json
Request:
{
  "request_id": "d13a0e60-e2fe-42cd-a8d8-f04c7e71b5f5",
  "action": "on_record_end",
  "opaque": "mytoken",
  "vhost": "__defaultVhost__",
  "app": "live",
  "stream": "livestream",
  "uuid": "824b96f9-8d51-4046-ba1e-a9aec7d57c95",
  "artifact_code": 0,
  "artifact_path": "/data/record/824b96f9-8d51-4046-ba1e-a9aec7d57c95/index.mp4",
  "artifact_url": "http://localhost:2022/terraform/v1/hooks/record/hls/824b96f9-8d51-4046-ba1e-a9aec7d57c95/index.mp4"
}

Response:
{
  "code": 0
}
```

* The `uuid` is the UUID of record task.
* The `artifact_code` indicates the error code. If no error, it's 0.
* The `artifact_path` is the path of artifact mp4 in the container.
* The `artifact_url` is the URL path to access the artifact mp4.
* Ignore any response error.

<a name='changelog'></a><br/><br/><br/>

## Changelog

Migrated to [CHANGELOG.md](https://github.com/ossrs/srs-stack/blob/main/DEVELOPER.md#changelog).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/pages/faq-srs-stack-zh)
