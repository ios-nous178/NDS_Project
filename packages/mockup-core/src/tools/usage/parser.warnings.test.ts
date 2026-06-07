import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMockupSource, configureUsageCatalog } from "./parser.js";

/**
 * Fix #1: DS 카탈로그(configureUsageCatalog) 미주입 시 avoidable/forced 분류가 native 4종
 * fallback 으로만 이뤄져 채택률(adoptionRatio)이 부풀려진다. 이 silent degradation 을
 * parserWarnings 로 자가 보고하는지 검증.
 *
 * 주의: configureUsageCatalog 는 모듈 전역 상태라 주입은 되돌릴 수 없다 → 미주입 케이스를 먼저 단언한다.
 * (node --test 는 파일마다 별도 프로세스라 다른 테스트 파일과 상태가 섞이지 않는다.)
 */

const SRC = `import { Button } from "@nudge-design/react"; import { Table } from "antd";
export default () => (<div><Button/><Table/><button/></div>);`;

test("미주입 + non-DS 요소 → parserWarnings 에 카탈로그 경고", () => {
  const u = parseMockupSource(SRC, "/tmp/Foo.tsx");
  assert.ok(
    u.meta.parserWarnings.some((w) => w.includes("DS 카탈로그 미주입")),
    "카탈로그 미주입 경고가 있어야 함",
  );
  // antd Table 이 fallback(DEFAULT_DS_NAMES)엔 없어 forced 로 오분류 → 채택률이 높게 잡힘
  assert.equal(u.meta.forcedCustom, 1, "미주입 시 Table 은 forced 로 오분류");
});

test("non-DS 요소가 전혀 없으면 미주입이어도 경고 없음", () => {
  const dsOnly = `import { Button } from "@nudge-design/react";
export default () => (<Button/>);`;
  const u = parseMockupSource(dsOnly, "/tmp/Pure.tsx");
  assert.equal(
    u.meta.parserWarnings.some((w) => w.includes("DS 카탈로그 미주입")),
    false,
    "분류할 non-DS 요소가 없으면 경고 불필요",
  );
});

test("카탈로그 주입 후 → 경고 사라지고 분류가 정밀해진다", () => {
  configureUsageCatalog(new Set(["Button", "Input", "Select", "Textarea", "Table"]));
  const u = parseMockupSource(SRC, "/tmp/Foo.tsx");
  assert.equal(
    u.meta.parserWarnings.some((w) => w.includes("DS 카탈로그 미주입")),
    false,
    "주입 후엔 경고 없음",
  );
  // Table 이 카탈로그에 있으니 avoidable 로 정분류 → forced 0, 채택률은 정직하게 하락
  assert.equal(u.meta.forcedCustom, 0, "주입 후 Table 은 avoidable 로 정분류");
});
