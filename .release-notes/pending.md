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

*헤더 base 가 하나로 합쳐졌어요 — `<Header>` (Breaking)*

지금까지 base 레이어에 `AppBar` (모바일 56px) 와 `WebHeader` (데스크탑 80px) 두 컴포넌트가 따로 있었는데, 로고·GNB·로그인 슬롯이 사실상 같은 역할을 *두 가지 다른 이름* 으로 노출하고 있었어요. 외부에서 base 헤더가 필요할 때 *"왜 둘 중 하나를 골라야 하지"* 라는 인지 부담이 있었습니다.

이제 *단일 `<Header>`* 로 통합됐고, 옛 `<AppBar>` / `<WebHeader>` named export 는 *제거* 됐어요. `variant` 만 바꿔서 호출합니다:
• `variant="compact"` — 옛 AppBar default (모바일 56px, flex)
• `variant="webview"` — 옛 AppBar webview (title 절대중앙 + 뒤로가기)
• `variant="transparent"` — 옛 AppBar transparent (배경 투명)
• `variant="web"` — 옛 WebHeader (데스크탑 80px, grid 3열, max-width 1200)

슬롯도 한 namespace 로 정리됩니다 — `Header.Logo` / `Header.Menu` / `Header.MenuItem` / `Header.Actions` / `Header.AuthMenu`(배열형) / `Header.AuthButton`(단일형) / `Header.AppDownloadButton` / `Header.SearchBar` / `Header.MainBar` / `Header.NavBar` / `Header.BackButton` / `Header.Divider`, 총 12개. `AppBar.GNB` 는 `Header.Menu` 로 이름이 바뀌었어요.

호출 표면 마이그레이션: `<AppBar variant="default">` → `<Header variant="compact">`, `<AppBar variant="webview">` → `<Header variant="webview">`, `<WebHeader>` → `<Header variant="web">`. CSS override 도 옛 `--nds-app-bar-*` / `--nds-web-header-*` 변수가 *`--nds-header-*` 단일* 로 통일됐고, className 도 옛 `nds-app-bar` / `nds-web-header` 가 *`nds-header` 단일* 로 통일됐어요. 외부에서 옛 변수/className 으로 override 하던 곳은 새 이름으로 교체해야 합니다.

브랜드 헤더들 (`TrostAppBar` / `GenietAppBar` / `NudgeEAPAppBar` / `NudgeEAPWebHeader` / `CashpobiWebHeader`) 은 *이름도 외부 API 도 동일* — 안에서만 새 base 를 쓰게 정리됐어요. 스토리북에서도 `Components / AppBar` + `Components / WebHeader` 두 카테고리가 *`Components / Header` 단일* 로 합쳐졌습니다.

*푸터 base 가 하나로 합쳐졌어요 — `<Footer>` (Breaking)*

헤더와 같은 정리를 푸터에도 적용했습니다. 지금까지 base 레이어에 `AppFooter` (Info/TabBar) 와 브랜드별로 `{Brand}AppFooter` / `{Brand}WebFooter` / `TrostDesktopFooter` 같은 이름이 따로 살아 있어, 같은 NudgeEAP 화면인데 PC 페이지에서는 `NudgeEAPWebFooter`, 앱 화면에서는 `NudgeEAPAppFooter` 로 호출 표면이 갈리고 있었어요. 외부에서 "어느 푸터를 골라야 하지" 라는 인지 부담이 컸습니다.

이제 *단일 `<Footer>`* + *브랜드마다 푸터가 한 종류* — `<NudgeEAPFooter />` / `<TrostFooter />` / `<CashpobiFooter />` / `<GenietFooter />` — 만 남았어요. 옛 `<AppFooter>` / `<{Brand}AppFooter>` / `<{Brand}WebFooter>` / `<TrostDesktopFooter>` named export 는 *제거* 됐습니다.

브랜드별 푸터 안에서 *`surface="web"` / `surface="app"`* 으로 분기해요. PC 푸터, 앱 푸터, 다크 푸터, light 푸터 같은 변형은 DS 가 책임지고, 호스트 앱은 같은 컴포넌트 이름만 부르면 됩니다.

• *NudgeEAP* — `surface="web"` 은 약관 + 앱다운로드 + ISO 인증 + DAIN 자회사 로고 + powered by 같은 풍부한 슬롯의 PC 푸터 (Figma 20:13799), `surface="app"` (생략 가능) 은 회사 정보 표준 푸터
• *Trost* — `surface="web"` 은 데스크톱(≥1024) dark PC 푸터, `surface="app"` 은 dark 앱 푸터. 기존 `variant="desktop"|"mobile"` 은 *`layout`* 으로 이름이 바뀌었어요 (surface 와 명시적으로 다른 축)
• *Cashpobi* — 캐포비는 *웹 전용* 이라 `surface="web"` 만, `layout="desktop"|"mobile"` 반응형 분기
• *Geniet* — 지니어트는 *앱 전용* 이라 `surface="app"` 만

