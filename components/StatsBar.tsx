"use client";

import { NewsItem, NewsSource } from "@/lib/types";

const SOURCE_COLORS: Record<NewsSource, string> = {
  HackerNews: "bg-orange-500",
  TechCrunch: "bg-green-500",
  TheVerge: "bg-violet-500",
  ArsTechnica: "bg-red-500",
  ProductHunt: "bg-amber-500",
  DevTo: "bg-blue-500",
  Wired: "bg-zinc-500",
  VentureBeat: "bg-sky-500",
};

const SOURCE_LABELS: Record<NewsSource, string> = {
  HackerNews: "HN",
  TechCrunch: "TC",
  TheVerge: "Verge",
  ArsTechnica: "Ars",
  ProductHunt: "PH",
  DevTo: "Dev.to",
  Wired: "Wired",
  VentureBeat: "VB",
};

export function StatsBar({ items }: { items: NewsItem[] }) {
  const sourceMap: Partial<Record<NewsSource, number>> = {};
  for (const item of items) {
    sourceMap[item.source] = (sourceMap[item.source] ?? 0) + 1;
  }

  const sorted = (Object.entries(sourceMap) as [NewsSource, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  if (sorted.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center text-xs">
      {sorted.map(([src, count]) => (
        <span
          key={src}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          <span className={`w-2 h-2 rounded-full ${SOURCE_COLORS[src]}`} />
          {SOURCE_LABELS[src]}
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            {count}
          </span>
        </span>
      ))}
    </div>
  );
}
