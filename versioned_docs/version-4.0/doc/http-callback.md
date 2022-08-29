---
title: HTTP Callback
sidebar_label: HTTP Callback
hide_title: false
hide_table_of_contents: false
---

# HTTPCallback

SRS supports HTTP callback to extends SRS.

For token authentication based on HTTP callbacks, read [Token Authentication](./drm.md#token-authentication)

## Compile

SRS always enable http callbacks.

For more information, read [Build](./install.md)

## Configuring SRS

The config for HTTP hooks is:

```bash
vhost your_vhost {
    http_hooks {
        # whether the http hooks enable.
        # default off.
        enabled         on;
        # when client(encoder) publish to vhost/app/stream, call the hook,
        # the request in the POST data string is a object encode by json:
        #       {
        #           "action": "on_publish",
        #           "client_id": "9308h583",
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
        #           "client_id": "9308h583",
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
        #           "client_id": "9308h583",
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
        #           "client_id": "9308h583",
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
        #           "client_id": "9308h583",
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
        #           "client_id": "9308h583",
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

Note: For more information, read the section hooks.callback.vhost.com in conf/full.conf

## Protocol

The detail protocol, for example, `on_publish`:

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

> Note: You can use wireshark or tcpdump to verify it.

## Go Example

Write Go code to handle SRS callback, for example, handling `on_publish`:

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

Write Nodejs/Koa code to handle SRS callback, for example, handling `on_publish`:

```js
const Router = require('koa-router');
const router = new Router();

router.all('/api/v1/streams', async (ctx) => {
  console.log(ctx.request.body);

  ctx.body = {code: 0, msg: 'OK'};
});
```

## PHP Example

Write PHP code to handle SRS callback, for example, handling `on_publish`:

```php
$body = json_decode(file_get_contents('php://input'));
printf($body);

echo json_encode(array("code"=>0, "msg"=>"OK"));
```

## HTTP Callback Events

SRS can call HTTP callbacks for events:

| Event | Data | Description |
| --- | ---- | ---- |
| on_publish|{<br/> "action": "on_publish",<br/> "client_id": "9308h583",<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream"<br/> } | When a client publishes a stream, for example, using flash or FMLE to publish a stream to the server.| 
| on_unpublish|{<br/> "action": "on_unpublish",<br/> "client_id": "9308h583",<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream"<br/> } | When a client stops publishing a stream.| 
| on_play|{<br/> "action": "on_play",<br/> "client_id": "9308h583",<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream",<br/> "pageUrl": "http://a.com/i.html",<br/>"param":"?k=v"<br/> } | When a client starts playing a stream.| 
| on_stop|{<br/> "action": "on_stop",<br/> "client_id": "9308h583",<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream"<br/> } | When a client stops playback.| 
| on_dvr|{<br/> "action": "on_dvr",<br/> "client_id": "9308h583",<br/> "ip": "192.168.1.10", <br/> "vhost": "video.test.com", <br/> "app": "live",<br/> "stream": "livestream",<br/> "cwd": "/opt",<br/> "file": "./l.xxx.flv"<br/> } | When reap a DVR file.|

Notes:
* Event: When this event occurs, call back to the specified HTTP URL.
* HTTP URL: Can be multiple URLs, split by spaces, SRS will notify all one by one.
* Data: SRS will POST the data to specified HTTP API.
* Return Code: SRS requires that the response is an int indicating the error, 0 is success.
SRS will disconnect the connection when the response is not 0, or HTTP status is not 200.

## SRS HTTP Callback Server

SRS provides a default HTTP callback server, using cherrypy.

To start it: `python research/api-server/server.py 8085`

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

HTTPS Callback is supported by SRS4, only change the callback URL from `http://` to `https://`, for example:

```
vhost your_vhost {
    http_hooks {
        enabled         on;
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

## Response

If success, you must response `something` to identify the success, or SRS will reject the client, which enable you to reject the illegal client, please read [Callback Error Code](./http-api.md#error-code). 

> Note: The `on_publish` callback also could be used as advanced security, to `allow` or `deny` a client by its IP, or token in request url, or any other information of client.

Where `something` means:

* HTTP/200, which is HTTP success.
* `AND` response and int value 0, or JSON object with field code 0.

Like this:

```
HTTP/1.1 200 OK
Content-Length: 1
0
```

OR:

```
HTTP/1.1 200 OK
Content-Length: 11
{"code": 0}
```

You could run the example HTTP callback server by:

```
cd srs/trunk
python research/api-server/server.py 8085
```

And you will finger out what's the `right` response.

## Snapshot

The HttpCallback can used to snapshot, please read [snapshot](./snapshot.md#httpcallback)

Winlin 2015.1

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v4/http-callback)


