// @ts-check

const fs = require("node:fs");
const path = require("node:path");

const storybookUrl = process.env.STORYBOOK_BASE_URL || "/storybook/";
const dsVersion = require("../../packages/react/package.json").version;

// docs/components/*.{md,mdx} 에 실제로 존재하는 컴포넌트 문서 slug 목록.
// ComponentGallery 가 inventory 의 모든 엔트리에 무조건 링크를 걸면, docsPath 는
// 있는데 문서 파일이 없는 컴포넌트에서 broken-link 가 나 빌드(onBrokenLinks: throw)가
// 깨진다. 이 목록을 customFields 로 넘겨, gallery 가 문서가 있을 때만 docs 로 링크하고
// 없으면 Storybook 으로 폴백하게 한다. (sidebars.js 의 docExists 와 같은 의도.)
const componentDocsDir = path.join(__dirname, "../../docs/components");
const componentDocSlugs = fs.existsSync(componentDocsDir)
  ? fs
      .readdirSync(componentDocsDir)
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => f.replace(/\.mdx?$/, ""))
  : [];

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
    componentDocSlugs,
    // "다른 도구로 열기" 의 "GitHub 에서 읽기" 항목용 (개발자가 로그인된 상태에서만 의미 있음).
    // 마크다운 복사·열기·ChatGPT·Claude 는 같은-오리진 /raw/docs/... 경로를 쓰므로
    // 프라이빗 레포여도 동작. (apps/docs/scripts/copy-raw-docs.mjs 가 build/dev 직전에 복사)
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

  themes: [
    "@docusaurus/theme-live-codeblock",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "ko"],
        indexDocs: true,
        indexBlog: false,
        docsDir: "../../docs",
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: "right",
      },
    ],
  ],

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
