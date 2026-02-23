"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function logInquiry(data: {
    productId?: string;
    productName: string;
    customerPhone?: string;
}) {
    await prisma.inquiry.create({
        data: {
            productId: data.productId || null,
            productName: data.productName,
            customerPhone: data.customerPhone || null,
            source: "whatsapp",
        },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
}

export async function getInquiries({
    page = 1,
    pageSize = 20,
}: {
    page?: number;
    pageSize?: number;
} = {}) {
    const [inquiries, total] = await Promise.all([
        prisma.inquiry.findMany({
            include: { product: { select: { id: true, name: true, sku: true } } },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.inquiry.count(),
    ]);

    return {
        inquiries,
        total,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function getDashboardStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalProducts, outOfStock, totalLeads] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { stockStatus: false } }),
        prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]);

    return { totalProducts, outOfStock, totalLeads };
}
