<!--
슬랙 mrkdwn 호환 본문. 워크플로우(release-mcpb.yml) 가 "*이번 업데이트에서 달라진 점*"
헤더를 자동으로 앞에 붙여 슬랙 스레드에 그대로 게시한다.
- `#`, `##`, `###` 헤딩 안 됨 → `*bold*` 로 강조
- `**bold**` (asterisk 두 개) 안 됨 → `*bold*` (asterisk 하나) 로
- `---` 가로줄 안 보임 → 빈 줄로 단락 구분
- prettier 가 `*bold*` 를 `_italic_` 으로 normalize 하지 않도록
  이 파일은 `.prettierignore` 에 등록되어 있다.
-->
<!-- markdownlint-disable MD036 -->

*AI 가 만드는 UI 가 한층 더 일관돼져요*

노션 "AI UI 생성 원칙" 페이지(디자인팀 → Anti Pattern → UI 생성 원칙 / 안티패턴) 의 룰을 디자인 시스템에 직접 정합. 이제 AI 가 목업을 만들 때 이 룰이 자동으로 적용돼요.

*컴포넌트별 사용 시점 룰*

• *Badge* — 보조 정보용. Fill Badge 는 카드당 최대 1개. 일반 카테고리에는 ghost / line + neutral. Brand color 는 "현재 선택 / 핵심 강조" 에만.
• *Tabs* — 동일 depth 콘텐츠 전환·카테고리 내비·섹션 전환 전용. 저장 / 신청 같은 액션 대체 금지, 리스트 필터 대체 금지.
• *Segment* (Tabs variant=square) — PC CMS · 주요 기능 전환 전용. 모바일 일반 화면에서는 line / pill 만.
• *Modal* — 즉각적인 판단·응답이 필요할 때만. 단순 안내는 inline Notice / Banner / Toast 로. 모달 안에 또 다른 강조(Card · Brand BG · Chip 그룹) 를 쌓지 않기.

*컬러 위계 룰*

• *Tone-on-Tone 금지* — 연한 Blue 배경 위에 Blue Fill Badge, 연한 Mint Surface 위 Mint Badge 같은 동일 계열 위 동일 계열 강조는 위계를 만들지 못해요.
• *Brand Background* 는 의미 전달(주의 / 안내 / 하이라이트) 목적에만. KPI 카드 / Summary 카드 / 단순 시각 구분 배경으로는 사용 금지.

기존에 이미 반영돼 있던 Surface Layer(L0~L3) · Spacing semantic 토큰 · 아이콘 화이트리스트 룰은 그대로 유지되고, 이번에 누락돼 있던 *Badge · Tabs · Segment · Modal* 사용 시점이 보강됐어요.

*UX 라이팅 가이드가 디자인 시스템에 들어왔어요*

버튼 / 라벨 / 에러 메시지 / placeholder / empty state 처럼 사용자에게 보이는 모든 텍스트를 어떻게 쓸지 가이드가 생겼어요.

• 해요체로 통일 — "저장되었습니다" 보다 "저장했어요"
• 부정형보다 긍정형 — "받을 수 없어요" 보다 "조건을 충족하면 받을 수 있어요"
• 다이얼로그 왼쪽 버튼은 항상 *닫기*. "취소" 는 사용자가 작업이 취소된다고 오해할 수 있어 쓰지 않아요.

EAP 멘탈케어 도메인용 추가 룰도 함께 들어 있어요.

• 위기·자해 표현은 자극적 단어 없이 사실 중심으로
• "정상 / 비정상" 처럼 사용자를 평가하는 어휘 금지
• "진단" · "처방" · "치료" 는 실제 의료진 행위에만. 자가검사는 "점검" · "관리" 로
• "회사에 공유되지 않아요" 처럼 익명성 · 프라이버시 안내는 명시적으로

작업할 때 AI 에게 "UX 라이팅 가이드 따라줘" 라고 하면 자동으로 이 룰을 불러옵니다.

*다크패턴 5 가지가 차단돼요*

사용성을 해치는 5 가지 패턴을 이제 디자인 시스템 차원에서 막아요.

1. *진입 직후 자동 시트* — 화면 들어가자마자 알림 동의 / 프로모션 바텀시트 자동 노출
2. *뒤로가기 인터럽트* — 닫기 누르는 순간 만류·재구매·추가 동의 다이얼로그
3. *거절 불가 CTA* — 닫기 / 나중에 없이 "확인" 한 개 버튼만 있는 다이얼로그
4. *플로우 중간 광고* — 메뉴 눌렀더니 의도한 화면 대신 전면 광고가 먼저 뜨는 흐름
5. *모호한 CTA 라벨* — 버튼만 보고 다음 행동을 예측할 수 없는 라벨 ("지금 시작" / "확인" 단독 사용 등)

목업 검증(`validate_mockup`) 단계에서 이 패턴을 발견하면 경고가 나와요.

*CTA 그룹 라벨 명료성 룰이 강화됐어요*

기존 "Primary 버튼은 화면당 1개" 룰에 더해, 라벨 자체의 명료성 룰이 추가됐어요.

