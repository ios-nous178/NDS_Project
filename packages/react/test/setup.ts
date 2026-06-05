import * as matchers from "@testing-library/jest-dom/matchers";
import { afterAll, afterEach, beforeAll, expect } from "vitest";

import { server } from "./msw/server";

// jest-dom 매처(toBeInTheDocument 등)를 vitest expect 에 명시적으로 등록한다.
// `@testing-library/jest-dom/vitest` 사이드이펙트 엔트리는 이 환경(vitest 2 / node 25)에서
// 등록이 안 돼 "Invalid Chai property: toBeInTheDocument" 로 테스트가 전부 실패했었다.
// matchers 를 직접 extend 하면 확실하게 붙는다.
expect.extend(matchers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
