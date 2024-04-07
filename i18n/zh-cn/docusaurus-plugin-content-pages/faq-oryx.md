# FAQ

> Note: 这是关于SRS Stack的FAQ，如果是SRS的FAQ请参考[SRS FAQ](./faq)

快速目录

* [Getting Started](#getting-started)：如何起步: 买了SRS Stack怎么用，怎么开头，怎么入门，怎么起步，怎么开始折腾。
* [How to Upgrade](#how-to-upgrade): 如何升级: 如何升级到最新版本或稳定版本，为何不支持界面点击升级。
* [How to Set a Domain](#how-to-set-a-domain): 如何设置域名: 如何设置域名访问管理后台，为何打不开管理后台，为何IP访问不了管理后台。
* [Supported Platforms](#supported-platforms): 支持哪些平台: 支持哪些平台，支持镜像，想直接用服务器或命令行安装，或宝塔安装
* [How to Push Multiple Streams](#how-to-push-multiple-streams): 如何推多路流: 一路流不够，想推多路流，想改默认的流名称和流地址。
* [How to Run Multiple Instances](#how-to-run-multiple-instances): 如何启动多个实例: 机器CPU很多，如何支持更多的平台转发，或者更多路流以及录制等。
* [How to Set up Free HTTPS](#how-to-set-up-free-https): 如何设置免费HTTPS: 如何申请免费HTTPS证书，如何申请多个域名的证书。
* [How to Use Server File for Virtual Live Events](#how-to-use-server-file-for-virtual-live-events): 如何用服务器的文件做虚拟直播: 如何用其他工具上传文件，并在虚拟直播中使用
* [How to Modify the Push Authentication Key](#how-to-modify-the-push-authentication-key): 如何修改推流鉴权的密钥: 更新推流鉴权的密钥，更换推流密钥
* [How to Disable Push Authentication](#how-to-disable-push-authentication): 如何禁用推流鉴权: 不想要推流鉴权，设备不支持特殊字符。
* [How to Change the Recording Directory](#how-to-change-the-recording-directory): 如何修改录制的目录: 如何修改录制的目录为其他磁盘目录。
* [Recording Does Not Stop When the Stream is Stopped](#recording-does-not-stop-when-the-stream-is-stopped): 停止推流时录制没有停止: 为何不能在停止推流时停止录制，而是等待一定时间才停止。
* [How to Quickly Generate a Recorded File](#how-to-quickly-generate-a-recorded-file): 如何快速生成录制文件: 停止推流后，如何快速生成录制文件。
* [How to Record to S3 Cloud Storage](#how-to-record-to-s3-cloud-storage): 如何录制到S3云存储: 录制到AWS、Azure、DigitalOcean Space等S3兼容的存储上。
* [How to Record a Specific Stream](#how-to-record-a-specific-stream): 如何录制特定的流: 如何按特定规则录制，如何录制指定的流
* [Unavailable After Installation](#unavailable-after-installation): 安装后无法访问: 安装后提示错误，或者Redis没准备好。
* [Difference Between SRS Restream and OBS Restream](#difference-between-srs-restream-and-obs-restream): SRS转推和OBS转推的区别: SRS的多平台转推，和OBS转推插件的区别。
* [How SRS Re-streams to Custom Platforms](#how-srs-restreams-to-custom-platforms): SRS如何转推自定义平台: SRS的多平台转推，如何推到自定义的直播平台。
* [Why and How to Limit the Bitrate of Virtual Live Events](#why-and-how-to-limit-the-bitrate-of-virtual-live-events): 为什么要限制虚拟直播的码率，如何解除限制。
* [How to Setup the Font Style for AI Transcript](#how-to-setup-the-font-style-for-ai-transcript): 如何设置AI自动字幕的字体样式。
* [How to Setup the Video Codec Parameters for AI Transcript](#how-to-setup-the-video-codec-parameters-for-ai-transcript): 如何设置AI自动字幕的视频转码参数。
* [How to Replace FFmpeg](#how-to-replace-ffmpeg): 如何更换FFmpeg: 如何更换SRS Stack中的FFmpeg为自定义版本。
* [Installation of SRS is Very Slow](#installation-of-srs-is-very-slow): 宝塔安装SRS非常慢: 海外用宝塔安装非常慢，访问阿里云镜像太慢。
* [How to Install the Latest SRS Stack](#how-to-install-the-latest-srs-stack): 宝塔如何安装最新的SRS Stack: 手动安装宝塔插件，安装最新的插件。
* [CentOS7 Installation Failed](#centos7-installation-failed): 宝塔CentOS7安装失败: CentOS7宝塔安装失败，找不到目录，或GLIBC版本问题。
* [The Difference Between SRS Stack and SRS](#the-difference-between-srs-stack-and-srs): SRS Stack和SRS的差别: SRS Stack对比SRS的差异，为什么要有SRS Stack。
* [Low Latency HLS](#low-latency-hls): HLS低延时: HLS低延时的原理和实现方式。
* [OpenAPI](#openapi): 关于开放API，使用API获取相关信息。
* [HTTP Callback](#http-callback): 关于支持的HTTP回调。
* [Changelog](#changelog): 版本规划: 关于版本和里程碑。

你也可以在页面中搜索关键字。

## Getting Started

请先购买和设置环境，参考[官网文档](./blog/SRS-Stack-Tutorial)或者[视频教程](https://www.bilibili.com/video/BV1844y1L7dL/)，
包括如何设置防火墙，视频很短只有5分钟，但是不看会有非常多的问题，请不要跳过这个基本步骤。

进入SRS Stack后，根据不同应用场景，会有对应的视频教程，如下图所示：

![](/img/page-2023-03-04-01.png)

每个场景也有完善的介绍，以及详细的操作步骤，如下图所示：

![](/img/page-2023-03-04-02.png)

请不要乱试，一定要跟引导做，音视频乱试一定会出问题。

## How to Upgrade

如何升级到最新版本或稳定版本，为何不支持界面点击升级？

由于SRS Stack支持多个平台，包括docker等，而docker是不能自己升级自己的，所以SRS Stack也不支持界面升级，需要手动升级。

如果您使用HELM，并安装了srs-stack `1.0.1`，那么您可以通过`helm upgrade srs srs/srs-stack --version 1.0.2`进行升级，
如果想回滚到`1.0.1`，可以使用`helm rollback srs`。

```bash
helm upgrade srs srs/srs-stack --version 1.0.2
```

Docker启动时会指定版本，比如`registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:v1.0.293`，只需要删除容器后指定新
版本启动即可，比如`registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:v1.0.299`。

如果使用`registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5`则是用最新的版本，则需要手动更新，
比如`docker pull registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5`，然后删除和重启容器。

```bash
docker rm srs-stack
docker pull registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
docker run --restart always -d -it --name srs-stack -v $HOME/data:/data \
  -p 2022:2022 -p 2443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

如果使用宝塔，则删除应用后重装新版本即可，数据是保存在`/data`目录，不会丢失。

## How to Set a Domain

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

## Supported Platforms

SRS Stack支持Docker镜像，安装脚本，腾讯云Lighthouse和CVM镜像，DigitalOcean镜像，其他平台可以用宝塔安装。

推荐使用Docker直接安装，还可以装多个，注意要用Ubuntu 20+系统：
* Docker镜像安装：[这里](../docs/v6/doc/getting-started-stack#docker)

SRS Stack支持HELM安装，请参考[srs-helm](https://github.com/ossrs/srs-helm)的说明。

如果你习惯用宝塔，可以用宝塔安装，可以和多个网站并存，注意要用Ubuntu 20+系统：
* 宝塔：其他云平台可以用宝塔安装，要求是CentOS 7+或Ubuntu 20+的系统，使用参考[这里](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ)
* aaPanel：海外的宝塔，如果你的机器是海外的，一定不要用宝塔而要用aaPanel，使用参考[这里](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)
* Script：直接用脚本也可以，参考[Script](../docs/v6/doc/getting-started-stack#script)

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

## How to Push Multiple Streams

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

## How to Run Multiple Instances

机器CPU很多，如何支持更多的平台转发，或者更多路流以及录制等。

可以选择使用Docker方式启动SRS Stack，可以非常容易跑非常多的SRS Stack实例，这些实例都是隔离的，互不影响，可以将机器资源利用上。

比如启动两个实例，侦听在2022和2023端口，流媒体依次用不同的端口：

```bash
docker run --restart always -d -it --name srs-stack0 -it -v $HOME/data0:/data \
  -p 2022:2022 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

然后打开 [http://localhost:2022](http://localhost:2022) 即可登录。

```bash
docker run --restart always -d -it --name srs-stack1 -it -v $HOME/data1:/data \
  -p 2023:2022 -p 1936:1935 -p 8001:8000/udp -p 10081:10080/udp \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

然后打开 [http://localhost:2023](http://localhost:2023) 即可登录后台。

> Note: 注意端口不要重复，挂载的数据目录也不要重复，保持两个SRS Stack的完全独立。

尽管在Web界面上，看不到不同的RTMP端口，因为在容器中看到的都是1935端口，但这不会有影响，
你还是可以往两个不同的端口推流到这两个不同的实例。当然，你可以明确指定端口：

```bash
docker run --restart always -d -it --name srs-stack1 -it -v $HOME/data1:/data \
  -p 2023:2022 -p 1936:1935 -p 8001:8000/udp -p 10081:10080/udp \
  -e HTTP_PORT=2023 -e RTMP_PORT=1936 -e RTC_PORT=8001 -e SRT_PORT=10081 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

如果只是用多平台转播，或者虚拟直播，不涉及推流端口，则直接使用即可。

若需要推流到两个SRS Stack实例，则需要指定端口，比如推流到这两个SRS Stack：

* `rtmp://ip:1935/live/livestream`
* `rtmp://ip:1936/live/livestream`

其他的协议端口对应的也要改变，比如HLS：

* `http://ip:2022/live/livestream.m3u8`
* `http://ip:2023/live/livestream.m3u8`

当然也不是意味着你就可以启动上万个SRS Stack，你应该关注你的CPU和内存，以及机器的带宽是否充足。

## How to Set up Free HTTPS

SRS Stack支持申请免费HTTPS证书，而且可以申请多个域名的证书，还可以自动续期。比如，以下HTTPS网站的证书，都是跑了SRS Stack后一键自动申请的：

* https://ossrs.io SRS的海外文档网站。
* https://ossrs.net SRS的国内文档网站。

操作非常简单，只需要三步，具体请看[这里](./blog/SRS-Stack-HTTPS)：

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
docker run --restart always -d -it --name srs-stack -v $HOME/data:/data \
  -p 2022:2022 -p 2443:2443 -p 1935:1935 -p 8000:8000/udp -p 10080:10080/udp \
  -p 80:2022 -p 443:2443 \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs-stack:5
```

申请成功后，在浏览器敲https加你的域名，就可以访问你的网站了。

## How to Use Server File for Virtual Live Events

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

## How to Modify the Push Authentication Key

若你需要更新推流鉴权的密钥，或者更换推流密钥，可以按以下操作步骤：

1. 进入`系统设置`面板。
1. 选择`流鉴权`标签页。
1. 输入新的流密钥。
1. 点`更新`按钮。
1. 刷新各个场景的页面，推流密钥就自动更新了。

如下图所示：

![](/img/page-2023-03-04-04.png)

若需要禁用推流鉴权，请参考下面的说明。

## How to Disable Push Authentication

在场景页面中，标准的推流格式，是带`?secret=xxx`鉴权的，比如`rtmp://ip/live/livestream?secret=xxx`

发现有些摄像机，不支持`?secret=xxx`的格式，所以会提示地址不支持。

这种情况下，其实可以直接将密钥`xxx`放在流名称中，比如：`rtmp://ip/live/livestreamsecretxxx`，这样就没问题了。

当然如果你就只需要推一个流，可以直接把密钥作为流名称，比如：`rtmp://ip/live/xxx`。

> Note: 当然了，播放也得改成一样的流名称才行，也要有密钥，因为这里是把密钥放在流名称中了，播放当然也得改了。

这样的方式，是有安全性，也能支持不支持特殊字符的设备，加上推流密钥本来就可以改，所以可以改成自己想要的方式。

## How to Change the Recording Directory

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

## Recording Does Not Stop When the Stream is Stopped

为何不能在停止推流时停止录制，而是等待一定时间才停止。

有些主播推流只推一次，中间不会中断。所以在这种情况下，如果停止推流停止录制，这个是没有问题的，只会生成一个文件。

但是有些主播，他推流时中间是有中断的，比如推流推了5分钟时间，中间中断等了可能30秒。那如果在停止推流就录制一个文件出来，就会有两个文件，所以这种情况下就是有问题的。

因此在停止推流时若停止录制，中间可能会导致录制会有多个文件，满足不了真实的场景的需要。

## How to Quickly Generate a Recorded File

如前面[停止推流时录制没有停止](#dvr-continue-when-unpublish)所说，为了实现录制为一个文件，特别是中断推流后还能合并为一个文件，
因此，主播停止推流后，SRS Stack不会立刻生成录制文件，而是会等待一定时间，超时后才会生成。

那么，如何在停止推流后，如何快速生成录制文件？可以在主播停止推流后，点击界面的按钮，或者使用HTTP API，请求结束录制任务，这样就可以
尽可能快速生成录制文件。

和YouTube的直播间类似，一般是在直播间有一个`End Stream`的按钮，点击按钮后，就会停止推流，同时会请求结束录制任务。

> Note: 请求结束录制任务是异步接口，调用后不会立刻就会生成录制文件，因为处理直播的切片需要时间，需要等待一定时间。
> 录制文件准确的生成时间，请调用API查询，或者以回调事件为准。

## How to Record to S3 Cloud Storage

SRS Stack支持录制到AWS、Azure、DigitalOcean Space等S3兼容的存储上。

首先使用[s3fs](https://github.com/s3fs-fuse/s3fs-fuse)将S3存储挂载到本地磁盘，比如`/data/srs-s3-bucket`目录，
具体请参考你使用的云厂商的手册，网上的资料非常多。可以执行下面的命令，如果能获取到S3存储中的文件，就准备好了：

```bash
ls -lh /data/srs-s3-bucket
```

> Remark: 特别注意，挂载存储后，需要重启SRS Stack才能访问到挂载的目录。

然后在SRS Stack的录制中，选择`设置录制规则 > 录制后处理 > 拷贝录制文件`，输入文件夹`/data/srs-s3-bucket`，这样在录制生成文件后，
就会将录制文件拷贝到S3存储了，路径一般是：

```bash
/data/srs-s3-bucket/{RECORD-UUID}.mp4
```

可以使用S3的HTTP观看，或者CDN分发功能，直接观看录制的文件，或者进行加工和处理。

若需要禁用这个功能，则可以把目标文件夹设置为空。

特别注意，请不要将整个`/data`或者`/data/record`目录，挂载到云盘，由于Record目录会有很多临时文件，在预览录制的流时也会访问这个目录，
造成云存储的压力非常大，甚至可能会挂起。建议使用目录`/data/srs-s3-bucket`，或者更详细的子目录，比如`/data/srs-s3-bucket/yours`等。

特别注意，必须要挂载到`/data`目录的子目录下，SRS Stack才能正常访问到，若只能挂载到其他目录，则建议使用Docker启动SRS Stack，
并指定`-v /your-host-dir:/data/srs-s3-bucket`，这样SRS Stack就可以访问到了。

## How to Record a Specific Stream

如何按特定规则录制，如何录制指定的流。

SRS Stack允许您配置Glob匹配规则，该过滤器仅录制符合定义规则的流。要设置Glob匹配规则，请选择
`本地录制 > 设置录制规则 > 额外Glob匹配规则`。

例如，如果将匹配规则配置为`/live/*`，它将仅录制live应用程序中的流，例如`/live/livestream`
和`/live/show`，但不包括`/other/livestream`。

即使在录制过程中，也可以修改Glob匹配规则，而无需重新启动录制。即使流已经在发布，您也可以设置过滤器。
更新的过滤器将应用于流的新片段。

## Unavailable After Installation

新版本宝塔插件，避免和现有网站设置冲突，不再自动设置为默认网站，需要指定域名或者手动设置默认网站，请参考[如何设置域名](#how-to-set-domain)。

安装后提示错误，比如：

![](/img/page-2023-03-04-05.png)

或者Redis没准备好，比如：

![](/img/page-2023-03-04-06.png)

这是因为刚刚安装后，SRS Stack启动需要时间，等待3到5分钟后刷新页面，就可以了。

## Difference Between SRS Restream and OBS Restream

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

## How SRS Restreams to Custom Platforms

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

## Why and How to Limit the Bitrate of Virtual Live Events

为什么以及如何限制虚拟直播活动的比特率？许多用户使用7x24小时的虚拟直播活动，并超过服务器流量限制。通常，AWS Lightsail和DigitalOcean 
Droplets每月提供1TB的流量，允许进行7x24小时的3Mbps连续直播。因此，限制输入比特率以防止超过流量限制至关重要。

默认情况下，SRS Stack将虚拟直播的输入比特率限制为5Mbps，您可以从`系统配置>限流>限流设置`更改限制以设置更高的限制。

## How to Setup the Font Style for AI Transcript

如何设置AI自动字幕的字体样式？SRS Stack支持设置字体样式，格式为FFmpeg的force_style，
详细请参考[链接](https://ffmpeg.org/ffmpeg-filters.html#subtitles-1)。

例如，设置字幕为底部中央位置，设置距离底部20px：

```text
Alignment=2,MarginV=20
```

例如，设置字体颜色为红色，字体大小为20px：

```text
Fontsize=12,PrimaryColour=&HFFFFFF
```

例如，类似YouTube风格的样式：

```text
Fontname=Roboto,Fontsize=12,PrimaryColour=&HFFFFFF,BorderStyle=4,BackColour=&H40000000,Outline=1,OutlineColour=&HFF000000,Alignment=2,MarginV=20
```

例如，类似Netflix风格的样式：

```text
Fontname=Roboto,Fontsize=12,PrimaryColour=&HFFFFFF,BorderStyle=0,BackColour=&H80000000,Outline=0,Shadow=0.75
```

> Note: Netflix使用的字体是`Consolas`，SRS Stack暂时不支持，这里使用`Roboto`代替。

例如，类似复古黄色字体风格：

```text
Fontname=Roboto,Fontsize=12,PrimaryColour=&H03fcff,Italic=1,Spacing=0.3
```

你可以使用FFmpeg测试这些参数的效果，命令行如下：

```bash
cat > avatar.srt <<EOF
1
00:02:31,199 --> 00:02:37,399
[Music] Strong pray on the weak. [Music] Nobody does not think. 
[Music] You have got one hour. [Music] You know this would happen?

2
00:02:37,759 --> 00:02:39,759
Everything changed [Music]

3
00:02:39,800 --> 00:02:43,800
Jake it's crazy here the porridge is rolling and there's no stopping him

4
00:02:44,520 --> 00:02:49,440
We're going up against gunships his bows and arrows. I guess we better stop him
EOF

FORCE_STYLE="Fontname=Roboto,Fontsize=12,PrimaryColour=&HFFFFFF,BorderStyle=4,BackColour=&H40000000,Outline=1,OutlineColour=&HFF000000,Alignment=2,MarginV=20" &&
ffmpeg -i ~/git/srs/trunk/doc/source.flv \
    -ss 150 -t 20 -vf "subtitles=./avatar.srt:force_style='${FORCE_STYLE}'" \
    -c:v libx264 -c:a copy -y output.mp4
```

下面是常见的参数说明，详细请参考[链接](https://ffmpeg.org/ffmpeg-filters.html#subtitles-1)：

* `Fontname`：用于指定字幕的字体名称。字体名称应该是系统中已安装的字体。例如，如果你想要使用 [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) 字体，可以设置 `Fontname=Noto Sans SC`。
* `Fontsize`：定义字幕文字的大小。这个值通常是一个整数，表示字体的点数（pt）。例如，如果你想要字体大小为 24pt，可以设置 `Fontsize=24`。
* `PrimaryColour`：主要字体颜色，使用 &H 开头的 BGR (蓝绿红) 十六进制格式。格式通常为 &HBGR，其中 BGR 代表蓝色、绿色、红色的十六进制值。例如，要将字体颜色设置为红色，使用 `PrimaryColour=&H0000FF`（红色在 BGR 中表示为 FF0000，但此处需要颠倒为 0000FF）。
* `BackColour`：背景颜色，也使用 &H 开头的 BGR (蓝绿红) 十六进制格式。例如，要设置背景颜色为黑色，可以使用 `BackColour=&H000000`（黑色在 BGR 中为 000000，不需要颠倒）。
* `Bold`：用于设置字体是否加粗。通常，0 表示不加粗，而 1 或其他正数表示加粗。例如，要加粗字体，可以设置 `Bold=1`。
* `Italic`：用于设置字体是否倾斜。0 表示不倾斜，1 表示倾斜。例如，要设置字体为斜体，可以使用 `Italic=1`。
* `Underline`：用于设置字体是否有下划线。0 表示没有下划线，1 表示有下划线。例如，要给字体加下划线，可以设置 `Underline=1`。
* `StrikeOut`：用于设置字体是否有删除线。0 表示没有删除线，1 表示有删除线。例如，要给字体加删除线，可以设置 `StrikeOut=1`。
* `BorderStyle`：字幕边框的样式。通常，1 表示普通边框，3 表示不透明背景框。例如，要设置普通边框，可以使用 `BorderStyle=1`。
* `Outline`：字体边缘的轮廓宽度。这个值通常是一个整数。例如，要设置轮廓宽度为 2，可以使用 `Outline=2`。
* `OutlineColour`：设置字幕描边的颜色，使用同样的 BGR 十六进制格式。例如, `OutlineColour=&HFFFFFF` 为白色描边。
* `Shadow`：字体阴影的深度。这个值也是一个整数，表示阴影的大小。例如，要设置阴影深度为 1，可以使用 `Shadow=1`。
* `Spacing` 文字的间距。这个值可以是任意浮点数，用来调整字幕文字之间的空间。如果你希望增加字幕中字母或字符之间的空间，可以设置一个正值，如 `Spacing=2`。如果你想要字符更紧凑一些，可以设置一个负值，如 `Spacing=-1`。当 `Spacing=0.3` 时，表示在默认间距的基础上增加了0.3的额外间距。
* `Alignment`：字幕的对齐方式。这个值根据 ASS 字幕格式来决定，值为1到9，这些数字对应的位置是基于一个 3x3 的网格，其中 1, 2, 3 位于底部，4, 5, 6 位于中部，7, 8, 9 位于顶部。例如，如果你想让文字出现在屏幕的正中央，你应该使用 `Alignment=5`。例如，要设置文字居中对齐在底部，可以使用 `Alignment=2`。
* `MarginL`（左边距）: 此参数指定字幕文本左侧边缘与视频帧左侧边缘之间的距离。它用于确保文本与视频左侧有一定的空间，防止文本紧贴到视频边缘。这个距离通常以像素为单位，设置较大的值会使字幕文本更靠近视频的中心。例如，`MarginL=20`意味着字幕将从视频左侧边缘向内偏移20像素开始显示。
* `MarginR`（右边距）: 此参数定义字幕文本右侧边缘与视频帧右侧边缘之间的距离。类似于MarginL，它帮助保持文本与视频右侧的一定空间，避免文本紧贴到视频边缘。例如，`MarginR=20`将确保字幕文本的右侧边缘与视频右侧边缘至少有20像素的间距。
* `MarginV`（垂直边距）: 这个参数用于同时控制字幕文本顶部和底部与视频帧顶部和底部边缘的距离。这有助于调整字幕在垂直方向上的位置，确保字幕文本在屏幕上垂直居中或根据需要调整到合适的高度。例如，`MarginV=10`意味着字幕的顶部和底部都将与视频帧的顶部和底部边缘保持至少10像素的距离。

> Note: 关于`FFmpeg force_style`，你可以问ChatGPT，它可以提供更加方便的答案。

> Note: 颜色还可以 `ABGR` (Alpha, Blue, Green, Red) 格式表示，指定透明度(Alpha)，它的范围是从 00 到 FF（十六进制），其中 00 表示完全透明，FF 表示完全不透明。例如，`&H80FF0000`表示半透明的纯蓝色，其中80是透明度（半透明），FF是蓝色成分的最大值，而绿色和红色成分都是00。

> Note: 如果要使用其他`Fontname`，请从谷歌字体下载，并将字体文件挂载到SRS Docker的`/usr/local/share/fonts/`中。

## How to Setup the Video Codec Parameters for AI Transcript

要在视频流中叠加字幕，FFmpeg参数应该是：

```bash
ffmpeg \
    -i input.ts -vf '{subtitles}' \
    -c:v libx264 \ # Video codec and its parameters
    -c:a aac \ # Audio codec and its parameters
    -copyts -y output.ts
```

您可以在Web用户界面上设置视频编解码器及其参数，默认情况下可能是：

```bash
-c:v libx264 -profile:v main -preset:v medium -tune zerolatency -bf 0
```

所以最终的FFmpeg命令行是：

```bash
ffmpeg \
    -i transcript/2-org-4f06f7a5-7f83-4845-9b4b-716ffec1bead.ts \
    -vf subtitles=transcript/2-audio-a982892f-1d56-4b4a-a663-f3b7f1a5b548.srt:force_style='Alignment=2,MarginV=20' \
    -c:v libx264 -profile:v main -preset:v medium -tune zerolatency -bf 0 \
    -c:a aac -copyts \
    -y transcript/2-overlay-2ba4154c-03ed-4853-bdda-d8396fcb1f47.ts
```

请注意，强烈建议使用`-bf 0`来禁用B帧，因为WebRTC不支持B帧。

## How to Replace FFmpeg

如果使用Docker版本，可以更换SRS Stack中的FFmpeg为自定义版本，启动时指定命令：

```bash
-v /path/to/ffmpeg:/usr/local/bin/ffmpeg
```

可以使用命令`which ffmpeg`来查找你的FFmpeg的路径。

> Note: 非Docker版本不支持。

## Installation of SRS is Very Slow

有朋友反馈：海外用宝塔安装非常慢，访问阿里云镜像太慢。

这是因为海外不能使用宝塔，海外用宝塔安装其他的工具也非常慢，这是因为跨国回源到国内下载数据当然非常慢了。

宝塔海外版本叫[aaPanel](https://aapanel.com)，请使用aaPanel，安装软件很快，SRS Stack也会切换到海外的镜像下载。

宝塔和aaPanel只是安装方法不同，具体用法是一样的，请参考[宝塔](./blog/BT-aaPanel)或[aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)。

## How to Install the Latest SRS Stack

有时候宝塔商店的版本比较老，可以手动安装宝塔插件，安装最新的插件。

SRS Stack最新的版本，可以看[Releases](https://github.com/ossrs/srs-stack/releases)，每个版本的附件中`bt-srs_stack.zip`就是可以下载的插件。

下载插件后，可以在宝塔`软件商店 > 第三方应用 > 导入插件`，上传下载的`bt-srs_stack.zip`即可安装。

## CentOS7 Installation Failed

CentOS7由于年久失修，有很多问题，推荐使用Ubuntu20系统。

## The Difference Between SRS Stack and SRS

SRS是SRS Stack的媒体引擎，详细差异请查看[与SRS比较](../docs/v6/doc/getting-started-stack#compare-to-srs)。

## Low Latency HLS

如何降低HLS延迟，实现5秒延迟的HLS流，参考[如何实现5秒HLS低延迟](./blog/hls-5s-low-latency)。

## OpenAPI

See [HTTP API](../docs/v6/doc/getting-started-stack#http-api)

## HTTP Callback

See [HTTP Callback](../docs/v6/doc/getting-started-stack#http-callback)

## Changelog

Migrated to [CHANGELOG.md](https://github.com/ossrs/srs-stack/blob/main/DEVELOPER.md#changelog).

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/pages/faq-oryx-zh)
