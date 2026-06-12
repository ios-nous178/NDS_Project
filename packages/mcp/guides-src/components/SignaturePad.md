---
{}
---

## summary

전자 서명 캔버스. 동의서/가입 서명 추출. ref(SignaturePadHandle)로 clear/toDataURL/isEmpty.

## pitfalls

- onChange로 매 stroke 추출하면 큰 base64가 잦은 리렌더 — ref로 제출 시점에만 toDataURL() 호출 권장.
- 빈 캔버스의 toDataURL()은 null 반환. 서명 검증에 사용.
- 터치 디바이스에서 wrap의 touch-action: none 필수 (스크롤 방해 방지) — 컴포넌트 내장.

## recommended

- 동의서: ref + Button onClick에서 isEmpty() 체크 후 toDataURL 제출
- 읽기 전용 표시: disabled (이미 그려진 dataURL은 별도 <img>로 표시)

## examplesHtml.do

```html
<nds-signature-pad label="여기에 서명해주세요" height="200" pen-width="2"></nds-signature-pad>
<script>
// 제출 시:
const dataUrl = await document.querySelector("nds-signature-pad").toDataURL();
</script>
```

## examplesHtml.dont

```html
<!-- 짧은 동의 체크에 SignaturePad — 과한 UI. nds-checkbox 가 맞음 -->
<nds-signature-pad label="약관 동의"></nds-signature-pad>
```
