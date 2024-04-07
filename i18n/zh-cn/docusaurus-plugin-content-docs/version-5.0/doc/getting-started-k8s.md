---
title: K8s
sidebar_label: K8s
hide_title: false
hide_table_of_contents: false
---

# K8s

推荐使用HELM方式部署SRS，参考[srs-helm](https://github.com/ossrs/srs-helm)。当然，SRS也支持K8s方式直接部署，
参考[SRS K8s](./k8s.md)。

其实HELM是基于K8s的，HELM最终部署的也是K8s的pod，而且可以使用kubectl管理。不过，HELM提供了更加方便的应用管理和安装方式，
因此，未来SRS主要支持的是HELM方式。

和Docker方式相比，HELM和K8s主要是中大规模的部署。如果你的业务规模并不大，那么推荐直接使用Docker或者Oryx方式。
一般而言，如果你的流没有超过一千路，请不要使用HELM或K8s的方式。

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v5/getting-started-k8s)


