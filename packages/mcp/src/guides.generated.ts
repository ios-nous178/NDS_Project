/**
 * AUTO-GENERATED — packages/mcp/guides-src/**.md 에서 build-guides.mjs 가 생성. 직접 수정 금지.
 *
 * 가이드 본문 수정 → guides-src/{components|patterns}/<Name>.md 를 고치고
 * `pnpm --filter @nudge-design/mcp build:guides` 로 재생성해 함께 커밋한다.
 * (check-ssot 의 build-guides --check 가 stale 을 차단한다.)
 */
import type { ComponentGuide, PatternGuide } from "./guide-types.js";

export const COMPONENT_GUIDES: Record<string, ComponentGuide> = {
  "Accordion": {
    "name": "Accordion",
    "summary": "수직 펼침/접힘 그룹. FAQ, 약관, 다단 설정처럼 정보 밀도가 높지만 한 번에 다 보여줄 필요 없는 곳에 사용.",
    "pitfalls": [
      "type='single' 인데 value 를 배열로 넘기지 말 것. 단일 모드는 string, multiple 모드만 배열.",
      "trigger 안에 nds-button / a / 클릭 가능한 자식 element 를 또 두면 nested interactive — 키보드/포커스 동작이 깨짐. trigger 자체가 button 임.",
      "Accordion 안에 form / 입력 폼을 깊게 두지 말 것. 접힘 상태에서 validation 실패가 보이지 않아 사용자가 혼란."
    ],
    "examplesHtml": {
      "do": "<nds-accordion type=\"single\" value=\"terms\">\n  <nds-accordion-item value=\"terms\">\n    <nds-accordion-trigger>이용약관</nds-accordion-trigger>\n    <nds-accordion-content>본문…</nds-accordion-content>\n  </nds-accordion-item>\n  <nds-accordion-item value=\"privacy\">\n    <nds-accordion-trigger>개인정보 처리방침</nds-accordion-trigger>\n    <nds-accordion-content>본문…</nds-accordion-content>\n  </nds-accordion-item>\n</nds-accordion>\n<script>el.addEventListener(\"accordion-change\", e => console.log(e.detail.value));</script>",
      "dont": "<!-- accordion-trigger 안에 또 다른 클릭 가능한 element — nested interactive -->\n<nds-accordion-item value=\"x\">\n  <nds-accordion-trigger><nds-button>열기</nds-button></nds-accordion-trigger>\n  <nds-accordion-content>본문</nds-accordion-content>\n</nds-accordion-item>"
    }
  },
  "ActionChip": {
    "name": "ActionChip",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3082-976",
    "sizeMatrix": {
      "height": "20-24px (라벨/아이콘 sizing 에 따라 자동)",
      "iconBox": "14 × 14 (icon.normal)",
      "label": "caption1 12/16 Medium · text.subtle",
      "bg": "fill.neutralSubtle (hover surface.section)",
      "radius": "sm(6)",
      "padding": "2px / 6px (vertical / horizontal)",
      "gapIconLabel": "2px (spacing[2])"
    },
    "stateMatrix": {
      "default": "bg fill.neutralSubtle · text.subtle · icon.normal",
      "hover": "bg surface.section",
      "disabled": "opacity 0.6 · cursor not-allowed"
    },
    "usagePolicy": {
      "useFor": [
        "TextField · ImageUpload 등 입력 컴포넌트 helper 옆 보조 액션 (예시/수정/다운로드)",
        "한 폼 안에서 여러 inline 액션을 가로로 묶기"
      ],
      "doNotUseFor": [
        "주요 CTA — Button 사용",
        "단순 라벨/태그 (클릭 없음) — Badge / Chip",
        "필터/선택 칩 (다중 토글) — Chip"
      ],
      "limits": {
        "iconSize": 14,
        "labelTypography": "caption1 12/16 Medium",
        "maxInRow": "권장 4 이하 (helper 영역 폭 제한)"
      }
    },
    "summary": "TextField helper/description 영역 옆에 붙는 작은 보조 액션 chip. 아이콘(14px) + 라벨(caption1 Medium). bg fill.neutralSubtle, radius sm(6), padding 2/6.",
    "pitfalls": [
      "주요 CTA 자리에 쓰지 말 것 — 시각 위계가 캡션 톤. 주요 액션은 Button.",
      "별도 row 로 떨어뜨리지 말 것 — TextField helper text 와 **inline** 으로 같은 줄.",
      "아이콘 사이즈는 14px 기준 — 큰 아이콘을 그대로 넘기면 chip 이 부풀음. `width={14} height={14}` 강제.",
      "`kind` enum 같은 분기 prop 없음 — 사용처가 적절한 아이콘 import 해서 `icon` 으로 넘김 (Example/Edit/Download 는 가이드 사례일 뿐).",
      "ButtonHTMLAttributes 상속 — `type` / `children` 은 internal 이라 prop 으로 받지 않음."
    ],
    "recommended": [
      "기본: <ActionChip icon={<DownloadIcon width={14} height={14} />} label=\"다운로드\" onClick={…} />",
      "여러 개 묶기: flex container + gap 8 (TextField helper 영역과 inline)",
      "아이콘 없이 텍스트만: <ActionChip label=\"안내 보기\" onClick={…} />"
    ],
    "accessibility": [
      "ButtonHTMLAttributes 상속 — `aria-label` / `aria-describedby` 자유 부착.",
      "키보드: Tab focus + Enter/Space 자동 (native button).",
      "disabled 시 native `disabled` 속성 그대로 — screen reader 가 비활성 안내."
    ],
    "examplesHtml": {
      "do": "<nds-action-chip label=\"필터 추가\">\n  <svg slot=\"icon\" viewBox=\"0 0 24 24\">…</svg>\n</nds-action-chip>",
      "dont": "<!-- nds-action-chip 대신 nds-chip + onclick 으로 액션 트리거 흉내 -->\n<nds-chip onclick=\"addFilter()\">+ 필터</nds-chip>"
    }
  },
  "AddButton": {
    "name": "AddButton",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-18966",
    "summary": "폼 안에서 \"항목 추가\"(지역/옵션/행)를 유도하는 점선 affordance 버튼. 일반 Button(solid/outlined CTA)과 의도가 다름 — 반복 추가 슬롯이라 점선 보더. 필수 미선택 시 error 로 빨간 실선 강조. Figma 캐포비 타겟팅 \"지역 추가\"(3001:18966).",
    "pitfalls": [
      "일반 제출/확정 CTA 에 쓰지 말 것 — 그건 Button. AddButton 은 '리스트에 한 줄 더 추가' affordance.",
      "error 는 보더만 빨갛게 한다 — **인라인 에러 메시지(\"…를 선택해 주세요\")는 FormField/필드그룹 쪽에서 별도로** 노출(AddButton 내부엔 메시지 없음).",
      "보더/배경/에러색은 토큰 자동(점선=border strong, 에러=border status-error #FC3500). raw hex 금지.",
      "기본 full-width. 좁게 두려면 full-width 끄기."
    ],
    "examplesHtml": {
      "do": "<nds-add-button label=\"지역 추가\"></nds-add-button>\n<!-- 필수 미선택 에러 — 빨간 실선. 메시지는 아래 FormField 등에서 별도 -->\n<nds-add-button label=\"지역 추가\" error></nds-add-button>",
      "dont": "<!-- 폼 제출 CTA 에 AddButton — Button(solid)이 맞음 -->\n<nds-add-button label=\"저장하기\"></nds-add-button>"
    }
  },
  "AddressPicker": {
    "name": "AddressPicker",
    "summary": "주소 수집 전체 플로우(단순 검색창 아님) — 키워드 검색 + 결과 리스트 선택 + 상세주소 입력까지 한 컴포넌트. 검색 자체는 외부 API(카카오/네이버)로 처리, results만 전달. (구 이름 AddressSearch — 2026-06 AddressPicker 로 개명, 태그 nds-address-picker.)",
    "pitfalls": [
      "단순 주소 검색창이 아님 — 검색→선택→상세입력까지의 picker. SearchInput 으로 흉내내지 말 것.",
      "onSearch는 외부 API 호출 트리거 — 컴포넌트가 직접 검색 안 함.",
      "value는 주소 + 상세 한 묶음 — 폼 state에서 단일 값으로 관리.",
      "loading 상태 동안 검색 버튼 비활성 — 직접 disabled 처리 X.",
      "검색 버튼 검정 CTA — 지니어트는 color=\"secondary\", **캐포비는 color=\"neutral\"**(캐포비 secondary 는 Figma 미정의라 Button/validator 가 경고). 색 hex 박지 말고 프로젝트 cascade."
    ],
    "recommended": [
      "회원가입 주소: query/results를 외부 hook으로 관리",
      "방문 상담 주소: helperText='출입 가능한 주소를 입력해주세요'"
    ],
    "examplesHtml": {
      "do": "<nds-address-picker label=\"주소\" search-label=\"주소 검색\"\n  empty-message=\"검색 결과가 없어요\" helper-text=\"도로명/지번 모두 가능\"></nds-address-picker>\n<script>el.addEventListener(\"address-query\", e => search(e.detail.query));</script>",
      "dont": "<!-- results 를 string 으로 그대로 박음 — JSON 배열이어야 렌더 가능 -->\n<nds-address-picker results=\"결과 없음\"></nds-address-picker>"
    }
  },
  "Agreement": {
    "name": "Agreement",
    "summary": "약관 동의 — 전체동의(master) + 필수/선택 약관 항목 cascade. 전체동의 클릭은 활성 항목 전체를 on/off, 항목 선택 비율에 따라 전체동의가 checked / indeterminate / unchecked 를 **자동** 표시한다. 온보딩·회원가입의 약관 동의 영역 전용. value 는 **동의된 항목 value 배열**.",
    "pitfalls": [
      "약관 본문/링크 URL 은 앱 데이터 — DS 는 셸만 제공한다. 항목 `viewHref` 로 \"보기\" 링크를 외부 약관 페이지에 연결(없으면 `onView` 핸들러).",
      "`required` 는 \"필수\" 배지만 표시 — **제출 가능 여부(필수 전부 체크)는 앱이 value 로 판정**한다. 컴포넌트는 필수 미동의를 막지 않는다.",
      "cascade 기준은 **활성(비-disabled) 항목** — disabled 항목은 전체동의 토글/상태 계산에서 제외된다.",
      "계층(시/도▸시군구)·검색이 필요하면 Agreement 가 아니라 CheckboxTree. Agreement 는 평면 1-depth 약관 전용.",
      "일반 다중선택 체크박스 그룹은 CheckboxGroup — Agreement 는 \"전체동의 + 필수/선택 배지 + 보기 링크\" 약관 시멘틱이 붙은 경우만.",
      "전체동의 구분선은 `divider`(기본 노출). 전체동의 행을 숨기려면 flat API 에서 `allLabel={null}`(html `all-label=\"none\"`)."
    ],
    "recommended": [
      "필수 약관은 `required` → \"필수\" 배지(project 색), 선택 약관은 자동 \"선택\" 배지(subtle)",
      "제출 버튼 활성 조건은 앱에서 `items.filter(i=>i.required).every(i=>value.includes(i.value))` 로 계산"
    ],
    "examplesHtml": {
      "do": "<nds-agreement all-label=\"전체 동의\" value='[]'\n  items='[{\"value\":\"tos\",\"label\":\"(필수) 이용약관 동의\",\"required\":true,\"viewHref\":\"/tos\"},\n          {\"value\":\"privacy\",\"label\":\"(필수) 개인정보 처리방침 동의\",\"required\":true,\"viewHref\":\"/privacy\"},\n          {\"value\":\"mkt\",\"label\":\"(선택) 마케팅 정보 수신 동의\",\"required\":false}]'></nds-agreement>\n<script>el.addEventListener(\"nds-agreement-change\", e => setAgreed(e.detail.value));</script>",
      "dont": "<!-- 계층/검색이 필요한 지역 선택을 Agreement 로 — CheckboxTree 가 맞음 -->\n<nds-agreement items='[{\"value\":\"seoul\",\"label\":\"서울\",\"children\":[]}]'></nds-agreement>"
    }
  },
  "AmountInput": {
    "name": "AmountInput",
    "summary": "큰 금액/수량 입력(원·명·개·포인트 등). 자동 천 단위 콤마, presets(빠른 입력), max/min 클램프.",
    "pitfalls": [
      "**금액/수량을 입력받는 폼 필드를 일반 text input 이나 정적 숫자 표시('3,000,000 명' 큰 글씨)로 만들지 말 것** — 사용자가 못 고치고 콤마/단위/clamp 가 빠진다. <nds-amount-input value=… unit='명|원|개' placeholder='0'> 로. unit 은 '원' 외에도 '명/개' 등 자유 (검증룰 amount-as-text-input / amount-as-static-display 가 막음).",
      "value는 number | null. 빈 입력은 null (0이 아님).",
      "presets의 set: true = 값 설정, false/미지정 = 누적. 헷갈리지 말 것.",
      "max/min 자동 클램프 — 외부 검증 X. 단, 에러 메시지는 외부에서 helperText로."
    ],
    "recommended": [
      "송금: presets +1만/+5만/전액(set), max=balance",
      "후원: presets에 set:true 4종 (5천/1만/3만/5만)"
    ],
    "examplesHtml": {
      "do": "<nds-amount-input value=\"10000\" prefix=\"₩\" unit=\"원\" label=\"후원 금액\"\n  presets='[{\"label\":\"+1만\",\"amount\":10000},{\"label\":\"+5만\",\"amount\":50000}]'></nds-amount-input>\n<script>el.addEventListener(\"amount-change\", e => setAmount(e.detail.value));</script>",
      "dont": "<!-- 값에 통화기호와 쉼표 직접 박음 — number 파싱이 깨짐 -->\n<nds-amount-input value=\"₩10,000\"></nds-amount-input>"
    }
  },
  "Article": {
    "name": "Article",
    "summary": "게시글/공지/FAQ **상세 보기** 셸. 제목·메타(Header) + 본문(Body) + 첨부(Attachments) + 액션(Actions)을 묶는 레이아웃 compound. 좋아요 카운트·권한·작성자 데이터 등 **앱 로직은 0** — 모두 슬롯에 주입한다.",
    "pitfalls": [
      "**목록/피드의 게시글 \"카드\"는 Article 이 아니다** — Card(Header/Title/Subtitle/Meta/Thumbnail) + ListItem 조합 패턴. Article 은 **상세 한 건** 전용.",
      "본문은 `Article.Body` 의 `html` prop → 내부 sanitize 유틸로 안전 렌더(위험태그 제거 + 태그 allowlist). raw `<div dangerouslySetInnerHTML>` 직접 쓰지 말 것. 신뢰된 본문이면 `sanitize={false}`. (구 ContentViewer 강등 — 본문 렌더링이 Article.Body 로 통합됨.)",
      "좋아요/공유/신고 버튼은 `Article.Actions` 에 LikeButton 등을 주입 — Article 은 카운트/토글 상태를 갖지 않는다(앱이 관리).",
      "첨부는 `Article.Attachments` 안에 AttachmentItem 을 넣는다 — 첨부 다운로드 로직은 앱.",
      "html 은 container + subpart 엘리먼트(`<nds-article>`/`<nds-article-header|body|attachments|actions>`)로 미러 — 본문은 `<nds-article-body html=\"...\">` 가 직접 sanitize 렌더한다."
    ],
    "recommended": [
      "제목 heading 레벨은 화면 위계에 맞춰 `level`(기본 2)",
      "메타 행은 \"작성자 · 날짜 · 조회수\" 순, caption 색(subtle)",
      "Actions 는 1차 액션(좋아요) 좌측, 보조(공유/신고) 우측 정렬은 앱에서 배치"
    ],
    "examplesHtml": {
      "do": "<nds-article>\n  <nds-article-header>\n    <h2 class=\"nds-article__title\">6월 정기 점검 안내</h2>\n    <div class=\"nds-article__meta\">운영팀 · 2026.06.13 · 조회 1,204</div>\n  </nds-article-header>\n  <nds-article-body html=\"<p>점검 시간은…</p>\"></nds-article-body>\n  <nds-article-actions><nds-like-button count=\"12\"></nds-like-button></nds-article-actions>\n</nds-article>",
      "dont": "<!-- 목록의 게시글 카드를 Article 로 — Card + ListItem 조합이 맞음 -->\n<nds-article><h3>게시글 제목</h3><span>요약…</span></nds-article>"
    }
  },
  "Asset": {
    "name": "Asset",
    "_htmlStatus": "no-html-equivalent",
    "summary": "Toss TDS 식 통합 미디어 컴포넌트. image / icon / initial / lottie / custom 을 동일한 Frame 위에 표현해 모양·크기·overlap·status accessory 의 일관성을 강제한다. Avatar 가 '사람 식별' 한정 컴포넌트라면 Asset 은 그보다 일반적인 박스 — 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등. react-only(웹컴포넌트 `nds-asset` 미러 없음).",
    "pitfalls": [
      "content prop 은 discriminated union — `{ type: 'image', src }` / `{ type: 'icon', icon }` / `{ type: 'initial', name }` / `{ type: 'lottie', src }` / `{ type: 'custom', render }` 중 하나. 객체로 묶어서 넘기지 말고 type 키로 분기한 형태로 정확히 전달.",
      "size 는 xs/sm/md/lg/xl/2xl 프리셋 또는 임의 px 숫자. 프리셋 px 은 **Avatar 와 동일 스케일**(Figma 1337:8): xs 24 · sm 32 · md 48 · lg 64 · xl 96 + Asset 전용 2xl 120. shape='rounded' radius 도 Avatar 와 동일(사이즈별 4/6/8/10/12, 2xl 14). 임의 px 은 비표준 사이즈가 박힐 수 있으므로 가능하면 프리셋 사용.",
      "shape='circle' + content.type='image' 가 가장 흔한 사용 — 이 경우 Avatar 와 거의 같음. Avatar 는 그대로 둔다 (사람 한정 시멘틱). Asset 은 일반 미디어 박스.",
      "overlap prop 은 우측 음수 마진(저수준 primitive). 여러 아바타를 쌓는 그룹 UI 는 **AvatarGroup**(items/max/자동 +N) 을 쓰고, overlap 은 그 위에서 단일 Asset 의 겹침을 미세 제어할 때만 쓴다 — Asset 으로 그룹을 손수 조립하지 말 것. 단독 사용 시 0.",
      "acc(accessory) 는 우측 하단 status dot / count badge 슬롯. **presence 점은 `OnlineIndicator`, count/상태 뱃지는 `Badge`(color=\"error\" 등)를 넣는다 — raw hex inline-style 로 점·뱃지를 손수 그리지 말 것.** 풀-사이즈 컴포넌트(긴 텍스트 라벨)는 넣지 말고 작은 시각 신호만.",
      "image type 에서 src 로드 실패 시 alt 의 이니셜로 자동 graceful degrade. alt 가 빈 문자열이면 빈 박스가 됨.",
      "scaleType 은 image/lottie 에만 의미 있음 — icon/initial 에는 영향 없음.",
      "multicolor 아이콘을 icon content 로 넣을 때 `color` prop 으로 base 색을 바꿀 수는 있지만 내부 accent 는 잠겨있음 (iconography 가이드 참고)."
    ],
    "examples": {
      "do": "// 일반 미디어 박스 (카드 썸네일)\n<Asset shape=\"rounded\" size=\"lg\" content={{ type: \"image\", src: \"/thumb.jpg\", alt: \"제품\" }} scaleType=\"cover\" />\n\n// 카테고리 시그니처 (multicolor 아이콘)\n<Asset shape=\"rounded\" size=\"xl\" content={{ type: \"icon\", icon: <TrostMentalDepressionIcon /> }} />\n\n// 온라인 상태가 붙은 사람 — acc 에 DS 컴포넌트(OnlineIndicator)\n<Asset\n  shape=\"circle\"\n  size=\"md\"\n  content={{ type: \"image\", src: \"/me.jpg\", alt: \"이정민\" }}\n  acc={<OnlineIndicator status=\"online\" size={12} />}\n/>\n\n// 안 읽은 개수 — acc 에 Badge\n<Asset\n  shape=\"rounded\"\n  size=\"lg\"\n  content={{ type: \"icon\", icon: <CounselIcon /> }}\n  acc={<Badge variant=\"fill\" color=\"error\" shape=\"pill\" size=\"sm\">3</Badge>}\n/>",
      "dont": "// 사람 식별인데 Avatar 대신 Asset — 시멘틱 약화 (Avatar 가 맞음)\n<Asset shape=\"circle\" size=\"md\" content={{ type: \"image\", src: \"/user.jpg\", alt: \"사용자\" }} />\n\n// acc 에 raw hex inline-style 로 점·뱃지를 손수 그림 — OnlineIndicator / Badge 를 쓸 것\n<Asset content={{ type: \"image\", src: \"/x.jpg\" }} acc={<span style={{ width: 12, height: 12, background: \"#22c55e\" }} />} />\n\n// 여러 명 쌓기를 Asset+overlap 으로 손수 조립 — AvatarGroup 을 쓸 것\n<div style={{ display: \"flex\" }}>\n  <Asset overlap={12} content={{ type: \"image\", src: \"/a.jpg\" }} />\n  <Asset overlap={12} content={{ type: \"image\", src: \"/b.jpg\" }} />\n</div>\n\n// acc 에 풀-사이즈 텍스트 라벨\n<Asset content={{ type: \"image\", src: \"/x.jpg\" }} acc={<span>신규 상품 입고 안내</span>} />"
    }
  },
  "AttachmentItem": {
    "name": "AttachmentItem",
    "summary": "이미 첨부된 파일을 보여주는 행 — FileUpload(업로드 영역)와 역할 분리. 진단서/처방전 등 EAP 의료 파일 표시.",
    "pitfalls": [
      "FileUpload와 페어로 자주 사용 — FileUpload의 value(File[])를 매핑해서 AttachmentItem으로 노출하는 패턴.",
      "fileType 미지정 시 name 확장자에서 자동 추론 (pdf/image/video/audio/document/archive). 추론 실패는 'other'.",
      "status=\"uploading\"이면 자동으로 다운로드 버튼 숨김 — progress 함께 사용.",
      "status=\"error\" + errorMessage로 거부 사유 지속 노출. Toast보다 명확.",
      "href와 onDownload 둘 다 제공 가능 — href가 있으면 <a download>, 없으면 button."
    ],
    "recommended": [
      "진단서 첨부: name + size + status=\"done\" + href + onRemove",
      "업로드 진행 중: status=\"uploading\" + progress 폴링"
    ],
    "examplesHtml": {
      "do": "<nds-attachment-item name=\"report.pdf\" size=\"2.4MB\" file-type=\"pdf\" status=\"done\" href=\"/files/report.pdf\"></nds-attachment-item>\n<nds-attachment-item name=\"audio.m4a\" status=\"uploading\" progress=\"42\"></nds-attachment-item>",
      "dont": "<!-- status 없이 progress 만 — 업로드/완료/에러 어느 상태인지 모호 -->\n<nds-attachment-item name=\"x.pdf\" progress=\"42\"></nds-attachment-item>"
    }
  },
  "AudioPlayer": {
    "name": "AudioPlayer",
    "summary": "명상/이완 가이드 플레이어. 재생/일시정지/시크/이전/다음.",
    "pitfalls": [
      "playing/currentTime/duration은 외부 상태 — useState + audio ref + timeupdate 이벤트로 동기화. DS는 UI만 제공.",
      "onSeek 미제공이면 슬라이더가 disabled. 시크 막을 거면 명시적으로.",
      "title prop도 HTMLDivElement.title과 충돌하지 않도록 Omit됨. ReactNode 가능.",
      "onSkipBack/Forward는 옵셔널 — 단일 트랙이면 둘 다 생략하면 표시 안 됨."
    ],
    "recommended": [
      "10분 미만 단일 가이드: SkipBack/Forward 생략. 시리즈 재생만 둘 다 부착."
    ],
    "examplesHtml": {
      "do": "<nds-audio-player title=\"3분 호흡 명상\" subtitle=\"저녁용\" duration=\"180\"></nds-audio-player>\n<script>el.addEventListener(\"audio-play\", play);</script>",
      "dont": "<!-- raw <audio controls> -> DS 스킨 / 진행도 라벨이 적용 안 됨 -->\n<audio controls src=\"/m.mp3\"></audio>"
    }
  },
  "Autocomplete": {
    "name": "Autocomplete",
    "summary": "입력 + 드롭다운 추천(자유 입력 허용). SearchInput(자유 검색)과 Select(고정 목록)의 중간. 키보드 ↓↑/Enter/Esc 내장. ⚠️ 목록에서 *고르기만* 하면(자유 입력 불필요) `Select searchable` 이 맞다 — Autocomplete 는 값이 옵션에 없어도 되는 경우.",
    "pitfalls": [
      "**Select searchable 과 구분** — 옵션 중 하나를 *선택*하는 검색이면 `Select searchable`(값이 옵션으로 제약). Autocomplete 는 자유 입력 + 비동기 제안용.",
      "options는 외부에서 필터링해 전달 — 컴포넌트가 자동 필터링하지 않음 (서버 검색을 위한 의도적 설계).",
      "onSelect 후 onValueChange(label)이 자동 호출됨. value를 다시 set하지 말 것 (이중 호출).",
      "minQueryLength=0으로 두면 빈 입력에서도 드롭다운이 열림. 추천 노출이 의도가 아니면 1+ 권장.",
      "options 수가 매우 많으면(50+) 가상 스크롤 별도 필요. 컴포넌트는 max-height 280px + scroll만 제공."
    ],
    "recommended": [
      "약 검색: useMemo로 클라이언트 필터, description에 성분/용량",
      "센터 검색: minQueryLength=2, 비동기 fetch + loading=isFetching",
      "키워드 자동완성: highlight=true (기본), 결과 없을 때 emptyMessage 커스텀"
    ],
    "examplesHtml": {
      "do": "<nds-autocomplete placeholder=\"회사 검색\"\n  options='[{\"value\":\"1\",\"label\":\"카카오\"},{\"value\":\"2\",\"label\":\"네이버\"}]'\n  min-query-length=\"1\" highlight></nds-autocomplete>\n<script>el.addEventListener(\"autocomplete-select\", e => pick(e.detail.value));</script>",
      "dont": "<!-- options 를 단일 따옴표 없이 JSON.stringify 결과 그대로 — 따옴표 escape 가 깨짐 -->\n<nds-autocomplete options=\"[{value:'1',label:'A'}]\"></nds-autocomplete>"
    }
  },
  "Avatar": {
    "name": "Avatar",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1337-8",
    "sizeMatrix": {
      "xs": "24px · font 11 · rounded radius 4 — 인디케이터·메타정보",
      "sm": "32px · font 14 · rounded radius 6 — 리스트 셀·작은 메뉴",
      "md": "48px · font 20 · rounded radius 8 — 댓글·채팅·작은 카드 (기본)",
      "lg": "64px · font 26 · rounded radius 10 — 카드 썸네일·상담사 리스트",
      "xl": "96px · font 38 · rounded radius 12 — 프로필 헤더·상세 페이지"
    },
    "summary": "사용자 / 상담사 / 앱을 시각적으로 표현하는 이미지 단위 + fallback(이니셜 1자 Bold / 기본 아이콘). **Shape 3종 × Size 5종 = 15 variants**(Figma 1337:8). Shape: `circle`(인물 프로필·댓글·채팅·헤더 식별, 기본) · `rounded`(앱 아이콘·상담사 카드 썸네일, 사이즈별 radius 4~12) · `square`(콘텐츠 카드·일러스트·제품 이미지, radius 0). Size 키 `xs/sm/md/lg/xl` = `24/32/48/64/96px`. 정사각 비율 이미지를 swap 하고 clipsContent 로 모서리 밖을 자른다. 색은 semantic 토큰(bg=surface.section, fallback=text subtle)으로 5 프로젝트 cascade.",
    "pitfalls": [
      "같은 화면에서 같은 entity 에 다른 Shape 혼용 금지 — 사용자=circle, 앱=rounded 처럼 entity별 Shape 를 한 화면 내내 일관 유지.",
      "직사각(가로>세로) 이미지를 그대로 넣으면 잘림 — 정사각 비율 이미지만 swap. 96+ 사이즈는 circle 권장(square/rounded 는 콘텐츠 카드와 혼동).",
      "src 만 있고 alt/name 둘 다 누락 — 로드 실패 시 빈 박스 + 스크린리더 무용. alt 또는 name(이니셜 1자 자동) 중 하나는 필수.",
      "size 를 px 인라인(`style=\"width:33px\"`)으로 강제하지 말 것 — `xs/sm/md/lg/xl`(24/32/48/64/96)가 폰트/이니셜/radius 비율을 함께 보장. 임의 px 는 sizeMatrix 불일치.",
      "Avatar 위에 상태 점/badge 를 직접 absolute 로 얹지 말고 부모 컨테이너에서 layout 결정. AvatarGroup 은 size/shape 를 그룹 전체에 전파(개별 Avatar 에 다시 박지 말 것)."
    ],
    "examplesHtml": {
      "do": "<!-- 인물 프로필: circle (기본) -->\n<nds-avatar src=\"/u.jpg\" alt=\"홍길동\" size=\"md\"></nds-avatar>\n<nds-avatar name=\"이정민\" size=\"lg\"></nds-avatar> <!-- src 실패 시 '이' 1자 Bold -->\n<!-- 앱 아이콘/썸네일: rounded · 콘텐츠/제품: square -->\n<nds-avatar src=\"/app.png\" alt=\"앱\" size=\"lg\" shape=\"rounded\"></nds-avatar>\n<nds-avatar src=\"/product.png\" alt=\"제품\" size=\"lg\" shape=\"square\"></nds-avatar>",
      "dont": "<!-- alt / name 둘 다 없음 — 로드 실패 시 ghost 박스 -->\n<nds-avatar src=\"/u.jpg\" size=\"md\"></nds-avatar>\n<!-- 인라인 px 로 강제 사이즈 — sizeMatrix 와 불일치 -->\n<nds-avatar src=\"/u.jpg\" alt=\"A\" style=\"width:33px;height:33px\"></nds-avatar>\n<!-- 같은 사용자 프로필인데 화면마다 shape 다르게 -->\n<nds-avatar name=\"홍\" shape=\"square\"></nds-avatar>"
    }
  },
  "AvatarGroup": {
    "name": "AvatarGroup",
    "summary": "여러 아바타를 겹쳐 표시 + 초과 +N. 단체 상담/챌린지 참가자 같은 시각 신호용.",
    "pitfalls": [
      "정확한 명단이 목적이면 List가 더 적절. AvatarGroup은 'N명이 함께'라는 시각 신호.",
      "단일 아바타는 Avatar 그대로. AvatarGroup은 N명 ≥ 2 케이스용.",
      "max를 너무 크게 두면(7+) 가로 폭이 늘어남 — 모바일은 4 권장."
    ],
    "recommended": [
      "단체 상담 참여자: max=4 size='md'",
      "챌린지: max=5 size='sm'",
      "이미지 + 이니셜 혼합: src 없으면 자동 이니셜 fallback"
    ],
    "examplesHtml": {
      "do": "<nds-avatar-group max=\"3\" size=\"md\"\n  items='[{\"src\":\"/a.jpg\",\"alt\":\"A\"},{\"src\":\"/b.jpg\",\"alt\":\"B\"},{\"src\":\"/c.jpg\",\"alt\":\"C\"},{\"src\":\"/d.jpg\",\"alt\":\"D\"}]'></nds-avatar-group>",
      "dont": "<!-- max 누락 — 5명 이상이면 가로로 무한히 늘어남 -->\n<nds-avatar-group items='[…아주 많음…]'></nds-avatar-group>"
    }
  },
  "Badge": {
    "name": "Badge",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-10856",
    "references": [
      {
        "label": "CashwalkBiz Admin Badge/Chip Guide — RoundedSquare / Pill",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20558",
        "caption": "Cashwalk for Business · Label & Chip(ChipGuide). Badge 두 shape — RoundedSquare(shape=\"default\", radius 4~6, 동적 상태값 충전·사용·적립·만료·취소) / Pill(shape=\"pill\", radius full, 정적 식별 태그 일반 계정·프리미엄·신규). 톤은 ghost 변형으로 매핑(충전=project·사용=info·적립=success·만료=neutral·취소=error). SelectChip 은 Badge 아니라 Chip 컴포넌트.",
        "project": "cashwalk-biz"
      },
      {
        "label": "Trost Badge Guide — type(label/dot/count) · 5톤(ghost)",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5107-130",
        "caption": "Trost Library · Badge. 유형(type) 3종 — label(텍스트 배지, 기본) / dot(8×8 상태 점, 텍스트 없음) / count(min 18px 원형 숫자 카운터). 5톤(neutral·project·success·error·info)은 variant=\"ghost\" 의 subtle 룩으로 표현(project=#FFFDD9 bg/#FF9D00 text 등). dot·count 의 색은 variant=fill 룰(예: color=\"error\" → 빨강).",
        "project": "trost"
      }
    ],
    "usagePolicy": {
      "useFor": [
        "상태 표시 (진행중 / 완료 / 마감)",
        "속성 라벨 (신규 / 추천 / 필수)",
        "리스트 Row 의 보조 메타 정보"
      ],
      "doNotUseFor": [
        "버튼 / CTA 대체",
        "섹션 제목 장식",
        "본문 강조용 컬러 칩",
        "모든 카드에 반복되는 시각 장식"
      ],
      "colorPolicy": {
        "project": "현재 선택 · 핵심 강조에만",
        "neutral": "일반 카테고리 · 기본 속성 (기본값)",
        "success": "성공/완료 의미",
        "error": "오류/실패 의미",
        "caution": "주의/경고 의미",
        "info": "정보/안내 의미"
      },
      "variantPolicy": {
        "fill": "강한 상태 표시 — 카드당 최대 1개",
        "ghost": "일반 카테고리 · 기본 보조 정보 (권장 기본값)",
        "line": "비활성/완료 상태"
      },
      "shapePolicy": {
        "default": "라운드 사각(radius 4~6) — 거래/처리 상태·카테고리 같은 동적 상태값(충전·사용·적립·만료·취소). 데이터 테이블·리스트 셀 기본.",
        "pill": "완전 둥근(radius full) — 계정 유형·식별성 같은 정적 속성 태그(일반 계정·프리미엄·신규). 헤더/타이틀 옆 식별 표식. 동적 상태값에는 쓰지 말 것(혼용 주의)."
      },
      "limits": {
        "maxLabelLength": 8,
        "maxFillPerCard": 1,
        "maxPerCard": 2
      }
    },
    "summary": "상태/속성을 한눈에 알려주는 보조 라벨. variant: fill/ghost/line · color: project/neutral/success/error/caution/info · shape: default(라운드 사각)/pill(완전 둥근) · **type: label/dot/count**. Figma 171:10856 (캐포비 admin ChipGuide 3782-20558 · 트로스트 5107-130). label prop 필수. 콘텐츠가 아니라 콘텐츠를 보조하는 메타 정보만 담는다. **shape 로 의미 구분 — 동적 상태값=default(사각), 정적 식별 태그=pill.** **type 축**(트로스트 5107-130, 기본 label·하위호환): label=텍스트 배지 · dot=8×8 점(텍스트 없음·활성/미확인) · count=min 18px 원형 숫자 카운터(99 초과 `99+`); dot·count 색은 ghost 가 아니라 variant=fill 룰을 따른다(예: `color=\"error\"`→빨강). 가이드 5톤(neutral/project/success/error/info)은 variant=\"ghost\" subtle 룩(project=#FFFDD9 bg/#FF9D00 text), caution 은 앰버 경고용으로 enum 유지.",
    "pitfalls": [
      "Badge 는 강조 요소가 아니라 보조 정보 — 본문 텍스트보다 시선을 끌면 안 된다.",
      "Fill Badge 남용 금지 — 한 카드/리스트 Row 에 Fill Badge 가 2개 이상 보이면 위계가 무너진다. 일반 카테고리는 ghost/line 우선.",
      "Project color 는 '현재 선택 / 핵심 강조' 에만 사용. 일반 카테고리·상태 표시에는 neutral 우선.",
      "상태 색(success/error/caution/info) 은 의미 전달 목적에만 사용 — 단순 강조용 컬러로 쓰지 말 것.",
      "**대기/검수/검토 같은 '중립 워크플로 상태'는 neutral 로** — caution(앰버)은 *주의/경고/선착순* 의미라 '검수 대기'·'대기중'·'검토중' 같은 진행 단계에 쓰면 불필요한 경고처럼 보인다(회귀: 캐포비 '검수 대기' 를 앰버 caution 으로 표기 → '이 색 어디서 나왔나' 혼동). 진행 단계 라벨은 `color=\"neutral\"`, 경고/위험만 caution.",
      "Tone-on-Tone 금지: 연한 Blue 배경 위에 Blue Fill Badge, 연한 Mint Surface 위 Mint Badge 같은 동일 계열 중첩 금지.",
      "Badge 안에 긴 문장/CTA 보조 문구 금지 — 8자 안팎 짧은 라벨만.",
      "Chip 과 혼용 금지 — Chip 은 '선택/필터/분류 액션', Badge 는 '상태/속성 표시(비액션)'.",
      "**shape 로 동적/정적 의미 구분 (캐포비 admin · Figma 3782-20558)**: `shape=\"default\"`(라운드 사각)=거래/처리 상태·카테고리 같은 **동적 상태값**(충전·사용·적립·만료·취소), `shape=\"pill\"`(완전 둥근)=계정 유형·식별성 같은 **정적 속성 태그**(일반 계정·프리미엄·신규). 둘을 혼용하지 말 것 — 동적 상태값에 pill, 정적 식별에 사각을 쓰면 의미 신호가 깨진다. 데이터 테이블 셀에는 default 사각이 기본.",
      "**type 혼동 금지 (트로스트 5107-130)**: `dot` 은 텍스트 없는 8×8 점이라 children 을 넣어도 의미가 없다 — 텍스트가 필요하면 `label`. `count` 는 숫자 카운터 전용(min 18px 원형), 라벨 텍스트를 넣지 말 것. dot·count 의 색은 ghost 톤이 아니라 variant=fill 룰을 따른다(color 로 의미색 지정)."
    ],
    "examplesHtml": {
      "do": "<nds-badge variant=\"fill\" color=\"project\" size=\"md\">NEW</nds-badge>\n<nds-badge variant=\"ghost\" color=\"success\" size=\"sm\">완료</nds-badge>\n<!-- 캐포비 admin: 동적 상태값 = 라운드 사각(shape 기본) ghost 톤 -->\n<nds-badge variant=\"ghost\" color=\"project\" size=\"sm\">충전</nds-badge>\n<nds-badge variant=\"ghost\" color=\"info\" size=\"sm\">사용</nds-badge>\n<nds-badge variant=\"ghost\" color=\"success\" size=\"sm\">적립</nds-badge>\n<nds-badge variant=\"ghost\" color=\"neutral\" size=\"sm\">만료</nds-badge>\n<nds-badge variant=\"ghost\" color=\"error\" size=\"sm\">취소</nds-badge>\n<!-- 캐포비 admin: 정적 식별 태그 = pill -->\n<nds-badge variant=\"ghost\" color=\"neutral\" shape=\"pill\" size=\"sm\">일반 계정</nds-badge>\n<nds-badge variant=\"ghost\" color=\"project\" shape=\"pill\" size=\"sm\">프리미엄</nds-badge>\n<!-- 트로스트: type 축 — dot(8×8 점, 텍스트 없음) / count(원형 숫자 카운터) -->\n<nds-badge type=\"dot\" variant=\"fill\" color=\"error\"></nds-badge>\n<nds-badge type=\"count\" variant=\"fill\" color=\"error\">12</nds-badge>\n<nds-badge type=\"count\" variant=\"fill\" color=\"project\">99+</nds-badge>",
      "dont": "<!-- hex 인라인. 시멘틱 컬러 토큰을 잃음 -->\n<nds-badge style=\"background:#FFD400;color:#000\">NEW</nds-badge>\n<!-- 안내문/섹션 제목에 Badge 도배 — Badge 는 상태/짧은 속성용 -->\n<nds-badge color=\"project\">오늘의 미션</nds-badge>\n<!-- 동적 상태값(적립/충전/만료…)에 pill — pill 은 정적 식별 태그 전용이라 의미 신호가 깨짐 -->\n<nds-badge variant=\"ghost\" color=\"success\" shape=\"pill\">적립</nds-badge>\n<!-- count 에 라벨 텍스트 — count 는 숫자 카운터 전용 -->\n<nds-badge type=\"count\" color=\"error\">신규</nds-badge>"
    }
  },
  "Banner": {
    "name": "Banner",
    "summary": "페이지 상단 알림 띠. 그라데이션 배경 사용 금지.",
    "pitfalls": [
      "Banner의 배경에 linear-gradient 사용하지 말 것. 단색 토큰만 (semantic-info-bg 등)."
    ],
    "examplesHtml": {
      "do": "<nds-banner variant=\"filled\" banner-title=\"신규 기능 안내\"\n  description=\"이번 주부터 음성 기록을 지원해요\"\n  action-label=\"자세히\" action-href=\"/news/voice\" closable></nds-banner>",
      "dont": "<!-- variant=\"image\" 일 때 full-image-src 가 아니라 banner-src 로 잘못 명시 -->\n<nds-banner variant=\"image\" banner-src=\"/hero.jpg\" banner-title=\"…\"></nds-banner>\n<!-- description 없이 closable 만 — 닫고 나면 의도가 사라짐 -->\n<nds-banner closable></nds-banner>"
    }
  },
  "BottomNav": {
    "name": "BottomNav",
    "sizeMatrix": {
      "root": "height 56(--nds-bottomnav-height) / width 100% / 하단 fixed / border-top 1px subtle",
      "item": "flex 1 1 0 균등분할 / icon 24×24 / 라벨 11(label) / 세로 정렬(아이콘 위·라벨 아래)",
      "badge": "우상단 카운트 칩 / 16×16 min / radius pill / bg status-error / 텍스트 inverse"
    },
    "stateMatrix": {
      "item/default": "color --nds-bottomnav-inactive-color(=text subtle) · 비활성 아이콘",
      "item/active": "color --nds-bottomnav-active-color(=text normal) · 활성 아이콘(activeIcon) · aria-current=page",
      "root/shadow": "data-shadow 시 상단 그림자(콘텐츠 위에 떠 보이게)"
    },
    "summary": "모바일 앱 하단 글로벌 네비게이션(3~5탭) 전용 primitive. compound + 슬롯 — `<BottomNav activeKey onChange>` 안에 `<BottomNav.Item itemKey label icon activeIcon href badge>`. 프로젝트를 모르는 컴포넌트로, 색은 `--nds-bottomnav-*` 슬롯으로 노출되고 프로젝트 토큰이 값만 덮는다. 프로젝트별 아이콘/라벨은 호출부가 주입한다(`{Project}BottomNav` 래퍼 대체).",
    "pitfalls": [
      "`<BottomNav.Item>` 의 key prop 은 `itemKey` 다 — React 예약어 `key` 와 충돌하므로 `key` 로 활성 비교가 안 된다(목록 렌더 시 `key` 와 `itemKey` 둘 다 준다).",
      "활성/비활성 아이콘이 다른 그래픽이면 `icon`(비활성) + `activeIcon`(활성) 둘 다 준다. `activeIcon` 생략 시 같은 그래픽에 색만 cascade 로 바뀐다(단일 currentColor 아이콘용).",
      "색을 컴포넌트에 박지 말 것 — 프로젝트 활성색은 `--nds-bottomnav-active-color`, 비활성은 `--nds-bottomnav-inactive-color` 슬롯으로 프로젝트 토큰 파일이 덮는다.",
      "데스크톱/PC 화면엔 쓰지 않는다 — 하단 탭 바는 모바일 전용. PC 보조 네비는 QuickMenu, 콘텐츠 전환은 Tab.",
      "페이지 내 콘텐츠 전환(필터/세그먼트)에 쓰지 말 것 — 그건 Tab. BottomNav 는 화면 단위 라우팅 탭이다.",
      "스토리북/스크롤 컨테이너 안에서는 `position=\"static\"` 으로 — 기본 `fixed` 는 뷰포트 하단에 붙는다."
    ],
    "examplesHtml": {
      "do": "<nds-bottom-nav active-key=\"home\">\n  <nds-bottom-nav-item item-key=\"home\" label=\"홈\" href=\"/\">\n    <svg slot=\"icon\" width=\"24\" height=\"24\"><!-- 비활성 --></svg>\n    <svg slot=\"active-icon\" width=\"24\" height=\"24\"><!-- 활성 --></svg>\n  </nds-bottom-nav-item>\n  <nds-bottom-nav-item item-key=\"challenge\" label=\"챌린지\" href=\"/challenge\" badge=\"3\">\n    <svg slot=\"icon\" width=\"24\" height=\"24\"></svg>\n    <svg slot=\"active-icon\" width=\"24\" height=\"24\"></svg>\n  </nds-bottom-nav-item>\n  <nds-bottom-nav-item item-key=\"my\" label=\"내 공간\" href=\"/my\">\n    <svg slot=\"icon\" width=\"24\" height=\"24\"></svg>\n    <svg slot=\"active-icon\" width=\"24\" height=\"24\"></svg>\n  </nds-bottom-nav-item>\n</nds-bottom-nav>",
      "dont": "<!-- raw <nav> 로 모양만 흉내 — 토큰/active 동작/색 격리 없음 -->\n<nav style=\"position:fixed;bottom:0;display:flex\">\n  <a style=\"color:#00A8AC\">홈</a>\n  <a style=\"color:#999\">챌린지</a>\n</nav>"
    }
  },
  "BottomSheet": {
    "name": "BottomSheet",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5258-128",
    "sizeMatrix": {
      "radius (base)": "var(--nds-bottom-sheet-radius, radius[12] = 12) — 상단 좌우만",
      "radius (Trost)": "20 (프로젝트 토큰이 --nds-bottom-sheet-radius:20px emit)",
      "handleWidth (base)": "var(--nds-bottom-sheet-handle-width, 36) × 4 height",
      "handleWidth (Trost)": "40 (프로젝트 토큰이 --nds-bottom-sheet-handle-width:40px emit)",
      "handleColor": "cv.borderRole.normal (프로젝트 불변)",
      "shadow": "var(--nds-bottom-sheet-shadow, 0 -4px 12px rgba(0,0,0,.1)) — 위 방향, default 불변",
      "backdrop": "var(--nds-bottom-sheet-backdrop, rgba(0,0,0,.5)) — default 불변",
      "maxWidth": "var(--nds-bottom-sheet-max-width, 664)",
      "maxHeight": "var(--nds-bottom-sheet-max-height, 85vh)",
      "safeArea": "footer/마지막 body 에 env(safe-area-inset-bottom) 가산 (iOS 홈 인디케이터)"
    },
    "summary": "모바일에서 화면 하단에서 올라오는 시트. 옵션 선택 / 짧은 작업에 적합. 데스크탑에선 Drawer 가 자연스러움. 공유 시트는 이 컴포넌트로 4칸 그리드 + 링크 복사 레시피로 조립한다. 시각 토큰은 --nds-bottom-sheet-* 슬롯(radius·handle-width·shadow·backdrop)으로 노출돼 프로젝트 토큰이 값만 덮는다 — Trost 는 radius 20·handle 40 을 emit(컴포넌트는 프로젝트를 모름, base 는 12/36 불변). Share/Info/List 는 별도 prop·variant 가 아니라 BottomSheet 본체 + DS 토큰으로 조립하는 컴포지션 레시피다.",
    "pitfalls": [
      "BottomSheet 안에 깊은 nested form / 멀티 탭 — 사용자가 컨텍스트를 잃음. 별도 화면 또는 Modal 사용.",
      "공유 기능은 별도 ShareSheet 컴포넌트보다 BottomSheet + 버튼 그리드 + 링크 복사 레시피로 조립.",
      "open 상태에서 뒤 페이지 scroll 잠그지 않으면 body scroll 충돌.",
      "트리거 버튼 없이 자동 open — 사용자 의도 없는 시트는 다크 패턴.",
      "Share/Info/List 를 위해 variant prop 을 찾지 말 것 — 존재하지 않는다. 아래 recommended 의 레시피를 토큰으로 조립한다.",
      "색은 raw hex 로 박지 말고 Point 토큰을 쓴다. 단 카카오(#FEE500)·네이버(#03C75A) 같은 SNS 브랜드 컬러는 그들 고유색이라 raw 유지(DS 토큰 아님)."
    ],
    "recommended": [
      "Share 레시피 — title=\"공유하기\" + 4칸(repeat(4,1fr)) 아이콘 그리드 + 하단 링크 복사 행. 원형 통화/콜 CTA 는 40×40 background cv.surface.pointSubtle + 아이콘 cv.iconRole.point. SNS 버튼 배경만 프로젝트 raw(kakao #FEE500 / naver #03C75A).",
      "Info 레시피 — title + body 안에 강조 박스(background cv.surface.pointSurface)로 핵심 안내를 띄우고, 푸터에 단일 확인 CTA. 강조 박스 텍스트는 cv.textRole.point / pointStrong.",
      "List 레시피 — title=\"…선택\" closable + body 에 세로 옵션 리스트(각 행은 구분선 borderRole.subtle, 선택 행은 cv.textRole.point + weight 600). 단일/단답 선택에 사용, 다중 선택·복잡 폼은 Modal.",
      "Primary CTA(레시피 공통) — 푸터 주 버튼은 background cv.surface.point · text cv.textRole.inverse · radius 8. Button 컴포넌트를 그대로 쓰면 프로젝트 토큰이 알아서 따라온다.",
      "Trost 정합 — radius 20 / handle 40 은 프로젝트 토큰(--nds-bottom-sheet-radius·--nds-bottom-sheet-handle-width)이 자동 emit. 컴포넌트/스토리에서 값을 하드코딩하지 말 것.",
      "안전영역 — 푸터(또는 푸터 없을 때 마지막 body)는 env(safe-area-inset-bottom) 가 자동 가산돼 iOS 홈 인디케이터와 겹치지 않는다. 추가 padding 불필요."
    ],
    "examplesHtml": {
      "do": "<nds-bottom-sheet open sheet-title=\"옵션 선택\">\n  <div slot=\"body\">옵션 본문…</div>\n  <div slot=\"footer\"><nds-button color=\"primary\">확인</nds-button></div>\n</nds-bottom-sheet>\n<script>el.addEventListener(\"nds-bottom-sheet-close\", () => el.removeAttribute(\"open\"));</script>",
      "dont": "<!-- nds-bottom-sheet-close 미처리 — overlay/ESC 가 닫지 못함 -->\n<nds-bottom-sheet open sheet-title=\"선택\"></nds-bottom-sheet>"
    }
  },
  "Breadcrumb": {
    "name": "Breadcrumb",
    "summary": "현재 화면이 정보 계층 어디에 있는지 보여주는 경로. 3 depth 이상의 카탈로그 / 설정 / CMS 페이지에서 의미 있음.",
    "pitfalls": [
      "1-2 depth 페이지에 Breadcrumb 강제 표기 — 화면 위에 차지하는 노이즈 대비 정보가 적음.",
      "마지막 segment 를 링크로 만들지 말 것 (현재 위치). active=true 표시.",
      "separator 를 이모지나 텍스트 기호(→ / >)로 인라인 입력 금지 — separator attribute 또는 토큰 사용."
    ],
    "examplesHtml": {
      "do": "<nds-breadcrumb items='[{\"label\":\"홈\",\"href\":\"/\"},{\"label\":\"상담\",\"href\":\"/counseling\"},{\"label\":\"신청 내역\",\"active\":true}]'></nds-breadcrumb>",
      "dont": "<!-- 마지막 segment 가 링크로 — 사용자가 자기 자신을 다시 클릭 -->\n<nds-breadcrumb items='[{\"label\":\"홈\",\"href\":\"/\"},{\"label\":\"현재 화면\",\"href\":\"/now\"}]'></nds-breadcrumb>"
    }
  },
  "Button": {
    "name": "Button",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8385",
    "references": [
      {
        "label": "Trost Button Guide — 4 styles (Primary / Yellow / Secondary / Outlined)",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5043-108",
        "caption": "트로스트 Library · ButtonGuide. 4스타일을 DS 3축(color×variant)으로 매핑 — Primary(검정 #1A1A1A)=color=\"neutral\" variant=\"solid\", Yellow(노랑 #FFF42E, Positive/구독/확인)=color=\"primary\" variant=\"solid\", Secondary(옅은 블루 bg #EDF0FF / text #4968FF Point)=color=\"secondary\" variant=\"solid\", Outlined(흰+gray border / text #333, 취소·닫기)=color=\"neutral\" variant=\"outlined\". 사이즈 Large=lg(48)/Medium=md(44)/Small=sm(40 트로스트 override)/Bottom CTA=lg fullWidth shape=\"pill\"(전용 56 사이즈 없음, 풀너비 lg 근사). disabled bg #D8D8D8. 본문 ## trostStyleMapping 표 참조.",
        "project": "trost"
      },
      {
        "label": "Runmile Button Guide — Solid / Soft / Outlined × Primary / Neutral (어드민 기준)",
        "url": "https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/?node-id=5124-390",
        "caption": "런마일 Library · ButtonGuide. tone = Primary / Neutral 둘뿐(Secondary 없음 — 검정 솔리드는 Neutral). Solid/Primary(주황)=color=\"primary\" variant=\"solid\", Solid/Neutral(검정 #221E1F + 흰 텍스트)=color=\"neutral\" variant=\"solid\", Soft/Neutral(회색 옅은 #F2F4F6 + 어두운 텍스트)=color=\"neutral\" variant=\"soft\", Outlined/Primary(주황 라인)=color=\"primary\" variant=\"outlined\", Outlined/Neutral(gray 라인 + gray800)=color=\"neutral\" variant=\"outlined\". 5 사이즈 Mini=mini(40)/S=sm(44)/M=md(48)/L=lg(52)/XL=xl(56). 본문 ## runmileStyleMapping 표 참조.",
        "project": "runmile"
      }
    ],
    "usagePolicy": {
      "useFor": [
        "화면의 대표 CTA, 명확한 실행 액션, 중요한 폼 제출",
        "ArrowNext/ChevronRight 아이콘은 다음 단계로 이동하는 대표 CTA 1개"
      ],
      "doNotUseFor": [
        "반복 카드마다 붙는 장식성 화살표 CTA",
        "동일 위계 CTA 여러 개에 모두 우측 화살표 아이콘 부착",
        "단순 보조 이동/자세히 보기 링크에 습관적으로 화살표 사용"
      ],
      "limits": {
        "primarySolidPerScreen": 1,
        "arrowIconButtonPerViewport": 1,
        "repeatedListArrowButton": "avoid"
      }
    },
    "colorMatrix": {
      "primary/solid": "var(--semantic-bg-brand-default) 배경 + var(--semantic-text-inverse-default) 텍스트 — 가장 중요한 CTA",
      "primary/outlined": "흰 배경 + var(--semantic-border-brand-default) 보더/텍스트 — 밝은 배경 위 보조 액션",
      "primary/soft": "surface.brandSubtle 배경 + textRole.brand 텍스트 — 3차 액션 (Figma 라이브러리엔 별도 셀 없음). 색 값은 packages/tokens/src/projects/<project>.semantic.ts 토큰 SSOT 참조.",
      "secondary/solid": "var(--semantic-bg-brand-subtle) 배경 + var(--semantic-text-brand-default) 텍스트 — 카드/배경 위 강조 (default), hover=var(--semantic-fill-brand-hover)",
      "neutral/outlined": "흰 배경 + #D8D8D8 보더 + #383838 medium weight 텍스트 — 중립 액션. Figma는 M/S/XS 만 지원, disabled 없음",
      "error/solid": "error fill + 흰 텍스트 — 파괴 액션 한정"
    },
    "sizeMatrix": {
      "xl": "height 52 / px 16 / py 14 / 16·24 bold / icon 20 / gap 8",
      "lg": "height 48 / px 16 / py 12 / 16·24 bold / icon 20 / gap 8",
      "md": "height 44 / px 24 / py 11 / 15·22 bold / icon 20 / gap 8",
      "sm": "height 42 / px 16 / py 11 / 14·20 bold / icon 20 / gap 8",
      "xs": "height 38 / px 16 / py 10 / 13·18 bold / icon 18 / gap 6"
    },
    "stateMatrix": {
      "primary/solid/disabled": "bg #9CA2AE cool-gray + 흰 텍스트.",
      "secondary/solid/disabled": "bg #E6E7EB + 텍스트 #9CA2AE.",
      "outlined_disabled": "흰 배경 + 보더 #9CA2AE + 텍스트 #9CA2AE.",
      "hover": "primary=var(--semantic-fill-brand-hover) / secondary=var(--semantic-bg-brand-subtle) / outlined/neutral=var(--semantic-bg-surface-subtle)"
    },
    "matrixOverrides": {
      "runmile": {
        "sizeMatrix": {
          "xl": "height 56 (base 52 → 56) / px 16 / 16·24 bold / icon 20 / gap 8",
          "lg": "height 52 (base 48 → 52) / px 16 / 16·24 bold / icon 20 / gap 8",
          "md": "height 48 (base 44 → 48) / px 24 / 15·22 bold / icon 20 / gap 8",
          "sm": "height 44 (base 42 → 44) / px 16 / 14·20 bold / icon 20 / gap 8",
          "mini": "height 40 (base 32 → 40) / px 12 / 13·18 bold / icon 16 / gap 4"
        },
        "dimensions": {
          "tone": "Primary / Neutral 둘뿐 (Secondary 없음). 검정 솔리드 = color=neutral variant=solid (#221E1F + 흰 텍스트). 회색 옅은 보조 = color=neutral variant=soft. color=secondary 는 dev 경고 + validator project-denied-button-color 가 잡음.",
          "sizes": "5 size — Mini 40 / S 44 / M 48 / L 52 / XL 56 (XS·field 는 base 유지)."
        }
      },
      "cashwalk-biz": {
        "sizeMatrix": {
          "sm": "height 40 (base 42 → 40) / 그 외 px/py/typography 는 base 동일",
          "xs": "height 36 (base 38 → 36) / 그 외 px/py/typography 는 base 동일"
        },
        "stateMatrix": {
          "primary/solid/disabled": "bg #DDDDDD (atomic Neutral/400) + text #FFFFFF (Figma 3098:1079).",
          "secondary/solid/disabled": "bg #DDDDDD + text #FFFFFF — Solid/Primary disabled 와 같은 페어.",
          "outlined_disabled": "흰 배경 + 보더 #E7E7E7 + 텍스트 #BBB."
        },
        "dimensions": {
          "shape": "default(radius 8 — 일반 admin 액션) · pill(radius full — 모달 확인/취소, BottomCTA, 격식 컨텍스트). 5종 스타일 × 2 shape × 5 size = 50 cell (Figma ButtonGuide SSOT).",
          "relatedComponents": "TextButton(Large 38 / Medium 32), IconButton(48/44/40/32) — 별도 컴포넌트 가이드."
        }
      }
    },
    "summary": "1차/2차 CTA. color × variant × size 매트릭스로 톤 결정 (Figma Library node 171:8385 기준).\n\n### 트로스트 스타일 → DS color × variant 매핑 (Figma 5043:108)\n\n트로스트 ButtonGuide 는 **4스타일**로 정의돼 있지만, DS Button 은 `color={primary,secondary,neutral} × variant{solid,soft,outlined}` 3축이다. 트로스트 스타일을 그대로 박지 말고 아래 매핑으로 옮긴다 — 색은 트로스트 project 토큰이 슬롯에 흘려주므로 `data-project=\"trost\"` 컨텍스트만 있으면 된다(색 하드코딩 금지).\n\n| 트로스트 스타일 | 용도 | DS props | 색 (트로스트 토큰) |\n| --- | --- | --- | --- |\n| **Primary** | 메인 CTA · 한 화면 1개 | `color=\"neutral\" variant=\"solid\"` | 검정 #1A1A1A (buttonBg.neutral 신설) + 흰 텍스트 |\n| **Yellow** | Positive · 구독 · 확인 | `color=\"primary\" variant=\"solid\"` | 노랑 #FFF42E (트로스트 project) |\n| **Secondary** | 보조 액션 | `color=\"secondary\" variant=\"solid\"` | bg #EDF0FF / text #4968FF (Point) |\n| **Outlined** | 취소 · 닫기 | `color=\"neutral\" variant=\"outlined\"` | 흰 배경 + gray border / text #333 |\n\n**사이즈**: Large=`size=\"lg\"`(48) / Medium=`size=\"md\"`(44) / Small=`size=\"sm\"`(40 — 트로스트 override, base sm 42 → 40) / **Bottom CTA = `size=\"lg\" fullWidth shape=\"pill\"`**. 트로스트 Bottom CTA 의 56px 전용 사이즈는 두지 않기로 결정 — 풀너비 lg(48)로 근사한다. disabled 배경은 #D8D8D8.\n\n**주의** — 트로스트 \"Primary\"(검정)는 DS `color=\"primary\"`(=노랑)가 **아니다**. Primary=`color=\"neutral\" variant=\"solid\"`, Yellow 가 `color=\"primary\"` 다. 직관과 반대이므로 매핑 표를 그대로 따를 것. DO: 한 화면에 Primary(검정) 1개 / 확인·취소는 Primary + Outlined 페어. DON'T: Primary 검정 버튼 2개 이상, 서로 다른 사이즈 가로 병치, 한 줄 넘는 긴 라벨.\n\n### 런마일 스타일 → DS color × variant 매핑 (Figma 5124:390)\n\n런마일 ButtonGuide 는 **3스타일(Solid / Soft / Outlined) × 2시멘틱(Primary / Neutral)** 로 정의 — **Secondary tone 없음**. 색은 런마일 project 토큰이 슬롯에 흘려주므로 `data-project=\"runmile\"` 컨텍스트만 있으면 된다(색 하드코딩 금지).\n\n| 런마일 스타일 | 용도 | DS props | 색 (런마일 토큰) |\n| --- | --- | --- | --- |\n| **Solid/Primary** | 메인 CTA · 한 화면 1개 | `color=\"primary\" variant=\"solid\"` | 주황 #FF5B37 + 흰 텍스트 (hover #FF805C) |\n| **Solid/Neutral** | 검정 솔리드 · 강한 위계 | `color=\"neutral\" variant=\"solid\"` | 검정 #221E1F + 흰 텍스트 (hover gray900) |\n| **Soft/Neutral** | 회색 옅은 BG · 가벼운 보조 | `color=\"neutral\" variant=\"soft\"` | gray200 #F2F4F6 + 어두운 텍스트 |\n| **Outlined/Primary** | 밝은 배경 위 보조 | `color=\"primary\" variant=\"outlined\"` | 흰 + 주황 보더/텍스트 |\n| **Outlined/Neutral** | 취소 · 닫기 | `color=\"neutral\" variant=\"outlined\"` | 흰 + gray400 보더 + gray800 텍스트 |\n\n**사이즈** (5종): Mini=`size=\"mini\"`(40) / S=`size=\"sm\"`(44) / M=`size=\"md\"`(48) / L=`size=\"lg\"`(52) / XL=`size=\"xl\"`(56). base 와 다른 런마일 project 높이 override(`components.button.height*`). 라벨 길이 가이드: Mini 4자 / S 8자 / M 12자 이하.\n\n**주의** — 런마일은 **Secondary tone 이 없다**. 검정 솔리드를 \"Secondary\"로 부르지 말 것 — `color=\"neutral\" variant=\"solid\"` 이 검정 CTA 다(캐포비와 동일 정책). `color=\"secondary\"` 사용 시 dev console 경고 + validator `project-denied-button-color` 가 잡는다. 또 \"Solid Assistive\"(검정을 약한 보조로) 패턴 금지 — 가벼운 보조는 `variant=\"soft\"`(회색)로.",
    "pitfalls": [
      "**라벨을 JS 로 갈아끼우지 말 것 (HTML 한정 함정)** — `nds-button` 은 실제 `<button>` 을 light DOM 에 렌더하므로 `el.textContent = '...'` / `el.innerHTML = '...'` 로 라벨을 바꾸면 컴포넌트가 렌더한 `<button>` 이 통째로 지워지고, host(display:contents)에 맨 텍스트만 남아 스타일·포인터(cursor)·클릭 동작이 전부 사라진다(회귀: 위저드 하단 '다음 단계'→'심사 신청' 라벨 교체로 버튼이 무스타일 텍스트가 됨). 단계별로 라벨이 달라야 하면 (1) 라벨 고정 nds-button 을 단계 수만큼 두고 show/hide 로 전환하거나 (2) host 자체를 새 nds-button 으로 교체하라. **라벨 텍스트만 노드 변이(textContent/innerHTML) 금지.**",
      "**HTML 한정** — `nds-button` 은 `leftIcon`/`rightIcon` slot **미구현** (nds-button.ts L20-21). `<nds-button><span slot='leftIcon'>...</span>텍스트</nds-button>` 패턴 금지 (slot 은 무시되고 span 이 children 으로 흘러 들어감). 아이콘이 필요하면 children 안에 SVG 와 텍스트를 직접 나열: `<nds-button><svg>...</svg>텍스트</nds-button>`. **아이콘↔텍스트 간격은 컴포넌트가 `.nds-button__label` 의 gap 으로 자동 적용**하므로 margin-right/padding 으로 직접 띄우지 말 것. JS 로 빈 span 에 innerHTML 인젝션 우회 절대 금지.",
      "**React 한정** — `<Button leftIcon={<svg/>}>...</Button>` / `rightIcon={<svg/>}` 사용. 빈 React Element 를 넘기고 ref 로 innerHTML 박는 패턴 금지.",
      "color='neutral' + variant='solid' 은 **project 별로 다름** — base/NudgeEAP·Trost·Geniet 은 cool-gray/light-gray fill 이라 disabled 처럼 보여 비권장(validator neutral-solid-cta 경고). **단 캐포비(cashwalk-biz)·런마일(runmile)은 neutral solid = 검정 CTA(Figma Neutral tone)로 정당** — 두 프로젝트는 `cta.blackCta=\"neutral\"` 선언으로 면제(글자는 fill 명도 대비 자동: 검정 fill→흰글자, 캐포비 #111 / 런마일 #221E1F).",
      "**캐포비(cashwalk-biz)·런마일(runmile)은 Secondary tone 이 없음** — Figma ButtonGuide tone = Primary + Neutral 둘뿐(캐포비 3098:1032 · 런마일 5124:390). 검정/회색 CTA 는 반드시 `color=\"neutral\"` (solid=검정 / soft=회색 / outlined=라인). `color=\"secondary\"` 사용 시 dev console 경고 + validator `project-denied-button-color` 가 잡음. (secondary 는 다른 프로젝트 전용 tone)",
      "Geniet 프로젝트에서 variant='soft' 는 Figma 가이드(207:1853)에 없는 변형. 사용 시 dev console 에 경고가 나오며 디자인 인텐트가 어긋남 — Geniet 은 solid / outlined 만 사용.",
      "Geniet Solid/Secondary 는 옅은 mint subtle(#F2FAFA) 배경 + project mint(#00A8AC) 텍스트 — 다른 프로젝트 soft secondary 와 동일 패턴. (구버전의 #333 dark-inverse 패턴은 폐기됨.)",
      "primary 색은 화면당 가장 중요한 1개 액션에만 사용. 한 화면에 두 개 이상 primary 솔리드 = 위계 붕괴.",
      "다른 페이지로 이동하는 CTA라고 해서 모든 Button에 화살표 아이콘을 붙이지 말 것. ArrowNext/ChevronRight 류 아이콘은 대표 전진 액션 1개에만 사용.",
      "카드 리스트/섹션 리스트에서 반복되는 '자세히 보기 →' 버튼은 시각 소음이 큼. 반복 CTA는 아이콘 없이 텍스트만 쓰거나 카드 전체 클릭 패턴을 검토.",
      "Solid/Secondary 는 옅은 파랑 배경(#F1F8FD) + primary 텍스트로 그려진다. 'magenta'를 기대하면 안 됨.",
      "Outlined/Neutral 는 medium weight + 회색 보더. Outlined/Primary 와 weight·border 모두 다르므로 'color=neutral variant=outlined' 와 'color=primary variant=outlined' 를 임의로 바꿔치기하지 말 것.",
      "**아이콘 색 하드코딩 금지** — `<LockIcon color=\"var(--semantic-icon-inverse-default)\" />` 처럼 inverse/project 토큰을 박지 말 것. NudgeEAP/Trost(primary=흰 텍스트) 에서는 맞아 보이지만, 캐시워크 포 비즈니스(primary=검정 텍스트 on 노랑) 에서는 흰 아이콘이 노란 배경 위에 떠 보임. 항상 `color=\"currentColor\"` 로 두어 Button 텍스트 색을 상속하게 한다.",
      "**shape='pill' 은 radius 만 바꿈** — color/variant/size 매트릭스와 직교. shape 만 다른 두 버튼을 한 화면에 섞으면 위계 혼란 — 컨텍스트별로 통일. project 별 shape 사용 패턴은 get_guide({ topic:'component:Button', project:'<slug>' }).preferredPatterns 참조.",
      "**풀폭(가로 FILL)은 `full-width` 속성 — CSS 클래스가 아니다.** `class=\"full\"` 같은 임의 클래스나 host(`<nds-button>`, display:contents)에 건 `style=\"width:100%\"` 는 안 먹는다(내부 `<button>` 까지 안 닿음). HTML=`<nds-button full-width>`, React=`<Button fullWidth>`. 온보딩/폼 Primary CTA 가 작게 hug 로 남던 회귀의 원인. **단 모달 푸터는 예외** — 캐포비 단일 버튼은 우측 hug pill 이라 full-width 금지(Modal 가이드 SSOT).",
      "**라벨 1줄 강제 — 두 줄 줄바꿈 금지** (전 프로젝트 공통 룰). 라벨이 컨테이너 폭 부족으로 wrap 되면 버튼 높이가 깨지고 좌우 정렬·아이콘 베이스라인이 어긋남. 대응: (1) 라벨을 짧은 동사구로 (2) IconButton 또는 dropdown 으로 분리 (3) 컨테이너 width/grid 재설계. 절대 `white-space: normal` 로 강제 wrap 시키지 말 것 — DS 의 `white-space: nowrap` 이 의도된 가드. 텍스트가 길 수밖에 없으면 size 를 줄이지 말고 단어를 줄여라."
    ],
    "recommended": [
      "1차 CTA: color='primary', variant='solid'",
      "보조 액션 (밝은 배경 위): color='primary', variant='outlined'",
      "보조 액션 (파란 카드 위 등): color='secondary', variant='solid' — 옅은 파랑 배경",
      "중립 액션(취소/뒤로): color='neutral', variant='outlined'",
      "파괴 액션: color='error', variant='solid'",
      "회색 인상을 주려고 neutral/solid 를 쓰지 말 것 — disabled prop 이 정공법"
    ],
    "accessibility": [
      "터치 타겟 최소 44px — md(44)/lg(48)/xl(52) 권장. xs(38)/sm(42)는 보조 행에서만.",
      "Figma 의 'Hover / Focused' 셀은 한 상태로 합쳐져 있지만 코드에서는 :focus-visible 도 동일 hover 톤으로 노출됨 — 키보드 포커스링이 사라지지 않게 customizing 시 outline 토큰 유지.",
      "disabled 버튼에도 aria-disabled 가 자동 부착되도록 disabled prop 사용 (raw <button> 대체 금지)."
    ],
    "interactivePattern": "버튼은 onClick 핸들러를 항상 부착. 목업에서도 라우팅 시뮬(toast/console.log)이라도 넣을 것.",
    "examples": {
      "do": "<Button color=\"primary\" variant=\"solid\" rightIcon={<ArrowNextIcon />}>상담 신청하기</Button>\n<Button color=\"primary\" variant=\"outlined\">검사 시작하기</Button>\n<Button color=\"neutral\" variant=\"outlined\">자세히 보기</Button>",
      "dont": "<Button rightIcon={<ArrowNextIcon />}>상담 신청하기</Button>\n<Button rightIcon={<ArrowNextIcon />}>검사 시작하기</Button>\n<Button rightIcon={<ArrowNextIcon />}>자세히 보기</Button>"
    },
    "examplesHtml": {
      "do": "<nds-button color=\"primary\" variant=\"solid\">상담 신청하기</nds-button>\n<nds-button color=\"primary\" variant=\"outlined\">검사 시작하기</nds-button>\n<nds-button color=\"neutral\" variant=\"outlined\">자세히 보기</nds-button>",
      "dont": "<!-- raw <button> + className 흉내. nds-button 룰/토큰이 전혀 적용 안 됨 -->\n<button class=\"nds-button\" onclick=\"handle()\">상담 신청하기</button>\n<!-- 캐포비는 secondary tone 없음 — 검정/회색 CTA 는 color=\"neutral\" 사용 -->\n<nds-button color=\"secondary\" variant=\"solid\">저장</nds-button>"
    }
  },
  "Calendar": {
    "name": "Calendar",
    "summary": "인라인 월간 캘린더 그리드. DatePicker(popover 입력)와 다르게 화면에 펼쳐져 있는 콘텐츠형 캘린더.",
    "pitfalls": [
      "폼 안에서 날짜 한 개 입력받는 용도면 DatePicker를 쓸 것. Calendar는 캘린더 자체가 콘텐츠인 화면용.",
      "value/onChange는 ISO 문자열(YYYY-MM-DD). Date 객체로 비교하지 말 것 — 시간대 이슈 발생.",
      "markers는 dot만 표시. 라벨/시간 등 풍부한 정보가 필요하면 캘린더 아래에 별도 List/Card로 표현.",
      "month prop을 주면 controlled로 동작하고 onMonthChange로만 월이 바뀜. 안 주면 내부 state."
    ],
    "recommended": [
      "예약 화면: isDateDisabled로 과거/예약 불가 날짜 차단",
      "감정 캘린더: markers에 색상으로 mood 단계 매핑",
      "복약 캘린더: markers + 클릭 시 BottomSheet로 상세"
    ],
    "interactivePattern": "onChange(iso)로 선택을 받고, 외부에서 그 날짜에 해당하는 List/Card를 갱신. weekStartsOn=1로 월요일 시작도 가능.",
    "examplesHtml": {
      "do": "<nds-calendar value=\"2026-05-25\" markers='[{\"date\":\"2026-05-25\",\"color\":\"red\"}]'></nds-calendar>\n<script>el.addEventListener(\"nds-calendar-change\", e => setDate(e.detail.value));</script>",
      "dont": "<!-- month / value 형식 위반 (YYYY-MM, YYYY-MM-DD 필수) -->\n<nds-calendar value=\"2026/5/25\"></nds-calendar>"
    }
  },
  "Card": {
    "name": "Card",
    "figmaNodeUrl": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=131-1769",
    "references": [
      {
        "label": "Geniet Card Guide — 4 Layouts (배치·크기)",
        "url": "https://www.figma.com/design/0LLw2nSq9AUhXww7pWFRlm/?node-id=3056-125",
        "caption": "지니어트 Library · CardGuide. 배치/크기/radius 축의 Horizontal(328·r8) / Vertical(240×280·r12) / Grid(160×210·r8) / Container(440·r16+shadow, PC) 4 Layout. 콘텐츠 축(List/Thumb/Cover)과 직교 — 같이 읽는다. radius 스케일은 base sizeMatrix(8/10/12/14)와 다른 지니어트 단순화본(8/12/8/16).",
        "project": "geniet"
      },
      {
        "label": "Trost Card Guide — Container card (platform · elevation · header)",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5123-136",
        "caption": "트로스트 Container card. platform(pc=padding28·r16·title20·subtitle14 / mobile=padding20·r14·title17·subtitle13) + elevation(outline=보더 / elevated=shadow E2 + 보더 제거) + 헤더 행(리딩 아이콘 24px + 10px gap + title/subtitle 정보 컬럼, gap 2px) + 헤더↔본문 divider. point(코발트) 액센트 아이콘. 컴포넌트는 opt-in(platform/elevation/icon/showDivider) — 미지정 시 현행 렌더 그대로.",
        "project": "trost"
      },
      {
        "label": "Runmile Card Guide — 이벤트 카드 (앱 레벨 composition)",
        "url": "https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/?node-id=5117-130",
        "caption": "런마일 CardGuide. 표준 이벤트 카드(세로형 PC 280×432 / MO 159×343) = DS 프리미티브 composition (새 variant 아님). 썸네일(bg gray200 · radius 12 · 1:1 정사각) → 타이틀(18/15 Bold #221E1F · 2줄) → 메타 칩(=Badge · radius 4 · 12 Bold) → 날짜(calendar icon + 14/12 Medium gray800) · 주최(gray600) → 태그 칩(=Chip · 13 Medium gray900 · 흰 bg gray300 보더 · 최대 3). 3 ComponentSet: 표준 Card(5115:126) · competition card(5067:1828 가로형 622×138/296×138) · heart(5067:1819 좋아요 토글). 본문 ## runmile 섹션 참조.",
        "project": "runmile"
      }
    ],
    "usagePolicy": {
      "useFor": [
        "분류된 식품·콘텐츠 텍스트 나열 (List · 10개 이상 / 페이지)",
        "썸네일 + 보조 정보로 식별하는 식품/카테고리 카드 (Thumb)",
        "큰 이미지가 주인공인 식단/커뮤니티 4-up·2-up 그리드 (Cover)",
        "도메인 카드 (헬시딜 / 음식 검색 / 음식 리뷰 등) — Base variant + Composition 슬롯",
        "개별 오브젝트 선택·비교 (상담사 선택, 상품)"
      ],
      "doNotUseFor": [
        "단일 메시지 / 1회성 프로모션 → Banner",
        "텍스트+날짜+상태만의 단순 데이터 (상담 내역·예약·알림) → List Row",
        "컬럼별 비교가 핵심인 데이터 → Table",
        "시간순 연속 정보 (알림·채팅) → Feed / List",
        "탭·필터·내비게이션 역할 → Chip / Navigation",
        "주의/경고/안내 메시지 + bullet list + expand/collapse (예: '⚠ 섭취 주의사항') → Notice / Banner (caution tone) — Project soft bg + caution icon + expand/collapse 패턴은 Card 가 아님",
        "관련 row 묶음을 외곽 보더로 포장한 컨테이너 (예: '루테인 포함 영양제 · 총 84개 제품') → Card 가 아니라 Section Card 별도 패턴 `get_guide({ topic: 'pattern:card-section' })`",
        "장식용 — 동일 형식 반복이 아니면 Card 가 아님"
      ],
      "limits": {
        "variantUsageList": "사용 시점: 이미지 없이 텍스트와 메타데이터로 짧게 나열할 때 (분류별 식품 리스트). 트리거: 한 페이지에 10개 이상 노출될 때.",
        "variantUsageThumb": "사용 시점: 썸네일과 보조 정보를 함께 보여줘야 할 때 (식품 카드, 영양 코칭 가로형). 트리거: 콘텐츠 식별이 텍스트만으로 부족할 때.",
        "variantUsageCover": "사용 시점: 큰 이미지가 콘텐츠의 핵심일 때 (식단 사진 4-up 그리드, 커뮤니티 콘텐츠). 트리거: 그리드 형태로 시각적 임팩트가 필요할 때.",
        "titleRequired": 1,
        "variantsPerScreen": "1-2종",
        "variantsPerGrid": 1,
        "maxAvatarPerCard": 1,
        "maxBadgePerCard": 2,
        "maxStatusBadgePerCard": 1,
        "maxDescriptionLines": 3,
        "maxCoverDescriptionLines": 2,
        "maxMetadataItems": 2,
        "maxCtaButtonsInsideCard": 0,
        "maxNutritionTagsInComposition": 3,
        "radiusPerList": 1
      }
    },
    "sizeMatrix": {
      "anatomy.media": "썸네일 또는 커버 이미지. Thumb=정사각, Cover=4:3(PC)/1:1(Mobile). 단색 폴백 허용.",
      "anatomy.title": "카드 식별 핵심 라벨. 최대 2줄 + ellipsis. Body 2 ~ H4 / Bold.",
      "anatomy.meta": "수치·시간·단위 등 보조 정보. 1줄, ' · ' 구분자. Caption / Regular.",
      "anatomy.status": "상태 Badge. Success / Caution / Error 중 1개만.",
      "anatomy.action": "탭/이동 트리거. 카드 전체 클릭이 기본. 내부 CTA 버튼 사용하지 않음.",
      "anatomy.composition": "(optional) 도메인 카드가 Base 위에 얹는 슬롯 — kcal chip · star rating · promotion badge · nutrition tag row.",
      "mobile.list": "Width Fill · Padding 16/12 · Image — · Radius 8 · Title Body 3 Bold",
      "mobile.thumb": "Width Fill · Padding 16/12 · Image 56×56 · Radius 10 · Title Body 3 Bold",
      "mobile.cover": "Width Fill · Padding 16/12 · Image AR 1:1 · Radius 12 · Title Body 2 Bold",
      "pc.list": "Width Fill · Padding 20/16 · Image — · Radius 10 · Title Body 2 Bold",
      "pc.thumb": "Width Fill · Padding 24/20 · Image 72×72 · Radius 12 · Title Body 2 Bold",
      "pc.cover": "Width Fill · Padding 0/16 · Image AR 4:3 · Radius 14 · Title H4 Bold",
      "geniLayoutHorizontal": "지니어트 배치형(Geniet Library) — 328×auto · radius 8 · padding 12 · 좌측 썸네일 행 카드. 음식 리스트·검색결과(Mobile). ≈ Thumb variant.",
      "geniLayoutVertical": "지니어트 배치형 — 240×280 · radius 12 · padding 0/12 · 상단 이미지 세로 카드. 추천·인기 카테고리 가로스크롤(Mobile). ≈ Cover variant.",
      "geniLayoutGrid": "지니어트 배치형 — 160×210 · radius 8 · padding 0/4 · 작은 그리드 카드. 카테고리 2·3열(Mobile). ≈ 작은 Cover.",
      "geniLayoutContainer": "지니어트 배치형 — 440×auto · radius 16 · padding 24 · shadow(E2) · PC 큰 카드(메인 콘텐츠·모달·Hero). Mobile=border / PC Container=shadow.",
      "geniLayoutNote": "위 4 Layout 은 '배치·크기·radius' 축으로 콘텐츠 축(List/Thumb/Cover)과 직교 — 함께 읽는다(Horizontal≈Thumb · Vertical/Grid≈Cover · Container=PC 큰 카드). radius 8/12/8/16 은 지니어트 Library 단순화본이라 base sizeMatrix(mobile 8/10/12 · pc 10/12/14)와 다름 — 한 스케일로 통일할지는 결정 필요.",
      "trostPlatformPc": "트로스트 Container card (platform='pc') — padding 28 · radius 16(radius[16]) · title 20(Headline 4) · subtitle 14(Body 3). PC 메인/모달 큰 카드.",
      "trostPlatformMobile": "트로스트 Container card (platform='mobile') — padding 20 · radius 14 · title 17 · subtitle 13(Caption 1). 모바일 화면.",
      "trostElevation": "트로스트 elevation — outline=현행(보더 1px, shadow 없음, 기본값) / elevated=box-shadow E2(shadow.e2) + 보더 제거. 한 화면 한 elevation 유지.",
      "trostHeaderRow": "트로스트 헤더 행 — 리딩 아이콘(24px, point/코발트 액센트) + 10px gap + 정보 컬럼(title 위 subtitle, gap 2px). icon prop 지정 시 활성. showHeader 로 아이콘 없이 컬럼만 묶기도 가능.",
      "trostBodyDivider": "트로스트 헤더/텍스트 ↔ 본문(children) 사이 hairline — showDivider prop. cta/footerText 위 divider(divider prop) 와 별개. 둘 다 1px cv.borderRole.subtle.",
      "runmileEventCard": "런마일 이벤트 카드 (Figma 5117:130) — 앱 레벨 composition, DS 새 variant 아님. 세로형 Card: PC 280×432 / MO 159×343. 썸네일 bg gray200 · radius 12(LG) · 1:1 정사각(PC 280×280 / MO 159×159). 슬롯: 썸네일 → 메타칩(Badge) → 타이틀 → 날짜·주최 → 태그칩(Chip). DS 매핑 = Card(Container) + Badge(메타칩) + Chip(태그).",
      "runmileEventTypo": "런마일 이벤트 카드 타이포 — 타이틀 PC 18 / MO 15 Bold(#221E1F · 최대 2줄) · 날짜 PC 14 / MO 12 Medium gray800(+ calendar icon) · 주최 Medium gray600 · 메타칩 12/11 Bold · 태그칩 13 Medium gray900. 색·radius 세부는 Badge/Chip 가이드 SSOT 참조.",
      "runmileComponentSets": "런마일 Card 페이지 3 ComponentSet — ① 표준 Card(5115:126, 세로형) ② competition card(5067:1828, 대회 전용 가로형 PC 622×138 / MO 296×138 · date 인스턴스 + 상태 Badge + 대회명 16/14 Bold + 위치/날짜 + 내장 heart) ③ heart(5067:1819, 좋아요 토글 PC 30 / MO 28). competition card·heart 는 도메인 전용 — 표준 Card 와 별개 유지.",
      "cardGapMobile": "16px",
      "cardGapWebCMS": "24px",
      "elementGapTitleMeta": "4px",
      "footerSeparator": "border-top 1px · padding-top 16px (Footer 슬롯 사용 시)",
      "typoMeta": "Pretendard Caption 1 Regular 13px / LH 18px — var(--font-size-caption-1)",
      "compositionNote": "Composition 슬롯은 Base variant 의 padding 안쪽에 위치. promotion badge 만 top-right absolute 허용."
    },
    "stateMatrix": {
      "default": "Elevation 0(border 1px · neutral border 토큰) 또는 Elevation 1(box-shadow 토큰) 중 화면 단위로 택1. bg = white 또는 Surface 토큰. 두 elevation 을 동시에 걸지 않음.",
      "hover": "Border 색 변경 또는 미세한 bg tint. Elevation 1 화면에서는 shadow 한 단계 강조 가능. border+shadow 동시 강화 금지.",
      "activeSelected": "Border 2px Project Color 또는 Surface tint. Elevation 1 화면이라도 selected 표시는 색으로.",
      "pressed": "transition 100ms — bg tint 또는 scale(0.99). shadow 깜빡임 금지.",
      "note": "[Figma 권위 룰] 같은 화면 안에서 카드마다 elevation 종류가 다르면 안 됨. 한 리스트 = 한 elevation."
    },
    "summary": "**프로젝트 분기 (먼저 확인)**: 아래 \"[Figma 권위 룰]\" 다수는 Geniet 도메인 카드(식품·영양, figma 131:1769) 기준이다. **넛지EAP 서비스 카드는 규칙이 다르다 — `pattern:nudge-eap-card`(Figma 713:2) 를 따른다**: ① 내부 CTA 허용(카드 최하단 Primary CTA 1개 — 상담 예약·전문가·프로그램 카드. Geniet 의 'CTA 금지'·`maxCtaButtonsInsideCard:0` 은 NudgeEAP 에 적용 안 됨), ② shadow 전면 금지·border-only(Geniet 의 'Elevation 0 또는 1 택1' 과 달리 NudgeEAP 는 elevation 미사용), ③ border-radius 12px 고정. 컴포넌트는 양쪽을 모두 지원(Card.Cta/Card.Footer 슬롯 존재) — 차이는 프로젝트별 사용 규칙이다.\n\n동일 형식이 반복되는 콘텐츠 묶음을 시각적으로 그룹화하는 컨테이너. 1회성 메시지/프로모션은 Card 가 아니라 Banner. Figma 헤더 제약 4종: 3 Variants · PC & Mobile (반응형) · Image Optional (이미지 없는 변형 허용) · Semantic Token (raw hex / 임의 색 금지). Variant 3종 (List / Thumb / Cover) — 시각 우선순위·정보 밀도가 다르며 한 화면에서 1-2종만 함께 사용. List = 이미지 없이 텍스트+메타데이터로 나열 (트리거: 한 페이지 10개 이상 / 분류별 식품 리스트), Thumb = 썸네일 + 보조 정보 가로형 (트리거: 콘텐츠 식별이 텍스트만으로 부족 / 식품 카드·영양 코칭), Cover = 큰 이미지가 콘텐츠의 핵심 (트리거: 그리드로 시각적 임팩트 필요 / 4-up·2-up 그리드·커뮤니티). 도메인 출처: 지니어트(Geniet) 칼로리계산기 허브 페이지의 식품 리스트·영양 토픽·커뮤니티 카드. Compound 슬롯(순서 고정, 모두 Optional): Card.Root / Thumbnail / Avatar / Chips / Title / Description / Metadata / Divider / Cta / FooterText. (legacy: Header / Body / Footer 도 유지). Flat API props: thumbnail, avatar, chips, title, description, metadata, divider, cta, footerText, children. Anatomy 슬롯 (Figma SSOT, 한 카드 안에서 동일 위치 = 항상 같은 의미): Media(썸네일/커버, Thumb=정사각·Cover=4:3·단색 폴백 허용) · Title(필수, 카드 식별 핵심 라벨, 최대 2줄 + ellipsis, Body 2~H4 Bold) · Meta(보조 정보, 1줄, ' · ' 구분자, Caption Regular) · Status(상태 Badge, Success/Caution/Error 중 1개만) · Action(탭/이동 트리거 — 카드 전체 클릭이 기본, 내부 CTA 버튼 X) · Composition(optional, 도메인 카드가 Base 위에 얹는 슬롯). 도메인 카드(헬시딜·식품 검색·커뮤니티·랭킹·리뷰·식단 추천 등)는 새 variant 를 만들지 말고 Base variant 위에 Composition 슬롯을 얹어 표현 — 슬롯 카탈로그 16종(kcal chip · star rating · promotion badge · nutrition tag row · like overlay · author meta · discount badge · strikethrough price · shipping chip · certification chip · ranking leading · macro nutrition bar · category banner header · friend social proof · trending count · forum meta row)은 `get_guide({ topic: 'pattern:card-composition' })` 에서 슬롯별 사용 룰·위치·한도·금지 조합을 확인. Section/Group Card(카드 안에 list rows 를 담는 컨테이너 — '루테인 포함 영양제 · 총 84개 제품' 같은 묶음)는 단일 Card 가 아닌 별도 패턴 — `get_guide({ topic: 'pattern:card-section' })` 참고.\n\n**Trost Container card (Figma 5123:136) — platform · elevation · 헤더 행 (모두 opt-in, 미지정 시 현행 렌더 그대로).** 트로스트 컨테이너 카드는 다음 3 축을 추가한다(전부 additive — 기존 카드 사용에는 영향 없음): ① **platform** (`platform=\"pc\"` = padding 28 · radius 16 · title 20 · subtitle 14 / `platform=\"mobile\"` = padding 20 · radius 14 · title 17 · subtitle 13). 슬롯을 root 에 set 해 프로젝트 상속값을 이긴다. ② **elevation** (`elevation=\"outline\"` 기본 = 보더, shadow 없음 / `elevation=\"elevated\"` = box-shadow E2 + 보더 제거 — Geniet 와 마찬가지로 한 화면 한 elevation). ③ **헤더 행** — `icon` prop(24px 리딩 아이콘, point/코발트 액센트) 지정 시 `title`/`subtitle` 좌측에 아이콘 + 10px gap + 정보 컬럼(title 위 subtitle, gap 2px) 행으로 렌더. `showHeader` 로 아이콘 없이 컬럼만 묶기, `showIcon=false` 로 아이콘 숨김 가능. ④ **헤더↔본문 divider** — `showDivider` prop 으로 헤더/텍스트와 본문(children) 사이 1px hairline(cv.borderRole.subtle). cta/footerText 위 divider(`divider` prop) 와 별개. point 색은 `cv.iconRole.point`/`cv.textRole.point`/`cv.borderRole.point` — 비-point 프로젝트는 project 토큰으로 자동 폴백. HTML 미러: `<nds-card platform elevation>` + `<nds-card-header-row>` / `<nds-card-header-icon>` / `<nds-card-header-info>` / `<nds-card-divider>` 서브 엘리먼트.",
    "pitfalls": [
      "[Figma 권위 룰] Variant 혼용 금지 — 한 그리드 안에서 List/Thumb/Cover 를 섞으면 위계가 충돌. 한 화면에 1-2종만, 그리드 내부는 1종만.",
      "[Figma 권위 룰] Card 위에 별도 CTA 버튼 추가 금지 — Action 은 카드 전체 클릭이 기본. 카드 내부에 Solid/Outlined 버튼을 두면 카드 전체 클릭 영역과 충돌. 섹션 하단 '더보기' 같은 CTA 는 Card 가 아니라 Section 의 것.",
      "[Figma 권위 룰] Elevation 은 0(border) 또는 1(shadow) 중 택1 — border 1px 와 box-shadow 를 동시에 걸면 위반. 한 화면에서는 한 종류만 일관되게.",
      "[Figma 권위 룰] 임의 pastel/gradient/opacity 배경 금지 — White 또는 정의된 Surface 토큰 외 배경색 생성 불가. linear-gradient(), rgba 투명도, #E8F4FD 류 임의 hex 모두 차단.",
      "[Figma 권위 룰] Title 생략 금지 — 카드당 정확히 1개, 항상 가장 높은 시각적 위계. 최대 2줄 + ellipsis. Description/Metadata 가 Title 자리를 대신할 수 없음.",
      "[Figma 권위 룰] Status Badge 2개 이상 동시 노출 금지 — Success/Caution/Error 중 하나만 강조.",
      "[Figma 권위 룰] Cover 이미지 비율 임의 변경 금지 — 1:1 / 4:3 / 16:9 외 비율은 DS 에서 먼저 정의 후 사용.",
      "[Figma 권위 룰] Thumb 이미지 원형(circle) 금지 — Thumb 슬롯은 Radius 토큰 적용된 사각. 원형은 Avatar 슬롯 전용.",
      "[Figma 권위 룰] 한 리스트 내 Radius 토큰은 1종만 — 일부 카드만 Radius 가 다른 케이스는 위반.",
      "[Figma 권위 룰] Cover 본문 텍스트 3줄 이상 금지 — Cover 는 큰 이미지가 주, 본문은 짧게.",
      "[Figma 권위 룰] Meta 구분자는 ' · ' 통일 — '/', '|', '-', 줄바꿈 등 다른 구분자 금지. Caption / Regular 1줄.",
      "[Figma 권위 룰] Nested Card 금지 — Card 안에 또 다른 Card 삽입 X. 그룹은 Section / Divider 로 표현. bordered 박스를 카드처럼 흉내내는 것도 위반.",
      "[Figma 권위 룰] 광고/프로모션과 동일한 카드 스타일로 콘텐츠 카드 생성 금지 — Promo Card 는 별도 토큰 사용. 사용자 혼동 방지.",
      "Avatar + Thumbnail 동시 사용 불가 — 둘 중 하나만 (Avatar max 1개).",
      "Title 슬롯은 항상 Media 다음, 좌측 정렬 — 카드마다 다른 위치에 두면 안 됨.",
      "Thumb 이미지가 없을 때는 Project Soft 단색 폴백 사용 — 빈 회색 박스 / placeholder 이미지 금지.",
      "Decorative Card 금지 — 콘텐츠 위계가 없는 장식용 카드 생성 금지. 동일 형식 반복이 아니면 Banner/Section 사용.",
      "카드 장식 라인/accent 바 금지 — 상단 컬러 라인(border-top accent), 좌측 accent 보더, ::before 컬러 바 등으로 카드를 장식하지 않는다. 카드가 가질 수 있는 선은 outlined variant 의 중립 1px 전체 보더와 옵션 footer/divider hairline(`border-top 1px subtle`) 뿐 — 컬러 accent 선은 DS Card 에 없다. 강조는 색이 아니라 Chip/Badge·텍스트 위계로, 영역 구분은 spacing/Divider 로. (`get_guide({ topic: 'pattern:visual-antipatterns' })` 표면 그룹 참고.)",
      "그리드 카드 간격 임의 혼합(8/12/16/20px) 금지. Auto Layout: Mobile 16px, Web·CMS 24px.",
      "Card.Header / Card.Body / Card.Footer 는 styles.css 에 자체 padding 보유. 외곽에 padding 또 주면 이중 패딩.",
      "Card Overuse — 단순 텍스트+상태+날짜 목록(상담 내역·예약·알림)을 Card 로 감싸는 패턴. 정보 밀도 ↓, List Row 로 변경.",
      "런마일 이벤트 카드는 Card 의 새 variant 가 아님 — Card(Container) + Badge(메타 칩) + Chip(태그)을 조합한 앱 레벨 composition. 새 variant/컴포넌트를 만들지 말고 프리미티브를 조합한다. 대회 정보는 표준 Card 가 아니라 competition card(가로형 · 별도 ComponentSet)를 쓴다."
    ],
    "recommended": [
      "List variant — 이미지 없이 Title + Meta. 분류된 항목을 좁은 간격으로 노출, 시각 가중치 최저. <Card.Root variant='list'><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>",
      "Thumb variant — 좌측 정사각 썸네일 + 우측 Title/Meta. 카테고리/식품 목록의 기본 카드. <Card.Root variant='thumb'><Card.Thumbnail/><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>",
      "Cover variant — 상단 큰 이미지(1:1 또는 4:3) + 하단 Title/Meta. 4-up / 2-up 그리드용. <Card.Root variant='cover'><Card.Thumbnail aspect='1:1'/><Card.Title>…</Card.Title><Card.Metadata>…</Card.Metadata></Card.Root>",
      "Composition Patterns (도메인 카드) — Base variant 선택 후 Composition 슬롯을 얹는다. variant 를 새로 만들지 않음. 슬롯 16종 전체 카탈로그·위치·한도·금지 조합은 `get_guide({ topic: 'pattern:card-composition' })`.",
      "도메인 카드 예시 매핑 (Figma SSOT) — 헬시딜 랭킹 카드 = Cover + Slot7(discount badge) + Slot8(strikethrough+sale price) + Slot2(star rating) + Slot9(shipping chip) + Slot10(certification chip). 음식 리뷰 카드 = Cover + Slot5(like overlay) + Slot6(author meta) + Slot2(star rating). 다이어트·혈당 추천 카드 = Cover + Slot13(category banner header) + Slot4(nutrition tag row) + Slot12(macro nutrition bar) + Slot14(friend social proof). 지금 뜨는 한식 = List + Slot11(ranking leading) + Slot1(kcal chip) + Slot15(trending count). 커뮤니티 게시글 = List + Slot16(forum meta row).",
      "Section/Group Card (카드 안에 list rows 묶음 — 예: '루테인 포함 영양제 · 총 84개 제품') — 단일 Card 의 variant 가 아니라 별도 컨테이너 패턴. 룰·메트릭은 `get_guide({ topic: 'pattern:card-section' })`.",
      "Action 패턴 — 카드 전체가 클릭 영역. <Card.Root clickable onClick={…}>. 내부에 Solid/Outlined CTA 버튼 두지 않음. 섹션 하단 '더보기' 는 Card 가 아니라 Section 의 CTA.",
      "Thumb 폴백 — 이미지가 없을 때 Project Soft 토큰 단색 배경(예: var(--semantic-brand-bg)) + 옵션 아이콘.",
      "지니어트 배치 매핑 (Geniet CardGuide 3056-125) — 음식 검색·식단 리스트(Mobile) → Horizontal(328·r8) / 홈 인기·추천 가로스크롤 → Vertical(240×280·r12) / 카테고리 그리드 2·3열 → Grid(160×210·r8) / PC 메인·모달 → Container(440·r16) / Hero 강조 → Container + shadow(E2). Mobile 은 border, PC Container 만 shadow — 한 화면 한 elevation 유지(위 Figma 권위 룰).",
      "Trost Container card (Figma 5123:136) — 트로스트 PC/모바일 큰 카드는 `platform` + `elevation` + `icon`/`showDivider` 로 표현. PC: `<Card platform='pc' elevation='outline' icon={<Icon/>} title=… subtitle=… showDivider>본문</Card>` (padding 28·r16·title 20·subtitle 14). Hero/모달 강조는 `elevation='elevated'`(shadow E2 + 보더 제거). Mobile: `<Card platform='mobile' elevation='outline' …>` (padding 20·r14·title 17·subtitle 13, border 권장). 리딩 아이콘은 point/코발트(cv.iconRole.point) 액센트. HTML: `<nds-card platform='pc' elevation='elevated'><nds-card-header-row><nds-card-header-icon>…</nds-card-header-icon><nds-card-header-info><h3 class='nds-card__title'>…</h3><p class='nds-card__description'>…</p></nds-card-header-info></nds-card-header-row><nds-card-divider></nds-card-divider><nds-card-body>본문</nds-card-body></nds-card>`.",
      "런마일 이벤트 카드 (Figma 5117:130) — 표준 Card 위에 도메인 정보를 얹는 **앱 레벨 composition**(새 variant 아님). 세로형 PC 280×432 / MO 159×343, 썸네일 1:1 정사각(radius 12). 구성: 썸네일 → 메타 칩(Badge, 거리·D-day) → 타이틀(18/15 Bold, 2줄) → 날짜(calendar icon + gray800)·주최(gray600) → 태그 칩(Chip, 최대 3). 예: `<Card variant='cover' clickable><Card.Thumbnail aspect='1:1'><img src='…' alt='' /></Card.Thumbnail><Card.Chips><Badge color='project' variant='soft'>5km 외 2개</Badge><Badge variant='outlined'>접수마감 D-60</Badge></Card.Chips><Card.Title>2026 댕댕이레이스</Card.Title><Card.Metadata>📅 25.12.30~25.12.31 · (주)러닝포인트</Card.Metadata><Card.Chips><Chip>#강아지</Chip><Chip>#댕댕런</Chip></Card.Chips></Card>`. 색·radius 세부(태그칩 등)는 Badge/Chip 가이드 SSOT. 대회 정보는 표준 Card 가 아니라 competition card(가로형) 사용."
    ],
    "accessibility": [
      "clickable Card 는 <Card.Root clickable onClick> — 키보드 포커스/Enter 자동. raw <div onClick> 대체 금지.",
      "Cover 카드 이미지 위에 텍스트를 얹는 디자인이라면 Gradient Overlay 위에서 WCAG AA 대비비 확보 — 단, 이건 Banner 영역. Card 의 Cover 변형은 텍스트가 이미지 하단 별도 영역에 위치.",
      "썸네일 <img> alt 필수 (장식이면 alt=''). 카드 제목과 중복되는 alt 는 비우기.",
      "Status Badge 는 색 + 텍스트 라벨 동시 노출 — 색맹 대응."
    ],
    "interactivePattern": "Card.Root 의 clickable + onClick 으로 인터랙티브화 — 카드 전체가 클릭 영역이고 내부에 별도 CTA 버튼을 두지 않는 것이 기본. Composition 슬롯의 promotion badge 처럼 시각만 강조하는 요소는 클릭 핸들러 없이 절대 위치만 잡고, 클릭은 Card.Root 가 받는다. Hover 피드백은 화면 elevation 정책에 맞춰 — Elevation 0 화면은 border 색 변경, Elevation 1 화면은 shadow 강조. 두 elevation 을 한 화면에서 섞지 않음.",
    "examplesHtml": {
      "do": "<nds-card variant=\"outlined\" clickable>\n  <nds-card-thumbnail ratio><img src=\"/cover.jpg\" alt=\"\" /></nds-card-thumbnail>\n  <nds-card-body>\n    <h3>제목</h3>\n    <p>설명 텍스트</p>\n  </nds-card-body>\n</nds-card>\n<script>card.addEventListener(\"card-click\", () => navigate(\"/detail\"));</script>",
      "dont": "<!-- clickable 카드 내부에 또 다른 클릭 가능한 nds-button -> 중복 핸들러 -->\n<nds-card clickable>\n  <nds-card-body>제목</nds-card-body>\n  <nds-button color=\"primary\">자세히 보기</nds-button>\n</nds-card>\n<!-- raw <div class=\"nds-card\"> 로 모양만 흉내. 키보드/포커스 룰 사라짐 -->\n<div class=\"nds-card\" onclick=\"…\">…</div>"
    }
  },
  "Carousel": {
    "name": "Carousel",
    "summary": "가로 스와이프 슬라이더. 홈 배너, 콘텐츠 추천, 온보딩에 사용. drag/dots/autoplay/loop 내장.",
    "pitfalls": [
      "정보 위계가 동등한 항목 N개를 보여주는 용도라면 캐러셀 대신 가로 스크롤 리스트가 더 나음 — 캐러셀은 한 번에 1개만 보임.",
      "autoplay만 켜고 loop를 안 켜면 마지막 슬라이드에서 멈춤. 둘 다 함께 사용.",
      "슬라이드 1-2장이면 캐러셀 의미 없음. 그냥 카드/배너로.",
      "슬라이드 안에 자체 가로 스크롤(예: 가로 리스트)을 넣으면 드래그 충돌. 세로 스크롤만 허용."
    ],
    "recommended": [
      "홈 배너: <Carousel autoplay={3000} loop indicator='dots'>",
      "이미지 갤러리: indicator='counter' (현재 N/M 표시)",
      "온보딩 3-5장: showArrows=false, indicator='dots'"
    ],
    "interactivePattern": "activeIndex/onActiveIndexChange로 외부 동기화 가능. 드래그 임계값은 viewport 폭의 15%.",
    "examplesHtml": {
      "do": "<nds-carousel autoplay=\"3000\" indicator=\"dots\" loop>\n  <img src=\"/banner1.jpg\" alt=\"\" />\n  <img src=\"/banner2.jpg\" alt=\"\" />\n</nds-carousel>",
      "dont": "<!-- 슬라이드가 1장인데 loop + autoplay — 같은 이미지가 깜빡임 -->\n<nds-carousel autoplay=\"3000\" loop><img src=\"/only.jpg\" /></nds-carousel>"
    }
  },
  "Chart": {
    "name": "Chart",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-47404",
    "summary": "캐포비 어드민 통계 차트 — line / grouped-bar. 런타임 라이브러리 없이 정적 inline-SVG 로 렌더(무번들러 목업 정합). 데이터는 자식 <script type=\"application/json\"> 또는 data 속성. Figma 퀴즈 통계(3001:47404).",
    "pitfalls": [
      "**캐포비(cashwalk-biz) 어드민 통계 전용** — 소비자(모바일) 화면용 차트 아님. 대시보드/통계 페이지에서만 사용.",
      "**데이터는 JSON** — 큰 데이터는 `data=\"...\"` 속성보다 자식 `<script type=\"application/json\">` 권장(과이스케이프 방지, cf. nds-sidebar). values 는 **숫자**(따옴표 X).",
      "**type** 은 `line` | `bar`. bar 에 시리즈를 2개 이상 주면 그룹(나란히) 막대. line 도 다중 시리즈 가능.",
      "**시리즈 색은 토큰 슬롯** — 기본값이 캐포비 팔레트(line=#FFD200, bar1=#007AFF 남성, bar2=#FF8437 여성)라 보통 `color` 생략. 바꾸려면 `--nds-chart-line` / `--nds-chart-1` / `--nds-chart-2` CSS 변수 오버라이드(raw hex 하드코딩 금지).",
      "**y축 상한**: 미지정 시 데이터 기준 자동(눈금에 나눠떨어지게). 캐포비 시안처럼 헤드룸을 두려면 `y-max`(웹컴포넌트) / `yMax`(React) 명시.",
      "범례는 시리즈 `name` 이 있을 때만 자동 표시. 숨기려면 `no-legend`(웹컴포넌트) / `showLegend={false}`(React).",
      "차트 카드(흰 라운드 박스 + 타이틀)는 차트 외부 컨테이너로 직접 구성 — nds-chart 는 plot+범례만 그림."
    ],
    "recommended": [
      "연령대별/시간대별 추세 = line (필요 시 tooltip 으로 특정 포인트 강조)",
      "성별/카테고리 비교 = bar (그룹 막대, 시리즈 2개)",
      "React: <Chart type=\"bar\" labels={ages} series={[{name:'남성',values:[...]},{name:'여성',values:[...]}]} />"
    ],
    "examplesHtml": {
      "do": "<!-- 라인: 데이터는 자식 <script type=\"application/json\"> 로 -->\n<nds-chart type=\"line\">\n  <script type=\"application/json\">\n    { \"labels\": [\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"],\n      \"series\": [{ \"name\": \"지급된 캐시\", \"values\": [11000000,28000000,33000000,40000000,42000000,47000000] }],\n      \"tooltip\": { \"index\": 3, \"text\": \"123,456,789 w/s\" } }\n  </script>\n</nds-chart>\n\n<!-- 그룹 막대: 다중 시리즈 = 남/여 그룹 -->\n<nds-chart type=\"bar\">\n  <script type=\"application/json\">\n    { \"labels\": [\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"],\n      \"series\": [\n        { \"name\": \"남성\", \"values\": [14000000,15500000,22000000,25000000,26000000,16000000] },\n        { \"name\": \"여성\", \"values\": [14000000,18500000,20500000,28000000,26000000,14500000] } ] }\n  </script>\n</nds-chart>",
      "dont": "<!-- 외부 차트 라이브러리(canvas/Chart.js)·이미지로 차트를 박지 말 것 — 목업은 무번들러. nds-chart 정적 SVG 사용 -->\n<canvas id=\"chart\"></canvas><script src=\"chart.js\"></script>\n<!-- series 색을 raw hex 로 하드코딩하지 말 것. 기본 팔레트(캐포비)면 color 생략, 바꾸려면 --nds-chart-* 오버라이드 -->\n<nds-chart type=\"bar\" data='{\"labels\":[\"a\"],\"series\":[{\"color\":\"#ff0000\",\"values\":[1]}]}'></nds-chart>"
    }
  },
  "ChatBubble": {
    "name": "ChatBubble",
    "summary": "1:1 상담/챗봇 말풍선. role=me|them, group으로 코너 정리.",
    "pitfalls": [
      "group prop을 안 넘기면 매 메시지가 둥근 모서리로 떠서 그룹감이 없음. 같은 발신자 연속 메시지면 first/middle/last 명시.",
      "them 측 avatar는 group=\"single\"|\"last\" 일 때만 보이고, first/middle은 visibility:hidden으로 자리만 차지 — 정렬 어긋나지 않음. 직접 avatar를 끄지 말 것.",
      "time과 read는 메시지 끝(single/last)에만 노출. 모든 메시지에 시간 박지 말 것.",
      "텍스트 외 이미지/카드 첨부는 children에 직접 ReactNode 넘김. 별도 prop 없음."
    ],
    "recommended": [
      "group: 단독 single, 첫 메시지 first, 중간 middle, 마지막 last",
      "긴 대화 화면은 list virtualization 권장 (DS는 단순 렌더만 제공)"
    ],
    "examplesHtml": {
      "do": "<nds-chat-bubble role=\"assistant\" name=\"상담사\" time=\"오후 2:31\"\n  message=\"요즘 잠은 어떠세요?\"></nds-chat-bubble>\n<nds-chat-bubble role=\"user\" group time=\"오후 2:32\" message=\"잘 못 자고 있어요\"></nds-chat-bubble>",
      "dont": "<!-- raw <div class=\"bubble\"> 로 시각만 흉내 — 좌/우 정렬/꼬리/그룹 룰이 사라짐 -->\n<div class=\"bubble user\">잘 못 자고 있어요</div>"
    }
  },
  "ChatInput": {
    "name": "ChatInput",
    "summary": "채팅 입력바. ChatBubble의 짝. 자동 확장 textarea + 빠른 응답 + 첨부/마이크 + 글자수.",
    "pitfalls": [
      "value/onValueChange/onSubmit 모두 controlled — 내부 state 없음.",
      "submitOnEnter=true(기본)에서 Enter=전송, Shift+Enter=줄바꿈. 모바일에선 키보드의 줄바꿈 키 사용.",
      "quickReplies는 onClick에서 onValueChange 또는 onSubmit을 직접 호출 — 컴포넌트가 정책을 강제하지 않음.",
      "onAttach/onMic prop을 안 주면 해당 버튼이 자동 숨김 (UI 요소 안 만들고 깔끔)."
    ],
    "recommended": [
      "1:1 상담: <ChatInput value, onValueChange, onSubmit, maxLength={1000}>",
      "챗봇 + 빠른 응답: quickReplies=[{label, onClick: ()=> onSubmit(...)}]",
      "음성 메모: onMic만, onAttach 생략"
    ],
    "examplesHtml": {
      "do": "<nds-chat-input placeholder=\"메시지를 입력하세요\" max-length=\"500\"\n  quick-replies='[{\"text\":\"네\"},{\"text\":\"아니요\"}]'></nds-chat-input>\n<script>el.addEventListener(\"nds-chat-submit\", e => send(e.detail.value));</script>",
      "dont": "<!-- raw <input> + <button> 으로 채팅 입력 흉내 — 자동 grow / quick-replies / 첨부 등 미적용 -->\n<input type=\"text\" /><button>전송</button>"
    }
  },
  "Checkbox": {
    "name": "Checkbox",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5158-108",
    "summary": "다중 선택 / on-off / 약관 동의 체크. 라벨이 함께 와야 의미가 전달되고, 단일 선택 그룹은 Radio 가 맞음. `indeterminate` 로 '일부 자식만 선택됨'(부모/전체선택)을 옐로우 마이너스로 표시.",
    "pitfalls": [
      "약관/필수 동의에 disabled 로 잠가두면 시각 위계가 모호 — required 또는 별도 안내문으로 명시.",
      "checked 와 default-checked 동시 사용 — controlled / uncontrolled 가 섞임.",
      "label 없이 단독으로 던지지 말 것 — 한 줄 안내문이라도 aria-label 로 제공.",
      "`indeterminate` 는 `checked` 보다 우선 표시되고, 클릭하면 네이티브와 동일하게 `checked=true` 로 전이된다(부분→전체). '부모/전체선택' 행에만 쓰고 leaf 엔 쓰지 말 것.",
      "상태 SSOT 는 호스트의 `checked` **프로퍼티** — `el.checked = true` 로 코드에서 바꿔도 `change` 는 발생하지 않는다(네이티브 동일, 사용자 입력에만 발화). 전체선택 헤더는 ①헤더 `change` → 자식 `.checked` 를 일괄 set, ②자식 `change` → 선택 수로 헤더 `checked`/`indeterminate` 3상태 재계산, 두 방향을 직접 잇는다. `onclick` 시점엔 아직 토글 전이라 상태가 안 settled — 반드시 `change` 를 들을 것. (`.click()` 만으론 호스트 토글이 안 됨.)",
      "**시/도 ▸ 시/군구 같은 계층 트리는 CheckboxTree** 가 부모 indeterminate 를 자동 계산 — 직접 indeterminate 를 손계산해 트리를 손조립하지 말 것. component:CheckboxTree.",
      "소규모 고정 옵션 다중선택(예: 연령대 10대~70대)은 **SelectChip**(`<nds-chip selected>`) 우선 — 체크박스 리스트는 약관 동의·긴 가변 리스트·행 단위 선택에. (`pattern:cashwalk-biz-badge-chip`)",
      "**트로스트(Controls 가이드 5158:108)**: 컨트롤 박스 24×24, on(checked) 상태는 프로젝트 노랑이 아닌 **다크 #333 채움 + 흰 체크**(노랑 위 가독성 — 트로스트 토큰 checkbox.checkedBg/checkColor). 라벨 우측 gap 12. 그룹은 vertical stack 행간 12. 필수면 그룹 라벨에 * , 미선택 시 그룹 하단 Helper 로 에러.",
      "**런마일(Controls 가이드 5111:345)**: 박스 24×24, on(checked) = 프로젝트 **오렌지 #FF5B37 채움 + 흰 체크**(트로스트 다크와 달리 런마일은 project색=오렌지가 곧 on색 → checkedBg 미설정·fill.brand fallback). off=Border/Default + 흰 surface, disabled=BG/Disabled. 다중 선택·약관 동의·필터 옵션."
    ],
    "examplesHtml": {
      "do": "<nds-checkbox name=\"agree-terms\" label=\"이용약관에 동의합니다\" required></nds-checkbox>\n<nds-checkbox name=\"optional-marketing\" label=\"마케팅 정보 수신 (선택)\"></nds-checkbox>",
      "dont": "<!-- 라벨 없는 단독 체크박스 — 의미 전달 실패 -->\n<nds-checkbox name=\"x\" checked></nds-checkbox>\n<!-- 라디오로 충분한 단일 선택을 체크박스로 -->\n<nds-checkbox name=\"payment\" value=\"card\">카드</nds-checkbox>\n<nds-checkbox name=\"payment\" value=\"cash\">현금</nds-checkbox>"
    }
  },
  "CheckboxGroup": {
    "name": "CheckboxGroup",
    "summary": "체크박스 묶음. 두 모드 — **items(데이터 모드)**: value/onValueChange 로 선택 관리 + `select-all`(자식 비율로 indeterminate 자동) + `badge`(필수/선택 등)·`detail`(펼침) 슬롯. **children(레이아웃 모드)**: 직접 조립한 nds-checkbox 들을 배치만. '전체선택 + 체크 리스트'(다중 필터·설정 묶음 등)의 단일 컴포넌트. antd Checkbox.Group 대응. **약관/개인정보 동의 화면은 전용 component:Agreement 사용** — CheckboxGroup 으로 조립하지 않는다.",
    "pitfalls": [
      "items 모드 value 는 controlled — `nds-checkbox-group-change`(React onValueChange)로만 갱신. **전체선택은 자식 선택 비율로 자동 파생**(checked/indeterminate/unchecked) — 직접 손계산하지 말 것.",
      "약관/개인정보 **동의 화면은 전용 component:Agreement 사용** — 필수/선택 badge·전체동의·detail 펼침·pre-tick 금지(개인정보보호법)·필수 미동의 가드를 컴포넌트가 보장한다. CheckboxGroup 으로 consent 를 조립하지 말 것(중복·가드 누락 위험).",
      "**계층(시/도 ▸ 시/군구) 선택은 CheckboxGroup 이 아니라 component:CheckboxTree** (부모 indeterminate 자동·접기/펼치기).",
      "닫힌 드롭다운 + 검색 + 적용 버튼 형태의 필터는 component:MultiSelect — CheckboxGroup 은 항상 펼쳐진 인라인 리스트.",
      "`badge` 는 도메인 중립 슬롯([필수]/[선택]/NEW). **badge 텍스트에 \"필수\" 가 들어있으면 컴포넌트가 자동으로 강조(빨강+bold)** 한다 — `required` 를 따로 안 붙여도 [필수] 는 강조된다. 자동 강조를 끄려면 `required={false}`(React) / `\"required\":false`(items JSON) 를 명시. NEW 등 다른 강조색이 필요하면 호출부에서 직접."
    ],
    "examplesHtml": {
      "do": "<nds-checkbox-group select-all select-all-label=\"전체 선택\" value='[]'\n  items='[{\"value\":\"stress\",\"label\":\"스트레스 관리\"},{\"value\":\"sleep\",\"label\":\"수면\"},{\"value\":\"relation\",\"label\":\"관계\"}]'></nds-checkbox-group>\n<script>el.addEventListener(\"nds-checkbox-group-change\", e => setTopics(e.detail.value));</script>",
      "dont": "<!-- 계층(시/도▸시군구)을 CheckboxGroup 으로 — CheckboxTree 가 맞음 -->\n<nds-checkbox-group items='[{\"value\":\"gangwon\",\"label\":\"강원도\"}]'></nds-checkbox-group>\n<!-- 선택 항목 pre-tick (위법) — 초기 value 는 빈 배열 -->\n<nds-checkbox-group select-all value='[\"marketing\"]' items='[…]'></nds-checkbox-group>"
    }
  },
  "CheckboxTree": {
    "name": "CheckboxTree",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-50785",
    "summary": "검색은 기본 활성화지만 옵션인 전체선택 + 계층(시/도 ▸ 시/군/구) 체크박스 트리. 부모는 하위 leaf 선택 비율에 따라 checked / indeterminate / unchecked 를 **자동** 표시하고, 부모 클릭은 하위 leaf 전체를 on/off. value 는 **선택된 leaf 값**만 담는다(부모는 파생). 캐포비 지역 선택 모달 좌측(3001:50785).",
    "pitfalls": [
      "**평면(계층 없음) 다중선택이면 MultiSelect**, 즉시 반영 단일선택이면 Select — CheckboxTree 는 부모/자식 트리 전용.",
      "value 에 부모 값을 넣지 말 것 — 선택은 leaf 값만. 부모 checked/indeterminate 는 자식 비율로 컴포넌트가 계산한다.",
      "'선택한 항목' 요약 패널은 CheckboxTree 안에 없음 — `SelectedItemsPanel` + `SelectedItemRow` 로 오른쪽에 따로 조립(시/도 전체 선택이면 시/도명만, 일부면 '시/도 > 시/군구'). component:SelectedItemsPanel. RegionRow 는 하위호환 alias.",
      "검색은 기본 노출이지만 필요 없으면 `searchable={false}` 로 숨길 수 있다. 검색이 켜져 있으면 매치된 노드의 부모를 자동 펼침 — 펼침 상태를 직접 강제하지 말 것.",
      "빈 결과는 자동 빈 상태('검색 결과가 없습니다.').",
      "전체선택은 **현재 검색 필터된** leaf 기준으로 토글된다(전체 목록 아님). MultiSelect 와 동일 규칙.",
      "들여쓰기는 `--nds-checkbox-tree-indent`(기본 32px) × depth 자동 — 행마다 padding 을 손대지 말 것. 스크롤 높이는 `--nds-checkbox-tree-max-height`."
    ],
    "examplesHtml": {
      "do": "<nds-checkbox-tree search-placeholder=\"소재명으로 검색하기\" value='[\"gangneung\"]' default-expanded='[\"gangwon\"]'\n  nodes='[{\"value\":\"gangwon\",\"label\":\"강원도특별자치도\",\"children\":[{\"value\":\"gangneung\",\"label\":\"강릉시\"},{\"value\":\"donghae\",\"label\":\"동해시\"}]}]'></nds-checkbox-tree>\n<script>el.addEventListener(\"nds-checkbox-tree-change\", e => setRegions(e.detail.value));</script>",
      "dont": "<!-- 계층 없는 평면 다중선택을 CheckboxTree 로 — MultiSelect 가 맞음 -->\n<nds-checkbox-tree nodes='[{\"value\":\"a\",\"label\":\"옵션 A\"},{\"value\":\"b\",\"label\":\"옵션 B\"}]'></nds-checkbox-tree>\n<!-- value 에 부모 값 주입 — leaf 만 담아야 함 -->\n<nds-checkbox-tree value='[\"gangwon\"]'></nds-checkbox-tree>"
    }
  },
  "Chip": {
    "name": "Chip",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5107-130",
    "references": [
      {
        "label": "Trost Chip — 필터칩 가이드 (TrostLibrary)",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5107-130",
        "caption": "트로스트 필터칩 가이드. default = color=\"neutral\"(회색 보더 #E5E5E5 + 회색 텍스트 #606060), selected = 프로젝트 노랑 강조(보더 #FFF42E + subtle bg #FFFDD9 + 오렌지 텍스트 #FF9D00), disabled = opacity 낮춤. height 30 · 좌우 padding 10. leading icon=icon prop · 삭제 X=onRemove. (색은 컴포넌트에 박지 않고 트로스트 토큰 override 로 슬롯 주입.)",
        "project": "trost"
      }
    ],
    "usagePolicy": {
      "useFor": [
        "상태: 진행중, 완료, 마감",
        "분류: 상담, 검사, 교육",
        "짧은 속성: 신규, 추천, 필수"
      ],
      "doNotUseFor": [
        "일반 안내문 강조",
        "섹션 제목 장식",
        "모든 카드에 반복되는 시각 장식",
        "긴 문장",
        "CTA를 더 눈에 띄게 만들기 위한 보조 장식"
      ],
      "limits": {
        "maxLabelLength": 8,
        "maxPerCard": 2,
        "maxPerSection": 2
      }
    },
    "summary": "pill 형태 라벨. variant: fill/outlined/ghost. **React**: `<Chip label='...' />` (label prop 필수, children 금지). **HTML**: `<nds-chip>...</nds-chip>` (text content, label attribute 없음).",
    "pitfalls": [
      "**React 한정** — `<Chip>{children}</Chip>` 으로 children 넣지 말 것. 반드시 `<Chip label='...' />`. 함정: HTML 예시(`<nds-chip>라벨</nds-chip>`)를 보고 React 에도 children 쓰면 API 어긋남.",
      "**HTML 한정** — `<nds-chip label='...' />` 처럼 label attribute 쓰지 말 것. nds-chip 은 label attribute 가 없고 children/text content 만 받음 (nds-chip.ts L189: `while (this.firstChild) label.appendChild(this.firstChild)`).",
      "**HTML 토글은 attribute 로** — `nds-chip` 은 `selected`/`color`/`variant` 등을 observedAttributes 로 감지해 자동 리렌더한다(NdsElement base 가 attributeChangedCallback→update). `setAttribute(\"selected\",\"\")` / `removeAttribute(\"selected\")` 로 토글하면 색이 즉시 바뀐다 — **칩 노드를 통째로 교체하는 워크어라운드는 불필요**. 단 **property 대입(`el.selected = true`)은 무시됨**(setter 없음, attribute 만 읽음) → 이게 '클릭해도 색이 안 변한다'의 진짜 원인. 삭제는 `removable` + `chip-remove` 이벤트로 연결.",
      "**좌측 아이콘/체크/도트** — React 는 `icon` prop, HTML 은 `slot=\"icon\"` 자식: `<nds-chip selected><svg slot=\"icon\">…</svg>30대</nds-chip>` (slot 없는 자식은 전부 label 로 들어감). 아이콘은 `currentColor` 를 따르므로 텍스트색(=선택 시 채움 위 텍스트색)으로 렌더된다. project-subtle 등 다른 선택 톤/텍스트색은 hex 말고 `--nds-chip-selected-background/text/border` override(예: 캐포비는 노랑 위 검정 텍스트로 `--nds-chip-selected-text` override).",
      "**트로스트 필터칩** — `color=\"neutral\"` 기본(회색: 보더 #E5E5E5 + 텍스트 #606060), `selected` 시 프로젝트 노랑 강조(보더 #FFF42E + subtle bg #FFFDD9 + 오렌지 텍스트 #FF9D00, outlined-selected 룩 — 구 다크 채움 #333 폐기). 높이 30 · 좌우 padding 10. leading icon=`icon` prop, 삭제 X=`onRemove`, 선택 토글=`selected` prop. 색은 컴포넌트에 박지 말고 트로스트 토큰 override 가 슬롯에 주입한다(matrixOverrides.trost 참조).",
      "Chip은 상태/분류/짧은 속성 표시용이다. 새 섹션을 강조하거나 일반 안내문을 꾸미는 장식으로 쓰지 말 것.",
      "모든 카드/섹션 제목 앞에 Chip을 붙이면 위계가 무너진다. 카드당 최대 1-2개, 섹션당 최대 2개 수준으로 제한.",
      "긴 문장이나 CTA 보조 문구를 Chip에 넣지 말 것. 8자 안팎의 짧은 라벨만 자연스럽다.",
      "표준 variant에 없는 톤(예: caution, success)이 필요해도 raw <span>/<div>로 대체 금지. style prop으로 background/color/font-weight를 토큰 변수로 override + icon prop으로 좌측 도트 주입이 정공법."
    ],
    "recommended": [
      "주의 톤: <Chip label='주의 필요' variant='ghost' size='sm' icon={<span style={{width:6,height:6,borderRadius:9999,background:'var(--semantic-caution-main)'}}/>} style={{background:'var(--semantic-caution-bg)',color:'var(--semantic-caution-text)',fontWeight:600}} />",
      "성공/에러도 같은 패턴으로 토큰 var()만 교체"
    ],
    "examplesHtml": {
      "do": "<nds-chip variant=\"outlined\" color=\"project\" interactive>전체</nds-chip>\n<nds-chip variant=\"ghost\" color=\"caution\" size=\"sm\" removable>주의 필요</nds-chip>\n<!-- 선택형(SelectChip): 좌측 ✓ 체크는 slot=\"icon\" 자식으로. 색은 currentColor(텍스트색)를 따름 -->\n<nds-chip selected interactive><svg slot=\"icon\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M3 8.5l3.5 3.5L13 5\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>30대</nds-chip>",
      "dont": "<!-- disabled 와 removable 동시 사용 — 누가 X 버튼을 누를 수 있는지 모호 -->\n<nds-chip disabled removable>태그</nds-chip>\n<!-- interactive 없이 클릭 핸들러만 — 키보드 포커스가 안 잡힘 -->\n<nds-chip onclick=\"…\">필터</nds-chip>"
    }
  },
  "CommentItem": {
    "name": "CommentItem",
    "summary": "댓글 한 건. 작성자/시간/본문 + 좋아요/답글 슬롯 + 답글 트리(replies). 본문 줄바꿈 자동 보존.",
    "pitfalls": [
      "답글에는 isReply=true로 들여쓰기 시각 강조. 빠뜨리면 평면적으로 보임.",
      "likeAction은 슬롯 — LikeButton 컴포넌트를 직접 넘김. 텍스트 버튼만 두지 말 것.",
      "본문은 white-space: pre-wrap — text에 줄바꿈 그대로 넣으면 됨."
    ],
    "recommended": [
      "콘텐츠 댓글: avatar + author + likeAction + onReply",
      "답글 트리: replies={<>... isReply ...</>}",
      "상담사 댓글: authorBadge로 역할 표시"
    ],
    "examplesHtml": {
      "do": "<nds-comment-item author=\"이정민\" time=\"2시간 전\" text=\"공감해요!\" show-reply>\n  <img slot=\"avatar\" src=\"/u.jpg\" alt=\"\" />\n</nds-comment-item>\n<script>el.addEventListener(\"nds-comment-reply\", e => focusReply(e.detail.author));</script>",
      "dont": "<!-- text 를 slot 으로 — text 는 attribute 사용 -->\n<nds-comment-item author=\"A\"><p>본문</p></nds-comment-item>"
    }
  },
  "ConfirmTooltip": {
    "name": "ConfirmTooltip",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4018-1226",
    "stateMatrix": {
      "actions=dual": "취소(흰 배경·검정 border·검정 텍스트) + 확인(검정 fill·흰 텍스트). 우측 정렬.",
      "actions=single": "확인 버튼 1개만 (검정 fill·흰 텍스트). 우측 정렬.",
      "placement": "top(기본)/bottom/left/right — tail 이 트리거를 가리키도록 anchor 반대편에 배치."
    },
    "summary": "캐포비 어드민 **popconfirm** — 트리거(버튼/링크) 옆에서 가볍게 확인받는 **흰 말풍선**. 제목 + 보조 본문 + 1~2 액션 버튼(검정 secondary CTA) + 방향 tail. `open` controlled, 트리거 클릭 핸들러에서 토글. 확인/취소는 React `onConfirm`/`onCancel`, HTML `nds-confirm-tooltip-confirm`/`nds-confirm-tooltip-cancel` 이벤트. **Tooltip(다크 hover 안내)과 분리** — 이건 사용자의 응답/결정이 필요한 경우. 색은 전부 semantic 토큰이라 project cascade 로 해석(캐포비 = 검정 CTA).",
    "pitfalls": [
      "차단형 결정·되돌리기 어려운 작업·한 화면을 채울 만큼 긴 본문은 ConfirmTooltip 이 아니라 Modal/Popup. ConfirmTooltip 은 인라인 가벼운 확인용.",
      "단순 hover 보조 설명에 쓰지 말 것 — 그건 component:Tooltip(다크 말풍선). ConfirmTooltip 은 액션 버튼이 있는 확인 팝업.",
      "`open` 은 controlled — 트리거 클릭에서 직접 토글하고, onConfirm/onCancel 에서 닫아야(open=false) 한다. (HTML 은 `open` 속성 토글 + 이벤트 리슨.)",
      "actions=\"single\" 이면 확인 버튼만 — 이때 cancelLabel 은 무시된다. 취소가 필요하면 actions=\"dual\".",
      "트리거는 React children / HTML light-DOM child (실제 버튼). trigger-label 같은 평문 속성 없음 — Tooltip 과 다르다."
    ],
    "examplesHtml": {
      "do": "<!-- 인라인 확인 (취소+해제) — open 토글 + 이벤트 리슨 -->\n<nds-confirm-tooltip\n  title=\"연결을 해제하시겠습니까?\"\n  description=\"연결을 해제하면 광고에 해당 소재는 더이상 노출되지 않습니다.\"\n  confirm-label=\"해제\" cancel-label=\"취소\" placement=\"top\" open>\n  <nds-button color=\"secondary\" variant=\"outlined\" size=\"sm\">연결 해제</nds-button>\n</nds-confirm-tooltip>\n<script>\n  el.addEventListener(\"nds-confirm-tooltip-confirm\", () => el.removeAttribute(\"open\"));\n  el.addEventListener(\"nds-confirm-tooltip-cancel\", () => el.removeAttribute(\"open\"));\n</script>\n<!-- 확인만 -->\n<nds-confirm-tooltip title=\"저장되었습니다\" actions=\"single\" confirm-label=\"확인\" open>\n  <nds-button color=\"secondary\" variant=\"outlined\" size=\"sm\">안내</nds-button>\n</nds-confirm-tooltip>",
      "dont": "<!-- 되돌리기 어려운 차단형 결정을 popconfirm 으로 — Modal/Popup 이 맞음 -->\n<nds-confirm-tooltip title=\"계정을 영구 삭제할까요?\" open>...</nds-confirm-tooltip>\n<!-- hover 보조 설명에 ConfirmTooltip (액션 없는 안내는 Tooltip) -->\n<nds-confirm-tooltip title=\"CTR = 클릭률\" actions=\"single\"></nds-confirm-tooltip>"
    }
  },
  "DSHighlight": {
    "name": "DSHighlight",
    "summary": "DS 적용 영역을 시각적으로 강조하는 dev-only 디버깅 컴포넌트. production 빌드에서 자동 제거.",
    "pitfalls": [
      "DSHighlight 를 일반 화면 강조에 재활용 — 그 용도는 Banner / Card 가 맞음.",
      "production 환경에서 import 가 남아 있으면 번들 크기 증가 — import.meta.env.DEV 게이트로 감쌀 것."
    ],
    "examplesHtml": {
      "do": "<nds-ds-highlight mode=\"component\"></nds-ds-highlight>\n<!-- 강조 대상에 data-ds-mark=\"<영역>\" 부여 -->",
      "dont": "<!-- production 빌드에 그대로 두면 안 됨. import.meta.env.DEV 게이트 적용 -->\n<nds-ds-highlight mode=\"all\"></nds-ds-highlight>"
    }
  },
  "DataTable": {
    "name": "DataTable",
    "summary": "정렬·클릭·빈 상태·로딩·모바일 카드 변환에 더해 getSubRows(React)/sub-rows-key(HTML)로 펼침·접힘(트리) 자식 행까지 갖춘 표. 사용자 앱(약 복용 이력 등)과 운영툴·리포트 양쪽에 사용.",
    "pitfalls": [
      "CMS/어드민은 antd Table을 우선 — DataTable은 사용자 앱(특히 모바일 cards 모드)에서 강점.",
      "columns[].key는 데이터 객체의 실제 key 또는 임의 식별자. render가 있으면 key 자체는 매핑 안 해도 됨.",
      "정렬은 controlled — sortKey/sortDirection/onSort 셋을 부모에서 관리. 컴포넌트가 자체 정렬하지 않음.",
      "responsive=\"cards\"는 max-width 640px에서만 카드로 전환. cardLabel/hideOnCard로 카드 모드 표시 조절.",
      "rowKey는 함수 — index 사용은 reorder 시 버그. 가능하면 row.id 같은 안정적 키.",
      "펼침(getSubRows/sub-rows-key) 사용 시 rowKey/row-key 는 반드시 행 고유값(자식 포함 유일) — index 기반이면 접었다 펼 때 키가 흔들려 펼침 상태가 깨짐.",
      "합계/병합셀(rowspan) 리포트 표는 여전히 nds-stats-table(`<tr class=\"is-summary\">`). DataTable 펼침은 트리(자식 행)용 — 표 하단 합계행 렌더는 StatsTable 담당이며 둘을 조합한다.",
      "정렬 = **헤더·셀 모두 중앙이 기본이자 표준**(캐포비 리스트 SSOT 3613-365). 엑셀처럼 컬럼마다 좌/우 정렬을 섞지 말 것 — 그냥 중앙으로 둔다. (펼침 토글 컬럼만 토글+들여쓰기 때문에 자동 좌측.) 셀 패딩은 **16px 고정(상하좌우)**이고 행 높이는 내용에 따라 가변 — 이미지/썸네일 등 큰 셀은 컬럼에 `media`(React)/`media:true`(HTML JSON) 로 12px. 조밀한 표는 size='sm'. 펼침 표는 컬럼 width 를 지정하면 table-layout:fixed 로 정렬이 안정적."
    ],
    "recommended": [
      "사용자 앱 약 복용 이력: responsive=\"cards\" + size=\"sm\"",
      "리스트가 길면 외부에 Pagination 컴포넌트와 조합",
      "펼침 리포트(캐포비 날짜별/광고별 — 날짜 행 펼치면 캠페인·광고 자식 행): getSubRows(React) / sub-rows-key(HTML) + (옵션) defaultExpandedKeys·expandedKeys. expanderColumnKey/expander-column 로 토글 컬럼 지정(기본 첫 컬럼)."
    ],
    "interactivePattern": "행 클릭으로 상세 진입. 정렬 가능 컬럼은 sortable: true 명시 + 외부에서 정렬 처리.",
    "examplesHtml": {
      "do": "<nds-data-table\n  columns='[{\"key\":\"name\",\"title\":\"이름\",\"sortable\":true},{\"key\":\"age\",\"title\":\"나이\"}]'\n  data='[{\"name\":\"홍길동\",\"age\":30}]'\n  size=\"md\" responsive=\"cards\" row-clickable></nds-data-table>\n<script>\nel.addEventListener(\"nds-data-table-sort\", e => sort(e.detail));\nel.addEventListener(\"nds-data-table-row-click\", e => openRow(e.detail.row));\n</script>\n\n<!-- 펼침(트리): sub-rows-key 로 자식 배열 필드 지정 -->\n<nds-data-table row-key=\"id\" sub-rows-key=\"subRows\"\n  columns='[{\"key\":\"date\",\"title\":\"날짜\"},{\"key\":\"spend\",\"title\":\"소진액\",\"align\":\"right\"}]'\n  data='[{\"id\":\"d1\",\"date\":\"2025-08-28\",\"spend\":\"11,111\",\"subRows\":[{\"id\":\"d1a\",\"date\":\"2025-08-28\",\"spend\":\"6,000\"}]}]'></nds-data-table>",
      "dont": "<!-- 어드민/CMS 페이지에 DataTable 사용 — 어드민은 antd Table -->\n<nds-data-table columns='...'></nds-data-table>"
    }
  },
  "DatePicker": {
    "name": "DatePicker",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903",
    "summary": "단일 날짜 선택. 캘린더 팝업 + 키보드 grid 이동(Arrow/Home/End/PageUp/PageDown) + clear/open/status 제어. 시간까지 필요하면 별도 TimePicker 또는 DateTimePicker 조합. (폼에서 날짜 고르기는 항상 DatePicker — Calendar 는 마커가 있는 독립 인라인 월 뷰로 용도가 다르다.)",
    "pitfalls": [
      "min/max 누락 — 사용자가 과거/먼 미래 날짜를 선택해 데이터 검증 실패.",
      "주말/휴일/마감일 같은 업무 제약은 React disabledDate, HTML disabled-dates(JSON 배열 또는 comma-separated ISO)로 막는다.",
      "값 초기화가 필요한 필터는 allowClear + onClear/nds-date-clear 를 연결한다.",
      "한국어 로케일 누락 — '월/일/연도' 영문 형식 노출.",
      "Calendar 컴포넌트로 month/year 보기 + 직접 select 흉내내지 말 것 — 컨트롤 일관성 깨짐."
    ],
    "examplesHtml": {
      "do": "<nds-date-picker value=\"2026-05-25\" min-date=\"2026-05-01\" max-date=\"2026-12-31\"\n  placeholder=\"날짜 선택\" allow-clear></nds-date-picker>\n<script>el.addEventListener(\"nds-date-change\", e => setDate(e.detail.value));\nel.addEventListener(\"nds-date-clear\", () => setDate(null));</script>",
      "dont": "<!-- min-date / max-date 누락 — 사용자가 과거/먼 미래 선택 가능 -->\n<nds-date-picker placeholder=\"날짜\"></nds-date-picker>"
    }
  },
  "DateRangePicker": {
    "name": "DateRangePicker",
    "summary": "시작/끝 날짜 한 쌍 선택. 단일 트리거 + range 전용 캘린더 패널 + 빠른 프리셋(최근 7일 등).",
    "pitfalls": [
      "**기간(노출 기간/시작~종료)을 raw text input 2개로 손수 만들지 말 것** — placeholder 'YYYY-MM-DD' 텍스트 입력은 달력 팝오버·범위 검증·간격이 전부 빠진다. 한 컴포넌트 <nds-date-range-picker> 로. (검증룰 date-as-text-input 이 막음. 단일 날짜는 DatePicker.)",
      "value는 { from?, to? } — 부분 선택 가능 (시작만 있을 수 있음). 폼 검증 시 둘 다 있는지 체크.",
      "시작/종료를 한 패널에서 차례로 선택 — 역순으로 고르면 자동 정렬된다.",
      "프리셋은 defaultRangePresets로 빠른 것 3개 제공 (7일/30일/이번 달). 검사·리포트마다 다른 기본값이 필요하면 직접 정의.",
      "presets[].range는 함수 — 호출 시점의 \"오늘\"을 기준으로 계산하기 위함. 객체 리터럴로 박지 말 것.",
      "선택 불가 날짜는 React disabledDate, HTML disabled-dates(JSON 배열 또는 comma-separated ISO)로 막는다."
    ],
    "recommended": [
      "리포트 기간 필터: defaultRangePresets 그대로 사용",
      "검사 이력 검색: maxDate=오늘, presets에 \"전체\" 추가"
    ],
    "examplesHtml": {
      "do": "<nds-date-range-picker from=\"2026-05-01\" to=\"2026-05-31\" allow-clear\n  presets='[{\"key\":\"7d\",\"label\":\"최근 7일\",\"from\":\"2026-05-25\",\"to\":\"2026-05-31\"},{\"key\":\"month\",\"label\":\"이번 달\",\"from\":\"2026-05-01\",\"to\":\"2026-05-31\"}]'></nds-date-range-picker>\n<script>el.addEventListener(\"nds-date-range-change\", e => apply(e.detail));</script>",
      "dont": "<!-- to < from — 의미 없는 범위. min-date / max-date 로 가드 권장 -->\n<nds-date-range-picker from=\"2026-05-31\" to=\"2026-05-01\"></nds-date-range-picker>"
    }
  },
  "Divider": {
    "name": "Divider",
    "summary": "섹션 사이의 시각적 분리선. 카드 안 내부 분할에 남발하지 말고, 한 화면당 의미 있는 분리에만 사용.",
    "pitfalls": [
      "**상하 간격은 `spacing` 속성으로 — 대칭이 자동.** `spacing=\"16\"` 이면 divider 위·아래 margin 이 **동일**하게 잡힌다(`margin: spacing 0`). 간격을 형제의 한쪽 margin/gap 으로만 주면 divider 가 다음 항목에 붙어 **위/아래 비대칭**(예: 위 12·아래 0)으로 어색해진다 — 폼/스텝 리스트에서 자주 나오는 footgun.",
      "**flex-gap 컨테이너 + divider `spacing` 은 간격이 중복**된다. 둘 중 하나만: ① 컨테이너 `gap` 만 쓰고 divider 는 `spacing` 없이(자체 margin 0) 형제로, 또는 ② 컨테이너 gap 0 + divider `spacing` 으로 간격.",
      "스텝/섹션 마크업 **안쪽에 divider 를 끼우지** 말고(라벨에 달라붙어 비대칭) 섹션 **사이 형제**로 둘 것.",
      "Divider 를 두꺼운 색상 line 으로 시각 위계 강조용으로 쓰지 말 것 — Heading + spacing 토큰이 우선.",
      "List 의 항목 사이에 Divider 를 직접 박지 말 것. nds-list variant='divided' 가 책임짐.",
      "orientation='vertical' 은 부모가 flex 컨테이너이고 명시적 높이가 있어야 보임."
    ],
    "examplesHtml": {
      "do": "<section>섹션 A</section>\n<nds-divider orientation=\"horizontal\" spacing=\"24\"></nds-divider>\n<section>섹션 B</section>",
      "dont": "<!-- ① list 항목 사이마다 divider 직접 — list variant 가 책임 -->\n<nds-list-item>항목 1</nds-list-item>\n<nds-divider></nds-divider>\n<nds-list-item>항목 2</nds-list-item>\n\n<!-- ② 스텝 안에 divider 를 끼워 다음 라벨에 달라붙음 → 위/아래 비대칭.\n     spacing 없이 컨테이너 gap 만 있으면 위쪽만 간격이 생긴다.\n     → divider 를 섹션 사이 형제로 옮기고 spacing 으로 대칭 확보 -->\n<div style=\"display:flex; flex-direction:column; gap:12px\">\n  <div>1단계 본문<nds-divider></nds-divider></div>\n  <label>2단계 라벨</label>\n</div>"
    }
  },
  "Drawer": {
    "name": "Drawer",
    "summary": "측면(left/right) 슬라이드 패널. 모달보다 가벼운 컨텍스트(필터, 보조 정보, 빠른 작업)에 적합. 모달과 동시에 열지 말 것.",
    "pitfalls": [
      "open attribute 만 토글하고 nds-drawer-close 이벤트를 처리 안 함 — overlay 클릭 / ESC 가 끄지 못함.",
      "Drawer 안에서 또 Drawer / Modal 을 열지 말 것 (overlay z-index 충돌).",
      "size='lg' 로 viewport 의 80% 이상을 덮으면 사실상 Modal — Modal 사용을 검토."
    ],
    "examplesHtml": {
      "do": "<nds-drawer side=\"right\" size=\"md\" drawer-title=\"필터\">\n  <p>필터 UI…</p>\n  <div slot=\"footer\"><nds-button color=\"primary\">적용</nds-button></div>\n</nds-drawer>\n<script>el.addEventListener(\"nds-drawer-close\", () => el.removeAttribute(\"open\"));</script>",
      "dont": "<!-- close 이벤트 처리 없음 — overlay 클릭이 닫지 못함 -->\n<nds-drawer open side=\"right\" size=\"md\">필터…</nds-drawer>"
    }
  },
  "DropdownMenu": {
    "name": "DropdownMenu",
    "summary": "버튼 / 아이콘 트리거에서 펼쳐지는 짧은 액션 메뉴. 옵션 5개 이하 권장 — 그 이상은 Select 또는 별도 화면.",
    "pitfalls": [
      "옵션이 많아서 스크롤이 필요한 경우 DropdownMenu 가 아님 (Select / 검색형 UI 사용).",
      "destructive 액션은 별도 group 으로 분리하거나 최하단에 배치 — 다른 일반 액션 사이에 끼우지 말 것.",
      "메뉴 항목에 disabled 가 많으면 차라리 그 항목들을 빼고 권한 설명을 별도 영역에 노출.",
      "**item `leading`/`trailing` = inline SVG (이름/이모지 아님).** innerHTML 로 주입되므로 아이콘 이름을 넣으면 텍스트로 흘러나온다. `find_icon({ name })` 의 inline SVG 를 넣을 것 (trailing 은 단축키 등 짧은 텍스트도 가능). React DropdownMenu 의 `leading?/trailing?: ReactNode` 와 대칭."
    ],
    "examplesHtml": {
      "do": "<nds-dropdown-menu items='[{\"label\":\"편집\",\"value\":\"edit\"},{\"label\":\"공유\",\"value\":\"share\"},{\"label\":\"삭제\",\"value\":\"delete\",\"destructive\":true}]'></nds-dropdown-menu>\n<script>el.addEventListener(\"dropdown-select\", e => handle(e.detail.value));</script>",
      "dont": "<!-- 옵션이 너무 많고 destructive 가 일반 액션 사이 -->\n<nds-dropdown-menu items='[{\"label\":\"1\"},{\"label\":\"2\"},{\"label\":\"삭제\"},{\"label\":\"4\"},{\"label\":\"5\"},...]'></nds-dropdown-menu>"
    }
  },
  "FAB": {
    "name": "FAB",
    "summary": "Floating Action Button. 화면 하단에 떠 있는 가장 중요한 단일 액션. position 기본 bottom-right (fixed).",
    "pitfalls": [
      "한 화면에 FAB는 1개만. 2개 이상 두면 위계 붕괴.",
      "StickyBottom CTA가 있는 화면에는 FAB를 두지 말 것 — 두 요소가 겹쳐서 안전 영역이 무너짐.",
      "position='bottom-right' 등은 position: fixed로 동작. Storybook/테스트에서는 static + 부모에서 fixed 처리.",
      "label 없이 아이콘만 쓰면 aria-label 필수. 누락 시 스크린리더 접근성 깨짐.",
      "offset 기본 16px — 모바일 하단바(56px)와 겹치면 offset={80} 등으로 보정."
    ],
    "recommended": [
      "일기 화면 새 글 작성: <FAB icon={<EditIcon/>} label='새 글' position='bottom-right' />",
      "감정 캘린더 빠른 기록: <FAB icon={<PlusIcon/>} aria-label='기록 추가' />",
      "하단바 있는 화면: offset={72}"
    ],
    "examplesHtml": {
      "do": "<nds-fab icon=\"plus\" label=\"기록 추가\" color=\"primary\" position=\"bottom-right\"></nds-fab>",
      "dont": "<!-- 화면에 FAB 와 primary nds-button 양쪽 — 대표 액션이 둘이 됨 -->\n<nds-button color=\"primary\">기록 추가</nds-button>\n<nds-fab icon=\"plus\" label=\"기록 추가\"></nds-fab>"
    }
  },
  "FileUpload": {
    "name": "FileUpload",
    "summary": "Drag&drop + 클릭 업로드. multiple/accept/maxSize 지원. 제어 컴포넌트.",
    "pitfalls": [
      "value가 File[] 제어 컴포넌트 — 내부 상태 안 가짐. 부모에서 useState로 관리.",
      "onValueChange는 \"성공\" 파일만, onReject는 거부된 파일 — 둘이 분리되어 있음. 같이 다루지 말 것.",
      "maxSize는 bytes 단위 (10MB = 10 * 1024 * 1024). MB로 착각하지 말 것.",
      "accept는 브라우저 힌트일 뿐이라 실제로는 다른 파일도 들어올 수 있음 — 서버에서 한 번 더 검증 필요.",
      "multiple=false에서 두 번째 파일을 드롭하면 첫 번째를 덮어씀(slice(0, 1)). 추가 누적 X."
    ],
    "recommended": [
      "프로필 이미지: accept=\"image/*\", maxSize=5MB, multiple=false",
      "진단서 첨부: accept=\".pdf,.jpg,.png\", maxSize=10MB, multiple",
      "errorMessage prop으로 거부 사유 지속 표시 (Toast 한 번 띄우는 것보다 명확)"
    ],
    "examplesHtml": {
      "do": "<nds-file-upload accept=\".pdf,.jpg,.png\" max-size=\"5242880\"\n  description=\"PDF, JPG, PNG · 5MB 이하\"></nds-file-upload>\n<script>\nel.addEventListener(\"files-change\", e => upload(e.detail.files));\nel.addEventListener(\"files-reject\", e => el.setAttribute(\"error-message\", e.detail.reason));\n</script>",
      "dont": "<!-- max-size 를 MB 단위로 입력 — bytes 가 정답 (5242880 = 5MB) -->\n<nds-file-upload max-size=\"5\"></nds-file-upload>"
    }
  },
  "FilterBar": {
    "name": "FilterBar",
    "references": [
      {
        "label": "Tab vs Filter — 역할·배치·결정 트리 (DesignGuide)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3544-206",
        "caption": "FilterBar = 현재 view 안에서 조건 좁히기(다중 누적·쿼리 파라미터). Tab(view 전환)과 역할 구분. 배치 순서·결정 트리, 캐포비 admin 풀 스펙은 pattern:cashwalk-biz-tab.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "가로 필터 칩 그룹. 다중/단일 선택, 카운트, 자동 초기화. **FilterBar = 현재 view 안에서 데이터를 점진적으로 좁히기(날짜·키워드·상태 등 다중 조건 누적 · 쿼리 파라미터로 URL 유지)** — view 자체를 전환하는 **Tab** 과 역할이 다르다(상호 배타적 큰 분류는 Tab). 배치: 페이지 타이틀 → Tab → FilterBar → 데이터.",
    "pitfalls": [
      "single은 라디오와 다름 — 같은 칩 다시 누르면 해제됨.",
      "옵션 8개 이상이면 가로 스크롤. 데스크톱은 Tab/Drawer 필터 검토.",
      "Tab는 페이지/뷰 전환, FilterBar는 같은 리스트 안의 필터.",
      "**상호 배타적 큰 분류(진행중/종료 같은 view 전환)를 FilterBar 로 만들지 말 것 — Tab 사용.** 반대로 날짜 범위·키워드 같은 조건 좁히기를 Tab 으로 만들지 말 것 — FilterBar 사용. (결정 트리: view 바뀌면 Tab / 조건 누적이면 Filter / 2–7개 단일 선택이면 Radio·SelectionButtonGroup.)",
      "**배치**: 페이지 타이틀 → Tab → FilterBar → 데이터 영역. Filter 는 쿼리 파라미터로 누적돼 URL 공유 시에도 유지된다.",
      "**FilterBar 에 Primary CTA 외 다른 액션 버튼을 여러 개 두지 말 것 — CTA 는 1개만.** 필터 항목이 12개+ 면 별도 `[필터 더보기]` 모달로.",
      "캐포비 admin 풀 스펙(Tab Underline/Box·치수·색)은 `pattern:cashwalk-biz-tab`. Figma DesignGuide/Tab 3544-206."
    ],
    "recommended": [
      "콘텐츠 리스트: 다중 선택 + count",
      "상담사 분야: single"
    ],
    "examplesHtml": {
      "do": "<nds-filter-bar\n  options='[{\"key\":\"new\",\"label\":\"신규\",\"count\":5},{\"key\":\"hot\",\"label\":\"인기\",\"count\":12}]'\n  value='[\"new\"]' show-reset></nds-filter-bar>\n<script>el.addEventListener(\"nds-filter-change\", e => apply(e.detail.value));</script>",
      "dont": "<!-- options.key 누락 — change event 의 value 가 의미 없는 string -->\n<nds-filter-bar options='[{\"label\":\"신규\"}]'></nds-filter-bar>"
    }
  },
  "FloatingCtaBanner": {
    "name": "FloatingCtaBanner",
    "figmaNodeUrl": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=91-3",
    "sizeMatrix": {
      "pcWidth": "440px (min-width) — fixed 추천",
      "pcHeight": "68px",
      "pcPadding": "14px 24px 14px 16px",
      "pcIcon": "48 × 48",
      "pcCaption": "Body3 14/20 Regular · cv.textRole.subtle",
      "pcCtaText": "Body1 16/24 Bold · cv.textRole.brand",
      "pcArrow": "20 × 20 · ChevronRightIcon · currentColor (project)",
      "pcBottomOffset": "32px (기본)",
      "pcGap": "12px (icon ↔ text)",
      "mobileWidth": "288px (min-width)",
      "mobileHeight": "60px",
      "mobilePadding": "12px 16px 12px 12px",
      "mobileIcon": "32 × 32",
      "mobileCaption": "Caption2 12/16 Regular · cv.textRole.subtle",
      "mobileCtaText": "Caption1 13/18 Bold · cv.textRole.brand",
      "mobileArrow": "16 × 16 · ChevronRightIcon",
      "mobileBottomOffset": "16px (기본)",
      "mobileGap": "8px",
      "radius": "pill (radius.full = 9999) — 완전 캡슐형",
      "border": "1px solid cv.borderRole.brand",
      "background": "cv.surface.default (#FFFFFF 고정)",
      "shadow": "shadow[2] = 0 4px 12px rgba(0,0,0,0.10) (가이드의 0.08 와 가장 가까운 토큰)"
    },
    "stateMatrix": {
      "default": "border project · shadow overlay (shadow[2])",
      "hover": "translateY(-1px) · shadow[3] — PC only",
      "active": "translateY(0) · shadow[1]",
      "floating": "position:fixed · left:50% · translateX(-50%) · z-index sticky(200) · bottom=bottomOffset",
      "note": "Disabled 상태는 정의하지 않음 — CTA 진입 트리거이므로 항상 active."
    },
    "usagePolicy": {
      "useFor": [
        "음식/검색 결과 0건 페이지 하단 floating 진입 배너 (Geniet 식단 도메인 패턴)",
        "단일 메시지 + 단일 액션의 하단 sticky CTA 모듈"
      ],
      "doNotUseFor": [
        "다중 액션 (버튼 2개 이상) — Bottom Sheet 또는 Modal",
        "긴 안내문 + 액션 — Banner (페이지 상단 띠)",
        "토스트성 일시 알림 → Toast / Snackbar",
        "사이드바 카드형 진입 → Card"
      ],
      "limits": {
        "captionLines": 1,
        "ctaTextLines": 1,
        "actionsPerBanner": 1,
        "radiusVariants": "pill 만 (직사각형 금지)"
      }
    },
    "summary": "페이지 하단 sticky CTA 배너. pill (radius 100) + project border 1px + shadow. 좌측 일러스트(leadingIcon) + 캡션(보조) + 강조 CTA 텍스트 + 우측 chevron 아이콘. 기본 `floating=true` 시 position:fixed 로 화면 하단 중앙 자동 고정.",
    "pitfalls": [
      "Chevron 은 텍스트 '>' 로 그리지 말 것 — 내부에서 `<ChevronRightIcon>` 아이콘으로 자동 렌더. showArrow=false 로 숨김만 가능.",
      "Border / CTA / Arrow 색은 모두 시멘틱(`cv.borderRole.brand`, `cv.textRole.brand`) 참조 — raw hex override 금지. 프로젝트별 실제 매핑(예: Geniet mint, NudgeEAP blue)은 `packages/tokens/src/projects/*.semantic.ts` 에 정의.",
      "CTA 텍스트 색은 `cv.textRole.brand` 고정 — underline / weight 변경 / 다른 강조색 적용 금지.",
      "radius 는 항상 pill (`radius.full`) — 직사각형 radius 8/12 변형 금지 (Figma DO/Don't 룰).",
      "floating=true 시 부모에 `position: relative` 가 있어도 화면 fixed — 컨테이너 내부 sticky 가 필요하면 floating=false + 부모에서 직접 position:sticky 처리.",
      "캡션은 1줄 ellipsis 고정 — 두 줄 wrap 금지. 메시지 길면 ctaText 로 옮기거나 캡션 자체를 줄일 것 (단일 메시지 + 단일 액션 원칙).",
      "다중 CTA(버튼 2개 이상) 사용 금지 — 이 컴포넌트는 단일 액션 floating 진입 배너 전용.",
      "PC size 는 height 68 / Mobile size 는 height 60 — 두 사이즈 외에 커스텀 height 금지 (specs 표 기준)."
    ],
    "recommended": [
      "검색 결과 0건 또는 카테고리 진입 시: <FloatingCtaBanner caption=\"찾는 음식이 없으신가요?\" ctaText=\"음식 직접 등록하러 가기\" leadingIcon={<SaladIcon/>} onClick={…} />",
      "반응형: 모바일 < 768px 에서 size=\"mobile\" 로 분기 (자동 분기 없음 — 외부 미디어쿼리/JS 로 결정).",
      "Bottom Nav / Safe Area 가 있으면 `bottomOffset` 을 그 만큼 더해 겹침 방지.",
      "인라인 배치가 필요하면 floating=false — 부모 폭에 맞춰 inline-flex 로 렌더."
    ],
    "accessibility": [
      "전체가 <button type='button'>. ariaLabel 미지정 시 ctaText 가 string 이면 그걸 그대로 사용.",
      "leadingIcon / arrow 는 aria-hidden — 음성 인식 시 ctaText 만 읽힘.",
      "ctaText 가 ReactNode(아이콘 포함 등) 면 ariaLabel 명시적으로 넘길 것."
    ],
    "examplesHtml": {
      "do": "<nds-floating-cta-banner caption=\"상담사 매칭이 완료됐어요\"\n  cta-text=\"확인하기\" floating size=\"mobile\" bottom-offset=\"80\"></nds-floating-cta-banner>\n<script>el.addEventListener(\"nds-floating-cta-click\", () => navigate(\"/match\"));</script>",
      "dont": "<!-- floating + bottom-offset 0 — 하단 탭바를 가림 -->\n<nds-floating-cta-banner floating bottom-offset=\"0\"></nds-floating-cta-banner>"
    }
  },
  "Footer": {
    "name": "Footer",
    "summary": "페이지 최하단 사이트맵 / 약관 / 운영주체 정보. 모바일/웹 모두 컴포지션 자식(nds-footer-tab-bar / nds-footer-company-info / nds-footer-web) 으로 구성.",
    "pitfalls": [
      "raw <footer> + 인라인 스타일로 시각만 흉내 — 프로젝트별 콘텐츠 구조가 통일되지 않음.",
      "Footer 안에 마케팅 CTA 큰 카드를 박지 말 것 — Footer 는 정보/법적 영역.",
      "사용자 앱과 어드민에서 같은 Footer 컴포넌트 사용 금지 — 어드민은 antd + 자체 Copyright 카피."
    ],
    "examplesHtml": {
      "do": "<nds-footer-info active-tab=\"home\">\n  <nds-footer-tab-bar>\n    <nds-footer-tab-item key=\"home\" label=\"홈\" href=\"/\"></nds-footer-tab-item>\n    <nds-footer-tab-item key=\"journal\" label=\"일기\" href=\"/journal\"></nds-footer-tab-item>\n  </nds-footer-tab-bar>\n  <nds-footer-company-info>(주)넛지이에이피 · 사업자 …</nds-footer-company-info>\n</nds-footer-info>",
      "dont": "<!-- raw <footer> 로 모양만 흉내 — 프로젝트 사양에서 벗어남 -->\n<footer style=\"background:#f5f5f5;padding:24px\"><p>회사정보</p></footer>"
    }
  },
  "FormField": {
    "name": "FormField",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3082-846",
    "sizeMatrix": {
      "top": "label 위, control 아래. 모바일/일반 폼 기본. label-row column flex.",
      "left": "label 좌측 고정(width 기본 180px, labelWidth prop), control 우측 1fr. 라벨 시작점 = control 시작점 (root align-items:flex-start 로 top 정렬) — Figma 정합. 입력 높이와 무관하게 라벨이 항상 control 상단에 붙는다 (예전 baseline 보정 padding-top 은 중앙 끌어내림 + 고정 px 라 입력 높이가 다르면 라벨이 처지던 버그여서 제거).",
      "density:default": "label 13/18 Medium · helper 13/18 Regular (Input Typography 표준, Figma 4247:1964 · 프로젝트 무관). 자체 padding 0 — 부모 stack 이 간격 결정.",
      "density:admin": "label body1 16/24 (≡ Figma Subtitle1/Medium · admin density 전용 override), helper 13/18 (공용 Input Typography helper — base 와 동일), 자체 py-24 → stack 시 자동 시각 48px 간격 (Figma FormSection 3387:871 표준)."
    },
    "summary": "Input / Textarea / Select 같은 form control 의 label / helper / error / counter 슬롯을 묶는 래퍼. label-position(top|left) + density(default|admin) 조합으로 모바일/admin 폼을 한 컴포넌트로 처리.",
    "pitfalls": [
      "label 또는 html-for 누락 — Form 안의 input id 와 라벨이 끊겨 접근성이 깨짐.",
      "error 와 helper 를 동시에 표시 — 사용자는 어떤 메시지를 우선해야 할지 혼란. error 모드에서는 helper 숨김.",
      "counter 는 max-length 가 명확한 textarea / input 에서만 사용.",
      "label-position='left' + description 동시 사용 — description 이 있으면 자동으로 top 으로 폴백 (좌측 좁은 컬럼에 멀티라인 설명을 욱여넣지 않기 위함).",
      "density='admin' 인데 stack 사이에 별도 gap 24/48 박음 — FormField 자체 py-24 가 이미 시각 48px 을 만드므로 이중 간격이 됨. 부모는 그냥 flex column 으로 두고 FormField 가 알아서 간격 책임지게 할 것.",
      "density 와 size 혼동: density 는 FormField 의 label/helper 톤·padding, size 는 Input/Select 의 height. 캐포비 admin 표준 = density='admin' + size 미지정(또는 field) → 48px. 옛 compact(40)은 admin 표준이 아니었고 API 에서 제거됨.",
      "FormField child 슬롯에 raw <div> + 수기 flex 로 input 여러 개 — 대신 InputGroup 컴포넌트 사용 (gap 12 + flex:1 균등 자동)."
    ],
    "recommended": [
      "모바일/일반 폼: <nds-form-field label='이름' helper='실명' required> + <nds-input>",
      "캐시워크 포 비즈니스 admin 표준 (단일 input): <nds-form-field label='Label' label-position='left' density='admin'> + <nds-input / nds-select> (size 미지정 → 캐포비 project 48px cascade)",
      "캐시워크 포 비즈니스 admin 표준 (row 다중 input): density='admin' FormField 안에 <nds-input-group> 으로 input 묶기 — gap 12 균등 분할 (Figma 3466:17405 패턴)",
      "FormSection (FormField 두 개 이상 stack): 부모는 <div class='form-card'> (radius 16, padding 24, white bg) + 안에 <nds-form-field density='admin'> 들을 그냥 flex column 으로 쌓기. 각 FormField 의 py-24 가 자동으로 시각 48px 간격을 만듦.",
      "글자수 카운터: counter='12 / 200' — Textarea 같이 max-length 가 명확할 때만.",
      "라벨 전략(하이브리드): label prop 이 있는 컨트롤(Input/Textarea/Select/AmountInput/PhoneInput/SearchInput/TagInput/TimePicker/Autocomplete/AddressPicker)은 bare 로도 완전한 필드 — 검색바·툴바 필터·테이블 셀·단일필드엔 굳이 FormField 로 감싸지 않는다. **자체 label 이 없는 컨트롤(MultiSelect·DateRangePicker·FileUpload·ImageUpload·Slider)** 에 필드 라벨이 필요하면 FormField 로 감싼다. left-label/admin density/counter/description 도 FormField 전용."
    ],
    "examplesHtml": {
      "do": "<!-- 모바일/일반 폼 -->\n<nds-form-field label=\"이름\" helper=\"실명을 입력해주세요\" html-for=\"name-input\" required>\n  <nds-input id=\"name-input\" name=\"name\"></nds-input>\n</nds-form-field>\n\n<!-- 캐시워크 포 비즈니스 admin: label 좌측 + admin density (height 48 cascade) -->\n<nds-form-field label=\"Label\" label-position=\"left\" density=\"admin\" html-for=\"admin-name\">\n  <nds-input id=\"admin-name\" placeholder=\"값을 입력하세요\"></nds-input>\n</nds-form-field>\n\n<!-- row 다중 input — InputGroup -->\n<nds-form-field label=\"기간\" label-position=\"left\" density=\"admin\">\n  <nds-input-group>\n    <nds-select placeholder=\"년\"></nds-select>\n    <nds-select placeholder=\"월\"></nds-select>\n    <nds-select placeholder=\"일\"></nds-select>\n  </nds-input-group>\n</nds-form-field>",
      "dont": "<!-- htmlFor (React 표기) — vanilla HTML 에선 html-for 만 동작 -->\n<nds-form-field label=\"이름\" htmlFor=\"x\"><nds-input id=\"x\"></nds-input></nds-form-field>\n<!-- admin 인데 부모에 gap 박음 — 이중 간격 -->\n<div style=\"display:flex;flex-direction:column;gap:24px\">\n  <nds-form-field density=\"admin\">...</nds-form-field>\n  <nds-form-field density=\"admin\">...</nds-form-field>\n</div>\n<!-- 수기 flex 로 row 다중 input — InputGroup 써야 함 -->\n<nds-form-field label=\"기간\"><div style=\"display:flex;gap:12px\"><nds-input/><nds-input/></div></nds-form-field>"
    }
  },
  "FormSection": {
    "name": "FormSection",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3466-17405",
    "summary": "제목(+옵션 설명) + 보더 카드로 여러 `FormField` 를 묶는 폼 그룹 컨테이너. 캐시워크 for Business 어드민 폼 표준 — 카드 좌우 패딩은 FormSection 이, 행 간 세로 리듬(py-24)은 `FormField density=\"admin\"` 이 만든다.",
    "pitfalls": [
      "**`FormField density=\"admin\"` 과 짝으로 쓴다** — 카드 좌우 패딩은 FormSection, 행 세로 리듬은 admin FormField 담당. 일반(`density` 미지정) FormField 를 넣으면 어드민 카드의 세로 리듬이 깨진다.",
      "캐포비 어드민 전용 톤 — 일반 서비스(Trost/Geniet/NudgeEAP/Runmile) 모바일·웹 폼에 쓰면 보더 카드가 과하다. 그쪽은 FormField 를 바로 쌓는다.",
      "**색·radius 를 hex 로 박지 말 것** — 흰 배경·1px subtle 보더·radius 는 `data-project=\"cashwalk-biz\"` cascade 로 자동 매핑된다.",
      "`title` 은 섹션 머리글(Headline3 24 Bold) — **페이지 제목으로 쓰지 말 것**. 페이지 제목은 `pattern:page-header`(Heading 조합).",
      "카드 한 장 = 의미상 한 그룹(기본 정보 / 결제 정보 …). 관련 없는 필드를 한 FormSection 에 몰지 말고 섹션을 나눈다."
    ],
    "recommended": [
      "캐포비 어드민 등록/수정 폼: 의미 그룹마다 FormSection 한 장, 안에 admin FormField 행을 쌓기",
      "그룹 머리말이 필요하면 `description` 으로 보조 설명 (1줄 권장)"
    ],
    "examplesHtml": {
      "do": "<nds-form-section title=\"기본 정보\" description=\"회원에게 표시되는 정보입니다\">\n  <nds-form-field density=\"admin\" label=\"이름\"><input slot=\"control\" /></nds-form-field>\n  <nds-form-field density=\"admin\" label=\"연락처\"><input slot=\"control\" /></nds-form-field>\n</nds-form-section>",
      "dont": "<!-- 일반 FormField 를 admin 카드에 — 세로 리듬(py-24)이 안 맞음. density=\"admin\" 사용 -->\n<nds-form-section title=\"기본 정보\">\n  <nds-form-field label=\"이름\"><input slot=\"control\" /></nds-form-field>\n</nds-form-section>"
    }
  },
  "Header": {
    "name": "Header",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=96-25918",
    "sizeMatrix": {
      "root/compact": "min-height 56 / bottom border 1px subtle / flex 좌·중·우",
      "root/webview": "min-height 56 / border none / title 절대중앙 + back left",
      "root/transparent": "min-height 56 / 배경 투명 / border none",
      "root/web": "height 80 / bottom border 1px subtle / content max-width 1200 / grid 3열 (1fr auto 1fr)",
      "logo": "web: height 60 / max-width 200 / object-fit contain — compact: 자유 (props 로 사이즈 지정)",
      "menu-item": "h 100% / px var(--semantic-inset-card-large) / headline-5(18·26) bold / 활성 시 project 색 + bottom 3px",
      "download-btn": "px 14 / py 8 / radius 8 / bg surface.subtle / body-1 bold project",
      "auth-btn": "px 18 / py 8 / radius 8 / 1px project border / body-1 bold project"
    },
    "stateMatrix": {
      "menu-item/default": "color textRole.strong",
      "menu-item/hover": "color textRole.brand",
      "menu-item/active": "color textRole.brand + 3px project 하단 보더",
      "download/hover": "bg surface.disabled",
      "auth/hover": "bg surface.brandSubtle"
    },
    "summary": "base 헤더. variant 로 분기: compact(모바일 56px flex) / webview(56px, title 중앙 + back) / transparent(56px, 배경 투명) / web(데스크탑 80px grid 3열, max-width 1200). 프로젝트 화면이면 base Header 가 아니라 project chrome (TrostAppBar / NudgeEAPWebHeader / CashwalkBizWebHeader 등) 사용.",
    "pitfalls": [
      "variant 선택: 모바일 헤더는 variant='compact', 데스크탑 웹 헤더는 variant='web'. 'web' 이 grid 3열 + 80px + 1200 max-width 의 그 헤더.",
      "Logo 는 src 기반 <img> 폴백 또는 children 으로 SVG 컴포넌트 직접 박기 — 둘 다 미지정 시 빈 영역. NudgeEAP 처럼 SVG 로고가 있으면 children 권장(선명함).",
      "메뉴 활성 표시는 activeKey 또는 MenuItem 의 active prop — 인라인 border-bottom 금지.",
      "Auth 슬롯이 두 종류: 배열형(Header.AuthMenu — 로그인+회원가입 동시) vs 단일형(Header.AuthButton — 로그인/로그아웃 토글). 화면 디자인에 맞게 골라쓰기.",
      "프로젝트 색은 tokens.css 가 자동 — 인라인 색상 override 금지. 클라이언트 로고만 per-tenant 이미지로 src/href 주입."
    ],
    "recommended": [
      "데스크탑 웹: <Header variant='web' maxWidth={1200}>\n  <Header.Logo src=tenantLogo href='/' alt='AMORE PACIFIC' />\n  <Header.Menu items={GNB} activeKey={current} onItemClick={navigate} />\n  <Header.Actions>\n    <Header.AppDownloadButton href='/download' />\n    <Header.AuthButton authState={isLoggedIn ? 'logout' : 'login'} onClick={...} />\n  </Header.Actions>\n</Header>",
      "모바일 / AppBar 컨텍스트: <Header variant='compact'>\n  <Header.MainBar>\n    <Header.Logo src=logo href='/' />\n    <Header.AuthMenu items={authItems} separator='none' />\n  </Header.MainBar>\n</Header>",
      "Webview (뒤로가기 + 타이틀): <Header variant='webview' title='상세' leftSlot={<Header.BackButton onClick={onBack} />} />",
      "2단 desktop (Trost 패턴): MainBar(logo+search+auth) + Divider + NavBar(menu+trending) + Divider 컴파운드"
    ],
    "accessibility": [
      "Logo 는 <a href> 로 감싸 홈 진입 보장. alt 에 클라이언트 이름 명시.",
      "Menu 는 <nav> 로 노출. 각 item 은 href 있으면 <a>, 없으면 <button>. onItemClick 호출 시 href 있는 경우 preventDefault 자동.",
      "AuthButton 은 authState 가 의미 라벨('로그인'/'로그아웃')을 결정. aria-label 자동 부착.",
      "Webview variant 의 BackButton 은 aria-label='뒤로가기' 기본."
    ],
    "interactivePattern": "Logo / Menu / Actions / AuthMenu 안의 모든 버튼·링크에 onClick 또는 href 부착. position='sticky' 로 스크롤 시 상단 고정 가능 (z-index 자동).",
    "examplesHtml": {
      "do": "<nds-header variant=\"solid\" position=\"fixed\" elevated>\n  <nds-header-main-bar>\n    <nds-header-logo>NudgeEAP</nds-header-logo>\n    <nds-header-actions>\n      <nds-icon-button aria-label=\"알림\"><svg>…</svg></nds-icon-button>\n    </nds-header-actions>\n  </nds-header-main-bar>\n</nds-header>",
      "dont": "<!-- raw <header> 에 인라인 스타일로 흉내 — 토큰/elevated 그림자가 안 들어감 -->\n<header style=\"position:fixed;background:#fff\">…</header>"
    }
  },
  "Heading": {
    "name": "Heading",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=859-5614",
    "summary": "헤딩 + 보조 설명(description) 표준 블록. level (h1~h5) 만 결정하면 헤딩 폰트와 Gap/Title 토큰이 자동 적용 — Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반. description 을 생략하면 순수 헤딩으로 동작한다.",
    "pitfalls": [
      "헤딩 + 설명 묶음에는 직접 <h{n}> + <p> + margin-top 으로 짜지 말 것. level↔gap 미스매치(h4 에 12px gap 등) 가 생기는 가장 흔한 안티패턴.",
      "h4/h5 가 '★ 가장 자주' — 카드 헤딩(h4 · gap 6) / 서브 헤딩(h5 · gap 8). h1~h3 은 페이지 단위 hero / 큰 섹션 / 페이지 헤더.",
      "description 폰트도 level 에 묶여 자동 결정: h1~h3 = Body3(14px), h4~h5 = Caption1(13px). 다른 사이즈가 필요하면 Heading 을 쓰지 말고 raw 헤딩으로.",
      "위계가 같은 자리에서는 같은 level 유지. h4 카드 헤딩들 사이에 h2 가 끼면 시각적 위계 망가짐.",
      "Card 안에 Heading 을 중첩해서 쓰는 패턴이 정상. 페이지 제목은 단일 컴포넌트가 아니라 `pattern:page-header`(Heading `level=\"h2\" as=\"h1\"` + Breadcrumb + actions 조합)로 조립한다.",
      "`as` 는 비주얼은 level 그대로 두고 DOM 헤딩 태그만 바꿀 때만. 예: 페이지 랜드마크가 h1 이어야 하는데 폰트는 h2 스케일 → level='h2' as='h1'. 평소엔 쓰지 말 것 — level 과 태그가 어긋나면 접근성 위계가 흐트러진다."
    ],
    "recommended": [
      "카드 헤딩 (★ 가장 자주): <Heading level='h4' title='바로 상담하기' description='급한 문제는 5분 내 바로 상담' />",
      "서브 헤딩 (★ 가장 자주): <Heading level='h5' title='오늘의 루틴' description='...' />",
      "Hero 영역: <Heading level='h1' title='마음까지 건강한 업무환경' description='...' />",
      "단독 헤딩: description 생략 — 헤딩 + Gap 만 토큰화하고 싶을 때."
    ],
    "examplesHtml": {
      "do": "<nds-heading level=\"h2\" title=\"이번 주 미션\" description=\"작은 변화부터 시작해요\"></nds-heading>",
      "dont": "<!-- level 누락 -> 기본값이 적용돼 페이지 위계가 무너짐 -->\n<nds-heading title=\"…\"></nds-heading>"
    }
  },
  "IconButton": {
    "name": "IconButton",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8560",
    "sizeMatrix": {
      "x-large": "box 36 / icon 28 (padding 4)",
      "large": "box 32 / icon 24 (padding 4)",
      "medium": "box 28 / icon 20 (padding 4)",
      "small": "box 24 / icon 16 (padding 4)"
    },
    "stateMatrix": {
      "hover": "bg #F5F5F5 (neutral/100), radius 4",
      "disabled": "icon color = text/disabled (Figma에는 미정의)"
    },
    "summary": "아이콘만 있는 버튼 (Figma Library node 171:8560 기준). 접근성을 위해 aria-label 필수.",
    "pitfalls": [
      "aria-label 누락 시 스크린리더가 읽지 못함 (prop 강제됨).",
      "AppBar 우측 빈 영역에 ChevronRight 같은 장식만 두지 말 것 — 인터랙션 없이 시각적 잡음.",
      "Figma 명세에 disabled 상태가 없음 — disabled 가 필요한 흐름이면 Button(icon-only 처리) 또는 Tooltip 으로 우회."
    ],
    "recommended": [
      "AppBar 우측엔 알림/설정 같은 실제 기능 IconButton을 두기.",
      "<IconButton icon={<PushIcon/>} aria-label='알림' onClick={...}>"
    ],
    "examplesHtml": {
      "do": "<nds-icon-button size=\"md\" aria-label=\"알림\">\n  <svg viewBox=\"0 0 24 24\" fill=\"currentColor\">…</svg>\n</nds-icon-button>",
      "dont": "<!-- aria-label 없는 아이콘 단독 버튼: 스크린리더가 \"button\" 만 읽음 -->\n<nds-icon-button size=\"md\"><svg>…</svg></nds-icon-button>\n<!-- raw <button> 으로 아이콘 버튼 흉내. 토큰/사이즈 룰 적용 안 됨 -->\n<button class=\"icon-btn\"><svg>…</svg></button>"
    }
  },
  "ImageUpload": {
    "name": "ImageUpload",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3078-617",
    "sizeMatrix": {
      "previewBox": "150 × 150 · border-radius md(8) · object-cover",
      "uploadButton": "135 × 44 · fill.neutralSubtle bg · text.normal · radius md(8) · body2 Medium",
      "helperRow": "caption1 Regular · text.subtle (error 상태에서 text.statusError + 14px ic/error)",
      "sizeHint": "caption1 Regular · text.subtle",
      "gapPreviewCol": "8px (spacing[8]) — preview ↔ helper",
      "gapRightCol": "12px (spacing[12]) — uploadButton ↔ sizeHint",
      "gapBetweenCols": "24px (spacing[24]) — preview col ↔ right col"
    },
    "stateMatrix": {
      "empty": "dashed border.normal + surface.subtle bg + 'No Image' (text.muted body3)",
      "uploaded": "solid border.normal + 이미지 cover + 우상단 X 버튼(InputdeleteIcon, fill.statusError circle)",
      "error": "dashed fill.statusError + surface.statusError bg + 'No Image' text.statusError + helper 아이콘(ic/error 14px) + errorText"
    },
    "usagePolicy": {
      "useFor": [
        "캐시워크 포 비즈니스 admin 의 콘텐츠/상품/배너 등록 폼 단일 이미지 슬롯",
        "권장 사이즈 명시가 필요한 업로드 영역 (예: 200×200, 4:3)",
        "user-app 에서도 호환 — 시멘틱 토큰 cascade 로 자동 프로젝트 톤"
      ],
      "doNotUseFor": [
        "다중 이미지 (gallery / carousel) — 별도 multi-uploader 컴포넌트",
        "사용자 아바타 업로드 — Avatar + 별도 modal 패턴",
        "파일(비이미지) 업로드 — AttachmentItem / 별도 컴포넌트"
      ],
      "limits": {
        "previewSize": "150×150 (변경 비권장)",
        "uploadButtonSize": "135×44 (변경 비권장)",
        "states": 3
      }
    },
    "summary": "캐시워크 포 비즈니스 admin 의 단일 이미지 업로드 위젯. 150×150 preview + 우측 업로드 버튼(135×44) + 사이즈 안내 가로 레이아웃. state(empty/uploaded/error) 별 시각 분기.",
    "pitfalls": [
      "`<input type=\"file\">` 는 internal trigger — 외부에서 별도 file picker 를 마운트하거나 `onUploadClick` 안에서 직접 input.click() 호출 금지.",
      "Error 상태에서 박스 전체를 빨갛게 칠하지 말 것 — gauge: dashed `fill.statusError` border + soft `surface.statusError` bg. 단색 빨강은 가이드 위반.",
      "`state=\"uploaded\"` 인데 `imageUrl` 을 안 넘기면 placeholder 가 그대로 노출. controlled 로 쓸 땐 항상 묶어서 관리(미리보기만 필요하면 `autoPreview`/`auto-preview` 로 자동화).",
      "**미리보기 자동화는 `autoPreview`(React) / `auto-preview`(HTML) opt-in** — 켜면 파일 선택 시 첫 이미지를 `URL.createObjectURL` 로 즉시 렌더하고 X 로 해제, revoke·언마운트 정리까지 내부 처리. 단순 미리보기에 `FileReader`/state 보일러플레이트를 손으로 짜지 말 것. **단, `imageUrl`(React)/`image-url`(HTML)을 직접 넘기는 controlled 사용이면 그 값이 우선**하고 자동 미리보기는 비활성 — 서버 업로드 후 CDN URL 을 보여주는 흐름은 여전히 controlled 로.",
      "다중 업로드가 필요하면 이 컴포넌트를 N 개 늘어놓지 말고 별도 갤러리/멀티 업로더로 분기. `multiple` prop 은 OS picker 차원만 지원(미리보기는 단일 이미지 1장 — `autoPreview` 도 `files[0]` 만 렌더).",
      "우상단 X 버튼은 `onRemove` 가 있어야만 노출 — uploaded 상태에서도 onRemove 없으면 안 보임. (예외: `autoPreview` 모드는 onRemove 없이도 내부 해제용 X 가 노출됨.)"
    ],
    "recommended": [
      "기본(controlled · 서버 URL): <ImageUpload state={state} imageUrl={url} onFileSelect={files => upload(files[0])} onRemove={() => reset()} />",
      "미리보기만(uncontrolled): <ImageUpload autoPreview onFileSelect={files => upload(files[0])} /> — state/imageUrl 없이 선택 즉시 미리보기. HTML 은 <nds-image-upload auto-preview>.",
      "권장 사이즈 안내가 다르면 `sizeHint=\"4:3 / 1024×768 권장\"` 같이 명시.",
      "Error 메시지를 도메인별 카피로: `errorText=\"이미지를 등록해 주세요.\"`."
    ],
    "accessibility": [
      "우상단 X 버튼: `aria-label=\"이미지 제거\"` 자동 부착.",
      "Error 상태 helper 의 14px InfoIcon 은 장식 — text 가 의미를 그대로 전달.",
      "file picker 트리거는 standard `<input type=\"file\">` — 키보드 접근(Enter/Space) 자동 지원."
    ],
    "examplesHtml": {
      "do": "<!-- 미리보기만 빠르게: auto-preview 면 선택 즉시 컴포넌트가 objectURL 로 렌더 -->\n<nds-image-upload auto-preview accept=\"image/*\"\n  upload-label=\"사진 추가\" size-hint=\"JPG/PNG · 최대 5MB\"></nds-image-upload>\n<script>el.addEventListener(\"file-select\", e => upload(e.detail.files));</script>\n<!-- 서버 URL 로 controlled: state/image-url 을 직접 관리 -->\n<nds-image-upload state=\"uploaded\" image-url=\"https://cdn/...png\"></nds-image-upload>",
      "dont": "<!-- ① auto-preview 없이 state 를 그대로 두면 upload 끝나도 미리보기 안 뜸 -->\n<nds-image-upload state=\"empty\"></nds-image-upload>  <!-- file-select 만 듣고 image-url/state 미갱신 → 영영 empty -->\n\n<!-- ② 사진 첨부를 버튼+숨김 input 으로 직접 조립 — 미리보기/사이즈안내/상태를 다시 짜야 한다.\n     → nds-image-upload(auto-preview) 한 줄로 끝. 직접 만들지 말 것 -->\n<button onclick=\"document.querySelector('#file').click()\">사진 첨부</button>\n<input id=\"file\" type=\"file\" hidden>"
    }
  },
  "Input": {
    "name": "Input",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903",
    "sizeMatrix": {
      "default": "height 48 / padding 16·13 / wrapper gap 10 / radius 8",
      "field": "height 48 / 같은 토큰, label-gap 8 — 폼-행 변형(라벨갭만 타이트). 캐포비 admin TextField 도 48(Figma 3082:846)."
    },
    "stateMatrix": {
      "default": "border #D8D8D8 / bg white / placeholder #999",
      "typing": "border var(--semantic-border-focus-default) (cv.border.focus) / text var(--semantic-text-strong-default) (cv.text.normal)",
      "error": "border #F13F00 (cv.error.main) / helper color same",
      "disabled": "border #D8D8D8 / bg #FAFAFA (cv.bg.light) / text #999",
      "complete": "border #D8D8D8 / bg white / helper variant=success(=primary blue)"
    },
    "summary": "1px 보더, 흰 배경, 48px 높이. label/wrapper(field+addon)/helper 의 compound 구조 (Figma Library node 171:9903 기준).",
    "pitfalls": [
      "검색 변형이 필요하면 SearchInput을 사용. Input에 SearchIcon을 직접 박지 말 것.",
      "**매 키 입력마다 value 를 재포맷하지 말 것** — `input` 이벤트에서 천단위 콤마/단위를 붙여 `el.value` 를 되쓰면 nds-input 의 내부 controlled 상태와 충돌해 커서가 튀고 한 글자만 입력되거나 수정이 막힌다(회귀: 입찰단가/예산 콤마 라이브 포맷으로 '한 글자 이상 입력·수정 불가'). 금액·수량은 콤마·단위·clamp 가 내장된 **AmountInput(`<nds-amount-input>`)** 을 쓰고(검증룰 amount-as-text-input 이 일반 금액 input 자체를 막음), 굳이 일반 input 이면 포맷은 blur 시점이나 제출 시 파싱으로 미루고 입력 중에는 raw 값을 그대로 유지하라.",
      "입력 패밀리 typography 는 **Input Typography 표준(Figma 4247:1964 · 프로젝트 무관)** 으로 통일 — **라벨 = 13/18 Medium**, **값·placeholder = 15/22 Regular**, **헬퍼·에러 = 13/18 Regular**. 컴포넌트가 `--semantic-input-typography-{label,value,helper}`(size+lineHeight 묶음) + 분리된 `-weight` 토큰을 자동 적용하니 라벨·값·헬퍼 폰트크기를 직접 덮지 말 것(명세보다 크면 폼이 산만). 카운터는 표준 외 — caption2(12/16) 유지. 색만 역할별로 다름(라벨 필수\\* = status-error · placeholder = muted · 헬퍼 = subtle · 에러 = status-error). (구 표준 \"라벨 body3 14/20 · helper caption2 12/16\" 폐지.)",
      "complete=true 와 errorMessage 를 동시에 주지 말 것 — error 가 우선이지만 success 의도가 묻힘.",
      "errorMessage/successMessage/helperText 중 하나라도 있으면 helpers 배열은 무시됨. 단일/멀티 의도를 분리해서 사용.",
      "**helperText 와 errorMessage 동시 노출 금지** (★ 핵심 룰). DS 는 우선순위 error > success > helper 로 1 줄만 표시하도록 이미 강제하지만, 가이드/스토리/목업에서도 두 줄 동시 표시한 형태로 그리지 말 것. 헬퍼는 '비어 있을 때의 안내', 에러는 '검증 실패 후의 즉시 피드백' — 의미가 충돌하고 인지 부하가 커진다. 검증 실패 순간 helper 는 같은 자리에서 error 메시지로 교체되어야 함 (자리 점프 X, 두 줄 누적 X).",
      "**글자수 카운터(24/25)** 는 `maxlength` + `show-count`(React `maxLength` + `showCount`) — 우측에 자동 노출, 초과 시 빨간색. suffix 에 직접 텍스트로 박지 말 것. (Textarea 는 maxlength 만 주면 카운터 자동.)",
      "**필드 검증 에러는 Input 인라인으로, NoticeAlert 박스로 띄우지 말 것** (★). html=`error error-message=\"...\"`, React=`error errorMessage=\"...\"` → 필드 아래 빨간 헬퍼(role=alert). 비밀번호 불일치·이메일 형식·중복 등은 전부 이 패턴(component:NoticeAlert 오용 금지).",
      "**html `error-message` / `error` 를 함께(또는 `error-message` 단독) 주어야 빨간 보더+메시지가 뜬다.** `error-message` 만 줘도 error 상태로 간주된다. (과거엔 html 이 `error-message` 를 안 봐서 조용히 실패 → 이제 관측함. `helper-text` 만 주면 회색 안내로만 뜨니 에러엔 `error-message` 를 쓸 것.)",
      "**가로 행(인풋+버튼 한 줄)에서 인풋을 늘리려면 `full-width`** — host 가 display:contents 라 `<nds-input>` 에 `style=\"flex:1\"`·`width:100%` 를 줘도 무시된다(내부 root 까지 안 닿음). `<nds-input full-width>` 면 행의 남는 폭을 채운다(세로 스택은 자동 full). React 는 `fullWidth`(기본 true).",
      "**외형 변형 `variant=\"box\"|\"line\"` — 런마일은 미지정 시 line 기본 (Figma 런마일 Text Input 5095:200)**: `line` 은 4면 박스가 아닌 **하단 1px 라인(언더라인)** · radius 0 · 좌우 패딩 0 · 높이 40 · 라벨↔필드/필드↔헬퍼 간격 6. 상태색은 box 와 동일 토큰을 따른다 — default 하단라인 gray400(#D1D6DB), **typing(포커스) = 검정(#221E1F)**(런마일 input.borderFocus, 일반 Border/Focus 파랑과 분리), error 빨강(#FF2428). 런마일(`[data-project=\"runmile\"]`)에서는 `<nds-input>`/`<Input>` 에 variant 를 안 줘도 line 으로 cascade — box 가 필요할 때만 `variant=\"box\"` 로 opt-out. 라벨/값/placeholder/헬퍼 색·폰트는 box 와 동일 Input Typography 토큰. 색을 직접 박지 말 것."
    ],
    "recommended": [
      "기본: <Input label='이메일' placeholder='example@nudge.kr' helperText='...' />",
      "검증 실패: errorMessage 사용 — role='alert' 가 자동 부착됨 (html `error error-message=\"...\"`)",
      "검증 성공: complete + successMessage — primary 컬러 헬퍼로 자동 전환",
      "달력/검색 같은 아이콘 affordance: suffix prop (24x24)",
      "Multi-helper(비밀번호 규칙 체크리스트 등): helpers={[{ text, icon?, variant? }, ...]} — 또는 compound <Input.HelperGroup><Input.Helper>…</Input.Helper>…</Input.HelperGroup>",
      "비밀번호: type='password' (HTML `type=\"password\"`) → 우측 눈 아이콘 표시/숨김 토글이 **자동** 노출(auth/로그인 화면). 끄려면 passwordToggle={false} / `password-toggle=\"false\"`. suffix 에 eye 아이콘을 손수 박지 말 것."
    ],
    "accessibility": [
      "label 은 InputLabel(자동 htmlFor 연결)을 통해 부착 — placeholder 로 대체 금지.",
      "errorMessage 가 있으면 helper 가 role='alert' 로 노출 — 스크린리더가 즉시 안내.",
      "aria-describedby 가 helperId 와 자동 연결됨 (helper 가 있을 때만).",
      "Clear 버튼은 aria-label='입력 삭제' 가 기본 제공 — readOnly/disabled 면 자동 숨김."
    ],
    "interactivePattern": "controlled/uncontrolled 모두 지원. clearable + onClear 로 값 초기화 콜백 부착. suffix slot 에 IconButton 등을 넣어도 됨 (단 onClick 핸들러 필수).",
    "examplesHtml": {
      "do": "<nds-input label=\"이메일\" placeholder=\"example@nudge.kr\" clearable></nds-input>\n<!-- 글자수 카운터(24/25): maxlength + show-count (React: maxLength + showCount) -->\n<nds-input label=\"캠페인 이름\" maxlength=\"25\" show-count></nds-input>\n<!-- 비밀번호: type=password 면 눈 토글 자동 노출 -->\n<nds-input label=\"비밀번호\" type=\"password\"></nds-input>\n<!-- 필드 검증 에러: error + error-message (NoticeAlert 박스 X) → 필드 아래 빨간 헬퍼 -->\n<nds-input label=\"비밀번호 확인\" type=\"password\" error error-message=\"비밀번호가 일치하지 않습니다.\"></nds-input>\n<!-- 인풋+버튼 한 줄: 인풋에 full-width 면 버튼 옆 남는 폭을 채움 -->\n<div style=\"display:flex; gap:8px; align-items:flex-end\">\n  <nds-input label=\"이메일\" full-width placeholder=\"example@nudge.kr\"></nds-input>\n  <nds-button>인증 메일</nds-button>\n</div>\n<script>el.addEventListener(\"input\", e => setValue(e.target.value));</script>",
      "dont": "<!-- value 와 default-value 를 동시에 설정 — controlled / uncontrolled 가 섞임 -->\n<nds-input label=\"이메일\" value=\"a@b\" default-value=\"x@y\"></nds-input>\n<!-- 글자수 카운터를 suffix 텍스트로 직접 박지 말 것 — show-count 사용 -->\n<nds-input label=\"이름\" suffix=\"0/25\"></nds-input>\n<!-- 비밀번호 눈 아이콘을 suffix 로 손수 조립 금지 — type=password 가 자동 제공 -->\n<nds-input label=\"비밀번호\" type=\"password\" suffix=\"👁\"></nds-input>\n<!-- raw <input> + className 으로 모양만 흉내 -->\n<input class=\"nds-input\" />"
    }
  },
  "InputGroup": {
    "name": "InputGroup",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3466-17405",
    "sizeMatrix": {
      "gap": "tight=8 / default=12 (Figma 캐시워크 포 비즈니스 admin 표준) / loose=16",
      "align": "stretch(기본)=모든 child flex:1 균등 / start=본래 너비"
    },
    "summary": "한 줄에 form control 여러 개를 묶는 wrapper. FormField 의 단일 child slot 에 넣어 row 다중 input 폼을 만든다 (예: 년/월/일 3-Dropdown, 이메일+도메인 2-Input).",
    "pitfalls": [
      "FormField 없이 InputGroup 만 단독 — label 없이 row 만 뜨면 의미 전달 불완전.",
      "각 child 너비를 px 로 박지 말 것 — stretch(기본)는 flex:1 균등, start 는 본래 너비. 비율 분배가 필요하면 child 에 직접 flex 설정.",
      "gap='loose'(16) 는 FormField label↔control gap 과 같음 — 시각적으로 그룹 경계가 모호. row 다중 input 은 default(12) 또는 tight(8) 권장."
    ],
    "recommended": [
      "년/월/일 3-Dropdown: <nds-form-field label='기간' label-position='left' density='admin'><nds-input-group> 안에 <nds-select> × 3",
      "이메일+도메인 2-Input: <nds-input-group gap='tight'><nds-input/><nds-input/></nds-input-group>",
      "비율이 다른 케이스 (input + 짧은 button): align='start' 로 본래 너비 유지."
    ],
    "examplesHtml": {
      "do": "<nds-form-field label=\"기간\" label-position=\"left\" density=\"admin\">\n  <nds-input-group>\n    <nds-select placeholder=\"년\"></nds-select>\n    <nds-select placeholder=\"월\"></nds-select>\n    <nds-select placeholder=\"일\"></nds-select>\n  </nds-input-group>\n</nds-form-field>",
      "dont": "<!-- FormField 없이 단독 — label 끊김 -->\n<nds-input-group><nds-input></nds-input><nds-input></nds-input></nds-input-group>\n<!-- child 너비를 px 로 — stretch 효과 깨짐 -->\n<nds-input-group><nds-input style=\"width:200px\"></nds-input></nds-input-group>"
    }
  },
  "LikeButton": {
    "name": "LikeButton",
    "summary": "좋아요 토글 + 카운트. 클릭 펑 애니메이션, 1000+는 자동 K 변환. 단일 좋아요 전용.",
    "pitfalls": [
      "liked/count는 controlled — 외부 source of truth + onChange에서 둘 다 갱신.",
      "LikeButton은 단일 좋아요 토글 전용 — 여러 종류 반응 칩 그룹 용도로 쓰지 말 것.",
      "카운트가 음수가 되지 않도록 외부 가드."
    ],
    "recommended": [
      "콘텐츠 푸터: size='md' count 자동 K",
      "CommentItem: likeAction={<LikeButton size='sm' />}",
      "primary 톤: activeColor=primary로 좋아요/북마크 같은 의미 강조"
    ],
    "examplesHtml": {
      "do": "<nds-like-button liked count=\"42\" size=\"md\"></nds-like-button>\n<script>el.addEventListener(\"nds-like-change\", e => persist(e.detail));</script>",
      "dont": "<!-- count 를 사용자가 변경한 후 서버에 반영하지 않음 — 새로고침 시 사라짐 -->\n<nds-like-button count=\"42\"></nds-like-button>  <!-- listener 없음 -->"
    }
  },
  "LikertScale": {
    "name": "LikertScale",
    "summary": "1-5 / 1-7 단계 만족도 / 동의 정도 측정. 자가검사(우울/불안), 후기, 설문에 사용. 단계당 텍스트 라벨은 최소화하고 양 끝 anchor 만.",
    "pitfalls": [
      "양 끝 anchor(start-label / end-label) 누락 — 1/5 가 좋음/나쁨 어느 쪽인지 모호.",
      "11점 이상 단계는 슬라이더(nds-slider) 가 더 적합. Likert 는 3/5/7 단계 권장.",
      "Likert 결과를 평균 점수로만 노출하지 말 것 — 분포(히스토그램) 가 의미 있는 경우가 많음."
    ],
    "examplesHtml": {
      "do": "<nds-likert-scale name=\"satisfaction\" options=\"[1,2,3,4,5]\" start-label=\"매우 불만족\" end-label=\"매우 만족\"></nds-likert-scale>\n<script>el.addEventListener(\"likert-change\", e => setValue(e.detail.value));</script>",
      "dont": "<!-- anchor 라벨 누락 — 의미 해석 불가 -->\n<nds-likert-scale name=\"x\" options=\"[1,2,3,4,5]\"></nds-likert-scale>"
    }
  },
  "List": {
    "name": "List",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=501-96",
    "references": [
      {
        "label": "Geniet List Guide — 4 Layouts",
        "url": "https://www.figma.com/design/0LLw2nSq9AUhXww7pWFRlm/?node-id=3060-82",
        "caption": "지니어트 Library · ListGuide. Default / Avatar / Thumbnail(xl·h96) / Action 4 Layout + Usage·Composition·Do/Don't. 구조는 프로젝트 무관 base 와 동일.",
        "project": "geniet"
      },
      {
        "label": "Trost List Guide — platform × layout",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5169-118",
        "caption": "트로스트 Library · ListGuide. platform(mobile/pc) × layout(default/avatar/thumbnail/action/compact/table) = 9 조합. PC 밀도(padding 24·compact 42·table 64·avatar 80·thumbnail 106) + Mobile Thumbnail 124 + inset divider + 기본 table.",
        "project": "trost"
      }
    ],
    "usagePolicy": {
      "useFor": [
        "텍스트+상태+날짜로 구성된 단순 데이터 (상담 내역·예약·알림·설정·검색 결과)",
        "10개 이상 항목의 수직 스크롤 탐색",
        "시간순 연속 정보 (알림 센터)",
        "동질적인 항목의 반복 배치 (멤버 목록, 옵션 목록)",
        "좌측 작은 썸네일 + 제목 + 메타 행 (음식·콘텐츠 검색 결과 · Thumbnail 레이아웃 size='xl')"
      ],
      "doNotUseFor": [
        "큰 이미지 중심의 그리드 시각 탐색 → Card (작은 좌측 썸네일+텍스트 한 줄 행은 List Thumbnail 레이아웃)",
        "2열 이상 그리드 비교 → Card 그리드",
        "컬럼별 비교가 핵심 → Table",
        "탭·필터·내비게이션 → Chip / Navigation",
        "장식용 (Decorative list) — Anti-pattern #7"
      ],
      "limits": {
        "titleRequired": 1,
        "maxLeadingPerRow": 1,
        "maxTrailingStatusElements": 1,
        "minTouchTargetMobile": "48px",
        "densityPerList": 1
      }
    },
    "sizeMatrix": {
      "model": "9 = platform(mobile|pc) × layout(default·avatar·thumbnail·action·compact·table). Trost 가이드 5169:118. <List platform> + <ListItem layout> 으로 지정. size(sm·md·lg·xl)는 폐기 별칭(md→default · lg→avatar · xl→thumbnail · sm→compact)으로 유지 — 기존 사용은 렌더 불변, 신규는 layout 사용.",
      "platformMobile": "터치 밀도(기본). horizontal padding 16 · gap 12 · 모든 행 min touch 48 보장. layout 별 floor → default/action 56 · avatar 72 · thumbnail 124(thumbnailMobile) · compact 56(48 미달 방지).",
      "platformPc": "마우스 고밀도. horizontal padding 24 · gap 16(table 만 24). layout 별 floor → default/action 56 · avatar 80(avatarPc) · thumbnail 106(thumbnailPc) · compact 42(compactPc) · table 64(tablePc).",
      "horizontalPadding": "mobile 16 / pc 24 (좌·우 동일)",
      "gapLeadingToContent": "mobile 12 / pc 16 (table 24)",
      "gapContentToTrailing": "mobile 12 / pc 16",
      "gapTitleToDescription": "4px",
      "gapDescriptionToMetadata": "2px",
      "gapMetadataToActionLink": "4px (Thumbnail 3번째 줄 액션 링크)",
      "minTouchTarget": "48px (모바일 필수)",
      "layoutDefault": "텍스트 + Chevron. leading 없음. mobile 56 / pc 56.",
      "layoutAvatar": "48 원형 Avatar + 이름 (+ 액션). mobile 72 / pc 80. PC 액션은 명시 Button(small·solid), mobile 우측은 chevron 기본.",
      "layoutThumbnail": "사각 썸네일 + Title/Description/Metadata (+ mobile 3번째 줄 액션 링크). mobile 124(72 썸네일+여유) / pc 106. trailing 비움.",
      "layoutAction": "텍스트 + 우측 Toggle·Checkbox·Button. mobile 56 / pc 56. 설정 토글 행.",
      "layoutCompact": "고밀도 설정·관리자. pc 42(compactPc) — PC only(모바일 48 touch 미달이라 default 로). mobile 지정 시 56 floor.",
      "layoutTable": "body 가 가로 컬럼 행(date│category│name│flex-spacer│status). pc 64(tablePc). status 텍스트 = Text/Brand. 기본 표 전용 — 정렬·페이지네이션·셀편집 등 풍부한 표는 DataTable 컴포넌트.",
      "paddingByDensity": "mobile px16/gap12 · pc px24/gap16(table gap24). 높이는 min-height floor(sizing.listRow). 짧은 행은 floor 높이, leading 이 더 크면 그만큼 자란다.",
      "typoTitle": "Body 1 Bold 16px / LH 24px — var(--font-size-body-1) · Text/Strong/Default (지니어트 Figma 목업은 15px 로 보이나 List 는 프로젝트 무관 base 표준 16px 유지 — 프로젝트 타이포 차이가 필요하면 토큰 cascade 로)",
      "typoDescription": "Body 3 Regular 14px / LH 20px — var(--font-size-body-3) · Text/Subtle/Default",
      "typoMetadata": "Caption 2 Regular 12px / LH 16px — var(--font-size-caption-2) · Text/Muted/Default",
      "dividerInsetWithLeading": "NEW layout 행(<ListItem layout=…>)에만 적용. content 시작점까지 인셋 = padding + Leading 폭 + gap. mobile avatar 48 → 16+48+12 / mobile thumbnail 72 → 16+72+12 / pc avatar 48 → 24+48+16 / pc thumbnail 80 → 24+80+16. 폐기 size 별칭만 쓰는 기존 행은 full-width divider 그대로(렌더 불변).",
      "dividerInsetTextOnly": "좌측 padding 만 — mobile 16 / pc 24"
    },
    "stateMatrix": {
      "default": "BG var(--semantic-bg-surface-default) · Text Strong/Default · Border Normal/Default",
      "hover": "BG var(--semantic-fill-neutral-subtle) · Border Normal/Default · ※ PC only (모바일 미지원)",
      "active": "BG var(--semantic-bg-surface-subtle) · Text Strong/Default · Border Normal/Default",
      "selected": "BG var(--semantic-bg-brand-subtle) · Text var(--semantic-text-brand-default) · Border var(--semantic-border-brand-default) 2px",
      "disabled": "BG Surface/Default · Text var(--semantic-text-disabled-default) · Leading(Avatar 등) opacity 35%",
      "focus": "BG Surface/Default · Border var(--semantic-border-focus-default) 2px",
      "note": "총 6 상태. 시멘틱 컬러 토큰만 사용 — raw hex/임의 색 금지."
    },
    "summary": "수직 정렬된 동질 항목의 컨테이너. <List variant='plain|card|divided' platform='mobile|pc'> + <ListItem layout='default|avatar|thumbnail|action|compact|table' leading title description metadata trailing onSelect />. Row Anatomy 3 zone: Leading(Optional · Avatar/Thumbnail/Icon/Checkbox/Radio) + Content(Required · Title 최소 1행) + Trailing(Optional · IconButton/Badge/Toggle/Chevron/TextButton, 항상 우측 정렬). 임의 스타일 변형 차단이 목적 — Card 와 달리 단순 hierarchy 를 유지.\n\nTrost 가이드(5169:118)는 밀도를 **platform × layout = 9 조합**으로 푼다. `platform`(mobile 기본 / pc 고밀도)이 padding·gap·층고를 바꾸고, `layout`이 행 구성을 정한다:\n\n- **default** — 메뉴·네비·설정. 텍스트 + 우측 Chevron. leading 없음. mobile 56 / pc 56.\n- **avatar** — 사용자·친구 목록. 48 원형 Avatar + 이름 + (액션). mobile 72 / pc 80. PC 액션은 명시 Button(small·solid), mobile 우측은 chevron 기본.\n- **thumbnail** — 음식·콘텐츠. 사각 썸네일 + Title/Description/Metadata. mobile 124(+3번째 줄 액션 링크 옵션) / pc 106. trailing 없음.\n- **action** — 설정 토글·체크박스. 텍스트 + 우측 Toggle·Checkbox·Button. mobile 56 / pc 56.\n- **compact** — 고밀도 설정·관리자. pc 42(compactPc). PC only(모바일 48 touch 미달).\n- **table** — 가로 컬럼 행(date│category│name│flex-spacer│status). pc 64. status 텍스트 = Text/Brand. **기본 표 전용** — 정렬·페이지네이션·셀편집이 필요하면 DataTable.\n\n**`size`(sm·md·lg·xl)는 폐기 별칭**으로만 유지(md→default · lg→avatar · xl→thumbnail · sm→compact). 기존 `size` 사용은 렌더링이 그대로 유지되며(byte-identical, full-width divider 유지), 신규 코드는 `layout`을 쓴다. `layout`을 명시한 행에만 inset divider·PC 밀도가 적용된다.",
    "pitfalls": [
      "[Figma 권위 룰 #1] 리스트는 카드보다 단순 hierarchy 유지 — Row 에 카드 수준의 elevation/shadow/border 적용 금지.",
      "[Figma 권위 룰 #2] Trailing 요소는 항상 우측 정렬. Content 영역을 침범하는 레이아웃 금지.",
      "[Figma 권위 룰 #3] Divider 는 Content 시작 지점 기준 인셋 — `layout`을 지정한 신규 행은 자동으로 inset divider 가 적용된다(Leading 있으면 padding + Leading 폭 + gap, 없으면 padding 만). 폐기 `size` 별칭만 쓰는 기존 행은 backward-compat 으로 full-width divider 유지 → 인셋이 필요하면 `layout`으로 전환.",
      "[Figma 권위 룰 #4] 한 Row 에 Badge/Chip/Status 2개 이상 상태 요소 동시 배치 금지 — Trailing 슬롯엔 한 종류만.",
      "[Figma 권위 룰 #5] 카드형 리스트 남발 금지 — 각 Row 에 독립 card 스타일(radius + shadow) 적용 X. 그룹화가 필요하면 variant='card' 또는 'divided' 로.",
      "[Figma 권위 룰 #6] Random Padding 금지 — Spacing 규칙(아래 sizeMatrix) 외 임의 padding/margin 적용 X.",
      "[Figma 권위 룰 #7] Decorative List 금지 — 정보 전달 목적 없는 장식 요소를 Row 에 추가하지 말 것.",
      "[Figma 권위 룰 #8] 한 List = 하나의 platform + 하나의 layout. platform(mobile/pc)·layout(default/avatar/thumbnail/action/compact/table)을 같은 리스트 안에서 섞지 말 것. default + thumbnail 혼용, mobile + pc 혼용 모두 시각 혼란.",
      "[Figma 권위 룰 #9] 리스트 Row 안에 다른 컴포넌트(Card 등) 끼워넣기 금지 — List 는 동질 행의 단순 반복. 카드형 시각 탐색이 필요하면 Card 그리드로 분리.",
      "[Figma 권위 룰 #10] 한 Row 에 액션 버튼 2개 이상 금지 — 명확한 단일 액션. (Trailing 슬롯 1종 원칙 #4 의 연장.)",
      "Avatar/Thumbnail leading 은 정사각(1:1) 비율만 — 다른 비율 사용 금지. Thumbnail 은 72×72 radius8, Avatar 는 원형 48.",
      "Compact(layout='compact' · pc 42)는 PC only — 모바일 Min Touch Target 48px 미달이므로 모바일에선 default(56) 이상. `<List platform='pc'>` 안에서만 사용.",
      "Table(layout='table')은 **기본 표 전용** — 단순 컬럼 나열(date│category│name│status). 정렬·페이지네이션·고정 헤더·셀 편집·확장행 등 풍부한 표 기능이 필요하면 List 가 아니라 **DataTable** 컴포넌트로. List table 에 그 기능을 직접 붙이지 말 것.",
      "PC 행의 액션은 명시 **Button(size='sm' · variant='solid')** — mobile 의 chevron/액션 링크와 달리 PC 는 hover 만으론 행동 유도가 약하므로 가시적 버튼. Action 행의 Toggle 은 platform 무관.",
      "Title 은 Content 의 Required 요소 — Description/Metadata 만 있는 Row 금지. 최소 Title 한 줄.",
      "Avatar + Thumbnail 같은 Leading 슬롯 안에 2종 동시 배치 금지 — Leading 은 단일 식별자.",
      "Row 의 클릭은 ListItem 의 `onSelect` 사용 — raw <li onClick> 금지. onSelect 가 있으면 자동으로 button 역할 + 키보드 포커스 처리.",
      "리스트 제목·\"더 보기\" 푸터·Pagination 은 `List` 의 `header`/`footer` 슬롯에 넣는다 — ListItem(Row)으로 위장하거나 리스트 밖 형제로 두지 말 것. header/footer 는 role=presentation 이라 리스트 항목 수에 안 잡힌다."
    ],
    "recommended": [
      "헤더/푸터 슬롯: <List header={<span>리뷰 47</span>} footer={<Button fullWidth variant='outlined'>더 보기 (전체 47)</Button>}> — 리스트가 제목·더보기·Pagination 을 직접 소유. 리뷰 등 카드형 나열은 `pattern:review-list` 참조.",
      "기본 사용: <List variant='divided'><ListItem leading={<Avatar/>} title='제목' description='설명' trailing={<ChevronRightIcon/>} onSelect={…} /></List>",
      "PC 설정 화면 (Compact 40): <List variant='plain'><ListItem size='sm' leading={<Icon/>} title='설정 항목' trailing={<Toggle/>} /></List> — 정보 밀도 우선.",
      "검색 결과 (Default 56): <List variant='divided'><ListItem leading={<Avatar/>} title='이름' trailing={<ChevronRightIcon/>} onSelect={…} /></List>",
      "프로필 목록 (Comfortable 72, Avatar+Title+Description): <List variant='divided'><ListItem size='lg' leading={<Avatar size='lg'/>} title='이름' description='역할 · 메타' trailing={<TextButton/>} onSelect={…} /></List>",
      "음식·콘텐츠 (Thumbnail 96): <List variant='divided'><ListItem size='xl' leading={<썸네일 72×72 radius8/>} title='음식 이름' description='상세 설명 한 줄' metadata='320 kcal · 4.5 ★ · 리뷰 128' onSelect={…} /></List> — 좌측 72 썸네일 + Title/Description/Metadata. trailing 비움.",
      "알림/일정 등 날짜 보조 정보: <ListItem leading={<Avatar/>} title='제목' description='설명' metadata='2026.05.20' trailing={<ChevronRightIcon/>} onSelect={…} /> — metadata 는 Caption 2/Muted 로 description 아래에 작게 표시.",
      "그룹화: variant='card' (외곽 보더+radius) 또는 'divided' (Row 간 inset divider). Row 마다 개별 card 스타일은 금지(#5). 의미 그룹 사이는 Section Header(Body3 Medium · Text/Muted · 좌측 16 padding) + Gap/Section(40) 또는 분리 배경으로 끊는다.",
      "상황 → Layout 매핑: 마이페이지·설정 메뉴·FAQ·약관 → default / 친구·팔로워 목록 → avatar / 음식 검색·식단·콘텐츠 → thumbnail / 알림·다크모드 ON·OFF → action(Toggle) / 관심사·필터 체크 → action(Checkbox) / 관리자 고밀도 설정 → compact(PC) / 단순 표(날짜·구분·이름·상태) → table(PC).",
      "(Trost) PC Avatar + 명시 Button: <List platform='pc'><ListItem layout='avatar' leading={<Avatar/>} title='이름' description='역할' trailing={<Button size='sm' variant='solid'>예약</Button>} /></List> — h80, padding 24.",
      "(Trost) PC Table(기본 표): <List platform='pc'><ListItem layout='table' onSelect={…}><span data-col='date'>2026.05.20</span><span data-col='category'>개인 상담</span><span data-col='name'>김민지 상담사</span><span data-col='status'>완료</span></ListItem></List> — body 가 가로 행, name 이 flex-spacer, status 는 project 색. 풍부한 표는 DataTable.",
      "(Trost) PC Compact: <List platform='pc'><ListItem layout='compact' title='푸시 알림' trailing={<Toggle/>} /></List> — h42 고밀도, PC only.",
      "(Trost) Mobile Thumbnail + 액션 링크: <List platform='mobile'><ListItem layout='thumbnail' leading={<썸네일 72/>} title='메뉴' description='설명' metadata='320 kcal · 4.5 ★' actionLink='주문 다시하기' onActionLinkSelect={…} /></List> — h124, metadata 아래 project 색 인라인 링크(metadata 와 구분). onActionLinkSelect 는 Row onSelect 와 분리(stopPropagation).",
      "빈 상태 / 로딩: Empty 는 placeholder 이미지 + 안내 문구, Loading 은 Skeleton(Gray/100 BG) 으로 행 자리를 차지."
    ],
    "accessibility": [
      "onSelect 가 있는 ListItem 은 자동으로 button 시멘틱 + 키보드 Enter/Space 핸들링. raw <li onClick> 대체 금지.",
      "Disabled Row 는 aria-disabled 자동 + 키보드/마우스 인터랙션 비활성. 시각적으로도 Leading opacity 35%.",
      "Focus 는 2px border-focus 로 표시 — outline 제거 금지.",
      "Avatar Leading 의 <img> 에는 alt 필수 (장식이면 alt=''). Title 과 중복되는 alt 는 비우기."
    ],
    "interactivePattern": "ListItem 의 onSelect 로 인터랙티브화 — 자동으로 button role + 키보드 포커스. Trailing 슬롯 안에 별도 Button/IconButton 두면 그 핸들러에서 e.stopPropagation() 호출해 Row 전체 클릭과 분리. Hover 는 PC only (모바일 미지원) — 모바일에선 active(터치 시 BG Surface/Subtle) 로만 피드백.",
    "examplesHtml": {
      "do": "<nds-list>\n  <nds-list-item interactive>설정 항목 1</nds-list-item>\n  <nds-list-item interactive active>설정 항목 2</nds-list-item>\n</nds-list>\n<script>list.addEventListener(\"list-item-select\", e => …);</script>\n\n<!-- Trost: platform + layout (opt-in). table 은 body 컬럼을 직접 author -->\n<nds-list platform=\"pc\">\n  <nds-list-item layout=\"table\" interactive>\n    <div class=\"nds-list-item__body\" data-layout=\"table\">\n      <span data-col=\"date\">2026.05.20</span>\n      <span data-col=\"category\">개인 상담</span>\n      <span data-col=\"name\">김민지 상담사</span>\n      <span data-col=\"status\">완료</span>\n    </div>\n  </nds-list-item>\n</nds-list>",
      "dont": "<!-- nds-list-item 가 아닌 raw <li> 를 직접 넣음 — 위계/사이즈가 깨짐 -->\n<nds-list><li>설정 1</li></nds-list>"
    }
  },
  "MediaCard": {
    "name": "MediaCard",
    "summary": "이미지 위 / 콘텐츠 아래 세로형 카드. 슬롯 기반 (image · imageOverlay · eyebrow · title · body · footer) + 별점 헬퍼. 콘텐츠/리뷰/강의/상담사 카드처럼 '미디어 + 메타' 패턴 전반에 사용. 가로 스크롤(모바일) · 그리드(데스크탑) 모두 같은 컴포넌트.",
    "pitfalls": [
      "이미지 비율은 imageAspectRatio 로만 조절 — 기본 '4 / 3'. 영상 썸네일은 '16 / 9', 정사각 그리드는 '1 / 1'.",
      "title 은 자동 2줄 클램프, body 도 자동 2줄 클램프 — 외부에서 슬라이스 가공 불필요.",
      "imageOverlay 는 우하단 단일 라벨용 (예: '999+', '02:13'). 좌상단 배지/랭킹은 ProductCard 의 rankingNumber 를 쓰거나 image 슬롯에서 직접 그릴 것.",
      "rating 은 0-5 number — footer 영역에 별 5개 자동 렌더. 0.25 단위 반올림이라 정밀한 0.5 표현은 ReviewCard 사용.",
      "footer 와 rating 은 동시 사용 가능 — footer 가 위, rating 이 아래 row 로 stack. 작성자/메타는 footer 안에 자유 조립.",
      "onCardClick 지정 시 role='button' + Enter/Space 핸들링 자동. CTA 버튼을 footer 에 넣을 때는 e.stopPropagation() 필요.",
      "장문 설명/리치 본문은 Card 사용. MediaCard 는 미디어가 시각 hero 인 진열용.",
      "상품 진열(할인율/가격/적립)은 ProductCard — MediaCard 로 가격 패턴을 흉내내지 말 것."
    ],
    "recommended": [
      "기본: <MediaCard image={<img src=\"…\" />} eyebrow=\"아임닭\" title=\"닭 무침\" body=\"…\" rating={4.5} footer={authorRow} onCardClick={…} />",
      "오버레이: <MediaCard image={…} imageOverlay=\"999+\" title=\"…\" />  // 우하단 라벨",
      "영상 썸네일: <MediaCard imageAspectRatio=\"16 / 9\" imageOverlay=\"02:13\" image={…} title=\"…\" />",
      "그리드: grid-template-columns: repeat(4, 1fr) + gap 16 (데스크탑 4-up).",
      "가로 스크롤: flex + overflow-x:auto + 각 카드 flex:0 0 160px (모바일).",
      "푸터 조립: avatar+name row + meta row 를 footer 슬롯에 직접 — DS가 author/meta props 를 박지 않은 이유."
    ],
    "examplesHtml": {
      "do": "<nds-media-card image-src=\"/cover.jpg\" eyebrow=\"추천\"\n  card-title=\"명상 시작하기\" body=\"3분짜리 호흡 명상\" rating=\"4.6\" clickable></nds-media-card>\n<script>el.addEventListener(\"nds-media-card-click\", () => navigate(\"/media/1\"));</script>",
      "dont": "<!-- body 를 slot 으로 — attribute 사용 -->\n<nds-media-card image-src=\"/c.jpg\" card-title=\"A\"><p slot=\"body\">…</p></nds-media-card>"
    }
  },
  "MediaThumbnail": {
    "name": "MediaThumbnail",
    "summary": "일반 이미지 표준 — aspectRatio + fit + rounded + lazy + fallback + placeholder. Avatar(사람 얼굴)와 다른 콘텐츠 이미지용.",
    "pitfalls": [
      "Avatar는 사람 얼굴/이니셜 전용 — 콘텐츠 썸네일·검사 결과 이미지·일반 이미지는 MediaThumbnail.",
      "aspectRatio 미지정 시 부모 너비에 따라 의도치 않은 높이가 잡힐 수 있음 — 카드/그리드에서는 명시 권장.",
      "alt는 필수 — 장식 이미지면 빈 문자열(alt=\"\") 명시.",
      "fallbackSrc는 onError 시 한 번 시도 → 그래도 실패면 placeholder. 무한 루프 방지를 위해 fallback 자체가 또 실패하면 placeholder만 표시.",
      "rounded=\"pill\"는 정사각형(aspectRatio=\"1/1\")과 함께 써야 자연스러움 — 직사각형에 pill은 길쭉한 알약 모양."
    ],
    "recommended": [
      "콘텐츠 카드 썸네일: aspectRatio=\"16/9\" rounded=\"md\"",
      "리스트 썸네일: aspectRatio=\"1/1\" rounded=\"md\" width=64",
      "프로필성 이미지지만 Avatar로 처리 어려운 케이스: aspectRatio=\"1/1\" rounded=\"pill\""
    ],
    "examplesHtml": {
      "do": "<nds-media-thumbnail src=\"/thumb.jpg\" alt=\"썸네일\"\n  width=\"120\" fit=\"cover\" rounded=\"md\"></nds-media-thumbnail>",
      "dont": "<!-- alt 누락 + fallback 없음 — 로드 실패 시 빈 박스 -->\n<nds-media-thumbnail src=\"/thumb.jpg\"></nds-media-thumbnail>"
    }
  },
  "Modal": {
    "name": "Modal",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9899",
    "references": [
      {
        "label": "Trost Modal & Popup Guide — 4 variants (Compact/Default × Destructive/Positive)",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9899",
        "caption": "트로스트 모달 가이드. Positive=프로젝트 노랑",
        "project": "trost"
      },
      {
        "label": "CashwalkBiz Admin Modal Guide — 4 patterns",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3418-471",
        "caption": "Cashwalk for Business · ModalGuide. Single / Dual / With Close / Confirm+Slot 4가지 슬롯 기반 admin 패턴 SSOT.",
        "project": "cashwalk-biz"
      },
      {
        "label": "CashwalkBiz ⑥ 선택/피커 모달 — 지역 선택 (SSOT)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-50116",
        "caption": "대형 2컬럼 선택 모달(좌 검색+체크박스 트리 / 우 SelectedItemsPanel) + 본문 풀폭 옐로우 '적용' CTA. dimensions.selectionModal SSOT. (빈 셸 3001-50787 의 400centered·radius10 적용 버튼은 오류.)",
        "project": "cashwalk-biz"
      },
      {
        "label": "CashwalkBiz ⑦ 데이터 로더 모달 — 소재 불러오기",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-32822",
        "caption": "대형 선택형 DataTable 모달(행 radio 선택 + 페이지네이션 + 'N개씩 보기') + 푸터 취소(outlined)/불러오기(검정 pill). dimensions.dataLoaderModal SSOT.",
        "project": "cashwalk-biz"
      }
    ],
    "matrixOverrides": {
      "cashwalk-biz": {
        "dimensions": {
          "width": "480px (PC admin desktop · base 332/294 와 다름)",
          "radius": "16px (base 8)",
          "padding": "32px 균등 (base 비대칭 28/16/16)",
          "gapBodyToFooter": "20px (base 24)",
          "buttonHeight": "48px pill · 폭 128px 고정 (Single·Dual 모두 우측 정렬 · Figma ModalGuide 3418-471 갱신 — 옛 44px/120px 폐기) — 모달 액션 버튼 shape 는 pill 이 맞음. default 사각으로 바꾸거나 44/120 으로 되돌리지 말 것.",
          "footerLayout": "Single(확정 1개) = 우측 정렬 · 128px 고정 폭 · 검정 pill — **full-width 아님**. Dual(취소+확정) = 우측 정렬 · 128px 고정 ×2(취소 outlined + 확정 검정). HTML 은 `<div slot=\"footer\">` 로 감싸면 자동으로 .nds-modal__footer 로 승격돼 이 레이아웃이 적용됨(버튼 2개면 data-has-both-actions=\"true\" 자동). single 에 full-width 를 붙이거나 footer 컨테이너 없이 버튼만 두면(본문 가운데 끼임) 회귀.",
          "confirmCta": "주 action(확인/적용) = color=\"neutral\" variant=\"solid\" → 캐포비 시그니처 **검정 CTA**(#111 배경·흰 텍스트, buttonBg.neutral 토큰 cascade). (캐포비는 secondary tone 이 Figma 미정의라 Button/validator 가 경고 — 검정은 neutral 이 정답. secondary 는 하위호환 잔재.) 취소/닫기 = color=\"neutral\" variant=\"outlined\", 파괴적 확정(삭제 등)만 color=\"error\".",
          "titleTypo": "Title2 18·26 좌측 정렬 (base 중앙 정렬)",
          "bodyTypo": "Body2 14·20 medium 좌측 정렬 (base 중앙 정렬)",
          "dataModal": "**⑤ Data Modal (대형·조회 전용, 확인 팝업 ①~④ 와 구분)**: 목록/상세 데이터를 조회·확인하는 대형 모달. width ~560+ · **radius 12 · padding 24 · gap 16**(확인 모달의 16/32 와 다름) · border #E5E7EB. 헤더 = 제목(16 Bold) + 우상단 Close X(#999, 푸터 CTA 없음 — 조회 전용). 본문 = DataTable(헤더행 bg #F7F8FA · 셀 border #EEE · 36px · 12px) — 상세 + 목록 등 다중 테이블 가능. 페이지 패턴 아님 → Modal + DataTable 조합. Figma ModalGuide 3418-471(⑤ Data Modal 3832-1057).",
          "selectionModal": "**⑥ 선택/피커 모달 (대형·다중 선택)**: 항목을 검색·다중 선택해 적용하는 대형 모달(예: 지역·카테고리·타겟 선택). **width ~960 · radius 16 · padding 48 · 흰 배경**. 헤더 = 제목 Bold 24 #383838(좌) + Close X 28(#999, 우). 본문 = **2컬럼(각 ~422 · 높이 ~652 · gap 20)**: 좌 = 필터(검색 input + '전체 선택' 체크박스 + 시/도▸시/군/구 체크박스 트리, 선택 시 옐로우 체크) / 우 = `SelectedItemsPanel`(component:SelectedItemsPanel · SelectedItemRow) — '선택한 N개' + '선택 해제'(reset) + 제거 가능한 선택 항목 리스트. **모달 안 패널은 '선택 해제'만 — '추가 선택' 버튼 노출 금지(HTML `hide-add` 속성 필수 · React `onAdd` 미전달). '추가 선택'은 모달 밖 페이지/타겟팅 폼에서만 쓰며 secondary Button + plus(+) 아이콘.** 푸터 = **본문 풀폭 단일 '적용' CTA**: Solid/Primary(옐로우 #FFD200·검정 텍스트, **pill**) · 비활성 = Neutral/400 #DDD. ⚠️ 확인팝업(①~④)의 '우측 hug 검정 pill' 규칙을 적용하지 말 것 — 선택 적용은 **풀폭 옐로우**. 버튼 shape 는 모달 BottomCTA 라 pill 이며, 시안 3001:50787(빈 셸)의 radius10·400centered 적용 버튼은 오류 — 채워진 SSOT 는 **3001:50116**(풀폭 적용). Figma 3001-50116.",
          "dataLoaderModal": "**⑦ 데이터 로더 모달 (⑤ Data Modal 의 선택형)**: 기존 항목을 표에서 골라 불러오는 대형 모달(예: 소재 불러오기). ⑤ 구조 + **행 선택(radio/check) + 페이지네이션 + 푸터 액션**. 헤더 = 제목 Bold 24 + 검색 input + Close X. 본문 = 선택형 DataTable(상태칩·이미지·텍스트 컬럼 등) + 하단 페이지네이션 + 'N개씩 보기' 드롭다운. 푸터 = **취소(color=\"neutral\" outlined) + 불러오기(color=\"secondary\" solid · 검정 pill)** 각 ~170×56 (확인팝업 dual 푸터와 동일). 조회 전용 ⑤ 와 달리 선택·확정 액션이 있다. Figma 3001-32822.",
          "activationCondition": "`<html data-project=\"cashwalk-biz\">` 가 박힌 환경에서만 자동 적용 — 그 외에서는 base 모바일 스펙 유지"
        }
      },
      "trost": {
        "dimensions": {
          "radius": "16px (가이드 171:9899 Radius/2xl · base 8 → 트로스트 토큰 modal.radius)",
          "padding": "24px(top) / 16 좌우·하단 (base 28/16/16 → 트로스트 토큰 modal.padTop=24)",
          "buttons": "2개 가로(우측 primary) · width 130 · height 44 · radius 8 · backdrop rgba(0,0,0,0.4)",
          "confirmCta": "Positive(저장·구독·확인) = 프로젝트 노랑 #FFF42E + 검은 텍스트(confirmCta 토큰이 프로젝트별 자기 값 — 트로스트=검정 자동, 별도 설정 불필요). 비가역(삭제·차단·해지) = confirmTone=\"destructive\"(react) / 검정 nds-button color=\"neutral\"(html) → 검정 #1A1A1A + 흰 텍스트. ⚠️ mint(서플 primary) 색 쓰지 말 것 — 트로스트는 노랑 유지.",
          "activationCondition": "<html data-project=\"trost\"> — base 토큰 cascade 로 자동 (radius/padTop 은 트로스트 컴포넌트 토큰)"
        }
      }
    },
    "usagePolicy": {
      "useFor": [
        "즉각적 판단/응답이 필요한 확인 (삭제 확인, 결제 확인)",
        "현재 흐름 중단이 정당화되는 중요한 결정",
        "추가 입력 없이 한 화면에서 결정을 마쳐야 하는 짧은 폼",
        "(캐시워크 포 비즈니스 admin) 검수/등록/노출 변경 같은 admin 워크플로우의 확인 다이얼로그",
        "(캐시워크 포 비즈니스 admin) 목록/상세 데이터 조회 — Data Modal(대형 · 본문 DataTable · Close X · 푸터 CTA 최소). 확인 팝업(①~④)과 사이즈/역할 구분(dimensions.dataModal 참조)."
      ],
      "doNotUseFor": [
        "단순 정보 전달 — inline Notice / Banner / section 안내 사용",
        "긴 콘텐츠/스크롤 페이지 — 별도 페이지나 BottomSheet 검토 (단, 데이터 조회 목적의 대형 모달은 캐포비 Data Modal 패턴 허용)",
        "여러 단계 분기 — Wizard / 별도 페이지",
        "에러 메시지 — Toast 또는 inline error 사용"
      ],
      "emphasisRule": "핵심 action 1 + 보조 action 1 구조가 기본. Modal 안에 또 다른 강조 영역을 쌓지 말 것."
    },
    "summary": "사용자의 현재 흐름을 일시적으로 중단하고 중요한 결정/응답을 받기 위한 오버레이 UI. (기본/모바일) Radius 8 / 카드 padding 비대칭 28·16·16 / PC 332 · Mobile 294 / 본문↔버튼 24px gap / 50% overlay / shadow.md. Type: default / title(헤더) / Image(64×64 아이콘+타이틀). Button: 최대 2개. (기본/모바일) 1개=Primary full-width, 2개=Outlined Cancel + Primary OK 가로 분할. **(캐포비 admin) 1개=우측 정렬 · 128px 고정 · 검정 pill (full-width 아님), 2개=우측 정렬 128px ×2** (버튼 48px pill) — 버튼 배치는 actionsLayout('split'=가로균등 | 'end'=우측 hug) 으로 제어하고, 생략 시 프로젝트 기본이 강제된다(캐포비=end, 그 외=split. react=actionsLayout prop, html=actions-layout 속성). full-width 붙이지 말 것. Modal API/props 는 project 무관 동일 — 색/pill 모양은 프로젝트 토큰, 배치만 actionsLayout(data-layout) variant. project 별 spec 변형 (예: admin desktop 4가지 패턴) 은 get_guide({ topic:'component:Modal', project:'<slug>' }).dimensions 또는 matrixOverrides 참조.",
    "pitfalls": [
      "Modal 내부에 다시 큰 그림자/보더를 추가하지 말 것 (이미 shadow 토큰이 적용됨).",
      "ESC/오버레이 클릭으로 닫히는 기본 동작을 막으면 접근성 저해.",
      "버튼은 최대 2개까지만 사용. 3개 이상이 필요하면 BottomSheet 검토.",
      "maxWidth 미지정 시 base 기본 폭은 PC 332 / 모바일 294. project 별 변형 (예: cashwalk-biz admin desktop 480) 은 get_guide({ topic:'component:Modal', project:'<slug>' }).dimensions 또는 matrixOverrides 로 확인. 모바일 화면이면 device='mobile' 명시.",
      "ModalHeader/Body/Footer 자체에 padding 을 더하지 말 것 — 카드 패딩은 ModalContent 가 담당.",
      "단순 정보 전달용으로 Modal 사용 금지 — inline Notice / Banner / section 안내 우선. Modal 은 사용자의 즉각적 판단/응답이 필요할 때만.",
      "Modal 내부 강조 최소화: 핵심 action 1개 + 보조 action 1개 구조가 기본. Body 안에 또 다른 Card·Project BG·Chip 그룹을 쌓지 말 것.",
      "**확인 CTA 색은 confirmCta 토큰이 자동 — 프로젝트별 자기 값으로 합성된다.** Modal/Popup 의 기본 confirm(positive) 버튼은 bg=confirmCta(프로젝트 색: 트로스트=노랑·나머지=project·캐포비=검정) + **텍스트=confirmCta.text(트로스트=검정/나머지=흰/캐포비=흰)**. 노랑 위 흰 글씨 회귀는 해소됨 — Modal footer 에 `color`/text 를 직접 박지 말 것. **비가역(파괴적) 액션은 `confirmTone=\"destructive\"`**(react `<Modal confirmTone=\"destructive\">` / ModalFooter) → 검정 Neutral CTA + 흰 텍스트(프로젝트 무관, neutral-solid 토큰). HTML `<nds-modal>` 은 footer 가 consumer slot 이라 destructive = `<nds-button color=\"neutral\" variant=\"solid\">삭제</nds-button>` 로 표현(별도 속성 없음). 트로스트: 저장·구독=기본(노랑) / 삭제·차단=destructive(검정).",
      "캐포비 admin 모달의 주 action(확인/적용)은 color=\"neutral\" variant=\"solid\" — 프로젝트 시그니처 **검정 CTA**(#111·흰 텍스트). 취소/닫기는 color=\"neutral\" variant=\"outlined\", 파괴적 확정만 color=\"error\". 모달 버튼 shape 는 **pill 유지가 맞다**(Figma ModalGuide 3418-471) — default 사각으로 바꾸지 말 것. **★ footer 버튼은 주·보조(취소/아웃라인) 가리지 않고 전부 `shape=\"pill\"`** — 보조 버튼에 빠뜨려 pill+각진 버튼이 섞이는 게 흔한 회귀. validator `project-modal-footer-button-shape`(project-profiles cashwalk-biz.modal.footerButtonShape=\"pill\") 가 pill 누락 버튼을 잡는다. (캐포비는 secondary tone 이 없어 Button/validator 가 경고하니 검정은 neutral 로. 검정인데 색이 틀리면 data-project=\"cashwalk-biz\" 미설정 — 색 hex 를 직접 박지 말고 cascade 로 해결.)",
      "**★ 캐포비 확인/팝업 모달 버튼에 `color` 를 절대 생략하지 말 것 — 생략하면 노랑(primary)이 된다.** Button/<nds-button> 의 기본 color 는 `primary`(노랑)라, 모달 footer 에 `<nds-button>비즈니스 그룹 만들기</nds-button>` 처럼 color 를 안 적으면 캐포비 검정 CTA 가 아니라 노랑 버튼이 렌더된다(5회+ 재발한 회귀의 근본). **반드시 `color=\"neutral\" variant=\"solid\" shape=\"pill\"` 를 명시**한다. validator `project-modal-confirm-cta` 가 확인/팝업 모달의 primary/색생략 footer 버튼을 error 로 잡는다. (본문 풀폭 옐로우 적용 버튼이 정상인 곳은 선택/피커(⑥)·데이터로더(⑦) 같은 대형 모달뿐 — max-width 720+.)",
      "**모달/팝업 버튼이 2개일 때는 항상 가로 정렬을 유지한다 — 라벨이 길어 안 들어가도 세로 스택 금지.** 좁아서 한 줄에 안 들어가면 세로로 쌓지 말고 **라벨 텍스트를 줄인다**(예: \"비즈니스 그룹 만들기\"→\"그룹 만들기\", \"나중에 다시 하기\"→\"나중에\", \"지금 확인할게요\"→\"확인\"). 모달 footer 에 `flex-direction:column` / `actions-layout=\"stack\"` 을 넣지 말 것 — validator `project-modal-footer-stacked` 가 warn. (모달 버튼 라벨은 1~2 단어로.)",
      "**★ 캐포비 단일 버튼 모달은 우측 정렬 hug 검정 pill — full-width 아님.** 흔한 회귀: 버튼 1개인데 full-width 로 깔리거나 본문 가운데에 끼는 것. 원인은 (a) `<nds-button full-width>` 를 붙임 또는 (b) footer 를 `<div slot=\"footer\">` 로 감싸지 않고 버튼만 본문에 둠. 해법: `<div slot=\"footer\"><nds-button color=\"neutral\" variant=\"solid\" shape=\"pill\">확인</nds-button></div>` — slot=\"footer\" 가 .nds-modal__footer 로 승격되고, 캐포비 single cascade 가 `justify-content:flex-end` 로 우측 정렬 + hug 너비를 만든다(full-width 금지). 2개일 때만 가로 분할. **단, 이 규칙은 확인/결정 팝업(①~④) 한정** — 모달 종류별로 푸터가 다르다(아래).",
      "**모달 종류별 푸터 결정 트리** (혼동 금지): ① 확인/결정 팝업 = 우측 hug **검정 pill**(color=\"neutral\" — 캐포비엔 secondary 없음), 취소는 neutral outlined. ② 선택/피커 모달(⑥, dimensions.selectionModal) = **본문 풀폭 단일 \"적용\" 옐로우 Solid/Primary pill** (검정 아님·hug 아님). ③ 데이터 로더(⑦, dimensions.dataLoaderModal) = 취소(outlined) + 불러오기 **검정 pill**. ④ 조회 전용 Data Modal(⑤) = 푸터 CTA 없음(Close X 만). 어떤 모달인지 먼저 정하고 그 푸터를 쓸 것 — 선택 모달에 검정 hug 를, 확인 팝업에 옐로우 풀폭을 쓰면 회귀.",
      "**④ Confirm + Slot — 두 개의 독립 슬롯**(Figma ModalGuide 3418-471 · Variant Showcase): 확인 모달은 severity 슬롯과 본문 컨트롤 슬롯을 **각각 독립적으로** 끼울 수 있다(둘 다 / 하나만 / 없음 모두 가능 — 두 슬롯은 swipe 시안에서 슬롯 a·b 로 분리돼 있다). ❶ **slot a — severity(Notice 3종: info / caution / error, + success)**: 심각도 표시. Figma 는 헤더 제목 앞 pill Badge 로 그리지만, `<Modal title>`/`<nds-modal title>` 헤더는 타이틀 전용이라 **DS 표준은 본문 첫 자식 `nds-notice-alert`(variant=info/caution/error)** 로 표현한다(헤더에 직접 배지를 박아야 하면 저수준 `Modal.Header` children 으로 `Badge` 조립). ❷ **slot b — BodyContent 컨트롤(4종)**: `ContentSlot`(기본 — 회색 안내 박스 `fill/neutral-subtle` 배경·radius 12·높이 48) / `nds-input`(TextInput) / `nds-select`(Dropdown) / `nds-date-picker`(DateInput) 중 하나. 두 슬롯 모두 **설명 `<p>` 와 함께 본문 children 형제로** 둔다(슬롯은 footer 가 아니라 본문 — `slot=\"footer\"` 붙이지 말 것). ModalBody 가 세로 스택 + 자동 간격(캐포비 20px / base `--semantic-gap-default`)을 잡으므로 **슬롯마다 wrapper/margin 으로 간격을 직접 주지 말 것**(직접 주면 이중 간격 회귀). 슬롯은 full-width 로 늘어남. 푸터는 ①과 동일(취소 neutral outlined + 확정 검정 neutral · 48px pill w128).",
      "**높이/스크롤·중첩 팝오버는 DS 가 알아서 처리한다 — 손대지 말 것.** (a) 본문이 길어 화면을 넘으면 ModalContent 가 뷰포트(카드 패딩 제외) 안으로 max-height 를 걸고 **헤더/푸터는 고정한 채 본문(.nds-modal__body)만 스크롤**한다. 모달 패널에 직접 height/max-height/overflow 를 박아 이 동작을 깨지 말 것(`--nds-modal-max-height` 로 상한만 오버라이드 가능). (b) 본문 슬롯의 `nds-date-picker`/`nds-select` 캘린더·드롭다운은 `document.body` 로 portal 되어 모달 `overflow:hidden` 밖으로 뜬다(잘리지 않음) — 팝오버를 모달 밖으로 빼내려고 별도 컨테이너/position 을 만들지 말 것.",
      "**런마일(Modal 가이드 5085:27)**: 컨테이너 radius **3XL 24** · **Elevation/3**(0 4px 13px α0.06) · **Title=Text/Strong**(#221E1F) · **Body=Text/Normal**(subtle #4E5968) **13/18**. 모두 `components.modal`(radius/shadow/titleColor/bodyColor/bodyFontSize/bodyLineHeight) 슬롯 — 타 프로젝트 fallback 유지. overlay #000 α0.5 · 흰 surface · Confirm=오렌지 Solid · Cancel=Outlined 좌 + Confirm 우(actionsLayout split). 단일=Confirm only, 이중=Cancel+Confirm. 본문 3줄↑/입력 폼이면 BottomSheet·별도 페이지 권장. (치수 296/328 은 React DEVICE_WIDTH 하드코딩이라 base 294/332 유지 — 4px 차.) **Popup**(가운데 confirm)도 런마일 radius 20·Elevation/3 정합(`components.popup`)."
    ],
    "examplesHtml": {
      "do": "<!-- 2버튼(가로 분할): 취소 + 확정. slot=\"footer\" 는 자동으로 .nds-modal__footer 로 승격됨 -->\n<nds-modal open title=\"신청을 취소할까요?\" max-width=\"400\" closable>\n  <p>입력한 내용은 저장되지 않아요.</p>\n  <div slot=\"footer\">\n    <nds-button color=\"neutral\" variant=\"outlined\">닫기</nds-button>\n    <nds-button color=\"error\" variant=\"solid\">취소하기</nds-button>\n  </div>\n</nds-modal>\n<!-- 캐포비(data-project=\"cashwalk-biz\") 단일 버튼: 우측 정렬 · hug 너비 · 검정 pill (full-width 아님). full-width 속성 붙이지 말 것 — footer cascade 가 우측 정렬 처리 -->\n<nds-modal open title=\"검수를 승인할까요?\" max-width=\"480\">\n  <p>승인하면 즉시 노출됩니다.</p>\n  <div slot=\"footer\">\n    <nds-button color=\"neutral\" variant=\"solid\" shape=\"pill\">승인</nds-button>\n  </div>\n</nds-modal>\n<!-- ④ Confirm + Slot: 두 독립 슬롯 — slot a(severity)=nds-notice-alert(info/caution/error) + slot b(BodyContent)=Input/Select/DatePicker 중 하나. 설명 <p> 와 슬롯을 본문 children 형제로 두면 ModalBody 가 자동 간격(캐포비 20px)으로 쌓는다 — 직접 wrapper/margin 불필요. 슬롯은 full-width. -->\n<nds-modal open title=\"종료 사유를 입력해주세요\" max-width=\"480\">\n  <p>광고비는 전액 청구되며 환불·보상·재집행은 불가합니다.</p>\n  <nds-notice-alert variant=\"caution\" message=\"종료 후에는 되돌릴 수 없어요.\"></nds-notice-alert>\n  <nds-input label=\"사유\" placeholder=\"사유를 입력하세요\"></nds-input>\n  <div slot=\"footer\">\n    <nds-button color=\"neutral\" variant=\"outlined\">취소</nds-button>\n    <nds-button color=\"neutral\" variant=\"solid\">확정</nds-button>\n  </div>\n</nds-modal>\n<script>modal.addEventListener(\"modal-close\", () => modal.removeAttribute(\"open\"));</script>",
      "dont": "<!-- closable + max-width 누락 + 본문 없음 — 의도/구조가 부족 -->\n<nds-modal open></nds-modal>\n<!-- raw <dialog> 로 모달 흉내 — focus trap / 토큰이 적용 안 됨 -->\n<dialog open><p>알림</p></dialog>"
    }
  },
  "MultiSelect": {
    "name": "MultiSelect",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4123-1406",
    "summary": "검색 + 전체선택/해제 + 체크박스 리스트 + 취소/적용 푸터 + 빈 상태를 가진 다중 선택 필터 드롭다운(MultiSelectDropdown · 392px 패널). 일반 Select(단일·즉시 반영)와 달리 패널 안 초안을 편집하고 **적용** 시에만 반영. 리포트 상단 '광고 다중 선택' 등 필터. **옵션 8~30개 + 평면 구조**에 적합 — 30개+ 또는 계층 구조면 pattern:cashwalk-biz-selection-pattern 의 Modal Picker(CheckboxTree). 컴포넌트 SSOT Figma 4123-1406, 사용 맥락 캐포비 광고별 리포트 3001:28554.",
    "pitfalls": [
      "**단일 선택이면 Select** — MultiSelect 는 적용 버튼이 있는 다중 필터 전용. 즉시 반영 단일 드롭다운에 쓰면 과함.",
      "적용(apply) 전까지 onValueChange 가 발화하지 않음 — 취소/바깥클릭은 초안 폐기. value(적용값)와 패널 내 draft 를 혼동하지 말 것.",
      "검색 결과 0건이면 자동으로 빈 상태('검색 결과가 없습니다.') 노출 — 직접 그리지 말 것.",
      "전체선택/해제는 **현재 검색 필터된 항목** 기준으로 토글된다(전체 목록 아님).",
      "여러 필터를 한 줄에 둘 때는 component:FilterBar(칩 토글)가 아니라 SearchInput/Select/DateRangePicker/MultiSelect 를 가로로 조합 — FilterBar 는 카테고리 칩 전용.",
      "**패널 내부 구조는 컴포넌트가 고정**(Figma 4123-1406): 상단 검색(테두리 인셋 TextInput) → 전체선택 행(배경 surface.subtle · 라벨 16/medium · 우측 'N개 선택') → 옵션 행(44h) → **우측 hug 푸터([취소] neutral outlined + [적용] neutral solid 검정)**. 푸터를 풀폭 split 으로 그리거나 적용 버튼을 secondary/노랑으로 바꾸지 말 것 — 캐포비 검정 CTA = neutral."
    ],
    "examplesHtml": {
      "do": "<nds-multi-select placeholder=\"모든 광고\" search-placeholder=\"광고명으로 검색\" value='[]'\n  options='[{\"value\":\"a\",\"label\":\"캠페인 A 타겟팅\"},{\"value\":\"b\",\"label\":\"캠페인 B 리타겟\"}]'></nds-multi-select>\n<script>el.addEventListener(\"nds-multi-select-change\", e => filterByAds(e.detail.value));</script>",
      "dont": "<!-- 단일 선택에 MultiSelect — 적용 버튼이 불필요한 마찰. nds-select 사용 -->\n<nds-multi-select options='[{\"value\":\"asc\",\"label\":\"오름차순\"},{\"value\":\"desc\",\"label\":\"내림차순\"}]'></nds-multi-select>"
    }
  },
  "NoticeAlert": {
    "name": "NoticeAlert",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3902-1212",
    "references": [
      {
        "label": "Cashwalk for Business · NoticeAlertGuide",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3902-1212",
        "caption": "캐포비 라이브러리 인라인 알림 박스 가이드 — state(info/caution/error) 기준 anatomy·token mapping·Use Cases·Do/Don't SSOT. DS 에서는 notice 패턴 + 5 variant 로 흡수.",
        "project": "cashwalk-biz"
      },
      {
        "label": "Trost · Alert 가이드",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5283-206",
        "caption": "트로스트 Alert 가이드 — 5 variant(info/Notice/Caution/Success/Error)·2 size(52/72)·anatomy(container padding 16·gap 8·radius 8 · icon 20 · Body3 Medium). 트로스트는 Notice=중립 surface·본문 Text/Normal·radius 8 로 프로젝트 토큰 override(base 는 Notice=블루·본문 strong 유지).",
        "project": "trost"
      }
    ],
    "summary": "폼·페이지 내부에 인라인으로 영구 노출되는 안내/주의/에러 박스 — DS notice 패턴의 구현체. 입력 컨텍스트 옆에 머무르며 명시적으로 닫기 전까지 유지됨. Toast(액션 결과·자동 사라짐) · Banner(페이지 상단 전역 띠) · Modal(즉각 판단 요구)과 분리 — 인라인 지속 메시지만 NoticeAlert. 5 variant — info(중립 회색) / notice(블루·차분한 공지) / caution(옐로우 배경·아이콘) / success(그린·완료) / error(레드 배경+레드 텍스트·조치 필요). 컨테이너 = padding 16 · gap 8 · radius 8(트로스트·지니어트)~12(base) · min-height 52(1줄)/72(2줄·자동) · 좌측 status 아이콘 20×20 + 본문 Body3 Medium (notice.md 패턴 SSOT 정합). 색은 임의 hex 금지, semantic status 토큰 binding. **프로젝트 override(슬롯)** — 트로스트는 Notice=중립 surface+neutral 아이콘, 본문 텍스트 전 variant Text/Normal, radius 8(`--nds-notice-alert-{notice-bg,notice-icon,text,radius}`). base/캐포비는 Notice=블루·본문 strong(error 만 레드) 유지. notice 패턴 규칙(강조 예산·화면당 색 박스 1개)을 그대로 따른다.",
    "pitfalls": [
      "**특정 입력 필드의 검증 실패(비밀번호 불일치·이메일 형식·중복 등)는 NoticeAlert 가 아니다 → 그 필드의 인라인 에러로.** (★ 자주 하는 오용) Input/FormField 의 `error` + `error-message`(html) / `errorMessage`(React)로 필드 바로 아래 빨간 헬퍼(role=alert 자동). NoticeAlert 는 폼/페이지 단위의 **영구 안내·정책 메시지**용이지 필드 1개의 검증 피드백용이 아니다 — 멀리 떨어진 박스로 띄우면 어느 입력이 틀렸는지 끊긴다.",
      "error variant 를 단순 안내용으로 남발하지 말 것 — 의미가 흐려짐. 단순 정보는 info, 주의는 caution.",
      "액션·확인 버튼이 필요한 메시지는 NoticeAlert 가 아님 → Modal/Dialog. 일시적 결과 알림 → Toast. 전역 공지 → Banner.",
      "같은 화면에 색 배경 박스(notice/success/error) 를 여러 개 쌓지 말 것 — notice 패턴 강조 예산(화면당 색 박스 1개 권장). info/caution(회색)은 비교적 자유.",
      "색을 임의 hex 로 박지 말 것 — variant 만 지정하면 semantic status 토큰(bg/text/icon)이 cascade 로 함께 적용됨.",
      "안내가 필요한 입력 필드와 멀리 떨어진 위치에 배치하지 말 것 — 입력 컨텍스트 바로 옆."
    ],
    "examplesHtml": {
      "do": "<nds-notice-alert variant=\"caution\" message=\"목표 참여자 수는 1,000명 단위로 입력해 주세요.\"></nds-notice-alert>\n<nds-notice-alert variant=\"error\" message=\"필수 정보가 누락되어 저장할 수 없어요.\"></nds-notice-alert>",
      "dont": "<!-- 단순 안내인데 error 남발 → 의미 흐려짐 (info/caution 이 맞음) -->\n<nds-notice-alert variant=\"error\" message=\"최대 30자 이내로 입력해 주세요.\"></nds-notice-alert>\n<!-- 확인 버튼이 필요한 메시지를 NoticeAlert 로 — Modal 이 맞음 -->\n<nds-notice-alert variant=\"notice\" message=\"삭제하시겠어요? [확인]\"></nds-notice-alert>"
    }
  },
  "NumericSpinner": {
    "name": "NumericSpinner",
    "summary": "`−` / 값 / `+` 로 정수를 증감하는 입력. 키보드 없이 수량·회차·세트 수·인원 같은 **작은 정수**를 조정할 때. 가운데 값은 직접 입력도 가능(입력 중 자유 타이핑, blur 시 clamp), 위/아래 화살표 키로도 증감. min/max 도달 시 해당 버튼 자동 비활성.\n\n<!-- figmaNodeUrl: TODO — 디자인 가이드 노드 확정 후 추가(현재 디자인 소스 없이 코드 우선 추가됨) -->",
    "pitfalls": [
      "**Stepper / AmountInput 과 혼동 금지.** `Stepper` 는 단계 **진행 표시기**(numbered/dots/bar)지 증감 입력이 아니다. `AmountInput` 은 금액(천단위 콤마 + 프리셋 칩, value 는 number|null)용 — 큰 수/통화는 NumericSpinner 말고 AmountInput.",
      "**작은 정수 조정 전용.** 임의의 큰 수를 키패드로 빠르게 치는 화면(나이·금액 등)에는 부적합 — 그건 AmountInput 이나 일반 숫자 input. NumericSpinner 는 \"기본값 주변 ±몇\" 조정에 쓴다.",
      "**value 는 number (controlled, not null).** 빈 문자열 상태는 입력 중에만 허용되고 commit 되지 않는다. 반드시 `onValueChange`(html: `numeric-spinner-change`)로 받아 되돌려줘야 화면이 갱신된다.",
      "**min/max 는 자동 clamp** — 버튼/직접입력 모두 경계로 자르고, 경계 도달 시 `−`/`+` 버튼이 disabled 된다. 외부에서 별도 검증/clamp 불필요.",
      "`step` 미지정 시 1. 5단위 등은 `step` 으로."
    ],
    "recommended": [
      "수량/회차/세트/인원: `value` + `min` + `max` (예: 상담 회차 1~10)",
      "N단위 증감: `step={5}` (예: 0~100, 5단위)"
    ],
    "examplesHtml": {
      "do": "<nds-numeric-spinner value=\"1\" min=\"1\" max=\"10\" aria-label=\"상담 회차\"></nds-numeric-spinner>\n<script>\n  el.addEventListener(\"numeric-spinner-change\", (e) => setCount(e.detail.value));\n</script>",
      "dont": "<!-- 금액/큰 수에 스피너 — 큰 수를 +1씩 누르게 만들지 말 것. AmountInput 사용 -->\n<nds-numeric-spinner value=\"50000\" step=\"1000\"></nds-numeric-spinner>\n\n<!-- 진행 단계 표시에 오용 — Stepper 사용 -->\n<nds-numeric-spinner value=\"2\" max=\"4\" aria-label=\"가입 단계\"></nds-numeric-spinner>"
    }
  },
  "PageSizeSelect": {
    "name": "PageSizeSelect",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-30014",
    "summary": "리포트/리스트 표 하단 우측의 \"한 페이지 행 수\" 선택 드롭다운(\"100개씩 보기\"). Pagination 과 짝(같은 가로 줄, 좌 Pagination / 우 PageSizeSelect). 내부적으로 Select(auto 폭) 재사용. HTML 은 nds-select 에 \"N개씩 보기\" 라벨 옵션으로 구성. **옵션은 10 / 30 / 50 / 100개씩 보기 4종 권장**(캐포비 admin 폭 152·높이 48 — Dropdown 기본 240 에서 너비만 축소). 값 변경 시 **page=1 로 리셋 + 데이터 재조회**. Figma PaginationGuide 4118-1186.",
    "pitfalls": [
      "Pagination(페이지 이동)과 혼동하지 말 것 — PageSizeSelect 는 행 수만 바꾼다(둘은 보통 같은 줄 좌/우).",
      "값 변경 시 1페이지로 리셋하지 않으면 현재 페이지가 범위를 벗어날 수 있음 — onValueChange 에서 page=1 처리.",
      "HTML 목업에서는 전용 태그가 없다 — nds-select 에 {30,50,100} 옵션 + label 'N개씩 보기' 로 만든다(React 만 <PageSizeSelect>)."
    ],
    "examplesHtml": {
      "do": "<!-- HTML: nds-select 로 구성 -->\n<nds-select value=\"100\" options='[{\"value\":\"10\",\"label\":\"10개씩 보기\"},{\"value\":\"30\",\"label\":\"30개씩 보기\"},{\"value\":\"50\",\"label\":\"50개씩 보기\"},{\"value\":\"100\",\"label\":\"100개씩 보기\"}]'></nds-select>\n<!-- React -->\n<!-- <PageSizeSelect value={pageSize} onValueChange={setPageSize} /> -->",
      "dont": "<!-- 페이지 이동을 PageSizeSelect 로 흉내내지 말 것 — Pagination 사용 -->"
    }
  },
  "Pagination": {
    "name": "Pagination",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4118-1186",
    "summary": "리스트가 한 화면을 넘을 때 페이지 단위로 끊어 보기. 무한 스크롤이 적절한 경우(피드/리뷰) 에는 사용 안 함.",
    "pitfalls": [
      "전체 페이지 수 5 이하 / 항목 30 이하면 Pagination 자체가 과한 UI — 한 페이지로 노출.",
      "show-arrows 와 siblings 를 둘 다 끄면 현재 페이지 ±1 만 보여 탐색이 끊김.",
      "PaginationChange 이벤트 처리 없이 page attribute 만 바꿔도 데이터 fetch 가 안 일어남 — 이벤트 핸들러에서 fetch 호출.",
      "캐포비(data-project=\"cashwalk-biz\")에서는 각 페이지/화살표가 개별 보더 박스(radius 4, 34h) + 활성 페이지가 검정 채움으로 자동 렌더된다(cascade). markup/attribute 는 base 와 동일 — 박스 모양을 흉내내려 직접 div/border 를 짜지 말 것.",
      "런마일(data-project=\"runmile\")에서는 페이지 칩이 **24×24·radius 6**, **active = gray800(#4E5968) 채움 + 흰 텍스트 bold**(project 주황 아님), **inactive = gray800 텍스트(medium 500)**, 이전/다음 **화살표 20×20 gray600(#8B95A1)** 으로 자동 렌더된다(cascade). PC 10페이지 / Mobile 5페이지 노출(넘으면 `siblings` 로 압축). markup/attribute 는 base 와 동일 — 직접 박스를 짜지 말 것. (Figma 런마일 PaginationGuide 5055:29)",
      "총 데이터 0건이면 Pagination 자체를 숨길 것(렌더하지 않음). 총 1페이지면 PageItem 1개 + Prev/Next disabled.",
      "Prev/Next 가 끝(1페이지·마지막페이지)에 도달하면 활성으로 두지 말고 disabled — 캐포비는 흐림이 아니라 옅은 회색 박스로 표시된다.",
      "**URL 쿼리 파라미터로 상태 관리 (새로고침·공유 시 보존)** (Figma PaginationGuide 4118-1186): 페이지 번호와 노출 개수는 URL 쿼리로 관리한다. 페이지 번호 클릭 → `?page=N`, Prev/Next → `?page=N±1`, PageSizeSelect 변경 → `?size=N&page=1`(노출 개수 변경 시 **반드시 page=1 로 리셋** — 현재 페이지 유지하면 범위를 벗어난 빈 페이지로 갈 수 있음). 모든 트리거는 데이터 재조회를 동반.",
      "**총 페이지 8개+ 면 생략(…) 압축 표시 검토** — `siblings` 로 현재 페이지 주변만 펼치고 양 끝/말줄임으로 압축.",
      "**배치**: 리스트 페이지 **우하단 고정**, 좌측 페이지 클러스터 + 우측 PageSizeSelect 를 같은 가로 줄(FilterBar 와 동일 정렬)로 둔다. 리스트 페이지마다 다른 Pagination 디자인을 쓰지 말 것(전 페이지 통일).",
      "**노출 개수 조절은 PageSizeSelect(Dropdown) 로 통일** — Toggle/Radio 등 다른 컴포넌트로 행 수를 바꾸지 말 것. 현재 페이지 active 시각 표시(검정 채움)를 빠뜨리지 말 것."
    ],
    "examplesHtml": {
      "do": "<nds-pagination page=\"1\" total-pages=\"10\" siblings=\"2\" show-arrows></nds-pagination>\n<script>el.addEventListener(\"pagination-change\", e => loadPage(e.detail.page));</script>\n<!-- 한 페이지 행 수 선택은 component:PageSizeSelect — 보통 표 하단 우측 -->\n<!-- 캐포비 박스형은 <html data-project=\"cashwalk-biz\"> 만 박혀 있으면 자동 적용 -->",
      "dont": "<!-- siblings 0 + arrows 없음 — 옆 페이지가 보이지 않음 -->\n<nds-pagination page=\"1\" total-pages=\"10\" siblings=\"0\"></nds-pagination>"
    }
  },
  "PhoneInput": {
    "name": "PhoneInput",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-40209",
    "summary": "국가 코드 + 휴대폰 번호 입력. ISO code 관리 + 다이얼 코드는 countries 데이터에서 조회. 국기 이모지 없이 다이얼코드/ISO코드/국가명만 표시(텍스트 이모지 금지 규칙 준수). 레이아웃 = 국가코드 드롭다운 박스 + 번호 입력 박스가 분리된 두 박스(gap). 두 박스 모두 base Input 시멘틱 토큰(height 48 · radius md · border/background)을 상속하므로 project cascade(--nds-input-*)가 그대로 적용됨.",
    "pitfalls": [
      "countryCode는 ISO code(KR, US 등)로 관리. '+82' 문자열을 state에 두지 말 것.",
      "value/onValueChange 는 숫자만 다룸(예: '01012345678'). autoFormat(기본 on)이 화면에만 하이픈(KR 3-4-4)을 붙임 — state 에 하이픈 든 문자열을 넣지 말 것.",
      "KR(+82) 외 국가는 하이픈 규칙 미정의라 자동 포맷 안 함(숫자 패스스루). 끄려면 autoFormat={false}.",
      "기본 5개국(KR/US/JP/CN/GB) 외 필요하면 countries prop으로 직접 정의.",
      "둥근 모서리/높이를 임의 px 로 박지 말 것 — base Input 토큰(--nds-input-radius/-height) 상속이므로 Input 과 자동 일관."
    ],
    "recommended": [
      "회원가입: helperText='인증번호를 받을 번호를 입력해주세요'",
      "에러: error + helperText='번호 형식이 올바르지 않아요'",
      "프로필 표시: disabled로 변경 불가 표시"
    ],
    "examplesHtml": {
      "do": "<nds-phone-input country-code=\"KR\" value=\"01012345678\" label=\"휴대폰 번호\"></nds-phone-input>\n<script>el.addEventListener(\"nds-phone-change\", e => setPhone(e.detail.value));</script>",
      "dont": "<!-- 다이얼 코드(+82) 를 country-code 로 — ISO 코드 사용 -->\n<nds-phone-input country-code=\"+82\"></nds-phone-input>"
    }
  },
  "PopularPosts": {
    "name": "PopularPosts",
    "figmaNodeUrl": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=148-68",
    "sizeMatrix": {
      "containerWidth": "353px (PC 사이드바 폭 가정)",
      "containerPadding": "20px (--semantic-inset-card-large)",
      "containerRadius": "8px (--radius-md)",
      "containerBorder": "1px var(--semantic-border-subtle-default)",
      "gapBetweenSections": "16px (header ↔ tabs ↔ list) — gap-loose",
      "tabHeight": "32px (pill)",
      "tabPadding": "6px 12px",
      "tabRadius": "pill (height/2 = 16px) — radius.full 토큰",
      "tabGap": "8px",
      "tabFontActive": "Body3 14/20 Bold",
      "tabFontInactive": "Body3 14/20 Medium",
      "rowHeight": "32px (min) · py 6",
      "rowGap": "4px (rank ↔ title ↔ count)",
      "rankWidth": "21px (두 자리 고정폭)",
      "titleType": "Body3 14/20 Regular · cv.textRole.strong · 한 줄 truncate",
      "countType": "Body3 14/20 Medium · cv.textRole.statusError · whitespace-nowrap",
      "headerTitleType": "Headline5 18/26 Bold · cv.textRole.strong",
      "moreType": "Body3 14/20 Regular · cv.textRole.subtle + 16px chevron"
    },
    "stateMatrix": {
      "tabDefault": "bg cv.surface.section · text cv.textRole.subtle · Medium",
      "tabHover": "bg cv.surface.subtle · text cv.textRole.strong (PC only)",
      "tabActive": "bg cv.surface.brandSubtle · text cv.textRole.brand · Bold",
      "rowDefault": "static row (button 시멘틱은 onItemClick 있을 때만)",
      "rowHover": "opacity 0.7 (button 일 때만, PC only)",
      "moreHover": "text cv.textRole.strong",
      "note": "탭 active 톤은 시멘틱 토큰 참조이므로 프로젝트 theme(`projects/*.semantic.ts`)에 따라 자동 적용. 프로젝트별 raw 매핑은 토큰 파일이 SSOT."
    },
    "usagePolicy": {
      "useFor": [
        "PC 사이드바 커뮤니티 인기글 랭킹 (메인·카테고리·리스트 페이지 공통)",
        "기간/정렬 탭으로 전환되는 ranked Top-N 위젯"
      ],
      "doNotUseFor": [
        "모바일 화면 (별도 모듈로 분기 — 사이드바 폭 가정)",
        "11개 이상의 동일 리스트 (별도 페이지·모달로)",
        "이미지/썸네일 포함 카드형 리스트 → Card 또는 List + ListItem",
        "텍스트 검색 키워드 트렌드 → TrendingKeywords"
      ],
      "limits": {
        "maxItems": 10,
        "maxTabs": "5 권장 (스크롤 가능하지만 가독성 저하)",
        "countCap": "999 초과 시 자동 '+999' 캡",
        "rankWidth": "21px 고정 — 두 자리 zero-padded"
      }
    },
    "summary": "사이드바용 커뮤니티 인기글 랭킹 모듈. Header(제목 + 더보기) + Tab(기간/정렬 pill 5개) + ranked row 리스트 의 3단 레이어. Row = Rank(Bold) + Title(truncate) + Count(red, `[N]` / 999 초과 `[+999]`). PC 사이드바 폭(≈353w) 가정 — 모바일은 별도 모듈로 분기.",
    "pitfalls": [
      "Rank 는 컴포넌트 내부에서 두 자리 zero-padded 로 자동 변환 — `items` 에 별도 rank 필드 넘기지 말 것. 배열 순서가 곧 순위.",
      "Count 는 컴포넌트가 자동 포맷 (`[N]` / 999 초과 `[+999]`) — 외부에서 문자열로 가공해서 넘기지 말 것.",
      "최대 10개 row 까지만 노출하는 것이 디자인 가이드. 초과분은 시각적으로는 잘리지 않지만, `onMoreClick` 으로 별도 페이지/모달로 분기할 것.",
      "Active 탭은 한 그룹에 하나만 — `activeTabKey` 단일 키 prop 사용. 자동으로 project-subtle pill + project text 톤 적용.",
      "탭 active 톤은 프로젝트 시멘틱(`cv.surface.brandSubtle` + `cv.textRole.brand`)으로 자동 매핑 — raw hex 로 override 금지. 프로젝트별 실제 색은 `packages/tokens/src/projects/{geniet,nudge-eap,trost}.semantic.ts` SSOT 참조.",
      "Rank 색을 강조색(red/project 등)으로 변경 금지 — Rank 는 보조 정렬 지표일 뿐, Count(red) 와 시각 위계 충돌.",
      "Count 를 title 왼쪽에 두는 등 순서 변경 금지 — 항상 rank → title → count.",
      "Title 은 한 줄 truncate 고정 (CSS `text-overflow: ellipsis`). 두 줄 wrap 시 시각적 그리드 깨짐.",
      "`onMoreClick` 미지정 시 더보기 영역이 숨겨짐 — '더보기' 가 필요한 화면이면 콜백 필수.",
      "`tabs` 없이도 동작 (탭 없는 단일 랭킹) — 빈 배열/undefined 면 탭 영역 자체 숨김."
    ],
    "recommended": [
      "기본 사이드바 (5탭 + 더보기 + 클릭): <PopularPosts tabs={tabs} activeTabKey={key} onTabChange={setKey} items={items} onMoreClick={goList} onItemClick={(item)=>nav(item.id)} />",
      "탭 없는 단일 랭킹 (단일 기간): <PopularPosts items={items} onMoreClick={goList} />",
      "items 길이는 10 이하로 유지 — 11번째 row 부터는 별도 페이지/모달로 분기 (가이드 준수)."
    ],
    "accessibility": [
      "탭은 role='tab' + aria-selected, 그룹은 role='tablist' 자동 부여 — 외부에서 role 덮어쓰지 말 것.",
      "Row 클릭이 필요하면 onItemClick 사용 — 자동으로 <button> 으로 렌더되어 키보드 Enter/Space 인터랙션 보장.",
      "더보기 버튼은 <button type='button'> — form 내부에 두어도 submit 안 됨."
    ],
    "examplesHtml": {
      "do": "<nds-popular-posts module-title=\"요즘 인기 글\" show-more\n  tabs='[{\"key\":\"day\",\"label\":\"오늘\"},{\"key\":\"week\",\"label\":\"이번 주\"}]'\n  active-tab=\"day\"\n  items='[{\"id\":\"1\",\"title\":\"불안 다스리는 법\",\"count\":1024}]'\n  item-clickable></nds-popular-posts>\n<script>el.addEventListener(\"nds-popular-item-click\", e => navigate(`/post/${e.detail.item.id}`));</script>",
      "dont": "<!-- active-tab 을 index 로 — key 가 정답 -->\n<nds-popular-posts tabs='[...]' active-tab=\"0\"></nds-popular-posts>"
    }
  },
  "Popup": {
    "name": "Popup",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9899",
    "summary": "단순 확인/거부(취소·삭제·종료) 1-액션 다이얼로그. 본문이 긴 경우엔 Modal, 비차단 알림은 Snackbar. 버튼 배치는 actionsLayout('split'=2버튼 50/50·1버튼 세로 스택 | 'end'=우측 hug)으로 제어하고, 생략 시 프로젝트 기본(캐포비=end, 그 외=split)이 강제된다(react=actionsLayout prop, html=actions-layout 속성). 색/pill 모양은 프로젝트 토큰이 별도 결정.",
    "pitfalls": [
      "Popup 본문에 form / 멀티 입력을 두지 말 것 — Modal 이 맞음.",
      "destructive 액션의 confirm-text 가 '확인' 처럼 일반 — 'X 삭제하기' / 'X 종료' 처럼 결과 명시.",
      "show-cancel 끄고 confirm 만 — 사용자에게 거부권을 주지 않음 (info popup 외에는 비권장).",
      "버튼 배치를 직접 flex/justify 로 덮어쓰지 말 것 — actionsLayout='split'|'end' 사용(프로젝트 기본은 자동)."
    ],
    "examplesHtml": {
      "do": "<nds-popup open title=\"신청을 취소할까요?\" description=\"입력한 내용은 저장되지 않아요\"\n  confirm-text=\"신청 취소하기\" cancel-text=\"계속 작성\" show-cancel></nds-popup>\n<script>el.addEventListener(\"popup-confirm\", cancel); el.addEventListener(\"popup-cancel\", () => el.removeAttribute(\"open\"));</script>",
      "dont": "<!-- show-cancel 없음 + confirm 일반 — 사용자 거부 불가 -->\n<nds-popup open title=\"저장됨\" confirm-text=\"확인\"></nds-popup>"
    }
  },
  "PriceTag": {
    "name": "PriceTag",
    "summary": "가격 + 할인율 + 원가. amount/originalAmount 모두 number일 때만 할인율 자동 계산. 0원은 freeLabel.",
    "pitfalls": [
      "통화는 prefix($) 또는 unit(원) 중 하나만. 둘 다 쓰면 '$1,000원' 어색.",
      "할인율은 amount/originalAmount 둘 다 number일 때만 자동. 문자열로 넘기면 계산 안 됨.",
      "formatThousands=false로 두면 콤마 없이 표시됨 — 외화/표시 정책에 맞춰 조정."
    ],
    "recommended": [
      "상품 카드: size='lg', 할인 자동",
      "결제 합계: size='md', originalAmount로 절약 표시",
      "구독: amount=29000, unit='원/월'"
    ],
    "examplesHtml": {
      "do": "<nds-price-tag amount=\"50000\" original-amount=\"100000\" prefix=\"₩\" unit=\"원\" size=\"md\" format-thousands></nds-price-tag>",
      "dont": "<!-- 할인 표시를 strikethrough 텍스트로 직접 작성 — original-amount 권장 -->\n<span>₩100,000</span> <strong>₩50,000</strong>"
    }
  },
  "ProductCard": {
    "name": "ProductCard",
    "figmaNodeUrl": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1122",
    "references": [
      {
        "label": "캐시딜 PC 랭킹 리스트 (236w)",
        "url": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1122"
      },
      {
        "label": "캐시딜 Mobile 풀스펙 (140w)",
        "url": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=338-2199"
      }
    ],
    "sizeMatrix": {
      "sm": "140w (모바일) — 썸네일 140×140 · 캐러셀/그리드. 기본값.",
      "md": "236w (데스크탑) — 썸네일 236×236 · title min-height 44px 로 2줄 정렬. PC 캐시딜 랭킹 리스트용.",
      "thumbnail": "정사각 1:1 · border subtle 1px · radius md(8) · object-cover",
      "gapThumbnailToMeta": "8px (spacing[8]) — root flex gap",
      "gapMeta": "6px (spacing[6]) — title ↔ chips ↔ price ↔ footer",
      "title": "Body3 14/20 Regular · cv.textRole.strong · 2줄 ellipsis",
      "discount": "Lato Medium 18/24 · cv.textRole.statusError · letter-spacing -0.3px",
      "price": "Lato Black 900 18/24 · cv.textRole.strong · letter-spacing -0.3px",
      "currency": "Caption2 12/16 Regular Pretendard · cv.textRole.strong",
      "originalPrice": "Body3 14/16 Regular Lato · cv.textRole.muted · line-through",
      "rewardChip": "label 11/14 Medium · cv.surface.statusError bg · CashdealPointIcon 16 + 금액(Bold) + '적립'(Medium) · radius sm(4)",
      "shippingChip": "label 11/14 Medium · cv.fill.neutralSubtle bg · cv.textRole.subtle · radius sm(4)",
      "pointDiscountChip": "label 11/14 Bold · cv.surface.default + border subtle 1px · CashdealPointIcon 16 + '포인트할인' · radius sm(4)",
      "rankingBadge": "36×36 · #f16d4d bg · 흰 텍스트 Bold 20 · radius md(8) · 썸네일 좌상단 8/8",
      "badge": "label 11/14 Bold · cv.fill.statusError bg · cv.textRole.inverse · radius sm(4)",
      "rating": "StarFilledIcon 14 + Lato Bold 14 평점 + Caption Regular muted 리뷰수",
      "buyers": "Lato/Pretendard 14/16 — 명수(Bold) + ' 구매중'(Regular). 10,000+ → '9,999+명'.",
      "soldOutOverlay": "rgba(255,255,255,0.85) · cv.textRole.subtle · Body3 Bold '품절'",
      "fontStack": "숫자(할인율/가격/구매자수/별점)는 'Lato', Pretendard, sans-serif — Lato 미로드 시 Pretendard Bold 로 graceful fallback (Lato Black 900 → Pretendard 700)."
    },
    "stateMatrix": {
      "default": "썸네일 + 메타. card border 없음 — 썸네일에만 border-subtle.",
      "hover": "opacity 0.85 (clickable 일 때만, PC only).",
      "soldOut": "썸네일에 화이트 오버레이 + '품절' 텍스트. rankingNumber/badge 자동 숨김.",
      "noDiscount": "discountPercent 미지정/0 → discount span 자체 렌더 X.",
      "ranking": "rankingNumber 지정 시 좌상단 36×36 오렌지 사각 배지. badge 보다 우선.",
      "fullCashdeal": "originalPrice + discountPercent + price + reward + freeShipping + buyersCount + rating — PC 랭킹 리스트 풀스펙."
    },
    "usagePolicy": {
      "useFor": [
        "상품 진열 카드 (가로 스크롤 행, 그리드)",
        "캐시딜 랭킹 리스트 (size='md' + rankingNumber)",
        "할인율 + 원가 + 적립 + 무료배송 등 메타가 풍부한 상품 진열"
      ],
      "doNotUseFor": [
        "장문 설명이 핵심인 콘텐츠 → Card",
        "사용자/상담사 프로필 → Card 합성 (Avatar+Title+Metadata)",
        "임의 width(180/200 등) — sm/md 두 사이즈만 SSOT."
      ],
      "limits": {
        "titleLines": 2,
        "rankingBadgeAndSoldOutMutuallyExclusive": true,
        "sizes": "sm(140) / md(236) — 임의 너비 override 비권장",
        "priceFontFamily": "Lato (숫자 전용)",
        "buyersCountAutoTruncate": "10,000 이상은 '9,999+명'"
      }
    },
    "summary": "상품 카드. `size='sm'`(140w 모바일) / `size='md'`(236w 데스크탑) 두 사이즈. 정사각 썸네일 + 제목(2줄 ellipsis) + 가격 row(할인율% + 가격 + 단위) 가 골격. 선택 슬롯: `rankingNumber` · `originalPrice`(취소선) · `reward`(적립칩) · `freeShipping` · `pointDiscount`(포인트할인 외곽선칩) · `buyersCount` · `rating` · `reviewCount`. 숫자(할인율/가격/구매자수/별점)는 Lato, 한글은 Pretendard 로 폰트 분리. 가격은 Lato Black 18 / 할인율은 Lato Medium 18 + statusError.",
    "pitfalls": [
      "`price`/`originalPrice`/`reward.amount` 는 모두 number — 자동 천단위 콤마. 외부에서 '13,900' 문자열로 가공해서 넘기지 말 것.",
      "`discountPercent` 는 number (예: 31). 0 또는 undefined 면 자동 숨김 — '0%' 표시 X.",
      "할인율 색은 `cv.textRole.statusError` 시멘틱 — 프로젝트별 자동 매핑. raw hex(#ED3E14 등) 로 override 금지.",
      "썸네일 좌상단: `rankingNumber` > `badge` > `soldOut` 우선순위. 동시 지정 시 상위 슬롯만 렌더 — 직접 가드 불필요.",
      "title 은 자동 2줄 ellipsis. size='md' 는 min-height 44px 로 2줄 정렬 보장 — 그 이상 보여주려면 디테일 화면.",
      "가격 단위('원')는 절대 Bold 로 키우지 말 것 — 가격 본문(Black)과 시각 무게 같아짐. Pretendard Regular 12 고정.",
      "`buyersCount` 는 자동 truncate — 10,000 이상은 `9,999+명` 으로 표시. 외부에서 '999,999+' 문자열로 가공해서 넘기지 말 것.",
      "`rating` 은 0-5 number. 정수면 자동 '5.0' 포맷, 소수면 첫째자리까지 (예: 4.7).",
      "`reviewCount` 는 `rating` 없으면 무시됨. 단독 노출 불가 — 평점과 묶음 정보라는 가이드.",
      "`pointDiscount` 외곽선 칩은 모바일(`size='sm'`) 캐시딜 패턴. PC 디자인에는 등장 X — 데스크탑에서 사용 자제.",
      "`rankingNumber` 는 캐시딜 랭킹 노출용. 일반 상품 진열에 임의로 1~N 박지 말 것 — 사용자가 '순위' 로 인지함."
    ],
    "recommended": [
      "기본: <ProductCard thumbnail={url} title=\"…\" discountPercent={31} price={13900} onClick={…} />",
      "캐시딜 PC 랭킹: <ProductCard size=\"md\" rankingNumber={1} originalPrice={20250} discountPercent={31} price={13900} reward={{amount:417}} freeShipping buyersCount={329} rating={5} />",
      "캐시딜 모바일: <ProductCard pointDiscount originalPrice={…} discountPercent={…} price={…} reward={{amount:…}} freeShipping buyersCount={…} rating={…} reviewCount={…} />",
      "가로 스크롤 행: flex container + overflow-x:auto + gap (sm=16, md=25). 캐러셀/랭킹 리스트 패턴.",
      "그리드: grid-template-columns:repeat(N, 140px or 236px) + gap.",
      "할인이 없으면 `discountPercent` / `originalPrice` 모두 생략 — 가격만 단독 렌더 (정상가 상품).",
      "품절: `soldOut` + thumbnail — 자동 오버레이 (badge/rankingNumber 자동 숨김)."
    ],
    "accessibility": [
      "onClick 있으면 role='button' + tabIndex + Enter/Space 핸들링 자동.",
      "thumbnailAlt 지정 권장 — 장식 이미지면 빈 문자열.",
      "rankingNumber 는 aria-label='랭킹 N위' 로 자동 노출.",
      "rating 은 aria-label='별점 5.0점' 자동 노출 — 별 아이콘은 aria-hidden.",
      "price 숫자는 시각 강조를 위해 Lato 폰트지만 일반 텍스트 — screen reader 가 그대로 읽음."
    ],
    "examplesHtml": {
      "do": "<nds-product-card thumbnail=\"/p.jpg\" product-title=\"명상 콘텐츠 1년 이용권\"\n  price=\"120000\" original-price=\"180000\" discount-percent=\"33\"\n  rating=\"4.7\" review-count=\"124\" clickable></nds-product-card>",
      "dont": "<!-- 가격을 숫자 타입으로 넘김 (attribute 는 string) — 표시 깨짐 -->\n<nds-product-card price={120000}></nds-product-card>"
    }
  },
  "ProgressBar": {
    "name": "ProgressBar",
    "summary": "value/max 기반 진행도.",
    "pitfalls": [
      "상태(주의/에러/성공)를 표현할 때는 color prop에 semantic 토큰 var(--semantic-*-main)을 넘겨 시각적 의미를 통일."
    ],
    "examplesHtml": {
      "do": "<nds-progress-bar value=\"65\" max=\"100\" size=\"md\" aria-label=\"작성 65%\"></nds-progress-bar>",
      "dont": "<!-- 결정적이지 않은 작업(=언제 끝날지 모름)에 진행률 -->\n<nds-progress-bar value=\"32\"></nds-progress-bar> <!-- 차라리 spinner 사용 -->"
    }
  },
  "ProjectBottomNav": {
    "name": "ProjectBottomNav",
    "usagePolicy": {
      "useFor": [
        "사용자 앱 (Trost/Geniet/NudgeEAP/Runmile) 모바일 하단 5탭 내비게이션"
      ],
      "doNotUseFor": [
        "웹 전용 프로젝트(CashwalkBiz) — BottomNav 자체가 없음",
        "어드민/CMS 좌측 내비 — Sidebar 사용"
      ],
      "emphasisRule": "nds-footer-tab-bar 를 손수 조립하고 SVG 를 슬롯에 박은 흔적이 발견되면 즉시 ProjectBottomNav 한 줄로 교체."
    },
    "validPropValues": {
      "trost": {
        "activeKey": [
          "home",
          "counsel",
          "community",
          "care",
          "my"
        ]
      },
      "geniet": {
        "activeKey": [
          "home",
          "record",
          "benefit",
          "review",
          "community"
        ]
      },
      "nudge-eap": {
        "activeKey": [
          "home",
          "challenge",
          "counsel",
          "care",
          "my"
        ]
      }
    },
    "summary": "**프로젝트 앱 하단 BottomNav — 손수 조립하지 말 것.** `<nds-project-bottom-nav project='trost|geniet|nudge-eap|runmile' active-key='home'>` 한 줄로 프로젝트별 5탭 (라벨/아이콘 active·inactive/색)이 PROJECT_DATA 에서 자동 렌더. 제네릭 nds-footer-tab-bar + nds-footer-tab-item 에 아이콘 SVG 를 슬롯으로 직접 주입하는 건 안티패턴.",
    "pitfalls": [
      "**손수 조립 금지** — nds-footer-tab-bar / nds-footer-tab-item 를 직접 박고 `<span slot='icon'>` 에 SVG 를 손으로 넣지 말 것. 프로젝트별 탭/아이콘/색은 ProjectBottomNav 한 줄이 PROJECT_DATA 에서 전부 자동.",
      "**cashwalk-biz 는 BottomNav 없음** — 웹 전용 프로젝트라 `<nds-project-bottom-nav project='cashwalk-biz'>` 는 빈 렌더. 어드민/CMS 좌측 내비는 Sidebar 사용.",
      "active-key 는 프로젝트별 탭 key 와 매칭 — trost: home/counsel/community/care/my · geniet: home/record/benefit/review/community · nudge-eap: home/challenge/counsel/care/my · runmile: home/race/community/chat/my. 잘못 적으면 활성 탭 표시 안 됨.",
      "**Geniet 은 단일 그래픽 + color cascade** — active/inactive 별도 아트가 아니라 같은 SVG 가 nav-item color(민트↔그레이)로 active 를 표현. Trost/NudgeEAP/Runmile 은 active/inactive 그래픽 분리(채워진 아이콘 전환).",
      "Runmile 라벨은 12/16 (Figma 실측 — 11/14 아님).",
      "`<nds-project-bottom-nav project=\"trost\">` 는 트로스트 기본 앱 5탭(홈/심리상담/커뮤니티/멘탈케어/내공간)만 커버. (캐시워크)트로스트 앱 변형(홈/사운드/내음악/커뮤니티/마이페이지)은 **현재 미지원** — 필요해지면 PROJECT_DATA 에 variant 추가(후속). 그 전까지는 제네릭 `BottomNav` primitive 로 직접 5탭을 조립한다."
    ],
    "recommended": [
      "Trost: `<nds-project-bottom-nav project='trost' active-key='counsel' />` · 탭 keys: home / counsel / community / care / my",
      "Geniet: `<nds-project-bottom-nav project='geniet' active-key='home' />` · 탭 keys: home / record / benefit / review / community (단일 그래픽 + color cascade)",
      "NudgeEAP: `<nds-project-bottom-nav project='nudge-eap' active-key='home' />` · 탭 keys: home / challenge / counsel / care / my",
      "Runmile: `<nds-project-bottom-nav project='runmile' active-key='race' />` · 탭 keys: home / race / community / chat / my (라벨 12/16)",
      "Aliases (선택): `<nds-trost-bottom-nav>`, `<nds-geniet-bottom-nav>`, `<nds-nudge-eap-bottom-nav>`, `<nds-runmile-bottom-nav>` — project attribute 안 써도 동일 동작."
    ],
    "examplesHtml": {
      "do": "<nds-project-bottom-nav project=\"trost\" active-key=\"counsel\"></nds-project-bottom-nav>",
      "dont": "<!-- 손수 조립 안티패턴 — 탭/아이콘/색을 인라인으로 박으면 프로젝트 데이터와 분리되어 다음 화면에서 또 적게 됨 -->\n<nds-footer-tab-bar active-tab=\"home\">\n  <nds-footer-tab-item key=\"home\" label=\"홈\" href=\"/\">\n    <span slot=\"icon\"><svg ...></svg></span>\n    <span slot=\"active-icon\"><svg ...></svg></span>\n  </nds-footer-tab-item>\n  <!-- ...4 more... -->\n</nds-footer-tab-bar>"
    }
  },
  "ProjectChrome": {
    "name": "ProjectChrome",
    "summary": "Project chrome wrappers — ProjectHeader + ProjectFooter + ProjectBottomNav 의 umbrella. **개별 ProjectHeader / ProjectFooter / ProjectBottomNav 가이드를 우선 참고.** `nds-project-chrome.ts` 한 파일에 5개 프로젝트 (nudge-eap / trost / geniet / cashwalk-biz / runmile) 의 PROJECT_DATA (로고/메뉴/사업자정보/footer 링크/bottomNav 탭) 가 모두 정의돼 있다. 손수 조립한 헤더/푸터/바텀네비가 발견되면 Project* 한 줄로 즉시 교체.",
    "pitfalls": [
      "이 컴포넌트는 wrapper — 실제 사용 시 `<nds-project-header>` / `<nds-project-footer>` / `<nds-project-bottom-nav>` 를 호출. `<nds-project-chrome>` 단독 사용은 없음.",
      "PROJECT_DATA 를 수정하려면 DS 레포의 `packages/html/src/components/nds-project-chrome.ts` 직접 편집 (외부 mockup 프로젝트에서는 불가능)."
    ],
    "examplesHtml": {
      "do": "<nds-project-header project=\"trost\" surface=\"web\" active-key=\"counsel\"></nds-project-header>\n<!-- ...page content... -->\n<nds-project-bottom-nav project=\"trost\" active-key=\"counsel\"></nds-project-bottom-nav>\n<nds-project-footer project=\"trost\" surface=\"app\"></nds-project-footer>",
      "dont": "<!-- nds-project-chrome 단독 사용 — wrapper 라 의미 없음 -->\n<nds-project-chrome project=\"trost\"></nds-project-chrome>"
    }
  },
  "ProjectFooter": {
    "name": "ProjectFooter",
    "forcedProps": {
      "footerTone": {
        "trost": "dark",
        "*": "light"
      }
    },
    "assetManifest": {
      "trost": [],
      "geniet": [
        "geniet-logo-footer.webp"
      ],
      "nudge-eap": [
        "nudge-eap-logo-footer.png"
      ],
      "cashwalk-biz": []
    },
    "summary": "**프로젝트 글로벌 푸터 — 손수 조립하지 말 것.** `<nds-project-footer project='...' surface='web|app'>` 한 줄로 이용약관/개인정보처리방침/사업자정보/copyright/푸터 로고가 PROJECT_DATA 에서 자동 렌더. nds-footer + nds-footer-links + nds-footer-company 직접 조립 = 안티패턴.",
    "pitfalls": [
      "**손수 조립 금지** — 이용약관/개인정보 링크, 사업자번호, CEO 이름 등을 매번 입력하지 말 것. 한 번 잘못 적으면 법적 표기 누락 위험.",
      "**푸터 로고도 base64 내장 — 파일·호스팅 불필요.** 푸터 로고가 따로 있는 프로젝트(nudge-eap/geniet/runmile)도 data URI 로 박혀 있어 `asset-base-url` 없이 그대로 렌더된다. `asset-base-url` 은 자체 로고로 바꿀 때만 쓰는 선택적 override.",
      "**surface 차이** — `web` (PC 전용 wide 푸터 · 로고+링크+회사정보), `app` (모바일 앱 footer · 압축형). 사용자 앱 모바일 화면이면 surface='app'.",
      "footerTone 은 프로젝트별 고정 (trost=dark / 나머지=light) — 임의 override 시도 시 디자인 인텐트 어긋남."
    ],
    "recommended": [
      "Trost (dark): `<nds-project-footer project='trost' surface='app' />` · 로고 base64 내장 (파일 불필요)",
      "Geniet (light): `<nds-project-footer project='geniet' surface='web' />` · 로고 base64 내장 (파일 불필요)",
      "NudgeEAP (light): `<nds-project-footer project='nudge-eap' surface='web' />` · 로고 base64 내장 (파일 불필요)",
      "CashwalkBiz (light): `<nds-project-footer project='cashwalk-biz' surface='web' />` · 로고 base64 내장 (파일 불필요)",
      "Runmile (light): `<nds-project-footer project='runmile' surface='app' />` · 로고 base64 내장 (gray700 워드마크) · footerTone=light (forcedProps '*' default)",
      "자체 로고로 교체할 때만: `asset-base-url='/assets'` (override 전용 · 기본 목업엔 불필요).",
      "Aliases: `<nds-trost-footer>`, `<nds-geniet-footer>`, `<nds-nudge-eap-footer>`, `<nds-cashwalk-biz-footer>`, `<nds-runmile-footer>`"
    ],
    "examplesHtml": {
      "do": "<nds-project-footer project=\"geniet\" surface=\"web\"></nds-project-footer>",
      "dont": "<!-- 손수 조립 안티패턴 — 사업자 정보/copyright/링크를 인라인으로 적으면 법적 표기 누락/잘못된 정보가 SSOT 깨고 페이지 간 불일치 -->\n<footer class=\"my-footer\">\n  <a href=\"/terms\">이용약관</a> | <a href=\"/privacy\"><b>개인정보처리방침</b></a>\n  <p>넛지모바일 주식회사 · 사업자번호 ...</p>\n</footer>"
    }
  },
  "ProjectHeader": {
    "name": "ProjectHeader",
    "usagePolicy": {
      "useFor": [
        "사용자 앱 (Trost/Geniet/NudgeEAP/CashwalkBiz/Runmile) PC GNB",
        "사용자 앱 모바일 compact 헤더 (surface='mobile')",
        "webview 페이지 뒤로가기/타이틀 헤더 (surface='webview')"
      ],
      "doNotUseFor": [
        "어드민/CMS — antd Layout.Sider 사용 (단, 캐포비(cashwalk-biz) 어드민은 예외로 DS Sidebar — get_guide({ topic:'component:Sidebar' }))",
        "단일 시연용 임시 화면이라 프로젝트 정체성이 무의미한 경우"
      ],
      "emphasisRule": "헤더/푸터를 손수 조립한 흔적이 발견되면 즉시 ProjectHeader/ProjectFooter 한 줄로 교체. 메뉴 라벨이나 로고를 페이지마다 적는 건 SSOT 위반."
    },
    "validPropValues": {
      "trost": {
        "activeKey": [
          "home",
          "counsel",
          "test",
          "care",
          "center"
        ]
      },
      "geniet": {
        "activeKey": [
          "home",
          "community",
          "deal",
          "review"
        ]
      },
      "nudge-eap": {
        "activeKey": [
          "counsel",
          "test",
          "therapy",
          "letter",
          "news",
          "my"
        ]
      },
      "cashwalk-biz": {
        "activeKey": [
          "channel",
          "ad",
          "case",
          "notice",
          "guide"
        ]
      }
    },
    "assetManifest": {
      "trost": [
        "trost-logo.svg"
      ],
      "geniet": [
        "geniet-logo-pc.webp",
        "geniet-logo-footer.webp"
      ],
      "nudge-eap": [
        "nudge-eap-logo.png",
        "nudge-eap-logo-footer.png"
      ],
      "cashwalk-biz": [
        "project/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg"
      ]
    },
    "summary": "**프로젝트 GNB 헤더 — 손수 조립하지 말고 무조건 이걸 먼저 쓸 것.** `<nds-project-header project='trost|geniet|nudge-eap|cashwalk-biz|runmile' surface='web|mobile|webview' active-key='...'>` 한 줄로 로고/메뉴/auth 버튼/검색바가 프로젝트별 PROJECT_DATA 에서 자동 렌더. nds-header + nds-header-logo + nds-header-menu + nds-header-menu-item × N + nds-header-actions + nds-header-auth-button 직접 조립 = 안티패턴.",
    "pitfalls": [
      "**손수 조립 금지** — nds-header / nds-header-logo / nds-header-menu / nds-header-menu-item / nds-header-actions / nds-header-auth-button 를 직접 박지 말 것. 메뉴 라벨/href/순서를 손으로 적으면 프로젝트 일관성이 깨지고 다음 프로젝트 화면에서 또 적게 됨. ProjectHeader 한 줄이 PROJECT_DATA 에서 전부 자동.",
      "**로고는 base64 내장 — 자산 파일·호스팅 불필요.** 5개 프로젝트 로고가 PROJECT_DATA 에 data URI 로 박혀 있어 `asset-base-url` 없이도 어디서든 안 깨지고 렌더된다 (단일 HTML 목업 그대로 OK). `asset-base-url` 은 **자체 로고로 바꿀 때만** 쓰는 선택적 override — `public/assets/project/{project}/logos/` 폴더를 만들 의무는 없다.",
      "**surface 별 출력 다름** — `web` (PC GNB · 로고+메뉴+auth), `mobile` (compact 헤더 · 로고+auth), `webview` (뒤로가기 + 타이틀만). 모바일 화면이면 surface='mobile' 명시.",
      "**서브페이지(상세/카테고리/폼) 뒤로+타이틀 헤더 = `surface=\"webview\"`** (+ `header-title`). 이게 정답 — `nds-icon-button` + 타이틀로 sticky 앱바를 **손수 조립하지 말 것**(손수조립 안티패턴). webview 헤더는 정상 렌더된다(약 52px).",
      "**호스트 엘리먼트는 `display:contents` — 그 자체의 height 는 0 으로 측정된다(정상).** `<nds-project-header>`/`<nds-header>` 의 `getBoundingClientRect().height` 가 0 이라고 \"헤더가 안 뜬다\"고 오진하지 말 것. 실제 헤더 박스(내부 `<header class=\"nds-header\">`)가 높이·sticky 를 갖는다. 호스트를 측정/스타일/포지셔닝하려 하지 말고(거기에 `position:sticky`·`height` 걸어도 안 먹음) 컴포넌트가 알아서 한다.",
      "active-key 는 PROJECT_DATA[project].webMenu 의 key 와 매칭. 잘못 적으면 활성 메뉴 표시가 안 됨. 각 프로젝트 key 목록은 nds-project-chrome.ts PROJECT_DATA 또는 아래 recommended 참고."
    ],
    "recommended": [
      "Trost: `<nds-project-header project='trost' surface='web' active-key='counsel' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: home / counsel / test / care / center",
      "Geniet: `<nds-project-header project='geniet' surface='web' active-key='deal' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: home / community / deal / review",
      "NudgeEAP: `<nds-project-header project='nudge-eap' surface='web' active-key='counsel' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: counsel / test / therapy / letter / news / my",
      "CashwalkBiz: `<nds-project-header project='cashwalk-biz' surface='web' active-key='ad' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: channel / ad / case / notice / guide",
      "Runmile: `<nds-project-header project='runmile' surface='web' active-key='race' />` · 로고 base64 내장 (파일 불필요) · webMenu keys: race / community · web 헤더 = 좌측 워드마크+nav · 중앙 coral 검색바 · 우측 채팅/로그인 액션 자동. mobile=52h 중앙 워드마크 bar.",
      "자체 로고로 교체할 때만: `asset-base-url='/assets'` + 해당 파일 배치 (override 전용 · 기본 목업엔 불필요).",
      "Aliases (선택): `<nds-trost-header>`, `<nds-geniet-header>`, `<nds-nudge-eap-header>`, `<nds-cashwalk-biz-header>`, `<nds-runmile-header>` — project attribute 안 써도 동일 동작."
    ],
    "examplesHtml": {
      "do": "<nds-project-header project=\"geniet\" surface=\"web\" active-key=\"deal\"></nds-project-header>",
      "dont": "<!-- 손수 조립 안티패턴 — 메뉴 라벨/href 를 인라인으로 적으면 프로젝트 데이터와 분리되어 다음 화면에서 또 적게 됨 -->\n<nds-header variant=\"web\" position=\"static\" max-width=\"1200\">\n  <nds-header-logo href=\"/\"><img src=\"...\" /></nds-header-logo>\n  <nds-header-menu>\n    <nds-header-menu-item href=\"/community\">커뮤니티</nds-header-menu-item>\n    <nds-header-menu-item href=\"/cashdeal\" active>헬시딜</nds-header-menu-item>\n  </nds-header-menu>\n</nds-header>"
    }
  },
  "ProjectLogo": {
    "name": "ProjectLogo",
    "summary": "프로젝트 대표 로고(trost/geniet/nudge-eap/cashwalk-biz/runmile)를 컴포넌트로 박는다. base64 data URI 가 내장돼 단일 HTML/오프라인에서도 안 깨진다. `<nds-sidebar project>` / `<nds-project-header project>` 가 주입하는 것과 동일한 로고 SSOT(project-logo-defaults). project chrome(헤더/사이드바)이 없는 화면 — 캐포비 어드민 온보딩 카드, **백오피스/CMS 사이드바·헤더, 어드민 셸의 로고 슬롯** 등 — 에서 로고를 넣는 표준 진입점. 5개 프로젝트 전부 동일하게 동작(캐포비 전용 아님).",
    "pitfalls": [
      "35KB base64 data URI 를 logo-src/img 로 손수 붙이지 말 것 — project 만 주면 자동 주입. 거대 블롭 추출·재인코딩이 한글 모지바케+로고 유실 회귀의 직접 원인.",
      "raw <img>/<svg> 로 로고를 직접 조립하지 말 것 — ProjectLogo 로 박아야 5개 프로젝트 일관 + SSOT 유지.",
      "**백오피스/CMS 사이드바 로고를 텍스트 placeholder·색박스로 두거나 빌드 산출물에서 로고 base64 를 추출해 박지 말 것** — 5개 프로젝트 로고가 에셋 패키지에 data URI 로 모두 내장돼 있다. 사이드바는 `<nds-sidebar project=\"…\">` 가 로고를 자동 주입, chrome 밖이면 `<nds-project-logo project=\"…\">`. 자산 목록은 `get_project({ project, assetKind: 'logos' })`. (validator `admin-sidebar-logo-not-component` 가 이 우회를 잡는다.)",
      "**\"antd 등 비-DS 화면이라 패키지를 못 가져온다\"는 오해** — React/호스팅 앱은 `import { getProjectLogo } from '@nudge-design/assets'` 로 dataUri 를 받거나 `<ProjectLogo project=\"…\" />` 를 그대로 쓴다. 로고 자체는 import 한 줄이면 끝 — 빌드 결과물에서 base64 를 떼어다 붙이는 우회는 불필요하다.",
      "height 만 주면 폭은 비율 유지(auto). width 를 강제하면 찌그러질 수 있다.",
      "헤더/푸터/사이드바 안에서는 ProjectLogo 를 또 박지 말 것 — 그 컴포넌트들은 project 속성으로 로고를 이미 자동 주입한다. ProjectLogo 는 chrome 이 없는 화면용."
    ],
    "recommended": [
      "백오피스/CMS·어드민 셸 사이드바 로고: <nds-sidebar project='geniet'> 만 두면 로고 자동 주입 — 사이드바 밖 단독 로고면 <nds-project-logo project='geniet'> (pattern:admin-shell)",
      "캐포비 어드민 온보딩 카드 상단: <nds-project-logo project='cashwalk-biz' height='40'> (pattern:cashwalk-biz-page-onboarding)",
      "React/antd 등 호스팅 앱: import { getProjectLogo } from '@nudge-design/assets' 또는 <ProjectLogo project='…' />",
      "로고 클릭 시 홈 이동: href 지정"
    ],
    "examplesHtml": {
      "do": "<nds-project-logo project=\"cashwalk-biz\" height=\"40\"></nds-project-logo>\n<!-- 링크: --><nds-project-logo project=\"nudge-eap\" href=\"/\"></nds-project-logo>",
      "dont": "<!-- 35KB base64 를 손으로 붙이거나 raw img/svg 로 로고 조립 — 모지바케·로고 유실 회귀 -->\n<img src=\"data:image/svg+xml;base64,PHN2Zy…(35KB)…\" />\n<!-- CMS/백오피스 사이드바 로고를 텍스트·색박스 placeholder 로 — 에셋 패키지에 실 로고 있음 -->\n<div class=\"cms-sidebar-logo\">geniet</div>"
    }
  },
  "QuickMenu": {
    "name": "QuickMenu",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1354-52",
    "summary": "PC 화면 우측 고정(sticky/fixed) 영역에서 자주 쓰는 **전역 액션 2~4개(3개 권장)**를 빠르게 노출하는 보조 navigation. Container(width 120 · radius 12 · White · overlay shadow) + Header(\"QUICK MENU\" Bold 13 project) + Menu Item × N(IconCircle 60 + 라벨) + 하단 TOP(맨 위로) 버튼으로 구성. 고빈도·즉시성·전역 도달이 핵심 — 페이지별 컨텍스트 액션과 분리한다.",
    "pitfalls": [
      "**모바일/태블릿(<1024)에는 노출하지 않는다** — 하단 Tab Bar 로 대체. `fixed` 속성을 쓰면 <1024 에서 자동 숨김된다.",
      "아이템은 **전역에서 항상 유효한 액션**만(예: 상담사 찾기). 페이지 컨텍스트별 임시 액션은 컨텍스트 메뉴/툴바로.",
      "아이템 **5개 이상 금지** — 스크롤 발생. 3개 ±1 로 인지부하 최소화.",
      "라벨은 **한글 8자 이내** — 두 줄 wrap 방지. `showLabel=false`(아이콘만)는 식별성 저하라 비권장.",
      "**icon = inline SVG 문자열 (이름/이모지 아님).** `icon` 은 innerHTML 로 주입되므로 `\"icon\":\"home\"` 같은 이름/이모지를 넣으면 텍스트로 흘러나온다. `find_icon({ name })` → 반환 inline SVG 를 넣는다. Icon Library 의 32px line style 로 통일. React `QuickMenu` 의 `icon: ReactNode` 와 대칭, nds-sidebar 와 동일 규약.",
      "한 페이지에 **두 개 이상 노출 금지**. 위치는 PC 우측 고정 — top 172 / right 24~40 / z-index 900(모달·토스트보다 아래). 오프셋은 `--nds-quickmenu-top/right/z` 로 override.",
      "색을 hex 로 박지 말 것 — 헤더는 `--semantic-text-brand-default`(project cascade)라 프로젝트별 색이 자동 적용된다."
    ],
    "recommended": [
      "상담 서비스 홈: 바로 상담하기 / 상담사 찾기 / 내 상담방 (3개)",
      "TOP 버튼은 스크롤이 viewport 1.5배 이상일 때만 표시(`show-top` 으로 토글).",
      "콘텐츠 영역과 겹치지 않게 우측 여백 24~40 확보."
    ],
    "examplesHtml": {
      "do": "<nds-quick-menu fixed\n  items='[{\"key\":\"counsel\",\"label\":\"바로 상담하기\",\"icon\":\"<svg ...>...</svg>\"},{\"key\":\"search\",\"label\":\"상담사 찾기\",\"icon\":\"<svg ...>...</svg>\"},{\"key\":\"room\",\"label\":\"내 상담방\",\"icon\":\"<svg ...>...</svg>\"}]'></nds-quick-menu>\n<!-- icon = find_icon({name}) inline SVG (이름/이모지 아님 — innerHTML). items 는 JSON 속성이라 SVG의 \" 는 \\\" 로 이스케이프. key 필수(없으면 렌더 제외) -->\n<script>\n  el.addEventListener(\"quick-menu-item\", e => navigate(e.detail.key));\n  el.addEventListener(\"quick-menu-top\", () => window.scrollTo({ top: 0, behavior: \"smooth\" }));\n</script>",
      "dont": "<!-- 5개 이상 + 라벨 없이 아이콘만 + 모바일 노출 — 모두 금지 -->\n<nds-quick-menu items='[{\"key\":\"a\",\"icon\":\"home\"},{\"key\":\"b\",\"icon\":\"chat\"},{\"key\":\"c\",\"icon\":\"user\"},{\"key\":\"d\",\"icon\":\"bell\"},{\"key\":\"e\",\"icon\":\"gear\"}]'></nds-quick-menu>\n<!-- 틀린 점: 아이템 5개(스크롤) · icon 에 이름(텍스트로 흘러나옴 — inline SVG 여야) · 라벨 누락(식별성 저하) -->"
    }
  },
  "Radio": {
    "name": "Radio",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5158-108",
    "summary": "단일 선택 입력. 단독으로 쓸 일은 거의 없고, RadioGroup + RadioGroupItem 조합으로 사용.",
    "pitfalls": [
      "Radio를 단독으로 여러 개 두고 same name만 맞추는 패턴은 동기화 버그가 잦음. 무조건 RadioGroup으로 감쌀 것.",
      "RadioGroupItem은 RadioGroupContext 안에서만 동작. throw가 나면 RadioGroup으로 감싸지지 않은 것.",
      "value prop은 string. 숫자/객체 쓸 거면 String(value)로 직렬화하고 onValueChange에서 다시 파싱.",
      "**트로스트(Controls 가이드 5158:108)**: 컨트롤 24×24, on 상태 = **다크 #333 테두리+점**(프로젝트 노랑 아님 — 트로스트 토큰 radio.checkedColor). 라벨 우측 gap 12, 그룹 vertical stack 행간 12. 상호배타 옵션에만(독립 다중은 Checkbox). 필수면 그룹 라벨 * + 미선택 시 하단 Helper 에러.",
      "**런마일(Controls 가이드 5111:345)**: 24×24, on = **오렌지 #FF5B37 ring+점**(트로스트 다크와 달리 fill.brand fallback — checkedColor 미설정). off=원 outline. 단일 선택 그룹(한 그룹 1개만)·정렬 옵션."
    ],
    "recommended": [
      "<RadioGroup name=\"freq\" value={v} onValueChange={setV}> <RadioGroupItem value=\"daily\" label=\"매일\" /> ... </RadioGroup>",
      "horizontal 옵션 3개 이하일 때만 layout=\"horizontal\". 그 이상이면 vertical이 스캔 쉬움."
    ],
    "interactivePattern": "그룹 단위로 onValueChange 한 번만 부착. 개별 Radio에 onCheckedChange 부착하지 말 것.",
    "examplesHtml": {
      "do": "<form>\n  <nds-radio name=\"freq\" value=\"daily\" label=\"매일\" checked></nds-radio>\n  <nds-radio name=\"freq\" value=\"weekly\" label=\"주 1회\"></nds-radio>\n</form>",
      "dont": "<!-- 같은 그룹인데 name 이 서로 다름 — 둘 다 선택 가능해짐 -->\n<nds-radio name=\"freq-a\" value=\"daily\" label=\"매일\"></nds-radio>\n<nds-radio name=\"freq-b\" value=\"weekly\" label=\"주 1회\"></nds-radio>"
    }
  },
  "ResultState": {
    "name": "ResultState",
    "summary": "데이터/검색 결과/기록 없음(`status=\"empty\"`) + 결과 화면(`status=\"success|error|info\"` — 결제 성공·404·권한 없음 등)을 한 anatomy 로 표시. 단순 '없음' 메시지 대신 다음 액션(추가하기 / 다시 검색 / 홈으로)을 제안한다.",
    "pitfalls": [
      "title 만 있고 description / action 누락 — 사용자에게 다음 행동을 안내하지 않음.",
      "인라인 placeholder ↔ 풀페이지 결과 화면의 차이는 `status` 가 아니라 `minHeight` 로 조절한다. 빈 리스트는 작게(예: 200), 결제 성공·404 결과 화면은 `minHeight=\"60vh\"` 처럼 크게. **같은 컴포넌트, altitude 만 다름.**",
      "에러/성공 결과에는 반드시 `status=\"error|success\"` — 색·기본 글리프가 시멘틱하게 바뀐다. status 없이 중립 빈상태로 에러를 표현하면 시그널이 약함.",
      "인라인 placeholder 를 footer/nav 위로 풀스크린 채우지 말 것 — 영역 안 placeholder 면 `minHeight` 를 작게 둔다(풀페이지는 결과 화면 전용).",
      "`icon` 을 직접 주면 `status` 기본 글리프를 덮어쓴다(색은 `status` 가 계속 구동). 프로젝트 일러스트가 있으면 `icon` 으로 주입."
    ],
    "recommended": [
      "status: 빈 리스트/검색결과 `empty`(기본·중립), 결제·제출 성공 `success`, 404·실패 `error`, 안내·점검중 `info`",
      "결과 화면(풀페이지)은 `minHeight=\"60vh\"` + `action` 에 1차 CTA(홈으로/다시 시도)"
    ],
    "examplesHtml": {
      "do": "<!-- 인라인 빈 상태 -->\n<nds-result-state title=\"아직 작성한 일기가 없어요\" description=\"오늘의 감정을 기록해 보세요\" action=\"작성하기\"></nds-result-state>\n<!-- 풀페이지 결과(성공) -->\n<nds-result-state status=\"success\" min-height=\"60vh\" title=\"결제가 완료됐어요\" description=\"이용 내역은 마이페이지에서 확인할 수 있어요\" action=\"홈으로\"></nds-result-state>",
      "dont": "<!-- 에러인데 status 없이 중립 빈상태 — 시그널 약함 -->\n<nds-result-state title=\"페이지를 찾을 수 없어요\"></nds-result-state>"
    }
  },
  "ReviewCard": {
    "name": "ReviewCard",
    "summary": "별점 후기 카드 (0.5 단위). 작성자/별점/본문/태그/푸터 슬롯, verified 인증 마크.",
    "pitfalls": [
      "rating은 0-5, 0.5 단위. 범위 밖이면 시각적으로 깨짐.",
      "본문 줄바꿈은 white-space: pre-wrap 자동 — body에 \\n 그대로 사용.",
      "**'도움돼요'·좋아요·신고 같은 리뷰 액션은 반드시 `footer` 슬롯(html `slot=\"footer\"`)에 넣어 카드 안에 둔다.** 카드 밖 형제로 두면 흰 배경 밖으로 떨어져 어느 리뷰의 액션인지 연결이 끊긴다 — 실제 목업에서 자주 나오는 오용. footer는 자유 슬롯이라 LikeButton/도움됨 버튼/텍스트 모두 가능.",
      "리뷰를 여러 개 나열할 땐 ReviewCard 를 직접 쌓지 말고 `pattern:review-list` 를 따른다 (List 컨테이너 + footer 에 더보기/Pagination)."
    ],
    "recommended": [
      "상담 후기: verified + tags=['편안함','전문성']",
      "상품 리뷰: meta='구매 인증' + verified",
      "도움돼요/좋아요: `footer` 슬롯에 LikeButton 또는 TextButton"
    ],
    "examplesHtml": {
      "do": "<!-- 도움돼요 는 footer 슬롯 → 카드 안에 들어간다 -->\n<nds-review-card author=\"건강맘4**\" meta=\"2026.03.15 · 구매인증\"\n  rating=\"5\" body=\"3개월 정도 먹고 눈 피로가 줄었어요. 재구매 의향 있어요.\" verified>\n  <button slot=\"footer\" class=\"nds-text-button\" type=\"button\">도움돼요 34</button>\n</nds-review-card>",
      "dont": "<!-- ① rating=\"6\" — max(5) 초과로 표시가 깨짐 -->\n<nds-review-card author=\"…\" rating=\"6\"></nds-review-card>\n\n<!-- ② 도움돼요 를 카드 밖 형제로 — 카드 경계(흰 배경) 밖으로 떨어져 리뷰와 끊긴다.\n     → slot=\"footer\" 로 카드 안에 넣을 것 -->\n<nds-review-card author=\"…\" rating=\"5\" body=\"…\"></nds-review-card>\n<button>도움돼요 34</button>"
    }
  },
  "RunmileScrollFab": {
    "name": "RunmileScrollFab",
    "_htmlStatus": "no-html-equivalent",
    "figmaNodeUrl": "https://www.figma.com/design/udH9ME1HnHk4kbxR17Neig/?node-id=520-3221",
    "summary": "**미구현 — Figma SSOT 등록만.** Runmile 스크롤 탑/바텀 FAB. state=top|bottom × device=pc|mo 4가지 (pc 60×60, mo 52×52). 구현은 별도 PR.",
    "pitfalls": [
      "현재 React/HTML 컴포넌트 없음. top FAB 와 bottom FAB 가 하나의 컴포넌트인지 (direction prop) 둘로 분리인지 (RunmileScrollTopFab / RunmileScrollBottomFab) 는 구현 시 결정.",
      "pc/mo 사이즈 차이는 컨테이너 폭으로 분기하기보다 device prop 으로 명시 추천 — Figma variant 와 1:1."
    ]
  },
  "RunmileToast": {
    "name": "RunmileToast",
    "_htmlStatus": "no-html-equivalent",
    "figmaNodeUrl": "https://www.figma.com/design/udH9ME1HnHk4kbxR17Neig/?node-id=24-91",
    "summary": "**미구현 — Figma SSOT 등록만.** Runmile Toast — Property 1=PC (226×48) / Property 1=MO (196×44). 구현은 별도 PR.",
    "pitfalls": [
      "현재 React/HTML 컴포넌트 없음. 공용 `<Toast>` 가 있다면 그쪽으로 project mode 분기하거나, 신규 RunmileToast 로 구현 결정.",
      "PC ↔ MO 가 size 만 다른지 아니면 layout 도 다른지는 Figma 24:85 / 24:90 디테일 확인 필요."
    ]
  },
  "SearchInput": {
    "name": "SearchInput",
    "summary": "검색어 입력 + debounce + clear. dropdown suggestion 이 필요하면 nds-autocomplete 사용.",
    "pitfalls": [
      "debounce 0 으로 매 keystroke 마다 fetch — 백엔드 부하 / UI flicker. 200-400ms 권장.",
      "min-query-length 미설정 — 1글자 입력에 즉시 fetch 가 일어남.",
      "검색 결과 dropdown 이 필요한데 nds-input + 자체 panel 로 흉내 — nds-autocomplete 로 일원화."
    ],
    "examplesHtml": {
      "do": "<nds-search-input placeholder=\"검색어 입력\" label=\"상담사 찾기\" debounce=\"300\" min-query-length=\"2\" clearable></nds-search-input>\n<script>el.addEventListener(\"search-input\", e => fetch(e.detail.value));</script>",
      "dont": "<!-- debounce 없음 + min-query-length 없음 — 매 keystroke fetch -->\n<nds-search-input placeholder=\"검색\"></nds-search-input>"
    }
  },
  "Select": {
    "name": "Select",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903",
    "summary": "드롭다운. options + value + onValueChange. 옵션이 많으면 `searchable`(검색형, Ant showSearch 모델)로 label 필터 — 단, 값은 항상 옵션 중에서만 선택된다(자유 입력 X).",
    "pitfalls": [
      "**폭은 기본 전체너비(fullWidth/full-width=true)** — 폼/FormField 안에서 트리거가 100% 를 채운다(캐포비 어드민 폼 기본 규칙). 좁게 써야 하는 경우(어드민 검색 필터 등)에만 `full-width=\"false\"`(React `fullWidth={false}`)를 명시. 드롭다운 메뉴 폭은 전체너비면 트리거 폭으로 고정, auto(좁은) 셀렉트는 가장 넓은 옵션까지 grow 후 캡(360px) — 캡/트리거폭에 닿으면 옵션 라벨이 줄바꿈 대신 말줄임. 메뉴를 트리거보다 임의로 넓게 만들지 말 것.",
      "변경 핸들러는 **onValueChange** (onChange 아님). React 표준이 아닌 DS 컨벤션.",
      "**드롭다운 흉내 금지** — `<nds-button>` / raw `<button>` + ChevronRight/ChevronDown 아이콘 조합으로 드롭다운 모양만 따라 그리지 말 것. 키보드 탐색·focus trap·옵션 list a11y 가 전부 빠짐. 옵션이 1개라도 있으면 무조건 `<nds-select>` 또는 React `<Select>`. 'scope switcher / sort / filter' 같이 옵션이 동적이면 더더욱 raw button 금지.",
      "옵션이 2-3 개의 토글성 선택지면 Tab / Segment 도 고려 — Select 는 옵션 수가 많거나 라벨이 긴 경우.",
      "**Select(searchable) vs Autocomplete 구분** — 옵션 목록에서 *고르는* 검색은 `Select searchable`(값은 옵션으로 제약). 사용자가 *목록에 없는 값을 자유 입력*하거나 서버에서 비동기로 받은 제안을 보여주는 거면 Autocomplete. searchable 로 자유 입력을 흉내내지 말 것.",
      "`searchable` 검색 placeholder 는 `search-placeholder`(React `searchPlaceholder`), 결과 0건 문구는 `empty-message`(React `emptyMessage`)."
    ],
    "examplesHtml": {
      "do": "<nds-select value=\"kr\" label=\"국가\" placeholder=\"선택하세요\">\n  <nds-select-option value=\"kr\">대한민국</nds-select-option>\n  <nds-select-option value=\"jp\" disabled>일본</nds-select-option>\n</nds-select>\n<script>sel.addEventListener(\"select-change\", e => setCountry(e.detail.value));</script>\n<!-- 옵션이 많으면 searchable(검색형, Ant showSearch 모델) — 값은 여전히 옵션 중에서만 선택 -->\n<nds-select label=\"거주 지역\" placeholder=\"선택\" searchable search-placeholder=\"지역명으로 검색\">\n  <nds-select-option value=\"seoul\">서울특별시</nds-select-option>\n  <nds-select-option value=\"busan\">부산광역시</nds-select-option>\n</nds-select>",
      "dont": "<!-- nds-select 안에 raw <option> -> 드롭다운이 렌더 안 됨 -->\n<nds-select value=\"kr\"><option value=\"kr\">대한민국</option></nds-select>\n<!-- 자유 입력(목록에 없는 값)이 필요한데 searchable 로 우회 — 그건 Autocomplete -->\n<nds-select searchable>...직접 입력값 허용 의도...</nds-select>"
    }
  },
  "SelectedItemsPanel": {
    "name": "SelectedItemsPanel",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3828-1577",
    "sizeMatrix": {
      "panel": "padding inset-modal · border border.normal · radius xl(16) · bg surface.subtle",
      "title": "headline4 18/26 Bold · text.strong",
      "count": "headline4 18/26 Bold · text.project (강조 개수)",
      "actionPrimary": "fill.neutral bg · text.inverse · radius md(8) · body3 Bold · + 아이콘 16",
      "actionGhost": "transparent + border.strong · text.subtle · radius md(8) · refresh 아이콘 16",
      "body": "flex column · gap 8 · overflow-y auto (max-height = --nds-selected-items-panel-body-max-height)",
      "selectedItemRow": "padding 8/12/8/16 · radius lg(12) · bg surface.section · label body1 · 삭제 X 20px. **캐포비(cashwalk-biz)**: bg gray/200(#eee) · radius 10 · 삭제 = 원형 serchdelete 아이콘 (Figma 3001:18463, data-project cascade 자동)."
    },
    "usagePolicy": {
      "useFor": [
        "캐시워크 포 비즈니스 admin 의 다중 선택 결과 패널 (선택한 항목/지역/카테고리/멤버 N개)",
        "선택 picker 와 짝을 이루는 '현재 선택' 요약 + 개별 제거"
      ],
      "doNotUseFor": [
        "단일 선택 — Select/Dropdown",
        "일반 정보 카드 — Card",
        "체크박스 목록 자체 — Checkbox 그룹"
      ],
      "limits": {
        "headerActions": "선택 해제(기본) + 추가 선택(옵션). 피커 모달 안 = 선택 해제만(HTML hide-add / React onAdd 미전달). 추가 선택 시각 = secondary Button + plus 아이콘.",
        "body": "INSTANCE_SWAP 슬롯 (SelectedItemRow / 폼 / 테이블)"
      }
    },
    "summary": "선택 항목 슬롯 패널 — 헤더(타이틀 + 강조 개수 + 선택 해제 + 옵션 추가 선택), 본문은 SelectedItemRow 리스트·폼·테이블 등으로 swap 하는 INSTANCE_SWAP 슬롯. 캐포비 admin 의 다중 선택 결과 패널. **피커 모달 안에서는 '선택 해제'만 노출(추가 선택 X)**. SelectedItemRow(라벨 + 삭제 X) 동봉, RegionRow 는 하위호환 alias.",
    "pitfalls": [
      "**선택한 항목/지역/카테고리/멤버 등 '동적 다중 선택 결과'를 Chip/ActionChip 으로 인라인 나열 금지** — 노란 outlined 칩은 SelectionButton 과 시각적으로 같아 혼동되고, '추가 선택/선택 해제'·개수 강조·개별 제거 affordance 가 빠진다. 회색 `SelectedItemsPanel`(surface.subtle 패널) + `SelectedItemRow`(라벨 + 삭제 X) 로 그릴 것. 지역 picker 는 한 예시일 뿐이며, 그 경우에도 row 컴포넌트는 동일하다.",
      "개수를 타이틀 문자열에 직접 넣지 말 것 — `count` prop/속성이 text.project 색으로 강조 렌더. 타이틀은 명사만.",
      "헤더 액션은 **선택 해제(onClear)** 가 기본이고 **추가 선택(onAdd)은 옵션** — 임의의 버튼을 헤더에 더 끼워넣지 말 것. **★ 피커 모달 우측 패널에서는 '추가 선택' 노출 금지 → 선택 해제만.** React 는 `onAdd` 미전달 시 자동 숨김이지만, **HTML 웹컴포넌트(`nds-selected-items-panel`)는 추가/해제 둘 다 기본 렌더라 모달에서는 `hide-add` 속성을 반드시 줘야 한다**(안 주면 모달 안에 '추가 선택'이 떠서 회귀). '추가 선택'은 모달 밖에서만 쓰며, 시각 스펙은 **secondary Button + plus(+) 아이콘**.",
      "**캐포비 admin 타겟팅에서 추가 경로(add 어포던스)는 하나만** — 패널 밖 별도 추가 버튼 + 패널 안 '추가 선택' 을 둘 다 두지 말 것(중복 UI, 회귀). 추가는 패널 onAdd(=모달 열기) 한 곳으로 통일하고, 그 클릭이 **2단 모달**(좌: 검색+체크박스 트리, 우: SelectedItemsPanel `hide-add` + 선택 해제, 풋터: full-width '적용')을 띄운다 — 모달이 안 뜨고 페이지에 인라인으로 또 그리면 안 된다. 캐포비 admin validator 에서만 `selected-item-add-affordance-duplicated` 로 막는다(다른 프로젝트/표면 전역 룰 아님).",
      "**같은 항목을 패널에 중복 추가 금지** — 추가 시 이미 있으면 무시(유니크). 같은 항목이 두 줄 = 회귀(검증룰 selected-item-row-duplicated).",
      "본문 항목 삭제는 SelectedItemRow 의 onRemove(또는 nds-selected-item-remove / nds-region-remove 이벤트)로 — 패널이 항목 상태를 들고 있지 않음(controlled). 호스트가 리스트를 갱신.",
      "본문이 길어지면 화면을 덮지 않도록 `--nds-selected-items-panel-body-max-height` 로 스크롤 제한.",
      "SelectedItemRow 는 패널 전용 행 — 일반 리스트/태그 자리에는 ListItem/Chip 사용. **패널 밖 sibling 으로 SelectedItemRow 를 두지 말 것** — 추가분을 패널 다음에 append 하면 패널 body 의 flex gap(8)을 못 타서 행끼리 간격 없이 붙고 회색 패널 밖에 렌더된다(검증룰 selected-item-row-outside-panel).",
      "**(HTML) 항목 갱신 시 `panel.innerHTML = ''` 로 통째로 비우지 말 것** — 헤더(타이틀/개수/추가·해제 액션)는 컴포넌트가 mount 시 생성하는 chrome 이라 innerHTML 을 비우면 헤더까지 사라지고 자동 복구되지 않음(connectedCallback 재실행 안 함). 갱신은 ① body 의 `nds-selected-item-row` 자식만 교체(추가·제거)하거나 ② `<nds-selected-items-panel>` 엘리먼트 자체를 새로 만들어 통째 교체. 개수는 `count` 속성으로만 갱신.",
      "**(HTML) 이벤트(nds-selected-items-add/clear, nds-selected-item-remove, nds-region-remove)는 재렌더로 사라지지 않게 host(또는 상위 컨테이너)에 위임** — 행을 매번 새로 그리면 행에 직접 단 리스너는 유실됨. 부모에서 한 번만 바인딩하고 `e.target`/`closest('nds-selected-item-row, nds-region-row')` 로 분기."
    ],
    "recommended": [
      "피커 모달 우측 패널(추가 선택 없음): <SelectedItemsPanel title=\"선택한 항목\" count={items.length} onClear={clearAll}>{items.map(i => <SelectedItemRow key={i.id} onRemove={() => remove(i.id)}>{i.label}</SelectedItemRow>)}</SelectedItemsPanel> · HTML 은 <nds-selected-items-panel hide-add …>.",
      "모달 밖 페이지/타겟팅 폼(추가 선택 있음): onAdd 추가 — <SelectedItemsPanel title=\"선택한 항목\" count={items.length} onAdd={openPicker} onClear={clearAll}>…</SelectedItemsPanel>. onAdd 가 렌더하는 추가 버튼 = secondary + plus(+) 아이콘.",
      "본문 swap: SelectedItemRow 리스트 대신 폼/데이터테이블을 children 으로 그대로 넣어도 됨.",
      "액션 숨김: showActions={false} (읽기 전용 요약 패널)."
    ],
    "accessibility": [
      "SelectedItemRow 삭제 버튼: `aria-label`(기본 '삭제') 자동 부착 — removeLabel 로 항목명 포함 권장.",
      "헤더 액션은 native button — Tab/Enter/Space 자동.",
      "count 는 시각 강조용 — 스크린리더가 타이틀+개수를 순서대로 읽도록 같은 그룹에 배치."
    ],
    "examplesHtml": {
      "do": "<nds-selected-items-panel panel-title=\"선택한 항목\" count=\"2\">\n  <nds-selected-item-row>카테고리 &gt; 멤버 A</nds-selected-item-row>\n  <nds-selected-item-row>카테고리 &gt; 멤버 B</nds-selected-item-row>\n</nds-selected-items-panel>\n<script>\n  el.addEventListener(\"nds-selected-items-add\", openPicker);\n  el.addEventListener(\"nds-selected-items-clear\", clearAll);\n  el.addEventListener(\"nds-selected-item-remove\", e => e.target.remove());\n  el.addEventListener(\"nds-region-remove\", e => e.target.remove());\n</script>",
      "dont": "<!-- count 를 직접 헤더 텍스트에 박지 말 것 — count 속성이 브랜드색 강조를 담당 -->\n<nds-selected-items-panel panel-title=\"선택한 항목 2개\"></nds-selected-items-panel>"
    }
  },
  "SelectionButton": {
    "name": "SelectionButton",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3555-703",
    "summary": "단일 선택 버튼 한 개 (브랜드색 아웃라인 + selected 시 project-subtle 채움). 보통 `SelectionButtonGroup` 으로 묶지만, 토글 1개·커스텀 레이아웃이면 단독으로 쓴다. 그룹과 동일한 `nds-selection-button-group__item` 비주얼 SSOT 를 공유 — 5개 프로젝트 시멘틱 cascade 자동 대응.",
    "pitfalls": [
      "**2개 이상을 손으로 나열하면 `SelectionButtonGroup` 을 쓸 것** — Group 은 `value`/`options` 단일 진실, radiogroup 롤, 화살표 키 네비, 등폭 자동 정렬을 제공한다. SelectionButton 을 여러 개 직접 깔면 이 중 아무것도 안 붙고 `role=\"radio\"` 만 컨텍스트 없이 남는다.",
      "단독 SelectionButton 은 의미상 **토글 1개** — 상호배타 옵션 묶음이 아니다. 묶음이면 Group.",
      "선택은 외부 제어 — `selected` 로 상태를 받고 `onClick`(HTML 은 네이티브 click)으로 변경 처리. 컴포넌트 내부에 선택 상태가 없다.",
      "**선택색을 hex 로 박지 말 것** — selected 는 `--semantic-bg-brand-subtle` / `--semantic-border-brand-default` cascade 로 5개 프로젝트 자동 대응.",
      "필터/태그 토글과 혼동 금지 — 그건 [[Chip]](선택표시 = 프로젝트 채움). SelectionButton 은 폼 안 단일선택 옵션이다.",
      "그룹 안에서는 등폭(100%), 단독일 때는 콘텐츠 hug — width 를 손으로 박지 말 것."
    ],
    "recommended": [
      "폼 안 상호배타 옵션 2~3개 → `SelectionButtonGroup`(이 버튼이 그 item)",
      "단독 토글 1개·커스텀 그리드 배치 → SelectionButton 직접 사용",
      "라벨+설명+아이콘이 필요한 카드형 선택 → SelectionCard"
    ],
    "examplesHtml": {
      "do": "<!-- 단독 토글 1개 -->\n<nds-selection-button selected>알림 받기</nds-selection-button>\n<script>el.addEventListener(\"click\", () => toggle());</script>",
      "dont": "<!-- 상호배타 옵션을 SelectionButton 으로 손수 나열 — role/키보드/등폭 없음. Group 을 쓸 것 -->\n<nds-selection-button>항상</nds-selection-button>\n<nds-selection-button>특정 시간만</nds-selection-button>\n<nds-selection-button>특정 요일만</nds-selection-button>"
    }
  },
  "SelectionButtonGroup": {
    "name": "SelectionButtonGroup",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3555-703",
    "summary": "폼 내 상호 배타적 옵션의 단일 선택 (권장 2~3개). 브랜드색 아웃라인의 개별 버튼을 gap 으로 나열 — FormField ContentSlot 에 교체. 선택 시 project-subtle 배경 + project 보더 + 굵은 텍스트.",
    "pitfalls": [
      "Tab variant='segment' 와 혼동 — segment 는 연결된 회색 트랙(뷰/상태 전환), SelectionButtonGroup 은 폼 입력(개별 브랜드색 버튼). 폼 안 단일선택이면 이 컴포넌트.",
      "옵션 4개 이상 — 가로 폭 부족. Select 또는 SelectionCard 사용.",
      "라벨+설명+아이콘이 필요한 카드형 선택 — SelectionCard 가 적합.",
      "선택색을 hex 로 박지 말 것 — selected 는 --semantic-bg-brand-subtle / --semantic-border-brand-default 캐스케이드로 5개 프로젝트 자동 대응.",
      "**그룹 내 옵션은 등폭이 기본** — '전체'(좁음)/'특정 지역'(넓음)처럼 라벨 길이가 달라도 컴포넌트가 가장 넓은 옵션 기준으로 자동 균등하게 그린다(손으로 width 박지 말 것). 한 화면에서 같은 성격의 그룹은 너비를 통일. 컨테이너 100% 로 늘리려면 fullWidth/full-width.",
      "**'특정 X'(특정 지역/연령/카테고리) 선택 시 노출되는 '선택 결과'를 또 다른 SelectionButton·노란 outlined 칩으로 그리지 말 것** — 결과 컴포넌트는 따로다: ① 소수 고정 선택지(연령대 6~7개)는 **toggle Chip**(`<nds-chip selected>` — **선택표시 기본 = 프로젝트 채움(solid fill)**. ✓ 체크/좌측 도트는 옵션: React `icon` prop, HTML 은 `<nds-chip selected><svg slot='icon'>…</svg>30대</nds-chip>`. 채움 대신 project-subtle 등 부드러운 선택 톤을 원하면 hex 박지 말고 `--nds-chip-selected-background/text/border` override) 한 묶음, ② 동적 다중 선택(지역·카테고리처럼 picker 로 추가)은 **`SelectedItemsPanel` + `SelectedItemRow`**(회색 패널 안 추가 버튼 → 추가하면 SelectedItemRow 누적, 개별 제거 X). 특히 **선택한 항목을 노란 outlined 칩으로 인라인 나열 = 회귀(SelectionButton 과 시각적으로 동일해 혼동)** — get_guide({ topic:'component:SelectedItemsPanel' }) 의 SelectedItemRow 사용. 캐포비 타겟팅 폼 SSOT: Figma 3001:49174."
    ],
    "examplesHtml": {
      "do": "<nds-selection-button-group value=\"always\" options='[{\"value\":\"always\",\"label\":\"항상\"},{\"value\":\"time\",\"label\":\"특정 시간만\"},{\"value\":\"weekday\",\"label\":\"특정 요일/시간만\"}]'></nds-selection-button-group>\n<script>el.addEventListener(\"selection-button-change\", e => setSchedule(e.detail.value));</script>",
      "dont": "<!-- 뷰 전환에 SelectionButtonGroup — 폼 입력 컴포넌트라 위계가 어색. Tab variant=segment 사용 -->\n<nds-selection-button-group options='[{\"value\":\"list\",\"label\":\"목록\"},{\"value\":\"grid\",\"label\":\"그리드\"}]'></nds-selection-button-group>"
    }
  },
  "SelectionCard": {
    "name": "SelectionCard",
    "summary": "카드형 단일/다중 선택지 (RadioCard/CheckboxCard 통합). compound — Group + Item. title/description 외에 **리치 중첩 콘텐츠**(Chip 행·bullet 리스트)를 React `children` / HTML `slot=\"content\"` 로 카드 본문에 넣을 수 있음(캐포비 캠페인 목표 카드).",
    "pitfalls": [
      "**카드형 단일선택을 손수 만들지 말 것** — `nds-selection-card`(mode='single')는 좌측 라디오 인디케이터(미선택=회색 링 / 선택=프로젝트 채움 도트)를 **내장**한다(showIndicator 기본 true). 커스텀 `<div>` 카드 + 수동 라디오 동그라미 div 로 재발명하면 도트가 빠지거나 토큰·포커스·a11y(role=radiogroup)가 어긋난다(회귀: 캐포비 '소진 방식/목표/유형' 카드에서 라디오 UI 누락 — '기준이 뭐냐'). 소진방식·목표·유형 등 설명 있는 카드형 단일선택은 전부 nds-selection-card 로.",
      "라벨만 있는 단순 선택은 Radio/Checkbox를 쓸 것 — SelectionCard는 카드 단위(타이틀+설명+아이콘) 전제.",
      "mode='single'에서는 value/onValueChange, mode='multiple'에서는 values/onValuesChange. 헷갈리지 말 것.",
      "**카드 안에 Chip 행·bullet 같은 부가 내용**은 React `children`(Item 자식) / HTML `<div slot=\"content\">` 로 — description 에 줄바꿈으로 욱여넣지 말 것.",
      "옵션이 5개 이상이면서 라벨이 짧다면 Chip 토글 그룹이 더 컴팩트.",
      "horizontal 레이아웃은 옵션 3개 이하일 때만. 그 이상은 wrap돼서 어색해짐."
    ],
    "recommended": [
      "상담 방식 선택: <SelectionCard.Group mode='single'> <Item value='chat' title='채팅' description='...' />",
      "관심사 다중: mode='multiple', 카드마다 description으로 의미 보강",
      "플랜 선택: icon prop으로 좌측 일러스트, title/description으로 가격/혜택"
    ],
    "interactivePattern": "Group의 onValueChange/onValuesChange로만 상태 관리. Item에 onClick 부착 금지(라벨이 input을 토글).",
    "examplesHtml": {
      "do": "<nds-selection-card mode=\"single\" value=\"chat\">\n  <nds-selection-card-item value=\"chat\" item-title=\"채팅 상담\" description=\"텍스트로 편하게\"></nds-selection-card-item>\n  <nds-selection-card-item value=\"video\" item-title=\"영상 상담\" description=\"얼굴 보며 깊이 있게\"></nds-selection-card-item>\n</nds-selection-card>\n<!-- 리치 카드: title/description 아래에 Chip 행·bullet 리스트를 slot=\"content\" 로 -->\n<nds-selection-card mode=\"single\" value=\"project\">\n  <nds-selection-card-item value=\"project\" item-title=\"프로젝트 노출 확대\" description=\"최대한 많은 사용자에게 도달\">\n    <div slot=\"content\">\n      <div>사용 가능 광고 유형: <nds-chip>프리미엄형</nds-chip> <nds-chip>디스플레이형</nds-chip></div>\n      <ul><li>신규 프로젝트를 알리고 싶을 때</li></ul>\n    </div>\n  </nds-selection-card-item>\n</nds-selection-card>\n<script>el.addEventListener(\"nds-selection-change\", e => setMode(e.detail.value));</script>",
      "dont": "<!-- mode='multiple' 인데 value 속성 사용 — values (배열) 사용 -->\n<nds-selection-card mode=\"multiple\" value=\"chat\">…</nds-selection-card>"
    }
  },
  "Sidebar": {
    "name": "Sidebar",
    "figmaNodeUrl": "https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/%ED%95%9C%EA%B5%AD-%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC_WEB-Dev?node-id=168-1250",
    "summary": "어드민/CMS용 좌측 수직 내비게이션. 캐시워크 포 비즈니스(CashwalkBiz) Figma 168:1250 / 290:1593 기준으로 정합. flat items 배열 또는 SidebarSection[] (라벨 그룹) 둘 다 지원, 1단계 서브메뉴 + 뱃지 + collapsed(64px) 가능.",
    "pitfalls": [
      "**★ 어드민(b2b 하드게이트 프로젝트) = nds-sidebar 가 정답.** 사내 백오피스는 antd Layout.Sider 가 규칙이지만(get_guide({ topic:'backoffice' })), 어드민(외부 제공 b2b)은 캐포비(cashwalk-biz)·넛지EAP(nudge-eap)만 지원하며 antd 가 아니라 이 목업 전용 `<nds-sidebar>`(nds-project-chrome 흡수) 를 쓴다. (공개 react `Sidebar` 컴포넌트는 제거됨 — 화면 chrome 은 목업 html.) `intent='admin' + project` 면 라우터도 antd 가 아니라 html/DS 로 보낸다(캐포비는 CMS 발화도 우회). 캐포비는 자체 admin DS(sidebar 300px · admin 토큰) — `:root[data-project='cashwalk-biz']` cascade 로 project-subtle bg + 노란 indicator 가 자동 적용, 색 hex 박지 말 것.",
      "items prop 은 flat SidebarItem[] 또는 SidebarSection[] 둘 다 받지만, **섹션 라벨이 필요하면** SidebarSection[] 으로 넘길 것. flat 배열 안에 빈 객체로 'spacer' 만들지 말 것.",
      "활성 상태는 `activeKey` 로만 결정. 각 item 에 isActive 같은 boolean 을 박지 말 것 — controlled 패턴 깨짐.",
      "캐시워크 포 비즈니스 프로젝트는 `data-project='cashwalk-biz'` 가 :root 에 있을 때 자동으로 project-subtle bg + 노란 indicator 톤. 다른 프로젝트는 NudgeEAP 토큰 cascade.",
      "**★ HTML `<nds-sidebar>` 의 item `icon` = inline SVG 문자열 (이름 아님).** `icon` 은 innerHTML 로 주입되므로 `\"icon\":\"home\"` 이나 `\"icon\":\"CashwalkBizGnbBannerIcon\"` 처럼 **이름/컴포넌트명을 넣으면 그대로 텍스트로 렌더**된다(라벨 옆에 글자). 절차: `find_icon({ name })` → 반환 inline SVG 를 `icon` 에 주입. **HTML 목업이라 아이콘이 안 된다는 건 사실이 아니다**(런타임 한계 X — inline SVG 로 들어간다). `items` 가 JSON 속성이라 SVG 안 `\"` 는 `\\\"` 로 이스케이프.",
      "GNB 아이콘은 project-specific 우선 — 자세한 목록은 get_guide({ topic:'component:Sidebar', project:'<slug>' }).iconSet 또는 find_icon({ query:'CashwalkBizGnb' }) 참조. (이때 얻은 이름을 그대로 HTML icon 에 넣지 말고 find_icon 으로 SVG 를 받아 주입.)",
      "**★ items JSON 이스케이프 함정 — 사이드바가 로고만 뜨고 메뉴가 통째로 사라지는 #1 원인.** 단일따옴표 `items='...'` 안에서 JSON **구조용 따옴표까지** `\\\"` 로 이스케이프하면(`items='[{\\\"key\\\"...]'`) HTML 속성에서 백슬래시는 리터럴이라 JSON 파싱이 깨지고, 컴포넌트가 메뉴를 통째로 버린다(로고/헤더만 렌더). 구조용 따옴표는 **bare**, SVG 내부 따옴표만 `\\\"`. 헷갈리면 `<script type=\"application/json\" slot=\"items\">` 자식을 쓰면 이스케이프가 아예 필요 없다. 빌드 validator(`nds-json-attr-unparseable`)가 깨진 JSON 을 error 로 잡아 빌드를 막고, 컴포넌트도 조용히 비우지 않고 console.warn 한다.",
      "서브메뉴는 1단계까지만 허용 — children 안에 또 children 넣어서 트리화 금지 (트리는 별도 컴포넌트로).",
      "collapsed=true 일 때 라벨/뱃지/캐럿/유저 메타 모두 숨김 — 그래도 의미가 전달되도록 모든 item.label 은 string 으로 두기 (tooltip 자동 부착).",
      "footer 와 user 를 동시에 주면 footer 가 우선. user 는 'avatar + 이름 + 역할' 정형 패턴 단축이라 footer 가 있으면 무시.",
      "**★ 캐포비 계정 헤더 / 로그아웃은 구조화 slot — 손수 div 금지.** 로고 아래 계정 블록(이메일→잔액→충전/내역 CTA 쌍)은 `account` slot(`account='{…}'` 또는 `<script type=\"application/json\" slot=\"account\">`), 최하단 로그아웃은 `footer-actions` slot(`footer-actions='[…]'`). `account.actions` / `footer-actions` 의 `variant` 는 'solid'|'outlined'(기본 outlined)로 DS 버튼 토큰을 자동 적용 — hex/직접 버튼 마크업 금지. 이 slot 들을 모르고 `header` 에 raw HTML 로 조립하거나 통째로 빼먹는 게 캐포비 사이드바 재발 #1.",
      "**사이드바는 풀하이트 셸(.nds-shell) 안에 둔다.** `<nds-sidebar>` 는 기본 full-height(100vh sticky)지만, body 직속·height 미확정 컨테이너에 두면 높이가 화면을 못 채우거나 레이아웃이 깨진다. `<div class='nds-shell'>…<nds-sidebar/>…<main class='nds-shell__main'>` 형태로 감쌀 것 — get_guide({ topic: 'pattern:admin-shell' }) / ready-made 셸은 pattern:cashwalk-biz-admin-sidebar."
    ],
    "recommended": [
      "**캐포비 어드민이면 ready-made 픽업**: items 를 손으로 만들지 말고 `get_guide({ topic: 'pattern:cashwalk-biz-admin-sidebar' })` 의 복붙 HTML 트리(아이콘 inline 완료)를 쓰고 active-key 만 화면 키로. ProjectHeader/Footer 처럼 한 번에 끌어온다.",
      "섹션 그룹: items 를 SidebarSection[] 로 — `[{\"key\":\"content\",\"label\":\"콘텐츠 운영\",\"items\":[...]},{\"key\":\"system\",\"label\":\"시스템\",\"items\":[...]}]`.",
      "icon-only 사이드바: `collapsed` + `show-toggle` 페어. 토글 버튼은 헤더에 자동 노출(여닫기).",
      "뱃지: item.badge=12 (숫자/문자)."
    ],
    "accessibility": [
      "활성 아이템에 aria-current='page' 가 자동 부착됨 — 추가로 박지 말 것.",
      "각 item 의 label 이 string 이면 title 도 자동 — collapsed 상태에서 tooltip 역할."
    ],
    "interactivePattern": "활성 키 관리는 호스트 라우터에서 결정 (`active-key` = 현재 경로). `item-click` 커스텀 이벤트(`e.detail.item`)가 navigation 트리거용. 여닫기는 `collapsed` 속성 토글(헤더의 toggle 버튼이 `toggle-collapse` 이벤트 발행).",
    "examplesHtml": {
      "do": "<!-- 권장: items 를 자식 <script type=\"application/json\" slot=\"items\"> 로 넣는다 — 속성이 아니라 텍스트라 따옴표 이스케이프 함정이 아예 없고 단일파일 빌드에도 안전 -->\n<nds-sidebar active-key=\"home\" width=\"240\" title=\"NudgeEAP\">\n  <script type=\"application/json\" slot=\"items\">\n  [{\"key\":\"home\",\"label\":\"홈\",\"icon\":\"<svg ...>...</svg>\"},{\"key\":\"chat\",\"label\":\"상담\",\"icon\":\"<svg ...>...</svg>\"}]\n  </script>\n</nds-sidebar>\n<!-- 속성 형태도 가능: items='[{\"key\":\"home\",...}]' — 단, 구조용 따옴표는 bare 로 두고 SVG 내부 따옴표만 \\\" 로 이스케이프(구조 따옴표를 \\\" 로 만들면 파싱 실패→메뉴 통째 유실). icon = find_icon({name}) inline SVG 그대로(이름 넣으면 텍스트로 흘러나옴) -->\n<script>el.addEventListener(\"item-click\", e => navigate(e.detail.key));</script>",
      "dont": "<!-- 사내 백오피스(=antd 영역)에서 nds-sidebar 사용 — 백오피스는 antd Layout.Sider. -->\n<!-- ★ 단, 어드민 하드게이트 프로젝트(캐포비/넛지EAP)는 정반대 — nds-sidebar 가 정답이다. 아래 pitfalls 참고 -->\n<nds-sidebar items='...'></nds-sidebar>"
    }
  },
  "Skeleton": {
    "name": "Skeleton",
    "summary": "데이터 로드 중 placeholder. 실제 콘텐츠의 box 모델을 그대로 흉내 — 스피너보다 인지된 속도가 빠름.",
    "pitfalls": [
      "긴 작업(>3초) 에 Skeleton 만 — 진척 표시 없으면 사용자가 멈췄다고 인식. ProgressBar / 안내문 병행.",
      "Skeleton 의 width/height 가 실제 콘텐츠와 크게 다르면 로드 후 layout shift — CLS 악화.",
      "variant='text' 를 짧은 카드/카운트 자리에 사용 — 시각적 비율이 어색. rect 권장."
    ],
    "examplesHtml": {
      "do": "<nds-skeleton variant=\"text\" width=\"60%\"></nds-skeleton>\n<nds-skeleton variant=\"rect\" width=\"100%\" height=\"200\"></nds-skeleton>",
      "dont": "<!-- 실제 콘텐츠보다 한참 작은 사이즈 — 로드 후 layout shift -->\n<nds-skeleton variant=\"rect\" width=\"40\" height=\"20\"></nds-skeleton> <!-- 실제로는 폭 100% -->"
    }
  },
  "Slider": {
    "name": "Slider",
    "summary": "연속값 입력 (통증·스트레스 강도 등). LikertScale은 고정 N단계, Slider는 연속.",
    "pitfalls": [
      "5단계 같은 이산형 평가는 LikertScale을 쓸 것. Slider step=1 max=4로 흉내내지 말 것 — 시각적 의미가 다름.",
      "showValue=false인데 startLabel/endLabel만 있으면 사용자가 현재 값을 알 수 없음. 한쪽은 무조건 표시.",
      "max-min 범위가 너무 크면 한 칸 차이가 시각적으로 안 보임. step을 sensible 단위(5/10)로."
    ],
    "recommended": [
      "통증 강도: min=0 max=10 step=1 startLabel=\"없음\" endLabel=\"극심\" showValue",
      "스트레스 %: min=0 max=100 step=5 showValue formatValue={(v) => `${v}%`}"
    ],
    "examplesHtml": {
      "do": "<nds-slider value=\"3\" min=\"0\" max=\"10\" start-label=\"약함\" end-label=\"강함\" show-value></nds-slider>\n<script>el.addEventListener(\"slider-change\", e => setLevel(e.detail.value));</script>",
      "dont": "<!-- 표시할 단계가 적은데 슬라이더 사용 — segmented 가 맞음 -->\n<nds-slider value=\"2\" min=\"1\" max=\"3\"></nds-slider>"
    }
  },
  "Snackbar": {
    "name": "Snackbar",
    "references": [
      {
        "label": "CashwalkBiz Admin Snackbar Guide (구 ToastGuide)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3858-1005",
        "caption": "Cashwalk for Business · 흰 카드 알림. state success/error/warning · 우측 상단 고정 · auto-dismiss 3–5s(Error 5s) · 단일 노출(교체) · status 칩 아이콘 + 메시지 + 닫기 X. (Figma 상 'Toast' 였으나 액션/닫기/카드 chrome 이라 DS 에선 Snackbar 로 구현.)",
        "project": "cashwalk-biz"
      }
    ],
    "matrixOverrides": {
      "cashwalk-biz": {
        "dimensions": {
          "states": "success / error / warning 3종. Success = check 칩(그린) · Error = error 칩(레드) · Warning = caution 칩(옐로). status 칩 아이콘 24×24 가 좌측. default/info 도 컴포넌트는 지원하나 캐포비 admin 은 주로 success/error/warning 사용.",
          "anatomy": "① Status 칩 아이콘 24×24 (둥근 사각형 칩 + 흰 글리프, 색만 state 별) ② Message — Bold 16 / line-height 24, 한 줄 권장 ③ Close Icon(회색, 클릭 시 즉시 닫힘). 좌→우: 아이콘 · 메시지 · 닫기. **DS Snackbar(`<nds-snackbar-host project=\"cashwalk-biz\">` / `Snackbar.Provider project=\"cashwalk-biz\"`)가 칩 아이콘 + 흰 카드 chrome 을 직접 렌더** — 더 이상 호스트 커스텀 렌더 불필요.",
          "container": "BG/Surface/Default(흰 배경) · border subtle · radius 8 · padding 16 · shadow E1(0 2 6 / .12). data-project='cashwalk-biz' cascade 가 variant 틴트 배경을 흰 카드로 덮는다(아이콘 색은 유지).",
          "position": "viewport 기준 position:fixed · 우측 상단 고정. **`position='top-right'`**(우측 정렬 viewport)로 지원. base 의 top/bottom(가로 중앙)과 다름.",
          "behavior": "자동 dismiss 3–5초(Error 만 5s, duration 으로 지정) · 동시 노출 1개 — 새 알림이 기존을 교체. **단일 교체는 maxCount=1(Snackbar.Provider) / max-count='1'(nds-snackbar-host)**. base 기본 maxCount=3(multi-stack)과 다름.",
          "message": "한 문장 · 30자 이내 · 결과 중심('저장 완료' · '전송 실패'). Error 는 원인 + 다음 행동을 한 문장으로('네트워크 오류로 중단되었습니다. 다시 시도해 주세요') + action='다시 시도'. 두 줄 이상 긴 본문은 Alert/Modal.",
          "usage": "Use = 저장·전송·삭제 등 액션 결과 알림 / 되돌리기·재시도 액션 / 닫기 가능. Don't = 결정·확인 요구(→Modal) / 긴·다단 정보(→Alert·Modal) / 여러 알림 누적(최대 1개) / 임의 위치 / state 의미 오용(성공에 warning).",
          "activationCondition": "`<html data-project=\"cashwalk-biz\">` 환경 admin 화면 기준. Provider(`project=\"cashwalk-biz\"`)가 칩 아이콘을, data-project cascade 가 흰 카드 외형을 적용."
        }
      }
    },
    "summary": "**액션/닫기가 있는 카드형 알림**. 시맨틱 variant(info/success/warning/error) · 액션(되돌리기/다시시도) · 닫기 버튼 지원. 두 가지 모드: ① **인라인**(`<Snackbar>` / `<nds-snackbar>`) — 부모가 mount/unmount 로 표시 통제(자체 visibility 없음). ② **Provider**(`Snackbar.Provider` + `useSnackbar()` / `<nds-snackbar-host>`) — 포지셔닝·자동닫힘·단일교체·스택을 DS 가 관리(캐포비 admin 흰 카드 알림의 SSOT). Toast(인터랙션 없는 일시 메시지·자동 사라짐 전용)와 분리 — 액션·닫기가 있는 알림은 자동으로 사라지면 안 되므로 Snackbar 가 담당. project 별 spec 변형은 get_guide({ topic:'component:Snackbar', project:'<slug>' }).dimensions 참조.",
    "pitfalls": [
      "인터랙션 없는 단순 일시 메시지(저장됨/복사됨)는 Toast 가 더 적합 — 액션·닫기가 없으면 Snackbar 를 길게 띄우지 말 것.",
      "액션이 두 개 이상 필요하면 Snackbar 대신 Modal/Popup을 검토.",
      "title 없이 description만 사용하지 말 것 — 시맨틱 의미가 무너짐.",
      "인라인 `<Snackbar>` 는 자동으로 사라지지 않음(부모가 통제). 자동닫힘·우측상단·단일교체가 필요하면 `Snackbar.Provider`/`<nds-snackbar-host>` 사용.",
      "**런마일(Toast 가이드 5085:234)**: **다크 토스트** — bg=Surface/Strong(#221E1F α0.85)·radius 12·Elevation/2·메시지 흰색(Text/OnBrand) Body1 **Medium**(500) 13·아이콘 24. variant 는 카드색이 아니라 **아이콘 색만** 차이(Default=흰·Success=초록 #00C255·Error=빨강 #FF2428·**Info=파랑 #007AFF**). 액션 버튼=투명+**Text/Brand 오렌지**(text 버튼). 하단 중앙(Bottom Navi 위 safe area)·자동 사라짐 2~4초·1줄 8~20자. 프로젝트 토큰 `components.snackbar` 가 `--nds-snackbar-bg`(전 variant 다크 통일)·`-info-icon`·`-action-color`·`-title-font-weight` 슬롯으로 흘려보냄(컴포넌트는 프로젝트 무관, 타 프로젝트는 fallback 유지)."
    ],
    "recommended": [
      "되돌리기: <Snackbar title='삭제됐어요' actionLabel='되돌리기' onAction={undo} />",
      "에러 + 재시도: variant='error' actionLabel='다시 시도'",
      "자동 사라짐 + 우측상단: <Snackbar.Provider position='top-right' maxCount={1}>…useSnackbar().snackbar('저장 완료',{variant:'success'})",
      "캐포비 흰 카드: <Snackbar.Provider project='cashwalk-biz' position='top-right' maxCount={1} duration={5000}>"
    ],
    "interactivePattern": "두 모드 — 인라인 Snackbar 는 부모가 mount/unmount 로 통제, Provider(useSnackbar) 는 호출형으로 viewport·타이머·단일교체를 DS 가 관리.",
    "examplesHtml": {
      "do": "<nds-snackbar variant=\"success\" snackbar-title=\"저장 완료\"\n  action-label=\"되돌리기\" closable></nds-snackbar>\n<script>bar.addEventListener(\"nds-snackbar-action\", undo);</script>\n<!-- 자동 사라짐·우측 상단·단일 교체가 필요하면 host 매니저: -->\n<nds-snackbar-host position=\"top-right\" max-count=\"1\" project=\"cashwalk-biz\"></nds-snackbar-host>",
      "dont": "<!-- 단순 확인 없는 일시 메시지에 위계 강한 Modal 사용 — 흐름을 끊음 -->\n<nds-modal open title=\"저장 완료\"></nds-modal>"
    }
  },
  "Sparkline": {
    "name": "Sparkline",
    "summary": "미니 추이 차트 (line/area/bar). 축/레이블 없음 — 카드 안 시각 신호용.",
    "pitfalls": [
      "정확한 비교가 필요한 본격 차트가 아님. 50개 이상 데이터 포인트는 가독성 저하.",
      "음수가 섞인 데이터에는 showBaseline=true로 0 기준선을 노출.",
      "color는 단색만. 그라데이션은 area variant에서 자동(투명도) — 직접 그라데이션 색을 넘기지 말 것."
    ],
    "recommended": [
      "메트릭 카드: '7.4시간' + Sparkline kind='area' color=success",
      "리스트: kind='line' + showLastDot으로 마지막 값 강조",
      "막대: 일별 카운트 같은 이산형 데이터"
    ],
    "examplesHtml": {
      "do": "<nds-sparkline kind=\"line\" color=\"primary\" data=\"[12,15,11,18,22,20,25]\" width=\"200\" height=\"60\"></nds-sparkline>",
      "dont": "<!-- 한 점만 -> 라인이 그려지지 않음. 의미 없는 단일값엔 stat-card 사용 -->\n<nds-sparkline data=\"[42]\"></nds-sparkline>"
    }
  },
  "Spinner": {
    "name": "Spinner",
    "summary": "인라인 회전 로더. 짧은 fetch (<2s)에 사용. 긴 로딩은 Skeleton.",
    "pitfalls": [
      "전체 페이지 로딩에 Spinner를 가운데 띄우지 말 것 — 빈 화면 인상이 강함. Skeleton(레이아웃 유지)이 UX 더 좋음.",
      "버튼 내부에 넣을 때는 size=\"sm\", color={cv.primary.fg} 등 컨텍스트 색에 맞춰 oversiede.",
      "label prop은 스크린리더용 (\"로딩 중\"이 기본). 무음 처리 금지."
    ],
    "recommended": [
      "<Button disabled><Spinner size=\"sm\" color=\"currentColor\" /> 처리 중...</Button>",
      "리스트 끝 무한스크롤: <Spinner size=\"md\" />"
    ],
    "examplesHtml": {
      "do": "<nds-button disabled>\n  <nds-spinner size=\"sm\" label=\"처리 중\"></nds-spinner> 처리 중…\n</nds-button>\n<nds-spinner size=\"md\" aria-label=\"목록 불러오는 중\"></nds-spinner>",
      "dont": "<!-- label/aria-label 둘 다 없는 단독 스피너 — 스크린리더에 안내가 없음 -->\n<nds-spinner size=\"md\"></nds-spinner>"
    }
  },
  "StarRating": {
    "name": "StarRating",
    "summary": "1-5 / 1-10 별 점수. 후기 입력 + 후기 표시 양쪽에 사용. **입력(클릭해서 별점 선택)은 html `interactive` 속성 / React `onValueChange` 핸들러로 켠다.** 안 켜면 표시 전용(별이 클릭되지 않음).",
    "pitfalls": [
      "**입력 모드를 깜빡하면 별이 안 눌린다 (자주 하는 실수).** html 은 `<nds-star-rating interactive>` 속성을, React 는 `onValueChange` prop 을 줘야 클릭 가능. 둘 다 없으면 표시 전용(`role=\"img\"`)이라 리뷰 작성 폼에서 \"별점이 동작 안 함\"으로 보인다. ❌ nds-icon-button 으로 별을 직접 만들지 말 것 — `interactive` 면 된다.",
      "0.5 단위 반쪽 별 표시는 `precision=\"half\"` 로 켠다. 기본 `precision=\"full\"` 은 정수 반올림이라 4.5 가 5개로 보인다. 인터랙티브(입력) 모드는 항상 정수.",
      "readonly 와 disabled 혼동 — disabled 는 폼 비활성, readonly 는 보기 전용 (clickable 아님).",
      "max 가 5 인데 value 6 — 표시가 깨짐.",
      "HTML size 는 React 와 동일하게 px 숫자를 우선 사용. \"md\"/\"lg\" alias 는 허용되지만 목업 가이드 예제에서는 숫자 px 로 지시."
    ],
    "examplesHtml": {
      "do": "<!-- 입력(리뷰 작성): interactive 로 클릭 가능, 이벤트로 값 수신 -->\n<nds-star-rating value=\"0\" size=\"32\" max=\"5\" interactive></nds-star-rating>\n<script>el.addEventListener(\"star-rating-change\", e => setRating(e.detail.value));</script>\n\n<!-- 표시 전용(후기 노출): readonly + precision=half -->\n<nds-star-rating value=\"4.5\" size=\"16\" max=\"5\" precision=\"half\" readonly></nds-star-rating>",
      "dont": "<!-- value 가 max 초과 -->\n<nds-star-rating value=\"6\" max=\"5\"></nds-star-rating>"
    }
  },
  "StatsTable": {
    "name": "StatsTable",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-30014",
    "summary": "캐포비 어드민 통계/집계 리포트 표 — 회색 헤더 + 가는 그리드 + 병합셀(rowspan/colspan) + 합계행(굵게). 2단 **그룹 슈퍼헤더**(예: \"남성\"이 10대~60대 하위열을 colspan 으로 묶음)와 **가로 스크롤 + 좌측열 고정** 지원. native <table class=\"nds-stats-table\"> 구조형 컴포넌트. 동적 정렬·모바일 카드뷰는 DataTable 사용. Figma 퀴즈 통계(3001:47404)·인구통계별 리포트(3001:30014).",
    "pitfalls": [
      "**병합셀은 native rowspan/colspan** — 합계행(`총합`)은 라벨이 앞 2열을 `colspan=\"2\"` 로 병합, 그룹행(`알 수 없음`/`NN대`)은 첫 열을 `rowspan=\"2\"` 로 병합(남/여 2행). DataTable 의 columns/data 로는 표현 불가.",
      "**그룹 슈퍼헤더(2단 헤더)** — `<thead>` 에 2개의 `<tr>`: 첫 행은 `<th rowspan=\"2\">날짜</th><th colspan=\"6\" data-align=\"center\">남성</th><th colspan=\"6\" data-align=\"center\">여성</th>`, 둘째 행은 하위열(10대~60대) 나열. 슈퍼헤더는 `data-align=\"center\"`.",
      "**합계/요약 행 = `<tr class=\"is-summary\">`** (또는 `data-summary`). 전체 셀 Bold + 강조색이 자동 적용 — 인라인 font-weight 금지.",
      "**열이 많아 가로로 넘치면** 표를 `<div class=\"nds-stats-table__scroll\">` 로 감싼다(레이아웃 안 깨지고 표만 스크롤). React 는 `<StatsTable scroll>`.",
      "**좌측 라벨 열 고정** — `nds-stats-table--sticky-first` 클래스(React `stickyFirst`)로 첫 열을 스크롤 중 freeze. `scroll` 과 함께 사용.",
      "셀 정렬은 `data-align=\"right\"|\"center\"`. 기본 좌측(Figma 정합). 숫자는 자동 tabular-nums.",
      "헤더/그리드 색은 토큰 자동(헤더 bg=surface.page, 보더=border subtle). raw hex 금지.",
      "표는 plot/범례처럼 카드 외부 컨테이너(흰 라운드 박스 + 타이틀) 안에 배치 — nds-stats-table 은 표만 그림.",
      "**열 헤더 설명 툴팁(ⓘ)** — CTR/CPC/CPM 처럼 헤더에 설명이 필요하면 `<th>` 안에 component:Tooltip(nds-tooltip) 을 합성(`<th>CTR <nds-tooltip text=\"클릭률\">ⓘ</nds-tooltip></th>`).",
      "페이지가 나뉘는 긴 표는 표 아래에 component:Pagination(nds-pagination) + 행수 선택 component:PageSizeSelect 을 둘 것."
    ],
    "recommended": [
      "집계/합계가 있는 리포트 표(통계 화면) = nds-stats-table + <tr class=\"is-summary\">",
      "와이드 인구통계 리포트(슈퍼헤더 + 가로 스크롤) = <div class=\"nds-stats-table__scroll\"><table class=\"nds-stats-table nds-stats-table--sticky-first\">",
      "정렬·필터·페이지 인터랙션이 필요한 데이터 그리드 = DataTable",
      "React: <StatsTable scroll stickyFirst><thead/>…<tr className=\"is-summary\"><td colSpan={2}>총합</td>…</StatsTable>"
    ],
    "examplesHtml": {
      "do": "<!-- 통계/집계 리포트 표 — 병합셀(rowspan/colspan) + 합계행. native table 에 class -->\n<table class=\"nds-stats-table\">\n  <thead>\n    <tr><th>연령</th><th>성별</th><th>당첨자 수</th><th>지급된 캐시</th></tr>\n  </thead>\n  <tbody>\n    <tr class=\"is-summary\"><td colspan=\"2\">총합</td><td>999,999</td><td>999,999</td></tr>\n    <tr><td rowspan=\"2\">알 수 없음</td><td>남성</td><td>99</td><td>999</td></tr>\n    <tr><td>여성</td><td>99</td><td>999</td></tr>\n    <tr class=\"is-summary\"><td colspan=\"2\">알 수 없음 총합</td><td>999</td><td>99,999</td></tr>\n  </tbody>\n</table>\n<!-- 표 아래 페이지네이션은 component:Pagination (nds-pagination) -->",
      "dont": "<!-- 합계행/병합셀 리포트 표를 nds-data-table(columns/data API)로 억지로 만들지 말 것 — rowspan·합계행 표현 불가 -->\n<nds-data-table columns='...' data='...'></nds-data-table>\n<!-- 합계행을 굵게 하려고 인라인 style 로 font-weight 박지 말 것. <tr class=\"is-summary\"> 사용 -->\n<tr style=\"font-weight:bold\"><td>총합</td>...</tr>"
    }
  },
  "Stepper": {
    "name": "Stepper",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20029",
    "summary": "**다단계 작업의 현재 진척 *표시*** (지금 몇 단계인지 보여주는 막대/원, 입력 컨트롤 아님). variant=numbered|dots(원형 인디케이터 — 가입/결제/온보딩) + variant=bar(가로 막대 + 스텝번호/제목 2단 라벨 — 캐시워크 for Business 어드민 다단계 흐름, 구 StepProgress 흡수). 상태(completed/current/upcoming)는 current 인덱스로 자동 계산 — per-step status 는 받지 않음. (시간순 이벤트 로그=Timeline, 폼 콘텐츠+단계 네비를 묶는 컨테이너는 DS 컴포넌트가 아니라 조립 패턴=pattern:multi-step-form.)",
    "pitfalls": [
      "status 는 prop 이 아님 — steps 에 {key,label,title?} 만 주고 상태는 current(0-based)로 결정. 'status' 를 박으면 무시됨.",
      "variant 는 numbered|dots|bar 뿐 — 'horizontal'/'vertical' 같은 값은 없음(Stepper 는 항상 가로). 세로 방향 트래커가 필요하면 Timeline(direction='vertical').",
      "title 은 variant=bar 의 두 번째 라벨 줄(예: '캠페인 만들기'). numbered/dots 에서는 무시됨 — 원형 단계명은 label 사용.",
      "막대(bar) 색을 직접 지정 — completed/current 는 브랜드색, upcoming 은 border-normal 로 토큰 자동 결정. hex 박지 말 것.",
      "현재 단계가 마지막인데 current 를 그대로 두면 completed 신호가 안 뜸 — 전부 완료는 current=steps.length."
    ],
    "examplesHtml": {
      "do": "<!-- 원형 단계 -->\n<nds-stepper current=\"1\" variant=\"numbered\" steps='[{\"key\":\"info\",\"label\":\"기본 정보\"},{\"key\":\"pay\",\"label\":\"결제\"},{\"key\":\"confirm\",\"label\":\"확인\"}]'></nds-stepper>\n<!-- 어드민 가로 막대(구 StepProgress) -->\n<nds-stepper current=\"1\" variant=\"bar\" steps='[{\"key\":\"c\",\"label\":\"Step 1\",\"title\":\"캠페인 만들기\"},{\"key\":\"a\",\"label\":\"Step 2\",\"title\":\"광고 만들기\"},{\"key\":\"m\",\"label\":\"Step 3\",\"title\":\"소재 만들기\"}]'></nds-stepper>",
      "dont": "<!-- variant=\"horizontal\" + per-step status 는 존재하지 않는 prop — 무시됨. 막대 색 직접 지정 금지 -->\n<nds-stepper variant=\"horizontal\" steps='[{\"label\":\"기본 정보\",\"status\":\"completed\"}]'></nds-stepper>"
    }
  },
  "SummaryCard": {
    "name": "SummaryCard",
    "summary": "**범용 요약 카드** (도메인 무관) — 라벨:값 행 + 강조 합계 + CTA 슬롯. 결제뿐 아니라 예약 확인·신청서 검토·구독 요약 등 \"키-값 원장 + 합계\" 패턴 전반에 쓰입니다(이름이 Order 로 시작하지만 커머스 전용 아님 — 추후 SummaryCard 별칭 후보). emphasis로 할인/안내 강조.",
    "pitfalls": [
      "할인은 emphasis='discount' (빨간색). 음수 금액에 직접 색칠하지 말 것.",
      "rows 너무 많으면(8+) 한 화면 정보 과다 — 핵심만 추려서.",
      "total은 ReactNode — PriceTag 또는 문자열 자유."
    ],
    "recommended": [
      "결제: 상품 금액/쿠폰/포인트/배송비 + 합계",
      "EAP 무료 상담: 회사 부담 emphasis='info'"
    ],
    "examplesHtml": {
      "do": "<nds-summary-card title=\"결제 요약\"\n  rows='[{\"label\":\"상품 가격\",\"value\":\"50,000원\"},{\"label\":\"할인\",\"value\":\"-5,000원\"}]'\n  total-label=\"합계\" total=\"45,000원\"></nds-summary-card>",
      "dont": "<!-- rows 를 string 으로 — 줄이 렌더되지 않음. 반드시 JSON 배열 -->\n<nds-summary-card rows=\"상품 50000\"></nds-summary-card>"
    }
  },
  "Tab": {
    "name": "Tab",
    "references": [
      {
        "label": "Tab vs Filter — 역할·배치·결정 트리 (DesignGuide)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3544-206",
        "caption": "Tab(Underline/Box)으로 view 전환 · Filter(FilterBar)로 현재 view 좁히기. 결정 트리·배치 순서·DO/Don't 요약은 pitfalls, 캐포비 admin 풀 스펙은 pattern:cashwalk-biz-tab.",
        "project": "cashwalk-biz"
      },
      {
        "label": "Trost Tabs — Line/Chip/Segment 가이드 (TrostLibrary)",
        "url": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5301-108",
        "caption": "트로스트 탭 가이드. tone=\"color\" 활성 강조색은 Point 코발트(#4968FF) — project=노랑은 면적 채움 전용이라 탭 강조는 Point 로 분리. Line=mobile50/pc56, Chip=mobile36/pc44, Segment=PC.",
        "project": "trost"
      },
      {
        "label": "런마일 Tabs — Underline/Chip · active=검정 (RunmileLibrary)",
        "url": "https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/?node-id=5111-138",
        "caption": "런마일 탭 가이드. active = 검정(#221E1F · text/strong), 포인트색(주황) 아님. Underline(line) active = 검정 텍스트 + 2px 검정 인디케이터, Chip(tone=neutral) active = 검정 채움(--nds-tab-chip-selected-bg=text/strong) + 흰 텍스트. inactive = subtle. 2~4 메뉴 권장.",
        "project": "runmile"
      }
    ],
    "usagePolicy": {
      "useFor": [
        "동일 depth 콘텐츠 전환 (예: 내 상담 / 받은 추천)",
        "category navigation (예: 전체 / 진행중 / 완료)",
        "section switching (한 페이지 내 영역 전환)"
      ],
      "doNotUseFor": [
        "CTA 대체 (저장/신청/다음 단계)",
        "필터 컨트롤 (FilterBar 사용)",
        "페이지 단위 라우팅 (좌측 메뉴 · Breadcrumb 사용)",
        "세그먼트형 단일 값 선택 (Tab variant='segment' 사용)"
      ],
      "variantPolicy": {
        "line": "기본 — 모바일/PC 공통, 콘텐츠 전환. 활성 탭 하단 인디케이터. tone=neutral(진한 텍스트)/color(프로젝트).",
        "chip": "강조형 — 알약(Pill) 필터 탭, 모바일/PC 카테고리 분류. tone=neutral(활성 다크 채움)/color(활성 프로젝트 채움).",
        "segment": "연결된 회색 트랙 위 균등 분할 단일 값 토글(구 SegmentedControl 흡수) — 뷰/기간/상태. 콘텐츠 패널 전환 아님. tone=color 면 활성이 프로젝트 채움."
      }
    },
    "summary": "line/chip/segment 3가지 variant + tone(neutral|color) + size(mobile|pc). items + activeKey + onTabChange. line/chip = 동일 depth 콘텐츠 전환 · category navigation · section switching(tablist) 전용. segment = 뷰/기간/상태 단일 값 토글(구 SegmentedControl 흡수, 콘텐츠 패널 전환 아님). CTA·필터·페이지 단위 라우팅 대체용으로 사용 금지. **Tab = view 자체 전환(상호 배타·한 번에 한 view·URL 경로 변경) vs Filter(FilterBar) = 현재 view 안에서 조건 좁히기(다중 누적·쿼리 파라미터)** — 역할이 다르다(아래 결정 트리). Underline=line, Box=chip 으로 매핑되며 캐포비 admin 풀 스펙은 `pattern:cashwalk-biz-tab`.",
    "pitfalls": [
      "items 형식은 {key, title}[]. label 같은 다른 키 이름 사용 시 렌더 실패.",
      "변경 핸들러는 onTabChange (onChange 아님).",
      "Tab 을 CTA처럼 사용 금지 — '저장/신청/다음 단계' 등 액션은 Button 사용. Tab 은 보기 전환만.",
      "같은 리스트의 '필터' 는 FilterBar, Tab 은 '뷰/카테고리/섹션 전환' — 둘을 섞어 쓰지 말 것.",
      "세그먼트 모양의 단일 값 선택(뷰/기간/상태 토글)은 Tab variant='segment' (mobile/pc). line/chip 은 패널 전환(tablist) 전용.",
      "Tab 라벨에 Badge/Count 를 과하게 붙이면 위계가 무너짐 — 필요 시 count 만, Badge 는 카드 본문에서.",
      "캐포비(cashwalk-biz)는 chip 치수만 프로젝트 토큰으로 override(radius 10·height 52·padding 20). 비활성 chip 컬러는 NudgeEAP 와 동일(subtle bg + subtle text, hover 시 surface.section + strong) — 흰 텍스트 저대비로 만들지 말 것.",
      "**런마일(runmile) active = 검정(#221E1F) — 포인트색(주황) 아님 (Figma RunmileLibrary 5111:138)**: Underline(line) active 텍스트·인디케이터는 `cv.textRole.strong`(검정)으로 이미 정합. Chip(tone=\"neutral\") active 채움은 기본 `fill.neutral`(#333D4B)이 아니라 `--nds-tab-chip-selected-bg`=text/strong(#221E1F)로 내려 검정으로 맞춘다. 활성 탭에 project 주황을 쓰면 회귀. inactive=subtle. (런마일 chip 은 tone=\"color\" 가 아니라 기본 neutral 을 쓴다.)",
      "**트로스트(trost) tone=\"color\" 강조색 = Point 코발트(#4968FF) — project 색 아님**: 트로스트 project 는 노랑이라 면적 채움 전용(텍스트·인디케이터로 쓰면 가독성↓)이다. 그래서 탭 활성 강조색만 `--nds-tab-accent-*` 슬롯을 거쳐 Point 코발트로 분리된다. Line=neutral(다크 #333/#1A1A1A 텍스트·인디케이터)/color(코발트 텍스트·인디케이터), Chip=neutral(다크 채움)/color(코발트 채움, 채움 위 텍스트는 흰색), Segment(PC)도 color 면 코발트 채움. **다른 프로젝트는 project 색으로 폴백**(슬롯 미설정 → `cv.surface.brand`/`cv.textRole.brand`)이라 무변. 트로스트 `<Tab tone=\"color\">` 가 노랑/오렌지로 보이면 회귀(구 버그).",
      "**Underline(line) vs Box(chip) 용도 구분 (Figma DesignGuide/Tab 3544-206)**: Underline=페이지 메인 카테고리·목록 필터·단계 전환, Box=상태/좁은 영역 필터(진행중·진행예정·종료). **한 화면에 Tab 종류는 1개로 통일 — Underline 과 Box 를 같은 화면에서 혼용하지 말 것.** Tab 항목 수는 2–5개 권장(6개+는 메뉴/Select 검토).",
      "**Tab vs Filter 결정 트리 (혼동 금지)**: Q1. view 자체가 바뀌나(목록 전체 교체)? → YES = **Tab**(URL 경로 변경). Q2. 조건을 누적해 좁히나(다중 필터)? → YES = **Filter(FilterBar)**(쿼리 파라미터 누적). Q3. 옵션 2–7개 단일 선택? → YES = **Radio / SelectionButtonGroup**. 큰 분류(상호 배타)를 Filter 로, 조건 좁히기를 Tab 으로 만들지 말 것.",
      "**화면 배치 순서**: 페이지 타이틀 → **Tab** → **FilterBar** → 데이터 영역(위→아래). Tab 으로 큰 분류를 고른 뒤 Filter 로 좁히는 흐름. Tab 안에 또 Tab 중첩 금지(Sub-section 은 Accordion/Anchor). 캐포비 admin 풀 스펙·치수는 `pattern:cashwalk-biz-tab`."
    ],
    "examplesHtml": {
      "do": "<nds-tab active-key=\"home\" variant=\"line\" size=\"mobile\">\n  <nds-tab-list>\n    <nds-tab-trigger key=\"home\">홈</nds-tab-trigger>\n    <nds-tab-trigger key=\"profile\">프로필</nds-tab-trigger>\n  </nds-tab-list>\n  <nds-tab-panel key=\"home\">홈 콘텐츠</nds-tab-panel>\n  <nds-tab-panel key=\"profile\">프로필 콘텐츠</nds-tab-panel>\n</nds-tab>\n<script>tabs.addEventListener(\"tabs-change\", e => console.log(e.detail.activeKey));</script>",
      "dont": "<!-- panel 의 key 가 trigger 의 key 와 불일치 — 빈 화면이 노출됨 -->\n<nds-tab active-key=\"home\">\n  <nds-tab-list><nds-tab-trigger key=\"home\">홈</nds-tab-trigger></nds-tab-list>\n  <nds-tab-panel key=\"HOME\">홈 콘텐츠</nds-tab-panel>\n</nds-tab>"
    }
  },
  "TagInput": {
    "name": "TagInput",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-18463",
    "summary": "토큰(태그) 자유 입력 + 삭제 가능한 칩. **기본 variant=\"stacked\"** — 입력칸 + 우측 추가 버튼(입력 있을 때만 활성)에 칩은 **아래** wrap (이메일 초대/수신자 패턴). **variant=\"inline\"** 은 칩이 입력칸 안쪽 tokenfield(해시태그식). Enter/쉼표/추가버튼으로 추가, Backspace로 마지막 삭제. 이메일 등은 `pattern`(정규식) 으로 검증 — 실패 시 추가 안 되고 `nds-tag-invalid` 이벤트.",
    "pitfalls": [
      "이메일/수신자 초대 = 기본 stacked + `pattern` 으로 형식 검증 + `max-tags`. 검증 없으면 잘못된 값이 칩으로 박힘.",
      "해시태그는 `variant=\"inline\" prefix=\"#\"` — value/저장값엔 `#` 넣지 말 것(prefix 가 표시 시 자동 부착, 입력 시 자동 제거). prefix 기본은 \"\"(없음).",
      "정해진 옵션에서 다중 선택은 SelectionCard mode='multiple' 또는 Chip 토글이 적합. 자동완성은 Autocomplete.",
      "초대 모달 푸터(취소/초대하기) 와 제목은 TagInput 바깥에서 조립 — TagInput 은 입력+칩 영역만 담당.",
      "캐포비(cashwalk-biz) stacked 태그는 SelectedItemRow 와 동일 트리트먼트(Figma 3001:18463): gray/200(#eee) fill · radius 10 라운드 사각 · 삭제 = 원형 serchdelete 아이콘. data-project cascade 가 자동 적용하니 칩 색/모양을 손으로 덮어쓰지 말 것."
    ],
    "recommended": [
      "멤버 초대: stacked + pattern(email) + maxTags=50 + helperText 로 제한 안내",
      "관심사/해시태그: variant=inline + prefix=# + maxTags",
      "콘텐츠 태그: allowDuplicates=false (기본)"
    ],
    "examplesHtml": {
      "do": "<!-- 기본 stacked: 입력칸 + 추가버튼, 칩은 아래 wrap (이메일 초대/수신자) -->\n<nds-tag-input label=\"멤버 초대하기\" placeholder=\"이메일 주소를 입력해 주세요\"\n  pattern=\"^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$\" max-tags=\"50\"\n  helper-text=\"멤버는 최대 50명까지, 한번에 최대 10명까지 초대할 수 있습니다.\"></nds-tag-input>\n<script>\n  el.addEventListener(\"nds-tag-change\", e => save(e.detail.value));\n  el.addEventListener(\"nds-tag-invalid\", e => toast(`이메일 형식이 아니에요: ${e.detail.value}`));\n</script>\n<!-- 해시태그식 인라인 tokenfield -->\n<nds-tag-input variant=\"inline\" prefix=\"#\" label=\"관심 주제\"\n  placeholder=\"태그 입력 후 Enter\" max-tags=\"5\"></nds-tag-input>",
      "dont": "<!-- 이메일 받으면서 pattern 검증 없음 — 잘못된 주소가 그대로 칩이 됨 -->\n<nds-tag-input label=\"멤버 초대\"></nds-tag-input>\n<!-- 해시태그인데 value 에 직접 # 넣음 — prefix 가 표시 담당, 저장값엔 # 빼기 -->\n<nds-tag-input variant=\"inline\" value='[\"#수면\"]'></nds-tag-input>"
    }
  },
  "Text": {
    "name": "Text",
    "summary": "타이포 primitive. `variant`(타입 스케일 size+line-height)·`tone`(시맨틱 색)·`weight` 를 토큰에서만 받아 임의의 텍스트에 거는 얇은 컴포넌트 — DS 의 공용 타이포 SSOT(`.nds-text-*` 클래스)를 소비한다. Heading 의 body 짝: \"제목+설명 묶음\"은 Heading, \"한 덩이의 텍스트(본문·라벨·메타·캡션)\"는 Text. `expandable` 로 길면 '더보기/접기' 토글(구 ExpandableText 흡수). (figmaNodeUrl: TODO — 타이포 스케일 노드 게시 후 연결.)",
    "pitfalls": [
      "**제목 + 설명 묶음에는 Text 를 두 번 쌓지 말 것** → Heading(level 로 폰트+gap 자동). Text 는 단일 텍스트 런 전용.",
      "**variant 는 size+line-height 만** 결정한다 — 헤딩 스케일(`headline*`)을 줘도 자동 bold/색이 되지 않는다. 굵기는 `weight`, 색은 `tone` 으로 따로 준다.",
      "**색은 `tone` 으로만** — raw hex/인라인 색 금지. 프로젝트별 색 차이는 컴포넌트가 모르고 `--semantic-text-*`(tone) 토큰이 흘려보낸다.",
      "`maxLines` 는 **CSS line-clamp(측정 없음)** — 정적으로 N줄에서 잘림. 펼침/접힘 토글이 필요하면 `expandable`.",
      "`expandable` 본문에 **폰트 사이즈를 섞으면** line-height 측정 정확도가 떨어진다 — 단일 톤 텍스트에만. (html `<nds-text expandable>` 는 expandable 여부가 mount 시 1회 확정 — 런타임 토글 비대상.)",
      "짧은 텍스트에 `expandable` 을 줘도 토글은 자동으로 숨겨진다 — 한두 줄짜리엔 굳이 쓰지 않는다.",
      "`as` 는 시맨틱 태그 — 문단이면 `as=\"p\"`, 인라인 강조면 `as=\"strong\"`. 기본 `span`."
    ],
    "recommended": [
      "본문: `<Text variant=\"body1\" tone=\"normal\" as=\"p\">…</Text>` (또는 body2)",
      "메타/날짜/조회수: `<Text variant=\"caption1\" tone=\"subtle\">2026.06.14 · 조회 1,204</Text>`",
      "라벨/배지 텍스트: `<Text variant=\"caption1\" weight=\"medium\">필수</Text>`",
      "상태 메시지: `<Text variant=\"body3\" tone=\"statusError\">입력을 확인해 주세요</Text>`",
      "카드 설명 미리보기: `<Text variant=\"body3\" expandable maxLines={3}>긴 설명…</Text>`",
      "약관 미리보기: `<Text expandable maxLines={2} hideCollapse expandLabel=\"이용약관 전문 보기\">…</Text>`"
    ],
    "accessibility": [
      "문단 텍스트는 `as=\"p\"` 로 시맨틱을 맞춘다(스크린리더 흐름·문서 아웃라인).",
      "`expandable` 토글 버튼은 `aria-expanded` 가 자동 반영된다 — 별도 처리 불필요.",
      "본문 색은 tone 토큰이 대비를 보장 — `disabled`/`muted` 를 본문 가독 텍스트에 쓰지 말 것."
    ],
    "examples": {
      "do": "<Text variant=\"body1\" tone=\"normal\" as=\"p\">오늘 하루도 수고했어요.</Text>\n<Text variant=\"caption1\" tone=\"subtle\">2026.06.14 · 조회 1,204</Text>\n<Text variant=\"body3\" expandable maxLines={3}>긴 설명 텍스트…</Text>",
      "dont": "{/* 제목+설명을 Text 두 개로 — Heading 을 써야 level↔gap 이 자동 */}\n<Text variant=\"headline4\" weight=\"bold\">바로 상담하기</Text>\n<Text variant=\"caption1\" tone=\"subtle\">급한 문제는 5분 내 바로 상담</Text>\n\n{/* raw 색 하드코딩 — tone 토큰을 쓸 것 */}\n<Text style={{ color: \"#1A1A1A\" }}>본문</Text>"
    },
    "examplesHtml": {
      "do": "<nds-text variant=\"body1\" tone=\"normal\">오늘 하루도 수고했어요.</nds-text>\n<nds-text variant=\"caption1\" tone=\"subtle\">2026.06.14 · 조회 1,204</nds-text>\n<nds-text expandable max-lines=\"3\">긴 설명 텍스트…</nds-text>",
      "dont": "<!-- 한 줄짜리 짧은 텍스트에 expandable — 더보기 버튼이 더 큼 -->\n<nds-text expandable max-lines=\"3\">간단한 안내</nds-text>"
    }
  },
  "TextButton": {
    "name": "TextButton",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-8522",
    "sizeMatrix": {
      "large": "16·24 regular / icon 16 / gap 2 / padding 4",
      "medium": "14·20 regular / icon 16 / gap 2 / padding 4"
    },
    "stateMatrix": {
      "default": "color #777 (neutral/600)",
      "disabled": "color #999 (neutral/500)",
      "hover": "color primary/main (DS), Figma는 opacity-50 — 가이드 차이 항목"
    },
    "summary": "텍스트만으로 된 액션 — '전체보기' 같은 인라인 링크에 적합 (Figma Library node 171:8522).",
    "pitfalls": [
      "단순 <span>/<a>로 만들지 말 것 — DS TextButton 에 호버/포커스/접근성 처리가 들어 있음.",
      "Figma 호버 명세가 opacity-50 으로 잡혀 있음 (대비비 위험) — 코드에서는 primary 컬러로 대체. 의도적 차이."
    ],
    "examplesHtml": {
      "do": "<nds-text-button size=\"md\" label=\"더보기\" right-icon=\"arrow-next\"></nds-text-button>",
      "dont": "<!-- 파괴 액션을 text-button 으로 — 위계/색이 부족. nds-button color=\"error\" 권장 -->\n<nds-text-button label=\"계정 삭제하기\" right-icon=\"arrow-next\"></nds-text-button>"
    }
  },
  "Textarea": {
    "name": "Textarea",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903",
    "summary": "여러 줄 자유 입력. 일기 / 후기 / 메모. 자체 max-length / min-height 가이드 있음.",
    "pitfalls": [
      "raw <textarea> 직접 사용 — placeholder/스타일/포커스 ring 토큰 미적용.",
      "resize='none' + 짧은 min-height — 긴 본문 입력 시 답답함. min-height 120 이상 권장.",
      "max-length 만 두고 counter (FormField.counter) 안 보여줌 — 사용자는 글자 수를 모름."
    ],
    "examplesHtml": {
      "do": "<nds-textarea label=\"오늘 기록\" placeholder=\"자유롭게 입력해주세요\" max-length=\"500\" min-height=\"180\" resize=\"vertical\"></nds-textarea>",
      "dont": "<!-- raw textarea — DS 스타일 적용 안 됨 -->\n<textarea placeholder=\"…\" maxlength=\"500\"></textarea>"
    }
  },
  "TimePicker": {
    "name": "TimePicker",
    "summary": "시간만 선택 (HH:mm). 네이티브 시간 입력이 아니라 DS 팝오버 패널(시/분 스크롤 컬럼, DatePicker 와 동일 surface)로 선택. step(초 단위)/min/max 지원. 날짜+시간은 DatePicker와 조합.",
    "pitfalls": [
      "트리거(시계아이콘 포함)를 누르면 시/분 컬럼 팝오버가 열린다 — OS 기본 시간 UI(showPicker)는 쓰지 않는다. 선택값은 프로젝트 fill 로 강조.",
      "step은 초 단위 — 5분이면 300, 15분이면 900. 분 컬럼 간격으로 환산된다.",
      "min/max도 HH:mm 문자열 — Date 객체 X. 범위 밖 시/분 옵션은 자동 비활성.",
      "**(캐포비 어드민) 시간 인풋의 '빠른설정' 프리셋은 `nds-time-picker` 의 `presets` 속성으로 — 손조립·노란 project Chip 금지.** 광고 노출 스케줄 등에서 시간 필드 트레일링(`00:00` + 시계아이콘 우측)에 `자정까지`(= 시간을 즉시 세팅) 같은 빠른설정 칩이 붙는다. 이건 컴포넌트 내장 기능이다: `presets='[{\"label\":\"자정까지\",\"value\":\"23:59\"}]'`(React `presets={[{label,value}]}`) — 클릭하면 value 가 세팅되는 **회색 중립 칩**으로 자동 렌더(시계 아이콘 ic_time_picker 포함). raw `<div>`/`<nds-chip>` 으로 손조립하지 말 것. **노란 outlined Chip / SelectionButton 으로 그리면 회귀**(SelectionButton 과 혼동되는 '지역=노란칩'과 동일 함정 — region-as-chip 참조). Figma 3001:19122."
    ],
    "recommended": [
      "알림: step=300, min='07:00' max='23:00'",
      "복약: step=900",
      "캐포비 광고 스케줄: nds-time-picker presets='[{\"label\":\"자정까지\",\"value\":\"23:59\"}]' — 시계아이콘 + 회색 중립 빠른설정 칩이 내장 렌더(노란 project 아님). Figma 3001:19122."
    ],
    "examplesHtml": {
      "do": "<nds-time-picker value=\"18:00\" step=\"600\"\n  label=\"노출 종료 시간\"\n  presets='[{\"label\":\"자정까지\",\"value\":\"23:59\"}]'></nds-time-picker>\n<script>el.addEventListener(\"nds-time-change\", e => setTime(e.detail.value));</script>",
      "dont": "<!-- step 0 — 분/초 단위 무제한 — 예약 정확도 깨짐 -->\n<nds-time-picker value=\"14:30\" step=\"0\"></nds-time-picker>"
    }
  },
  "Timeline": {
    "name": "Timeline",
    "summary": "타임라인 — data-array(items) API. mode=activity(시간순 이벤트 로그 — date/title/description + status/statusLabel 배지) + mode=tracker(정해진 단계 진행 트래커 — current 인덱스로 done/current/todo 파생, direction=vertical|horizontal). 구 ActivityTimeline+StatusTimeline 통합. (단계 진척만 간결히 보이려면 Stepper, 다단계 폼은 조립 패턴=pattern:multi-step-form.)",
    "pitfalls": [
      "items 의 각 항목은 { key, title, date?, description?, status?, statusLabel? }. title 은 필수(이벤트/단계 이름), date 는 시점.",
      "mode=tracker 는 current(0-based)로 상태 파생 — per-item status 는 무시됨. 전부 완료는 current=items.length.",
      "mode=activity 는 per-item status(default/completed/ongoing/warning/error) 명시. statusLabel 없이 status만 주면 dot 색만 바뀌고 우측 배지는 안 뜸 — 둘 다 필요.",
      "direction='horizontal' 은 tracker 에서만 의미(가로 단계 트래커). activity 는 항상 세로.",
      "status='ongoing' 은 box-shadow ring 효과 — 한 화면에 여럿 두면 시각 잡음. 보통 1개. items 20+ 면 페이지네이션/가상화 권장."
    ],
    "examplesHtml": {
      "do": "<!-- 이벤트 로그 -->\n<nds-timeline mode=\"activity\" items='[\n  {\"key\":\"1\",\"date\":\"2026.05.25\",\"title\":\"상담 예약 완료\",\"status\":\"completed\",\"statusLabel\":\"완료\"},\n  {\"key\":\"2\",\"date\":\"2026.05.28\",\"title\":\"자가검사\",\"status\":\"ongoing\",\"statusLabel\":\"진행 중\"}\n]'></nds-timeline>\n<!-- 단계 트래커 -->\n<nds-timeline mode=\"tracker\" current=\"1\" direction=\"horizontal\" items='[\n  {\"key\":\"r\",\"title\":\"접수\",\"date\":\"05/20\"},\n  {\"key\":\"p\",\"title\":\"처리 중\"},\n  {\"key\":\"d\",\"title\":\"완료\"}\n]'></nds-timeline>",
      "dont": "<!-- 슬롯 자식(nds-timeline-item)·steps 속성은 폐기 — items 배열 + mode 사용 -->\n<nds-timeline><nds-timeline-item title=\"…\"></nds-timeline-item></nds-timeline>"
    }
  },
  "Toast": {
    "name": "Toast",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=806-1277",
    "summary": "**비차단형 단일 다크 일시 메시지** 전용 (저장 완료 / 복사됨 / 전송됨 등). 확인·클릭 없이 자동으로 사라지는(2~3초, 오류 4초까지) 가벼운 결과 피드백 — 다크 배경(#212121·0.92) + 흰 텍스트 하나의 스타일만 있다. **색 변형(success/error/warning/info)은 없다** — 심각한 오류·결정 요청은 Toast 대신 Modal/Alert. 위치가 곧 형태다: `position=\"top\"` = PC·상단 중앙·**pill**·패딩 16/32·body2, `position=\"bottom\"` = 모바일·하단·**rounded 24**·패딩 12/20·body3. **동시에 1개만 노출이 기본**(maxCount 기본 1 — 새 토스트가 기존을 즉시 대체); 스택이 필요하면 `maxCount` 를 올려 opt-in. 자동으로 사라지므로 **액션(되돌리기/다시시도)·닫기 버튼·프로젝트 카드(캐포비 흰 카드)는 두지 않는다** — 그런 알림은 Snackbar 를 사용한다. **캐시워크 포 비즈니스(cashwalk-biz/캐포비)는 알림을 Snackbar 만 사용한다 — Toast 를 쓰지 않는다(예외 없음).** 캐포비 화면의 `<nds-toast>` 는 validator 가 `project-banned-notification` error 로 차단한다. get_guide({ topic: 'component:Snackbar', project: 'cashwalk-biz' }).",
    "pitfalls": [
      "**색 변형을 기대하지 말 것** — Toast 는 단일 다크 스타일이다. `variant` prop 은 없다(제거됨). 심각도 위계가 필요하면 Modal/Alert 또는 inline notice 패턴.",
      "**기본은 1개만 노출** — 연속 호출 시 기존 토스트는 즉시 사라진다. 동시에 여러 개를 쌓으려면 `maxCount` 를 명시적으로 올려라(가이드: 동시 1개 권장).",
      "위치는 형태를 바꾼다 — `top` 은 PC pill, `bottom` 은 모바일 rounded 24. 디바이스 컨벤션(PC 상단 / 모바일 하단)을 따른다.",
      "duration 0 으로 영구 표시 금지 — 차단 의도면 Modal/Popup, 영구 알림이면 Banner.",
      "Toast 안에 input/form/액션 두지 말 것 — interactive 영역이면 Drawer/Modal, 액션·닫기가 필요하면 Snackbar.",
      "**캐포비(cashwalk-biz)에서는 Toast 자체를 쓰지 않는다 — Snackbar 만 사용**(순수 일시 메시지여도 예외 없음). validator `project-banned-notification` 룰이 `<nds-toast>` 를 error 로 막는다.",
      "**트로스트(Toast 가이드 806:1277)**: bg Black 0.92 · Top=pill(PC ≥1024 상단 중앙·safe-top 80) / Bottom=rounded 24(모바일 <1024 하단 중앙·safe-bottom 96·좌우 16). 본문 14 White 1줄 권장 · padding Bottom 12/20·Top 16/32 · shadow y8 blur24 18% · auto-dismiss 2~3s · z-index 1500+. 비가역형(액션 버튼 없음) — 액션 필요하면 Snackbar/Modal."
    ],
    "examplesHtml": {
      "do": "<!-- 모바일: 하단 rounded 24 -->\n<nds-toast message=\"저장되었습니다\" position=\"bottom\" duration=\"2500\" open></nds-toast>\n<!-- PC: 상단 pill -->\n<nds-toast message=\"링크가 복사되었습니다\" position=\"top\" duration=\"2500\" open></nds-toast>",
      "dont": "<!-- 색 변형/액션이 필요 — Toast 가 아니라 Snackbar·Modal 사용 -->\n<nds-toast open message=\"삭제됨\" variant=\"error\"></nds-toast><!-- variant 없음 · 되돌리기 불가 -->"
    }
  },
  "Toggle": {
    "name": "Toggle",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5158-108",
    "summary": "즉시 적용되는 on/off 스위치. 설정 페이지 / 알림 토글에 사용. 폼 제출 후 적용되는 binary 는 Checkbox 가 맞음. **라벨 내장 status 변형** — onLabel/offLabel(HTML on-label/off-label)을 주면 트랙 **안**에 텍스트(예: 노출/미노출)가 들어가고 폭이 auto 로 넓어진다. tone='success' 면 켜짐 트랙이 초록(노출/활성 status). 어드민 리스트의 노출 토글에 사용.",
    "pitfalls": [
      "label 없는 단독 Toggle — 무엇을 켜고 끄는지 시각만으론 불명확. (라벨 내장 status 변형이면 on-label/off-label 자체가 안내 역할.)",
      "Toggle 변경 후 별도 '저장' 버튼이 필요한 UI 라면 Checkbox 가 맞음 — Toggle 은 즉시 반영 시그널.",
      "size='sm' 을 본문 안 inline 텍스트와 함께 — 시각 위계 부족, baseline 어색.",
      "노출/활성 status 토글의 켜짐 초록을 raw hex(#60be34 등)로 박지 말 것 — tone='success' 가 semantic status-success 토큰으로 5 프로젝트 자동 대응. 라벨 내장 status 토글은 size 무시(고정 30 / thumb 25).",
      "**트로스트(Controls 가이드 5158:108)**: 트랙 50×30, on=다크(#333). 즉시 적용 설정에만(저장 버튼 필요한 곳 금지). 라벨은 명사·상태형(\"푸시 알림\" ⭕, \"받기\"/\"활성화\" ❌ — 동사 금지). 라벨 좌측·컨트롤 우측.",
      "**런마일(Controls 가이드 5111:345)**: 트랙 51×31, OFF=BG/Disabled(gray200 #F2F4F6)·노브 좌, ON=프로젝트 **오렌지 #FF5B37**·노브 우(트로스트 다크와 달리 fill.brand fallback). 즉시 적용 옵션(알림 설정·다크모드 등). disabled 는 BG/Disabled."
    ],
    "examplesHtml": {
      "do": "<nds-toggle name=\"push-notification\" label=\"푸시 알림 받기\" checked></nds-toggle>\n<!-- 어드민 리스트 노출 토글: 라벨 내장 + 초록 status -->\n<nds-toggle on-label=\"노출\" off-label=\"미노출\" tone=\"success\" checked></nds-toggle>\n<script>el.addEventListener(\"change\", e => savePref(e.target.checked));</script>",
      "dont": "<!-- 라벨 없는 단독 토글 -->\n<nds-toggle></nds-toggle>\n<!-- 즉시 반영 안 되는 form -->\n<form>\n  <nds-toggle name=\"x\" label=\"설정 A\"></nds-toggle>\n  <nds-button color=\"primary\" type=\"submit\">저장</nds-button> <!-- Checkbox 가 맞음 -->\n</form>"
    }
  },
  "Tooltip": {
    "name": "Tooltip",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=806-1278",
    "summary": "trigger 에 마우스 hover / focus 시 보조 설명(Figma 1380:13). **단일 다크 톤** — 배경 `--nds-tooltip-bg`(#333333, 전 프로젝트 동일) + 흰 텍스트(Caption1 Medium 13), padding 14/16, radius 8, **꼬리 12×8 triangle**(본체 외부 가운데). Position 4종(Top/Bottom/Left/Right, 트리거 기준), trigger=Hover·Focus, delay Show 200ms·Hide 0ms(플리커 방지), z-index 1400(모달·토스트보다 아래), **동시 1개만 노출**. **두 줄·여러 줄 본문 허용** — 짧은 힌트는 `content` 속성(자동 줄바꿈, 1줄 권장·최대 2줄), 제목+불릿 같은 **리치 안내**(예: 캐포비 '권한 안내')는 `<template slot=\"content\">` 로 넣고 `max-width` 로 폭 조절. 모바일/터치 only 환경에선 사실상 안 보이므로 핵심 정보는 본문에 둘 것.",
    "pitfalls": [
      "Tooltip 안에 인터랙티브 요소(링크/버튼) — 모바일/터치에서는 도달 불가.",
      "trigger 가 aria-label 만 갖고 visible 텍스트가 없는 아이콘 버튼인데 Tooltip 도 같은 내용 — 중복.",
      "본문 길이/줄 수 제한은 없음 — 두 줄·여러 줄·제목+불릿 리치까지 허용(`<template slot=\"content\">` + 필요 시 `max-width`). 단 (a) 사용자의 응답/결정이 필요하면 component:ConfirmTooltip(가벼운 인라인 확인) 또는 Modal/Popup(차단형), (b) 한 화면을 채울 만큼 길면 Modal — Tooltip 은 어디까지나 hover 보조 안내. (이전의 '한 문장 초과 금지' 규칙은 폐기.)",
      "리치 본문은 `content` 속성(평문)이 아니라 **`<template slot=\"content\">`** 로 — HTML(제목 `<p style=\"font-weight:700\">` · 불릿 `<ul><li>` · 강조 `<strong>`)을 넣어야 렌더된다. content 속성에 태그 문자열을 넣으면 그대로 escape 됨.",
      "**트로스트(Tooltip 가이드 806:1278)**: bg #333 · 흰 텍스트 Caption1 Medium 13 · padding 14/16 · radius 8 · tail 12×8 삼각형(본체 외부 가운데). Position 4종(Top/Bottom/Left/Right, 화면 가장자리면 반대 방향). delay show 200ms·hide 0 · trigger Hover·Focus(터치=long-press) · z-index 1400(모달·토스트 1500 아래). 액션 버튼·링크 금지 → Modal/Notice. 본문 1줄(최대 2).",
      "**런마일(Tooltip 가이드 5085:314)**: bg=Surface/Strong **#221E1F α0.9**(트로스트 #333 보다 진한 반투명)·radius **6**·화살표 **8×8**·본문 **12/16** Medium. 모두 `components.tooltip`(bg/radius/fontSize/lineHeight/arrowW/arrowH) 슬롯으로 흘려보냄 — 트로스트(8/12×8/13)는 fallback 유지. 흰 텍스트, Position 4종(Top 기본)."
    ],
    "examplesHtml": {
      "do": "<!-- ① 짧은 힌트(자동 줄바꿈) -->\n<nds-tooltip content=\"삭제하면 복구할 수 없어요\" placement=\"top\" trigger-label=\"?\"></nds-tooltip>\n<!-- ② 리치 안내(제목+불릿·멀티라인) — 캐포비 권한 안내 형태 -->\n<nds-tooltip trigger-label=\"?\" placement=\"top\" max-width=\"346\" open>\n  <template slot=\"content\">\n    <p style=\"font-weight:700\">권한 안내</p>\n    <ul>\n      <li>비즈니스 계정 : <strong>모든 광고 계정</strong>에 접근할 수 있으며, 광고 계정 생성 및 수정 권한을 가집니다.</li>\n      <li>일반 계정 : <strong>초대된 광고 계정</strong>에 한해 광고 조회 및 관리가 가능합니다.</li>\n    </ul>\n  </template>\n</nds-tooltip>",
      "dont": "<!-- 모바일에서 보이지 않는 본질 정보를 툴팁에만 -->\n<nds-tooltip content=\"이용약관 동의가 필수입니다\" trigger-label=\"?\"></nds-tooltip>\n<!-- 리치 본문을 content 속성에 태그 문자열로 (escape 되어 깨짐) -->\n<nds-tooltip trigger-label=\"?\" content=\"<strong>권한 안내</strong><ul>...\"></nds-tooltip>"
    }
  },
  "TrendingKeywords": {
    "name": "TrendingKeywords",
    "summary": "급상승 검색어 / 핫 키워드 표시. 마케팅/검색 화면에서 사용. 정량 데이터 기반인지 확인 후 사용.",
    "pitfalls": [
      "큐레이션된 키워드를 'TRENDING' 으로 노출 — 사용자가 알고리즘 결과로 오해.",
      "키워드 10개 초과 — 시각 노이즈. top 5 권장.",
      "공감/안전 도메인(자해/우울)에선 사용 금지 — 검색어 자체가 트리거가 될 수 있음."
    ],
    "examplesHtml": {
      "do": "<nds-trending-keywords\n  items='[{\"rank\":1,\"trend\":\"up\",\"keyword\":\"불면증\"},{\"rank\":2,\"trend\":\"new\",\"keyword\":\"번아웃\"}]'\n  header-title=\"인기 검색어\" timestamp=\"오늘 09:00 기준\"></nds-trending-keywords>\n<script>el.addEventListener(\"nds-trending-keyword-click\", e => search(e.detail.keyword));</script>",
      "dont": "<!-- 자해 / 위기 도메인에서 사용 — 검색어 자체가 트리거 가능 -->\n<nds-trending-keywords items='[{\"rank\":1,\"keyword\":\"자해\"}]'></nds-trending-keywords>"
    }
  },
  "ValidationChip": {
    "name": "ValidationChip",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9903",
    "standalone": false,
    "composeWith": [
      "Input",
      "FormField"
    ],
    "stateMatrix": {
      "incomplete": "muted — icon/text var(--semantic-text-muted-default) (#999) · 체크 글리프 · 아직 미충족(기본값)",
      "complete": "project — icon/text var(--semantic-text-brand-default) (#2b96ed) · 체크 글리프 · 규칙 충족",
      "error": "error — icon/text var(--semantic-text-status-error) (#f13f00) · X 글리프 · 형식 위반"
    },
    "summary": "입력 형식 요구사항 1개의 **실시간 충족 신호**. 16px 체크 아이콘 + 12px 라벨, gap 4px 의 읽기 전용 인라인 인디케이터(클릭 동작 없음). 회원가입 비밀번호/이메일처럼 규칙이 여러 개일 때 Input 아래 한 줄에 여러 개를 나열하고(pattern:form-validation), 입력값이 규칙을 충족할 때마다 `incomplete → complete` 로 전환한다. 상태색은 semantic 토큰 — incomplete=`--semantic-text-muted-default`(회색), complete=`--semantic-text-brand-default`(Project Blue), error=`--semantic-text-status-error`. 아이콘·텍스트가 같은 색이라 root `color` 하나만 두고 SVG 는 `currentColor` 로 상속(프로젝트 cascade 자동 대응).",
    "pitfalls": [
      "**합성 전용 — 단독 사용 금지.** ValidationChip 은 항상 Input/FormField **아래 검증 체크리스트**(여러 개 동시 노출)로만 쓴다. 입력과 분리된 단독 상태 인디케이터·배지로 쓰지 말 것(그건 Badge). 부모 필드 없이는 의미가 없는 필드 서브 컴포넌트다.",
      "Chip / Badge 와 혼동 — Chip 은 **선택·필터용 인터랙티브 태그**(`<nds-chip selected interactive>`), Badge 는 **상태 라벨**, ValidationChip 은 **검증 규칙 1개의 충족 신호**다. 선택 UI 에 ValidationChip 을 쓰지 말 것.",
      "단독으로 에러 메시지를 대체하지 말 것 — ValidationChip 은 규칙 체크리스트(여러 개 동시 노출)용. 폼 필드의 **단일 에러 1줄**은 FormField 의 helper/error 슬롯이 담당(pattern:form-validation 의 Helper/Error 규칙).",
      "색을 raw hex(#2b96ed·#f13f00·#999)로 박지 말 것 — state prop 만 바꾸면 semantic 토큰이 5 프로젝트 자동 대응. 컴포넌트에 hex 를 넣으면 프로젝트 cascade 가 끊긴다.",
      "complete 전환은 입력값이 실제로 규칙을 충족할 때만 — 빈 입력에서 미리 complete(파랑)로 보이면 충족 신호가 거짓이 된다. 초기값은 incomplete."
    ],
    "examplesHtml": {
      "do": "<!-- 비밀번호 규칙 체크리스트 — Input 아래 한 줄에 나열 -->\n<nds-input type=\"password\" placeholder=\"비밀번호\"></nds-input>\n<div style=\"display:flex; gap:12px; margin-top:8px\">\n  <nds-validation-chip state=\"complete\">6자 이상</nds-validation-chip>\n  <nds-validation-chip state=\"incomplete\">영문+숫자</nds-validation-chip>\n</div>",
      "dont": "<!-- 선택 UI 를 ValidationChip 으로 (→ nds-chip selected interactive 가 맞음) -->\n<nds-validation-chip state=\"complete\">관심사: 운동</nds-validation-chip>\n\n<!-- 색을 hex 로 박아 프로젝트 cascade 차단 -->\n<nds-validation-chip style=\"color:#2b96ed\">6자 이상</nds-validation-chip>"
    }
  },
  "VerificationCodeInput": {
    "name": "VerificationCodeInput",
    "summary": "SMS/이메일 인증코드 입력 — 웹용 단일 필드(한 줄 박스). 코드 **입력 필드만** 책임진다. 자리별 세그먼트(네이티브식)가 아니라 base Input 과 동일한 단일 박스라 붙여넣기·자동완성(one-time-code)이 자연 지원되고 높이/둥근모서리는 Input 토큰(--nds-input-*)을 상속한다. 타이머·재전송·확인 버튼이 함께 있는 인증 폼은 이 필드를 **FormField + InputGroup** 으로 합성한다(남은시간 타이머는 앱이 합성하는 인라인 요소로 코드 입력 우측에 겹쳐 배치, 확인 버튼은 InputGroup 의 같은 행). (구 이름 OtpInput — 2026-06 VerificationCodeInput 으로 개명, 태그 nds-verification-code-input.)",
    "pitfalls": [
      "이 컴포넌트는 코드 필드만 — 타이머/재전송/확인 버튼은 FormField(헬퍼) + InputGroup(코드 입력 + 버튼) + 인라인 타이머(앱이 합성하는 요소)로 붙인다(내장 타이머 없음). 남은시간 카운트다운은 DS 컴포넌트가 아니라 앱 합성 패턴이다.",
      "value는 숫자 string. length만큼 채워지면 onComplete(react)/code-complete(html) 발화 — 그 안에서 자동 제출하면 UX 좋음.",
      "입력은 숫자만 허용(영문/특수문자 자동 필터). 영숫자 OTP가 필요하면 maxLength 늘린 일반 Input 검토.",
      "autoComplete=\"one-time-code\" 가 단일 input 에 적용 — iOS/Android SMS 자동 추출 동작.",
      "자리별 세그먼트 UI(자리당 박스)가 아님 — length 는 maxLength 로만 작동.",
      "**자리별 박스(6칸 세그먼트) 는 모바일/네이티브 앱 패턴** — 웹/데스크톱에서는 이 단일 필드가 표준이다(붙여넣기·자동완성·접근성이 자연 동작). 네이티브 앱의 6칸 OTP 화면을 웹 목업으로 그대로 옮겨 자리별 박스를 raw <input> 으로 만들지 말 것."
    ],
    "recommended": [
      "회원가입/로그인 SMS 인증: FormField(helper) > InputGroup(align=start) 에 VerificationCodeInput length=6 autoFocus + 확인 Button, 타이머(앱 합성 인라인 요소)는 코드 입력 우측에 겹쳐 배치 · onComplete 로 자동 검증.",
      "재전송: 타이머 만료 시 InputGroup 의 버튼을 '재전송'으로 토글 → 클릭에서 재발송.",
      "에러 시 error prop + Toast. 자동 clear 는 호출부에서 결정(전체 clear가 보통 안전)."
    ],
    "examplesHtml": {
      "do": "<!-- 레시피A · 인라인 확인 버튼형: 코드 입력 + 확인 버튼을 FormField > InputGroup 으로, 타이머는 코드 입력 우측에 겹쳐 배치.\n     버튼 색은 nds-button 의 color 가 그대로 — 캐포비 검정 확인은 color=\"neutral\"(secondary 아님). -->\n<nds-form-field helper=\"문자로 전송된 인증번호를 입력해주세요\">\n  <nds-input-group align=\"start\">\n    <nds-verification-code-input length=\"6\" auto-focus></nds-verification-code-input>\n    <nds-button color=\"neutral\" size=\"field\">확인</nds-button>\n  </nds-input-group>\n</nds-form-field>\n\n<!-- 레시피B · 캐포비 본인인증형(pattern:cashwalk-biz-verification): 전송/재전송은 별도 full-width 검정 버튼,\n     코드 입력엔 인라인 버튼 없이 타이머(앱 합성 인라인 요소, 브랜드색 #FD9B02)만, 확정은 하단 [다음](primary full-width). -->\n<nds-button color=\"neutral\" full-width>인증번호 재전송</nds-button>\n<nds-verification-code-input length=\"6\" auto-focus></nds-verification-code-input>\n<!-- 남은시간 타이머는 앱이 합성하는 인라인 요소(브랜드색). DS 컴포넌트 아님 — 앱에서 setInterval 로 갱신. -->\n<span style=\"color:#FD9B02;font-variant-numeric:tabular-nums;\">03:00</span>\n<!-- …다른 폼 필드… -->\n<nds-button color=\"primary\" full-width>다음</nds-button>\n<script>\n  document.querySelector(\"nds-verification-code-input\").addEventListener(\"code-complete\", e => verify(e.detail.value));\n</script>",
      "dont": "<!-- 자리별 박스를 raw <input> 6개로 흉내 — 붙여넣기/자동완성/접근성 손실. 단일 nds-verification-code-input 사용 -->\n<input maxlength=\"1\"/><input maxlength=\"1\"/>…"
    }
  },
  "VideoPlayer": {
    "name": "VideoPlayer",
    "summary": "HTML5 video 래퍼. 포스터/제목/길이 오버레이 + 커스텀 재생 UI 또는 nativeControls.",
    "pitfalls": [
      "autoPlay는 muted=true와 함께가 아니면 브라우저가 차단. autoPlay만 단독으로 켜지 말 것.",
      "유튜브/비메오 embed 용도가 아님 — src는 mp4/webm 같은 호스팅된 영상.",
      "라이브 스트리밍/HLS는 미지원. HLS.js 등 별도 라이브러리를 video DOM에 부착하는 패턴 필요.",
      "nativeControls=true로 두면 커스텀 오버레이는 무시됨. 둘 중 하나만."
    ],
    "recommended": [
      "명상 영상: <VideoPlayer src=... poster=... title='아침 명상' durationLabel='5:30' />",
      "스토리 형식: aspectRatio='9 / 16'",
      "자동 반복 미리보기: autoPlay muted loop"
    ],
    "examplesHtml": {
      "do": "<nds-video-player src=\"/intro.mp4\" poster=\"/cover.jpg\"\n  title=\"첫 회기 안내\" duration-label=\"3:42\" muted></nds-video-player>",
      "dont": "<!-- aspect-ratio 형식 위반 (CSS aspect-ratio 형식: \"16 / 9\") -->\n<nds-video-player src=\"/v.mp4\" aspect-ratio=\"16:9\"></nds-video-player>"
    }
  }
};

export const PATTERN_GUIDES: Record<string, PatternGuide> = {
  "action-row": {
    "name": "action-row",
    "metrics": {
      "preferredBuckets": "44 / 48 / 52 px",
      "defaultBucket": "44px (Button.md · Tab.chip pc)",
      "maxHeightMixPerRow": 1,
      "gapBetweenItems": "8 / 12 / 16 px (--semantic-gap-component-*)",
      "verticalAlign": "center"
    },
    "summary": "헤더 우측 액션 row · 필터 바 · 도구 모음처럼 *서로 다른 컴포넌트가 한 줄로 나란히 놓이는* 영역에서 높이를 어떻게 맞추는가. 빠지면 1-2px 어긋남이 row 전체를 시각적으로 불편하게 만든다. `sizing.button` / `sizing.tabs` / `sizing.input` 토큰의 단일 source of truth.",
    "rules": [
      "한 row 안의 모든 컴포넌트는 *동일한 height bucket* (44 / 48 / 52 중 하나) 으로 통일. 4px 차이도 정렬 깨짐.",
      "**기본 bucket = 44px** — Button.md(44) / Tab.chip(pc 44) 가 자연 매치. 헤더 우측 액션 row · 필터 바 · 카드 footer 의 표준.",
      "**큰 bucket = 48px** — Button.lg(48) / Button.field(48) / Input.default·field(48, 둘 다 sizing.input=48) / AppBar 아래 큰 액션 row. primary CTA 가 포함된 row 에 사용.",
      "**작은 bucket = 38-42px** — Button.sm(42) / Button.xs(38) / Tab.chip(mobile 36 — 38 에 가깝게 padding 조정). 정보 밀도 높은 어드민·표 상단 도구 모음에 사용.",
      "DS 컴포넌트의 height 는 `sizing.button.{size}` / `sizing.tabs.{type}.{viewport}` / `sizing.input.{kind}` 토큰이 단일 진실. **인라인 height 로 덮어쓰지 말 것** — 자연 높이가 다른 컴포넌트를 같은 px 로 강제하면 line-height 가 어긋난다.",
      "DateRangePicker / Toggle / Select 같이 sizing.* 토큰이 없는 컴포넌트는 size prop 으로 매치하거나, 같은 row 에서 padding 만 조정해 외형을 맞춘다. **임의 height: 40px 같은 raw px 금지** — 토큰에서 가장 가까운 bucket 으로 라운드.",
      "row 안 컴포넌트 간 gap 은 8 / 12 / 16 중 하나. var(--semantic-gap-component-tight) / var(--semantic-gap-component-default) / var(--semantic-gap-component-loose).",
      "row baseline 정렬: align-items: center (vertical center) 가 기본. text label 이 있는 컴포넌트와 icon-only 컴포넌트를 섞으면 baseline 정렬은 어긋남 — center 만 사용."
    ],
    "avoid": [
      "한 row 안에 Button(44) + Tab(56) + Toggle(38) 처럼 다른 bucket 의 컴포넌트를 섞기",
      "`style={{ height: '40px' }}` 같은 raw px 로 컴포넌트 자연 높이를 덮어쓰기 — line-height 어긋남",
      "DateRangePicker 의 input 자연 높이가 40px 이라고 다른 컴포넌트도 height: 40 으로 강제하기 (toggle/tabs 가 깨짐)",
      "primary CTA 가 들어있는 row 에 작은 sm/xs Button 을 섞기 — 시각 위계 흐려짐",
      "row gap 을 14 / 18 / 20 같은 4pt grid 위반 값으로 설정",
      "row baseline 정렬을 align-items: baseline 으로 두기 — text + icon 혼합 row 에서 어긋남"
    ]
  },
  "admin-shell": {
    "name": "admin-shell",
    "metrics": {
      "requiredImport": "@nudge-design/styles/styles.css",
      "pageShellClass": "nds-shell",
      "sidebarClass": "nds-shell__sidebar",
      "sidebarIcon": "nds-sidebar item.icon = inline SVG (find_icon 결과 주입, 이름 아님 — innerHTML) · React Sidebar 는 icon?:ReactNode 로 대칭 · JSON 속성이라 SVG의 \" 는 이스케이프",
      "mainClass": "nds-shell__main",
      "topbarClass": "nds-shell__topbar (+ -title-group / -title / -subtitle / -actions)",
      "tabsClass": "nds-shell__tabs",
      "contentClass": "nds-shell__content (+ --single)",
      "sectionClass": "nds-section (+ --stack)",
      "sectionSlots": "nds-section__head / __title / __caption / __body",
      "formRowClass": "nds-form-row",
      "formRowSlots": "nds-form-row__label / __label-required / __control / __hint",
      "defaultSidebarWidth": "240px (--nds-shell-sidebar-width)",
      "defaultAsideWidth": "320px (--nds-shell-aside-width)",
      "defaultSectionRadius": "12px (--nds-section-radius)",
      "defaultFormRowLabelWidth": "140px (--nds-form-row-label-width)",
      "sidebarLogo": "nds-sidebar[project] 가 로고 자동 주입 (5개 프로젝트 data URI 내장) — 텍스트 placeholder·수동 base64 <img> 금지 · validator admin-sidebar-logo-not-component",
      "enforcementRule": "raw-shell-pattern (error) — <style> 안 raw .page / .topbar / .section / .form-row 정의 차단"
    },
    "summary": "어드민/CMS/대시보드 페이지의 **shell + section + form-row** 보일러플레이트. @nudge-design/styles 의 nds-shell / nds-section / nds-form-row 클래스를 의무 사용. raw <style> 블록으로 .page / .topbar / .section / .form-row 를 재정의하면 토큰 drift · 프로젝트 스왑 실패 · 일관성 붕괴를 유발. 사용자 mock-test 기준 페이지당 200-600 줄 CSS 가 사라지는 영역.",
    "rules": [
      "**Setup 의무**: `import \"@nudge-design/styles/styles.css\";` 한 줄로 nds-shell 계열 클래스가 자동 활성화. tokens.css / html/styles.css 와 함께 import. 별도 install 불필요.",
      "**Page shell** (sidebar + main + topbar + content): `<div class=\"nds-shell\"><aside class=\"nds-shell__sidebar\"><nds-sidebar />...</aside><main class=\"nds-shell__main\"><header class=\"nds-shell__topbar\">...</header><div class=\"nds-shell__content\">...</div></main></div>`. raw `<div class=\"page\">` + grid CSS 직접 작성 **금지**.",
      "**Topbar**: `<header class=\"nds-shell__topbar\">` 안에 `<div class=\"nds-shell__topbar-title-group\"><h1 class=\"nds-shell__topbar-title\">제목</h1><p class=\"nds-shell__topbar-subtitle\">부제</p></div>` + `<div class=\"nds-shell__topbar-actions\">...</div>`. sticky/border-bottom/padding 직접 작성 **금지** — 클래스가 처리.",
      "**Section card** (본문 안 흰 박스): `<section class=\"nds-section\">` + 헤더 `<header class=\"nds-section__head\"><h2 class=\"nds-section__title\">...</h2><p class=\"nds-section__caption\">...</p></header>` + 본문 `<div class=\"nds-section__body\">...</div>`. raw `.section { background: ...; border: 1px solid ...; border-radius: 12px; }` 작성 **금지**.",
      "**Section 자식 간격** 자동: `<section class=\"nds-section nds-section--stack\">` 모디파이어를 쓰면 직계 자식 사이 20px 간격이 margin-top 으로 자동 부여. `> * + * { margin-top: }` 직접 작성 **금지**.",
      "**Form row** (라벨 + 컨트롤 grid): `<div class=\"nds-form-row\"><label class=\"nds-form-row__label\">필드명<span class=\"nds-form-row__label-required\">*</span></label><div class=\"nds-form-row__control\"><nds-input />...<p class=\"nds-form-row__hint\">힌트</p></div></div>`. raw `.form-row { display: grid; grid-template-columns: 140px 1fr; }` **금지**.",
      "**Content 우측 aside**: `<div class=\"nds-shell__content\">` 가 기본 main + 320px aside 2-컬럼. aside 가 없을 때만 `<div class=\"nds-shell__content nds-shell__content--single\">` 또는 `data-aside=\"false\"` 로 단일 컬럼. raw grid-template-columns 직접 작성 **금지**.",
      "**커스터마이즈**: 폭/패딩만 바꾸려면 CSS 변수만 override — `--nds-shell-sidebar-width` / `--nds-shell-topbar-padding` / `--nds-shell-content-padding` / `--nds-shell-aside-width` / `--nds-section-radius` / `--nds-section-head-padding` / `--nds-section-body-padding` / `--nds-form-row-label-width` / `--nds-form-row-gap`. **클래스 자체를 :where 밖에서 재정의하지 말 것**.",
      "**프로젝트 토큰만 사용**: 색/보더/배경은 nds-shell 계열이 이미 `--semantic-bg-surface-default` / `--semantic-border-normal-default` / `--semantic-text-strong-default` 등을 참조. raw hex 또는 `var(--semantic-*)` 인라인 override 금지 — 프로젝트 스왑 시 깨짐.",
      "**Aside / sticky** 가 자체 white card 가 필요하면 → `<nds-section>` 으로 감싸기. 별도 `.aside { background: ...; border: 1px solid ...; border-radius: ...; padding: 24px; }` 를 새로 정의 금지 (nds-section 의 의도된 중복).",
      "**Validator 강제**: html-validator 가 `<style>` 블록의 raw shell 패턴을 `raw-shell-pattern: error` 로 차단. 의도된 예외(예: 마케팅 랜딩의 hero 등 admin shell 이 아닌 layout) 만 별도 클래스명 (`.lp-hero` 등 nds- 접두 회피) + 인라인 토큰 사용으로 우회.",
      "**사이드바/톱바 로고 = 컴포넌트로 자동 주입 (텍스트·수동 base64 금지)**: 사이드바 상단 프로젝트 로고는 `<nds-sidebar project=\"trost|geniet|nudge-eap|cashwalk-biz|runmile\">` 만 두면 ProjectHeader 와 동일 로고 SSOT 가 data URI 로 자동 주입된다. **5개 프로젝트 로고가 에셋 패키지에 내장**돼 있으니 `\"geniet\"` 같은 텍스트·색박스 placeholder 로 두거나, 빌드 산출물에서 로고 base64 를 추출해 raw `<img src=\"data:…\">` 로 박지 말 것(회귀: 백오피스 CMS 사이드바 로고를 텍스트로 두고 base64 를 손수 추출). 사이드바 밖(어드민 온보딩 카드 등)이면 `<nds-project-logo project=\"…\">`. **React/antd 등 호스팅 앱**은 패키지를 못 가져온다는 오해 없이 `import { getProjectLogo } from \"@nudge-design/assets\"`(→ dataUri) 또는 `<ProjectLogo project=\"…\" />` 사용. 자산 경로 목록은 `get_project({ project, assetKind: 'logos' })`. (validator: `admin-sidebar-logo-not-component`.)",
      "**사이드바 아이콘 = inline SVG (이름 아님)**: `<nds-sidebar items='[...]'>` 의 각 item `icon` 필드는 **innerHTML 로 주입되는 raw SVG 마크업**이다. `\"icon\":\"CashwalkBizGnbBannerIcon\"` 처럼 **아이콘 이름/컴포넌트명을 넣으면 그대로 텍스트로 렌더**된다(라벨 옆에 글자로 흘러나옴). 올바른 절차: `find_icon({ name })` → 반환된 inline SVG 문자열을 `icon` 에 넣는다. `icon` 은 React `<Sidebar>` 의 `icon?: ReactNode` 와 대칭 — HTML 은 SVG 문자열, React 는 엘리먼트. **HTML 목업이라 사이드바가 라벨 전용이라는 건 사실이 아니다**(런타임 한계 아님). `items` 는 JSON 속성이므로 SVG 안의 `\"` 는 `\\\"` 로 이스케이프할 것."
    ],
    "avoid": [
      "`<style>` 안에 `.page { display: grid; grid-template-columns: 240px 1fr }` 직접 정의 — `class=\"nds-shell\"` 사용",
      "`<style>` 안에 `.section { background: ...; border: 1px solid ...; border-radius: 12px }` 정의 — `class=\"nds-section\"` 사용",
      "`<style>` 안에 `.topbar { position: sticky; top: 0; }` 정의 — `class=\"nds-shell__topbar\"` 사용",
      "`<style>` 안에 `.form-row { display: grid; grid-template-columns: 140px 1fr }` 정의 — `class=\"nds-form-row\"` 사용",
      "nds-section 안에 다시 `.aside { ... border-radius: ... }` 별도 카드 정의 — nds-section 한 번 더 중첩이 올바름",
      "nds-shell__content 의 grid-template-columns 를 인라인 style 또는 새 클래스로 덮어쓰기 — `--nds-shell-aside-width` CSS 변수만 사용",
      "nds-form-row__label 폰트/색을 다시 정의 — semantic 토큰 의도 깨짐. 폭만 바꾸려면 `--nds-form-row-label-width`",
      "어드민 페이지 1개 안에서 nds-shell 클래스 + raw shell CSS 혼용 (drift 보장)",
      "raw `<header>` / `<main>` / `<aside>` 만 사용하고 nds-shell 클래스 미부여 — landmark 의미는 그대로 두되 클래스로 visual contract 보장",
      "nds-sidebar item `icon` 에 아이콘 이름(`\"CashwalkBizGnbBannerIcon\"`)을 넣기 — innerHTML 이라 텍스트로 흘러나옴. find_icon 의 inline SVG 문자열을 넣을 것",
      "아이콘이 안 박힌다고 사이드바를 라벨 전용으로 두고 'HTML 런타임 한계'로 결론내리기 — icon=inline SVG 로 정상 렌더됨",
      "사이드바/톱바 로고를 텍스트('geniet')·색박스나 빌드에서 추출한 수동 base64 `<img data:…>` 로 손수 박기 — `<nds-sidebar project>` 자동 주입 또는 `<nds-project-logo project>` 사용(로고는 에셋 패키지에 data URI 로 내장)"
    ]
  },
  "card-composition": {
    "name": "card-composition",
    "metrics": {
      "maxSlotsPerCard": 4,
      "maxNutritionTagChipsInSlot4": 3,
      "maxLikeOverlayPerCard": 1,
      "maxAuthorMetaPerCard": 1,
      "maxPricePairPerCard": 1,
      "promotionBadgePosition": "top-right absolute (Card.Root)",
      "likeOverlayPosition": "top-right absolute (Media slot, image overlay)",
      "rankingLeadingMedalRange": "1-3 (gold/silver/bronze) · 4+ (number + neutral subtle bg)",
      "macroBarColors": "탄=info · 단=success · 지=caution",
      "figmaNodeUrl": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=131-1769"
    },
    "summary": "Card 의 List/Thumb/Cover 3 base variant 위에 얹는 도메인 Composition 슬롯 카탈로그. 도메인 카드(헬시딜·식품 검색·식단 추천·랭킹·리뷰·커뮤니티 등)는 새 variant 를 만들지 말고 base variant + Composition 슬롯 조합으로 표현한다. Figma 출처: Zenirit Card 가이드 옆 도메인 예시 — 헬시딜 랭킹 / 음식 리뷰 / 다이어트·혈당 추천 / 지금 뜨는 한식 / 커뮤니티 게시글 / Product Panel. Card 본문 룰은 get_guide({ topic: 'component:Card' }) 와 함께 본다.",
    "rules": [
      "**Slot 1 — kcal chip**: 식품 칼로리 표시 (예: 109 kcal). Chip tinted project xs · Body 4. base variant 의 padding 안쪽, Title 직후 또는 Metadata 라인 인라인.",
      "**Slot 2 — star rating + review count**: ★ + 평점 + (리뷰 N개). Metadata 라인 좌측. 리뷰 없는 카드는 '리뷰 없음' 으로 fallback (mute color).",
      "**Slot 3 — promotion badge**: top-right absolute (Card.Root 기준). 리뷰가 없는 카드에만 노출. 같은 그리드 안에서 promotion + review 동시 노출 금지.",
      "**Slot 4 — nutrition tag chip row**: 0-3개 chip (고단백/저탄수/저지방/고나트륨/고식이섬유/저당 등). chip/nutrition/* 토큰 (success/info/warning/critical 톤). 위치는 Title 위 또는 Description 직후. 4개 이상 노출 금지.",
      "**Slot 5 — like overlay**: top-right absolute, Media 슬롯 위 (이미지 over). 'heart 아이콘 + 999+' 형태. Cover variant 의 Media 위에만, Thumb/List 사용 X.",
      "**Slot 6 — author meta**: avatar(xs 20-24) + 작성자 이름 + 작성일. Metadata 라인 또는 Description 하단. 한 카드 최대 1개.",
      "**Slot 7 — discount badge**: 큰 색 강조 칩(30% / 100% / 22%). promotion badge 와 다름 — 가격 정보와 묶여 Metadata 라인에 위치. 색은 sale project (CashwalkBiz 빨강 / Geniet mint600). 1줄에 1개.",
      "**Slot 8 — strikethrough price + sale price**: 정가(취소선 + mute) + 할인가(Bold + Strong). discount badge 와 같은 라인에 정렬. 가격 표시는 카드당 1쌍.",
      "**Slot 9 — shipping chip**: '무료배송' 같은 정책 라벨. ghost/line variant · neutral color. Metadata 라인 우측 또는 가격 라인 하단.",
      "**Slot 10 — certification chip**: '식약처 인증 제품' 같은 신뢰성 라벨. success/info color · ghost variant · check icon prefix. Status 슬롯 또는 Metadata 라인 하단.",
      "**Slot 11 — ranking leading**: 1/2/3 등은 gold/silver/bronze medal 아이콘, 4+ 는 큰 숫자 + neutral subtle bg. Leading 슬롯 (List variant 의 좌측). 트렌딩/랭킹 카드 전용.",
      "**Slot 12 — macro nutrition bar**: 탄/단/지 비율 가로 progress bar (3색 분할: 탄=project info, 단=project success, 지=project caution). 라벨은 % 와 함께. Cover/Thumb 의 Description 하단 또는 Footer.",
      "**Slot 13 — category banner header**: Card 상단 4px 색 라인 + 카테고리 라벨 (다이어트/혈당/저당 등). 같은 그리드 안에서 카테고리별로 색이 다름 (info/caution/critical). Cover/Thumb 의 Media 위 또는 별도 헤더 라인.",
      "**Slot 14 — friend social proof**: avatar(xs) + 'N명이 먹어봤어요' 같은 카운트 라벨. Footer 슬롯 또는 Description 하단. 신뢰감/추천 의도 카드에만.",
      "**Slot 15 — trending count**: '최근 7일간 100만+' 같은 시계열 활동 카운트. Caption · Strong. Metadata 라인 하단. 랭킹 카드의 핵심 정보로 사용.",
      "**Slot 16 — forum meta row**: 조회 N · 댓글 N · 시간 (' · ' 구분자). Caption · Mute. 커뮤니티/게시글 카드의 Metadata 라인 전용.",
      "**조합 규칙**: 한 카드의 Composition slot 총합 최대 4개. 5개 이상은 위계 무너짐 → base variant 자체를 바꾸거나 정보 우선순위 재고.",
      "**한 그리드 룰**: 한 그리드(예: 4-up Cover) 안의 모든 카드는 같은 Composition 슬롯 조합을 사용. 일부만 슬롯이 다른 카드는 위반 (정보 누락처럼 보임). 슬롯이 비면 visually hidden 으로 자리만 유지."
    ],
    "avoid": [
      "Composition 슬롯 추가를 이유로 새 variant 생성 — variant 는 항상 3종(List/Thumb/Cover) 유지, 도메인 차이는 슬롯 조합으로",
      "Slot 5(like) + Slot 3(promotion) 동시 노출 — 둘 다 top-right absolute 라 겹침",
      "Slot 4(nutrition tag) 4개 이상 — 위계 붕괴",
      "Slot 8(price) strikethrough 없이 sale price 만 — 할인 컨텍스트 누락",
      "Slot 11(ranking leading) 을 1-3 medal 없이 number 로만 표시 — 시각 위계가 안 잡힘",
      "한 그리드에서 카드마다 다른 Composition 조합 사용 — 정보 누락처럼 보이는 안티패턴",
      "Composition 슬롯 안에 별도 CTA 버튼 두기 — Card.Root clickable 만 사용",
      "promotion badge 위치를 top-right 외에 두기 — 절대 위치 규칙 위반",
      "Slot 13(category banner)을 같은 카테고리 카드에 다른 색으로 적용 — 의미 매핑이 일관되지 않음"
    ]
  },
  "card-section": {
    "name": "card-section",
    "metrics": {
      "containerBorder": "1px (semantic-border-normal-default)",
      "containerRadius": "12-16px (--shape-md / --shape-lg)",
      "containerBgToken": "var(--semantic-bg-surface-default)",
      "headerTitleType": "H4 Bold (또는 Body 1 Bold)",
      "headerSubType": "Caption Regular Muted (우측 정렬)",
      "innerRowVariant": "thumb only",
      "innerRowMaxCount": "10 (이상은 페이지네이션 필수)",
      "paginationThreshold": 6,
      "maxNestingLevel": 1,
      "figmaNodeUrl": "https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=337-1506"
    },
    "summary": "Section/Group Card 패턴 — 카드 안에 list rows 를 담는 컨테이너 카드. 단일 Card 가 아니라 '관련 row 묶음 + 섹션 제목 + 페이지네이션' 을 한 번에 포장하는 구조. Figma 출처: Zenirit Card 가이드의 'Background+Border+Shadow' 명세 (예: '루테인 포함 영양제 · 총 84개 제품').",
    "rules": [
      "**구조**: 외곽 컨테이너(border 1px + radius 12-16 + bg surface) → 헤더(섹션 타이틀 + 보조 정보, 예: '총 84개 제품') → 내부 row 리스트(보통 Thumb variant ListItem 5-6개) → 페이지네이션 (선택).",
      "**컨테이너 vs 단일 Card**: Section Card 는 Card 가 아니라 'Card-of-Cards' 컨테이너. variant prop 으로 표현하지 말고, 별도 `<Card.Root variant='section'>` 또는 `<Section bordered>` 형태로 분리.",
      "**내부 row 제약**: 내부에 들어가는 row 는 Thumb variant 의 단순 형태만 (썸네일 + Title + Meta). 다른 variant 혼용 금지.",
      "**Composition 제약**: Section Card 안의 row 는 Composition 슬롯을 4개 모두 사용하지 않음. Title + Star rating + Review count 정도까지만. 위계 충돌 방지.",
      "**헤더 라인**: 섹션 타이틀(H4 Bold) + 보조 정보(Caption Regular Muted, 우측 정렬). 헤더 line-height 24px 고정.",
      "**페이지네이션**: 6개 이상이면 하단 페이지네이션 추가. 6개 이하면 페이지네이션 없이 그대로.",
      "**중첩 금지**: Section Card 안에 또 다른 Section Card 금지. 카테고리 그룹이 필요하면 Section Card 를 형제 노드로 나란히 둠.",
      "**Card 가이드 권위 룰과 정합**: Card 단일 가이드의 'Nested Card 금지' 룰을 Section 컨테이너만 예외 — Section 은 row 를 담는 컨테이너지 row 자체가 Card 가 아님 (그래서 위반 아님)."
    ],
    "avoid": [
      "Section Card 안에 또 다른 Section Card (3중 중첩)",
      "내부 row 마다 elevation/border 추가 — Section 컨테이너가 이미 경계 표시",
      "내부에 List/Cover variant row 혼합 — Thumb only",
      "Section 헤더에 CTA 버튼 추가 — '더보기' 가 필요하면 페이지네이션 또는 별도 하단 TextButton",
      "내부 row 가 1-2개뿐인 Section Card — 컨테이너 의미 없음, 직접 row 노출",
      "단일 1회성 메시지 그룹을 Section Card 로 포장 — Banner/Notice 가 적절"
    ]
  },
  "cashwalk-biz-action-pattern": {
    "name": "cashwalk-biz-action-pattern",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3993-965 (캐포비 Action 패턴)",
        "caption": "AddButton 3변형(Dashed '+ 지역 추가' / Primary '+ 새 퀴즈 등록' / Soft '+ 옵션 추가') + FilterBar 우측 끝 [+ 퀴즈 등록하기] 노란 Primary 1개(좌측 DateInput 2 + 검색). 텍스트 전부 '+ 명사'."
      },
      {
        "verdict": "bad",
        "source": "잘못된 액션 배치",
        "caption": "FilterBar 에 [등록][Export][설정] 3개 나열 + '+ 추가하기' 동사형 중복 + Dashed 를 페이지 메인 CTA 로 — Action 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 4023-1128 / pattern 3993-965)",
      "composition": "AddButton 3변형(Dashed/Primary/Soft) + FilterBar 우측 Primary CTA 1개",
      "addButtonVariants": "Dashed(빈 자리·1px 점선·흰 배경) / Primary(페이지 진입·Solid #FFD100) / Soft(인라인·Soft/Neutral Medium)",
      "addButtonSize": "Button Medium (44h)",
      "addButtonTextFormat": "'+ 명사' (동사형 + '+' 중복 금지)",
      "filterBarCta": "우측 끝 Solid/Primary 노랑 #FFD100 1개 · 좌측 DateInput 2 + TextInput 검색",
      "filterBarBox": "패딩 상하 12 / 좌우 16 · bg surface-soft · radius 8",
      "ctaPlacement": "FilterBar 우측 끝 (layoutSizingHorizontal=FILL spacer)",
      "maxFilterBarActions": 1,
      "narrowViewport": "텍스트 숨기고 [+] 아이콘만",
      "secondaryActions": "FilterBar 금지 — 상단 메뉴 / 행별 / 액션 칩으로 분산",
      "validatePrdMapping": "+명사 강제 · 진입=Solid/Primary · 빈 슬롯=Dashed · 인라인=Soft/Neutral · FilterBar 액션 1개",
      "relatedPatterns": "cashwalk-biz-page-patterns, cashwalk-biz-page-list, cashwalk-biz-selection-pattern, cashwalk-biz-button, action-row"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3993-965",
    "references": [
      {
        "label": "캐포비 Action 패턴 SSOT (Figma 3993-965)",
        "image": "references/cashwalk-biz-action-pattern-3993-965.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3993-965",
        "caption": "AddButton 3변형 + FilterBar 우측 Primary CTA + 안티패턴 + 결정 트리 + Do/Don't. metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 Action docs (Figma 4023-1128)",
        "image": "references/cashwalk-biz-action-docs-4023-1128.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1128",
        "caption": "언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **Action 패턴 (#06)** — 어드민 화면에 자주 등장하는 '추가/등록' 액션의 표준 배치·문구. AddButton 3변형(Dashed 빈 자리 · Primary 페이지 진입 · Soft 인라인 추가) + FilterBar 우측 Primary CTA 1개. **페이지 패턴이 아니라 액션 규칙** — List/Form 등 어느 페이지 패턴 위에도 얹힌다. 버튼 실측은 `pattern:cashwalk-biz-button`, 오버뷰 `pattern:cashwalk-biz-page-patterns`. 대량/계층 선택의 진입 버튼은 `pattern:cashwalk-biz-selection-pattern`. Figma docs 4023-1128 / pattern 3993-965 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '등록 / 추가 / 새로 만들기' 키워드가 있거나, 리스트 페이지 FilterBar 우측에 메인 액션 1개가 필요하거나, SelectedItemsPanel 같은 '빈 슬롯' 에 항목을 추가할 수 있어야 할 때.",
      "**AddButton 은 3변형 — 맥락으로 고른다 (결정 트리 Q1)**: ① **Dashed (추가 자리)** = 1px 점선 테두리 + 흰 배경, '+ 지역 추가' 처럼 SelectedItemsPanel 등 '비어있는 추가 자리' 를 표현(⚠ 전용 컴포넌트 미생성 — 현재는 합성, 추후 전용 컴포넌트 권장). ② **Primary (페이지·플로우 진입)** = Solid/Primary 캐포비 노랑(#FFD100), '+ 새 퀴즈 등록' 같은 메인 진입 CTA → 실제 Button 인스턴스. ③ **Soft (인라인 추가)** = Soft/Neutral Medium, 리스트 마지막 행 '[+ 옵션 추가]' 같은 작은 인라인 추가 → 실제 Button 인스턴스.",
      "**텍스트는 항상 '+ 명사' 형식**: '+ 지역 추가 / + 카테고리 추가 / + 이미지 추가'. ⚠ 동사형('추가하기')과 '+' 를 동시에 쓰지 않는다 — '+ 추가하기' 는 의미 중복. 명사형으로 강제.",
      "**AddButton 크기**: Button Medium (44h) 권장 (`pattern:cashwalk-biz-button`).",
      "**FilterBar Primary CTA — 우측 끝 1개만**: 리스트 페이지 FilterBar 우측 끝에 주 액션 1개를 둘 수 있다. 페이지에서 가장 빈번한 액션 1개('+ 퀴즈 등록하기', '+ 새 메시지')를 필터·검색과 같은 라인에 둬 도달성을 높인다. 색 = Solid/Primary 노랑(#FFD100). 좌측 영역 = DateInput 2개 + TextInput(검색) 실제 컴포넌트 인스턴스. CTA 는 우측 끝, `layoutSizingHorizontal=FILL` spacer 로 밀어낸다.",
      "**FilterBar 박스**: 패딩 상하 12 / 좌우 16, 배경 `surface-soft`, radius 8.",
      "**좁은 화면**: 폭이 좁아지면 CTA 텍스트를 숨기고 아이콘만 노출([+] floating).",
      "**안티패턴 (하드)**: FilterBar 에 액션 버튼 2개 이상 나열 금지 — 시각 위계가 깨지고 클릭 망설임을 유발한다. 보조 액션(Export·Delete·Setting 등)은 FilterBar 에 두지 말고 페이지 상단 메뉴 / 행별 액션 / 검색 결과 위 액션 칩으로 분산. CTA 없는 페이지는 FilterBar 를 필터·검색만으로 깨끗하게 둔다.",
      "**Validate (PRD → 컴포넌트 매핑)**: ① 텍스트가 '+ 명사' 형식인가 → 명사형 강제. ② 페이지·플로우 진입 액션 → Button Solid/Primary. ③ 빈 슬롯에 추가 → Dashed AddButton(전용 컴포넌트 추후 권장). ④ 리스트 마지막 행 인라인 → Button Soft/Neutral. ⑤ FilterBar 우측 액션은 1개만."
    ],
    "avoid": [
      "AddButton 텍스트에 '+' 와 동사 동시 사용 ('+ 추가하기') — 의미 중복, '+ 명사' 로",
      "FilterBar 에 액션 버튼 2개 이상 나열 — 보조 액션은 상단 메뉴/행별/액션 칩으로 분산",
      "Dashed AddButton 을 페이지 메인 CTA 로 사용 (위계 약함 — 메인 진입은 Primary)",
      "Primary AddButton 을 인라인 추가에 사용 (시각 과잉 — 인라인은 Soft/Neutral)",
      "리스트 행별 액션을 FilterBar 로 모으기",
      "Secondary 액션(Export·Delete·Setting)을 FilterBar 우측에 두기"
    ]
  },
  "cashwalk-biz-admin-alert-banner": {
    "name": "cashwalk-biz-admin-alert-banner",
    "metrics": {
      "placement": "본문 최상단(페이지 헤더 아래·탭/FilterBar 위) · 페이지당 1개 · 조건부 노출",
      "box": "bg --semantic-bg-brand-subtle(#FFF4C0) · radius 16 · padding 20/24 · no shadow/border",
      "illustration": "@nudge-design/assets charge-alert-bell(종) · 60×60",
      "title": "Bold 18/30 #383838",
      "description": "Medium 16/24 #383838",
      "cta": "우측 단일 Solid/Primary(노란 #FFD200 + 검정) pill — cashwalk-biz-button SSOT",
      "relatedPatterns": "cashwalk-biz-page-list, cashwalk-biz-page-form, cashwalk-biz-button, cashwalk-biz-page-patterns"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-21374",
    "summary": "캐시워크 포 비즈니스 admin **광고비/충전 안내 배너** — 페이지 본문 상단(페이지 헤더 아래)에 얹는 soft 옐로우 알림 카드. 구성: 좌측 일러스트(@nudge-design/assets `charge-alert-bell`) + 제목/설명 + 우측 단일 CTA(노란 pill). NoticeAlert(48px 인라인 strip)·Banner(우측 이미지)·FloatingCtaBanner(하단 sticky pill)와 구분 — 일러스트 동반 멀티라인 안내 카드. Figma 3001-21374.",
    "rules": [
      "**언제 쓰나**: 잔액 소진 임박 등 계정/광고 상태에 대한 능동 안내 + 즉시 행동(충전) 유도가 필요할 때. 단순 정책 안내는 page-form 의 02b 안내 콜아웃(info) 또는 NoticeAlert.",
      "**배치**: 리스트/폼 페이지 본문 최상단(페이지 헤더 아래, 탭/FilterBar 위). 페이지당 1개. 상시 노출이 아니라 조건 충족 시(잔액 임박)에만.",
      "**박스**: bg `--semantic-bg-brand-subtle`(soft 옐로우 #FFF4C0 계열) · radius **16** · padding 20/24 · 그림자·보더 없음 · 그라데이션 금지.",
      "**좌측 일러스트**: `@nudge-design/assets` 의 `charge-alert-bell`(종) — 표시 크기 60×60. 라인 아이콘으로 대체하지 말 것(일러스트 자산).",
      "**텍스트**: 제목 Bold **18/30** `--semantic-text-strong`(#383838) + 설명 Medium **16/24** 동일 계열. 제목에 개수/금액을 직접 박지 말고 본문에서 서술.",
      "**CTA**: 우측 단일 버튼 = cashwalk-biz **Solid/Primary(노란 #FFD200 + 검정 텍스트) · pill** (`pattern:cashwalk-biz-button` SSOT 그대로). 검정/파랑/outlined 로 바꾸지 말 것 · 버튼 2개 이상 금지(단일 행동)."
    ],
    "avoid": [
      "라인 아이콘으로 종 일러스트 대체 — 일러스트 자산(charge-alert-bell) 사용",
      "NoticeAlert(48px strip)로 제목+설명+CTA 욱여넣기 — 멀티라인 안내 카드는 별물",
      "CTA 를 검정/파랑/outlined 로 — 충전 같은 주 행동은 노란 Solid/Primary pill",
      "배너를 페이지에 여러 개 쌓기 / 상시 노출 — 조건 충족 시 1개",
      "그라데이션 배경 — 단색 project-subtle 토큰만"
    ]
  },
  "cashwalk-biz-admin-sidebar": {
    "name": "cashwalk-biz-admin-sidebar",
    "metrics": {
      "status": "ready-made (메뉴 라벨/구조는 오버레이 기반 best-effort — Figma 3304:617 미검증)",
      "sectionCount": 3,
      "sections": "광고 관리 / 자산 관리 / 계정 관리",
      "width": "300px (캐포비 admin 기준)",
      "gnbIcons": "CashwalkBizGnbBannerIcon, CashwalkBizGnbChannelIcon, CashwalkBizGnbQuizIcon, CashwalkBizGnbChatIcon, CashwalkBizGnbCashIcon, CashwalkBizGnbCatalogIcon, CashwalkBizGnbMemberIcon, CashwalkBizGnbEditIcon, CashwalkBizGnbSettingIcon",
      "iconPickup": "HTML 예시는 SVG 인라인 완료 — find_icon 반복 불필요 / React 는 아이콘 컴포넌트 직접 import",
      "relatedGuides": "component:Sidebar (props 함정), admin-shell (shell 조립), cashwalk-biz-page-{dashboard,list,detail,form}"
    },
    "references": [
      {
        "label": "캐포비 Library Sidebar (메뉴 구조 SSOT)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3304-617",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 사이드바 레퍼런스 스크린샷",
        "image": "references/cashwalk-biz-sidebar-168-1250.png",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "**[캐포비 어드민 사이드바 ready-made]** cashwalk-biz admin LNB 를 한 번에 픽업하는 SSOT. 목업 전용 `<nds-sidebar>`(HTML, nds-project-chrome 흡수) 컴포넌트는 완성돼 있지만 ProjectHeader/Footer 와 달리 메뉴 데이터가 안 박혀 있어 매번 손조립하던 마찰을 해소한다. 헤더 블록(로고→계정→잔액→충전/내역 CTA) + 3섹션(광고 관리 / 자산 관리 / 계정 관리) + GNB 아이콘 9종이 들어간 메뉴 트리를 그대로 복붙. 활성 bg(Yellow/100)·radius(16)·텍스트색은 `data-project='cashwalk-biz'` cascade 로 자동 — 색 hex 박지 말 것. 컴포넌트 props 함정은 `get_guide({ topic:'component:Sidebar', project:'cashwalk-biz' })`, shell 조립은 `pattern:admin-shell`.",
    "rules": [
      "**먼저 이 패턴으로 사이드바를 픽업한다**: 캐포비 어드민 화면(`pattern:cashwalk-biz-page-{dashboard,list,detail,form}` 의 '01 Sidebar')은 사이드바 items 를 새로 발명하지 말고 아래 ready-made 트리를 복붙해 시작한다. 화면별로 `activeKey` 만 바꾸면 LNB 가 동일하게 유지된다(목록/상세/대시보드/폼 공통).",
      "**HTML 복붙 (목업)**: `_readyMade.html` 트리를 그대로 복붙(project= 로고 자동주입, item.icon inline SVG 완료 — find_icon 9회 불필요, items/account/footer-actions 는 `<script type=\"application/json\" slot=\"...\">` 텍스트 노드). active-key 만 변경. (공개 react `Sidebar` 컴포넌트는 제거됨 — admin 사이드바는 목업 html 전용.)",
      "**섹션 그룹은 SidebarSection[]**: items 를 flat 배열 + 빈 spacer 로 만들지 말고 `{ key, label, items: [...] }` 섹션 객체로 그룹핑(광고 관리 / 자산 관리 / 계정 관리). 라벨이 섹션 헤더로 렌더된다.",
      "**서브메뉴는 1단계까지**: '배너'처럼 children(등록/목록/리포트)을 갖는 항목만 캐럿 노출. children 안에 또 children = 금지(2단계 이상 트리 금지).",
      "**활성 표현은 면(bg)만**: 좌측 accent stripe·Bold 라벨·진한 노랑(Yellow/200) 금지. 활성 여부는 `activeKey` 로만 결정(item 에 isActive boolean 박지 말 것).",
      "**계정 블록은 구조화된 slot 으로 — 손수 div 조립 금지**: 로고 아래 고정 블록(계정 이메일→잔액(충전 금액)→충전하기(solid)/내역보기(outlined) 2-up CTA)은 `account` slot — `<nds-sidebar>` 자식 `<script type=\"application/json\" slot=\"account\">{\"email\":…,\"balanceLabel\":…,\"balance\":…,\"actions\":[{\"label\":\"충전하기\",\"variant\":\"solid\"},{\"label\":\"내역보기\",\"variant\":\"outlined\"}]}</script>`. 위 ready-made 예시에 이미 박혀 있으니 그대로 복붙. 잔액/충전을 메뉴 item 으로 섞지 말 것. (예전 가이드가 'HTML 상단 slot' 이라고만 적어 매번 누락되던 회귀를 컴포넌트 slot 으로 차단.)",
      "**로그아웃은 footer-actions slot 에 고정**: 최하단 로그아웃(outlined)은 `footer-actions` slot — `<script type=\"application/json\" slot=\"footer-actions\">[{\"label\":\"로그아웃\",\"variant\":\"outlined\"}]</script>`. 메뉴 리스트 맨 아래 item 으로 넣지 말 것 — 스크롤과 분리된 고정 푸터.",
      "**사이드바는 풀하이트 셸 안에 둔다(높이가 화면을 안 채우는 #1 원인)**: `<nds-sidebar>` 는 기본 full-height(100vh sticky)지만, body 직속이나 height 미확정 컨테이너에 두면 레이아웃이 깨지거나 높이가 안 찬다. 반드시 `.nds-shell`(grid + min-height:100vh) 안에 넣을 것. 셸까지 끼운 형태는 `_readyMade.shellHtml` 참조.",
      "**아이콘은 project-prefix 우선**: 메뉴 아이콘은 `CashwalkBizGnb*` 9종이 공용 아이콘보다 우선. import 목록: CashwalkBizGnbBannerIcon, CashwalkBizGnbChannelIcon, CashwalkBizGnbQuizIcon, CashwalkBizGnbChatIcon, CashwalkBizGnbCashIcon, CashwalkBizGnbCatalogIcon, CashwalkBizGnbMemberIcon, CashwalkBizGnbEditIcon, CashwalkBizGnbSettingIcon.",
      "**로고는 `project=\"cashwalk-biz\"` 로 자동 주입 (35KB data URI 복붙·상대경로 금지)**: 위 HTML 예시처럼 `<nds-sidebar project=\"cashwalk-biz\">` 만 두면 ProjectHeader 와 동일 로고 SSOT 가 컴포넌트 내부에서 주입돼 단일 HTML 에서도 안 깨진다. `logo-src` 에 `data:image/svg+xml;base64,…` 35KB 블롭을 손으로 붙이지 말 것 — 그 거대 블롭을 추출/재인코딩하다 한글이 깨지고 로고가 유실되던 회귀의 직접 원인이다. `/assets/project/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg` 같은 상대경로도 단일 파일에서 깨지므로 금지. React 앱은 자산을 번들하므로 `logo={{ src: '/assets/project/cashwalk-biz/logos/cashwalk-for-business-horizontal.svg' }}` public 경로로 충분.",
      "**마크업을 스크립트로 추출·재인코딩하지 말 것 — 한글 모지바케 #1 원인**: 위 HTML/React 블록은 손대지 말고 그대로 복붙한다. 특히 Python `decode('unicode_escape')` 나 Latin-1 디코딩으로 가공하면 UTF-8 한글(광고 관리 등)이 글자당 3개의 깨진 라틴 문자(Ã/ë…)로 망가지고, 깨진 items JSON 때문에 사이드바 파싱이 흔들려 로고까지 사라진다(= '한글 다 깨지고 로고 안 보임' 증상). 가공이 꼭 필요하면 UTF-8 `json.loads` 만 사용. 이 예시는 items/account/footer-actions 를 `<script type=\"application/json\" slot=\"...\">` 텍스트 노드로 전달해 따옴표 과이스케이프·인코딩 깨짐을 둘 다 구조적으로 차단한다."
    ],
    "avoid": [
      "사이드바 items 를 화면마다 새로 발명 — 이 ready-made 트리를 복붙하고 activeKey 만 변경",
      "HTML 에서 item.icon 에 아이콘 이름('CashwalkBizGnbBannerIcon')을 넣기 — innerHTML 이라 텍스트로 흘러나옴. 위 예시는 inline SVG 가 이미 박혀 있으니 그대로 사용",
      "활성 아이템에 좌측 세로 accent bar / Bold 라벨 / Yellow/200 진한 노랑",
      "잔액·충전 CTA 를 메뉴 리스트에 섞기 (헤더 블록 고정)",
      "children 2단계 이상 트리화",
      "활성 bg·radius·텍스트색을 inline/hex 로 다시 박기 — data-project cascade 가 처리"
    ],
    "_readyMade": {
      "note": "이 트리를 그대로 복붙(손대지 말 것). project= 가 로고 자동주입, items/account/footer-actions 는 <script type=\"application/json\" slot=\"...\"> 텍스트 노드라 따옴표 이스케이프·인코딩 사고가 없다. Python decode('unicode_escape')/Latin-1 로 추출·재인코딩 금지(한글 모지바케). 화면별로 active-key 만 변경.",
      "html": "<nds-sidebar project=\"cashwalk-biz\" active-key=\"banner-list\" width=\"300\">\n  <script type=\"application/json\" slot=\"account\">{\"email\":\"biz@cashwalk.io\",\"balanceLabel\":\"충전 잔액\",\"balance\":\"₩1,250,000\",\"actions\":[{\"label\":\"충전하기\",\"variant\":\"solid\",\"key\":\"charge\"},{\"label\":\"내역보기\",\"variant\":\"outlined\",\"key\":\"history\"}]}</script>\n  <script type=\"application/json\" slot=\"footer-actions\">[{\"label\":\"로그아웃\",\"variant\":\"outlined\",\"key\":\"logout\"}]</script>\n  <script type=\"application/json\" slot=\"items\">[{\"key\":\"ad\",\"label\":\"광고 관리\",\"items\":[{\"key\":\"banner\",\"label\":\"배너\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><rect x=\\\"3.75\\\" y=\\\"4.75\\\" width=\\\"16.5\\\" height=\\\"14.5\\\" rx=\\\"2.25\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><path d=\\\"M3.75 9h16.5\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><circle cx=\\\"7\\\" cy=\\\"7\\\" r=\\\"0.85\\\" fill=\\\"currentColor\\\"/></svg>\",\"children\":[{\"key\":\"banner-new\",\"label\":\"배너 등록\"},{\"key\":\"banner-list\",\"label\":\"배너 목록\"},{\"key\":\"banner-report\",\"label\":\"배너 리포트\"}]},{\"key\":\"channel\",\"label\":\"채널\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.116279 1.116279)\\\"><g id=\\\"shape\\\"><path id=\\\"Fill-1\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M15.052 13.9932H12.6979V13.2466C12.6979 10.9446 11.4585 8.9998 9.99158 8.9998V7.50676C12.127 7.50676 13.8483 9.52508 14.1871 12.2555C14.2043 12.3943 14.3236 12.5002 14.4686 12.5002H14.7686C14.9252 12.5002 15.052 12.6223 15.052 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"Fill-3\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M18.858 13.9932H16.504V13.2466C16.504 10.9446 15.2645 8.9998 13.7976 8.9998V7.50676C15.933 7.50676 17.6544 9.52508 17.9932 12.2555C18.0103 12.3943 18.1296 12.5002 18.2746 12.5002H18.5747C18.7313 12.5002 18.858 12.6223 18.858 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"Fill-6\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M3.90814 13.9932H2.64185V11.4784H3.4166C4.49736 11.4784 5.41065 10.0014 5.41065 8.2532V7.50676H6.1854C8.32079 7.50676 10.0423 9.52508 10.3809 12.2555C10.3981 12.3943 10.5174 12.5002 10.6624 12.5002H10.9626C11.119 12.5002 11.246 12.6223 11.246 12.7732V13.9932H8.89177V13.2466C8.89177 11.3299 8.03267 9.66075 6.89825 9.15575C6.64853 10.9389 5.66895 12.3385 4.37215 12.8047C4.26272 12.8438 4.19152 12.9457 4.19152 13.0583V13.7202C4.19152 13.8711 4.06474 13.9932 3.90814 13.9932Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"bg\\\" d=\\\"M16.4257 0.75H5.07432C2.68607 0.75 0.75 2.68607 0.75 5.07432V16.4257C0.75 18.8139 2.68607 20.75 5.07432 20.75H16.4257C18.8139 20.75 20.75 18.8139 20.75 16.4257V5.07432C20.75 2.68607 18.8139 0.75 16.4257 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/></g></g></svg>\"},{\"key\":\"quiz\",\"label\":\"퀴즈\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1 1.069934)\\\"><g id=\\\"Group\\\"><g id=\\\"Rectangle\\\"></g><path id=\\\"bg\\\" d=\\\"M17.6757 0.75H6.32432C3.93607 0.75 2 2.98858 2 5.75V15.75C2 18.5114 3.93607 20.75 6.32432 20.75H17.6757C20.0639 20.75 22 18.5114 22 15.75V5.75C22 2.98858 20.0639 0.75 17.6757 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><path id=\\\"Shape\\\" d=\\\"M8.49166 8.94741C8.92285 6.52179 11.118 5.75 12.7644 5.75C14.4108 5.75 16.3707 6.55854 15.9395 8.98416L15.5475 11.2995C15.4324 12.0615 15.0617 12.7694 14.4892 13.3209L15.0771 14.1294C15.4691 14.6439 15.1163 15.2687 14.6068 15.5627C14.0972 15.8567 13.3132 15.82 12.9996 15.3422L12.3724 14.3867C11.9982 14.4579 11.6175 14.4949 11.2356 14.4969C9.58924 14.4969 7.62928 13.6884 8.06047 11.2628L8.49166 8.94741ZM13.7052 8.91065C13.793 8.57051 13.7033 8.21149 13.4636 7.94323C13.2239 7.67498 12.8626 7.52935 12.49 7.55084C11.6398 7.53309 10.9125 8.11985 10.8044 8.91065L10.3732 11.3363C10.308 11.6735 10.4061 12.0205 10.6409 12.2832C10.8757 12.5459 11.2228 12.6972 11.5884 12.6961C12.4164 12.6589 13.1113 12.0984 13.274 11.3363L13.7052 8.91065Z\\\" fill=\\\"currentColor\\\"/></g></g></svg>\"},{\"key\":\"message\",\"label\":\"메시지\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.0932 1.093653)\\\"><g id=\\\"Ic/bubble/line\\\"><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5059\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M6.61612 20.2175C9.08392 21.3833 11.916 21.5114 14.479 20.5733C17.042 19.6351 19.1221 17.709 20.2541 15.2255C21.5284 12.5687 21.52 9.47542 20.2313 6.82552C18.7487 3.45553 15.5608 1.1498 11.896 0.796953C8.23127 0.444109 4.66193 2.09924 2.56363 5.12447C0.465319 8.1497 0.165655 12.0727 1.78012 15.3815C1.81304 15.4501 1.82434 15.5271 1.81252 15.6023L1.10452 20.0051C1.06524 20.2509 1.14619 20.5006 1.32219 20.6767C1.4982 20.8527 1.74793 20.9336 1.99372 20.8943L6.39532 20.1851C6.47051 20.1737 6.54739 20.185 6.61612 20.2175Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"/><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5060\\\" d=\\\"M11.0057 9.62272C11.7878 9.62272 12.4217 10.2567 12.4217 11.0387C12.4217 11.8208 11.7878 12.4547 11.0057 12.4547C10.2237 12.4547 9.58972 11.8208 9.58972 11.0387C9.59038 10.257 10.224 9.62338 11.0057 9.62272Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5061\\\" d=\\\"M15.3233 9.62272C16.1054 9.62272 16.7393 10.2567 16.7393 11.0387C16.7393 11.8208 16.1054 12.4547 15.3233 12.4547C14.5413 12.4547 13.9073 11.8208 13.9073 11.0387C13.908 10.257 14.5416 9.62338 15.3233 9.62272Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5062\\\" d=\\\"M6.68812 9.62272C7.47016 9.62272 8.10412 10.2567 8.10412 11.0387C8.10412 11.8208 7.47016 12.4547 6.68812 12.4547C5.90609 12.4547 5.27212 11.8208 5.27212 11.0387C5.27278 10.257 5.90636 9.62338 6.68812 9.62272Z\\\" fill=\\\"currentColor\\\"/></g></g></svg>\"}]},{\"key\":\"asset\",\"label\":\"자산 관리\",\"items\":[{\"key\":\"cash\",\"label\":\"캐시 충전\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"9\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><path d=\\\"M12 6.5v11\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/><path d=\\\"M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 1.75 3 1.75 3 .65 3 1.75-1.34 2-3 2-3-.9-3-2\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/></svg>\"},{\"key\":\"catalog\",\"label\":\"상품 카탈로그\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.116279 1.116279)\\\"><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M15.052 13.9932H12.6979V13.2466C12.6979 10.9446 11.4585 8.9998 9.99158 8.9998V7.50676C12.127 7.50676 13.8483 9.52508 14.1871 12.2555C14.2043 12.3943 14.3236 12.5002 14.4686 12.5002H14.7686C14.9252 12.5002 15.052 12.6223 15.052 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M18.858 13.9932H16.504V13.2466C16.504 10.9446 15.2645 8.9998 13.7976 8.9998V7.50676C15.933 7.50676 17.6544 9.52508 17.9932 12.2555C18.0103 12.3943 18.1296 12.5002 18.2746 12.5002H18.5747C18.7313 12.5002 18.858 12.6223 18.858 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M3.90814 13.9932H2.64185V11.4784H3.4166C4.49736 11.4784 5.41065 10.0014 5.41065 8.2532V7.50676H6.1854C8.32079 7.50676 10.0423 9.52508 10.3809 12.2555C10.3981 12.3943 10.5174 12.5002 10.6624 12.5002H10.9626C11.119 12.5002 11.246 12.6223 11.246 12.7732V13.9932H8.89177V13.2466C8.89177 11.3299 8.03267 9.66075 6.89825 9.15575C6.64853 10.9389 5.66895 12.3385 4.37215 12.8047C4.26272 12.8438 4.19152 12.9457 4.19152 13.0583V13.7202C4.19152 13.8711 4.06474 13.9932 3.90814 13.9932Z\\\" fill=\\\"currentColor\\\"/><path d=\\\"M16.4257 0.75H5.07432C2.68607 0.75 0.75 2.68607 0.75 5.07432V16.4257C0.75 18.8139 2.68607 20.75 5.07432 20.75H16.4257C18.8139 20.75 20.75 18.8139 20.75 16.4257V5.07432C20.75 2.68607 18.8139 0.75 16.4257 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/></g></svg>\"}]},{\"key\":\"account\",\"label\":\"계정 관리\",\"items\":[{\"key\":\"member\",\"label\":\"회원\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.2 1.2)\\\"><g id=\\\"_&#234;&#178;&#169;&#235;&#166;&#172;_&#235;&#170;&#168;&#235;&#147;&#156;\\\" clip-path=\\\"url(#clip0_0_543)\\\"><path id=\\\"Vector\\\" d=\\\"M20 8.26264V8.57068C19.9102 8.80788 19.7734 9.02511 19.5719 9.11553C19.3094 9.23334 19.0211 9.2353 18.7984 9.07873C16.4863 7.45437 13.3152 7.70018 11.3102 9.68777C11.2246 10.6906 10.7809 11.5943 10.0262 12.2965C10.5844 12.5333 11.091 12.7956 11.5805 13.1353C11.9426 13.4003 12.0176 13.8857 11.7625 14.2352C11.5082 14.5839 11.0375 14.6607 10.6625 14.4039C8.24688 12.7486 5.03555 13.1244 2.99727 15.1734C2.35313 15.8208 1.88477 16.5852 1.60391 17.4522C1.52188 17.7055 1.57695 17.9571 1.7293 18.1607C1.87461 18.3556 2.10156 18.4703 2.38789 18.4707L9.13633 18.4715C9.54531 18.4715 9.8457 18.765 9.90938 19.1224C9.97852 19.5103 9.75352 19.8351 9.41133 19.9995H1.83594C0.849219 19.7342 0.166406 18.9689 0 17.9642V17.4162L0.0570313 17.1935C0.676172 14.93 2.45391 13.1193 4.64883 12.2836C3.40703 11.1113 3.01875 9.35194 3.68867 7.77377C4.30273 6.3275 5.75859 5.34114 7.38633 5.3564C8.96211 5.37128 10.4203 6.33376 11.0434 7.86027C11.5926 7.46416 12.1352 7.18117 12.7422 6.92988C11.059 5.37519 11.0324 2.78639 12.5895 1.19882C14.1668 -0.409884 16.7301 -0.398142 18.2938 1.22191C19.8313 2.81535 19.7934 5.38889 18.1102 6.93732C18.6332 7.16121 19.1082 7.4078 19.5723 7.70918C19.7895 7.85009 19.9137 8.03405 20.0004 8.26225L20 8.26264ZM15.1164 1.58906C13.7523 1.76872 12.85 3.02163 13.0348 4.33129C13.2203 5.64448 14.4313 6.56391 15.7375 6.39599C17.0613 6.22534 18.0047 5.00296 17.8289 3.67685C17.6563 2.37423 16.4684 1.41097 15.1164 1.58945V1.58906ZM7.03086 6.94593C5.66719 7.1252 4.76367 8.38085 4.95078 9.69208C5.1375 11.0017 6.34609 11.9184 7.64766 11.7533C8.97305 11.5849 9.91875 10.3622 9.74531 9.03803C9.57188 7.71388 8.38477 6.76744 7.03086 6.94593Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"Vector_2\\\" d=\\\"M20 16.1642V16.4722C19.8848 16.7967 19.6434 17.0957 19.2574 17.0969L17.0703 17.1032L17.0715 19.2176C17.0715 19.5847 16.8691 19.8513 16.5598 20.0004H16.0191C15.7113 19.8505 15.507 19.5843 15.5074 19.218L15.5086 17.1032L13.3211 17.0957C12.8844 17.0942 12.575 16.698 12.5832 16.3031C12.5918 15.8917 12.9215 15.5395 13.3594 15.5387L15.507 15.5348L15.5109 13.3851C15.5117 12.9323 15.8852 12.5953 16.3082 12.605C16.7184 12.6144 17.0691 12.944 17.0699 13.3851L17.073 15.5367L19.1406 15.5332C19.5719 15.5324 19.8777 15.768 20.0008 16.1649L20 16.1642Z\\\" fill=\\\"currentColor\\\"/></g><defs><clipPath id=\\\"clip0_0_543\\\"><rect width=\\\"20\\\" height=\\\"20\\\" fill=\\\"white\\\"/></clipPath></defs></g></svg>\"},{\"key\":\"content\",\"label\":\"콘텐츠 편집\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M17.6587 3C17.4087 3 17.1488 3.1 16.9588 3.29L15.1288 5.12L18.8788 8.87L20.7087 7.04C21.0988 6.65 21.0988 6.02 20.7087 5.63L18.3687 3.29C18.1688 3.09 17.9188 3 17.6587 3ZM14.0588 9.02L14.9787 9.94L5.91875 19H4.99875V18.08L14.0588 9.02ZM2.99875 17.25L14.0588 6.19L17.8088 9.94L6.74875 21H2.99875V17.25Z\\\" fill=\\\"currentColor\\\"/></svg>\"},{\"key\":\"setting\",\"label\":\"설정\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.371429 1.370403)\\\"><g id=\\\"ic_teamwalk_mypage_black\\\"><path id=\\\"shape\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M8.74685 9.57691C10.9707 9.57691 12.9876 10.3587 14.4462 11.6343C15.862 12.8726 16.75 14.5798 16.75 16.4729L0.750034 16.75C0.743692 14.5798 1.63165 12.8726 3.04752 11.6343C4.50611 10.3587 6.523 9.57691 8.74685 9.57691ZM8.58871 0.75C9.40516 0.75 10.1443 1.08077 10.6794 1.61556C11.2144 2.15035 11.5453 2.88916 11.5453 3.70522C11.5453 4.52128 11.2144 5.26009 10.6794 5.79488C10.1443 6.32967 9.40516 6.66044 8.58871 6.66044C7.77227 6.66044 7.03311 6.32967 6.49807 5.79488C5.96303 5.26009 5.6321 4.52128 5.6321 3.70522C5.6321 2.88916 5.96303 2.15035 6.49807 1.61556C7.03311 1.08077 7.77227 0.75 8.58871 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/></g></g></svg>\"}]}]</script>\n</nds-sidebar>",
      "shellHtml": "<div class=\"nds-shell\" data-project=\"cashwalk-biz\" data-page-pattern=\"list\" style=\"--nds-shell-sidebar-width:300px\">\n  <nds-sidebar project=\"cashwalk-biz\" active-key=\"banner-list\" width=\"300\">\n    <script type=\"application/json\" slot=\"account\">{\"email\":\"biz@cashwalk.io\",\"balanceLabel\":\"충전 잔액\",\"balance\":\"₩1,250,000\",\"actions\":[{\"label\":\"충전하기\",\"variant\":\"solid\",\"key\":\"charge\"},{\"label\":\"내역보기\",\"variant\":\"outlined\",\"key\":\"history\"}]}</script>\n    <script type=\"application/json\" slot=\"footer-actions\">[{\"label\":\"로그아웃\",\"variant\":\"outlined\",\"key\":\"logout\"}]</script>\n    <script type=\"application/json\" slot=\"items\">[{\"key\":\"ad\",\"label\":\"광고 관리\",\"items\":[{\"key\":\"banner\",\"label\":\"배너\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><rect x=\\\"3.75\\\" y=\\\"4.75\\\" width=\\\"16.5\\\" height=\\\"14.5\\\" rx=\\\"2.25\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><path d=\\\"M3.75 9h16.5\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><circle cx=\\\"7\\\" cy=\\\"7\\\" r=\\\"0.85\\\" fill=\\\"currentColor\\\"/></svg>\",\"children\":[{\"key\":\"banner-new\",\"label\":\"배너 등록\"},{\"key\":\"banner-list\",\"label\":\"배너 목록\"},{\"key\":\"banner-report\",\"label\":\"배너 리포트\"}]},{\"key\":\"channel\",\"label\":\"채널\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.116279 1.116279)\\\"><g id=\\\"shape\\\"><path id=\\\"Fill-1\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M15.052 13.9932H12.6979V13.2466C12.6979 10.9446 11.4585 8.9998 9.99158 8.9998V7.50676C12.127 7.50676 13.8483 9.52508 14.1871 12.2555C14.2043 12.3943 14.3236 12.5002 14.4686 12.5002H14.7686C14.9252 12.5002 15.052 12.6223 15.052 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"Fill-3\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M18.858 13.9932H16.504V13.2466C16.504 10.9446 15.2645 8.9998 13.7976 8.9998V7.50676C15.933 7.50676 17.6544 9.52508 17.9932 12.2555C18.0103 12.3943 18.1296 12.5002 18.2746 12.5002H18.5747C18.7313 12.5002 18.858 12.6223 18.858 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"Fill-6\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M3.90814 13.9932H2.64185V11.4784H3.4166C4.49736 11.4784 5.41065 10.0014 5.41065 8.2532V7.50676H6.1854C8.32079 7.50676 10.0423 9.52508 10.3809 12.2555C10.3981 12.3943 10.5174 12.5002 10.6624 12.5002H10.9626C11.119 12.5002 11.246 12.6223 11.246 12.7732V13.9932H8.89177V13.2466C8.89177 11.3299 8.03267 9.66075 6.89825 9.15575C6.64853 10.9389 5.66895 12.3385 4.37215 12.8047C4.26272 12.8438 4.19152 12.9457 4.19152 13.0583V13.7202C4.19152 13.8711 4.06474 13.9932 3.90814 13.9932Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"bg\\\" d=\\\"M16.4257 0.75H5.07432C2.68607 0.75 0.75 2.68607 0.75 5.07432V16.4257C0.75 18.8139 2.68607 20.75 5.07432 20.75H16.4257C18.8139 20.75 20.75 18.8139 20.75 16.4257V5.07432C20.75 2.68607 18.8139 0.75 16.4257 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/></g></g></svg>\"},{\"key\":\"quiz\",\"label\":\"퀴즈\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1 1.069934)\\\"><g id=\\\"Group\\\"><g id=\\\"Rectangle\\\"></g><path id=\\\"bg\\\" d=\\\"M17.6757 0.75H6.32432C3.93607 0.75 2 2.98858 2 5.75V15.75C2 18.5114 3.93607 20.75 6.32432 20.75H17.6757C20.0639 20.75 22 18.5114 22 15.75V5.75C22 2.98858 20.0639 0.75 17.6757 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><path id=\\\"Shape\\\" d=\\\"M8.49166 8.94741C8.92285 6.52179 11.118 5.75 12.7644 5.75C14.4108 5.75 16.3707 6.55854 15.9395 8.98416L15.5475 11.2995C15.4324 12.0615 15.0617 12.7694 14.4892 13.3209L15.0771 14.1294C15.4691 14.6439 15.1163 15.2687 14.6068 15.5627C14.0972 15.8567 13.3132 15.82 12.9996 15.3422L12.3724 14.3867C11.9982 14.4579 11.6175 14.4949 11.2356 14.4969C9.58924 14.4969 7.62928 13.6884 8.06047 11.2628L8.49166 8.94741ZM13.7052 8.91065C13.793 8.57051 13.7033 8.21149 13.4636 7.94323C13.2239 7.67498 12.8626 7.52935 12.49 7.55084C11.6398 7.53309 10.9125 8.11985 10.8044 8.91065L10.3732 11.3363C10.308 11.6735 10.4061 12.0205 10.6409 12.2832C10.8757 12.5459 11.2228 12.6972 11.5884 12.6961C12.4164 12.6589 13.1113 12.0984 13.274 11.3363L13.7052 8.91065Z\\\" fill=\\\"currentColor\\\"/></g></g></svg>\"},{\"key\":\"message\",\"label\":\"메시지\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.0932 1.093653)\\\"><g id=\\\"Ic/bubble/line\\\"><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5059\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M6.61612 20.2175C9.08392 21.3833 11.916 21.5114 14.479 20.5733C17.042 19.6351 19.1221 17.709 20.2541 15.2255C21.5284 12.5687 21.52 9.47542 20.2313 6.82552C18.7487 3.45553 15.5608 1.1498 11.896 0.796953C8.23127 0.444109 4.66193 2.09924 2.56363 5.12447C0.465319 8.1497 0.165655 12.0727 1.78012 15.3815C1.81304 15.4501 1.82434 15.5271 1.81252 15.6023L1.10452 20.0051C1.06524 20.2509 1.14619 20.5006 1.32219 20.6767C1.4982 20.8527 1.74793 20.9336 1.99372 20.8943L6.39532 20.1851C6.47051 20.1737 6.54739 20.185 6.61612 20.2175Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"/><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5060\\\" d=\\\"M11.0057 9.62272C11.7878 9.62272 12.4217 10.2567 12.4217 11.0387C12.4217 11.8208 11.7878 12.4547 11.0057 12.4547C10.2237 12.4547 9.58972 11.8208 9.58972 11.0387C9.59038 10.257 10.224 9.62338 11.0057 9.62272Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5061\\\" d=\\\"M15.3233 9.62272C16.1054 9.62272 16.7393 10.2567 16.7393 11.0387C16.7393 11.8208 16.1054 12.4547 15.3233 12.4547C14.5413 12.4547 13.9073 11.8208 13.9073 11.0387C13.908 10.257 14.5416 9.62338 15.3233 9.62272Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"&#237;&#140;&#168;&#236;&#138;&#164;_5062\\\" d=\\\"M6.68812 9.62272C7.47016 9.62272 8.10412 10.2567 8.10412 11.0387C8.10412 11.8208 7.47016 12.4547 6.68812 12.4547C5.90609 12.4547 5.27212 11.8208 5.27212 11.0387C5.27278 10.257 5.90636 9.62338 6.68812 9.62272Z\\\" fill=\\\"currentColor\\\"/></g></g></svg>\"}]},{\"key\":\"asset\",\"label\":\"자산 관리\",\"items\":[{\"key\":\"cash\",\"label\":\"캐시 충전\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><circle cx=\\\"12\\\" cy=\\\"12\\\" r=\\\"9\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/><path d=\\\"M12 6.5v11\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/><path d=\\\"M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 1.75 3 1.75 3 .65 3 1.75-1.34 2-3 2-3-.9-3-2\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\" stroke-linecap=\\\"round\\\"/></svg>\"},{\"key\":\"catalog\",\"label\":\"상품 카탈로그\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.116279 1.116279)\\\"><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M15.052 13.9932H12.6979V13.2466C12.6979 10.9446 11.4585 8.9998 9.99158 8.9998V7.50676C12.127 7.50676 13.8483 9.52508 14.1871 12.2555C14.2043 12.3943 14.3236 12.5002 14.4686 12.5002H14.7686C14.9252 12.5002 15.052 12.6223 15.052 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M18.858 13.9932H16.504V13.2466C16.504 10.9446 15.2645 8.9998 13.7976 8.9998V7.50676C15.933 7.50676 17.6544 9.52508 17.9932 12.2555C18.0103 12.3943 18.1296 12.5002 18.2746 12.5002H18.5747C18.7313 12.5002 18.858 12.6223 18.858 12.7732V13.9932Z\\\" fill=\\\"currentColor\\\"/><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M3.90814 13.9932H2.64185V11.4784H3.4166C4.49736 11.4784 5.41065 10.0014 5.41065 8.2532V7.50676H6.1854C8.32079 7.50676 10.0423 9.52508 10.3809 12.2555C10.3981 12.3943 10.5174 12.5002 10.6624 12.5002H10.9626C11.119 12.5002 11.246 12.6223 11.246 12.7732V13.9932H8.89177V13.2466C8.89177 11.3299 8.03267 9.66075 6.89825 9.15575C6.64853 10.9389 5.66895 12.3385 4.37215 12.8047C4.26272 12.8438 4.19152 12.9457 4.19152 13.0583V13.7202C4.19152 13.8711 4.06474 13.9932 3.90814 13.9932Z\\\" fill=\\\"currentColor\\\"/><path d=\\\"M16.4257 0.75H5.07432C2.68607 0.75 0.75 2.68607 0.75 5.07432V16.4257C0.75 18.8139 2.68607 20.75 5.07432 20.75H16.4257C18.8139 20.75 20.75 18.8139 20.75 16.4257V5.07432C20.75 2.68607 18.8139 0.75 16.4257 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/></g></svg>\"}]},{\"key\":\"account\",\"label\":\"계정 관리\",\"items\":[{\"key\":\"member\",\"label\":\"회원\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.2 1.2)\\\"><g id=\\\"_&#234;&#178;&#169;&#235;&#166;&#172;_&#235;&#170;&#168;&#235;&#147;&#156;\\\" clip-path=\\\"url(#clip0_0_543)\\\"><path id=\\\"Vector\\\" d=\\\"M20 8.26264V8.57068C19.9102 8.80788 19.7734 9.02511 19.5719 9.11553C19.3094 9.23334 19.0211 9.2353 18.7984 9.07873C16.4863 7.45437 13.3152 7.70018 11.3102 9.68777C11.2246 10.6906 10.7809 11.5943 10.0262 12.2965C10.5844 12.5333 11.091 12.7956 11.5805 13.1353C11.9426 13.4003 12.0176 13.8857 11.7625 14.2352C11.5082 14.5839 11.0375 14.6607 10.6625 14.4039C8.24688 12.7486 5.03555 13.1244 2.99727 15.1734C2.35313 15.8208 1.88477 16.5852 1.60391 17.4522C1.52188 17.7055 1.57695 17.9571 1.7293 18.1607C1.87461 18.3556 2.10156 18.4703 2.38789 18.4707L9.13633 18.4715C9.54531 18.4715 9.8457 18.765 9.90938 19.1224C9.97852 19.5103 9.75352 19.8351 9.41133 19.9995H1.83594C0.849219 19.7342 0.166406 18.9689 0 17.9642V17.4162L0.0570313 17.1935C0.676172 14.93 2.45391 13.1193 4.64883 12.2836C3.40703 11.1113 3.01875 9.35194 3.68867 7.77377C4.30273 6.3275 5.75859 5.34114 7.38633 5.3564C8.96211 5.37128 10.4203 6.33376 11.0434 7.86027C11.5926 7.46416 12.1352 7.18117 12.7422 6.92988C11.059 5.37519 11.0324 2.78639 12.5895 1.19882C14.1668 -0.409884 16.7301 -0.398142 18.2938 1.22191C19.8313 2.81535 19.7934 5.38889 18.1102 6.93732C18.6332 7.16121 19.1082 7.4078 19.5723 7.70918C19.7895 7.85009 19.9137 8.03405 20.0004 8.26225L20 8.26264ZM15.1164 1.58906C13.7523 1.76872 12.85 3.02163 13.0348 4.33129C13.2203 5.64448 14.4313 6.56391 15.7375 6.39599C17.0613 6.22534 18.0047 5.00296 17.8289 3.67685C17.6563 2.37423 16.4684 1.41097 15.1164 1.58945V1.58906ZM7.03086 6.94593C5.66719 7.1252 4.76367 8.38085 4.95078 9.69208C5.1375 11.0017 6.34609 11.9184 7.64766 11.7533C8.97305 11.5849 9.91875 10.3622 9.74531 9.03803C9.57188 7.71388 8.38477 6.76744 7.03086 6.94593Z\\\" fill=\\\"currentColor\\\"/><path id=\\\"Vector_2\\\" d=\\\"M20 16.1642V16.4722C19.8848 16.7967 19.6434 17.0957 19.2574 17.0969L17.0703 17.1032L17.0715 19.2176C17.0715 19.5847 16.8691 19.8513 16.5598 20.0004H16.0191C15.7113 19.8505 15.507 19.5843 15.5074 19.218L15.5086 17.1032L13.3211 17.0957C12.8844 17.0942 12.575 16.698 12.5832 16.3031C12.5918 15.8917 12.9215 15.5395 13.3594 15.5387L15.507 15.5348L15.5109 13.3851C15.5117 12.9323 15.8852 12.5953 16.3082 12.605C16.7184 12.6144 17.0691 12.944 17.0699 13.3851L17.073 15.5367L19.1406 15.5332C19.5719 15.5324 19.8777 15.768 20.0008 16.1649L20 16.1642Z\\\" fill=\\\"currentColor\\\"/></g><defs><clipPath id=\\\"clip0_0_543\\\"><rect width=\\\"20\\\" height=\\\"20\\\" fill=\\\"white\\\"/></clipPath></defs></g></svg>\"},{\"key\":\"content\",\"label\":\"콘텐츠 편집\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><path fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M17.6587 3C17.4087 3 17.1488 3.1 16.9588 3.29L15.1288 5.12L18.8788 8.87L20.7087 7.04C21.0988 6.65 21.0988 6.02 20.7087 5.63L18.3687 3.29C18.1688 3.09 17.9188 3 17.6587 3ZM14.0588 9.02L14.9787 9.94L5.91875 19H4.99875V18.08L14.0588 9.02ZM2.99875 17.25L14.0588 6.19L17.8088 9.94L6.74875 21H2.99875V17.25Z\\\" fill=\\\"currentColor\\\"/></svg>\"},{\"key\":\"setting\",\"label\":\"설정\",\"icon\":\"<svg width=\\\"24\\\" height=\\\"24\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\"><g transform=\\\"scale(1.371429 1.370403)\\\"><g id=\\\"ic_teamwalk_mypage_black\\\"><path id=\\\"shape\\\" fill-rule=\\\"evenodd\\\" clip-rule=\\\"evenodd\\\" d=\\\"M8.74685 9.57691C10.9707 9.57691 12.9876 10.3587 14.4462 11.6343C15.862 12.8726 16.75 14.5798 16.75 16.4729L0.750034 16.75C0.743692 14.5798 1.63165 12.8726 3.04752 11.6343C4.50611 10.3587 6.523 9.57691 8.74685 9.57691ZM8.58871 0.75C9.40516 0.75 10.1443 1.08077 10.6794 1.61556C11.2144 2.15035 11.5453 2.88916 11.5453 3.70522C11.5453 4.52128 11.2144 5.26009 10.6794 5.79488C10.1443 6.32967 9.40516 6.66044 8.58871 6.66044C7.77227 6.66044 7.03311 6.32967 6.49807 5.79488C5.96303 5.26009 5.6321 4.52128 5.6321 3.70522C5.6321 2.88916 5.96303 2.15035 6.49807 1.61556C7.03311 1.08077 7.77227 0.75 8.58871 0.75Z\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"1.5\\\"/></g></g></svg>\"}]}]</script>\n  </nds-sidebar>\n  <main class=\"nds-shell__main\">\n    <!-- 본문: pattern:cashwalk-biz-page-patterns 의 톱바 + 콘텐츠 골격 -->\n  </main>\n</div>"
    }
  },
  "cashwalk-biz-badge-chip": {
    "name": "cashwalk-biz-badge-chip",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20558",
    "metrics": {
      "badgeRoundedRadius": 5,
      "badgePillRadius": "full",
      "badgeFont": "Caption 12/16 Medium",
      "tones": "project · info · success · neutral · error",
      "relatedPatterns": "cashwalk-biz-tab, cashwalk-biz-input, cashwalk-biz-page-list"
    },
    "summary": "캐시워크 포 비즈니스 admin 의 Label & Chip 카탈로그 — Badge(Rounded Square / Pill) + SelectChip + ActionChip. 톤은 semantic 색으로 cascade.",
    "rules": [
      "**Badge — Rounded Square (radius 5)** = 거래/처리 동적 상태·카테고리(충전·사용·적립·만료·취소…). 데이터 테이블·리스트 셀에서 가장 빈번. 마크업: `<nds-badge variant=\"ghost\" color=\"...\">충전</nds-badge>`. 톤=의미별 semantic 색: 충전/강조=project, 사용/안내=info, 적립/완료=success, 만료/중립=neutral, 취소/실패=error.",
      "**Badge — Pill (radius full)** = 계정 유형·식별 정적 태그(일반 계정·프리미엄·신규…). 헤더/타이틀 옆 식별 표식. 마크업: `<nds-badge variant=\"ghost\" color=\"...\" style=\"--nds-badge-radius:999px\">프리미엄</nds-badge>`. 동적 상태값에는 Pill 쓰지 말 것(Rounded Square 사용).",
      "Badge 치수(radius 5 · padding 4/10 · Caption 12/16 · Medium 500)는 캐포비 프로젝트 토큰(`--nds-badge-*`)으로 cascade. `variant=\"ghost\"` + semantic `color` 만 지정하면 연한 bg + 컬러 텍스트(soft 톤)가 자동 적용된다.",
      "**SelectChip** = 선택형 칩(다중 선택 그룹, 예: 연령대 선택). DS `Chip` 의 `selected` 상태로 구현 — HTML: `<nds-chip selected>30대</nds-chip>` / `<nds-chip>30대</nds-chip>`. **출시 기본**: Selected=프로젝트 채움(solid fill, FILL_COLORS) + Bold, Default=#FAFAFA bg + #EEE border + Medium. 캐포비(cashwalk-biz)는 노랑 채움 위 가독성을 위해 selected 텍스트·체크를 **검정**으로 override 함(`--nds-chip-selected-text`). 좌측 ✓ 체크는 React `icon` prop / HTML `slot=\"icon\"`(`<nds-chip selected><svg slot=\"icon\">…</svg>30대</nds-chip>`). 'project-subtle bg' 룩이 필요하면 hex 박지 말고 `--nds-chip-selected-background/text/border` override. 채움만으로도 선택 표시는 충분.",
      "**ActionChip** = TextField helper text 영역 옆 보조 액션(예시 이미지·수정·다운로드). radius 6 / bg #ECECEC / icon 14 + 12 Medium. inline 배치(별도 row 아님). 상세는 `pattern:cashwalk-biz-input`."
    ],
    "avoid": [
      "Badge 에 hex 인라인(예: background:#FFD400) 금지 — semantic color 토큰을 잃는다. `color` prop 으로 의미 톤 지정.",
      "동적 상태(충전·사용 등)에 Pill, 정적 식별(프리미엄·신규)에 Rounded Square — 혼용 주의(가이드 명시).",
      "Badge(비액션 상태/속성)와 Chip(선택/필터 액션) 혼용 금지.",
      "Badge 라벨은 8자 안팎 — 긴 문장·CTA 금지."
    ]
  },
  "cashwalk-biz-button": {
    "name": "cashwalk-biz-button",
    "metrics": {
      "sizes": "X-Large=52 · Large=48 · Medium=44 · Small=40 · Mini=36 (px)",
      "styles": 5,
      "states": "default / hover / disabled",
      "textButtonSizes": "Large=38 / Medium=32 (px)",
      "iconButtonSizes": "X-Large=48 / Large=44 / Medium=40 / Small=32 (px)",
      "relatedPatterns": "cta-group, cashwalk-biz-input"
    },
    "summary": "캐시워크 포 비즈니스 admin 의 Button 카탈로그 — 5 스타일 × 2 shape × 5 사이즈 × 3 상태 + TextButton + IconButton.",
    "rules": [
      "5 스타일: Solid/Primary · Solid/Secondary · Weak/Secondary · Outlined/Primary · Outlined/Secondary. (※ Figma 캔버스 라벨은 'Neutral' 이지만 DS 네이밍은 'Secondary' — 동일 슬롯, color=\"secondary\" 와 정합.)",
      "2 shape: default(radius 8 · 일반 admin 폼/CTA) · pill(radius full · 모달 확인/취소·BottomCTA·격식 컨텍스트). `<Button shape=\"pill\" />` 로 지정.",
      "5 사이즈: X-Large 52px · Large 48px · Medium 44px · Small 40px · Mini 36px.",
      "Solid/Primary 는 #FFD200 배경 + 검정 텍스트(high-contrast) — 캐시워크 포 비즈니스 시그니처. 텍스트 색을 흰색으로 바꾸지 않는다.",
      "Disabled bg 는 Neutral/400 #DDDDDD + 흰 텍스트 (Solid/Primary · Solid/Secondary 공통 페어, Figma 3098:1079/3098:1121).",
      "Outlined disabled (Primary/Secondary 모두) 는 border #E7E7E7 + text #BBB.",
      "TextButton: Large(38px) / Medium(32px) × Default/Hover/Disabled.",
      "IconButton: X-Large(48) / Large(44) / Medium(40) / Small(32) × Default/Hover/Disabled. (총 12 variants)",
      "터치/마우스 타겟 ≥ 36px (Mini) — admin 데스크톱은 그래도 Medium(44) 이상 권장.",
      "Outlined/Primary 텍스트는 Yellow/700 (#FEAF01) — Outlined 텍스트가 그린 색이면 안 됨 (가이드 명시).",
      "**아이콘 색 하드코딩 금지** — `color=\"var(--semantic-icon-inverse-default)\"` 처럼 inverse/project 토큰 사용 금지. 캐시워크 포 비즈니스는 primary text 가 검정이라 흰 아이콘이 노란 배경 위에 떠 보임. `color=\"currentColor\"` 로 두어 Button 텍스트 색을 상속."
    ],
    "avoid": [
      "Solid/Primary 의 텍스트를 흰색으로 바꾸지 말 것 — 가이드 위반 + 가독성 저하.",
      "Mini 사이즈를 본문 CTA 로 사용하지 말 것 — table row inline action 같은 좁은 영역 한정."
    ]
  },
  "cashwalk-biz-form-layout": {
    "name": "cashwalk-biz-form-layout",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 290:1197 캐시워크 포 비즈니스 admin form (퀴즈 등록하기)",
        "caption": "PageTitle 32 Bold (+부제, 아래 divider 없음) → 섹션 헤딩 24 Bold (카드 밖) → 카드 padding 48×36 radius 16 → 라벨-인라인-좌측 (172px) + 필드 h-48 rounded-10 → 콘텐츠 하단 우측 정렬 [취소][저장](별도 흰 바·고정 없음)."
      },
      {
        "verdict": "bad",
        "source": "잘못된 admin form 레이아웃",
        "caption": "라벨-위 흐름 + 헤더를 박스 sticky topbar 로 감쌈 + 부제 삭제 + #FF4141 필수마커 — 모두 캐시워크 포 비즈니스 admin form 컨벤션 위반."
      }
    ],
    "metrics": {
      "pageBg": "#FAFAFA",
      "pageTitle": "Pretendard Bold 32/60 #383838",
      "pageSubtitle": "Pretendard Regular 16/24 #666 (레퍼런스에 있으면 유지 — title-only 축소 금지)",
      "pageHeaderContainer": "페이지 배경 위 (박스/sticky nds-shell__topbar 아님)",
      "titleDivider": "없음 — 타이틀/부제 아래 divider·border·hr 금지 (여백 ~76px 만)",
      "sectionHeading": "Pretendard Bold 24/30 #383838 (카드 밖 위)",
      "sectionHeadingToCardGap": "~54px",
      "cardPadding": "48px × 36px (px × py)",
      "cardRadius": "16px",
      "cardBorder": "1px #ECECEC",
      "cardShadow": "0 10px 20px rgba(102,102,102,0.05)",
      "interCardGap": "~64–80px (의미 단위 가변)",
      "labelColumnWidth": "172px",
      "fieldWidth": "Field Width 6단계 px 고정 — xs120/sm200/md304(default)/lg400/xl488/full100%. 폼 일반 입력 Medium 304, Textarea Full. 스케일 SSOT=pattern:cashwalk-biz-input.",
      "labelTypography": "Pretendard Medium 16/24 #666",
      "requiredMarker": "라벨 옆 ' *' #FC3500",
      "fieldHeight": "48px (nds-input/nds-select 동일 — 캐포비 project :root 가 --nds-input-height 48 로 cascade; size 미지정이면 자동 48. 옛 size=\"compact\"(40) 는 폐기·제거됨)",
      "fieldRadius": "10px",
      "fieldBorder": "1px #D8D8D8",
      "fieldBg": "white",
      "placeholderColor": "#999",
      "helperTypography": "Pretendard Regular 13/18 #666 (Input Typography 표준, Figma 4247:1964 · counter #999)",
      "actionBarPosition": "콘텐츠 하단 인라인 액션 (별도 흰 배경 바·sticky/fixed 고정·풀폭 상단 border 없음 · 페이지 배경 위)",
      "actionBarAlignment": "right",
      "ctaSize": "cashwalk-biz-button BottomCTA 참조 (저장=primary solid, 취소=outlined)",
      "ctaPrimary": "bg #FFD200 + 검정",
      "ctaCancel": "white + 1px #D8D8D8 + #666",
      "ctaDisabled": "bg #D8D8D8 + 흰 텍스트",
      "maxPrimarySolidPerScreen": 1,
      "validationTiming": "onBlur or submit",
      "targetingRegion": "페이지 SelectedItemsPanel → 첫 선택/추가 선택 클릭 시 selection modal(CheckboxTree + SelectedItemsPanel hide-add + full-width yellow 적용)",
      "targetingGender": "SelectionButtonGroup(전체/특정 성별) + selected Chip(남성/여성/알 수 없음). Select/Radio/CheckboxGroup/Segmented 금지.",
      "relatedPatterns": "cashwalk-biz-input, cashwalk-biz-button, cta-group"
    },
    "figmaNodeUrl": "https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/%ED%95%9C%EA%B5%AD-%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC_WEB-Dev?node-id=290-1197",
    "references": [
      {
        "label": "캐시워크 포 비즈니스 admin 폼 SSOT — 퀴즈 등록하기 (Figma 290:1197)",
        "image": "references/cashwalk-biz-form-290-1197.png",
        "caption": "캐시워크 포 비즈니스 admin 폼 페이지 SSOT 스크린샷. 본 가이드 metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐시워크 포 비즈니스 사이드바 — 광고/운영/관리 3섹션 (Figma 168:1250)",
        "image": "references/cashwalk-biz-sidebar-168-1250.png",
        "caption": "본문 좌측 LNB. 폼 페이지의 사이드바 컨텍스트.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐시워크 포 비즈니스 사이드바 — 서브메뉴 펼침 변형 (Figma 290:1593)",
        "image": "references/cashwalk-biz-sidebar-290-1593.png",
        "caption": "퀴즈 관리 sub-item 펼친 상태 (등록하기/목록/통계). 폼 진입 경로.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 admin 폼 페이지 레이아웃 — 'PageTitle 32 Bold (+부제) → 섹션 헤딩 24 Bold (카드 밖) → 카드(48×36 padding · radius 16) → 라벨-인라인-좌측 (172px 컬럼) 필드 → **콘텐츠 하단 우측 정렬 [취소][저장] 인라인 액션**(별도 흰 배경 바·sticky 고정 없음)' 표준. Figma 290:1197 (퀴즈 등록하기) 실측. 필드 단위 컴포넌트 정책은 pattern:cashwalk-biz-input, CTA 정책은 pattern:cashwalk-biz-button 과 함께 본다.",
    "rules": [
      "**페이지 컨테이너**: 사이드바(좌 300px) 우측 본문. 페이지 bg `#FAFAFA`, 콘텐츠 컬럼 폭 1491px (실측), 좌측 padding 32px.",
      "**페이지 헤더**: 좌측 정렬 — 타이틀 Pretendard **Bold 32 / lh 60** #383838 **+ (있으면) 바로 아래 부제** Pretendard Regular 16/24 #666. **레퍼런스에 부제가 있으면 반드시 유지 — title-only 로 축소 금지.** **타이틀/부제 아래에 divider(밑줄·border-bottom·hr) 를 넣지 말 것** — 헤더는 라인 없이 여백만 두고 다음 섹션으로 바로 이어진다. 타이틀/부제 아래 ~76px 여백 후 섹션 헤딩 시작. **페이지 배경 위에 얹는다 — 별도 박스/sticky `nds-shell__topbar` 로 감싸지 말 것**(topbar 박스는 list/detail/dashboard 용). 우측에는 액션 두지 말 것(액션은 콘텐츠 하단 우측 정렬 [취소][저장]).",
      "**섹션 헤딩 (카드 위 분리 노출)**: 헤딩(예: '기본 정보') 은 카드 **밖** 위에 위치 — Pretendard **Bold 24 / lh 30** #383838. 헤딩 아래 ~54px 후 카드 시작.",
      "**섹션 카드**: 카드 padding **48px × 36px**, `radius 16px`, border 1px `#ECECEC`, bg white, soft shadow `0 10px 20px rgba(102,102,102,0.05)`.",
      "**필드 레이아웃 = 라벨-인라인-좌측 (label column)** — admin 폼 가독성/정렬 위해 라벨이 필드 좌측 고정 폭. 라벨 컬럼 **172px**. 입력 필드 가로 너비는 **Field Width 6단계 스케일**(xs 120 / sm 200 / **md 304 default** / lg 400 / xl 488 / full 100%)에서 **px 고정**으로 선택 — 폼 일반 입력 = **Medium 304px**, 같은 행 input 은 같은 사이즈로 통일, Textarea 는 Full(100%). (임의 너비 ~684/228 류·hug·% 금지 — 스케일·use case 는 `pattern:cashwalk-biz-input` 의 Field Width 가 SSOT.) 라벨은 control 상단(top) 정렬 — 라벨 시작점 = 입력 시작점 (FormField left 모드, Figma 정합).",
      "**라벨 타이포**: Pretendard **Medium 16 / lh 24, #666** (text.subtle). 'strong' 색을 쓰지 않는다 — 빽빽한 폼에서 라벨은 subtle 로 둬도 위계가 명확.",
      "**필드 컴포넌트**: 높이 **48px** (`nds-input`/`nds-select` 동일 — size 미지정이면 캐포비 project :root 가 `--nds-input-height` 48 로 cascade 해 자동 정렬. **`size=\"compact\"`(40) 는 폐기·제거됐으니 admin 에 쓰지 말 것** — 단일 필드 48 과 어긋남), `radius 10px`, border 1px `#D8D8D8`, bg white, placeholder 16px #999. 검정 focus border·정확한 radius 는 `pattern:cashwalk-biz-input` 참조.",
      "**행 높이**: ~102-106px (라벨+필드+helper 포함). 라벨↔필드 ~5px, 필드↔helper ~10-14px.",
      "**Helper text**: Pretendard Regular **13 / lh 18, #666** (Input Typography 표준, Figma 4247:1964). 글자 수 카운터(`0/30`) 는 helper 와 동일 13/18 #999 우측 정렬.",
      "**필수 마커**: 라벨 옆 ` *` color **`#FC3500`** (Coral Red-Orange). 'optional' 표기 X.",
      "**액션바 = 콘텐츠 하단 우측 정렬 [취소][저장] 인라인 액션**: 폼 콘텐츠 맨 끝에 **페이지 배경 위로 우측 정렬** 배치 — **별도 흰 배경 바(`--semantic-bg-surface-default`)·풀폭 상단 border·sticky/fixed 고정을 두지 않는다.** 저장=primary solid, 취소=outlined — CTA shape/색 실측은 `pattern:cashwalk-biz-button` (BottomCTA) 가 SSOT. Disabled: `#D8D8D8` neutral.",
      "**액션 위계**: primary solid CTA 1개. 파괴(삭제) 액션은 별도 위치(헤더 우측 또는 카드 우측 상단) 분리.",
      "**선택 chip / 활성 토큰**: `bg #FFFAE2 + border #FFD200` (옅은 노란 + 노란 보더) + Bold #111. 강조 숫자/카운트는 `#FD9B02` (amber).",
      "**타겟팅 지역 선택(캐포비 한정 SSOT)**: 폼 페이지에는 `SelectedItemsPanel` 로 현재 선택 지역을 보여주고, 첫 선택/추가 선택 클릭 시에만 대형 선택 모달을 연다. 모달 본문은 좌측 `CheckboxTree`(검색 + 전체선택 + 시/도▸시/군/구) + 우측 `SelectedItemsPanel hide-add`(선택 해제 + 제거 가능한 SelectedItemRow) 조합, 푸터는 본문 풀폭 옐로우 `적용` CTA. **모달 안 우측 패널에는 '추가 선택' 버튼을 절대 두지 않는다**(HTML `hide-add`, React `onAdd` 미전달) — 모달 안에 입력 버튼이 2개처럼 보이는 회귀 방지.",
      "**타겟팅 성별 선택(캐포비 한정 SSOT)**: 성별 필드는 `SelectionButtonGroup` 으로 `전체 / 특정 성별` 을 먼저 고르고, `특정 성별` 상태에서만 selection chip 묶음(`<nds-chip selected interactive>남성</nds-chip>`, `<nds-chip selected interactive>여성</nds-chip>`, 필요 시 `알 수 없음`)을 노출한다. Select / RadioGroup / CheckboxGroup 로 대체하지 말 것 — 캐포비 타겟팅 폼에서는 입력 종류가 흔들리면 목업 품질이 가장 크게 흔들린다.",
      "**우측 보조 사이드 카드 (선택)**: 메인 필드 우측에 요약 카드 (border #ECECEC rounded-16 padding 25×32 w-406) — 미리보기/도움말.",
      "**유효성 검사**: 입력 중 에러 표시 X (onBlur/submit). 글자 수 카운터만 실시간."
    ],
    "avoid": [
      "**타이틀 아래에 라인(divider·border-bottom·hr·밑줄) 추가 — 금지.** 캐시워크 포 비즈니스 폼 헤더는 라인 없이 여백만으로 분리한다. `pattern:page-header` 의 하단 보더(rule ⑤)는 캐포비 admin 에서 켜지 말 것.",
      "라벨을 필드 위에 배치 (label-above 2단 흐름) — 캐시워크 포 비즈니스 admin 은 인라인-좌측 (172px 라벨 컬럼) 패턴.",
      "페이지 헤더 우측에 [저장] 버튼 — 하단 [취소][저장] 액션과 중복.",
      "필수 마커 색을 `#FF4141` 으로 — 캐시워크 포 비즈니스 폼은 `#FC3500` (Coral Red-Orange).",
      "Disabled CTA 를 Yellow/100 (#FFFAE5) 로 — 폼 액션바 disabled 는 `#D8D8D8` neutral gray.",
      "하단 액션을 **센터** 정렬하거나 알약 cluster 로 묶기 — 하단 [취소][저장] 은 **콘텐츠 끝 우측 정렬**이 표준(별도 흰 배경 바·sticky 고정 없이 페이지 배경 위).",
      "CTA 모양을 8px rounded 사각형 — Figma 는 56h rounded-28 알약 (pill).",
      "필드 border-radius 를 8px 로 — Figma 는 10px.",
      "필수 라벨을 project yellow 로 강조 — 노랑은 활성/선택용. 필수는 빨강-주황 별표만.",
      "캐포비 타겟팅 지역 선택을 Chip 인라인 나열/평면 CheckboxGroup/작은 팝오버로 구현 — 폼 페이지 `SelectedItemsPanel` + 대형 선택 모달(`CheckboxTree` + `SelectedItemsPanel hide-add`)이 SSOT.",
      "캐포비 타겟팅 성별 선택을 Select/RadioGroup/CheckboxGroup 로 구현 — `SelectionButtonGroup` + selected Chip 묶음이 SSOT.",
      "한 폼 안에 카드 간격 일정한 24px — Figma 는 의미 단위 64-80px 가변."
    ]
  },
  "cashwalk-biz-icon-library": {
    "name": "cashwalk-biz-icon-library",
    "metrics": {
      "totalIcons": 46,
      "categories": 6,
      "svgSyncStatus": "pending — 디자인팀에서 export 받기 전까지 공용 아이콘 fallback",
      "relatedPatterns": "iconography, cashwalk-biz-button, cashwalk-biz-input"
    },
    "summary": "캐시워크 포 비즈니스 (Cashwalk for Business) admin 전용 아이콘 라이브러리. 46 icons · 6 categories (Navigation / Action / Status / Social / GNB / Selection). 현재는 카탈로그 메타데이터만 등록되어 있고 SVG 자산은 미동기화 — 디자인팀에서 SVG export 받기 전까지 공용 @nudge-design/icons 의 매칭 아이콘으로 fallback.",
    "rules": [
      "Navigation (7): chevron-up/down/left/right, arrow-up/down/right.",
      "Action (9): close, plus, search, delete, edit, delete-circle, refresh, filter, search-delete.",
      "Status (8): info, question, caution, error, check, check-circle-on, check-circle-off, open.",
      "Social (8): like, comment, share, ripple, bubble, message-quiz, banner, calendar.",
      "GNB (8): gnb-banner, gnb-channel, gnb-chat, gnb-quiz, gnb-member, gnb-setting, gnb-cash, download.",
      "Selection (6): radio-off/on, checkbox-off/on/error/on-green. Checkbox 의 'on-green' 은 success 표시용 별도 variant.",
      "캐시워크 포 비즈니스 모드에서 project prefix 아이콘이 별도 제공되기 전까지는 공용 아이콘을 사용하되, 의미가 같은 캐시워크 포 비즈니스 카탈로그 항목을 우선 fallback 후보로 본다.",
      "동일 카테고리(Action / Status 등) 내 아이콘은 동일 weight / stroke 로 통일.",
      "Checkbox 의 error / on-green 분기는 가이드에 명시된 의미(에러 표시 / 성공 표시) 그대로 사용."
    ],
    "avoid": [
      "SVG 가 도착하기 전 임의로 다른 출처(아이콘셋, lucide 등) 아이콘을 캐시워크 포 비즈니스 화면에 섞지 말 것.",
      "공용 아이콘과 캐시워크 포 비즈니스 아이콘 의미가 충돌하면 캐시워크 포 비즈니스 admin 화면에서는 캐시워크 포 비즈니스 우선."
    ]
  },
  "cashwalk-biz-input": {
    "name": "cashwalk-biz-input",
    "metrics": {
      "components": "TextInput · TextField · Dropdown · DateInput · Textarea · Checkbox · SelectionButton · SelectionButtonGroup · ImageUpload · ActionChip · SelectedItemsPanel · FormSection",
      "defaultStates": "default / typing / error / disabled / complete",
      "focusBorder": "#111111 (Neutral/900, 검정)",
      "fieldWidth": "6단계 — xs 120 / sm 200 / md 304(default) / lg 400 / xl 488 / full 100%. DS: `sizing.fieldWidth` 토큰 + `fieldWidth` prop(Input·Select) / `field-width` 속성(nds-input·nds-select). 폼 일반=md, 모달 메인=lg, Textarea=full.",
      "relatedPatterns": "cashwalk-biz-button, dropdown, cashwalk-biz-form-layout"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3080-741",
    "summary": "캐시워크 포 비즈니스 admin 의 Input/Form 컴포넌트 카탈로그. 11 컴포넌트 · 5 상태 (Default/Typing/Error/Disabled/Complete).",
    "rules": [
      "TextInput (5 states · DS `Input`), TextField (Label+Input+Helper · DS `FormField`, 5 states), Dropdown (Default/Hover/Active/Error/Disabled + Expanded 메뉴 · DS `Select`), DateInput (5 states · DS `DatePicker`), Textarea (5 states), Checkbox (4 variants), SelectionButton(단독 · DS `SelectionButton`)/SelectionButtonGroup (선택 버튼 · FormField 교체), ImageUpload (Empty/Uploaded/Error), ActionChip (helper 옆 보조 액션), SelectedItemsPanel (선택 항목 슬롯 패널 + SelectedItemRow), FormSection (제목 + 보더 카드로 FormField 묶음 · DS `FormSection`).",
      "**FormSection** = 제목(Headline3 24 Bold) + 보더 카드(radius 16 cascade · border #EEE · 좌우 padding 24)로 여러 `FormField` 를 묶는 폼 그룹. 마크업: `<nds-form-section title=\"기본 정보\"><nds-form-field density=\"admin\" label-position=\"left\">…</nds-form-field></nds-form-section>`. 세로 리듬은 자식 `FormField density=\"admin\"`(py-24) 이 만든다 — FormSection 에 따로 py 주지 말 것. radius·색은 `data-project=\"cashwalk-biz\"` cascade.",
      "Input/Border/Focus 는 ★ Neutral/900 (#111111) 검정 — 다른 프로젝트(project 색 focus) 와 달리 캐시워크 포 비즈니스 admin 은 검정 outline.",
      "Input/BG/Disabled = Neutral/50 (#FAFAFA), Input/Border/Default = Neutral/200 (#EEEEEE).",
      "입력 타이포는 **Input Typography 표준(Figma 4247:1964 · 프로젝트 무관)** — 라벨 13/18 Medium · 값/placeholder 15/22 Regular · 헬퍼/에러 13/18 Regular. 옛 캐포비 전용 \"표준/좁은공간(14·15)\" 분기는 폐지하고 `--semantic-input-typography-*` 토큰으로 통일(캐포비도 동일 값). DateInput(DatePicker·DateRangePicker)·TimePicker 트리거는 value 토큰으로 통일. Dropdown(Select) 트리거·옵션은 옛 캐포비 dense 14/20 → 15/22 (프로젝트 폰트 override 제거, base body2 cascade). 모두 프로젝트 무관 15/22.",
      "Dropdown 선택(Selected) 항목은 ★ 회색 배경(Section #F5F5F5) + Strong 텍스트 + Medium 500 + 우측 체크 — 다른 프로젝트의 project-tint 선택과 다름. 메뉴 항목 radius 6 / inset 패딩.",
      "Checkbox 의 'on-green' SVG 가 별도 — success 표시(이미 처리 완료) 의미. 일반 checked 와 구분.",
      "ImageUpload 는 캐시워크 포 비즈니스 admin 표준 — Empty/Uploaded/Error 3 상태. user-app 의 ImageUpload 와 별도 컴포넌트로 취급.",
      "Input focus 는 project 색(노랑) 이 아니라 검정 outline. 가이드 명시.",
      "ActionChip 은 TextField 의 helper text 영역 옆에 배치 — 별도 row 가 아니라 inline. radius 6 / bg #ECECEC. **아이콘+라벨**(예시 이미지/수정/다운로드): React `icon` prop / HTML `slot=\"icon\"` 으로 14px 아이콘을 라벨 앞에 — 아이콘 없이 라벨만 두지 말 것(Figma 3종 모두 아이콘 동반).",
      "SelectedItemsPanel 헤더 = 선택 해제(기본) + 추가 선택(옵션 onAdd) — **피커 모달 안에서는 추가 선택 빼고 선택 해제만**(HTML `hide-add` / React onAdd 미전달). 추가 선택은 모달 밖에서만, secondary Button + plus 아이콘. count 는 text.project 강조. 본문은 SelectedItemRow 리스트 등으로 swap.",
      "**Field Width — 입력 필드 가로 너비 6단계 스케일** (TextInput·Dropdown·DateInput·Selection 등 모든 입력 공통, 컨테이너 안에서는 **항상 px 고정값**): XSmall **120px**(field-width-xs · 코드·짧은 ID·숫자, 예 사업자번호 토큰) · Small **200px**(field-width-sm · 단일 키워드 검색·Filter Dropdown·페이지네이션 옆 셀렉트) · **Medium 304px(field-width-md, default — 폼 내부 일반 입력 이메일·이름·계정명, 가장 흔함)** · Large **400px**(field-width-lg · 모달 내부 메인 입력·단독 검색바) · XLarge **488px**(field-width-xl · 와이드 페이지 필터·상세 폼 강조) · Full **100%**(field-width-full · Textarea·반응형 폼). 같은 행에 여러 input 이면 같은 사이즈로 통일. 관측 정규화: Dropdown 105/164/222 → Small(200)·Medium(304), 모달 명/번호 input ~396 → Large(400), '100개씩 보기' 152 → Small(200). **DS 구현**: `sizing.fieldWidth` 토큰(SSOT) + `fieldWidth` prop — React `<Input fieldWidth=\"md\">` / `<Select fieldWidth=\"sm\">`, HTML `<nds-input field-width=\"md\">` / `<nds-select field-width=\"sm\">` (xs|sm|md|lg|xl|full). 인라인 width 박지 말고 이 prop 을 쓸 것. Figma InputGuide Field Width(3897-1578)."
    ],
    "avoid": [
      "Input focus 를 노란색으로 바꾸지 말 것 — 가이드 위반.",
      "ImageUpload Error 상태에서 박스 자체를 빨갛게 칠하지 말 것 — border + helper text 로만 표현.",
      "입력 필드 너비를 미지정(%/auto/fit-content/hug)으로 두거나 임의값(281·317·396 등)으로 — **Field Width 6단계(120/200/304/400/488/100%) 중 px 고정**으로. (반응형 컨테이너의 Full 100% 만 예외.) XSmall 120 미만·내용물에 맞춘 hug(placeholder 가림) 금지."
    ]
  },
  "cashwalk-biz-page-dashboard": {
    "name": "cashwalk-biz-page-dashboard",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3612-9 (캐포비 Dashboard 패턴)",
        "caption": "Sidebar + 헤더(제목 + 기간조회/자료다운로드 Pill) + 노란 틴트 Summary Strip(인라인 지표 4종 구분선) + 라인/바 2-up 차트 카드(h360) + 항목별 통계 테이블. 카드 12/24."
      },
      {
        "verdict": "bad",
        "source": "잘못된 대시보드",
        "caption": "지표를 KPI 카드 4장 grid 로 + 차트 종류 불명 + 데이터 없을 때 빈 차트 방치 — Dashboard 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 3626-855 / pattern 3612-9)",
      "composition": "01 Sidebar → 02 Header+Actions → 03 Summary Strip → 04 Charts(2-up) → 05 Stats Table",
      "shell": "admin-shell (Sidebar 3304:617)",
      "mainAreaPadding": "48px",
      "sectionItemSpacing": "32px",
      "pageTitle": "Heading1 Bold 32/40 #111",
      "headerActions": "Pill — [기간 조회] outline + [자료 다운로드] solid yellow #FFD200",
      "summaryStrip": "인라인 지표 strip (개별 KPI 카드 미사용) · 라벨 Caption 12/16 #666 + 값 Bold · 세로 구분선 · bg Yellow/100 #FFFAE5",
      "charts": "라인 + 바 2-up (gridline·범례) · 카드 높이 360px",
      "statsTable": "헤더 행(연회색) + 데이터 행 · 숫자 우측 정렬",
      "cardRadius": "12px",
      "cardPadding": "24px",
      "cardBorder": "1px #F5F5F5 (--semantic-border-normal-subtle)",
      "cardBg": "--semantic-bg-surface-default (#FFFFFF)",
      "canvasBg": "--semantic-bg-surface-subtle (#FAFAFA)",
      "validateSummaryThreshold": "핵심 지표 ≤ 4 → Summary Strip / >4 → 별도 카드·그리드",
      "resultState": "데이터 없음 → 회색 패널 + 안내문",
      "relatedPatterns": "cashwalk-biz-page-patterns, admin-shell, dense-list"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9",
    "references": [
      {
        "label": "캐포비 Dashboard 패턴 SSOT (Figma 3612-9)",
        "image": "references/cashwalk-biz-dashboard-3612-9.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9",
        "caption": "Sidebar + 헤더 Pill + 노란 틴트 Summary Strip + 라인/바 2-up + 통계 테이블. metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 Dashboard docs (Figma 3626-855)",
        "image": "references/cashwalk-biz-dashboard-docs-3626-855.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-855",
        "caption": "언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **Dashboard 패턴** — 주요 지표·통계·차트를 한눈에 보여주는 통계/현황 화면. 구성: 01 Sidebar → 02 Page Header+Actions(Pill) → 03 Summary Strip(인라인 지표, **개별 KPI 카드 미사용**) → 04 Charts(라인+바 2-up) → 05 Stats Table. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-855 / pattern 3612-9 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '대시보드 / 메인 / 홈 / 요약 / 현황 / KPI' 키워드가 있고, 여러 데이터를 시각화해 한눈에 보여줘야 하며, 사용자가 가장 먼저 보는 진입 화면일 때.",
      "**Main Area**: admin-shell content 영역 padding **48px**, 섹션 간 itemSpacing **32px**. 섹션 순서는 위→아래로 요약→추세→상세: 02 Header → 03 Summary → 04 Charts → 05 Table.",
      "**02 Page Header + Actions**: 좌측 제목(Heading1 Bold 32/40) + 부제, 우측 **Pill 액션** — [기간 조회](outline/white pill) + [자료 다운로드](solid yellow #FFD200 pill + download 아이콘). 본문에 액션을 흩뿌리지 않고 헤더 우측에 모은다.",
      "**03 Summary Strip (개별 KPI 카드 미사용)**: 핵심 지표를 **한 줄 strip** 으로 — 좌측 상태 라벨(예: '전체 캠페인 성과' + '실시간 집계 · {갱신시각} 기준'), 우측에 지표들을 **세로 구분선으로 나눠 인라인** 배치. 각 지표 = 라벨(Caption 12/16 #666) 위, 값(Bold) 아래. strip 배경은 project 노란 틴트 `Yellow/100 (#FFFAE5)`. **KPI 마다 별도 카드를 만들지 않는다.**",
      "**04 Charts**: 차트 카드 안에 **라인 차트 + 바 차트 2-up**(좌 추이 라인 / 우 항목별 비교 바). gridline + 범례 포함. 차트 카드 높이 **360px**(기본).",
      "**05 Stats Table**: 항목별 통계 테이블 — 헤더 행(연회색 bg) + 데이터 행. 우측 정렬 숫자 컬럼(노출수/클릭수/전환율/소진액 등).",
      "**카드 규격(차트·테이블 공통)**: radius **12px**, padding **24px**, border **1px `--semantic-border-normal-subtle`(#F5F5F5)**, bg `--semantic-bg-surface-default`(#FFFFFF). 페이지 캔버스는 `--semantic-bg-surface-subtle`(#FAFAFA).",
      "**01 Sidebar**: 좌측 LNB = Sidebar 컴포넌트(Figma 3304:617) — 계정 정보 + 광고/자산/계정 관리 섹션. admin-shell 의 nds-shell__sidebar 슬롯. **items 를 새로 만들지 말고 `pattern:cashwalk-biz-admin-sidebar` 의 ready-made 트리를 복붙(아이콘 inline 완료)하고 activeKey 만 이 화면 키로.**",
      "**Validate**: ① 핵심 지표 ≤ 4개 → Summary Strip, 그 이상 → 별도 통계 카드/그리드 검토. ② Chart 종류(Line/Bar/Donut) 명시 — Chart Library 25종 참조. ③ 데이터 없음 → Empty State 변형(회색 패널 + 안내문). ④ 갱신 시각 필요 → Header(또는 Summary)에 '마지막 갱신 mm/dd hh:mm' 추가."
    ],
    "avoid": [
      "Summary 지표를 **개별 KPI 카드**(카드 4장 grid)로 — 캐포비 대시보드는 노란 틴트 인라인 strip 1개",
      "요약·차트·테이블 위계를 뒤섞어 배치",
      "헤더 Pill 액션 대신 본문 곳곳에 액션 버튼 분산",
      "차트 카드 radius/padding 을 폼 카드(16/48)와 다르게 임의 설정 — 대시보드 카드는 12/24",
      "데이터 없음 상태를 빈 차트/빈 테이블로 방치 — Empty State 패널 + 안내문",
      "차트 종류를 정의 없이 그리기 (Line/Bar/Donut 중 무엇인지 명시)"
    ]
  },
  "cashwalk-biz-page-detail": {
    "name": "cashwalk-biz-page-detail",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3614-367 (캐포비 Detail 패턴 — 여름 시즌 프로모션 상세)",
        "caption": "Breadcrumb('목록 / OO 상세', '/' divider) + 제목 + 상태칩 + 우측 액션 + Underline 탭(기본정보/성과/히스토리) + Info Card(key 240 고정 / value flex, row 16/24 border-bottom)."
      },
      {
        "verdict": "bad",
        "source": "잘못된 상세 화면",
        "caption": "Breadcrumb 없이 진입 + 상세 안에 인라인 편집 폼 + 삭제를 primary 버튼으로 확인 Modal 없이 — Detail 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 3626-978 / pattern 3614-367)",
      "composition": "01 Sidebar → 02 Breadcrumb → 03 Header+Status+Actions → 04 Tab(underline) → 05 Info Card",
      "shell": "admin-shell",
      "breadcrumb": "Body3/Subtle · divider '/' · itemSpacing 8",
      "pageHeader": "제목 Heading1 Bold 32/40 + 상태 ActionChip (gap 12) + 우측 액션 버튼",
      "tabs": "Underline (기본 정보 / 성과 / 히스토리 등)",
      "infoCardKeyWidth": "240px 고정",
      "infoCardValue": "flex",
      "keyValueRowPadding": "16/24",
      "keyValueRowBorder": "border-bottom 1px #F5F5F5 (--semantic-border-normal-subtle)",
      "deleteAction": "Outlined/Neutral · 우측 끝 · 확인 Modal 필수",
      "validateTabThreshold": "데이터 항목 > 15 → Tab 분리 (탭당 5~8)",
      "relatedPatterns": "cashwalk-biz-page-patterns, admin-shell, cashwalk-biz-page-list, cashwalk-biz-page-form, card-section"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367",
    "references": [
      {
        "label": "캐포비 Detail 패턴 SSOT — 여름 시즌 프로모션 상세 (Figma 3614-367)",
        "image": "references/cashwalk-biz-detail-3614-367.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367",
        "caption": "Breadcrumb + 제목/상태칩/액션 + Underline 탭 + key-value Info Card. metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 Detail docs (Figma 3626-978)",
        "image": "references/cashwalk-biz-detail-docs-3626-978.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-978",
        "caption": "언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **Detail 패턴** — 개별 항목의 정보를 보고 액션을 수행하는 화면. 구성: 01 Sidebar → 02 Breadcrumb → 03 페이지 헤더+Status+Actions → 04 Tab Navigation(underline) → 05 Info Card(key-value). List 에서 row 클릭 후 진입. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-978 / pattern 3614-367 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '상세 / 정보 보기 / 수정 / 편집' 키워드가 있고, List 에서 row 클릭 후 진입하며, 관련 액션(수정/삭제/실행)이 동반될 때.",
      "**02 Breadcrumb (필수)**: 상위 페이지 경로를 명시(예: '배너광고 목록 / 여름 시즌 프로모션 상세'). 타이포 Body3/Subtle, **divider '/' 문자**, itemSpacing **8px**. 상세는 항상 목록에서 진입하므로 경로 생략 금지.",
      "**03 페이지 헤더 + Status + Actions**: 좌측 제목(Heading1 Bold 32/40) + **상태 ActionChip**(title 과 gap **12px**), 우측 **액션 버튼들**(예: outline 보조 + solid 주). 삭제 같은 위험 액션은 별도 Outlined/Neutral 버튼으로 **우측 끝** 배치.",
      "**04 Tab Navigation**: **Underline 탭**(예: 기본 정보 / 성과 리포트 / 히스토리). 데이터 항목이 많으면 탭으로 분리.",
      "**05 Info Card**: 정보 블록 = **key-value rows**(또는 FormSection). **key 컬럼 width 240px 고정, value 컬럼 flex**. key-value row padding **16/24**, **border-bottom `--semantic-border-normal-subtle`(#F5F5F5)**. 카드 안 상단에 섹션 제목.",
      "**01 Sidebar**: admin-shell 의 Sidebar 컴포넌트(목록/대시보드와 동일 LNB). ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.",
      "**편집은 Form 패턴으로 분리**: 상세 화면은 보기 중심. 편집 가능 필드만 있는 화면이면 Detail 이 아니라 `pattern:cashwalk-biz-page-form` 으로 만든다. 인라인 편집 폼을 상세에 펼치지 않는다.",
      "**Validate**: ① 데이터 항목 > 15개 → Tab 으로 분리(탭당 5~8개). ② 편집 가능 필드만 있는 경우 → Form 패턴으로 변경. ③ 삭제 액션 → 별도 Outlined/Neutral 버튼, 우측 끝 배치. ④ 위험 액션(삭제) → 확인 Modal 필수 호출. ⑤ 권한별 액션 숨김 → BOOLEAN prop 또는 변형 변경."
    ],
    "avoid": [
      "Breadcrumb 생략 (상세 진입 경로 불명확) · divider 를 '>' 등으로 (캐포비는 '/' 문자)",
      "상세 화면 안에서 바로 인라인 편집 폼 펼치기 — 편집은 Form 패턴으로 분리",
      "Info Card key 컬럼을 가변 폭으로 — key 240px 고정 + value flex",
      "삭제(위험) 액션을 solid/primary 로 또는 확인 Modal 없이 즉시 실행",
      "데이터 항목 15개 초과를 한 카드에 나열 — Tab 으로 분리"
    ]
  },
  "cashwalk-biz-page-form": {
    "name": "cashwalk-biz-page-form",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3615-522 (캐포비 Form 패턴 — 다단계 광고 등록)",
        "caption": "Step Progress(캠페인→광고그룹→소재) + 상단 안내 콜아웃('캠페인이란?' info 카드 + 상품 소개서/광고 가이드 다운로드 버튼) + FormSection 반복(광고 정보/기간/예산, 섹션 gap 32) + 우측 미리보기 패널 400px + Footer(Step1 좌 목록으로/임시저장 · 우 다음 단계 solid, 상단 border, sticky)."
      },
      {
        "verdict": "bad",
        "source": "잘못된 등록 폼",
        "caption": "단건인데 Step Progress 부착 + 입력 타입을 매핑 없이 임의 선택 + Footer 를 inline 센터로 + 필드 px 를 여기서 재정의 — Form 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 3626-1041 / pattern 3615-522)",
      "composition": "01 Sidebar → 01b Page Header(title+부제, 페이지 배경 위) → 02 Step Progress → 02b 안내 콜아웃(선택) → 03 Form Sections → 04 Summary Panel(선택) → 05 Footer Actions",
      "shell": "admin-shell",
      "stepProgress": "가로 막대 + Step N (Done/Current/Todo) · padding 32/48 · 하단 border 1px · Step≥3 필수",
      "formSectionGap": "32px (섹션 사이)",
      "twoColumn": "메인 폼(FILL) + Summary/Preview 패널 400px (선택)",
      "footer": "좌 [이전 단계]·[임시저장] / 우 [다음 단계]·[등록](Solid) · Step1 좌측은 [목록으로](이전 단계 대신) · 마지막 Step 우측 [등록] · padding 24/48 · 상단 border 1px · bg surface · 뷰포트 하단 sticky",
      "introCallout": "02b 안내 콜아웃(선택) — info 카드(`--semantic-bg-status-info` #E5F2FF · radius 12 · padding 24): 제목 + 본문 + (선택)다운로드 버튼(outlined+download). NoticeAlert(48px strip) 아님 = Card + Button",
      "fieldSpecSsot": "cashwalk-biz-form-layout (라벨 컬럼·필드 높이·필수 마커 px)",
      "prdComponentMapping": "≤40자 TextInput · >40자 Textarea · 단일≤3 SelectionButtonGroup · 단일>3 Dropdown · 다중 CheckboxGroup · ON/OFF Toggle · 날짜 DateInput · 파일 ImageUpload",
      "requiredFieldProp": "FormField required=true",
      "conditionalField": "Boolean variant 또는 컨테이너 hide",
      "relatedPatterns": "cashwalk-biz-page-patterns, cashwalk-biz-selection-pattern, cashwalk-biz-action-pattern, admin-shell, cashwalk-biz-form-layout, cashwalk-biz-input, cashwalk-biz-button, cashwalk-biz-step-progress, cashwalk-biz-tab"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522",
    "references": [
      {
        "label": "캐포비 Form 패턴 SSOT — 다단계 등록 (Figma 3615-522)",
        "image": "references/cashwalk-biz-form-pattern-3615-522.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522",
        "caption": "Step Progress + FormSection 반복 + 우측 미리보기 패널 + 좌/우 분리 Footer. metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 Form docs — PRD→컴포넌트 매핑 포함 (Figma 3626-1041)",
        "image": "references/cashwalk-biz-form-docs-3626-1041.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-1041",
        "caption": "언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **Form 패턴** — 다단계 입력으로 새 항목을 등록하는 화면. 구성: 01 Sidebar → 01b Page Header(title+부제, 페이지 배경 위) → 02 Step Progress → 02b 안내 콜아웃(선택) → 03 Form Sections(FormSection 반복) → 04 Summary/Preview Panel(선택, 우측 400px) → 05 Footer Actions. **필드 단위 실측(라벨 컬럼·필드 높이·필수 마커 등)은 `pattern:cashwalk-biz-form-layout` 이 SSOT** — 이 패턴은 페이지 조립(Step/섹션/요약/Footer) + **PRD→컴포넌트 매핑**을 정의. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-1041 / pattern 3615-522 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '등록 / 만들기 / 생성 / 신규 / Step' 키워드가 있고, 여러 정책 옵션을 단계별로 설정하거나 '캠페인 → 광고 → 소재'처럼 계층 구조를 등록할 때. **단건(한 화면, Step Progress 없음) 폼이면 이 page-form 이 아니라 `pattern:cashwalk-biz-form-layout` 이 페이지 SSOT** — 이름이 비슷하니 주의: 단건=form-layout, 다단계=page-form.",
      "**01b Page Header**: 좌측 타이틀 Bold 32 **+ (있으면) 부제 16/24 #666**. **타이틀/부제 아래에 divider(라인·border-bottom·hr) 를 넣지 말 것** — 여백만으로 다음 영역과 분리한다. **페이지 배경 위에 얹는다 — 박스 sticky `nds-shell__topbar` 로 감싸지 말 것**(topbar 박스는 list/detail/dashboard 용). 상세 px 는 `pattern:cashwalk-biz-form-layout` 의 페이지 헤더 참조(여기서 중복 정의 X).",
      "**02 Step Progress**: 가로 막대 + Step N 라벨(Done / Current / Todo 상태). 다단계 등록일 때 사용 — Step ≥ 3 이면 필수. 영역 padding **32/48**, 하단 **border 1px**. 단건이면 생략.",
      "**02b 안내 콜아웃 (선택)**: 폼 본문 위에 이 화면의 목적을 설명하는 안내 카드 — 제목(예 '캠페인이란?') + 본문 + (선택)다운로드 버튼('상품 소개서'·'광고 가이드', outlined + download 아이콘). 톤은 info(파랑 `--semantic-bg-status-info` #E5F2FF) 카드(radius 12·padding 24). **NoticeAlert(48px 인라인 strip)로 만들지 말 것** — 제목+본문+액션 버튼이 있는 멀티라인 안내는 별물(Card + 다운로드 Button). 한 화면에 1개, 폼 섹션 위에만.",
      "**03 Form Sections**: **FormSection 컴포넌트 반복** — 각 섹션 = 제목(예: '광고 정보') + 설명 + 필드 슬롯(label-좌측 + 입력 + helper). 섹션 사이 gap **32px**. 필드 슬롯의 라벨 컬럼·필드 높이·필수 마커 등 px·색은 `pattern:cashwalk-biz-form-layout` 을 그대로 따른다(여기서 중복 정의 X).",
      "**04 Summary / Preview Panel (선택)**: 메인 폼 우측 보조 패널 **400px** — 예상 성과·미리보기·입력 요약. 2컬럼 = 메인 폼(FILL) + 패널 400px. 없으면 단일 컬럼.",
      "**05 Footer Actions**: 페이지 끝 Footer — **좌측 [이전 단계]·[임시저장] / 우측 [다음 단계]·[등록](Solid)**. **Step1(이전 단계 없음)은 좌측 [이전 단계] 대신 [목록으로](outlined + 좌측 chevron) + [임시저장], Step2+ 부터 [이전 단계]. 마지막 Step 우측은 [다음 단계] 대신 [등록](Solid).** Footer 영역 padding **24/48**, 상단 **border 1px**, 배경 `--semantic-bg-surface-default`, **뷰포트 하단 sticky 고정**(폼이 길어도 항상 보이게 — 본문과 같이 스크롤되는 인라인 바 아님). (단건 폼의 inline 센터 [취소][저장] 클러스터는 `cashwalk-biz-form-layout` 참조 — 다단계는 좌/우 분리 sticky Footer.)",
      "**01 Sidebar**: admin-shell 의 Sidebar 컴포넌트. ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.",
      "**Validate — PRD → 컴포넌트 매핑(정량)**: 글자 ≤ 40 → **TextInput** / 글자 > 40 → **Textarea** / 단일 선택 ≤ 3 → **SelectionButtonGroup** / 단일 선택 > 3 → **Dropdown** / 다중 선택 → **CheckboxGroup** / ON·OFF 즉시 적용 → **Toggle** / 날짜·시간 → **DateInput** / 이미지·파일 → **ImageUpload**.",
      "**Validate — 구조**: Step ≥ 3 → Step Progress 필수 / 필수 필드 → FormField `required=true` / 조건부 노출 → Boolean variant 또는 컨테이너 hide."
    ],
    "avoid": [
      "**Page Header 타이틀 아래에 라인(divider·border-bottom·hr) 추가 — 금지.** 여백만으로 분리. `pattern:page-header` 의 하단 보더(rule ⑤)는 캐포비 admin 에서 켜지 말 것.",
      "필드 높이·라벨 컬럼·필수 마커 px 를 이 패턴에 중복 정의 (cashwalk-biz-form-layout 이 SSOT)",
      "단건 폼에 불필요한 Step Progress — Step ≥ 3 일 때만",
      "다단계 Footer 를 inline 센터 클러스터로 — 다단계는 좌(이전/임시저장)·우(다음/등록) 분리 sticky Footer + 상단 border",
      "Step1 좌측을 [이전 단계]로 — 이전 단계가 없는 첫 Step 은 [목록으로]. 마지막 Step 우측은 [다음 단계] 가 아니라 [등록]",
      "안내 콜아웃(제목+본문+다운로드 버튼)을 NoticeAlert(48px strip)로 — 멀티라인 안내 카드는 Card + 다운로드 Button(info 톤)",
      "입력 타입을 임의 선택 — PRD→컴포넌트 매핑(글자수/선택수/타입)으로 결정",
      "요약/미리보기 패널 폭을 400px 외로 임의 설정"
    ]
  },
  "cashwalk-biz-page-list": {
    "name": "cashwalk-biz-page-list",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3613-234 (캐포비 List 패턴 — 배너광고 목록)",
        "caption": "헤더(제목 + 등록하기) + FilterBar(검색·상태·기간) + 테이블(이미지·캠페인명·상태 Badge·노출수·클릭수·소진액·노출 Toggle·관리 수정/삭제) + 중앙 페이지네이션 + 페이지 사이즈 셀렉트."
      },
      {
        "verdict": "bad",
        "source": "잘못된 목록 화면",
        "caption": "상태를 색 없는 텍스트로 + 노출을 체크박스로 + 행마다 버튼 흩뿌리기 + Empty state 없이 빈 테이블 — List 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 3626-915 / pattern 3613-234)",
      "composition": "01 Sidebar → 02 Header+등록하기 → 03 FilterBar → 04 Table → 05 Pagination",
      "shell": "admin-shell",
      "pageTitle": "Heading1 Bold 32/40 #111",
      "primaryAction": "'등록하기' Primary Button (헤더 우측)",
      "filterBar": "Search Input + Dropdown 필터 + DateRange · radius 12 · padding 20/24",
      "tableRadius": "12px",
      "tableRowPadding": "16/24",
      "tableRowBorder": "1px #F5F5F5 (row 사이)",
      "tableHeaderBg": "--semantic-bg-surface-subtle (#FAFAFA)",
      "rowCells": "썸네일 + 링크 텍스트 + 상태 Badge + 숫자(우측정렬) + 노출 Toggle + 관리(수정/삭제 아이콘)",
      "statusBadge": "진행중=success · 진행예정=subtle · 종료=neutral",
      "pagination": "중앙 정렬 · 버튼 32×32 · 현재 페이지 = 검정(#111) fill + 흰 텍스트 (project yellow 아님)",
      "pageSizeSelect": "'10개씩 보기' 셀렉트 (우측)",
      "validatePaginationThreshold": "Row > 50 필수 / ≤ 10 생략",
      "validateFilterThreshold": "필터 > 4 → 패널 분리",
      "resultState": "'등록된 OOO이 없습니다' + CTA 필수",
      "relatedPatterns": "cashwalk-biz-page-patterns, cashwalk-biz-action-pattern, admin-shell, action-row, dense-list, cashwalk-biz-page-detail, cashwalk-biz-badge-chip, cashwalk-biz-tab, cashwalk-biz-admin-alert-banner"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234",
    "references": [
      {
        "label": "캐포비 List 패턴 SSOT — 배너광고 목록 (Figma 3613-234)",
        "image": "references/cashwalk-biz-list-3613-234.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234",
        "caption": "헤더 + FilterBar + 상태배지/노출토글/관리 테이블 + 페이지네이션. metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 List docs (Figma 3626-915)",
        "image": "references/cashwalk-biz-list-docs-3626-915.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-915",
        "caption": "언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **List 패턴** — 검색/필터/페이지네이션이 있는 데이터 목록 화면. 구성: 01 Sidebar → 02 페이지 헤더+Primary Action('등록하기') → 03 FilterBar → 04 Table(썸네일·상태배지·노출토글·수정/삭제) → 05 Pagination. Detail 진입 전 단계. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-915 / pattern 3613-234 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '목록 / 조회 / 검색 / 필터링 / 리포트(테이블)' 키워드가 있고, 여러 row 데이터를 비교·탐색해야 하며, Detail 화면으로 진입하기 전 단계일 때.",
      "**02 페이지 헤더 + Primary Action**: 좌측 제목(Heading1 Bold 32/40) + 부제, 우측 **'등록하기' Primary Button** 1개(cashwalk-biz Solid/Primary = 노란 #FFD200 + 검정, `pattern:cashwalk-biz-button`). 목록의 주 액션은 헤더 우측에만 둔다.",
      "**(선택) 광고비/충전 안내 배너**: 잔액 소진 임박 등 조건 충족 시 페이지 헤더 아래·탭/FilterBar 위에 `pattern:cashwalk-biz-admin-alert-banner`(soft 옐로우 + 종 일러스트 + 노란 pill CTA) 1개. 상시 노출 아님.",
      "**03 FilterBar**: 테이블 위 한 줄(`pattern:action-row`) — Search Input + Dropdown 필터(상태 등) + 기간(DateRange). 카드 형태: radius **12px**, padding **20/24**. **상태 필터(활성/정지 등)는 Dropdown 필터 또는 상태 톤 칩으로 — solid 초록(활성)/빨강(정지) 버튼 금지**(테이블 상태 Badge 색과 충돌하고, 필터 선택과 상태 표시가 혼동됨).",
      "**04 Table**: 헤더 행 + 데이터 행. 헤더 행 배경 `--semantic-bg-surface-subtle`(#FAFAFA). 카드 radius **12px**, Row padding **16/24**, Row 사이 **1px border `#F5F5F5`**. 컬럼은 균등 또는 flex.",
      "**행 셀 컴포넌트**: 썸네일(이미지 컬럼) + 핵심 텍스트(클릭 시 Detail 진입 — 링크색) + **상태 = Badge**(진행중=success/green · 진행예정=subtle · 종료=neutral gray) + 숫자 컬럼 우측 정렬 + **노출 = Toggle**(노출 on green / 미노출 off) + **관리 = 수정(pencil)·삭제(trash) 아이콘 액션**. 상태를 raw 텍스트로, 노출을 체크박스로 만들지 않는다.",
      "**펼침(트리) 리포트 행 (선택)**: 날짜별/그룹별 리포트처럼 상위 행을 펼쳐 하위(캠페인·광고) 행을 보는 표는 `nds-data-table` 의 `sub-rows-key`(React `getSubRows`) — [+]/[−] 토글 + 자식 행 들여쓰기 자동. 표 하단 합계행이 같이 필요하면 StatsTable 의 `<tr class=\"is-summary\">` 와 조합.",
      "**05 Pagination**: 중앙 정렬 페이지 번호, 버튼 **32×32**, **현재 페이지 = 검정(neutral 900 / #111) fill + 흰 텍스트**(project yellow 아님 — 노랑은 활성/선택 강조용이라 페이지네이션 현재 페이지와 시각 충돌). 우측에 페이지 사이즈 셀렉트('10개씩 보기') 배치 가능.",
      "**01 Sidebar**: admin-shell 의 Sidebar 컴포넌트(대시보드와 동일 LNB). ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.",
      "**Validate**: ① Row > 50 → 페이지네이션 필수 / ≤ 10 → 페이지네이션 생략. ② 필터 > 4개 → 필터 패널 분리(좌측 또는 상단 collapsible). ③ Row 클릭 액션 있으면 → 행 hover effect + cursor pointer. ④ Empty state 필수 → '등록된 OOO이 없습니다' + CTA. ⑤ 정렬 가능 컬럼 → Header 셀에 화살표 아이콘."
    ],
    "avoid": [
      "필터를 테이블과 떨어뜨려 본문 곳곳에 배치 — FilterBar 는 테이블 위 한 줄",
      "상태를 raw 텍스트로 (Badge 미사용), 노출 on/off 를 체크박스로 (Toggle 미사용)",
      "관리 컬럼에 수정/삭제 외 잡다한 버튼 추가",
      "헤더에 '등록하기' 외 primary 액션 여러 개",
      "Empty state 를 빈 테이블로 방치 — '등록된 OOO이 없습니다' + CTA 필수",
      "FilterBar/Table radius 를 12px 외로 · 헤더 행 배경 누락",
      "페이지네이션 현재 페이지를 project yellow fill 로 — 현재 페이지는 검정(#111) fill + 흰 텍스트",
      "상태 필터를 solid 초록(활성)/빨강(정지) 버튼으로 — Dropdown 필터 또는 상태 톤 칩. 초록/빨강 solid 는 테이블 상태 Badge 와 충돌·혼동"
    ]
  },
  "cashwalk-biz-page-onboarding": {
    "name": "cashwalk-biz-page-onboarding",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3611-2 (캐포비 Onboarding 패턴 — 로그인 / 아이디 찾기 / 비밀번호 찾기)",
        "caption": "탈색 회색 캔버스 중앙 480px 카드. 01 Logo(중앙) → 02 Form(로그인=TextInput / 찾기=RadioGroup) → 03 Primary CTA(Solid/Primary/X-Large FILL yellow) → 04 Helper(TextButton). 세 화면 동일 골격."
      },
      {
        "verdict": "bad",
        "source": "잘못된 온보딩 화면",
        "caption": "사이드바 부착 + 가변 폭 카드 + 좁은/2개 CTA + 보조 링크를 solid 버튼으로 — Onboarding 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 3626-792 / pattern 3611-2)",
      "composition": "01 Logo → 02 Form → 03 Primary CTA → 04 Helper",
      "shell": "none (비로그인 — admin-shell 미적용)",
      "cardWidth": "480px (고정)",
      "cardPadding": "48px",
      "cardRadius": "16px (--semantic-bg radius/16)",
      "cardBg": "--semantic-bg-surface-default (#FFFFFF)",
      "canvasBg": "--semantic-bg-surface-subtle (#FAFAFA)",
      "cardItemSpacing": "40px (큰 단위 그룹간)",
      "cardAlign": "vertical + horizontal center",
      "logo": "ProjectLogo 컴포넌트 — <nds-project-logo project='cashwalk-biz'> / <ProjectLogo project='cashwalk-biz' /> (중앙 정렬, height~40, data URI 내장). 전 온보딩 화면 가로형 lockup 통일 — 사이드바와 동일 로고 SSOT. (Figma 3611-2 로그인 화면은 세로형 lockup 으로 그려졌으나 DS 는 세로형 에셋이 없어 가로형으로 통일 — 의도된 divergence.)",
      "formLogin": "TextInput (ID + Password eye 토글)",
      "formFind": "RadioGroup (찾기 방법 선택 — 전화/이메일)",
      "primaryCta": "Button Solid/Primary/X-Large 가로 FILL · #FFD200 + 검정",
      "helper": "TextButton(Medium) 보조 링크",
      "validateStepThreshold": "Step ≥ 3 → Multi-step Onboarding",
      "validateFieldThreshold": "필드 > 5 → cashwalk-biz-page-form 전환",
      "maxPrimarySolidPerScreen": 1,
      "relatedPatterns": "cashwalk-biz-page-patterns, cashwalk-biz-button, cashwalk-biz-input"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2",
    "references": [
      {
        "label": "캐포비 Onboarding 패턴 SSOT — 로그인/아이디찾기/비밀번호찾기 (Figma 3611-2)",
        "image": "references/cashwalk-biz-onboarding-3611-2.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2",
        "caption": "세 인증 화면이 동일한 480px 중앙 카드 골격. 본 가이드 metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 Onboarding docs (Figma 3626-792)",
        "image": "references/cashwalk-biz-onboarding-docs-3626-792.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-792",
        "caption": "언제 사용 · 지원 화면 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **Onboarding 패턴** — 로그인 · 아이디 찾기 · 비밀번호 찾기 등 인증 진입 화면. shell(사이드바/네비) 없이 탈색 회색 캔버스 중앙에 480px 고정 카드 1개. 구성: 01 Logo → 02 Form → 03 Primary CTA → 04 Helper. 오버뷰 `pattern:cashwalk-biz-page-patterns`. CTA/입력 실측은 `pattern:cashwalk-biz-button` · `pattern:cashwalk-biz-input`. Figma docs 3626-792 / pattern 3611-2 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '로그인 / 회원가입 / 비밀번호 찾기 / 이메일 인증 / 가입 완료' 키워드가 있고, 사이드바·네비게이션 없이 단독 흐름으로 진행되며, 단일 목적 + 단일 폼 + 단일 CTA 로 구성되는 화면.",
      "**중앙 카드 1개 (shell·GNB 없음)**: 비로그인 상태라 admin-shell(사이드바/topbar) **그리고 상단 GNB/글로벌 헤더 둘 다 미적용**. 캔버스 배경 = `--semantic-bg-surface-subtle`(#FAFAFA 탈색 회색), 그 위에 카드를 **수직+수평 중앙** 정렬. ⚠️ 상단에 GNB 바(raw `<header>`/`.topbar`/`nds-header`)를 두고 로고를 텍스트(\"cashwalk for business\")로 박지 말 것 — 프로젝트 식별은 **카드 안 `<nds-project-logo>` 에셋 하나뿐**(validator `cashwalk-biz-onboarding-no-gnb` error).",
      "**카드 규격**: 폭 **480px 고정**, padding **48px**, 배경 `--semantic-bg-surface-default`(#FFFFFF), radius **16px**. 카드 내부 큰 단위 그룹(로고/폼/CTA/헬퍼) 간 간격 **40px**(itemSpacing). ⚠️ **카드 패딩을 빼면 CTA·컨텐츠가 카드 모서리에 full-bleed 로 붙는다** — full-width CTA 도 이 48px 패딩 *안에서* 카드 폭을 채워야지 모서리에 붙으면 안 됨(validator `onboarding-card-no-padding` error).",
      "⚠️ **`<nds-card>` 기본 패딩은 48 이 아니라 16px** — 온보딩 카드는 반드시 `style=\"--nds-card-padding:48px\"`(또는 `--nds-card-padding` 슬롯)로 **명시 override**. 기본값에 의존하면 패딩이 좁아 보인다(실제 회귀: 16px 로 떠 답답).",
      "⚠️ **카드 내부 커스텀 블록(소셜 로그인 버튼·구분선 등)은 `width:100%`(stretch)로 카드 폭을 채울 것** — `nds-card` 내부는 `align-items:flex-start` 라 폭을 안 주면 좌측으로 쪼그라들어 우측이 텅 빈 비대칭 레이아웃이 된다(실제 회귀). 입력/버튼은 `full-width`, 직접 만든 래퍼는 `width:100%`.",
      "**01 Logo**: 카드 상단 중앙 정렬. **ProjectLogo 컴포넌트로 박는다** — HTML `<nds-project-logo project=\"cashwalk-biz\">` / React `<ProjectLogo project=\"cashwalk-biz\" />`. 사이드바와 동일한 로고 SSOT 가 data URI 로 내장돼 단일 HTML 에서도 안 깨진다. **35KB base64 를 손으로 붙이거나 raw `<img>`/SVG 로 조립 금지**(모지바케·로고 유실 회귀의 직접 원인). 찾기 화면은 로고 아래 안내문(예: '캐시워크 for 비즈니스 계정의 아이디를 찾을 방법을 선택해 주세요.')을 둔다.",
      "**02 Form**: 로그인 화면은 **TextInput**(ID + Password, Password 는 eye 토글). 아이디/비밀번호 찾기 화면은 **RadioGroup**(찾기 방법 선택 — 전화/이메일). 입력 단위 스타일은 `pattern:cashwalk-biz-input`.",
      "**03 Primary CTA (단일 액션 화면)**: 로그인·찾기처럼 액션이 **하나뿐**인 화면은 Button **Solid / Primary / X-Large**, 가로 **FILL**(카드 폭 가득) — `<nds-button full-width>`. 캐포비 project yellow(#FFD200) + 검정 텍스트. 화면당 primary CTA 1개. ⚠️ **모달 단일버튼(우측 hug)과 혼동 금지** — 단일 액션 온보딩 CTA 는 full-width 가 하드 계약(validator `onboarding-cta-not-fullwidth` error). 모달 단일버튼은 반대로 hug 우측정렬. (`pattern:cashwalk-biz-button`)",
      "**03b Footer Nav (멀티스텝 화면)**: 가입 심사처럼 **이전/다음(제출)** 이 있는 멀티스텝은 버튼을 카드 안에 넣지 않는다 — **카드(섹션) *아래* 분리된 캔버스 행**에 둔다(흰 바·상단 border·sticky 없음, 카드와 gap). **좌측 [이전 단계]**(Outlined, hug) + **우측 [다음 단계]/[제출]**(Solid/Primary, hug, 우측정렬). 멀티스텝 푸터의 버튼은 full-width 가 아니라 **hug** (validator 가 이전버튼/Stepper 존재를 감지해 full-width 강제를 면제). **제출(다음) Primary 버튼도 카드 안에 넣지 말 것** — 카드 안 Primary solid 는 `onboarding-multistep-cta-inside-card` error(이전버튼을 텍스트 링크로 두고 제출을 카드 안 full-width 로 박는 회귀 차단). 이전버튼을 카드 안에 넣으면 `onboarding-back-button-inside-card` warn. **상단엔 진행 표시 `Stepper`**(component:Stepper, variant=bar/numbered) — `Stepper` 가 있으면 validator 가 멀티스텝으로 인식한다.",
      "**03c 본인 인증 Section (휴대폰/이메일 → 인증번호)**: 연락처 입력(전화/이메일 TextInput) → **[인증번호 전송/재전송]은 별도 full-width 검정 버튼**(`<nds-button color=\"neutral\" full-width>` — primary 노랑 아님, 인라인 버튼도 아님) → 그 아래 **인증번호 입력 = VerificationCodeInput + 우측 인라인 타이머**(인라인 확인 버튼 없음). 남은시간 타이머는 DS 컴포넌트가 아니라 앱이 합성하는 인라인 요소(캐포비 오렌지 #FD9B02). 인증 입력엔 인라인 확인 버튼을 두지 않고, 확정은 하단 [다음](primary full-width)으로 한다. raw <input> 6칸·자작 +/- 금지(`verification-manual-assembly` warn) — `nds-verification-code-input` 단일 박스 사용.",
      "**04 Helper**: 보조 링크는 **TextButton(Medium)** — 로그인 화면의 '아이디 찾기 | 비밀번호 찾기', 가입 유도 등. solid 버튼으로 만들지 않는다.",
      "**상태 분기는 같은 골격**: 로그인 / 아이디 찾기 / 비밀번호 찾기는 동일한 480px 중앙 카드 레이아웃의 변형. 화면마다 다른 골격을 만들지 않는다.",
      "**Validate**: ① 멀티스텝(이전/다음·제출) → 상단 진행 `Stepper`(component:Stepper) + 카드 아래 분리 Footer Nav(위 03b). ② Form 필드 > 5 → `pattern:cashwalk-biz-page-form` 전환 검토. ③ 외부 인증(SMS/Email) 필요 → **본인 인증 Section(위 03c)** 추가. ④ 이용약관 동의 필요 → Form 위에 CheckboxGroup 추가."
    ],
    "avoid": [
      "온보딩 카드에 사이드바/topbar(admin-shell) 부착 — 비로그인 인증 화면은 중앙 카드만",
      "상단 GNB/글로벌 헤더(raw <header>/.topbar/nds-header) 부착 + 텍스트 로고(\"cashwalk for business\") — 온보딩은 GNB 없음, 로고는 카드 안 <nds-project-logo> 에셋만 (`cashwalk-biz-onboarding-no-gnb`)",
      "카드에 패딩을 안 줘서 CTA·컨텐츠가 카드 모서리에 full-bleed 로 붙기 — 카드 padding 48px(또는 <nds-card>) 필수 (`onboarding-card-no-padding`)",
      "멀티스텝(Stepper 있음) 제출 버튼을 카드 안 full-width 로 박기 — 카드 아래 footer-nav 우측 hug 로 (`onboarding-multistep-cta-inside-card`)",
      "카드 폭을 480px 외 값으로 (고정 폭 패턴)",
      "로그인·아이디찾기·비밀번호찾기마다 다른 레이아웃 골격",
      "**단일 액션 화면**의 Primary CTA 를 카드 폭보다 좁게(hug) / 2개 이상 / outlined 로 (단, 멀티스텝은 이전+제출 footer nav 가 정상 — 위 03b)",
      "멀티스텝의 [이전 단계]/제출 버튼을 카드 *안*에 넣기 — 카드와 분리해 하단 캔버스 footer nav 로 (`onboarding-back-button-inside-card`)",
      "보조 링크(찾기·가입)를 solid 버튼으로 — TextButton(Medium) 텍스트 링크가 맞다",
      "로고를 raw `<img>`/SVG 로 조립하거나 35KB base64 를 손으로 붙이기 — `<nds-project-logo project=\"cashwalk-biz\">` / `<ProjectLogo project=\"cashwalk-biz\" />` 사용",
      "필드 6개 이상·3스텝 이상을 단일 온보딩 카드에 욱여넣기 (Validate Rule 위반 → Form/Multi-step 전환)"
    ]
  },
  "cashwalk-biz-page-patterns": {
    "name": "cashwalk-biz-page-patterns",
    "metrics": {
      "status": "skeleton — Figma 실측 대기",
      "patternCount": 5,
      "patterns": "onboarding / dashboard / list / detail / form",
      "figmaFile": "7dCJU5lNPfgcAjFPwbbLIu (📐 Page Pattern)",
      "assemblyOrder": "① 패턴 선택 → ② 섹션 구조화 → ③ 컴포넌트 조립 → ④ validate",
      "relatedPatterns": "cashwalk-biz-page-{onboarding,dashboard,list,detail,form}, cashwalk-biz-action-pattern, cashwalk-biz-selection-pattern, admin-shell, cashwalk-biz-form-layout, cashwalk-biz-button, cashwalk-biz-input, cashwalk-biz-tab, cashwalk-biz-badge-chip, cashwalk-biz-step-progress"
    },
    "references": [
      {
        "label": "Onboarding docs",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-792",
        "project": "cashwalk-biz"
      },
      {
        "label": "Onboarding pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2",
        "project": "cashwalk-biz"
      },
      {
        "label": "Dashboard docs",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-855",
        "project": "cashwalk-biz"
      },
      {
        "label": "Dashboard pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9",
        "project": "cashwalk-biz"
      },
      {
        "label": "List docs",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-915",
        "project": "cashwalk-biz"
      },
      {
        "label": "List pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234",
        "project": "cashwalk-biz"
      },
      {
        "label": "Detail docs",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-978",
        "project": "cashwalk-biz"
      },
      {
        "label": "Detail pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367",
        "project": "cashwalk-biz"
      },
      {
        "label": "Form docs",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-1041",
        "project": "cashwalk-biz"
      },
      {
        "label": "Form pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522",
        "project": "cashwalk-biz"
      },
      {
        "label": "Action docs (#06 — 페이지 패턴 아닌 액션 규칙)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1128",
        "project": "cashwalk-biz"
      },
      {
        "label": "Action pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3993-965",
        "project": "cashwalk-biz"
      },
      {
        "label": "Selection docs (#07 — 페이지 패턴 아닌 선택 규칙)",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1194",
        "project": "cashwalk-biz"
      },
      {
        "label": "Selection pattern",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3995-1036",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "**[Page Pattern System 오버뷰]** 캐시워크 포 비즈니스 어드민 화면을 5개 페이지 패턴으로 표준화 — Onboarding / Dashboard / List / Detail / Form. 개별 컴포넌트부터 쌓지 말고 'PRD → 페이지 패턴 매핑 → 섹션 구조화 → 패턴 내 반복 컴포넌트 조립' 순서로 화면을 만든다. 패턴별 상세는 `pattern:cashwalk-biz-page-{onboarding|dashboard|list|detail|form}`. 필드/CTA/입력 단위 실측은 `pattern:cashwalk-biz-form-layout` · `pattern:cashwalk-biz-button` · `pattern:cashwalk-biz-input`, shell 보일러플레이트는 `pattern:admin-shell`. Figma 7dCJU5lNPfgcAjFPwbbLIu (📐 Page Pattern).",
    "rules": [
      "**먼저 패턴을 고른다 (하드 게이트)**: 새 어드민 화면을 받으면 PRD 의 목적을 5개 패턴 중 하나로 먼저 분류한다 — 로그인/계정복구=Onboarding, 통계/요약 홈=Dashboard, 목록·검색=List, 단건 상세/탭=Detail, 등록·수정=Form. **Form 은 다시 단건/다단계로 갈린다 — 한 화면(Step Progress 없음, 제목+부제+콘텐츠 하단 우측 정렬 [취소][저장])=`cashwalk-biz-form-layout`, 다단계(캠페인→광고→소재 등 Step Progress)=`cashwalk-biz-page-form`. 이름이 비슷하니 하단 액션이 헷갈리면 단건은 콘텐츠 끝 우측 정렬 [취소][저장](별도 바·고정 없음), 다단계는 좌/우 분리 Footer.** 분류 없이 컴포넌트부터 배치하지 않는다. **이건 권고가 아니라 강제다** — surface=admin + project=cashwalk-biz 화면은 패턴 선언이 없으면 validate 가 error(`cashwalk-biz-admin-page-pattern`)로 막는다.",
      "**패턴 선언 방법**: HTML 목업은 루트에 `data-page-pattern` 마커 — 예: `<html data-project=\"cashwalk-biz\" data-page-pattern=\"list\">`(또는 body / .mockup-screen). DesignSpec 은 `screen.pagePattern` 필드에 `onboarding|dashboard|list|detail|form` 중 하나. surfaceKind=admin 은 nudge.surface 마커에서 자동 주입되니 보통 pagePattern 만 채우면 된다.",
      "**조립 순서 고정**: ① 페이지 패턴 선택 → ② 패턴의 섹션 슬롯 채우기(섹션 단위 구조화) → ③ 섹션 안 반복 컴포넌트(테이블·필터·필드·차트)를 DS 컴포넌트로 조립 → ④ validate. 역순(컴포넌트 먼저)으로 가면 패턴 일관성이 깨진다.",
      "**shell 은 공통**: 모든 패턴은 사이드바 + topbar + content 의 `admin-shell`(nds-shell 계열) 위에 얹힌다. 패턴은 content 영역의 섹션 구성만 정의한다 — raw shell CSS 재정의 금지(`pattern:admin-shell`).",
      "**한 화면 = 한 패턴**: 한 페이지에 List + Form 을 섞지 않는다. 인라인 등록이 필요하면 List 안의 모달/드로어로 Form 패턴을 띄우되, 패턴 경계는 유지한다.",
      "**필드/버튼/입력 실측은 위임**: 페이지 패턴은 '무엇이 어디에' 까지만 정의. 라벨 컬럼·필드 높이·CTA 알약 같은 px 단위는 `cashwalk-biz-form-layout` / `cashwalk-biz-button` / `cashwalk-biz-input` 가 SSOT.",
      "**페이지 패턴 위에 얹는 액션·선택 규칙(페이지 패턴 아님)**: 추가/등록 액션의 배치·문구(AddButton 3변형 + FilterBar 우측 CTA)는 `pattern:cashwalk-biz-action-pattern`, 계층/대량 항목 선택(Trigger + Modal Picker + SelectedItemsPanel)은 `pattern:cashwalk-biz-selection-pattern`. 둘 다 List/Form 등 어느 패턴 위에도 얹히는 가로 규칙이라 pagePattern 선언과 별개다."
    ],
    "avoid": [
      "패턴 분류 없이 컴포넌트부터 화면에 배치",
      "한 페이지에 두 패턴(예: 목록 + 등록 폼)을 한 흐름으로 섞기",
      "페이지 패턴 가이드 안에 필드 높이·CTA px 같은 컴포넌트 단위 실측을 중복 정의 (cashwalk-biz-* 컴포넌트 가이드가 SSOT)",
      "admin-shell 대신 raw <div class=\"page\"> + grid CSS 로 shell 직접 작성"
    ]
  },
  "cashwalk-biz-selection-pattern": {
    "name": "cashwalk-biz-selection-pattern",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 3995-1036 (캐포비 Selection 패턴 — 지역 선택)",
        "caption": "[+ 지역 추가] Trigger → 760×440 좌(검색+트리 Checkbox)/우(선택 누적 경로 + ×) Modal + [적용] → 페이지 SelectedItemsPanel('선택한 지역 48개', 카운트 노랑, 경로 행). 시/도 > 시/군/구 계층."
      },
      {
        "verdict": "bad",
        "source": "잘못된 선택 화면",
        "caption": "30개 미만 평면인데 모달로 분리 + 모달 푸터 [취소][적용][초기화] 3개 + Trigger 없이 패널만 — Selection 패턴 위반."
      }
    ],
    "metrics": {
      "status": "Figma 실측 반영 (docs 4023-1194 / pattern 3995-1036)",
      "composition": "① Trigger(Dashed AddButton) → ② Modal Picker(TreePicker) → ③ SelectedItemsPanel",
      "trigger": "Dashed AddButton '+ 지역 추가' (action-pattern Dashed 재사용 · 전용 컴포넌트 추후 권장)",
      "modalPickerSize": "760×440 (좌 380 + 우 379 · 헤더 56 · 푸터 72)",
      "modalLeft": "TextInput 검색 + 트리(Checkbox 인스턴스) · 행 48h · depth padding-left +16 · 체크박스 좌측",
      "modalRight": "선택 누적 · 행 32h · 경로 표시 + × 개별 해제 · 헤더 카운트 + 전체 해제",
      "modalFooter": "Primary [적용] 1개",
      "treeBehavior": "부모 체크=자식 전체 / 일부 자식=부모 indeterminate",
      "selectedItemsPanel": "헤더(라벨 + 카운트 #FFD100 + 전체 해제) · 행=경로 + × · 6개+ 내부 스크롤 · 0개 빈 상태 + Trigger 강조",
      "panelLocations": "페이지 내(5~30 · 지속 노출) / 모달 내 우측(30+·계층)",
      "validateCountThreshold": "< 30 평면 → Checkbox 인라인 / ≥ 30 또는 계층 → Modal Picker(TreePicker)",
      "validatePanelRule": "선택 결과 페이지 노출 → SelectedItemsPanel 필수",
      "maxModalFooterActions": 1,
      "relatedPatterns": "cashwalk-biz-page-patterns, cashwalk-biz-action-pattern, cashwalk-biz-page-form, cashwalk-biz-page-list, component:Checkbox, component:Modal, component:TextInput"
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3995-1036",
    "references": [
      {
        "label": "캐포비 Selection 패턴 SSOT — 지역 선택 (Figma 3995-1036)",
        "image": "references/cashwalk-biz-selection-pattern-3995-1036.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3995-1036",
        "caption": "Trigger + 좌우 분할 Modal Picker(트리/선택 누적) + SelectedItemsPanel + 결정 트리 + Do/Don't. metrics 는 이 노드 실측 기준.",
        "project": "cashwalk-biz"
      },
      {
        "label": "캐포비 Selection docs (Figma 4023-1194)",
        "image": "references/cashwalk-biz-selection-docs-4023-1194.png",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1194",
        "caption": "언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "캐시워크 포 비즈니스 어드민 **Selection 패턴 (#07)** — 계층/대량 항목 선택을 한 세트로 묶는 표준. **Trigger + Modal Picker(TreePicker) + SelectedItemsPanel** 3요소. 지역(시/도 > 시/군/구)·카테고리·타겟팅처럼 항목이 많거나(≥30) 계층 구조이고 선택 결과를 페이지에 지속 노출해야 할 때. 진입 버튼은 `pattern:cashwalk-biz-action-pattern` 의 Dashed AddButton 재사용. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 4023-1194 / pattern 3995-1036 실측 반영.",
    "rules": [
      "**언제 쓰나**: PRD 에 '지역 선택 / 카테고리 선택 / 타겟팅' 같은 다중 선택 키워드가 있고, 항목 수가 30개 이상이거나 계층 구조(시/도 > 시/군/구)이며, 선택 결과가 페이지 안에 지속 노출되어야 할 때.",
      "**3요소를 한 세트로 묶는다**: ① Trigger ② Modal Picker(TreePicker) ③ SelectedItemsPanel. 셋 중 하나만 떼어 쓰지 않는다(특히 Trigger 없이 패널만, 패널 없이 모달만 금지).",
      "**① Trigger**: 선택 진입점 = **Dashed AddButton 형태**('+ 지역 추가', 1px 점선 + 흰 배경 — `pattern:cashwalk-biz-action-pattern` 의 Dashed 변형 재사용). 클릭 시 Modal Picker 가 현재 선택 항목으로 초기화돼 열린다. 텍스트는 '+ 명사'('+ 지역 추가' / '+ 카테고리 추가'). ⚠ 전용 AddButton 컴포넌트 미생성 — 추후 권장.",
      "**② Modal Picker (좌·우 분할)**: 크기 **760×440** (좌측 380 + 우측 379 · 헤더 56 · 푸터 72). **좌측(≈50%)** = TextInput 검색 + 트리(각 행에 실제 Checkbox 인스턴스 · 행 **48h** · depth 별 padding-left **+16** · 체크박스 좌측). **우측(≈50%)** = 선택 누적 패널(SelectedItemsPanel 과 동일 구조 · 행 **32h** · 경로 표시 '강원도 > 강릉시' + × 개별 해제 · 헤더에 카운트 + 전체 해제). **푸터** = 우측 Primary CTA **[적용] 1개만**.",
      "**트리 동작**: 부모 체크 시 자식 모두 선택 / 일부 자식만 선택 시 부모는 **indeterminate**. [적용] 을 누르면 SelectedItemsPanel 에 반영되고 모달이 닫힌다.",
      "**③ SelectedItemsPanel**: 페이지 안에 선택 결과를 항상 보이게 누적. 헤더 = 라벨 + **선택 카운트(노란 #FFD100 강조)** + 우측 [+ 추가 선택]/[전체 해제]. 각 행 = **경로 표시** + × 개별 해제. 항목 6개 이상이면 max-height + 내부 스크롤(페이지 흐름 보호). 빈 상태(0개) = '선택한 항목 없음' + Trigger 강조. 본문은 컨텐츠 슬롯(리스트/풀/테이블 Swap).",
      "**SelectedItemsPanel 은 두 위치에서 같은 구조 공유**: 페이지 내(지속 노출 + 다른 필드와 병렬 · 다중 5~30개) / 모달 내 우측(선택 집중 · 다중 30+·계층).",
      "**Validate (PRD → 컴포넌트 매핑 · 결정 트리)**: ① 항목 < 30 + 평면 구조 → Checkbox 그룹 **인라인**(모달 불필요). ② 항목 ≥ 30 또는 계층 구조 → **Modal Picker(TreePicker)**. ③ 선택 결과가 페이지에 노출돼야 함 → **SelectedItemsPanel 필수**(모달 안에서만 보이면 생략 가능)."
    ],
    "avoid": [
      "Trigger 없이 SelectedItemsPanel 만 노출 (진입점 누락)",
      "Modal Picker 안에 또 다른 모달 중첩",
      "체크박스 인라인으로 충분(항목 < 30 + 평면)한데 모달로 분리",
      "Modal 푸터에 [취소]+[적용]+[초기화] 3개 이상 — Primary [적용] 1개만",
      "SelectedItemsPanel 행에 경로(강원도 > 강릉시) 없이 말단 이름만 표시",
      "선택 결과를 모달 닫으면 사라지게 — 페이지 지속 노출이 필요하면 SelectedItemsPanel 유지"
    ]
  },
  "cashwalk-biz-step-progress": {
    "name": "cashwalk-biz-step-progress",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20029",
    "metrics": {
      "bar": "8px · radius 6",
      "label": "스텝번호(Step N) + 제목 2단",
      "relatedPatterns": "cashwalk-biz-page-form, cashwalk-biz-tab, cashwalk-biz-page-patterns"
    },
    "summary": "캐시워크 포 비즈니스 admin 의 단계형 진행 표시 — Stepper variant=bar(가로 막대 + 스텝번호/제목 2단 라벨). 다단계 폼(캠페인→광고→소재) 진행도. (구 StepProgress 는 Stepper variant=bar 로 통합됨.)",
    "rules": [
      "마크업: `<nds-stepper variant=\"bar\" current=\"1\" steps='[{\"key\":\"c\",\"label\":\"Step 1\",\"title\":\"캠페인 만들기\"},{\"key\":\"a\",\"label\":\"Step 2\",\"title\":\"광고 만들기\"},{\"key\":\"m\",\"label\":\"Step 3\",\"title\":\"소재 만들기\"}]'></nds-stepper>`. `current` 는 0-based.",
      "각 스텝 = 막대(8px·radius 6) + 라벨(스텝번호 'Step N' + 제목). 상태: Done(idx<current)=막대 project·라벨 normal medium / Current(idx===current)=막대 project·라벨 strong bold / Upcoming(idx>current)=막대 border-normal·라벨 subtle.",
      "다단계 Form 화면(`pattern:cashwalk-biz-page-form`)의 상단 진행도로 사용 — 단건 Form(`cashwalk-biz-form-layout`)에는 진행도 없음.",
      "원형 번호형(`variant=numbered`)과 구분 — 어드민 가로 막대는 `variant=bar`."
    ],
    "avoid": [
      "막대 색을 직접 지정 금지 — Done/Current=project, Upcoming=border-normal 으로 토큰 자동 결정.",
      "단건(한 화면) 폼에 진행도 막대를 붙이지 말 것 — 다단계 흐름에만."
    ]
  },
  "cashwalk-biz-tab": {
    "name": "cashwalk-biz-tab",
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3544-206",
    "metrics": {
      "variants": "line(Underline) · chip(Box)",
      "font": "Subtitle1 16/24",
      "lineIndicator": "2px",
      "boxRadius": 10,
      "tabVsFilter": "Tab = view 전환(상호 배타·URL 경로) / Filter = 현재 view 좁히기(다중 누적·쿼리 파라미터)",
      "screenOrder": "페이지 타이틀 → Tab → FilterBar → 데이터 영역",
      "relatedComponents": "Tab, FilterBar",
      "relatedPatterns": "cashwalk-biz-step-progress, cashwalk-biz-badge-chip, cashwalk-biz-page-patterns"
    },
    "summary": "캐시워크 포 비즈니스 admin 의 Tab 카탈로그 — Underline(line) + Box(chip) 2 변형. DS `Tab` 컴포넌트로 구현, 프로젝트 색·치수는 data-project=\"cashwalk-biz\" 시 자동 cascade.",
    "rules": [
      "**Underline(line)** = 페이지 메인 카테고리·목록 필터·단계 전환. 마크업: `<nds-tab variant=\"line\" size=\"pc\" tone=\"neutral\">`. 텍스트 Subtitle1 16/24, Selected=Strong(#111) Bold + 하단 2px 검정 인디케이터, Default=Subtle(#666) Medium.",
      "**Box(chip)** = 상태/좁은 영역 필터(진행중·진행예정·종료 등). 마크업: `<nds-tab variant=\"chip\" size=\"pc\" tone=\"neutral\">`. radius 10, Selected=#111(bg-inverse) bg + 흰 텍스트 Bold, Default=#DDD(button-bg-disabled) bg + 흰 텍스트 Bold (의도된 저대비 — 가이드 명시).",
      "치수·색은 모두 캐포비 프로젝트 토큰(`--nds-tab-*`)으로 cascade — 별도 style 오버라이드 금지. `data-project=\"cashwalk-biz\"` 만 루트에 있으면 자동 적용된다.",
      "동적 상태(진행/종료)는 Box, 페이지 카테고리는 Underline — 혼용 주의. 단계형 진행 표시는 Tab 이 아니라 `pattern:cashwalk-biz-step-progress`.",
      "**Tab vs Filter — 역할이 다르다(혼동 금지).** 둘 다 데이터를 분류해 보여주지만: **Tab** = 데이터를 **상호 배타적으로 분류**(한 번에 한 view 만) → **view 자체가 바뀜** → URL **경로** 변경(`/quizzes/active → /quizzes/done`). 예: 진행중/종료/대기, 승인/반려. **Filter**(`pattern:` FilterBar) = **현재 view 안에서 조건을 점진적으로 좁히기** → 같은 view 에 **결과만 변함** → **쿼리 파라미터**로 누적(`?date=…&keyword=…`, URL 공유 시에도 필터 유지). 예: 날짜 범위·키워드·카테고리 다중.",
      "**결정 트리** — Q1. view 자체가 바뀌나(목록 전체 교체)? → YES = **Tab**. Q2. 조건을 누적해서 좁히나(다중 필터)? → YES = **Filter(FilterBar)**. Q3. 옵션 2–7개 단일 선택인가? → YES = **Radio / SelectionButtonGroup**(`get_guide` Selection Components). 그 외 = 다른 컨트롤 검토.",
      "**화면 배치 순서(페이지 패턴)** — 페이지 타이틀 → **Tab** → **FilterBar** → 데이터 영역(위→아래). Tab 으로 큰 분류를 고른 뒤 Filter 로 그 안에서 좁히는 흐름. 한 화면에 Tab 종류는 1개로 통일(Underline 또는 Box 택1), Tab 항목 수는 2–5개 권장(6개+는 메뉴/Select). Filter 항목 수 제한 없음(12개+면 별도 `[필터 더보기]` 모달)."
    ],
    "avoid": [
      "Box Default 텍스트를 회색으로 바꾸지 말 것 — 캐포비 가이드는 #DDD 위 흰 텍스트(저대비)가 의도된 스펙.",
      "Underline 인디케이터를 3px(base) 로 두지 말 것 — 캐포비는 2px. 단, 프로젝트 cascade 가 처리하므로 직접 px 박지 말 것.",
      "Tab 으로 다단계 폼 진행도(Step)를 표현하지 말 것 — Stepper variant=bar 사용.",
      "큰 분류(상호 배타적)를 Filter 로 만들지 말 것 — 예: 진행중/종료를 토글 필터로. → **Tab** 사용.",
      "조건 좁히기를 Tab 으로 만들지 말 것 — 예: 날짜 범위를 Tab 으로. → **Filter** 사용.",
      "Tab 안에 또 Tab 을 중첩하지 말 것(계층이 깊어져 길을 잃음) — Sub-section 은 Accordion 또는 Anchor.",
      "Underline Tab 과 Box Tab 을 같은 화면에서 혼용하지 말 것.",
      "FilterBar 에 Primary CTA 외 다른 액션 버튼을 여러 개 두지 말 것(CTA 는 1개만)."
    ]
  },
  "cashwalk-biz-verification": {
    "name": "cashwalk-biz-verification",
    "summary": "캐시워크 포 비즈니스(캐포비) **본인 인증(휴대폰 SMS) 폼**의 정규 조립 패턴. DS 컴포넌트가 아니라 조립 레시피다 — 이름·휴대폰번호·인증번호 받기 → (코드 전송 후) 인증번호 입력 + 남은시간 타이머 → 확정은 **하단 CTA**. 별도 \"인증하기\" 버튼을 두지 않는다(확정=하단 [다음]/[계정 생성], 자동검증=`code-complete`). 조각은 모두 기존 컴포넌트: `nds-phone-input` · `nds-verification-code-input` · `nds-button`(전송/재전송) · `nds-notice-alert`(에러) + 앱이 합성하는 인라인 타이머. 코드 입력은 **반드시 `nds-verification-code-input`** 을 쓴다(일반 `nds-input` 으로 흉내내지 말 것). 인증 성공 모달의 체크 아이콘은 **DS 아이콘/`nds-notice-alert variant=\"success\"`/`nds-result-state status=\"success\"`** 로 — hand-roll SVG 금지(아래 ⑥).",
    "rules": [
      "① 휴대폰번호는 `nds-phone-input` (MUST) — `type=\"tel\"` 인 raw `nds-input` 으로 흉내내지 말 것. 국가코드+포맷이 DS 에 들어있다.",
      "② 인증코드 입력은 `nds-verification-code-input` (MUST) — 일반 `nds-input` 금지. 단일 박스 + 붙여넣기/`one-time-code` 자동완성 + `code-complete`(length 충족 시) 이벤트를 자연 지원한다. 자리별 6칸 박스도 만들지 말 것(component:VerificationCodeInput).",
      "③ 전송/재전송은 **full-width 검정 버튼 하나**(MUST) — `<nds-button color=\"neutral\" full-width>`. \"인증번호 받기\" 로 시작해 코드 전송 후 라벨을 \"인증번호 재전송\" 으로 토글한다. 캐포비 검정 CTA 는 `color=\"neutral\"`(secondary 아님 — Figma 미정의).\n- 라벨 토글은 `btn.textContent = \"재전송\"` 또는 `setAttribute` 로 해도 안전하다(nds-button 이 라벨을 자동 복원). 단 **재전송을 별도 텍스트/링크로 흩뿌리지 말 것** — 한 버튼의 상태 전환이다.",
      "④ 남은시간 타이머는 **앱이 합성하는 인라인 요소**(MUST, DS 컴포넌트 아님) — 코드 입력 우측에 겹쳐 배치하거나(레시피A) 코드 입력 옆에 둔다. 색은 프로젝트 강조색(캐포비 `#FD9B02` = `--semantic-text-accent` 계열, raw hex 대신 토큰). 앱이 `setInterval` 로 `mm:ss` 갱신, 만료 시 ③ 버튼을 \"재전송\" 활성.",
      "⑤ 에러 메시지는 `nds-notice-alert variant=\"error\"` + **비어있지 않은 message**(MUST) — `message=\"\"` 인 alert 를 노출하면 아이콘만 든 빈 박스가 된다. 에러가 없을 땐 **`hidden` 속성으로 토글**(보일 때 message 를 채운다). `nds-notice-alert` 는 `[hidden]` 을 존중한다.",
      "⑥ 확정은 하단 CTA (MUST) — 별도 \"인증하기\" 버튼을 만들지 않는다. `code-complete` 에서 자동검증하거나 하단 [다음]/[계정 생성](primary, multi-step 이면 cta-group)에서 일괄 검증. 검증 실패는 ⑤ 에러, 성공은 다음 단계/모달.",
      "⑦ 성공 표시 아이콘은 DS 로 (MUST) — 완료 모달/화면의 체크는 `nds-notice-alert variant=\"success\"`(원+흰 체크) · `nds-result-state status=\"success\"` · 또는 `find_icon` 의 `CashwalkBizCheckCircleOnIcon`. **원과 체크를 같은 `fill=\"currentColor\"` 로 둔 hand-roll SVG 금지** — 체크가 원과 같은 색이라 안 보인다(초록-온-초록). 체크는 흰색 knockout 이거나 stroke 여야 한다.",
      "⑧ 다단계(온보딩) 안이면 pattern:multi-step-form 의 상태계약을 따른다 — 인증은 비동기 게이트(⑤ of multi-step-form), 응답 전 낙관적 전진 금지."
    ],
    "avoid": [
      "인증코드를 일반 `nds-input`(또는 raw `<input>` 6칸)으로 — ② 위반. `nds-verification-code-input` 사용.",
      "재전송을 버튼이 아닌 **맨 텍스트/라벨로** 표기 — 한 버튼(③)의 상태 전환이어야 한다.",
      "\"인증하기\" 같은 별도 확정 버튼 추가 — 확정은 하단 CTA(⑥). 화면에 primary CTA 가 2개가 되며 캐포비 컨벤션(화면당 primary 1개) 위반.",
      "`nds-notice-alert message=\"\" hidden` 을 띄워 **아이콘만 든 빈 박스** 노출 — ⑤ 위반(보일 땐 message 를 채우고, 없을 땐 hidden).",
      "완료 모달 체크를 **원·체크 같은 색의 hand-roll SVG** 로 — ⑦ 위반(invisible). DS 성공 아이콘 사용.",
      "타이머를 DS 컴포넌트로 착각하거나 색을 raw hex 로 — 앱 합성 인라인 + 토큰(④).",
      "휴대폰번호를 raw `nds-input type=tel` 로 — ① 위반."
    ],
    "_readyMade": {
      "note": "캐포비 본인인증 폼의 정규 골격(코드 전송 전 → 후 두 상태). 타이머 갱신·코드 검증·단계 전환은 앱이 소유한다. 색은 토큰 — hex 직접 지정 금지. 다단계 온보딩 안이면 풋터는 pattern:multi-step-form 의 cta-group 으로.",
      "html": "<!-- 캐포비 본인인증 — 조립 패턴. 전송/검증/타이머는 앱 state. -->\n<div style=\"display:flex; flex-direction:column; gap:16px; max-width:480px\">\n  <nds-input id=\"v-name\" label=\"이름\" full-width placeholder=\"이름을 입력해 주세요\"></nds-input>\n  <nds-phone-input id=\"v-phone\" country-code=\"KR\" label=\"휴대폰번호\"></nds-phone-input>\n\n  <!-- ③ 전송/재전송: full-width 검정 버튼 하나. 전송 후 라벨을 \"인증번호 재전송\" 으로 토글. -->\n  <nds-button id=\"v-send\" color=\"neutral\" full-width>인증번호 받기</nds-button>\n\n  <!-- 코드 전송 후 노출(hidden 토글). 에러 없을 땐 notice-alert 도 hidden. -->\n  <div id=\"v-code-block\" hidden style=\"display:flex; flex-direction:column; gap:8px\">\n    <div style=\"position:relative\">\n      <!-- ② 코드 입력은 nds-verification-code-input -->\n      <nds-verification-code-input id=\"v-code\" length=\"6\" auto-focus></nds-verification-code-input>\n      <!-- ④ 남은시간 타이머 = 앱 합성 인라인 요소(프로젝트 강조색·토큰) -->\n      <span id=\"v-timer\"\n        style=\"position:absolute; right:16px; top:50%; transform:translateY(-50%);\n               color:var(--semantic-text-accent, #FD9B02); font-variant-numeric:tabular-nums;\">3:00</span>\n    </div>\n    <!-- ⑤ 에러: variant=error + 비어있지 않은 message. 없을 땐 hidden. -->\n    <nds-notice-alert id=\"v-err\" variant=\"error\" message=\"\" hidden></nds-notice-alert>\n  </div>\n</div>\n<!-- ⑥ 확정은 하단 CTA(primary). 별도 \"인증하기\" 버튼 없음. -->\n<nds-button id=\"v-next\" color=\"primary\" full-width>다음</nds-button>\n\n<script>\n  const send = document.querySelector(\"#v-send\");\n  const codeBlock = document.querySelector(\"#v-code-block\");\n  const err = document.querySelector(\"#v-err\");\n  send.addEventListener(\"click\", () => {\n    codeBlock.hidden = false;\n    send.textContent = \"인증번호 재전송\"; // nds-button 이 라벨 구조 자동 복원\n    startTimer();                          // 앱: setInterval 로 #v-timer mm:ss 갱신\n  });\n  // 자동검증(code-complete) 또는 하단 CTA 에서 일괄 검증\n  document.querySelector(\"#v-code\").addEventListener(\"code-complete\", (e) => verify(e.detail.value));\n  function showError(msg) { err.setAttribute(\"message\", msg); err.hidden = false; }\n  function clearError() { err.hidden = true; }\n</script>"
    }
  },
  "consent": {
    "name": "consent",
    "metrics": {
      "masterCheckbox": "Checkbox indeterminate (자식 비율로 파생)",
      "requiredEnforcement": "호출부 책임 (필수 미동의 → 진행 불가)",
      "preTick": "금지 (개인정보보호법)",
      "hierarchy": "1단계 (계층은 CheckboxTree)"
    },
    "summary": "약관/개인정보 동의 화면 — 전체동의 + 필수/선택 + 약관 펼침. DS 는 전용 컴포넌트 대신 **Checkbox(indeterminate) 조립 패턴**으로 간다(MUI/Ant 가 indeterminate Checkbox 만 주고 동의 화면은 앱이 조립하는 것과 같은 층위). 한국 개인정보보호법 정합(능동 동의·pre-tick 금지·필수/선택 구분)이 핵심이라 패턴으로 박제한다.",
    "rules": [
      "마스터 '전체 동의' 체크박스는 자식 선택 비율로 **파생** — 모두 체크=checked, 일부=indeterminate(옐로우 마이너스), 전무=unchecked. `<Checkbox indeterminate>`(HTML `<nds-checkbox indeterminate>`)를 그대로 쓴다. 색/아이콘을 직접 손계산하지 말 것.",
      "전체동의 클릭 동작: '모두 체크면 전체 해제, 아니면(부분/전무) 전체 체크'. 전체동의는 **독립 상태를 갖지 않고 항상 자식에 의존** — 이 동기화가 동의 화면 #1 버그 지점이다.",
      "**필수/선택 구분 필수** — 각 항목에 `[필수]`/`[선택]` badge 명시. **`badge:\"[필수]\"` 면 CheckboxGroup 이 자동으로 빨강+bold 강조**(필수=text statusError) — `required` 를 따로 안 붙여도 된다. `[선택]` 은 회색(text subtle). 필수 미동의 시 다음 단계 진행 불가(가드는 호출부 책임).",
      "**pre-tick(선택 항목 기본 체크) 금지** — 마케팅 수신 등 선택 항목을 미리 체크해두면 개인정보보호법상 능동 동의가 아니라 위법(행정처분 대상). 초기 value 는 빈 배열 또는 사용자가 과거 동의한 것만.",
      "전체동의는 사용자가 직접 누른 능동 동의라 합법 — 단 누르면 선택까지 싹 체크되는 마찰을 줄이려면 '필수만 동의' 보조 동선 또는 필수/선택 전체동의 분리를 검토(토스식).",
      "약관 전문은 detail 펼침(chevron 접기/펼치기)으로 — 기본 접힘, 필요 시 확장. 전문이 길면 '전문 보기' 외부 링크.",
      "**`CheckboxGroup`(items + `selectAll`)으로 조립** — items 의 `badge`([필수]/[선택]) · `detail`(약관 전문 펼침) 슬롯 + 전체선택(자동 indeterminate)이 동의 화면을 그대로 커버한다. 개별 원자는 `<Checkbox>`. 별도 동의 전용 컴포넌트를 새로 만들지 말 것. component:CheckboxGroup."
    ],
    "avoid": [
      "전체동의 상태를 자식과 독립으로 관리 — 체크 동기화가 깨진다(동의 화면 최다 버그).",
      "선택 항목을 기본 체크(pre-tick) — 위법(개인정보보호법, 능동 동의 아님).",
      "부분 선택을 그냥 빈 체크로 표시 — indeterminate(마이너스)로 시각화해야 '일부 동의'가 보인다.",
      "필수/선택 구분 없이 '전체 동의'만 노출 — 사용자가 무엇에 동의하는지 불명확 + 법적 리스크.",
      "계층(시/도 ▸ 시/군구) 다중 선택을 이 패턴으로 — 그건 component:CheckboxTree(부모 indeterminate 자동)."
    ]
  },
  "container-section": {
    "name": "container-section",
    "figmaNodeUrl": "https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5303-111",
    "summary": "페이지를 구성하는 두 레이아웃 단위 — **Container = 가로(너비)**, **Section = 세로(블록)**. **Container** 는 컨텐츠를 viewport 너비 안에 가두고 좌우 padding 을 표준화하는 반응형 래퍼로, Layout primitive 컨벤션대로 web component 없이 **`nds-container` 클래스**로 제공한다(`<div class=\"nds-container\">…</div>`). **Section** 은 페이지를 의미 단위 세로 블록으로 나누는 규칙으로, **컴포넌트화하지 않고 페이지 디자인 시 frame/`<section>` 으로 직접 그린다** — 아래 rules 를 따른다.\n\n### \"section\" 세 가지 — 헷갈리지 말 것\n\n이 가이드의 **Section = 페이지 레벨 세로 블록**(여기 rules 대상). DS 에는 같은 이름의 다른 두 개념이 있으니 구분한다.\n\n| 이름                         | 정체                                       | 어디                                                            |\n| ---------------------------- | ------------------------------------------ | -------------------------------------------------------------- |\n| **Section (이 가이드)**      | 페이지 세로 블록 — 클래스/컴포넌트 아님    | `<section>` frame 직접 작성                                     |\n| **`.nds-section` (어드민 카드)** | 본문 안 흰 카드 (head/body/title)          | `Layout.ts` `sectionStyles` — `<section class=\"nds-section\">`   |\n| **`FormSection`**            | 어드민 폼 그룹 카드 (React/HTML 컴포넌트)   | `get_guide({ topic: 'component:FormSection' })`                |\n\n### Container 반응형 — base(전 프로젝트 공용) + Trost device-variant\n\nbase `.nds-container` 는 전 프로젝트 공용 디폴트 — **PC(≥1024) max 1200·좌우 40 / Tablet(768~1023) max 768·좌우 24 / Mobile(<768) 100%·좌우 16**, `margin-inline:auto` 가운데 정렬. Trost 앱 컨텐츠는 아래 **opt-in 모디파이어**로 device-variant 폭을 잡는다(base 는 그대로, 클래스 추가로만 적용 — 다른 프로젝트 영향 0).\n\n| device-variant | 클래스                  | content max | inner h-padding |\n| -------------- | ----------------------- | ----------- | --------------- |\n| Mobile (<768)  | (모디파이어 자동 collapse) | 360 (≈100%) | 16              |\n| PC (≥768)      | `.nds-container--pc`    | 1080        | 24              |\n| PC-Wide        | `.nds-container--wide`  | 1200        | 24              |\n| 런마일 PC      | `.nds-container--runmile` | 1280      | 80              |\n\n- **PC-Wide(`--wide`)** 는 테이블·대시보드 등 가로 정보량이 많은 화면용. 일반 컨텐츠는 **PC(`--pc`, 1080)** 가 기본.\n- h-padding 은 viewport 와 content 폭의 차를 양분한 값 — **h-padding = (viewport − content) / 2**. 모디파이어는 모바일(<768)에서 base 와 동일하게 100% / 좌우 16 으로 자동 collapse 한다.\n\n#### 런마일 Section/Container (Figma 5070:2)\n\n런마일 앱 컨텐츠는 **`.nds-container--runmile`** — 콘텐츠 max **1280** · 좌우 패딩 **PC 80 / Mobile 16**(자동 collapse). 세부 레이아웃 규칙:\n\n- **2열 그리드** = **Main 888 + Side 332 + 컬럼 갭 60**(모바일은 1열 fallback 필수). 888/332/60 은 토큰이 아니라 페이지에서 직접 그린다.\n- **카드 그리드 갭** = PC **24**(3열, Gap/Wide) / **16**(2열, Gap/2XL). 모바일 1열.\n- **Section 타이틀 ↔ 콘텐츠** = **20**(PC, Gap/3XL) / **12**(Mobile, Gap/XL). **Section 간 구분** = **8**(Divider/여백, Gap/MD).\n- **Section 타이틀 비주얼** = **4×22 프로젝트 액센트 바(BG/Brand `#FF5B37`) + 22 Bold 타이틀(Text/Strong `#221E1F`)**. (런마일 headline1 은 24 — 22 타이틀은 섹션 헤딩 한정.)\n- **간격 라벨 매핑**(Figma → DS): Spacing/MD=8 · XL=12 · 2XL=16 · 3XL=20 · 4XL=24 — 전부 DS gap/spacing 스케일과 1:1. 임의 간격(13·17·25) 금지.\n\n```html\n<!-- Trost 앱: Section(세로 블록, BG 교차) 안에 Container(가로 폭 가둠) 1개 -->\n<!-- Container BG = BG/Section/Default · Content BG = BG/Surface/Default(흰 카드, PC radius 16) -->\n<section style=\"padding: 40px 0; background: var(--semantic-bg-section-default)\">\n  <div class=\"nds-container nds-container--pc\">\n    <div class=\"nds-section-surface\" style=\"padding: 24px\">…컨텐츠…</div>\n  </div>\n</section>\n<section style=\"padding: 40px 0; background: var(--semantic-bg-section-default)\">\n  <div class=\"nds-container nds-container--wide\">…테이블/대시보드…</div>\n</section>\n```\n\n```html\n<!-- 마케팅/홍보 페이지: 모디파이어 없이 base(1200) + 큰 Section padding(120/80/40) -->\n<section style=\"padding: 120px 0; background: var(--semantic-bg-surface-default)\">\n  <div class=\"nds-container\">…히어로…</div>\n</section>\n```\n\n`.nds-section-surface` 는 가산 헬퍼 — `background: var(--semantic-bg-surface-default)` + `border-radius: 16px`(radius[16]). bg/radius 를 `.nds-container` 에 굽지 않으므로 흰 컨텐츠 카드가 필요할 때만 붙인다.",
    "rules": [
      "컨텐츠는 항상 `nds-container`(+Trost 면 모디파이어) 안에 둔다 — Container 가 좌우 padding·max-width 를 viewport 별로 표준화한다. 같은 화면에서 Container 너비를 혼용하지 않는다.",
      "**Trost device-variant** — Mobile content 360 / h-padding 16 · **PC content 1080 / inner 24**(`--pc`) · **PC-Wide content 1200 / inner 24**(`--wide`). 임의 폭은 모디파이어로만 정한다.",
      "**Container BG vs Content BG** — Section(Container 가 사는 세로 블록)의 BG 는 **BG/Section/Default**(`--semantic-bg-section-default`), 그 위 흰 컨텐츠 카드는 **BG/Surface/Default**(`--semantic-bg-surface-default`) + content radius **Mobile 0 / PC 16**(`.nds-section-surface`, radius[16]). content 카드만 surface 흰색을 쓰고 바깥 Section 은 section 회색.",
      "**Section 세로(상하) padding** — **Mobile 20 / PC 40**(app-content 기준). `--semantic-inset-*`/spacing 스케일에서 선택. 좌우 여백은 Section 이 아니라 내부 Container 가 책임진다.",
      "**Section 안 item 간격(세로 stack)** — **Mobile 16 (Gap/Loose, `--semantic-gap-loose`) / PC 24 (Gap/Wide, `--semantic-gap-wide`)**.",
      "**Sub-section(섹션 안 하위 그룹) 간격** — **12 (Gap/Comfortable, `--semantic-gap-comfortable`)**. item 간격(16/24)보다 한 단계 좁혀 위계를 만든다.",
      "**두 archetype 구분** — 위 **app-content 스케일(세로 padding 20/40)** 과 **marketing-section 스케일(Large 120 / Medium 80 / Small 40, PC 기준·모바일 1/2)** 은 별개 archetype. 마케팅/홍보 랜딩은 120/80/40, 앱 화면 컨텐츠는 20/40 을 쓴다 — 한 화면에서 섞지 않는다.",
      "인접 Section 은 **BG 교차로 분리** — White(`--semantic-bg-surface-default`) ↔ Section/Gray(`--semantic-bg-section-default`). 그림자·보더 대신 배경 교차로 시각적 블록 분리감을 준다.",
      "Section 1개 안에 Container 1개 — Container 로 너비를 가둔다.",
      "Section 헤딩 — 마케팅 Section Title **32 Bold + 하단 16 여백**, 헤딩↔본문 간격 **24** 권장.",
      "Section 끼리 직접 붙이지 않고 **padding 으로만 분리** — 사이에 margin 을 쓰지 않는다(margin collapse 방지).",
      "다열(2열+) 그리드는 **좁은 화면에서 1열 fallback 필수** — `@media (max-width:768px)` 에서 `grid-template-columns:1fr`(또는 `flex-wrap`). 모바일에서 다열을 그대로 두면 카드가 짓눌려 글자가 세로로 쪼개진다.",
      "**시각 순서 = DOM 순서가 기본.** PC 2열(좌열 1–5 / 우열 6–10)을 만들려고 DOM 을 열 우선(1,6,2,7…)으로 까는 건 금지 — 모바일 1열에서 그 순서가 그대로 노출돼 랭킹이 뒤섞인다. DOM 은 읽기 순서(1,2,3…)대로 두고, 열 우선 배치는 `grid-auto-flow:column` + `grid-template-rows:repeat(N,auto)` 로 표현한다 — 그러면 모바일 1열에서도 DOM 순서(1,2,3…)가 유지된다.",
      "모든 페이지 `<head>` 엔 `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` — 없으면 모바일이 데스크탑 폭으로 렌더돼 반응형(@media)이 전혀 안 먹는다(`build_singlefile_html` 은 산출물에 자동 주입하지만 원본에도 둔다)."
    ],
    "avoid": [
      "**임의 Container 너비(970 · 1100 등) 사용** — device-variant(360 / 1080 / 1200)만 쓴다. 임의 폭은 viewport 별 정렬·h-padding 계산이 깨진다.",
      "Container 밖에 컨텐츠를 두는 것 — 좌우 정렬·max-width 가 깨진다. 항상 `nds-container` 안에.",
      "**bg/radius 를 `.nds-container` 에 직접 박는 것** — Container 는 투명 폭 래퍼다. 흰 카드 표면은 `.nds-section-surface`(또는 별도 wrapper)로만.",
      "Section 사이에 `margin` 사용 — padding 으로만 분리(margin collapse).",
      "같은 화면에서 Container 너비 혼용(예: 한 섹션 1080, 다른 섹션 970).",
      "**app-content 스케일과 marketing 스케일 혼용** — 앱 화면 세로 padding 20/40 과 랜딩 120/80/40 을 한 화면에서 섞지 않는다.",
      "모바일에서 PC padding(좌우 24/40)을 그대로 사용 — Container/모디파이어가 자동으로 16 으로 줄이므로 직접 좌우 padding 을 덧대지 않는다.",
      "다열 그리드를 **모바일 fallback(@media 1열 / flex-wrap) 없이** 사용 — 좁은 화면에서 카드 짓눌림·가로 오버플로우.",
      "PC 다열을 위해 DOM 을 **열 우선(1,6,2,7…)으로 배열** — 모바일 1열에서 순서가 뒤섞인다(배치는 grid-auto-flow:column / CSS order 로, DOM 은 읽기 순서로).",
      "`<meta name=\"viewport\">` 누락 — 모바일 스케일이 깨져 반응형이 전혀 안 먹는다."
    ]
  },
  "cta-group": {
    "name": "cta-group",
    "metrics": {
      "maxArrowIconButtonPerViewport": 1,
      "dialogLeftButtonLabel": "닫기",
      "minDeclineOptionsPerDialog": 1
    },
    "summary": "여러 CTA가 함께 있는 영역의 위계 / 아이콘 / 라벨 명료성 정책.",
    "rules": [
      "Primary solid는 화면 또는 주요 섹션의 대표 액션 1개에만 사용.",
      "ArrowNext/ChevronRight 아이콘은 대표 전진 CTA 1개에만 사용하고, 반복 CTA에서는 제거.",
      "동일 위계의 CTA가 여러 개면 아이콘 없이 텍스트와 버튼 variant로만 구분.",
      "카드 리스트에서는 각 카드마다 버튼을 두기보다 Card.Root clickable 또는 텍스트 링크 패턴을 우선 검토.",
      "버튼 라벨만 보고 다음 화면/행동을 예측할 수 있어야 한다. 라벨에 결과 동사(보기/신청/저장/삭제)를 포함하고, 막연한 '확인'/'시작'/'지금'을 단독으로 쓰지 않는다.",
      "버튼 위 보조 설명(서브카피)이 버튼 라벨과 의미상 중복되지 않도록 한다. 둘 다 같은 가치 제안을 반복하면 버튼 역할이 흐려진다.",
      "다이얼로그/모달의 왼쪽(보조) 버튼 라벨은 항상 **닫기**. '취소'는 사용자가 진행 중이던 작업이 취소된다고 오해할 수 있어 사용 금지. 자세한 라이팅 룰은 get_guide({ topic: 'ux-writing' }) 참고.",
      "거절 가능한 비파괴 옵션이 항상 1개 이상 있어야 한다. CTA가 '확인' 하나뿐인 다이얼로그는 다크패턴 — get_guide({ topic: 'pattern:dark-patterns' }) 참고.",
      "외부 링크는 화살표보다 Link/ExternalLink 성격의 아이콘을 검토.",
      "모달/팝업 푸터의 액션 그룹은 별도 규칙 — 버튼 `shape=\"pill\"` + 배치는 `actionsLayout`(react=actionsLayout / html=actions-layout 속성; 생략 시 프로젝트 기본 강제: 캐포비=end 우측 hug, 그 외=split 가로 분할). 일반 화면 cta-group 규칙을 모달 푸터에 그대로 적용(사각 shape·full-width)하지 말 것. 푸터 결정 트리는 get_guide({ topic: 'component:Modal' }) 참고.",
      "모달/팝업 버튼 2개는 항상 **가로 정렬 유지** — 라벨이 길어 한 줄에 안 들어가도 세로로 스택하지 말고 **라벨을 축약**한다(예: '비즈니스 그룹 만들기'→'그룹 만들기'). 모달 버튼 라벨은 1~2 단어. `flex-direction:column`/`actions-layout=\"stack\"` 금지(validator project-modal-footer-stacked).",
      "캐포비 확인/팝업 모달의 주 action 버튼은 `color=\"neutral\"`(검정 CTA)를 **명시** — color 를 생략하면 Button 기본값 primary(노랑)로 떨어진다(반복 회귀). 노랑 풀폭 '적용'은 선택/데이터 등 대형 모달에서만."
    ],
    "avoid": [
      "모든 '자세히 보기' 버튼에 화살표 반복",
      "보조/outlined CTA에 습관적으로 ArrowNext 부착",
      "'시작', '확인', '지금' 같은 결과 예측 불가능한 단독 라벨",
      "버튼 위 카피와 버튼 라벨에 같은 문장을 반복 (예: '지금 시작해 보세요' → [지금 시작])",
      "다이얼로그 보조 버튼에 '취소' 사용",
      "거절·닫기 옵션 없이 '확인' 하나만 있는 다이얼로그",
      "한 뷰포트에 primary solid CTA 2개 이상",
      "모달/팝업 푸터 버튼에 default 사각 shape 또는 full-width 남용 (확인 팝업은 우측 hug pill — Modal 가이드 SSOT)",
      "모달 2버튼을 세로로 스택 (라벨이 길면 세로로 쌓지 말고 라벨을 축약 — 항상 가로 유지)",
      "캐포비 모달 버튼에 color 생략 (기본값 primary=노랑 → 검정 CTA 가 안 나옴. color=\"neutral\" 명시)"
    ]
  },
  "dark-patterns": {
    "name": "dark-patterns",
    "metrics": {
      "maxAutoSheetsOnEntry": 0,
      "maxInterruptsOnBackPress": 0,
      "minDeclineOptionsPerDialog": 1,
      "maxInterstitialsMidFlow": 0,
      "ctaLabelClarity": "required",
      "maxPrimarySolidPerScreen": 1
    },
    "summary": "사용성·자율성을 해치는 다크패턴 5건. 어느 것 하나라도 적용되면 사용자 신뢰가 크게 떨어지고 재방문·전환이 무너진다. 시각·스타일 차원은 별도 — get_guide({ topic: 'pattern:visual-antipatterns' }) 참고.",
    "rules": [
      "**진입 직후 인터럽트 금지** — 화면 진입 즉시 BottomSheet/Modal/풀스크린 광고/알림 동의 자동 노출 금지. 사용자가 의도한 화면을 먼저 보여주고, 안내·동의는 사용자가 가치를 체감한 시점이나 자연스러운 액션 직후로 미룬다.",
      "**뒤로가기 직후 인터럽트 금지** — 사용자가 이전 화면으로 돌아가려는 순간에 BottomSheet/Modal 로 알림 동의·만류·재구매 유도를 띄우지 않는다. 이탈을 막기 위한 의도된 인터럽트는 자율성 침해.",
      "**거절 불가 CTA 금지** — 다이얼로그/풀스크린 카드의 버튼이 '확인' 하나뿐이거나, 가능한 선택지가 모두 같은 결과로 이어지는 구조 금지. 비파괴 옵션(닫기/나중에/건너뛰기)을 항상 1개 이상 노출.",
      "**플로우 중간 예상 못한 전면 모달/광고 금지** — 사용자가 메뉴/액션(예: 아이템 받기)을 눌렀을 때, 그 결과 대신 다른 콘텐츠(광고/프로모션/추가 동의)가 먼저 끼어들면 안 된다. 광고가 필요하다면 결과 화면 뒤 또는 별도 전용 위치에.",
      "**CTA 라벨 모호성 금지** — 버튼만 보고 다음 행동/화면을 예측할 수 있어야 한다. 위 카피의 가치 제안을 그대로 반복한 버튼('지금 시작', '확인')은 사용자가 결과를 예측 못해 클릭을 망설이게 만든다. 버튼 위에 과장된 보조 설명을 함께 노출해 버튼 역할을 흐리는 것도 금지. 라이팅 룰은 `get_guide({ topic: 'ux-writing' })` 의 CTA microcopy 참고."
    ],
    "avoid": [
      "온보딩/홈 진입 직후 자동 BottomSheet (특히 알림 동의 / 마케팅 동의)",
      "뒤로가기 누르면 '잠깐만요!' BottomSheet 로 만류",
      "혜택/공지 다이얼로그의 버튼이 '확인' 하나만 있는 구조",
      "메뉴 클릭 → 의도한 화면 대신 전면 광고 → (광고 닫기 후) 의도한 화면",
      "버튼 위에 'OO를 받을 수 있는 특별한 기회' + 버튼 라벨 '받기' 처럼 보조 설명이 라벨을 흐리는 구성",
      "다이얼로그 보조 버튼 라벨을 '취소'로 두기 → 사용자가 작업 자체가 취소된다고 오해"
    ]
  },
  "dense-list": {
    "name": "dense-list",
    "metrics": {
      "maxPrimaryFactsPerCard": 3,
      "maxSecondaryFactsPerCard": 5,
      "maxCtaPerRepeatedCard": 1
    },
    "summary": "정보가 과밀한 리스트/카드 영역의 배치 원칙.",
    "rules": [
      "반복 아이템의 상태, 날짜, 금액, 진행률 위치를 고정해 스캔 경로를 만든다.",
      "카드 하나에 주요 정보 3개, 보조 정보 5개를 넘기지 않는다.",
      "상세 설명은 기본 노출보다 Accordion/상세 페이지/Text(expandable)로 분리.",
      "모바일에서는 표보다 카드형, 필터는 가로 스크롤 또는 접힘 영역을 우선.",
      "반복 카드마다 CTA를 2개 이상 두지 않는다."
    ],
    "avoid": [
      "카드마다 Chip, 색 배경, 아이콘 CTA를 모두 반복",
      "상태/날짜/CTA 위치가 카드마다 달라지는 배치",
      "모든 정보를 첫 화면에 펼쳐 설명하는 구성"
    ]
  },
  "design-spec": {
    "name": "design-spec",
    "metrics": {
      "file": "design-spec.json",
      "decisionLog": "designDecisions.jsonl",
      "blocksCode": false,
      "semanticTokensOnly": true
    },
    "examples": [
      {
        "verdict": "good",
        "source": "{ \"screen\": { \"project\": \"geniet\", \"surface\": \"app\", \"intent\": \"리뷰 상세 — 평점·본문·도움돼요\" }, \"tree\": [ { \"component\": \"Card\", \"role\": \"리뷰 본문\", \"tokens\": [\"--semantic-bg-default\",\"--semantic-text-default\"], \"children\": [ { \"component\": \"Button\", \"role\": \"primary CTA\", \"props\": { \"color\": \"primary\" }, \"rationale\": \"Geniet primary CTA = project mint/600 (#00A8AC)\" } ] } ], \"decisions\": [\"primary CTA 1개만\", \"raw hex 없음 — 전부 --semantic-*\"] }",
        "caption": "의도·컴포넌트·시멘틱 토큰 이름·근거만. 좌표/색값/px 없음. component 는 DS 이름 또는 nds-tag."
      },
      {
        "verdict": "bad",
        "source": "{ \"tree\": [ { \"component\": \"Button\", \"props\": { \"background\": \"#1A1A1A\" }, \"x\": 24, \"y\": 600 } ] }",
        "caption": "좌표(x/y)·raw hex 를 스펙에 넣으면 scene.json 열화판이 된다. screen(project/surface/intent)·근거 누락. → raw-hex-prop error."
      }
    ],
    "summary": "prompt → **DesignSpec(JSON)** → code 의 경량 중간표현. 복잡/다단계 화면이거나 사용자와 구성 합의가 필요할 때, HTML 작성 전에 save_design_spec 으로 의도 스펙을 만들고 ok:true + 사용자 동의 후 build_singlefile_html 로 진행(soft 승인 게이트). 추적성·정밀편집·코드前 검증을 얻는다.",
    "rules": [
      "언제 쓰나: 다화면/복잡 플로우, 컴포넌트 선택이 모호, 또는 사용자가 화면 구성에 합의하고 싶을 때. 단순 단일 화면이면 생략하고 바로 HTML 로 가도 된다(과한 절차 강제 금지).",
      "⛔ 예외 — 캐포비(cashwalk-biz) 어드민 화면은 복잡도와 무관하게 save_design_spec 필수(생략 금지): validate 가 5종 Page Pattern(screen.surfaceKind:'admin' + screen.pagePattern, Onboarding/Dashboard/List/Detail/Form) 선언을 hard error 로 강제하므로, spec 을 건너뛰면 화면-분류 게이트도 통째로 건너뛰어 어드민 일관성이 깨진다. 코드 전에 먼저 분류: get_guide({ topic: 'pattern:cashwalk-biz-page-patterns' }).",
      "스펙은 '의도'만 담는다: 컴포넌트 트리(시멘틱 이름), 참조할 시멘틱 토큰 '이름', project/surface, 그리고 결정 근거(rationale). 좌표·resolved 색·px·이미지 바이트는 담지 않는다 — 그건 코드→Figma scene.json(역방향 추출) 담당이다.",
      "토큰은 시멘틱 only: tokens[] 에는 '--semantic-*' 같은 토큰 이름만. raw hex/rgb 금지(raw-hex-token error). raw 팔레트(--color-blue-500 등)는 warn — --semantic-* 우선.",
      "save_design_spec 은 카탈로그 기준으로 자동 검증한다(프로젝트 실재·토큰 존재·prop enum·컴포넌트 존재). ok:false 면 violations 를 고쳐 재저장한 뒤, ok:true 가 되어야 빌드로 넘어간다(validate-before-code).",
      "저장한 스펙을 사용자에게 한 번 보여주고 동의를 받은 뒤 build_singlefile_html 로 HTML 을 만든다(soft gate). 스펙과 다른 화면을 임의로 만들지 않는다.",
      "component 는 PascalCase('Button') 또는 nds-tag('nds-button') 둘 다 허용 — scene.ts(코드→Figma)의 ndsTagToComponentName 어휘를 공유하므로, 정방향 스펙과 역방향 scene 을 컴포넌트 정체성으로 JOIN 할 수 있다.",
      "ui-direction-proposal 로 방향이 정해졌으면 그 방향을 DesignSpec 으로 구체화한다(두 패턴은 상호 보완 — 방향 합의 → 스펙 고정 → 빌드).",
      "시각 레퍼런스 게이트가 더 우선이다. references.md(Figma/스크린샷)가 없으면 스펙은 만들 수 있어도 build 는 레퍼런스를 받은 뒤 진행한다.",
      "결정 로그: save_design_spec 은 design-spec.json(매번 덮어씀) 옆에 decisions/rationale 을 designDecisions.jsonl 로 한 줄씩 누적한다(화면별 dedup, 최근 N행 상한). 결정 이력/메모리 소스이며, 소비 프로젝트에서는 gitignore 권장."
    ],
    "avoid": [
      "단순 단일 화면에도 매번 스펙을 강제(과한 절차)",
      "스펙에 좌표·resolved 색·px·이미지를 담기(그건 scene.json 몫)",
      "tokens 에 raw hex/rgb 또는 카탈로그에 없는 토큰 이름",
      "save_design_spec 이 ok:false 인데 그대로 build 로 진행",
      "스펙만 만들고 사용자 동의 없이 빌드 / 스펙과 다른 HTML 작성",
      "캐포비(cashwalk-biz) 어드민인데 save_design_spec 을 생략하고 바로 HTML — 5종 Page Pattern 분류 게이트를 우회하게 됨"
    ]
  },
  "dropdown": {
    "name": "dropdown",
    "metrics": {
      "defaultMaxHeight": "320px",
      "searchThreshold": 15,
      "virtualizationThreshold": 50
    },
    "summary": "Select/Dropdown 옵션 수에 따른 높이와 검색 정책.",
    "rules": [
      "옵션 7개 이하는 일반 Select.",
      "옵션 8-15개는 max-height 320px 안팎의 스크롤 목록.",
      "옵션 15개 초과는 검색 가능 Select/Autocomplete 검토.",
      "옵션 50개 초과는 서버 검색 또는 가상화 검토.",
      "옵션 라벨은 1줄 유지. 보조 설명은 help text나 별도 상세 영역으로 분리."
    ],
    "avoid": [
      "긴 문장 옵션을 드롭다운에 그대로 노출",
      "옵션 15개 초과인데 검색 없이 긴 스크롤만 제공",
      "모바일에서 좁은 팝오버 안에 긴 옵션 목록 표시"
    ]
  },
  "form-validation": {
    "name": "form-validation",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1399-124",
    "summary": "폼 입력의 검증·합성 규칙 SSOT(넛지EAP Library · InputFormGuide 1399:124). 단일 필드 레이아웃(라벨-위·필드 치수·여백)은 pattern:nudge-eap-form-layout 이 담당하고, 이 가이드는 그 위에서 **검증 표시(ValidationChip)·합성 컨트롤(인라인 버튼·비밀번호 토글)·Label/Helper/Error 규칙·검증 시점**을 정한다. 회원가입처럼 규칙이 여러 개인 폼에서 어떤 신호를 언제 보여줄지 결정한다.",
    "rules": [
      "합성 ① Input + ValidationChip — 형식 규칙이 2개 이상일 때 Input 아래 한 줄에 `<nds-validation-chip>` 를 나열. 입력값이 규칙을 충족할 때마다 해당 chip 을 `state=\"incomplete\" → \"complete\"`(Project Blue) 로 전환. 비밀번호/이메일 형식 안내에 사용(component:ValidationChip).",
      "합성 ② Input + Inline Button — 인증번호 받기·중복 확인 같은 **단일 액션**은 Input 과 같은 행에 작은 outlined 버튼을 둔다. `FormField` > `InputGroup`(align=\"start\") 로 입력+버튼을 한 줄에 합성한다 — 커스텀 flex 행을 새로 만들지 말 것(component:InputGroup).",
      "합성 ③ Input + Eye Icon — 비밀번호 표시/숨김은 `<nds-input type=\"password\">` 의 **내장 password-toggle** 이 자동 제공(우측 눈 버튼, type 토글·포커스 유지까지 처리). 별도 trailing 버튼을 만들지 말 것 — 끄려면 `password-toggle=\"false\"`.",
      "Label / Placeholder — Label 은 항상 필드 위(Top Label). 필수 항목은 별표(`*`) + `aria-required`. Placeholder 는 형식 힌트만 — **Label 을 대체하지 않는다**.",
      "Helper / Error — 같은 자리에서 교차한다(동시 노출 X). 여러 검증이 실패해도 Error 는 **1줄만**(우선순위: 필수 → 형식 → 길이 → 도메인 → 서버). Helper/Error 영역은 표시 안 돼도 1줄 높이를 예약해 레이아웃 점프를 막는다.",
      "Validation 시점 — onBlur(권장, 필드 떠날 때 1회) · onSubmit(제출 시 일괄, 첫 에러 필드로 자동 스크롤·포커스) · onChange(비밀번호 강도 게이지 같은 즉시 피드백 한정).",
      "Submit / Errors — 제출 중에는 버튼 비활성 + 로딩, 폼 비활성. 서버 오류는 폼 상단 Alert(notice/NoticeAlert) + 입력값 보존. 성공은 Toast(\"저장되었습니다\", 자동 사라짐).",
      "컨트롤 선택(Checkbox/Radio/Toggle/Dropdown/SelectionButton)은 pattern:selection-controls 결정 트리를 따른다 — 같은 용도는 화면이 달라도 같은 컴포넌트로 통일."
    ],
    "avoid": [
      "ValidationChip 으로 폼 필드의 단일 에러 1줄을 대체 — 에러 1줄은 FormField helper/error 슬롯, ValidationChip 은 규칙 체크리스트(여러 개 동시).",
      "Helper 와 Error 동시 노출 — 한 자리에서 교차해야 한다.",
      "검증 실패 메시지를 규칙별로 여러 줄 — Error 는 우선순위 1줄.",
      "인라인 액션 버튼을 커스텀 flex 로 새로 — FormField + InputGroup 합성 재사용.",
      "chip·버튼·헬퍼 색을 raw hex 로 — state/semantic 토큰으로 5 프로젝트 자동 대응."
    ],
    "_readyMade": {
      "note": "넛지EAP 회원가입 합성 3종. 색은 모두 semantic 토큰(ValidationChip state · Button color)으로 프로젝트 cascade 자동 대응.",
      "html": "<!-- ① Input + ValidationChip (비밀번호 실시간 검증) -->\n<div style=\"display:flex; flex-direction:column; gap:8px; max-width:332px\">\n  <nds-input type=\"password\" placeholder=\"비밀번호\"></nds-input>\n  <div style=\"display:flex; gap:12px\">\n    <nds-validation-chip state=\"complete\">6자 이상</nds-validation-chip>\n    <nds-validation-chip state=\"incomplete\">영문+숫자</nds-validation-chip>\n  </div>\n</div>\n\n<!-- ② Input + Inline Button (인증번호 받기) — FormField > InputGroup(align=\"start\") -->\n<nds-form-field label=\"휴대폰 번호\">\n  <nds-input-group align=\"start\">\n    <nds-input placeholder=\"010-0000-0000\"></nds-input>\n    <nds-button variant=\"outlined\">인증번호 받기</nds-button>\n  </nds-input-group>\n</nds-form-field>\n\n<!-- ③ Input + Eye Icon (비밀번호 표시·숨김) — type=\"password\" 면 눈 토글 자동, 별도 마크업 불필요 -->\n<nds-input type=\"password\" placeholder=\"비밀번호\"></nds-input>"
    }
  },
  "geniet-screens": {
    "name": "geniet-screens",
    "metrics": {
      "project": "geniet (헬시밀·다이어트 식단 커머스 — 샐러드/도시락)",
      "homeWeb": "데스크탑 — 상단 글로벌 nav + 검색 → cream 히어로 프로모 배너 → '랭킹' 음식 카드 그리드(4-up 행, 썸네일+제목+가격+프로젝트 배지) 섹션 반복 → 전문가 칼럼/매거진 카드 → 푸터",
      "reviewAppDetail": "모바일 — 음식 사진 히어로 → 리뷰 본문 → 연관 상품 카드(2~3-up 썸네일+가격) → 텍스트 리뷰 list",
      "reviewWebModal": "웹 — '전체 음식 리뷰' list(음식 사진 + 리뷰 텍스트 카드) 위에 '리뷰 작성' Modal: 음식 검색 → 사진/영상 업로드 → 별점 → 목적/시간대(선택 Chip) → 조리방식(checkbox) → 등록 CTA",
      "card": "음식 카드 = 정사각 썸네일 + 제목 2줄 + 가격 + 프로젝트/할인 배지. 그리드는 4-up(web) 반복 랭킹 섹션.",
      "accent": "청록(teal) 브랜드 컬러 — 로고/CTA/링크. 식품 사진이 주인공이라 UI 채도는 낮게.",
      "status": "스크린샷 레퍼런스 카탈로그 (레이아웃·구성 SSOT). 정확한 색/여백/치수 토큰은 component 가이드 + 프로젝트 토큰이 SSOT."
    },
    "references": [
      {
        "label": "Geniet 웹 홈 — 헬시밀 커머스 (desktop)",
        "image": "references/geniet-web-home.png",
        "caption": "상단 글로벌 nav + 검색, cream 히어로 프로모 배너, 음식 카드 4-up 랭킹 섹션 반복, 전문가 매거진 카드, 푸터.",
        "project": "geniet"
      },
      {
        "label": "Geniet 앱 리뷰 상세 — 후기 (mobile)",
        "image": "references/geniet-app-review-detail.png",
        "caption": "음식 사진 히어로 → 리뷰 본문 → 연관 상품 카드 → 텍스트 리뷰 list 의 모바일 후기 상세.",
        "project": "geniet"
      },
      {
        "label": "Geniet 웹 리뷰 작성 모달 (desktop)",
        "image": "references/geniet-web-review-modal.png",
        "caption": "'전체 음식 리뷰' list 위 '리뷰 작성' Modal — 음식 검색·사진 업로드·별점·목적/시간대 Chip·조리방식 checkbox·등록 CTA.",
        "project": "geniet"
      }
    ],
    "summary": "Geniet(헬시밀·다이어트 식단 커머스) 화면의 **시각 레퍼런스 카탈로그** — 웹 홈 / 앱 리뷰 상세 / 웹 리뷰 작성 모달 3종 스크린샷을 담는다. Geniet 은 샐러드·도시락 같은 식품 사진이 주인공이라 UI 채도는 낮추고 청록(teal) 브랜드 컬러를 로고·CTA·링크에만 쓴다. 화면을 새로 짤 때 **레이아웃·구성·위계의 출처**로 이 스크린샷들을 먼저 보고(`references[].imageAbsolutePath`), 정확한 색·여백·치수·컴포넌트 선택은 해당 `component:*` 가이드와 프로젝트 토큰을 SSOT 로 따른다.",
    "rules": [
      "**음식 카드 그리드 = '카드 1장 = 상품 1건'.** 정사각 썸네일 + 제목(2줄) + 가격 + 프로젝트/할인 배지. 웹 홈은 이 카드를 4-up 행으로 묶은 '랭킹' 섹션을 반복한다 → 섹션 컨테이너는 헤더(섹션명 + 더보기)를 소유하는 `pattern:card-section` / `List` 정합.",
      "**리뷰는 `pattern:review-list` 를 따른다** — '카드 1장 = 리뷰 1건'(`ReviewCard`), 도움돼요/별점/신고는 카드 `footer` 슬롯, 더보기는 리스트 `footer`. 앱 리뷰 상세·웹 리뷰 list 둘 다 동일.",
      "**리뷰 작성은 Modal + 폼 패턴.** 음식 검색(Input) → 사진/영상 업로드 → 별점 → 목적·시간대는 **단일/다중 선택 `Chip`**(토글), 조리방식은 **`checkbox` list**, 하단 등록 CTA 1개. → `pattern:multi-step-form` / `selection-controls` / `component:Chip` 정합. 모달 본문만 스크롤(`popover-portal-and-modal-scroll`).",
      "**브랜드 컬러는 토큰으로만.** 청록 accent 는 `--semantic-*`(project) 토큰 cascade 로 흐른다 — 컴포넌트/목업에 hex 하드코딩 금지(`get_guide({ topic: 'principles' })`).",
      "**사진이 주인공** — 카드/히어로의 시각 무게는 식품 사진이 갖고, 텍스트·버튼 UI 는 보조. primary solid CTA 는 화면당 최소화(`pattern:cta-group`).",
      "새 Geniet 화면 작업 전 이 카탈로그의 해당 스크린샷을 `references.md` 의 `[good]` 소스로 먼저 등록(`pattern:visual-reference` 게이트)."
    ],
    "avoid": [
      "스크린샷의 색·여백·치수를 픽셀 단위로 그대로 베끼기 — 이 카탈로그는 **레이아웃·구성 참고용**이고, 정확한 값은 component 가이드 + 프로젝트 토큰이 SSOT(어긋나면 토큰이 우선).",
      "음식 카드를 `ListItem` 의 leading/title row 로 욱여넣기 — 썸네일+제목+가격+배지 카드는 `Card`/상품 카드. (리뷰는 `ReviewCard`)",
      "리뷰 작성 모달의 목적/시간대 선택을 라디오/드롭다운으로 치환 — 토글형 다중·단일 선택은 `Chip`.",
      "청록 accent 를 UI 전반에 칠하기 — 식품 사진 채도와 충돌. accent 는 로고·CTA·링크 한정.",
      "Geniet 전용이라며 컴포넌트에 `[data-project=\"geniet\"]` 색 분기 추가 — 프로젝트 차이는 프로젝트 토큰 파일에서 값만 override(`CLAUDE.md` 프로젝트 분기 금지 규칙)."
    ]
  },
  "host-spacing": {
    "name": "host-spacing",
    "metrics": {
      "hostDisplay": "contents",
      "affectsComponents": "117 / 121 nds-* (제외: project-chrome / input-group / inspector)",
      "droppedProps": "margin / padding / width / height / flex / align-self / gap / background / border / box-shadow / position",
      "allowedOnHost": "--nds-* · --semantic-* custom properties · display:contents",
      "fix": "wrapper div 또는 부모 컨테이너 gap",
      "validatorRule": "nds-host-box-style"
    },
    "summary": "NDS 웹컴포넌트(<nds-*>)는 light-DOM 미러라 호스트 엘리먼트가 `display: contents` 로 그려진다 — 호스트 자신은 박스를 만들지 않으므로 호스트에 직접 준 margin / padding / width / height / flex / gap / background / border 는 브라우저가 전부 무시한다. 간격·크기·레이아웃은 호스트가 아니라 호스트를 감싼 일반 div(또는 부모 컨테이너의 gap)에 준다. ('컴포넌트끼리 딱 붙음 / 모달 헤더 사라짐 / 여백 사라짐' 의 단일 근본 원인.)",
    "rules": [
      "호스트(<nds-*>)에는 박스 스타일을 주지 않는다 — `display: contents` 라 margin/padding/width/height/flex/align-self/gap/background/border/box-shadow/position 이 전부 드롭된다.",
      "간격이 필요하면 컴포넌트를 일반 `<div>` 로 감싸고 그 wrapper 에 margin/padding 을 준다. 또는 부모 컨테이너를 flex/grid 로 만들고 부모의 `gap`(semantic-gap-*)으로 컴포넌트 사이를 띄운다 — wrapper 보다 부모 gap 이 우선.",
      "크기(width/height)가 필요해도 호스트가 아니라 wrapper 에 준다 (예: 폼 안에서 Select 를 240px 로 → `<div style=\"width:240px\"><nds-select …></nds-select></div>`).",
      "호스트에 줘도 되는 inline 스타일은 CSS 커스텀 프로퍼티뿐 — `--nds-*` / `--semantic-*` 변수(컴포넌트 슬롯·토큰 전달)와 `display: contents` 자신. 그 외 표준 박스 프로퍼티는 금지.",
      "예외: `display: contents` 를 안 쓰는 소수 컴포넌트(project-chrome / input-group / inspector)는 호스트 스타일이 먹지만, 일관성을 위해 동일하게 wrapper 패턴을 권장."
    ],
    "avoid": [
      "<nds-selection-button-group style=\"margin-bottom:16px\"> — 호스트 margin 무시 → 하단 패널과 딱 붙음. wrapper div 로 감쌀 것.",
      "<nds-card style=\"padding:16px\"> — 호스트 padding 무시. 카드 내부 여백은 nds-card-body 가 처리.",
      "<nds-select style=\"width:240px\"> — 호스트 width 무시. wrapper div 에 width.",
      "컴포넌트 사이 간격을 호스트 margin 으로 주려는 모든 시도 — 부모 gap 또는 wrapper 로."
    ]
  },
  "html-mockup-intake": {
    "name": "html-mockup-intake",
    "examples": [
      {
        "verdict": "good",
        "source": "마케팅 랜딩 HTML 목업",
        "caption": "hero/feature/CTA/footer 영역을 식별해 각각 <nds-*> 로 1:1 매핑, 헤드라인·본문 카피는 원본 그대로, 색/여백만 시멘틱 토큰으로, 원본 자체 header/footer 는 <nds-project-header>/<nds-project-footer> 로 교체."
      },
      {
        "verdict": "bad",
        "source": "className 흉내 + 카피 재작성",
        "caption": "원본 <button> 을 <button class=\"nds-button\"> 로만 바꾸고 실제 <nds-button> 컴포넌트는 안 쓰고(흉내), 원본 문구를 임의로 다시 쓰고 섹션 순서를 재배치 — 재현이 아니라 다른 화면이 됨."
      }
    ],
    "summary": "기존 HTML 목업(또는 HTML 형식의 기획서)이 입력으로 들어왔을 때, 그것을 '재설계 대상'이 아니라 '재현할 정답 디자인'으로 보고 구조·콘텐츠·문구·위계를 보존한 채 primitive 만 DS(<nds-*> + 시멘틱 토큰 + 프로젝트 크롬)로 바꿔 충실히 옮기는 패턴.",
    "rules": [
      "이건 재설계가 아니라 재현이다. 첨부된 HTML 은 이미 정해진 디자인의 정답 소스다 — ui-direction-proposal 처럼 새 레이아웃 방향을 제안하지 말고, 원본의 구조/섹션 순서/정보 위계/문구를 그대로 보존한다.",
      "시각 게이트와의 관계: 렌더되는 HTML 목업은 '구조·콘텐츠의 정답'이므로 구조 게이트를 충족한다(prd-as-visual 처럼 막지 말 것 — 그건 텍스트 스펙 얘기다). 다만 프로젝트 톤/색 정합은 Figma/스크린샷이 있으면 대조하고, 없으면 프로젝트 토큰을 기준으로 한다.",
      "1) 원본 HTML 을 끝까지 읽고 영역을 식별한다: header/nav, hero, section/card, list, form, cta, footer 등. 어떤 콘텐츠가 어디에 어떤 위계로 있는지 메모한다.",
      "2) 각 영역을 가장 가까운 DS 컴포넌트로 매핑한다 — find_component({ query }) 로 후보 확인, get_guide({ topic: 'component:<Name>', target: 'html', project }) 로 정확한 <nds-*> 사용법을 가져온다(추측 금지).",
      "3) 사용자 노출 문구/카피는 원본 그대로 보존한다. placeholder 라고 임의로 다시 쓰지 말 것 — 다듬어야 할 것 같으면 먼저 사용자에게 확인한다. (단 ux-writing 위반이 명백하면 get_guide({ topic: 'ux-writing' }) 기준으로 제안 후 확인.)",
      "4) raw 색/여백/타이포를 토큰으로 치환한다: 색은 find_token 으로 --semantic-* 매칭, 여백은 4의 배수 또는 --semantic-gap-*/--semantic-inset-*. raw hex/rgb/gradient 금지.",
      "5) 표면에 맞는 프로젝트 크롬을 주입한다 — 원본이 자체 <header>/<footer> 로 그린 것을 DS 크롬으로 교체한다. surface=service → <nds-project-header>/<nds-project-footer>/<nds-project-bottom-nav>, surface=admin → admin-shell(사이드바+톱바) 또는 어드민 온보딩 카드(소비자 project chrome 금지).",
      "6) validate_html_mockup 으로 위반 0 + low-ds-ratio 없음(DS 반영도 충분)까지 고친다. native 잔존(<button> 등)이 남으면 convert_html_to_ds_html 로 1차 변환한 뒤 variant/색을 손으로 마감한다. withStats:true 로 stats.counts.dsRatio 를 확인.",
      "7) build_singlefile_html 으로 단일 파일을 만들고, 완료 보고에 ① 영역별 before(native)→after(nds-*) 매핑, ② 그대로 보존한 핵심 문구, ③ 적용한 토큰/컴포넌트, ④ dsUsageSummary 뱃지를 포함한다."
    ],
    "avoid": [
      "className 만 nds-* 로 바꾸고 실제 <nds-*> 컴포넌트로 교체하지 않음(흉내) — dsRatio 게이트(low-ds-ratio)가 잡는다",
      "원본 문구를 임의로 다시 쓰거나 정보 위계/섹션 순서를 재배치 — 이건 재현이지 재설계가 아님",
      "ui-direction-proposal 처럼 새 UI 방향을 2-3개 제안 — 디자인은 이미 HTML 로 정해져 있음",
      "원본의 자체 <header>/<footer> 를 그대로 두고 DS 프로젝트 크롬을 빠뜨림(raw-landmark)",
      "raw hex/그라데이션/non-4pt 여백을 토큰화하지 않고 그대로 둠",
      "[html-as-prd-spec] 렌더되는 HTML 목업을 '텍스트 스펙(prd-as-visual)' 으로 오해해 시각 레퍼런스로 인정하지 않고 빌드를 막음 — HTML 은 구조의 정답 소스, 톤/색만 Figma/스크린샷으로 보강"
    ]
  },
  "icon-color": {
    "name": "icon-color",
    "metrics": {
      "standaloneIconColor": "required",
      "preferredColor": "var(--semantic-icon-*) — strong/normal/disabled/inverse/project/status",
      "maxSemanticIconColorsPerSection": 1
    },
    "summary": "아이콘 컬러 매핑 기준. Figma Iconography(379:490)의 Color Usage 표와 `--semantic-icon-*` 시맨틱 토큰을 단일 진실 소스로 사용. 사이즈/스타일/터치 영역 기준은 get_guide({ topic: 'pattern:iconography' })를 함께 확인.",
    "rules": [
      "아이콘 컴포넌트의 기본값은 currentColor다. 단독 배치 시 부모 color가 명시되어 있지 않으면 본문색/검정으로 보여 어색할 수 있다.",
      "Button, IconButton, Chip, Select 등 DS 컴포넌트 슬롯 안의 아이콘은 컴포넌트가 정한 텍스트 컬러를 상속하게 두는 것이 기본이다.",
      "안내/상태/빈 상태/카드 장식처럼 단독으로 배치한 아이콘은 `color` prop 또는 부모 `style.color`를 `var(--semantic-icon-*)` 토큰으로 명시한다.",
      "용도별 토큰 매핑(Figma Color Usage 표):\n  · 본문 옆 강조 → `--semantic-icon-strong-default`\n  · 보조 정보·메타 → `--semantic-icon-normal-default`\n  · 비활성 → `--semantic-icon-disabled-default`\n  · 어두운 배경 위 → `--semantic-icon-inverse-default`\n  · 프로젝트 강조 → `--semantic-icon-brand-default`",
      "상태 의미가 있을 때만 status 토큰을 사용한다:\n  · 성공 → `--semantic-icon-status-success` (Teal/500 · #13BFA2)\n  · 오류 → `--semantic-icon-status-error` (Orange Red/500 · #F13F00)\n  · 주의 → `--semantic-icon-status-caution` (Golden Yellow/500 · #FFC303)",
      "TestresultSafe/Warning/Danger, Siren 같은 '컬러 아이콘'(다색 일러스트성)은 시맨틱 토큰을 덧씌우지 않는다. 그대로 사용한다.",
      "아이콘만 별도 강한 색으로 튀게 하지 않는다. 강조가 필요하면 텍스트, 배경, 아이콘 중 1-2개만 함께 조합한다."
    ],
    "avoid": [
      "<InfoIcon />처럼 단독 아이콘을 색 지정 없이 배치",
      "안내 박스 안에서 아이콘만 프로젝트 primary로 과하게 강조",
      "아이콘에 hex/rgb 직접 지정 — `--semantic-icon-*` 토큰만 사용",
      "구식 `--semantic-icon-*` 토큰 사용 — `--semantic-icon-*`로 대체",
      "한 섹션 안에서 아이콘마다 다른 semantic color를 섞는 구성",
      "컬러(다색) 아이콘에 color prop을 강제로 덮어쓰는 사용"
    ]
  },
  "icon-usage": {
    "name": "icon-usage",
    "metrics": {
      "maxHeadingIconsPerScreen": 4,
      "allowedLocations": "AppBar buttons / Bottom Tab / IconButton / 카테고리 그룹 / 상태 아이콘 / Form field affordance",
      "consistencyRule": "same-hierarchy-text → same-icon-decision",
      "selectionPriority": "project-specific → nudge-eap-default → mockup-default(MockupLinear/MockupBold) → generated-custom",
      "relatedPatterns": "icon-color, iconography"
    },
    "summary": "아이콘은 장식이 아니라 행동 / 상태 / affordance 전달 목적에만 사용한다. 어디에 써도 되고 어디에 쓰면 안 되는지를 정의하는 화이트리스트 / 블랙리스트. 아이콘 컬러는 get_guide({ topic: 'pattern:icon-color' }), 사이즈/스타일은 get_guide({ topic: 'pattern:iconography' }) 참고.",
    "rules": [
      "**flex 행 안 인라인 아이콘은 `flex-shrink:0` + 고정 width/height 필수** — 텍스트 옆(상태 뱃지 옆 [i], 칩 안, 라벨 옆)에 둔 SVG 는 flex 자식이라 공간이 부족하면 가로폭이 0 까지 눌려 세로로 찌그러진다(회귀: '반려' 뱃지 옆 [i] 아이콘이 1px 너비로 찌그러짐). DS 입력/체크박스는 아이콘 슬롯에 이미 flex-shrink:0 을 주지만(Input prefix/suffix·Checkbox indicator), 손수 넣은 SVG 는 작성자가 `flex-shrink:0; width:16px; height:16px` 를 직접 줘야 한다. find_icon 산출 SVG 도 컨테이너가 flex 면 동일.",
      "**필수 선택 순서**: 프로젝트 전용 아이콘 → NudgeEAP 기본 아이콘 → MockupLinear*/MockupBold* 목업 기본 아이콘 → 자체 생성 SVG. find_icon 으로 앞 단계 후보를 먼저 확인하고, 없을 때만 다음 단계로 이동.",
      "허용 위치 (화이트리스트):\n  · AppBar / Header 기능 버튼 (검색 · 알림 · 뒤로가기 · 메뉴)\n  · Bottom Tab Navigation\n  · IconButton\n  · 동일 위계의 카테고리 그룹 (Concern Grid · Category Grid)\n  · 상태 아이콘 (Success · Warning · Error)\n  · Form Field affordance (검색 · 캘린더 · 드롭다운 토글)",
      "동일 위계의 텍스트는 아이콘 사용 여부가 일관되어야 한다 — 같은 GNB / 같은 카드 리스트 / 같은 헤딩 그룹 안에서 일부에만 아이콘이 붙으면 hierarchy 가 깨진다.",
      "헤딩 앞 아이콘 5개 이상 사용 시 자동 위반 — 아이콘을 hierarchy 표현 수단으로 쓰지 않는다.",
      "아이콘이 필요한지 판단 기준: 액션을 호출하는가? 상태를 전달하는가? affordance(입력 가능/스크롤 가능 등)를 알리는가? 셋 중 하나도 아니면 아이콘 없이 텍스트만.",
      "스타일 혼용 금지 — 한 화면에서 Line(stroke) 과 Filled 를 같은 의미 그룹에서 섞지 않는다 (iconography 패턴 참고)."
    ],
    "avoid": [
      "서브타이틀(h3/h4) 앞 장식 아이콘",
      "Form Label 앞 장식 아이콘",
      "본문 텍스트 앞 decorative icon",
      "일부 헤딩에만 icon 사용 (한 화면 안에서 불일치)",
      "hierarchy 와 무관한 icon 추가 (강조용으로 색만 다른 아이콘 끼우기)",
      "모든 텍스트 앞에 icon 사용 — affordance 가 없는 장식",
      "colorful icon 과다 사용 / 의미 없는 emoji",
      "아이콘 스타일 혼용 (Line + Filled 가 같은 그룹에서 공존)",
      "앞 우선순위의 아이콘을 확인하지 않고 자체 SVG 생성"
    ]
  },
  "iconography": {
    "name": "iconography",
    "metrics": {
      "sizeScale": "12 / 16 / 20 / 24 / 32 / 48 px",
      "defaultSize": "24px",
      "minSize": "12px",
      "fillThreshold": "≤15px 권장 스타일 = Filled",
      "minTouchArea": "40px",
      "touchAreaIcon20": "40px",
      "touchAreaIcon24": "44px",
      "selectionPriority": "project-specific icon → NudgeEAP default icon → mockup default icon package(MockupLinear*/MockupBold*) → generated custom SVG",
      "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=379-490",
      "categories": "basic, navigation, action, media, state-reaction, location, eap-service, color",
      "tracks": "mono (2114, currentColor) | multicolor (61, style-locked project signature)",
      "importPaths": "@nudge-design/icons (flat, backward-compat) | @nudge-design/icons/mono | @nudge-design/icons/multicolor | @nudge-design/icons (MonoIcons / MultiIcons namespace)"
    },
    "summary": "Figma Iconography(379:490) 라이브러리 기준 아이콘 사이즈·터치 영역·Line/Filled 스타일·카테고리 전반 가이드. 컬러 토큰은 get_guide({ topic: 'pattern:icon-color' })와 함께 본다.",
    "rules": [
      "**아이콘 선택 필수 우선순위**: 프로젝트 전용 아이콘(Geniet*/Trost* 등) → NudgeEAP 기본 프로젝트 아이콘 → 목업용 기본 아이콘 패키지(MockupLinear*/MockupBold*) → 자체 생성 SVG. 앞 단계에서 의미가 맞는 아이콘을 찾을 수 있으면 뒤 단계로 내려가지 않는다.",
      "목업용 기본 아이콘은 Figma 5000+ Icon Set 의 linear/bold 계열을 `MockupLinear*Icon`, `MockupBold*Icon` 으로 등록한 fallback 패키지다. 기본 액션/내비게이션은 MockupLinear, 활성/강조/작은 크기에는 MockupBold 를 우선 검토한다.",
      "기본 사이즈는 24px. 인터페이스 용도에 맞춰 12 / 16 / 20 / 24 / 32 / 48 px의 6단계만 사용한다. 최소 사이즈는 12px.",
      "15px 이하의 작은 사이즈에서는 시각 복잡도를 낮추기 위해 Fill(Filled) 스타일을 우선 사용한다. (Line은 얇은 선이 손상되어 보임)",
      "기본 액션·내비게이션 아이콘은 Line(Stroke) 스타일을 우선한다. 현재 활성 상태(GNB 활성 탭, 좋아요 ON 등)와 강조용 단일 아이콘은 Filled를 사용한다.",
      "한 화면에서 Line 과 Filled 를 같은 의미 그룹 안에서 섞지 않는다. 같은 GNB · 같은 카드 리스트 · 같은 툴바 안에서는 한쪽으로 통일한다.",
      "단독 아이콘 버튼(IconButton 포함)의 터치 영역은 최소 40px. 사이즈별 권장: 20px 아이콘 → 40px touch, 24px 아이콘 → 44px touch. 40px 미만은 접근성 위반.",
      "아이콘 자체에 padding 을 직접 주지 말고 IconButton 의 size prop 또는 부모 컨테이너 padding/min-width 로 터치 영역을 확보한다.",
      "네이밍 컨벤션: 기본 Line = `XIcon`, Filled 짝 = `XActiveIcon` 또는 `XOnIcon` (예: HomeIcon ↔ HomeActiveIcon, SleepmodeOffIcon ↔ SleepmodeOnIcon). 짝 정보는 ICON_METADATA[name].pair 로 확인.",
      "**명명 규칙 SSOT = `packages/icons/README.md` \"명명 규칙\" 섹션** (하드 게이트 `check-icon-naming.mjs` 가 kebab·철자·`-solid`·`*-circle` 어순을 강제). 파일명 = export 이름이라 rename 은 외부 API breaking → changeset(minor) 필수. 패턴 `icon-{project?}-{name}-{modifier?}` · 어순 **명사-수식어**(`check-circle`, ❌`circle-check`) · 도형 **화살표(`arrow-*`) ≠ 셰브론(`chevron-*`)**, 기능명(`back`/`next`) 금지 · 철자 올바른 영어(`alarm`·`location`·`image`, 검색 클리어=`search-delete`).",
      "**프로젝트 아이콘은 자기 슬러그 prefix 로 자기 세트를 유지**(`runmile-home`·`runmile-search` 등) — 범용 공유 아이콘(`home`/`search`/`calendar`)과 글리프가 달라 prefix 를 떼면 다른 프로젝트의 공용 아이콘을 덮어써 시각 회귀가 난다. 그래서 프로젝트 UI 아이콘을 \"범용화(prefix 제거)\" 하지 않는다. 시그니처(`runmile-shoe`·`runmile-shoe-color`)도 prefix 유지.",
      "**채움/상태 접미사는 레포 SSOT(축 분리)**: 시각 채움 = `-solid`/`-line` · 폼/토글 = `-on`/`-off` · 네비 선택 = `-active`. ⚠ 런마일 Figma 아이콘 네이밍 가이드([node 5016:43](https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/?node-id=5016-43))는 채움 `-fill` + 상태 전부 `-active`/`-inactive` 통일을 제안하나, **레포 명명 SSOT(노션 미러)가 governing** 이라 `-solid` + 축 분리를 유지한다. 5016:43 은 런마일 프로젝트 아이콘 8 카테고리의 설계 근거 레퍼런스로 본다.",
      "카테고리 8종(basic / navigation / action / media / state-reaction / location / eap-service / color)은 의미 분류일 뿐 강제 import 경로 분리가 아니다. find_icon 결과의 카테고리는 유사 의미 후보를 찾는 힌트로 사용.",
      "컬러(다색) 카테고리 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger, Siren) 전용이다. 일반 UI 강조에 색 아이콘을 끼워 넣지 않는다.",
      "**Mono vs Multicolor 트랙 분리** (SEED 스타일) — `@nudge-design/icons` 는 두 트랙으로 나뉜다. Mono(2114개, `currentColor` 만 사용해서 `color` prop 으로 자유 변경) 와 Multicolor(61개, 프로젝트 시그니처 — Trost mental 일러스트·Trost 결과 아이콘(TestresultSafe/Warning/Danger)·rating StarHalf·MenuActive·AlarmDot·Book·Medal·EnergyCoin·Geniet 프로젝트 아이콘·CashwalkBiz GNB chat/member 등 — 내부 accent 색 잠금). UI chrome(navigation/action/state)은 mono, 서비스 시그니처/주요 진입점은 multicolor.",
      "**Import 경로 선택**: 기본은 root flat `import { CalendarIcon } from '@nudge-design/icons'` (백워드 호환). 자동완성 범위를 좁히고 카테고리를 분명히 하려면 subpath `import { CalendarIcon } from '@nudge-design/icons/mono'` 또는 `import { GenietSaladIcon } from '@nudge-design/icons/multicolor'` 사용. namespace 형 `import { MonoIcons, MultiIcons } from '@nudge-design/icons'` 도 가능.",
      "**Multicolor 컬러 override 금지** — multicolor 아이콘의 `color` prop 은 base(`currentColor` 사용 영역)만 바꾼다. 내부 accent(`#FFF` 등)는 SVG 에 고정되어 있으니 SVG 를 직접 편집하지 말 것.",
      "필요한 아이콘이 프로젝트/NudgeEAP/Mockup 패키지 어디에도 없을 때만 인라인 `<svg>` 또는 신규 SVG 추가를 검토한다. 신규 추가 시 mono 아이콘은 `packages/icons/svg/mono/`, multicolor 아이콘은 `packages/icons/svg/multicolor/` 에 kebab-case 로 저장한 뒤 `pnpm --filter @nudge-design/icons build` 로 컴포넌트를 재생성한다. viewBox 는 0 0 24 24, mono 의 stroke/fill 은 `currentColor` 로 유지."
    ],
    "avoid": [
      "프로젝트 전용 아이콘이 있는데 NudgeEAP/Mockup 아이콘으로 대체",
      "NudgeEAP 기본 아이콘이 있는데 Mockup 아이콘으로 대체",
      "MockupLinear*/MockupBold* 검색 없이 자체 생성 SVG 사용",
      "12 / 16 / 20 / 24 / 32 / 48 외의 임의 사이즈 (예: 18px, 22px) 사용",
      "12px 미만 아이콘",
      "15px 이하에서 가는 Line 스타일을 그대로 사용 — Filled 로 교체",
      "동일 화면 / 동일 그룹에서 Line + Filled 스타일 혼용",
      "단독 IconButton 의 터치 영역을 40px 미만으로 두기",
      "아이콘 컴포넌트를 인라인 `<svg>` 로 직접 작성하기 — `@nudge-design/icons` 사용",
      "컬러(다색) 아이콘에 color prop 강제 적용 — 다색 표현이 어긋남",
      "multicolor 아이콘 SVG 내부 accent 색을 임의로 편집하기 — 스타일이 잠겨있음. 프로젝트 변경이 필요하면 디자인팀과 협의해 새 SVG 등록.",
      "mono 아이콘을 `packages/icons/svg/multicolor/` 에, multicolor 아이콘을 `packages/icons/svg/mono/` 에 잘못 배치하기 — generate.js 가 카테고리별 export 를 만들기 때문에 위치가 곧 카테고리."
    ]
  },
  "multi-screen": {
    "name": "multi-screen",
    "examples": [
      {
        "verdict": "good",
        "source": "<div class=\"mockup-canvas\">\n  <section class=\"mockup-screen\" data-device=\"mobile\" data-label=\"홈\">\n    <nds-project-header project=\"runmile\" surface=\"mobile\"></nds-project-header>\n    <main style=\"flex:1; padding: var(--semantic-inset-screen);\">…</main>\n  </section>\n  <section class=\"mockup-screen\" data-device=\"webview\" data-label=\"상세\">\n    <nds-project-header project=\"runmile\" surface=\"webview\"></nds-project-header>\n    <main style=\"flex:1; padding: var(--semantic-inset-screen);\">…</main>\n  </section>\n</div>\n<!-- 화면 2개 → 상단 전환 탭 자동(홈/상세). 기본 탭, '전체'로 나란히. -->",
        "caption": "각 스크린이 자체 헤더 + device 최소높이로 자기완결. 화면 2개라 탭 스위처 자동 — 기본은 한 번에 한 화면(미리보기 친화), '전체'로 나란히 비교."
      },
      {
        "verdict": "bad",
        "source": "<main style=\"max-width:720px;margin:0 auto;\">…홈…</main>\n<main style=\"max-width:720px;margin:0 auto;\">…상세…</main>\n<style>@media(max-width:600px){.web-header{display:none}}</style>",
        "caption": "max-width 컨테이너로 세로로 쌓고(높이는 내용에 맡김) 헤더는 미디어쿼리 토글 — 디바이스 프레임도 자기완결도 없음."
      }
    ],
    "metrics": {
      "canvasClass": "mockup-canvas",
      "screenClass": "mockup-screen",
      "deviceFrames": "mobile 390×844 / webview 390×720 / web 1440×900 / tablet 834×1112",
      "defaultMode": "tabs (화면 ≥2 자동) · data-mode='grid' 로 나란히"
    },
    "summary": "한 HTML 파일에 여러 화면을 '화면처럼' 보여주는 디바이스 프레임 + 탭 스위처 패턴. 회고: 스크린 높이를 내용에 맡겨(min-height 없음) 화면마다 제각각이고, 각 스크린이 자체 헤더/푸터도 없어 디바이스가 아니라 하나의 긴 페이지로 보였다. → .mockup-canvas 안에 .mockup-screen[data-device] 프레임을 나열하고, 각 스크린은 자체 헤더(+필요시 푸터) + device 최소높이로 자기완결시킨다. 화면이 2개 이상이면 런타임이 상단에 전환 탭을 자동 주입(기본 '탭' = 한 번에 한 화면, '전체' = 옆으로 나란히). 프레임 CSS/JS 는 build_singlefile_html 이 자동 inline — 클래스만 쓰면 된다(별도 <style>/스크립트 불필요).",
    "rules": [
      "여러 화면 = `.mockup-canvas` > `.mockup-screen` N개. 프레임마다 `data-device='mobile|webview|web|tablet'` 로 디바이스 폭+최소높이를 정한다(mobile 390×844 / webview 390×720 / web 1440×900 / tablet 834×1112).",
      "각 `.mockup-screen` 은 자기완결: 자체 `<nds-project-header surface=…>`(+필요시 `<nds-project-footer>`) + device 최소높이. 내용이 짧아도 device 높이를 유지해 '화면'처럼 보인다 — 높이를 내용에 맡기지 말 것.",
      "화면 ≥2 → 런타임이 상단 전환 탭을 자동 생성(탭 라벨 = 각 스크린 `data-label`, 없으면 '화면 N'). 기본 모드 '탭'(한 번에 한 화면 — 미리보기 친화), 스위처의 '전체' 또는 `<div class=\"mockup-canvas\" data-mode=\"grid\">` 로 옆으로 나란히 비교.",
      "프로젝트 헤더는 프레임 안에서 `<nds-project-header project surface='web|mobile|webview'>` — surface 로 디바이스별 헤더(PC GNB / 모바일 컴팩트 / 웹뷰 뒤로가기)가 자동 분기. base `<nds-header>` 손수 조립 금지.",
      "프레임/스위처(.mockup-canvas · .mockup-screen)는 목업 전용으로 빌드가 자동 inline — `<style>` 에 `.screen{width:…}` 나 미디어쿼리 토글을 직접 쓰지 말 것(클래스만 사용).",
      "단일 화면 목업이면 `.mockup-screen` 하나(또는 캔버스 없이 `<main>` 하나)로 충분 — 탭은 화면이 2개 이상일 때만 자동 생성."
    ],
    "avoid": [
      "스크린 높이를 내용에 맡겨(min-height 없이) 화면마다 높이가 제각각",
      "각 스크린에 자체 헤더/푸터 없이 하나의 긴 페이지로 쌓기",
      "@media 로 모바일/웹 헤더를 display 토글 (동시 비교 불가)",
      "base <nds-header> + nds-header-logo/menu 손수 조립으로 프로젝트 GNB 흉내",
      "디바이스 프레임 너비/높이를 <style> 에 손으로 재정의 (.mockup-screen[data-device] 프리셋 사용)"
    ]
  },
  "multi-step-form": {
    "name": "multi-step-form",
    "summary": "다단계 폼(마법사)은 **DS 컴포넌트가 아니라 조립 패턴**이다. 진행 표시·단계 헤더·이전/다음 풋터는 이미 있는 조각(Stepper / Heading / FormSection / cta-group)이고, 다단계의 진짜 어려움(단계별 검증, 단계 간 데이터 보관, 뒤로 갔다 와도 값 유지, 비동기 검증, 제출)은 **앱이 소유하는 상태머신**이다. 예전 `<MultiStepForm steps={…} canProceed>` 컨테이너는 칠하는 픽셀이 progress+header+footer 뿐이고 어려운 건 전부 `canProceed` boolean 으로 떠넘기는 얇은 셸이라, 실사용 0·Figma 노드 없음으로 제거(강등)했다. 다단계 흐름은 아래 **조립 계약**을 그대로 따른다 — 새 셸 컴포넌트를 만들지 말 것. (단계 진척 *표시*만 = component:Stepper, 시간순 로그 = component:Timeline.)",
    "rules": [
      "⓪ 레이아웃을 먼저 고른다 — **화면전환(screen-swap)** vs **누적 노출(progressive disclosure)**. 둘 다 정규 패턴이고 상태 계약(①·③·④)은 동일, **표시 방식만** 다르다:\n- **화면전환** (기본 · 긴 마법사 · 단계별 검증 많음 · 회원가입/온보딩) — 한 번에 한 단계 본문만 보이고 갈아끼움. 진행=`Stepper`, 풋터=`이전(secondary)+다음/제출(primary)` 한 행(아래 ②). 단계 4+ 거나 단계마다 무거운 검증이면 이쪽.\n- **누적 노출** (짧은 모바일 폼 · 리뷰 작성처럼 단계 2~5개 · 한 화면 스크롤) — 완료한 단계가 **위에 그대로 남고 다음 단계가 아래로 추가 노출**된다. 진행=상단 **슬림 `ProgressBar`(N/총단계)**, **이전/다음 버튼 없음**(스크롤로 위 단계 수정), 풋터는 **마지막 단계에서만 취소/제출**. 6칸 스텝퍼를 좁은 모바일에 욱여넣지 말 것. 단계 사이 구분선은 `Divider`(상하 대칭 spacing — `component:Divider`).",
      "① 상태는 앱이 소유한다(MUST) — 부모가 (a) 현재 단계 인덱스, (b) **모든 단계의 입력값을 한 state 객체**, (c) 단계별 유효성을 보관한다. 각 단계 컴포넌트에 값을 흩뿌리지 말 것 — 단일 SSOT 라야 뒤로/앞으로가 안전하다. (누적 노출도 동일 — 완료 단계 값은 state 에 남고 화면엔 계속 보인다.)",
      "② (화면전환 한정) 구조는 4단 수직 스택으로 고정(MUST) — 위에서 아래로 **진행(Stepper) → 헤더(Heading) → 본문(FormSection/FormField) → 풋터(cta-group)**. 순서·구성을 바꾸지 말 것.\n- 진행 = `Stepper`(이산 단계, `current`=단계 인덱스). 단순 % 진행만이면 `ProgressBar` 도 가능하나 단계가 셀 수 있으면 Stepper 가 우선.\n- 헤더 = `Heading`(현재 단계 title + description). 단계마다 교체.\n- 본문 = `FormSection`/`FormField` 입력. 검증·합성은 pattern:form-validation 을 그대로 따른다.\n- 풋터 = pattern:cta-group — **이전(secondary) + 다음/제출(primary)** 한 행.",
      "③ 전진은 게이팅한다(MUST) — 현재 단계가 **유효하기 전엔 '다음' 버튼을 disabled**. 클릭만으로 무효 단계를 넘기지 말 것(soft gate 금지). 검증 시점은 pattern:form-validation(onBlur + 단계 제출 시 일괄).",
      "④ 값은 보존한다(MUST) — '이전' 후 다시 '다음' 하면 입력했던 값이 **그대로 복원**돼야 한다. 단계 전환으로 본문을 언마운트해 값을 잃지 말 것 — 값은 ①의 부모 state 에 남고 본문만 갈아끼운다.",
      "⑤ 비동기 검증은 게이트에 묶는다(MUST) — 중복확인·인증 같은 async 결과는 boolean 으로 ③ 게이트에 연결. 대기 중엔 '다음' 버튼 로딩, **낙관적 전진 금지**(응답 전 다음 단계로 못 감).",
      "⑥ 제출 계약(MUST) — 마지막 단계의 primary 는 '제출'(submitLabel). 제출 중 버튼 비활성+스피너, 폼 비활성. 서버 오류는 **모든 단계 값 보존** + 상단 Alert(component:NoticeAlert). 성공은 Toast + 다음 화면 이동.",
      "⑦ 접근성(MUST) — Stepper 현재 단계 `aria-current=\"step\"`. 단계 전환 시 **포커스를 새 단계 Heading 으로 이동**. 에러는 스크린리더에 알림(role/aria-live).",
      "⑧ 컴포넌트 승격 기준(governance) — 다단계 셸을 다시 DS 컴포넌트로 만들려면 **2개 이상 프로젝트의 실제 채택 + Figma 가이드 노드** 둘 다 충족해야 한다. 둘 중 하나라도 없으면 이 패턴으로 조립한다(예전 셸이 제거된 이유)."
    ],
    "avoid": [
      "짧은 모바일 폼(리뷰 작성 등)에 **6칸 스텝퍼 + 이전/다음 풋터를 욱여넣기** — 단계 라벨이 잘리고 UI 가 답답하다. 단계 2~5개·모바일이면 누적 노출(⓪: 슬림 ProgressBar, 이전/다음 없음)을 쓴다.",
      "누적 노출인데 단계마다 **화면을 통째로 갈아끼워 위 단계가 사라지기** — 누적 노출의 핵심은 완료 단계가 위에 남는 것. 갈아끼울 거면 화면전환 모델로.",
      "진행+헤더+풋터만 그리고 어려운 건 `canProceed` boolean 으로 떠넘기는 **얇은 래퍼 컴포넌트를 새로 만들기** — 직접 조립 대비 가치가 없어 제거된 안티패턴이다.",
      "검증 없이 클릭으로 단계 전진(soft gate) — ③ 위반.",
      "'이전' 시 본문 언마운트로 입력값 소실 — ④ 위반.",
      "단계 값을 각 단계 컴포넌트 로컬 state 나 URL 에만 분산 보관 — 뒤로/앞으로 버그. 부모 단일 state 가 SSOT.",
      "이산 단계에 ProgressBar 를 하드코딩 %로 — 셀 수 있으면 Stepper.",
      "비동기 응답 전 낙관적 전진 — ⑤ 위반.",
      "진행/버튼 색을 raw hex — semantic/state 토큰으로 5 프로젝트 자동 대응."
    ],
    "_readyMade": {
      "note": "다단계 폼 1단계의 정규 조립 골격. 상태머신(단계 인덱스·단계별 값·유효성)은 **앱이 소유**하고, 아래 마크업의 `Stepper.current`·본문·'다음' `disabled`·헤더 텍스트를 앱이 단계마다 갈아끼운다. 색은 모두 토큰 — hex 직접 지정 금지.",
      "html": "<!-- 다단계 폼 = 조립 패턴. 단계 인덱스/값/유효성은 앱 state. -->\n<form style=\"display:flex; flex-direction:column; gap:24px; max-width:480px\">\n  <!-- ① 진행: Stepper.current = 앱의 단계 인덱스 -->\n  <nds-stepper\n    current=\"0\"\n    steps='[{\"key\":\"info\",\"label\":\"정보 입력\"},{\"key\":\"verify\",\"label\":\"본인 인증\"},{\"key\":\"agree\",\"label\":\"약관 동의\"}]'>\n  </nds-stepper>\n\n  <!-- ② 헤더: 단계마다 교체 -->\n  <nds-heading title=\"정보 입력\" description=\"기본 정보를 입력해 주세요\"></nds-heading>\n\n  <!-- ③ 본문: 현재 단계의 입력(검증=pattern:form-validation). 단계 전환 시 값은 앱 state 에 보존 -->\n  <nds-form-section>\n    <nds-form-field label=\"이름\">\n      <nds-input placeholder=\"이름\"></nds-input>\n    </nds-form-field>\n    <nds-form-field label=\"이메일\">\n      <nds-input type=\"email\" placeholder=\"name@example.com\"></nds-input>\n    </nds-form-field>\n  </nds-form-section>\n\n  <!-- ④ 풋터: cta-group(이전 secondary + 다음 primary). '다음'은 현재 단계 유효 전까지 disabled -->\n  <div style=\"display:flex; gap:12px\">\n    <nds-button variant=\"outlined\" style=\"flex:1\">이전</nds-button>\n    <nds-button variant=\"primary\" style=\"flex:1\" disabled>다음</nds-button>\n  </div>\n  <!-- 마지막 단계에서만 '다음' → '제출'(submitLabel) + 제출 중 disabled+스피너 -->\n</form>"
    }
  },
  "notice": {
    "name": "notice",
    "metrics": {
      "maxColoredNoticePerScreen": 1,
      "maxEmphasisDevicesPerNotice": 2,
      "variantCount": 5,
      "maxDistinctVariantsPerScreen": 3,
      "maxSameVariantPerScreen": 2,
      "sizeOneLinePx": 52,
      "sizeTwoLinePx": 72,
      "containerPaddingPx": 16,
      "containerGapPx": 8,
      "containerRadiusPx": 8,
      "maxWidthPx": 800,
      "iconSizePx": 20
    },
    "figmaNodeUrl": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=984-6787",
    "references": [
      {
        "label": "Cashpobi Alert 디자인 가이드",
        "url": "https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=984-6787",
        "caption": "캐포비 라이브러리의 인라인 알림 박스 가이드 — 5 variant(info/Notice/Caution/Success/Error)·2 size(52/72)·anatomy·Usage 경계·DO/Don't. 이 DS에서는 notice 패턴으로 흡수.",
        "project": "cashwalk-biz"
      }
    ],
    "summary": "안내문/콜아웃/인라인 알림 박스의 강조 예산 + variant·size·구성 규칙. 컨텐츠 영역에 인라인으로 놓여 명시적으로 닫을 때까지 유지되는 메시지(정보·공지·주의·완료·오류). 페이지 상단 전역 띠는 Banner, 자동 사라지는 피드백은 Toast/Snackbar, 즉각 판단 요구는 Modal — 인라인 지속 메시지만 이 패턴. **구현체 = NoticeAlert 컴포넌트** (`<NoticeAlert>` / `<nds-notice-alert>`, get_guide({ topic:'component:NoticeAlert' })).",
    "rules": [
      "안내문은 기본적으로 neutral surface와 본문 텍스트로 처리.",
      "주의/성공/오류처럼 의미가 명확한 경우에만 semantic color 사용.",
      "한 안내 영역에는 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 최대 2개만 사용.",
      "그라데이션은 금지. 캠페인/히어로가 아닌 안내문에는 단색 토큰만 사용.",
      "새로 생긴 섹션이라는 이유만으로 배경색/아이콘/배지를 추가하지 않음.",
      "variant 5종 중 의미에 맞게 1개 선택 — info(중립 회색·기본 톤) / Notice(블루·차분한 공지) / Caution(옐로우·강조 주의) / Success(그린·완료·성공) / Error(레드·오류·조치 필요).",
      "구성요소 3개 — ① Container: padding 16 · gap 8 · radius 8 · 가로 max 800 ② Icon 20×20: variant별 의미 강화 ③ Body: Body3 Medium · Text/Subtitle/Default.",
      "size 2종 — 1줄 52px / 2줄 72px. 텍스트 길이에 따라 박스 높이 자동 조정. 성공·오류는 1줄(52), 정보·주의는 2줄(72) 권장.",
      "본문은 1-2줄로 짧고 명확하게. 색은 임의 hex 금지 — semantic token(semantic-info-bg / semantic-info-text 등)으로 binding.",
      "색 배경 강조 박스는 화면당 1개 권장(DS 원칙). 부득이 혼용하더라도 서로 다른 variant 3종·같은 variant 2개를 넘기지 않는다."
    ],
    "avoid": [
      "gradient + icon + badge + bold headline 동시 사용",
      "일반 안내문에 Chip으로 '안내', '추천', '확인' 라벨 반복",
      "안내 박스 안에 다시 강조 카드/강조 배지를 중첩",
      "한 화면에 4종 이상 variant 동시 표시",
      "Error variant를 단순 정보 안내에 사용",
      "본문 3줄 이상을 인라인 메시지에 담기 — Modal로 분리",
      "임의 색상 직접 지정 — semantic token 미사용"
    ]
  },
  "nudge-eap-card": {
    "name": "nudge-eap-card",
    "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=713-2",
    "summary": "넛지EAP 서비스 카드(App·Web·PC) 생성 규칙 SSOT(Figma 713:2 CardRulesGuide). Card 컴포넌트(component:Card)의 Compound 슬롯을 쓰되, **넛지EAP 도메인 한정**으로 Geniet 도메인 카드와 다른 두 규칙을 적용한다 — ① **내부 CTA 허용**(상담 예약·전문가·프로그램 카드는 카드 최하단 CTA 1개를 가짐), ② **shadow 전면 금지**(카드 구분은 border 1px 로만, box-shadow/elevation 금지). Title 이 유일한 Required, 나머지 슬롯(Thumbnail·Avatar·Badge/Chip·Description·Metadata·CTA·Footer)은 모두 Optional 이며 화면 목적에 따라 조합한다. 색은 semantic 토큰만 — White/Surface bg, Border/Default, Project Color 는 CTA·인디케이터에만.",
    "rules": [
      "Anatomy — Title(필수·Primary, 생략 불가) + Optional: Thumbnail(max 1, Avatar와 배타) · Avatar(max 1, Thumbnail과 배타) · Badge/Chip(max 2) · Description(max 3줄, line-clamp) · Metadata(max 2항목, Muted 12–13px) · CTA(max 1) · Footer(min-h 40, border-top + padding-top 16).",
      "Surface — Background: White 또는 Surface/Neutral 토큰만. Border: 1px `--semantic-border-default`(#E2E6EA). **Border-radius: 12px 고정**(radius[12]). **Shadow 사용 금지** — border 로만 카드 구분(넛지EAP 서비스 카드는 elevation 미사용).",
      "Spacing — Padding 16(min)~24(max) 전 방향 동일. 카드 간 gap 8(min)~16(max). 요소 간: Title↔Description 4px · Description↔Metadata 8px · Metadata↔CTA 16px. Footer separator: border-top 1px + padding-top 16px.",
      "Hierarchy(폰트 Pretendard) — Title=Headline5 Bold 18/26(`--font-size-headline-5`) 항상 최강조 · Description=Body3 Regular 14/20(`--font-size-body-3`) · Metadata=Caption1 Regular 13/18(`--font-size-caption-1`) Muted 필수 · CTA=Body3 Medium 14/20. Title 외 Primary 강조 1개 초과 금지.",
      "CTA 유형 4종(카드 컨텍스트별, 임의 크기 변형 금지) — ① Full-width: Btn Large 48px, 카드 너비 100%, radius 8, Solid/Primary(Project bg·white), Mobile/App 콘텐츠·프로그램 카드. ② Compact: Btn Small 40px, auto(min 80), radius 6, Outlined 또는 Solid/Primary, 요약·수치·공간 제약 카드. ③ Icon+Text: Btn Medium 44px, icon 16 + text(간격 6), radius 8, PC 상담 예약·전문가·퀵 액션 카드. ④ Ghost/Link: Text Button, \"더 보기\"·\"자세히\" 보조 액션, Project Color 텍스트 + underline/chevron.",
      "CTA 위치 — 항상 카드 최하단. Primary CTA 1개 원칙. clickable 카드 전체 + 내부 CTA 를 함께 쓸 땐 CTA 가 카드의 단일 Primary 액션이 되도록(중복 핸들러 주의)."
    ],
    "avoid": [
      "임의 pastel/gradient/opacity 배경(#E8F4FD·#FFF8E1·linear-gradient·rgba) — White/Surface 토큰 외 배경 금지.",
      "box-shadow / drop-shadow / elevation 레벨 — 넛지EAP 카드는 border-only.",
      "Project Color(#2B96ED) 카드 배경 — Project 는 CTA·인디케이터 전용. 카드 bg 로 채우기·project gradient 헤더 금지.",
      "Nested Card(카드 안 카드·bordered 박스 흉내) — List/Table/Section 으로 대체.",
      "Decorative/빈 카드·Title 없는 카드·아이콘만 든 카드.",
      "Badge+Chip+CTA+Metadata 4개 동시 — Optional 은 최대 2개 권장(정보 위계 붕괴).",
      "CTA 2개 이상·CTA 를 상단/중간 배치 — Primary 1개, 항상 최하단.",
      "radius/CTA 크기 임의 변형 — radius 12 고정, CTA 는 위 4종 크기만."
    ]
  },
  "nudge-eap-form-layout": {
    "name": "nudge-eap-form-layout",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 39:6004 PC_상담신청서",
        "caption": "WebHeader 80 → 28 Bold 타이틀 → 800px rail → 라벨-위 + soft #FAFAFA 필드 h-48 rounded-8 → 비밀유지 타일 → 센터 inline CTA w-328 h-48 rounded-8 #2b96ed."
      }
    ],
    "metrics": {
      "viewport": "desktop 1920px, content rail 800px center",
      "webHeaderHeight": "80px",
      "pageTitle": "Pretendard Bold 28/38 #111",
      "labelLayout": "label-above (single column 800px)",
      "labelTypography": "Pretendard Medium 13/18 #383838 (Input Typography 표준, Figma 4247:1964 · 프로젝트 무관)",
      "requiredMarker": "라벨 옆 ' *' #F13F00",
      "fieldHeight": "48px",
      "fieldRadius": "8px",
      "fieldBorder": "1px #D8D8D8",
      "fieldBg": "#FAFAFA (soft off-white)",
      "fieldPadding": "16×14",
      "interFieldGap": "36px",
      "labelToFieldGap": "12px",
      "helperToLabelGap": "4px",
      "helperTypography": "Pretendard Regular 13/18 #383838 (Input Typography 표준, Figma 4247:1964)",
      "ctaPosition": "inline at page-end, center",
      "ctaSize": "w-328 h-48 rounded-8",
      "ctaPrimary": "#2b96ed + white Bold 16/24",
      "ctaDisabled": "#9CA2AE + white",
      "confidentialityTile": "bg #FAFAFA rounded-8 p-16 w-800 + InfoIcon + Medium 14/20 #666",
      "moodSliderColors": "selected #2b96ed, unselected #13BFA2, gap 2px",
      "maxPrimarySolidPerScreen": 1,
      "validationTiming": "onBlur or submit",
      "relatedPatterns": "cta-group, nudge-eap-home-layout"
    },
    "figmaNodeUrl": "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=39-6004",
    "references": [
      {
        "label": "NudgeEAP 고객 폼 SSOT — PC_상담신청서 (Figma 39:6004)",
        "image": "references/nudge-eap-form-39-6004.png",
        "caption": "NudgeEAP 고객사용 폼 페이지 SSOT 스크린샷 (desktop 1920, rail 800). 본 가이드 metrics 는 이 노드 실측 기준.",
        "project": "nudge-eap"
      }
    ],
    "summary": "NudgeEAP 고객사용(B2B EAP customer) 폼 페이지 레이아웃 — 'WebHeader 80 + 800px rail → 28 Bold PageTitle → 라벨-위 단일 컬럼 → soft #FAFAFA 필드 h-48 rounded-8 → 비밀유지 안내 타일 → inline 센터 CTA w-328 rounded-8 #2b96ed' 표준. Figma 39:6004 (PC_상담신청서) 실측. **데스크탑 전용** — 모바일은 별도.",
    "rules": [
      "**뷰포트**: 데스크탑 1920px, 본문 rail **800px** 센터. 모바일 폼은 이 가이드 적용 X (별도 시안 필요).",
      "**WebHeader**: 80h 풀폭 white + bottom border `#ECECEC`. 좌측 로고 + 센터 6 nav (`Bold 18/26 #111`) + 우측 [로그인 #2b96ed]/[앱 다운로드 #F5F5F5 + blue 텍스트].",
      "**페이지 헤더**: 타이틀 Pretendard **Bold 28/38** (Headline 2) #111. step/progress indicator 없음.",
      "**필드 레이아웃 = 라벨-위 (label-above) 단일 컬럼** — 캐시워크 포 비즈니스 admin (인라인-좌측) 과 정반대. 800px rail 안 세로 흐름.",
      "**라벨 타이포**: Pretendard **Medium 13/18** (Input Typography 표준, Figma 4247:1964 · 프로젝트 무관) #383838. 필수 마커: 별표 `*` **`#F13F00`** (Coral Red) 라벨 뒤 인라인.",
      "**필드 컴포넌트**: 높이 **48px**, `radius 8px`, border 1px `#D8D8D8`, **bg `#FAFAFA`** (soft off-white — 멘탈케어 톤. 캐시워크 포 비즈니스 pure white 와 차이). padding 16×14.",
      "**그룹 간격**: 그룹↔그룹 **36px**, 라벨↔필드 **12px**, helper↔라벨 **4px**.",
      "**Helper 텍스트**: Pretendard Regular **13/18** (Input Typography 표준, Figma 4247:1964 · 색 #383838).",
      "**CTA**: 페이지 끝 inline + 센터. 단일 primary 버튼 (`신청서 제출하기`) **w-328 h-48 rounded-8 padding 12**, Bold 16/24 white. 활성 `#2b96ed`, disabled `#9CA2AE` + 흰.",
      "**비밀유지 안내 타일**: CTA 위 형제로 — bg `#FAFAFA`, `rounded-8 p-16 w-800`, InfoIcon + Medium 14/20 #666. 멘탈케어 폼의 시그니처 (e.g. '기관에서 연락드린 후 상담사가 최종 확정됩니다. 상담 신청 내용은 비밀이 보장되며, 회사에는 전달되지 않습니다.').",
      "**Mood slider (마음체크)**: 5점 horizontal color bar — 선택 `#2b96ed`, 미선택 `#13BFA2` (green/300), 셀 gap 2px, 양끝 라벨 Medium 14.",
      "**시간대/옵션 chip**: 동일 폭 inline 라디오 — white + border #D8D8D8 + rounded-8 + padding 16×12 + gap 12 + Medium 16 #666. RadioGroup 아닌 segmented selector 패턴.",
      "**약관 동의 타일**: 폼 끝 직전 full-width rounded-8 row, 라운드 체크박스 + Regular **14/20 #111** (다른 라벨 16 스케일과 차별).",
      "**플로팅 UI**: 우측 하단 scroll-to-top 56×56 circle shadow `0 1px 10px rgba(0,0,0,0.1)` + 채널톡 (`left-calc(100%-320px)`).",
      "**유효성 검사**: onBlur/submit (실시간 빨간 메시지 금지 — 멘탈케어 컨텍스트 거부감)."
    ],
    "avoid": [
      "라벨을 인라인-좌측 컬럼으로 정렬 — NudgeEAP 고객 폼은 label-above. (캐시워크 포 비즈니스 admin 패턴 혼동 적용 X).",
      "필드 bg pure white — 멘탈케어 컨텍스트는 soft off-white(`#FAFAFA`) 시그니처.",
      "필수 마커를 `#FF4141` 로 — NudgeEAP 는 `#F13F00` Coral Red.",
      "비밀유지 안내 누락 — 검사/상담 폼은 신뢰 확보 타일이 거의 필수.",
      "CTA 알약 (rounded-28+) — NudgeEAP 폼 CTA 는 rounded-8 정사각형.",
      "Project 블루 #2b96ed 를 disabled 톤으로 — disabled 는 cool-gray #9CA2AE.",
      "Mood slider 를 라디오 5개로 — NudgeEAP 는 horizontal color-bar.",
      "모바일 변형에 800px rail 적용 — 모바일 시안 확보 후 별도."
    ]
  },
  "nudge-eap-home-layout": {
    "name": "nudge-eap-home-layout",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 20:7250 NudgeEAP 고객 홈 (B2B 아모레퍼시픽)",
        "caption": "1920 + 1200 rail + WebHeader 80 + cream 히어로 812×400 + 3 blue-50 카드 + 24/32/16/8 radius 패밀리 + 채널톡 FAB."
      }
    ],
    "metrics": {
      "viewport": "desktop 1920px, content rail 1200px (gutter 360)",
      "pageBg": "#fff",
      "sectionBg": "#FAFAFA",
      "webHeaderHeight": "80px",
      "heroSize": "812×400 rounded-20 bg #FFEDD0",
      "heroTitle": "Bold 36 검정",
      "quickActionCard": "385×128 rounded-12 bg #F1F8FD padding 28×24 gap 23",
      "sectionHeading": "Bold 28/38 + 더보기 Bold 18/26 #666",
      "carouselCardStd": "240w rounded-16 bg #FAFAFA gap 24",
      "carouselCardFeatured": "440w rounded-16 bg #FFF7E6 + GO pill #FFA411",
      "letterCard": "385w + thumb 250h rounded-8 bg #EBEBEB",
      "noticeList": "border #ECECEC rounded-8 pt-24 pb-16 px-24, 52px rows, divider #EEE",
      "noticeBadgeNotice": "#DFF1FF / #007EE4 rounded-13 Bold 14",
      "noticeBadgeEvent": "#FCE3EC / #ED2E77",
      "bannerBrown": "#67544D + white pill CTA",
      "bannerBlue": "var(--semantic-bg-brand-default) + white pill CTA",
      "fabSize": "56×56 채널톡",
      "footerHeight": "1920×198 bg #F5F5F5",
      "projectPrimary": "var(--semantic-bg-brand-default)",
      "magentaAccent": "#ED2E77 (이벤트 한정)",
      "maxPrimarySolidPerScreen": 1,
      "whitelabel": "true (고객사 로고/명 + CMS 스트립 인사말)",
      "relatedPatterns": "nudge-eap-form-layout, nudge-eap-landing-layout, cta-group"
    },
    "figmaNodeUrl": "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=20-7250",
    "references": [
      {
        "label": "NudgeEAP 고객 홈 SSOT — 홈 1404 (Figma 20:7250)",
        "image": "references/nudge-eap-home-20-7250.png",
        "caption": "NudgeEAP 고객사용 홈 페이지 SSOT 스크린샷 (desktop 1920, 1200 rail, B2B 화이트라벨).",
        "project": "nudge-eap"
      }
    ],
    "summary": "NudgeEAP 고객사용(B2B EAP customer) 홈 페이지 레이아웃 — 'WebHeader 80 + CMS 스트립 + 1200 rail → cream 히어로 812×400 → blue-50 3카드 빠른 액션 → 캐러셀 (240w 표준 + 440w featured) → 주간레터 그리드 → 공지 list → 채널톡 FAB' 표준. Figma 20:7250 실측. 데스크탑 전용 1920w, B2B 화이트라벨.",
    "rules": [
      "**뷰포트**: 데스크탑 1920px 풀폭, 본문 rail **1200px** (gutter 360). bg pure white.",
      "**WebHeader**: 80h, 좌측 고객사 로고 200×60, 센터 6 nav (`Bold 18/26 #111`), 우측 [로그인 #2b96ed]/[앱 다운로드 #F5F5F5 + blue]. notification/profile icon 없음.",
      "**CMS 스트립**: 헤더 아래 풀폭, bg `#FAFAFA`, `py-14 px-360`. 고객사 인사말 Medium 16/24 + 보조 Regular 14/20.",
      "**히어로 배너**: 단일 카드 **812×400 rounded-20 bg #FFEDD0 (cream)** — 마음치유 톤. 타이틀 36 Bold 검정 + 16/24 Regular + 우측 하단 'rolling' pagination chip. 우측엔 banner 선택 그리드 (w-364, gap 16-18).",
      "**3-카드 빠른 액션**: 히어로 아래 3개 가로 CTA 카드, **385×128 rounded-12 bg #F1F8FD (blue/50) padding 28×24 gap 23**. 내부: 20/28 Bold 타이틀 + 16/24 #666 보조 + 80px 일러스트. 라벨: 바로 상담하기 / 상담사 찾기 / 상담 센터 찾기.",
      "**섹션 헤딩**: **28/38 Bold 검정** + 우측 '더보기' (18/26 Bold #666 + ChevronRight). 검사/주간레터/회사소식 반복 적용.",
      "**심리검사 캐러셀**: h-280, 카드 rounded-16 gap 24. 표준 **240w bg #FAFAFA**, featured **440w bg #FFF7E6 + 'GO' 원형 pill (#FFA411)**. 양 끝 chevron 버튼 68×68 원형 border #D8D8D8. 좌우 white gradient fade.",
      "**주간레터 그리드**: 3 × 385w 카드, 썸네일 **250h rounded-8 bg #EBEBEB** + 타이틀 20/28 Medium. gap 24.",
      "**공지 list (회사소식)**: border `#ECECEC rounded-8` 카드, `pt-24 pb-16 px-24`. 52px 행, divider #EEE. 배지 공지 `#DFF1FF / #007EE4`, 이벤트 `#FCE3EC / #ED2E77` rounded-13 Bold 14.",
      "**보조 배너 띠**: 1200×110-120 풀폭. brown `#67544D` + white pill (생활상담), `var(--semantic-bg-brand-default)` + white pill (앱 다운로드).",
      "**채널톡 FAB**: 우측 하단 56×56 원형. desktop 이므로 BottomNav 없음.",
      "**Footer**: 1920×198 bg `#F5F5F5`. 주소/사업자번호/연락처 14/20 Regular #383838 + ISO 27001 로고 우측.",
      "**컬러 토큰**: page bg #fff, section bg #FAFAFA, primary card `var(--semantic-bg-brand-subtle)`, featured #FFF7E6, thumb #EBEBEB, project `var(--semantic-bg-brand-default)`, magenta #ED2E77 (이벤트 한정).",
      "**B2B 화이트라벨**: 좌측 상단 로고가 고객사 (e.g. 아모레퍼시픽). NudgeEAP 자체 브랜딩은 footer 에만."
    ],
    "avoid": [
      "모바일 BottomNav 추가 — 데스크탑 홈은 채널톡 FAB 만.",
      "Greeting/Notification icon 을 헤더 우측에 — NudgeEAP B2B 헤더는 [로그인][앱 다운로드] 페어.",
      "Magenta `#ED2E77` 을 일반 강조에 — 이벤트 배지 한정.",
      "Hero 배경을 project blue 로 — cream/warm 톤 (`#FFEDD0`) 이 멘탈케어 시그니처.",
      "3-카드 빠른 액션을 4개 이상으로 — 3개가 위계 한계.",
      "심리검사 캐러셀 카드 색 다양화 — 표준 #FAFAFA + featured #FFF7E6 두 톤만.",
      "Banner strip 을 페이지 상단 추가 — hero 1개 + 중간 strip 1-2개가 한계.",
      "한 페이지에 primary `var(--semantic-bg-brand-default)` solid CTA 2개 이상."
    ]
  },
  "nudge-eap-landing-layout": {
    "name": "nudge-eap-landing-layout",
    "examples": [
      {
        "verdict": "good",
        "source": "Figma 323:939 NudgeEAP 랜딩 (PC_법정의무교육)",
        "caption": "1920/1400 rail + 80h header + 1920×480 split hero (no CTA) + 8 stacked sections gap=0 + 80h pill CTA + 510h dark footer + lead form 섹션."
      }
    ],
    "metrics": {
      "viewport": "desktop 1920px",
      "contentRailOuter": "1400px (gutter 260)",
      "contentRailInner": "1264px (gutter 328)",
      "webHeaderHeight": "80px",
      "heroSize": "1920×480 (split: text 520w + visual 800×400)",
      "heroHeadline": "~60-62 Bold (Display)",
      "heroCta": "none",
      "sectionGap": "0 (butt against, bg alternation)",
      "sectionTitleSymbol": "타이틀_pc 1400×74 (~40-44 Bold)",
      "cmsGrid": "2×2 card 620×455 col-gap 24",
      "eduGrid": "4-col card 300×350 icon 110 gap 16",
      "compareGrid": "3-col card 270×302 icon 120 gap 24",
      "stepGrid": "2×2 card 612×405 step-badge 72×44 col-gap 40 row-gap 64",
      "ctaPillHeight": "80px",
      "ctaPillRadius": "rounded-full",
      "ctaLabel": "~20-22 Bold (emoji prefix allowed)",
      "footerHeight": "1920×510 (dark corporate)",
      "tone": "corporate B2B HR SaaS",
      "leadFormReusesPattern": "nudge-eap-form-layout",
      "maxPrimarySolidPerScreen": "여러 (섹션별 반복 OK, 의도 통일)",
      "relatedPatterns": "nudge-eap-home-layout, nudge-eap-form-layout, cta-group"
    },
    "figmaNodeUrl": "https://www.figma.com/design/mvecozaRQoGRePffskRgmh/%F0%9F%8C%88-%EB%84%9B%EC%A7%80EAP---Dev?node-id=323-939",
    "references": [
      {
        "label": "NudgeEAP 랜딩 SSOT — PC_법정의무교육 (Figma 323:939)",
        "image": "references/nudge-eap-landing-323-939.png",
        "caption": "NudgeEAP 홍보/랜딩 페이지 SSOT 스크린샷 (B2B 도입 유치, 1920/1400 rail, 80h pill CTA, 8 stacked sections).",
        "project": "nudge-eap"
      }
    ],
    "summary": "NudgeEAP 홍보용 (B2B 도입 유치) 랜딩 페이지 레이아웃 — 'WebHeader 80 + 1400 rail → 1920×480 split 히어로 (CTA 없음) → 8 섹션 (gap 0, bg 교차) → 80h pill CTA → 510h dark footer + lead form' 표준. Figma 323:939 (PC_법정의무교육) 실측. 데스크탑 전용, 코퍼레이트 B2B HR SaaS 톤.",
    "rules": [
      "**뷰포트**: 데스크탑 1920px. outer rail **1400 (gutter 260)**, inner **1264 (gutter 328)**.",
      "**WebHeader**: 80h 풀폭 pinned. 디테일은 nudge-eap-home-layout 헤더 컨벤션 재사용.",
      "**히어로**: 1920×**480** 풀폭. **Split layout** — 텍스트 좌 (`left-260 top-216 w-520 h-208`) + 비주얼 우 (`left-920 800×400`). 헤드라인 ~60-62 Bold + 서브 ~28-32. **히어로 내 CTA 없음**.",
      "**섹션 블럭 패턴**: 8 섹션 모두 풀폭 stack. **gap 0** (butt against), 구분은 bg color 교차. 안 패딩: top 100 → 타이틀 74h → 122-138 gap → body → 100 bottom.",
      "**섹션 타이틀 심볼**: 1400×74 (`타이틀_pc`), 디스플레이 ~40-44 Bold.",
      "**카드 그리드**:\n  · CMS 기능 (2×2): 620×455 (image 620×303 + 텍스트 620×152, padding 25×24) col-gap 24\n  · 법정의무교육 4종 (4-col): 300×350, 아이콘 110×110 center top, gap 16\n  · EAP/웰니스 비교 (3-col): 270×302, 아이콘 120×120, gap 24\n  · 4단계 진행 (2×2): 612×405 + step badge `1단계` 72×44 pill, col-gap 40 row-gap 64",
      "**CTA 패턴**: 모든 CTA 는 **80h pill** (rounded-full), label hug + 54 horizontal padding. emoji prefix 허용 (⬇️ 👉) + 라벨 ~20-22 Bold. **히어로엔 없고 섹션 끝에만**.",
      "**중복 CTA OK**: 코퍼레이트 랜딩이라 같은 의도 CTA 가 섹션별로 반복 가능. 단, primary action 한 종류로 통일.",
      "**비교 표 (기존 vs 넛지EAP)**: 가로 비교 컬럼 + 체크/X 아이콘.",
      "**Lead form (도입 문의)**: 8번째 섹션 — 회사명/담당자/연락처/EAP 도입 여부 라디오. nudge-eap-form-layout 인풋 컨벤션 재사용 (label-above + #FAFAFA fill).",
      "**Footer**: 1920×**510** (dark corporate). 회사 정보/링크/문의/언어. home-layout 의 198h 라이트 footer 보다 키워 코퍼레이트 톤.",
      "**타이포 패밀리**: hero ~60-62, section title ~40-44, sub ~24-28, card title ~24, body ~16/1.6, CTA ~20-22 Bold.",
      "**톤**: 코퍼레이트 B2B HR SaaS — 정보 밀도 높음, 비교/스크린샷/단계별 중심. 'cream + soft' 톤은 아이콘/일러스트 한정."
    ],
    "avoid": [
      "히어로 안에 primary CTA — NudgeEAP 랜딩은 hero CTA 없음.",
      "섹션 간 gap 24/32/40 px — gap 0 butting + bg 교차가 표준.",
      "CTA 를 8h rounded-8 사각형 — 모든 CTA 가 80h pill.",
      "랜딩에 멘탈케어 soft 톤 (cream #FFEDD0) 을 헤드라인 배경으로 — soft 톤은 카드/아이콘 한정.",
      "단일 contact form 만 두고 섹션 CTA 누락 — 랜딩은 결과별 CTA 다회 노출.",
      "Lead form 을 별도 페이지로 분리 — 동일 페이지 마지막 섹션에 inline.",
      "Footer 를 200h 미만 라이트로 — 코퍼레이트 랜딩은 dark/dense."
    ]
  },
  "page-header": {
    "name": "page-header",
    "summary": "페이지 단위 헤더(제목 + 뒤로가기 + 브레드크럼 + 액션 + 하단 탭)는 **DS 컴포넌트가 아니라 조립 패턴**이다. 칠하는 픽셀이 전부 이미 있는 조각(Heading / Breadcrumb / IconButton / Button / Tab)이고, 예전 `<PageHeader title subtitle onBack breadcrumb actions bottom>` 컨테이너는 그 조각을 한 줄로 감싸기만 한 thin wrapper 라 — Figma 가이드 노드 없음 + Heading 합성 셸이라 제거(강등)했다(MultiStepForm 선례와 동일). AppBar(글로벌 네비)와는 다르다 — 이건 **콘텐츠 영역 안의 페이지 제목 블록**이다. 아래 조립 계약을 따른다.",
    "rules": [
      "① 제목은 `Heading` 으로(MUST) — `Heading level=\"h2\" as=\"h1\"`. 시각 스케일은 h2, 시맨틱은 페이지 랜드마크 h1. 부제는 Heading 의 `description`. 폰트·제목↔부제 gap·색은 **Heading 이 SSOT** — 따로 박지 말 것. (제목을 FormSection.title 로 흉내내지 말 것 — 그건 폼 섹션 제목.)",
      "② 구조는 위→아래 3행(MUST 순서) — **(선택)top row → main row → (선택)bottom row**:\n- **top row** (뒤로가기/브레드크럼 있을 때만): ← 뒤로가기(`IconButton`, 원형 32) + `Breadcrumb`. 화면 history 컨텍스트.\n- **main row** (space-between): 좌측 `Heading`(title + description) · 우측 액션 슬롯(`Button`/`IconButton`, pattern:cta-group 의 우측 hug).\n- **bottom row** (선택): `Tab`(탭형 페이지) 또는 `FilterBar`. 컨테이너 좌우 패딩을 상쇄해 풀블리드.",
      "③ 간격·여백은 토큰으로(MUST) — 컨테이너 `gap: --semantic-gap-comfortable`, `padding: --semantic-inset-card-large --semantic-inset-modal`. raw px 금지.",
      "④ 배경은 기본 투명(SHOULD) — 콘텐츠 위에 얹히는 제목 블록이라 기본 transparent. 흰 카드로 띄워야 하면 그 컨테이너에만 surface 토큰을 준다(프로젝트 admin 합의 따름).",
      "⑤ 하단 보더는 옵션(SHOULD) — 리스트/디테일 구분이 필요하면 `border-bottom: 1px var(--semantic-border-subtle-default)`. **캐포비 admin 은 끄는 게 규칙**(pattern:cashwalk-biz-page-* 참조).",
      "⑥ 액션은 우측 정렬 한 행(MUST) — pattern:cta-group 을 따른다. 주 액션 1개 + 보조 0~2개. 액션 폭주 금지.",
      "⑦ 접근성(MUST) — 페이지 제목은 문서에 h1 하나(Heading as=\"h1\"). 뒤로가기는 `aria-label`. 탭은 Tab 의 role=tablist 그대로.",
      "⑧ 컴포넌트 승격 기준(governance) — 다시 DS 컴포넌트로 만들려면 **2개 이상 프로젝트의 실제 채택 + Figma 가이드 노드** 둘 다 충족해야 한다(예전 셸이 제거된 이유)."
    ],
    "avoid": [
      "진척/조각만 감싸고 어려운 건 없는 **thin wrapper 컴포넌트를 새로 만들기** — 직접 조립 대비 가치가 없어 제거된 안티패턴.",
      "페이지 제목을 raw `<h1 style>` / `<div>` 로 — 타이포·시맨틱이 Heading 과 어긋난다. 항상 `Heading`.",
      "AppBar(글로벌 상단 네비)와 혼동 — AppBar 는 앱 셸 상단, 이건 콘텐츠 영역 안 페이지 제목.",
      "액션을 좌측·중앙에 흩뿌리기 — 우측 한 행(cta-group).",
      "색·간격 raw hex/px — semantic 토큰으로 5 프로젝트 자동 대응.",
      "캐포비 admin 에서 하단 보더 켜기 — admin 규칙 위반(pattern:cashwalk-biz-page-*)."
    ],
    "_readyMade": {
      "note": "페이지 헤더 조립 골격. 제목은 Heading(h2/as=h1), (선택)뒤로가기+Breadcrumb top row, 우측 actions, (선택)하단 Tab. 색·간격은 전부 토큰.",
      "html": "<!-- 페이지 헤더 = 조립 패턴. 단일 컴포넌트 아님. -->\n<header style=\"display:flex; flex-direction:column; gap:16px; padding:24px 20px\">\n  <!-- (선택) top row: 뒤로가기 + 브레드크럼 -->\n  <div style=\"display:flex; align-items:center; gap:8px\">\n    <nds-icon-button aria-label=\"뒤로가기\" size=\"small\"></nds-icon-button>\n    <nds-breadcrumb>\n      <nds-breadcrumb-item href=\"/\">홈</nds-breadcrumb-item>\n      <nds-breadcrumb-item href=\"/list\">목록</nds-breadcrumb-item>\n    </nds-breadcrumb>\n  </div>\n\n  <!-- main row: 제목(Heading) + 우측 액션 -->\n  <div style=\"display:flex; align-items:flex-start; justify-content:space-between; gap:16px\">\n    <nds-heading level=\"h2\" as=\"h1\" title=\"주문 상세\" description=\"주문 번호 #10293\"></nds-heading>\n    <div style=\"display:flex; gap:8px\">\n      <nds-button variant=\"outlined\" color=\"neutral\">취소</nds-button>\n      <nds-button>저장</nds-button>\n    </div>\n  </div>\n\n  <!-- (선택) bottom row: 탭 -->\n  <nds-tab active-key=\"info\" items='[{\"key\":\"info\",\"title\":\"정보\"},{\"key\":\"history\",\"title\":\"이력\"}]'></nds-tab>\n</header>"
    }
  },
  "quick-action-grid": {
    "name": "quick-action-grid",
    "metrics": {
      "defaultColumns": 4,
      "allowedColumns": "2 · 3 · 4",
      "maxBadgePerCell": 1,
      "labelMaxChars": "4 (권장 — 줄바꿈 방지)"
    },
    "summary": "홈/마이페이지의 \"빠른 액션\" 아이콘 그리드는 **별도 컴포넌트가 아니라 Card + CSS 그리드 조합**으로 만든다. (옛 `QuickActionGrid` 컴포넌트는 단일 도메인 레이아웃 + Figma 가이드 노드 부재로 DS 편입 기준 미달 → 패턴으로 강등됐다. 같은 화면을 Card 셀의 그리드로 표현한다.) 한 셀 = 탭 가능한 카드(아이콘 + 라벨 + 선택적 배지), 그리드는 2·3·4칸. Card 본문 룰은 get_guide({ topic: 'component:Card' }), 배지는 get_guide({ topic: 'component:Badge' }) 와 함께 본다.",
    "rules": [
      "**그리드 컨테이너**: `display:grid` + `grid-template-columns: repeat(N, 1fr)`. N = 2/3/4 (기본 4). 셀 간격은 `--semantic-gap-*` 토큰(raw px 지양). 8개를 4칸 2행처럼 행 수로 균형을 맞춘다.",
      "**셀 = 탭 가능한 Card**: 각 액션은 Card(또는 token 으로 스타일한 `button`) 1개 — 세로 정렬로 아이콘(상) + 라벨(하). 클릭 영역은 셀 전체. 카드 배경/보더/radius 는 Card 토큰 그대로(프로젝트가 토큰으로 흡수).",
      "**아이콘**: `find_icon({ name })` 가 준 **inline SVG** 를 넣는다(이름 문자열·이모지 금지 — 이모지는 emoji-banned 위반). 아이콘 뒤 tint 배경이 필요하면 `--semantic-bg-*`/surface 토큰으로, raw hex 금지.",
      "**라벨**: 4글자 이하 권장(길면 줄바꿈). 색은 tone 토큰(`--semantic-text-*`)만.",
      "**배지**: 미읽음 카운트(숫자) 또는 짧은 라벨('N','NEW'). `Badge` 컴포넌트를 셀 우상단에 absolute 로 얹는다. 셀당 1개. 긴 텍스트 금지.",
      "**이벤트**: 셀 클릭 → 라우팅. 각 셀에 안정적인 key/data 속성을 둬 핸들러가 구분한다.",
      "**칩이 아니다 (진입 ≠ 선택)**: 탭하면 화면이 전환되는 \"고민/카테고리 진입\" 그리드는 chip 토글 그룹이 **아니다**. chip 은 폼 안에서 값/필터를 고르는 용도다(→ `pattern:selection-controls`). 진입 그리드는 셀 전체가 라우팅되는 Card 그리드 — 텍스트 칩 wrap 으로 바꾸면 한눈 스캔성과 좌/우 레이아웃 균형을 둘 다 잃는다.",
      "**단일 활성(선택) 상태가 필요하면 Card 토큰으로**: 진입 그리드가 \"현재 선택된 고민\"을 강조해야 하면 활성 셀의 배경/보더는 `--semantic-bg-brand-subtle` / `--semantic-border-brand-default` 캐스케이드로 — raw hex(틸 등) 박지 말 것. 5개 프로젝트가 토큰으로 자동 대응한다.",
      "**아이콘은 한 그리드 한 스타일**: 모든 셀 아이콘을 동일 스타일 세트로 통일한다(전부 모노 라인 등). 혼색 프로젝트 글리프 + 모노 라인 **혼용 금지**. 브랜드 컬러 아이콘이 일부 고민만 커버하면 전체를 단일 모노 세트(예: `Mockup*` 라인 아이콘)로 통일한다."
    ],
    "avoid": [
      "❌ `QuickActionGrid`/`nds-quick-action-grid` 를 찾아 쓰기 — 제거됐다. Card 그리드로 조립한다.",
      "❌ 5칸 배치(어색) — 3 또는 4칸으로. 8개는 4×2.",
      "❌ 아이콘에 이름(\"home\")·이모지 — inline SVG 여야 한다.",
      "❌ 긴 라벨/긴 배지 텍스트, 셀당 배지 2개 이상.",
      "❌ 간격·배경·radius 를 raw hex/px 로 — Card·gap 토큰만.",
      "❌ 진입 그리드를 nds-chip 토글 wrap 으로 대체 — chip 은 폼 선택/필터값용(`pattern:selection-controls`). 스캔성·레이아웃 균형 상실.",
      "❌ 커스텀 `.tile` div 로 셀 재발명 — Card 셀 grid 가 표준. 토큰 우회·\"DS 채택률\" 착시.",
      "❌ 한 그리드에 혼색 프로젝트 아이콘 + 모노 라인 아이콘 섞기."
    ],
    "_readyMade": {
      "note": "빠른 액션 4칸 그리드 — Card 셀의 CSS grid. 아이콘은 `find_icon({ name })` inline SVG, 셀 배경/보더/radius 는 Card 토큰, 간격은 `--semantic-gap-*`. raw hex/px 금지.",
      "html": "<!-- 빠른 액션 4칸 그리드 — Card 셀의 grid. 아이콘 = find_icon inline SVG. -->\n<div style=\"display:grid;grid-template-columns:repeat(4,1fr);gap:var(--semantic-gap-md)\">\n  <button class=\"qa-cell\" data-key=\"log\">\n    <span class=\"qa-icon\"><svg ...></svg></span>\n    <span class=\"qa-label\">기록</span>\n  </button>\n  <button class=\"qa-cell\" data-key=\"counsel\">\n    <span class=\"qa-icon\"><svg ...></svg></span>\n    <span class=\"qa-label\">상담</span>\n    <span class=\"qa-badge\"><!-- Badge: 3 --></span>\n  </button>\n  <!-- … home / content … -->\n</div>\n<!-- .qa-cell: Card 토큰(bg/border/radius) + 세로 flex. .qa-label 색 = --semantic-text-normal. raw hex 금지. -->\n<script>\n  grid.addEventListener(\"click\", (e) => {\n    const cell = e.target.closest(\".qa-cell\");\n    if (cell) navigate(cell.dataset.key);\n  });\n</script>"
    }
  },
  "react-migration": {
    "name": "react-migration",
    "summary": "기존 React 앱 코드를 Nudge DS 로 옮길 때의 결정 트리 — **하이브리드**다. 기계적·결정적인 교체는 `@nudge-design/migrate` 코드모드(DS 번들에 동봉)가 처리하고, 의미가 미묘한 것은 DS 가이드를 보고 사람/LLM 이 손으로 한다. \"nds로 (가능한 거) 교체해줘\" 요청을 받으면 아래 순서로 진행한다. 검증은 **앱의 typecheck**가 책임진다(코드모드는 앱 코드를 검증하지 않는다).",
    "rules": [
      "**진행 순서**: ① 코드모드 먼저(기계적·결정적) → ② 코드모드가 못 잡은 건 `find_component`/`get_guide` 로 DS 컴포넌트·props 를 확인해 손/LLM 편집 → ③ **앱 typecheck 로 검증**(prop 누락·시그니처 불일치는 컴파일에서 잡힌다).",
      "**코드모드가 자동 교체하는 것**(결정적·안전): `button`(className→variant) · `input`(텍스트형 native) · `badge`(span.badge→color) · `chip`(텍스트 자식→label) · `textarea`(native). className 문자열 리터럴·native 속성 기반의 안전한 케이스만 건드린다.",
      "**코드모드가 건드리지 않는 것 = 사람/LLM 영역**: 표현식 className(`{cx(...)}`)·미인식 패턴 / **Modal**(compound `Modal.Root/Body/Header/Footer` 재구조화 필요) / **checkbox·radio**(native `onChange(event)` → DS `onCheckedChange(boolean)` 시그니처 변경이라 기계적 불가) / **FormField**(label+input 래핑 재구조화). 이건 가이드 보고 손으로 조립한다.",
      "**배포/실행**: 코드모드는 npm 에 publish 하지 않고 **DS MCP 번들(MCPB)에 동봉돼 함께 전달**된다. 실행은 번들에 포함된 `nds-migrate` CLI 로(에이전트가 셸에서 호출). MCP 는 *워크플로를 알려주고*(이 가이드), 코드모드 CLI 가 *실행*한다 — 별개.",
      "**토큰**: raw hex·inline 색/여백은 `suggest_replacement`(MCP)로 시멘틱 토큰으로 치환.",
      "**안전 원칙**: 애매하면 바꾸지 않는다(코드모드 기본값). 자동 교체는 되돌리기 쉬운 것만, 정책/디자인 판단이 필요한 건 사람이 게이트(거버넌스 B5 AI 경계와 동일).",
      "**흐름 예**: ① `nds-migrate src/**/*.tsx`(button/input/badge/chip/textarea 결정적 교체 + import 자동 병합) → ② 남은 Modal·checkbox 는 `get_guide({ topic:'component:Modal' })` 보고 손 조립 → ③ `tsc --noEmit`."
    ],
    "avoid": [
      "Modal·checkbox·radio·FormField 를 코드모드에 욱여넣기 — onChange(event)→onCheckedChange(boolean) 시그니처·compound 구조가 깨진다. 사람/LLM 이 가이드 보고 조립.",
      "코드모드 결과를 **typecheck 없이** 커밋 — prop 누락/시그니처 불일치는 앱 컴파일에서만 드러난다.",
      "표현식 className(`{cx(...)}`)을 억지로 문자열화해 교체 — 런타임 클래스 로직이 사라진다(코드모드가 일부러 skip 하는 이유).",
      "DS 에 1:1 대응이 없는 커스텀 컴포넌트를 무리하게 치환 — 추가 prop/동작을 잃는다."
    ]
  },
  "review-list": {
    "name": "review-list",
    "metrics": {
      "container": "List (role=list + header/footer 슬롯)",
      "item": "ReviewCard (카드 1장 = 리뷰 1건)",
      "helpfulSlot": "ReviewCard footer (도움돼요/좋아요/신고)",
      "moreFooter": "List footer — full-width 더보기 Button 또는 Pagination",
      "paginationThreshold": 6
    },
    "summary": "리뷰/후기를 여러 건 나열하는 패턴. 리뷰는 **'카드 1장 = 리뷰 1건'** 이라 조밀한 row(`ListItem` 의 leading/title/trailing)가 아니라 `ReviewCard` 를 쓴다. 컨테이너는 `List`(role=list + header/footer 슬롯)로 감싸 \"리뷰 N건\" 헤더와 \"더 보기\" 푸터를 리스트가 직접 소유하게 한다. (상품 리뷰·상담 후기·앱 피드 공통)",
    "rules": [
      "**아이템 = ReviewCard, 컨테이너 = List.** 리뷰 본문은 멀티라인 + 별점 + 태그 + 액션이라 `ListItem` 의 row 레이아웃에 안 맞는다 → `ReviewCard` 를 그대로 쓰고, `List` 로 감싸 리스트 의미(role=list)와 header/footer 를 얻는다.",
      "**'도움돼요'·좋아요·신고는 ReviewCard 의 `footer` 슬롯 안에.** 카드 밖 형제로 두지 않는다(카드 경계 밖으로 떨어져 어느 리뷰의 액션인지 끊긴다). → `component:ReviewCard` 의 footer do/dont 참조.",
      "**\"더 보기\"는 List 의 `footer` 슬롯에.** 카드 밖 떠돌이 버튼이 아니라 리스트가 소유하는 푸터. 맥락별 두 형태:\n- **모바일 리뷰/피드** → `footer` 에 **full-width outlined `Button`** \"리뷰 더 보기 (전체 N)\". 개수(N)를 함께 노출.\n- **어드민/데이터 많은 표 성격** → `footer` 에 **`Pagination`** (아이템 6개 이상이면 권장 — `pattern:card-section` 과 동일 임계).",
      "**헤더(선택)는 List 의 `header` 슬롯에** — \"리뷰 47\", 정렬/필터 토글 등. 리스트가 소유.",
      "**변형**: 카드 사이 간격이 필요한 카드형은 `List variant=\"plain\"`. 구분선으로 붙이는 조밀형은 `variant=\"divided\"`.",
      "**밀도**: `pattern:dense-list` 와 정합 — 카드당 주요 정보 3·보조 5 이내, 반복 카드 CTA 는 도움돼요 1개 수준.",
      "**합성 형태**: `<List variant=\"plain\" header={제목} footer={더보기 Button 또는 Pagination}>` 안에 리뷰마다 `<ListItem>` 으로 감싼 `<ReviewCard ... footer={도움돼요 버튼} />`. (List = 리스트 의미·헤더/푸터, ListItem = li 래퍼·간격, ReviewCard = 카드 본체, ReviewCard.footer = 도움돼요)"
    ],
    "avoid": [
      "'도움돼요'·더보기 버튼을 카드/리스트 **밖 형제**로 두기 — 경계 밖으로 떨어져 소속이 끊긴다. (footer 슬롯으로)",
      "리뷰를 `ListItem` 의 leading/title/description row 로 욱여넣기 — 별점·태그·멀티라인 본문이 깨진다. 리뷰는 ReviewCard.",
      "컨테이너 없이 `ReviewCard` 만 줄줄이 쌓기 — role=list 의미·헤더/푸터 둘 곳이 없어진다.",
      "같은 화면에서 더보기 버튼 + Pagination 동시 사용 — 둘 중 하나(맥락별).",
      "카드마다 elevation/색 배경 반복 — `pattern:dense-list` 위반."
    ]
  },
  "runmile-screens": {
    "name": "runmile-screens",
    "metrics": {
      "project": "runmile (러닝 대회·레이스 모집/참가 + 러너 커뮤니티)",
      "homeWeb": "데스크탑 — 상단 글로벌 nav(대회 정보/커뮤니티) + 검색 → '모집중인 대회' 일러스트 대회 카드 3-up 그리드(포스터 썸네일 + 제목 + 기간 + 해시태그 + New/모집중 배지) + 우측 커뮤니티/랭킹 사이드 → '진행중인 대회' 그리드 → 푸터",
      "homeChatWeb": "홈 위에 우측 '채팅' 드로어 패널 — 참여중인 채팅방 list + 인기 채팅방(아바타 + 방 제목 + 미읽음 카운트 배지)",
      "competitionDetailWeb": "대회 상세 — 포스터 + 정보 테이블(기간/참가비/거리 등) + 신청 CTA(coral) → 코스 안내 지도 → 대회 안내 본문 → 기념품/리워드 상품 그리드",
      "card": "대회 카드 = 일러스트 포스터 썸네일(4:5 안팎) + 제목 + 기간 + 해시태그 + New/모집중 상태 배지. 그리드 3-up 반복 섹션.",
      "accent": "코랄·핑크 브랜드 컬러 — CTA(신청)/배지/링크. 대회 포스터 일러스트가 시각 주인공.",
      "status": "스크린샷 레퍼런스 카탈로그 (레이아웃·구성 SSOT). 정확한 색/여백/치수 토큰은 component 가이드 + 프로젝트 토큰이 SSOT."
    },
    "references": [
      {
        "label": "Runmile 웹 홈 — 대회 모집 (desktop)",
        "image": "references/runmile-web-home.png",
        "caption": "상단 nav + 검색, '모집중인 대회' 일러스트 대회 카드 3-up 그리드 + 우측 커뮤니티/랭킹 사이드, '진행중인 대회' 그리드, 푸터.",
        "project": "runmile"
      },
      {
        "label": "Runmile 웹 홈 + 채팅 드로어 (desktop)",
        "image": "references/runmile-web-home-chat.png",
        "caption": "홈 위 우측 '채팅' 드로어 — 참여중인 채팅방 list + 인기 채팅방(아바타 + 제목 + 미읽음 배지).",
        "project": "runmile"
      },
      {
        "label": "Runmile 대회 상세 (desktop)",
        "image": "references/runmile-web-competition-detail.png",
        "caption": "포스터 + 정보 테이블 + 신청 CTA(coral) → 코스 지도 → 대회 안내 본문 → 기념품/리워드 상품 그리드.",
        "project": "runmile"
      }
    ],
    "summary": "Runmile(러닝 대회·레이스 모집/참가 + 러너 커뮤니티) 화면의 **시각 레퍼런스 카탈로그** — 웹 홈(대회 모집) / 홈+채팅 드로어 / 대회 상세 3종 스크린샷을 담는다. Runmile 은 대회 포스터 일러스트가 시각 주인공이라 UI 채도는 낮추고 코랄·핑크 브랜드 컬러를 신청 CTA·상태 배지·링크에만 쓴다. 화면을 새로 짤 때 **레이아웃·구성·위계의 출처**로 이 스크린샷들을 먼저 보고(`references[].imageAbsolutePath`), 정확한 색·여백·치수·컴포넌트 선택은 해당 `component:*` 가이드와 프로젝트 토큰을 SSOT 로 따른다.",
    "rules": [
      "**대회 카드 그리드 = '카드 1장 = 대회 1건'.** 일러스트 포스터 썸네일 + 제목 + 기간 + 해시태그 + 상태 배지(New/모집중/마감). 홈은 이 카드를 3-up 행으로 묶은 '모집중/진행중' 섹션을 반복 → 섹션 컨테이너는 헤더(섹션명 + 더보기)를 소유하는 `pattern:card-section` / `List` 정합.",
      "**상태 배지는 `Chip`/배지 토큰으로.** New·모집중·마감 같은 상태 라벨은 카드 위 일관된 badge — 임의 색 박스 금지, `component:Chip`/배지 시멘틱.",
      "**대회 상세는 detail 패턴** — 포스터 + 정보 테이블(기간/참가비/거리) + 신청 CTA 1개 → 코스 지도 → 안내 본문 → 기념품 그리드. 신청 CTA 는 화면당 primary solid 1개(`pattern:cta-group`).",
      "**채팅 드로어는 우측 패널(오버레이) 구조.** 참여중인 채팅방 list + 인기 채팅방 — 미읽음 카운트는 배지. 본문 위에 떠도 본문 레이아웃은 유지(`popover-portal-and-modal-scroll` 정합, 드로어 내부만 스크롤).",
      "**브랜드 컬러는 토큰으로만.** 코랄·핑크 accent 는 `--semantic-*`(project) 토큰 cascade 로 흐른다 — 컴포넌트/목업에 hex 하드코딩 금지(`get_guide({ topic: 'principles' })`).",
      "새 Runmile 화면 작업 전 이 카탈로그의 해당 스크린샷을 `references.md` 의 `[good]` 소스로 먼저 등록(`pattern:visual-reference` 게이트)."
    ],
    "avoid": [
      "스크린샷의 색·여백·치수를 픽셀 단위로 그대로 베끼기 — 이 카탈로그는 **레이아웃·구성 참고용**이고, 정확한 값은 component 가이드 + 프로젝트 토큰이 SSOT(어긋나면 토큰이 우선).",
      "대회 카드를 `ListItem` row 로 욱여넣기 — 포스터+제목+기간+해시태그+배지 카드는 `Card`.",
      "상태 배지(New/모집중)를 임의 색 인라인 박스로 — `Chip`/배지 시멘틱 토큰.",
      "코랄·핑크 accent 를 UI 전반에 칠하기 — 대회 포스터 일러스트와 충돌. accent 는 CTA·배지·링크 한정.",
      "Runmile 전용이라며 컴포넌트에 `[data-project=\"runmile\"]` 색 분기 추가 — 프로젝트 차이는 프로젝트 토큰 파일에서 값만 override(`CLAUDE.md` 프로젝트 분기 금지 규칙)."
    ]
  },
  "scroll-rail": {
    "name": "scroll-rail",
    "metrics": {
      "maxHorizontalRailsPerScreen": 1,
      "nativeHorizontalScrollbar": "forbidden"
    },
    "summary": "가로로 넘치는 콘텐츠(카드 레일·칩 row·가로 탭·가로 미디어 목록)를 모바일에서 스크롤로 노출하는 패턴. 스크롤바는 숨기고, 아이템은 찌그러지지 않게 고정 폭으로 흐르게 한다. 핵심은 공용 `.nds-scroll-x` 유틸 클래스 — 스크롤바 숨김(`scrollbar-width:none` + `::-webkit-scrollbar{display:none}` + `-ms-overflow-style:none`)을 컴포넌트마다 재구현하지 않고 한 자리에서 가져온다.",
    "rules": [
      "가로 스크롤 컨테이너에는 공용 `.nds-scroll-x` 유틸 클래스를 건다 — `overflow-x:auto` + 스크롤바 숨김(크로스 브라우저)이 한 벌로 적용된다. `::-webkit-scrollbar`/`scrollbar-width` 를 컴포넌트·목업에서 직접 재구현하지 않는다.",
      "레이아웃은 호출부 책임 — `.nds-scroll-x` 에 `display:flex; gap:<token>` 를 주고, 각 아이템(카드)은 `flex-shrink:0` + 고정/최소 폭으로 찌그러짐을 막는다. (회귀 사례: 레일 아이템이 flex shrink 돼 카드가 81px 로 짓눌림 — flex-shrink:0 누락이 원인.)",
      "`nds-card` 를 레일 아이템으로 쓸 땐 폭을 호스트가 아니라 카드 박스에 건다 — `nds-card` 호스트는 `display:contents` 라 host 에 건 flex/grid·width 가 안 먹는다. `--nds-card-width` 토큰으로 폭을 주거나, 폭을 가진 래퍼(`<div style=\"flex:0 0 280px\">`)로 감싼다. 호스트에 `display:block !important` 를 박는 핵으로 우회하지 않는다.",
      "가독 여백은 레일 양 끝 아이템의 padding(또는 컨테이너 `scroll-padding-inline`)으로 — 첫/끝 카드가 화면 가장자리에 붙지 않게. 가장자리까지 흐르는 bleed 레일이 모바일 기본.",
      "한 화면(또는 한 스크롤 영역)에 가로 스크롤 레일을 2개 이상 쌓지 않는다 — 가로/세로 스크롤 축이 섞여 사용자가 스크롤 방향을 잃는다."
    ],
    "avoid": [
      "가로 스크롤 컨테이너에 네이티브 스크롤바를 그대로 노출 (특히 데스크톱 트랙패드/마우스에서 거슬림 — `.nds-scroll-x` 로 숨김 처리)",
      "컴포넌트·목업마다 `::-webkit-scrollbar{display:none}` / `scrollbar-width:none` 를 손으로 재구현 (→ `.nds-scroll-x` 공용 유틸)",
      "레일 아이템에 `flex-shrink` 기본값(1)을 둬 카드가 컨테이너 폭에 맞춰 찌그러지게 방치",
      "`nds-card` 호스트에 폭/`display:block !important` 를 박아 레일 사이징을 우회 (호스트는 display:contents — 폭은 카드 박스/래퍼에)",
      "한 화면에 가로 스크롤 레일을 여러 개 중첩·병치"
    ]
  },
  "selection-controls": {
    "name": "selection-controls",
    "summary": "선택 UI 결정 트리 — 같은 용도는 화면이 달라도 같은 컴포넌트로 통일(★ 일관성 SSOT). 용도별로 SelectChip / SelectionButtonGroup / SelectionCard / Tab(variant=segment) / Dropdown 중 하나로 매핑한다.",
    "rules": [
      "⓪ **먼저 — '선택'인가 '진입'인가**: 탭하면 화면이 전환되는 카테고리/고민 **진입** 그리드(예: 홈의 건강고민 타일)는 선택 UI 가 아니다 → `pattern:quick-action-grid`(아이콘+라벨 Card 셀 그리드). chip·SelectionButton 으로 만들지 말 것. 아래 ①~⑤ 는 폼 안에서 값/필터를 고르는 **선택**에만 적용.",
      "① 다중 선택 + 짧은 라벨(연령대·시군구·태그·관심사) → SelectChip (`<nds-chip selected interactive>`, 캐포비=노란 채움/검정 텍스트).",
      "② 단일 선택 + 설명 없는 짧은 옵션 2~3개(OS 전체/Android/iOS·성별·노출 구분) → SelectionButtonGroup.",
      "③ 단일 선택 + 설명/아이콘 있는 카드(캠페인 목표·유형·소진 방식) → SelectionCard(mode=single) — 라디오 도트 내장, 커스텀 카드 금지.",
      "④ 목록 상태 필터(전체/송출중/정지) → Tab variant='segment' 또는 캐포비 Box Tab(pattern:cashwalk-biz-tab).",
      "⑤ 단일 선택 옵션 4개 초과 → Dropdown."
    ],
    "avoid": [
      "진입(탭→화면 전환) 그리드를 chip 토글 wrap 으로 만들기 — 그건 선택이 아니라 네비게이션. 아이콘+라벨 스캔성과 레이아웃 균형을 잃는다 → `pattern:quick-action-grid`.",
      "같은 용도(예: 연령=다중·짧은 라벨, 지역 시군구=다중·짧은 라벨)인데 화면마다 다른 컴포넌트로 만들기 — 둘 다 SelectChip 으로 통일."
    ]
  },
  "semantic-spacing": {
    "name": "semantic-spacing",
    "metrics": {
      "gridBase": "4pt",
      "gapDefault": "--semantic-gap-default (10px)",
      "insetDefault": "--semantic-inset-card (16px)",
      "allowedGapTokens": "tight(4) / default(10) / comfortable(12) / loose(16) / wide(24)",
      "allowedInsetTokens": "chip(8) / input(12) / card(16) / card-large(20) / modal(24)",
      "figmaNodeUrl": "https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=SpacingGuide"
    },
    "summary": "Spacing 은 정보 관계와 위계를 표현하는 구조 시스템이다. 4pt grid · Figma SpacingGuide 실측 기반. Gap(요소 간 거리, 의도 기반) 과 Inset(컨테이너 내부 여백, 사용처 기반) 을 명확히 구분하고, 같은 의미의 간격은 같은 semantic 토큰만 사용한다.",
    "rules": [
      "Gap (요소 간 거리) — 의도 기반 5단계만 사용:\n  · `--semantic-gap-tight` (4px) → Chip · Badge 그룹\n  · `--semantic-gap-default` (10px) ★ 표준 컴포넌트 gap\n  · `--semantic-gap-comfortable` (12px) → 폼 필드 · 세그먼트\n  · `--semantic-gap-loose` (16px) → 컴포넌트 ↔ 컴포넌트\n  · `--semantic-gap-wide` (24px) → 큰 영역 ↔ 큰 영역",
      "Inset (컨테이너 내부 여백) — 사용처 기반 5단계만 사용:\n  · `--semantic-inset-chip` (8px) → Chip · Badge 내부 padding\n  · `--semantic-inset-input` (12px) → Input · 작은 컨테이너 padding\n  · `--semantic-inset-card` (16px) ★ 카드 표준 padding\n  · `--semantic-inset-card-large` (20px) → 큰 카드 padding\n  · `--semantic-inset-modal` (24px) → Modal · 통계 박스 padding",
      "결정 트리 — 내부 여백(padding)인지 요소 간격(gap)인지 먼저 판단한 뒤 위 토큰 중 하나로 매핑한다. 모호하면 표준값(`--semantic-gap-default` 10px / `--semantic-inset-card` 16px)을 우선.",
      "같은 깊이·같은 의도의 간격은 항상 같은 토큰을 쓴다 — 한 화면 내 카드들이 모두 16px padding 이면 모두 `--semantic-inset-card` 로.",
      "Primitive(--spacing-N) 는 토큰 정의용. UI 코드에서는 직접 사용 금지 — 반드시 `--semantic-gap-*` / `--semantic-inset-*` 를 거친다.",
      "임의 px 사용 금지: 5 / 7 / 9 / 11 / 13 / 15px 는 4pt 위반이므로 토큰으로 대체할 것.",
      "Inset 자리에 Gap 토큰 사용 / Gap 자리에 Inset 토큰 사용 금지 — padding 에 `--semantic-gap-*`, flex/grid gap 에 `--semantic-inset-*` 쓰지 않는다."
    ],
    "avoid": [
      "padding: 14px / margin: 11px 같은 raw px 직접 사용",
      "padding 에 `--semantic-gap-default` 사용 / gap 에 `--semantic-inset-card` 사용 (역할 혼동)",
      "한 화면에 카드마다 다른 padding 토큰 사용 (일관성 손상)",
      "spacing 대신 색 배경 / border 만으로 영역 구분",
      "var(--spacing-12) 같은 primitive 토큰을 UI 코드에서 직접 사용"
    ]
  },
  "social-login": {
    "name": "social-login",
    "metrics": {
      "assets": "@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg (4 서비스 × 색상)",
      "services": "naver(white/main) · kakao(black/main) · google(white/main) · apple(white/black)",
      "layout": "풀폭 세로 스택 기본 · 가로 아이콘 행 보조",
      "heightBucket": "48px (pattern:action-row)"
    },
    "summary": "소셜/간편 로그인(네이버·카카오·구글·애플) 버튼. DS 는 4 서비스 × 색상 로고 자산(@nudge-design/assets `sns-logos/`, Figma 107:1045)을 제공한다 — **이니셜 텍스트(G/K/N)나 손글씨 SVG 로 때우지 말고 이 자산을 버튼에 박는다.** 자산은 project 차원이 아니라 제3자 서비스 차원이라 모든 프로젝트 화면에서 쓸 수 있고, 단일 HTML 목업은 `@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg` 를 `<img src>` 에 그대로 쓰면 build_singlefile_html 이 base64 인라인한다.",
    "rules": [
      "do — 풀폭 프로젝트 버튼 세로 스택: `<button style=\"height:48px;background:#FEE500\"><img src=\"@nudge-design/assets/files/shared/sns-logos/kakao-black.svg\" width=\"18\" height=\"18\" alt=\"\"> 카카오로 시작하기</button>` (네이버는 bg #03C75A + naver-white, 구글은 흰 bg+보더 + google-main). don't — `<span>G</span><span>K</span><span>N</span>` 이니셜 텍스트.",
      "서비스 식별은 **공식 로고 자산**으로 — `@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg`. 보유 조합: naver(white/main) · kakao(black/main) · google(white/main) · apple(white/black). 이니셜 글자(G/K/N)·이모지·손글씨 SVG 금지.",
      "서비스 시그니처 색을 버튼 bg 로 — 카카오 #FEE500(로고 kakao-black) · 네이버 #03C75A(로고 naver-white) · 구글 흰 bg + 1px 보더(로고 google-main, 멀티컬러 G) · 애플 검정 bg(로고 apple-white). bg 와 대비되는 로고 색을 고른다.",
      "라벨은 '○○로 시작하기' / '○○로 계속하기' 처럼 행동이 분명하게. 로고만 있는 아이콘 버튼이면 aria-label 로 서비스명 보강.",
      "배치는 풀폭 세로 스택이 기본(식별·터치 영역 명확). 가로 아이콘 행(원형 버튼)은 보조 — 이때도 텍스트 이니셜이 아니라 로고 자산을 원 안에 넣는다.",
      "버튼 높이는 폼의 다른 입력/CTA 와 같은 height bucket(48 권장)으로 맞춘다 — pattern:action-row.",
      "현재 자산은 Runmile 라이브러리 원본이지만 제3자 서비스 자산이라 project 무관하게 사용 가능. get_project 의 snsLogos 가 해당 프로젝트에 안 떠도 자산 경로로 직접 인라인하면 된다."
    ],
    "avoid": [
      "이니셜/약자 텍스트(G·K·N)로 소셜 버튼을 표현 — 어떤 서비스인지 식별 불가 + 프로젝트 가이드 위반.",
      "로고를 raw <svg> 손글씨나 임의 이모지로 대체 — 공식 자산을 쓴다.",
      "모든 서비스를 같은 회색/검정 버튼으로 통일 — 서비스 시그니처 색으로 구분되어야 즉시 인지된다.",
      "상대경로(/sns-logos/x.svg)를 단일 HTML 목업에 쓰기 — 단독 파일에서 깨진다. inlineRef(@nudge-design/assets/files/…)로 써야 base64 인라인."
    ]
  },
  "surface-layer": {
    "name": "surface-layer",
    "metrics": {
      "maxProjectBgPerScreen": 1,
      "maxEmphasisDevicesPerNotice": 2,
      "layers": "L0 surface-default / L1 page-default / L2 surface-subtle | section-default / L3 project-subtle | status-*",
      "decisionRule": "의미 전달 + 화면 내 project bg 없음 + decoration 아님 — 셋 모두 YES"
    },
    "summary": "Surface / Background 의 4단계 레이어 정의와 Project background 사용 원칙. Project background 는 시각 장식이 아니라 '의미 전달'(주의·안내·강조) 목적으로만 사용한다. notice 패턴과 짝.",
    "rules": [
      "Layer 정의 (낮은 → 높은 위계):\n  · L0 기본 surface → `--semantic-bg-surface-default` (#FFFFFF) — 기본 카드/박스 (Card, Info Box)\n  · L1 페이지 배경 → `--semantic-bg-page-default` (≈#F8F9FB) — body, 페이지 전체 배경\n  · L2 Subtle BG → `--semantic-bg-surface-subtle` / `--semantic-bg-section-default` — 비활성 영역, 표 헤더, 섹션 분리\n  · L3 Notice (의미 전달) → `--semantic-bg-brand-subtle` 또는 `--semantic-bg-status-*` — 핵심 Notice, 상태성 안내",
      "Project background (`--semantic-bg-brand-*`) 는 다음 모두를 만족할 때만 사용:\n  1) 사용자에게 주의 / 안내 / 하이라이트 의미 전달이 필요한가?\n  2) 현재 화면에 이미 사용 중인 project background 가 없는가?\n  3) 단순 decoration 목적이 아닌가?\n  → 셋 모두 YES 일 때만. 하나라도 NO 면 `--semantic-bg-surface-default` 로 처리.",
      "한 화면당 project background 최대 1개. 같은 영역에 project bg + project chip + project icon 을 동시에 쌓지 않는다 (tone-on-tone).",
      "상태 의미가 명확할 때만 status 배경(`--semantic-bg-status-error|success|caution|info`) 사용. 일반 안내문은 neutral 우선.",
      "섹션 구분은 spacing / border / text 위계로 먼저 해결. 색 배경으로만 영역을 구분하지 않는다."
    ],
    "avoid": [
      "KPI 카드 / summary 카드 / 일반 정보 카드에 project background 사용",
      "section 구분을 색상으로만 해결 (spacing 없이 색만)",
      "한 화면에서 카드마다 다른 pastel background 를 깔아 모든 영역이 강조되어 보이는 구성",
      "decorative 목적의 색 배경 (의미 전달 없는 단순 시각 분리)",
      "Project bg 위에 다시 project chip / project icon / project button 을 중첩 (tone-on-tone)",
      "안내문에 gradient + icon + badge + bold headline 을 동시에 적용"
    ]
  },
  "trost-screens": {
    "name": "trost-screens",
    "metrics": {
      "project": "trost (심리상담·멘탈케어 EAP — 상담/콘텐츠/칼럼)",
      "homeWeb": "데스크탑 — 상단 헤더(Trost. 로고 + nav + 검색) → 사진 배경 다크 히어로 배너(헤드라인 + 검색) → 추천 심리상담/인기글 2카드 → 'ASMR plus' 등 콘텐츠 미디어 카드 그리드 → 마음 안내 배너 → 카테고리 아이콘 그리드 → 인기 칼럼/상담사 칼럼 카드 → 푸터",
      "card": "콘텐츠/칼럼 카드 = 썸네일(미디어/사진) + 제목 + 메타. 미디어 카드는 play 오버레이. 카테고리는 아이콘 + 라벨 그리드.",
      "accent": "블루 브랜드 컬러 — 로고/CTA/링크/배너. 다크 히어로는 사진 위 white 텍스트.",
      "status": "스크린샷 레퍼런스 카탈로그 (레이아웃·구성 SSOT). Trost 웹은 Zeplin 이 디자인 SSOT — 정확한 색/여백/치수는 Zeplin + 프로젝트 토큰."
    },
    "figmaNodeUrl": "https://zpl.io/Dp775xl",
    "references": [
      {
        "label": "Trost 웹 홈 — 심리상담·멘탈케어 (desktop)",
        "image": "references/trost-web-home.png",
        "caption": "헤더 + 다크 히어로 배너 → 추천 상담/인기글 카드 → 콘텐츠 미디어 카드 그리드 → 마음 안내 배너 → 카테고리 아이콘 그리드 → 칼럼 카드 → 푸터. (Zeplin SSOT zpl.io/Dp775xl)",
        "project": "trost"
      }
    ],
    "summary": "Trost(심리상담·멘탈케어 EAP) 웹 홈의 **시각 레퍼런스 카탈로그** — 사진 배경 다크 히어로 + 콘텐츠/칼럼 카드 그리드 구조의 데스크탑 홈 스크린샷을 담는다. Trost 웹은 **Zeplin 이 디자인 SSOT**(zpl.io/Dp775xl)이고, 블루 브랜드 컬러를 로고·CTA·링크·배너에만 쓴다. 화면을 새로 짤 때 **레이아웃·구성·위계의 출처**로 이 스크린샷을 먼저 보고(`references[].imageAbsolutePath`), 정확한 색·여백·치수·컴포넌트 선택은 Zeplin 과 프로젝트 토큰을 SSOT 로 따른다.",
    "rules": [
      "**콘텐츠/칼럼 카드 그리드 = '카드 1장 = 콘텐츠 1건'.** 썸네일(미디어/사진) + 제목 + 메타. 섹션마다 헤더(섹션명 + 더보기)를 소유하는 `pattern:card-section` / `List` 정합. 미디어(ASMR 등) 카드는 play 오버레이.",
      "**다크 히어로 배너**는 사진 배경 + white 텍스트 + 검색/CTA. 본문(라이트) 과 대비되는 진입 영역 — 색은 토큰(`--semantic-*`)으로, 사진 위 텍스트 대비 확보(`get_guide({ topic: 'principles' })` 접근성).",
      "**카테고리는 아이콘 + 라벨 그리드** — 균일 셀의 quick-action 성격(`pattern:quick-action-grid` 정합). 아이콘은 DS 아이콘 세트(`find_icon`), 임의 이미지 금지.",
      "**브랜드 컬러는 토큰으로만.** 블루 accent 는 `--semantic-*`(project) 토큰 cascade 로 흐른다 — 컴포넌트/목업에 hex 하드코딩 금지.",
      "새 Trost 화면 작업 전 이 카탈로그의 스크린샷을 `references.md` 의 `[good]` 소스로 먼저 등록(`pattern:visual-reference` 게이트). 정확한 픽셀은 Zeplin(zpl.io/Dp775xl) 병행 확인."
    ],
    "avoid": [
      "스크린샷의 색·여백·치수를 픽셀 단위로 그대로 베끼기 — 이 카탈로그는 **레이아웃·구성 참고용**이고, 정확한 값은 Zeplin + 프로젝트 토큰이 SSOT(어긋나면 SSOT 우선).",
      "콘텐츠 카드를 `ListItem` row 로 욱여넣기 — 썸네일+제목+메타 카드는 `Card`.",
      "카테고리 아이콘에 임의 이미지/이모지 사용 — DS 아이콘 세트(`find_icon`).",
      "블루 accent 를 UI 전반에 칠하기 — accent 는 로고·CTA·링크·배너 한정.",
      "Trost 전용이라며 컴포넌트에 `[data-project=\"trost\"]` 색 분기 추가 — 프로젝트 차이는 프로젝트 토큰 파일에서 값만 override(`CLAUDE.md` 프로젝트 분기 금지 규칙)."
    ]
  },
  "ui-direction-proposal": {
    "name": "ui-direction-proposal",
    "ruleGroups": [
      {
        "heading": "방향 제안 없이 진행해도 되는 경우",
        "items": [
          "첫 화면에서 무엇을 강조할지 명시됨",
          "CTA 위치/역할이 명시됨",
          "사용 흐름이 단계별로 명시됨",
          "정보 우선순위가 있음",
          "참고 화면에서 무엇을 따라야 하는지 명확함"
        ]
      },
      {
        "heading": "방향 제안을 먼저 해야 하는 경우",
        "items": [
          "기능/데이터 목록만 있음",
          "'깔끔하게', '보기 좋게' 같은 추상 표현이 많음",
          "CTA 또는 정보 우선순위가 없음",
          "같은 목적을 여러 정보 구조로 풀 수 있음",
          "레퍼런스는 있지만 무엇을 따라야 하는지 불명확함"
        ]
      },
      {
        "heading": "제안 포맷",
        "items": [
          "방향명: 이 화면에 맞춘 구체적 이름",
          "첫 화면에서 가장 먼저 보이는 것",
          "핵심 흐름",
          "CTA 배치 방식",
          "장점",
          "리스크",
          "추천 조건"
        ]
      }
    ],
    "examples": [
      {
        "verdict": "good",
        "source": "상담사 예약 화면 PRD",
        "caption": "A 가능 시간 먼저 선택(시간 선택→상담사 확인→하단 CTA) / B 상담사 신뢰 먼저 형성(프로필·후기→가능 시간→CTA)처럼 같은 예약 화면 안의 정보 위계와 CTA 전략을 비교."
      },
      {
        "verdict": "bad",
        "source": "범용 A/B/C 제안",
        "caption": "빠른 실행 중심 / 비교·탐색 중심 / 신뢰·안내 중심처럼 화면 유형을 다시 분류하는 수준이면 PRD 맥락을 충분히 반영하지 못함."
      }
    ],
    "summary": "기획서가 화면 구조를 명확히 정하지 않은 경우, 코드 작성 전에 같은 기획서 안의 UI/UX 설계 방향 2-3개를 제안하고 사용자 선택을 받는 패턴.",
    "rules": [
      "항상 A/B/C 를 묻지 않는다. PRD 에 첫 화면 강조점, 정보 우선순위, CTA 전략, 핵심 흐름, 레퍼런스 의도가 명확하면 방향 제안 없이 그대로 진행한다.",
      "PRD 가 기능/데이터 목록 중심이고 화면 안의 구성 전략이 불명확하면, 코드 작성 전에 2-3개 방향을 제안하고 사용자 선택을 기다린다.",
      "방향 제안은 '예약/결제/온보딩/목록' 같은 화면 유형 재분류가 아니다. 이미 정해진 화면 안에서 정보 위계, 사용자 흐름, CTA 배치, 불안/망설임 해소 방식이 어떻게 달라지는지 비교한다.",
      "각 방향은 이 기획서의 도메인 단어를 써서 구체적인 이름을 붙인다. 범용 이름(빠른 실행 중심, 탐색 중심, 신뢰 중심)만 쓰지 않는다.",
      "각 방향은 첫 화면에서 가장 먼저 보이는 것, 핵심 흐름, CTA 전략, 장점, 리스크, 추천 조건을 포함한다.",
      "사용자가 방향을 선택하면 brief.md 또는 작업 메모리에 Selected UI Direction 을 남기고, 이후 구현은 그 방향을 기준으로 고정한다.",
      "시각 레퍼런스 게이트가 더 우선이다. references.md 가 없으면 방향 제안은 가능하지만 index.html 작성/빌드는 Figma 또는 스크린샷 레퍼런스를 받은 뒤 진행한다."
    ],
    "avoid": [
      "PRD 가 이미 충분히 명확한데도 매번 방향 선택을 강제",
      "화면 유형을 다시 분류하는 수준의 제안",
      "A/B/C 이름만 다르고 정보 위계와 CTA 전략이 같은 제안",
      "방향을 제안해 놓고 사용자의 선택 없이 임의로 구현",
      "시각 레퍼런스가 없는 상태에서 방향 선택만으로 구현/빌드 진행"
    ]
  },
  "visual-antipatterns": {
    "name": "visual-antipatterns",
    "ruleGroups": [
      {
        "heading": "색·강조",
        "items": [
          "**Tone-on-Tone Filled 금지** — 연한 primary/blue 배경 위에 같은 계열의 연한 filled tag/badge/box 를 반복하지 않는다. 같은 톤 위 같은 톤은 위계를 만들지 못하고 영역만 흐려진다.",
          "**Primary 컬러 역할 제한** — Primary 는 CTA · interactive · 핵심 highlight 중 한 가지 역할로만. 배경/CTA/태그/카드/포커스/hover 에 동시에 쓰면 무엇을 클릭해야 할지 신호가 사라진다.",
          "**로고 컬러 ≠ UI 액센트** — 프로젝트 로고의 gradient/accent 색은 로고 표현 전용. 카드 배경, 배지, 버튼 컬러로 재사용하지 않는다.",
          "**Primary tint 반복 금지** — 한 섹션에서 primary tint 가 배경 · 라벨 · 아이콘 · 카드 surface 로 3회 이상 등장하면 neutral surface + 텍스트 위계로 낮춘다.",
          "**그라데이션 배경 금지** — linear / radial / conic gradient 배경 모두 사용 금지. 단색 토큰만 사용.",
          "**Section 구분, 색상 단독 금지** — 영역 구분은 1차 spacing(--semantic-gap-loose/wide) → 2차 Divider/Border → 마지막에 surface tone 순서로. 색만으로 나누면 색맹·저시력 사용자가 구조를 잃는다."
        ]
      },
      {
        "heading": "표면 (Card / Shadow)",
        "items": [
          "**Card Everything 금지** — 모든 정보 단위를 카드로 감싸지 않는다. 카드는 '독립된 정보 단위' 일 때만. 단순 group/section 은 spacing + h3 + Divider 로 위계를 만든다. 한 화면에 카드가 5개를 넘으면 80% 이상 안티패턴.",
          "**카드 안 카드 중첩 금지** — 카드 내부 영역 강조는 surface.section tone 한 단계 또는 inline Chip/Badge 로. nested Card 는 위계 표현 도구가 아니다.",
          "**카드 장식 라인/accent 바 금지** — 카드 상단 컬러 라인(border-top accent) · 좌측 accent 보더 · ::before 컬러 바로 카드를 장식하지 않는다. 카드 테두리는 outlined 중립 1px 또는 footer/divider hairline 뿐 — 컬러 accent 선은 DS Card 에 없다. 강조는 색이 아니라 Chip/Badge·텍스트 위계로.",
          "**장식용 그림자 금지** — 떠 있지 않아야 할 요소(인라인 리스트 · 일반 카드 · 기본 입력)에 elevation/shadow 적용 금지. Shadow 는 floating UI(Modal · Popup · Dropdown · BottomSheet) 와 'hover 시 floating 표현' 에만.",
          "**Shadow-heavy 레이아웃 금지** — 한 화면에 그림자 있는 요소가 3개를 넘으면 floating 의미가 사라진다. Border 또는 surface tone 으로 대체."
        ]
      },
      {
        "heading": "타이포그래피 위계",
        "items": [
          "**Bold 남발 금지** — Bold 텍스트는 화면당 1-2 곳에만. 5곳 이상이면 위계가 사라지고 모든 글자가 평등해진다. 본문은 Regular/Medium.",
          "**최상위 헤딩 중복 금지** — h1/h2 같은 큰 제목은 화면당 1개. 보조 섹션은 h3 이하로 내려야 페이지 안에서 '어디가 본론' 인지 보인다.",
          "**위계 불명 텍스트 금지** — 인접한 두 영역이 같은 fontSize × fontWeight 이면 위계가 무너진다. 헤딩과 본문의 시각적 차이를 항상 만든다.",
          "**폰트 웨이트 3개 이상 혼용 금지** — 한 화면에 2-3개 웨이트만. Display(Bold) · Body(Medium/Regular) · Caption(Regular) 정도가 표준."
        ]
      },
      {
        "heading": "아이콘",
        "items": [
          "**아이콘 스타일 혼용 금지** — 같은 화면/그룹 안에 Line · Filled · Colorful 아이콘을 섞지 않는다. `@nudge-design/icons` 단일 셋만, 같은 그룹은 한 스타일로 통일.",
          "**장식용 헤딩 아이콘 금지** — 서브타이틀(h3/h4) · Form Label · 본문 텍스트 앞 장식 아이콘 금지. 일부 헤딩에만 아이콘이 붙으면 위계가 깨진다. 한 화면 헤딩 앞 아이콘 5개 이상은 자동 위반.",
          "**Color icon 본문 남용 금지** — multi-color/colorful 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger 등) 와 진입점 1-2개에만. 일반 UI 강조에는 monochrome currentColor 만 사용."
        ]
      },
      {
        "heading": "가짜 대시보드 톤",
        "items": [
          "**Fake Dashboard 금지** — 의미 없는 KPI 카드 / 메트릭 그리드 / 장식용 chart / 큰 일러스트 + gradient hero. EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선. Generic SaaS dashboard 톤 회피.",
          "**Pastel 카드 그리드 금지** — 카드마다 다른 pastel/tinted background 를 깔아 영역을 색으로 구분하지 않는다. 모든 bg 는 `--semantic-bg-*` 토큰 안에서 한정."
        ]
      },
      {
        "heading": "원칙 — 색보다 구조 먼저",
        "items": [
          "**강조는 색보다 구조 먼저** — 강조가 필요하면 색상보다 정보 우선순위 · spacing · typography weight · CTA 위치를 먼저 조정한다. 색은 마지막 수단."
        ]
      }
    ],
    "avoidGroups": [
      {
        "heading": "색·강조",
        "items": [
          "연한 블루 페이지 배경 + 연한 블루 Chip + 연한 블루 안내 박스 조합",
          "primary blue 를 배경 · 버튼 · 태그 · hover · focus · 카드 테두리 모두에 사용",
          "로고 gradient/accent 를 카드 배경이나 배지 색으로 재사용",
          "새 영역마다 같은 색 계열 배경을 깔아 모든 섹션이 강조처럼 보이는 구성",
          "linear/radial/conic gradient 배경",
          "영역 구분을 spacing 없이 색상만으로 처리"
        ]
      },
      {
        "heading": "표면 (Card / Shadow)",
        "items": [
          "정보 단위가 아닌 단순 group/section 도 모두 카드로 감싸기",
          "카드 안에 또 카드를 만들어 내부 강조 시도",
          "카드에 상단 컬러 라인/좌측 accent 바 등 장식용 컬러 보더 부착",
          "일반 카드 · 인라인 리스트 · 기본 입력에 shadow 적용",
          "한 화면에 floating panel(Modal/Drawer/Popup/Toast) 2개 이상 동시 노출"
        ]
      },
      {
        "heading": "타이포그래피 위계",
        "items": [
          "한 화면에 Bold 텍스트 5곳 이상",
          "한 화면에 h1/h2 두 개 이상",
          "헤딩과 본문이 같은 fontSize × fontWeight 로 위계 모호",
          "한 화면에 폰트 웨이트 3개 이상 혼용"
        ]
      },
      {
        "heading": "아이콘",
        "items": [
          "Line + Filled + Colorful 아이콘을 한 화면/그룹에 혼용",
          "서브타이틀/Form Label/본문 앞 장식 아이콘 (일부에만 부착 → 위계 붕괴)",
          "multi-color 아이콘을 일반 UI 강조용으로 사용"
        ]
      },
      {
        "heading": "가짜 대시보드 톤",
        "items": [
          "사용자 의사결정에 안 쓰이는 장식용 KPI 카드/메트릭 그리드",
          "데이터 인사이트 없이 장식 목적의 chart/graph",
          "큰 일러스트 + 큰 카피 + gradient 배경 hero section",
          "카드마다 다른 pastel background 로 영역을 색 구분"
        ]
      }
    ],
    "metrics": {
      "maxPrimaryRolesPerScreen": 2,
      "maxPrimaryTintSurfacesPerSection": 1,
      "logoColorAsUiAccent": "forbidden",
      "toneOnToneFilled": "forbidden",
      "gradientBackground": "forbidden",
      "sectionColorOnly": "forbidden",
      "maxCardsPerScreen": 5,
      "nestedCard": "forbidden",
      "decorativeCardAccentBar": "forbidden",
      "decorativeShadow": "forbidden",
      "maxShadowedElementsPerScreen": 3,
      "maxFloatingPanelsConcurrent": 1,
      "maxBoldOccurrencesPerScreen": 4,
      "maxTopLevelHeadingsPerScreen": 1,
      "maxFontWeightsPerScreen": 3,
      "mixedIconStyles": "forbidden",
      "maxDecorativeIconsBeforeHeading": 0,
      "decorativeKpiGrid": "forbidden",
      "decorativeChart": "forbidden",
      "decorativeHero": "forbidden"
    },
    "summary": "1차 목업에서 퀄리티를 떨어뜨리는 대표 시각 안티패턴. 색·표면·타이포·아이콘·대시보드 톤 다섯 영역으로 묶었다. 플로우/사용성 차원은 별도 — get_guide({ topic: 'pattern:dark-patterns' }) 참고.",
    "rules": [
      "**Tone-on-Tone Filled 금지** — 연한 primary/blue 배경 위에 같은 계열의 연한 filled tag/badge/box 를 반복하지 않는다. 같은 톤 위 같은 톤은 위계를 만들지 못하고 영역만 흐려진다.",
      "**Primary 컬러 역할 제한** — Primary 는 CTA · interactive · 핵심 highlight 중 한 가지 역할로만. 배경/CTA/태그/카드/포커스/hover 에 동시에 쓰면 무엇을 클릭해야 할지 신호가 사라진다.",
      "**로고 컬러 ≠ UI 액센트** — 프로젝트 로고의 gradient/accent 색은 로고 표현 전용. 카드 배경, 배지, 버튼 컬러로 재사용하지 않는다.",
      "**Primary tint 반복 금지** — 한 섹션에서 primary tint 가 배경 · 라벨 · 아이콘 · 카드 surface 로 3회 이상 등장하면 neutral surface + 텍스트 위계로 낮춘다.",
      "**그라데이션 배경 금지** — linear / radial / conic gradient 배경 모두 사용 금지. 단색 토큰만 사용.",
      "**Section 구분, 색상 단독 금지** — 영역 구분은 1차 spacing(--semantic-gap-loose/wide) → 2차 Divider/Border → 마지막에 surface tone 순서로. 색만으로 나누면 색맹·저시력 사용자가 구조를 잃는다.",
      "**Card Everything 금지** — 모든 정보 단위를 카드로 감싸지 않는다. 카드는 '독립된 정보 단위' 일 때만. 단순 group/section 은 spacing + h3 + Divider 로 위계를 만든다. 한 화면에 카드가 5개를 넘으면 80% 이상 안티패턴.",
      "**카드 안 카드 중첩 금지** — 카드 내부 영역 강조는 surface.section tone 한 단계 또는 inline Chip/Badge 로. nested Card 는 위계 표현 도구가 아니다.",
      "**카드 장식 라인/accent 바 금지** — 카드 상단 컬러 라인(border-top accent) · 좌측 accent 보더 · ::before 컬러 바로 카드를 장식하지 않는다. 카드 테두리는 outlined 중립 1px 또는 footer/divider hairline 뿐 — 컬러 accent 선은 DS Card 에 없다. 강조는 색이 아니라 Chip/Badge·텍스트 위계로.",
      "**장식용 그림자 금지** — 떠 있지 않아야 할 요소(인라인 리스트 · 일반 카드 · 기본 입력)에 elevation/shadow 적용 금지. Shadow 는 floating UI(Modal · Popup · Dropdown · BottomSheet) 와 'hover 시 floating 표현' 에만.",
      "**Shadow-heavy 레이아웃 금지** — 한 화면에 그림자 있는 요소가 3개를 넘으면 floating 의미가 사라진다. Border 또는 surface tone 으로 대체.",
      "**Bold 남발 금지** — Bold 텍스트는 화면당 1-2 곳에만. 5곳 이상이면 위계가 사라지고 모든 글자가 평등해진다. 본문은 Regular/Medium.",
      "**최상위 헤딩 중복 금지** — h1/h2 같은 큰 제목은 화면당 1개. 보조 섹션은 h3 이하로 내려야 페이지 안에서 '어디가 본론' 인지 보인다.",
      "**위계 불명 텍스트 금지** — 인접한 두 영역이 같은 fontSize × fontWeight 이면 위계가 무너진다. 헤딩과 본문의 시각적 차이를 항상 만든다.",
      "**폰트 웨이트 3개 이상 혼용 금지** — 한 화면에 2-3개 웨이트만. Display(Bold) · Body(Medium/Regular) · Caption(Regular) 정도가 표준.",
      "**아이콘 스타일 혼용 금지** — 같은 화면/그룹 안에 Line · Filled · Colorful 아이콘을 섞지 않는다. `@nudge-design/icons` 단일 셋만, 같은 그룹은 한 스타일로 통일.",
      "**장식용 헤딩 아이콘 금지** — 서브타이틀(h3/h4) · Form Label · 본문 텍스트 앞 장식 아이콘 금지. 일부 헤딩에만 아이콘이 붙으면 위계가 깨진다. 한 화면 헤딩 앞 아이콘 5개 이상은 자동 위반.",
      "**Color icon 본문 남용 금지** — multi-color/colorful 아이콘은 결과 일러스트(TestresultSafe/Warning/Danger 등) 와 진입점 1-2개에만. 일반 UI 강조에는 monochrome currentColor 만 사용.",
      "**Fake Dashboard 금지** — 의미 없는 KPI 카드 / 메트릭 그리드 / 장식용 chart / 큰 일러스트 + gradient hero. EAP 도메인은 사용자 상태/액션을 직접 보여주는 것이 우선. Generic SaaS dashboard 톤 회피.",
      "**Pastel 카드 그리드 금지** — 카드마다 다른 pastel/tinted background 를 깔아 영역을 색으로 구분하지 않는다. 모든 bg 는 `--semantic-bg-*` 토큰 안에서 한정.",
      "**강조는 색보다 구조 먼저** — 강조가 필요하면 색상보다 정보 우선순위 · spacing · typography weight · CTA 위치를 먼저 조정한다. 색은 마지막 수단."
    ],
    "avoid": [
      "연한 블루 페이지 배경 + 연한 블루 Chip + 연한 블루 안내 박스 조합",
      "primary blue 를 배경 · 버튼 · 태그 · hover · focus · 카드 테두리 모두에 사용",
      "로고 gradient/accent 를 카드 배경이나 배지 색으로 재사용",
      "새 영역마다 같은 색 계열 배경을 깔아 모든 섹션이 강조처럼 보이는 구성",
      "linear/radial/conic gradient 배경",
      "영역 구분을 spacing 없이 색상만으로 처리",
      "정보 단위가 아닌 단순 group/section 도 모두 카드로 감싸기",
      "카드 안에 또 카드를 만들어 내부 강조 시도",
      "카드에 상단 컬러 라인/좌측 accent 바 등 장식용 컬러 보더 부착",
      "일반 카드 · 인라인 리스트 · 기본 입력에 shadow 적용",
      "한 화면에 floating panel(Modal/Drawer/Popup/Toast) 2개 이상 동시 노출",
      "한 화면에 Bold 텍스트 5곳 이상",
      "한 화면에 h1/h2 두 개 이상",
      "헤딩과 본문이 같은 fontSize × fontWeight 로 위계 모호",
      "한 화면에 폰트 웨이트 3개 이상 혼용",
      "Line + Filled + Colorful 아이콘을 한 화면/그룹에 혼용",
      "서브타이틀/Form Label/본문 앞 장식 아이콘 (일부에만 부착 → 위계 붕괴)",
      "multi-color 아이콘을 일반 UI 강조용으로 사용",
      "사용자 의사결정에 안 쓰이는 장식용 KPI 카드/메트릭 그리드",
      "데이터 인사이트 없이 장식 목적의 chart/graph",
      "큰 일러스트 + 큰 카피 + gradient 배경 hero section",
      "카드마다 다른 pastel background 로 영역을 색 구분"
    ]
  },
  "visual-reference": {
    "name": "visual-reference",
    "referenceInputs": {
      "accepted": [
        "Figma design URL 또는 figmaNodeUrl",
        "정답 스크린샷 이미지",
        "오답 스크린샷 이미지",
        "프롬프트에 첨부된 이미지/링크"
      ],
      "minimum": "최소 정답 1장 + 오답 1장. 가능하면 총 6-10장.",
      "format": "[good|bad] source=<figma-url|image-name> caption=<1-line reason>",
      "fallbackQuestion": "두 가지만 먼저 확인할게요. ① 시각 기준 — Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료로 진행해도 될지, 정답/오답 레퍼런스가 있으면 함께(정답 1-2장·피해야 할 오답 1-2장 + 각 1줄 캡션) 알려 주세요. ② 화면 영역 — 이 화면이 (a) 외부 제공 B2B 어드민[Nudge DS], (b) 사내 백오피스·운영툴/CMS[antd v5], (c) 일반 서비스(앱/웹)[Nudge DS] 중 무엇인가요? 캐포비처럼 어드민·서비스가 함께 있는 프로젝트면 어느 쪽인지, 어드민이면 페이지패턴 5종(onboarding/dashboard/list/detail/form) 중 어디에 가까운지도 알려 주세요."
    },
    "examples": [
      {
        "verdict": "good",
        "source": "Figma node or approved screenshot",
        "caption": "Neutral surface와 텍스트 위계로 정보 우선순위가 분리되고 primary CTA가 1개만 남아 있음."
      },
      {
        "verdict": "bad",
        "source": "Rejected AI mockup screenshot",
        "caption": "한 화면에 primary CTA, blue tint card, chip, icon 강조가 동시에 많아 모든 영역이 강조처럼 보임."
      }
    ],
    "metrics": {
      "recommendedReferenceCount": "6-10",
      "minGoodReferences": 1,
      "minBadReferences": 1,
      "recommendedGoodReferences": "1-2",
      "recommendedBadReferences": "1-2",
      "captionLength": "1 line",
      "preferFigmaNodeUrl": "true"
    },
    "summary": "목업 생성 전에 정답/오답 시각 레퍼런스를 수집하고, 1줄 캡션으로 톤 판단 기준을 고정하는 패턴.",
    "rules": [
      "목업 작성 전에는 프롬프트에 이미지, 스크린샷, Figma 링크, figmaNodeUrl 이 이미 있어도 항상 사용자에게 시각 레퍼런스 확인 질문을 한다.",
      "단, 같은 목업 작업에서 이미 질문했고 사용자가 답했거나, references.md 의 첫 줄 `task:` 슬러그가 현재 task 와 일치하면 다시 묻지 말고 읽어서 적용한다. 이전 task 의 stale references.md (예: cashwalk-biz-form 작업물이 남은 상태에서 geniet-diary 시작) 는 없는 것으로 간주.",
      "references.md 첫 줄은 `task: <project>-<screen-slug>` 형식 필수 (예: `task: geniet-diary-hub`). 이게 staleness 판정 기준.",
      "새 목업 요청에서 파일 생성/수정 전 현재 워크스페이스를 얕게 보고, 같은 PRD/같은 화면으로 보이는 작업폴더가 명백히 있으면 반드시 `동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?` 라고 묻고 답변 전 기존 폴더를 수정하지 않는다. 억지로 찾지 말 것(깊은 재귀/전체 디스크/유사도 검색 금지).",
      "사용자 응답으로 기존 첨부/링크를 기준으로 진행해도 되는지, 추가 정답/오답 레퍼런스가 있는지 확인한다.",
      "권장 세트는 정답 1-2장 + 오답 1-2장. 각 레퍼런스는 '왜 맞는지/틀린지' 1줄 캡션을 붙인다.",
      "`source` 로 허용되는 것은 Figma URL (`figma.com/...`) 또는 이미지 파일 (`.png/.jpg/.jpeg/.webp/.gif/.svg`) 뿐. PRD/spec/요구사항 `.md` 는 source 가 아니다 (텍스트 문서는 spec 이지 visual reference 가 아님).",
      "레퍼런스를 받은 뒤에는 projectTone 문장보다 레퍼런스 캡션을 우선한다.",
      "구현 전 references.md 를 읽고 good 기준은 레이아웃/간격/타이포/컬러 의사결정으로 매핑하고, bad 기준은 명시적 회피 규칙으로 적는다.",
      "완료 보고에는 어떤 reference cue 를 실제 화면에 반영했는지 2-4개로 요약하고, 최종 산출물의 full 절대경로를 반드시 포함한다."
    ],
    "avoid": [
      "레퍼런스 없이 '차분한/전문적인/친근한' 같은 형용사만 보고 화면 생성",
      "정답 이미지만 받고 오답 기준 없이 작업",
      "이미지의 색감만 따라 하고 정보 밀도, 강조 장치 수, CTA 위계를 무시",
      "references.md 를 저장만 하고 구현 계획/완료 보고에서 반영 근거를 설명하지 않음",
      "[stale-references-md] 이전 task 의 references.md 가 남아 있는데 'task: 슬러그' 비교 없이 '이미 답변 받음' 으로 통과시킴 — 반드시 슬러그 매칭",
      "[prd-as-visual] PRD 에 ASCII 레이아웃·컬러 스펙이 있다고 'visual reference 로 간주' — 텍스트 ≠ 시각자료, Figma 또는 이미지 필요",
      "[decisive-tone-bypass] 사용자 어조 ('바로 만들어줘' / 'PRD 지켜서') 가 단호하다고 게이트 skip — 어조는 우회 사유가 아님",
      "[soft-prompt-misread] 가이드의 'soft prompt' 표현을 'optional 권고' 로 약화 해석 — 이 게이트는 REQUIRED",
      "[checklist-omission] 메모리/체크리스트의 후반 단계만 따라가다 이 게이트를 'principles 응답에 끼어있는 부차 advisory' 로 격하",
      "[same-folder-overwrite] 같은 기획으로 보이는 기존 작업폴더가 명백히 보였는데도 v2 생성 여부를 묻지 않고 기존 폴더를 수정",
      "[relative-path-only] 완료 응답을 `dist/index.html` 같은 상대경로만으로 끝냄 — full 절대경로 필수"
    ]
  }
};
