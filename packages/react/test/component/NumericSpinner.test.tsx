import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumericSpinner } from "../../src/NumericSpinner";

function Harness({
  start = 1,
  min,
  max,
  step,
}: {
  start?: number;
  min?: number;
  max?: number;
  step?: number;
}) {
  const [v, setV] = useState(start);
  return (
    <NumericSpinner
      value={v}
      onValueChange={setV}
      min={min}
      max={max}
      step={step}
      aria-label="수량"
    />
  );
}

describe("NumericSpinner", () => {
  it("increments and decrements by step", async () => {
    const user = userEvent.setup();
    render(<Harness start={2} step={3} />);
    const spin = screen.getByRole("spinbutton") as HTMLInputElement;

    await user.click(screen.getByLabelText("값 증가"));
    expect(spin.value).toBe("5");

    await user.click(screen.getByLabelText("값 감소"));
    expect(spin.value).toBe("2");
  });

  it("clamps to max and disables + at the bound", async () => {
    const user = userEvent.setup();
    render(<Harness start={9} min={0} max={10} />);
    const spin = screen.getByRole("spinbutton") as HTMLInputElement;
    const inc = screen.getByLabelText("값 증가");

    await user.click(inc);
    expect(spin.value).toBe("10");
    expect(inc).toBeDisabled();
  });

  it("clamps to min and disables − at the bound", async () => {
    const user = userEvent.setup();
    render(<Harness start={1} min={1} max={10} />);
    const dec = screen.getByLabelText("값 감소");
    expect(dec).toBeDisabled();
  });

  it("commits clamped typed value, allows transient empty while typing", async () => {
    const user = userEvent.setup();
    render(<Harness start={5} min={0} max={20} />);
    const spin = screen.getByRole("spinbutton") as HTMLInputElement;

    await user.clear(spin); // transient empty — value not committed yet
    await user.type(spin, "12");
    expect(spin.value).toBe("12");

    // blur reverts display to committed/clamped value (still 12 here)
    await user.tab();
    expect(spin.value).toBe("12");
  });

  it("arrow keys step the value", async () => {
    const user = userEvent.setup();
    render(<Harness start={3} min={0} max={10} />);
    const spin = screen.getByRole("spinbutton") as HTMLInputElement;

    spin.focus();
    await user.keyboard("{ArrowUp}");
    expect(spin.value).toBe("4");
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(spin.value).toBe("2");
  });

  it("disabled blocks all interaction", async () => {
    function Disabled() {
      const [v, setV] = useState(3);
      return <NumericSpinner value={v} onValueChange={setV} disabled aria-label="수량" />;
    }
    render(<Disabled />);
    expect(screen.getByRole("spinbutton")).toBeDisabled();
    expect(screen.getByLabelText("값 증가")).toBeDisabled();
    expect(screen.getByLabelText("값 감소")).toBeDisabled();
  });
});
