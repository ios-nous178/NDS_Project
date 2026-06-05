import type { Meta, StoryObj } from "@storybook/react";
import { Modal, StatsTable, Button } from "@nudge-design/react";
import React, { useState } from "react";

/**
 * 캐포비 어드민 "Data Modal" — 대형 조회 전용 모달(Modal) + 리포트 표(StatsTable) 조합.
 * 확인 팝업(①~④)과 구분되는 ⑤ Data Modal 패턴: 헤더(제목 + 부제 + 다운로드 CTA + Close X),
 * 본문은 스크롤되는 StatsTable(헤더행 + 노란 요약행 + 시간별 데이터). 푸터 CTA 없음.
 *
 * 색/치수는 data-brand="cashwalk-biz" cascade. 예시는 Figma 시간별 리포트(3001:25777).
 * get_guide({ topic:'component:Modal', brand:'cashwalk-biz' }).dimensions.dataModal 참조.
 */

/** 스토리 동안 documentElement 의 data-brand 를 cashwalk-biz 로 고정(캐포비 cascade). */
function CashbizBrand({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-brand");
    root.setAttribute("data-brand", "cashwalk-biz");
    return () => {
      if (prev === null) root.removeAttribute("data-brand");
      else root.setAttribute("data-brand", prev);
    };
  }, []);
  return <>{children}</>;
}

const meta: Meta = {
  title: "Brands/CashwalkBiz/Data Modal",
  decorators: [
    (Story) => (
      <CashbizBrand>
        <Story />
      </CashbizBrand>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "캐포비 어드민 Data Modal — Modal + StatsTable 조합. 대형 조회 모달(제목 + 부제 + 다운로드 + Close X) " +
          "본문에 스크롤 리포트 표(헤더행 + 노란 요약행 + 시간별 데이터). 새 컴포넌트가 아니라 기존 Modal/StatsTable 조립.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

/* 시간별 리포트 더미 데이터 — [시각, 소진액, 노출, 클릭, CTR, CPC, CPM] */
type Row = [string, string, string, string, string, string, string];
const HOURLY: Row[] = [
  ["00시", "₩0", "0", "0", "0%", "₩0", "₩0"],
  ["01시", "₩327.48", "1,571", "67", "2.49%", "₩7.22", "₩280"],
  ["02시", "₩664.16", "1,571", "67", "2.49%", "₩7.22", "₩280"],
  ["03시", "₩1,234.80", "1,571", "67", "2.49%", "₩7.22", "₩280"],
  ["04시", "₩2,155.72", "1,571", "67", "2.49%", "₩7.22", "₩280"],
  ["05시", "₩3,046.68", "1,571", "67", "2.49%", "₩7.22", "₩280"],
  ["06시", "₩4,029.20", "1,571", "674", "2.49%", "₩7.22", "₩280"],
  ["07시", "₩4,261.32", "1,571", "674", "2.49%", "₩7.22", "₩280"],
  ["08시", "-", "-", "-", "-", "-", "-"],
  ["09시", "-", "-", "-", "-", "-", "-"],
  ["10시", "-", "-", "-", "-", "-", "-"],
  ["11시", "-", "-", "-", "-", "-", "-"],
];

const COLS = ["날짜", "소진액(₩)", "노출(수)", "클릭(수)", "CTR(%)", "CPC(₩)", "CPM(₩)"];

function HourlyReportTable() {
  return (
    <div style={{ maxHeight: 440, overflowY: "auto" }}>
      <StatsTable>
        <thead>
          <tr>
            {COLS.map((c, i) => (
              <th key={c} data-align={i === 0 ? "center" : "right"}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 요약행 — 노란 하이라이트(캐포비 리포트 합계행) */}
          <tr className="is-summary" style={{ background: "#FFFAE5" }}>
            <td data-align="center">2025.08.07</td>
            <td data-align="right">₩31,753.20</td>
            <td data-align="right">61,744</td>
            <td data-align="right">1,389</td>
            <td data-align="right">2.25%</td>
            <td data-align="right">₩12.45</td>
            <td data-align="right">₩280</td>
          </tr>
          {HOURLY.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i} data-align={i === 0 ? "center" : "right"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StatsTable>
    </div>
  );
}

function DataModalExample() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ minHeight: 600, padding: 24, background: "#FAFAFA" }}>
      <Button color="primary" variant="solid" onClick={() => setOpen(true)}>
        시간별 리포트 열기
      </Button>
      <Modal.Root open={open} onClose={() => setOpen(false)}>
        <Modal.Overlay />
        <Modal.Content maxWidth={900} aria-label="시간별 리포트">
          <Modal.Header closable>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                flex: "1 1 auto",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111" }}>
                  시간별 리포트
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "#666" }}>
                  광고명 : 캐시딜 다이나믹배너_상세진입_1순위_리타겟팅
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#999" }}>
                  ※ 시간별 리포트는 매시 10분에 이전 시간 데이터를 업데이트 합니다
                </p>
              </div>
              <Button color="primary" variant="solid" size="sm" style={{ flex: "none" }}>
                다운로드
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <HourlyReportTable />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

/** 시간별 리포트 — Data Modal(대형 조회) + StatsTable. */
export const HourlyReport: Story = {
  name: "시간별 리포트",
  render: () => <DataModalExample />,
};
