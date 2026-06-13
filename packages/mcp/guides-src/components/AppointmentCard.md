---
{}
---

## summary

**⚠ Deprecated — 앱 레이어로 이관 권장.** 날짜 파생(ISO→월/일/요일)과 status·mode 상태머신 같은 **앱 로직**을 컴포넌트가 소유해 DS 편입 기준에 어긋납니다. 예약 화면은 앱 컴포넌트로 두고(날짜/상태를 앱이 소유) 시각 표현은 `Card` 합성으로 구성하세요. 다음 major 에서 제거 예정. 잡힌 상담 예약 한 건 — 날짜 블록 + 제목/시간/방식/장소/상태 배지 + 액션 버튼들.

## pitfalls

- 상담사 선택 화면에 쓰지 말 것. 그건 CounselorCard 영역. AppointmentCard는 '잡힌 일정' 표시 전용.
- onClick(카드 전체)과 actions를 함께 사용 가능 — 내부에서 액션 클릭 시 stopPropagation됨.
- status에 따라 자동으로 배지 색이 바뀌므로 직접 색을 override하지 말 것 (시맨틱 의미 깨짐).
- in-person 모드일 때 location 필수. 그 외 모드는 location 생략.

## recommended

- 내 예약 리스트: <AppointmentCard ... actions=[{label:'상세'},{label:'참여',primary:true}] />
- 홈 다음 일정: onClick으로 디테일 화면, 액션 없이 카드 전체 클릭
- 방문 상담: mode='in-person', location='강남센터 3층 301호'

## examplesHtml.do

```html
<nds-appointment-card date="2026-06-01" start-time="14:00" end-time="14:50"
  title="첫 회기" mode="video" location="원격(Zoom)"></nds-appointment-card>
```

## examplesHtml.dont

```html
<!-- mode 만 있고 date/start-time 누락 — 핵심 정보가 빠짐 -->
<nds-appointment-card mode="video"></nds-appointment-card>
```
