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

🚨 *업데이트 이후 Claude Desktop 종료 후 다시 실행* 🚨

새 MCP 가이드/카탈로그가 적용되려면 Claude Desktop 을 완전히 종료(⌘Q)했다가 다시 켜 주세요. 그냥 창만 닫으면 옛 버전이 그대로 떠 있어요.



*이번 업데이트 요약*

· DS 패키지·MCPB 버전을 *0.0.4* 로 갱신.
· *트로스트(Trost)* 와 *지니어트(Geniet)* 두 브랜드를 Figma 가이드 기준으로 본격 반영 — 컴포넌트·색·아이콘·로고·이미지 자산까지.
· 잘 안 쓰이던 컴포넌트·중복 코드를 정리해 라이브러리를 더 가볍고 일관되게.
· 브랜드 이미지 검색에 *한글* 지원 추가.

*주요 변경사항*

*1. 트로스트(Trost) 브랜드 본격 합류*
· Button·Tab·Badge·Chip·Card·List·Bottom Sheet·Alert·Section/Container·Modal·Toast·Tooltip 을 트로스트 Figma 가이드에 맞춰 정리.
· 트로스트 색·여백·테두리·아이콘 세트 + 화이트 로고·심리검사 이미지 자산 추가.
· 기존 사용법과 다른 브랜드 화면은 그대로 — 트로스트 값은 새 옵션이나 브랜드 토큰으로만 더했습니다.

*2. 지니어트(Geniet) 브랜드 정합 확장*
· Button(*Mini* 사이즈 신규)·Chip·Toggle·Tab·Pagination·Alert·Section 을 지니어트 Library 가이드에 맞춰 정리.
· 지니어트 아이콘 전수 갱신 + 흰색 하트(이미지 위 오버레이용) 아이콘 추가.
· 브랜드 자산 *146종* 편입 — 음식 종류·카테고리·프로필·워드마크.

*3. 컴포넌트 라이브러리 군살 빼기*
· 디자인 근거·실사용이 없던 도메인/장식성 컴포넌트 *20여 종 제거* — VotePoll·CountdownTimer·Confetti·CircularProgress·NumberStepper·도메인 카드(이용자/상담사/예약) 등.
· 별점·색상 맵 등 화면마다 중복되던 렌더 로직을 한 벌로 단일화.
· 대체 안내: 정수 증감(NumberStepper)은 이번에 새로 추가한 *NumericSpinner*, 설문/척도(VotePoll)는 *LikertScale*, 가로 진행도(CircularProgress)는 *ProgressBar*, 금액 입력은 *AmountInput* 을 쓰세요.

*4. 입력·폼 화면 정합*
· 헬퍼텍스트·라벨 간격·글자 크기를 한 기준으로 통일(필드 15 / 라벨 14).
· 어드민 폼 라벨 좌측·상단 정렬 정리, 정수 증감 입력 *NumericSpinner*(− 값 +) 신규.

*5. 브랜드 헤더·푸터·사이드바 구조 정리*
· 브랜드 chrome(헤더·푸터·사이드바)을 목업 전용 구조로 통합 정리.
· 모바일 하단 탭 바 *BottomNav* 를 브랜드 무관 공식 컴포넌트로 추가.

*6. 브랜드 차이를 토큰으로 이전*
· Snackbar·Toggle·Pagination·TagInput 등의 브랜드별 색·radius 분기를 토큰 슬롯으로 이전.
· → 새 브랜드를 추가할 때 컴포넌트를 안 건드리고 토큰 값만 더하면 되도록 구조화.

*7. 브랜드 이미지 한글 검색(find_asset)*
· "비빔밥·족발·김치·라면·돈까스·우울증·영양제·한식" 처럼 *한글 키워드로 브랜드 이미지 검색* 지원(기존엔 영문 이름만).
· 목업 만들 때 필요한 이미지를 한글로 바로 찾아 넣을 수 있습니다.

*8. 외부 사용 편의·안정성*
· 패키지를 번들러 없이도 동작하는 ESM 으로 전환 + npm 패키지 슬림화(무거운 이미지는 별도 전달).
· 컴포넌트 Props 설명을 IDE 툴팁·문서 표에 자동으로 채움, MCP 컴포넌트 가이드 공백 보강.

*기대효과*

· 트로스트·지니어트 화면을 DS 컴포넌트만으로 브랜드 정합하게 제작할 수 있습니다.
· 라이브러리가 가벼워지고 어떤 컴포넌트를 써야 하는지 기준이 더 명확해집니다.
· 외부 프로젝트에서 MCP 가이드를 새로 받으면 최신 컴포넌트·검수 규칙과 한글 이미지 검색을 바로 적용할 수 있습니다.

*⚠ 참고 — 제거된 컴포넌트*

이번 정리로 일부 컴포넌트가 빠졌습니다. 사용 중이던 화면이 있으면 대체 컴포넌트로 교체해 주세요: *NumberStepper → NumericSpinner*(이번 릴리즈 신규) · *VotePoll → LikertScale* · *CircularProgress → ProgressBar*. 그 외 Confetti · CountdownTimer · QuickActionGrid · 도메인 카드 3종 · CallControlBar · TimeSlotPicker · OnlineIndicator 는 직접 대체 없이 제거됐습니다(필요 시 문의).
