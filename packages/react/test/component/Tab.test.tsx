import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tab } from "../../src/Tab";

function TabHarness({ variant = "line" as const }) {
  const [activeKey, setActiveKey] = useState("all");

  return (
    <Tab
      items={[
        { key: "all", title: "전체", content: <div>전체 콘텐츠</div> },
        { key: "counsel", title: "상담", content: <div>상담 콘텐츠</div> },
        { key: "challenge", title: "챌린지", content: <div>챌린지 콘텐츠</div> },
      ]}
      activeKey={activeKey}
      onTabChange={setActiveKey}
      variant={variant}
    />
  );
}

describe("Tab 사용자 시나리오", () => {
  it("탭 클릭으로 패널 콘텐츠가 전환된다", async () => {
    const user = userEvent.setup();
    render(<TabHarness />);

    expect(screen.getByText("전체 콘텐츠")).toBeVisible();
    expect(screen.queryByText("상담 콘텐츠")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "상담" }));

    expect(screen.getByText("상담 콘텐츠")).toBeVisible();
    expect(screen.queryByText("전체 콘텐츠")).not.toBeInTheDocument();
  });

  it("Enter 키로 탭을 활성화할 수 있다", async () => {
    const user = userEvent.setup();
    render(<TabHarness />);

    screen.getByRole("tab", { name: "챌린지" }).focus();
    await user.keyboard("{Enter}");

    expect(screen.getByText("챌린지 콘텐츠")).toBeVisible();
  });

  it("Space 키로 탭을 활성화할 수 있다", async () => {
    const user = userEvent.setup();
    render(<TabHarness />);

    screen.getByRole("tab", { name: "상담" }).focus();
    await user.keyboard(" ");

    expect(screen.getByText("상담 콘텐츠")).toBeVisible();
  });

  it("ArrowRight로 다음 탭, ArrowLeft로 이전 탭 이동 (순환)", async () => {
    const user = userEvent.setup();
    render(<TabHarness />);

    screen.getByRole("tab", { name: "전체" }).focus();

    // → 상담
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "상담" })).toHaveAttribute("aria-selected", "true");

    // → 챌린지
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "챌린지" })).toHaveAttribute("aria-selected", "true");

    // → 전체 (순환)
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "전체" })).toHaveAttribute("aria-selected", "true");

    // ← 챌린지 (역순환)
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "챌린지" })).toHaveAttribute("aria-selected", "true");
  });

  it("Home/End로 첫/마지막 탭으로 이동한다", async () => {
    const user = userEvent.setup();
    render(<TabHarness />);

    screen.getByRole("tab", { name: "전체" }).focus();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "챌린지" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "전체" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tab 접근성: WAI-ARIA Tab 패턴", () => {
  it("tablist, tab, tabpanel 역할이 올바르게 설정된다", () => {
    render(<TabHarness />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    // 모든 패널이 tabpanel 역할을 가진다 (숨김 포함)
    expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(3);
  });

  it("활성 탭만 aria-selected=true이고 tabIndex=0이다", async () => {
    const user = userEvent.setup();
    render(<TabHarness />);

    const tabs = screen.getAllByRole("tab");

    // 초기: "전체"가 활성
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
    expect(tabs[2]).toHaveAttribute("tabindex", "-1");

    // "상담" 클릭
    await user.click(tabs[1]);
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");
  });

  it("tab의 aria-controls가 대응하는 tabpanel의 id를 가리킨다", () => {
    render(<TabHarness />);

    const activeTab = screen.getByRole("tab", { name: "전체" });
    const panelId = activeTab.getAttribute("aria-controls")!;
    const panel = document.getElementById(panelId);

    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("role", "tabpanel");
    expect(panel).toHaveTextContent("전체 콘텐츠");
  });

  it("tabpanel의 aria-labelledby가 대응하는 tab의 id를 가리킨다", () => {
    render(<TabHarness />);

    // 활성 패널의 aria-labelledby가 대응하는 tab id를 가리킨다
    const activeTab = screen.getByRole("tab", { name: "전체" });
    const panelId = activeTab.getAttribute("aria-controls")!;
    const panel = document.getElementById(panelId)!;
    const triggerId = panel.getAttribute("aria-labelledby")!;
    const trigger = document.getElementById(triggerId);

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("role", "tab");
  });

  it("비활성 패널은 DOM에서 숨겨진다 (display: none)", () => {
    render(<TabHarness />);

    // 활성 패널만 보인다
    const panels = document.querySelectorAll("[role='tabpanel']");
    const visiblePanels = Array.from(panels).filter(
      (p) => p.getAttribute("data-hidden") === "false",
    );
    expect(visiblePanels).toHaveLength(1);
  });
});

describe("Tab Compound API", () => {
  it("개별 서브컴포넌트로 커스텀 탭을 구성한다", async () => {
    const user = userEvent.setup();

    function CustomTabs() {
      const [active, setActive] = useState("a");
      return (
        <Tab.Root activeKey={active} onTabChange={setActive}>
          <Tab.List>
            <Tab.Trigger tabKey="a">탭 A</Tab.Trigger>
            <Tab.Trigger tabKey="b">탭 B</Tab.Trigger>
          </Tab.List>
          <Tab.Panel tabKey="a">패널 A 내용</Tab.Panel>
          <Tab.Panel tabKey="b">패널 B 내용</Tab.Panel>
        </Tab.Root>
      );
    }

    render(<CustomTabs />);

    expect(screen.getByText("패널 A 내용")).toBeVisible();
    await user.click(screen.getByRole("tab", { name: "탭 B" }));
    expect(screen.getByText("패널 B 내용")).toBeVisible();
    expect(screen.queryByText("패널 A 내용")).not.toBeInTheDocument();
  });
});

describe("Tab variant 조합", () => {
  const variants = ["line", "pill", "square"] as const;

  it.each(variants)("variant=%s 가 tablist에 data-variant로 적용된다", (variant) => {
    render(<TabHarness variant={variant} />);
    expect(screen.getByRole("tablist")).toHaveAttribute("data-variant", variant);
  });
});

describe("Tab 브랜치 커버리지: Flat API 옵션", () => {
  it("fullWidth=false이면 탭리스트가 전체폭을 차지하지 않는다", () => {
    const { container } = render(
      <Tab
        items={[{ key: "a", title: "A", content: <div>내용 A</div> }]}
        activeKey="a"
        onTabChange={() => {}}
        fullWidth={false}
      />,
    );

    const root = container.querySelector("[data-slot='root']") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-tab-width")).toBe("auto");
  });

  it("items의 content가 모두 undefined이면 패널이 렌더링되지 않는다", () => {
    const { container } = render(
      <Tab
        items={[
          { key: "a", title: "A" },
          { key: "b", title: "B" },
        ]}
        activeKey="a"
        onTabChange={() => {}}
      />,
    );

    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(container.querySelectorAll("[role='tabpanel']")).toHaveLength(0);
  });

  it("slotProps로 trigger/panel에 className이 적용된다", () => {
    const { container } = render(
      <Tab
        items={[{ key: "a", title: "A", content: <div>내용</div> }]}
        activeKey="a"
        onTabChange={() => {}}
        slotProps={{
          trigger: { className: "trigger-cls" },
          panel: { className: "panel-cls" },
          list: { className: "list-cls" },
          root: { className: "root-cls" },
        }}
      />,
    );

    expect(screen.getByRole("tab")).toHaveClass("trigger-cls");
    expect(container.querySelector("[role='tabpanel']")!.className).toContain("panel-cls");
    expect(screen.getByRole("tablist").className).toContain("list-cls");
    expect(container.querySelector("[data-slot='root']")!.className).toContain("root-cls");
  });
});
