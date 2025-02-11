module.exports = function (context, options) {
  return {
    name: 'docusaurus-dynamic-copyright-plugin',
    // async loadContent() {
    //   return 1 + Math.floor(Math.random() * 10);
    // },
    injectHtmlTags({ content }) {
      return {
        postBodyTags: [
          `<style>
            .docusaurus-dynamic-copyright {
              position: relative;
              top: calc(-1 * var(--ifm-footer-padding-vertical));
              padding-top: 0;
              padding-bottom: var(--ifm-footer-padding-vertical);
            }
          </style>
          <div class="footer footer--${options.footerStyle} docusaurus-dynamic-copyright">
            <div class="container text--center">
              ${context.i18n.currentLocale === 'en-us' ? options.copyright : options.copyright2}
              ${context.i18n.currentLocale === 'en-us' ? '<p>Official Address: 4711 Yonge St, North York, ON M2N 7E4, Canada</p>' : ''}
            </div>
          </div>`,
        ],
      };
    },
  };
};
