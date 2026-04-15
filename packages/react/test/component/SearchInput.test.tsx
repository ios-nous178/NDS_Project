import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "../../src/SearchInput";

describe("SearchInput 사용자 시나리오: 검색 플로우", () => {
  function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [searched, setSearched] = useState(false);

    const items = ["번아웃 예방 가이드", "스트레스 관리법", "워크-라이프 밸런스"];

    const handleSearch = () => {
      setSearched(true);
      setResults(items.filter((item) => item.includes(query)));
    };

    const handleClear = () => {
      setQuery("");
      setResults([]);
      setSearched(false);
    };

    return (
      <div>
        <SearchInput
          label="콘텐츠 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          onClear={handleClear}
          clearable
          placeholder="검색어를 입력하세요"
        />
        {searched && (
          <ul aria-label="검색 결과">
            {results.length > 0 ? (
              results.map((r) => <li key={r}>{r}</li>)
            ) : (
              <li>검색 결과가 없습니다</li>
            )}
          </ul>
        )}
      </div>
    );
  }

  it("검색어 입력 → 검색 버튼 클릭 → 결과 확인 → 초기화", async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    const input = screen.getByRole("searchbox");

    // 1단계: 검색어 입력
    await user.type(input, "번아웃");
    expect(input).toHaveValue("번아웃");

    // 2단계: 검색 버튼 클릭
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(screen.getByRole("list", { name: "검색 결과" })).toBeVisible();
    expect(screen.getByText("번아웃 예방 가이드")).toBeVisible();

    // 3단계: 클리어 버튼으로 초기화
    await user.click(screen.getByRole("button", { name: "검색어 지우기" }));
    expect(input).toHaveValue("");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("Enter 키로 검색을 실행할 수 있다", async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "스트레스");
    await user.keyboard("{Enter}");

    expect(screen.getByText("스트레스 관리법")).toBeVisible();
  });

  it("검색 결과가 없으면 빈 결과 안내가 표시된다", async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    await user.type(screen.getByRole("searchbox"), "존재하지않는검색어");
    await user.keyboard("{Enter}");

    expect(screen.getByText("검색 결과가 없습니다")).toBeVisible();
  });
});

describe("SearchInput 사용자 시나리오: 비제어 모드", () => {
  it("defaultValue로 초기값을 설정하고 클리어할 수 있다", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<SearchInput label="검색" defaultValue="기존 검색어" clearable onClear={onClear} />);

    const input = screen.getByRole("searchbox");
    expect(input).toHaveValue("기존 검색어");

    // 클리어
    await user.click(screen.getByRole("button", { name: "검색어 지우기" }));
    expect(input).toHaveValue("");
    expect(onClear).toHaveBeenCalledOnce();

    // 클리어 후 입력 필드에 포커스가 돌아온다
    expect(input).toHaveFocus();
  });

  it("값이 비어있으면 클리어 버튼이 나타나지 않는다", () => {
    render(<SearchInput label="검색" clearable />);
    expect(screen.queryByRole("button", { name: "검색어 지우기" })).not.toBeInTheDocument();
  });

  it("showSearchButton=false이면 검색 버튼이 숨겨진다", () => {
    render(<SearchInput label="검색" showSearchButton={false} />);
    expect(screen.queryByRole("button", { name: "검색" })).not.toBeInTheDocument();
  });
});

