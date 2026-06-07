---
name: prd-extract
description: 기획서(Figma 디자인 URL/노드 또는 Export된 PNG/PDF 슬라이드)를 읽어 상세 PRD 마크다운으로 추출한다. 화면 순서를 SSOT로 삼아 개요·버전이력·화면흐름·정책·화면별 사양·Acceptance·SPEC OUT까지 정리하고, 중요 와이어프레임은 이미지로 함께 뽑는다. 트리거 — "이 기획서 PRD 뽑아줘", "Figma 읽고 PRD 만들어줘", "기획서 md로 추출", "/prd-extract <Figma URL 또는 PNG 폴더>", "$prd-extract <Figma URL 또는 PNG 폴더>". 단순 목업 작성·컴포넌트 생성은 이 스킬이 아니다.
---

# prd-extract — 기획서 → 상세 PRD(md)

> **Codex skill (생성됨).** SSOT 는 `.claude/skills/prd-extract/SKILL.md` — 직접 수정 금지, SSOT 수정 후 `pnpm sync:skills`. 명시 호출 `/skills` → `prd-extract` 또는 `$prd-extract <figma|png>`. Figma MCP 또는 Export된 PNG 입력.

기획서(Figma 또는 Export된 슬라이드 이미지)를 정독해 **상세 PRD 마크다운**을 만든다.
**화면(슬라이드) 순서가 SSOT** 다. 추측하지 말고 보이는 것만 옮기되, 흩어진 사양을 구조화한다.

## 입력 형태 판별

1. **Figma 디자인 URL/노드** (`figma.com/design/<fileKey>/...?node-id=<n-n>`) → §A
2. **Export된 PNG 폴더** (예: `~/Downloads/<기획서명>/Background+Shadow-*.png`) → §B
3. **PDF / 단일 이미지** → Read 도구로 페이지/이미지 직접 정독 후 §C 합성

URL과 폴더 중 무엇이 주어졌는지 먼저 확인하고, 없으면 사용자에게 묻는다.

---

## §A. Figma 경로

> ⚠️ **Figma MCP 호출 한도 주의.** 이 계정은 Starter 플랜으로 **월 6회** read 호출 제한이 있다(`get_metadata`/`get_screenshot`/`get_design_context` 모두 같은 한도 공유). **호출을 아껴라** — 가능하면 메타데이터 1회 + 오버뷰 스크린샷 1회로 끝내고, 개별 와이어프레임은 오버뷰에서 로컬 크롭한다. 한도 소진 시 사용자에게 PNG Export 제공(→§B)을 안내한다.

1. **구조 파악:** `mcp__figma__get_metadata({ fileKey, nodeId })`
   - 결과가 크면 tool-results 파일로 저장됨. **layer name 에 실제 텍스트가 담겨 있다.**
   - 파이썬으로 top-level 프레임(=슬라이드)별 텍스트 노드를 추출한다(아래 스니펫). 좌→우, 위→아래(읽기 순서)로 정렬 = 화면 순서 SSOT.
2. **오버뷰 1장:** `mcp__figma__get_screenshot({ nodeId, maxDimension: 2000 })` → curl 로 `/tmp` 에 저장 후 Read 로 전체 레이아웃 파악.
3. **중요 와이어프레임:** 텍스트만으론 이해 어려운 화면(셀렉트 트리/팝업/플로우)은 고해상 스크린샷이 이상적이나, **한도가 빡빡하면** 오버뷰 PNG에서 슬라이드별로 크롭(§D)한다.

### 메타데이터 → 슬라이드별 텍스트 추출 스니펫

```python
import json, re, html
d = json.load(open('<tool-results 파일 경로>'))
xml = d[0]['text']
lines = xml.split(chr(10))
# 1) 최상위(2-space indent) 프레임 = 슬라이드. 읽기순(y밴드→x) 정렬로 순서 확보
rows=[]
for ln in lines:
    m=re.match(r'^  <(frame|group|instance) id="([^"]+)" name="([^"]*)" x="([\-\d.]+)" y="([\-\d.]+)"', ln)
    if m: rows.append((float(m.group(5)),float(m.group(4)),m.group(2),m.group(3)))
rows.sort(key=lambda r:(round(r[0]/500), r[1]))   # 슬라이드 순서 = SSOT
# 2) 특정 슬라이드 id 의 하위 text 노드 전사
target={'<slide_id>'}
cur=None; out=[]
for ln in lines:
    m=re.match(r'^(  +)<(\w+) id="([^"]+)"', ln)
    if not m: continue
    if len(m.group(1))==2: cur=m.group(3) if m.group(3) in target else None
    if cur and m.group(2)=='text':
        nm=re.search(r'name="([^"]*)"', ln)
        if nm: out.append(html.unescape(nm.group(1)))
print('\n'.join(out))
```

---

## §B. Export된 PNG 폴더 경로 (권장 — 한도 무관 + 고해상)

