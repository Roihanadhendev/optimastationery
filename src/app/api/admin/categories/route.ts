import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/categories
 * Returns all categories for admin selection.
 */
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            categories: categories.map((c: { id: string; name: string; slug: string }) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
            })),
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