한쪽 surface 가 없는 브랜드(Cashpobi 의 app, Geniet 의 web)는 *타입 단에서 차단* — `<CashpobiFooter surface="app" />` 같은 호출은 컴파일이 안 됩니다. 의도치 않게 없는 surface 를 부르지 않도록.

호출 표면 마이그레이션: `<AppFooter.Info>` → `<Footer.Info>`, `<AppFooter.TabBar>` → `<Footer.TabBar>`, `<NudgeEAPAppFooter>` → `<NudgeEAPFooter surface="app">`, `<NudgeEAPWebFooter>` → `<NudgeEAPFooter surface="web">`, `<TrostAppFooter variant="mobile">` → `<TrostFooter surface="app" layout="mobile">`, `<TrostWebFooter>` (= `TrostDesktopFooter`) → `<TrostFooter surface="web">`, `<CashpobiWebFooter variant="mobile">` → `<CashpobiFooter layout="mobile">`, `<GenietAppFooter>` → `<GenietFooter>`. CSS override 도 옛 `nds-app-footer` className 이 *`nds-footer`* 로 통일됐습니다. 스토리북에서도 `Components / AppFooter` + `Components / WebFooter` 두 카테고리가 *`Components / Footer` 단일 카테고리* 로 합쳐져서, 브랜드별 surface 변형이 한 페이지에 줄지어 보입니다.

*4번째 브랜드 "캐포비(Cashpobi)" 가 정식으로 들어왔어요*

