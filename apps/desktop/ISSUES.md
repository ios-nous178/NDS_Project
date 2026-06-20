# Desktop Harness — 테스트 이슈 트래킹

브랜치 `feat/desktop-harness` 수동 테스트 중 발견. 미해결 = `[ ]`.

---

## [x] 1+2. 라이브 미리보기/상단 드롭다운이 작업 중엔 안 뜨고 완료 후에야 갱신됨

**증상**: 9분짜리 작업 내내 미리보기·드롭다운이 안 바뀌다가 완료 후에야 한꺼번에 반영.

**근본 원인 (확정)**: **chokidar v4 는 glob 지원을 제거**했는데 `watcher.ts` 가
`watch(["**/*.html","**/*.htm"], { ignored: ["**/node_modules/**", …] })` 글롭을 그대로 씀.
→ v4 에선 글롭이 리터럴 경로로 해석돼 **아무것도 감시 안 함** (`getWatched()` = `{}`, 이벤트 0).
파일 와처가 통째로 죽어 있어서, 와처에 의존하는 라이브 추적(1)·`rescanMockups` 드롭다운 갱신(2)이
둘 다 발화 안 됨. (완료 후 보인 건 프로젝트 재오픈/수동 선택 등 다른 경로.)

**수정**: `src/main/watcher.ts` — 디렉토리(`projectPath`)를 직접 watch + `ignored` 를 함수로 전환
(.html/.htm 만 통과, node_modules/dist/out/.git/build 디렉토리 배제). v4 절대경로 → `relative()`
로 기존 relPath 계약 유지. (chokidar v4 동작 재현 + 수정안 모두 임시 스크립트로 검증.)

> 남은 한계: 에이전트가 HTML 을 **맨 끝에 한 번만 Write** 하면 그 시점에야 첫 미리보기가 뜬다
> (와처는 정상). 진짜 "작업 중 점진 표시"를 원하면 에이전트가 파일을 일찍 만들고 Edit 로
> 갱신하도록 프롬프트/지침 조정이 추가로 필요 — 코드 버그 아님.

---

## [x] 3. 하단 DS 스탬프 바의 "DS 버전" 이 안 읽힘 ("—")

**증상**: 스탬프 바는 뜨는데 DS 버전이 비어 폴백("—")으로 표시.

**근본 원인 (확정)**: `ds-version.ts` 의 `resolveBundledDsVersion()` 가
`require.resolve("@nudge-design/react/package.json")` 로 버전을 읽는데, `@nudge-design/react`
의 `exports` 맵은 `.` / `./inspector` / `./styles.css` 만 열고 **`./package.json` 서브패스를
노출 안 함** → 항상 `ERR_PACKAGE_PATH_NOT_EXPORTED` 로 throw → `null` → 폴더 감지도 비어 "—".

**수정**: `src/main/ds-version.ts` — exports 가 허용하는 엔트리(`.`)를 resolve 한 뒤
상위 디렉토리를 거슬러 올라가며 `name === "@nudge-design/react"` 인 package.json 의 version 을
읽도록 변경(exports 게이트 우회). DS 패키지 `exports` 를 안 건드려 외부 전파/changeset 영향 없음.
검증: 0.0.1 정상 resolve.

---

## [x] 4. 라이브 미리보기에서 `<nds-*>` 가 업그레이드 안 됨 (옵션 텍스트가 흩뿌려짐)

**증상**: Runmile 목업에서 `<nds-select>` 가 드롭다운으로 안 보이고 옵션("인기순"/"활동 많은 순")
텍스트가 페이지에 그대로 흩뿌려짐. nds 를 썼는데 깨져 보임.

**근본 원인 (확정)**: 작업 중 원본 `index.html` 에는 **DS runtime/CSS 가 없다**.
runtime/CSS 는 `build_singlefile_html`(export) 시점에만 inline(`buildHtmlSinglefileNoBundler`
→ `loadStandaloneAssets`). 그런데 라이브 미리보기(`mockup-protocol.ts`)는 원본을 거의 그대로
서빙(스탬프 바만 주입)하므로 `<nds-select>` 등 커스텀 엘리먼트가 **등록/업그레이드되지 않아**
자식 텍스트가 raw 로 노출됨. (setup 가이드도 "runtime/CSS 는 빌드가 자동 inline, `<script>` 불필요"
전제라 원본엔 의도적으로 런타임이 없음.)

**수정**:

- `packages/mockup-core/src/tools/standalone-assets.ts` — `injectStandaloneRuntime(html, project?)`
  추가. 미리보기 서빙 직전 in-memory 로 DS runtime/CSS 를 head/body 에 주입(원본 무변경·멱등,
  이미 인라인된 dist 는 `STANDALONE_MARKER` 로 감지해 skip). 프로젝트는 `data-project`/`body.project-*`
  자동 감지.
- `apps/desktop/src/main/mockup-protocol.ts` — HTML 서빙 시 `injectStandaloneRuntime(raw)` 후
  스탬프 주입. NDS% 카운트는 원본(raw) 기준 유지(주입본으로 세지 않음).

> 참고: 사용자가 쓴 `<nds-select value="latest">` 는 매칭되는 옵션 value 가 없어(popular/active)
> 트리거에 "latest" 가 그대로 뜬다 — 런타임 동작과 별개인 작성 값 문제. 초기값은 `value=""`(placeholder)
> 또는 실제 옵션 value 로.

---

### 적용 메모

- main 프로세스 수정이라 **앱 재빌드/재시작 필요** (`watcher.ts`, `ds-version.ts`).
- 타입체크 통과 (`tsc -p tsconfig.node.json`).
