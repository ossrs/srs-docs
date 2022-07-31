# LICENSE

SRS used some third party libraries, which are distributed using their own licenses.
This wiki describes the licenses about SRS and related libraries.

**I am not a lawyer and this is not legal advice!**

## SRS

**SRS v1/v2/v3/v4/v5**

`SRS v1/v2/v3` uses [MIT](https://github.com/ossrs/srs/blob/develop/LICENSE) license that is very liberal.

`SRS v4`(and later) [use SPDX-License-Identifier: MIT](https://github.com/ossrs/srs/commit/3cd22b6e6eaf0c64834bfbcf1182270153850ad1), to make it more simple, by following the specification of [SPDX](https://spdx.org/ids/), which is also used by [POCO](https://github.com/pocoproject/poco/blob/master/LICENSE) and [Linux Kernel](https://www.kernel.org/doc/html/latest/process/license-rules.html#license-identifier-syntax), etc.

`SRS v5` is licenced under [MIT](https://github.com/ossrs/srs/blob/develop/LICENSE) or [MulanPSL-2.0](https://spdx.org/licenses/MulanPSL-2.0.html),
and note that [MulanPSL-2.0 is compatible with Apache-2.0](https://www.apache.org/legal/resolved.html#category-a),

## State Threads

The State Threads library is a derivative of the Netscape Portable Runtime library (NSPR) and therefore is distributed under the Mozilla Public License (MPL) version 1.1 or the GNU General Public License (GPL) version 2 or later.

You can choose which of the two licenses you want or you can continue the dual license. `Commercial interests probably will choose the MPL`, and free software advocates likely will prefer the GPL.

For more information, please read [LICENSE](http://state-threads.sourceforge.net/license.html) of ST.

[ST(State Threads)](https://github.com/ossrs/state-threads) is forked from [SourceForge](https://sourceforge.net/projects/state-threads/) and SRS uses the [patched ST](https://github.com/ossrs/state-threads/tree/srs). ST uses [GPLv2](https://github.com/ossrs/state-threads/blob/st-1.9/public.h#L25) or [MPL](https://github.com/ossrs/state-threads/blob/st-1.9/public.h#L2). Well, MPL is nice for commercial products, please read [#907](https://github.com/ossrs/srs/issues/907).

## OpenSSL

OpenSSL(May be used for SSL/TLS support) Uses an Original BSD-style license with an announcement clause that makes it "incompatible" with GPL. You are not allowed to ship binaries that link with OpenSSL that includes GPL code (unless that specific GPL code includes an exception for OpenSSL - a habit that is growing more and more common). If OpenSSL's licensing is a problem for you, consider using another TLS library.

> Remark: SRS can be built with system ssl library `libssl.so` and `libcrypto.so` by `./configure --use-sys-ssl`.

## http-parser

[http-parser](https://github.com/nodejs/http-parser) is part of NGINX, that uses [2-clause BSD-like license](http://nginx.org/LICENSE).

## JSON

**SRS2**

[NXJSON](https://bitbucket.org/yarosla/nxjson) uses [LGPL](https://bitbucket.org/yarosla/nxjson/src/afaf7f999a95ed68620d11073291dc82df792627/nxjson.h?at=default&fileviewer=file-view-default#nxjson.h-16) LICENSE.

SRS2 depends on NXJSON. SRS3 has replaced NXJSON with [json-parser](https://github.com/ossrs/srs/issues/904) which uses BSD license.

**SRS3+**

The JSON library [json-parser](https://github.com/udp/json-parser) uses [BSD 2-clause "Simplified" License](https://github.com/udp/json-parser/blob/master/LICENSE).

SRS3+ uses json-parser, read [#904](https://github.com/ossrs/srs/issues/904).

## SRT

**SRS4**

[libsrt](https://github.com/Haivision/srt/blob/master/LICENSE) use MPL 2.0, please read [#1147](https://github.com/ossrs/srs/issues/1147).

> For SRS to use shared library libsrt.so, please use `./configure --srt=on --shared-srt=on`, please see [f44224a](https://github.com/ossrs/srs/commit/f44224a2a121bb305868b7c00188bf0fcf8fce72).

## FFmpeg

**SRS4**

[FFmpeg](https://github.com/ossrs/srs/issues/1762) use LGPL, we will support `./configure --ffmpeg-fit=on --shared-ffmpeg=on` to build and link in so, see [d526672](https://github.com/ossrs/srs/commit/d5266725e2e40fd23bf3cbb4af814f392e161304).

* [Opus](https://opus-codec.org/license/) uses BSD, to transcode RTC(opus) to Live(aac).

## USRSCTP

**SRS4**

The [usrsctp](https://github.com/sctplab/usrsctp) is [BSD-3-Clause](https://github.com/sctplab/usrsctp/blob/master/LICENSE.md), for WebRTC DataChannel, [#1809](https://github.com/ossrs/srs/pull/1809).

## LIBUUID

The [libuuid](https://sourceforge.net/p/libuuid/code/ci/master/tree/COPYING) is BSD-3 LICENSE. See [SRS2](https://github.com/ossrs/srs/commit/c8871413e4c5ed72abfad3ff9523c0b0d1a6bb50), [SRS3](https://github.com/ossrs/srs/commit/5c6bb63bf25b500a2f785e087befbea7cf58a0d8), [SRS4+](https://github.com/ossrs/srs/commit/48ef3dcd832cc5ce34f97c26d81c3ed03e4cebd8).

## Utility

SRS forks FFMPEG process to transcode or ingest, however user can use other encoders.

**SRS2**

SRS2 uses the following functions, which have license problems and have been replaced in SRS3+:

1. `ff_hex_to_data`: For RTSP to parse the hex string. SRS3 replaced by golang hex at [41c6e833](https://github.com/ossrs/srs/commit/41c6e833b99829be4929f5bc90f83a237ccf7c33) and [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406856975).
1. `srs_av_base64_decode`: For RTSP to parse the base64 by FFMPEG. SRS3 replaced by golang base64 at [84f81983](https://github.com/ossrs/srs/commit/84f81983aa609d2027e290c808280428a4e69f0e) and [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406854293).
1. `srs_crc32_mpegts`: For TS to build the crc32 checksum by FFMPEG. SRS3 replaced by pycrc at [0a63448](https://github.com/ossrs/srs/commit/0a63448b86bfa2998f14055402896406a33de109) and [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406839996).
1. `srs_crc32_ieee`: For kafka to build the crc32 checksum. SRS3 replaced by pycrc code at [0a63448](https://github.com/ossrs/srs/commit/0a63448b86bfa2998f14055402896406a33de109) and [#917](https://github.com/ossrs/srs/issues/917#issuecomment-406795463).

Please read [#917](https://github.com/ossrs/srs/issues/917).


![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/license-en)


