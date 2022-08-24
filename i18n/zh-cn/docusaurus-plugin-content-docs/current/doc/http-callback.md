---
title: HTTP回调
sidebar_label: HTTP回调
hide_title: false
hide_table_of_contents: false
---

# HTTP Callback

服务器端定制的实现方式，就是HTTP回调。譬如当客户端连接到SRS时，回调指定的http地址，这样可以实现验证功能。

关于Token认证，即基于http回调的认证，参考：[Token Authentication](./drm#token-authentication)

## Compile

SRS总是开启HttpCallback。

参考：[Build](./install)

## Config SRS

http hooks的配置如下：

```bash
vhost your_vhost {
    http_hooks {
        # whether the http hooks enable.
        # default off.
        enabled         on;
        # when client connect to vhost/app, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_connect",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "tcUrl": "rtmp://video.test.com/live?key=d2fa801d08e3f90ed1e1670e6e52651a",
        #           "pageUrl": "http://www.test.com/live.html"
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        # support multiple api hooks, format:
        #       on_connect http://xxx/api0 http://xxx/api1 http://xxx/apiN
        # @remark For SRS4, the HTTPS url is supported, for example:
        #       on_connect https://xxx/api0 https://xxx/api1 https://xxx/apiN
        on_connect      http://127.0.0.1:8085/api/v1/clients http://localhost:8085/api/v1/clients;
        # when client close/disconnect to vhost/app/stream, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_close",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "send_bytes": 10240, "recv_bytes": 10240
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        # support multiple api hooks, format:
        #       on_close http://xxx/api0 http://xxx/api1 http://xxx/apiN
        # @remark For SRS4, the HTTPS url is supported, for example:
        #       on_close https://xxx/api0 https://xxx/api1 https://xxx/apiN
        on_close        http://127.0.0.1:8085/api/v1/clients http://localhost:8085/api/v1/clients;
        # when client(encoder) publish to vhost/app/stream, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_publish",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "stream": "livestream", "param":"?token=xxx&salt=yyy"
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        # support multiple api hooks, format:
        #       on_publish http://xxx/api0 http://xxx/api1 http://xxx/apiN
        # @remark For SRS4, the HTTPS url is supported, for example:
        #       on_publish https://xxx/api0 https://xxx/api1 https://xxx/apiN
        on_publish      http://127.0.0.1:8085/api/v1/streams http://localhost:8085/api/v1/streams;
        # when client(encoder) stop publish to vhost/app/stream, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_unpublish",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "stream": "livestream", "param":"?token=xxx&salt=yyy"
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        # support multiple api hooks, format:
        #       on_unpublish http://xxx/api0 http://xxx/api1 http://xxx/apiN
        # @remark For SRS4, the HTTPS url is supported, for example:
        #       on_unpublish https://xxx/api0 https://xxx/api1 https://xxx/apiN
        on_unpublish    http://127.0.0.1:8085/api/v1/streams http://localhost:8085/api/v1/streams;
        # when client start to play vhost/app/stream, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_play",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "stream": "livestream", "param":"?token=xxx&salt=yyy",
        #           "pageUrl": "http://www.test.com/live.html"
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        # support multiple api hooks, format:
        #       on_play http://xxx/api0 http://xxx/api1 http://xxx/apiN
        # @remark For SRS4, the HTTPS url is supported, for example:
        #       on_play https://xxx/api0 https://xxx/api1 https://xxx/apiN
        on_play         http://127.0.0.1:8085/api/v1/sessions http://localhost:8085/api/v1/sessions;
        # when client stop to play vhost/app/stream, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_stop",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "stream": "livestream", "param":"?token=xxx&salt=yyy"
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        # support multiple api hooks, format:
        #       on_stop http://xxx/api0 http://xxx/api1 http://xxx/apiN
        # @remark For SRS4, the HTTPS url is supported, for example:
        #       on_stop https://xxx/api0 https://xxx/api1 https://xxx/apiN
        on_stop         http://127.0.0.1:8085/api/v1/sessions http://localhost:8085/api/v1/sessions;
        # when srs reap a dvr file, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_dvr",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "stream": "livestream", "param":"?token=xxx&salt=yyy",
        #           "cwd": "/usr/local/srs",
        #           "file": "./objs/nginx/html/live/livestream.1420254068776.flv"
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        on_dvr          http://127.0.0.1:8085/api/v1/dvrs http://localhost:8085/api/v1/dvrs;
        # when srs reap a ts file of hls, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_hls",
        #           "client_id": 1985,
        #           "ip": "192.168.1.10", "vhost": "video.test.com", "app": "live",
        #           "stream": "livestream", "param":"?token=xxx&salt=yyy",
        #           "duration": 9.36, // in seconds
        #           "cwd": "/usr/local/srs",
        #           "file": "./objs/nginx/html/live/livestream/2015-04-23/01/476584165.ts",
        #           "url": "live/livestream/2015-04-23/01/476584165.ts",
        #           "m3u8": "./objs/nginx/html/live/livestream/live.m3u8",
        #           "m3u8_url": "live/livestream/live.m3u8",
        #           "seq_no": 100
        #       }
        # if valid, the hook must return HTTP code 200(Status OK) and response
        # an int value specifies the error code(0 corresponding to success):
        #       0
        on_hls          http://127.0.0.1:8085/api/v1/hls http://localhost:8085/api/v1/hls;
        # when srs reap a ts file of hls, call this hook,
        # used to push file to cdn network, by get the ts file from cdn network.
        # so we use HTTP GET and use the variable following:
        #       [app], replace with the app.
        #       [stream], replace with the stream.
        #       [param], replace with the param.
        #       [ts_url], replace with the ts url.
        # ignore any return data of server.
        # @remark random select a url to report, not report all.
        on_hls_notify   http://127.0.0.1:8085/api/v1/hls/[app]/[stream]/[ts_url][param];
    }
}
```

备注：可以参考conf/full.conf配置文件中的hooks.callback.vhost.com实例。

## Protocol

HTTP回调的格式如下，以`on_publish`为例：

```text
POST /api/v1/streams HTTP/1.1
Content-Type: application-json

Body:
{
  "server_id": "vid-0xk989d",
  "action": "on_publish",
  "client_id": "341w361a",
  "ip": "127.0.0.1",
  "vhost": "__defaultVhost__",
  "app": "live",
  "tcUrl": "rtmp://127.0.0.1:1935/live?vhost=__defaultVhost__",
  "stream": "livestream",
  "param": ""
}
```

> Note: 也可以用wireshark或tcpdump抓包验证。

## Go Example

使用Go处理SRS的回调，以`on_publish`为例：

```go
http.HandleFunc("/api/v1/streams", func(w http.ResponseWriter, r *http.Request) {
    b, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }

    fmt.Println(string(b))

    res, err := json.Marshal(struct {
        Code int `json:"code"`
        Message string `json:"msg"`
    }{
        0, "OK",
    })
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
    w.Write(res)
})

_ = http.ListenAndServe(":8085", nil)
```

## Nodejs Koa Example

使用Nodejs/Koa处理SRS的回调，以`on_publish`为例：

```js
const Router = require('koa-router');
const router = new Router();

router.all('/api/v1/streams', async (ctx) => {
  console.log(ctx.request.body);
  
  ctx.body = {code: 0, msg: 'OK'};
});
```

## PHP Example

使用PHP处理SRS的回调，以`on_publish`为例：

```php
$body = json_decode(file_get_contents('php://input'));
printf($body);

echo json_encode(array("code"=>0, "msg"=>"OK"));
```

## HTTP callback events
 
SRS的回调事件包括：

| 事件 | 数据 | 说明 |
| --- | ---- | ---- |
| on_connect|{<br/> "action": "on_connect",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "tcUrl": "rtmp://x/x?key=xxx",<br/> "pageUrl": "http://x/x.html"<br/> } | 当客户端连接到指定的vhost和app时| 
| on_close|{<br/> "action": "on_close",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live", <br/> "send_bytes": 10240, <br/> "recv_bytes": 10240 <br/> } | 当客户端关闭连接，或者SRS主动关闭连接时| 
| on_publish|{<br/> "action": "on_publish",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream"<br/> } | 当客户端发布流时，譬如flash/FMLE方式推流到服务器| 
| on_unpublish|{<br/> "action": "on_unpublish",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream"<br/> } | 当客户端停止发布流时| 
| on_play|{<br/> "action": "on_play",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream",<br/> "pageUrl": "http://a.com/i.html",<br/>"param":"?k=v"<br/> } | 当客户端开始播放流时| 
| on_stop|{<br/> "action": "on_stop",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream"<br/> } | 当客户端停止播放时 |
| on_dvr|{<br/> "action": "on_dvr",<br/> "client_id": 1985,<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream",<br/> "cwd": "/opt",<br/> "file": "./l.xxx.flv"<br/> } | 当DVR录制关闭一个flv文件时|

其中，
* 事件：发生该事件时，即回调指定的HTTP地址。
* HTTP地址：可以支持多个，以空格分隔，SRS会依次回调这些接口。
* 数据：SRS将数据POST到HTTP接口。
* 返回值：SRS要求HTTP服务器返回HTTP200并且response内容为整数错误码（0表示成功），其他错误码会断开客户端连接。

## SRS HTTP Callback Server

SRS自带了一个默认的处理HTTP Callback的服务器，启动时需要指定端口，譬如8085端口。

启动方法：`python research/api-server/server.py 8085`

启动日志如下：

```bash
[winlin@dev6 srs]$ python research/api-server/server.py 8085
[2014-02-27 09:42:25][trace] api server listen at port: 8085, static_dir: /home/winlin/git/srs/trunk/research/api-server/static-dir
[2014-02-27 09:42:25][trace] start cherrypy server
[27/Feb/2014:09:42:25] ENGINE Listening for SIGHUP.
[27/Feb/2014:09:42:25] ENGINE Listening for SIGTERM.
[27/Feb/2014:09:42:25] ENGINE Listening for SIGUSR1.
[27/Feb/2014:09:42:25] ENGINE Bus STARTING
[27/Feb/2014:09:42:25] ENGINE Started monitor thread '_TimeoutMonitor'.
[27/Feb/2014:09:42:25] ENGINE Started monitor thread 'Autoreloader'.
[27/Feb/2014:09:42:25] ENGINE Serving on 0.0.0.0:8085
[27/Feb/2014:09:42:25] ENGINE Bus STARTED
```

> Remark: For SRS4, the HTTP/HTTPS url is supported, see [#1657](https://github.com/ossrs/srs/issues/1657#issuecomment-720889906).

## HTTPS Callback

SRS4支持HTTPS回调，只需要简单的将回调地址，从`http://`改成`https://`即可，比如：

```
vhost your_vhost {
    http_hooks {
        enabled         on;
        on_connect      https://127.0.0.1:8085/api/v1/clients;
        on_close        https://127.0.0.1:8085/api/v1/clients;
        on_publish      https://127.0.0.1:8085/api/v1/streams;
        on_unpublish    https://127.0.0.1:8085/api/v1/streams;
        on_play         https://127.0.0.1:8085/api/v1/sessions;
        on_stop         https://127.0.0.1:8085/api/v1/sessions;
        on_dvr          https://127.0.0.1:8085/api/v1/dvrs;
        on_hls          https://127.0.0.1:8085/api/v1/hls;
        on_hls_notify   https://127.0.0.1:8085/api/v1/hls/[app]/[stream]/[ts_url][param];
    }
}
```

## Publish and Play

推流到SRS时，会调用HTTP接口：
```bash
[2014-02-27 09:41:33][trace] post to clients, req={"action":"on_connect","client_id":4,"ip":"192.168.1.179","vhost":"__defaultVhost__","app":"live","pageUrl":""}
[2014-02-27 09:41:33][trace] srs on_connect: client id=4, ip=192.168.1.179, vhost=__defaultVhost__, app=live, pageUrl=
127.0.0.1 - - [27/Feb/2014:09:41:33] "POST /api/v1/clients HTTP/1.1" 200 1 "" "srs(simple rtmp server)0.9.2"
```

播放SRS的流时，也会调用HTTP接口：
```bash
[2014-02-27 09:41:50][trace] post to clients, req={"action":"on_connect","client_id":5,"ip":"192.168.1.179","vhost":"__defaultVhost__","app":"live","pageUrl":"http://dev.chnvideo.com:3080/players/rtmp/"}
[2014-02-27 09:41:50][trace] srs on_connect: client id=5, ip=192.168.1.179, vhost=__defaultVhost__, app=live, pageUrl=http://dev.chnvideo.com:3080/players/rtmp/
127.0.0.1 - - [27/Feb/2014:09:41:50] "POST /api/v1/clients HTTP/1.1" 200 1 "" "srs(simple rtmp server)0.9.2"
```

## Response

如果回调成功，必须响应正确的格式的数值，否则就会返回错误给客户端导致推流或播放失败。也可以参考[HTTP API](./http-api#error-code)。格式是：

* HTTP/200, 必须返回200否则认为是错误。
* 并且，响应的内容必须是int值0，或者是JSON对象带字段code值为0。

比如：

```
HTTP/1.1 200 OK
Content-Length: 1
0
```

或者：

```
HTTP/1.1 200 OK
Content-Length: 11
{"code": 0}
```

可以查看实例回调的响应：

```
cd srs/trunk
python research/api-server/server.py 8085
```

你会明白什么是正确的响应格式。

## Snapshot

HttpCallback也可以用来截图，参考[snapshot](./snapshot#httpcallback)

Winlin 2015.1

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/zh/v5/http-callback)


