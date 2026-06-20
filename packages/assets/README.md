# @nudge-design/assets

Nudge Design System 의 **자산 SSOT**. 5 프로젝트(`trost` / `geniet` / `nudge-eap` / `cashwalk-biz` / `runmile`)의 로고 파일 + 프로젝트별 자산 매니페스트 + base64 fallback 을 한 곳에서 관리.

## 왜 이 패키지가 필요한가

이전엔 project-logo 파일이 여러 군데에 중복 복제되어 있었음:

- `apps/storybook` static assets mount
- `packages/html/test-fixture/_assets/`
- `packages/html/src/components/project-logo-defaults.ts` + `packages/react/src/project-logo-defaults.ts` (base64 fallback, 1:1 복제)

그래서 디자이너가 로고 1개 갱신 → 3~4 군데 다 갱신 + drift 위험. `@nudge-design/assets` 가 **단일 SSOT** 가 되고, 나머지는 빌드 시 자동 복사 / re-export.

## 사용법

### 1. 파일 URL 만 필요 (external consumer)

```ts
import { getProjectLogo } from "@nudge-design/assets";

const logo = getProjectLogo("geniet", "pc");
// → { filename: "geniet-logo-pc.webp", dataUri: "data:image/webp;base64,...", ... }

// public/assets/ 에 @nudge-design/assets/files taxonomy 로 호스팅한 경우
<img src={`/assets/${logo.filename}`} alt="Geniet" />

// asset hosting 없이 base64 fallback
<img src={logo.dataUri} alt="Geniet" />
```

### 2. 프로젝트 전체 로고 셋

```ts
import { getProjectLogos } from "@nudge-design/assets";

const logos = getProjectLogos("trost");
// → { default: {...}, mobile: {...} }
```

### 3. MCP 에서 조회

```
get_project({ project: "geniet" }).assets.logos
```

## 파일명 컨벤션 (외부 API 호환)

S3/CDN mirror 는 `files/project/{project}/...` 또는 `files/shared/...` taxonomy 를 따른다.
외부 소비자는 일관된 인터페이스 (`getProjectLogo(slug, variant)`) 로 filename 을 받아 조립한다.

