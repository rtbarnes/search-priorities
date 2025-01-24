import { describe, it, expect } from "vitest";
import { performSearch, SearchableItem, SearchPriority } from "./search";

export const sampleItems: SearchableItem[] = [
  {
    id: 1,
    name: "Save Changes CTA",
    text: "Save changes",
    tags: ["button", "form"],
  },
  {
    id: 2,
    name: "Cancel Changes CTA",
    text: "Cancel changes",
    tags: ["button", "form"],
  },
  {
    id: 3,
    name: "Save form copy",
    text: "Make sure to save the form before you leave",
    tags: ["form", "copy"],
  },
  {
    id: 4,
    name: "Header",
    text: "User Preferences",
    tags: ["header", "user"],
  },
];

export const defaultPriorities: SearchPriority[] = [
  { id: "exact-name", label: "Exact name match" },
  { id: "partial-name", label: "Partial name match" },
  { id: "tag-match", label: "Tag match" },
  { id: "text-match", label: "Text content match" },
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
    const result = performSearch(
      "Save Changes CTA",
      sampleItems,
      defaultPriorities
    );
    expect(result[0].id).toBe(1);
    expect(result[0].score).toBeGreaterThan(result[1]?.score || 0);
  });

  it("finds partial name matches", () => {
    const result = performSearch("Changes", sampleItems, defaultPriorities);
    // Should find both items with "Changes" in the name first
    expect(
      result
        .slice(0, 2)
        .map((r) => r.id)
        .sort()
    ).toEqual([1, 2]);
  });

  it("finds matches in tags", () => {
    const result = performSearch("form", sampleItems, defaultPriorities);
    // Should find all items with "form" tag
    expect(result.map((r) => r.id).sort()).toEqual([1, 2, 3]);
  });

  it("finds matches in text content", () => {
    const result = performSearch("save", sampleItems, defaultPriorities);
    // Items with "save" in text or name
    expect(result.map((r) => r.id).sort()).toEqual([1, 3]);
  });

  it("prioritizes name matches over tag matches", () => {
    const result = performSearch("save", sampleItems, defaultPriorities);
    expect(result[0].id).toBe(1); // "Save Changes CTA"
    expect(result[1].id).toBe(3); // "Save form copy"
  });

  it("finds matches across different fields", () => {
    const result = performSearch("user", sampleItems, defaultPriorities);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(4); // Only item with "user" in any field
  });
});
