// /storybook/ 라우트 stub.
// 실제 Storybook 정적 빌드(apps/storybook/storybook-static) 가 같은 경로에 배포되어 있으면
// 정적 index.html 이 우선 서빙되므로 이 컴포넌트는 렌더되지 않는다. 정적 파일이 없을 때만
// 안내 메시지를 노출한다. 라우트 등록 자체가 Docusaurus broken-link checker 통과 목적.
import React from "react";

export default function StorybookStub() {
  return (
    <main style={{ padding: "48px 24px", maxWidth: 640, margin: "0 auto" }}>
      <h1>Storybook</h1>
      <p>
        Storybook 정적 빌드가 같은 경로(<code>/storybook/</code>)에 배포되어 있습니다. 이 페이지가
        보인다면 빌드가 아직 같이 묶이지 않은 상태입니다.
      </p>
    </main>
  );
}
