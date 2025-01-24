import { describe, it, expect } from "vitest";
import { performSearch } from "./search";
import { sampleItems, defaultPriorities } from "../data/sampleItems";

describe("performSearch", () => {
  it("returns empty array for empty query", () => {
    const result = performSearch("", sampleItems, defaultPriorities);
    expect(result).toEqual([]);
  });

  it("returns empty array for whitespace query", () => {
    const result = performSearch("   ", sampleItems, defaultPriorities);
    expect(result).toEqual([]);
  });

  it("finds exact name matches with highest priority", () => {
    const result = performSearch("React Hooks", sampleItems, defaultPriorities);
    expect(result[0].id).toBe(1);
    expect(result[0].score).toBeGreaterThan(5);
  });

  it("finds partial name matches", () => {
    const result = performSearch("React", sampleItems, defaultPriorities);
    expect(result[0].id).toBe(1);
  });

  it("finds matches in tags", () => {
    const result = performSearch("javascript", sampleItems, defaultPriorities);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toContain(1);
    expect(result.map((r) => r.id)).toContain(2);
  });

  it("finds matches in text content", () => {
    const result = performSearch("layout", sampleItems, defaultPriorities);
    expect(result[0].id).toBe(3);
  });

  it("orders results by score", () => {
    const result = performSearch("typescript", sampleItems, defaultPriorities);
    expect(result[0].id).toBe(2); // TypeScript in name should rank higher
  });

  it("respects priority order changes", () => {
    const reorderedPriorities = [
      { id: "tag-match", label: "Tag match" },
      { id: "exact-name", label: "Exact name match" },
      { id: "partial-name", label: "Partial name match" },
      { id: "text-match", label: "Text content match" },
    ];

    const defaultResult = performSearch(
      "javascript",
      sampleItems,
      defaultPriorities
    );
    const reorderedResult = performSearch(
      "javascript",
      sampleItems,
      reorderedPriorities
    );

    expect(defaultResult[0].score).not.toBe(reorderedResult[0].score);
  });
});
