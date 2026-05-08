/**
 * 컴포넌트별 사용 가이드 — d.ts 파싱만으로는 잡히지 않는
 * "이 컴포넌트를 어떻게 써야 하는가"의 큐레이션된 지식.
 *
 * 추가 기준:
 * - DS 매트릭스를 잘못 해석해 시각적 함정에 빠지는 경우(예: assistive solid)
 * - 슬롯/내부 padding 등 이미 적용된 스타일과 충돌 가능성
 * - 표준 variant에 없는 톤이 필요할 때 확장 슬롯 사용 패턴
 */

export interface ComponentGuide {
  name: string;
  summary: string;
  pitfalls: string[];
  recommended?: string[];
  colorMatrix?: Record<string, string>;
  interactivePattern?: string;
}

export const COMPONENT_GUIDES: Record<string, ComponentGuide> = {
  Button: {
    name: "Button",
    summary: "1차/2차 CTA. color × variant 매트릭스 조합으로 톤 결정.",
    pitfalls: [
      "color='assistive' + variant='solid'은 cool-gray 배경(#9CA2AE)이라 비활성 버튼처럼 보임. 활성 CTA로 사용 금지.",
      "primary 색은 화면당 가장 중요한 1개 액션에만 사용 (DESIGN.md Do's). 한 화면에 두 개 이상 primary 솔리드 = 위계 붕괴.",
      "파란 카드 위에 두는 CTA는 'secondary' solid (흰 배경 + 파란 글씨)가 대비 안전. 'assistive' solid는 거의 안 보임.",
    ],
    recommended: [
      "1차 CTA: color='primary', variant='solid'",
      "보조 액션: color='primary', variant='outlined' 또는 'soft'",
      "파괴 액션: color='error', variant='solid'",
      "비활성처럼 회색을 의도한 경우라면 disabled prop을 쓰고, '어두운 회색 솔리드'로 인상을 주려고 assistive를 솔리드로 쓰지 말 것",
    ],
    colorMatrix: {
      "primary/solid": "primary fill + 흰 텍스트 — 가장 중요한 CTA",
      "primary/outlined": "흰 배경 + primary 보더/텍스트 — 보조 액션",
      "primary/soft": "primary 25 배경 + primary 텍스트 — 3차 액션",
      "secondary/solid": "magenta 또는 흰배경 + 컬러 텍스트(브랜드 매트릭스 따름) — 강조",
      "assistive/solid": "cool-gray 400 배경 — 비활성처럼 보임. 사용 자제",
      "error/solid": "error fill — 파괴 액션 한정",
    },
    interactivePattern:
      "버튼은 onClick 핸들러를 항상 부착. 목업에서도 라우팅 시뮬(toast/console.log)이라도 넣을 것.",
  },
  IconButton: {
    name: "IconButton",
    summary: "아이콘만 있는 버튼. 접근성을 위해 aria-label 필수.",
    pitfalls: [
      "aria-label 누락 시 스크린리더가 읽지 못함.",
      "AppBar 우측 빈 영역에 아이콘이 들어갈 자리에 ChevronRight 같은 장식만 두면 인터랙션이 없는 채로 시각적 잡음만 발생.",
    ],
    recommended: [
      "AppBar 우측엔 알림/설정 같은 실제 기능 IconButton을 두기.",
      "<IconButton icon={<PushIcon/>} aria-label='알림' onClick={...}>",
    ],
  },
  TextButton: {
    name: "TextButton",
    summary: "텍스트만으로 된 액션. '전체보기' 같은 인라인 링크에 적합.",
    pitfalls: [
      "단순 <span>으로 만들지 말 것 — DS TextButton에 호버/포커스/접근성 처리가 들어있음.",
    ],
  },
  Card: {
    name: "Card",
    summary: "Compound 컴포넌트. Card.Root / Header / Body / Footer / Thumbnail 슬롯 구성.",
    pitfalls: [
      "Card.Header / Card.Body / Card.Footer는 styles.css에서 자체 padding을 가짐(대략 16/16/0, 12/16, 0/16/16). 외곽에 padding을 또 주면 이중 패딩으로 어긋남.",
      "Card.Title / Card.Subtitle의 기본 폰트 크기가 작음. Hero 카드에서 큰 점수 표시 등에는 슬롯 대신 div + 토큰으로 직접 구성이 가독성 ↑.",
      "그림자(elevation)와 보더를 동시에 적용하면 이중 계층 (DESIGN.md Don'ts).",
    ],
    recommended: [
      "단순 정보 카드: <Card.Root><Card.Header><Card.Title>...</Card.Title></Card.Header><Card.Body>...</Card.Body></Card.Root>",
      "클릭 가능 카드: <Card.Root clickable onClick={...}> — DS의 hover 효과가 자동 적용됨.",
      "큰 시각 강조가 필요한 Hero 카드는 슬롯 대신 div로 본문 직접 구성하고 토큰으로 typography 세팅.",
    ],
    interactivePattern:
      "Card.Root는 'clickable' prop과 onClick으로 인터랙티브화. 카드 내부에 또 별도 button을 두면 이벤트 버블링 주의.",
  },
  Chip: {
    name: "Chip",
    summary: "pill 형태 라벨. variant: outlined/filled/soft. label prop 필수.",
    pitfalls: [
      "label prop을 빠뜨리고 children을 넣지 말 것 — DS API와 어긋남.",
      "표준 variant에 없는 톤(예: caution, success)이 필요해도 raw <span>/<div>로 대체 금지. style prop으로 background/color/font-weight를 토큰 변수로 override + icon prop으로 좌측 도트 주입이 정공법.",
    ],
    recommended: [
      "주의 톤: <Chip label='주의 필요' variant='filled' shape='pill' size='sm' icon={<span style={{width:6,height:6,borderRadius:9999,background:'var(--color-semantic-caution-main)'}}/>} style={{background:'var(--color-semantic-caution-bg)',color:'var(--color-semantic-caution-text)',fontWeight:600}} />",
      "성공/에러도 같은 패턴으로 토큰 var()만 교체",
    ],
  },
  Modal: {
    name: "Modal",
    summary: "중앙 정렬 다이얼로그. 12px radius, 24px padding, 50% overlay.",
    pitfalls: [
      "Modal 내부에 다시 큰 그림자/보더를 추가하지 말 것 (이미 elevation md 적용됨).",
      "ESC/오버레이 클릭으로 닫히는 기본 동작을 막으면 접근성 저해.",
    ],
  },
  Tabs: {
    name: "Tabs",
    summary: "line/pill/square 3가지 variant. items + activeKey + onTabChange.",
    pitfalls: [
      "items 형식은 {key, title}[]. label 같은 다른 키 이름 사용 시 렌더 실패.",
      "변경 핸들러는 onTabChange (onChange 아님).",
    ],
  },
  Select: {
    name: "Select",
    summary: "드롭다운. options + value + onValueChange.",
    pitfalls: ["변경 핸들러는 **onValueChange** (onChange 아님). React 표준이 아닌 DS 컨벤션."],
  },
  Banner: {
    name: "Banner",
    summary: "페이지 상단 알림 띠. 그라데이션 배경 사용 금지.",
    pitfalls: [
      "Banner의 배경에 linear-gradient 사용하지 말 것. 단색 토큰만 (semantic-info-bg 등).",
    ],
  },
  Input: {
    name: "Input",
    summary: "1px 보더, surface 배경, 48px 높이. 라벨/헬퍼/아이콘 슬롯.",
    pitfalls: ["검색 변형이 필요하면 SearchInput을 사용. Input에 SearchIcon을 직접 박지 말 것."],
  },
  ProgressBar: {
    name: "ProgressBar",
    summary: "value/max 기반 진행도.",
    pitfalls: [
      "상태(주의/에러/성공)를 표현할 때는 color prop에 semantic 토큰 var(--color-semantic-*-main)을 넘겨 시각적 의미를 통일.",
    ],
  },
  Radio: {
    name: "Radio",
    summary:
      "단일 선택 입력. 단독으로 쓸 일은 거의 없고, RadioGroup + RadioGroupItem 조합으로 사용.",
    pitfalls: [
      "Radio를 단독으로 여러 개 두고 same name만 맞추는 패턴은 동기화 버그가 잦음. 무조건 RadioGroup으로 감쌀 것.",
      "RadioGroupItem은 RadioGroupContext 안에서만 동작. throw가 나면 RadioGroup으로 감싸지지 않은 것.",
      "value prop은 string. 숫자/객체 쓸 거면 String(value)로 직렬화하고 onValueChange에서 다시 파싱.",
    ],
    recommended: [
      '<RadioGroup name="freq" value={v} onValueChange={setV}> <RadioGroupItem value="daily" label="매일" /> ... </RadioGroup>',
      'horizontal 옵션 3개 이하일 때만 layout="horizontal". 그 이상이면 vertical이 스캔 쉬움.',
    ],
    interactivePattern:
      "그룹 단위로 onValueChange 한 번만 부착. 개별 Radio에 onCheckedChange 부착하지 말 것.",
  },
  Slider: {
    name: "Slider",
    summary: "연속값 입력 (통증·스트레스 강도 등). LikertScale은 고정 N단계, Slider는 연속.",
    pitfalls: [
      "5단계 같은 이산형 평가는 LikertScale을 쓸 것. Slider step=1 max=4로 흉내내지 말 것 — 시각적 의미가 다름.",
      "showValue=false인데 startLabel/endLabel만 있으면 사용자가 현재 값을 알 수 없음. 한쪽은 무조건 표시.",
      "max-min 범위가 너무 크면 한 칸 차이가 시각적으로 안 보임. step을 sensible 단위(5/10)로.",
    ],
    recommended: [
      '통증 강도: min=0 max=10 step=1 startLabel="없음" endLabel="극심" showValue',
      "스트레스 %: min=0 max=100 step=5 showValue formatValue={(v) => `${v}%`}",
    ],
  },
  Spinner: {
    name: "Spinner",
    summary: "인라인 회전 로더. 짧은 fetch (<2s)에 사용. 긴 로딩은 Skeleton.",
    pitfalls: [
      "전체 페이지 로딩에 Spinner를 가운데 띄우지 말 것 — 빈 화면 인상이 강함. Skeleton(레이아웃 유지)이 UX 더 좋음.",
      '버튼 내부에 넣을 때는 size="sm", color={cv.primary.fg} 등 컨텍스트 색에 맞춰 oversiede.',
      'label prop은 스크린리더용 ("로딩 중"이 기본). 무음 처리 금지.',
    ],
    recommended: [
      '<Button disabled><Spinner size="sm" color="currentColor" /> 처리 중...</Button>',
      '리스트 끝 무한스크롤: <Spinner size="md" />',
    ],
  },
  MoodSelector: {
    name: "MoodSelector",
    summary: "5단계 기분 선택. EAP 앱 첫 화면 핵심 인터랙션. 기본 5개 옵션이 내장됨.",
    pitfalls: [
      "options를 직접 넘길 때 5개를 벗어나면 가로 폭 문제 — 4~6개가 권장 범위.",
      "이모지 대신 아이콘 컴포넌트를 emoji 자리에 넘기지 말 것. emoji는 string 필드.",
      "value 미선택 상태가 default이므로 폼 제출 전 검증 필수.",
    ],
    recommended: [
      "기본: <MoodSelector value={mood} onValueChange={setMood} /> (5단계 자동)",
      "showLabels=false로 컴팩트하게 (좁은 카드 안)",
    ],
    interactivePattern:
      "기록 후 다음 단계(메모/저장)로 이어주는 게 자연스러움. 선택 직후 토스트만 띄우고 끝내지 말 것.",
  },
  AssessmentResultCard: {
    name: "AssessmentResultCard",
    summary:
      "심리검사 결과 카드. score/maxScore + level(normal/mild/moderate/severe) + 색 자동 매핑.",
    pitfalls: [
      "level과 점수를 임의로 분리하지 말 것 — 외부에서 점수 → 단계 매핑이 검사마다 다르므로 호출부에서 결정해서 넘김.",
      'title prop은 검사명("PHQ-9" 등). HTMLDivElement.title과 충돌 방지를 위해 Omit되어 있으니 ReactNode 가능.',
      'severe인데 description만 있고 후속 액션이 없으면 안전. severe 결과엔 actionLabel("상담 연결") 또는 옆에 CrisisCallout을 같이 둘 것.',
    ],
    colorMatrix: {
      normal: "success.bg + success.main — 정상",
      mild: "caution.bg + caution.text — 주의",
      moderate: "caution.bg + caution.text — 경계 (mild보다 진한 텍스트로 톤 차이)",
      severe: "error.bg + error.main — 심각",
    },
    interactivePattern:
      "actionLabel 클릭은 결과 상세 또는 다음 액션(상담 예약)으로. severe면 CrisisCallout과 묶어서 같이 노출.",
  },
  CrisisCallout: {
    name: "CrisisCallout",
    summary: "위기 신호 시 1393/119 등 즉시 연결 박스. dismiss 불가능. EAP의 안전 책임 영역.",
    pitfalls: [
      "Banner와 외형이 비슷하지만 절대 closable 만들지 말 것 — 위기 안내는 dismiss 되면 안 됨.",
      'tone="caution"은 "잠시 휴식이 필요해요" 수준에만. 자살 사고 등 실제 위기는 무조건 tone="danger".',
      "phoneNumber 제공 시 자동으로 tel: 링크 — 모바일에서 바로 통화. 데스크톱에서도 동작은 OS 핸들러가 받음.",
      "CrisisCallout 단독으로 화면 어딘가에 두지 말고, severe 결과 옆/혹은 채팅 화면 상단에 배치.",
    ],
    recommended: [
      'tone="danger" + actions=[{ label: "1393 자살예방상담", phoneNumber: "1393" }, { label: "119 응급", phoneNumber: "119", variant: "outlined" }]',
    ],
  },
  CounselorCard: {
    name: "CounselorCard",
    summary: "상담사 프로필 카드. 이름/자격/평점/태그/소개/예약 CTA. 1~2열 그리드에 잘 어울림.",
    pitfalls: [
      "imageSrc 없을 때 자동으로 이름 이니셜 표기. 빈 div를 imageSrc로 우회하지 말 것.",
      'tags는 5개 이하 권장 (그 이상은 시각 잡음). 정말 많이 보여줘야 하면 "+3" 더보기 패턴.',
      "ctaLabel 누르면 stopPropagation 자동 — onCardClick과 별개로 동작. 둘 다 부착해도 안전.",
      "bio는 -webkit-line-clamp 2로 자동 잘림. 더 긴 본문은 상세 페이지로.",
    ],
    interactivePattern:
      "리스트 화면에서는 카드 전체 클릭 → 상세, CTA(예약)는 상세 안에서. 두 액션을 한 화면에서 동시에 두면 사용자가 헷갈림.",
  },
  ChatBubble: {
    name: "ChatBubble",
    summary: "1:1 상담/챗봇 말풍선. role=me|them, group으로 코너 정리.",
    pitfalls: [
      "group prop을 안 넘기면 매 메시지가 둥근 모서리로 떠서 그룹감이 없음. 같은 발신자 연속 메시지면 first/middle/last 명시.",
      'them 측 avatar는 group="single"|"last" 일 때만 보이고, first/middle은 visibility:hidden으로 자리만 차지 — 정렬 어긋나지 않음. 직접 avatar를 끄지 말 것.',
      "time과 read는 메시지 끝(single/last)에만 노출. 모든 메시지에 시간 박지 말 것.",
      "텍스트 외 이미지/카드 첨부는 children에 직접 ReactNode 넘김. 별도 prop 없음.",
    ],
    recommended: [
      "group: 단독 single, 첫 메시지 first, 중간 middle, 마지막 last",
      "긴 대화 화면은 list virtualization 권장 (DS는 단순 렌더만 제공)",
    ],
  },
  ConsentChecklist: {
    name: "ConsentChecklist",
    summary: "전체동의 + 항목별 체크 + 펼치기. 회원가입/민감정보 동의에 표준화.",
    pitfalls: [
      "items[].required=true인데 체크 안 됐을 때의 검증은 호출부 책임. 컴포넌트 자체에서 막지 않음.",
      'detail이 길면 펼친 영역이 화면을 덮음 — 본문은 핵심만, 전문은 "전문 보기" 링크로.',
      '전체동의 토글 동작이 직관적이어야 함: 부분 체크 상태에서 누르면 "전체 체크"가 아니라 "전체 해제"로 가는 사례가 있는데, 이 컴포넌트는 "모두 체크면 해제, 아니면 전체 체크".',
    ],
    interactivePattern:
      "필수만 자동체크 후 사용자가 선택만 토글하는 흐름이 회원가입 컨버전에 유리.",
  },
  ScoreGauge: {
    name: "ScoreGauge",
    summary: "점수 시각화 (반원 게이지). 4단계(normal/mild/moderate/severe) 색 자동 매핑.",
    pitfalls: [
      "단계 경계는 검사마다 다름. segments prop으로 직접 넘겨 결과 해석을 통일.",
      "needle은 transform: rotate로 회전. CSS transform 충돌 환경(예: 부모 transform)에선 어긋날 수 있어 wrapper 별도 권장.",
      "showLegend는 4개라 모바일 가로폭 부족하면 줄 바뀜 — 카드 안에선 false 권장.",
      'max를 점수 합과 동일하게 — "100 만점"으로 정규화하지 말 것 (해석 매트릭스가 어긋남).',
    ],
    recommended: [
      'PHQ-9: <ScoreGauge value={score} max={27} segments={[{level:"normal",label:"정상",from:0,to:5}, {level:"mild",label:"경증",from:5,to:10}, ...]} />',
    ],
  },
  MedicationItem: {
    name: "MedicationItem",
    summary: "복용약 한 줄 표시. 이름/용량/시기/노트 + 체크.",
    pitfalls: [
      "리스트로 쌓을 때는 부모에 gap 8~12px. MedicationItem은 자체 margin 없음.",
      "onTakenChange를 안 넘기면 체크박스가 안 보임 — 표시 전용으로 쓸 수 있음.",
      'times는 morning/noon/evening/bedtime 4개 enum만. 복약 시간을 분 단위로 보여주려면 note에 "식후 30분" 같이 텍스트로.',
    ],
    interactivePattern:
      '체크 후 즉시 토스트보다 리스트 상단에 "오늘 X/Y 복용 완료" 진행도 ProgressBar 표시가 더 동기 부여됨.',
  },
  AudioPlayer: {
    name: "AudioPlayer",
    summary: "명상/이완 가이드 플레이어. 재생/일시정지/시크/이전/다음.",
    pitfalls: [
      "playing/currentTime/duration은 외부 상태 — useState + audio ref + timeupdate 이벤트로 동기화. DS는 UI만 제공.",
      "onSeek 미제공이면 슬라이더가 disabled. 시크 막을 거면 명시적으로.",
      "title prop도 HTMLDivElement.title과 충돌하지 않도록 Omit됨. ReactNode 가능.",
      "onSkipBack/Forward는 옵셔널 — 단일 트랙이면 둘 다 생략하면 표시 안 됨.",
    ],
    recommended: ["10분 미만 단일 가이드: SkipBack/Forward 생략. 시리즈 재생만 둘 다 부착."],
  },
  ActivityTimeline: {
    name: "ActivityTimeline",
    summary: "상담/검사 이력 타임라인. dot + line + 날짜/제목/상태 배지.",
    pitfalls: [
      "마지막 항목의 line은 자동으로 안 그려짐(:last-child). 중간에 splice해서 추가/삭제할 때 key 유지 잘 할 것.",
      'status="ongoing"는 box-shadow ring 효과 — 한 화면에 여럿 두면 시각 잡음. 보통 1개만.',
      "statusLabel 없이 status만 주면 dot 색만 바뀌고 우측 배지는 안 뜸. 둘 다 필요.",
      "items 길이가 20+ 넘으면 페이지네이션 또는 가상화 권장.",
    ],
    interactivePattern:
      "각 아이템을 클릭 가능하게 하려면 description 자리에 작은 TextButton/Link를 넣는 패턴 — 행 전체 onClick은 우발 클릭 위험.",
  },
  OtpInput: {
    name: "OtpInput",
    summary: "N자리 인증코드 입력. 자동 포커스 이동, 붙여넣기 분배, 숫자 전용.",
    pitfalls: [
      "value는 string. length만큼 채워지면 onComplete 발화 — 그 안에서 자동 제출 처리하면 사용자 경험 좋음.",
      'autoComplete="one-time-code"가 첫 셀에만 붙음 — iOS/Android에서 SMS 자동 추출이 동작하려면 첫 셀만이어야 함.',
      "입력은 숫자만 허용 (영문/특수문자 자동 필터링). 영숫자 OTP가 필요하면 별도 컴포넌트 필요.",
      "Backspace는 두 단계 동작: 현재 셀에 값 있으면 비우고, 비어있으면 이전 셀로 포커스 이동 + 비움.",
    ],
    recommended: [
      "회원가입/로그인 SMS 인증: length=6, autoFocus, onComplete로 자동 검증 호출",
      "에러 시 error prop + Toast 같이 띄우기. 자동 clear는 사용자 혼란 유발 — 호출부에서 결정.",
    ],
    interactivePattern:
      "인증 실패 시 자동 clear는 옵션 — 어떤 자리가 틀렸는지 모르므로 보통 통째 clear가 안전.",
  },
  FileUpload: {
    name: "FileUpload",
    summary: "Drag&drop + 클릭 업로드. multiple/accept/maxSize 지원. 제어 컴포넌트.",
    pitfalls: [
      "value가 File[] 제어 컴포넌트 — 내부 상태 안 가짐. 부모에서 useState로 관리.",
      'onValueChange는 "성공" 파일만, onReject는 거부된 파일 — 둘이 분리되어 있음. 같이 다루지 말 것.',
      "maxSize는 bytes 단위 (10MB = 10 * 1024 * 1024). MB로 착각하지 말 것.",
      "accept는 브라우저 힌트일 뿐이라 실제로는 다른 파일도 들어올 수 있음 — 서버에서 한 번 더 검증 필요.",
      "multiple=false에서 두 번째 파일을 드롭하면 첫 번째를 덮어씀(slice(0, 1)). 추가 누적 X.",
    ],
    recommended: [
      '프로필 이미지: accept="image/*", maxSize=5MB, multiple=false',
      '진단서 첨부: accept=".pdf,.jpg,.png", maxSize=10MB, multiple',
      "errorMessage prop으로 거부 사유 지속 표시 (Toast 한 번 띄우는 것보다 명확)",
    ],
  },
  DateRangePicker: {
    name: "DateRangePicker",
    summary: "시작/끝 날짜 한 쌍 선택. DatePicker 두 개 + 빠른 프리셋(최근 7일 등).",
    pitfalls: [
      "value는 { from?, to? } — 부분 선택 가능 (시작만 있을 수 있음). 폼 검증 시 둘 다 있는지 체크.",
      "끝일은 자동으로 minDate=시작일 — 시작일을 뒤로 옮기면 끝일이 자동으로 비워짐(value.to>from 체크).",
      "프리셋은 defaultRangePresets로 빠른 것 3개 제공 (7일/30일/이번 달). 검사·리포트마다 다른 기본값이 필요하면 직접 정의.",
      'presets[].range는 함수 — 호출 시점의 "오늘"을 기준으로 계산하기 위함. 객체 리터럴로 박지 말 것.',
    ],
    recommended: [
      "리포트 기간 필터: defaultRangePresets 그대로 사용",
      '검사 이력 검색: maxDate=오늘, presets에 "전체" 추가',
    ],
  },
  Calendar: {
    name: "Calendar",
    summary:
      "인라인 월간 캘린더 그리드. DatePicker(popover 입력)와 다르게 화면에 펼쳐져 있는 콘텐츠형 캘린더.",
    pitfalls: [
      "폼 안에서 날짜 한 개 입력받는 용도면 DatePicker를 쓸 것. Calendar는 캘린더 자체가 콘텐츠인 화면용.",
      "value/onChange는 ISO 문자열(YYYY-MM-DD). Date 객체로 비교하지 말 것 — 시간대 이슈 발생.",
      "markers는 dot만 표시. 라벨/시간 등 풍부한 정보가 필요하면 캘린더 아래에 별도 List/Card로 표현.",
      "month prop을 주면 controlled로 동작하고 onMonthChange로만 월이 바뀜. 안 주면 내부 state.",
    ],
    recommended: [
      "예약 화면: isDateDisabled로 과거/예약 불가 날짜 차단",
      "감정 캘린더: markers에 색상으로 mood 단계 매핑",
      "복약 캘린더: markers + 클릭 시 BottomSheet로 상세",
    ],
    interactivePattern:
      "onChange(iso)로 선택을 받고, 외부에서 그 날짜에 해당하는 List/Card를 갱신. weekStartsOn=1로 월요일 시작도 가능.",
  },
  Carousel: {
    name: "Carousel",
    summary:
      "가로 스와이프 슬라이더. 홈 배너, 콘텐츠 추천, 온보딩에 사용. drag/dots/autoplay/loop 내장.",
    pitfalls: [
      "정보 위계가 동등한 항목 N개를 보여주는 용도라면 캐러셀 대신 가로 스크롤 리스트가 더 나음 — 캐러셀은 한 번에 1개만 보임.",
      "autoplay만 켜고 loop를 안 켜면 마지막 슬라이드에서 멈춤. 둘 다 함께 사용.",
      "슬라이드 1~2장이면 캐러셀 의미 없음. 그냥 카드/배너로.",
      "슬라이드 안에 자체 가로 스크롤(예: 가로 리스트)을 넣으면 드래그 충돌. 세로 스크롤만 허용.",
    ],
    recommended: [
      "홈 배너: <Carousel autoplay={3000} loop indicator='dots'>",
      "이미지 갤러리: indicator='counter' (현재 N/M 표시)",
      "온보딩 3~5장: showArrows=false, indicator='dots'",
    ],
    interactivePattern:
      "activeIndex/onActiveIndexChange로 외부 동기화 가능. 드래그 임계값은 viewport 폭의 15%.",
  },
  VideoPlayer: {
    name: "VideoPlayer",
    summary: "HTML5 video 래퍼. 포스터/제목/길이 오버레이 + 커스텀 재생 UI 또는 nativeControls.",
    pitfalls: [
      "autoPlay는 muted=true와 함께가 아니면 브라우저가 차단. autoPlay만 단독으로 켜지 말 것.",
      "유튜브/비메오 embed 용도가 아님 — src는 mp4/webm 같은 호스팅된 영상.",
      "라이브 스트리밍/HLS는 미지원. HLS.js 등 별도 라이브러리를 video DOM에 부착하는 패턴 필요.",
      "nativeControls=true로 두면 커스텀 오버레이는 무시됨. 둘 중 하나만.",
    ],
    recommended: [
      "명상 영상: <VideoPlayer src=... poster=... title='아침 명상' durationLabel='5:30' />",
      "스토리 형식: aspectRatio='9 / 16'",
      "자동 반복 미리보기: autoPlay muted loop",
    ],
  },
  NumberStepper: {
    name: "NumberStepper",
    summary:
      "수량 조절 +/- 버튼 입력. Stepper(과정 인디케이터)와 이름은 비슷하지만 전혀 다른 용도.",
    pitfalls: [
      "Stepper(StepperVariant: numbered/dots)와 혼동 금지. 그건 회원가입 단계 같은 '진행도 표시'.",
      "큰 범위(100+) 입력에는 부적합. tap/click을 N번 해야 하므로 Input type='number'를 쓸 것.",
      "min/max 도달 시 해당 버튼이 자동 비활성. 외부에서 또 비활성 처리할 필요 없음.",
    ],
    recommended: [
      "복약 횟수: min=1 max=10 unit='회'",
      "장바구니 수량: min=1 max=99 editable",
      "알림 빈도: step=5 unit='분'",
    ],
    interactivePattern: "value/onValueChange는 controlled 강제. 내부 state 없음 — 부모에서 관리.",
  },
  Autocomplete: {
    name: "Autocomplete",
    summary:
      "입력 + 드롭다운 추천. SearchInput(자유 검색)과 Select(고정 목록)의 중간. 키보드 ↓↑/Enter/Esc 내장.",
    pitfalls: [
      "options는 외부에서 필터링해 전달 — 컴포넌트가 자동 필터링하지 않음 (서버 검색을 위한 의도적 설계).",
      "onSelect 후 onValueChange(label)이 자동 호출됨. value를 다시 set하지 말 것 (이중 호출).",
      "minQueryLength=0으로 두면 빈 입력에서도 드롭다운이 열림. 추천 노출이 의도가 아니면 1+ 권장.",
      "options 수가 매우 많으면(50+) 가상 스크롤 별도 필요. 컴포넌트는 max-height 280px + scroll만 제공.",
    ],
    recommended: [
      "약 검색: useMemo로 클라이언트 필터, description에 성분/용량",
      "센터 검색: minQueryLength=2, 비동기 fetch + loading=isFetching",
      "키워드 자동완성: highlight=true (기본), 결과 없을 때 emptyMessage 커스텀",
    ],
  },
  SelectionCard: {
    name: "SelectionCard",
    summary: "카드형 단일/다중 선택지 (RadioCard/CheckboxCard 통합). compound — Group + Item.",
    pitfalls: [
      "라벨만 있는 단순 선택은 Radio/Checkbox를 쓸 것 — SelectionCard는 카드 단위(타이틀+설명+아이콘) 전제.",
      "mode='single'에서는 value/onValueChange, mode='multiple'에서는 values/onValuesChange. 헷갈리지 말 것.",
      "옵션이 5개 이상이면서 라벨이 짧다면 Chip 토글 그룹이 더 컴팩트.",
      "horizontal 레이아웃은 옵션 3개 이하일 때만. 그 이상은 wrap돼서 어색해짐.",
    ],
    recommended: [
      "상담 방식 선택: <SelectionCard.Group mode='single'> <Item value='chat' title='채팅' description='...' />",
      "관심사 다중: mode='multiple', 카드마다 description으로 의미 보강",
      "플랜 선택: icon prop으로 좌측 일러스트, title/description으로 가격/혜택",
    ],
    interactivePattern:
      "Group의 onValueChange/onValuesChange로만 상태 관리. Item에 onClick 부착 금지(라벨이 input을 토글).",
  },
  Snackbar: {
    name: "Snackbar",
    summary:
      "inline 알림. 액션(되돌리기) / 닫기 버튼 / 시맨틱 variant 지원. Toast(자동 사라짐)와 분리된 컴포넌트.",
    pitfalls: [
      "임시 메시지(저장됨/복사됨)에 Snackbar를 길게 띄우지 말 것 — Toast가 더 적합.",
      "액션이 두 개 이상 필요하면 Snackbar 대신 Modal/Popup을 검토.",
      "variant 미지정 시 검은 배경. 페이지가 흰 배경일 때 가장 강조되며, 시맨틱 톤이 필요하면 variant 사용.",
      "title 없이 description만 사용하지 말 것 — 시맨틱 의미가 무너짐.",
    ],
    recommended: [
      "되돌리기: <Snackbar title='삭제됐어요' actionLabel='되돌리기' onAction={undo} />",
      "에러 + 재시도: variant='error' actionLabel='다시 시도'",
      "사용자가 닫을 때까지 유지: closable + onClose",
    ],
    interactivePattern:
      "Snackbar는 자체 visibility를 관리하지 않음 — 부모가 mount/unmount로 표시 여부 통제.",
  },
  FAB: {
    name: "FAB",
    summary:
      "Floating Action Button. 화면 하단에 떠 있는 가장 중요한 단일 액션. position 기본 bottom-right (fixed).",
    pitfalls: [
      "한 화면에 FAB는 1개만. 2개 이상 두면 위계 붕괴.",
      "StickyBottom CTA가 있는 화면에는 FAB를 두지 말 것 — 두 요소가 겹쳐서 안전 영역이 무너짐.",
      "position='bottom-right' 등은 position: fixed로 동작. Storybook/테스트에서는 static + 부모에서 fixed 처리.",
      "label 없이 아이콘만 쓰면 aria-label 필수. 누락 시 스크린리더 접근성 깨짐.",
      "offset 기본 16px — 모바일 하단바(56px)와 겹치면 offset={80} 등으로 보정.",
    ],
    recommended: [
      "일기 화면 새 글 작성: <FAB icon={<EditIcon/>} label='새 글' position='bottom-right' />",
      "감정 캘린더 빠른 기록: <FAB icon={<PlusIcon/>} aria-label='기록 추가' />",
      "하단바 있는 화면: offset={72}",
    ],
  },
  BreathingGuide: {
    name: "BreathingGuide",
    summary:
      "호흡 가이드 애니메이션. 원이 커지고 작아지면서 들숨/멈춤/날숨/쉼을 시각화. phases로 사이클 자유 정의.",
    pitfalls: [
      "cycles 미지정 시 무한 반복. 콘텐츠 종료를 원하면 cycles + onComplete 페어 사용.",
      "phases의 seconds는 정수만(타이머 1초 단위). 분 단위 호흡은 의도적으로 미지원.",
      "외부에서 playing prop 줄 때 onPlayingChange를 빼먹으면 내부 시작/정지 버튼이 동작 안 함.",
      "CrisisCallout 위에 즉시 노출하면 압박감을 줄 수 있음. 위기 상황 → 안내 후 별도 화면에서 시작 권장.",
    ],
    recommended: [
      "박스 호흡(기본): <BreathingGuide />",
      "수면 유도: phases=[{inhale:4},{hold:7},{exhale:8}]",
      "콘텐츠 카드: cycles=3, autoStart, onComplete로 다음 단계",
    ],
  },
  StreakCard: {
    name: "StreakCard",
    summary: "연속 기록 트래커 카드. streak 숫자 + 최근 7~14일 점 그리드. 챌린지/습관 강화 화면.",
    pitfalls: [
      "days는 최근 7~14일이 시각적으로 적절. 30일 이상이면 EmotionHeatmap 사용 검토.",
      "streak=0 상태로 풀 너비 카드를 노출하면 동기 부여 효과가 약함 — 시작 단계에는 더 작은 EmptyState 안내가 좋음.",
      "오늘 데이터가 미완료일 때는 자동으로 점선 테두리(today)로 표시. 'today' 표시를 직접 만들지 말 것.",
    ],
    recommended: [
      "감정 기록 7일: days=[{date,label:'일',done}, ...] 7개",
      "복약 트래킹: icon='💊', 숫자만 강조 (days 생략)",
      "끊긴 후 재시작: footer로 '작은 시작' 같은 격려 문구",
    ],
  },
  EmotionHeatmap: {
    name: "EmotionHeatmap",
    summary: "월간 감정 히트맵. 5단계(0~4)를 색 강도로 시각화. 셀 클릭으로 그 날 상세 화면 진입.",
    pitfalls: [
      "entries에 없는 날짜는 자동으로 빈 셀(점선). 0 단계로 채우지 말 것 — treatZeroAsEmpty 기본 true.",
      "colors는 5개 필수 + 옅음→짙음 순서. 4개나 6개 넘기면 인덱스 어긋남.",
      "30일 미만 기록(7~14일)은 StreakCard가 더 적절 — 히트맵은 한 달 단위.",
    ],
    recommended: [
      "기분 트렌드: 기본 푸른 5단계, onCellClick으로 일기 화면 이동",
      "스트레스 강도: warm 톤(#FFE9C4 → #C25B0E), legendLabels={low:'차분',high:'활기'}",
      "챌린지 30일: title='30일 챌린지', 빈 셀이 남은 일자",
    ],
  },
  AppointmentCard: {
    name: "AppointmentCard",
    summary: "잡힌 상담 예약 한 건. 날짜 블록 + 제목/시간/방식/장소/상태 배지 + 액션 버튼들.",
    pitfalls: [
      "상담사 선택 화면에 쓰지 말 것. 그건 CounselorCard 영역. AppointmentCard는 '잡힌 일정' 표시 전용.",
      "onClick(카드 전체)과 actions를 함께 사용 가능 — 내부에서 액션 클릭 시 stopPropagation됨.",
      "status에 따라 자동으로 배지 색이 바뀌므로 직접 색을 override하지 말 것 (시맨틱 의미 깨짐).",
      "in-person 모드일 때 location 필수. 그 외 모드는 location 생략.",
    ],
    recommended: [
      "내 예약 리스트: <AppointmentCard ... actions=[{label:'상세'},{label:'참여',primary:true}] />",
      "홈 다음 일정: onClick으로 디테일 화면, 액션 없이 카드 전체 클릭",
      "방문 상담: mode='in-person', location='강남센터 3층 301호'",
    ],
  },
  JournalEntry: {
    name: "JournalEntry",
    summary:
      "감정 일기 한 건 카드. 무드(이모지) + 날짜 + 제목 + 본문 클램프 + 태그 + 썸네일 + 푸터.",
    pitfalls: [
      "본문은 기본 3줄 클램프. 전체 노출하려면 maxLines={9999}로 해제.",
      "title 없이 body만으로도 동작 — 짧은 메모형 일기에는 title 생략이 자연스러움.",
      "tags 안에 # 기호를 넣지 말 것. 컴포넌트가 자동으로 # 접두사 붙임.",
    ],
    recommended: [
      "리스트: onClick으로 디테일 진입",
      "감정 일기: mood에 이모지, tags에 감정 키워드",
      "사진 일기: thumbnailSrc 추가",
    ],
  },
  ChatComposer: {
    name: "ChatComposer",
    summary: "채팅 입력바. ChatBubble의 짝. 자동 확장 textarea + 빠른 응답 + 첨부/마이크 + 글자수.",
    pitfalls: [
      "value/onValueChange/onSubmit 모두 controlled — 내부 state 없음.",
      "submitOnEnter=true(기본)에서 Enter=전송, Shift+Enter=줄바꿈. 모바일에선 키보드의 줄바꿈 키 사용.",
      "quickReplies는 onClick에서 onValueChange 또는 onSubmit을 직접 호출 — 컴포넌트가 정책을 강제하지 않음.",
      "onAttach/onMic prop을 안 주면 해당 버튼이 자동 숨김 (UI 요소 안 만들고 깔끔).",
    ],
    recommended: [
      "1:1 상담: <ChatComposer value, onValueChange, onSubmit, maxLength={1000}>",
      "챗봇 + 빠른 응답: quickReplies=[{label, onClick: ()=> onSubmit(...)}]",
      "음성 메모: onMic만, onAttach 생략",
    ],
  },
  PhoneInput: {
    name: "PhoneInput",
    summary:
      "국가 코드 + 휴대폰 번호 입력. ISO code 관리 + 다이얼 코드/국기는 countries 데이터에서 조회.",
    pitfalls: [
      "countryCode는 ISO code(KR, US 등)로 관리. '+82' 문자열을 state에 두지 말 것.",
      "번호 마스킹/하이픈 자동화는 컴포넌트가 강제하지 않음 — 필요하면 onValueChange에서 직접.",
      "기본 5개국(KR/US/JP/CN/GB) 외 필요하면 countries prop으로 직접 정의.",
    ],
    recommended: [
      "회원가입: helperText='인증번호를 받을 번호를 입력해주세요'",
      "에러: error + helperText='번호 형식이 올바르지 않아요'",
      "프로필 표시: disabled로 변경 불가 표시",
    ],
  },
  SignaturePad: {
    name: "SignaturePad",
    summary:
      "전자 서명 캔버스. 동의서/가입 서명 추출. ref(SignaturePadHandle)로 clear/toDataURL/isEmpty.",
    pitfalls: [
      "onChange로 매 stroke 추출하면 큰 base64가 잦은 리렌더 — ref로 제출 시점에만 toDataURL() 호출 권장.",
      "빈 캔버스의 toDataURL()은 null 반환. 서명 검증에 사용.",
      "터치 디바이스에서 wrap의 touch-action: none 필수 (스크롤 방해 방지) — 컴포넌트 내장.",
    ],
    recommended: [
      "동의서: ref + Button onClick에서 isEmpty() 체크 후 toDataURL 제출",
      "읽기 전용 표시: disabled (이미 그려진 dataURL은 별도 <img>로 표시)",
    ],
  },
  CoachMark: {
    name: "CoachMark",
    summary: "온보딩 dim 툴팁. 특정 DOM 영역을 강조 + 단계별 안내. Tooltip과 분리(가벼운 hover용).",
    pitfalls: [
      "단순 hover 설명용은 Tooltip을 쓸 것. CoachMark는 화면 전체 dim + 강제 가이드.",
      "target은 selector(string) 또는 element-getter 함수. 마운트 시점에 DOM에 존재해야 함.",
      "스크롤 필요한 위치를 가리키면 사전에 scrollIntoView 직접 호출 — CoachMark가 자동 스크롤 안 함.",
      "한 화면에 매번 띄우지 말 것 — 첫 진입/새 기능 출시 등 명시적 트리거에만.",
    ],
    recommended: [
      "첫 진입: steps 3~5개, 마지막 단계 후 onClose에서 localStorage 플래그 저장",
      "단일 안내: hideSkip + steps 1개",
      "도움말 재생: ref로 외부에서 step 제어",
    ],
  },
  Sparkline: {
    name: "Sparkline",
    summary: "미니 추이 차트 (line/area/bar). 축/레이블 없음 — 카드 안 시각 신호용.",
    pitfalls: [
      "정확한 비교가 필요한 본격 차트가 아님. 50개 이상 데이터 포인트는 가독성 저하.",
      "음수가 섞인 데이터에는 showBaseline=true로 0 기준선을 노출.",
      "color는 단색만. 그라데이션은 area variant에서 자동(투명도) — 직접 그라데이션 색을 넘기지 말 것.",
    ],
    recommended: [
      "메트릭 카드: '7.4시간' + Sparkline kind='area' color=success",
      "리스트: kind='line' + showLastDot으로 마지막 값 강조",
      "막대: 일별 카운트 같은 이산형 데이터",
    ],
  },
  CircularProgress: {
    name: "CircularProgress",
    summary:
      "원형 진행도. 단순 value/max 비율 표시. ScoreGauge(단계 분류 결과)와 분리, ProgressBar(가로)와 분리.",
    pitfalls: [
      "심리검사 결과 등 단계 분류가 중요하면 ScoreGauge를 쓸 것 — CircularProgress는 비율만.",
      "가로 막대로 충분한 단순 진행은 ProgressBar가 적절. CircularProgress는 강조/포커스 용도.",
      "label을 커스텀(분/회 등)할 때 caption으로 max를 표시하면 의미가 분명 (예: label='28분' caption='목표 60분').",
    ],
    recommended: [
      "일일 목표: <CircularProgress value={done} max={60} label={`${done}분`} caption='목표 60분' />",
      "달성: color=success일 때 시각 신호 강함",
      "작은 인디케이터: hideLabel + 작은 size",
    ],
  },
  MultiStepForm: {
    name: "MultiStepForm",
    summary:
      "다단계 폼 컨테이너. 단계별 검증/진행/제출을 한 컴포넌트에서 관리. Stepper(인디케이터만)와 분리.",
    pitfalls: [
      "canProceed는 동기 boolean — 비동기 검증 결과는 외부 state로 보관 후 boolean으로 전달.",
      "마지막 단계의 '다음' 버튼은 자동으로 submitLabel + onSubmit으로 동작.",
      "단계 안에서 `useMultiStepForm()` 훅으로 next/prev 직접 호출 가능 (커스텀 액션 추가 시).",
      "단순 진행 표시만 필요하면 Stepper를 쓸 것 — MultiStepForm은 폼 흐름 컨테이너.",
    ],
    recommended: [
      "회원가입: indicator='progress', steps에 입력→인증→약관 동의 순서",
      "검사: indicator='steps' (TODO 단계 표시 강조)",
      "비동기 제출: submitting prop으로 버튼 비활성, onSubmit async",
    ],
  },
  ExpandableText: {
    name: "ExpandableText",
    summary: "긴 텍스트 줄 수 클램프 + '더보기/접기' 자동. 짧은 텍스트면 토글 자동 숨김.",
    pitfalls: [
      "본문 안에 폰트 사이즈가 섞이면 line-height 측정 정확도 떨어짐 — 단일 톤 텍스트에만 사용.",
      "JournalEntry는 자체 본문 클램프(maxLines)를 가지고 있음. 카드 안에서 ExpandableText 중첩하지 말 것.",
      "hideCollapse=true는 약관 같이 한 번 펼치면 끝나는 케이스용. 일기/콘텐츠는 접기도 가능해야 함.",
    ],
    recommended: [
      "콘텐츠 설명: lines={3}로 미리보기 + 더보기",
      "약관: hideCollapse + expandLabel='이용약관 전문 보기'",
      "리뷰: 기본 3줄, 자연스러운 토글",
    ],
  },
  PageHeader: {
    name: "PageHeader",
    summary:
      "페이지 단위 헤더. 제목 + 서브타이틀 + 우측 액션 + 하단 탭 슬롯. AppBar(글로벌 네비)와 분리.",
    pitfalls: [
      "글로벌 네비는 AppBar. PageHeader는 각 페이지 안의 타이틀 영역.",
      "onBack 지정 시 좌측 ← 자동 노출 — 직접 IconButton 추가하지 말 것 (이중 노출).",
      "bottom 슬롯은 헤더 padding 외곽까지 음수 마진으로 펼쳐짐. Tabs를 그 안에서 padding 직접 줄 때 0/24/0 등으로 미세 조정.",
      "bordered=true는 스크롤되는 본문과 헤더를 분리할 때만 사용. 분리감이 필요 없으면 false.",
    ],
    recommended: [
      "디테일: title + onBack + actions",
      "리스트: title + subtitle + actions(생성 버튼)",
      "탭형 페이지: title + bottom={<Tabs />}",
    ],
  },
  StatCard: {
    name: "StatCard",
    summary: "메트릭 강조 카드. 라벨 + 큰 숫자/단위 + delta(변화량) + Sparkline 슬롯(trailing).",
    pitfalls: [
      "trend만 주고 delta를 빼면 trend 색이 의미 없어짐. 둘 다 함께 사용.",
      "그리드에서 카드마다 value 자릿수 차이가 크면 baseline이 흔들림 — 동일 단위로 통일.",
      "trailing에 Sparkline을 넣을 때 width 100~120, height 36~48 정도가 적절. 그 이상은 카드 균형 깨짐.",
    ],
    recommended: [
      "대시보드 4-up 그리드: <StatCard label, value, unit, delta, trend>",
      "리포트 hero: + icon으로 강조",
      "추이 시각화: trailing={<Sparkline />} 결합",
    ],
  },
  QuickActionGrid: {
    name: "QuickActionGrid",
    summary: "홈 빠른 액션 그리드. 4~6칸 아이콘+라벨, 배지 지원. 4칸이 기본 균형.",
    pitfalls: [
      "라벨이 길면 줄바꿈됨. 4글자 이하 권장.",
      "5칸은 배치가 어색 — columns=4 + 8개(2행) 또는 columns=3 사용.",
      "배지는 알림 카운트(숫자) 또는 짧은 라벨('N','NEW') 위주. 긴 텍스트 X.",
      "아이콘은 이모지가 가장 단순하지만, 통일된 톤이 필요하면 SVG icon 컴포넌트로 교체.",
    ],
    recommended: [
      "홈 진입: 4칸 (감정기록 / 상담 / 챌린지 / 콘텐츠)",
      "시간대별 명상: iconBg로 시간대 톤 표현",
      "알림 진입: badge='3' 같은 미읽음 카운트",
    ],
  },
  TagInput: {
    name: "TagInput",
    summary:
      "태그 자유 입력. Enter/쉼표로 추가, Backspace로 마지막 삭제. Chip 표시(읽기 전용)와 분리.",
    pitfalls: [
      "value의 태그 문자열에 '#' 접두를 직접 넣지 말 것 — 컴포넌트가 표시 시 자동 추가, 입력 시 자동 제거.",
      "정해진 옵션에서 다중 선택은 SelectionCard mode='multiple' 또는 Chip 토글이 적합.",
      "자동완성이 필요하면 Autocomplete + 직접 태그 관리 — TagInput은 자유 입력 전용.",
    ],
    recommended: [
      "관심사 등록: maxTags=5, onMaxReached로 토스트",
      "콘텐츠 태그: allowDuplicates=false (기본)",
    ],
  },
  Lightbox: {
    name: "Lightbox",
    summary: "이미지 풀스크린 확대 모달. 키보드(Esc/←/→) + 좌우 버튼 + 카운터 + 캡션.",
    pitfalls: [
      "body.overflow 잠금이 자동 처리. 외부에서 또 잠그지 말 것.",
      "이미지 1장이면 좌우 네비 자동 숨김 — 외부에서 조건 분기 불필요.",
      "src는 미리 로드된 이미지 권장 — 큰 원본 이미지 직접 띄우면 첫 진입 지연.",
    ],
    recommended: [
      "갤러리: 썸네일 그리드 + onClick으로 idx 설정 + open",
      "단일: 이미지 1장 + caption로 컨텍스트 제공",
    ],
  },
  AvatarGroup: {
    name: "AvatarGroup",
    summary: "여러 아바타를 겹쳐 표시 + 초과 +N. 단체 상담/챌린지 참가자 같은 시각 신호용.",
    pitfalls: [
      "정확한 명단이 목적이면 List가 더 적절. AvatarGroup은 'N명이 함께'라는 시각 신호.",
      "단일 아바타는 Avatar 그대로. AvatarGroup은 N명 ≥ 2 케이스용.",
      "max를 너무 크게 두면(7+) 가로 폭이 늘어남 — 모바일은 4 권장.",
    ],
    recommended: [
      "단체 상담 참여자: max=4 size='md'",
      "챌린지: max=5 size='sm'",
      "이미지 + 이니셜 혼합: src 없으면 자동 이니셜 fallback",
    ],
  },
  CallControlBar: {
    name: "CallControlBar",
    summary:
      "통화 컨트롤. 음소거/카메라/스피커/종료 + duration 표시. 화상은 카메라, 음성은 스피커만 노출.",
    pitfalls: [
      "카메라/스피커는 onChange 콜백을 안 주면 버튼 자동 숨김. 둘 다 노출하지 말 것 (화상에 스피커, 음성에 카메라는 어색).",
      "종료 버튼 색을 override하지 말 것 — 시맨틱 의미(파괴) 유지를 위해 빨간색 고정.",
      "duration은 외부 timer state로 갱신 — 컴포넌트가 자체로 시간 계산하지 않음.",
    ],
    recommended: [
      "화상 상담: muted + cameraOn + duration",
      "음성 상담: muted + speakerOn + duration",
      "AI 통화: extra slot에 채팅 전환 버튼 추가",
    ],
  },
  VoiceRecorder: {
    name: "VoiceRecorder",
    summary:
      "음성 메모 녹음 UI. 큰 녹음 버튼 + 타이머 + 펄스 인디케이터. 마이크 접근/저장은 외부 처리.",
    pitfalls: [
      "seconds는 외부 timer로 갱신 — 컴포넌트는 시간 측정 안 함 (테스트 가능성).",
      "녹음 시작 시 navigator.mediaDevices.getUserMedia 등 마이크 권한 처리는 onStateChange 안에서.",
      "maxSeconds 도달 시 자동 onComplete + state='idle' — 직접 stop 처리할 필요 없음.",
    ],
    recommended: [
      "감정 일기 음성: maxSeconds=300 (5분), onComplete에서 파일 업로드",
      "챗 음성 메시지: maxSeconds=60",
    ],
  },
  NotificationItem: {
    name: "NotificationItem",
    summary: "알림 리스트 한 건. kind별 아이콘 톤, 미읽음 점, 시간 라벨, 본문 2줄 클램프.",
    pitfalls: [
      "Toast/Snackbar와 다름 — 알림 센터(히스토리) 한 건 표현용.",
      "description 본문은 자동 2줄 클램프. 더 길게 보여주려면 onClick으로 디테일 진입.",
      "unread는 단순 시각 표시 — 읽음 처리는 onClick 안에서 외부 state 갱신.",
    ],
    recommended: [
      "알림 센터: List 안에 NotificationItem 반복",
      "kind별 자동 아이콘: 직접 icon prop 안 줘도 됨",
    ],
  },
  CountdownTimer: {
    name: "CountdownTimer",
    summary:
      "종료 시각까지 자동 카운트다운. 1초 단위 갱신, 10초 이하 빨강 강조, mm:ss/hh:mm:ss/remaining 포맷.",
    pitfalls: [
      "endsAt을 매 렌더 새로 계산하면 카운트가 흔들림 — useMemo로 고정.",
      "onComplete는 0초 도달 시 1회만. 재시작은 endsAt을 새로 set.",
      "remaining 포맷은 자연어 — 정확한 카운트가 필요하면 mm:ss/hh:mm:ss.",
    ],
    recommended: [
      "인증 만료: useMemo로 expiry 고정 + onComplete로 재발송",
      "라이브 시작: format='remaining' (자연어)",
      "마감 카운트: 임박 시 빨강 강조 자동",
    ],
  },
  OnlineIndicator: {
    name: "OnlineIndicator",
    summary: "presence 점 (online/away/busy/offline). online은 자동 펄스 애니메이션.",
    pitfalls: [
      "online에 별도 강조 효과 추가하지 말 것 — 자동 펄스 있음.",
      "아바타 우하단에 올릴 때 부모 position:relative + 점 position:absolute.",
    ],
    recommended: ["상담사 리스트: showLabel=true로 텍스트 함께", "아바타 점: 라벨 없이 size=10"],
  },
  ReactionPicker: {
    name: "ReactionPicker",
    summary: "콘텐츠 반응 칩 그룹. 이모지 + 카운트, 다중 또는 단일 선택, hideCount 옵션.",
    pitfalls: [
      "value는 single이어도 string[] (길이 0~1) — 일관된 형태로 처리.",
      "options.count가 undefined면 자동 숨김. 0은 표시됨.",
      "옵션 4~6개 권장. 8개 이상이면 가로 폭 부담.",
    ],
    recommended: [
      "콘텐츠 좋아요/응원: 다중 선택 + 카운트 표시",
      "사용자 한 표: single + hideCount",
    ],
  },
  GreetingHeader: {
    name: "GreetingHeader",
    summary:
      "홈 인삿말 카드. 사용자 호칭({name}님 자동) + 인삿말 + 질문 + 액션 슬롯(MoodSelector 등).",
    pitfalls: [
      "greeting은 시간대 자동 인식 X — 외부에서 '좋은 아침이에요' 같은 시간대 표현 결정.",
      "name에 '님' 직접 붙이지 말 것 — 컴포넌트가 자동.",
      "tone='primary'는 카드 위에 또 카드를 올릴 때(흰 배경 위) 시각 분리에 유용.",
    ],
    recommended: [
      "홈 진입: actions={<MoodSelector />}로 첫 인터랙션 결합",
      "마이페이지: trailing={<Avatar />}",
    ],
  },
  TipCard: {
    name: "TipCard",
    summary:
      "한 줄 인사이트/팁 카드. info/success/warning/neutral 톤. 위기는 CrisisCallout, 페이지 띠는 Banner.",
    pitfalls: [
      "위기/긴급 안내에 사용하지 말 것 — CrisisCallout이 적합.",
      "페이지 상단 띠 알림은 Banner. TipCard는 콘텐츠 영역 안의 카드.",
      "actionLabel + onClick 함께 줘도 액션 버튼은 stopPropagation됨 (의도적).",
    ],
    recommended: [
      "오늘의 팁: tone='info' label='오늘의 팁' actionLabel='시작하기'",
      "챌린지 격려: tone='success' (완료 후 안내)",
      "홈 카드: 짧은 description + actionLabel",
    ],
  },
  PinPad: {
    name: "PinPad",
    summary: "PIN 키패드. 점 인디케이터 + 숫자 그리드. SMS 인증은 OtpInput, 일반 입력은 Input.",
    pitfalls: [
      "shuffleSeed를 매 렌더 새로 계산하면 키 배치 흔들림 — useMemo로 진입 시점에 고정.",
      "onComplete는 길이 도달 시 1회. 실패 시 value=''로 리셋해야 다시 입력 가능.",
      "OtpInput과 혼동 금지 — PIN은 사용자 비밀, OTP는 외부에서 받는 인증번호.",
    ],
    recommended: [
      "앱 진입 PIN: length=6 (기본)",
      "간편 결제: length=4",
      "보안 키패드: shuffle + 진입 시점 시드",
    ],
  },
  TimePicker: {
    name: "TimePicker",
    summary: "시간만 선택 (HH:mm). step(초 단위)/min/max 지원. 날짜+시간은 DatePicker와 조합.",
    pitfalls: [
      "step은 초 단위 — 5분이면 300, 15분이면 900.",
      "min/max도 HH:mm 문자열 — Date 객체 X.",
      "상담 슬롯 목록에서 선택은 TimeSlotPicker가 적합 — TimePicker는 자유 시각 입력.",
    ],
    recommended: ["알림: step=300, min='07:00' max='23:00'", "복약: step=900"],
  },
  AddressSearch: {
    name: "AddressSearch",
    summary:
      "주소 검색 + 상세 주소 입력. 검색 자체는 외부 API(카카오/네이버)로 처리, results만 전달.",
    pitfalls: [
      "onSearch는 외부 API 호출 트리거 — 컴포넌트가 직접 검색 안 함.",
      "value는 주소 + 상세 한 묶음 — 폼 state에서 단일 값으로 관리.",
      "loading 상태 동안 검색 버튼 비활성 — 직접 disabled 처리 X.",
    ],
    recommended: [
      "회원가입 주소: query/results를 외부 hook으로 관리",
      "방문 상담 주소: helperText='출입 가능한 주소를 입력해주세요'",
    ],
  },
  ImageCropper: {
    name: "ImageCropper",
    summary: "이미지 자르기 (circle/square). 드래그+줌, ref.toDataURL()로 PNG 추출.",
    pitfalls: [
      "외부 이미지(https) 자르기는 CORS 헤더 필요 — 서버 응답에 Access-Control-Allow-Origin 없으면 dataURL이 비어나옴.",
      "outputSize는 보통 200~400 — 너무 작으면 화질 저하.",
      "CSS transform 기반 변환이라 매우 큰 이미지(>4000px)는 모바일에서 끊길 수 있음.",
    ],
    recommended: ["프로필 사진: shape='circle' outputSize=200", "커버: shape='square' size=320"],
  },
  PullToRefresh: {
    name: "PullToRefresh",
    summary: "모바일 풀 투 리프레시. 화면 최상단에서 당기면 onRefresh, Promise 종료 자동 처리.",
    pitfalls: [
      "scrollTop > 0이면 트리거 X — 항상 최상단에서만 동작 (의도적).",
      "데스크톱에서 패턴이 어색 — 모바일 우선 화면에만.",
      "threshold가 너무 작으면 일반 스크롤도 잘못 인식. 64~96 권장.",
    ],
    recommended: [
      "리스트 새로고침: onRefresh={async () => { await refetch(); }}",
      "라벨 커스텀: pullLabel='당겨서 일기 동기화'",
    ],
  },
  WaveformPlayer: {
    name: "WaveformPlayer",
    summary:
      "음성 메시지 재생 (파형 시각화). AudioPlayer가 트랙바 형태라면 WaveformPlayer는 컴팩트 메시지용.",
    pitfalls: [
      "peaks 미지정 시 src 기반 의사 랜덤 — 정확한 파형이 필요하면 서버 메타데이터로 전달.",
      "긴 콘텐츠(>5분)는 AudioPlayer가 더 적합.",
      "막대 개수(bars)는 32~48 권장. 너무 많으면 모바일에서 막대가 1px 미만으로 줄어듦.",
    ],
    recommended: [
      "채팅 음성 메시지: 기본 사용",
      "내 메시지: color=primary, 상대 메시지: color='#666'",
    ],
  },
  MentionInput: {
    name: "MentionInput",
    summary: "@멘션 입력. 자동완성 드롭다운 + 키보드 네비. 트리거 커스텀 (#로 해시태그도 가능).",
    pitfalls: [
      "users는 전체 목록 — 컴포넌트가 자동 필터. 외부에서 미리 필터링하지 말 것.",
      "저장된 텍스트는 plain '@김민지' 형태 — ID로 보존하려면 별도 파싱.",
      "trigger 앞에 공백 또는 시작 위치여야 자동완성 트리거. 'email@a.com' 같은 케이스는 무시됨 (의도적).",
    ],
    recommended: ["단체 채팅 댓글: trigger='@'", "해시태그 자동완성: trigger='#'"],
  },
  Confetti: {
    name: "Confetti",
    summary:
      "축하 이펙트 (canvas 기반). active=true가 되는 순간 한 번 발사, onComplete에서 false로 리셋.",
    pitfalls: [
      "active를 항상 true로 두지 말 것 — onComplete에서 false 리셋 필수.",
      "진지한 결과(부정/주의)에 사용 금지 — 톤이 어울리지 않음.",
      "z-index=9999 — 모달 위에도 그려짐. 의도된 동작.",
      "prefers-reduced-motion 사용자 배려: 외부에서 매체 쿼리 체크 후 active를 막을 것.",
    ],
    recommended: ["챌린지 완료: 결과 화면 마운트 시 1회", "첫 가입 환영: 가입 완료 모달 위에 발사"],
  },
  CommentItem: {
    name: "CommentItem",
    summary:
      "댓글 한 건. 작성자/시간/본문 + 좋아요/답글 슬롯 + 답글 트리(replies). 본문 줄바꿈 자동 보존.",
    pitfalls: [
      "답글에는 isReply=true로 들여쓰기 시각 강조. 빠뜨리면 평면적으로 보임.",
      "likeAction은 슬롯 — LikeButton 컴포넌트를 직접 넘김. 텍스트 버튼만 두지 말 것.",
      "본문은 white-space: pre-wrap — text에 줄바꿈 그대로 넣으면 됨.",
    ],
    recommended: [
      "콘텐츠 댓글: avatar + author + likeAction + onReply",
      "답글 트리: replies={<>... isReply ...</>}",
      "상담사 댓글: authorBadge로 역할 표시",
    ],
  },
  LikeButton: {
    name: "LikeButton",
    summary:
      "좋아요 토글 + 카운트. 클릭 펑 애니메이션, 1000+는 자동 K 변환. ReactionPicker(여러 이모지)와 분리.",
    pitfalls: [
      "liked/count는 controlled — 외부 source of truth + onChange에서 둘 다 갱신.",
      "여러 종류 반응(공감/응원/와우)이 필요하면 ReactionPicker — LikeButton은 단일 좋아요.",
      "카운트가 음수가 되지 않도록 외부 가드.",
    ],
    recommended: [
      "콘텐츠 푸터: size='md' count 자동 K",
      "CommentItem: likeAction={<LikeButton size='sm' />}",
      "primary 톤: activeColor=primary로 좋아요/북마크 같은 의미 강조",
    ],
  },
  ShareSheet: {
    name: "ShareSheet",
    summary:
      "BottomSheet 형태 공유 모달. 4칸 그리드 + 선택적 링크 복사. 외부 SDK(카카오/메시지)는 onClick에서 직접 호출.",
    pitfalls: [
      "컴포넌트가 SDK를 부르지 않음 — targets[i].onClick 안에서 카카오/네이버 등 직접 호출.",
      "link 복사는 navigator.clipboard 사용 — HTTPS 환경 필요. file://나 http://에선 동작 X.",
      "Modal/BottomSheet과 별도. ShareSheet은 그리드 4칸 + 링크 정형 패턴.",
    ],
    recommended: [
      "콘텐츠 공유: 카카오/SMS/이메일/저장 + link",
      "챌린지 인증: 이미지 저장 + 카카오톡",
    ],
  },
};

