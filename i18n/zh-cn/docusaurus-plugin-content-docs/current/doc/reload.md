---
title: 热加载配置
sidebar_label: 热加载配置
hide_title: false
hide_table_of_contents: false
---

# Reload

SRS配置完全支持Reload，即在不中断服务时应用配置的修改。

## NotSupportedFeatures

不支持reload的功能包括：
* deamon，是否后台启动。
* mode，vhost的模式。

daemon选项当然是不支持reload的。

mode选项，即决定vhost是源站还是边缘，不支持reload。若修改mode之后reload会导致server异常退出，由看门狗重启。原因在于：
* 源站和边缘角色切换过于复杂。
* 一般源站会建立设备组，全部做源站，不会突然变成边缘
* 上层和源站重启后，对最终用户没有影响，只是表现会切换上层的卡顿（客户端缓冲区设为3秒以上时，卡顿都不会出现）。

一个修改vhost的mode属性的workaround：
* 删除vhost并reload。
* 确认vhost已经删除了。
* 添加vhost，使用新的mode，并reload。

## 应用场景

Reload主要应用场景：
* 配置快速生效：不用重启服务，修改配置后，只需要`killall -1 srs`即可生效配置。
* 不中断服务：商用服务器往往时时刻刻都在服务用户，如何将一个转码流的码率调低？如何禁用某些频道的HLS？如何添加和删除频道？而且还中断现有用户的服务？使用Reload。

## 使用方法

Reload的方法为：`killall -1 srs`

或者指定发送的SRS进程：`kill -1 7635`

使用启动脚本：`/etc/init.d/srs reload`

Winlin 2014.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/reload)


