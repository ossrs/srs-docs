---
title: ARM
sidebar_label: ARM
hide_title: false
hide_table_of_contents: false
---

# SRS for linux-arm

How to run SRS on ARM pcu?

* Run SRS on ARM: Client can play stream from ARM server.

## Why run SRS on ARM?

The use scenario:

* Run SRS on ARM server, see [#1282](https://github.com/ossrs/srs/issues/1282#issue-386077124).
* Crossbuild for ARM embeded device, see [#1547](https://github.com/ossrs/srs/issues/1547#issue-543780097).

## RaspberryPi

User is able to build and run SRS on RespberryPI. Please don't use crossbuild.

<a name="armv8-and-aarch64"></a>

## ARM Server: armv7, armv8(aarch64)

User is able to build and run SRS on ARM servers. Please don't use crossbuild.

```
./configure && make
```

Build SRS in ARM server docker, see [aarch64](https://github.com/ossrs/dev-docker/tree/aarch64#usage)

```
docker run -it --rm -v `pwd`:/srs -w /srs ossrs/srs:aarch64 \
    bash -c "./configure && make"
```

For armv8 or aarch64, user should specify the arch, if the CPU arch is not identified automatically, see [#1282](https://github.com/ossrs/srs/issues/1282#issuecomment-568891854):

```bash
./configure --extra-flags='-D__aarch64__' && make
```

Run SRS:

```
./objs/srs -c conf/console.conf
```

Publish stream:

```
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://127.0.0.1:1935/live/livestream
```

Play stream：http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream&server=localhost&port=1935&autostart=true&vhost=localhost

![image](https://user-images.githubusercontent.com/2777660/72774670-7108c980-3c46-11ea-9e8b-d4fb3a475ea2.png)

<a name="ubuntu-cross-build-srs"></a>

## Ubuntu Cross Build SRS: ARMv8(aarch64)

Build SRS in docker(Ubuntu 16(xenial))：

```
cd ~/git/srs/trunk && docker run --rm -it -v `pwd`:/srs -w /srs \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:ubuntu16 bash
```

Install toolchain(optional):

```
apt-get install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
```

Cross build SRS:

```
./configure --cross-build --cc=aarch64-linux-gnu-gcc --cxx=aarch64-linux-gnu-g++ \
    --ar=aarch64-linux-gnu-ar --ld=aarch64-linux-gnu-ld --randlib=aarch64-linux-gnu-randlib &&
make
```

Run SRS on [aarch64 docker](https://hub.docker.com/r/arm64v8/ubuntu):

```
cd ~/git/srs/trunk && docker run --rm -it -v `pwd`:/srs -w /srs \
    -p 1935:1935 -p 1985:1985 -p 8080:8080 arm64v8/ubuntu \
    ./objs/srs -c conf/console.conf
```

Publish stream:

```
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://127.0.0.1:1935/live/livestream
```

Play stream：http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream&server=localhost&port=1935&autostart=true&vhost=localhost

## Ubuntu Cross Build SRS: ARMv7

Cross build ST and OpenSSL on Ubuntu16.

Build SRS in docker(Ubuntu 16(xenial))：

```
cd ~/git/srs/trunk && docker run --rm -it -v `pwd`:/srs -w /srs \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:ubuntu16 bash
```

Install toolchain(optional), for example [Acqua or RoadRunner board](https://www.acmesystems.it/arm9_toolchain)

```
apt-get install -y gcc-arm-linux-gnueabihf g++-arm-linux-gnueabihf
```

Cross build SRS:

```
./configure --cross-build --cc=arm-linux-gnueabihf-gcc --cxx=arm-linux-gnueabihf-g++ \
    --ar=arm-linux-gnueabihf-ar --ld=arm-linux-gnueabihf-ld --randlib=arm-linux-gnueabihf-randlib &&
make
```

Run SRS on [ARMv7 docker](https://hub.docker.com/r/armv7/armhf-ubuntu):

```
cd ~/git/srs/trunk && docker run --rm -it -v `pwd`:/srs -w /srs \
    -p 1935:1935 -p 1985:1985 -p 8080:8080 armv7/armhf-ubuntu \
    ./objs/srs -c conf/console.conf
```

Publish stream:

```
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://127.0.0.1:1935/live/livestream
```

Play stream：http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream&server=localhost&port=1935&autostart=true&vhost=localhost

## Use Other Cross build tools

SRS configure options for cross build:

```
root@4c618f90fc4c:/tmp/git/srs/trunk# ./configure -h
Toolchain options:          @see https://github.com/ossrs/srs/issues/1547#issuecomment-576078411
  --cross-build             Enable crossbuild for ARM/MIPS.
  --cc=<CC>                 Use c compiler CC, default is gcc.
  --cxx=<CXX>               Use c++ compiler CXX, default is g++.
  --ar=<AR>                 Use archive tool AR, default is ar.
  --ld=<LD>                 Use linker tool LD, default is ld.
  --randlib=<RANDLIB>       Use randlib tool RANDLIB, default is randlib.
  --extra-flags=<EFLAGS>    Set EFLAGS as CFLAGS and CXXFLAGS. Also passed to ST as EXTRA_CFLAGS.
```

Winlin 2014.11

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-4/doc/arm)


