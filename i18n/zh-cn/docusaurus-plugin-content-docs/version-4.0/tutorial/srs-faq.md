---
title: SRS FAQ
sidebar_label: 答疑
hide_title: false
hide_table_of_contents: false
---

# SRS 答疑FAQ合集

SRS精彩答疑话题

## FAQ: SRS有哪些文档和资料
* 地址: https://www.bilibili.com/video/BV1QA4y1S7iU
* 说明: SRS有哪些文档资料？先看Usage，在看FAQ，接着是Wiki，还有Issues。如果GitHub访问慢怎么办呢？可以把资料Clone到本地，或者访问Gitee镜像。

## FAQ：SRS是否支持STUN和WebRTC的P2P
* 地址: https://www.bilibili.com/video/BV13t4y1x7QV
* 说明: SRS是否支持STUN协议？如何支持WebRTC P2P打洞？SFU和P2P的区别？
   
## FAQ：SRS导致WebRTC丢帧如何排查
* 地址: https://www.bilibili.com/video/BV1LS4y187xU
* 说明: RTMP推流到SRS使用WebRTC播放是常见的用法，RTMP是30帧，WebRTC只有10帧，看起来就会卡顿不流畅，这个视频分享了如何排查这类问题。

## FAQ：SRS有哪些Docker镜像
* 地址: https://www.bilibili.com/video/BV1BZ4y1a7Fg
* 说明: Docker是非常好用的技术，SRS提供了完善的Docker镜像，也可以自己打SRS的Docker镜像。

## FAQ：SRS如何提交Issue
* 地址: https://www.bilibili.com/video/BV13v4y1A74N
* 说明: 如果碰到问题，怎么判断是否是Issue？怎么排查Issue？如何提交新的Issue？为何提交的Issue被删除？

## FAQ：SRS为何不支持WebRTC的FEC等复杂算法
* 地址: https://www.bilibili.com/video/BV1CA4y1f7JW
* 说明: 什么是WebRTC的拥塞控制算法？FEC和NACK有何不同、如何选择？为何SRS没有支持复杂的算法？为何说复杂牛逼的算法一般没什么鸟用？      
    
## FAQ：CDN支持WebRTC的完善度
* 地址: https://www.bilibili.com/video/BV14r4y1b7cH
* 说明: CDN或云厂商是否都支持WebRTC了？为何说是差不多支持了？目前还有哪些问题或坑？都有哪些CDN的直播是支持WebRTC协议的？

## FAQ：如何实现直播混流或WebRTC的MCU
* 地址: https://www.bilibili.com/video/BV1L34y1E7D5
* 说明: 如何给直播添加LOGO？如何实现直播画中画？如何实现WebRTC转直播？如何实现WebRTC的MCU功能？为何RTC架构大多是SFU而不是MCU？什么时候必须用MCU？
  
## FAQ：开源SFU如何选？Janus有哪些问题，何解？
* 地址: https://www.bilibili.com/video/BV1bR4y1w7X1
* 说明: Janus是WebRTC领域使用最广泛也是最好的SFU之一，当然和所有SFU一样它也有一堆的问题，选择开源选的不仅是代码和架构，选择的更是活跃的社区和对方向的判断。     
      
## FAQ：如何更低码率达到同等画质
* 地址: https://www.bilibili.com/video/BV1qB4y197ov
* 说明: 在保证画质的前提下，如何降低码率？我们可以使用动态码率，还可以使用相对空闲的客户端CPU交换码率，还可以在业务上优化，特别多平台推流时需要避免上行码率过高。