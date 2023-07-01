---
title: RaspBerryPi
sidebar_label: RaspBerryPi
hide_title: false
hide_table_of_contents: false
---

# Performance benchmark for SRS on RaspberryPi

SRS支持arm，在树莓派上成功运行，本文记录了树莓派的性能指标。

## Install SRS

树莓派下安装和运行SRS，有以下方式：
* 编译源站和运行：SRS在arm/raspberrypi下的编译，参考[Build: RaspberryPi](./arm.md#raspberrypi)
* 直接下载binary文件，然后安装运行，下载RespberryPi的安装包：[Github站点](http://ossrs.net/srs.release/releases/) 或者 [国内镜像站点](http://ossrs.net/srs/releases/)。安装方法见页面。

查看SRS是否启动：`/etc/init.d/srs status`

## RaspberryPi

本次测试的硬件环境如下：
* [RaspberryPi](http://item.jd.com/1014155.html)：B型
* <strong>SoC</strong> BroadcomBCM2835(CPU,GPU,DSP,SDRAM,USB)
* <strong>CPU</strong> ARM1176JZF-S(ARM11) 700MHz
* <strong>GPU</strong> Broadcom VideoCore IV, OpenGL ES 2.0, 1080p 30 h.264/MPEG-4 AVC decoder
* <strong>RAM</strong> 512MByte
* <strong>USB</strong> 2 x USB2.0
* <strong>VideoOutput</strong> Composite RCA(PAL&NTSC), HDMI(rev 1.3&1.4), raw LCD Panels via DSI 14 HDMI resolution from 40x350 to 1920x1200 plus various PAL and NTSC standards
* <strong>AudioOutput</strong> 3.5mm, HDMI
* <strong>Storage</strong> SD/MMC/SDIO socket
* <strong>Network</strong> 10/100 ethernet
* <strong>Device</strong> 8xGPIO, UART, I2C, SPI bus, +3.3V, +5V, ground(nagetive)
* <strong>Power</strong> 700mA(3.5W) 5V
* <strong>Size</strong> 85.60 x 53.98 mm(3.370 x 2.125 in)
* <strong>OS</strong> Debian GNU/linux, Fedora, Arch Linux ARM, RISC OS, XBMC

另外，直播不会用到SD卡，所以可以忽略不计，用的是class2，4GB的卡。

软件环境如下：
* RaspberryPi提供的img：2014-01-07-wheezy-raspbian.img
* <strong>uname</strong>: Linux raspberrypi 3.10.25+ #622 PREEMPT Fri Jan 3 18:41:00 GMT 2014 armv6l GNU/Linux
* <strong>cpu</strong>: arm61
* <strong>服务器</strong>: srs 0.9.38
* <strong>服务器类型</strong>: raspberry pi
* <strong>客户端</strong>：[srs-bench](https://github.com/ossrs/srs-bench)
* <strong>客户端类型</strong>: 虚拟机，CentOS6
* <strong>观看客户端</strong>: PC win7, flash
* <strong>网络</strong>: 百兆交换机（pi只支持百兆）

流信息：
* 码率：200kbps
* 分辨率：768x320
* 音频：30kbps

环境搭建参考：[SRS: arm](./arm.md#raspberrypi)

## OS settings

超过1024的连接数测试需要打开linux的限制。且必须以root登录和执行。

* 设置连接数：`ulimit -HSn 10240`
* 查看连接数：

```bash
[root@dev6 ~]# ulimit -n
10240
```

* 重启srs：`sudo /etc/init.d/srs restart`

* 注意：启动服务器前必须确保连接数限制打开。

## Publish and Play

可以使用centos虚拟机推流到srs，或者用FMLE推流到raspberry-pi的SRS。假设raspberry-pi服务器的ip是`192.168.1.105`，请换成你自己的服务器ip。

推送RTMP流到服务器和观看。

* 启动FFMPEG循环推流：

```bash
for((;;)); do \
    ./objs/ffmpeg/bin/ffmpeg \
        -re -i doc/source.flv \
        -acodec copy -vcodec copy \
        -f flv rtmp://192.168.1.105:1935/live/livestream; \
    sleep 1; 
done
```
```

* 查看服务器的地址：`192.168.1.105`

```bash
[root@dev6 nginx-rtmp]# ifconfig eth0
eth0      Link encap:Ethernet  HWaddr 08:00:27:8A:EC:94  
          inet addr:192.168.1.105  Bcast:192.168.2.255  Mask:255.255.255.0
```

* SRS的流地址：`rtmp://192.168.1.105:1935/live/livestream`
* 通过srs-players播放SRS流：[播放SRS的流](http://ossrs.net/srs.release/trunk/research/players/srs_player.html?server=192.168.1.105&port=1935&app=live&stream=livestream&vhost=192.168.1.105&autostart=true)

## Client

使用linux工具模拟RTMP客户端访问，参考：[srs-bench](https://github.com/ossrs/srs-bench)

sb_rtmp_load为RTMP流负载测试工具，单个进程可以模拟1000至3000个客户端。为了避免过高负载，一个进程模拟800个客户端。

* 编译：`./configure && make`
* 启动参数：`./objs/sb_rtmp_load -c 800 -r <rtmp_url>`

## Record Data

测试前，记录SRS的各项资源使用指标，用作对比。

* 查看服务器端srs消耗的CPU：

```bash
pid=`ps aux|grep srs|grep objs|awk '{print $2}'` && top -p $pid
```

* 查看客户端srs-bench消耗的CPU：

```bash
pid=`ps aux|grep load|grep rtmp|awk '{print $2}'` && top -p $pid
```

* 查看客户端连接数命令：

```bash
for((;;)); do \
    srs_connections=`sudo netstat -anp|grep 1935|grep ESTABLISHED|wc -l`;  \
    echo "srs_connections: $srs_connections";  \
    sleep 5;  \
done
```

* 查看客户端消耗带宽(不影响服务器CPU)，其中，单位是bytes，需要乘以8换算成网络用的bits，设置dstat为30秒钟统计一次，数据更准：

```bash
[winlin@dev6 ~]$ dstat 30
----total-cpu-usage---- -dsk/total- -net/lo- ---paging-- ---system--
usr sys idl wai hiq siq| read  writ| recv  send|  in   out | int   csw 
  0   0  96   0   0   3|   0     0 |1860B   58k|   0     0 |2996   465 
  0   1  96   0   0   3|   0     0 |1800B   56k|   0     0 |2989   463 
  0   0  97   0   0   2|   0     0 |1500B   46k|   0     0 |2979   461 
```

* 数据见下表：

| Server | CPU | Mem | Conn | E带宽 | A带宽 | sb | 延迟 |
| ------ | --- | ---- | ---- | ---- | ---- | ---- | ----- |
| SRS | 1.0% | 3MB | 3 | 不适用 | 不适用 | 不适用 | 0.8秒 |

期望带宽(E带宽)：譬如测试码率为200kbps时，若模拟1000个并发，应该是1000*200kbps=200Mbps带宽。

实际带宽(A带宽)：指服务器实际的吞吐率，服务器性能下降时（譬如性能瓶颈），可能达不到期望的带宽，会导致客户端拿不到足够的数据，也就是卡顿的现象。

客户端延迟(延迟)：粗略计算即为客户端的缓冲区长度，假设服务器端的缓冲区可以忽略不计。一般RTMP直播播放器的缓冲区设置为0.8秒，由于网络原因，或者服务器性能问题，数据未能及时发送到客户端，就会造成客户端卡（缓冲区空），网络好时将队列中的数据全部给客户端（缓冲区变大）。

srs-bench(srs-bench/sb)：指模拟500客户端的srs-bench的平均CPU。一般模拟1000个客户端没有问题，若模拟1000个，则CPU简单除以2。

其中，“不适用”是指还未开始测试带宽，所以未记录数据。

## Benchmark SRS 0.9.38

本章测试SRS使用Epoll机制的性能。

开始启动srs-bench模拟客户端并发测试SRS的性能。

树莓派一般10个以内的连接比较常用，所以我们先测试10个链接的情况。加上推流链接实际上11个。

* 启动10客户端：

```bash
./objs/sb_rtmp_load -c 10 -r rtmp://192.168.1.105:1935/live/livestream >/dev/null &
```

* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | Mem | Conn | E带宽 | A带宽 | sb | 延迟 |
| ------ | --- | ---- | ---- | ---- | ---- | ---- | ----- |
| SRS | 17% | 1.4MB | 11 | 2.53Mbps | 2.6Mbps | 1.3% | 1.7秒 |

* 再启动一个模拟10个连接的srs-bench，共20个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | Mem | Conn | E带宽 | A带宽 | sb | 延迟 |
| ------ | --- | ---- | ---- | ---- | ---- | ---- | ----- |
| SRS | 23% | 2MB | 21 | 4.83Mbps | 5.5Mbps | 2.3% | 1.5秒 |

* 再启动一个模拟10个连接的srs-bench，共30个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | Mem | Conn | E带宽 | A带宽 | sb | 延迟 |
| ------ | --- | ---- | ---- | ---- | ---- | ---- | ----- |
| SRS | 50% | 4MB | 31 | 7.1Mbps | 8Mbps | 4% | 2秒 |

SRS使用epoll时，RaspberryPi B型，230Kbps视频性能测试如下表：

| Server | CPU | Mem | Conn | E带宽 | A带宽 | sb | 延迟 |
| ------ | --- | ---- | ---- | ---- | ---- | ---- | ----- |
| SRS | 17% | 1.4MB | 11 | 2.53Mbps | 2.6Mbps | 1.3% | 1.7秒 |
| SRS | 23% | 2MB | 21 | 4.83Mbps | 5.5Mbps | 2.3% | 1.5秒 |
| SRS | 50% | 4MB | 31 | 7.1Mbps | 8Mbps | 4% | 2秒 |

可见，RaspberryPi B型，SD卡class4，能支持的并发，SRS使用EPOLL时，码率为230kbps时，大约为xxxx个，网络带宽占用xxxxMbps。

## Benchmark SRS 0.9.72

一次性能测试记录：
* 硬件：raspberry-pi，B型，700MHZCPU，500MB内存，百兆有线网络
* 编码器：SRS自己采集，视频码率516kbps，音频码率63kbps，数据码率580kbps。时长220秒。avatar宣传片。
* 服务器：SRS 0.9.72。服务器至少有一个连接：采集程序推流到SRS。
* 客户端：flash播放器，RTMP协议，srs-bench（RTMP负载测试工具）

数据如下：

| Server | CPU | Mem | Conn | E带宽 | A带宽 | sb | 延迟 |
| ------ | --- | ---- | ---- | ---- | ---- | ---- | ----- |
| SRS | 5% | 2MB | 2 | 1Mbps | 1.2Mbps | 0% | 1.5秒 |
| SRS | 20% | 2MB | 12 | 6.9Mbps | 6.6Mbps | 2.8% | 2秒 |
| SRS | 36% | 2.4MB | 22 | 12.7Mbps | 12.9Mbps | 2.3% | 2.5秒 |
| SRS | 47% | 3.1MB | 32 | 18.5Mbps | 18.5Mbps | 5% | 2.0秒 |
| SRS | 62% | 3.4MB | 42 | 24.3Mbps | 25.7Mbps | 9.3% | 3.4秒 |
| SRS | 85% | 3.7MB | 52 | 30.2Mbps | 30.7Mbps | 13.6% | 3.5秒 |

## cubieboard benchmark

cubieboard是armv7 CPU，双核，性能比树莓派强很多。初步测试SRS支持300个客户端，占用一个CPU80%，可惜没有多进程；要是有多进程，能支持600个客户端，比较实用了。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/raspberrypi)


