// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SRS',
  tagline: 'Simple Realtime Server',
  url: 'https://ossrs.net',
  baseUrl: process.env.BASE_URL || '/lts/',
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
            label: 'Sample',
            position: 'left',
          },
          // {
          //   type: "doc",
          //   docId: "doc/sample-RTMP",
          //   label: "Solution",
          //   position: "left",
          // },
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
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
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
                label: 'Sample',
                to: '/docs/samples/sample-RTMP',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
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
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn', 'en'],
  },
};

module.exports = config;
