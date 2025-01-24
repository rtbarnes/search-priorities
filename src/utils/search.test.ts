import { describe, it, expect } from "vitest";
import { performSearch, SearchableItem, SearchPriority } from "./search";

const sampleItems: SearchableItem[] = [
  {
    id: 1,
    name: "React Hooks",
    text: "Understanding React Hooks and their usage",
    tags: ["react", "javascript", "frontend"],
  },
  {
    id: 2,
    name: "TypeScript Basics",
    text: "Introduction to TypeScript fundamentals",
    tags: ["typescript", "javascript"],
  },
  {
    id: 3,
    name: "CSS Grid",
    text: "Modern layout with CSS Grid",
    tags: ["css", "frontend"],
  },
];

const defaultPriorities: SearchPriority[] = [
  { id: "exact-name", label: "Exact name match", weight: 1.0 },
  { id: "partial-name", label: "Partial name match", weight: 0.7 },
  { id: "tag-match", label: "Tag match", weight: 0.5 },
  { id: "text-match", label: "Text content match", weight: 0.3 },
];

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
      { id: "tag-match", label: "Tag match", weight: 1.0 },
      { id: "exact-name", label: "Exact name match", weight: 0.7 },
      { id: "partial-name", label: "Partial name match", weight: 0.5 },
      { id: "text-match", label: "Text content match", weight: 0.3 },
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

    // Scores should be different when priorities are reordered
    expect(defaultResult[0].score).not.toBe(reorderedResult[0].score);
  });
});
