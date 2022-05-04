const config = {
  url: 'https://ossrs.io',
  baseUrl: '/lts/',
  defaultLocale: 'en-us',
  plugins: [
    [
      './config/docusaurus-dynamic-copyright-plugin',
      {
        copyright: `<p>©2013~${new Date().getFullYear()} SRS</p>`,
        footerStyle: 'dark',
      },
    ],
  ],
};

module.exports = config;
