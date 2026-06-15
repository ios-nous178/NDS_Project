---
referenceInputs:
  accepted:
    - Figma design URL 또는 figmaNodeUrl
    - 정답 스크린샷 이미지
    - 오답 스크린샷 이미지
    - 프롬프트에 첨부된 이미지/링크
  minimum: 최소 정답 1장 + 오답 1장. 가능하면 총 6-10장.
  format: "[good|bad] source=<figma-url|image-name> caption=<1-line reason>"
  fallbackQuestion: "두 가지만 먼저 확인할게요. ① 시각 기준 — Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료로 진행해도 될지, 정답/오답 레퍼런스가 있으면 함께(정답 1-2장·피해야 할 오답 1-2장 + 각 1줄 캡션) 알려 주세요. ② 화면 영역 — 이 화면이 (a) 외부 제공 B2B 어드민[Nudge DS], (b) 사내 백오피스·운영툴/CMS[antd v5], (c) 일반 서비스(앱/웹)[Nudge DS] 중 무엇인가요? 캐포비처럼 어드민·서비스가 함께 있는 브랜드면 어느 쪽인지, 어드민이면 페이지패턴 5종(onboarding/dashboard/list/detail/form) 중 어디에 가까운지도 알려 주세요."
examples:
  - verdict: good
    source: Figma node or approved screenshot
    caption: Neutral surface와 텍스트 위계로 정보 우선순위가 분리되고 primary CTA가 1개만 남아 있음.
  - verdict: bad
    source: Rejected AI mockup screenshot
    caption: 한 화면에 primary CTA, blue tint card, chip, icon 강조가 동시에 많아 모든 영역이 강조처럼 보임.
metrics:
  recommendedReferenceCount: 6-10
  minGoodReferences: 1
  minBadReferences: 1
  recommendedGoodReferences: 1-2
  recommendedBadReferences: 1-2
  captionLength: 1 line
  preferFigmaNodeUrl: "true"
---

## summary

목업 생성 전에 정답/오답 시각 레퍼런스를 수집하고, 1줄 캡션으로 톤 판단 기준을 고정하는 패턴.

## rules

- 목업 작성 전에는 프롬프트에 이미지, 스크린샷, Figma 링크, figmaNodeUrl 이 이미 있어도 항상 사용자에게 시각 레퍼런스 확인 질문을 한다.
- 단, 같은 목업 작업에서 이미 질문했고 사용자가 답했거나, references.md 의 첫 줄 `task:` 슬러그가 현재 task 와 일치하면 다시 묻지 말고 읽어서 적용한다. 이전 task 의 stale references.md (예: cashwalk-biz-form 작업물이 남은 상태에서 geniet-diary 시작) 는 없는 것으로 간주.
- references.md 첫 줄은 `task: <brand>-<screen-slug>` 형식 필수 (예: `task: geniet-diary-hub`). 이게 staleness 판정 기준.
- 새 목업 요청에서 파일 생성/수정 전 현재 워크스페이스를 얕게 보고, 같은 PRD/같은 화면으로 보이는 작업폴더가 명백히 있으면 반드시 `동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?` 라고 묻고 답변 전 기존 폴더를 수정하지 않는다. 억지로 찾지 말 것(깊은 재귀/전체 디스크/유사도 검색 금지).
- 사용자 응답으로 기존 첨부/링크를 기준으로 진행해도 되는지, 추가 정답/오답 레퍼런스가 있는지 확인한다.
- 권장 세트는 정답 1-2장 + 오답 1-2장. 각 레퍼런스는 '왜 맞는지/틀린지' 1줄 캡션을 붙인다.
- `source` 로 허용되는 것은 Figma URL (`figma.com/...`) 또는 이미지 파일 (`.png/.jpg/.jpeg/.webp/.gif/.svg`) 뿐. PRD/spec/요구사항 `.md` 는 source 가 아니다 (텍스트 문서는 spec 이지 visual reference 가 아님).
- 레퍼런스를 받은 뒤에는 brandTone 문장보다 레퍼런스 캡션을 우선한다.
- 구현 전 references.md 를 읽고 good 기준은 레이아웃/간격/타이포/컬러 의사결정으로 매핑하고, bad 기준은 명시적 회피 규칙으로 적는다.
- 완료 보고에는 어떤 reference cue 를 실제 화면에 반영했는지 2-4개로 요약하고, 최종 산출물의 full 절대경로를 반드시 포함한다.

## avoid

- 레퍼런스 없이 '차분한/전문적인/친근한' 같은 형용사만 보고 화면 생성
- 정답 이미지만 받고 오답 기준 없이 작업
- 이미지의 색감만 따라 하고 정보 밀도, 강조 장치 수, CTA 위계를 무시
- references.md 를 저장만 하고 구현 계획/완료 보고에서 반영 근거를 설명하지 않음
- [stale-references-md] 이전 task 의 references.md 가 남아 있는데 'task: 슬러그' 비교 없이 '이미 답변 받음' 으로 통과시킴 — 반드시 슬러그 매칭
- [prd-as-visual] PRD 에 ASCII 레이아웃·컬러 스펙이 있다고 'visual reference 로 간주' — 텍스트 ≠ 시각자료, Figma 또는 이미지 필요
- [decisive-tone-bypass] 사용자 어조 ('바로 만들어줘' / 'PRD 지켜서') 가 단호하다고 게이트 skip — 어조는 우회 사유가 아님
- [soft-prompt-misread] 가이드의 'soft prompt' 표현을 'optional 권고' 로 약화 해석 — 이 게이트는 REQUIRED
- [checklist-omission] 메모리/체크리스트의 후반 단계만 따라가다 이 게이트를 'principles 응답에 끼어있는 부차 advisory' 로 격하
- [same-folder-overwrite] 같은 기획으로 보이는 기존 작업폴더가 명백히 보였는데도 v2 생성 여부를 묻지 않고 기존 폴더를 수정
- [relative-path-only] 완료 응답을 `dist/index.html` 같은 상대경로만으로 끝냄 — full 절대경로 필수
