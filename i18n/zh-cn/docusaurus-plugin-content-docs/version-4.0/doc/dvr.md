---
title: DVR
sidebar_label: DVR 
hide_title: false
hide_table_of_contents: false
---

# DVR

SRS支持将RTMP流录制成FLV或MP4文件。下面的描述以FLV为例，但是对MP4也是一样的。

## Build

DVR作为SRS3的核心功能，永远开启DVR。

参考：[Build](./install)

## Config

DVR的难点在于写入flv和文件命名，SRS的做法是随机生成文件名，用户可以使用http-callback方式，使用外部程序记录这个文件名，或者改成自己要的文件命名方式。

当然也可以修改SRS代码，这种做法不推荐，c操作文件名比较麻烦。还是用外部辅助系统做会很方便。

DVR的配置文件说明：

```bash
vhost your_vhost {
    # DVR RTMP stream to file,
    # start to record to file when encoder publish,
    # reap flv/mp4 according by specified dvr_plan.
    dvr {
        # whether enabled dvr features
        # default: off
        enabled         on;
        # the filter for dvr to apply to.
        #       all, dvr all streams of all apps.
        #       <app>/<stream>, apply to specified stream of app.
        # for example, to dvr the following two streams:
        #       live/stream1 live/stream2
        # default: all
        dvr_apply       all;
        # the dvr plan. canbe:
        #       session reap flv/mp4 when session end(unpublish).
        #       segment reap flv/mp4 when flv duration exceed the specified dvr_duration.
        # @remark The plan append is removed in SRS3+, for it's no use.
        # default: session
        dvr_plan        session;
        # the dvr output path, *.flv or *.mp4.
        # we supports some variables to generate the filename.
        #       [vhost], the vhost of stream.
        #       [app], the app of stream.
        #       [stream], the stream name of stream.
        #       [2006], replace this const to current year.
        #       [01], replace this const to current month.
        #       [02], replace this const to current date.
        #       [15], replace this const to current hour.
        #       [04], replace this const to current minute.
        #       [05], replace this const to current second.
        #       [999], replace this const to current millisecond.
        #       [timestamp],replace this const to current UNIX timestamp in ms.
        # @remark we use golang time format "2006-01-02 15:04:05.999" as "[2006]-[01]-[02]_[15].[04].[05]_[999]"
        # for example, for url rtmp://ossrs.net/live/livestream and time 2015-01-03 10:57:30.776
        # 1. No variables, the rule of SRS1.0(auto add [stream].[timestamp].flv as filename):
        #       dvr_path ./objs/nginx/html;
        #       =>
        #       dvr_path ./objs/nginx/html/live/livestream.1420254068776.flv;
        # 2. Use stream and date as dir name, time as filename:
        #       dvr_path /data/[vhost]/[app]/[stream]/[2006]/[01]/[02]/[15].[04].[05].[999].flv;
        #       =>
        #       dvr_path /data/ossrs.net/live/livestream/2015/01/03/10.57.30.776.flv;
        # 3. Use stream and year/month as dir name, date and time as filename:
        #       dvr_path /data/[vhost]/[app]/[stream]/[2006]/[01]/[02]-[15].[04].[05].[999].flv;
        #       =>
        #       dvr_path /data/ossrs.net/live/livestream/2015/01/03-10.57.30.776.flv;
        # 4. Use vhost/app and year/month as dir name, stream/date/time as filename:
        #       dvr_path /data/[vhost]/[app]/[2006]/[01]/[stream]-[02]-[15].[04].[05].[999].flv;
        #       =>
        #       dvr_path /data/ossrs.net/live/2015/01/livestream-03-10.57.30.776.flv;
        # 5. DVR to mp4:
        #       dvr_path ./objs/nginx/html/[app]/[stream].[timestamp].mp4;
        #       =>
        #       dvr_path ./objs/nginx/html/live/livestream.1420254068776.mp4;
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/dvr#custom-path
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/dvr#custom-path
        #       segment,session apply it.
        # default: ./objs/nginx/html/[app]/[stream].[timestamp].flv
        dvr_path        ./objs/nginx/html/[app]/[stream].[timestamp].flv;
        # the duration for dvr file, reap if exceed, in seconds.
        #       segment apply it.
        #       session,append ignore.
        # default: 30
        dvr_duration    30;
        # whether wait keyframe to reap segment,
        # if off, reap segment when duration exceed the dvr_duration,
        # if on, reap segment when duration exceed and got keyframe.
        #       segment apply it.
        #       session,append ignore.
        # default: on
        dvr_wait_keyframe       on;
        # about the stream monotonically increasing:
        #   1. video timestamp is monotonically increasing,
        #   2. audio timestamp is monotonically increasing,
        #   3. video and audio timestamp is interleaved monotonically increasing.
        # it's specified by RTMP specification, @see 3. Byte Order, Alignment, and Time Format
        # however, some encoder cannot provides this feature, please set this to off to ignore time jitter.
        # the time jitter algorithm:
        #   1. full, to ensure stream start at zero, and ensure stream monotonically increasing.
        #   2. zero, only ensure stream start at zero, ignore timestamp jitter.
        #   3. off, disable the time jitter algorithm, like atc.
        # apply for all dvr plan.
        # default: full
        time_jitter             full;

        # on_dvr, never config in here, should config in http_hooks.
        # for the dvr http callback, @see http_hooks.on_dvr of vhost hooks.callback.srs.com
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/dvr#http-callback
        # @see https://ossrs.net/lts/zh-cn/docs/v4/doc/dvr#http-callback
    }
}
```

