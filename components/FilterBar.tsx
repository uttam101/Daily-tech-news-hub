"use client";

import { NewsCategory, NewsSource } from "@/lib/types";
import { Brain, Package, Code2, Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type FilterCategory = "All" | NewsCategory;
export type FilterSource = "All" | NewsSource;

interface FilterBarProps {
  activeCategory: FilterCategory;
  activeSource: FilterSource;
  onCategoryChange: (c: FilterCategory) => void;
  onSourceChange: (s: FilterSource) => void;
  counts: Record<FilterCategory, number>;
}

const CATEGORIES: { id: FilterCategory; label: string; icon: React.ReactNode }[] =
  [
    { id: "All", label: "All", icon: <Globe className="w-3.5 h-3.5" /> },
    { id: "AI/LLM", label: "AI / LLM", icon: <Brain className="w-3.5 h-3.5" /> },
    { id: "Products", label: "Products", icon: <Package className="w-3.5 h-3.5" /> },
    { id: "Dev", label: "Dev", icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: "General", label: "General", icon: <Globe className="w-3.5 h-3.5" /> },
  ];

const SOURCES: FilterSource[] = [
  "All",
  "HackerNews",
  "TechCrunch",
  "TheVerge",
  "ArsTechnica",
  "Wired",
  "VentureBeat",
  "DevTo",
];

const SOURCE_LABELS: Record<FilterSource, string> = {
  All: "All Sources",
  HackerNews: "Hacker News",
  TechCrunch: "TechCrunch",
  TheVerge: "The Verge",
  ArsTechnica: "Ars Technica",
  Wired: "Wired",
  VentureBeat: "VentureBeat",
  DevTo: "Dev.to",
  ProductHunt: "Product Hunt",
};

export function FilterBar({
  activeCategory,
  activeSource,
  onCategoryChange,
  onSourceChange,
  counts,
}: FilterBarProps) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSourceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                active
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {cat.icon}
              {cat.label}
              {counts[cat.id] != null && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {counts[cat.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setSourceOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {SOURCE_LABELS[activeSource]}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${sourceOpen ? "rotate-180" : ""}`}
          />
        </button>

        {sourceOpen && (
          <div className="absolute left-0 top-full mt-2 z-20 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            {SOURCES.map((src) => (
              <button
                key={src}
                onClick={() => {
                  onSourceChange(src);
                  setSourceOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                  activeSource === src
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {SOURCE_LABELS[src]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
