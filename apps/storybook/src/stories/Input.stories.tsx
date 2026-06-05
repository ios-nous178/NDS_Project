import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Input, type InputProps } from "@nudge-design/react";
import { SearchIcon } from "@nudge-design/icons";
import { getComponentDocsDescription } from "../componentDocs";
import { createInteractionUser, pause } from "./interactionTest";

const meta: Meta<InputProps> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("Input"),
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["default", "field", "compact"],
    },
    error: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    label: "이메일",
    placeholder: "이메일을 입력해주세요",
    helperText: "가입한 이메일 주소를 입력해주세요",
    clearable: true,
    fullWidth: true,
  },
};

export default meta;
type Story = StoryObj<InputProps>;

function SearchIconGlyph() {
  return <SearchIcon color="#111111" aria-hidden="true" />;
}

export const Playground: Story = {
  decorators: [
    (StoryComponent) => (
      <div style={{ width: 360 }}>
        <StoryComponent />
      </div>
    ),
  ],
};

/* ─── Figma Spec (430:4212 / 171:9903 / Section_Input 294:12) ─── */

const INPUT_SPEC_ROWS: Array<{ key: string; value: string }> = [
  { key: "사이즈 (default / field)", value: "높이 48 / 44px" },
  { key: "Wrapper padding-X", value: "16px" },
  { key: "Wrapper 텍스트 ↔ 아이콘 gap", value: "10px" },
  { key: "Wrapper radius", value: "8px (radius.md)" },
  { key: "Label ↔ Wrapper gap", value: "12px (default) / 8px (field)" },
  { key: "Wrapper ↔ Helper gap", value: "8px (disabled 12px)" },
  { key: "Helper 그룹 column gap", value: "12px" },
  { key: "Helper 아이콘", value: "16×16, color 부모 상속" },
];

const HELPER_VARIANT_ROWS: Array<{
  variant: string;
  token: string;
  color: string;
  usage: string;
}> = [
  { variant: "default", token: "Text/Muted/Default", color: "#999999", usage: "일반 도움말" },
  { variant: "success", token: "Text/Brand/Default", color: "#2B96ED", usage: "폼 검증 통과" },
  { variant: "error", token: "Text/Status/Error", color: "#F13F00", usage: "폼 오류" },
  { variant: "disabled", token: "Text/Disabled/Default", color: "#C7C7C7", usage: "비활성" },
];

