---
title: GPERF
sidebar_label: GPERF
hide_title: false
hide_table_of_contents: false
---

# GPERF内存和性能分析

本文只描述了GPERF工具的用法，关于完整的性能分析方法，参考 [SRS性能(CPU)、内存优化工具用法](https://www.jianshu.com/p/6d4a89359352) 或 [CSDN](https://winlin.blog.csdn.net/article/details/53503869)

valgrind一个很好用的内存和CPU分析工具，SRS已经支持。

[gperf/gperftools](https://github.com/gperftools/gperftools) 是google用作内存和CPU分析的工具，基于tcmalloc（也是google内存分配库，替换glibc的malloc和free）。好消息是gperf可以用作srs的内存和性能分析。

gperf主要有三个应用：
* gmc: gperf memory check, 内存检查（泄漏，错误等），参考：[heap_checker](https://gperftools.github.io/gperftools/heap_checker.html)
* gmp: gperf memory profile, 内存性能分析（哪个函数内存分配多），参考：[heapprofile](https://gperftools.github.io/gperftools/heapprofile.html)
* gcp: gperf cpu profile, CPU性能分析（函数消耗CPU多），参考：[cpuprofile](https://gperftools.github.io/gperftools/cpuprofile.html)

## gmc内存检查

> SRS有例子说明如何集成和调用gmc，参考：[research/gperftools/heap-checker](https://github.com/ossrs/srs/tree/4.0release/trunk/research/gperftools/heap-checker)

> 本文只描述了GPERF工具的用法，关于完整的性能分析方法，参考 [SRS性能(CPU)、内存优化工具用法](https://www.jianshu.com/p/6d4a89359352) 或 [CSDN](https://winlin.blog.csdn.net/article/details/53503869)

使用gmc时，需要将tcmalloc编译进去（或者动态链接），具体参考官方文档。除此之外，必须设置环境变量，gmc才被开启。

SRS开启gmc的方法是：
* 配置时加上gmc：`./configure --with-gperf --with-gmc`
* 编译srs：`make`
* 启动时指定环境变量：`env PPROF_PATH=./objs/pprof HEAPCHECK=normal ./objs/srs -c conf/console.conf`
* 停止srs，打印gmc结果：`CTRL+C` 或者发送SIGINT信号给SRS

备注：make编译SRS成功后，会打印出这些操作命令。

注意：必须导出pprof环境变量`PPROF_PATH`，否则函数的地址和符合对应不上

若能打印下面的信息，说明gmc成功启动：

```bash
[winlin@dev6 srs]$ env PPROF_PATH=./objs/pprof HEAPCHECK=normal ./objs/srs -c conf/console.conf
WARNING: Perftools heap leak checker is active -- Performance may suffer
```

gmc的结果：

```bash
Leak check _main_ detected leaks of 184 bytes in 4 objects
The 4 largest leaks:
Using local file ./objs/srs.
Leak of 56 bytes in 1 objects allocated from:
	@ 46fae8 _st_stack_new
	@ 46f6b1 st_thread_create
	@ 46ea65 st_init
	@ 433f41 SrsServer::initialize
	@ 46e4ca main
	@ 3855a1ec5d __libc_start_main
```

有的时候gmc显示符号有问题，无法显示函数，那么就直接运行pprof，gmc会有提示，譬如：
```
pprof ./objs/srs "/tmp/srs.11469._main_-end.heap" --inuse_objects --lines --heapcheck  --edgefraction=1e-10 --nodefraction=1e-10 --gv
```

需要改动两个地方：

1. pprof改成`./objs/pprof`。
1. 去掉--gv，直接进入命令行，然后输入top就可以看到。

结果如下：

```
[winlin@centos6 srs]$ ./objs/pprof ./objs/srs "/tmp/srs.11469._main_-end.heap" --inuse_objects --lines --heapcheck  --edgefraction=1e-10 --nodefraction=1e-10
Using local file ./objs/srs.
Using local file /tmp/srs.11469._main_-end.heap.
Welcome to pprof!  For help, type 'help'.
(pprof) top
Total: 9 objects
       3  33.3%  33.3%        3  33.3% _st_netfd_new /home/winlin/srs/objs/st-1.9/io.c:136
       3  33.3%  66.7%        3  33.3% _st_stack_new /home/winlin/srs/objs/st-1.9/stk.c:78
       2  22.2%  88.9%        2  22.2% st_cond_new /home/winlin/srs/objs/st-1.9/sync.c:158
       1  11.1% 100.0%        1  11.1% SrsPithyPrint::create_ingester /home/winlin/srs/src/app/srs_app_pithy_print.cpp:139
       0   0.0% 100.0%        4  44.4% SrsAsyncCallWorker::start /home/winlin/srs/src/app/srs_app_async_call.cpp:70
       0   0.0% 100.0%        4  44.4% SrsConnection::cycle /home/winlin/srs/src/app/srs_app_conn.cpp:88
       0   0.0% 100.0%        2  22.2% SrsDvr::initialize /home/winlin/srs/src/app/srs_app_dvr.cpp:980
       0   0.0% 100.0%        2  22.2% SrsDvrPlan::initialize /home/winlin/srs/src/app/srs_app_dvr.cpp:570
       0   0.0% 100.0%        2  22.2% SrsHls::initialize /home/winlin/srs/src/app/srs_app_hls.cpp:1214
       0   0.0% 100.0%        2  22.2% SrsHlsMuxer::initialize /home/winlin/srs/src/app/srs_app_hls.cpp:370
```

## GMP内存性能

> SRS有例子说明如何集成和调用gmc，参考：[research/gperftools/heap-profiler](https://github.com/ossrs/srs/tree/4.0release/trunk/research/gperftools/heap-profiler)

> 本文只描述了GPERF工具的用法，关于完整的性能分析方法，参考 [SRS性能(CPU)、内存优化工具用法](https://www.jianshu.com/p/6d4a89359352) 或 [CSDN](https://winlin.blog.csdn.net/article/details/53503869)

使用gmc时，需要将tcmalloc编译进去（或者动态链接），具体参考官方文档。

SRS开启gmp的方法是：
* 配置时加上gmc：`./configure --with-gperf --with-gmp`
* 编译srs：`make`
* 正常启动srs就开始内存性能分析：`rm -f gperf.srs.gmp*; ./objs/srs -c conf/console.conf`
* 停止srs，生成gmp分析文件：`CTRL+C` 或者发送SIGINT信号给SRS
* 分析gmp文件：`./objs/pprof --text objs/srs gperf.srs.gmp*`

备注：make编译SRS成功后，会打印出这些操作命令。

若能打印下面的信息，则表示成功启动gmp：

```bash
[winlin@dev6 srs]$ ./objs/srs -c conf/console.conf
Starting tracking the heap
```

内存性能分析的结果如下：

```bash
[winlin@dev6 srs]$ ./objs/pprof --text objs/srs gperf.srs.gmp*
Using local file objs/srs.
Using local file gperf.srs.gmp.0001.heap.
Total: 0.1 MB
     0.0  31.5%  31.5%      0.0  49.1% SrsConfDirective::parse_conf
     0.0  28.4%  59.9%      0.0  28.4% std::basic_string::_Rep::_S_create
     0.0  27.4%  87.3%      0.0  27.4% _st_epoll_init
     0.0  11.7%  99.0%      0.0  11.7% __gnu_cxx::new_allocator::allocate
     0.0   0.4%  99.5%      0.0  27.9% st_init
```

## GCP-CPU性能分析

> SRS有例子说明如何集成和调用gmc，参考：[research/gperftools/cpu-profiler](https://github.com/ossrs/srs/tree/4.0release/trunk/research/gperftools/cpu-profiler)

> 本文只描述了GPERF工具的用法，关于完整的性能分析方法，参考 [SRS性能(CPU)、内存优化工具用法](https://www.jianshu.com/p/6d4a89359352) 或 [CSDN](https://winlin.blog.csdn.net/article/details/53503869)

使用gcp时，需要将tcmalloc编译进去（或者动态链接），具体参考官方文档。

SRS开启gcp的方法是：
* 配置时加上gmc：`./configure --with-gperf --with-gcp`
* 编译srs：`make`
* 正常启动srs就开始内存性能分析：`rm -f gperf.srs.gcp*; ./objs/srs -c conf/console.conf`
* 停止srs，生成gmc分析文件：`CTRL+C` 或者发送SIGINT信号给SRS
* 分析gcp文件：`./objs/pprof --text objs/srs gperf.srs.gcp*`

备注：make编译SRS成功后，会打印出这些操作命令。

性能分析的结果如下：

```bash
[winlin@dev6 srs]$ ./objs/pprof --text objs/srs gperf.srs.gcp*
Using local file objs/srs.
Using local file gperf.srs.gcp.
Removing _L_unlock_16 from all stack traces.
Total: 20 samples
       8  40.0%  40.0%        8  40.0% 0x00007fff0ea35917
       4  20.0%  60.0%        4  20.0% __epoll_wait_nocancel
       2  10.0%  70.0%        2  10.0% __read_nocancel
       1   5.0%  95.0%        1   5.0% memset
       1   5.0% 100.0%        1   5.0% tc_delete
       0   0.0% 100.0%        5  25.0% 0x00007f9fad927c4f
       0   0.0% 100.0%        2  10.0% SrsBuffer::ensure_buffer_bytes
       0   0.0% 100.0%        5  25.0% SrsClient::do_cycle
       0   0.0% 100.0%        5  25.0% SrsClient::fmle_publish
       0   0.0% 100.0%        1   5.0% SrsClient::process_publish_message
```

## 同时使用

可以同时开启：
* gmc和gmp：不支持同时开启。它们使用同一个框架，无法一起运行；参考文档的说明。
* gmc和gcp：支持同时开启。检测内存泄漏和测试CPU性能瓶颈。
* gmp和gcp：支持同时开启。检测内存瓶颈和CPU性能瓶颈。

备注：SRS的configure脚本会检查是否可以同时开启。

Winlin 2014.3
![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-4/doc/gperf)


