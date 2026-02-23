export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    stockStatus: boolean;
    imageUrl: string | null;
    isFeatured: boolean;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

export interface PriceLog {
    id: string;
    productId: string;
    oldPrice: number;
    newPrice: number;
    changedBy: string;
    reason: string | null;
    createdAt: string;
}

export interface Inquiry {
    id: string;
    productId: string | null;
    productName: string;
    customerPhone: string | null;
    source: string;
    createdAt: string;
    product?: Pick<Product, "id" | "name" | "sku"> | null;
}

export type SortOption = "newest" | "price-asc" | "price-desc";