export const FigmaSpec: StoryObj<InputProps> = {
  name: "Spec/✓ Figma Synced (430:4212)",
  parameters: {
    docs: {
      description: {
        story:
          "Figma 컴포넌트(430:4212) 및 라이브러리 노드(171:9903), Section_Input(294:12) 기준 실측 스펙. 코드는 `packages/react/src/Input.tsx`에서 단일 소스로 관리됩니다.",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minWidth: 560,
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#F5F5F5" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              사이즈/간격 항목
            </th>
            <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
              값
            </th>
          </tr>
        </thead>
        <tbody>
          {INPUT_SPEC_ROWS.map((row) => (
            <tr key={row.key}>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5", fontWeight: 600 }}>
                {row.key}
              </td>
              <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14 }}>
          Helper variant 컬러 (Section_Input 294:12)
        </p>
        <table style={{ borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F5F5F5" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
                variant
              </th>
              <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
                토큰
              </th>
              <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
                컬러
              </th>
              <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #E5E5E5" }}>
                용도
              </th>
            </tr>
          </thead>
          <tbody>
            {HELPER_VARIANT_ROWS.map((row) => (
              <tr key={row.variant}>
                <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5", fontWeight: 600 }}>
                  {row.variant}
                </td>
                <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.token}</td>
                <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: row.color,
                      verticalAlign: "middle",
                      marginRight: 6,
                      border: "1px solid #E5E5E5",
                    }}
                  />
                  <code>{row.color}</code>
                </td>
                <td style={{ padding: "8px 12px", border: "1px solid #E5E5E5" }}>{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
};

export const HelperVariants: StoryObj<InputProps> = {
  name: "State/Helper Variants",
  parameters: {
    docs: {
      description: {
        story:
          "Section_Input 294:12 정합화 후 추가된 helper variant 4종. Banner/Toast의 녹색 success와 구분되도록 success는 브랜드 톤(파랑)을 사용합니다.",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "flex",
        width: 360,
        flexDirection: "column",
        gap: "var(--semantic-gap-loose)",
      }}
    >
      <Input label="기본" placeholder="입력해주세요" helperText="일반 도움말 텍스트입니다" />
      <Input.Root>
        <Input.Label>검증 통과</Input.Label>
        <Input.Wrapper>
          <Input.Field value="hello@nudgehealth.co.kr" readOnly />
        </Input.Wrapper>
        <Input.Helper variant="success">사용 가능한 이메일입니다</Input.Helper>
      </Input.Root>
      <Input
        label="에러"
        value="wrong@email"
        errorMessage="올바른 이메일 형식이 아닙니다"
        readOnly
      />
      <Input label="비활성" value="입력 불가" disabled helperText="비활성 상태 안내" />
    </div>
  ),
};

export const States: Story = {
  name: "State/States",
  render: () => (
    <div
      style={{
        display: "flex",
        width: 360,
        flexDirection: "column",
        gap: "var(--semantic-gap-loose)",
      }}
    >
      <Input label="기본 상태" placeholder="입력해주세요" helperText="도움말 텍스트" />
      <Input
        label="에러 상태"
        placeholder="입력해주세요"
        value="wrong@email"
        errorMessage="올바른 이메일 형식을 입력해주세요"
        readOnly
      />
      <Input label="비활성화" placeholder="입력 불가" disabled />
    </div>
  ),
};

function PrefixSuffixDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <Input
        label="검색"
        placeholder="키워드 입력"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        prefix={<SearchIconGlyph />}
        clearable
        onClear={() => setValue("")}
        helperText="prefix/suffix 슬롯 예시입니다. 검색 전용 UI는 SearchInput을, 인증 패턴은 FieldActionRow를 사용하세요."
      />
    </div>
  );
}

export const WithPrefixAndSuffix: Story = {
  name: "Recipe/Prefix Suffix",
  render: () => <PrefixSuffixDemo />,
};

function SignUpStyleDemo() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <div style={{ display: "flex", width: 360, flexDirection: "column", gap: 20 }}>
      <Input
        label="이메일"
        placeholder="example@nudgehealth.co.kr"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        clearable
      />
      <Input
        label="인증번호"
        placeholder="인증번호 6자리"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        helperText="이메일로 전송된 인증번호를 입력해주세요"
      />
    </div>
  );
}

export const SignUpStyleExample: Story = {
  name: "Recipe/Sign Up Style",
  render: () => <SignUpStyleDemo />,
};

function TypingInteractionDemo() {
  const [value, setValue] = useState("");

  return (
    <div style={{ width: 360 }}>
      <Input
        label="테스트 입력"
        placeholder="여기에 입력하세요"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}

function ClearButtonInteractionDemo() {
  const [value, setValue] = useState("삭제할 텍스트");

  return (
    <div style={{ width: 360 }}>
      <Input
        label="지우기 테스트"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        clearable
        onClear={() => setValue("")}
      />
    </div>
  );
}

/**
 * 검색 UI가 필요하면 SearchInput 컴포넌트를 사용하세요.
 * @see Components/SearchInput
 *
 * 입력 + 버튼 조합(인증 등)이 필요하면 FieldActionRow를 사용하세요.
 * @see Components/FieldActionRow
 */

/* ─── Interaction Tests ─── */

export const TypingInteraction: StoryObj<InputProps> = {
  name: "Interaction/Typing",
  render: () => <TypingInteractionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("여기에 입력하세요");
    const user = createInteractionUser();

    await user.click(input);
    await user.type(input, "hello@test.com");
    await expect(input).toHaveValue("hello@test.com");
  },
};

export const ClearButtonInteraction: StoryObj<InputProps> = {
  name: "Interaction/Clear Button",
  render: () => <ClearButtonInteractionDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByDisplayValue("삭제할 텍스트");
    const user = createInteractionUser();

    await expect(input).toHaveValue("삭제할 텍스트");
    await pause();

    const clearButton = canvas.getByRole("button", { name: /지우기|clear|삭제/i });
    await user.click(clearButton);
    await expect(input).toHaveValue("");
  },
};

export const ErrorStateInteraction: StoryObj<InputProps> = {
  name: "Interaction/Error State Display",
  render: () => (
    <div style={{ width: 360 }}>
      <Input
        label="이메일"
        value="wrong-email"
        errorMessage="올바른 이메일 형식을 입력해주세요"
        readOnly
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("올바른 이메일 형식을 입력해주세요")).toBeInTheDocument();
    await expect(canvas.getByDisplayValue("wrong-email")).toBeInTheDocument();
  },
};

export const AccessibilityBehavior: StoryObj<InputProps> = {
  name: "Interaction/Accessibility Behavior",
  render: () => (
    <div style={{ display: "flex", width: 360, flexDirection: "column", gap: 20 }}>
      <Input
        label="이메일"
        placeholder="이메일을 입력해주세요"
        helperText="가입한 이메일 주소를 입력해주세요"
      />
      <Input label="읽기 전용 코드" value="123456" readOnly clearable />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText("이메일")).toHaveAttribute(
      "placeholder",
      "이메일을 입력해주세요",
    );
    await expect(canvas.getByText("가입한 이메일 주소를 입력해주세요")).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: "입력 삭제" })).not.toBeInTheDocument();
  },
};

