# About

SRS经过十年的发展，已经越来越不Simple了，这篇文章介绍了SRS的重要背景、大事件、重要变更、规划、资料集等等，可以认为是比较全面的SRS的导航。

由于文章找很多链接，而公众号无法直接点击，可以看这篇文章在官网的版本，点文末尾的`阅读原文`直达。

## Features

功能一般是大家比较关注的点，丰富程度也是选择项目的重要原因，
详细的功能列表可以看 [Features](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features) 。
我们列出了主要的功能的版本，以及相关的Issue和PR链接。

此外，在 [里程碑](./product.md) 的详细描述中，也会介绍这个大的版本，所支持的功能。

> Note: 如果希望看每个里程碑的Issues，则可以在 [Milestones](https://github.com/ossrs/srs/milestones) 中查看。

特别注意的是，尽管不多，但SRS还是会将某些功能设置为 [Deprecated](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features) ，
可以在页面中搜索`Deprecated`或者`Removed`。我们也会详细解释为何要移除这个功能。

如果你想知道我们正在做的功能，可以在 [微信公众号](./contact.md#discussion) 中，点菜单的最新版本，比如`SRS 5.0`或者`SRS 6.0`。
新的功能完成后，我们也会发布文章到微信公众号，请关注。

## Releases

如果你想在线上使用SRS，推荐使用稳定版本。如果你想用新功能，就用开发版本。

SRS的分支规则，是按版本的分支，比如：

* [develop](https://github.com/ossrs/srs/tree/develop) 开发分支，不稳定，但是新功能最多。
* [5.0release](https://github.com/ossrs/srs/tree/5.0release#releases) SRS 5.0，可能是稳定的，具体要看分支的状态。
* [4.0release](https://github.com/ossrs/srs/tree/4.0release#releases) SRS 4.0，目前是稳定分支，而且会越来越稳定。

具体分支是否稳定，要看Releases的标记，比如 [SRS 4.0](https://github.com/ossrs/srs/tree/4.0release#releases) ：

* 2022-06-11, Release v4.0-r0，这个是稳定的发布版本。
* 2021-12-01, Release v4.0-b0，这个是相对比较稳定的beta版本，也就是公测版本。
* 2021-11-15, Release v4.0.198，这个版本就是不稳定的开发版。

> Note: 除了beta版本，还有alpha版本，比如`v5.0-a0`，是比beta更不稳定的内测版本。

> Note：每个alpha、beta、release版本，都会对应具体的版本号，比如`v5.0-a0`，对应的就是`v5.0.98`。

对于SRS来说，一般达到beta版本，就可以在线上使用了。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/about-zh)

