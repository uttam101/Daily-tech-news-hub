import { NewsItem } from "../types";
import { assignCategory } from "../categoryUtils";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants?: number;
  by: string;
  time: number;
  text?: string;
}

export async function fetchHackerNews(limit = 20): Promise<NewsItem[]> {
  const topRes = await fetch(`${HN_BASE}/topstories.json`, {
    next: { revalidate: 300 },
  });
  const ids: number[] = await topRes.json();
  const topIds = ids.slice(0, 40);

  const stories = await Promise.allSettled(
    topIds.map((id) =>
      fetch(`${HN_BASE}/item/${id}.json`, {
        next: { revalidate: 300 },
      }).then((r) => r.json() as Promise<HNStory>)
    )
  );

  const valid = stories
    .filter(
      (s): s is PromiseFulfilledResult<HNStory> =>
        s.status === "fulfilled" && s.value?.url != null && s.value?.title != null
    )
    .map((s) => s.value)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return valid.map((story) => ({
    id: `hn-${story.id}`,
    title: story.title,
    url: story.url!,
    source: "HackerNews" as const,
    category: assignCategory(story.title),
    publishedAt: new Date(story.time * 1000).toISOString(),
    points: story.score,
    comments: story.descendants ?? 0,
    author: story.by,
  }));
}
