---
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/styles": patch
---

List 에 header/footer 슬롯 추가 + 리뷰 리스트 패턴/가이드 정비 (리뷰 화면 목업 피드백)

- **List `header`/`footer` 슬롯 신설** (react/styles/html 3면) — 리스트가 섹션 제목·"더 보기" 버튼·Pagination 을 직접 소유. role=presentation 이라 리스트 항목 수에 안 잡힘. 카드/divided 변형에선 header↔첫 아이템, 마지막 아이템↔footer 사이 구분선 자동.
- **신규 `pattern:review-list` 가이드** — 리뷰 나열 = `List`(header/footer) + `ReviewCard` 아이템. '도움돼요'는 ReviewCard `footer` 슬롯(카드 안), '더 보기'는 List `footer`(모바일=full-width Button / 어드민=Pagination, 맥락별).
- **ReviewCard 가이드 보강** — '도움돼요/좋아요/신고'는 반드시 `footer` 슬롯에(카드 밖 형제 금지) do/dont 예시 추가. 목업에서 액션 버튼이 카드 밖으로 떨어지는 오용 재발 방지.
- **List 가이드** — header/footer 슬롯 용법 추가.

컴포넌트 동작 변화 없음(순수 추가). 기존 List 사용처 영향 없음.
