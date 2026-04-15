// @ts-check

const storybookUrl = process.env.STORYBOOK_BASE_URL || "http://localhost:6006";

const config = {
  title: "NudgeEAP Design System",
  tagline: "토큰, 컴포넌트, 워크플로우, 문서를 한곳에서 관리합니다",
  favicon: "img/favicon.svg",

  url: "http://localhost",
  baseUrl: "/",

  organizationName: "nudge-eap",
  projectName: "design-system",
  customFields: {
    storybookUrl,
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
          routeBasePath: "docs",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("../../packages/react/dist/styles.css"),
          ],
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "NudgeEAP DS",
      logo: {
        alt: "NudgeEAP Design System",
        src: "img/logo.svg",
        href: "/",
      },
      items: [
        { to: "/docs/getting-started", label: "시작하기", position: "left" },
        { to: "/docs/components/overview", label: "컴포넌트", position: "left" },
        { to: "/docs/tokens/colors", label: "토큰", position: "left" },
        { to: "/docs/guide/design-principles", label: "가이드", position: "left" },
        { href: storybookUrl, label: "스토리북", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "시작하기",
          items: [
            { label: "소개", to: "/docs/intro" },
            { label: "설치 및 설정", to: "/docs/getting-started" },
            { label: "디자인 원칙", to: "/docs/guide/design-principles" },
          ],
        },
        {
          title: "컴포넌트",
          items: [
            { label: "한눈에 보기", to: "/docs/components/overview" },
            { label: "Button", to: "/docs/components/button" },
            { label: "Modal", to: "/docs/components/modal" },
            { label: "Input", to: "/docs/components/input" },
          ],
        },
        {
          title: "토큰",
          items: [
            { label: "색상", to: "/docs/tokens/colors" },
            { label: "타이포그래피", to: "/docs/tokens/typography" },
            { label: "간격 및 사이징", to: "/docs/tokens/spacing" },
          ],
        },
        {
          title: "탐색",
          items: [
            { label: "스토리북", href: storybookUrl },
            { label: "스타일링 가이드", to: "/docs/guide/styling" },
          ],
        },
      ],
      copyright: `${new Date().getFullYear()} NudgeEAP Design System`,
    },
  },
};

module.exports = config;
