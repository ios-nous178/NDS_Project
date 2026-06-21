import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../src/Accordion";

/* ─── Harnesses ─── */

function SingleAccordion(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return (
    <Accordion expandMode="single" {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>이용 약관</AccordionTrigger>
        <AccordionContent>약관 본문 A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>개인정보 처리방침</AccordionTrigger>
        <AccordionContent>약관 본문 B</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>마케팅 수신 동의</AccordionTrigger>
        <AccordionContent>약관 본문 C</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function MultiAccordion(props: Partial<React.ComponentProps<typeof Accordion>> = {}) {
  return (
    <Accordion expandMode="multiple" {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>질문 1</AccordionTrigger>
        <AccordionContent>답변 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>질문 2</AccordionTrigger>
        <AccordionContent>답변 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>질문 3</AccordionTrigger>
        <AccordionContent>답변 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion 사용자 시나리오", () => {
  it("헤더를 클릭하면 해당 패널이 펼쳐지고 aria-expanded가 true가 된다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    // 처음엔 모든 패널이 닫혀 있다 (콘텐츠 미렌더)
    expect(screen.queryByText("약관 본문 A")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "이용 약관" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(screen.getByText("약관 본문 A")).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("열린 헤더를 다시 클릭하면 패널이 접힌다 (토글)", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion defaultValue="a" />);

    const trigger = screen.getByRole("button", { name: "이용 약관" });
    expect(screen.getByText("약관 본문 A")).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);

    expect(screen.queryByText("약관 본문 A")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("single 모드: 다른 헤더를 열면 이전에 열린 패널이 닫힌다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion defaultValue="a" />);

    expect(screen.getByText("약관 본문 A")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "개인정보 처리방침" }));

    // 새 패널은 열리고 이전 패널은 닫힌다
    expect(screen.getByText("약관 본문 B")).toBeVisible();
    expect(screen.queryByText("약관 본문 A")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이용 약관" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "개인정보 처리방침" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("multiple 모드: 여러 패널을 동시에 열어둘 수 있다", async () => {
    const user = userEvent.setup();
    render(<MultiAccordion />);

    await user.click(screen.getByRole("button", { name: "질문 1" }));
    await user.click(screen.getByRole("button", { name: "질문 2" }));

    // 둘 다 열려 있다
    expect(screen.getByText("답변 1")).toBeVisible();
    expect(screen.getByText("답변 2")).toBeVisible();
    expect(screen.getByRole("button", { name: "질문 1" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "질문 2" })).toHaveAttribute("aria-expanded", "true");
  });

  it("multiple 모드: 하나를 닫아도 나머지는 열린 채로 유지된다", async () => {
    const user = userEvent.setup();
    render(<MultiAccordion defaultValue={["a", "b"]} />);

    expect(screen.getByText("답변 1")).toBeVisible();
    expect(screen.getByText("답변 2")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "질문 1" }));

    expect(screen.queryByText("답변 1")).not.toBeInTheDocument();
    expect(screen.getByText("답변 2")).toBeVisible();
  });
});

describe("Accordion 키보드 상호작용", () => {
  it("Tab으로 헤더에 포커스한 뒤 Enter로 패널을 펼친다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    await user.tab();
    const trigger = screen.getByRole("button", { name: "이용 약관" });
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByText("약관 본문 A")).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("Space로도 패널을 토글한다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    const trigger = screen.getByRole("button", { name: "개인정보 처리방침" });
    trigger.focus();
    expect(trigger).toHaveFocus();

    await user.keyboard(" ");
    expect(screen.getByText("약관 본문 B")).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard(" ");
    expect(screen.queryByText("약관 본문 B")).not.toBeInTheDocument();
  });

  it("모든 헤더가 네이티브 button이라 Tab 순서에 차례로 들어온다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    await user.tab();
    expect(screen.getByRole("button", { name: "이용 약관" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "개인정보 처리방침" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "마케팅 수신 동의" })).toHaveFocus();
  });
});

