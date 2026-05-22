<!-- markdownlint-disable MD036 MD033 MD041 -->

# [옵션 B] 기존 가이드 상단 인트로만 친근한 톤으로 리라이트

> 본문(30초 체크 / 표 / 프롬프트 모음 / 트러블슈팅)은 기존 그대로 유지. **첫 화면에 보이는 도입부 한 단락만** 친근한 안내문 톤으로 교체한 안입니다.

---

## ✏️ 변경 범위

`docs/NUDGE_EAP_DS_MCP_USAGE.md` 의 **1~10 줄** (`# 사용법 (기획자용)` ~ 링크 모음) 만 아래로 교체.
그 아래(`<!-- BEGIN: version-table -->` 부터 끝까지) 는 손대지 않음.

## ✏️ Before (현재)

```markdown
# 사용법 (기획자용)

처음이신가요? → [설치 가이드 (Notion)](https://www.notion.so/cashwalkteam/NudgeEAP-Design-System-MCP-35ea054b7d82807bb097c6c9d6b3d272) 먼저. Claude Code Desktop + `.mcpb` 더블클릭 + 시안 폴더까지 한 페이지에 정리되어 있습니다.

링크 모음:

- GitHub: https://github.com/cashwalk/NudgeEAPDesignSystem
- 노션 백업: https://www.notion.so/cashwalkteam/NudgeEAP-Design-System-MCP-35ea054b7d82807bb097c6c9d6b3d272
- 개발자용 README: https://github.com/cashwalk/NudgeEAPDesignSystem/blob/main/packages/mcp/README.md
```

## ✏️ After (제안)

```markdown
# 사용법 (기획자용)

안녕하세요. NudgeEAP DS MCP 사용 가이드입니다. :blob\_빼꼼:

코드 없이 한국어 한 줄로 트로스트 / 지니어트 / NudgeEAP 시안을 만들고, HTML 한 파일로 공유하는 것까지 - 자주 쓰는 흐름과 부탁 예시를 한 페이지에 모았습니다.

> **처음이신가요?** → [설치 가이드 (Notion)](https://www.notion.so/cashwalkteam/NudgeEAP-Design-System-MCP-35ea054b7d82807bb097c6c9d6b3d272) 부터 먼저 봐주세요. Claude Code Desktop 설치 + `.mcpb` 더블클릭 + 시안 폴더 만드는 법까지 한 페이지에 정리되어 있습니다. 5분이면 끝납니다.

**이런 분께 도움이 됩니다**

- 시안을 빠르게 만들어 PRD 와 같이 공유하고 싶은 기획자 / PM
- 디자이너 손을 빌리기 전에 와이어프레임 수준이라도 화면을 잡아보고 싶은 분
- 디자인 시스템 룰을 매번 확인하지 않고도 일관된 시안을 만들고 싶은 분

**링크 모음**

- GitHub: https://github.com/cashwalk/NudgeEAPDesignSystem
- 노션 백업: https://www.notion.so/cashwalkteam/NudgeEAP-Design-System-MCP-35ea054b7d82807bb097c6c9d6b3d272
- 개발자용 README: https://github.com/cashwalk/NudgeEAPDesignSystem/blob/main/packages/mcp/README.md
```

---

## 적용 시 영향

- 추가 줄 수: **+8 줄** (현재 인트로 4줄 → 12줄)
- 본문 가독성 영향: 없음 (본문은 그대로)
- 톤 일관성: 인트로만 친근하고 본문은 터미널 톤이라 살짝 갭이 생김
  → 다만 **공지/홍보 → 레퍼런스** 라는 흐름은 자연스러움 (OpenMetadata 글의 도입~본론 갭과 비슷)
