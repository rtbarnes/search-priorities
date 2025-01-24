export type SearchableItem = {
  id: number;
  name: string;
  text: string;
  tags: string[];
};

export type SearchPriority = {
  id: string;
  label: string;
};

export type PriorityId =
  | "exact-name"
  | "exact-text"
  | "partial-name"
  | "tag-match"
  | "text-match";

export type ScoredItem<T extends SearchableItem> = T & {
  score: number;
};

export function performSearch<T extends SearchableItem>(
  query: string,
  items: T[],
  priorities: SearchPriority[]
): ScoredItem<T>[] {
  if (!query.trim()) {
    return [];
  }

  const scoredResults = items.map((item) => {
    let score = 0;
    const searchQuery = query.toLowerCase();

    // Apply each priority with decreasing score based on order
    priorities.forEach((priority, index) => {
      const priorityScore = Math.pow(0.8, index);

      switch (priority.id) {
        case "exact-name":
          if (item.name.toLowerCase() === searchQuery) {
            score += priorityScore;
          }
          break;
        case "exact-text":
          if (item.text.toLowerCase() === searchQuery) {
            score += priorityScore;
          }
          break;
        case "partial-name":
          if (item.name.toLowerCase().includes(searchQuery)) {
            score += priorityScore;
          }
          break;
        case "tag-match":
          if (
            item.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
          ) {
            score += priorityScore;
          }
          break;
        case "text-match":
          if (item.text.toLowerCase().includes(searchQuery)) {
            score += priorityScore;
          }
          break;
      }
    });

    return { ...item, score };
  });

  return scoredResults
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}
