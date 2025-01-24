import { SearchableItem, SearchPriority } from "../utils/search";

export const sampleItems: SearchableItem[] = [
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

export const defaultPriorities: SearchPriority[] = [
  { id: "exact-name", label: "Exact name match" },
  { id: "partial-name", label: "Partial name match" },
  { id: "tag-match", label: "Tag match" },
  { id: "text-match", label: "Text content match" },
];
