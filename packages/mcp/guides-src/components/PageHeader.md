---
{}
---

## summary

페이지 단위 헤더. 제목 + 서브타이틀 + 우측 액션 + 하단 탭 슬롯. AppBar(글로벌 네비)와 분리.

## pitfalls

- 글로벌 네비는 AppBar. PageHeader는 각 페이지 안의 타이틀 영역.
- onBack 지정 시 좌측 ← 자동 노출 — 직접 IconButton 추가하지 말 것 (이중 노출).
- bottom 슬롯은 헤더 padding 외곽까지 음수 마진으로 펼쳐짐. Tabs를 그 안에서 padding 직접 줄 때 0/24/0 등으로 미세 조정.
- bordered=true는 스크롤되는 본문과 헤더를 분리할 때만 사용. 분리감이 필요 없으면 false.

## recommended

- 디테일: title + onBack + actions
- 리스트: title + subtitle + actions(생성 버튼)
- 탭형 페이지: title + bottom={<Tabs />}

## examplesHtml.do

```html
<nds-page-header page-title="설정" subtitle="계정과 알림을 관리하세요" show-back bordered>
  <nds-breadcrumb slot="breadcrumb" items='[{"label":"홈","href":"/"}]'></nds-breadcrumb>
  <nds-button slot="actions" color="primary">저장</nds-button>
</nds-page-header>
<script>el.addEventListener("nds-page-header-back", () => history.back());</script>
```

## examplesHtml.dont

```html
<!-- show-back 만 — 뒤로가기 이벤트 처리 없음 -->
<nds-page-header page-title="설정" show-back></nds-page-header>
```
