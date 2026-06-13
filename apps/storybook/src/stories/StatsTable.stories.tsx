import type { Meta, StoryObj } from "@storybook/react";
import { StatsTable, Pagination } from "@nudge-design/react";
import React, { useState } from "react";

const meta: Meta<typeof StatsTable> = {
  title: "Components/Data/StatsTable",
  component: StatsTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "캐포비 어드민 통계/집계 리포트 표 — 회색 헤더 + 가는 그리드 + 병합셀(rowspan/colspan) + 합계행(굵게). " +
          "native <table> 에 .nds-stats-table 클래스. 동적 정렬/모바일 카드뷰는 DataTable 사용. Figma 퀴즈 통계(3001:47404).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatsTable>;

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px 28px",
      maxWidth: 720,
      boxShadow: "0 1px 4px rgba(0,0,0,.08)",
    }}
  >
    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{title}</div>
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Card title="캐시워크 통계">
      <StatsTable>
        <thead>
          <tr>
            <th>연령</th>
            <th>성별</th>
            <th>당첨자 수</th>
            <th>지급된 캐시</th>
          </tr>
        </thead>
        <tbody>
          <tr className="is-summary">
            <td colSpan={2}>총합</td>
            <td>999,999</td>
            <td>999,999</td>
          </tr>
          <tr>
            <td rowSpan={2}>알 수 없음</td>
            <td>남성</td>
            <td>99</td>
            <td>999</td>
          </tr>
          <tr>
            <td>여성</td>
            <td>99</td>
            <td>999</td>
          </tr>
          <tr className="is-summary">
            <td colSpan={2}>알 수 없음 총합</td>
            <td>999</td>
            <td>99,999</td>
          </tr>
          <tr>
            <td rowSpan={2}>NN대</td>
            <td>남성</td>
            <td>99</td>
            <td>999</td>
          </tr>
          <tr>
            <td>여성</td>
            <td>99</td>
            <td>999</td>
          </tr>
          <tr className="is-summary">
            <td colSpan={2}>NN대 총합</td>
            <td>999</td>
            <td>99,999</td>
          </tr>
        </tbody>
      </StatsTable>
    </Card>
  ),
};

/** 페이지네이션과 조합 (참여 시간대 통계 등 긴 표). */
export const WithPagination: Story = {
  tags: ["gallery"],
  render: () => {
    function Demo() {
      const [page, setPage] = useState(1);
      return (
        <Card title="참여 시간대 통계">
          <StatsTable>
            <thead>
              <tr>
                <th>시간대 (1시간 단위)</th>
                <th data-align="right">당첨자 수</th>
              </tr>
            </thead>
            <tbody>
              {["1시간 이내", "1시간~2시간 이내", "2시간~3시간 이내", "3시간~4시간 이내"].map(
                (t) => (
                  <tr key={t}>
                    <td>{t}</td>
                    <td data-align="right">999,999</td>
                  </tr>
                ),
              )}
            </tbody>
          </StatsTable>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Pagination page={page} totalPages={5} onPageChange={setPage} />
          </div>
        </Card>
      );
    }
    return <Demo />;
  },
};
