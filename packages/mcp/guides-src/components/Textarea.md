---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903
---

## summary

여러 줄 자유 입력. 일기 / 후기 / 메모. 자체 max-length / min-height 가이드 있음.

## pitfalls

- raw <textarea> 직접 사용 — placeholder/스타일/포커스 ring 토큰 미적용.
- resize='none' + 짧은 min-height — 긴 본문 입력 시 답답함. min-height 120 이상 권장.
- max-length 만 두고 counter (FormField.counter) 안 보여줌 — 사용자는 글자 수를 모름.

## examplesHtml.do

```html
<nds-textarea label="오늘 기록" placeholder="자유롭게 입력해주세요" max-length="500" min-height="180" resize="vertical"></nds-textarea>
```

## examplesHtml.dont

```html
<!-- raw textarea — DS 스타일 적용 안 됨 -->
<textarea placeholder="…" maxlength="500"></textarea>
```
