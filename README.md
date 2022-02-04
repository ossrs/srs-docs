# srs-docs
The documents for SRS

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

### docker
The search function relies on two docker images, typesense and scraper, so you need to install docker in your local development environment. the installation can refer:[docker install](https://docs.docker.com/engine/install/ubuntu/)


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

### Change baseUrl

```
$ yarn cross-env BASE_URL='/custom-base-url/' docusaurus build
```

This command uses `'/custom-base-url/'` instead of the default baseUrl(`'/lts/'`) to generate static content.

### Dockers

* Docker hub: [ossrs/docs](https://hub.docker.com/r/ossrs/docs)
* Aliyun ACR: [registry.cn-hangzhou.aliyuncs.com/ossrs/docs](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/docs/images)


---
## Translate

### Start en-us site

Start your localized site in dev mode, using the locale of your choice:

```
$ yarn run start -- --locale en-us
```

Your site is accessible at `http://localhost:3000/en-us/`.


### Translate site content

#### Step 1: Translate JSON files

Run the write-translations command:

    $ yarn docusaurus write-translations -- --locale en-us

It will extract and initialize the JSON translation files that you need to translate.

The JSON files will be in generated in `/i18n/en-us/` path.


#### Step2: Translation Markdown files

First, you should copy markdown files in "/docs" and "/blog" folder to "/i18n/en/docusaurus-plugin-content-docs/current" and "/i18n/en/docusaurus-plugin-content-blog/current", then translation markdown files.

---
## Environment variable

|  Name   | Default value  | Level  | Effect |
|  ----  | ----  | ----  | ----  |
| URL  | `"https://ossrs.io"` | high | site url |
| BASE_URL  | `"/"` | high | site baseUrl |
| DEFAULT_LOCALE  | `"en-us"` | high | site default locale |
| REGION  | `""` | low | use site default config template, config in template can be overwritten by high levle environment variable |


### REGION Environment variable

#### NONE: `''`

```
yarn build
```

Use configs in `'/config/default.js'`.

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
#### `"zh-cn"`

```
yarn cross-env REGION='zh-cn' docusaurus build
```

Use configs in `'/config/zh-cn.js'`.

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

## search

> our documentation site using Typesense DocSearch. for more details, please refer:[using-typesense-docsearch](https://docusaurus.io/docs/search#using-typesense-docsearch) 以及 [Search for Documentation Sites](https://typesense.org/docs/guide/docsearch.html#search-for-documentation-sites)

### how to enable search on local environment？

1. start typesense, it's an open-source instant-search engine, that supplies http api service to query items. we choose to Self-Host our own server with:

```
  yarn typesense
```

2. build and serve the documentation site:

```
  yarn build
  yarn serve
```

3. start [scraper](https://github.com/typesense/typesense-docsearch-scraper), which scrapes the site content and indexes the data in the Typesense server: 

```
  yarn scraper
```
when scraper finished，you can do search in the html.