/* ─── Edge Case Tests ─── */

export const EmptyInputEdge: StoryObj<InputProps> = {
  name: "Edge/Empty Input No Clear Button",
  render: function Render() {
    const [value, setValue] = useState("");

    return (
      <div style={{ width: 360 }}>
        <Input
          label="빈 입력"
          placeholder="아무것도 입력 안 됨"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          clearable
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByPlaceholderText("아무것도 입력 안 됨");
    await expect(input).toHaveValue("");
    await expect(
      canvas.queryByRole("button", { name: /지우기|clear|삭제/i }),
    ).not.toBeInTheDocument();
  },
};

export const DisabledInputEdge: StoryObj<InputProps> = {
  name: "Edge/Disabled Input Rejects Input",
  render: () => (
    <div style={{ width: 360 }}>
      <Input label="비활성" value="변경 불가" disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByDisplayValue("변경 불가");

    await expect(input).toBeDisabled();
    await expect(input).toHaveValue("변경 불가");
  },
};

export const ReadOnlyInputEdge: StoryObj<InputProps> = {
  name: "Edge/ReadOnly Preserves Value",
  render: () => (
    <div style={{ width: 360 }}>
      <Input label="읽기 전용" value="수정 불가" readOnly />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByDisplayValue("수정 불가");

    await expect(input).toHaveAttribute("readonly");
    await expect(input).toHaveValue("수정 불가");
  },
};

export const AriaInvalidDescribedByEdge: StoryObj<InputProps> = {
  name: "Edge/Aria Invalid And DescribedBy",
  render: () => (
    <div style={{ width: 360 }}>
      <Input
        label="이메일"
        value="wrong"
        errorMessage="올바른 이메일 형식을 입력해주세요"
        readOnly
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("이메일");

    // aria-invalid must be "true" in error state
    await expect(input).toHaveAttribute("aria-invalid", "true");

    // aria-describedby must link to the helper/error message
    const describedById = input.getAttribute("aria-describedby");
    await expect(describedById).toBeTruthy();

    const helperEl = document.getElementById(describedById!);
    await expect(helperEl).not.toBeNull();
    await expect(helperEl!.textContent).toBe("올바른 이메일 형식을 입력해주세요");

    // Helper should have role="alert" in error state
    await expect(helperEl).toHaveAttribute("role", "alert");
  },
};

export const AriaDescribedByHelperEdge: StoryObj<InputProps> = {
  name: "Edge/Aria DescribedBy With HelperText",
  render: () => (
    <div style={{ width: 360 }}>
      <Input label="이름" placeholder="이름을 입��하세요" helperText="실명을 입력해주세요" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("이름");

    // No error → aria-invalid should not be present
    await expect(input).not.toHaveAttribute("aria-invalid");

    // aria-describedby should link to helper text
    const describedById = input.getAttribute("aria-describedby");
    await expect(describedById).toBeTruthy();

    const helperEl = document.getElementById(describedById!);
    await expect(helperEl).not.toBeNull();
    await expect(helperEl!.textContent).toBe("실명을 입력해주세요");

    // Helper should NOT have role="alert" when not in error state
    await expect(helperEl).not.toHaveAttribute("role");
  },
};

function PasswordToggleDemo() {
  const [pw, setPw] = useState("super-secret");
  return (
    <div style={{ width: 360 }}>
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        helperText="우측 눈 아이콘으로 표시/숨김을 전환할 수 있습니다."
      />
    </div>
  );
}

export const PasswordToggle: StoryObj<InputProps> = {
  name: "Recipe/Password Toggle",
  parameters: {
    docs: {
      description: {
        story:
          'type="password" 면 우측에 눈 아이콘 토글이 자동 노출됩니다 (auth/로그인 화면용). 끄려면 passwordToggle={false}. 아이콘은 DS eye/eye-off 와 동일.',
      },
    },
  },
  render: () => <PasswordToggleDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText("비밀번호") as HTMLInputElement;
    await expect(field).toHaveAttribute("type", "password");

    const toggle = canvas.getByRole("button", { name: "비밀번호 표시" });
    const user = createInteractionUser();
    await user.click(toggle);
    await expect(field).toHaveAttribute("type", "text");
    await expect(canvas.getByRole("button", { name: "비밀번호 숨기기" })).toBeInTheDocument();
  },
};
