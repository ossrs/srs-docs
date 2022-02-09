module.exports = function ({ i18n, siteConfig }, options) {
    if (options.object === 'footer' && 'zh-cn' === i18n.currentLocale) {
      siteConfig.themeConfig.footer.links.forEach(function ({ items }) {
        items.forEach(function (item) {
          if (item.label === options.label) {
            delete item.label;
            delete item.href;
            item.html = options.html;
          }
        });
      });
    }
    return {
      name: 'docusaurus-rewrite-siteconfig-plugin'
    };
  };
  