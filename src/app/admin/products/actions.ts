"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1, "Nama produk wajib diisi"),
    sku: z.string().min(1, "SKU wajib diisi"),
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    price: z.coerce.number().min(0, "Harga harus lebih dari 0"),
    stockStatus: z.boolean(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    isFeatured: z.boolean().optional(),
});

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function getProducts({
    search,
    categoryId,
    page = 1,
    pageSize = 10,
}: {
    search?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
}) {
    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
        ];
    }

    if (categoryId) {
        where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products: products.map((p) => ({
            ...p,
            price: Number(p.price),
        })),
        total,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function getCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createProduct(formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const parsed = productSchema.parse({
        ...raw,
        stockStatus: raw.stockStatus === "true",
        isFeatured: raw.isFeatured === "true",
    });

    await prisma.product.create({
        data: {
            ...parsed,
            slug: slugify(parsed.name),
            description: parsed.description || null,
            imageUrl: parsed.imageUrl || null,
            isFeatured: parsed.isFeatured ?? false,
        },
    });

    revalidatePath("/admin/products");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    const raw = Object.fromEntries(formData.entries());
    const parsed = productSchema.parse({
        ...raw,
        stockStatus: raw.stockStatus === "true",
        isFeatured: raw.isFeatured === "true",
    });

    const existing = await prisma.product.findUnique({ where: { id } });

    if (existing && Number(existing.price) !== parsed.price) {
        await prisma.priceLog.create({
            data: {
                productId: id,
                oldPrice: existing.price,
                newPrice: parsed.price,
            },
        });
    }

    await prisma.product.update({
        where: { id },
        data: {
            ...parsed,
            slug: slugify(parsed.name),
            description: parsed.description || null,
            imageUrl: parsed.imageUrl || null,
            isFeatured: parsed.isFeatured ?? false,
        },
    });

    revalidatePath("/admin/products");
    return { success: true };
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
}

export async function bulkUpdatePrices(
    productIds: string[],
    adjustmentType: "percentage" | "fixed",
    adjustmentValue: number,
    reason: string
) {
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    for (const product of products) {
        const oldPrice = Number(product.price);
        let newPrice: number;

        if (adjustmentType === "percentage") {
            newPrice = oldPrice * (1 + adjustmentValue / 100);
        } else {
            newPrice = oldPrice + adjustmentValue;
        }

        newPrice = Math.max(0, Math.round(newPrice / 100) * 100);

        await prisma.priceLog.create({
            data: {
                productId: product.id,
                oldPrice: oldPrice,
                newPrice: newPrice,
                reason,
            },
        });

        await prisma.product.update({
            where: { id: product.id },
            data: { price: newPrice },
        });
    }

    revalidatePath("/admin/products");
    return { success: true };
}

export async function getProductById(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!product) return null;

    return {
        ...product,
        price: Number(product.price),
    };
}
