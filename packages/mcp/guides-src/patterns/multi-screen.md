---
examples:
  - verdict: good
    source: |-
      <div class="mockup-canvas">
        <section class="mockup-screen" data-device="mobile" data-label="홈">
          <nds-brand-header brand="runmile" surface="mobile"></nds-brand-header>
          <main style="flex:1; padding: var(--semantic-inset-screen);">…</main>
        </section>
        <section class="mockup-screen" data-device="webview" data-label="상세">
          <nds-brand-header brand="runmile" surface="webview"></nds-brand-header>
          <main style="flex:1; padding: var(--semantic-inset-screen);">…</main>
        </section>
      </div>
      <!-- 화면 2개 → 상단 전환 탭 자동(홈/상세). 기본 탭, '전체'로 나란히. -->
    caption: 각 스크린이 자체 헤더 + device 최소높이로 자기완결. 화면 2개라 탭 스위처 자동 — 기본은 한 번에 한 화면(미리보기 친화), '전체'로 나란히 비교.
  - verdict: bad
    source: |-
      <main style="max-width:720px;margin:0 auto;">…홈…</main>
      <main style="max-width:720px;margin:0 auto;">…상세…</main>
      <style>@media(max-width:600px){.web-header{display:none}}</style>
    caption: max-width 컨테이너로 세로로 쌓고(높이는 내용에 맡김) 헤더는 미디어쿼리 토글 — 디바이스 프레임도 자기완결도 없음.
metrics:
  canvasClass: mockup-canvas
  screenClass: mockup-screen
  deviceFrames: mobile 390×844 / webview 390×720 / web 1440×900 / tablet 834×1112
  defaultMode: tabs (화면 ≥2 자동) · data-mode='grid' 로 나란히
---

## summary

한 HTML 파일에 여러 화면을 '화면처럼' 보여주는 디바이스 프레임 + 탭 스위처 패턴. 회고: 스크린 높이를 내용에 맡겨(min-height 없음) 화면마다 제각각이고, 각 스크린이 자체 헤더/푸터도 없어 디바이스가 아니라 하나의 긴 페이지로 보였다. → .mockup-canvas 안에 .mockup-screen[data-device] 프레임을 나열하고, 각 스크린은 자체 헤더(+필요시 푸터) + device 최소높이로 자기완결시킨다. 화면이 2개 이상이면 런타임이 상단에 전환 탭을 자동 주입(기본 '탭' = 한 번에 한 화면, '전체' = 옆으로 나란히). 프레임 CSS/JS 는 build_singlefile_html 이 자동 inline — 클래스만 쓰면 된다(별도 <style>/스크립트 불필요).

## rules

- 여러 화면 = `.mockup-canvas` > `.mockup-screen` N개. 프레임마다 `data-device='mobile|webview|web|tablet'` 로 디바이스 폭+최소높이를 정한다(mobile 390×844 / webview 390×720 / web 1440×900 / tablet 834×1112).
- 각 `.mockup-screen` 은 자기완결: 자체 `<nds-brand-header surface=…>`(+필요시 `<nds-brand-footer>`) + device 최소높이. 내용이 짧아도 device 높이를 유지해 '화면'처럼 보인다 — 높이를 내용에 맡기지 말 것.
- 화면 ≥2 → 런타임이 상단 전환 탭을 자동 생성(탭 라벨 = 각 스크린 `data-label`, 없으면 '화면 N'). 기본 모드 '탭'(한 번에 한 화면 — 미리보기 친화), 스위처의 '전체' 또는 `<div class="mockup-canvas" data-mode="grid">` 로 옆으로 나란히 비교.
- 브랜드 헤더는 프레임 안에서 `<nds-brand-header brand surface='web|mobile|webview'>` — surface 로 디바이스별 헤더(PC GNB / 모바일 컴팩트 / 웹뷰 뒤로가기)가 자동 분기. base `<nds-header>` 손수 조립 금지.
- 프레임/스위처(.mockup-canvas · .mockup-screen)는 목업 전용으로 빌드가 자동 inline — `<style>` 에 `.screen{width:…}` 나 미디어쿼리 토글을 직접 쓰지 말 것(클래스만 사용).
- 단일 화면 목업이면 `.mockup-screen` 하나(또는 캔버스 없이 `<main>` 하나)로 충분 — 탭은 화면이 2개 이상일 때만 자동 생성.

## avoid

- 스크린 높이를 내용에 맡겨(min-height 없이) 화면마다 높이가 제각각
- 각 스크린에 자체 헤더/푸터 없이 하나의 긴 페이지로 쌓기
- @media 로 모바일/웹 헤더를 display 토글 (동시 비교 불가)
- base <nds-header> + nds-header-logo/menu 손수 조립으로 브랜드 GNB 흉내
- 디바이스 프레임 너비/높이를 <style> 에 손으로 재정의 (.mockup-screen[data-device] 프리셋 사용)
