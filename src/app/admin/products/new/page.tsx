import { getCategories } from "../actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">
                    Tambah Produk Baru
                </h1>
                <p className="text-slate-500 mt-1">
                    Isi detail produk untuk menambahkannya ke katalog.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <ProductForm categories={categories} />
            </div>
        </div>
    );
}
