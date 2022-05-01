---
title: Deploy
sidebar_label: Deploy
hide_title: false
hide_table_of_contents: false
---

## K8s

> Cloud+Docker+K8S enable everyone to build live video streaming cluster and service.
Why should you use [k8s](https://docs.kubernetes.io/docs/concepts/overview/what-is-kubernetes) to build your SRS cluster?

* Simple: It's really simple and convenient, let's figure it out by [QuickStart](#quick-start).
* Declarative deployment: We declare a desired SRS cluster and it'll always be there, without starting and migrating service, watchdog and SLB configuration.
* Expand easily: K8S allows you to expand infrastructure automatically, and you can expand your business cluster easily by change the number of Pods.
* Rolling Update: K8S allows deployment update, rollback and gray release with zero downtime.
* XXX: Coming soon...

This tutorial highlights how to build SRS cluster for a variety of scenarios in [ACK(AlibabaCloud Container Service for Kubernetes)](https://www.alibabacloud.com/product/kubernetes).

1. [Deploy to Cloud Platforms](#deploy-to-cloud-platforms): Clone template project and use actions to deploy.
2. [Quick Start](#quick-start): Deployment a SRS origin server in ACK.
3. [SRS Shares Volume with Nginx](#srs-shares-volume-with-nginx): SRS is able to deliver simple HTTP content, or work with Nginx, SRS delivers RTMP/HTTP-FLV and write HLS to a share volume, then Nginx reads and delivers HLS.
4. [SRS Edge Cluster for High Concurrency Streaming](#srs-edge-cluster-with-slb): SRS edge cluster, which is configured and updated automatically, to provide services for huge players.
5. [SRS Origin Cluster for a Large Number of Streams](#srs-origin-cluster-for-a-large-number-of-streams): SRS origin cluster is designed to serve a large number of streams.
6. [SRS Cluster Update, Rollback, Gray Release with Zero Downtime](#srs-cluster-update-rollback-gray-release-with-zero-downtime): K8S allows deployment update, rollback and gray release with zero downtime.
7. [Useful Tips](#useful-tips)
    1. [Create K8S Cluster in ACK](#create-k8s-cluster-in-ack): Create your own k8s cluster in ACK.
    2. [Publish Demo Streams to SRS](#publish-demo-streams-to-srs): Publish the demo streams to SRS.
    3. [Cleanup For DVR/HLS Temporary Files](#cleanup-for-dvrhls-temporary-files): Remove the temporary files for DVR/HLS.
    4. [Use One SLB and EIP for All Streaming Service](#use-one-slb-and-eip-for-all-streaming-service): Use one SLB for RTMP/HTTP-FLV/HLS streaming service.
    5. [Build SRS Origin Cluster as Deployment](#build-srs-origin-cluster-as-deployment): Rather than StatefulSet, we can also use deployment to build Origin Cluster.
    6. [Managing Compute Resources for Containers](#managing-compute-resources-for-containers): Resource requests and limits, and how pods requests are scheduled and limits are run.
    7. [Auto Reload by Inotify](#auto-reload-by-inotify): SRS supports auto reload by inotify watching ConfigMap changes.

## Deploy to Cloud Platforms

SRS provides a set of template repository for fast deploy:

* [General K8s](https://github.com/ossrs/srs-k8s-template)
* [TKE(Tencent Kubernetes Engine)](https://github.com/ossrs/srs-tke-template)
* [ACK(Alibaba Cloud Container Service for Kubernetes)](https://github.com/ossrs/srs-ack-template)
* [EKS(Amazon Elastic Kubernetes Service)](https://github.com/ossrs/srs-eks-template)
* [AKS(Azure Kubernetes Service)](https://github.com/ossrs/srs-aks-template)

## Quick Start

Assumes you have access to a k8s cluster:

```bash
kubectl cluster-info
```

Let's take a look at a single SRS origin server in k8s.

![SRS: Single Origin Server](https://ossrs.net/wiki/images/ack-srs-single-origin2.png)

**Step 1:** Create a [k8s deployment](https://v1-14.docs.kubernetes.io/docs/concepts/workloads/controllers/deployment) for SRS origin server:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: srs-deployment
  labels:
    app: srs
spec:
  replicas: 1
  selector:
    matchLabels:
      app: srs
  template:
    metadata:
      labels:
        app: srs
    spec:
      containers:
      - name: srs
        image: ossrs/srs:3
        ports:
        - containerPort: 1935
        - containerPort: 1985
        - containerPort: 8080
EOF
```

**Step 2:** Create a [k8s service](https://v1-14.docs.kubernetes.io/docs/concepts/services-networking/service) which exposing live video streaming service by [SLB](https://www.alibabacloud.com/product/server-load-balancer) with [EIP](https://www.alibabacloud.com/product/eip):

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: srs-service
spec:
  type: LoadBalancer
  selector:
    app: srs
  ports:
  - name: srs-service-1935-1935
    port: 1935
    protocol: TCP
    targetPort: 1935
  - name: srs-service-1985-1985
    port: 1985
    protocol: TCP
    targetPort: 1985
  - name: srs-service-8080-8080
    port: 8080
    protocol: TCP
    targetPort: 8080
EOF
```

**Step 3:** Done, you could get the EIP and play with SRS now.

Please use `kubectl get svc/srs-service` to get the EIP:

```
NAME          TYPE           CLUSTER-IP      EXTERNAL-IP
srs-service   LoadBalancer   172.21.12.131   28.170.32.118
```

Then you can publish and play with `28.170.32.118`:

* Publish RTMP to `rtmp://28.170.32.118/live/livestream`
* Play RTMP from [rtmp://28.170.32.118/live/livestream](http://ossrs.net/players/srs_player.html?app=live&stream=livestream&server=28.170.32.118&port=1935&autostart=true&vhost=28.170.32.118)
* Play HTTP-FLV from [http://28.170.32.118:8080/live/livestream.flv](http://ossrs.net/players/srs_player.html?app=live&stream=livestream.flv&server=28.170.32.118&port=8080&autostart=true&vhost=28.170.32.118&schema=http)
* Play HLS from [http://28.170.32.118:8080/live/livestream.m3u8](http://ossrs.net/players/srs_player.html?app=live&stream=livestream.m3u8&server=28.170.32.118&port=8080&autostart=true&vhost=28.170.32.118&schema=http)

![ACK: SRS Done](https://ossrs.net/wiki/images/ack-srs-done.png)

## SRS Shares Volume with Nginx

This chapter will show you how SRS is going to provide HTTP Service with Nginx based on K8S.

SRS can distribute RTMP and HTTP-FLV, and write HLS segments to shared Volume, the Nginx Container can read Volume and distribute HLS. Of course SRS can distribute HLS too, but the next scenarios are better to use Nginx :

* 80 port is already used by nginx, SRS can share Volume with Nginx

* Nginx support HTTPS, after configure certificate, it can serve the HLS files generated by SRS through HTTPS protocol.

* Nginx or other Web server, can provide authenticate to serve HLS segments in a secure way.

* SRS now only support a part of HTTP/1.1。 Nginx Open Source version 1.9.5 or higher has built-in support for HTTP/2

the difference of  traditional package deployment vs K8S:

|          |    ECS   |   K8S   |  comment  |
|  :----:  | :----:   | :----:  |  :----   |
| resources  | Manually |Automatically  |  From the traditional deployment, the resources SLB、EIP and ECS, you need to buy and configure one by one yourself,  use k8s the mentioned resources can be acquired and configured automatically.  |
| deployment  | Package |Image  |  From the K8s deployment, the pod’s docker image can easily rollback, and can keep the dev environment in touch with the prod, and the image can be cached on the node.
So with docker image, you will get the required high efficiency、high density、high portability、resource isolation. |
| watchdog  | Manually |Automatically  | When srs exited abnormally, the event should be monitored and auto restarted, you need do it by yourself from the traditional way.
k8s provides liveness probes and ensuring automatically recovered when anormaly appears.  |
| migration  | Manually |Automatically  |  From the traditional deployment way, when change ECS, you need to apply the new machine resource, modify SLB,  and install application by yourself.
Based on K8S, it can auto complete the service migration, update SLB, configure liveness, readiness and startup probes. |