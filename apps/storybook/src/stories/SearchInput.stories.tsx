import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { SearchInput, type SearchInputProps } from "@nudge-eap/react";
import { colors } from "@nudge-eap/tokens";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser, pause } from "./interactionTest";

const meta: Meta<SearchInputProps> = {
  title: "Components/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("SearchInput"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["outlined", "filled"],
    },
    clearable: { control: "boolean" },
    showSearchButton: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    label: "검색",
    placeholder: "검색어를 입력해주세요",
    clearable: true,
    showSearchButton: true,
    fullWidth: true,
    variant: "outlined",
  },
};

export default meta;
type Story = StoryObj<SearchInputProps>;

export const Playground: Story = {
  decorators: [
    (StoryComponent) => (
      <div style={{ width: 360 }}>
        <StoryComponent />
      </div>
    ),
  ],
};

function OutlinedExample() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="검색어를 입력해주세요"
        variant="outlined"
        helperText="키워드를 입력한 뒤 Enter를 누르거나 검색 버튼을 눌러보세요"
      />
    </div>
  );
}

export const Outlined: Story = {
  name: "State/Outlined",
  render: () => <OutlinedExample />,
};

function FilledExample() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="어떤 고민이 있으신가요?"
        variant="filled"
      />
    </div>
  );
}

export const Filled: Story = {
  name: "State/Filled",
  render: () => <FilledExample />,
};

function WithSearchCallbackExample() {
  const [value, setValue] = useState("번아웃");
  const [result, setResult] = useState("");

  return (
    <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 12 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        onSearch={() => setResult(`"${value}" 검색 실행`)}
        placeholder="검색어를 입력해주세요"
        helperText="검색 버튼 또는 Enter 키로 실행됩니다"
      />
      {result && <p style={{ margin: 0, fontSize: 14, color: colors.neutral[600] }}>{result}</p>}
    </div>
  );
}

export const WithSearchCallback: Story = {
  name: "Recipe/With Search Callback",
  render: () => <WithSearchCallbackExample />,
};

function CompoundAPIExampleDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <SearchInput.Root>
        <SearchInput.Wrapper variant="filled">
          <SearchInput.Field
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="도움이 필요하세요?"
          />
          {value && <SearchInput.ClearButton onClick={() => setValue("")} />}
          <SearchInput.SearchButton />
        </SearchInput.Wrapper>
      </SearchInput.Root>
    </div>
  );
}

export const CompoundAPIExample: Story = {
  name: "Recipe/Compound API",
  render: () => <CompoundAPIExampleDemo />,
};

function HomepageStyleDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="검색어를 입력해주세요."
        variant="outlined"
      />
    </div>
  );
}

export const HomepageStyleExample: Story = {
  name: "Recipe/Homepage Style",
  render: () => <HomepageStyleDemo />,
};

function WebViewStyleDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="도움이 필요하세요?"
        variant="filled"
        showSearchButton
      />
    </div>
  );
}

export const WebViewStyleExample: Story = {
  name: "Recipe/WebView Style",
  render: () => <WebViewStyleDemo />,
};

function TypeAndClearInteractionDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        placeholder="검색어를 입력해주세요"
        clearable
      />
    </div>
  );
}

function SearchCallbackInteractionDemo() {
  const [value, setValue] = useState("번아웃");
  const [result, setResult] = useState("");

  return (
    <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 12 }}>
      <SearchInput
        label="검색"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
        onSearch={() => setResult(`"${value}" 검색 실행`)}
        placeholder="검색어를 입력해주세요"
        showSearchButton
        helperText="검색 버튼 또는 Enter 키로 실행됩니다"
      />
      {result && (
        <p data-testid="search-result" style={{ margin: 0, fontSize: 14 }}>
          {result}
        </p>
      )}
    </div>
  );
}

/* ─── Interaction Tests ─── */

export const TypeAndClearInteraction: Story = {
  name: "Interaction/Type And Clear",
  render: () => <TypeAndClearInteractionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("검색어를 입력해주세요");
    const user = createInteractionUser();

    await user.type(input, "스트레스 관리");
    await expect(input).toHaveValue("스트레스 관리");
    await pause();

    const clearButton = canvas.getByRole("button", { name: /지우기|clear|삭제/i });
    await user.click(clearButton);
    await expect(input).toHaveValue("");
  },
};

export const SearchCallbackInteraction: Story = {
  name: "Interaction/Search Callback Fires",
  render: () => <SearchCallbackInteractionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const searchButton = canvas.getByRole("button", { name: /검색/i });
    await user.click(searchButton);

    await expect(canvas.getByTestId("search-result")).toHaveTextContent('"번아웃" 검색 실행');
  },
};

export const AccessibilityBehavior: Story = {
  name: "Interaction/Accessibility Behavior",
  render: () => <SearchCallbackInteractionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = createInteractionUser();

    const searchbox = canvas.getByRole("searchbox", { name: "검색" });
    await expect(searchbox).toBeInTheDocument();
    await expect(searchbox).toHaveAttribute("aria-describedby");
    await expect(canvas.getByText("검색 버튼 또는 Enter 키로 실행됩니다")).toBeInTheDocument();

    await user.type(searchbox, "수면");
    await pause();

    await expect(canvas.getByRole("button", { name: "검색어 지우기" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "검색" })).toBeInTheDocument();

    await user.keyboard("{Enter}");
    await expect(canvas.getByTestId("search-result")).toHaveTextContent('"수면" 검색 실행');
  },
};

export const ErrorAccessibilityBehavior: Story = {
  name: "Interaction/Error Accessibility",
  render: () => (
    <div style={{ width: 360 }}>
      <SearchInput
        label="통합 검색"
        value="@@@"
        readOnly
        error
        errorMessage="검색어 형식이 올바르지 않습니다"
        placeholder="검색어를 입력해주세요"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchbox = canvas.getByRole("searchbox", { name: "통합 검색" });

    await expect(searchbox).toHaveAttribute("aria-invalid", "true");
    await expect(searchbox).toHaveAttribute("aria-describedby");
    await expect(canvas.getByText("검색어 형식이 올바르지 않습니다")).toBeInTheDocument();
  },
};
