---
title: Cloud SRS
sidebar_label: Cloud SRS
hide_title: false
hide_table_of_contents: false
---

# Cloud SRS

SRS Cloud is a video cloud solution that is lightweight, open-source, and based on Go, 
Reactjs, SRS, FFmpeg, WebRTC, etc.

Comparing SRS Cloud and SRS, both offer media streaming capabilities at a similar level. 
However, SRS Cloud provides a more powerful and feature-rich experience for end users, 
eliminating the need to write any code. Users can directly utilize SRS Cloud for your 
media services needs.

| Comparison       | SRS Cloud | SRS           | Notes                                                                |
|------------------|-----------|---------------|----------------------------------------------------------------------|
| License          | AGPL      | MIT           | SRS Cloud is open-source with an AGPL license.                       |
| Live Streaming   | Yes       | Yes           | Both support RTMP, HLS, and HTTP-FLV protocols.                      |
| WebRTC           | Yes       | Yes           | WebRTC is supported by both.                                         |
| Console          | Enhanced  | HTTP API      | SRS Cloud offers a more powerful console.                            |
| Authentication   | Yes       | HTTP Callback | SRS Cloud has built-in authentication, while SRS uses callbacks.     |
| DVR              | Enhanced  | File-based    | SRS Cloud supports DVR to file and cloud storage.                    |
| Forwarding       | Enhanced  | Basic         | SRS Cloud can forward to multiple platforms via various protocols.   |
| Virtual Live     | Yes       | No            | SRS Cloud provides advanced virtual live streaming capabilities.     |
| WordPress        | Yes       | No            | SRS Cloud offers a WordPress plugin and step-by-step guidelines.     |

## DigitalOcean Droplet

Please read [DigitalOcean Droplet](https://github.com/ossrs/srs-cloud/wiki/Droplet): Create SRS Droplet.

## TencentCloud CVM

Please read [TencentCloud CVM](https://www.bilibili.com/video/BV1844y1L7dL/): Deploy SRS to Tencent CVM.

## TencentCloud LightHouse

Please read [TencentCloud LightHouse](https://www.bilibili.com/video/BV1844y1L7dL/): Deploy SRS to Tencent LightHouse.

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v5/getting-started-cloud)


