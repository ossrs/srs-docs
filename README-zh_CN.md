# srs-docs
The documents for SRS

[English](./README.md) | 简体中文

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.18.1

    $ npm --version
    6.14.15

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

If the installation was successful, you should be able to run the following command.

    $ yarn --version
    1.22.15

### Docker 安装
  search功能依赖typesense和scraper两个docker镜像，所以在本地开发环境中，需要[install docker](https://docs.docker.com/get-docker/)

---
## Getting Started

### Installation

```
$ yarn install
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### 本地预览

```
$ yarn serve
```

This command 可以在 `build` 完成后直接预览实际效果。

### Change baseUrl

```
$ yarn cross-env BASE_URL='/custom-base-url/' docusaurus build
```

This command uses `'/custom-base-url/'` instead of the default baseUrl(`'/lts/'`) to generate static content.


## 翻译

### 本地运行英文版网站

```
$ yarn run start -- --locale en
```
您的站点可通过 http://localhost:3000/en/ 访问


### 翻译

#### 提取页面中需要翻译的内容

    $ yarn docusaurus write-translations -- --locale en

  此命令将提取并初始化待翻译的 JSON 译文文件。

#### 拷贝文档和博客文件

    将待翻译的文档拷贝到 `/i18n/en/docusaurus-plugin-content-docs/current` 目录
    `/i18n/en/docusaurus-plugin-content-docs/current` 目录结构需要和 `/docs` 保持一致

    将待翻译的博客拷贝到 `/i18n/en/docusaurus-plugin-content-blog/current` 目录
    `/i18n/en/docusaurus-plugin-content-blog/current` 目录结构需要和 `/blog` 保持一致

#### 修改 `/i18n/en/` 中的文件并通过 `http://localhost:3000/en/` 查看翻译结果


## 环境变量

|  变量名   | 默认值  | 优先级  | 作用  |
|  ----  | ----  | ----  | ----  |
| URL  | `"https://ossrs.io"` | 高 | 设置域名 |
| BASE_URL  | `"/"` | 高 | 设置网站 baseUrl |
| DEFAULT_LOCALE  | `"en-us"` | 高 | 设置默认语言 |
| REGION  | `""` | 低  | 设置网站默认配置模板，模板中的参数可以被更高优先级的环境变量覆盖。 |


### REGION 环境变量取值说明

#### 不设置

```
yarn build
```

使用 config 目录下的 default.js 文件中的配置

```js
{
  url: 'https://ossrs.io',
  baseUrl: '/',
  defaultLocale: 'en-us',
  plugins: [
    [
      './config/docusaurus-dynamic-copyright-plugin',
      {
        copyright: `<p>©2013~${new Date().getFullYear()} SRS</p>`,
      },
    ],
  ],
}
```
#### 设置 `"zh-cn"`

```
yarn cross-env REGION='zh-cn' docusaurus build
```

使用 config 目录下的 zh-cn.js 文件中的配置

```js
{
  url: 'https://ossrs.net',
  baseUrl: '/lts/',
  defaultLocale: 'zh-cn',
  plugins: [
    [
      './config/docusaurus-dynamic-copyright-plugin',
      {
        copyright: `<p>©2013~${new Date().getFullYear()} SRS <a href="https://beian.miit.gov.cn">京ICP备19056366号-1</a></p>`,
      },
    ],
  ],
};
```

---

## 搜索

> 此文档网站的搜索功能是选用typesense+scraper的方案实现的，具体实现请参考[using-typesense-docsearch](https://docusaurus.io/docs/search#using-typesense-docsearch) 以及 [Search for Documentation Sites](https://typesense.org/docs/guide/docsearch.html#search-for-documentation-sites)

### 本地如何启用搜索功能？

1. 本地启动typesense, 它是一个开源的即时搜索引擎，提供文档搜索API服务. 我们选用在本地自建一个typesense server

```
  yarn typesense
```

2. 本地启动文档网站

```
  yarn build
  yarn serve
```

3. 启动[scraper](https://github.com/typesense/typesense-docsearch-scraper), 它会抓取文档网站的内容，并将数据送到typesense server进行索引处理

```
  yarn scraper
```
scraper文档处理完成后，就可以在页面中进行搜索了。

## 如何在docs下新增文档

### 在已有目录下新增一个文档

> 比如在 <strong>教程</strong> 中增加一个(example.md)的文档

1. 增加英文文档
  
```
cd i18n/en-us/docusaurus-plugin-content-docs/current/tutorial/ && touch example.md
```

2. 增加中文文档

```
cd i18n/zh-cn/docusaurus-plugin-content-docs/current/tutorial/ && touch example.md
```

3. 侧边栏配置， 参考官方文档：https://docusaurus.io/zh-CN/docs/next/sidebar/items

```
  在sidebar.json中的tutorialSidebar配置项中增加['tutorial/example'],注意不要带.md后缀
```
  
  配置完成后，就可以在教程目录中看到新增的文档了
   

### 新增一个目录以及文档

> 比如在 <strong>教程</strong> 中增加一个(mydir/new-example.md)的文档

1. 增加英文文档
  
```
cd i18n/en-us/docusaurus-plugin-content-docs/current/tutorial/ && mkdir -p mydir && touch new-example.md
```

1. 增加中文文档

```
cd i18n/zh-cn/docusaurus-plugin-content-docs/current/tutorial/ && mkdir -p mydir && touch new-example.md
```

3. 侧边栏配置， 参考文官方文档：https://docusaurus.io/zh-CN/docs/next/sidebar/items


  在sidebar.json中的tutorialSidebar配置项中增加category分类侧边栏，并在items中增加子文件路径
  ```
  {
    type: 'category',
    label: 'NewDir',
    link: {
      type: 'generated-index',
    },
    collapsed: true,
    items: ['tutorial/mydir/new-example'],
  }
  ```

  配置完成后，就可以在教程的目录中看到新增的目录和文档了

4. 修改侧边栏目录的中文名称

  ```
  执行 yarn docusaurus write-translations -- --locale zh-cn
  在 i18n/zh-cn/docusaurus-plugin-content-docs/current.json，找到新增目录的英文名称'NewDir' 将其修改为对应的中文名称即可。
  ```
