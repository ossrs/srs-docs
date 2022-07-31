---
title: IDE
sidebar_label: IDE
hide_title: false
hide_table_of_contents: false
---

# IDE

关于SRS的IDE（集成开发环境）。

## CLion

SRS只支持JetBrains的[CLion](http://www.jetbrains.com/clion/)，它是基于cmake编译的。

IDE操作步骤：

1. 先下载和安装[CLion](http://www.jetbrains.com/clion/)
1. 运行CLion，打开SRS的目录，打开文件 `trunk/ide/srs_clion/CMakeLists.txt`
2. 选择右上角`Load CMake project`，就开始编译SRS的依赖，对应的是 `./configure` 命令，参考： ![](/img/doc-integration-ide-001.png) ![](/img/doc-integration-ide-003.png)
3. 点右上角编译、启动或调试SRS，就可以启动调试，对应的是 `make && ./objs/srs -c conf/clion.conf` ，参考： ![](/img/doc-integration-ide-004.png)

若执行失败，也可以右键`CMakeLists.txt`，选择`Reload CMake project`重试，参考： ![](/img/doc-integration-ide-002.png)

也可以直接执行命令：

```bash
cd trunk/ide/srs_clion &&
cmake -B cmake-build-debug . && cd cmake-build-debug && 
make
```

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

Winlin 2015.3
![](https://ossrs.net/gif/v1/sls.gif?site=ossrs.io&path=/lts/doc-zh-4/doc/ide)


