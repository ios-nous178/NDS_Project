---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1337-8
sizeMatrix:
  xs: "24px · font 11 · rounded radius 4 — 인디케이터·메타정보"
  sm: "32px · font 14 · rounded radius 6 — 리스트 셀·작은 메뉴"
  md: "48px · font 20 · rounded radius 8 — 댓글·채팅·작은 카드 (기본)"
  lg: "64px · font 26 · rounded radius 10 — 카드 썸네일·상담사 리스트"
  xl: "96px · font 38 · rounded radius 12 — 프로필 헤더·상세 페이지"
---

## summary

사용자 / 상담사 / 앱을 시각적으로 표현하는 이미지 단위 + fallback(이니셜 1자 Bold / 기본 아이콘). **Shape 3종 × Size 5종 = 15 variants**(Figma 1337:8). Shape: `circle`(인물 프로필·댓글·채팅·헤더 식별, 기본) · `rounded`(앱 아이콘·상담사 카드 썸네일, 사이즈별 radius 4~12) · `square`(콘텐츠 카드·일러스트·제품 이미지, radius 0). Size 키 `xs/sm/md/lg/xl` = `24/32/48/64/96px`. 정사각 비율 이미지를 swap 하고 clipsContent 로 모서리 밖을 자른다. 색은 semantic 토큰(bg=surface.section, fallback=text subtle)으로 5 브랜드 cascade.

## pitfalls

- 같은 화면에서 같은 entity 에 다른 Shape 혼용 금지 — 사용자=circle, 앱=rounded 처럼 entity별 Shape 를 한 화면 내내 일관 유지.
- 직사각(가로>세로) 이미지를 그대로 넣으면 잘림 — 정사각 비율 이미지만 swap. 96+ 사이즈는 circle 권장(square/rounded 는 콘텐츠 카드와 혼동).
- src 만 있고 alt/name 둘 다 누락 — 로드 실패 시 빈 박스 + 스크린리더 무용. alt 또는 name(이니셜 1자 자동) 중 하나는 필수.
- size 를 px 인라인(`style="width:33px"`)으로 강제하지 말 것 — `xs/sm/md/lg/xl`(24/32/48/64/96)가 폰트/이니셜/radius 비율을 함께 보장. 임의 px 는 sizeMatrix 불일치.
- Avatar 위에 상태 점/badge 를 직접 absolute 로 얹지 말고 부모 컨테이너에서 layout 결정. AvatarGroup 은 size/shape 를 그룹 전체에 전파(개별 Avatar 에 다시 박지 말 것).

## examplesHtml.do

```html
<!-- 인물 프로필: circle (기본) -->
<nds-avatar src="/u.jpg" alt="홍길동" size="md"></nds-avatar>
<nds-avatar name="이정민" size="lg"></nds-avatar> <!-- src 실패 시 '이' 1자 Bold -->
<!-- 앱 아이콘/썸네일: rounded · 콘텐츠/제품: square -->
<nds-avatar src="/app.png" alt="앱" size="lg" shape="rounded"></nds-avatar>
<nds-avatar src="/product.png" alt="제품" size="lg" shape="square"></nds-avatar>
```

## examplesHtml.dont

```html
<!-- alt / name 둘 다 없음 — 로드 실패 시 ghost 박스 -->
<nds-avatar src="/u.jpg" size="md"></nds-avatar>
<!-- 인라인 px 로 강제 사이즈 — sizeMatrix 와 불일치 -->
<nds-avatar src="/u.jpg" alt="A" style="width:33px;height:33px"></nds-avatar>
<!-- 같은 사용자 프로필인데 화면마다 shape 다르게 -->
<nds-avatar name="홍" shape="square"></nds-avatar>
```
