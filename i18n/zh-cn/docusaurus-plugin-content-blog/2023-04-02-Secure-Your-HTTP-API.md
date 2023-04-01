---
slug: secure-your-http-api
title: HTTP API如何支持鉴权
authors: []
tags: [api, security, http]
custom_edit_url: null
---

# How to Secure Your HTTP API

当你构建了SRS服务器后，你可以使用HTTP API来访问它，比如SRS控制台或者其他HTTP客户端。
但是，你应该保护好你的HTTP API，防止未授权的访问。
本文介绍如何保护你的HTTP API。

<!--truncate-->

## Usage

首先，请升级SRS到5.0.152+或者6.0.40+，这些版本支持HTTP API鉴权。

然后，请通过配置`http_api.auth`来启用HTTP Basic Authentication：

```nginx
# conf/http.api.auth.conf
http_api {
    enabled on;
    listen 1985;
    auth {
        enabled on;
        username admin;
        password admin;
    }
}
```

接着，用这个配置启动SRS：

```bash
./objs/srs -c conf/http.api.auth.conf
```

或者，通过环境变量设置用户名和密码：

```bash
env SRS_HTTP_API_ENABLED=on SRS_HTTP_SERVER_ENABLED=on \
    SRS_HTTP_API_AUTH_ENABLED=on SRS_HTTP_API_AUTH_USERNAME=admin SRS_HTTP_API_AUTH_PASSWORD=admin \
    ./objs/srs -e
```

现在，你可以访问下面的地址来验证：

* 提示输入用户名和密码：[http://localhost:1985/api/v1/versions](http://localhost:1985/api/v1/versions)
* 带用户名和密码的URL：[http://admin:admin@localhost:1985/api/v1/versions](http://admin:admin@localhost:1985/api/v1/versions)

要清除用户名和密码，你可以通过用户名访问HTTP API：

* [http://admin@localhost:1985/api/v1/versions](http://admin@localhost:1985/api/v1/versions)

> 注意：请注意，我们只针对HTTP API开启了鉴权，不包括HTTP服务器和WebRTC HTTP API。

## SRS Console

SRS控制台是一个基于SRS的HTTP API的Web应用，它可以让你方便的管理SRS服务器。
当SRS启动后，你可以访问SRS控制台：
[http://localhost:8080/console/](http://localhost:8080/console/)

如果你开启了HTTP API鉴权，你可以在访问控制台URL时带上用户名和密码：
[http://admin:admin@localhost:8080/console/](http://admin:admin@localhost:8080/console/)

否则，浏览器会提示输入用户名和密码。

## For SRS 4.0

SRS 4.0不支持HTTP API鉴权，有些可选的解决方案。
你可以用Nginx来做反向代理，然后在Nginx中配置鉴权。
或者用Go语言编写一个简单的HTTP代理。

```text
Browser ---HTTP-with-Authentication---> Nginx ---HTTP---> SRS 4.0
```

你需要修改HTTP API侦听的端口，比如：

```nginx
http_api {
    enabled on;
    listen 127.0.0.1:1985;
}
```

这样，HTTP API就只能被本机的代理访问了。

## About WebRTC API Security

SRS不支持WebRTC相关的HTTP API的鉴权，因为WebRTC鉴权是通过HTTP回调来实现的。

请参考[WebRTC回调](/docs/v5/doc/http-callback)和[Token鉴权](/docs/v5/doc/drm#token-authentication)等文档。

## Conclusion

这篇文章是我和GitHub Copilot一起写的。
