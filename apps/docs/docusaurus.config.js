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

  plugins: [
    // /storybook/ 는 같은 도메인의 정적 폴더(apps/docs/static/storybook/) 로 서빙되며
    // Docusaurus 라우트가 아니다. inventory.md 등에서 [열기](/storybook/?path=…) 로
    // 링크하면 broken-link checker 가 매번 throw 하므로, 빈 stub 라우트만 하나 등록해
    // pathname '/storybook/' 만 통과시킨다. 실제 콘텐츠는 정적 파일이 그대로 서빙됨.
    function storybookRouteStubPlugin() {
      return {
        name: "storybook-route-stub",
        async contentLoaded({ actions }) {
          actions.addRoute({
            path: "/storybook/",
            component: require.resolve("./src/components/StorybookStub.js"),
            exact: true,
          });
        },
      };
    },
  ],

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
        // 스토리북은 같은 도메인의 정적 폴더(/storybook/)로 배포되므로 Docusaurus 라우트가 아니다.
        // Link 컴포넌트로 두면 onBrokenLinks 가 모든 페이지에서 broken 으로 잡으므로,
        // 라우트 등록 없이도 안전한 raw <a> (html 타입) 로 노출한다.
        {
          type: "html",
          position: "right",
          value: `<a class="navbar__item navbar__link" href="${storybookUrl}" target="_self" rel="noopener">스토리북</a>`,
        },
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
