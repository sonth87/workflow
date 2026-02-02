import { describe, it, expect, beforeEach, vi } from "vitest";
import { NodeRegistry } from "../NodeRegistry";
import type { BaseNodeConfig } from "../../types/base.types";

describe("NodeRegistry", () => {
  let registry: NodeRegistry;

  beforeEach(() => {
    registry = new NodeRegistry();
  });

  it("should register a node", () => {
    const node: any = {
      id: "test-node",
      type: "test-node",
      name: "Test Node",
      config: {
        nodeType: "test-node",
        category: "test",
      },
    };

    registry.register(node);
    expect(registry.has("test-node")).toBe(true);
    expect(registry.get("test-node")).toBeDefined();
  });

  it("should handle inheritance", () => {
    const parent: any = {
      id: "parent-node",
      type: "parent-node",
      name: "Parent Node",
      config: {
        nodeType: "parent-node",
        category: "parent",
        properties: { a: 1 },
      },
    };

    const child: any = {
      id: "child-node",
      type: "child-node",
      extends: "parent-node",
      name: "Child Node",
      config: {
        nodeType: "child-node",
        properties: { b: 2 },
      },
    };

    registry.register(parent);
    registry.register(child);

    const resolved = registry.get("child-node");
    expect(resolved).toBeDefined();
    expect(resolved?.config.properties).toEqual({ a: 1, b: 2 });
  });

  it("should detect circular inheritance", () => {
    // Mock console.error to avoid noise
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const nodeA: any = {
      id: "node-a",
      type: "node-a",
      extends: "node-b",
      name: "Node A",
      config: {},
    };

    const nodeB: any = {
      id: "node-b",
      type: "node-b",
      extends: "node-a",
      name: "Node B",
      config: {},
    };

    registry.register(nodeA);
    registry.register(nodeB);

    const resolved = registry.get("node-a");

    // Should detect cycle and return item as is (without resolving parent)
    expect(resolved).toBeDefined();
    // In current implementation, it stops recursion and returns what it has

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Circular inheritance")
    );

    consoleSpy.mockRestore();
  });
});
