---
title: Performance
sidebar_label: Performance 
hide_title: false
hide_table_of_contents: false
---

# Performance Banchmark

对比SRS和高性能nginx-rtmp的Performance，SRS为单进程，nginx-rtmp支持多进程，为了对比nginx-rtmp也只开启一个进程。

提供详细的性能测试的过程，可以为其他性能测试做参考，譬如测试nginx-rtmp的多进程，和srs的forward对比之类。

最新的性能测试数据，请参考[performance](https://github.com/ossrs/srs/tree/develop#performance)。

## Hardware

本次对比所用到的硬件环境，使用虚拟机，客户端和服务器都运行于一台机器，避开网络瓶颈。

* 硬件: 笔记本上的虚拟机
* 系统: CentOS 6.0 x86_64 Linux 2.6.32-71.el6.x86_64
* CPU: 3 Intel(R) Core(TM) i7-3520M CPU @ 2.90GHz
* 内存: 2007MB

## OS

超过1024的连接数测试需要打开linux的限制。且必须以root登录和执行。

* 设置连接数：`ulimit -HSn 10240`
* 查看连接数：

```bash
[root@dev6 ~]# ulimit -n
10240
```

* 重启srs：`sudo /etc/init.d/srs restart`

* 注意：启动服务器前必须确保连接数限制打开。

## NGINX-RTMP

NGINX-RTMP使用的版本信息，以及编译参数。

* NGINX: nginx-1.5.7.tar.gz
* NGINX-RTMP: nginx-rtmp-module-1.0.4.tar.gz
* 下载页面，包含编译脚本：[下载nginx-rtmp](http://download.csdn.net/download/winlinvip/6795467)
* 编译参数：

```bash
./configure --prefix=`pwd`/../_release \
--add-module=`pwd`/../nginx-rtmp-module-1.0.4 \
--with-http_ssl_module && make && make install
```

* 配置nginx：`_release/conf/nginx.conf`

```bash
user  root;
worker_processes  1;
events {
    worker_connections  10240;
}
rtmp{
    server{
        listen 19350;
        application live{
            live on;
        }
    }
}
```

* 确保连接数没有限制：

```bash
[root@dev6 nginx-rtmp]# ulimit -n
10240
```

* 启动命令：``./_release/sbin/nginx``
* 确保nginx启动成功：

```bash
[root@dev6 nginx-rtmp]# netstat -anp|grep 19350
tcp        0      0 0.0.0.0:19350               0.0.0.0:*                   LISTEN      6486/nginx
```

## SRS

SRS接受RTMP流，并转发给nginx-rtmp做为对比。

SRS的版本和编译参数。

* SRS: [SRS 0.9](https://github.com/ossrs/srs/releases/tag/0.9)
* 编译参数：``./configure && make``
* 配置SRS：`conf/srs.conf`

```bash
listen              1935;
max_connections     10240;
vhost __defaultVhost__ {
    forward         127.0.0.1:19350;
}
```

* 确保连接数没有限制：

```bash
[root@dev6 trunk]# ulimit -n
10240
```

* 启动命令：``nohup ./objs/srs -c conf/srs.conf >/dev/null 2>&1 &``
* 确保srs启动成功：

```bash
[root@dev6 trunk]# netstat -anp|grep "1935 "
tcp        0      0 0.0.0.0:1935                0.0.0.0:*                   LISTEN      6583/srs
```

## Publish and Play

使用ffmpeg推送SRS的实例流到SRS，SRS转发给nginx-rtmp，可以通过vlc/srs-players观看。

推送RTMP流到服务器和观看。

* 启动FFMPEG循环推流：

```bash
for((;;)); do \
    ./objs/ffmpeg/bin/ffmpeg \
        -re -i doc/source.flv \
        -acodec copy -vcodec copy \
        -f flv rtmp://127.0.0.1:1935/live/livestream; \
    sleep 1; 
done
```

* 查看服务器的地址：`192.168.2.101`

```bash
[root@dev6 nginx-rtmp]# ifconfig eth0
eth0      Link encap:Ethernet  HWaddr 08:00:27:8A:EC:94  
          inet addr:192.168.2.101  Bcast:192.168.2.255  Mask:255.255.255.0
```

* SRS的流地址：`rtmp://192.168.2.101:1935/live/livestream`
* 通过srs-players播放SRS流：[播放SRS的流](http://ossrs.net/srs.release/trunk/research/players/srs_player.html?server=192.168.2.101&port=1935&app=live&stream=livestream&vhost=192.168.2.101&autostart=true)
* nginx-rtmp的流地址：`rtmp://192.168.2.101:19350/live/livestream`
* 通过srs-players播放nginx-rtmp流：[播放nginx-rtmp的流](http://ossrs.net/srs.release/trunk/research/players/srs_player.html?server=192.168.2.101&port=19350&app=live&stream=livestream&vhost=192.168.2.101&autostart=true)

## Client

使用linux工具模拟RTMP客户端访问，参考：[srs-bench](https://github.com/ossrs/srs-bench)

sb_rtmp_load为RTMP流负载测试工具，单个进程可以模拟1000至3000个客户端。为了避免过高负载，一个进程模拟800个客户端。

* 编译：`./configure && make`
* 启动参数：`./objs/sb_rtmp_load -c 800 -r <rtmp_url>`

## Record Data

测试前，记录SRS和nginx-rtmp的各项资源使用指标，用作对比。

* top命令：

```bash
srs_pid=`ps aux|grep srs|grep conf|awk '{print $2}'`; \
nginx_pid=`ps aux|grep nginx|grep worker|awk '{print $2}'`; \
load_pids=`ps aux|grep objs|grep sb_rtmp_load|awk '{ORS=",";print $2}'`; \
top -p $load_pids$srs_pid,$nginx_pid
```

* 查看连接数命令：

```bash
srs_connections=`netstat -anp|grep srs|grep ESTABLISHED|wc -l`; \
nginx_connections=`netstat -anp|grep nginx|grep ESTABLISHED|wc -l`; \
echo "srs_connections: $srs_connections"; \
echo "nginx_connections: $nginx_connections";
```

* 查看服务器消耗带宽，其中，单位是bytes，需要乘以8换算成网络用的bits，设置dstat为30秒钟统计一次，数据更准：

```bash
[root@dev6 nginx-rtmp]# dstat -N lo 30
----total-cpu-usage---- -dsk/total- -net/lo- ---paging-- ---system--
usr sys idl wai hiq siq| read  writ| recv  send|  in   out | int   csw 
  0   0  96   0   0   3|   0     0 |1860B   58k|   0     0 |2996   465 
  0   1  96   0   0   3|   0     0 |1800B   56k|   0     0 |2989   463 
  0   0  97   0   0   2|   0     0 |1500B   46k|   0     0 |2979   461 
```

* 数据见下表：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| SRS | 1.0% | 3MB | 3 | 不适用 | 不适用 | 不适用 | 0.8秒 |
| nginx-rtmp | 0.7% | 8MB | 2 | 不适用 | 不适用 | 不适用 | 0.8秒 |

期望带宽(E带宽)：譬如测试码率为200kbps时，若模拟1000个并发，应该是1000*200kbps=200Mbps带宽。

实际带宽(A带宽)：指服务器实际的吞吐率，服务器性能下降时（譬如性能瓶颈），可能达不到期望的带宽，会导致客户端拿不到足够的数据，也就是卡顿的现象。

客户端延迟(C延迟)：粗略计算即为客户端的缓冲区长度，假设服务器端的缓冲区可以忽略不计。一般RTMP直播播放器的缓冲区设置为0.8秒，由于网络原因，或者服务器性能问题，数据未能及时发送到客户端，就会造成客户端卡（缓冲区空），网络好时将队列中的数据全部给客户端（缓冲区变大）。

srs-bench(srs-bench/sb)：指模拟500客户端的srs-bench的平均CPU。一般模拟1000个客户端没有问题，若模拟1000个，则CPU简单除以2。

其中，“不适用”是指还未开始测试带宽，所以未记录数据。

其中，srs的三个连接是：
* FFMPEG推流连接。
* Forward给nginx RTMP流的一个连接。
* 观看连接：[播放地址](http://ossrs.net/srs.release/trunk/research/players/srs_player.html?server=192.168.2.101&port=1935&app=live&stream=livestream&vhost=192.168.2.101&autostart=true)

其中，nginx-rtmp的两个连接是：
* SRS forward RTMP的一个连接。
* 观看连接：[播放地址](http://ossrs.net/srs.release/trunk/research/players/srs_player.html?server=192.168.2.101&port=19350&app=live&stream=livestream&vhost=192.168.2.101&autostart=true)

## Benchmark SRS

开始启动srs-bench模拟客户端并发测试SRS的性能。

* 启动500客户端：

```bash
./objs/sb_rtmp_load -c 500 -r rtmp://127.0.0.1:1935/live/livestream >/dev/null &
```

* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| SRS | 9.0% | 8MB | 503 | 100Mbps | 112Mbps | 12.6% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共1000个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| SRS | 23.6% | 13MB | 1003 | 200Mbps | 239Mbps | 16.6% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共1500个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| SRS | 38.6% | 20MB | 1503 | 300Mbps | 360Mbps | 17% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共2000个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| SRS | 65.2% | 34MB | 2003 | 400Mbps | 480Mbps | 22% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共2500个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| SRS | 72.9% | 38MB | 2503 | 500Mbps | 613Mbps | 24% | 0.8秒 |

由于虚拟机能力的限制，只能测试到2500并发。

## Benchmark NginxRTMP

开始启动srs-bench模拟客户端并发测试SRS的性能。

* 启动500客户端：

```bash
./objs/sb_rtmp_load -c 500 -r rtmp://127.0.0.1:19350/live/livestream >/dev/null &
```
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| nginx-rtmp | 8.3% | 13MB | 502 | 100Mbps | 120Mbps | 16.3% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共1000个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| nginx-rtmp | 27.3% | 19MB | 1002 | 200Mbps | 240Mbps | 30% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共1500个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| nginx-rtmp | 42.3% | 25MB | 1502 | 300Mbps | 400Mbps | 31% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共2000个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| nginx-rtmp | 48.9% | 31MB | 2002 | 400Mbps | 520Mbps | 33% | 0.8秒 |

* 再启动一个模拟500个连接的srs-bench，共2500个连接。
* 客户端开始播放30秒以上，并记录数据：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| nginx-rtmp | 74.2% | 37MB | 2502 | 500Mbps | 580Mbps | 35% | 0.8秒 |

由于虚拟机能力的限制，只能测试到2500并发。

## Performance Compare

CentOS6 x86_64虚拟机，SRS和nginx-rtmp的数据对比如下：

| Server | CPU | 内存 | 连接数 | E带宽 | A带宽 | sb | C延迟 |
| ------ | -------- | ---- | ---- | ------- | ------ | ------- | -------- |
| nginx-rtmp | 8.3% | 13MB | 502 | 100Mbps | 120Mbps | 16.3% | 0.8秒 |
| SRS | 9.0% | 8MB | 503 | 100Mbps | 112Mbps | 12.6% | 0.8秒 |
| nginx-rtmp | 27.3% | 19MB | 1002 | 200Mbps | 240Mbps | 30% | 0.8秒 |
| SRS | 23.6% | 13MB | 1003 | 200Mbps | 239Mbps | 16.6% | 0.8秒 |
| nginx-rtmp | 42.3% | 25MB | 1502 | 300Mbps | 400Mbps | 31% | 0.8秒 |
| SRS | 38.6% | 20MB | 1503 | 300Mbps | 360Mbps | 17% | 0.8秒 |
| nginx-rtmp | 48.9% | 31MB | 2002 | 400Mbps | 520Mbps | 33% | 0.8秒 |
| SRS | 65.2% | 34MB | 2003 | 400Mbps | 480Mbps | 22% | 0.8秒 |
| nginx-rtmp | 74.2% | 37MB | 2502 | 500Mbps | 580Mbps | 35% | 0.8秒 |
| SRS | 72.9% | 38MB | 2503 | 500Mbps | 613Mbps | 24% | 0.8秒 |

## Performance Banchmark 4k

今天做了性能优化，默认演示流（即采集doc/source.flv文件为流）达到4k以上并发没有问题。

```
[winlin@dev6 srs]$ ./objs/srs -v
0.9.130
```

```
top - 19:52:35 up 1 day, 11:11,  8 users,  load average: 1.20, 1.05, 0.92
Tasks: 171 total,   4 running, 167 sleeping,   0 stopped,   0 zombie
Cpu0  : 26.0%us, 23.0%sy,  0.0%ni, 34.0%id,  0.3%wa,  0.0%hi, 16.7%si,  0.0%st
Cpu1  : 26.4%us, 20.4%sy,  0.0%ni, 34.1%id,  0.7%wa,  0.0%hi, 18.4%si,  0.0%st
Cpu2  : 22.5%us, 15.4%sy,  0.0%ni, 45.3%id,  1.0%wa,  0.0%hi, 15.8%si,  0.0%st
Mem:   2055440k total,  1972196k used,    83244k free,   136836k buffers
Swap:  2064376k total,     3184k used,  2061192k free,   926124k cached

  PID USER      PR  NI  VIRT  RES  SHR S %CPU %MEM    TIME+  COMMAND                                                                          
17034 root      20   0  415m 151m 2040 R 94.4  7.6  14:29.33 ./objs/srs -c console.conf                                                        
 1063 winlin    20   0  131m  68m 1336 S 17.9  3.4  54:05.77 ./objs/sb_rtmp_load -c 800 -r rtmp://127.0.0.1:1935/live/livestream               
 1011 winlin    20   0  132m  68m 1336 R 17.6  3.4  54:45.53 ./objs/sb_rtmp_load -c 800 -r rtmp://127.0.0.1:1935/live/livestream               
18736 winlin    20   0  113m  48m 1336 S 17.6  2.4   1:37.96 ./objs/sb_rtmp_load -c 800 -r rtmp://127.0.0.1:1935/live/livestream               
 1051 winlin    20   0  131m  68m 1336 S 16.9  3.4  53:25.04 ./objs/sb_rtmp_load -c 800 -r rtmp://127.0.0.1:1935/live/livestream               
18739 winlin    20   0  104m  39m 1336 R 15.6  2.0   1:25.71 ./objs/sb_rtmp_load -c 800 -r rtmp://127.0.0.1:1935/live/livestream   
```

```
[winlin@dev6 ~]$ dstat -N lo 30
----total-cpu-usage---- -dsk/total- ---net/lo-- ---paging-- ---system--
usr sys idl wai hiq siq| read  writ| recv  send|  in   out | int   csw 
  3   2  92   0   0   3|  11k   27k|   0     0 |   1B   26B|3085   443 
 32  17  33   0   0  17| 273B   60k|  69M   69M|   0     0 |4878  6652 
 34  18  32   0   0  16|   0    38k|  89M   89M|   0     0 |4591  6102 
 35  19  30   0   0  17| 137B   41k|  91M   91M|   0     0 |4682  6064 
 33  17  33   0   0  17|   0    31k|  55M   55M|   0     0 |4920  7785 
 33  18  31   0   0  17|2867B   34k|  90M   90M|   0     0 |4742  6530 
 32  18  33   0   0  17|   0    31k|  66M   66M|   0     0 |4922  7666 
 33  17  32   0   0  17| 137B   39k|  65M   65M|   0     0 |4841  7299 
 35  18  30   0   0  17|   0    28k| 100M  100M|   0     0 |4754  6752 
 32  17  33   0   0  18|   0    41k|  44M   44M|   0     0 |5130  8251 
 34  18  32   0   0  16|   0    30k| 104M  104M|   0     0 |4456  5718 
```

![SRS监控4k并发](/img/doc-advanced-guides-performance-001.png)

不过我是在虚拟机测试，物理机的实际情况还有待数据观察。

## Performance Banchmark 6k

SRS2.0.15（注意是SRS2.0，而不是SRS1.0）支持6k客户端，522kbps的流可以跑到近4Gbps带宽，单进程。参考：https://github.com/ossrs/srs/issues/194

## Performance Banchmark 7.5k

SRS2.0.30支持7.5k客户端，参考：https://github.com/ossrs/srs/issues/217

Winlin 2014.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v4/performance)


