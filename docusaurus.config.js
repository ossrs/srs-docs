// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const versions = require('./versions.json');
const versionsArchived = require('./versionsArchived.json');

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
              label: `5.0 🚧`,
              path: 'v5',
            },
            '4.0': {
              label: '4.0',
              path: 'v4',
            },
          },
          remarkPlugins: [require('mdx-mermaid')],
        },
        blog: {
          path: 'i18n/en-us/docusaurus-plugin-content-blog',
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: ({ locale, blogDirPath, blogPath, permalink }) => {
            return 'en-us' === locale
              ? `https://github.com/ossrs/srs-docs/edit/main/${blogDirPath}/${blogPath}`
              : `https://github.com/ossrs/srs-docs/edit/main/i18n/${locale}/docusaurus-plugin-content-blog/${blogPath}`;
          },
          remarkPlugins: [require('mdx-mermaid')],
          blogSidebarCount: 'ALL',
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
            docId: 'tutorial/srs-open-source',
            position: 'left',
            label: 'Tutorial',
          },
          {
            to: '/faq',
            label: 'FAQ',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'doc/introduction',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'community/Support',
            label: 'Community',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'tools/demo',
            label: 'Tools',
            position: 'left',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              // {
              //   type: 'html',
              //   value: '<hr class="dropdown-separator">',
              // },
              // {
              //   type: 'html',
              //   className: 'dropdown-archived-versions',
              //   value: '<b>Archived versions</b>',
              // },
              // ...versionsArchived.map(({ label, href }) => ({ label: label, href: href })),
              ...versionsArchived.wiki,
              // {
              //   type: 'html',
              //   value: '<hr class="dropdown-separator">',
              // },
              // {
              //   to: '/versions',
              //   label: 'All versions',
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
            },
          ].filter((e) => e),
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
                to: '/docs/v4/tutorial/srs-open-source',
              },
              {
                label: 'Docs',
                to: '/docs/v4/doc/git',
              },
              {
                label: 'Samples',
                to: '/docs/v4/samples/sample',
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
                label: 'Twitter',
                href: 'https://twitter.com/srs_server',
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
    localeConfigs: {
      'en-us': {
        label: 'English',
      },
    },
  },
  plugins: [
    ...regionConfig.plugins,
    [
      './config/docusaurus-rewrite-siteconfig-plugin',
      {
        rewriteSiteConfig: (context) => {
          if ('zh-cn' === context.i18n.currentLocale) {
            context.siteConfig.themeConfig.footer.links.forEach(function ({ items }) {
              items.forEach(function (item) {
                if (item.label === 'Discord') {
                  delete item.label;
                  delete item.href;
                  item.html = `<img src="${baseUrl}img/srs-server-no-border.png" alt="微信搜索 “SRS开源服务器” 关注我们" width="120" />`;
                }
              });
            });
          }
        },
      },
    ],
  ],
};

module.exports = config;
