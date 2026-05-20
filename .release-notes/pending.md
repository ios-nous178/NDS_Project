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

*Card / List 가 Figma 마스터와 같은 모양이 됐어요*

Figma 의 Card(171:9363) / List(933:80) 정의가 그동안 코드와 미묘하게 어긋나 있었어요. 이제 디자이너가 Figma 에서 그리는 카드·리스트와 AI 가 만드는 결과물이 같은 타이포·간격·radius 를 씁니다.

• *Card* 신규 슬롯 — Avatar(40 원형), Chips(브랜드 chip 그룹), Divider, Cta(액션 버튼 영역), FooterText. 기존 props 그대로 동작 (외부 사용처 영향 없음).
• *Card 레이아웃* — 균등 padding 16 + slot 간 gap 12 의 수직 스택. corner radius 8 → *12*. Thumbnail 기본 고정 height 160px.
• *List* — Title 14 Medium → *16 Bold*. Description 13 → *14*. Metadata prop 신설.

*Trost · Geniet 브랜드 아이콘 44종이 추가됐어요*

각 브랜드 운영 사이트의 SVG 를 DS 표준(24×24, currentColor) 으로 정제해서 가져왔어요. `brand='trost'` / `brand='geniet'` 모드에서 `TrostMentalDepressionIcon`, `GenietAlarmIcon` 처럼 prefix 로 import.

• *Trost 17종* — 멘탈 카테고리 9 (우울/감정/일상/MBTI/약/루틴/자존감/사운드/병원) · 심리검사 결과 3 (safe/warning/danger) · 서비스 5 (SNS 공유·코인·심볼 등).
• *Geniet 27종* — 알람·메뉴·마이페이지·복사 등 공용 12 + 바텀네비 5탭 on/off + 헤더 검색.
• 공통 컴포넌트는 brand-agnostic 유지 — 브랜드 전용 화면이 명시적으로 import 해서 전달하는 패턴.

*Trost 시멘틱 토큰이 실제 트로스트 디자인에 맞게 정정됐어요*

기존엔 일부 토큰이 트로스트 실측과 어긋나서 brand='trost' 모드 결과물이 진짜 트로스트와 미묘하게 달라 보였어요. 8개 컴포넌트와 실측 grep 으로 5개 슬롯 정정.

• *페이지 배경* 회색(#F2F2F2) → *흰색* (트로스트 본문은 다 흰색 위).
• *모달·카드 overlay* 70% → *60%*.
• *브랜드 강조 텍스트·아이콘·버튼 텍스트* 노랑(#E6D200) → *오렌지(#FF9D00)*. 노란색은 면적 큰 버튼 / 배너 배경 전용.
• *떠 있는 카드 그림자* opacity 0.10 → *0.12*.

*AI 가 만드는 UI 가 한층 더 일관돼져요*

노션 "AI UI 생성 원칙" 의 룰을 디자인 시스템에 직접 정합. 이제 목업 생성 시 자동 적용.

• *컴포넌트별 사용 시점 룰* — Badge(보조 정보, Fill 카드당 1개, 카테고리는 ghost/line) · Tabs(동일 depth 콘텐츠 전환만, 액션 대체 금지) · Segment(PC CMS 주요 기능 전환 전용) · Modal(즉각적 판단 필요할 때만, 단순 안내는 Notice/Banner/Toast).
• *컬러 위계 룰* — Tone-on-Tone 금지(연한 Blue 위 Blue Fill Badge 같은 동일 계열 강조 X). Brand Background 는 의미 전달 목적(주의·안내·하이라이트)에만, KPI/Summary 카드 배경으로는 금지.
• *CTA 라벨 명료성* — 결과 동사 포함(보기·신청·저장·삭제). 다이얼로그는 항상 거절 가능한 옵션(닫기·나중에) 최소 1개.

*다크패턴 5 가지가 차단돼요*

사용성을 해치는 패턴을 DS 차원에서 막아요. `validate_mockup` 단계에서 발견 시 경고.

1. 진입 직후 자동 시트(알림 동의·프로모션 바텀시트)
2. 뒤로가기 인터럽트(닫기 누르는 순간 만류·재구매 다이얼로그)
3. 거절 불가 CTA (확인 한 개 버튼만 있는 다이얼로그)
4. 플로우 중간 광고
5. 모호한 CTA 라벨 ("지금 시작" / "확인" 단독)

*UX 라이팅 가이드가 디자인 시스템에 들어왔어요*

버튼·라벨·에러·placeholder·empty state 처럼 사용자에게 보이는 모든 텍스트 가이드.

• 해요체로 통일 — "저장되었습니다" 보다 *"저장했어요"*
• 부정형보다 긍정형 — "받을 수 없어요" 보다 *"조건을 충족하면 받을 수 있어요"*
• 다이얼로그 왼쪽 버튼은 항상 *"닫기"*. "취소" 는 사용자가 작업 취소로 오해할 수 있어 안 씁니다.
• *EAP 멘탈케어 도메인* 추가 룰 — 위기·자해는 사실 중심으로 / "정상·비정상" 평가 어휘 금지 / "진단·처방·치료" 는 실제 의료진 행위에만 / "회사에 공유되지 않아요" 같은 익명성 안내는 명시적으로.

AI 에게 "UX 라이팅 가이드 따라줘" 라고 하면 자동으로 룰을 불러옵니다.

*Spacing · 시멘틱 토큰 · 인벤토리가 정리됐어요*

• *Spacing 4pt 그리드* — 의도 기반 *Gap*(요소 간 거리: tight 4 / default 10 / comfortable 12 / loose 16 / wide 24) 과 사용처 기반 *Inset*(컨테이너 내부 여백: chip 8 / input 12 / *card 16* / card-large 20 / modal 24) 으로 명확히 분리. "카드 padding 뭐 쓰지?" 없이 `--inset-card` 로 통일.
• *브랜드별 시멘틱 토큰 위치 대칭* — NudgeEAP / Trost / Geniet 가 동등한 위치에 자기 정의 파일을 갖도록 정리. (디자이너·개발자 영향 없음 — 내부 정리)
• *컴포넌트 인벤토리* — `docs/components/inventory.md` 가 *Figma 정합 완료* 컴포넌트를 상단에 모아 보여줘요. "지금 바로 써도 되는 컴포넌트" 가 한 눈에 보임. docs 사이트 *가이드* 카테고리에 *UX 라이팅* / *다크패턴* 페이지도 신규 노출.

*Storybook 브랜드 토글이 깔끔하게 동작해요*

기존엔 brand 토글 시 radius·spacing 은 변하는데 *컬러는 안 변하는* 이슈가 있었어요. brand-themes 가 `--semantic-bg-brand-default` 같은 토큰을 자체적으로 갖고 있지 않아 발생. Storybook 토글이 이제 `packages/tokens/dist/{trost,geniet}.css` 의 :root 토큰을 자동으로 가져옵니다.
