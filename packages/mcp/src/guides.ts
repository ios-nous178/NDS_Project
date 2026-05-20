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
 * 이 MCP는 본질적으로 "사용자 앱(@nudge-eap/react)" 컴포넌트 라이브러리를
 * 노출하지만, 사용자가 어드민/CMS 화면을 만들 때는 antd를 써야 한다.
 *
 * 사용자의 자연어 요청에 다음 키워드가 보이면 admin-cms 의도로 간주:
 *   어드민 / 운영툴 / 관리자 / 관리자페이지 / CMS / 백오피스 / admin / cms / backoffice
 *   상담 관리(admin), 멤버십 관리(admin) 같이 운영자가 보는 화면
 *
 * 사용자 앱으로 간주하는 키워드:
 *   사용자 앱 / 모바일 앱 / 마이페이지 / 회원가입 / 상담 신청 / 챌린지 / 일기 / 콘텐츠 카드
 *   Trost / Geniet / NudgeEAP 사용자 화면
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

export function detectIntentFromText(text?: string): "admin-cms" | "user-app" | "unknown" {
  if (!text) return "unknown";
  const normalized = text.toLowerCase();
  for (const k of ADMIN_KEYWORDS) {
    if (normalized.includes(k.toLowerCase())) return "admin-cms";
  }
  return "unknown";
}

