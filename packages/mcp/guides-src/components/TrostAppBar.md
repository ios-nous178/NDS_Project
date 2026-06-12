---
_htmlStatus: no-html-equivalent
---

## summary

Trost 상단 헤더. desktop(2단, 1080 max-width, 앱다운로드 CTA + TrendingKeywords) / mobile / webview variant. 트로스트는 앱이 2종(트로스트 앱 / (캐시워크)트로스트 앱)이라 webview(앱 인-웹뷰) 헤더 케이스가 다양 — app(back 아이콘)·webviewLevel(main/sub)·우측 액션 조합으로 분기 (Figma 5:1169 App bar). base Header 대신 Trost 화면에서는 이걸 사용.

## pitfalls

- Trost 화면이면 base `<Header>` 가 아니라 `<TrostAppBar>` 사용.
- 앱 다운로드 버튼 노출 토글: `showAppDownload`. 라벨: `appDownloadLabel`. 핸들러: `onAppDownload`.
- Trost 의 AuthMenu separator 는 'none' (디바이더 없음). Geniet 의 'divider' 패턴과 다름.
- 모바일 홈 (모바일 웹 / 앱 인-웹뷰 홈 공용): `variant='mobile'` + `pointChip` 또는 `mobileSearchPlaceholder` 가 있으면 2단 rich 레이아웃. `pointChip.icon` 미지정 시 `TrostEnergyCoinIcon` (다크 코인 + 노란 번개) 자동.
- 단순 단단(로고+로그인) 모바일 헤더가 필요하면 `pointChip` / `mobileSearchPlaceholder` 둘 다 비우면 fallback 단단 레이아웃.
- webview 헤더는 앱이 2종이라 케이스가 다양 — `app`('trost'=쉐브론 back / 'cashwalk-trost'=화살표 back), `webviewLevel`('main'=좌측 타이틀 20px·h56·back 없음 / 'sub'=중앙 타이틀 16px·h44·back. 기본 'sub').
- webview 우측 액션은 핸들러를 넘긴 것만 노출 (순서 검색→설정→텍스트→알림): `onSearchClick`/`onSettingClick`/`onNotificationClick`(+`hasNotification` 점)/`webviewActionText`+`onWebviewActionText`(cobalt 텍스트). 액션 없는 단순 sub 는 `webviewTitle`+`onBack` 만.
- webview main 홈(로고+포인트+알림)은 `webviewLevel='main'` + `logo` + `pointChip`(타이틀 미지정) + `onNotificationClick`.

## recommended

- Desktop: `<TrostAppBar variant='desktop' logo={...} gnbItems={...} activeKey='home' authItems={...} searchPlaceholder='...' trendingKeywords={...} showAppDownload onAppDownload={...} />`
- Mobile 홈 (웹/앱 공용, 2단): `<TrostAppBar variant='mobile' logo={...} pointChip={{ amount:'123,990', href:'/point' }} showNotificationBell onNotificationClick={...} mobileSearchPlaceholder='심리검사, 상담, 마음챙김을 검색해보세요.' />`
- Webview sub (트로스트 앱 상세): `<TrostAppBar variant='webview' webviewTitle='마음건강 검사' onBack={...} onSettingClick={...} onNotificationClick={...} />`
- Webview sub ((캐시워크)트로스트, 화살표 back): `<TrostAppBar variant='webview' app='cashwalk-trost' webviewTitle='타이틀' onBack={...} onSettingClick={...} onNotificationClick={...} />`
- Webview main (좌측 타이틀 + 검색): `<TrostAppBar variant='webview' webviewLevel='main' webviewTitle='심리상담' onSearchClick={...} onNotificationClick={...} />`
- Webview sub/text (완료 등 텍스트 액션): `<TrostAppBar variant='webview' webviewTitle='타이틀' onBack={...} webviewActionText='완료' onWebviewActionText={...} />`
- HTML 목업(vanilla): `<nds-brand-header brand='trost' surface='mobile' active-key='home'>` — base nds-header 손수 조립 금지 (BrandHeader 가이드). 웹뷰는 surface='webview'.
