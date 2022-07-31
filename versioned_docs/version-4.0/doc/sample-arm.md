---
title: ARM Deploy
sidebar_label: ARM Deploy
hide_title: false
hide_table_of_contents: false
---

# SRS ARM deploy example

SRS can deploy on ARM linux. SRS provides srs-librtmp as client library for ARM.

Compile and build ARM, read [SrsLinuxArm](./arm),
this artical describes how to deploy.

**Suppose the IP of ubuntu12: 192.168.1.170**

**Suppose the ARM device running in VirtualBox 1935 mapped to Ubuntu12 19350, 22 mapped to 2200.
That is, we can access Ubuntu12 19350 to access the ARM 1935, while the Ubuntu 2200 for ARM 22.**

For more information, read [SrsLinuxArm](./arm)

> Note: We need to patch ST, read [ST#1](https://github.com/ossrs/state-threads/issues/1) and [SrsLinuxArm](./arm#st-arm-bug-fix)

## Ubuntu12 cross build SRS

### Step 1, get SRS

For detail, read [GIT](./git)

```bash
git clone https://github.com/ossrs/srs
cd srs/trunk
```

Or update the exists code:

```bash
git pull
```

### Step 2, build SRS

For detail, read [SrsLinuxArm](./arm)

```bash
./configure --cross-build && make
```

> Note: To directly build on ARM device, for example RaspberryPi, use `./configure` instead. For others, please read [SrsLinuxArm](./arm)

### Step 3, send SRS to ARM virtual machine

For detail, read [SrsLinuxArm](./arm)

```bash
# Password is：root
scp -P 2200 objs/srs  root@localhost:~
scp -P 2200 conf/rtmp.conf root@localhost:~
```

## Start SRS on ARM

Login to Ubuntu 2200, we are on ARM:

### Step 4, start SRS

For detail, read [SrsLinuxArm](./arm)

```bash
./objs/srs -c conf/rtmp.conf
```

### Step 5, start Encoder

For detail, read [SrsLinuxArm](./arm)

Use FFMPEG to publish stream:

```bash
    for((;;)); do \
        ./objs/ffmpeg/bin/ffmpeg -re -i ./doc/source.flv \
        -c copy \
        -f flv rtmp://192.168.1.170:19350/live/livestream; \
        sleep 1; \
    done
```

Or use FMLE to publish stream:

```bash
FMS URL: rtmp://192.168.1.170:19350/live
Stream: livestream
```

## User Machine

Play RTMP stream on user machine.

### Step 6, play RTMP stream

RTMP url is: `rtmp://192.168.1.170:19350/live/livestream`

User can use vlc to play the RTMP stream.

Or, use online SRS player: [srs-player][srs-player]

Note: Please replace all ip 192.168.1.170 to your server ip.

Winlin 2014.11

[nginx]: http://192.168.1.170:8080/nginx.html
[srs-player]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=1935
[srs-player-19350]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream&port=19350
[srs-player-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?vhost=__defaultVhost__&autostart=true&server=192.168.1.170&app=live&stream=livestream_ff
[jwplayer]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
[jwplayer-ff]: http://ossrs.net/srs.release/trunk/research/players/srs_player.html?app=live&stream=livestream_ff.m3u8&server=192.168.1.170&port=8080&autostart=true&vhost=192.168.1.170&schema=http&hls_autostart=true&hls_port=8080
![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-4/doc/sample-arm)


