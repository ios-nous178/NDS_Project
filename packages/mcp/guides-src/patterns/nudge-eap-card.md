---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=713-2
---

## summary

넛지EAP 서비스 카드(App·Web·PC) 생성 규칙 SSOT(Figma 713:2 CardRulesGuide). Card 컴포넌트(component:Card)의 Compound 슬롯을 쓰되, **넛지EAP 도메인 한정**으로 Geniet 도메인 카드와 다른 두 규칙을 적용한다 — ① **내부 CTA 허용**(상담 예약·전문가·프로그램 카드는 카드 최하단 CTA 1개를 가짐), ② **shadow 전면 금지**(카드 구분은 border 1px 로만, box-shadow/elevation 금지). Title 이 유일한 Required, 나머지 슬롯(Thumbnail·Avatar·Badge/Chip·Description·Metadata·CTA·Footer)은 모두 Optional 이며 화면 목적에 따라 조합한다. 색은 semantic 토큰만 — White/Surface bg, Border/Default, Project Color 는 CTA·인디케이터에만.

## rules

- Anatomy — Title(필수·Primary, 생략 불가) + Optional: Thumbnail(max 1, Avatar와 배타) · Avatar(max 1, Thumbnail과 배타) · Badge/Chip(max 2) · Description(max 3줄, line-clamp) · Metadata(max 2항목, Muted 12–13px) · CTA(max 1) · Footer(min-h 40, border-top + padding-top 16).
- Surface — Background: White 또는 Surface/Neutral 토큰만. Border: 1px `--semantic-border-default`(#E2E6EA). **Border-radius: 12px 고정**(radius[12]). **Shadow 사용 금지** — border 로만 카드 구분(넛지EAP 서비스 카드는 elevation 미사용).
- Spacing — Padding 16(min)~24(max) 전 방향 동일. 카드 간 gap 8(min)~16(max). 요소 간: Title↔Description 4px · Description↔Metadata 8px · Metadata↔CTA 16px. Footer separator: border-top 1px + padding-top 16px.
- Hierarchy(폰트 Pretendard) — Title=Headline5 Bold 18/26(`--font-size-headline-5`) 항상 최강조 · Description=Body3 Regular 14/20(`--font-size-body-3`) · Metadata=Caption1 Regular 13/18(`--font-size-caption-1`) Muted 필수 · CTA=Body3 Medium 14/20. Title 외 Primary 강조 1개 초과 금지.
- CTA 유형 4종(카드 컨텍스트별, 임의 크기 변형 금지) — ① Full-width: Btn Large 48px, 카드 너비 100%, radius 8, Solid/Primary(Project bg·white), Mobile/App 콘텐츠·프로그램 카드. ② Compact: Btn Small 40px, auto(min 80), radius 6, Outlined 또는 Solid/Primary, 요약·수치·공간 제약 카드. ③ Icon+Text: Btn Medium 44px, icon 16 + text(간격 6), radius 8, PC 상담 예약·전문가·퀵 액션 카드. ④ Ghost/Link: Text Button, "더 보기"·"자세히" 보조 액션, Project Color 텍스트 + underline/chevron.
- CTA 위치 — 항상 카드 최하단. Primary CTA 1개 원칙. clickable 카드 전체 + 내부 CTA 를 함께 쓸 땐 CTA 가 카드의 단일 Primary 액션이 되도록(중복 핸들러 주의).

## avoid

- 임의 pastel/gradient/opacity 배경(#E8F4FD·#FFF8E1·linear-gradient·rgba) — White/Surface 토큰 외 배경 금지.
- box-shadow / drop-shadow / elevation 레벨 — 넛지EAP 카드는 border-only.
- Project Color(#2B96ED) 카드 배경 — Project 는 CTA·인디케이터 전용. 카드 bg 로 채우기·project gradient 헤더 금지.
- Nested Card(카드 안 카드·bordered 박스 흉내) — List/Table/Section 으로 대체.
- Decorative/빈 카드·Title 없는 카드·아이콘만 든 카드.
- Badge+Chip+CTA+Metadata 4개 동시 — Optional 은 최대 2개 권장(정보 위계 붕괴).
- CTA 2개 이상·CTA 를 상단/중간 배치 — Primary 1개, 항상 최하단.
- radius/CTA 크기 임의 변형 — radius 12 고정, CTA 는 위 4종 크기만.
