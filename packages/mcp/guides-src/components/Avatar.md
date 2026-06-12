---
{}
---

## summary

사용자 / 상담사 / 브랜드 식별을 위한 원형 이미지 + fallback. 이름 이니셜 / 기본 아이콘으로 graceful degrade.

## pitfalls

- src 만 있고 alt 누락 — 이미지 로드 실패 시 비어 보임 + 스크린리더 무용지물. alt 또는 name (fallback initials 자동 생성) 둘 중 하나는 필수.
- size 를 px 인라인으로 강제하지 말 것. xs/sm/md/lg/xl 매트릭스가 toked 사이즈/폰트 비율 보장.
- Avatar 위에 OnlineIndicator 를 직접 absolute 로 얹지 말고, AvatarGroup / 부모 컨테이너에서 layout 결정.

## examplesHtml.do

```html
<nds-avatar src="/u.jpg" alt="홍길동" size="md"></nds-avatar>
<nds-avatar name="이정민" size="lg"></nds-avatar> <!-- src 실패 시 '이' 이니셜 표시 -->
```

## examplesHtml.dont

```html
<!-- alt / name 둘 다 없음 — 로드 실패 시 ghost 박스 -->
<nds-avatar src="/u.jpg" size="md"></nds-avatar>
<!-- 인라인 px 로 강제 사이즈 — sizeMatrix 와 불일치 -->
<nds-avatar src="/u.jpg" alt="A" style="width:33px;height:33px"></nds-avatar>
```
