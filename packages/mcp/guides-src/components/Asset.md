---
_htmlStatus: no-html-equivalent
---

## summary

Toss TDS 식 통합 미디어 컴포넌트. image / icon / initial / lottie / custom 을 동일한 Frame 위에 표현해 모양·크기·overlap·status accessory 의 일관성을 강제한다. Avatar 가 '사람 식별' 한정 컴포넌트라면 Asset 은 그보다 일반적인 박스 — 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등. react-only(웹컴포넌트 `nds-asset` 미러 없음).

## pitfalls

- content prop 은 discriminated union — `{ type: 'image', src }` / `{ type: 'icon', icon }` / `{ type: 'initial', name }` / `{ type: 'lottie', src }` / `{ type: 'custom', render }` 중 하나. 객체로 묶어서 넘기지 말고 type 키로 분기한 형태로 정확히 전달.
- size 는 xs/sm/md/lg/xl/2xl 프리셋 또는 임의 px 숫자. 프리셋 px 은 **Avatar 와 동일 스케일**(Figma 1337:8): xs 24 · sm 32 · md 48 · lg 64 · xl 96 + Asset 전용 2xl 120. shape='rounded' radius 도 Avatar 와 동일(사이즈별 4/6/8/10/12, 2xl 14). 임의 px 은 비표준 사이즈가 박힐 수 있으므로 가능하면 프리셋 사용.
- shape='circle' + content.type='image' 가 가장 흔한 사용 — 이 경우 Avatar 와 거의 같음. Avatar 는 그대로 둔다 (사람 한정 시멘틱). Asset 은 일반 미디어 박스.
- overlap prop 은 우측 음수 마진(저수준 primitive). 여러 아바타를 쌓는 그룹 UI 는 **AvatarGroup**(items/max/자동 +N) 을 쓰고, overlap 은 그 위에서 단일 Asset 의 겹침을 미세 제어할 때만 쓴다 — Asset 으로 그룹을 손수 조립하지 말 것. 단독 사용 시 0.
- acc(accessory) 는 우측 하단 status dot / count badge 슬롯. **presence 점은 `OnlineIndicator`, count/상태 뱃지는 `Badge`(color="error" 등)를 넣는다 — raw hex inline-style 로 점·뱃지를 손수 그리지 말 것.** 풀-사이즈 컴포넌트(긴 텍스트 라벨)는 넣지 말고 작은 시각 신호만.
- image type 에서 src 로드 실패 시 alt 의 이니셜로 자동 graceful degrade. alt 가 빈 문자열이면 빈 박스가 됨.
- scaleType 은 image/lottie 에만 의미 있음 — icon/initial 에는 영향 없음.
- multicolor 아이콘을 icon content 로 넣을 때 `color` prop 으로 base 색을 바꿀 수는 있지만 내부 accent 는 잠겨있음 (iconography 가이드 참고).

## examples.do

```tsx
// 일반 미디어 박스 (카드 썸네일)
<Asset shape="rounded" size="lg" content={{ type: "image", src: "/thumb.jpg", alt: "제품" }} scaleType="cover" />

// 카테고리 시그니처 (multicolor 아이콘)
<Asset shape="rounded" size="xl" content={{ type: "icon", icon: <TrostMentalDepressionIcon /> }} />

// 온라인 상태가 붙은 사람 — acc 에 DS 컴포넌트(OnlineIndicator)
<Asset
  shape="circle"
  size="md"
  content={{ type: "image", src: "/me.jpg", alt: "이정민" }}
  acc={<OnlineIndicator status="online" size={12} />}
/>

// 안 읽은 개수 — acc 에 Badge
<Asset
  shape="rounded"
  size="lg"
  content={{ type: "icon", icon: <CounselIcon /> }}
  acc={<Badge variant="fill" color="error" shape="pill" size="sm">3</Badge>}
/>
```

## examples.dont

```tsx
// 사람 식별인데 Avatar 대신 Asset — 시멘틱 약화 (Avatar 가 맞음)
<Asset shape="circle" size="md" content={{ type: "image", src: "/user.jpg", alt: "사용자" }} />

// acc 에 raw hex inline-style 로 점·뱃지를 손수 그림 — OnlineIndicator / Badge 를 쓸 것
<Asset content={{ type: "image", src: "/x.jpg" }} acc={<span style={{ width: 12, height: 12, background: "#22c55e" }} />} />

// 여러 명 쌓기를 Asset+overlap 으로 손수 조립 — AvatarGroup 을 쓸 것
<div style={{ display: "flex" }}>
  <Asset overlap={12} content={{ type: "image", src: "/a.jpg" }} />
  <Asset overlap={12} content={{ type: "image", src: "/b.jpg" }} />
</div>

// acc 에 풀-사이즈 텍스트 라벨
<Asset content={{ type: "image", src: "/x.jpg" }} acc={<span>신규 상품 입고 안내</span>} />
```
