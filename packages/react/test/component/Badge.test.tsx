import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "../../src/Badge";

/**
 * Badge는 순수 표시용 컴포넌트로 인터랙션이 없다.
 * 스크린리더가 텍스트를 올바르게 읽을 수 있는지,
 * 인터랙티브 요소가 아님을 보장하는 접근성 테스트에 집중한다.
 */
describe("Badge 접근성", () => {
  it("스크린리더가 뱃지 텍스트를 읽을 수 있다", () => {
    render(
      <p>
        주문 상태: <Badge>배송중</Badge>
      </p>,
    );

    // 뱃지 텍스트가 주변 맥락과 함께 읽힌다
    expect(screen.getByText("배송중")).toBeVisible();
  });

  it("인터랙티브 역할(role)이 없어서 포커스 대상이 아니다", () => {
    render(<Badge>신규</Badge>);

    // button, link 등의 역할이 없으므로 Tab으로 포커스되지 않는다
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("ref 전달이 가능하다", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>테스트</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.textContent).toBe("테스트");
  });
});

describe("Badge variant 조합", () => {
  const variants = ["fill", "ghost", "line"] as const;
  const colors = ["brand", "neutral", "success", "caution", "error", "info"] as const;
  const sizes = ["sm", "md", "lg"] as const;

  it.each(variants)("variant=%s 가 크래시 없이 렌더링된다", (variant) => {
    render(<Badge variant={variant}>{variant}</Badge>);
    const root = screen.getByText(variant).closest("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", variant);
  });

  it.each(colors)("color=%s 가 크래시 없이 렌더링된다", (color) => {
    render(<Badge color={color}>{color}</Badge>);
    const root = screen.getByText(color).closest("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-color", color);
  });

  it.each(sizes)("size=%s 가 크래시 없이 렌더링된다", (size) => {
    render(<Badge size={size}>{size}</Badge>);
    const root = screen.getByText(size).closest("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-size", size);
  });

  it("기본 variant=fill, color=neutral, size=md 가 적용된다", () => {
    render(<Badge>기본</Badge>);
    const root = screen.getByText("기본").closest("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", "fill");
    expect(root).toHaveAttribute("data-color", "neutral");
    expect(root).toHaveAttribute("data-size", "md");
  });
});

describe("Badge shape (default / pill)", () => {
  it("기본 shape=default 가 적용된다", () => {
    render(<Badge>기본</Badge>);
    const root = screen.getByText("기본").closest("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-shape", "default");
  });

  it("shape=pill 은 data-shape=pill + 완전 둥근 radius(9999px) 를 적용한다", () => {
    render(
      <Badge shape="pill" size="sm">
        프리미엄
      </Badge>,
    );
    const root = screen.getByText("프리미엄").closest("[data-slot='root']") as HTMLElement;
    expect(root).toHaveAttribute("data-shape", "pill");
    expect(root.style.borderRadius).toContain("9999px");
  });

  it("shape=default 은 size 별 라운드 사각 radius 를 유지한다(pill 아님)", () => {
    render(
      <Badge shape="default" size="sm">
        충전
      </Badge>,
    );
    const root = screen.getByText("충전").closest("[data-slot='root']") as HTMLElement;
    expect(root.style.borderRadius).not.toContain("9999px");
  });
});

describe("Badge slotProps & 스타일 커스터마이징", () => {
  it("className이 root에 적용된다", () => {
    render(<Badge className="custom-class">커스텀</Badge>);
    const root = screen.getByText("커스텀").closest("[data-slot='root']")!;
    expect(root.className).toContain("custom-class");
  });

  it("style이 root에 적용된다", () => {
    render(<Badge style={{ margin: 8 }}>스타일</Badge>);
    const root = screen.getByText("스타일").closest("[data-slot='root']") as HTMLElement;
    expect(root).toHaveStyle({ margin: "8px" });
  });

  it("slotProps.label이 라벨 요소에 전파된다", () => {
    render(<Badge slotProps={{ label: { className: "label-custom" } }}>슬롯</Badge>);
    const label = screen.getByText("슬롯").closest("[data-slot='label']")!;
    expect(label.className).toContain("label-custom");
  });

  it("labelClassName이 라벨 요소에 적용된다", () => {
    render(<Badge labelClassName="my-label">라벨</Badge>);
    const label = screen.getByText("라벨").closest("[data-slot='label']")!;
    expect(label.className).toContain("my-label");
  });

  it("rest props (...rest)가 root에 전파된다", () => {
    render(<Badge data-testid="badge-root">전파</Badge>);
    expect(screen.getByTestId("badge-root")).toBeInTheDocument();
  });
});
