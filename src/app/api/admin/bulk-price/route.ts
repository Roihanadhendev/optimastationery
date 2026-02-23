import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { roundPrice } from "@/lib/utils";

/**
 * POST /api/admin/bulk-price
 *
 * Body:
 * {
 *   categoryId: string;
 *   mode: "percentage" | "fixed";
 *   value: number;           // e.g., 10 for 10%, or 5000 for IDR 5000
 *   direction: "increase" | "decrease";
 *   roundTo: 100 | 500;
 *   preview: boolean;        // if true, return dry-run results
 * }
 */
export async function POST(request: NextRequest) {
    try {
        // Basic auth check — in production, replace with proper auth middleware
        const authHeader = request.headers.get("x-admin-role");
        if (authHeader !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized. Only ADMIN role can access this endpoint." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            categoryId,
            mode,
            value,
            direction,
            roundTo = 100,
            preview = false,
        } = body;

        // Validation
        if (!categoryId || !mode || value === undefined || !direction) {
            return NextResponse.json(
                { error: "Missing required fields: categoryId, mode, value, direction" },
                { status: 400 }
            );
        }

        if (!["percentage", "fixed"].includes(mode)) {
            return NextResponse.json(
                { error: "Mode must be 'percentage' or 'fixed'" },
                { status: 400 }
            );
        }

        if (!["increase", "decrease"].includes(direction)) {
            return NextResponse.json(
                { error: "Direction must be 'increase' or 'decrease'" },
                { status: 400 }
            );
        }

        if (typeof value !== "number" || value <= 0) {
            return NextResponse.json(
                { error: "Value must be a positive number" },
                { status: 400 }
            );
        }

        // Fetch products in the selected category
        const products = await prisma.product.findMany({
            where: { categoryId },
            include: { category: true },
        });

        if (products.length === 0) {
            return NextResponse.json(
                { error: "No products found in this category" },
                { status: 404 }
            );
        }

        // Calculate new prices
        type PrismaProduct = {
            id: string;
            name: string;
            sku: string;
            price: { toString: () => string } | number | string;
        };

        const priceChanges = products.map((product: PrismaProduct) => {
            const currentPrice = Number(product.price);
            let delta: number;

            if (mode === "percentage") {
                delta = currentPrice * (value / 100);
            } else {
                delta = value;
            }

            const rawNewPrice =
                direction === "increase"
                    ? currentPrice + delta
                    : currentPrice - delta;

            const newPrice = roundPrice(Math.max(0, rawNewPrice), roundTo);

            return {
                id: product.id,
                name: product.name,
                sku: product.sku,
                currentPrice,
                newPrice,
                difference: newPrice - currentPrice,
            };
        });

        // ── DRY RUN: return preview only ──
        if (preview) {
            return NextResponse.json({
                success: true,
                preview: true,
                changes: priceChanges,
                summary: {
                    totalProducts: priceChanges.length,
                    categoryName: products[0]?.category?.name || "Unknown",
                    mode,
                    value,
                    direction,
                    roundTo,
                },
            });
        }

        // ── EXECUTE: atomic batch update using $transaction ──
        type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

        type PriceChange = {
            id: string;
            currentPrice: number;
            newPrice: number;
        };

        const result = await prisma.$transaction(async (tx: TxClient) => {
            const updatePromises = priceChanges.map(async (change: PriceChange) => {
                // Update the product price
                await tx.product.update({
                    where: { id: change.id },
                    data: { price: change.newPrice },
                });

                // Log the price change
                await tx.priceLog.create({
                    data: {
                        productId: change.id,
                        oldPrice: change.currentPrice,
                        newPrice: change.newPrice,
                        changedBy: "ADMIN",
                        reason: `Bulk ${direction} by ${mode === "percentage" ? value + "%" : "IDR " + value.toLocaleString("id-ID")} | Rounded to nearest ${roundTo}`,
                    },
                });
            });

            await Promise.all(updatePromises);
            return { updatedCount: priceChanges.length };
        });

        return NextResponse.json({
            success: true,
            preview: false,
            message: `Successfully updated ${result.updatedCount} products.`,
            changes: priceChanges,
        });
    } catch (error) {
        console.error("Bulk price update error:", error);
        return NextResponse.json(
            { error: "Internal server error during bulk price update." },
            { status: 500 }
        );
    }
}
