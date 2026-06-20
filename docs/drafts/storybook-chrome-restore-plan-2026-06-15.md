# Storybook 업데이트 플랜 — chrome 정리 이후 프로젝트 chrome/사이드바 데모 복원 (2026-06-15)

> chrome 통합(Phase 1~4) 으로 **삭제된 스토리들의 대체 데모가 없어** Storybook 에 빈 자리가 생겼다.
> 프로젝트 chrome·사이드바를 **목업 전용 html 웹컴포넌트(`nds-project-*` / `nds-sidebar`)로** Storybook 에 다시 보이게 한다.
> (플랜만 — 실행 전 검토용. 워크트리 머지 정착 후 착수 권장.)

## 배경 / 왜 빈 자리가 생겼나

chrome 정리에서 **react 프로젝트 chrome·Sidebar 가 제거**되며 그걸 렌더하던 스토리도 같이 삭제됐다:

| 삭제된 스토리                     | 무엇을 보여주던 것           | 대체                                                                  |
| --------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `ProjectHeader.stories.tsx`         | 5프로젝트 헤더(react)          | ❌ 없음                                                               |
| `ProjectFooter.stories.tsx`         | 5프로젝트 푸터(react)          | ❌ 없음                                                               |
| `ProjectBottomNav.stories.tsx`      | 4프로젝트 바텀네비(react)      | ❌ 없음 (primitive `BottomNav.stories` 는 있음, 프로젝트 완성형은 없음) |
| `ProjectChrome.{5프로젝트}.mdx`       | 프로젝트별 chrome 개요         | ❌ 없음                                                               |
| `Sidebar.CashwalkBiz.stories.tsx` | 캐포비 admin 사이드바(react) | ❌ 없음 (← "여닫기 보고 싶다" 한 그것)                                |
| `PageHeader.stories.tsx`          | 페이지 헤더 컴포넌트         | 패턴으로 강등(`pattern:page-header`) — 데모 선택                      |

이 컴포넌트들은 이제 **목업 전용 html 웹컴포넌트**(`<nds-project-header|footer|bottom-nav project>`, `<nds-sidebar project>`)가 SSOT 다. 디자이너가 Storybook 에서 프로젝트 chrome 을 못 보는 게 "업데이트 안 된" 증상.

## 현황 실측 (조사 완료)

- **빌드는 안 깨진다** — storybook tsc exit 0, dangling import 0. `Header.mdx`/`Footer.mdx`/`BottomNav.mdx` 도 삭제 스토리 참조 없음. 즉 "에러"가 아니라 "데모 누락".
- **preview.ts 가 html 런타임을 등록하지 않는다** — tokens.css + `react/dist/styles.css` 만 import. `@nudge-design/html` 의존도 없음. → 지금 `<nds-project-header>` 를 스토리에 써도 **custom element 미등록이라 빈 박스**로 뜬다. **이게 핵심 인프라 공백.**
- **html-in-Storybook 선례 없음** — 기존 스토리는 전부 react. `nds-*` 는 prose 언급만.
- **storybook-catalog 게이트는 `Components/*` 타이틀만 inventory 와 대조** (`check-storybook-catalog.mjs:46`). `Projects/*` 타이틀 스토리는 **면제** → 프로젝트 chrome/사이드바 스토리는 inventory 재등록 불필요.
- 실행 중인 dev 서버(:6007)는 Phase 1 때 띄운 거라 **stale** 가능 — **재시작하면 삭제분이 반영**된다(우선 재시작해 진짜 현황 확인).
- ⚠ 동시 머지: `chrome-banner` 워크트리가 **EAPBanner → `nds-project-chrome` `banner` 영역 일반화**(`renderProjectBanner` + `nds-project-banner`)를 landing 중. 머지 후엔 **배너도 Storybook 데모 후보**가 된다 → 이 플랜은 머지 정착 후 착수.

## 결정 포인트 (착수 전 1개만 확정)

**프로젝트 chrome/사이드바를 Storybook 에 어떻게 둘까?**

- **A. html 웹컴포넌트로 복원 (권장 · 사용자 의도)** — `nds-project-*`/`nds-sidebar` 를 Storybook 에서 직접 렌더. 디자이너가 SSOT(목업이 실제 쓰는 것)를 그대로 본다. 인프라(런타임 등록) 필요.
- B. Storybook 에서 제외(목업 전용 유지) — 삭제가 정답, "업데이트"=개요 mdx 에 "목업엔진에서 확인" 안내만. 최소 작업이나 디자이너가 못 봄.

→ 사용자가 "보고 싶다"고 했으므로 **A** 전제로 아래 Phase 구성. (B 면 Phase A·B·C 생략하고 Phase E 문서 안내만.)

## Phase A — 인프라: Storybook 에서 html 웹컴포넌트 렌더 가능하게

1. `apps/storybook/package.json` 에 `@nudge-design/html: workspace:*` 추가 (+ `@nudge-design/assets` 도 project 로고 data URI 가 런타임 주입이면 이미 html 가 의존하니 확인).
2. `apps/storybook/.storybook/preview.ts` 에 **html 런타임 등록** 추가: `import "@nudge-design/html";` (모든 `nds-*` custom element 를 `customElements.define`). 프로젝트 chrome 스타일은 자기 render 가 inline `<style>` 주입 + `react/dist/styles.css`(=@nudge-design/styles, `.nds-*` 보유) + project-themes decorator 의 `data-project`/cssVars 로 커버 — **렌더 후 실측 확인**(특히 project CSS 토큰).
3. **`NdsTag` 렌더 헬퍼** 1개 신설 (`apps/storybook/src/stories/_ndsTag.tsx` 등):
   - `<NdsTag tag="nds-project-header" attrs={{ project, surface, "active-key": ... }} />` → `React.createElement(tag, ...)` + ref 로 attribute set. TS 의 JSX.IntrinsicElements 미정의 회피.
   - **JSON slot 지원**(사이드바 `items`/`account`/`footer-actions`): `<script type="application/json" slot="...">` 자식을 ref+innerHTML 로 주입(React 가 custom element 자식 script 를 직렬화 안 하므로 mount 후 주입). 캐포비 ready-made 트리 재사용.
   - mount-once + 재렌더 시 attr만 패치(컨트롤 변경 대응).

