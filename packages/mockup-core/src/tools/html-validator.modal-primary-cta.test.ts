import { test } from "node:test";
import assert from "node:assert/strict";
import { validateHtmlSource } from "./html-validator.js";

/**
 * 캐포비 모달 회귀 (사용자 피드백 5회+: "모달/팝업이 계속 primary(노랑) 버튼 쓴다 원인 찾아"):
 *  - cashwalk-biz-modal-primary-cta    : 확인/팝업 모달 footer 주 action 이 primary(노랑)/색생략(=기본 primary)
 *  - cashwalk-biz-modal-footer-stacked : footer 두 버튼 세로 스택 (가로 유지 + 라벨 축약이 원칙)
 * 근본 원인: Button 기본 color = primary 라 color 를 생략하면 자동으로 노랑. 검정 CTA = color="neutral".
 */
const OPTS = { surface: "admin" as const, brand: "cashwalk-biz" };

const doc = (body: string) =>
  `<html data-brand="cashwalk-biz"><head></head><body>${body}</body></html>`;

const has = (v: ReturnType<typeof validateHtmlSource>, rule: string) =>
  v.find((x) => x.rule === rule);

// ─── primary CTA ─────────────────────────────────────────────────────────────
test("스크린샷 재현: 확인 모달 단일 버튼 color 생략 → cashwalk-biz-modal-primary-cta error (기본값 primary)", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open title="계정 생성이 완료되었습니다" max-width="480">` +
        `<p>이제 광고를 운영할 비즈니스 그룹을 만들어 주세요.</p>` +
        `<div slot="footer"><nds-button>비즈니스 그룹 만들기</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  const hit = has(v, "cashwalk-biz-modal-primary-cta");
  assert.ok(hit, "color 생략 = 기본 primary 라 위반이어야 함");
  assert.equal(hit?.severity, "error");
});

test("확인 모달 명시적 color=\"primary\" 도 잡는다", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>x</p>` +
        `<div slot="footer"><nds-button color="primary" variant="solid">승인</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  assert.ok(has(v, "cashwalk-biz-modal-primary-cta"));
});

test("검정 CTA(color=\"neutral\") 는 위반 아님", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>x</p>` +
        `<div slot="footer"><nds-button color="neutral" variant="solid" shape="pill">비즈니스 그룹 만들기</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "cashwalk-biz-modal-primary-cta"), undefined);
});

test("취소(neutral outlined) + 확정(neutral solid) 2버튼은 위반 아님", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>x</p><div slot="footer">` +
        `<nds-button color="neutral" variant="outlined">취소</nds-button>` +
        `<nds-button color="neutral" variant="solid">확정</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "cashwalk-biz-modal-primary-cta"), undefined);
});

test("대형 선택/데이터 모달(max-width 720+ 또는 data-table)의 풀폭 옐로우 '적용'은 면제", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open title="지역 선택" max-width="960"><nds-selected-items-panel></nds-selected-items-panel>` +
        `<div slot="footer"><nds-button color="primary" variant="solid" full-width>적용</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "cashwalk-biz-modal-primary-cta"), undefined);
});

test("캐포비 아닌 브랜드 모달은 primary 가 정상 — 미발화", () => {
  const v = validateHtmlSource(
    `<html data-brand="trost"><body><nds-modal open><p>x</p>` +
      `<div slot="footer"><nds-button>확인</nds-button></div></nds-modal></body></html>`,
    { surface: "service", brand: "trost" },
  );
  assert.equal(has(v, "cashwalk-biz-modal-primary-cta"), undefined);
});

// ─── footer 세로 스택 ────────────────────────────────────────────────────────
test("footer 2버튼 flex-direction:column → cashwalk-biz-modal-footer-stacked warn", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>x</p>` +
        `<div slot="footer" style="display:flex;flex-direction:column">` +
        `<nds-button color="neutral" variant="solid">나중에 다시 하기</nds-button>` +
        `<nds-button color="neutral" variant="outlined">닫기</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  const hit = has(v, "cashwalk-biz-modal-footer-stacked");
  assert.ok(hit, "세로 스택 위반이어야 함");
  assert.equal(hit?.severity, "warn");
});

test("가로(기본) footer 2버튼은 stacked 미발화", () => {
  const v = validateHtmlSource(
    doc(
      `<nds-modal open max-width="480"><p>x</p><div slot="footer">` +
        `<nds-button color="neutral" variant="outlined">취소</nds-button>` +
        `<nds-button color="neutral" variant="solid">확정</nds-button></div></nds-modal>`,
    ),
    OPTS,
  );
  assert.equal(has(v, "cashwalk-biz-modal-footer-stacked"), undefined);
});
