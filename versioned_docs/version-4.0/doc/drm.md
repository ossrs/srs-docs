---
title: DRM
sidebar_label: DRM
hide_title: false
hide_table_of_contents: false
---

# DRM

DRM use to protect the content, can use many strategys:
* Refer Autisuck: Check the refer(PageUrl) of RTMP connect params, which is set by flash player.
* Token Authentication: Check the token of RTMP connect params, SRS can use http-callback to verify the token.
* FMS token tranverse: Edge server will verify each connection on origin server.
* Access Server: Adobe Access Server.
* Publish Authentication: The authentication protocol for publish.

## Refer Autisuck

SRS support config the refer to antisuck.

When play RTMP url, adobe flash player will send the page url in the connect params PageUrl, 
which is cannot changed by as code, server can check the web page url to ensure the user is ok.

While user use client application, the PageUrl can be any value, for example, 
use srs-librtmp to play RTMP url, the Refer antisuck is not work.

To config the refer antisuck in srs:

```bash
# the vhost for antisuck.
vhost refer.anti_suck.com {
    # refer hotlink-denial.
    refer {
        # whether enable the refer hotlink-denial.
        # default: off.
        enabled         on;
        # the common refer for play and publish.
        # if the page url of client not in the refer, access denied.
        # if not specified this field, allow all.
        # default: not specified.
        all           github.com github.io;
        # refer for publish clients specified.
        # the common refer is not overrided by this.
        # if not specified this field, allow all.
        # default: not specified.
        publish   github.com github.io;
        # refer for play clients specified.
        # the common refer is not overrided by this.
        # if not specified this field, allow all.
        # default: not specified.
        play      github.com github.io;
    }
}
```

Remark: SRS3 use new style config for refer, which is compatible with SRS1/2.

## Token Authentication

The token authentication similar to refer, but the token is put in the url, not in the args of connect:
* Put token in RTMP url, for example, `rtmp://vhost/app?token=xxxx/stream`, SRS will pass the token 
in the http-callback. read [HTTP callback](./http-callback)
* Put token in the connect args, for example, as code NetConnection.connect(url, token), need to modify SRS code.

Token is robust then refer, can specifies more params, for instance, the expire time.

For example:

1. When user access the web page, web application server can generate a token in the RTMP url, for example,
token = md5(time + id + salt + expire) = 88195f8943e5c944066725df2b1706f8
1. The RTMP url to play is, for instance, rtmp://192.168.1.10/live?time=1402307089&expire=3600&token=88195f8943e5c944066725df2b1706f8/livestream
1. Config the http callback of SRS `on_connect http://127.0.0.1:8085/api/v1/clients;`, 
read [HTTP callback](./http-callback#config-srs)
1. When user play stream, SRS will callback the url with token to verify,
if invalid, the http callback can return none zero which indicates error.

## TokenTraverse

The FMS token tranverse is when user connect to edge server, 
the edge server will send the client info which contains token
to origin server to verify. It seems that the token from client
tranverse from edge to origin server.

FMS edge and origin use private protocol, use a connection to fetch data, 
another to transport the control message, for example, the token tranverse
is a special command, @see https://github.com/ossrs/srs/issues/104

Recomment the token authentication to use http protocol;
the token tranverse must use RTMP protocol, so many RTMP servers do not 
support the token tranverse.

SRS supports token tranverse like FMS, but SRS always create a new connection
to verify the client info on origin server.

THe config for token tranverse, see `edge.token.traverse.conf`：

```bash
listen              1935;
vhost __defaultVhost__ {
    cluster {
        mode            remote;
        origin          127.0.0.1:19350;
        token_traverse  on;
    }
}
```

## Access Server

SRS does not support.

## Publish Authentication

SRS does not support.

Winlin 2015.8

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v4/drm)


