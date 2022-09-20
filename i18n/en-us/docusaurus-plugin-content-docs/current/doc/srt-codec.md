---
title: SRT Codec
sidebar_label: SRT Codec
hide_title: false
hide_table_of_contents: false
---

# SRT codec support

## Video codec

Current support:
* H264
* HEVC

### Note about HEVC support
The format of media publish by SRT is mpegts, and it support HEVC with streamtpe 0x24, so we can publish or play HEVC stream by SRT normal.

* HEVC SRT publish
    - `ffmpeg -re -i source.mp4 -c:v libx265 -c:a aac -f mpegts 'srt://127.0.0.1:10080?streamid=livestream'`
* HEVC SRT play
    - `ffplay 'srt://127.0.0.1:10080?streamid=#!::h=live/livestream,m=request'` 

But rtmp don't support HEVC, so we can't play rtmp HEVC stream publish by SRT when srt_to_rtmp enabled.

## Audio codec

Current support:
* AAC
    - Sample rate 44100, 22050, 11025, 5512

### Note
We recommend add `-pes_payload_size 0` in FFmpeg command line when publish SRT stream in AAC codec. 
The parameter prevent merge multi AAC frame in one PES packet, so it can reduce the latency and avoid AV synchronization errors.
FFmpeg command line example:
> `ffmpeg -re -i source.mp4 -c:v libx265 -c:a aac -pes_payload_size 0 -f mpegts 'srt://127.0.0.1:10080?streamid=livestream'`

Runner365 2020.02

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc/en/v5/srt-codec)


