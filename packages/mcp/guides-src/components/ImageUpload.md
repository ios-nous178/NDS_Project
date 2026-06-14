---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3078-617
sizeMatrix:
  previewBox: 150 × 150 · border-radius md(8) · object-cover
  uploadButton: 135 × 44 · fill.neutralSubtle bg · text.normal · radius md(8) · body2 Medium
  helperRow: caption1 Regular · text.subtle (error 상태에서 text.statusError + 14px ic/error)
  sizeHint: caption1 Regular · text.subtle
  gapPreviewCol: 8px (spacing[8]) — preview ↔ helper
  gapRightCol: 12px (spacing[12]) — uploadButton ↔ sizeHint
  gapBetweenCols: 24px (spacing[24]) — preview col ↔ right col
stateMatrix:
  empty: dashed border.normal + surface.subtle bg + 'No Image' (text.muted body3)
  uploaded: solid border.normal + 이미지 cover + 우상단 X 버튼(InputdeleteIcon, fill.statusError circle)
  error: dashed fill.statusError + surface.statusError bg + 'No Image' text.statusError + helper 아이콘(ic/error 14px) + errorText
usagePolicy:
  useFor:
    - 캐시워크 포 비즈니스 admin 의 콘텐츠/상품/배너 등록 폼 단일 이미지 슬롯
    - "권장 사이즈 명시가 필요한 업로드 영역 (예: 200×200, 4:3)"
    - user-app 에서도 호환 — 시멘틱 토큰 cascade 로 자동 브랜드 톤
  doNotUseFor:
    - 다중 이미지 (gallery / carousel) — 별도 multi-uploader 컴포넌트
    - 사용자 아바타 업로드 — Avatar + 별도 modal 패턴
    - 파일(비이미지) 업로드 — AttachmentItem / 별도 컴포넌트
  limits:
    previewSize: 150×150 (변경 비권장)
    uploadButtonSize: 135×44 (변경 비권장)
    states: 3
---

## summary

캐시워크 포 비즈니스 admin 의 단일 이미지 업로드 위젯. 150×150 preview + 우측 업로드 버튼(135×44) + 사이즈 안내 가로 레이아웃. state(empty/uploaded/error) 별 시각 분기.

## pitfalls

- `<input type="file">` 는 internal trigger — 외부에서 별도 file picker 를 마운트하거나 `onUploadClick` 안에서 직접 input.click() 호출 금지.
- Error 상태에서 박스 전체를 빨갛게 칠하지 말 것 — gauge: dashed `fill.statusError` border + soft `surface.statusError` bg. 단색 빨강은 가이드 위반.
- `state="uploaded"` 인데 `imageUrl` 을 안 넘기면 placeholder 가 그대로 노출. controlled 로 쓸 땐 항상 묶어서 관리(미리보기만 필요하면 `autoPreview`/`auto-preview` 로 자동화).
- **미리보기 자동화는 `autoPreview`(React) / `auto-preview`(HTML) opt-in** — 켜면 파일 선택 시 첫 이미지를 `URL.createObjectURL` 로 즉시 렌더하고 X 로 해제, revoke·언마운트 정리까지 내부 처리. 단순 미리보기에 `FileReader`/state 보일러플레이트를 손으로 짜지 말 것. **단, `imageUrl`(React)/`image-url`(HTML)을 직접 넘기는 controlled 사용이면 그 값이 우선**하고 자동 미리보기는 비활성 — 서버 업로드 후 CDN URL 을 보여주는 흐름은 여전히 controlled 로.
- 다중 업로드가 필요하면 이 컴포넌트를 N 개 늘어놓지 말고 별도 갤러리/멀티 업로더로 분기. `multiple` prop 은 OS picker 차원만 지원(미리보기는 단일 이미지 1장 — `autoPreview` 도 `files[0]` 만 렌더).
- 우상단 X 버튼은 `onRemove` 가 있어야만 노출 — uploaded 상태에서도 onRemove 없으면 안 보임. (예외: `autoPreview` 모드는 onRemove 없이도 내부 해제용 X 가 노출됨.)

## recommended

- 기본(controlled · 서버 URL): <ImageUpload state={state} imageUrl={url} onFileSelect={files => upload(files[0])} onRemove={() => reset()} />
- 미리보기만(uncontrolled): <ImageUpload autoPreview onFileSelect={files => upload(files[0])} /> — state/imageUrl 없이 선택 즉시 미리보기. HTML 은 <nds-image-upload auto-preview>.
- 권장 사이즈 안내가 다르면 `sizeHint="4:3 / 1024×768 권장"` 같이 명시.
- Error 메시지를 도메인별 카피로: `errorText="이미지를 등록해 주세요."`.

## accessibility

- 우상단 X 버튼: `aria-label="이미지 제거"` 자동 부착.
- Error 상태 helper 의 14px InfoIcon 은 장식 — text 가 의미를 그대로 전달.
- file picker 트리거는 standard `<input type="file">` — 키보드 접근(Enter/Space) 자동 지원.

## examplesHtml.do

```html
<!-- 미리보기만 빠르게: auto-preview 면 선택 즉시 컴포넌트가 objectURL 로 렌더 -->
<nds-image-upload auto-preview accept="image/*"
  upload-label="사진 추가" size-hint="JPG/PNG · 최대 5MB"></nds-image-upload>
<script>el.addEventListener("file-select", e => upload(e.detail.files));</script>
<!-- 서버 URL 로 controlled: state/image-url 을 직접 관리 -->
<nds-image-upload state="uploaded" image-url="https://cdn/...png"></nds-image-upload>
```

## examplesHtml.dont

```html
<!-- ① auto-preview 없이 state 를 그대로 두면 upload 끝나도 미리보기 안 뜸 -->
<nds-image-upload state="empty"></nds-image-upload>  <!-- file-select 만 듣고 image-url/state 미갱신 → 영영 empty -->

<!-- ② 사진 첨부를 버튼+숨김 input 으로 직접 조립 — 미리보기/사이즈안내/상태를 다시 짜야 한다.
     → nds-image-upload(auto-preview) 한 줄로 끝. 직접 만들지 말 것 -->
<button onclick="document.querySelector('#file').click()">사진 첨부</button>
<input id="file" type="file" hidden>
```
