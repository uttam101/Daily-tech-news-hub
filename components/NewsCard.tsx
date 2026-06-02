"use client";

import { NewsItem, NewsSource, NewsCategory } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SOURCE_CONFIG: Record<
  NewsSource,
  { label: string; bg: string; text: string; dot: string }
> = {
  HackerNews: {
    label: "Hacker News",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  TechCrunch: {
    label: "TechCrunch",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    dot: "bg-green-500",
  },
  TheVerge: {
    label: "The Verge",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  ArsTechnica: {
    label: "Ars Technica",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
  ProductHunt: {
    label: "Product Hunt",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  DevTo: {
    label: "Dev.to",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  Wired: {
    label: "Wired",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-700 dark:text-zinc-300",
    dot: "bg-zinc-500",
  },
  VentureBeat: {
    label: "VentureBeat",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    text: "text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
};

const CATEGORY_CONFIG: Record<NewsCategory, { label: string; style: string }> = {
  "AI/LLM": {
    label: "AI / LLM",
    style:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  },
  Products: {
    label: "Products",
    style: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  },
  Dev: {
    label: "Dev",
    style: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  },
  General: {
    label: "General",
    style: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
};

function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="flex justify-between pt-1">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function NewsCard({ item }: { item: NewsItem }) {
  const source = SOURCE_CONFIG[item.source];
  const category = CATEGORY_CONFIG[item.category];
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-200"
    >
      {item.imageUrl && !imgError && (
        <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            unoptimized
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${source.bg} ${source.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${source.dot}`} />
            {source.label}
          </span>
          <span
            className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${category.style}`}
          >
            {category.label}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>

        {item.summary && (
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
            {item.summary}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-1 mt-auto border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {item.points != null && (
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {item.points}
              </span>
            )}
            {item.comments != null && item.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {item.comments}
              </span>
            )}
            {item.author && (
              <span className="truncate max-w-[80px]">{item.author}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span>{timeAgo(item.publishedAt)}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </a>
  );
}
