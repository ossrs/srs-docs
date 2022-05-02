/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: ['tutorial/learning-path', 'tutorial/getting-started'],
  docsSidebar: [
    'doc/introduction',
    {
      type: 'category',
      label: 'Build',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: ['doc/build/install', 'doc/build/service', 'doc/build/arm'],
    },
    'doc/git',
  ],
  sampleSidebar: [
    'samples/sample',
    {
      type: 'category',
      label: 'RTMP',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: ['samples/rtmp/sample-rtmp', 'samples/rtmp/delivery-rtmp'],
    },
    {
      type: 'category',
      label: 'HLS',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: ['samples/hls/sample-hls', 'samples/hls/delivery-hls'],
    },
  ],
  communitySidebar: ['community/Support', 'community/Contributing'],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};

module.exports = sidebars;
