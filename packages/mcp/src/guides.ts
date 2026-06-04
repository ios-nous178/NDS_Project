import {
  CASHWALK_BIZ_ADMIN_SIDEBAR_HTML,
  CASHWALK_BIZ_ADMIN_SIDEBAR_REACT,
  CASHWALK_BIZ_ADMIN_SIDEBAR_ICON_IMPORTS,
} from "./guides/cashwalk-biz-sidebar-example.js";

/**
 * 컴포넌트별 사용 가이드 — d.ts 파싱만으로는 잡히지 않는
 * "이 컴포넌트를 어떻게 써야 하는가"의 큐레이션된 지식.
 *
 * 추가 기준:
 * - DS 매트릭스를 잘못 해석해 시각적 함정에 빠지는 경우(예: assistive solid)
 * - 슬롯/내부 padding 등 이미 적용된 스타일과 충돌 가능성
 * - 표준 variant에 없는 톤이 필요할 때 확장 슬롯 사용 패턴
 */

/* ──────────────────────────────────────────────────────────────────────
 * Intent 감지 / 분기
 *
 * 이 MCP는 본질적으로 "사용자 앱(@nudge-design/react)" 컴포넌트 라이브러리를
 * 노출하지만, 사용자가 어드민/CMS 화면을 만들 때는 antd를 써야 한다.
 *
 * ★ 예외 — 캐포비(cashwalk-biz): 이 브랜드는 DS 안에 자체 admin 디자인 시스템을 갖고 있다
 *   (admin layout 1920/sidebar 300, input admin radius4/h40, Modal admin desktop 480, checkbox admin).
 *   따라서 admin 발화라도 brand=cashwalk-biz 면 antd 가 아니라 DS(html 워크플로우 + cashwalk-biz
 *   cascade)로 만든다. resolveEffectiveIntent() 가 이 우회를 단일 지점에서 결정한다.
 *
 * 사용자의 자연어 요청에 다음 키워드가 보이면 admin-cms 의도로 간주:
 *   어드민 / 운영툴 / 관리자 / 관리자페이지 / CMS / 백오피스 / admin / cms / backoffice
 *   상담 관리(admin), 멤버십 관리(admin) 같이 운영자가 보는 화면
 *
 * 사용자 앱으로 간주하는 키워드:
 *   사용자 앱 / 모바일 앱 / 마이페이지 / 회원가입 / 상담 신청 / 챌린지 / 일기 / 콘텐츠 카드
 *   Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile 사용자 화면
 * ────────────────────────────────────────────────────────────────────── */

const ADMIN_KEYWORDS = [
  "어드민",
  "운영툴",
  "운영 툴",
  "관리자페이지",
  "관리자 페이지",
  "관리자툴",
  "관리자 툴",
  "백오피스",
  "백 오피스",
  "CMS",
  "cms",
  "Cms",
  "admin",
  "Admin",
  "ADMIN",
  "backoffice",
  "back-office",
  "정산 관리",
  "감사 로그",
];

/**
 * vanilla HTML / Web Component 워크플로우를 의미하는 키워드.
 * 사용자가 'HTML 로 작업', '바닐라', '<nds-button>', 'Web Component', 'react 없이' 등을
 * 언급하면 .tsx + Vite + React 워크플로우 대신 @nudge-design/html 셋업으로 분기시킨다.
 */
const HTML_KEYWORDS = [
  "vanilla html",
  "vanilla-html",
  "바닐라 html",
  "vanilla js",
  "vanilla-js",
  "vanilla javascript",
  "vanilla-javascript",
  "vanilla ts",
  "vanilla-ts",
  "vanilla typescript",
  "vanilla-typescript",
  "바닐라 js",
  "바닐라 자바스크립트",
  "바닐라 ts",
  "바닐라 타입스크립트",
  "plain html",
  "정적 html",
  "static html",
  "static site",
  "static-site",
  "web component",
  "web-component",
  "webcomponent",
  "custom element",
  "custom-element",
  "<nds-",
  "@nudge-design/html",
  "html-only",
  "html only",
  "no-react",
  "no react",
  "without react",
  "react 없이",
  "리액트 없이",
  "리액트 없",
];

/**
 * 발화 → 워크스페이스 intent 분류.
 *
 * 정책 변경 (2026-05-25): admin-cms 가 아니면 무조건 **html** 로 라우팅.
 * 더 이상 user-app(.tsx + React) 을 default 로 안내하지 않는다 — 신규 mockup
 * 워크스페이스는 모두 vanilla HTML (@nudge-design/html + Vite vanilla-ts) 로 셋업.
 * 기존 React mockup 워크스페이스는 detectWorkspaceIntent (build-html.ts) 가
 * package.json / src 구조로 회귀 없이 react 로 인식하므로 백워드 호환.
 *
 * 반환에 "user-app" 이 포함된 건 호출처가 분기를 유지하기 위한 백워드 호환 — 신규
 * 발화는 "user-app" 으로 떨어지지 않는다.
 */
export function detectIntentFromText(text?: string): "admin-cms" | "user-app" | "html" {
  if (!text) return "html";
  const normalized = text.toLowerCase();
  for (const k of ADMIN_KEYWORDS) {
    if (normalized.includes(k.toLowerCase())) return "admin-cms";
  }
  // HTML_KEYWORDS 매칭은 명시적 신호 — html 분기를 강하게 표현하기 위해 남겨두지만
  // 매칭 안 되는 발화도 default 가 html 이므로 결과는 동일하다.
  for (const k of HTML_KEYWORDS) {
    if (normalized.includes(k.toLowerCase())) return "html";
  }
  return "html";
}

/**
 * DS 안에 자체 admin 디자인 시스템을 갖춰, admin 발화라도 antd 가 아니라 DS 로 만드는 브랜드.
 * 지금은 캐포비(cashwalk-biz) 단독 — admin layout/input/Modal admin 토큰이 DS 에 정의돼 있다.
 */
export const DS_ADMIN_BRANDS = ["cashwalk-biz"] as const;

export function isDsAdminBrand(brand?: string | null): boolean {
  return !!brand && (DS_ADMIN_BRANDS as readonly string[]).includes(brand);
}

/**
 * intent + brand 를 합쳐 '실효 워크스페이스 intent' 를 결정하는 단일 지점.
 *   - admin 발화 + DS_ADMIN_BRANDS(캐포비) → "html"  (antd 우회, DS 로 제작)
 *   - admin 발화 + 그 외/무지정            → "admin-cms" (antd · NudgeEAPCMS 컨벤션)
 *   - 그 외                                 → "html"
 * 모든 라우팅 지점(setup / CLAUDE.md 생성)은 detectIntentFromText 대신 이 함수를 써야
 * brand 신호가 누락되지 않는다.
 */
export function resolveEffectiveIntent(
  intent?: string,
  brand?: string | null,
): "admin-cms" | "html" {
  const isAdmin = intent === "admin-cms" || detectIntentFromText(intent) === "admin-cms";
  if (isAdmin && !isDsAdminBrand(brand)) return "admin-cms";
  return "html";
}

export const SCOPE_ADVISORY = {
  scope: "사용자 앱 (Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile) 화면 전용",
  role: {
    purpose:
      "이 MCP의 역할은 '별도의 외부 목업 프로젝트(예: Vite + React)에서 DS를 소비해 목업을 만드는 것'이다. " +
      "DS 레포(NudgeEAPDesignSystem) 자체의 소스 코드를 수정하거나 GitHub에 푸시하는 것은 이 MCP의 역할이 아니다.",
    inScope: [
      "외부 목업 프로젝트에서 DS 컴포넌트/아이콘/토큰 조회",
      "외부 목업 프로젝트에 CLAUDE.md / 환경 셋업 생성",
      "사용자 앱 또는 어드민/CMS 목업 .tsx 작성·검증",
      "목업 dev 서버 실행 / preview 확인 / 종료",
    ],
    outOfScope: [
      "DS 레포의 컴포넌트/토큰/아이콘 소스 코드 수정",
      "DS 레포에 대한 git commit, git push, PR 생성, 브랜치 조작",
      "GitHub 레포지토리(이 DS 또는 다른 레포) 직접 변경",
      "DS 패키지 버전 bump, npm publish, 릴리즈 작업",
    ],
    ifAskedToModifyRepo:
      "사용자가 DS 레포 수정이나 GitHub 푸시를 요청하면, 이 MCP의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내할 것. " +
      "이 MCP는 외부 프로젝트에서 DS를 '소비'하는 쪽이며, DS 레포를 '생산'하는 쪽이 아니다.",
  },
  intentBranching: {
    "admin-cms": {
      keywords: ADMIN_KEYWORDS,
      action:
        "어드민/CMS/운영툴/백오피스 화면이라면 이 DS(@nudge-design/react)를 쓰지 말 것. " +
        "antd v5를 사용하고, 시각/구조 컨벤션은 get_guide({ topic: 'admin-cms' })를 호출해 확인할 것. " +
        "두 라이브러리를 한 화면에서 섞어쓰지 말 것. " +
        "★ 단, 캐포비(cashwalk-biz) 어드민은 예외 — antd 가 아니라 DS 로 만든다. brand='cashwalk-biz' 를 " +
        "넘기면 get_setup / CLAUDE.md 가 자동으로 DS(html) 워크플로우로 우회한다.",
      tools: [
        "get_guide({ topic: 'admin-cms' })",
        "get_setup({ step: 'full', intent: 'admin-cms' })",
      ],
    },
    "user-app": {
      action:
        "[deprecated] React/.tsx + @nudge-design/react 워크플로우. 신규 mockup 워크스페이스는 " +
        "'html' 분기로 진입하세요 (Vite vanilla-ts + @nudge-design/html). 기존 React mockup 을 " +
        "유지보수하는 경우에만 이 분기로 들어옵니다 — build-html / usage 도구가 " +
        "package.json 의 @nudge-design/react 또는 src/main.tsx 를 감지하면 자동으로 React 룰을 적용합니다.",
    },
    html: {
      keywords: HTML_KEYWORDS,
      action:
        "vanilla HTML / Web Component 워크플로우(react 없이 <nds-*> 직접 작성) 라면 " +
        "@nudge-design/html 패키지를 사용한다. .tsx 가 아니라 root index.html 을 직접 작성하고 " +
        "validate_html_mockup / analyze_html_mockup 으로 검증, " +
        "최종 산출물은 build_singlefile_html 로 dist/index.html (단일 파일) 만든다 — 디자이너/PM 에게 dnd 공유 가능. " +
        "get_setup({ step: 'full', intent: 'html' }) 로 Vite vanilla-ts 셋업, " +
        "get_guide({ topic: 'component:<Name>', target: 'html' }) 로 <nds-*> 예시를 가져와 작성.",
      tools: [
        "get_setup({ step: 'full', intent: 'html' })",
        "get_guide({ topic: 'component:<Name>', target: 'html' })",
        "validate_html_mockup({ filePath })",
        "analyze_html_mockup({ filePath })",
        "build_singlefile_html({ cwd })",
      ],
    },
  },
  hardRule: "두 디자인시스템을 한 화면에서 혼용 금지.",
};

/* ──────────────────────────────────────────────────────────────────────
 * Admin / CMS 컨벤션
 *
 * 출처: NudgeEAPCMS 코드베이스(Next.js + antd 5.5.1 + styled-components)
 *   /src/styled/reset.css           (폰트 스택, body bg)
 *   /src/app/(primary)/layout.tsx   (Shell + content padding + footer)
 *   /src/layout/ScreenLocalNavigationBar.tsx (라이트 사이더 + 6px 브랜드 액센트)
 *   /src/layout/component/SideMenu.tsx       (메뉴 선택 시 right 6px 액센트)
 *   /src/layout/component/SideUserInfo.tsx   (사이드 INFO 블록)
 *   /src/layout/component/SideSetting.tsx    (사이드 SETTING 블록 + 로그아웃/정보수정)
 *   /src/layout/component/TinyHeader.tsx     (10px 200 #adadad 라벨)
 *   /src/components/header/HeaderSubject.tsx (페이지 제목 + Breadcrumb)
 *   /src/feature/partner/screens/ScreenPartnerManagement.tsx (목록 화면 패턴)
 *   /src/feature/partner/components/PartnerSearchForm.tsx    (검색 폼 패턴)
 *   /src/feature/membership/components/SearchMembershipInput.tsx (Select+Input.Search+초기화)
 *   /src/feature/partner/constant/partnerListColumns.tsx     (테이블 컬럼 컨벤션)
 * ────────────────────────────────────────────────────────────────────── */

export interface AdminCmsGuide {
  scope: string;
  rationale: string;
  /** antd 가 아니라 DS 로 만드는 브랜드 예외 안내 (캐포비). */
  brandException?: string;
  techStack: {
    required: string[];
    forbidden: string[];
    optional: string[];
  };
  layout: {
    body: { background: string; fontFamily: string };
    sider: Record<string, string>;
    sideUserInfo: string;
    sideMenu: Record<string, string>;
    sideSetting: string;
    content: Record<string, string>;
    footer: Record<string, string>;
  };
  pageHeader: {
    component: string;
    structure: string;
    style: Record<string, string>;
  };
  searchForm: {
    pattern: string;
    leftRow: string[];
    rightRow: string[];
    countLine: string;
  };
  table: Record<string, string>;
  tag: Record<string, string>;
  modal: Record<string, string>;
  colors: Record<string, string>;
  forbidden: string[];
  selfCheck: string[];
  example: string;
}

export const ADMIN_CMS_GUIDE: AdminCmsGuide = {
  scope:
    "어드민/CMS/운영툴/백오피스 화면. 사용자 앱이 아닌 운영자가 보는 화면. " +
    "출처: NudgeEAPCMS (Next.js + antd 5.5.1 + styled-components) 실제 운영 코드.",
  rationale:
    "Nudge DS는 B2C 멘탈케어 앱 화면을 위한 컴포넌트 셋이다. 어드민은 정보 밀도 / 표 / 폼 / " +
    "필터 위주라 antd가 더 적합하고, 운영팀이 익숙한 시각 언어와도 일치한다.",
  brandException:
    "캐포비(cashwalk-biz) 어드민은 이 antd 컨벤션을 따르지 말 것 — 이 브랜드는 DS 안에 자체 admin " +
    "디자인 시스템(admin layout/input/Modal admin 토큰)을 갖추고 있어 DS(html 워크플로우)로 만든다. " +
    "brand='cashwalk-biz' 를 넘기면 get_setup / CLAUDE.md / get_guide 가 자동으로 DS 경로로 우회한다.",
  techStack: {
    required: [
      "react ^18",
      "antd ^5 (NudgeEAPCMS 기준 5.5.1)",
      "@ant-design/icons ^5",
      "dayjs (locale: ko)",
    ],
    forbidden: [
      "@nudge-design/react — 사용자 앱 DS, 어드민에서 절대 import 금지",
      "@nudge-design/tokens — 어드민에서는 antd 기본 토큰 사용",
      "큰 그라디언트, 마케팅 히어로, 장식 배경",
    ],
    optional: ["styled-components (CMS 본 레포 컨벤션)", "react-router-dom (Vite 단독일 때)"],
  },
  layout: {
    body: {
      background: "#f4f4f4",
      fontFamily:
        "Mulish, Gothic_A1, -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', sans-serif",
    },
    sider: {
      width: "240px (SIDEBAR_WIDTH 상수)",
      theme: 'antd Sider theme="light"',
      background: "#ffffff",
      position: "fixed (좌측 0, top 0, height 100vh)",
      borderRight: "1px solid #ececec",
      zIndex: "10",
      topAccent: "상단 6px 브랜드 컬러 라인 (border-top: 6px solid var(--color-main, #2B96ED))",
    },
    sideUserInfo:
      "Sider 상단 24px padding 영역에 [로고/h1] + TinyHeader('INFO') + 이메일(12px #333) + " +
      "antd Tag(이름, borderRadius 3) + '권한:' + TagAdminRole(60px width center).",
    sideMenu: {
      header: "TinyHeader('CMS MENU', padding '0 24px')",
      menu: '<Menu theme="light" mode="inline" inlineIndent={22} items={...} selectedKeys={[현재경로]} />',
      selectedItem: "border-right: 6px solid var(--color-main); color: #000;",
      submenuSelected: "color: #000; font-weight: 600;",
      itemColors: "기본 #383838 / hover #000 / disabled 회색 (실제 권한 매트릭스에 따라 필터링)",
    },
    sideSetting:
      "Sider 하단에 별도 section. TinyHeader('SETTING', padding '0') + " +
      "두 개의 antd Button (LogoutOutlined '로그아웃', UserOutlined '정보수정' disabled). " +
      "버튼 높이 35px, font-size 12px, 두 버튼 width 48.5%씩.",
    content: {
      marginLeft: "240px",
      padding: "40px 60px 200px",
      width: "100%",
      maxWidth: "고정 max-width 없음 — 전체 폭 사용",
    },
    footer: {
      placement: "content 아래 70px margin-top",
      text: "Copyright © Nudge EAP. All Rights Reserved.",
      style:
        "text-align center / padding 13px 0 / border-top 1px solid #ececec / color #b1b1b1 / font-weight 100 / font-size 12px / letter-spacing 0.2px",
    },
  },
  pageHeader: {
    component: "components/header/HeaderSubject (Breadcrumb + h1 + desc)",
    structure:
      '<HeaderSubject subject="고객사 관리" desc="..." navigationItems={[{title:"Partner"},{title:"Partner Management",href:"/partner/list"}]} />',
    style: {
      wrapper: "border-bottom: 1px solid #e4e4e4; padding: 0 0 25px; margin: 0 0 25px;",
      breadcrumb:
        '<Breadcrumb items={...} separator=">" />, font-size 11px, color #727272, link color #000',
      title:
        "h1: font-size 22px / weight 700 / color #383838 / margin-bottom 12px / text-transform capitalize",
      desc: "font-size 12px / color #6b6a6a / padding-left 3px / text-transform capitalize",
    },
  },
  searchForm: {
    pattern:
      "antd Form 안에 Select(검색 기준) + Input.Search(enterButton='검색') + Button(초기화). " +
      "필터(Segmented / Select 등)와 액션(생성/내보내기)은 우측 정렬. 그 아래 한 줄에 '검색된 개수: N'.",
    leftRow: [
      "<Form.Item name='searchBy'><Select style={{width:100}} options={[{value:'TITLE',label:'멤버십명'},{value:'ID',label:'멤버십 ID'}]} /></Form.Item>",
      "<Form.Item name='keyword'><Input.Search placeholder='검색어를 입력해주세요' enterButton='검색' onSearch={handleSearch} /></Form.Item>",
      "<Button htmlType='button' onClick={handleReset}>초기화</Button>",
    ],
    rightRow: [
      "추가 필터 (Segmented '전체/진행중/대기/종료 포함', 고객사 Select 등)",
      "주요 액션 버튼 (생성, CSV 내보내기 등)",
    ],
    countLine:
      "<div className='cms-search-form__count'>검색된 개수: {count}</div> — font-size 12, color #6b6a6a",
  },
  table: {
    base: '<Table size="middle" rowKey="id" />',
    pagination:
      'pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false, size: "default", total }}',
    columns:
      "거의 모든 컬럼에 align:'center'. 행 정보 가독성보다 컬럼 헤더와 셀 정렬을 일관되게 유지하는 게 우선.",
    clickableCell:
      "ID/이름/숫자 등 클릭 가능한 셀은 <Button type='link'>{value}</Button>으로 감싼다. 굵은 텍스트로 대체 X.",
    rowHeight: "size='middle' 기본 (~48px). 직접 px 지정 금지.",
    headerStyle:
      "antd 기본값 유지. headerBg #fafafa, headerColor #727272 정도까지만 ConfigProvider로 조정.",
  },
  tag: {
    statusTagWidth:
      "상태/권한 같은 enum Tag는 width: 60px; text-align: center; (TagAdminRole 컨벤션)",
    statusColors:
      "active=green, pending=gold, ended=default(grey), warning=orange, error=red. 운영자 권한별 색은 admin red / volcano / green / gold / lime / purple / cyan / blue.",
  },
  modal: {
    invocation: "Modal.useModal() 또는 <Modal open={...} />. centered + destroyOnClose 권장.",
    formLayout:
      'Form layout="vertical" 기본. 라벨 좌측 정렬이 필요하면 labelAlign="left" labelCol={{flex:"120px"}} colon={false}.',
    footer:
      "antd 기본 footer (확인/취소) 또는 우측 그룹 액션 정렬. 좌측엔 파괴 액션(종료처리, 삭제) 분리.",
  },
  colors: {
    "--color-main": "#2B96ED — 사이드바 톱 액센트 / 메뉴 선택 우측 보더 / 링크",
    text: "#383838 (제목) / #727272 (보조) / #aaa (subtle) / #b1b1b1 (footer)",
    border: "#ececec (light) / #e4e4e4 (HeaderSubject 하단)",
    bg: "#f4f4f4 (body) / #fafafa (hover/header) / #ffffff (sider, content surface)",
    note: "어드민에서는 NudgeEAP 토큰을 import하지 말 것. 위 색상을 인라인 또는 styled-components로 직접 지정.",
  },
  forbidden: [
    "@nudge-design/react / @nudge-design/tokens / @nudge-design/icons import (어드민 화면에서)",
    "큰 히어로 카드, 마케팅 톤, 그라디언트 배경",
    "antd Table 위에 별도 Card wrapper로 그림자+패딩 추가 (CMS는 본문에 직접 노출)",
    "Tabs를 페이지 단위로 남발 (CMS는 페이지 단위 Tabs 거의 사용 안 함)",
  ],
  selfCheck: [
    "antd에서 import 했는가 (직접 button/input/select 만들지 않았는가)",
    "@nudge-design/* 패키지를 어드민 화면에서 import 하지 않았는가",
    "사이드바에 라이트 240px + 6px 톱 액센트 + INFO + CMS MENU + SETTING 블록이 있는가",
    "본문 padding 40 60 200, body #f4f4f4, footer 'Copyright © Nudge EAP...' 있는가",
    "HeaderSubject(Breadcrumb separator='>', h1 22/700, desc 12)로 페이지 헤더를 구성했는가",
    "검색 폼이 [Select + Input.Search + 초기화] 패턴인가, 검색된 개수 N이 노출되는가",
    "Table 컬럼이 align:center 일관 + pagination position bottomCenter인가",
    "클릭 가능한 셀이 <Button type='link'>인가",
    "tsc --noEmit 통과하는가",
  ],
  example: `// pages/MembershipDetail.tsx (요약)
import { Layout, Menu, Breadcrumb, Tag, Table, Form, Select, Input, Button, Segmented } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

// AdminLayout = <Sider light 240px + 6px top + INFO + CMS MENU + SETTING>
//             + <Content padding="40 60 200">{children}</Content> + Footer

<AdminLayout>
  <HeaderSubject
    subject="멤버십 관리"
    desc="고객사 멤버십을 관리합니다."
    navigationItems={[{ title: "Membership" }, { title: "List", href: "/membership/list" }]}
  />
  <Form form={form} className="cms-search-form" initialValues={{ searchBy: "TITLE", keyword: "" }}>
    <Form.Item name="searchBy"><Select style={{ width: 100 }} options={...} /></Form.Item>
    <Form.Item name="keyword"><Input.Search enterButton="검색" onSearch={handleSearch} /></Form.Item>
    <Button onClick={handleReset}>초기화</Button>
  </Form>
  <div className="cms-search-form__count">검색된 개수: {count}</div>
  <Table
    size="middle"
    rowKey="id"
    columns={[
      { title: "ID", dataIndex: "id", align: "center", width: 100 },
      { title: "이름", dataIndex: "name", align: "center",
        render: (v, r) => <Button type="link">{v}</Button> },
      { title: "상태", dataIndex: "status", align: "center", width: 100,
        render: v => <Tag color={...} className="tag-fixed">{label}</Tag> },
    ]}
    dataSource={list}
    pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false }}
  />
</AdminLayout>`,
};

export interface ComponentGuide {
  name: string;
  summary: string;
  pitfalls: string[];
  recommended?: string[];
  usagePolicy?: {
    useFor?: string[];
    doNotUseFor?: string[];
    limits?: Record<string, string | number | boolean>;
    /** color 별 사용 정책 (Badge 등) */
    colorPolicy?: Record<string, string>;
    /** variant 별 사용 정책 (Badge / Tabs 등) */
    variantPolicy?: Record<string, string>;
    /** 추가 룰 한 줄 (Modal emphasisRule 등) */
    emphasisRule?: string;
  };
  examples?: {
    do: string;
    dont: string;
  };
  /**
   * vanilla HTML / Web Component(<nds-*>) 형태의 do/dont 예시.
   * `get_guide({ topic: 'component:<Name>', target: 'html' })` 호출 시
   * 라우터가 이 값을 `examples` 자리에 끼워 응답한다.
   *
   * 작성 규칙:
   * - 태그는 kebab-case `<nds-button>` 형태.
   * - attribute 도 kebab-case (`full-width`, `right-icon`).
   * - 이벤트는 attribute (`onclick="..."`) 가 아니라 `addEventListener("nds-...", ...)` 패턴으로 설명.
   * - JSON-encoded attribute 값 (예: `<nds-segmented options='[...]' />`) 은 적절한 따옴표 escape 로 표기.
   * - children 콜백/compound 패턴 등 React 전용 표현은 단순화하거나 `slot=` 으로 표현.
   */
  examplesHtml?: {
    do: string;
    dont: string;
  };
  /**
   * `target: 'html'` 호출 시 examplesHtml 가 비어 있는 react-only 컴포넌트임을 명시.
   * 값은 'no-html-equivalent' 만 허용 (현재 정의된 마커).
   * 라우터는 이 값이 있으면 `_htmlAdvisory` 한 줄을 응답에 첨부하고 react examples 를 그대로 노출.
   *
   * 브랜드 크롬(BrandX WebHeader / AppBar / Footer)에도 이 마커를 쓰되, 라우터의
   * `brandChromeHtmlRedirect(name)` 가 컴포넌트 이름으로 `<nds-brand-header>` / `<nds-brand-footer>`
   * 표지판 advisory 를 자동 생성한다 (막다른 길 안내가 아니라 brand wrapper 로 유도). 단, 본문
   * summary/recommended 에도 wrapper 한 줄을 같이 박아 조회 순서와 무관하게 노출되게 할 것
   * (BottomNav 가이드 패턴 — 회고: 진입점 하나만 보고 멈추는 실수 방지).
   */
  _htmlStatus?: "no-html-equivalent";
  /** color × variant 별 표시 톤 요약 */
  colorMatrix?: Record<string, string>;
  /** size 값 × 픽셀 스펙 (Figma 실측 기준) */
  sizeMatrix?: Record<string, string>;
  /** state(active/hover/disabled) 별 토큰/배경 매핑 */
  stateMatrix?: Record<string, string>;
  /** brand 별 sizeMatrix/stateMatrix 의 부분 override + 자유 dimensions 객체.
   *  service overlay 가 아니라 base 안의 brand-aware metadata (Figma 450:68 v2 결정).
   *
   *  brand 가 지정된 get_guide 호출 시 router 가 해당 brand 의 override 를 base 매트릭스에 deep merge 한다.
   *  dimensions 는 base 에 없는 spec 을 brand 별로 신설할 때 사용 (예: Modal Cashwalk-biz 의 admin desktop 변형 width/radius/padding/typography). */
  matrixOverrides?: Partial<
    Record<
      "trost" | "geniet" | "cashwalk-biz" | "nudge-eap",
      {
        sizeMatrix?: Partial<Record<string, string>>;
        stateMatrix?: Partial<Record<string, string>>;
        /** base 에 없는 spec 키. 키 이름은 자유 (width / radius / padding / typo* 등). 응답에 dimensions 그대로 노출. */
        dimensions?: Record<string, string>;
      }
    >
  >;
  /** brand 별 valid prop 값 — Pattern 'Brand-aware Base' (Figma 450:68 v2).
   *  예: BrandHeader.activeKey = { trost: ['home','counsel',...], geniet: ['home','community',...] }.
   *  brand 가 지정된 get_guide 호출 시 router 가 해당 brand 값만 응답에 fold. */
  validPropValues?: Partial<
    Record<"trost" | "geniet" | "cashwalk-biz" | "nudge-eap", Record<string, string[]>>
  >;
  /** brand 별 필요 파일 manifest — Pattern 'Brand-aware Base'.
   *  예: { trost: ['trost-logo.svg'], geniet: ['geniet-logo-pc.webp', ...] }. 호스트 앱이 public/ 에 배치해야 할 자산. */
  assetManifest?: Partial<Record<"trost" | "geniet" | "cashwalk-biz" | "nudge-eap", string[]>>;
  /** brand 별 강제 prop 값 — Pattern 'Brand-aware Base'.
   *  예: { footerTone: { trost: 'dark', '*': 'light' } } — 키 '*' 는 명시 안 된 brand 의 default. */
  forcedProps?: Record<
    string,
    Partial<Record<"trost" | "geniet" | "cashwalk-biz" | "nudge-eap" | "*", string>>
  >;
  /** 출처 Figma 노드 URL (Library 파일) */
  figmaNodeUrl?: string;
  /** 추가 레퍼런스 (스크린샷 URL · Figma/Zeplin 다중 노드 등). PatternGuide.references 와 동일 형태. */
  references?: Array<{
    label: string;
    /** Figma/Zeplin 또는 외부 URL. image 와 둘 중 하나는 있어야 의미가 있음. */
    url?: string;
    /** 패키지 내 상대경로 (`references/...`) — MCP server 가 절대경로로 풀어준다. */
    image?: string;
    caption?: string;
    brand?: "trost" | "geniet" | "cashwalk-biz" | "nudge-eap" | "runmile";
  }>;
  /** 접근성 가이드 (aria/대비/타겟 사이즈 등) */
  accessibility?: string[];
  interactivePattern?: string;
}

export const COMPONENT_GUIDES: Record<string, ComponentGuide> = {
  Button: {
    name: "Button",
    examplesHtml: {
      do: '<nds-button color="primary" variant="solid">상담 신청하기</nds-button>\n<nds-button color="primary" variant="outlined">검사 시작하기</nds-button>\n<nds-button color="assistive" variant="outlined">자세히 보기</nds-button>',
      dont: '<!-- raw <button> + className 흉내. nds-button 룰/토큰이 전혀 적용 안 됨 -->\n<button class="nds-button" onclick="handle()">상담 신청하기</button>\n<!-- assistive + solid 조합은 Figma 라이브러리에 없음 (disabled 와 톤이 겹침) -->\n<nds-button color="assistive" variant="solid">자세히 보기</nds-button>',
    },
    summary:
      "1차/2차 CTA. color × variant × size 매트릭스로 톤 결정 (Figma Library node 171:8385 기준).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8385",
    pitfalls: [
      "**HTML 한정** — `nds-button` 은 `leftIcon`/`rightIcon` slot **미구현** (nds-button.ts L20-21). `<nds-button><span slot='leftIcon'>...</span>텍스트</nds-button>` 패턴 금지 (slot 은 무시되고 span 이 children 으로 흘러 들어감). 아이콘이 필요하면 children 안에 SVG 와 텍스트를 직접 나열: `<nds-button><svg>...</svg>텍스트</nds-button>`. JS 로 빈 span 에 innerHTML 인젝션 우회 절대 금지.",
      "**React 한정** — `<Button leftIcon={<svg/>}>...</Button>` / `rightIcon={<svg/>}` 사용. 빈 React Element 를 넘기고 ref 로 innerHTML 박는 패턴 금지.",
      "color='assistive' + variant='solid' 조합은 Figma 라이브러리에 없음(=의도적으로 막혀 있음). DS 코드에 노출돼 있어도 사용 금지 — cool-gray 배경이라 disabled와 구분되지 않음.",
      "Geniet 브랜드에서 variant='soft' 또는 variant='outlined-sub' 는 Figma 가이드(207:1853)에 없는 변형. 사용 시 dev console 에 경고가 나오며 디자인 인텐트가 어긋남 — Geniet 은 solid / outlined 만 사용.",
      "Geniet Solid/Secondary 는 #333333(gray-900) dark inverse 패턴 + 흰 텍스트 — 다른 브랜드의 옅은 톤 secondary 와 다름. 'dark fill' 이 의도된 결과.",
      "primary 색은 화면당 가장 중요한 1개 액션에만 사용. 한 화면에 두 개 이상 primary 솔리드 = 위계 붕괴.",
      "다른 페이지로 이동하는 CTA라고 해서 모든 Button에 화살표 아이콘을 붙이지 말 것. ArrowNext/ChevronRight 류 아이콘은 대표 전진 액션 1개에만 사용.",
      "카드 리스트/섹션 리스트에서 반복되는 '자세히 보기 →' 버튼은 시각 소음이 큼. 반복 CTA는 아이콘 없이 텍스트만 쓰거나 카드 전체 클릭 패턴을 검토.",
      "Solid/Secondary 는 옅은 파랑 배경(#F1F8FD) + primary 텍스트로 그려진다. 'magenta'를 기대하면 안 됨.",
      "Outlined/Assistive 는 medium weight + 회색 보더. Outlined/Primary 와 weight·border 모두 다르므로 'color=assistive variant=outlined' 와 'color=primary variant=outlined' 를 임의로 바꿔치기하지 말 것.",
      '**아이콘 색 하드코딩 금지** — `<LockIcon color="var(--semantic-icon-inverse-default)" />` 처럼 inverse/brand 토큰을 박지 말 것. NudgeEAP/Trost(primary=흰 텍스트) 에서는 맞아 보이지만, 캐시워크 포 비즈니스(primary=검정 텍스트 on 노랑) 에서는 흰 아이콘이 노란 배경 위에 떠 보임. 항상 `color="currentColor"` 로 두어 Button 텍스트 색을 상속하게 한다.',
      "**shape='pill' 은 radius 만 바꿈** — color/variant/size 매트릭스와 직교. shape 만 다른 두 버튼을 한 화면에 섞으면 위계 혼란 — 컨텍스트별로 통일. brand 별 shape 사용 패턴은 get_guide({ topic:'component:Button', brand:'<slug>' }).preferredPatterns 참조.",
      "**라벨 1줄 강제 — 두 줄 줄바꿈 금지** (전 브랜드 공통 룰). 라벨이 컨테이너 폭 부족으로 wrap 되면 버튼 높이가 깨지고 좌우 정렬·아이콘 베이스라인이 어긋남. 대응: (1) 라벨을 짧은 동사구로 (2) IconButton 또는 dropdown 으로 분리 (3) 컨테이너 width/grid 재설계. 절대 `white-space: normal` 로 강제 wrap 시키지 말 것 — DS 의 `white-space: nowrap` 이 의도된 가드. 텍스트가 길 수밖에 없으면 size 를 줄이지 말고 단어를 줄여라.",
    ],
    recommended: [
      "1차 CTA: color='primary', variant='solid'",
      "보조 액션 (밝은 배경 위): color='primary', variant='outlined'",
      "보조 액션 (파란 카드 위 등): color='secondary', variant='solid' — 옅은 파랑 배경",
      "중립 액션(취소/뒤로): color='assistive', variant='outlined'",
      "파괴 액션: color='error', variant='solid'",
      "회색 인상을 주려고 assistive/solid 를 쓰지 말 것 — disabled prop 이 정공법",
    ],
    usagePolicy: {
      useFor: [
        "화면의 대표 CTA, 명확한 실행 액션, 중요한 폼 제출",
        "ArrowNext/ChevronRight 아이콘은 다음 단계로 이동하는 대표 CTA 1개",
      ],
      doNotUseFor: [
        "반복 카드마다 붙는 장식성 화살표 CTA",
        "동일 위계 CTA 여러 개에 모두 우측 화살표 아이콘 부착",
        "단순 보조 이동/자세히 보기 링크에 습관적으로 화살표 사용",
      ],
      limits: {
        primarySolidPerScreen: 1,
        arrowIconButtonPerViewport: 1,
        repeatedListArrowButton: "avoid",
      },
    },
    examples: {
      do: `<Button color="primary" variant="solid" rightIcon={<ArrowNextIcon />}>상담 신청하기</Button>
<Button color="primary" variant="outlined">검사 시작하기</Button>
<Button color="assistive" variant="outlined">자세히 보기</Button>`,
      dont: `<Button rightIcon={<ArrowNextIcon />}>상담 신청하기</Button>
<Button rightIcon={<ArrowNextIcon />}>검사 시작하기</Button>
<Button rightIcon={<ArrowNextIcon />}>자세히 보기</Button>`,
    },
    colorMatrix: {
      "primary/solid": "#2B96ED 배경 + 흰 텍스트 — 가장 중요한 CTA",
      "primary/outlined": "흰 배경 + #2B96ED 보더/텍스트 — 밝은 배경 위 보조 액션",
      "primary/soft":
        "surface.brandSubtle 배경 + textRole.brand 텍스트 — 3차 액션 (Figma 라이브러리엔 별도 셀 없음). 색 값은 packages/tokens/src/brands/<brand>.semantic.ts 토큰 SSOT 참조.",
      "secondary/solid":
        "#F1F8FD 배경 + #2B96ED 텍스트 — 파란 카드/배경 위 강조 (default), hover=#E3F2FC",
      "assistive/outlined":
        "흰 배경 + #D8D8D8 보더 + #383838 medium weight 텍스트 — 중립 액션. Figma는 M/S/XS 만 지원, disabled 없음",
      "error/solid": "error fill + 흰 텍스트 — 파괴 액션 한정",
    },
    sizeMatrix: {
      xl: "height 52 / px 16 / py 14 / 16·24 bold / icon 20 / gap 8",
      lg: "height 48 / px 16 / py 12 / 16·24 bold / icon 20 / gap 8",
      md: "height 44 / px 24 / py 11 / 15·22 bold / icon 20 / gap 8",
      sm: "height 42 / px 16 / py 11 / 14·20 bold / icon 20 / gap 8",
      xs: "height 38 / px 16 / py 10 / 13·18 bold / icon 18 / gap 6",
    },
    stateMatrix: {
      "primary/solid/disabled": "bg #9CA2AE cool-gray + 흰 텍스트.",
      "secondary/solid/disabled": "bg #E6E7EB + 텍스트 #9CA2AE.",
      outlined_disabled: "흰 배경 + 보더 #9CA2AE + 텍스트 #9CA2AE.",
      hover: "primary=#017EE4 / secondary=#E3F2FC / outlined/assistive=#FAFAFA",
    },
    /**
     * Cashwalk-biz Button 의 spec 차이 (Figma 3098:1032 / 1079 SSOT).
     * sm/xs height 만 base 와 다름 (sm 42→40, xs 38→36). 나머지 (xl/lg/md) 는 base 동일.
     * disabled 3종은 base.stateMatrix 본문에 묶여있는 "(캐시워크 포 비즈니스) ..." 텍스트를
     * 깨끗하게 깔린 단일 문장으로 교체 (shallow merge by key 라 override 가 base 키를 덮어씀).
     */
    matrixOverrides: {
      "cashwalk-biz": {
        sizeMatrix: {
          sm: "height 40 (base 42 → 40) / 그 외 px/py/typography 는 base 동일",
          xs: "height 36 (base 38 → 36) / 그 외 px/py/typography 는 base 동일",
        },
        stateMatrix: {
          "primary/solid/disabled":
            "bg #DDDDDD (atomic Neutral/400) + text #FFFFFF (Figma 3098:1079).",
          "secondary/solid/disabled":
            "bg #DDDDDD + text #FFFFFF — Solid/Primary disabled 와 같은 페어.",
          outlined_disabled: "흰 배경 + 보더 #E7E7E7 + 텍스트 #BBB.",
        },
        dimensions: {
          shape:
            "default(radius 8 — 일반 admin 액션) · pill(radius full — 모달 확인/취소, BottomCTA, 격식 컨텍스트). 5종 스타일 × 2 shape × 5 size = 50 cell (Figma ButtonGuide SSOT).",
          relatedComponents:
            "TextButton(Large 38 / Medium 32), IconButton(48/44/40/32) — 별도 컴포넌트 가이드.",
        },
      },
    },
    accessibility: [
      "터치 타겟 최소 44px — md(44)/lg(48)/xl(52) 권장. xs(38)/sm(42)는 보조 행에서만.",
      "Figma 의 'Hover / Focused' 셀은 한 상태로 합쳐져 있지만 코드에서는 :focus-visible 도 동일 hover 톤으로 노출됨 — 키보드 포커스링이 사라지지 않게 customizing 시 outline 토큰 유지.",
      "disabled 버튼에도 aria-disabled 가 자동 부착되도록 disabled prop 사용 (raw <button> 대체 금지).",
    ],
    interactivePattern:
      "버튼은 onClick 핸들러를 항상 부착. 목업에서도 라우팅 시뮬(toast/console.log)이라도 넣을 것.",
  },
  IconButton: {
    name: "IconButton",
    examplesHtml: {
      do: '<nds-icon-button size="md" aria-label="알림">\n  <svg viewBox="0 0 24 24" fill="currentColor">…</svg>\n</nds-icon-button>',
      dont: '<!-- aria-label 없는 아이콘 단독 버튼: 스크린리더가 "button" 만 읽음 -->\n<nds-icon-button size="md"><svg>…</svg></nds-icon-button>\n<!-- raw <button> 으로 아이콘 버튼 흉내. 토큰/사이즈 룰 적용 안 됨 -->\n<button class="icon-btn"><svg>…</svg></button>',
    },
    summary:
      "아이콘만 있는 버튼 (Figma Library node 171:8560 기준). 접근성을 위해 aria-label 필수.",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8560",
    pitfalls: [
      "aria-label 누락 시 스크린리더가 읽지 못함 (prop 강제됨).",
      "AppBar 우측 빈 영역에 ChevronRight 같은 장식만 두지 말 것 — 인터랙션 없이 시각적 잡음.",
      "Figma 명세에 disabled 상태가 없음 — disabled 가 필요한 흐름이면 Button(icon-only 처리) 또는 Tooltip 으로 우회.",
    ],
    recommended: [
      "AppBar 우측엔 알림/설정 같은 실제 기능 IconButton을 두기.",
      "<IconButton icon={<PushIcon/>} aria-label='알림' onClick={...}>",
    ],
    sizeMatrix: {
      "x-large": "box 36 / icon 28 (padding 4)",
      large: "box 32 / icon 24 (padding 4)",
      medium: "box 28 / icon 20 (padding 4)",
      small: "box 24 / icon 16 (padding 4)",
    },
    stateMatrix: {
      hover: "bg #F5F5F5 (neutral/100), radius 4",
      disabled: "icon color = text/disabled (Figma에는 미정의)",
    },
  },
  TextButton: {
    name: "TextButton",
    examplesHtml: {
      do: '<nds-text-button size="md" label="더보기" right-icon="arrow-next"></nds-text-button>',
      dont: '<!-- 파괴 액션을 text-button 으로 — 위계/색이 부족. nds-button color="error" 권장 -->\n<nds-text-button label="계정 삭제하기" right-icon="arrow-next"></nds-text-button>',
    },
    summary:
      "텍스트만으로 된 액션 — '전체보기' 같은 인라인 링크에 적합 (Figma Library node 171:8522).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8522",
    pitfalls: [
      "단순 <span>/<a>로 만들지 말 것 — DS TextButton 에 호버/포커스/접근성 처리가 들어 있음.",
      "Figma 호버 명세가 opacity-50 으로 잡혀 있음 (대비비 위험) — 코드에서는 primary 컬러로 대체. 의도적 차이.",
    ],
    sizeMatrix: {
      large: "16·24 regular / icon 16 / gap 2 / padding 4",
      medium: "14·20 regular / icon 16 / gap 2 / padding 4",
    },
    stateMatrix: {
      default: "color #777 (neutral/600)",
      disabled: "color #999 (neutral/500)",
      hover: "color primary/main (DS), Figma는 opacity-50 — 가이드 차이 항목",
    },
  },
  Card: {
    name: "Card",
    examplesHtml: {
      do: '<nds-card variant="outlined" clickable>\n  <nds-card-thumbnail ratio><img src="/cover.jpg" alt="" /></nds-card-thumbnail>\n  <nds-card-body>\n    <h3>제목</h3>\n    <p>설명 텍스트</p>\n  </nds-card-body>\n</nds-card>\n<script>card.addEventListener("card-click", () => navigate("/detail"));</script>',
      dont: '<!-- clickable 카드 내부에 또 다른 클릭 가능한 nds-button -> 중복 핸들러 -->\n<nds-card clickable>\n  <nds-card-body>제목</nds-card-body>\n  <nds-button color="primary">자세히 보기</nds-button>\n</nds-card>\n<!-- raw <div class="nds-card"> 로 모양만 흉내. 키보드/포커스 룰 사라짐 -->\n<div class="nds-card" onclick="…">…</div>',
    },
    summary:
      "동일 형식이 반복되는 콘텐츠 묶음을 시각적으로 그룹화하는 컨테이너. 1회성 메시지/프로모션은 Card 가 아니라 Banner. " +
      "Figma 헤더 제약 4종: 3 Variants · PC & Mobile (반응형) · Image Optional (이미지 없는 변형 허용) · Semantic Token (raw hex / 임의 색 금지). " +
      "Variant 3종 (List / Thumb / Cover) — 시각 우선순위·정보 밀도가 다르며 한 화면에서 1-2종만 함께 사용. " +
      "List = 이미지 없이 텍스트+메타데이터로 나열 (트리거: 한 페이지 10개 이상 / 분류별 식품 리스트), " +
      "Thumb = 썸네일 + 보조 정보 가로형 (트리거: 콘텐츠 식별이 텍스트만으로 부족 / 식품 카드·영양 코칭), " +
      "Cover = 큰 이미지가 콘텐츠의 핵심 (트리거: 그리드로 시각적 임팩트 필요 / 4-up·2-up 그리드·커뮤니티). " +
      "도메인 출처: 지니어트(Geniet) 칼로리계산기 허브 페이지의 식품 리스트·영양 토픽·커뮤니티 카드. " +
      "Compound 슬롯(순서 고정, 모두 Optional): Card.Root / Thumbnail / Avatar / Chips / Title / Description / Metadata / Divider / Cta / FooterText. (legacy: Header / Body / Footer 도 유지). " +
      "Flat API props: thumbnail, avatar, chips, title, description, metadata, divider, cta, footerText, children. " +
      "Anatomy 슬롯 (Figma SSOT, 한 카드 안에서 동일 위치 = 항상 같은 의미): Media(썸네일/커버, Thumb=정사각·Cover=4:3·단색 폴백 허용) · Title(필수, 카드 식별 핵심 라벨, 최대 2줄 + ellipsis, Body 2~H4 Bold) · Meta(보조 정보, 1줄, ' · ' 구분자, Caption Regular) · Status(상태 Badge, Success/Caution/Error 중 1개만) · Action(탭/이동 트리거 — 카드 전체 클릭이 기본, 내부 CTA 버튼 X) · Composition(optional, 도메인 카드가 Base 위에 얹는 슬롯). " +
      "도메인 카드(헬시딜·식품 검색·커뮤니티·랭킹·리뷰·식단 추천 등)는 새 variant 를 만들지 말고 Base variant 위에 Composition 슬롯을 얹어 표현 — 슬롯 카탈로그 16종(kcal chip · star rating · promotion badge · nutrition tag row · like overlay · author meta · discount badge · strikethrough price · shipping chip · certification chip · ranking leading · macro nutrition bar · category banner header · friend social proof · trending count · forum meta row)은 `get_guide({ topic: 'pattern:card-composition' })` 에서 슬롯별 사용 룰·위치·한도·금지 조합을 확인. " +
      "Section/Group Card(카드 안에 list rows 를 담는 컨테이너 — '루테인 포함 영양제 · 총 84개 제품' 같은 묶음)는 단일 Card 가 아닌 별도 패턴 — `get_guide({ topic: 'pattern:card-section' })` 참고.",
    figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=131-1769",
    pitfalls: [
      "[Figma 권위 룰] Variant 혼용 금지 — 한 그리드 안에서 List/Thumb/Cover 를 섞으면 위계가 충돌. 한 화면에 1-2종만, 그리드 내부는 1종만.",
      "[Figma 권위 룰] Card 위에 별도 CTA 버튼 추가 금지 — Action 은 카드 전체 클릭이 기본. 카드 내부에 Solid/Outlined 버튼을 두면 카드 전체 클릭 영역과 충돌. 섹션 하단 '더보기' 같은 CTA 는 Card 가 아니라 Section 의 것.",
      "[Figma 권위 룰] Elevation 은 0(border) 또는 1(shadow) 중 택1 — border 1px 와 box-shadow 를 동시에 걸면 위반. 한 화면에서는 한 종류만 일관되게.",
      "[Figma 권위 룰] 임의 pastel/gradient/opacity 배경 금지 — White 또는 정의된 Surface 토큰 외 배경색 생성 불가. linear-gradient(), rgba 투명도, #E8F4FD 류 임의 hex 모두 차단.",
      "[Figma 권위 룰] Title 생략 금지 — 카드당 정확히 1개, 항상 가장 높은 시각적 위계. 최대 2줄 + ellipsis. Description/Metadata 가 Title 자리를 대신할 수 없음.",
      "[Figma 권위 룰] Status Badge 2개 이상 동시 노출 금지 — Success/Caution/Error 중 하나만 강조.",
      "[Figma 권위 룰] Cover 이미지 비율 임의 변경 금지 — 1:1 / 4:3 / 16:9 외 비율은 DS 에서 먼저 정의 후 사용.",
      "[Figma 권위 룰] Thumb 이미지 원형(circle) 금지 — Thumb 슬롯은 Radius 토큰 적용된 사각. 원형은 Avatar 슬롯 전용.",
      "[Figma 권위 룰] 한 리스트 내 Radius 토큰은 1종만 — 일부 카드만 Radius 가 다른 케이스는 위반.",
      "[Figma 권위 룰] Cover 본문 텍스트 3줄 이상 금지 — Cover 는 큰 이미지가 주, 본문은 짧게.",
      "[Figma 권위 룰] Meta 구분자는 ' · ' 통일 — '/', '|', '-', 줄바꿈 등 다른 구분자 금지. Caption / Regular 1줄.",
      "[Figma 권위 룰] Nested Card 금지 — Card 안에 또 다른 Card 삽입 X. 그룹은 Section / Divider 로 표현. bordered 박스를 카드처럼 흉내내는 것도 위반.",
      "[Figma 권위 룰] 광고/프로모션과 동일한 카드 스타일로 콘텐츠 카드 생성 금지 — Promo Card 는 별도 토큰 사용. 사용자 혼동 방지.",
      "Avatar + Thumbnail 동시 사용 불가 — 둘 중 하나만 (Avatar max 1개).",
      "Title 슬롯은 항상 Media 다음, 좌측 정렬 — 카드마다 다른 위치에 두면 안 됨.",
      "Thumb 이미지가 없을 때는 Brand Soft 단색 폴백 사용 — 빈 회색 박스 / placeholder 이미지 금지.",
      "Decorative Card 금지 — 콘텐츠 위계가 없는 장식용 카드 생성 금지. 동일 형식 반복이 아니면 Banner/Section 사용.",
      "그리드 카드 간격 임의 혼합(8/12/16/20px) 금지. Auto Layout: Mobile 16px, Web·CMS 24px.",
      "Card.Header / Card.Body / Card.Footer 는 styles.css 에 자체 padding 보유. 외곽에 padding 또 주면 이중 패딩.",
      "Card Overuse — 단순 텍스트+상태+날짜 목록(상담 내역·예약·알림)을 Card 로 감싸는 패턴. 정보 밀도 ↓, List Row 로 변경.",
    ],
    recommended: [
      "List variant — 이미지 없이 Title + Meta. 분류된 항목을 좁은 간격으로 노출, 시각 가중치 최저. <Card.Root variant='list'><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>",
      "Thumb variant — 좌측 정사각 썸네일 + 우측 Title/Meta. 카테고리/식품 목록의 기본 카드. <Card.Root variant='thumb'><Card.Thumbnail/><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>",
      "Cover variant — 상단 큰 이미지(1:1 또는 4:3) + 하단 Title/Meta. 4-up / 2-up 그리드용. <Card.Root variant='cover'><Card.Thumbnail aspect='1:1'/><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>",
      "Composition Patterns (도메인 카드) — Base variant 선택 후 Composition 슬롯을 얹는다. variant 를 새로 만들지 않음. 슬롯 16종 전체 카탈로그·위치·한도·금지 조합은 `get_guide({ topic: 'pattern:card-composition' })`.",
      "도메인 카드 예시 매핑 (Figma SSOT) — 헬시딜 랭킹 카드 = Cover + Slot7(discount badge) + Slot8(strikethrough+sale price) + Slot2(star rating) + Slot9(shipping chip) + Slot10(certification chip). 음식 리뷰 카드 = Cover + Slot5(like overlay) + Slot6(author meta) + Slot2(star rating). 다이어트·혈당 추천 카드 = Cover + Slot13(category banner header) + Slot4(nutrition tag row) + Slot12(macro nutrition bar) + Slot14(friend social proof). 지금 뜨는 한식 = List + Slot11(ranking leading) + Slot1(kcal chip) + Slot15(trending count). 커뮤니티 게시글 = List + Slot16(forum meta row).",
      "Section/Group Card (카드 안에 list rows 묶음 — 예: '루테인 포함 영양제 · 총 84개 제품') — 단일 Card 의 variant 가 아니라 별도 컨테이너 패턴. 룰·메트릭은 `get_guide({ topic: 'pattern:card-section' })`.",
      "Action 패턴 — 카드 전체가 클릭 영역. <Card.Root clickable onClick={…}>. 내부에 Solid/Outlined CTA 버튼 두지 않음. 섹션 하단 '더보기' 는 Card 가 아니라 Section 의 CTA.",
      "Thumb 폴백 — 이미지가 없을 때 Brand Soft 토큰 단색 배경(예: var(--semantic-brand-bg)) + 옵션 아이콘.",
    ],
    usagePolicy: {
      useFor: [
        "분류된 식품·콘텐츠 텍스트 나열 (List · 10개 이상 / 페이지)",
        "썸네일 + 보조 정보로 식별하는 식품/카테고리 카드 (Thumb)",
        "큰 이미지가 주인공인 식단/커뮤니티 4-up·2-up 그리드 (Cover)",
        "도메인 카드 (헬시딜 / 음식 검색 / 음식 리뷰 등) — Base variant + Composition 슬롯",
        "개별 오브젝트 선택·비교 (상담사 선택, 상품)",
      ],
      doNotUseFor: [
        "단일 메시지 / 1회성 프로모션 → Banner",
        "텍스트+날짜+상태만의 단순 데이터 (상담 내역·예약·알림) → List Row",
        "컬럼별 비교가 핵심인 데이터 → Table",
        "시간순 연속 정보 (알림·채팅) → Feed / List",
        "탭·필터·내비게이션 역할 → Chip / Navigation",
        "주의/경고/안내 메시지 + bullet list + expand/collapse (예: '⚠ 섭취 주의사항') → Notice / Banner (caution tone) — Brand soft bg + caution icon + expand/collapse 패턴은 Card 가 아님",
        "관련 row 묶음을 외곽 보더로 포장한 컨테이너 (예: '루테인 포함 영양제 · 총 84개 제품') → Card 가 아니라 Section Card 별도 패턴 `get_guide({ topic: 'pattern:card-section' })`",
        "장식용 — 동일 형식 반복이 아니면 Card 가 아님",
      ],
      limits: {
        variantUsageList:
          "사용 시점: 이미지 없이 텍스트와 메타데이터로 짧게 나열할 때 (분류별 식품 리스트). 트리거: 한 페이지에 10개 이상 노출될 때.",
        variantUsageThumb:
          "사용 시점: 썸네일과 보조 정보를 함께 보여줘야 할 때 (식품 카드, 영양 코칭 가로형). 트리거: 콘텐츠 식별이 텍스트만으로 부족할 때.",
        variantUsageCover:
          "사용 시점: 큰 이미지가 콘텐츠의 핵심일 때 (식단 사진 4-up 그리드, 커뮤니티 콘텐츠). 트리거: 그리드 형태로 시각적 임팩트가 필요할 때.",
        titleRequired: 1,
        variantsPerScreen: "1-2종",
        variantsPerGrid: 1,
        maxAvatarPerCard: 1,
        maxBadgePerCard: 2,
        maxStatusBadgePerCard: 1,
        maxDescriptionLines: 3,
        maxCoverDescriptionLines: 2,
        maxMetadataItems: 2,
        maxCtaButtonsInsideCard: 0,
        maxNutritionTagsInComposition: 3,
        radiusPerList: 1,
      },
    },
    sizeMatrix: {
      "anatomy.media":
        "썸네일 또는 커버 이미지. Thumb=정사각, Cover=4:3(PC)/1:1(Mobile). 단색 폴백 허용.",
      "anatomy.title": "카드 식별 핵심 라벨. 최대 2줄 + ellipsis. Body 2 ~ H4 / Bold.",
      "anatomy.meta": "수치·시간·단위 등 보조 정보. 1줄, ' · ' 구분자. Caption / Regular.",
      "anatomy.status": "상태 Badge. Success / Caution / Error 중 1개만.",
      "anatomy.action": "탭/이동 트리거. 카드 전체 클릭이 기본. 내부 CTA 버튼 사용하지 않음.",
      "anatomy.composition":
        "(optional) 도메인 카드가 Base 위에 얹는 슬롯 — kcal chip · star rating · promotion badge · nutrition tag row.",
      "mobile.list": "Width Fill · Padding 16/12 · Image — · Radius 8 · Title Body 3 Bold",
      "mobile.thumb": "Width Fill · Padding 16/12 · Image 56×56 · Radius 10 · Title Body 3 Bold",
      "mobile.cover": "Width Fill · Padding 16/12 · Image AR 1:1 · Radius 12 · Title Body 2 Bold",
      "pc.list": "Width Fill · Padding 20/16 · Image — · Radius 10 · Title Body 2 Bold",
      "pc.thumb": "Width Fill · Padding 24/20 · Image 72×72 · Radius 12 · Title Body 2 Bold",
      "pc.cover": "Width Fill · Padding 0/16 · Image AR 4:3 · Radius 14 · Title H4 Bold",
      cardGapMobile: "16px",
      cardGapWebCMS: "24px",
      elementGapTitleMeta: "4px",
      footerSeparator: "border-top 1px · padding-top 16px (Footer 슬롯 사용 시)",
      typoMeta: "Pretendard Caption 1 Regular 13px / LH 18px — var(--font-size-caption-1)",
      compositionNote:
        "Composition 슬롯은 Base variant 의 padding 안쪽에 위치. promotion badge 만 top-right absolute 허용.",
    },
    stateMatrix: {
      default:
        "Elevation 0(border 1px · neutral border 토큰) 또는 Elevation 1(box-shadow 토큰) 중 화면 단위로 택1. bg = white 또는 Surface 토큰. 두 elevation 을 동시에 걸지 않음.",
      hover:
        "Border 색 변경 또는 미세한 bg tint. Elevation 1 화면에서는 shadow 한 단계 강조 가능. border+shadow 동시 강화 금지.",
      activeSelected:
        "Border 2px Brand Color 또는 Surface tint. Elevation 1 화면이라도 selected 표시는 색으로.",
      pressed: "transition 100ms — bg tint 또는 scale(0.99). shadow 깜빡임 금지.",
      note: "[Figma 권위 룰] 같은 화면 안에서 카드마다 elevation 종류가 다르면 안 됨. 한 리스트 = 한 elevation.",
    },
    accessibility: [
      "clickable Card 는 <Card.Root clickable onClick> — 키보드 포커스/Enter 자동. raw <div onClick> 대체 금지.",
      "Cover 카드 이미지 위에 텍스트를 얹는 디자인이라면 Gradient Overlay 위에서 WCAG AA 대비비 확보 — 단, 이건 Banner 영역. Card 의 Cover 변형은 텍스트가 이미지 하단 별도 영역에 위치.",
      "썸네일 <img> alt 필수 (장식이면 alt=''). 카드 제목과 중복되는 alt 는 비우기.",
      "Status Badge 는 색 + 텍스트 라벨 동시 노출 — 색맹 대응.",
    ],
    interactivePattern:
      "Card.Root 의 clickable + onClick 으로 인터랙티브화 — 카드 전체가 클릭 영역이고 내부에 별도 CTA 버튼을 두지 않는 것이 기본. " +
      "Composition 슬롯의 promotion badge 처럼 시각만 강조하는 요소는 클릭 핸들러 없이 절대 위치만 잡고, 클릭은 Card.Root 가 받는다. " +
      "Hover 피드백은 화면 elevation 정책에 맞춰 — Elevation 0 화면은 border 색 변경, Elevation 1 화면은 shadow 강조. 두 elevation 을 한 화면에서 섞지 않음.",
  },
  Badge: {
    name: "Badge",
    examplesHtml: {
      do: '<nds-badge variant="fill" color="brand" size="md">NEW</nds-badge>\n<nds-badge variant="ghost" color="success" size="sm">완료</nds-badge>',
      dont: '<!-- hex 인라인. 시멘틱 컬러 토큰을 잃음 -->\n<nds-badge style="background:#FFD400;color:#000">NEW</nds-badge>\n<!-- 안내문/섹션 제목에 Badge 도배 — Badge 는 상태/짧은 속성용 -->\n<nds-badge color="brand">오늘의 미션</nds-badge>',
    },
    summary:
      "상태/속성을 한눈에 알려주는 보조 라벨. variant: fill/ghost/line · color: brand/neutral/success/error/caution/info. " +
      "Figma 171:10856. label prop 필수. 콘텐츠가 아니라 콘텐츠를 보조하는 메타 정보만 담는다.",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-10856",
    pitfalls: [
      "Badge 는 강조 요소가 아니라 보조 정보 — 본문 텍스트보다 시선을 끌면 안 된다.",
      "Fill Badge 남용 금지 — 한 카드/리스트 Row 에 Fill Badge 가 2개 이상 보이면 위계가 무너진다. 일반 카테고리는 ghost/line 우선.",
      "Brand color 는 '현재 선택 / 핵심 강조' 에만 사용. 일반 카테고리·상태 표시에는 neutral 우선.",
      "상태 색(success/error/caution/info) 은 의미 전달 목적에만 사용 — 단순 강조용 컬러로 쓰지 말 것.",
      "Tone-on-Tone 금지: 연한 Blue 배경 위에 Blue Fill Badge, 연한 Mint Surface 위 Mint Badge 같은 동일 계열 중첩 금지.",
      "Badge 안에 긴 문장/CTA 보조 문구 금지 — 8자 안팎 짧은 라벨만.",
      "Chip 과 혼용 금지 — Chip 은 '선택/필터/분류 액션', Badge 는 '상태/속성 표시(비액션)'.",
    ],
    usagePolicy: {
      useFor: [
        "상태 표시 (진행중 / 완료 / 마감)",
        "속성 라벨 (신규 / 추천 / 필수)",
        "리스트 Row 의 보조 메타 정보",
      ],
      doNotUseFor: [
        "버튼 / CTA 대체",
        "섹션 제목 장식",
        "본문 강조용 컬러 칩",
        "모든 카드에 반복되는 시각 장식",
      ],
      colorPolicy: {
        brand: "현재 선택 · 핵심 강조에만",
        neutral: "일반 카테고리 · 기본 속성 (기본값)",
        success: "성공/완료 의미",
        error: "오류/실패 의미",
        caution: "주의/경고 의미",
        info: "정보/안내 의미",
      },
      variantPolicy: {
        fill: "강한 상태 표시 — 카드당 최대 1개",
        ghost: "일반 카테고리 · 기본 보조 정보 (권장 기본값)",
        line: "비활성/완료 상태",
      },
      limits: {
        maxLabelLength: 8,
        maxFillPerCard: 1,
        maxPerCard: 2,
      },
    },
  },
  Chip: {
    name: "Chip",
    examplesHtml: {
      do: '<nds-chip variant="outlined" color="brand" interactive>전체</nds-chip>\n<nds-chip variant="ghost" color="caution" size="sm" removable>주의 필요</nds-chip>',
      dont: '<!-- disabled 와 removable 동시 사용 — 누가 X 버튼을 누를 수 있는지 모호 -->\n<nds-chip disabled removable>태그</nds-chip>\n<!-- interactive 없이 클릭 핸들러만 — 키보드 포커스가 안 잡힘 -->\n<nds-chip onclick="…">필터</nds-chip>',
    },
    summary:
      "pill 형태 라벨. variant: fill/outlined/ghost. **React**: `<Chip label='...' />` (label prop 필수, children 금지). **HTML**: `<nds-chip>...</nds-chip>` (text content, label attribute 없음).",
    pitfalls: [
      "**React 한정** — `<Chip>{children}</Chip>` 으로 children 넣지 말 것. 반드시 `<Chip label='...' />`. 함정: HTML 예시(`<nds-chip>라벨</nds-chip>`)를 보고 React 에도 children 쓰면 API 어긋남.",
      "**HTML 한정** — `<nds-chip label='...' />` 처럼 label attribute 쓰지 말 것. nds-chip 은 label attribute 가 없고 children/text content 만 받음 (nds-chip.ts L189: `while (this.firstChild) label.appendChild(this.firstChild)`).",
      "Chip은 상태/분류/짧은 속성 표시용이다. 새 섹션을 강조하거나 일반 안내문을 꾸미는 장식으로 쓰지 말 것.",
      "모든 카드/섹션 제목 앞에 Chip을 붙이면 위계가 무너진다. 카드당 최대 1-2개, 섹션당 최대 2개 수준으로 제한.",
      "긴 문장이나 CTA 보조 문구를 Chip에 넣지 말 것. 8자 안팎의 짧은 라벨만 자연스럽다.",
      "표준 variant에 없는 톤(예: caution, success)이 필요해도 raw <span>/<div>로 대체 금지. style prop으로 background/color/font-weight를 토큰 변수로 override + icon prop으로 좌측 도트 주입이 정공법.",
    ],
    recommended: [
      "주의 톤: <Chip label='주의 필요' variant='ghost' size='sm' icon={<span style={{width:6,height:6,borderRadius:9999,background:'var(--semantic-caution-main)'}}/>} style={{background:'var(--semantic-caution-bg)',color:'var(--semantic-caution-text)',fontWeight:600}} />",
      "성공/에러도 같은 패턴으로 토큰 var()만 교체",
    ],
    usagePolicy: {
      useFor: ["상태: 진행중, 완료, 마감", "분류: 상담, 검사, 교육", "짧은 속성: 신규, 추천, 필수"],
      doNotUseFor: [
        "일반 안내문 강조",
        "섹션 제목 장식",
        "모든 카드에 반복되는 시각 장식",
        "긴 문장",
        "CTA를 더 눈에 띄게 만들기 위한 보조 장식",
      ],
      limits: {
        maxLabelLength: 8,
        maxPerCard: 2,
        maxPerSection: 2,
      },
    },
  },
  Modal: {
    name: "Modal",
    examplesHtml: {
      do: '<nds-modal open title="신청을 취소할까요?" max-width="400" closable>\n  <p>입력한 내용은 저장되지 않아요.</p>\n  <div slot="footer">\n    <nds-button color="assistive" variant="outlined">닫기</nds-button>\n    <nds-button color="error" variant="solid">취소하기</nds-button>\n  </div>\n</nds-modal>\n<script>modal.addEventListener("modal-close", () => modal.removeAttribute("open"));</script>',
      dont: "<!-- closable + max-width 누락 + 본문 없음 — 의도/구조가 부족 -->\n<nds-modal open></nds-modal>\n<!-- raw <dialog> 로 모달 흉내 — focus trap / 토큰이 적용 안 됨 -->\n<dialog open><p>알림</p></dialog>",
    },
    summary:
      "사용자의 현재 흐름을 일시적으로 중단하고 중요한 결정/응답을 받기 위한 오버레이 UI. " +
      "(기본/모바일) Radius 8 / 카드 padding 비대칭 28·16·16 / PC 332 · Mobile 294 / 본문↔버튼 24px gap / 50% overlay / shadow.md. " +
      "Type: default / title(헤더) / Image(64×64 아이콘+타이틀). " +
      "Button: 최대 2개 (1개=Primary full-width, 2개=Outlined Cancel + Primary OK 가로 분할). " +
      "Modal API/props 는 brand 무관 동일 — CSS cascade 만 다름. brand 별 spec 변형 (예: admin desktop 4가지 패턴) 은 get_guide({ topic:'component:Modal', brand:'<slug>' }).dimensions 또는 matrixOverrides 참조.",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-9947",
    references: [
      {
        label: "CashwalkBiz Admin Modal Guide — 4 patterns",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3418-471",
        caption:
          "Cashwalk for Business · ModalGuide. Single / Dual / With Close / Confirm+Slot 4가지 슬롯 기반 admin 패턴 SSOT.",
        brand: "cashwalk-biz",
      },
    ],
    /**
     * brand 별 spec override. brand 가 지정된 get_guide 호출 시 router 가 dimensions 를 응답에 노출.
     * Cashwalk-biz 의 admin desktop 변형 (480/radius16/padding32/gap20/typography) — base 모바일 스펙과 spec 자체가 다름.
     * trost / geniet 는 토큰만 다르고 spec 동일 → matrixOverrides 비움 (Pattern 'Overlay 0').
     */
    matrixOverrides: {
      "cashwalk-biz": {
        dimensions: {
          width: "480px (PC admin desktop · base 332/294 와 다름)",
          radius: "16px (base 8)",
          padding: "32px 균등 (base 비대칭 28/16/16)",
          gapBodyToFooter: "20px (base 24)",
          buttonHeight: "44px pill (base 변형 없음)",
          titleTypo: "Title2 18·26 좌측 정렬 (base 중앙 정렬)",
          bodyTypo: "Body2 14·20 medium 좌측 정렬 (base 중앙 정렬)",
          activationCondition:
            '`<html data-brand="cashwalk-biz">` 가 박힌 환경에서만 자동 적용 — 그 외에서는 base 모바일 스펙 유지',
        },
      },
    },
    pitfalls: [
      "Modal 내부에 다시 큰 그림자/보더를 추가하지 말 것 (이미 shadow 토큰이 적용됨).",
      "ESC/오버레이 클릭으로 닫히는 기본 동작을 막으면 접근성 저해.",
      "버튼은 최대 2개까지만 사용. 3개 이상이 필요하면 BottomSheet 검토.",
      "maxWidth 미지정 시 base 기본 폭은 PC 332 / 모바일 294. brand 별 변형 (예: cashwalk-biz admin desktop 480) 은 get_guide({ topic:'component:Modal', brand:'<slug>' }).dimensions 또는 matrixOverrides 로 확인. 모바일 화면이면 device='mobile' 명시.",
      "ModalHeader/Body/Footer 자체에 padding 을 더하지 말 것 — 카드 패딩은 ModalContent 가 담당.",
      "단순 정보 전달용으로 Modal 사용 금지 — inline Notice / Banner / section 안내 우선. Modal 은 사용자의 즉각적 판단/응답이 필요할 때만.",
      "Modal 내부 강조 최소화: 핵심 action 1개 + 보조 action 1개 구조가 기본. Body 안에 또 다른 Card·Brand BG·Chip 그룹을 쌓지 말 것.",
    ],
    usagePolicy: {
      useFor: [
        "즉각적 판단/응답이 필요한 확인 (삭제 확인, 결제 확인)",
        "현재 흐름 중단이 정당화되는 중요한 결정",
        "추가 입력 없이 한 화면에서 결정을 마쳐야 하는 짧은 폼",
        "(캐시워크 포 비즈니스 admin) 검수/등록/노출 변경 같은 admin 워크플로우의 확인 다이얼로그",
      ],
      doNotUseFor: [
        "단순 정보 전달 — inline Notice / Banner / section 안내 사용",
        "긴 콘텐츠/스크롤 페이지 — 별도 페이지나 BottomSheet 검토",
        "여러 단계 분기 — Wizard / 별도 페이지",
        "에러 메시지 — Toast 또는 inline error 사용",
      ],
      emphasisRule:
        "핵심 action 1 + 보조 action 1 구조가 기본. Modal 안에 또 다른 강조 영역을 쌓지 말 것.",
    },
  },
  Tabs: {
    name: "Tabs",
    examplesHtml: {
      do: '<nds-tabs active-key="home" variant="line" size="mobile">\n  <nds-tabs-list>\n    <nds-tabs-trigger key="home">홈</nds-tabs-trigger>\n    <nds-tabs-trigger key="profile">프로필</nds-tabs-trigger>\n  </nds-tabs-list>\n  <nds-tabs-panel key="home">홈 콘텐츠</nds-tabs-panel>\n  <nds-tabs-panel key="profile">프로필 콘텐츠</nds-tabs-panel>\n</nds-tabs>\n<script>tabs.addEventListener("tabs-change", e => console.log(e.detail.activeKey));</script>',
      dont: '<!-- panel 의 key 가 trigger 의 key 와 불일치 — 빈 화면이 노출됨 -->\n<nds-tabs active-key="home">\n  <nds-tabs-list><nds-tabs-trigger key="home">홈</nds-tabs-trigger></nds-tabs-list>\n  <nds-tabs-panel key="HOME">홈 콘텐츠</nds-tabs-panel>\n</nds-tabs>',
    },
    summary:
      "line/pill/square 3가지 variant. items + activeKey + onTabChange. " +
      "동일 depth 콘텐츠 전환 · category navigation · section switching 전용. CTA·필터·페이지 단위 라우팅 대체용으로 사용 금지.",
    pitfalls: [
      "items 형식은 {key, title}[]. label 같은 다른 키 이름 사용 시 렌더 실패.",
      "변경 핸들러는 onTabChange (onChange 아님).",
      "Tab 을 CTA처럼 사용 금지 — '저장/신청/다음 단계' 등 액션은 Button 사용. Tab 은 보기 전환만.",
      "같은 리스트의 '필터' 는 FilterBar, Tab 은 '뷰/카테고리/섹션 전환' — 둘을 섞어 쓰지 말 것.",
      "Segment(variant='square') 는 PC CMS · 주요 기능 전환에만 사용. 모바일 일반 화면에서는 line / pill 사용.",
      "Tab 라벨에 Badge/Count 를 과하게 붙이면 위계가 무너짐 — 필요 시 count 만, Badge 는 카드 본문에서.",
    ],
    usagePolicy: {
      useFor: [
        "동일 depth 콘텐츠 전환 (예: 내 상담 / 받은 추천)",
        "category navigation (예: 전체 / 진행중 / 완료)",
        "section switching (한 페이지 내 영역 전환)",
      ],
      doNotUseFor: [
        "CTA 대체 (저장/신청/다음 단계)",
        "필터 컨트롤 (FilterBar 사용)",
        "페이지 단위 라우팅 (좌측 메뉴 · Breadcrumb 사용)",
        "모바일 일반 화면에서 Segment(variant='square')",
      ],
      variantPolicy: {
        line: "기본 — 모바일/PC 공통, 콘텐츠 전환",
        pill: "강조형 — 모바일 카드 헤더 안쪽",
        square: "Segment — PC CMS · 주요 기능 전환 전용, 모바일 일반 화면 금지",
      },
    },
  },
  List: {
    name: "List",
    examplesHtml: {
      do: '<nds-list>\n  <nds-list-item interactive>설정 항목 1</nds-list-item>\n  <nds-list-item interactive active>설정 항목 2</nds-list-item>\n</nds-list>\n<script>list.addEventListener("list-item-select", e => …);</script>',
      dont: "<!-- nds-list-item 가 아닌 raw <li> 를 직접 넣음 — 위계/사이즈가 깨짐 -->\n<nds-list><li>설정 1</li></nds-list>",
    },
    summary:
      "수직 정렬된 동질 항목의 컨테이너. <List variant='plain|card|divided'> + <ListItem leading title description metadata trailing onSelect />. " +
      "Row Anatomy 3 zone: Leading(Optional · Avatar/Thumbnail/Icon/Checkbox/Radio) + Content(Required · Title 최소 1행) + Trailing(Optional · IconButton/Badge/Toggle/Chevron/TextButton, 항상 우측 정렬). " +
      "임의 스타일 변형 차단이 목적 — Card 와 달리 단순 hierarchy 를 유지.",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=501-96",
    pitfalls: [
      "[Figma 권위 룰 #1] 리스트는 카드보다 단순 hierarchy 유지 — Row 에 카드 수준의 elevation/shadow/border 적용 금지.",
      "[Figma 권위 룰 #2] Trailing 요소는 항상 우측 정렬. Content 영역을 침범하는 레이아웃 금지.",
      "[Figma 권위 룰 #3] Divider 는 Content 시작 지점 기준 인셋 — Full-width divider 금지. Leading 있으면 padding(16) + Leading 폭 + gap(12) 만큼 좌측에서 띄움. Leading 없으면 padding(16) 만 인셋.",
      "[Figma 권위 룰 #4] 한 Row 에 Badge/Chip/Status 2개 이상 상태 요소 동시 배치 금지 — Trailing 슬롯엔 한 종류만.",
      "[Figma 권위 룰 #5] 카드형 리스트 남발 금지 — 각 Row 에 독립 card 스타일(radius + shadow) 적용 X. 그룹화가 필요하면 variant='card' 또는 'divided' 로.",
      "[Figma 권위 룰 #6] Random Padding 금지 — Spacing 규칙(아래 sizeMatrix) 외 임의 padding/margin 적용 X.",
      "[Figma 권위 룰 #7] Decorative List 금지 — 정보 전달 목적 없는 장식 요소를 Row 에 추가하지 말 것.",
      "[Figma 권위 룰 #8] 같은 리스트 내 Density 혼용 금지 — Compact(40)/Default(56)/Comfortable(72) 3가지 중 하나로 통일.",
      "Compact(40px)는 PC only — 모바일 Min Touch Target 48px 미달이므로 모바일에선 Default(56px) 이상.",
      "Title 은 Content 의 Required 요소 — Description/Metadata 만 있는 Row 금지. 최소 Title 한 줄.",
      "Avatar + Thumbnail 같은 Leading 슬롯 안에 2종 동시 배치 금지 — Leading 은 단일 식별자.",
      "Row 의 클릭은 ListItem 의 `onSelect` 사용 — raw <li onClick> 금지. onSelect 가 있으면 자동으로 button 역할 + 키보드 포커스 처리.",
    ],
    recommended: [
      "기본 사용: <List variant='divided'><ListItem leading={<Avatar/>} title='제목' description='설명' trailing={<ChevronRightIcon/>} onSelect={…} /></List>",
      "PC 설정 화면 (Compact 40): <List variant='plain'><ListItem size='sm' leading={<Icon/>} title='설정 항목' trailing={<Toggle/>} /></List> — 정보 밀도 우선.",
      "검색 결과 (Default 56): <List variant='divided'><ListItem leading={<Avatar/>} title='이름' trailing={<ChevronRightIcon/>} onSelect={…} /></List>",
      "프로필 목록 (Comfortable 72, Avatar+Title+Description): <List variant='divided'><ListItem size='lg' leading={<Avatar size='lg'/>} title='이름' description='역할 · 메타' trailing={<TextButton/>} onSelect={…} /></List>",
      "알림/일정 등 날짜 보조 정보: <ListItem leading={<Avatar/>} title='제목' description='설명' metadata='2026.05.20' trailing={<ChevronRightIcon/>} onSelect={…} /> — metadata 는 Caption 2/Muted 로 description 아래에 작게 표시.",
      "그룹화: variant='card' (외곽 보더+radius) 또는 'divided' (Row 간 inset divider). Row 마다 개별 card 스타일은 금지(#5).",
    ],
    usagePolicy: {
      useFor: [
        "텍스트+상태+날짜로 구성된 단순 데이터 (상담 내역·예약·알림·설정·검색 결과)",
        "10개 이상 항목의 수직 스크롤 탐색",
        "시간순 연속 정보 (알림 센터)",
        "동질적인 항목의 반복 배치 (멤버 목록, 옵션 목록)",
      ],
      doNotUseFor: [
        "이미지/썸네일 중심의 시각 탐색 → Card",
        "2열 이상 그리드 비교 → Card 그리드",
        "컬럼별 비교가 핵심 → Table",
        "탭·필터·내비게이션 → Chip / Navigation",
        "장식용 (Decorative list) — Anti-pattern #7",
      ],
      limits: {
        titleRequired: 1,
        maxLeadingPerRow: 1,
        maxTrailingStatusElements: 1,
        minTouchTargetMobile: "48px",
        densityPerList: 1,
      },
    },
    sizeMatrix: {
      horizontalPadding: "16px (좌·우 동일)",
      gapLeadingToContent: "12px",
      gapContentToTrailing: "12px",
      gapTitleToDescription: "4px",
      gapDescriptionToMetadata: "2px",
      minTouchTarget: "48px (모바일 필수)",
      densityCompact: "40px height (size='sm') · PC only · 정보 밀도 우선 (설정·관리자)",
      densityDefault: "56px height (size='md') · 표준 · 일반 목록·검색 결과",
      densityComfortable: "72px height (size='lg') · 여백 강조 · Avatar+Title+Description 조합",
      typoTitle: "Body 1 Bold 16px / LH 24px — var(--font-size-body-1) · Text/Strong/Default",
      typoDescription:
        "Body 3 Regular 14px / LH 20px — var(--font-size-body-3) · Text/Subtle/Default",
      typoMetadata:
        "Caption 2 Regular 12px / LH 16px — var(--font-size-caption-2) · Text/Muted/Default",
      dividerInsetWithLeading: "padding(16) + Leading 폭 + gap(12) — 예: Avatar 36 → 64px 인셋",
      dividerInsetTextOnly: "16px (좌측 padding 만)",
    },
    stateMatrix: {
      default:
        "BG var(--semantic-bg-surface-default) · Text Strong/Default · Border Normal/Default",
      hover:
        "BG var(--semantic-fill-neutral-subtle) · Border Normal/Default · ※ PC only (모바일 미지원)",
      active: "BG var(--semantic-bg-surface-subtle) · Text Strong/Default · Border Normal/Default",
      selected:
        "BG var(--semantic-bg-brand-subtle) · Text var(--semantic-text-brand-default) · Border var(--semantic-border-brand-default) 2px",
      disabled:
        "BG Surface/Default · Text var(--semantic-text-disabled-default) · Leading(Avatar 등) opacity 35%",
      focus: "BG Surface/Default · Border var(--semantic-border-focus-default) 2px",
      note: "총 6 상태. 시멘틱 컬러 토큰만 사용 — raw hex/임의 색 금지.",
    },
    accessibility: [
      "onSelect 가 있는 ListItem 은 자동으로 button 시멘틱 + 키보드 Enter/Space 핸들링. raw <li onClick> 대체 금지.",
      "Disabled Row 는 aria-disabled 자동 + 키보드/마우스 인터랙션 비활성. 시각적으로도 Leading opacity 35%.",
      "Focus 는 2px border-focus 로 표시 — outline 제거 금지.",
      "Avatar Leading 의 <img> 에는 alt 필수 (장식이면 alt=''). Title 과 중복되는 alt 는 비우기.",
    ],
    interactivePattern:
      "ListItem 의 onSelect 로 인터랙티브화 — 자동으로 button role + 키보드 포커스. " +
      "Trailing 슬롯 안에 별도 Button/IconButton 두면 그 핸들러에서 e.stopPropagation() 호출해 Row 전체 클릭과 분리. " +
      "Hover 는 PC only (모바일 미지원) — 모바일에선 active(터치 시 BG Surface/Subtle) 로만 피드백.",
  },
  Select: {
    name: "Select",
    examplesHtml: {
      do: '<nds-select value="kr" label="국가" placeholder="선택하세요">\n  <nds-select-option value="kr">대한민국</nds-select-option>\n  <nds-select-option value="jp" disabled>일본</nds-select-option>\n</nds-select>\n<script>sel.addEventListener("select-change", e => setCountry(e.detail.value));</script>',
      dont: '<!-- nds-select 안에 raw <option> -> 드롭다운이 렌더 안 됨 -->\n<nds-select value="kr"><option value="kr">대한민국</option></nds-select>',
    },
    summary: "드롭다운. options + value + onValueChange.",
    pitfalls: [
      "변경 핸들러는 **onValueChange** (onChange 아님). React 표준이 아닌 DS 컨벤션.",
      "**드롭다운 흉내 금지** — `<nds-button>` / raw `<button>` + ChevronRight/ChevronDown 아이콘 조합으로 드롭다운 모양만 따라 그리지 말 것. 키보드 탐색·focus trap·옵션 list a11y 가 전부 빠짐. 옵션이 1개라도 있으면 무조건 `<nds-select>` 또는 React `<Select>`. 'scope switcher / sort / filter' 같이 옵션이 동적이면 더더욱 raw button 금지.",
      "옵션이 2-3 개의 토글성 선택지면 Tabs / Segment 도 고려 — Select 는 옵션 수가 많거나 라벨이 긴 경우.",
    ],
  },
  Banner: {
    name: "Banner",
    examplesHtml: {
      do: '<nds-banner variant="filled" banner-title="신규 기능 안내"\n  description="이번 주부터 음성 기록을 지원해요"\n  action-label="자세히" action-href="/news/voice" closable></nds-banner>',
      dont: '<!-- variant="image" 일 때 full-image-src 가 아니라 banner-src 로 잘못 명시 -->\n<nds-banner variant="image" banner-src="/hero.jpg" banner-title="…"></nds-banner>\n<!-- description 없이 closable 만 — 닫고 나면 의도가 사라짐 -->\n<nds-banner closable></nds-banner>',
    },
    summary: "페이지 상단 알림 띠. 그라데이션 배경 사용 금지.",
    pitfalls: [
      "Banner의 배경에 linear-gradient 사용하지 말 것. 단색 토큰만 (semantic-info-bg 등).",
    ],
  },
  Input: {
    name: "Input",
    examplesHtml: {
      do: '<nds-input label="이메일" placeholder="example@nudge.kr" clearable></nds-input>\n<script>el.addEventListener("input", e => setValue(e.target.value));</script>',
      dont: '<!-- value 와 default-value 를 동시에 설정 — controlled / uncontrolled 가 섞임 -->\n<nds-input label="이메일" value="a@b" default-value="x@y"></nds-input>\n<!-- raw <input> + className 으로 모양만 흉내 -->\n<input class="nds-input" />',
    },
    summary:
      "1px 보더, 흰 배경, 48px 높이. label/wrapper(field+addon)/helper 의 compound 구조 (Figma Library node 171:9903 기준).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-9903",
    pitfalls: [
      "검색 변형이 필요하면 SearchInput을 사용. Input에 SearchIcon을 직접 박지 말 것.",
      "label/helper 의 typography 는 caption-2(12/16) — body3(14/20) 로 키우지 말 것. Figma 명세보다 크면 폼이 산만해짐.",
      "complete=true 와 errorMessage 를 동시에 주지 말 것 — error 가 우선이지만 success 의도가 묻힘.",
      "errorMessage/successMessage/helperText 중 하나라도 있으면 helpers 배열은 무시됨. 단일/멀티 의도를 분리해서 사용.",
      "**helperText 와 errorMessage 동시 노출 금지** (★ 핵심 룰). DS 는 우선순위 error > success > helper 로 1 줄만 표시하도록 이미 강제하지만, 가이드/스토리/목업에서도 두 줄 동시 표시한 형태로 그리지 말 것. 헬퍼는 '비어 있을 때의 안내', 에러는 '검증 실패 후의 즉시 피드백' — 의미가 충돌하고 인지 부하가 커진다. 검증 실패 순간 helper 는 같은 자리에서 error 메시지로 교체되어야 함 (자리 점프 X, 두 줄 누적 X).",
    ],
    recommended: [
      "기본: <Input label='이메일' placeholder='example@nudge.kr' helperText='...' />",
      "검증 실패: errorMessage 사용 — role='alert' 가 자동 부착됨",
      "검증 성공: complete + successMessage — primary 컬러 헬퍼로 자동 전환",
      "달력/검색 같은 아이콘 affordance: suffix prop (24x24)",
      "Multi-helper(비밀번호 규칙 체크리스트 등): helpers={[{ text, icon?, variant? }, ...]} — 또는 compound <Input.HelperGroup><Input.Helper>…</Input.Helper>…</Input.HelperGroup>",
    ],
    sizeMatrix: {
      default: "height 48 / padding 16·13 / wrapper gap 10 / radius 8",
      field: "height 44 / 같은 토큰, label-gap 8",
      compact:
        "height 40 / padding 12·10 / label-gap 6 — CashwalkBiz admin TextField (Figma 3082:846). FormField.labelPosition='left' 와 짝으로 사용.",
    },
    stateMatrix: {
      default: "border #D8D8D8 / bg white / placeholder #999",
      typing: "border #2B96ED (cv.border.focus) / text #111 (cv.text.normal)",
      error: "border #F13F00 (cv.error.main) / helper color same",
      disabled: "border #D8D8D8 / bg #FAFAFA (cv.bg.light) / text #999",
      complete: "border #D8D8D8 / bg white / helper variant=success(=primary blue)",
    },
    accessibility: [
      "label 은 InputLabel(자동 htmlFor 연결)을 통해 부착 — placeholder 로 대체 금지.",
      "errorMessage 가 있으면 helper 가 role='alert' 로 노출 — 스크린리더가 즉시 안내.",
      "aria-describedby 가 helperId 와 자동 연결됨 (helper 가 있을 때만).",
      "Clear 버튼은 aria-label='입력 삭제' 가 기본 제공 — readOnly/disabled 면 자동 숨김.",
    ],
    interactivePattern:
      "controlled/uncontrolled 모두 지원. clearable + onClear 로 값 초기화 콜백 부착. suffix slot 에 IconButton 등을 넣어도 됨 (단 onClick 핸들러 필수).",
  },
  ProgressBar: {
    name: "ProgressBar",
    examplesHtml: {
      do: '<nds-progress-bar value="65" max="100" size="md" aria-label="작성 65%"></nds-progress-bar>',
      dont: '<!-- 결정적이지 않은 작업(=언제 끝날지 모름)에 진행률 -->\n<nds-progress-bar value="32"></nds-progress-bar> <!-- 차라리 spinner 사용 -->',
    },
    summary: "value/max 기반 진행도.",
    pitfalls: [
      "상태(주의/에러/성공)를 표현할 때는 color prop에 semantic 토큰 var(--semantic-*-main)을 넘겨 시각적 의미를 통일.",
    ],
  },
  Radio: {
    name: "Radio",
    examplesHtml: {
      do: '<form>\n  <nds-radio name="freq" value="daily" label="매일" checked></nds-radio>\n  <nds-radio name="freq" value="weekly" label="주 1회"></nds-radio>\n</form>',
      dont: '<!-- 같은 그룹인데 name 이 서로 다름 — 둘 다 선택 가능해짐 -->\n<nds-radio name="freq-a" value="daily" label="매일"></nds-radio>\n<nds-radio name="freq-b" value="weekly" label="주 1회"></nds-radio>',
    },
    summary:
      "단일 선택 입력. 단독으로 쓸 일은 거의 없고, RadioGroup + RadioGroupItem 조합으로 사용.",
    pitfalls: [
      "Radio를 단독으로 여러 개 두고 same name만 맞추는 패턴은 동기화 버그가 잦음. 무조건 RadioGroup으로 감쌀 것.",
      "RadioGroupItem은 RadioGroupContext 안에서만 동작. throw가 나면 RadioGroup으로 감싸지지 않은 것.",
      "value prop은 string. 숫자/객체 쓸 거면 String(value)로 직렬화하고 onValueChange에서 다시 파싱.",
    ],
    recommended: [
      '<RadioGroup name="freq" value={v} onValueChange={setV}> <RadioGroupItem value="daily" label="매일" /> ... </RadioGroup>',
      'horizontal 옵션 3개 이하일 때만 layout="horizontal". 그 이상이면 vertical이 스캔 쉬움.',
    ],
    interactivePattern:
      "그룹 단위로 onValueChange 한 번만 부착. 개별 Radio에 onCheckedChange 부착하지 말 것.",
  },
  Sidebar: {
    name: "Sidebar",
    examplesHtml: {
      do: '<nds-sidebar active-key="home" width="240"\n  items=\'[{"key":"home","label":"홈","icon":"<svg ...>...</svg>"},{"key":"chat","label":"상담","icon":"<svg ...>...</svg>"}]\'\n  title="NudgeEAP"></nds-sidebar>\n<!-- icon = find_icon({name}) 가 준 inline SVG 문자열을 그대로. 이름("home")을 넣으면 innerHTML 이라 텍스트로 흘러나옴. items 는 JSON 속성이라 SVG의 " 는 \\" 로 이스케이프 -->\n<script>el.addEventListener("item-click", e => navigate(e.detail.key));</script>',
      dont: "<!-- 일반 어드민/CMS(=antd 영역)에서 nds-sidebar 사용 — 일반 어드민은 antd Layout.Sider. -->\n<!-- ★ 단, 캐포비(cashwalk-biz) 어드민은 정반대 — nds-sidebar 가 정답이다 (DS 자체 admin DS). 아래 pitfalls 참고 -->\n<nds-sidebar items='...'></nds-sidebar>",
    },
    summary:
      "어드민/CMS용 좌측 수직 내비게이션. 캐시워크 포 비즈니스(CashwalkBiz) Figma 168:1250 / 290:1593 기준으로 정합. " +
      "flat items 배열 또는 SidebarSection[] (라벨 그룹) 둘 다 지원, 1단계 서브메뉴 + 뱃지 + collapsed(64px) 가능.",
    figmaNodeUrl:
      "https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/%ED%95%9C%EA%B5%AD-%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC_WEB-Dev?node-id=168-1250",
    pitfalls: [
      "**★ 캐포비(cashwalk-biz) 어드민 = nds-sidebar 가 정답.** 일반 브랜드의 어드민/CMS 는 antd Layout.Sider 가 규칙이지만(get_guide({ topic:'admin-cms' })), 캐포비는 DS 안에 자체 admin DS(sidebar 300px · admin 토큰)를 갖고 있어 antd 가 아니라 이 `<nds-sidebar>`(React `<Sidebar>`) 를 쓴다. `intent='admin-cms' + brand='cashwalk-biz'` 면 라우터도 antd 가 아니라 html/DS 로 보낸다. `:root[data-brand='cashwalk-biz']` cascade 로 brand-subtle bg + 노란 indicator 가 자동 적용 — 색 hex 박지 말 것.",
      "items prop 은 flat SidebarItem[] 또는 SidebarSection[] 둘 다 받지만, **섹션 라벨이 필요하면** SidebarSection[] 으로 넘길 것. flat 배열 안에 빈 객체로 'spacer' 만들지 말 것.",
      "활성 상태는 `activeKey` 로만 결정. 각 item 에 isActive 같은 boolean 을 박지 말 것 — controlled 패턴 깨짐.",
      "캐시워크 포 비즈니스 브랜드는 `data-brand='cashwalk-biz'` 가 :root 에 있을 때 자동으로 brand-subtle bg + 노란 indicator 톤. 다른 브랜드는 NudgeEAP 토큰 cascade.",
      '**★ HTML `<nds-sidebar>` 의 item `icon` = inline SVG 문자열 (이름 아님).** `icon` 은 innerHTML 로 주입되므로 `"icon":"home"` 이나 `"icon":"CashwalkBizGnbBannerIcon"` 처럼 **이름/컴포넌트명을 넣으면 그대로 텍스트로 렌더**된다(라벨 옆에 글자). 절차: `find_icon({ name })` → 반환 inline SVG 를 `icon` 에 주입. React `<Sidebar>` 의 `icon?: ReactNode`(엘리먼트)와 대칭일 뿐, **HTML 목업이라 아이콘이 안 된다는 건 사실이 아니다**(런타임 한계 X). `items` 가 JSON 속성이라 SVG 안 `"` 는 `\\"` 로 이스케이프.',
      "GNB 아이콘은 brand-specific 우선 — 자세한 목록은 get_guide({ topic:'component:Sidebar', brand:'<slug>' }).iconSet 또는 get_brand({ brand:'<slug>' }).brandIcons 참조. (이때 얻은 이름을 그대로 HTML icon 에 넣지 말고 find_icon 으로 SVG 를 받아 주입.)",
      "서브메뉴는 1단계까지만 허용 — children 안에 또 children 넣어서 트리화 금지 (트리는 별도 컴포넌트로).",
      "collapsed=true 일 때 라벨/뱃지/캐럿/유저 메타 모두 숨김 — 그래도 의미가 전달되도록 모든 item.label 은 string 으로 두기 (tooltip 자동 부착).",
      "footer 와 user 를 동시에 주면 footer 가 우선. user 는 'avatar + 이름 + 역할' 정형 패턴 단축이라 footer 가 있으면 무시.",
    ],
    recommended: [
      "**캐포비 어드민이면 ready-made 픽업**: items 를 손으로 만들지 말고 `get_guide({ topic: 'pattern:cashwalk-biz-admin-sidebar' })` 의 복붙 트리(React/HTML, 아이콘 inline 완료)를 쓰고 activeKey 만 화면 키로. BrandHeader/Footer 처럼 한 번에 끌어온다.",
      "<Sidebar items={items} activeKey={key} onItemClick={(it) => navigate(it.key)} user={{ name, role }} />",
      "섹션 그룹: items={[{ key: 'content', label: '콘텐츠 운영', items: [...] }, { key: 'system', label: '시스템', items: [...] }]}",
      "icon-only 사이드바: collapsed + onToggleCollapse 페어로 controlled. 토글 버튼은 헤더에 자동 노출.",
      "뱃지: item.badge=12 (숫자) 또는 ReactNode. 빨간 dot 만 보이면 NotificationItem 의 dot 패턴을 참고.",
    ],
    interactivePattern:
      "활성 키 관리는 호스트 라우터에서 결정 (activeKey={location.pathname}). onItemClick 은 navigation 트리거용.",
    accessibility: [
      "활성 아이템에 aria-current='page' 가 자동 부착됨 — 추가로 박지 말 것.",
      "각 item 의 label 이 string 이면 title 도 자동 — collapsed 상태에서 tooltip 역할.",
    ],
  },
  Slider: {
    name: "Slider",
    examplesHtml: {
      do: '<nds-slider value="3" min="0" max="10" start-label="약함" end-label="강함" show-value></nds-slider>\n<script>el.addEventListener("slider-change", e => setLevel(e.detail.value));</script>',
      dont: '<!-- 표시할 단계가 적은데 슬라이더 사용 — segmented 가 맞음 -->\n<nds-slider value="2" min="1" max="3"></nds-slider>',
    },
    summary: "연속값 입력 (통증·스트레스 강도 등). LikertScale은 고정 N단계, Slider는 연속.",
    pitfalls: [
      "5단계 같은 이산형 평가는 LikertScale을 쓸 것. Slider step=1 max=4로 흉내내지 말 것 — 시각적 의미가 다름.",
      "showValue=false인데 startLabel/endLabel만 있으면 사용자가 현재 값을 알 수 없음. 한쪽은 무조건 표시.",
      "max-min 범위가 너무 크면 한 칸 차이가 시각적으로 안 보임. step을 sensible 단위(5/10)로.",
    ],
    recommended: [
      '통증 강도: min=0 max=10 step=1 startLabel="없음" endLabel="극심" showValue',
      "스트레스 %: min=0 max=100 step=5 showValue formatValue={(v) => `${v}%`}",
    ],
  },
  Spinner: {
    name: "Spinner",
    examplesHtml: {
      do: '<nds-button disabled>\n  <nds-spinner size="sm" label="처리 중"></nds-spinner> 처리 중…\n</nds-button>\n<nds-spinner size="md" aria-label="목록 불러오는 중"></nds-spinner>',
      dont: '<!-- label/aria-label 둘 다 없는 단독 스피너 — 스크린리더에 안내가 없음 -->\n<nds-spinner size="md"></nds-spinner>',
    },
    summary: "인라인 회전 로더. 짧은 fetch (<2s)에 사용. 긴 로딩은 Skeleton.",
    pitfalls: [
      "전체 페이지 로딩에 Spinner를 가운데 띄우지 말 것 — 빈 화면 인상이 강함. Skeleton(레이아웃 유지)이 UX 더 좋음.",
      '버튼 내부에 넣을 때는 size="sm", color={cv.primary.fg} 등 컨텍스트 색에 맞춰 oversiede.',
      'label prop은 스크린리더용 ("로딩 중"이 기본). 무음 처리 금지.',
    ],
    recommended: [
      '<Button disabled><Spinner size="sm" color="currentColor" /> 처리 중...</Button>',
      '리스트 끝 무한스크롤: <Spinner size="md" />',
    ],
  },
  MoodSelector: {
    name: "MoodSelector",
    examplesHtml: {
      do: '<nds-mood-selector value="calm" name="today-mood"></nds-mood-selector>',
      dont: "<!-- 5개 nds-icon-button 으로 직접 조립 — 단일 선택/포커스 룰 모두 손실 -->\n<nds-icon-button>😀</nds-icon-button><nds-icon-button>😐</nds-icon-button>…",
    },
    summary: "5단계 기분 선택. EAP 앱 첫 화면 핵심 인터랙션. 기본 5개 옵션이 내장됨.",
    pitfalls: [
      "options를 직접 넘길 때 5개를 벗어나면 가로 폭 문제 — 4-6개가 권장 범위.",
      "이모지 대신 아이콘 컴포넌트를 emoji 자리에 넘기지 말 것. emoji는 string 필드.",
      "value 미선택 상태가 default이므로 폼 제출 전 검증 필수.",
    ],
    recommended: [
      "기본: <MoodSelector value={mood} onValueChange={setMood} /> (5단계 자동)",
      "showLabels=false로 컴팩트하게 (좁은 카드 안)",
    ],
    interactivePattern:
      "기록 후 다음 단계(메모/저장)로 이어주는 게 자연스러움. 선택 직후 토스트만 띄우고 끝내지 말 것.",
  },
  AssessmentResultCard: {
    name: "AssessmentResultCard",
    examplesHtml: {
      do: '<nds-assessment-result-card title="우울감 자가검사 결과"\n  score="12" max-score="27" level="caution" level-text="중간 수준"\n  description="가벼운 우울감을 보일 수 있어요"></nds-assessment-result-card>',
      dont: '<!-- level 만 있고 level-text/description 누락 — 사용자에게 의미가 전달되지 않음 -->\n<nds-assessment-result-card score="12" max-score="27" level="caution"></nds-assessment-result-card>',
    },
    summary:
      "심리검사 결과 카드. score/maxScore + level(normal/mild/moderate/severe) + 색 자동 매핑.",
    pitfalls: [
      "level과 점수를 임의로 분리하지 말 것 — 외부에서 점수 → 단계 매핑이 검사마다 다르므로 호출부에서 결정해서 넘김.",
      'title prop은 검사명("PHQ-9" 등). HTMLDivElement.title과 충돌 방지를 위해 Omit되어 있으니 ReactNode 가능.',
      'severe인데 description만 있고 후속 액션이 없으면 안전. severe 결과엔 actionLabel("상담 연결") 또는 옆에 CrisisCallout을 같이 둘 것.',
      "❌ **좌측 컬러 보더(border-left) 디자인 절대 금지** — 한때 단계별 색을 좌측 라인으로도 강조했으나 카드 형태가 어그러지고, 스크롤 리스트에서 시각 잡음이 누적되어 폐기. 단계 색은 배지·점수 텍스트·게이지·액션 으로만 전달. 시안에 좌측 라인이 있어도 컴포넌트에 다시 넣지 말 것.",
      "❌ severe 위급도를 보더 두께/색으로 표시 금지 — 배경 톤(surface.statusError) + 점수/배지/액션 색으로만 강조.",
    ],
    colorMatrix: {
      normal: "success.bg + success.main — 정상",
      mild: "caution.bg + caution.text — 주의",
      moderate: "caution.bg + caution.text — 경계 (mild보다 진한 텍스트로 톤 차이)",
      severe: "error.bg + error.main — 심각",
    },
    interactivePattern:
      "actionLabel 클릭은 결과 상세 또는 다음 액션(상담 예약)으로. severe면 CrisisCallout과 묶어서 같이 노출.",
  },
  CrisisCallout: {
    name: "CrisisCallout",
    examplesHtml: {
      do: '<nds-crisis-callout tone="error" title="위기 상황이세요?"\n  description="언제든 1577-0199 로 전화하실 수 있어요"></nds-crisis-callout>',
      dont: '<!-- crisis-callout 을 마케팅/홍보 톤에 사용 — 강한 시그널이 오염됨 -->\n<nds-crisis-callout tone="info" title="신규 이벤트" description="…"></nds-crisis-callout>',
    },
    summary: "위기 신호 시 1393/119 등 즉시 연결 박스. dismiss 불가능. EAP의 안전 책임 영역.",
    pitfalls: [
      "Banner와 외형이 비슷하지만 절대 closable 만들지 말 것 — 위기 안내는 dismiss 되면 안 됨.",
      'tone="caution"은 "잠시 휴식이 필요해요" 수준에만. 자살 사고 등 실제 위기는 무조건 tone="danger".',
      "phoneNumber 제공 시 자동으로 tel: 링크 — 모바일에서 바로 통화. 데스크톱에서도 동작은 OS 핸들러가 받음.",
      "CrisisCallout 단독으로 화면 어딘가에 두지 말고, severe 결과 옆/혹은 채팅 화면 상단에 배치.",
    ],
    recommended: [
      'tone="danger" + actions=[{ label: "1393 자살예방상담", phoneNumber: "1393" }, { label: "119 응급", phoneNumber: "119", variant: "outlined" }]',
    ],
  },
  CounselorCard: {
    name: "CounselorCard",
    examplesHtml: {
      do: '<nds-counselor-card name="이정민 상담사" job-title="심리 상담사"\n  image-src="/dr.jpg" rating="4.8" review-count="124"\n  tags=\'["불안","번아웃"]\' cta-label="상담 신청"></nds-counselor-card>\n<script>el.addEventListener("nds-counselor-cta", () => navigate("/apply"));</script>',
      dont: '<!-- rating 6 (max 5 초과) — 표시 깨짐 -->\n<nds-counselor-card name="A" rating="6"></nds-counselor-card>',
    },
    summary: "상담사 프로필 카드. 이름/자격/평점/태그/소개/예약 CTA. 1-2열 그리드에 잘 어울림.",
    pitfalls: [
      "imageSrc 없을 때 자동으로 이름 이니셜 표기. 빈 div를 imageSrc로 우회하지 말 것.",
      'tags는 5개 이하 권장 (그 이상은 시각 잡음). 정말 많이 보여줘야 하면 "+3" 더보기 패턴.',
      "ctaLabel 누르면 stopPropagation 자동 — onCardClick과 별개로 동작. 둘 다 부착해도 안전.",
      "bio는 -webkit-line-clamp 2로 자동 잘림. 더 긴 본문은 상세 페이지로.",
    ],
    interactivePattern:
      "리스트 화면에서는 카드 전체 클릭 → 상세, CTA(예약)는 상세 안에서. 두 액션을 한 화면에서 동시에 두면 사용자가 헷갈림.",
  },
  ChatBubble: {
    name: "ChatBubble",
    examplesHtml: {
      do: '<nds-chat-bubble role="assistant" name="상담사" time="오후 2:31"\n  message="요즘 잠은 어떠세요?"></nds-chat-bubble>\n<nds-chat-bubble role="user" group time="오후 2:32" message="잘 못 자고 있어요"></nds-chat-bubble>',
      dont: '<!-- raw <div class="bubble"> 로 시각만 흉내 — 좌/우 정렬/꼬리/그룹 룰이 사라짐 -->\n<div class="bubble user">잘 못 자고 있어요</div>',
    },
    summary: "1:1 상담/챗봇 말풍선. role=me|them, group으로 코너 정리.",
    pitfalls: [
      "group prop을 안 넘기면 매 메시지가 둥근 모서리로 떠서 그룹감이 없음. 같은 발신자 연속 메시지면 first/middle/last 명시.",
      'them 측 avatar는 group="single"|"last" 일 때만 보이고, first/middle은 visibility:hidden으로 자리만 차지 — 정렬 어긋나지 않음. 직접 avatar를 끄지 말 것.',
      "time과 read는 메시지 끝(single/last)에만 노출. 모든 메시지에 시간 박지 말 것.",
      "텍스트 외 이미지/카드 첨부는 children에 직접 ReactNode 넘김. 별도 prop 없음.",
    ],
    recommended: [
      "group: 단독 single, 첫 메시지 first, 중간 middle, 마지막 last",
      "긴 대화 화면은 list virtualization 권장 (DS는 단순 렌더만 제공)",
    ],
  },
  ConsentChecklist: {
    name: "ConsentChecklist",
    examplesHtml: {
      do: '<nds-consent-checklist\n  items=\'[\n    {"key":"terms","label":"이용약관 동의","required":true},\n    {"key":"privacy","label":"개인정보 처리방침","required":true},\n    {"key":"marketing","label":"마케팅 정보 수신 (선택)"}\n  ]\'\n  all-label="전체 동의"></nds-consent-checklist>\n<script>el.addEventListener("nds-consent-change", e => setConsent(e.detail.value));</script>',
      dont: '<!-- 개별 nds-checkbox 여러 개로 흉내 — 전체 동의 / required 가드 사라짐 -->\n<nds-checkbox label="약관 동의" required></nds-checkbox>\n<nds-checkbox label="개인정보 동의" required></nds-checkbox>',
    },
    summary: "전체동의 + 항목별 체크 + 펼치기. 회원가입/민감정보 동의에 표준화.",
    pitfalls: [
      "items[].required=true인데 체크 안 됐을 때의 검증은 호출부 책임. 컴포넌트 자체에서 막지 않음.",
      'detail이 길면 펼친 영역이 화면을 덮음 — 본문은 핵심만, 전문은 "전문 보기" 링크로.',
      '전체동의 토글 동작이 직관적이어야 함: 부분 체크 상태에서 누르면 "전체 체크"가 아니라 "전체 해제"로 가는 사례가 있는데, 이 컴포넌트는 "모두 체크면 해제, 아니면 전체 체크".',
    ],
    interactivePattern:
      "필수만 자동체크 후 사용자가 선택만 토글하는 흐름이 회원가입 컨버전에 유리.",
  },
  ScoreGauge: {
    name: "ScoreGauge",
    examplesHtml: {
      do: '<nds-score-gauge value="22" max="27"\n  segments=\'[\n    {"level":"normal","label":"정상","from":0,"to":9},\n    {"level":"mild","label":"경미","from":10,"to":18},\n    {"level":"moderate","label":"중간","from":19,"to":27}\n  ]\'\n  show-label show-legend value-suffix="점"></nds-score-gauge>',
      dont: '<!-- segments 의 level 이 정의된 enum 외 값 — 색이 fallback -->\n<nds-score-gauge value="5" segments=\'[{"level":"good","from":0,"to":10}]\'></nds-score-gauge>',
    },
    summary: "점수 시각화 (반원 게이지). 4단계(normal/mild/moderate/severe) 색 자동 매핑.",
    pitfalls: [
      "단계 경계는 검사마다 다름. segments prop으로 직접 넘겨 결과 해석을 통일.",
      "needle은 transform: rotate로 회전. CSS transform 충돌 환경(예: 부모 transform)에선 어긋날 수 있어 wrapper 별도 권장.",
      "showLegend는 4개라 모바일 가로폭 부족하면 줄 바뀜 — 카드 안에선 false 권장.",
      'max를 점수 합과 동일하게 — "100 만점"으로 정규화하지 말 것 (해석 매트릭스가 어긋남).',
    ],
    recommended: [
      'PHQ-9: <ScoreGauge value={score} max={27} segments={[{level:"normal",label:"정상",from:0,to:5}, {level:"mild",label:"경증",from:5,to:10}, ...]} />',
    ],
  },
  MedicationItem: {
    name: "MedicationItem",
    examplesHtml: {
      do: '<nds-medication-item med-name="우울증 약" dosage="50mg"\n  times=\'[{"time":"08:00"},{"time":"20:00"}]\'\n  note="식후 복용" show-check></nds-medication-item>\n<script>el.addEventListener("nds-medication-taken-change", e => save(e.detail));</script>',
      dont: '<!-- 복용량/시간 정보 누락 — 환자에게 핵심 정보가 빠짐 -->\n<nds-medication-item med-name="약"></nds-medication-item>',
    },
    summary: "복용약 한 줄 표시. 이름/용량/시기/노트 + 체크.",
    pitfalls: [
      "리스트로 쌓을 때는 부모에 gap 8-12px. MedicationItem은 자체 margin 없음.",
      "onTakenChange를 안 넘기면 체크박스가 안 보임 — 표시 전용으로 쓸 수 있음.",
      'times는 morning/noon/evening/bedtime 4개 enum만. 복약 시간을 분 단위로 보여주려면 note에 "식후 30분" 같이 텍스트로.',
    ],
    interactivePattern:
      '체크 후 즉시 토스트보다 리스트 상단에 "오늘 X/Y 복용 완료" 진행도 ProgressBar 표시가 더 동기 부여됨.',
  },
  AudioPlayer: {
    name: "AudioPlayer",
    examplesHtml: {
      do: '<nds-audio-player title="3분 호흡 명상" subtitle="저녁용" duration="180"></nds-audio-player>\n<script>el.addEventListener("audio-play", play);</script>',
      dont: '<!-- raw <audio controls> -> DS 스킨 / 진행도 라벨이 적용 안 됨 -->\n<audio controls src="/m.mp3"></audio>',
    },
    summary: "명상/이완 가이드 플레이어. 재생/일시정지/시크/이전/다음.",
    pitfalls: [
      "playing/currentTime/duration은 외부 상태 — useState + audio ref + timeupdate 이벤트로 동기화. DS는 UI만 제공.",
      "onSeek 미제공이면 슬라이더가 disabled. 시크 막을 거면 명시적으로.",
      "title prop도 HTMLDivElement.title과 충돌하지 않도록 Omit됨. ReactNode 가능.",
      "onSkipBack/Forward는 옵셔널 — 단일 트랙이면 둘 다 생략하면 표시 안 됨.",
    ],
    recommended: ["10분 미만 단일 가이드: SkipBack/Forward 생략. 시리즈 재생만 둘 다 부착."],
  },
  ActivityTimeline: {
    name: "ActivityTimeline",
    examplesHtml: {
      do: '<nds-activity-timeline items=\'[\n  {"key":"1","date":"2026.05.25","title":"상담 예약 완료","status":"completed"},\n  {"key":"2","date":"2026.05.28","title":"자가검사","status":"ongoing","statusLabel":"진행 중"}\n]\'></nds-activity-timeline>',
      dont: '<!-- 자식 element 를 직접 쓰면 nds-timeline 사용 (이 가이드는 flat items API) -->\n<nds-activity-timeline>\n  <nds-timeline-item title="…"></nds-timeline-item>\n</nds-activity-timeline>',
    },
    summary: "상담/검사 이력 타임라인. dot + line + 날짜/제목/상태 배지.",
    pitfalls: [
      "마지막 항목의 line은 자동으로 안 그려짐(:last-child). 중간에 splice해서 추가/삭제할 때 key 유지 잘 할 것.",
      'status="ongoing"는 box-shadow ring 효과 — 한 화면에 여럿 두면 시각 잡음. 보통 1개만.',
      "statusLabel 없이 status만 주면 dot 색만 바뀌고 우측 배지는 안 뜸. 둘 다 필요.",
      "items 길이가 20+ 넘으면 페이지네이션 또는 가상화 권장.",
    ],
    interactivePattern:
      "각 아이템을 클릭 가능하게 하려면 description 자리에 작은 TextButton/Link를 넣는 패턴 — 행 전체 onClick은 우발 클릭 위험.",
  },
  OtpInput: {
    name: "OtpInput",
    examplesHtml: {
      do: '<nds-otp-input length="6" auto-focus></nds-otp-input>\n<script>el.addEventListener("otp-complete", e => verify(e.detail.value));</script>',
      dont: '<!-- raw <input> 6개로 OTP 흉내 — 자동 포커스 이동/붙여넣기/접근성 모두 손실 -->\n<input maxlength="1"/><input maxlength="1"/>…',
    },
    summary: "N자리 인증코드 입력. 자동 포커스 이동, 붙여넣기 분배, 숫자 전용.",
    pitfalls: [
      "value는 string. length만큼 채워지면 onComplete 발화 — 그 안에서 자동 제출 처리하면 사용자 경험 좋음.",
      'autoComplete="one-time-code"가 첫 셀에만 붙음 — iOS/Android에서 SMS 자동 추출이 동작하려면 첫 셀만이어야 함.',
      "입력은 숫자만 허용 (영문/특수문자 자동 필터링). 영숫자 OTP가 필요하면 별도 컴포넌트 필요.",
      "Backspace는 두 단계 동작: 현재 셀에 값 있으면 비우고, 비어있으면 이전 셀로 포커스 이동 + 비움.",
    ],
    recommended: [
      "회원가입/로그인 SMS 인증: length=6, autoFocus, onComplete로 자동 검증 호출",
      "에러 시 error prop + Toast 같이 띄우기. 자동 clear는 사용자 혼란 유발 — 호출부에서 결정.",
    ],
    interactivePattern:
      "인증 실패 시 자동 clear는 옵션 — 어떤 자리가 틀렸는지 모르므로 보통 통째 clear가 안전.",
  },
  FileUpload: {
    name: "FileUpload",
    examplesHtml: {
      do: '<nds-file-upload accept=".pdf,.jpg,.png" max-size="5242880"\n  description="PDF, JPG, PNG · 5MB 이하"></nds-file-upload>\n<script>\nel.addEventListener("files-change", e => upload(e.detail.files));\nel.addEventListener("files-reject", e => alert(e.detail.reason));\n</script>',
      dont: '<!-- max-size 를 MB 단위로 입력 — bytes 가 정답 (5242880 = 5MB) -->\n<nds-file-upload max-size="5"></nds-file-upload>',
    },
    summary: "Drag&drop + 클릭 업로드. multiple/accept/maxSize 지원. 제어 컴포넌트.",
    pitfalls: [
      "value가 File[] 제어 컴포넌트 — 내부 상태 안 가짐. 부모에서 useState로 관리.",
      'onValueChange는 "성공" 파일만, onReject는 거부된 파일 — 둘이 분리되어 있음. 같이 다루지 말 것.',
      "maxSize는 bytes 단위 (10MB = 10 * 1024 * 1024). MB로 착각하지 말 것.",
      "accept는 브라우저 힌트일 뿐이라 실제로는 다른 파일도 들어올 수 있음 — 서버에서 한 번 더 검증 필요.",
      "multiple=false에서 두 번째 파일을 드롭하면 첫 번째를 덮어씀(slice(0, 1)). 추가 누적 X.",
    ],
    recommended: [
      '프로필 이미지: accept="image/*", maxSize=5MB, multiple=false',
      '진단서 첨부: accept=".pdf,.jpg,.png", maxSize=10MB, multiple',
      "errorMessage prop으로 거부 사유 지속 표시 (Toast 한 번 띄우는 것보다 명확)",
    ],
  },
  DateRangePicker: {
    name: "DateRangePicker",
    examplesHtml: {
      do: '<nds-date-range-picker from="2026-05-01" to="2026-05-31"\n  presets=\'[{"label":"최근 7일","days":7},{"label":"이번 달","days":30}]\'></nds-date-range-picker>\n<script>el.addEventListener("nds-date-range-change", e => apply(e.detail));</script>',
      dont: '<!-- to < from — 의미 없는 범위. min-date / max-date 로 가드 권장 -->\n<nds-date-range-picker from="2026-05-31" to="2026-05-01"></nds-date-range-picker>',
    },
    summary: "시작/끝 날짜 한 쌍 선택. DatePicker 두 개 + 빠른 프리셋(최근 7일 등).",
    pitfalls: [
      "value는 { from?, to? } — 부분 선택 가능 (시작만 있을 수 있음). 폼 검증 시 둘 다 있는지 체크.",
      "끝일은 자동으로 minDate=시작일 — 시작일을 뒤로 옮기면 끝일이 자동으로 비워짐(value.to>from 체크).",
      "프리셋은 defaultRangePresets로 빠른 것 3개 제공 (7일/30일/이번 달). 검사·리포트마다 다른 기본값이 필요하면 직접 정의.",
      'presets[].range는 함수 — 호출 시점의 "오늘"을 기준으로 계산하기 위함. 객체 리터럴로 박지 말 것.',
    ],
    recommended: [
      "리포트 기간 필터: defaultRangePresets 그대로 사용",
      '검사 이력 검색: maxDate=오늘, presets에 "전체" 추가',
    ],
  },
  Calendar: {
    name: "Calendar",
    examplesHtml: {
      do: '<nds-calendar value="2026-05-25" markers=\'[{"date":"2026-05-25","color":"red"}]\'></nds-calendar>\n<script>el.addEventListener("nds-calendar-change", e => setDate(e.detail.value));</script>',
      dont: '<!-- month / value 형식 위반 (YYYY-MM, YYYY-MM-DD 필수) -->\n<nds-calendar value="2026/5/25"></nds-calendar>',
    },
    summary:
      "인라인 월간 캘린더 그리드. DatePicker(popover 입력)와 다르게 화면에 펼쳐져 있는 콘텐츠형 캘린더.",
    pitfalls: [
      "폼 안에서 날짜 한 개 입력받는 용도면 DatePicker를 쓸 것. Calendar는 캘린더 자체가 콘텐츠인 화면용.",
      "value/onChange는 ISO 문자열(YYYY-MM-DD). Date 객체로 비교하지 말 것 — 시간대 이슈 발생.",
      "markers는 dot만 표시. 라벨/시간 등 풍부한 정보가 필요하면 캘린더 아래에 별도 List/Card로 표현.",
      "month prop을 주면 controlled로 동작하고 onMonthChange로만 월이 바뀜. 안 주면 내부 state.",
    ],
    recommended: [
      "예약 화면: isDateDisabled로 과거/예약 불가 날짜 차단",
      "감정 캘린더: markers에 색상으로 mood 단계 매핑",
      "복약 캘린더: markers + 클릭 시 BottomSheet로 상세",
    ],
    interactivePattern:
      "onChange(iso)로 선택을 받고, 외부에서 그 날짜에 해당하는 List/Card를 갱신. weekStartsOn=1로 월요일 시작도 가능.",
  },
  Carousel: {
    name: "Carousel",
    examplesHtml: {
      do: '<nds-carousel autoplay="3000" indicator="dots" loop>\n  <img src="/banner1.jpg" alt="" />\n  <img src="/banner2.jpg" alt="" />\n</nds-carousel>',
      dont: '<!-- 슬라이드가 1장인데 loop + autoplay — 같은 이미지가 깜빡임 -->\n<nds-carousel autoplay="3000" loop><img src="/only.jpg" /></nds-carousel>',
    },
    summary:
      "가로 스와이프 슬라이더. 홈 배너, 콘텐츠 추천, 온보딩에 사용. drag/dots/autoplay/loop 내장.",
    pitfalls: [
      "정보 위계가 동등한 항목 N개를 보여주는 용도라면 캐러셀 대신 가로 스크롤 리스트가 더 나음 — 캐러셀은 한 번에 1개만 보임.",
      "autoplay만 켜고 loop를 안 켜면 마지막 슬라이드에서 멈춤. 둘 다 함께 사용.",
      "슬라이드 1-2장이면 캐러셀 의미 없음. 그냥 카드/배너로.",
      "슬라이드 안에 자체 가로 스크롤(예: 가로 리스트)을 넣으면 드래그 충돌. 세로 스크롤만 허용.",
    ],
    recommended: [
      "홈 배너: <Carousel autoplay={3000} loop indicator='dots'>",
      "이미지 갤러리: indicator='counter' (현재 N/M 표시)",
      "온보딩 3-5장: showArrows=false, indicator='dots'",
    ],
    interactivePattern:
      "activeIndex/onActiveIndexChange로 외부 동기화 가능. 드래그 임계값은 viewport 폭의 15%.",
  },
  VideoPlayer: {
    name: "VideoPlayer",
    examplesHtml: {
      do: '<nds-video-player src="/intro.mp4" poster="/cover.jpg"\n  title="첫 회기 안내" duration-label="3:42" muted></nds-video-player>',
      dont: '<!-- aspect-ratio 형식 위반 (CSS aspect-ratio 형식: "16 / 9") -->\n<nds-video-player src="/v.mp4" aspect-ratio="16:9"></nds-video-player>',
    },
    summary: "HTML5 video 래퍼. 포스터/제목/길이 오버레이 + 커스텀 재생 UI 또는 nativeControls.",
    pitfalls: [
      "autoPlay는 muted=true와 함께가 아니면 브라우저가 차단. autoPlay만 단독으로 켜지 말 것.",
      "유튜브/비메오 embed 용도가 아님 — src는 mp4/webm 같은 호스팅된 영상.",
      "라이브 스트리밍/HLS는 미지원. HLS.js 등 별도 라이브러리를 video DOM에 부착하는 패턴 필요.",
      "nativeControls=true로 두면 커스텀 오버레이는 무시됨. 둘 중 하나만.",
    ],
    recommended: [
      "명상 영상: <VideoPlayer src=... poster=... title='아침 명상' durationLabel='5:30' />",
      "스토리 형식: aspectRatio='9 / 16'",
      "자동 반복 미리보기: autoPlay muted loop",
    ],
  },
  NumberStepper: {
    name: "NumberStepper",
    examplesHtml: {
      do: '<nds-number-stepper value="1" min="1" max="9" step="1" unit="명"></nds-number-stepper>\n<script>el.addEventListener("number-change", e => setQty(e.detail.value));</script>',
      dont: '<!-- 자유 입력을 nds-input 으로 받고 stepper 흉내 — 범위/단위 룰이 빠짐 -->\n<nds-input type="number" />',
    },
    summary:
      "수량 조절 +/- 버튼 입력. Stepper(과정 인디케이터)와 이름은 비슷하지만 전혀 다른 용도.",
    pitfalls: [
      "Stepper(StepperVariant: numbered/dots)와 혼동 금지. 그건 회원가입 단계 같은 '진행도 표시'.",
      "큰 범위(100+) 입력에는 부적합. tap/click을 N번 해야 하므로 Input type='number'를 쓸 것.",
      "min/max 도달 시 해당 버튼이 자동 비활성. 외부에서 또 비활성 처리할 필요 없음.",
    ],
    recommended: [
      "복약 횟수: min=1 max=10 unit='회'",
      "장바구니 수량: min=1 max=99 editable",
      "알림 빈도: step=5 unit='분'",
    ],
    interactivePattern: "value/onValueChange는 controlled 강제. 내부 state 없음 — 부모에서 관리.",
  },
  Autocomplete: {
    name: "Autocomplete",
    examplesHtml: {
      do: '<nds-autocomplete placeholder="회사 검색"\n  options=\'[{"value":"1","label":"카카오"},{"value":"2","label":"네이버"}]\'\n  min-query-length="1" highlight></nds-autocomplete>\n<script>el.addEventListener("autocomplete-select", e => pick(e.detail.value));</script>',
      dont: "<!-- options 를 단일 따옴표 없이 JSON.stringify 결과 그대로 — 따옴표 escape 가 깨짐 -->\n<nds-autocomplete options=\"[{value:'1',label:'A'}]\"></nds-autocomplete>",
    },
    summary:
      "입력 + 드롭다운 추천. SearchInput(자유 검색)과 Select(고정 목록)의 중간. 키보드 ↓↑/Enter/Esc 내장.",
    pitfalls: [
      "options는 외부에서 필터링해 전달 — 컴포넌트가 자동 필터링하지 않음 (서버 검색을 위한 의도적 설계).",
      "onSelect 후 onValueChange(label)이 자동 호출됨. value를 다시 set하지 말 것 (이중 호출).",
      "minQueryLength=0으로 두면 빈 입력에서도 드롭다운이 열림. 추천 노출이 의도가 아니면 1+ 권장.",
      "options 수가 매우 많으면(50+) 가상 스크롤 별도 필요. 컴포넌트는 max-height 280px + scroll만 제공.",
    ],
    recommended: [
      "약 검색: useMemo로 클라이언트 필터, description에 성분/용량",
      "센터 검색: minQueryLength=2, 비동기 fetch + loading=isFetching",
      "키워드 자동완성: highlight=true (기본), 결과 없을 때 emptyMessage 커스텀",
    ],
  },
  SelectionCard: {
    name: "SelectionCard",
    examplesHtml: {
      do: '<nds-selection-card mode="single" value="chat">\n  <nds-selection-card-item value="chat" item-title="채팅 상담" description="텍스트로 편하게"></nds-selection-card-item>\n  <nds-selection-card-item value="video" item-title="영상 상담" description="얼굴 보며 깊이 있게"></nds-selection-card-item>\n</nds-selection-card>\n<script>el.addEventListener("nds-selection-change", e => setMode(e.detail.value));</script>',
      dont: '<!-- mode=\'multiple\' 인데 value 속성 사용 — values (배열) 사용 -->\n<nds-selection-card mode="multiple" value="chat">…</nds-selection-card>',
    },
    summary: "카드형 단일/다중 선택지 (RadioCard/CheckboxCard 통합). compound — Group + Item.",
    pitfalls: [
      "라벨만 있는 단순 선택은 Radio/Checkbox를 쓸 것 — SelectionCard는 카드 단위(타이틀+설명+아이콘) 전제.",
      "mode='single'에서는 value/onValueChange, mode='multiple'에서는 values/onValuesChange. 헷갈리지 말 것.",
      "옵션이 5개 이상이면서 라벨이 짧다면 Chip 토글 그룹이 더 컴팩트.",
      "horizontal 레이아웃은 옵션 3개 이하일 때만. 그 이상은 wrap돼서 어색해짐.",
    ],
    recommended: [
      "상담 방식 선택: <SelectionCard.Group mode='single'> <Item value='chat' title='채팅' description='...' />",
      "관심사 다중: mode='multiple', 카드마다 description으로 의미 보강",
      "플랜 선택: icon prop으로 좌측 일러스트, title/description으로 가격/혜택",
    ],
    interactivePattern:
      "Group의 onValueChange/onValuesChange로만 상태 관리. Item에 onClick 부착 금지(라벨이 input을 토글).",
  },
  Snackbar: {
    name: "Snackbar",
    examplesHtml: {
      do: '<nds-snackbar variant="success" snackbar-title="저장 완료"\n  action-label="되돌리기" duration="4000" open></nds-snackbar>\n<script>bar.addEventListener("snackbar-action", undo);</script>',
      dont: '<!-- 단순 알림에 위계 강한 Modal 사용 — 흐름을 끊음 -->\n<nds-modal open title="저장 완료"></nds-modal>',
    },
    summary:
      "inline 알림. 액션(되돌리기) / 닫기 버튼 / 시맨틱 variant 지원. Toast(자동 사라짐)와 분리된 컴포넌트.",
    pitfalls: [
      "임시 메시지(저장됨/복사됨)에 Snackbar를 길게 띄우지 말 것 — Toast가 더 적합.",
      "액션이 두 개 이상 필요하면 Snackbar 대신 Modal/Popup을 검토.",
      "variant 미지정 시 검은 배경. 페이지가 흰 배경일 때 가장 강조되며, 시맨틱 톤이 필요하면 variant 사용.",
      "title 없이 description만 사용하지 말 것 — 시맨틱 의미가 무너짐.",
    ],
    recommended: [
      "되돌리기: <Snackbar title='삭제됐어요' actionLabel='되돌리기' onAction={undo} />",
      "에러 + 재시도: variant='error' actionLabel='다시 시도'",
      "사용자가 닫을 때까지 유지: closable + onClose",
    ],
    interactivePattern:
      "Snackbar는 자체 visibility를 관리하지 않음 — 부모가 mount/unmount로 표시 여부 통제.",
  },
  FAB: {
    name: "FAB",
    examplesHtml: {
      do: '<nds-fab icon="plus" label="기록 추가" color="primary" position="bottom-right"></nds-fab>',
      dont: '<!-- 화면에 FAB 와 primary nds-button 양쪽 — 대표 액션이 둘이 됨 -->\n<nds-button color="primary">기록 추가</nds-button>\n<nds-fab icon="plus" label="기록 추가"></nds-fab>',
    },
    summary:
      "Floating Action Button. 화면 하단에 떠 있는 가장 중요한 단일 액션. position 기본 bottom-right (fixed).",
    pitfalls: [
      "한 화면에 FAB는 1개만. 2개 이상 두면 위계 붕괴.",
      "StickyBottom CTA가 있는 화면에는 FAB를 두지 말 것 — 두 요소가 겹쳐서 안전 영역이 무너짐.",
      "position='bottom-right' 등은 position: fixed로 동작. Storybook/테스트에서는 static + 부모에서 fixed 처리.",
      "label 없이 아이콘만 쓰면 aria-label 필수. 누락 시 스크린리더 접근성 깨짐.",
      "offset 기본 16px — 모바일 하단바(56px)와 겹치면 offset={80} 등으로 보정.",
    ],
    recommended: [
      "일기 화면 새 글 작성: <FAB icon={<EditIcon/>} label='새 글' position='bottom-right' />",
      "감정 캘린더 빠른 기록: <FAB icon={<PlusIcon/>} aria-label='기록 추가' />",
      "하단바 있는 화면: offset={72}",
    ],
  },
  BreathingGuide: {
    name: "BreathingGuide",
    examplesHtml: {
      do: '<nds-breathing-guide cycles="5" auto-start></nds-breathing-guide>',
      dont: '<!-- raw CSS @keyframes 로 호흡 시각만 흉내 — 카운트/단계 음성이 없음 -->\n<div class="breath-anim"></div>',
    },
    summary:
      "호흡 가이드 애니메이션. 원이 커지고 작아지면서 들숨/멈춤/날숨/쉼을 시각화. phases로 사이클 자유 정의.",
    pitfalls: [
      "cycles 미지정 시 무한 반복. 콘텐츠 종료를 원하면 cycles + onComplete 페어 사용.",
      "phases의 seconds는 정수만(타이머 1초 단위). 분 단위 호흡은 의도적으로 미지원.",
      "외부에서 playing prop 줄 때 onPlayingChange를 빼먹으면 내부 시작/정지 버튼이 동작 안 함.",
      "CrisisCallout 위에 즉시 노출하면 압박감을 줄 수 있음. 위기 상황 → 안내 후 별도 화면에서 시작 권장.",
    ],
    recommended: [
      "박스 호흡(기본): <BreathingGuide />",
      "수면 유도: phases=[{inhale:4},{hold:7},{exhale:8}]",
      "콘텐츠 카드: cycles=3, autoStart, onComplete로 다음 단계",
    ],
  },
  StreakCard: {
    name: "StreakCard",
    examplesHtml: {
      do: '<nds-streak-card title="연속 기록" streak="15" unit="일" days="30">\n  <svg slot="icon" viewBox="0 0 24 24">…</svg>\n</nds-streak-card>',
      dont: '<!-- streak 만 있고 단위(unit)/총합(days) 누락 — 진행도가 모호 -->\n<nds-streak-card streak="15"></nds-streak-card>',
    },
    summary: "연속 기록 트래커 카드. streak 숫자 + 최근 7-14일 점 그리드. 챌린지/습관 강화 화면.",
    pitfalls: [
      "days는 최근 7-14일이 시각적으로 적절. 30일 이상이면 EmotionHeatmap 사용 검토.",
      "streak=0 상태로 풀 너비 카드를 노출하면 동기 부여 효과가 약함 — 시작 단계에는 더 작은 EmptyState 안내가 좋음.",
      "오늘 데이터가 미완료일 때는 자동으로 점선 테두리(today)로 표시. 'today' 표시를 직접 만들지 말 것.",
    ],
    recommended: [
      "감정 기록 7일: days=[{date,label:'일',done}, ...] 7개",
      "복약 트래킹: icon prop 에는 @nudge-design/icons 컴포넌트(예: PillIcon — find_icon('pill') 로 확인) 를 넘기고 숫자만 강조 (days 생략). icon prop 에 이모지 문자열 절대 금지.",
      "끊긴 후 재시작: footer로 '작은 시작' 같은 격려 문구",
    ],
  },
  EmotionHeatmap: {
    name: "EmotionHeatmap",
    examplesHtml: {
      do: '<nds-emotion-heatmap month="2026-05"\n  entries=\'[{"date":"2026-05-25","level":4}]\'\n  colors=\'["#fff","#fee","#f99","#f00","#900"]\'\n  low-label="낮음" high-label="높음"></nds-emotion-heatmap>',
      dont: '<!-- colors 가 5개가 아니면 cell 색이 깨짐 -->\n<nds-emotion-heatmap month="2026-05" colors=\'["#fff","#000"]\'></nds-emotion-heatmap>',
    },
    summary: "월간 감정 히트맵. 5단계(0-4)를 색 강도로 시각화. 셀 클릭으로 그 날 상세 화면 진입.",
    pitfalls: [
      "entries에 없는 날짜는 자동으로 빈 셀(점선). 0 단계로 채우지 말 것 — treatZeroAsEmpty 기본 true.",
      "colors는 5개 필수 + 옅음→짙음 순서. 4개나 6개 넘기면 인덱스 어긋남.",
      "30일 미만 기록(7-14일)은 StreakCard가 더 적절 — 히트맵은 한 달 단위.",
    ],
    recommended: [
      "기분 트렌드: 기본 푸른 5단계, onCellClick으로 일기 화면 이동",
      "스트레스 강도: warm 톤(#FFE9C4 → #C25B0E), legendLabels={low:'차분',high:'활기'}",
      "챌린지 30일: title='30일 챌린지', 빈 셀이 남은 일자",
    ],
  },
  AppointmentCard: {
    name: "AppointmentCard",
    examplesHtml: {
      do: '<nds-appointment-card date="2026-06-01" start-time="14:00" end-time="14:50"\n  title="첫 회기" mode="video" location="원격(Zoom)"></nds-appointment-card>',
      dont: '<!-- mode 만 있고 date/start-time 누락 — 핵심 정보가 빠짐 -->\n<nds-appointment-card mode="video"></nds-appointment-card>',
    },
    summary: "잡힌 상담 예약 한 건. 날짜 블록 + 제목/시간/방식/장소/상태 배지 + 액션 버튼들.",
    pitfalls: [
      "상담사 선택 화면에 쓰지 말 것. 그건 CounselorCard 영역. AppointmentCard는 '잡힌 일정' 표시 전용.",
      "onClick(카드 전체)과 actions를 함께 사용 가능 — 내부에서 액션 클릭 시 stopPropagation됨.",
      "status에 따라 자동으로 배지 색이 바뀌므로 직접 색을 override하지 말 것 (시맨틱 의미 깨짐).",
      "in-person 모드일 때 location 필수. 그 외 모드는 location 생략.",
    ],
    recommended: [
      "내 예약 리스트: <AppointmentCard ... actions=[{label:'상세'},{label:'참여',primary:true}] />",
      "홈 다음 일정: onClick으로 디테일 화면, 액션 없이 카드 전체 클릭",
      "방문 상담: mode='in-person', location='강남센터 3층 301호'",
    ],
  },
  JournalEntry: {
    name: "JournalEntry",
    examplesHtml: {
      do: '<nds-journal-entry date="2026-05-25" mood="calm" title="좋은 산책"\n  body="아침에 30분 걸으니 머리가 맑아졌다" max-lines="3" clickable></nds-journal-entry>',
      dont: '<!-- body 가 길어 max-lines 가 필요한데 누락 — 카드가 늘어남 -->\n<nds-journal-entry title="…" body="… 매우 긴 텍스트 …"></nds-journal-entry>',
    },
    summary:
      "감정 일기 한 건 카드. 무드(이모지) + 날짜 + 제목 + 본문 클램프 + 태그 + 썸네일 + 푸터.",
    pitfalls: [
      "본문은 기본 3줄 클램프. 전체 노출하려면 maxLines={9999}로 해제.",
      "title 없이 body만으로도 동작 — 짧은 메모형 일기에는 title 생략이 자연스러움.",
      "tags 안에 # 기호를 넣지 말 것. 컴포넌트가 자동으로 # 접두사 붙임.",
    ],
    recommended: [
      "리스트: onClick으로 디테일 진입",
      "감정 일기: mood에 이모지, tags에 감정 키워드",
      "사진 일기: thumbnailSrc 추가",
    ],
  },
  ChatComposer: {
    name: "ChatComposer",
    examplesHtml: {
      do: '<nds-chat-composer placeholder="메시지를 입력하세요" max-length="500"\n  quick-replies=\'[{"text":"네"},{"text":"아니요"}]\'></nds-chat-composer>\n<script>el.addEventListener("nds-chat-submit", e => send(e.detail.value));</script>',
      dont: '<!-- raw <input> + <button> 으로 채팅 입력 흉내 — 자동 grow / quick-replies / 첨부 등 미적용 -->\n<input type="text" /><button>전송</button>',
    },
    summary: "채팅 입력바. ChatBubble의 짝. 자동 확장 textarea + 빠른 응답 + 첨부/마이크 + 글자수.",
    pitfalls: [
      "value/onValueChange/onSubmit 모두 controlled — 내부 state 없음.",
      "submitOnEnter=true(기본)에서 Enter=전송, Shift+Enter=줄바꿈. 모바일에선 키보드의 줄바꿈 키 사용.",
      "quickReplies는 onClick에서 onValueChange 또는 onSubmit을 직접 호출 — 컴포넌트가 정책을 강제하지 않음.",
      "onAttach/onMic prop을 안 주면 해당 버튼이 자동 숨김 (UI 요소 안 만들고 깔끔).",
    ],
    recommended: [
      "1:1 상담: <ChatComposer value, onValueChange, onSubmit, maxLength={1000}>",
      "챗봇 + 빠른 응답: quickReplies=[{label, onClick: ()=> onSubmit(...)}]",
      "음성 메모: onMic만, onAttach 생략",
    ],
  },
  PhoneInput: {
    name: "PhoneInput",
    examplesHtml: {
      do: '<nds-phone-input country-code="KR" value="01012345678" label="휴대폰 번호"></nds-phone-input>\n<script>el.addEventListener("nds-phone-change", e => setPhone(e.detail.value));</script>',
      dont: '<!-- 다이얼 코드(+82) 를 country-code 로 — ISO 코드 사용 -->\n<nds-phone-input country-code="+82"></nds-phone-input>',
    },
    summary:
      "국가 코드 + 휴대폰 번호 입력. ISO code 관리 + 다이얼 코드/국기는 countries 데이터에서 조회.",
    pitfalls: [
      "countryCode는 ISO code(KR, US 등)로 관리. '+82' 문자열을 state에 두지 말 것.",
      "번호 마스킹/하이픈 자동화는 컴포넌트가 강제하지 않음 — 필요하면 onValueChange에서 직접.",
      "기본 5개국(KR/US/JP/CN/GB) 외 필요하면 countries prop으로 직접 정의.",
    ],
    recommended: [
      "회원가입: helperText='인증번호를 받을 번호를 입력해주세요'",
      "에러: error + helperText='번호 형식이 올바르지 않아요'",
      "프로필 표시: disabled로 변경 불가 표시",
    ],
  },
  SignaturePad: {
    name: "SignaturePad",
    examplesHtml: {
      do: '<nds-signature-pad label="여기에 서명해주세요" height="200" pen-width="2"></nds-signature-pad>\n<script>\n// 제출 시:\nconst dataUrl = await document.querySelector("nds-signature-pad").toDataURL();\n</script>',
      dont: '<!-- 짧은 동의 체크에 SignaturePad — 과한 UI. nds-checkbox 가 맞음 -->\n<nds-signature-pad label="약관 동의"></nds-signature-pad>',
    },
    summary:
      "전자 서명 캔버스. 동의서/가입 서명 추출. ref(SignaturePadHandle)로 clear/toDataURL/isEmpty.",
    pitfalls: [
      "onChange로 매 stroke 추출하면 큰 base64가 잦은 리렌더 — ref로 제출 시점에만 toDataURL() 호출 권장.",
      "빈 캔버스의 toDataURL()은 null 반환. 서명 검증에 사용.",
      "터치 디바이스에서 wrap의 touch-action: none 필수 (스크롤 방해 방지) — 컴포넌트 내장.",
    ],
    recommended: [
      "동의서: ref + Button onClick에서 isEmpty() 체크 후 toDataURL 제출",
      "읽기 전용 표시: disabled (이미 그려진 dataURL은 별도 <img>로 표시)",
    ],
  },
  CoachMark: {
    name: "CoachMark",
    examplesHtml: {
      do: '<nds-coach-mark open step="0"\n  steps=\'[{"title":"여기서 시작","description":"홈 탭에서 검사를 시작하세요"}]\'\n  finish-label="완료" skip-label="건너뛰기"></nds-coach-mark>',
      dont: '<!-- steps 가 1개인데 skip 노출 + finish-label 누락 — UX 가 어색 -->\n<nds-coach-mark open steps=\'[{"title":"…"}]\'></nds-coach-mark>',
    },
    summary: "온보딩 dim 툴팁. 특정 DOM 영역을 강조 + 단계별 안내. Tooltip과 분리(가벼운 hover용).",
    pitfalls: [
      "단순 hover 설명용은 Tooltip을 쓸 것. CoachMark는 화면 전체 dim + 강제 가이드.",
      "target은 selector(string) 또는 element-getter 함수. 마운트 시점에 DOM에 존재해야 함.",
      "스크롤 필요한 위치를 가리키면 사전에 scrollIntoView 직접 호출 — CoachMark가 자동 스크롤 안 함.",
      "한 화면에 매번 띄우지 말 것 — 첫 진입/새 기능 출시 등 명시적 트리거에만.",
    ],
    recommended: [
      "첫 진입: steps 3-5개, 마지막 단계 후 onClose에서 localStorage 플래그 저장",
      "단일 안내: hideSkip + steps 1개",
      "도움말 재생: ref로 외부에서 step 제어",
    ],
  },
  Sparkline: {
    name: "Sparkline",
    examplesHtml: {
      do: '<nds-sparkline kind="line" color="primary" data="[12,15,11,18,22,20,25]" width="200" height="60"></nds-sparkline>',
      dont: '<!-- 한 점만 -> 라인이 그려지지 않음. 의미 없는 단일값엔 stat-card 사용 -->\n<nds-sparkline data="[42]"></nds-sparkline>',
    },
    summary: "미니 추이 차트 (line/area/bar). 축/레이블 없음 — 카드 안 시각 신호용.",
    pitfalls: [
      "정확한 비교가 필요한 본격 차트가 아님. 50개 이상 데이터 포인트는 가독성 저하.",
      "음수가 섞인 데이터에는 showBaseline=true로 0 기준선을 노출.",
      "color는 단색만. 그라데이션은 area variant에서 자동(투명도) — 직접 그라데이션 색을 넘기지 말 것.",
    ],
    recommended: [
      "메트릭 카드: '7.4시간' + Sparkline kind='area' color=success",
      "리스트: kind='line' + showLastDot으로 마지막 값 강조",
      "막대: 일별 카운트 같은 이산형 데이터",
    ],
  },
  CircularProgress: {
    name: "CircularProgress",
    examplesHtml: {
      do: '<nds-circular-progress value="75" max="100" size="lg" label="저장 진행"></nds-circular-progress>',
      dont: '<!-- max 가 음수/0 — 0으로 나눠 표시 깨짐 -->\n<nds-circular-progress value="50" max="0"></nds-circular-progress>',
    },
    summary:
      "원형 진행도. 단순 value/max 비율 표시. ScoreGauge(단계 분류 결과)와 분리, ProgressBar(가로)와 분리.",
    pitfalls: [
      "심리검사 결과 등 단계 분류가 중요하면 ScoreGauge를 쓸 것 — CircularProgress는 비율만.",
      "가로 막대로 충분한 단순 진행은 ProgressBar가 적절. CircularProgress는 강조/포커스 용도.",
      "label을 커스텀(분/회 등)할 때 caption으로 max를 표시하면 의미가 분명 (예: label='28분' caption='목표 60분').",
    ],
    recommended: [
      "일일 목표: <CircularProgress value={done} max={60} label={`${done}분`} caption='목표 60분' />",
      "달성: color=success일 때 시각 신호 강함",
      "작은 인디케이터: hideLabel + 작은 size",
    ],
  },
  MultiStepForm: {
    name: "MultiStepForm",
    examplesHtml: {
      do: '<nds-multi-step-form\n  steps=\'[{"key":"info","title":"기본 정보"},{"key":"confirm","title":"확인"}]\'\n  current="0">\n  <div data-step="info">기본 정보 form…</div>\n  <div data-step="confirm">최종 확인…</div>\n</nds-multi-step-form>\n<script>el.addEventListener("step-submit", e => save(e.detail.current));</script>',
      dont: "<!-- 자식 element 가 data-step 없음 — 어느 step 인지 매칭 불가 -->\n<nds-multi-step-form steps='...'><div>step 1</div><div>step 2</div></nds-multi-step-form>",
    },
    summary:
      "다단계 폼 컨테이너. 단계별 검증/진행/제출을 한 컴포넌트에서 관리. Stepper(인디케이터만)와 분리.",
    pitfalls: [
      "canProceed는 동기 boolean — 비동기 검증 결과는 외부 state로 보관 후 boolean으로 전달.",
      "마지막 단계의 '다음' 버튼은 자동으로 submitLabel + onSubmit으로 동작.",
      "단계 안에서 `useMultiStepForm()` 훅으로 next/prev 직접 호출 가능 (커스텀 액션 추가 시).",
      "단순 진행 표시만 필요하면 Stepper를 쓸 것 — MultiStepForm은 폼 흐름 컨테이너.",
    ],
    recommended: [
      "회원가입: indicator='progress', steps에 입력→인증→약관 동의 순서",
      "검사: indicator='steps' (TODO 단계 표시 강조)",
      "비동기 제출: submitting prop으로 버튼 비활성, onSubmit async",
    ],
  },
  ExpandableText: {
    name: "ExpandableText",
    examplesHtml: {
      do: '<nds-expandable-text lines="3" expand-label="더보기" collapse-label="접기">\n  긴 설명 텍스트… (스크롤 없이 너무 길어질 때만)\n</nds-expandable-text>',
      dont: '<!-- 한 줄짜리 짧은 텍스트에 expandable 사용 — 더보기 버튼이 더 큼 -->\n<nds-expandable-text lines="3">간단한 안내</nds-expandable-text>',
    },
    summary: "긴 텍스트 줄 수 클램프 + '더보기/접기' 자동. 짧은 텍스트면 토글 자동 숨김.",
    pitfalls: [
      "본문 안에 폰트 사이즈가 섞이면 line-height 측정 정확도 떨어짐 — 단일 톤 텍스트에만 사용.",
      "JournalEntry는 자체 본문 클램프(maxLines)를 가지고 있음. 카드 안에서 ExpandableText 중첩하지 말 것.",
      "hideCollapse=true는 약관 같이 한 번 펼치면 끝나는 케이스용. 일기/콘텐츠는 접기도 가능해야 함.",
    ],
    recommended: [
      "콘텐츠 설명: lines={3}로 미리보기 + 더보기",
      "약관: hideCollapse + expandLabel='이용약관 전문 보기'",
      "리뷰: 기본 3줄, 자연스러운 토글",
    ],
  },
  Header: {
    name: "Header",
    examplesHtml: {
      do: '<nds-header variant="solid" position="fixed" elevated>\n  <nds-header-main-bar>\n    <nds-header-logo>NudgeEAP</nds-header-logo>\n    <nds-header-actions>\n      <nds-icon-button aria-label="알림"><svg>…</svg></nds-icon-button>\n    </nds-header-actions>\n  </nds-header-main-bar>\n</nds-header>',
      dont: '<!-- raw <header> 에 인라인 스타일로 흉내 — 토큰/elevated 그림자가 안 들어감 -->\n<header style="position:fixed;background:#fff">…</header>',
    },
    summary:
      "base 헤더. variant 로 분기: compact(모바일 56px flex) / webview(56px, title 중앙 + back) / transparent(56px, 배경 투명) / web(데스크탑 80px grid 3열, max-width 1200). 브랜드 화면이면 base Header 가 아니라 brand chrome (TrostAppBar / NudgeEAPWebHeader / CashwalkBizWebHeader 등) 사용.",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=96-25918",
    pitfalls: [
      "variant 선택: 모바일 헤더는 variant='compact', 데스크탑 웹 헤더는 variant='web'. 'web' 이 grid 3열 + 80px + 1200 max-width 의 그 헤더.",
      "Logo 는 src 기반 <img> 폴백 또는 children 으로 SVG 컴포넌트 직접 박기 — 둘 다 미지정 시 빈 영역. NudgeEAP 처럼 SVG 로고가 있으면 children 권장(선명함).",
      "메뉴 활성 표시는 activeKey 또는 MenuItem 의 active prop — 인라인 border-bottom 금지.",
      "Auth 슬롯이 두 종류: 배열형(Header.AuthMenu — 로그인+회원가입 동시) vs 단일형(Header.AuthButton — 로그인/로그아웃 토글). 화면 디자인에 맞게 골라쓰기.",
      "브랜드 색은 tokens.css 가 자동 — 인라인 색상 override 금지. 클라이언트 로고만 per-tenant 이미지로 src/href 주입.",
    ],
    recommended: [
      "데스크탑 웹: <Header variant='web' maxWidth={1200}>\n  <Header.Logo src=tenantLogo href='/' alt='AMORE PACIFIC' />\n  <Header.Menu items={GNB} activeKey={current} onItemClick={navigate} />\n  <Header.Actions>\n    <Header.AppDownloadButton href='/download' />\n    <Header.AuthButton authState={isLoggedIn ? 'logout' : 'login'} onClick={...} />\n  </Header.Actions>\n</Header>",
      "모바일 / AppBar 컨텍스트: <Header variant='compact'>\n  <Header.MainBar>\n    <Header.Logo src=logo href='/' />\n    <Header.AuthMenu items={authItems} separator='none' />\n  </Header.MainBar>\n</Header>",
      "Webview (뒤로가기 + 타이틀): <Header variant='webview' title='상세' leftSlot={<Header.BackButton onClick={onBack} />} />",
      "2단 desktop (Trost 패턴): MainBar(logo+search+auth) + Divider + NavBar(menu+trending) + Divider 컴파운드",
    ],
    sizeMatrix: {
      "root/compact": "min-height 56 / bottom border 1px subtle / flex 좌·중·우",
      "root/webview": "min-height 56 / border none / title 절대중앙 + back left",
      "root/transparent": "min-height 56 / 배경 투명 / border none",
      "root/web":
        "height 80 / bottom border 1px subtle / content max-width 1200 / grid 3열 (1fr auto 1fr)",
      logo: "web: height 60 / max-width 200 / object-fit contain — compact: 자유 (props 로 사이즈 지정)",
      "menu-item":
        "h 100% / px var(--semantic-inset-card-large) / headline-5(18·26) bold / 활성 시 brand 색 + bottom 3px",
      "download-btn": "px 14 / py 8 / radius 8 / bg surface.subtle / body-1 bold brand",
      "auth-btn": "px 18 / py 8 / radius 8 / 1px brand border / body-1 bold brand",
    },
    stateMatrix: {
      "menu-item/default": "color textRole.strong",
      "menu-item/hover": "color textRole.brand",
      "menu-item/active": "color textRole.brand + 3px brand 하단 보더",
      "download/hover": "bg surface.disabled",
      "auth/hover": "bg surface.brandSubtle",
    },
    accessibility: [
      "Logo 는 <a href> 로 감싸 홈 진입 보장. alt 에 클라이언트 이름 명시.",
      "Menu 는 <nav> 로 노출. 각 item 은 href 있으면 <a>, 없으면 <button>. onItemClick 호출 시 href 있는 경우 preventDefault 자동.",
      "AuthButton 은 authState 가 의미 라벨('로그인'/'로그아웃')을 결정. aria-label 자동 부착.",
      "Webview variant 의 BackButton 은 aria-label='뒤로가기' 기본.",
    ],
    interactivePattern:
      "Logo / Menu / Actions / AuthMenu 안의 모든 버튼·링크에 onClick 또는 href 부착. position='sticky' 로 스크롤 시 상단 고정 가능 (z-index 자동).",
  },
  /* ────────────────────────────────────
     Brand chrome (header / footer / bottom-nav)
     base Header/Footer 대신 brand 별 화면에서는 이걸 사용.
     ──────────────────────────────────── */
  GenietAppBar: {
    name: "GenietAppBar",
    _htmlStatus: "no-html-equivalent",
    summary:
      "Geniet 브랜드 상단 헤더 (Figma 77:2 개편판). desktop = 2단(Search Header 54h + Menu Header 58h, 전체 172h) / mobile = 2단(Row1 50h + Row2 52h, 전체 102h) / webview variant. base Header 대신 Geniet 화면에서는 이걸 사용.",
    figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=77-2",
    pitfalls: [
      "Geniet 화면이면 base `<Header>` 가 아니라 `<GenietAppBar>` 사용. 검색 pill, '음식 카테고리' 박스, login_area action button(icon 28 + 11px 라벨), CTA mint pill 같은 구조는 DS 가 들고있다 — 인라인 손코딩 금지.",
      "Search Header 우측은 `actionButtons` (icon+label vertical, 52×46). 단순 텍스트 link 면 `actionButtons` 가 잘못 — 이건 vertical 액션 버튼 슬롯. 예전 `authItems` / `mobileActions` 슬롯은 제거됨.",
      "Search Header 의 trendingKeywords 는 검색 pill 바로 옆 (gap 24). Menu Header 안에 두지 말 것 (이전 구조와 다름).",
      "Menu Header 우측 CTA 는 `ctaButtons` 에 tone='outline'(캐시리뷰) / 'tinted'(친구초대) / 'filled' 로 분류. 톤 임의 금지.",
      "Mobile 검색 placeholder 는 PC와 카피가 다름 — `mobileSearchPlaceholder` 별도 지정. (PC: '궁금한 음식 칼로리...' / Mobile: '음식명, 칼로리, 영양성분, 음식 리뷰 검색')",
      "Mobile Row1 우측 포인트 chip 은 `pointChip={{ amount: '34,300' }}` — gpoint 아이콘 기본, 텍스트 Medium 14. 사용자 아이콘은 `showUserIcon=true` (기본).",
      "variant='webview' 일 때 logo 무시 (안 보임). webviewTitle / onBack 만 의미.",
    ],
    recommended: [
      "Desktop: `<GenietAppBar variant='desktop' logo={...} gnbItems={...} activeKey='home' actionButtons={[{ key:'coupon', label:'쿠폰상점', icon:<GenietCouponIcon size={28} /> }, { key:'mypage', label:'마이페이지', icon:<GenietMypageIcon size={28} />, dividerBefore:true }, { key:'login', label:'로그인', icon:<GenietLoginIcon size={28} /> }]} searchPlaceholder='궁금한 음식 칼로리...' trendingKeywords={...} ctaButtons={[{ key:'cashreview', label:'캐시리뷰', icon:<GenietCashreviewIcon size={14} />, tone:'outline' }, { key:'invite', label:'친구초대 이벤트', icon:<GenietConfettiIcon size={14} />, tone:'tinted' }]} />`",
      "Mobile: `<GenietAppBar variant='mobile' logo={...} mobileSearchPlaceholder='음식명, 칼로리...' pointChip={{ amount:'34,300' }} />` — Row1 logo + 포인트/유저, Row2 햄버거 + 검색.",
      "Webview: `<GenietAppBar variant='webview' webviewTitle='건강 기록' onBack={...} />` — BackButton 자동.",
      "카테고리 박스 라벨/링크 변경: `category={{ label: '카테고리', href: '/cat' }}`. 숨기려면 `category={false}`.",
      "GNB 5탭 기본: 홈 / 커뮤니티 / 헬시딜 / 음식 리뷰 / 기록 (Pretendard Bold 17).",
      "HTML 목업(vanilla): `<nds-brand-header brand='geniet' surface='mobile' active-key='home'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 웹뷰는 surface='webview'.",
    ],
    references: [
      {
        label: "Geniet 데스크톱 홈 SSOT — 웹 PC 홈 풀 캡처",
        image: "references/geniet-web-home.png",
        caption:
          "Geniet 데스크톱 홈. 상단 Search Header(로고 + 검색 pill + 포인트/마이페이지/로그아웃 action) + Menu Header('음식 카테고리' 박스 + GNB 5탭 + 캐시리뷰/친구초대 CTA pill) 의 2단 구조. 본문은 헬시딜 배너 / 커뮤니티 BEST / 유저 리뷰 / 판매랭킹 / 매거진 / GenietFooter.",
        brand: "geniet",
      },
      {
        label: "Geniet 데스크톱 — 리뷰 작성 모달 오버레이",
        image: "references/geniet-web-review-modal.png",
        caption:
          "Geniet 데스크톱 음식 리뷰 페이지 위에 리뷰 작성 모달이 떠 있는 상태. 배경에 GenietAppBar Menu Header(음식 카테고리/홈/커뮤니티 GNB + 카테고리 chip row + 리뷰쓰기 mint CTA) 가 보임. 모달 자체는 별도 Dialog 컴포넌트 — AppBar 와 함께 등장하는 전형적 패턴.",
        brand: "geniet",
      },
    ],
  },
  GenietFooter: {
    name: "GenietFooter",
    _htmlStatus: "no-html-equivalent",
    summary:
      "Geniet 통합 푸터. Geniet 은 앱 환경 전용이라 surface='app' (default) 만 지원 — web 푸터 없음. Footer.Info 베이스 위 wrapper — links / company / extra(통신판매중개자 안내) / logo 슬롯.",
    pitfalls: [
      "탭바는 별도 컴포넌트 GenietBottomNav. Footer 이름이지만 하단 탭바 아님.",
      "extra 슬롯은 통신판매중개자 안내 같은 부가 고지 전용 — 일반 콘텐츠 넣지 말 것.",
      "surface prop 은 'app' 만 — 타입 단에서 다른 값 차단 (Geniet 은 web 푸터 없음).",
    ],
    recommended: [
      "`<GenietFooter links={...} company={{ name, ceo, address, bizNumber, email, copyright }} extra='지니어트는 통신판매중개자이며...' logo={{ src, width, height }} />`",
      "HTML 목업(vanilla): `<nds-brand-footer brand='geniet' surface='app'>` — Footer.Info 손수 조립 금지 (BrandFooter 가이드).",
    ],
  },
  GenietBottomNav: {
    name: "GenietBottomNav",
    summary:
      "Geniet 5탭 BottomNav (Figma 90:2 — 홈/기록/혜택/리뷰/커뮤니티). 단일 그래픽 + color cascade. label 만 받으면 자동 아이콘 매핑. HTML 목업은 `<nds-brand-bottom-nav brand='geniet'>` (BrandBottomNav 가이드).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=90-2",
    pitfalls: [
      "label 이 '홈/기록/혜택/리뷰/커뮤니티' 중 하나가 아니면 fallback HomeIcon 으로 렌더 — 커스텀 라벨이면 tabs[i].icon 직접 지정.",
      "active/inactive 그래픽 별도 매핑 금지 — Geniet 정책은 단일 그래픽 + color cascade (currentColor).",
      "Trost/NudgeEAP 가 쓰는 active/inactive split 아이콘 패턴 (HomeActiveIcon 등) 을 여기 쓰지 말 것.",
    ],
    recommended: [
      "`<GenietBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />`",
      "스크롤 컨테이너 안: `position='static'` 으로 fixed 빠져나가는 것 방지.",
      "그림자 끄기: `shadow={false}` (기본 true — Figma 90:2 의 살짝 떠 보이는 가이드)",
      "HTML 목업(vanilla): `<nds-brand-bottom-nav brand='geniet' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.",
    ],
    references: [
      {
        label: "Geniet 앱 — 음식 리뷰 상세 화면",
        image: "references/geniet-app-review-detail.png",
        caption:
          "Geniet 모바일 앱 음식 리뷰 상세 (포도향기님 아임닭 닭가슴살). 상단 webview 헤더 + 리뷰 본문 + '닭가슴살 먹은 유저들의 다른 리뷰' 그리드 + 커뮤니티 게시글 리스트 + 하단 5탭 GenietBottomNav (홈/기록/혜택/리뷰/커뮤니티) 가 함께 보이는 전형 화면.",
        brand: "geniet",
      },
    ],
  },
  TrostAppBar: {
    name: "TrostAppBar",
    _htmlStatus: "no-html-equivalent",
    summary:
      "Trost 상단 헤더. desktop(2단, 1080 max-width, 앱다운로드 CTA + TrendingKeywords) / mobile / webview variant. 트로스트는 앱이 2종(트로스트 앱 / (캐시워크)트로스트 앱)이라 webview(앱 인-웹뷰) 헤더 케이스가 다양 — app(back 아이콘)·webviewLevel(main/sub)·우측 액션 조합으로 분기 (Figma 5:1169 App bar). base Header 대신 Trost 화면에서는 이걸 사용.",
    pitfalls: [
      "Trost 화면이면 base `<Header>` 가 아니라 `<TrostAppBar>` 사용.",
      "앱 다운로드 버튼 노출 토글: `showAppDownload`. 라벨: `appDownloadLabel`. 핸들러: `onAppDownload`.",
      "Trost 의 AuthMenu separator 는 'none' (디바이더 없음). Geniet 의 'divider' 패턴과 다름.",
      "모바일 홈 (모바일 웹 / 앱 인-웹뷰 홈 공용): `variant='mobile'` + `pointChip` 또는 `mobileSearchPlaceholder` 가 있으면 2단 rich 레이아웃. `pointChip.icon` 미지정 시 `TrostEnergyCoinIcon` (다크 코인 + 노란 번개) 자동.",
      "단순 단단(로고+로그인) 모바일 헤더가 필요하면 `pointChip` / `mobileSearchPlaceholder` 둘 다 비우면 fallback 단단 레이아웃.",
      "webview 헤더는 앱이 2종이라 케이스가 다양 — `app`('trost'=쉐브론 back / 'cashwalk-trost'=화살표 back), `webviewLevel`('main'=좌측 타이틀 20px·h56·back 없음 / 'sub'=중앙 타이틀 16px·h44·back. 기본 'sub').",
      "webview 우측 액션은 핸들러를 넘긴 것만 노출 (순서 검색→설정→텍스트→알림): `onSearchClick`/`onSettingClick`/`onNotificationClick`(+`hasNotification` 점)/`webviewActionText`+`onWebviewActionText`(cobalt 텍스트). 액션 없는 단순 sub 는 `webviewTitle`+`onBack` 만.",
      "webview main 홈(로고+포인트+알림)은 `webviewLevel='main'` + `logo` + `pointChip`(타이틀 미지정) + `onNotificationClick`.",
    ],
    recommended: [
      "Desktop: `<TrostAppBar variant='desktop' logo={...} gnbItems={...} activeKey='home' authItems={...} searchPlaceholder='...' trendingKeywords={...} showAppDownload onAppDownload={...} />`",
      "Mobile 홈 (웹/앱 공용, 2단): `<TrostAppBar variant='mobile' logo={...} pointChip={{ amount:'123,990', href:'/point' }} showNotificationBell onNotificationClick={...} mobileSearchPlaceholder='심리검사, 상담, 마음챙김을 검색해보세요.' />`",
      "Webview sub (트로스트 앱 상세): `<TrostAppBar variant='webview' webviewTitle='마음건강 검사' onBack={...} onSettingClick={...} onNotificationClick={...} />`",
      "Webview sub ((캐시워크)트로스트, 화살표 back): `<TrostAppBar variant='webview' app='cashwalk-trost' webviewTitle='타이틀' onBack={...} onSettingClick={...} onNotificationClick={...} />`",
      "Webview main (좌측 타이틀 + 검색): `<TrostAppBar variant='webview' webviewLevel='main' webviewTitle='심리상담' onSearchClick={...} onNotificationClick={...} />`",
      "Webview sub/text (완료 등 텍스트 액션): `<TrostAppBar variant='webview' webviewTitle='타이틀' onBack={...} webviewActionText='완료' onWebviewActionText={...} />`",
      "HTML 목업(vanilla): `<nds-brand-header brand='trost' surface='mobile' active-key='home'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 웹뷰는 surface='webview'.",
    ],
  },
  TrostFooter: {
    name: "TrostFooter",
    _htmlStatus: "no-html-equivalent",
    summary:
      "Trost 통합 푸터. surface='web' 은 데스크톱(≥1024) dark PC 푸터, surface='app' (default) 은 dark 앱 푸터. 기존 variant='desktop'|'mobile' 은 layout 으로 이름 변경 (surface axis 와 분리).",
    pitfalls: [
      "Trost 화면이면 base `<Footer>` 가 아니라 `<TrostFooter>` 사용.",
      "기존 Trost App 푸터의 `variant` prop → TrostFooter 에서는 `layout` 으로 rename. surface axis (`'web'|'app'`) 와 명확히 분리.",
      "surface='web' 은 <1024 viewport 에서 display:none. 모바일에는 surface='app' + layout='mobile' 사용.",
      "다크 배경(#333 / #464646) 은 DS 가 자동 적용 — 인라인 background 로 덮어쓰지 말 것.",
      "appStoreLinks / snsLinks (app surface) 는 기본값 (Trost humart CDN) 이 들어있어서 안 넘겨도 됨. 커스텀이 필요할 때만 override.",
    ],
    recommended: [
      "Web (PC): `<TrostFooter surface='web' />` — 기본값 다 갖춤. 커스텀 약관: `<TrostFooter surface='web' termsHref='...' locationTermsHref='...' />`",
      "App desktop: `<TrostFooter surface='app' layout='desktop' links={...} company={...} extra='긴급 위기상담 ...' logo={...} />`",
      "App mobile: `<TrostFooter surface='app' layout='mobile' links={...} company={...} />`",
      "HTML 목업(vanilla): `<nds-brand-footer brand='trost' surface='app'>` (PC 다크 푸터는 surface='web') — Footer 손수 조립 금지 (BrandFooter 가이드).",
    ],
  },
  TrostBottomNav: {
    name: "TrostBottomNav",
    summary:
      "Trost BottomNav — 트로스트는 앱이 두 종류라 variant 로 분기. variant='trost'(기본): 트로스트 앱 5탭 (홈/심리상담/커뮤니티/멘탈케어/내공간 — Figma 5:1169). variant='cashwalk-trost': (캐시워크)트로스트 앱 5탭 (홈/사운드/내음악/커뮤니티/마이페이지 — Figma 5:1249·5:1306). 두 variant 모두 5탭 active/inactive 그래픽 분리, active 색은 브랜드색 아닌 검정. HTML 목업은 `<nds-brand-bottom-nav brand='trost'>` — 단, 기본 트로스트 variant 만 커버(cashwalk-trost 미지원).",
    pitfalls: [
      "variant 마다 label 매핑이 다름. trost: 홈/심리상담/커뮤니티/멘탈케어/내공간. cashwalk-trost: 홈/사운드/내음악/커뮤니티/마이페이지. 매핑 실패 시 각 variant 의 홈 아이콘으로 fallback.",
      "두 앱 모두 '홈/커뮤니티' 탭이 있지만 그래픽이 다름 — 반드시 variant 로 구분. trost 커뮤니티=TrostCommunity(게시판), cashwalk-trost 커뮤니티=TrostMkTalk(말풍선+점).",
      "active 색 = --semantic-icon-strong-default. 다른 브랜드처럼 brand 색으로 칠하지 말 것 (Figma 정합).",
      "trost 앱 전용 그래픽 = Trost{Home,Counsel,Community,Mentalcare,My} (전부 stroke 1.5, Figma 5:1169). generic Home/Mentalcare/Mypage·NudgeEAP Counsel(점3개)·빈 말풍선 Comment 와 다름.",
      "cashwalk-trost 전용 그래픽 = TrostMk{Home,Sound,Mymusic,Talk,Mypage} (Figma 'Mk' 레이어, 5:1249·5:1306). 트로스트 앱 아이콘과 절대 혼용 금지.",
    ],
    recommended: [
      "트로스트 앱: `<TrostBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />` (variant 생략 = 'trost')",
      "(캐시워크)트로스트 앱: `<TrostBottomNav variant='cashwalk-trost' tabs={[{ key:'home', label:'홈', href:'/' }, { key:'sound', label:'사운드', ... }, ...]} />`",
      "HTML 목업(vanilla, 기본 트로스트 앱): `<nds-brand-bottom-nav brand='trost' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.",
    ],
    figmaNodeUrl:
      "https://www.figma.com/design/H0UUl3maspMM2iaoRAsrf7/%ED%8A%B8%EB%A1%9C%EC%8A%A4%ED%8A%B8-Dev?node-id=5-1169",
  },
  TrostWebHeader: {
    name: "TrostWebHeader",
    _htmlStatus: "no-html-equivalent",
    summary:
      "Trost 데스크톱(≥1024) 웹 헤더. 3슬롯 컴파운드 — EAP 배너 (Rectangle 2613) + 유틸리티 헤더 (로고 Path / 검색 Rectangle 2522 / 로그인 / 앱 다운로드) + 탭 네비게이션. `TrostDesktopHeader` 의 alias — brand chrome 5개 슬롯 중 WebHeader 자리. **HTML 목업은 `<nds-brand-header brand='trost' surface='web'>` (brand wrapper — BrandHeader 가이드). base nds-header 손수 조립 금지.**",
    pitfalls: [
      "<1024 viewport 에서는 display:none. 모바일에는 `TrostAppBar variant='mobile'` 사용.",
      "3슬롯 (banner / utility / tabs) 모두 ReactNode — 호스트 앱이 `TrostEAPBanner` / `TrostUtilityHeader` / `TrostTabNavigation` 을 직접 컴포지션. 단일 prop 으로 데이터 주입하는 형태 아님.",
      "검색 placeholder 는 `TrostSearchForm` 기본값 '전문가, 상황, 증상 등을 검색해 보세요' — 원본 디자인(Zeplin Dp775xl) 정합. 다른 카피로 덮으려면 placeholder prop 명시.",
      "EAP 배너의 building/eap-logo/chevron 아이콘은 호스트 앱이 SVG src 를 주입 (DS 가 자산을 들고 있지 않음).",
    ],
    recommended: [
      "기본: `<TrostWebHeader banner={<TrostEAPBanner eapLogoSrc={nudgeEapSymbolSrc} />} utility={<TrostUtilityHeader logoSrc={trostLogo} searchSlot={<TrostSearchForm onSearch={...} />} loginSlot={<TrostLoginSection ... />} appDownloadSlot={<TrostAppDownloadButton />} />} tabs={<TrostTabNavigation tabs={TROST_TABS} currentPath={pathname} />} />`",
      "EAP 배너 숨기기: `banner` prop 비워두면 됨.",
      "sticky 끄기: `<TrostWebHeader sticky={false} ... />` (기본 true).",
      "HTML 목업(vanilla): `<nds-brand-header brand='trost' surface='web' active-key='counsel'>` — base nds-header 슬롯 손수 조립 금지 (BrandHeader 가이드). 모바일은 surface='mobile'.",
    ],
    figmaNodeUrl: "https://zpl.io/Dp775xl",
    references: [
      {
        label: "Trost 데스크톱 홈 SSOT — 웹 PC 홈 (Zeplin Dp775xl)",
        image: "references/trost-web-home.png",
        caption:
          "Trost 데스크톱 홈 풀 캡처. Rectangle 2613 = TrostEAPBanner / Path = TrostUtilityHeader 로고 / Rectangle 2522 = TrostSearchForm 입력 / 하단 탭 = TrostTabNavigation.",
        brand: "trost",
      },
    ],
  },
  NudgeEAPAppBar: {
    name: "NudgeEAPAppBar",
    _htmlStatus: "no-html-equivalent",
    summary:
      "NudgeEAP 상단 헤더. 1단 (logo + GNB + AuthMenu), 80px h / 1200 max-width. desktop / mobile / webview variant.",
    figmaNodeUrl: "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=39-5751",
    pitfalls: [
      "Geniet/Trost 와 달리 NudgeEAP 는 1단 헤더 — 검색바/카테고리/TrendingKeywords 없음.",
      "AuthMenu separator='none' 패턴.",
      "Figma SSOT: PC 웹 헤더 39:5751 / 앱 헤더 20:3235 (NudgeEAP Dev). 로고 가이드 698:87 (NudgeEAP Library).",
    ],
    recommended: [
      "Desktop: `<NudgeEAPAppBar variant='desktop' logo={...} gnbItems={...} activeKey='home' authItems={[{ key:'login', label:'로그인' }]} />`",
      "Mobile: `<NudgeEAPAppBar variant='mobile' logo={...} authItems={...} />`",
      "Webview: `<NudgeEAPAppBar variant='webview' webviewTitle='심리검사 결과' onBack={...} />`",
      "HTML 목업(vanilla): `<nds-brand-header brand='nudge-eap' surface='mobile' active-key='counsel'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 웹뷰는 surface='webview'.",
    ],
  },
  NudgeEAPFooter: {
    name: "NudgeEAPFooter",
    _htmlStatus: "no-html-equivalent",
    summary:
      "NudgeEAP 통합 푸터. surface='web' (Figma 20:13799) 은 약관+앱다운로드+ISO+DAIN+powered by 풍부 슬롯의 PC 푸터, surface='app' (default) 은 회사 정보 표준 푸터.",
    figmaNodeUrl: "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=20-13799",
    pitfalls: [
      "Figma SSOT: web 푸터 20:13799 / app 푸터 (Footer.Info 표준).",
      "탭바는 별도 컴포넌트 NudgeEAPBottomNav.",
      "web surface 의 appDownloads / iso / dain / poweredBy 슬롯은 NudgeEAP 전용 — base Footer.Web compound 에는 없는 슬롯 (브랜드별 풍부 슬롯은 wrapper 내부에만).",
      "Trost 처럼 다크 푸터 아님 — light + neutral 토큰.",
    ],
    recommended: [
      "Web (PC): `<NudgeEAPFooter surface='web' links={...} company={{ address, bizNumber, phone, fax, email, copyright }} appDownloads={...} iso={{ imgSrc, captionLines }} dain={{ logoSrc, label }} poweredBy='powered by Cashwalk' maxWidth={1200} />`",
      "App (surface 생략 가능): `<NudgeEAPFooter links={...} company={{ name:'(주)다인', address, bizNumber, copyright }} logo={{ src, width, height }} />`",
      "HTML 목업(vanilla): `<nds-brand-footer brand='nudge-eap' surface='app'>` (PC 풍부 푸터는 surface='web') — Footer 손수 조립 금지 (BrandFooter 가이드).",
    ],
  },
  NudgeEAPBottomNav: {
    name: "NudgeEAPBottomNav",
    summary:
      "NudgeEAP 5탭 BottomNav (홈/챌린지/상담/멘탈케어/내 공간). 5탭 모두 active/inactive 그래픽 분리 (채워진 아이콘으로 전환). HTML 목업은 `<nds-brand-bottom-nav brand='nudge-eap'>` (BrandBottomNav 가이드).",
    figmaNodeUrl: "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=20-3331",
    pitfalls: [
      "label 매핑은 '홈/챌린지/상담/멘탈케어/내 공간' 기준. 다른 라벨이면 fallback HomeIcon.",
      "상담 아이콘은 Counsel(점 3개 말풍선) — active 는 채워진 CounselActiveIcon. 빈 말풍선 Comment 아님.",
      "Figma SSOT: 20:3331 (NudgeEAP Dev — 앱 네비게이션).",
    ],
    recommended: [
      "`<NudgeEAPBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />`",
      "HTML 목업(vanilla): `<nds-brand-bottom-nav brand='nudge-eap' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.",
    ],
  },
  RunmileBottomNav: {
    name: "RunmileBottomNav",
    summary:
      "Runmile 5탭 BottomNav (홈/대회정보/커뮤니티/채팅/마이페이지 — Figma 1221:64046). 5탭 모두 active/inactive 그래픽 분리, active=검정(#221E1F)/inactive=gray600. 라벨 12/16 (Figma 실측). HTML 목업은 `<nds-brand-bottom-nav brand='runmile'>` (BrandBottomNav 가이드).",
    figmaNodeUrl: "https://www.figma.com/design/g3ifA735EE6EKjeL4ZW2ax/?node-id=1221-64046",
    pitfalls: [
      "label 매핑은 '홈/대회정보/커뮤니티/채팅/마이페이지' 기준. 다른 라벨이면 fallback RunmileHomeIcon.",
      "커뮤니티 탭은 2인 그룹(People) 아이콘, 마이페이지는 원형 인물(Account) 아이콘 — 4탭(83:887)→5탭(1221:64046) 개편판.",
      "채팅 탭의 이중 말풍선(RunmileChats)은 웹 헤더의 단일 말풍선(RunmileChatting)과 다름 — 혼용 금지.",
      "active 색 = --semantic-icon-strong-default. 라벨은 11/14 가 아니라 12/16.",
    ],
    recommended: [
      "`<RunmileBottomNav tabs={[{ key:'home', label:'홈', href:'/' }, ...]} activeTab='home' />`",
      "HTML 목업(vanilla): `<nds-brand-bottom-nav brand='runmile' active-key='home'>` — 제네릭 nds-footer-tab-bar 손수 조립 금지.",
    ],
  },
  NudgeEAPWebHeader: {
    name: "NudgeEAPWebHeader",
    _htmlStatus: "no-html-equivalent",
    summary:
      "NudgeEAP 웹 헤더 (PC) — base Header (variant=\"web\") wrapper. 로고 200×60 (Symbol + KO+EN horizontal) + GNB 6탭 (상담하기/심리검사/심리치료/주간레터/소식/마이페이지) + 우측 앱다운로드 + 로그인/로그아웃. **HTML 목업은 `<nds-brand-header brand='nudge-eap' surface='web'>` (brand wrapper — BrandHeader 가이드). base nds-header 손수 조립 금지.**",
    figmaNodeUrl: "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/?node-id=39-5751",
    pitfalls: [
      "NudgeEAPAppBar 와 분리 — AppBar 는 앱(모바일/웹뷰) 전용 (Figma 20:3235), WebHeader 는 데스크톱 (39:5751).",
      "로고는 Figma 698:87 (NudgeEAP Library) 의 *Symbol + KO+EN horizontal* (대표 로고) 사용 — 124×28 원본 PNG, 헤더에서 height auto 로 200×60 영역에 배치.",
      'base `<Header variant="web">` 대신 NudgeEAP 화면에서는 이 컴포넌트를 사용해야 fixture/스토리/Figma 가 일치.',
    ],
    recommended: [
      "`<NudgeEAPWebHeader logo={{ src, alt:'NudgeEAP', href:'/' }} menuItems={GNB} activeKey={current} showAppDownload appDownloadHref='/download' authState={isLoggedIn ? 'logout' : 'login'} authHref='/auth' />`",
      "HTML 목업(vanilla): `<nds-brand-header brand='nudge-eap' surface='web' active-key='counsel'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 모바일/웹뷰는 surface='mobile'|'webview'.",
    ],
  },
  CashwalkBizWebHeader: {
    name: "CashwalkBizWebHeader",
    _htmlStatus: "no-html-equivalent",
    summary:
      "캐시워크 포 비즈니스 (Cashwalk for Business) 웹 헤더. PC(로고+GNB+우측 액션) / Mobile(로고+햄버거) variant. 캐시워크 포 비즈니스는 *웹 전용* 이라 AppBar 가 없음 — chrome 슬롯 5개 중 WebHeader/WebFooter 만 제공. **HTML 목업은 `<nds-brand-header brand='cashwalk-biz' surface='web'>` (brand wrapper — BrandHeader 가이드). base nds-header 손수 조립 금지.**",
    figmaNodeUrl: "https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/?node-id=380-1739",
    pitfalls: [
      "캐시워크 포 비즈니스 화면에는 base `<Header>` 가 아니라 `<CashwalkBizWebHeader>` 사용.",
      "캐시워크 포 비즈니스 시그니처 (Yellow/200 + Neutral/900) 는 토큰 cascade 가 자동 적용 — 인라인 background 로 덮어쓰지 말 것.",
      "캐시워크 포 비즈니스는 *AppBar / BottomNav 컴포넌트 없음* (앱 없으니 필요 없음). 모바일 헤더도 CashwalkBizWebHeader variant='mobile', 모바일 푸터는 CashwalkBizFooter layout='mobile'.",
    ],
    recommended: [
      "Desktop: `<CashwalkBizWebHeader variant='desktop' logo={{...}} menuItems={...} activeKey='home' actions={[{ key:'login', label:'로그인', href:'#' }]} />`",
      "Mobile: `<CashwalkBizWebHeader variant='mobile' logo={{...}} onMobileMenu={() => openDrawer()} />`",
      "HTML 목업(vanilla): `<nds-brand-header brand='cashwalk-biz' surface='web' active-key='ad'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 모바일은 반응형 web (별도 AppBar 없음).",
    ],
  },
  CashwalkBizFooter: {
    name: "CashwalkBizFooter",
    _htmlStatus: "no-html-equivalent",
    summary:
      "캐시워크 포 비즈니스 통합 푸터. 캐시워크 포 비즈니스는 웹 전용이라 surface='web' (default) 만 지원. layout='desktop'|'mobile' 으로 반응형 분기. light 톤 + Neutral 텍스트.",
    figmaNodeUrl: "https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/?node-id=380-2208",
    pitfalls: [
      "Trost 처럼 다크 푸터로 바꾸지 말 것 — 캐시워크 포 비즈니스 가이드는 light + neutral 텍스트.",
      "surface prop 은 'web' 만 — 타입 단에서 다른 값 차단 (캐시워크 포 비즈니스는 app 푸터 없음).",
      "기존 CashwalkBizWebFooter 의 variant prop 이 CashwalkBizFooter 에서는 layout 으로 rename.",
    ],
    recommended: [
      "Desktop: `<CashwalkBizFooter layout='desktop' links={...} company={{ name:'캐시워크 주식회사', address:..., bizNumber:..., copyright:... }} maxWidth={1600} />`",
      "Mobile: `<CashwalkBizFooter layout='mobile' links={...} company={...} />`",
      "HTML 목업(vanilla): `<nds-brand-footer brand='cashwalk-biz' surface='web'>` — Footer 손수 조립 금지 (BrandFooter 가이드).",
    ],
  },
  RunmileWebHeader: {
    name: "RunmileWebHeader",
    _htmlStatus: "no-html-equivalent",
    summary:
      "Runmile 데스크톱 PC 헤더 (height 80, bg white, border-bottom 1px gray300, content max-width 1440 / 좌우 80px). 로고(coral) + 좌측 GNB(대회 정보/커뮤니티, Bold 18) + 중앙 검색바(coral 2px border, rounded 100) + 우측 액션(아이콘 28 + 라벨 14). `loggedIn` 으로 우측 액션 분기: false=채팅/로그인, true=채팅(미읽음 badge)/마이페이지. 모바일/웹뷰는 RunmileAppBar. **HTML 목업은 `<nds-brand-header brand='runmile' surface='web'>` (BottomNav 와 동일한 brand wrapper 패턴 — BrandHeader 가이드). base nds-header 손수 조립 금지.**",
    figmaNodeUrl: "https://www.figma.com/design/g3ifA735EE6EKjeL4ZW2ax/?node-id=1058-13336",
    pitfalls: [
      "데스크톱 전용. 모바일/웹뷰 헤더는 `RunmileAppBar` (Figma 36:258) 사용.",
      "로고는 base64 내장이 기본값 — `logoSrc` 안 줘도 coral #FF5B37 워드마크가 자동 렌더 (파일 호스팅 불필요). 자체 로고로 바꿀 때만 `logoSrc` 주입. `logoSrc=''` 처럼 빈 값을 명시하면 'Runmile' 텍스트 폴백.",
      "우측 채팅 아이콘은 단일 말풍선(RunmileChattingIcon) — 바텀네비 채팅 탭의 이중 말풍선(RunmileChats)과 다름.",
      "미읽음 badge 는 `loggedIn && chatUnreadCount > 0` 일 때만 노출 (99 초과 시 '99+').",
      '색은 전부 data-brand="runmile" cascade 의 --semantic-* 토큰 — host 가 hex 로 덮지 말 것.',
    ],
    recommended: [
      "로그인 전 (로고 생략 = base64 기본): `<RunmileWebHeader menuItems={[{key:'competition',label:'대회 정보',href:'/competitions'},{key:'community',label:'커뮤니티',href:'/community'}]} activeKey='competition' loggedIn={false} onSearch={...} />`",
      "로그인 후: `<RunmileWebHeader menuItems={RUNMILE_GNB} activeKey='community' loggedIn chatUnreadCount={12} myPageHref='/my' profileSrc={avatarUrl} />` — 자체 로고로 바꾸려면 `logoSrc={...}` 추가.",
      "HTML 목업(vanilla): `<nds-brand-header brand='runmile' surface='web' active-key='race'>` — base nds-header + nds-header-menu-item 손수 조립 금지 (BrandHeader 가이드). 모바일 bar 는 surface='mobile'.",
    ],
    // 런마일 목업 예시 이미지 일시 비활성화 — MCP 가 참고하지 못하도록 주석 처리.
    // 다시 노출하려면 아래 블록 주석을 해제하고 가이드 재빌드.
    references: [
      /*
      {
        label: "Runmile 웹 홈 — 기본 상태 (state=default)",
        image: "references/runmile-web-home.png",
        caption:
          "런마일 웹 PC 홈 풀 캡처. 상단 RunmileWebHeader (로고 + 대회 정보/커뮤니티 GNB + 검색바 + 로그인) → 모집중인 대회 / 진행중인 대회 카드 그리드 + 우측 커뮤니티 인기글 사이드바 + 푸터. coral #FF5B37 = 런마일 primary.",
        brand: "runmile",
      },
      {
        label: "Runmile 웹 홈 — 채팅 패널 오픈 (헤더 우측 채팅 액션)",
        image: "references/runmile-web-home-chat.png",
        caption:
          "헤더 우측에 채팅/로그인 액션이 노출된 상태. 채팅 버튼 클릭 시 우측 채팅 드로어가 열려 참여중/인기 채팅방 리스트 (대회 썸네일 + 진행중/모집중/진행대기 배지 + 미읽음 카운트) 를 보여줌.",
        brand: "runmile",
      },
      {
        label: "Runmile 웹 대회 상세 페이지 (대회 정보 → 상세)",
        image: "references/runmile-web-competition-detail.png",
        caption:
          "런마일 웹 PC 대회 상세 풀 캡처. 상단 RunmileWebHeader → ① 히어로(좌: 대회 썸네일, 우: 제목 + 코스 배지 5km/10km/Half + 해시태그 + 일시/장소/주최·접수기간/참가비/문의 2열 정보표 + coral '참가하기' CTA + 좋아요/공유) → ② 게시판 리스트 + 채팅 패널 2열 → ③ 대회 안내(지도 + 5km/10km/Half 코스 탭 + 편의시설 + 날씨 카드 캐러셀) → ④ 대회 정보 텍스트(코스별 출발시간/오시는 길) → ⑤ 기념품 정보(노란 배경 그리드: 배번표·메달·기념스티커·뱃지·생수·간식·파우치·핫팩) → 푸터. coral #FF5B37 = 런마일 primary, 정보표·탭·배지는 DS 패턴으로 매핑.",
        brand: "runmile",
      },
      */
    ],
  },
  RunmileToast: {
    name: "RunmileToast",
    _htmlStatus: "no-html-equivalent",
    summary:
      "**미구현 — Figma SSOT 등록만.** Runmile Toast — Property 1=PC (226×48) / Property 1=MO (196×44). 구현은 별도 PR.",
    figmaNodeUrl: "https://www.figma.com/design/udH9ME1HnHk4kbxR17Neig/?node-id=24-91",
    pitfalls: [
      "현재 React/HTML 컴포넌트 없음. 공용 `<Toast>` 가 있다면 그쪽으로 brand mode 분기하거나, 신규 RunmileToast 로 구현 결정.",
      "PC ↔ MO 가 size 만 다른지 아니면 layout 도 다른지는 Figma 24:85 / 24:90 디테일 확인 필요.",
    ],
  },
  RunmileScrollFab: {
    name: "RunmileScrollFab",
    _htmlStatus: "no-html-equivalent",
    summary:
      "**미구현 — Figma SSOT 등록만.** Runmile 스크롤 탑/바텀 FAB. state=top|bottom × device=pc|mo 4가지 (pc 60×60, mo 52×52). 구현은 별도 PR.",
    figmaNodeUrl: "https://www.figma.com/design/udH9ME1HnHk4kbxR17Neig/?node-id=520-3221",
    pitfalls: [
      "현재 React/HTML 컴포넌트 없음. top FAB 와 bottom FAB 가 하나의 컴포넌트인지 (direction prop) 둘로 분리인지 (RunmileScrollTopFab / RunmileScrollBottomFab) 는 구현 시 결정.",
      "pc/mo 사이즈 차이는 컨테이너 폭으로 분기하기보다 device prop 으로 명시 추천 — Figma variant 와 1:1.",
    ],
  },
  PageHeader: {
    name: "PageHeader",
    examplesHtml: {
      do: '<nds-page-header page-title="설정" subtitle="계정과 알림을 관리하세요" show-back bordered>\n  <nds-breadcrumb slot="breadcrumb" items=\'[{"label":"홈","href":"/"}]\'></nds-breadcrumb>\n  <nds-button slot="actions" color="primary">저장</nds-button>\n</nds-page-header>\n<script>el.addEventListener("nds-page-header-back", () => history.back());</script>',
      dont: '<!-- show-back 만 — 뒤로가기 이벤트 처리 없음 -->\n<nds-page-header page-title="설정" show-back></nds-page-header>',
    },
    summary:
      "페이지 단위 헤더. 제목 + 서브타이틀 + 우측 액션 + 하단 탭 슬롯. AppBar(글로벌 네비)와 분리.",
    pitfalls: [
      "글로벌 네비는 AppBar. PageHeader는 각 페이지 안의 타이틀 영역.",
      "onBack 지정 시 좌측 ← 자동 노출 — 직접 IconButton 추가하지 말 것 (이중 노출).",
      "bottom 슬롯은 헤더 padding 외곽까지 음수 마진으로 펼쳐짐. Tabs를 그 안에서 padding 직접 줄 때 0/24/0 등으로 미세 조정.",
      "bordered=true는 스크롤되는 본문과 헤더를 분리할 때만 사용. 분리감이 필요 없으면 false.",
    ],
    recommended: [
      "디테일: title + onBack + actions",
      "리스트: title + subtitle + actions(생성 버튼)",
      "탭형 페이지: title + bottom={<Tabs />}",
    ],
  },
  TitleBlock: {
    name: "TitleBlock",
    examplesHtml: {
      do: '<nds-title-block level="h2" title="이번 주 미션" subtitle="작은 변화부터 시작해요"></nds-title-block>',
      dont: '<!-- level 누락 -> 기본값이 적용돼 페이지 위계가 무너짐 -->\n<nds-title-block title="…"></nds-title-block>',
    },
    summary:
      "헤딩 + 서브타이틀 표준 블록. level (h1~h5) 만 결정하면 헤딩 폰트와 Gap/Title 토큰이 자동 적용 — Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반.",
    pitfalls: [
      "헤딩 + 서브타이틀 묶음에는 직접 <h{n}> + <p> + margin-top 으로 짜지 말 것. level↔gap 미스매치(h4 에 12px gap 등) 가 생기는 가장 흔한 안티패턴.",
      "h4/h5 가 '★ 가장 자주' — 카드 헤딩(h4 · gap 6) / 서브 헤딩(h5 · gap 8). h1~h3 은 페이지 단위 hero / 큰 섹션 / 페이지 헤더.",
      "서브타이틀 폰트도 level 에 묶여 자동 결정: h1~h3 = Body3(14px), h4~h5 = Caption1(13px). 다른 사이즈가 필요하면 TitleBlock 을 쓰지 말고 raw 헤딩으로.",
      "위계가 같은 자리에서는 같은 level 유지. h4 카드 헤딩들 사이에 h2 가 끼면 시각적 위계 망가짐.",
      "Card / PageHeader 안에 TitleBlock 을 중첩해서 쓰는 패턴이 정상. 단, PageHeader 가 이미 title 슬롯을 가진 경우엔 PageHeader 의 title 을 우선 사용.",
    ],
    recommended: [
      "카드 헤딩 (★ 가장 자주): <TitleBlock level='h4' title='바로 상담하기' subtitle='급한 문제는 5분 내 바로 상담' />",
      "서브 헤딩 (★ 가장 자주): <TitleBlock level='h5' title='오늘의 루틴' subtitle='...' />",
      "Hero 영역: <TitleBlock level='h1' title='마음까지 건강한 업무환경' subtitle='...' />",
      "단독 헤딩: subtitle 생략 — 헤딩 + Gap 만 토큰화하고 싶을 때.",
    ],
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=859-5614",
  },
  StatCard: {
    name: "StatCard",
    examplesHtml: {
      do: '<nds-stat-card label="이번 주 기록" value="5" unit="일" trend="up" compare="지난주 +2일"></nds-stat-card>',
      dont: '<!-- 트렌드/단위 없이 숫자만 — 사용자가 의미를 추측해야 함 -->\n<nds-stat-card label="…" value="5"></nds-stat-card>',
    },
    summary: "메트릭 강조 카드. 라벨 + 큰 숫자/단위 + delta(변화량) + Sparkline 슬롯(trailing).",
    pitfalls: [
      "trend만 주고 delta를 빼면 trend 색이 의미 없어짐. 둘 다 함께 사용.",
      "그리드에서 카드마다 value 자릿수 차이가 크면 baseline이 흔들림 — 동일 단위로 통일.",
      "trailing에 Sparkline을 넣을 때 width 100-120, height 36-48 정도가 적절. 그 이상은 카드 균형 깨짐.",
      "**HTML `icon` 속성 = inline SVG (이름/이모지 아님).** innerHTML 로 주입되므로 `icon=\"chart\"` 같은 이름이나 이모지를 넣으면 텍스트로 흘러나온다. `find_icon({ name })` 의 inline SVG 를 넣을 것 — 속성이라 `icon='<svg ...>'`(단일 따옴표) 형태. React StatCard 의 `icon?: ReactNode` 와 대칭.",
    ],
    recommended: [
      "대시보드 4-up 그리드: <StatCard label, value, unit, delta, trend>",
      "리포트 hero: + icon으로 강조",
      "추이 시각화: trailing={<Sparkline />} 결합",
    ],
  },
  QuickActionGrid: {
    name: "QuickActionGrid",
    examplesHtml: {
      do: '<nds-quick-action-grid columns="3" gap="12"\n  actions=\'[{"key":"home","label":"홈","icon":"<svg ...>...</svg>"},{"key":"log","label":"기록","icon":"<svg ...>...</svg>"}]\'></nds-quick-action-grid>\n<!-- icon = find_icon({name}) 가 준 inline SVG 문자열 (이름/이모지 아님 — innerHTML). actions 는 JSON 속성이라 SVG의 " 는 \\" 로 이스케이프. 각 action 은 key 필수(없으면 렌더 제외) -->\n<script>el.addEventListener("quick-action", e => navigate(e.detail.key));</script>',
      dont: '<!-- actions JSON 에 onClick 함수 박음 — WC attribute 는 함수 못 받음. key + quick-action 이벤트로 -->\n<nds-quick-action-grid actions=\'[{"label":"홈","icon":"home","onClick":"go()"}]\'></nds-quick-action-grid>\n<!-- 틀린 점 2개 더: key 누락(렌더 제외) · icon 에 이름 "home"(텍스트로 흘러나옴 — inline SVG 여야) -->',
    },
    summary: "홈 빠른 액션 그리드. 4-6칸 아이콘+라벨, 배지 지원. 4칸이 기본 균형.",
    pitfalls: [
      "라벨이 길면 줄바꿈됨. 4글자 이하 권장.",
      "5칸은 배치가 어색 — columns=4 + 8개(2행) 또는 columns=3 사용.",
      "배지는 알림 카운트(숫자) 또는 짧은 라벨('N','NEW') 위주. 긴 텍스트 X.",
      '**icon = inline SVG 문자열 (이름/이모지 아님).** `icon` 은 innerHTML 로 주입되므로 `"icon":"home"` 같은 이름이나 이모지를 넣으면 그대로 텍스트로 흘러나온다(이모지는 `validate_mockup` 의 emoji-banned 위반). `find_icon({ name })` → 반환 inline SVG 를 `icon` 에 넣는다. React `QuickActionGrid` 의 `icon: ReactNode` 와 대칭, nds-sidebar 와 동일 규약.',
    ],
    recommended: [
      "홈 진입: 4칸 (감정기록 / 상담 / 챌린지 / 콘텐츠)",
      "시간대별 명상: iconBg로 시간대 톤 표현",
      "알림 진입: badge='3' 같은 미읽음 카운트",
    ],
  },
  TagInput: {
    name: "TagInput",
    examplesHtml: {
      do: '<nds-tag-input value=\'["불안","수면"]\' label="관심 주제"\n  placeholder="태그 입력 후 Enter" max-tags="5" helper-text="최대 5개"></nds-tag-input>\n<script>el.addEventListener("nds-tag-change", e => save(e.detail.value));</script>',
      dont: '<!-- max-tags 누락 + helper 없음 — 무한정 입력 가능 -->\n<nds-tag-input placeholder="태그"></nds-tag-input>',
    },
    summary:
      "태그 자유 입력. Enter/쉼표로 추가, Backspace로 마지막 삭제. Chip 표시(읽기 전용)와 분리.",
    pitfalls: [
      "value의 태그 문자열에 '#' 접두를 직접 넣지 말 것 — 컴포넌트가 표시 시 자동 추가, 입력 시 자동 제거.",
      "정해진 옵션에서 다중 선택은 SelectionCard mode='multiple' 또는 Chip 토글이 적합.",
      "자동완성이 필요하면 Autocomplete + 직접 태그 관리 — TagInput은 자유 입력 전용.",
    ],
    recommended: [
      "관심사 등록: maxTags=5, onMaxReached로 토스트",
      "콘텐츠 태그: allowDuplicates=false (기본)",
    ],
  },
  Lightbox: {
    name: "Lightbox",
    examplesHtml: {
      do: '<nds-lightbox open index="0"\n  images=\'[{"src":"/p1.jpg","alt":"사진 1","caption":"…"},{"src":"/p2.jpg","alt":"사진 2"}]\'></nds-lightbox>\n<script>el.addEventListener("lightbox-close", () => el.removeAttribute("open"));</script>',
      dont: '<!-- alt 누락 — 이미지 의미 전달 실패 -->\n<nds-lightbox open images=\'[{"src":"/p.jpg"}]\'></nds-lightbox>',
    },
    summary: "이미지 풀스크린 확대 모달. 키보드(Esc/←/→) + 좌우 버튼 + 카운터 + 캡션.",
    pitfalls: [
      "body.overflow 잠금이 자동 처리. 외부에서 또 잠그지 말 것.",
      "이미지 1장이면 좌우 네비 자동 숨김 — 외부에서 조건 분기 불필요.",
      "src는 미리 로드된 이미지 권장 — 큰 원본 이미지 직접 띄우면 첫 진입 지연.",
    ],
    recommended: [
      "갤러리: 썸네일 그리드 + onClick으로 idx 설정 + open",
      "단일: 이미지 1장 + caption로 컨텍스트 제공",
    ],
  },
  AvatarGroup: {
    name: "AvatarGroup",
    examplesHtml: {
      do: '<nds-avatar-group max="3" size="md"\n  items=\'[{"src":"/a.jpg","alt":"A"},{"src":"/b.jpg","alt":"B"},{"src":"/c.jpg","alt":"C"},{"src":"/d.jpg","alt":"D"}]\'></nds-avatar-group>',
      dont: "<!-- max 누락 — 5명 이상이면 가로로 무한히 늘어남 -->\n<nds-avatar-group items='[…아주 많음…]'></nds-avatar-group>",
    },
    summary: "여러 아바타를 겹쳐 표시 + 초과 +N. 단체 상담/챌린지 참가자 같은 시각 신호용.",
    pitfalls: [
      "정확한 명단이 목적이면 List가 더 적절. AvatarGroup은 'N명이 함께'라는 시각 신호.",
      "단일 아바타는 Avatar 그대로. AvatarGroup은 N명 ≥ 2 케이스용.",
      "max를 너무 크게 두면(7+) 가로 폭이 늘어남 — 모바일은 4 권장.",
    ],
    recommended: [
      "단체 상담 참여자: max=4 size='md'",
      "챌린지: max=5 size='sm'",
      "이미지 + 이니셜 혼합: src 없으면 자동 이니셜 fallback",
    ],
  },
  CallControlBar: {
    name: "CallControlBar",
    examplesHtml: {
      do: '<nds-call-control-bar duration="00:05:30" camera-on></nds-call-control-bar>\n<script>\nel.addEventListener("nds-call-mute-change", e => setMute(e.detail.muted));\nel.addEventListener("nds-call-end", endCall);\n</script>',
      dont: '<!-- duration 포맷이 HH:MM:SS 아님 -->\n<nds-call-control-bar duration="5:30"></nds-call-control-bar>',
    },
    summary:
      "통화 컨트롤. 음소거/카메라/스피커/종료 + duration 표시. 화상은 카메라, 음성은 스피커만 노출.",
    pitfalls: [
      "카메라/스피커는 onChange 콜백을 안 주면 버튼 자동 숨김. 둘 다 노출하지 말 것 (화상에 스피커, 음성에 카메라는 어색).",
      "종료 버튼 색을 override하지 말 것 — 시맨틱 의미(파괴) 유지를 위해 빨간색 고정.",
      "duration은 외부 timer state로 갱신 — 컴포넌트가 자체로 시간 계산하지 않음.",
    ],
    recommended: [
      "화상 상담: muted + cameraOn + duration",
      "음성 상담: muted + speakerOn + duration",
      "AI 통화: extra slot에 채팅 전환 버튼 추가",
    ],
  },
  VoiceRecorder: {
    name: "VoiceRecorder",
    examplesHtml: {
      do: '<nds-voice-recorder state="idle" seconds="0" max-seconds="180"></nds-voice-recorder>\n<script>\n// host 가 timer 와 state 를 controlled 로 관리:\nel.addEventListener("state-change", e => { el.setAttribute("state", e.detail.state); /* setInterval 로 seconds */ });\nel.addEventListener("complete", e => save(e.detail.seconds));\n</script>',
      dont: '<!-- seconds 를 자체 증가시키지 않음 — host 가 timer 책임 -->\n<nds-voice-recorder state="recording" seconds="0"></nds-voice-recorder>  <!-- 영원히 0 -->',
    },
    summary:
      "음성 메모 녹음 UI. 큰 녹음 버튼 + 타이머 + 펄스 인디케이터. 마이크 접근/저장은 외부 처리.",
    pitfalls: [
      "seconds는 외부 timer로 갱신 — 컴포넌트는 시간 측정 안 함 (테스트 가능성).",
      "녹음 시작 시 navigator.mediaDevices.getUserMedia 등 마이크 권한 처리는 onStateChange 안에서.",
      "maxSeconds 도달 시 자동 onComplete + state='idle' — 직접 stop 처리할 필요 없음.",
    ],
    recommended: [
      "감정 일기 음성: maxSeconds=300 (5분), onComplete에서 파일 업로드",
      "챗 음성 메시지: maxSeconds=60",
    ],
  },
  NotificationItem: {
    name: "NotificationItem",
    examplesHtml: {
      do: '<nds-notification-item kind="success" item-title="결제 완료"\n  description="6/1 14:00 첫 상담" time="방금 전" unread clickable></nds-notification-item>\n<script>el.addEventListener("nds-notification-click", () => navigate("/notice/1"));</script>',
      dont: '<!-- kind 누락 — 색/아이콘이 의미 없는 default -->\n<nds-notification-item item-title="알림"></nds-notification-item>',
    },
    summary: "알림 리스트 한 건. kind별 아이콘 톤, 미읽음 점, 시간 라벨, 본문 2줄 클램프.",
    pitfalls: [
      "Toast/Snackbar와 다름 — 알림 센터(히스토리) 한 건 표현용.",
      "description 본문은 자동 2줄 클램프. 더 길게 보여주려면 onClick으로 디테일 진입.",
      "unread는 단순 시각 표시 — 읽음 처리는 onClick 안에서 외부 state 갱신.",
    ],
    recommended: [
      "알림 센터: List 안에 NotificationItem 반복",
      "kind별 자동 아이콘: 직접 icon prop 안 줘도 됨",
    ],
  },
  CountdownTimer: {
    name: "CountdownTimer",
    examplesHtml: {
      do: '<nds-countdown-timer ends-at="2026-12-31T23:59:59+09:00"\n  label="이벤트 종료까지" expired-text="이벤트가 종료되었어요"></nds-countdown-timer>',
      dont: "<!-- ends-at 이 과거값이고 expired-text 누락 — '0초' 가 영원히 표시됨 -->\n<nds-countdown-timer ends-at=\"2020-01-01T00:00:00Z\"></nds-countdown-timer>",
    },
    summary:
      "종료 시각까지 자동 카운트다운. 1초 단위 갱신, 10초 이하 빨강 강조, mm:ss/hh:mm:ss/remaining 포맷.",
    pitfalls: [
      "endsAt을 매 렌더 새로 계산하면 카운트가 흔들림 — useMemo로 고정.",
      "onComplete는 0초 도달 시 1회만. 재시작은 endsAt을 새로 set.",
      "remaining 포맷은 자연어 — 정확한 카운트가 필요하면 mm:ss/hh:mm:ss.",
    ],
    recommended: [
      "인증 만료: useMemo로 expiry 고정 + onComplete로 재발송",
      "라이브 시작: format='remaining' (자연어)",
      "마감 카운트: 임박 시 빨강 강조 자동",
    ],
  },
  OnlineIndicator: {
    name: "OnlineIndicator",
    examplesHtml: {
      do: '<nds-avatar src="/u.jpg" alt="홍길동" size="md"></nds-avatar>\n<nds-online-indicator status="online" show-label aria-label="온라인"></nds-online-indicator>',
      dont: '<!-- 색 점 하나로 상태 모사 — 4 상태 (online/idle/offline/dnd) 구분 못함 -->\n<span style="background:#0a0;width:8px;height:8px"></span>',
    },
    summary: "presence 점 (online/away/busy/offline). online은 자동 펄스 애니메이션.",
    pitfalls: [
      "online에 별도 강조 효과 추가하지 말 것 — 자동 펄스 있음.",
      "아바타 우하단에 올릴 때 부모 position:relative + 점 position:absolute.",
    ],
    recommended: ["상담사 리스트: showLabel=true로 텍스트 함께", "아바타 점: 라벨 없이 size=10"],
  },
  ReactionPicker: {
    name: "ReactionPicker",
    examplesHtml: {
      do: '<nds-reaction-picker\n  options=\'[{"key":"like","emoji":"👍","label":"좋아요","count":5},{"key":"care","emoji":"💙","label":"공감","count":12}]\'\n  value=\'["like"]\'></nds-reaction-picker>\n<script>el.addEventListener("nds-reaction-change", e => save(e.detail.value));</script>',
      dont: '<!-- options 의 emoji / label 누락 — 의미 전달 실패 -->\n<nds-reaction-picker options=\'[{"key":"like"}]\'></nds-reaction-picker>',
    },
    summary: "콘텐츠 반응 칩 그룹. 이모지 + 카운트, 다중 또는 단일 선택, hideCount 옵션.",
    pitfalls: [
      "value는 single이어도 string[] (길이 0-1) — 일관된 형태로 처리.",
      "options.count가 undefined면 자동 숨김. 0은 표시됨.",
      "옵션 4-6개 권장. 8개 이상이면 가로 폭 부담.",
    ],
    recommended: [
      "콘텐츠 좋아요/응원: 다중 선택 + 카운트 표시",
      "사용자 한 표: single + hideCount",
    ],
  },
  GreetingHeader: {
    name: "GreetingHeader",
    examplesHtml: {
      do: '<nds-greeting-header name="이정민" greeting="좋은 아침이에요"\n  question="오늘 기분은 어떠세요?"></nds-greeting-header>',
      dont: '<!-- greeting / question 을 slot 으로 — 둘 다 attribute 사용 -->\n<nds-greeting-header name="A"><span slot="greeting">좋은 아침</span></nds-greeting-header>',
    },
    summary:
      "홈 인삿말 카드. 사용자 호칭({name}님 자동) + 인삿말 + 질문 + 액션 슬롯(MoodSelector 등).",
    pitfalls: [
      "greeting은 시간대 자동 인식 X — 외부에서 '좋은 아침이에요' 같은 시간대 표현 결정.",
      "name에 '님' 직접 붙이지 말 것 — 컴포넌트가 자동.",
      "tone='primary'는 카드 위에 또 카드를 올릴 때(흰 배경 위) 시각 분리에 유용.",
    ],
    recommended: [
      "홈 진입: actions={<MoodSelector />}로 첫 인터랙션 결합",
      "마이페이지: trailing={<Avatar />}",
    ],
  },
  TipCard: {
    name: "TipCard",
    examplesHtml: {
      do: '<nds-tip-card tone="info" label="팁" tip-title="더 잘 자려면"\n  description="자기 1시간 전엔 화면을 멀리해보세요"></nds-tip-card>',
      dont: '<!-- TipCard 를 위기/긴급 안내에 사용 — 시그널 강도가 부족 -->\n<nds-tip-card tone="info" tip-title="자해 충동이 든다면"></nds-tip-card>',
    },
    summary:
      "한 줄 인사이트/팁 카드. info/success/warning/neutral 톤. 위기는 CrisisCallout, 페이지 띠는 Banner.",
    pitfalls: [
      "위기/긴급 안내에 사용하지 말 것 — CrisisCallout이 적합.",
      "페이지 상단 띠 알림은 Banner. TipCard는 콘텐츠 영역 안의 카드.",
      "actionLabel + onClick 함께 줘도 액션 버튼은 stopPropagation됨 (의도적).",
    ],
    recommended: [
      "오늘의 팁: tone='info' label='오늘의 팁' actionLabel='시작하기'",
      "챌린지 격려: tone='success' (완료 후 안내)",
      "홈 카드: 짧은 description + actionLabel",
    ],
  },
  PinPad: {
    name: "PinPad",
    examplesHtml: {
      do: '<nds-pin-pad pin-length="6" label="인증 번호 입력" shuffle></nds-pin-pad>\n<script>el.addEventListener("nds-pin-complete", e => verify(e.detail.value));</script>',
      dont: '<!-- OTP / SMS 인증을 PinPad 로 — OtpInput 가 맞음 (자동 채움 / 붙여넣기) -->\n<nds-pin-pad pin-length="6" label="SMS 인증"></nds-pin-pad>',
    },
    summary: "PIN 키패드. 점 인디케이터 + 숫자 그리드. SMS 인증은 OtpInput, 일반 입력은 Input.",
    pitfalls: [
      "shuffleSeed를 매 렌더 새로 계산하면 키 배치 흔들림 — useMemo로 진입 시점에 고정.",
      "onComplete는 길이 도달 시 1회. 실패 시 value=''로 리셋해야 다시 입력 가능.",
      "OtpInput과 혼동 금지 — PIN은 사용자 비밀, OTP는 외부에서 받는 인증번호.",
    ],
    recommended: [
      "앱 진입 PIN: length=6 (기본)",
      "간편 결제: length=4",
      "보안 키패드: shuffle + 진입 시점 시드",
    ],
  },
  TimePicker: {
    name: "TimePicker",
    examplesHtml: {
      do: '<nds-time-picker value="14:30" step="600"\n  label="상담 시간 선택" min="09:00" max="18:00"></nds-time-picker>\n<script>el.addEventListener("nds-time-change", e => setTime(e.detail.value));</script>',
      dont: '<!-- step 0 — 분/초 단위 무제한 — 예약 정확도 깨짐 -->\n<nds-time-picker value="14:30" step="0"></nds-time-picker>',
    },
    summary: "시간만 선택 (HH:mm). step(초 단위)/min/max 지원. 날짜+시간은 DatePicker와 조합.",
    pitfalls: [
      "step은 초 단위 — 5분이면 300, 15분이면 900.",
      "min/max도 HH:mm 문자열 — Date 객체 X.",
      "상담 슬롯 목록에서 선택은 TimeSlotPicker가 적합 — TimePicker는 자유 시각 입력.",
    ],
    recommended: ["알림: step=300, min='07:00' max='23:00'", "복약: step=900"],
  },
  AddressSearch: {
    name: "AddressSearch",
    examplesHtml: {
      do: '<nds-address-search label="주소" search-label="주소 검색"\n  empty-message="검색 결과가 없어요" helper-text="도로명/지번 모두 가능"></nds-address-search>\n<script>el.addEventListener("address-query", e => search(e.detail.query));</script>',
      dont: '<!-- results 를 string 으로 그대로 박음 — JSON 배열이어야 렌더 가능 -->\n<nds-address-search results="결과 없음"></nds-address-search>',
    },
    summary:
      "주소 검색 + 상세 주소 입력. 검색 자체는 외부 API(카카오/네이버)로 처리, results만 전달.",
    pitfalls: [
      "onSearch는 외부 API 호출 트리거 — 컴포넌트가 직접 검색 안 함.",
      "value는 주소 + 상세 한 묶음 — 폼 state에서 단일 값으로 관리.",
      "loading 상태 동안 검색 버튼 비활성 — 직접 disabled 처리 X.",
    ],
    recommended: [
      "회원가입 주소: query/results를 외부 hook으로 관리",
      "방문 상담 주소: helperText='출입 가능한 주소를 입력해주세요'",
    ],
  },
  ImageCropper: {
    name: "ImageCropper",
    examplesHtml: {
      do: '<nds-image-cropper src="/photo.jpg" shape="circle" output-size="512x512"\n  label="프로필 사진 자르기"></nds-image-cropper>\n<script>\n// 적용 버튼에서 직접 호출:\nconst dataUrl = await document.querySelector("nds-image-cropper").toDataURL();\n</script>',
      dont: '<!-- src 없이 즉시 노출 — 빈 영역만 보임 -->\n<nds-image-cropper shape="circle"></nds-image-cropper>',
    },
    summary: "이미지 자르기 (circle/square). 드래그+줌, ref.toDataURL()로 PNG 추출.",
    pitfalls: [
      "외부 이미지(https) 자르기는 CORS 헤더 필요 — 서버 응답에 Access-Control-Allow-Origin 없으면 dataURL이 비어나옴.",
      "outputSize는 보통 200-400 — 너무 작으면 화질 저하.",
      "CSS transform 기반 변환이라 매우 큰 이미지(>4000px)는 모바일에서 끊길 수 있음.",
    ],
    recommended: ["프로필 사진: shape='circle' outputSize=200", "커버: shape='square' size=320"],
  },
  PullToRefresh: {
    name: "PullToRefresh",
    examplesHtml: {
      do: '<nds-pull-to-refresh threshold="80">\n  <div slot="default">스크롤 콘텐츠…</div>\n</nds-pull-to-refresh>\n<script>\nel.addEventListener("refresh", async () => {\n  await reload();\n  el.endRefresh();\n});\n</script>',
      dont: '<!-- endRefresh() 호출 안 함 — 스피너가 영원히 돌아감 -->\n<nds-pull-to-refresh><div slot="default">…</div></nds-pull-to-refresh>',
    },
    summary: "모바일 풀 투 리프레시. 화면 최상단에서 당기면 onRefresh, Promise 종료 자동 처리.",
    pitfalls: [
      "scrollTop > 0이면 트리거 X — 항상 최상단에서만 동작 (의도적).",
      "데스크톱에서 패턴이 어색 — 모바일 우선 화면에만.",
      "threshold가 너무 작으면 일반 스크롤도 잘못 인식. 64-96 권장.",
    ],
    recommended: [
      "리스트 새로고침: onRefresh={async () => { await refetch(); }}",
      "라벨 커스텀: pullLabel='당겨서 일기 동기화'",
    ],
  },
  WaveformPlayer: {
    name: "WaveformPlayer",
    examplesHtml: {
      do: '<nds-waveform-player src="/voice.mp3" bars="36"\n  peaks="[0.3,0.5,0.7,0.4,0.6,0.8]"></nds-waveform-player>',
      dont: '<!-- raw <audio controls> 로 음성 메모 표시 — 파형/색/진행도 토큰 미적용 -->\n<audio controls src="/voice.mp3"></audio>',
    },
    summary:
      "음성 메시지 재생 (파형 시각화). AudioPlayer가 트랙바 형태라면 WaveformPlayer는 컴팩트 메시지용.",
    pitfalls: [
      "peaks 미지정 시 src 기반 의사 랜덤 — 정확한 파형이 필요하면 서버 메타데이터로 전달.",
      "긴 콘텐츠(>5분)는 AudioPlayer가 더 적합.",
      "막대 개수(bars)는 32-48 권장. 너무 많으면 모바일에서 막대가 1px 미만으로 줄어듦.",
    ],
    recommended: [
      "채팅 음성 메시지: 기본 사용",
      "내 메시지: color=primary, 상대 메시지: color='#666'",
    ],
  },
  MentionInput: {
    name: "MentionInput",
    examplesHtml: {
      do: '<nds-mention-input label="댓글" placeholder="@로 멘션 가능"\n  users=\'[{"key":"alice","name":"앨리스","description":"엔지니어"}]\'></nds-mention-input>\n<script>el.addEventListener("mention", e => track(e.detail.user));</script>',
      dont: '<!-- users 누락 — @ 입력 시 후보가 안 뜸 -->\n<nds-mention-input placeholder="@로 멘션"></nds-mention-input>',
    },
    summary: "@멘션 입력. 자동완성 드롭다운 + 키보드 네비. 트리거 커스텀 (#로 해시태그도 가능).",
    pitfalls: [
      "users는 전체 목록 — 컴포넌트가 자동 필터. 외부에서 미리 필터링하지 말 것.",
      "저장된 텍스트는 plain '@김민지' 형태 — ID로 보존하려면 별도 파싱.",
      "trigger 앞에 공백 또는 시작 위치여야 자동완성 트리거. 'email@a.com' 같은 케이스는 무시됨 (의도적).",
    ],
    recommended: ["단체 채팅 댓글: trigger='@'", "해시태그 자동완성: trigger='#'"],
  },
  Confetti: {
    name: "Confetti",
    examplesHtml: {
      do: '<nds-confetti active count="50" duration="2000"\n  colors=\'["#FF5722","#FFC107","#4CAF50"]\'></nds-confetti>',
      dont: '<!-- 자해/위기 톤 화면 / 부정적 액션 후에 confetti — 시그널 충돌 -->\n<nds-confetti active></nds-confetti>  <!-- after "계정 삭제 완료" -->',
    },
    summary:
      "축하 이펙트 (canvas 기반). active=true가 되는 순간 한 번 발사, onComplete에서 false로 리셋.",
    pitfalls: [
      "active를 항상 true로 두지 말 것 — onComplete에서 false 리셋 필수.",
      "진지한 결과(부정/주의)에 사용 금지 — 톤이 어울리지 않음.",
      "z-index=9999 — 모달 위에도 그려짐. 의도된 동작.",
      "prefers-reduced-motion 사용자 배려: 외부에서 매체 쿼리 체크 후 active를 막을 것.",
    ],
    recommended: ["챌린지 완료: 결과 화면 마운트 시 1회", "첫 가입 환영: 가입 완료 모달 위에 발사"],
  },
  CommentItem: {
    name: "CommentItem",
    examplesHtml: {
      do: '<nds-comment-item author="이정민" time="2시간 전" text="공감해요!" show-reply>\n  <img slot="avatar" src="/u.jpg" alt="" />\n</nds-comment-item>\n<script>el.addEventListener("nds-comment-reply", e => focusReply(e.detail.author));</script>',
      dont: '<!-- text 를 slot 으로 — text 는 attribute 사용 -->\n<nds-comment-item author="A"><p>본문</p></nds-comment-item>',
    },
    summary:
      "댓글 한 건. 작성자/시간/본문 + 좋아요/답글 슬롯 + 답글 트리(replies). 본문 줄바꿈 자동 보존.",
    pitfalls: [
      "답글에는 isReply=true로 들여쓰기 시각 강조. 빠뜨리면 평면적으로 보임.",
      "likeAction은 슬롯 — LikeButton 컴포넌트를 직접 넘김. 텍스트 버튼만 두지 말 것.",
      "본문은 white-space: pre-wrap — text에 줄바꿈 그대로 넣으면 됨.",
    ],
    recommended: [
      "콘텐츠 댓글: avatar + author + likeAction + onReply",
      "답글 트리: replies={<>... isReply ...</>}",
      "상담사 댓글: authorBadge로 역할 표시",
    ],
  },
  LikeButton: {
    name: "LikeButton",
    examplesHtml: {
      do: '<nds-like-button liked count="42" size="md"></nds-like-button>\n<script>el.addEventListener("nds-like-change", e => persist(e.detail));</script>',
      dont: '<!-- count 를 사용자가 변경한 후 서버에 반영하지 않음 — 새로고침 시 사라짐 -->\n<nds-like-button count="42"></nds-like-button>  <!-- listener 없음 -->',
    },
    summary:
      "좋아요 토글 + 카운트. 클릭 펑 애니메이션, 1000+는 자동 K 변환. ReactionPicker(여러 이모지)와 분리.",
    pitfalls: [
      "liked/count는 controlled — 외부 source of truth + onChange에서 둘 다 갱신.",
      "여러 종류 반응(공감/응원/와우)이 필요하면 ReactionPicker — LikeButton은 단일 좋아요.",
      "카운트가 음수가 되지 않도록 외부 가드.",
    ],
    recommended: [
      "콘텐츠 푸터: size='md' count 자동 K",
      "CommentItem: likeAction={<LikeButton size='sm' />}",
      "primary 톤: activeColor=primary로 좋아요/북마크 같은 의미 강조",
    ],
  },
  ShareSheet: {
    name: "ShareSheet",
    examplesHtml: {
      do: '<nds-share-sheet open sheet-title="공유하기"\n  targets=\'[{"key":"kakao","label":"카카오톡","emoji":"💬"},{"key":"sms","label":"문자","emoji":"✉️"}]\'\n  link="https://nudge.kr/p/1"></nds-share-sheet>\n<script>el.addEventListener("nds-share-target", e => share(e.detail.target));</script>',
      dont: "<!-- targets 누락 — 시트가 비어 보임. 최소 1개 -->\n<nds-share-sheet open></nds-share-sheet>",
    },
    summary:
      "BottomSheet 형태 공유 모달. 4칸 그리드 + 선택적 링크 복사. 외부 SDK(카카오/메시지)는 onClick에서 직접 호출.",
    pitfalls: [
      "컴포넌트가 SDK를 부르지 않음 — targets[i].onClick 안에서 카카오/네이버 등 직접 호출.",
      "link 복사는 navigator.clipboard 사용 — HTTPS 환경 필요. file://나 http://에선 동작 X.",
      "Modal/BottomSheet과 별도. ShareSheet은 그리드 4칸 + 링크 정형 패턴.",
    ],
    recommended: [
      "콘텐츠 공유: 카카오/SMS/이메일/저장 + link",
      "챌린지 인증: 이미지 저장 + 카카오톡",
    ],
  },
  ReviewCard: {
    name: "ReviewCard",
    examplesHtml: {
      do: '<nds-review-card author="홍길동" meta="2025.05.20 · 1회기"\n  rating="5" card-title="정말 좋았어요"\n  body="처음엔 망설였는데 지금은 매주 기다려져요" verified></nds-review-card>',
      dont: '<!-- rating="6" — max(5) 초과로 표시가 깨짐 -->\n<nds-review-card author="…" rating="6"></nds-review-card>',
    },
    summary: "별점 후기 카드 (0.5 단위). 작성자/별점/본문/태그/푸터 슬롯, verified 인증 마크.",
    pitfalls: [
      "rating은 0-5, 0.5 단위. 범위 밖이면 시각적으로 깨짐.",
      "본문 줄바꿈은 white-space: pre-wrap 자동 — body에 \\n 그대로 사용.",
      "footer는 보통 LikeButton/도움됨 버튼. 자유 슬롯이라 텍스트도 가능.",
    ],
    recommended: [
      "상담 후기: verified + tags=['편안함','전문성']",
      "상품 리뷰: meta='구매 인증' + verified",
    ],
  },
  MediaCard: {
    name: "MediaCard",
    examplesHtml: {
      do: '<nds-media-card image-src="/cover.jpg" eyebrow="추천"\n  card-title="명상 시작하기" body="3분짜리 호흡 명상" rating="4.6" clickable></nds-media-card>\n<script>el.addEventListener("nds-media-card-click", () => navigate("/media/1"));</script>',
      dont: '<!-- body 를 slot 으로 — attribute 사용 -->\n<nds-media-card image-src="/c.jpg" card-title="A"><p slot="body">…</p></nds-media-card>',
    },
    summary:
      "이미지 위 / 콘텐츠 아래 세로형 카드. 슬롯 기반 (image · imageOverlay · eyebrow · title · body · footer) + 별점 헬퍼. " +
      "콘텐츠/리뷰/강의/상담사 카드처럼 '미디어 + 메타' 패턴 전반에 사용. 가로 스크롤(모바일) · 그리드(데스크탑) 모두 같은 컴포넌트.",
    pitfalls: [
      "이미지 비율은 imageAspectRatio 로만 조절 — 기본 '4 / 3'. 영상 썸네일은 '16 / 9', 정사각 그리드는 '1 / 1'.",
      "title 은 자동 2줄 클램프, body 도 자동 2줄 클램프 — 외부에서 슬라이스 가공 불필요.",
      "imageOverlay 는 우하단 단일 라벨용 (예: '999+', '02:13'). 좌상단 배지/랭킹은 ProductCard 의 rankingNumber 를 쓰거나 image 슬롯에서 직접 그릴 것.",
      "rating 은 0-5 number — footer 영역에 별 5개 자동 렌더. 0.25 단위 반올림이라 정밀한 0.5 표현은 ReviewCard 사용.",
      "footer 와 rating 은 동시 사용 가능 — footer 가 위, rating 이 아래 row 로 stack. 작성자/메타는 footer 안에 자유 조립.",
      "onCardClick 지정 시 role='button' + Enter/Space 핸들링 자동. CTA 버튼을 footer 에 넣을 때는 e.stopPropagation() 필요.",
      "장문 설명/리치 본문은 Card 사용. MediaCard 는 미디어가 시각 hero 인 진열용.",
      "상품 진열(할인율/가격/적립)은 ProductCard — MediaCard 로 가격 패턴을 흉내내지 말 것.",
    ],
    recommended: [
      '기본: <MediaCard image={<img src="…" />} eyebrow="아임닭" title="닭 무침" body="…" rating={4.5} footer={authorRow} onCardClick={…} />',
      '오버레이: <MediaCard image={…} imageOverlay="999+" title="…" />  // 우하단 라벨',
      '영상 썸네일: <MediaCard imageAspectRatio="16 / 9" imageOverlay="02:13" image={…} title="…" />',
      "그리드: grid-template-columns: repeat(4, 1fr) + gap 16 (데스크탑 4-up).",
      "가로 스크롤: flex + overflow-x:auto + 각 카드 flex:0 0 160px (모바일).",
      "푸터 조립: avatar+name row + meta row 를 footer 슬롯에 직접 — DS가 author/meta props 를 박지 않은 이유.",
    ],
  },
  VotePoll: {
    name: "VotePoll",
    examplesHtml: {
      do: '<nds-vote-poll question="어느 시간대가 좋으세요?"\n  options=\'[\n    {"key":"am","label":"오전","count":24},\n    {"key":"pm","label":"오후","count":48}\n  ]\'\n  voted-key=""></nds-vote-poll>\n<script>el.addEventListener("nds-vote", e => castVote(e.detail.key));</script>',
      dont: "<!-- voted-key 미사용 — 사용자가 매번 다시 투표 가능 -->\n<nds-vote-poll question=\"?\" options='[...]'></nds-vote-poll>",
    },
    summary: "짧은 투표 카드. 옵션 + 결과 바, 투표 후 자동 결과 노출. 본격 설문은 LikertScale.",
    pitfalls: [
      "count는 외부 state — 컴포넌트가 자체로 카운트 추적 안 함. 서버 응답으로 갱신.",
      "votedKey가 있으면 자동 결과 노출. 마감만 보여주려면 showResults + disabled.",
      "임상 척도(PHQ-9 등)는 LikertScale을 쓸 것. VotePoll은 가벼운 의견 수렴용.",
    ],
    recommended: ["커뮤니티: votedKey + onVote에서 서버 호출", "마감 결과: showResults disabled"],
  },
  PriceTag: {
    name: "PriceTag",
    examplesHtml: {
      do: '<nds-price-tag amount="50000" original-amount="100000" prefix="₩" unit="원" size="md" format-thousands></nds-price-tag>',
      dont: "<!-- 할인 표시를 strikethrough 텍스트로 직접 작성 — original-amount 권장 -->\n<span>₩100,000</span> <strong>₩50,000</strong>",
    },
    summary:
      "가격 + 할인율 + 원가. amount/originalAmount 모두 number일 때만 할인율 자동 계산. 0원은 freeLabel.",
    pitfalls: [
      "통화는 prefix($) 또는 unit(원) 중 하나만. 둘 다 쓰면 '$1,000원' 어색.",
      "할인율은 amount/originalAmount 둘 다 number일 때만 자동. 문자열로 넘기면 계산 안 됨.",
      "formatThousands=false로 두면 콤마 없이 표시됨 — 외화/표시 정책에 맞춰 조정.",
    ],
    recommended: [
      "상품 카드: size='lg', 할인 자동",
      "결제 합계: size='md', originalAmount로 절약 표시",
      "구독: amount=29000, unit='원/월'",
    ],
  },
  AmountInput: {
    name: "AmountInput",
    examplesHtml: {
      do: '<nds-amount-input value="10000" prefix="₩" unit="원" label="후원 금액"\n  presets=\'[{"label":"+1만","amount":10000},{"label":"+5만","amount":50000}]\'></nds-amount-input>\n<script>el.addEventListener("amount-change", e => setAmount(e.detail.value));</script>',
      dont: '<!-- 값에 통화기호와 쉼표 직접 박음 — number 파싱이 깨짐 -->\n<nds-amount-input value="₩10,000"></nds-amount-input>',
    },
    summary:
      "큰 금액 입력. 자동 천 단위 콤마, presets(빠른 입력), max/min 클램프. NumberStepper(작은 정수)와 분리.",
    pitfalls: [
      "value는 number | null. 빈 입력은 null (0이 아님).",
      "presets의 set: true = 값 설정, false/미지정 = 누적. 헷갈리지 말 것.",
      "max/min 자동 클램프 — 외부 검증 X. 단, 에러 메시지는 외부에서 helperText로.",
    ],
    recommended: [
      "송금: presets +1만/+5만/전액(set), max=balance",
      "후원: presets에 set:true 4종 (5천/1만/3만/5만)",
    ],
  },
  StatusTimeline: {
    name: "StatusTimeline",
    examplesHtml: {
      do: '<nds-status-timeline current="1" direction="vertical"\n  steps=\'[\n    {"key":"received","label":"접수","time":"05/20"},\n    {"key":"processing","label":"처리 중","time":"05/22"},\n    {"key":"done","label":"완료"}\n  ]\'></nds-status-timeline>',
      dont: '<!-- 이벤트 로그를 status-timeline 으로 — nds-timeline 또는 nds-activity-timeline 사용 -->\n<nds-status-timeline steps=\'[{"key":"e1","label":"5/20 신청"},{"key":"e2","label":"5/21 검사"}]\'></nds-status-timeline>',
    },
    summary:
      "단계 진행 트래커 (가로/세로). current 이전은 완료, 이후는 todo. ActivityTimeline(시간순 로그)과 분리.",
    pitfalls: [
      "current는 현재 진행 인덱스 (0-based). 전부 완료는 current=steps.length.",
      "ActivityTimeline은 자유로운 시간순 로그 — StatusTimeline은 정해진 단계 트래커.",
      "단계 5개 이상은 가로형이 좁아짐 — 세로형 권장.",
    ],
    recommended: [
      "배송 추적: 가로형 4단계, time 표시",
      "상담 진행: 세로형, description으로 단계 설명",
      "신청서: 접수→검토→승인 3단계",
    ],
  },
  FilterBar: {
    name: "FilterBar",
    examplesHtml: {
      do: '<nds-filter-bar\n  options=\'[{"key":"new","label":"신규","count":5},{"key":"hot","label":"인기","count":12}]\'\n  value=\'["new"]\' show-reset></nds-filter-bar>\n<script>el.addEventListener("nds-filter-change", e => apply(e.detail.value));</script>',
      dont: '<!-- options.key 누락 — change event 의 value 가 의미 없는 string -->\n<nds-filter-bar options=\'[{"label":"신규"}]\'></nds-filter-bar>',
    },
    summary:
      "가로 필터 칩 그룹. 다중/단일 선택, 카운트, 자동 초기화. Tabs(라우팅)와 분리 — FilterBar는 list 필터.",
    pitfalls: [
      "single은 라디오와 다름 — 같은 칩 다시 누르면 해제됨.",
      "옵션 8개 이상이면 가로 스크롤. 데스크톱은 Tabs/Drawer 필터 검토.",
      "Tabs는 페이지/뷰 전환, FilterBar는 같은 리스트 안의 필터.",
    ],
    recommended: ["콘텐츠 리스트: 다중 선택 + count", "상담사 분야: single"],
  },
  UserCard: {
    name: "UserCard",
    examplesHtml: {
      do: '<nds-user-card name="이정민" handle="@jeongmin" bio="디자이너" verified layout="row" clickable>\n  <img slot="avatar" src="/u.jpg" alt="" />\n  <nds-button slot="action" color="primary" variant="outlined">팔로우</nds-button>\n</nds-user-card>',
      dont: '<!-- avatar / action 을 slot 없이 children 으로 — 레이아웃이 깨짐 -->\n<nds-user-card name="A"><img src="/u.jpg"><button>팔로우</button></nds-user-card>',
    },
    summary:
      "범용 프로필 미니카드. row/stacked, verified, action 슬롯. CounselorCard(EAP 특화)와 분리.",
    pitfalls: [
      "onClick과 action 동시 사용 가능 — action 클릭은 stopPropagation됨 (의도).",
      "bio는 자동 2줄 클램프. 디테일은 별도 화면으로.",
      "EAP 상담사 전용은 CounselorCard. UserCard는 일반 사용자/멤버용.",
    ],
    recommended: [
      "팔로우 리스트: row + 작은 action 버튼",
      "프로필 모달: stacked + bio + 큰 action",
    ],
  },
  ProductCard: {
    name: "ProductCard",
    examplesHtml: {
      do: '<nds-product-card thumbnail="/p.jpg" product-title="명상 콘텐츠 1년 이용권"\n  price="120000" original-price="180000" discount-percent="33"\n  rating="4.7" review-count="124" clickable></nds-product-card>',
      dont: "<!-- 가격을 숫자 타입으로 넘김 (attribute 는 string) — 표시 깨짐 -->\n<nds-product-card price={120000}></nds-product-card>",
    },
    summary:
      "상품 카드. `size='sm'`(140w 모바일) / `size='md'`(236w 데스크탑) 두 사이즈. " +
      "정사각 썸네일 + 제목(2줄 ellipsis) + 가격 row(할인율% + 가격 + 단위) 가 골격. " +
      "선택 슬롯: `rankingNumber` · `originalPrice`(취소선) · `reward`(적립칩) · `freeShipping` · `pointDiscount`(포인트할인 외곽선칩) · `buyersCount` · `rating` · `reviewCount`. " +
      "숫자(할인율/가격/구매자수/별점)는 Lato, 한글은 Pretendard 로 폰트 분리. 가격은 Lato Black 18 / 할인율은 Lato Medium 18 + statusError.",
    figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1122",
    references: [
      {
        label: "캐시딜 PC 랭킹 리스트 (236w)",
        url: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1122",
      },
      {
        label: "캐시딜 Mobile 풀스펙 (140w)",
        url: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=338-2199",
      },
    ],
    pitfalls: [
      "`price`/`originalPrice`/`reward.amount` 는 모두 number — 자동 천단위 콤마. 외부에서 '13,900' 문자열로 가공해서 넘기지 말 것.",
      "`discountPercent` 는 number (예: 31). 0 또는 undefined 면 자동 숨김 — '0%' 표시 X.",
      "할인율 색은 `cv.textRole.statusError` 시멘틱 — 브랜드별 자동 매핑. raw hex(#ED3E14 등) 로 override 금지.",
      "썸네일 좌상단: `rankingNumber` > `badge` > `soldOut` 우선순위. 동시 지정 시 상위 슬롯만 렌더 — 직접 가드 불필요.",
      "title 은 자동 2줄 ellipsis. size='md' 는 min-height 44px 로 2줄 정렬 보장 — 그 이상 보여주려면 디테일 화면.",
      "가격 단위('원')는 절대 Bold 로 키우지 말 것 — 가격 본문(Black)과 시각 무게 같아짐. Pretendard Regular 12 고정.",
      "`buyersCount` 는 자동 truncate — 10,000 이상은 `9,999+명` 으로 표시. 외부에서 '999,999+' 문자열로 가공해서 넘기지 말 것.",
      "`rating` 은 0-5 number. 정수면 자동 '5.0' 포맷, 소수면 첫째자리까지 (예: 4.7).",
      "`reviewCount` 는 `rating` 없으면 무시됨. 단독 노출 불가 — 평점과 묶음 정보라는 가이드.",
      "`pointDiscount` 외곽선 칩은 모바일(`size='sm'`) 캐시딜 패턴. PC 디자인에는 등장 X — 데스크탑에서 사용 자제.",
      "`rankingNumber` 는 캐시딜 랭킹 노출용. 일반 상품 진열에 임의로 1~N 박지 말 것 — 사용자가 '순위' 로 인지함.",
    ],
    recommended: [
      '기본: <ProductCard thumbnail={url} title="…" discountPercent={31} price={13900} onClick={…} />',
      '캐시딜 PC 랭킹: <ProductCard size="md" rankingNumber={1} originalPrice={20250} discountPercent={31} price={13900} reward={{amount:417}} freeShipping buyersCount={329} rating={5} />',
      "캐시딜 모바일: <ProductCard pointDiscount originalPrice={…} discountPercent={…} price={…} reward={{amount:…}} freeShipping buyersCount={…} rating={…} reviewCount={…} />",
      "가로 스크롤 행: flex container + overflow-x:auto + gap (sm=16, md=25). 캐러셀/랭킹 리스트 패턴.",
      "그리드: grid-template-columns:repeat(N, 140px or 236px) + gap.",
      "할인이 없으면 `discountPercent` / `originalPrice` 모두 생략 — 가격만 단독 렌더 (정상가 상품).",
      "품절: `soldOut` + thumbnail — 자동 오버레이 (badge/rankingNumber 자동 숨김).",
    ],
    sizeMatrix: {
      sm: "140w (모바일) — 썸네일 140×140 · 캐러셀/그리드. 기본값.",
      md: "236w (데스크탑) — 썸네일 236×236 · title min-height 44px 로 2줄 정렬. PC 캐시딜 랭킹 리스트용.",
      thumbnail: "정사각 1:1 · border subtle 1px · radius md(8) · object-cover",
      gapThumbnailToMeta: "8px (spacing[8]) — root flex gap",
      gapMeta: "6px (spacing[6]) — title ↔ chips ↔ price ↔ footer",
      title: "Body3 14/20 Regular · cv.textRole.strong · 2줄 ellipsis",
      discount: "Lato Medium 18/24 · cv.textRole.statusError · letter-spacing -0.3px",
      price: "Lato Black 900 18/24 · cv.textRole.strong · letter-spacing -0.3px",
      currency: "Caption2 12/16 Regular Pretendard · cv.textRole.strong",
      originalPrice: "Body3 14/16 Regular Lato · cv.textRole.muted · line-through",
      rewardChip:
        "label 11/14 Medium · cv.surface.statusError bg · CashdealPointIcon 16 + 금액(Bold) + '적립'(Medium) · radius sm(4)",
      shippingChip:
        "label 11/14 Medium · cv.fill.neutralSubtle bg · cv.textRole.subtle · radius sm(4)",
      pointDiscountChip:
        "label 11/14 Bold · cv.surface.default + border subtle 1px · CashdealPointIcon 16 + '포인트할인' · radius sm(4)",
      rankingBadge: "36×36 · #f16d4d bg · 흰 텍스트 Bold 20 · radius md(8) · 썸네일 좌상단 8/8",
      badge: "label 11/14 Bold · cv.fill.statusError bg · cv.textRole.inverse · radius sm(4)",
      rating: "StarFilledIcon 14 + Lato Bold 14 평점 + Caption Regular muted 리뷰수",
      buyers: "Lato/Pretendard 14/16 — 명수(Bold) + ' 구매중'(Regular). 10,000+ → '9,999+명'.",
      soldOutOverlay: "rgba(255,255,255,0.85) · cv.textRole.subtle · Body3 Bold '품절'",
      fontStack:
        "숫자(할인율/가격/구매자수/별점)는 'Lato', Pretendard, sans-serif — Lato 미로드 시 Pretendard Bold 로 graceful fallback (Lato Black 900 → Pretendard 700).",
    },
    stateMatrix: {
      default: "썸네일 + 메타. card border 없음 — 썸네일에만 border-subtle.",
      hover: "opacity 0.85 (clickable 일 때만, PC only).",
      soldOut: "썸네일에 화이트 오버레이 + '품절' 텍스트. rankingNumber/badge 자동 숨김.",
      noDiscount: "discountPercent 미지정/0 → discount span 자체 렌더 X.",
      ranking: "rankingNumber 지정 시 좌상단 36×36 오렌지 사각 배지. badge 보다 우선.",
      fullCashdeal:
        "originalPrice + discountPercent + price + reward + freeShipping + buyersCount + rating — PC 랭킹 리스트 풀스펙.",
    },
    accessibility: [
      "onClick 있으면 role='button' + tabIndex + Enter/Space 핸들링 자동.",
      "thumbnailAlt 지정 권장 — 장식 이미지면 빈 문자열.",
      "rankingNumber 는 aria-label='랭킹 N위' 로 자동 노출.",
      "rating 은 aria-label='별점 5.0점' 자동 노출 — 별 아이콘은 aria-hidden.",
      "price 숫자는 시각 강조를 위해 Lato 폰트지만 일반 텍스트 — screen reader 가 그대로 읽음.",
    ],
    usagePolicy: {
      useFor: [
        "상품 진열 카드 (가로 스크롤 행, 그리드)",
        "캐시딜 랭킹 리스트 (size='md' + rankingNumber)",
        "할인율 + 원가 + 적립 + 무료배송 등 메타가 풍부한 상품 진열",
      ],
      doNotUseFor: [
        "장문 설명이 핵심인 콘텐츠 → Card",
        "사용자 프로필 / 상담사 → UserCard / CounselorCard",
        "쿠폰 진열 → CouponCard",
        "임의 width(180/200 등) — sm/md 두 사이즈만 SSOT.",
      ],
      limits: {
        titleLines: 2,
        rankingBadgeAndSoldOutMutuallyExclusive: true,
        sizes: "sm(140) / md(236) — 임의 너비 override 비권장",
        priceFontFamily: "Lato (숫자 전용)",
        buyersCountAutoTruncate: "10,000 이상은 '9,999+명'",
      },
    },
  },
  CouponCard: {
    name: "CouponCard",
    examplesHtml: {
      do: '<nds-coupon-card discount="30%" coupon-title="첫 상담 30% 할인"\n  expiry="2026-06-30 까지" action-label="사용하기"></nds-coupon-card>\n<script>el.addEventListener("nds-coupon-action", () => useCoupon());</script>',
      dont: '<!-- expiry 누락 — 사용자가 유효기간을 모름 -->\n<nds-coupon-card discount="30%" coupon-title="할인"></nds-coupon-card>',
    },
    summary: "쿠폰 카드. 좌측 할인율(큰 숫자) + 우측 정보·사용 버튼. 점선 + 반원 컷아웃 자동.",
    pitfalls: [
      "discount와 discountSuffix는 분리 — '30%할인'이 아니라 '30%' + '할인'.",
      "disabled=true면 버튼 자동 disabledLabel로 변경.",
      "쿠폰 발급/사용 처리는 외부 API — onAction 안에서.",
    ],
    recommended: [
      "% 할인: discount='30%' discountSuffix='할인'",
      "금액 할인: discount='5,000' discountSuffix='원'",
      "무료: discount='무료' discountSuffix=''",
    ],
  },
  OrderSummaryCard: {
    name: "OrderSummaryCard",
    examplesHtml: {
      do: '<nds-order-summary-card title="결제 요약"\n  rows=\'[{"label":"상품 가격","value":"50,000원"},{"label":"할인","value":"-5,000원"}]\'\n  total-label="합계" total="45,000원"></nds-order-summary-card>',
      dont: '<!-- rows 를 string 으로 — 줄이 렌더되지 않음. 반드시 JSON 배열 -->\n<nds-order-summary-card rows="상품 50000"></nds-order-summary-card>',
    },
    summary: "결제/예약 요약 카드. 라벨:값 행 + 합계 + CTA 슬롯. emphasis로 할인/안내 강조.",
    pitfalls: [
      "할인은 emphasis='discount' (빨간색). 음수 금액에 직접 색칠하지 말 것.",
      "rows 너무 많으면(8+) 한 화면 정보 과다 — 핵심만 추려서.",
      "total은 ReactNode — PriceTag 또는 문자열 자유.",
    ],
    recommended: [
      "결제: 상품 금액/쿠폰/포인트/배송비 + 합계",
      "EAP 무료 상담: 회사 부담 emphasis='info'",
    ],
  },
  CardVisual: {
    name: "CardVisual",
    examplesHtml: {
      do: '<nds-card-visual brand="nudge-eap" number="1234 56•• •••• 7890" holder="홍길동" expiry="12/29"></nds-card-visual>',
      dont: '<!-- 카드 번호/만료일을 자체 HTML 로 픽셀 흉내 — 토큰/브랜드 룰이 적용 안 됨 -->\n<div class="fake-card"><span>1234…</span></div>',
    },
    summary: "신용/체크카드 비주얼. 8개 브랜드 톤 내장. 마지막 4자리만 표시 (자동 마스킹).",
    pitfalls: [
      "전체 카드번호 넣어도 마지막 4자리만 표시 — 보안 위해 의도적.",
      "만료된 카드는 disabled + label='만료됨' 패턴.",
      "그라데이션 배경은 토큰이 아닌 브랜드 정체성 — 외부에서 override 자제.",
    ],
    recommended: ["결제 수단 관리: brand별 자동 색", "별명: label='용돈 카드'"],
  },
  DataTable: {
    name: "DataTable",
    examplesHtml: {
      do: '<nds-data-table\n  columns=\'[{"key":"name","title":"이름","sortable":true},{"key":"age","title":"나이"}]\'\n  data=\'[{"name":"홍길동","age":30}]\'\n  size="md" responsive="cards" row-clickable></nds-data-table>\n<script>\nel.addEventListener("nds-data-table-sort", e => sort(e.detail));\nel.addEventListener("nds-data-table-row-click", e => openRow(e.detail.row));\n</script>',
      dont: "<!-- 어드민/CMS 페이지에 DataTable 사용 — 어드민은 antd Table -->\n<nds-data-table columns='...'></nds-data-table>",
    },
    summary:
      "정렬·클릭·빈 상태·로딩·모바일 카드 변환을 모두 갖춘 표. 사용자 앱(약 복용 이력 등)과 운영툴 양쪽에 사용.",
    pitfalls: [
      "CMS/어드민은 antd Table을 우선 — DataTable은 사용자 앱(특히 모바일 cards 모드)에서 강점.",
      "columns[].key는 데이터 객체의 실제 key 또는 임의 식별자. render가 있으면 key 자체는 매핑 안 해도 됨.",
      "정렬은 controlled — sortKey/sortDirection/onSort 셋을 부모에서 관리. 컴포넌트가 자체 정렬하지 않음.",
      'responsive="cards"는 max-width 640px에서만 카드로 전환. cardLabel/hideOnCard로 카드 모드 표시 조절.',
      "rowKey는 함수 — index 사용은 reorder 시 버그. 가능하면 row.id 같은 안정적 키.",
    ],
    recommended: [
      '사용자 앱 약 복용 이력: responsive="cards" + size="sm"',
      "리스트가 길면 외부에 Pagination 컴포넌트와 조합",
    ],
    interactivePattern:
      "행 클릭으로 상세 진입. 정렬 가능 컬럼은 sortable: true 명시 + 외부에서 정렬 처리.",
  },
  ContentViewer: {
    name: "ContentViewer",
    examplesHtml: {
      do: '<nds-content-viewer html="&lt;p&gt;안전한 본문&lt;/p&gt;"></nds-content-viewer>',
      dont: '<!-- 사용자 입력 HTML 을 no-sanitize 로 그대로 — XSS 위험 -->\n<nds-content-viewer no-sanitize html="…사용자 HTML…"></nds-content-viewer>',
    },
    summary:
      "HTML/리치 텍스트 본문 렌더러. 위험 태그 자동 정리 + 이미지 lazy + 외부 링크 noopener 자동.",
    pitfalls: [
      "html prop은 가능한 한 호출부에서 sanitize한 안전한 HTML을 넘기는 게 정석. 컴포넌트 내장 sanitize는 보완책 (script/iframe/on*=/javascript: 정도만 정리).",
      "사용자 입력 HTML은 반드시 서버나 DOMPurify 같은 라이브러리로 1차 처리 후 넘길 것 — 내장 sanitize는 알려진 attack vector만 커버.",
      "내부 링크는 그대로 — http(s)로 시작하는 외부 링크에만 target=_blank + rel='noopener noreferrer' 자동.",
      "본문 안 table/blockquote/pre 까지 표준 스타일 적용됨 — 검사 해설/명상 가이드 등 긴 본문에 적합.",
    ],
    recommended: [
      "검사 결과 해설, 명상 가이드 본문, 정신건강 콘텐츠 — externalLinkBlank로 외부 참고자료 안전 노출",
      "이미지 많은 본문은 imageLazy로 초기 렌더 부담 감소",
    ],
  },
  AttachmentItem: {
    name: "AttachmentItem",
    examplesHtml: {
      do: '<nds-attachment-item name="report.pdf" size="2.4MB" file-type="pdf" status="done" href="/files/report.pdf"></nds-attachment-item>\n<nds-attachment-item name="audio.m4a" status="uploading" progress="42"></nds-attachment-item>',
      dont: '<!-- status 없이 progress 만 — 업로드/완료/에러 어느 상태인지 모호 -->\n<nds-attachment-item name="x.pdf" progress="42"></nds-attachment-item>',
    },
    summary:
      "이미 첨부된 파일을 보여주는 행 — FileUpload(업로드 영역)와 역할 분리. 진단서/처방전 등 EAP 의료 파일 표시.",
    pitfalls: [
      "FileUpload와 페어로 자주 사용 — FileUpload의 value(File[])를 매핑해서 AttachmentItem으로 노출하는 패턴.",
      "fileType 미지정 시 name 확장자에서 자동 추론 (pdf/image/video/audio/document/archive). 추론 실패는 'other'.",
      'status="uploading"이면 자동으로 다운로드 버튼 숨김 — progress 함께 사용.',
      'status="error" + errorMessage로 거부 사유 지속 노출. Toast보다 명확.',
      "href와 onDownload 둘 다 제공 가능 — href가 있으면 <a download>, 없으면 button.",
    ],
    recommended: [
      '진단서 첨부: name + size + status="done" + href + onRemove',
      '업로드 진행 중: status="uploading" + progress 폴링',
    ],
  },
  MediaThumbnail: {
    name: "MediaThumbnail",
    examplesHtml: {
      do: '<nds-media-thumbnail src="/thumb.jpg" alt="썸네일"\n  width="120" fit="cover" rounded="md"></nds-media-thumbnail>',
      dont: '<!-- alt 누락 + fallback 없음 — 로드 실패 시 빈 박스 -->\n<nds-media-thumbnail src="/thumb.jpg"></nds-media-thumbnail>',
    },
    summary:
      "일반 이미지 표준 — aspectRatio + fit + rounded + lazy + fallback + placeholder. Avatar(사람 얼굴)와 다른 콘텐츠 이미지용.",
    pitfalls: [
      "Avatar는 사람 얼굴/이니셜 전용 — 콘텐츠 썸네일·검사 결과 이미지·일반 이미지는 MediaThumbnail.",
      "aspectRatio 미지정 시 부모 너비에 따라 의도치 않은 높이가 잡힐 수 있음 — 카드/그리드에서는 명시 권장.",
      'alt는 필수 — 장식 이미지면 빈 문자열(alt="") 명시.',
      "fallbackSrc는 onError 시 한 번 시도 → 그래도 실패면 placeholder. 무한 루프 방지를 위해 fallback 자체가 또 실패하면 placeholder만 표시.",
      'rounded="pill"는 정사각형(aspectRatio="1/1")과 함께 써야 자연스러움 — 직사각형에 pill은 길쭉한 알약 모양.',
    ],
    recommended: [
      '콘텐츠 카드 썸네일: aspectRatio="16/9" rounded="md"',
      '리스트 썸네일: aspectRatio="1/1" rounded="md" width=64',
      '프로필성 이미지지만 Avatar로 처리 어려운 케이스: aspectRatio="1/1" rounded="pill"',
    ],
  },
  PopularPosts: {
    name: "PopularPosts",
    examplesHtml: {
      do: '<nds-popular-posts module-title="요즘 인기 글" show-more\n  tabs=\'[{"key":"day","label":"오늘"},{"key":"week","label":"이번 주"}]\'\n  active-tab="day"\n  items=\'[{"id":"1","title":"불안 다스리는 법","count":1024}]\'\n  item-clickable></nds-popular-posts>\n<script>el.addEventListener("nds-popular-item-click", e => navigate(`/post/${e.detail.item.id}`));</script>',
      dont: "<!-- active-tab 을 index 로 — key 가 정답 -->\n<nds-popular-posts tabs='[...]' active-tab=\"0\"></nds-popular-posts>",
    },
    summary:
      "사이드바용 커뮤니티 인기글 랭킹 모듈. Header(제목 + 더보기) + Tabs(기간/정렬 pill 5개) + ranked row 리스트 의 3단 레이어. " +
      "Row = Rank(Bold) + Title(truncate) + Count(red, `[N]` / 999 초과 `[+999]`). " +
      "PC 사이드바 폭(≈353w) 가정 — 모바일은 별도 모듈로 분기.",
    figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=148-68",
    pitfalls: [
      "Rank 는 컴포넌트 내부에서 두 자리 zero-padded 로 자동 변환 — `items` 에 별도 rank 필드 넘기지 말 것. 배열 순서가 곧 순위.",
      "Count 는 컴포넌트가 자동 포맷 (`[N]` / 999 초과 `[+999]`) — 외부에서 문자열로 가공해서 넘기지 말 것.",
      "최대 10개 row 까지만 노출하는 것이 디자인 가이드. 초과분은 시각적으로는 잘리지 않지만, `onMoreClick` 으로 별도 페이지/모달로 분기할 것.",
      "Active 탭은 한 그룹에 하나만 — `activeTabKey` 단일 키 prop 사용. 자동으로 brand-subtle pill + brand text 톤 적용.",
      "탭 active 톤은 브랜드 시멘틱(`cv.surface.brandSubtle` + `cv.textRole.brand`)으로 자동 매핑 — raw hex 로 override 금지. 브랜드별 실제 색은 `packages/tokens/src/brands/{geniet,nudge-eap,trost}.semantic.ts` SSOT 참조.",
      "Rank 색을 강조색(red/brand 등)으로 변경 금지 — Rank 는 보조 정렬 지표일 뿐, Count(red) 와 시각 위계 충돌.",
      "Count 를 title 왼쪽에 두는 등 순서 변경 금지 — 항상 rank → title → count.",
      "Title 은 한 줄 truncate 고정 (CSS `text-overflow: ellipsis`). 두 줄 wrap 시 시각적 그리드 깨짐.",
      "`onMoreClick` 미지정 시 더보기 영역이 숨겨짐 — '더보기' 가 필요한 화면이면 콜백 필수.",
      "`tabs` 없이도 동작 (탭 없는 단일 랭킹) — 빈 배열/undefined 면 탭 영역 자체 숨김.",
    ],
    recommended: [
      "기본 사이드바 (5탭 + 더보기 + 클릭): <PopularPosts tabs={tabs} activeTabKey={key} onTabChange={setKey} items={items} onMoreClick={goList} onItemClick={(item)=>nav(item.id)} />",
      "탭 없는 단일 랭킹 (단일 기간): <PopularPosts items={items} onMoreClick={goList} />",
      "items 길이는 10 이하로 유지 — 11번째 row 부터는 별도 페이지/모달로 분기 (가이드 준수).",
    ],
    sizeMatrix: {
      containerWidth: "353px (PC 사이드바 폭 가정)",
      containerPadding: "20px (--semantic-inset-card-large)",
      containerRadius: "8px (--radius-md)",
      containerBorder: "1px var(--semantic-border-subtle-default)",
      gapBetweenSections: "16px (header ↔ tabs ↔ list) — gap-loose",
      tabHeight: "32px (pill)",
      tabPadding: "6px 12px",
      tabRadius: "pill (height/2 = 16px) — radius.pill 토큰",
      tabGap: "8px",
      tabFontActive: "Body3 14/20 Bold",
      tabFontInactive: "Body3 14/20 Medium",
      rowHeight: "32px (min) · py 6",
      rowGap: "4px (rank ↔ title ↔ count)",
      rankWidth: "21px (두 자리 고정폭)",
      titleType: "Body3 14/20 Regular · cv.textRole.strong · 한 줄 truncate",
      countType: "Body3 14/20 Medium · cv.textRole.statusError · whitespace-nowrap",
      headerTitleType: "Headline5 18/26 Bold · cv.textRole.strong",
      moreType: "Body3 14/20 Regular · cv.textRole.subtle + 16px chevron",
    },
    stateMatrix: {
      tabDefault: "bg cv.surface.section · text cv.textRole.subtle · Medium",
      tabHover: "bg cv.surface.subtle · text cv.textRole.strong (PC only)",
      tabActive: "bg cv.surface.brandSubtle · text cv.textRole.brand · Bold",
      rowDefault: "static row (button 시멘틱은 onItemClick 있을 때만)",
      rowHover: "opacity 0.7 (button 일 때만, PC only)",
      moreHover: "text cv.textRole.strong",
      note: "탭 active 톤은 시멘틱 토큰 참조이므로 브랜드 theme(`brands/*.semantic.ts`)에 따라 자동 적용. 브랜드별 raw 매핑은 토큰 파일이 SSOT.",
    },
    accessibility: [
      "탭은 role='tab' + aria-selected, 그룹은 role='tablist' 자동 부여 — 외부에서 role 덮어쓰지 말 것.",
      "Row 클릭이 필요하면 onItemClick 사용 — 자동으로 <button> 으로 렌더되어 키보드 Enter/Space 인터랙션 보장.",
      "더보기 버튼은 <button type='button'> — form 내부에 두어도 submit 안 됨.",
    ],
    usagePolicy: {
      useFor: [
        "PC 사이드바 커뮤니티 인기글 랭킹 (메인·카테고리·리스트 페이지 공통)",
        "기간/정렬 탭으로 전환되는 ranked Top-N 위젯",
      ],
      doNotUseFor: [
        "모바일 화면 (별도 모듈로 분기 — 사이드바 폭 가정)",
        "11개 이상의 동일 리스트 (별도 페이지·모달로)",
        "이미지/썸네일 포함 카드형 리스트 → Card 또는 List + ListItem",
        "텍스트 검색 키워드 트렌드 → TrendingKeywords",
      ],
      limits: {
        maxItems: 10,
        maxTabs: "5 권장 (스크롤 가능하지만 가독성 저하)",
        countCap: "999 초과 시 자동 '+999' 캡",
        rankWidth: "21px 고정 — 두 자리 zero-padded",
      },
    },
  },
  FloatingCtaBanner: {
    name: "FloatingCtaBanner",
    examplesHtml: {
      do: '<nds-floating-cta-banner caption="상담사 매칭이 완료됐어요"\n  cta-text="확인하기" floating size="mobile" bottom-offset="80"></nds-floating-cta-banner>\n<script>el.addEventListener("nds-floating-cta-click", () => navigate("/match"));</script>',
      dont: '<!-- floating + bottom-offset 0 — 하단 탭바를 가림 -->\n<nds-floating-cta-banner floating bottom-offset="0"></nds-floating-cta-banner>',
    },
    summary:
      "페이지 하단 sticky CTA 배너. pill (radius 100) + brand border 1px + shadow. " +
      "좌측 일러스트(leadingIcon) + 캡션(보조) + 강조 CTA 텍스트 + 우측 chevron 아이콘. " +
      "기본 `floating=true` 시 position:fixed 로 화면 하단 중앙 자동 고정.",
    figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=91-3",
    pitfalls: [
      "Chevron 은 텍스트 '>' 로 그리지 말 것 — 내부에서 `<ChevronRightIcon>` 아이콘으로 자동 렌더. showArrow=false 로 숨김만 가능.",
      "Border / CTA / Arrow 색은 모두 시멘틱(`cv.borderRole.brand`, `cv.textRole.brand`) 참조 — raw hex override 금지. 브랜드별 실제 매핑(예: Geniet mint, NudgeEAP blue)은 `packages/tokens/src/brands/*.semantic.ts` 에 정의.",
      "CTA 텍스트 색은 `cv.textRole.brand` 고정 — underline / weight 변경 / 다른 강조색 적용 금지.",
      "radius 는 항상 pill (`radius.pill`) — 직사각형 radius 8/12 변형 금지 (Figma DO/Don't 룰).",
      "floating=true 시 부모에 `position: relative` 가 있어도 화면 fixed — 컨테이너 내부 sticky 가 필요하면 floating=false + 부모에서 직접 position:sticky 처리.",
      "캡션은 1줄 ellipsis 고정 — 두 줄 wrap 금지. 메시지 길면 ctaText 로 옮기거나 캡션 자체를 줄일 것 (단일 메시지 + 단일 액션 원칙).",
      "다중 CTA(버튼 2개 이상) 사용 금지 — 이 컴포넌트는 단일 액션 floating 진입 배너 전용.",
      "PC size 는 height 68 / Mobile size 는 height 60 — 두 사이즈 외에 커스텀 height 금지 (specs 표 기준).",
    ],
    recommended: [
      '검색 결과 0건 또는 카테고리 진입 시: <FloatingCtaBanner caption="찾는 음식이 없으신가요?" ctaText="음식 직접 등록하러 가기" leadingIcon={<SaladIcon/>} onClick={…} />',
      '반응형: 모바일 < 768px 에서 size="mobile" 로 분기 (자동 분기 없음 — 외부 미디어쿼리/JS 로 결정).',
      "Bottom Nav / Safe Area 가 있으면 `bottomOffset` 을 그 만큼 더해 겹침 방지.",
      "인라인 배치가 필요하면 floating=false — 부모 폭에 맞춰 inline-flex 로 렌더.",
    ],
    sizeMatrix: {
      pcWidth: "440px (min-width) — fixed 추천",
      pcHeight: "68px",
      pcPadding: "14px 24px 14px 16px",
      pcIcon: "48 × 48",
      pcCaption: "Body3 14/20 Regular · cv.textRole.subtle",
      pcCtaText: "Body1 16/24 Bold · cv.textRole.brand",
      pcArrow: "20 × 20 · ChevronRightIcon · currentColor (brand)",
      pcBottomOffset: "32px (기본)",
      pcGap: "12px (icon ↔ text)",
      mobileWidth: "288px (min-width)",
      mobileHeight: "60px",
      mobilePadding: "12px 16px 12px 12px",
      mobileIcon: "32 × 32",
      mobileCaption: "Caption2 12/16 Regular · cv.textRole.subtle",
      mobileCtaText: "Caption1 13/18 Bold · cv.textRole.brand",
      mobileArrow: "16 × 16 · ChevronRightIcon",
      mobileBottomOffset: "16px (기본)",
      mobileGap: "8px",
      radius: "pill (radius.pill = 9999) — 완전 캡슐형",
      border: "1px solid cv.borderRole.brand",
      background: "cv.surface.default (#FFFFFF 고정)",
      shadow: "shadow[2] = 0 4px 12px rgba(0,0,0,0.10) (가이드의 0.08 와 가장 가까운 토큰)",
    },
    stateMatrix: {
      default: "border brand · shadow overlay (shadow[2])",
      hover: "translateY(-1px) · shadow[3] — PC only",
      active: "translateY(0) · shadow[1]",
      floating:
        "position:fixed · left:50% · translateX(-50%) · z-index sticky(200) · bottom=bottomOffset",
      note: "Disabled 상태는 정의하지 않음 — CTA 진입 트리거이므로 항상 active.",
    },
    accessibility: [
      "전체가 <button type='button'>. ariaLabel 미지정 시 ctaText 가 string 이면 그걸 그대로 사용.",
      "leadingIcon / arrow 는 aria-hidden — 음성 인식 시 ctaText 만 읽힘.",
      "ctaText 가 ReactNode(아이콘 포함 등) 면 ariaLabel 명시적으로 넘길 것.",
    ],
    usagePolicy: {
      useFor: [
        "음식/검색 결과 0건 페이지 하단 floating 진입 배너 (Geniet 식단 도메인 패턴)",
        "단일 메시지 + 단일 액션의 하단 sticky CTA 모듈",
      ],
      doNotUseFor: [
        "다중 액션 (버튼 2개 이상) — Bottom Sheet 또는 Modal",
        "긴 안내문 + 액션 — Banner (페이지 상단 띠) 또는 CrisisCallout",
        "토스트성 일시 알림 → Toast / Snackbar",
        "사이드바 카드형 진입 → Card",
      ],
      limits: {
        captionLines: 1,
        ctaTextLines: 1,
        actionsPerBanner: 1,
        radiusVariants: "pill 만 (직사각형 금지)",
      },
    },
  },
  ImageUpload: {
    name: "ImageUpload",
    examplesHtml: {
      do: '<nds-image-upload state="empty" accept="image/*"\n  upload-label="사진 추가" size-hint="JPG/PNG · 최대 5MB"></nds-image-upload>\n<script>el.addEventListener("file-select", e => upload(e.detail.files));</script>',
      dont: "<!-- state 를 자동으로 'uploaded' 로 바꾸지 않음 — 호스트에서 명시적 갱신 필요 -->\n<nds-image-upload state=\"empty\"></nds-image-upload>  <!-- upload 끝나도 그대로 -->",
    },
    summary:
      "캐시워크 포 비즈니스 admin 의 단일 이미지 업로드 위젯. 150×150 preview + 우측 업로드 버튼(135×44) + 사이즈 안내 가로 레이아웃. state(empty/uploaded/error) 별 시각 분기.",
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3078-617",
    pitfalls: [
      '`<input type="file">` 는 internal trigger — 외부에서 별도 file picker 를 마운트하거나 `onUploadClick` 안에서 직접 input.click() 호출 금지.',
      "Error 상태에서 박스 전체를 빨갛게 칠하지 말 것 — gauge: dashed `fill.statusError` border + soft `surface.statusError` bg. 단색 빨강은 가이드 위반.",
      '`state="uploaded"` 인데 `imageUrl` 을 안 넘기면 placeholder 가 그대로 노출. 항상 묶어서 관리.',
      "다중 업로드가 필요하면 이 컴포넌트를 N 개 늘어놓지 말고 별도 갤러리/멀티 업로더로 분기. `multiple` prop 은 OS picker 차원만 지원.",
      "우상단 X 버튼은 `onRemove` 가 있어야만 노출 — uploaded 상태에서도 onRemove 없으면 안 보임.",
    ],
    recommended: [
      "기본: <ImageUpload state={state} imageUrl={url} onFileSelect={files => upload(files[0])} onRemove={() => reset()} />",
      '권장 사이즈 안내가 다르면 `sizeHint="4:3 / 1024×768 권장"` 같이 명시.',
      'Error 메시지를 도메인별 카피로: `errorText="이미지를 등록해 주세요."`.',
    ],
    sizeMatrix: {
      previewBox: "150 × 150 · border-radius md(8) · object-cover",
      uploadButton: "135 × 44 · fill.neutralSubtle bg · text.normal · radius md(8) · body2 Medium",
      helperRow: "caption1 Regular · text.subtle (error 상태에서 text.statusError + 14px ic/error)",
      sizeHint: "caption1 Regular · text.subtle",
      gapPreviewCol: "8px (spacing[8]) — preview ↔ helper",
      gapRightCol: "12px (spacing[12]) — uploadButton ↔ sizeHint",
      gapBetweenCols: "24px (spacing[24]) — preview col ↔ right col",
    },
    stateMatrix: {
      empty: "dashed border.normal + surface.subtle bg + 'No Image' (text.muted body3)",
      uploaded:
        "solid border.normal + 이미지 cover + 우상단 X 버튼(InputdeleteIcon, fill.statusError circle)",
      error:
        "dashed fill.statusError + surface.statusError bg + 'No Image' text.statusError + helper 아이콘(ic/error 14px) + errorText",
    },
    accessibility: [
      '우상단 X 버튼: `aria-label="이미지 제거"` 자동 부착.',
      "Error 상태 helper 의 14px InfoIcon 은 장식 — text 가 의미를 그대로 전달.",
      'file picker 트리거는 standard `<input type="file">` — 키보드 접근(Enter/Space) 자동 지원.',
    ],
    usagePolicy: {
      useFor: [
        "캐시워크 포 비즈니스 admin 의 콘텐츠/상품/배너 등록 폼 단일 이미지 슬롯",
        "권장 사이즈 명시가 필요한 업로드 영역 (예: 200×200, 4:3)",
        "user-app 에서도 호환 — 시멘틱 토큰 cascade 로 자동 브랜드 톤",
      ],
      doNotUseFor: [
        "다중 이미지 (gallery / carousel) — 별도 multi-uploader 컴포넌트",
        "사용자 아바타 업로드 — Avatar + 별도 modal 패턴",
        "파일(비이미지) 업로드 — AttachmentItem / 별도 컴포넌트",
      ],
      limits: {
        previewSize: "150×150 (변경 비권장)",
        uploadButtonSize: "135×44 (변경 비권장)",
        states: 3,
      },
    },
  },
  ActionChip: {
    name: "ActionChip",
    examplesHtml: {
      do: '<nds-action-chip label="필터 추가">\n  <svg slot="icon" viewBox="0 0 24 24">…</svg>\n</nds-action-chip>',
      dont: '<!-- nds-action-chip 대신 nds-chip + onclick 으로 액션 트리거 흉내 -->\n<nds-chip onclick="addFilter()">+ 필터</nds-chip>',
    },
    summary:
      "TextField helper/description 영역 옆에 붙는 작은 보조 액션 chip. 아이콘(14px) + 라벨(caption1 Medium). bg fill.neutralSubtle, radius sm(6), padding 2/6.",
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3082-976",
    pitfalls: [
      "주요 CTA 자리에 쓰지 말 것 — 시각 위계가 캡션 톤. 주요 액션은 Button.",
      "별도 row 로 떨어뜨리지 말 것 — TextField helper text 와 **inline** 으로 같은 줄.",
      "아이콘 사이즈는 14px 기준 — 큰 아이콘을 그대로 넘기면 chip 이 부풀음. `width={14} height={14}` 강제.",
      "`kind` enum 같은 분기 prop 없음 — 사용처가 적절한 아이콘 import 해서 `icon` 으로 넘김 (Example/Edit/Download 는 가이드 사례일 뿐).",
      "ButtonHTMLAttributes 상속 — `type` / `children` 은 internal 이라 prop 으로 받지 않음.",
    ],
    recommended: [
      '기본: <ActionChip icon={<DownloadIcon width={14} height={14} />} label="다운로드" onClick={…} />',
      "여러 개 묶기: flex container + gap 8 (TextField helper 영역과 inline)",
      '아이콘 없이 텍스트만: <ActionChip label="안내 보기" onClick={…} />',
    ],
    sizeMatrix: {
      height: "20-24px (라벨/아이콘 sizing 에 따라 자동)",
      iconBox: "14 × 14 (icon.normal)",
      label: "caption1 12/16 Medium · text.subtle",
      bg: "fill.neutralSubtle (hover surface.section)",
      radius: "sm(6)",
      padding: "2px / 6px (vertical / horizontal)",
      gapIconLabel: "2px (spacing[2])",
    },
    stateMatrix: {
      default: "bg fill.neutralSubtle · text.subtle · icon.normal",
      hover: "bg surface.section",
      disabled: "opacity 0.6 · cursor not-allowed",
    },
    accessibility: [
      "ButtonHTMLAttributes 상속 — `aria-label` / `aria-describedby` 자유 부착.",
      "키보드: Tab focus + Enter/Space 자동 (native button).",
      "disabled 시 native `disabled` 속성 그대로 — screen reader 가 비활성 안내.",
    ],
    usagePolicy: {
      useFor: [
        "TextField · ImageUpload 등 입력 컴포넌트 helper 옆 보조 액션 (예시/수정/다운로드)",
        "한 폼 안에서 여러 inline 액션을 가로로 묶기",
      ],
      doNotUseFor: [
        "주요 CTA — Button 사용",
        "단순 라벨/태그 (클릭 없음) — Badge / Chip",
        "필터/선택 칩 (다중 토글) — Chip",
      ],
      limits: {
        iconSize: 14,
        labelTypography: "caption1 12/16 Medium",
        maxInRow: "권장 4 이하 (helper 영역 폭 제한)",
      },
    },
  },
  Accordion: {
    name: "Accordion",
    summary:
      "수직 펼침/접힘 그룹. FAQ, 약관, 다단 설정처럼 정보 밀도가 높지만 한 번에 다 보여줄 필요 없는 곳에 사용.",
    pitfalls: [
      "type='single' 인데 value 를 배열로 넘기지 말 것. 단일 모드는 string, multiple 모드만 배열.",
      "trigger 안에 nds-button / a / 클릭 가능한 자식 element 를 또 두면 nested interactive — 키보드/포커스 동작이 깨짐. trigger 자체가 button 임.",
      "Accordion 안에 form / 입력 폼을 깊게 두지 말 것. 접힘 상태에서 validation 실패가 보이지 않아 사용자가 혼란.",
    ],
    examplesHtml: {
      do: '<nds-accordion type="single" value="terms">\n  <nds-accordion-item value="terms">\n    <nds-accordion-trigger>이용약관</nds-accordion-trigger>\n    <nds-accordion-content>본문…</nds-accordion-content>\n  </nds-accordion-item>\n  <nds-accordion-item value="privacy">\n    <nds-accordion-trigger>개인정보 처리방침</nds-accordion-trigger>\n    <nds-accordion-content>본문…</nds-accordion-content>\n  </nds-accordion-item>\n</nds-accordion>\n<script>el.addEventListener("accordion-change", e => console.log(e.detail.value));</script>',
      dont: '<!-- accordion-trigger 안에 또 다른 클릭 가능한 element — nested interactive -->\n<nds-accordion-item value="x">\n  <nds-accordion-trigger><nds-button>열기</nds-button></nds-accordion-trigger>\n  <nds-accordion-content>본문</nds-accordion-content>\n</nds-accordion-item>',
    },
  },
  Asset: {
    name: "Asset",
    summary:
      "Toss TDS 식 통합 미디어 컴포넌트. image / icon / initial / lottie / custom 을 동일한 Frame 위에 표현해 모양·크기·overlap·status accessory 의 일관성을 강제한다. Avatar 가 '사람 식별' 한정 컴포넌트라면 Asset 은 그보다 일반적인 박스 — 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등.",
    pitfalls: [
      "content prop 은 discriminated union — `{ type: 'image', src }` / `{ type: 'icon', icon }` / `{ type: 'initial', name }` / `{ type: 'lottie', src }` / `{ type: 'custom', render }` 중 하나. 객체로 묶어서 넘기지 말고 type 키로 분기한 형태로 정확히 전달.",
      "size 는 xs/sm/md/lg/xl/2xl 프리셋 또는 임의 px 숫자. 임의 px 은 비표준 사이즈가 박힐 수 있으므로 가능하면 프리셋 사용.",
      "shape='circle' + content.type='image' 가 가장 흔한 사용 — 이 경우 Avatar 와 거의 같음. Avatar 는 그대로 둔다 (사람 한정 시멘틱). Asset 은 일반 미디어 박스.",
      "overlap prop 은 우측 음수 마진. AvatarGroup 처럼 옆 Asset 위로 겹쳐 놓을 때만 사용. 단독 사용 시 0.",
      "acc(accessory) 는 우측 하단 status dot / count badge / online indicator 슬롯. 풀-사이즈 컴포넌트(긴 텍스트 라벨 등) 를 넣지 말 것 — 작은 시각 신호만.",
      "image type 에서 src 로드 실패 시 alt 의 이니셜로 자동 graceful degrade. alt 가 빈 문자열이면 빈 박스가 됨.",
      "scaleType 은 image/lottie 에만 의미 있음 — icon/initial 에는 영향 없음.",
      "multicolor 아이콘을 icon content 로 넣을 때 `color` prop 으로 base 색을 바꿀 수는 있지만 내부 accent 는 잠겨있음 (iconography 가이드 참고).",
    ],
    examplesHtml: {
      do: '<!-- 일반 미디어 박스 (카드 썸네일) -->\n<nds-asset shape="rounded" size="lg" content=\'{"type":"image","src":"/thumb.jpg","alt":"제품"}\' scale-type="cover"></nds-asset>\n\n<!-- 카테고리 시그니처 (multicolor 아이콘) -->\n<nds-asset shape="rounded" size="xl" content=\'{"type":"icon","icon":"TrostMentalDepressionIcon"}\'></nds-asset>\n\n<!-- 온라인 상태가 붙은 사람 -->\n<nds-asset shape="circle" size="md" content=\'{"type":"image","src":"/me.jpg","alt":"이정민"}\' acc-status="online"></nds-asset>',
      dont: '<!-- content 를 객체로 안 묶고 src 만 던지기 -->\n<nds-asset src="/x.jpg" size="md"></nds-asset>\n\n<!-- 사람 식별인데 Avatar 대신 Asset 사용 — 시멘틱 약화 -->\n<nds-asset shape="circle" size="md" content=\'{"type":"image","src":"/user.jpg","alt":"사용자"}\'></nds-asset> <!-- Avatar 가 맞음 -->\n\n<!-- acc 에 풀-사이즈 텍스트 라벨 -->\n<nds-asset content=\'{"type":"image","src":"/x.jpg"}\' acc="신규 상품 입고 안내"></nds-asset>',
    },
  },
  Avatar: {
    name: "Avatar",
    summary:
      "사용자 / 상담사 / 브랜드 식별을 위한 원형 이미지 + fallback. 이름 이니셜 / 기본 아이콘으로 graceful degrade.",
    pitfalls: [
      "src 만 있고 alt 누락 — 이미지 로드 실패 시 비어 보임 + 스크린리더 무용지물. alt 또는 name (fallback initials 자동 생성) 둘 중 하나는 필수.",
      "size 를 px 인라인으로 강제하지 말 것. xs/sm/md/lg/xl 매트릭스가 toked 사이즈/폰트 비율 보장.",
      "Avatar 위에 OnlineIndicator 를 직접 absolute 로 얹지 말고, AvatarGroup / 부모 컨테이너에서 layout 결정.",
    ],
    examplesHtml: {
      do: '<nds-avatar src="/u.jpg" alt="홍길동" size="md"></nds-avatar>\n<nds-avatar name="이정민" size="lg"></nds-avatar> <!-- src 실패 시 \'이\' 이니셜 표시 -->',
      dont: '<!-- alt / name 둘 다 없음 — 로드 실패 시 ghost 박스 -->\n<nds-avatar src="/u.jpg" size="md"></nds-avatar>\n<!-- 인라인 px 로 강제 사이즈 — sizeMatrix 와 불일치 -->\n<nds-avatar src="/u.jpg" alt="A" style="width:33px;height:33px"></nds-avatar>',
    },
  },
  Breadcrumb: {
    name: "Breadcrumb",
    summary:
      "현재 화면이 정보 계층 어디에 있는지 보여주는 경로. 3 depth 이상의 카탈로그 / 설정 / CMS 페이지에서 의미 있음.",
    pitfalls: [
      "1-2 depth 페이지에 Breadcrumb 강제 표기 — 화면 위에 차지하는 노이즈 대비 정보가 적음.",
      "마지막 segment 를 링크로 만들지 말 것 (현재 위치). active=true 표시.",
      "separator 를 이모지나 텍스트 기호(→ / >)로 인라인 입력 금지 — separator attribute 또는 토큰 사용.",
    ],
    examplesHtml: {
      do: '<nds-breadcrumb items=\'[{"label":"홈","href":"/"},{"label":"상담","href":"/counseling"},{"label":"신청 내역","active":true}]\'></nds-breadcrumb>',
      dont: '<!-- 마지막 segment 가 링크로 — 사용자가 자기 자신을 다시 클릭 -->\n<nds-breadcrumb items=\'[{"label":"홈","href":"/"},{"label":"현재 화면","href":"/now"}]\'></nds-breadcrumb>',
    },
  },
  Checkbox: {
    name: "Checkbox",
    summary:
      "다중 선택 / on-off / 약관 동의 체크. 라벨이 함께 와야 의미가 전달되고, 단일 선택 그룹은 Radio 가 맞음.",
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3295-547",
    pitfalls: [
      "약관/필수 동의에 disabled 로 잠가두면 시각 위계가 모호 — required 또는 별도 안내문으로 명시.",
      "checked 와 default-checked 동시 사용 — controlled / uncontrolled 가 섞임.",
      "label 없이 단독으로 던지지 말 것 — 한 줄 안내문이라도 aria-label 로 제공.",
    ],
    examplesHtml: {
      do: '<nds-checkbox name="agree-terms" label="이용약관에 동의합니다" required></nds-checkbox>\n<nds-checkbox name="optional-marketing" label="마케팅 정보 수신 (선택)"></nds-checkbox>',
      dont: '<!-- 라벨 없는 단독 체크박스 — 의미 전달 실패 -->\n<nds-checkbox name="x" checked></nds-checkbox>\n<!-- 라디오로 충분한 단일 선택을 체크박스로 -->\n<nds-checkbox name="payment" value="card">카드</nds-checkbox>\n<nds-checkbox name="payment" value="cash">현금</nds-checkbox>',
    },
  },
  Divider: {
    name: "Divider",
    summary:
      "섹션 사이의 시각적 분리선. 카드 안 내부 분할에 남발하지 말고, 한 화면당 의미 있는 분리에만 사용.",
    pitfalls: [
      "Divider 를 두꺼운 색상 line 으로 시각 위계 강조용으로 쓰지 말 것 — TitleBlock + spacing 토큰이 우선.",
      "List 의 항목 사이에 Divider 를 직접 박지 말 것. nds-list variant='divided' 가 책임짐.",
      "orientation='vertical' 은 부모가 flex 컨테이너이고 명시적 높이가 있어야 보임.",
    ],
    examplesHtml: {
      do: '<section>섹션 A</section>\n<nds-divider orientation="horizontal" spacing="24"></nds-divider>\n<section>섹션 B</section>',
      dont: "<!-- list 항목 사이마다 divider 직접 — list variant 가 책임 -->\n<nds-list-item>항목 1</nds-list-item>\n<nds-divider></nds-divider>\n<nds-list-item>항목 2</nds-list-item>",
    },
  },
  Drawer: {
    name: "Drawer",
    summary:
      "측면(left/right) 슬라이드 패널. 모달보다 가벼운 컨텍스트(필터, 보조 정보, 빠른 작업)에 적합. 모달과 동시에 열지 말 것.",
    pitfalls: [
      "open attribute 만 토글하고 nds-drawer-close 이벤트를 처리 안 함 — overlay 클릭 / ESC 가 끄지 못함.",
      "Drawer 안에서 또 Drawer / Modal 을 열지 말 것 (overlay z-index 충돌).",
      "size='lg' 로 viewport 의 80% 이상을 덮으면 사실상 Modal — Modal 사용을 검토.",
    ],
    examplesHtml: {
      do: '<nds-drawer side="right" size="md" drawer-title="필터">\n  <p>필터 UI…</p>\n  <div slot="footer"><nds-button color="primary">적용</nds-button></div>\n</nds-drawer>\n<script>el.addEventListener("nds-drawer-close", () => el.removeAttribute("open"));</script>',
      dont: '<!-- close 이벤트 처리 없음 — overlay 클릭이 닫지 못함 -->\n<nds-drawer open side="right" size="md">필터…</nds-drawer>',
    },
  },
  DropdownMenu: {
    name: "DropdownMenu",
    summary:
      "버튼 / 아이콘 트리거에서 펼쳐지는 짧은 액션 메뉴. 옵션 5개 이하 권장 — 그 이상은 Select 또는 별도 화면.",
    pitfalls: [
      "옵션이 많아서 스크롤이 필요한 경우 DropdownMenu 가 아님 (Select / 검색형 UI 사용).",
      "destructive 액션은 별도 group 으로 분리하거나 최하단에 배치 — 다른 일반 액션 사이에 끼우지 말 것.",
      "메뉴 항목에 disabled 가 많으면 차라리 그 항목들을 빼고 권한 설명을 별도 영역에 노출.",
      "**item `leading`/`trailing` = inline SVG (이름/이모지 아님).** innerHTML 로 주입되므로 아이콘 이름을 넣으면 텍스트로 흘러나온다. `find_icon({ name })` 의 inline SVG 를 넣을 것 (trailing 은 단축키 등 짧은 텍스트도 가능). React DropdownMenu 의 `leading?/trailing?: ReactNode` 와 대칭.",
    ],
    examplesHtml: {
      do: '<nds-dropdown-menu items=\'[{"label":"편집","value":"edit"},{"label":"공유","value":"share"},{"label":"삭제","value":"delete","destructive":true}]\'></nds-dropdown-menu>\n<script>el.addEventListener("dropdown-select", e => handle(e.detail.value));</script>',
      dont: '<!-- 옵션이 너무 많고 destructive 가 일반 액션 사이 -->\n<nds-dropdown-menu items=\'[{"label":"1"},{"label":"2"},{"label":"삭제"},{"label":"4"},{"label":"5"},...]\'></nds-dropdown-menu>',
    },
  },
  EmptyState: {
    name: "EmptyState",
    summary:
      "데이터/검색 결과/기록 없음 표시. 단순 '없음' 메시지 대신 다음 액션(추가하기 / 다시 검색 / 추천 보기)을 제안.",
    pitfalls: [
      "title 만 있고 description / action 누락 — 사용자에게 다음 행동을 안내하지 않음.",
      "EmptyState 를 페이지 전체 height 로 채우면 안 — 영역 안에서만 표시, footer / nav 가 가려지지 않도록.",
      "에러 상황(네트워크 / 권한)에 EmptyState 를 재활용 — 시그널이 약함. ErrorState / Banner 사용.",
    ],
    examplesHtml: {
      do: '<nds-empty-state title="아직 작성한 일기가 없어요" description="오늘의 감정을 기록해 보세요" action="작성하기"></nds-empty-state>\n<script>el.addEventListener("empty-state-action", () => navigate("/journal/new"));</script>',
      dont: '<!-- title 만 있고 다음 액션 없음 — 사용자가 막힘 -->\n<nds-empty-state title="결과 없음"></nds-empty-state>',
    },
  },
  Footer: {
    name: "Footer",
    summary:
      "페이지 최하단 사이트맵 / 약관 / 운영주체 정보. 모바일/웹 모두 컴포지션 자식(nds-footer-tab-bar / nds-footer-company-info / nds-footer-web) 으로 구성.",
    pitfalls: [
      "raw <footer> + 인라인 스타일로 시각만 흉내 — 브랜드별 콘텐츠 구조가 통일되지 않음.",
      "Footer 안에 마케팅 CTA 큰 카드를 박지 말 것 — Footer 는 정보/법적 영역.",
      "사용자 앱과 어드민에서 같은 Footer 컴포넌트 사용 금지 — 어드민은 antd + 자체 Copyright 카피.",
    ],
    examplesHtml: {
      do: '<nds-footer-info active-tab="home">\n  <nds-footer-tab-bar>\n    <nds-footer-tab-item key="home" label="홈" href="/"></nds-footer-tab-item>\n    <nds-footer-tab-item key="journal" label="일기" href="/journal"></nds-footer-tab-item>\n  </nds-footer-tab-bar>\n  <nds-footer-company-info>(주)넛지이에이피 · 사업자 …</nds-footer-company-info>\n</nds-footer-info>',
      dont: '<!-- raw <footer> 로 모양만 흉내 — 브랜드 사양에서 벗어남 -->\n<footer style="background:#f5f5f5;padding:24px"><p>회사정보</p></footer>',
    },
  },
  FormField: {
    name: "FormField",
    summary:
      "Input / Textarea / Select 같은 form control 의 label / helper / error / counter 슬롯을 묶는 래퍼. label-position(top|left) + density(default|admin) 조합으로 모바일/admin 폼을 한 컴포넌트로 처리.",
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3082-846",
    pitfalls: [
      "label 또는 html-for 누락 — Form 안의 input id 와 라벨이 끊겨 접근성이 깨짐.",
      "error 와 helper 를 동시에 표시 — 사용자는 어떤 메시지를 우선해야 할지 혼란. error 모드에서는 helper 숨김.",
      "counter 는 max-length 가 명확한 textarea / input 에서만 사용.",
      "label-position='left' + description 동시 사용 — description 이 있으면 자동으로 top 으로 폴백 (좌측 좁은 컬럼에 멀티라인 설명을 욱여넣지 않기 위함).",
      "label-position='left' 인데 input size 가 default(48) — 캐시워크 포 비즈니스 admin 표준은 size='compact'(40). 라벨 baseline 이 안 맞음.",
      "density='admin' 인데 stack 사이에 별도 gap 24/48 박음 — FormField 자체 py-24 가 이미 시각 48px 을 만드므로 이중 간격이 됨. 부모는 그냥 flex column 으로 두고 FormField 가 알아서 간격 책임지게 할 것.",
      "density 와 size 혼동: density 는 FormField 자체 (label/helper typo + padding) 가 admin 톤이냐, size 는 Input/Select 의 height 가 40 이냐. 캐시워크 포 비즈니스 admin 표준은 둘 다 admin/compact 짝.",
      "FormField child 슬롯에 raw <div> + 수기 flex 로 input 여러 개 — 대신 InputGroup 컴포넌트 사용 (gap 12 + flex:1 균등 자동).",
    ],
    recommended: [
      "모바일/일반 폼: <nds-form-field label='이름' helper='실명' required> + <nds-input>",
      "캐시워크 포 비즈니스 admin 표준 (단일 input): <nds-form-field label='Label' label-position='left' density='admin'> + <nds-input size='compact' / nds-select>",
      "캐시워크 포 비즈니스 admin 표준 (row 다중 input): density='admin' FormField 안에 <nds-input-group> 으로 input 묶기 — gap 12 균등 분할 (Figma 3466:17405 패턴)",
      "FormSection (FormField 두 개 이상 stack): 부모는 <div class='form-card'> (radius 16, padding 24, white bg) + 안에 <nds-form-field density='admin'> 들을 그냥 flex column 으로 쌓기. 각 FormField 의 py-24 가 자동으로 시각 48px 간격을 만듦.",
      "글자수 카운터: counter='12 / 200' — Textarea 같이 max-length 가 명확할 때만.",
    ],
    sizeMatrix: {
      top: "label 위, control 아래. 모바일/일반 폼 기본. label-row column flex.",
      left: "label 좌측 고정(width 기본 180px, labelWidth prop), control 우측 1fr. baseline 정렬을 위해 label 컬럼 padding-top 10px(default)/12px(admin) 자동 적용.",
      "density:default":
        "label body3 (13/18), helper caption (12/16). 자체 padding 0 — 부모 stack 이 간격 결정.",
      "density:admin":
        "label body1 (16/24, ≡ Figma Subtitle1/Medium), helper body3 (14/20, ≡ Figma Body2/Regular), 자체 py-24 → stack 시 자동 시각 48px 간격 (Figma FormSection 3387:871 표준).",
    },
    examplesHtml: {
      do: '<!-- 모바일/일반 폼 -->\n<nds-form-field label="이름" helper="실명을 입력해주세요" html-for="name-input" required>\n  <nds-input id="name-input" name="name"></nds-input>\n</nds-form-field>\n\n<!-- 캐시워크 포 비즈니스 admin: label 좌측 + compact + admin density -->\n<nds-form-field label="Label" label-position="left" density="admin" html-for="admin-name">\n  <nds-input id="admin-name" size="compact" placeholder="값을 입력하세요"></nds-input>\n</nds-form-field>\n\n<!-- row 다중 input — InputGroup -->\n<nds-form-field label="기간" label-position="left" density="admin">\n  <nds-input-group>\n    <nds-select placeholder="년"></nds-select>\n    <nds-select placeholder="월"></nds-select>\n    <nds-select placeholder="일"></nds-select>\n  </nds-input-group>\n</nds-form-field>',
      dont: '<!-- htmlFor (React 표기) — vanilla HTML 에선 html-for 만 동작 -->\n<nds-form-field label="이름" htmlFor="x"><nds-input id="x"></nds-input></nds-form-field>\n<!-- label-position="left" 인데 default size — 라벨이 input 중앙과 안 맞음 -->\n<nds-form-field label="Label" label-position="left"><nds-input></nds-input></nds-form-field>\n<!-- admin 인데 부모에 gap 박음 — 이중 간격 -->\n<div style="display:flex;flex-direction:column;gap:24px">\n  <nds-form-field density="admin">...</nds-form-field>\n  <nds-form-field density="admin">...</nds-form-field>\n</div>\n<!-- 수기 flex 로 row 다중 input — InputGroup 써야 함 -->\n<nds-form-field label="기간"><div style="display:flex;gap:12px"><nds-input/><nds-input/></div></nds-form-field>',
    },
  },
  InputGroup: {
    name: "InputGroup",
    summary:
      "한 줄에 form control 여러 개를 묶는 wrapper. FormField 의 단일 child slot 에 넣어 row 다중 input 폼을 만든다 (예: 년/월/일 3-Dropdown, 이메일+도메인 2-Input).",
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3466-17405",
    pitfalls: [
      "FormField 없이 InputGroup 만 단독 — label 없이 row 만 뜨면 의미 전달 불완전.",
      "각 child 너비를 px 로 박지 말 것 — stretch(기본)는 flex:1 균등, start 는 본래 너비. 비율 분배가 필요하면 child 에 직접 flex 설정.",
      "gap='loose'(16) 는 FormField label↔control gap 과 같음 — 시각적으로 그룹 경계가 모호. row 다중 input 은 default(12) 또는 tight(8) 권장.",
    ],
    recommended: [
      "년/월/일 3-Dropdown: <nds-form-field label='기간' label-position='left' density='admin'><nds-input-group> 안에 <nds-select> × 3",
      "이메일+도메인 2-Input: <nds-input-group gap='tight'><nds-input/><nds-input/></nds-input-group>",
      "비율이 다른 케이스 (input + 짧은 button): align='start' 로 본래 너비 유지.",
    ],
    sizeMatrix: {
      gap: "tight=8 / default=12 (Figma 캐시워크 포 비즈니스 admin 표준) / loose=16",
      align: "stretch(기본)=모든 child flex:1 균등 / start=본래 너비",
    },
    examplesHtml: {
      do: '<nds-form-field label="기간" label-position="left" density="admin">\n  <nds-input-group>\n    <nds-select placeholder="년"></nds-select>\n    <nds-select placeholder="월"></nds-select>\n    <nds-select placeholder="일"></nds-select>\n  </nds-input-group>\n</nds-form-field>',
      dont: '<!-- FormField 없이 단독 — label 끊김 -->\n<nds-input-group><nds-input></nds-input><nds-input></nds-input></nds-input-group>\n<!-- child 너비를 px 로 — stretch 효과 깨짐 -->\n<nds-input-group><nds-input style="width:200px"></nds-input></nds-input-group>',
    },
  },
  LikertScale: {
    name: "LikertScale",
    summary:
      "1-5 / 1-7 단계 만족도 / 동의 정도 측정. 자가검사(우울/불안), 후기, 설문에 사용. 단계당 텍스트 라벨은 최소화하고 양 끝 anchor 만.",
    pitfalls: [
      "양 끝 anchor(start-label / end-label) 누락 — 1/5 가 좋음/나쁨 어느 쪽인지 모호.",
      "11점 이상 단계는 슬라이더(nds-slider) 가 더 적합. Likert 는 3/5/7 단계 권장.",
      "Likert 결과를 평균 점수로만 노출하지 말 것 — 분포(히스토그램) 가 의미 있는 경우가 많음.",
    ],
    examplesHtml: {
      do: '<nds-likert-scale name="satisfaction" options="[1,2,3,4,5]" start-label="매우 불만족" end-label="매우 만족"></nds-likert-scale>\n<script>el.addEventListener("likert-change", e => setValue(e.detail.value));</script>',
      dont: '<!-- anchor 라벨 누락 — 의미 해석 불가 -->\n<nds-likert-scale name="x" options="[1,2,3,4,5]"></nds-likert-scale>',
    },
  },
  Pagination: {
    name: "Pagination",
    summary:
      "리스트가 한 화면을 넘을 때 페이지 단위로 끊어 보기. 무한 스크롤이 적절한 경우(피드/리뷰) 에는 사용 안 함.",
    pitfalls: [
      "전체 페이지 수 5 이하 / 항목 30 이하면 Pagination 자체가 과한 UI — 한 페이지로 노출.",
      "show-arrows 와 siblings 를 둘 다 끄면 현재 페이지 ±1 만 보여 탐색이 끊김.",
      "PaginationChange 이벤트 처리 없이 page attribute 만 바꿔도 데이터 fetch 가 안 일어남 — 이벤트 핸들러에서 fetch 호출.",
    ],
    examplesHtml: {
      do: '<nds-pagination page="1" total-pages="10" siblings="2" show-arrows></nds-pagination>\n<script>el.addEventListener("pagination-change", e => loadPage(e.detail.page));</script>',
      dont: '<!-- siblings 0 + arrows 없음 — 옆 페이지가 보이지 않음 -->\n<nds-pagination page="1" total-pages="10" siblings="0"></nds-pagination>',
    },
  },
  Popup: {
    name: "Popup",
    summary:
      "단순 확인/거부(취소·삭제·종료) 1-액션 다이얼로그. 본문이 긴 경우엔 Modal, 비차단 알림은 Snackbar.",
    pitfalls: [
      "Popup 본문에 form / 멀티 입력을 두지 말 것 — Modal 이 맞음.",
      "destructive 액션의 confirm-text 가 '확인' 처럼 일반 — 'X 삭제하기' / 'X 종료' 처럼 결과 명시.",
      "show-cancel 끄고 confirm 만 — 사용자에게 거부권을 주지 않음 (info popup 외에는 비권장).",
    ],
    examplesHtml: {
      do: '<nds-popup open title="신청을 취소할까요?" description="입력한 내용은 저장되지 않아요"\n  confirm-text="신청 취소하기" cancel-text="계속 작성" show-cancel></nds-popup>\n<script>el.addEventListener("popup-confirm", cancel); el.addEventListener("popup-cancel", () => el.removeAttribute("open"));</script>',
      dont: '<!-- show-cancel 없음 + confirm 일반 — 사용자 거부 불가 -->\n<nds-popup open title="저장됨" confirm-text="확인"></nds-popup>',
    },
  },
  SearchInput: {
    name: "SearchInput",
    summary:
      "검색어 입력 + debounce + clear. dropdown suggestion 이 필요하면 nds-autocomplete 사용.",
    pitfalls: [
      "debounce 0 으로 매 keystroke 마다 fetch — 백엔드 부하 / UI flicker. 200-400ms 권장.",
      "min-query-length 미설정 — 1글자 입력에 즉시 fetch 가 일어남.",
      "검색 결과 dropdown 이 필요한데 nds-input + 자체 panel 로 흉내 — nds-autocomplete 로 일원화.",
    ],
    examplesHtml: {
      do: '<nds-search-input placeholder="검색어 입력" label="상담사 찾기" debounce="300" min-query-length="2" clearable></nds-search-input>\n<script>el.addEventListener("search-input", e => fetch(e.detail.value));</script>',
      dont: '<!-- debounce 없음 + min-query-length 없음 — 매 keystroke fetch -->\n<nds-search-input placeholder="검색"></nds-search-input>',
    },
  },
  SelectionButtonGroup: {
    name: "SelectionButtonGroup",
    summary:
      "폼 내 상호 배타적 옵션의 단일 선택 (권장 2~3개). 브랜드색 아웃라인의 개별 버튼을 gap 으로 나열 — FormField ContentSlot 에 교체. 선택 시 brand-subtle 배경 + brand 보더 + 굵은 텍스트.",
    pitfalls: [
      "SegmentedControl 과 혼동 — Segmented 는 연결된 회색 트랙(뷰/상태 전환), SelectionButtonGroup 은 폼 입력(개별 브랜드색 버튼). 폼 안 단일선택이면 이 컴포넌트.",
      "옵션 4개 이상 — 가로 폭 부족. Select 또는 SelectionCard 사용.",
      "라벨+설명+아이콘이 필요한 카드형 선택 — SelectionCard 가 적합.",
      "선택색을 hex 로 박지 말 것 — selected 는 --semantic-bg-brand-subtle / --semantic-border-brand-default 캐스케이드로 5개 브랜드 자동 대응.",
    ],
    examplesHtml: {
      do: '<nds-selection-button-group value="always" options=\'[{"value":"always","label":"항상"},{"value":"time","label":"특정 시간만"},{"value":"weekday","label":"특정 요일/시간만"}]\'></nds-selection-button-group>\n<script>el.addEventListener("selection-button-change", e => setSchedule(e.detail.value));</script>',
      dont: '<!-- 뷰 전환에 SelectionButtonGroup — 폼 입력 컴포넌트라 위계가 어색. SegmentedControl 사용 -->\n<nds-selection-button-group options=\'[{"value":"list","label":"목록"},{"value":"grid","label":"그리드"}]\'></nds-selection-button-group>',
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3555-703",
  },
  SegmentedControl: {
    name: "SegmentedControl",
    summary: "2-5 개의 평행 옵션 중 단일 선택 (탭의 가벼운 대체). 4개 초과면 Select / Tabs.",
    pitfalls: [
      "옵션이 6개 이상 — 가로 폭 부족으로 라벨 truncate. Select 사용.",
      "Segmented 와 Tabs 를 같은 화면에서 동시 사용 — 위계가 모호.",
      "full-width 가 아닌데 화면 가운데 정렬로 옆 여백이 큰 모바일 화면 — 부모 컨테이너 폭 점검.",
    ],
    examplesHtml: {
      do: '<nds-segmented value="week" size="md" options=\'[{"label":"주","value":"week"},{"label":"월","value":"month"},{"label":"연","value":"year"}]\'></nds-segmented>\n<script>el.addEventListener("segmented-change", e => setPeriod(e.detail.value));</script>',
      dont: '<!-- 6개 옵션 — segmented 의 시각 위계 깨짐 -->\n<nds-segmented options=\'[{"label":"1","value":"1"},{"label":"2","value":"2"},{"label":"3","value":"3"},{"label":"4","value":"4"},{"label":"5","value":"5"},{"label":"6","value":"6"}]\'></nds-segmented>',
    },
  },
  Skeleton: {
    name: "Skeleton",
    summary:
      "데이터 로드 중 placeholder. 실제 콘텐츠의 box 모델을 그대로 흉내 — 스피너보다 인지된 속도가 빠름.",
    pitfalls: [
      "긴 작업(>3초) 에 Skeleton 만 — 진척 표시 없으면 사용자가 멈췄다고 인식. ProgressBar / 안내문 병행.",
      "Skeleton 의 width/height 가 실제 콘텐츠와 크게 다르면 로드 후 layout shift — CLS 악화.",
      "variant='text' 를 짧은 카드/카운트 자리에 사용 — 시각적 비율이 어색. rect 권장.",
    ],
    examplesHtml: {
      do: '<nds-skeleton variant="text" width="60%"></nds-skeleton>\n<nds-skeleton variant="rect" width="100%" height="200"></nds-skeleton>',
      dont: '<!-- 실제 콘텐츠보다 한참 작은 사이즈 — 로드 후 layout shift -->\n<nds-skeleton variant="rect" width="40" height="20"></nds-skeleton> <!-- 실제로는 폭 100% -->',
    },
  },
  StarRating: {
    name: "StarRating",
    summary: "1-5 / 1-10 별 점수. 후기 입력 + 후기 표시 양쪽에 사용. readonly 와 disabled 구분.",
    pitfalls: [
      "0.5 / 부분 별 채움이 필요한데 정수만 받는 input 으로 사용 — 디자인은 0.5 단위 표시 지원.",
      "readonly 와 disabled 혼동 — disabled 는 폼 비활성, readonly 는 보기 전용 (clickable 아님).",
      "max 가 5 인데 value 6 — 표시가 깨짐.",
      'HTML size 는 React 와 동일하게 px 숫자를 우선 사용. "md"/"lg" alias 는 허용되지만 목업 가이드 예제에서는 숫자 px 로 지시.',
    ],
    examplesHtml: {
      do: '<nds-star-rating value="4" size="20" max="5" show-value></nds-star-rating>\n<nds-star-rating value="4.5" size="16" max="5" readonly></nds-star-rating>\n<script>el.addEventListener("star-rating-change", e => setRating(e.detail.value));</script>',
      dont: '<!-- value 가 max 초과 -->\n<nds-star-rating value="6" max="5"></nds-star-rating>',
    },
  },
  Stepper: {
    name: "Stepper",
    summary: "다단계 작업(가입/결제/온보딩) 의 현재 진척 표시. 단계 5개 이상은 사용자 인지 부담.",
    pitfalls: [
      "completed 단계 라벨에 description 누락 — 사용자가 이전 단계에서 뭘 했는지 떠올리기 어려움.",
      "vertical / horizontal 혼용 — 한 화면 안에선 한 방향 통일.",
      "현재 단계가 마지막인데 'current' status 유지 — 'completed' 로 갱신해야 완료 신호.",
    ],
    examplesHtml: {
      do: '<nds-stepper current="1" variant="horizontal" steps=\'[{"label":"기본 정보","status":"completed"},{"label":"결제","status":"current"},{"label":"확인"}]\'></nds-stepper>',
      dont: '<!-- step status 모두 누락 — 진척이 시각화 안 됨 -->\n<nds-stepper current="1" steps=\'[{"label":"1단계"},{"label":"2단계"},{"label":"3단계"}]\'></nds-stepper>',
    },
  },
  Textarea: {
    name: "Textarea",
    summary: "여러 줄 자유 입력. 일기 / 후기 / 메모. 자체 max-length / min-height 가이드 있음.",
    pitfalls: [
      "raw <textarea> 직접 사용 — placeholder/스타일/포커스 ring 토큰 미적용.",
      "resize='none' + 짧은 min-height — 긴 본문 입력 시 답답함. min-height 120 이상 권장.",
      "max-length 만 두고 counter (FormField.counter) 안 보여줌 — 사용자는 글자 수를 모름.",
    ],
    examplesHtml: {
      do: '<nds-textarea label="오늘 기록" placeholder="자유롭게 입력해주세요" max-length="500" min-height="180" resize="vertical"></nds-textarea>',
      dont: '<!-- raw textarea — DS 스타일 적용 안 됨 -->\n<textarea placeholder="…" maxlength="500"></textarea>',
    },
  },
  Toast: {
    name: "Toast",
    summary:
      "비차단 알림 (저장 완료 / 네트워크 에러 등). Snackbar 와 거의 동일 기능이지만 multi-stack 가능.",
    pitfalls: [
      "duration 0 으로 영구 표시 — 차단 의도면 Modal/Popup, 영구 알림이면 Banner.",
      "변형(default/success/error/warning) 없이 모두 default — 시각 위계가 사라짐.",
      "Toast 안에 input/form 두지 말 것 — interactive 영역이면 Drawer/Modal.",
    ],
    examplesHtml: {
      do: '<nds-toast message="저장되었습니다" variant="success" position="bottom" duration="2500" open></nds-toast>\n<script>el.addEventListener("toast-close", () => el.removeAttribute("open"));</script>',
      dont: '<!-- duration 0 + form 포함 — Toast 가 아니라 Modal/Drawer 사용 -->\n<nds-toast open duration="0" message="<input />" variant="default"></nds-toast>',
    },
  },
  Toggle: {
    name: "Toggle",
    summary:
      "즉시 적용되는 on/off 스위치. 설정 페이지 / 알림 토글에 사용. 폼 제출 후 적용되는 binary 는 Checkbox 가 맞음.",
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3295-547",
    pitfalls: [
      "label 없는 단독 Toggle — 무엇을 켜고 끄는지 시각만으론 불명확.",
      "Toggle 변경 후 별도 '저장' 버튼이 필요한 UI 라면 Checkbox 가 맞음 — Toggle 은 즉시 반영 시그널.",
      "size='sm' 을 본문 안 inline 텍스트와 함께 — 시각 위계 부족, baseline 어색.",
    ],
    examplesHtml: {
      do: '<nds-toggle name="push-notification" label="푸시 알림 받기" checked></nds-toggle>\n<script>el.addEventListener("change", e => savePref(e.target.checked));</script>',
      dont: '<!-- 라벨 없는 단독 토글 -->\n<nds-toggle></nds-toggle>\n<!-- 즉시 반영 안 되는 form -->\n<form>\n  <nds-toggle name="x" label="설정 A"></nds-toggle>\n  <nds-button color="primary" type="submit">저장</nds-button> <!-- Checkbox 가 맞음 -->\n</form>',
    },
  },
  Tooltip: {
    name: "Tooltip",
    summary:
      "trigger 에 마우스 hover / focus 시 보조 설명. 모바일에선 사실상 보이지 않으므로 핵심 정보는 본문에 둘 것.",
    pitfalls: [
      "Tooltip 안에 인터랙티브 요소(링크/버튼) — 모바일/터치에서는 도달 불가.",
      "trigger 가 aria-label 만 갖고 visible 텍스트가 없는 아이콘 버튼인데 Tooltip 도 같은 내용 — 중복.",
      "Tooltip 텍스트가 한 문장 초과로 길어짐 — Popover / Modal 사용.",
    ],
    examplesHtml: {
      do: '<nds-tooltip content="삭제하면 복구할 수 없어요" placement="top" trigger-label="?"></nds-tooltip>',
      dont: '<!-- 모바일에서 보이지 않는 본질 정보 -->\n<nds-tooltip content="이용약관 동의가 필수입니다" trigger-label="?"></nds-tooltip>',
    },
  },
  BottomSheet: {
    name: "BottomSheet",
    examplesHtml: {
      do: '<nds-bottom-sheet open sheet-title="옵션 선택">\n  <div slot="body">옵션 본문…</div>\n  <div slot="footer"><nds-button color="primary">확인</nds-button></div>\n</nds-bottom-sheet>\n<script>el.addEventListener("nds-bottom-sheet-close", () => el.removeAttribute("open"));</script>',
      dont: '<!-- nds-bottom-sheet-close 미처리 — overlay/ESC 가 닫지 못함 -->\n<nds-bottom-sheet open sheet-title="선택"></nds-bottom-sheet>',
    },
    summary:
      "모바일에서 화면 하단에서 올라오는 시트. 옵션 선택 / 짧은 작업에 적합. 데스크탑에선 Drawer 가 자연스러움.",
    pitfalls: [
      "BottomSheet 안에 깊은 nested form / 멀티 탭 — 사용자가 컨텍스트를 잃음. 별도 화면 또는 Modal 사용.",
      "open 상태에서 뒤 페이지 scroll 잠그지 않으면 body scroll 충돌.",
      "트리거 버튼 없이 자동 open — 사용자 의도 없는 시트는 다크 패턴.",
    ],
  },
  DSHighlight: {
    name: "DSHighlight",
    examplesHtml: {
      do: '<nds-ds-highlight mode="component"></nds-ds-highlight>\n<!-- 강조 대상에 data-ds-mark="<영역>" 부여 -->',
      dont: '<!-- production 빌드에 그대로 두면 안 됨. import.meta.env.DEV 게이트 적용 -->\n<nds-ds-highlight mode="all"></nds-ds-highlight>',
    },
    summary:
      "DS 적용 영역을 시각적으로 강조하는 dev-only 디버깅 컴포넌트. production 빌드에서 자동 제거.",
    pitfalls: [
      "DSHighlight 를 일반 화면 강조에 재활용 — 그 용도는 Banner / Card 가 맞음.",
      "production 환경에서 import 가 남아 있으면 번들 크기 증가 — import.meta.env.DEV 게이트로 감쌀 것.",
    ],
  },
  DatePicker: {
    name: "DatePicker",
    examplesHtml: {
      do: '<nds-date-picker value="2026-05-25" min-date="2026-05-01" max-date="2026-12-31"\n  placeholder="날짜 선택"></nds-date-picker>\n<script>el.addEventListener("nds-date-change", e => setDate(e.detail.value));</script>',
      dont: '<!-- min-date / max-date 누락 — 사용자가 과거/먼 미래 선택 가능 -->\n<nds-date-picker placeholder="날짜"></nds-date-picker>',
    },
    summary:
      "단일 날짜 선택. 캘린더 팝업 + 키보드 입력. 시간까지 필요하면 별도 TimePicker 또는 DateTimePicker 조합.",
    pitfalls: [
      "min/max 누락 — 사용자가 과거/먼 미래 날짜를 선택해 데이터 검증 실패.",
      "한국어 로케일 누락 — '월/일/연도' 영문 형식 노출.",
      "Calendar 컴포넌트로 month/year 보기 + 직접 select 흉내내지 말 것 — 컨트롤 일관성 깨짐.",
    ],
  },
  FieldActionRow: {
    name: "FieldActionRow",
    examplesHtml: {
      do: '<nds-field-action-row helper-text="이메일로 인증 코드를 보냈어요">\n  <nds-input slot="field" label="인증 코드"></nds-input>\n  <nds-button slot="action" color="primary">재전송</nds-button>\n</nds-field-action-row>',
      dont: "<!-- slot 미지정 — 위치/스타일이 적용 안 됨 -->\n<nds-field-action-row>\n  <nds-input></nds-input>\n  <nds-button>재전송</nds-button>\n</nds-field-action-row>",
    },
    summary:
      "Form field 옆에 inline action(다시 보내기 / 자동 채우기 / 외부 링크) 을 배치하는 보조 row.",
    pitfalls: [
      "Action 이 핵심 폼 동작(검색 / 제출) 이면 row 안이 아니라 별도 CTA 영역.",
      "Action 라벨이 길어 row 가 줄바꿈 — 80자 미만 / 1-2 단어로 유지.",
    ],
  },
  TimeSlotPicker: {
    name: "TimeSlotPicker",
    examplesHtml: {
      do: '<nds-time-slot-picker columns="3"\n  groups=\'[\n    {"key":"am","label":"오전","slots":[{"value":"09:00"},{"value":"10:00","disabled":true}]},\n    {"key":"pm","label":"오후","slots":[{"value":"14:00"},{"value":"15:00"}]}\n  ]\'></nds-time-slot-picker>\n<script>el.addEventListener("nds-time-slot-change", e => pick(e.detail.value));</script>',
      dont: "<!-- slots 와 groups 동시 — 둘 중 하나만 -->\n<nds-time-slot-picker slots='[...]' groups='[...]'></nds-time-slot-picker>",
    },
    summary:
      "예약 가능한 시간 slot 그리드. 상담 / 예약 / 클래스 일정에 사용. 가용 / 비가용 / 만석 상태 시각화.",
    pitfalls: [
      "한 화면에 30분 단위 24시간 = 48 slot 다 보여주기 — 너무 많아 선택 부담. AM/PM 또는 시간대 필터로 분할.",
      "비가용 slot 을 단순 회색으로만 — 이유(예약 마감 / 휴무) 미명시.",
      "선택 후 즉시 다음 step 으로 자동 이동 — 사용자의 confirm 단계를 우회.",
    ],
  },
  TrendingKeywords: {
    name: "TrendingKeywords",
    examplesHtml: {
      do: '<nds-trending-keywords\n  items=\'[{"rank":1,"trend":"up","keyword":"불면증"},{"rank":2,"trend":"new","keyword":"번아웃"}]\'\n  header-title="인기 검색어" timestamp="오늘 09:00 기준"></nds-trending-keywords>\n<script>el.addEventListener("nds-trending-keyword-click", e => search(e.detail.keyword));</script>',
      dont: '<!-- 자해 / 위기 도메인에서 사용 — 검색어 자체가 트리거 가능 -->\n<nds-trending-keywords items=\'[{"rank":1,"keyword":"자해"}]\'></nds-trending-keywords>',
    },
    summary:
      "급상승 검색어 / 핫 키워드 표시. 마케팅/검색 화면에서 사용. 정량 데이터 기반인지 확인 후 사용.",
    pitfalls: [
      "큐레이션된 키워드를 'TRENDING' 으로 노출 — 사용자가 알고리즘 결과로 오해.",
      "키워드 10개 초과 — 시각 노이즈. top 5 권장.",
      "공감/안전 도메인(자해/우울)에선 사용 금지 — 검색어 자체가 트리거가 될 수 있음.",
    ],
  },
  Timeline: {
    name: "Timeline",
    summary:
      "상담/검사 이력 타임라인 — compound API. flat JSON 으로 받으려면 ActivityTimeline 사용.",
    pitfalls: [
      "ActivityTimeline 과 시각/DOM 은 동일 — items 가 정적이고 자식 markup 으로 표현하기 편한 곳에만 사용. 동적 데이터는 ActivityTimeline.",
      "status='ongoing' 은 box-shadow ring 효과 — 한 화면에 여럿 두면 시각 잡음. 보통 1개만.",
      "items 20+ 면 페이지네이션 / 가상화 권장. 한 번에 노출하면 스크롤 부담.",
    ],
    examplesHtml: {
      do: '<nds-timeline>\n  <nds-timeline-item date="2026.05.25" title="상담 예약 완료" status="completed"></nds-timeline-item>\n  <nds-timeline-item date="2026.05.28" title="자가검사 진행" status="ongoing" status-label="진행 중"></nds-timeline-item>\n</nds-timeline>',
      dont: "<!-- items 를 JSON 으로 넘기려면 nds-activity-timeline -->\n<nds-timeline items='[...]'></nds-timeline>",
    },
  },
  BrandHeader: {
    name: "BrandHeader",
    summary:
      "**브랜드 GNB 헤더 — 손수 조립하지 말고 무조건 이걸 먼저 쓸 것.** `<nds-brand-header brand='trost|geniet|nudge-eap|cashwalk-biz|runmile' surface='web|mobile|webview' active-key='...'>` 한 줄로 로고/메뉴/auth 버튼/검색바가 브랜드별 BRAND_DATA 에서 자동 렌더. nds-header + nds-header-logo + nds-header-menu + nds-header-menu-item × N + nds-header-actions + nds-header-auth-button 직접 조립 = 안티패턴.",
    pitfalls: [
      "**손수 조립 금지** — nds-header / nds-header-logo / nds-header-menu / nds-header-menu-item / nds-header-actions / nds-header-auth-button 를 직접 박지 말 것. 메뉴 라벨/href/순서를 손으로 적으면 브랜드 일관성이 깨지고 다음 브랜드 화면에서 또 적게 됨. BrandHeader 한 줄이 BRAND_DATA 에서 전부 자동.",
      "**로고는 base64 내장 — 자산 파일·호스팅 불필요.** 5개 브랜드 로고가 BRAND_DATA 에 data URI 로 박혀 있어 `asset-base-url` 없이도 어디서든 안 깨지고 렌더된다 (단일 HTML 목업 그대로 OK). `asset-base-url` 은 **자체 로고로 바꿀 때만** 쓰는 선택적 override — `public/brand-logos/` 폴더를 만들 의무는 없다.",
      "**surface 별 출력 다름** — `web` (PC GNB · 로고+메뉴+auth), `mobile` (compact 헤더 · 로고+auth), `webview` (뒤로가기 + 타이틀만). 모바일 화면이면 surface='mobile' 명시.",
      "active-key 는 BRAND_DATA[brand].webMenu 의 key 와 매칭. 잘못 적으면 활성 메뉴 표시가 안 됨. 각 브랜드 key 목록은 nds-brand-chrome.ts BRAND_DATA 또는 아래 recommended 참고.",
    ],
    recommended: [
      "Trost: `<nds-brand-header brand='trost' surface='web' active-key='counsel' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: home / counsel / test / care / center",
      "Geniet: `<nds-brand-header brand='geniet' surface='web' active-key='deal' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: home / community / deal / review",
      "NudgeEAP: `<nds-brand-header brand='nudge-eap' surface='web' active-key='counsel' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: counsel / test / therapy / letter / news / my",
      "CashwalkBiz: `<nds-brand-header brand='cashwalk-biz' surface='web' active-key='ad' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: channel / ad / case / notice / guide",
      "Runmile: `<nds-brand-header brand='runmile' surface='web' active-key='race' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: race / community · web 헤더 = 좌측 워드마크+nav · 중앙 coral 검색바 · 우측 채팅/로그인 액션 자동. mobile=52h 중앙 워드마크 bar.",
      "자체 로고로 교체할 때만: `asset-base-url='/brand-logos'` + 해당 파일 배치 (override 전용 · 기본 목업엔 불필요).",
      "Aliases (선택): `<nds-trost-header>`, `<nds-geniet-header>`, `<nds-nudge-eap-header>`, `<nds-cashwalk-biz-header>`, `<nds-runmile-header>` — brand attribute 안 써도 동일 동작.",
    ],
    examplesHtml: {
      do: '<nds-brand-header brand="geniet" surface="web" active-key="deal"></nds-brand-header>',
      dont:
        "<!-- 손수 조립 안티패턴 — 메뉴 라벨/href 를 인라인으로 적으면 브랜드 데이터와 분리되어 다음 화면에서 또 적게 됨 -->\n" +
        '<nds-header variant="web" position="static" max-width="1200">\n' +
        '  <nds-header-logo href="/"><img src="..." /></nds-header-logo>\n' +
        "  <nds-header-menu>\n" +
        '    <nds-header-menu-item href="/community">커뮤니티</nds-header-menu-item>\n' +
        '    <nds-header-menu-item href="/cashdeal" active>헬시딜</nds-header-menu-item>\n' +
        "  </nds-header-menu>\n" +
        "</nds-header>",
    },
    usagePolicy: {
      useFor: [
        "사용자 앱 (Trost/Geniet/NudgeEAP/CashwalkBiz/Runmile) PC GNB",
        "사용자 앱 모바일 compact 헤더 (surface='mobile')",
        "webview 페이지 뒤로가기/타이틀 헤더 (surface='webview')",
      ],
      doNotUseFor: [
        "어드민/CMS — antd Layout.Sider 사용 (단, 캐포비(cashwalk-biz) 어드민은 예외로 DS Sidebar — get_guide({ topic:'component:Sidebar' }))",
        "단일 시연용 임시 화면이라 브랜드 정체성이 무의미한 경우",
      ],
      emphasisRule:
        "헤더/푸터를 손수 조립한 흔적이 발견되면 즉시 BrandHeader/BrandFooter 한 줄로 교체. 메뉴 라벨이나 로고를 페이지마다 적는 건 SSOT 위반.",
    },
    /**
     * Pattern 'Brand-aware Base' metadata (Figma 450:68 v2).
     * BRAND_DATA SSOT 는 `packages/html/src/components/nds-brand-chrome.ts` — 본 metadata 는 그 미러 (가이드 응답용).
     * runmile 은 BrandSlug 타입 union 밖이라 구조화 fold(validPropValues/assetManifest)에는 못 넣는다 —
     * `<nds-brand-header brand='runmile'>` 는 코드상 완전 지원(렌더/alias 모두). 활성 key(race/community)와
     * 자산(파일 불필요) 는 summary/recommended prose 로 노출. BrandBottomNav 와 동일 정책.
     */
    validPropValues: {
      trost: { activeKey: ["home", "counsel", "test", "care", "center"] },
      geniet: { activeKey: ["home", "community", "deal", "review"] },
      "nudge-eap": {
        activeKey: ["counsel", "test", "therapy", "letter", "news", "my"],
      },
      "cashwalk-biz": {
        activeKey: ["channel", "ad", "case", "notice", "guide"],
      },
    },
    assetManifest: {
      trost: ["trost-logo.svg"],
      geniet: ["geniet-logo-pc.webp", "geniet-logo-footer.webp"],
      "nudge-eap": ["nudge-eap-logo.png", "nudge-eap-logo-footer.png"],
      "cashwalk-biz": ["cashwalk-biz/cashwalk-for-business-horizontal.svg"],
    },
  },
  BrandFooter: {
    name: "BrandFooter",
    summary:
      "**브랜드 글로벌 푸터 — 손수 조립하지 말 것.** `<nds-brand-footer brand='...' surface='web|app'>` 한 줄로 이용약관/개인정보처리방침/사업자정보/copyright/푸터 로고가 BRAND_DATA 에서 자동 렌더. nds-footer + nds-footer-links + nds-footer-company 직접 조립 = 안티패턴.",
    pitfalls: [
      "**손수 조립 금지** — 이용약관/개인정보 링크, 사업자번호, CEO 이름 등을 매번 입력하지 말 것. 한 번 잘못 적으면 법적 표기 누락 위험.",
      "**푸터 로고도 base64 내장 — 파일·호스팅 불필요.** 푸터 로고가 따로 있는 브랜드(nudge-eap/geniet/runmile)도 data URI 로 박혀 있어 `asset-base-url` 없이 그대로 렌더된다. `asset-base-url` 은 자체 로고로 바꿀 때만 쓰는 선택적 override.",
      "**surface 차이** — `web` (PC 전용 wide 푸터 · 로고+링크+회사정보), `app` (모바일 앱 footer · 압축형). 사용자 앱 모바일 화면이면 surface='app'.",
      "footerTone 은 브랜드별 고정 (trost=dark / 나머지=light) — 임의 override 시도 시 디자인 인텐트 어긋남.",
    ],
    recommended: [
      "Trost (dark): `<nds-brand-footer brand='trost' surface='app' />` · 로고 base64 내장 (파일 불필요)",
      "Geniet (light): `<nds-brand-footer brand='geniet' surface='web' />` · 로고 base64 내장 (파일 불필요)",
      "NudgeEAP (light): `<nds-brand-footer brand='nudge-eap' surface='web' />` · 로고 base64 내장 (파일 불필요)",
      "CashwalkBiz (light): `<nds-brand-footer brand='cashwalk-biz' surface='web' />` · 로고 base64 내장 (파일 불필요)",
      "Runmile (light): `<nds-brand-footer brand='runmile' surface='app' />` · 로고 base64 내장 (gray700 워드마크) · footerTone=light (forcedProps '*' default)",
      "자체 로고로 교체할 때만: `asset-base-url='/brand-logos'` (override 전용 · 기본 목업엔 불필요).",
      "Aliases: `<nds-trost-footer>`, `<nds-geniet-footer>`, `<nds-nudge-eap-footer>`, `<nds-cashwalk-biz-footer>`, `<nds-runmile-footer>`",
    ],
    examplesHtml: {
      do: '<nds-brand-footer brand="geniet" surface="web"></nds-brand-footer>',
      dont:
        "<!-- 손수 조립 안티패턴 — 사업자 정보/copyright/링크를 인라인으로 적으면 법적 표기 누락/잘못된 정보가 SSOT 깨고 페이지 간 불일치 -->\n" +
        '<footer class="my-footer">\n' +
        '  <a href="/terms">이용약관</a> | <a href="/privacy"><b>개인정보처리방침</b></a>\n' +
        "  <p>넛지모바일 주식회사 · 사업자번호 ...</p>\n" +
        "</footer>",
    },
    /**
     * Pattern 'Brand-aware Base' metadata (Figma 450:68 v2).
     * forcedProps: footerTone 은 brand 별 고정. trost 만 dark, 그 외 light ('*' 키 = default).
     */
    forcedProps: {
      footerTone: { trost: "dark", "*": "light" },
    },
    assetManifest: {
      trost: [],
      geniet: ["geniet-logo-footer.webp"],
      "nudge-eap": ["nudge-eap-logo-footer.png"],
      "cashwalk-biz": [],
    },
  },
  BrandBottomNav: {
    name: "BrandBottomNav",
    summary:
      "**브랜드 앱 하단 BottomNav — 손수 조립하지 말 것.** `<nds-brand-bottom-nav brand='trost|geniet|nudge-eap|runmile' active-key='home'>` 한 줄로 브랜드별 5탭 (라벨/아이콘 active·inactive/색)이 BRAND_DATA 에서 자동 렌더. 제네릭 nds-footer-tab-bar + nds-footer-tab-item 에 아이콘 SVG 를 슬롯으로 직접 주입하는 건 안티패턴.",
    pitfalls: [
      "**손수 조립 금지** — nds-footer-tab-bar / nds-footer-tab-item 를 직접 박고 `<span slot='icon'>` 에 SVG 를 손으로 넣지 말 것. 브랜드별 탭/아이콘/색은 BrandBottomNav 한 줄이 BRAND_DATA 에서 전부 자동.",
      "**cashwalk-biz 는 BottomNav 없음** — 웹 전용 브랜드라 `<nds-brand-bottom-nav brand='cashwalk-biz'>` 는 빈 렌더. 어드민/CMS 좌측 내비는 Sidebar 사용.",
      "active-key 는 브랜드별 탭 key 와 매칭 — trost: home/counsel/community/care/my · geniet: home/record/benefit/review/community · nudge-eap: home/challenge/counsel/care/my · runmile: home/race/community/chat/my. 잘못 적으면 활성 탭 표시 안 됨.",
      "**Geniet 은 단일 그래픽 + color cascade** — active/inactive 별도 아트가 아니라 같은 SVG 가 nav-item color(민트↔그레이)로 active 를 표현. Trost/NudgeEAP/Runmile 은 active/inactive 그래픽 분리(채워진 아이콘 전환).",
      "Runmile 라벨은 12/16 (Figma 실측 — 11/14 아님).",
      "HTML 래퍼는 트로스트 기본 앱(홈/심리상담/커뮤니티/멘탈케어/내공간)만 커버. React TrostBottomNav 의 variant='cashwalk-trost'(홈/사운드/내음악/커뮤니티/마이페이지)는 HTML 미지원 — 필요 시 React 컴포넌트 사용.",
    ],
    recommended: [
      "Trost: `<nds-brand-bottom-nav brand='trost' active-key='counsel' />` · 탭 keys: home / counsel / community / care / my",
      "Geniet: `<nds-brand-bottom-nav brand='geniet' active-key='home' />` · 탭 keys: home / record / benefit / review / community (단일 그래픽 + color cascade)",
      "NudgeEAP: `<nds-brand-bottom-nav brand='nudge-eap' active-key='home' />` · 탭 keys: home / challenge / counsel / care / my",
      "Runmile: `<nds-brand-bottom-nav brand='runmile' active-key='race' />` · 탭 keys: home / race / community / chat / my (라벨 12/16)",
      "Aliases (선택): `<nds-trost-bottom-nav>`, `<nds-geniet-bottom-nav>`, `<nds-nudge-eap-bottom-nav>`, `<nds-runmile-bottom-nav>` — brand attribute 안 써도 동일 동작.",
    ],
    examplesHtml: {
      do: '<nds-brand-bottom-nav brand="trost" active-key="counsel"></nds-brand-bottom-nav>',
      dont:
        "<!-- 손수 조립 안티패턴 — 탭/아이콘/색을 인라인으로 박으면 브랜드 데이터와 분리되어 다음 화면에서 또 적게 됨 -->\n" +
        '<nds-footer-tab-bar active-tab="home">\n' +
        '  <nds-footer-tab-item key="home" label="홈" href="/">\n' +
        '    <span slot="icon"><svg ...></svg></span>\n' +
        '    <span slot="active-icon"><svg ...></svg></span>\n' +
        "  </nds-footer-tab-item>\n" +
        "  <!-- ...4 more... -->\n" +
        "</nds-footer-tab-bar>",
    },
    usagePolicy: {
      useFor: ["사용자 앱 (Trost/Geniet/NudgeEAP/Runmile) 모바일 하단 5탭 내비게이션"],
      doNotUseFor: [
        "웹 전용 브랜드(CashwalkBiz) — BottomNav 자체가 없음",
        "어드민/CMS 좌측 내비 — Sidebar 사용",
      ],
      emphasisRule:
        "nds-footer-tab-bar 를 손수 조립하고 SVG 를 슬롯에 박은 흔적이 발견되면 즉시 BrandBottomNav 한 줄로 교체.",
    },
    /**
     * Pattern 'Brand-aware Base' metadata. BRAND_DATA SSOT 는 `packages/html/src/components/nds-brand-chrome.ts`.
     * runmile 은 validPropValues 타입 union 밖이라 활성 key 는 recommended/pitfalls prose 로만 노출.
     */
    validPropValues: {
      trost: { activeKey: ["home", "counsel", "community", "care", "my"] },
      geniet: { activeKey: ["home", "record", "benefit", "review", "community"] },
      "nudge-eap": { activeKey: ["home", "challenge", "counsel", "care", "my"] },
    },
  },
  BrandChrome: {
    name: "BrandChrome",
    summary:
      "Brand chrome wrappers — BrandHeader + BrandFooter + BrandBottomNav 의 umbrella. **개별 BrandHeader / BrandFooter / BrandBottomNav 가이드를 우선 참고.** `nds-brand-chrome.ts` 한 파일에 5개 브랜드 (nudge-eap / trost / geniet / cashwalk-biz / runmile) 의 BRAND_DATA (로고/메뉴/사업자정보/footer 링크/bottomNav 탭) 가 모두 정의돼 있다. 손수 조립한 헤더/푸터/바텀네비가 발견되면 Brand* 한 줄로 즉시 교체.",
    pitfalls: [
      "이 컴포넌트는 wrapper — 실제 사용 시 `<nds-brand-header>` / `<nds-brand-footer>` / `<nds-brand-bottom-nav>` 를 호출. `<nds-brand-chrome>` 단독 사용은 없음.",
      "BRAND_DATA 를 수정하려면 DS 레포의 `packages/html/src/components/nds-brand-chrome.ts` 직접 편집 (외부 mockup 프로젝트에서는 불가능).",
    ],
    examplesHtml: {
      do: '<nds-brand-header brand="trost" surface="web" active-key="counsel"></nds-brand-header>\n<!-- ...page content... -->\n<nds-brand-bottom-nav brand="trost" active-key="counsel"></nds-brand-bottom-nav>\n<nds-brand-footer brand="trost" surface="app"></nds-brand-footer>',
      dont: '<!-- nds-brand-chrome 단독 사용 — wrapper 라 의미 없음 -->\n<nds-brand-chrome brand="trost"></nds-brand-chrome>',
    },
  },
};

/* ───────────── 디자인 원칙 (DESIGN.md 발췌 + 큐레이션) ───────────── */

export interface DesignPrinciples {
  brandTone: string;
  colors: Record<string, string>;
  typography: { family: string; weights: string[]; rules: string[] };
  spacing: { base: number; scale: number[]; rules: string[] };
  elevation: { rule: string; stack: Record<string, string> };
  shapes: Record<string, string>;
  dos: string[];
  donts: string[];
  bannedPatterns: { name: string; rule: string }[];
}

export const DESIGN_PRINCIPLES: DesignPrinciples = {
  brandTone:
    "낮은 진입 장벽과 전문적 신뢰감을 주되, 흔한 SaaS/헬스케어 클리셰처럼 보이면 안 됩니다. Linear/Notion식 회색 카드 그리드, 스톡사진+파스텔 그라데이션, 모든 카드에 아이콘을 꽂는 대시보드 톤, 과한 감성 카피/일러스트 장식은 금지. Neutral surface와 텍스트 위계를 기본으로 두고 primary blue는 대표 CTA와 핵심 인터랙션에만 제한합니다.",
  colors: {
    primary: "#2B96ED — CTA, 활성, 핵심 인터랙티브. 화면당 가장 중요한 1개 액션만.",
    secondary: "#ED2E77 — 마젠타 포인트. 프로모션, 감정 표현, 보조 강조.",
    error: "#F13F00 — 유효성 오류, 파괴적 액션.",
    caution: "#FFC303 — 주의 알림. 텍스트는 #FFA100.",
    success: "#13BFA2 — 완료, 긍정 피드백.",
    surface: "#FFFFFF — 페이지/카드 배경.",
    onSurface: "#383838 — 본문 텍스트, 아이콘.",
  },
  typography: {
    family: "Pretendard (한/영 모두)",
    weights: ["Regular(400)", "Medium(500)", "Semibold(600)", "Bold(700)"],
    rules: [
      "Display/Headlines: Bold(700), 18-52px",
      "Body: Medium~Regular, 14-16px",
      "Caption: Regular, 11-13px",
      "한 화면에 2-3개 웨이트만 사용 (3개 이상 혼용 금지)",
    ],
  },
  spacing: {
    base: 4,
    scale: [4, 8, 10, 12, 16, 20, 24],
    rules: [
      "4pt grid 기반. Gap(요소 간 거리)과 Inset(컨테이너 내부 여백)을 명확히 구분한다.",
      "Gap 은 의도 기반 시멘틱 토큰만 사용: --semantic-gap-tight(4) / --semantic-gap-default(10, 표준) / --semantic-gap-comfortable(12) / --semantic-gap-loose(16) / --semantic-gap-wide(24).",
      "헤딩 ↔ 서브타이틀 간격은 level 기반 토큰 사용: --semantic-gap-title-h1(12) / -h2(12) / -h3(12) / -h4(6, ★ 카드 헤딩) / -h5(8, ★ 서브 헤딩). 임의 margin/spacing 직접 지정 금지.",
      "Inset 은 사용처 기반 시멘틱 토큰만 사용: --semantic-inset-chip(8) / --semantic-inset-input(12) / --semantic-inset-card(16, 표준) / --semantic-inset-card-large(20) / --semantic-inset-modal(24).",
      "임의 px (5/7/9/11/13/15) 사용 금지. Primitive(--spacing-N) 직접 사용 금지 — 반드시 semantic 토큰 거치기.",
      "AppBar 52px / BottomBar 56px",
      "Mobile 좌우 마진 16px / Desktop 콘텐츠 1200px center",
      "자세한 매핑·결정 트리는 get_guide({ topic: 'pattern:semantic-spacing' }) 참고.",
    ],
  },
  elevation: {
    rule: "최소한의 그림자. 계층은 배경색/보더로 구분. 그림자와 보더 동시 적용 금지(이중 계층).",
    stack: {
      sm: "0 1px 3px rgba(0,0,0,0.1) — 카드, 드롭다운",
      md: "0 4px 12px rgba(0,0,0,0.15) — Modal",
      lg: "0 11px 15px -7px rgba(0,0,0,0.2) — Popup",
      up: "0 -4px 12px rgba(0,0,0,0.1) — BottomSheet",
    },
  },
  shapes: {
    sm: "4px — 작은 요소, 인풋 내부 장식",
    md: "8px — 버튼/인풋/모달 등 대부분 기본값",
    lg: "12px — 카드, 바텀시트",
    pill: "9999px — 칩, 토글",
  },
  dos: [
    "★ 선언된 표면(surface: admin/service)이 화면 이름 통념을 지배한다 — 작업 시작 시 표면부터 확정하고 모든 레이아웃을 거기 맞춘다. surface=admin 이면 '회원가입/로그인/온보딩'처럼 소비자 플로우를 연상시켜도 어드민 화면(admin-shell 사이드바+톱바, 또는 어드민 온보딩 중앙 카드)으로 만든다. 표면의 SSOT 는 brief/CLAUDE.md 선언 + nudge.surface 마커 — 화면 제목으로 추측하지 말 것.",
    "Primary 색상은 화면당 가장 중요한 1개 액션에만 사용",
    "강조 장치는 화면당 우선순위가 가장 높은 영역에 집중하고, 안내/보조 영역은 기본적으로 neutral surface를 사용",
    "텍스트 대비비 WCAG AA (4.5:1) 이상 유지",
    "터치 타겟은 최소 44px 보장",
    "4pt 그리드에 맞춰 간격 설정. Gap(요소 간)과 Inset(컨테이너 내부)을 구분해 항상 semantic 토큰(--semantic-gap-* / --semantic-inset-*) 사용",
    "Brand background(--semantic-bg-brand-*)는 주의/안내/하이라이트 의미 전달이 필요할 때만, 한 화면당 1개 이내로 사용 — 자세히는 get_guide({ topic: 'pattern:surface-layer' })",
    "인터랙티브 요소(Button/IconButton/Card.Root clickable/Tabs)에는 onClick 등 핸들러를 반드시 부착",
    "표준 variant에 없는 톤이 필요하면 컴포넌트의 style/icon 같은 확장 슬롯을 활용 (raw 요소로 대체 금지)",
    "단독 아이콘은 주변 텍스트/배경과 어울리는 토큰 컬러를 명시하거나 부모 color를 토큰으로 지정해 currentColor가 의도한 색을 상속하게 함",
    "아이콘은 행동/상태/affordance 전달 목적에만 사용 — 화이트리스트와 검증 룰은 get_guide({ topic: 'pattern:icon-usage' })",
    "아이콘 선택 필수 우선순위: 1) 현재 브랜드 전용 아이콘(예: Geniet*/Trost*) 2) NudgeEAP 기본 브랜드 아이콘 3) 목업용 기본 아이콘 패키지(MockupLinear*/MockupBold*) 4) 자체 생성 SVG. 이 순서를 건너뛰지 말 것.",
    "Tab 은 동일 depth 콘텐츠 전환·category navigation·section switching 에만 사용 — 필터/CTA/라우팅 대체용 금지",
    "Modal 은 즉각적 판단/응답이 필요할 때만 사용 — 단순 정보는 inline Notice/Banner, 에러는 Toast/inline error 사용",
    "Badge 는 보조 정보 — 일반 카테고리는 ghost/line + neutral 우선, Brand color 는 '현재 선택·핵심 강조' 에만",
    "브랜드 모드(brand='geniet'/'trost' 등)에서 작업할 때, 해당 브랜드 prefix 의 아이콘(예: `GenietRecordIcon`, `GenietGpointIcon`)이 존재하면 공용 아이콘보다 **우선 사용**. find_icon 결과에 brand prefix 가 보이면 그 브랜드 모드에서는 그 쪽이 정답. 사용 가능한 브랜드 아이콘 목록은 get_brand({ brand: '<slug>' }).detail.brandIcons 로 조회.",
    "브랜드 전용 아이콘이 없으면 NudgeEAP 기본 아이콘(`HomeIcon`, `SearchIcon` 등)을 먼저 찾고, 그 다음에만 목업용 기본 아이콘(`MockupLinear*Icon`, `MockupBold*Icon`)을 사용. 자체 생성 SVG는 마지막 수단.",
    "브랜드 분기는 공통 컴포넌트 구현이 아니라 **브랜드 전용 화면/스토리** 에서 처리 — 브랜드 화면이 명시적으로 `Geniet*Icon` 을 import 해 컴포넌트의 icon prop 으로 전달. (예: `<Footer.TabBar tabs={[{ icon: <GenietRecordIcon /> }]} />`)",
  ],
  donts: [
    "표면=admin 화면에 소비자 brand chrome(<nds-brand-header> / <nds-brand-footer> / <nds-brand-bottom-nav>) 사용 금지 — 어드민은 admin-shell(사이드바+톱바) 또는 어드민 온보딩 카드. '회원가입/로그인'이라는 화면 이름으로 소비자 플로우를 추측하지 마세요. build_singlefile_html / validate_html_mockup 의 admin-surface-consumer-chrome 룰(error)로 자동 차단됨.",
    "한 화면에 3개 이상의 폰트 웨이트를 혼용하지 마세요",
    "둥근 코너와 각진 코너를 같은 뷰에서 섞지 마세요",
    "그림자와 보더를 동시에 적용하여 이중 계층을 만들지 마세요",
    "그라데이션 배경 사용 금지 — 단색 토큰만",
    "Card 슬롯(Header/Body/Footer)에 외곽 padding 추가 금지 — 자체 padding과 충돌",
    "Button color='assistive' + variant='solid' 조합을 활성 CTA로 사용 금지 (비활성처럼 보임)",
    "색 배경 + 아이콘 + Chip/Badge + 굵은 제목/그라데이션을 한 안내 영역에 동시에 넣지 마세요",
    "다른 페이지로 이동하는 CTA마다 우측 화살표를 반복하지 마세요",
    "Chip/Badge를 새 섹션 장식이나 일반 안내문 강조 용도로 남발하지 마세요",
    "단독 아이콘을 기본 currentColor 그대로 방치하지 마세요 — 검정/본문색 아이콘이 주변 UI 톤과 어긋날 수 있음",
    "연한 primary 배경 위에 연한 primary filled tag/box를 반복하지 마세요 — 같은 톤 위 같은 톤 강조는 위계를 만들지 못함",
    "로고의 gradient/accent 컬러를 UI 배경/태그/CTA 컬러처럼 사용하지 마세요 — 로고 표현과 UI 시스템 컬러는 분리",
    "DS 컴포넌트에 정확히 매칭되는 쓰임이 있는데 raw <button>/<input>/<span>으로 대체 금지",
    "이모지 절대 사용 금지 — 어떤 위치에서도(라벨/버튼/제목/placeholder/empty state) 이모지를 텍스트로 박지 마세요. 아이콘이 필요하면 find_icon. validate_mockup 의 emoji-banned 룰로 자동 검출됨.",
    "→ ← ✓ ★ • 같은 텍스트 기호 사용 금지 — 화살표/체크/별점/불릿을 문자로 표현하지 마세요. 아이콘은 find_icon, 진행/별점/리스트는 DS 컴포넌트(StatusTimeline/Rating/Dense list) 사용. validate_mockup 의 text-symbol-banned 룰로 자동 검출됨.",
    "Primitive spacing(--spacing-N) / 임의 px (5/7/9/11/13/15) 사용 금지 — 반드시 --semantic-gap-* / --semantic-inset-* semantic 토큰으로 표현",
    "Inset(내부 여백) 자리에 Gap 토큰 사용 금지 (또는 그 반대) — padding 자리에 --semantic-gap-*, gap 자리에 --semantic-inset-* 쓰지 않기",
    "Brand background 를 단순 시각 구분·decorative section·KPI 카드·summary 카드 배경으로 사용 금지 — 의미 전달 없는 색 배경은 위계를 망가뜨림",
    "한 화면 안에서 카드마다 다른 pastel background 를 사용해 영역을 색으로 구분하지 마세요 — 구분은 spacing/border/text 위계로",
    "서브타이틀(h3/h4) 앞 장식 아이콘 · Form Label 앞 장식 아이콘 · 본문 텍스트 앞 decorative icon 금지 — 한 화면에서 일부 헤딩에만 아이콘을 붙이면 hierarchy 가 깨짐",
    "헤딩 앞 아이콘 5개 이상 사용 시 자동 위반 — 아이콘을 hierarchy 표현 수단으로 쓰지 마세요",
    "Tab 을 CTA처럼 사용 금지 — '저장/신청/다음 단계' 등 액션은 Button 사용. Tab 은 동일 depth 콘텐츠 전환 전용",
    "Segment Tab(variant='square') 을 모바일 일반 화면에 사용 금지 — PC CMS · 주요 기능 전환에만 사용",
    "단순 정보 전달용으로 Modal 사용 금지 — inline Notice / Banner / section 안내 우선. Modal 은 즉각적 판단/응답이 필요할 때만",
    "Modal 내부에 또 다른 강조(Card·Brand BG·Chip 그룹)를 쌓지 마세요 — 핵심 action 1 + 보조 action 1 구조가 기본",
    "Fill Badge 를 한 카드/Row 안에 2개 이상 두지 마세요 — 일반 카테고리는 ghost/line 우선, Fill 은 카드당 최대 1개",
    // ── Card Everything Syndrome ──
    "모든 영역을 카드로 감싸지 마세요 — 카드는 '독립된 정보 단위' 일 때만. 단순 group/section 은 spacing + h3 + Divider 로 위계를 만드세요",
    "카드 안에 카드를 중첩하지 마세요 — 카드 안에는 Header/Body/Footer 슬롯과 Chip/Badge 같은 inline 요소만. 내부 영역 강조가 필요하면 surface.section bg 한 단계로",
    "카드를 hierarchy 구분 도구로 남용하지 마세요 — 위계는 typography(headline/body/caption) 와 spacing 으로 표현. '카드 = 강조' 는 안티패턴",
    // ── Floating UI Everywhere ──
    "떠 있지 않아야 할 요소(인라인 리스트·일반 카드·기본 입력 필드)에 elevation/shadow 를 적용하지 마세요 — shadow 는 floating UI(Modal/Popup/Dropdown/BottomSheet)에만",
    "한 화면에 floating panel(Modal/Drawer/Popup/Toast) 을 2개 이상 동시에 띄우지 마세요 — 사용자 주의 분산",
    "shadow-heavy layout 금지 — 한 화면에 그림자 있는 요소가 3개를 넘으면 floating 의미를 잃습니다. Border 또는 surface tone 으로 대체",
    "detached card(공중에 떠 있는 카드) 를 의미 없이 만들지 마세요 — 카드는 페이지 흐름 안에 자연스럽게 위치",
    // ── Typography Chaos ──
    "Bold 를 한 화면에서 5곳 이상 남발하지 마세요 — Bold 는 '가장 중요한 1-2 곳' 에만",
    "같은 화면에 h1 / h2 같은 큰 제목을 2개 이상 두지 마세요 — 한 화면당 최상위 헤딩은 1개. 보조 섹션은 h3 이하",
    "hierarchy 가 불명확한 텍스트 위계를 만들지 마세요 — 인접한 두 영역의 텍스트가 같은 fontSize × fontWeight 이면 위계가 무너짐",
    // ── Decorative Surface Abuse ──
    "section 구분을 색상만으로 해결하지 마세요 — 1차는 spacing(--semantic-gap-loose/wide), 2차는 Divider/Border, 마지막에 surface tone. 색으로만 나누면 색맹/저시력 사용자가 길을 잃습니다",
    "decorative background(임의 pastel/tinted surface)를 만들지 마세요 — 모든 bg 는 `--semantic-bg-*` 토큰 안에서. 분위기를 위해 옅은 색을 깔지 마세요",
    // ── Fake Dashboard Disease ──
    "의미 없는 KPI 카드/메트릭 그리드를 만들지 마세요 — 숫자 표시는 사용자가 의사결정에 쓸 때만",
    "장식용 chart/graph 를 추가하지 마세요 — 데이터가 실제 인사이트를 주지 않으면 Sparkline 한 줄로 충분. Generic SaaS dashboard 톤 피하세요",
    "장식 중심 hero section(큰 일러스트 + 큰 카피 + gradient 배경)을 만들지 마세요 — EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선",
    // ── Everything Has an Icon ──
    "한 화면에 여러 icon 스타일(선/면/colorful)을 혼용하지 마세요 — `@nudge-design/icons` 단일 셋만",
    "colorful/멀티컬러 아이콘을 본문 UI 에 과다 사용하지 마세요 — DS icon 은 currentColor monochrome 이 원칙. brand color icon 은 진입점 1-2 개에만",
    // ── Spacing Randomness 보강 ──
    "같은 depth(부모 컨테이너 안의 형제 요소들) 에 서로 다른 spacing 을 적용하지 마세요 — 형제는 같은 --semantic-gap-* 으로 통일",
    // ── Brand Icon ──
    "공통 컴포넌트(Footer/BottomNav/Header 등) 의 *구현* 안에 brand 분기 로직(`if (brand === 'geniet') return <GenietRecordIcon />`)을 넣지 마세요 — DS 컴포넌트는 brand-agnostic 으로 유지. 분기는 사용처(브랜드 전용 화면)에서 명시적 icon prop 으로 표현.",
    "브랜드 모드인데 공용 아이콘(`HomeIcon`/`CouponIcon` 등) 을 그대로 쓰지 마세요 — 같은 의미의 brand prefix 아이콘이 있으면 그게 우선. get_brand({ brand: '<slug>' }).detail.brandIcons 로 매칭 확인.",
    "NudgeEAP 기본 아이콘이나 MockupLinear*/MockupBold* 아이콘을 확인하지 않고 인라인 SVG/직접 생성 아이콘으로 넘어가지 마세요 — 자체 생성은 마지막 수단.",
  ],
  bannedPatterns: [
    {
      name: "gradient-background",
      rule: "linear-gradient / radial-gradient / conic-gradient — 사용 금지",
    },
    {
      name: "entry-bottomsheet",
      rule: "화면 진입 직후 BottomSheet/Modal 자동 노출 금지 — 알림 동의·프로모션 포함. 진입 시점에는 사용자가 의도한 화면을 먼저 보여주세요.",
    },
    {
      name: "back-press-interrupt",
      rule: "뒤로가기/닫기 직후 인터럽트(BottomSheet/Modal) 노출 금지 — 이탈을 막기 위해 의도된 추가 동의/광고/만류 다이얼로그는 다크패턴입니다.",
    },
    {
      name: "no-decline-cta",
      rule: "거절 불가 CTA 구조 금지 — '확인' 1개만 있고 닫기/취소/나중에 옵션이 없는 다이얼로그/풀스크린 카드. 비파괴 옵션 최소 1개를 보장하세요.",
    },
    {
      name: "mid-flow-interstitial",
      rule: "플로우 중간 예상 못한 전면 모달/광고 금지 — 사용자가 메뉴/액션을 눌렀을 때 그 결과 대신 다른 콘텐츠(광고/프로모션/추가 동의)가 먼저 노출되면 안 됩니다.",
    },
    {
      name: "ambiguous-cta-label",
      rule: "CTA 라벨 모호성 금지 — 버튼만 보고 다음 화면/행동을 예측할 수 있어야 합니다. 위 카피의 가치 제안을 그대로 반복한 버튼('지금 시작'·'확인' 등)은 결과를 숨겨 사용자가 클릭을 망설입니다.",
    },
    {
      name: "card-everything",
      rule: "Card Everything Syndrome 금지 — 모든 정보 단위를 카드로 감싸면 위계가 사라집니다. 한 화면에 카드가 5개를 넘으면 80% 이상 안티패턴. 단순 group/section 은 spacing + Divider + heading 으로 표현.",
    },
    {
      name: "nested-card",
      rule: "카드 안 카드 중첩 금지 — 카드 내부 영역 강조는 surface.section tone 한 단계 또는 inline Chip/Badge 로. nested Card 는 위계 표현 도구가 아닙니다.",
    },
    {
      name: "decorative-shadow",
      rule: "떠 있지 않아야 할 요소(인라인 리스트·일반 카드·기본 입력)에 shadow 적용 금지. Shadow 는 floating UI (Modal/Popup/Dropdown/BottomSheet) 와 'hover 시 floating 표현' 에만.",
    },
    {
      name: "fake-dashboard",
      rule: "Fake Dashboard 금지 — 의미 없는 KPI 카드/장식용 chart/장식 hero. EAP 도메인은 사용자 상태/액션 위주. Generic SaaS dashboard 패턴 회피.",
    },
    {
      name: "section-color-only",
      rule: "section 구분을 색상으로만 해결 금지 — 1차 spacing → 2차 Divider/Border → 3차 surface tone. 색맹/저시력 접근성을 위해 색 단독 구분은 불가.",
    },
    {
      name: "repeated-h1",
      rule: "한 화면에 h1/h2 같은 최상위 헤딩 2개 이상 금지 — 페이지 제목은 1개. 보조 섹션은 h3 이하.",
    },
    {
      name: "bold-overuse",
      rule: "한 화면에 Bold 텍스트 5곳 이상 사용 금지 — Bold 는 화면당 1-2개 핵심에만. 본문은 Regular/Medium.",
    },
    {
      name: "mixed-icon-style",
      rule: "한 화면에 여러 icon 스타일(선/면/colorful) 혼용 금지 — `@nudge-design/icons` 단일 셋만. 외부 콜렉션·이모지·multi-color SVG 섞지 마세요.",
    },
  ],
};

/* ───────────── UX 라이팅 가이드 (UX Writing 가이드 + EAP 도메인) ─────────────
 *
 * 모든 사용자 노출 텍스트에 적용되는 보이스톤·문장 규칙.
 * EAP 멘탈케어 도메인은 위기·자해·진단 표현에 추가 룰이 필요해 별도 섹션으로 분리한다.
 */

export interface UxWritingGuide {
  voiceTone: string;
  principles: {
    name: string;
    summary: string;
    do: string[];
    dont: string[];
  }[];
  microcopy: { context: string; rule: string; example?: string }[];
  eapDomain: string[];
}

export const UX_WRITING_GUIDE: UxWritingGuide = {
  voiceTone:
    "낮은 진입 장벽 + 전문적 신뢰감. 친근하지만 단정·당당하게. 캐주얼 경어(해요체)를 기본으로 사용하고 과도한 격식(`~시겠어요?`, `~께`)이나 광고 톤(`바로!`, `놓치지 마세요`)은 피한다. 멘탈케어 도메인 특성상 사용자 평가 어휘와 의료 단정 표현은 별도 룰을 따른다.",
  principles: [
    {
      name: "해요체",
      summary: "상황·맥락 무관 모든 문구에 해요체를 적용한다. 합니다체·반말 금지.",
      do: ["저장했어요", "확인했어요", "다시 시도해 주세요"],
      dont: ["저장되었습니다", "확인", "다시 시도하세요"],
    },
    {
      name: "능동형 말하기",
      summary: "수동형보다 능동형. '~되었습니다'/'~었어요' 보다 '~했어요'. 동사를 바꿔 능동으로.",
      do: ["저장했어요", "이미 신청했어요", "사용 중이에요"],
      dont: ["저장됐어요", "신청이 완료되었어요", "사용되고 있어요"],
    },
    {
      name: "긍정형 말하기",
      summary:
        "부정 표현을 줄이고 긍정형으로. '~ 없어요/안 돼요' 대신 '~하면 할 수 있어요'. 에러도 다음에 무엇을 할 수 있는지 알린다.",
      do: ["다시 시도해 주세요", "조건을 충족하면 받을 수 있어요"],
      dont: ["사용할 수 없어요", "혜택을 받을 수 없어요"],
    },
    {
      name: "캐주얼한 경어",
      summary: "'~시', '계시다', '여쭈다', '~께' 같은 과도한 경어 사용 금지.",
      do: ["연락처를 알려주세요", "이름을 입력해 주세요", "친구에게 보낼래요?"],
      dont: ["연락처를 여쭤봐도 될까요?", "성함을 입력해주시겠어요?", "친구께 보내시겠어요?"],
    },
    {
      name: "{명사}+{명사} 풀어쓰기",
      summary: "한자어 명사 연속은 동사 형태로 풀어 캐주얼하게 표현한다.",
      do: ["입력을 완료했어요", "결제가 끝났어요"],
      dont: ["입력 완료", "결제 완료"],
    },
  ],
  microcopy: [
    {
      context: "다이얼로그 왼쪽 버튼 (취소 자리)",
      rule: "다이얼로그/모달 왼쪽 버튼 라벨은 항상 **닫기**. '취소'는 작업이 취소된다고 오해될 수 있어 사용 금지.",
      example: "[닫기] [확인]   ← Good     /     [취소] [확인]   ← Bad",
    },
    {
      context: "에러 메시지",
      rule: "원인 + 다음 행동을 한 문장에. 사용자 탓으로 들리는 표현(`잘못된 입력입니다`) 금지.",
      example: "비밀번호가 일치하지 않아요. 다시 입력해 주세요.",
    },
    {
      context: "혜택 미충족 안내",
      rule: "'~할 수 없어요' 대신 충족 조건을 긍정형으로 안내한다. 사용자가 서비스 전체를 못 쓴다고 오해하지 않도록.",
      example: "20대만 받을 수 있는 혜택이에요.   ← Good     /     혜택을 받을 수 없어요   ← Bad",
    },
    {
      context: "CTA 라벨",
      rule: "버튼 라벨만 보고 다음 화면/행동을 예측할 수 있어야 한다. 위 카피의 가치 제안을 그대로 반복하지 않는다. 버튼 위 보조 설명이 라벨과 중복되지 않도록.",
      example: "[상담사 보기] [신청하기]   ← Good     /     [지금 시작하기] [확인]   ← Bad",
    },
    {
      context: "Empty state",
      rule: "비어 있다는 사실보다 다음에 할 수 있는 행동을 노출한다.",
      example: "아직 작성한 일기가 없어요. 오늘의 감정을 기록해 보세요.",
    },
  ],
  eapDomain: [
    "위기·자해·자살 관련 표현은 사실 중심으로. 자극적 단어(`극단적 선택`, `~해버리다`) 금지. 위기 콜아웃은 직접적 안내(`24시간 정신건강 위기상담 1577-0199`)와 차분한 톤으로.",
    "평가 어휘 금지: `정상/비정상`, `심각/괜찮음`을 진단처럼 단정하지 않는다. `현재 점수가 OO 구간이에요` 처럼 구간/맥락으로 표현.",
    "의료 행위 단정 금지: `진단`, `처방`, `치료` 같은 용어는 실제 의료진의 행위에만 사용. 자가검사·자기관리 컨텍스트에서는 `자가검사`, `점검`, `관리` 로 표현.",
    "사용자 동의 기반 표현: `~하셔야 합니다` 대신 `~할까요?` / `원하시면 ~할 수 있어요`. 강요·재촉 어휘(`반드시`, `당장`) 금지.",
    "익명성·프라이버시 안내는 명시적으로. `회사에 공유되지 않아요`, `이름을 입력하지 않아도 돼요` 처럼 사용자가 안심할 수 있는 문장을 우선 노출.",
    "검사 결과 라벨은 임상 진단처럼 들리지 않게: `위험군` 대신 `관심 필요`, `정상` 대신 `안정`. 검사 결과 상세에서는 점수·구간·해석을 한 묶음으로.",
  ],
};

export interface PatternGuide {
  name: string;
  summary: string;
  /** 평탄 룰 리스트 — MCP consumers (외부 mockup AI) 가 보는 진실 소스. ruleGroups 가 있어도 항상 채워야 한다. */
  rules: string[];
  /** 평탄 회피 리스트 — MCP consumers 진실 소스. avoidGroups 가 있어도 항상 채워야 한다. */
  avoid: string[];
  /** docs 사이트의 카테고리 subheading 용. 있으면 generate-guide-docs 가 ### 로 묶어 렌더한다. 없으면 flat rules 로 폴백. */
  ruleGroups?: Array<{ heading: string; items: string[] }>;
  /** docs 사이트의 회피 패턴 subheading 용. */
  avoidGroups?: Array<{ heading: string; items: string[] }>;
  metrics?: Record<string, string | number | boolean>;
  referenceInputs?: {
    accepted: string[];
    minimum: string;
    format: string;
    fallbackQuestion: string;
  };
  examples?: Array<{
    verdict: "good" | "bad";
    source: string;
    caption: string;
  }>;
  /** 대표 Figma 노드 URL — 단일 레퍼런스 (브랜드 가이드 / 어드민 표준 등). */
  figmaNodeUrl?: string;
  /** 추가 레퍼런스 (스크린샷 URL · Figma 다중 노드 등). label/caption 으로 무엇을 보여주는지 식별. */
  references?: Array<{
    label: string;
    /** Figma 또는 외부 URL. image 와 둘 중 하나는 있어야 의미가 있음. */
    url?: string;
    /** 로컬 이미지 경로 (`apps/storybook/public/...` 등). */
    image?: string;
    caption?: string;
    brand?: "trost" | "geniet" | "cashwalk-biz" | "nudge-eap" | "runmile";
  }>;
}

/** ruleGroups / avoidGroups 를 flat 배열로 펼친다. SSOT 인 flat rules/avoid 에 일관되게 채우기 위한 헬퍼. */
function flattenGroups(groups: Array<{ items: string[] }>): string[] {
  return groups.flatMap((g) => g.items);
}

/**
 * Figma Iconography(379:490) 라이브러리 분류와 스타일 메타데이터.
 * 카테고리: basic / navigation / action / media / state-reaction / location / eap-service / color
 * 스타일:   line(기본) / filled(강조·활성·소형) / color(다색 일러스트성 아이콘)
 *
 * ── 브랜드 아이콘 사용 정책 ──────────────────────────────────────────────
 * `Geniet*Icon`, `Trost*Icon` 같은 brand prefix 아이콘은 해당 브랜드 디자인을 그대로 옮긴
 * 변종이라 공용 아이콘과 시각이 다릅니다.
 *
 * **브랜드 모드(brand='geniet' / 'trost' 등) 작업 시:**
 *   - 같은 의미의 brand prefix 아이콘이 존재하면 **반드시 그쪽을 우선 사용**.
 *     (예: Geniet bottom nav → `GenietRecordIcon` (단일 그래픽 + color cascade), 공용 PushActiveIcon X)
 *   - 사용 가능한 brand 아이콘 목록은 `get_brand({ brand: '<slug>' }).detail.brandIcons` 로 조회.
 *   - 매칭이 없으면 공용 아이콘 fallback 으로 사용 (예: `LikeIcon` 은 Geniet 매칭 없음 → 공용 OK).
 *
 * **컴포넌트 구현(공통 DS) 에서는:**
 *   - brand 분기 로직(`if (brand === 'geniet')`)을 컴포넌트 안에 박지 않는다.
 *   - DS 컴포넌트는 brand-agnostic 유지, 브랜드 전용 화면이 명시적으로 icon prop 으로 전달.
 *     예: `<Footer.TabBar tabs={[{ key: 'record', icon: <GenietRecordIcon /> }]} />`
 */
export type IconCategory =
  | "basic"
  | "navigation"
  | "action"
  | "media"
  | "state-reaction"
  | "location"
  | "eap-service"
  | "color";

export type IconStyle = "line" | "filled" | "color";

export interface IconMeta {
  category: IconCategory;
  style: IconStyle;
  /** 같은 의미의 짝(예: HomeIcon ↔ HomeActiveIcon)이 있을 때 페어 이름. */
  pair?: string;
}

export const ICON_CATEGORY_LABELS: Record<IconCategory, string> = {
  basic: "기본 (Basic)",
  navigation: "탐색 (Navigation)",
  action: "액션 (Action)",
  media: "미디어 (Media)",
  "state-reaction": "상태·반응 (State / Reaction)",
  location: "위치·연결 (Location / Connect)",
  "eap-service": "EAP 서비스 (EAP Service)",
  color: "컬러 아이콘 (Color)",
};

export const ICON_METADATA: Record<string, IconMeta> = {
  // ── 기본 (Basic) ─────────────────────────────────────────
  ArrowBackIcon: { category: "basic", style: "line" },
  ArrowNextIcon: { category: "basic", style: "line" },
  ChevronUpIcon: { category: "basic", style: "line" },
  ChevronDownIcon: { category: "basic", style: "line" },
  ChevronLeftIcon: { category: "basic", style: "line" },
  ChevronRightIcon: { category: "basic", style: "line" },
  CloseIcon: { category: "basic", style: "line" },
  LockIcon: { category: "basic", style: "line" },
  InputdeleteIcon: { category: "basic", style: "line" },
  DragIcon: { category: "basic", style: "line" },
  PlusIcon: { category: "basic", style: "line" },
  MinusIcon: { category: "basic", style: "line" },

  // ── 탐색 (Navigation) ─ GNB 탭 / 탐색 보조 ──────────────
  HomeIcon: { category: "navigation", style: "line", pair: "HomeActiveIcon" },
  HomeActiveIcon: { category: "navigation", style: "filled", pair: "HomeIcon" },
  MentalcareIcon: { category: "navigation", style: "line", pair: "MentalcareActiveIcon" },
  MentalcareActiveIcon: { category: "navigation", style: "filled", pair: "MentalcareIcon" },
  CounselIcon: { category: "navigation", style: "line", pair: "CounselActiveIcon" },
  CounselActiveIcon: { category: "navigation", style: "filled", pair: "CounselIcon" },
  TrostHomeIcon: { category: "navigation", style: "line", pair: "TrostHomeActiveIcon" },
  TrostHomeActiveIcon: { category: "navigation", style: "filled", pair: "TrostHomeIcon" },
  TrostCounselIcon: { category: "navigation", style: "line", pair: "TrostCounselActiveIcon" },
  TrostCounselActiveIcon: { category: "navigation", style: "filled", pair: "TrostCounselIcon" },
  TrostCommunityIcon: { category: "navigation", style: "line", pair: "TrostCommunityActiveIcon" },
  TrostCommunityActiveIcon: { category: "navigation", style: "filled", pair: "TrostCommunityIcon" },
  TrostMentalcareIcon: { category: "navigation", style: "line", pair: "TrostMentalcareActiveIcon" },
  TrostMentalcareActiveIcon: {
    category: "navigation",
    style: "filled",
    pair: "TrostMentalcareIcon",
  },
  TrostMyIcon: { category: "navigation", style: "line", pair: "TrostMyActiveIcon" },
  TrostMyActiveIcon: { category: "navigation", style: "filled", pair: "TrostMyIcon" },
  TrostMkHomeIcon: { category: "navigation", style: "line", pair: "TrostMkHomeActiveIcon" },
  TrostMkHomeActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkHomeIcon" },
  TrostMkSoundIcon: { category: "navigation", style: "line", pair: "TrostMkSoundActiveIcon" },
  TrostMkSoundActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkSoundIcon" },
  TrostMkMymusicIcon: { category: "navigation", style: "line", pair: "TrostMkMymusicActiveIcon" },
  TrostMkMymusicActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkMymusicIcon" },
  TrostMkTalkIcon: { category: "navigation", style: "line", pair: "TrostMkTalkActiveIcon" },
  TrostMkTalkActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkTalkIcon" },
  TrostMkMypageIcon: { category: "navigation", style: "line", pair: "TrostMkMypageActiveIcon" },
  TrostMkMypageActiveIcon: { category: "navigation", style: "filled", pair: "TrostMkMypageIcon" },
  // Trost 앱바 (webview 헤더) 아이콘 — Figma 5:1169
  TrostBackIcon: { category: "navigation", style: "line" },
  TrostMkBackIcon: { category: "navigation", style: "line" },
  TrostSearchIcon: { category: "action", style: "line" },
  TrostAlarmIcon: { category: "action", style: "line" },
  TrostSettingIcon: { category: "action", style: "line" },
  ChallengeIcon: { category: "navigation", style: "line", pair: "ChallengeActiveIcon" },
  ChallengeActiveIcon: { category: "navigation", style: "filled", pair: "ChallengeIcon" },
  MypageIcon: { category: "navigation", style: "line", pair: "MypageActiveIcon" },
  MypageActiveIcon: { category: "navigation", style: "filled", pair: "MypageIcon" },
  PushIcon: { category: "navigation", style: "line", pair: "PushActiveIcon" },
  PushActiveIcon: { category: "navigation", style: "filled", pair: "PushIcon" },
  CalendarIcon: { category: "navigation", style: "line" },
  HamburgerIcon: { category: "navigation", style: "line" },
  MoreIcon: { category: "navigation", style: "line" },
  SearchIcon: { category: "navigation", style: "line" },

  // ── 액션 (Action) ────────────────────────────────────────
  EditIcon: { category: "action", style: "line" },
  ShareIcon: { category: "action", style: "line" },
  DownloadIcon: { category: "action", style: "line" },
  AddlistIcon: { category: "action", style: "line" },
  CommentIcon: { category: "action", style: "line" },
  DeleteIcon: { category: "action", style: "line" },
  BlockIcon: { category: "action", style: "line" },
  FilterIcon: { category: "action", style: "line" },
  RefreshIcon: { category: "action", style: "line" },
  SettingIcon: { category: "action", style: "line" },

  // ── 미디어 (Media) ───────────────────────────────────────
  PlayIcon: { category: "media", style: "line" },
  PauseIcon: { category: "media", style: "line" },
  SkipBackIcon: { category: "media", style: "line" },
  SkipForwardIcon: { category: "media", style: "line" },
  RepeatIcon: { category: "media", style: "line" },
  ShuffleIcon: { category: "media", style: "line" },
  VideocameraIcon: { category: "media", style: "line" },
  MicrophoneIcon: { category: "media", style: "line" },
  MymusicIcon: { category: "media", style: "line" },
  DecorationStickerIcon: { category: "media", style: "line" },
  DecorationTextIcon: { category: "media", style: "line" },
  CameraIcon: { category: "media", style: "filled" },
  SleepmodeOffIcon: { category: "media", style: "line", pair: "SleepmodeOnIcon" },
  SleepmodeOnIcon: { category: "media", style: "filled", pair: "SleepmodeOffIcon" },

  // ── 상태·반응 (State / Reaction) ────────────────────────
  StarIcon: { category: "state-reaction", style: "line" },
  FavoriteIcon: { category: "state-reaction", style: "line", pair: "FavoriteActiveIcon" },
  FavoriteActiveIcon: { category: "state-reaction", style: "filled", pair: "FavoriteIcon" },
  LikeIcon: { category: "state-reaction", style: "line", pair: "LikeActiveIcon" },
  LikeActiveIcon: { category: "state-reaction", style: "filled", pair: "LikeIcon" },
  ThumbUpIcon: { category: "state-reaction", style: "line" },
  InfoIcon: { category: "state-reaction", style: "line" },
  ReportIcon: { category: "state-reaction", style: "line" },
  TimeIcon: { category: "state-reaction", style: "line" },
  RecentIcon: { category: "state-reaction", style: "line" },
  EyeIcon: { category: "state-reaction", style: "line", pair: "EyeOffIcon" },
  EyeOffIcon: { category: "state-reaction", style: "line", pair: "EyeIcon" },

  // ── 위치·연결 (Location / Connect) ──────────────────────
  LocateIcon: { category: "location", style: "line" },
  TelephoneIcon: { category: "location", style: "line" },
  WebIcon: { category: "location", style: "line" },
  BluetoothIcon: { category: "location", style: "line" },
  SubwayIcon: { category: "location", style: "line" },
  WalkIcon: { category: "location", style: "line" },
  PinIcon: { category: "location", style: "line" },
  LinkIcon: { category: "location", style: "line" },
  CouponIcon: { category: "location", style: "line" },
  PointIcon: { category: "location", style: "line" },
  MonitorIcon: { category: "location", style: "line" },

  // ── EAP 서비스 (EAP Service) ────────────────────────────
  CounselingChatIcon: { category: "eap-service", style: "line" },
  CounselingVideoIcon: { category: "eap-service", style: "line" },
  TestIcon: { category: "eap-service", style: "line" },
  FacilityIcon: { category: "eap-service", style: "line" },
  CenterIcon: { category: "eap-service", style: "line" },

  // ── 컬러 아이콘 (Color) — 다색 일러스트, 컬러 토큰을 적용하지 않음 ──
  TestresultSafeIcon: { category: "color", style: "color" },
  TestresultWarningIcon: { category: "color", style: "color" },
  TestresultDangerIcon: { category: "color", style: "color" },
  SirenIcon: { category: "color", style: "color" },

  // ── Geniet 브랜드 ─ Geniet 홈페이지에서 가져온 브랜드 전용 아이콘. NudgeEAP 공용과 디자인이 달라 prefix 로 분리.
  GenietAlarmIcon: { category: "state-reaction", style: "filled" },
  GenietArrowBackIcon: { category: "navigation", style: "line" },
  GenietArrowDownIcon: { category: "navigation", style: "line" },
  GenietArrowUpIcon: { category: "navigation", style: "line" },
  GenietArrowRightIcon: { category: "navigation", style: "line" },
  GenietArrowRightStepperIcon: { category: "navigation", style: "line" },
  GenietMenuIcon: { category: "navigation", style: "line" },
  GenietMypageIcon: { category: "navigation", style: "line" },
  GenietCopyIcon: { category: "action", style: "line" },
  GenietLoginIcon: { category: "action", style: "line" },
  GenietLogoutIcon: { category: "action", style: "line" },
  GenietRecordIcon: { category: "action", style: "filled" },
  GenietPlayIcon: { category: "media", style: "filled" },
  GenietCheckcircleIcon: { category: "state-reaction", style: "filled" },
  GenietConfettiIcon: { category: "state-reaction", style: "filled" },
  GenietCouponIcon: { category: "location", style: "line" },
  GenietCashreviewIcon: { category: "eap-service", style: "filled" },
  GenietGpointIcon: { category: "eap-service", style: "filled" },

  // ── Geniet bottomnavi / header (Figma 90:2 — 단일 그래픽 + color cascade) ──
  // on/off 별 그래픽이 동일해 단일 컴포넌트로 통합. active/inactive 는 사용처(BottomNav 등)
  // 의 color cascade(--nds-footer-nav-{active,inactive}-color)로 토글.
  GenietHomeIcon: { category: "navigation", style: "filled" },
  GenietBenefitIcon: { category: "eap-service", style: "filled" },
  GenietReviewIcon: { category: "eap-service", style: "filled" },
  GenietCommunityIcon: { category: "navigation", style: "line" },
  GenietSearchIcon: { category: "navigation", style: "line" },

  // ── Cashwalk for Business 어드민 GNB (Figma 9lJ9XCwVYFSoZGcmRuJtI4 — mono 24×24) ──
  // 어드민 사이드바/GNB 전용. active 별도 그래픽 없이 color cascade 로 토글.
  CashwalkBizGnbBannerIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbCashIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbCatalogIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbChannelIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbChatIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbEditIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbMemberIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbQuizIcon: { category: "navigation", style: "line" },
  CashwalkBizGnbSettingIcon: { category: "navigation", style: "line" },

  // ── Runmile (Figma 런마일 library 20:94 — base 24×24 + currentColor 정규화) ──
  // Active suffix = filled (icon/{name}/state=fill). Suffix 없음 = stroke (line).
  // Multicolor (-Color suffix) 는 디자인 가이드의 컬러 보존.
  RunmileAccountActiveIcon: { category: "navigation", style: "filled" },
  RunmileAccountIcon: { category: "navigation", style: "line" },
  RunmileAlramActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileAlramIcon: { category: "state-reaction", style: "line" },
  RunmileAlramOffIcon: { category: "state-reaction", style: "line" },
  RunmileArrowDownIcon: { category: "basic", style: "line" },
  RunmileArrowLeftIcon: { category: "basic", style: "line" },
  RunmileArrowRightIcon: { category: "basic", style: "line" },
  RunmileArrowUpIcon: { category: "basic", style: "line" },
  RunmileBackIcon: { category: "basic", style: "line" },
  RunmileBanIcon: { category: "action", style: "line" },
  RunmileBookmarkActiveIcon: { category: "action", style: "filled" },
  RunmileBookmarkIcon: { category: "action", style: "line" },
  RunmileBottomIcon: { category: "basic", style: "line" },
  RunmileCalendarActiveIcon: { category: "action", style: "filled" },
  RunmileCalendarIcon: { category: "action", style: "line" },
  RunmileCameraActiveIcon: { category: "action", style: "filled" },
  RunmileCameraIcon: { category: "action", style: "line" },
  RunmileCautionColorIcon: { category: "color", style: "color" },
  RunmileChallengeActiveIcon: { category: "navigation", style: "filled" },
  RunmileChallengeIcon: { category: "navigation", style: "line" },
  RunmileChatsActiveIcon: { category: "navigation", style: "filled" },
  RunmileChatsIcon: { category: "navigation", style: "line" },
  RunmileChattingActiveIcon: { category: "action", style: "filled" },
  RunmileChattingIcon: { category: "action", style: "line" },
  RunmileCheckboxActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileCheckboxIcon: { category: "state-reaction", style: "line" },
  RunmileCircleCheckColorIcon: { category: "color", style: "color" },
  RunmileCircleCheckIcon: { category: "state-reaction", style: "filled" },
  RunmileCircleWarningIcon: { category: "state-reaction", style: "filled" },
  RunmileCircleWarningStrokeIcon: { category: "state-reaction", style: "line" },
  RunmileCloseIcon: { category: "basic", style: "line" },
  RunmileCommunityActiveIcon: { category: "navigation", style: "filled" },
  RunmileCommunityIcon: { category: "navigation", style: "line" },
  RunmileConfettiColorIcon: { category: "color", style: "color" },
  RunmileCopyIcon: { category: "action", style: "line" },
  RunmileExportIcon: { category: "action", style: "line" },
  RunmileEyeIcon: { category: "action", style: "line" },
  RunmileEyeOffIcon: { category: "state-reaction", style: "line" },
  RunmileEyeOnIcon: { category: "state-reaction", style: "line" },
  RunmileFilterIcon: { category: "action", style: "line" },
  RunmileFireColorIcon: { category: "color", style: "color" },
  RunmileHamburgerIcon: { category: "basic", style: "line" },
  RunmileHomeActiveIcon: { category: "navigation", style: "filled" },
  RunmileHomeClassicActiveIcon: { category: "action", style: "filled" },
  RunmileHomeClassicIcon: { category: "action", style: "line" },
  RunmileHomeIcon: { category: "navigation", style: "line" },
  RunmileImageErrorIcon: { category: "action", style: "line" },
  RunmileImageIcon: { category: "action", style: "line" },
  RunmileInformationActiveIcon: { category: "action", style: "filled" },
  RunmileInformationIcon: { category: "action", style: "line" },
  RunmileKebabHorizontalIcon: { category: "basic", style: "filled" },
  RunmileKebabVerticalIcon: { category: "basic", style: "filled" },
  RunmileLikeActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileLikeIcon: { category: "state-reaction", style: "line" },
  RunmileLoginIcon: { category: "action", style: "line" },
  RunmileMailIcon: { category: "action", style: "line" },
  RunmileMinusIcon: { category: "basic", style: "line" },
  RunmileMypageActiveIcon: { category: "navigation", style: "filled" },
  RunmileMypageIcon: { category: "navigation", style: "line" },
  RunmileNullIcon: { category: "basic", style: "line" },
  RunmileOutIcon: { category: "action", style: "line" },
  RunmilePenActiveIcon: { category: "action", style: "filled" },
  RunmilePenIcon: { category: "action", style: "line" },
  RunmilePeopleActiveIcon: { category: "action", style: "filled" },
  RunmilePeopleIcon: { category: "action", style: "line" },
  RunmilePlusIcon: { category: "basic", style: "line" },
  RunmileQuestionmarkActiveIcon: { category: "action", style: "filled" },
  RunmileQuestionmarkIcon: { category: "action", style: "line" },
  RunmileRadioActiveIcon: { category: "state-reaction", style: "filled" },
  RunmileRadioIcon: { category: "state-reaction", style: "line" },
  RunmileRefreshIcon: { category: "basic", style: "line" },
  RunmileReplyIcon: { category: "action", style: "line" },
  RunmileSearchClearIcon: { category: "state-reaction", style: "filled" },
  RunmileSearchIcon: { category: "basic", style: "line" },
  RunmileSettingActiveIcon: { category: "action", style: "filled" },
  RunmileSettingIcon: { category: "action", style: "line" },
  RunmileShareIcon: { category: "action", style: "line" },
  RunmileShoeActiveIcon: { category: "action", style: "filled" },
  RunmileShoeIcon: { category: "action", style: "line" },
  RunmileThumbIcon: { category: "action", style: "line" },
  RunmileTopIcon: { category: "basic", style: "line" },
  RunmileTrashActiveIcon: { category: "action", style: "filled" },
  RunmileTrashIcon: { category: "action", style: "line" },
  RunmileUserActiveIcon: { category: "action", style: "filled" },
  RunmileUserIcon: { category: "action", style: "line" },
};

/** 카테고리별로 아이콘 이름을 묶은 인덱스. find_icon 응답 보강용. */
export function getIconCategoryIndex(): Record<IconCategory, string[]> {
  const index: Record<IconCategory, string[]> = {
    basic: [],
    navigation: [],
    action: [],
    media: [],
    "state-reaction": [],
    location: [],
    "eap-service": [],
    color: [],
  };
  for (const [name, meta] of Object.entries(ICON_METADATA)) {
    index[meta.category].push(name);
  }
  for (const list of Object.values(index)) list.sort();
  return index;
}

export const PATTERN_GUIDES: Record<string, PatternGuide> = {
  "action-row": {
    name: "action-row",
    summary:
      "헤더 우측 액션 row · 필터 바 · 도구 모음처럼 *서로 다른 컴포넌트가 한 줄로 나란히 놓이는* 영역에서 높이를 어떻게 맞추는가. 빠지면 1-2px 어긋남이 row 전체를 시각적으로 불편하게 만든다. `sizing.button` / `sizing.tabs` / `sizing.input` 토큰의 단일 source of truth.",
    rules: [
      "한 row 안의 모든 컴포넌트는 *동일한 height bucket* (44 / 48 / 52 중 하나) 으로 통일. 4px 차이도 정렬 깨짐.",
      "**기본 bucket = 44px** — Button.md(44) / Tabs.chip(pc 44) / Input.field(44) 가 자연 매치. 헤더 우측 액션 row · 필터 바 · 카드 footer 의 표준.",
      "**큰 bucket = 48px** — Button.lg(48) / Button.field(48) / Input.default(48) / AppBar 아래 큰 액션 row. primary CTA 가 포함된 row 에 사용.",
      "**작은 bucket = 38-42px** — Button.sm(42) / Button.xs(38) / Tabs.chip(mobile 36 — 38 에 가깝게 padding 조정). 정보 밀도 높은 어드민·표 상단 도구 모음에 사용.",
      "DS 컴포넌트의 height 는 `sizing.button.{size}` / `sizing.tabs.{type}.{viewport}` / `sizing.input.{kind}` 토큰이 단일 진실. **인라인 height 로 덮어쓰지 말 것** — 자연 높이가 다른 컴포넌트를 같은 px 로 강제하면 line-height 가 어긋난다.",
      "DateRangePicker / Toggle / Select 같이 sizing.* 토큰이 없는 컴포넌트는 size prop 으로 매치하거나, 같은 row 에서 padding 만 조정해 외형을 맞춘다. **임의 height: 40px 같은 raw px 금지** — 토큰에서 가장 가까운 bucket 으로 라운드.",
      "row 안 컴포넌트 간 gap 은 8 / 12 / 16 중 하나. var(--semantic-gap-component-tight) / var(--semantic-gap-component-default) / var(--semantic-gap-component-loose).",
      "row baseline 정렬: align-items: center (vertical center) 가 기본. text label 이 있는 컴포넌트와 icon-only 컴포넌트를 섞으면 baseline 정렬은 어긋남 — center 만 사용.",
    ],
    avoid: [
      "한 row 안에 Button(44) + Tabs(56) + Toggle(38) 처럼 다른 bucket 의 컴포넌트를 섞기",
      "`style={{ height: '40px' }}` 같은 raw px 로 컴포넌트 자연 높이를 덮어쓰기 — line-height 어긋남",
      "DateRangePicker 의 input 자연 높이가 40px 이라고 다른 컴포넌트도 height: 40 으로 강제하기 (toggle/tabs 가 깨짐)",
      "primary CTA 가 들어있는 row 에 작은 sm/xs Button 을 섞기 — 시각 위계 흐려짐",
      "row gap 을 14 / 18 / 20 같은 4pt grid 위반 값으로 설정",
      "row baseline 정렬을 align-items: baseline 으로 두기 — text + icon 혼합 row 에서 어긋남",
    ],
    metrics: {
      preferredBuckets: "44 / 48 / 52 px",
      defaultBucket: "44px (Button.md · Tabs.chip pc · Input.field)",
      maxHeightMixPerRow: 1,
      gapBetweenItems: "8 / 12 / 16 px (--semantic-gap-component-*)",
      verticalAlign: "center",
    },
  },
  "cta-group": {
    name: "cta-group",
    summary: "여러 CTA가 함께 있는 영역의 위계 / 아이콘 / 라벨 명료성 정책.",
    rules: [
      "Primary solid는 화면 또는 주요 섹션의 대표 액션 1개에만 사용.",
      "ArrowNext/ChevronRight 아이콘은 대표 전진 CTA 1개에만 사용하고, 반복 CTA에서는 제거.",
      "동일 위계의 CTA가 여러 개면 아이콘 없이 텍스트와 버튼 variant로만 구분.",
      "카드 리스트에서는 각 카드마다 버튼을 두기보다 Card.Root clickable 또는 텍스트 링크 패턴을 우선 검토.",

      "버튼 라벨만 보고 다음 화면/행동을 예측할 수 있어야 한다. 라벨에 결과 동사(보기/신청/저장/삭제)를 포함하고, 막연한 '확인'/'시작'/'지금'을 단독으로 쓰지 않는다.",
      "버튼 위 보조 설명(서브카피)이 버튼 라벨과 의미상 중복되지 않도록 한다. 둘 다 같은 가치 제안을 반복하면 버튼 역할이 흐려진다.",
      "다이얼로그/모달의 왼쪽(보조) 버튼 라벨은 항상 **닫기**. '취소'는 사용자가 진행 중이던 작업이 취소된다고 오해할 수 있어 사용 금지. 자세한 라이팅 룰은 get_guide({ topic: 'ux-writing' }) 참고.",
      "거절 가능한 비파괴 옵션이 항상 1개 이상 있어야 한다. CTA가 '확인' 하나뿐인 다이얼로그는 다크패턴 — get_guide({ topic: 'pattern:dark-patterns' }) 참고.",
      "외부 링크는 화살표보다 Link/ExternalLink 성격의 아이콘을 검토.",
    ],
    avoid: [
      "모든 '자세히 보기' 버튼에 화살표 반복",
      "보조/outlined CTA에 습관적으로 ArrowNext 부착",
      "'시작', '확인', '지금' 같은 결과 예측 불가능한 단독 라벨",
      "버튼 위 카피와 버튼 라벨에 같은 문장을 반복 (예: '지금 시작해 보세요' → [지금 시작])",
      "다이얼로그 보조 버튼에 '취소' 사용",
      "거절·닫기 옵션 없이 '확인' 하나만 있는 다이얼로그",
      "한 뷰포트에 primary solid CTA 2개 이상",
    ],
    metrics: {
      maxArrowIconButtonPerViewport: 1,
      dialogLeftButtonLabel: "닫기",
      minDeclineOptionsPerDialog: 1,
    },
  },
  "dark-patterns": {
    name: "dark-patterns",
    summary:
      "사용성·자율성을 해치는 다크패턴 5건. 어느 것 하나라도 적용되면 사용자 신뢰가 크게 떨어지고 재방문·전환이 무너진다. 시각·스타일 차원은 별도 — get_guide({ topic: 'pattern:visual-antipatterns' }) 참고.",
    rules: [
      "**진입 직후 인터럽트 금지** — 화면 진입 즉시 BottomSheet/Modal/풀스크린 광고/알림 동의 자동 노출 금지. 사용자가 의도한 화면을 먼저 보여주고, 안내·동의는 사용자가 가치를 체감한 시점이나 자연스러운 액션 직후로 미룬다.",
      "**뒤로가기 직후 인터럽트 금지** — 사용자가 이전 화면으로 돌아가려는 순간에 BottomSheet/Modal 로 알림 동의·만류·재구매 유도를 띄우지 않는다. 이탈을 막기 위한 의도된 인터럽트는 자율성 침해.",
      "**거절 불가 CTA 금지** — 다이얼로그/풀스크린 카드의 버튼이 '확인' 하나뿐이거나, 가능한 선택지가 모두 같은 결과로 이어지는 구조 금지. 비파괴 옵션(닫기/나중에/건너뛰기)을 항상 1개 이상 노출.",
      "**플로우 중간 예상 못한 전면 모달/광고 금지** — 사용자가 메뉴/액션(예: 아이템 받기)을 눌렀을 때, 그 결과 대신 다른 콘텐츠(광고/프로모션/추가 동의)가 먼저 끼어들면 안 된다. 광고가 필요하다면 결과 화면 뒤 또는 별도 전용 위치에.",
      "**CTA 라벨 모호성 금지** — 버튼만 보고 다음 행동/화면을 예측할 수 있어야 한다. 위 카피의 가치 제안을 그대로 반복한 버튼('지금 시작', '확인')은 사용자가 결과를 예측 못해 클릭을 망설이게 만든다. 버튼 위에 과장된 보조 설명을 함께 노출해 버튼 역할을 흐리는 것도 금지. 라이팅 룰은 `get_guide({ topic: 'ux-writing' })` 의 CTA microcopy 참고.",
    ],
    avoid: [
      "온보딩/홈 진입 직후 자동 BottomSheet (특히 알림 동의 / 마케팅 동의)",
      "뒤로가기 누르면 '잠깐만요!' BottomSheet 로 만류",
      "혜택/공지 다이얼로그의 버튼이 '확인' 하나만 있는 구조",
      "메뉴 클릭 → 의도한 화면 대신 전면 광고 → (광고 닫기 후) 의도한 화면",
      "버튼 위에 'OO를 받을 수 있는 특별한 기회' + 버튼 라벨 '받기' 처럼 보조 설명이 라벨을 흐리는 구성",
      "다이얼로그 보조 버튼 라벨을 '취소'로 두기 → 사용자가 작업 자체가 취소된다고 오해",
    ],
    metrics: {
      maxAutoSheetsOnEntry: 0,
      maxInterruptsOnBackPress: 0,
      minDeclineOptionsPerDialog: 1,
      maxInterstitialsMidFlow: 0,
      ctaLabelClarity: "required",
      maxPrimarySolidPerScreen: 1,
    },
  },
  "multi-screen": {
    name: "multi-screen",
    summary:
      "한 HTML 파일에 여러 화면을 '화면처럼' 보여주는 디바이스 프레임 + 탭 스위처 패턴. 회고: 스크린 높이를 내용에 맡겨(min-height 없음) 화면마다 제각각이고, 각 스크린이 자체 헤더/푸터도 없어 디바이스가 아니라 하나의 긴 페이지로 보였다. → .mockup-canvas 안에 .mockup-screen[data-device] 프레임을 나열하고, 각 스크린은 자체 헤더(+필요시 푸터) + device 최소높이로 자기완결시킨다. 화면이 2개 이상이면 런타임이 상단에 전환 탭을 자동 주입(기본 '탭' = 한 번에 한 화면, '전체' = 옆으로 나란히). 프레임 CSS/JS 는 build_singlefile_html 이 자동 inline — 클래스만 쓰면 된다(별도 <style>/스크립트 불필요).",
    rules: [
      "여러 화면 = `.mockup-canvas` > `.mockup-screen` N개. 프레임마다 `data-device='mobile|webview|web|tablet'` 로 디바이스 폭+최소높이를 정한다(mobile 390×844 / webview 390×720 / web 1440×900 / tablet 834×1112).",
      "각 `.mockup-screen` 은 자기완결: 자체 `<nds-brand-header surface=…>`(+필요시 `<nds-brand-footer>`) + device 최소높이. 내용이 짧아도 device 높이를 유지해 '화면'처럼 보인다 — 높이를 내용에 맡기지 말 것.",
      "화면 ≥2 → 런타임이 상단 전환 탭을 자동 생성(탭 라벨 = 각 스크린 `data-label`, 없으면 '화면 N'). 기본 모드 '탭'(한 번에 한 화면 — 미리보기 친화), 스위처의 '전체' 또는 `<div class=\"mockup-canvas\" data-mode=\"grid\">` 로 옆으로 나란히 비교.",
      "브랜드 헤더는 프레임 안에서 `<nds-brand-header brand surface='web|mobile|webview'>` — surface 로 디바이스별 헤더(PC GNB / 모바일 컴팩트 / 웹뷰 뒤로가기)가 자동 분기. base `<nds-header>` 손수 조립 금지.",
      "프레임/스위처(.mockup-canvas · .mockup-screen)는 목업 전용으로 빌드가 자동 inline — `<style>` 에 `.screen{width:…}` 나 미디어쿼리 토글을 직접 쓰지 말 것(클래스만 사용).",
      "단일 화면 목업이면 `.mockup-screen` 하나(또는 캔버스 없이 `<main>` 하나)로 충분 — 탭은 화면이 2개 이상일 때만 자동 생성.",
    ],
    avoid: [
      "스크린 높이를 내용에 맡겨(min-height 없이) 화면마다 높이가 제각각",
      "각 스크린에 자체 헤더/푸터 없이 하나의 긴 페이지로 쌓기",
      "@media 로 모바일/웹 헤더를 display 토글 (동시 비교 불가)",
      "base <nds-header> + nds-header-logo/menu 손수 조립으로 브랜드 GNB 흉내",
      "디바이스 프레임 너비/높이를 <style> 에 손으로 재정의 (.mockup-screen[data-device] 프리셋 사용)",
    ],
    examples: [
      {
        verdict: "good",
        source:
          '<div class="mockup-canvas">\n  <section class="mockup-screen" data-device="mobile" data-label="홈">\n    <nds-brand-header brand="runmile" surface="mobile"></nds-brand-header>\n    <main style="flex:1; padding: var(--semantic-inset-screen);">…</main>\n  </section>\n  <section class="mockup-screen" data-device="webview" data-label="상세">\n    <nds-brand-header brand="runmile" surface="webview"></nds-brand-header>\n    <main style="flex:1; padding: var(--semantic-inset-screen);">…</main>\n  </section>\n</div>\n<!-- 화면 2개 → 상단 전환 탭 자동(홈/상세). 기본 탭, \'전체\'로 나란히. -->',
        caption:
          "각 스크린이 자체 헤더 + device 최소높이로 자기완결. 화면 2개라 탭 스위처 자동 — 기본은 한 번에 한 화면(미리보기 친화), '전체'로 나란히 비교.",
      },
      {
        verdict: "bad",
        source:
          '<main style="max-width:720px;margin:0 auto;">…홈…</main>\n<main style="max-width:720px;margin:0 auto;">…상세…</main>\n<style>@media(max-width:600px){.web-header{display:none}}</style>',
        caption:
          "max-width 컨테이너로 세로로 쌓고(높이는 내용에 맡김) 헤더는 미디어쿼리 토글 — 디바이스 프레임도 자기완결도 없음.",
      },
    ],
    metrics: {
      canvasClass: "mockup-canvas",
      screenClass: "mockup-screen",
      deviceFrames: "mobile 390×844 / webview 390×720 / web 1440×900 / tablet 834×1112",
      defaultMode: "tabs (화면 ≥2 자동) · data-mode='grid' 로 나란히",
    },
  },
  "icon-color": {
    name: "icon-color",
    summary:
      "아이콘 컬러 매핑 기준. Figma Iconography(379:490)의 Color Usage 표와 `--semantic-icon-*` 시맨틱 토큰을 단일 진실 소스로 사용. 사이즈/스타일/터치 영역 기준은 get_guide({ topic: 'pattern:iconography' })를 함께 확인.",
    rules: [
      "아이콘 컴포넌트의 기본값은 currentColor다. 단독 배치 시 부모 color가 명시되어 있지 않으면 본문색/검정으로 보여 어색할 수 있다.",
      "Button, IconButton, Chip, Select 등 DS 컴포넌트 슬롯 안의 아이콘은 컴포넌트가 정한 텍스트 컬러를 상속하게 두는 것이 기본이다.",
      "안내/상태/빈 상태/카드 장식처럼 단독으로 배치한 아이콘은 `color` prop 또는 부모 `style.color`를 `var(--semantic-icon-*)` 토큰으로 명시한다.",
      "용도별 토큰 매핑(Figma Color Usage 표):\n  · 본문 옆 강조 → `--semantic-icon-strong-default` (Neutral/800 · #383838)\n  · 보조 정보·메타 → `--semantic-icon-normal-default` (Neutral/600 · #666666)\n  · 비활성 → `--semantic-icon-disabled-default` (Neutral/300 · #C7C7C7)\n  · 어두운 배경 위 → `--semantic-icon-inverse-default` (White · #FFFFFF)\n  · 브랜드 강조 → `--semantic-icon-brand-default` (Bright Blue/500 · #2B96ED)",
      "상태 의미가 있을 때만 status 토큰을 사용한다:\n  · 성공 → `--semantic-icon-status-success` (Teal/500 · #13BFA2)\n  · 오류 → `--semantic-icon-status-error` (Orange Red/500 · #F13F00)\n  · 주의 → `--semantic-icon-status-caution` (Golden Yellow/500 · #FFC303)",
      "TestresultSafe/Warning/Danger, Siren 같은 '컬러 아이콘'(다색 일러스트성)은 시맨틱 토큰을 덧씌우지 않는다. 그대로 사용한다.",
      "아이콘만 별도 강한 색으로 튀게 하지 않는다. 강조가 필요하면 텍스트, 배경, 아이콘 중 1-2개만 함께 조합한다.",
    ],
    avoid: [
      "<InfoIcon />처럼 단독 아이콘을 색 지정 없이 배치",
      "안내 박스 안에서 아이콘만 브랜드 primary로 과하게 강조",
      "아이콘에 hex/rgb 직접 지정 — `--semantic-icon-*` 토큰만 사용",
      "구식 `--semantic-icon-*` 토큰 사용 — `--semantic-icon-*`로 대체",
      "한 섹션 안에서 아이콘마다 다른 semantic color를 섞는 구성",
      "컬러(다색) 아이콘에 color prop을 강제로 덮어쓰는 사용",
    ],
    metrics: {
      standaloneIconColor: "required",
      preferredColor: "var(--semantic-icon-*) — strong/normal/disabled/inverse/brand/status",
      maxSemanticIconColorsPerSection: 1,
    },
  },
  iconography: {
    name: "iconography",
    summary:
      "Figma Iconography(379:490) 라이브러리 기준 아이콘 사이즈·터치 영역·Line/Filled 스타일·카테고리 전반 가이드. 컬러 토큰은 get_guide({ topic: 'pattern:icon-color' })와 함께 본다.",
    rules: [
      "**아이콘 선택 필수 우선순위**: 브랜드 전용 아이콘(Geniet*/Trost* 등) → NudgeEAP 기본 브랜드 아이콘 → 목업용 기본 아이콘 패키지(MockupLinear*/MockupBold*) → 자체 생성 SVG. 앞 단계에서 의미가 맞는 아이콘을 찾을 수 있으면 뒤 단계로 내려가지 않는다.",
      "목업용 기본 아이콘은 Figma 5000+ Icon Set 의 linear/bold 계열을 `MockupLinear*Icon`, `MockupBold*Icon` 으로 등록한 fallback 패키지다. 기본 액션/내비게이션은 MockupLinear, 활성/강조/작은 크기에는 MockupBold 를 우선 검토한다.",
      "기본 사이즈는 24px. 인터페이스 용도에 맞춰 12 / 16 / 20 / 24 / 32 / 48 px의 6단계만 사용한다. 최소 사이즈는 12px.",
      "15px 이하의 작은 사이즈에서는 시각 복잡도를 낮추기 위해 Fill(Filled) 스타일을 우선 사용한다. (Line은 얇은 선이 손상되어 보임)",
      "기본 액션·내비게이션 아이콘은 Line(Stroke) 스타일을 우선한다. 현재 활성 상태(GNB 활성 탭, 좋아요 ON 등)와 강조용 단일 아이콘은 Filled를 사용한다.",
      "한 화면에서 Line 과 Filled 를 같은 의미 그룹 안에서 섞지 않는다. 같은 GNB · 같은 카드 리스트 · 같은 툴바 안에서는 한쪽으로 통일한다.",
      "단독 아이콘 버튼(IconButton 포함)의 터치 영역은 최소 40px. 사이즈별 권장: 20px 아이콘 → 40px touch, 24px 아이콘 → 44px touch. 40px 미만은 접근성 위반.",
      "아이콘 자체에 padding 을 직접 주지 말고 IconButton 의 size prop 또는 부모 컨테이너 padding/min-width 로 터치 영역을 확보한다.",
      "네이밍 컨벤션: 기본 Line = `XIcon`, Filled 짝 = `XActiveIcon` 또는 `XOnIcon` (예: HomeIcon ↔ HomeActiveIcon, SleepmodeOffIcon ↔ SleepmodeOnIcon). 짝 정보는 ICON_METADATA[name].pair 로 확인.",
      "카테고리 8종(basic / navigation / action / media / state-reaction / location / eap-service / color)은 의미 분류일 뿐 강제 import 경로 분리가 아니다. find_icon 결과의 카테고리는 유사 의미 후보를 찾는 힌트로 사용.",
      "컬러(다색) 카테고리 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger, Siren) 전용이다. 일반 UI 강조에 색 아이콘을 끼워 넣지 않는다.",
      "**Mono vs Multicolor 트랙 분리** (SEED 스타일) — `@nudge-design/icons` 는 두 트랙으로 나뉜다. Mono(1925개, `currentColor` 만 사용해서 `color` prop 으로 자유 변경) 와 Multicolor(17개, 브랜드 시그니처 — Trost mental 일러스트·Geniet 브랜드 아이콘·CashwalkBiz GNB chat/member 등 — 내부 accent 색 잠금). UI chrome(navigation/action/state)은 mono, 서비스 시그니처/주요 진입점은 multicolor.",
      "**Import 경로 선택**: 기본은 root flat `import { CalendarIcon } from '@nudge-design/icons'` (백워드 호환). 자동완성 범위를 좁히고 카테고리를 분명히 하려면 subpath `import { CalendarIcon } from '@nudge-design/icons/mono'` 또는 `import { GenietPlayIcon } from '@nudge-design/icons/multicolor'` 사용. namespace 형 `import { MonoIcons, MultiIcons } from '@nudge-design/icons'` 도 가능.",
      "**Multicolor 컬러 override 금지** — multicolor 아이콘의 `color` prop 은 base(`currentColor` 사용 영역)만 바꾼다. 내부 accent(`#FFF` 등)는 SVG 에 고정되어 있으니 SVG 를 직접 편집하지 말 것.",
      "필요한 아이콘이 브랜드/NudgeEAP/Mockup 패키지 어디에도 없을 때만 인라인 `<svg>` 또는 신규 SVG 추가를 검토한다. 신규 추가 시 mono 아이콘은 `packages/icons/svg/mono/`, multicolor 아이콘은 `packages/icons/svg/multicolor/` 에 kebab-case 로 저장한 뒤 `pnpm --filter @nudge-design/icons build` 로 컴포넌트를 재생성한다. viewBox 는 0 0 24 24, mono 의 stroke/fill 은 `currentColor` 로 유지.",
    ],
    avoid: [
      "브랜드 전용 아이콘이 있는데 NudgeEAP/Mockup 아이콘으로 대체",
      "NudgeEAP 기본 아이콘이 있는데 Mockup 아이콘으로 대체",
      "MockupLinear*/MockupBold* 검색 없이 자체 생성 SVG 사용",
      "12 / 16 / 20 / 24 / 32 / 48 외의 임의 사이즈 (예: 18px, 22px) 사용",
      "12px 미만 아이콘",
      "15px 이하에서 가는 Line 스타일을 그대로 사용 — Filled 로 교체",
      "동일 화면 / 동일 그룹에서 Line + Filled 스타일 혼용",
      "단독 IconButton 의 터치 영역을 40px 미만으로 두기",
      "아이콘 컴포넌트를 인라인 `<svg>` 로 직접 작성하기 — `@nudge-design/icons` 사용",
      "컬러(다색) 아이콘에 color prop 강제 적용 — 다색 표현이 어긋남",
      "multicolor 아이콘 SVG 내부 accent 색을 임의로 편집하기 — 스타일이 잠겨있음. 브랜드 변경이 필요하면 디자인팀과 협의해 새 SVG 등록.",
      "mono 아이콘을 `packages/icons/svg/multicolor/` 에, multicolor 아이콘을 `packages/icons/svg/mono/` 에 잘못 배치하기 — generate.js 가 카테고리별 export 를 만들기 때문에 위치가 곧 카테고리.",
    ],
    metrics: {
      sizeScale: "12 / 16 / 20 / 24 / 32 / 48 px",
      defaultSize: "24px",
      minSize: "12px",
      fillThreshold: "≤15px 권장 스타일 = Filled",
      minTouchArea: "40px",
      touchAreaIcon20: "40px",
      touchAreaIcon24: "44px",
      selectionPriority:
        "brand-specific icon → NudgeEAP default icon → mockup default icon package(MockupLinear*/MockupBold*) → generated custom SVG",
      figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=379-490",
      categories: "basic, navigation, action, media, state-reaction, location, eap-service, color",
      tracks: "mono (1925, currentColor) | multicolor (17, style-locked brand signature)",
      importPaths:
        "@nudge-design/icons (flat, backward-compat) | @nudge-design/icons/mono | @nudge-design/icons/multicolor | @nudge-design/icons (MonoIcons / MultiIcons namespace)",
    },
  },
  "visual-antipatterns": (() => {
    const ruleGroups = [
      {
        heading: "색·강조",
        items: [
          "**Tone-on-Tone Filled 금지** — 연한 primary/blue 배경 위에 같은 계열의 연한 filled tag/badge/box 를 반복하지 않는다. 같은 톤 위 같은 톤은 위계를 만들지 못하고 영역만 흐려진다.",
          "**Primary 컬러 역할 제한** — Primary 는 CTA · interactive · 핵심 highlight 중 한 가지 역할로만. 배경/CTA/태그/카드/포커스/hover 에 동시에 쓰면 무엇을 클릭해야 할지 신호가 사라진다.",
          "**로고 컬러 ≠ UI 액센트** — 브랜드 로고의 gradient/accent 색은 로고 표현 전용. 카드 배경, 배지, 버튼 컬러로 재사용하지 않는다.",
          "**Primary tint 반복 금지** — 한 섹션에서 primary tint 가 배경 · 라벨 · 아이콘 · 카드 surface 로 3회 이상 등장하면 neutral surface + 텍스트 위계로 낮춘다.",
          "**그라데이션 배경 금지** — linear / radial / conic gradient 배경 모두 사용 금지. 단색 토큰만 사용.",
          "**Section 구분, 색상 단독 금지** — 영역 구분은 1차 spacing(--semantic-gap-loose/wide) → 2차 Divider/Border → 마지막에 surface tone 순서로. 색만으로 나누면 색맹·저시력 사용자가 구조를 잃는다.",
        ],
      },
      {
        heading: "표면 (Card / Shadow)",
        items: [
          "**Card Everything 금지** — 모든 정보 단위를 카드로 감싸지 않는다. 카드는 '독립된 정보 단위' 일 때만. 단순 group/section 은 spacing + h3 + Divider 로 위계를 만든다. 한 화면에 카드가 5개를 넘으면 80% 이상 안티패턴.",
          "**카드 안 카드 중첩 금지** — 카드 내부 영역 강조는 surface.section tone 한 단계 또는 inline Chip/Badge 로. nested Card 는 위계 표현 도구가 아니다.",
          "**장식용 그림자 금지** — 떠 있지 않아야 할 요소(인라인 리스트 · 일반 카드 · 기본 입력)에 elevation/shadow 적용 금지. Shadow 는 floating UI(Modal · Popup · Dropdown · BottomSheet) 와 'hover 시 floating 표현' 에만.",
          "**Shadow-heavy 레이아웃 금지** — 한 화면에 그림자 있는 요소가 3개를 넘으면 floating 의미가 사라진다. Border 또는 surface tone 으로 대체.",
        ],
      },
      {
        heading: "타이포그래피 위계",
        items: [
          "**Bold 남발 금지** — Bold 텍스트는 화면당 1-2 곳에만. 5곳 이상이면 위계가 사라지고 모든 글자가 평등해진다. 본문은 Regular/Medium.",
          "**최상위 헤딩 중복 금지** — h1/h2 같은 큰 제목은 화면당 1개. 보조 섹션은 h3 이하로 내려야 페이지 안에서 '어디가 본론' 인지 보인다.",
          "**위계 불명 텍스트 금지** — 인접한 두 영역이 같은 fontSize × fontWeight 이면 위계가 무너진다. 헤딩과 본문의 시각적 차이를 항상 만든다.",
          "**폰트 웨이트 3개 이상 혼용 금지** — 한 화면에 2-3개 웨이트만. Display(Bold) · Body(Medium/Regular) · Caption(Regular) 정도가 표준.",
        ],
      },
      {
        heading: "아이콘",
        items: [
          "**아이콘 스타일 혼용 금지** — 같은 화면/그룹 안에 Line · Filled · Colorful 아이콘을 섞지 않는다. `@nudge-design/icons` 단일 셋만, 같은 그룹은 한 스타일로 통일.",
          "**장식용 헤딩 아이콘 금지** — 서브타이틀(h3/h4) · Form Label · 본문 텍스트 앞 장식 아이콘 금지. 일부 헤딩에만 아이콘이 붙으면 위계가 깨진다. 한 화면 헤딩 앞 아이콘 5개 이상은 자동 위반.",
          "**Color icon 본문 남용 금지** — multi-color/colorful 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger 등) 와 진입점 1-2개에만. 일반 UI 강조에는 monochrome currentColor 만 사용.",
        ],
      },
      {
        heading: "가짜 대시보드 톤",
        items: [
          "**Fake Dashboard 금지** — 의미 없는 KPI 카드 / 메트릭 그리드 / 장식용 chart / 큰 일러스트 + gradient hero. EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선. Generic SaaS dashboard 톤 회피.",
          "**Pastel 카드 그리드 금지** — 카드마다 다른 pastel/tinted background 를 깔아 영역을 색으로 구분하지 않는다. 모든 bg 는 `--semantic-bg-*` 토큰 안에서 한정.",
        ],
      },
      {
        heading: "원칙 — 색보다 구조 먼저",
        items: [
          "**강조는 색보다 구조 먼저** — 강조가 필요하면 색상보다 정보 우선순위 · spacing · typography weight · CTA 위치를 먼저 조정한다. 색은 마지막 수단.",
        ],
      },
    ];
    const avoidGroups = [
      {
        heading: "색·강조",
        items: [
          "연한 블루 페이지 배경 + 연한 블루 Chip + 연한 블루 안내 박스 조합",
          "primary blue 를 배경 · 버튼 · 태그 · hover · focus · 카드 테두리 모두에 사용",
          "로고 gradient/accent 를 카드 배경이나 배지 색으로 재사용",
          "새 영역마다 같은 색 계열 배경을 깔아 모든 섹션이 강조처럼 보이는 구성",
          "linear/radial/conic gradient 배경",
          "영역 구분을 spacing 없이 색상만으로 처리",
        ],
      },
      {
        heading: "표면 (Card / Shadow)",
        items: [
          "정보 단위가 아닌 단순 group/section 도 모두 카드로 감싸기",
          "카드 안에 또 카드를 만들어 내부 강조 시도",
          "일반 카드 · 인라인 리스트 · 기본 입력에 shadow 적용",
          "한 화면에 floating panel(Modal/Drawer/Popup/Toast) 2개 이상 동시 노출",
        ],
      },
      {
        heading: "타이포그래피 위계",
        items: [
          "한 화면에 Bold 텍스트 5곳 이상",
          "한 화면에 h1/h2 두 개 이상",
          "헤딩과 본문이 같은 fontSize × fontWeight 로 위계 모호",
          "한 화면에 폰트 웨이트 3개 이상 혼용",
        ],
      },
      {
        heading: "아이콘",
        items: [
          "Line + Filled + Colorful 아이콘을 한 화면/그룹에 혼용",
          "서브타이틀/Form Label/본문 앞 장식 아이콘 (일부에만 부착 → 위계 붕괴)",
          "multi-color 아이콘을 일반 UI 강조용으로 사용",
        ],
      },
      {
        heading: "가짜 대시보드 톤",
        items: [
          "사용자 의사결정에 안 쓰이는 장식용 KPI 카드/메트릭 그리드",
          "데이터 인사이트 없이 장식 목적의 chart/graph",
          "큰 일러스트 + 큰 카피 + gradient 배경 hero section",
          "카드마다 다른 pastel background 로 영역을 색 구분",
        ],
      },
    ];
    return {
      name: "visual-antipatterns",
      summary:
        "1차 목업에서 퀄리티를 떨어뜨리는 대표 시각 안티패턴. 색·표면·타이포·아이콘·대시보드 톤 다섯 영역으로 묶었다. 플로우/사용성 차원은 별도 — get_guide({ topic: 'pattern:dark-patterns' }) 참고.",
      rules: flattenGroups(ruleGroups),
      avoid: flattenGroups(avoidGroups),
      ruleGroups,
      avoidGroups,
      metrics: {
        // 색·강조
        maxPrimaryRolesPerScreen: 2,
        maxPrimaryTintSurfacesPerSection: 1,
        logoColorAsUiAccent: "forbidden",
        toneOnToneFilled: "forbidden",
        gradientBackground: "forbidden",
        sectionColorOnly: "forbidden",
        // 표면
        maxCardsPerScreen: 5,
        nestedCard: "forbidden",
        decorativeShadow: "forbidden",
        maxShadowedElementsPerScreen: 3,
        maxFloatingPanelsConcurrent: 1,
        // 타이포
        maxBoldOccurrencesPerScreen: 4,
        maxTopLevelHeadingsPerScreen: 1,
        maxFontWeightsPerScreen: 3,
        // 아이콘
        mixedIconStyles: "forbidden",
        maxDecorativeIconsBeforeHeading: 0,
        // 대시보드
        decorativeKpiGrid: "forbidden",
        decorativeChart: "forbidden",
        decorativeHero: "forbidden",
      },
    };
  })(),
  "visual-reference": {
    name: "visual-reference",
    summary:
      "목업 생성 전에 정답/오답 시각 레퍼런스를 수집하고, 1줄 캡션으로 톤 판단 기준을 고정하는 패턴.",
    rules: [
      "목업 작성 전에는 프롬프트에 이미지, 스크린샷, Figma 링크, figmaNodeUrl 이 이미 있어도 항상 사용자에게 시각 레퍼런스 확인 질문을 한다.",
      "단, 같은 목업 작업에서 이미 질문했고 사용자가 답했거나, references.md 의 첫 줄 `task:` 슬러그가 현재 task 와 일치하면 다시 묻지 말고 읽어서 적용한다. 이전 task 의 stale references.md (예: cashwalk-biz-form 작업물이 남은 상태에서 geniet-diary 시작) 는 없는 것으로 간주.",
      "references.md 첫 줄은 `task: <brand>-<screen-slug>` 형식 필수 (예: `task: geniet-diary-hub`). 이게 staleness 판정 기준.",
      "사용자 응답으로 기존 첨부/링크를 기준으로 진행해도 되는지, 추가 정답/오답 레퍼런스가 있는지 확인한다.",
      "권장 세트는 정답 1-2장 + 오답 1-2장. 각 레퍼런스는 '왜 맞는지/틀린지' 1줄 캡션을 붙인다.",
      "`source` 로 허용되는 것은 Figma URL (`figma.com/...`) 또는 이미지 파일 (`.png/.jpg/.jpeg/.webp/.gif/.svg`) 뿐. PRD/spec/요구사항 `.md` 는 source 가 아니다 (텍스트 문서는 spec 이지 visual reference 가 아님).",
      "레퍼런스를 받은 뒤에는 brandTone 문장보다 레퍼런스 캡션을 우선한다.",
      "구현 전 references.md 를 읽고 good 기준은 레이아웃/간격/타이포/컬러 의사결정으로 매핑하고, bad 기준은 명시적 회피 규칙으로 적는다.",
      "완료 보고에는 어떤 reference cue 를 실제 화면에 반영했는지 2-4개로 요약한다.",
    ],
    avoid: [
      "레퍼런스 없이 '차분한/전문적인/친근한' 같은 형용사만 보고 화면 생성",
      "정답 이미지만 받고 오답 기준 없이 작업",
      "이미지의 색감만 따라 하고 정보 밀도, 강조 장치 수, CTA 위계를 무시",
      "references.md 를 저장만 하고 구현 계획/완료 보고에서 반영 근거를 설명하지 않음",
      "[stale-references-md] 이전 task 의 references.md 가 남아 있는데 'task: 슬러그' 비교 없이 '이미 답변 받음' 으로 통과시킴 — 반드시 슬러그 매칭",
      "[prd-as-visual] PRD 에 ASCII 레이아웃·컬러 스펙이 있다고 'visual reference 로 간주' — 텍스트 ≠ 시각자료, Figma 또는 이미지 필요",
      "[decisive-tone-bypass] 사용자 어조 ('바로 만들어줘' / 'PRD 지켜서') 가 단호하다고 게이트 skip — 어조는 우회 사유가 아님",
      "[soft-prompt-misread] 가이드의 'soft prompt' 표현을 'optional 권고' 로 약화 해석 — 이 게이트는 REQUIRED",
      "[checklist-omission] 메모리/체크리스트의 후반 단계만 따라가다 이 게이트를 'principles 응답에 끼어있는 부차 advisory' 로 격하",
    ],
    referenceInputs: {
      accepted: [
        "Figma design URL 또는 figmaNodeUrl",
        "정답 스크린샷 이미지",
        "오답 스크린샷 이미지",
        "프롬프트에 첨부된 이미지/링크",
      ],
      minimum: "최소 정답 1장 + 오답 1장. 가능하면 총 6-10장.",
      format: "[good|bad] source=<figma-url|image-name> caption=<1-line reason>",
      fallbackQuestion:
        "시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료를 기준으로 진행해도 될지, 추가로 정답/오답 레퍼런스가 있으면 함께 알려 주세요. 가능하면 정답 1-2장, 피해야 할 오답 1-2장에 각각 1줄 캡션을 붙여 주세요.",
    },
    examples: [
      {
        verdict: "good",
        source: "Figma node or approved screenshot",
        caption:
          "Neutral surface와 텍스트 위계로 정보 우선순위가 분리되고 primary CTA가 1개만 남아 있음.",
      },
      {
        verdict: "bad",
        source: "Rejected AI mockup screenshot",
        caption:
          "한 화면에 primary CTA, blue tint card, chip, icon 강조가 동시에 많아 모든 영역이 강조처럼 보임.",
      },
    ],
    metrics: {
      recommendedReferenceCount: "6-10",
      minGoodReferences: 1,
      minBadReferences: 1,
      recommendedGoodReferences: "1-2",
      recommendedBadReferences: "1-2",
      captionLength: "1 line",
      preferFigmaNodeUrl: "true",
    },
  },
  notice: {
    name: "notice",
    summary:
      "안내문/콜아웃/인라인 알림 박스의 강조 예산 + variant·size·구성 규칙. 컨텐츠 영역에 인라인으로 놓여 명시적으로 닫을 때까지 유지되는 메시지(정보·공지·주의·완료·오류). 페이지 상단 전역 띠는 Banner, 자동 사라지는 피드백은 Toast/Snackbar, 즉각 판단 요구는 Modal, EAP 위기 안내는 CrisisCallout — 인라인 지속 메시지만 이 패턴.",
    rules: [
      "안내문은 기본적으로 neutral surface와 본문 텍스트로 처리.",
      "주의/성공/오류처럼 의미가 명확한 경우에만 semantic color 사용.",
      "한 안내 영역에는 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 최대 2개만 사용.",
      "그라데이션은 금지. 캠페인/히어로가 아닌 안내문에는 단색 토큰만 사용.",
      "새로 생긴 섹션이라는 이유만으로 배경색/아이콘/배지를 추가하지 않음.",
      "variant 5종 중 의미에 맞게 1개 선택 — info(중립 회색·기본 톤) / Notice(블루·차분한 공지) / Caution(옐로우·강조 주의) / Success(그린·완료·성공) / Error(레드·오류·조치 필요).",
      "구성요소 3개 — ① Container: padding 16 · gap 8 · radius 8 · 가로 max 800 ② Icon 20×20: variant별 의미 강화 ③ Body: Body3 Medium · Text/Subtitle/Default.",
      "size 2종 — 1줄 52px / 2줄 72px. 텍스트 길이에 따라 박스 높이 자동 조정. 성공·오류는 1줄(52), 정보·주의는 2줄(72) 권장.",
      "본문은 1-2줄로 짧고 명확하게. 색은 임의 hex 금지 — semantic token(semantic-info-bg / semantic-info-text 등)으로 binding.",
      "색 배경 강조 박스는 화면당 1개 권장(DS 원칙). 부득이 혼용하더라도 서로 다른 variant 3종·같은 variant 2개를 넘기지 않는다.",
    ],
    avoid: [
      "gradient + icon + badge + bold headline 동시 사용",
      "일반 안내문에 Chip으로 '안내', '추천', '확인' 라벨 반복",
      "안내 박스 안에 다시 강조 카드/강조 배지를 중첩",
      "한 화면에 4종 이상 variant 동시 표시",
      "Error variant를 단순 정보 안내에 사용",
      "본문 3줄 이상을 인라인 메시지에 담기 — Modal로 분리",
      "임의 색상 직접 지정 — semantic token 미사용",
    ],
    metrics: {
      maxColoredNoticePerScreen: 1,
      maxEmphasisDevicesPerNotice: 2,
      variantCount: 5,
      maxDistinctVariantsPerScreen: 3,
      maxSameVariantPerScreen: 2,
      sizeOneLinePx: 52,
      sizeTwoLinePx: 72,
      containerPaddingPx: 16,
      containerGapPx: 8,
      containerRadiusPx: 8,
      maxWidthPx: 800,
      iconSizePx: 20,
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=984-6787",
    references: [
      {
        label: "Cashpobi Alert 디자인 가이드",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=984-6787",
        caption:
          "캐포비 라이브러리의 인라인 알림 박스 가이드 — 5 variant(info/Notice/Caution/Success/Error)·2 size(52/72)·anatomy·Usage 경계·DO/Don't. 이 DS에서는 notice 패턴으로 흡수.",
        brand: "cashwalk-biz",
      },
    ],
  },
  dropdown: {
    name: "dropdown",
    summary: "Select/Dropdown 옵션 수에 따른 높이와 검색 정책.",
    rules: [
      "옵션 7개 이하는 일반 Select.",
      "옵션 8-15개는 max-height 320px 안팎의 스크롤 목록.",
      "옵션 15개 초과는 검색 가능 Select/Autocomplete 검토.",
      "옵션 50개 초과는 서버 검색 또는 가상화 검토.",
      "옵션 라벨은 1줄 유지. 보조 설명은 help text나 별도 상세 영역으로 분리.",
    ],
    avoid: [
      "긴 문장 옵션을 드롭다운에 그대로 노출",
      "옵션 15개 초과인데 검색 없이 긴 스크롤만 제공",
      "모바일에서 좁은 팝오버 안에 긴 옵션 목록 표시",
    ],
    metrics: {
      defaultMaxHeight: "320px",
      searchThreshold: 15,
      virtualizationThreshold: 50,
    },
  },
  "dense-list": {
    name: "dense-list",
    summary: "정보가 과밀한 리스트/카드 영역의 배치 원칙.",
    rules: [
      "반복 아이템의 상태, 날짜, 금액, 진행률 위치를 고정해 스캔 경로를 만든다.",
      "카드 하나에 주요 정보 3개, 보조 정보 5개를 넘기지 않는다.",
      "상세 설명은 기본 노출보다 Accordion/상세 페이지/ExpandableText로 분리.",
      "모바일에서는 표보다 카드형, 필터는 가로 스크롤 또는 접힘 영역을 우선.",
      "반복 카드마다 CTA를 2개 이상 두지 않는다.",
    ],
    avoid: [
      "카드마다 Chip, 색 배경, 아이콘 CTA를 모두 반복",
      "상태/날짜/CTA 위치가 카드마다 달라지는 배치",
      "모든 정보를 첫 화면에 펼쳐 설명하는 구성",
    ],
    metrics: {
      maxPrimaryFactsPerCard: 3,
      maxSecondaryFactsPerCard: 5,
      maxCtaPerRepeatedCard: 1,
    },
  },
  "semantic-spacing": {
    name: "semantic-spacing",
    summary:
      "Spacing 은 정보 관계와 위계를 표현하는 구조 시스템이다. 4pt grid · Figma SpacingGuide 실측 기반. Gap(요소 간 거리, 의도 기반) 과 Inset(컨테이너 내부 여백, 사용처 기반) 을 명확히 구분하고, 같은 의미의 간격은 같은 semantic 토큰만 사용한다.",
    rules: [
      "Gap (요소 간 거리) — 의도 기반 5단계만 사용:\n  · `--semantic-gap-tight` (4px) → Chip · Badge 그룹\n  · `--semantic-gap-default` (10px) ★ 표준 컴포넌트 gap\n  · `--semantic-gap-comfortable` (12px) → 폼 필드 · 세그먼트\n  · `--semantic-gap-loose` (16px) → 컴포넌트 ↔ 컴포넌트\n  · `--semantic-gap-wide` (24px) → 큰 영역 ↔ 큰 영역",
      "Inset (컨테이너 내부 여백) — 사용처 기반 5단계만 사용:\n  · `--semantic-inset-chip` (8px) → Chip · Badge 내부 padding\n  · `--semantic-inset-input` (12px) → Input · 작은 컨테이너 padding\n  · `--semantic-inset-card` (16px) ★ 카드 표준 padding\n  · `--semantic-inset-card-large` (20px) → 큰 카드 padding\n  · `--semantic-inset-modal` (24px) → Modal · 통계 박스 padding",
      "결정 트리 — 내부 여백(padding)인지 요소 간격(gap)인지 먼저 판단한 뒤 위 토큰 중 하나로 매핑한다. 모호하면 표준값(`--semantic-gap-default` 10px / `--semantic-inset-card` 16px)을 우선.",
      "같은 깊이·같은 의도의 간격은 항상 같은 토큰을 쓴다 — 한 화면 내 카드들이 모두 16px padding 이면 모두 `--semantic-inset-card` 로.",
      "Primitive(--spacing-N) 는 토큰 정의용. UI 코드에서는 직접 사용 금지 — 반드시 `--semantic-gap-*` / `--semantic-inset-*` 를 거친다.",
      "임의 px 사용 금지: 5 / 7 / 9 / 11 / 13 / 15px 는 4pt 위반이므로 토큰으로 대체할 것.",
      "Inset 자리에 Gap 토큰 사용 / Gap 자리에 Inset 토큰 사용 금지 — padding 에 `--semantic-gap-*`, flex/grid gap 에 `--semantic-inset-*` 쓰지 않는다.",
    ],
    avoid: [
      "padding: 14px / margin: 11px 같은 raw px 직접 사용",
      "padding 에 `--semantic-gap-default` 사용 / gap 에 `--semantic-inset-card` 사용 (역할 혼동)",
      "한 화면에 카드마다 다른 padding 토큰 사용 (일관성 손상)",
      "spacing 대신 색 배경 / border 만으로 영역 구분",
      "var(--spacing-12) 같은 primitive 토큰을 UI 코드에서 직접 사용",
    ],
    metrics: {
      gridBase: "4pt",
      gapDefault: "--semantic-gap-default (10px)",
      insetDefault: "--semantic-inset-card (16px)",
      allowedGapTokens: "tight(4) / default(10) / comfortable(12) / loose(16) / wide(24)",
      allowedInsetTokens: "chip(8) / input(12) / card(16) / card-large(20) / modal(24)",
      figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=SpacingGuide",
    },
  },
  "surface-layer": {
    name: "surface-layer",
    summary:
      "Surface / Background 의 4단계 레이어 정의와 Brand background 사용 원칙. Brand background 는 시각 장식이 아니라 '의미 전달'(주의·안내·강조) 목적으로만 사용한다. notice 패턴과 짝.",
    rules: [
      "Layer 정의 (낮은 → 높은 위계):\n  · L0 기본 surface → `--semantic-bg-surface-default` (#FFFFFF) — 기본 카드/박스 (Card, Info Box)\n  · L1 페이지 배경 → `--semantic-bg-page-default` (≈#F8F9FB) — body, 페이지 전체 배경\n  · L2 Subtle BG → `--semantic-bg-surface-subtle` / `--semantic-bg-section-default` — 비활성 영역, 표 헤더, 섹션 분리\n  · L3 Notice (의미 전달) → `--semantic-bg-brand-subtle` 또는 `--semantic-bg-status-*` — CrisisCallout, 핵심 Notice, 상태성 안내",
      "Brand background (`--semantic-bg-brand-*`) 는 다음 모두를 만족할 때만 사용:\n  1) 사용자에게 주의 / 안내 / 하이라이트 의미 전달이 필요한가?\n  2) 현재 화면에 이미 사용 중인 brand background 가 없는가?\n  3) 단순 decoration 목적이 아닌가?\n  → 셋 모두 YES 일 때만. 하나라도 NO 면 `--semantic-bg-surface-default` 로 처리.",
      "한 화면당 brand background 최대 1개. 같은 영역에 brand bg + brand chip + brand icon 을 동시에 쌓지 않는다 (tone-on-tone).",
      "상태 의미가 명확할 때만 status 배경(`--semantic-bg-status-error|success|caution|info`) 사용. 일반 안내문은 neutral 우선.",
      "섹션 구분은 spacing / border / text 위계로 먼저 해결. 색 배경으로만 영역을 구분하지 않는다.",
    ],
    avoid: [
      "KPI 카드 / summary 카드 / 일반 정보 카드에 brand background 사용",
      "section 구분을 색상으로만 해결 (spacing 없이 색만)",
      "한 화면에서 카드마다 다른 pastel background 를 깔아 모든 영역이 강조되어 보이는 구성",
      "decorative 목적의 색 배경 (의미 전달 없는 단순 시각 분리)",
      "Brand bg 위에 다시 brand chip / brand icon / brand button 을 중첩 (tone-on-tone)",
      "안내문에 gradient + icon + badge + bold headline 을 동시에 적용",
    ],
    metrics: {
      maxBrandBgPerScreen: 1,
      maxEmphasisDevicesPerNotice: 2,
      layers:
        "L0 surface-default / L1 page-default / L2 surface-subtle | section-default / L3 brand-subtle | status-*",
      decisionRule: "의미 전달 + 화면 내 brand bg 없음 + decoration 아님 — 셋 모두 YES",
    },
  },
  "icon-usage": {
    name: "icon-usage",
    summary:
      "아이콘은 장식이 아니라 행동 / 상태 / affordance 전달 목적에만 사용한다. 어디에 써도 되고 어디에 쓰면 안 되는지를 정의하는 화이트리스트 / 블랙리스트. 아이콘 컬러는 get_guide({ topic: 'pattern:icon-color' }), 사이즈/스타일은 get_guide({ topic: 'pattern:iconography' }) 참고.",
    rules: [
      "**필수 선택 순서**: 브랜드 전용 아이콘 → NudgeEAP 기본 아이콘 → MockupLinear*/MockupBold* 목업 기본 아이콘 → 자체 생성 SVG. find_icon 으로 앞 단계 후보를 먼저 확인하고, 없을 때만 다음 단계로 이동.",
      "허용 위치 (화이트리스트):\n  · AppBar / Header 기능 버튼 (검색 · 알림 · 뒤로가기 · 메뉴)\n  · Bottom Tab Navigation\n  · IconButton\n  · 동일 위계의 카테고리 그룹 (Concern Grid · Category Grid)\n  · 상태 아이콘 (Success · Warning · Error)\n  · Form Field affordance (검색 · 캘린더 · 드롭다운 토글)",
      "동일 위계의 텍스트는 아이콘 사용 여부가 일관되어야 한다 — 같은 GNB / 같은 카드 리스트 / 같은 헤딩 그룹 안에서 일부에만 아이콘이 붙으면 hierarchy 가 깨진다.",
      "헤딩 앞 아이콘 5개 이상 사용 시 자동 위반 — 아이콘을 hierarchy 표현 수단으로 쓰지 않는다.",
      "아이콘이 필요한지 판단 기준: 액션을 호출하는가? 상태를 전달하는가? affordance(입력 가능/스크롤 가능 등)를 알리는가? 셋 중 하나도 아니면 아이콘 없이 텍스트만.",
      "스타일 혼용 금지 — 한 화면에서 Line(stroke) 과 Filled 를 같은 의미 그룹에서 섞지 않는다 (iconography 패턴 참고).",
    ],
    avoid: [
      "서브타이틀(h3/h4) 앞 장식 아이콘",
      "Form Label 앞 장식 아이콘",
      "본문 텍스트 앞 decorative icon",
      "일부 헤딩에만 icon 사용 (한 화면 안에서 불일치)",
      "hierarchy 와 무관한 icon 추가 (강조용으로 색만 다른 아이콘 끼우기)",
      "모든 텍스트 앞에 icon 사용 — affordance 가 없는 장식",
      "colorful icon 과다 사용 / 의미 없는 emoji",
      "아이콘 스타일 혼용 (Line + Filled 가 같은 그룹에서 공존)",
      "앞 우선순위의 아이콘을 확인하지 않고 자체 SVG 생성",
    ],
    metrics: {
      maxHeadingIconsPerScreen: 4,
      allowedLocations:
        "AppBar buttons / Bottom Tab / IconButton / 카테고리 그룹 / 상태 아이콘 / Form field affordance",
      consistencyRule: "same-hierarchy-text → same-icon-decision",
      selectionPriority:
        "brand-specific → nudge-eap-default → mockup-default(MockupLinear/MockupBold) → generated-custom",
      relatedPatterns: "icon-color, iconography",
    },
  },

  "cashwalk-biz-icon-library": {
    name: "cashwalk-biz-icon-library",
    summary:
      "캐시워크 포 비즈니스 (Cashwalk for Business) admin 전용 아이콘 라이브러리. 46 icons · 6 categories (Navigation / Action / Status / Social / GNB / Selection). " +
      "현재는 카탈로그 메타데이터만 등록되어 있고 SVG 자산은 미동기화 — 디자인팀에서 SVG export 받기 전까지 공용 @nudge-design/icons 의 매칭 아이콘으로 fallback.",
    rules: [
      "Navigation (7): chevron-up/down/left/right, arrow-up/down/right.",
      "Action (9): close, plus, search, delete, edit, delete-circle, refresh, filter, search-delete.",
      "Status (8): info, question, caution, error, check, check-circle-on, check-circle-off, open.",
      "Social (8): like, comment, share, ripple, bubble, message-quiz, banner, calendar.",
      "GNB (8): gnb-banner, gnb-channel, gnb-chat, gnb-quiz, gnb-member, gnb-setting, gnb-cash, download.",
      "Selection (6): radio-off/on, checkbox-off/on/error/on-green. Checkbox 의 'on-green' 은 success 표시용 별도 variant.",
      "캐시워크 포 비즈니스 모드에서 brand prefix 아이콘이 별도 제공되기 전까지는 공용 아이콘을 사용하되, 의미가 같은 캐시워크 포 비즈니스 카탈로그 항목을 우선 fallback 후보로 본다.",
      "동일 카테고리(Action / Status 등) 내 아이콘은 동일 weight / stroke 로 통일.",
      "Checkbox 의 error / on-green 분기는 가이드에 명시된 의미(에러 표시 / 성공 표시) 그대로 사용.",
    ],
    avoid: [
      "SVG 가 도착하기 전 임의로 다른 출처(아이콘셋, lucide 등) 아이콘을 캐시워크 포 비즈니스 화면에 섞지 말 것.",
      "공용 아이콘과 캐시워크 포 비즈니스 아이콘 의미가 충돌하면 캐시워크 포 비즈니스 admin 화면에서는 캐시워크 포 비즈니스 우선.",
    ],
    metrics: {
      totalIcons: 46,
      categories: 6,
      svgSyncStatus: "pending — 디자인팀에서 export 받기 전까지 공용 아이콘 fallback",
      relatedPatterns: "iconography, cashwalk-biz-button, cashwalk-biz-input",
    },
  },

  "cashwalk-biz-button": {
    name: "cashwalk-biz-button",
    summary:
      "캐시워크 포 비즈니스 admin 의 Button 카탈로그 — 5 스타일 × 2 shape × 5 사이즈 × 3 상태 + TextButton + IconButton.",
    rules: [
      "5 스타일: Solid/Primary · Solid/Secondary · Weak/Secondary · Outlined/Primary · Outlined/Secondary. (※ Figma 캔버스 라벨은 'Neutral' 이지만 DS 네이밍은 'Secondary' — 동일 슬롯, color=\"secondary\" 와 정합.)",
      '2 shape: default(radius 8 · 일반 admin 폼/CTA) · pill(radius full · 모달 확인/취소·BottomCTA·격식 컨텍스트). `<Button shape="pill" />` 로 지정.',
      "5 사이즈: X-Large 52px · Large 48px · Medium 44px · Small 40px · Mini 36px.",
      "Solid/Primary 는 #FFD200 배경 + 검정 텍스트(high-contrast) — 캐시워크 포 비즈니스 시그니처. 텍스트 색을 흰색으로 바꾸지 않는다.",
      "Disabled bg 는 Neutral/400 #DDDDDD + 흰 텍스트 (Solid/Primary · Solid/Secondary 공통 페어, Figma 3098:1079/3098:1121).",
      "Outlined disabled (Primary/Secondary 모두) 는 border #E7E7E7 + text #BBB.",
      "TextButton: Large(38px) / Medium(32px) × Default/Hover/Disabled.",
      "IconButton: X-Large(48) / Large(44) / Medium(40) / Small(32) × Default/Hover/Disabled. (총 12 variants)",
      "터치/마우스 타겟 ≥ 36px (Mini) — admin 데스크톱은 그래도 Medium(44) 이상 권장.",
      "Outlined/Primary 텍스트는 Yellow/700 (#FEAF01) — Outlined 텍스트가 그린 색이면 안 됨 (가이드 명시).",
      '**아이콘 색 하드코딩 금지** — `color="var(--semantic-icon-inverse-default)"` 처럼 inverse/brand 토큰 사용 금지. 캐시워크 포 비즈니스는 primary text 가 검정이라 흰 아이콘이 노란 배경 위에 떠 보임. `color="currentColor"` 로 두어 Button 텍스트 색을 상속.',
    ],
    avoid: [
      "Solid/Primary 의 텍스트를 흰색으로 바꾸지 말 것 — 가이드 위반 + 가독성 저하.",
      "Mini 사이즈를 본문 CTA 로 사용하지 말 것 — table row inline action 같은 좁은 영역 한정.",
    ],
    metrics: {
      sizes: "X-Large=52 · Large=48 · Medium=44 · Small=40 · Mini=36 (px)",
      styles: 5,
      states: "default / hover / disabled",
      textButtonSizes: "Large=38 / Medium=32 (px)",
      iconButtonSizes: "X-Large=48 / Large=44 / Medium=40 / Small=32 (px)",
      relatedPatterns: "cta-group, cashwalk-biz-input",
    },
  },

  "cashwalk-biz-form-layout": {
    name: "cashwalk-biz-form-layout",
    summary:
      "캐시워크 포 비즈니스 admin 폼 페이지 레이아웃 — 'PageTitle 32 Bold → 1px divider → 섹션 헤딩 24 Bold (카드 밖) → 카드(48×36 padding · radius 16) → 라벨-인라인-좌측 (172px 컬럼) 필드 → 페이지 끝 inline 센터 [취소][저장] 알약(rounded-28) cluster' 표준. " +
      "Figma 290:1197 (퀴즈 등록하기) 실측. 필드 단위 컴포넌트 정책은 pattern:cashwalk-biz-input, CTA 정책은 pattern:cashwalk-biz-button 과 함께 본다.",
    rules: [
      "**페이지 컨테이너**: 사이드바(좌 300px) 우측 본문. 페이지 bg `#FAFAFA`, 콘텐츠 컬럼 폭 1491px (실측), 좌측 padding 32px.",
      "**페이지 헤더**: 좌측 정렬 — 타이틀 Pretendard **Bold 32 / lh 60** #383838. 타이틀 아래 76px 후 **1px hairline divider #D8D8D8** 풀폭. 우측에는 액션 두지 말 것.",
      "**섹션 헤딩 (카드 위 분리 노출)**: 헤딩(예: '기본 정보') 은 카드 **밖** 위에 위치 — Pretendard **Bold 24 / lh 30** #383838. 헤딩 아래 ~54px 후 카드 시작.",
      "**섹션 카드**: 카드 padding **48px × 36px**, `radius 16px`, border 1px `#ECECEC`, bg white, soft shadow `0 10px 20px rgba(102,102,102,0.05)`.",
      "**필드 레이아웃 = 라벨-인라인-좌측 (label column)** — admin 폼 가독성/정렬 위해 라벨이 필드 좌측 고정 폭. 라벨 컬럼 **172px**, 필드 우측 ~684px (long) 또는 ~228px (date/short). 라벨은 row 중앙 정렬.",
      "**라벨 타이포**: Pretendard **Medium 16 / lh 24, #666** (text.subtle). 'strong' 색을 쓰지 않는다 — 빽빽한 폼에서 라벨은 subtle 로 둬도 위계가 명확.",
      "**필드 컴포넌트**: 높이 **48px**, `radius 10px`, border 1px `#D8D8D8`, bg white, placeholder 16px #999. 검정 focus border 는 `pattern:cashwalk-biz-input` 참조.",
      "**행 높이**: ~102-106px (라벨+필드+helper 포함). 라벨↔필드 ~5px, 필드↔helper ~10-14px.",
      "**Helper text**: Pretendard Regular **14 / lh 20, #666**. 글자 수 카운터(`0/30`) 는 14 Medium #999 우측 정렬.",
      "**필수 마커**: 라벨 옆 ` *` color **`#FC3500`** (Coral Red-Orange). 'optional' 표기 X.",
      "**액션바**: NOT sticky. 페이지 끝 inline + **센터 정렬 cluster** — [취소] + [저장], 각 **w-160 h-56 rounded-28 (알약)**. Cancel: white + 1px #D8D8D8 + #666. Primary: bg `#FFD200` + 검정 텍스트. Disabled: bg `#D8D8D8` + 흰 텍스트.",
      "**액션 위계**: primary solid CTA 1개. 파괴(삭제) 액션은 별도 위치(헤더 우측 또는 카드 우측 상단) 분리.",
      "**선택 chip / 활성 토큰**: `bg #FFFAE2 + border #FFD200` (옅은 노란 + 노란 보더) + Bold #111. 강조 숫자/카운트는 `#FD9B02` (amber).",
      "**우측 보조 사이드 카드 (선택)**: 메인 필드 우측에 요약 카드 (border #ECECEC rounded-16 padding 25×32 w-406) — 미리보기/도움말.",
      "**유효성 검사**: 입력 중 에러 표시 X (onBlur/submit). 글자 수 카운터만 실시간.",
    ],
    avoid: [
      "라벨을 필드 위에 배치 (label-above 2단 흐름) — 캐시워크 포 비즈니스 admin 은 인라인-좌측 (172px 라벨 컬럼) 패턴.",
      "페이지 헤더 우측에 [저장] 버튼 — 하단 센터 액션바와 중복.",
      "필수 마커 색을 `#FF4141` 으로 — 캐시워크 포 비즈니스 폼은 `#FC3500` (Coral Red-Orange).",
      "Disabled CTA 를 Yellow/100 (#FFFAE5) 로 — 폼 액션바 disabled 는 `#D8D8D8` neutral gray.",
      "액션바를 우측 정렬 또는 sticky bottom — 캐시워크 포 비즈니스 폼은 페이지 끝 inline 센터.",
      "CTA 모양을 8px rounded 사각형 — Figma 는 56h rounded-28 알약 (pill).",
      "필드 border-radius 를 8px 로 — Figma 는 10px.",
      "필수 라벨을 brand yellow 로 강조 — 노랑은 활성/선택용. 필수는 빨강-주황 별표만.",
      "한 폼 안에 카드 간격 일정한 24px — Figma 는 의미 단위 64-80px 가변.",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 290:1197 캐시워크 포 비즈니스 admin form (퀴즈 등록하기)",
        caption:
          "PageTitle 32 Bold → 1px divider → 섹션 헤딩 24 Bold (카드 밖) → 카드 padding 48×36 radius 16 → 라벨-인라인-좌측 (172px) + 필드 h-48 rounded-10 → 페이지 끝 [취소][저장] 알약 cluster 센터.",
      },
      {
        verdict: "bad",
        source: "잘못된 admin form 레이아웃",
        caption:
          "라벨-위 흐름 + 우측 정렬 sticky 액션바 + rounded-8 사각 CTA + #FF4141 필수마커 — 모두 캐시워크 포 비즈니스 admin 컨벤션 위반.",
      },
    ],
    metrics: {
      pageBg: "#FAFAFA",
      pageTitle: "Pretendard Bold 32/60 #383838",
      titleToDivider: "76px (then 1px hairline #D8D8D8)",
      sectionHeading: "Pretendard Bold 24/30 #383838 (카드 밖 위)",
      sectionHeadingToCardGap: "~54px",
      cardPadding: "48px × 36px (px × py)",
      cardRadius: "16px",
      cardBorder: "1px #ECECEC",
      cardShadow: "0 10px 20px rgba(102,102,102,0.05)",
      interCardGap: "~64–80px (의미 단위 가변)",
      labelColumnWidth: "172px",
      labelTypography: "Pretendard Medium 16/24 #666",
      requiredMarker: "라벨 옆 ' *' #FC3500",
      fieldHeight: "48px",
      fieldRadius: "10px",
      fieldBorder: "1px #D8D8D8",
      fieldBg: "white",
      placeholderColor: "#999",
      helperTypography: "Pretendard Regular 14/20 #666 (counter #999)",
      actionBarPosition: "inline at page-end (NOT sticky)",
      actionBarAlignment: "center cluster",
      ctaSize: "w-160 h-56 rounded-28 (pill)",
      ctaPrimary: "bg #FFD200 + 검정",
      ctaCancel: "white + 1px #D8D8D8 + #666",
      ctaDisabled: "bg #D8D8D8 + 흰 텍스트",
      maxPrimarySolidPerScreen: 1,
      validationTiming: "onBlur or submit",
      relatedPatterns: "cashwalk-biz-input, cashwalk-biz-button, cta-group",
    },
    figmaNodeUrl:
      "https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/%ED%95%9C%EA%B5%AD-%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC_WEB-Dev?node-id=290-1197",
    references: [
      {
        label: "캐시워크 포 비즈니스 admin 폼 SSOT — 퀴즈 등록하기 (Figma 290:1197)",
        image: "references/cashwalk-biz-form-290-1197.png",
        caption:
          "캐시워크 포 비즈니스 admin 폼 페이지 SSOT 스크린샷. 본 가이드 metrics 는 이 노드 실측 기준.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐시워크 포 비즈니스 사이드바 — 광고/운영/관리 3섹션 (Figma 168:1250)",
        image: "references/cashwalk-biz-sidebar-168-1250.png",
        caption: "본문 좌측 LNB. 폼 페이지의 사이드바 컨텍스트.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐시워크 포 비즈니스 사이드바 — 서브메뉴 펼침 변형 (Figma 290:1593)",
        image: "references/cashwalk-biz-sidebar-290-1593.png",
        caption: "퀴즈 관리 sub-item 펼친 상태 (등록하기/목록/통계). 폼 진입 경로.",
        brand: "cashwalk-biz",
      },
    ],
  },

  "nudge-eap-form-layout": {
    name: "nudge-eap-form-layout",
    summary:
      "NudgeEAP 고객사용(B2B EAP customer) 폼 페이지 레이아웃 — 'WebHeader 80 + 800px rail → 28 Bold PageTitle → 라벨-위 단일 컬럼 → soft #FAFAFA 필드 h-48 rounded-8 → 비밀유지 안내 타일 → inline 센터 CTA w-328 rounded-8 #2b96ed' 표준. " +
      "Figma 39:6004 (PC_상담신청서) 실측. **데스크탑 전용** — 모바일은 별도.",
    rules: [
      "**뷰포트**: 데스크탑 1920px, 본문 rail **800px** 센터. 모바일 폼은 이 가이드 적용 X (별도 시안 필요).",
      "**WebHeader**: 80h 풀폭 white + bottom border `#ECECEC`. 좌측 로고 + 센터 6 nav (`Bold 18/26 #111`) + 우측 [로그인 #2b96ed]/[앱 다운로드 #F5F5F5 + blue 텍스트].",
      "**페이지 헤더**: 타이틀 Pretendard **Bold 28/38** (Headline 2) #111. step/progress indicator 없음.",
      "**필드 레이아웃 = 라벨-위 (label-above) 단일 컬럼** — 캐시워크 포 비즈니스 admin (인라인-좌측) 과 정반대. 800px rail 안 세로 흐름.",
      "**라벨 타이포**: Pretendard **Medium 16/24 #383838**. 필수 마커: 별표 `*` **`#F13F00`** (Coral Red) 라벨 뒤 인라인.",
      "**필드 컴포넌트**: 높이 **48px**, `radius 8px`, border 1px `#D8D8D8`, **bg `#FAFAFA`** (soft off-white — 멘탈케어 톤. 캐시워크 포 비즈니스 pure white 와 차이). padding 16×14.",
      "**그룹 간격**: 그룹↔그룹 **36px**, 라벨↔필드 **12px**, helper↔라벨 **4px**.",
      "**Helper 텍스트**: Pretendard Regular **13/18 #383838** 또는 14/20 #666.",
      "**CTA**: 페이지 끝 inline + 센터. 단일 primary 버튼 (`신청서 제출하기`) **w-328 h-48 rounded-8 padding 12**, Bold 16/24 white. 활성 `#2b96ed`, disabled `#9CA2AE` + 흰.",
      "**비밀유지 안내 타일**: CTA 위 형제로 — bg `#FAFAFA`, `rounded-8 p-16 w-800`, InfoIcon + Medium 14/20 #666. 멘탈케어 폼의 시그니처 (e.g. '기관에서 연락드린 후 상담사가 최종 확정됩니다. 상담 신청 내용은 비밀이 보장되며, 회사에는 전달되지 않습니다.').",
      "**Mood slider (마음체크)**: 5점 horizontal color bar — 선택 `#2b96ed`, 미선택 `#13BFA2` (green/300), 셀 gap 2px, 양끝 라벨 Medium 14.",
      "**시간대/옵션 chip**: 동일 폭 inline 라디오 — white + border #D8D8D8 + rounded-8 + padding 16×12 + gap 12 + Medium 16 #666. RadioGroup 아닌 segmented selector 패턴.",
      "**약관 동의 타일**: 폼 끝 직전 full-width rounded-8 row, 라운드 체크박스 + Regular **14/20 #111** (다른 라벨 16 스케일과 차별).",
      "**플로팅 UI**: 우측 하단 scroll-to-top 56×56 circle shadow `0 1px 10px rgba(0,0,0,0.1)` + 채널톡 (`left-calc(100%-320px)`).",
      "**유효성 검사**: onBlur/submit (실시간 빨간 메시지 금지 — 멘탈케어 컨텍스트 거부감).",
    ],
    avoid: [
      "라벨을 인라인-좌측 컬럼으로 정렬 — NudgeEAP 고객 폼은 label-above. (캐시워크 포 비즈니스 admin 패턴 혼동 적용 X).",
      "필드 bg pure white — 멘탈케어 컨텍스트는 soft off-white(`#FAFAFA`) 시그니처.",
      "필수 마커를 `#FF4141` 로 — NudgeEAP 는 `#F13F00` Coral Red.",
      "비밀유지 안내 누락 — 검사/상담 폼은 신뢰 확보 타일이 거의 필수.",
      "CTA 알약 (rounded-28+) — NudgeEAP 폼 CTA 는 rounded-8 정사각형.",
      "Brand 블루 #2b96ed 를 disabled 톤으로 — disabled 는 cool-gray #9CA2AE.",
      "Mood slider 를 라디오 5개로 — NudgeEAP 는 horizontal color-bar.",
      "모바일 변형에 800px rail 적용 — 모바일 시안 확보 후 별도.",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 39:6004 PC_상담신청서",
        caption:
          "WebHeader 80 → 28 Bold 타이틀 → 800px rail → 라벨-위 + soft #FAFAFA 필드 h-48 rounded-8 → 비밀유지 타일 → 센터 inline CTA w-328 h-48 rounded-8 #2b96ed.",
      },
    ],
    metrics: {
      viewport: "desktop 1920px, content rail 800px center",
      webHeaderHeight: "80px",
      pageTitle: "Pretendard Bold 28/38 #111",
      labelLayout: "label-above (single column 800px)",
      labelTypography: "Pretendard Medium 16/24 #383838",
      requiredMarker: "라벨 옆 ' *' #F13F00",
      fieldHeight: "48px",
      fieldRadius: "8px",
      fieldBorder: "1px #D8D8D8",
      fieldBg: "#FAFAFA (soft off-white)",
      fieldPadding: "16×14",
      interFieldGap: "36px",
      labelToFieldGap: "12px",
      helperToLabelGap: "4px",
      helperTypography: "Pretendard Regular 13/18 #383838 or 14/20 #666",
      ctaPosition: "inline at page-end, center",
      ctaSize: "w-328 h-48 rounded-8",
      ctaPrimary: "#2b96ed + white Bold 16/24",
      ctaDisabled: "#9CA2AE + white",
      confidentialityTile: "bg #FAFAFA rounded-8 p-16 w-800 + InfoIcon + Medium 14/20 #666",
      moodSliderColors: "selected #2b96ed, unselected #13BFA2, gap 2px",
      maxPrimarySolidPerScreen: 1,
      validationTiming: "onBlur or submit",
      relatedPatterns: "cta-group, nudge-eap-home-layout",
    },
    figmaNodeUrl:
      "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=39-6004",
    references: [
      {
        label: "NudgeEAP 고객 폼 SSOT — PC_상담신청서 (Figma 39:6004)",
        image: "references/nudge-eap-form-39-6004.png",
        caption:
          "NudgeEAP 고객사용 폼 페이지 SSOT 스크린샷 (desktop 1920, rail 800). 본 가이드 metrics 는 이 노드 실측 기준.",
        brand: "nudge-eap",
      },
    ],
  },

  "nudge-eap-home-layout": {
    name: "nudge-eap-home-layout",
    summary:
      "NudgeEAP 고객사용(B2B EAP customer) 홈 페이지 레이아웃 — 'WebHeader 80 + CMS 스트립 + 1200 rail → cream 히어로 812×400 → blue-50 3카드 빠른 액션 → 캐러셀 (240w 표준 + 440w featured) → 주간레터 그리드 → 공지 list → 채널톡 FAB' 표준. " +
      "Figma 20:7250 실측. 데스크탑 전용 1920w, B2B 화이트라벨.",
    rules: [
      "**뷰포트**: 데스크탑 1920px 풀폭, 본문 rail **1200px** (gutter 360). bg pure white.",
      "**WebHeader**: 80h, 좌측 고객사 로고 200×60, 센터 6 nav (`Bold 18/26 #111`), 우측 [로그인 #2b96ed]/[앱 다운로드 #F5F5F5 + blue]. notification/profile icon 없음.",
      "**CMS 스트립**: 헤더 아래 풀폭, bg `#FAFAFA`, `py-14 px-360`. 고객사 인사말 Medium 16/24 + 보조 Regular 14/20.",
      "**히어로 배너**: 단일 카드 **812×400 rounded-20 bg #FFEDD0 (cream)** — 마음치유 톤. 타이틀 36 Bold 검정 + 16/24 Regular + 우측 하단 'rolling' pagination chip. 우측엔 banner 선택 그리드 (w-364, gap 16-18).",
      "**3-카드 빠른 액션**: 히어로 아래 3개 가로 CTA 카드, **385×128 rounded-12 bg #F1F8FD (blue/50) padding 28×24 gap 23**. 내부: 20/28 Bold 타이틀 + 16/24 #666 보조 + 80px 일러스트. 라벨: 바로 상담하기 / 상담사 찾기 / 상담 센터 찾기.",
      "**섹션 헤딩**: **28/38 Bold 검정** + 우측 '더보기' (18/26 Bold #666 + ChevronRight). 검사/주간레터/회사소식 반복 적용.",
      "**심리검사 캐러셀**: h-280, 카드 rounded-16 gap 24. 표준 **240w bg #FAFAFA**, featured **440w bg #FFF7E6 + 'GO' 원형 pill (#FFA411)**. 양 끝 chevron 버튼 68×68 원형 border #D8D8D8. 좌우 white gradient fade.",
      "**주간레터 그리드**: 3 × 385w 카드, 썸네일 **250h rounded-8 bg #EBEBEB** + 타이틀 20/28 Medium. gap 24.",
      "**공지 list (회사소식)**: border `#ECECEC rounded-8` 카드, `pt-24 pb-16 px-24`. 52px 행, divider #EEE. 배지 공지 `#DFF1FF / #007EE4`, 이벤트 `#FCE3EC / #ED2E77` rounded-13 Bold 14.",
      "**보조 배너 띠**: 1200×110-120 풀폭. brown `#67544D` + white pill (생활상담), blue `#2B96ED` + white pill (앱 다운로드).",
      "**채널톡 FAB**: 우측 하단 56×56 원형. desktop 이므로 BottomNav 없음.",
      "**Footer**: 1920×198 bg `#F5F5F5`. 주소/사업자번호/연락처 14/20 Regular #383838 + ISO 27001 로고 우측.",
      "**컬러 토큰**: page bg #fff, section bg #FAFAFA, primary card #F1F8FD, featured #FFF7E6, thumb #EBEBEB, brand #2B96ED, magenta #ED2E77 (이벤트 한정).",
      "**B2B 화이트라벨**: 좌측 상단 로고가 고객사 (e.g. 아모레퍼시픽). NudgeEAP 자체 브랜딩은 footer 에만.",
    ],
    avoid: [
      "모바일 BottomNav 추가 — 데스크탑 홈은 채널톡 FAB 만.",
      "Greeting/Notification icon 을 헤더 우측에 — NudgeEAP B2B 헤더는 [로그인][앱 다운로드] 페어.",
      "Magenta `#ED2E77` 을 일반 강조에 — 이벤트 배지 한정.",
      "Hero 배경을 brand blue 로 — cream/warm 톤 (`#FFEDD0`) 이 멘탈케어 시그니처.",
      "3-카드 빠른 액션을 4개 이상으로 — 3개가 위계 한계.",
      "심리검사 캐러셀 카드 색 다양화 — 표준 #FAFAFA + featured #FFF7E6 두 톤만.",
      "Banner strip 을 페이지 상단 추가 — hero 1개 + 중간 strip 1-2개가 한계.",
      "한 페이지에 primary `#2B96ED` solid CTA 2개 이상.",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 20:7250 NudgeEAP 고객 홈 (B2B 아모레퍼시픽)",
        caption:
          "1920 + 1200 rail + WebHeader 80 + cream 히어로 812×400 + 3 blue-50 카드 + 24/32/16/8 radius 패밀리 + 채널톡 FAB.",
      },
    ],
    metrics: {
      viewport: "desktop 1920px, content rail 1200px (gutter 360)",
      pageBg: "#fff",
      sectionBg: "#FAFAFA",
      webHeaderHeight: "80px",
      heroSize: "812×400 rounded-20 bg #FFEDD0",
      heroTitle: "Bold 36 검정",
      quickActionCard: "385×128 rounded-12 bg #F1F8FD padding 28×24 gap 23",
      sectionHeading: "Bold 28/38 + 더보기 Bold 18/26 #666",
      carouselCardStd: "240w rounded-16 bg #FAFAFA gap 24",
      carouselCardFeatured: "440w rounded-16 bg #FFF7E6 + GO pill #FFA411",
      letterCard: "385w + thumb 250h rounded-8 bg #EBEBEB",
      noticeList: "border #ECECEC rounded-8 pt-24 pb-16 px-24, 52px rows, divider #EEE",
      noticeBadgeNotice: "#DFF1FF / #007EE4 rounded-13 Bold 14",
      noticeBadgeEvent: "#FCE3EC / #ED2E77",
      bannerBrown: "#67544D + white pill CTA",
      bannerBlue: "#2B96ED + white pill CTA",
      fabSize: "56×56 채널톡",
      footerHeight: "1920×198 bg #F5F5F5",
      brandPrimary: "#2B96ED",
      magentaAccent: "#ED2E77 (이벤트 한정)",
      maxPrimarySolidPerScreen: 1,
      whitelabel: "true (고객사 로고/명 + CMS 스트립 인사말)",
      relatedPatterns: "nudge-eap-form-layout, nudge-eap-landing-layout, cta-group",
    },
    figmaNodeUrl:
      "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=20-7250",
    references: [
      {
        label: "NudgeEAP 고객 홈 SSOT — 홈 1404 (Figma 20:7250)",
        image: "references/nudge-eap-home-20-7250.png",
        caption:
          "NudgeEAP 고객사용 홈 페이지 SSOT 스크린샷 (desktop 1920, 1200 rail, B2B 화이트라벨).",
        brand: "nudge-eap",
      },
    ],
  },

  "nudge-eap-landing-layout": {
    name: "nudge-eap-landing-layout",
    summary:
      "NudgeEAP 홍보용 (B2B 도입 유치) 랜딩 페이지 레이아웃 — 'WebHeader 80 + 1400 rail → 1920×480 split 히어로 (CTA 없음) → 8 섹션 (gap 0, bg 교차) → 80h pill CTA → 510h dark footer + lead form' 표준. " +
      "Figma 323:939 (PC_법정의무교육) 실측. 데스크탑 전용, 코퍼레이트 B2B HR SaaS 톤.",
    rules: [
      "**뷰포트**: 데스크탑 1920px. outer rail **1400 (gutter 260)**, inner **1264 (gutter 328)**.",
      "**WebHeader**: 80h 풀폭 pinned. 디테일은 nudge-eap-home-layout 헤더 컨벤션 재사용.",
      "**히어로**: 1920×**480** 풀폭. **Split layout** — 텍스트 좌 (`left-260 top-216 w-520 h-208`) + 비주얼 우 (`left-920 800×400`). 헤드라인 ~60-62 Bold + 서브 ~28-32. **히어로 내 CTA 없음**.",
      "**섹션 블럭 패턴**: 8 섹션 모두 풀폭 stack. **gap 0** (butt against), 구분은 bg color 교차. 안 패딩: top 100 → 타이틀 74h → 122-138 gap → body → 100 bottom.",
      "**섹션 타이틀 심볼**: 1400×74 (`타이틀_pc`), 디스플레이 ~40-44 Bold.",
      "**카드 그리드**:\n  · CMS 기능 (2×2): 620×455 (image 620×303 + 텍스트 620×152, padding 25×24) col-gap 24\n  · 법정의무교육 4종 (4-col): 300×350, 아이콘 110×110 center top, gap 16\n  · EAP/웰니스 비교 (3-col): 270×302, 아이콘 120×120, gap 24\n  · 4단계 진행 (2×2): 612×405 + step badge `1단계` 72×44 pill, col-gap 40 row-gap 64",
      "**CTA 패턴**: 모든 CTA 는 **80h pill** (rounded-full), label hug + 54 horizontal padding. emoji prefix 허용 (⬇️ 👉) + 라벨 ~20-22 Bold. **히어로엔 없고 섹션 끝에만**.",
      "**중복 CTA OK**: 코퍼레이트 랜딩이라 같은 의도 CTA 가 섹션별로 반복 가능. 단, primary action 한 종류로 통일.",
      "**비교 표 (기존 vs 넛지EAP)**: 가로 비교 컬럼 + 체크/X 아이콘.",
      "**Lead form (도입 문의)**: 8번째 섹션 — 회사명/담당자/연락처/EAP 도입 여부 라디오. nudge-eap-form-layout 인풋 컨벤션 재사용 (label-above + #FAFAFA fill).",
      "**Footer**: 1920×**510** (dark corporate). 회사 정보/링크/문의/언어. home-layout 의 198h 라이트 footer 보다 키워 코퍼레이트 톤.",
      "**타이포 패밀리**: hero ~60-62, section title ~40-44, sub ~24-28, card title ~24, body ~16/1.6, CTA ~20-22 Bold.",
      "**톤**: 코퍼레이트 B2B HR SaaS — 정보 밀도 높음, 비교/스크린샷/단계별 중심. 'cream + soft' 톤은 아이콘/일러스트 한정.",
    ],
    avoid: [
      "히어로 안에 primary CTA — NudgeEAP 랜딩은 hero CTA 없음.",
      "섹션 간 gap 24/32/40 px — gap 0 butting + bg 교차가 표준.",
      "CTA 를 8h rounded-8 사각형 — 모든 CTA 가 80h pill.",
      "랜딩에 멘탈케어 soft 톤 (cream #FFEDD0) 을 헤드라인 배경으로 — soft 톤은 카드/아이콘 한정.",
      "단일 contact form 만 두고 섹션 CTA 누락 — 랜딩은 결과별 CTA 다회 노출.",
      "Lead form 을 별도 페이지로 분리 — 동일 페이지 마지막 섹션에 inline.",
      "Footer 를 200h 미만 라이트로 — 코퍼레이트 랜딩은 dark/dense.",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 323:939 NudgeEAP 랜딩 (PC_법정의무교육)",
        caption:
          "1920/1400 rail + 80h header + 1920×480 split hero (no CTA) + 8 stacked sections gap=0 + 80h pill CTA + 510h dark footer + lead form 섹션.",
      },
    ],
    metrics: {
      viewport: "desktop 1920px",
      contentRailOuter: "1400px (gutter 260)",
      contentRailInner: "1264px (gutter 328)",
      webHeaderHeight: "80px",
      heroSize: "1920×480 (split: text 520w + visual 800×400)",
      heroHeadline: "~60-62 Bold (Display)",
      heroCta: "none",
      sectionGap: "0 (butt against, bg alternation)",
      sectionTitleSymbol: "타이틀_pc 1400×74 (~40-44 Bold)",
      cmsGrid: "2×2 card 620×455 col-gap 24",
      eduGrid: "4-col card 300×350 icon 110 gap 16",
      compareGrid: "3-col card 270×302 icon 120 gap 24",
      stepGrid: "2×2 card 612×405 step-badge 72×44 col-gap 40 row-gap 64",
      ctaPillHeight: "80px",
      ctaPillRadius: "rounded-full",
      ctaLabel: "~20-22 Bold (emoji prefix allowed)",
      footerHeight: "1920×510 (dark corporate)",
      tone: "corporate B2B HR SaaS",
      leadFormReusesPattern: "nudge-eap-form-layout",
      maxPrimarySolidPerScreen: "여러 (섹션별 반복 OK, 의도 통일)",
      relatedPatterns: "nudge-eap-home-layout, nudge-eap-form-layout, cta-group",
    },
    figmaNodeUrl:
      "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=323-939",
    references: [
      {
        label: "NudgeEAP 랜딩 SSOT — PC_법정의무교육 (Figma 323:939)",
        image: "references/nudge-eap-landing-323-939.png",
        caption:
          "NudgeEAP 홍보/랜딩 페이지 SSOT 스크린샷 (B2B 도입 유치, 1920/1400 rail, 80h pill CTA, 8 stacked sections).",
        brand: "nudge-eap",
      },
    ],
  },

  "cashwalk-biz-input": {
    name: "cashwalk-biz-input",
    summary:
      "캐시워크 포 비즈니스 admin 의 Input/Form 컴포넌트 카탈로그. 8 컴포넌트 · 5 상태 (Default/Typing/Error/Disabled/Complete).",
    rules: [
      "TextInput (5 states), TextField (Label+Input+Helper, 5 states), Dropdown (Default/Hover/Active/Error/Disabled), DateInput (5 states), Textarea (5 states), Checkbox (4 variants), ImageUpload (Empty/Uploaded/Error), ActionChip (helper 옆 보조 액션).",
      "Input/Border/Focus 는 ★ Neutral/900 (#111111) 검정 — 다른 브랜드(brand 색 focus) 와 달리 캐시워크 포 비즈니스 admin 은 검정 outline.",
      "Input/BG/Disabled = Neutral/50 (#FAFAFA), Input/Border/Default = Neutral/200 (#EEEEEE).",
      "Checkbox 의 'on-green' SVG 가 별도 — success 표시(이미 처리 완료) 의미. 일반 checked 와 구분.",
      "ImageUpload 는 캐시워크 포 비즈니스 admin 표준 — Empty/Uploaded/Error 3 상태. user-app 의 ImageUpload 와 별도 컴포넌트로 취급.",
      "Input focus 는 brand 색(노랑) 이 아니라 검정 outline. 가이드 명시.",
      "ActionChip 은 TextField 의 helper text 영역 옆에 배치 — 별도 row 가 아니라 inline.",
    ],
    avoid: [
      "Input focus 를 노란색으로 바꾸지 말 것 — 가이드 위반.",
      "ImageUpload Error 상태에서 박스 자체를 빨갛게 칠하지 말 것 — border + helper text 로만 표현.",
    ],
    metrics: {
      components:
        "TextInput · TextField · Dropdown · DateInput · Textarea · Checkbox · ImageUpload · ActionChip",
      defaultStates: "default / typing / error / disabled / complete",
      focusBorder: "#111111 (Neutral/900, 검정)",
      relatedPatterns: "cashwalk-biz-button, dropdown",
    },
  },

  "card-composition": {
    name: "card-composition",
    summary:
      "Card 의 List/Thumb/Cover 3 base variant 위에 얹는 도메인 Composition 슬롯 카탈로그. " +
      "도메인 카드(헬시딜·식품 검색·식단 추천·랭킹·리뷰·커뮤니티 등)는 새 variant 를 만들지 말고 base variant + Composition 슬롯 조합으로 표현한다. " +
      "Figma 출처: Zenirit Card 가이드 옆 도메인 예시 — 헬시딜 랭킹 / 음식 리뷰 / 다이어트·혈당 추천 / 지금 뜨는 한식 / 커뮤니티 게시글 / Product Panel. " +
      "Card 본문 룰은 get_guide({ topic: 'component:Card' }) 와 함께 본다.",
    rules: [
      "**Slot 1 — kcal chip**: 식품 칼로리 표시 (예: 109 kcal). Chip tinted brand xs · Body 4. base variant 의 padding 안쪽, Title 직후 또는 Metadata 라인 인라인.",
      "**Slot 2 — star rating + review count**: ★ + 평점 + (리뷰 N개). Metadata 라인 좌측. 리뷰 없는 카드는 '리뷰 없음' 으로 fallback (mute color).",
      "**Slot 3 — promotion badge**: top-right absolute (Card.Root 기준). 리뷰가 없는 카드에만 노출. 같은 그리드 안에서 promotion + review 동시 노출 금지.",
      "**Slot 4 — nutrition tag chip row**: 0-3개 chip (고단백/저탄수/저지방/고나트륨/고식이섬유/저당 등). chip/nutrition/* 토큰 (success/info/warning/critical 톤). 위치는 Title 위 또는 Description 직후. 4개 이상 노출 금지.",
      "**Slot 5 — like overlay**: top-right absolute, Media 슬롯 위 (이미지 over). 'heart 아이콘 + 999+' 형태. Cover variant 의 Media 위에만, Thumb/List 사용 X.",
      "**Slot 6 — author meta**: avatar(xs 20-24) + 작성자 이름 + 작성일. Metadata 라인 또는 Description 하단. 한 카드 최대 1개.",
      "**Slot 7 — discount badge**: 큰 색 강조 칩(30% / 100% / 22%). promotion badge 와 다름 — 가격 정보와 묶여 Metadata 라인에 위치. 색은 sale brand (CashwalkBiz 빨강 / Geniet mint600). 1줄에 1개.",
      "**Slot 8 — strikethrough price + sale price**: 정가(취소선 + mute) + 할인가(Bold + Strong). discount badge 와 같은 라인에 정렬. 가격 표시는 카드당 1쌍.",
      "**Slot 9 — shipping chip**: '무료배송' 같은 정책 라벨. ghost/line variant · neutral color. Metadata 라인 우측 또는 가격 라인 하단.",
      "**Slot 10 — certification chip**: '식약처 인증 제품' 같은 신뢰성 라벨. success/info color · ghost variant · check icon prefix. Status 슬롯 또는 Metadata 라인 하단.",
      "**Slot 11 — ranking leading**: 1/2/3 등은 gold/silver/bronze medal 아이콘, 4+ 는 큰 숫자 + neutral subtle bg. Leading 슬롯 (List variant 의 좌측). 트렌딩/랭킹 카드 전용.",
      "**Slot 12 — macro nutrition bar**: 탄/단/지 비율 가로 progress bar (3색 분할: 탄=brand info, 단=brand success, 지=brand caution). 라벨은 % 와 함께. Cover/Thumb 의 Description 하단 또는 Footer.",
      "**Slot 13 — category banner header**: Card 상단 4px 색 라인 + 카테고리 라벨 (다이어트/혈당/저당 등). 같은 그리드 안에서 카테고리별로 색이 다름 (info/caution/critical). Cover/Thumb 의 Media 위 또는 별도 헤더 라인.",
      "**Slot 14 — friend social proof**: avatar(xs) + 'N명이 먹어봤어요' 같은 카운트 라벨. Footer 슬롯 또는 Description 하단. 신뢰감/추천 의도 카드에만.",
      "**Slot 15 — trending count**: '최근 7일간 100만+' 같은 시계열 활동 카운트. Caption · Strong. Metadata 라인 하단. 랭킹 카드의 핵심 정보로 사용.",
      "**Slot 16 — forum meta row**: 조회 N · 댓글 N · 시간 (' · ' 구분자). Caption · Mute. 커뮤니티/게시글 카드의 Metadata 라인 전용.",
      "**조합 규칙**: 한 카드의 Composition slot 총합 최대 4개. 5개 이상은 위계 무너짐 → base variant 자체를 바꾸거나 정보 우선순위 재고.",
      "**한 그리드 룰**: 한 그리드(예: 4-up Cover) 안의 모든 카드는 같은 Composition 슬롯 조합을 사용. 일부만 슬롯이 다른 카드는 위반 (정보 누락처럼 보임). 슬롯이 비면 visually hidden 으로 자리만 유지.",
    ],
    avoid: [
      "Composition 슬롯 추가를 이유로 새 variant 생성 — variant 는 항상 3종(List/Thumb/Cover) 유지, 도메인 차이는 슬롯 조합으로",
      "Slot 5(like) + Slot 3(promotion) 동시 노출 — 둘 다 top-right absolute 라 겹침",
      "Slot 4(nutrition tag) 4개 이상 — 위계 붕괴",
      "Slot 8(price) strikethrough 없이 sale price 만 — 할인 컨텍스트 누락",
      "Slot 11(ranking leading) 을 1-3 medal 없이 number 로만 표시 — 시각 위계가 안 잡힘",
      "한 그리드에서 카드마다 다른 Composition 조합 사용 — 정보 누락처럼 보이는 안티패턴",
      "Composition 슬롯 안에 별도 CTA 버튼 두기 — Card.Root clickable 만 사용",
      "promotion badge 위치를 top-right 외에 두기 — 절대 위치 규칙 위반",
      "Slot 13(category banner)을 같은 카테고리 카드에 다른 색으로 적용 — 의미 매핑이 일관되지 않음",
    ],
    metrics: {
      maxSlotsPerCard: 4,
      maxNutritionTagChipsInSlot4: 3,
      maxLikeOverlayPerCard: 1,
      maxAuthorMetaPerCard: 1,
      maxPricePairPerCard: 1,
      promotionBadgePosition: "top-right absolute (Card.Root)",
      likeOverlayPosition: "top-right absolute (Media slot, image overlay)",
      rankingLeadingMedalRange: "1-3 (gold/silver/bronze) · 4+ (number + neutral subtle bg)",
      macroBarColors: "탄=info · 단=success · 지=caution",
      figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=131-1769",
    },
  },

  "card-section": {
    name: "card-section",
    summary:
      "Section/Group Card 패턴 — 카드 안에 list rows 를 담는 컨테이너 카드. " +
      "단일 Card 가 아니라 '관련 row 묶음 + 섹션 제목 + 페이지네이션' 을 한 번에 포장하는 구조. " +
      "Figma 출처: Zenirit Card 가이드의 'Background+Border+Shadow' 명세 (예: '루테인 포함 영양제 · 총 84개 제품').",
    rules: [
      "**구조**: 외곽 컨테이너(border 1px + radius 12-16 + bg surface) → 헤더(섹션 타이틀 + 보조 정보, 예: '총 84개 제품') → 내부 row 리스트(보통 Thumb variant ListItem 5-6개) → 페이지네이션 (선택).",
      "**컨테이너 vs 단일 Card**: Section Card 는 Card 가 아니라 'Card-of-Cards' 컨테이너. variant prop 으로 표현하지 말고, 별도 `<Card.Root variant='section'>` 또는 `<Section bordered>` 형태로 분리.",
      "**내부 row 제약**: 내부에 들어가는 row 는 Thumb variant 의 단순 형태만 (썸네일 + Title + Meta). 다른 variant 혼용 금지.",
      "**Composition 제약**: Section Card 안의 row 는 Composition 슬롯을 4개 모두 사용하지 않음. Title + Star rating + Review count 정도까지만. 위계 충돌 방지.",
      "**헤더 라인**: 섹션 타이틀(H4 Bold) + 보조 정보(Caption Regular Muted, 우측 정렬). 헤더 line-height 24px 고정.",
      "**페이지네이션**: 6개 이상이면 하단 페이지네이션 추가. 6개 이하면 페이지네이션 없이 그대로.",
      "**중첩 금지**: Section Card 안에 또 다른 Section Card 금지. 카테고리 그룹이 필요하면 Section Card 를 형제 노드로 나란히 둠.",
      "**Card 가이드 권위 룰과 정합**: Card 단일 가이드의 'Nested Card 금지' 룰을 Section 컨테이너만 예외 — Section 은 row 를 담는 컨테이너지 row 자체가 Card 가 아님 (그래서 위반 아님).",
    ],
    avoid: [
      "Section Card 안에 또 다른 Section Card (3중 중첩)",
      "내부 row 마다 elevation/border 추가 — Section 컨테이너가 이미 경계 표시",
      "내부에 List/Cover variant row 혼합 — Thumb only",
      "Section 헤더에 CTA 버튼 추가 — '더보기' 가 필요하면 페이지네이션 또는 별도 하단 TextButton",
      "내부 row 가 1-2개뿐인 Section Card — 컨테이너 의미 없음, 직접 row 노출",
      "단일 1회성 메시지 그룹을 Section Card 로 포장 — Banner/Notice 가 적절",
    ],
    metrics: {
      containerBorder: "1px (semantic-border-normal-default)",
      containerRadius: "12-16px (--shape-md / --shape-lg)",
      containerBgToken: "var(--semantic-bg-surface-default)",
      headerTitleType: "H4 Bold (또는 Body 1 Bold)",
      headerSubType: "Caption Regular Muted (우측 정렬)",
      innerRowVariant: "thumb only",
      innerRowMaxCount: "10 (이상은 페이지네이션 필수)",
      paginationThreshold: 6,
      maxNestingLevel: 1,
      figmaNodeUrl: "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1506",
    },
  },
  "admin-shell": {
    name: "admin-shell",
    summary:
      "어드민/CMS/대시보드 페이지의 **shell + section + form-row** 보일러플레이트. " +
      "@nudge-design/styles 의 nds-shell / nds-section / nds-form-row 클래스를 의무 사용. " +
      "raw <style> 블록으로 .page / .topbar / .section / .form-row 를 재정의하면 토큰 drift · 브랜드 스왑 실패 · 일관성 붕괴를 유발. " +
      "사용자 mock-test 기준 페이지당 200-600 줄 CSS 가 사라지는 영역.",
    rules: [
      '**Setup 의무**: `import "@nudge-design/styles/styles.css";` 한 줄로 nds-shell 계열 클래스가 자동 활성화. tokens.css / html/styles.css 와 함께 import. 별도 install 불필요.',
      '**Page shell** (sidebar + main + topbar + content): `<div class="nds-shell"><aside class="nds-shell__sidebar"><nds-sidebar />...</aside><main class="nds-shell__main"><header class="nds-shell__topbar">...</header><div class="nds-shell__content">...</div></main></div>`. raw `<div class="page">` + grid CSS 직접 작성 **금지**.',
      '**Topbar**: `<header class="nds-shell__topbar">` 안에 `<div class="nds-shell__topbar-title-group"><h1 class="nds-shell__topbar-title">제목</h1><p class="nds-shell__topbar-subtitle">부제</p></div>` + `<div class="nds-shell__topbar-actions">...</div>`. sticky/border-bottom/padding 직접 작성 **금지** — 클래스가 처리.',
      '**Section card** (본문 안 흰 박스): `<section class="nds-section">` + 헤더 `<header class="nds-section__head"><h2 class="nds-section__title">...</h2><p class="nds-section__caption">...</p></header>` + 본문 `<div class="nds-section__body">...</div>`. raw `.section { background: ...; border: 1px solid ...; border-radius: 12px; }` 작성 **금지**.',
      '**Section 자식 간격** 자동: `<section class="nds-section nds-section--stack">` 모디파이어를 쓰면 직계 자식 사이 20px 간격이 margin-top 으로 자동 부여. `> * + * { margin-top: }` 직접 작성 **금지**.',
      '**Form row** (라벨 + 컨트롤 grid): `<div class="nds-form-row"><label class="nds-form-row__label">필드명<span class="nds-form-row__label-required">*</span></label><div class="nds-form-row__control"><nds-input />...<p class="nds-form-row__hint">힌트</p></div></div>`. raw `.form-row { display: grid; grid-template-columns: 140px 1fr; }` **금지**.',
      '**Content 우측 aside**: `<div class="nds-shell__content">` 가 기본 main + 320px aside 2-컬럼. aside 가 없을 때만 `<div class="nds-shell__content nds-shell__content--single">` 또는 `data-aside="false"` 로 단일 컬럼. raw grid-template-columns 직접 작성 **금지**.',
      "**커스터마이즈**: 폭/패딩만 바꾸려면 CSS 변수만 override — `--nds-shell-sidebar-width` / `--nds-shell-topbar-padding` / `--nds-shell-content-padding` / `--nds-shell-aside-width` / `--nds-section-radius` / `--nds-section-head-padding` / `--nds-section-body-padding` / `--nds-form-row-label-width` / `--nds-form-row-gap`. **클래스 자체를 :where 밖에서 재정의하지 말 것**.",
      "**브랜드 토큰만 사용**: 색/보더/배경은 nds-shell 계열이 이미 `--semantic-bg-surface-default` / `--semantic-border-normal-default` / `--semantic-text-strong-default` 등을 참조. raw hex 또는 `var(--semantic-*)` 인라인 override 금지 — 브랜드 스왑 시 깨짐.",
      "**Aside / sticky** 가 자체 white card 가 필요하면 → `<nds-section>` 으로 감싸기. 별도 `.aside { background: ...; border: 1px solid ...; border-radius: ...; padding: 24px; }` 를 새로 정의 금지 (nds-section 의 의도된 중복).",
      "**Validator 강제**: html-validator 가 `<style>` 블록의 raw shell 패턴을 `raw-shell-pattern: error` 로 차단. 의도된 예외(예: 마케팅 랜딩의 hero 등 admin shell 이 아닌 layout) 만 별도 클래스명 (`.lp-hero` 등 nds- 접두 회피) + 인라인 토큰 사용으로 우회.",
      '**사이드바 아이콘 = inline SVG (이름 아님)**: `<nds-sidebar items=\'[...]\'>` 의 각 item `icon` 필드는 **innerHTML 로 주입되는 raw SVG 마크업**이다. `"icon":"CashwalkBizGnbBannerIcon"` 처럼 **아이콘 이름/컴포넌트명을 넣으면 그대로 텍스트로 렌더**된다(라벨 옆에 글자로 흘러나옴). 올바른 절차: `find_icon({ name })` → 반환된 inline SVG 문자열을 `icon` 에 넣는다. `icon` 은 React `<Sidebar>` 의 `icon?: ReactNode` 와 대칭 — HTML 은 SVG 문자열, React 는 엘리먼트. **HTML 목업이라 사이드바가 라벨 전용이라는 건 사실이 아니다**(런타임 한계 아님). `items` 는 JSON 속성이므로 SVG 안의 `"` 는 `\\"` 로 이스케이프할 것.',
    ],
    avoid: [
      '`<style>` 안에 `.page { display: grid; grid-template-columns: 240px 1fr }` 직접 정의 — `class="nds-shell"` 사용',
      '`<style>` 안에 `.section { background: ...; border: 1px solid ...; border-radius: 12px }` 정의 — `class="nds-section"` 사용',
      '`<style>` 안에 `.topbar { position: sticky; top: 0; }` 정의 — `class="nds-shell__topbar"` 사용',
      '`<style>` 안에 `.form-row { display: grid; grid-template-columns: 140px 1fr }` 정의 — `class="nds-form-row"` 사용',
      "nds-section 안에 다시 `.aside { ... border-radius: ... }` 별도 카드 정의 — nds-section 한 번 더 중첩이 올바름",
      "nds-shell__content 의 grid-template-columns 를 인라인 style 또는 새 클래스로 덮어쓰기 — `--nds-shell-aside-width` CSS 변수만 사용",
      "nds-form-row__label 폰트/색을 다시 정의 — semantic 토큰 의도 깨짐. 폭만 바꾸려면 `--nds-form-row-label-width`",
      "어드민 페이지 1개 안에서 nds-shell 클래스 + raw shell CSS 혼용 (drift 보장)",
      "raw `<header>` / `<main>` / `<aside>` 만 사용하고 nds-shell 클래스 미부여 — landmark 의미는 그대로 두되 클래스로 visual contract 보장",
      'nds-sidebar item `icon` 에 아이콘 이름(`"CashwalkBizGnbBannerIcon"`)을 넣기 — innerHTML 이라 텍스트로 흘러나옴. find_icon 의 inline SVG 문자열을 넣을 것',
      "아이콘이 안 박힌다고 사이드바를 라벨 전용으로 두고 'HTML 런타임 한계'로 결론내리기 — icon=inline SVG 로 정상 렌더됨",
    ],
    metrics: {
      requiredImport: "@nudge-design/styles/styles.css",
      pageShellClass: "nds-shell",
      sidebarClass: "nds-shell__sidebar",
      sidebarIcon:
        'nds-sidebar item.icon = inline SVG (find_icon 결과 주입, 이름 아님 — innerHTML) · React Sidebar 는 icon?:ReactNode 로 대칭 · JSON 속성이라 SVG의 " 는 이스케이프',
      mainClass: "nds-shell__main",
      topbarClass: "nds-shell__topbar (+ -title-group / -title / -subtitle / -actions)",
      tabsClass: "nds-shell__tabs",
      contentClass: "nds-shell__content (+ --single)",
      sectionClass: "nds-section (+ --stack)",
      sectionSlots: "nds-section__head / __title / __caption / __body",
      formRowClass: "nds-form-row",
      formRowSlots: "nds-form-row__label / __label-required / __control / __hint",
      defaultSidebarWidth: "240px (--nds-shell-sidebar-width)",
      defaultAsideWidth: "320px (--nds-shell-aside-width)",
      defaultSectionRadius: "12px (--nds-section-radius)",
      defaultFormRowLabelWidth: "140px (--nds-form-row-label-width)",
      enforcementRule:
        "raw-shell-pattern (error) — <style> 안 raw .page / .topbar / .section / .form-row 정의 차단",
    },
  },
  "ui-direction-proposal": {
    name: "ui-direction-proposal",
    summary:
      "기획서가 화면 구조를 명확히 정하지 않은 경우, 코드 작성 전에 같은 기획서 안의 UI/UX 설계 방향 2-3개를 제안하고 사용자 선택을 받는 패턴.",
    rules: [
      "항상 A/B/C 를 묻지 않는다. PRD 에 첫 화면 강조점, 정보 우선순위, CTA 전략, 핵심 흐름, 레퍼런스 의도가 명확하면 방향 제안 없이 그대로 진행한다.",
      "PRD 가 기능/데이터 목록 중심이고 화면 안의 구성 전략이 불명확하면, 코드 작성 전에 2-3개 방향을 제안하고 사용자 선택을 기다린다.",
      "방향 제안은 '예약/결제/온보딩/목록' 같은 화면 유형 재분류가 아니다. 이미 정해진 화면 안에서 정보 위계, 사용자 흐름, CTA 배치, 불안/망설임 해소 방식이 어떻게 달라지는지 비교한다.",
      "각 방향은 이 기획서의 도메인 단어를 써서 구체적인 이름을 붙인다. 범용 이름(빠른 실행 중심, 탐색 중심, 신뢰 중심)만 쓰지 않는다.",
      "각 방향은 첫 화면에서 가장 먼저 보이는 것, 핵심 흐름, CTA 전략, 장점, 리스크, 추천 조건을 포함한다.",
      "사용자가 방향을 선택하면 brief.md 또는 작업 메모리에 Selected UI Direction 을 남기고, 이후 구현은 그 방향을 기준으로 고정한다.",
      "시각 레퍼런스 게이트가 더 우선이다. references.md 가 없으면 방향 제안은 가능하지만 index.html 작성/빌드는 Figma 또는 스크린샷 레퍼런스를 받은 뒤 진행한다.",
    ],
    ruleGroups: [
      {
        heading: "방향 제안 없이 진행해도 되는 경우",
        items: [
          "첫 화면에서 무엇을 강조할지 명시됨",
          "CTA 위치/역할이 명시됨",
          "사용 흐름이 단계별로 명시됨",
          "정보 우선순위가 있음",
          "참고 화면에서 무엇을 따라야 하는지 명확함",
        ],
      },
      {
        heading: "방향 제안을 먼저 해야 하는 경우",
        items: [
          "기능/데이터 목록만 있음",
          "'깔끔하게', '보기 좋게' 같은 추상 표현이 많음",
          "CTA 또는 정보 우선순위가 없음",
          "같은 목적을 여러 정보 구조로 풀 수 있음",
          "레퍼런스는 있지만 무엇을 따라야 하는지 불명확함",
        ],
      },
      {
        heading: "제안 포맷",
        items: [
          "방향명: 이 화면에 맞춘 구체적 이름",
          "첫 화면에서 가장 먼저 보이는 것",
          "핵심 흐름",
          "CTA 배치 방식",
          "장점",
          "리스크",
          "추천 조건",
        ],
      },
    ],
    examples: [
      {
        verdict: "good",
        source: "상담사 예약 화면 PRD",
        caption:
          "A 가능 시간 먼저 선택(시간 선택→상담사 확인→하단 CTA) / B 상담사 신뢰 먼저 형성(프로필·후기→가능 시간→CTA)처럼 같은 예약 화면 안의 정보 위계와 CTA 전략을 비교.",
      },
      {
        verdict: "bad",
        source: "범용 A/B/C 제안",
        caption:
          "빠른 실행 중심 / 비교·탐색 중심 / 신뢰·안내 중심처럼 화면 유형을 다시 분류하는 수준이면 PRD 맥락을 충분히 반영하지 못함.",
      },
    ],
    avoid: [
      "PRD 가 이미 충분히 명확한데도 매번 방향 선택을 강제",
      "화면 유형을 다시 분류하는 수준의 제안",
      "A/B/C 이름만 다르고 정보 위계와 CTA 전략이 같은 제안",
      "방향을 제안해 놓고 사용자의 선택 없이 임의로 구현",
      "시각 레퍼런스가 없는 상태에서 방향 선택만으로 구현/빌드 진행",
    ],
  },

  "design-spec": {
    name: "design-spec",
    summary:
      "prompt → **DesignSpec(JSON)** → code 의 경량 중간표현. 복잡/다단계 화면이거나 사용자와 구성 합의가 필요할 때, HTML 작성 전에 save_design_spec 으로 의도 스펙을 만들고 ok:true + 사용자 동의 후 build_singlefile_html 로 진행(soft 승인 게이트). 추적성·정밀편집·코드前 검증을 얻는다.",
    rules: [
      "언제 쓰나: 다화면/복잡 플로우, 컴포넌트 선택이 모호, 또는 사용자가 화면 구성에 합의하고 싶을 때. 단순 단일 화면이면 생략하고 바로 HTML 로 가도 된다(과한 절차 강제 금지).",
      "⛔ 예외 — 캐포비(cashwalk-biz) 어드민 화면은 복잡도와 무관하게 save_design_spec 필수(생략 금지): validate 가 5종 Page Pattern(screen.surfaceKind:'admin' + screen.pagePattern, Onboarding/Dashboard/List/Detail/Form) 선언을 hard error 로 강제하므로, spec 을 건너뛰면 화면-분류 게이트도 통째로 건너뛰어 어드민 일관성이 깨진다. 코드 전에 먼저 분류: get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }).",
      "스펙은 '의도'만 담는다: 컴포넌트 트리(시멘틱 이름), 참조할 시멘틱 토큰 '이름', brand/surface, 그리고 결정 근거(rationale). 좌표·resolved 색·px·이미지 바이트는 담지 않는다 — 그건 코드→Figma scene.json(역방향 추출) 담당이다.",
      "토큰은 시멘틱 only: tokens[] 에는 '--semantic-*' 같은 토큰 이름만. raw hex/rgb 금지(raw-hex-token error). raw 팔레트(--color-blue-500 등)는 warn — --semantic-* 우선.",
      "save_design_spec 은 카탈로그 기준으로 자동 검증한다(브랜드 실재·토큰 존재·prop enum·컴포넌트 존재). ok:false 면 violations 를 고쳐 재저장한 뒤, ok:true 가 되어야 빌드로 넘어간다(validate-before-code).",
      "저장한 스펙을 사용자에게 한 번 보여주고 동의를 받은 뒤 build_singlefile_html 로 HTML 을 만든다(soft gate). 스펙과 다른 화면을 임의로 만들지 않는다.",
      "component 는 PascalCase('Button') 또는 nds-tag('nds-button') 둘 다 허용 — scene.ts(코드→Figma)의 ndsTagToComponentName 어휘를 공유하므로, 정방향 스펙과 역방향 scene 을 컴포넌트 정체성으로 JOIN 할 수 있다.",
      "ui-direction-proposal 로 방향이 정해졌으면 그 방향을 DesignSpec 으로 구체화한다(두 패턴은 상호 보완 — 방향 합의 → 스펙 고정 → 빌드).",
      "시각 레퍼런스 게이트가 더 우선이다. references.md(Figma/스크린샷)가 없으면 스펙은 만들 수 있어도 build 는 레퍼런스를 받은 뒤 진행한다.",
      "결정 로그: save_design_spec 은 design-spec.json(매번 덮어씀) 옆에 decisions/rationale 을 designDecisions.jsonl 로 한 줄씩 누적한다(화면별 dedup, 최근 N행 상한). 결정 이력/메모리 소스이며, 소비 프로젝트에서는 gitignore 권장.",
    ],
    metrics: {
      file: "design-spec.json",
      decisionLog: "designDecisions.jsonl",
      blocksCode: false,
      semanticTokensOnly: true,
    },
    examples: [
      {
        verdict: "good",
        source:
          '{ "screen": { "brand": "geniet", "surface": "app", "intent": "리뷰 상세 — 평점·본문·도움돼요" }, "tree": [ { "component": "Card", "role": "리뷰 본문", "tokens": ["--semantic-bg-default","--semantic-text-default"], "children": [ { "component": "Button", "role": "primary CTA", "props": { "color": "secondary" }, "rationale": "Geniet secondary = dark inverse" } ] } ], "decisions": ["primary CTA 1개만", "raw hex 없음 — 전부 --semantic-*"] }',
        caption:
          "의도·컴포넌트·시멘틱 토큰 이름·근거만. 좌표/색값/px 없음. component 는 DS 이름 또는 nds-tag.",
      },
      {
        verdict: "bad",
        source:
          '{ "tree": [ { "component": "Button", "props": { "background": "#1A1A1A" }, "x": 24, "y": 600 } ] }',
        caption:
          "좌표(x/y)·raw hex 를 스펙에 넣으면 scene.json 열화판이 된다. screen(brand/surface/intent)·근거 누락. → raw-hex-prop error.",
      },
    ],
    avoid: [
      "단순 단일 화면에도 매번 스펙을 강제(과한 절차)",
      "스펙에 좌표·resolved 색·px·이미지를 담기(그건 scene.json 몫)",
      "tokens 에 raw hex/rgb 또는 카탈로그에 없는 토큰 이름",
      "save_design_spec 이 ok:false 인데 그대로 build 로 진행",
      "스펙만 만들고 사용자 동의 없이 빌드 / 스펙과 다른 HTML 작성",
      "캐포비(cashwalk-biz) 어드민인데 save_design_spec 을 생략하고 바로 HTML — 5종 Page Pattern 분류 게이트를 우회하게 됨",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // 캐시워크 포 비즈니스 어드민 Page Pattern System (골격 — Figma 실측 대기)
  //
  // 캐포비 어드민 화면은 등록/수정/목록/상세/통계 안에서 반복된다. 개별 컴포넌트를
  // 계속 추가하는 대신 "페이지 패턴 → 섹션 → 조립 규칙" 을 먼저 정의하고 그 위에
  // 컴포넌트를 끼우는 방식. 5개 패턴(Onboarding / Dashboard / List / Detail / Form)
  // 으로 표준화.  Figma 파일 7dCJU5lNPfgcAjFPwbbLIu (🗄️ 캐포비 - Library → 📐 Page
  // Pattern), 각 패턴은 docs 노드 + pattern 노드 한 쌍.
  //
  // ⚠️ 아래 5개는 **골격** 이다. rules/metrics 의 정확한 px·색·간격은 Figma 노드
  //    실측으로 채워야 한다(순차 업데이트 2단계). 현재 rules 는 Slack 정리본의 구성
  //    슬롯 수준만 담는다. 채우기 전까지 metrics.status = "skeleton".
  // ───────────────────────────────────────────────────────────────────────
  // ───────────────────────────────────────────────────────────────────────
  // 캐포비 어드민 사이드바(LNB) ready-made 픽업 — 메뉴 트리 SSOT + 복붙 예시.
  //   회고: Sidebar 컴포넌트는 완성됐지만 BrandHeader/Footer 처럼 "한 줄 픽업" 이 없어
  //   매번 items 를 산문 가이드 보고 재조립 → 결과가 들쭉날쭉. 여기서 정규 메뉴 구조 +
  //   복붙 가능한 React/HTML 예시(아이콘 inline)를 단일 주소로 제공. (라벨/구조는 오버레이
  //   기반 best-effort — Figma 3304:617 미검증. 실제 메뉴가 확정되면 생성 스크립트 재실행.)
  // ───────────────────────────────────────────────────────────────────────
  "cashwalk-biz-admin-sidebar": {
    name: "cashwalk-biz-admin-sidebar",
    summary:
      "**[캐포비 어드민 사이드바 ready-made]** cashwalk-biz admin LNB 를 한 번에 픽업하는 SSOT. " +
      "`<Sidebar>`(React) / `<nds-sidebar>`(HTML) 컴포넌트는 완성돼 있지만 BrandHeader/Footer 와 달리 메뉴 데이터가 안 박혀 있어 매번 손조립하던 마찰을 해소한다. " +
      "헤더 블록(로고→계정→잔액→충전/내역 CTA) + 3섹션(광고 관리 / 자산 관리 / 계정 관리) + GNB 아이콘 9종이 들어간 메뉴 트리를 그대로 복붙. " +
      "활성 bg(Yellow/100)·radius(16)·텍스트색은 `data-brand='cashwalk-biz'` cascade 로 자동 — 색 hex 박지 말 것. 컴포넌트 props 함정은 `get_guide({ topic:'component:Sidebar', brand:'cashwalk-biz' })`, shell 조립은 `pattern:admin-shell`.",
    rules: [
      "**먼저 이 패턴으로 사이드바를 픽업한다**: 캐포비 어드민 화면(`pattern:cashwalk-biz-page-{dashboard,list,detail,form}` 의 '01 Sidebar')은 사이드바 items 를 새로 발명하지 말고 아래 ready-made 트리를 복붙해 시작한다. 화면별로 `activeKey` 만 바꾸면 LNB 가 동일하게 유지된다(목록/상세/대시보드/폼 공통).",
      "**React 복붙** (아이콘 = 컴포넌트 엘리먼트, find_icon 불필요):\n```tsx\n" +
        CASHWALK_BIZ_ADMIN_SIDEBAR_REACT +
        "\n```",
      "**HTML 복붙** (item.icon = inline SVG 가 이미 박혀 있음 — find_icon 9회 호출 불필요):\n```html\n" +
        CASHWALK_BIZ_ADMIN_SIDEBAR_HTML +
        "\n```",
      "**섹션 그룹은 SidebarSection[]**: items 를 flat 배열 + 빈 spacer 로 만들지 말고 `{ key, label, items: [...] }` 섹션 객체로 그룹핑(광고 관리 / 자산 관리 / 계정 관리). 라벨이 섹션 헤더로 렌더된다.",
      "**서브메뉴는 1단계까지**: '배너'처럼 children(등록/목록/리포트)을 갖는 항목만 캐럿 노출. children 안에 또 children = 금지(2단계 이상 트리 금지).",
      "**활성 표현은 면(bg)만**: 좌측 accent stripe·Bold 라벨·진한 노랑(Yellow/200) 금지. 활성 여부는 `activeKey` 로만 결정(item 에 isActive boolean 박지 말 것).",
      "**헤더 블록은 메뉴와 분리**: 로고→계정 이메일→잔액(충전 금액)→충전하기(solid)/내역보기(outlined) 2-up CTA 는 사이드바 상단 고정 블록. 잔액/충전을 메뉴 item 으로 섞지 말 것. (React 는 `header` prop, HTML 은 사이드바 상단 slot 으로 구성.)",
      "**아이콘은 brand-prefix 우선**: 메뉴 아이콘은 `CashwalkBizGnb*` 9종이 공용 아이콘보다 우선. import 목록: " +
        CASHWALK_BIZ_ADMIN_SIDEBAR_ICON_IMPORTS.join(", ") +
        ".",
      "**로고는 base64 data URI 인라인 (상대경로 금지)**: 위 HTML 예시의 `logo-src` 는 이미 `data:image/svg+xml;base64,…`(BrandHeader 와 동일 로고 SSOT)로 박혀 있어 그대로 쓰면 단일 HTML 에서도 안 깨진다. `/brand-logos/cashwalk-biz.svg` 같은 **상대경로는 build_singlefile_html 이 broken image 로 처리**(단일 파일에서 깨짐)하므로 금지. React 앱은 자산을 번들하므로 public 경로로 충분.",
    ],
    avoid: [
      "사이드바 items 를 화면마다 새로 발명 — 이 ready-made 트리를 복붙하고 activeKey 만 변경",
      "HTML 에서 item.icon 에 아이콘 이름('CashwalkBizGnbBannerIcon')을 넣기 — innerHTML 이라 텍스트로 흘러나옴. 위 예시는 inline SVG 가 이미 박혀 있으니 그대로 사용",
      "활성 아이템에 좌측 세로 accent bar / Bold 라벨 / Yellow/200 진한 노랑",
      "잔액·충전 CTA 를 메뉴 리스트에 섞기 (헤더 블록 고정)",
      "children 2단계 이상 트리화",
      "활성 bg·radius·텍스트색을 inline/hex 로 다시 박기 — data-brand cascade 가 처리",
    ],
    metrics: {
      status: "ready-made (메뉴 라벨/구조는 오버레이 기반 best-effort — Figma 3304:617 미검증)",
      sectionCount: 3,
      sections: "광고 관리 / 자산 관리 / 계정 관리",
      width: "300px (캐포비 admin 기준)",
      gnbIcons: CASHWALK_BIZ_ADMIN_SIDEBAR_ICON_IMPORTS.join(", "),
      iconPickup:
        "HTML 예시는 SVG 인라인 완료 — find_icon 반복 불필요 / React 는 아이콘 컴포넌트 직접 import",
      relatedGuides:
        "component:Sidebar (props 함정), admin-shell (shell 조립), cashwalk-biz-page-{dashboard,list,detail,form}",
    },
    references: [
      {
        label: "캐포비 Library Sidebar (메뉴 구조 SSOT)",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3304-617",
        brand: "cashwalk-biz",
      },
      {
        label: "캐포비 사이드바 레퍼런스 스크린샷",
        image: "references/cashwalk-biz-sidebar-168-1250.png",
        brand: "cashwalk-biz",
      },
    ],
  },
  "cashwalk-biz-page-patterns": {
    name: "cashwalk-biz-page-patterns",
    summary:
      "**[Page Pattern System 오버뷰]** 캐시워크 포 비즈니스 어드민 화면을 5개 페이지 패턴으로 표준화 — Onboarding / Dashboard / List / Detail / Form. " +
      "개별 컴포넌트부터 쌓지 말고 'PRD → 페이지 패턴 매핑 → 섹션 구조화 → 패턴 내 반복 컴포넌트 조립' 순서로 화면을 만든다. " +
      "패턴별 상세는 `pattern:cashwalk-biz-page-{onboarding|dashboard|list|detail|form}`. 필드/CTA/입력 단위 실측은 `pattern:cashwalk-biz-form-layout` · `pattern:cashwalk-biz-button` · `pattern:cashwalk-biz-input`, shell 보일러플레이트는 `pattern:admin-shell`. " +
      "Figma 7dCJU5lNPfgcAjFPwbbLIu (📐 Page Pattern).",
    rules: [
      "**먼저 패턴을 고른다 (하드 게이트)**: 새 어드민 화면을 받으면 PRD 의 목적을 5개 패턴 중 하나로 먼저 분류한다 — 로그인/계정복구=Onboarding, 통계/요약 홈=Dashboard, 목록·검색=List, 단건 상세/탭=Detail, 등록·수정=Form. 분류 없이 컴포넌트부터 배치하지 않는다. **이건 권고가 아니라 강제다** — surface=admin + brand=cashwalk-biz 화면은 패턴 선언이 없으면 validate 가 error(`cashwalk-biz-admin-page-pattern`)로 막는다.",
      '**패턴 선언 방법**: HTML 목업은 루트에 `data-page-pattern` 마커 — 예: `<html data-brand="cashwalk-biz" data-page-pattern="list">`(또는 body / .mockup-screen). DesignSpec 은 `screen.pagePattern` 필드에 `onboarding|dashboard|list|detail|form` 중 하나. surfaceKind=admin 은 nudge.surface 마커에서 자동 주입되니 보통 pagePattern 만 채우면 된다.',
      "**조립 순서 고정**: ① 페이지 패턴 선택 → ② 패턴의 섹션 슬롯 채우기(섹션 단위 구조화) → ③ 섹션 안 반복 컴포넌트(테이블·필터·필드·차트)를 DS 컴포넌트로 조립 → ④ validate. 역순(컴포넌트 먼저)으로 가면 패턴 일관성이 깨진다.",
      "**shell 은 공통**: 모든 패턴은 사이드바 + topbar + content 의 `admin-shell`(nds-shell 계열) 위에 얹힌다. 패턴은 content 영역의 섹션 구성만 정의한다 — raw shell CSS 재정의 금지(`pattern:admin-shell`).",
      "**한 화면 = 한 패턴**: 한 페이지에 List + Form 을 섞지 않는다. 인라인 등록이 필요하면 List 안의 모달/드로어로 Form 패턴을 띄우되, 패턴 경계는 유지한다.",
      "**필드/버튼/입력 실측은 위임**: 페이지 패턴은 '무엇이 어디에' 까지만 정의. 라벨 컬럼·필드 높이·CTA 알약 같은 px 단위는 `cashwalk-biz-form-layout` / `cashwalk-biz-button` / `cashwalk-biz-input` 가 SSOT.",
    ],
    avoid: [
      "패턴 분류 없이 컴포넌트부터 화면에 배치",
      "한 페이지에 두 패턴(예: 목록 + 등록 폼)을 한 흐름으로 섞기",
      "페이지 패턴 가이드 안에 필드 높이·CTA px 같은 컴포넌트 단위 실측을 중복 정의 (cashwalk-biz-* 컴포넌트 가이드가 SSOT)",
      'admin-shell 대신 raw <div class="page"> + grid CSS 로 shell 직접 작성',
    ],
    metrics: {
      status: "skeleton — Figma 실측 대기",
      patternCount: 5,
      patterns: "onboarding / dashboard / list / detail / form",
      figmaFile: "7dCJU5lNPfgcAjFPwbbLIu (📐 Page Pattern)",
      assemblyOrder: "① 패턴 선택 → ② 섹션 구조화 → ③ 컴포넌트 조립 → ④ validate",
      relatedPatterns:
        "cashwalk-biz-page-{onboarding,dashboard,list,detail,form}, admin-shell, cashwalk-biz-form-layout, cashwalk-biz-button, cashwalk-biz-input",
    },
    references: [
      {
        label: "Onboarding docs",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-792",
        brand: "cashwalk-biz",
      },
      {
        label: "Onboarding pattern",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2",
        brand: "cashwalk-biz",
      },
      {
        label: "Dashboard docs",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-855",
        brand: "cashwalk-biz",
      },
      {
        label: "Dashboard pattern",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9",
        brand: "cashwalk-biz",
      },
      {
        label: "List docs",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-915",
        brand: "cashwalk-biz",
      },
      {
        label: "List pattern",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234",
        brand: "cashwalk-biz",
      },
      {
        label: "Detail docs",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-978",
        brand: "cashwalk-biz",
      },
      {
        label: "Detail pattern",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367",
        brand: "cashwalk-biz",
      },
      {
        label: "Form docs",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-1041",
        brand: "cashwalk-biz",
      },
      {
        label: "Form pattern",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522",
        brand: "cashwalk-biz",
      },
    ],
  },
  "cashwalk-biz-page-onboarding": {
    name: "cashwalk-biz-page-onboarding",
    summary:
      "캐시워크 포 비즈니스 어드민 **Onboarding 패턴** — 로그인 · 아이디 찾기 · 비밀번호 찾기 등 인증 진입 화면. shell(사이드바/네비) 없이 탈색 회색 캔버스 중앙에 480px 고정 카드 1개. " +
      "구성: 01 Logo → 02 Form → 03 Primary CTA → 04 Helper. 오버뷰 `pattern:cashwalk-biz-page-patterns`. CTA/입력 실측은 `pattern:cashwalk-biz-button` · `pattern:cashwalk-biz-input`. Figma docs 3626-792 / pattern 3611-2 실측 반영.",
    rules: [
      "**언제 쓰나**: PRD 에 '로그인 / 회원가입 / 비밀번호 찾기 / 이메일 인증 / 가입 완료' 키워드가 있고, 사이드바·네비게이션 없이 단독 흐름으로 진행되며, 단일 목적 + 단일 폼 + 단일 CTA 로 구성되는 화면.",
      "**중앙 카드 1개 (shell 없음)**: 비로그인 상태라 admin-shell(사이드바/topbar) 미적용. 캔버스 배경 = `--semantic-bg-surface-subtle`(#FAFAFA 탈색 회색), 그 위에 카드를 **수직+수평 중앙** 정렬.",
      "**카드 규격**: 폭 **480px 고정**, padding **48px**, 배경 `--semantic-bg-surface-default`(#FFFFFF), radius **16px**. 카드 내부 큰 단위 그룹(로고/폼/CTA/헬퍼) 간 간격 **40px**(itemSpacing).",
      "**01 Logo**: 카드 상단 중앙 정렬. 캐포비 로고 컴포넌트 사용(직접 SVG 조립 X). 찾기 화면은 로고 아래 안내문(예: '캐시워크 for 비즈니스 계정의 아이디를 찾을 방법을 선택해 주세요.')을 둔다.",
      "**02 Form**: 로그인 화면은 **TextInput**(ID + Password, Password 는 eye 토글). 아이디/비밀번호 찾기 화면은 **RadioGroup**(찾기 방법 선택 — 전화/이메일). 입력 단위 스타일은 `pattern:cashwalk-biz-input`.",
      "**03 Primary CTA**: Button **Solid / Primary / X-Large**, 가로 **FILL**(카드 폭 가득). 캐포비 brand yellow(#FFD200) + 검정 텍스트. 화면당 primary CTA 1개(`pattern:cashwalk-biz-button`).",
      "**04 Helper**: 보조 링크는 **TextButton(Medium)** — 로그인 화면의 '아이디 찾기 | 비밀번호 찾기', 가입 유도 등. solid 버튼으로 만들지 않는다.",
      "**상태 분기는 같은 골격**: 로그인 / 아이디 찾기 / 비밀번호 찾기는 동일한 480px 중앙 카드 레이아웃의 변형. 화면마다 다른 골격을 만들지 않는다.",
      "**Validate**: ① Step ≥ 3 → 별도 Multi-step Onboarding 으로(상단 Step Progress 추가). ② Form 필드 > 5 → `pattern:cashwalk-biz-page-form` 전환 검토. ③ 외부 인증(SMS/Email) 필요 → 인증 코드 입력 Section 추가. ④ 이용약관 동의 필요 → Form 위에 CheckboxGroup 추가.",
    ],
    avoid: [
      "온보딩 카드에 사이드바/topbar(admin-shell) 부착 — 비로그인 인증 화면은 중앙 카드만",
      "카드 폭을 480px 외 값으로 (고정 폭 패턴)",
      "로그인·아이디찾기·비밀번호찾기마다 다른 레이아웃 골격",
      "Primary CTA 를 카드 폭보다 좁게 / 2개 이상 / outlined 로",
      "보조 링크(찾기·가입)를 solid 버튼으로 — TextButton(Medium) 텍스트 링크가 맞다",
      "로고를 직접 SVG 로 조립 — 캐포비 로고 컴포넌트 사용",
      "필드 6개 이상·3스텝 이상을 단일 온보딩 카드에 욱여넣기 (Validate Rule 위반 → Form/Multi-step 전환)",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 3611-2 (캐포비 Onboarding 패턴 — 로그인 / 아이디 찾기 / 비밀번호 찾기)",
        caption:
          "탈색 회색 캔버스 중앙 480px 카드. 01 Logo(중앙) → 02 Form(로그인=TextInput / 찾기=RadioGroup) → 03 Primary CTA(Solid/Primary/X-Large FILL yellow) → 04 Helper(TextButton). 세 화면 동일 골격.",
      },
      {
        verdict: "bad",
        source: "잘못된 온보딩 화면",
        caption:
          "사이드바 부착 + 가변 폭 카드 + 좁은/2개 CTA + 보조 링크를 solid 버튼으로 — Onboarding 패턴 위반.",
      },
    ],
    metrics: {
      status: "Figma 실측 반영 (docs 3626-792 / pattern 3611-2)",
      composition: "01 Logo → 02 Form → 03 Primary CTA → 04 Helper",
      shell: "none (비로그인 — admin-shell 미적용)",
      cardWidth: "480px (고정)",
      cardPadding: "48px",
      cardRadius: "16px (--semantic-bg radius/16)",
      cardBg: "--semantic-bg-surface-default (#FFFFFF)",
      canvasBg: "--semantic-bg-surface-subtle (#FAFAFA)",
      cardItemSpacing: "40px (큰 단위 그룹간)",
      cardAlign: "vertical + horizontal center",
      logo: "캐포비 로고 컴포넌트 (중앙 정렬)",
      formLogin: "TextInput (ID + Password eye 토글)",
      formFind: "RadioGroup (찾기 방법 선택 — 전화/이메일)",
      primaryCta: "Button Solid/Primary/X-Large 가로 FILL · #FFD200 + 검정",
      helper: "TextButton(Medium) 보조 링크",
      validateStepThreshold: "Step ≥ 3 → Multi-step Onboarding",
      validateFieldThreshold: "필드 > 5 → cashwalk-biz-page-form 전환",
      maxPrimarySolidPerScreen: 1,
      relatedPatterns: "cashwalk-biz-page-patterns, cashwalk-biz-button, cashwalk-biz-input",
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2",
    references: [
      {
        label: "캐포비 Onboarding 패턴 SSOT — 로그인/아이디찾기/비밀번호찾기 (Figma 3611-2)",
        image: "references/cashwalk-biz-onboarding-3611-2.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2",
        caption:
          "세 인증 화면이 동일한 480px 중앙 카드 골격. 본 가이드 metrics 는 이 노드 실측 기준.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐포비 Onboarding docs (Figma 3626-792)",
        image: "references/cashwalk-biz-onboarding-docs-3626-792.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-792",
        caption:
          "언제 사용 · 지원 화면 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        brand: "cashwalk-biz",
      },
    ],
  },
  "cashwalk-biz-page-dashboard": {
    name: "cashwalk-biz-page-dashboard",
    summary:
      "캐시워크 포 비즈니스 어드민 **Dashboard 패턴** — 주요 지표·통계·차트를 한눈에 보여주는 통계/현황 화면. " +
      "구성: 01 Sidebar → 02 Page Header+Actions(Pill) → 03 Summary Strip(인라인 지표, **개별 KPI 카드 미사용**) → 04 Charts(라인+바 2-up) → 05 Stats Table. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-855 / pattern 3612-9 실측 반영.",
    rules: [
      "**언제 쓰나**: PRD 에 '대시보드 / 메인 / 홈 / 요약 / 현황 / KPI' 키워드가 있고, 여러 데이터를 시각화해 한눈에 보여줘야 하며, 사용자가 가장 먼저 보는 진입 화면일 때.",
      "**Main Area**: admin-shell content 영역 padding **48px**, 섹션 간 itemSpacing **32px**. 섹션 순서는 위→아래로 요약→추세→상세: 02 Header → 03 Summary → 04 Charts → 05 Table.",
      "**02 Page Header + Actions**: 좌측 제목(Heading1 Bold 32/40) + 부제, 우측 **Pill 액션** — [기간 조회](outline/white pill) + [자료 다운로드](solid yellow #FFD200 pill + download 아이콘). 본문에 액션을 흩뿌리지 않고 헤더 우측에 모은다.",
      "**03 Summary Strip (개별 KPI 카드 미사용)**: 핵심 지표를 **한 줄 strip** 으로 — 좌측 상태 라벨(예: '전체 캠페인 성과' + '실시간 집계 · {갱신시각} 기준'), 우측에 지표들을 **세로 구분선으로 나눠 인라인** 배치. 각 지표 = 라벨(Caption 12/16 #666) 위, 값(Bold) 아래. strip 배경은 brand 노란 틴트 `Yellow/100 (#FFFAE5)`. **KPI 마다 별도 카드를 만들지 않는다.**",
      "**04 Charts**: 차트 카드 안에 **라인 차트 + 바 차트 2-up**(좌 추이 라인 / 우 항목별 비교 바). gridline + 범례 포함. 차트 카드 높이 **360px**(기본).",
      "**05 Stats Table**: 항목별 통계 테이블 — 헤더 행(연회색 bg) + 데이터 행. 우측 정렬 숫자 컬럼(노출수/클릭수/전환율/소진액 등).",
      "**카드 규격(차트·테이블 공통)**: radius **12px**, padding **24px**, border **1px `--semantic-border-normal-subtle`(#F5F5F5)**, bg `--semantic-bg-surface-default`(#FFFFFF). 페이지 캔버스는 `--semantic-bg-surface-subtle`(#FAFAFA).",
      "**01 Sidebar**: 좌측 LNB = Sidebar 컴포넌트(Figma 3304:617) — 계정 정보 + 광고/자산/계정 관리 섹션. admin-shell 의 nds-shell__sidebar 슬롯. **items 를 새로 만들지 말고 `pattern:cashwalk-biz-admin-sidebar` 의 ready-made 트리를 복붙(아이콘 inline 완료)하고 activeKey 만 이 화면 키로.**",
      "**Validate**: ① 핵심 지표 ≤ 4개 → Summary Strip, 그 이상 → 별도 통계 카드/그리드 검토. ② Chart 종류(Line/Bar/Donut) 명시 — Chart Library 25종 참조. ③ 데이터 없음 → Empty State 변형(회색 패널 + 안내문). ④ 갱신 시각 필요 → Header(또는 Summary)에 '마지막 갱신 mm/dd hh:mm' 추가.",
    ],
    avoid: [
      "Summary 지표를 **개별 KPI 카드**(카드 4장 grid)로 — 캐포비 대시보드는 노란 틴트 인라인 strip 1개",
      "요약·차트·테이블 위계를 뒤섞어 배치",
      "헤더 Pill 액션 대신 본문 곳곳에 액션 버튼 분산",
      "차트 카드 radius/padding 을 폼 카드(16/48)와 다르게 임의 설정 — 대시보드 카드는 12/24",
      "데이터 없음 상태를 빈 차트/빈 테이블로 방치 — Empty State 패널 + 안내문",
      "차트 종류를 정의 없이 그리기 (Line/Bar/Donut 중 무엇인지 명시)",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 3612-9 (캐포비 Dashboard 패턴)",
        caption:
          "Sidebar + 헤더(제목 + 기간조회/자료다운로드 Pill) + 노란 틴트 Summary Strip(인라인 지표 4종 구분선) + 라인/바 2-up 차트 카드(h360) + 항목별 통계 테이블. 카드 12/24.",
      },
      {
        verdict: "bad",
        source: "잘못된 대시보드",
        caption:
          "지표를 KPI 카드 4장 grid 로 + 차트 종류 불명 + 데이터 없을 때 빈 차트 방치 — Dashboard 패턴 위반.",
      },
    ],
    metrics: {
      status: "Figma 실측 반영 (docs 3626-855 / pattern 3612-9)",
      composition:
        "01 Sidebar → 02 Header+Actions → 03 Summary Strip → 04 Charts(2-up) → 05 Stats Table",
      shell: "admin-shell (Sidebar 3304:617)",
      mainAreaPadding: "48px",
      sectionItemSpacing: "32px",
      pageTitle: "Heading1 Bold 32/40 #111",
      headerActions: "Pill — [기간 조회] outline + [자료 다운로드] solid yellow #FFD200",
      summaryStrip:
        "인라인 지표 strip (개별 KPI 카드 미사용) · 라벨 Caption 12/16 #666 + 값 Bold · 세로 구분선 · bg Yellow/100 #FFFAE5",
      charts: "라인 + 바 2-up (gridline·범례) · 카드 높이 360px",
      statsTable: "헤더 행(연회색) + 데이터 행 · 숫자 우측 정렬",
      cardRadius: "12px",
      cardPadding: "24px",
      cardBorder: "1px #F5F5F5 (--semantic-border-normal-subtle)",
      cardBg: "--semantic-bg-surface-default (#FFFFFF)",
      canvasBg: "--semantic-bg-surface-subtle (#FAFAFA)",
      validateSummaryThreshold: "핵심 지표 ≤ 4 → Summary Strip / >4 → 별도 카드·그리드",
      emptyState: "데이터 없음 → 회색 패널 + 안내문",
      relatedPatterns: "cashwalk-biz-page-patterns, admin-shell, dense-list",
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9",
    references: [
      {
        label: "캐포비 Dashboard 패턴 SSOT (Figma 3612-9)",
        image: "references/cashwalk-biz-dashboard-3612-9.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9",
        caption:
          "Sidebar + 헤더 Pill + 노란 틴트 Summary Strip + 라인/바 2-up + 통계 테이블. metrics 는 이 노드 실측 기준.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐포비 Dashboard docs (Figma 3626-855)",
        image: "references/cashwalk-biz-dashboard-docs-3626-855.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-855",
        caption: "언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        brand: "cashwalk-biz",
      },
    ],
  },
  "cashwalk-biz-page-list": {
    name: "cashwalk-biz-page-list",
    summary:
      "캐시워크 포 비즈니스 어드민 **List 패턴** — 검색/필터/페이지네이션이 있는 데이터 목록 화면. " +
      "구성: 01 Sidebar → 02 PageHeader+Primary Action('등록하기') → 03 FilterBar → 04 Table(썸네일·상태배지·노출토글·수정/삭제) → 05 Pagination. Detail 진입 전 단계. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-915 / pattern 3613-234 실측 반영.",
    rules: [
      "**언제 쓰나**: PRD 에 '목록 / 조회 / 검색 / 필터링 / 리포트(테이블)' 키워드가 있고, 여러 row 데이터를 비교·탐색해야 하며, Detail 화면으로 진입하기 전 단계일 때.",
      "**02 PageHeader + Primary Action**: 좌측 제목(Heading1 Bold 32/40) + 부제, 우측 **'등록하기' Primary Button** 1개. 목록의 주 액션은 헤더 우측에만 둔다.",
      "**03 FilterBar**: 테이블 위 한 줄(`pattern:action-row`) — Search Input + Dropdown 필터(상태 등) + 기간(DateRange). 카드 형태: radius **12px**, padding **20/24**.",
      "**04 Table**: 헤더 행 + 데이터 행. 헤더 행 배경 `--semantic-bg-surface-subtle`(#FAFAFA). 카드 radius **12px**, Row padding **16/24**, Row 사이 **1px border `#F5F5F5`**. 컬럼은 균등 또는 flex.",
      "**행 셀 컴포넌트**: 썸네일(이미지 컬럼) + 핵심 텍스트(클릭 시 Detail 진입 — 링크색) + **상태 = Badge**(진행중=success/green · 진행예정=subtle · 종료=neutral gray) + 숫자 컬럼 우측 정렬 + **노출 = Toggle**(노출 on green / 미노출 off) + **관리 = 수정(pencil)·삭제(trash) 아이콘 액션**. 상태를 raw 텍스트로, 노출을 체크박스로 만들지 않는다.",
      "**05 Pagination**: 중앙 정렬 페이지 번호, 버튼 **32×32**, **현재 페이지 = 검정(neutral 900 / #111) fill + 흰 텍스트**(brand yellow 아님 — 노랑은 활성/선택 강조용이라 페이지네이션 현재 페이지와 시각 충돌). 우측에 페이지 사이즈 셀렉트('10개씩 보기') 배치 가능.",
      "**01 Sidebar**: admin-shell 의 Sidebar 컴포넌트(대시보드와 동일 LNB). ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.",
      "**Validate**: ① Row > 50 → 페이지네이션 필수 / ≤ 10 → 페이지네이션 생략. ② 필터 > 4개 → 필터 패널 분리(좌측 또는 상단 collapsible). ③ Row 클릭 액션 있으면 → 행 hover effect + cursor pointer. ④ Empty state 필수 → '등록된 OOO이 없습니다' + CTA. ⑤ 정렬 가능 컬럼 → Header 셀에 화살표 아이콘.",
    ],
    avoid: [
      "필터를 테이블과 떨어뜨려 본문 곳곳에 배치 — FilterBar 는 테이블 위 한 줄",
      "상태를 raw 텍스트로 (Badge 미사용), 노출 on/off 를 체크박스로 (Toggle 미사용)",
      "관리 컬럼에 수정/삭제 외 잡다한 버튼 추가",
      "헤더에 '등록하기' 외 primary 액션 여러 개",
      "Empty state 를 빈 테이블로 방치 — '등록된 OOO이 없습니다' + CTA 필수",
      "FilterBar/Table radius 를 12px 외로 · 헤더 행 배경 누락",
      "페이지네이션 현재 페이지를 brand yellow fill 로 — 현재 페이지는 검정(#111) fill + 흰 텍스트",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 3613-234 (캐포비 List 패턴 — 배너광고 목록)",
        caption:
          "헤더(제목 + 등록하기) + FilterBar(검색·상태·기간) + 테이블(이미지·캠페인명·상태 Badge·노출수·클릭수·소진액·노출 Toggle·관리 수정/삭제) + 중앙 페이지네이션 + 페이지 사이즈 셀렉트.",
      },
      {
        verdict: "bad",
        source: "잘못된 목록 화면",
        caption:
          "상태를 색 없는 텍스트로 + 노출을 체크박스로 + 행마다 버튼 흩뿌리기 + Empty state 없이 빈 테이블 — List 패턴 위반.",
      },
    ],
    metrics: {
      status: "Figma 실측 반영 (docs 3626-915 / pattern 3613-234)",
      composition: "01 Sidebar → 02 Header+등록하기 → 03 FilterBar → 04 Table → 05 Pagination",
      shell: "admin-shell",
      pageTitle: "Heading1 Bold 32/40 #111",
      primaryAction: "'등록하기' Primary Button (헤더 우측)",
      filterBar: "Search Input + Dropdown 필터 + DateRange · radius 12 · padding 20/24",
      tableRadius: "12px",
      tableRowPadding: "16/24",
      tableRowBorder: "1px #F5F5F5 (row 사이)",
      tableHeaderBg: "--semantic-bg-surface-subtle (#FAFAFA)",
      rowCells:
        "썸네일 + 링크 텍스트 + 상태 Badge + 숫자(우측정렬) + 노출 Toggle + 관리(수정/삭제 아이콘)",
      statusBadge: "진행중=success · 진행예정=subtle · 종료=neutral",
      pagination:
        "중앙 정렬 · 버튼 32×32 · 현재 페이지 = 검정(#111) fill + 흰 텍스트 (brand yellow 아님)",
      pageSizeSelect: "'10개씩 보기' 셀렉트 (우측)",
      validatePaginationThreshold: "Row > 50 필수 / ≤ 10 생략",
      validateFilterThreshold: "필터 > 4 → 패널 분리",
      emptyState: "'등록된 OOO이 없습니다' + CTA 필수",
      relatedPatterns:
        "cashwalk-biz-page-patterns, admin-shell, action-row, dense-list, cashwalk-biz-page-detail",
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234",
    references: [
      {
        label: "캐포비 List 패턴 SSOT — 배너광고 목록 (Figma 3613-234)",
        image: "references/cashwalk-biz-list-3613-234.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234",
        caption:
          "헤더 + FilterBar + 상태배지/노출토글/관리 테이블 + 페이지네이션. metrics 는 이 노드 실측 기준.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐포비 List docs (Figma 3626-915)",
        image: "references/cashwalk-biz-list-docs-3626-915.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-915",
        caption: "언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        brand: "cashwalk-biz",
      },
    ],
  },
  "cashwalk-biz-page-detail": {
    name: "cashwalk-biz-page-detail",
    summary:
      "캐시워크 포 비즈니스 어드민 **Detail 패턴** — 개별 항목의 정보를 보고 액션을 수행하는 화면. " +
      "구성: 01 Sidebar → 02 Breadcrumb → 03 PageHeader+Status+Actions → 04 Tab Navigation(underline) → 05 Info Card(key-value). List 에서 row 클릭 후 진입. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-978 / pattern 3614-367 실측 반영.",
    rules: [
      "**언제 쓰나**: PRD 에 '상세 / 정보 보기 / 수정 / 편집' 키워드가 있고, List 에서 row 클릭 후 진입하며, 관련 액션(수정/삭제/실행)이 동반될 때.",
      "**02 Breadcrumb (필수)**: 상위 페이지 경로를 명시(예: '배너광고 목록 / 여름 시즌 프로모션 상세'). 타이포 Body3/Subtle, **divider '/' 문자**, itemSpacing **8px**. 상세는 항상 목록에서 진입하므로 경로 생략 금지.",
      "**03 PageHeader + Status + Actions**: 좌측 제목(Heading1 Bold 32/40) + **상태 ActionChip**(title 과 gap **12px**), 우측 **액션 버튼들**(예: outline 보조 + solid 주). 삭제 같은 위험 액션은 별도 Outlined/Neutral 버튼으로 **우측 끝** 배치.",
      "**04 Tab Navigation**: **Underline 탭**(예: 기본 정보 / 성과 리포트 / 히스토리). 데이터 항목이 많으면 탭으로 분리.",
      "**05 Info Card**: 정보 블록 = **key-value rows**(또는 FormSection). **key 컬럼 width 240px 고정, value 컬럼 flex**. key-value row padding **16/24**, **border-bottom `--semantic-border-normal-subtle`(#F5F5F5)**. 카드 안 상단에 섹션 제목.",
      "**01 Sidebar**: admin-shell 의 Sidebar 컴포넌트(목록/대시보드와 동일 LNB). ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.",
      "**편집은 Form 패턴으로 분리**: 상세 화면은 보기 중심. 편집 가능 필드만 있는 화면이면 Detail 이 아니라 `pattern:cashwalk-biz-page-form` 으로 만든다. 인라인 편집 폼을 상세에 펼치지 않는다.",
      "**Validate**: ① 데이터 항목 > 15개 → Tab 으로 분리(탭당 5~8개). ② 편집 가능 필드만 있는 경우 → Form 패턴으로 변경. ③ 삭제 액션 → 별도 Outlined/Neutral 버튼, 우측 끝 배치. ④ 위험 액션(삭제) → 확인 Modal 필수 호출. ⑤ 권한별 액션 숨김 → BOOLEAN prop 또는 변형 변경.",
    ],
    avoid: [
      "Breadcrumb 생략 (상세 진입 경로 불명확) · divider 를 '>' 등으로 (캐포비는 '/' 문자)",
      "상세 화면 안에서 바로 인라인 편집 폼 펼치기 — 편집은 Form 패턴으로 분리",
      "Info Card key 컬럼을 가변 폭으로 — key 240px 고정 + value flex",
      "삭제(위험) 액션을 solid/primary 로 또는 확인 Modal 없이 즉시 실행",
      "데이터 항목 15개 초과를 한 카드에 나열 — Tab 으로 분리",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 3614-367 (캐포비 Detail 패턴 — 여름 시즌 프로모션 상세)",
        caption:
          "Breadcrumb('목록 / OO 상세', '/' divider) + 제목 + 상태칩 + 우측 액션 + Underline 탭(기본정보/성과/히스토리) + Info Card(key 240 고정 / value flex, row 16/24 border-bottom).",
      },
      {
        verdict: "bad",
        source: "잘못된 상세 화면",
        caption:
          "Breadcrumb 없이 진입 + 상세 안에 인라인 편집 폼 + 삭제를 primary 버튼으로 확인 Modal 없이 — Detail 패턴 위반.",
      },
    ],
    metrics: {
      status: "Figma 실측 반영 (docs 3626-978 / pattern 3614-367)",
      composition:
        "01 Sidebar → 02 Breadcrumb → 03 Header+Status+Actions → 04 Tab(underline) → 05 Info Card",
      shell: "admin-shell",
      breadcrumb: "Body3/Subtle · divider '/' · itemSpacing 8",
      pageHeader: "제목 Heading1 Bold 32/40 + 상태 ActionChip (gap 12) + 우측 액션 버튼",
      tabs: "Underline (기본 정보 / 성과 / 히스토리 등)",
      infoCardKeyWidth: "240px 고정",
      infoCardValue: "flex",
      keyValueRowPadding: "16/24",
      keyValueRowBorder: "border-bottom 1px #F5F5F5 (--semantic-border-normal-subtle)",
      deleteAction: "Outlined/Neutral · 우측 끝 · 확인 Modal 필수",
      validateTabThreshold: "데이터 항목 > 15 → Tab 분리 (탭당 5~8)",
      relatedPatterns:
        "cashwalk-biz-page-patterns, admin-shell, cashwalk-biz-page-list, cashwalk-biz-page-form, card-section",
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367",
    references: [
      {
        label: "캐포비 Detail 패턴 SSOT — 여름 시즌 프로모션 상세 (Figma 3614-367)",
        image: "references/cashwalk-biz-detail-3614-367.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367",
        caption:
          "Breadcrumb + 제목/상태칩/액션 + Underline 탭 + key-value Info Card. metrics 는 이 노드 실측 기준.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐포비 Detail docs (Figma 3626-978)",
        image: "references/cashwalk-biz-detail-docs-3626-978.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-978",
        caption: "언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        brand: "cashwalk-biz",
      },
    ],
  },
  "cashwalk-biz-page-form": {
    name: "cashwalk-biz-page-form",
    summary:
      "캐시워크 포 비즈니스 어드민 **Form 패턴** — 다단계 입력으로 새 항목을 등록하는 화면. " +
      "구성: 01 Sidebar → 02 Step Progress → 03 Form Sections(FormSection 반복) → 04 Summary/Preview Panel(선택, 우측 400px) → 05 Footer Actions. " +
      "**필드 단위 실측(라벨 컬럼·필드 높이·필수 마커 등)은 `pattern:cashwalk-biz-form-layout` 이 SSOT** — 이 패턴은 페이지 조립(Step/섹션/요약/Footer) + **PRD→컴포넌트 매핑**을 정의. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-1041 / pattern 3615-522 실측 반영.",
    rules: [
      "**언제 쓰나**: PRD 에 '등록 / 만들기 / 생성 / 신규 / Step' 키워드가 있고, 여러 정책 옵션을 단계별로 설정하거나 '캠페인 → 광고 → 소재'처럼 계층 구조를 등록할 때.",
      "**02 Step Progress**: 가로 막대 + Step N 라벨(Done / Current / Todo 상태). 다단계 등록일 때 사용 — Step ≥ 3 이면 필수. 영역 padding **32/48**, 하단 **border 1px**. 단건이면 생략.",
      "**03 Form Sections**: **FormSection 컴포넌트 반복** — 각 섹션 = 제목(예: '광고 정보') + 설명 + 필드 슬롯(label-좌측 + 입력 + helper). 섹션 사이 gap **32px**. 필드 슬롯의 라벨 컬럼·필드 높이·필수 마커 등 px·색은 `pattern:cashwalk-biz-form-layout` 을 그대로 따른다(여기서 중복 정의 X).",
      "**04 Summary / Preview Panel (선택)**: 메인 폼 우측 보조 패널 **400px** — 예상 성과·미리보기·입력 요약. 2컬럼 = 메인 폼(FILL) + 패널 400px. 없으면 단일 컬럼.",
      "**05 Footer Actions**: 페이지 끝 Footer — **좌측 [이전 단계]·[임시저장] / 우측 [다음 단계]·[등록](Solid)**. Footer 영역 padding **24/48**, 상단 **border 1px**, 배경 `--semantic-bg-surface-default`. (단건 폼의 inline 센터 [취소][저장] 클러스터는 `cashwalk-biz-form-layout` 참조 — 다단계는 좌/우 분리 Footer.)",
      "**01 Sidebar**: admin-shell 의 Sidebar 컴포넌트. ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.",
      "**Validate — PRD → 컴포넌트 매핑(정량)**: 글자 ≤ 40 → **TextInput** / 글자 > 40 → **Textarea** / 단일 선택 ≤ 3 → **SelectionButtonGroup** / 단일 선택 > 3 → **Dropdown** / 다중 선택 → **CheckboxGroup** / ON·OFF 즉시 적용 → **Toggle** / 날짜·시간 → **DateInput** / 이미지·파일 → **ImageUpload**.",
      "**Validate — 구조**: Step ≥ 3 → Step Progress 필수 / 필수 필드 → FormField `required=true` / 조건부 노출 → Boolean variant 또는 컨테이너 hide.",
    ],
    avoid: [
      "필드 높이·라벨 컬럼·필수 마커 px 를 이 패턴에 중복 정의 (cashwalk-biz-form-layout 이 SSOT)",
      "단건 폼에 불필요한 Step Progress — Step ≥ 3 일 때만",
      "다단계 Footer 를 inline 센터 클러스터로 — 다단계는 좌(이전/임시저장)·우(다음/등록) 분리 Footer + 상단 border",
      "입력 타입을 임의 선택 — PRD→컴포넌트 매핑(글자수/선택수/타입)으로 결정",
      "요약/미리보기 패널 폭을 400px 외로 임의 설정",
    ],
    examples: [
      {
        verdict: "good",
        source: "Figma 3615-522 (캐포비 Form 패턴 — 다단계 광고 등록)",
        caption:
          "Step Progress(캠페인→광고그룹→소재) + FormSection 반복(광고 정보/기간/예산, 섹션 gap 32) + 우측 미리보기 패널 400px + Footer(좌 이전/임시저장 · 우 다음 단계 solid, 상단 border).",
      },
      {
        verdict: "bad",
        source: "잘못된 등록 폼",
        caption:
          "단건인데 Step Progress 부착 + 입력 타입을 매핑 없이 임의 선택 + Footer 를 inline 센터로 + 필드 px 를 여기서 재정의 — Form 패턴 위반.",
      },
    ],
    metrics: {
      status: "Figma 실측 반영 (docs 3626-1041 / pattern 3615-522)",
      composition:
        "01 Sidebar → 02 Step Progress → 03 Form Sections → 04 Summary Panel(선택) → 05 Footer Actions",
      shell: "admin-shell",
      stepProgress:
        "가로 막대 + Step N (Done/Current/Todo) · padding 32/48 · 하단 border 1px · Step≥3 필수",
      formSectionGap: "32px (섹션 사이)",
      twoColumn: "메인 폼(FILL) + Summary/Preview 패널 400px (선택)",
      footer:
        "좌 [이전 단계]·[임시저장] / 우 [다음 단계]·[등록](Solid) · padding 24/48 · 상단 border 1px · bg surface",
      fieldSpecSsot: "cashwalk-biz-form-layout (라벨 컬럼·필드 높이·필수 마커 px)",
      prdComponentMapping:
        "≤40자 TextInput · >40자 Textarea · 단일≤3 SelectionButtonGroup · 단일>3 Dropdown · 다중 CheckboxGroup · ON/OFF Toggle · 날짜 DateInput · 파일 ImageUpload",
      requiredFieldProp: "FormField required=true",
      conditionalField: "Boolean variant 또는 컨테이너 hide",
      relatedPatterns:
        "cashwalk-biz-page-patterns, admin-shell, cashwalk-biz-form-layout, cashwalk-biz-input, cashwalk-biz-button",
    },
    figmaNodeUrl: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522",
    references: [
      {
        label: "캐포비 Form 패턴 SSOT — 다단계 등록 (Figma 3615-522)",
        image: "references/cashwalk-biz-form-pattern-3615-522.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522",
        caption:
          "Step Progress + FormSection 반복 + 우측 미리보기 패널 + 좌/우 분리 Footer. metrics 는 이 노드 실측 기준.",
        brand: "cashwalk-biz",
      },
      {
        label: "캐포비 Form docs — PRD→컴포넌트 매핑 포함 (Figma 3626-1041)",
        image: "references/cashwalk-biz-form-docs-3626-1041.png",
        url: "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-1041",
        caption:
          "언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.",
        brand: "cashwalk-biz",
      },
    ],
  },
};
