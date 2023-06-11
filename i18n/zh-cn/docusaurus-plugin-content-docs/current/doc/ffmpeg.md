---
title: FFMPEG
sidebar_label: FFMPEG 
hide_title: false
hide_table_of_contents: false
---

# Live Streaming Transcode

SRS可以对推送到SRS的RTMP流进行转码，然后输出到RTMP服务器（也可以是SRS自己）。

## Use Scenario

FFMPEG的重要应用场景包括：
* 推送一路高码率，转多路输出。譬如：游戏直播中，推送一路1080p流到SRS，SRS可以转码输出1080p/720p/576p多路，低码率可以给移动设备观看。这样节省了推流带宽（一般源站为BGP带宽，很贵），也减轻了客户端压力（譬如客户端边玩游戏边直播）。
* 支持多屏输出。譬如：网页推流（主播）编码为vp6/mp3或speex，推流到SRS后无法支持HLS（要求h264+aac），可以转码成h264+aac后切片成HLS或者推送到其他服务器再分发。
* 加水印。适用于需要对流进行加水印的情况，譬如打上自己的logo。SRS支持文字水印和图片水印，也可以支持视频作为水印，或者将两路流叠加（参考ffmpeg的用法）。
* 截图：参考[使用Transcoder截图](./snapshot.md#transcoder)
* 其他滤镜：SRS支持所有ffmpeg的滤镜。

## Workflow

SRS转码的主要流程包括：

1. 编码器推送RTMP流到SRS的vhost。
1. SRS的vhost若配置了转码，则进行转码。
1. 转码后，按照配置，推送到SRS本身或者其他RTMP服务器。

## Transcode Config

SRS可以对vhost的所有的流转码，或者对某些app的流转码，或者对某些流转码。

```bash
listen              1935;
vhost __defaultVhost__ {
    # the streaming transcode configs.
    transcode {
        # whether the transcode enabled.
        # if off, donot transcode.
        # default: off.
        enabled     on;
        # the ffmpeg 
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        # the transcode engine for matched stream.
        # all matched stream will transcoded to the following stream.
        # the transcode set name(ie. hd) is optional and not used.
        # we will build the parameters to fork ffmpeg:
        #       ffmpeg <perfile>
        #               -i <iformat> 
        #               <vfilter> 
        #               -vcodec <vcodec> -b:v <vbitrate> -r <vfps> -s <vwidth>x<vheight> -profile:v <vprofile> -preset <vpreset>
        #               <vparams>
        #               -acodec <acodec> -b:a <abitrate> -ar <asample_rate> -ac <achannels>
        #               <aparams>
        #               -f <oformat>
        #               -y <output>
        engine example {
            # whether the engine is enabled
            # default: off.
            enabled         on;
            # pre-file options, before "-i"
            perfile {
                re;
                rtsp_transport tcp;
            }
            # input format, can be:
            # off, do not specifies the format, ffmpeg will guess it.
            # flv, for flv or RTMP stream.
            # other format, for example, mp4/aac whatever.
            # default: flv
            iformat         flv;
            # ffmpeg filters, follows the main input.
            vfilter {
                # the logo input file.
                i               ./doc/ffmpeg-logo.png;
                # the ffmpeg complex filter.
                # for filters, @see: http://ffmpeg.org/ffmpeg-filters.html
                filter_complex  'overlay=10:10';
            }
            # video encoder name. can be:
            #       libx264: use h.264(libx264) video encoder.
            #       png: use png to snapshot thumbnail.
            #       copy: donot encoder the video stream, copy it.
            #       vn: disable video output.
            vcodec          libx264;
            # video bitrate, in kbps
            # @remark 0 to use source video bitrate.
            # default: 0
            vbitrate        1500;
            # video framerate.
            # @remark 0 to use source video fps.
            # default: 0
            vfps            25;
            # video width, must be even numbers.
            # @remark 0 to use source video width.
            # default: 0
            vwidth          768;
            # video height, must be even numbers.
            # @remark 0 to use source video height.
            # default: 0
            vheight         320;
            # the max threads for ffmpeg to used.
            # default: 1
            vthreads        12;
            # x264 profile, @see x264 -help, can be:
            # high,main,baseline
            vprofile        main;
            # x264 preset, @see x264 -help, can be: 
            #       ultrafast,superfast,veryfast,faster,fast
            #       medium,slow,slower,veryslow,placebo
            vpreset         medium;
            # other x264 or ffmpeg video params
            vparams {
                # ffmpeg options, @see: http://ffmpeg.org/ffmpeg.html
                t               100;
                # 264 params, @see: http://ffmpeg.org/ffmpeg-codecs.html#libx264
                coder           1;
                b_strategy      2;
                bf              3;
                refs            10;
            }
            # audio encoder name. can be:
            #       libfdk_aac: use aac(libfdk_aac) audio encoder.
            #       copy: donot encoder the audio stream, copy it.
            #       an: disable audio output.
            acodec          libfdk_aac;
            # audio bitrate, in kbps. [16, 72] for libfdk_aac.
            # @remark 0 to use source audio bitrate.
            # default: 0
            abitrate        70;
            # audio sample rate. for flv/rtmp, it must be:
            #       44100,22050,11025,5512
            # @remark 0 to use source audio sample rate.
            # default: 0
            asample_rate    44100;
            # audio channel, 1 for mono, 2 for stereo.
            # @remark 0 to use source audio channels.
            # default: 0
            achannels       2;
            # other ffmpeg audio params
            aparams {
                # audio params, @see: http://ffmpeg.org/ffmpeg-codecs.html#Audio-Encoders
                # @remark SRS supported aac profile for HLS is: aac_low, aac_he, aac_he_v2
                profile:a   aac_low;
                bsf:a       aac_adtstoasc;
            }
            # output format, can be:
            #       off, do not specifies the format, ffmpeg will guess it.
            #       flv, for flv or RTMP stream.
            #       image2, for vcodec png to snapshot thumbnail.
            #       other format, for example, mp4/aac whatever.
            # default: flv
            oformat         flv;
            # output stream. variables:
            #       [vhost] the input stream vhost.
            #       [port] the intput stream port.
            #       [app] the input stream app.
            #       [stream] the input stream name.
            #       [engine] the tanscode engine name.
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

该配置对频道的所有流转码。譬如：
* 推送流：rtmp://dev:1935/live/livestream
* 观看原始流：rtmp://dev:1935/live/livestream
* 观看转码流：rtmp://dev:1935/live/livestream_ff

输出配置使用了变量替换，主要的参数是：
* [vhost] 输入流的vhost。譬如：dev
* [port] 输入流的端口。譬如：1935
* [app] 输入流的app。譬如：live
* [stream] 输入流名称。譬如：livestream
* [engine] 转码engine名称，engine后面就是名称。譬如：ff
注意：转码会使用自动检测，保证推送到自己的流不会被再次转码。但转码推送到SRS自己的流可以被切片成HLS。譬如，若开启了HLS，上面的live/livestream，和转码出来的流live/livestream_ff都能观看HLS。

对app或流转码时，只要在transcode后面加app和stream就可以。譬如：

```bash
listen              1935;
vhost __defaultVhost__ {
    # 对app为live的所有流转码
    transcode live{
    }
}
```

以及对指定的流转码：

```bash
listen              1935;
vhost __defaultVhost__ {
    # 对app为live并且流名称为livestream的流转码
    transcode live/livestream{
    }
}
```

## Transcode Rulers

SRS的转码参数全是FFMPEG的参数，有些参数SRS做了自定义，见下表。

| SRS参数 | FFMPEG参数 | 实例 | 说明 |
| ------ | --------- | ---- | ----- |
| vcodec | vcodec | ffmpeg ... -vcodec libx264 ... | 指定视频编码器 |
| vbitrate | b:v | ffmpeg ... -b:v 500000 ... | 输出的视频码率 |
| vfps | r | ffmpeg ... -r 25 ... | 输出的视频帧率 |
| vwidth/vheight | s | ffmpeg ... -s 400x300 -aspect 400:300 ... | 输出的视频宽度x高度，以及宽高比 |
| vthreads | threads | ffmpeg ... -threads 8 ... | 编码线程数 |
| vprofile | profile:v | ffmpeg ... -profile:v high ... | 编码x264的profile |
| vpreset | preset | ffmpeg ... -preset medium ... | 编码x264的preset |
| acodec | acodec | ffmpeg ... -acodec libfdk_aac ... | 音频编码器 |
| abitrate | b:a | ffmpeg ... -b:a 70000 ... | 音频输出码率。libaacplus：16-72k。libfdk_aac没有限制。 |
| asample_rate | ar | ffmpeg ... -ar 44100 ... | 音频采样率 |
| achannels | ac | ffmpeg ... -ac 2 ... | 音频声道 |

另外，还有四个是可以加其他ffmpeg参数：
* perfile: 添加在iformat之前的参数。譬如指定rtsp的transport为tcp。
* vfilter：添加在vcodec之前的滤镜参数。
* vparams：添加在vcodec之后，acodec之前的视频编码参数。
* aparams：添加在acodec之后，-y之前的音频编码参数。

这些参数应用的顺序是：
```bash
ffmpeg <perfile> -f flv -i <input_rtmp> {vfilter} -vcodec ... {vparams} -acodec ... {aparams} -f flv -y {output}
```

具体参数可以查看SRS的日志，譬如：
```bash
[2014-02-28 21:38:09.603][4][trace][start] start transcoder, 
log: ./objs/logs/encoder-__defaultVhost__-live-livestream.log, 
params: ./objs/ffmpeg/bin/ffmpeg -f flv -i 
rtmp://127.0.0.1:1935/live?vhost=__defaultVhost__/livestream 
-vcodec libx264 -b:v 500000 -r 25.00 -s 768x320 -aspect 768:320 
-threads 12 -profile:v main -preset medium -acodec libfdk_aac 
-b:a 70000 -ar 44100 -ac 2 -f flv 
-y rtmp://127.0.0.1:1935/live?vhost=__defaultVhost__/livestream_ff 
```

## FFMPEG Log Path

FFMPEG启动后，SRS会将stdout和stderr都定向到日志文件，譬如`./objs/logs/encoder-__defaultVhost__-live-livestream.log`，有时候日志会比较大。可以配置ffmpeg输出较少日志：

```bash
listen              1935;
vhost __defaultVhost__ {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine ff {
            enabled         on;
            vfilter {
                # -v quiet
                v           quiet;
            }
            vcodec          libx264;
            vbitrate        500;
            vfps            25;
            vwidth          768;
            vheight         320;
            vthreads        12;
            vprofile        main;
            vpreset         medium;
            vparams {
            }
            acodec          libfdk_aac;
            abitrate        70;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

对ffmpeg添加`-v quiet`参数即可。

## Copy Without Transcode

可以配置vcodec/acodec copy，实现不转码。譬如，视频为h264编码，但是音频是mp3/speex，需要转码音频为aac，然后切片为HLS输出。

```bash
listen              1935;
vhost __defaultVhost__ {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine ff {
            enabled         on;
            vcodec          copy;
            acodec          libfdk_aac;
            abitrate        70;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

或者拷贝视频和音频：
```bash
listen              1935;
vhost __defaultVhost__ {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine ff {
            enabled         on;
            vcodec          copy;
            acodec          copy;
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

## Drop Video or Audio

可以禁用视频或者音频，只输出音频或视频。譬如，电台可以丢弃视频，对音频转码为aac后输出HLS。

可以配置vcodec为vn，acodec为an实现禁用。例如：

```bash
listen              1935;
vhost __defaultVhost__ {
    transcode {
        enabled     on;
        ffmpeg      ./objs/ffmpeg/bin/ffmpeg;
        engine vn {
            enabled         on;
            vcodec          vn;
            acodec          libfdk_aac;
            abitrate        45;
            asample_rate    44100;
            achannels       2;
            aparams {
            }
            output          rtmp://127.0.0.1:[port]/[app]?vhost=[vhost]/[stream]_[engine];
        }
    }
}
```

该配置只输出纯音频，编码为aac。

## Other Transcode Config

conf/full.conf中有很多FFMPEG转码配置的实例，也可以参考ffmpeg的命令行。
* mirror.transcode.srs.com 将视频流上半截，翻转到下半截，看起来像个镜子。
* drawtext.transcode.srs.com 加文字水印。
* crop.transcode.srs.com 剪裁视频。
* logo.transcode.srs.com 添加图片logo。
* audio.transcode.srs.com 只对音频转码。
* copy.transcode.srs.com 不转码只转封装，类似于SRS的Forward。
* all.transcode.srs.com 转码参数的详细说明。
* ffempty.transcode.srs.com 一个ffmpeg的mock，不转码只打印参数。
* app.transcode.srs.com 对指定的app的流转码。
* stream.transcode.srs.com 对指定的流转码。
* vn.transcode.srs.com 只输出音频，禁止视频输出。

## FFMPEG Transcode the Stream by Flash encoder

flash可以当作编码器推流，参考演示中的编码器或者视频会议。flash只支持speex/nellymoser/pcma/pcmu，但flash会有一个特性，没有声音时就没有音频包。FFMPEG会依赖于这些音频包，如果没有会认为没有音频。

所以FFMPEG用来转码flash推上来的RTMP流时，可能会有一个问题：ffmpeg认为没有音频。

另外，FFMPEG取flash的流的时间会很长，也可能是在等待这些音频包。

## FFMPEG

FFMPEG相关链接：
* [ffmpeg.org](http://ffmpeg.org)
* [ffmpeg命令行](http://ffmpeg.org/ffmpeg.html)
* [ffmpeg滤镜](http://ffmpeg.org/ffmpeg-filters.html)
* [ffmpeg编解码参数](http://ffmpeg.org/ffmpeg-codecs.html)

Winlin 2015.6

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/ffmpeg)


