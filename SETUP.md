# 목업 작업 환경 세팅 가이드

> 개발자가 아니어도 됩니다. 아래 순서대로 따라하면 끝!
> 완료되면 Claude에게 "목업 만들어줘"라고 말하면 됩니다.

---

## 빠른 시작 (Node.js가 이미 있다면)

Node.js 20 이상이 설치되어 있으면, 프로젝트 폴더에서 한 줄만 실행하면 됩니다:

**Mac / Linux:**

```bash
./setup.sh
```

**Windows (PowerShell):**

```powershell
.\setup.ps1
```

> 실행 정책 에러가 나면 먼저: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

pnpm 설치, 의존성 설치, 빌드, 스토리북 실행까지 자동으로 됩니다.
이미 설치된 것은 건너뛰고, 버전이 안 맞으면 nvm/volta/fnm이 있을 경우 자동 전환합니다.

---

## 처음부터 세팅 (Node.js가 없다면)

### 1단계: Node.js 설치

프로그램을 실행하는 데 필요한 도구입니다. (1회만 설치)

### Windows

1. https://nodejs.org 접속
2. **"20.x LTS"** 버튼 클릭 → 다운로드된 `.msi` 파일 실행
3. 설치 마법사에서 **모두 Next** → Finish
4. 확인: 시작 메뉴에서 **"PowerShell"** 또는 **"명령 프롬프트"** 열고:

   ```
   node -v
   ```

   `v20.x.x` 가 나오면 성공!

### Mac

1. https://nodejs.org 접속
2. **"20.x LTS"** 버튼 클릭 → 다운로드된 `.pkg` 파일 실행
3. 설치 마법사에서 **모두 계속** → 완료
4. 확인: **터미널** 앱 열고:

   ```
   node -v
   ```

   `v20.x.x` 가 나오면 성공!

---

## 2단계: Claude Code 설치

AI 어시스턴트입니다. 코드를 대신 작성하고 실행해줍니다. (1회만 설치)

### 방법 A: 데스크탑 앱 (추천, 가장 쉬움)

1. https://claude.ai/download 접속
2. 본인 OS에 맞는 앱 다운로드 → 설치
3. Anthropic 계정으로 로그인

### 방법 B: VS Code 확장

1. VS Code 설치 (https://code.visualstudio.com)
2. 확장 탭에서 **"Claude Code"** 검색 → 설치
3. Anthropic 계정으로 로그인

### 방법 C: CLI (터미널에 익숙하다면)

```
npm install -g @anthropic-ai/claude-code
```

---

## 3단계: 프로젝트 다운로드

### Git이 있다면

```
git clone https://github.com/{org}/NudgeEAPDesignSystem.git
```

### Git이 없다면

1. GitHub에서 **Code → Download ZIP** 클릭
2. 압축 풀기

---

## 4단계: Claude Code 열기

1. Claude Code 앱(또는 VS Code)에서 이 프로젝트 폴더를 열기
2. 채팅창에 이렇게 입력:

```
환경 세팅하고 스토리북 실행해줘
```

1. Claude가 알아서 pnpm 설치, 의존성 설치, 빌드, 스토리북 실행까지 해줍니다
2. **브라우저에서 http://localhost:6006** 열면 끝!

---

## 5단계: 목업 만들기

Claude에게 이렇게 말하면 됩니다:

```
트로스트 브랜드로 OO 페이지 목업 만들어줘
```

예시:

- "트로스트 복용약 찾기 페이지 목업 만들어줘. SEO랑 상담전환 중요해"
- "지니어트 건강검진 결과 페이지 만들어줘"
- "기존 복용약 상세 페이지에서 리뷰 영역 수정해줘"

수정이 필요하면:

- "카드에 이미지 넣어줘"
- "모바일에서 버튼이 너무 작아"
- "FAQ 3개 더 추가해줘"

브라우저를 **새로고침**하면 수정사항이 바로 반영됩니다.

---

## 문제가 생기면

Claude에게 에러 메시지를 그대로 보여주세요. 대부분 알아서 해결해줍니다.

```
이런 에러가 떴어: {에러 메시지 붙여넣기}
```
