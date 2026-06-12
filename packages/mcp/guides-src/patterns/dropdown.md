---
metrics:
  defaultMaxHeight: 320px
  searchThreshold: 15
  virtualizationThreshold: 50
---

## summary

Select/Dropdown 옵션 수에 따른 높이와 검색 정책.

## rules

- 옵션 7개 이하는 일반 Select.
- 옵션 8-15개는 max-height 320px 안팎의 스크롤 목록.
- 옵션 15개 초과는 검색 가능 Select/Autocomplete 검토.
- 옵션 50개 초과는 서버 검색 또는 가상화 검토.
- 옵션 라벨은 1줄 유지. 보조 설명은 help text나 별도 상세 영역으로 분리.

## avoid

- 긴 문장 옵션을 드롭다운에 그대로 노출
- 옵션 15개 초과인데 검색 없이 긴 스크롤만 제공
- 모바일에서 좁은 팝오버 안에 긴 옵션 목록 표시