DVR的计划即决定什么时候关闭flv文件，打开新的flv文件，主要的录制计划包括：

* session：按照session来关闭flv文件，即编码器停止推流时关闭flv，整个session录制为一个flv。
* segment：按照时间分段录制，flv文件时长配置为dvr_duration和dvr_wait_keyframe。注意：若不按关键帧切flv（即dvr_wait_keyframe配置为off），所以会导致后面的flv启动时会花屏。
* time_jitter: 时间戳抖动算法。full使用完全的时间戳矫正；zero只是保证从0开始；off不矫正时间戳。
* dvr_path: 录制的路径，规则参考下一章。

参考`conf/dvr.segment.conf`和`conf/dvr.session.conf`配置实例。

## Apply

DVR的apply决定了是否对某个流开启dvr，默认的all是对所有开启。
这个功能是SRS实现nginx提供的control module的一个基础，而且更丰富。
也就是可以支持用户调用[http raw api](./http-api)控制是否以及何时DVR。
参考[351](https://github.com/ossrs/srs/issues/459#issuecomment-134983742)

Apply可以对多个流进行录制，譬如对`live/stream1`和`live/stream2`录制，可以配置成：
```
vhost xxx {
    dvr {
        dvr_apply live/stream1 live/stream2;
    }
}
```

可以使用RAW API控制DVR，参考[319](https://github.com/ossrs/srs/issues/319)和[wiki](./http-api#raw-dvr).

## Custom Path

我们可以自定义DVR的路径和文件名，规则如下：

* 按年月日以及流信息生成子目录。便于做软链，或者避免一个目录的文件太多（貌似超过几万linux会支持不了）。
* 按日期和时间以及流信息生成文件名。便于搜索。
* 提供日期和时间，以及流信息的变量，以中括号代表变量。
* 保留目前的方式，按照时间戳生成文件名，保存在一个文件夹。若没有指定文件名（只指定了目录），则默认使用`[stream].[timestamp].flv`作为文件名，和目前保持一致。

关于日期和时间的变量，参考了GO的时间格式化字符串，譬如2006代表YYYY这种，比较方便：

```
2006-01-02 15:04:05.999
```

DVR支持的变量包括：

1. 年：[2006]，将这个字符串替换为年份。
1. 月：[01]，将这个字符串替换成月份。
1. 日：[02]，将这个字符串替换成日期。
1. 时：[15]，将这个字符串替换成小时。
1. 分：[04]，将这个字符串替换成分。
1. 秒：[05)，将这个字符串替换成秒。
1. 毫秒：[999]，将这个字符串替换成毫秒。
1. 时间戳：[timestamp]，将这个字符串替换成UNIX时间戳，单位是毫秒。
1. 流相关变量，参考转码：[vhost], [app], [stream]

下面的例子说明了替换方式, url是`rtmp://ossrs.net/live/livestream`，time是`2015-01-03 10:57:30.776`

1. 没有变量，SRS1.0方式（自动添加`[stream].[timestamp].flv`作为文件名）：
    * dvr_path ./objs/nginx/html;
    * =>
    * dvr_path ./objs/nginx/html/live/livestream.1420254068776.flv;

1. 按流和年月日分目录，时间作为文件名：
    * dvr_path /data/[vhost]/[app]/[stream]/[2006]/[01]/[02]/[15].[04].[05].[999].flv;
    * =>
    * dvr_path /data/ossrs.net/live/livestream/2015/01/03/10.57.30.776.flv;

1. 按流和年月分目录，日和时间作为文件名：
    * dvr_path /data/[vhost]/[app]/[stream]/[2006]/[01]/[02]-[15].[04].[05].[999].flv;
    * =>
    * dvr_path /data/ossrs.net/live/livestream/2015/01/03-10.57.30.776.flv;

1. 按vhost/app和年月分目录，流名称、日和时间作为文件名：
    * dvr_path /data/[vhost]/[app]/[2006]/[01]/[stream]-[02]-[15].[04].[05].[999].flv;
    * =>
    * dvr_path /data/ossrs.net/live/2015/01/livestream-03-10.57.30.776.flv;

1. 按app分目录，流和时间戳作为文件名（SRS1.0方式）：
    * dvr_path /data/[app]/[stream].[timestamp].flv;
    * =>
    * dvr_path /data/live/livestream.1420254068776.flv;

## Http Callback

打开`http_hooks`的`on_dvr`配置：

```
vhost your_vhost {
    dvr {
        enabled             on;
        dvr_path            ./objs/nginx/html/[app]/[stream]/[2006]/[01]/[02]/[15].[04].[05].[999].flv;
        dvr_plan            segment;
        dvr_duration        30;
        dvr_wait_keyframe   on;
    }
    http_hooks {
        enabled         on;
        on_dvr          http://127.0.0.1:8085/api/v1/dvrs;
    }
}
```

api-server的日志：

```
[2015-01-03 15:25:48][trace] post to dvrs, req={"action":"on_dvr","client_id":108,"ip":"127.0.0.1","vhost":"__defaultVhost__","app":"live","stream":"livestream","cwd":"/home/winlin/git/srs/trunk","file":"./objs/nginx/html/live/livestream/2015/1/3/15.25.18.442.flv"}
[2015-01-03 15:25:48][trace] srs on_dvr: client id=108, ip=127.0.0.1, vhost=__defaultVhost__, app=live, stream=livestream, cwd=/home/winlin/git/srs/trunk, file=./objs/nginx/html/live/livestream/2015/1/3/15.25.18.442.flv
127.0.0.1 - - [03/Jan/2015:15:25:48] "POST /api/v1/dvrs HTTP/1.1" 200 1 "" "SRS(Simple RTMP Server)2.0.88"
```

更多HTTP回调的信息，请参考 [HttpCallback](./http-callback)

## Bug

关于DVR的bug：

* 文件名规则：[#179](https://github.com/ossrs/srs/issues/179)
* DVR时HTTP回调：[#274](https://github.com/ossrs/srs/issues/274)
* DVR支持MP4格式：[#738](https://github.com/ossrs/srs/issues/738)
* 如何录制成一个文件：[#776](https://github.com/ossrs/srs/pull/776)

## Reload

改变dvr配置后reload，会导致dvr重启，即关闭当前dvr文件后重新应用dvr配置。

Winlin 2015.1

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v4/dvr)


