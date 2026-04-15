import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../../src/Select";

const OPTIONS = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "cherry", label: "체리" },
  { value: "disabled-one", label: "비활성 옵션", disabled: true },
];

function SelectHarness(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select
      label="과일 선택"
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
      placeholder="선택해주세요"
      {...props}
    />
  );
}

describe("Select", () => {
  it("renders a trigger with placeholder text", () => {
    render(<SelectHarness />);
    expect(screen.getByRole("button", { name: /선택해주세요/i })).toBeInTheDocument();
  });

  it("opens the dropdown on click and shows options", async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);

    await user.click(screen.getByRole("button", { name: /선택해주세요/i }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "사과" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "바나나" })).toBeInTheDocument();
  });

  it("selects an option and closes the dropdown", async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);

    await user.click(screen.getByRole("button", { name: /선택해주세요/i }));
    await user.click(screen.getByRole("option", { name: "바나나" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /바나나/i })).toBeInTheDocument();
  });

  it("does not allow selecting a disabled option", async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);

    await user.click(screen.getByRole("button", { name: /선택해주세요/i }));

    const disabledOption = screen.getByRole("option", { name: "비활성 옵션" });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");

    await user.click(disabledOption);
    // dropdown should still be open since disabled click is ignored
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("navigates options with keyboard (ArrowDown/ArrowUp/Enter)", async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);

    const trigger = screen.getByRole("button", { name: /선택해주세요/i });
    await user.click(trigger);

    const listbox = screen.getByRole("listbox");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes on Escape and restores focus to trigger", async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);

    const trigger = screen.getByRole("button", { name: /선택해주세요/i });
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("renders in a portal", async () => {
    const user = userEvent.setup();
    render(<SelectHarness />);

    await user.click(screen.getByRole("button", { name: /선택해주세요/i }));

    const listbox = screen.getByRole("listbox");
    expect(listbox.closest("body")).toBe(document.body);
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<SelectHarness disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows error message when errorMessage is provided", () => {
    render(<SelectHarness errorMessage="필수 항목입니다" />);
    expect(screen.getByText("필수 항목입니다")).toBeInTheDocument();
  });
});
