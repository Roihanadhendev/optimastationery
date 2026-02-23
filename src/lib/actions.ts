"use server";

import { prisma } from "@/lib/prisma";
import type { SortOption } from "@/types";

export async function getCategories() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
    }));
}

export async function getProducts({
    categories,
    sort = "newest",
    search,
}: {
    categories?: string[];
    sort?: SortOption;
    search?: string;
}) {
    const orderBy = (() => {
        switch (sort) {
            case "price-asc":
                return { price: "asc" as const };
            case "price-desc":
                return { price: "desc" as const };
            case "newest":
            default:
                return { createdAt: "desc" as const };
        }
    })();

    const where: Record<string, unknown> = {};

    if (categories && categories.length > 0) {
        where.category = { slug: { in: categories } };
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
    });

    return products.map((p) => ({
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
            ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
            : undefined,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));
}
