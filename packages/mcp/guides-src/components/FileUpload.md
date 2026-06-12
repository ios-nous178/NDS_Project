---
{}
---

## summary

Drag&drop + 클릭 업로드. multiple/accept/maxSize 지원. 제어 컴포넌트.

## pitfalls

- value가 File[] 제어 컴포넌트 — 내부 상태 안 가짐. 부모에서 useState로 관리.
- onValueChange는 "성공" 파일만, onReject는 거부된 파일 — 둘이 분리되어 있음. 같이 다루지 말 것.
- maxSize는 bytes 단위 (10MB = 10 * 1024 * 1024). MB로 착각하지 말 것.
- accept는 브라우저 힌트일 뿐이라 실제로는 다른 파일도 들어올 수 있음 — 서버에서 한 번 더 검증 필요.
- multiple=false에서 두 번째 파일을 드롭하면 첫 번째를 덮어씀(slice(0, 1)). 추가 누적 X.

## recommended

- 프로필 이미지: accept="image/*", maxSize=5MB, multiple=false
- 진단서 첨부: accept=".pdf,.jpg,.png", maxSize=10MB, multiple
- errorMessage prop으로 거부 사유 지속 표시 (Toast 한 번 띄우는 것보다 명확)

## examplesHtml.do

```html
<nds-file-upload accept=".pdf,.jpg,.png" max-size="5242880"
  description="PDF, JPG, PNG · 5MB 이하"></nds-file-upload>
<script>
el.addEventListener("files-change", e => upload(e.detail.files));
el.addEventListener("files-reject", e => el.setAttribute("error-message", e.detail.reason));
</script>
```

## examplesHtml.dont

```html
<!-- max-size 를 MB 단위로 입력 — bytes 가 정답 (5242880 = 5MB) -->
<nds-file-upload max-size="5"></nds-file-upload>
```
