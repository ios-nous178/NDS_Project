import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "../../src/Card";

describe("Card 사용자 시나리오", () => {
  it("사용자가 카드에서 제목, 설명, 메타 정보를 확인할 수 있다", () => {
    render(
      <Card title="번아웃 예방 가이드" subtitle="업무 스트레스 관리법" meta={<span>3일 전</span>}>
        일상에서 실천할 수 있는 간단한 번아웃 예방 팁을 소개합니다.
      </Card>,
    );

    expect(screen.getByRole("heading", { name: "번아웃 예방 가이드" })).toBeVisible();
    expect(screen.getByText("업무 스트레스 관리법")).toBeVisible();
    expect(screen.getByText("3일 전")).toBeVisible();
    expect(screen.getByText(/번아웃 예방 팁/)).toBeVisible();
  });

  it("클릭 가능한 카드를 클릭하면 핸들러가 호출된다", async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();

    render(
      <Card title="세미나 공지" onClick={onCardClick}>
        2026년 상반기 워크숍 안내
      </Card>,
    );

    await user.click(screen.getByText("세미나 공지"));
    expect(onCardClick).toHaveBeenCalledOnce();
  });

  it("카드 푸터의 액션 버튼을 클릭할 수 있다", async () => {
    const user = userEvent.setup();
    const onLike = vi.fn();
    const onShare = vi.fn();

    render(
      <Card
        title="좋은 글"
        footer={
          <>
            <button onClick={onLike}>좋아요</button>
            <button onClick={onShare}>공유</button>
          </>
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "좋아요" }));
    await user.click(screen.getByRole("button", { name: "공유" }));

    expect(onLike).toHaveBeenCalledOnce();
    expect(onShare).toHaveBeenCalledOnce();
  });

  it("썸네일 이미지가 포함된 카드를 볼 수 있다", () => {
    render(<Card title="오늘의 식단" thumbnail={<img src="lunch.jpg" alt="점심 메뉴 사진" />} />);

    expect(screen.getByAltText("점심 메뉴 사진")).toBeVisible();
    expect(screen.getByRole("heading", { name: "오늘의 식단" })).toBeVisible();
  });

  it("Compound API로 자유롭게 카드 구조를 구성할 수 있다", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <Card.Root>
        <Card.Header>
          <div>
            <Card.Title>프로젝트 현황</Card.Title>
            <Card.Subtitle>2026년 1분기</Card.Subtitle>
          </div>
          <Card.Meta>진행중</Card.Meta>
        </Card.Header>
        <Card.Body>전체 진행률 72%</Card.Body>
        <Card.Footer>
          <button onClick={onAction}>상세 보기</button>
        </Card.Footer>
      </Card.Root>,
    );

    expect(screen.getByRole("heading", { name: "프로젝트 현황" })).toBeVisible();
    expect(screen.getByText("진행중")).toBeVisible();
    expect(screen.getByText("전체 진행률 72%")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "상세 보기" }));
    expect(onAction).toHaveBeenCalledOnce();
  });
});

describe("Card 접근성", () => {
  it("제목이 heading 요소(h3)로 렌더링되어 문서 구조를 갖는다", () => {
    render(<Card title="접근성 테스트" />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("접근성 테스트");
  });

  it("onClick이 없는 카드는 인터랙티브 역할이 없다", () => {
    render(<Card title="정보 카드">읽기 전용 콘텐츠</Card>);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("Card variant 조합 & 엣지 케이스", () => {
  const variants = ["outlined", "elevated", "flat"] as const;

  it.each(variants)("variant=%s 가 data-variant로 적용된다", (variant) => {
    const { container } = render(<Card variant={variant} title={variant} />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", variant);
  });

  it("기본 variant=outlined, clickable=false", () => {
    const { container } = render(<Card title="기본">내용</Card>);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-variant", "outlined");
    expect(root).toHaveAttribute("data-clickable", "false");
  });

  it("clickable=true를 명시하면 onClick 없이도 커서 변경 힌트가 된다", () => {
    const { container } = render(<Card title="커서" clickable />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toHaveAttribute("data-clickable", "true");
  });

  it("title, subtitle, meta, children, footer 모두 비어있으면 최소 구조만 렌더링된다", () => {
    const { container } = render(<Card />);
    const root = container.querySelector("[data-slot='root']")!;
    expect(root).toBeInTheDocument();
    expect(container.querySelector("[data-slot='header']")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot='body']")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot='footer']")).not.toBeInTheDocument();
  });

  it("meta만 있어도 header가 렌더링된다", () => {
    const { container } = render(<Card meta={<span>D-3</span>} />);
    expect(container.querySelector("[data-slot='header']")).toBeInTheDocument();
    expect(screen.getByText("D-3")).toBeVisible();
  });

  it("footer noBorder 옵션이 data-no-border로 적용된다", () => {
    const { container } = render(<Card title="제목" footer={<span>푸터</span>} footerNoBorder />);
    const footer = container.querySelector("[data-slot='footer']")!;
    expect(footer).toHaveAttribute("data-no-border", "true");
  });

  it("footerNoBorder=false가 기본값이다", () => {
    const { container } = render(<Card title="제목" footer={<span>푸터</span>} />);
    const footer = container.querySelector("[data-slot='footer']")!;
    expect(footer).toHaveAttribute("data-no-border", "false");
  });

  it("thumbnailRatio를 커스텀으로 설정할 수 있다", () => {
    const { container } = render(
      <Card title="비율" thumbnail={<img src="test.png" alt="테스트" />} thumbnailRatio="4 / 3" />,
    );
    const thumb = container.querySelector("[data-slot='thumbnail']") as HTMLElement;
    expect(thumb).toBeInTheDocument();
  });

  it("slotProps로 각 슬롯에 className을 전달할 수 있다", () => {
    const { container } = render(
      <Card
        title="슬롯"
        subtitle="부제"
        meta={<span>메타</span>}
        footer={<span>푸터</span>}
        slotProps={{
          root: { className: "root-custom" },
          header: { className: "header-custom" },
          title: { className: "title-custom" },
          footer: { className: "footer-custom" },
        }}
      >
        본문
      </Card>,
    );

    expect(container.querySelector("[data-slot='root']")!.className).toContain("root-custom");
    expect(container.querySelector("[data-slot='header']")!.className).toContain("header-custom");
    expect(container.querySelector("[data-slot='title']")!.className).toContain("title-custom");
    expect(container.querySelector("[data-slot='footer']")!.className).toContain("footer-custom");
  });
});
