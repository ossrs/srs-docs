---
title: 编译以及安装
sidebar_label: 编译以及安装
hide_title: false
hide_table_of_contents: false
---

# Install

本文说明了如何编译和打包SRS，另外，可以直接下载release的binary，提供了几个常见系统的安装包，安装程序会安装系统服务，直接以系统服务启动即可。参考：[Github: release](http://ossrs.net/srs.release/releases/)或者[国内镜像: release](http://www.ossrs.net/srs.release/releases/)

## OS

* 推荐使用<strong>Ubuntu20</strong>.
* 若需要开发和编译SRS，建议用[srs-docker](https://github.com/ossrs/dev-docker/tree/dev).
* 建议直接使用[srs-docker](https://github.com/ossrs/dev-docker)运行SRS.

## IPTABLES and SELINUX

有时候启动没有问题，但是就是看不了，原因是防火墙和selinux开着。

可以用下面的方法关掉防火墙：

```bash
# disable the firewall
sudo /etc/init.d/iptables stop
sudo /sbin/chkconfig iptables off
```

selinux也需要disable，运行命令`getenforce`，若不是Disabled，执行下面的步骤：

1. 编辑配置文件：`sudo vi /etc/sysconfig/selinux`
1. 把SELINUX的值改为disabled：`SELINUX=disabled`
1. 重启系统：`sudo init 6`

## Build and Run SRS

确定用什么编译选项后（参考下面的说明），编译SRS其实很简单。只需要RTMP和HLS：

```
./configure && make
```

指定配置文件，即可启动SRS：

```bash
./objs/srs -c conf/srs.conf
```

推RTMP流和观看，参考[Usage: RTMP](./rtmp.md)

更多使用方法，参考[Usage](https://github.com/ossrs/srs/tree/3.0release#usage)

服务管理，参考[Service](./service.md)

Docker启动SRS，参考[srs-docker](https://github.com/ossrs/dev-docker#usage)

## ARM

一般的ARM都可以直接编译，使用和上面的方法是一样的。

某些编译非常慢，或者没有编译器的嵌入式平台，才需要交叉编译，请参考[这里](./arm.md)

Winlin 2014.11

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/install)


