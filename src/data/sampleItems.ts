import { SearchableItem, SearchPriority } from "../utils/search";

export const sampleItems: SearchableItem[] = [
  {
    id: 1,
    name: "Save Changes CTA",
    text: "Save Changes",
    tags: ["CTA"],
  },
  {
    id: 2,
    name: "Cancel CTA",
    text: "Cancel",
    tags: ["CTA"],
  },
  {
    id: 3,
    name: "Cancel Subscription",
    text: "Are you sure you want to cancel your subscription?",
    tags: ["Form"],
  },
  {
    id: 4,
    name: "Acronym",
    text: "CTA",
    tags: [],
  },
  {
    id: 5,
    name: "Motto",
    text: "Always be saving!",
    tags: [],
  },
  {
    id: 6,
    name: "Header 1",
    text: "User Preferences",
    tags: ["Form"],
  },
  {
    id: 7,
    name: "Changes",
    text: "Expect changes in your future!",
    tags: [],
  },
];

export const defaultPriorities: SearchPriority[] = [
  { id: "exact-name", label: "Exact name match" },
  { id: "partial-name", label: "Partial name match" },
  { id: "tag-match", label: "Tag match" },
  { id: "text-match", label: "Text content match" },
];
