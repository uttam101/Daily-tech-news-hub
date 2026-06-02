"use client";

import { useState, useMemo } from "react";
import { NewsItem, NewsCategory } from "@/lib/types";
import { NewsCard, NewsCardSkeleton } from "./NewsCard";
import { FilterBar, FilterCategory, FilterSource } from "./FilterBar";
import { SearchBar } from "./SearchBar";
import { Newspaper } from "lucide-react";

interface NewsFeedProps {
  items: NewsItem[];
  isLoading?: boolean;
}

function buildCounts(items: NewsItem[]): Record<FilterCategory, number> {
  const counts: Record<FilterCategory, number> = {
    All: items.length,
    "AI/LLM": 0,
    Products: 0,
    Dev: 0,
    General: 0,
  };
  for (const item of items) {
    counts[item.category as NewsCategory]++;
  }
  return counts;
}

export function NewsFeed({ items, isLoading = false }: NewsFeedProps) {
  const [category, setCategory] = useState<FilterCategory>("All");
  const [source, setSource] = useState<FilterSource>("All");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => buildCounts(items), [items]);

  const filtered = useMemo(() => {
    let result = items;

    if (category !== "All") {
      result = result.filter((i) => i.category === category);
    }
    if (source !== "All") {
      result = result.filter((i) => i.source === source);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.summary ?? "").toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, category, source, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <FilterBar
          activeCategory={category}
          activeSource={source}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          counts={counts}
        />
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400 dark:text-gray-600">
          <Newspaper className="w-12 h-12" />
          <p className="text-base font-medium">No stories found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing {filtered.length} of {items.length} stories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
