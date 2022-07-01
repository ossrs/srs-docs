---
slug: coroutine-native-srt
title: SRS5第一大炮：如何实现SRT协程化
authors: []
tags: [tutorial, video, srt, streaming]
custom_edit_url: null
---

# Coroutine Native SRT

> Written by [Winlin](https://github.com/winlinvip), [John](https://github.com/xiaozhihong)

协程是现代服务器的核心技术，能极大简化逻辑和提升维护性；SRT是逐渐在取代RTMP推流的新协议，但它有自己的IO框架；只有实现了SRT的协程化，才能成为SRS的核心的成熟的协议，这是SRS5迈出的第一步，也是至关重要的一步。

<!--truncate-->

SRS 5.0从2022年初启动以来，经过摸索和探讨，确定了以媒体网关作为核心方向，详细请看[SRS 5.0核心问题定义和解法](https://mp.weixin.qq.com/s/Rq3NuZKdMr2_Dmiki72RFw)。

其中，SRT作为主播推流领域广泛采用的协议，也是浏览器肯定不会支持的协议，这恰恰是媒体网关的核心能力，想象下如果可以通过媒体网关将SRT转成WebRTC后，我们可以直接用网页预览SRT的流，我们可以实现广播领域真正的超低延迟方案，我们可以把SRT强大的跨国传输能力用起来。

而这些美好愿景的基础，就是这次要介绍的：改造SRT为协程化(Coroutine Native SRT)。这是SRS 5.0至关重要的一步，也是具备深远影响的一步，详细代码请参考[PR#3010](https://github.com/ossrs/srs/pull/3010)。

我们先了解下详细的背景介绍。

## Introduction

在直播推流领域，RTMP是事实上的工业标准，广泛使用，也是直播源站之间兼容性最好的协议。

随着场景的丰富和直播的发展， 几个比较严重的问题逐渐暴露出来：

1. TCP推流在长距离传输下，受丢包以及RTT抖动影响非常大，效果很差。
1. RTMP协议不支持多音轨，以及H265、AV1等一系列新的编解码。
1. Adobe已经放弃RTMP协议，很多年没有更新了，未来也不会更新。

为了解决这些问题，2018年左右，广播电视领域开始广泛应用SRT协议推流，越来越多的推流设备和平台都支持了SRT协议。

SRS在2019年底，SRS 4.0支持了SRT推流，目前存在以下的问题：

1. SRT在SRS上使用多线程+异步实现，某些异常导致的程序Crash，难以排查。
1. SRT在SRS实现是异步方式，代码复杂，维护难度高。
1. HTTP回调，SRT播放不生效；SRT推流依赖转RTMP后，RTMP触发的回调。
1. SRT无法直接转WebRTC，而是先转RTMP再转WebRTC，导致延迟高。

这些问题的核心原因，是由于SRT使用了独立的异步IO和多线程，无法和SRS已有的ST协程结合起来。

要彻底解决这个问题，必须将SRT协程化，和SRS使用同一套ST协程框架。SRS 5.0已经完成，详细代码请参考[PR#3010](https://github.com/ossrs/srs/pull/3010)，这是非常重要的一个功能。

在介绍SRT协程化之前，先介绍下什么是协程化，我们看下ST的TCP协程化(Coroutine Native)，这是最好的例子。

## Coroutine Native TCP

首先，非协程化的代码，也就是epoll驱动的异步代码，大概逻辑是这样：

```cpp
int fd = accept(listen_fd); // Got a TCP connection.

int n = read(fd, buf, sizeof(buf));
if (n == -1) {
  if (errno == EAGAIN) { // Not ready
    return epoll_ctl(fd, EPOLLIN); // Wait for fd to be ready.
  }
  return n; // Error.
}

printf("Got %d size of data %p", n, buf);
```

> Note: 为了方便表达关键逻辑，我们使用示意代码，线上代码可以参考epoll的示例代码。

一般read是业务逻辑，读出来的数据也是业务数据，但是这里却需要在EAGAIN时调用epoll这个底层框架处理fd。这就是把底层逻辑和业务逻辑混合在一起，导致难以维护。

> Note: 尽管NGINX包装了一层框架，但是本质上并不能解决这个异步回调问题，当fd没有准备好必须返回当前函数，所以导致很多状态需要保障和恢复，在复杂的逻辑中状态机也变得非常复杂。

下面我们看协程化的逻辑会是怎样的，同样以上面代码为例：

```cpp
st_netfd_t fd = st_accept(listen_fd); // Got a TCP connection

int n = st_read(fd, buf, sizeof(buf));
if (n == -1) {
    return n; // Error.
}

printf("Got %d size of data %p", n, buf);
```

简单的看，就是没有EAGAIN，看起来要么读取到了数据，要么就是出现了错误，不会出现fd没有准备好的情况。这就给整个业务逻辑带来了非常好的体验，因为不需要保存状态了，不会反复的尝试读取。

同样用epoll，为何`st_read`就没有EAGAIN呢？这就是协程化，不是没有，只是在底下处理了这个事件。我们看`st_readv`这个函数：

```cpp
ssize_t st_read(_st_netfd_t *fd, void *buf, size_t nbyte) {
    while ((n = read(fd->osfd, buf, nbyte)) < 0) {
        if (errno == EINTR)
            continue;
        if (!_IO_NOT_READY_ERROR) // Error, if not EAGAIN.
            return -1;

        /* Wait until the socket becomes readable */
        if (st_netfd_poll(fd, POLLIN) < 0) // EAGAIN
            return -1;
    }
    
    return n;
}
```

很明显在`EAGAIN`时，会调用`st_netfd_poll`。在`st_netfd_poll`函数里，会将当前协程切换出让，调度线程执行下一个协程。并且在未来某个时刻，会因为IO事件到达或者超时错误，而将当前协程恢复。

> Note: 由于协程切换和恢复，都是在这个函数中实现的，对于上层调用的代码，看起来没有发生什么，所以就不仅没有EAGAIN这个错误消息，也不会返回上一层函数，当然也不需要保存状态和恢复状态。

我们可以总结下，如何协程化任何协议的思路：

1. 直接对API进行一次调用，如果成功，那么直接返回。
1. 如果API返回失败，检查错误，非IO等待的错误直接返回。
1. 将当前协程出让，调度器运行其他协程，直到该FD上的事件返回或者超时；如果超时，则返回错误；如果事件到达，则重复上面的步骤。

我们可以按照这个思路将SRT进行协程化(Coroutine Native)。

## Coroutine Native SRT

我们以`srt_recvmsg`函数的协程化为例，这个函数类似TCP的`read`函数，定义如下：

```cpp
SRT_API int srt_recvmsg (SRTSOCKET u, char* buf, int len);
```

我们同样，提供一个`SrsSrtSocket::recvmsg`的函数，类似`st_read`函数，实现如下：

```cpp
srs_error_t SrsSrtSocket::recvmsg(void* buf, size_t size, ssize_t* nread) {
  while (true) {
    int ret = srt_recvmsg(srt_fd_, (char*)buf, size);
    if (ret >= 0) { // Receive message ok.
      recv_bytes_ += ret; 
      *nread = ret;
      return err;
    }
    
    // Got something error, return immediately.
    if (srt_getlasterror(NULL) != SRT_EASYNCRCV) {
      return srs_error_new(ERROR_SRT_IO, "srt_recvmsg");
    }
    
    // Wait for the fd ready or error, switch to other coroutines.
    if ((err = wait_readable()) != srs_success) { // EAGAIN.
      return srs_error_wrap(err, "wait readable");
    }
  }
  
  return err;
}
```

可以看到和`st_read`非常类似，在`wait_readable`中也会实现协程的切换和恢复，只是我们使用`st_cond_t`条件变量来实现：

```cpp
srs_error_t SrsSrtSocket::wait_readable() {
  srt_poller_->mod_socket(this, SRT_EPOLL_IN);
  srs_cond_timedwait(read_cond_);
}
```

> Note: 这里先修改了epoll侦听的事件`SRT_EPOLL_IN`，等待fd可读后，再等待条件变量触发。

而触发这个条件变量的函数，是在`SrsSrtPoller::wait`，实现如下：

```cpp
srs_error_t SrsSrtPoller::wait(int timeout_ms, int* pn_fds) {
  int ret = srt_epoll_uwait(srt_epoller_fd_, events_.data(), events_.size());
  for (int i = 0; i < ret; ++i) {
    if (event.events & SRT_EPOLL_IN) {
      srt_skt->notify_readable();
    }
  }
}

void SrsSrtSocket::notify_readable() {
  srs_cond_signal(read_cond_);
}
```

这样就完全做到了将SRT API协程化，其他的API比如srt_sendmsg, srt_connnect, srt_accept也是类似的操作。

下面我们对比下，协程化(Coroutine Native)之后，和原始的回调(Callback)的区别。

## Coroutine Native PK Callback

将SRT 协程化以后， 业务逻辑和底层代码分离，上层的代码逻辑清晰明了。

先看看accept这个逻辑，之前也是由epoll触发的事件处理，创建`srt_conn`这个数据结构：

```cpp
while (run_flag) {
  int ret = srt_epoll_wait(_pollid, read_fds, &rfd_num, write_fds);
  for (int index = 0; index < rfd_num; index++) {
    SRT_SOCKSTATUS status = srt_getsockstate(read_fds[index]);
    srt_handle_connection(status, read_fds[index], "read fd");
  }
}

void srt_server::srt_handle_connection(SRT_SOCKSTATUS status, SRTSOCKET input_fd) {
  if (status == SRTS_LISTENING) {
    conn_fd = srt_accept(input_fd, (sockaddr*)&scl, &sclen);
    _handle_ptr->add_newconn(conn_fd, SRT_EPOLL_IN);
  }
}

void srt_handle::add_newconn(SRT_CONN_PTR conn_ptr, int events) {
    _push_conn_map.insert(std::make_pair(conn_ptr->get_path(), conn_ptr));
    _conn_map.insert(std::make_pair(conn_ptr->get_conn(), conn_ptr));
    int ret = srt_epoll_add_usock(_handle_pollid, conn_ptr->get_conn(), &events);
}
```

> Note: 创建的`srt_conn`本身就是保存在全局数据结构之中，在后续的回调事件中持续修改和变更这个数据结构。

我们对比下协程化之后的业务逻辑，收到会话之后启动处理协程：

```cpp
srs_error_t SrsSrtListener::cycle() {
  while (true) {
    srs_srt_t client_srt_fd = srs_srt_socket_invalid();
    srt_skt_->accept(&client_srt_fd);
    
    srt_server_->accept_srt_client(srt_fd);
  }
}

srs_error_t SrsSrtServer::accept_srt_client(srs_srt_t srt_fd) {
  fd_to_resource(srt_fd, &srt_conn);
  conn_manager_->add(srt_conn);
  srt_conn->start();
}
```

> Note: 虽然有全局变量维护`srt_conn`，但这里不会关注到epoll的处理，而是由协程主导的执行逻辑，而不是由回调主导的逻辑。

回调主导的逻辑，维护和了解代码时，必须要从epoll回调事件开始看，而且不同事件都在修改`srt_conn`这个对象的状态，要了解对象生命周期是很有难度的。而协程主导的逻辑，它的生命周期是在协程中，收到`srt_conn`就启动协程处理它，后续的读写也在协程中。

我们继续看`srt_conn`的读处理逻辑，之前直接使用原生SRT的read函数，同样是由epoll的事件触发回调：

```cpp
while (run_flag) {
  int ret = srt_epoll_wait(_pollid, read_fds, &rfd_num, write_fds);
  for (int index = 0; index < rfd_num; index++) {
    SRT_SOCKSTATUS status = srt_getsockstate(read_fds[index]);
    srt_handle_data(status, read_fds[index], "read fd");
  }
}

void srt_handle::handle_srt_socket(SRT_SOCKSTATUS status, SRTSOCKET conn_fd) {
  auto conn_ptr = get_srt_conn(conn_fd);
  int mode = conn_ptr->get_mode();
  if (mode == PUSH_SRT_MODE && status == SRTS_CONNECTED) {
    handle_push_data(status, path, subpath, conn_fd);
  }
}

void srt_handle::handle_push_data(SRT_SOCKSTATUS status, SRTSOCKET conn_fd) {
  srt_conn_ptr = get_srt_conn(conn_fd);
  if (status != SRTS_CONNECTED) { // Error.
    close_push_conn(conn_fd);
    return;
  }

  ret = srt_conn_ptr->read(data, DEF_DATA_SIZE);
  if (ret <= 0) { // Error.
    close_push_conn(conn_fd);
    return;
  }

  srt2rtmp::get_instance()->insert_data_message(data, ret, subpath);
}
```

> Note: 在回调中我们需要处理各种状态，而这个`srt_conn`的状态变化，是由各种回调决定的，很难一次了解到这个会话的主要处理逻辑。

我们看看SRT协程化之后，这个业务逻辑是怎样写的：

```cpp
srs_error_t SrsMpegtsSrtConn::do_publishing() {
  while (true) {
    ssize_t nb = 0;
    if ((err = srt_conn_->read(buf, sizeof(buf), &nb)) != srs_success) {
      return srs_error_wrap(err, "srt: recvmsg");
    }
    
    if ((err = on_srt_packet(buf, nb)) != srs_success) {
      return srs_error_wrap(err, "srt: process packet");
    }
  }
}
```

> Note: 这里Conn的生命周期非常明确，它的状态就是直接在这里返回错误，对于这个会话来说，这就是它的主循环，不会因为`read`而导致进入SRT的epoll大循环，我们在维护时也不用关注这个异步事件触发和处理。

再次强调一次，维护代码时，我们需要了解的信息量是非常不同的。在基于异步回调的逻辑中，我们在回调函数中，是需要关注目前对象有哪些状态，修改了哪些状态，其他异步事件又有哪些影响。而基于协程的逻辑中，没有这些状态，协程的创建和执行，就是线性的，或者说这些状态就是在协程的函数调用中。

> Note: 为何异步回调的状态就不能在函数调用中呢？因为异步回调的堆栈中不能保存`srt_conn`的状态，它本质上就是一个协程，保存的是epoll的循环的状态。而协程是根据每个`srt_conn`所创建的，它的堆栈中保存的都是这个对应的`srt_conn`的状态。

这本质上，是由于异步回调的状态，只能保存在全局数据结构之中。而协程的状态，是可以保存在各个局部变量之中，每个函数的局部变量，都是这个协程所独有的，协程没有结束前都可以使用。

## What is the Next

SRS虽然完成了SRT协程化，并没有解决所有的问题。后续的计划包括：

1. SRT直接转WebRTC，低延迟直播的另外一种方式。
1. 某些服务器之间的长链路可以将TCP替换为SRT传输， 比如跨国的RTMP 转发。
1. SRT工具链的完善，比如[srs-bench](https://github.com/ossrs/srs-bench)，支持压测SRT流。

欢迎加入SRS开源社区，一起做好一个流媒体服务器，让全世界都来白嫖。

## One More Thing

有些朋友也很好奇，真正商用的视频云的SRT，和开源的SRT的服务器，有什么区别，都做过哪些优化。

> Note: 由于开源服务器侧重标准协议和兼容性，有些优化并不适合，所以在云计算的商业化服务器中，和开源的版本中，一定是存在很大差异的。就算是Linux，其实云计算的Linux，和开源的Linux内核，也有很大的差异。

腾讯云在实战中积累很多经验，请参考之前分享的文章：

* [技术解码 | 腾讯视频云直播推流再升级，支持多路径传输](https://mp.weixin.qq.com/s/UTYkqFaprGnqw37FgPDYzw)
* [毫秒级跨洋传输延迟，腾讯云音视频连续6年保障英雄联盟总决赛直播](https://mp.weixin.qq.com/s/Zcuwk-wlisZzthZB_ucCxg)
* [技术解码 | 斗鱼同款的SRT技术是如何对抗推流抖动的？](https://mp.weixin.qq.com/s/YaqLzafUQ5MSGA1ulEb3VQ)
* [技术解码 | SRT和RIST协议综述](https://mp.weixin.qq.com/s/60GagRTvLGpKzBWRF2ucfA)

其中，最为严重的是SRT重传率过高、限带宽下表现不如tcp/quic等，腾讯云针对这些问题，做了几个优化：

1. SRT重传乱序度自适应：当接收到乱序报文，首次发起重传时，会根据当前的乱序度，等待N个包之后才发起重传。原生SRT这个乱序度是固定值，我们修改成为根据网络乱序情况自适应。
1. SRT传输参数优化：通过对参数优化，减少了一半的重传率。
1. 加入了BBR拥塞控制算法：原生SRT拥塞控制非常弱，评估的带宽波动也非常大。我们加入了BBR拥塞控制算法，针对性的解决了这个问题。
1. 强化了SRT多链路传输，增加了带宽聚合的模式：原生SRT只有backup，broadcast两种多链路传输模式，我们针对直播场景增加了auto模式，能够做到讲多个网卡的带宽聚合后进行直播，并智能动态选择链路。

> Note: 腾讯云音视频在音视频领域已有超过21年的技术积累，持续支持国内90%的音视频客户实现云上创新，独家具备 RT-ONE™ 全球网络，在此基础上，构建了业界最完整的 PaaS 产品家族，并通过腾讯云视立方 RT-Cube™ 提供All in One 的终端SDK，助力客户一键获取众多腾讯云音视频能力。腾讯云音视频为全真互联时代，提供坚实的数字化助力。
