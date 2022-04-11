# How to Secure SRS with Let's Encrypt by 1-Click

## Introduction

As a CA(Certificate Authority), Let's Encrypt provides free and automatic TLS/SSL certificates, thereby enabling encrypted HTTPS for SRS Droplet. It's very easy to use, only by 1-Click.

HTTPS is required for publishing streams using WebRTC, and it adds security. If you want to use the video streaming in any HTTPS website, such as a WordPress website, you must use HLS/FLV/WebRTC with HTTPS, or it fails for security reasons.

> Note that SRS droplet only supports a single domain name, which makes the problem simple, and easy to use.

In this tutorial, you will learn how to configure the HTTPS for SRS droplets, and your certificate will be renewed automatically.

## Prerequisites

To complete this guide, you will need:

1. A SRS Droplet with Cloud SRS installed, please follow this [set-up a video streaming service](https://blog.ossrs.io/how-to-setup-a-video-streaming-service-by-1-click-e9fe6f314ac6) tutorial.
1. A fully registered domain name, you could purchase a domain name on [Namecheap](https://namecheap.com/) or [GoDaddy](https://godaddy.com/), however we will use placeholder `your_domain_name` throughout this tutorial.

This guide will use placeholder `your_public_ipv4` and `your_domain_name` throughout. Please replace them with your own IP address or domain name.

## Step 1 - DNS Records Setup

When you get a domain name, make sure a DNS record set-up for your server, please add an `A record` with `your_domain_name` pointing to your server public IP address that is `your_public_ipv4` as we said, see [Domains and DNS](https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/#a-records). Add a record like this:

```text
A your_domain_name your_public_ipv4
```

To check the domain name, your status should look like this:

```bash
ping your_domain_name
```

```text
Output
PING ossrs.io (your_public_ipv4): 56 data bytes
64 bytes from your_public_ipv4: icmp_seq=0 ttl=64 time=11.828 ms
64 bytes from your_public_ipv4: icmp_seq=1 ttl=64 time=16.553 ms
64 bytes from your_public_ipv4: icmp_seq=2 ttl=64 time=12.433 ms
```

If you visit `http://your_domain_name/mgmt`, you should see the SRS Cloud console now.

![](/img/blog-2022-04-12-01.png)

Next, let's fetch our certificates.

## Step 2 - Obtaining an SSL Certificate

Now please switch to `System > HTTPS > Let's Encrypt` and enter `your_domain_name`, then click `Submit` button to request a free SSL cert from [Let's Encrypt](https://letsencrypt.org/):

![](/img/blog-2022-04-12-02.png)

This runs `certbot` to fetch an SSL certificate, it will communicate with the Let's Encrypt server, then create a challenge to verify that you control the domain that you're requesting a certificate for. All these are automatically done by Cloud SRS.

If that's successful, please try reloading your website using `https://your_domain_name/mgmt` and notice your browser's security indicator, see following figure:

![](/img/blog-2022-04-12-03.png)

Le's finish by the renewal process.

## Step 3 - About Certificate Auto-Renewal

Let's Encrypt's certificates are only valid for about 3 months. SRS Cloud will start a timer to renew your certificates every day, and reload Nginx to apply the changes.

You can check the renew log by:

```bash
docker logs platform |grep renew
```

```text
Output
Thread #crontab: auto renew the Let's Encrypt ssl
Thread #crontab: renew ssl updated=false, message is 
Processing /etc/letsencrypt/renewal/lh.ossrs.net.conf
Certificate not yet due for renewal
The following certificates are not due for renewal yet:
No renewals were attempted.
```

If no errors, you'are all set.

## Conclusion

In this tutorial, you set-up the DNS A Record, downloaded SSL Certificates for your domain, configured Nginx to apply the certificate, and set-up automatic renewal. If you have further questions, please contact us by [discord](https://discord.gg/yZ4BnPmHAd).