## Phase B — 프로젝트 chrome 스토리 (삭제분 대체)

타이틀은 모두 `Projects/*`(게이트 면제). project globals(`context.globals.project`) 또는 명시 per-project 스토리.

4. `ProjectHeader.stories.tsx` (`Projects/Header`) — `<nds-project-header project surface>` × `{web/mobile/webview}` × 5프로젝트. 옛 스토리 커버리지 미러(데스크톱/모바일/웹뷰).
5. `ProjectFooter.stories.tsx` (`Projects/Footer`) — `<nds-project-footer project surface={web|app}>`.
6. `ProjectBottomNav.stories.tsx` (`Projects/BottomNav`) — `<nds-project-bottom-nav project active-key>` (캐포비는 web 전용=없음 명시).
7. (선택) `ProjectChrome.mdx` 단일 개요 페이지 — 프로젝트별 header+footer+bottomnav 를 한 화면에(옛 5개 mdx 통합). `<Meta title="Projects/Chrome 개요">`.
8. (머지 후) `ProjectBanner` — 기존 `ProjectBanner.stories` 가 react `Banner` 라면, `nds-project-banner`(chrome-banner 머지분) 데모도 추가 검토.

## Phase C — 사이드바 스토리 (+ 여닫기 데모, 사용자 요청)

9. `Sidebar.stories.tsx` (`Projects/Sidebar` 또는 `Projects/Admin/Sidebar`) — `<nds-sidebar project="cashwalk-biz">` + `pattern:cashwalk-biz-admin-sidebar` ready-made(items/account/footer-actions JSON slot) 주입.
10. **여닫기 데모**: `show-toggle` 속성 + 헤더 토글 버튼 노출. 스토리에서 `collapsed` 토글 상태를 React state 로 들고 `toggle-collapse` 이벤트 → attr 갱신(또는 컨트롤). 서브메뉴(배너 children) expand/collapse 도 함께 보이게.
11. (선택) `play()` interaction test — 토글 클릭 → `data-collapsed` 전환 단언(여닫기 회귀 잠금).

## Phase D — PageHeader 패턴 데모 (선택 · 저우선)

12. `pattern:page-header` 조립 데모 — `Heading(level=h2 as=h1)` + Breadcrumb + actions + Tab 합성 1 스토리(`Patterns/Page Header` 또는 Heading.stories 내 변형). 컴포넌트 아니므로 MCP 가이드로 충분하면 생략 가능.

## Phase E — 정리 + 검증

13. 개요 mdx(`Header.mdx`/`Footer.mdx`/`BottomNav.mdx`) 에 "프로젝트 완성형은 `Projects/*`" 링크/안내 추가, 옛 react 프로젝트 chrome 언급 정리.
14. **`pnpm --filter storybook build`** — tsc 만이 아니라 **실제 빌드**로 mdx/스토리 렌더 에러 0 확인(지금까지 tsc 만 돌렸음).
15. `npx tsc --noEmit -p apps/storybook/tsconfig.json` · `node scripts/check-storybook-catalog.mjs`(Projects/\* 면제 확인) · dev 서버 재시작 후 **5프로젝트 × chrome + 사이드바 여닫기 육안 확인**.
16. (해당 시) Chromatic/visual-regression 스냅샷 갱신 — 프로젝트 chrome 이 react→html 로 바뀌어 baseline 재생성 필요할 수 있음.

## 리스크 / 주의

- **html-in-Storybook 은 이 레포 첫 패턴** — custom element 가 React 18 재조정과 충돌하지 않게 `NdsTag` 가 children/attr 를 mount 후 명령형으로 다룬다(특히 JSON slot script). 가장 큰 미지수.
- **스타일 로딩** — 프로젝트 chrome render 의 inline `<style>` + styles.css + project cssVars 가 Storybook iframe 에서 다 맞물리는지 실측 필수(토큰 누락 시 색 빠짐).
- **프로젝트 테마 decorator 와 project= 속성 이중지정** — 스토리의 `project` 속성과 전역 project globals 가 어긋나지 않게(개요 페이지에서 여러 프로젝트 동시 렌더 시 `data-project` 스코프).
- **착수 타이밍** — `chrome-banner`/`assets-tailwind` 워크트리 머지가 끝난 뒤. banner 일반화·NudgeEAPLogo 제거가 project 로고/배너 데모에 영향.
- **게이트** — `Projects/*` 면제 확인됨. 단 신규 react helper 파일은 eslint(rules-of-hooks 등) 통과 필요(BottomNav.stories 선례: hook 은 컴포넌트로 분리).

## 작업량 추정 (A안 기준)

- Phase A 인프라: 0.5일 (런타임 등록 + NdsTag 헬퍼 + 스타일 실측) — **불확실성 최대 구간**.
- Phase B 프로젝트 chrome 3스토리: 0.5일.
- Phase C 사이드바 + 여닫기: 0.5일.
- Phase D/E 패턴·정리·검증: 0.5일.
- 합계 ~2일, Phase A 가 막히면 변동.
