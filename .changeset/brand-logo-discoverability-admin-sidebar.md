---
"@nudge-design/mcp": patch
---

브랜드 로고 발견성 — admin/CMS 사이드바 로고를 컴포넌트로 (텍스트·수동 base64 우회 차단)

배경: 브랜드 로고는 `@nudge-design/assets` 에 5개 브랜드 모두 data URI 로 내장돼 있고 `<nds-brand-logo brand>` / `<nds-sidebar brand>` 가 자동 주입하는데, 이 easy-path 가 캐포비에만 표면화돼 있어 다른 브랜드(예: 지니어트) 백오피스 CMS 사이드바에서 텍스트 placeholder→빌드 산출물 base64 추출이라는 우회가 반복됐다.

- **BrandLogo 가이드 일반화** — 캐포비 온보딩 중심 서술을 모든 브랜드의 백오피스/CMS 사이드바·헤더·어드민 셸 로고 슬롯으로 확장. "antd 등 비-DS 화면이라 패키지 import 못 한다"는 오해를 명시 차단(`import { getBrandLogo }` / `<BrandLogo>`).
- **admin-shell 패턴** — 사이드바/톱바 로고 = `<nds-sidebar brand>` 자동 주입(또는 `<nds-brand-logo brand>`). 텍스트 placeholder·색박스·빌드 산출물 base64 추출 금지 규칙 + avoid + metric 추가.
- **get_brand brandLogos 안내 보강** — snsLogos 수준으로: 컴포넌트 경로(`<nds-brand-logo>` data URI 내장) + 목업/호스팅 이중 경로(getBrandLogo import).
- **validator 신규 룰 `admin-sidebar-logo-not-component` (warn)** — admin 셸 사이드바·톱바에 텍스트 로고나 수동 base64 `<img>` 가 있고 `<nds-sidebar brand>`/`<nds-brand-logo>` 가 없으면 환기. 캐포비 온보딩 한정이던 text-logo 차단을 전 브랜드 admin 셸로 일반화. 사이드바 아이콘(inline SVG)·계정 아바타는 오탐 제외(테스트 6건).
