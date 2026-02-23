import { notFound } from "next/navigation";
import { getProductById, getCategories } from "../../actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        getProductById(id),
        getCategories(),
    ]);

    if (!product) notFound();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">
                    Edit Produk
                </h1>
                <p className="text-slate-500 mt-1">
                    Perbarui detail produk &quot;{product.name}&quot;.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <ProductForm
                    categories={categories}
                    defaultValues={{
                        id: product.id,
                        name: product.name,
                        sku: product.sku,
                        categoryId: product.categoryId,
                        price: product.price,
                        stockStatus: product.stockStatus,
                        description: product.description ?? "",
                        imageUrl: product.imageUrl ?? "",
                        isFeatured: product.isFeatured,
                    }}
                />
            </div>
        </div>
    );
}
