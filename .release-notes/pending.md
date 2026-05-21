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

*목업 워크플로우가 빨라지면서 가끔 시안이 "DS 를 거치지 않은 가짜" 로 나오는 일*

AI 한테 시안을 부탁드리면 빠르게 보여드리려고 가끔 .tsx 워크플로우를 건너뛰고 raw HTML/CSS 로 시각만 흉내내는 경우가 있었어요. 이러면 컴포넌트 검증·다크패턴 검증이 모두 무력화돼서, 진짜 코드로 옮길 때 다시 작업해야 했는데요. 이제 빌드 직전에 워크스페이스를 자동 스캔해서 *손글씨 .html*, *`:root` 토큰 인라인 재정의*, *DS 컴포넌트 시각 흉내*, *.tsx 0개* 같은 우회 패턴이 발견되면 빌드를 거부합니다. 시안이 항상 DS 컴포넌트 위에서 검증되도록 가드.

*"참고할 시안 있어요?" 를 매번 직접 챙기지 않으셔도 돼요*

레퍼런스 캡처가 없는 채로 목업이 만들어지면, 디자이너가 의도한 모양과 결과물이 어긋나는 경우가 자주 있었죠? 이제 모델이 첫 응답에서 *"참고할 시안(Figma 캡처·스샷) 있어요?"* 를 먼저 물어보고, `references.md` 또는 `.references/` 가 비어있으면 빌드가 진행되지 않습니다. 또 모델이 같은 검증 위반을 3번 연속 못 고치며 무한 루프 돌면 자동으로 멈추고 보고합니다.

*MCP 도구 이름이 21개에서 15개로 정리됐어요 — AI 가 도구를 더 정확하게 골라요*

list / get / search 처럼 비슷한 이름이 너무 많아서 AI 가 엉뚱한 도구를 골라 결과가 들쭉날쭉했던 적 있으셨죠? 같은 일을 하는 도구들을 하나로 합쳤습니다.

• `find_component` — 예전 list_components / get_component / search_component
• `find_icon` — 예전 list_icons / find_icon
• `find_token` — 예전 list_tokens / lookup_token
• `get_brand` — 예전 list_brands / get_brand_info
• `dev_server({ action: 'start' | 'stop' })` — 예전 start_dev_server / stop_dev_server

옛 이름은 즉시 사라졌어요. MCP 업데이트 후 AI 에게 *"CLAUDE.md 갱신해줘"* 라고 한 번만 말씀하시면 새 가이드가 다시 박힙니다.

*목업 단계에서 "이 아이콘이 DS 에 없네…" 로 막혔던 적 있으셨죠?*

목업 단계에서 DS 표준 아이콘셋에 아직 없는 시각이 필요할 때 임시로 채울 수 있는 *Mockup 아이콘 1786종* 이 추가됐어요. iconsax bold 스타일을 24×24 / currentColor 로 정제했고, `MockupBoldAlarmIcon` 처럼 *`MockupBold` prefix* 로 import 합니다. prefix 가 명시적이라 정식 인하우스 아이콘이 들어오면 한눈에 찾아 교체할 수 있어요. 어디까지나 임시 시안 / fallback 용이며, production 시안엔 DS 표준 아이콘만 써 주세요.

*컬러 페이지에서 hex 직접 옮겨 적으셨던 적 있으셨죠?*

기존 docs 사이트 `/tokens/colors` 페이지는 손글씨 테이블이라 새 shade 가 추가되어도 자동 반영되지 않았어요. 이제 `@nudge-eap/tokens` 의 colors 객체를 직접 import 해서 렌더하는 *ColorCatalog* 로 교체됐습니다. Tailwind / Vercel 문서처럼 한 줄 가로 strip 으로 보이고, *블록 클릭 시 `colors.blue[500]` 토큰 경로가 클립보드에 복사* 됩니다. 그룹명 · shade · hex · 토큰 경로 모두 검색 가능. 시멘틱 토큰은 `/semantic-tokens` 페이지에서 따로 관리합니다.

*탭을 여러 개 띄워놓고 어느 게 NUDGE DS 인지 헷갈리셨죠?*

기존엔 docs 사이트에만 NUDGE 마크가 들어가 있었어요. 이제 *루트(`/`)* · *docs* · *storybook* 세 진입점의 *탭 favicon · 헤더 로고가 모두 NUDGE 마크로 통일* 됐습니다. storybook manager 헤더 로고도 함께 교체.

*docs 첫 페이지가 길어서 뭘 먼저 봐야 할지 막막하셨죠?*

소개 페이지를 핵심만 남기고 슬림하게 정리했어요. 헤더 라벨도 *"시작하기" → "소개"* 로 변경.

*잡 수정*

• MCP 도구 통합 이후 깨졌던 pre-push 훅(`list_brands` 호출) 을 `get_brand` 로 교체.
• docs 사이드바에 잘못 노출되던 `drafts/` 카테고리 제거 (CI 빌드 실패 fix).
• MDX 테이블 셀 안 `|` 이스케이프 · stale anchor 정리 (docs 빌드 실패 fix).
