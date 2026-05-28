---
sidebar_position: 99
title: 컴포넌트 문서 작성 가이드
---

# 컴포넌트 문서 작성 가이드

새 컴포넌트를 추가하거나 기존 문서를 개선할 때 따르는 표준 템플릿입니다.

---

## Frontmatter 스키마

모든 컴포넌트 문서는 아래 frontmatter를 포함해야 합니다.

```yaml
---
sidebar_position: { 번호 }
title: { 컴포넌트명 }
description: { 한 줄 설명 — AI가 컴포넌트를 식별/추천할 때 사용 }
category: { 일반 | 입력 | 레이아웃 | 내비게이션 | 오버레이 | 피드백 }
related: [{ 유사 컴포넌트 배열 }]
---
```

| 필드               | 필수 | 용도                                   |
| ------------------ | ---- | -------------------------------------- |
| `sidebar_position` | O    | 사이드바 정렬 순서                     |
| `title`            | O    | 문서 제목, 사이드바 표시명             |
| `description`      | O    | AI 컨텍스트 입력, 검색 색인            |
| `category`         | O    | 컴포넌트 분류 (overview 테이블과 일치) |
| `related`          | O    | 혼동되기 쉬운 유사 컴포넌트 목록       |

---

## 본문 표준 섹션 순서

아래 순서대로 섹션을 구성합니다. 컴포넌트 특성에 따라 일부 섹션은 생략 가능합니다.

```
1. # 컴포넌트명
   한 줄 설명 + import 코드 블록

2. ## 사용 가이드                    ← 필수
   ### 이럴 때 사용하세요
   ### 이럴 때 사용하지 마세요
   ### 자주 하는 실수

3. ## 플레이그라운드                  ← 권장 (interactive controls)

4. ## 기본 사용법                    ← 필수

5. ## Variant / Size / Color        ← 해당 시
   각 variant별 preview + 테이블 (설명 + 사용 시점)

6. ## 기능별 섹션                    ← 해당 시
   아이콘, 전체 너비, 비활성화, 에러, 로딩 등

7. ## Flat API Props                ← 필수

8. ## Compound API                  ← 해당 시 (Compound 지원 컴포넌트)
   Compound 컴포넌트별 props 테이블

9. ## SlotProps                     ← 해당 시

10. ## CSS 변수                     ← 필수

11. ## data-slot 구조               ← 필수

12. ## 접근성                       ← 필수
```

---

## "사용 가이드" 작성 기준

### 이럴 때 사용하세요

- 3~5개 항목
- **구체적인 사용 시나리오**를 적되, 특정 서비스 화면명은 피하기 (범용성 유지)
- 핵심 키워드를 **볼드** 처리

```markdown
### 이럴 때 사용하세요

- 사용자로부터 **한 줄 텍스트**를 입력받을 때 (이름, 이메일, 비밀번호 등)
- 라벨, 에러 메시지, 도움말이 함께 필요한 폼 필드일 때
```

### 이럴 때 사용하지 마세요

- 2~4개 항목
- 반드시 **대안 컴포넌트 링크**를 함께 제시
- 형식: `조건 → [대안](/components/대안)을 사용하세요`

```markdown
### 이럴 때 사용하지 마세요

- 검색 전용 입력 → [SearchInput](/components/search-input)을 사용하세요
- 미리 정해진 옵션에서 선택 → [Select](/components/select)를 사용하세요
```

### 자주 하는 실수

- 1~3개 항목
- 형식: `잘못된 패턴 — 왜 문제인지 설명 + 올바른 방법`
- 실제 코드 리뷰에서 자주 발견되는 패턴 중심

```markdown
### 자주 하는 실수

- `label` 없이 `placeholder`만 사용 — placeholder는 입력 시 사라지므로 접근성과 UX 모두 나빠집니다. 항상 `label`을 제공하세요
```

---

## 새 컴포넌트 문서 추가 체크리스트

새 컴포넌트 문서를 작성할 때 아래 체크리스트를 확인합니다.

- [ ] Frontmatter 5개 필드 모두 작성
- [ ] `사용 가이드` 섹션 작성 (이럴 때 사용 / 사용하지 마세요 / 자주 하는 실수)
- [ ] 플레이그라운드 또는 라이브 데모 포함
- [ ] Props 테이블 작성 (타입, 기본값, 설명)
- [ ] CSS 변수 테이블 작성
- [ ] data-slot 구조 다이어그램 작성
- [ ] 접근성 섹션 작성 (ARIA, 키보드, 포커스)
- [ ] `sidebars.js`에 문서 경로 추가
- [ ] `overview.mdx` 컴포넌트 목록에 추가
- [ ] 유사 컴포넌트가 있으면 overview 비교표에 추가
- [ ] 유사 컴포넌트의 `related` frontmatter에 역참조 추가

---

## 파일 템플릿

새 컴포넌트 문서의 시작점으로 아래 템플릿을 복사하세요.

````mdx
---
sidebar_position: { 번호 }
title: { ComponentName }
description: { 한 줄 설명 }
category: { 카테고리 }
related: [{ 관련 컴포넌트 }]
---

import { ComponentName } from "@nudge-design/react";
import ComponentPreview from "@site/src/components/ComponentPreview";
import Playground from "@site/src/components/Playground";

# {ComponentName}

{컴포넌트 한 줄 설명}

```tsx
import { ComponentName } from "@nudge-design/react";
```

---

## 사용 가이드

### 이럴 때 사용하세요

- ...

### 이럴 때 사용하지 마세요

- ... → [대안](/components/대안)을 사용하세요

### 자주 하는 실수

- ...

---

## 플레이그라운드

{Playground 컴포넌트}

---

## 기본 사용법

<ComponentPreview title="기본">
  {기본 예시}
</ComponentPreview>

```tsx
{코드 예시}
```

---

## Props

| Prop | 타입 | 기본값 | 설명 |
| ---- | ---- | ------ | ---- |
| ...  | ...  | ...    | ...  |

---

## CSS 변수

| 변수 | 기본값 | 설명 |
| ---- | ------ | ---- |
| ...  | ...    | ...  |

---

## data-slot 구조

```
{DOM 구조 다이어그램}
```

---

## 접근성

- ...
````
