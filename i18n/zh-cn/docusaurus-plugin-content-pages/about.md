# About

SRS经过十年的发展，已经越来越不Simple了，这篇文章介绍了SRS的重要背景、大事件、重要变更、规划、资料集等等，可以认为是比较全面的SRS的导航。

由于文章找很多链接，而公众号无法直接点击，可以看这篇文章在官网的版本，点文末尾的`阅读原文`直达。

## Features

功能一般是大家比较关注的点，丰富程度也是选择项目的重要原因，
详细的功能列表可以看 [Features](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features) 。
我们列出了主要的功能的版本，以及相关的Issue和PR链接。

此外，在 [里程碑](/product) 的详细描述中，也会介绍这个大的版本，所支持的功能。

> Note: 如果希望看每个里程碑的Issues，则可以在 [Milestones](https://github.com/ossrs/srs/milestones) 中查看。

特别注意的是，尽管不多，但SRS还是会将某些功能设置为 [Deprecated](https://github.com/ossrs/srs/blob/develop/trunk/doc/Features.md#features) ，
可以在页面中搜索`Deprecated`或者`Removed`。我们也会详细解释为何要移除这个功能。

如果你想知道我们正在做的功能，可以在 [微信公众号](/contact#discussion) 中，点菜单的最新版本，比如`SRS 5.0`或者`SRS 6.0`。
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

## Support

音视频开发者，几乎必然碰到问题，估计大家比较习惯云厂商的贴身服务，来到开源社区就非常不习惯。

其实遇到问题不要慌张，大部分问题都是已经有的，可以在 [FAQ](/faq) 中找到答案，或者在文档 [Docs](/docs/v5/doc/getting-started) 中找到答案。

也可以在 [支持](/contact) 中加微信群，和其他开发者交流，不过请遵守社区规范，否则也得不到支持的。

作为开发者，我们必须学会看文档，调查问题，然后再在社区中交流。

值得澄清的是，中国开发者的素质也越来越高了，深度开发者我们建议加付费星球，参考 [Support](/contact#donation) 。

SRS没有商业化的计划，我们目前正在努力建设全球的活跃的开发者社区，开源的价值会越来越大，社区彼此的支持也会越来越多。

## Debugging

微信公众号，以及前面，都讲过一些遇到问题怎么办的办法，这里分享下遇到少见的问题的一般处理办法。

少见的问题，一般是真的问题，FAQ和文档都没能找到答案，自己也研究了，搜索了，也没找到解决办法。

举个常见的例子：延迟大，按照文档操作还是延迟大。

解决一般问题的一般策略，是先找到没问题的路径，然后逐步排除。比如排查上面延迟的问题：

1. 首先，完全按照文档搭建，任何步骤都不要做变更，延迟一定小。同样的工具和环境，是一定能达到同样的预期。
2. 然后，将某一个环节，注意是一个环节，换成你的，比如你的播放器，观察延迟是不是变大了。
3. 接着，继续把下一个环节，换成你的，比如把推流编码器换成你的，观察延迟是不是变大了。
4. 以此往复，知道全部变成你的环境，你就自然知道问题在哪个地方。

如果是碰到性能问题，比如支持的并发太少，也可以用上面的步骤操作，这是一个通用的解法。

## Know Issues

SRS有很多Issues，但核心的未解决的问题，我在这里特别列出来：

* Source清理，参考 [#413](https://github.com/ossrs/srs/issues/413) ，流特别多时会出现内存不断增长。
  * 我们给出了一些Workaround，包括Graceful Restart等，不影响业务的自动重启，释放内存。
  * 我们会在6.0，使用简单的GC解决它，可以参考 [Wrapper](https://github.com/ossrs/srs/issues/413#issuecomment-1227972901) ，可以认为是一种非常简单的智能指针。
  * 还有朋友提过用C++11的智能指针，但是C++11的智能指针，我见过太多的问题是它引起。
* 单核问题，参考 [#2188](https://github.com/ossrs/srs/issues/2188) ，主要是单核无法使用机器的多个CPU问题。
  * 直播可以用Origin和Edge集群，还有ReusePort，可以参考相关文章。
  * SRS 6.0已经支持了多线程框架，但主体还是单线程的，主要我们发现多线程一样会引入很多问题，并不是没有代价。
  * SRS 6.0会支持新的集群架构 [Proxy](https://github.com/ossrs/srs/issues/3138) 解决RTC/RTMP/GB/SRT等等协议的扩展问题，一样可以部署在单机使用到多核能力。
* 模块化，参考 [#2151](https://github.com/ossrs/srs/issues/2153) ，主要是扩展起来比较难，只能改C++代码。

之前大家提得比较多，但已经解决的问题：

* GB稳定性问题：SRS 5.0的GB稳定性很好，参考 [#3176](https://github.com/ossrs/srs/issues/3176) ，现在大家反馈更多的是GB的功能不够丰富。只要稳定性没问题，功能可以慢慢加。

如果有什么我们漏掉的问题，欢迎反馈给我们。

## Strategy

SRS不做客户端，因为无论是FFmpeg，还是OBS，还是VLC，还是WebRTC，都是非常成熟和庞大的开源社区，我们和这些社区合作，使用这些社区的产品。

除了SRS服务器，我们还在做SRS Stack，还有WordPress插件等等，主要的目标还是根据不同行业，做出更简单的应用方式，包括：

* [srs-stack](https://github.com/ossrs/srs-stack) SRS Stack或SRS Stack，是一个开箱即用的单机的视频云，里面有FFmpeg和SRS等，主要是方便不会命令行的用户，直接通过腾讯云镜像或者宝塔，鼠标操作，就可以把音视频的应用搭起来。
* [WordPress-Plugin-SrsPlayer](https://github.com/ossrs/WordPress-Plugin-SrsPlayer) 出版领域，比如个人博客、网站传媒等，方便用户可以使用音视频的能力。
* [srs-unity](https://github.com/ossrs/srs-unity) 游戏领域，对接Unity的WebRTC SDK，使用音视频的能力。

SRS还会在工具链上不断完善，开发者可能不用SRS，但可能用过SB压测工具：

* [srs-bench](https://github.com/ossrs/srs-bench) 音视频压测工具，包括RTMP/FLV/WebRTC/GB28181等，未来还会完善。
* [state-threads](https://github.com/ossrs/state-threads) C的协程库，可以认为是C版本的Go，很小巧但很强大的服务器库，我们也会不断完善它。
* [tea](https://github.com/ossrs/tea) 这是eBPF方向的探索，网络的弱网模拟，以及LB负载均衡。

通过不断完善音视频的工具链、解决方案、场景化的能力，让各行各业都可以应用音视频的能力。

## Contribute

SRS是一个非商业化的开源社区，活跃的开发者都有自己的工作，会花自己的业余时间推动SRS的发展。

由于SRS整个体系是非常高效的，因此我们可以花很少的时间让SRS不断进步，交付功能丰富且稳定性很高的高质量产品，基于SRS定制也很容易。

我们是全球的开源社区，国内和海外都有开发者社区，我们欢迎开发者加入我们：

* 巨大的成就感：你的代码可以影响全球的用户，改变音视频行业，并且随着SRS在各行各业的广泛应用，也改变了各行各业。
* 扎实的技术进步：在这里可以和全球顶尖的音视频开发者交流，掌握高质量软件开发的能力，互相提升技术能力。

SRS目前使用了以下的技术和规则，保证项目的高质量和高效率：

* 长时间的架构和方案探讨，对于大的功能和方案，需要得到长时间探讨，比如 [HEVC/H.265](https://github.com/ossrs/srs/issues/465) 的支持，我们讨论了7年。
* 仔细认真的CodeReview，每个PullRequest至少2个TOC和Developer通过，并且Actions全部通过，才能合并。
* 完善的单元测试(500多个)、覆盖率(60%左右)、黑盒测试等，保持一年开发一年测试的充足测试时间。
* 全流水线，每个PullRequest会有流水线，每次发布由流水线自动完成。

欢迎加入我们，具体请访问 [Contribute](https://github.com/ossrs/srs/contribute) 按要求提交PullRequest。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/pages/about-zh)