캐시워크 for Business admin 의 디자인 가이드가 NudgeEAP DS 의 네 번째 브랜드로 합류했습니다. 시그니처는 *노란색 솔리드 + 검정 텍스트* (Yellow/200 + #111) 조합이고, 팔레트 62 스와치 · 시멘틱 컬러 · 타이포(Heading/Title/Subtitle/Body/Caption/Label) · 스페이싱(Atomic/Inset/Title-gap/Radius/Border/Grid/Layout) 묶음이 한 번에 들어왔어요. 캐포비 가이드는 다른 브랜드와 다르게 *Input/Border/Focus 가 검정* 이고, *disabled 가 색 대신 opacity 0.4* 라는 특이점이 있어서, 아래 컴포넌트 정합 작업이 같이 진행됐습니다.

*신규 컴포넌트 5종*

• *PopularPosts* — 랭킹 + 메타가 붙는 인기 게시물 리스트 카드
• *FloatingCtaBanner* — 페이지 하단 고정 CTA 배너
• *ImageUpload* — 150×150 미리보기 + 우측 업로드 버튼 + 사이즈 안내. empty / uploaded / error 3가지 상태와 X 버튼으로 제거까지 한 컴포넌트에서 처리 (캐포비 admin 폼)
• *ActionChip* — 캐포비 admin 폼의 단일 액션 칩
• *ProductCard 구조 재정렬* — 기존 body/desc/footer 가 *meta / price-row / discount / currency* 슬롯으로 분리돼서, 할인율·통화·취소선 가격을 명시적으로 넣을 수 있게 됐어요

*브랜드마다 컴포넌트 모양을 따로 줄 수 있는 오버라이드 시스템*

기존엔 한 브랜드 가이드에 맞추려고 컴포넌트를 직접 고치면 다른 브랜드 시각이 같이 변하는 게 문제였어요. 이제 Input / Select / Textarea / DatePicker / Checkbox 에 *`--nds-{component}-{prop}` CSS 변수 fallback* 이 깔려 있어서, 캐포비처럼 *radius 4 / height 40 / padding 10* 으로 다르게 가야 하는 브랜드는 토큰만 지정하면 됩니다. 다른 브랜드는 변수 미정의 → 기존 모양 *그대로 (시각 변화 0)* 유지돼요.

*Button — 색 조합 부조화 + hover 안 보이던 버그 fix*

• *primary soft* 의 배경/보더가 statusInfo(파랑) 였는데, 캐포비처럼 brand 가 파랑이 아닌 브랜드에서 *"파랑 배경 + 노랑 텍스트"* 부조화가 나서 *brandSubtle* 로 변경. 이제 NudgeEAP/Trost/Geniet/캐포비 모두 같은 brand 톤의 옅은 배경.
• *캐포비 secondary 솔리드 = 검정 CTA* (Geniet 와 같은 dark-inverse 패턴). 캐포비의 시그니처 CTA 두 종이 *노랑(primary) + 검정(secondary)* 으로 정리됐어요.
• 일부 버전에서 *hover 시 배경/글자색이 화면에 안 나오던 버그* 가 있었는데(CSS 우선순위가 0이 돼서 기본 룰에 가려졌던 거), 이제 정상 적용. disabled cursor 도 같은 이유로 묻혀 있던 거 함께 fix.
• *secondary 아웃라인* 이 캐포비에서 노란 보더로 잘못 나오던 부분 → Outlined/Neutral 패턴(중립 보더 + strong 텍스트)으로 통일.

*Input 패밀리(Input / Select / Textarea / DatePicker) — 타이핑/에러 보더 정합*

타이핑 중 보더 색이 일반 focus 토큰을 쓰고 있었는데, *Input 전용 시멘틱* (cv.input.borderFocus / borderError) 으로 교체했어요. 캐포비에서 타이핑 시 *노란 outline → 검정 outline* 으로 가이드(Neutral/900)와 맞춰졌고, NudgeEAP/Trost/Geniet 는 두 토큰이 같은 값이라 *시각 변화 0*. error 상태도 같은 정리.

*Checkbox — 캐포비 톤 cascade*

캐포비 admin 의 Checkbox 가이드(box 15px / border 1.25px #DDD / radius 2 / disabled = 단순 opacity 0.4)를 위 오버라이드 시스템으로 캐스케이드했어요. 다른 브랜드는 변수 미정의 → *기존 모양 그대로*.

*DatePicker trigger 도 캐포비 DateInput 에 맞춤*

placeholder 가 *"날짜 선택" → "YYYY-MM-DD"*, 표시 포맷도 점 → 대시 ISO 포맷, 아이콘은 인라인 SVG → DS 표준 CalendarIcon(20×20) 으로 교체됐어요.

*목업 리포트가 "DS 사용 비율" 과 "DS 버전" 을 항상 같이 보여줍니다*

지금까지 MCP 가 모아주던 목업 사용 리포트에서 *DS 사용 비율* 만 노출되거나 *DS 버전* 만 노출되는 경우가 있어서, 둘 중 하나만 보고 판단하기 애매했죠. 이제 *DS@버전 + DS 컴포넌트 개수 (비율%)* 가 한 줄에 강제 페어로 들어가고, 둘 중 하나만 노출되는 케이스는 가드로 막힙니다. 목업이 *DS 위에서 어느 정도 만들어졌는지* 와 *어느 DS 버전 기준인지* 가 같이 보여요.

*브랜드 헤더/푸터/바텀네비를 화면마다 손코딩하지 않아도 됩니다*

지금까지는 각 브랜드 화면을 만들 때마다 "음식 카테고리" 박스, 다크 푸터의 SNS·앱 다운로드 배지, 5탭 BottomNav 의 아이콘 매핑 같은 chrome 구조를 *화면마다 손으로 다시 짜고* 있었어요. 같은 헤더가 매번 똑같이 나와야 하는 영역인데도, 화면이 늘어날수록 미세하게 어긋나는 drift 가 쌓였습니다.

이제 *브랜드별 chrome 컴포넌트* 가 DS 에서 직접 export 됩니다. Geniet 화면은 `<GenietAppBar />` / `<GenietAppFooter />` / `<GenietBottomNav />`, Trost 는 `<TrostAppBar />` / `<TrostAppFooter />` / `<TrostBottomNav />` / `<TrostWebFooter />`, NudgeEAP 는 `<NudgeEAPAppBar />` / `<NudgeEAPAppFooter />` / `<NudgeEAPBottomNav />`, 캐포비는 웹 전용이라 `<CashpobiWebHeader />` / `<CashpobiWebFooter />`. 카테고리 박스 / 검색·알림 아이콘 / 다크 푸터 / 5탭(또는 3탭) 같은 *구조와 아이콘은 DS 가 책임* 지고, *로고·메뉴 항목·회사정보 같은 콘텐츠만 props 로 넘기면* 끝납니다.

스토리북 사이드바에서도 더 이상 `Brands / Geniet / AppBar` → `Brands / Trost / AppBar` → ... 식으로 brand 폴더가 4번 펼쳐지지 않고, *`Components / AppBar` 하나* 안에서 모든 브랜드 변형(Geniet / Trost / NudgeEAP)이 형제로 줄지어 보입니다. WebHeader / WebFooter 도 동일하게 통합.

*지니어트 헤더 개편 — 검색·메뉴 2단 구조 (Figma 77:2 반영)*

지니어트 PC 헤더가 *검색 헤더(54h) + 메뉴 헤더(58h)* 2단 구조로 새로 정리됐어요(전체 172h). 검색창은 *pill 모양 500w* 로 통일되고, 바로 옆에 *인기검색어 NEW 칩* 이 붙어요. 우측 *쿠폰상점·마이페이지·로그인* 은 아이콘 28 + 11px 라벨이 세로로 쌓이는 *액션 버튼* 형태로 바뀝니다(예전엔 단순 텍스트 link).

메뉴 헤더는 좌측에 *음식 카테고리* 박스(160w, 드롭다운 진입점) + GNB 5탭 *홈 · 커뮤니티 · 헬시딜 · 음식 리뷰 · 기록*(Pretendard Bold 17), 우측에 *캐시리뷰* (흰 배경 + 보더, mint 텍스트) / *친구초대 이벤트* (mint 톤 배경) CTA pill 2개가 고정 배치돼요.

모바일은 *360 × 102*, 2단 구성 — *Row1 (50h)* 로고 + 포인트 칩(gpoint + 잔액) + 사용자 아이콘, *Row2 (52h)* 햄버거 + 검색 input(292×38, 회색 fill). 검색 placeholder 가 PC와 카피가 달라 (`궁금한 음식 칼로리...` vs `음식명, 칼로리, 영양성분, 음식 리뷰 검색`) *`mobileSearchPlaceholder`* 로 별도 지정.

브랜드 화면에서는 `<GenietAppBar variant="desktop" actionButtons={...} ctaButtons={...} />` / `variant="mobile"` + `pointChip={{ amount: "34,300" }}` 만 호출하면 끝 — 인기검색어 위치, 카테고리 박스, CTA pill 톤(outline/tinted/filled) 같은 정합은 DS 가 책임집니다.

*넛지EAP 헤더 · 바텀네비 · 웹 푸터 정합 (Figma 39:5751 / 20:3235 / 20:3331 / 20:13799)*

넛지EAP 도 Figma SSOT 노드와 1:1 정합됐어요.

• *PC 헤더 GNB 가 6개로 정정* — 기존 fixture 의 4개 (홈/심리검사/상담신청/마이페이지) 가 Figma 와 달라서, 정식 6탭 *상담하기 · 심리검사 · 심리치료 · 주간레터 · 소식 · 마이페이지* 로 맞췄습니다. 헤더 좌측 로고 200×60, 메뉴 h79·px20·Pretendard Bold 18/26, 우측 *앱 다운로드 + 로그인/로그아웃* primary 톤 버튼 정합.

• *모바일 BottomNav 가 3탭 → 5탭으로 정정* — 기존 (홈/심리샵/마이) 는 deprecated. Figma 20:3331 기준 *홈 · 챌린지 · 상담 · 멘탈케어 · 내 공간* 5탭. 활성 그래픽이 일부 탭에서 별도 (HomeActiveIcon · ChallengeActiveIcon · MentalcareActiveIcon · MypageActiveIcon), 상담은 단일 CommentIcon. label 만 넘기면 자동 매핑.

• *NudgeEAPWebFooter 가 단순 wrapper 가 아닌 풀 정합 컴포넌트로 재작성* — Figma 20:13799 기준: bg #FAFAFA · max-width 1200 · 약관 4개(개인정보 처리방침 bold 강조 + 일반 3개) · 우상단 앱다운로드 원형 3개(Google/Apple/OneStore, 44×44 #999) · 회사정보(주소/사업자/전화/팩스/이메일) · ISO/IEC 27001 인증 우측 · 카피라이트 + powered by Cashwalk + DAIN 자회사 로고. `appDownloads` / `iso` / `dain` / `poweredBy` 슬롯 모두 props 로 주입 (DS 는 콘텐츠 안 들고있음).

• *NudgeEAPWebHeader 신규 컴포넌트* (Figma 39:5751 정합) — base WebHeader wrapper 로, 로고 200×60 + GNB 6탭 + 앱다운로드 + 로그인/로그아웃 슬롯을 표준 형태로 묶어둡니다. NudgeEAPAppBar (앱 전용) 와는 분리. *외부 프로젝트는 `<NudgeEAPWebHeader />` 한 줄만 부르면 됨.*

• *로고 자산 6종 — 단독 PNG 로 추출 완료* (Figma 698:87 의 각 ImgLogo 인스턴스 노드 — 672:2081 KO / 672:2098 KO+EN / 672:2115 EN / 672:2158 EN Dark / 672:2185 Symbol gradient 64×64 / 672:2203 DAIN). `apps/storybook/public/brand-logos/nudge-eap/` 에 `nudge-eap-{ko,koen,en,en-dark,symbol}.png` 와 `dain-logo.png` 로 저장. *fixture 의 헤더 로고가 placeholder SVG → Symbol+KO+EN horizontal (대표 로고) PNG 로 교체* 됐고, NudgeEAPWebHeader 스토리에서도 동일 자산이 헤더에 박힙니다. 가이드 row 전체 reference PNG 6종 (`logo-guide-*.png`) 도 같은 폴더에 별도 저장.
