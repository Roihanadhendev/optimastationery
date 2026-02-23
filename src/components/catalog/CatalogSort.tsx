"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types";

const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Terbaru", value: "newest" },
    { label: "Harga Terendah", value: "price-asc" },
    { label: "Harga Tertinggi", value: "price-desc" },
];

interface CatalogSortProps {
    currentSort: SortOption;
}

export function CatalogSort({ currentSort }: CatalogSortProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSort = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", value);
            router.push(`/catalog?${params.toString()}`, { scroll: false });
        },
        [router, searchParams]
    );

    return (
        <div className="relative">
            <label htmlFor="sort-select" className="sr-only">
                Urutkan
            </label>
            <div className="relative">
                <select
                    id="sort-select"
                    value={currentSort}
                    onChange={(e) => handleSort(e.target.value)}
                    className="appearance-none w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
        </div>
    );
}
