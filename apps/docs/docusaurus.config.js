// @ts-check

const storybookUrl = process.env.STORYBOOK_BASE_URL || "/storybook/";
const dsVersion = require("../../packages/react/package.json").version;

const config = {
  title: "NUDGE Design",
  tagline: "기획, 디자인, 개발이 같은 언어로 소통하는 디자인 시스템",
  favicon: "img/favicon.svg",

  url: process.env.SITE_URL || "http://localhost",
  baseUrl: "/",

  organizationName: "nudge-eap",
  projectName: "design-system",
  customFields: {
    storybookUrl,
    dsVersion,
    // "다른 도구로 열기" 드롭다운이 raw.githubusercontent.com / GitHub blob URL 을 만들 때 사용.
    // 레포가 비공개일 때 마크다운 복사·AI 링크는 fetch 가 401/404 로 실패할 수 있지만
    // (toast 안내), 공개 전환 시 코드 수정 없이 자동 작동.
    repo: {
      owner: "cashwalk",
      name: "NudgeEAPDesignSystem",
      branch: "main",
    },
  },

  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "ko",
    locales: ["ko"],
  },

  future: {
    faster: {
      rspackBundler: true,
    },
  },

  themes: ["@docusaurus/theme-live-codeblock"],

  presets: [
    [
      "classic",
      {
        docs: {
          path: "../../docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("../../packages/tokens/dist/tokens.css"),
            require.resolve("../../packages/react/dist/styles.css"),
          ],
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "NUDGE Design",
      logo: {
        alt: "NUDGE Design",
        src: "img/logo.svg",
        href: "/",
      },
      items: [
        { to: "/intro", label: "소개", position: "left" },
        { to: "/components/overview", label: "컴포넌트", position: "left" },
        { to: "/tokens/colors", label: "토큰", position: "left" },
        { to: "/guide/design-principles", label: "가이드", position: "left" },
        { href: storybookUrl, label: "스토리북", position: "right" },
        {
          href: "https://github.com/cashwalk/NudgeEAPDesignSystem",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    footer: {
      style: "dark",
      copyright: `${new Date().getFullYear()} NUDGE Design`,
    },
  },
};

module.exports = config;
