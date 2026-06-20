# @nudge-design/tailwind-preset

## 0.0.4

### Patch Changes

- f91ad95: 패키지를 Node-로더블 ESM 으로 전환 (번들러 없이도 동작):
  - 전 패키지 `"type": "module"` + tsc `module: NodeNext` 전환, 소스 상대 임포트에 `.js` 확장자 명시 (NodeNext 가 컴파일 타임에 강제).
  - exports 맵에 `default` 조건 추가 — Node ≥22 `require(esm)` 으로 CJS 소비도 동작.
  - 효과: Next.js SSR/RSC 를 `transpilePackages` 없이 사용 가능, Node 스크립트·tsx·vitest(외부화 모드)에서 직접 import 가능. Vite 목업 플로우는 동작·번들 크기 변화 없음 (실측 245 KB 유지).
  - icons 생성기(`scripts/generate.cjs`)가 barrels 에 `.js` specifier 를 emit 하도록 갱신. dist 는 per-file 산출 유지 — catalog/project-completeness/MCPB 패킹 등 dist 레이아웃 의존 툴링 영향 없음.

- 82113f1: geniet·runmile Tailwind preset 신설 — 5 프로젝트 모두 preset 제공

  `genietPreset`·`runmilePreset` 를 추가해 trost·cashwalk-biz 와 동일하게 프로젝트 고유 토큰을
  Tailwind theme 로 매핑한다:
  - atomic palette alias — geniet: `mint`·`purple`·`geniet-neutral|gray|red|yellow|blue|green`,
    runmile: `orange`·`runmile-neutral|gray|red|blue`
  - 전용 radius (geniet 곡률 `xl=18`·`2xl=23`, runmile Toss 스타일 `4/6/8/12/16/pill`),
    typography(typeScale), shadow

  그동안 두 프로젝트는 시멘틱 CSS var(`bg-brand` 등)만 공유돼 색은 렌더됐지만 project atomic
  alias·전용 radius 가 빠져 있었다. 시멘틱 클래스는 종전대로 각 프로젝트 `.css` 가 같은 var 를
  redefine 하므로 자동 반영된다. (참고: `tailwind-preset` 은 fixed 그룹이라 react·tokens·styles·
  html 도 같은 버전으로 함께 올라간다.)

- 7405016: 트로스트 컬러·타이포 토큰을 새 Figma 가이드에 맞춰 정비했어요.
  - 본문/제목 글자색이 가이드 기준으로 한 단계 정돈됐고(강세 텍스트가 순검정 대신 진회색), 상태색(성공/오류/정보)과 노란 프로젝트 강조·테두리 톤이 가이드값으로 맞춰졌습니다.
  - 코발트(파랑) **포인트 컬러**가 정식 색 역할로 추가됐어요 — 배경/글자/아이콘/테두리/채움 어디서든 보조 강조색으로 쓸 수 있습니다.
  - 트로스트 타이포 일부 크기 보정(헤드라인4 20px, 라벨 11px).
  - Tailwind 프리셋: 트로스트 색 유틸리티가 풀 스케일로 바뀌었습니다(`trost-yellow-500` 등 숫자 단계, `trost-red/blue/green-*` 추가). 기존 `trost-yellow-primary`·`status-*` 클래스명은 사용하지 않습니다.

- e94bac4: 트로스트 간격·모서리·그림자 토큰을 새 Figma 가이드에 맞췄어요.
  - **간격(Spacing)**: 기본 요소 간격이 8px로, 섹션 단위 간격(40)·버튼/섹션 안쪽 여백이 가이드 기준으로 정리됐고, 칩 안쪽 여백이 6px로 조정됐습니다.
  - **모서리(Radius)**: 의미 기반 단계가 재정비됐습니다 — 카드/버튼 기본 8, 인풋·칩 6, 모달 16, 바텀시트 24. 라운드가 전반적으로 한 톤 정돈됩니다.
  - **테두리 두께**: Hairline/Default 1 · Strong(포커스) 1.5 · Bold(강조/오류) 2 스케일 추가.
  - **그림자(Elevation)**: 6단계(E0~E5)의 더 자연스러운 2겹 그림자로 교체 — 카드·모달·다이얼로그까지 깊이 단계가 세분화됐습니다.

- Updated dependencies [3e8ac4c]
- Updated dependencies [6cf1c11]
- Updated dependencies [001e5e8]
- Updated dependencies [41bdf61]
- Updated dependencies [665ca93]
- Updated dependencies [135c86a]
- Updated dependencies [942bf66]
- Updated dependencies [051a2b4]
- Updated dependencies [375be74]
- Updated dependencies [e23b5d1]
- Updated dependencies [37cdb34]
- Updated dependencies [3b73446]
- Updated dependencies [268ebe4]
- Updated dependencies [eab0abc]
- Updated dependencies [60db43c]
- Updated dependencies [f91ad95]
- Updated dependencies [bdfea38]
- Updated dependencies [31e9245]
- Updated dependencies [2b51ea7]
- Updated dependencies [46d4d87]
- Updated dependencies [2d6463a]
- Updated dependencies [c995f79]
- Updated dependencies [a5f7eda]
- Updated dependencies [27a44be]
- Updated dependencies [7405016]
- Updated dependencies [2effb30]
- Updated dependencies [e94bac4]
  - @nudge-design/tokens@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [a2ff1a0]
- Updated dependencies [e7a2978]
- Updated dependencies [7a04a69]
- Updated dependencies [67741ea]
- Updated dependencies [72d2018]
  - @nudge-design/tokens@0.0.3

## 0.0.2

### Patch Changes

- 0.0.2 락스텝 버전 정렬 — DS 4개 패키지를 같은 버전으로 유지 (icons·tailwind-preset 코드 변경 없음, 버전 동기화).
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [b887f41]
- Updated dependencies [501ff41]
- Updated dependencies [5973f82]
- Updated dependencies [501ff41]
- Updated dependencies [fe39b07]
  - @nudge-design/tokens@0.0.2

## 0.0.1

Initial release.
