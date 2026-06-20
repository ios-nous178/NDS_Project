---
metrics:
  maxArrowIconButtonPerViewport: 1
  dialogLeftButtonLabel: 닫기
  minDeclineOptionsPerDialog: 1
---

## summary

여러 CTA가 함께 있는 영역의 위계 / 아이콘 / 라벨 명료성 정책.

## rules

- Primary solid는 화면 또는 주요 섹션의 대표 액션 1개에만 사용.
- ArrowNext/ChevronRight 아이콘은 대표 전진 CTA 1개에만 사용하고, 반복 CTA에서는 제거.
- 동일 위계의 CTA가 여러 개면 아이콘 없이 텍스트와 버튼 variant로만 구분.
- 카드 리스트에서는 각 카드마다 버튼을 두기보다 Card.Root clickable 또는 텍스트 링크 패턴을 우선 검토.
- 버튼 라벨만 보고 다음 화면/행동을 예측할 수 있어야 한다. 라벨에 결과 동사(보기/신청/저장/삭제)를 포함하고, 막연한 '확인'/'시작'/'지금'을 단독으로 쓰지 않는다.
- 버튼 위 보조 설명(서브카피)이 버튼 라벨과 의미상 중복되지 않도록 한다. 둘 다 같은 가치 제안을 반복하면 버튼 역할이 흐려진다.
- 다이얼로그/모달의 왼쪽(보조) 버튼 라벨은 항상 **닫기**. '취소'는 사용자가 진행 중이던 작업이 취소된다고 오해할 수 있어 사용 금지. 자세한 라이팅 룰은 get_guide({ topic: 'ux-writing' }) 참고.
- 거절 가능한 비파괴 옵션이 항상 1개 이상 있어야 한다. CTA가 '확인' 하나뿐인 다이얼로그는 다크패턴 — get_guide({ topic: 'pattern:dark-patterns' }) 참고.
- 외부 링크는 화살표보다 Link/ExternalLink 성격의 아이콘을 검토.
- 모달/팝업 푸터의 액션 그룹은 별도 규칙 — 버튼 `shape="pill"` + 배치는 `actionsLayout`(react=actionsLayout / html=actions-layout 속성; 생략 시 프로젝트 기본 강제: 캐포비=end 우측 hug, 그 외=split 가로 분할). 일반 화면 cta-group 규칙을 모달 푸터에 그대로 적용(사각 shape·full-width)하지 말 것. 푸터 결정 트리는 get_guide({ topic: 'component:Modal' }) 참고.
- 모달/팝업 버튼 2개는 항상 **가로 정렬 유지** — 라벨이 길어 한 줄에 안 들어가도 세로로 스택하지 말고 **라벨을 축약**한다(예: '비즈니스 그룹 만들기'→'그룹 만들기'). 모달 버튼 라벨은 1~2 단어. `flex-direction:column`/`actions-layout="stack"` 금지(validator project-modal-footer-stacked).
- 캐포비 확인/팝업 모달의 주 action 버튼은 `color="neutral"`(검정 CTA)를 **명시** — color 를 생략하면 Button 기본값 primary(노랑)로 떨어진다(반복 회귀). 노랑 풀폭 '적용'은 선택/데이터 등 대형 모달에서만.

## avoid

- 모든 '자세히 보기' 버튼에 화살표 반복
- 보조/outlined CTA에 습관적으로 ArrowNext 부착
- '시작', '확인', '지금' 같은 결과 예측 불가능한 단독 라벨
- 버튼 위 카피와 버튼 라벨에 같은 문장을 반복 (예: '지금 시작해 보세요' → [지금 시작])
- 다이얼로그 보조 버튼에 '취소' 사용
- 거절·닫기 옵션 없이 '확인' 하나만 있는 다이얼로그
- 한 뷰포트에 primary solid CTA 2개 이상
- 모달/팝업 푸터 버튼에 default 사각 shape 또는 full-width 남용 (확인 팝업은 우측 hug pill — Modal 가이드 SSOT)
- 모달 2버튼을 세로로 스택 (라벨이 길면 세로로 쌓지 말고 라벨을 축약 — 항상 가로 유지)
- 캐포비 모달 버튼에 color 생략 (기본값 primary=노랑 → 검정 CTA 가 안 나옴. color="neutral" 명시)
