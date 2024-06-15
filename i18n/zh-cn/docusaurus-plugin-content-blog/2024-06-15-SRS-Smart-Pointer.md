---
slug: smart-pointer
title: SRS - 使用Smart Pointers解决内存泄露问题
authors: []
tags: [srs, memory, smart-pointer]
custom_edit_url: null
---

# Fix Memory Leaks with Smart Pointers

8年后，我们使用自己实现的有限的简单Smart Pointers，解决了SRS的内存泄漏问题，保持项目的可维护性。

## Introduction

每个流在SRS服务器上有个Source对象，用于管理流的生命周期。为了逻辑和代码简单，SRS一直没有释放Source对象；在流特别多的情况下，
比如不断更换推流的地址，会导致内存不断增长和泄露。

<!--truncate-->

之前绕过这个问题的办法，就是半夜三更重启服务。SRS支持[Gracefully Quit](https://github.com/ossrs/srs/issues/1579#issuecomment-587414898)，
会在没有连接时重启服务，但是这个方法并没有彻底解决这个问题。

为了解决这个问题，我们引入了Smart Pointer，用于管理Source对象的生命周期。我们并没有使用C++ 11，因为SRS需要支持在各种不同的环境编译。
相反，我们实现了一个简化版本的Smart Pointer，只支持了部分功能。

## Design

在处理这个问题之前，我们需要改进 SRS 的 shared ptr，它用于 RTMP 共享消息、GB 会话以及未来的源对象。

参考 [使用 C++11 的智能指针](https://public.websites.umich.edu/~eecs381/handouts/C++11_smart_ptrs.pdf)，
智能指针有三种类型：

* Shared ptr：类似于用于 RTMP 消息的 `SrsSharedPtrMessage` 和用于 GB28181 的 `SrsLazyObjectWrapper`。
* Weak ptr：在 SRS 5.0 版本之前没有这种指针。我们可以通过消除任何指针的循环引用来避免这种情况。
* Unique ptr：对应的指针是 `SrsAutoFree`，它在本地范围内释放指针。

如果我们仔细设计并限制智能指针的使用，例如没有循环链接，这意味着我们不需要 weak ptr，我们可以为 SRS 实现一个简单且易于维护的智能指针。
我们还考虑以下特性：

* 继承：不要在智能指针中使用继承，尽管我们可以编写正确的代码，但讨论起来很复杂。
* 比较：不支持比较智能指针，因为我们只需要自动管理内存。
* make_shared：不支持这个辅助函数，因为我们不考虑通过 new 操作符的性能问题。
* shared_from_this：不支持这个辅助模板，因为我们不需要这个特性。
* make_unique：不支持这个，因为我们允许裸 new 操作符，并且需要仔细的代码审查。

我们不想切换到 C++11，因为我认为现代的 C++ 11/14/17/20 实在是糟糕的东西，没有解决任何问题，反而引入了很多糟糕的语法糖。
我们不需要任何语法糖，这对交流非常有害。我们经历了很多智能指针和语法糖的灾难，所以我们希望保持使用非常简单：

1. 无语法糖：没有 weak ptr，没有 make shared，没有 make unique，没有继承，没有比较，没有循环引用，没有 C++11/14/17/20/22 等等。
2. 如果确实需要任何 API，请遵循 C++ 标准 API，不要发明新的轮子，不要有新的函数和名称。
3. 仔细的代码审查，程序员应该对代码和内存问题负责。

另一方面，我们不应该重新发明轮子，特别是对于智能指针，所以我们必须使用几乎相同的 C++ 标准库 API。这就是为什么我们应该学习
C++11 并重构 SRS 中类似的智能指针。

智能指针在仅涉及内存管理时可能看起来很简单，但当你深入到继承、复制、比较、性能、循环引用、指针转换、创建以及 "no naked new" 的纯粹主义时，
它们的功能变得显著丰富。实际上，C++ 程序的主要问题源于程序员的胡搞乱搞，而这种纯粹主义和各种语法糖使得在公司中很难注意到这些问题，
大量代码被提交，使用各种新特性，并且时间紧迫。

C++ 的真正地狱之门不是 C 的有限旧特性，而是它大量的新特性。

## Shared Ptr

我们实现了一个简单的Shared Ptr，支持了引用计数和自动释放，参考 [#6834ec2](https://github.com/ossrs/srs/commit/6834ec208d67fa47c21536d1f1041bb6d60c1834)

```cpp
template<class T>
class SrsSharedPtr
{
private:
    // The pointer to the object.
    T* ptr_;
    // The reference count of the object.
    uint32_t* ref_count_;
```

使用时，和std::shared_ptr差不多，不过支持的接口更少：

```cpp
SrsSharedPtr<MyClass> ptr(new MyClass());
ptr->do_something();

SrsSharedPtr<MyClass> cp = ptr;
cp->do_something();
```

实际上还涉及到一些拷贝构造、赋值和移动构造，以及一些操作符重载，详细可以参考代码和utest的例子，总体上讲这部分是比较简单的实现。

## Shared Resource

除了Shared Ptr智能指针，我们还支持了Shared Resource，主要实现了ISrsResource接口，可以被ResourceManager释放，
参考 [#6834ec2](https://github.com/ossrs/srs/commit/6834ec208d67fa47c21536d1f1041bb6d60c1834)

```cpp
template<typename T>
class SrsSharedResource : public ISrsResource
{
private:
    SrsSharedPtr<T> ptr_;
```

实际上，Shared Resource和Shared Ptr拥有完全一样的接口，不过我们没有使用继承，而是组合的方式。使用起来和Shared Ptr也是一样，
不过可以使用Manager管理它：

```cpp
SrsSharedResource<MyClass>* ptr = new SrsSharedResource<MyClass>(new MyClass());
(*ptr)->do_something();

ISrsResourceManager* manager = ...;
manager->remove(ptr);
```

在实际的应用场景中，往往Resource是由一个coroutine管理，比如GB SIP连接，会启动一个独立的coroutine服务这个连接。类似的还有GB 
Media连接，GB Session会话，RTC TCP连接等。我们创建了一个Executor实现这个通用逻辑：

```cpp
SrsExecutorCoroutine::SrsExecutorCoroutine(ISrsResourceManager* m, ISrsResource* r)
{
    resource_ = r;
    manager_ = m;
    trd_ = new SrsSTCoroutine("ar", this, resource_->get_id());
}

SrsExecutorCoroutine::~SrsExecutorCoroutine()
{
    manager_->remove(resource_);
    srs_freep(trd_);
}

srs_error_t SrsExecutorCoroutine::cycle()
{
    srs_error_t err = handler_->cycle();
    manager_->remove(this);
    return err;
}
```

因此我们可以很方便的使用Executor管理这类Resource：

```cpp
SrsGbSipTcpConn* raw_conn = new SrsGbSipTcpConn();
SrsSharedResource<SrsGbSipTcpConn>* conn = new SrsSharedResource<SrsGbSipTcpConn>(raw_conn);
SrsExecutorCoroutine* executor = new SrsExecutorCoroutine(_srs_gb_manager, conn, raw_conn, raw_conn);
if ((err = executor->start()) != srs_success) {
    srs_freep(executor);
    return srs_error_wrap(err, "gb sip");
}
```

值得强调的是，Execuctor和Smart Ptr本身没有关联，只是为了解决一类通用的场景而设计的机制。否则多个地方都需要实现重复的逻辑，
相反会更复杂。此外，由于Executor引用的是ISrsResource，因此我们使用Resource Ptr指针对象，而不是直接使用Shared Ptr指针。

## GB28181

GB28181的SIP和Media是两个独立的协议，也是两个独立的传输通道，因此涉及到对象的独立生命周期和引用和管理，参考 [#4080](https://github.com/ossrs/srs/pull/4080)
的说明，如下图所示：

![](/img/blog-2024-06-15-01.png)

SIPTcpConn就是GB的SIP对象，一般侦听的是TCP 5060端口，负责设备注册和信息收集。MediaTcpConn是GB的媒体传输对象，传输的是PS流。
GB Session是由SIPTcpConn或MediaTcpConn对象创建，管理GB会话。

实际上，Session、SIPTcpConn、MediaTcpConn都是Shared Resource管理的对象。Session使用Shared Resource引用SIPTcpConn和MediaTcpConn。
但是SIPTcpConn和MediaTcpConn引用的是Session的裸指针，而不是Shared Resource。这是因为我们没有实现Weak Ptr，不支持循环引用。

## WebRTC over TCP

WebRTC over UDP是默认的传输方式，由于UDP是没有连接，因此SRS只需要一个RTC Connection对象管理RTC会话。而WebRTC over TCP
则新增了一个TCP连接，我们使用SrsRtcTcpConn管理这个Tcp连接。参考 [#4083](https://github.com/ossrs/srs/pull/4083)

SrsRtcConnection使用Shared Resource引用SrsRtcTcpConn对象，而SrsRtcTcpConn直接引用SrsRtcConnection的裸指针，
因为SrsRtcConnection的生命周期是更长的。

```cpp
class SrsRtcTcpConn
{
private:
    // Because session references to this object, so we should directly use the session ptr.
    SrsRtcConnection* session_;
};

class SrsRtcTcpNetwork: public ISrsRtcNetwork
{
private:
    SrsSharedResource<SrsRtcTcpConn> owner_;
};
```

由于我们没有实现shared_from_this，所以我们需要把Shared Resource传递给SrsRtcTcpConn，最终是由Executor和SrsRtcConnection管理这个指针。
由于SrsRtcTcpConn是启动了协程服务这个对象，所以我们使用Executor管理它：

````cpp
resource = new SrsRtcTcpConn(new SrsTcpConnection(stfd2), ip, port);

SrsRtcTcpConn* raw_conn = dynamic_cast<SrsRtcTcpConn*>(resource);
SrsSharedResource<SrsRtcTcpConn>* conn = new SrsSharedResource<SrsRtcTcpConn>(raw_conn);
SrsExecutorCoroutine* executor = new SrsExecutorCoroutine(_srs_rtc_manager, conn, raw_conn, raw_conn);
if ((err = executor->start()) != srs_success) {
    srs_freep(executor);
    return srs_error_wrap(err, "start executor");
}
````

在使用Smart Ptr之前，我们需要在SrsRtcConnection和SrsRtcTcpConn对象释放时，释放对方。而使用Smart Ptr之后，这个逻辑就没有了，
而是只需要释放SrsRtcTcpConn即可，SrsRtcTcpConn是会自动释放的。

## SRT Source

SRT的Source也涉及到如何清理的问题，但相对比较简单，只需要修改为Shared Ptr即可，详细参考 [#4084](https://github.com/ossrs/srs/pull/4084)

```cpp
class SrsSrtSourceManager
{
public:
    virtual srs_error_t fetch_or_create(SrsRequest* r, SrsSharedPtr<SrsSrtSource>& pps);
    virtual void eliminate(SrsRequest* r);
};

SrsSharedPtr<SrsSrtSource> srt;
if ((err = _srs_srt_sources->fetch_or_create(r, srt)) != srs_success) {
    return srs_error_wrap(err, "create source");
}
```

值得注意的是，Source实际上管理了Consumer，所以在Consumer中我们使用的是Source的裸指针：

```cpp
class SrsSrtConsumer
{
private:
    // Because source references to this object, so we should directly use the source ptr.
    SrsSrtSource* source_;
};
```

在没有推流和播放时，释放Source对象：

```cpp
void SrsSrtSource::on_consumer_destroy(SrsSrtConsumer* consumer)
{
    // Destroy and cleanup source when no publishers and consumers.
    if (can_publish_ && consumers.empty()) {
        _srs_srt_sources->eliminate(req);
    }
}

void SrsSrtSource::on_unpublish()
{
    // Destroy and cleanup source when no publishers and consumers.
    if (can_publish_ && consumers.empty()) {
        _srs_srt_sources->eliminate(req);
    }
}
```

释放Live Source的逻辑稍微有所不同(未来会改成一样)，不过智能指针的使用是一致的。

## WebRTC Source

和SRT类似，WebRTC的Source也比较简单，只需要修改为Shared Ptr即可，详细参考 [#4085](https://github.com/ossrs/srs/pull/4085)

```cpp
class SrsRtcSourceManager
{
public:
    virtual srs_error_t fetch_or_create(SrsRequest* r, SrsSharedPtr<SrsRtcSource>& pps);
    virtual SrsSharedPtr<SrsRtcSource> fetch(SrsRequest* r);
    virtual void eliminate(SrsRequest* r);
};
```

值得注意的是，Source实际上管理了Consumer，所以在Consumer中我们使用的是Source的裸指针：

```cpp
class SrsRtcConsumer
{
private:
    // Because source references to this object, so we should directly use the source ptr.
    SrsRtcSource* source_;
};
```

WebRTC Source Manager支持了一个`fetch`的API，它可能会返回空的指针，例如：

```cpp
SrsSharedPtr<SrsRtcSource> source = _srs_rtc_sources->fetch(ruc->req_);
is_rtc_stream_active = (source.get() && !source->can_publish());
```

在没有推流和播放时，释放Source对象：

```cpp
void SrsRtcSource::on_consumer_destroy(SrsRtcConsumer* consumer)
{
    // Destroy and cleanup source when no publishers and consumers.
    if (!is_created_ && consumers.empty()) {
        _srs_rtc_sources->eliminate(req);
    }
}

void SrsRtcSource::on_unpublish()
{
    // Destroy and cleanup source when no publishers and consumers.
    if (!is_created_ && consumers.empty()) {
        _srs_rtc_sources->eliminate(req);
    }
}
```

释放Live Source的逻辑稍微有所不同(未来会改成一样)，不过智能指针的使用是一致的。

## Live Source

Live Source是最复杂的改进，主要是因为HTTP Streaming中也使用到了Source，详细参考 [#4089](https://github.com/ossrs/srs/pull/4089)。

![](/img/blog-2024-06-15-02.png)

因此我们需要先删除一些不必要的对Source的引用，而改成从manager获取：

```cpp
srs_error_t SrsLiveStream::do_serve_http(ISrsHttpResponseWriter* w, ISrsHttpMessage* r)
{
    SrsSharedPtr<SrsLiveSource> live_source = _srs_sources->fetch(req);
    if (!live_source.get()) {
        return srs_error_new(ERROR_NO_SOURCE, "no source for %s", req->get_stream_url().c_str());
    }
};
```

Manager的定义如下，值得注意的是它使用一个Timer检查和释放Source，这个逻辑和SRT/RTC不一致，未来会修改成一致的：

```cpp
class SrsLiveSourceManager : public ISrsHourGlass
{
public:
    virtual srs_error_t fetch_or_create(SrsRequest* r, ISrsLiveSourceHandler* h, SrsSharedPtr<SrsLiveSource>& pps);
    virtual SrsSharedPtr<SrsLiveSource> fetch(SrsRequest* r);
};
```

值得注意的是，Source实际上管理了Consumer/OriginHub/Edge等对象，所以在Consumer等对象中我们使用的是Source的裸指针：

```cpp
class SrsEdgeIngester : public ISrsCoroutineHandler
{
private:
    // Because source references to this object, so we should directly use the source ptr.
    SrsLiveSource* source_;
};

class SrsEdgeForwarder : public ISrsCoroutineHandler
{
private:
    // Because source references to this object, so we should directly use the source ptr.
    SrsLiveSource* source_;
};

class SrsLiveConsumer : public ISrsWakable
{
private:
    // Because source references to this object, so we should directly use the source ptr.
    SrsLiveSource* source_;
};

class SrsOriginHub : public ISrsReloadHandler
{
private:
    // Because source references to this object, so we should directly use the source ptr.
    SrsLiveSource* source_;
};
```

Manager使用定时器检查和释放Source：

```cpp

srs_error_t SrsLiveSourceManager::notify(int event, srs_utime_t interval, srs_utime_t tick)
{
    srs_error_t err = srs_success;

    std::map< std::string, SrsSharedPtr<SrsLiveSource> >::iterator it;
    for (it = pool.begin(); it != pool.end();) {
        SrsSharedPtr<SrsLiveSource>& source = it->second;

        if (source->stream_is_dead()) {
            const SrsContextId& cid = source->source_id();
            srs_trace("cleanup die source, id=[%s], total=%d", cid.c_str(), (int)pool.size());
            pool.erase(it++);
        } else {
            ++it;
        }
    }

    return err;
}
```

这个释放的逻辑和SRT/RTC不一致，未来会修改成一致的，不过智能指针的使用是一致的。

## Conclusion

SRS为了简单处理，最初并没有释放Source对象，通过引入Smart Ptr，终于解决了这个问题。由于我们通过业务上的限制，结合裸指针和Smart Ptr，
避免了复杂的Smart Ptr功能，避免支持多种不同的Smart Ptr，总体上这个修改引入的复杂度是可控的，未来的维护性也很好。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/blog-zh/24-06-15-SRS-Smart-Pointer)

