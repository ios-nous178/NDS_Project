---
metrics:
  container: List (role=list + header/footer 슬롯)
  item: ReviewCard (카드 1장 = 리뷰 1건)
  helpfulSlot: ReviewCard footer (도움돼요/좋아요/신고)
  moreFooter: List footer — full-width 더보기 Button 또는 Pagination
  paginationThreshold: 6
---

## summary

리뷰/후기를 여러 건 나열하는 패턴. 리뷰는 **'카드 1장 = 리뷰 1건'** 이라 조밀한 row(`ListItem` 의 leading/title/trailing)가 아니라 `ReviewCard` 를 쓴다. 컨테이너는 `List`(role=list + header/footer 슬롯)로 감싸 "리뷰 N건" 헤더와 "더 보기" 푸터를 리스트가 직접 소유하게 한다. (상품 리뷰·상담 후기·앱 피드 공통)

## rules

- **아이템 = ReviewCard, 컨테이너 = List.** 리뷰 본문은 멀티라인 + 별점 + 태그 + 액션이라 `ListItem` 의 row 레이아웃에 안 맞는다 → `ReviewCard` 를 그대로 쓰고, `List` 로 감싸 리스트 의미(role=list)와 header/footer 를 얻는다.
- **'도움돼요'·좋아요·신고는 ReviewCard 의 `footer` 슬롯 안에.** 카드 밖 형제로 두지 않는다(카드 경계 밖으로 떨어져 어느 리뷰의 액션인지 끊긴다). → `component:ReviewCard` 의 footer do/dont 참조.
- **"더 보기"는 List 의 `footer` 슬롯에.** 카드 밖 떠돌이 버튼이 아니라 리스트가 소유하는 푸터. 맥락별 두 형태:
  - **모바일 리뷰/피드** → `footer` 에 **full-width outlined `Button`** "리뷰 더 보기 (전체 N)". 개수(N)를 함께 노출.
  - **어드민/데이터 많은 표 성격** → `footer` 에 **`Pagination`** (아이템 6개 이상이면 권장 — `pattern:card-section` 과 동일 임계).
- **헤더(선택)는 List 의 `header` 슬롯에** — "리뷰 47", 정렬/필터 토글 등. 리스트가 소유.
- **변형**: 카드 사이 간격이 필요한 카드형은 `List variant="plain"`. 구분선으로 붙이는 조밀형은 `variant="divided"`.
- **밀도**: `pattern:dense-list` 와 정합 — 카드당 주요 정보 3·보조 5 이내, 반복 카드 CTA 는 도움돼요 1개 수준.
- **합성 형태**: `<List variant="plain" header={제목} footer={더보기 Button 또는 Pagination}>` 안에 리뷰마다 `<ListItem>` 으로 감싼 `<ReviewCard ... footer={도움돼요 버튼} />`. (List = 리스트 의미·헤더/푸터, ListItem = li 래퍼·간격, ReviewCard = 카드 본체, ReviewCard.footer = 도움돼요)

## avoid

- '도움돼요'·더보기 버튼을 카드/리스트 **밖 형제**로 두기 — 경계 밖으로 떨어져 소속이 끊긴다. (footer 슬롯으로)
- 리뷰를 `ListItem` 의 leading/title/description row 로 욱여넣기 — 별점·태그·멀티라인 본문이 깨진다. 리뷰는 ReviewCard.
- 컨테이너 없이 `ReviewCard` 만 줄줄이 쌓기 — role=list 의미·헤더/푸터 둘 곳이 없어진다.
- 같은 화면에서 더보기 버튼 + Pagination 동시 사용 — 둘 중 하나(맥락별).
- 카드마다 elevation/색 배경 반복 — `pattern:dense-list` 위반.
