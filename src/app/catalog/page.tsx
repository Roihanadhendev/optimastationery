import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/actions";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Package } from "lucide-react";
import type { Product, SortOption } from "@/types";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
    title: "Katalog Produk - Optima Stationery",
    description:
        "Jelajahi katalog lengkap alat tulis kantor dan perlengkapan sekolah dari Optima Stationery. Harga kompetitif, kualitas terjamin.",
};

interface CatalogPageProps {
    searchParams: Promise<{
        category?: string | string[];
        sort?: string;
        search?: string;
    }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
    const params = await searchParams;

    // Parse search params
    const selectedCategories = params.category
        ? Array.isArray(params.category)
            ? params.category
            : [params.category]
        : [];
    const currentSort = (params.sort as SortOption) || "newest";
    const searchQuery = params.search || "";

    // Fetch data in parallel
    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts({
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            sort: currentSort,
            search: searchQuery || undefined,
        }),
    ]);

    return (
        <section className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-2">
                            Katalog Produk
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Temukan alat tulis kantor dan perlengkapan sekolah terlengkap
                            dengan harga terbaik.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <Suspense
                        fallback={
                            <aside className="w-full lg:w-64 shrink-0">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
                                    <div className="h-5 w-20 bg-slate-200 rounded-full mb-4" />
                                    <div className="space-y-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="h-4 bg-slate-100 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        }
                    >
                        <CatalogSidebar
                            categories={categories}
                            selectedCategories={selectedCategories}
                        />
                    </Suspense>

                    {/* Main content */}
                    <div className="flex-grow min-w-0">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <p className="text-sm text-slate-500">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-900">
                                    {products.length}
                                </span>{" "}
                                produk
                                {selectedCategories.length > 0 && (
                                    <span>
                                        {" "}
                                        dari {selectedCategories.length} kategori terpilih
                                    </span>
                                )}
                            </p>
                            <CatalogSort currentSort={currentSort} />
                        </div>

                        {/* Product Grid */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="font-heading font-semibold text-slate-900 text-lg mb-2">
                                    Tidak ada produk ditemukan
                                </h3>
                                <p className="text-slate-500 max-w-sm">
                                    Coba ubah filter kategori atau kata kunci pencarian Anda.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
