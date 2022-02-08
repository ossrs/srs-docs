// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const typesenseHttpsHost = process.env.SEARCH_HTTPS_HOST;
const typesenseHttpsPort = process.env.SEARCH_HTTPS_PORT;
const typesenseHttpHost = process.env.SEARCH_HTTP_HOST || 'localhost';
const typesenseHttpPort = process.env.SEARCH_HTTP_PORT || 8108;
const typesenseApiKey = process.env.SEARCH_APIKEY || 'test';
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
            label: 'Tutorial',
          },
          {
            type: 'doc',
            docId: 'doc/git',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'doc',
            docId: 'samples/sample-RTMP',
            label: 'Samples',
            position: 'left',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
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
        // See https://typesense.org/docs/guide/docsearch.html#step-2-add-a-search-bar-to-your-documentation-site
        typesenseCollectionName: 'srs-docs',
        typesenseServerConfig: {
          nodes: [
            typesenseHttpsHost && {
              host: typesenseHttpsHost,
              port: typesenseHttpsPort,
              protocol: 'https',
            },
            typesenseHttpHost && {
              host: typesenseHttpHost,
              port: typesenseHttpPort,
              protocol: 'http',
            }
          ].filter(e => e),
          apiKey: typesenseApiKey,
        },
        // Optional
        contextualSearch: true,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/tutorial/getting-started',
              },
              {
                label: 'Docs',
                to: '/docs/doc/git',
              },
              {
                label: 'Samples',
                to: '/docs/samples/sample-RTMP',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/simple-realtime-server',
              },
              {
                label: 'Bilibili',
                href: 'https://space.bilibili.com/430256302?spm_id_from=333.788.b_765f7570696e666f.2',
              },
              {
                label: 'Live',
                href: 'https://mp.weixin.qq.com/s/dC5-iQC6x3hDIfVNxJHilw',
              },
            ],
          },
          {
            title: 'Discussion',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/yZ4BnPmHAd',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
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
    locales: ['en-us', 'zh-cn'],
  },
  plugins: [...regionConfig.plugins],
};

module.exports = config;
