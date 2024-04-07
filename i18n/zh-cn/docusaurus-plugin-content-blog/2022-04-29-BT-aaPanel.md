---
slug: BT-aaPanel
title: Oryx - 用宝塔插件做音视频业务
authors: []
tags: [tutorial, bt, aapanel, streaming]
custom_edit_url: null
---

# Oryx：宝塔！宝塔！宝塔！

Oryx上线几个月了，大家反馈很好用，不过怎么在内网机器上部署呢？怎么在其他云部署呢？怎么在已经部署了网站的主机上部署呢？

宝塔在手，全部拥有！

<!--truncate-->

举个例子，我就有两个云主机，用宝塔部署了网站和Oryx，一鱼多吃，爽啊！之前海外两台机器，每个月10刀，现在只要5刀，每年可以省60美元，一百万年就可以省6000万美元啊，赚大发了：

* 腾讯云Lighthouse，部署了[wp.ossrs.net](https://wp.ossrs.net)网站，写写一些杂七杂八的东西，还部署了[lh.ossrs.net](https://lh.ossrs.net)Oryx，每周六做直播用的。
* DigitalOcean droplet，部署了[wp.ossrs.io](https://wp.ossrs.io)网站杂七杂八海外版，还部署了[ossrs.io](https://ossrs.io)海外SRS的漂漂亮亮的新官网，还有[r.ossrs.net](https://r.ossrs.net)Oryx做稳定版本演示用的。

> Note: 大家可以ping下这些域名，发现都是同一个机器，都是用宝塔部署的。

我们就来看看，各种场景下怎么用宝塔部署Oryx吧。先看怎么安装，后面是各种情况怎么使用，都需要安装Oryx这步。

## Prerequisites

宝塔虽好，也不是万能的，先请你想好了再动手，先想下下面的问题：

* 宝塔难度是高于云主机镜像的，镜像是完全点下就能用，宝塔是需要自己能维护主机，实际上宝塔简化了主机运维，并不代表你可以完全不了解如何运维主机。
* Oryx宝塔插件，更多是面向已经使用了宝塔的用户，如果是新用户，还是建议直接入手云主机的镜像，更简单一些，等搞定了简单的云主机姿势，再来搞复杂的宝塔更合适。
* Oryx所有功能都是一样的，不会因为宝塔平台所以功能更多一些，其他平台不支持的宝塔上也不会支持，所以如果觉得Oryx不满足要求，那可以直接放弃而不是换个宝塔。

如果你觉得没问题，那就继续拥有你的宝塔吧。

## Installation

宝塔安装可以用云主机的镜像，或者在[bt.cn](https://www.bt.cn/new/download.html)中找到安装脚本，现在Oryx支持的比较好的是Ubuntu 20+，可以执行下面的命令：

```bash
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
```

> Note: 最新的命令请在宝塔官网上找哈，这个可能会过时。

> Note: 宝塔支持了命令行安装，这样Oryx就不用支持命令行安装了，因为命令行安装要解决各种问题，既然宝塔解决得很好，我们还可以免费的使用，那为何要花时间造这个重复的轮子呢。

安装完宝塔后，是需要手机号登录的，实名制约束下自己放荡的内心，更有利于健康的网络环境，不要动坏心思的念头，双手支持实名制，哈哈哈。

这些弄完后，点左边导航栏的`软件商店`，在第三方应用中搜索`SRS`，点那个`5.0`评分给SRS来个好评，一次给足了别分期哈，如下图所示：

![](/img/blog-2022-04-29-zh-001.png)

评分完了就点安装按钮，如下图所示：

![](/img/blog-2022-04-29-zh-002.png)

这一步还只是安装插件，安装速度很快，安装完成后，点插件名称或`设置`，进入到Oryx插件中，要先安装Oryx和相关依赖，这一步才是真正的安装Oryx，耗时很久请耐心安装：

![](/img/blog-2022-04-29-zh-003.png)

> Note: 为何要安装这么多依赖呢？因为Oryx不仅仅是一个流媒体服务器，它还有鉴权、转发多平台、更新、录制等多个功能。

![](/img/blog-2022-04-29-zh-004.png)

安装完成后，就可以在`管理面板`中，看到Oryx的链接了，打开就看到熟悉的Oryx的后台界面，如下图所示：

![](/img/blog-2022-04-29-zh-005.png)

> Note: Oryx后续操作，详细的使用教程，就请参考我们之前录的视频和文章，[Oryx：起步、购买和入门](https://www.bilibili.com/video/BV1844y1L7dL/)。

一般大家用宝塔都会用来管理网站，Oryx是可以和网站一起工作的，不会冲突，下面详细看看网站部分。

## WebSite

如果你已经宝塔部署了网站，那么也是可以安装Oryx的，安装方法请看前面的说明。

有一点需要注意，Oryx会创建一个srs.cloud.local的站点，并且会将默认站点设置成Oryx，这样大家才能直接播放IP的FLV和HLS流。

如果Oryx可以是默认站点，那么后面你就不用管了，直接就可以使用Oryx了。当然也可以给站点添加一个子域名，通过子域名访问Oryx。

如果你希望默认站点不是Oryx，而是其他网站，那可以先把默认站点设置为空，然后安装Oryx（会把默认站点设置为Oryx），然后再把默认站点设置为你想要的就可以。

这时候你就没法使用IP访问Oryx后台，也没法使用IP来播放直播流了，这时候你可以给Oryx站点，添加一个子域名，比如`srs.yourdomain.com`，需要替换成你的合法的能在浏览器中访问的子域名哈，如下图所示：

![](/img/blog-2022-04-29-zh-006.png)

设置好域名后，就可以通过域名访问Oryx，比如：`http://srs.yourdomain.com/mgmt`

> Note: 换成域名后，对应的推拉流地址也会变成域名，这些都是自动的，在Oryx后台可以看到。

和网站域名相关的就是HTTPS设置，这部分是需要特别说明的，下面会详细讲讲需要注意的情况。

## HTTPS

宝塔上申请SSL免费证书非常方便，还能续期和显示过期时间。也支持各种其他的证书，功能更完善。

Oryx也支持申请Lets Encrypt免费证书，需要操作Nginx的配置文件和`.well_known`目录，这个和宝塔冲突了，所以宝塔安装的Oryx，是禁用了这个功能，如下图所示：

![](/img/blog-2022-04-29-zh-007.png)

在宝塔上添加证书很简单，首先需要给Oryx站点绑定一个子域名，可以参考上面的说明：

![](/img/blog-2022-04-29-zh-008.png)

然后在`SSL`这个设置中，选择`Lets Encrypt`，就可以申请免费的证书，注意一定要选你合法的子域名，不能选`srs.cloud.local`这个默认的域名：

![](/img/blog-2022-04-29-zh-009.png)

申请后就可以看到SSL生效了，可以通过HTTPS访问你的站点了，比如：`https://srs.yourdomain.com/mgmt`

> Note: 换成HTTPS后，对应的推拉流地址也会变成HTTPS，这些都是自动的，在Oryx后台可以看到。

如何展示我们的直播流呢，可以用CMS，宝塔也可以很方便的安装WordPress和Typecho等。

## WordPress

非常推荐WordPress，我也知道很多说它太重太复杂，问题是简单的东西大家又觉得功能不够，这能怎么办？个人认为WordPress不是重，是大家太想一分钟搞定一件事情，然后躺平，这不是个好习惯呐。

我推荐WordPress是用过之后，发现它的主题非常多、插件非常多，想要做点什么事情都有对应的插件，如果我们不是想一锤子，能持续使用的软件还是很重要的，它这个复杂度也还好，每天花点时间捣腾下就搞定了。

SRS也支持了WordPress插件，详细用法请看[SRS Player插件](https://mp.weixin.qq.com/s/kOWabmKbYvrmEXG2fPOZxQ)，也可以直接打开[SRS Player DEMO](https://wp.ossrs.net/2022/04/25/srs-player/)页面，看看演示，这个站点就是用WordPress搭建的。

我这个站点也是用宝塔安装的，首先需要安装`MySQL`和`PHP`这两个依赖软件，版本选择常用的就好，MySQL我是选的`MySQL 5.5`，PHP我是选的`PHP 8.0`，选择你想要的就可以。

然后在`软件商店 > 一键部署`中，可以搜索到`WordPress`，注意不能在`全部`里面搜索，也不知道是什么原因，哈哈哈。

安装WordPress后，打开插件，需要设置下数据库和站点，具体的就按照指导操作了，相对是很简单的。

如果你是NGINX，这里特别补充一点，需要在WordPress的`网站 > 伪静态`中，选择`wordpress`，然后点`保存`按钮，这样WordPress的那个链接才能生效，否则会出现写文章时保存有些问题。如下图所示：

![](/img/blog-2022-04-29-zh-010.png)

我也会分享一些WordPress的用法，比如Markdown，比如SRS Player,可以收藏下我的WordPress站点 [https://wp.ossrs.net/](https://wp.ossrs.net/) 我会尝试用WordPress做SRS的vlog。

## Typecho

还有个类似WordPress的CMS，国内的[Typecho](http://typecho.org/)，我也使用了下，非常简单，挺好用的。SRS也支持了Typecho的插件，请看[Typecho-Plugin-SrsPlayer](https://github.com/ossrs/Typecho-Plugin-SrsPlayer)。

和WordPress比，Typecho的插件相对不太完善，没有地方上传插件，所以只能用户手动下载ZIP后上传到Typecho下面，具体用法可以参考[Install](https://github.com/ossrs/Typecho-Plugin-SrsPlayer#install)。

宝塔有个功能，是远程下载文件，可以直接下载文件到你的网站目录，然后双击`main.zip`解压，最后把`Typecho-Plugin-SrsPlayer-main/SrsPlayer`移动到Typecho
的插件目录`typecho/usr/plugins`就可以了：

```text
https://gitee.com/ossrs/Typecho-Plugin-SrsPlayer/repository/archive/main.zip
```

可以点网站的根目录，就会跳转到Typecho的目录下面，然后点`远程下载`，如下图所示：

![](/img/blog-2022-04-29-zh-011.png)

> Note: 操作略复杂了，所以我最后还是选择了WordPress，插件体系更完善，使用更方便些。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/22-04-29-BT-aaPanel)


