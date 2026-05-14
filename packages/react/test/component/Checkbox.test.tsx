import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, CheckboxGroup } from "../../src/Checkbox";
import { Radio, RadioGroup, RadioGroupItem } from "../../src/Radio";

describe("Checkbox", () => {
  it("toggles checked state on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Harness() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label="동의"
          checked={checked}
          onCheckedChange={(v) => {
            setChecked(v);
            onChange(v);
          }}
        />
      );
    }

    render(<Harness />);
    const checkbox = screen.getByLabelText("동의");

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="동의" checked={false} onCheckedChange={onChange} disabled />);

    const checkbox = screen.getByLabelText("동의");
    expect(checkbox).toBeDisabled();

    await user.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders the indicator with correct data-checked attribute", () => {
    const { rerender } = render(<Checkbox label="테스트" checked={false} />);

    const indicator = document.querySelector("[data-slot='indicator']");
    expect(indicator).toHaveAttribute("data-checked", "false");

    rerender(<Checkbox label="테스트" checked={true} />);
    expect(indicator).toHaveAttribute("data-checked", "true");
  });
});

describe("Radio", () => {
  it("can be checked", () => {
    render(<Radio label="옵션A" checked={true} />);
    expect(screen.getByLabelText("옵션A")).toBeChecked();
  });

  it("calls onCheckedChange on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Radio label="옵션A" checked={false} onCheckedChange={onChange} />);

    await user.click(screen.getByLabelText("옵션A"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not fire callback when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Radio label="옵션A" checked={false} onCheckedChange={onChange} disabled />);

    await user.click(screen.getByLabelText("옵션A"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("CheckboxGroup", () => {
  it("renders children in a group role", () => {
    render(
      <CheckboxGroup>
        <Checkbox label="A" checked={false} />
        <Checkbox label="B" checked={false} />
      </CheckboxGroup>,
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByLabelText("A")).toBeInTheDocument();
    expect(screen.getByLabelText("B")).toBeInTheDocument();
  });

  it("respects horizontal layout", () => {
    render(
      <CheckboxGroup layout="horizontal">
        <Checkbox label="A" checked={false} />
      </CheckboxGroup>,
    );

    expect(screen.getByRole("group")).toHaveAttribute("data-layout", "horizontal");
  });
});

describe("RadioGroup", () => {
  it("allows only one item to be selected at a time", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [value, setValue] = useState("a");
      return (
        <RadioGroup name="fruit" value={value} onValueChange={setValue}>
          <RadioGroupItem value="a" label="사과" />
          <RadioGroupItem value="b" label="바나나" />
          <RadioGroupItem value="c" label="체리" />
        </RadioGroup>
      );
    }

    render(<Harness />);

    expect(screen.getByLabelText("사과")).toBeChecked();
    expect(screen.getByLabelText("바나나")).not.toBeChecked();
    expect(screen.getByLabelText("체리")).not.toBeChecked();

    await user.click(screen.getByLabelText("바나나"));

    expect(screen.getByLabelText("사과")).not.toBeChecked();
    expect(screen.getByLabelText("바나나")).toBeChecked();
    expect(screen.getByLabelText("체리")).not.toBeChecked();
  });

  it("renders with radiogroup role", () => {
    render(
      <RadioGroup name="test" value="a" onValueChange={() => {}}>
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("shares the same name across all items", () => {
    render(
      <RadioGroup name="color" value="red" onValueChange={() => {}}>
        <RadioGroupItem value="red" label="빨강" />
        <RadioGroupItem value="blue" label="파랑" />
      </RadioGroup>,
    );

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("name", "color");
    });
  });
});

describe("Checkbox/Radio 브랜치 커버리지: gap, layout, onChange", () => {
  it("CheckboxGroup에 gap을 설정하면 CSS 변수로 적용된다", () => {
    render(
      <CheckboxGroup gap={16}>
        <Checkbox label="A" checked={false} />
      </CheckboxGroup>,
    );

    const group = screen.getByRole("group");
    expect(group.style.getPropertyValue("--nds-choice-group-gap")).toBe("16px");
  });

  it("CheckboxGroup에 gap이 없으면 CSS 변수가 설정되지 않는다", () => {
    render(
      <CheckboxGroup>
        <Checkbox label="A" checked={false} />
      </CheckboxGroup>,
    );

    const group = screen.getByRole("group");
    expect(group.style.getPropertyValue("--nds-choice-group-gap")).toBe("");
  });

  it("RadioGroup에 gap을 설정하면 CSS 변수로 적용된다", () => {
    render(
      <RadioGroup name="test" value="a" onValueChange={() => {}} gap={24}>
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );

    const group = screen.getByRole("radiogroup");
    expect(group.style.getPropertyValue("--nds-choice-group-gap")).toBe("24px");
  });

  it("RadioGroup layout=horizontal이 data-layout으로 적용된다", () => {
    render(
      <RadioGroup name="test" value="a" onValueChange={() => {}} layout="horizontal">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-layout", "horizontal");
  });

  it("Radio에 onChange 콜백도 함께 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onCheckedChange = vi.fn();

    render(
      <Radio label="옵션" checked={false} onCheckedChange={onCheckedChange} onChange={onChange} />,
    );

    await user.click(screen.getByLabelText("옵션"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("Checkbox에 onChange 콜백도 함께 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Harness() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox label="동의" checked={checked} onCheckedChange={setChecked} onChange={onChange} />
      );
    }

    render(<Harness />);
    await user.click(screen.getByLabelText("동의"));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("Checkbox disabled 상태에서 data-disabled=true가 설정된다", () => {
    render(<Checkbox label="비활성" checked={false} disabled />);
    const root = document.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-disabled", "true");
  });
});
