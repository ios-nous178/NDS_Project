import { describe, expect, it } from "vitest";
import { validateMockupSource } from "../src/tools/mockup-validator";

function rulesFor(source: string, intent: "user-app" | "admin-cms" = "user-app") {
  return validateMockupSource(source, { intent }).map((violation) => violation.rule);
}

describe("validateMockupSource", () => {
  it("flags inline colors", () => {
    expect(rulesFor(`const style = { color: "#FF0000" };`)).toContain("inline-color");
  });

  it("flags native form controls in user-app mockups", () => {
    expect(rulesFor(`export function Demo() { return <button>Submit</button>; }`)).toContain(
      "native-element",
    );
  });

  it("flags antd imports for user-app mockups", () => {
    const source = `import { Button } from "antd";`;
    expect(rulesFor(source, "user-app")).toContain("antd-import-in-user-app");
  });

  it("allows antd imports for admin-cms mockups", () => {
    const source = `import { Button } from "antd";`;
    expect(rulesFor(source, "admin-cms")).not.toContain("antd-import-in-user-app");
  });

  it("flags Chip usage without the required label prop", () => {
    const source = `
      import { Chip } from "@nudge-eap/react";

      export function Demo() {
        return <Chip>New</Chip>;
      }
    `;

    expect(rulesFor(source)).toContain("chip-missing-label");
  });

  it("flags multiple primary solid CTAs", () => {
    const source = `
      import { Button } from "@nudge-eap/react";

      export function Demo() {
        return (
          <>
            <Button color="primary">Start</Button>
            <Button color="primary">Continue</Button>
          </>
        );
      }
    `;

    expect(rulesFor(source)).toContain("primary-cta-overuse");
  });
});
