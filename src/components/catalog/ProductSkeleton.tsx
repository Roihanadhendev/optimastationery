export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 w-16 bg-slate-200 rounded-full" />

                {/* Title */}
                <div className="space-y-1.5">
                    <div className="h-4 w-full bg-slate-200 rounded-full" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <div className="h-3 w-full bg-slate-100 rounded-full" />
                    <div className="h-3 w-5/6 bg-slate-100 rounded-full" />
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                        <div className="h-5 w-24 bg-slate-200 rounded-full" />
                        <div className="h-2.5 w-16 bg-slate-100 rounded-full" />
                    </div>
                    <div className="h-8 w-16 bg-slate-200 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