export const SCOPE_ADVISORY = {
  scope: "사용자 앱 (Trost / Geniet / NudgeEAP) 화면 전용",
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
        "어드민/CMS/운영툴/백오피스 화면이라면 이 DS(@nudge-eap/react)를 쓰지 말 것. " +
        "antd v5를 사용하고, 시각/구조 컨벤션은 get_guide({ topic: 'admin-cms' })를 호출해 확인할 것. " +
        "두 라이브러리를 한 화면에서 섞어쓰지 말 것.",
      tools: [
        "get_guide({ topic: 'admin-cms' })",
        "get_setup({ step: 'full', intent: 'admin-cms' })",
      ],
    },
    "user-app": {
      action:
        "사용자 앱 화면(B2C, 멘탈케어 사용자 플로우)이라면 이 MCP의 도구들을 적극 사용. " +
        "get_guide({ topic: 'principles' }) → search_component → get_guide({ topic: 'component:<Name>' }) / get_guide({ topic: 'pattern:<name>' }) → 작성 → validate_mockup.",
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
    "NudgeEAP DS는 B2C 멘탈케어 앱 화면을 위한 컴포넌트 셋이다. 어드민은 정보 밀도 / 표 / 폼 / " +
    "필터 위주라 antd가 더 적합하고, 운영팀이 익숙한 시각 언어와도 일치한다.",
  techStack: {
    required: [
      "react ^18",
      "antd ^5 (NudgeEAPCMS 기준 5.5.1)",
      "@ant-design/icons ^5",
      "dayjs (locale: ko)",
    ],
    forbidden: [
      "@nudge-eap/react — 사용자 앱 DS, 어드민에서 절대 import 금지",
      "@nudge-eap/tokens — 어드민에서는 antd 기본 토큰 사용",
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
    "@nudge-eap/react / @nudge-eap/tokens / @nudge-eap/icons import (어드민 화면에서)",
    "큰 히어로 카드, 마케팅 톤, 그라디언트 배경",
    "antd Table 위에 별도 Card wrapper로 그림자+패딩 추가 (CMS는 본문에 직접 노출)",
    "Tabs를 페이지 단위로 남발 (CMS는 페이지 단위 Tabs 거의 사용 안 함)",
  ],
  selfCheck: [
    "antd에서 import 했는가 (직접 button/input/select 만들지 않았는가)",
    "@nudge-eap/* 패키지를 어드민 화면에서 import 하지 않았는가",
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
    limits?: Record<string, string | number>;
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
  /** color × variant 별 표시 톤 요약 */
  colorMatrix?: Record<string, string>;
  /** size 값 × 픽셀 스펙 (Figma 실측 기준) */
  sizeMatrix?: Record<string, string>;
  /** state(active/hover/disabled) 별 토큰/배경 매핑 */
  stateMatrix?: Record<string, string>;
  /** 브랜드별 허용 variant / 패턴 차이 — Figma 라이브러리가 브랜드별로 다른 컴포넌트(Button 등)에서 사용. */
  brandMatrix?: Record<string, string>;
  /** 출처 Figma 노드 URL (Library 파일) */
  figmaNodeUrl?: string;
  /** 접근성 가이드 (aria/대비/타겟 사이즈 등) */
  accessibility?: string[];
  interactivePattern?: string;
}

export const COMPONENT_GUIDES: Record<string, ComponentGuide> = {
  Button: {
    name: "Button",
    summary:
      "1차/2차 CTA. color × variant × size 매트릭스로 톤 결정 (Figma Library node 171:8385 기준).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8385",
    pitfalls: [
      "color='assistive' + variant='solid' 조합은 Figma 라이브러리에 없음(=의도적으로 막혀 있음). DS 코드에 노출돼 있어도 사용 금지 — cool-gray 배경이라 disabled와 구분되지 않음.",
      "Geniet 브랜드에서 variant='soft' 또는 variant='outlined-sub' 는 Figma 가이드(207:1853)에 없는 변형. 사용 시 dev console 에 경고가 나오며 디자인 인텐트가 어긋남 — Geniet 은 solid / outlined 만 사용.",
      "Geniet Solid/Secondary 는 #333333(gray-900) dark inverse 패턴 + 흰 텍스트 — 다른 브랜드의 옅은 톤 secondary 와 다름. 'dark fill' 이 의도된 결과.",
      "primary 색은 화면당 가장 중요한 1개 액션에만 사용. 한 화면에 두 개 이상 primary 솔리드 = 위계 붕괴.",
      "다른 페이지로 이동하는 CTA라고 해서 모든 Button에 화살표 아이콘을 붙이지 말 것. ArrowNext/ChevronRight 류 아이콘은 대표 전진 액션 1개에만 사용.",
      "카드 리스트/섹션 리스트에서 반복되는 '자세히 보기 →' 버튼은 시각 소음이 큼. 반복 CTA는 아이콘 없이 텍스트만 쓰거나 카드 전체 클릭 패턴을 검토.",
      "Solid/Secondary 는 옅은 파랑 배경(#F1F8FD) + primary 텍스트로 그려진다. 'magenta'를 기대하면 안 됨.",
      "Outlined/Assistive 는 medium weight + 회색 보더. Outlined/Primary 와 weight·border 모두 다르므로 'color=assistive variant=outlined' 와 'color=primary variant=outlined' 를 임의로 바꿔치기하지 말 것.",
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
      "primary/soft": "#F1F8FD 배경 + #2B96ED 텍스트 — 3차 액션 (Figma 라이브러리엔 별도 셀 없음)",
      "secondary/solid":
        "#F1F8FD 배경 + #2B96ED 텍스트 — 파란 카드/배경 위 강조 (default), hover=#E3F2FC",
      "assistive/outlined":
        "흰 배경 + #D8D8D8 보더 + #383838 medium weight 텍스트 — 중립 액션. Figma는 M/S/XS 만 지원, disabled 없음",
      "error/solid": "error fill + 흰 텍스트 — 파괴 액션 한정",
    },
    brandMatrix: {
      "nudge-eap":
        "variant=solid/outlined/soft/outlined-sub 전부 사용 가능. secondary/solid 는 옅은 blue.",
      trost:
        "variant=solid/outlined/soft/outlined-sub 사용 가능. secondary/solid 는 cobalt-50 배경 + cobalt 텍스트.",
      geniet:
        "variant=solid/outlined 만 허용 (Figma 207:1853 가이드). soft/outlined-sub 는 dev console 경고 — 사용 금지. " +
        "secondary/solid 는 #333333(gray-900) dark inverse + 흰 텍스트 — Geniet 고유 패턴.",
    },
    sizeMatrix: {
      xl: "height 52 / px 16 / py 14 / 16·24 bold / icon 20 / gap 8",
      lg: "height 48 / px 16 / py 12 / 16·24 bold / icon 20 / gap 8",
      md: "height 44 / px 24 / py 11 / 15·22 bold / icon 20 / gap 8",
      sm: "height 42 / px 16 / py 11 / 14·20 bold / icon 20 / gap 8",
      xs: "height 38 / px 16 / py 10 / 13·18 bold / icon 18 / gap 6",
    },
    stateMatrix: {
      "primary/solid/disabled": "bg #9CA2AE (cool-gray/400) + 흰 텍스트",
      "secondary/solid/disabled": "bg #E6E7EB (cool-gray/200) + 텍스트 #9CA2AE",
      outlined_disabled: "흰 배경 + 보더 #9CA2AE + 텍스트 #9CA2AE (Figma 명세)",
      hover: "primary=#017EE4 / secondary=#E3F2FC / outlined/assistive=#FAFAFA",
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
    summary:
      "독립된 콘텐츠 단위를 시각적으로 그룹화하는 컨테이너. Variant 카탈로그가 아니라 '내부 구조 + 생성 규칙' 표준 — 임의 스타일 변형 차단이 목적. " +
      "Compound 슬롯(순서 고정, 모두 Optional): Card.Root / Thumbnail / Avatar / Chips / Title / Description / Metadata / Divider / Cta / FooterText. (legacy: Header / Body / Footer 도 유지). " +
      "Flat API props: thumbnail, avatar, chips, title, description, metadata, divider, cta, footerText, children. " +
      "Anatomy 요소(필수/선택): Title(Required, 정확히 1개) · Thumbnail · Avatar · Badge/Chip · Description · Metadata · CTA · Footer (모두 Optional). " +
      "사용 기준 3축 모두 충족시에만 Card: ① 독립성(개별 탐색·선택), ② 이종 콘텐츠(이미지+텍스트+메타 2종+), ③ 비선형 탐색(그리드·캐러셀). 하나라도 미충족 → List/Table/Feed/Chip.",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=888-23",
    pitfalls: [
      "[Figma 권위 룰] 카드 shadow 전면 금지 — 카드 구분은 border 1px 로만. box-shadow / drop-shadow / elevation 임의 적용 모두 위반. 이전 가이드의 hover→shadow-sm 권장은 deprecated.",
      "[Figma 권위 룰] 임의 pastel/gradient/opacity 배경 금지 — White 또는 정의된 Surface 토큰 외 배경색 생성 불가. linear-gradient(), rgba 투명도, #E8F4FD 류 임의 hex 모두 차단.",
      "[Figma 권위 룰] Title 생략 금지 — 카드당 정확히 1개, 항상 가장 높은 시각적 위계. Description/Metadata/CTA 가 Title 자리를 대신할 수 없음.",
      "Nested Card 금지 — Card 안에 또 다른 Card 삽입 X. 중첩이 필요하면 List 또는 Table 로 대체. bordered 박스를 카드처럼 흉내내는 것도 위반.",
      "Decorative Card 금지 — 콘텐츠 위계가 없는 장식용 카드 생성 금지. 사용 기준 3축(독립성·이종·비선형) 미충족이면 Card 가 아님.",
      "Avatar + Thumbnail 동시 사용 불가 — 둘 중 하나만 (Avatar max 1개).",
      "Badge/Chip 한 카드 max 2개. CTA·Metadata 합쳐 3개 초과 동시 사용 금지.",
      "CTA max 1개 (Primary CTA 1개 원칙) — 항상 카드 최하단. CTA 가 Title 보다 강조되면 안 됨.",
      "Footer 버튼 3개 이상 금지 — Primary 1 + Secondary 1 까지. 더 필요하면 Modal/BottomSheet 검토.",
      "Card.Header / Card.Body / Card.Footer 는 styles.css 에 자체 padding 보유. 외곽에 padding 또 주면 이중 패딩.",
      "Description max 3줄 (line-clamp 적용 권장). Metadata max 2개 항목.",
      "그리드 카드 간격 임의 혼합(8/12/16/20px) 금지. Auto Layout: Mobile 16px, Web·CMS 24px.",
      "Card Overuse — 단순 텍스트+상태+날짜 목록(상담 내역·예약·알림)을 Card 로 감싸는 패턴. 정보 밀도 ↓, List Row 로 변경.",
    ],
    recommended: [
      "Content Card (범용): 썸네일(선택) + Title + Description + Metadata + CTA. <Card.Root><Card.Thumbnail/><Card.Header><Card.Title>…</Card.Title></Card.Header><Card.Body>…</Card.Body><Card.Footer>…</Card.Footer></Card.Root>",
      "Summary Card (CMS·Admin): KPI 수치 + 보조지표 + 트렌드. 슬롯 대신 div + 토큰으로 typography 직접 구성.",
      "Banner Card (App·Mobile): 배경 이미지 + Bottom-up Gradient Overlay(rgba(0,0,0,0) → rgba(0,0,0,0.6)) + Title + CTA.",
      "Profile Card: 아바타 + 이름 + 자격 + Tag(max 2) + CTA.",
      "클릭 가능 카드: <Card.Root clickable onClick={…}>. 내부 별도 button 두면 이벤트 버블링 주의.",
      "CTA 4 유형(레이아웃에 따라 택1, 임의 크기 변형 금지): " +
        "Full-width 48px(Btn Large, 카드 100% width) — Mobile/App 콘텐츠/프로그램 카드, Solid Primary, label Body3 Medium 14px. " +
        "Compact 40px(Btn Small, auto min 80px) — Summary/수치/공간 제약 카드, Outlined 또는 Solid Primary, label Caption1 Medium 13px. " +
        "Ghost/Link(auto text-width, Text Button) — underline 또는 chevron, Brand Color 텍스트, label Body3 Medium 14px. " +
        "Icon+Text 44px(Btn Medium, auto min 88px) — PC 상담 예약/전문가/퀵 액션, icon 16px + text, Solid 또는 Outlined Primary.",
    ],
    usagePolicy: {
      useFor: [
        "이미지/썸네일 포함 시각 탐색 콘텐츠 (사운드테라피, 소식, 프로그램)",
        "개별 오브젝트 선택·비교 (상담사 선택, 상품)",
        "2열 이상 그리드에 동등 비중 나열",
        "KPI·통계 수치 + 보조지표 + 트렌드 (Summary Card)",
        "배경 이미지 + 오버레이 + CTA 프로모션 (Banner Card)",
      ],
      doNotUseFor: [
        "텍스트+날짜+상태만의 단순 데이터 (상담 내역·예약·알림) → List Row",
        "10개 이상 항목의 수직 스크롤 → List",
        "컬럼별 비교가 핵심인 데이터 → Table",
        "시간순 연속 정보 (알림·채팅) → Feed / List",
        "탭·필터·내비게이션 역할 → Chip / Navigation",
        "장식용 (Decorative card) — 사용 기준 3축 미충족이면 Card 가 아님",
      ],
      limits: {
        titleRequired: 1,
        maxAvatarPerCard: 1,
        maxBadgePerCard: 2,
        maxBadgePlusChipPlusCtaPlusMetadata: 3,
        maxDescriptionLines: 3,
        maxMetadataItems: 2,
        maxCtaPerCard: 1,
        maxFooterButtons: 2,
        primaryButtonPerCard: 1,
      },
    },
    sizeMatrix: {
      paddingMin: "16px (모든 방향 동일)",
      paddingMax: "24px (모든 방향 동일)",
      cardGapMin: "8px",
      cardGapMax: "16px",
      elementGapTitleDescription: "4px",
      elementGapDescriptionMetadata: "8px",
      elementGapMetadataCta: "16px",
      footerSeparator: "border-top 1px · padding-top 16px",
      typoTitle: "Pretendard Headline 5 Bold 18px / LH 26px — var(--font-size-headline-5)",
      typoDescription: "Pretendard Body 3 Regular 14px / LH 20px — var(--font-size-body-3)",
      typoMetadata: "Pretendard Caption 1 Regular 13px / LH 18px — var(--font-size-caption-1)",
      typoCta: "Pretendard Body 3 Medium 14px / LH 20px — var(--font-size-body-3)",
      ctaFullWidth: "48px height (Btn Large) · 카드 100% width · Mobile/App 콘텐츠 카드",
      ctaCompact: "40px height (Btn Small) · auto min 80px · Summary/수치/공간 제약 카드",
      ctaGhost: "auto (Text Button) · auto text-width · underline 또는 chevron",
      ctaIconText: "44px height (Btn Medium) · auto min 88px · PC 상담 예약/전문가 카드",
      radiusWeb: "8px",
      radiusApp: "12px",
      radiusCMSAdmin: "6px",
      thumbnailPC: "200×120 (16:9) 또는 1:1 정사각형",
      thumbnailMobile: "전체 너비 × 160 (16:9)",
    },
    stateMatrix: {
      default: "Border 1px #E0E0E0 + bg white(또는 Surface 토큰). Shadow 없음.",
      hover:
        "Border 1px Brand Color (또는 미세한 bg tint). Shadow 금지 — 'shadow-sm 적용' deprecated.",
      activeSelected: "Border 2px Brand Color. Shadow 금지.",
      note: "[Figma 권위 룰] 모든 카드 state 에서 box-shadow / drop-shadow 사용 금지. 구분은 오직 border + color.",
    },
    accessibility: [
      "clickable Card 는 <Card.Root clickable onClick> — 키보드 포커스/Enter 자동. raw <div onClick> 대체 금지.",
      "Banner Card 텍스트는 Gradient Overlay 위에 얹어 WCAG AA 대비비 확보. 배경 이미지 위 직접 텍스트 금지.",
      "썸네일 <img> alt 필수 (장식이면 alt=''). 카드 제목과 중복되는 alt 는 비우기.",
    ],
    interactivePattern:
      "Card.Root 의 clickable + onClick 으로 인터랙티브화. 내부 별도 Button 의 onClick 에서 e.stopPropagation() 호출해 카드 전체 클릭과 분리. " +
      "Hover 피드백은 shadow 가 아니라 Border 색 변경 또는 미세한 bg tint 로 표시 — 클릭 가능 여부 모호함 방지하되 Figma 권위 룰(shadow 금지) 준수.",
  },
  Badge: {
    name: "Badge",
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
    summary: "pill 형태 라벨. variant: fill/outlined/ghost. label prop 필수.",
    pitfalls: [
      "label prop을 빠뜨리고 children을 넣지 말 것 — DS API와 어긋남.",
      "Chip은 상태/분류/짧은 속성 표시용이다. 새 섹션을 강조하거나 일반 안내문을 꾸미는 장식으로 쓰지 말 것.",
      "모든 카드/섹션 제목 앞에 Chip을 붙이면 위계가 무너진다. 카드당 최대 1~2개, 섹션당 최대 2개 수준으로 제한.",
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
    summary:
      "사용자의 현재 흐름을 일시적으로 중단하고 중요한 결정/응답을 받기 위한 오버레이 UI. " +
      "Radius 8px (shape.md), 카드 padding 비대칭 (top 28 / x 16 / bottom 16), " +
      "본문 그룹과 버튼 그룹 사이 24px gap, 50% overlay, shadow.md. " +
      "Device 너비: PC 332px / Mobile 294px (device='pc'|'mobile' 또는 maxWidth로 지정). " +
      "Type: default / title(헤더) / Image(64×64 아이콘+타이틀). " +
      "Button: 최대 2개 (1개=Primary full-width, 2개=Outlined Cancel + Primary OK 가로 분할).",
    pitfalls: [
      "Modal 내부에 다시 큰 그림자/보더를 추가하지 말 것 (이미 shadow.md 적용됨).",
      "ESC/오버레이 클릭으로 닫히는 기본 동작을 막으면 접근성 저해.",
      "버튼은 최대 2개까지만 사용. 3개 이상이 필요하면 BottomSheet 검토.",
      "maxWidth 미지정 시 기본 332px(PC). 모바일 화면이면 device='mobile' 로 294px 지정.",
      "ModalHeader/Body/Footer 자체에 padding 을 더하지 말 것 — 카드 패딩은 ModalContent 가 담당.",
      "단순 정보 전달용으로 Modal 사용 금지 — inline Notice / Banner / section 안내 우선. Modal 은 사용자의 즉각적 판단/응답이 필요할 때만.",
      "Modal 내부 강조 최소화: 핵심 action 1개 + 보조 action 1개 구조가 기본. Body 안에 또 다른 Card·Brand BG·Chip 그룹을 쌓지 말 것.",
    ],
    usagePolicy: {
      useFor: [
        "즉각적 판단/응답이 필요한 확인 (삭제 확인, 결제 확인)",
        "현재 흐름 중단이 정당화되는 중요한 결정",
        "추가 입력 없이 한 화면에서 결정을 마쳐야 하는 짧은 폼",
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
    summary: "드롭다운. options + value + onValueChange.",
    pitfalls: ["변경 핸들러는 **onValueChange** (onChange 아님). React 표준이 아닌 DS 컨벤션."],
  },
  Banner: {
    name: "Banner",
    summary: "페이지 상단 알림 띠. 그라데이션 배경 사용 금지.",
    pitfalls: [
      "Banner의 배경에 linear-gradient 사용하지 말 것. 단색 토큰만 (semantic-info-bg 등).",
    ],
  },
  Input: {
    name: "Input",
    summary:
      "1px 보더, 흰 배경, 48px 높이. label/wrapper(field+addon)/helper 의 compound 구조 (Figma Library node 171:9903 기준).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-9903",
    pitfalls: [
      "검색 변형이 필요하면 SearchInput을 사용. Input에 SearchIcon을 직접 박지 말 것.",
      "label/helper 의 typography 는 caption-2(12/16) — body3(14/20) 로 키우지 말 것. Figma 명세보다 크면 폼이 산만해짐.",
      "complete=true 와 errorMessage 를 동시에 주지 말 것 — error 가 우선이지만 success 의도가 묻힘.",
      "errorMessage/successMessage/helperText 중 하나라도 있으면 helpers 배열은 무시됨. 단일/멀티 의도를 분리해서 사용.",
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
    summary: "value/max 기반 진행도.",
    pitfalls: [
      "상태(주의/에러/성공)를 표현할 때는 color prop에 semantic 토큰 var(--semantic-*-main)을 넘겨 시각적 의미를 통일.",
    ],
  },
  Radio: {
    name: "Radio",
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
  Slider: {
    name: "Slider",
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
    summary: "5단계 기분 선택. EAP 앱 첫 화면 핵심 인터랙션. 기본 5개 옵션이 내장됨.",
    pitfalls: [
      "options를 직접 넘길 때 5개를 벗어나면 가로 폭 문제 — 4~6개가 권장 범위.",
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
    summary:
      "심리검사 결과 카드. score/maxScore + level(normal/mild/moderate/severe) + 색 자동 매핑.",
    pitfalls: [
      "level과 점수를 임의로 분리하지 말 것 — 외부에서 점수 → 단계 매핑이 검사마다 다르므로 호출부에서 결정해서 넘김.",
      'title prop은 검사명("PHQ-9" 등). HTMLDivElement.title과 충돌 방지를 위해 Omit되어 있으니 ReactNode 가능.',
      'severe인데 description만 있고 후속 액션이 없으면 안전. severe 결과엔 actionLabel("상담 연결") 또는 옆에 CrisisCallout을 같이 둘 것.',
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
    summary: "상담사 프로필 카드. 이름/자격/평점/태그/소개/예약 CTA. 1~2열 그리드에 잘 어울림.",
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
    summary: "복용약 한 줄 표시. 이름/용량/시기/노트 + 체크.",
    pitfalls: [
      "리스트로 쌓을 때는 부모에 gap 8~12px. MedicationItem은 자체 margin 없음.",
      "onTakenChange를 안 넘기면 체크박스가 안 보임 — 표시 전용으로 쓸 수 있음.",
      'times는 morning/noon/evening/bedtime 4개 enum만. 복약 시간을 분 단위로 보여주려면 note에 "식후 30분" 같이 텍스트로.',
    ],
    interactivePattern:
      '체크 후 즉시 토스트보다 리스트 상단에 "오늘 X/Y 복용 완료" 진행도 ProgressBar 표시가 더 동기 부여됨.',
  },
  AudioPlayer: {
    name: "AudioPlayer",
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
    summary:
      "가로 스와이프 슬라이더. 홈 배너, 콘텐츠 추천, 온보딩에 사용. drag/dots/autoplay/loop 내장.",
    pitfalls: [
      "정보 위계가 동등한 항목 N개를 보여주는 용도라면 캐러셀 대신 가로 스크롤 리스트가 더 나음 — 캐러셀은 한 번에 1개만 보임.",
      "autoplay만 켜고 loop를 안 켜면 마지막 슬라이드에서 멈춤. 둘 다 함께 사용.",
      "슬라이드 1~2장이면 캐러셀 의미 없음. 그냥 카드/배너로.",
      "슬라이드 안에 자체 가로 스크롤(예: 가로 리스트)을 넣으면 드래그 충돌. 세로 스크롤만 허용.",
    ],
    recommended: [
      "홈 배너: <Carousel autoplay={3000} loop indicator='dots'>",
      "이미지 갤러리: indicator='counter' (현재 N/M 표시)",
      "온보딩 3~5장: showArrows=false, indicator='dots'",
    ],
    interactivePattern:
      "activeIndex/onActiveIndexChange로 외부 동기화 가능. 드래그 임계값은 viewport 폭의 15%.",
  },
  VideoPlayer: {
    name: "VideoPlayer",
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
    summary: "연속 기록 트래커 카드. streak 숫자 + 최근 7~14일 점 그리드. 챌린지/습관 강화 화면.",
    pitfalls: [
      "days는 최근 7~14일이 시각적으로 적절. 30일 이상이면 EmotionHeatmap 사용 검토.",
      "streak=0 상태로 풀 너비 카드를 노출하면 동기 부여 효과가 약함 — 시작 단계에는 더 작은 EmptyState 안내가 좋음.",
      "오늘 데이터가 미완료일 때는 자동으로 점선 테두리(today)로 표시. 'today' 표시를 직접 만들지 말 것.",
    ],
    recommended: [
      "감정 기록 7일: days=[{date,label:'일',done}, ...] 7개",
      "복약 트래킹: icon prop 에는 @nudge-eap/icons 컴포넌트(예: PillIcon — find_icon('pill') 로 확인) 를 넘기고 숫자만 강조 (days 생략). icon prop 에 이모지 문자열 절대 금지.",
      "끊긴 후 재시작: footer로 '작은 시작' 같은 격려 문구",
    ],
  },
  EmotionHeatmap: {
    name: "EmotionHeatmap",
    summary: "월간 감정 히트맵. 5단계(0~4)를 색 강도로 시각화. 셀 클릭으로 그 날 상세 화면 진입.",
    pitfalls: [
      "entries에 없는 날짜는 자동으로 빈 셀(점선). 0 단계로 채우지 말 것 — treatZeroAsEmpty 기본 true.",
      "colors는 5개 필수 + 옅음→짙음 순서. 4개나 6개 넘기면 인덱스 어긋남.",
      "30일 미만 기록(7~14일)은 StreakCard가 더 적절 — 히트맵은 한 달 단위.",
    ],
    recommended: [
      "기분 트렌드: 기본 푸른 5단계, onCellClick으로 일기 화면 이동",
      "스트레스 강도: warm 톤(#FFE9C4 → #C25B0E), legendLabels={low:'차분',high:'활기'}",
      "챌린지 30일: title='30일 챌린지', 빈 셀이 남은 일자",
    ],
  },
  AppointmentCard: {
    name: "AppointmentCard",
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
    summary: "온보딩 dim 툴팁. 특정 DOM 영역을 강조 + 단계별 안내. Tooltip과 분리(가벼운 hover용).",
    pitfalls: [
      "단순 hover 설명용은 Tooltip을 쓸 것. CoachMark는 화면 전체 dim + 강제 가이드.",
      "target은 selector(string) 또는 element-getter 함수. 마운트 시점에 DOM에 존재해야 함.",
      "스크롤 필요한 위치를 가리키면 사전에 scrollIntoView 직접 호출 — CoachMark가 자동 스크롤 안 함.",
      "한 화면에 매번 띄우지 말 것 — 첫 진입/새 기능 출시 등 명시적 트리거에만.",
    ],
    recommended: [
      "첫 진입: steps 3~5개, 마지막 단계 후 onClose에서 localStorage 플래그 저장",
      "단일 안내: hideSkip + steps 1개",
      "도움말 재생: ref로 외부에서 step 제어",
    ],
  },
  Sparkline: {
    name: "Sparkline",
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
  WebHeader: {
    name: "WebHeader",
    summary:
      "데스크탑 Web 사이트용 글로벌 헤더. 좌측 클라이언트 로고 + 중앙 GNB + 우측 액션(앱 다운로드 / 로그인·로그아웃). 모바일 AppBar 와 별도 (Figma Library node 96:25923).",
    figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=96-25918",
    pitfalls: [
      "AppBar 와 혼동 금지 — AppBar 는 모바일 상단 바(52px, 뒤로가기/타이틀). WebHeader 는 데스크탑 헤더(80px, 1200px max-width, GNB).",
      "클라이언트 로고는 per-tenant 이미지라 src/href 를 prop 으로 주입. DS 가 로고 이미지를 갖고 있지 않다.",
      "브랜드(NudgeEAP / Trost / Geniet) 별 색은 tokens.css 로 자동 정렬 — primary main 이 한 군데 들어가 있어 별도 색 prop 불필요. 인라인 컬러로 덮어쓰지 말 것.",
      "메뉴 아이템에 활성 표시: activeKey 또는 MenuItem 의 active prop 사용 — 직접 border-bottom 인라인으로 그리지 말 것.",
    ],
    recommended: [
      "기본 사용: items 배열 + activeKey",
      "<WebHeader>\n  <WebHeader.Logo src=tenantLogo href='/' alt='AMORE PACIFIC' />\n  <WebHeader.Menu items={GNB} activeKey={current} onItemClick={navigate} />\n  <WebHeader.Actions>\n    <WebHeader.AppDownloadButton href='/download' />\n    <WebHeader.AuthButton authState={isLoggedIn ? 'logout' : 'login'} onClick={...} />\n  </WebHeader.Actions>\n</WebHeader>",
      "회원/비회원 토글: authState='login' (비회원) / 'logout' (로그인 상태)",
      "앱 다운로드 버튼이 필요 없으면 WebHeader.AppDownloadButton 만 빼면 됨 — Actions 컨테이너는 유지",
    ],
    sizeMatrix: {
      header: "height 80 / bottom border 1px (#ECECEC) / content max-width 1200, 좌우 24 padding",
      logo: "height 60 / max-width 200 / object-fit contain",
      "menu-item":
        "h 79(헤더 -1) / px 20 / headline-5(18·26) bold / 활성 시 primary 색 + bottom 3px",
      "download-btn": "px 14 / py 8 / radius 8 / bg neutral/100 / body-1 bold primary",
      "auth-btn": "px 18 / py 8 / radius 8 / 1px primary border / body-1 bold primary",
    },
    stateMatrix: {
      "menu-item/default": "color #111 (text.normal)",
      "menu-item/hover": "color primary main",
      "menu-item/active": "color primary main + 3px primary 하단 보더",
      "download/hover": "bg neutral/200 (#ECECEC)",
      "auth/hover": "bg primary.bgLighter (#F1F8FD)",
    },
    accessibility: [
      "Logo 는 <a href> 로 감싸 홈 진입 보장. alt 에 클라이언트 이름 명시 (예: 'AMORE PACIFIC').",
      "Menu 는 <nav> 로 노출 — 각 item 은 href 가 있으면 <a>, 없으면 <button>. onItemClick 호출 시 href 있는 경우 preventDefault 자동.",
      "AuthButton 은 authState 가 의미 라벨('로그인'/'로그아웃')을 결정. aria-label 자동 부착.",
    ],
    interactivePattern:
      "Logo / Menu / Actions 안의 모든 버튼·링크에 onClick 또는 href 부착 필수. position='sticky' 로 스크롤 시 상단 고정도 가능 (z-index 자동).",
  },
  PageHeader: {
    name: "PageHeader",
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
    summary: "메트릭 강조 카드. 라벨 + 큰 숫자/단위 + delta(변화량) + Sparkline 슬롯(trailing).",
    pitfalls: [
      "trend만 주고 delta를 빼면 trend 색이 의미 없어짐. 둘 다 함께 사용.",
      "그리드에서 카드마다 value 자릿수 차이가 크면 baseline이 흔들림 — 동일 단위로 통일.",
      "trailing에 Sparkline을 넣을 때 width 100~120, height 36~48 정도가 적절. 그 이상은 카드 균형 깨짐.",
    ],
    recommended: [
      "대시보드 4-up 그리드: <StatCard label, value, unit, delta, trend>",
      "리포트 hero: + icon으로 강조",
      "추이 시각화: trailing={<Sparkline />} 결합",
    ],
  },
  QuickActionGrid: {
    name: "QuickActionGrid",
    summary: "홈 빠른 액션 그리드. 4~6칸 아이콘+라벨, 배지 지원. 4칸이 기본 균형.",
    pitfalls: [
      "라벨이 길면 줄바꿈됨. 4글자 이하 권장.",
      "5칸은 배치가 어색 — columns=4 + 8개(2행) 또는 columns=3 사용.",
      "배지는 알림 카운트(숫자) 또는 짧은 라벨('N','NEW') 위주. 긴 텍스트 X.",
      "아이콘은 이모지가 가장 단순하지만, 통일된 톤이 필요하면 SVG icon 컴포넌트로 교체.",
    ],
    recommended: [
      "홈 진입: 4칸 (감정기록 / 상담 / 챌린지 / 콘텐츠)",
      "시간대별 명상: iconBg로 시간대 톤 표현",
      "알림 진입: badge='3' 같은 미읽음 카운트",
    ],
  },
  TagInput: {
    name: "TagInput",
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
    summary: "presence 점 (online/away/busy/offline). online은 자동 펄스 애니메이션.",
    pitfalls: [
      "online에 별도 강조 효과 추가하지 말 것 — 자동 펄스 있음.",
      "아바타 우하단에 올릴 때 부모 position:relative + 점 position:absolute.",
    ],
    recommended: ["상담사 리스트: showLabel=true로 텍스트 함께", "아바타 점: 라벨 없이 size=10"],
  },
  ReactionPicker: {
    name: "ReactionPicker",
    summary: "콘텐츠 반응 칩 그룹. 이모지 + 카운트, 다중 또는 단일 선택, hideCount 옵션.",
    pitfalls: [
      "value는 single이어도 string[] (길이 0~1) — 일관된 형태로 처리.",
      "options.count가 undefined면 자동 숨김. 0은 표시됨.",
      "옵션 4~6개 권장. 8개 이상이면 가로 폭 부담.",
    ],
    recommended: [
      "콘텐츠 좋아요/응원: 다중 선택 + 카운트 표시",
      "사용자 한 표: single + hideCount",
    ],
  },
  GreetingHeader: {
    name: "GreetingHeader",
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
    summary: "이미지 자르기 (circle/square). 드래그+줌, ref.toDataURL()로 PNG 추출.",
    pitfalls: [
      "외부 이미지(https) 자르기는 CORS 헤더 필요 — 서버 응답에 Access-Control-Allow-Origin 없으면 dataURL이 비어나옴.",
      "outputSize는 보통 200~400 — 너무 작으면 화질 저하.",
      "CSS transform 기반 변환이라 매우 큰 이미지(>4000px)는 모바일에서 끊길 수 있음.",
    ],
    recommended: ["프로필 사진: shape='circle' outputSize=200", "커버: shape='square' size=320"],
  },
  PullToRefresh: {
    name: "PullToRefresh",
    summary: "모바일 풀 투 리프레시. 화면 최상단에서 당기면 onRefresh, Promise 종료 자동 처리.",
    pitfalls: [
      "scrollTop > 0이면 트리거 X — 항상 최상단에서만 동작 (의도적).",
      "데스크톱에서 패턴이 어색 — 모바일 우선 화면에만.",
      "threshold가 너무 작으면 일반 스크롤도 잘못 인식. 64~96 권장.",
    ],
    recommended: [
      "리스트 새로고침: onRefresh={async () => { await refetch(); }}",
      "라벨 커스텀: pullLabel='당겨서 일기 동기화'",
    ],
  },
  WaveformPlayer: {
    name: "WaveformPlayer",
    summary:
      "음성 메시지 재생 (파형 시각화). AudioPlayer가 트랙바 형태라면 WaveformPlayer는 컴팩트 메시지용.",
    pitfalls: [
      "peaks 미지정 시 src 기반 의사 랜덤 — 정확한 파형이 필요하면 서버 메타데이터로 전달.",
      "긴 콘텐츠(>5분)는 AudioPlayer가 더 적합.",
      "막대 개수(bars)는 32~48 권장. 너무 많으면 모바일에서 막대가 1px 미만으로 줄어듦.",
    ],
    recommended: [
      "채팅 음성 메시지: 기본 사용",
      "내 메시지: color=primary, 상대 메시지: color='#666'",
    ],
  },
  MentionInput: {
    name: "MentionInput",
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
    summary: "별점 후기 카드 (0.5 단위). 작성자/별점/본문/태그/푸터 슬롯, verified 인증 마크.",
    pitfalls: [
      "rating은 0~5, 0.5 단위. 범위 밖이면 시각적으로 깨짐.",
      "본문 줄바꿈은 white-space: pre-wrap 자동 — body에 \\n 그대로 사용.",
      "footer는 보통 LikeButton/도움됨 버튼. 자유 슬롯이라 텍스트도 가능.",
    ],
    recommended: [
      "상담 후기: verified + tags=['편안함','전문성']",
      "상품 리뷰: meta='구매 인증' + verified",
    ],
  },
  VotePoll: {
    name: "VotePoll",
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
    summary: "상품 그리드 한 칸. 썸네일 1:1 + 뱃지 + 제목 + 가격 슬롯(PriceTag) + 품절 오버레이.",
    pitfalls: [
      "가격은 price 슬롯에 <PriceTag /> 직접 — 문자열 넣으면 포맷 일관성 깨짐.",
      "품절은 soldOut. badge(좌상단 NEW/BEST)와 다른 오버레이.",
      "title은 자동 2줄 클램프. 더 길게 보여주려면 디테일 화면.",
    ],
    recommended: [
      "굿즈 그리드: 2칸/3칸, PriceTag size='sm'",
      "추천 캐러셀: ProductCard + Carousel 결합",
    ],
  },
  CouponCard: {
    name: "CouponCard",
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
      "Display/Headlines: Bold(700), 18~52px",
      "Body: Medium~Regular, 14~16px",
      "Caption: Regular, 11~13px",
      "한 화면에 2~3개 웨이트만 사용 (3개 이상 혼용 금지)",
    ],
  },
  spacing: {
    base: 4,
    scale: [4, 8, 10, 12, 16, 20, 24],
    rules: [
      "4pt grid 기반. Gap(요소 간 거리)과 Inset(컨테이너 내부 여백)을 명확히 구분한다.",
      "Gap 은 의도 기반 시멘틱 토큰만 사용: --gap-tight(4) / --gap-default(10, 표준) / --gap-comfortable(12) / --gap-loose(16) / --gap-wide(24).",
      "헤딩 ↔ 서브타이틀 간격은 level 기반 토큰 사용: --gap-title-h1(12) / -h2(12) / -h3(12) / -h4(6, ★ 카드 헤딩) / -h5(8, ★ 서브 헤딩). 임의 margin/spacing 직접 지정 금지.",
      "Inset 은 사용처 기반 시멘틱 토큰만 사용: --inset-chip(8) / --inset-input(12) / --inset-card(16, 표준) / --inset-card-large(20) / --inset-modal(24).",
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
    "Primary 색상은 화면당 가장 중요한 1개 액션에만 사용",
    "강조 장치는 화면당 우선순위가 가장 높은 영역에 집중하고, 안내/보조 영역은 기본적으로 neutral surface를 사용",
    "텍스트 대비비 WCAG AA (4.5:1) 이상 유지",
    "터치 타겟은 최소 44px 보장",
    "4pt 그리드에 맞춰 간격 설정. Gap(요소 간)과 Inset(컨테이너 내부)을 구분해 항상 semantic 토큰(--gap-* / --inset-*) 사용",
    "Brand background(--semantic-bg-brand-*)는 주의/안내/하이라이트 의미 전달이 필요할 때만, 한 화면당 1개 이내로 사용 — 자세히는 get_guide({ topic: 'pattern:surface-layer' })",
    "인터랙티브 요소(Button/IconButton/Card.Root clickable/Tabs)에는 onClick 등 핸들러를 반드시 부착",
    "표준 variant에 없는 톤이 필요하면 컴포넌트의 style/icon 같은 확장 슬롯을 활용 (raw 요소로 대체 금지)",
    "단독 아이콘은 주변 텍스트/배경과 어울리는 토큰 컬러를 명시하거나 부모 color를 토큰으로 지정해 currentColor가 의도한 색을 상속하게 함",
    "아이콘은 행동/상태/affordance 전달 목적에만 사용 — 화이트리스트와 검증 룰은 get_guide({ topic: 'pattern:icon-usage' })",
    "Tab 은 동일 depth 콘텐츠 전환·category navigation·section switching 에만 사용 — 필터/CTA/라우팅 대체용 금지",
    "Modal 은 즉각적 판단/응답이 필요할 때만 사용 — 단순 정보는 inline Notice/Banner, 에러는 Toast/inline error 사용",
    "Badge 는 보조 정보 — 일반 카테고리는 ghost/line + neutral 우선, Brand color 는 '현재 선택·핵심 강조' 에만",
    "브랜드 모드(brand='geniet'/'trost' 등)에서 작업할 때, 해당 브랜드 prefix 의 아이콘(예: `GenietRecordOnIcon`, `GenietGpointIcon`)이 존재하면 공용 아이콘보다 **우선 사용**. find_icon 결과에 brand prefix 가 보이면 그 브랜드 모드에서는 그 쪽이 정답. 사용 가능한 브랜드 아이콘 목록은 get_brand_info(slug).brandIcons 로 조회.",
    "브랜드 분기는 공통 컴포넌트 구현이 아니라 **브랜드 전용 화면/스토리** 에서 처리 — 브랜드 화면이 명시적으로 `Geniet*Icon` 을 import 해 컴포넌트의 icon prop 으로 전달. (예: `<AppFooter tabs={[{ icon: <GenietRecordOnIcon /> }]} />`)",
  ],
  donts: [
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
    "Primitive spacing(--spacing-N) / 임의 px (5/7/9/11/13/15) 사용 금지 — 반드시 --gap-* / --inset-* semantic 토큰으로 표현",
    "Inset(내부 여백) 자리에 Gap 토큰 사용 금지 (또는 그 반대) — padding 자리에 --gap-*, gap 자리에 --inset-* 쓰지 않기",
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
    "Bold 를 한 화면에서 5곳 이상 남발하지 마세요 — Bold 는 '가장 중요한 1~2 곳' 에만",
    "같은 화면에 h1 / h2 같은 큰 제목을 2개 이상 두지 마세요 — 한 화면당 최상위 헤딩은 1개. 보조 섹션은 h3 이하",
    "hierarchy 가 불명확한 텍스트 위계를 만들지 마세요 — 인접한 두 영역의 텍스트가 같은 fontSize × fontWeight 이면 위계가 무너짐",
    // ── Decorative Surface Abuse ──
    "section 구분을 색상만으로 해결하지 마세요 — 1차는 spacing(--gap-loose/wide), 2차는 Divider/Border, 마지막에 surface tone. 색으로만 나누면 색맹/저시력 사용자가 길을 잃습니다",
    "decorative background(임의 pastel/tinted surface)를 만들지 마세요 — 모든 bg 는 `--semantic-bg-*` 토큰 안에서. 분위기를 위해 옅은 색을 깔지 마세요",
    // ── Fake Dashboard Disease ──
    "의미 없는 KPI 카드/메트릭 그리드를 만들지 마세요 — 숫자 표시는 사용자가 의사결정에 쓸 때만",
    "장식용 chart/graph 를 추가하지 마세요 — 데이터가 실제 인사이트를 주지 않으면 Sparkline 한 줄로 충분. Generic SaaS dashboard 톤 피하세요",
    "장식 중심 hero section(큰 일러스트 + 큰 카피 + gradient 배경)을 만들지 마세요 — EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선",
    // ── Everything Has an Icon ──
    "한 화면에 여러 icon 스타일(선/면/colorful)을 혼용하지 마세요 — `@nudge-eap/icons` 단일 셋만",
    "colorful/멀티컬러 아이콘을 본문 UI 에 과다 사용하지 마세요 — DS icon 은 currentColor monochrome 이 원칙. brand color icon 은 진입점 1~2 개에만",
    // ── Spacing Randomness 보강 ──
    "같은 depth(부모 컨테이너 안의 형제 요소들) 에 서로 다른 spacing 을 적용하지 마세요 — 형제는 같은 --gap-* 으로 통일",
    // ── Brand Icon ──
    "공통 컴포넌트(AppFooter/BottomNav/AppBar 등) 의 *구현* 안에 brand 분기 로직(`if (brand === 'geniet') return <GenietRecordOnIcon />`)을 넣지 마세요 — DS 컴포넌트는 brand-agnostic 으로 유지. 분기는 사용처(브랜드 전용 화면)에서 명시적 icon prop 으로 표현.",
    "브랜드 모드인데 공용 아이콘(`HomeIcon`/`CouponIcon` 등) 을 그대로 쓰지 마세요 — 같은 의미의 brand prefix 아이콘이 있으면 그게 우선. get_brand_info(slug).brandIcons 로 매칭 확인.",
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
      rule: "한 화면에 Bold 텍스트 5곳 이상 사용 금지 — Bold 는 화면당 1~2개 핵심에만. 본문은 Regular/Medium.",
    },
    {
      name: "mixed-icon-style",
      rule: "한 화면에 여러 icon 스타일(선/면/colorful) 혼용 금지 — `@nudge-eap/icons` 단일 셋만. 외부 콜렉션·이모지·multi-color SVG 섞지 마세요.",
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
  metrics?: Record<string, string | number>;
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
 *     (예: Geniet bottom nav → `GenietRecordOnIcon`/`GenietRecordOffIcon`, 공용 PushActiveIcon X)
 *   - 사용 가능한 brand 아이콘 목록은 `get_brand_info(slug).brandIcons` 로 조회.
 *   - 매칭이 없으면 공용 아이콘 fallback 으로 사용 (예: `LikeIcon` 은 Geniet 매칭 없음 → 공용 OK).
 *
 * **컴포넌트 구현(공통 DS) 에서는:**
 *   - brand 분기 로직(`if (brand === 'geniet')`)을 컴포넌트 안에 박지 않는다.
 *   - DS 컴포넌트는 brand-agnostic 유지, 브랜드 전용 화면이 명시적으로 icon prop 으로 전달.
 *     예: `<AppFooter tabs={[{ key: 'record', icon: <GenietRecordOnIcon /> }]} />`
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
  GenietRecordOnIcon: { category: "action", style: "filled", pair: "GenietRecordOffIcon" },
  GenietRecordOffIcon: { category: "action", style: "line", pair: "GenietRecordOnIcon" },
  GenietPlayIcon: { category: "media", style: "filled" },
  GenietCheckcircleIcon: { category: "state-reaction", style: "filled" },
  GenietConfettiIcon: { category: "state-reaction", style: "filled" },
  GenietCouponIcon: { category: "location", style: "line" },
  GenietCashreviewIcon: { category: "eap-service", style: "filled" },
  GenietGpointIcon: { category: "eap-service", style: "filled" },

  // ── Geniet bottomnavi / header (Figma 지니어트-Dev 207:3204 / 207:2483) ──
  GenietHomeOnIcon: { category: "navigation", style: "filled" },
  GenietWriteOffIcon: { category: "action", style: "line" },
  GenietBenefitOnIcon: { category: "eap-service", style: "filled", pair: "GenietBenefitOffIcon" },
  GenietBenefitOffIcon: { category: "eap-service", style: "line", pair: "GenietBenefitOnIcon" },
  GenietReviewOnIcon: { category: "eap-service", style: "filled", pair: "GenietReviewOffIcon" },
  GenietReviewOffIcon: { category: "eap-service", style: "line", pair: "GenietReviewOnIcon" },
  GenietCommunityIcon: { category: "navigation", style: "line" },
  GenietSearchIcon: { category: "navigation", style: "line" },
};

/** 카테고리별로 아이콘 이름을 묶은 인덱스. find_icon / list_icons 응답 보강용. */
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
      "아이콘만 별도 강한 색으로 튀게 하지 않는다. 강조가 필요하면 텍스트, 배경, 아이콘 중 1~2개만 함께 조합한다.",
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
      "기본 사이즈는 24px. 인터페이스 용도에 맞춰 12 / 16 / 20 / 24 / 32 / 48 px의 6단계만 사용한다. 최소 사이즈는 12px.",
      "15px 이하의 작은 사이즈에서는 시각 복잡도를 낮추기 위해 Fill(Filled) 스타일을 우선 사용한다. (Line은 얇은 선이 손상되어 보임)",
      "기본 액션·내비게이션 아이콘은 Line(Stroke) 스타일을 우선한다. 현재 활성 상태(GNB 활성 탭, 좋아요 ON 등)와 강조용 단일 아이콘은 Filled를 사용한다.",
      "한 화면에서 Line 과 Filled 를 같은 의미 그룹 안에서 섞지 않는다. 같은 GNB · 같은 카드 리스트 · 같은 툴바 안에서는 한쪽으로 통일한다.",
      "단독 아이콘 버튼(IconButton 포함)의 터치 영역은 최소 40px. 사이즈별 권장: 20px 아이콘 → 40px touch, 24px 아이콘 → 44px touch. 40px 미만은 접근성 위반.",
      "아이콘 자체에 padding 을 직접 주지 말고 IconButton 의 size prop 또는 부모 컨테이너 padding/min-width 로 터치 영역을 확보한다.",
      "네이밍 컨벤션: 기본 Line = `XIcon`, Filled 짝 = `XActiveIcon` 또는 `XOnIcon` (예: HomeIcon ↔ HomeActiveIcon, SleepmodeOffIcon ↔ SleepmodeOnIcon). 짝 정보는 ICON_METADATA[name].pair 로 확인.",
      "카테고리 8종(basic / navigation / action / media / state-reaction / location / eap-service / color)은 의미 분류일 뿐 강제 import 경로 분리가 아니다. find_icon 결과의 카테고리는 유사 의미 후보를 찾는 힌트로 사용.",
      "컬러(다색) 카테고리 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger, Siren) 전용이다. 일반 UI 강조에 색 아이콘을 끼워 넣지 않는다.",
      "필요한 아이콘이 없으면 인라인 `<svg>`를 만들지 말고 `packages/icons/svg/`에 kebab-case 로 SVG 를 추가한 뒤 `pnpm --filter @nudge-eap/icons build` 로 컴포넌트를 재생성한다. viewBox 는 0 0 24 24, stroke/fill 은 `currentColor` 로 유지.",
    ],
    avoid: [
      "12 / 16 / 20 / 24 / 32 / 48 외의 임의 사이즈 (예: 18px, 22px) 사용",
      "12px 미만 아이콘",
      "15px 이하에서 가는 Line 스타일을 그대로 사용 — Filled 로 교체",
      "동일 화면 / 동일 그룹에서 Line + Filled 스타일 혼용",
      "단독 IconButton 의 터치 영역을 40px 미만으로 두기",
      "아이콘 컴포넌트를 인라인 `<svg>` 로 직접 작성하기 — `@nudge-eap/icons` 사용",
      "컬러(다색) 아이콘에 color prop 강제 적용 — 다색 표현이 어긋남",
    ],
    metrics: {
      sizeScale: "12 / 16 / 20 / 24 / 32 / 48 px",
      defaultSize: "24px",
      minSize: "12px",
      fillThreshold: "≤15px 권장 스타일 = Filled",
      minTouchArea: "40px",
      touchAreaIcon20: "40px",
      touchAreaIcon24: "44px",
      figmaNodeUrl: "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=379-490",
      categories: "basic, navigation, action, media, state-reaction, location, eap-service, color",
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
          "**Section 구분, 색상 단독 금지** — 영역 구분은 1차 spacing(--gap-loose/wide) → 2차 Divider/Border → 마지막에 surface tone 순서로. 색만으로 나누면 색맹·저시력 사용자가 구조를 잃는다.",
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
          "**Bold 남발 금지** — Bold 텍스트는 화면당 1~2 곳에만. 5곳 이상이면 위계가 사라지고 모든 글자가 평등해진다. 본문은 Regular/Medium.",
          "**최상위 헤딩 중복 금지** — h1/h2 같은 큰 제목은 화면당 1개. 보조 섹션은 h3 이하로 내려야 페이지 안에서 '어디가 본론' 인지 보인다.",
          "**위계 불명 텍스트 금지** — 인접한 두 영역이 같은 fontSize × fontWeight 이면 위계가 무너진다. 헤딩과 본문의 시각적 차이를 항상 만든다.",
          "**폰트 웨이트 3개 이상 혼용 금지** — 한 화면에 2~3개 웨이트만. Display(Bold) · Body(Medium/Regular) · Caption(Regular) 정도가 표준.",
        ],
      },
      {
        heading: "아이콘",
        items: [
          "**아이콘 스타일 혼용 금지** — 같은 화면/그룹 안에 Line · Filled · Colorful 아이콘을 섞지 않는다. `@nudge-eap/icons` 단일 셋만, 같은 그룹은 한 스타일로 통일.",
          "**장식용 헤딩 아이콘 금지** — 서브타이틀(h3/h4) · Form Label · 본문 텍스트 앞 장식 아이콘 금지. 일부 헤딩에만 아이콘이 붙으면 위계가 깨진다. 한 화면 헤딩 앞 아이콘 5개 이상은 자동 위반.",
          "**Color icon 본문 남용 금지** — multi-color/colorful 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger 등) 와 진입점 1~2개에만. 일반 UI 강조에는 monochrome currentColor 만 사용.",
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
      "프롬프트에 이미지, 스크린샷, Figma 링크, figmaNodeUrl 이 있으면 그것을 우선 시각 기준으로 사용한다.",
      "시각 레퍼런스가 없으면 목업 작성 전에 사용자에게 Figma 링크 또는 정답/오답 스크린샷을 요청한다.",
      "권장 세트는 정답 3~5장 + 오답 3~5장. 각 레퍼런스는 '왜 맞는지/틀린지' 1줄 캡션을 붙인다.",
      "레퍼런스를 받은 뒤에는 brandTone 문장보다 레퍼런스 캡션을 우선한다.",
    ],
    avoid: [
      "레퍼런스 없이 '차분한/전문적인/친근한' 같은 형용사만 보고 화면 생성",
      "정답 이미지만 받고 오답 기준 없이 작업",
      "이미지의 색감만 따라 하고 정보 밀도, 강조 장치 수, CTA 위계를 무시",
    ],
    referenceInputs: {
      accepted: [
        "Figma design URL 또는 figmaNodeUrl",
        "정답 스크린샷 이미지",
        "오답 스크린샷 이미지",
        "프롬프트에 첨부된 이미지/링크",
      ],
      minimum: "최소 정답 1장 + 오답 1장. 가능하면 총 6~10장.",
      format: "[good|bad] source=<figma-url|image-name> caption=<1-line reason>",
      fallbackQuestion:
        "시각 기준으로 쓸 Figma 링크나 스크린샷을 받을 수 있을까요? 가능하면 정답 3~5장, 피해야 할 오답 3~5장에 각각 1줄 캡션을 붙여 주세요. 이미 프롬프트에 이미지나 Figma 링크가 있다면 그 자료를 기준으로 진행하겠습니다.",
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
      recommendedReferenceCount: "6~10",
      minGoodReferences: 1,
      minBadReferences: 1,
      recommendedGoodReferences: "3~5",
      recommendedBadReferences: "3~5",
      captionLength: "1 line",
      preferFigmaNodeUrl: "true",
    },
  },
  notice: {
    name: "notice",
    summary: "안내문/콜아웃/알림 영역의 강조 예산.",
    rules: [
      "안내문은 기본적으로 neutral surface와 본문 텍스트로 처리.",
      "주의/성공/오류처럼 의미가 명확한 경우에만 semantic color 사용.",
      "한 안내 영역에는 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 최대 2개만 사용.",
      "그라데이션은 금지. 캠페인/히어로가 아닌 안내문에는 단색 토큰만 사용.",
      "새로 생긴 섹션이라는 이유만으로 배경색/아이콘/배지를 추가하지 않음.",
    ],
    avoid: [
      "gradient + icon + badge + bold headline 동시 사용",
      "일반 안내문에 Chip으로 '안내', '추천', '확인' 라벨 반복",
      "안내 박스 안에 다시 강조 카드/강조 배지를 중첩",
    ],
    metrics: {
      maxColoredNoticePerScreen: 1,
      maxEmphasisDevicesPerNotice: 2,
    },
  },
  dropdown: {
    name: "dropdown",
    summary: "Select/Dropdown 옵션 수에 따른 높이와 검색 정책.",
    rules: [
      "옵션 7개 이하는 일반 Select.",
      "옵션 8~15개는 max-height 320px 안팎의 스크롤 목록.",
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
      "Gap (요소 간 거리) — 의도 기반 5단계만 사용:\n  · `--gap-tight` (4px) → Chip · Badge 그룹\n  · `--gap-default` (10px) ★ 표준 컴포넌트 gap\n  · `--gap-comfortable` (12px) → 폼 필드 · 세그먼트\n  · `--gap-loose` (16px) → 컴포넌트 ↔ 컴포넌트\n  · `--gap-wide` (24px) → 큰 영역 ↔ 큰 영역",
      "Inset (컨테이너 내부 여백) — 사용처 기반 5단계만 사용:\n  · `--inset-chip` (8px) → Chip · Badge 내부 padding\n  · `--inset-input` (12px) → Input · 작은 컨테이너 padding\n  · `--inset-card` (16px) ★ 카드 표준 padding\n  · `--inset-card-large` (20px) → 큰 카드 padding\n  · `--inset-modal` (24px) → Modal · 통계 박스 padding",
      "결정 트리 — 내부 여백(padding)인지 요소 간격(gap)인지 먼저 판단한 뒤 위 토큰 중 하나로 매핑한다. 모호하면 표준값(`--gap-default` 10px / `--inset-card` 16px)을 우선.",
      "같은 깊이·같은 의도의 간격은 항상 같은 토큰을 쓴다 — 한 화면 내 카드들이 모두 16px padding 이면 모두 `--inset-card` 로.",
      "Primitive(--spacing-N) 는 토큰 정의용. UI 코드에서는 직접 사용 금지 — 반드시 `--gap-*` / `--inset-*` 를 거친다.",
      "임의 px 사용 금지: 5 / 7 / 9 / 11 / 13 / 15px 는 4pt 위반이므로 토큰으로 대체할 것.",
      "Inset 자리에 Gap 토큰 사용 / Gap 자리에 Inset 토큰 사용 금지 — padding 에 `--gap-*`, flex/grid gap 에 `--inset-*` 쓰지 않는다.",
    ],
    avoid: [
      "padding: 14px / margin: 11px 같은 raw px 직접 사용",
      "padding 에 `--gap-default` 사용 / gap 에 `--inset-card` 사용 (역할 혼동)",
      "한 화면에 카드마다 다른 padding 토큰 사용 (일관성 손상)",
      "spacing 대신 색 배경 / border 만으로 영역 구분",
      "var(--spacing-12) 같은 primitive 토큰을 UI 코드에서 직접 사용",
    ],
    metrics: {
      gridBase: "4pt",
      gapDefault: "--gap-default (10px)",
      insetDefault: "--inset-card (16px)",
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
    ],
    metrics: {
      maxHeadingIconsPerScreen: 4,
      allowedLocations:
        "AppBar buttons / Bottom Tab / IconButton / 카테고리 그룹 / 상태 아이콘 / Form field affordance",
      consistencyRule: "same-hierarchy-text → same-icon-decision",
      relatedPatterns: "icon-color, iconography",
    },
  },
};
