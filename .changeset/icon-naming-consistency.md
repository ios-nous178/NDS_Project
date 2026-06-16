---
"@nudge-design/icons": minor
---

아이콘 네이밍 일관성 정리 (브랜드 간 컨벤션 통일) — 일부 이름 변경(breaking)

기존 import 이름이 바뀌므로 소비처는 새 이름으로 교체 필요. 같은 글리프, 이름만 변경.

**오타 수정**

- `RunmileAlramIcon` → `RunmileAlarmIcon` (·`-Active`·`-Off` 포함). geniet·trost 는 이미 `alarm`.

**채움 표기 통일 (geniet 내부 `-fill` → `-solid`)**

- `GenietShoeFillIcon` → `GenietShoeSolidIcon` (heart 가 쓰는 `-solid` 로 통일)

**`img` → `image`**

- `GenietImgErrorIcon` → `GenietImageErrorIcon`
- `GenietImgGroupIcon` → `GenietImageGroupIcon`

**검색 지우기 통일 (`search-clear` → `search-delete`)**

- `RunmileSearchClearIcon` → `RunmileSearchDeleteIcon` (다른 3브랜드와 통일)

**circle 어순 통일 (`circle-*` → `*-circle`, Material 관례)**

- `GenietCirclePlusIcon` → `GenietPlusCircleIcon`
- `GenietCircleWarningIcon` → `GenietWarningCircleIcon`
- `GenietCircleDeleteIcon` → `GenietDeleteCircleIcon`
- `RunmileCircleCheckIcon` → `RunmileCheckCircleIcon`
- `RunmileCircleCheckColorIcon` → `RunmileCheckCircleColorIcon`
- `RunmileCircleWarningIcon` → `RunmileWarningCircleIcon`
- `RunmileCircleWarningStrokeIcon` → `RunmileWarningCircleStrokeIcon`

**geniet 방향 아이콘 — 모양과 이름 정합**

이전엔 `arrow-*` 가 실제로는 셰브론(꺾쇠), 꽉 찬 화살표는 `back/next/top` 이라 혼동. 모양 기준으로 정리:

- 꽉 찬 화살표: `GenietBackIcon` → `GenietArrowLeftIcon` · `GenietNextIcon` → `GenietArrowRightIcon` · `GenietTopIcon` → `GenietArrowUpIcon`
- 셰브론: `GenietArrowBackIcon` → `GenietChevronLeftIcon` · `GenietArrowRightIcon` → `GenietChevronRightIcon` · `GenietArrowUpIcon` → `GenietChevronUpIcon` · `GenietArrowDownIcon` → `GenietChevronDownIcon`
