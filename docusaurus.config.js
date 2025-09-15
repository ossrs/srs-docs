// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';
const versions = require('./versions.json');
const versionsArchived = require('./versionsArchived.json');

const regionConfig = process.env.REGION === 'zh-cn' ? require('./config/zh-cn') : require('./config/default');
const url = process.env.URL || regionConfig.url;
const baseUrl = process.env.BASE_URL || regionConfig.baseUrl;
const defaultLocale = process.env.DEFAULT_LOCALE || regionConfig.defaultLocale;
const sitePrefix = process.env.SRS_OS_LOCALE === 'zh-cn' ? 'https://ossrs.net' : 'https://ossrs.io';

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
            if ('en-us' === locale) {
              return `https://github.com/ossrs/srs-docs/edit/main/${versionDocsDirPath}/${docPath}`;
            } else {
              return 'current' === version
                ? `https://github.com/ossrs/srs-docs/edit/main/i18n/${locale}/docusaurus-plugin-content-docs/${version}/${docPath}`
                : `https://github.com/ossrs/srs-docs/edit/main/i18n/${locale}/docusaurus-plugin-content-docs/version-${version}/${docPath}`;
            }
          },
          lastVersion: versions[0],
          //lastVersion: versions[0],
          versions: {
            current: {
              label: `7.0 (Unstable) 🚧🚀`,
              path: 'v7',
            },
            '6.0': {
              label: '6.0 (Stable) ✅',
              path: 'v6',
            },
            '5.0': {
              label: '5.0 (Archived) 📦',
              path: 'v5',
            },
            '4.0': {
              label: '4.0 (Archived) 📦',
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
          //////////////////////////////////////////////////////
          {
            type: 'doc',
            docId: 'doc/getting-started',
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
            docId: 'tutorial/srs-server',
            position: 'left',
            label: 'Tutorial',
          },
          {
            type: 'dropdown',
            label: 'FAQ',
            position: 'left',
            items: [
              {
                to: '/faq',
                label: 'SRS',
              },
              {
                to: '/faq-oryx',
                label: 'Oryx',
              }
            ]
          },
          {
            to: '/security-advisories',
            label: 'Security',
            position: 'left',
          },
          {
            // See https://docusaurus.io/docs/api/themes/configuration#navbar-dropdown
            type: 'dropdown',
            label: 'Community',
            position: 'left',
            items: [
              {
                to: '/about',
                label: 'About',
              },
              {
                to: '/faq',
                label: 'FAQ: SRS',
              },
              {
                to: '/faq-oryx',
                label: 'FAQ: Oryx',
              },
              {
                to: '/contact',
                label: 'Contact',
              },
              {
                to: '/how-to-file-pr',
                label: 'Contributing',
              },
              {
                type: 'doc',
                docId: 'tools/utility',
                label: 'Tools',
              },
              {
                to: '/product',
                label: 'Milestones',
              },
              {
                to: '/license',
                label: 'LICENSE',
              },
            ],
          },
          {
            href: 'https://github.com/ossrs/srs',
            label: 'GitHub',
            position: 'left',
          },
          //////////////////////////////////////////////////////
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropdownItemsAfter: [
              ...versionsArchived.wiki,
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          //{
          //  href: `${sitePrefix}/gpt/g/g-FxEZ7G0XX-srs`,
          //  label: 'AI Assistant',
          //  position: 'right',
          //},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/v6/tutorial/srs-server',
              },
              {
                label: 'Docs',
                to: '/docs/v6/doc/getting-started',
              },
              {
                to: '/blog',
                label: 'Blog',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                to: '/contact',
                label: 'Contact',
              },
              {
                to: '/how-to-file-pr',
                label: 'Community',
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
            ],
          },
        ],
        copyright: `<p></p>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      defaultVersion: '5.0'
    }),
  i18n: {
    defaultLocale: defaultLocale,
    locales: ['en-us', 'zh-cn'],
    localeConfigs: {
      'en-us': {
        label: 'English'
      },
      'zh-cn': {
        label: '简体中文'
      }
    },
  },
  plugins: [
    ...regionConfig.plugins,
    [
      './config/docusaurus-rewrite-siteconfig-plugin',
      {
        rewriteSiteConfig: (context) => {
          const enLanguage = context.i18n.currentLocale === 'en-us';

          // For zh-cn, replace the Discord with Wechat.
          if (!enLanguage) {
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
