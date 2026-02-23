"use server";

import { prisma } from "@/lib/prisma";
import type { SortOption, Category, Product } from "@/types";

export async function getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    type PrismaCategory = {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
    };

    return categories.map((c: PrismaCategory) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
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
}): Promise<Product[]> {
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

    const categoryFilter = categories && categories.length > 0
        ? { category: { slug: { in: categories } } }
        : {};

    const searchFilter = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { sku: { contains: search, mode: "insensitive" as const } },
            ],
        }
        : {};

    const where = { ...categoryFilter, ...searchFilter };

    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
    });

    type PrismaProduct = {
        id: string;
        categoryId: string;
        name: string;
        slug: string;
        sku: string;
        description: string | null;
        price: { toString: () => string } | number | string;
        stockStatus: boolean;
        imageUrl: string | null;
        isFeatured: boolean;
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    };

    return products.map((p: PrismaProduct) => ({
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
    }));
}
