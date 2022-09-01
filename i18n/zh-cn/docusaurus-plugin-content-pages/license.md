# LICENSE

SRS用到了一些第三方库，可能是有自己的LICENSE，这个WIKI介绍了SRS和相关库的LICENSE问题。

**免责声明：注意我不是个律师，所以这不是法律建议，最终还是请找相关专业人士确认。**

## SRS

**SRS v1/v2/v3/v4/v5**

`SRS v1/v2/v3`使用的是[MIT](https://github.com/ossrs/srs/blob/develop/LICENSE)协议，非常宽松，可以在商业化中使用的。

`SRS v4`(以及后续版本)，简化和规范了LICENSE申明，参考[Use SPDX-License-Identifier: MIT](https://github.com/ossrs/srs/commit/67272f0721db044d98e324df23bc0d2a3e8817c8#commitcomment-51515520)。[SPDX](https://spdx.org/ids/)是Linux基金会的规范，被[POCO](https://github.com/pocoproject/poco/blob/master/LICENSE)和[Linux Kernel](https://www.kernel.org/doc/html/latest/process/license-rules.html#license-identifier-syntax)等广泛使用。

`SRS v5`授权可以选择[MIT](https://github.com/ossrs/srs/blob/develop/LICENSE)或[MulanPSL-2.0](https://spdx.org/licenses/MulanPSL-2.0.html)协议。[MulanPSL-2.0](https://spdx.org/licenses/MulanPSL-2.0.html)是兼容Apache-2.0协议，详细请看[这里](https://www.apache.org/legal/resolved.html#category-a)。

## State Threads

State Threads库是由Netscape发起的项目，采用双LICENSE授权，可以用MPL 1.1，或者GPL v2(或更新)。

你可以选择这两个授权中的任意一个LICENSE，商业应用可能会选择MPL，而开源软件也可以选择GPL。

SRS自己是MIT，所以选择的ST的LICENSE也是MPL，这样协议上才能兼容。

更多信息请参考StateThreads的[LICENSE](http://state-threads.sourceforge.net/license.html)

[ST(State Threads)](https://github.com/ossrs/state-threads)的上游是[SourceForge](https://sourceforge.net/projects/state-threads/)，
SRS使用[patched ST](https://github.com/ossrs/state-threads/tree/srs)。

ST使用[GPLv2](https://github.com/ossrs/state-threads/blob/st-1.9/public.h#L25) 或者 [MPL](https://github.com/ossrs/state-threads/blob/st-1.9/public.h#L2)
双协议授权。MPL是对商业化友好的授权，请参考 [#907](https://github.com/ossrs/srs/issues/907).

> 注意SRS如果需要使用State Threads的MPL授权，那么要开启`./configure --shared-st=on`，采用库的方式链接。

## OpenSSL

OpenSSL是BSD风格的LICENSE，如果有疑问可以用动态库链接`./configure --use-sys-ssl`。

## http-parser

[http-parser](https://github.com/nodejs/http-parser)是NGINX的一部分，授权是用的[2-clause BSD-like license](http://nginx.org/LICENSE)授权。

## JSON

**SRS2**

[NXJSON](https://bitbucket.org/yarosla/nxjson)使用[LGPL](https://bitbucket.org/yarosla/nxjson/src/afaf7f999a95ed68620d11073291dc82df792627/nxjson.h?at=default&fileviewer=file-view-default#nxjson.h-16)

SRS2用到了NXJSON，是用的LGPL授权。SRS3已经替换成了[json-parser](https://github.com/ossrs/srs/issues/904)，它是BSD授权。

**SRS3+**

[json-parser](https://github.com/udp/json-parser)使用[BSD 2-clause "Simplified" License](https://github.com/udp/json-parser/blob/master/LICENSE)授权。

SRS3换成了[json-parser](https://github.com/udp/json-parser)，是用的BSD授权，参考[#904](https://github.com/ossrs/srs/issues/904)。

## SRT

**SRS4**

[libsrt](https://github.com/Haivision/srt/blob/master/LICENSE) 是MPL 2.0授权，参考[#1147](https://github.com/ossrs/srs/issues/1147)。

可以用`./configure --srt=on --shared-srt=on`动态库链接。

## FFmpeg

**SRS4**

[FFmpeg](https://github.com/ossrs/srs/issues/1762)是LGPL，如果用`--enable-gpl`开启了GPL就是GPL了。

SRS支持`./configure --ffmpeg-fit=on --shared-ffmpeg=on`来动态库链接FFmpeg。

* [Opus](https://opus-codec.org/license/) 是 BSD 授权，用来转WebRTC(Opus)到直播流(AAC)。

## USRSCTP

**SRS4**

[usrsctp](https://github.com/sctplab/usrsctp)是[BSD-3-Clause](https://github.com/sctplab/usrsctp/blob/master/LICENSE.md)授权。

用在支持DataChannel中，参考[#1809](https://github.com/ossrs/srs/pull/1809)。

## LIBUUID

[libuuid](https://sourceforge.net/p/libuuid/code/ci/master/tree/COPYING) 是 BSD-3 LICENSE. 参考 [SRS2](https://github.com/ossrs/srs/commit/c8871413e4c5ed72abfad3ff9523c0b0d1a6bb50), [SRS3](https://github.com/ossrs/srs/commit/5c6bb63bf25b500a2f785e087befbea7cf58a0d8), [SRS4+](https://github.com/ossrs/srs/commit/48ef3dcd832cc5ce34f97c26d81c3ed03e4cebd8).

## Utility

SRS启动了FFmpeg进程实现转码和Ingest，可以替换成其他工具。启动进程方式，没有LICENSE问题。

**SRS2**

SRS2以下函数有LICENSE问题，已经在SRS3+替换成了LICENSE兼容的版本：

1. `ff_hex_to_data`: RTSP转换HEX字符串。SRS3参考Go的实现替换了它，请看[41c6e833](https://github.com/ossrs/srs/commit/41c6e833b99829be4929f5bc90f83a237ccf7c33) 以及 [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406856975).
1. `srs_av_base64_decode`: RTSP解析Base64的编码。SRS3参考Go的实现替换了它，请看[84f81983](https://github.com/ossrs/srs/commit/84f81983aa609d2027e290c808280428a4e69f0e) 以及 [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406854293).
1. `srs_crc32_mpegts`: TS实现CRC32校验。SRS3参考pycrc的实现替换了它，请看[0a63448](https://github.com/ossrs/srs/commit/0a63448b86bfa2998f14055402896406a33de109) 以及 [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406839996).
1. `srs_crc32_ieee`: Kafka协议实现CRC32校验。SRS3参考pycrc的实现替换了它，请看[0a63448](https://github.com/ossrs/srs/commit/0a63448b86bfa2998f14055402896406a33de109) 以及 [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406795463).

> SRS2有些函数用到了FFmpeg的函数，这些是有LICENSE问题；在SRS3之后全部改掉了。请看：[#917](https://github.com/ossrs/srs/issues/917)。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/license-zh)


