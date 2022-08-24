---
title: Git
sidebar_label: Git
hide_title: false
hide_table_of_contents: false
---

# GIT

如何选择SRS的稳定版本？如何更新代码？

## Fast Checkout

很多人希望缩减仓库大小，很多doc和3rdparty中的第三方代码压缩包。我在这里集中说明一次，为何需要把doc收集那么全？这个不言自明，srs中23%的代码都是注释，注释会说明是哪个文档的哪一页，难道还需要再下载一次这个文档吗？为何需要把依赖的第三方代码放进来，譬如ffmpeg和nignx还有openssl？再去下载这些相关的程序会比较麻烦，而且对于新手来说，下载正确的版本和编译都是比较复杂的问题。为了好用，大一点的仓库我觉得而是可以接受的。

为何不做这些改变？这些是次要复杂度，仓库多大对于代码质量没有任何影响。而且更重要的是，国内很多git镜像站点，SRS是同步更新的，阿里云提供服务的oschina，我git clone一次是40秒左右。这个问题就变成一个小问题了。

如何使用国内镜像站点clone，然后把服务器设置为github上？这样和直接从github上clone一模一样了。执行下面的命令就可以了：

```
git clone -b 4.0release https://gitee.com/ossrs/srs.git && 
cd srs && git remote set-url origin https://github.com/ossrs/srs.git
```

其他国内镜像参考：https://github.com/ossrs/srs/tree/develop#mirrors

## Checkout Branch

有些功能只有SRS2.0有，SRS1.0没有，请注意看wiki是v1还是v2的。

如果是1.0的功能，更新代码后要改变到1.0分支：

```
git pull && git checkout 1.0release
```

如果是2.0的功能，更新代码后要改变到2.0分支：

```
git pull && git checkout 2.0release
```

如果是3.0的功能，更新代码后要改变到3.0分支：

```
git pull && git checkout 2.0release
```

如果是4.0的功能，更新代码后要改变到4.0分支：

```
git pull && git checkout 4.0release
```

如果是5.0的功能，更新代码后要改变到5.0分支（没有单独的5.0release分支就是develop）：

```
git pull && git checkout develop
```

## SRS Branches

release分支会比develop稳定，不过只有正式发布的版本才比较稳定，发布中的版本也会有release分支。

* 3.0release，稳定发布版本。
* 4.0release，正在发布中的版本，还不够稳定。
* develop，开发版本，没有稳定性保障。

所谓稳定性，开源项目和商业产品的定义是不同的。开源产品没有明确的稳定性定义，也没有SLA定义，肯定是会碰到问题，就需要开发者自己能解决。
毕竟代码都有了，如果解决不了问题，那还是建议用商业的云服务吧。

SRS的稳定性保障，主要依靠几个方法：

* 一旦进入Release阶段，变更会考虑稳定性，不会新增功能，基本上只改善代码和解决bug。
* 不断完善UTest和RegressionTest，防止引入问题，提前发现问题。
* 依靠社区的反馈，一般Release分支会提交一些Commit但不一定会打版本，如果过段时间没有稳定性问题反馈才会发版本。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/git)


