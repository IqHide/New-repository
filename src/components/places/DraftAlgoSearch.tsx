/* eslint-disable */
// @ts-nocheck
// just file for example
const CATEGORY_CONFIG = {
  airports: { maxResults: 5, minScore: 0.3, priority: 1 },
  stations: { maxResults: 2, minScore: 0.4, priority: 2 },
  ports: { maxResults: 1, minScore: 0.4, priority: 2 },
  hotels: { maxResults: 2, minScore: 0.2, priority: 3 }, // всегда 2
  places: { maxResults: 2, minScore: 0.5, priority: 4 }, // появляются при точном запросе
} as const;

const TOTAL_LIMIT = 9;

function getAutocomplete(query: string): CategoryResults {
  const results: CategoryResults = {};
  let totalCount = 0;

  // Сортируем категории по приоритету
  const sortedCategories = Object.entries(CATEGORY_CONFIG)
    .sort(([, a], [, b]) => a.priority - b.priority);

  for (const [category, config] of sortedCategories) {
    if (totalCount >= TOTAL_LIMIT) break;

    const remaining = TOTAL_LIMIT - totalCount;
    const limit = Math.min(config.maxResults, remaining);

    const matches = searchCategory(category, query)
      .filter(item => item.relevanceScore >= config.minScore)
      .slice(0, limit);

    if (matches.length > 0) {
      results[category] = matches;
      totalCount += matches.length;
    }
  }

  return results;
}

function scoreItem(item: SearchItem, query: string): number {
  const name = item.name.toLowerCase();
  const q = query.toLowerCase();

  if (name.startsWith(q)) return 1.0;           // точный префикс
  if (name.includes(q)) return 0.7;             // вхождение в середине
  if (fuzzyMatch(name, q)) return 0.4;          // нечёткое совпадение
  return 0;
}