---
metrics:
  file: design-spec.json
  decisionLog: designDecisions.jsonl
  blocksCode: false
  semanticTokensOnly: true
examples:
  - verdict: good
    source: '{ "screen": { "brand": "geniet", "surface": "app", "intent": "리뷰 상세 — 평점·본문·도움돼요" }, "tree": [ { "component": "Card", "role": "리뷰 본문", "tokens": ["--semantic-bg-default","--semantic-text-default"], "children": [ { "component": "Button", "role": "primary CTA", "props": { "color": "primary" }, "rationale": "Geniet primary CTA = brand mint/600 (#00A8AC)" } ] } ], "decisions": ["primary CTA 1개만", "raw hex 없음 — 전부 --semantic-*"] }'
    caption: 의도·컴포넌트·시멘틱 토큰 이름·근거만. 좌표/색값/px 없음. component 는 DS 이름 또는 nds-tag.
  - verdict: bad
    source: '{ "tree": [ { "component": "Button", "props": { "background": "#1A1A1A" }, "x": 24, "y": 600 } ] }'
    caption: 좌표(x/y)·raw hex 를 스펙에 넣으면 scene.json 열화판이 된다. screen(brand/surface/intent)·근거 누락. → raw-hex-prop error.
---

## summary

prompt → **DesignSpec(JSON)** → code 의 경량 중간표현. 복잡/다단계 화면이거나 사용자와 구성 합의가 필요할 때, HTML 작성 전에 save_design_spec 으로 의도 스펙을 만들고 ok:true + 사용자 동의 후 build_singlefile_html 로 진행(soft 승인 게이트). 추적성·정밀편집·코드前 검증을 얻는다.

## rules

- 언제 쓰나: 다화면/복잡 플로우, 컴포넌트 선택이 모호, 또는 사용자가 화면 구성에 합의하고 싶을 때. 단순 단일 화면이면 생략하고 바로 HTML 로 가도 된다(과한 절차 강제 금지).
- ⛔ 예외 — 캐포비(cashwalk-biz) 어드민 화면은 복잡도와 무관하게 save_design_spec 필수(생략 금지): validate 가 5종 Page Pattern(screen.surfaceKind:'admin' + screen.pagePattern, Onboarding/Dashboard/List/Detail/Form) 선언을 hard error 로 강제하므로, spec 을 건너뛰면 화면-분류 게이트도 통째로 건너뛰어 어드민 일관성이 깨진다. 코드 전에 먼저 분류: get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }).
- 스펙은 '의도'만 담는다: 컴포넌트 트리(시멘틱 이름), 참조할 시멘틱 토큰 '이름', brand/surface, 그리고 결정 근거(rationale). 좌표·resolved 색·px·이미지 바이트는 담지 않는다 — 그건 코드→Figma scene.json(역방향 추출) 담당이다.
- 토큰은 시멘틱 only: tokens[] 에는 '--semantic-*' 같은 토큰 이름만. raw hex/rgb 금지(raw-hex-token error). raw 팔레트(--color-blue-500 등)는 warn — --semantic-* 우선.
- save_design_spec 은 카탈로그 기준으로 자동 검증한다(브랜드 실재·토큰 존재·prop enum·컴포넌트 존재). ok:false 면 violations 를 고쳐 재저장한 뒤, ok:true 가 되어야 빌드로 넘어간다(validate-before-code).
- 저장한 스펙을 사용자에게 한 번 보여주고 동의를 받은 뒤 build_singlefile_html 로 HTML 을 만든다(soft gate). 스펙과 다른 화면을 임의로 만들지 않는다.
- component 는 PascalCase('Button') 또는 nds-tag('nds-button') 둘 다 허용 — scene.ts(코드→Figma)의 ndsTagToComponentName 어휘를 공유하므로, 정방향 스펙과 역방향 scene 을 컴포넌트 정체성으로 JOIN 할 수 있다.
- ui-direction-proposal 로 방향이 정해졌으면 그 방향을 DesignSpec 으로 구체화한다(두 패턴은 상호 보완 — 방향 합의 → 스펙 고정 → 빌드).
- 시각 레퍼런스 게이트가 더 우선이다. references.md(Figma/스크린샷)가 없으면 스펙은 만들 수 있어도 build 는 레퍼런스를 받은 뒤 진행한다.
- 결정 로그: save_design_spec 은 design-spec.json(매번 덮어씀) 옆에 decisions/rationale 을 designDecisions.jsonl 로 한 줄씩 누적한다(화면별 dedup, 최근 N행 상한). 결정 이력/메모리 소스이며, 소비 프로젝트에서는 gitignore 권장.

## avoid

- 단순 단일 화면에도 매번 스펙을 강제(과한 절차)
- 스펙에 좌표·resolved 색·px·이미지를 담기(그건 scene.json 몫)
- tokens 에 raw hex/rgb 또는 카탈로그에 없는 토큰 이름
- save_design_spec 이 ok:false 인데 그대로 build 로 진행
- 스펙만 만들고 사용자 동의 없이 빌드 / 스펙과 다른 HTML 작성
- 캐포비(cashwalk-biz) 어드민인데 save_design_spec 을 생략하고 바로 HTML — 5종 Page Pattern 분류 게이트를 우회하게 됨
