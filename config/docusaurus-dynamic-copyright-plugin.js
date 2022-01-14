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
              ${options.copyright}
            </div>
          </div>`,
        ],
      };
    },
  };
};
