---
{}
---

## summary

Project chrome wrappers — ProjectHeader + ProjectFooter + ProjectBottomNav 의 umbrella. **개별 ProjectHeader / ProjectFooter / ProjectBottomNav 가이드를 우선 참고.** `nds-project-chrome.ts` 한 파일에 5개 프로젝트 (nudge-eap / trost / geniet / cashwalk-biz / runmile) 의 PROJECT_DATA (로고/메뉴/사업자정보/footer 링크/bottomNav 탭) 가 모두 정의돼 있다. 손수 조립한 헤더/푸터/바텀네비가 발견되면 Project* 한 줄로 즉시 교체.

## pitfalls

- 이 컴포넌트는 wrapper — 실제 사용 시 `<nds-project-header>` / `<nds-project-footer>` / `<nds-project-bottom-nav>` 를 호출. `<nds-project-chrome>` 단독 사용은 없음.
- PROJECT_DATA 를 수정하려면 DS 레포의 `packages/html/src/components/nds-project-chrome.ts` 직접 편집 (외부 mockup 프로젝트에서는 불가능).

## examplesHtml.do

```html
<nds-project-header project="trost" surface="web" active-key="counsel"></nds-project-header>
<!-- ...page content... -->
<nds-project-bottom-nav project="trost" active-key="counsel"></nds-project-bottom-nav>
<nds-project-footer project="trost" surface="app"></nds-project-footer>
```

## examplesHtml.dont

```html
<!-- nds-project-chrome 단독 사용 — wrapper 라 의미 없음 -->
<nds-project-chrome project="trost"></nds-project-chrome>
```
