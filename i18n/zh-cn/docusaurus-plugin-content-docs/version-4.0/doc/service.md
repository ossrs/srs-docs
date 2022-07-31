---
title: Linux系统服务
sidebar_label: Linux系统服务
hide_title: false
hide_table_of_contents: false
---

# SRS系统服务

SRS提供多种启动的方式，包括：
* 在git目录直接启动，简单直接，但系统重启后需要手动启动。
* 系统服务，init.d脚本：SRS提供`srs/trunk/etc/init.d/srs`脚本，可以作为CentOS或者Ubuntu的系统服务自动启动。

可以直接下载release的binary，提供了几个常见系统的安装包，安装程序会安装系统服务，直接以系统服务启动即可。参考：[Github: release](http://ossrs.net/srs.release)或者[国内镜像: release](http://ossrs.net/)

## Manual

若不需要添加到系统服务，每次重启后需要手动启动SRS，可以直接在srs的trunk目录执行脚本：

```bash
cd srs/trunk &&
./etc/init.d/srs start
```

## init.d

SRS作为系统服务启动，需要以下几步：
* 安装srs：安装脚本会自动修改init.d脚本，将`ROOT="./"`改为安装目录。
* 链接安装目录的`init.d/srs`到`/etc/init.d/srs`
* 添加到系统服务，CentOS和Ubuntu方法不一样。

<strong>Step1:</strong> 安装SRS

编译SRS后，可执行命令安装SRS：

```bash
make && sudo make install
```

安装命令会将srs默认安装到`/usr/local/srs`中，可以在configure时指定其他目录，譬如```./configure --prefix=`pwd`/_release```可以安装到当前目录的_release目录（可以不用sudo安装，直接用`make install`即可安装。

<strong>Step2:</strong> 链接脚本：

```bash
sudo ln -sf \
    /usr/local/srs/etc/init.d/srs \
    /etc/init.d/srs
```

备注：若SRS安装到其他目录，将`/usr/local/srs`替换成其他目录。

备注：也可以使用其他的名称，譬如`/etc/init.d/srs`，可以任意名称，启动时也用该名称。

<strong>Step3:</strong>添加服务：

```bash
#centos 6
sudo /sbin/chkconfig --add srs
```

或者

```bash
#ubuntu12
sudo update-rc.d srs defaults
```

使用init.d脚本管理SRS

查看SRS状态：

```bash
/etc/init.d/srs status
```

启动SRS：

```bash
/etc/init.d/srs start
```

停止SRS：

```bash
/etc/init.d/srs stop
```

重启SRS：

```bash
/etc/init.d/srs restart
```

Reload SRS：

```bash
/etc/init.d/srs reload
```

日志切割，给SRS发送`SIGUSR1`信号：

```bash
/etc/init.d/srs rotate
```

平滑退出，给SRS发送`SIGQUIT`信号:

```bash
/etc/init.d/srs grace
```

## systemctl

CentOS7使用systemctl管理服务，我们在init.d的基础上新增了systemctl的配置：

```
./configure && make && sudo make install &&
sudo ln -sf /usr/local/srs/etc/init.d/srs /etc/init.d/srs &&
sudo cp -f /usr/local/srs/usr/lib/systemd/system/srs.service /usr/lib/systemd/system/srs.service &&
sudo systemctl daemon-reload && sudo systemctl enable srs
```

> Remark: 必须拷贝srs.service，否则在enable srs时会出错。

使用systemctl启动SRS服务：

```
sudo systemctl start srs
```

## Gracefully Upgrade

Gracefully Upgrade是平滑升级，就是指老的连接服务完后退出，新版本的服务继续提供服务，对业务没有影响，涉及的技术包括：

* 解决侦听冲突的问题，新版本的服务进程也需要侦听同样的端口，才能提供服务。一定时间内，新老进程是同时提供服务的。
* 老进程关闭侦听，不再接受新连接。老进程上就只有已经存在的连接，等老的连接服务完后再退出。 这就是Gracefully Quit平滑退出。

> Note: 关于这个机制，这里[#1579](https://github.com/ossrs/srs/issues/1579#issuecomment-587233844)有更多的探讨。

SRS3主要支持Gracefully Quit平滑退出：

* 使用信号`SIGQUIT`作为平滑退出信号，也可以使用服务命令`/etc/init.d/srs grace`。
* 新增配置，`grace_start_wait`，等待一定时间后开始GracefullyQuit，等待Service摘除Pod，默认2.3秒，参考[#1579](https://github.com/ossrs/srs/issues/1595#issuecomment-587516567)。
* 新增配置，`grace_final_wait`，等待连接退出后，需要等待一定的时间，默认3.2秒，参考[#1579](https://github.com/ossrs/srs/issues/1579#issuecomment-587414898)。
* 新增配置，`force_grace_quit`，强制使用Gracefully Quit，而不用Fast Quit，原因参考[#1579](https://github.com/ossrs/srs/issues/1579#issuecomment-587475077)。

```bash
# For gracefully quit, wait for a while then close listeners,
# because K8S notify SRS with SIGQUIT and update Service simultaneously,
# maybe there is some new connections incoming before Service updated.
# @see https://github.com/ossrs/srs/issues/1595#issuecomment-587516567
# default: 2300
grace_start_wait 2300;
# For gracefully quit, final wait for cleanup in milliseconds.
# @see https://github.com/ossrs/srs/issues/1579#issuecomment-587414898
# default: 3200
grace_final_wait 3200;
# Whether force gracefully quit, never fast quit.
# By default, SIGTERM which means fast quit, is sent by K8S, so we need to
# force SRS to treat SIGTERM as gracefully quit for gray release or canary.
# @see https://github.com/ossrs/srs/issues/1579#issuecomment-587475077
# default: off
force_grace_quit off;
```

> Note: 关于平滑退出的命令和演示，可以查看[#1579](https://github.com/ossrs/srs/issues/1579#issuecomment-587414898)。

Winlin 2019.10


![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-4/doc/service)


