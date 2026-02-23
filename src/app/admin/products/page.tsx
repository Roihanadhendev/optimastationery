import { getProducts, getCategories } from "./actions";
import { ProductTable } from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        category?: string;
        page?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.search || "";
    const categoryId = params.category || "";

    const [{ products, totalPages }, categories] = await Promise.all([
        getProducts({ search, categoryId, page }),
        getCategories(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">
                    Manajemen Produk
                </h1>
                <p className="text-slate-500 mt-1">
                    Kelola semua produk Optima Stationery.
                </p>
            </div>

            <ProductTable
                initialProducts={products}
                categories={categories}
                totalPages={totalPages}
                currentPage={page}
                currentSearch={search}
                currentCategory={categoryId}
            />
        </div>
    );
}