| 프로젝트       | variant 키               | 실제 파일명                                         |
| ------------ | ------------------------ | --------------------------------------------------- |
| trost        | `default` (검정, 밝은 bg)| `project/trost/logos/trost-logo.svg`                                    |
| trost        | `mobile`                 | `project/trost/logos/trost-logo-mobile.webp`                            |
| trost        | `white` (흰색, 어두운 bg)| `project/trost/logos/trost-logo-white.svg`                             |
| geniet       | `pc`                     | `project/geniet/logos/geniet-logo-pc.webp`                               |
| geniet       | `mobile`                 | `project/geniet/logos/geniet-logo-mobile.webp`                           |
| geniet       | `footer`                 | `project/geniet/logos/geniet-logo-footer.webp`                           |
| nudge-eap    | `default`                | `project/nudge-eap/logos/nudge-eap-logo.png`                            |
| nudge-eap    | `svg`                    | `project/nudge-eap/logos/nudge-eap-logo.svg`                            |
| nudge-eap    | `footer`                 | `project/nudge-eap/logos/nudge-eap-logo-footer.png`                     |
| nudge-eap    | `koHorizontal`           | `project/nudge-eap/logos/nudge-eap-ko.svg`                              |
| nudge-eap    | `koEnHorizontal` (대표)  | `project/nudge-eap/logos/nudge-eap-koen.svg`                            |
| nudge-eap    | `enHorizontal`           | `project/nudge-eap/logos/nudge-eap-en.svg`                              |
| nudge-eap    | `enMono` (다크)          | `project/nudge-eap/logos/nudge-eap-en-dark.svg`                         |
| nudge-eap    | `symbol` (앱아이콘)      | `project/nudge-eap/logos/nudge-eap-symbol.svg`                          |
| cashwalk-biz | `horizontal`             | `project/cashwalk-biz/logos/cashwalk-horizontal.png`                    |
| cashwalk-biz | `vertical`               | `project/cashwalk-biz/logos/cashwalk-vertical.png`                      |
| cashwalk-biz | `horizontalSvg`          | `project/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg`       |
| runmile      | `default` (red, #FF5B37) | `project/runmile/logos/runmile-logo.svg`                                |
| runmile      | `mono` (black)           | `project/runmile/logos/runmile-logo-black.svg`                          |
| runmile      | `muted` (gray700)        | `project/runmile/logos/runmile-logo-gray700.svg`                        |
| runmile      | `white` (어두운 배경)    | `project/runmile/logos/runmile-logo-white.svg`                          |

> **DAIN 로고**는 DS 프로젝트(`ProjectSlug`)가 아니라 NudgeEAP 문맥 전용 서브프로젝트라
> `getProjectLogo` variant 가 아닌 별도 상수로 분리: `import { DAIN_LOGO } from "@nudge-design/assets"`
> (`project/nudge-eap/logos/dain-logo.svg`).

## 명명 규칙 — 자산 id (Naming) — SSOT

자산은 `category` + `id` 로 식별하고(`getNudgeImg("rank", "rank-01")`), 물리 경로는 빌드가 조립한다.

### 1. id

- **kebab-case**, 소문자. 서술적(`dairy-baby-food`, `fast-food`, `rank-01`).
- 같은 카테고리 내 유일. 순번은 zero-pad 2자리(`rank-01`, `rank-02`).

### 2. 경로 / 변형

- 물리 경로: `project/{project}/{type}/{id}.{ext}` (예: `project/nudge-eap/images/rank/rank-01.png`). 공유 자산은 `shared/...`.
- 고해상도: 3x 는 **`{id}@3x.{ext}`** (`filename`=2x base, `filename3x`=3x → `srcset`).
- 로고 variant 키는 위 "파일명 컨벤션" 표 참조(`getProjectLogo(slug, variant)`).

### 3. 철자 — 아이콘 규칙과 동일, **단 upstream 잠금이 우선**

- 기본은 올바른 영어(`@nudge-design/icons` README §9).
- **예외**: 자산 id 는 **실제 Figma 노드명/파일명에 잠긴다**(traceability). upstream 이 오탈자여도 따라간다.
  - 예: runmile `community`(`figmaNodeName: "img/commnunity"`)·`no-result-white`(`figmaNodeName: "img/no-result · color=whtie"`)·state `alarm-empty`(`figmaNodeName: "img/alram"`) 은 **원본 노드명 오탈자를 figmaNodeName 에 그대로 보존**(traceability) — 각 metadata 모듈에 `commnunity (commUnity 아님)` 식으로 박제.
  - ⚠ 단 자산 **id 는 올바른 철자**(`community`·`alarm-empty`)를 쓴다 — 2026-06 런마일 5분류 재정비 때 id 교정(옛 `alram` id → `alarm-empty`), figmaNodeName 만 upstream 잠금. 새 자산도 id=올바른 철자 / figmaNodeName=Figma 원본.

## 패키지 구조

```
src/
├── files/                   ← 원본 파일 (단일 SSOT, S3 mirror taxonomy)
│   ├── project/
│   │   ├── trost/logos|images/
│   │   ├── geniet/logos/
│   │   ├── nudge-eap/logos|images|profiles/
│   │   ├── cashwalk-biz/logos|illustrations/
│   │   └── runmile/logos|avatar|illust|state/   (이미지 가이드 5분류: logo/avatar/state/banner/illust)
│   └── shared/sns-logos/
├── project-logo-manifest.ts   ← PROJECT_LOGOS, getProjectLogo, 강타입
├── project-logo-defaults.ts   ← base64 data URI (html/react 의 1:1 복제 통합)
├── nudge-eap-image-metadata.ts ← NudgeEAP 화면 이미지 alias
├── nudge-img-metadata.ts    ← deprecated compatibility alias source
└── index.ts
```

## 배포 — 코드/벡터는 npm, 래스터는 S3

이 패키지의 npm tgz 에는 **코드·타입·메타데이터·매니페스트 + 벡터 로고(SVG)** 만 담는다.
무거운 **래스터(PNG/JPG/WEBP, ~6.7MB)는 tgz 에 넣지 않는다** — `@nudge-design/react` 가 이
패키지를 의존하므로, 래스터를 번들하면 모든 react 소비자가 6.7MB 를 transitive 로 끌어온다.
(`package.json` `files` 가 `dist/files/**/*.svg` 만 허용 — 래스터는 제외.)

대신 래스터는 **S3/CDN 에서 버전별로 전달**한다:

- 빌드(`pnpm build`)는 여전히 `dist/files/**` 전체(래스터 포함)를 생성한다 — **S3 업로드 소스**이자
  로컬 목업 툴링(`build_singlefile_html` on-demand base64 인라이너)·desktop mcpb 번들 동봉본.
  (즉 디스크엔 그대로 있고 npm tgz 에만 빠진다.)
- `scripts/publish-assets-s3.mjs` 가 `dist/files` 를 `…/nds-assets/assets/{version}/files` 로 sync.
- 외부 호스팅 앱은 `remote-url` 헬퍼로 URL 을 조립한다:

  ```ts
  import { assetVersionBaseUrl, joinAssetUrl } from "@nudge-design/assets/remote-url";
  import { getNudgeImg } from "@nudge-design/assets/nudge-eap-images";

  const base = assetVersionBaseUrl("0.0.1"); // https://…/nds-assets/assets/0.0.1/files
  const medal = getNudgeImg("rank", "rank-01");
  <img src={joinAssetUrl(base, medal.filename)} alt="1위" />;
  ```

- 로고는 별개로 zero-config: `getProjectLogo(...).dataUri`(base64) 가 tgz 에 내장되고, SNS 로고 등
  **SVG 는 tgz 에 포함**돼 `@nudge-design/assets/files/shared/sns-logos/...` 경로도 동작한다.
  (래스터 경로만 tgz 에서 빠져 S3 가 필요하다.)

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
// → { category: "rank", id: "rank-01", filename: "project/nudge-eap/images/rank/rank-01.png", ... }
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
