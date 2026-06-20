---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-18463
---

## summary

토큰(태그) 자유 입력 + 삭제 가능한 칩. **기본 variant="stacked"** — 입력칸 + 우측 추가 버튼(입력 있을 때만 활성)에 칩은 **아래** wrap (이메일 초대/수신자 패턴). **variant="inline"** 은 칩이 입력칸 안쪽 tokenfield(해시태그식). Enter/쉼표/추가버튼으로 추가, Backspace로 마지막 삭제. 이메일 등은 `pattern`(정규식) 으로 검증 — 실패 시 추가 안 되고 `nds-tag-invalid` 이벤트.

## pitfalls

- 이메일/수신자 초대 = 기본 stacked + `pattern` 으로 형식 검증 + `max-tags`. 검증 없으면 잘못된 값이 칩으로 박힘.
- 해시태그는 `variant="inline" prefix="#"` — value/저장값엔 `#` 넣지 말 것(prefix 가 표시 시 자동 부착, 입력 시 자동 제거). prefix 기본은 ""(없음).
- 정해진 옵션에서 다중 선택은 SelectionCard mode='multiple' 또는 Chip 토글이 적합. 자동완성은 Autocomplete.
- 초대 모달 푸터(취소/초대하기) 와 제목은 TagInput 바깥에서 조립 — TagInput 은 입력+칩 영역만 담당.
- 캐포비(cashwalk-biz) stacked 태그는 SelectedItemRow 와 동일 트리트먼트(Figma 3001:18463): gray/200(#eee) fill · radius 10 라운드 사각 · 삭제 = 원형 serchdelete 아이콘. data-project cascade 가 자동 적용하니 칩 색/모양을 손으로 덮어쓰지 말 것.

## recommended

- 멤버 초대: stacked + pattern(email) + maxTags=50 + helperText 로 제한 안내
- 관심사/해시태그: variant=inline + prefix=# + maxTags
- 콘텐츠 태그: allowDuplicates=false (기본)

## examplesHtml.do

```html
<!-- 기본 stacked: 입력칸 + 추가버튼, 칩은 아래 wrap (이메일 초대/수신자) -->
<nds-tag-input label="멤버 초대하기" placeholder="이메일 주소를 입력해 주세요"
  pattern="^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" max-tags="50"
  helper-text="멤버는 최대 50명까지, 한번에 최대 10명까지 초대할 수 있습니다."></nds-tag-input>
<script>
  el.addEventListener("nds-tag-change", e => save(e.detail.value));
  el.addEventListener("nds-tag-invalid", e => toast(`이메일 형식이 아니에요: ${e.detail.value}`));
</script>
<!-- 해시태그식 인라인 tokenfield -->
<nds-tag-input variant="inline" prefix="#" label="관심 주제"
  placeholder="태그 입력 후 Enter" max-tags="5"></nds-tag-input>
```

## examplesHtml.dont

```html
<!-- 이메일 받으면서 pattern 검증 없음 — 잘못된 주소가 그대로 칩이 됨 -->
<nds-tag-input label="멤버 초대"></nds-tag-input>
<!-- 해시태그인데 value 에 직접 # 넣음 — prefix 가 표시 담당, 저장값엔 # 빼기 -->
<nds-tag-input variant="inline" value='["#수면"]'></nds-tag-input>
```
