# FAQ

> Note: This is FAQ for SRS Stack, please see [SRS FAQ](/faq) for SRS FAQ.

Quick Content

* [Video Guides](#video-guides): Video tutorials.
* [Getting Started](#getting-started): How to use, start, and get started with SRS Stack Server.
* [How to Upgrade](#how-to-upgrade): How to upgrade to the latest or stable version, and why the interface click upgrade is not supported.
* [How to set a domain](#how-to-set-domain): How to set up a domain to access the admin panel, why can't the admin panel be opened, and why can't the admin panel be accessed via IP.
* [Supported Platforms](#support-platform): Supported platforms, supported images, want to use the server or command line installation directly, or aaPanel installation.
* [How to push multiple streams](#multiple-streams): Want to push multiple streams, want to change the default stream name and stream address.
* [Too many machine resources](#multiple-instances): The machine has a lot of CPU, how can we support more platform forwarding, or more streams and recording, etc.
* [Low bandwidth, increase bandwidth](#bandwidth): Insufficient bandwidth, want to increase bandwidth, use SRS Stack in CVM.
* [How to set up free HTTPS](#https): How to apply for a free HTTPS certificate, how to apply for certificates for multiple domain names.
* [How to modify the push authentication key](#update-publish-secret): Update the push authentication key, replace the push key.
* [How to disable push authentication](#no-publish-auth): Don't want push authentication, the device does not support special characters.
* [How to record to local disk](#record): How to record to the local disk of SRS Stack.
* [Difference between cloud recording and cloud on-demand](#cos-vs-vod): Whether to use cloud recording or cloud on-demand, and what are the differences.
* [How to record to cloud storage](#dvr-cloud-storage): Record to COS, OSS, or S3, etc. cloud storage.
* [Unavailable after installation](#unavailable): Error prompt after installation, or Redis not ready.
* [Difference between SRS re-streaming and OBS re-streaming](#restream-vs-obs): The difference between SRS multi-platform re-streaming and OBS re-streaming plugin.
* [How SRS re-streams to custom platforms](#restream-custom): How SRS multi-platform re-streaming pushes to custom live platforms.
* [How to replace FFmpeg](#use-custom-ffmpeg): How to replace the FFmpeg in SRS Stack with a custom version.
* [aaPanel installation of SRS is very slow](#install-speedup): Overseas aaPanel installation is very slow, access to Alibaba Cloud image is too slow.
* [How to install the latest SRS Stack in aaPanel](#bt-install-manually): Manually install aaPanel plugin, install the latest plugin.
* [aaPanel CentOS7 installation failed](#bt-centos7-error): CentOS7 aaPanel installation failed, cannot find the directory, or GLIBC version problem.
* [How to purchase AI face-swapping service](#how-to-buy-ai): How to implement AI face-swapping? How to buy models? Who to buy from?
* [How to implement the requirements or features](#rules): Want to implement more features, want to customize, want to optimize and improve.
* [Unable to achieve the desired effect](#can-not-replay): Encounter problems, cannot achieve the desired effect.
* [Difference between SRS Stack and SRS](#diff-srs): The difference between SRS Stack and SRS, why there is SRS Stack.
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

* [How to Do Virtual Live Streaming by SRS Stack](https://youtu.be/68PIGFDGihU)

<a name='getting-started'></a><br/><br/><br/>

## How to get started

Please purchase and set up [SRS Stack Server](https://cloud.digitalocean.com/droplets/new?appId=133468816&size=s-1vcpu-512mb-10gb&region=sgp1&image=ossrs-srs&type=applications) first. 

After entering the SRS Stack Server, there will be corresponding video tutorials according to different application scenarios, as shown in the following figure:

![](/img/page-2023-03-04-01.png)

Each scenario also has a complete introduction and detailed operation steps, as shown in the following figure:

![](/img/page-2023-03-04-02.png)

Please do not try randomly, be sure to follow the guide, audio and video random testing will definitely cause problems.

<a name="how-to-upgrade"></a><br/><br/><br/>

## How to upgrade

How to upgrade to the latest version or stable version, and why not support click upgrade on the interface?

Since SRS Stack supports multiple platforms, including Docker, and Docker cannot upgrade itself, SRS Stack also does not support interface upgrades and needs to be upgraded manually.

The Docker startup specifies the version, such as `ossrs/srs-stack:v1.0.293`, and you only need to delete the container and start with the new version, such as `ossrs/srs-stack:v1.0.299`.

If you use `ossrs/srs-stack:1`, it is the latest version, and you need to update manually, such as `docker pull ossrs/srs-stack:1`.

If you use BT panel, just delete the application and reinstall the new version, the data is saved in the `/data` directory and will not be lost.

<a name="how-to-set-domain"></a><br/><br/><br/>

## How to set a domain

How to set up a domain to access the admin panel, why can't the admin panel be opened, and why can't the admin panel be accessed via IP.

Please replace the following domain names and IPs with your own domain names and IPs, which can be either private or public IPs, as long as your browser can access them.

When installing SRS Stack with aaPanel, you need to enter the domain name of the management backend, such as `bt.yourdomain.com`, and it will automatically create the management backend website.

> Note: When installing with aaPanel, if you want to use IP access, you can set it to `bt.yourdomain.com`, and then set the `srs.stack.local` website as the default website in aaPanel.

If you install it in other ways, it's the same. You just need to resolve your domain name to the SRS Stack IP.

There are several ways to set up domain name resolution:

1. DNS domain name resolution: In the backend of your domain name provider, set an A record pointing to the SRS Stack IP.
```text
A bt.yourdomain.com 121.13.75.20
```
2. Modify the local `/etc/hosts` file in Linux/Unix to resolve the domain name to the SRS Stack IP.
```text
121.13.75.20 bt.yourdomain.com
```
3. Modify the local `C:\Windows\System32\drivers\etc` file in Windows to resolve the domain name to the SRS Stack IP.
```text
121.13.75.20 bt.yourdomain.com
```

Note: If you need to apply for a free HTTPS certificate through Let's Encrypt, the IP address must be a public IP, and you cannot use the method of modifying the hosts file.

<a name="support-platform"></a><br/><br/><br/>

## Supported platforms

SRS Stack supports Docker images, installation scripts, DigitalOcean images, and can be installed on other platforms using aaPanel.

It is recommended to install directly using Docker, which also allows for multiple installations. Be sure to use Ubuntu 20+ system:
* Docker image installation: [here](https://ossrs.io/lts/zh-cn/docs/v6/doc/getting-started-stack#docker)

If you are used to aaPanel, you can install it with aaPanel, which can coexist with multiple websites. Be sure to use Ubuntu 20+ system:
* aaPanel: You can download the plugin for installation, and refer to [How to Setup a Video Streaming Service with aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c) for usage.
* Script: You can also use the script directly, refer to [Script](https://ossrs.io/lts/zh-cn/docs/v6/doc/getting-started-stack#script)

It supports various cloud platforms, and the most convenient method is using images, which are cloud server images. If you want to keep it simple and save time, please use images:
* DigitalOcean: Overseas lightweight cloud server images, refer to [How to Setup a Video Streaming Service by 1-Click](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-1-click-e9fe6f314ac6) for usage.

If you find that some features are missing, it may be because the version you chose is older. According to the update speed of features:

```bash
Docker/Script > aaPanel > DigitalOcean
```

If you consider convenience and simplicity, the recommended order is:

```bash
DigitalOcean > aaPanel > Docker/Script
```

You can choose the platform and installation method according to your situation.

<a name='multiple-streams'></a><br/><br/><br/>

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

<a name='multiple-instances'></a><br/><br/><br/>

## Too many machine resources

The machine has a lot of CPU, how can we support more platform forwarding, or more streams and recording, etc.

You can choose to use Docker to start SRS Stack, which makes it very easy to run many isolated SRS Stack instances that don't affect each other and utilize the machine resources.

For example, start two instances listening on ports 2022 and 2023, and use different ports for streaming media:

```bash
docker run --rm -it -p 2022:2022 -p 1935:1935 \
  -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp --name srs-stack \
  -v $HOME/data:/data ossrs/srs-stack:5
```

Then, open [http://localhost:2022](http://localhost:2022) to log in to the backend.

```bash
docker run --rm -it -p 2023:2022 -p 1936:1935 \
  -p 8081:8080 -p 8001:8000/udp -p 10081:10080/udp --name srs-stack1 \
  -v $HOME/data1:/data ossrs/srs-stack:5
```

Then, open [http://localhost:2023](http://localhost:2023) to log in to the backend.

> Note: Be careful not to use duplicate ports and make sure the mounted data directories are unique. Keep the two SRS Stacks completely separate.

If you only need multi-platform streaming or virtual streaming without involving the push stream port, you can use it directly.

If you need to push streams to two SRS Stack instances, you need to specify the ports, such as pushing streams to these two SRS Stacks:

* `rtmp://ip:1935/live/livestream`
* `rtmp://ip:1936/live/livestream`

Other protocol ports should also be changed accordingly, such as HLS:

* `http://ip:8080/live/livestream.m3u8`
* `http://ip:8081/live/livestream.m3u8`

Of course, this doesn't mean you can start thousands of SRS Stacks. You should pay attention to your CPU and memory, as well as whether your machine has enough bandwidth.

<a name="bandwidth"></a><br/><br/><br/>

## Low bandwidth, increase bandwidth

The bandwidth of lightweight application servers ranges from 4 to 20Mbps, which is somewhat limited for audio and video. If you want higher bandwidth, such as 100Mbps, you can choose CVM or AWS VPS.

> Note: The usage of SRS Stack is consistent, but the purchase and platform configuration are different.

The advantages of CVM cloud servers are:

* The bandwidth can be up to 100Mbps, and multiple platforms can be used to forward to other CVM servers. Ten CVMs can achieve 1Gbps bandwidth, but of course, you have to consider your budget.
* Pay-as-you-go, you can stop the machine at any time without charge, and use it again when needed. It is more friendly for low-frequency application scenarios.

The disadvantages of CVM cloud servers are:

* High cost, no free traffic package. Lightweight servers have low cost, and the free traffic package is basically enough for general live streaming. So please calculate the cost yourself.
* Complex operation, CVM's security group is much more complicated than the lightweight firewall operation. Please try it yourself. If it doesn't work, switch to lightweight.
* No background link, the interface is more complex. If it doesn't work, switch to lightweight.

If you still want to choose CVM after knowing the advantages and disadvantages, please refer to [SRS Stack: Support CVM image](https://mp.weixin.qq.com/s/x-PjoKjJj6HRF-eCKX0KzQ).

<a name="https"></a><br/><br/><br/>

## How to set up free HTTPS

SRS Stack supports applying for free HTTPS certificates, and you can apply for certificates for multiple domain names and automatically renew them. For example, the certificates for the following HTTPS websites are all automatically applied after running SRS Stack:

* https://ossrs.io SRS's overseas documentation website.
* https://www.ossrs.io SRS's overseas documentation website.
* https://r.ossrs.net SRS's stable version demo server.

The operation is very simple, just follow these three steps, please see [here](https://ossrs.net/lts/blog/2022/04/12/SRS-Stack-HTTPS):

1. Purchase a domain name and complete the filing. You must have your own legal domain name, otherwise, you cannot apply for a certificate.
2. Resolve the domain name to the public IP of SRS Stack. You can add multiple domain names to resolve, for example, `ossrs.io` and `www.ossrs.io` are both resolved to the same SRS Stack server.
3. In SRS Stack's `System Settings > HTTPS > Automatic HTTPS Certificate`, fill in your domain name, separate multiple domain names with semicolons, and click Apply.

> Note: Just apply for the domain name, do not upload it again. Once applied, you don't need to upload it again.

> Note: If you're using aaPanel to install SRS Stack, you can choose to apply through aaPanel or apply within SRS Stack.

If you encounter an error while applying and the message says `Could not obtain certificates: error: one or more domains had a problem`, the possible reasons are:

* The domain is not pointing to the SRS Stack's IP. You must use DNS to point the domain to the SRS Stack's IP, instead of setting it in the hosts file.
* The IP of the SRS Stack must be publicly accessible, meaning it should be an IP that anyone on the internet can access, not just within a private network.
* The port must be 80, not 2022, because Let's Encrypt will verify your domain in reverse and access it through port 80.

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

How to record to the local disk of SRS Stack? After upgrading to v1.0.252, you can see local recording in the recording.

For the limitations and solutions of local recording, please refer to #42

<a name="cos-vs-vod"></a><br/><br/><br/>

## Difference between cloud recording and cloud on-demand

SRS Stack provides two similar functions, cloud recording and cloud on-demand. What is the difference between using cloud recording or cloud on-demand for recording?

Cloud recording can be considered as writing live streaming to the cloud disk, saving it in HLS format, which is the original video stream. If you want to download HLS for transcoding and editing, it would be more suitable. Cloud recording is stored in Tencent Cloud COS cloud storage, which can be considered as an unlimited disk, avoiding overwriting the disk of SRS Stack.

Cloud on-demand provides both HLS and MP4 formats, and more features will be added in the future, such as outputting multiple bit rates, adding logos and watermarks, media asset management, and many other useful features. Cloud on-demand is a video-on-demand system, not just a storage disk. It can be considered as a Bilibili or YouTube. If you want to do more diverse businesses, you must choose cloud on-demand.

In terms of cost, cloud on-demand will be slightly higher than cloud recording, depending on which features are used. Currently, SRS Stack uses HLS to MP4 conversion, which is very low in cost because there is no transcoding. In the future, if you want to use advanced features, the cost will be higher. Overall, the cost of cloud on-demand is very low, similar to cloud recording. If there is no additional computing cost, it will be the same as cloud recording.

In short, it is recommended to use cloud on-demand, which is easy to use and not expensive.

<a name="dvr-cloud-storage"></a><br/><br/><br/>

## How to record to cloud storage

SRS Stack supports recording to COS, Tencent Cloud Storage. Please refer to [Usage: Cloud Storage](https://mp.weixin.qq.com/s/axN_TPo-Gk_H7CbdqUud6g).

SRS Stack can also record to other cloud storage, such as Alibaba Cloud OSS or AWS S3. According to the guidance of cloud storage, mount the cloud storage to SRS Stack, and then use local recording, configure the local storage path, so that you can write files to cloud storage.

> Note: To modify the local recording path, you can go to `Local Recording/Recording Folder`, and soft link the recording path to the cloud storage path.

<a name="unavailable"></a><br/><br/><br/>

## Unable to access after installation

In the new version of the aaPanel plugin, to avoid conflicts with existing website settings, it no longer automatically sets itself as the default website. Instead, you need to specify a domain or manually set the default website. Please refer to [How to Set a Domain](#how-to-set-domain).

After installation, an error is prompted, such as:

![](/img/page-2023-03-04-05.png)

Or Redis is not ready, such as:

![](/img/page-2023-03-04-06.png)

This is because it takes time for SRS Stack to start after installation. Refresh the page after waiting for 3 to 5 minutes.

<a name="restream-vs-obs"></a><br/><br/><br/>

## Difference between SRS Restream and OBS Restream

SRS's multi-platform restreaming can push the stream to multiple platforms, and its working diagram is as follows:

```
OBS/FFmpeg --RTMP--> SRS Stack --RTMP--> Video number, Bilibili, Kuaishou, and other live streaming platforms
```

In fact, OBS also has a restreaming plugin, and its working diagram is as follows:

```
OBS --RTMP--> Video number, Bilibili, Kuaishou, and other live streaming platforms
```

It seems that OBS's link is shorter and simpler, and it doesn't need to go through SRS Stack or pay money. So why does SRS Stack still need to do restreaming, and what are the drawbacks of OBS's solution?

The advantage of OBS restreaming is that it doesn't cost money and can be restreamed directly. The disadvantage is that its uplink/upload bandwidth is doubled. For example, a 2Mbps stream, if restreamed to 3 platforms, will be 6Mbps. If more video numbers need to be pushed, it will be even more, such as pushing to 10 platforms, which will be 20Mbps.

Higher bandwidth will cause all push streams to stutter or interrupt, making it impossible for all viewers to watch the live broadcast, resulting in a live broadcast accident. As long as there is a rollover once, most of the people in the live broadcast room will run away, which is a very serious accident.

Basically, 80% of live broadcast rollovers are caused by problems with the anchor's push stream. Because the problems of cloud platforms and viewer viewing have been almost solved, the only unsolvable problem is the anchor's push stream.

If you have a dedicated fiber-optic line at home, such as buying a 100Mbps dedicated line, there will be no problem. The problem is that a 100Mbps dedicated line is very expensive, and even if it is temporarily free, there will be a day when it will be charged because a dedicated line is a dedicated resource and cannot be free forever. It's like someone giving you gold bars for free, how long can it be free?

SRS Stack also has doubled bandwidth, but it is the downstream bandwidth that is doubled because it has done a conversion, and essentially other platforms are downloading the stream from SRS Stack. Downstream/download bandwidth is generally more guaranteed. Moreover, between SRS Stack and the platform, they are all BGP bandwidth between servers, which is more guaranteed in quality than the home-to-platform connection.

<a name="restream-custom"></a><br/><br/><br/>

## How SRS Restreams to Custom Platforms

SRS's multi-platform restreaming can push to custom live streaming platforms, such as pushing to the video number's push stream address and stream key, and can also fill in any other live streaming platform.

> Note: The reason why SRS Stack is divided into video numbers and platforms like Bilibili is to provide better guidance. The RTMP address format of these platforms is similar, so you can fill in any platform, and SRS Stack will not verify the specific platform.

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

If you are using the Docker version, you can replace the FFmpeg in SRS Stack with a custom version by specifying the command at startup:

```bash
-v /path/to/ffmpeg:/usr/local/bin/ffmpeg
```

You can use the command `which ffmpeg` to find the path of your FFmpeg.

> Note: Non-Docker versions are not supported.

<a name='install-speedup'></a><br/><br/><br/>

## Baota Installation of SRS is Very Slow

Some users have reported that overseas Baota installations are very slow, and accessing Alibaba Cloud's mirror is too slow.

This is because Baota cannot be used overseas. Installing other tools with Baota overseas is also very slow because downloading data across countries back to China is naturally very slow.

The overseas version of Baota is called [aaPanel](https://aapanel.com). Please use aaPanel, which installs software quickly, and SRS Stack will also switch to overseas mirror downloads.

Baota and aaPanel only have different installation methods, but the specific usage is the same. Please refer to [Baota](https://ossrs.net/lts/zh-cn/blog/BT-aaPanel) or [aaPanel](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-aapanel-9748ae754c8c).

<a name="bt-install-manually"></a><br/><br/><br/>

## How to Install the Latest SRS Stack on Baota

Sometimes the version in the Baota store is older, and you can manually install the Baota plugin to install the latest plugin.

The latest version of SRS Stack can be found in [Releases](https://github.com/ossrs/srs-stack/releases), and the `aapanel-srs_stack.zip` attachment in each version can be downloaded as a plugin.

After downloading the plugin, you can go to Baota `Software Store > Third-Party Applications > Import Plugin` and upload the downloaded `aapanel-srs_stack.zip` to install.

<a name="bt-centos7-error"></a><br/><br/><br/>

## aaPanel CentOS7 Installation Failure

> Note: Ubuntu 20 (Focal) is highly recommend, please don't use CentOS.

Common errors for CentOS7 aaPanel installation failure are:

* GLIBC version issue: ```version `GLIBC_2.27' not found```
* Directory not found: ```ln: failed to access '/www/server/nvm/versions/node/v18.12.1/bin/node'```

These are all due to problems with nodejs on CentOS7. Generally, after installing pm2, nodejs18 is installed, which depends on a higher version of libc, so it cannot be used.

Solution:

* Upgrade to SRS Stack v4.6.3+ and manually install the latest version. Refer to [How to Install the Latest SRS Stack on aaPanel](#bt-install-manually)
* Open pm2 and switch to nodejs 16, which can also bypass this problem.

> Note: SRS Stack v4.6.3+ no longer requires pm2 to install nodejs. As long as the system has nodejs, it can be used. You can choose to install it with the nodejs manager, or with pm2, or you can install it yourself.

Finally, if it is still not available after successful installation, you can try restarting the system.

<a name="rules"></a><br/><br/><br/>

## How to implement the proposed features and how to record videos

Welcome everyone to submit questions and new features to SRS Stack, but please explain the real business.

Most friends don't know what real business is, and generally describe the implementation plan of the business. However, this plan may not be the most suitable, and there may even be other technical solutions that can achieve this business goal. Therefore, please describe the business instead of describing the technical implementation of the function or plan.

Please describe the business scenario in detail and try to answer the following questions:

1. What kind of business are you in? As an ordinary person, how can I use your products and services? Please give a real example.
2. What problems are you solving in your business with SRS? Please give a real example.
3. How is the demand or function you proposed for SRS applied in the business? Please give an example.

> Note: If it is inconvenient to talk in the group, you can send it to me privately on WeChat.

The SRS Stack server open-source community works like this: you submit application scenarios, and we will prioritize implementation, using real nails to choose hammers, and welcome everyone to participate~

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

## The difference between SRS Stack and SRS

[SRS](https://github.com/ossrs/srs) is an open-source server, a streaming media server, which generally works with FFmpeg and WebRTC clients to achieve audio and video capabilities. Please see [this diagram](https://github.com/ossrs/srs#srssimple-realtime-server) to understand what SRS is.

SRS Stack is an audio and video solution that is based on SRS, Nodejs, REACT, etc. to implement common audio and video scenarios. Please see [this diagram](https://github.com/ossrs/srs-stack#architecture) to understand what SRS Stack is.

After SRS is installed, it opens a streaming media server demo page with links to the player and console; after SRS Stack is installed, it opens a login management backend that provides guidance for many different scenarios.

If you need to study the streaming media server in detail, please follow the SRS documentation and join the SRS community, and do not ask in the SRS Stack group. SRS is an open-source audio and video server, aimed at highly skilled C/C++ programmers, and you can modify it at will, with strong customization capabilities.

If you want an out-of-the-box audio and video platform that can be used online, please use SRS Stack and do not ask in the SRS community. The meaning of SRS Stack is SRS in the cloud. It is a cloud-based service aimed at users who do not need to understand the details of audio and video and can operate according to the tutorial.

Both are open-source projects, and contributions are welcome.

<a name="diff-baota"></a><br/><br/><br/>

## The difference with aaPanel

aaPanel is a virtual machine management tool, and SRS Stack Server is an out-of-the-box audio and video solution. aaPanel can also install SRS Stack, please refer to [supported platforms](#support-platform).

> Note: The overseas version of Baota is called aaPanel, which also supports SRS Stack; if your machine is overseas, please do not use Baota, but use aaPanel; everyone uses different installation sources, and using Baota overseas may be very slow or even fail.

<a name="diff-vcloud"></a><br/><br/><br/>

## The difference with Video Cloud

Video Cloud is a large-scale service scenario, such as cloud live broadcasting, TRTC, IM, cloud on-demand, CDN, Tencent Meeting or ZOOM, which are all super-large-scale systems.

SRS Stack Server puts all these systems in a single `Lighthouse/CVM/Droplet/aaPanel` cloud server, so it is mainly comprehensive, but the concurrency and scale are very small, only suitable for small and micro scenarios, quickly building applications to achieve business, understanding and learning new scenarios, and can run and slowly see how to implement.

Of course, in the future, SRS Stack Server will also support migration to mature video cloud services, allowing everyone to quickly meet business requirements while also getting scalable support as the business grows.

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

Regarding the open API, using AP to dock with SRS Stack, you can follow the guide in `System Configuration > OpenAPI`.

All operations of SRS Stack are done by calling the API, and these APIs can be seen in the Chrome Network panel for specific requests.

All operations that can be completed on the SRS Stack page can be completed through OpenAPI.

<a name='features'></a><br/><br/><br/>

## Features

SRS Stack (i.e., SRS Stack Server) is an open-source solution implemented in nodejs, with the code in [srs-stack](https://github.com/ossrs/srs-stack). Everyone is welcome to join.

SRS Stack Server is aimed at mouse programming, allowing everyone to do audio and video business. It is suitable for those who do not understand audio and video, those who understand audio and video, those who farm, those who pull network cables, those who cut movies, those who carry cameras, those who dance, those who sing, those who sell second-hand goods, those who exchange open-source projects, those who live on multiple platforms, those who build their own source stations, those who can use computers and have WeChat, and those who are law-abiding citizens.

For instructions on using SRS Stack, please refer to the video [SRS Stack Server: Getting Started, Purchasing, and Introduction](https://www.bilibili.com/video/BV1844y1L7dL/).

Currently, the scenarios and functions supported by SRS Stack, see [Features](https://github.com/ossrs/srs-stack#features).

Welcome to join the group to discuss the use of SRS Stack. All these SRS peripheral services are open-source and can be customized and deployed by yourself.

<a name='changelog'></a><br/><br/><br/>

## Changelog

The following are the update records for the SRS Stack server.

* v5.11
    * VLive: Decrease the latency for virtual live. v5.11.1
* v5.10
    * Refine README. v5.10.1
    * Refine DO and droplet release script. v5.10.2
    * VLive: Fix bug of link. v5.10.2
    * Record: Fix bug of change record directory. v5.10.2 (#133)
    * Streaming: Add SRT streaming. [v5.10.2](https://github.com/ossrs/srs-stack/releases/tag/v5.10.2)
    * Streaming: Add OBS SRT streaming. v5.10.3
    * Fix lighthouse script bug. v5.10.4
    * VLive: Support forward stream. v5.10.5
    * VLive: Cleanup temporary file when uploading. v5.10.6
    * VLive: Use TCP transport when pull RTSP stream. [v5.10.7](https://github.com/ossrs/srs-stack/releases/tag/v5.10.7)
    * Refine statistic and report data. v5.10.8
    * Support file picker with language. [v5.10.9](https://github.com/ossrs/srs-stack/releases/tag/v5.10.9)
    * Report language. v5.10.10
    * Transcode: Support live stream transcoding. [v5.10.11](https://github.com/ossrs/srs-stack/releases/tag/v5.10.11)
    * Transcode: Fix param bug. v5.10.12
    * Fix default stream name bug. v5.10.13
* v5.9
    * Update NGINX HLS CDN guide. v5.9.2
    * Move DVR and VoD to others. v5.9.3
    * Remove the Tencent CAM setting. v5.9.4
    * Refine Virtual Live start and stop button. v5.9.5
    * Refine Record start and stop button. v5.9.6
    * Refine Forward start and stop button. v5.9.7
    * Move SRT streaming to others. v5.9.8
    * Support vlive to use server file. v5.9.9
    * Add test for virtual live. v5.9.10
    * Add test for record. v5.9.11
    * Add test for forward. v5.9.12
    * Refine test to transmux to mp4. [v5.9.13](https://github.com/ossrs/srs-stack/releases/tag/v5.9.13)
    * Upgrade jquery and mpegtsjs. v5.9.14
    * Support authentication for SRS HTTP API. [v5.9.15](https://github.com/ossrs/srs-stack/releases/tag/v5.9.15)
    * Don't expose 1985 API port. v5.9.16
    * Load environment variables from /data/config/.srs.env. v5.9.17
    * Change guide to use $HOME/data as home. v5.9.18
    * Translate forward to English. [v5.9.19](https://github.com/ossrs/srs-stack/releases/tag/v5.9.19)
    * Refine record, dvr, and vod files. v5.9.20
    * Translate record to English. [v5.9.21](https://github.com/ossrs/srs-stack/releases/tag/v5.9.21)
    * Refine virtual live files. v5.9.22
    * Translate virtual live to English. v5.9.23
    * Support always open tabs. v5.9.24
    * Remove record and vlive group. [v5.9.25](https://github.com/ossrs/srs-stack/releases/tag/v5.9.25)
    * Refine project description. v5.9.26
    * Refine DO and droplet release script. [v5.9.27](https://github.com/ossrs/srs-stack/releases/tag/v5.9.27)
    * Fix bug, release stable version. v5.9.28
    * VLive: Fix bug of link. v5.9.28
    * Record: Fix bug of change record directory. v5.9.28 (#133)
    * Streaming: Add SRT streaming. [v5.9.28](https://github.com/ossrs/srs-stack/releases/tag/v5.9.28)
    * Fix lighthouse HTTPS bug. v5.9.29
* v5.8
    * Always dispose DO VM and domain for test. v1.0.306
    * Fix docker start failed, cover by test. v1.0.306
    * Switch default language to en. v1.0.306
    * Support include for SRS config. v1.0.306
    * Support High Performance HLS mode. v1.0.307
    * Show current config for settings. v1.0.307
    * Switch MIT to AGPL License. v1.0.307
    * Use one version strategy. [v5.8.20](https://github.com/ossrs/srs-stack/releases/tag/v5.8.20)
    * Always check test result. v5.8.21
    * SRT: Enable srt in default vhost. v5.8.22
    * Add utest for HP HLS. v5.8.23
    * Migrate docs to new website. v5.8.23
    * BT and aaPanel plugin ID should match filename. v5.8.24
    * Add Nginx HLS Edge tutorial. v5.8.25
    * Download test file from SRS. v5.8.26
    * Do not require version. v5.8.26
    * Fix Failed to execute 'insertBefore' on 'Node'. v5.8.26
    * Eliminate unused callback events. v5.8.26
    * Add docker for nginx HLS CDN. v5.8.27
    * Update SRS Stack architecture. v5.8.27
    * Use DO droplet s-1vcpu-1gb for auto test. v5.8.28
    * Use default context when restore hphls. [v5.8.28](https://github.com/ossrs/srs-stack/releases/tag/v5.8.28)
    * Support remote test. v5.8.29
    * Enable CORS and timestamp in HLS. [v5.8.30](https://github.com/ossrs/srs-stack/releases/tag/v5.8.30)
    * Release stable version. [v5.8.31](https://github.com/ossrs/srs-stack/releases/tag/v5.8.31)
* v5.7
    * Refine DigitalOcean droplet image. v1.0.302
    * Support local test all script. v1.0.302
    * Rewrite script for lighthouse. v1.0.303
    * Set nginx max body to 100GB. v1.0.303
    * Use LEGO instead of certbot. v1.0.304
    * Rename SRS Cloud to SRS Stack. v1.0.304
    * Support HTTPS by SSL file. v1.0.305
    * Support reload nginx for SSL. v1.0.305
    * Support request SSL from letsencrypt. v1.0.305
    * Support work with bt/aaPanel ssl. v1.0.305
    * Support self-sign certificate by default. v1.0.305
    * Query configured SSL cert. v1.0.305
    * 2023.08.13: Support test online environment. [v5.7.19](https://github.com/ossrs/srs-stack/releases/tag/publication-v5.7.19)
    * 2023.08.20: Fix the BT and aaPanel filename issue. [v5.7.20](https://github.com/ossrs/srs-stack/releases/tag/publication-v5.7.20)
* 2023.08.06, v1.0.301, v5.7.18
    * Simplify startup script, fix bug, adjust directory to `/data` top-level directory. v1.0.296
    * Improve message prompts, script comments, and log output. v1.0.297
    * Avoid modifying the global directory every time it starts, initialize it in the container and platform script. v1.0.298
    * Improve release script, check version matching, manually update version. v1.0.299
    * Remove upgrade function, maintain consistency of docker and other platforms. v1.0.300
    * Improved BT and aaPanel scripts, added test pipeline. v1.0.300
    * Always use the latest SRS 5.0 release. v1.0.301
    * Use status to check SRS, not by the exit value. v1.0.301
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
    * Support [local recording](https://github.com/ossrs/srs-stack/issues/42), recording to SRS Stack local disk.
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
    * Containers work in an independent `srs-stack` network.
    * Add `System > Tools` option.
    * Use Redis container, not dependent on host Redis service.
* 2022.04.06, v1.0.200, major version update, multi-language, Release 4.4
    * Support Chinese and English bilingual.
    * Support DigitalOcean image, see [SRS Droplet](https://marketplace.digitalocean.com/apps/srs).
    * Support OpenAPI to get push stream key, see [#19](https://github.com/ossrs/srs-stack/pull/19).
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
* 2022.03.16, v1.0.162, Major version update, error handling, Release 4.3
    * Support for React Error Boundary, friendly error display.
    * Support for RTMP push QR code, core image guidance.
    * Support for simple player, playing HTTP-FLV and HLS.
    * Improved callbacks, created with React.useCallback.
    * Improved page cache time, increased loading speed.
    * Added REACT UI components and Nodejs project testing.
    * Added script for installing dependency packages.
    * Improved simple player, not muted by default, requires user click to play.
    * Added Watermelon Player [xgplayer](https://github.com/bytedance/xgplayer), playing FLV and HLS
* 2022.03.09, v1.0.144, Minor version update, multi-platform forwarding
    * Support for multi-platform forwarding, video number, Bilibili, Kuaishou.
    * Restart forwarding task when modifying forwarding configuration.
    * Support for setting upgrade window, default upgrade from 23:00 to 5:00.
    * Support for jest unit testing, covering mgmt.
    * Support for switching SRS, stable version and development version.
    * Optimized display of disabled container status.
* 2022.03.04, v1.0.132, Minor version update, cloud on-demand
    * Support for cloud on-demand, HLS and MP4 downloads.
    * Cloud on-demand supports live playback, updating SessionKey.
    * Disable password setting during upgrade to avoid environment variable conflicts.
    * Restart all containers dependent on .env when initializing the system.
    * Update the differences between cloud recording and cloud on-demand.
    * SRT supports vMix tutorial.
* 2022.02.25, v1.0.120, Minor version update, cloud recording
    * Improved upgrade script, restarting necessary containers.
    * Modified Redis listening port, enhanced security.
    * Resolved cloud recording, asynchronous long time (8h+) conflict issue.
    * Improved key creation link, using cloud API key.
    * Improved scene and settings TAB, loaded on demand, URL address identification.
* 2022.02.23, v1.0.113, Minor version update, cloud recording
    * Support for resetting push key. [#2](https://github.com/ossrs/srs-terraform/pull/2)
    * SRT push disconnects when RTMP conversion fails.
    * Disabled containers no longer start.
    * SRT supports QR code scanning for push and playback. [#6](https://github.com/ossrs/srs-terraform/pull/6)
    * Support for [cloud recording](https://mp.weixin.qq.com/s/UXR5EBKZ-LnthwKN_rlIjg), recording to Tencent Cloud COS.
* 2022.02.14, v1.0.98, Major version update, upgrade, Release 4.2
    * Improved React static resource caching, increasing subsequent loading speed.
    * Added Contact exclusive group QR code, scan code to join group.
    * Support for setting Redis values, disabling automatic updates.
    * Automatically detect overseas regions, use overseas sources for updates and upgrades.
    * Improved upgrade prompts, countdown and status detection.
    * Display video tutorials created by everyone on the page, sorted by play count.
    * Support for authorizing platform administrators to access Lighthouse instances.
    * Small memory systems, automatically create swap to avoid OOM during upgrades.
* 2022.02.05, v1.0.74, minor update, dashboard
    * Support for Prometheus monitoring, WebUI mounted on `/prometheus`, no authentication for now.
    * Support for Prometheus NodeExporter, node monitoring, Lighthouse's CPU, network, disk, etc.
    * Added dashboard, added CPU chart, can jump to [Prometheus](https://github.com/ossrs/srs/issues/2899#prometheus).
    * Improved certbot, started with docker, not an installation package.
    * Improved upgrade process to prevent duplicate upgrades.
    * Support for upgrading machines with 1GB memory, disabling node's GENERATE_SOURCEMAP to prevent OOM.
* 2022.02.01, v1.0.64, minor update, HTTPS
    * Support for Windows version of ffplay to play SRT addresses
    * Support for container startup hooks, stream authentication and authorization
    * Change Redis listening on lo and eth0, otherwise container cannot access
    * Support for setting HTTPS certificates, Nginx format, refer to [here](https://github.com/ossrs/srs/issues/2864#ssl-file)
    * Support for Let's Encrypt automatic application of HTTPS certificates, refer to [here](https://github.com/ossrs/srs/issues/2864#lets-encrypt)
* 2022.01.31, v1.0.58, minor update, SRT
    * Support for ultra-clear real-time live streaming scenarios, SRT push and pull streaming, 200~500ms latency, refer to [here](https://github.com/ossrs/srs/issues/1147#lagging)
    * Chip/OBS+SRS+ffplay push and pull SRT stream address, support authentication.
    * Support for manual upgrade to the latest version, support for forced upgrade.
    * Improved upgrade script, execute after updating the script
    * Support for restarting SRS server container
* 2022.01.27, v1.0.42, major update, stream authentication, Release 4.1
    * Support for push stream authentication and management backend
    * Support for updating backend, manual update
    * Live room scenario, push stream and play guide
    * SRS source code download, with GIT
    * Support for Lighthouse image, refer to [SRS Lighthouse](https://mp.weixin.qq.com/s/fWmdkw-2AoFD_pEmE_EIkA).
* 2022.01.21, Initialized.

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/pages/faq-srs-stack-en)
