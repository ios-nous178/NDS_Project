---
metrics:
  project: runmile (러닝 대회·레이스 모집/참가 + 러너 커뮤니티)
  homeWeb: "데스크탑 — 상단 글로벌 nav(대회 정보/커뮤니티) + 검색 → '모집중인 대회' 일러스트 대회 카드 3-up 그리드(포스터 썸네일 + 제목 + 기간 + 해시태그 + New/모집중 배지) + 우측 커뮤니티/랭킹 사이드 → '진행중인 대회' 그리드 → 푸터"
  homeChatWeb: "홈 위에 우측 '채팅' 드로어 패널 — 참여중인 채팅방 list + 인기 채팅방(아바타 + 방 제목 + 미읽음 카운트 배지)"
  competitionDetailWeb: "대회 상세 — 포스터 + 정보 테이블(기간/참가비/거리 등) + 신청 CTA(coral) → 코스 안내 지도 → 대회 안내 본문 → 기념품/리워드 상품 그리드"
  card: "대회 카드 = 일러스트 포스터 썸네일(4:5 안팎) + 제목 + 기간 + 해시태그 + New/모집중 상태 배지. 그리드 3-up 반복 섹션."
  accent: 코랄·핑크 브랜드 컬러 — CTA(신청)/배지/링크. 대회 포스터 일러스트가 시각 주인공.
  status: 스크린샷 레퍼런스 카탈로그 (레이아웃·구성 SSOT). 정확한 색/여백/치수 토큰은 component 가이드 + 프로젝트 토큰이 SSOT.
references:
  - label: "Runmile 웹 홈 — 대회 모집 (desktop)"
    image: references/runmile-web-home.png
    caption: "상단 nav + 검색, '모집중인 대회' 일러스트 대회 카드 3-up 그리드 + 우측 커뮤니티/랭킹 사이드, '진행중인 대회' 그리드, 푸터."
    project: runmile
  - label: "Runmile 웹 홈 + 채팅 드로어 (desktop)"
    image: references/runmile-web-home-chat.png
    caption: "홈 위 우측 '채팅' 드로어 — 참여중인 채팅방 list + 인기 채팅방(아바타 + 제목 + 미읽음 배지)."
    project: runmile
  - label: "Runmile 대회 상세 (desktop)"
    image: references/runmile-web-competition-detail.png
    caption: "포스터 + 정보 테이블 + 신청 CTA(coral) → 코스 지도 → 대회 안내 본문 → 기념품/리워드 상품 그리드."
    project: runmile
---

## summary

Runmile(러닝 대회·레이스 모집/참가 + 러너 커뮤니티) 화면의 **시각 레퍼런스 카탈로그** — 웹 홈(대회 모집) / 홈+채팅 드로어 / 대회 상세 3종 스크린샷을 담는다. Runmile 은 대회 포스터 일러스트가 시각 주인공이라 UI 채도는 낮추고 코랄·핑크 브랜드 컬러를 신청 CTA·상태 배지·링크에만 쓴다. 화면을 새로 짤 때 **레이아웃·구성·위계의 출처**로 이 스크린샷들을 먼저 보고(`references[].imageAbsolutePath`), 정확한 색·여백·치수·컴포넌트 선택은 해당 `component:*` 가이드와 프로젝트 토큰을 SSOT 로 따른다.

## rules

- **대회 카드 그리드 = '카드 1장 = 대회 1건'.** 일러스트 포스터 썸네일 + 제목 + 기간 + 해시태그 + 상태 배지(New/모집중/마감). 홈은 이 카드를 3-up 행으로 묶은 '모집중/진행중' 섹션을 반복 → 섹션 컨테이너는 헤더(섹션명 + 더보기)를 소유하는 `pattern:card-section` / `List` 정합.
- **상태 배지는 `Chip`/배지 토큰으로.** New·모집중·마감 같은 상태 라벨은 카드 위 일관된 badge — 임의 색 박스 금지, `component:Chip`/배지 시멘틱.
- **대회 상세는 detail 패턴** — 포스터 + 정보 테이블(기간/참가비/거리) + 신청 CTA 1개 → 코스 지도 → 안내 본문 → 기념품 그리드. 신청 CTA 는 화면당 primary solid 1개(`pattern:cta-group`).
- **채팅 드로어는 우측 패널(오버레이) 구조.** 참여중인 채팅방 list + 인기 채팅방 — 미읽음 카운트는 배지. 본문 위에 떠도 본문 레이아웃은 유지(`popover-portal-and-modal-scroll` 정합, 드로어 내부만 스크롤).
- **브랜드 컬러는 토큰으로만.** 코랄·핑크 accent 는 `--semantic-*`(project) 토큰 cascade 로 흐른다 — 컴포넌트/목업에 hex 하드코딩 금지(`get_guide({ topic: 'principles' })`).
- 새 Runmile 화면 작업 전 이 카탈로그의 해당 스크린샷을 `references.md` 의 `[good]` 소스로 먼저 등록(`pattern:visual-reference` 게이트).

## avoid

- 스크린샷의 색·여백·치수를 픽셀 단위로 그대로 베끼기 — 이 카탈로그는 **레이아웃·구성 참고용**이고, 정확한 값은 component 가이드 + 프로젝트 토큰이 SSOT(어긋나면 토큰이 우선).
- 대회 카드를 `ListItem` row 로 욱여넣기 — 포스터+제목+기간+해시태그+배지 카드는 `Card`.
- 상태 배지(New/모집중)를 임의 색 인라인 박스로 — `Chip`/배지 시멘틱 토큰.
- 코랄·핑크 accent 를 UI 전반에 칠하기 — 대회 포스터 일러스트와 충돌. accent 는 CTA·배지·링크 한정.
- Runmile 전용이라며 컴포넌트에 `[data-project="runmile"]` 색 분기 추가 — 프로젝트 차이는 프로젝트 토큰 파일에서 값만 override(`CLAUDE.md` 프로젝트 분기 금지 규칙).
