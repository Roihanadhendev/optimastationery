"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@/types";

interface CatalogSidebarProps {
    categories: Category[];
    selectedCategories: string[];
}

export function CatalogSidebar({
    categories,
    selectedCategories,
}: CatalogSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const toggleCategory = useCallback(
        (slug: string) => {
            const params = new URLSearchParams(searchParams.toString());
            const current = params.getAll("category");

            if (current.includes(slug)) {
                params.delete("category");
                current
                    .filter((c) => c !== slug)
                    .forEach((c) => params.append("category", c));
            } else {
                params.append("category", slug);
            }

            router.push(`/catalog?${params.toString()}`, { scroll: false });
        },
        [router, searchParams]
    );

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">
                    Kategori
                </h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <label
                            key={category.id}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.slug)}
                                onChange={() => toggleCategory(category.slug)}
                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 focus:ring-2 transition-colors"
                            />
                            <span className="text-sm text-slate-700 group-hover:text-primary transition-colors font-medium">
                                {category.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}
