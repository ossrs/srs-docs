---
title: ARM 部署
sidebar_label: ARM 部署
hide_title: false
hide_table_of_contents: false
---

# ARM上部署SRS实例

SRS可以在ARM上作为服务器运行，播放器可以从ARM设备上取流播放。

一般的ARM都可以直接编译，使用和上面的方法是一样的。
某些编译非常慢，或者没有编译器的嵌入式平台，才需要交叉编译，请参考[这里](./arm.md).

## Build SRS directly

### 第一步，获取SRS。

详细参考[GIT获取代码](./git.md)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

或者使用git更新已有代码：

```bash
git pull
```

### 第二步，编译SRS

详细参考：[SrsLinuxArm](./arm.md)

```bash
./configure && make
```

## Run SRS on ARM

### 第三步，启动SRS

详细参考：[SrsLinuxArm](./arm.md)

```bash
./objs/srs -c conf/srs.conf
```

### 第四步，启动推流编码器

详细参考：[SrsLinuxArm](./arm.md)

使用FFMPEG命令推流：

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170/live/livestream; \
        sleep 1; \
    done
```

## Play Stream

在用户的Windows机器上观看流。

### 第五步，观看RTMP流

RTMP流地址为：`rtmp://192.168.1.170/live/livestream`

可以使用VLC观看。

或者使用在线SRS播放器播放：[srs-player](https://ossrs.net/players/srs_player.html)

备注：请将所有实例的IP地址192.168.1.170都换成部署的服务器IP地址。

Winlin 2014.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v6/sample-arm)


