"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createProduct, updateProduct } from "@/app/admin/products/actions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    sku: z.string().min(1, "SKU wajib diisi"),
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    price: z.number().min(0, "Harga minimal 0"),
    stockStatus: z.boolean(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductFormProps {
    categories: Category[];
    defaultValues?: FormValues & { id: string };
}

export function ProductForm({ categories, defaultValues }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const isEditing = !!defaultValues?.id;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: defaultValues ?? {
            name: "",
            sku: "",
            categoryId: "",
            price: 0,
            stockStatus: true,
            description: "",
            imageUrl: "",
            isFeatured: false,
        },
    });

    const sku = watch("sku");
    const stockStatus = watch("stockStatus");
    const isFeatured = watch("isFeatured");
    const imageUrl = watch("imageUrl");

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, String(value));
            });

            if (isEditing && defaultValues) {
                await updateProduct(defaultValues.id, formData);
            } else {
                await createProduct(formData);
            }

            router.push("/admin/products");
            router.refresh();
        } catch {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Produk *</Label>
                    <Input id="name" {...register("name")} placeholder="Pulpen Pilot G-2" />
                    {errors.name && (
                        <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" {...register("sku")} placeholder="PLT-G2-BK" />
                    {errors.sku && (
                        <p className="text-xs text-red-500">{errors.sku.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="categoryId">Kategori *</Label>
                    <Select
                        value={watch("categoryId")}
                        onValueChange={(v) => setValue("categoryId", v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && (
                        <p className="text-xs text-red-500">{errors.categoryId.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Harga (Rp) *</Label>
                    <Input
                        id="price"
                        type="number"
                        {...register("price")}
                        placeholder="15000"
                    />
                    {errors.price && (
                        <p className="text-xs text-red-500">{errors.price.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Deskripsi produk..."
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label>Gambar Produk</Label>
                <ImageUpload
                    value={imageUrl}
                    sku={sku}
                    onChange={(url) => setValue("imageUrl", url)}
                />
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <Switch
                        id="stockStatus"
                        checked={stockStatus}
                        onCheckedChange={(v) => setValue("stockStatus", v)}
                    />
                    <Label htmlFor="stockStatus">Stok Tersedia</Label>
                </div>

                <div className="flex items-center gap-3">
                    <Switch
                        id="isFeatured"
                        checked={isFeatured}
                        onCheckedChange={(v) => setValue("isFeatured", v)}
                    />
                    <Label htmlFor="isFeatured">Produk Unggulan</Label>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/products")}
                >
                    Batal
                </Button>
            </div>
        </form>
    );
}
