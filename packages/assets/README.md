# @nudge-design/assets

Nudge Design System 의 **자산 SSOT**. 5 브랜드(`trost` / `geniet` / `nudge-eap` / `cashwalk-biz` / `runmile`)의 로고 파일 + 브랜드별 자산 매니페스트 + base64 fallback 을 한 곳에서 관리.

## 왜 이 패키지가 필요한가

이전엔 brand-logo 파일이 3 군데에 중복 복제되어 있었음:

- `apps/storybook/public/brand-logos/`
- `packages/html/test-fixture/_assets/brand-logos/`
- `packages/html/src/components/brand-logo-defaults.ts` + `packages/react/src/brand-logo-defaults.ts` (base64 fallback, 1:1 복제)

그래서 디자이너가 로고 1개 갱신 → 3~4 군데 다 갱신 + drift 위험. `@nudge-design/assets` 가 **단일 SSOT** 가 되고, 나머지는 빌드 시 자동 복사 / re-export.

## 사용법

### 1. 파일 URL 만 필요 (external consumer)

```ts
import { getBrandLogo } from "@nudge-design/assets";

const logo = getBrandLogo("geniet", "pc");
// → { filename: "geniet-logo-pc.webp", dataUri: "data:image/webp;base64,...", ... }

// public/brand-logos/ 에 호스팅한 경우
<img src={`/brand-logos/${logo.filename}`} alt="Geniet" />

// asset hosting 없이 base64 fallback
<img src={logo.dataUri} alt="Geniet" />
```

### 2. 브랜드 전체 로고 셋

```ts
import { getBrandLogos } from "@nudge-design/assets";

const logos = getBrandLogos("trost");
// → { default: {...}, mobile: {...} }
```

### 3. MCP 에서 조회

```
get_brand({ brand: "geniet" }).assets.logos
```

## 파일명 컨벤션 (외부 API 호환)

기존 외부 소비자가 `public/brand-logos/{filename}` 패턴에 이미 의존하고 있어서 **파일명은 절대 바꾸지 않음**. 대신 일관된 인터페이스 (`getBrandLogo(slug, variant)`) 로 함정을 흡수.

| 브랜드       | variant 키               | 실제 파일명                                         |
| ------------ | ------------------------ | --------------------------------------------------- |
| trost        | `default`                | `trost-logo.svg`                                    |
| trost        | `mobile`                 | `trost-logo-mobile.webp`                            |
| geniet       | `pc`                     | `geniet-logo-pc.webp`                               |
| geniet       | `mobile`                 | `geniet-logo-mobile.webp`                           |
| geniet       | `footer`                 | `geniet-logo-footer.webp`                           |
| nudge-eap    | `default`                | `nudge-eap-logo.png`                                |
| nudge-eap    | `svg`                    | `nudge-eap-logo.svg`                                |
| nudge-eap    | `footer`                 | `nudge-eap-logo-footer.png`                         |
| cashwalk-biz | `horizontal`             | `cashwalk-biz/cashwalk-horizontal.png`              |
| cashwalk-biz | `vertical`               | `cashwalk-biz/cashwalk-vertical.png`                |
| cashwalk-biz | `horizontalSvg`          | `cashwalk-biz/cashwalk-for-business-horizontal.svg` |
| runmile      | `default` (red, #FF5B37) | `runmile-logo.svg`                                  |
| runmile      | `mono` (black)           | `runmile-logo-black.svg`                            |
| runmile      | `muted` (gray700)        | `runmile-logo-gray700.svg`                          |

## 패키지 구조

```
src/
├── brand-logos/             ← 원본 파일 (단일 SSOT)
│   ├── trost/
│   ├── geniet/
│   ├── nudge-eap/
│   ├── cashwalk-biz/
│   └── runmile/             (로고 미준비 — 매니페스트에 empty)
├── brand-logo-manifest.ts   ← BRAND_LOGOS, getBrandLogo, 강타입
├── brand-logo-defaults.ts   ← base64 data URI (html/react 의 1:1 복제 통합)
└── index.ts
```
