---
{}
---

## summary

Brand chrome wrappers — BrandHeader + BrandFooter + BrandBottomNav 의 umbrella. **개별 BrandHeader / BrandFooter / BrandBottomNav 가이드를 우선 참고.** `nds-brand-chrome.ts` 한 파일에 5개 브랜드 (nudge-eap / trost / geniet / cashwalk-biz / runmile) 의 BRAND_DATA (로고/메뉴/사업자정보/footer 링크/bottomNav 탭) 가 모두 정의돼 있다. 손수 조립한 헤더/푸터/바텀네비가 발견되면 Brand* 한 줄로 즉시 교체.

## pitfalls

- 이 컴포넌트는 wrapper — 실제 사용 시 `<nds-brand-header>` / `<nds-brand-footer>` / `<nds-brand-bottom-nav>` 를 호출. `<nds-brand-chrome>` 단독 사용은 없음.
- BRAND_DATA 를 수정하려면 DS 레포의 `packages/html/src/components/nds-brand-chrome.ts` 직접 편집 (외부 mockup 프로젝트에서는 불가능).

## examplesHtml.do

```html
<nds-brand-header brand="trost" surface="web" active-key="counsel"></nds-brand-header>
<!-- ...page content... -->
<nds-brand-bottom-nav brand="trost" active-key="counsel"></nds-brand-bottom-nav>
<nds-brand-footer brand="trost" surface="app"></nds-brand-footer>
```

## examplesHtml.dont

```html
<!-- nds-brand-chrome 단독 사용 — wrapper 라 의미 없음 -->
<nds-brand-chrome brand="trost"></nds-brand-chrome>
```
