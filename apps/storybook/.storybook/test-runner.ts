import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { injectAxe, checkA11y } from "axe-playwright";

/**
 * Storybook test-runner configuration with axe accessibility testing.
 *
 * Every story is automatically checked for WCAG 2.1 AA violations including:
 * - Color contrast ratios (color-contrast rule)
 * - ARIA attribute correctness
 * - Keyboard navigation requirements
 * - Form label associations
 *
 * Stories can opt out via parameters:
 *   parameters: { a11y: { disable: true } }
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // Skip a11y check if explicitly disabled for this story
    if (storyContext.parameters?.a11y?.disable) {
      return;
    }

    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      axeOptions: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
        },
        rules: {
          // Ensure color contrast is checked (WCAG AA)
          "color-contrast": { enabled: true },
          // Ensure form elements have labels
          label: { enabled: true },
          // Ensure ARIA attributes are valid
          "aria-valid-attr": { enabled: true },
          "aria-valid-attr-value": { enabled: true },
          // Ensure required ARIA relationships
          "aria-required-attr": { enabled: true },
          "aria-required-children": { enabled: true },
          "aria-required-parent": { enabled: true },
        },
      },
    });
  },
};

export default config;
