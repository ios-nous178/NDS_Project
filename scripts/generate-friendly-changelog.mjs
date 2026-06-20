#!/usr/bin/env node
/**
 * generate-friendly-changelog.mjs — 커밋 로그 → 비개발자용 변경사항 재작성
 *
 * `pnpm version-packages` 직후 (push 전) 한 번 실행해서, 직전 release tag 이후의
 * 커밋들을 Slack 알림용 비개발자 톤으로 다시 쓴 결과를 `.release-notes/pending.md`
 * 에 박는다. CI (release-mcpb.yml) 가 이 파일을 발견하면 Slack 변경사항으로 그대로
 * 사용하고, 없으면 기존 git log fallback 으로 돌아간다.
 *
 * 모델: claude-haiku-4-5-20251001 (짧은 재작성에 충분, 빠르고 저렴).
 * GitHub Release body 는 손대지 않는다 — 개발자용 raw 커밋 로그는 그대로.
 *
 * Usage:
 *   pnpm release-notes              # 자동 실행 (직전 tag~HEAD 사용)
 *   pnpm release-notes --dry-run    # 결과만 stdout, 파일 안 씀
 *   pnpm release-notes --range v0.1.5..HEAD   # 직접 범위 지정
 *
 * 요구사항:
 *   - ANTHROPIC_API_KEY 환경 변수
 *   - Node 18+ (전역 fetch)
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, ".release-notes");
const OUT_FILE = path.join(OUT_DIR, "pending.md");

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const rangeFlagIdx = args.indexOf("--range");
const explicitRange = rangeFlagIdx >= 0 ? args[rangeFlagIdx + 1] : null;

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf-8" }).trim();
}

function resolveRange() {
  if (explicitRange) return explicitRange;
  let prevTag = "";
  try {
    prevTag = sh("git tag --sort=-v:refname | head -n 1");
  } catch {
    prevTag = "";
  }
  return prevTag ? `${prevTag}..HEAD` : "HEAD";
}

function collectCommits(range) {
  const raw = sh(`git log --no-merges --pretty=format:%s ${range}`);
  if (!raw) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/^chore: rebuild local-packages/.test(s))
    .filter((s) => !/^Merge branch /.test(s))
    .filter((s) => !/^[a-z]+(\([^)]*\))?!?:\s*bump\s+mcpb/.test(s))
    .filter((s) => !/^[a-z]+\(release-mcpb\)/.test(s))
    .filter((s) => !/^[a-z]+\(docs-page\)/.test(s));
}

const SYSTEM_PROMPT = `당신은 디자인 시스템의 릴리즈 변경사항을 디자이너 / PM / QA 같은 비개발자에게 안내하는 Slack 노트 작성자입니다.

입력으로 한 줄에 하나씩 "type(scope): 본문" 형태의 git 커밋 메시지 목록을 받습니다.
이 커밋들을 비개발자도 읽고 자기 일에 어떻게 영향이 가는지 파악할 수 있는 한국어 변경사항으로 다시 써주세요.

규칙:
- "- " 로 시작하는 markdown bullet 목록만 출력. 인사말 / 헤더 / 코드블럭 / 안내 문구 없이 bullet 만.
- 가능하면 한 커밋당 한 bullet. 너무 짧거나 비슷한 커밋은 묶어도 되지만 한 줄로 무리하게 합치지 말 것.
- 비개발자에게 영향 있는 항목 우선:
  - 새 컴포넌트 / 패턴 / 가이드 추가
  - 토큰 / 컬러 / 타이포 변경
  - 새 아이콘
  - 사용자 영향 있는 버그 수정
  - DS 사용 규칙 변경
- 내부 리팩토링 / 빌드 / CI / 의존성 / 테스트 / lint 관련 커밋은 마지막에 "내부 안정성 개선" 한 줄로만 묶기. 항목이 하나도 없으면 이 줄도 생략.
- 약어 / 영어 기술 용어 (refactor, props, scope, lint, smoke 등) 는 풀어 쓰기.
- 컴포넌트 이름 / 토큰 이름 / 프로젝트 이름 (Chip, Card, BottomSheet, Trost 등) 은 그대로 유지.
- 커밋에 없는 내용을 추측해서 만들지 말 것. 모르겠으면 커밋 원문에 가깝게 다듬기만.
- 톤: 차분하고 명확하게. "~했어요" "~됐어요" "~할 수 있어요" 정도의 친근한 존댓말.
- "Conventional Commits prefix" (feat, fix, docs ...) 와 scope 표기는 제거.
`;

async function callClaude(commits) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[generate-friendly-changelog] ANTHROPIC_API_KEY 환경 변수가 없습니다.");
    console.error(
      "  로컬에 키를 설정한 뒤 다시 실행해주세요. (예: export ANTHROPIC_API_KEY=sk-...)",
    );
    process.exit(1);
  }

  const userMessage = `아래 git 커밋 목록을 비개발자용 변경사항으로 다시 써주세요.\n\n${commits
    .map((c) => `- ${c}`)
    .join("\n")}`;

  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  };

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Anthropic API ${resp.status}: ${text}`);
  }

  const json = await resp.json();
  const text = json?.content?.[0]?.text;
  if (!text) throw new Error(`Empty response from API: ${JSON.stringify(json)}`);
  return text.trim();
}

async function main() {
  const range = resolveRange();
  const commits = collectCommits(range);

  console.log(`[generate-friendly-changelog] range = ${range}`);
  console.log(`[generate-friendly-changelog] commits = ${commits.length}`);

  if (commits.length === 0) {
    const fallback = "_사용자에게 영향있는 변경 사항 없음 (내부 작업만 있음)_";
    if (dryRun) {
      console.log("\n--- dry run output ---\n");
      console.log(fallback);
      return;
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, fallback + "\n", "utf-8");
    console.log(`[generate-friendly-changelog] wrote ${OUT_FILE} (fallback)`);
    return;
  }

  const friendly = await callClaude(commits);

  if (dryRun) {
    console.log("\n--- dry run output ---\n");
    console.log(friendly);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, friendly + "\n", "utf-8");
  console.log(`[generate-friendly-changelog] wrote ${OUT_FILE}`);
  console.log(
    '\n다음 단계: 파일 내용을 검토 / 수정 후 commit 하고 main 에 push 하세요.\n  $ git add .release-notes/pending.md\n  $ git commit -m "docs(release): 비개발자용 변경사항 추가"',
  );
}

main().catch((err) => {
  console.error("[generate-friendly-changelog] failed:", err.message);
  process.exit(1);
});
