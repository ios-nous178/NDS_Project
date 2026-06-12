---
{}
---

## summary

이미 첨부된 파일을 보여주는 행 — FileUpload(업로드 영역)와 역할 분리. 진단서/처방전 등 EAP 의료 파일 표시.

## pitfalls

- FileUpload와 페어로 자주 사용 — FileUpload의 value(File[])를 매핑해서 AttachmentItem으로 노출하는 패턴.
- fileType 미지정 시 name 확장자에서 자동 추론 (pdf/image/video/audio/document/archive). 추론 실패는 'other'.
- status="uploading"이면 자동으로 다운로드 버튼 숨김 — progress 함께 사용.
- status="error" + errorMessage로 거부 사유 지속 노출. Toast보다 명확.
- href와 onDownload 둘 다 제공 가능 — href가 있으면 <a download>, 없으면 button.

## recommended

- 진단서 첨부: name + size + status="done" + href + onRemove
- 업로드 진행 중: status="uploading" + progress 폴링

## examplesHtml.do

```html
<nds-attachment-item name="report.pdf" size="2.4MB" file-type="pdf" status="done" href="/files/report.pdf"></nds-attachment-item>
<nds-attachment-item name="audio.m4a" status="uploading" progress="42"></nds-attachment-item>
```

## examplesHtml.dont

```html
<!-- status 없이 progress 만 — 업로드/완료/에러 어느 상태인지 모호 -->
<nds-attachment-item name="x.pdf" progress="42"></nds-attachment-item>
```
