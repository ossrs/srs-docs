module.exports = function (context, options) {
  if ('function' === typeof options.rewriteSiteConfig) {
    options.rewriteSiteConfig(context);
  }
  return {
    name: 'docusaurus-rewrite-siteconfig-plugin',
  };
};