• 버튼 라벨에는 결과 동사 (보기 / 신청 / 저장 / 삭제) 를 포함
• 버튼 위 보조 설명이 버튼 라벨과 같은 의미로 중복되지 않게
• 다이얼로그에는 항상 거절 가능한 옵션 (닫기 / 나중에) 최소 1개

*Spacing 토큰이 4pt 그리드로 정리됐어요*

Figma SpacingGuide 와 1:1 정합. 의도 기반 *Gap* (요소 간 거리) 과 사용처 기반 *Inset* (컨테이너 내부 여백) 으로 명확히 분리됐어요.

• *Gap* — tight (4px) / default (10px, 표준) / comfortable (12px) / loose (16px) / wide (24px)
• *Inset* — chip (8px) / input (12px) / card (16px, 표준) / card-large (20px) / modal (24px)

이제 "카드 padding 은 뭐 쓰지?" 같은 헷갈림 없이 `--inset-card` 하나로 통일돼요.

*브랜드별 시멘틱 토큰 위치가 대칭이 됐어요*

NudgeEAP / Trost / Geniet 가 각자 자기 시멘틱 정의 파일을 동등한 위치에 가질 수 있도록 정리. 기본값은 여전히 NudgeEAP — 다른 브랜드는 필요한 부분만 override 하면 돼요. (디자이너 / 개발자 모두 영향 없음 — 내부 정리)

*Geniet 브랜드 아이콘 27종이 추가됐어요*

Geniet 홈페이지 운영 SVG 와 Figma 지니어트-Dev 라이브러리에서 헤더·바텀네비·알림 같은 브랜드 전용 아이콘을 DS 표준(24×24, currentColor) 에 맞춰 가져왔어요. `<GenietAlarmIcon />` `<GenietRecordOnIcon />` 처럼 기존 아이콘과 동일한 방식으로 쓸 수 있고, 스토리북의 *Brands / Geniet / Icons* 페이지에서 전체 27개를 한 번에 볼 수 있어요. 공용 아이콘과 디자인이 다른 게 본질이라 `Geniet*` prefix 로 분리.

추가된 아이콘:

• *공용*: 알람 / 화살표(↑↓←→) / 메뉴 / 마이페이지 / 복사 / 로그인·로그아웃 / 재생 / 체크서클 / 컨페티 / 쿠폰 / 캐시리뷰 / G포인트
• *바텀네비(Figma 207:3204)*: 홈 on / 기록 off(write) / 혜택 on·off / 리뷰 on·off / 커뮤니티
• *헤더(Figma 207:2483)*: 검색

*Geniet 스토리들이 Figma 정합으로 업데이트됐어요*

• *AppFooter / 하단 탭바* — 4탭 → *5탭* (홈 / 기록 / 혜택 / 리뷰 / 커뮤니티). 모든 탭이 Geniet 브랜드 아이콘 사용.
• *AppBar / Desktop* — PC 헤더 좌측에 *"음식 카테고리"* 메뉴 박스 추가 (`GenietMenuIcon` + 텍스트, mint border).

*브랜드 아이콘 사용 정책이 명문화됐어요*

이제 AI 가 브랜드 모드(brand='geniet'/'trost')로 작업할 때 자동으로 해당 브랜드 prefix 아이콘을 우선 사용합니다. 공통 컴포넌트 안에 brand 분기 로직을 박지 않고 브랜드 전용 화면이 명시적으로 import 해서 전달하는 패턴.

• `get_brand_info("geniet")` 응답에 사용 가능한 brandIcons 27개 자동 노출
• 공통 컴포넌트는 brand-agnostic 으로 유지 — Figma 디자인이 달라도 컴포넌트 구현은 한 벌

*Storybook 브랜드 토글이 깔끔하게 동작해요*

기존엔 brand 토글 시 radius·spacing 은 변하는데 *컬러는 안 변하는* 이슈가 있었어요. `brand-themes.ts` 가 컴포넌트의 inline style 이 참조하는 `--semantic-bg-brand-default` 같은 토큰을 갖고 있지 않아서였습니다.

• Storybook 의 brand 토글이 `packages/tokens/dist/{trost,geniet}.css` 의 :root 토큰을 *자동으로 가져오게* 통합 — palette/semantic.ts 가 SSOT, brand-themes.ts 는 컴포넌트 미세 조정만 담당.
• preview 와 manager (토큰 에디터 패널) 가 같은 brand 데이터를 보도록 SSOT 통합.

*컴포넌트 인벤토리 문서가 정리됐어요*

`docs/components/inventory.md` 가 이제 Figma 정합 완료 컴포넌트를 상단에 모아 보여줍니다. 정합되지 않은 컴포넌트는 그 아래 따로 분리해서 노출돼요. 디자이너 / PM 이 "지금 바로 써도 되는 컴포넌트" 를 한 눈에 보기 쉬워졌어요.

또한 docs 사이트의 *가이드* 카테고리에 *UX 라이팅* 과 *다크패턴* 페이지가 새로 들어왔어요 — 브라우저에서 바로 읽을 수 있어요.
