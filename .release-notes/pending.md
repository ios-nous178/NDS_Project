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

*AI 가 목업을 "코드 우회"로 만드는 길이 막혔어요*

이전엔 모델이 시안을 빨리 보여주려고 .tsx 워크플로우를 우회해서 raw HTML/CSS 로 시각만 흉내내는 경우가 있었어요. 이러면 DS 컴포넌트 검증·다크패턴 검증이 전부 무력화되는데, 이제 빌드 단계에서 자동으로 막힙니다.

• *4가지 우회 패턴 자동 차단* — 손글씨 .html / `:root` 토큰 인라인 재정의 / DS 컴포넌트 시각 흉내 / .tsx 0개. 빌드 직전 워크스페이스를 스캔해서 하나라도 발견되면 빌드 거부.
• *시각 레퍼런스 미수집도 차단* — Figma 캡처 / 스샷 같은 시각 자료가 없으면 빌드 안 됩니다. 모델이 첫 응답에서 자동으로 "참고할 시안 있어요?" 라고 물어보도록 가드.
• *같은 위반 3회 반복되면 멈춤* — 모델이 같은 룰을 계속 못 지키며 무한 루프 도는 케이스 가드. 멈추고 사용자에게 보고합니다.

*MCP 도구 이름이 21개 → 15개로 정리됐어요*

비슷한 이름이 너무 많아 AI 가 잘못된 도구를 고르는 일이 잦았어요. 같은 일을 하는 도구들을 하나로 합쳤어요.

• `find_component` — 예전 list_components / get_component / search_component
• `find_icon` — 예전 list_icons / find_icon
• `find_token` — 예전 list_tokens / lookup_token
• `get_brand` — 예전 list_brands / get_brand_info
• `dev_server({ action: 'start' | 'stop' })` — 예전 start_dev_server / stop_dev_server

옛 이름은 즉시 제거됐어요. MCP 업데이트 후 Claude 에게 *"CLAUDE.md 갱신해줘"* 라고 하면 새 도구 이름이 박힌 가이드를 다시 받습니다.

*Mockup 아이콘 1786종이 fallback 으로 들어왔어요*

목업 단계에서 DS 표준 아이콘셋에 없는 시각을 임시로 채울 때 쓰는 fallback. iconsax bold 스타일을 24×24 / currentColor 로 정제해서 가져왔어요.

• `MockupBoldAlarmIcon`, `MockupBoldActivityIcon` 처럼 *`MockupBold` prefix* 로 import — 정식 인하우스 아이콘이 들어오면 한눈에 찾아서 교체할 수 있도록 prefix 가 명시적.
• 목업·임시 시안 전용 — production 시안엔 DS 표준 아이콘만 사용하세요.

*docs 사이트 컬러 페이지가 살아있는 카탈로그가 됐어요*

기존 손글씨 테이블(palette 12개) 을 라이브 ColorCatalog 컴포넌트로 교체. `@nudge-eap/tokens` 의 colors 객체를 직접 import 해서 렌더하기 때문에 새 shade / 팔레트 추가 시 자동 반영돼요.

• Tailwind / Vercel 문서 스타일의 가로 strip 레이아웃.
• 검색 — 그룹명 매치 시 팔레트 전체, shade·hex·path 매치 시 해당 shade 만.
• 클릭 시 `colors.blue[500]` 경로 클립보드 복사.
• 시멘틱 토큰은 별도 `/semantic-tokens` SSOT 페이지로 분리.

*세 진입점의 NUDGE 마크가 통일됐어요*

기존엔 docs 사이트에만 NUDGE favicon 이 적용돼 있었어요. 이제 *루트(`/`) · docs · storybook* 세 진입점의 탭 favicon · 로고가 모두 NUDGE 마크로 동기화.

• storybook manager 헤더 로고도 NUDGE 로 교체.
• 루트 페이지(web-server) 의 placeholder 였던 "N" 글자 favicon → currentColor NUDGE 마크.

*docs 소개 페이지가 슬림해졌어요*

처음 docs 사이트에 들어왔을 때 보이는 페이지를 가볍게 정리. 헤더 라벨도 *"시작하기" → "소개"* 로 변경. H1 도 *"넛지 디자인시스템" → "NUDGE Design"* 로 통일.

*잡 수정*

• MCP 도구 통합 이후 깨졌던 pre-push 훅 (`list_brands` 호출) 을 `get_brand` 로 교체.
• docs 사이드바에 잘못 노출되던 `drafts/` 카테고리 제거 (CI 빌드 실패 fix).
• 테이블 셀 코드 스팬 안 `|` 이스케이프 + stale anchor — MDX 빌드 실패 fix.
