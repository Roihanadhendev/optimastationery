import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Generate a WhatsApp deep link for product inquiry.
 */
export function generateWhatsAppLink(productName: string, sku: string): string {
    const phoneNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "628XXXXXXXXXX";
    const message = `Halo Optima, saya mau tanya stok ${productName} (SKU: ${sku}).`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Format a number as Indonesian Rupiah.
 */
export function formatRupiah(price: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Round a price to the nearest value (e.g., 100 or 500 IDR).
 */
export function roundPrice(price: number, nearest: number = 100): number {
    return Math.round(price / nearest) * nearest;
}
