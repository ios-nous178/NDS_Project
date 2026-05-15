# `.release-notes/`

릴리즈 알림 (Slack) 에 들어갈 **비개발자용 변경사항** 을 보관하는 폴더입니다.

## 흐름

1. `pnpm version-packages` 로 버전을 올린 직후, push 하기 전에:

   ```bash
   pnpm release-notes
   ```

   직전 release tag ~ HEAD 의 git 커밋을 Claude 가 비개발자 톤으로 재작성해서
   `.release-notes/pending.md` 에 저장합니다. (모델: `claude-haiku-4-5`)

2. **사람이 한 번 검토** — 어색하거나 잘못 의역된 부분이 있으면 직접 다듬습니다.

3. 다른 release 커밋들과 함께 commit / push:

   ```bash
   git add .release-notes/pending.md
   git commit -m "docs(release): 비개발자용 변경사항 추가"
   ```

4. GitHub Actions (`release-mcpb.yml`) 가 main push 를 받아 mcpb 를 빌드 / 릴리즈
   할 때, `.release-notes/pending.md` 가 있으면 **Slack 스레드의 "변경 사항"**
   섹션을 이 파일 내용으로 채웁니다. 없으면 기존 git log 로 fallback.

## 미리보기

파일을 만들지 않고 결과만 보고 싶을 때:

```bash
pnpm release-notes:dry
```

## 주의

- 이 폴더의 `pending.md` 는 release 시점에 **그대로** Slack 으로 나갑니다.
- GitHub Release body 는 손대지 않습니다 — 개발자는 거기서 raw 커밋 로그를 봅니다.
- API 호출에는 로컬 `ANTHROPIC_API_KEY` 환경 변수가 필요합니다.