1. 폴더의 PNG 목록을 확인하고 **숫자 순서**로 정렬(`-0, -1, -2 …`; 문자열 정렬 주의).
2. 표지·목차 2~3장만 직접 Read 로 보고 덱 구조/제목/작성일/버전을 잡는다.
3. **분량이 많으면(≈8장 초과) 병렬 에이전트로 나눠 전사**한다. `Agent`(general-purpose)를 한 메시지에 여러 개 띄워 슬라이드 묶음(7~8장)씩 배정. 각 에이전트 프롬프트에 다음을 **반드시** 지시:
   - 슬라이드 N 을 **순서대로** Read (경로에 `[ ]`·공백 있어도 file_path 인자에 그대로, 셸 이스케이프 금지)
   - **요약 금지, 누락 금지** — 각 슬라이드: `제목/헤더`, `화면번호`(예: "배너광고 관리 > 배너광고 등록 > 광고 만들기"), `본문 전사`(폼 라벨·값·버튼·표·플레이스홀더·단위·{placeholder} 그대로), `주석/콜아웃`(번호 달린 우측 Description = **실질 사양이 여기 담김**), `마커`(SPEC OUT·버전 스탬프 `vX.Y.Z | 날짜 …`·빨강 에러/라벨)
   - 글씨가 작아 불확실하면 **추측하지 말고 "판독 신뢰도 낮음"으로 표기**
   - 와이어프레임은 레이아웃(좌 GNB/중앙 폼/우 주석) 1줄 + 읽히는 텍스트 전사
   - 최종 메시지 전체가 데이터이므로 군말 없이 전사 섹션만 반환
4. 반환된 전사를 모아 §C 로 합성. **불확실 구간은 PRD 에 "원본 재확인 필요"로 남긴다.**

---

## §C. PRD 합성 — 하우스 포맷

레포 외부 폴더(기본 `/Users/eprnf/04_DPLaps/`, 필요 시 사용자에게 확인)에
`PRD_<핵심키워드>_v<버전>.md` 로 저장. **한국어**, 사무적 명사형 종결.

섹션 골격(있는 것만, 순서 유지):

```
# PRD — <제목>
> 출처(SSOT) / Figma 링크 또는 원본 PNG 경로 / 문서 버전·작성일·작성자 / 제품
## 0. 개요          — 무엇을·왜. 핵심 신규/변경 bullet. SPEC OUT 경고 1줄
## 1. 버전 이력      — 버전/일자/변경사항(원문 표 그대로)
## 2~. 정책          — 데이터/DMP/DSP/상태체계/매핑 등 (백엔드·정책 슬라이드)
## N. 화면 흐름(SSOT) — 슬라이드 순서를 코드블록 트리로. 화면번호·섹션 간지 표기
## N+. 화면별 사양    — 화면별로: 경로, 폼 항목(라벨·단위·검증문구), 동작, 주석의 실질 사양
## 핵심 요구사항(Acceptance) — [ ] 체크리스트, 레이어(클라/백엔드/어드민)별
## SPEC OUT / 미해결  — SPEC OUT 항목·기준 불일치·원본 재확인 필요 구간
## 부록. 원본 슬라이드 매핑 — 슬라이드↔PRD섹션 표, 이미지 에셋 현황
```

원칙:

- **화면 순서 = SSOT.** 임의 재배열 금지.
- 우측 Description/콜아웃이 **실질 사양** — 와이어프레임 중앙 더미값보다 우선.
- `{nn}/25`, `1200×627px`, `10원 단위`, `CPM/CPC` 등 **숫자·단위·플레이스홀더 그대로**.
- **SPEC OUT / 버전 스탬프**는 절대 누락하지 말고 해당 항목에 인라인 표기 + §SPEC OUT 에 집계.
- 발견한 모순(기간 기준 불일치 등)·미정의는 삭제 말고 **미해결**로 남긴다.

---

## §D. 이미지 에셋 (중요 와이어프레임)

PRD 옆 `PRD_<키워드>_assets/` 에 저장하고 본문 해당 섹션에 `![설명](경로)` 임베드.

- **고해상 원본이 있으면(PNG Export / Figma 단일 슬라이드 스샷)** 그대로 복사·임베드.
- **오버뷰 1장만 있으면** PIL 로 슬라이드별 크롭(저해상 = "레이아웃 썸네일"로 명시). 캔버스 좌표(metadata)→픽셀 매핑: `px = rel_x * (img_w / section_w)`.
- 어떤 화면이 "중요"인가: 셀렉트/트리/팝업/플로우 다이어그램/상태 전이 — **텍스트로 재현이 어려운** 것.
- 해상도 한계가 있으면 PRD 에 솔직히 표기하고(고해상 교체 경로 안내), 텍스트 사양은 본문에 모두 반영한다.

---

## 마무리 체크

- [ ] 화면 순서(SSOT) 보존 · 화면번호/섹션 간지 표기
- [ ] 버전 이력·SPEC OUT·버전 스탬프 누락 없음
- [ ] 폼 사양(라벨·단위·검증문구) 원문대로
- [ ] Acceptance 체크리스트 + 미해결 섹션
- [ ] 중요 와이어프레임 이미지 임베드(또는 보류 사유 명시)
- [ ] 저장 위치/파일명 사용자에게 한 줄 보고

## 참고 (이미 만든 PRD — 포맷 레퍼런스)

- `/Users/eprnf/04_DPLaps/PRD_캐포비_ADID디타겟_OS타겟_모수계산_v1.0.0.md`
- `/Users/eprnf/04_DPLaps/PRD_캐포비_지역타게팅_v1.0.0.md`
- `/Users/eprnf/04_DPLaps/PRD_캐포비_배너광고_구조_UIUX개선_광고주CMS_v1.0.1.md`
