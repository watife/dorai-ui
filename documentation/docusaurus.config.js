/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dorai UI',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'watife', // Usually your GitHub org/user name.
  projectName: 'Dorai UI', // Usually your repo name.

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;400;500&family=Roboto:wght@300;400;500&display=swap'
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/watife/dorai-ui/documentation'
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Dorai UI logo',
          src: 'img/logo-light.svg'
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started/introduction',
            position: 'right',
            label: 'Docs'
          },
          {
            href: 'https://github.com/watife/dorai-ui',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        links: [
          {
            title: 'A project by Boluwatife Fakorede'
          }
        ]
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config
