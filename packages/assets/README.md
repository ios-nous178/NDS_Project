# @nudge-design/assets

Nudge Design System 의 **자산 SSOT**. 5 브랜드(`trost` / `geniet` / `nudge-eap` / `cashwalk-biz` / `runmile`)의 로고 파일 + 브랜드별 자산 매니페스트 + base64 fallback 을 한 곳에서 관리.

## 왜 이 패키지가 필요한가

이전엔 brand-logo 파일이 여러 군데에 중복 복제되어 있었음:

- `apps/storybook` static assets mount
- `packages/html/test-fixture/_assets/`
- `packages/html/src/components/brand-logo-defaults.ts` + `packages/react/src/brand-logo-defaults.ts` (base64 fallback, 1:1 복제)

그래서 디자이너가 로고 1개 갱신 → 3~4 군데 다 갱신 + drift 위험. `@nudge-design/assets` 가 **단일 SSOT** 가 되고, 나머지는 빌드 시 자동 복사 / re-export.

## 사용법

### 1. 파일 URL 만 필요 (external consumer)

```ts
import { getBrandLogo } from "@nudge-design/assets";

const logo = getBrandLogo("geniet", "pc");
// → { filename: "geniet-logo-pc.webp", dataUri: "data:image/webp;base64,...", ... }

// public/assets/ 에 @nudge-design/assets/files taxonomy 로 호스팅한 경우
<img src={`/assets/${logo.filename}`} alt="Geniet" />

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

S3/CDN mirror 는 `files/brand/{brand}/...` 또는 `files/shared/...` taxonomy 를 따른다.
외부 소비자는 일관된 인터페이스 (`getBrandLogo(slug, variant)`) 로 filename 을 받아 조립한다.

| 브랜드       | variant 키               | 실제 파일명                                         |
| ------------ | ------------------------ | --------------------------------------------------- |
| trost        | `default`                | `brand/trost/logos/trost-logo.svg`                                    |
| trost        | `mobile`                 | `brand/trost/logos/trost-logo-mobile.webp`                            |
| geniet       | `pc`                     | `brand/geniet/logos/geniet-logo-pc.webp`                               |
| geniet       | `mobile`                 | `brand/geniet/logos/geniet-logo-mobile.webp`                           |
| geniet       | `footer`                 | `brand/geniet/logos/geniet-logo-footer.webp`                           |
| nudge-eap    | `default`                | `brand/nudge-eap/logos/nudge-eap-logo.png`                            |
| nudge-eap    | `svg`                    | `brand/nudge-eap/logos/nudge-eap-logo.svg`                            |
| nudge-eap    | `footer`                 | `brand/nudge-eap/logos/nudge-eap-logo-footer.png`                     |
| nudge-eap    | `koHorizontal`           | `brand/nudge-eap/logos/nudge-eap-ko.svg`                              |
| nudge-eap    | `koEnHorizontal` (대표)  | `brand/nudge-eap/logos/nudge-eap-koen.svg`                            |
| nudge-eap    | `enHorizontal`           | `brand/nudge-eap/logos/nudge-eap-en.svg`                              |
| nudge-eap    | `enMono` (다크)          | `brand/nudge-eap/logos/nudge-eap-en-dark.svg`                         |
| nudge-eap    | `symbol` (앱아이콘)      | `brand/nudge-eap/logos/nudge-eap-symbol.svg`                          |
| cashwalk-biz | `horizontal`             | `brand/cashwalk-biz/logos/cashwalk-horizontal.png`                    |
| cashwalk-biz | `vertical`               | `brand/cashwalk-biz/logos/cashwalk-vertical.png`                      |
| cashwalk-biz | `horizontalSvg`          | `brand/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg`       |
| runmile      | `default` (red, #FF5B37) | `brand/runmile/logos/runmile-logo.svg`                                |
| runmile      | `mono` (black)           | `brand/runmile/logos/runmile-logo-black.svg`                          |
| runmile      | `muted` (gray700)        | `brand/runmile/logos/runmile-logo-gray700.svg`                        |

> **DAIN 로고**는 DS 브랜드(`BrandSlug`)가 아니라 NudgeEAP 문맥 전용 서브브랜드라
> `getBrandLogo` variant 가 아닌 별도 상수로 분리: `import { DAIN_LOGO } from "@nudge-design/assets"`
> (`brand/nudge-eap/logos/dain-logo.svg`).

## 패키지 구조

```
src/
├── files/                   ← 원본 파일 (단일 SSOT, S3 mirror taxonomy)
│   ├── brand/
│   │   ├── trost/logos/
│   │   ├── geniet/logos/
│   │   ├── nudge-eap/logos|images|profiles/
│   │   ├── cashwalk-biz/logos|illustrations/
│   │   └── runmile/logos|illustrations|marathon-events|profiles/
│   └── shared/sns-logos/
├── brand-logo-manifest.ts   ← BRAND_LOGOS, getBrandLogo, 강타입
├── brand-logo-defaults.ts   ← base64 data URI (html/react 의 1:1 복제 통합)
├── nudge-eap-image-metadata.ts ← NudgeEAP 화면 이미지 alias
├── nudge-img-metadata.ts    ← deprecated compatibility alias source
└── index.ts
```

## NudgeEAP img 자산

NudgeEAP Dev Figma (`mvecozaRQoGRePffskRgmh`, section 20:1699 "img") 의 화면용
이미지 58종 · 8 카테고리. 로고(IMG/logo)는 제외 (별도 가이드).

```ts
import {
  NUDGE_IMG_METADATA,
  getNudgeImg,
  getNudgeImgCategory,
} from "@nudge-design/assets/nudge-eap-images";

const medal = getNudgeImg("rank", "rank-01");
// → { category: "rank", id: "rank-01", filename: "brand/nudge-eap/images/rank/rank-01.png", ... }
<img src={`/img/${medal.filename}`} alt="1위" />

getNudgeImgCategory("psych-tests"); // 심리검사 아이콘 12종
```

| 카테고리       | 수  | 비고                         |
| -------------- | --- | ---------------------------- |
| `psych-tests`  | 12  | 심리검사 진입 아이콘         |
| `menu-app`     | 9   | 앱 메뉴 진입점               |
| `menu-web`     | 8   | 웹 메뉴 (default/selected)   |
| `circle-icons` | 5   | 원형 뱃지 (blue/white)       |
| `consult`      | 3   | 상담탭 아이콘                |
| `gift`         | 5   | 기프트 카테고리              |
| `3d`           | 2   | 3D 일러스트 (워크랭킹/쇼핑)  |
| `rank`         | 3   | 랭킹 메달 1·2·3위            |
| `eap-profiles` | 11  | user/client/counselor 프로필 |

> **해상도**: **2x(base) + 3x(`@3x`)** PNG (marathon-events 와 동일). 디자이너
> Figma Export 원본이라 합성 컴포넌트까지 픽셀퍼펙트. `filename`=2x, `filename3x`=3x →
> `srcset` 으로 사용. (base 2x: 대부분 128×128, profiles 120, rank 80, 3d 198×148)

`@nudge-design/assets/nudge-img` 는 기존 소비자 호환을 위해 남겨둔 deprecated alias 입니다.
새 코드에서는 `@nudge-design/assets/nudge-eap-images` 를 사용합니다.
