---
title: HEVC
sidebar_label: HEVC
hide_title: false
hide_table_of_contents: false
---

# HEVC

HEVC, also known as H.265, is the next-generation encoding after H.264 and belongs to the same generation of codecs 
as AV1. H.265 can save about half the bandwidth compared to H.264, or provide double the clarity and image quality at 
the same bandwidth.

However, the problem with H.265 is that it's not yet widely supported by clients. Almost all devices support H.264, 
including low-performance phones or boxes, which have dedicated chips for H.264 support. Although H.265 has been 
developed for almost ten years, there are still not enough devices that support it. In specific scenarios, like when 
the device clearly supports H.265, you can choose H.265; otherwise, stick with H.264.

Additionally, the support for H.265 in transport protocols is gradually improving, but not all protocols support it 
yet. MPEG-TS was the first to support H.265, and since SRT and HLS are based on TS, they also support it. RTMP and 
HTTP-FLV only started supporting HEVC and AV1 in March 2023 with the [Enhanced RTMP](https://github.com/veovera/enhanced-rtmp) 
project. As for WebRTC, only Safari supports it currently, and Chrome is said to be in development.

As H.265 becomes more complete, SRS initially had a branch supporting H.265 (see [feature/h265](https://github.com/ossrs/srs-gb28181/tree/feature/h265)
). However, SRS 5.0 does not support H.265. If you need to use the H.265 feature, please switch to the SRS 6.0 version.

![](https://ossrs.io/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v5/hevc)


