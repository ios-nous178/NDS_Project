---
{}
---

## summary

이미지 위 / 콘텐츠 아래 세로형 카드. 슬롯 기반 (image · imageOverlay · eyebrow · title · body · footer) + 별점 헬퍼. 콘텐츠/리뷰/강의/상담사 카드처럼 '미디어 + 메타' 패턴 전반에 사용. 가로 스크롤(모바일) · 그리드(데스크탑) 모두 같은 컴포넌트.

## pitfalls

- 이미지 비율은 imageAspectRatio 로만 조절 — 기본 '4 / 3'. 영상 썸네일은 '16 / 9', 정사각 그리드는 '1 / 1'.
- title 은 자동 2줄 클램프, body 도 자동 2줄 클램프 — 외부에서 슬라이스 가공 불필요.
- imageOverlay 는 우하단 단일 라벨용 (예: '999+', '02:13'). 좌상단 배지/랭킹은 ProductCard 의 rankingNumber 를 쓰거나 image 슬롯에서 직접 그릴 것.
- rating 은 0-5 number — footer 영역에 별 5개 자동 렌더. 0.25 단위 반올림이라 정밀한 0.5 표현은 ReviewCard 사용.
- footer 와 rating 은 동시 사용 가능 — footer 가 위, rating 이 아래 row 로 stack. 작성자/메타는 footer 안에 자유 조립.
- onCardClick 지정 시 role='button' + Enter/Space 핸들링 자동. CTA 버튼을 footer 에 넣을 때는 e.stopPropagation() 필요.
- 장문 설명/리치 본문은 Card 사용. MediaCard 는 미디어가 시각 hero 인 진열용.
- 상품 진열(할인율/가격/적립)은 ProductCard — MediaCard 로 가격 패턴을 흉내내지 말 것.

## recommended

- 기본: <MediaCard image={<img src="…" />} eyebrow="아임닭" title="닭 무침" body="…" rating={4.5} footer={authorRow} onCardClick={…} />
- 오버레이: <MediaCard image={…} imageOverlay="999+" title="…" />  // 우하단 라벨
- 영상 썸네일: <MediaCard imageAspectRatio="16 / 9" imageOverlay="02:13" image={…} title="…" />
- 그리드: grid-template-columns: repeat(4, 1fr) + gap 16 (데스크탑 4-up).
- 가로 스크롤: flex + overflow-x:auto + 각 카드 flex:0 0 160px (모바일).
- 푸터 조립: avatar+name row + meta row 를 footer 슬롯에 직접 — DS가 author/meta props 를 박지 않은 이유.

## examplesHtml.do

```html
<nds-media-card image-src="/cover.jpg" eyebrow="추천"
  card-title="명상 시작하기" body="3분짜리 호흡 명상" rating="4.6" clickable></nds-media-card>
<script>el.addEventListener("nds-media-card-click", () => navigate("/media/1"));</script>
```

## examplesHtml.dont

```html
<!-- body 를 slot 으로 — attribute 사용 -->
<nds-media-card image-src="/c.jpg" card-title="A"><p slot="body">…</p></nds-media-card>
```
