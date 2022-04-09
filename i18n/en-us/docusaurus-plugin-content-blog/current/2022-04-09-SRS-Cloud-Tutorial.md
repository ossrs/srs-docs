# How to Setup a Video Streaming Service by 1-Click

## Introduction

Streaming video is very popular in a variety of industries, and there are many tutorials for building a media server, using [SRS](https://github.com/ossrs/srs) or [NGINX-RTMP](https://github.com/arut/nginx-rtmp-module) that host stream does not rely on other service providers. But if we want to build a online video streaming service, it's  much more than only a media server:

1. Authentication: Because the server is on the public internet with a public IPv4 address, how to do authentication? How to block all users except they have the correct token?
1. Multiple Protocols: Rather than publishing RTMP using OBS, you might need WebRTC or H5 to publish live streaming, for it's easy to use. You might also use [SRT](https://www.srtalliance.org) with some broadcasting devices. How to convert RTMP/WebRTC/SRT to HLS?
1. Restreaming and DVR: To help you boost engagement and reach, you could connect other service providers to restream,  such as YouTube, Twitch and Facebook. Well, DVR allows you to continue engagement after live events have ended, generating revenue via VoD(on-demand video).

Literally it's not just a media server, and seems a bit complicated, right? Yep and No!

* Yep! Building a video streaming service is something really difficult, not easy. It requires video streaming engineering, also backend service technology like Nodejs or Go, and frontend skills to build a mgmt and homepage.
* No! Rather than build all from scratch, we could build a video streaming service based on some open source solution such as [SRS Cloud](https://github.com/ossrs/srs-cloud), and lightweight cloud service such as [DigitalOcean](https://digitalocean.com) or [TencentCloud](https://intl.cloud.tencent.com), it's really simple to build your video streaming service.

In this tutorial, you will learn how to set-up a video streaming service, supports publishing by browser without a plugin that is converting WebRTC to HLS, to deliver low latency (about 300ms) video streaming  using SRT, and to secure the service by authentication. Furthermore, this solution is open source and very easy to get it done, via even 1-Click.

## Prerequisites

To complete this guide, you need:

1. OBS installed, following instructions [here](https://obsproject.com/) to download and install OBS.
1. An account of [DigitalOcean](https://cloud.digitalocean.com/login) or [TencentCloud](https://intl.cloud.tencent.com/login), to create a lightweight cloud server.

This guide will use placeholder `your_public_ipv4` and `your_domain_name` throughout for streaming URLs. Please replace them with your own IP address or domain name.

## Step 1: Create a SRS Droplet

A droplet is a simple and scalable virtual machine of DigitalOcean. A SRS Droplet is a droplet with Cloud SRS installed, to power your video streaming service. 

You could create `a SRS Droplet` by [clicking here](https://cloud.digitalocean.com/droplets/new?appId=104916642&size=s-1vcpu-1gb&region=sgp1&image=ossrs-srs&type=applications), set-up the droplet `Region` and `Authentication`, then click `Create Droplet` button at the bottom.

After the droplet is created, open `http://your_public_ipv4/mgmt/` in the browser, click the `Submit` button to set-up the administrator password for the first time. 

We have bellow services running in the SRS droplet:

* [SRS Server](https://github.com/ossrs/srs): SRS is a simple, high efficiency and realtime video server, supports RTMP, WebRTC, HLS, HTTP-FLV and SRT. We have both SRS 4.0 and 5.0 images installed. SRS is the media server engine, licensed under MIT or MulanPSL-2.0([compatible with Apache-2.0](https://www.apache.org/legal/resolved.html#category-a)).
* [SRS Cloud](https://github.com/ossrs/srs-cloud): A lightweight open-source video cloud based on Nodejs, SRS, FFmpeg, WebRTC, etc. SRS-Cloud acts as the framework of a video streaming service, it's also open source, licensed under MIT.
* [FFmpeg](https://ffmpeg.org/): A complete, cross-platform solution to record, convert and stream audio and video. FFmpeg is used as restreaming or transcoding, and many other stream processing features.
* Other infrastructure like [Docker](https://docker.io/), [Redis](https://redis.io/), [NGINX](https://nginx.org/), [Prometheus](https://prometheus.io/) and [Certbot](https://certbot.eff.org/), to run dependent services as docker container, allow checking and upgrading to stable versions.

> SRS also set-up the firewall, please see [here](https://github.com/ossrs/srs-cloud/blob/main/scripts/setup-droplet/scripts/02-ufw-srs.sh) for details. All ports are `BLOCKED` except 22 (SSH), 80 (HTTP), 443 (HTTPS), 1935 (RTMP), 8000/UDP (WebRTC), 10080/UDP (SRT), 9000/TCP+UDP (GB28181), 5060/TCP+UDP (SIP), 2022 (MGMT) and 56379 (REDIS).

Now the video streaming service is ready, we could use FFmpeg, OBS or WebRTC to publish the stream, and play the HLS stream.

## Step 2: Publish Stream using OBS

OBS is more simple to use, and SRS provides guide for OBS, please click `Scenarios / Streaming / OBS or vMix` or open URL `http://your_public_ipv4/mgmt/en/routers-scenario?tab=live` with `Server` and `StreamKey` for OBS, please copy these config and paste to OBS:

![](/img/blog-2022-04-09-01.png)

> Note: There is also a guide for publishing streams by FFmpeg and WebRTC, however, it's a bit complex for WebRTC, and we will talk about it later.

After publishing an RTMP stream to SRS, you're able to play the stream by HTTP-FLV or HLS, by clicking the H5 player link, or play the URL by [VLC](https://www.videolan.org/).

> Note: The latency of VLC is huge, so please use [ffplay](https://ffmpeg.org/) to play the RTMP or HTTP-FLV if you wanna a low latency live streaming.

Now we have finished the basic live streaming publishing and playing, note that the `Stream Key` contains a `secret` which is used for authentication. Without this secret, SRS will deny the publisher, so only people who know about the secret could publish an RTMP stream.

While for players, the URL is public and no `secret` thing, because generally we don't need to do authentication for players. However, SRS is planned to support more authentication algorithms, including token for players, or limits for number of connections, or disconnecting connections if they exceed a period of duration.

## Step 3: Publish by WebRTC (Optional)

WebRTC or H5 is very convenient for users to share their camera, by just opening a H5 URL, to start live streaming like what OBS does.

Because WebRTC requires HTTPS, so you need a fully registered domain name, you could purchase a domain name on [Namecheap](https://namecheap.com/) or [GoDaddy](https://godaddy.com/), however we will use placeholder `your_domain_name` throughout this tutorial.

When you get a domain name, make sure a DNS record set-up for your server, please add an `A record` with `your_domain_name` pointing to your server public IP address that is `your_public_ipv4` as we said, see [Domains and DNS](https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/#a-records).

Now please switch to `System / HTTPS / Let's Encrypt` and enter `your_domain_name`, then click `Submit` button to request a free SSL cert from [Let's Encrypt](https://letsencrypt.org/):

![](https://upload-images.jianshu.io/upload_images/20832941-739dcb0dd811d39a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/720)

When the HTTPS is ready, please open the URL `https://your_domain_name/mgmt` to access `Scenarios / Streaming / WebRTC` and open the URL to publish using WebRTC: 

![](https://upload-images.jianshu.io/upload_images/20832941-93bbe5838bb79ab5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/576)

> Remark: Please note that the website and stream URLs have changed to HTTPS, both HTTPS-FLV, HLS and WebRTC.

The bellow is a demo for publishing by WebRTC and playing by HTTP-FLV or HLS:

![](https://upload-images.jianshu.io/upload_images/20832941-7f82881bc9bd52dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/576)

WebRTC is a bit more complex than RTMP or HLS, but using the feature by SRS, it's also very simple to set-up the HTTPS website and WebRTC signaling API, and the demo pages for WebRTC publisher and player are also very simple to use.

## Step 4: Low Latency Streaming by SRT (Optional)

For RTMP/FLV, the streaming latency is about 3~5s, while 5~10s for HLS. Which protocol to use if we want to build a low latency live streaming service, say, less than 1s?

WebRTC? No! It's too complicated, and few devices support WebRTC. [WHIP](https://datatracker.ietf.org/doc/draft-ietf-wish-whip/) is a possible choice for live streaming using WebRTC, but it's not a RFC right now(at 2022). It might take a long time to apply WebRTC to the live streaming industry, especially if we get other choices, [SRT](https://www.srtalliance.org/) and [RIST](https://www.rist.tv/) etc.

> Note: Whatever, SRS Cloud allows you to use WebRTC for live streaming, to publish by WebRTC and play by RTMP/HLS/WebRTC.

It's also very easy to use SRT, by clicking `Scenarios / Low Latency / OBS+ffplay`, the guide is use OBS to publish SRT stream, and play by ffplay. The latency of `OBS+ffplay` is about 300ms, the bellow is a lower solution, by `vMix+ffplay`:

![](https://upload-images.jianshu.io/upload_images/20832941-d00bf7e5fd083cb9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/720)

> Note: The end-to-end latency of SRT is 200ms to 500ms, good enough! Well, WebRTC is about 50ms to 300ms latency. WebRTC is even lower than SRT, but WebRTC also introduces more pause events and the streaming is not smooth as SRT.

SRT is supported by a lot of devices of the broadcasting industry, and softwares like OBS/vMix also support SRT, so it's actually the most stable and easy way to get low latency live streaming.

Note that H5 does not support SRT, so you can't use Chrome to play a SRT stream, however, SRS Cloud will convert SRT to HTTP-FLV/HLS to ensure compability with general live streaming.

## Other Topics

SRS Cloud also supports restreaming to other platforms, by forking multiple FFmpeg processes, each process for a stream. It's a long story, so let's discuss it in a new tutorial.

Well DVR is another story, DVR means we convert live streaming to VoD files, so we must save the VoD files to a cloud storage, such as AWS S3 or TencentCloud COS. So we're developing to support more cloud storage now.

We're also considering to integrate a CMS to SRS cloud, to allow users to publish the live streaming rooms, or VoD files like a vlog, etc.

SRS Cloud is a single node video streaming service, but SRS is a media server that supports clusters, like [Origin Cluster](https://github.com/ossrs/srs/wiki/v4_EN_OriginCluster), [RTMP Edge Cluster](https://github.com/ossrs/srs/wiki/v4_EN_SampleRTMPCluster) and even [HLS Edge Cluster](https://github.com/ossrs/srs/wiki/v4_EN_SampleHlsCluster). The HLS Edge Cluster is based on NGINX, and SRS could work well with NGINX, we will publish more tutorials about this topic if you wanna.

## Conclusion

In this tutorial, you build a video streaming service only by 1-Click, but with powerful features like authentication, SRT and WebRTC etc. If you have further questions about SRS, [the wiki](https://github.com/ossrs/srs/wiki/v4_EN_Home) is a good place to start. If you'd like to discuss with SRS, you are welcome to [discord](https://discord.gg/yZ4BnPmHAd).

