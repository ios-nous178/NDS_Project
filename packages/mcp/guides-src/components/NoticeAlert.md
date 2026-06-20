---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3902-1212
references:
  - label: Cashwalk for Business · NoticeAlertGuide
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3902-1212
    caption: 캐포비 라이브러리 인라인 알림 박스 가이드 — state(info/caution/error) 기준 anatomy·token mapping·Use Cases·Do/Don't SSOT. DS 에서는 notice 패턴 + 5 variant 로 흡수.
    project: cashwalk-biz
  - label: Trost · Alert 가이드
    url: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5283-206
    caption: 트로스트 Alert 가이드 — 5 variant(info/Notice/Caution/Success/Error)·2 size(52/72)·anatomy(container padding 16·gap 8·radius 8 · icon 20 · Body3 Medium). 트로스트는 Notice=중립 surface·본문 Text/Normal·radius 8 로 프로젝트 토큰 override(base 는 Notice=블루·본문 strong 유지).
    project: trost
---

## summary

폼·페이지 내부에 인라인으로 영구 노출되는 안내/주의/에러 박스 — DS notice 패턴의 구현체. 입력 컨텍스트 옆에 머무르며 명시적으로 닫기 전까지 유지됨. Toast(액션 결과·자동 사라짐) · Banner(페이지 상단 전역 띠) · Modal(즉각 판단 요구)과 분리 — 인라인 지속 메시지만 NoticeAlert. 5 variant — info(중립 회색) / notice(블루·차분한 공지) / caution(옐로우 배경·아이콘) / success(그린·완료) / error(레드 배경+레드 텍스트·조치 필요). 컨테이너 = padding 16 · gap 8 · radius 8(트로스트·지니어트)~12(base) · min-height 52(1줄)/72(2줄·자동) · 좌측 status 아이콘 20×20 + 본문 Body3 Medium (notice.md 패턴 SSOT 정합). 색은 임의 hex 금지, semantic status 토큰 binding. **프로젝트 override(슬롯)** — 트로스트는 Notice=중립 surface+neutral 아이콘, 본문 텍스트 전 variant Text/Normal, radius 8(`--nds-notice-alert-{notice-bg,notice-icon,text,radius}`). base/캐포비는 Notice=블루·본문 strong(error 만 레드) 유지. notice 패턴 규칙(강조 예산·화면당 색 박스 1개)을 그대로 따른다.

## pitfalls

- **특정 입력 필드의 검증 실패(비밀번호 불일치·이메일 형식·중복 등)는 NoticeAlert 가 아니다 → 그 필드의 인라인 에러로.** (★ 자주 하는 오용) Input/FormField 의 `error` + `error-message`(html) / `errorMessage`(React)로 필드 바로 아래 빨간 헬퍼(role=alert 자동). NoticeAlert 는 폼/페이지 단위의 **영구 안내·정책 메시지**용이지 필드 1개의 검증 피드백용이 아니다 — 멀리 떨어진 박스로 띄우면 어느 입력이 틀렸는지 끊긴다.
- error variant 를 단순 안내용으로 남발하지 말 것 — 의미가 흐려짐. 단순 정보는 info, 주의는 caution.
- 액션·확인 버튼이 필요한 메시지는 NoticeAlert 가 아님 → Modal/Dialog. 일시적 결과 알림 → Toast. 전역 공지 → Banner.
- 같은 화면에 색 배경 박스(notice/success/error) 를 여러 개 쌓지 말 것 — notice 패턴 강조 예산(화면당 색 박스 1개 권장). info/caution(회색)은 비교적 자유.
- 색을 임의 hex 로 박지 말 것 — variant 만 지정하면 semantic status 토큰(bg/text/icon)이 cascade 로 함께 적용됨.
- 안내가 필요한 입력 필드와 멀리 떨어진 위치에 배치하지 말 것 — 입력 컨텍스트 바로 옆.

## examplesHtml.do

```html
<nds-notice-alert variant="caution" message="목표 참여자 수는 1,000명 단위로 입력해 주세요."></nds-notice-alert>
<nds-notice-alert variant="error" message="필수 정보가 누락되어 저장할 수 없어요."></nds-notice-alert>
```

## examplesHtml.dont

```html
<!-- 단순 안내인데 error 남발 → 의미 흐려짐 (info/caution 이 맞음) -->
<nds-notice-alert variant="error" message="최대 30자 이내로 입력해 주세요."></nds-notice-alert>
<!-- 확인 버튼이 필요한 메시지를 NoticeAlert 로 — Modal 이 맞음 -->
<nds-notice-alert variant="notice" message="삭제하시겠어요? [확인]"></nds-notice-alert>
```
