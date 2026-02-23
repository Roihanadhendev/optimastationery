import { ProductGridSkeleton } from "@/components/catalog/ProductSkeleton";

export default function CatalogLoading() {
    return (
        <section className="bg-slate-50 min-h-screen">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-2xl animate-pulse">
                        <div className="h-9 w-64 bg-slate-200 rounded-full mb-3" />
                        <div className="h-5 w-96 bg-slate-100 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-pulse">
                            <div className="h-5 w-20 bg-slate-200 rounded-full mb-4" />
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-slate-200 rounded" />
                                        <div className="h-4 flex-1 bg-slate-100 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <div className="flex-grow min-w-0">
                        {/* Toolbar Skeleton */}
                        <div className="flex items-center justify-between mb-6 animate-pulse">
                            <div className="h-4 w-32 bg-slate-200 rounded-full" />
                            <div className="h-10 w-40 bg-slate-200 rounded-xl" />
                        </div>

                        <ProductGridSkeleton count={8} />
                    </div>
                </div>
            </div>
        </section>
    );
}
