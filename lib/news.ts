import { fetchHackerNews } from "./sources/hackernews";
import { fetchRssFeed, RSS_FEEDS } from "./sources/rss";
import { fetchDevTo } from "./sources/devto";
import { NewsResponse } from "./types";

export async function aggregateNews(): Promise<NewsResponse> {
  const errors: string[] = [];

  const results = await Promise.allSettled([
    fetchHackerNews(20),
    ...RSS_FEEDS.map((feed) => fetchRssFeed(feed)),
    fetchDevTo(20),
  ]);

  const allItems = results.flatMap((result, idx) => {
    if (result.status === "fulfilled") return result.value;
    const sourceName =
      idx === 0
        ? "HackerNews"
        : idx <= RSS_FEEDS.length
        ? RSS_FEEDS[idx - 1].source
        : "DevTo";
    errors.push(`${sourceName}: ${(result.reason as Error)?.message ?? "fetch failed"}`);
    return [];
  });

  const seen = new Set<string>();
  const unique = allItems.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  unique.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return { items: unique, fetchedAt: new Date().toISOString(), errors };
}