describe("Accordion 콜백 & 제어/비제어", () => {
  it("uncontrolled: onValueChange가 single 모드에서 string 값으로 호출된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SingleAccordion onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "이용 약관" }));
    expect(onValueChange).toHaveBeenLastCalledWith("a");

    await user.click(screen.getByRole("button", { name: "개인정보 처리방침" }));
    expect(onValueChange).toHaveBeenLastCalledWith("b");

    // single 닫으면 빈 문자열
    await user.click(screen.getByRole("button", { name: "개인정보 처리방침" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("uncontrolled: onValueChange가 multiple 모드에서 배열로 호출된다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MultiAccordion onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "질문 1" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);

    await user.click(screen.getByRole("button", { name: "질문 2" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);

    await user.click(screen.getByRole("button", { name: "질문 1" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
  });

  it("controlled: value prop이 열림 상태를 지배하며, 콜백만으로는 열리지 않는다", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    // value를 고정하고 onValueChange로 state 갱신을 하지 않으면 패널은 절대 안 열린다
    render(<SingleAccordion value="a" onValueChange={onValueChange} />);

    expect(screen.getByText("약관 본문 A")).toBeVisible();

    // 다른 헤더 클릭 → 콜백은 발생하지만 value가 그대로라 화면은 안 바뀐다
    await user.click(screen.getByRole("button", { name: "개인정보 처리방침" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.queryByText("약관 본문 B")).not.toBeInTheDocument();
    expect(screen.getByText("약관 본문 A")).toBeVisible();
  });

  it("controlled: 외부 state로 value를 갱신하면 패널이 그에 맞게 열린다", async () => {
    const user = userEvent.setup();

    function ControlledAccordion() {
      const [value, setValue] = useState<string | string[]>("a");
      return <SingleAccordion value={value} onValueChange={(v) => setValue(v)} />;
    }

    render(<ControlledAccordion />);
    expect(screen.getByText("약관 본문 A")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "마케팅 수신 동의" }));
    expect(screen.getByText("약관 본문 C")).toBeVisible();
    expect(screen.queryByText("약관 본문 A")).not.toBeInTheDocument();
  });
});

describe("Accordion 접근성", () => {
  it("트리거의 aria-controls가 열린 콘텐츠 region의 id와 일치하고 region이 트리거로 라벨링된다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion />);

    const trigger = screen.getByRole("button", { name: "이용 약관" });
    const controlsId = trigger.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();

    await user.click(trigger);

    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("id", controlsId);
    // region은 트리거 id로 라벨링되어 스크린리더가 "이용 약관" 영역으로 인식한다
    expect(region).toHaveAttribute("aria-labelledby", trigger.id);
    expect(within(region).getByText("약관 본문 A")).toBeVisible();
  });

  it("열린 패널만 region으로 노출되고 닫힌 패널은 접근성 트리에서 빠진다", async () => {
    const user = userEvent.setup();
    render(<MultiAccordion defaultValue={["a"]} />);

    // 하나만 열려 있으니 region도 하나
    expect(screen.getAllByRole("region")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "질문 2" }));
    expect(screen.getAllByRole("region")).toHaveLength(2);
  });

  it("각 트리거의 aria-expanded가 자기 패널의 열림 상태를 정확히 반영한다", async () => {
    const user = userEvent.setup();
    render(<SingleAccordion defaultValue="a" />);

    const triggers = screen.getAllByRole("button");
    expect(triggers[0]).toHaveAttribute("aria-expanded", "true");
    expect(triggers[1]).toHaveAttribute("aria-expanded", "false");
    expect(triggers[2]).toHaveAttribute("aria-expanded", "false");

    await user.click(triggers[2]);
    expect(triggers[0]).toHaveAttribute("aria-expanded", "false");
    expect(triggers[2]).toHaveAttribute("aria-expanded", "true");
  });
});

describe("Accordion 엣지/변형", () => {
  it("Accordion.Item / .Trigger / .Content 점 표기 합성 API로도 동일하게 동작한다", async () => {
    const user = userEvent.setup();
    render(
      <Accordion expandMode="single">
        <Accordion.Item value="x">
          <Accordion.Trigger>점표기 헤더</Accordion.Trigger>
          <Accordion.Content>점표기 본문</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
    );

    expect(screen.queryByText("점표기 본문")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "점표기 헤더" }));
    expect(screen.getByText("점표기 본문")).toBeVisible();
  });

  it("defaultValue로 초기 열림 상태를 지정할 수 있다 (uncontrolled)", () => {
    render(<MultiAccordion defaultValue={["b", "c"]} />);

    expect(screen.queryByText("답변 1")).not.toBeInTheDocument();
    expect(screen.getByText("답변 2")).toBeVisible();
    expect(screen.getByText("답변 3")).toBeVisible();
  });

  it("아이템 컨테이너의 data-state가 열림/닫힘에 따라 갱신된다", async () => {
    const user = userEvent.setup();
    const { container } = render(<SingleAccordion />);

    const item = container.querySelector("[data-slot='item']")!;
    expect(item).toHaveAttribute("data-state", "closed");

    await user.click(screen.getByRole("button", { name: "이용 약관" }));
    expect(item).toHaveAttribute("data-state", "open");
  });
});
