<!--
슬랙 mrkdwn 호환 본문. 워크플로우(release-mcpb.yml) 가 "*이번 업데이트에서 달라진 점*"
헤더를 자동으로 앞에 붙여 슬랙 스레드에 그대로 게시한다.
- `#`, `##`, `###` 헤딩 안 됨 → `*bold*` 로 강조
- `**bold**` (asterisk 두 개) 안 됨 → `*bold*` (asterisk 하나) 로
- `---` 가로줄 안 보임 → 빈 줄로 단락 구분
- prettier 가 `*bold*` 를 `_italic_` 으로 normalize 하지 않도록
  이 파일은 `.prettierignore` 에 등록되어 있다.
-->
<!-- markdownlint-disable MD036 -->

🚨 *업데이트 이후 Claude Desktop 꼭 종료 후 다시 실행!!!* 🚨
새 MCP 가이드/카탈로그가 적용되려면 Claude Desktop 을 완전히 종료(⌘Q)했다가 다시 켜 주세요. 그냥 창만 닫으면 옛 버전이 그대로 떠 있어요.

*미디어 박스 표준 — Asset 컴포넌트*

이미지·아이콘·이니셜·Lottie·커스텀을 *한 컴포넌트로 통합* 한 `<Asset>` 이 들어왔어요. 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등 *사람이 아닌 일반 미디어 박스* 에 사용. 모양(`square` / `rounded` / `circle`) · 크기(`xs` ~ `2xl` 또는 px) · 우측 하단 상태 점(`acc`) · 옆 Asset 과 겹치기(`overlap`) 까지 한 props 묶음으로 일관.

*Avatar 는 사람 식별 전용으로 그대로 유지* — Asset 은 그보다 *일반적인 미디어 박스* 입니다. 사람 프로필은 계속 Avatar, 상품/카테고리/첨부 같은 일반 미디어는 Asset.

```tsx
<Asset shape="rounded" size="lg" content={{ type: "image", src: thumbnailUrl, alt: "상품" }} />
<Asset shape="rounded" size="xl" content={{ type: "icon", icon: <TrostMentalDepressionIcon /> }} />
<Asset shape="circle" size="md" content={{ type: "image", src: meUrl, alt: "이정민" }}
  acc={<OnlineDot />} />
```
