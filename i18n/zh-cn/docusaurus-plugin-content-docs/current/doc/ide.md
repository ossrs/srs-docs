---
title: IDE
sidebar_label: IDE
hide_title: false
hide_table_of_contents: false
---

# IDE

关于SRS的IDE（集成开发环境）。

## VSCode

See [VSCode: Usage](https://github.com/ossrs/srs/blob/develop/.vscode/README.md) for example.

## CLion

SRS只支持JetBrains的[CLion](http://www.jetbrains.com/clion/)，它是基于cmake编译的。

IDE操作步骤：

1. 先下载和安装[CLion](http://www.jetbrains.com/clion/)
1. 运行CLion，打开SRS的目录，打开文件 `trunk/ide/srs_clion/CMakeLists.txt`
2. 选择右上角`Load CMake project`，就开始编译SRS的依赖，对应的是 `./configure` 命令，参考： ![](/img/doc-integration-ide-001.png) ![](/img/doc-integration-ide-003.png)
3. 点右上角编译、启动或调试SRS，就可以启动调试，对应的是 `make && ./objs/srs -c conf/clion.conf` ，参考： ![](/img/doc-integration-ide-004.png)

若执行失败，也可以右键`CMakeLists.txt`，选择`Reload CMake project`重试，参考： ![](/img/doc-integration-ide-002.png)

在IDE调试SRS，对新同学是非常友好的，各种信息扑面而来，有种信心大增的错觉：

![](/img/doc-integration-ide-005.png)

Clion的主要亮点：

1. windows下linux程序的IDE。别纠缠vs是不是王中之王，用vs打开srs代码错误就一坨一坨的，没法正常使用。
2. 可以忽略编译，当作编辑器使用。windows下的linux代码无法编译过，mingw有时也不好使，但是Clion可以当作编辑器使用。
3. 支持基本功能：函数跳转，类跳转，头文件跳转，hpp和cpp直接跳转，智能提示，没用的宏定义的提示。
4. 支持FindUsage：函数或者类在什么地方使用了，这个功能对于代码阅读和修改很有用。
5. 支持Refactor：Rename，Extract，Move，ChangeSignature，PullMemberUp/Down众多减少苦力的功能。
6. 还有个牛逼的东西，选中后按CTRL+F，自动高亮。这个是非常非常常用的功能，比notepad++好。upp就是没有这个愁死我了。
7. InspectCode，代码检查，分析代码潜在的问题，譬如我检查srs有：一千个拼写问题，没有用到的代码2百行，类型检查1百个，声明问题2个。

术业有专攻，JetBrains的IDE做得非常之用心。

## Windows

下面介绍一种在Windows系统上图形化调试Linux的代码的方法。采用的是SSH远程调试的方式。 所以，需要准备2台主机，一台本地机器Windows，一台远端机器Linux（可以是虚拟机）。

Linux主机安装以下几个必需的软件。注意：本文的方式不需要安装gdb-server。

```bash
yum install perl-core cmake gcc gcc-c++ gdb -y
```

接下来，就全部是Clion的图形化配置了。

**1. 新建SSH连接**

> 路径：File-->Settings-->Tools-->SSH Configurations

点击`＋`新建一个SSH连接，输入IP、端口、用户名、密码之后，点击`Test Connection`测试配置是否成功，如下图所示：

![image.png](/img/doc-integration-ide-006.png)

**2. 配置工具链**

> 路径：File-->Settings-->Build,Execution,Deployment-->Toolchains

点击`+`新建`Remote Host`，Credentials项选择刚才创建的SSH连接。

![image.png](/img/doc-integration-ide-007.png)

`Clion`会自动检测CMake、gcc、g++、gdb的信息。上图中因为升级了cmake和gcc的版本，导致自动检测失败，所以手动指定其路径。

**3. 配置远程部署**

> 路径：File-->Settings-->Build,Execution,Deployment-->Deployment

点击`+`新建`SFTP`，切换到`Connection`选项卡，选择刚才新建的SSH连接。

![image.png](/img/doc-integration-ide-008.png)

再切换到`Mappings`选项卡，配置本地路径和远程路径，用于代码同步

![image.png](/img/doc-integration-ide-009.png)

**4. 代码上传**

![image.png](/img/doc-integration-ide-010.png)

> **注意**：代码上传到远端机之后，需要`chmod`授权，否则可能会遇到编译失败。

**5. 配置工作目录和启动参数**

![image.png](/img/doc-integration-ide-011.png)

最后，就是愉快的Clion之旅了。

Winlin 2015.3

![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.net&path=/lts/doc/zh/v7/ide)


