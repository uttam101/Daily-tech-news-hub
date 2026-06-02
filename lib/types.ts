export type NewsSource =
  | "HackerNews"
  | "TechCrunch"
  | "TheVerge"
  | "ArsTechnica"
  | "ProductHunt"
  | "DevTo"
  | "Wired"
  | "VentureBeat";

export type NewsCategory = "AI/LLM" | "Products" | "Dev" | "General";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource;
  category: NewsCategory;
  publishedAt: string;
  points?: number;
  comments?: number;
  summary?: string;
  imageUrl?: string;
  author?: string;
}

export interface NewsResponse {
  items: NewsItem[];
  fetchedAt: string;
  errors: string[];
}
