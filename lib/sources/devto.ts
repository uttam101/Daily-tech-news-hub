import { NewsItem } from "../types";
import { assignCategory } from "../categoryUtils";

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  published_at: string;
  tag_list: string[];
  user: { name: string };
  positive_reactions_count: number;
  comments_count: number;
}

const AI_TAGS = ["ai", "machinelearning", "llm", "openai", "artificialintelligence"];
const DEV_TAGS = ["javascript", "typescript", "python", "webdev", "programming", "tutorial"];

async function fetchByTag(tag: string, limit: number): Promise<DevToArticle[]> {
  const res = await fetch(
    `https://dev.to/api/articles?tag=${tag}&per_page=${limit}&top=1`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDevTo(limit = 20): Promise<NewsItem[]> {
  const [aiArticles, devArticles] = await Promise.allSettled([
    Promise.all(AI_TAGS.map((t) => fetchByTag(t, 5))).then((r) => r.flat()),
    Promise.all(DEV_TAGS.slice(0, 3).map((t) => fetchByTag(t, 4))).then((r) => r.flat()),
  ]);

  const allArticles: DevToArticle[] = [
    ...(aiArticles.status === "fulfilled" ? aiArticles.value : []),
    ...(devArticles.status === "fulfilled" ? devArticles.value : []),
  ];

  const seen = new Set<number>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  return unique
    .sort((a, b) => b.positive_reactions_count - a.positive_reactions_count)
    .slice(0, limit)
    .map((article) => ({
      id: `devto-${article.id}`,
      title: article.title,
      url: article.url,
      source: "DevTo" as const,
      category: assignCategory(article.title + " " + article.tag_list.join(" ")),
      publishedAt: article.published_at,
      summary: article.description?.slice(0, 200) || undefined,
      imageUrl: article.cover_image ?? undefined,
      author: article.user.name,
      points: article.positive_reactions_count,
      comments: article.comments_count,
    }));
}
