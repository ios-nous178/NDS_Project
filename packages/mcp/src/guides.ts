/**
 * 컴포넌트별 사용 가이드 — d.ts 파싱만으로는 잡히지 않는
 * "이 컴포넌트를 어떻게 써야 하는가"의 큐레이션된 지식.
 *
 * 추가 기준:
 * - DS 매트릭스를 잘못 해석해 시각적 함정에 빠지는 경우(예: assistive solid)
 * - 슬롯/내부 padding 등 이미 적용된 스타일과 충돌 가능성
 * - 표준 variant에 없는 톤이 필요할 때 확장 슬롯 사용 패턴
 */

export interface ComponentGuide {
  name: string;
  summary: string;
  pitfalls: string[];
  recommended?: string[];
  colorMatrix?: Record<string, string>;
  interactivePattern?: string;
}

export const COMPONENT_GUIDES: Record<string, ComponentGuide> = {
  Button: {
    name: "Button",
    summary: "1차/2차 CTA. color × variant 매트릭스 조합으로 톤 결정.",
    pitfalls: [
      "color='assistive' + variant='solid'은 cool-gray 배경(#9CA2AE)이라 비활성 버튼처럼 보임. 활성 CTA로 사용 금지.",
      "primary 색은 화면당 가장 중요한 1개 액션에만 사용 (DESIGN.md Do's). 한 화면에 두 개 이상 primary 솔리드 = 위계 붕괴.",
      "파란 카드 위에 두는 CTA는 'secondary' solid (흰 배경 + 파란 글씨)가 대비 안전. 'assistive' solid는 거의 안 보임.",
    ],
    recommended: [
      "1차 CTA: color='primary', variant='solid'",
      "보조 액션: color='primary', variant='outlined' 또는 'soft'",
      "파괴 액션: color='error', variant='solid'",
      "비활성처럼 회색을 의도한 경우라면 disabled prop을 쓰고, '어두운 회색 솔리드'로 인상을 주려고 assistive를 솔리드로 쓰지 말 것",
    ],
    colorMatrix: {
      "primary/solid": "primary fill + 흰 텍스트 — 가장 중요한 CTA",
      "primary/outlined": "흰 배경 + primary 보더/텍스트 — 보조 액션",
      "primary/soft": "primary 25 배경 + primary 텍스트 — 3차 액션",
      "secondary/solid": "magenta 또는 흰배경 + 컬러 텍스트(브랜드 매트릭스 따름) — 강조",
      "assistive/solid": "cool-gray 400 배경 — 비활성처럼 보임. 사용 자제",
      "error/solid": "error fill — 파괴 액션 한정",
    },
    interactivePattern:
      "버튼은 onClick 핸들러를 항상 부착. 목업에서도 라우팅 시뮬(toast/console.log)이라도 넣을 것.",
  },
  IconButton: {
    name: "IconButton",
    summary: "아이콘만 있는 버튼. 접근성을 위해 aria-label 필수.",
    pitfalls: [
      "aria-label 누락 시 스크린리더가 읽지 못함.",
      "AppBar 우측 빈 영역에 아이콘이 들어갈 자리에 ChevronRight 같은 장식만 두면 인터랙션이 없는 채로 시각적 잡음만 발생.",
    ],
    recommended: [
      "AppBar 우측엔 알림/설정 같은 실제 기능 IconButton을 두기.",
      "<IconButton icon={<PushIcon/>} aria-label='알림' onClick={...}>",
    ],
  },
  TextButton: {
    name: "TextButton",
    summary: "텍스트만으로 된 액션. '전체보기' 같은 인라인 링크에 적합.",
    pitfalls: [
      "단순 <span>으로 만들지 말 것 — DS TextButton에 호버/포커스/접근성 처리가 들어있음.",
    ],
  },
  Card: {
    name: "Card",
    summary: "Compound 컴포넌트. Card.Root / Header / Body / Footer / Thumbnail 슬롯 구성.",
    pitfalls: [
      "Card.Header / Card.Body / Card.Footer는 styles.css에서 자체 padding을 가짐(대략 16/16/0, 12/16, 0/16/16). 외곽에 padding을 또 주면 이중 패딩으로 어긋남.",
      "Card.Title / Card.Subtitle의 기본 폰트 크기가 작음. Hero 카드에서 큰 점수 표시 등에는 슬롯 대신 div + 토큰으로 직접 구성이 가독성 ↑.",
      "그림자(elevation)와 보더를 동시에 적용하면 이중 계층 (DESIGN.md Don'ts).",
    ],
    recommended: [
      "단순 정보 카드: <Card.Root><Card.Header><Card.Title>...</Card.Title></Card.Header><Card.Body>...</Card.Body></Card.Root>",
      "클릭 가능 카드: <Card.Root clickable onClick={...}> — DS의 hover 효과가 자동 적용됨.",
      "큰 시각 강조가 필요한 Hero 카드는 슬롯 대신 div로 본문 직접 구성하고 토큰으로 typography 세팅.",
    ],
    interactivePattern:
      "Card.Root는 'clickable' prop과 onClick으로 인터랙티브화. 카드 내부에 또 별도 button을 두면 이벤트 버블링 주의.",
  },
  Chip: {
    name: "Chip",
    summary: "pill 형태 라벨. variant: outlined/filled/soft. label prop 필수.",
    pitfalls: [
      "label prop을 빠뜨리고 children을 넣지 말 것 — DS API와 어긋남.",
      "표준 variant에 없는 톤(예: caution, success)이 필요해도 raw <span>/<div>로 대체 금지. style prop으로 background/color/font-weight를 토큰 변수로 override + icon prop으로 좌측 도트 주입이 정공법.",
    ],
    recommended: [
      "주의 톤: <Chip label='주의 필요' variant='filled' shape='pill' size='sm' icon={<span style={{width:6,height:6,borderRadius:9999,background:'var(--color-semantic-caution-main)'}}/>} style={{background:'var(--color-semantic-caution-bg)',color:'var(--color-semantic-caution-text)',fontWeight:600}} />",
      "성공/에러도 같은 패턴으로 토큰 var()만 교체",
    ],
  },
  Modal: {
    name: "Modal",
    summary: "중앙 정렬 다이얼로그. 12px radius, 24px padding, 50% overlay.",
    pitfalls: [
      "Modal 내부에 다시 큰 그림자/보더를 추가하지 말 것 (이미 elevation md 적용됨).",
      "ESC/오버레이 클릭으로 닫히는 기본 동작을 막으면 접근성 저해.",
    ],
  },
  Tabs: {
    name: "Tabs",
    summary: "line/pill/square 3가지 variant. items + activeKey + onTabChange.",
    pitfalls: [
      "items 형식은 {key, title}[]. label 같은 다른 키 이름 사용 시 렌더 실패.",
      "변경 핸들러는 onTabChange (onChange 아님).",
    ],
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
    summary: "1px 보더, surface 배경, 48px 높이. 라벨/헬퍼/아이콘 슬롯.",
    pitfalls: ["검색 변형이 필요하면 SearchInput을 사용. Input에 SearchIcon을 직접 박지 말 것."],
  },
  ProgressBar: {
    name: "ProgressBar",
    summary: "value/max 기반 진행도.",
    pitfalls: [
      "상태(주의/에러/성공)를 표현할 때는 color prop에 semantic 토큰 var(--color-semantic-*-main)을 넘겨 시각적 의미를 통일.",
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
    "신뢰감과 접근성. 차분하고 전문적이면서도 친근한 블루 기반. 진입 장벽 낮추는 것이 최우선. 깔끔한 라인, 충분한 여백, 명확한 위계, 과도한 장식 배제.",
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
    base: 8,
    scale: [4, 8, 16, 24, 48, 64],
    rules: [
      "8px 그리드에 맞춰 간격 설정",
      "AppBar 52px / BottomBar 56px",
      "Mobile 좌우 마진 16px / Desktop 콘텐츠 1200px center",
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
    "텍스트 대비비 WCAG AA (4.5:1) 이상 유지",
    "터치 타겟은 최소 44px 보장",
    "8px 그리드에 맞춰 간격 설정",
    "인터랙티브 요소(Button/IconButton/Card.Root clickable/Tabs)에는 onClick 등 핸들러를 반드시 부착",
    "표준 variant에 없는 톤이 필요하면 컴포넌트의 style/icon 같은 확장 슬롯을 활용 (raw 요소로 대체 금지)",
  ],
  donts: [
    "한 화면에 3개 이상의 폰트 웨이트를 혼용하지 마세요",
    "둥근 코너와 각진 코너를 같은 뷰에서 섞지 마세요",
    "그림자와 보더를 동시에 적용하여 이중 계층을 만들지 마세요",
    "그라데이션 배경 사용 금지 — 단색 토큰만",
    "Card 슬롯(Header/Body/Footer)에 외곽 padding 추가 금지 — 자체 padding과 충돌",
    "Button color='assistive' + variant='solid' 조합을 활성 CTA로 사용 금지 (비활성처럼 보임)",
    "DS 컴포넌트에 정확히 매칭되는 쓰임이 있는데 raw <button>/<input>/<span>으로 대체 금지",
  ],
  bannedPatterns: [
    {
      name: "gradient-background",
      rule: "linear-gradient / radial-gradient / conic-gradient — 사용 금지",
    },
  ],
};
