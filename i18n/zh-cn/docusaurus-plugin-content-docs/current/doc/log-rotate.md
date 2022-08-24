---
title: 日志切割
sidebar_label: 日志切割
hide_title: false
hide_table_of_contents: false
---

# LogRotate

Log Rotate就是日志切割，服务器日志越来越大，如何压缩日志，或者丢弃古老的日志？SRS讲日志管理交给外部系统，提供了接口可以切割日志。

1. 首先，将日志文件挪走，譬如：```mv objs/srs.log /tmp/srs.`date +%s`.log```
1. 然后，发送信号给SRS，SRS重新打开日志文件，譬如 `killall -s SIGUSR1`，SRS会关闭之前的fd，重新打开日志文件并写入。
1. 对挪动后的日志文件处理，可以压缩存储，传输，或者删除。

## Use logrotate

推荐使用程序[logrotate](https://www.jianshu.com/p/ec7f1626a3d3)管理日志文件，支持压缩和删除过期的文件。

1. 安装logrotate:

```
sudo yum install -y logrotate
```

1. 配置logrotate管理SRS的日志文件：

```
cat << END > /etc/logrotate.d/srs
/usr/local/srs/objs/srs.log {
    daily
    dateext
    compress
    rotate 7
    size 1024M
    sharedscripts
    postrotate
        kill -USR1 `cat /usr/local/srs/objs/srs.pid`
    endscript
}
END
```

> 备注：可以手动执行命令触发日志切割 `logrotate -f /etc/logrotate.d/srs`

## CopyTruncate

logrotate还有一种方式是[copytruncate](https://unix.stackexchange.com/questions/475524/how-copytruncate-actually-works)，
**墙裂不推荐这种方式**因为会丢日志，但是它适用于不支持SIGUSR1信号的SRS2。

> 当然SRS3也是可以用这种方式，如果能接受丢日志的话；但是强烈建议不要用这种方式，仅仅作为SRS2的workaround方案。

配置如下，感谢[wnpllrzodiac](https://github.com/wnpllrzodiac)提交的[PR#1561](https://github.com/ossrs/srs/pull/1561#issuecomment-571408173)：

```
cat << END > /etc/logrotate.d/srs
/usr/local/srs/objs/srs.log {
    daily
    dateext
    compress
    rotate 7
    size 1024M
    copytruncate
}
END
```

Winlin 2016.12

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/log-rotate)


