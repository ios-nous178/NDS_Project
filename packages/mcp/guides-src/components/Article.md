---
{}
---

## summary

게시글/공지/FAQ **상세 보기** 셸. 제목·메타(Header) + 본문(Body) + 첨부(Attachments) + 액션(Actions)을 묶는 레이아웃 compound. 좋아요 카운트·권한·작성자 데이터 등 **앱 로직은 0** — 모두 슬롯에 주입한다.

## pitfalls

- **목록/피드의 게시글 "카드"는 Article 이 아니다** — Card(Header/Title/Subtitle/Meta/Thumbnail) + ListItem 조합 패턴. Article 은 **상세 한 건** 전용.
- 본문은 `Article.Body` 의 `html` prop → 내부 sanitize 유틸로 안전 렌더(위험태그 제거 + 태그 allowlist). raw `<div dangerouslySetInnerHTML>` 직접 쓰지 말 것. 신뢰된 본문이면 `sanitize={false}`. (구 ContentViewer 강등 — 본문 렌더링이 Article.Body 로 통합됨.)
- 좋아요/공유/신고 버튼은 `Article.Actions` 에 LikeButton 등을 주입 — Article 은 카운트/토글 상태를 갖지 않는다(앱이 관리).
- 첨부는 `Article.Attachments` 안에 AttachmentItem 을 넣는다 — 첨부 다운로드 로직은 앱.
- html 은 container + subpart 엘리먼트(`<nds-article>`/`<nds-article-header|body|attachments|actions>`)로 미러 — 본문은 `<nds-article-body html="...">` 가 직접 sanitize 렌더한다.

## recommended

- 제목 heading 레벨은 화면 위계에 맞춰 `level`(기본 2)
- 메타 행은 "작성자 · 날짜 · 조회수" 순, caption 색(subtle)
- Actions 는 1차 액션(좋아요) 좌측, 보조(공유/신고) 우측 정렬은 앱에서 배치

## examplesHtml.do

```html
<nds-article>
  <nds-article-header>
    <h2 class="nds-article__title">6월 정기 점검 안내</h2>
    <div class="nds-article__meta">운영팀 · 2026.06.13 · 조회 1,204</div>
  </nds-article-header>
  <nds-article-body html="<p>점검 시간은…</p>"></nds-article-body>
  <nds-article-actions><nds-like-button count="12"></nds-like-button></nds-article-actions>
</nds-article>
```

## examplesHtml.dont

```html
<!-- 목록의 게시글 카드를 Article 로 — Card + ListItem 조합이 맞음 -->
<nds-article><h3>게시글 제목</h3><span>요약…</span></nds-article>
```
