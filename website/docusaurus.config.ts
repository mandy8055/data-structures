import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'data-structures',
  tagline:
    'Type-safe, zero-dependency data structures for TypeScript/JavaScript',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // TODO: Update with actual Vercel deployment URL after deployment
  url: 'https://data-structures-docs.vercel.app',
  baseUrl: '/',

  organizationName: 'mandy8055',
  projectName: 'data-structures',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      de: {
        label: 'Deutsch',
        direction: 'ltr',
        htmlLang: 'de-DE',
      },
      'zh-CN': {
        label: '简体中文',
        direction: 'ltr',
        htmlLang: 'zh-CN',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/mandy8055/data-structures/tree/main/website/',
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'data-structures',
      logo: {
        alt: 'data-structures Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/mandy8055/data-structures',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://jsr.io/@mskr/data-structures',
          label: 'JSR',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@msnkr/data-structures',
          label: 'npm',
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
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/mandy8055/data-structures/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/mandy8055/data-structures/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/mandy8055/data-structures',
            },
            {
              label: 'Changelog',
              href: 'https://github.com/mandy8055/data-structures/blob/main/CHANGELOG.md',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: 'JSR',
              href: 'https://jsr.io/@mskr/data-structures',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@msnkr/data-structures',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} data-structures. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
