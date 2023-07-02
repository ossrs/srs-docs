# SRS-DOCS

The documents for [ossrs.net](https://ossrs.net) or [ossrs.io](https://ossrs.io).

## Usage

Please install node, npm and yarn:

```bash
brew install node
npm install -g --force npm yarn
```

Install dependencies:

```bash
yarn install
```

Start local development server:

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without 
having to restart the server.

## Language

Build English and Chinese versions:

```bash
yarn build
yarn serve
```

> Note: Please see `package.json` for detail command.

## Change baseUrl

```
$ yarn cross-env BASE_URL='/custom-base-url/' docusaurus build
```

This command uses `'/custom-base-url/'` instead of the default baseUrl(`'/lts/'`) to generate static content.

## Dockers

* Docker hub: [ossrs/docs](https://hub.docker.com/r/ossrs/docs)
* Aliyun ACR: [registry.cn-hangzhou.aliyuncs.com/ossrs/docs](https://cr.console.aliyun.com/repository/cn-hangzhou/ossrs/docs/images)

## Links

The links in docs, relative link, for example:

```markdown
[wiki](./http-api.md)
[wiki](./http-api.md#kickoff-client)
```

The links in blog or pages, absolute url link, for example:

```markdown
[Wiki: Getting Started](/docs/v4/doc/getting-started)
[Developer Documentation](/docs/v4/doc/getting-started)
```

> Note: Please follow this rule, otherwise, the link from searching will fail.

---
## Translate

## Start en-us site

Start your localized site in dev mode, using the locale of your choice:

```
$ yarn run start -- --locale en-us
```

Your site is accessible at `http://localhost:3000/en-us/`.


## Translate site content

### Step 1: Translate JSON files

Run the write-translations command:

    $ yarn docusaurus write-translations -- --locale en-us

It will extract and initialize the JSON translation files that you need to translate.

The JSON files will be in generated in `/i18n/en-us/` path.


### Step2: Translation Markdown files

First, you should copy markdown files in "/docs" and "/blog" folder to "/i18n/en/docusaurus-plugin-content-docs/current" and "/i18n/en/docusaurus-plugin-content-blog/current", then translation markdown files.

---
## Environment variable

|  Name   | Default value  | Level  | Effect |
|  ----  | ----  | ----  | ----  |
| URL  | `"https://ossrs.io"` | high | site url |
| BASE_URL  | `"/"` | high | site baseUrl |
| DEFAULT_LOCALE  | `"en-us"` | high | site default locale |
| REGION  | `""` | low | use site default config template, config in template can be overwritten by high levle environment variable |


## REGION Environment variable

### NONE: `''`

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
### `"zh-cn"`

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

> our documentation site using Typesense DocSearch. for more details, please refer:[using-typesense-docsearch](https://docusaurus.io/docs/search#using-typesense-docsearch) and [Search for Documentation Sites](https://typesense.org/docs/guide/docsearch.html#search-for-documentation-sites)

## how to enable search on local environment？

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

## how to add a new document

## add a new document to an existing directory

> for example, add a new document (example.md) in <strong>tutorial</strong> 

1. add document in i18n/en-us/
  
```
cd i18n/en-us/docusaurus-plugin-content-docs/current/tutorial/ && touch example.md
```

2. add document in i18n/zh-cn/

```
cd i18n/zh-cn/docusaurus-plugin-content-docs/current/tutorial/ && touch example.md
```

3. sidebar config, please refer：https://docusaurus.io/zh-CN/docs/next/sidebar/items

```
  Add ['tutorial/example'] to the tutorialSidebar configuration item in sidebar.json, please note that not with the .md suffix
```
  
  Once the configuration is complete, you can see the new documentation in the tutorial directory
   

## add a new directory and documentation

> for example, add a new document (mydir/new-example.md) in <strong>tutorial</strong>

1. add document in i18n/en-us/
  
```
cd i18n/en-us/docusaurus-plugin-content-docs/current/tutorial/ && mkdir -p mydir && touch new-example.md
```

1. add document in i18n/zh-cn/

```
cd i18n/zh-cn/docusaurus-plugin-content-docs/current/tutorial/ && mkdir -p mydir && touch new-example.md
```

3. sidebar config, please refer：https://docusaurus.io/zh-CN/docs/next/sidebar/items

  add a category sidebar config in tutorialSidebar of sidebar.json, and config items of the subfile
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

  Once the configuration is complete, you can see the new documentation in the tutorial directory

4. modify the chinese name of new category

  ```
  run: yarn docusaurus write-translations -- --locale zh-cn
  when finish, modify the i18n/zh-cn/docusaurus-plugin-content-docs/current.json file's 'NewDir' to your expected chinese name.
  ```

## Versioning

See [versioning guide here](https://docusaurus.io/docs/versioning).

1. First, make sure the current docs version (the ./i18n/en-us/docusaurus-plugin-content-docs/current directory) is ready to be frozen.
2. Enter a new version number.

```
yarn run docusaurus docs:version 4.2.0
```

3. change the current version label in `docusaurus.config.js` file
```diff
        docs: {
          path: 'i18n/en-us/docusaurus-plugin-content-docs/current',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: ({ versionDocsDirPath, docPath, locale, version }) => {
            return 'en-us' == locale
              ? `https://github.com/ossrs/srs-docs/edit/main/${versionDocsDirPath}/${docPath}`
              : `https://github.com/ossrs/srs-docs/edit/main/i18n/${locale}/docusaurus-plugin-content-docs/${version}/${docPath}`;
          },
          // lastVersion: 'current',
          lastVersion: versions[0],
          versions: {
            current: {
+              label: `4.3.0 🚧`,
-              label: `4.2.0 🚧`,
            },
          },
          remarkPlugins: [require('mdx-mermaid')],
        },
```

4. how to upgrade version
  > forzen current version to 5.0, set current version ref to 6.0, do the following steps:

  * run the cmd `yarn docusaurus docs:version 5.0`
    * it will auto modify ./versions.json to add 5.0:
      ```
      [
        "5.0",
        "4.0"
      ]
      ```
    * auto generate en-us version-5.0 dir, and version-5.0-sidebars.json
  * prepare zh-cn 5.0
    * `cd i18n/zh-cn && cp -af current version-5.0`
    * `cd i18n/zh-cn && cp current.json version-5.0.json`
  * update docusaurus.config.js
  * after upgrade, the dir displayed like:

    ```diff
    +├── docusaurus.config.js
    ├── i18n
    │   ├── en-us
    │   │   ├── code.json
    │   │   ├── docusaurus-plugin-content-docs
    │   │   │   ├── current
    │   │   │   └── current.json
    │   └── zh-cn
    │       ├── code.json
    │       ├── docusaurus-plugin-content-docs
    │       │   ├── current
    │       │   ├── current.json
    │       │   ├── version-4.0
    │       │   ├── version-4.0.json
    +│       │   ├── version-5.0
    +│       │   └── version-5.0.json
    ├── sidebars.json
    ├── versioned_docs
    │   ├── version-4.0
    │   │   ├── doc
    │   │   ├── tools
    │   │   └── tutorial
    +│   └── version-5.0
    │       ├── doc
    │       ├── tools
    │       └── tutorial
    ├── versioned_sidebars
    │   ├── version-4.0-sidebars.json
    +│   └── version-5.0-sidebars.json
    +├── versions.json
    ├── versionsArchived.json
    ```  