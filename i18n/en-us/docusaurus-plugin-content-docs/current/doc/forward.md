---
title: Forward
sidebar_label: Forward 
hide_title: false
hide_table_of_contents: false
---

# Forward For Small Cluster

SRS is design for live server, the forward is a important feature, used to 
forward stream on server to other live servers.

Note: The information about edge, read [Edge](./edge),
the best solution for large cluster and huge concurrency.

Note: The edge is for both play and publish.

Note: Use edge first, except need to copy a stream to multiple servers in a time.

The forward is used for fault backup, the origin can forward a stream to multiple origin servers, 
the edge can use multiple origin server for backup.

For the usage of forward, read [Usage: Forward](./sample-forward)

## Keywords

The forward defined some roles:

* master: The master server which forward stream to slave server.
* slave: The slave server which accept stream from master.

Although the origin/edge can be master/slave, but it is too complex, it is strongly recomments that
the forward(master/slave) only for origin, never use edge to forward stream.

## Config

Please refer to the vhost `same.vhost.forward.srs.com` of `full.conf`:

```
vhost __defaultVhost__ {
    # forward stream to other servers.
    forward {
        # whether enable the forward.
        # default: off
        enabled on;
        # forward all publish stream to the specified server.
        # this used to split/forward the current stream for cluster active-standby,
        # active-active for cdn to build high available fault tolerance system.
        # format: {ip}:{port} {ip_N}:{port_N}
        destination 127.0.0.1:1936 127.0.0.1:1937;
    }
}
```

## For Small Cluster

Forward can also used to build a small cluster:

```bash
                                   +-------------+    +---------------+
                               +-->+ Slave(1935) +->--+  Player(3000) +
                               |   +-------------+    +---------------+
                               |   +-------------+    +---------------+
                               |-->+ Slave(1936) +->--+  Player(3000) +
         publish       forward |   +-------------+    +---------------+
+-----------+    +--------+    |     192.168.1.6                       
|  Encoder  +-->-+ Master +-->-|                                       
+-----------+    +--------+    |   +-------------+    +---------------+
 192.168.1.3    192.168.1.5    +-->+ Slave(1935) +->--+  Player(3000) +
                               |   +-------------+    +---------------+
                               |   +-------------+    +---------------+
                               +-->+ Slave(1936) +->--+  Player(3000) +
                                   +-------------+    +---------------+
                                     192.168.1.7                          
```

The below sections is the example for this small cluster.

### Encoder

Use FFMPEG as encoder to publish stream to master:

```bash
for((;;)); do\
    ./objs/ffmpeg/bin/ffmpeg -re -i doc/source.flv \
        -c copy -f flv rtmp://192.168.1.5:1935/live/livestream; \
done
```

### SRS-Master Server

The SRS master server(192.168.1.5) config:

```bash
listen              1935;
pid                 ./objs/srs.pid;
max_connections     10240;
vhost __defaultVhost__ {
    forward {
        enabled on;
        destination 192.168.1.6:1935 192.168.1.6:1936 192.168.1.7:1935 192.168.1.7:1936;
    }
}
```

The RTMP play url on master is: `rtmp://192.168.1.5/live/livestream`

The master will forward stream to four slaves on two servers.

### SRS-Slave Server

The slave server can use different port to run on multiple cpu server.
The slave on the same server must use different port and pid file.

For example, the slave server 192.168.1.6, start two SRS servers, listen at 1935 and 1936.

The config file for port 1935 `srs.1935.conf`:

```bash
listen              1935;
pid                 ./objs/srs.1935.pid;
max_connections     10240;
vhost __defaultVhost__ {
}
```

The config file for port 1936 `srs.1936.conf`:

```bash
listen              1936;
pid                 ./objs/srs.1936.pid;
max_connections     10240;
vhost __defaultVhost__ {
}
```

Start these two SRS processes:

```bash
nohup ./objs/srs -c srs.1935.conf >/dev/null 2>&1 &
nohup ./objs/srs -c srs.1936.conf >/dev/null 2>&1 &
```

The player random access these streams:
* `rtmp://192.168.1.6:1935/live/livestream`
* `rtmp://192.168.1.6:1936/live/livestream`

The other slave server 192.168.1.7 is similar to 192.168.1.6

### Stream in Service

The stream in service:

| Url | Server | Port | Clients |
| ---- | ----- | ----- | ------- |
| rtmp://192.168.1.6:1935/live/livestream | 192.168.1.6 | 1935 | 3000 |
| rtmp://192.168.1.6:1936/live/livestream | 192.168.1.6 | 1936 | 3000 |
| rtmp://192.168.1.7:1935/live/livestream | 192.168.1.7 | 1935 | 3000 |
| rtmp://192.168.1.7:1936/live/livestream | 192.168.1.7 | 1936 | 3000 |

This architecture can support 12k clients. 
User can add more slave or start new ports.

## Forward VS Edge

The forward is not used in cdn, because CDN has thousands of servers, thousands of streams. 
The forward will always forward all stream to slave servers.

CDN or large cluster must use edge, never use forward.

## Other Use Scenarios

Forward used for transcoder, we can transcode a h.264+speex stream to a vhost, while this vhost forward
stream to slave. Then all stream on slave is h.264+aac, to delivery HLS.

Winlin 2014.11
![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-en-5/doc/forward)


