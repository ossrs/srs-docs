---
slug: BT-aaPanel
title: How to Setup a Video Streaming Service by aaPanel
authors: []
tags: [tutorial, bt, aapanel, streaming]
custom_edit_url: null
---

# How to Setup a Video Streaming Service by aaPanel

## Introduction

[aaPanel](https://www.aapanel.com) is a simple website and server management tool, similar to [cpanel.net](https://cpanel.net/), while aaPanel is free, open source and easy to develop plugins for developing media servers.

In this tutorial, you will learn how to deploy a live streaming media server, using aaPanel. If you have deployed websites using aaPanel, it's also possible to deploy an extra media server to power your website with live streaming service, for example, to enable live streaming feature for your WordPress website.

## Prerequisites

To complete this guide, you should have:

1. Got a linux server, with aaPanel installed. Please select CentOS 7+ or Ubuntu 20+ and install by [command here](https://www.aapanel.com/install.html).
2. If you also need to install websites, please use **NGINX** based framework, because [SRS Cloud](https://github.com/ossrs/srs-cloud) requires **NGINX** to proxy to our backend services.
3. If you want to use HTTPS, make sure you got a DNS domain name.

## Step 1: Install aaPanel

If you don't have aaPanel installed, please follow the [tutorial](https://www.aapanel.com/install.html). Highly recommend CentOS 7 to install aaPanel:

```bash
yum install -y wget &&
wget -O install.sh http://www.aapanel.com/script/install_6.0_en.sh &&
bash install.sh
```

After installed, you will get a url, username and password to login, for example:

```text
==================================================================
Congratulations! Installed successfully!
==================================================================
aaPanel Internet Address: http://159.223.85.157:7800/a954fbf9
username: f6nka6v8
password: 4b43d253
```

Visit the url in browser, it works as demonstrated below:

![](/img/blog-2022-04-29-en-001.png)

You could install your website like WordPress, however it's optional. In next step, let's install a media server by aaPanel for live streaming.

## Step 2: Install SRS Cloud

There are two ways to install SRS Cloud. If you could find the `SRS Cloud` plugin, you could install it directly, as following picture show:

![](/img/blog-2022-04-29-en-002.png)

If not found the plugin in store, you could also download the latest version of plugin [aapanel-srs_cloud.zip](https://github.com/ossrs/srs-cloud/releases/latest/download/aapanel-srs_cloud.zip), then you could upload the zip file and install the plugin, as demonstrated below:

![](/img/blog-2022-04-29-en-003.png)

Both will lead you to a installation guide, like this:

![](/img/blog-2022-04-29-en-004.png)

Please click the `Confirm to install` to continue to install the plugin. Next we will set-up SRS Cloud and install some dependencies.

## Step 3: Setup SRS Cloud

Please click the `Setting` button of `SRS Cloud` to continue the set-up:

![](/img/blog-2022-04-29-en-005.png)

Then click `Install SRS Cloud` and install the required softwares:

![](/img/blog-2022-04-29-en-006.png)

SRS Cloud requires NGINX, Nodejs and Docker, please install all of them:

![](/img/blog-2022-04-29-en-007.png)

After all dependencies installed, continue to install SRS Cloud:

![](/img/blog-2022-04-29-en-008.png)

When set-up ok, click the dashboard and visit the link:

![](/img/blog-2022-04-29-en-009.png)

Then set-up the admin password:

![](/img/blog-2022-04-29-en-010.png)

You could follow the tutorials to use SRS Cloud:

![](/img/blog-2022-04-29-en-011.png)

Now we have a media server and we could publish a live stream to the server and play it through WordPress.

## Step 4: Publish and Play Live Stream

Please open the `Scenario > Streaming > OBS or vMix` and follow the instructions:

![](/img/blog-2022-04-29-en-012.png)

Recommend to use OBS, please download from [here](https://obsproject.com/download), and configure the OBS from `Settings > Stream` to configure it:

![](/img/blog-2022-04-29-en-013.png)

Then click the `Start Streaming` to publish a live stream to your server. You could play the HTTP-FLV, HLS or WebRTC using Browser, or through WordPress:

```text
[srs_player url="http://159.223.85.157/live/livestream.m3u8"]
```

![](/img/blog-2022-04-29-en-014.png)

For detail about WordPress shortcodes, please read this [how to publish your SRS livestream through WordPress](https://blog.ossrs.io/publish-your-srs-livestream-through-wordpress-ec18dfae7d6f) tutorial. There is also a live demonstration [SRS Player Demo](https://wp.ossrs.io/2022/04/25/srs-player/).

## Conclusion

In this tutorial, you create a live streaming service by aaPanel, publish the stream by OBS and play it through browser or WordPress. If you have further questions about SRS, [the wiki](https://github.com/ossrs/srs/wiki/v4_EN_Home) is a good place to start. If you'd like to discuss with SRS, you are welcome to [discord](https://discord.gg/yZ4BnPmHAd).

