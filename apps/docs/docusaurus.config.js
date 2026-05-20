// @ts-check

const storybookUrl = process.env.STORYBOOK_BASE_URL || "http://localhost:6006";

const config = {
  title: "NUDGE Design",
  tagline: "기획, 디자인, 개발이 같은 언어로 소통하는 디자인 시스템",
  favicon: "img/favicon.svg",

  url: process.env.SITE_URL || "http://localhost",
  baseUrl: "/docs/",

  organizationName: "nudge-eap",
  projectName: "design-system",
  customFields: {
    storybookUrl,
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
        { to: "/getting-started", label: "시작하기", position: "left" },
        { to: "/components/overview", label: "컴포넌트", position: "left" },
        { to: "/tokens/colors", label: "토큰", position: "left" },
        { to: "/guide/design-principles", label: "가이드", position: "left" },
        { href: storybookUrl, label: "스토리북", position: "right" },
        {
          href: "https://github.com/cashwalk/NudgeEAPDesignSystem",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "시작하기",
          items: [
            { label: "소개", to: "/intro" },
            { label: "설치 및 설정", to: "/getting-started" },
            { label: "디자인 원칙", to: "/guide/design-principles" },
          ],
        },
        {
          title: "컴포넌트",
          items: [
            { label: "한눈에 보기", to: "/components/overview" },
            { label: "Button", to: "/components/button" },
            { label: "Modal", to: "/components/modal" },
            { label: "Input", to: "/components/input" },
          ],
        },
        {
          title: "토큰",
          items: [
            { label: "색상", to: "/tokens/colors" },
            { label: "타이포그래피", to: "/tokens/typography" },
            { label: "간격 및 사이징", to: "/tokens/spacing" },
          ],
        },
        {
          title: "탐색",
          items: [
            { label: "스토리북", href: storybookUrl },
            { label: "스타일링 가이드", to: "/guide/styling" },
          ],
        },
      ],
      copyright: `${new Date().getFullYear()} NUDGE Design`,
    },
  },
};

module.exports = config;
