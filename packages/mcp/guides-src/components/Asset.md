---
{}
---

## summary

Toss TDS 식 통합 미디어 컴포넌트. image / icon / initial / lottie / custom 을 동일한 Frame 위에 표현해 모양·크기·overlap·status accessory 의 일관성을 강제한다. Avatar 가 '사람 식별' 한정 컴포넌트라면 Asset 은 그보다 일반적인 박스 — 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등.

## pitfalls

- content prop 은 discriminated union — `{ type: 'image', src }` / `{ type: 'icon', icon }` / `{ type: 'initial', name }` / `{ type: 'lottie', src }` / `{ type: 'custom', render }` 중 하나. 객체로 묶어서 넘기지 말고 type 키로 분기한 형태로 정확히 전달.
- size 는 xs/sm/md/lg/xl/2xl 프리셋 또는 임의 px 숫자. 프리셋 px 은 **Avatar 와 동일 스케일**(Figma 1337:8): xs 24 · sm 32 · md 48 · lg 64 · xl 96 + Asset 전용 2xl 120. shape='rounded' radius 도 Avatar 와 동일(사이즈별 4/6/8/10/12, 2xl 14). 임의 px 은 비표준 사이즈가 박힐 수 있으므로 가능하면 프리셋 사용.
- shape='circle' + content.type='image' 가 가장 흔한 사용 — 이 경우 Avatar 와 거의 같음. Avatar 는 그대로 둔다 (사람 한정 시멘틱). Asset 은 일반 미디어 박스.
- overlap prop 은 우측 음수 마진. AvatarGroup 처럼 옆 Asset 위로 겹쳐 놓을 때만 사용. 단독 사용 시 0.
- acc(accessory) 는 우측 하단 status dot / count badge / online indicator 슬롯. 풀-사이즈 컴포넌트(긴 텍스트 라벨 등) 를 넣지 말 것 — 작은 시각 신호만.
- image type 에서 src 로드 실패 시 alt 의 이니셜로 자동 graceful degrade. alt 가 빈 문자열이면 빈 박스가 됨.
- scaleType 은 image/lottie 에만 의미 있음 — icon/initial 에는 영향 없음.
- multicolor 아이콘을 icon content 로 넣을 때 `color` prop 으로 base 색을 바꿀 수는 있지만 내부 accent 는 잠겨있음 (iconography 가이드 참고).

## examplesHtml.do

```html
<!-- 일반 미디어 박스 (카드 썸네일) -->
<nds-asset shape="rounded" size="lg" content='{"type":"image","src":"/thumb.jpg","alt":"제품"}' scale-type="cover"></nds-asset>

<!-- 카테고리 시그니처 (multicolor 아이콘) -->
<nds-asset shape="rounded" size="xl" content='{"type":"icon","icon":"TrostMentalDepressionIcon"}'></nds-asset>

<!-- 온라인 상태가 붙은 사람 -->
<nds-asset shape="circle" size="md" content='{"type":"image","src":"/me.jpg","alt":"이정민"}' acc-status="online"></nds-asset>
```

## examplesHtml.dont

```html
<!-- content 를 객체로 안 묶고 src 만 던지기 -->
<nds-asset src="/x.jpg" size="md"></nds-asset>

<!-- 사람 식별인데 Avatar 대신 Asset 사용 — 시멘틱 약화 -->
<nds-asset shape="circle" size="md" content='{"type":"image","src":"/user.jpg","alt":"사용자"}'></nds-asset> <!-- Avatar 가 맞음 -->

<!-- acc 에 풀-사이즈 텍스트 라벨 -->
<nds-asset content='{"type":"image","src":"/x.jpg"}' acc="신규 상품 입고 안내"></nds-asset>
```