/* ───────────── 디자인 원칙 (DESIGN.md 발췌 + 큐레이션) ───────────── */

export interface DesignPrinciples {
  brandTone: string;
  colors: Record<string, string>;
  typography: { family: string; weights: string[]; rules: string[] };
  spacing: { base: number; scale: number[]; rules: string[] };
  elevation: { rule: string; stack: Record<string, string> };
  shapes: Record<string, string>;
  dos: string[];
  donts: string[];
  bannedPatterns: { name: string; rule: string }[];
}

export const DESIGN_PRINCIPLES: DesignPrinciples = {
  brandTone:
    "신뢰감과 접근성. 차분하고 전문적이면서도 친근한 블루 기반. 진입 장벽 낮추는 것이 최우선. 깔끔한 라인, 충분한 여백, 명확한 위계, 과도한 장식 배제.",
  colors: {
    primary: "#2B96ED — CTA, 활성, 핵심 인터랙티브. 화면당 가장 중요한 1개 액션만.",
    secondary: "#ED2E77 — 마젠타 포인트. 프로모션, 감정 표현, 보조 강조.",
    error: "#F13F00 — 유효성 오류, 파괴적 액션.",
    caution: "#FFC303 — 주의 알림. 텍스트는 #FFA100.",
    success: "#13BFA2 — 완료, 긍정 피드백.",
    surface: "#FFFFFF — 페이지/카드 배경.",
    onSurface: "#383838 — 본문 텍스트, 아이콘.",
  },
  typography: {
    family: "Pretendard (한/영 모두)",
    weights: ["Regular(400)", "Medium(500)", "Semibold(600)", "Bold(700)"],
    rules: [
      "Display/Headlines: Bold(700), 18~52px",
      "Body: Medium~Regular, 14~16px",
      "Caption: Regular, 11~13px",
      "한 화면에 2~3개 웨이트만 사용 (3개 이상 혼용 금지)",
    ],
  },
  spacing: {
    base: 8,
    scale: [4, 8, 16, 24, 48, 64],
    rules: [
      "8px 그리드에 맞춰 간격 설정",
      "AppBar 52px / BottomBar 56px",
      "Mobile 좌우 마진 16px / Desktop 콘텐츠 1200px center",
    ],
  },
  elevation: {
    rule: "최소한의 그림자. 계층은 배경색/보더로 구분. 그림자와 보더 동시 적용 금지(이중 계층).",
    stack: {
      sm: "0 1px 3px rgba(0,0,0,0.1) — 카드, 드롭다운",
      md: "0 4px 12px rgba(0,0,0,0.15) — Modal",
      lg: "0 11px 15px -7px rgba(0,0,0,0.2) — Popup",
      up: "0 -4px 12px rgba(0,0,0,0.1) — BottomSheet",
    },
  },
  shapes: {
    sm: "4px — 작은 요소, 인풋 내부 장식",
    md: "8px — 버튼/인풋/모달 등 대부분 기본값",
    lg: "12px — 카드, 바텀시트",
    pill: "9999px — 칩, 토글",
  },
  dos: [
    "Primary 색상은 화면당 가장 중요한 1개 액션에만 사용",
    "텍스트 대비비 WCAG AA (4.5:1) 이상 유지",
    "터치 타겟은 최소 44px 보장",
    "8px 그리드에 맞춰 간격 설정",
    "인터랙티브 요소(Button/IconButton/Card.Root clickable/Tabs)에는 onClick 등 핸들러를 반드시 부착",
    "표준 variant에 없는 톤이 필요하면 컴포넌트의 style/icon 같은 확장 슬롯을 활용 (raw 요소로 대체 금지)",
  ],
  donts: [
    "한 화면에 3개 이상의 폰트 웨이트를 혼용하지 마세요",
    "둥근 코너와 각진 코너를 같은 뷰에서 섞지 마세요",
    "그림자와 보더를 동시에 적용하여 이중 계층을 만들지 마세요",
    "그라데이션 배경 사용 금지 — 단색 토큰만",
    "Card 슬롯(Header/Body/Footer)에 외곽 padding 추가 금지 — 자체 padding과 충돌",
    "Button color='assistive' + variant='solid' 조합을 활성 CTA로 사용 금지 (비활성처럼 보임)",
    "DS 컴포넌트에 정확히 매칭되는 쓰임이 있는데 raw <button>/<input>/<span>으로 대체 금지",
  ],
  bannedPatterns: [
    {
      name: "gradient-background",
      rule: "linear-gradient / radial-gradient / conic-gradient — 사용 금지",
    },
  ],
};
