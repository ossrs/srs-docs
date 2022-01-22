// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const typesenseApiKey = process.env.APIKEY || 'test';
const regionConfig = process.env.REGION === 'zh-cn' ? require('./config/zh-cn') : require('./config/default');
const url = process.env.URL || regionConfig.url;
const baseUrl = process.env.BASE_URL || regionConfig.baseUrl;
const defaultLocale = process.env.DEFAULT_LOCALE || regionConfig.defaultLocale;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SRS',
  tagline: 'Simple Realtime Server',
  url: url,
  baseUrl: baseUrl,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ossrs', // Usually your GitHub org/user name.
  projectName: 'srs-docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          versions: {
            current: { label: '5.0.0.alpha.1' },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: ['docusaurus-theme-search-typesense'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'SRS',
        logo: {
          alt: 'SRS(Simple Realtime Server)',
          src: 'img/srs-200x200.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'tutorial/getting-started',
            position: 'left',
            label: '教程',
          },
          {
            type: 'doc',
            docId: 'doc/git',
            position: 'left',
            label: '文档',
          },
          {
            type: 'doc',
            docId: 'samples/sample-RTMP',
            label: '使用案例',
            position: 'left',
          },
          // {
          //   type: "doc",
          //   docId: "doc/sample-RTMP",
          //   label: "Solution",
          //   position: "left",
          // },
          { to: '/blog', label: '博客', position: 'left' },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              {
                href: 'https://github.com/ossrs/srs/wiki/v4_EN_Home',
                label: '4.x.x',
              },
              {
                href: 'https://github.com/ossrs/srs/wiki/v3_EN_Home',
                label: '3.x.x',
              },
              {
                href: 'https://github.com/ossrs/srs/wiki/v2_EN_Home',
                label: '2.x.x',
              },
              {
                href: 'https://github.com/ossrs/srs/wiki/v1_EN_Home',
                label: '1.x.x',
              },
              // {
              //   to: "/versions",
              //   label: "All versions",
              // },
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/ossrs/srs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      typesense: {
        typesenseCollectionName: 'srs-docs', // Replace with your own doc site's name. Should match the collection name in the scraper settings.
        typesenseServerConfig: {
          nodes: [
            {
              host: 'localhost', // when in prod env, change it to your public domain
              port: 8108,
              protocol: 'http',
            },
          ],
          apiKey: typesenseApiKey,
        },
        // Optional
        contextualSearch: true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '学习',
            items: [
              {
                label: '教程',
                to: '/docs/tutorial/getting-started',
              },
              {
                label: '文档',
                to: '/docs/doc/git',
              },
              {
                label: '使用案例',
                to: '/docs/samples/sample-RTMP',
              },
            ],
          },
          {
            title: '社群',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/simple-realtime-server',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/yZ4BnPmHAd',
              },
              {
                label: 'Bilibili',
                href: 'https://space.bilibili.com/430256302?spm_id_from=333.788.b_765f7570696e666f.2',
              },
              {
                label: '直播答疑',
                href: 'https://mp.weixin.qq.com/s/dC5-iQC6x3hDIfVNxJHilw',
              },
            ],
          },
          {
            title: '微信公众号',
            items: [
              {
                html: `<img src="${baseUrl}img/srs-server-no-border.png" alt="微信搜索 “SRS开源服务器” 关注我们" width="120">`,
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '博客',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ossrs/srs',
              },
            ],
          },
        ],
        copyright: `<p></p>`,
        // copyright: `<p>©2013~${new Date().getFullYear()} SRS <a href="https://beian.miit.gov.cn">京ICP备19056366号-1</a></p>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  i18n: {
    defaultLocale: defaultLocale,
    locales: ['zh-cn', 'en-us'],
  },
  plugins: [...regionConfig.plugins],
};

module.exports = config;
