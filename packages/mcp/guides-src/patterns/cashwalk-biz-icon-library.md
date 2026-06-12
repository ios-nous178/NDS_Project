---
metrics:
  totalIcons: 46
  categories: 6
  svgSyncStatus: pending — 디자인팀에서 export 받기 전까지 공용 아이콘 fallback
  relatedPatterns: iconography, cashwalk-biz-button, cashwalk-biz-input
---

## summary

캐시워크 포 비즈니스 (Cashwalk for Business) admin 전용 아이콘 라이브러리. 46 icons · 6 categories (Navigation / Action / Status / Social / GNB / Selection). 현재는 카탈로그 메타데이터만 등록되어 있고 SVG 자산은 미동기화 — 디자인팀에서 SVG export 받기 전까지 공용 @nudge-design/icons 의 매칭 아이콘으로 fallback.

## rules

- Navigation (7): chevron-up/down/left/right, arrow-up/down/right.
- Action (9): close, plus, search, delete, edit, delete-circle, refresh, filter, search-delete.
- Status (8): info, question, caution, error, check, check-circle-on, check-circle-off, open.
- Social (8): like, comment, share, ripple, bubble, message-quiz, banner, calendar.
- GNB (8): gnb-banner, gnb-channel, gnb-chat, gnb-quiz, gnb-member, gnb-setting, gnb-cash, download.
- Selection (6): radio-off/on, checkbox-off/on/error/on-green. Checkbox 의 'on-green' 은 success 표시용 별도 variant.
- 캐시워크 포 비즈니스 모드에서 brand prefix 아이콘이 별도 제공되기 전까지는 공용 아이콘을 사용하되, 의미가 같은 캐시워크 포 비즈니스 카탈로그 항목을 우선 fallback 후보로 본다.
- 동일 카테고리(Action / Status 등) 내 아이콘은 동일 weight / stroke 로 통일.
- Checkbox 의 error / on-green 분기는 가이드에 명시된 의미(에러 표시 / 성공 표시) 그대로 사용.

## avoid

- SVG 가 도착하기 전 임의로 다른 출처(아이콘셋, lucide 등) 아이콘을 캐시워크 포 비즈니스 화면에 섞지 말 것.
- 공용 아이콘과 캐시워크 포 비즈니스 아이콘 의미가 충돌하면 캐시워크 포 비즈니스 admin 화면에서는 캐시워크 포 비즈니스 우선.
