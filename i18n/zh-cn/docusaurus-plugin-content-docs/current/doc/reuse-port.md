---
title: Reuse Port
sidebar_label: Reuse Port
hide_title: false
hide_table_of_contents: false
---

# Reuse Port

可以在不同场景下使用REUSE PORT，实现用一个端口对外服务。

## For Edge Server

SRS2的性能有大幅的提升，参考[SRS2性能](https://github.com/ossrs/srs/tree/2.0release#performance)。SRS3我们支持了源站集群，
解决了源站的性能瓶颈，参考[OriginCluster](./sample-origin-cluster.md)；对于边缘服务器，我们提供了TCP代理方案，
参考[go-oryx](https://github.com/ossrs/go-oryx)；对于边缘服务器，我们还可以支持SO_REUSEPORT，可以在服务器上启动多个Edge进程。

![](/img/doc-guides-reuse-port-001.png)

> 注意：SO_REUSEPORT功能需要Linux Kernel 3.9+，所以如果使用CentOS6你可能需要升级你的内核，推荐使用CentOS7。

首先，我们启动一个边缘服务器，侦听在1935：

```
./objs/srs -c conf/edge.conf
```

然后，在同一个服务器，再启动一个边缘服务器，也侦听在1935：

```
./objs/srs -c conf/edge2.conf
```

> 注意：当然这两个边缘服务器的pid文件路径要不同，否则会启动失败。

这样就启动了两个进程，都侦听在1935：

```
[root@bf2e88b31f9b trunk]# ps aux|grep srs
root       381  0.1  0.0  19888  5752 pts/2    S+   08:03   0:01 ./objs/srs -c conf/edge.conf
root       383  0.0  0.0  19204  5468 pts/1    S+   08:04   0:00 ./objs/srs -c conf/edge2.conf

[root@bf2e88b31f9b trunk]# lsof -p 381
srs     381 root    7u     IPv6  18835      0t0        TCP *:macromedia-fcs (LISTEN)
[root@bf2e88b31f9b trunk]# lsof -p 383
srs     383 root    7u     IPv6  17831      0t0        TCP *:macromedia-fcs (LISTEN)
```

接着，启动源站服务器，这两个边缘服务器从这个源站服务器取流：

```
./objs/srs -c conf/origin.conf 
```

最后，我们可以推流到源站或边缘，从任意边缘服务器拉流播放：

```
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

使用VLC播放RTMP流： `rtmp://192.168.1.170:1935/live/livestream`

## For Origin Server

Origin也可以使用REUSE PORT，此时多个Origin进程之间是独立的，如果输出是HLS，那么这种方式完全没问题：

```
              +-----------------+
Client --->-- + Origin Servers  +------> Player
              +-----------------+
```

> Note: 如果需要支持输出RTMP或FLV等流协议，那么需要使用[OriginCluster](./sample-origin-cluster.md)。

启动第一个源站，侦听在`1935`和`8080`，输入RTMP流，输出HLS流：

```bash
./objs/srs -c conf/origin.hls.only1.conf
```

启动第二个源站，同样侦听在`1935`和`8080`，输入RTMP流，输出HLS流：

```bash
./objs/srs -c conf/origin.hls.only2.conf
```

推第一个流到服务器，会随机选择一个源站：

```bash
./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream1
```

推第二个流到服务器，会随机选择一个源站：

```bash
./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv -c copy -f flv rtmp://localhost/live/livestream2
```

> Note: 由于切片成HLS，所以只要流不同，这两个源站独立工作，是没有问题的。但是如果是输出FLV，可能就会出现找不到流的情况，这时就不能使用这种方式，需要使用[OriginCluster](./sample-origin-cluster.md)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/reuse-port)


