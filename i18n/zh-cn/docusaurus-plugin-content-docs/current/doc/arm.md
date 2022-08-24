---
title: ARM and CrossBuild
sidebar_label: ARM和交叉编译
hide_title: false
hide_table_of_contents: false
---

# SRS for linux-arm

注意：一般情况下，直接在<code>ARM</code>下是可以编译SRS的，参考官网正常的编译方法就可以，不需要交叉编译。

!!! 注意，请先确认是否需要<code>交叉编译</code>，一般可以直接编译，除非极少数情况。

> 翁晓晶：看来很多人误解了交叉编译的意思了，异构平台编译才要，比如编译平台跟运行平台是异构的，才需要，都是同一个平台不需要。

> 翁晓晶：最常见的场景就是玩网络设备的，因为网络设备的u都很弱，编译很慢，所以才在pc上做交叉编译，因为pc的u是x86，网络设备的u基本上都是mips或者arm的低频率的，属于异构，x86的u编译速度明显快于它们，所以大家都在pc上做交叉编译，然后把结果拷贝进网络设备，这样编译速度快很多，当然你有时间也可以直接在网络设备上正常编译也是可以的，就是慢很多。

> 翁晓晶：我看到有个朋友提到arm的服务器比如鲲鹏，那就直接在arm的服务器上编译就好了，没必要再交叉编译了，arm服务器又不是网络设备，U编译个程序还是没问题的，不要走弯路了。

## Why run SRS on ARM?

ARM跑SRS主要原因：