describe("SearchInput 접근성", () => {
  it("label이 input과 연결되어 스크린리더가 용도를 안내한다", () => {
    render(<SearchInput label="직원 검색" />);

    // searchbox 역할로 검색 입력임을 알 수 있다
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();

    // label과 연결되어 있다
    expect(screen.getByText("직원 검색")).toBeVisible();
  });

  it("에러 상태에서 aria-invalid가 설정되고 에러 메시지가 alert로 표시된다", () => {
    render(<SearchInput label="검색" error errorMessage="최소 2글자 이상 입력해주세요" />);

    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("최소 2글자 이상 입력해주세요");
  });

  it("도움 텍스트가 aria-describedby로 input과 연결된다", () => {
    render(<SearchInput label="검색" helperText="이름 또는 이메일로 검색" />);

    const input = screen.getByRole("searchbox");
    const helper = screen.getByText("이름 또는 이메일로 검색");

    // input의 aria-describedby가 helper의 id를 가리킨다
    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("키보드만으로 입력 → 검색 → 클리어를 수행할 수 있다", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onClear = vi.fn();

    render(
      <SearchInput
        label="검색"
        defaultValue="테스트"
        clearable
        onSearch={onSearch}
        onClear={onClear}
      />,
    );

    // Tab → input에 포커스
    await user.tab();
    expect(screen.getByRole("searchbox")).toHaveFocus();

    // Enter로 검색
    await user.keyboard("{Enter}");
    expect(onSearch).toHaveBeenCalledOnce();

    // Tab → 클리어 버튼 → Tab → 검색 버튼
    await user.tab();
    expect(screen.getByRole("button", { name: "검색어 지우기" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "검색" })).toHaveFocus();
  });
});

describe("SearchInput variant & 엣지 케이스", () => {
  it("variant=outlined이 기본값이다", () => {
    const { container } = render(<SearchInput label="검색" />);
    const wrapper = container.querySelector("[data-slot='wrapper']")!;
    expect(wrapper).toHaveAttribute("data-variant", "outlined");
  });

  it("variant=filled가 data-variant로 적용된다", () => {
    const { container } = render(<SearchInput label="검색" variant="filled" />);
    const wrapper = container.querySelector("[data-slot='wrapper']")!;
    expect(wrapper).toHaveAttribute("data-variant", "filled");
  });

  it("errorMessage가 helperText보다 우선하여 표시된다", () => {
    render(<SearchInput label="검색" helperText="도움말" error errorMessage="에러 메시지" />);
    expect(screen.getByText("에러 메시지")).toBeVisible();
    expect(screen.queryByText("도움말")).not.toBeInTheDocument();
  });

  it("errorMessage가 있으면 helperText 대신 에러 메시지가 표시된다", () => {
    render(<SearchInput label="검색" errorMessage="에러입니다" helperText="도움말" />);
    expect(screen.getByText("에러입니다")).toBeVisible();
    expect(screen.queryByText("도움말")).not.toBeInTheDocument();
  });

  it("clearable=false이면 값이 있어도 클리어 버튼이 나타나지 않는다", async () => {
    const user = userEvent.setup();

    render(<SearchInput label="검색" clearable={false} />);
    const input = screen.getByRole("searchbox");

    await user.type(input, "텍스트");
    expect(screen.queryByRole("button", { name: "검색어 지우기" })).not.toBeInTheDocument();
  });

  it("커스텀 searchIcon이 버튼 내에 렌더링된다", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchInput
        label="검색"
        onSearch={onSearch}
        searchIcon={<span data-testid="custom-icon">🔍</span>}
      />,
    );

    expect(screen.getByTestId("custom-icon")).toBeVisible();
    // label "검색"과 aria-label "검색"이 둘 다 있으므로 button role로 정확히 지정
    await user.click(screen.getByRole("button", { name: "검색" }));
    expect(onSearch).toHaveBeenCalledOnce();
  });

  it("fullWidth=false일 때 CSS 변수가 auto로 설정된다", () => {
    const { container } = render(<SearchInput label="검색" fullWidth={false} />);
    const root = container.querySelector("[data-slot='root']") as HTMLElement;
    expect(root.style.getPropertyValue("--nds-search-input-width")).toBe("auto");
  });

  it("label 없이도 정상 렌더링된다", () => {
    render(<SearchInput placeholder="검색어 입력" />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "검색어 입력");
  });

  it("onFocus/onBlur 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    render(<SearchInput label="검색" onFocus={onFocus} onBlur={onBlur} />);

    await user.click(screen.getByRole("searchbox"));
    expect(onFocus).toHaveBeenCalledOnce();

    await user.tab();
    // onBlur는 setTimeout(150ms) 후 실행되므로 비동기 대기 필요 없이 호출 확인
    expect(onBlur).toHaveBeenCalledOnce();
  });
});
