---
"@nudge-design/mcp": minor
---

목업 품질 점수화 — validate 결과에 차원별 0~100 `scores` 추가 (Eval D1).

- `validate_html_mockup` / `build_singlefile_html`(validation) 응답에 `scores: { overall, dimensions }` 블록 추가. 위반 0/건수만이 아니라 **color / typography / spacing / layout / component / icon** 6개 차원의 0~100 점수와 overall(평균)을 함께 산출.
- 결정적 환산: 기존 위반(`violationsByRule`)을 rule→차원 매핑 후 severity 가중(error −20 / warn −8 / info −3, 0 클램프)으로 점수화. 추가 모델 호출 0 · 순수함수(`computeScores`).
- Kraft 의 코드기반 scorer(color-tokens/typography/layout/spacing/component-compliance/icon-usage)를 미러(animation 제외). 이후 self-correction 루프가 '위반 잔존' 대신 '점수<임계'로 트리거하도록 확장하는 토대.
- 매핑 안 된 rule 은 점수에 반영하지 않음(보수적). validate 실행 실패 시 중립 만점(`NEUTRAL_SCORES`) 폴백.