* ARM服务器越来越多了，可以直接编译和运行SRS，参考 [#1282](https://github.com/ossrs/srs/issues/1282#issue-386077124)。
* ARM嵌入式设备上用SRS，会比较难，但可以交叉编译，参考 [#1547](https://github.com/ossrs/srs/issues/1547#issue-543780097)。

## RaspberryPi

SRS可以直接在`RespberryPI`上编译和运行，不用交叉编译。参考 [#1282](https://github.com/ossrs/srs/issues/1282#issue-386077124)。

<a name="armv8-and-aarch64"></a>

## ARM Server: armv7, armv8(aarch64)

SRS可以直接在ARM Server上编译和运行，不用交叉编译。参考 [#1282](https://github.com/ossrs/srs/issues/1282#issue-386077124)。

```
./configure && make
```

如果想编译出arm的二进制，在arm服务器上运行，比如在mac上编译出二进制后放在鲲鹏服务器上跑，也可以用arm docker编译，参考[aarch64](https://github.com/ossrs/dev-docker/tree/aarch64#usage)。

```
docker run -it --rm -v `pwd`:/srs -w /srs ossrs/srs:aarch64 \
    bash -c "./configure && make"
```

对于龙芯和鲲鹏等armv8平台，可能无法识别出来CPU，可以指定为armv8，参考[#1282](https://github.com/ossrs/srs/issues/1282#issuecomment-568891854)：

```bash
./configure --extra-flags='-D__aarch64__' && make
```

直接运行SRS：

```
./objs/srs -c conf/console.conf
```

推流到这个docker：

```
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://127.0.0.1:1935/live/livestream
```

播放：http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream&server=localhost&port=1935&autostart=true&vhost=localhost

![image](https://user-images.githubusercontent.com/2777660/72774670-7108c980-3c46-11ea-9e8b-d4fb3a475ea2.png)

<a name="ubuntu-cross-build-srs"></a>

## Ubuntu Cross Build SRS: ARMv8(aarch64)

!!! 注意，请先确认是否需要交叉编译，一般可以直接编译，除非极少数情况，参考[#1547](https://github.com/ossrs/srs/issues/1547#issue-543780097)。

启动容器Ubuntu20(xenial)，主目录为SRS：

```
cd ~/git/srs/trunk
docker run --rm -it -v `pwd`:/srs -w /srs \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:ubuntu20 bash
```

> 推荐使用阿里云的容器，下载的速度比较快，也可以使用docker官方容器：`ossrs/srs:ubuntu20`

安装toolchain(容器已经安装好了)：

```
apt-get install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
```

交叉编译SRS：

```
./configure --cross-build --cross-prefix=aarch64-linux-gnu-
make
```

> 编译时，默认会重新交叉编译OpenSSL，而不会使用系统的SSL，如果需要强制使用系统的SSL，可以用`--use-sys-ssl`。

> 若编译时无法识别出aarch64，可以在configure时加编译选项`--extra-flags='-D__aarch64__'`，一般没有这个问题。

在ARMv8(aarch64)的docker上跑SRS：https://hub.docker.com/r/arm64v8/ubuntu

```
cd ~/git/srs/trunk && docker run --rm -it -v `pwd`:/srs -w /srs \
    -p 1935:1935 -p 1985:1985 -p 8080:8080 arm64v8/ubuntu \
    ./objs/srs -c conf/console.conf
```

推流到这个docker：

```
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://127.0.0.1:1935/live/livestream
```

播放：http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream&server=localhost&port=1935&autostart=true&vhost=localhost

## Ubuntu Cross Build SRS: ARMv7

!!! 注意，请先确认是否需要交叉编译，一般可以直接编译，除非极少数情况，参考[#1547](https://github.com/ossrs/srs/issues/1547#issue-543780097)。

启动容器Ubuntu20(xenial)，主目录为SRS：

```
cd ~/git/srs/trunk
docker run --rm -it -v `pwd`:/srs -w /srs \
    registry.cn-hangzhou.aliyuncs.com/ossrs/srs:ubuntu20 bash
```

> 推荐使用阿里云的容器，下载的速度比较快，也可以使用docker官方容器：`ossrs/srs:ubuntu20`

安装toolchain(容器已经安装好了)，例如[Acqua or RoadRunner board](https://www.acmesystems.it/arm9_toolchain)

```
apt-get install -y gcc-arm-linux-gnueabihf g++-arm-linux-gnueabihf
```

交叉编译SRS：

```
./configure --cross-build --cross-prefix=arm-linux-gnueabihf-
make
```

> 编译时，默认会重新交叉编译OpenSSL，而不会使用系统的SSL，如果需要强制使用系统的SSL，可以用`--use-sys-ssl`。

在ARMv7的docker上跑SRS：https://hub.docker.com/r/armv7/armhf-ubuntu

```
cd ~/git/srs/trunk && docker run --rm -it -v `pwd`:/srs -w /srs \
    -p 1935:1935 -p 1985:1985 -p 8080:8080 armv7/armhf-ubuntu \
    ./objs/srs -c conf/console.conf
```

推流到这个docker：

```
ffmpeg -re -i doc/source.flv -c copy -f flv rtmp://127.0.0.1:1935/live/livestream
```

播放：http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream&server=localhost&port=1935&autostart=true&vhost=localhost

## Ubuntu Cross Build SRS: ARMv7(hisiv500)

首先，找一台Ubuntu20的虚拟机，或者启动Docker：

```bash
docker run --rm -it -v $(pwd):/srs -w /srs/trunk \
  registry.cn-hangzhou.aliyuncs.com/ossrs/srs:ubuntu20 bash
```

宿主机是64位的，而编译工具是32位的，所以需要安装一个工具：

```bash
apt-get -y install lib32z1-dev
```

然后，从[海思](https://www.hisilicon.com/)下载交叉编译工具，或者从网上找地方下载。解压后安装：

```bash
chmod +x arm-hisiv500-linux.install
./arm-hisiv500-linux.install
source /etc/profile
```

验证环境， 执行`which arm-hisiv500-linux-g++`能成功找到编译器，就安装成功了：

```bash
which arm-hisiv500-linux-g++
# /opt/hisi-linux/x86-arm/arm-hisiv500-linux/target/bin/arm-hisiv500-linux-g++
```

编译SRS，命令如下：

```bash
./configure --cross-build --cross-prefix=arm-hisiv500-linux-
make
```

在海思的板子启动SRS就可以了：

```bash
./objs/srs -c conf/console.conf
```

## Use Other Cross build tools

!!! 注意，请先确认是否需要交叉编译，一般可以直接编译，除非极少数情况，参考[#1547](https://github.com/ossrs/srs/issues/1547#issue-543780097)。

SRS相关的参数如下：

```bash
./configure -h

Presets:
  --cross-build             Enable cross-build, please set bellow Toolchain also. Default: off
  
Cross Build options:        @see https://ossrs.net/lts/zh-cn/docs/v4/doc/arm#ubuntu-cross-build-srs
  --cpu=<CPU>               Toolchain: Select the minimum required CPU. For example: --cpu=24kc
  --arch=<ARCH>             Toolchain: Select architecture. For example: --arch=aarch64
  --host=<BUILD>            Toolchain: Build programs to run on HOST. For example: --host=aarch64-linux-gnu
  --cross-prefix=<PREFIX>   Toolchain: Use PREFIX for tools. For example: --cross-prefix=aarch64-linux-gnu-

Toolchain options:
  --static=on|off           Whether add '-static' to link options. Default: off
  --cc=<CC>                 Toolchain: Use c compiler CC. Default: gcc
  --cxx=<CXX>               Toolchain: Use c++ compiler CXX. Default: g++
  --ar=<AR>                 Toolchain: Use archive tool AR. Default: g++
  --ld=<LD>                 Toolchain: Use linker tool LD. Default: g++
  --randlib=<RANDLIB>       Toolchain: Use randlib tool RANDLIB. Default: g++
  --extra-flags=<EFLAGS>    Set EFLAGS as CFLAGS and CXXFLAGS. Also passed to ST as EXTRA_CFLAGS.
```

具体使用例子参考[这里](#ubuntu-cross-build-srs)

**--extra-flags**

之前在支持ARM时，新增过一个Flags的选项( https://github.com/ossrs/srs/issues/1282#issuecomment-568891854 )，会设置`CFLAGS and CXXFLAGS`，也会将这个设置传递到ST设置`EXTRA_CFLAGS`。同样，对于交叉编译，这个选项也是有效的。

Winlin 2014.2

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/arm)


