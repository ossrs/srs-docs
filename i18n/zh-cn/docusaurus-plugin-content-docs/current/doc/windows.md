---
title: Windows
sidebar_label: Windows
hide_title: false
hide_table_of_contents: false
---

# SRS for Windows

SRS 5.0.89+正式支持Windows，基于Cygwin64平台，支持代码编译，以及流水线，每个5.0的版本都会提供安装包。

## Build from code

如果你需要自己从代码编译Windows版本的SRS，请先安装[Cygwin64](https://cygwin.com/install.html)。

另外，还需要安装工具`gcc-g++` `make` `automake` `patch` `pkg-config` `tcl` `cmake`，可以参考流水线[说明](https://github.com/cygwin/cygwin-install-action#parameters)。

安装好环境后，在Cygwin终端中执行命令：

```bash
git checkout develop
./configure
make
```

这样就可以编译出Windows版本的SRS了，可执行文件在`./objs/srs.exe`，其他使用说明参考[Getting Started](./getting-started.md)。

## Install from binary

从5.0.89之后，SRS 5.0每个版本[release](https://github.com/ossrs/srs/releases)，都会附带Windows的安装包。你可以下载后，快速安装和使用SRS。

下面是一些安装包的链接，注意你应该用最新版本，而不是使用某个固定版本[release](https://github.com/ossrs/srs/releases)：

* [最新版本下载](https://github.com/ossrs/srs/releases)
* [SRS-Windows-x86_64-5.0.89-setup.exe](https://github.com/ossrs/srs/releases/tag/v5.0.89)
* [SRS-Windows-x86_64-5.0.19-setup.exe](https://github.com/ossrs/srs/releases/tag/v5.0.19)

> Note: SRS 5.0.89+之后，使用流水线构建Windows安装包，GitHub Actions自动生成。

![](/img/windows-2022-11-20-001.png)

安装后，使用管理员权限启动SRS：

![](/img/windows-2022-11-20-002.png)

使用FFmpeg或OBS推流到SRS：

```bash
ffmpeg -re -i ~/srs/doc/source.flv -c copy -f flv rtmp://win11/live/livestream
```

使用VLC或[srs-player](http://win11:8080/)播放流：

![](/img/windows-2022-11-20-003.png)

基本上SRS现有的功能都能用，比如RTMP, HTTP-FLV, HLS, WebRTC, HTTP-API, Prometheus Exporter等等。

## Package by NSIS

如果你需要自己修改代码并打包，可以使用[NSIS](https://nsis.sourceforge.io/Download)，在Cygwin终端中执行命令：

```bash
"/cygdrive/c/Program Files (x86)/NSIS/makensis.exe" \
    /DSRS_VERSION=$(./objs/srs -v 2>&1) \
    /DCYGWIN_DIR="C:\cygwin64" \
    packaging/nsis/srs.nsi
```

## Known Issues

* [Cygwin: Build with SRT is ok, but crash when running. #3251](https://github.com/ossrs/srs/issues/3251)
* [Cygwin: Support address sanitizer for windows. #3252](https://github.com/ossrs/srs/issues/3252)
* [Cygwin: ST stuck when working in multiple threads mode. #3253](https://github.com/ossrs/srs/issues/3253)
* [Cygwin: Support iocp and windows native build. #3256](https://github.com/ossrs/srs/issues/3256)
* [Cygwin: Build srtp with openssl fail for no srtp_aes_icm_ctx_t #3254](https://github.com/ossrs/srs/issues/3254)

## Links

ST supports windows: https://github.com/ossrs/state-threads/issues/20

Commits about SRS Windows: https://github.com/ossrs/srs-windows/issues/2

Windows docker also works for SRS, however, `srs.exe` is more popular for windows developers.

Winlin 2022.11

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/windows)


