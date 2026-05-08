# Trost × NudgeEAP Design System 연동 가이드

NudgeEAP Design System을 Trost 서비스(https://trost.co.kr)에서도 사용하기 위한 통합 가이드.

## 1. 토큰 사용

### CSS

Trost 브랜드 토큰을 CSS 커스텀 프로퍼티로 사용하려면 기본 토큰 뒤에 override CSS를 import한다.

```css
@import "@nudge-eap/tokens/css";
@import "@nudge-eap/tokens/css/trost";
```

### TypeScript / React

```ts
import {
  trostTheme,
  trostYellow,
  trostCobalt,
  trostPink,
  trostNeutral,
  trostStatus,
  trostEapBanner,
  trostSemantic,
} from "@nudge-eap/tokens";
```

### 추가된 Trost 전용 토큰

| 토큰                           | 값                        | 용도                                    |
| ------------------------------ | ------------------------- | --------------------------------------- |
| `trostYellow.border`           | `#FFD92E`                 | SearchForm 노란 테두리                  |
| `trostStatus.orange`           | `#FF9D00`                 | 링크/서브탭 활성, 강조 텍스트           |
| `trostEapBanner.bg`            | `#D5EAFB`                 | 상단 EAP 유도 배너 배경                 |
| `trostEapBanner.ctaBg`         | `#EAF5FD`                 | EAP 배너 CTA 버튼 배경                  |
| `trostEapBanner.accent`        | `#008DFF`                 | "넛지EAP" 강조 텍스트                   |
| `trostSemantic.primary.fg`     | `#000000`                 | 노란 primary 배경 위 텍스트             |
| `trostSemantic.primary.border` | `#FFD92E`                 | primary 테두리                          |
| `trostSemantic.link.active`    | `#FF9D00`                 | 활성 링크                               |
| `trostSemantic.bg.overlay`     | `rgba(0,0,0,0.7)`         | Trost 모달 딤(70%, NudgeEAP 50%와 다름) |
| `elevation.shadow.hairline`    | `inset 0 0 0 1px #E5E5E5` | Trost 고유 hairline inset 보더          |
| `spacing.radius.xl`            | `20`                      | Trost pill 칩                           |

### NudgeEAP 대비 차이 요약

| 항목                 | NudgeEAP                | Trost                                                |
| -------------------- | ----------------------- | ---------------------------------------------------- |
| Primary              | Blue `#2B96ED`, 흰 글씨 | Yellow `#FFF42E`, 검정 글씨                          |
| Radius `sm`          | 4                       | 6                                                    |
| Overlay              | `rgba(0,0,0,0.5)`       | `rgba(0,0,0,0.7)`                                    |
| Font family          | Pretendard 계열         | system-ui (`-apple-system, BlinkMacSystemFont, ...`) |
| Typography headline1 | 36/48                   | 26/38                                                |

## 2. 공통 컴포넌트 (Trost에서 재사용 가능)

NudgeEAP에서 이미 구현되어 있고 Trost 테마 토큰을 통해 스타일이 자동 교체되는 컴포넌트.

| 컴포넌트         | Trost 용도 예시                      |
| ---------------- | ------------------------------------ |
| `Button`         | 상담 시작 CTA, 약관 동의             |
| `Badge`          | "NEW", "추천" 뱃지                   |
| `Chip`           | 필터 칩 (`radius.xl` 활용 pill 형태) |
| `Card`           | 상담사/콘텐츠 카드                   |
| `Input`          | 범용 텍스트 입력                     |
| `SearchInput`    | 범용 검색 (헤더 외)                  |
| `Select`         | 필터/드롭다운                        |
| `Checkbox`       | 약관 동의, 필터                      |
| `Tabs`           | 콘텐츠 탭                            |
| `Modal`          | 확인/알림 모달                       |
| `Popup`          | 안내 팝업                            |
| `BottomSheet`    | 모바일 시트                          |
| `Toast`          | 알림                                 |
| `EmptyState`     | 빈 리스트 상태                       |
| `FieldActionRow` | 설정 항목 행                         |

## 3. Trost 전용 컴포넌트 (새로 추가)

위치: `@nudge-eap/react`의 `Trost` 네임스페이스.

```ts
import { Trost } from "@nudge-eap/react";
```

### 데스크탑 헤더 관련

| 컴포넌트                       | 설명                                                 |
| ------------------------------ | ---------------------------------------------------- |
| `Trost.TrostDesktopHeader`     | 전체 헤더 sticky 레이아웃 (banner/utility/tabs 슬롯) |
| `Trost.TrostEAPBanner`         | 상단 NudgeEAP 유도 배너 (#D5EAFB)                    |
| `Trost.TrostUtilityHeader`     | 로고 + 검색 + 로그인 + 앱 다운로드 레이아웃          |
| `Trost.TrostSearchForm`        | 노란 테두리 검색 폼                                  |
| `Trost.TrostLoginSection`      | 비로그인/로그인 상태별 UI                            |
| `Trost.TrostAppDownloadButton` | 호버 시 QR 툴팁 노출                                 |
| `Trost.TrostTabNavigation`     | 6개 메인 탭 + 서브탭 드롭다운                        |

### 데스크탑 푸터

| 컴포넌트                   | 설명                                       |
| -------------------------- | ------------------------------------------ |
| `Trost.TrostDesktopFooter` | 약관/앱 다운로드/사업자 정보/SNS 링크 포함 |

### 타입

```ts
Trost.TrostTabItem;
Trost.TrostSubTabItem;
Trost.TrostUser;
Trost.TrostPopularKeyword;
Trost.TrostSnsLink;
```

## 4. 사용 예시

```tsx
import { Trost } from "@nudge-eap/react";

const tabs: Trost.TrostTabItem[] = [
  { tabName: "홈", tabUrl: "/" },
  { tabName: "커뮤니티", tabUrl: "/community", isNew: true },
  {
    tabName: "전문 심리상담",
    tabUrl: "/service/search/partner/",
    subTab: [
      { subTabName: "상담사 찾기", subTabUrl: "/service/search/partner/" },
      { subTabName: "상담센터 찾기", subTabUrl: "/service/offline/" },
      { subTabName: "상담하기", subTabUrl: "/service/counseling/" },
    ],
  },
  // ...
];

export function AppShell() {
  return (
    <>
      <Trost.TrostDesktopHeader
        banner={
          <Trost.TrostEAPBanner
            buildingIconSrc="/images/header/img-banner-eap-building.svg"
            eapLogoSrc="/images/header/img-logo-eap-black.svg"
            chevronIconSrc="/images/header/ic-chevron-right-black.svg"
          />
        }
        utility={
          <Trost.TrostUtilityHeader
            logoSrc="/images/header/trost-logo-black.svg"
            searchSlot={
              <Trost.TrostSearchForm
                onSearch={(kw) => (window.location.href = `/search/result?keyword=${kw}`)}
                searchIconSrc="/images/header/ic_search_black.svg"
              />
            }
            loginSlot={
              <Trost.TrostLoginSection
                user={null /* or { name: '홍길동' } */}
                onLoginClick={() => (window.location.href = "/login")}
                onPartnerSignupClick={() => (window.location.href = "/auth/partner")}
                logoutHref="/auth/sign_out.php"
              />
            }
            appDownloadSlot={
              <Trost.TrostAppDownloadButton
                qrImageSrc="/images/header/trost-download-qr.webp"
                tooltipBgSrc="/images/header/img-tooltip-download-app.svg"
              />
            }
          />
        }
        tabs={
          <Trost.TrostTabNavigation
            tabs={tabs}
            currentPath={location.pathname}
            newBadgeIconSrc="/images/header/img-badge-n-red.svg"
            /* rightSlot: 인기 검색어 슬라이더 등 자유롭게 주입 */
          />
        }
      />

      {/* ... 페이지 콘텐츠 ... */}

      <Trost.TrostDesktopFooter />
    </>
  );
}
```

## 5. 아직 이식되지 않은 (Trost에만 있는) 컴포넌트

다음은 Trost 레포지토리에만 있으며, 공통화 필요 시 추가 작업 대상:

- **Header 계열(모바일)** — `MobileWebHeader.astro`, `MobileMenuDrawer.tsx`, `TrostAppHeader.astro`, `TrostAlertNotification.tsx`
- **Footer 계열(모바일)** — `AppMobileWebFooter.astro`, `TrostAppFooter.astro`
- **Header 서브** — `PopularSearchKeywordSlider.tsx` (Swiper 의존 → 별도 래핑 필요)
- **콘텐츠 전용** — `bible`, `quotes`, `quotes-bible`, `partner`, `player`, `service/*` 등은 서비스 로직 결합이 커서 1차 이식 대상 제외

## 6. 이식 시 주의사항

1. **SpriteIcon 의존 제거** — Trost는 `public/trost-sprites/sprite.svg` 스프라이트를 `<use>`로 참조. DS는 그 시스템이 없으므로 아이콘은 `img`/`svg`로 받는다. 실서비스 통합 시 SpriteIcon 유틸을 어댑터로 감싸서 주입 권장.
2. **Astro → React** — Trost의 Astro 컴포넌트(`.astro`)는 서버 렌더링 컴포넌트이므로 React 컴포넌트로 변환 시 `client:media`, `Astro.locals` 등의 기능은 호스트 앱 레벨에서 처리.
3. **환경 변수/URL** — `processEnvTrostHomepageWebHost` 등은 호스트 앱 props로 주입.
4. **Swiper** — `PopularSearchKeywordSlider`는 swiper 의존성이 있어 별도 패키지화 또는 호스트 구현 유지가 낫다. `TrostTabNavigation`의 `rightSlot` props로 주입.
