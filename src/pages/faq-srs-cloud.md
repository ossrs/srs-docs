# FAQ

> Note: This is FAQ for SRS Cloud, please see [SRS FAQ](/faq) for SRS FAQ.

Quick Content

* [Video Guides](#video-guides): Video tutorials.
* [Getting Started](#getting-started): How to use, start, and get started with SRS Cloud Server.
* [How to Upgrade](#how-to-upgrade): How to upgrade to the latest or stable version, and why the interface click upgrade is not supported.
* [How to set a domain](#how-to-set-domain): How to set up a domain to access the admin panel, why can't the admin panel be opened, and why can't the admin panel be accessed via IP.
* [Supported Platforms](#support-platform): Supported platforms, supported images, want to use the server or command line installation directly, or aaPanel installation.
* [How to push multiple streams](#multiple-streams): Want to push multiple streams, want to change the default stream name and stream address.
* [Low bandwidth, increase bandwidth](#bandwidth): Insufficient bandwidth, want to increase bandwidth, use Cloud SRS in CVM.
* [How to set up free HTTPS](#https): How to apply for a free HTTPS certificate, how to apply for certificates for multiple domain names.
* [How to modify the push authentication key](#update-publish-secret): Update the push authentication key, replace the push key.
* [How to disable push authentication](#no-publish-auth): Don't want push authentication, the device does not support special characters.
* [How to record to local disk](#record): How to record to the local disk of Cloud SRS.
* [Difference between cloud recording and cloud on-demand](#cos-vs-vod): Whether to use cloud recording or cloud on-demand, and what are the differences.
* [How to record to cloud storage](#dvr-cloud-storage): Record to COS, OSS, or S3, etc. cloud storage.
* [Unavailable after installation](#unavailable): Error prompt after installation, or Redis not ready.
* [Difference between SRS re-streaming and OBS re-streaming](#restream-vs-obs): The difference between SRS multi-platform re-streaming and OBS re-streaming plugin.
* [How SRS re-streams to custom platforms](#restream-custom): How SRS multi-platform re-streaming pushes to custom live platforms.
* [How to replace FFmpeg](#use-custom-ffmpeg): How to replace the FFmpeg in Cloud SRS with a custom version.
* [aaPanel installation of SRS is very slow](#install-speedup): Overseas aaPanel installation is very slow, access to Alibaba Cloud image is too slow.
* [How to install the latest Cloud SRS in aaPanel](#bt-install-manually): Manually install aaPanel plugin, install the latest plugin.
* [aaPanel CentOS7 installation failed](#bt-centos7-error): CentOS7 aaPanel installation failed, cannot find the directory, or GLIBC version problem.
* [How to purchase AI face-swapping service](#how-to-buy-ai): How to implement AI face-swapping? How to buy models? Who to buy from?
* [How to implement the requirements or features](#rules): Want to implement more features, want to customize, want to optimize and improve.
* [Unable to achieve the desired effect](#can-not-replay): Encounter problems, cannot achieve the desired effect.
* [Difference between Cloud SRS and SRS](#diff-srs): The difference between Cloud SRS and SRS, why there is Cloud SRS.
* [Difference with aaPanel](#diff-baota): Difference with virtual machine management software aaPanel.
* [Difference with Video Cloud](#diff-vcloud): Difference with general video cloud services.
* [How to reinstall the system](#reinstall): For friends who already have Lighthouse or CVM.
* [How to authorize troubleshooting](#auth-bt): How to authorize machine permissions when encountering problems.
* [Cost Optimization](#cost-opt): About cost and cost optimization.
* [OpenAPI](#openapi): About open API, using API to get related information.
* [Feature List](#features): About the list of supported features.
* [Version Planning](#changelog): About versions and milestones.

You can also search for keywords on the page.

<a name='video-guides'></a><br/><br/><br/>

## Video Guides

The following are video materials for answering questions, which explain a certain topic in detail. If your question is similar, please watch the video directly:

* [How to Do Virtual Live Streaming by SRS Cloud](https://youtu.be/68PIGFDGihU)

<a name='getting-started'></a><br/><br/><br/>

## How to get started

Please purchase and set up [SRS Cloud Server](https://cloud.digitalocean.com/droplets/new?appId=133468816&size=s-1vcpu-512mb-10gb&region=sgp1&image=ossrs-srs&type=applications) first. 

After entering the SRS Cloud Server, there will be corresponding video tutorials according to different application scenarios, as shown in the following figure:

![](/img/page-2023-03-04-01.png)

Each scenario also has a complete introduction and detailed operation steps, as shown in the following figure:

![](/img/page-2023-03-04-02.png)

Please do not try randomly, be sure to follow the guide, audio and video random testing will definitely cause problems.

<a name="how-to-upgrade"></a><br/><br/><br/>

## How to upgrade

How to upgrade to the latest version or stable version, and why not support click upgrade on the interface?

Since Cloud SRS supports multiple platforms, including Docker, and Docker cannot upgrade itself, Cloud SRS also does not support interface upgrades and needs to be upgraded manually.

The Docker startup specifies the version, such as `ossrs/srs-cloud:v1.0.293`, and you only need to delete the container and start with the new version, such as `ossrs/srs-cloud:v1.0.299`.

If you use `ossrs/srs-cloud:1`, it is the latest version, and you need to update manually, such as `docker pull ossrs/srs-cloud:1`.

If you use BT panel, just delete the application and reinstall the new version, the data is saved in the `/data` directory and will not be lost.

<a name="how-to-set-domain"></a><br/><br/><br/>

## How to set a domain

How to set up a domain to access the admin panel, why can't the admin panel be opened, and why can't the admin panel be accessed via IP.

Please replace the following domain names and IPs with your own domain names and IPs, which can be either private or public IPs, as long as your browser can access them.

When installing Cloud SRS with aaPanel, you need to enter the domain name of the management backend, such as `bt.yourdomain.com`, and it will automatically create the management backend website.

If you install it in other ways, it's the same. You just need to resolve your domain name to the Cloud SRS IP.

There are several ways to set up domain name resolution:

1. DNS domain name resolution: In the backend of your domain name provider, set an A record pointing to the Cloud SRS IP.
```text
A bt.yourdomain.com 121.13.75.20
```
2. Modify the local `/etc/hosts` file in Linux/Unix to resolve the domain name to the Cloud SRS IP.
```text
121.13.75.20 bt.yourdomain.com
```
3. Modify the local `C:\Windows\System32\drivers\etc` file in Windows to resolve the domain name to the Cloud SRS IP.
```text
121.13.75.20 bt.yourdomain.com
```

Note: If you need to apply for a free HTTPS certificate through Let's Encrypt, the IP address must be a public IP, and you cannot use the method of modifying the hosts file.

<a name="support-platform"></a><br/><br/><br/>

## Supported platforms

Cloud SRS supports Docker, install script, DigitalOcean images, and other platforms can be installed with aaPanel.

Cloud SRS is, of course, supported on various cloud platforms. The most convenient way is to use images, which are images of cloud servers. If you want to keep it simple and save trouble, please use images. Other methods are prone to problems. Please do not overestimate your ability to tinker. Most people really belong to the 80% who can't tinker. It is strongly recommended to use images:

* [Run by docker image](https://github.com/ossrs/srs-cloud#usage)
* DigitalOcean: Overseas lightweight cloud server image, use reference [here](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ)

If you don't want to use virtual machine images and want to install directly on a server or command line, or install with aaPanel, that's no problem:

* aaPanel: If your machine is overseas, be sure to use aaPanel instead of BT panel, use reference [here](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c)

> Note: If you want to install Cloud SRS from the command line, you can first install BT panel from the command line, and then install Cloud SRS.

<a name='multile-streams'></a><br/><br/><br/>

## How to push multiple streams

By default, there is only one push stream address. What if you want to push multiple streams? How to change the stream address?

You can change the stream name, for example, the default push stream address is:

* `rtmp://1.2.3.4/live/livestream?secret=xxx`

You can modify `livestream` to any other name, and then push directly:

* rtmp://1.2.3.4/live/`any`?secret=xxx
* rtmp://1.2.3.4/live/`stream`?secret=xxx
* rtmp://1.2.3.4/live/`you`?secret=xxx
* rtmp://1.2.3.4/live/`want`?secret=xxx

As shown in the figure below, you can click the update button to automatically change the push stream and playback name:

![](/img/page-2023-03-04-03.png)

> Note: Of course, the playback must also be changed to the corresponding stream name.

<a name="bandwidth"></a><br/><br/><br/>

## Low bandwidth, increase bandwidth

The bandwidth of lightweight application servers ranges from 4 to 20Mbps, which is somewhat limited for audio and video. If you want higher bandwidth, such as 100Mbps, you can choose CVM or AWS VPS.

> Note: The usage of Cloud SRS is consistent, but the purchase and platform configuration are different.

The advantages of CVM cloud servers are:

* The bandwidth can be up to 100Mbps, and multiple platforms can be used to forward to other CVM servers. Ten CVMs can achieve 1Gbps bandwidth, but of course, you have to consider your budget.
* Pay-as-you-go, you can stop the machine at any time without charge, and use it again when needed. It is more friendly for low-frequency application scenarios.

The disadvantages of CVM cloud servers are:

* High cost, no free traffic package. Lightweight servers have low cost, and the free traffic package is basically enough for general live streaming. So please calculate the cost yourself.
* Complex operation, CVM's security group is much more complicated than the lightweight firewall operation. Please try it yourself. If it doesn't work, switch to lightweight.
* No background link, the interface is more complex. If it doesn't work, switch to lightweight.

If you still want to choose CVM after knowing the advantages and disadvantages, please refer to [Cloud SRS: Support CVM image](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ).

<a name="https"></a><br/><br/><br/>

## How to set up free HTTPS

Cloud SRS supports applying for free HTTPS certificates, and you can apply for certificates for multiple domain names and automatically renew them. For example, the certificates for the following HTTPS websites are all automatically applied after running Cloud SRS:

* https://ossrs.io SRS's overseas documentation website.
* https://www.ossrs.io SRS's overseas documentation website.
* https://r.ossrs.net SRS's stable version demo server.

The operation is very simple, just follow these three steps, please see [here](https://ossrs.net/lts/blog/2022/04/12/SRS-Cloud-HTTPS):

1. Purchase a domain name and complete the filing. You must have your own legal domain name, otherwise, you cannot apply for a certificate.
2. Resolve the domain name to the public IP of Cloud SRS. You can add multiple domain names to resolve, for example, `ossrs.io` and `www.ossrs.io` are both resolved to the same Cloud SRS server.
3. In Cloud SRS's `System Settings > HTTPS > Automatic HTTPS Certificate`, fill in your domain name, separate multiple domain names with semicolons, and click Apply.

> Note: Just apply for the domain name, do not upload it again. Once applied, you don't need to upload it again.

> Note: Please use aaPanel to apply, the operation steps are similar to the above. Cloud SRS will no longer support certificate application, because certbot does not support multi-platform docker images, and there will be problems when using it on other platforms.

After the application is successful, enter https plus your domain name in the browser, and you can access your website.

<a name="update-publish-secret"></a><br/><br/><br/>

## How to modify the push authentication key

If you need to update the push authentication key or change the push key, you can follow these steps:

1. Enter the `System Settings` panel.
2. Select the `Stream Authentication` tab.
3. Enter the new stream key.
4. Click the `Update` button.
5. Refresh the pages of each scene, and the push key will be automatically updated.

As shown in the picture below:

![](/img/page-2023-03-04-04.png)

If you need to disable push authentication, please refer to the instructions below.

<a name="no-publish-auth"></a><br/><br/><br/>

## How to disable push authentication

In the scene page, the standard push format is with `?secret=xxx` authentication, such as `rtmp://ip/live/livestream?secret=xxx`

It is found that some cameras do not support the `?secret=xxx` format, so the address is not supported.

In this case, you can actually put the key `xxx` directly in the stream name, such as: `rtmp://ip/live/livestreamsecretxxx`, and there will be no problem.

Of course, if you only need to push one stream, you can directly use the key as the stream name, such as: `rtmp://ip/live/xxx`.

> Note: Of course, the playback must also be changed to the same stream name, and the key must be included, because the key is placed in the stream name here, so the playback must also be changed.

This way, there is security, and it can support devices that do not support special characters. In addition, the push key can be changed, so you can change it to the way you want.

<a name="record"></a><br/><br/><br/>

## How to record to local disk

How to record to the local disk of Cloud SRS? After upgrading to v1.0.252, you can see local recording in the recording.

For the limitations and solutions of local recording, please refer to #42

<a name="cos-vs-vod"></a><br/><br/><br/>

## Difference between cloud recording and cloud on-demand

Cloud SRS provides two similar functions, cloud recording and cloud on-demand. What is the difference between using cloud recording or cloud on-demand for recording?

Cloud recording can be considered as writing live streaming to the cloud disk, saving it in HLS format, which is the original video stream. If you want to download HLS for transcoding and editing, it would be more suitable. Cloud recording is stored in Tencent Cloud COS cloud storage, which can be considered as an unlimited disk, avoiding overwriting the disk of Cloud SRS.

Cloud on-demand provides both HLS and MP4 formats, and more features will be added in the future, such as outputting multiple bit rates, adding logos and watermarks, media asset management, and many other useful features. Cloud on-demand is a video-on-demand system, not just a storage disk. It can be considered as a Bilibili or YouTube. If you want to do more diverse businesses, you must choose cloud on-demand.

In terms of cost, cloud on-demand will be slightly higher than cloud recording, depending on which features are used. Currently, Cloud SRS uses HLS to MP4 conversion, which is very low in cost because there is no transcoding. In the future, if you want to use advanced features, the cost will be higher. Overall, the cost of cloud on-demand is very low, similar to cloud recording. If there is no additional computing cost, it will be the same as cloud recording.

In short, it is recommended to use cloud on-demand, which is easy to use and not expensive.

<a name="dvr-cloud-storage"></a><br/><br/><br/>

## How to record to cloud storage

Cloud SRS supports recording to COS, Tencent Cloud Storage. Please refer to [Usage: Cloud Storage](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g).

Cloud SRS can also record to other cloud storage, such as Alibaba Cloud OSS or AWS S3. According to the guidance of cloud storage, mount the cloud storage to Cloud SRS, and then use local recording, configure the local storage path, so that you can write files to cloud storage.

> Note: To modify the local recording path, you can go to `Local Recording/Recording Folder`, and soft link the recording path to the cloud storage path.

<a name="unavailable"></a><br/><br/><br/>

## Unable to access after installation

After installation, an error is prompted, such as:

![](/img/page-2023-03-04-05.png)

Or Redis is not ready, such as:

![](/img/page-2023-03-04-06.png)

This is because it takes time for Cloud SRS to start after installation. Refresh the page after waiting for 3 to 5 minutes.

<a name="restream-vs-obs"></a><br/><br/><br/>

## Difference between SRS Restream and OBS Restream

SRS's multi-platform restreaming can push the stream to multiple platforms, and its working diagram is as follows:

```
OBS/FFmpeg --RTMP--> Cloud SRS --RTMP--> Video number, Bilibili, Kuaishou, and other live streaming platforms
```

In fact, OBS also has a restreaming plugin, and its working diagram is as follows:

```
OBS --RTMP--> Video number, Bilibili, Kuaishou, and other live streaming platforms
```

It seems that OBS's link is shorter and simpler, and it doesn't need to go through Cloud SRS or pay money. So why does Cloud SRS still need to do restreaming, and what are the drawbacks of OBS's solution?

The advantage of OBS restreaming is that it doesn't cost money and can be restreamed directly. The disadvantage is that its uplink/upload bandwidth is doubled. For example, a 2Mbps stream, if restreamed to 3 platforms, will be 6Mbps. If more video numbers need to be pushed, it will be even more, such as pushing to 10 platforms, which will be 20Mbps.

Higher bandwidth will cause all push streams to stutter or interrupt, making it impossible for all viewers to watch the live broadcast, resulting in a live broadcast accident. As long as there is a rollover once, most of the people in the live broadcast room will run away, which is a very serious accident.

Basically, 80% of live broadcast rollovers are caused by problems with the anchor's push stream. Because the problems of cloud platforms and viewer viewing have been almost solved, the only unsolvable problem is the anchor's push stream.

If you have a dedicated fiber-optic line at home, such as buying a 100Mbps dedicated line, there will be no problem. The problem is that a 100Mbps dedicated line is very expensive, and even if it is temporarily free, there will be a day when it will be charged because a dedicated line is a dedicated resource and cannot be free forever. It's like someone giving you gold bars for free, how long can it be free?

Cloud SRS also has doubled bandwidth, but it is the downstream bandwidth that is doubled because it has done a conversion, and essentially other platforms are downloading the stream from Cloud SRS. Downstream/download bandwidth is generally more guaranteed. Moreover, between Cloud SRS and the platform, they are all BGP bandwidth between servers, which is more guaranteed in quality than the home-to-platform connection.

<a name="restream-custom"></a><br/><br/><br/>

## How SRS Restreams to Custom Platforms

SRS's multi-platform restreaming can push to custom live streaming platforms, such as pushing to the video number's push stream address and stream key, and can also fill in any other live streaming platform.

> Note: The reason why Cloud SRS is divided into video numbers and platforms like Bilibili is to provide better guidance. The RTMP address format of these platforms is similar, so you can fill in any platform, and Cloud SRS will not verify the specific platform.

If the RTMP address of the live streaming platform is a single address, such as:

```
rtmp://ip/app/stream
```

Then, you can split it into:

* Push stream address: `rtmp://ip/app`
* Stream key: `stream`

> Note: The part after the last slash is the stream key.

<a name="use-custom-ffmpeg"></a><br/><br/><br/>

## How to Replace FFmpeg

If you are using the Docker version, you can replace the FFmpeg in Cloud SRS with a custom version by specifying the command at startup:

```bash
-v /path/to/ffmpeg:/usr/local/bin/ffmpeg
```

You can use the command `which ffmpeg` to find the path of your FFmpeg.

> Note: Non-Docker versions are not supported.

<a name='install-speedup'></a><br/><br/><br/>

## Baota Installation of SRS is Very Slow

Some users have reported that overseas Baota installations are very slow, and accessing Alibaba Cloud's mirror is too slow.

This is because Baota cannot be used overseas. Installing other tools with Baota overseas is also very slow because downloading data across countries back to China is naturally very slow.

The overseas version of Baota is called [aaPanel](https://aapanel.com). Please use aaPanel, which installs software quickly, and Cloud SRS will also switch to overseas mirror downloads.

Baota and aaPanel only have different installation methods, but the specific usage is the same. Please refer to [Baota](https://ossrs.net/lts/zh-cn/blog/BT-aaPanel) or [aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c).

<a name="bt-install-manually"></a><br/><br/><br/>

## How to Install the Latest Cloud SRS on Baota

Sometimes the version in the Baota store is older, and you can manually install the Baota plugin to install the latest plugin.

The latest version of Cloud SRS can be found in [Releases](https://github.com/ossrs/srs-cloud/releases), and the `aapanel-srs_cloud.zip` attachment in each version can be downloaded as a plugin.

After downloading the plugin, you can go to Baota `Software Store > Third-Party Applications > Import Plugin` and upload the downloaded `aapanel-srs_cloud.zip` to install.

<a name="bt-centos7-error"></a><br/><br/><br/>

## aaPanel CentOS7 Installation Failure

> Note: Ubuntu 20 (Focal) is highly recommend, please don't use CentOS.

Common errors for CentOS7 aaPanel installation failure are:

* GLIBC version issue: ```version `GLIBC_2.27' not found```
* Directory not found: ```ln: failed to access '/www/server/nvm/versions/node/v18.12.1/bin/node'```

These are all due to problems with nodejs on CentOS7. Generally, after installing pm2, nodejs18 is installed, which depends on a higher version of libc, so it cannot be used.

Solution:

* Upgrade to Cloud SRS v4.6.3+ and manually install the latest version. Refer to [How to Install the Latest Cloud SRS on aaPanel](#bt-install-manually)
* Open pm2 and switch to nodejs 16, which can also bypass this problem.

> Note: Cloud SRS v4.6.3+ no longer requires pm2 to install nodejs. As long as the system has nodejs, it can be used. You can choose to install it with the nodejs manager, or with pm2, or you can install it yourself.

Finally, if it is still not available after successful installation, you can try restarting the system.

<a name="rules"></a><br/><br/><br/>

## How to implement the proposed features and how to record videos

Welcome everyone to submit questions and new features to Cloud SRS, but please explain the real business.

Most friends don't know what real business is, and generally describe the implementation plan of the business. However, this plan may not be the most suitable, and there may even be other technical solutions that can achieve this business goal. Therefore, please describe the business instead of describing the technical implementation of the function or plan.

Please describe the business scenario in detail and try to answer the following questions:

1. What kind of business are you in? As an ordinary person, how can I use your products and services? Please give a real example.
2. What problems are you solving in your business with SRS? Please give a real example.
3. How is the demand or function you proposed for SRS applied in the business? Please give an example.

> Note: If it is inconvenient to talk in the group, you can send it to me privately on WeChat.

The SRS cloud server open-source community works like this: you submit application scenarios, and we will prioritize implementation, using real nails to choose hammers, and welcome everyone to participate~

<a name="can-not-replay"></a><br/><br/><br/>

## Unable to achieve the desired effect

If the expected effect is not achieved, such as high latency or failure to push and pull streams, the following methods can solve all problems:

```
Don't change a word, follow the video tutorial and application scenario guidance, mouse operation copy and paste, it will definitely work well!
Don't change a word, follow the video tutorial and application scenario guidance, mouse operation copy and paste, it will definitely work well!
Don't change a word, follow the video tutorial and application scenario guidance, mouse operation copy and paste, it will definitely work well!
```

Because the only reason everyone has problems is that they think audio and video are simple and make random changes!

<a name="diff-srs"></a><br/><br/><br/>

## The difference between Cloud SRS and SRS

[SRS](https://github.com/ossrs/srs) is an open-source server, a streaming media server, which generally works with FFmpeg and WebRTC clients to achieve audio and video capabilities. Please see [this diagram](https://github.com/ossrs/srs#srssimple-realtime-server) to understand what SRS is.

Cloud SRS is an audio and video solution that is based on SRS, Nodejs, REACT, etc. to implement common audio and video scenarios. Please see [this diagram](https://github.com/ossrs/srs-cloud#architecture) to understand what Cloud SRS is.

After SRS is installed, it opens a streaming media server demo page with links to the player and console; after Cloud SRS is installed, it opens a login management backend that provides guidance for many different scenarios.

If you need to study the streaming media server in detail, please follow the SRS documentation and join the SRS community, and do not ask in the Cloud SRS group. SRS is an open-source audio and video server, aimed at highly skilled C/C++ programmers, and you can modify it at will, with strong customization capabilities.

If you want an out-of-the-box audio and video platform that can be used online, please use Cloud SRS and do not ask in the SRS community. The meaning of Cloud SRS is SRS in the cloud. It is a cloud-based service aimed at users who do not need to understand the details of audio and video and can operate according to the tutorial.

Both are open-source projects, and contributions are welcome.

<a name="diff-baota"></a><br/><br/><br/>

## The difference with aaPanel

aaPanel is a virtual machine management tool, and SRS Cloud Server is an out-of-the-box audio and video solution. aaPanel can also install Cloud SRS, please refer to [supported platforms](#support-platform).

> Note: The overseas version of Baota is called aaPanel, which also supports Cloud SRS; if your machine is overseas, please do not use Baota, but use aaPanel; everyone uses different installation sources, and using Baota overseas may be very slow or even fail.

<a name="diff-vcloud"></a><br/><br/><br/>

## The difference with Video Cloud

Video Cloud is a large-scale service scenario, such as cloud live broadcasting, TRTC, IM, cloud on-demand, CDN, Tencent Meeting or ZOOM, which are all super-large-scale systems.

SRS Cloud Server puts all these systems in a single `Lighthouse/CVM/Droplet/aaPanel` cloud server, so it is mainly comprehensive, but the concurrency and scale are very small, only suitable for small and micro scenarios, quickly building applications to achieve business, understanding and learning new scenarios, and can run and slowly see how to implement.

Of course, in the future, SRS Cloud Server will also support migration to mature video cloud services, allowing everyone to quickly meet business requirements while also getting scalable support as the business grows.

<a name="reinstall"></a><br/><br/><br/>

## How to reinstall the system

If you already have a `Lighthouse/CVM/Droplet`, or there is a problem with the image, you can reinstall the image to solve it. Do not log in and mess around by yourself, it will only cause more problems, it is better to choose to reinstall the system directly.

Take Lighthouse as an example, other platforms operate similarly. First, in the application management, select Reinstall System:

![](/img/page-2023-03-04-07.png)

Then, in the image type, select `Application Image`, and then select the corresponding `SRS` image, as shown below:

![](/img/page-2023-03-04-08.png)

Finally, click Confirm and OK, and it will be reinstalled very quickly.

<a name="auth-bt"></a><br/><br/><br/>

## How to authorize troubleshooting

How to authorize machine permissions when a problem occurs? It is recommended to use aaPanel:

1. Panel settings.
2. Security settings.
3. Temporary access authorization management.
4. Create temporary authorization.

Send the temporary authorization address to the troubleshooting classmates.

<a name="openapi"></a><br/><br/><br/>

## OpenAPI

Regarding the open API, using AP to dock with Cloud SRS, you can follow the guide in `System Configuration > OpenAPI`.

All operations of Cloud SRS are done by calling the API, and these APIs can be seen in the Chrome Network panel for specific requests.

All operations that can be completed on the Cloud SRS page can be completed through OpenAPI.

<a name='features'></a><br/><br/><br/>

## Features

Cloud SRS (i.e., SRS Cloud Server) is an open-source solution implemented in nodejs, with the code in [srs-cloud](https://github.com/ossrs/srs-cloud). Everyone is welcome to join.

SRS Cloud Server is aimed at mouse programming, allowing everyone to do audio and video business. It is suitable for those who do not understand audio and video, those who understand audio and video, those who farm, those who pull network cables, those who cut movies, those who carry cameras, those who dance, those who sing, those who sell second-hand goods, those who exchange open-source projects, those who live on multiple platforms, those who build their own source stations, those who can use computers and have WeChat, and those who are law-abiding citizens.

For instructions on using Cloud SRS, please refer to the video [SRS Cloud Server: Getting Started, Purchasing, and Introduction](https://www.bilibili.com/video/BV1844y1L7dL/).

Currently, the scenarios and functions supported by Cloud SRS include:

* [Cloud SRS: Getting Started, Purchasing, and Introduction](https://mp.weixin.qq.com/s/fWmdkw-2AoFD_pEmE_EIkA): How to purchase and set up the environment, a must-read.
* `Supported` Docking with [aaPanel](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ) or [aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c): SRS can be installed with [aaPanel](https://aapanel.com/), supporting all CentOS or Ubuntu machines, and can be installed with aaPanel command line after installing SRS.
* `Supported` [Private Live Room](https://mp.weixin.qq.com/s/AKqVWIdk3SBD-6uiTMliyA): OBS pushes the stream to SRS, and you can watch movies with good friends, private live rooms, exclusive BGP bandwidth, and watch whatever you want.
* `Supported` [Ultra HD Real-Time Live Streaming](https://mp.weixin.qq.com/s/HQb3gLRyJHHu56pnyHerxA): Using SRT low-latency push streaming, you can also do conferences, much clearer than WebRTC, and suitable for other low-latency SRT scenarios.
* `Supported` [Local Recording](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g): Record to the local file of the Cloud SRS server and provide HLS download. [#42](https://github.com/ossrs/srs-cloud/issues/42)
* `Supported` [Recording to Cloud Storage](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g): Avoid local disk limitations and facilitate subsequent live stream processing, support recording video streams to cloud storage, see details in [#1193](https://github.com/ossrs/srs/issues/1193).
* `Supported` [Recording to Cloud VOD](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g): A more advanced capability than cloud recording, cloud storage is unlimited disk, and cloud VOD is a short video system, more convenient and more advanced.
* `Supported` [Multi-Platform Rebroadcast](https://mp.weixin.qq.com/s/FtaeQIJpb7vpmX2eFguLiQ): Push the stream to Cloud SRS and forward it to video platforms such as Weishi, Kuaishou, Bilibili, Douyin, etc., see details in [#2676](https://github.com/ossrs/srs/issues/2676).
* `Supported` Docking with [WordPress](https://mp.weixin.qq.com/s/kOWabmKbYvrmEXG2fPOZxQ): Support [WordPress plugin](https://wordpress.org/plugins/srs-player) and [Typecho plugin](https://github.com/ossrs/Typecho-Plugin-SrsPlayer), insert live stream address in Post.
* `Supported` [DigitalOcean Image](https://mp.weixin.qq.com/s/_GcJm15BGv1qbmHixPQAGQ): Overseas support for DigitalOcean Droplet image, multi-language version in Chinese and English.
* `Supported` [Virtual Live Streaming](https://mp.weixin.qq.com/s/I0Kmxtc24txpngO-PiR_tQ): Server-side OBS, pushing VOD files, images, or streams to live streaming, with simple layout capabilities.
* `In development` [One-click Automatic HTTPS](https://mp.weixin.qq.com/s/O70Fz-mxNedZpxgGXQ8DsA): Upload HTTPS certificate, or one-click automatic application for Let's Encrypt certificate, a basic capability of the WebRTC scenario.
* `In planning` Cloud Camera: Support camera GB access, support cloud platform, cloud recording.
* `In planning` E-commerce Live Room: Live room, text chat capability, with product list and purchase, etc., see details in [#2858](https://github.com/ossrs/srs/issues/2858).
* `In planning` Interactive Live Streaming: Live room, support file chat, send gifts and likes, etc.
* `In planning` Cloud Live Streaming: Docking with cloud live streaming or CDN distribution, support millions of people watching, docking with CDN distribution stream.
* `In planning` One-on-one chat: One-on-one chat on all platforms, see details in [#2857](https://github.com/ossrs/srs/issues/2857).
* `In planning` Video Conference: Multi-person video conference, see details in [#2924](https://github.com/ossrs/srs/issues/2924).
* `In planning` Live Transcoding: Use FFmpeg to transcode live streams into multiple live streams, allowing different devices to watch different bit rates, see details in [#2869](https://github.com/ossrs/srs/issues/2869).
* `In planning` Cloud Director: Cloud OBS, add watermark, LOGO, background music, multi-channel switching to live stream.
* `In planning` Development Environment: Contains the source code of audio and video related tools, such as OBS and WebRTC, development environment, see details in [#2891](https://github.com/ossrs/srs/issues/2891).
* `In planning` AI: Face detection, object recognition, automatic subtitles, etc.
* `In planning` Docking with [Moodle](https://stats.moodle.org/): Support Moodle plugin, open-source online education website.
* `In planning` [Graphical Dashboard](https://mp.weixin.qq.com/s/ub9ZGmntOy_-S11oxFkxvg): Display background data in the form of charts, such as CPU, etc., see details in [Prometheus](https://github.com/ossrs/srs/issues/2899#prometheus).

Welcome to join the group to discuss the use of Cloud SRS. All these SRS peripheral services are open-source and can be customized and deployed by yourself.

<a name='changelog'></a><br/><br/><br/>

## Changelog

The following are the update records for the SRS cloud server.

* 2023.08.06, v1.0.300, minor improvements
    * Simplify startup script, fix bug, adjust directory to `/data` top-level directory. v1.0.296
    * Improve message prompts, script comments, and log output. v1.0.297
    * Avoid modifying the global directory every time it starts, initialize it in the container and platform script. v1.0.298
    * Improve release script, check version matching, manually update version. v1.0.299
    * Remove upgrade function, maintain consistency of docker and other platforms. v1.0.300
    * Improved BT and aaPanel scripts, added test pipeline. v1.0.300
* 2023.04.05, v1.0.295, structural improvements
    * Remove HTTPS certificate application, administrator authorization, NGINX reverse proxy, and other functions. v1.0.283
    * Implement Release using Go, reducing memory requirements and image size. v1.0.284
    * Remove dashboard and Prometheus, making it easier to support a single Docker image. v1.0.283
    * Implement mgmt and platform using Go, reducing memory requirements and image size. v1.0.283
    * Use Ubuntu focal(20) as the base image, reducing image size. v1.0.283
    * Support fast upgrade, installation in about 40 seconds, upgrade in about 10 seconds. v1.0.283
    * Solve the problem of forwarding without stream. v1.0.284
    * Solve the problem of uploading large files and getting stuck. v1.0.286
    * Remove AI face-changing video, B station review did not pass. v1.0.289 (stable)
    * Remove Redis container and start Redis directly in the platform. v1.0.290
    * Remove SRS container and start SRS directly in the platform. v1.0.291
    * Support single container startup, including mgmt in one container. v1.0.292
    * Support mounting to `/data` directory for persistence. v1.0.295
* 2023.02.01, v1.0.281, experience improvement, Stable version.
    * Allow users to turn off automatic updates and use manual updates.
    * Adapt to the new version of Bao Ta, solve the nodejs detection problem.
    * Bao Ta checks the plug-in status, and cannot operate before the installation is complete.
    * Improve the display of forwarding status, add `waiting` status. v1.0.260
    * Improve image update, not strongly dependent on certbot. #47
    * Merge hooks/tencent/ffmpeg image into the platform. v1.0.269
    * Support custom platform for forwarding. v1.0.270
    * Support virtual live broadcast, file-to-live broadcast. v1.0.272
    * Upload file limit 100GB. v1.0.274
    * Fix bug in virtual live broadcast. v1.0.276
    * Release service, replace Nodejs with Go, reduce image size. v1.0.280
    * Do not use buildx to build single-architecture docker images, CentOS will fail. v1.0.281
* 2022.11.20, v1.0.256, major version update, experience improvement, Release 4.6
    * Proxy root site resources, such as favicon.ico
    * Support [SrsPlayer](https://wordpress.org/plugins/srs-player) WebRTC push stream shortcode.
    * Support [local recording](https://github.com/ossrs/srs-cloud/issues/42), recording to SRS cloud local disk.
    * Support deleting local recording files and tasks.
    * Support local recording as MP4 files and downloads.
    * Support local recording directory as a soft link, storing recorded content on other disks.
    * Improve recording navigation bar, merge into recording.
    * Resolve conflicts between home page and proxy root directory.
    * Solve the problem of not updating NGINX configuration during upgrade.
    * Fix the bug of setting record soft link.
    * Replace all images with standard images `ossrs/srs`.
    * Support setting website title and footer (filing requirements).
    * Prompt administrator password path, can retrieve password when forgotten.
    * Allow recovery of the page when an error occurs, no need to refresh the page.
* 2022.06.06, v1.0.240, major version update, Bao Ta, Release 4.5
    * Reduce disk usage, clean up docker images
    * Improve dependencies, no longer strongly dependent on Redis and Nginx
    * Support [Bao Ta](https://mp.weixin.qq.com/s/nutc5eJ73aUa4Hc23DbCwQ) or [aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c) plugin, support CentOS or Ubuntu command line installation
    * Migrate ossrs.net to lightweight server, no longer dependent on K8s.
    * Login password default changed to display password.
    * Stop pushing stream for a certain time, clean up HLS cache files.
    * Create a 2GB swap area if memory is less than 2GB.
    * Support collecting SRS coredump.
    * Live scene display SRT push stream address and command.
    * Support setting NGINX root proxy path.
* 2022.04.18, v1.0.222, minor version update, containerized Redis
    * Improve instructions, support disabling push stream authentication.
    * Support English guidance, [medium](https://blog.ossrs.io) articles.
    * Improve simple player, support mute autoplay.
    * Add CORS support when NGINX distributes HLS.
    * Add English guidance, [Create SRS](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-1-click-e9fe6f314ac6) and [Set up HTTPS](https://blog.ossrs.io/how-to-secure-srs-with-lets-encrypt-by-1-click-cb618777639f), [WordPress](https://blog.ossrs.io/publish-your-srs-livestream-through-wordpress-ec18dfae7d6f).
    * Enhance key length, strengthen security, and avoid brute force cracking.
    * Support WordPress Shortcode guidance.
    * Support setting home page redirection path, support mixed running with other websites.
    * Support setting reverse proxy, support hanging other services under NGINX.
    * Support applying for multiple domain names for HTTPS, solving the `www` prefix domain name problem.
    * Change `filing` to `website`, can set home page redirection and footer filing number.
    * Improve NGINX configuration file structure, centralize configuration in `containers` directory.
    * Support setting simple load balancing, randomly selecting a backend NGINX for HLS distribution.
    * Containers work in an independent `srs-cloud` network.
    * Add `System > Tools` option.
    * Use Redis container, not dependent on host Redis service.
* 2022.04.06, v1.0.200, major version update, multi-language, Release 4.4
    * Support Chinese and English bilingual.
    * Support DigitalOcean image, see [SRS Droplet](https://marketplace.digitalocean.com/apps/srs).
    * Support OpenAPI to get push stream key, see [#19](https://github.com/ossrs/srs-cloud/pull/19).
    * Improve container image update script.
    * Support using NGINX to distribute HLS, see [#2989](https://github.com/ossrs/srs/issues/2989#nginx-direclty-serve-hls).
    * Improve VoD storage and service detection.
    * Improve installation script.
* 2022.03.18, v1.0.191, minor version update, experience improvement
    * Scenes default to display tutorial.
    * Support SRT address separation, play without secret.
    * Separate Platform module, simplify mgmt logic.
    * Improve UTest upgrade test script.
    * Support changing stream name, randomly generating stream name.
    * Support copying stream name, configuration, address, etc.
    * Separate upgrade and UI, simplify mgmt logic.
    * Separate container management and upgrade.
    * Fast and efficient upgrade, completed within 30 seconds.
    * Support CVM image, see [SRS CVM](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ).
* 2022.03.16, v1.0.162, major version update, error handling, Release 4.3
    * Support React Error Boundary, friendly error display.
    * Support RTMP push stream QR code, Xinxiang guidance


![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/faq-srs-cloud-en)
