import Parser from "rss-parser";
import { NewsItem, NewsSource } from "../types";
import { assignCategory } from "../categoryUtils";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "TechNewsDashboard/1.0" },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure"],
    ],
  },
});

export interface RssConfig {
  source: NewsSource;
  url: string;
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImage(item: Parser.Item & Record<string, any>): string | undefined {
  const mc = item.mediaContent as { $?: { url?: string } } | undefined;
  if (mc?.$?.url) return mc.$.url;

  const mt = item.mediaThumbnail as { $?: { url?: string } } | undefined;
  if (mt?.$?.url) return mt.$.url;

  const enc = item.enclosure as { url?: string } | undefined;
  if (enc?.url && /\.(jpg|jpeg|png|webp|gif)/i.test(enc.url)) return enc.url;

  const content = (item.content ?? item["content:encoded"] ?? "") as string;
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];

  return undefined;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

export async function fetchRssFeed(config: RssConfig): Promise<NewsItem[]> {
  const feed = await parser.parseURL(config.url);
  const limit = config.limit ?? 15;

  return feed.items.slice(0, limit).map((item, idx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extItem = item as unknown as Parser.Item & Record<string, any>;
    const raw = item.contentSnippet ?? item.summary ?? item.content ?? "";
    const summary = typeof raw === "string" ? stripHtml(raw) : undefined;

    return {
      id: `${config.source.toLowerCase()}-${item.guid ?? item.link ?? idx}`,
      title: item.title ?? "Untitled",
      url: item.link ?? "#",
      source: config.source,
      category: assignCategory(item.title ?? ""),
      publishedAt: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      summary: summary || undefined,
      imageUrl: extractImage(extItem),
      author: item.creator ?? undefined,
    };
  });
}

export const RSS_FEEDS: RssConfig[] = [
  { source: "TechCrunch", url: "https://techcrunch.com/feed/", limit: 15 },
  { source: "TheVerge", url: "https://www.theverge.com/rss/index.xml", limit: 15 },
  { source: "ArsTechnica", url: "https://feeds.arstechnica.com/arstechnica/index", limit: 12 },
  { source: "Wired", url: "https://www.wired.com/feed/rss", limit: 12 },
  { source: "VentureBeat", url: "https://venturebeat.com/feed/", limit: 12 },
];
