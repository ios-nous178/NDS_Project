import { describe, expect, it } from "vitest";
import { TOOL_DEFINITIONS, validateToolArgsForTest, type ToolArgs } from "../src/tools/registry.js";

type SchemaProperty = {
  type?: string | readonly string[];
  enum?: readonly string[];
  items?: SchemaProperty;
};

type ToolDefinition = {
  name: string;
  inputSchema: {
    properties?: Readonly<Record<string, SchemaProperty>>;
  };
};

function sampleForProperty(property: SchemaProperty): unknown {
  if (property.enum?.length) return property.enum[0];

  const type = Array.isArray(property.type) ? property.type[0] : property.type;
  switch (type) {
    case "boolean":
      return true;
    case "number":
      return 1;
    case "array":
      return [sampleForProperty(property.items ?? { type: "string" })];
    case "object":
      return {};
    case "string":
    default:
      return "sample";
  }
}

function sampleArgsForTool(tool: ToolDefinition): ToolArgs {
  return Object.fromEntries(
    Object.entries(tool.inputSchema.properties ?? {}).map(([key, property]) => [
      key,
      sampleForProperty(property),
    ]),
  );
}

describe("tool registry argument validation", () => {
  it("passes every declared schema property through to handlers", () => {
    for (const tool of TOOL_DEFINITIONS as readonly ToolDefinition[]) {
      const args = sampleArgsForTool(tool);
      const validated = validateToolArgsForTest(tool.name, args);

      for (const key of Object.keys(tool.inputSchema.properties ?? {})) {
        expect(validated, `${tool.name}.${key}`).toHaveProperty(key);
        expect(validated[key], `${tool.name}.${key}`).not.toBeUndefined();
      }
    }
  });
});
