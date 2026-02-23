"use server";

import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";
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
    const searchFilter = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { sku: { contains: search, mode: "insensitive" as const } },
            ],
        }
        : {};

    const categoryFilter = categoryId ? { categoryId } : {};

    const where = { ...searchFilter, ...categoryFilter };

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

    type PrismaProduct = {
        id: string;
        name: string;
        sku: string;
        slug: string;
        categoryId: string | null;
        price: { toString: () => string } | number | string;
        stockStatus: boolean;
        description: string | null;
        imageUrl: string | null;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
        category: { id: string; name: string; slug: string } | null;
    };

    return {
        products: products.map((p: PrismaProduct) => ({
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

export async function createProduct(formData: FormData): Promise<{ success: boolean }> {
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

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean }> {
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

export async function deleteProduct(id: string): Promise<{ success: boolean }> {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
}

export async function bulkUpdatePrices(
    productIds: string[],
    adjustmentType: "percentage" | "fixed",
    adjustmentValue: number,
    reason: string
): Promise<{ success: boolean }> {
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

export async function getProductById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!p) return null;

    return {
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        price: Number(p.price),
        stockStatus: p.stockStatus,
        imageUrl: p.imageUrl,
        isFeatured: p.isFeatured,
        category: p.category
            ? {
                id: p.category.id,
                name: p.category.name,
                slug: p.category.slug,
                createdAt: p.category.createdAt,
                updatedAt: p.category.updatedAt
            }
            : undefined,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}
