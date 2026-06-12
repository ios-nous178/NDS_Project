---
"@nudge-design/mcp": minor
---

영역 체계 3분화 — 서비스 / 어드민(b2b) / 백오피스(사내)

- **어드민(외부 제공 b2b 어드민 서비스)**: 하드게이트 브랜드만 지원 — `DS_ADMIN_BRANDS = cashwalk-biz, nudge-eap`. 이 브랜드들의 어드민은 antd 가 아니라 DS(html 워크플로우)로 만든다 (넛지EAP 는 전용 admin 토큰 없이 기존 DS 컴포넌트/토큰으로, 캐포비 전용 page-pattern/design-spec 게이트는 캐포비에만 유지). 게이트 밖 브랜드의 어드민 요청은 차단되고 백오피스 전환/DS팀 편입 안내를 반환한다.
- **백오피스(사내 어드민/CMS/운영툴)**: 기존 admin-cms(antd) 가이드를 중립화 — NudgeEAP 전용 문구(푸터 카피 등)를 `serviceName` 파라미터로 주입하는 공통 컨벤션으로 전환. 브랜드 무관 전 서비스 기본 지원. topic/intent 는 `backoffice` 가 canonical, `admin-cms` 는 영구 별칭으로 유지(기존 외부 워크스페이스 호환).
- **확답 우선 라우팅**: 운영자 화면 키워드(어드민/백오피스/CMS/운영툴 등)는 영역을 키워드로 추측하지 않고, get_setup/claude-md 가 가이드·셋업 본문 없이 확답 질문만 반환하는 하드스톱(`ambiguous-operator`)으로 동작 — `intent:'admin'`/`intent:'backoffice'` 명시 재호출로만 진행. 예외: 캐포비는 자체 admin DS 보유라 질문 없이 DS 경로 우회(기존 동작 보존).
- 어드민(b2b) 셋업 시 `nudge.surface=admin` 마커를 기록해 validator 표면 룰과 자동 연동.
