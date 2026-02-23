export interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number; // Using number for representation, Prisma uses Decimal
    stockStatus: boolean;
    imageUrl: string | null;
    isFeatured: boolean;
    category?: Category;
    createdAt: Date;
    updatedAt: Date;
}

export interface PriceLog {
    id: string;
    productId: string;
    oldPrice: number;
    newPrice: number;
    changedBy: string;
    reason: string | null;
    createdAt: Date;
}

export interface Inquiry {
    id: string;
    productId: string | null;
    productName: string;
    customerPhone: string | null;
    source: string;
    createdAt: Date;
    product?: Pick<Product, "id" | "name" | "sku"> | null;
}

export type SortOption = "newest" | "price-asc" | "price-desc";
