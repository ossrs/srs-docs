const config = {
  url: 'https://ossrs.io',
  baseUrl: '/lts/',
  defaultLocale: 'en-us',
  plugins: [
    [
      './config/docusaurus-dynamic-copyright-plugin',
      {
        copyright: `<p>©2013~${new Date().getFullYear()} OSSRS Community</p>`,
        copyright2: `<p>©2013~${new Date().getFullYear()} OSSRS <a href="https://beian.miit.gov.cn">京ICP备19056366号-1</a></p>`,
        footerStyle: 'dark',
      },
    ],
  ],
};

module.exports = config;
